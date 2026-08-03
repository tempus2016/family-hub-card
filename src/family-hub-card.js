import { LitElement, html, css, nothing } from 'lit';
import { tokens, sharedStyles } from './styles/shared.js';
import { normaliseConfig } from './data/config.js';
import { HubData } from './data/hub-data.js';
import { msUntilNextMinute } from './data/time.js';
import './views/agenda-view.js';
// Registers <family-hub-card-editor>, which getConfigElement() instantiates by
// tag name — without this import the visual editor renders as an unknown element.
import './editor/family-hub-card-editor.js';

const ENTITY_RE = /^[a-z_]+\.[a-z0-9_]+$/;

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
  static properties = { _tick: { state: true } };

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
      .loading { padding: 24px 26px; color: var(--fh-text-dim); font-size: 16px; }
    `,
  ];

  setConfig(config) {
    this._config = normaliseConfig(config);
    this._applyScheme();
    if (this._config.view !== 'agenda') {
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
    this._scheduleTick();
    this._onOnline = () => this._hub?.refresh();
    window.addEventListener('online', this._onOnline);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._tickTimer);
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
            <div class="date">
              ${new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).format(now)}
            </div>
            ${subtitle ? html`<div class="sub">${subtitle}</div>` : nothing}
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
            ${this._config.header.clock
              ? html`<span class="clock">
                  ${new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(now)}
                </span>`
              : nothing}
          </div>
        </div>
        <family-hub-agenda
          .model=${model}
          .now=${now}
          .confirmWindow=${this._config.confirmWindow}
          @chore-tap=${(e) => this._onChoreTap(e)}
        ></family-hub-agenda>
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
