import { LitElement, html, css, nothing } from 'lit';
import { tokens, sharedStyles } from '../styles/shared.js';
import {
  availableTypes,
  creatableTodoLists,
  creatableCalendars,
  taskmateChildren,
  createTodo,
  createEvent,
  createChore,
} from './add-controller.js';

const LABELS = {
  todo: 'To-do task',
  calendar: 'Calendar event',
  chore: 'TaskMate chore',
};

/**
 * The add flow: a type picker, then one form per type.
 *
 * All three live in one element because they share the dialog chrome, the busy
 * and error states and the submit path; splitting them would duplicate that
 * three times to save a hundred lines of template.
 */
export class FamilyHubAddDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    date: { attribute: false },
    open: { type: Boolean },
    _type: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _fields: { state: true },
  };

  static styles = [
    tokens,
    sharedStyles,
    css`
      .sheet { background: var(--fh-bg); color: var(--fh-text); border-radius: var(--fh-radius); padding: 20px 22px; min-width: 320px; max-width: 460px; }
      h2 { font-size: 20px; font-weight: 600; margin: 0 0 14px; }
      .types { display: flex; flex-direction: column; gap: 8px; }
      .type { display: flex; align-items: center; min-height: var(--fh-touch); padding: 0 14px; border-radius: var(--fh-radius-inner); background: var(--fh-surface); border: none; color: var(--fh-text); font: inherit; font-size: 16px; cursor: pointer; text-align: left; }
      .type:hover { background: var(--fh-chip); }
      label { display: block; font-size: 13px; color: var(--fh-text-mute); margin: 12px 0 4px; }
      input, select { width: 100%; box-sizing: border-box; min-height: var(--fh-touch); padding: 0 12px; border-radius: 10px; border: 1px solid var(--fh-rule); background: var(--fh-surface); color: var(--fh-text); font: inherit; font-size: 16px; }
      .row { display: flex; gap: 10px; }
      .row > * { flex: 1; }
      .check { display: flex; align-items: center; gap: 10px; min-height: var(--fh-touch); font-size: 15px; }
      .check input { width: 20px; min-height: 20px; flex: none; }
      .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
      .btn { min-height: var(--fh-touch); padding: 0 18px; border-radius: 10px; border: none; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; }
      .btn.cancel { background: none; color: var(--fh-text-mute); }
      .btn.go { background: var(--fh-now); color: #fff; }
      .btn[disabled] { opacity: 0.5; cursor: default; }
      .err { color: var(--error-color, #d64545); font-size: 14px; margin-top: 12px; }
      .scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: grid; place-items: center; z-index: 9; }
    `,
  ];

  constructor() {
    super();
    this.open = false;
    this._reset();
  }

  _reset() {
    this._type = null;
    this._busy = false;
    this._error = '';
    this._fields = {};
  }

  /** Opens the flow, skipping the picker when only one type qualifies. */
  show() {
    this._reset();
    const types = availableTypes(this.hass, this.config);
    if (types.length === 1) this._type = types[0];
    this.open = true;
  }

  _close() {
    this.open = false;
    this._reset();
    this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
  }

  /**
   * Scrim taps only dismiss an untouched form — a stray sleeve on a wall tablet
   * should not discard a half-typed event.
   */
  _scrimTap(e) {
    if (e.target !== e.currentTarget) return;
    if (Object.keys(this._fields).length) return;
    this._close();
  }

  _set(key, value) {
    this._fields = { ...this._fields, [key]: value };
  }

  _isoDate() {
    const d = this.date || new Date();
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: this.hass?.config?.time_zone || 'UTC',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(d);
  }

  async _submit() {
    this._busy = true;
    this._error = '';
    const f = this._fields;
    let res;

    if (this._type === 'todo') {
      res = await createTodo(this.hass, { entityId: f.entityId, title: f.title, due: f.due });
    } else if (this._type === 'calendar') {
      res = await createEvent(this.hass, {
        entityId: f.entityId, title: f.title, date: f.date || this._isoDate(),
        allDay: Boolean(f.allDay), start: f.start, end: f.end,
      });
    } else {
      res = await createChore(this.hass, {
        name: f.title, points: f.points, assignedTo: f.assignedTo,
        requiresApproval: f.requiresApproval,
      });
    }

    this._busy = false;
    if (res.ok) {
      this.dispatchEvent(new CustomEvent('created', { bubbles: true, composed: true }));
      this._close();
    } else {
      // Stay open so nothing typed is lost.
      this._error = res.error;
    }
  }

  render() {
    if (!this.open) return nothing;
    return html`
      <div class="scrim" @click=${(e) => this._scrimTap(e)}>
        <div class="sheet" role="dialog" aria-modal="true">
          ${this._type ? this._form() : this._picker()}
        </div>
      </div>
    `;
  }

  _picker() {
    const types = availableTypes(this.hass, this.config);
    return html`
      <h2>Add</h2>
      <div class="types">
        ${types.map(
          (t) => html`<button class="type" @click=${() => { this._type = t; }}>${LABELS[t]}</button>`,
        )}
      </div>
      <div class="actions">
        <button class="btn cancel" @click=${() => this._close()}>Cancel</button>
      </div>
    `;
  }

  _form() {
    const body =
      this._type === 'todo' ? this._todoForm()
        : this._type === 'calendar' ? this._eventForm()
          : this._choreForm();
    const valid = Boolean(this._fields.title && (this._type === 'chore' || this._fields.entityId));

    return html`
      <h2>${LABELS[this._type]}</h2>
      ${body}
      ${this._error ? html`<div class="err">${this._error}</div>` : nothing}
      <div class="actions">
        <button class="btn cancel" @click=${() => this._close()} ?disabled=${this._busy}>Cancel</button>
        <button class="btn go" @click=${() => this._submit()} ?disabled=${this._busy || !valid}>
          ${this._busy ? 'Adding…' : 'Add'}
        </button>
      </div>
    `;
  }

  _entitySelect(ids, label) {
    return html`
      <label>${label}</label>
      <select @change=${(e) => this._set('entityId', e.target.value)}>
        <option value="">Choose…</option>
        ${ids.map(
          (id) => html`<option value=${id}>
            ${this.hass.states[id]?.attributes?.friendly_name || id}
          </option>`,
        )}
      </select>
    `;
  }

  _todoForm() {
    return html`
      ${this._entitySelect(creatableTodoLists(this.hass, this.config), 'List')}
      <label>Task</label>
      <input type="text" @input=${(e) => this._set('title', e.target.value)} />
      <label>Due (optional)</label>
      <input type="date" @input=${(e) => this._set('due', e.target.value)} />
    `;
  }

  _eventForm() {
    return html`
      ${this._entitySelect(creatableCalendars(this.hass, this.config), 'Calendar')}
      <label>Event</label>
      <input type="text" @input=${(e) => this._set('title', e.target.value)} />
      <label>Date</label>
      <input type="date" .value=${this._fields.date ?? this._isoDate()}
        @input=${(e) => this._set('date', e.target.value)} />
      <div class="check">
        <input type="checkbox" id="allday" @change=${(e) => this._set('allDay', e.target.checked)} />
        <label for="allday" style="margin:0">All day</label>
      </div>
      ${this._fields.allDay
        ? nothing
        : html`<div class="row">
            <div>
              <label>Start</label>
              <input type="time" @input=${(e) => this._set('start', e.target.value)} />
            </div>
            <div>
              <label>End (optional)</label>
              <input type="time" @input=${(e) => this._set('end', e.target.value)} />
            </div>
          </div>`}
    `;
  }

  _choreForm() {
    const children = taskmateChildren(this.hass, this.config);
    const assigned = this._fields.assignedTo || [];
    const toggle = (id, on) =>
      this._set('assignedTo', on ? [...assigned, id] : assigned.filter((x) => x !== id));

    return html`
      <label>Chore</label>
      <input type="text" @input=${(e) => this._set('title', e.target.value)} />
      <label>Points</label>
      <input type="number" min="0" .value=${String(this._fields.points ?? 10)}
        @input=${(e) => this._set('points', e.target.value)} />
      <label>Assign to</label>
      ${children.length
        ? children.map(
            (c) => html`<div class="check">
              <input type="checkbox" id=${`c-${c.id}`} .checked=${assigned.includes(c.id)}
                @change=${(e) => toggle(c.id, e.target.checked)} />
              <label for=${`c-${c.id}`} style="margin:0">${c.name}</label>
            </div>`,
          )
        : html`<div class="notice">No TaskMate children found. Add a points sensor to a person first.</div>`}
      <div class="check">
        <input type="checkbox" id="approval" .checked=${this._fields.requiresApproval !== false}
          @change=${(e) => this._set('requiresApproval', e.target.checked)} />
        <label for="approval" style="margin:0">Needs approval</label>
      </div>
    `;
  }
}

customElements.define('family-hub-add-dialog', FamilyHubAddDialog);
