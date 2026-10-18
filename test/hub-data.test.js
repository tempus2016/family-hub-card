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

describe('model identity', () => {
  it('replaces the model object rather than mutating it', async () => {
    // Lit dirty-checks with !==, so a mutated model never re-renders a child
    // view that takes no other changing property.
    const { hub } = makeHub(cfg, makeHass());
    await hub.refresh();
    const first = hub.model;
    await hub.refresh();
    expect(hub.model).not.toBe(first);
  });

  it('gives a new model on a sensor-only rebuild', async () => {
    const hass = makeHass({
      states: { 'sensor.ana_points': { state: '1', attributes: { child_id: 'k1' } } },
    });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    const first = hub.model;

    const prev = { ...hass, states: { ...hass.states } };
    hass.states = { ...hass.states, 'sensor.ana_points': { state: '2', attributes: { child_id: 'k1' } } };
    hub.hassChanged(prev);

    expect(hub.model).not.toBe(first);
    expect(hub.model.people[0].points.balance).toBe(2);
  });

  it('gives a new model when an optimistic completion is reverted', async () => {
    const hass = makeHass({
      callWS: async () => ({ items: [{ uid: 'c1', summary: 'Bins', status: 'needs_action' }] }),
      callService: async () => { throw new Error('nope'); },
    });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    const first = hub.model;
    await hub.complete('ana', 'c1');
    expect(hub.model).not.toBe(first);
  });
});

describe('HubData.windowDays', () => {
  it('defaults to seven days, and one for the day view', () => {
    const { hub: schedule } = makeHub(cfg, makeHass());
    expect(schedule.windowDays).toBe(7);
    const { hub: day } = makeHub({ ...cfg, calendar_view: 'day' }, makeHass());
    expect(day.windowDays).toBe(1);
  });

  it('refetches at the new width when the card collapses week to agenda', async () => {
    const paths = [];
    const hass = makeHass({ callApi: async (_m, p) => { paths.push(p); return []; } });
    const { hub } = makeHub({ ...cfg, view: 'week' }, hass);
    await hub.refresh();

    hub.windowDays = 1;
    await new Promise((r) => setTimeout(r, 0));

    const span = (p) => {
      const q = new URLSearchParams(p.split('?')[1]);
      return new Date(q.get('end')) - new Date(q.get('start'));
    };
    expect(span(paths[0])).toBe(7 * 24 * 3600 * 1000);
    expect(span(paths[paths.length - 1])).toBe(24 * 3600 * 1000);
  });

  it('ignores a set to the value already in force', async () => {
    let calls = 0;
    const hass = makeHass({ callApi: async () => { calls += 1; return []; } });
    const { hub } = makeHub({ ...cfg, view: 'week' }, hass);
    hub.windowDays = 7;
    await new Promise((r) => setTimeout(r, 0));
    const before = calls;
    hub.windowDays = 7;
    await new Promise((r) => setTimeout(r, 0));
    expect(calls).toBe(before);
  });
});

describe('HubData.startOffset', () => {
  const span = (p) => {
    const q = new URLSearchParams(p.split('?')[1]);
    return { start: q.get('start'), end: q.get('end') };
  };

  it('defaults to no offset', () => {
    const { hub } = makeHub(cfg, makeHass());
    expect(hub.startOffset).toBe(0);
  });

  it('slides the fetched window forward and refetches', async () => {
    const paths = [];
    const hass = makeHass({ callApi: async (_m, p) => { paths.push(p); return []; } });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    const before = span(paths[0]).start;

    hub.startOffset = 7;
    await new Promise((r) => setTimeout(r, 0));
    const after = span(paths[paths.length - 1]).start;

    expect(new Date(after) - new Date(before)).toBe(7 * 24 * 3600 * 1000);
  });

  it('slides backwards for a negative offset', async () => {
    const paths = [];
    const hass = makeHass({ callApi: async (_m, p) => { paths.push(p); return []; } });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    const before = span(paths[0]).start;

    hub.startOffset = -7;
    await new Promise((r) => setTimeout(r, 0));
    const after = span(paths[paths.length - 1]).start;

    expect(new Date(after) - new Date(before)).toBe(-7 * 24 * 3600 * 1000);
  });

  it('ignores a set to the offset already in force', async () => {
    let calls = 0;
    const hass = makeHass({ callApi: async () => { calls += 1; return []; } });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    const before = calls;
    hub.startOffset = 0;
    await new Promise((r) => setTimeout(r, 0));
    expect(calls).toBe(before);
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

describe('partial refresh on entity change', () => {
  const twoSources = {
    people: [{ name: 'Ana', calendars: ['calendar.ana'], todo: 'todo.ana' }],
  };

  function counting() {
    const calls = { api: 0, ws: 0 };
    const hass = makeHass({
      states: {
        'calendar.ana': { state: 'off', attributes: {} },
        'todo.ana': { state: '2', attributes: {} },
      },
      callApi: async () => { calls.api += 1; return []; },
      callWS: async () => { calls.ws += 1; return { items: [] }; },
    });
    return { hass, calls };
  }

  it('refetches only the to-do lists when a to-do entity changes', async () => {
    const { hass, calls } = counting();
    const { hub } = makeHub(twoSources, hass);
    await hub.refresh();
    const prev = { ...hass, states: { ...hass.states } };
    hass.states = { ...hass.states, 'todo.ana': { state: '1', attributes: {} } };

    await hub.hassChanged(prev);

    expect(calls.ws).toBe(2);
    expect(calls.api).toBe(1);
  });

  it('refetches only the calendars when a calendar entity changes', async () => {
    const { hass, calls } = counting();
    const { hub } = makeHub(twoSources, hass);
    await hub.refresh();
    const prev = { ...hass, states: { ...hass.states } };
    hass.states = { ...hass.states, 'calendar.ana': { state: 'on', attributes: {} } };

    await hub.hassChanged(prev);

    expect(calls.api).toBe(2);
    expect(calls.ws).toBe(1);
  });
});

describe('unified task list on the model', () => {
  it('builds tasks and progress onto each person once', async () => {
    const hass = makeHass({
      callWS: async () => ({ items: [
        { uid: 'c1', summary: 'Bins', status: 'needs_action' },
        { uid: 'c2', summary: 'Dog', status: 'completed' },
      ] }),
      states: {
        'sensor.ana_points': { state: '1', attributes: { child_id: 'k1' } },
        'sensor.taskmate_chores': { state: '1', attributes: { todays_completions: [
          { chore_id: 'c9', child_id: 'k1', chore_name: 'Tidy', approved: false, completed_at: '2026-08-03T08:00:00Z' },
        ] } },
      },
    });
    const { hub } = makeHub(cfg, hass);
    await hub.refresh();
    const ana = hub.model.people[0];
    expect(ana.tasks.map((t) => t.summary)).toEqual(['Bins', 'Dog', 'Tidy']);
    expect(ana.tasks[2].pending).toBe(true);
    expect(ana.progress).toEqual({ done: 2, total: 3, pct: 67 });
  });

  it('caps the completed to-do items it lists to max_completed', async () => {
    const hass = makeHass({
      callWS: async () => ({ items: [
        { uid: 'c1', summary: 'Old 1', status: 'completed' },
        { uid: 'c2', summary: 'Old 2', status: 'completed' },
      ] }),
    });
    const { hub } = makeHub({ ...cfg, max_completed: 1 }, hass);
    await hub.refresh();
    expect(hub.model.people[0].tasks).toHaveLength(1);
    expect(hub.model.people[0].progress.done).toBe(2);
  });
});

describe('shared calendars on the model', () => {
  it('gives the Family person its events and no chores', async () => {
    const hass = makeHass({
      callApi: async (_m, path) => (path.includes('family')
        ? [{ summary: 'Zoo', start: { dateTime: '2026-08-03T09:00:00Z' }, end: { dateTime: '2026-08-03T10:00:00Z' } }]
        : []),
    });
    const { hub } = makeHub({ people: [{ name: 'Ana', calendars: ['calendar.ana'] }], shared_calendars: ['calendar.family'] }, hass);
    await hub.refresh();
    const fam = hub.model.people.find((p) => p.shared);
    expect(fam.events.map((e) => e.summary)).toEqual(['Zoo']);
    expect(hub.model.people.find((p) => p.id === 'ana').events).toEqual([]);
  });
});

describe('avatar resolution', () => {
  const states = {
    'person.ana': { state: 'home', attributes: { entity_picture: '/api/image/ana', friendly_name: 'Ana M' } },
    'sensor.ana_points': { state: '3', attributes: { avatar: 'mdi:unicorn', avatar_image: '/api/taskmate/ana.png', current_streak: 2 } },
  };

  it('prefers an explicit picture', async () => {
    const { hub } = makeHub({ people: [{ name: 'Ana', todo: 'todo.ana', picture: '/local/a.jpg', person: 'person.ana', points: 'sensor.ana_points' }] }, makeHass({ states }));
    await hub.refresh();
    expect(hub.model.people[0].picture).toBe('/local/a.jpg');
  });

  it('falls back to the person entity picture, then TaskMate image, then TaskMate icon', async () => {
    let { hub } = makeHub({ people: [{ name: 'Ana', todo: 'todo.ana', person: 'person.ana', points: 'sensor.ana_points' }] }, makeHass({ states }));
    await hub.refresh();
    expect(hub.model.people[0].picture).toBe('/api/image/ana');

    ({ hub } = makeHub({ people: [{ name: 'Ana', todo: 'todo.ana', points: 'sensor.ana_points' }] }, makeHass({ states })));
    await hub.refresh();
    expect(hub.model.people[0].picture).toBe('/api/taskmate/ana.png');

    const noImage = { 'sensor.ana_points': { state: '3', attributes: { avatar: 'mdi:unicorn' } } };
    ({ hub } = makeHub({ people: [{ name: 'Ana', todo: 'todo.ana', points: 'sensor.ana_points' }] }, makeHass({ states: noImage })));
    await hub.refresh();
    expect(hub.model.people[0].picture).toBeNull();
    expect(hub.model.people[0].icon).toBe('mdi:unicorn');
  });
});

describe('window changes during a fetch', () => {
  it('refetches with the new window when it changes while a fetch is in flight', async () => {
    const paths = [];
    let release;
    const gate = new Promise((r) => { release = r; });
    const hass = makeHass({
      callApi: async (_m, path) => { paths.push(path); if (paths.length === 1) await gate; return []; },
    });
    const { hub } = makeHub({ view: 'week', people: [{ name: 'Ana', calendars: ['calendar.ana'] }] }, hass);
    const first = hub.refresh();
    hub.windowDays = 1;
    release();
    await first;
    await new Promise((r) => setTimeout(r, 0));
    await hub._inflight;

    expect(paths).toHaveLength(2);
    const span = (p) => {
      const q = new URLSearchParams(p.split('?')[1]);
      return (new Date(q.get('end')) - new Date(q.get('start'))) / 3600000;
    };
    expect(span(paths[0])).toBe(7 * 24);
    expect(span(paths[1])).toBe(24);
  });
});

describe('chore calendar events', () => {
  it('flags events from a chore calendar', async () => {
    const hass = makeHass({
      callApi: async () => [{ summary: 'Make bed', start: { dateTime: '2026-08-03T06:00:00Z' }, end: { dateTime: '2026-08-03T07:00:00Z' } }],
    });
    const { hub } = makeHub({ people: [{ name: 'Ana', calendars: ['calendar.taskmate_ana', 'calendar.ana'] }] }, hass);
    await hub.refresh();
    const byCal = Object.fromEntries(hub.model.people[0].events.map((e) => [e.calendar, e.isChore]));
    expect(byCal).toEqual({ 'calendar.taskmate_ana': true, 'calendar.ana': false });
  });
});

describe('submitting a chore that needs something', () => {
  const cfgT = {
    people: [{ name: 'Ana', todo: 'todo.ana', points: 'sensor.ana_points' }],
    taskmate_chores: 'sensor.taskmate_chores',
  };
  const states = {
    'sensor.ana_points': { state: '1', attributes: { child_id: 'k1' } },
    'sensor.taskmate_chores': { state: '1', attributes: { chores: [{ id: 'c1', name: 'Read', points: 2, quantity_unit: 'pages' }] } },
  };

  it('calls TaskMate with the child id and marks the chore done straight away', async () => {
    const callService = vi.fn(async () => {});
    const hass = makeHass({ states, callService, callWS: async () => ({ items: [{ uid: 'c1', summary: 'Read', status: 'needs_action' }] }) });
    const { hub } = makeHub(cfgT, hass);
    await hub.refresh();
    await hub.submit('ana', 'c1', { needs: 'quantity', quantity: 12 });
    expect(callService).toHaveBeenCalledWith('taskmate', 'complete_chore', { chore_id: 'c1', child_id: 'k1', quantity: 12 });
    expect(hub.model.people[0].tasks[0].done).toBe(true);
  });

  it('puts the chore back and rethrows when TaskMate refuses', async () => {
    const hass = makeHass({ states, callService: async () => { throw new Error('Say how many pages you did.'); }, callWS: async () => ({ items: [{ uid: 'c1', summary: 'Read', status: 'needs_action' }] }) });
    const { hub } = makeHub(cfgT, hass);
    await hub.refresh();
    await expect(hub.submit('ana', 'c1', { needs: 'quantity', quantity: 0 })).rejects.toThrow(/how many/);
    expect(hub.model.people[0].tasks[0].done).toBe(false);
  });
});
