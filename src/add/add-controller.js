import { logFailure } from '../data/log.js';

/**
 * Creating items, and working out what this instance can actually create.
 *
 * The picker only ever offers what will work. Verified against a live instance:
 * a TaskMate to-do list reports UPDATE only, TaskMate's calendars report 0, and
 * taskmate/add_chore is admin-gated — so all three types can be unavailable for
 * entirely different reasons, and a button that fails on tap is worse than one
 * that isn't there.
 */

const TODO_CREATE = 1; // TodoListEntityFeature.CREATE_TODO_ITEM
const TODO_DUE_DATE = 16; // TodoListEntityFeature.SET_DUE_DATE_ON_ITEM
const CALENDAR_CREATE = 1; // CalendarEntityFeature.CREATE_EVENT

/** Where TaskMate's own chore editor lives. */
export const TASKMATE_PANEL = '/taskmate-admin';

const supports = (hass, entityId, bit) =>
  Boolean(entityId && ((hass?.states?.[entityId]?.attributes?.supported_features || 0) & bit));

/** To-do lists configured on this card that can accept new items. */
export function creatableTodoLists(hass, config) {
  return (config.people || [])
    .map((p) => p.todo)
    .filter((id) => supports(hass, id, TODO_CREATE));
}

/**
 * Whether a list accepts a due date.
 *
 * Separate from CREATE, and easy to miss: Home Assistant's own Local To-do
 * reports 15 — create, delete, update, move — without SET_DUE_DATE. Offering
 * the field regardless makes the service reject the entire call with
 * "Entity does not support setting field: due_date".
 */
export function supportsDueDate(hass, entityId) {
  return supports(hass, entityId, TODO_DUE_DATE);
}

/** Calendars configured on this card that can accept new events. */
export function creatableCalendars(hass, config) {
  return (config.people || [])
    .flatMap((p) => p.calendars || [])
    .filter((id) => supports(hass, id, CALENDAR_CREATE));
}

/**
 * Which types the picker offers, in a stable order.
 *
 * The chore type is hidden rather than shown-and-failing for a non-admin: the
 * wall tablet this card exists for usually runs as a kiosk user, so a visible
 * option it can never use would be a permanent dead end on the target device.
 */
export function availableTypes(hass, config) {
  const types = [];
  if (creatableTodoLists(hass, config).length) types.push('todo');
  if (creatableCalendars(hass, config).length) types.push('calendar');
  if (config.taskmateChores && hass?.user?.is_admin) types.push('chore');
  return types;
}

/** `todo.add_item` payload. Sends one due field or neither, never both. */
export function todoPayload({ entityId, title, due }) {
  const payload = { entity_id: entityId, item: title };
  if (due) {
    if (due.includes('T')) payload.due_datetime = due;
    else payload.due_date = due;
  }
  return payload;
}

function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

/** `calendar.create_event` payload. Date pair for all-day, datetime pair otherwise. */
export function eventPayload({ entityId, title, date, allDay, start, end, description, location }) {
  const payload = { entity_id: entityId, summary: title };
  if (description) payload.description = description;
  if (location) payload.location = location;

  if (allDay || !start) {
    payload.start_date = date;
    // The API treats end_date as exclusive, so a single day ends on the next.
    payload.end_date = addDays(date, 1);
    return payload;
  }

  payload.start_date_time = `${date}T${start}:00`;
  if (end) {
    payload.end_date_time = `${date}T${end}:00`;
    return payload;
  }

  // Default to an hour, rolling into the next day rather than emitting an end
  // that precedes its start.
  const [h, min] = start.split(':').map(Number);
  const endH = h + 1;
  const endDate = endH > 23 ? addDays(date, 1) : date;
  const hh = String(endH % 24).padStart(2, '0');
  const mm = String(min).padStart(2, '0');
  payload.end_date_time = `${endDate}T${hh}:${mm}:00`;
  return payload;
}

/** TaskMate chore creation. Admin-gated on TaskMate's side. */
export function chorePayload({ name, points, assignedTo, requiresApproval }) {
  return {
    type: 'taskmate/add_chore',
    name,
    points: Number(points) || 0,
    assigned_to: assignedTo || [],
    requires_approval: requiresApproval !== false,
  };
}

/** Children TaskMate knows about, read from the configured points sensors. */
export function taskmateChildren(hass, config) {
  const out = [];
  for (const p of config.people || []) {
    const st = p.points && hass?.states?.[p.points];
    const id = st?.attributes?.child_id;
    if (id) out.push({ id, name: st.attributes.child_name || p.name });
  }
  return out;
}

export async function createTodo(hass, fields) {
  try {
    await hass.callService('todo', 'add_item', todoPayload(fields));
    return { ok: true };
  } catch (err) {
    logFailure(`add:todo:${fields.entityId}`, `could not add to ${fields.entityId}`, err);
    return { ok: false, error: err?.message || String(err) };
  }
}

export async function createEvent(hass, fields) {
  try {
    await hass.callService('calendar', 'create_event', eventPayload(fields));
    return { ok: true };
  } catch (err) {
    logFailure(`add:event:${fields.entityId}`, `could not add to ${fields.entityId}`, err);
    return { ok: false, error: err?.message || String(err) };
  }
}

export async function createChore(hass, fields) {
  try {
    await hass.callWS(chorePayload(fields));
    return { ok: true };
  } catch (err) {
    logFailure('add:chore', 'could not add TaskMate chore', err);
    return { ok: false, error: err?.message || String(err) };
  }
}
