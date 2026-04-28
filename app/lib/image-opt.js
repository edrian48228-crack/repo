/* image-opt.js — Compresión + WebP + miniaturas con Canvas API nativo. */
export const ImageOpt = {
  /** file: File|Blob -> { webp: Uint8Array, thumb: Uint8Array, width, height } */
  async prepare(file, { maxW = 1600, maxH = 1600, quality = 0.82, thumbW = 320, thumbH = 320, thumbQ = 0.7 } = {}) {
    const bmp = await this._bitmap(file);
    const main = await this._toWebP(bmp, maxW, maxH, quality);
    const thumb = await this._toWebP(bmp, thumbW, thumbH, thumbQ);
    if (bmp.close) bmp.close();
    return { ...main, thumb: thumb.bytes };
  },

  async _bitmap(file) {
    if (typeof createImageBitmap === "function") return createImageBitmap(file);
    return new Promise((res, rej) => {
      const img = new Image(); img.onload = () => res(img); img.onerror = rej;
      img.src = URL.createObjectURL(file);
    });
  },

  async _toWebP(src, maxW, maxH, q) {
    const w0 = src.width, h0 = src.height;
    const r = Math.min(1, maxW / w0, maxH / h0);
    const w = Math.max(1, Math.round(w0 * r));
    const h = Math.max(1, Math.round(h0 * r));
    const canvas = ("OffscreenCanvas" in window) ? new OffscreenCanvas(w, h) : Object.assign(document.createElement("canvas"), { width: w, height: h });
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, 0, 0, w, h);
    const blob = await (canvas.convertToBlob
      ? canvas.convertToBlob({ type: "image/webp", quality: q })
      : new Promise((res) => canvas.toBlob(res, "image/webp", q)));
    const bytes = new Uint8Array(await blob.arrayBuffer());
    return { bytes, width: w, height: h };
  },
};
