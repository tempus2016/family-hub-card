import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles } from '../styles/shared.js';
import { progressOf, tasksOf } from '../data/tasks.js';
import { choreKey } from '../data/link-chores.js';
import { localParts, isSameLocalDay, localDayWindow } from '../data/time.js';
import { t } from '../i18n.js';
import { formatDate } from '../format.js';

/**
 * Days back from today to the start of the week, as a negative offset.
 *
 * Decided in the dashboard's timezone: at 23:30Z on a Sunday a London
 * household is already into Monday.
 */
export function weekStartOffset(now, tz, weekStart = 'monday') {
  if (weekStart === 'today') return 0;
  const { year, month, day } = localParts(now, tz);
  const dow = new Date(Date.UTC(year, month, day)).getUTCDay(); // 0 = Sunday
  const first = weekStart === 'sunday' ? 0 : 1;
  // `|| 0` turns -0 into 0 so the offset compares cleanly.
  return -((dow - first + 7) % 7) || 0;
}

/**
 * Seven local days from `now + offsetDays`. Each column is derived from local
 * midnight of its own day, not from `now` plus a multiple of 24h: anchoring on
 * `now` put the first column on tomorrow every afternoon, and 24h steps drift
 * an hour through a DST change.
 */
export function buildDays(now, tz, count = 7, offsetDays = 0) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    // Midday of day i: far enough from either boundary that a 23- or 25-hour
    // day still lands on the intended date.
    const { start } = localDayWindow(now, tz, 1, offsetDays + i);
    const date = new Date(start.getTime() + 12 * 3600 * 1000);
    const p = localParts(date, tz);
    out.push({
      date,
      dayNum: p.day,
      isToday: isSameLocalDay(date, now, tz),
    });
  }
  return out;
}

/** Events for one person bucketed into the given day columns. */
export function bucketByDay(events, days, tz) {
  return days.map((d) => (events || []).filter((e) => isSameLocalDay(e.start, d.date, tz)));
}

/** Names of this person's chores already done today. */
export function completedNames(person) {
  return new Set(tasksOf(person).filter((task) => task.done).map((task) => task.summary));
}

/** Lower-cased names of everything on this person's chore list, done or not. */
export function choreNames(person) {
  return new Set(tasksOf(person).map((task) => choreKey(task.summary)));
}

/**
 * Chore names across the whole family. TaskMate lists only the chores due
 * today on each child's to-do list, so a chore on Ben's calendar may be known
 * as a chore only through Ana's list; a name that is a chore for anyone is
 * treated as a chore for everyone.
 */
export function familyChoreNames(people) {
  const out = new Set();
  for (const p of people || []) {
    if (p.shared) continue;
    for (const name of choreNames(p)) out.add(name);
  }
  return out;
}

/**
 * How one chip renders.
 *
 * Matching is by name because TaskMate's calendar events carry no id that maps
 * back to a chore. A calendar event sharing a chore's name will therefore also
 * strike through; the cost is one cosmetic line and there is no better key.
 *
 * Only today can be marked. Other columns have no completion data at all —
 * todo/item/list returns current items, todays_completions is today-scoped, and
 * recent_completions is a count rather than a date range.
 */
export function chipState(event, isToday, doneNames) {
  return {
    complete: isToday && doneNames.has(event.summary),
    ghost: Boolean(event.allDay),
  };
}

/**
 * The chips for one cell. Events that are chores collapse into a single
 * counted chip after the real events: four children times four daily chores
 * times seven days is a wall of identical chips that says nothing, and the
 * chore names are already on the person's card.
 */
export function cellChips(events, chores, isToday, doneNames, collapse = true, progress = null) {
  const real = [];
  let total = 0;
  let done = 0;
  for (const event of events || []) {
    if (collapse && chores.has(choreKey(event.summary))) {
      total += 1;
      if (isToday && doneNames.has(event.summary)) done += 1;
    } else {
      real.push({ ...chipState(event, isToday, doneNames), summary: event.summary, collapsed: false });
    }
  }
  // On today the chore list is the authority — the bars below read from it,
  // and a chip saying 0/4 over a bar saying 0/2 is the kind of contradiction
  // this card exists to avoid. Other days have no list, so events are counted.
  if (total && isToday && progress?.total) {
    total = progress.total;
    done = progress.done;
  }
  if (total) real.push({ collapsed: true, total, done, complete: isToday && done === total, ghost: false });
  return real;
}

/** Label naming the period the progress bars describe. */
export function barPeriod(offsetDays, now, lang = 'en', locale, tz) {
  if (!offsetDays) return t(lang, 'today');
  return t(lang, 'week_of', { date: formatDate(now, locale, tz, { day: 'numeric', month: 'long' }) });
}

export const choreProgress = progressOf;

export class FamilyHubWeek extends LitElement {
  static properties = {
    model: { attribute: false },
    now: { attribute: false },
    tz: { attribute: false },
    lang: { attribute: false },
    locale: { attribute: false },
    offsetDays: { attribute: false },
    startOffset: { attribute: false },
  };

  static styles = [
    sharedStyles,
    css`
      /* Metrics ported from mockups/b.html — .grid7, .gh, .cell, .chip, .bars. */
      .grid7 { display: grid; grid-template-columns: 92px repeat(7, 1fr); gap: 7px; align-items: start; }
      .grid7[data-narrow='true'] { grid-template-columns: 72px repeat(7, 1fr); gap: 4px; }

      .gh { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--fh-text-faint); text-align: center; padding-bottom: 9px; font-weight: 600; }
      .gh b { display: block; font-size: 24px; color: var(--fh-text); margin-top: 4px; letter-spacing: 0; }
      .gh.today b { color: var(--fh-now); }

      .rowlab { font-size: 16px; color: var(--fh-chore-text); display: flex; align-items: center; gap: 8px; padding-right: 6px; font-weight: 500; min-width: 0; min-height: 36px; }
      .rowlab span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .dot { width: 11px; height: 11px; border-radius: 50%; background: var(--pc); flex-shrink: 0; }

      .cell { background: var(--fh-cell, #171b24); border-radius: 8px; min-height: 62px; padding: 6px; display: flex; flex-direction: column; gap: 4px; }
      .cell.today { background: var(--fh-cell-today, #1b2130); box-shadow: inset 0 0 0 1px var(--fh-cell-today-edge, #2b3550); }
      /* A person with nothing on all week keeps a thin row rather than seven
         tall empty boxes. */
      .row-empty .cell { min-height: 36px; }

      .chip { background: var(--pc); color: var(--fh-bg); font-size: 13px; font-weight: 600; padding: 4px 7px; border-radius: 5px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .chip.ghost { background: transparent; color: var(--pc); box-shadow: inset 0 0 0 1.5px var(--pc); }
      .chip.complete { text-decoration: line-through; opacity: 0.45; }
      .chip.chores { background: transparent; color: var(--pc); box-shadow: inset 0 0 0 1.5px var(--pc); opacity: 0.85; text-decoration: none; }
      .chip.chores.complete { opacity: 0.45; text-decoration: line-through; }

      .bars-head { font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; color: var(--fh-text-dim); font-weight: 600; margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--fh-rule); }
      .bars { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: 12px; }
      .bars[data-narrow='true'] { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .bar-l { display: flex; justify-content: space-between; font-size: 15px; margin-bottom: 7px; color: var(--fh-chore-text); gap: 8px; }
      .bar-l b { color: var(--pc); font-family: var(--fh-mono); }
      .track { height: 8px; background: var(--fh-chip); border-radius: 4px; overflow: hidden; }
      .fill { height: 100%; background: var(--pc); border-radius: 4px; }
      .notice { grid-column: 1 / -1; }
    `,
  ];

  constructor() {
    super();
    this._narrow = false;
    this.lang = 'en';
    this.offsetDays = 0;
    this.startOffset = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver(([entry]) => {
      const narrow = entry.contentRect.width < 900;
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

  _dow(date, tz) {
    return formatDate(date, this.locale, tz, { weekday: 'short' });
  }

  render() {
    if (!this.model) return nothing;
    const tz = this.tz || 'UTC';
    // `now` is the real clock. The grid starts `startOffset` days from it (back
    // to Monday, plus any paging), and today is highlighted wherever it falls.
    const days = buildDays(this.now, tz, 7, this.startOffset || 0);
    const paged = Boolean(this.offsetDays);
    const weekStart = days[0].date;
    const chores = familyChoreNames(this.model.people);

    return html`
      <div class="grid7" data-narrow=${String(this._narrow)}>
        <div></div>
        ${days.map(
          (d) => html`<div class="gh ${d.isToday ? 'today' : ''}">
            ${this._dow(d.date, tz)}<b>${d.dayNum}</b>
          </div>`,
        )}
        ${this.model.people.map((p) => this._personRow(p, days, tz, chores))}
      </div>
      <div class="bars-head">${barPeriod(paged ? 1 : 0, weekStart, this.lang, this.locale, tz)}</div>
      <div class="bars" data-narrow=${String(this._narrow)}>
        ${this.model.people.filter((p) => !p.shared).map((p) => this._bar(p, paged))}
      </div>
    `;
  }

  _personRow(p, days, tz, chores) {
    const buckets = bucketByDay(p.events, days, tz);
    const done = completedNames(p);
    const empty = buckets.every((b) => b.length === 0);
    return html`
      <div class="rowlab ${empty ? 'row-empty' : ''}" style="--pc:${p.color}">
        <div class="dot"></div><span>${p.name}</span>
      </div>
      ${buckets.map(
        (events, i) => html`
          <div class="${empty ? 'row-empty' : ''}" style="--pc:${p.color}">
            <div class="cell ${days[i].isToday ? 'today' : ''}">
              ${cellChips(events, chores, days[i].isToday, done, true, progressOf(p)).map((chip) => (chip.collapsed
                ? html`<div class="chip chores ${chip.complete ? 'complete' : ''}">
                    ${days[i].isToday
                      ? t(this.lang, 'chores_done', { done: chip.done, total: chip.total })
                      : t(this.lang, 'n_chores', { n: chip.total })}
                  </div>`
                : html`<div
                    class="chip ${chip.ghost ? 'ghost' : ''} ${chip.complete ? 'complete' : ''}"
                    title=${chip.summary}
                  >${chip.summary}</div>`))}
            </div>
          </div>
        `,
      )}
    `;
  }

  _bar(p, paged) {
    // Paged away there is no completion data for that week, and a 0% track
    // reads as failure rather than "not yet" — so show the count alone.
    if (paged) {
      const due = (p.events || []).length;
      return html`
        <div style="--pc:${p.color}">
          <div class="bar-l"><span>${p.name}</span><b>${t(this.lang, 'due', { n: due })}</b></div>
        </div>
      `;
    }
    const { done, total, pct } = progressOf(p);
    return html`
      <div style="--pc:${p.color}">
        <div class="bar-l"><span>${p.name}</span><b>${done}/${total}</b></div>
        <div class="track"><div class="fill" style="width:${pct}%"></div></div>
      </div>
    `;
  }
}

customElements.define('family-hub-week', FamilyHubWeek);
