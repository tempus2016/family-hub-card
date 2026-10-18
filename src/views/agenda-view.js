import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles, tickStyles } from '../styles/shared.js';
import { linkChores } from '../data/link-chores.js';
import { tasksOf, progressOf } from '../data/tasks.js';
import { TickController, renderTick, renderBadge, renderTaskRow } from './tick-controller.js';
import { t } from '../i18n.js';
import { formatTime } from '../format.js';

/** Pairs one person's events with their tasks, or nothing when the option is off. */
export function linkPerson(person, inlineChores) {
  if (!inlineChores) {
    return {
      pairs: (person.events || []).map((event) => ({ event, chore: null })),
      matched: new Set(),
    };
  }
  return linkChores(person.events, tasksOf(person));
}

/**
 * The merged timeline. An event shared by several people — a family calendar
 * listed under each of them — arrives once per person with the same id, and
 * is shown once, naming everyone.
 */
export function buildTimeline(people, linkedByPerson = null) {
  const rows = [];
  const byId = new Map();
  for (const person of people) {
    const pairs = linkedByPerson?.get(person.id)?.pairs
      || (person.events || []).map((event) => ({ event, chore: null }));
    for (const { event, chore } of pairs) {
      const existing = event.id && byId.get(event.id);
      if (existing && !chore) {
        existing.people.push(person);
        continue;
      }
      const row = { time: event.allDay ? null : event.start, allDay: event.allDay, event, person, people: [person], chore };
      rows.push(row);
      if (event.id && !byId.has(event.id)) byId.set(event.id, row);
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
    tz: { attribute: false },
    lang: { attribute: false },
    locale: { attribute: false },
    confirmWindow: { attribute: false },
    readOnly: { attribute: false },
    inlineChores: { attribute: false },
    hideChores: { attribute: false },
    isToday: { attribute: false },
    _expanded: { state: true },
  };

  static styles = [
    sharedStyles,
    tickStyles,
    css`
      /* Metrics ported from mockups/c.html — .split2, .ag, .agrow, .pcard. */
      .wrap { display: grid; grid-template-columns: 1.35fr 1fr; gap: 20px; }
      .wrap[data-narrow='true'] { grid-template-columns: 1fr; }

      .ag { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 8px 18px 14px; }
      .agrow { display: flex; gap: 15px; padding: 14px 0; border-bottom: 1px solid var(--fh-rule-soft); align-items: flex-start; }
      .agrow:last-child { border-bottom: none; }
      .agrow.open { cursor: pointer; }
      .agt { font-family: var(--fh-mono); font-size: 16px; color: var(--fh-text-soft); width: var(--agt-w, 64px); flex-shrink: 0; padding-top: 2px; font-weight: 500; white-space: nowrap; }
      .agbar { width: 4px; border-radius: 2px; background: var(--pc); align-self: stretch; flex-shrink: 0; }
      .agbody { min-width: 0; flex: 1; }
      .agn { font-size: 20px; color: var(--fh-text); font-weight: 500; line-height: 1.25; display: flex; align-items: flex-start; }
      .agn .agn-t { min-width: 0; }
      .agn .tap.inline { margin-top: -10px; }
      .agw { font-size: 14px; color: var(--pc); margin-top: 3px; font-weight: 600; }
      .agw .also { color: var(--fh-text-mute); font-weight: 500; }
      .detail { margin-top: 8px; font-size: 14px; color: var(--fh-text-mute); line-height: 1.45; white-space: pre-line; }
      .detail b { color: var(--fh-text); font-weight: 500; }
      .past { opacity: 0.45; }
      .empty { padding: 14px 0; color: var(--fh-text-dim); font-size: 16px; }

      .now { background: var(--fh-now); height: 2px; border-radius: 1px; margin: 3px 0; position: relative; }
      .now::before { content: ''; position: absolute; left: -4px; top: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--fh-now); }

      .pcard { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 14px 15px; margin-bottom: 11px; border-left: 4px solid var(--pc); }
      .phead { display: flex; align-items: center; gap: 13px; }
      .av { width: 40px; height: 40px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; position: relative; }
      .av img { width: 100%; height: 100%; object-fit: cover; }
      .av ha-icon { --mdc-icon-size: 24px; }
      .pcard.alldone .av::after { content: '\\2713'; position: absolute; right: -2px; bottom: -2px; width: 18px; height: 18px; border-radius: 50%; background: var(--fh-surface); color: var(--pc); font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 2px var(--pc); }
      .nm { font-weight: 600; font-size: 18px; }
      .nextc { font-size: 14px; color: var(--fh-text-mute); margin-top: 2px; }
      .pcard.alldone .nextc { color: var(--pc); font-weight: 600; }
      .streak { font-size: 12px; color: var(--fh-text-mute); margin-top: 2px; }
      .pts { margin-left: auto; text-align: right; padding-left: 10px; }
      .pts b { display: block; font-size: 24px; color: var(--pc); font-family: var(--fh-mono); line-height: 1; }
      .pts span { font-size: 10px; color: var(--fh-text-faint); text-transform: uppercase; letter-spacing: 1px; }
      .pts .today { font-size: 12px; color: var(--fh-text-mute); margin-top: 3px; text-transform: none; letter-spacing: 0; }

      .chores { margin-top: 6px; border-top: 1px solid var(--fh-rule-soft); padding-top: 2px; }
    `,
  ];

  constructor() {
    super();
    this._narrow = false;
    this.isToday = true;
    this.lang = 'en';
    this._expanded = new Set();
    this.ticks = new TickController(this);
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
  }

  /** Kept for callers that flush before navigating away. */
  flushPending() {
    this.ticks.flush();
  }

  _fmt(date) {
    return formatTime(date, this.locale, this.tz);
  }

  _toggle(id) {
    const next = new Set(this._expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._expanded = next;
  }

  render() {
    if (!this.model) return nothing;
    const lang = this.lang;
    const linked = new Map(
      this.model.people.map((p) => [p.id, linkPerson(p, this.inlineChores)]),
    );
    const timeline = buildTimeline(this.model.people, linked);
    // Paged to another day there is no "now" on screen: a now-line drawn at the
    // current time of day in tomorrow's list, with the morning dimmed as past,
    // reads as a broken clock.
    const nowIdx = this.isToday ? nowLineIndex(timeline, this.now) : -1;

    const rows = [];
    timeline.forEach((r, i) => {
      if (i === nowIdx) rows.push(html`<div class="now"></div>`);
      const past = this.isToday && !r.allDay && r.time < this.now;
      const open = this._expanded.has(r.event.id);
      const others = r.people.slice(1);
      rows.push(html`
        <div class="agrow open ${past ? 'past' : ''}" style="--pc:${r.person.color}"
          @click=${(e) => { if (!e.target.closest('button')) this._toggle(r.event.id); }}>
          <div class="agt">${r.allDay ? t(lang, 'all_day') : this._fmt(r.time)}</div>
          <div class="agbar"></div>
          <div class="agbody">
            <div class="agn">
              ${r.chore ? this._eventBox(r.person, r.chore) : nothing}<span class="agn-t">${r.event.summary}</span>
            </div>
            <div class="agw">
              ${r.person.name}${others.length
                ? html`<span class="also"> · ${others.map((p) => p.name).join(' · ')}</span>`
                : nothing}${r.event.location ? html` · ${r.event.location}` : nothing}
            </div>
            ${open ? this._detail(r.event) : nothing}
          </div>
        </div>
      `);
    });
    if (this.isToday && nowIdx === timeline.length) rows.push(html`<div class="now"></div>`);

    const withCards = this.model.people.filter((p) => !p.shared);
    // "02:00 PM" needs more column than "14:00"; "All day" must not wrap either.
    const wide = this._fmt(new Date(2000, 0, 1, 22, 0)).length > 5;

    return html`
      <div class="wrap" data-narrow=${String(this._narrow)}>
        <div>
          <div class="sec-l">${t(lang, 'today')}</div>
          <div class="ag" style="--agt-w:${wide ? '84px' : '64px'}">
            ${rows.length ? rows : html`<div class="empty">${t(lang, 'nothing_scheduled')}</div>`}
          </div>
        </div>
        <div>
          <div class="sec-l">${t(lang, 'chores_points')}</div>
          ${withCards.map((p) => this._person(p, linked.get(p.id)))}
        </div>
      </div>
    `;
  }

  /** The expanded panel under an event: time range, location, description. */
  _detail(event) {
    const range = event.allDay
      ? t(this.lang, 'all_day')
      : `${this._fmt(event.start)}${event.end && +event.end !== +event.start ? ` – ${this._fmt(event.end)}` : ''}`;
    return html`
      <div class="detail">
        <b>${range}</b>${event.location ? html` · ${event.location}` : nothing}
        ${event.description ? html`<div>${event.description}</div>` : nothing}
      </div>
    `;
  }

  _avatar(p) {
    if (p.picture) return html`<div class="av"><img src=${p.picture} alt="" /></div>`;
    if (p.icon) return html`<div class="av"><ha-icon icon=${p.icon}></ha-icon></div>`;
    return html`<div class="av">${p.initials}</div>`;
  }

  _person(p, link) {
    const matched = link?.matched || new Set();
    const tasks = tasksOf(p);
    const outstanding = tasks.filter((c) => !c.done);
    const progress = progressOf(p);
    const allDone = Boolean(p.todo) && progress.total > 0 && progress.done === progress.total;

    // Anything whose box moved onto the timeline drops out of the list here.
    // `outstanding` stays unfiltered for the "Next: X" line below, which still
    // names the chore even when its box lives on the timeline.
    const rest = this.hideChores ? [] : tasks.filter((c) => !matched.has(c));

    return html`
      <div class="pcard ${allDone ? 'alldone' : ''}" style="--pc:${p.color}">
        <div class="phead">
          ${this._avatar(p)}
          <div>
            <div class="nm">${p.name}</div>
            <div class="nextc">${this._summary(p, outstanding)}</div>
            ${p.points?.streak > 1
              ? html`<div class="streak">🔥 ${t(this.lang, 'streak', { n: p.points.streak })}</div>`
              : nothing}
          </div>
          ${this._points(p)}
        </div>
        ${(p.failures || []).length
          ? html`<div class="notice">${t(this.lang, 'cant_read', { entities: p.failures.join(', ') })}</div>`
          : nothing}
        ${rest.length
          ? html`<div class="chores">${rest.map((c) => renderTaskRow(this.ticks, p, c))}</div>`
          : nothing}
      </div>
    `;
  }

  /**
   * The mockup's "Next: X" line, degrading sensibly when there's nothing due.
   *
   * With chores inline the timeline already lists them in time order, so naming
   * the next one just repeats what is on screen. A count adds information
   * instead. Counting only the unmatched chores is deliberately avoided — it
   * would read "All done" over someone who has done nothing.
   */
  _summary(p, outstanding) {
    const lang = this.lang || 'en';
    if (!p.todo) return t(lang, 'no_chore_list');
    if (this.inlineChores) {
      const { done, total } = progressOf(p);
      return total ? t(lang, 'done_of', { done, total }) : t(lang, 'all_done');
    }
    if (!outstanding.length) return t(lang, 'all_done');
    return t(lang, 'next', { chore: outstanding[0].summary });
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

  /** The tick box on a timeline row that carries a chore. */
  _eventBox(p, task) {
    return html`${renderTick(this.ticks, p, task, { inline: true })}${renderBadge(this.lang, task, { inline: true })}`;
  }
}

customElements.define('family-hub-agenda', FamilyHubAgenda);
