import { LitElement, html, css, nothing } from 'lit';

/**
 * A YAML-first editor: the people list is nested and repeating, which the
 * stock ha-form selectors handle poorly. The value here is entity discovery —
 * suggesting the TaskMate chores sensor rather than making the user find it.
 */
class FamilyHubCardEditor extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };

  static styles = css`
    .hint { font-size: 0.8125rem; color: var(--secondary-text-color); margin: 8px 0; }
    .row { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    button { padding: 6px 10px; border-radius: 8px; border: 1px solid var(--divider-color); background: none; color: inherit; cursor: pointer; }
  `;

  setConfig(config) {
    this._config = config;
  }

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

  _apply(patch) {
    this._config = { ...this._config, ...patch };
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }),
    );
  }

  render() {
    if (!this._config) return nothing;
    const detected = this._detectedChoresSensor();
    const showSuggestion = detected && this._config.taskmate_chores !== detected;

    return html`
      <div class="hint">
        Family Hub is configured in YAML — the people list is nested and repeating.
        See the README for the full schema.
      </div>
      ${showSuggestion
        ? html`
            <div class="row">
              <span>TaskMate detected: <code>${detected}</code></span>
              <button @click=${() => this._apply({ taskmate_chores: detected })}>Use it</button>
            </div>
          `
        : nothing}
    `;
  }
}

customElements.define('family-hub-card-editor', FamilyHubCardEditor);
