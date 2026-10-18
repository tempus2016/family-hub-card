import { LitElement, html, css } from 'lit';
import { shared } from '../styles/theme.js';
import { t } from '../i18n.js';

/**
 * Per-device settings. Each change is announced as `settings-change` with a
 * `{ key, value }` detail; the card stores it and re-renders. `null` clears
 * an override so the dashboard YAML applies again.
 */
export class FamilyHubSettingsScreen extends LitElement {
  static properties = {
    settings: { attribute: false },
    config: { attribute: false },
    lang: { attribute: false },
  };

  static styles = [
    shared,
    css`
      .wrap { max-width: 560px; display: grid; gap: 16px; }
      .set { background: var(--fh-surface); border-radius: var(--fh-radius); padding: 16px 18px; }
      .set h3 { font-family: var(--fh-serif); font-weight: 500; margin: 0 0 10px; font-size: 19px; }
      .seg { display: inline-flex; background: var(--fh-line); border-radius: 999px; padding: 3px; flex-wrap: wrap; }
      .seg button { min-height: 40px; padding: 0 16px; border-radius: 999px; font-weight: 500; font-size: 14px; color: var(--fh-text-2); }
      .seg button.on { background: var(--fh-pill); color: var(--fh-text); box-shadow: var(--fh-shadow); }
      .hint { font-size: 13px; color: var(--fh-text-2); margin-top: 8px; }
      .reset { margin-top: 4px; color: var(--fh-text-2); text-decoration: underline; font-size: 13px; min-height: var(--fh-touch); }
    `,
  ];

  constructor() {
    super();
    this.lang = 'en';
    this.settings = {};
    this.config = {};
  }

  _set(key, value) {
    this.dispatchEvent(new CustomEvent('settings-change', { detail: { key, value }, bubbles: true, composed: true }));
  }

  _seg(key, options, current) {
    return html`<div class="seg">
      ${options.map(([value, label]) => html`<button class=${current === value ? 'on' : ''} data-key=${key} data-value=${String(value)}
          @click=${() => this._set(key, value)}>${label}</button>`)}
    </div>`;
  }

  render() {
    const s = this.settings || {};
    const lang = this.lang;
    const screens = (this.config.screens || []).filter((x) => x !== 'settings').map((x) => [x, t(lang, x)]);
    return html`<div class="wrap">
      <div class="set">
        <h3>${t(lang, 'theme')}</h3>
        ${this._seg('theme', [['auto', t(lang, 'auto')], ['light', t(lang, 'light')], ['dark', t(lang, 'dark')]], s.theme || 'auto')}
      </div>
      <div class="set">
        <h3>${t(lang, 'home_screen')}</h3>
        ${this._seg('home', screens, s.home)}
      </div>
      <div class="set">
        <h3>${t(lang, 'calendar_view')}</h3>
        ${this._seg('calendarView', [['schedule', t(lang, 'schedule')], ['week', t(lang, 'week')], ['month', t(lang, 'month')], ['day', t(lang, 'day')]], s.calendarView)}
      </div>
      <div class="set">
        <h3>${t(lang, 'hide_completed')}</h3>
        ${this._seg('hideCompleted', [[false, t(lang, 'show')], [true, t(lang, 'hide')]], Boolean(s.hideCompleted))}
        <div class="hint">${t(lang, 'device_note')}</div>
        <button class="reset" @click=${() => { for (const k of ['theme', 'home', 'calendarView', 'hideCompleted']) this._set(k, null); }}>${t(lang, 'reset_defaults')}</button>
      </div>
    </div>`;
  }
}

customElements.define('family-hub-settings-screen', FamilyHubSettingsScreen);
