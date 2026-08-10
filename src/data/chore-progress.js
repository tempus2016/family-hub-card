/**
 * Today's chore completion for one person.
 *
 * TaskMate drops a chore from the to-do list the moment it is ticked, so the
 * completed count has to come from both the list and TaskMate's record of
 * today's completions.
 */
export function choreProgress(person) {
  const chores = person.chores || [];
  const outstanding = chores.filter((c) => c.status !== 'completed').length;
  const done = chores.filter((c) => c.status === 'completed').length + (person.completedToday || []).length;
  const total = outstanding + done;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}
