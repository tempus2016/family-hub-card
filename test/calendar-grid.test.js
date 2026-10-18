import { describe, it, expect } from 'vitest';
import { hourRange, lanes, monthGrid, monthStartOffset, eventsOn } from '../src/data/calendar-grid.js';

const TZ = 'Europe/London';
const ev = (s, e, id = s) => ({ id, start: new Date(s), end: new Date(e), allDay: false });

describe('hourRange', () => {
  it('spans 7 to 21 with no events', () => {
    expect(hourRange([], TZ)).toEqual({ from: 7, to: 21 });
  });

  it('widens to cover early and late events, rounded to whole hours', () => {
    const r = hourRange([ev('2026-10-18T05:30:00+01:00', '2026-10-18T06:00:00+01:00'), ev('2026-10-18T21:15:00+01:00', '2026-10-18T22:40:00+01:00')], TZ);
    expect(r).toEqual({ from: 5, to: 23 });
  });

  it('ignores all-day events', () => {
    expect(hourRange([{ allDay: true, start: new Date('2026-10-17T23:00:00Z'), end: new Date('2026-10-18T23:00:00Z') }], TZ)).toEqual({ from: 7, to: 21 });
  });
});

describe('lanes', () => {
  it('puts non-overlapping events in one lane', () => {
    const out = lanes([ev('2026-10-18T09:00Z', '2026-10-18T10:00Z'), ev('2026-10-18T10:00Z', '2026-10-18T11:00Z')]);
    expect(out.map((x) => [x.lane, x.lanes])).toEqual([[0, 1], [0, 1]]);
  });

  it('splits overlapping events into side-by-side lanes', () => {
    const out = lanes([ev('2026-10-18T09:00Z', '2026-10-18T11:00Z', 'a'), ev('2026-10-18T10:00Z', '2026-10-18T12:00Z', 'b'), ev('2026-10-18T13:00Z', '2026-10-18T14:00Z', 'c')]);
    const by = Object.fromEntries(out.map((x) => [x.event.id, [x.lane, x.lanes]]));
    expect(by.a).toEqual([0, 2]);
    expect(by.b).toEqual([1, 2]);
    expect(by.c).toEqual([0, 1]);
  });
});

describe('monthGrid', () => {
  it('builds six Monday-first weeks around October 2026 with today marked', () => {
    const now = new Date('2026-10-18T10:00:00Z');
    const g = monthGrid(now, TZ, 'monday', 0);
    expect(g.cells).toHaveLength(42);
    expect(g.cells[0].dayNum).toBe(28);
    expect(g.cells[0].inMonth).toBe(false);
    expect(g.cells[3].dayNum).toBe(1);
    expect(g.cells.find((c) => c.isToday).dayNum).toBe(18);
    expect(g.label).toMatch(/October/);
  });

  it('shifts whole months', () => {
    const g = monthGrid(new Date('2026-10-18T10:00:00Z'), TZ, 'monday', 1);
    expect(g.label).toMatch(/November/);
    expect(g.cells.some((c) => c.isToday)).toBe(false);
  });

  it('starts on Sunday when asked', () => {
    const g = monthGrid(new Date('2026-10-18T10:00:00Z'), TZ, 'sunday', 0);
    expect(g.cells[0].dayNum).toBe(27);
  });
});

describe('monthStartOffset', () => {
  it('is the day offset from today to the first grid cell', () => {
    // 18 Oct 2026 is a Sunday; grid starts Mon 28 Sep = 20 days back.
    expect(monthStartOffset(new Date('2026-10-18T10:00:00Z'), TZ, 'monday', 0)).toBe(-20);
  });
});

describe('eventsOn', () => {
  it('files events under the cell for their local day', () => {
    const g = monthGrid(new Date('2026-10-18T10:00:00Z'), TZ, 'monday', 0);
    const map = eventsOn([ev('2026-10-18T13:00Z', '2026-10-18T14:00Z', 'zoo'), ev('2026-10-01T08:00Z', '2026-10-01T09:00Z', 'first')], g, TZ);
    expect(map.get(g.cells.find((c) => c.isToday).key).map((e) => e.id)).toEqual(['zoo']);
    expect(map.get(g.cells[3].key).map((e) => e.id)).toEqual(['first']);
  });
});
