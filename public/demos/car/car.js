
import { TileMothership } from '@dasl/tiles/loader';
import { CARTileLoader } from '@dasl/tiles/loader/car';

// CAR Tiles!
const car = new CARTileLoader();

const tl = new TileMothership({ loadDomain: 'load.webtiles.bast' });
tl.init();
tl.addLoader(car);

const parent = document.createElement('div');
parent.style.display = 'inline-block';
parent.style.verticalAlign = 'top';
parent.style.padding = '50px';
parent.style.width = '570px';
document.body.append(parent);

// XXX demo will break on https
const tile = await tl.loadTile(`http:./rick.tile`);
console.warn(`Tile`, tile);
parent.append(await tile.renderCard({
  contentHeight: 600,
}));
