import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles } from '../styles/shared.js';

/**
 * One column per person: their day, then their chores. The Skylight layout the
 * whole product is answering, and the densest way to show four people at once.
 */

/** The time label for an event — a range when there is one, a start otherwise. */
export function eventTime(event, tz) {
  if (event.allDay) return 'All day';
  const fmt = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz,
  });
  const start = fmt.format(event.start);
  if (!event.end || +event.end === +event.start) return start;
  return `${start} – ${fmt.format(event.end)}`;
}

/**
 * One person's column.
 *
 * Chores come from two sources that overlap: the todo list, and TaskMate's
 * record of what was completed today. TaskMate drops a chore from the list the
 * moment it is ticked, so its completions have to be appended — but a stock
 * list keeps completed items, so the same chore can appear in both. Merge on
 * name to avoid showing it twice.
 *
 * A completion that only exists in TaskMate's record has no todo item behind
 * it, so it cannot be tapped — there is nothing left to update.
 */
export function columnFor(person) {
  const chores = [];
  const seen = new Set();

  for (const c of person.chores || []) {
    seen.add(c.summary);
    chores.push({
      id: c.id,
      summary: c.summary,
      done: c.status === 'completed',
      pending: false,
      tappable: c.status !== 'completed',
    });
  }

  for (const c of person.completedToday || []) {
    if (seen.has(c.name)) continue;
    seen.add(c.name);
    chores.push({
      id: c.choreId,
      summary: c.name,
      done: true,
      pending: !c.approved,
      tappable: false,
    });
  }

  chores.sort((a, b) => Number(a.done) - Number(b.done));

  return {
    person,
    chores,
    outstanding: chores.filter((c) => !c.done).length,
    hasChores: Boolean(person.todo) || chores.length > 0,
  };
}

export class FamilyHubColumns extends LitElement {
  static properties = {
    model: { attribute: false },
    tz: { attribute: false },
    readOnly: { attribute: false },
    confirmWindow: { attribute: false },
    _pending: { state: true },
  };

  static styles = [
    sharedStyles,
    css`
      /* Metrics ported from mockups/a.html — .cols, .col, .ev, .chore. */
      .cols { display: grid; grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)); gap: 15px; }
      .col { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 15px; border-top: 3px solid var(--pc); min-width: 0; }
      .who { display: flex; align-items: center; gap: 10px; margin-bottom: 13px; }
      .av { width: 38px; height: 38px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .nm { font-weight: 600; font-size: 19px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .pts { margin-left: auto; font-family: var(--fh-mono); font-size: 16px; color: var(--pc); flex-shrink: 0; }

      .ev { padding: 9px 0; }
      .ev-t { font-size: 13px; color: var(--pc); font-weight: 600; font-family: var(--fh-mono); letter-spacing: 0.3px; }
      .ev-n { font-size: 17px; color: var(--fh-chore-text); margin-top: 2px; line-height: 1.3; }
      .none { font-size: 15px; color: var(--fh-text-dim); padding: 9px 0; }

      .divider { font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; color: var(--fh-text-dim); margin: 15px 0 9px; font-weight: 600; }
      .chore { display: flex; align-items: center; gap: 10px; font-size: 16px; color: var(--fh-chore-text); }
      .chore .name { flex: 1; min-width: 0; }
      .chore.done .name { text-decoration: line-through; color: var(--fh-text-dim); }
      .chore.pending .name { font-style: italic; }
      .box { width: 19px; height: 19px; border-radius: 5px; background: var(--fh-chip); flex-shrink: 0; position: relative; }
      .box.done { background: var(--pc); }
      .box.done::after { content: '\\2713'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--fh-bg); font-weight: 800; }
      .ring { animation: fh-ring var(--fh-window, 3s) linear forwards; }
      @keyframes fh-ring { from { opacity: 1; } to { opacity: 0.35; } }
      .waiting { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--warning-color, #FFB84A); font-weight: 600; flex-shrink: 0; }
    `,
  ];

  constructor() {
    super();
    this._pending = new Map();
    this._cols = 4;
  }

  connectedCallback() {
    super.connectedCallback();
    // Columns get unreadable when squeezed, so drop the count rather than the
    // font size — one column at phone width is still a usable day view.
    this._ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const cols = w < 520 ? 1 : w < 760 ? 2 : w < 1040 ? 3 : 4;
      if (cols !== this._cols) {
        this._cols = cols;
        this.requestUpdate();
      }
    });
    this._ro.observe(this);
    this._onPageHide = () => this.flushPending();
    window.addEventListener('pagehide', this._onPageHide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
    window.removeEventListener('pagehide', this._onPageHide);
    this.flushPending();
  }

  /** Commit queued completions rather than discarding them. */
  flushPending() {
    for (const p of this._pending.values()) {
      clearTimeout(p.timer);
      this._fire(p.personId, p.choreId);
    }
    this._pending.clear();
  }

  _tap(personId, choreId) {
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

  render() {
    if (!this.model) return nothing;
    const tz = this.tz || 'UTC';
    return html`
      <div class="cols" style="--cols:${Math.min(this._cols, this.model.people.length || 1)}">
        ${this.model.people.map((p) => this._column(columnFor(p), tz))}
      </div>
    `;
  }

  _column(col, tz) {
    const p = col.person;
    return html`
      <div class="col" style="--pc:${p.color}">
        <div class="who">
          <div class="av">${p.initials}</div>
          <div class="nm">${p.name}</div>
          ${p.points && p.points.balance != null
            ? html`<div class="pts">${p.points.balance}</div>`
            : nothing}
        </div>

        ${(p.failures || []).length
          ? html`<div class="notice">Can't read ${p.failures.join(', ')}</div>`
          : nothing}

        ${p.events.length
          ? p.events.map(
              (e) => html`<div class="ev">
                <div class="ev-t">${eventTime(e, tz)}</div>
                <div class="ev-n">${e.summary}</div>
              </div>`,
            )
          : html`<div class="none">Nothing on</div>`}

        ${col.hasChores
          ? html`
              <div class="divider">
                Chores${col.outstanding ? ` · ${col.outstanding} to do` : ' · all done'}
              </div>
              ${col.chores.map((c) => this._chore(p, c))}
            `
          : nothing}
      </div>
    `;
  }

  _chore(p, c) {
    const key = `${p.id}:${c.id}`;
    const pending = this._pending.has(key);
    const done = c.done || pending;

    if (!c.tappable) {
      return html`
        <div class="chore ${done ? 'done' : ''} ${c.pending ? 'pending' : ''}">
          <span class="tap"><span class="box done"></span></span>
          <span class="name">${c.summary}</span>
          ${c.pending ? html`<span class="waiting">waiting</span>` : nothing}
        </div>
      `;
    }

    return html`
      <div class="chore ${done ? 'done' : ''}">
        <button
          class="tap"
          role="checkbox"
          aria-checked=${done ? 'true' : 'false'}
          aria-label=${`Complete ${c.summary} for ${p.name}`}
          @click=${() => this._tap(p.id, c.id)}
          ?disabled=${this.readOnly}
        >
          <span class="box ${done ? 'done' : ''} ${pending ? 'ring' : ''}"
            style="--fh-window:${this.confirmWindow}s"></span>
        </button>
        <span class="name">${c.summary}</span>
      </div>
    `;
  }
}

customElements.define('family-hub-columns', FamilyHubColumns);
