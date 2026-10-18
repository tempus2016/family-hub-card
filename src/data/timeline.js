import { linkChores } from './link-chores.js';
import { tasksOf } from './tasks.js';

/** Pairs one person's events with their tasks, or nothing when the option is off. */
export function linkPerson(person, inlineChores = true) {
  if (!inlineChores) {
    return { pairs: (person.events || []).map((event) => ({ event, chore: null })), matched: new Set() };
  }
  return linkChores(person.events, tasksOf(person));
}

/**
 * The merged timeline for one span of days. An event shared by several
 * people — a family calendar listed under each of them — arrives once per
 * person with the same id, and is shown once, naming everyone.
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

/** Index of the row the now-line sits before; -1 before the first timed row. */
export function nowLineIndex(timeline, now) {
  const firstTimed = timeline.findIndex((r) => !r.allDay);
  if (firstTimed === -1) return -1;
  if (now < timeline[firstTimed].time) return -1;
  let idx = timeline.length;
  for (let i = firstTimed; i < timeline.length; i += 1) {
    if (timeline[i].time > now) { idx = i; break; }
  }
  return idx;
}

/**
 * Folds each person's chore-calendar events into one summary row, placed
 * after the real events. On today the figures come from the person's chore
 * progress so the pill agrees with the Tasks screen; on other days there is
 * no completion data, so the events are counted.
 */
export function collapseChores(rows, { isToday = false } = {}) {
  if (!rows.some((r) => r.event.isChore)) return rows;
  const real = [];
  const byPerson = new Map();
  for (const r of rows) {
    if (!r.event.isChore) { real.push(r); continue; }
    const cur = byPerson.get(r.person.id) || { kind: 'chores', person: r.person, count: 0, allDay: true, time: null, event: null };
    cur.count += 1;
    byPerson.set(r.person.id, cur);
  }
  const summaries = [...byPerson.values()].map((c) => {
    const p = isToday ? c.person.progress : null;
    return {
      ...c,
      event: { id: `chores:${c.person.id}`, summary: '', allDay: true, isChore: true, start: null, end: null },
      done: p ? p.done : null,
      total: p && p.total ? p.total : c.count,
    };
  });
  return [...real, ...summaries];
}
