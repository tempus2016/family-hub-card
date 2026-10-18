import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles, tickStyles } from '../styles/shared.js';
import { groupTasks, dayPart } from '../data/day-parts.js';
import { progressOf } from '../data/tasks.js';
import { TickController, renderTaskRow } from './tick-controller.js';
import { t } from '../i18n.js';

/**
 * Skylight's task board: one column per person, tasks filed by time of day.
 *
 * Deliberately diverges from Skylight in two places. The tick box stays on the
 * left, because every other box in this card is on the left. And every group
 * stays visible all day, dimmed once its window has passed, rather than
 * appearing only when its period arrives — a wall-mounted planner exists to
 * show what is coming.
 */

const ORDER = ['morning', 'afternoon', 'evening', 'chores'];

/** Groups in day order, dropping any that are empty. */
export function visibleGroups(groups, lang = 'en') {
  return ORDER
    .filter((key) => (groups[key] || []).length > 0)
    .map((key) => ({ key, label: t(lang, key), tasks: groups[key] }));
}

export class FamilyHubTasks extends LitElement {
  static properties = {
    model: { attribute: false },
    now: { attribute: false },
    tz: { attribute: false },
    lang: { attribute: false },
    readOnly: { attribute: false },
    confirmWindow: { attribute: false },
    isToday: { attribute: false },
  };

  static styles = [
    sharedStyles,
    tickStyles,
    css`
      .cols { display: grid; grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)); gap: 15px; align-items: start; }
      .col { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 15px; border-top: 3px solid var(--pc); min-width: 0; }
      .who { display: flex; align-items: center; gap: 10px; }
      .av { width: 38px; height: 38px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; position: relative; }
      .av img { width: 100%; height: 100%; object-fit: cover; }
      .av ha-icon { --mdc-icon-size: 22px; }
      .col.alldone .av::after { content: '\\2713'; position: absolute; right: -2px; bottom: -2px; width: 16px; height: 16px; border-radius: 50%; background: var(--fh-surface); color: var(--pc); font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 2px var(--pc); }
      .nm { font-weight: 600; font-size: 19px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .count { margin-left: auto; font-family: var(--fh-mono); color: var(--pc); font-weight: 600; flex-shrink: 0; }

      .bar { height: 4px; border-radius: 2px; background: var(--fh-chip); margin: 10px 0 16px; overflow: hidden; }
      .bar span { display: block; height: 100%; background: var(--pc); }

      .grp { margin-bottom: 14px; }
      .grp.past { opacity: 0.45; }
      .grp-l { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--fh-text-faint); margin-bottom: 6px; font-weight: 600; }
      .chore { padding: 3px 0; }
      .none { font-size: 15px; color: var(--fh-text-dim); padding: 9px 0; }
      .alldone .none { color: var(--pc); font-weight: 600; }
    `,
  ];

  constructor() {
    super();
    this._cols = 4;
    this.isToday = true;
    this.lang = 'en';
    this.ticks = new TickController(this);
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  flushPending() {
    this.ticks.flush();
  }

  render() {
    if (!this.model) return nothing;
    // Another day has no current period, so nothing on it is "past".
    const nowPart = this.isToday ? dayPart(this.now || new Date(), this.tz || 'UTC') : null;
    const people = this.model.people.filter((p) => !p.shared);
    return html`
      <div class="cols" style="--cols:${Math.min(this._cols, people.length || 1)}">
        ${people.map((p) => this._column(p, nowPart))}
      </div>
    `;
  }

  _avatar(p) {
    if (p.picture) return html`<div class="av"><img src=${p.picture} alt="" /></div>`;
    if (p.icon) return html`<div class="av"><ha-icon icon=${p.icon}></ha-icon></div>`;
    return html`<div class="av">${p.initials}</div>`;
  }

  _column(p, nowPart) {
    const { done, total, pct } = progressOf(p);
    const groups = visibleGroups(groupTasks(p, this.tz || 'UTC'), this.lang);
    const allDone = total > 0 && done === total;
    return html`
      <div class="col ${allDone ? 'alldone' : ''}" style="--pc:${p.color}">
        <div class="who">
          ${this._avatar(p)}
          <div class="nm">${p.name}</div>
          <div class="count">${done}/${total}</div>
        </div>
        <div class="bar"><span style="width:${pct}%"></span></div>
        ${(p.failures || []).length
          ? html`<div class="notice">${t(this.lang, 'cant_read', { entities: p.failures.join(', ') })}</div>`
          : nothing}
        ${groups.length
          ? groups.map((g) => this._group(p, g, nowPart))
          : html`<div class="none">${allDone ? t(this.lang, 'all_done') : t(this.lang, 'no_tasks')}</div>`}
      </div>
    `;
  }

  /**
   * A period whose window has passed is dimmed, not hidden. `chores` has no
   * time of day, so it is never treated as past.
   */
  _group(p, g, nowPart) {
    const past = nowPart !== null && g.key !== 'chores' && ORDER.indexOf(g.key) < ORDER.indexOf(nowPart);
    return html`
      <div class="grp ${past ? 'past' : ''}">
        <div class="grp-l">${g.label}</div>
        ${g.tasks.map((task) => renderTaskRow(this.ticks, p, task))}
      </div>
    `;
  }
}

customElements.define('family-hub-tasks', FamilyHubTasks);
