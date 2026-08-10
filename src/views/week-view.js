import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles } from '../styles/shared.js';
import { choreProgress } from '../data/chore-progress.js';
import { localParts, isSameLocalDay } from '../data/time.js';

/**
 * Seven local days starting today. Derived from the day each column represents
 * rather than by adding 24h repeatedly, so a DST change doesn't shift the grid.
 */
export function buildDays(now, tz, count = 7) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    // Midday anchor: far enough from either boundary that a 23- or 25-hour day
    // still lands on the intended date.
    const date = new Date(now.getTime() + i * 24 * 3600 * 1000 + 12 * 3600 * 1000);
    const p = localParts(date, tz);
    out.push({
      date,
      dayNum: p.day,
      isToday: i === 0,
    });
  }
  return out;
}

/** Events for one person bucketed into the given day columns. */
export function bucketByDay(events, days, tz) {
  return days.map((d) => (events || []).filter((e) => isSameLocalDay(e.start, d.date, tz)));
}

/**
 * Names of this person's chores already done today.
 *
 * Two sources, because neither is complete on its own: the todo list carries
 * completed items for stock lists, while TaskMate drops a chore from its list
 * the moment it's ticked and records it in todays_completions instead.
 */
export function completedNames(person) {
  const names = new Set();
  for (const c of person.chores || []) {
    if (c.status === 'completed') names.add(c.summary);
  }
  for (const c of person.completedToday || []) {
    names.add(c.name);
  }
  return names;
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

/** Label naming the period the progress bars describe. */
export function barPeriod(offsetDays, now) {
  if (!offsetDays) return 'Today';
  const fmt = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long' });
  return `Week of ${fmt.format(now)}`;
}

export { choreProgress };

export class FamilyHubWeek extends LitElement {
  static properties = {
    model: { attribute: false },
    now: { attribute: false },
    tz: { attribute: false },
    offsetDays: { attribute: false },
  };

  static styles = [
    sharedStyles,
    css`
      /* Metrics ported from mockups/b.html — .grid7, .gh, .cell, .chip, .bars. */
      .grid7 { display: grid; grid-template-columns: 92px repeat(7, 1fr); gap: 7px; }
      .grid7[data-narrow='true'] { grid-template-columns: 72px repeat(7, 1fr); gap: 4px; }

      .gh { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--fh-text-faint); text-align: center; padding-bottom: 9px; font-weight: 600; }
      .gh b { display: block; font-size: 24px; color: var(--fh-text); margin-top: 4px; letter-spacing: 0; }
      .gh.today b { color: var(--fh-now); }

      .rowlab { font-size: 16px; color: var(--fh-chore-text); display: flex; align-items: center; gap: 8px; padding-right: 6px; font-weight: 500; min-width: 0; }
      .rowlab span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .dot { width: 11px; height: 11px; border-radius: 50%; background: var(--pc); flex-shrink: 0; }

      .cell { background: var(--fh-cell, #171b24); border-radius: 8px; min-height: 62px; padding: 6px; display: flex; flex-direction: column; gap: 4px; }
      .cell.today { background: var(--fh-cell-today, #1b2130); box-shadow: inset 0 0 0 1px var(--fh-cell-today-edge, #2b3550); }

      .chip { background: var(--pc); color: var(--fh-bg); font-size: 13px; font-weight: 600; padding: 4px 7px; border-radius: 5px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .chip.ghost { background: transparent; color: var(--pc); box-shadow: inset 0 0 0 1.5px var(--pc); }
      .chip.complete { text-decoration: line-through; opacity: 0.45; }

      /* Four fixed columns like the mockup. auto-fit stretched three people
         across the full width and pulled each label away from its value. */
      /* The grid spans seven days while the bars describe one, so the period
         has to be stated or the numbers read as the week's. */
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

  _dow(date) {
    return new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date);
  }

  render() {
    if (!this.model) return nothing;
    const tz = this.tz || 'UTC';
    // `now` is already the paged date, so today's highlight and completion
    // marking only apply when the offset is zero.
    const days = buildDays(this.now, tz).map((d, i) => ({
      ...d,
      isToday: d.isToday && !this.offsetDays && i === 0,
    }));

    return html`
      <div class="grid7" data-narrow=${String(this._narrow)}>
        <div></div>
        ${days.map(
          (d) => html`<div class="gh ${d.isToday ? 'today' : ''}">
            ${this._dow(d.date)}<b>${d.dayNum}</b>
          </div>`,
        )}
        ${this.model.people.map((p) => this._personRow(p, days, tz))}
      </div>
      <div class="bars-head">${barPeriod(this.offsetDays || 0, this.now)}</div>
      <div class="bars" data-narrow=${String(this._narrow)}>
        ${this.model.people.map((p) => this._bar(p))}
      </div>
    `;
  }

  _personRow(p, days, tz) {
    const buckets = bucketByDay(p.events, days, tz);
    const done = completedNames(p);
    return html`
      <div class="rowlab" style="--pc:${p.color}">
        <div class="dot"></div><span>${p.name}</span>
      </div>
      ${buckets.map(
        (events, i) => html`
          <div class="cell ${days[i].isToday ? 'today' : ''}" style="--pc:${p.color}">
            ${events.map((e) => {
              const st = chipState(e, days[i].isToday, done);
              return html`<div
                class="chip ${st.ghost ? 'ghost' : ''} ${st.complete ? 'complete' : ''}"
                title=${e.summary}
              >${e.summary}</div>`;
            })}
          </div>
        `,
      )}
    `;
  }

  _bar(p) {
    // Paged away there is no completion data for that week, and a 0% track
    // reads as failure rather than "not yet" — so show the count alone.
    if (this.offsetDays) {
      const due = (p.events || []).length;
      return html`
        <div style="--pc:${p.color}">
          <div class="bar-l"><span>${p.name}</span><b>${due} due</b></div>
        </div>
      `;
    }
    const { done, total, pct } = choreProgress(p);
    return html`
      <div style="--pc:${p.color}">
        <div class="bar-l"><span>${p.name}</span><b>${done}/${total}</b></div>
        <div class="track"><div class="fill" style="width:${pct}%"></div></div>
      </div>
    `;
  }
}

customElements.define('family-hub-week', FamilyHubWeek);
