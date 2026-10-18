export const PALETTE = [
  '#4A9EFF', '#FF4A87', '#FFB84A', '#4ADE80',
  '#A78BFA', '#22D3EE', '#F97316', '#E879F9',
];

/** Neutral by design: the shared row belongs to nobody in particular. */
export const SHARED_COLOR = '#9AA3B8';
export const SHARED_ID = 'family';

const VIEWS = ['agenda', 'columns', 'week'];
const CALENDAR_VIEWS = ['schedule', 'week', 'month', 'day'];
// What the old single `view` meant, now that the calendar has its own picker.
const LEGACY_VIEW = { agenda: 'day', week: 'week', columns: 'schedule' };
const HOMES = ['calendar', 'tasks', 'rewards'];
const THEMES = ['auto', 'dark', 'light'];
const WEEK_STARTS = ['monday', 'sunday', 'today'];

// A person's colour is interpolated into a `style="--pc:…"` attribute. That
// attribute is a whole declaration list, so an unchecked value can close the
// custom property and append rules of its own — `red;position:fixed;inset:0`
// covers the dashboard. Accept only the forms a colour can legitimately take:
// hex (what the visual editor's colour input emits), a CSS named colour, an
// rgb()/hsl() function, or a var() reference to a theme variable.
const COLOUR_RE = /^(#[0-9a-f]{3,8}|[a-z]+|(rgba?|hsla?)\([0-9a-z%.,\s/]*\)|var\(\s*--[a-z0-9-]+\s*\))$/i;

// Entity ids reach the REST path in `calendars/<id>`. They are encoded at the
// call site; rejecting the malformed ones here turns a silently empty calendar
// into a message that names the typo.
const ENTITY_RE = /^[a-z_]+\.[a-z0-9_]+$/;

function slug(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function checkColour(colour, owner) {
  if (colour != null && !COLOUR_RE.test(String(colour).trim())) {
    throw new Error(`family-hub-card: "${colour}" is not a valid \`color\` for "${owner}"`);
  }
  return colour ? String(colour).trim() : null;
}

function checkCalendars(raw, owner) {
  const calendars = raw == null ? [] : [].concat(raw);
  for (const entity of calendars) {
    if (!ENTITY_RE.test(String(entity))) {
      throw new Error(`family-hub-card: "${entity}" is not a valid entity id for "${owner}"`);
    }
  }
  return calendars;
}

export function normaliseConfig(raw) {
  const cfg = raw || {};

  if (!Array.isArray(cfg.people) || cfg.people.length === 0) {
    throw new Error('family-hub-card: `people` is required and must list at least one person');
  }

  const view = cfg.view || 'agenda';
  if (!VIEWS.includes(view)) {
    throw new Error(`family-hub-card: unknown \`view\` "${view}" — expected one of ${VIEWS.join(', ')}`);
  }

  const theme = cfg.theme || 'auto';
  if (!THEMES.includes(theme)) {
    throw new Error(`family-hub-card: unknown \`theme\` "${theme}" — expected one of ${THEMES.join(', ')}`);
  }

  const calendarView = cfg.calendar_view || (cfg.view ? LEGACY_VIEW[view] : null) || 'schedule';
  if (!CALENDAR_VIEWS.includes(calendarView)) {
    throw new Error(`family-hub-card: unknown \`calendar_view\` "${calendarView}" — expected one of ${CALENDAR_VIEWS.join(', ')}`);
  }

  const home = cfg.home || 'calendar';
  if (!HOMES.includes(home)) {
    throw new Error(`family-hub-card: unknown \`home\` "${home}" — expected one of ${HOMES.join(', ')}`);
  }

  const weekStart = cfg.week_start || 'monday';
  if (!WEEK_STARTS.includes(weekStart)) {
    throw new Error(`family-hub-card: unknown \`week_start\` "${weekStart}" — expected one of ${WEEK_STARTS.join(', ')}`);
  }

  const seen = new Set();
  const people = cfg.people.map((p, i) => {
    if (!p || !p.name) {
      throw new Error('family-hub-card: every person needs a `name`');
    }
    const calendars = checkCalendars(p.calendars, p.name);
    if (calendars.length === 0 && !p.todo) {
      throw new Error(`family-hub-card: "${p.name}" needs \`calendars\` or \`todo\``);
    }
    if (p.person != null && !/^person\.[a-z0-9_]+$/.test(String(p.person))) {
      throw new Error(`family-hub-card: "${p.person}" is not a person entity for "${p.name}"`);
    }
    const id = slug(p.name);
    if (seen.has(id) || id === SHARED_ID) {
      throw new Error(`family-hub-card: duplicate person name "${p.name}"`);
    }
    seen.add(id);
    return {
      id,
      name: p.name,
      color: checkColour(p.color, p.name) || PALETTE[i % PALETTE.length],
      initials: p.initials || String(p.name).trim()[0].toUpperCase(),
      calendars,
      todo: p.todo || null,
      points: p.points || null,
      picture: p.picture || null,
      person: p.person || null,
      shared: false,
    };
  });

  // Shared calendars — the family one everybody is on — become one extra row
  // rather than a copy under every person. Listing the same calendar under
  // several people still works: the sources fetch it once and the agenda shows
  // the event once, naming everyone.
  const shared = checkCalendars(cfg.shared_calendars, 'shared_calendars');
  if (shared.length) {
    const name = cfg.shared_name || 'Family';
    people.push({
      id: SHARED_ID,
      name,
      color: checkColour(cfg.shared_color, name) || SHARED_COLOR,
      initials: String(name).trim()[0].toUpperCase(),
      calendars: shared,
      todo: null,
      points: null,
      picture: null,
      person: null,
      shared: true,
    });
  }

  if (cfg.meals_calendar) {
    checkCalendars(cfg.meals_calendar, 'meals_calendar');
    people.push({
      id: 'meals', name: 'Meals', color: '#f28c3a', initials: 'M', calendars: [cfg.meals_calendar],
      todo: null, points: null, picture: null, person: null, shared: true, hidden: true,
    });
  }


  // Events from these calendars are chores, which live on the Tasks screen;
  // the calendar shows them as one "n chores" pill per person per day rather
  // than a card each. TaskMate's per-child calendars are recognised by name.
  const extraChoreCals = checkCalendars(cfg.chore_calendars, 'chore_calendars');
  const choreCalendars = [...new Set([
    ...people.flatMap((p) => p.calendars).filter((id) => id.startsWith('calendar.taskmate_')),
    ...extraChoreCals,
  ])];

  // The rail only ever shows screens that can work: Rewards needs the sensor.
  const screens = ['calendar', 'tasks'];
  if (cfg.taskmate_rewards) screens.push('rewards');
  screens.push('settings');

  return {
    view,
    calendarView,
    home: screens.includes(home) ? home : 'calendar',
    screens,
    familyName: cfg.family_name ? String(cfg.family_name) : null,
    choreCalendars,
    hideCompleted: Boolean(cfg.hide_completed),
    taskmateRewards: cfg.taskmate_rewards || null,
    mealsCalendar: cfg.meals_calendar || null,
    theme,
    weekStart,
    refreshInterval: Math.max(60, Number(cfg.refresh_interval ?? 300)),
    returnToToday: cfg.return_to_today === 0 ? 0 : Math.max(10, Number(cfg.return_to_today ?? 120)),
    choreFilter: cfg.chore_filter === 'all' ? 'all' : 'today',
    // Chores with a matching calendar event carry their tick on the event.
    // `tabs` from earlier versions is accepted and ignored: Tasks is a screen.
    inlineChores: cfg.inline_chores !== false,
    confirmWindow: cfg.confirm_window === 0 ? 0 : Number(cfg.confirm_window ?? 3),
    // Stock to-do lists keep completed items until cleared; this is how many
    // of them a person's card shows struck through. TaskMate never returns
    // completed items, so it is unaffected.
    maxCompleted: cfg.max_completed === 0 ? 0 : Math.max(0, Number(cfg.max_completed ?? 3)),
    taskmateChores: cfg.taskmate_chores || null,
    header: {
      clock: cfg.header?.clock !== false,
      weather: cfg.header?.weather || null,
      subtitle: cfg.header?.subtitle || null,
    },
    people,
  };
}
