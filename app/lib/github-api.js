/* github-api.js — Cliente de la GitHub REST API (token PAT, scope: repo).
 * Lectura: usar Reader (/public/...) preferentemente desde GitHub Pages.
 * Escritura: PUT contents/{path} con sha si existe.
 */
import { DB } from "./indexeddb.js";
import { Crypto } from "./crypto.js";

const API = "https://api.github.com";

function inferPublicConfig() {
  try {
    const { hostname, pathname } = window.location;
    if (!hostname.endsWith('.github.io')) return null;
    const parts = pathname.split('/').filter(Boolean);
    const owner = hostname.replace(/\.github\.io$/i, '');
    const repo = parts[0] || null;
    if (!owner || !repo) return null;
    return { owner, repo, branch: 'main' };
  } catch {
    return null;
  }
}

export const GitHub = {
  async getConfig() {
    const stored = {
      owner: await DB.getConfig("gh_owner"),
      repo:  await DB.getConfig("gh_repo"),
      branch: (await DB.getConfig("gh_branch")) || "main",
      tokenEnc: await DB.getConfig("gh_token_enc"),
    };
    if (stored.owner && stored.repo) return stored;
    return { ...stored, ...(inferPublicConfig() || {}) };
  },

  async setConfig({ owner, repo, branch }) {
    if (owner)  await DB.setConfig("gh_owner", owner.trim());
    if (repo)   await DB.setConfig("gh_repo", repo.trim());
    if (branch) await DB.setConfig("gh_branch", branch.trim());
  },

  async saveToken(token, passphrase) {
    const enc = await Crypto.encrypt(token, passphrase);
    await DB.setConfig("gh_token_enc", enc);
  },

  async getToken(passphrase) {
    const enc = await DB.getConfig("gh_token_enc");
    if (!enc) throw new Error("No hay token guardado.");
    return Crypto.decrypt(enc, passphrase);
  },

  async clearToken() { await DB.delConfig("gh_token_enc"); },

  async request(path, { method = "GET", token, body, headers = {} } = {}) {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    const data = text ? safeJSON(text) : null;
    if (!res.ok) {
      const msg = (data && data.message) || res.statusText;
      const err = new Error(`GitHub ${res.status}: ${msg}`);
      err.status = res.status; err.data = data;
      throw err;
    }
    return data;
  },

  async getContent({ owner, repo, branch, path, token }) {
    try {
      return await this.request(`/repos/${owner}/${repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`, { token });
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  },

  /** Crea o actualiza un archivo. content: string|Uint8Array. */
  async putContent({ owner, repo, branch, path, content, message, token, sha }) {
    const b64 = typeof content === "string" ? utf8ToB64(content) : bytesToB64(content);
    const body = { message: message || `chore: update ${path}`, content: b64, branch };
    if (sha) body.sha = sha;
    return this.request(`/repos/${owner}/${repo}/contents/${encodeURI(path)}`, {
      method: "PUT", token, body,
    });
  },

  async upsertFile({ owner, repo, branch, path, content, message, token }) {
    const existing = await this.getContent({ owner, repo, branch, path, token });
    return this.putContent({ owner, repo, branch, path, content, message, token, sha: existing?.sha });
  },

  /** Crea un commit con MÚLTIPLES archivos a la vez (commits agrupados). */
  async commitMany({ owner, repo, branch, files, message, token }) {
    // 1. Obtener ref
    const ref = await this.request(`/repos/${owner}/${repo}/git/ref/heads/${branch}`, { token });
    const baseSha = ref.object.sha;
    const baseCommit = await this.request(`/repos/${owner}/${repo}/git/commits/${baseSha}`, { token });
    const baseTree = baseCommit.tree.sha;

    // 2. Crear blobs
    const tree = [];
    for (const f of files) {
      const isBin = f.content instanceof Uint8Array;
      const blob = await this.request(`/repos/${owner}/${repo}/git/blobs`, {
        method: "POST", token,
        body: {
          content: isBin ? bytesToB64(f.content) : (f.encoding === "base64" ? f.content : utf8ToB64(f.content)),
          encoding: "base64",
        },
      });
      tree.push({ path: f.path, mode: f.mode || "100644", type: "blob", sha: blob.sha });
    }

    // 3. Crear tree
    const newTree = await this.request(`/repos/${owner}/${repo}/git/trees`, {
      method: "POST", token, body: { base_tree: baseTree, tree },
    });

    // 4. Crear commit
    const commit = await this.request(`/repos/${owner}/${repo}/git/commits`, {
      method: "POST", token,
      body: { message: message || `chore: batch update (${files.length} files)`, tree: newTree.sha, parents: [baseSha] },
    });

    // 5. Mover ref
    await this.request(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      method: "PATCH", token, body: { sha: commit.sha, force: false },
    });
    return commit;
  },
};

function safeJSON(s) { try { return JSON.parse(s); } catch { return null; } }
function utf8ToB64(str) {
  const bytes = new TextEncoder().encode(str);
  return bytesToB64(bytes);
}
function bytesToB64(bytes) {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  return btoa(bin);
}
