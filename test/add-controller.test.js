import { describe, it, expect } from 'vitest';
import { availableTypes, todoPayload, eventPayload, supportsDueDate } from '../src/add/add-controller.js';

const CREATE = 1;
const UPDATE = 4;

function hass({ admin = false, states = {} } = {}) {
  return { user: { is_admin: admin }, states };
}

const cfg = (over = {}) => ({
  taskmateChores: null,
  people: [{ id: 'ana', todo: 'todo.ana', calendars: ['calendar.ana'] }],
  ...over,
});

describe('availableTypes', () => {
  it('offers todo when a configured list can create', () => {
    const h = hass({ states: { 'todo.ana': { attributes: { supported_features: CREATE } } } });
    expect(availableTypes(h, cfg())).toEqual(['todo']);
  });

  it('does not offer todo when the only list is update-only', () => {
    // TaskMate's per-child lists are exactly this.
    const h = hass({ states: { 'todo.ana': { attributes: { supported_features: UPDATE } } } });
    expect(availableTypes(h, cfg())).toEqual([]);
  });

  it('offers calendar when a configured calendar can create events', () => {
    const h = hass({ states: { 'calendar.ana': { attributes: { supported_features: CREATE } } } });
    expect(availableTypes(h, cfg())).toEqual(['calendar']);
  });

  it('does not offer calendar for a read-only calendar', () => {
    // TaskMate's calendars report 0.
    const h = hass({ states: { 'calendar.ana': { attributes: { supported_features: 0 } } } });
    expect(availableTypes(h, cfg())).toEqual([]);
  });

  it('offers the TaskMate chore only to an admin', () => {
    const states = { 'sensor.tm': { attributes: {} } };
    const c = cfg({ taskmateChores: 'sensor.tm' });
    expect(availableTypes(hass({ admin: true, states }), c)).toEqual(['chore']);
    expect(availableTypes(hass({ admin: false, states }), c)).toEqual([]);
  });

  it('does not offer the chore to an admin with no TaskMate configured', () => {
    expect(availableTypes(hass({ admin: true }), cfg())).toEqual([]);
  });

  it('returns every qualifying type in a stable order', () => {
    const h = hass({
      admin: true,
      states: {
        'todo.ana': { attributes: { supported_features: CREATE } },
        'calendar.ana': { attributes: { supported_features: CREATE } },
        'sensor.tm': { attributes: {} },
      },
    });
    expect(availableTypes(h, cfg({ taskmateChores: 'sensor.tm' }))).toEqual(['todo', 'calendar', 'chore']);
  });

  it('ignores entities that are not configured on the card', () => {
    const h = hass({ states: { 'todo.somebody_else': { attributes: { supported_features: CREATE } } } });
    expect(availableTypes(h, cfg())).toEqual([]);
  });

  it('tolerates a configured entity missing from hass', () => {
    expect(availableTypes(hass(), cfg())).toEqual([]);
  });
});

describe('todoPayload', () => {
  it('sends only item when there is no due date', () => {
    expect(todoPayload({ entityId: 'todo.ana', title: 'Bins' }))
      .toEqual({ entity_id: 'todo.ana', item: 'Bins' });
  });

  it('sends due_date for a date-only due', () => {
    expect(todoPayload({ entityId: 'todo.ana', title: 'Bins', due: '2026-08-05' }))
      .toEqual({ entity_id: 'todo.ana', item: 'Bins', due_date: '2026-08-05' });
  });

  it('sends due_datetime, never both, when the due carries a time', () => {
    const p = todoPayload({ entityId: 'todo.ana', title: 'Bins', due: '2026-08-05T18:00:00' });
    expect(p.due_datetime).toBe('2026-08-05T18:00:00');
    expect(p.due_date).toBeUndefined();
  });
});

describe('eventPayload', () => {
  it('uses the date pair for an all-day event', () => {
    const p = eventPayload({ entityId: 'calendar.ana', title: 'Away', date: '2026-08-05', allDay: true });
    expect(p).toEqual({
      entity_id: 'calendar.ana', summary: 'Away',
      start_date: '2026-08-05', end_date: '2026-08-06',
    });
  });

  it('ends an all-day event on the following day, as the API expects', () => {
    const p = eventPayload({ entityId: 'calendar.ana', title: 'Away', date: '2026-08-31', allDay: true });
    expect(p.end_date).toBe('2026-09-01');
  });

  it('uses the datetime pair for a timed event', () => {
    const p = eventPayload({
      entityId: 'calendar.ana', title: 'Dentist', date: '2026-08-05',
      start: '14:30', end: '15:00',
    });
    expect(p.start_date_time).toBe('2026-08-05T14:30:00');
    expect(p.end_date_time).toBe('2026-08-05T15:00:00');
    expect(p.start_date).toBeUndefined();
  });

  it('defaults a timed event to one hour when no end is given', () => {
    const p = eventPayload({ entityId: 'calendar.ana', title: 'Call', date: '2026-08-05', start: '09:00' });
    expect(p.end_date_time).toBe('2026-08-05T10:00:00');
  });

  it('rolls a late start into the next day rather than emitting an end before the start', () => {
    const p = eventPayload({ entityId: 'calendar.ana', title: 'Late', date: '2026-08-05', start: '23:30' });
    expect(p.end_date_time).toBe('2026-08-06T00:30:00');
  });
});

describe('supportsDueDate', () => {
  const DUE = 16;

  it('is false for a list that can create but not set a due date', () => {
    // Home Assistant's own Local To-do reports exactly this.
    const h = hass({ states: { 'todo.ana': { attributes: { supported_features: 15 } } } });
    expect(supportsDueDate(h, 'todo.ana')).toBe(false);
  });

  it('is true when the list sets due dates', () => {
    const h = hass({ states: { 'todo.ana': { attributes: { supported_features: CREATE | DUE } } } });
    expect(supportsDueDate(h, 'todo.ana')).toBe(true);
  });

  it('is false for an entity missing from hass', () => {
    expect(supportsDueDate(hass(), 'todo.nope')).toBe(false);
  });
});
