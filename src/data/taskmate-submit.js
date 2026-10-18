import { t } from '../i18n.js';

/**
 * Completing a TaskMate chore that needs something a to-do tick cannot carry:
 * a note, a photo or a count. Goes through `taskmate.complete_chore`, which
 * any signed-in user may call for an unlinked child — the same rule
 * TaskMate's own kiosk card works under. `as_parent` is never sent, so the
 * chore's normal approval rules apply (photo chores always need approval).
 */

export function submitPayload(choreId, childId, fields) {
  const asks = fields.asks?.length ? fields.asks : [fields.needs].filter(Boolean);
  const payload = { chore_id: choreId, child_id: childId };
  if (asks.includes('photo')) payload.photo_url = fields.photoUrl;
  if (asks.includes('note')) payload.note = String(fields.note || '').trim();
  if (asks.includes('quantity')) payload.quantity = Math.max(1, Math.round(Number(fields.quantity) || 0));
  return payload;
}

export async function submitChore(hass, choreId, childId, fields) {
  await hass.callService('taskmate', 'complete_chore', submitPayload(choreId, childId, fields));
}

/**
 * Uploads one picture to TaskMate's photo store and returns its URL. A
 * bearer-authenticated multipart POST, refreshing a stale token once on 401 —
 * the same upload TaskMate's own cards make.
 */
export async function uploadPhoto(hass, blob, fetchFn = (...a) => fetch(...a)) {
  const post = () => {
    const token = hass?.auth?.data?.access_token;
    const fd = new FormData();
    fd.append('file', blob, 'evidence.jpg');
    return fetchFn('/api/taskmate/photo', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
  };
  if (hass?.auth?.expired && hass.auth.refreshAccessToken) {
    try { await hass.auth.refreshAccessToken(); } catch { /* retried below */ }
  }
  let resp = await post();
  if (resp.status === 401 && hass?.auth?.refreshAccessToken) {
    await hass.auth.refreshAccessToken();
    resp = await post();
  }
  if (!resp.ok) throw new Error(`upload failed (${resp.status})`);
  const { photo_url: url } = await resp.json();
  if (!url) throw new Error('upload returned no photo');
  return url;
}

/**
 * Shrinks a camera picture before upload: wall-tablet cameras produce
 * multi-megabyte JPEGs and TaskMate caps uploads. Longest side 1280px.
 */
export function shrinkImage(blob, maxSide = 1280) {
  return new Promise((resolve) => {
    if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') { resolve(blob); return; }
    createImageBitmap(blob).then((bmp) => {
      const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bmp.width * scale);
      canvas.height = Math.round(bmp.height * scale);
      canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((out) => resolve(out || blob), 'image/jpeg', 0.82);
    }).catch(() => resolve(blob));
  });
}

/** TaskMate's message where it has one; a household explanation for a refused permission. */
export function friendlyError(err, lang = 'en') {
  const code = err?.code || err?.error?.code;
  const msg = err?.message || err?.error?.message || '';
  if (code === 'unauthorized' || /unauthori[sz]ed/i.test(msg)) return t(lang, 'err_linked');
  return msg || t(lang, 'err_generic');
}
