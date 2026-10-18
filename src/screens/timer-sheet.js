import { LitElement, html, css, nothing } from 'lit';
import { shared } from '../styles/theme.js';
import { elapsedSeconds, timedPoints, formatClock } from '../data/timed.js';
import { t } from '../i18n.js';

/**
 * The stopwatch for a TaskMate timed chore. The timer itself runs on the
 * server; this sheet shows it and fires `timer-action` with start, pause or
 * finish. The card passes the task back in on every update, so the sheet
 * always reflects TaskMate's session — including one started on a phone.
 * Closing the sheet leaves a running timer running.
 */
export class FamilyHubTimerSheet extends LitElement {
  static properties = {
    lang: { attribute: false },
    task: { attribute: false },
    _open: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _tick: { state: true },
  };

  static styles = [
    shared,
    css`
      .scrim { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: grid; place-items: center; z-index: 10; padding: 16px; }
      .sheet { background: var(--fh-page); color: var(--fh-text); border-radius: var(--fh-radius); padding: 22px 22px 18px; width: min(440px, 100%); box-shadow: 0 20px 60px rgba(0,0,0,.3); text-align: center; }
      .who { color: var(--fh-text-2); font-size: 14px; }
      h2 { font-family: var(--fh-serif); font-weight: 500; font-size: 24px; margin: 6px 0 4px; }
      .rate { color: var(--fh-text-2); font-size: 13.5px; }
      .ring { width: 210px; height: 210px; margin: 18px auto 10px; border-radius: 50%; display: grid; place-items: center; background: conic-gradient(var(--pc) var(--pct), var(--tint) 0); }
      .ring .inner { width: 180px; height: 180px; border-radius: 50%; background: var(--fh-page); display: grid; place-items: center; align-content: center; gap: 2px; }
      .clock { font-family: var(--fh-serif); font-size: 46px; font-variant-numeric: tabular-nums; }
      .state { font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--fh-text-3); font-weight: 600; }
      .earn { font-weight: 600; color: var(--pc); margin-bottom: 6px; }
      .controls { display: flex; justify-content: center; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
      .btn { min-height: 52px; padding: 0 26px; border-radius: 999px; font-weight: 600; font-size: 16px; display: inline-flex; align-items: center; gap: 8px; }
      .btn ha-icon { --mdc-icon-size: 20px; }
      .btn.start { background: var(--pc); color: #fff; }
      .btn.pause { background: var(--tint); color: var(--fh-text); }
      .btn.finish { background: var(--fh-text); color: var(--fh-page); }
      .btn[disabled] { opacity: .45; }
      .close { margin-top: 14px; color: var(--fh-text-2); min-height: var(--fh-touch); }
      .err { color: var(--error-color, #d64545); font-size: 14px; margin-top: 12px; }
    `,
  ];

  constructor() {
    super();
    this.lang = 'en';
    this._open = false;
    this.now = () => new Date();
  }

  show({ personName, personStyle = '', task }) {
    this._ctx = { personName, personStyle };
    this.task = task;
    this._busy = '';
    this._error = '';
    this._open = true;
    this._startTicking();
  }

  done() {
    this._open = false;
    clearInterval(this._iv);
  }

  fail(message) {
    this._busy = '';
    this._error = message;
  }

  /** The card calls this when TaskMate's state has caught up with an action. */
  settled() {
    this._busy = '';
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._iv);
  }

  _startTicking() {
    clearInterval(this._iv);
    this._iv = setInterval(() => {
      if (this.task?.timer?.state === 'running') this._tick = Date.now();
    }, 1000);
  }

  _act(action) {
    this._busy = action;
    this._error = '';
    this.dispatchEvent(new CustomEvent('timer-action', { detail: { choreId: this.task.id, action }, bubbles: true, composed: true }));
  }

  render() {
    if (!this._open || !this.task) return nothing;
    const lang = this.lang;
    const task = this.task;
    const timer = task.timer;
    const secs = elapsedSeconds(timer, this.now());
    const cap = task.capMinutes ? task.capMinutes * 60 : 0;
    const block = (task.rateMinutes || 0) * 60;
    // The ring fills towards the next paid block, or towards the cap if set.
    const pct = cap ? Math.min(100, (secs / cap) * 100) : (block ? ((secs % block) / block) * 100 : 0);
    const running = timer?.state === 'running';
    const paused = timer?.state === 'paused';
    const pts = timedPoints(secs, task);
    return html`<div class="scrim" @click=${(e) => { if (e.target === e.currentTarget) this.done(); }}>
      <div class="sheet" role="dialog" aria-modal="true" style=${this._ctx.personStyle}>
        <div class="who">${this._ctx.personName}</div>
        <h2>${task.summary}</h2>
        <div class="rate">${task.ratePoints === 1 ? t(lang, 'timer_rate_one', { minutes: task.rateMinutes }) : t(lang, 'timer_rate', { points: task.ratePoints, minutes: task.rateMinutes })}${task.capMinutes ? html` · ${t(lang, 'timer_cap', { minutes: task.capMinutes })}` : nothing}</div>
        <div class="ring" style="--pct:${pct}%"><div class="inner">
          <div class="clock">${formatClock(secs)}</div>
          <div class="state">${running ? t(lang, 'timer_running', { time: '' }).replace(/[·\s]+$/, '') : paused ? t(lang, 'timer_paused', { time: '' }).replace(/[·\s]+$/, '') : ''}</div>
        </div></div>
        ${timer ? html`<div class="earn">${pts === 1 ? t(lang, 'timer_earn_one') : t(lang, 'timer_earn', { points: pts })}</div>` : nothing}
        <div class="controls">
          ${running
            ? html`<button class="btn pause" ?disabled=${Boolean(this._busy)} @click=${() => this._act('pause')}><ha-icon icon="mdi:pause"></ha-icon>${t(lang, 'timer_pause')}</button>`
            : html`<button class="btn start" ?disabled=${Boolean(this._busy)} @click=${() => this._act('start')}><ha-icon icon="mdi:play"></ha-icon>${paused ? t(lang, 'timer_resume') : t(lang, 'timer_start')}</button>`}
          ${timer ? html`<button class="btn finish" ?disabled=${Boolean(this._busy)} @click=${() => this._act('finish')}><ha-icon icon="mdi:flag-checkered"></ha-icon>${t(lang, 'timer_finish')}</button>` : nothing}
        </div>
        ${this._error ? html`<div class="err">${this._error}</div>` : nothing}
        <button class="close" @click=${() => this.done()}>${t(lang, 'close')}</button>
      </div>
    </div>`;
  }
}

customElements.define('family-hub-timer-sheet', FamilyHubTimerSheet);
