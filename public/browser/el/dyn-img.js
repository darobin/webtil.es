
import { LitElement, html, css, nothing } from 'lit';
import { Task } from '@lit/task';

customElements.define('atmos-dyn-img', class AtmosDynamicImage extends LitElement {
  #bgTask = new Task(this, {
    task: async ([tile, src]) => {
      const res = await tile.resolvePath(src);
      if (!res.ok) { throw new Error(res.status); }
      const blob = new Blob([res.body], { type: res.headers?.['content-type'] });
      return URL.createObjectURL(blob);
    },
    args: () => [this.tile, this.src],
  });
  static properties = {
    tile: { attribute: false },
    src: {},
    width: {},
    height: {},
    alt: {},
  };
  static styles = [
    css`
      :host {
        display: inline-block;
      }
    `
  ];
  render () {
    if (!this.tile || !this.src) return nothing;
    return this.#bgTask.render({
      pending: () => html`<div>…</div>`,
      complete: (url) => html`<img src=${url} width=${this.width} height=${this.height} alt=${this.alt} part="image">`,
      error: (e) => {
        console.warn(e);
        return nothing;
      },
    });
  }
});
