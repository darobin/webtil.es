// The containment check page: load the red-team tile through any loading
// server and show its report. The host side is @dasl/containment-tile's
// runCheck(); this is the form around it.

import { ATTileLoader } from '@dasl/tile-loader/at';
import { CARTileLoader } from '@dasl/tile-loader/car';
import { runCheck } from '@dasl/containment-tile/check';

// Behind the local front the site is webtiles.bast; run straight from node it
// is 127.0.0.1:<port>, and *.localhost:<port> is the loader (see index.js).
const { hostname, port, origin } = location;
const DEFAULT_LOAD = /^(localhost|127\.0\.0\.1)$/.test(hostname)
  ? `http://load.localhost:${port}`
  : /\.bast$/.test(hostname) ? 'load.webtiles.bast' : 'load.webtil.es';
// The page ships its own copy of the tile; an at:// URI works too.
const DEFAULT_TILE = `${origin}/check/containment.tile`;
const PROBE_BASE = `${origin}/probe`;

const ICON = { contained: '✓', breach: '✗', permitted: '●', elevated: '▲', restricted: '–', inconclusive: '?', unobservable: '○' };
const LABEL = {
  contained: 'contained', breach: 'breach', permitted: 'permitted by policy', elevated: 'permitted on a user gesture',
  restricted: 'restricted', inconclusive: 'inconclusive', unobservable: 'unobservable from inside',
};

const form = document.getElementById('check');
const { load, tile: tileField, deep } = form.elements;
const button = form.querySelector('button');
const probeNote = document.getElementById('probe-note');
const statusEl = document.getElementById('status');
const resultSection = document.getElementById('result');
const verdictEl = document.getElementById('verdict');
const contextEl = document.getElementById('context');
const resultsEl = document.getElementById('results');
const tileSection = document.getElementById('tile-section');
const container = document.getElementById('tile');

// The check is linkable: #load=…&tile=…&deep=1
const params = new URLSearchParams(location.hash.replace(/^#/, ''));
load.value = params.get('load') || DEFAULT_LOAD;
tileField.value = params.get('tile') || DEFAULT_TILE;
deep.checked = params.get('deep') === '1';

async function resolveHandle (handle) {
  const url = new URL('https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle');
  url.searchParams.set('handle', handle);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not resolve ${handle}`);
  return (await res.json()).did;
}
// at://handle/… -> at://did/…
async function didify (url) {
  if (!/^at:\/\//.test(url) || /^at:\/\/did:/.test(url)) return url;
  const [repo, collection, rkey] = url.replace(/^at:\/\//, '').split('/');
  return `at://${await resolveHandle(repo)}/${collection}/${rkey}`;
}

function setStatus (msg) { statusEl.textContent = msg; }

async function probesAnswer () {
  try {
    const res = await fetch(`${PROBE_BASE}/ping`, { cache: 'no-store' });
    return (await res.json()).probe === 'ping';
  }
  catch { return false; }
}

async function run () {
  location.hash = new URLSearchParams({
    load: load.value.trim(),
    tile: tileField.value.trim(),
    ...(deep.checked ? { deep: '1' } : {}),
  }).toString();
  button.disabled = true;
  resultSection.hidden = true;
  tileSection.hidden = true;
  resultsEl.replaceChildren();
  container.replaceChildren();
  probeNote.hidden = true;
  try {
    // A "contained" against probes that are not there would mean nothing.
    if (!await probesAnswer()) {
      probeNote.textContent = `The probe endpoints at ${PROBE_BASE} are not answering, so the tile would have nothing to reach and every result would look contained. Run the check from a host that serves @dasl/containment-tile's probe router.`;
      probeNote.hidden = false;
      return;
    }
    setStatus(`Loading the tile through ${load.value.trim()}…`);
    const tileUrl = await didify(tileField.value.trim());
    tileSection.hidden = false;
    const { report } = await runCheck({
      loadDomain: load.value.trim(),
      tileUrl,
      loaders: [new ATTileLoader(), new CARTileLoader()],
      container,
      probeBase: PROBE_BASE,
      deep: deep.checked,
      onReport: render,
    });
    setStatus(`Done. ${report.summary}.`);
  }
  catch (err) {
    setStatus(`Could not run the check: ${err.message}`);
  }
  finally {
    button.disabled = false;
  }
}

function render (report) {
  resultSection.hidden = false;
  verdictEl.className = report.verdict;
  verdictEl.textContent = report.verdict === 'contained'
    ? `✓ Contained — ${report.summary}`
    : `✗ Breach — ${report.breaches.join(', ')}`;
  contextEl.textContent = `tile origin ${report.origin} · probes at ${report.probeBase}${report.deep ? ' · destructive probes included' : ''} · ${report.userAgent}`;

  const byCategory = new Map();
  for (const r of report.results) {
    if (!byCategory.has(r.category)) byCategory.set(r.category, []);
    byCategory.get(r.category).push(r);
  }
  resultsEl.replaceChildren();
  for (const [category, rows] of byCategory) {
    const group = document.createElement('div');
    group.className = 'group';
    const h3 = document.createElement('h3');
    h3.textContent = category;
    group.append(h3);
    for (const r of rows) {
      const row = document.createElement('div');
      row.className = `row status-${r.status}`;
      const icon = document.createElement('span');
      icon.className = 'icon';
      icon.textContent = ICON[r.status];
      icon.title = LABEL[r.status];
      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = r.name;
      const detail = document.createElement('span');
      detail.className = 'detail';
      detail.textContent = r.detail;
      row.append(icon, name, detail);
      group.append(row);
    }
    resultsEl.append(group);
  }
}

form.addEventListener('submit', (ev) => { ev.preventDefault(); run(); });
if (params.get('run') === '1') run();
