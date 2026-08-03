import { LitElement, html, css, nothing } from 'lit';
import { tokens, sharedStyles } from './styles/shared.js';
import { normaliseConfig } from './data/config.js';
import { HubData } from './data/hub-data.js';
import { msUntilNextMinute } from './data/time.js';
import './views/agenda-view.js';
import './views/week-view.js';
import './add/add-dialog.js';
import { availableTypes } from './add/add-controller.js';
// Registers <family-hub-card-editor>, which getConfigElement() instantiates by
// tag name — without this import the visual editor renders as an unknown element.
import './editor/family-hub-card-editor.js';

const ENTITY_RE = /^[a-z_]+\.[a-z0-9_]+$/;
const IMPLEMENTED_VIEWS = ['agenda', 'week'];

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
  static properties = { _tick: { state: true }, _offset: { state: true } };

  static styles = [
    tokens,
    sharedStyles,
    css`
      /* Metrics ported from mockups/c.html — .wt and .wt-top. The card paints
         its own surface rather than inheriting ha-card's, so the designed look
         survives whatever theme the dashboard is using. */
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
      .date { font-size: 32px; font-weight: 600; letter-spacing: -0.6px; color: var(--fh-text); }
      .sub { font-size: 15px; color: var(--fh-text-dim); margin-top: 3px; }
      .meta { display: flex; align-items: center; gap: 18px; font-size: 19px; color: var(--fh-text-mute); flex-shrink: 0; }
      .clock { font-size: 44px; font-weight: 300; letter-spacing: -1.5px; color: var(--fh-text-strong); font-variant-numeric: tabular-nums; line-height: 1; }
      .nav { display: flex; align-items: center; gap: 6px; }
      .navbtn { min-width: var(--fh-touch); min-height: var(--fh-touch); border-radius: 10px; border: none; background: none; color: var(--fh-text-mute); font-size: 22px; line-height: 1; cursor: pointer; }
      .navbtn:hover { background: var(--fh-surface); color: var(--fh-text); }
      .today { min-height: 32px; padding: 0 12px; border-radius: 8px; border: none; background: var(--fh-surface); color: var(--fh-text); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 6px; }
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
      this._hub.start();
      this._hub.refresh();
    }
    this.requestUpdate();
  }

  get hass() {
    return this._hass;
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
        if (this._hub) this._hub.windowDays = this._effectiveView === 'week' ? 7 : 1;
        this.requestUpdate();
      }
    });
    this._ro.observe(this);
    this._scheduleTick();
    this._onOnline = () => this._hub?.refresh();
    window.addEventListener('online', this._onOnline);
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
      this._scheduleTick();
    }, msUntilNextMinute(new Date()));
  }

  getCardSize() {
    return 12;
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

  _headerDate(now) {
    if (this._effectiveView === 'week') {
      const fmt = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long' });
      return `Week of ${fmt.format(now)}`;
    }
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'long', day: 'numeric', month: 'long',
    }).format(now);
  }

  /** Days per paging step: a week for the grid, a day for the timeline. */
  get _pageStep() {
    return this._effectiveView === 'week' ? 7 : 1;
  }

  /** The date the header names and the add dialog prefills. */
  _viewDate(now) {
    return new Date(now.getTime() + (this._offset || 0) * 24 * 3600 * 1000);
  }

  _page(direction) {
    this._setOffset((this._offset || 0) + direction * this._pageStep);
  }

  _goToday() {
    this._setOffset(0);
  }

  _setOffset(offset) {
    this._offset = offset;
    if (this._hub) this._hub.startOffset = offset;
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

  render() {
    if (!this._config) return nothing;
    if (!this._hass || !this._hub) {
      return html`<ha-card><div class="loading">Loading…</div></ha-card>`;
    }

    const now = new Date();
    const model = this._hub.model;
    const weather = this._config.header.weather
      ? this._hass.states[this._config.header.weather]
      : null;
    const subtitle = resolveSubtitle(this._hass, this._config.header.subtitle);

    return html`
      <ha-card>
        <div class="head">
          <div>
            <div class="nav">
              <button class="navbtn" aria-label="Previous" @click=${() => this._page(-1)}>‹</button>
              <div class="date">${this._headerDate(this._viewDate(now))}</div>
              <button class="navbtn" aria-label="Next" @click=${() => this._page(1)}>›</button>
            </div>
            ${this._offset
              ? html`<button class="today" @click=${() => this._goToday()}>Today</button>`
              : nothing}
            ${subtitle ? html`<div class="sub">${subtitle}</div>` : nothing}
            ${!IMPLEMENTED_VIEWS.includes(this._config.view)
              ? html`<div class="fallback">
                  <code>${this._config.view}</code> view isn't built yet — showing agenda
                </div>`
              : nothing}
            ${model.staleSince
              ? html`<div class="stale">
                  Last updated
                  ${new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(model.staleSince)}
                </div>`
              : nothing}
          </div>
          <div class="meta">
            ${weather
              ? html`<span>${Math.round(weather.attributes.temperature)}°</span>`
              : nothing}
            ${availableTypes(this._hass, this._config).length
              ? html`<button class="addbtn" aria-label="Add" title="Add"
                  @click=${() => this.renderRoot.querySelector('family-hub-add-dialog')?.show()}
                >+</button>`
              : nothing}
            ${this._config.header.clock
              ? html`<span class="clock">
                  ${new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(now)}
                </span>`
              : nothing}
          </div>
        </div>
        <family-hub-add-dialog
          .hass=${this._hass}
          .config=${this._config}
          .date=${this._viewDate(now)}
          @created=${() => this._hub?.refresh()}
        ></family-hub-add-dialog>
        ${this._effectiveView === 'week'
          ? html`<family-hub-week
              .model=${model}
              .now=${this._viewDate(now)}
              .offsetDays=${this._offset || 0}
              .tz=${this._hass.config?.time_zone || 'UTC'}
            ></family-hub-week>`
          : html`<family-hub-agenda
              .model=${model}
              .now=${this._viewDate(now)}
              .readOnly=${Boolean(this._offset)}
              .confirmWindow=${this._config.confirmWindow}
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
