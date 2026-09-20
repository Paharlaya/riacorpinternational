/**
 * Specifications catalogue builder
 * --------------------------------
 * The homepage carries a "Download Specifications Catalog" button, so it needs
 * a real file behind it. This writes one straight from the same figures the
 * spec tables use.
 *
 *   node scripts/build-catalog.mjs   ->  assets/docs/riacorp-specifications.pdf
 *
 * Dependency free: PDF is a text container, so the pages are assembled by hand
 * with the standard Helvetica faces. Keep it ASCII — no font is embedded.
 */
import fs from "node:fs";

const W = 595.28, H = 841.89;              // A4 points
const M = 56;                               // margin
const EMERALD = "0.051 0.243 0.212";
const GOLD = "0.831 0.686 0.216";
const GREY = "0.365 0.416 0.400";

const esc = (s) => String(s)
  .replace(/[–—]/g, "-").replace(/[‘’]/g, "'")
  .replace(/[“”]/g, '"').replace(/°/g, " deg").replace(/[^\x20-\x7E]/g, "")
  .replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

class Page {
  constructor() { this.ops = []; this.y = H - M; }
  text(s, { size = 10, font = "F1", color = "0 0 0", x = M, gap = 14 } = {}) {
    this.ops.push(`BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${this.y} Tm (${esc(s)}) Tj ET`);
    this.y -= gap;
  }
  rule(color = "0.894 0.910 0.902", width = 0.8) {
    this.ops.push(`${color} RG ${width} w ${M} ${this.y + 4} m ${W - M} ${this.y + 4} l S`);
    this.y -= 10;
  }
  band(h, color = EMERALD) {
    this.ops.push(`${color} rg ${M} ${this.y - h + 10} ${W - 2 * M} ${h} re f`);
  }
  space(n = 10) { this.y -= n; }
  row(cells, widths, { size = 9, bold = false, color = "0 0 0" } = {}) {
    let x = M;
    cells.forEach((c, i) => {
      this.ops.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg 1 0 0 1 ${x} ${this.y} Tm (${esc(c)}) Tj ET`);
      x += widths[i];
    });
    this.y -= 13;
  }
  get content() { return this.ops.join("\n"); }
}

const pages = [];
const newPage = () => { const p = new Page(); pages.push(p); return p; };

/* ---- cover ---- */
let p = newPage();
p.y = H - 150;
p.text("RIACORP INTERNATIONAL", { size: 26, font: "F2", color: EMERALD, gap: 30 });
p.text("Specifications Catalogue", { size: 15, color: GREY, gap: 26 });
p.rule(GOLD.split(" ").join(" "), 2);
p.space(8);
p.text("Global B2B Supplier & Exporter", { size: 11, font: "F2", color: EMERALD, gap: 18 });
p.text("Premium Himalayan Botanicals & Advanced Bio-Nutrients", { size: 11, color: GREY, gap: 28 });
[
  "Riacorp International bridges pristine high-altitude agricultural sourcing",
  "with certified industrial bio-nutrient manufacturing. Sourced, lab-tested,",
  "and optimized for global trade routes.",
].forEach((l) => p.text(l, { size: 10, color: GREY, gap: 15 }));
p.space(20);
p.text("Dual-gateway logistics", { size: 11, font: "F2", color: EMERALD, gap: 17 });
p.text("East corridor   Kathmandu > Siliguri/Darjeeling > Kolkata", { size: 9.5, color: GREY, gap: 14 });
p.text("West corridor   Bio-industrial clusters > Mundra / Nhava Sheva / Chennai", { size: 9.5, color: GREY, gap: 14 });

/* ---- botanicals ---- */
p = newPage();
p.text("1.  Premium Himalayan Botanicals", { size: 16, font: "F2", color: EMERALD, gap: 22 });
p.text("Direct high-altitude extraction & sourcing", { size: 10, color: GREY, gap: 20 });
p.rule();
const bot = [
  ["Himalayan Large Cardamom (Black Gold)", "High-altitude cultivated, smoke-dried or sun-dried, sorted into Premium Bold", "and Jumbo grades. Intensive natural essential oil content for extraction and blending."],
  ["Pristine Nepal Ginger", "Highly fibrous, sharp pungency, harvested from organic mountain soils. Whole dry", "rhizomes, sliced flakes and fine uniform powder formats."],
  ["High-Curcumin Turmeric", "Sourced from premium high-altitude terrain. Laboratory-tested for high curcuminoid", "content for functional food, cosmetic and health-extract applications."],
];
bot.forEach(([t, ...body]) => {
  p.text(t, { size: 11, font: "F2", color: EMERALD, gap: 15 });
  body.forEach((l) => p.text(l, { size: 9.5, color: GREY, gap: 13 }));
  p.space(8);
});
p.space(6);
p.text("Formats, packaging & parameters", { size: 11, font: "F2", color: EMERALD, gap: 18 });
const bw = [150, 95, 85, 75, 90];
p.row(["MATERIAL", "FORMATS", "GRADES", "MOISTURE", "PACKAGING"], bw, { size: 8, bold: true, color: GREY });
p.rule();
[
  ["Large Cardamom", "Whole pods", "Bold / Jumbo", "12% max", "25 / 50 kg"],
  ["Nepal Ginger - dry", "Whole rhizome", "Export", "10% max", "25 / 50 kg"],
  ["Nepal Ginger - flakes", "Sliced", "Export", "8% max", "25 kg"],
  ["Nepal Ginger - powder", "Milled", "60-80 mesh", "8% max", "25 kg"],
  ["Turmeric - finger", "Whole finger", "Medicinal", "10% max", "25 / 50 kg"],
  ["Turmeric - powder", "Milled", "60-80 mesh", "8% max", "25 kg"],
].forEach((r) => p.row(r, bw));
p.space(6);
p.text("Curcuminoid and essential-oil values are lot-specific and stated on the Certificate of Analysis.", { size: 8.5, color: GREY, gap: 12 });
p.text("Sourced from pristine high-altitude Nepal terrains | Routed via the Siliguri-Kolkata corridor.", { size: 8.5, color: GREY, gap: 12 });

/* ---- bio-nutrients ---- */
p = newPage();
p.text("2.  Plant-Based Bio-Nutrients & Fibers", { size: 16, font: "F2", color: EMERALD, gap: 22 });
p.text("Certified multi-cluster Indian manufacturing", { size: 10, color: GREY, gap: 20 });
p.rule();
p.text("Psyllium Husk (Isabgol)", { size: 11, font: "F2", color: EMERALD, gap: 16 });
const pw = [78, 85, 85, 72, 68, 90];
p.row(["GRADE", "MUCILLOID", "SWELL VOLUME", "MOISTURE", "ASH", "ACID INSOL. ASH"], pw, { size: 8, bold: true, color: GREY });
p.rule();
[
  ["Husk 95%", "95% min", "50 ml/g min", "10% max", "4% max", "1% max"],
  ["Husk 98%", "98% min", "60 ml/g min", "10% max", "4% max", "1% max"],
  ["Husk 99%", "99% min", "70 ml/g min", "10% max", "4% max", "1% max"],
].forEach((r) => p.row(r, pw));
p.space(10);
p.text("Psyllium Husk Powder", { size: 11, font: "F2", color: EMERALD, gap: 16 });
p.row(["GRADE", "MESH", "SWELL VOLUME", "MOISTURE", "ASH", ""], pw, { size: 8, bold: true, color: GREY });
p.rule();
[
  ["Powder 95%", "40/60/80/100", "55 ml/g min", "10% max", "4% max", ""],
  ["Powder 98%", "40/60/80/100", "65 ml/g min", "10% max", "4% max", ""],
  ["Powder 99%", "40/60/80/100", "75 ml/g min", "10% max", "4% max", ""],
].forEach((r) => p.row(r, pw));
p.space(6);
p.text("Common to all grades:  heavy extraneous matter 0.5% max | TPC <100,000 CFU/g | yeast & mould <1,000 CFU/g", { size: 8.5, color: GREY, gap: 12 });
p.text("E. coli absent in 1 g | Salmonella absent in 25 g. Also available: 85% industrial grade, seed, Kha-Kha powder.", { size: 8.5, color: GREY, gap: 16 });
p.text("High-Purity Berberine Extract", { size: 11, font: "F2", color: EMERALD, gap: 16 });
const ew = [150, 200, 100];
p.row(["PARAMETER", "SPECIFICATION", "METHOD"], ew, { size: 8, bold: true, color: GREY });
p.rule();
[
  ["Botanical source", "Berberis aristata (Indian barberry)", "Declared on COA"],
  ["Assay", "95% / 97% / 98% berberine HCl", "HPLC"],
  ["Appearance", "Yellow crystalline powder", "Visual"],
  ["Heavy metals", "<10 ppm", "ICP-MS"],
  ["Particle size", "To customer requirement", "Sieve analysis"],
  ["Shelf life", "24 months, cool and dry", "-"],
].forEach((r) => p.row(r, ew));
p.space(6);
p.text("Processed across advanced Western India bio-industrial clusters | Shipped via Mundra port.", { size: 8.5, color: GREY, gap: 12 });

/* ---- collagen ---- */
p = newPage();
p.text("3.  Premium Collagen Peptides", { size: 16, font: "F2", color: EMERALD, gap: 22 });
p.text("High-bioavailability structural protein raw material", { size: 10, color: GREY, gap: 20 });
p.rule();
const cw = [130, 140, 140, 90];
p.row(["PARAMETER", "MARINE", "BOVINE", "METHOD"], cw, { size: 8, bold: true, color: GREY });
p.rule();
[
  ["Source", "Fish skin & scale", "Grass-fed buffalo hide", "COA"],
  ["Collagen type", "Type I", "Type I & III", "-"],
  ["Protein content", "90% min", "90% min", "Kjeldahl"],
  ["Molecular weight", "2,000-5,000 Da", "3,000-6,000 Da", "GPC"],
  ["Moisture", "8% max", "8% max", "Loss on drying"],
  ["Ash", "2% max", "2% max", "Gravimetric"],
  ["Appearance", "Off-white powder", "Off-white powder", "Visual"],
  ["Mesh", "60-80", "60-80", "Sieve analysis"],
  ["Shelf life", "24 months", "24 months", "-"],
].forEach((r) => p.row(r, cw));
p.space(8);
p.text("Bovine material originates from grass-fed herds; India holds negligible BSE risk status.", { size: 8.5, color: GREY, gap: 12 });
p.text("Bio-synthesized across Western and Southern India facilities | Shipped via Nhava Sheva or Chennai.", { size: 8.5, color: GREY, gap: 18 });

p.text("Compliance", { size: 13, font: "F2", color: EMERALD, gap: 18 });
p.text("Registrations   IEC | APEDA | FSSAI | GST | Spices Board RCMC | Star Export House", { size: 9.5, color: GREY, gap: 14 });
p.text("Food safety     BRC | ISO 22000:2018 | HACCP | GMP | USFDA registration | FSMA / FSVP", { size: 9.5, color: GREY, gap: 14 });
p.text("Market          NPOP | USDA NOP | EU Organic | Kosher (OU) | Halal", { size: 9.5, color: GREY, gap: 14 });
p.text("Per shipment    Commercial invoice, packing list, BL, certificate of origin, phytosanitary,", { size: 9.5, color: GREY, gap: 13 });
p.text("                health certificate, COA, quality inspection report, MSDS", { size: 9.5, color: GREY, gap: 20 });
p.rule();
p.text("Request a bulk quotation or a sample COA workflow", { size: 11, font: "F2", color: EMERALD, gap: 16 });
p.text("info@riacorpinternational.com", { size: 10, color: GREY, gap: 14 });
p.text("Responses within 24-48 hours from our technical compliance officers.", { size: 9.5, color: GREY, gap: 14 });

/* ---- assemble ---- */
const objs = [];
const add = (body) => { objs.push(body); return objs.length; };

const fontRegular = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
const fontBold = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
const pagesId = objs.length + pages.length * 2 + 1;

const kids = [];
pages.forEach((pg) => {
  const stream = pg.content;
  const contentId = add(`<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`);
  const pageId = add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] ` +
    `/Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contentId} 0 R >>`);
  kids.push(`${pageId} 0 R`);
});
const pagesObj = add(`<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pages.length} >>`);
const catalog = add(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`);
const info = add(`<< /Title (Riacorp International - Specifications Catalogue) /Author (Riacorp International) /Producer (scripts/build-catalog.mjs) >>`);

let out = "%PDF-1.4\n";
const offsets = [0];
objs.forEach((body, i) => {
  offsets.push(Buffer.byteLength(out, "latin1"));
  out += `${i + 1} 0 obj\n${body}\nendobj\n`;
});
const xrefPos = Buffer.byteLength(out, "latin1");
out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objs.length; i++) out += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
out += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

fs.mkdirSync("assets/docs", { recursive: true });
fs.writeFileSync("assets/docs/riacorp-specifications.pdf", Buffer.from(out, "latin1"));
console.log(`Wrote assets/docs/riacorp-specifications.pdf — ${pages.length} pages, ${(Buffer.byteLength(out, "latin1") / 1024).toFixed(1)} KB`);
