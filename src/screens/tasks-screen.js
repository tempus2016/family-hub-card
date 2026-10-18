import { LitElement, html, css, nothing } from 'lit';
import { shared, personStyle } from '../styles/theme.js';
import { groupTasks, dayPart } from '../data/day-parts.js';
import { progressOf } from '../data/tasks.js';
import { TickController, renderTick, renderBadge } from '../views/tick-controller.js';
import { t } from '../i18n.js';

const PERIODS = [
  ['morning', 'mdi:weather-sunset-up'],
  ['afternoon', 'mdi:white-balance-sunny'],
  ['evening', 'mdi:weather-night'],
  ['chores', 'mdi:broom'],
];

/**
 * Skylight's task board: one tinted column per person, four period rings,
 * then hero tiles the child taps. People with no points (adults, usually)
 * get the denser one-line tiles Skylight uses on its smaller screens.
 */
export class FamilyHubTasksScreen extends LitElement {
  static properties = {
    model: { attribute: false },
    now: { attribute: false },
    tz: { attribute: false },
    lang: { attribute: false },
    scheme: { attribute: false },
    isToday: { attribute: false },
    hideCompleted: { attribute: false },
    confirmWindow: { attribute: false },
    readOnly: { attribute: false },
  };

  static styles = [
    shared,
    css`
      .cols { display: grid; grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)); gap: 14px; align-items: start; }
      .pcol { background: var(--tint-soft); border-radius: var(--fh-radius); padding: 16px 14px 14px; }
      .ph { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items: center; }
      .ph .nm { font-family: var(--fh-serif); font-size: 24px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ph .pills { grid-column: 2; display: flex; gap: 8px; flex-wrap: wrap; }
      .mini { background: var(--tint); border-radius: 999px; padding: 4px 10px; font-size: 12.5px; font-weight: 500; display: inline-flex; gap: 6px; align-items: center; }
      .ring { width: 12px; height: 12px; border-radius: 50%; background: conic-gradient(var(--pc) var(--pct), var(--tint-strong) 0); }
      .periods { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 14px 0 6px; }
      .per { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 11px; color: var(--fh-text-2); }
      .per .c { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: var(--fh-page); box-shadow: inset 0 0 0 2px var(--tint-strong); position: relative; color: var(--pc); }
      .per .c ha-icon { --mdc-icon-size: 22px; }
      .per .c::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(var(--pc) var(--pct, 0%), transparent 0); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px)); mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px)); }
      .per.faded { opacity: .45; }
      .per.now { color: var(--fh-text); font-weight: 600; }
      .tile { background: var(--tint); border-radius: 16px; padding: 12px 12px 10px; margin-bottom: 8px; display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 6px; }
      .tile .hero { grid-column: 1 / -1; text-align: center; padding: 4px 0 6px; color: var(--pc); }
      .tile .hero ha-icon { --mdc-icon-size: 44px; }
      .tile .n { font-weight: 600; font-size: 15px; }
      .tile .stars { background: var(--fh-page); border-radius: 999px; padding: 2px 8px; font-size: 12px; display: inline-flex; gap: 4px; align-items: center; margin-top: 4px; width: max-content; }
      .tile .stars ha-icon { --mdc-icon-size: 14px; color: var(--fh-star); }
      .tile.done { background: var(--tint-strong); }
      .tile.done .n { text-decoration: line-through; opacity: .75; }
      .tile .tap { margin: -8px -8px -8px 0; }
      .tile.compact { grid-template-columns: auto 1fr auto; align-items: center; padding: 10px 12px; }
      .tile.compact .hero { grid-column: auto; padding: 0; }
      .tile.compact .hero ha-icon { --mdc-icon-size: 26px; }
      .tile .badge { grid-column: 1 / -1; }
      .toolbar { display: flex; align-items: center; gap: 12px; padding: 2px 0 14px; }
      .cols[data-cols='1'] .pcol { margin-bottom: 4px; }
    `,
  ];

  constructor() {
    super();
    this.lang = 'en';
    this.scheme = 'light';
    this.isToday = true;
    this.hideCompleted = false;
    this._cols = 4;
    this.ticks = new TickController(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const cols = w < 520 ? 1 : w < 760 ? 2 : w < 1040 ? 3 : 4;
      if (cols !== this._cols) { this._cols = cols; this.requestUpdate(); }
    });
    this._ro.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  render() {
    if (!this.model) return nothing;
    const people = this.model.people.filter((p) => !p.shared && !p.hidden);
    const nowPart = this.isToday ? dayPart(this.now || new Date(), this.tz || 'UTC') : null;
    return html`<div class="cols" style="--cols:${Math.min(this._cols, people.length || 1)}" data-cols=${this._cols}>
      ${people.map((p) => this._column(p, nowPart))}
    </div>`;
  }

  _avatar(p) {
    if (p.picture) return html`<span class="av lg"><img src=${p.picture} alt="" /></span>`;
    if (p.icon) return html`<span class="av lg"><ha-icon icon=${p.icon}></ha-icon></span>`;
    return html`<span class="av lg">${p.initials}</span>`;
  }

  _column(p, nowPart) {
    const { done, total, pct } = progressOf(p);
    const groups = groupTasks(p, this.tz || 'UTC');
    const compact = !p.points;
    const perPct = (k) => { const l = groups[k]; return l.length ? Math.round((l.filter((x) => x.done).length / l.length) * 100) : 0; };
    return html`<div class="pcol" style=${personStyle(p.color, this.scheme)}>
      <div class="ph">
        ${this._avatar(p)}
        <span class="nm">${p.name}</span>
        <div class="pills">
          <span class="mini"><span class="ring" style="--pct:${pct}%"></span>✓ ${done}/${total}</span>
          ${p.points?.balance != null ? html`<span class="mini"><ha-icon icon="mdi:star" style="--mdc-icon-size:14px;color:var(--fh-star)"></ha-icon>${p.points.balance}</span>` : nothing}
        </div>
      </div>
      <div class="periods">
        ${PERIODS.map(([k, icon]) => html`<div class="per ${k === nowPart ? 'now' : ''} ${groups[k].length ? '' : 'faded'}">
          <span class="c" style="--pct:${perPct(k)}%"><ha-icon icon=${icon}></ha-icon></span>${t(this.lang, k)}
        </div>`)}
      </div>
      ${(p.failures || []).length ? html`<div class="notice">${t(this.lang, 'cant_read', { entities: p.failures.join(', ') })}</div>` : nothing}
      ${PERIODS.filter(([k]) => groups[k].some((x) => !(this.hideCompleted && x.done))).map(([k]) => html`
        <div class="sec">${t(this.lang, k)}</div>
        ${groups[k].filter((x) => !(this.hideCompleted && x.done)).map((task) => this._tile(p, task, compact))}
      `)}
      ${total === 0 ? html`<div class="empty">${t(this.lang, 'no_tasks')}</div>` : nothing}
    </div>`;
  }

  _tile(p, task, compact) {
    const pending = this.ticks.isPending(p.id, task.id);
    const done = task.done || pending;
    return html`<div class="tile ${done ? 'done' : ''} ${compact ? 'compact' : ''}">
      <div class="hero"><ha-icon icon=${task.icon}></ha-icon></div>
      <div>
        <div class="n">${task.summary}</div>
        ${task.stars ? html`<div class="stars"><ha-icon icon="mdi:star"></ha-icon>${task.stars}</div>` : nothing}
      </div>
      ${renderTick(this.ticks, p, task)}
      ${renderBadge(this.lang, task)}
    </div>`;
  }
}

customElements.define('family-hub-tasks-screen', FamilyHubTasksScreen);
