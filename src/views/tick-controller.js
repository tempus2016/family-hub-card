import { html, nothing } from 'lit';
import { t } from '../i18n.js';
import { elapsedSeconds, formatClock } from '../data/timed.js';

/**
 * Tap-to-complete with a client-side undo window, shared by every view that
 * shows a tick box.
 *
 * The window is client-side and the service call fires only on expiry.
 * TaskMate's un-tick is deliberately inert, so an undo that reversed a
 * completion would work on stock lists and silently fail on TaskMate; not
 * sending anything until the window closes behaves identically on both.
 *
 * Queued ticks are committed, never discarded, when the page hides or the
 * host leaves the DOM: a tablet sleeping inside the window must not swallow a
 * chore the child already ticked.
 *
 * The host supplies `readOnly` and `confirmWindow` as properties and receives
 * a `chore-tap` event per committed tick.
 */
export class TickController {
  constructor(host) {
    this.host = host;
    this.pending = new Map();
    this._onPageHide = () => this.flush();
    this._onVisibility = () => {
      if (document.visibilityState === 'hidden') this.flush();
    };
    host.addController(this);
  }

  hostConnected() {
    // pagehide can fire while visibilityState is still "visible", so both are
    // needed.
    window.addEventListener('pagehide', this._onPageHide);
    document.addEventListener('visibilitychange', this._onVisibility);
  }

  hostDisconnected() {
    window.removeEventListener('pagehide', this._onPageHide);
    document.removeEventListener('visibilitychange', this._onVisibility);
    this.flush();
  }

  isPending(personId, choreId) {
    return this.pending.has(`${personId}:${choreId}`);
  }

  tap(personId, choreId, needs = null) {
    // Ticking only ever applies to today's list, so a paged view must not look
    // tappable and silently do nothing.
    if (this.host.readOnly) return;
    // A chore that needs a note, photo or count cannot be undone-by-waiting:
    // the card opens a sheet to collect it, and the sheet's Done is the commit.
    if (needs) {
      this.host.dispatchEvent(new CustomEvent('chore-needs', { detail: { personId, choreId }, bubbles: true, composed: true }));
      return;
    }
    const key = `${personId}:${choreId}`;
    const existing = this.pending.get(key);
    if (existing) {
      clearTimeout(existing.timer);
      this.pending.delete(key);
      this.host.requestUpdate();
      return;
    }
    const window_ = Number(this.host.confirmWindow) || 0;
    if (!window_) {
      this._fire(personId, choreId);
      return;
    }
    const timer = setTimeout(() => {
      this.pending.delete(key);
      this._fire(personId, choreId);
    }, window_ * 1000);
    this.pending.set(key, { timer, personId, choreId });
    this.host.requestUpdate();
  }

  /** Fire every queued completion immediately and clear the queue. */
  flush() {
    for (const p of this.pending.values()) {
      clearTimeout(p.timer);
      this._fire(p.personId, p.choreId);
    }
    this.pending.clear();
  }

  _fire(personId, choreId) {
    this.host.dispatchEvent(
      new CustomEvent('chore-tap', { detail: { personId, choreId }, bubbles: true, composed: true }),
    );
    this.host.requestUpdate();
  }
}

/**
 * The tick box for one task. A task that cannot be tapped — a completed item,
 * or a TaskMate completion with no to-do item behind it — renders as a static
 * filled box rather than a button: there is nothing left to update.
 */
const CHECK = html`<svg viewBox="0 0 24 24"><path d="M5 12.5l4 4L19 7"/></svg>`;

export function renderTick(ticks, person, task, { inline = false } = {}) {
  const cls = inline ? 'tap inline' : 'tap';
  if (!task.tappable) {
    return html`<span class=${cls}><span class="tick on">${CHECK}</span></span>`;
  }
  const pending = ticks.isPending(person.id, task.id);
  const done = task.done || pending;
  const lang = ticks.host.lang || 'en';
  return html`
    <button
      class=${cls}
      role="checkbox"
      aria-checked=${done ? 'true' : 'false'}
      aria-label=${t(lang, 'complete_for', { chore: task.summary, name: person.name })}
      @click=${(e) => { e.stopPropagation(); ticks.tap(person.id, task.id, task.needs); }}
      ?disabled=${ticks.host.readOnly}
    >
      <span class="tick ${done ? 'on' : ''} ${pending ? 'ring' : ''}"
        style="--fh-window:${ticks.host.confirmWindow}s">${CHECK}</span>
    </button>
  `;
}

/** The small status word after a task name: waiting for approval, or overdue. */
export function renderBadge(lang, task, { inline = false } = {}) {
  const cls = inline ? 'badge inline-badge' : 'badge';
  if (task.pending) return html`<span class="${cls} waiting">${t(lang, 'waiting')}</span>`;
  if (task.timer && !task.done) {
    const time = formatClock(elapsedSeconds(task.timer));
    return html`<span class="${cls} needs">${t(lang, task.timer.state === 'running' ? 'timer_running' : 'timer_paused', { time })}</span>`;
  }
  if (task.needs && !task.done) return html`<span class="${cls} needs">${t(lang, `needs_${task.needs}`)}</span>`;
  if (task.overdue && !task.done) return html`<span class="${cls} overdue">${t(lang, 'overdue')}</span>`;
  return nothing;
}

/** One task as a list row: box, name, badge. */
export function renderTaskRow(ticks, person, task) {
  const pending = ticks.isPending(person.id, task.id);
  const done = task.done || pending;
  const lang = ticks.host.lang || 'en';
  const cls = ['chore', done ? 'done' : '', task.pending ? 'pending' : '', task.overdue && !done ? 'overdue' : '']
    .filter(Boolean).join(' ');
  return html`
    <div class=${cls}>
      ${renderTick(ticks, person, task)}
      <span class="name">${task.summary}</span>
      ${renderBadge(lang, task)}
    </div>
  `;
}
