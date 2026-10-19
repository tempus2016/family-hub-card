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

  it('accepts the colour forms a theme might use', () => {
    for (const color of ['#abc', '#AABBCCDD', 'rebeccapurple', 'rgb(1, 2, 3)',
      'hsl(210 50% 40% / 0.5)', 'var(--primary-color)']) {
      const c = normaliseConfig({ people: [{ name: 'Ana', todo: 'todo.a', color }] });
      expect(c.people[0].color).toBe(color);
    }
  });

  // The colour lands in a style attribute, where a semicolon starts a new
  // declaration and lets a config author paint over the whole dashboard.
  it('rejects a colour carrying extra CSS declarations', () => {
    for (const color of ['red;position:fixed;inset:0', '#fff}body{display:none',
      'url(https://example.com/x)', 'rgb(1,2,3);background:red']) {
      expect(() => normaliseConfig({ people: [{ name: 'Ana', todo: 'todo.a', color }] }))
        .toThrow(/color/i);
    }
  });

  it('rejects a calendar that is not an entity id', () => {
    for (const calendars of ['../config', 'calendar.a?x=1', 'Calendar.A']) {
      expect(() => normaliseConfig({ people: [{ name: 'Ana', calendars }] }))
        .toThrow(/entity id/i);
    }
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

  it('defaults inline_chores to true', () => {
    expect(normaliseConfig(minimal).inlineChores).toBe(true);
  });

  it('reads inline_chores when set', () => {
    expect(normaliseConfig({ ...minimal, inline_chores: true }).inlineChores).toBe(true);
  });

  it('coerces a truthy inline_chores to a boolean', () => {
    expect(normaliseConfig({ ...minimal, inline_chores: 'yes' }).inlineChores).toBe(true);
  });



});

describe('max_completed', () => {
  const base = { people: [{ name: 'Ana', todo: 'todo.ana' }] };

  it('defaults to three', () => {
    expect(normaliseConfig(base).maxCompleted).toBe(3);
  });

  it('accepts zero to hide completed items', () => {
    expect(normaliseConfig({ ...base, max_completed: 0 }).maxCompleted).toBe(0);
  });

  it('accepts a larger cap', () => {
    expect(normaliseConfig({ ...base, max_completed: 10 }).maxCompleted).toBe(10);
  });
});

describe('shared calendars', () => {
  const base = { people: [{ name: 'Ana', todo: 'todo.ana' }] };

  it('appends a shared Family person carrying the shared calendars', () => {
    const cfg = normaliseConfig({ ...base, shared_calendars: ['calendar.family'] });
    const fam = cfg.people.at(-1);
    expect(fam).toMatchObject({ id: 'family', shared: true, calendars: ['calendar.family'], todo: null });
    expect(cfg.people).toHaveLength(2);
  });

  it('accepts a single entity id as well as a list', () => {
    const cfg = normaliseConfig({ ...base, shared_calendars: 'calendar.family' });
    expect(cfg.people.at(-1).calendars).toEqual(['calendar.family']);
  });

  it('lets the shared row be named and coloured', () => {
    const cfg = normaliseConfig({ ...base, shared_calendars: ['calendar.family'], shared_name: 'Everyone', shared_color: '#888888' });
    expect(cfg.people.at(-1)).toMatchObject({ name: 'Everyone', color: '#888888' });
  });

  it('adds no shared person when none are configured', () => {
    expect(normaliseConfig(base).people).toHaveLength(1);
  });

  it('rejects a malformed shared calendar id', () => {
    expect(() => normaliseConfig({ ...base, shared_calendars: ['family'] })).toThrow(/entity id/);
  });
});

describe('inline chores default', () => {
  const base = { people: [{ name: 'Ana', todo: 'todo.ana' }] };

  it('is on by default', () => {
    expect(normaliseConfig(base).inlineChores).toBe(true);
  });

  it('can be switched off', () => {
    expect(normaliseConfig({ ...base, inline_chores: false }).inlineChores).toBe(false);
  });

});

describe('week_start', () => {
  const base = { people: [{ name: 'Ana', todo: 'todo.ana' }] };

  it('defaults to monday', () => {
    expect(normaliseConfig(base).weekStart).toBe('monday');
  });

  it('accepts sunday and today', () => {
    expect(normaliseConfig({ ...base, week_start: 'sunday' }).weekStart).toBe('sunday');
    expect(normaliseConfig({ ...base, week_start: 'today' }).weekStart).toBe('today');
  });

  it('rejects anything else', () => {
    expect(() => normaliseConfig({ ...base, week_start: 'tuesday' })).toThrow(/week_start/);
  });
});

describe('person picture and entity', () => {
  it('carries a picture URL and a person entity through', () => {
    const cfg = normaliseConfig({ people: [{ name: 'Ana', todo: 'todo.ana', picture: '/local/ana.jpg', person: 'person.ana' }] });
    expect(cfg.people[0]).toMatchObject({ picture: '/local/ana.jpg', person: 'person.ana' });
  });

  it('rejects a person entity outside the person domain', () => {
    expect(() => normaliseConfig({ people: [{ name: 'Ana', todo: 'todo.ana', person: 'sensor.ana' }] })).toThrow(/person/);
  });
});

describe('screens and calendar views', () => {
  const base = { people: [{ name: 'Ana', todo: 'todo.ana' }] };

  it('defaults to the calendar screen in schedule view with no family name', () => {
    const cfg = normaliseConfig(base);
    expect(cfg).toMatchObject({ home: 'calendar', calendarView: 'schedule', familyName: null, hideCompleted: false });
  });

  it('accepts the new keys', () => {
    const cfg = normaliseConfig({ ...base, family_name: 'Smith Family', home: 'tasks', calendar_view: 'month', taskmate_rewards: 'sensor.taskmate_rewards', meals_calendar: 'calendar.meals', hide_completed: true });
    expect(cfg).toMatchObject({ familyName: 'Smith Family', home: 'tasks', calendarView: 'month', taskmateRewards: 'sensor.taskmate_rewards', mealsCalendar: 'calendar.meals', hideCompleted: true });
  });

  it('maps the legacy view key onto a calendar view', () => {
    expect(normaliseConfig({ ...base, view: 'agenda' }).calendarView).toBe('day');
    expect(normaliseConfig({ ...base, view: 'week' }).calendarView).toBe('week');
    expect(normaliseConfig({ ...base, view: 'columns' }).calendarView).toBe('schedule');
  });

  it('lets calendar_view win over a legacy view', () => {
    expect(normaliseConfig({ ...base, view: 'agenda', calendar_view: 'month' }).calendarView).toBe('month');
  });

  it('rejects an unknown home or calendar_view', () => {
    expect(() => normaliseConfig({ ...base, home: 'photos' })).toThrow(/home/);
    expect(() => normaliseConfig({ ...base, calendar_view: 'year' })).toThrow(/calendar_view/);
  });

  it('only offers the rewards screen when a rewards sensor is set', () => {
    expect(normaliseConfig(base).screens).toEqual(['calendar', 'tasks', 'settings']);
    expect(normaliseConfig({ ...base, taskmate_rewards: 'sensor.taskmate_rewards' }).screens).toEqual(['calendar', 'tasks', 'rewards', 'settings']);
  });

  it('falls back to calendar when home names a screen that is not offered', () => {
    expect(normaliseConfig({ ...base, home: 'rewards' }).home).toBe('calendar');
  });
});

describe('chore calendars', () => {
  const base = { people: [{ name: 'Ana', calendars: ['calendar.taskmate_ana', 'calendar.ana_school'], todo: 'todo.ana' }] };

  it('treats TaskMate calendars as chore calendars automatically', () => {
    const cfg = normaliseConfig(base);
    expect(cfg.choreCalendars).toEqual(['calendar.taskmate_ana']);
  });

  it('accepts more through chore_calendars', () => {
    const cfg = normaliseConfig({ ...base, chore_calendars: ['calendar.ana_school'] });
    expect(cfg.choreCalendars.sort()).toEqual(['calendar.ana_school', 'calendar.taskmate_ana']);
  });
});
