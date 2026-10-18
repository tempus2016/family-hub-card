// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import '../src/screens/timer-sheet.js';

const task = (timer = null) => ({ id: 't1', summary: 'Practise piano', needs: 'timer', rateMinutes: 5, ratePoints: 10, capMinutes: 30, timer });

async function open(t) {
  const el = document.createElement('family-hub-timer-sheet');
  el.lang = 'en';
  el.now = () => new Date('2026-10-18T10:05:00Z');
  document.body.appendChild(el);
  const actions = [];
  el.addEventListener('timer-action', (e) => actions.push(e.detail.action));
  el.show({ personName: 'Ana', task: t });
  await el.updateComplete;
  return { el, actions, $: (s) => el.shadowRoot.querySelector(s), $$: (s) => [...el.shadowRoot.querySelectorAll(s)] };
}

describe('timer sheet', () => {
  it('offers Start when there is no session, with the rate spelled out', async () => {
    const { $, actions } = await open(task());
    expect($('.clock').textContent.trim()).toBe('0:00');
    expect($('.sheet').textContent).toMatch(/10 .*every 5 min/);
    $('button.start').click();
    expect(actions).toEqual(['start']);
    expect($('button.finish')).toBeNull();
  });

  it('counts a running timer up from the banked total and offers Pause and Finish', async () => {
    const { $, actions } = await open(task({ state: 'running', total: 120, segmentStart: '2026-10-18T10:00:00Z' }));
    expect($('.clock').textContent.trim()).toBe('7:00');
    expect($('.earn').textContent).toMatch(/10/);
    $('button.pause').click();
    $('button.finish').click();
    expect(actions).toEqual(['pause', 'finish']);
  });

  it('offers Resume while paused', async () => {
    const { $, actions } = await open(task({ state: 'paused', total: 900, segmentStart: '' }));
    expect($('.clock').textContent.trim()).toBe('15:00');
    $('button.start').click();
    expect(actions).toEqual(['start']);
    expect($('button.start').textContent).toMatch(/Resume/);
  });

  it('follows the task when the session changes underneath it', async () => {
    const { el, $ } = await open(task());
    el.task = task({ state: 'running', total: 0, segmentStart: '2026-10-18T10:04:00Z' });
    await el.updateComplete;
    expect($('.clock').textContent.trim()).toBe('1:00');
  });

  it('shows an error from the card and closes on done', async () => {
    const { el, $ } = await open(task());
    el.fail('Daily cap reached (30 min)');
    await el.updateComplete;
    expect($('.err').textContent).toMatch(/cap/);
    el.done();
    await el.updateComplete;
    expect($('.sheet')).toBeNull();
  });
});

describe('timer sheet wording', () => {
  it('says 1 point, not 1 points', async () => {
    const { $ } = await open({ ...task({ state: 'paused', total: 60, segmentStart: '' }), rateMinutes: 1, ratePoints: 1, capMinutes: 0 });
    expect($('.earn').textContent.trim()).toBe('1 point so far');
    expect($('.rate').textContent).toMatch(/1 point every 1 min/);
  });
});
