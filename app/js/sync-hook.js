/* sync-hook.js — Sincronización automática con GitHub.
 * v2 — Corrige carga inicial en dispositivos NUEVOS (móvil sin localStorage):
 *  - Infiere owner/repo desde la URL de GitHub Pages cuando no hay config local.
 *  - Aplica el state.json remoto SIEMPRE sobre window.S (aunque local esté vacío).
 *  - Persiste el snapshot en localStorage para que la próxima carga sea instantánea.
 *  - Pull al cargar, cada 60s, al volver online y al recuperar foco.
 */
(function () {
  const LS_KEY        = "mtp_v2";
  const REMOTE_PATH   = "public/data/state.json";
  const DEBOUNCE_MS   = 5000;
  const MAX_IMG_BYTES = 200_000;
  const DB_NAME       = "mitiendapro";

  let pushTimer  = null;
  let pushingNow = false;
  let pulled     = false;

  /* ── IndexedDB ── */
  function openDB() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onsuccess = () => res(r.result);
      r.onerror   = () => rej(r.error);
    });
  }
async function dbGet(store, key) {
    try {
      const db = await openDB();
      if (!db.objectStoreNames.contains(store)) return null;
      return new Promise((res) => {
        const r = db.transaction(store).objectStore(store).get(key);
        r.onsuccess = () => res(r.result?.value ?? null);
        r.onerror   = () => res(null);
      });
    } catch { return null; }
  }

  /* ── Inferir owner/repo desde la URL de GitHub Pages ── */
  function inferRepoFromUrl() {
    try {
      const host = location.hostname;             // ej: edrian48228-crack.github.io
      const parts = location.pathname.split("/").filter(Boolean); // ej: ["repo","app","index.html"]
      // Project Pages: <owner>.github.io/<repo>/...
      if (host.endsWith(".github.io") && parts.length >= 1) {
        const owner = host.replace(".github.io", "");
        const repo  = parts[0];
        return { owner, repo, branch: "main" };
      }
    } catch {}
    return null;
  }

  /* ── Config GitHub (IndexedDB → fallback URL) ── */
  async function getConfig() {
    const cfg = {
      owner:    await dbGet("config", "gh_owner"),
      repo:     await dbGet("config", "gh_repo"),
      branch:   await dbGet("config", "gh_branch") || "main",
      tokenEnc: await dbGet("config", "gh_token_enc"),
    };
    if (!cfg.owner || !cfg.repo) {
      const inferred = inferRepoFromUrl();
      if (inferred) { cfg.owner = inferred.owner; cfg.repo = inferred.repo; cfg.branch = cfg.branch || inferred.branch; }
    }
    return cfg;
  }

  /* ── Descifrar token ── */
  async function decryptToken(payload, passphrase) {
    const enc     = new TextEncoder();
    const fromB64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
    const baseKey = await crypto.subtle.importKey(
      "raw", enc.encode(passphrase), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: fromB64(payload.salt), iterations: 200_000, hash: "SHA-256" },
      baseKey, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
    );
    const pt = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromB64(payload.iv) }, key, fromB64(payload.ct)
    );
    return new TextDecoder().decode(pt);
  }

  /* ── Estado ── */
  function getState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch { return null; }
  }

  /* ── Sanitizar para subir ── */
  function sanitize(state) {
    const clone = JSON.parse(JSON.stringify(state));
    delete clone.adminPass;
    delete clone.recoverAnswer;
    function walk(obj) {
      if (!obj || typeof obj !== "object") return;
      for (const k of Object.keys(obj)) {
        if (typeof obj[k] === "string" && obj[k].startsWith("data:") && obj[k].length > MAX_IMG_BYTES)
          obj[k] = "";
        else walk(obj[k]);
      }
    }
    walk(clone);
    return clone;
  }

  /* ── GitHub upsert ── */
  async function upsertFile(cfg, token, path, content, message, _retry) {
    const API     = "https://api.github.com";
    const headers = {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    let sha;
    try {
      const r = await fetch(`${API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}&t=${Date.now()}`, {
        headers, cache: "no-store"
      });
      if (r.ok) sha = (await r.json()).sha;
    } catch {}
    const bytes = new TextEncoder().encode(content);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000)
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    const b64 = btoa(bin);
    const body = { message, content: b64, branch: cfg.branch };
    if (sha) body.sha = sha;
    const res = await fetch(`${API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}`, {
      method: "PUT", headers, body: JSON.stringify(body),
    });
    if (res.status === 409 && !_retry) {
      await new Promise(r => setTimeout(r, 1500));
      return upsertFile(cfg, token, path, content, message, true);
    }
    if (!res.ok) {
      const d = await res.json();
      throw new Error(`GitHub ${res.status}: ${d.message}`);
    }
    return res.json();
  }

  /* ── Push ── */
  async function pushNow() {
    if (pushingNow) return;
    const state = getState();
    if (!state) return;
    const passphrase = localStorage.getItem("gh_passphrase") || window.__MTP_PASS__;
    if (!passphrase) { console.warn("[gh-sync] ⚠ Sin passphrase."); return; }
    const cfg = await getConfig();
    if (!cfg.owner || !cfg.repo || !cfg.tokenEnc) { console.warn("[gh-sync] ⚠ Falta config."); return; }
    pushingNow = true;
    try {
      const token    = await decryptToken(cfg.tokenEnc, passphrase);
      const snapshot = sanitize(state);
      snapshot.__ts  = Date.now();
      state.__ts     = snapshot.__ts;
      localStorage.setItem(LS_KEY, JSON.stringify(state));
      await upsertFile(cfg, token, REMOTE_PATH,
        JSON.stringify(snapshot, null, 2),
        `state: sync ${new Date().toISOString()}`
      );
      console.log("[gh-sync] ✅ state.json subido");
      setBadge("ok", "✅ Sync OK", "Último sync: " + new Date().toLocaleTimeString());
    } catch (e) {
      console.error("[gh-sync] ❌ Push falló:", e.message);
      setBadge("error", "❌ Error sync", e.message);
    } finally {
      pushingNow = false;
    }
  }

  /* ── PULL: aplica el remoto SIEMPRE sobre window.S, exista o no local ── */
  async function pullAndApply(force) {
    if (pulled && !force) return;
    pulled = true;
    try {
      const cfg = await getConfig();
      if (!cfg.owner || !cfg.repo) { console.warn("[gh-sync] sin owner/repo (ni en IDB ni en URL)"); return; }

      // 1) Intento por raw.githubusercontent (lo más reciente, sin caché de Pages)
      // 2) Fallback al propio Pages si el repo es privado al raw o falla red
      const candidates = [
        `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${cfg.branch}/public/data/state.json?t=${Date.now()}`,
        new URL("../public/data/state.json", location.href).href + `?t=${Date.now()}`,
      ];
      let remote = null;
      for (const url of candidates) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.status === 404) continue;
          if (!res.ok) continue;
          remote = await res.json();
          if (remote) break;
        } catch {}
      }
      if (!remote) { console.warn("[gh-sync] state.json remoto no accesible"); return; }

      const fields = [
        "config", "plans", "ownerWeb", "ownerApk", "contacts", "links",
        "avatar", "clientStores", "terms", "promoConfig", "testimonials",
        "siteIcon", "shopUrl", "jsonAutoUrl", "contractTemplate",
        "sellers", "notifications", "analytics", "promoActive", "exitTarget",
      ];

      // Asegurar que window.S existe
      if (!window.S) window.S = {};
      const local = getState() || {};

      // Comparar timestamps; si el remoto es más nuevo O si local está vacío, aplicar.
      const localEmpty = !local || Object.keys(local).length === 0;
      const remoteNewer = (remote.__ts || 0) > (local.__ts || 0);
      if (!localEmpty && !remoteNewer) return;

      let changed = false;
      for (const f of fields) {
        if (remote[f] !== undefined) {
          local[f] = remote[f];
          window.S[f] = remote[f];
          changed = true;
        }
      }
      if (!changed) return;

      local.__ts = remote.__ts || Date.now();
      window.S.__ts = local.__ts;

      // Persistir snapshot para que la próxima carga sea inmediata (offline-first).
      try { localStorage.setItem(LS_KEY, JSON.stringify(local)); } catch {}

      // Re-render
      try { window.renderAll?.(); } catch {}
      try { window.loadAdminUI?.(); } catch {}
      console.log("[gh-sync] ✅ Estado remoto aplicado");
      setBadge("ok", "✅ Actualizado", "Sincronizado con GitHub");
    } catch (e) {
      console.warn("[gh-sync] Pull falló:", e.message);
    }
  }

  function schedulePush() {
    clearTimeout(pushTimer);
    setBadge("syncing", "⏳ Guardando...", "Enviando en 5s...");
    pushTimer = setTimeout(pushNow, DEBOUNCE_MS);
  }

  /* ── Badge ── */
  function createBadge() {
    if (document.getElementById("gh-sync-badge")) return;
    const style = document.createElement("style");
    style.textContent = `
      #gh-sync-badge { position:fixed; bottom:18px; right:18px; z-index:99999;
        display:none; align-items:center; gap:7px; background:#111; border:1px solid #333;
        border-radius:20px; padding:7px 13px 7px 10px; font:700 12px Nunito,system-ui,sans-serif;
        color:#aaa; cursor:pointer; box-shadow:0 4px 20px rgba(0,0,0,.5); user-select:none; }
      #gh-sync-badge.show { display:flex; }
      #gh-sync-dot { width:9px; height:9px; border-radius:50%; background:#555; flex-shrink:0; transition:background .3s; }
      #gh-sync-dot.syncing { background:#ff6600; animation:ghp .6s infinite alternate; }
      #gh-sync-dot.ok      { background:#4caf50; box-shadow:0 0 6px #4caf50; }
      #gh-sync-dot.error   { background:#ef5350; }
      @keyframes ghp { to { opacity:.2; } }
    `;
    document.head.appendChild(style);
    const badge = document.createElement("div");
    badge.id = "gh-sync-badge";
    badge.innerHTML = `<span id="gh-sync-dot"></span><span id="gh-sync-lbl">Sync</span>`;
    badge.addEventListener("click", () => { if (!pushingNow) pushNow(); else pullAndApply(true); });
    document.body.appendChild(badge);
  }
  let hideTimer = null;
  function setBadge(state, text, tip) {
    const badge = document.getElementById("gh-sync-badge");
    const dot   = document.getElementById("gh-sync-dot");
    const lbl   = document.getElementById("gh-sync-lbl");
    if (!badge) return;
    badge.classList.add("show");
    badge.title = tip || text;
    if (dot) dot.className = state;
    if (lbl) lbl.textContent = text;
    clearTimeout(hideTimer);
    if (state === "ok") hideTimer = setTimeout(() => badge.classList.remove("show"), 6000);
  }

  function install() {
    createBadge();
    const savedPass = localStorage.getItem("gh_passphrase");
    if (savedPass) window.__MTP_PASS__ = savedPass;

    if (typeof window.saveS === "function" && !window.__ghSyncWrapped) {
      const orig = window.saveS;
      window.saveS = function (opts) {
        const r = orig.apply(this, arguments);
        if (!opts?.__skipPush) schedulePush();
        return r;
      };
      window.__ghSyncWrapped = true;
    }
    window.GH_SYNC = { pushNow, schedulePush, pullAndApply };

    // Pull inicial INMEDIATO (no esperar S — pullAndApply lo crea si hace falta)
    pullAndApply(true);

    // Periódico cada 60s
    setInterval(() => pullAndApply(true), 60_000);

    // Al volver online o al recuperar foco
    window.addEventListener("online", () => pullAndApply(true));
    document.addEventListener("visibilitychange", () => { if (!document.hidden) pullAndApply(true); });

    console.log("[gh-sync v2] instalado ✓");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(install, 600));
  } else {
    setTimeout(install, 600);
  }
})();
