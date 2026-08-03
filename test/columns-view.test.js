import { describe, it, expect } from 'vitest';
import { columnFor, eventTime } from '../src/views/columns-view.js';

const TZ = 'Europe/London';

const person = (over = {}) => ({
  id: 'ana', name: 'Ana', color: '#4A9EFF', initials: 'A',
  events: [], chores: [], completedToday: [], points: null, failures: [], todo: 'todo.ana',
  ...over,
});

describe('eventTime', () => {
  it('renders an all-day event as All day', () => {
    expect(eventTime({ allDay: true, start: new Date('2026-08-03T00:00:00Z') }, TZ)).toBe('All day');
  });

  it('renders a start time for a point event', () => {
    const e = { allDay: false, start: new Date('2026-08-03T13:30:00Z'), end: new Date('2026-08-03T13:30:00Z') };
    expect(eventTime(e, TZ)).toBe('14:30');
  });

  it('renders a range when the event has a distinct end', () => {
    const e = { allDay: false, start: new Date('2026-08-03T06:00:00Z'), end: new Date('2026-08-03T18:00:00Z') };
    expect(eventTime(e, TZ)).toBe('07:00 – 19:00');
  });
});

describe('columnFor', () => {
  it('splits chores into outstanding and done, done last', () => {
    const p = person({
      chores: [
        { id: '1', summary: 'Car fuel', status: 'needs_action' },
        { id: '2', summary: 'Bins out', status: 'completed' },
      ],
    });
    const col = columnFor(p);
    expect(col.chores.map((c) => c.summary)).toEqual(['Car fuel', 'Bins out']);
    expect(col.chores.map((c) => c.done)).toEqual([false, true]);
  });

  it('appends TaskMate completions that have left the list', () => {
    const p = person({
      chores: [{ id: '1', summary: 'Car fuel', status: 'needs_action' }],
      completedToday: [{ choreId: 'c9', name: 'Tidy room', approved: true }],
    });
    const col = columnFor(p);
    expect(col.chores.map((c) => c.summary)).toEqual(['Car fuel', 'Tidy room']);
    expect(col.chores[1].done).toBe(true);
    expect(col.chores[1].tappable).toBe(false);
  });

  it('marks an unapproved completion as pending', () => {
    const p = person({ completedToday: [{ choreId: 'c9', name: 'Dog', approved: false }] });
    expect(columnFor(p).chores[0].pending).toBe(true);
  });

  it('does not duplicate a chore present in both sources', () => {
    const p = person({
      chores: [{ id: '1', summary: 'Bins out', status: 'completed' }],
      completedToday: [{ choreId: 'c1', name: 'Bins out', approved: true }],
    });
    expect(columnFor(p).chores).toHaveLength(1);
  });

  it('reports the outstanding count for the divider', () => {
    const p = person({
      chores: [
        { id: '1', summary: 'A', status: 'needs_action' },
        { id: '2', summary: 'B', status: 'needs_action' },
        { id: '3', summary: 'C', status: 'completed' },
      ],
    });
    expect(columnFor(p).outstanding).toBe(2);
  });

  it('says a person has no chore list rather than showing an empty section', () => {
    expect(columnFor(person({ todo: null })).hasChores).toBe(false);
  });

  it('keeps the chores section for a person whose list is merely empty', () => {
    expect(columnFor(person({ todo: 'todo.ana', chores: [] })).hasChores).toBe(true);
  });
});
