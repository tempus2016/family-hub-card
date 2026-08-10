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

// The card class is not exported; reach it through the registry the module
// populates on import, the same way test/editor.test.js does.
describe('tab state', () => {
  const makeCard = (config) => {
    const Card = customElements.get('family-hub-card');
    const card = new Card();
    // The node test environment has no real DOM, so `dataset` is missing and
    // `_applyScheme` would throw. Stubbing it keeps this a pure state test.
    card.dataset = {};
    card.setConfig(config);
    return card;
  };

  const base = { type: 'custom:family-hub-card', people: [{ name: 'Ana', todo: 'todo.ana' }] };

  it('starts on the calendar tab', () => {
    expect(makeCard({ ...base, tabs: true })._tab).toBe('calendar');
  });

  it('returns to the calendar tab when going back to today', () => {
    const card = makeCard({ ...base, tabs: true });
    card._tab = 'tasks';
    card._goToday();
    expect(card._tab).toBe('calendar');
  });

  it('leaves tabs off by default', () => {
    expect(makeCard(base)._config.tabs).toBe(false);
  });
});
