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
p.text("Verified B2B Exporter", { size: 11, font: "F2", color: EMERALD, gap: 18 });
p.text("Himalayan Pet Chews, High-Altitude Spices & Indian Bio-Ingredients", { size: 11, color: GREY, gap: 28 });
[
  "Riacorp International connects global B2B buyers with direct sourcing from",
  "Darjeeling, North East India and Nepal, alongside specification-driven procurement",
  "across India's certified bio-ingredient clusters. Lab-tested, lot-traceable, export-ready.",
].forEach((l) => p.text(l, { size: 10, color: GREY, gap: 15 }));
p.space(20);
p.text("Trade & logistics corridors", { size: 11, font: "F2", color: EMERALD, gap: 17 });
p.text("East route   Darjeeling, NE India & Nepal > Siliguri Transit Hub > Kolkata Port", { size: 9.5, color: GREY, gap: 14 });
p.text("West route   Audited partner facilities > Mundra / Nhava Sheva / Chennai", { size: 9.5, color: GREY, gap: 14 });

/* ---- pet churpi ---- */
p = newPage();
p.text("1.  Himalayan Pet Churpi", { size: 16, font: "F2", color: EMERALD, gap: 22 });
p.text("Darjeeling origin | Worldwide export-ready", { size: 10, color: GREY, gap: 20 });
p.rule();
[
  "Traditional Himalayan hard cheese dog chews crafted from pure, high-altitude cow and yak",
  "milk using natural curing and smoking methods. 100% natural, grain-free, gluten-free, and",
  "free from artificial preservatives or binders.",
].forEach((l) => p.text(l, { size: 9.5, color: GREY, gap: 13 }));
p.space(10);
const chw = [130, 330];
p.row(["PARAMETER", "SPECIFICATION"], chw, { size: 8, bold: true, color: GREY });
p.rule();
[
  ["Sizes", "Small, Medium, Large, Extra-Large, Jumbo"],
  ["Protein", ">60%"],
  ["Fat", "<5%"],
  ["Moisture", "<12%"],
  ["Formats", "Whole bars, nuggets / puffs, bulk pieces"],
  ["Packaging", "Bulk master cartons with moisture-barrier liners, or private-label pouches"],
].forEach((r) => p.row(r, chw));
p.space(10);
p.text("Global export & market readiness", { size: 11, font: "F2", color: EMERALD, gap: 16 });
[
  "Supplies pet food importers, distributors and private-label brands across North America,",
  "Europe, the Middle East, Asia-Pacific and other international markets. Regulatory paperwork,",
  "veterinary health certification protocols and sanitary clearances for the USA, EU and Canada.",
  "DGFT Import Export Code (IEC) & GST registered. Batch-specific COA verifying moisture,",
  "protein, fat and microbiological safety.",
].forEach((l) => p.text(l, { size: 9.5, color: GREY, gap: 13 }));

/* ---- spices ---- */
p = newPage();
p.text("2.  Himalayan Spices", { size: 16, font: "F2", color: EMERALD, gap: 22 });
p.text("NE India & Nepal origin | Direct supply", { size: 10, color: GREY, gap: 20 });
p.rule();
const bot = [
  ["Himalayan Large Cardamom", "Origin: Darjeeling, Sikkim, NE India & Nepal. Bold, Jumbo and Medium grades;", "<12% moisture; 25 / 50 kg food-grade lined bags."],
  ["Himalayan Ginger", "Origin: NE India & Nepal. Dried whole rhizome, flakes / slices, powder (40-100 mesh);", "<10-12% moisture by format."],
  ["High-Curcumin Turmeric", "Origin: NE India & Himalayan foothills. Whole fingers, slices, powder (60-100 mesh);", "5%-7%+ curcumin verified per lot COA."],
];
bot.forEach(([t, ...body]) => {
  p.text(t, { size: 11, font: "F2", color: EMERALD, gap: 15 });
  body.forEach((l) => p.text(l, { size: 9.5, color: GREY, gap: 13 }));
  p.space(8);
});
p.space(6);
p.text("Formats, packaging & parameters", { size: 11, font: "F2", color: EMERALD, gap: 18 });
const bw = [150, 110, 80, 70, 85];
p.row(["MATERIAL", "FORMATS", "GRADE / MESH", "MOISTURE", "PACKAGING"], bw, { size: 8, bold: true, color: GREY });
p.rule();
[
  ["Large Cardamom", "Whole cured pods", "Bold/Jumbo/Med", "<12%", "25 / 50 kg"],
  ["Ginger - whole", "Dried rhizome", "Export", "<12%", "25 / 50 kg"],
  ["Ginger - flakes", "Flakes / slices", "Export", "<10%", "25 / 50 kg"],
  ["Ginger - powder", "Milled", "40-100 mesh", "<10%", "25 / 50 kg"],
  ["Turmeric - whole", "Fingers / slices", "5-7%+ curcumin", "Per lot", "25 / 50 kg"],
  ["Turmeric - powder", "Milled", "60-100 mesh", "Per lot", "25 / 50 kg"],
].forEach((r) => p.row(r, bw));
p.space(6);
p.text("Curcumin and essential-oil values are lot-specific and stated on the Certificate of Analysis.", { size: 8.5, color: GREY, gap: 12 });
p.text("Darjeeling, NE India & Nepal > Siliguri Transit Hub > Kolkata Port.", { size: 8.5, color: GREY, gap: 12 });

/* ---- bio-nutrients ---- */
p = newPage();
p.text("3.  Indian Bio-Nutrients & Functional Extracts", { size: 16, font: "F2", color: EMERALD, gap: 22 });
p.text("Custom B2B sourcing / on order | Audited Indian partner facilities", { size: 10, color: GREY, gap: 20 });
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
p.text("Procured from audited partner facilities in Western India | Shipped via Mundra port.", { size: 8.5, color: GREY, gap: 12 });

/* ---- collagen ---- */
p = newPage();
p.text("4.  Premium Collagen Peptides", { size: 16, font: "F2", color: EMERALD, gap: 22 });
p.text("Custom B2B sourcing / on order | Hydrolyzed marine & bovine grades", { size: 10, color: GREY, gap: 20 });
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
p.text("Procured from audited partner facilities in Western & Southern India | Shipped via Nhava Sheva or Chennai.", { size: 8.5, color: GREY, gap: 18 });

p.text("Compliance", { size: 13, font: "F2", color: EMERALD, gap: 18 });
// Label in a fixed left column, wrapped value lines in a fixed right one.
const labelled = (label, lines, after = 14) => {
  p.text(label, { size: 9.5, font: "F2", color: EMERALD, gap: 0 });
  lines.forEach((l, i) => p.text(l, { size: 9.5, color: GREY, x: M + 108, gap: i === lines.length - 1 ? after : 13 }));
};
labelled("Registrations held", ["IEC | Central FSSAI (human-grade food & spices) | GST | APEDA | Spices Board RCMC"]);
labelled("Partner facilities", [
  "Certifications held by partner processing & manufacturing facilities, available per",
  "consignment on request: BRCGS | ISO 22000 | HACCP | GMP | USFDA | FSMA / FSVP |",
  "NPOP | USDA NOP | EU Organic | Kosher | Halal",
]);
labelled("Per shipment", [
  "Commercial invoice, packing list, BL, certificate of origin, phytosanitary or veterinary",
  "health certificate, lot-wise COA, quality inspection report",
], 20);
p.rule();
p.text("Request a bulk quotation or a sample COA workflow", { size: 11, font: "F2", color: EMERALD, gap: 16 });
p.text("info@riacorpinternational.com  |  WhatsApp +91 88269 85830", { size: 10, color: GREY, gap: 14 });
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
