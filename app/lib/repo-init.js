/* repo-init.js — Crea automáticamente la estructura /app, /public, /private en el repo
 * con commits iniciales y archivos vacíos (.gitkeep + READMEs).
 */
import { GitHub } from "./github-api.js";

const STRUCTURE = [
  { path: "app/.gitkeep", content: "" },
  { path: "app/README.md", content: "# /app\n\nCódigo fuente del PWA (HTML, JS módulos, manifest, service worker).\n" },
  { path: "public/.gitkeep", content: "" },
  { path: "public/README.md", content: "# /public\n\nDatos públicos legibles vía GitHub Pages: JSON de catálogo, imágenes optimizadas.\n" },
  { path: "public/data/.gitkeep", content: "" },
  { path: "public/data/state.json", content: JSON.stringify({ __ts: 0 }, null, 2) },
  { path: "public/img/.gitkeep", content: "" },
  { path: "private/.gitkeep", content: "" },
  { path: "private/README.md", content: "# /private\n\nBackups, logs y archivos sensibles. No servir desde Pages.\n" },
  { path: "private/backups/.gitkeep", content: "" },
];

export const RepoInit = {
  async ensureStructure({ passphrase, onLog = () => {} } = {}) {
    const cfg = await GitHub.getConfig();
    if (!cfg.owner || !cfg.repo) throw new Error("Configura owner/repo primero.");
    const token = await GitHub.getToken(passphrase);

    const toCreate = [];
    for (const f of STRUCTURE) {
      const exists = await GitHub.getContent({ ...cfg, path: f.path, token });
      if (!exists) toCreate.push(f);
      onLog(`${exists ? "✓" : "+"} ${f.path}`);
    }
    if (!toCreate.length) { onLog("Estructura ya existente."); return { created: 0 }; }
    await GitHub.commitMany({
      ...cfg, token, files: toCreate,
      message: `init: estructura /app /public /private (${toCreate.length} archivos)`,
    });
    onLog(`Commit inicial creado con ${toCreate.length} archivos.`);
    return { created: toCreate.length };
  },
};
