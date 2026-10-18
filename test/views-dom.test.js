// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import '../src/views/agenda-view.js';
import '../src/views/tasks-view.js';
import '../src/views/columns-view.js';

const TZ = 'Europe/London';
const NOW = new Date('2026-08-10T10:00:00Z'); // 11:00 BST

const ana = {
  id: 'ana', name: 'Ana', color: '#4A9EFF', initials: 'A', todo: 'todo.ana',
  events: [
    { id: 'e1', summary: 'Make bed', start: new Date('2026-08-10T05:00:00Z'), end: new Date('2026-08-10T06:00:00Z'), allDay: false },
    { id: 'e2', summary: 'Brush teeth', start: new Date('2026-08-10T19:00:00Z'), end: new Date('2026-08-10T19:30:00Z'), allDay: false },
  ],
  chores: [
    { id: 'c1', summary: 'Make bed', status: 'needs_action', due: null },
    { id: 'c2', summary: 'Brush teeth', status: 'needs_action', due: null },
  ],
  completedToday: [],
  failures: [],
};

async function mount(tag, props) {
  const el = document.createElement(tag);
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('agenda on another day', () => {
  it('draws the now-line and dims past rows on today', async () => {
    const el = await mount('family-hub-agenda', { model: { people: [ana] }, now: NOW, isToday: true, tz: TZ });
    expect(el.shadowRoot.querySelector('.now')).toBeTruthy();
    expect(el.shadowRoot.querySelectorAll('.agrow.past')).toHaveLength(1);
  });

  it('draws no now-line and dims nothing when paged to another day', async () => {
    const el = await mount('family-hub-agenda', { model: { people: [ana] }, now: NOW, isToday: false, tz: TZ });
    expect(el.shadowRoot.querySelector('.now')).toBeNull();
    expect(el.shadowRoot.querySelectorAll('.agrow.past')).toHaveLength(0);
  });
});

describe('tasks board on another day', () => {
  it('dims the morning group once the morning has passed today', async () => {
    const el = await mount('family-hub-tasks', { model: { people: [ana] }, now: new Date('2026-08-10T13:00:00Z'), isToday: true, tz: TZ });
    expect(el.shadowRoot.querySelector('.grp.past')).toBeTruthy();
  });

  it('dims no group when paged to another day', async () => {
    const el = await mount('family-hub-tasks', { model: { people: [ana] }, now: new Date('2026-08-10T13:00:00Z'), isToday: false, tz: TZ });
    expect(el.shadowRoot.querySelector('.grp.past')).toBeNull();
  });
});

// One behaviour, three views: a tap queues, a second tap cancels, the window
// fires once, and leaving the DOM commits rather than discards.
describe.each([
  ['family-hub-agenda', {}],
  ['family-hub-columns', {}],
  ['family-hub-tasks', {}],
])('tick behaviour in %s', (tag) => {
  const props = () => ({ model: { people: [ana] }, now: NOW, isToday: true, tz: TZ, confirmWindow: 0.05, readOnly: false });
  const box = (el) => el.shadowRoot.querySelector('button.tap');

  it('fills the box on tap and clears it on a second tap without firing', async () => {
    const el = await mount(tag, props());
    const fired = [];
    el.addEventListener('chore-tap', (e) => fired.push(e.detail));
    box(el).click();
    await el.updateComplete;
    expect(box(el).getAttribute('aria-checked')).toBe('true');
    box(el).click();
    await el.updateComplete;
    expect(box(el).getAttribute('aria-checked')).toBe('false');
    expect(fired).toEqual([]);
  });

  it('fires chore-tap once the window expires', async () => {
    const el = await mount(tag, props());
    const fired = [];
    el.addEventListener('chore-tap', (e) => fired.push(e.detail));
    box(el).click();
    await new Promise((r) => setTimeout(r, 120));
    expect(fired).toEqual([{ personId: 'ana', choreId: 'c1' }]);
  });

  it('commits a queued tick when removed from the DOM', async () => {
    const el = await mount(tag, { ...props(), confirmWindow: 30 });
    const fired = [];
    el.addEventListener('chore-tap', (e) => fired.push(e.detail));
    box(el).click();
    el.remove();
    expect(fired).toEqual([{ personId: 'ana', choreId: 'c1' }]);
  });

  it('ignores taps when read-only', async () => {
    const el = await mount(tag, { ...props(), readOnly: true });
    const fired = [];
    el.addEventListener('chore-tap', (e) => fired.push(e.detail));
    box(el).click();
    await new Promise((r) => setTimeout(r, 120));
    expect(fired).toEqual([]);
  });
});

describe('agenda view features', () => {
  const zoo = { id: 'calendar.family:Zoo:2026-08-10T13:00:00.000Z', calendar: 'calendar.family', summary: 'Zoo', start: new Date('2026-08-10T13:00:00Z'), end: new Date('2026-08-10T15:00:00Z'), allDay: false, description: 'Bring hats', location: 'Edinburgh' };
  const ben = { id: 'ben', name: 'Ben', color: '#FF4A87', initials: 'B', todo: 'todo.ben', events: [zoo], chores: [], completedToday: [], failures: [] };

  it('shows a shared event once, naming everyone on it', async () => {
    const el = await mount('family-hub-agenda', { model: { people: [{ ...ana, events: [zoo] }, ben] }, now: NOW, isToday: true, tz: TZ, inlineChores: false });
    const rows = [...el.shadowRoot.querySelectorAll('.agrow')];
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain('Ana');
    expect(rows[0].textContent).toContain('Ben');
  });

  it('expands an event on tap to show its range and description', async () => {
    const el = await mount('family-hub-agenda', { model: { people: [ben] }, now: NOW, isToday: true, tz: TZ });
    expect(el.shadowRoot.querySelector('.detail')).toBeNull();
    el.shadowRoot.querySelector('.agrow').click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector('.detail');
    expect(detail.textContent).toContain('14:00 – 16:00');
    expect(detail.textContent).toContain('Bring hats');
  });

  it('marks a person all done once every chore is complete', async () => {
    const done = { ...ana, events: [], chores: [{ id: 'c1', summary: 'Make bed', status: 'completed' }], completedToday: [] };
    const el = await mount('family-hub-agenda', { model: { people: [done] }, now: NOW, isToday: true, tz: TZ });
    expect(el.shadowRoot.querySelector('.pcard.alldone')).toBeTruthy();
  });

  it('flags an overdue chore', async () => {
    const late = { ...ana, events: [], chores: [{ id: 'c1', summary: 'Homework', status: 'needs_action', due: new Date('2026-08-01T12:00:00Z') }] };
    const el = await mount('family-hub-agenda', { model: { people: [late] }, now: NOW, isToday: true, tz: TZ });
    const row = el.shadowRoot.querySelector('.chore.overdue');
    expect(row).toBeTruthy();
    expect(row.textContent).toContain('overdue');
  });

  it('shows a picture, an icon, and a streak when the model carries them', async () => {
    const pic = { ...ana, picture: '/local/ana.jpg', points: { balance: 10, unit: 'points', streak: 4 } };
    let el = await mount('family-hub-agenda', { model: { people: [pic] }, now: NOW, isToday: true, tz: TZ });
    expect(el.shadowRoot.querySelector('.av img').getAttribute('src')).toBe('/local/ana.jpg');
    expect(el.shadowRoot.querySelector('.streak').textContent).toContain('4 day streak');

    const icon = { ...ana, icon: 'mdi:unicorn' };
    el = await mount('family-hub-agenda', { model: { people: [icon] }, now: NOW, isToday: true, tz: TZ });
    expect(el.shadowRoot.querySelector('.av ha-icon').getAttribute('icon')).toBe('mdi:unicorn');
  });

  it('leaves the shared Family row out of the chores panel', async () => {
    const fam = { id: 'family', name: 'Family', color: '#999', initials: 'F', shared: true, events: [zoo], chores: [], completedToday: [], failures: [] };
    const el = await mount('family-hub-agenda', { model: { people: [ana, fam] }, now: NOW, isToday: true, tz: TZ });
    expect(el.shadowRoot.querySelectorAll('.pcard')).toHaveLength(1);
  });
});

describe('columns view features', () => {
  it('shows the points unit beside the balance', async () => {
    const p = { ...ana, points: { balance: 218, unit: 'stars' } };
    const el = await mount('family-hub-columns', { model: { people: [p] }, tz: TZ, locale: { time_format: '24' } });
    expect(el.shadowRoot.querySelector('.pts').textContent.replace(/\s+/g, ' ')).toContain('218');
    expect(el.shadowRoot.querySelector('.pts span').textContent).toBe('stars');
  });
});
