
import express from 'express';
import { createTileLoadingRouter } from '@dasl/tiles/loading-server';

const rel = makeRel(import.meta.url);

const app = express();
app.set('trust proxy', 'loopback'); // need this
app.use((req, res, next) => {
  console.warn(`Hostname: ${req.hostname}`);
  next();
});
app.use(createTileLoadingRouter('webtil.es'));
app.use(express.static(rel('./public')));

app.listen(1503);

// call with makeRel(import.meta.url), returns a function that resolves relative paths
export default function makeRel (importURL) {
  return (pth) => new URL(pth, importURL).toString().replace(/^file:\/\//, '');
}
