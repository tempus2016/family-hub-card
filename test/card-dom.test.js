// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import '../src/family-hub-card.js';

const TZ = 'Europe/London';

function makeHass(overrides = {}) {
  const calls = { api: 0, ws: 0 };
  const hass = {
    config: { time_zone: TZ },
    themes: { darkMode: true },
    locale: { language: 'en', time_format: '24' },
    language: 'en',
    states: {},
    callApi: async () => { calls.api += 1; return []; },
    callWS: async () => { calls.ws += 1; return { items: [] }; },
    callService: async () => {},
    ...overrides,
  };
  return { hass, calls };
}

async function mount(config, hass) {
  const el = document.createElement('family-hub-card');
  el.setConfig(config);
  document.body.appendChild(el);
  el.hass = hass;
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 5));
  await el.updateComplete;
  return el;
}

const base = { people: [{ name: 'Ana', todo: 'todo.ana' }] };

describe('lifecycle', () => {
  it('restarts polling and refetches when re-attached to the DOM', async () => {
    const { hass, calls } = makeHass();
    const el = await mount(base, hass);
    const before = calls.ws;

    el.remove();
    expect(el._hub._cancels).toEqual([]);

    document.body.appendChild(el);
    await new Promise((r) => setTimeout(r, 5));

    expect(el._hub._cancels.length).toBeGreaterThan(0);
    expect(calls.ws).toBeGreaterThan(before);
  });
});

describe('layout hints', () => {
  it('asks a sections dashboard for the full width', () => {
    const Card = customElements.get('family-hub-card');
    expect(Card.prototype.getGridOptions.call({})).toMatchObject({ columns: 'full' });
  });
});

describe('locale', () => {
  it('renders the header and section labels in Portuguese when hass is pt', async () => {
    const { hass } = makeHass({ language: 'pt', locale: { language: 'pt', time_format: '24' } });
    const el = await mount(base, hass);
    const text = el.shadowRoot.textContent;
    expect(text).toMatch(/segunda|terça|quarta|quinta|sexta|sábado|domingo/i);
    expect(text).toContain('Calendário');
  });

  it('shows a 12-hour clock when the profile asks for one', async () => {
    const { hass } = makeHass({ locale: { language: 'en', time_format: '12' } });
    const el = await mount(base, hass);
    expect(el.shadowRoot.querySelector('.title .time').textContent.trim().toLowerCase()).toMatch(/am|pm/);
  });
});

describe('narrow header', () => {
  it('shortens the date on a phone so it fits on one line beside the clock', async () => {
    const { hass } = makeHass();
    const el = await mount(base, hass);
    el._narrow = true;
    el.requestUpdate();
    await el.updateComplete;
    const text = el.shadowRoot.querySelector('.title .name').textContent.trim();
    expect(text.length).toBeLessThan(14);
    expect(text).not.toMatch(/day,/);
  });
});
