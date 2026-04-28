/* indexeddb.js — Almacenamiento offline (config, cache de JSON, cola de cambios, logs, backups). */
export const DB = (() => {
  const NAME = "mitiendapro";
  const VERSION = 2;
  let dbp = null;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("config")) db.createObjectStore("config", { keyPath: "key" });
        if (!db.objectStoreNames.contains("cache"))  db.createObjectStore("cache",  { keyPath: "path" });
        if (!db.objectStoreNames.contains("queue"))  db.createObjectStore("queue",  { keyPath: "id", autoIncrement: true });
        if (!db.objectStoreNames.contains("logs"))   db.createObjectStore("logs",   { keyPath: "id", autoIncrement: true });
        if (!db.objectStoreNames.contains("backups"))db.createObjectStore("backups",{ keyPath: "id", autoIncrement: true });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }

  async function tx(store, mode = "readonly") {
    const db = await open();
    return db.transaction(store, mode).objectStore(store);
  }

  const wrap = (req) => new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); });

  return {
    async setConfig(key, value) { return wrap((await tx("config", "readwrite")).put({ key, value })); },
    async getConfig(key)        { const r = await wrap((await tx("config")).get(key)); return r ? r.value : null; },
    async delConfig(key)        { return wrap((await tx("config", "readwrite")).delete(key)); },

    async putCache(path, data, etag) { return wrap((await tx("cache", "readwrite")).put({ path, data, etag, ts: Date.now() })); },
    async getCache(path)             { return wrap((await tx("cache")).get(path)); },

    async enqueue(item)              { return wrap((await tx("queue", "readwrite")).add({ ...item, ts: Date.now() })); },
    async listQueue()                { return wrap((await tx("queue")).getAll()); },
    async dequeue(id)                { return wrap((await tx("queue", "readwrite")).delete(id)); },

    async log(level, msg, meta = {}) { return wrap((await tx("logs", "readwrite")).add({ level, msg, meta, ts: Date.now() })); },
    async listLogs(limit = 200)      { const all = await wrap((await tx("logs")).getAll()); return all.slice(-limit).reverse(); },

    async putBackup(payload)         { return wrap((await tx("backups", "readwrite")).add({ payload, ts: Date.now() })); },
    async listBackups()              { return wrap((await tx("backups")).getAll()); },
  };
})();
