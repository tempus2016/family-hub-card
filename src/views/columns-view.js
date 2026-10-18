import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles, tickStyles } from '../styles/shared.js';
import { linkChores } from '../data/link-chores.js';
import { tasksOf } from '../data/tasks.js';
import { TickController, renderTick, renderBadge, renderTaskRow } from './tick-controller.js';
import { t } from '../i18n.js';
import { formatTime } from '../format.js';

/**
 * One column per person: their day, then their chores. The Skylight layout the
 * whole product is answering, and the densest way to show four people at once.
 */

/** The time label for an event — a range when there is one, a start otherwise. */
export function eventTime(event, tz, locale = { time_format: '24' }) {
  if (event.allDay) return t(locale?.language?.split('-')[0] || 'en', 'all_day');
  const start = formatTime(event.start, locale, tz);
  if (!event.end || +event.end === +event.start) return start;
  return `${start} – ${formatTime(event.end, locale, tz)}`;
}

/**
 * One person's column. The task list is the model's merged one; this decides
 * which of those tasks sit on an event row and which remain in the list.
 */
export function columnFor(person, inlineChores = false, hideChores = false) {
  const tasks = tasksOf(person);

  const { pairs, matched } = inlineChores
    ? linkChores(person.events, tasks)
    : { pairs: (person.events || []).map((event) => ({ event, chore: null })), matched: new Set() };

  const remaining = inlineChores ? tasks.filter((c) => !matched.has(c)) : tasks;

  // With the Tasks tab showing, the chores live there instead; rendering them
  // here too would put every chore on screen twice.
  const listed = hideChores ? [] : remaining;

  // With chores inline, the block below is only ever the leftovers, so an empty
  // one is dropped entirely. Keeping it would print "Chores · all done" over a
  // person who has done nothing — their chores merely moved onto their events.
  const hasChores = hideChores
    ? false
    : (inlineChores ? listed.length > 0 : Boolean(person.todo) || listed.length > 0);

  return {
    person,
    events: pairs,
    chores: listed,
    outstanding: listed.filter((c) => !c.done).length,
    hasChores,
  };
}

export class FamilyHubColumns extends LitElement {
  static properties = {
    model: { attribute: false },
    tz: { attribute: false },
    lang: { attribute: false },
    locale: { attribute: false },
    readOnly: { attribute: false },
    confirmWindow: { attribute: false },
    inlineChores: { attribute: false },
    hideChores: { attribute: false },
    _expanded: { state: true },
  };

  static styles = [
    sharedStyles,
    tickStyles,
    css`
      /* Metrics ported from mockups/a.html — .cols, .col, .ev, .chore. */
      /* align-items: start lets a person with nothing on sit short instead of
         stretching an empty column to the tallest one. */
      .cols { display: grid; grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)); gap: 15px; align-items: start; }
      .col { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 15px; border-top: 3px solid var(--pc); min-width: 0; }
      .who { display: flex; align-items: center; gap: 10px; margin-bottom: 13px; }
      .av { width: 38px; height: 38px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; position: relative; }
      .av img { width: 100%; height: 100%; object-fit: cover; }
      .av ha-icon { --mdc-icon-size: 22px; }
      .col.alldone .av::after { content: '\\2713'; position: absolute; right: -2px; bottom: -2px; width: 16px; height: 16px; border-radius: 50%; background: var(--fh-surface); color: var(--pc); font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 2px var(--pc); }
      .nm { font-weight: 600; font-size: 19px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .pts { margin-left: auto; font-family: var(--fh-mono); font-size: 16px; color: var(--pc); flex-shrink: 0; text-align: right; line-height: 1.1; }
      .pts span { display: block; font-size: 10px; color: var(--fh-text-faint); text-transform: uppercase; letter-spacing: 1px; font-family: var(--fh-font); }

      .ev { padding: 9px 0; cursor: pointer; }
      .ev-t { font-size: 13px; color: var(--pc); font-weight: 600; font-family: var(--fh-mono); letter-spacing: 0.3px; }
      .ev-n { font-size: 17px; color: var(--fh-chore-text); margin-top: 2px; line-height: 1.3; display: flex; align-items: flex-start; }
      .ev-n .ev-t2 { min-width: 0; }
      .ev-n .tap.inline { margin-top: -11px; }
      .detail { margin-top: 6px; font-size: 13px; color: var(--fh-text-mute); line-height: 1.45; white-space: pre-line; }
      .none { font-size: 15px; color: var(--fh-text-dim); padding: 9px 0; }

      .divider { font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; color: var(--fh-text-dim); margin: 15px 0 9px; font-weight: 600; }
      .col.alldone .divider { color: var(--pc); }
    `,
  ];

  constructor() {
    super();
    this._cols = 4;
    this.lang = 'en';
    this._expanded = new Set();
    this.ticks = new TickController(this);
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  flushPending() {
    this.ticks.flush();
  }

  _toggle(id) {
    const next = new Set(this._expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._expanded = next;
  }

  render() {
    if (!this.model) return nothing;
    const tz = this.tz || 'UTC';
    return html`
      <div class="cols" style="--cols:${Math.min(this._cols, this.model.people.length || 1)}">
        ${this.model.people.map((p) => this._column(columnFor(p, this.inlineChores, this.hideChores), tz))}
      </div>
    `;
  }

  _avatar(p) {
    if (p.picture) return html`<div class="av"><img src=${p.picture} alt="" /></div>`;
    if (p.icon) return html`<div class="av"><ha-icon icon=${p.icon}></ha-icon></div>`;
    return html`<div class="av">${p.initials}</div>`;
  }

  _column(col, tz) {
    const p = col.person;
    const lang = this.lang;
    const progress = p.progress;
    const allDone = Boolean(p.todo) && progress && progress.total > 0 && progress.done === progress.total;
    return html`
      <div class="col ${allDone ? 'alldone' : ''}" style="--pc:${p.color}">
        <div class="who">
          ${this._avatar(p)}
          <div class="nm">${p.name}</div>
          ${p.points && p.points.balance != null
            ? html`<div class="pts">${p.points.balance}<span>${p.points.unit}</span></div>`
            : nothing}
        </div>

        ${(p.failures || []).length
          ? html`<div class="notice">${t(lang, 'cant_read', { entities: p.failures.join(', ') })}</div>`
          : nothing}

        ${col.events.length
          ? col.events.map(
              ({ event, chore }) => html`<div class="ev"
                @click=${(e) => { if (!e.target.closest('button')) this._toggle(event.id); }}>
                <div class="ev-t">${eventTime(event, tz, this.locale)}</div>
                <div class="ev-n">
                  ${chore ? this._eventBox(p, chore) : nothing}<span class="ev-t2">${event.summary}</span>
                </div>
                ${this._expanded.has(event.id) && (event.location || event.description)
                  ? html`<div class="detail">${event.location
                      ? html`<div>${event.location}</div>` : nothing}${event.description
                      ? html`<div>${event.description}</div>` : nothing}</div>`
                  : nothing}
              </div>`,
            )
          : html`<div class="none">${t(lang, 'nothing_on')}</div>`}

        ${col.hasChores
          ? html`
              <div class="divider">
                ${t(lang, 'chores')} · ${col.outstanding ? t(lang, 'to_do', { n: col.outstanding }) : t(lang, 'all_done')}
              </div>
              ${col.chores.map((c) => renderTaskRow(this.ticks, p, c))}
            `
          : nothing}
      </div>
    `;
  }

  /** The tick box shown on a calendar event that carries a chore. */
  _eventBox(p, task) {
    return html`${renderTick(this.ticks, p, task, { inline: true })}${renderBadge(this.lang, task, { inline: true })}`;
  }
}

customElements.define('family-hub-columns', FamilyHubColumns);
