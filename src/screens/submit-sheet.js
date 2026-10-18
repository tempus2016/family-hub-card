import { LitElement, html, css, nothing } from 'lit';
import { shared } from '../styles/theme.js';
import { t } from '../i18n.js';

/**
 * The sheet a child fills in for a chore that needs more than a tick: a
 * count, a note, a photo, or a photo with one of the others. Done fires
 * `submit-chore` with what was collected; the card calls TaskMate and then
 * tells the sheet `done()` or `fail(message)`. It stays open on failure so
 * nothing typed or photographed is lost.
 *
 * `show({ personName, personStyle, task, upload })` — `upload(blob)` returns
 * the photo URL; the card supplies it so the sheet never touches hass.
 */
export class FamilyHubSubmitSheet extends LitElement {
  static properties = {
    lang: { attribute: false },
    _open: { state: true },
    _qty: { state: true },
    _note: { state: true },
    _photoUrl: { state: true },
    _preview: { state: true },
    _busy: { state: true },
    _error: { state: true },
  };

  static styles = [
    shared,
    css`
      .scrim { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: grid; place-items: center; z-index: 10; padding: 16px; }
      .sheet { background: var(--fh-page); color: var(--fh-text); border-radius: var(--fh-radius); padding: 22px 22px 18px; width: min(460px, 100%); box-shadow: 0 20px 60px rgba(0,0,0,.3); }
      .who { display: flex; align-items: center; gap: 10px; color: var(--fh-text-2); font-size: 14px; }
      h2 { font-family: var(--fh-serif); font-weight: 500; font-size: 24px; margin: 6px 0 14px; }
      .ask { font-weight: 600; margin: 14px 0 8px; }
      .stepper { display: flex; align-items: center; justify-content: center; gap: 22px; }
      .stepper button { width: 64px; height: 64px; border-radius: 50%; background: var(--tint, var(--fh-surface)); font-size: 30px; font-weight: 600; color: var(--fh-text); }
      .qty { font-family: var(--fh-serif); font-size: 48px; min-width: 90px; text-align: center; }
      .unit { text-align: center; color: var(--fh-text-2); margin-top: 4px; }
      textarea { width: 100%; min-height: 96px; border-radius: 12px; border: 1px solid var(--fh-line); background: var(--fh-surface); color: var(--fh-text); font: inherit; font-size: 16px; padding: 10px 12px; resize: vertical; }
      .photo { display: grid; gap: 10px; justify-items: center; }
      .photo label { display: inline-flex; align-items: center; gap: 8px; min-height: var(--fh-touch); padding: 0 18px; border-radius: 999px; background: var(--tint, var(--fh-surface)); font-weight: 600; cursor: pointer; }
      .photo input { position: absolute; width: 1px; height: 1px; opacity: 0; }
      img.preview { max-width: 100%; max-height: 220px; border-radius: 12px; object-fit: cover; }
      .err { color: var(--error-color, #d64545); font-size: 14px; margin-top: 12px; }
      .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
      .btn { min-height: var(--fh-touch); padding: 0 20px; border-radius: 999px; font-weight: 600; font-size: 15px; }
      .btn.cancel { color: var(--fh-text-2); }
      .btn.go { background: var(--pc, var(--fh-fab)); color: #fff; }
      .btn[disabled] { opacity: .45; cursor: default; }
    `,
  ];

  constructor() {
    super();
    this.lang = 'en';
    this._open = false;
  }

  show({ personName, personStyle = '', task, upload }) {
    this._ctx = { personName, personStyle, task, upload };
    this._qty = 1;
    this._note = '';
    this._photoUrl = '';
    this._preview = '';
    this._busy = '';
    this._error = '';
    this._open = true;
  }

  done() {
    this._open = false;
    if (this._preview) URL.revokeObjectURL?.(this._preview);
  }

  fail(message) {
    this._busy = '';
    this._error = message;
  }

  get _asks() {
    const task = this._ctx?.task;
    return task?.asks?.length ? task.asks : [task?.needs].filter(Boolean);
  }

  _step(d) {
    const max = this._ctx.task.max || 9999;
    this._qty = Math.min(max, Math.max(1, this._qty + d));
  }

  /** Called with the picked file; exposed for tests, which cannot drive a camera. */
  async _picked(blob) {
    if (!blob) return;
    this._error = '';
    this._busy = 'upload';
    try {
      this._photoUrl = await this._ctx.upload(blob);
      try { this._preview = URL.createObjectURL(blob); } catch { this._preview = this._photoUrl; }
    } catch (err) {
      this._photoUrl = '';
      this._error = err?.message || String(err);
    }
    this._busy = '';
  }

  _ready() {
    const a = this._asks;
    if (this._busy) return false;
    if (a.includes('photo') && !this._photoUrl) return false;
    if (a.includes('note') && !this._note.trim()) return false;
    return true;
  }

  _submit() {
    if (!this._ready()) return;
    const { task } = this._ctx;
    this._busy = 'send';
    this._error = '';
    this.dispatchEvent(new CustomEvent('submit-chore', {
      detail: {
        choreId: task.id, needs: task.needs, asks: this._asks,
        quantity: this._qty, note: this._note, photoUrl: this._photoUrl,
      },
      bubbles: true, composed: true,
    }));
  }

  render() {
    if (!this._open) return nothing;
    const { personName, personStyle, task } = this._ctx;
    const a = this._asks;
    const lang = this.lang;
    return html`<div class="scrim" @click=${(e) => { if (e.target === e.currentTarget && !this._busy && !this._note && !this._photoUrl) this.done(); }}>
      <div class="sheet" role="dialog" aria-modal="true" style=${personStyle}>
        <div class="who">${personName}</div>
        <h2>${task.summary}</h2>

        ${a.includes('photo') ? html`<div class="ask">${t(lang, 'sheet_photo')}</div>
          <div class="photo">
            ${this._preview ? html`<img class="preview" src=${this._preview} alt="" />` : nothing}
            <label>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this._busy === 'upload' ? t(lang, 'uploading') : (this._photoUrl ? t(lang, 'retake_photo') : t(lang, 'take_photo'))}
              <input type="file" accept="image/*" capture="environment" ?disabled=${Boolean(this._busy)}
                @change=${(e) => this._picked(e.target.files?.[0])} />
            </label>
          </div>` : nothing}

        ${a.includes('note') ? html`<div class="ask">${t(lang, 'sheet_note')}</div>
          <textarea placeholder=${t(lang, 'note_placeholder')} .value=${this._note}
            @input=${(e) => { this._note = e.target.value; }}></textarea>` : nothing}

        ${a.includes('quantity') ? html`<div class="ask">${t(lang, 'sheet_quantity', { unit: task.unit || '' })}</div>
          <div class="stepper">
            <button class="dec" aria-label="−" @click=${() => this._step(-1)}>−</button>
            <span class="qty">${this._qty}</span>
            <button class="inc" aria-label="+" @click=${() => this._step(1)}>+</button>
          </div>
          <div class="unit">${task.unit || ''}</div>` : nothing}

        ${this._error ? html`<div class="err">${this._error}</div>` : nothing}
        <div class="actions">
          <button class="btn cancel" ?disabled=${this._busy === 'send'} @click=${() => this.done()}>${t(lang, 'cancel')}</button>
          <button class="btn go" ?disabled=${!this._ready()} @click=${() => this._submit()}>
            ${this._busy === 'send' ? t(lang, 'sending') : t(lang, 'done_btn')}
          </button>
        </div>
      </div>
    </div>`;
  }
}

customElements.define('family-hub-submit-sheet', FamilyHubSubmitSheet);
