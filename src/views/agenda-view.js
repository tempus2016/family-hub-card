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

export class FamilyHubAgenda extends LitElement {
  static properties = {
    model: { attribute: false },
    now: { attribute: false },
    confirmWindow: { attribute: false },
    readOnly: { attribute: false },
    _pending: { state: true },
  };

  static styles = [
    sharedStyles,
    css`
      /* Metrics ported from mockups/c.html — .split2, .ag, .agrow, .pcard. */
      .wrap { display: grid; grid-template-columns: 1.35fr 1fr; gap: 20px; }
      .wrap[data-narrow='true'] { grid-template-columns: 1fr; }

      .ag { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 8px 18px 14px; }
      .agrow { display: flex; gap: 15px; padding: 14px 0; border-bottom: 1px solid var(--fh-rule-soft); align-items: flex-start; }
      .agrow:last-child { border-bottom: none; }
      .agt { font-family: var(--fh-mono); font-size: 16px; color: var(--fh-text-soft); width: 64px; flex-shrink: 0; padding-top: 2px; font-weight: 500; }
      .agbar { width: 4px; border-radius: 2px; background: var(--pc); align-self: stretch; flex-shrink: 0; }
      .agn { font-size: 20px; color: var(--fh-text); font-weight: 500; line-height: 1.25; }
      .agw { font-size: 14px; color: var(--pc); margin-top: 3px; font-weight: 600; }
      .past { opacity: 0.45; }
      .empty { padding: 14px 0; color: var(--fh-text-dim); font-size: 16px; }

      .now { background: var(--fh-now); height: 2px; border-radius: 1px; margin: 3px 0; position: relative; }
      .now::before { content: ''; position: absolute; left: -4px; top: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--fh-now); }

      .pcard { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 14px 15px; margin-bottom: 11px; border-left: 4px solid var(--pc); }
      .phead { display: flex; align-items: center; gap: 13px; }
      .av { width: 40px; height: 40px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .nm { font-weight: 600; font-size: 18px; }
      .nextc { font-size: 14px; color: var(--fh-text-mute); margin-top: 2px; }
      .pts { margin-left: auto; text-align: right; padding-left: 10px; }
      .pts b { display: block; font-size: 24px; color: var(--pc); font-family: var(--fh-mono); line-height: 1; }
      .pts span { font-size: 10px; color: var(--fh-text-faint); text-transform: uppercase; letter-spacing: 1px; }
      .pts .today { font-size: 12px; color: var(--fh-text-mute); margin-top: 3px; text-transform: none; letter-spacing: 0; }

      .chores { margin-top: 6px; border-top: 1px solid var(--fh-rule-soft); padding-top: 2px; }
      :host([data-readonly]) .tap { cursor: default; }
      .chore { display: flex; align-items: center; gap: 10px; font-size: 16px; color: var(--fh-chore-text); }
      .chore .name { flex: 1; min-width: 0; }
      .chore.done .name, .chore.pending .name { text-decoration: line-through; color: var(--fh-text-dim); }
      .chore.pending .name { font-style: italic; }
      .box { width: 19px; height: 19px; border-radius: 5px; background: var(--fh-chip); flex-shrink: 0; position: relative; }
      .box.filled { background: var(--pc); }
      .box.filled::after { content: '\\2713'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--fh-bg); font-weight: 800; }
      .ring { animation: fh-ring var(--fh-window, 3s) linear forwards; }
      @keyframes fh-ring { from { opacity: 1; } to { opacity: 0.35; } }
      .waiting { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--warning-color, #FFB84A); font-weight: 600; flex-shrink: 0; }
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

    this._onVisibility = () => {
      if (document.visibilityState === 'hidden') this.flushPending();
    };
    // pagehide can fire while visibilityState is still "visible", so it gets
    // its own unconditional handler.
    this._onPageHide = () => this.flushPending();
    document.addEventListener('visibilitychange', this._onVisibility);
    window.addEventListener('pagehide', this._onPageHide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
    document.removeEventListener('visibilitychange', this._onVisibility);
    window.removeEventListener('pagehide', this._onPageHide);
    // Commit rather than discard: a tablet sleeping inside the undo window
    // should not silently swallow a chore the child already ticked.
    this.flushPending();
  }

  /** Fire every queued completion immediately and clear the queue. */
  flushPending() {
    for (const p of this._pending.values()) {
      clearTimeout(p.timer);
      this._fire(p.personId, p.choreId);
    }
    this._pending.clear();
  }

  /**
   * The undo window is client-side and fires the service call only on expiry.
   * TaskMate's un-tick is deliberately inert, so an undo that reversed a
   * completion would work on stock lists and silently fail on TaskMate.
   */
  _tap(personId, choreId) {
    // Ticking only ever applies to today's list, so a paged view must not look
    // tappable and silently do nothing.
    if (this.readOnly) return;
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
    this._pending.set(key, { timer, personId, choreId });
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
      if (i === nowIdx) rows.push(html`<div class="now"></div>`);
      rows.push(html`
        <div class="agrow ${!r.allDay && r.time < this.now ? 'past' : ''}" style="--pc:${r.person.color}">
          <div class="agt">${r.allDay ? 'All day' : this._fmt(r.time)}</div>
          <div class="agbar"></div>
          <div>
            <div class="agn">${r.event.summary}</div>
            <div class="agw">
              ${r.person.name}${r.event.location ? html` · ${r.event.location}` : nothing}
            </div>
          </div>
        </div>
      `);
    });
    if (nowIdx === timeline.length) rows.push(html`<div class="now"></div>`);

    return html`
      <div class="wrap" data-narrow=${String(this._narrow)}>
        <div>
          <div class="sec-l">Today</div>
          <div class="ag">
            ${rows.length ? rows : html`<div class="empty">Nothing scheduled</div>`}
          </div>
        </div>
        <div>
          <div class="sec-l">Chores &amp; points</div>
          ${this.model.people.map((p) => this._person(p))}
        </div>
      </div>
    `;
  }

  _person(p) {
    const outstanding = (p.chores || []).filter((c) => c.status !== 'completed');
    const done = (p.chores || []).filter((c) => c.status === 'completed');
    const doneToday = p.completedToday || [];
    const hasRows = outstanding.length || done.length || doneToday.length;

    return html`
      <div class="pcard" style="--pc:${p.color}">
        <div class="phead">
          <div class="av">${p.initials}</div>
          <div>
            <div class="nm">${p.name}</div>
            <div class="nextc">${this._summary(p, outstanding)}</div>
          </div>
          ${this._points(p)}
        </div>
        ${(p.failures || []).length
          ? html`<div class="notice">Can't read ${p.failures.join(', ')}</div>`
          : nothing}
        ${hasRows
          ? html`<div class="chores">
              ${outstanding.map((c) => this._chore(p, c, 'open'))}
              ${done.map((c) => this._chore(p, c, 'done'))}
              ${doneToday.map(
                (c) => html`
                  <div class="chore ${c.approved ? 'done' : 'pending'}">
                    <span class="tap"><span class="box filled"></span></span>
                    <span class="name">${c.name}</span>
                    ${c.approved ? nothing : html`<span class="waiting">waiting</span>`}
                  </div>
                `,
              )}
            </div>`
          : nothing}
      </div>
    `;
  }

  /** The mockup's "Next: X" line, degrading sensibly when there's nothing due. */
  _summary(p, outstanding) {
    if (!p.todo) return 'No chore list';
    if (!outstanding.length) return 'All done';
    return `Next: ${outstanding[0].summary}`;
  }

  _points(p) {
    if (!p.points || p.points.balance == null) return nothing;
    return html`
      <div class="pts">
        <b>${p.points.balance}</b>
        <span>${p.points.unit}</span>
        ${p.points.earnedToday == null
          ? nothing
          : html`<div class="today">
              ${p.points.earnedToday} today${p.points.pendingToday
                ? html` · ${p.points.pendingToday} pending`
                : nothing}
            </div>`}
      </div>
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
          ?disabled=${kind === 'done' || this.readOnly}
        >
          <span
            class="box ${pending || kind === 'done' ? 'filled' : ''} ${pending ? 'ring' : ''}"
            style="--fh-window:${this.confirmWindow}s"
          ></span>
        </button>
        <span class="name">${c.summary}</span>
      </div>
    `;
  }
}

customElements.define('family-hub-agenda', FamilyHubAgenda);
