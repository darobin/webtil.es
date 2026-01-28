
import { TileMothership } from '@dasl/tiles/loader';
import { ATTileLoader } from '@dasl/tiles/loader/at';
import { atom, effect } from 'nanostores';

// AT Tiles!
const loadDomain = (/localhost|\.bast/.test(window.location.hostname)) ? 'load.webtiles.bast' : 'load.webtil.es';
const at = new ATTileLoader();
const tl = new TileMothership({ loadDomain });
tl.init();
tl.addLoader(at);

// Stores
const $url = atom();
const $currentTile = atom();
async function navigate (url) {
  if (!url) return;
  $error.set(null);
  $url.set(url);
  const tile = await tl.loadTile(url);
  console.warn(`Tile`, tile);
  $currentTile.set(tile);
}
function navigateFromHash () {
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
const $error = atom();
function error (msg) {
  $error.set(msg);
}
const defaultTitle = 'ATMOS';
const $title = atom(defaultTitle);
function setTitle (title) {
  $title.set(title || defaultTitle);
}

window.addEventListener('hashchange', navigateFromHash);
window.addEventListener('load', () => {
  const form = document.querySelector('#browser > form');
  const urlBar = form.querySelector('input[name="url"]')
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const url = urlBar.value;
    if (!url) return error('URL is empty!');
    if (!/^at:\/\/[^/]+\/ing\.dasl\.masl\/\w+$/.test(url)) {
      return error(`Syntax error, expected "at://<didOrHandle>/ing.dasl.masl/<tid>"`);
    }
    window.location.hash = `#url=${url}`;
  });
  $url.subscribe(val => urlBar.value = val || '');
  $title.subscribe(val => document.querySelector('#browser > h2').textContent = val);
  const titleChangeHandler = (ev) => setTitle(ev.title);
  $currentTile.subscribe((tile, oldTile) => {
    if (tile) tile.addEventListener('title-change', titleChangeHandler);
    if (oldTile) tile.removeEventListener('title-change', titleChangeHandler);
  });
  const rz = document.querySelector('#render-zone');
  // XXX THIS DOESN'T WORK
  effect([$error, $currentTile], async (err, tile) => {
    console.warn(`rndr`, err, tile);
    rz.textContent = null;
    if (err) el('div', { class: 'error' }, [err], rz);
    else if (tile) {
      // XXX
      // This is supposed to have a lot more, like the person and all
      el('div', { class: 'tile-container' }, [await tile.renderCard()], rz);
    }
    else el('div', { class: 'nothing' }, ['ATMOS ready to sail the skies.'], rz);
    return () => {};
  });
  navigateFromHash();
});

// XXX
//  x respond to hash on load and change
//  x input causes hash to change
//  - load not just the tile, but also details about the user (Tile API?)
//  - render in a way that shows name, avatar, etc. so it's nice, like a post
//    - also show tile title and icon when content is rendered
//  - handle errors (not found or loading the wrong kind of data) gracefully
//  x loadDomain should depend on whether we're loaded locally or not
//  - include a bit of text about where to find more info
//  - include a view of the data as well, a bit like PDSLS
//  - minimal wrapper with link back to root, like on DASL specs
//  - style to make cards and such look nice
//  - examples:
//    - of the bad blocked stuff
//    - with screenshots!
//  - write spec (AT and CAR)
//  - announce and link to implementation + browser
//  - update @dasl/tiles with latest changes

export function el (n, attrs, kids, p) {
  const e = document.createElement(n);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (v == null) return;
    if (k === 'style') {
      Object.entries(v).forEach(([prop, value]) => {
        const snake = prop
          .split('-')
          .map((part, idx) => idx ? part.charAt(0).toUpperCase() + part.slice(1) : part)
          .join('');
        e.style[snake] = value;
      });
      return;
    }
    e.setAttribute(k, v);
  });
  (kids || []).forEach((n) => {
    if (typeof n === 'string') e.append(txt(n));
    else e.append(n);
  });
  if (p) p.append(e);
  return e;
}

function txt (str) {
  return document.createTextNode(str);
}
