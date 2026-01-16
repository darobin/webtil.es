
import { TileMothership } from '@dasl/tiles/loader';
import { ATTileLoader } from '@dasl/tiles/loader/at';

// AT Tiles!
const at = new ATTileLoader();

const tl = new TileMothership({ loadDomain: 'load.webtiles.bast' });
tl.init();
tl.addLoader(at);

const parent = document.createElement('div');
parent.style.display = 'inline-block';
parent.style.verticalAlign = 'top';
parent.style.padding = '50px';
parent.style.width = '570px';
document.body.append(parent);

// const tile = await tl.loadTile(`at://did:plc:izttpdp3l6vss5crelt5kcux/ing.dasl.masl/3mceykgxbkk2r`); // Rick
const tile = await tl.loadTile(`at://did:plc:izttpdp3l6vss5crelt5kcux/ing.dasl.masl/3mcjwwoqjqs2v`); // Minesweeper
// const tile = await tl.loadTile(`at://did:plc:izttpdp3l6vss5crelt5kcux/ing.dasl.masl/3mchoygjzss2z`); // Minesweeper Fake
console.warn(`Tile`, tile);
parent.append(await tile.renderCard());
