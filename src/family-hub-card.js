import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles } from './styles/shared.js';
import { normaliseConfig } from './data/config.js';
import { HubData } from './data/hub-data.js';
import { msUntilNextMinute } from './data/time.js';
import './views/agenda-view.js';
// Registers <family-hub-card-editor>, which getConfigElement() instantiates by
// tag name — without this import the visual editor renders as an unknown element.
import './editor/family-hub-card-editor.js';

const ENTITY_RE = /^[a-z_]+\.[a-z0-9_]+$/;

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
    sharedStyles,
    css`
      ha-card { padding: 20px 24px; }
      .head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
      .date { font-size: 2rem; font-weight: 700; color: var(--fh-text); }
      .clock { font-size: 3rem; font-weight: 300; font-variant-numeric: tabular-nums; color: var(--fh-text); line-height: 1; }
      .meta { display: flex; align-items: center; gap: 16px; }
    `,
  ];

  setConfig(config) {
    this._config = normaliseConfig(config);
    if (this._config.view !== 'agenda') {
      console.warn(
        `family-hub-card: view "${this._config.view}" is not implemented yet — rendering agenda.`,
      );
    }
    this._hub?.stop();
    this._hub = null;
  }

  set hass(hass) {
    this._hass = hass;
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

  connectedCallback() {
    super.connectedCallback();
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
      return html`<ha-card><div class="t2">Loading…</div></ha-card>`;
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
            ${subtitle ? html`<div class="t2">${subtitle}</div>` : nothing}
            ${model.staleSince
              ? html`<div class="stale">
                  Last updated
                  ${new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(model.staleSince)}
                </div>`
              : nothing}
          </div>
          <div class="meta">
            ${weather
              ? html`<span class="t2">${weather.attributes.temperature}°</span>`
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
