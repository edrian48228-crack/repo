/* writer.js — Escritura JSON e imágenes en GitHub.
 * Si está offline, encola y deja que sync.js lo procese.
 */
import { GitHub } from "./github-api.js";
import { DB } from "./indexeddb.js";

export const Writer = {
  async writeJSON(relPath, obj, { message, passphrase } = {}) {
    const path = "public/" + relPath.replace(/^\/+/, "");
    const content = JSON.stringify(obj, null, 2);
    return this._writeOrQueue({ path, content, message: message || `data: update ${relPath}`, passphrase, kind: "json" });
  },

  /** bytes: Uint8Array (ya optimizada con image-opt.js) */
  async writeImage(relPath, bytes, { message, passphrase } = {}) {
    const path = "public/img/" + relPath.replace(/^\/+/, "");
    return this._writeOrQueue({ path, content: bytes, message: message || `img: upload ${relPath}`, passphrase, kind: "image" });
  },

  async _writeOrQueue({ path, content, message, passphrase, kind }) {
    if (!navigator.onLine) {
      await DB.enqueue({ kind, path, content: await serialize(content), message });
      await DB.log("info", "queued (offline)", { path });
      return { queued: true };
    }
    // Fallback: passphrase cacheada en sesión (se setea al guardar el token en Admin)
    const pass = passphrase || (typeof window !== "undefined" ? window.__MTP_PASS__ : null);
    try {
      const cfg = await GitHub.getConfig();
      if (!cfg.owner || !cfg.repo) throw new Error("GitHub no configurado (falta owner/repo).");
      if (!cfg.tokenEnc) throw new Error("No hay token guardado. Configúralo en Admin → GitHub.");
      if (!pass) throw new Error("Falta passphrase en sesión. Vuelve a Admin → GitHub y pulsa 'Guardar config + token'.");
      const token = await GitHub.getToken(pass);
      const res = await GitHub.upsertFile({ ...cfg, path, content, message, token });
      await DB.log("ok", "commit", { path, sha: res.commit?.sha });
      return res;
    } catch (err) {
      await DB.enqueue({ kind, path, content: await serialize(content), message });
      await DB.log("warn", "queued (error)", { path, err: String(err) });
      throw err;
    }
  },
};

async function serialize(content) {
  if (typeof content === "string") return { type: "text", value: content };
  // Uint8Array -> base64
  let bin = ""; const chunk = 0x8000;
  for (let i = 0; i < content.length; i += chunk) bin += String.fromCharCode.apply(null, content.subarray(i, i + chunk));
  return { type: "b64", value: btoa(bin) };
}
