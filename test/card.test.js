import { describe, it, expect } from 'vitest';
import { resolveSubtitle, resolveScheme } from '../src/family-hub-card.js';

describe('resolveSubtitle', () => {
  const hass = { states: { 'sensor.bins': { state: 'Blue + Food caddy' } } };

  it('returns an empty string when unset', () => {
    expect(resolveSubtitle(hass, null)).toBe('');
  });

  it('resolves an existing entity to its state', () => {
    expect(resolveSubtitle(hass, 'sensor.bins')).toBe('Blue + Food caddy');
  });

  it('renders a literal string as-is', () => {
    expect(resolveSubtitle(hass, 'Bin day tomorrow')).toBe('Bin day tomorrow');
  });

  it('renders an entity-shaped but missing id as a literal, so typos are visible', () => {
    expect(resolveSubtitle(hass, 'sensor.nope')).toBe('sensor.nope');
  });
});

describe('resolveScheme', () => {
  it('follows Home Assistant dark mode', () => {
    expect(resolveScheme({ themes: { darkMode: true } }, 'auto')).toBe('dark');
    expect(resolveScheme({ themes: { darkMode: false } }, 'auto')).toBe('light');
  });

  it('lets an explicit theme override Home Assistant', () => {
    expect(resolveScheme({ themes: { darkMode: false } }, 'dark')).toBe('dark');
    expect(resolveScheme({ themes: { darkMode: true } }, 'light')).toBe('light');
  });

  it('falls back to dark when hass has not arrived and there is no matchMedia', () => {
    expect(resolveScheme(undefined, 'auto')).toBe('dark');
  });

  it('treats a missing darkMode flag as unknown rather than light', () => {
    expect(resolveScheme({ themes: {} }, 'auto')).toBe('dark');
  });
});
