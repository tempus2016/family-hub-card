import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles } from '../styles/shared.js';
import { groupTasks, dayPart } from '../data/day-parts.js';
import { choreProgress } from '../data/chore-progress.js';

/**
 * Skylight's task board: one column per person, tasks filed by time of day.
 *
 * Deliberately diverges from Skylight in two places. The tick box stays on the
 * left, because every other box in this card is on the left. And every group
 * stays visible all day, dimmed once its window has passed, rather than
 * appearing only when its period arrives — a wall-mounted planner exists to
 * show what is coming.
 */

const LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', chores: 'Chores' };
const ORDER = ['morning', 'afternoon', 'evening', 'chores'];

/** Groups in day order, dropping any that are empty. */
export function visibleGroups(groups) {
  return ORDER
    .filter((key) => (groups[key] || []).length > 0)
    .map((key) => ({ key, label: LABELS[key], tasks: groups[key] }));
}

export class FamilyHubTasks extends LitElement {
  static properties = {
    model: { attribute: false },
    now: { attribute: false },
    tz: { attribute: false },
    readOnly: { attribute: false },
    confirmWindow: { attribute: false },
    _pending: { state: true },
  };

  static styles = [
    sharedStyles,
    css`
      .cols { display: grid; grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)); gap: 15px; }
      .col { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 15px; border-top: 3px solid var(--pc); min-width: 0; }
      .who { display: flex; align-items: center; gap: 10px; }
      .av { width: 38px; height: 38px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .nm { font-weight: 600; font-size: 19px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .count { margin-left: auto; font-family: var(--fh-mono); color: var(--pc); font-weight: 600; flex-shrink: 0; }

      .bar { height: 4px; border-radius: 2px; background: var(--fh-chip); margin: 10px 0 16px; overflow: hidden; }
      .bar span { display: block; height: 100%; background: var(--pc); }

      .grp { margin-bottom: 14px; }
      .grp.past { opacity: 0.45; }
      .grp-l { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--fh-text-faint); margin-bottom: 6px; font-weight: 600; }

      .chore { display: flex; align-items: center; gap: 10px; font-size: 16px; color: var(--fh-chore-text); padding: 3px 0; }
      .chore .name { flex: 1; min-width: 0; }
      .chore.done .name { text-decoration: line-through; color: var(--fh-text-dim); }
      .chore.pending .name { font-style: italic; }
      .box { width: 19px; height: 19px; border-radius: 5px; background: var(--fh-chip); flex-shrink: 0; position: relative; }
      .box.done { background: var(--pc); }
      .box.done::after { content: '\\2713'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--fh-bg); font-weight: 800; }
      .ring { animation: fh-ring var(--fh-window, 3s) linear forwards; }
      @keyframes fh-ring { from { opacity: 1; } to { opacity: 0.35; } }
      .waiting { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--warning-color, #FFB84A); font-weight: 600; flex-shrink: 0; }
      .none { font-size: 15px; color: var(--fh-text-dim); padding: 9px 0; }
    `,
  ];

  constructor() {
    super();
    this._pending = new Map();
    this._cols = 4;
  }

  connectedCallback() {
    super.connectedCallback();
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
    const nowPart = dayPart(this.now || new Date(), this.tz || 'UTC');
    return html`
      <div class="cols" style="--cols:${Math.min(this._cols, this.model.people.length || 1)}">
        ${this.model.people.map((p) => this._column(p, nowPart))}
      </div>
    `;
  }

  _column(p, nowPart) {
    const { done, total, pct } = choreProgress(p);
    const groups = visibleGroups(groupTasks(p, this.tz || 'UTC'));
    return html`
      <div class="col" style="--pc:${p.color}">
        <div class="who">
          <div class="av">${p.initials}</div>
          <div class="nm">${p.name}</div>
          <div class="count">${done}/${total}</div>
        </div>
        <div class="bar"><span style="width:${pct}%"></span></div>
        ${(p.failures || []).length
          ? html`<div class="notice">Can't read ${p.failures.join(', ')}</div>`
          : nothing}
        ${groups.length
          ? groups.map((g) => this._group(p, g, nowPart))
          : html`<div class="none">No tasks</div>`}
      </div>
    `;
  }

  /**
   * A period whose window has passed is dimmed, not hidden. `chores` has no
   * time of day, so it is never treated as past.
   */
  _group(p, g, nowPart) {
    const past = g.key !== 'chores' && ORDER.indexOf(g.key) < ORDER.indexOf(nowPart);
    return html`
      <div class="grp ${past ? 'past' : ''}">
        <div class="grp-l">${g.label}</div>
        ${g.tasks.map((t) => this._task(p, t))}
      </div>
    `;
  }

  _task(p, t) {
    const key = `${p.id}:${t.id}`;
    const pending = this._pending.has(key);
    const done = t.done || pending;

    if (!t.tappable) {
      return html`
        <div class="chore ${done ? 'done' : ''} ${t.pending ? 'pending' : ''}">
          <span class="tap"><span class="box done"></span></span>
          <span class="name">${t.summary}</span>
          ${t.pending ? html`<span class="waiting">waiting</span>` : nothing}
        </div>
      `;
    }

    return html`
      <div class="chore ${done ? 'done' : ''}">
        <button
          class="tap"
          role="checkbox"
          aria-checked=${done ? 'true' : 'false'}
          aria-label=${`Complete ${t.summary} for ${p.name}`}
          @click=${() => this._tap(p.id, t.id)}
          ?disabled=${this.readOnly}
        >
          <span class="box ${done ? 'done' : ''} ${pending ? 'ring' : ''}"
            style="--fh-window:${this.confirmWindow}s"></span>
        </button>
        <span class="name">${t.summary}</span>
      </div>
    `;
  }
}

customElements.define('family-hub-tasks', FamilyHubTasks);
