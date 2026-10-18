import { describe, it, expect } from 'vitest';
import { buildDays, bucketByDay, weekStartOffset } from '../src/data/calendar-grid.js';
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

  it('still starts today after midday', () => {
    // 13:00 BST. Anchoring on now+12h lands in tomorrow, which is what the
    // wall tablet showed every afternoon.
    const days = buildDays(new Date('2026-08-10T12:00:00Z'), TZ);
    expect(days.map((d) => d.dayNum)).toEqual([10, 11, 12, 13, 14, 15, 16]);
  });

  it('still starts today in the last half hour of the day', () => {
    const days = buildDays(new Date('2026-08-10T22:30:00Z'), TZ);
    expect(days.map((d) => d.dayNum)).toEqual([10, 11, 12, 13, 14, 15, 16]);
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

describe('weekStartOffset', () => {
  it('is zero on a Monday for a monday week', () => {
    expect(weekStartOffset(new Date('2026-08-10T10:00:00Z'), TZ, 'monday')).toBe(0);
  });

  it('steps back to Monday from a Thursday', () => {
    expect(weekStartOffset(new Date('2026-08-13T10:00:00Z'), TZ, 'monday')).toBe(-3);
  });

  it('steps back six days from a Sunday for a monday week', () => {
    expect(weekStartOffset(new Date('2026-08-16T10:00:00Z'), TZ, 'monday')).toBe(-6);
  });

  it('steps back to Sunday for a sunday week', () => {
    expect(weekStartOffset(new Date('2026-08-13T10:00:00Z'), TZ, 'sunday')).toBe(-4);
  });

  it('is always zero for a rolling week', () => {
    expect(weekStartOffset(new Date('2026-08-13T10:00:00Z'), TZ, 'today')).toBe(0);
  });

  it('decides the weekday in the dashboard timezone, not UTC', () => {
    // 23:30Z on Sunday 16th is already Monday 17th 00:30 in London.
    expect(weekStartOffset(new Date('2026-08-16T23:30:00Z'), TZ, 'monday')).toBe(0);
  });
});

describe('buildDays from a week start', () => {
  it('marks the real today wherever it falls in the week', () => {
    const today = new Date('2026-08-13T10:00:00Z');
    const days = buildDays(today, TZ, 7, -3);
    expect(days.map((d) => d.dayNum)).toEqual([10, 11, 12, 13, 14, 15, 16]);
    expect(days.map((d) => d.isToday)).toEqual([false, false, false, true, false, false, false]);
  });
});

