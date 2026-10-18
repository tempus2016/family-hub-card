// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import '../src/screens/submit-sheet.js';

async function open(task, over = {}) {
  const el = document.createElement('family-hub-submit-sheet');
  el.lang = 'en';
  document.body.appendChild(el);
  const submit = vi.fn(async () => {});
  el.addEventListener('submit-chore', (e) => submit(e.detail));
  el.show({ personName: 'Ana', task, ...over });
  await el.updateComplete;
  return { el, submit, $: (s) => el.shadowRoot.querySelector(s) };
}

describe('submit sheet: quantity', () => {
  const task = { id: 'c1', summary: 'Read', needs: 'quantity', unit: 'pages', max: 40 };

  it('starts at one, steps within the cap and submits the number', async () => {
    const { el, submit, $ } = await open(task);
    expect($('.qty').textContent.trim()).toBe('1');
    for (let i = 0; i < 5; i += 1) $('button.inc').click();
    await el.updateComplete;
    expect($('.qty').textContent.trim()).toBe('6');
    $('button.go').click();
    await el.updateComplete;
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ choreId: 'c1', needs: 'quantity', quantity: 6 }));
  });

  it('never goes below one or above the cap', async () => {
    const { el, $ } = await open({ ...task, max: 2 });
    $('button.dec').click(); $('button.dec').click();
    await el.updateComplete;
    expect($('.qty').textContent.trim()).toBe('1');
    for (let i = 0; i < 5; i += 1) $('button.inc').click();
    await el.updateComplete;
    expect($('.qty').textContent.trim()).toBe('2');
  });

  it('names the unit', async () => {
    const { $ } = await open(task);
    expect($('.sheet').textContent).toMatch(/pages/);
  });
});

describe('submit sheet: note', () => {
  const task = { id: 'c3', summary: 'Something extra', needs: 'note' };

  it('will not submit an empty note', async () => {
    const { el, $ } = await open(task);
    expect($('button.go').disabled).toBe(true);
    const ta = $('textarea');
    ta.value = 'Swept the patio';
    ta.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect($('button.go').disabled).toBe(false);
  });

  it('submits the typed note', async () => {
    const { el, submit, $ } = await open(task);
    const ta = $('textarea');
    ta.value = 'Swept the patio';
    ta.dispatchEvent(new Event('input'));
    await el.updateComplete;
    $('button.go').click();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ needs: 'note', note: 'Swept the patio' }));
  });
});

describe('submit sheet: photo', () => {
  const task = { id: 'c4', summary: 'Tidy room', needs: 'photo' };

  it('offers the camera and uploads the picked picture before submitting', async () => {
    const upload = vi.fn(async () => '/api/taskmate/photo/x.jpg');
    const { el, submit, $ } = await open(task, { upload });
    const input = $('input[type="file"]');
    expect(input.getAttribute('accept')).toBe('image/*');
    expect(input.getAttribute('capture')).toBe('environment');
    await el._picked(new Blob(['x'], { type: 'image/jpeg' }));
    await el.updateComplete;
    expect(upload).toHaveBeenCalled();
    expect($('img.preview')).toBeTruthy();
    $('button.go').click();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ needs: 'photo', photoUrl: '/api/taskmate/photo/x.jpg' }));
  });

  it('shows the error and stays open when the upload fails', async () => {
    const upload = vi.fn(async () => { throw new Error('upload failed (413)'); });
    const { el, $ } = await open(task, { upload });
    await el._picked(new Blob(['x']));
    await el.updateComplete;
    expect($('.err').textContent).toMatch(/413/);
    expect($('button.go').disabled).toBe(true);
  });
});

describe('submit sheet: result', () => {
  it('closes on success and shows an error from the card on failure', async () => {
    const { el, $ } = await open({ id: 'c3', summary: 'X', needs: 'note' });
    el.fail('This child is linked to their own account.');
    await el.updateComplete;
    expect($('.err').textContent).toMatch(/linked/);
    el.done();
    await el.updateComplete;
    expect($('.sheet')).toBeNull();
  });
});

describe('submit sheet: photo and note together', () => {
  it('needs both before Done is enabled, and sends both', async () => {
    const upload = vi.fn(async () => '/p.jpg');
    const { el, submit, $ } = await open({ id: 'c5', summary: 'Garden', needs: 'photo', asks: ['photo', 'note'] }, { upload });
    await el._picked(new Blob(['x']));
    await el.updateComplete;
    expect($('button.go').disabled).toBe(true);
    const ta = $('textarea');
    ta.value = 'Weeded the bed';
    ta.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect($('button.go').disabled).toBe(false);
    $('button.go').click();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ asks: ['photo', 'note'], photoUrl: '/p.jpg', note: 'Weeded the bed' }));
  });
});
