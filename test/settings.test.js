import { describe, it, expect } from 'vitest';
import { cardKey, loadSettings, saveSettings, effectiveSettings } from '../src/data/settings.js';

function fakeStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
const cfg = { people: [{ name: 'Ana' }, { name: 'Ben' }], theme: 'auto', home: 'calendar', calendarView: 'schedule', hideCompleted: false };

describe('settings', () => {
  it('keys storage by the people on the card', () => {
    expect(cardKey(cfg)).toBe(cardKey({ people: [{ name: 'Ana' }, { name: 'Ben' }] }));
    expect(cardKey(cfg)).not.toBe(cardKey({ people: [{ name: 'Cal' }] }));
  });

  it('round-trips through storage', () => {
    const st = fakeStorage();
    saveSettings(st, cfg, { theme: 'dark' });
    expect(loadSettings(st, cfg)).toEqual({ theme: 'dark' });
  });

  it('survives corrupt storage', () => {
    const st = fakeStorage();
    st.setItem(`family-hub:${cardKey(cfg)}`, '{nope');
    expect(loadSettings(st, cfg)).toEqual({});
  });

  it('lets device settings override the YAML and clears them with null', () => {
    const st = fakeStorage();
    expect(effectiveSettings(st, cfg).theme).toBe('auto');
    saveSettings(st, cfg, { theme: 'dark', home: 'tasks' });
    expect(effectiveSettings(st, cfg)).toMatchObject({ theme: 'dark', home: 'tasks', calendarView: 'schedule' });
    saveSettings(st, cfg, { theme: null });
    expect(effectiveSettings(st, cfg).theme).toBe('auto');
  });
});
