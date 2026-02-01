
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
      .title {
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .title atmos-dyn-img::part(image) {
        border-radius: 50%;
      }
      p {
        margin: 0rem 1rem 1rem 1rem;
      }
    `
  ];
  handleClick () {
    // XXX show the tile
    // - want height to grow animatedly
    // options?.contentHeight ||
    // this.#manifest?.sizing?.height ||
    // Math.max(card.offsetHeight, 300)
  }
  render () {
    if (!this.tile) return nothing;
    const { manifest } = this.tile;
    if (!manifest) return nothing;
    return html`<div id="card" @click=${this.handleClick}>
      ${manifest?.screenshots?.[0]?.src
        ? html`<atmos-bg-pic .tile=${this.tile} src=${manifest.screenshots[0].src}></atmos-bg-pic>`
        : nothing
      }
      <div class="title">
        ${manifest?.icons?.[0]?.src
          ? html`<atmos-dyn-img .tile=${this.tile} src=${manifest.icons[0].src} width="48" height="48" alt="icon"></atmos-dyn-img>`
          : nothing
        }
        <strong>${manifest.name || 'Untitled Tile'}</strong>
      </div>
      ${manifest?.description
        ? html`<p>${manifest.description}</p>`
        : nothing
      }
    </div>`;
  }
});
