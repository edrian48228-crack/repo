/* gh-sync.js — Sincronización del estado S (admin) con GitHub.
 *
 * Flujo:
 *  1. Al arrancar: hace PULL del JSON remoto (raw.githubusercontent) y lo
 *     mergea con el localStorage local antes de renderizar.
 *  2. Al guardar (saveS): wrappea la función para encolar un commit con
 *     debounce (5s) en /public/data/state.json del repo configurado.
 *
 * Importante: NO toca el diseño ni la lógica original del index.html.
 * Solo hookea funciones globales (loadS, saveS, S, renderAll).
 *
 * El JSON remoto NO contiene secretos: adminPass y recoverAnswer se eliminan
 * antes de subir. Imágenes en base64 también se excluyen (peso).
 */
import { GitHub } from "./github-api.js";
import { Writer } from "./writer.js";
import { DB } from "./indexeddb.js";

const REMOTE_PATH = "data/state.json";        // dentro de /public
const RAW_BASE    = "https://raw.githubusercontent.com";
const DEBOUNCE_MS = 5000;
const MAX_IMG_BYTES = 200_000;                // ignora base64 > 200KB

let pulled = false;
let saveTimer = null;
let pendingPull = null;

function rawUrl({ owner, repo, branch }, path) {
  return `${RAW_BASE}/${owner}/${repo}/${branch}/public/${path}`;
}

function publicCandidates(path) {
  const clean = path.replace(/^\/+/, "");
  const urls = [];
  try { urls.push(new URL(`../public/${clean}`, location.href).href); } catch {}
  try { urls.push(new URL(`./public/${clean}`, location.href).href); } catch {}
  try { urls.push(new URL(`/public/${clean}`, location.origin).href); } catch {}
  return [...new Set(urls)];
}

/** Limpia el snapshot antes de subirlo a GitHub (sin secretos ni base64 gigante). */
function sanitize(state) {
  const clone = JSON.parse(JSON.stringify(state || {}));
  delete clone.adminPass;
  delete clone.recoverAnswer;
  // Strip base64 grandes
  walk(clone, (val, set) => {
    if (typeof val === "string" && val.startsWith("data:") && val.length > MAX_IMG_BYTES) {
      set("");
    }
  });
  return clone;
}

function walk(obj, fn) {
  if (!obj || typeof obj !== "object") return;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (typeof v === "object" && v !== null) walk(v, fn);
    else fn(v, (nv) => { obj[k] = nv; });
  }
}

/** Merge superficial campo a campo del remoto sobre S si los campos están vacíos
 * o si el remoto es más nuevo (basado en timestamp __ts si existe). */
function mergeRemote(S, remote) {
  if (!S || !remote) return false;
  let changed = false;
  const localTs = S.__ts || 0;
  const remoteTs = remote.__ts || 0;
  // Si el remoto es más nuevo, prevalece para todos los campos editables
  const preferRemote = remoteTs > localTs;

  const fields = ["config", "plans", "ownerWeb", "ownerApk", "contacts", "links",
    "avatar", "sellers", "clientStores", "notifications", "analytics", "terms",
    "promoConfig", "testimonials", "siteIcon", "shopUrl", "jsonAutoUrl", "contractTemplate"];

  for (const f of fields) {
    if (remote[f] === undefined) continue;
    const isEmptyLocal = S[f] === undefined || S[f] === null || S[f] === ""
      || (Array.isArray(S[f]) && S[f].length === 0);
    if (preferRemote || isEmptyLocal) {
      S[f] = remote[f];
      changed = true;
    }
  }
  if (preferRemote) S.__ts = remoteTs;
  return changed;
}

/** Envía URLs de imágenes al SW para que las cachee en background. */
function cacheImagesViaSW(state) {
  if (!navigator.serviceWorker?.controller || !state) return;
  const urls = new Set();
  // Recopilar todas las URLs de imagen del estado
  function walk(obj) {
    if (!obj || typeof obj !== "object") return;
    for (const v of Object.values(obj)) {
      if (typeof v === "string" && (v.startsWith("http") || v.startsWith("../public/img/")) && /\.(png|jpg|jpeg|gif|webp|svg|ico)/i.test(v)) {
        urls.add(v);
      } else if (typeof v === "object") {
        walk(v);
      }
    }
  }
  walk(state);
  for (const url of urls) {
    navigator.serviceWorker.controller.postMessage({ type: "CACHE_IMAGE", url });
  }
}

export const GhSync = {
  /** Pull del JSON remoto (sin token, lectura pública). Devuelve el objeto o null. */
  async pull() {
    const urls = [];
    try {
      const cfg = await GitHub.getConfig();
      urls.push(...publicCandidates(REMOTE_PATH));
      if (cfg.owner && cfg.repo) urls.push(rawUrl(cfg, REMOTE_PATH));
      for (const url of [...new Set(urls)]) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) {
            if (res.status !== 404) await DB.log("warn", "gh-sync pull HTTP", { url, status: res.status });
            continue;
          }
          const json = await res.json();
          await DB.putCache(REMOTE_PATH, json);
          await DB.log("ok", "gh-sync pull OK", { url });
          return json;
        } catch (err) {
          await DB.log("warn", "gh-sync pull fail", { url, err: String(err) });
        }
      }
      await DB.log("info", "gh-sync pull: state.json no existe aún");
      return null;
    } catch (e) {
      try {
        const cached = await DB.getCache(REMOTE_PATH);
        if (cached?.data) return cached.data;
      } catch {}
      return null;
    }
  },

  /** Aplica el remoto sobre window.S y rerenderiza si hubo cambios. */
  async pullAndApply() {
    if (pulled) return false;
    pulled = true;
    const remote = await this.pull();
    if (!remote || !window.S) return false;
    const changed = mergeRemote(window.S, remote);
    if (changed) {
      try { window.saveS && window.saveS({ __skipPush: true }); } catch {}
      try { window.renderAll && window.renderAll(); } catch {}
      try { window.loadAdminUI && window.loadAdminUI(); } catch {}
      try { cacheImagesViaSW(window.S); } catch {}
      await DB.log("ok", "gh-sync: estado remoto aplicado");
    }
    return changed;
  },

  /** Encola un commit del estado actual a /public/data/state.json (con debounce). */
  schedulePush() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => this.pushNow().catch((e) => DB.log("warn", "gh-sync push fail", { err: String(e) })), DEBOUNCE_MS);
  },

  async pushNow() {
    if (!window.S) return;
    const cfg = await GitHub.getConfig();
    if (!cfg.owner || !cfg.repo) {
      await DB.log("warn", "gh-sync: sin owner/repo configurado, no se puede subir");
      return;
    }
    if (!cfg.tokenEnc) {
      await DB.log("warn", "gh-sync: sin token, configúralo en Admin → GitHub");
      return;
    }
    const pass = window.__MTP_PASS__;
    if (!pass) {
      await DB.log("warn", "gh-sync: sin passphrase en sesión, no se puede desencriptar token");
      return;
    }
    const snapshot = sanitize(window.S);
    snapshot.__ts = Date.now();
    window.S.__ts = snapshot.__ts;
    try {
      const r = await Writer.writeJSON(REMOTE_PATH, snapshot, {
        message: `state: sync ${new Date().toISOString()}`,
        passphrase: pass,
      });
      await DB.log("ok", "gh-sync: push OK", { path: REMOTE_PATH, sha: r?.commit?.sha });
    } catch (err) {
      await DB.log("error", "gh-sync: push FAIL", { path: REMOTE_PATH, err: String(err) });
      throw err;
    }
  },

  /** Hookea loadS / saveS del HTML original. Llamar una vez tras DOMContentLoaded. */
  install() {
    // Wrap saveS → además encola push
    if (typeof window.saveS === "function" && !window.__mtpSaveWrapped) {
      const origSave = window.saveS;
      window.saveS = function (opts) {
        const r = origSave.apply(this, arguments);
        if (!opts || !opts.__skipPush) {
          try { GhSync.schedulePush(); } catch {}
        }
        return r;
      };
      window.__mtpSaveWrapped = true;
    }

    // Pull al arrancar (cuando S ya existe). Reintenta hasta 20 veces.
    let tries = 0;
    pendingPull = setInterval(() => {
      if (window.S) {
        clearInterval(pendingPull);
        GhSync.pullAndApply().catch(() => {});
      } else if (++tries > 40) {
        clearInterval(pendingPull);
      }
    }, 200);

    // Pull periódico cada 15s para ver cambios de otros dispositivos más rápido
    setInterval(() => { pulled = false; GhSync.pullAndApply().catch(() => {}); }, 15_000);
    // Al volver online
    window.addEventListener("online", () => { pulled = false; GhSync.pullAndApply().catch(() => {}); });
    // Al volver a la pestaña / desbloquear pantalla en Android
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") { pulled = false; GhSync.pullAndApply().catch(() => {}); }
    });
    // Al enfocar la ventana (útil en escritorio)
    window.addEventListener("focus", () => { pulled = false; GhSync.pullAndApply().catch(() => {}); });
  },
};
