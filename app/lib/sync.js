/* sync.js — Sincronización automática de la cola en commits agrupados. */
import { DB } from "./indexeddb.js";
import { GitHub } from "./github-api.js";

export const Sync = {
  _running: false,
  _interval: null,

  start({ everyMs = 30000 } = {}) {
    if (this._interval) return;
    this._interval = setInterval(() => this.flush().catch(() => {}), everyMs);
    window.addEventListener("online", () => this.flush().catch(() => {}));
  },

  stop() { clearInterval(this._interval); this._interval = null; },

  async flush(passphrase) {
    if (this._running) return;
    if (!navigator.onLine) return;
    const items = await DB.listQueue();
    if (!items.length) return;
    this._running = true;
    try {
      const cfg = await GitHub.getConfig();
      if (!cfg.tokenEnc) return; // sin token, no se puede commitear
      // Si no se pasó passphrase, usar la cacheada en sesión
      const pass = passphrase || window.__MTP_PASS__;
      if (!pass) { await DB.log("warn", "sync sin passphrase"); return; }
      const token = await GitHub.getToken(pass);

      const files = [];
      for (const it of items) {
        const content = it.content?.type === "b64"
          ? Uint8Array.from(atob(it.content.value), (c) => c.charCodeAt(0))
          : it.content?.value ?? "";
        files.push({ path: it.path, content });
      }
      await GitHub.commitMany({
        ...cfg, files, token,
        message: `sync: ${files.length} archivo(s) - ${new Date().toISOString()}`,
      });
      for (const it of items) await DB.dequeue(it.id);
      await DB.log("ok", "sync flush", { count: files.length });
    } catch (err) {
      await DB.log("error", "sync error", { err: String(err) });
    } finally {
      this._running = false;
    }
  },
};
