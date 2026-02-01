
import { LitElement, html, css, nothing } from 'lit';
import { Task } from '@lit/task';

customElements.define('atmos-bg-pic', class AtmosBackgroundPicture extends LitElement {
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
  };
  static styles = [
    css`
      :host {
        display: block;
        aspect-ratio: 16/9;
      }
      div {
        background-image: var(--bg-src);
        background-size: cover;
        background-position: 50%;
      }
    `
  ];
  render () {
    if (!this.tile || !this.src) return nothing;

    return this.#bgTask.render({
      pending: () => html`<div>Loading…</div>`,
      complete: (url) => html`<div style=${`--bg-src: url(${url})`}></div>`,
      error: (e) => {
        console.warn(e);
        return nothing;
      },
    });
  }
});
