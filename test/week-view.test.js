import { describe, it, expect } from 'vitest';
import { buildDays, bucketByDay, choreProgress, completedNames, chipState, barPeriod } from '../src/views/week-view.js';
import { localDayWindow } from '../src/data/time.js';

const TZ = 'Europe/London';

describe('buildDays', () => {
  it('starts today and runs seven local days', () => {
    const days = buildDays(new Date('2026-08-03T10:00:00Z'), TZ);
    expect(days).toHaveLength(7);
    expect(days.map((d) => d.dayNum)).toEqual([3, 4, 5, 6, 7, 8, 9]);
    expect(days[0].isToday).toBe(true);
    expect(days.filter((d) => d.isToday)).toHaveLength(1);
  });

  it('rolls over month ends', () => {
    const days = buildDays(new Date('2026-08-29T10:00:00Z'), TZ);
    expect(days.map((d) => d.dayNum)).toEqual([29, 30, 31, 1, 2, 3, 4]);
  });

  it('keeps consecutive days across the autumn DST change', () => {
    // 25 Oct 2026 is a 25-hour day; naive 24h stepping repeats a date.
    const days = buildDays(new Date('2026-10-23T10:00:00Z'), TZ);
    expect(days.map((d) => d.dayNum)).toEqual([23, 24, 25, 26, 27, 28, 29]);
  });

  it('keeps consecutive days across the spring DST change', () => {
    const days = buildDays(new Date('2026-03-27T10:00:00Z'), TZ);
    expect(days.map((d) => d.dayNum)).toEqual([27, 28, 29, 30, 31, 1, 2]);
  });
});

describe('bucketByDay', () => {
  const days = buildDays(new Date('2026-08-03T10:00:00Z'), TZ);

  it('files each event under its own local day', () => {
    const events = [
      { summary: 'Today', start: new Date('2026-08-03T09:00:00Z'), allDay: false },
      { summary: 'Wed', start: new Date('2026-08-05T09:00:00Z'), allDay: false },
      { summary: 'Sun', start: new Date('2026-08-09T09:00:00Z'), allDay: false },
    ];
    const buckets = bucketByDay(events, days, TZ);
    expect(buckets[0].map((e) => e.summary)).toEqual(['Today']);
    expect(buckets[2].map((e) => e.summary)).toEqual(['Wed']);
    expect(buckets[6].map((e) => e.summary)).toEqual(['Sun']);
    expect(buckets[1]).toEqual([]);
  });

  it('files a late-evening BST event under the right day, not the UTC one', () => {
    // 23:30 local on the 3rd is 22:30Z — still the 3rd locally.
    const events = [{ summary: 'Late', start: new Date('2026-08-03T22:30:00Z'), allDay: false }];
    const buckets = bucketByDay(events, days, TZ);
    expect(buckets[0].map((e) => e.summary)).toEqual(['Late']);
  });

  it('returns empty buckets when a person has no events', () => {
    expect(bucketByDay(undefined, days, TZ).every((b) => b.length === 0)).toBe(true);
  });
});

describe('choreProgress', () => {
  it('counts outstanding and completed', () => {
    const p = {
      chores: [
        { status: 'needs_action' },
        { status: 'needs_action' },
        { status: 'completed' },
      ],
      completedToday: [],
    };
    expect(choreProgress(p)).toEqual({ done: 1, total: 3, pct: 33 });
  });

  it("includes TaskMate's completed-today records", () => {
    const p = {
      chores: [{ status: 'needs_action' }],
      completedToday: [{ name: 'Bins' }, { name: 'Dog' }],
    };
    expect(choreProgress(p)).toEqual({ done: 2, total: 3, pct: 67 });
  });

  it('reports zero rather than NaN when there are no chores', () => {
    expect(choreProgress({ chores: [], completedToday: [] })).toEqual({ done: 0, total: 0, pct: 0 });
  });
});

describe('the seven-day fetch window', () => {
  it('spans seven local days and stays exact across the autumn DST change', () => {
    const { start, end } = localDayWindow(new Date('2026-10-23T10:00:00Z'), TZ, 7);
    // One of those seven days is 25 hours long.
    expect(end - start).toBe((7 * 24 + 1) * 3600 * 1000);
  });

  it('still returns one day by default', () => {
    const { start, end } = localDayWindow(new Date('2026-08-03T10:00:00Z'), TZ);
    expect(end - start).toBe(24 * 3600 * 1000);
  });
});

describe('completedNames', () => {
  it('collects completed chores from the todo list', () => {
    const p = { chores: [{ summary: 'Make bed', status: 'completed' }, { summary: 'Brush teeth', status: 'needs_action' }] };
    expect([...completedNames(p)]).toEqual(['Make bed']);
  });

  it("includes TaskMate records for chores that have left the todo list", () => {
    const p = { chores: [], completedToday: [{ name: 'Pack school bag' }] };
    expect([...completedNames(p)]).toEqual(['Pack school bag']);
  });

  it('merges both sources without duplicating', () => {
    const p = {
      chores: [{ summary: 'Make bed', status: 'completed' }],
      completedToday: [{ name: 'Make bed' }, { name: 'Dog' }],
    };
    expect([...completedNames(p)].sort()).toEqual(['Dog', 'Make bed']);
  });

  it('returns an empty set for a person with nothing done', () => {
    expect(completedNames({ chores: [{ summary: 'X', status: 'needs_action' }] }).size).toBe(0);
  });

  it('tolerates a person with no chore data at all', () => {
    expect(completedNames({}).size).toBe(0);
  });
});

describe('chipState', () => {
  const done = new Set(['Make bed', 'Pack school bag']);

  it('marks a matching chip complete in today’s column', () => {
    expect(chipState({ summary: 'Make bed', allDay: false }, true, done).complete).toBe(true);
  });

  it('leaves a non-matching chip alone', () => {
    expect(chipState({ summary: 'Swimming', allDay: false }, true, done).complete).toBe(false);
  });

  it('never marks a chip complete outside today, even when the name matches', () => {
    expect(chipState({ summary: 'Make bed', allDay: false }, false, done).complete).toBe(false);
  });

  it('keeps the all-day ghost treatment independent of completion', () => {
    expect(chipState({ summary: 'Make bed', allDay: true }, true, done)).toEqual({ complete: true, ghost: true });
  });
});

describe('barPeriod', () => {
  it('reads Today on the current week', () => {
    expect(barPeriod(0, new Date('2026-08-03T10:00:00Z'))).toBe('Today');
  });

  it('names the week when paged away', () => {
    expect(barPeriod(7, new Date('2026-08-10T10:00:00Z'))).toMatch(/^Week of /);
  });
});
