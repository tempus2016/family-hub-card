import { describe, it, expect } from 'vitest';
import { resolveSubtitle } from '../src/family-hub-card.js';

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
