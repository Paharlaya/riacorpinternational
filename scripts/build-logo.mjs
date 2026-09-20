/**
 * Riacorp logo build
 * ------------------
 * Derives every logo asset from newlogo.png.
 *
 *   node scripts/build-logo.mjs
 *
 * Dependency free: PNG decode/encode runs on node's built-in zlib.
 *
 * Two things shape this script:
 *
 * 1. The source already has a real alpha channel, so unlike the previous
 *    artwork there is no white background to key out.
 * 2. The crest is only 218px tall in the source. Nothing is ever upscaled —
 *    large icons place the crest at its native size on a padded emerald
 *    canvas instead, so they stay sharp.
 *
 * The artwork's own colours (#144F41 green, #CAB477 champagne) are remapped to
 * the brand palette so the mark and the UI agree exactly.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const SRC = "brand/crest-source.png";
const OUT = "assets/img";

const EMERALD = [0x0d, 0x3e, 0x36];
const GOLD    = [0xd4, 0xaf, 0x37];
const WHITE   = [0xff, 0xff, 0xff];

/* PNG decode ------------------------------------------------------------- */

function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a png");
  let off = 8, ihdr = null;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") ihdr = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), depth: data[8], colorType: data[9], interlace: data[12] };
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    off += 12 + len;
  }
  if (!ihdr) throw new Error("no IHDR");
  if (ihdr.depth !== 8) throw new Error(`unsupported bit depth ${ihdr.depth}`);
  if (ihdr.interlace !== 0) throw new Error("interlaced png unsupported");
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[ihdr.colorType];
  if (!channels) throw new Error(`unsupported colour type ${ihdr.colorType}`);

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const { width, height } = ihdr;
  const stride = width * channels;
  const out = Buffer.alloc(width * height * 4);
  let prev = Buffer.alloc(stride), p = 0;

  for (let y = 0; y < height; y++) {
    const filter = raw[p++];
    const line = Buffer.from(raw.subarray(p, p + stride));
    p += stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? line[i - channels] : 0;
      const b = prev[i];
      const c = i >= channels ? prev[i - channels] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const pp = a + b - c;
        const pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      line[i] = v & 0xff;
    }
    prev = line;
    for (let x = 0; x < width; x++) {
      const s = x * channels, d = (y * width + x) * 4;
      if (channels === 4) { out[d] = line[s]; out[d+1] = line[s+1]; out[d+2] = line[s+2]; out[d+3] = line[s+3]; }
      else if (channels === 3) { out[d] = line[s]; out[d+1] = line[s+1]; out[d+2] = line[s+2]; out[d+3] = 255; }
      else if (channels === 2) { out[d] = out[d+1] = out[d+2] = line[s]; out[d+3] = line[s+1]; }
      else { out[d] = out[d+1] = out[d+2] = line[s]; out[d+3] = 255; }
    }
  }
  return { width, height, data: out };
}

/* PNG encode (adaptive filtering) ---------------------------------------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  return t;
})();
const crc32 = (buf) => { let c = -1; for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePng({ width, height, data }) {
  const stride = width * 4, bpp = 4;
  const raw = Buffer.alloc((stride + 1) * height);
  let prev = Buffer.alloc(stride);
  const cand = [0, 1, 2, 3, 4].map(() => Buffer.alloc(stride));
  for (let y = 0; y < height; y++) {
    const line = data.subarray(y * stride, (y + 1) * stride);
    let bestType = 0, bestScore = Infinity;
    for (let f = 0; f < 5; f++) {
      const out = cand[f]; let score = 0;
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
        let v;
        if (f === 0) v = line[i];
        else if (f === 1) v = line[i] - a;
        else if (f === 2) v = line[i] - b;
        else if (f === 3) v = line[i] - ((a + b) >> 1);
        else { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v = line[i] - (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
        out[i] = v & 0xff;
        score += out[i] < 128 ? out[i] : 256 - out[i];
      }
      if (score < bestScore) { bestScore = score; bestType = f; }
    }
    raw[y * (stride + 1)] = bestType;
    cand[bestType].copy(raw, y * (stride + 1) + 1);
    prev = line;
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* Geometry --------------------------------------------------------------- */

const px = (img, x, y) => (y * img.width + x) * 4;

function bbox(img, threshold = 12) {
  let x0 = img.width, y0 = img.height, x1 = -1, y1 = -1;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++)
    if (img.data[px(img, x, y) + 3] > threshold) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  if (x1 < 0) throw new Error("empty image");
  return { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

function crop(img, x0, y0, w, h) {
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const sy = y0 + y; if (sy < 0 || sy >= img.height) continue;
    for (let x = 0; x < w; x++) {
      const sx = x0 + x; if (sx < 0 || sx >= img.width) continue;
      img.data.copy(out, (y * w + x) * 4, px(img, sx, sy), px(img, sx, sy) + 4);
    }
  }
  return { width: w, height: h, data: out };
}

/** Box-filter resize in premultiplied space. Refuses to enlarge. */
function resize(img, w, h) {
  if (w > img.width) throw new Error(`refusing to upscale ${img.width} -> ${w}`);
  const out = Buffer.alloc(w * h * 4);
  const sx = img.width / w, sy = img.height / h;
  for (let y = 0; y < h; y++) {
    const y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    for (let x = 0; x < w; x++) {
      const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let j = y0; j < y1 && j < img.height; j++) for (let i = x0; i < x1 && i < img.width; i++) {
        const p = px(img, i, j), al = img.data[p + 3] / 255;
        r += img.data[p] * al; g += img.data[p+1] * al; b += img.data[p+2] * al; a += al; n++;
      }
      const d = (y * w + x) * 4;
      if (!n || a === 0) continue;
      out[d] = Math.round(r / a); out[d+1] = Math.round(g / a); out[d+2] = Math.round(b / a); out[d+3] = Math.round((a / n) * 255);
    }
  }
  return { width: w, height: h, data: out };
}

/** Place an image, unscaled, centred on a canvas of the given colour. */
function onCanvas(img, side, bg) {
  const out = Buffer.alloc(side * side * 4);
  for (let i = 0; i < out.length; i += 4) {
    out[i] = bg[0]; out[i+1] = bg[1]; out[i+2] = bg[2]; out[i+3] = 255;
  }
  const dst = { width: side, height: side, data: out };
  const ox = Math.round((side - img.width) / 2), oy = Math.round((side - img.height) / 2);
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
    const s = px(img, x, y), a = img.data[s + 3] / 255;
    if (a === 0) continue;
    const dx = x + ox, dy = y + oy;
    if (dx < 0 || dx >= side || dy < 0 || dy >= side) continue;
    const d = px(dst, dx, dy);
    out[d] = Math.round(img.data[s] * a + out[d] * (1 - a));
    out[d+1] = Math.round(img.data[s+1] * a + out[d+1] * (1 - a));
    out[d+2] = Math.round(img.data[s+2] * a + out[d+2] * (1 - a));
  }
  return dst;
}

/* Recolour --------------------------------------------------------------- */

/**
 * Map the artwork's two inks onto target colours, keeping each pixel's relative
 * lightness so shading and antialiasing survive. Pixels lighter than the family
 * reference blend toward white; darker ones blend toward black.
 */
function recolour(img, greenTarget, goldTarget) {
  const out = Buffer.from(img.data);
  const refGreen = 0.30, refGold = 0.63; // measured lightness of the source inks
  for (let i = 0; i < out.length; i += 4) {
    const a = out[i + 3];
    if (a === 0) continue;
    const r = out[i], g = out[i+1], b = out[i+2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const L = (mx + mn) / 2 / 255;
    const isGold = r > b + 18 && r >= g - 10;   // warm
    const target = isGold ? goldTarget : greenTarget;
    const ref = isGold ? refGold : refGreen;
    let o;
    if (L >= ref) { const t = Math.min(1, (L - ref) / (1 - ref)); o = target.map((c, k) => Math.round(c + (255 - c) * t)); }
    else { const t = Math.max(0, L / ref); o = target.map((c) => Math.round(c * t)); }
    out[i] = o[0]; out[i+1] = o[1]; out[i+2] = o[2];
  }
  return { width: img.width, height: img.height, data: out };
}

const write = (name, img) => {
  fs.writeFileSync(path.join(OUT, name), encodePng(img));
  const kb = (fs.statSync(path.join(OUT, name)).size / 1024).toFixed(1);
  console.log(`  ${name.padEnd(30)} ${String(img.width).padStart(4)}x${String(img.height).padEnd(4)} ${kb.padStart(7)} KB`);
};

/* Build ------------------------------------------------------------------ */

console.log(`Reading ${SRC} ...`);
const source = decodePng(fs.readFileSync(SRC));
console.log(`  ${source.width}x${source.height}`);

const box = bbox(source);
const art = crop(source, box.x0, box.y0, box.w, box.h);
console.log(`  artwork ${art.width}x${art.height}`);

// Split the crest from the wordmark at the widest empty band below the dome.
const rows = [];
for (let y = 0; y < art.height; y++) { let n = 0; for (let x = 0; x < art.width; x++) if (art.data[px(art, x, y) + 3] > 12) n++; rows.push(n); }
let run = null, best = null;
for (let y = Math.floor(art.height * 0.35); y < Math.floor(art.height * 0.75); y++) {
  if (rows[y] === 0) { run = run || { start: y }; run.end = y; }
  else if (run) { if (!best || run.end - run.start > best.end - best.start) best = run; run = null; }
}
if (run && (!best || run.end - run.start > best.end - best.start)) best = run;
const split = best ? Math.round((best.start + best.end) / 2) : Math.round(art.height * 0.52);
console.log(`  crest/wordmark split at row ${split}`);

const crestRaw = crop(art, 0, 0, art.width, split);
const cb = bbox(crestRaw);
const crest = crop(crestRaw, cb.x0, cb.y0, cb.w, cb.h);
console.log(`  crest ${crest.width}x${crest.height} (native ceiling for every icon)`);

/**
 * Two treatments.
 *
 * `recolour` keeps each pixel's relative lightness, which is right on a white
 * page. It is wrong on emerald: the dome's mid-tone greens map to mid-greys and
 * the mark goes muddy — which is why the header used to need a white plate.
 *
 * `flatten2` paints every neutral pixel one solid colour and keeps only the
 * alpha. That gives a crisp silhouette which sits directly on the emerald bar
 * with no plate behind it, and the knockout mountains simply show the bar
 * through them, which is how the mark is drawn to read.
 */
function flatten2(img, inkTarget, goldTarget) {
  const out = Buffer.from(img.data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    const r = out[i], g = out[i + 1], b = out[i + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    const t = chroma >= 44 && r > b ? goldTarget : inkTarget;
    out[i] = t[0]; out[i + 1] = t[1]; out[i + 2] = t[2];
  }
  return { width: img.width, height: img.height, data: out };
}

const crestDark  = recolour(crest, EMERALD, GOLD);
const crestLight = flatten2(crest, WHITE, GOLD);
const lockDark   = recolour(art, EMERALD, GOLD);
const lockLight  = flatten2(art, WHITE, GOLD);

fs.mkdirSync(OUT, { recursive: true });
console.log("\nWriting assets:");

for (const s of [56, 112, 168, 224]) {
  if (s > crestDark.width) continue;
  const h = (img) => Math.round(img.height * s / img.width);
  write(`crest-${s}.png`, resize(crestDark, s, h(crestDark)));
  write(`crest-light-${s}.png`, resize(crestLight, s, h(crestLight)));
}
write("lockup.png", lockDark);
write("lockup-light.png", lockLight);

// Icons: the mark on white, matching the plate it sits in everywhere else.
// Placed at native size on a padded canvas so nothing is ever enlarged.
const plate = Math.round(crest.width * 1.16);
write("favicon-32.png",       resize(onCanvas(crestDark, plate, WHITE), 32, 32));
write("favicon-64.png",       resize(onCanvas(crestDark, plate, WHITE), 64, 64));
write("apple-touch-icon.png", resize(onCanvas(crestDark, plate, WHITE), 180, 180));
write("icon-192.png",         resize(onCanvas(crestDark, plate, WHITE), 192, 192));
write("icon-512.png",         onCanvas(crestDark, 512, WHITE));

console.log("\nDone. Palette: emerald #0D3E36, gold #D4AF37.");
