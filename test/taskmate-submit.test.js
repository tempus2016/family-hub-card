import { describe, it, expect, vi } from 'vitest';
import { submitPayload, submitChore, uploadPhoto, friendlyError } from '../src/data/taskmate-submit.js';

describe('submitPayload', () => {
  it('sends only the field the chore needs', () => {
    expect(submitPayload('c1', 'k1', { needs: 'quantity', quantity: 12 })).toEqual({ chore_id: 'c1', child_id: 'k1', quantity: 12 });
    expect(submitPayload('c1', 'k1', { needs: 'note', note: '  Tidied the shed ' })).toEqual({ chore_id: 'c1', child_id: 'k1', note: 'Tidied the shed' });
    expect(submitPayload('c1', 'k1', { needs: 'photo', photoUrl: '/api/taskmate/photo/a.jpg' })).toEqual({ chore_id: 'c1', child_id: 'k1', photo_url: '/api/taskmate/photo/a.jpg' });
  });

  it('never sends as_parent, so the child-side approval rules apply', () => {
    expect(submitPayload('c1', 'k1', { needs: 'note', note: 'x' })).not.toHaveProperty('as_parent');
  });
});

describe('submitChore', () => {
  it('calls taskmate.complete_chore', async () => {
    const hass = { callService: vi.fn(async () => {}) };
    await submitChore(hass, 'c1', 'k1', { needs: 'quantity', quantity: 3 });
    expect(hass.callService).toHaveBeenCalledWith('taskmate', 'complete_chore', { chore_id: 'c1', child_id: 'k1', quantity: 3 });
  });
});

describe('uploadPhoto', () => {
  const blob = new Blob(['x'], { type: 'image/jpeg' });

  it('posts the file with the bearer token and returns the photo url', async () => {
    const fetchFn = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ photo_url: '/api/taskmate/photo/a.jpg' }) }));
    const hass = { auth: { data: { access_token: 'tok' } } };
    expect(await uploadPhoto(hass, blob, fetchFn)).toBe('/api/taskmate/photo/a.jpg');
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('/api/taskmate/photo');
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer tok');
    expect(init.body.get('file')).toBeTruthy();
  });

  it('refreshes a stale token once on 401 and retries', async () => {
    let n = 0;
    const fetchFn = vi.fn(async () => (++n === 1 ? { ok: false, status: 401 } : { ok: true, status: 200, json: async () => ({ photo_url: '/p.jpg' }) }));
    const hass = { auth: { data: { access_token: 'old' }, refreshAccessToken: vi.fn(async function () { hass.auth.data.access_token = 'new'; }) } };
    expect(await uploadPhoto(hass, blob, fetchFn)).toBe('/p.jpg');
    expect(hass.auth.refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(fetchFn.mock.calls[1][1].headers.Authorization).toBe('Bearer new');
  });

  it('throws a readable error when the upload is refused', async () => {
    const fetchFn = vi.fn(async () => ({ ok: false, status: 413 }));
    await expect(uploadPhoto({ auth: { data: {} } }, blob, fetchFn)).rejects.toThrow(/413/);
  });
});

describe('friendlyError', () => {
  it('explains a refused permission in household terms', () => {
    expect(friendlyError({ code: 'unauthorized', message: 'Unauthorized' }, 'en')).toMatch(/linked/i);
  });

  it('passes TaskMate’s own message through', () => {
    expect(friendlyError({ message: 'Say how many pages you did.' }, 'en')).toBe('Say how many pages you did.');
  });
});

describe('submitPayload with several fields', () => {
  it('sends every field the chore asks for', () => {
    expect(submitPayload('c1', 'k1', { asks: ['photo', 'note'], photoUrl: '/p.jpg', note: 'Done it' }))
      .toEqual({ chore_id: 'c1', child_id: 'k1', photo_url: '/p.jpg', note: 'Done it' });
  });
});
