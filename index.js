
import process from 'node:process';
import express from 'express';
import { createTileLoadingRouter } from '@dasl/tile-server';

// The host tile origins are minted under: load.<host> bounces every load onto
// a fresh <random>.<host>. Production by default; behind the local front this
// is webtiles.bast (see service.json and public/browser/stores.js).
const TILES_HOST = process.env.TILES_HOST || 'webtil.es';
const PORT = Number(process.env.PORT) || 1503;

const rel = makeRel(import.meta.url);

const app = express();
// req.hostname and req.protocol come from the X-Forwarded-* headers the front
// sets, so the proxy has to be trusted: the supramundane front reaches us over
// the docker network (a private range), a local Caddy over loopback.
app.set('trust proxy', 'loopback, uniquelocal');
app.disable('x-powered-by');

// The front's shared nice-headers are off for this service ("headers": false
// in service.json): its X-Frame-Options sameorigin would stop the mothership
// on webtil.es from framing the tile origins on *.webtil.es, which is the
// whole point. HSTS is the one header worth keeping on everything; the tile
// runtime under /.well-known/web-tiles/ sets its own hardened set, and the
// site gets the rest of the front's defaults below.
app.use((req, res, next) => {
  res.set('strict-transport-security', 'max-age=63072000; preload');
  next();
});
app.use(createTileLoadingRouter(TILES_HOST));
app.use(express.static(rel('./public'), {
  setHeaders (res) {
    res.set({
      'tk': 'N',
      'referrer-policy': 'origin-when-cross-origin',
      'permissions-policy': 'interest-cohort=(), browsing-topics=()',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'sameorigin',
      'x-robots-tag': 'noai, noimageai',
    });
  },
}));

app.listen(PORT, () => console.log(`webtil.es: serving ${TILES_HOST} and *.${TILES_HOST} on :${PORT}`));

// call with makeRel(import.meta.url), returns a function that resolves relative paths
function makeRel (importURL) {
  return (pth) => new URL(pth, importURL).toString().replace(/^file:\/\//, '');
}
