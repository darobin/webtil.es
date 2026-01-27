
import { TileMothership } from '@dasl/tiles/loader';
import { ATTileLoader } from '@dasl/tiles/loader/at';

// AT Tiles!
const loadDomain = (/localhost|\.bast/.test(window.location.hostname)) ? 'load.webtiles.bast' : 'load.webtil.es';
const at = new ATTileLoader();
const tl = new TileMothership({ loadDomain });
tl.init();
tl.addLoader(at);

// XXX
//  - respond to hash on load and change
//  - input causes hash to change
//  - load not just the tile, but also details about the user
//  - render in a way that shows name, avatar, etc. so it's nice, like a post
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
