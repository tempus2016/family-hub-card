import { fetchEvents } from './calendar-source.js';
import { fetchChores, completeChore } from './todo-source.js';
import { readPoints, readCompletions, completionsForPerson } from './taskmate-source.js';
import { buildTasks, progressOf } from './tasks.js';
import { choreMeta } from './chore-meta.js';
import { submitChore } from './taskmate-submit.js';
import { readSessions, timerAction } from './timed.js';
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
    this._inflightScope = { events: false, chores: false };
    this._queued = null;
    this._lastCal = { events: [], failures: [], failuresByPerson: {} };
    this._lastTodo = { choresByPerson: {}, failures: [], failuresByPerson: {} };
    this._windowDays = null;
    this._startOffset = 0;
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
    return this._windowDays ?? (this.config.calendarView === 'day' ? 1 : 7);
  }

  /** Days to shift the fetch window by. Negative looks backwards. */
  get startOffset() {
    return this._startOffset;
  }

  set startOffset(days) {
    if (this._startOffset === days) return;
    this._startOffset = days;
    // Only the event window moves; the to-do lists are not date-scoped.
    this.refresh({ events: true, chores: false, stale: true });
  }

  set windowDays(days) {
    if (this._windowDays === days) return;
    this._windowDays = days;
    this.refresh({ events: true, chores: false, stale: true });
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
    if (!hass) return undefined;

    let events = false;
    let chores = false;
    let rebuild = false;
    for (const id of this.watchedEntities()) {
      if (prev?.states?.[id] === hass.states?.[id]) continue;
      // Calendars and to-do lists need a network round trip; sensors carry
      // everything we need in the state object already.
      if (id.startsWith('calendar.')) events = true;
      else if (id.startsWith('todo.')) chores = true;
      else rebuild = true;
    }

    if (events || chores) {
      // A ticked chore changes only the to-do entity, so it refetches only the
      // to-do lists — not one HTTP call per calendar as well.
      return this.refresh({ events, chores });
    }
    if (rebuild) {
      this._rebuild(hass);
      this.onChange();
    }
    return undefined;
  }

  /**
   * Coalesces overlapping refreshes so a burst of state changes fetches once.
   * A request arriving mid-flight for a source the running one skipped is
   * queued and runs once, after it.
   */
  async refresh({ events = true, chores = true, stale = false } = {}) {
    if (this._inflight) {
      // `stale` means the request's parameters changed (window or paging), so
      // the fetch already running is answering the wrong question and must be
      // followed by another, not merged into it.
      this._queued = {
        events: (this._queued?.events || false) || (events && (stale || !this._inflightScope.events)),
        chores: (this._queued?.chores || false) || (chores && (stale || !this._inflightScope.chores)),
      };
      return this._inflight;
    }
    this._inflightScope = { events, chores };
    this._inflight = this._doRefresh({ events, chores }).finally(() => {
      this._inflight = null;
      const queued = this._queued;
      this._queued = null;
      if (queued && (queued.events || queued.chores)) this.refresh(queued);
    });
    return this._inflight;
  }

  async _doRefresh({ events, chores }) {
    const hass = this.getHass();
    const now = this.getNow();
    const { people, choreFilter } = this.config;

    const [cal, todo] = await Promise.all([
      events
        ? fetchEvents(hass, people, now, this._tz, this.windowDays, this._startOffset)
        : this._lastCal,
      chores ? fetchChores(hass, people, choreFilter, now, this._tz) : this._lastTodo,
    ]);
    this._lastCal = cal;
    this._lastTodo = todo;

    // Keep last-good data per person, not per batch. Retaining all-or-nothing
    // means one broken entity blanks every other person's data too.
    const prevEvents = this._events;
    const prevChores = this._chores;

    if (events) {
      const calFailed = new Set(Object.keys(cal.failuresByPerson || {}));
      this._events = [
        ...cal.events.filter((e) => !calFailed.has(e.personId)),
        // A person with one working and one broken calendar keeps their
        // previous day rather than showing a half-populated one.
        ...prevEvents.filter((e) => calFailed.has(e.personId)),
      ].sort((a, b) => {
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
        return a.start - b.start;
      });
    }

    if (chores) {
      const choreFailed = new Set(Object.keys(todo.failuresByPerson || {}));
      this._chores = {};
      for (const p of people) {
        this._chores[p.id] = choreFailed.has(p.id)
          ? prevChores[p.id] || []
          : todo.choresByPerson[p.id] || [];
      }
    }

    this._failuresByPerson = {};
    for (const [pid, ents] of Object.entries(cal?.failuresByPerson || {})) {
      (this._failuresByPerson[pid] ||= []).push(...ents);
    }
    for (const [pid, ents] of Object.entries(todo?.failuresByPerson || {})) {
      (this._failuresByPerson[pid] ||= []).push(...ents);
    }

    const failures = [...(cal?.failures || []), ...(todo?.failures || [])];
    this.model = {
      ...this.model,
      staleSince: failures.length ? (this.model.staleSince || now) : null,
      failures,
    };

    this._rebuild(hass);
    this.onChange();
  }

  /**
   * Rebuilds `model` as a NEW object rather than mutating it.
   *
   * Lit dirty-checks properties with `!==`, so a mutated-in-place model never
   * registers as changed and a child view never re-renders. Agenda and week hid
   * this by also receiving a fresh `now` Date each render; columns takes no such
   * prop and froze on its first, empty render.
   */
  _rebuild(hass) {
    const completions = readCompletions(hass, this.config.taskmateChores);
    const meta = choreMeta(hass, this.config.taskmateChores);
    const sessions = readSessions(hass, this.config.taskmateChores);
    const choreCals = new Set(this.config.choreCalendars || []);
    const now = this.getNow();

    const people = this.config.people.map((p) => {
      const points = readPoints(hass, p);
      const withChild = { ...p, taskmateChildId: points?.childId || null };
      const personEntity = p.person ? hass?.states?.[p.person] : null;
      const person = {
        ...withChild,
        // Explicit picture, then the HA person's photo, then TaskMate's
        // uploaded image; the TaskMate icon only when there is no photo.
        picture: p.picture || personEntity?.attributes?.entity_picture || points?.avatarImage || null,
        icon: points?.avatarIcon || null,
        events: this._events.filter((e) => e.personId === p.id).map((e) => ({ ...e, isChore: choreCals.has(e.calendar) })),
        chores: this._chores[p.id] || [],
        completedToday: completionsForPerson(completions, withChild),
        points,
        failures: this._failuresByPerson[p.id] || [],
      };
      // Merged once here so every view reads the same list.
      person.tasks = buildTasks(person, {
        now, tz: this._tz, maxCompleted: this.config.maxCompleted, meta, sessions,
      });
      person.progress = progressOf(person);
      return person;
    });

    // The meals calendar rides along as a hidden person so it shares the
    // fetch, the failure handling and the window; it surfaces as model.meals.
    const meals = people.find((p) => p.id === 'meals');
    this.model = {
      ...this.model,
      people: people.filter((p) => p.id !== 'meals'),
      meals: meals ? meals.events : [],
    };
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

  /**
   * Completes a chore that needed a note, photo or count, through TaskMate's
   * own action. Optimistic like `complete`, but rethrows so the sheet can stay
   * open and show why — the child has typed or photographed something.
   */
  async submit(personId, choreId, fields) {
    const hass = this.getHass();
    const person = this.model.people.find((p) => p.id === personId);
    const childId = person?.taskmateChildId;
    const chore = (this._chores[personId] || []).find((c) => c.id === choreId);
    if (!childId || !chore) throw new Error('not a TaskMate chore');
    const previous = chore.status;
    chore.status = 'completed';
    this._rebuild(hass);
    this.onChange();
    try {
      await submitChore(hass, choreId, childId, fields);
    } catch (err) {
      logFailure(`submit:${choreId}`, `could not submit "${chore.summary}"`, err);
      chore.status = previous;
      this._rebuild(this.getHass());
      this.onChange();
      throw err;
    }
  }

  /**
   * Start, pause or finish a timed chore. TaskMate's state comes back through
   * the chores sensor, which hassChanged already watches; finishing changes
   * the to-do list too, which triggers its own refetch.
   */
  async timer(personId, choreId, action) {
    const person = this.model.people.find((p) => p.id === personId);
    if (!person?.taskmateChildId) throw new Error('not a TaskMate chore');
    try {
      await timerAction(this.getHass(), action, choreId, person.taskmateChildId);
    } catch (err) {
      logFailure(`timer:${choreId}`, `could not ${action} the timer`, err);
      throw err;
    }
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
      this.model = { ...this.model, failures: [...this.model.failures, person.todo] };
      this._rebuild(this.getHass());
      this.onChange();
    }
  }
}
