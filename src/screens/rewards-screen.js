import { LitElement, html, css, nothing } from 'lit';
import { shared, personStyle } from '../styles/theme.js';
import { rewardsFor, claimReward } from '../data/rewards-source.js';
import { logFailure } from '../data/log.js';
import { t } from '../i18n.js';

/**
 * TaskMate's reward catalogue for one child at a time. Redeem asks for a
 * second tap within four seconds, then files a claim for a parent to approve.
 */
export class FamilyHubRewardsScreen extends LitElement {
  static properties = {
    hass: { attribute: false },
    model: { attribute: false },
    rewardsEntity: { attribute: false },
    lang: { attribute: false },
    scheme: { attribute: false },
    _child: { state: true },
    _armed: { state: true },
    _error: { state: true },
  };

  static styles = [
    shared,
    css`
      .toolbar { display: flex; align-items: center; gap: 12px; padding: 2px 0 14px; flex-wrap: wrap; }
      .toolbar .avs { display: flex; gap: 6px; }
      .toolbar .av { cursor: pointer; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
      .rw { background: var(--fh-surface); border-radius: var(--fh-radius); padding: 20px 18px 16px; text-align: center; }
      .rw.off { opacity: .5; }
      .rw .hero { color: var(--pc); }
      .rw .hero ha-icon { --mdc-icon-size: 56px; }
      .rw .t { font-family: var(--fh-serif); font-size: 21px; margin: 8px 0 12px; }
      .rw .bar { height: 32px; border-radius: 999px; background: var(--tint-soft); position: relative; overflow: hidden; display: grid; place-items: center; font-weight: 600; font-size: 14px; }
      .rw .bar i { position: absolute; inset: 0 auto 0 0; width: var(--pct); background: var(--tint); }
      .rw .bar span { position: relative; display: inline-flex; gap: 6px; align-items: center; }
      .rw .bar ha-icon { --mdc-icon-size: 16px; color: var(--fh-star); }
      .rw .go { margin-top: 10px; background: var(--pc); color: #fff; border-radius: 999px; min-height: var(--fh-touch); padding: 0 18px; font-weight: 600; font-size: 13.5px; }
      .rw .go.armed { background: var(--fh-today); }
      .rw .req { margin-top: 12px; font-size: 13px; color: var(--fh-text-2); font-weight: 500; }
      .err { color: var(--error-color, #d64545); font-size: 13px; margin-top: 10px; }
    `,
  ];

  constructor() {
    super();
    this.lang = 'en';
    this.scheme = 'light';
    this._child = null;
    this._armed = null;
    this._error = '';
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._armTimer);
  }

  _children() {
    return (this.model?.people || []).filter((p) => p.taskmateChildId && !p.shared);
  }

  _selected() {
    const kids = this._children();
    return kids.find((p) => p.id === this._child) || kids[0] || null;
  }

  async _redeem(reward, person) {
    if (this._armed !== reward.id) {
      this._armed = reward.id;
      clearTimeout(this._armTimer);
      this._armTimer = setTimeout(() => { this._armed = null; }, 4000);
      return;
    }
    clearTimeout(this._armTimer);
    this._armed = null;
    this._error = '';
    try {
      await claimReward(this.hass, reward.id, person.taskmateChildId);
    } catch (err) {
      logFailure(`reward:${reward.id}`, `could not claim ${reward.name}`, err);
      this._error = err?.message || String(err);
    }
  }

  render() {
    const kids = this._children();
    const person = this._selected();
    if (!person) return html`<div class="empty"><h2>${t(this.lang, 'rewards')}</h2>${t(this.lang, 'no_rewards')}</div>`;
    const rewards = rewardsFor(this.hass, this.rewardsEntity, person);
    return html`
      <div class="toolbar">
        <div class="avs">
          ${kids.map((p) => html`<button class="av ${p.id === person.id ? '' : 'off'}" style=${personStyle(p.color, this.scheme)} title=${p.name}
              @click=${() => { this._child = p.id; this._armed = null; }}>${p.picture ? html`<img src=${p.picture} alt="" />` : p.initials}</button>`)}
        </div>
        <span class="muted">${person.name} · ⭐ ${t(this.lang, 'balance', { n: person.points?.balance ?? 0 })}</span>
      </div>
      ${rewards.length ? html`<div class="grid">${rewards.map((r) => this._card(r, person))}</div>`
        : html`<div class="empty">${t(this.lang, 'no_rewards')}</div>`}
      ${this._error ? html`<div class="err">${this._error}</div>` : nothing}
    `;
  }

  _card(r, person) {
    const canRedeem = r.affordable && r.available && !r.pending;
    const armed = this._armed === r.id;
    return html`<div class="rw ${r.available ? '' : 'off'}" style=${personStyle(person.color, this.scheme)}>
      <div class="hero"><ha-icon icon=${r.icon}></ha-icon></div>
      <div class="t">${r.name}</div>
      <div class="bar" style="--pct:${r.pct}%"><i></i><span><ha-icon icon="mdi:star"></ha-icon>${Math.min(r.balance, r.cost)}/${r.cost}</span></div>
      ${r.pending ? html`<div class="req">${t(this.lang, 'requested')}</div>` : nothing}
      ${canRedeem ? html`<button class="go ${armed ? 'armed' : ''}" @click=${() => this._redeem(r, person)}>${armed ? t(this.lang, 'tap_again') : t(this.lang, 'redeem')}</button>` : nothing}
    </div>`;
  }
}

customElements.define('family-hub-rewards-screen', FamilyHubRewardsScreen);
