/* backup.js — Crea snapshots locales y opcionalmente los sube a /private/backups/. */
import { DB } from "./indexeddb.js";
import { Writer } from "./writer.js";

export const Backup = {
  async snapshot(label = "manual") {
    const config = {};
    for (const k of ["gh_owner", "gh_repo", "gh_branch"]) config[k] = await DB.getConfig(k);
    const payload = {
      label, ts: Date.now(),
      config,
      logs: await DB.listLogs(500),
      queue: await DB.listQueue(),
    };
    await DB.putBackup(payload);
    return payload;
  },

  async upload(label = "auto", passphrase) {
    const snap = await this.snapshot(label);
    const name = `backup-${new Date(snap.ts).toISOString().replace(/[:.]/g, "-")}.json`;
    return Writer._writeOrQueue({
      path: `private/backups/${name}`,
      content: JSON.stringify(snap, null, 2),
      message: `backup: ${label}`,
      passphrase,
      kind: "json",
    });
  },
};
