
import { TileMothership } from '@dasl/tiles/loader';
import { ATTileLoader } from '@dasl/tiles/loader/at';
import { atom } from 'nanostores';

// AT Tiles!
const loadDomain = (/localhost|\.bast/.test(window.location.hostname)) ? 'load.webtiles.bast' : 'load.webtil.es';
const at = new ATTileLoader();
const tl = new TileMothership({ loadDomain });
tl.init();
tl.addLoader(at);

// Stores
const $url = atom();
function navigate (url) {
  if (!url) return;
  $error.set(null);
  $url.set(url);
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


const parent = document.createElement('div');
parent.style.display = 'inline-block';
parent.style.verticalAlign = 'top';
parent.style.padding = '50px';
parent.style.width = '570px';
document.body.append(parent);

// const tile = await tl.loadTile(`at://did:plc:izttpdp3l6vss5crelt5kcux/ing.dasl.masl/3mceykgxbkk2r`); // Rick
const tile = await tl.loadTile(`at://did:plc:izttpdp3l6vss5crelt5kcux/ing.dasl.masl/3mcjwwoqjqs2v`); // Minesweeper
console.warn(`Tile`, tile);
parent.append(await tile.renderCard());
