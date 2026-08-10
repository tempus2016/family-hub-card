export const PALETTE = [
  '#4A9EFF', '#FF4A87', '#FFB84A', '#4ADE80',
  '#A78BFA', '#22D3EE', '#F97316', '#E879F9',
];

const VIEWS = ['agenda', 'columns', 'week'];
const THEMES = ['auto', 'dark', 'light'];

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

  const seen = new Set();
  const people = cfg.people.map((p, i) => {
    if (!p || !p.name) {
      throw new Error('family-hub-card: every person needs a `name`');
    }
    const calendars = p.calendars == null ? [] : [].concat(p.calendars);
    if (calendars.length === 0 && !p.todo) {
      throw new Error(`family-hub-card: "${p.name}" needs \`calendars\` or \`todo\``);
    }
    for (const entity of calendars) {
      if (!ENTITY_RE.test(String(entity))) {
        throw new Error(`family-hub-card: "${entity}" is not a valid entity id for "${p.name}"`);
      }
    }
    if (p.color != null && !COLOUR_RE.test(String(p.color).trim())) {
      throw new Error(`family-hub-card: "${p.color}" is not a valid \`color\` for "${p.name}"`);
    }
    const id = slug(p.name);
    if (seen.has(id)) {
      throw new Error(`family-hub-card: duplicate person name "${p.name}"`);
    }
    seen.add(id);
    return {
      id,
      name: p.name,
      color: p.color ? String(p.color).trim() : PALETTE[i % PALETTE.length],
      initials: p.initials || String(p.name).trim()[0].toUpperCase(),
      calendars,
      todo: p.todo || null,
      points: p.points || null,
    };
  });

  return {
    view,
    theme,
    refreshInterval: Math.max(60, Number(cfg.refresh_interval ?? 300)),
    returnToToday: cfg.return_to_today === 0 ? 0 : Math.max(10, Number(cfg.return_to_today ?? 120)),
    choreFilter: cfg.chore_filter === 'all' ? 'all' : 'today',
    inlineChores: Boolean(cfg.inline_chores),
    confirmWindow: cfg.confirm_window === 0 ? 0 : Number(cfg.confirm_window ?? 3),
    taskmateChores: cfg.taskmate_chores || null,
    header: {
      clock: cfg.header?.clock !== false,
      weather: cfg.header?.weather || null,
      subtitle: cfg.header?.subtitle || null,
    },
    people,
  };
}
