
import { TileMothership } from '@dasl/tiles/loader';
import { WebXDCTileLoader } from '@dasl/tiles/loader/webxdc';

// Trying out XDC
// It would be great to reuse https://github.com/webxdc/hello for these demos.
const mem = new WebXDCTileLoader();

const tl = new TileMothership({ loadDomain: 'load.webtiles.bast' });
tl.init();
tl.addLoader(mem);

const parent = document.createElement('div');
parent.style.display = 'inline-block';
parent.style.verticalAlign = 'top';
parent.style.padding = '50px';
parent.style.width = '570px';
document.body.append(parent);

// Tetris clone from https://github.com/ArcaneCircle/tetris
const tile = await tl.loadTile(`http:./arcanecircle-tetris.xdc`);
parent.append(await tile.renderCard({
  contentHeight: 600,
}));
