
import { LitElement, html, css, nothing } from 'lit';

customElements.define('atmos-tile-card', class AtmosTileCard extends LitElement {
  static properties = {
    tile: { attribute: false },
  };
  static styles = [
    css`
      :host {
        display: block;
        max-width: 566px;
      }
      #card {
        border: 1px solid lightgrey;
        border-radius: 0.4rem;
        cursor: pointer;
      }
      #card:hover {
        border-color: #666;
      }
      p {
        margin: 0rem 1rem 1rem 1rem;
      }
    `
  ];
  render () {
    if (!this.tile) return nothing;
    const { manifest } = this.tile;
    if (!manifest) return nothing;
    return html`<div id="card">
      ${manifest?.screenshots?.[0]?.src
        ? html`<atmos-bg-pic .tile=${this.tile} src=${manifest.screenshots[0].src}></atmos-bg-pic>`
        : nothing
      }
      <atmos-tile-tab .tile=${this.tile}></atmos-tile-tab>
      ${manifest?.description
        ? html`<p>${manifest.description}</p>`
        : nothing
      }
    </div>`;
  }
});
