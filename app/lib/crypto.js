/* crypto.js — Encriptación AES-GCM con passphrase del admin (WebCrypto). */
export const Crypto = (() => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  async function deriveKey(passphrase, salt) {
    const baseKey = await crypto.subtle.importKey(
      "raw", enc.encode(passphrase), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 200_000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  function b64(buf) { return btoa(String.fromCharCode(...new Uint8Array(buf))); }
  function fromB64(str) { return Uint8Array.from(atob(str), (c) => c.charCodeAt(0)); }

  async function encrypt(plain, passphrase) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plain));
    return { v: 1, salt: b64(salt), iv: b64(iv), ct: b64(ct) };
  }

  async function decrypt(payload, passphrase) {
    const salt = fromB64(payload.salt);
    const iv = fromB64(payload.iv);
    const ct = fromB64(payload.ct);
    const key = await deriveKey(passphrase, salt);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    return dec.decode(pt);
  }

  return { encrypt, decrypt };
})();
