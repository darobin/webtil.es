
import { LitElement, html, css, nothing } from 'lit';

const defaultImg = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect x=%220%22 y=%220%22 width=%22100%22 height=%22100%22 fill=%22%23ff5e5e%22></rect></svg>`;

customElements.define('atmos-profile-tab', class AtmosProfileTab extends LitElement {
  static properties = {
    profile: { attribute: false },
  };
  static styles = [
    css`
      :host {
        display: block;
      }
      .banner {
        display: flex;
        gap: 12px;
        padding: 1rem 1rem 12px 1rem;
      }
      .banner img {
        width: 42px;
        height: 42px;
        border-radius: 50%;
      }
      .names {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
      }
      .displayName {
        font-weight: bold;
      }
      .handle {
        font-size: 0.9rem;
      }
    `
  ];
  render () {
    if (!this.profile) return nothing;
    return html`<div class="banner">
      <div class="avatar"><img src=${this.profile.avatar || defaultImg} alt="profile picture"></div>
      <div class="names">
        <span class="displayName">${this.profile.displayName || 'Anonymous Tiler'}</span>
        <span class="handle">@${this.profile.handle || this.profile.did || '-'}</span>
      </div>
    </div>`;
  }
});
