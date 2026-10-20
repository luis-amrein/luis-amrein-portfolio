import portfolio from './astro.config.mjs';
export default { ...portfolio, vite: { ...portfolio.vite, cacheDir: '.astro/magazine-vite' }, devToolbar: { enabled: false } };
