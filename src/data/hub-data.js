import { fetchEvents } from './calendar-source.js';
import { fetchChores, completeChore } from './todo-source.js';
import { readPoints, readCompletions, completionsForPerson } from './taskmate-source.js';
import { msUntilNextLocalMidnight } from './time.js';

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
    this.model = { people: [], staleSince: null, failures: [] };
  }

  get _tz() {
    return this.getHass()?.config?.time_zone || 'UTC';
  }

  async refresh() {
    const hass = this.getHass();
    const now = this.getNow();
    const { people, choreFilter } = this.config;

    const [cal, todo] = await Promise.all([
      fetchEvents(hass, people, now, this._tz),
      fetchChores(hass, people, choreFilter, now, this._tz),
    ]);

    // Keep last-good data rather than blanking a wall display.
    if (cal.failures.length === 0) this._events = cal.events;
    if (todo.failures.length === 0) this._chores = todo.choresByPerson;

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
    } catch {
      chore.status = previous;
      this.model.failures = [...this.model.failures, person.todo];
      this._rebuild(this.getHass());
      this.onChange();
    }
  }
}
