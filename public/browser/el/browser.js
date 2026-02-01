
import { LitElement, html, css, nothing } from 'lit';
import { StoreController } from "@nanostores/lit";
import { $title, $url, $currentTile, $profile, $error, error } from '../stores.js';

customElements.define('atmos-browser', class AtmosBrowser extends LitElement {
  #title = new StoreController(this, $title);
  #url = new StoreController(this, $url);
  #currentTile = new StoreController(this, $currentTile);
  #profile = new StoreController(this, $profile);
  #error = new StoreController(this, $error);
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
    `
  ];
  handleSubmit (ev) {
    ev.preventDefault();
    const url = ev.currentTarget.querySelector('input[name="url"]')?.value;
    if (!url) return error('URL is empty!');
    if (!/^at:\/\/[^/]+\/ing\.dasl\.masl\/\w+$/.test(url)) {
      return error(`Syntax error, expected "at://<didOrHandle>/ing.dasl.masl/<tid>"`);
    }
    window.location.hash = `#url=${url}`;
  }
  render () {
    let body = nothing;
    if (this.#error.value) body = html`<div class="error">${this.#error.value}</div>`;
    else if (this.#currentTile.value) {
      body = html`<atmos-profile-card .profile=${this.#profile.value}>
        <atmos-tile-card .tile=${this.#currentTile.value}></atmos-tile-card>
      </atmos-profile-card>`;
    }
    else body = html`<div class="nothing">ATMOS ready to sail the skies.</div>`;
    return html`<div id="browser">
      <h2>${this.#title.value}</h2>
      <form @submit=${this.handleSubmit}>
        <input type="text" name="url" value=${this.#url.value}>
      </form>
      <div id="render-zone">${body}</div>
    </div>`;
  }
});
