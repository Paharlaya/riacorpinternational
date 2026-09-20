/**
 * Page assembler — optional authoring helper.
 *
 * The deliverable is the plain .html files in the repo root; they are static,
 * have no runtime dependency on this script, and can be edited directly.
 *
 * This exists only so the shared chrome (<head>, <header>, <footer>) stays
 * byte-identical across all eight pages. Edit src/partials/ or the page
 * bodies in src/pages/, then:
 *
 *   node scripts/build-pages.mjs
 *
 * Note it OVERWRITES the root .html files. If you have edited a root page by
 * hand, copy that change back into src/pages/ first or it will be lost.
 */
import fs from "node:fs";
import path from "node:path";

const read = (f) => fs.readFileSync(f, "utf8");
const head = read("src/partials/head.html");
const header = read("src/partials/header.html");
const footer = read("src/partials/footer.html");
const sprite = read("src/partials/sprite.html");
const hero = read("src/partials/hero.html");
const lanes = read("src/partials/lanes.html");

const files = fs.readdirSync("src/pages").filter((f) => f.endsWith(".html")).sort();
let built = 0;

for (const file of files) {
  const src = read(path.join("src/pages", file));
  const meta = /^<!--\s*([\s\S]*?)-->\s*/.exec(src);
  if (!meta) throw new Error(`${file}: missing leading metadata comment`);

  const fields = {};
  for (const line of meta[1].trim().split("\n")) {
    const at = line.indexOf(":");
    if (at > 0) fields[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  for (const key of ["title", "description"]) {
    if (!fields[key]) throw new Error(`${file}: missing "${key}"`);
  }

  const slug = file === "index.html" ? "" : file;
  const page =
    head
      .replaceAll("{{TITLE}}", fields.title)
      .replaceAll("{{DESCRIPTION}}", fields.description)
      .replaceAll("{{SLUG}}", slug)
      .replaceAll("{{SCHEMA}}", fields.schema ? "\n" + fs.readFileSync("src/schema/" + fields.schema, "utf8").trim() : "") +
    header +
    "\n" +
    sprite +
    src.slice(meta[0].length).replaceAll("{{ART}}", fields.art ? read("src/art/" + fields.art).trimEnd() : "")
      .replaceAll("{{HERO}}", hero.trimEnd()).replaceAll("{{LANES}}", lanes.trimEnd()).trimEnd() +
    "\n\n" +
    footer;

  fs.writeFileSync(file, page);
  console.log(`  ${file.padEnd(22)} ${String(page.split("\n").length).padStart(4)} lines`);
  built++;
}
console.log(`\n${built} pages built.`);
