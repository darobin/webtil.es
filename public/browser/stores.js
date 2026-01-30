
import { TileMothership } from '@dasl/tiles/loader';
import { ATTileLoader } from '@dasl/tiles/loader/at';
import { atom } from 'nanostores';

// AT Tiles!
const loadDomain = (/localhost|\.bast/.test(window.location.hostname)) ? 'load.webtiles.bast' : 'load.webtil.es';
const at = new ATTileLoader();
const tl = new TileMothership({ loadDomain });
tl.init();
tl.addLoader(at);

export const $url = atom();
export async function navigate (url) {
  if (!url) return;
  $error.set(null);
  $url.set(url);
  const tile = await tl.loadTile(url);
  console.warn(`Tile`, tile);
  $currentTile.set(tile);
}
export function navigateFromHash () {
  const { hash } = window.location;
  const params = {};
  hash
    .replace(/^#/, '')
    .split('&')
    .filter(Boolean)
    .forEach(prm => {
      const [k, v] = prm.split(/=/, 2);
      params[k] = (typeof v === 'undefined') ? true : v;
    })
  ;
  navigate(params.url);
}

export const $currentTile = atom();

export const $error = atom();
export function error (msg) {
  $error.set(msg);
}

export const defaultTitle = 'ATMOS';
export const $title = atom(defaultTitle);
export function setTitle (title) {
  $title.set(title || defaultTitle);
}
const titleChangeHandler = (ev) => setTitle(ev.title);
$currentTile.subscribe((tile, oldTile) => {
  if (tile) tile.addEventListener('title-change', titleChangeHandler);
  if (oldTile) tile.removeEventListener('title-change', titleChangeHandler);
});
