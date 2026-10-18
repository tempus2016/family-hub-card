// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import '../src/screens/calendar-screen.js';
import '../src/screens/tasks-screen.js';
import '../src/screens/rewards-screen.js';

const TZ = 'Europe/London';
const NOW = new Date('2026-10-18T10:00:00Z'); // Sunday 11:00 BST
const ev = (id, summary, s, e, extra = {}) => ({ id, summary, start: new Date(s), end: new Date(e), allDay: false, ...extra });
const ana = {
  id: 'ana', name: 'Ana', color: '#b36ad6', initials: 'A', todo: 'todo.ana', taskmateChildId: 'k1',
  points: { balance: 742, unit: 'Points', streak: 3 },
  events: [ev('e1', 'Make bed', '2026-10-18T06:30:00Z', '2026-10-18T07:00:00Z'), ev('e2', 'Dentist', '2026-10-18T13:00:00Z', '2026-10-18T14:00:00Z', { location: 'Inverness' }), ev('e3', 'Piano', '2026-10-12T16:00:00Z', '2026-10-12T17:00:00Z')],
  chores: [{ id: 'c1', summary: 'Make bed', status: 'needs_action' }, { id: 'c2', summary: 'Brush teeth', status: 'completed' }, { id: 'c3', summary: 'Something extra', status: 'needs_action' }],
  completedToday: [], failures: [],
  tasks: [
    { id: 'c1', summary: 'Make bed', done: false, pending: false, tappable: true, needs: null, icon: 'mdi:bed', stars: 10, kind: 'todo', due: null },
    { id: 'c2', summary: 'Brush teeth', done: true, pending: false, tappable: false, needs: null, icon: 'mdi:toothbrush', stars: 5, kind: 'todo', due: null },
    { id: 'c3', summary: 'Something extra', done: false, pending: false, tappable: true, needs: 'note', icon: 'mdi:star', stars: 0, kind: 'todo', due: null },
  ],
  progress: { done: 1, total: 3, pct: 33 },
};
const fam = { id: 'family', name: 'Family', color: '#5fbf86', initials: 'F', shared: true, events: [ev('z', 'Zoo trip', '2026-10-18T13:00:00Z', '2026-10-18T15:00:00Z')], chores: [], completedToday: [], tasks: [], progress: { done: 0, total: 0, pct: 0 } };
const model = { people: [ana, fam], meals: [], failures: [], staleSince: null };

async function mount(tag, props) {
  const el = document.createElement(tag);
  Object.assign(el, { tz: TZ, lang: 'en', locale: { language: 'en', time_format: '24' }, now: NOW, scheme: 'light', confirmWindow: 0.05, readOnly: false, ...props });
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const $ = (el, s) => el.shadowRoot.querySelector(s);
const $$ = (el, s) => [...el.shadowRoot.querySelectorAll(s)];

describe('calendar: schedule', () => {
  it('lays out seven day columns from Monday with today marked and cards in person tint', async () => {
    const el = await mount('family-hub-calendar-screen', { model, mode: 'schedule', startOffset: -6, offsetDays: 0, weekStart: 'monday' });
    const cols = $$(el, '.day');
    expect(cols).toHaveLength(7);
    expect(cols[0].querySelector('.dh').textContent).toMatch(/Mon/);
    expect(cols[6].classList.contains('today')).toBe(true);
    expect(cols[6].textContent).toContain('Dentist');
    expect(cols[0].textContent).toContain('Piano');
    expect(cols[6].querySelector('.card').getAttribute('style')).toMatch(/--tint:#/);
  });

  it('puts a tick on a card that is a chore and fires chore-tap', async () => {
    const el = await mount('family-hub-calendar-screen', { model, mode: 'schedule', startOffset: -6, offsetDays: 0 });
    const fired = [];
    el.addEventListener('chore-tap', (e) => fired.push(e.detail));
    const btn = $(el, '.card button.tap');
    expect(btn.getAttribute('aria-label')).toContain('Make bed');
    btn.click();
    await new Promise((r) => setTimeout(r, 120));
    expect(fired).toEqual([{ personId: 'ana', choreId: 'c1' }]);
  });

  it('shows a meal pill when the model carries meals', async () => {
    const withMeals = { ...model, meals: [ev('m1', 'Spaghetti', '2026-10-18T00:00:00Z', '2026-10-19T00:00:00Z', { allDay: true })] };
    const el = await mount('family-hub-calendar-screen', { model: withMeals, mode: 'schedule', startOffset: -6, offsetDays: 0 });
    expect($(el, '.day.today .meal').textContent).toContain('Spaghetti');
  });

  it('expands a card on tap to show its time range and location', async () => {
    const el = await mount('family-hub-calendar-screen', { model, mode: 'schedule', startOffset: -6, offsetDays: 0 });
    const dentist = $$(el, '.card').find((c) => c.textContent.includes('Dentist'));
    dentist.click();
    await el.updateComplete;
    expect($(el, '.detail').textContent).toContain('Inverness');
  });
});

describe('calendar: chore events', () => {
  const choreModel = { ...model, people: [{ ...ana, events: [
    ...ana.events,
    ev('t1', 'Make bed', '2026-10-18T05:00:00Z', '2026-10-18T11:00:00Z', { isChore: true, calendar: 'calendar.taskmate_ana' }),
    ev('t2', 'Brush teeth', '2026-10-18T20:00:00Z', '2026-10-18T21:00:00Z', { isChore: true, calendar: 'calendar.taskmate_ana' }),
    ev('t3', 'Make bed', '2026-10-13T05:00:00Z', '2026-10-13T11:00:00Z', { isChore: true, calendar: 'calendar.taskmate_ana' }),
  ] }, fam] };

  it('collapses chore-calendar events into one pill per person per day and opens Tasks on tap', async () => {
    const el = await mount('family-hub-calendar-screen', { model: choreModel, mode: 'schedule', startOffset: -6, offsetDays: 0 });
    const today = $$(el, '.day')[6];
    // The real Make bed event, Dentist and the family Zoo trip stay as cards.
    expect(today.querySelectorAll('.card')).toHaveLength(3);
    expect(today.textContent).not.toMatch(/Brush teeth/);
    const pill = today.querySelector('.chorepill');
    expect(pill.textContent).toMatch(/1\/3/);
    expect($$(el, '.day')[1].querySelector('.chorepill').textContent).toMatch(/1 chore/);
    const asked = [];
    el.addEventListener('open-screen', (e) => asked.push(e.detail.screen));
    pill.click();
    expect(asked).toEqual(['tasks']);
  });

  it('keeps them out of the month chips too', async () => {
    const el = await mount('family-hub-calendar-screen', { model: choreModel, mode: 'month', monthShift: 0 });
    const today = $$(el, '.mcell').find((c) => c.classList.contains('today'));
    expect(today.textContent).not.toContain('Brush teeth');
    expect(today.textContent).toMatch(/chores/);
  });
});

describe('calendar: week', () => {
  it('draws an hour gutter and positions events by time with a now-line on today', async () => {
    const el = await mount('family-hub-calendar-screen', { model, mode: 'week', startOffset: -6, offsetDays: 0 });
    expect($$(el, '.gutter span').length).toBeGreaterThan(10);
    const tev = $$(el, '.tev').find((x) => x.textContent.includes('Dentist'));
    expect(tev.style.top).toMatch(/px$/);
    expect($(el, '.nowline')).toBeTruthy();
  });

  it('draws no now-line when paged away', async () => {
    const el = await mount('family-hub-calendar-screen', { model, mode: 'week', startOffset: 1, offsetDays: 7 });
    expect($(el, '.nowline')).toBeNull();
  });
});

describe('calendar: month', () => {
  it('renders 42 cells, chips, and asks to open a day on tap', async () => {
    const el = await mount('family-hub-calendar-screen', { model, mode: 'month', monthShift: 0 });
    const cells = $$(el, '.mcell');
    expect(cells).toHaveLength(42);
    const today = cells.find((c) => c.classList.contains('today'));
    expect(today.textContent).toContain('Dentist');
    const asked = [];
    el.addEventListener('open-day', (e) => asked.push(e.detail.offset));
    today.click();
    expect(asked).toEqual([0]);
  });
});

describe('calendar: day', () => {
  it('lists one day as cards with a now-line and shared events once', async () => {
    const el = await mount('family-hub-calendar-screen', { model, mode: 'day', startOffset: 0, offsetDays: 0 });
    const cards = $$(el, '.card');
    expect(cards.map((c) => c.querySelector('.t').textContent.trim())).toEqual(['Make bed', 'Dentist', 'Zoo trip']);
    expect($(el, '.nowline, .now')).toBeTruthy();
  });
});

describe('tasks screen', () => {
  it('renders a tinted column per non-shared person with hero icon, stars and tick', async () => {
    const el = await mount('family-hub-tasks-screen', { model });
    expect($$(el, '.pcol')).toHaveLength(1);
    const tile = $$(el, '.tile').find((x) => x.textContent.includes('Make bed'));
    expect(tile.querySelector('ha-icon').getAttribute('icon')).toBe('mdi:bed');
    expect(tile.querySelector('.stars').textContent).toContain('10');
    expect(tile.querySelector('button.tap')).toBeTruthy();
  });

  it('asks for what a chore needs instead of queueing a tick', async () => {
    const el = await mount('family-hub-tasks-screen', { model });
    const tile = $$(el, '.tile').find((x) => x.textContent.includes('Something extra'));
    expect(tile.textContent).toMatch(/add a note/i);
    const fired = [];
    const needs = [];
    el.addEventListener('chore-tap', (e) => fired.push(e.detail));
    el.addEventListener('chore-needs', (e) => needs.push(e.detail));
    tile.querySelector('button.tap').click();
    await new Promise((r) => setTimeout(r, 120));
    expect(fired).toEqual([]);
    expect(needs).toEqual([{ personId: 'ana', choreId: 'c3' }]);
  });

  it('hides done tiles when asked', async () => {
    let el = await mount('family-hub-tasks-screen', { model, hideCompleted: false });
    expect($$(el, '.tile.done')).toHaveLength(1);
    el = await mount('family-hub-tasks-screen', { model, hideCompleted: true });
    expect($$(el, '.tile.done')).toHaveLength(0);
  });

  it('shows four period rings with the current one emphasised', async () => {
    const el = await mount('family-hub-tasks-screen', { model, isToday: true });
    expect($$(el, '.per')).toHaveLength(4);
    expect($(el, '.per.now').textContent).toMatch(/Morning/);
  });
});

describe('rewards screen', () => {
  const hass = { states: {}, callService: vi.fn(async () => {}) };
  const rewards = (over) => ({ hass, model, rewardsEntity: 'sensor.r', ...over });
  const stub = (list, pending = []) => { hass.states['sensor.r'] = { state: '1', attributes: { rewards: list, pending_reward_claims: pending } }; };

  it('lists the first child’s rewards with progress and a Redeem only when affordable', async () => {
    stub([{ id: 'r1', name: 'Ice cream', cost: 100, icon: 'mdi:ice-cream', assigned_to: [], is_available: true }, { id: 'r2', name: 'Bear', cost: 1500, icon: 'mdi:teddy-bear', assigned_to: [], is_available: true }]);
    const el = await mount('family-hub-rewards-screen', rewards());
    const cards = $$(el, '.rw');
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector('.go')).toBeTruthy();
    expect(cards[1].querySelector('.go')).toBeNull();
    expect(cards[1].textContent).toContain('742/1500');
  });

  it('redeems on a second tap and shows Requested once pending', async () => {
    stub([{ id: 'r1', name: 'Ice cream', cost: 100, icon: 'mdi:ice-cream', assigned_to: [], is_available: true }]);
    const el = await mount('family-hub-rewards-screen', rewards());
    const go = $(el, '.rw .go');
    go.click(); await el.updateComplete;
    expect(hass.callService).not.toHaveBeenCalled();
    $(el, '.rw .go').click(); await el.updateComplete;
    expect(hass.callService).toHaveBeenCalledWith('taskmate', 'claim_reward', { reward_id: 'r1', child_id: 'k1' });
    stub([{ id: 'r1', name: 'Ice cream', cost: 100, icon: 'mdi:ice-cream', assigned_to: [], is_available: true }], [{ id: 'x', reward_id: 'r1', child_id: 'k1' }]);
    el.hass = { ...hass };
    await el.updateComplete;
    expect($(el, '.rw').textContent).toMatch(/Requested/);
  });
});
