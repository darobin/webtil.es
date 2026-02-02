
import { LitElement, html, css, nothing } from 'lit';

customElements.define('atmos-tile-tab', class AtmosTileTab extends LitElement {
  static properties = {
    tile: { attribute: false },
  };
  static styles = [
    css`
      :host {
        display: block;
      }
      .tab {
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .tab atmos-dyn-img::part(image) {
        border-radius: 50%;
      }
    `
  ];
  render () {
    if (!this.tile) return nothing;
    const { manifest } = this.tile;
    if (!manifest) return nothing;
    return html`<div class="tab">
      ${manifest?.icons?.[0]?.src
        ? html`<atmos-dyn-img .tile=${this.tile} src=${manifest.icons[0].src} width="48" height="48" alt="icon"></atmos-dyn-img>`
        : nothing
      }
      <strong>${manifest.name || 'Untitled Tile'}</strong>
    </div>`;
  }
});
