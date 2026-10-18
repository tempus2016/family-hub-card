/**
 * Per-device settings: the things a wall tablet wants pinned regardless of
 * what the dashboard YAML says, such as a dark theme at night or opening on
 * the Tasks screen. Stored in localStorage under a key derived from the
 * people on the card, so two different cards on one device stay apart and
 * the same card on two devices can differ.
 */

const OVERRIDABLE = ['theme', 'home', 'calendarView', 'hideCompleted'];

export function cardKey(config) {
  const names = (config.people || []).map((p) => String(p.name || '').trim().toLowerCase()).join('|');
  let h = 0;
  for (let i = 0; i < names.length; i += 1) h = (h * 31 + names.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

const keyFor = (config) => `family-hub:${cardKey(config)}`;

export function loadSettings(storage, config) {
  try {
    const raw = storage?.getItem(keyFor(config));
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** Merges `patch` into the stored settings; a null value removes the override. */
export function saveSettings(storage, config, patch) {
  const current = loadSettings(storage, config);
  for (const [k, v] of Object.entries(patch || {})) {
    if (!OVERRIDABLE.includes(k)) continue;
    if (v === null || v === undefined) delete current[k];
    else current[k] = v;
  }
  try {
    storage?.setItem(keyFor(config), JSON.stringify(current));
  } catch {
    // Private mode or a full store: the setting simply does not persist.
  }
  return current;
}

/** The YAML values with any device overrides laid on top. */
export function effectiveSettings(storage, config) {
  const over = loadSettings(storage, config);
  const out = {};
  for (const k of OVERRIDABLE) out[k] = over[k] ?? config[k];
  return out;
}
