import { LitElement, html, css, nothing } from 'lit';
import { PALETTE } from '../data/config.js';
import { detectPeople } from './autodetect.js';
import { probeCalendars } from './calendar-probe.js';

/**
 * Visual editor.
 *
 * The people list is hand-rolled rather than left to ha-form: nested repeating
 * lists are awkward there, and the people list is precisely the part that is
 * painful to hand-write, so skipping it would have fixed only the easy half.
 *
 * Everything emitted goes through the same shape `normaliseConfig` validates,
 * so YAML stays valid and the raw editor keeps working.
 */
export class FamilyHubCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _proposed: { state: true },
    _calInfo: { state: true },
  };

  static styles = css`
    .group { margin-bottom: 18px; }
    .row { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
    .row > label { flex: 1 1 160px; }
    label { display: block; font-size: 13px; color: var(--secondary-text-color); margin-bottom: 4px; }
    input, select { width: 100%; box-sizing: border-box; min-height: 40px; padding: 0 10px; border-radius: 8px;
      border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font: inherit; }
    input[type='color'] { padding: 2px; min-width: 52px; }
    h3 { font-size: 15px; margin: 22px 0 8px; }
    .person { border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px; margin-bottom: 10px; }
    .person-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .person-top .idx { font-weight: 600; flex: 1; }
    button { min-height: 36px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--divider-color);
      background: none; color: var(--primary-text-color); font: inherit; cursor: pointer; }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    button.icon { min-width: 36px; padding: 0; }
    button[disabled] { opacity: 0.4; cursor: default; }
    .err { color: var(--error-color, #d64545); font-size: 13px; margin-top: 6px; }
    .detect { border: 1px dashed var(--divider-color); border-radius: 10px; padding: 12px; margin-bottom: 14px; }
    .muted { color: var(--secondary-text-color); font-size: 13px; }
    /* A plain multi-select over nine similarly-named calendars made it far too
       easy to replace a selection instead of extending it, with no visible
       record of what was chosen. */
    .cals { border: 1px solid var(--divider-color); border-radius: 8px; max-height: 168px; overflow-y: auto; padding: 4px 6px; }
    .cal { display: flex; align-items: center; gap: 8px; min-height: 34px; font-size: 14px; }
    .cal input { width: 18px; min-height: 18px; flex: none; }
    .cal .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .flag { font-size: 12px; color: var(--warning-color, #b8860b); flex-shrink: 0; }
    .flag.bad { color: var(--error-color, #d64545); }
    .calsum { font-size: 12px; color: var(--secondary-text-color); margin-top: 4px; }
  `;

  setConfig(config) {
    // Held verbatim. Injecting defaults here would write keys the user never
    // set back into their YAML; the render path applies defaults instead.
    this._config = { ...config };
    this._proposed = null;
    this._calInfo = this._calInfo || {};
    this._probe();
  }

  /**
   * Check what the configured calendars actually hold, so an empty one can be
   * flagged. Picking a calendar that turns out to have nothing in it looks
   * identical to the card being broken.
   */
  async _probe() {
    if (!this.hass) return;
    const ids = [...new Set((this._config?.people || []).flatMap((p) => p.calendars || []))];
    const unknown = ids.filter((id) => !this._calInfo[id]);
    if (!unknown.length) return;
    const found = await probeCalendars(
      this.hass, unknown, new Date(), this.hass.config?.time_zone || 'UTC',
    );
    this._calInfo = { ...this._calInfo, ...found };
  }

  // ── emit ────────────────────────────────────────────────────────────────

  /** Same rules normaliseConfig enforces, surfaced per row instead of thrown. */
  _errors(cfg) {
    const errs = {};
    const seen = new Set();
    (cfg.people || []).forEach((p, i) => {
      if (!p.name) errs[i] = 'Needs a name';
      else if (seen.has(p.name.trim().toLowerCase())) errs[i] = 'Duplicate name';
      else if (!(p.calendars || []).length && !p.todo) errs[i] = 'Needs a calendar or a to-do list';
      if (p.name) seen.add(p.name.trim().toLowerCase());
    });
    if (!(cfg.people || []).length) errs.card = 'Add at least one person';
    return errs;
  }

  /**
   * Always emits, even when the config is momentarily invalid.
   *
   * Swallowing the event instead would mean a keystroke made while a row is
   * incomplete just vanishes. Lovelace only holds the pending config until the
   * user saves, and an invalid one surfaces as an error in the preview — which
   * is informative. Errors are shown inline on the offending row as well.
   */
  _emit(cfg) {
    this._config = cfg;
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }),
    );
  }

  /** Merge a patch into the config and announce it. */
  _apply(patch) {
    this._emit({ ...this._config, ...patch });
  }

  /**
   * The TaskMate chores sensor, found by its payload rather than its name: it
   * is the only sensor carrying a todays_completions array.
   */
  _detectedChoresSensor() {
    if (!this.hass) return null;
    return (
      Object.keys(this.hass.states).find(
        (id) =>
          id.startsWith('sensor.') &&
          Array.isArray(this.hass.states[id].attributes?.todays_completions),
      ) || null
    );
  }

  _setCard(key, value) {
    const cfg = { ...this._config };
    if (value === '' || value === null || value === undefined) delete cfg[key];
    else cfg[key] = value;
    this._emit(cfg);
  }

  _setHeader(key, value) {
    const header = { ...(this._config.header || {}) };
    if (value === '' || value === null) delete header[key];
    else header[key] = value;
    this._emit({ ...this._config, header });
  }

  _setPerson(i, key, value) {
    const people = [...(this._config.people || [])];
    const person = { ...people[i] };
    if (value === '' || value === null) delete person[key];
    else person[key] = value;
    people[i] = person;
    this._emit({ ...this._config, people });
  }

  /** Add or remove a single calendar, leaving the others alone. */
  _toggleCalendar(i, id, on) {
    const current = this._config.people[i].calendars || [];
    const next = on ? [...current, id] : current.filter((x) => x !== id);
    this._setPerson(i, 'calendars', next.length ? next : null);
    this._probe();
  }

  _addPerson() {
    const people = [...(this._config.people || [])];
    people.push({ name: '', color: PALETTE[people.length % PALETTE.length] });
    this._emit({ ...this._config, people });
  }

  _removePerson(i) {
    const people = (this._config.people || []).filter((_, x) => x !== i);
    this._emit({ ...this._config, people });
  }

  /** Order is display order and drives palette assignment, so it is editable. */
  _movePerson(i, delta) {
    const people = [...(this._config.people || [])];
    const j = i + delta;
    if (j < 0 || j >= people.length) return;
    [people[i], people[j]] = [people[j], people[i]];
    this._emit({ ...this._config, people });
  }

  // ── autodetect ──────────────────────────────────────────────────────────

  _detect() {
    this._proposed = detectPeople(this.hass, this._config.people || []);
  }

  _acceptProposed() {
    const people = [...(this._config.people || []), ...this._proposed];
    this._proposed = null;
    this._emit({ ...this._config, people });
  }

  // ── render ──────────────────────────────────────────────────────────────

  _entities(prefix) {
    return Object.keys(this.hass?.states || {}).filter((id) => id.startsWith(prefix)).sort();
  }

  _select(label, value, options, onChange, { blank = 'None' } = {}) {
    return html`
      <label>${label}
        <select @change=${(e) => onChange(e.target.value)}>
          <option value="">${blank}</option>
          ${options.map(
            (id) => html`<option value=${id} ?selected=${id === value}>
              ${this.hass?.states?.[id]?.attributes?.friendly_name || id}
            </option>`,
          )}
        </select>
      </label>
    `;
  }

  render() {
    if (!this._config) return nothing;
    const c = this._config;
    const errs = this._errors(c);

    return html`
      <div class="group row">
        <label>View
          <select @change=${(e) => this._setCard('view', e.target.value)}>
            ${['agenda', 'week', 'columns'].map(
              (v) => html`<option value=${v} ?selected=${(c.view || 'agenda') === v}>${v}</option>`,
            )}
          </select>
        </label>
        <label>Theme
          <select @change=${(e) => this._setCard('theme', e.target.value)}>
            ${['auto', 'dark', 'light'].map(
              (v) => html`<option value=${v} ?selected=${(c.theme || 'auto') === v}>${v}</option>`,
            )}
          </select>
        </label>
        <label>Chores shown
          <select @change=${(e) => this._setCard('chore_filter', e.target.value)}>
            ${['today', 'all'].map(
              (v) => html`<option value=${v} ?selected=${(c.chore_filter || 'today') === v}>${v}</option>`,
            )}
          </select>
        </label>
        <label>Tick chores on their event
          <input type="checkbox" .checked=${Boolean(c.inline_chores)}
            @change=${(e) => this._setCard('inline_chores', e.target.checked)} />
        </label>
      </div>

      <div class="group row">
        <label>Refresh (s)
          <input type="number" min="60" .value=${String(c.refresh_interval ?? 300)}
            @change=${(e) => this._setCard('refresh_interval', Number(e.target.value))} />
        </label>
        <label>Undo window (s)
          <input type="number" min="0" .value=${String(c.confirm_window ?? 3)}
            @change=${(e) => this._setCard('confirm_window', Number(e.target.value))} />
        </label>
        <label>Return to today (s)
          <input type="number" min="0" .value=${String(c.return_to_today ?? 120)}
            @change=${(e) => this._setCard('return_to_today', Number(e.target.value))} />
        </label>
      </div>

      <div class="group row">
        ${this._select('Weather', c.header?.weather, this._entities('weather.'),
          (v) => this._setHeader('weather', v))}
        ${this._select('TaskMate chores sensor', c.taskmate_chores, this._entities('sensor.'),
          (v) => this._setCard('taskmate_chores', v))}
      </div>
      ${this._choresSuggestion(c)}

      <h3>People</h3>
      ${errs.card ? html`<div class="err">${errs.card}</div>` : nothing}
      ${this._detectBlock()}
      ${(c.people || []).map((p, i) => this._personRow(p, i, errs[i]))}
      <button @click=${() => this._addPerson()}>Add person</button>
    `;
  }

  /** One-tap wiring for the chores sensor, which is easy to miss in a long list. */
  _choresSuggestion(c) {
    const found = this._detectedChoresSensor();
    if (!found || c.taskmate_chores === found) return nothing;
    return html`<div class="detect">
      TaskMate detected: <code>${found}</code>
      <button style="margin-left:8px" @click=${() => this._apply({ taskmate_chores: found })}>Use it</button>
    </div>`;
  }

  _detectBlock() {
    if (this._proposed?.length) {
      return html`
        <div class="detect">
          <div>Found ${this._proposed.length} TaskMate ${this._proposed.length === 1 ? 'child' : 'children'}:
            <b>${this._proposed.map((p) => p.name).join(', ')}</b></div>
          <div class="muted">Check the entities after adding — the to-do list is matched by name.</div>
          <div class="row" style="margin-top:8px">
            <button class="primary" @click=${() => this._acceptProposed()}>Add them</button>
            <button @click=${() => { this._proposed = null; }}>Dismiss</button>
          </div>
        </div>
      `;
    }
    if (this._proposed) {
      return html`<div class="detect muted">
        No new TaskMate children found.
        <button style="margin-left:8px" @click=${() => { this._proposed = null; }}>OK</button>
      </div>`;
    }
    return html`<div class="detect">
      <button @click=${() => this._detect()}>Detect people</button>
      <span class="muted"> — finds TaskMate children and wires their entities</span>
    </div>`;
  }

  _calRow(personIndex, id, checked) {
    const info = checked ? this._calInfo?.[id] : null;
    return html`
      <div class="cal">
        <input type="checkbox" id=${`cal-${personIndex}-${id}`} .checked=${checked}
          @change=${(e) => this._toggleCalendar(personIndex, id, e.target.checked)} />
        <label class="name" for=${`cal-${personIndex}-${id}`} style="margin:0">
          ${this.hass?.states?.[id]?.attributes?.friendly_name || id}
        </label>
        ${info?.error
          ? html`<span class="flag bad">unreadable</span>`
          : info && info.count === 0
            ? html`<span class="flag">no events this week</span>`
            : nothing}
      </div>
    `;
  }

  _personRow(p, i, error) {
    const cals = Array.isArray(p.calendars) ? p.calendars : (p.calendars ? [p.calendars] : []);
    return html`
      <div class="person">
        <div class="person-top">
          <span class="idx">${p.name || `Person ${i + 1}`}</span>
          <button class="icon" title="Move up" ?disabled=${i === 0}
            @click=${() => this._movePerson(i, -1)}>↑</button>
          <button class="icon" title="Move down" ?disabled=${i === (this._config.people.length - 1)}
            @click=${() => this._movePerson(i, 1)}>↓</button>
          <button class="icon" title="Remove" @click=${() => this._removePerson(i)}>✕</button>
        </div>
        <div class="row">
          <label style="flex:2 1 200px">Name
            <input type="text" .value=${p.name || ''}
              @input=${(e) => this._setPerson(i, 'name', e.target.value)} />
          </label>
          <label style="flex:0 0 70px">Colour
            <input type="color" .value=${p.color || PALETTE[i % PALETTE.length]}
              @change=${(e) => this._setPerson(i, 'color', e.target.value)} />
          </label>
        </div>
        <div class="row">
          ${this._select('To-do list', p.todo, this._entities('todo.'),
            (v) => this._setPerson(i, 'todo', v))}
          ${this._select('Points sensor', p.points, this._entities('sensor.'),
            (v) => this._setPerson(i, 'points', v))}
        </div>
        <label>Calendars</label>
        <div class="cals">
          ${this._entities('calendar.').map((id) => this._calRow(i, id, cals.includes(id)))}
        </div>
        <div class="calsum">
          ${cals.length ? `${cals.length} selected` : 'None selected'}
        </div>
        ${error ? html`<div class="err">${error}</div>` : nothing}
      </div>
    `;
  }
}

customElements.define('family-hub-card-editor', FamilyHubCardEditor);
