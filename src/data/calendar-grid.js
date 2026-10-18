import { localParts, localDayWindow, isSameLocalDay } from './time.js';

/** Hour gutter for the timed week: 7–21 unless an event falls outside it. */
export function hourRange(events, tz) {
  let from = 7;
  let to = 21;
  for (const e of events || []) {
    if (e.allDay) continue;
    const s = localParts(e.start, tz);
    const en = localParts(e.end || e.start, tz);
    from = Math.min(from, s.hour);
    // An event ending at 22:40 needs the 22:00 row and the one after it.
    const endHour = en.hour + (en.minute > 0 ? 1 : 0);
    to = Math.max(to, endHour);
  }
  return { from, to: Math.min(24, Math.max(to, from + 1)) };
}

/**
 * Side-by-side lanes for events that overlap in one column, so a dentist
 * appointment and a lesson at the same time sit next to each other rather
 * than one on top of the other.
 */
export function lanes(events) {
  const sorted = [...(events || [])].sort((a, b) => a.start - b.start || a.end - b.end);
  const out = [];
  let cluster = [];
  let clusterEnd = null;
  const flush = () => {
    if (!cluster.length) return;
    const ends = [];
    const placed = cluster.map((event) => {
      let lane = ends.findIndex((end) => end <= event.start);
      if (lane === -1) { lane = ends.length; ends.push(event.end); } else ends[lane] = event.end;
      return { event, lane };
    });
    for (const p of placed) out.push({ ...p, lanes: ends.length });
    cluster = [];
    clusterEnd = null;
  };
  for (const event of sorted) {
    if (clusterEnd !== null && event.start >= clusterEnd) flush();
    cluster.push(event);
    clusterEnd = clusterEnd === null || event.end > clusterEnd ? event.end : clusterEnd;
  }
  flush();
  return out;
}

/**
 * Days back from today to the start of the week, as a negative offset.
 * Decided in the dashboard's timezone: at 23:30Z on a Sunday a London
 * household is already into Monday.
 */
export function weekStartOffset(now, tz, weekStart = 'monday') {
  if (weekStart === 'today') return 0;
  const first = weekStart === 'sunday' ? 0 : 1;
  return -((weekdayIndex(now, tz) - first + 7) % 7) || 0;
}

/**
 * `count` local days from `now + offsetDays`. Each is derived from local
 * midnight of its own day: anchoring on `now` plus 24h multiples put the
 * first column on tomorrow every afternoon and drifted across DST.
 */
export function buildDays(now, tz, count = 7, offsetDays = 0) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const { start, end } = localDayWindow(now, tz, 1, offsetDays + i);
    const date = new Date(start.getTime() + 12 * 3600 * 1000);
    const p = localParts(date, tz);
    out.push({ date, start, end, dayNum: p.day, isToday: isSameLocalDay(date, now, tz), offset: offsetDays + i });
  }
  return out;
}

/** Events for one person bucketed into the given day columns. */
export function bucketByDay(events, days, tz) {
  return days.map((d) => (events || []).filter((e) => isSameLocalDay(e.start, d.date, tz)));
}

function weekdayIndex(date, tz) {
  const { year, month, day } = localParts(date, tz);
  return new Date(Date.UTC(year, month, day)).getUTCDay();
}

/** Days from today back to the first cell of the month grid, `shift` months away. */
export function monthStartOffset(now, tz, weekStart = 'monday', shift = 0) {
  const { year, month } = localParts(now, tz);
  const target = new Date(Date.UTC(year, month + shift, 1, 12));
  const first = weekStart === 'sunday' ? 0 : 1;
  const back = (weekdayIndex(target, tz) - first + 7) % 7;
  const gridStart = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), 1 - back, 12));
  const today = localParts(now, tz);
  const todayUTC = Date.UTC(today.year, today.month, today.day, 12);
  return Math.round((gridStart.getTime() - todayUTC) / 86400000);
}

/** Six weeks of cells for the month `shift` months from now. */
export function monthGrid(now, tz, weekStart = 'monday', shift = 0) {
  const { year, month } = localParts(now, tz);
  const target = new Date(Date.UTC(year, month + shift, 1, 12));
  const tYear = target.getUTCFullYear();
  const tMonth = target.getUTCMonth();
  const offset = monthStartOffset(now, tz, weekStart, shift);
  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const { start } = localDayWindow(now, tz, 1, offset + i);
    const date = new Date(start.getTime() + 12 * 3600 * 1000);
    const p = localParts(date, tz);
    cells.push({
      key: `${p.year}-${p.month + 1}-${p.day}`,
      date,
      dayNum: p.day,
      inMonth: p.year === tYear && p.month === tMonth,
      isToday: isSameLocalDay(date, now, tz),
      offset: offset + i,
    });
  }
  const label = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(target);
  return { cells, label, year: tYear, month: tMonth, offset };
}

/** Map of cell key → events starting on that local day. */
export function eventsOn(events, grid, tz) {
  const map = new Map(grid.cells.map((c) => [c.key, []]));
  for (const e of events || []) {
    const p = localParts(e.start, tz);
    const key = `${p.year}-${p.month + 1}-${p.day}`;
    if (map.has(key)) map.get(key).push(e);
  }
  return map;
}
