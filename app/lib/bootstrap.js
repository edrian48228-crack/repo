/* bootstrap.js — Punto de arranque de toda la capa PWA + GitHub.
 * Se carga al final del index.html como <script type="module" src="./lib/bootstrap.js"></script>
 * NO toca el diseño ni la lógica original; sólo añade capacidades.
 */
import "./mobile-menu.js";
import { Sync } from "./sync.js";
import "./admin-config.js";
import "./admin-fix.js";
import { GhSync } from "./gh-sync.js";
import { DB } from "./indexeddb.js";

// Registrar Service Worker (sólo en producción / fuera de iframes de preview)
const isInIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
const isPreview = location.hostname.includes("id-preview--") || location.hostname.includes("lovableproject.com") || location.hostname.includes("lovable.app");

if ("serviceWorker" in navigator) {
  if (!isPreview && !isInIframe) {
    navigator.serviceWorker.register("./service-worker.js?v=" + (document.documentElement.dataset.buildTs || localStorage.getItem("mtp_build_ts") || Date.now())).catch((e) => console.warn("[SW] error:", e));
  } else {
    // Limpia SWs previos en preview/iframe para evitar caches obsoletos
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
  }
}

// Restaurar passphrase cacheada en sesión (sobrevive recargas de la pestaña, no localStorage por seguridad)
try {
  const cached = sessionStorage.getItem("__MTP_PASS__");
  if (cached) window.__MTP_PASS__ = cached;
} catch {}

// Sync automático cada 30s (intenta vaciar la cola si hay token + passphrase en sesión)
Sync.start({ everyMs: 30000 });

// GhSync: pull del estado remoto al arrancar + wrap de saveS para push automático
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => GhSync.install());
} else {
  GhSync.install();
}

// Exponer API global para uso desde tu HTML existente sin reescribir nada
import { Reader } from "./reader.js";
import { Writer } from "./writer.js";
import { GitHub } from "./github-api.js";
import { ImageOpt } from "./image-opt.js";
import { Backup } from "./backup.js";
import { RepoInit } from "./repo-init.js";
import { AdminConfig } from "./admin-config.js";

// Cachear imágenes del estado local al arrancar (para offline completo)
function warmImageCache() {
  if (!navigator.serviceWorker?.controller || !window.S) return;
  function collectUrls(obj, urls = new Set()) {
    if (!obj || typeof obj !== "object") return urls;
    for (const v of Object.values(obj)) {
      if (typeof v === "string" && /\.(png|jpg|jpeg|gif|webp|svg|ico)/i.test(v) && (v.startsWith("http") || v.startsWith("."))) {
        urls.add(v);
      } else if (typeof v === "object") collectUrls(v, urls);
    }
    return urls;
  }
  const urls = collectUrls(window.S);
  for (const url of urls) {
    navigator.serviceWorker.controller.postMessage({ type: "CACHE_IMAGE", url });
  }
}
// Esperar a que SW esté activo y S esté cargado
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready.then(() => {
    let tries = 0;
    const t = setInterval(() => {
      if (window.S) { clearInterval(t); warmImageCache(); }
      else if (++tries > 30) clearInterval(t);
    }, 300);
  }).catch(() => {});
}

window.MTP = { Reader, Writer, GitHub, ImageOpt, Backup, RepoInit, Sync, GhSync, AdminConfig, DB };
console.log("[MTP] PWA stack lista. window.MTP disponible.");
