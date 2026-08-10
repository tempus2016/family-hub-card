import { localParts } from './time.js';
import { linkChores } from './link-chores.js';

/**
 * Skylight's own boundaries: midnight, noon and 6pm. Evaluated in the
 * dashboard's timezone, not UTC — during BST a 23:30Z event is next morning.
 */
export function dayPart(date, tz) {
  const { hour } = localParts(date, tz);
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * One person's tasks, filed by time of day.
 *
 * The period comes from the matched calendar event's start time. TaskMate's
 * chores carry times on the calendar but its to-do items have no `due` field at
 * all, so the event is the only time source available. A chore with no event
 * falls into `chores`, which is what Skylight does with undated chores.
 *
 * The merge of the to-do list with TaskMate's completions mirrors `columnFor`:
 * TaskMate drops a chore from the list the moment it is ticked, so completions
 * have to be appended, but a stock list keeps completed items and would
 * otherwise show the same task twice.
 */
export function groupTasks(person, tz) {
  const tasks = [];
  const seen = new Set();

  for (const c of person.chores || []) {
    seen.add(c.summary);
    tasks.push({
      id: c.id,
      summary: c.summary,
      done: c.status === 'completed',
      pending: false,
      tappable: c.status !== 'completed',
      start: null,
    });
  }

  for (const c of person.completedToday || []) {
    if (seen.has(c.name)) continue;
    seen.add(c.name);
    tasks.push({
      id: c.choreId,
      summary: c.name,
      done: true,
      pending: !c.approved,
      tappable: false,
      start: null,
    });
  }

  const { pairs } = linkChores(person.events, tasks);
  for (const { event, chore } of pairs) {
    if (chore) chore.start = event.start;
  }

  const groups = { morning: [], afternoon: [], evening: [], chores: [] };
  for (const task of tasks) {
    const key = task.start ? dayPart(task.start, tz) : 'chores';
    groups[key].push(task);
  }
  for (const key of ['morning', 'afternoon', 'evening']) {
    groups[key].sort((a, b) => a.start - b.start);
  }
  return groups;
}
