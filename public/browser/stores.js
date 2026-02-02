
import { TileMothership } from '@dasl/tiles/loader';
import { ATTileLoader } from '@dasl/tiles/loader/at';
import { atom } from 'nanostores';

// https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=robin.berjon.com
async function fetchFromBsky (query, params) {
  const url = new URL(`https://public.api.bsky.app/xrpc/${query}`);
  const prm = url.searchParams;
  Object.entries(params).forEach(([k, v]) => prm.set(k, v));
  return await fetch(url.toString());
}
async function resolveHandle (handle) {
  const res = await fetchFromBsky('com.atproto.identity.resolveHandle', { handle });
  if (!res.ok) return;
  const { did } = await res.json();
  return did;
}
async function getProfile (actor) {
  const res = await fetchFromBsky('app.bsky.actor.getProfile', { actor });
  if (!res.ok) return {};
  return await res.json();
}
async function didifyURL (url) {
  if (/^at:\/\/did:/.test(url)) return url;
  const [repo, collection, rkey] = url.replace(/^at:\/\//, '').split('/');
  const did = await resolveHandle(repo);
  console.warn(`DIDIFIED: at://${did}/${collection}/${rkey}`);
  return `at://${did}/${collection}/${rkey}`;
}

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
  const tile = await tl.loadTile(await didifyURL(url));
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
$currentTile.subscribe((tile) => {
  setTitle(tile?.manifest?.name);
});

export const $profile = atom();
$currentTile.subscribe((tile) => {
  if (tile) {
    const [actor, ] = tile.url.replace(/^at:\/\//, '').split('/');
    getProfile(actor).then(p => $profile.set(p));
  }
});
