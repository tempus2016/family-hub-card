import { isSameLocalDay } from './time.js';

/**
 * A todo entity's state is its outstanding count, so any tick changes state
 * and lets the card re-list. TaskMate's per-child lists are ordinary todo
 * entities, so this one path serves both stock lists and TaskMate.
 */

function parseDue(due, tz) {
  if (!due) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    const [y, m, d] = due.split('-').map(Number);
    // Midday anchor keeps the date stable under any timezone shift.
    return new Date(Date.UTC(y, m - 1, d, 12));
  }
  return new Date(due);
}

export function filterChores(items, filter, now, tz) {
  return (items || [])
    .map((it) => ({
      id: it.uid,
      summary: it.summary || '',
      status: it.status === 'completed' ? 'completed' : 'needs_action',
      due: parseDue(it.due, tz),
    }))
    .filter((c) => {
      if (filter === 'all') return true;
      if (c.status === 'completed') return true;
      if (!c.due) return true;
      return c.due <= now || isSameLocalDay(c.due, now, tz);
    });
}

export async function fetchChores(hass, people, filter, now, tz) {
  const choresByPerson = {};
  const failures = [];

  await Promise.all(
    people
      .filter((p) => p.todo)
      .map(async (p) => {
        try {
          const res = await hass.callWS({ type: 'todo/item/list', entity_id: p.todo });
          choresByPerson[p.id] = filterChores(res?.items, filter, now, tz).map((c) => ({
            ...c,
            personId: p.id,
          }));
        } catch {
          failures.push(p.todo);
          choresByPerson[p.id] = [];
        }
      }),
  );

  return { choresByPerson, failures };
}

export async function completeChore(hass, entityId, uid) {
  await hass.callService('todo', 'update_item', {
    entity_id: entityId,
    item: uid,
    status: 'completed',
  });
}
