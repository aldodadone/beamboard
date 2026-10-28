/* BeamBoard: funzionamento offline e aggiornamenti */
const VERSIONE = '1.0.1';
const APP = 'beamboard-app-' + VERSIONE;
const MOTORE = 'beamboard-motore';
const PACCHETTO = 'engine/tex-b7b27182c0.bin.gz';
const FILE = [
  "./",
  "aiuto.html",
  "crediti.html",
  "css/beamboard.css",
  "css/fonts/fredoka-latin-500-normal.woff2",
  "css/fonts/fredoka-latin-ext-500-normal.woff2",
  "css/fonts/nunito-latin-400-italic.woff2",
  "css/fonts/nunito-latin-400-normal.woff2",
  "css/fonts/nunito-latin-600-italic.woff2",
  "css/fonts/nunito-latin-600-normal.woff2",
  "css/fonts/nunito-latin-ext-400-italic.woff2",
  "css/fonts/nunito-latin-ext-400-normal.woff2",
  "css/fonts/nunito-latin-ext-600-italic.woff2",
  "css/fonts/nunito-latin-ext-600-normal.woff2",
  "css/pagine.css",
  "engine/swiftlatexpdftex.js",
  "engine/worker.js",
  "img/icona-192.png",
  "img/icona-512.png",
  "img/icona.svg",
  "img/temi/Berlin.jpg",
  "img/temi/Boadilla.jpg",
  "img/temi/Copenhagen.jpg",
  "img/temi/Madrid.jpg",
  "img/temi/PaloAlto.jpg",
  "img/temi/Singapore.jpg",
  "img/temi/default.jpg",
  "img/temi/metropolis.jpg",
  "index.html",
  "js/app.js",
  "js/gen.js",
  "manifest.webmanifest",
  "vendor/mathlive.min.js",
  "vendor/mathlive/fonts/KaTeX_AMS-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Caligraphic-Bold.woff2",
  "vendor/mathlive/fonts/KaTeX_Caligraphic-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Fraktur-Bold.woff2",
  "vendor/mathlive/fonts/KaTeX_Fraktur-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Main-Bold.woff2",
  "vendor/mathlive/fonts/KaTeX_Main-BoldItalic.woff2",
  "vendor/mathlive/fonts/KaTeX_Main-Italic.woff2",
  "vendor/mathlive/fonts/KaTeX_Main-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Math-BoldItalic.woff2",
  "vendor/mathlive/fonts/KaTeX_Math-Italic.woff2",
  "vendor/mathlive/fonts/KaTeX_SansSerif-Bold.woff2",
  "vendor/mathlive/fonts/KaTeX_SansSerif-Italic.woff2",
  "vendor/mathlive/fonts/KaTeX_SansSerif-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Script-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Size1-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Size2-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Size3-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Size4-Regular.woff2",
  "vendor/mathlive/fonts/KaTeX_Typewriter-Regular.woff2",
  "vendor/pdf.min.js",
  "vendor/pdf.worker.min.js"
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(APP).then(c => c.addAll(FILE)));
});
self.addEventListener('message', e => { if (e.data === 'aggiorna') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('beamboard-app-') && k !== APP) await caches.delete(k);
    const m = await caches.open(MOTORE);
    for (const r of await m.keys()) if (!r.url.endsWith(PACCHETTO)) await m.delete(r);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.url.endsWith('.bin.gz')) {
    e.respondWith(caches.open(MOTORE).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).catch(() => req.mode === 'navigate' ? caches.match('./') : Response.error())));
});
