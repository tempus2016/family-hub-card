import { describe, it, expect } from 'vitest';
import {
  localDayWindow,
  isSameLocalDay,
  msUntilNextMinute,
  msUntilNextLocalMidnight,
} from '../src/data/time.js';

const TZ = 'Europe/London';

describe('localDayWindow', () => {
  it('spans local midnight to next local midnight in BST', () => {
    const now = new Date('2026-08-03T14:30:00Z');
    const { start, end } = localDayWindow(now, TZ);
    expect(start.toISOString()).toBe('2026-08-02T23:00:00.000Z');
    expect(end.toISOString()).toBe('2026-08-03T23:00:00.000Z');
  });

  it('spans local midnight in GMT', () => {
    const now = new Date('2026-01-15T14:30:00Z');
    const { start, end } = localDayWindow(now, TZ);
    expect(start.toISOString()).toBe('2026-01-15T00:00:00.000Z');
    expect(end.toISOString()).toBe('2026-01-16T00:00:00.000Z');
  });

  it('lands on exact midnight when now carries milliseconds', () => {
    // Regression: tzOffsetMs compared a second-precision wall clock against a
    // millisecond-precision timestamp, so the window ended a few hundred ms
    // after local midnight and admitted the first instant of the next day.
    const now = new Date('2026-08-03T14:30:00.246Z');
    const { start, end } = localDayWindow(now, TZ);
    expect(start.toISOString()).toBe('2026-08-02T23:00:00.000Z');
    expect(end.toISOString()).toBe('2026-08-03T23:00:00.000Z');
  });

  it('produces a 23-hour window on the spring DST transition', () => {
    const now = new Date('2026-03-29T12:00:00Z');
    const { start, end } = localDayWindow(now, TZ);
    expect(end - start).toBe(23 * 3600 * 1000);
  });

  it('produces a 25-hour window on the autumn DST transition', () => {
    const now = new Date('2026-10-25T12:00:00Z');
    const { start, end } = localDayWindow(now, TZ);
    expect(end - start).toBe(25 * 3600 * 1000);
  });
});

describe('isSameLocalDay', () => {
  it('treats times either side of UTC midnight but same local day as equal', () => {
    const a = new Date('2026-08-02T23:30:00Z');
    const b = new Date('2026-08-03T10:00:00Z');
    expect(isSameLocalDay(a, b, TZ)).toBe(true);
  });

  it('separates different local days', () => {
    const a = new Date('2026-08-02T22:30:00Z');
    const b = new Date('2026-08-03T10:00:00Z');
    expect(isSameLocalDay(a, b, TZ)).toBe(false);
  });
});

describe('msUntilNextMinute', () => {
  it('returns remainder to the next minute boundary', () => {
    expect(msUntilNextMinute(new Date('2026-08-03T10:00:20.000Z'))).toBe(40000);
  });

  it('returns a full minute exactly on the boundary', () => {
    expect(msUntilNextMinute(new Date('2026-08-03T10:00:00.000Z'))).toBe(60000);
  });
});

describe('msUntilNextLocalMidnight', () => {
  it('counts to the next local midnight, not UTC midnight', () => {
    const now = new Date('2026-08-03T22:00:00Z');
    expect(msUntilNextLocalMidnight(now, TZ)).toBe(3600 * 1000);
  });
});
