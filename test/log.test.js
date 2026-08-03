import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logFailure, logRecovery, resetLogState } from '../src/data/log.js';

describe('failure logging', () => {
  let warn;
  let info;

  beforeEach(() => {
    resetLogState();
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    info = vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    info.mockRestore();
  });

  it('logs the first failure', () => {
    expect(logFailure('cal:a', 'could not read a', new Error('boom'))).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('could not read a');
    expect(warn.mock.calls[0][0]).toContain('boom');
  });

  it('stays silent while the same failure repeats', () => {
    const err = new Error('boom');
    logFailure('cal:a', 'could not read a', err);
    logFailure('cal:a', 'could not read a', err);
    logFailure('cal:a', 'could not read a', err);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('logs again when the same key fails for a different reason', () => {
    logFailure('cal:a', 'could not read a', new Error('boom'));
    logFailure('cal:a', 'could not read a', new Error('gone'));
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('keeps separate streaks per key', () => {
    logFailure('cal:a', 'could not read a', new Error('boom'));
    logFailure('cal:b', 'could not read b', new Error('boom'));
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('logs recovery only for a key that was failing', () => {
    expect(logRecovery('cal:a', 'a is readable again')).toBe(false);
    expect(info).not.toHaveBeenCalled();

    logFailure('cal:a', 'could not read a', new Error('boom'));
    expect(logRecovery('cal:a', 'a is readable again')).toBe(true);
    expect(info).toHaveBeenCalledTimes(1);
  });

  it('logs the next failure again after a recovery', () => {
    const err = new Error('boom');
    logFailure('cal:a', 'could not read a', err);
    logRecovery('cal:a', 'a is readable again');
    logFailure('cal:a', 'could not read a', err);
    expect(warn).toHaveBeenCalledTimes(2);
  });
});
