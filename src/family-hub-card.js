import { LitElement, html, css, nothing } from 'lit';
import { tokens, sharedStyles } from './styles/shared.js';
import { normaliseConfig } from './data/config.js';
import { HubData } from './data/hub-data.js';
import { msUntilNextMinute } from './data/time.js';
import { t, pickLanguage } from './i18n.js';
import { formatTime, formatDate } from './format.js';
import { weekStartOffset } from './views/week-view.js';
import './views/agenda-view.js';
import './views/columns-view.js';
import './views/tasks-view.js';
import './add/add-dialog.js';
import { availableTypes } from './add/add-controller.js';
// Registers <family-hub-card-editor>, which getConfigElement() instantiates by
// tag name — without this import the visual editor renders as an unknown element.
import './editor/family-hub-card-editor.js';

const ENTITY_RE = /^[a-z_]+\.[a-z0-9_]+$/;
const IMPLEMENTED_VIEWS = ['agenda', 'week', 'columns'];
const DAY_MS = 24 * 3600 * 1000;

/** Home Assistant weather conditions → Material Design icons. */
export const WEATHER_ICONS = {
  'clear-night': 'mdi:weather-night',
  cloudy: 'mdi:weather-cloudy',
  exceptional: 'mdi:alert-circle-outline',
  fog: 'mdi:weather-fog',
  hail: 'mdi:weather-hail',
  lightning: 'mdi:weather-lightning',
  'lightning-rainy': 'mdi:weather-lightning-rainy',
  partlycloudy: 'mdi:weather-partly-cloudy',
  pouring: 'mdi:weather-pouring',
  rainy: 'mdi:weather-rainy',
  snowy: 'mdi:weather-snowy',
  'snowy-rainy': 'mdi:weather-snowy-rainy',
  sunny: 'mdi:weather-sunny',
  windy: 'mdi:weather-windy',
  'windy-variant': 'mdi:weather-windy-variant',
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
  if (ENTITY_RE.test(subtitle) && hass?.states?.[subtitle]) {
    return hass.states[subtitle].state;
  }
  // A typo'd entity id renders as visible text rather than blanking silently.
  return subtitle;
}

class FamilyHubCard extends LitElement {
  static properties = {
    _tick: { state: true },
    _offset: { state: true },
    _tab: { state: true },
  };

  constructor() {
    super();
    this._tab = 'calendar';
    this._offset = 0;
  }

  static styles = [
    tokens,
    sharedStyles,
    css`
      /* Metrics ported from mockups/c.html — .wt and .wt-top. The card paints
         its own surface rather than inheriting ha-card's, so the designed look
         survives whatever theme the dashboard is using. */
      .tabs { display: inline-flex; gap: 4px; margin-top: 4px; }
      /* Same 44px rule as every other target on the card. */
      .tab { min-height: var(--fh-touch); background: none; border: none; color: var(--fh-text-mute); font: inherit; font-size: 15px; padding: 0 16px; border-radius: 999px; cursor: pointer; }
      .tab.on { background: var(--fh-chip); color: var(--fh-text); }
      ha-card {
        background: var(--fh-bg);
        border-radius: var(--fh-radius);
        border: none;
        padding: 24px 26px;
        color: var(--fh-text);
        font-family: var(--fh-font);
      }
      .head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--fh-rule);
      }
      /* Let the left column wrap its date within its own width instead of
         pushing the clock off the right edge. Without min-width:0 a flex item
         refuses to shrink below its content, so a long date overflows the card
         on a phone. */
      .headmain { min-width: 0; }
      .date { font-size: 32px; font-weight: 600; letter-spacing: -0.6px; color: var(--fh-text); }
      .sub { font-size: 15px; color: var(--fh-text-dim); margin-top: 3px; }
      .meta { display: flex; align-items: center; gap: 18px; font-size: 19px; color: var(--fh-text-mute); flex-shrink: 0; }
      .wx { display: inline-flex; align-items: center; gap: 6px; }
      .wx ha-icon { --mdc-icon-size: 22px; color: var(--fh-text-mute); }
      .clock { font-size: 44px; font-weight: 300; letter-spacing: -1.5px; color: var(--fh-text-strong); font-variant-numeric: tabular-nums; line-height: 1; }
      /* Narrow (phone) reuses the card's <900px collapse: the wall-sized date
         and clock don't fit a phone header, so scale them and tighten gaps. */
      .head[data-narrow='true'] { gap: 8px 12px; margin-bottom: 16px; flex-wrap: wrap; }
      .head[data-narrow='true'] .date { font-size: 23px; white-space: nowrap; }
      .head[data-narrow='true'] .meta { margin-left: auto; }
      .head[data-narrow='true'] .clock { font-size: 30px; }
      .head[data-narrow='true'] .meta { gap: 12px; }
      .nav { display: flex; align-items: center; gap: 6px; }
      .navbtn { min-width: var(--fh-touch); min-height: var(--fh-touch); border-radius: 10px; border: none; background: none; color: var(--fh-text-mute); font-size: 22px; line-height: 1; cursor: pointer; }
      .navbtn:hover { background: var(--fh-surface); color: var(--fh-text); }
      .today { min-height: var(--fh-touch); padding: 0 14px; border-radius: 10px; border: none; background: var(--fh-surface); color: var(--fh-text); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 4px; }
      .addbtn { min-width: var(--fh-touch); min-height: var(--fh-touch); border-radius: 50%; border: none; background: var(--fh-surface); color: var(--fh-text); font-size: 26px; line-height: 1; cursor: pointer; flex-shrink: 0; }
      .addbtn:hover { background: var(--fh-chip); }
      .loading { padding: 24px 26px; color: var(--fh-text-dim); font-size: 16px; }
      /* A console warning is invisible on a wall tablet, so say it on the card. */
      .fallback {
        font-size: 13px;
        color: var(--warning-color, #FFB84A);
        margin-top: 6px;
      }
      .fallback code {
        font-family: var(--fh-mono);
        background: var(--fh-chip);
        border-radius: 5px;
        padding: 1px 6px;
      }
    `,
  ];

  setConfig(config) {
    this._config = normaliseConfig(config);
    this._applyScheme();
    if (!IMPLEMENTED_VIEWS.includes(this._config.view)) {
      console.warn(
        `family-hub-card: view "${this._config.view}" is not implemented yet — rendering agenda.`,
      );
    }
    this._hub?.stop();
    this._hub = null;
  }

  set hass(hass) {
    const prev = this._hass;
    this._hass = hass;
    this._applyScheme();
    if (this._hub) {
      // A ticked chore, an added event or a new TaskMate completion all arrive
      // as entity updates. Without this the card would sit stale until the
      // next poll — up to refresh_interval on a wall display.
      this._hub.hassChanged(prev);
    }
    if (!this._hub && this._config) {
      this._hub = new HubData({
        config: this._config,
        getHass: () => this._hass,
        getNow: () => new Date(),
        onChange: () => this.requestUpdate(),
        schedule: (fn, ms) => {
          const id = setInterval(fn, ms);
          return () => clearInterval(id);
        },
      });
      this._syncWindow();
      this._hub.start();
      this._hub.refresh();
    }
    this.requestUpdate();
  }

  get hass() {
    return this._hass;
  }

  get _tz() {
    return this._hass?.config?.time_zone || 'UTC';
  }

  /** Drives the [data-scheme] selector the light palette hangs off. */
  _applyScheme() {
    const scheme = resolveScheme(this._hass, this._config?.theme);
    if (this.dataset.scheme !== scheme) {
      this.dataset.scheme = scheme;
      this.requestUpdate();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._applyScheme();
    // The week grid needs seven columns of room. Below that it collapses to
    // agenda rather than scrolling sideways, so one dashboard serves both the
    // wall tablet and a phone.
    this._ro = new ResizeObserver(([entry]) => {
      const narrow = entry.contentRect.width < 900;
      if (narrow !== this._narrow) {
        this._narrow = narrow;
        // Refetch at the new width's window before rendering the other view.
        this._syncWindow();
        this.requestUpdate();
      }
    });
    this._ro.observe(this);
    this._scheduleTick();
    this._onOnline = () => this._hub?.refresh();
    window.addEventListener('online', this._onOnline);
    // disconnectedCallback stops the hub's timers. A card inside a conditional
    // card, a popup or a dragged section is re-attached without setConfig, so
    // the timers have to come back here or the card only moves on entity
    // changes from then on.
    if (this._hub) {
      this._hub.start();
      this._hub.refresh();
    }
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
      // The week's start moves at midnight; the setter is a no-op otherwise.
      this._syncWindow();
      this._scheduleTick();
    }, msUntilNextMinute(new Date()));
  }

  getCardSize() {
    return 12;
  }

  /** Sections dashboards: take the full width, size rows to content. */
  getGridOptions() {
    return { columns: 'full', rows: 'auto', min_columns: 6, min_rows: 4 };
  }

  /** The pre-2024.11 name for the same hint. */
  getLayoutOptions() {
    return { grid_columns: 'full', grid_rows: 'auto', grid_min_columns: 6 };
  }

  static getConfigElement() {
    return document.createElement('family-hub-card-editor');
  }

  static getStubConfig() {
    return { view: 'agenda', people: [{ name: 'Ana', todo: 'todo.ana' }] };
  }

  /** The view actually rendered, after the narrow-screen collapse. */
  get _effectiveView() {
    if (this._config.view === 'week' && this._narrow) return 'agenda';
    return this._config.view;
  }

  /** Days from today back to the start of the displayed week; zero elsewhere. */
  get _weekBase() {
    if (this._effectiveView !== 'week') return 0;
    return weekStartOffset(new Date(), this._tz, this._config.weekStart);
  }

  /** Total days from today to the first day the hub should fetch. */
  get _startOffset() {
    return (this._offset || 0) + this._weekBase;
  }

  /** Keeps the hub's fetch window in step with the view, width and paging. */
  _syncWindow() {
    if (!this._hub || !this._config) return;
    this._hub.windowDays = this._effectiveView === 'week' ? 7 : 1;
    this._hub.startOffset = this._startOffset;
  }

  _headerDate(now) {
    const locale = this._hass.locale;
    if (this._effectiveView === 'week') {
      const first = new Date(now.getTime() + this._startOffset * DAY_MS);
      return t(pickLanguage(this._hass), 'week_of', {
        date: formatDate(first, locale, this._tz, { day: 'numeric', month: 'long' }),
      });
    }
    // A phone header has room for "Sun 18 Oct" beside the clock, not for
    // "Sunday, October 18" wrapped over three lines under it.
    return formatDate(this._viewDate(now), locale, this._tz, this._narrow
      ? { weekday: 'short', day: 'numeric', month: 'short' }
      : { weekday: 'long', day: 'numeric', month: 'long' });
  }

  /** Days per paging step: a week for the grid, a day for the timeline. */
  get _pageStep() {
    return this._effectiveView === 'week' ? 7 : 1;
  }

  /** The date the header names and the add dialog prefills. */
  _viewDate(now) {
    return new Date(now.getTime() + (this._offset || 0) * DAY_MS);
  }

  /** What the add dialog prefills: the paged day, or the paged week's first day. */
  _dialogDate(now) {
    if (this._effectiveView === 'week' && this._offset) {
      return new Date(now.getTime() + this._startOffset * DAY_MS);
    }
    return this._viewDate(now);
  }

  _page(direction) {
    this._setOffset((this._offset || 0) + direction * this._pageStep);
  }

  _goToday() {
    this._setOffset(0);
    this._tab = 'calendar';
  }

  _setOffset(offset) {
    this._offset = offset;
    this._syncWindow();
    this._armReturn();
    this.requestUpdate();
  }

  /**
   * Without this the wall tablet stays parked on whatever week someone last
   * looked at — a display confidently showing the wrong dates to everyone who
   * walks past, which is worse than showing nothing.
   */
  _armReturn() {
    clearTimeout(this._returnTimer);
    const secs = this._config?.returnToToday;
    if (!secs || !this._offset) return;
    this._returnTimer = setTimeout(() => this._goToday(), secs * 1000);
  }

  _onChoreTap(e) {
    const { personId, choreId } = e.detail;
    this._hub?.complete(personId, choreId);
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
    const model = this._hub.model;
    const lang = pickLanguage(this._hass);
    const locale = this._hass.locale;
    const tz = this._tz;
    const subtitle = resolveSubtitle(this._hass, this._config.header.subtitle);
    const isToday = !this._offset;

    return html`
      <ha-card>
        <div class="head" data-narrow=${String(this._narrow)}>
          <div class="headmain">
            <div class="nav">
              <button class="navbtn" aria-label=${t(lang, 'previous')} @click=${() => this._page(-1)}>‹</button>
              <div class="date">${this._headerDate(now)}</div>
              <button class="navbtn" aria-label=${t(lang, 'next_page')} @click=${() => this._page(1)}>›</button>
            </div>
            ${this._config.tabs
              ? html`<div class="tabs" role="tablist">
                  ${['calendar', 'tasks'].map(
                    (tab) => html`<button
                      class="tab ${this._tab === tab ? 'on' : ''}"
                      role="tab"
                      aria-selected=${this._tab === tab ? 'true' : 'false'}
                      @click=${() => { this._tab = tab; }}
                    >${t(lang, tab)}</button>`,
                  )}
                </div>`
              : nothing}
            ${this._offset
              ? html`<button class="today" @click=${() => this._goToday()}>${t(lang, 'today')}</button>`
              : nothing}
            ${subtitle ? html`<div class="sub">${subtitle}</div>` : nothing}
            ${!IMPLEMENTED_VIEWS.includes(this._config.view)
              ? html`<div class="fallback">${t(lang, 'view_not_built', { view: this._config.view })}</div>`
              : nothing}
            ${model.staleSince
              ? html`<div class="stale">
                  ${t(lang, 'last_updated', { time: formatTime(model.staleSince, locale, tz) })}
                </div>`
              : nothing}
          </div>
          <div class="meta">
            ${this._weather()}
            ${availableTypes(this._hass, this._config).length
              ? html`<button class="addbtn" aria-label=${t(lang, 'add')} title=${t(lang, 'add')}
                  @click=${() => this.renderRoot.querySelector('family-hub-add-dialog')?.show()}
                >+</button>`
              : nothing}
            ${this._config.header.clock
              ? html`<span class="clock">${formatTime(now, locale, tz)}</span>`
              : nothing}
          </div>
        </div>
        <family-hub-add-dialog
          .hass=${this._hass}
          .config=${this._config}
          .lang=${lang}
          .date=${this._dialogDate(now)}
          @created=${() => this._hub?.refresh()}
        ></family-hub-add-dialog>
        ${this._config.tabs && this._tab === 'tasks'
          ? html`<family-hub-tasks
              .model=${model}
              .lang=${lang}
              .now=${now}
              .isToday=${isToday}
              .tz=${tz}
              .readOnly=${!isToday}
              .confirmWindow=${this._config.confirmWindow}
              @chore-tap=${(e) => this._onChoreTap(e)}
            ></family-hub-tasks>`
          : this._effectiveView === 'columns'
          ? html`<family-hub-columns
              .model=${model}
              .lang=${lang}
              .locale=${locale}
              .tz=${tz}
              .readOnly=${!isToday}
              .confirmWindow=${this._config.confirmWindow}
              .inlineChores=${this._config.inlineChores}
              .hideChores=${this._config.tabs}
              @chore-tap=${(e) => this._onChoreTap(e)}
            ></family-hub-columns>`
          : this._effectiveView === 'week'
          ? html`<family-hub-week
              .model=${model}
              .lang=${lang}
              .locale=${locale}
              .now=${now}
              .offsetDays=${this._offset || 0}
              .startOffset=${this._startOffset}
              .tz=${tz}
            ></family-hub-week>`
          : html`<family-hub-agenda
              .model=${model}
              .lang=${lang}
              .locale=${locale}
              .tz=${tz}
              .now=${now}
              .isToday=${isToday}
              .readOnly=${!isToday}
              .confirmWindow=${this._config.confirmWindow}
              .inlineChores=${this._config.inlineChores}
              .hideChores=${this._config.tabs}
              @chore-tap=${(e) => this._onChoreTap(e)}
            ></family-hub-agenda>`}
      </ha-card>
    `;
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
    description: "Today's schedule per person plus their chores, tappable to complete.",
    preview: true,
    documentationURL: 'https://github.com/tempus2016/family-hub-card',
  });
}
