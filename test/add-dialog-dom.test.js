// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import '../src/add/add-dialog.js';

const hass = {
  config: { time_zone: 'Europe/London' },
  user: { is_admin: false },
  states: {
    'todo.ana': { state: '1', attributes: { supported_features: 15, friendly_name: 'Ana' } },
    'calendar.ana': { state: 'off', attributes: { supported_features: 1, friendly_name: 'Ana cal' } },
  },
};
const config = { people: [{ id: 'ana', name: 'Ana', todo: 'todo.ana', calendars: ['calendar.ana'] }], taskmateChores: null };

async function open(lang) {
  const el = document.createElement('family-hub-add-dialog');
  Object.assign(el, { hass, config, lang, date: new Date('2026-08-10T10:00:00Z') });
  document.body.appendChild(el);
  el.show();
  await el.updateComplete;
  return el;
}

describe('add dialog language', () => {
  it('offers the picker in English by default', async () => {
    const el = await open(undefined);
    expect(el.shadowRoot.textContent).toContain('To-do task');
    expect(el.shadowRoot.textContent).toContain('Cancel');
  });

  it('offers the picker in Portuguese when asked', async () => {
    const el = await open('pt');
    expect(el.shadowRoot.textContent).toContain('Cancelar');
    expect(el.shadowRoot.textContent).toContain('Evento');
  });
});
