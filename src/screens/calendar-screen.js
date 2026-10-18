import { LitElement, html, css, nothing } from 'lit';
import { shared, personStyle } from '../styles/theme.js';
import { buildDays, hourRange, lanes, monthGrid, eventsOn } from '../data/calendar-grid.js';
import { buildTimeline, linkPerson, nowLineIndex, collapseChores } from '../data/timeline.js';
import { localParts, isSameLocalDay } from '../data/time.js';
import { TickController, renderTick, renderBadge } from '../views/tick-controller.js';
import { t } from '../i18n.js';
import { formatTime, formatDate } from '../format.js';

const ROWH = 34;

/**
 * The calendar in its four shapes. `schedule` is Skylight's default: seven
 * columns of stacked cards. `week` is the timed grid. `month` is six weeks of
 * chips. `day` is one day's cards with a now-line.
 *
 * The model arrives already filtered to the people the header has switched
 * on, with `startOffset` naming the first day on screen relative to today.
 */
export class FamilyHubCalendarScreen extends LitElement {
  static properties = {
    model: { attribute: false },
    mode: { attribute: false },
    now: { attribute: false },
    tz: { attribute: false },
    lang: { attribute: false },
    locale: { attribute: false },
    scheme: { attribute: false },
    startOffset: { attribute: false },
    offsetDays: { attribute: false },
    monthShift: { attribute: false },
    weekStart: { attribute: false },
    inlineChores: { attribute: false },
    confirmWindow: { attribute: false },
    readOnly: { attribute: false },
    _expanded: { state: true },
  };

  static styles = [
    shared,
    css`
      /* schedule */
      .days { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 12px; }
      .days[data-narrow='true'] { grid-template-columns: 1fr; }
      .day .dh { display: flex; align-items: baseline; gap: 8px; font-family: var(--fh-serif); font-size: 22px; padding: 0 2px 2px; }
      .day .dh .num { font-weight: 600; }
      .day.today .dh .num { background: var(--fh-today); color: #fff; border-radius: 50%; width: 32px; height: 32px; display: inline-grid; place-items: center; font-size: 18px; transform: translateY(-2px); }
      .day .count { color: var(--fh-text-2); font-size: 13px; padding: 0 2px 10px; }
      .meal { background: var(--tint); border-radius: 999px; padding: 5px 12px; font-size: 13px; font-weight: 500; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .card { background: var(--tint); border-radius: var(--fh-radius-s); padding: 10px 12px 10px 14px; margin-bottom: 8px; display: grid; grid-template-columns: 1fr auto; gap: 2px 8px; align-items: end; cursor: pointer; }
      .card.past { opacity: .55; }
      .card .t { font-weight: 600; font-size: 15px; grid-column: 1 / -1; display: flex; align-items: center; gap: 6px; min-width: 0; }
      .card .t .tap { margin: -10px -4px -10px -10px; }
      .card .t .name { min-width: 0; }
      .card .w { color: var(--fh-text-2); font-size: 13px; }
      .card .avs { display: flex; }
      .card .avs .av { box-shadow: 0 0 0 2px var(--tint); margin-left: -6px; }
      .card .avs .av:first-child { margin-left: 0; }
      .chorepill { display: flex; align-items: center; gap: 8px; background: var(--tint-soft); border: 1.5px solid var(--tint-strong); border-radius: 999px; padding: 4px 10px 4px 4px; font-size: 13px; font-weight: 600; margin-bottom: 8px; cursor: pointer; width: 100%; text-align: left; color: var(--fh-text); }
      .chorepill .av.sm { flex-shrink: 0; }
      .chorepill ha-icon { --mdc-icon-size: 16px; margin-left: auto; color: var(--pc); }
      .detail { grid-column: 1 / -1; font-size: 13px; color: var(--fh-text-2); line-height: 1.45; white-space: pre-line; padding-top: 4px; }
      .detail b { color: var(--fh-text); font-weight: 500; }

      /* timed week */
      .tgrid { display: grid; grid-template-columns: 52px repeat(7, minmax(0, 1fr)); gap: 0 10px; }
      .tgrid .dh { font-family: var(--fh-serif); font-size: 20px; padding-bottom: 6px; display: flex; align-items: baseline; gap: 8px; }
      .tgrid .dh .num { font-weight: 600; }
      .tgrid .today .dh .num { background: var(--fh-today); color: #fff; border-radius: 50%; width: 30px; height: 30px; display: inline-grid; place-items: center; font-size: 17px; }
      .allday { min-height: 6px; padding-bottom: 6px; }
      .allday .meal, .allday .pillev { margin-bottom: 4px; }
      .pillev { background: var(--tint); border-radius: 999px; padding: 4px 10px; font-size: 12.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tcol { position: relative; height: calc(var(--rows) * ${ROWH}px); background: repeating-linear-gradient(to bottom, var(--fh-line) 0 1px, transparent 1px ${ROWH}px); border-radius: 4px; }
      .tcol.today { background-color: var(--fh-surface); }
      .gutter { position: relative; height: calc(var(--rows) * ${ROWH}px); }
      .gutter span { position: absolute; left: 0; transform: translateY(-50%); font-size: 12px; color: var(--fh-text-3); }
      .tev { position: absolute; background: var(--tint); border-radius: 10px; padding: 6px 8px; overflow: hidden; font-size: 12.5px; cursor: pointer; }
      .tev b { display: flex; align-items: center; gap: 4px; font-weight: 600; font-size: 13px; }
      .tev b .tap { margin: -10px -6px -10px -12px; transform: scale(.8); }
      .tev .av.sm { position: absolute; right: 6px; bottom: 6px; }
      .nowline { position: absolute; left: -4px; right: 0; height: 2px; background: var(--fh-now); pointer-events: none; }
      .nowline::before { content: ''; position: absolute; left: -3px; top: -4px; width: 10px; height: 10px; border-radius: 50%; background: var(--fh-now); }

      /* month */
      .month { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; }
      .month .wd { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--fh-text-3); text-align: center; padding-bottom: 4px; }
      .mcell { background: var(--fh-surface); border-radius: 12px; min-height: 92px; padding: 8px; cursor: pointer; text-align: left; display: block; width: 100%; }
      .mcell .d { font-family: var(--fh-serif); font-size: 16px; color: var(--fh-text-2); margin-bottom: 6px; }
      .mcell.out { opacity: .45; }
      .mcell.today .d { background: var(--fh-today); color: #fff; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; font-size: 14px; }
      .mpill { background: var(--tint); border-radius: 6px; font-size: 11.5px; padding: 3px 7px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
      .mmore { font-size: 11px; color: var(--fh-text-3); padding-left: 4px; }

      /* day */
      .daylist { max-width: 760px; }
      .daylist .card { grid-template-columns: 64px 1fr auto; align-items: center; }
      .daylist .card .when { font-size: 13px; color: var(--fh-text-2); font-variant-numeric: tabular-nums; }
      .daylist .card .t { grid-column: auto; }
      .daylist .card .detail { grid-column: 2 / -1; }
      .now { height: 2px; background: var(--fh-now); margin: 4px 0 12px; position: relative; }
      .now::before { content: ''; position: absolute; left: -4px; top: -4px; width: 10px; height: 10px; border-radius: 50%; background: var(--fh-now); }
    `,
  ];

  constructor() {
    super();
    this.mode = 'schedule';
    this.lang = 'en';
    this.scheme = 'light';
    this.startOffset = 0;
    this.offsetDays = 0;
    this.monthShift = 0;
    this.weekStart = 'monday';
    this.inlineChores = true;
    this._expanded = new Set();
    this._narrow = false;
    this.ticks = new TickController(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver(([entry]) => {
      const narrow = entry.contentRect.width < 640;
      if (narrow !== this._narrow) { this._narrow = narrow; this.requestUpdate(); }
    });
    this._ro.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  _fmt(d) { return formatTime(d, this.locale, this.tz); }
  _style(person) { return personStyle(person.color, this.scheme); }

  _toggle(id) {
    const next = new Set(this._expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    this._expanded = next;
  }

  /** Rows for every person, linked to chores, deduplicated across people. */
  _timeline() {
    const people = this.model?.people || [];
    const linked = new Map(people.map((p) => [p.id, linkPerson(p, this.inlineChores)]));
    return buildTimeline(people, linked);
  }

  _rowsOn(timeline, day) {
    const rows = timeline.filter((r) => isSameLocalDay(r.event.start, day.date, this.tz));
    return collapseChores(rows, { isToday: day.isToday });
  }

  _chorePill(row) {
    const label = row.done === null
      ? (row.count === 1 ? t(this.lang, 'one_chore') : t(this.lang, 'n_chores', { n: row.count }))
      : t(this.lang, 'chores_done', { done: row.done, total: row.total });
    return html`<button class="chorepill" style=${this._style(row.person)}
        @click=${() => this.dispatchEvent(new CustomEvent('open-screen', { detail: { screen: 'tasks' }, bubbles: true, composed: true }))}>
      <span class="av sm">${row.person.picture ? html`<img src=${row.person.picture} alt="" />` : row.person.initials}</span>
      ${label}<ha-icon icon="mdi:chevron-right"></ha-icon>
    </button>`;
  }

  _mealsOn(day) {
    return (this.model?.meals || []).filter((e) => isSameLocalDay(e.start, day.date, this.tz));
  }

  _isTodayVisible() { return !this.offsetDays; }

  render() {
    if (!this.model) return nothing;
    switch (this.mode) {
      case 'week': return this._week();
      case 'month': return this._month();
      case 'day': return this._day();
      default: return this._schedule();
    }
  }

  // ── pieces ──────────────────────────────────────────────────────────────

  _avatars(people) {
    const shown = people.slice(0, 3);
    return html`<span class="avs">
      ${shown.map((p) => html`<span class="av sm" style=${this._style(p)}>${p.picture ? html`<img src=${p.picture} alt="" />` : p.initials}</span>`)}
      ${people.length > 3 ? html`<span class="av sm" style="--pc:var(--fh-text-3)">+${people.length - 3}</span>` : nothing}
    </span>`;
  }

  _range(event) {
    if (event.allDay) return t(this.lang, 'all_day');
    const end = event.end && +event.end !== +event.start ? ` – ${this._fmt(event.end)}` : '';
    return `${this._fmt(event.start)}${end}`;
  }

  _detail(event) {
    return html`<div class="detail">
      <b>${this._range(event)}</b>${event.location ? html` · ${event.location}` : nothing}
      ${event.description ? html`<div>${event.description}</div>` : nothing}
    </div>`;
  }

  _card(row, { showWhen = false } = {}) {
    const { event, person, people, chore } = row;
    const open = this._expanded.has(event.id);
    const past = this._isTodayVisible() && !event.allDay && isSameLocalDay(event.start, this.now, this.tz) && event.end < this.now;
    return html`<div class="card ${past ? 'past' : ''} ${chore?.done ? 'done' : ''}" style=${this._style(person)}
        @click=${(e) => { if (!e.target.closest('button')) this._toggle(event.id); }}>
      ${showWhen ? html`<div class="when">${this._range(event).split(' – ')[0]}</div>` : nothing}
      <div class="t">${chore ? renderTick(this.ticks, person, chore, { inline: true }) : nothing}<span class="name">${event.summary}</span>${chore ? renderBadge(this.lang, chore, { inline: true }) : nothing}</div>
      ${showWhen ? nothing : html`<div class="w">${this._range(event)}${event.location ? ` · ${event.location}` : ''}</div>`}
      ${this._avatars(people)}
      ${open ? this._detail(event) : nothing}
    </div>`;
  }

  _dayHead(day, cls = 'dh') {
    return html`<div class=${cls}>
      <span>${formatDate(day.date, this.locale, this.tz, { weekday: 'short' })}</span>
      <span class="num">${day.dayNum}</span>
    </div>`;
  }

  // ── schedule ────────────────────────────────────────────────────────────

  _schedule() {
    const days = buildDays(this.now, this.tz, 7, this.startOffset);
    const timeline = this._timeline();
    return html`<div class="days" data-narrow=${String(this._narrow)}>
      ${days.map((day) => {
        const rows = this._rowsOn(timeline, day);
        const n = rows.filter((r) => !r.kind).length;
        const count = n === 1 ? t(this.lang, 'event_count')
          : (day.isToday ? t(this.lang, 'events_today', { n }) : t(this.lang, 'events_count', { n }));
        return html`<div class="day ${day.isToday ? 'today' : ''}">
          ${this._dayHead(day)}
          <div class="count">${count}</div>
          ${this._mealsOn(day).map((m) => html`<div class="meal" style="--tint:var(--fh-surface)">${m.summary}</div>`)}
          ${rows.map((r) => (r.kind === 'chores' ? this._chorePill(r) : this._card(r)))}
        </div>`;
      })}
    </div>`;
  }

  // ── timed week ──────────────────────────────────────────────────────────

  _week() {
    const days = buildDays(this.now, this.tz, 7, this.startOffset);
    const timeline = this._timeline();
    const all = timeline.map((r) => r.event);
    const { from, to } = hourRange(all, this.tz);
    const rows = (to - from) * 2;
    const minsFrom = (d) => { const p = localParts(d, this.tz); return (p.hour - from) * 60 + p.minute; };
    const px = (mins) => (mins / 30) * ROWH;
    const nowTop = px(minsFrom(this.now));
    const showNow = this._isTodayVisible() && nowTop >= 0 && nowTop <= rows * ROWH;

    return html`<div class="tgrid" style="--rows:${rows}">
      <div></div>
      ${days.map((d) => html`<div class="${d.isToday ? 'today' : ''}">${this._dayHead(d)}
        <div class="allday">
          ${this._mealsOn(d).map((m) => html`<div class="meal" style="--tint:var(--fh-surface)">${m.summary}</div>`)}
          ${this._rowsOn(timeline, d).filter((r) => r.allDay).map((r) => (r.kind === 'chores' ? this._chorePill(r) : html`<div class="pillev" style=${this._style(r.person)}>${r.event.summary}</div>`))}
        </div>
      </div>`)}
      <div class="gutter">${Array.from({ length: to - from + 1 }, (_, i) => html`<span style="top:${i * 2 * ROWH}px">${this._fmt(new Date(2000, 0, 1, from + i, 0))}</span>`)}</div>
      ${days.map((d) => {
        const timed = this._rowsOn(timeline, d).filter((r) => !r.allDay && !r.kind);
        const byId = new Map(timed.map((r) => [r.event.id, r]));
        const placed = lanes(timed.map((r) => r.event));
        return html`<div class="tcol ${d.isToday ? 'today' : ''}">
          ${placed.map(({ event, lane, lanes: n }) => {
            const r = byId.get(event.id);
            const top = px(minsFrom(event.start));
            const h = Math.max(px(Math.max(30, (event.end - event.start) / 60000)) - 4, 26);
            const w = 100 / n;
            return html`<div class="tev" style="${this._style(r.person)};top:${top}px;height:${h}px;left:${lane * w}%;width:calc(${w}% - 3px)"
                @click=${(e) => { if (!e.target.closest('button')) this._toggle(event.id); }}>
              <b>${r.chore ? renderTick(this.ticks, r.person, r.chore, { inline: true }) : nothing}${event.summary}</b>
              ${h > 40 ? this._range(event) : nothing}
              ${this._expanded.has(event.id) && event.location ? html`<div>${event.location}</div>` : nothing}
              <span class="av sm" style=${this._style(r.person)}>${r.person.initials}</span>
            </div>`;
          })}
          ${d.isToday && showNow ? html`<div class="nowline" style="top:${nowTop}px"></div>` : nothing}
        </div>`;
      })}
    </div>`;
  }

  // ── month ───────────────────────────────────────────────────────────────

  _month() {
    const grid = monthGrid(this.now, this.tz, this.weekStart, this.monthShift || 0);
    const timeline = this._timeline();
    const byKey = eventsOn(timeline.map((r) => ({ ...r.event, _row: r })), grid, this.tz);
    for (const c of grid.cells) {
      const rows = collapseChores((byKey.get(c.key) || []).map((e) => e._row), { isToday: c.isToday });
      // In a cell that only fits three chips the chores summary goes first, so
      // it is never the one hidden behind "+n more".
      rows.sort((a, b) => (b.kind === 'chores') - (a.kind === 'chores'));
      byKey.set(c.key, rows.map((r) => ({ ...r.event, _row: r })));
    }
    const first = grid.cells.slice(0, 7);
    return html`<div class="month">
      ${first.map((c) => html`<div class="wd">${formatDate(c.date, this.locale, this.tz, { weekday: 'short' })}</div>`)}
      ${grid.cells.map((c) => {
        const evs = byKey.get(c.key) || [];
        return html`<button class="mcell ${c.inMonth ? '' : 'out'} ${c.isToday ? 'today' : ''}"
            @click=${() => this.dispatchEvent(new CustomEvent('open-day', { detail: { offset: c.offset }, bubbles: true, composed: true }))}>
          <div class="d">${c.dayNum}</div>
          ${evs.slice(0, 3).map((e) => html`<div class="mpill" style=${this._style(e._row.person)}>${e._row.kind === 'chores'
            ? `${e._row.person.initials} · ${e._row.done === null ? t(this.lang, 'n_chores', { n: e._row.count }) : t(this.lang, 'chores_done', { done: e._row.done, total: e._row.total })}`
            : e.summary}</div>`)}
          ${evs.length > 3 ? html`<div class="mmore">${t(this.lang, 'more_n', { n: evs.length - 3 })}</div>` : nothing}
        </button>`;
      })}
    </div>`;
  }

  // ── day ─────────────────────────────────────────────────────────────────

  _day() {
    const [day] = buildDays(this.now, this.tz, 1, this.startOffset);
    const rows = this._rowsOn(this._timeline(), day);
    const nowIdx = this._isTodayVisible() && day.isToday ? nowLineIndex(rows, this.now) : -1;
    const out = [];
    this._mealsOn(day).forEach((m) => out.push(html`<div class="meal" style="--tint:var(--fh-surface)">${m.summary}</div>`));
    rows.forEach((r, i) => {
      if (i === nowIdx) out.push(html`<div class="now"></div>`);
      out.push(r.kind === 'chores' ? this._chorePill(r) : this._card(r, { showWhen: true }));
    });
    if (nowIdx === rows.length && rows.length) out.push(html`<div class="now"></div>`);
    return html`<div class="daylist">
      ${out.length ? out : html`<div class="empty">${t(this.lang, 'nothing_on')}</div>`}
    </div>`;
  }
}

customElements.define('family-hub-calendar-screen', FamilyHubCalendarScreen);
