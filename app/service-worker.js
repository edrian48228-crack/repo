/* MiTienda Pro — Service Worker v1.1.0
 * Offline-first robusto. Compatible con GitHub Pages (rutas relativas).
 *
 * Estrategias:
 *  - HTML (navegación)        -> network-first → cache → fallback index.html
 *  - Estáticos del propio app -> stale-while-revalidate
 *  - Fuentes Google           -> cache-first (largo plazo)
 *  - api.github.com           -> network-first con cache corta (5s)
 *  - raw.githubusercontent    -> stale-while-revalidate (datos JSON públicos)
 *  - Imágenes                 -> cache-first
 *
 * Bump VERSION cuando cambies precache.
 */
const VERSION = "v1.4.3";
const STATIC_CACHE  = `mtp-static-${VERSION}`;
const RUNTIME_CACHE = `mtp-runtime-${VERSION}`;
const HTML_CACHE    = `mtp-html-${VERSION}`;
const FONT_CACHE    = `mtp-fonts-${VERSION}`;
const IMG_CACHE     = `mtp-img-${VERSION}`;
const APP_ROOT_URL  = new URL("./", self.location.href).toString();
const APP_SHELL_URL = new URL("./index.html", self.location.href).toString();

const PRECACHE = [
  APP_ROOT_URL,
  APP_SHELL_URL,
  "./manifest.json",
  "./css/styles.css",
  "./js/guard.js",
  "./js/main.js",
  "./lib/crypto.js",
  "./lib/indexeddb.js",
  "./lib/github-api.js",
  "./lib/reader.js",
  "./lib/writer.js",
  "./lib/sync.js",
  "./lib/backup.js",
  "./lib/image-opt.js",
  "./lib/repo-init.js",
  "./lib/admin-config.js",
  "./lib/admin-fix.js",
  "./lib/mobile-menu.js",
  "./lib/gh-sync.js",
  "./lib/bootstrap.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    // addAll falla si UNO falla; usamos add individual tolerante
    await Promise.all(PRECACHE.map((url) => cache.add(url).catch((e) => console.warn("[SW] precache miss:", url, e))));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  const valid = new Set([STATIC_CACHE, RUNTIME_CACHE, HTML_CACHE, FONT_CACHE, IMG_CACHE]);
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !valid.has(k)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

const isHTML        = (req) => req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
const isGitHubAPI   = (url) => url.hostname === "api.github.com";
const isGitHubRaw   = (url) => url.hostname === "raw.githubusercontent.com" || url.hostname.endsWith(".githubusercontent.com");
const isGoogleFont  = (url) => url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
const isImage       = (req, url) => req.destination === "image" || /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname);

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  // No cachear esquemas raros (chrome-extension://, etc.)
  if (!req.url.startsWith("http")) return;

  const url = new URL(req.url);

  if (isHTML(req))                     return event.respondWith(networkFirst(req, HTML_CACHE, 6000, true));
  if (isGoogleFont(url))               return event.respondWith(cacheFirst(req, FONT_CACHE));
  if (isGitHubAPI(url))                return event.respondWith(networkFirst(req, RUNTIME_CACHE, 5000));
  if (isGitHubRaw(url))                return event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
  if (isImage(req, url))               return event.respondWith(cacheFirst(req, IMG_CACHE));
  return event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
});

async function networkFirst(req, cacheName, timeoutMs = 8000, htmlFallback = false) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await Promise.race([
      fetch(req),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), timeoutMs)),
    ]);
    if (fresh && fresh.ok) cache.put(req, fresh.clone()).catch(() => {});
    return fresh;
  } catch (_) {
    const cached = await cache.match(req);
    if (cached) return cached;
    if (htmlFallback) {
      // Fallback al index.html cacheado (en cualquier cache)
      const fallback = (await cache.match(APP_SHELL_URL))
        || (await caches.match(APP_SHELL_URL))
        || (await caches.match(APP_ROOT_URL))
        || (await cache.match("./index.html"))
        || (await caches.match("./index.html"))
        || (await caches.match("./"));
      if (fallback) return fallback;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req).then((res) => {
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  }).catch(() => null);
  return cached || (await network) || new Response("Offline", { status: 503 });
}

// Mensajes desde la app (limpieza, skipWaiting, etc.)
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SKIP_WAITING") self.skipWaiting();
  if (data.type === "CLEAR_CACHES") {
    event.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      event.source?.postMessage({ type: "CACHES_CLEARED" });
    })());
  }
});
