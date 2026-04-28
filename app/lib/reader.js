/* reader.js — Lectura desde GitHub Pages (/public/...).
 * Estrategia: cache-first en IndexedDB, refresca en segundo plano.
 * Funciona tanto en el dominio de Pages como en preview.
 */
import { DB } from "./indexeddb.js";

function publicBase() {
  try { return new URL("../public/", location.href).href; } catch {}
  try { return new URL("./public/", location.href).href; } catch {}
  return "./public/";
}

export const Reader = {
  base() { return publicBase(); },

  async readJSON(relPath, { fresh = false } = {}) {
    const path = this.base() + relPath.replace(/^\/+/, "");
    if (!fresh) {
      const cached = await DB.getCache(path);
      if (cached) {
        // refresco silencioso
        this._refresh(path).catch(() => {});
        return cached.data;
      }
    }
    return this._refresh(path);
  },

  async _refresh(path) {
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status} en ${path}`);
      const data = await res.json();
      await DB.putCache(path, data, res.headers.get("etag") || null);
      return data;
    } catch (err) {
      const cached = await DB.getCache(path);
      if (cached) return cached.data;
      throw err;
    }
  },

  imageUrl(relPath) {
    return this.base() + "img/" + relPath.replace(/^\/+/, "");
  },
};
