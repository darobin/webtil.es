
# webtil.es

The tiles site: the [DASL web tiles](https://dasl.ing/) browser and tutorial, plus
the loader that isolates every tile on its own origin.

## How it works

`index.js` is a small Express app. It serves `public/` and mounts
[`@dasl/tile-server`](https://github.com/darobin/dasl-tiles/tree/main/tile-server),
which bounces every request to `load.webtil.es` onto a fresh random
`<20 letters>.webtil.es` origin and serves the loader runtime there under
`/.well-known/web-tiles/`. So the server has to answer for `webtil.es` *and* for
every subdomain of it — an unbounded population, one new hostname per tile load.

## Hosting

The site is a node service behind the supramundane Caddy front (see the
[`sm`](https://github.com/darobin/sm) repo): `service.json`, `Dockerfile`,
`compose.yaml`. The container is `webtil-es` on the `supramundane` docker network,
and the front reverse-proxies `webtil.es` and `*.webtil.es` to it.

### TLS

The front holds one real `*.webtil.es` wildcard certificate, obtained through the
DNS-01 challenge and answered by the front's own acme-dns server
(`"wildcardTls": "acmedns"` in `service.json`). Per-hostname on-demand
certificates would not work here: every tile load is a new hostname, and Let's
Encrypt allows 50 new certificates per registered domain per week. The apex
`webtil.es` gets its own certificate the ordinary way. Caddy renews both by
itself: there is no cron job and nothing to run from a laptop.

The front's shared `nice-headers` are off for this service (`"headers": false`):
their `X-Frame-Options: sameorigin` would stop `webtil.es` from framing the tile
origins on `*.webtil.es`. `index.js` sets HSTS on everything and the rest of those
headers on the site; the tile runtime sets its own.

### DNS (Gandi, set once)

| Type  | Name              | Value                                                   |
| ----- | ----------------- | ------------------------------------------------------- |
| A     | `@`               | `163.172.50.15`                                         |
| A     | `*`               | `163.172.50.15`                                         |
| CNAME | `_acme-challenge` | `fb4bcbc0-cf14-4421-8550-4ab7d3ee27a8.acme.ziran.space.` |

The CNAME delegates the wildcard's DNS-01 challenge to the acme-dns account
registered for the front (`front-acme-dns/README.md` in `sm`); it is the same
target the ziran zones use.

### Deploying

Set up once, and again whenever `service.json` changes (it is what generates the
front's routing snippet):

```sh
export SUPRAMUNDANE=163.172.50.15 SM_REMOTE_USER=root   # as for sm itself
npm run deploy                                          # = sm deploy
```

`sm deploy` rsyncs this checkout to `/srv/supramundane/services/webtil-es`, drops
`sites/webtil-es.caddy` into the front (validated in a throwaway container
first), builds and starts the container, and reloads the front.

Pushing to `main` redeploys from GitHub Actions (`.github/workflows/deploy.yml`):
it uploads the checkout and rebuilds the container, leaving the front alone. It
signs in as root with the `KEY` and `PASSWORD` (key passphrase) repository
secrets, so that key must be authorised on the supramundane server.

## Developing

```sh
npm run watch        # esbuild --watch for public/browser/at.js + node --watch index.js on :1503
```

The client uses `load.webtiles.bast` as its load domain when the page is on
`localhost` or a `.bast` host (`public/browser/stores.js`), so behind the local
front the service runs as `webtiles.bast`:

```sh
TILES_HOST=webtiles.bast sm deploy --local
```

(or `TILES_HOST=webtiles.bast npm run watch` and point a local Caddy at :1503).
