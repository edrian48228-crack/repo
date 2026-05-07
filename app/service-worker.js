/* MiTienda Pro — Service Worker v2 (Offline-First Total)
 *
 * Estrategias:
 *  - App shell (HTML, CSS, JS)   → cache-first con revalidación en background
 *  - state.json remoto           → stale-while-revalidate agresivo + fallback IndexedDB cache
 *  - Imágenes (locales y repo)   → cache-first permanente
 *  - Fuentes Google              → cache-first largo plazo
 *  - api.github.com (escritura)  → network-only (nunca cachear writes)
 *  - Todo lo demás               → stale-while-revalidate
 *
 * Offline: si no hay red Y hay cache → siempre sirve desde cache sin errores.
 */

const VERSION = new URL(location.href).searchParams.get("v") || "v3.1.0";
const STATIC_CACHE  = `mtp-static-${VERSION}`;
const RUNTIME_CACHE = `mtp-runtime-${VERSION}`;
const HTML_CACHE    = `mtp-html-${VERSION}`;
const FONT_CACHE    = `mtp-fonts-v1`;       // fuentes: cache permanente, no varía con versión
const IMG_CACHE     = `mtp-img-v1`;         // imágenes: cache permanente
const DATA_CACHE    = `mtp-data-${VERSION}`;

const APP_ROOT_URL  = new URL("./", self.location.href).toString();
const APP_SHELL_URL = new URL("./index.html", self.location.href).toString();

// ── Todo el shell de la app se precachea al instalar ──────────────────────────
const PRECACHE = [
  APP_ROOT_URL,
  APP_SHELL_URL,
  "./manifest.json",
  "./css/styles.css",
  // JS principal
  "./js/guard.js",
  "./js/main.js",
  "./js/sync-hook.js",
  "./js/admin-menu.js",
  // Librerías
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

// ── Install: precachear shell completo ────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await Promise.all(
      PRECACHE.map((url) =>
        fetch(url, { cache: "no-store" })
          .then((res) => { if (res.ok) cache.put(url, res); })
          .catch(() => {}) // tolerar fallos individuales
      )
    );
    await self.skipWaiting();
  })());
});

// ── Activate: limpiar caches viejos EXCEPTO fuentes e imágenes permanentes ────
self.addEventListener("activate", (event) => {
  const permanent = new Set(["mtp-fonts-v1", "mtp-img-v1"]);
  const valid = new Set([STATIC_CACHE, RUNTIME_CACHE, HTML_CACHE, DATA_CACHE, ...permanent]);
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => !valid.has(k)).map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// ── Clasificadores de requests ────────────────────────────────────────────────
const isHTML       = (req) => req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
const isGitHubAPI  = (url) => url.hostname === "api.github.com";
const isGitHubRaw  = (url) => url.hostname === "raw.githubusercontent.com" || url.hostname.endsWith(".githubusercontent.com");
const isGoogleFont = (url) => url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
const isImage      = (req, url) => req.destination === "image" || /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname);
const isStateJSON  = (url) => url.pathname.endsWith("state.json");
const isStaticAsset= (url) => /\.(js|css|json|woff2?|ttf|eot)$/i.test(url.pathname);

// ── Fetch handler ─────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // writes van siempre a red
  if (!req.url.startsWith("http")) return;

  const url = new URL(req.url);

  // Fuentes → cache-first permanente
  if (isGoogleFont(url)) return event.respondWith(cacheFirst(req, FONT_CACHE, true));

  // Imágenes → cache-first permanente (cubre /public/img/ del repo y locales)
  if (isImage(req, url)) return event.respondWith(cacheFirst(req, IMG_CACHE, true));

  // state.json (raw.githubusercontent o local /public/data/) → stale-while-revalidate
  if (isStateJSON(url) || isGitHubRaw(url)) return event.respondWith(staleWhileRevalidate(req, DATA_CACHE));

  // api.github.com → sólo red (commits, refs). Si offline → respuesta vacía controlada
  if (isGitHubAPI(url)) return event.respondWith(networkOnly(req));

  // HTML / navegación → cache-first con fallback al shell
  if (isHTML(req)) return event.respondWith(cacheFirstWithShellFallback(req));

  // Archivos estáticos del propio app (JS, CSS) → stale-while-revalidate
  if (isStaticAsset(url)) return event.respondWith(staleWhileRevalidate(req, STATIC_CACHE));

  // Todo lo demás → stale-while-revalidate en runtime
  return event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
});

// ── Estrategias de caché ──────────────────────────────────────────────────────

/** cache-first: sirve desde cache; si no hay, busca en red y guarda. */
async function cacheFirst(req, cacheName, permanent = false) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch {
    return offlineResponse(req);
  }
}

/** Para navegación: sirve desde cache; revalida en background; fallback al shell si offline. */
async function cacheFirstWithShellFallback(req) {
  const [htmlCache, staticCache] = await Promise.all([
    caches.open(HTML_CACHE),
    caches.open(STATIC_CACHE),
  ]);

  const cached = await htmlCache.match(req) || await staticCache.match(req);

  // Revalidar en background (no bloquea)
  fetch(req).then((res) => {
    if (res && res.ok) htmlCache.put(req, res.clone()).catch(() => {});
  }).catch(() => {});

  if (cached) return cached;

  // Sin cache: intentar red síncrono
  try {
    const res = await fetch(req);
    if (res && res.ok) { htmlCache.put(req, res.clone()).catch(() => {}); return res; }
  } catch {}

  // Fallback al index.html
  return (
    await staticCache.match(APP_SHELL_URL) ||
    await caches.match(APP_SHELL_URL) ||
    await caches.match(APP_ROOT_URL) ||
    offlineResponse(req)
  );
}

/** stale-while-revalidate: devuelve cache inmediato y actualiza en background. */
async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);

  const networkPromise = fetch(req).then((res) => {
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  }).catch(() => null);

  // Si hay cache, devuélvela inmediatamente (la red actualiza en background)
  if (cached) return cached;

  // Sin cache, esperar red
  const fresh = await networkPromise;
  if (fresh) return fresh;

  return offlineResponse(req);
}

/** network-only: sólo red. Si falla offline, devuelve error controlado. */
async function networkOnly(req) {
  try {
    return await fetch(req);
  } catch {
    return new Response(
      JSON.stringify({ offline: true, message: "Sin conexión — operación encolada" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** Respuesta offline genérica según tipo de recurso. */
function offlineResponse(req) {
  const accept = req.headers.get("accept") || "";
  if (accept.includes("text/html")) {
    return new Response(
      "<html><body style='font-family:sans-serif;text-align:center;padding:40px'>" +
      "<h2>Sin conexión</h2><p>Recarga cuando tengas internet.</p></body></html>",
      { status: 503, headers: { "Content-Type": "text/html" } }
    );
  }
  if (accept.includes("application/json") || req.url.endsWith(".json")) {
    return new Response("{}", { status: 503, headers: { "Content-Type": "application/json" } });
  }
  return new Response("Offline", { status: 503 });
}

// ── Mensajes desde la app ─────────────────────────────────────────────────────
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

  // Cachear manualmente una imagen recién subida (llamar desde gh-sync tras upload)
  if (data.type === "CACHE_IMAGE" && data.url) {
    event.waitUntil((async () => {
      try {
        const cache = await caches.open(IMG_CACHE);
        const res = await fetch(data.url, { cache: "no-store" });
        if (res.ok) await cache.put(data.url, res);
      } catch {}
    })());
  }
});
