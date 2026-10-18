import { describe, it, expect, vi } from 'vitest';
import { readSessions, elapsedSeconds, timedPoints, timerAction, formatClock } from '../src/data/timed.js';

const hass = { states: { 'sensor.taskmate_chores': { state: '1', attributes: { active_timed_sessions: [
  { chore_id: 'c1', child_id: 'k1', state: 'running', total_seconds_today: 120, current_segment_start: '2026-10-18T10:00:00+00:00' },
  { chore_id: 'c2', child_id: 'k1', state: 'paused', total_seconds_today: 300, current_segment_start: '' },
] } } } };

describe('readSessions', () => {
  it('keys live sessions by chore and child', () => {
    const m = readSessions(hass, 'sensor.taskmate_chores');
    expect(m.get('c1|k1')).toMatchObject({ state: 'running', total: 120 });
    expect(m.get('c2|k1')).toMatchObject({ state: 'paused', total: 300 });
    expect(m.size).toBe(2);
  });

  it('is empty without the sensor', () => {
    expect(readSessions(hass, null).size).toBe(0);
  });
});

describe('elapsedSeconds', () => {
  it('adds the running segment to what was banked before', () => {
    const s = readSessions(hass, 'sensor.taskmate_chores').get('c1|k1');
    expect(elapsedSeconds(s, new Date('2026-10-18T10:01:30Z'))).toBe(210);
  });

  it('is the banked total while paused', () => {
    const s = readSessions(hass, 'sensor.taskmate_chores').get('c2|k1');
    expect(elapsedSeconds(s, new Date('2026-10-18T12:00:00Z'))).toBe(300);
  });

  it('is zero with no session', () => {
    expect(elapsedSeconds(null, new Date())).toBe(0);
  });
});

describe('timedPoints', () => {
  it('pays whole rate blocks, as TaskMate does', () => {
    expect(timedPoints(14 * 60 + 59, { rateMinutes: 5, ratePoints: 10 })).toBe(20);
  });

  it('respects the daily cap', () => {
    expect(timedPoints(60 * 60, { rateMinutes: 5, ratePoints: 10, capMinutes: 20 })).toBe(40);
  });

  it('pays nothing with a zero rate rather than dividing by zero', () => {
    expect(timedPoints(600, { rateMinutes: 0, ratePoints: 10 })).toBe(0);
  });
});

describe('timerAction', () => {
  it('maps start, pause and finish onto TaskMate actions', async () => {
    const h = { callService: vi.fn(async () => {}) };
    await timerAction(h, 'start', 'c1', 'k1');
    await timerAction(h, 'pause', 'c1', 'k1');
    await timerAction(h, 'finish', 'c1', 'k1');
    expect(h.callService.mock.calls.map((c) => c[1])).toEqual(['start_timed_task', 'pause_timed_task', 'stop_timed_task']);
    expect(h.callService.mock.calls[0][2]).toEqual({ chore_id: 'c1', child_id: 'k1' });
  });
});

describe('formatClock', () => {
  it('shows m:ss under an hour and h:mm:ss over', () => {
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(3725)).toBe('1:02:05');
  });
});
