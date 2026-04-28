/* admin-config.js — Modal de administración para token, passphrase, repo, init y sync. */
import { GitHub } from "./github-api.js";
import { RepoInit } from "./repo-init.js";
import { Sync } from "./sync.js";
import { Backup } from "./backup.js";
import { DB } from "./indexeddb.js";

const MODAL_ID = "mtp-admin-cfg-modal";

function styles() {
  if (document.getElementById("mtp-admin-cfg-css")) return;
  const css = `
    .mtp-cfg-bd{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:10000;display:none;
      align-items:flex-start;justify-content:center;overflow-y:auto;padding:30px 14px}
    .mtp-cfg-bd.open{display:flex}
    .mtp-cfg{background:var(--bg2,#0e0e0e);border:1px solid var(--bdr,#2a2a2a);border-radius:14px;
      width:100%;max-width:560px;padding:22px;color:var(--t1,#fff);font-family:var(--fb,Nunito)}
    .mtp-cfg h2{font-family:var(--fh,Nunito);color:var(--o,#ff6600);margin-bottom:6px;font-size:20px}
    .mtp-cfg p.lead{color:var(--t2,#c0b0a0);font-size:13px;margin-bottom:16px}
    .mtp-cfg .row{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
    .mtp-cfg label{font-weight:700;font-size:12.5px;color:var(--t1,#fff)}
    .mtp-cfg input{background:#0a0a0a;border:1px solid var(--bdr,#2a2a2a);border-radius:8px;padding:10px 12px;
      color:#fff;font-family:var(--fm,monospace);font-size:13px;outline:none}
    .mtp-cfg input:focus{border-color:var(--o,#ff6600)}
    .mtp-cfg .grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .mtp-cfg .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
    .mtp-cfg button{background:linear-gradient(135deg,#ff2200,#ff6600);border:none;color:#fff;
      padding:10px 14px;border-radius:8px;font-weight:800;cursor:pointer;font-size:13px}
    .mtp-cfg button.ghost{background:transparent;border:1px solid var(--bdr,#2a2a2a);color:var(--t1,#fff)}
    .mtp-cfg button:hover{filter:brightness(1.08)}
    .mtp-cfg .log{margin-top:14px;background:#000;border:1px solid var(--bdr,#2a2a2a);border-radius:8px;
      padding:10px;font-family:var(--fm,monospace);font-size:12px;color:#9aff9a;max-height:180px;overflow-y:auto;white-space:pre-wrap}
    .mtp-cfg .x{position:absolute;top:14px;right:18px;background:transparent;border:none;color:#fff;
      font-size:26px;cursor:pointer;line-height:1}
    .mtp-cfg-wrap{position:relative;width:100%;display:flex;justify-content:center}
    .mtp-cfg .hint{font-size:11.5px;color:var(--t3,#786050)}
  `;
  const el = document.createElement("style");
  el.id = "mtp-admin-cfg-css";
  el.textContent = css;
  document.head.appendChild(el);
}

function build() {
  if (document.getElementById(MODAL_ID)) return;
  const bd = document.createElement("div");
  bd.className = "mtp-cfg-bd"; bd.id = MODAL_ID;
  bd.innerHTML = `
    <div class="mtp-cfg-wrap">
      <div class="mtp-cfg">
        <button class="x" data-close>×</button>
        <h2>⚙️ Configuración PWA + GitHub</h2>
        <p class="lead">Conecta tu repositorio para sincronizar datos e imágenes. El token se guarda <strong>encriptado (AES-GCM)</strong> con tu passphrase.</p>

        <div class="grid2">
          <div class="row"><label>Owner (usuario u org)</label><input id="cfg-owner" placeholder="mi-usuario"></div>
          <div class="row"><label>Repositorio</label><input id="cfg-repo" placeholder="mi-tienda-pro"></div>
        </div>
        <div class="row"><label>Rama</label><input id="cfg-branch" placeholder="main" value="main"></div>
        <div class="row">
          <label>GitHub Token (PAT, scope: <code>repo</code>)</label>
          <input id="cfg-token" type="password" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" autocomplete="off">
          <span class="hint">Crear en github.com → Settings → Developer settings → Personal access tokens.</span>
        </div>
        <div class="row">
          <label>Passphrase (encripta el token en este dispositivo)</label>
          <input id="cfg-pass" type="password" placeholder="passphrase fuerte" autocomplete="new-password">
          <span class="hint">No se guarda. La pedimos al sincronizar/escribir.</span>
        </div>

        <div class="actions">
          <button data-act="save">💾 Guardar config + token</button>
          <button class="ghost" data-act="test">🔌 Probar conexión</button>
          <button class="ghost" data-act="init">🗂️ Crear /app /public /private</button>
          <button class="ghost" data-act="flush">🔁 Sincronizar ahora</button>
          <button class="ghost" data-act="backup">💼 Backup ahora</button>
          <button class="ghost" data-act="forget">🗑️ Olvidar token</button>
        </div>
        <div class="log" id="cfg-log">Listo.</div>
      </div>
    </div>
  `;
  document.body.appendChild(bd);

  const $ = (s) => bd.querySelector(s);
  const log = (m) => { const l = $("#cfg-log"); l.textContent += "\n" + m; l.scrollTop = l.scrollHeight; };
  const getPass = () => $("#cfg-pass").value || window.__MTP_PASS__ || prompt("Passphrase:");

  bd.addEventListener("click", (e) => { if (e.target === bd || e.target.dataset.close !== undefined) close(); });

  bd.querySelectorAll("button[data-act]").forEach((b) => b.addEventListener("click", async () => {
    const act = b.dataset.act;
    try {
      if (act === "save") {
        await GitHub.setConfig({ owner: $("#cfg-owner").value, repo: $("#cfg-repo").value, branch: $("#cfg-branch").value });
        const tok = $("#cfg-token").value.trim();
        const pass = getPass();
        if (tok && pass) {
          await GitHub.saveToken(tok, pass);
          window.__MTP_PASS__ = pass;
          try { sessionStorage.setItem("__MTP_PASS__", pass); } catch {}
        }
        log("✓ Config guardada.");
        try { if (window.MTP?.GhSync) { await window.MTP.GhSync.pushNow(); log("✓ state.json publicado."); } }
        catch (e) { log("✗ push inicial: " + e.message); }
      } else if (act === "test") {
        const cfg = await GitHub.getConfig();
        const token = await GitHub.getToken(getPass());
        const r = await GitHub.request(`/repos/${cfg.owner}/${cfg.repo}`, { token });
        log(`✓ Conectado: ${r.full_name} (default: ${r.default_branch})`);
      } else if (act === "init") {
        window.__MTP_PASS__ = getPass();
        const r = await RepoInit.ensureStructure({ passphrase: window.__MTP_PASS__, onLog: log });
        log(`✓ Listo. Creados: ${r.created}`);
      } else if (act === "flush") {
        window.__MTP_PASS__ = getPass();
        await Sync.flush(window.__MTP_PASS__); log("✓ Sync ejecutado.");
      } else if (act === "backup") {
        window.__MTP_PASS__ = getPass();
        const r = await Backup.upload("manual", window.__MTP_PASS__); log("✓ Backup: " + JSON.stringify(r));
      } else if (act === "forget") {
        await GitHub.clearToken();
        window.__MTP_PASS__ = null;
        try { sessionStorage.removeItem("__MTP_PASS__"); } catch {}
        log("✓ Token borrado.");
      }
    } catch (err) { log("✗ " + err.message); }
  }));

  // Prefill
  (async () => {
    const c = await GitHub.getConfig();
    if (c.owner) $("#cfg-owner").value = c.owner;
    if (c.repo)  $("#cfg-repo").value = c.repo;
    if (c.branch)$("#cfg-branch").value = c.branch;
  })();
}

function open()  { build(); document.getElementById(MODAL_ID).classList.add("open"); }
function close() { document.getElementById(MODAL_ID)?.classList.remove("open"); }

export const AdminConfig = { open, close };

// Atajo global + botón flotante (sólo cuando el admin ya entró en tu modal de admin original)
window.openMTPConfig = open;

// NOTA: el botón flotante ⚙️ en la portada se eliminó por seguridad.
// La configuración PWA + GitHub solo es accesible desde Admin → Avanzado.
// Si por accesibilidad se necesita en el futuro, reactivar la función injectButton().

// Limpia cualquier botón residual de versiones anteriores
function removeLegacyButton() {
  document.getElementById("mtp-cfg-btn")?.remove();
}

styles();
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", removeLegacyButton);
else removeLegacyButton();

/* ───────────────────────────────────────────────────────────
 * Integración DENTRO del panel de administración original.
 * Inyecta una tarjeta "GitHub / Sincronización" en la pestaña
 * "Avanzado" (#atb-config2) cuando el admin la abre.
 * ─────────────────────────────────────────────────────────── */
function buildInlineGithubCard() {
  const tab = document.getElementById("atb-config2");
  if (!tab || document.getElementById("mtp-inline-gh")) return;

  const wrap = document.createElement("div");
  wrap.id = "mtp-inline-gh";
  wrap.style.cssText = "margin-top:18px";
  wrap.innerHTML = `
    <div class="tbar"><h2>🐙 GitHub / Sincronización PWA</h2></div>
    <p style="color:var(--t2);font-size:13px;margin-bottom:14px">
      Conecta tu repositorio de GitHub. El sistema usará GitHub como base de datos
      (lectura desde <code>/public</code>, escritura con tu token). El token se guarda
      <strong>encriptado con AES-GCM</strong> usando tu passphrase.
    </p>
    <div style="background:var(--card);border:1px solid var(--bdr);border-radius:var(--rc);padding:20px">
      <div class="fr">
        <div class="fg"><label class="lbl">Owner (usuario u organización)</label>
          <input type="text" class="inp" id="ghc-owner" placeholder="mi-usuario" style="margin:0"></div>
        <div class="fg"><label class="lbl">Repositorio</label>
          <input type="text" class="inp" id="ghc-repo" placeholder="mi-tienda-pro" style="margin:0"></div>
      </div>
      <div class="fg" style="margin-top:10px"><label class="lbl">Rama</label>
        <input type="text" class="inp" id="ghc-branch" placeholder="main" value="main" style="margin:0"></div>
      <div class="fg" style="margin-top:10px">
        <label class="lbl">🔑 GitHub Token (PAT, scope: <code>repo</code>)</label>
        <div style="display:flex;gap:6px;align-items:center">
          <input type="password" class="inp" id="ghc-token" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            autocomplete="off" style="margin:0;flex:1;font-family:var(--fm,monospace)">
          <button type="button" onclick="(function(b){var i=document.getElementById('ghc-token');i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'👁':'🙈';})(this)"
            style="background:var(--card2);border:1px solid var(--bdr);border-radius:var(--rb);padding:9px 12px;cursor:pointer;font-size:15px;color:var(--t2)">👁</button>
        </div>
        <small style="color:var(--t3);font-size:11.5px;margin-top:4px;display:block">
          Crear en: github.com → Settings → Developer settings → Personal access tokens (classic) → scope <b>repo</b>.
        </small>
      </div>
      <div class="fg" style="margin-top:10px">
        <label class="lbl">🔐 Passphrase (encripta el token en este dispositivo)</label>
        <input type="password" class="inp" id="ghc-pass" placeholder="passphrase fuerte"
          autocomplete="new-password" style="margin:0">
        <small style="color:var(--t3);font-size:11.5px;margin-top:4px;display:block">
          No se guarda. Te la pediremos de nuevo al sincronizar.
        </small>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">
        <button class="btn btn-fire" id="ghc-save">💾 Guardar config + token</button>
        <button class="btn btn-dk btn-sm" id="ghc-test">🔌 Probar conexión</button>
        <button class="btn btn-dk btn-sm" id="ghc-init">🗂️ Crear /app /public /private</button>
        <button class="btn btn-dk btn-sm" id="ghc-flush">🔁 Sincronizar ahora</button>
        <button class="btn btn-dk btn-sm" id="ghc-backup">💼 Backup ahora</button>
        <button class="btn btn-dng btn-sm" id="ghc-clear-cache">🧹 Limpiar caché PWA</button>
        <button class="btn btn-dng btn-sm" id="ghc-forget">🗑️ Olvidar token</button>
      </div>

      <div id="ghc-log" style="margin-top:14px;background:#000;border:1px solid var(--bdr);border-radius:var(--rb);
        padding:10px;font-family:var(--fm,monospace);font-size:12px;color:#9aff9a;max-height:180px;
        overflow-y:auto;white-space:pre-wrap">Listo. Configura tu token y prueba la conexión.</div>
    </div>
  `;
  tab.appendChild(wrap);

  const $ = (s) => wrap.querySelector(s);
  const log = (m) => { const l = $("#ghc-log"); l.textContent += "\n" + m; l.scrollTop = l.scrollHeight; };
  const getPass = () => $("#ghc-pass").value || window.__MTP_PASS__ || prompt("Passphrase:");

  // Prefill desde IndexedDB
  (async () => {
    try {
      const c = await GitHub.getConfig();
      if (c.owner)  $("#ghc-owner").value  = c.owner;
      if (c.repo)   $("#ghc-repo").value   = c.repo;
      if (c.branch) $("#ghc-branch").value = c.branch;
    } catch {}
  })();

  $("#ghc-save").addEventListener("click", async () => {
    try {
      await GitHub.setConfig({
        owner: $("#ghc-owner").value.trim(),
        repo: $("#ghc-repo").value.trim(),
        branch: $("#ghc-branch").value.trim() || "main",
      });
      const tok = $("#ghc-token").value.trim();
      const pass = getPass();
      if (tok && pass) {
        await GitHub.saveToken(tok, pass);
        window.__MTP_PASS__ = pass;
        try { sessionStorage.setItem("__MTP_PASS__", pass); } catch {}
      }
      log("✓ Configuración y token guardados (encriptados).");
      log("→ Forzando primer push del estado a state.json...");
      try {
        if (window.MTP?.GhSync) { await window.MTP.GhSync.pushNow(); log("✓ state.json publicado en GitHub."); }
      } catch (e) { log("✗ push inicial: " + e.message); }
    } catch (e) { log("✗ " + e.message); }
  });
  $("#ghc-test").addEventListener("click", async () => {
    try {
      const cfg = await GitHub.getConfig();
      const token = await GitHub.getToken(getPass());
      const r = await GitHub.request(`/repos/${cfg.owner}/${cfg.repo}`, { token });
      log(`✓ Conectado: ${r.full_name} (rama por defecto: ${r.default_branch})`);
    } catch (e) { log("✗ " + e.message); }
  });
  $("#ghc-init").addEventListener("click", async () => {
    try {
      window.__MTP_PASS__ = getPass();
      const r = await RepoInit.ensureStructure({ passphrase: window.__MTP_PASS__, onLog: log });
      log(`✓ Estructura lista. Creados: ${r.created}`);
    } catch (e) { log("✗ " + e.message); }
  });
  $("#ghc-flush").addEventListener("click", async () => {
    try { window.__MTP_PASS__ = getPass(); await Sync.flush(window.__MTP_PASS__); log("✓ Sync ejecutado."); }
    catch (e) { log("✗ " + e.message); }
  });
  $("#ghc-backup").addEventListener("click", async () => {
    try {
      window.__MTP_PASS__ = getPass();
      const r = await Backup.upload("manual", window.__MTP_PASS__);
      log("✓ Backup subido: " + JSON.stringify(r));
    } catch (e) { log("✗ " + e.message); }
  });
  $("#ghc-forget").addEventListener("click", async () => {
    try {
      await GitHub.clearToken();
      window.__MTP_PASS__ = null;
      try { sessionStorage.removeItem("__MTP_PASS__"); } catch {}
      log("✓ Token borrado de este dispositivo.");
    } catch (e) { log("✗ " + e.message); }
  });
  $("#ghc-clear-cache").addEventListener("click", async () => {
    if (!confirm("¿Limpiar toda la caché del navegador (Service Worker + Cache Storage)?\nLa app se recargará.")) return;
    try {
      log("→ Limpiando Service Workers...");
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) { await r.unregister(); log("  ✓ SW unregister: " + (r.scope || "")); }
      }
      log("→ Limpiando Cache Storage...");
      if ("caches" in window) {
        const keys = await caches.keys();
        for (const k of keys) { await caches.delete(k); log("  ✓ cache: " + k); }
      }
      log("✓ Caché limpia. Recargando en 1s...");
      setTimeout(() => location.reload(true), 1000);
    } catch (e) { log("✗ " + e.message); }
  });
}

// Engancha cuando el admin abre la pestaña "Avanzado" o cuando aparece el panel admin
function tryInjectInline() {
  buildInlineGithubCard();
}
const obs = new MutationObserver(tryInjectInline);
if (document.body) obs.observe(document.body, { childList: true, subtree: true });
else document.addEventListener("DOMContentLoaded", () => obs.observe(document.body, { childList: true, subtree: true }));
// Intento inicial por si el panel ya existe
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tryInjectInline);
else tryInjectInline();
