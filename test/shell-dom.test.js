// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../src/family-hub-card.js';

const TZ = 'Europe/London';

function makeHass(over = {}) {
  return {
    config: { time_zone: TZ }, themes: { darkMode: false }, locale: { language: 'en', time_format: '24' }, language: 'en',
    user: { is_admin: false },
    states: {
      'sensor.ana_points': { state: '742', attributes: { child_id: 'k1', unit_of_measurement: 'Points', current_streak: 3 } },
      'sensor.taskmate_rewards': { state: '1', attributes: { rewards: [{ id: 'r1', name: 'Ice cream', cost: 100, icon: 'mdi:ice-cream', assigned_to: [], is_available: true }], pending_reward_claims: [] } },
      'todo.ana': { state: '1', attributes: { supported_features: 4 } },
      'calendar.ana': { state: 'off', attributes: { supported_features: 0 } },
      'calendar.ben': { state: 'off', attributes: { supported_features: 0 } },
    },
    callApi: async (_m, path) => {
      if (path.includes('calendar.ana')) return [{ summary: 'Dentist', start: { dateTime: '2026-10-18T14:00:00+01:00' }, end: { dateTime: '2026-10-18T15:00:00+01:00' } }];
      if (path.includes('calendar.ben')) return [{ summary: 'Football', start: { dateTime: '2026-10-17T10:00:00+01:00' }, end: { dateTime: '2026-10-17T12:00:00+01:00' } }];
      return [];
    },
    callWS: async () => ({ items: [{ uid: 'c1', summary: 'Make bed', status: 'needs_action' }] }),
    callService: vi.fn(async () => {}),
    ...over,
  };
}
// The fixtures are Sunday 18 October 2026; pin Date so the suite does not
// depend on the day it runs. Only Date is faked, so timers stay real.
beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-10-18T10:00:00Z')); });
afterEach(() => { vi.useRealTimers(); });

const base = { people: [{ name: 'Ana', calendars: ['calendar.ana'], todo: 'todo.ana', points: 'sensor.ana_points' }, { name: 'Ben', calendars: ['calendar.ben'] }] };

async function mount(config, hass = makeHass()) {
  localStorage.clear();
  const el = document.createElement('family-hub-card');
  el.setConfig(config);
  document.body.appendChild(el);
  el.hass = hass;
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 10));
  await el.updateComplete;
  return el;
}
const $ = (el, sel) => el.shadowRoot.querySelector(sel);
const $$ = (el, sel) => [...el.shadowRoot.querySelectorAll(sel)];

describe('rail', () => {
  it('offers calendar, tasks and settings by default', async () => {
    const el = await mount(base);
    expect($$(el, '.rail button').map((b) => b.dataset.screen)).toEqual(['calendar', 'tasks', 'settings']);
  });

  it('adds rewards when a rewards sensor is configured', async () => {
    const el = await mount({ ...base, taskmate_rewards: 'sensor.taskmate_rewards' });
    expect($$(el, '.rail button').map((b) => b.dataset.screen)).toContain('rewards');
  });

  it('switches screens on tap', async () => {
    const el = await mount(base);
    expect($(el, 'family-hub-calendar-screen')).toBeTruthy();
    $(el, '.rail button[data-screen="tasks"]').click();
    await el.updateComplete;
    expect($(el, 'family-hub-tasks-screen')).toBeTruthy();
    expect($(el, 'family-hub-calendar-screen')).toBeNull();
  });
});

describe('header', () => {
  it('shows the family name when set and the date otherwise', async () => {
    let el = await mount({ ...base, family_name: 'Smith Family' });
    expect($(el, '.title').textContent).toContain('Smith Family');
    el = await mount(base);
    expect($(el, '.title').textContent).toMatch(/Sunday/);
  });

  it('filters a person out when their avatar is tapped', async () => {
    const el = await mount(base);
    const cal = $(el, 'family-hub-calendar-screen');
    await cal.updateComplete;
    expect(cal.shadowRoot.textContent).toContain('Football');
    $(el, '.filters .av[data-person="ben"]').click();
    await el.updateComplete; await cal.updateComplete;
    expect(cal.shadowRoot.textContent).not.toContain('Football');
    expect(cal.shadowRoot.textContent).toContain('Dentist');
  });
});

describe('theme', () => {
  it('follows hass on auto and pins when the settings screen says so', async () => {
    const el = await mount(base, makeHass({ themes: { darkMode: true } }));
    expect(el.dataset.scheme).toBe('dark');
    $(el, '.rail button[data-screen="settings"]').click();
    await el.updateComplete;
    const settings = $(el, 'family-hub-settings-screen');
    await settings.updateComplete;
    settings.shadowRoot.querySelector('button[data-key="theme"][data-value="light"]').click();
    await el.updateComplete;
    expect(el.dataset.scheme).toBe('light');
    expect(JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.startsWith('family-hub:')))).theme).toBe('light');
  });
});

describe('idle return', () => {
  it('goes back to the home screen and today after the return window', async () => {
    const el = await mount({ ...base, return_to_today: 10 });
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(new Date('2026-10-18T10:00:00Z'));
    try {
      $(el, '.rail button[data-screen="tasks"]').click();
      el._page(1);
      await el.updateComplete;
      expect($(el, 'family-hub-tasks-screen')).toBeTruthy();
      vi.advanceTimersByTime(11000);
      await el.updateComplete;
      expect($(el, 'family-hub-calendar-screen')).toBeTruthy();
      expect(el._offset).toBe(0);
    } finally { vi.useRealTimers(); }
  });
});

describe('chores that need something', () => {
  it('opens the sheet for a count chore and submits through TaskMate', async () => {
    const hass = makeHass({
      states: {
        ...makeHass().states,
        'sensor.taskmate_chores': { state: '1', attributes: { chores: [{ id: 'c1', name: 'Make bed', points: 2, quantity_unit: 'pillows', quantity_max: 4 }], todays_completions: [] } },
      },
    });
    const el = await mount({ ...base, taskmate_chores: 'sensor.taskmate_chores', home: 'tasks' }, hass);
    const tasks = $(el, 'family-hub-tasks-screen');
    await tasks.updateComplete;
    tasks.shadowRoot.querySelector('.tile button.tap').click();
    await el.updateComplete;
    const sheet = $(el, 'family-hub-submit-sheet');
    await sheet.updateComplete;
    expect(sheet.shadowRoot.textContent).toMatch(/pillows/);
    sheet.shadowRoot.querySelector('button.inc').click();
    await sheet.updateComplete;
    sheet.shadowRoot.querySelector('button.go').click();
    await new Promise((r) => setTimeout(r, 10));
    expect(hass.callService).toHaveBeenCalledWith('taskmate', 'complete_chore', { chore_id: 'c1', child_id: 'k1', quantity: 2 });
    await sheet.updateComplete;
    expect(sheet.shadowRoot.querySelector('.sheet')).toBeNull();
  });

  it('keeps the sheet open with a household message when TaskMate says unauthorized', async () => {
    const hass = makeHass({
      callService: vi.fn(async () => { const e = new Error('Unauthorized'); e.code = 'unauthorized'; throw e; }),
      states: {
        ...makeHass().states,
        'sensor.taskmate_chores': { state: '1', attributes: { chores: [{ id: 'c1', name: 'Make bed', points: 2, quantity_unit: 'pillows' }], todays_completions: [] } },
      },
    });
    const el = await mount({ ...base, taskmate_chores: 'sensor.taskmate_chores', home: 'tasks' }, hass);
    const tasks = $(el, 'family-hub-tasks-screen');
    await tasks.updateComplete;
    tasks.shadowRoot.querySelector('.tile button.tap').click();
    await el.updateComplete;
    const sheet = $(el, 'family-hub-submit-sheet');
    await sheet.updateComplete;
    sheet.shadowRoot.querySelector('button.go').click();
    await new Promise((r) => setTimeout(r, 10));
    await sheet.updateComplete;
    expect(sheet.shadowRoot.querySelector('.err').textContent).toMatch(/linked/);
  });
});

describe('timed chores', () => {
  it('opens the timer from a timed tile and starts TaskMate’s timer', async () => {
    const hass = makeHass({
      states: {
        ...makeHass().states,
        'sensor.taskmate_chores': { state: '1', attributes: { chores: [{ id: 'c1', name: 'Make bed', task_type: 'timed', timed_rate_points: 10, timed_rate_minutes: 5 }], todays_completions: [], active_timed_sessions: [] } },
      },
    });
    const el = await mount({ ...base, taskmate_chores: 'sensor.taskmate_chores', home: 'tasks' }, hass);
    const tasks = $(el, 'family-hub-tasks-screen');
    await tasks.updateComplete;
    expect(tasks.shadowRoot.querySelector('.tile').textContent).toMatch(/start the timer/i);
    tasks.shadowRoot.querySelector('.tile button.tap').click();
    await el.updateComplete;
    const sheet = $(el, 'family-hub-timer-sheet');
    await sheet.updateComplete;
    sheet.shadowRoot.querySelector('button.start').click();
    await new Promise((r) => setTimeout(r, 10));
    expect(hass.callService).toHaveBeenCalledWith('taskmate', 'start_timed_task', { chore_id: 'c1', child_id: 'k1' });
  });

  it('shows a running timer on the tile', async () => {
    const hass = makeHass({
      states: {
        ...makeHass().states,
        'sensor.taskmate_chores': { state: '1', attributes: {
          chores: [{ id: 'c1', name: 'Make bed', task_type: 'timed', timed_rate_points: 10, timed_rate_minutes: 5 }],
          todays_completions: [],
          active_timed_sessions: [{ chore_id: 'c1', child_id: 'k1', state: 'paused', total_seconds_today: 360 }],
        } },
      },
    });
    const el = await mount({ ...base, taskmate_chores: 'sensor.taskmate_chores', home: 'tasks' }, hass);
    const tasks = $(el, 'family-hub-tasks-screen');
    await tasks.updateComplete;
    expect(tasks.shadowRoot.querySelector('.tile').textContent).toMatch(/paused · 6:00/i);
  });
});
