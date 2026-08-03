import { describe, it, expect, vi } from 'vitest';
import { HubData } from '../src/data/hub-data.js';
import { normaliseConfig } from '../src/data/config.js';

const TZ = 'Europe/London';

function makeHass(overrides = {}) {
  return {
    config: { time_zone: TZ },
    states: {},
    callApi: async () => [],
    callWS: async () => ({ items: [] }),
    callService: async () => {},
    ...overrides,
  };
}

function makeHub(cfgRaw, hass, opts = {}) {
  const cancels = [];
  const schedule = opts.schedule || ((fn, ms) => { cancels.push({ fn, ms }); return () => {}; });
  const hub = new HubData({
    config: normaliseConfig(cfgRaw),
    getHass: () => hass,
    getNow: opts.getNow || (() => new Date('2026-08-03T10:00:00Z')),
    onChange: opts.onChange || (() => {}),
    schedule,
  });
  return { hub, cancels };
}

const cfg = {
  people: [{ name: 'Ana', calendars: ['calendar.ana'], todo: 'todo.ana', points: 'sensor.ana_points' }],
  taskmate_chores: 'sensor.taskmate_chores',
};

describe('HubData.refresh', () => {
  it('assembles events, chores and points onto each person', async () => {
    const hass = makeHass({
      callApi: async () => [
        { summary: 'Dentist', start: { dateTime: '2026-08-03T14:30:00Z' }, end: { dateTime: '2026-08-03T15:00:00Z' } },
      ],
      callWS: async () => ({ items: [{ uid: 'c1', summary: 'Bins', status: 'needs_action' }] }),
      states: {
        'sensor.ana_points': { state: '142', attributes: { unit_of_measurement: 'Stars', child_id: 'k1' } },
        'sensor.taskmate_chores': {
          state: '1',
          attributes: {
            todays_completions: [
              { chore_id: 'c9', child_id: 'k1', chore_name: 'Dog', approved: true, completed_at: '2026-08-03T08:00:00Z' },
            ],
          },
        },
      },
    });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();

    const ana = hub.model.people[0];
    expect(ana.events.map((e) => e.summary)).toEqual(['Dentist']);
    expect(ana.chores.map((c) => c.summary)).toEqual(['Bins']);
    expect(ana.points.balance).toBe(142);
    expect(ana.completedToday.map((c) => c.name)).toEqual(['Dog']);
    expect(hub.model.staleSince).toBeNull();
  });

  it('keeps last-good events and marks stale when the calendar call fails', async () => {
    let fail = false;
    const hass = makeHass({
      callApi: async () => {
        if (fail) throw new Error('down');
        return [{ summary: 'Dentist', start: { dateTime: '2026-08-03T14:30:00Z' }, end: { dateTime: '2026-08-03T15:00:00Z' } }];
      },
    });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    fail = true;
    await hub.refresh();

    expect(hub.model.people[0].events.map((e) => e.summary)).toEqual(['Dentist']);
    expect(hub.model.staleSince).toBeInstanceOf(Date);
    expect(hub.model.failures).toContain('calendar.ana');
  });

  it('clears staleness once the calendar recovers', async () => {
    let fail = true;
    const hass = makeHass({
      callApi: async () => {
        if (fail) throw new Error('down');
        return [];
      },
    });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    expect(hub.model.staleSince).toBeInstanceOf(Date);
    fail = false;
    await hub.refresh();
    expect(hub.model.staleSince).toBeNull();
  });

  it('notifies onChange once per refresh', async () => {
    const onChange = vi.fn();
    const { hub } = makeHub(cfg, makeHass(), { onChange });
    await hub.refresh();
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('HubData.start', () => {
  it('schedules the interval and the midnight rollover separately', async () => {
    const { hub, cancels } = makeHub(cfg, makeHass());
    hub.start();
    const delays = cancels.map((c) => c.ms);
    expect(delays).toContain(300000);
    // 10:00Z on 3 Aug BST → 23:00Z is local midnight → 13h.
    expect(delays).toContain(13 * 3600 * 1000);
  });
});

describe('HubData.complete', () => {
  it('marks the chore completed optimistically before the call resolves', async () => {
    let release;
    const gate = new Promise((r) => { release = r; });
    const hass = makeHass({
      callWS: async () => ({ items: [{ uid: 'c1', summary: 'Bins', status: 'needs_action' }] }),
      callService: async () => gate,
    });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();

    const pending = hub.complete('ana', 'c1');
    expect(hub.model.people[0].chores.find((c) => c.id === 'c1').status).toBe('completed');
    release();
    await pending;
  });

  it('reverts the optimistic state when the service call fails', async () => {
    const hass = makeHass({
      callWS: async () => ({ items: [{ uid: 'c1', summary: 'Bins', status: 'needs_action' }] }),
      callService: async () => { throw new Error('nope'); },
    });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    await hub.complete('ana', 'c1');
    expect(hub.model.people[0].chores.find((c) => c.id === 'c1').status).toBe('needs_action');
    expect(hub.model.failures).toContain('todo.ana');
  });
});
