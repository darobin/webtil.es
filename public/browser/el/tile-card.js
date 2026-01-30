
import { LitElement, html, css, nothing } from 'lit';
import { StoreController } from "@nanostores/lit";
import { error } from '../stores.js';

customElements.define('atmos-tile-card', class AtmosTileCard extends LitElement {
  static properties = {
    tile: { attribute: false },
  };
  static styles = [
    css`
      :host {
        display: block;
      }
    `
  ];
  render () {
    if (!this.tile) return nothing;
    const { manifest } = this.tile;
    if (!manifest) return nothing;
    return html`<div id="card">
      <span>${manifest.name || 'Untitled Tile'}</span>
    </div>`;
  }
});
