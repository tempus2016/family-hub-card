import { localDayWindow } from './time.js';
import { iconFor } from './chore-meta.js';

/**
 * One person's chores as a single list, whatever their source.
 *
 * Two sources overlap: the to-do list, and TaskMate's record of what was
 * completed today. TaskMate drops a chore from its list the moment it is
 * ticked, so its completions have to be appended — but a stock list keeps
 * completed items, so the same chore can appear in both. Merged on name.
 *
 * A completion that only exists in TaskMate's record has no to-do item behind
 * it, so it cannot be tapped — there is nothing left to update.
 *
 * Order is the priority the event matcher needs: an outstanding chore claims
 * its calendar event ahead of a completed one of the same name.
 *
 * Every view used to do this merge itself, each slightly differently. It is
 * done once here, in `HubData._rebuild`, and views read `person.tasks`.
 */
export function buildTasks(person, { now = new Date(), tz = 'UTC', maxCompleted = Infinity, meta = null, sessions = null } = {}) {
  const { start: today } = localDayWindow(now, tz);
  const outstanding = [];
  const completed = [];
  const seen = new Set();

  for (const c of person.chores || []) {
    seen.add(c.summary);
    const done = c.status === 'completed';
    const m = meta?.get(c.id) || null;
    const task = {
      id: c.id,
      summary: c.summary,
      done,
      pending: false,
      tappable: !done,
      // A chore that needs a note, photo or count opens a sheet instead of
      // the undo timer; see chore-meta.js.
      needs: m?.needs || null,
      asks: m?.asks || [],
      unit: m?.unit || null,
      max: m?.max || 0,
      rateMinutes: m?.rateMinutes || 0,
      ratePoints: m?.ratePoints || 0,
      capMinutes: m?.capMinutes || 0,
      timer: (m?.needs === 'timer' && sessions?.get(`${c.id}|${person.taskmateChildId}`)) || null,
      icon: iconFor(c.summary, m),
      stars: m?.stars || 0,
      due: c.due || null,
      dueHasTime: Boolean(c.dueHasTime),
      overdue: !done && Boolean(c.due) && c.due < today,
      kind: 'todo',
    };
    (done ? completed : outstanding).push(task);
  }

  // Home Assistant's Local To-do keeps completed items until someone clears
  // them, so without a cap a person's card fills with struck-through history.
  const shownCompleted = completed.slice(0, Math.max(0, maxCompleted));

  const today_ = [];
  for (const c of person.completedToday || []) {
    if (seen.has(c.name)) continue;
    seen.add(c.name);
    const m = meta?.get(c.choreId) || null;
    today_.push({
      id: c.choreId,
      summary: c.name,
      done: true,
      pending: !c.approved,
      tappable: false,
      needs: null,
      icon: iconFor(c.name, m),
      stars: m?.stars || 0,
      due: null,
      dueHasTime: false,
      overdue: false,
      kind: 'completion',
    });
  }

  return [...outstanding, ...shownCompleted, ...today_];
}

/**
 * Today's completion for one person, counted over everything rather than the
 * capped display list — three hidden completions are still three done.
 */
export function progressOf(person) {
  if (person.progress) return person.progress;
  const chores = person.chores || [];
  const outstanding = chores.filter((c) => c.status !== 'completed').length;
  const done = chores.filter((c) => c.status === 'completed').length + (person.completedToday || []).length;
  const total = outstanding + done;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/** The built list when the model carries one, otherwise built on the spot. */
export function tasksOf(person) {
  return person.tasks || buildTasks(person);
}
