/**
 * TaskMate is read through public sensor entities only. Its websocket API is
 * admin-gated, and a wall tablet is typically signed in as a non-admin user.
 */

const UNKNOWN = new Set(['unavailable', 'unknown', '']);

export function readPoints(hass, person) {
  if (!person.points) return null;
  const st = hass?.states?.[person.points];
  if (!st) return null;

  const a = st.attributes || {};
  const balance = UNKNOWN.has(st.state) ? null : Number(st.state);

  return {
    balance: Number.isNaN(balance) ? null : balance,
    unit: a.unit_of_measurement || 'points',
    // Never derived from completion records: their `points` field is the raw
    // catalogue price, which ignores difficulty, weekend and speed multipliers.
    earnedToday: a.points_earned_today ?? null,
    pendingToday: a.points_pending_today ?? null,
    childId: a.child_id ?? null,
  };
}

export function readCompletions(hass, entityId) {
  if (!entityId) return [];
  const st = hass?.states?.[entityId];
  const raw = st?.attributes?.todays_completions;
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((r) => r.child_id !== '__parent__')
    .map((r) => ({
      choreId: r.chore_id,
      childId: r.child_id,
      // Bonus subtasks arrive pre-formatted as "Chore › Subtask".
      name: r.chore_name || '',
      approved: Boolean(r.approved),
      completedAt: new Date(r.completed_at),
    }));
}

export function completionsForPerson(completions, person) {
  if (!person.taskmateChildId) return [];
  return completions.filter((c) => c.childId === person.taskmateChildId);
}
