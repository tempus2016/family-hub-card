import { describe, it, expect } from 'vitest';
import { normaliseConfig, PALETTE } from '../src/data/config.js';

const minimal = { people: [{ name: 'Ana', todo: 'todo.ana' }] };

describe('normaliseConfig', () => {
  it('throws when people is missing', () => {
    expect(() => normaliseConfig({})).toThrow(/people/i);
  });

  it('throws when people is empty', () => {
    expect(() => normaliseConfig({ people: [] })).toThrow(/people/i);
  });

  it('throws when a person has neither calendars nor todo', () => {
    expect(() => normaliseConfig({ people: [{ name: 'Ana' }] })).toThrow(/calendars.*todo/i);
  });

  it('throws on an unknown view', () => {
    expect(() => normaliseConfig({ ...minimal, view: 'spiral' })).toThrow(/view/i);
  });

  it('throws on duplicate person names', () => {
    expect(() =>
      normaliseConfig({ people: [{ name: 'Ana', todo: 'todo.a' }, { name: 'Ana', todo: 'todo.b' }] }),
    ).toThrow(/duplicate/i);
  });

  it('defaults view, interval, filter and confirm window', () => {
    const c = normaliseConfig(minimal);
    expect(c.view).toBe('agenda');
    expect(c.refreshInterval).toBe(300);
    expect(c.choreFilter).toBe('today');
    expect(c.confirmWindow).toBe(3);
  });

  it('clamps refresh_interval to a 60s floor', () => {
    expect(normaliseConfig({ ...minimal, refresh_interval: 1 }).refreshInterval).toBe(60);
  });

  it('allows confirm_window of 0', () => {
    expect(normaliseConfig({ ...minimal, confirm_window: 0 }).confirmWindow).toBe(0);
  });

  it('derives id and initials from name', () => {
    const p = normaliseConfig({ people: [{ name: 'Ana Beth', todo: 'todo.a' }] }).people[0];
    expect(p.id).toBe('ana-beth');
    expect(p.initials).toBe('A');
  });

  it('assigns palette colours by index when omitted', () => {
    const c = normaliseConfig({
      people: [
        { name: 'Ana', todo: 'todo.a' },
        { name: 'Ben', todo: 'todo.b' },
      ],
    });
    expect(c.people[0].color).toBe(PALETTE[0]);
    expect(c.people[1].color).toBe(PALETTE[1]);
  });

  it('honours an explicit colour', () => {
    const c = normaliseConfig({ people: [{ name: 'Ana', todo: 'todo.a', color: '#ABCDEF' }] });
    expect(c.people[0].color).toBe('#ABCDEF');
  });

  it('normalises calendars to an array', () => {
    const c = normaliseConfig({ people: [{ name: 'Ana', calendars: 'calendar.a' }] });
    expect(c.people[0].calendars).toEqual(['calendar.a']);
  });

  it('defaults theme to auto and accepts dark/light', () => {
    expect(normaliseConfig(minimal).theme).toBe('auto');
    expect(normaliseConfig({ ...minimal, theme: 'dark' }).theme).toBe('dark');
    expect(normaliseConfig({ ...minimal, theme: 'light' }).theme).toBe('light');
  });

  it('throws on an unknown theme', () => {
    expect(() => normaliseConfig({ ...minimal, theme: 'neon' })).toThrow(/theme/i);
  });

  it('defaults return_to_today and clamps it to a floor', () => {
    expect(normaliseConfig(minimal).returnToToday).toBe(120);
    expect(normaliseConfig({ ...minimal, return_to_today: 5 }).returnToToday).toBe(10);
  });

  it('allows return_to_today of 0 to disable auto-return', () => {
    expect(normaliseConfig({ ...minimal, return_to_today: 0 }).returnToToday).toBe(0);
  });

  it('accepts columns and week without throwing', () => {
    expect(normaliseConfig({ ...minimal, view: 'week' }).view).toBe('week');
  });
});
