import { localParts } from './time.js';
import { linkChores } from './link-chores.js';
import { tasksOf } from './tasks.js';

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
 * The period comes from the matched calendar event's start time, or failing
 * that from a due date that carries a time. TaskMate's to-do items have no
 * `due` at all, so for them the event is the only time source; a stock list
 * item with `due_datetime` files itself. A chore with neither falls into
 * `chores`, which is what Skylight does with undated chores.
 */
export function groupTasks(person, tz) {
  const tasks = tasksOf(person).map((task) => ({ ...task, start: null }));

  const { pairs } = linkChores(person.events, tasks);
  for (const { event, chore } of pairs) {
    if (chore) chore.start = event.start;
  }
  for (const task of tasks) {
    if (!task.start && task.due && task.dueHasTime) task.start = task.due;
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
