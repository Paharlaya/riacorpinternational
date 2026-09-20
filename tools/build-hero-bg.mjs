/**
 * Hero background optimiser
 * -------------------------
 * Re-encodes bgriacorp.png with adaptive filtering and emits a smaller mobile
 * variant. The source is a flat vector-style illustration, so it compresses
 * far better than the exporter managed.
 *
 *   node tools/build-hero-bg.mjs
 */
import fs from "node:fs";
import zlib from "node:zlib";

const SRC = "bgriacorp.png";
const OUT = "assets/img";

function decodePng(buf) {
  let off = 8, ihdr = null; const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") ihdr = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), depth: data[8], colorType: data[9], interlace: data[12] };
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    off += 12 + len;
  }
  if (ihdr.depth !== 8 || ihdr.interlace !== 0) throw new Error("unsupported png");
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[ihdr.colorType];
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const { width, height } = ihdr, stride = width * ch;
  const out = Buffer.alloc(width * height * 4);
  let prev = Buffer.alloc(stride), p = 0;
  for (let y = 0; y < height; y++) {
    const f = raw[p++]; const line = Buffer.from(raw.subarray(p, p + stride)); p += stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? line[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0;
      let v = line[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      line[i] = v & 0xff;
    }
    prev = line;
    for (let x = 0; x < width; x++) {
      const s = x * ch, d = (y * width + x) * 4;
      out[d] = line[s]; out[d + 1] = line[s + (ch >= 3 ? 1 : 0)]; out[d + 2] = line[s + (ch >= 3 ? 2 : 0)]; out[d + 3] = 255;
    }
  }
  return { width, height, data: out };
}

const CRC = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
const crc32 = (b) => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const body = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(body)); return Buffer.concat([l, body, c]); };

/**
 * Flatten dither noise before encoding. The exporter dithers its sky gradient,
 * and that noise is what PNG cannot compress — every scanline differs slightly
 * from the last. Snapping each channel to a small step is invisible on a soft
 * gradient and collapses the file dramatically.
 */
function quantise(img, step) {
  const out = Buffer.from(img.data);
  for (let i = 0; i < out.length; i += 4) {
    out[i] = Math.min(255, Math.round(out[i] / step) * step);
    out[i + 1] = Math.min(255, Math.round(out[i + 1] / step) * step);
    out[i + 2] = Math.min(255, Math.round(out[i + 2] / step) * step);
  }
  return { width: img.width, height: img.height, data: out };
}

/** Encode as 24-bit RGB — the source has no alpha, so the channel is waste. */
function encodePng({ width, height, data }) {
  const stride = width * 3, bpp = 3;
  const rows = Buffer.alloc(width * height * 3);
  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) { rows[j] = data[i]; rows[j + 1] = data[i + 1]; rows[j + 2] = data[i + 2]; }
  const raw = Buffer.alloc((stride + 1) * height);
  let prev = Buffer.alloc(stride);
  const cand = [0, 1, 2, 3, 4].map(() => Buffer.alloc(stride));
  for (let y = 0; y < height; y++) {
    const line = rows.subarray(y * stride, (y + 1) * stride);
    let best = 0, bestScore = Infinity;
    for (let f = 0; f < 5; f++) {
      const o = cand[f]; let score = 0;
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
        let v;
        if (f === 0) v = line[i]; else if (f === 1) v = line[i] - a; else if (f === 2) v = line[i] - b;
        else if (f === 3) v = line[i] - ((a + b) >> 1);
        else { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v = line[i] - (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
        o[i] = v & 0xff; score += o[i] < 128 ? o[i] : 256 - o[i];
      }
      if (score < bestScore) { bestScore = score; best = f; }
    }
    raw[y * (stride + 1)] = best;
    cand[best].copy(raw, y * (stride + 1) + 1);
    prev = line;
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

function resize(img, w) {
  const h = Math.round(img.height * w / img.width);
  const out = Buffer.alloc(w * h * 4);
  const sx = img.width / w, sy = img.height / h;
  for (let y = 0; y < h; y++) {
    const y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    for (let x = 0; x < w; x++) {
      const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      let r = 0, g = 0, b = 0, n = 0;
      for (let j = y0; j < y1 && j < img.height; j++) for (let i = x0; i < x1 && i < img.width; i++) {
        const p = (j * img.width + i) * 4; r += img.data[p]; g += img.data[p + 1]; b += img.data[p + 2]; n++;
      }
      const d = (y * w + x) * 4;
      out[d] = Math.round(r / n); out[d + 1] = Math.round(g / n); out[d + 2] = Math.round(b / n); out[d + 3] = 255;
    }
  }
  return { width: w, height: h, data: out };
}

const src = decodePng(fs.readFileSync(SRC));
console.log(`source ${src.width}x${src.height}  ${(fs.statSync(SRC).size / 1024).toFixed(0)} KB`);
fs.mkdirSync(OUT, { recursive: true });
const STEP = Number(process.env.STEP || 6);
for (const w of [1920, 1200, 760]) {
  const img = quantise(w >= src.width ? src : resize(src, w), STEP);
  const name = `hero-bg-${w}.png`;
  fs.writeFileSync(`${OUT}/${name}`, encodePng(img));
  console.log(`  ${name.padEnd(18)} ${img.width}x${img.height}  ${(fs.statSync(`${OUT}/${name}`).size / 1024).toFixed(0)} KB`);
}
