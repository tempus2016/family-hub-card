import { fetchEvents } from './calendar-source.js';
import { fetchChores, completeChore } from './todo-source.js';
import { readPoints, readCompletions, completionsForPerson } from './taskmate-source.js';
import { msUntilNextLocalMidnight } from './time.js';
import { logFailure } from './log.js';

export class HubData {
  constructor({ config, getHass, getNow, onChange, schedule }) {
    this.config = config;
    this.getHass = getHass;
    this.getNow = getNow || (() => new Date());
    this.onChange = onChange || (() => {});
    this.schedule = schedule;
    this._cancels = [];
    this._events = [];
    this._chores = {};
    this._failuresByPerson = {};
    this._inflight = null;
    this._windowDays = null;
    this.model = { people: [], staleSince: null, failures: [] };
  }

  get _tz() {
    return this.getHass()?.config?.time_zone || 'UTC';
  }

  /**
   * How many days of events to fetch. The week grid needs seven; every other
   * view needs one. Settable because the card collapses week to agenda on a
   * narrow screen, and a collapsed agenda showing seven days of events in one
   * timeline would read as duplicates.
   */
  get windowDays() {
    return this._windowDays ?? (this.config.view === 'week' ? 7 : 1);
  }

  set windowDays(days) {
    if (this._windowDays === days) return;
    this._windowDays = days;
    this.refresh();
  }

  /** Every entity whose change should move something on screen. */
  watchedEntities() {
    const ids = [];
    for (const p of this.config.people) {
      ids.push(...(p.calendars || []));
      if (p.todo) ids.push(p.todo);
      if (p.points) ids.push(p.points);
    }
    if (this.config.taskmateChores) ids.push(this.config.taskmateChores);
    return ids;
  }

  /**
   * Called on every hass update. Compares state objects by identity rather than
   * by `.state`, because the signal we care about is sometimes attribute-only:
   * sensor.taskmate_chores keeps the same numeric state while its
   * todays_completions attribute grows.
   */
  hassChanged(prev) {
    const hass = this.getHass();
    if (!hass) return;

    let refetch = false;
    let rebuild = false;
    for (const id of this.watchedEntities()) {
      if (prev?.states?.[id] === hass.states?.[id]) continue;
      // Calendars and to-do lists need a network round trip; sensors carry
      // everything we need in the state object already.
      if (id.startsWith('calendar.') || id.startsWith('todo.')) refetch = true;
      else rebuild = true;
    }

    if (refetch) {
      this.refresh();
    } else if (rebuild) {
      this._rebuild(hass);
      this.onChange();
    }
  }

  /** Coalesces overlapping refreshes so a burst of state changes fetches once. */
  async refresh() {
    if (this._inflight) return this._inflight;
    this._inflight = this._doRefresh().finally(() => {
      this._inflight = null;
    });
    return this._inflight;
  }

  async _doRefresh() {
    const hass = this.getHass();
    const now = this.getNow();
    const { people, choreFilter } = this.config;

    const [cal, todo] = await Promise.all([
      fetchEvents(hass, people, now, this._tz, this.windowDays),
      fetchChores(hass, people, choreFilter, now, this._tz),
    ]);

    // Keep last-good data per person, not per batch. Retaining all-or-nothing
    // means one broken entity blanks every other person's data too.
    const prevEvents = this._events;
    const prevChores = this._chores;

    const calFailed = new Set(Object.keys(cal.failuresByPerson || {}));
    this._events = [
      ...cal.events.filter((e) => !calFailed.has(e.personId)),
      // A person with one working and one broken calendar keeps their previous
      // day rather than showing a half-populated one.
      ...prevEvents.filter((e) => calFailed.has(e.personId)),
    ].sort((a, b) => {
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
      return a.start - b.start;
    });

    const choreFailed = new Set(Object.keys(todo.failuresByPerson || {}));
    this._chores = {};
    for (const p of people) {
      this._chores[p.id] = choreFailed.has(p.id)
        ? prevChores[p.id] || []
        : todo.choresByPerson[p.id] || [];
    }

    this._failuresByPerson = {};
    for (const [pid, ents] of Object.entries(cal.failuresByPerson || {})) {
      (this._failuresByPerson[pid] ||= []).push(...ents);
    }
    for (const [pid, ents] of Object.entries(todo.failuresByPerson || {})) {
      (this._failuresByPerson[pid] ||= []).push(...ents);
    }

    const failures = [...cal.failures, ...todo.failures];
    this.model.staleSince = failures.length ? (this.model.staleSince || now) : null;
    this.model.failures = failures;

    this._rebuild(hass);
    this.onChange();
  }

  _rebuild(hass) {
    const completions = readCompletions(hass, this.config.taskmateChores);

    this.model.people = this.config.people.map((p) => {
      const points = readPoints(hass, p);
      const withChild = { ...p, taskmateChildId: points?.childId || null };
      return {
        ...withChild,
        events: this._events.filter((e) => e.personId === p.id),
        chores: this._chores[p.id] || [],
        completedToday: completionsForPerson(completions, withChild),
        points,
        failures: this._failuresByPerson[p.id] || [],
      };
    });
  }

  start() {
    this.stop();
    const now = this.getNow();
    this._cancels.push(
      this.schedule(() => this.refresh(), this.config.refreshInterval * 1000),
    );
    // Midnight is an explicit trigger: the day window, the chore filter and
    // today's completions all change at local midnight, and waiting for the
    // poll would leave yesterday on the wall for up to refreshInterval.
    this._cancels.push(
      this.schedule(() => {
        this.refresh();
        this.start();
      }, msUntilNextLocalMidnight(now, this._tz)),
    );
  }

  stop() {
    this._cancels.forEach((c) => c());
    this._cancels = [];
  }

  async complete(personId, choreId) {
    const person = this.config.people.find((p) => p.id === personId);
    const list = this._chores[personId] || [];
    const chore = list.find((c) => c.id === choreId);
    if (!person?.todo || !chore) return;

    const previous = chore.status;
    chore.status = 'completed';
    this._rebuild(this.getHass());
    this.onChange();

    try {
      await completeChore(this.getHass(), person.todo, choreId);
    } catch (err) {
      logFailure(`complete:${person.todo}`, `could not complete "${chore.summary}" on ${person.todo}`, err);
      chore.status = previous;
      this.model.failures = [...this.model.failures, person.todo];
      this._rebuild(this.getHass());
      this.onChange();
    }
  }
}
