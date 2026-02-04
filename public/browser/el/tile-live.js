
import { LitElement, html, css, nothing } from 'lit';

customElements.define('atmos-tile-live', class AtmosTileLive extends LitElement {
  static properties = {
    tile: { attribute: false },
    height: {},
  };
  static styles = [
    css`
      :host {
        display: block;
      }
      iframe {
        display: block;
        width: 100%;
        height: 100%;
        border: none;
      }
    `
  ];
  firstUpdated () {
    if (!this.tile) {
      console.warn(`Whooooops tile should be available already.`);
      return;
    }
    this.tile.attachIframe(this.renderRoot.querySelector('iframe'));
  }
  render () {
    if (!this.tile) return nothing;
    console.warn(this.tile);
    return html`<iframe src=${this.tile.getLoadSource()}></iframe>`;
  }
});
