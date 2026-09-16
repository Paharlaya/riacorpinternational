/**
 * RiaCorp logo build
 * ------------------
 * Turns the supplied artwork (riacorplogo.png, 2048x2048, artwork on opaque
 * white) into the transparent, correctly sized assets the site needs.
 *
 * Dependency free: PNG decode/encode is done here with node's built-in zlib.
 * Run manually and commit the output:
 *
 *   node tools/logo-build.mjs
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const SRC = "riacorplogo.png";
const OUT = "assets/img";

/* PNG decode ------------------------------------------------------------- */

function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a png");
  let off = 8;
  let ihdr = null;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        depth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "IDAT") idat.push(data);
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
  let prev = Buffer.alloc(stride);
  let p = 0;

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

/* PNG encode ------------------------------------------------------------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng({ width, height, data }) {
  const stride = width * 4;
  const bpp = 4;
  const raw = Buffer.alloc((stride + 1) * height);
  let prev = Buffer.alloc(stride);

  // Adaptive filtering: try all five, keep whichever has the smallest sum of
  // absolute signed bytes. That is the heuristic the PNG spec recommends and
  // it is worth several-fold on antialiased artwork.
  const cand = [0, 1, 2, 3, 4].map(() => Buffer.alloc(stride));
  for (let y = 0; y < height; y++) {
    const line = data.subarray(y * stride, (y + 1) * stride);
    let bestType = 0, bestScore = Infinity;
    for (let f = 0; f < 5; f++) {
      const out = cand[f];
      let score = 0;
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? line[i - bpp] : 0;
        const b = prev[i];
        const c = i >= bpp ? prev[i - bpp] : 0;
        let v;
        if (f === 0) v = line[i];
        else if (f === 1) v = line[i] - a;
        else if (f === 2) v = line[i] - b;
        else if (f === 3) v = line[i] - ((a + b) >> 1);
        else {
          const pp = a + b - c;
          const pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
          v = line[i] - (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
        }
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
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* Image helpers ---------------------------------------------------------- */

const px = (img, x, y) => (y * img.width + x) * 4;

/**
 * The artwork is ink painted over opaque white: P = a*C + (1-a)*255.
 *
 * Neutral ink (the black linework) recovers cleanly from its darkness alone,
 * a = (255-min)/255. Coloured ink does not -- fully opaque gold has min=58,
 * which would read as 77% alpha and leave the gold washed out. But chroma
 * scales linearly with coverage too, so for coloured pixels a = chroma/maxChroma
 * recovers it exactly. Taking the max of the two handles both, and every
 * antialiased edge between them, with no white fringe.
 */
function keyWhite(img) {
  const { width, height, data } = img;
  let maxChroma = 0;
  for (let i = 0; i < data.length; i += 4) {
    const c = Math.max(data[i], data[i+1], data[i+2]) - Math.min(data[i], data[i+1], data[i+2]);
    if (c > maxChroma) maxChroma = c;
  }
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const mn = Math.min(r, g, b);
    const chroma = Math.max(r, g, b) - mn;
    let a = Math.max((255 - mn) / 255, maxChroma ? chroma / maxChroma : 0);
    a = Math.min(1, Math.max(0, a)) * (data[i+3] / 255);
    if (a < 0.012) continue; // leave fully transparent
    // unpremultiply against white
    const un = (v) => Math.min(255, Math.max(0, Math.round((v - 255 * (1 - a)) / a)));
    out[i] = un(r); out[i+1] = un(g); out[i+2] = un(b); out[i+3] = Math.round(a * 255);
  }
  return { width, height, data: out, maxChroma };
}

/**
 * The artwork is drawn in exactly two inks: black linework and gold fill.
 * Recovered colour wobbles pixel to pixel, which is pure noise to the deflate
 * pass -- a 88px mark came out at 19 KB. Snapping every pixel to one of the two
 * inks leaves the RGB planes almost constant, hands all the detail to the alpha
 * plane, and looks identical because the source really is flat colour.
 */
function posterise(img, ink, gold) {
  const out = Buffer.from(img.data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) { out[i] = out[i+1] = out[i+2] = 0; continue; }
    const r = out[i], g = out[i+1], b = out[i+2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    const to = chroma >= 44 ? gold : ink;
    out[i] = to[0]; out[i+1] = to[1]; out[i+2] = to[2];
  }
  return { width: img.width, height: img.height, data: out };
}

function bbox(img, threshold = 8) {
  let x0 = img.width, y0 = img.height, x1 = -1, y1 = -1;
  for (let y = 0; y < img.height; y++)
    for (let x = 0; x < img.width; x++)
      if (img.data[px(img, x, y) + 3] > threshold) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
  if (x1 < 0) throw new Error("image is empty after keying");
  return { x0, y0, x1, y1 };
}

function crop(img, x0, y0, w, h) {
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const sy = y0 + y;
    if (sy < 0 || sy >= img.height) continue;
    for (let x = 0; x < w; x++) {
      const sx = x0 + x;
      if (sx < 0 || sx >= img.width) continue;
      img.data.copy(out, (y * w + x) * 4, px(img, sx, sy), px(img, sx, sy) + 4);
    }
  }
  return { width: w, height: h, data: out };
}

/** Square the canvas by padding the short axis, so icons never distort. */
function square(img, pad = 0) {
  const side = Math.max(img.width, img.height) + pad * 2;
  const out = Buffer.alloc(side * side * 4);
  const dst = { width: side, height: side, data: out };
  const ox = Math.round((side - img.width) / 2);
  const oy = Math.round((side - img.height) / 2);
  for (let y = 0; y < img.height; y++)
    for (let x = 0; x < img.width; x++)
      img.data.copy(out, px(dst, x + ox, y + oy), px(img, x, y), px(img, x, y) + 4);
  return dst;
}

/** Box-filter downsample in premultiplied space, or edges pick up haloes. */
function resize(img, w, h) {
  const out = Buffer.alloc(w * h * 4);
  const sx = img.width / w, sy = img.height / h;
  for (let y = 0; y < h; y++) {
    const y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    for (let x = 0; x < w; x++) {
      const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let j = y0; j < y1 && j < img.height; j++)
        for (let i = x0; i < x1 && i < img.width; i++) {
          const p = px(img, i, j), al = img.data[p + 3] / 255;
          r += img.data[p] * al; g += img.data[p+1] * al; b += img.data[p+2] * al;
          a += al; n++;
        }
      const d = (y * w + x) * 4;
      if (!n || a === 0) continue;
      out[d] = Math.round(r / a); out[d+1] = Math.round(g / a);
      out[d+2] = Math.round(b / a); out[d+3] = Math.round((a / n) * 255);
    }
  }
  return { width: w, height: h, data: out };
}

/** Repaint the neutral (black) ink white, leaving the gold alone. */
function inkToWhite(img) {
  const out = Buffer.from(img.data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    const r = out[i], g = out[i+1], b = out[i+2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    if (chroma < 44) { out[i] = 255; out[i+1] = 255; out[i+2] = 255; }
  }
  return { width: img.width, height: img.height, data: out };
}

/** Flatten onto an opaque background -- maskable icons must not be transparent. */
function flatten(img, [br, bg, bb]) {
  const out = Buffer.alloc(img.data.length);
  for (let i = 0; i < out.length; i += 4) {
    const a = img.data[i + 3] / 255;
    out[i] = Math.round(img.data[i] * a + br * (1 - a));
    out[i+1] = Math.round(img.data[i+1] * a + bg * (1 - a));
    out[i+2] = Math.round(img.data[i+2] * a + bb * (1 - a));
    out[i+3] = 255;
  }
  return { width: img.width, height: img.height, data: out };
}

/** Rows that carry ink, used to find the gap between mark and wordmark. */
function rowDensity(img, threshold = 8) {
  const rows = new Array(img.height).fill(0);
  for (let y = 0; y < img.height; y++) {
    let n = 0;
    for (let x = 0; x < img.width; x++) if (img.data[px(img, x, y) + 3] > threshold) n++;
    rows[y] = n;
  }
  return rows;
}

/** The dominant saturated colour -- this becomes the site's --gold token. */
function dominantChromaColour(img) {
  const buckets = new Map();
  for (let i = 0; i < img.data.length; i += 4) {
    if (img.data[i + 3] < 200) continue;
    const r = img.data[i], g = img.data[i+1], b = img.data[i+2];
    if (Math.max(r, g, b) - Math.min(r, g, b) < 60) continue;
    const key = `${r >> 3},${g >> 3},${b >> 3}`;
    const e = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 };
    e.n++; e.r += r; e.g += g; e.b += b;
    buckets.set(key, e);
  }
  let best = null;
  for (const e of buckets.values()) if (!best || e.n > best.n) best = e;
  if (!best) return null;
  const to = (v) => Math.round(v / best.n).toString(16).padStart(2, "0");
  return `#${to(best.r)}${to(best.g)}${to(best.b)}`;
}

const write = (name, img) => {
  const file = path.join(OUT, name);
  fs.writeFileSync(file, encodePng(img));
  const kb = (fs.statSync(file).size / 1024).toFixed(1);
  console.log(`  ${name.padEnd(28)} ${String(img.width).padStart(4)}x${String(img.height).padEnd(4)}  ${kb.padStart(7)} KB`);
};

/* Build ------------------------------------------------------------------ */

console.log(`Reading ${SRC} ...`);
const source = decodePng(fs.readFileSync(SRC));
console.log(`  ${source.width}x${source.height}`);

console.log("Keying out the white background ...");
const keyed = keyWhite(source);
console.log(`  max chroma in artwork: ${keyed.maxChroma}`);

const gold = dominantChromaColour(keyed);
console.log(`\n  >>> sampled brand gold: ${gold}\n`);

const INK = [0, 0, 0];
const GOLD = [parseInt(gold.slice(1, 3), 16), parseInt(gold.slice(3, 5), 16), parseInt(gold.slice(5, 7), 16)];
const flat = posterise(keyed, INK, GOLD);

const box = bbox(flat);
const art = crop(flat, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);
console.log(`Artwork bounds: ${art.width}x${art.height} at (${box.x0},${box.y0})`);

// Split mark from wordmark: the widest run of empty rows in the lower half.
const rows = rowDensity(art);
let run = null, best = null;
for (let y = Math.floor(art.height * 0.35); y < art.height; y++) {
  if (rows[y] === 0) { run = run || { start: y }; run.end = y; }
  else if (run) { if (!best || run.end - run.start > best.end - best.start) best = run; run = null; }
}
if (run && (!best || run.end - run.start > best.end - best.start)) best = run;
if (!best) throw new Error("could not find the gap between mark and wordmark");
const split = Math.round((best.start + best.end) / 2);
console.log(`  mark/wordmark gap: rows ${best.start}-${best.end}, splitting at ${split}`);

fs.mkdirSync(OUT, { recursive: true });

const markRaw = crop(art, 0, 0, art.width, split);
const markBox = bbox(markRaw);
const mark = square(crop(markRaw, markBox.x0, markBox.y0, markBox.x1 - markBox.x0 + 1, markBox.y1 - markBox.y0 + 1));
const markLight = inkToWhite(mark);

console.log("\nWriting assets:");
write("logo-mark-88.png", resize(mark, 88, 88));
write("logo-mark-128.png", resize(mark, 128, 128));
write("logo-mark-176.png", resize(mark, 176, 176));
write("logo-mark-512.png", resize(mark, 512, 512));
write("logo-mark-light-88.png", resize(markLight, 88, 88));
write("logo-mark-light-176.png", resize(markLight, 176, 176));
write("logo-mark-light-352.png", resize(markLight, 352, 352));

// Full lockup, transparent, for the footer and documents.
const lockupW = 560;
const lockupH = Math.round((lockupW * art.height) / art.width);
write("logo-lockup.png", resize(art, lockupW, lockupH));
write("logo-lockup-light.png", resize(inkToWhite(art), lockupW, lockupH));

// Icons: padded and flattened onto white so maskable variants behave.
const padded = square(mark, Math.round(mark.width * 0.08));
write("favicon-32.png", resize(mark, 32, 32));
write("favicon-64.png", resize(mark, 64, 64));
write("apple-touch-icon.png", flatten(resize(padded, 180, 180), [255, 255, 255]));
write("icon-192.png", flatten(resize(padded, 192, 192), [255, 255, 255]));
write("icon-512.png", flatten(resize(padded, 512, 512), [255, 255, 255]));

console.log(`\nDone. Brand gold is ${gold} -- keep --gold in assets/css/style.css in sync.`);
