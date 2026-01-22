
const burn = {
  '--yellow': 'normal',
  '--green': 'normal',
  '--contrasted': 'darken',
  '--deep-green': 'darken',
  '--new-blue': 'darken',
  '--red': 'hard-light',
};
const colours = {
  '--yellow': 'fff500',
  '--new-blue': '00b7ba',
  '--deep-green': '008487',
  '--new-purple': '7b65ea',
  '--light-pink': 'ff959d',
  '--deep-red': 'bf0033',
  '--green': '00ff75',
  '--purple': 'cd76ea',
  '--orange': 'ffb443',
  '--red': 'ff5e5e',
  '--blue': '39dbff',
  '--contrasted': '00819e',
};
const vars = Object.keys(colours);
const key = vars[Math.floor(Math.random() * vars.length)];
const hex = colours[key];
document.documentElement.setAttribute('style', `--theme: var(${key}); --blend: ${burn[key] || 'color-burn'}`);
document.head.querySelector('link[rel="icon"]')?.setAttribute(
  'href',
  `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect x=%220%22 y=%220%22 width=%22100%22 height=%22100%22 fill=%22%23${hex}%22></rect></svg>`
);
document.head.querySelector('meta[name="theme-color"]')?.setAttribute('content', `#${hex}`);
