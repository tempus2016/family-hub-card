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

describe('HubData isolation of failures', () => {
  const twoPeople = {
    people: [
      { name: 'Ana', calendars: ['calendar.ana'], todo: 'todo.ana' },
      { name: 'Ben', todo: 'todo.ben' },
    ],
  };

  it("keeps a working person's chores when another person's entity is broken", async () => {
    const hass = makeHass({
      callWS: async ({ entity_id }) => {
        if (entity_id === 'todo.ben') throw new Error('missing');
        return { items: [{ uid: 'c1', summary: 'Bins', status: 'needs_action' }] };
      },
    });
    const { hub } = makeHub(twoPeople, hass);
    await hub.refresh();

    const ana = hub.model.people.find((p) => p.id === 'ana');
    const ben = hub.model.people.find((p) => p.id === 'ben');
    expect(ana.chores.map((c) => c.summary)).toEqual(['Bins']);
    expect(ana.failures).toEqual([]);
    expect(ben.failures).toEqual(['todo.ben']);
  });

  it("keeps a working person's events when another person's calendar is broken', ", async () => {
    const people = {
      people: [
        { name: 'Ana', calendars: ['calendar.ana'] },
        { name: 'Ben', calendars: ['calendar.ben'] },
      ],
    };
    const hass = makeHass({
      callApi: async (_m, path) => {
        if (path.includes('calendar.ben')) throw new Error('missing');
        return [{ summary: 'Dentist', start: { dateTime: '2026-08-03T14:30:00Z' }, end: { dateTime: '2026-08-03T15:00:00Z' } }];
      },
    });
    const { hub } = makeHub(people, hass);
    await hub.refresh();

    expect(hub.model.people.find((p) => p.id === 'ana').events.map((e) => e.summary)).toEqual(['Dentist']);
    expect(hub.model.people.find((p) => p.id === 'ben').failures).toEqual(['calendar.ben']);
  });

  it('retains the previous day for a person whose calendar starts failing', async () => {
    let fail = false;
    const hass = makeHass({
      callApi: async () => {
        if (fail) throw new Error('down');
        return [{ summary: 'Dentist', start: { dateTime: '2026-08-03T14:30:00Z' }, end: { dateTime: '2026-08-03T15:00:00Z' } }];
      },
    });
    const { hub } = makeHub({ people: [{ name: 'Ana', calendars: ['calendar.ana'] }] }, hass);
    await hub.refresh();
    fail = true;
    await hub.refresh();
    expect(hub.model.people[0].events.map((e) => e.summary)).toEqual(['Dentist']);
  });
});

describe('HubData.hassChanged', () => {
  it('refetches when a watched todo entity changes', async () => {
    let calls = 0;
    const hass = makeHass({ callWS: async () => { calls += 1; return { items: [] }; } });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    const before = calls;

    const prev = { ...hass, states: { ...hass.states, 'todo.ana': { state: '4' } } };
    hass.states = { ...hass.states, 'todo.ana': { state: '3' } };
    await hub.hassChanged(prev);
    await new Promise((r) => setTimeout(r, 0));
    expect(calls).toBeGreaterThan(before);
  });

  it('rebuilds without a network call when only a sensor changes', async () => {
    let calls = 0;
    const hass = makeHass({
      callWS: async () => { calls += 1; return { items: [] }; },
      states: {
        'sensor.ana_points': { state: '10', attributes: { child_id: 'k1' } },
        'sensor.taskmate_chores': { state: '8', attributes: { todays_completions: [] } },
      },
    });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    const before = calls;

    const prev = { ...hass, states: { ...hass.states } };
    // Same numeric state, new attribute payload — the identity check must catch it.
    hass.states = {
      ...hass.states,
      'sensor.taskmate_chores': {
        state: '8',
        attributes: {
          todays_completions: [
            { chore_id: 'c1', child_id: 'k1', chore_name: 'Bins', approved: false, completed_at: '2026-08-03T09:00:00Z' },
          ],
        },
      },
    };
    hub.hassChanged(prev);

    expect(calls).toBe(before);
    expect(hub.model.people[0].completedToday.map((c) => c.name)).toEqual(['Bins']);
  });

  it('does nothing when no watched entity changed', async () => {
    let calls = 0;
    const hass = makeHass({ callWS: async () => { calls += 1; return { items: [] }; } });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    const before = calls;
    hub.hassChanged(hass);
    await new Promise((r) => setTimeout(r, 0));
    expect(calls).toBe(before);
  });

  it('coalesces overlapping refreshes into one in-flight fetch', async () => {
    let calls = 0;
    let release;
    const gate = new Promise((r) => { release = r; });
    const hass = makeHass({ callWS: async () => { calls += 1; await gate; return { items: [] }; } });
    const { hub } = makeHub(cfg, hass);

    const a = hub.refresh();
    const b = hub.refresh();
    release();
    await Promise.all([a, b]);
    expect(calls).toBe(1);
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
