import { LitElement, html, css, nothing } from 'lit';
import { tokens, shared, personStyle, ensureFonts } from './styles/theme.js';
import { normaliseConfig } from './data/config.js';
import { HubData } from './data/hub-data.js';
import { msUntilNextMinute } from './data/time.js';
import { weekStartOffset, monthStartOffset, monthGrid } from './data/calendar-grid.js';
import { effectiveSettings, saveSettings } from './data/settings.js';
import { t, pickLanguage } from './i18n.js';
import { formatTime, formatDate } from './format.js';
import './screens/calendar-screen.js';
import './screens/tasks-screen.js';
import './screens/rewards-screen.js';
import './screens/settings-screen.js';
import './screens/submit-sheet.js';
import './screens/timer-sheet.js';
import { uploadPhoto, shrinkImage, friendlyError } from './data/taskmate-submit.js';
import './add/add-dialog.js';
import { availableTypes } from './add/add-controller.js';
// Registers <family-hub-card-editor>, which getConfigElement() instantiates by
// tag name — without this import the visual editor renders as an unknown element.
import './editor/family-hub-card-editor.js';

const ENTITY_RE = /^[a-z_]+\.[a-z0-9_]+$/;
const DAY_MS = 24 * 3600 * 1000;

/** Home Assistant weather conditions → Material Design icons. */
export const WEATHER_ICONS = {
  'clear-night': 'mdi:weather-night', cloudy: 'mdi:weather-cloudy', exceptional: 'mdi:alert-circle-outline',
  fog: 'mdi:weather-fog', hail: 'mdi:weather-hail', lightning: 'mdi:weather-lightning',
  'lightning-rainy': 'mdi:weather-lightning-rainy', partlycloudy: 'mdi:weather-partly-cloudy',
  pouring: 'mdi:weather-pouring', rainy: 'mdi:weather-rainy', snowy: 'mdi:weather-snowy',
  'snowy-rainy': 'mdi:weather-snowy-rainy', sunny: 'mdi:weather-sunny', windy: 'mdi:weather-windy',
  'windy-variant': 'mdi:weather-windy-variant',
};

const RAIL_ICONS = {
  calendar: 'mdi:calendar-blank-outline',
  tasks: 'mdi:check',
  rewards: 'mdi:star-outline',
  settings: 'mdi:cog-outline',
};

/**
 * Which palette to paint. `auto` follows Home Assistant's own dark-mode flag,
 * falling back to the OS preference before hass has arrived. `dark` and `light`
 * pin it — a wall tablet often wants to stay dark regardless of the dashboard.
 */
export function resolveScheme(hass, configTheme) {
  if (configTheme === 'dark' || configTheme === 'light') return configTheme;
  const haDark = hass?.themes?.darkMode;
  if (typeof haDark === 'boolean') return haDark ? 'dark' : 'light';
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark';
}

export function resolveSubtitle(hass, subtitle) {
  if (!subtitle) return '';
  if (ENTITY_RE.test(subtitle) && hass?.states?.[subtitle]) return hass.states[subtitle].state;
  // A typo'd entity id renders as visible text rather than blanking silently.
  return subtitle;
}

class FamilyHubCard extends LitElement {
  static properties = {
    _tick: { state: true },
    _screen: { state: true },
    _calView: { state: true },
    _offset: { state: true },
    _monthShift: { state: true },
    _hidden: { state: true },
    _settings: { state: true },
  };

  static styles = [
    tokens,
    shared,
    css`
      ha-card { background: var(--fh-page); color: var(--fh-text); border: none; border-radius: var(--fh-radius); overflow: hidden; font-family: var(--fh-sans); }
      .app { display: grid; grid-template-columns: 68px 1fr; min-height: 480px; }
      .app[data-narrow='true'] { grid-template-columns: 1fr; grid-template-rows: 1fr auto; }

      /* rail */
      /* Sticky so Settings stays reachable while a long screen scrolls. */
      .rail { background: var(--fh-rail); display: flex; flex-direction: column; padding: 10px 6px; gap: 4px; position: sticky; top: 0; align-self: start; max-height: 100vh; min-height: 100%; }
      .rail .logo { height: 48px; display: grid; place-items: center; font-family: var(--fh-serif); font-size: 24px; color: var(--fh-text-2); margin-bottom: 8px; }
      .rail .spacer { flex: 1; }
      .rail button { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 2px 8px; border-radius: 12px; color: var(--fh-text-2); font-size: 10.5px; min-height: 56px; }
      .rail button ha-icon { --mdc-icon-size: 22px; }
      .rail button.on { background: var(--fh-rail-on); color: var(--fh-text); box-shadow: var(--fh-shadow); }
      .app[data-narrow='true'] .rail { order: 2; flex-direction: row; padding: 6px 8px; justify-content: space-around; position: sticky; top: auto; bottom: 0; min-height: 0; align-self: stretch; }
      .app[data-narrow='true'] .rail .logo, .app[data-narrow='true'] .rail .spacer { display: none; }
      .app[data-narrow='true'] .rail button { min-height: 48px; padding: 6px 2px 4px; flex: 1; }

      /* main */
      .main { display: flex; flex-direction: column; min-width: 0; }
      .head { display: flex; align-items: center; gap: 14px; padding: 18px 24px 10px; flex-wrap: wrap; }
      .title { font-family: var(--fh-serif); font-size: 28px; letter-spacing: -.2px; display: flex; align-items: baseline; gap: 14px; min-width: 0; flex-wrap: wrap; }
      .title .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .title .time { font-weight: 400; }
      .title .wx { font-family: var(--fh-sans); font-size: 18px; color: var(--fh-text-2); display: inline-flex; align-items: center; gap: 6px; }
      .title .wx ha-icon { --mdc-icon-size: 20px; }
      .sub { width: 100%; font-size: 14px; color: var(--fh-text-2); margin-top: -4px; }
      .tools { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
      .app[data-narrow='true'] .head { padding: 14px 16px 6px; }
      .app[data-narrow='true'] .title { font-size: 22px; gap: 10px; }
      .app[data-narrow='true'] .tools { width: 100%; justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
      .pill select { font: inherit; border: 0; background: transparent; color: inherit; font-weight: 500; outline: none; -webkit-appearance: none; appearance: none; padding-right: 14px; }
      .pill.sel { position: relative; }
      .pill.sel::after { content: '⌄'; position: absolute; right: 14px; top: 8px; pointer-events: none; }
      .filters { display: flex; gap: 6px; }
      .filters .av { cursor: pointer; box-shadow: 0 0 0 2px var(--fh-page); }

      .screen { flex: 1; min-height: 0; padding: 6px 24px 90px; position: relative; }
      .app[data-narrow='true'] .screen { padding: 4px 16px 90px; }
      .stale { font-size: 12px; color: var(--fh-star); padding: 0 0 8px; }
      .fab { position: absolute; right: 22px; bottom: 22px; width: 56px; height: 56px; border-radius: 50%; background: var(--fh-fab); color: #fff; font-size: 30px; display: grid; place-items: center; box-shadow: 0 8px 24px rgba(45,108,223,.35); }
      .app[data-narrow='true'] .fab { bottom: 86px; }
      .loading { padding: 24px 26px; color: var(--fh-text-2); font-size: 16px; }
    `,
  ];

  constructor() {
    super();
    this._offset = 0;
    this._monthShift = 0;
    this._hidden = new Set();
    this._settings = {};
    this._narrow = false;
  }

  // ── lifecycle ───────────────────────────────────────────────────────────

  setConfig(config) {
    this._config = normaliseConfig(config);
    ensureFonts();
    this._loadSettings();
    this._screen = this._settings.home;
    this._calView = this._settings.calendarView;
    this._applyScheme();
    this._hub?.stop();
    this._hub = null;
  }

  set hass(hass) {
    const prev = this._hass;
    this._hass = hass;
    this._applyScheme();
    if (this._hub) this._hub.hassChanged(prev);
    if (!this._hub && this._config) {
      this._hub = new HubData({
        config: this._config,
        getHass: () => this._hass,
        getNow: () => new Date(),
        onChange: () => this.requestUpdate(),
        schedule: (fn, ms) => { const id = setInterval(fn, ms); return () => clearInterval(id); },
      });
      this._syncWindow();
      this._hub.start();
      this._hub.refresh();
    }
    this.requestUpdate();
  }

  get hass() { return this._hass; }
  get _tz() { return this._hass?.config?.time_zone || 'UTC'; }
  get _storage() { try { return window.localStorage; } catch { return null; } }

  _loadSettings() {
    this._settings = effectiveSettings(this._storage, this._config);
  }

  _applyScheme() {
    const scheme = resolveScheme(this._hass, this._settings?.theme || this._config?.theme);
    if (this.dataset.scheme !== scheme) {
      this.dataset.scheme = scheme;
      this.requestUpdate();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._applyScheme();
    this._ro = new ResizeObserver(([entry]) => {
      const narrow = entry.contentRect.width < 760;
      if (narrow !== this._narrow) { this._narrow = narrow; this.requestUpdate(); }
    });
    this._ro.observe(this);
    this._scheduleTick();
    this._onOnline = () => this._hub?.refresh();
    window.addEventListener('online', this._onOnline);
    // disconnectedCallback stops the hub's timers. A card inside a conditional
    // card, a popup or a dragged section is re-attached without setConfig, so
    // the timers have to come back here.
    if (this._hub) { this._hub.start(); this._hub.refresh(); }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
    clearTimeout(this._tickTimer);
    clearTimeout(this._returnTimer);
    window.removeEventListener('online', this._onOnline);
    this._hub?.stop();
  }

  // One timer aligned to the minute boundary, not a one-second interval — this
  // card runs for weeks on a wall tablet.
  _scheduleTick() {
    this._tickTimer = setTimeout(() => {
      this._tick = Date.now();
      // The week's start moves at midnight; the setters are no-ops otherwise.
      this._syncWindow();
      this._scheduleTick();
    }, msUntilNextMinute(new Date()));
  }

  getCardSize() { return 12; }
  getGridOptions() { return { columns: 'full', rows: 'auto', min_columns: 6, min_rows: 4 }; }
  getLayoutOptions() { return { grid_columns: 'full', grid_rows: 'auto', grid_min_columns: 6 }; }
  static getConfigElement() { return document.createElement('family-hub-card-editor'); }
  static getStubConfig() { return { people: [{ name: 'Ana', todo: 'todo.ana' }] }; }

  // ── window and paging ───────────────────────────────────────────────────

  /** Days from today to the first day the hub should fetch, for the current view. */
  get _startOffset() {
    const now = new Date();
    switch (this._calView) {
      case 'day': return this._offset;
      case 'month': return monthStartOffset(now, this._tz, this._config.weekStart, this._monthShift);
      default: return this._offset + weekStartOffset(now, this._tz, this._config.weekStart);
    }
  }

  get _windowDays() {
    return this._calView === 'day' ? 1 : this._calView === 'month' ? 42 : 7;
  }

  _syncWindow() {
    if (!this._hub || !this._config) return;
    this._hub.windowDays = this._windowDays;
    this._hub.startOffset = this._startOffset;
  }

  get _isToday() { return this._calView === 'month' ? !this._monthShift : !this._offset; }

  _page(direction) {
    if (this._calView === 'month') this._monthShift += direction;
    else this._offset += direction * (this._calView === 'day' ? 1 : 7);
    this._afterInteraction();
  }

  _goHome() {
    this._offset = 0;
    this._monthShift = 0;
    this._screen = this._settings.home;
    this._calView = this._settings.calendarView;
    this._hidden = new Set();
    this._syncWindow();
    clearTimeout(this._returnTimer);
    this.requestUpdate();
  }

  _today() {
    this._offset = 0;
    this._monthShift = 0;
    this._afterInteraction();
  }

  _afterInteraction() {
    this._syncWindow();
    this._armReturn();
    this.requestUpdate();
  }

  /**
   * Without this the wall tablet stays parked on whatever someone last looked
   * at — a display confidently showing the wrong thing to everyone who walks
   * past, which is worse than showing nothing.
   */
  _armReturn() {
    clearTimeout(this._returnTimer);
    const secs = this._config?.returnToToday;
    const away = this._offset || this._monthShift || this._screen !== this._settings.home
      || this._calView !== this._settings.calendarView || this._hidden.size;
    if (!secs || !away) return;
    this._returnTimer = setTimeout(() => this._goHome(), secs * 1000);
  }

  _setScreen(screen) {
    this._screen = screen;
    this._afterInteraction();
  }

  _setCalView(view) {
    this._calView = view;
    this._offset = 0;
    this._monthShift = 0;
    this._afterInteraction();
  }

  _openDay(offset) {
    this._calView = 'day';
    this._offset = offset;
    this._monthShift = 0;
    this._afterInteraction();
  }

  _toggleFilter(id) {
    const next = new Set(this._hidden);
    if (next.has(id)) next.delete(id); else next.add(id);
    this._hidden = next;
    this._afterInteraction();
  }

  _onSettingsChange(e) {
    const { key, value } = e.detail;
    saveSettings(this._storage, this._config, { [key]: value });
    this._loadSettings();
    if (key === 'theme') this._applyScheme();
    if (key === 'calendarView') this._calView = this._settings.calendarView;
    this.requestUpdate();
  }

  _onChoreTap(e) {
    const { personId, choreId } = e.detail;
    this._hub?.complete(personId, choreId);
  }

  /** A chore that needs a note, photo or count: open the sheet for it. */
  _onChoreNeeds(e) {
    const { personId, choreId } = e.detail;
    const person = this._hub?.model.people.find((p) => p.id === personId);
    const task = person?.tasks?.find((x) => x.id === choreId);
    if (!task) return;
    if (task.needs === 'timer') {
      this._timerFor = { personId, choreId };
      this.renderRoot.querySelector('family-hub-timer-sheet')?.show({
        personName: person.name,
        personStyle: personStyle(person.color, this.dataset.scheme || 'light'),
        task,
      });
      this._armReturn();
      return;
    }
    this._submitFor = personId;
    const sheet = this.renderRoot.querySelector('family-hub-submit-sheet');
    sheet?.show({
      personName: person.name,
      personStyle: personStyle(person.color, this.dataset.scheme || 'light'),
      task,
      upload: async (blob) => uploadPhoto(this._hass, await shrinkImage(blob)),
    });
    this._armReturn();
  }

  async _onTimerAction(e) {
    const sheet = this.renderRoot.querySelector('family-hub-timer-sheet');
    const { personId, choreId } = this._timerFor || {};
    try {
      await this._hub.timer(personId, choreId, e.detail.action);
      if (e.detail.action === 'finish') sheet?.done();
      else sheet?.settled();
    } catch (err) {
      sheet?.fail(friendlyError(err, pickLanguage(this._hass)));
    }
  }

  /** The timed task as the model has it now, so the sheet follows TaskMate. */
  _timerTask() {
    if (!this._timerFor || !this._hub) return null;
    const person = this._hub.model.people.find((p) => p.id === this._timerFor.personId);
    return person?.tasks?.find((x) => x.id === this._timerFor.choreId) || null;
  }

  async _onSubmitChore(e) {
    const sheet = this.renderRoot.querySelector('family-hub-submit-sheet');
    try {
      await this._hub.submit(this._submitFor, e.detail.choreId, e.detail);
      sheet?.done();
    } catch (err) {
      sheet?.fail(friendlyError(err, pickLanguage(this._hass)));
    }
  }

  // ── render ──────────────────────────────────────────────────────────────

  _title(now) {
    const locale = this._hass.locale;
    if (this._config.familyName) return this._config.familyName;
    if (this._calView === 'month' && this._screen === 'calendar') {
      return monthGrid(now, this._tz, this._config.weekStart, this._monthShift).label;
    }
    const d = new Date(now.getTime() + (this._calView === 'day' ? this._offset : 0) * DAY_MS);
    return formatDate(d, locale, this._tz, this._narrow
      ? { weekday: 'short', day: 'numeric', month: 'short' }
      : { weekday: 'long', day: 'numeric', month: 'long' });
  }

  _weather() {
    const id = this._config.header.weather;
    const st = id ? this._hass.states[id] : null;
    if (!st) return nothing;
    const icon = WEATHER_ICONS[st.state];
    const temp = st.attributes?.temperature;
    return html`<span class="wx">
      ${icon ? html`<ha-icon icon=${icon}></ha-icon>` : nothing}
      ${temp == null || Number.isNaN(Number(temp)) ? nothing : html`<span>${Math.round(temp)}°</span>`}
    </span>`;
  }

  render() {
    if (!this._config) return nothing;
    if (!this._hass || !this._hub) {
      return html`<ha-card><div class="loading">${t(pickLanguage(this._hass), 'loading')}</div></ha-card>`;
    }
    const now = new Date();
    const lang = pickLanguage(this._hass);
    const locale = this._hass.locale;
    const tz = this._tz;
    const scheme = this.dataset.scheme || 'light';
    const subtitle = resolveSubtitle(this._hass, this._config.header.subtitle);
    const full = this._hub.model;
    const visiblePeople = full.people.filter((p) => !this._hidden.has(p.id));
    const model = { ...full, people: visiblePeople };
    const filterable = full.people.filter((p) => !p.shared && !p.hidden);
    const screen = this._config.screens.includes(this._screen) ? this._screen : 'calendar';

    return html`
      <ha-card>
        <div class="app" data-narrow=${String(this._narrow)}>
          <nav class="rail">
            <div class="logo">${(this._config.familyName || 'F').trim()[0].toUpperCase()}</div>
            ${this._config.screens.filter((s) => s !== 'settings').map((s) => this._railButton(s, screen, lang))}
            <span class="spacer"></span>
            ${this._railButton('settings', screen, lang)}
          </nav>
          <div class="main">
            <header class="head">
              <div class="title">
                <span class="name">${this._title(now)}</span>
                ${this._config.header.clock ? html`<span class="time">${formatTime(now, locale, tz)}</span>` : nothing}
                ${this._weather()}
              </div>
              <div class="tools">
                ${screen === 'calendar' || screen === 'tasks' ? html`<div class="filters">
                  ${filterable.map((p) => html`<button class="av ${this._hidden.has(p.id) ? 'off' : ''}" data-person=${p.id} title=${p.name}
                      style=${personStyle(p.color, scheme)} @click=${() => this._toggleFilter(p.id)}>${p.picture ? html`<img src=${p.picture} alt="" />` : p.initials}</button>`)}
                </div>` : nothing}
                ${screen === 'calendar' ? html`<label class="pill sel"><select .value=${this._calView} @change=${(e) => this._setCalView(e.target.value)}>
                  ${['schedule', 'week', 'month', 'day'].map((v) => html`<option value=${v} ?selected=${v === this._calView}>${t(lang, v)}</option>`)}
                </select></label>` : nothing}
                ${screen === 'calendar' ? html`
                  <button class="pill icon" aria-label=${t(lang, 'previous')} @click=${() => this._page(-1)}>‹</button>
                  <button class="pill" @click=${() => this._today()}>${t(lang, 'today')}</button>
                  <button class="pill icon" aria-label=${t(lang, 'next_page')} @click=${() => this._page(1)}>›</button>` : nothing}
              </div>
              ${subtitle ? html`<div class="sub">${subtitle}</div>` : nothing}
            </header>
            <div class="screen">
              ${full.staleSince ? html`<div class="stale">${t(lang, 'last_updated', { time: formatTime(full.staleSince, locale, tz) })}</div>` : nothing}
              ${this._renderScreen(screen, model, now, lang, locale, tz, scheme)}
              ${availableTypes(this._hass, this._config).length && screen !== 'settings'
                ? html`<button class="fab" aria-label=${t(lang, 'add')} title=${t(lang, 'add')}
                    @click=${() => this.renderRoot.querySelector('family-hub-add-dialog')?.show()}>+</button>`
                : nothing}
            </div>
          </div>
        </div>
        <family-hub-timer-sheet .lang=${lang} .task=${this._timerTask()}
          @timer-action=${(e) => this._onTimerAction(e)}></family-hub-timer-sheet>
        <family-hub-submit-sheet .lang=${lang}
          @submit-chore=${(e) => this._onSubmitChore(e)}></family-hub-submit-sheet>
        <family-hub-add-dialog
          .hass=${this._hass} .config=${this._config} .lang=${lang}
          .date=${new Date(now.getTime() + (this._calView === 'day' ? this._offset : 0) * DAY_MS)}
          @created=${() => this._hub?.refresh()}
        ></family-hub-add-dialog>
      </ha-card>
    `;
  }

  _railButton(s, current, lang) {
    return html`<button class=${s === current ? 'on' : ''} data-screen=${s} @click=${() => this._setScreen(s)}>
      <ha-icon icon=${RAIL_ICONS[s]}></ha-icon>${t(lang, s)}
    </button>`;
  }

  _renderScreen(screen, model, now, lang, locale, tz, scheme) {
    switch (screen) {
      case 'tasks':
        return html`<family-hub-tasks-screen
          .model=${model} .now=${now} .tz=${tz} .lang=${lang} .scheme=${scheme}
          .isToday=${true} .hideCompleted=${Boolean(this._settings.hideCompleted)}
          .confirmWindow=${this._config.confirmWindow} .readOnly=${false}
          @chore-tap=${(e) => this._onChoreTap(e)}
          @chore-needs=${(e) => this._onChoreNeeds(e)}
        ></family-hub-tasks-screen>`;
      case 'rewards':
        return html`<family-hub-rewards-screen
          .hass=${this._hass} .model=${model} .rewardsEntity=${this._config.taskmateRewards}
          .lang=${lang} .scheme=${scheme}
        ></family-hub-rewards-screen>`;
      case 'settings':
        return html`<family-hub-settings-screen
          .settings=${this._settings} .config=${this._config} .lang=${lang}
          @settings-change=${(e) => this._onSettingsChange(e)}
        ></family-hub-settings-screen>`;
      default:
        return html`<family-hub-calendar-screen
          .model=${model} .mode=${this._calView} .now=${now} .locale=${locale} .lang=${lang} .tz=${tz} .scheme=${scheme}
          .startOffset=${this._startOffset} .offsetDays=${this._calView === 'month' ? this._monthShift : this._offset}
          .monthShift=${this._monthShift} .weekStart=${this._config.weekStart}
          .inlineChores=${this._config.inlineChores}
          .confirmWindow=${this._config.confirmWindow} .readOnly=${!this._isToday}
          @chore-tap=${(e) => this._onChoreTap(e)}
          @chore-needs=${(e) => this._onChoreNeeds(e)}
          @open-day=${(e) => this._openDay(e.detail.offset)}
          @open-screen=${(e) => this._setScreen(e.detail.screen)}
        ></family-hub-calendar-screen>`;
    }
  }
}

customElements.define('family-hub-card', FamilyHubCard);

// Guarded so the module can be imported outside a browser (unit tests, build
// tooling) without assuming a window global at import time.
if (typeof window !== 'undefined') {
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'family-hub-card',
    name: 'Family Hub Card',
    description: 'A Skylight-style family calendar, chores and rewards board for a wall tablet.',
    preview: true,
    documentationURL: 'https://github.com/tempus2016/family-hub-card',
  });
}
