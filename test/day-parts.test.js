import { describe, it, expect } from 'vitest';
import { dayPart, groupTasks } from '../src/data/day-parts.js';

const TZ = 'Europe/London';

// August is BST, so 11:00Z is 12:00 local — getting this wrong files every
// task an hour early for half the year, hence the UTC-stated boundaries.
describe('dayPart', () => {
  it('calls 06:00 local morning', () => {
    expect(dayPart(new Date('2026-08-10T05:00:00Z'), TZ)).toBe('morning');
  });

  it('treats 11:59 local as morning', () => {
    expect(dayPart(new Date('2026-08-10T10:59:00Z'), TZ)).toBe('morning');
  });

  it('treats 12:00 local as afternoon', () => {
    expect(dayPart(new Date('2026-08-10T11:00:00Z'), TZ)).toBe('afternoon');
  });

  it('treats 17:59 local as afternoon', () => {
    expect(dayPart(new Date('2026-08-10T16:59:00Z'), TZ)).toBe('afternoon');
  });

  it('treats 18:00 local as evening', () => {
    expect(dayPart(new Date('2026-08-10T17:00:00Z'), TZ)).toBe('evening');
  });

  it('respects the timezone rather than UTC', () => {
    // 23:30 UTC is 00:30 the next day in Europe/London during BST.
    expect(dayPart(new Date('2026-08-10T23:30:00Z'), TZ)).toBe('morning');
  });
});

const at = (summary, iso) => ({
  id: `e-${summary}`, summary, allDay: false,
  start: new Date(iso), end: new Date(iso),
});

const person = (over = {}) => ({
  id: 'ana', name: 'Ana', todo: 'todo.ana',
  events: [], chores: [], completedToday: [], ...over,
});

describe('groupTasks', () => {
  it('files each task under its event time', () => {
    const p = person({
      events: [
        at('Make bed', '2026-08-10T05:00:00Z'),
        at('Pack school bag', '2026-08-10T11:00:00Z'),
        at('Brush teeth', '2026-08-10T20:00:00Z'),
      ],
      chores: [
        { id: '1', summary: 'Make bed', status: 'needs_action' },
        { id: '2', summary: 'Pack school bag', status: 'needs_action' },
        { id: '3', summary: 'Brush teeth', status: 'needs_action' },
      ],
    });
    const g = groupTasks(p, TZ);
    expect(g.morning.map((t) => t.summary)).toEqual(['Make bed']);
    expect(g.afternoon.map((t) => t.summary)).toEqual(['Pack school bag']);
    expect(g.evening.map((t) => t.summary)).toEqual(['Brush teeth']);
    expect(g.chores).toEqual([]);
  });

  it('files a chore with no event under chores', () => {
    const p = person({ chores: [{ id: '1', summary: 'Tidy bedroom', status: 'needs_action' }] });
    const g = groupTasks(p, TZ);
    expect(g.chores.map((t) => t.summary)).toEqual(['Tidy bedroom']);
    expect(g.morning).toEqual([]);
  });

  it('carries completion state onto the task', () => {
    const p = person({
      events: [at('Make bed', '2026-08-10T05:00:00Z')],
      chores: [{ id: '1', summary: 'Make bed', status: 'completed' }],
    });
    expect(groupTasks(p, TZ).morning[0]).toMatchObject({ done: true, tappable: false });
  });

  it('carries an unapproved TaskMate completion as pending and untappable', () => {
    const p = person({
      events: [at('Make bed', '2026-08-10T05:00:00Z')],
      completedToday: [{ choreId: 'c1', name: 'Make bed', approved: false }],
    });
    expect(groupTasks(p, TZ).morning[0]).toMatchObject({ done: true, pending: true, tappable: false });
  });

  it('sorts within a group by event time', () => {
    const p = person({
      events: [
        at('Get dressed', '2026-08-10T06:00:00Z'),
        at('Make bed', '2026-08-10T05:00:00Z'),
      ],
      chores: [
        { id: '1', summary: 'Make bed', status: 'needs_action' },
        { id: '2', summary: 'Get dressed', status: 'needs_action' },
      ],
    });
    expect(groupTasks(p, TZ).morning.map((t) => t.summary)).toEqual(['Make bed', 'Get dressed']);
  });

  it('returns four empty groups for a person with nothing', () => {
    expect(groupTasks(person(), TZ)).toEqual({ morning: [], afternoon: [], evening: [], chores: [] });
  });
});
