import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles } from '../styles/shared.js';

export function buildTimeline(people) {
  const rows = [];
  for (const person of people) {
    for (const event of person.events || []) {
      rows.push({ time: event.allDay ? null : event.start, allDay: event.allDay, event, person });
    }
  }
  return rows.sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
    if (a.allDay) return 0;
    return a.time - b.time;
  });
}

export function nowLineIndex(timeline, now) {
  const firstTimed = timeline.findIndex((r) => !r.allDay);
  if (firstTimed === -1) return -1;
  if (now < timeline[firstTimed].time) return -1;
  let idx = timeline.length;
  for (let i = firstTimed; i < timeline.length; i += 1) {
    if (timeline[i].time > now) {
      idx = i;
      break;
    }
  }
  return idx;
}

class FamilyHubAgenda extends LitElement {
  static properties = {
    model: { attribute: false },
    now: { attribute: false },
    confirmWindow: { attribute: false },
    _pending: { state: true },
  };

  static styles = [
    sharedStyles,
    css`
      .wrap { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
      .wrap[data-narrow='true'] { grid-template-columns: 1fr; }
      .label { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fh-text-dim); margin-bottom: 8px; }
      .timeline { background: var(--fh-surface-2); border-radius: var(--fh-radius); padding: 8px 0; }
      .row { display: grid; grid-template-columns: 72px 4px 1fr; gap: 12px; align-items: start; padding: 12px 16px; }
      .bar { width: 4px; border-radius: 2px; align-self: stretch; }
      .nowline { display: flex; align-items: center; gap: 8px; padding: 0 16px; }
      .nowline .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--fh-t1-accent, #4A9EFF); }
      .nowline .rule { flex: 1; height: 2px; background: var(--fh-t1-accent, #4A9EFF); }
      .past { opacity: 0.45; }
      .person { background: var(--fh-surface-2); border-radius: var(--fh-radius); padding: 14px 16px; margin-bottom: var(--fh-gap); border-left: 4px solid var(--fh-person, #888); }
      .person-head { display: flex; align-items: center; gap: 10px; justify-content: space-between; }
      .avatar { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font-weight: 600; color: #000; }
      .chore { display: flex; align-items: center; gap: 10px; }
      .chore.done .name { text-decoration: line-through; opacity: 0.55; }
      .chore.pending .name { text-decoration: line-through; opacity: 0.4; font-style: italic; }
      .box { width: 24px; height: 24px; border-radius: 6px; border: 2px solid var(--fh-text-dim); }
      .box.filled { background: var(--fh-person, #888); border-color: transparent; }
      .ring { animation: fh-ring var(--fh-window, 3s) linear forwards; }
      @keyframes fh-ring { from { opacity: 1; } to { opacity: 0.3; } }
      .points { font-family: var(--fh-mono); font-size: 1.5rem; text-align: right; }
      .waiting { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--warning-color, #ffb84a); }
    `,
  ];

  constructor() {
    super();
    this._pending = new Map();
    this._narrow = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver(([entry]) => {
      const narrow = entry.contentRect.width < 640;
      if (narrow !== this._narrow) {
        this._narrow = narrow;
        this.requestUpdate();
      }
    });
    this._ro.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._pending.forEach((t) => clearTimeout(t.timer));
    this._pending.clear();
  }

  /**
   * The undo window is client-side and fires the service call only on expiry.
   * TaskMate's un-tick is deliberately inert, so an undo that reversed a
   * completion would work on stock lists and silently fail on TaskMate.
   */
  _tap(personId, choreId) {
    const key = `${personId}:${choreId}`;
    const existing = this._pending.get(key);
    if (existing) {
      clearTimeout(existing.timer);
      this._pending.delete(key);
      this.requestUpdate();
      return;
    }
    if (!this.confirmWindow) {
      this._fire(personId, choreId);
      return;
    }
    const timer = setTimeout(() => {
      this._pending.delete(key);
      this._fire(personId, choreId);
    }, this.confirmWindow * 1000);
    this._pending.set(key, { timer });
    this.requestUpdate();
  }

  _fire(personId, choreId) {
    this.dispatchEvent(
      new CustomEvent('chore-tap', { detail: { personId, choreId }, bubbles: true, composed: true }),
    );
    this.requestUpdate();
  }

  _fmt(date) {
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  }

  render() {
    if (!this.model) return nothing;
    const timeline = buildTimeline(this.model.people);
    const nowIdx = nowLineIndex(timeline, this.now);

    const rows = [];
    timeline.forEach((r, i) => {
      if (i === nowIdx) {
        rows.push(html`<div class="nowline"><span class="dot"></span><span class="rule"></span></div>`);
      }
      rows.push(html`
        <div class="row ${!r.allDay && r.time < this.now ? 'past' : ''}">
          <span class="time">${r.allDay ? 'All day' : this._fmt(r.time)}</span>
          <span class="bar" style="background:${r.person.color}"></span>
          <span>
            <div class="t1">${r.event.summary}</div>
            <div class="t2" style="color:${r.person.color}">
              ${r.person.name}${r.event.location ? html` · ${r.event.location}` : nothing}
            </div>
          </span>
        </div>
      `);
    });
    if (nowIdx === timeline.length) {
      rows.push(html`<div class="nowline"><span class="dot"></span><span class="rule"></span></div>`);
    }

    return html`
      <div class="wrap" data-narrow=${String(this._narrow)}>
        <div>
          <div class="label">Today</div>
          <div class="timeline">${rows.length ? rows : html`<div class="row t2">Nothing scheduled</div>`}</div>
        </div>
        <div>
          <div class="label">Chores</div>
          ${this.model.people.map((p) => this._person(p))}
        </div>
      </div>
    `;
  }

  _person(p) {
    const outstanding = (p.chores || []).filter((c) => c.status !== 'completed');
    const done = (p.chores || []).filter((c) => c.status === 'completed');
    return html`
      <div class="person" style="--fh-person:${p.color}">
        <div class="person-head">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="avatar" style="background:${p.color}">${p.initials}</span>
            <span>
              <div class="t1" style="font-size:1.25rem">${p.name}</div>
              <div class="t2">${outstanding.length} to do</div>
            </span>
          </div>
          ${this._points(p)}
        </div>
        ${outstanding.map((c) => this._chore(p, c, 'open'))}
        ${done.map((c) => this._chore(p, c, 'done'))}
        ${(p.completedToday || []).map(
          (c) => html`
            <div class="chore ${c.approved ? 'done' : 'pending'}">
              <span class="box filled"></span>
              <span class="name t2">${c.name}</span>
              ${c.approved ? nothing : html`<span class="waiting">waiting</span>`}
            </div>
          `,
        )}
      </div>
    `;
  }

  _points(p) {
    if (!p.points || p.points.balance == null) return nothing;
    const today =
      p.points.earnedToday == null
        ? nothing
        : html`<div class="t2">${p.points.earnedToday} today${
            p.points.pendingToday ? html` · ${p.points.pendingToday} pending` : nothing
          }</div>`;
    return html`
      <span style="text-align:right">
        <div class="points" style="color:${p.color}">${p.points.balance}</div>
        <div class="t2">${p.points.unit}</div>
        ${today}
      </span>
    `;
  }

  _chore(p, c, kind) {
    const key = `${p.id}:${c.id}`;
    const pending = this._pending.has(key);
    return html`
      <div class="chore ${kind === 'done' ? 'done' : ''}">
        <button
          class="tap"
          role="checkbox"
          aria-checked=${kind === 'done' || pending ? 'true' : 'false'}
          aria-label=${`Complete ${c.summary} for ${p.name}`}
          @click=${() => this._tap(p.id, c.id)}
          ?disabled=${kind === 'done'}
        >
          <span
            class="box ${pending || kind === 'done' ? 'filled' : ''} ${pending ? 'ring' : ''}"
            style="--fh-window:${this.confirmWindow}s"
          ></span>
        </button>
        <span class="name t2" style="color:var(--fh-text)">${c.summary}</span>
      </div>
    `;
  }
}

customElements.define('family-hub-agenda', FamilyHubAgenda);
