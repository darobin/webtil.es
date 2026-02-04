
import { navigateFromHash } from './stores.js';
import './el/browser.js';
import './el/profile-tab.js';
import './el/tile-card.js';
import './el/tile-live.js';
import './el/tile-tab.js';
import './el/bg-pic.js';
import './el/dyn-img.js';

// XXX
//  x respond to hash on load and change
//  x input causes hash to change
//  x need to resolve handles
//  x get profile data
//  - loading indicator
//  x load not just the tile, but also details about the user (Tile API?)
//  x render in a way that shows name, avatar, etc. so it's nice, like a post
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


window.addEventListener('hashchange', navigateFromHash);
window.addEventListener('load', navigateFromHash);
