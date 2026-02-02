
import { LitElement, html, css, nothing } from 'lit';
import { StoreController } from "@nanostores/lit";
import { $title, $url, $currentTile, $profile, $error, error } from '../stores.js';

customElements.define('atmos-browser', class AtmosBrowser extends LitElement {
  #title = new StoreController(this, $title);
  #url = new StoreController(this, $url);
  #currentTile = new StoreController(this, $currentTile);
  #profile = new StoreController(this, $profile);
  #error = new StoreController(this, $error);
  static properties = {
    mode: { attribute: false },
  };
  static styles = [
    css`
      :host {
        display: block;
      }
      #browser {
        border: 1px solid var(--atmos-mid-fill);
      }
      h2 {
        background-color: var(--atmos-invert-bg);
        text-align: center;
        color: var(--atmos-invert-fg);
        font-weight: 100;
        margin: 0;
        padding: var(--atmos-space-small);
      }
      h2 atmos-dyn-img {
        vertical-align: middle;
      }
      h2 atmos-dyn-img::part(image) {
        border-radius: 4px;
      }
      form {
        background: var(--atmos-shaded);
        border-bottom: 1px solid var(--atmos-mid-fill);
        padding: var(--atmos-space-mid);
        display: flex;
        gap: var(--atmos-space-mid);
      }
      form input[name="url"] {
        flex-grow: 1;
        font-family: inherit;
        font-size: inherit;
        padding: var(--atmos-space-mid);
        border-radius: 4px;
        border: 1px solid var(--atmos-invert-bg);
      }
      form input[name="url"]:focus {
        outline: 2px solid var(--green);
      }
      atmos-tile-card {
        margin: 0 auto;
      }
      .content.card {
        padding: 1rem;
      }
      .context-banner.live atmos-profile-tab {
        border-bottom: 1px solid #666;
        border-right: 1px solid #666;
      }
      .context-banner.live atmos-tile-tab {
        border-bottom: 1px solid lightgrey;
      }
    `
  ];
  constructor () {
    super();
    this.mode = 'card';
  }
  handleSubmit (ev) {
    ev.preventDefault();
    const url = ev.currentTarget.querySelector('input[name="url"]')?.value;
    if (!url) return error('URL is empty!');
    if (!/^at:\/\/[^/]+\/ing\.dasl\.masl\/\w+$/.test(url)) {
      return error(`Syntax error, expected "at://<didOrHandle>/ing.dasl.masl/<tid>"`);
    }
    window.location.hash = `#url=${url}`;
  }
  handleClick () {
    this.mode = 'live';
  }
  render () {
    let body = nothing;
    if (this.#error.value) body = html`<div class="error">${this.#error.value}</div>`;
    else if (this.#currentTile.value) {
      body = html`<div class=${`context-banner ${this.mode}`}>
          <atmos-profile-tab .profile=${this.#profile.value}></atmos-profile-tab>
          ${
            this.mode === 'live'
            ? html`<atmos-tile-tab .tile=${this.#currentTile.value}></atmos-tile-tab>`
            : nothing
          }
        </div>
        <div class=${`content ${this.mode}`}>
          <atmos-tile-card .tile=${this.#currentTile.value} @click=${this.handleClick}></atmos-tile-card>
        </div>
      `;
    }
    else body = html`<div class="nothing">ATMOS ready to sail the skies.</div>`;
    return html`<div id="browser">
      <h2>
        ${this.#currentTile.value?.manifest?.icons?.[0]?.src
          ? html`<atmos-dyn-img .tile=${this.#currentTile.value} src=${this.#currentTile.value.manifest.icons[0].src} width="24" height="24" alt="icon"></atmos-dyn-img>`
          : nothing
        }
        ${this.#title.value}
      </h2>
      <form @submit=${this.handleSubmit}>
        <input type="text" name="url" value=${this.#url.value}>
      </form>
      <div id="render-zone">${body}</div>
    </div>`;
  }
});
