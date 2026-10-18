import { describe, it, expect } from 'vitest';
import { formatTime, formatDate } from '../src/format.js';

const TZ = 'Europe/London';
const at = new Date('2026-08-10T13:30:00Z'); // 14:30 BST

describe('formatTime', () => {
  it('uses a 24-hour clock when hass says 24', () => {
    expect(formatTime(at, { language: 'en', time_format: '24' }, TZ)).toBe('14:30');
  });

  it('uses a 12-hour clock when hass says 12', () => {
    expect(formatTime(at, { language: 'en', time_format: '12' }, TZ).toLowerCase()).toMatch(/2:30\s?pm/);
  });

  it('lets the language decide when hass says language', () => {
    expect(formatTime(at, { language: 'en-GB', time_format: 'language' }, TZ)).toBe('14:30');
    expect(formatTime(at, { language: 'en-US', time_format: 'language' }, TZ).toLowerCase()).toMatch(/2:30\s?pm/);
  });

  it('falls back to 24-hour with no locale at all', () => {
    expect(formatTime(at, undefined, TZ)).toBe('14:30');
  });
});

describe('formatDate', () => {
  it('names the weekday, day and month in the given language', () => {
    expect(formatDate(at, { language: 'en-GB' }, TZ, { weekday: 'long', day: 'numeric', month: 'long' }))
      .toBe('Monday 10 August');
    expect(formatDate(at, { language: 'pt' }, TZ, { weekday: 'long', day: 'numeric', month: 'long' }))
      .toMatch(/segunda/);
  });
});

describe('formatTime in 12-hour mode', () => {
  it('drops the leading zero so a wall clock reads 2:30 PM, not 02:30 PM', () => {
    expect(formatTime(at, { language: 'en', time_format: '12' }, TZ)).toMatch(/^2:30/);
  });
});
