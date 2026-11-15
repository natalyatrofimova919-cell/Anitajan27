const CACHE = "babka-jump-v13";
const CORE = ["./", "./index.html", "./style.css", "./game.js", "./manifest.webmanifest"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network-first: a fresh build always wins; the cache is only an offline fallback.
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(cache => cache.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match("./index.html"))));
});
