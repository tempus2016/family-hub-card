export const PALETTE = [
  '#4A9EFF', '#FF4A87', '#FFB84A', '#4ADE80',
  '#A78BFA', '#22D3EE', '#F97316', '#E879F9',
];

const VIEWS = ['agenda', 'columns', 'week'];

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

  const seen = new Set();
  const people = cfg.people.map((p, i) => {
    if (!p || !p.name) {
      throw new Error('family-hub-card: every person needs a `name`');
    }
    const calendars = p.calendars == null ? [] : [].concat(p.calendars);
    if (calendars.length === 0 && !p.todo) {
      throw new Error(`family-hub-card: "${p.name}" needs \`calendars\` or \`todo\``);
    }
    const id = slug(p.name);
    if (seen.has(id)) {
      throw new Error(`family-hub-card: duplicate person name "${p.name}"`);
    }
    seen.add(id);
    return {
      id,
      name: p.name,
      color: p.color || PALETTE[i % PALETTE.length],
      initials: p.initials || String(p.name).trim()[0].toUpperCase(),
      calendars,
      todo: p.todo || null,
      points: p.points || null,
    };
  });

  return {
    view,
    refreshInterval: Math.max(60, Number(cfg.refresh_interval ?? 300)),
    choreFilter: cfg.chore_filter === 'all' ? 'all' : 'today',
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
