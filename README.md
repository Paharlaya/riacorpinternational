# Riacorp International

Static website for Riacorp International — global B2B supplier and exporter of
premium Himalayan botanicals and advanced bio-nutrients. Hand-written HTML, CSS
and JavaScript: no framework, no build step at runtime, no package manager.
GitHub Pages serves the repository root.

Source of truth: `briefs/final-brief.md`. The two drafts it was combined from
are in `briefs/original-plans.md`, and the coverage audit in
`briefs/coverage-audit.md`.

Page illustrations live in `src/art/` — one SVG per page, injected by the
assembler via the `art:` field in each page body's metadata. Per-page JSON-LD
works the same way through `src/schema/` and the `schema:` field.

## Running locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Repository layout

GitHub Pages serves this repository from its **root**, so the published pages
and `assets/` have to live there. Everything that is source rather than output
is grouped beside them.

```
.                          published site — served by GitHub Pages
├── index.html             pages, generated from src/
├── products.html
├── himalayan-botanicals.html
├── bio-nutrients.html
├── collagen-peptides.html
├── compliance.html
├── about.html
├── faq.html
├── contact.html
├── 404.html
├── services.html          redirect stubs, kept so older links resolve
├── spices.html
├── psyllium-husk.html
├── certifications.html
├── robots.txt  sitemap.xml  site.webmanifest  .nojekyll
│
├── assets/                everything the pages load
│   ├── css/style.css
│   ├── js/main.js
│   ├── img/               logo variants, hero background, product photos
│   └── docs/              generated specifications catalogue
│
├── src/                   authoring source — edit here, then rebuild
│   ├── pages/             page bodies, one per published page
│   ├── partials/          head, header, footer, hero, sprite
│   ├── art/               per-page hero illustrations, one SVG each
│   └── schema/            per-page JSON-LD
│
├── scripts/               build tooling, run by hand
│   ├── build-pages.mjs    stitches src/ into the root .html files
│   ├── build-logo.mjs     logo variants and icons from brand/
│   ├── build-hero-bg.mjs  hero background derivatives
│   ├── build-catalog.mjs  the downloadable specifications PDF
│   └── set-domain.sh      switches the site to a custom domain
│
├── brand/                 original supplied artwork, not served content
│   ├── crest-source.png
│   ├── hero-illustration-source.png
│   └── archive/           superseded marks
│
└── briefs/                client requirements and audit
    ├── final-brief.md     source of truth for implementation
    ├── original-plans.md  the two drafts it was combined from
    └── coverage-audit.md  requirement-by-requirement coverage
```

Nothing in `src/`, `scripts/`, `brand/` or `briefs/` is linked from the site,
but Pages does serve the whole repository, so treat all of it as public.

## Editing

The root `.html` files are the deliverable. They are plain static HTML and can
be edited directly.

They can also be regenerated, which is the easier route when you are changing
something that appears on every page:

```bash
node scripts/build-pages.mjs
```

That stitches `src/partials/` (head, header, footer, sprite, hero, lanes map)
onto the page bodies in `src/pages/` and writes the root `.html` files. It
keeps the shared chrome byte-identical across every page.

**It overwrites the root files.** If you have edited a root page by hand, copy
that change into `src/pages/` before running it.

## Logo

The brand artwork is `brand/crest-source.png` — keep it, it is the source.
Everything in `assets/img/` is generated from it:

```bash
node scripts/build-logo.mjs
```

The crest's mountains are **knockouts, not white paint** — there is not one
opaque white pixel in it. Two variants come out of that:

- `crest-*` keeps each pixel's relative lightness. Correct on a white page.
- `crest-light-*` flattens every neutral pixel to solid white and keeps only the
  alpha. That is what sits on the emerald bar: a crisp silhouette with the
  knockout mountains showing the bar through them, so no white plate is needed
  behind the mark. Preserving lightness instead would map the dome's mid-tone
  greens to mid-greys and the mark would go muddy.

The crest is 218px tall in the source and the script refuses to upscale, so
large icons place it at native size on a padded canvas.

The script has no dependencies. It decodes the PNG with node's built-in `zlib`,
keys the white background out to real transparency, splits the mark from the
wordmark, downsamples, and re-encodes. It also prints the brand gold sampled
from the artwork — currently `#dba629`, which is the `--mustard` token in
`assets/css/style.css`. If you replace the artwork, re-run it and update that
token to match.

| File | Used for |
|---|---|
| `crest-56/112/168/224.png` | Dark mark, for white backgrounds |
| `crest-light-56/112/168/224.png` | Flat white mark, for the emerald bar and footer |
| `lockup.png` / `lockup-light.png` | Full stacked lockup, dark and light |
| `favicon-32.png`, `favicon-64.png` | Favicon |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons (mark on white) |

## Hero background

The hero illustration is `brand/hero-illustration-source.png`. Derivatives:

```bash
node scripts/build-hero-bg.mjs
```

Writes `assets/img/hero-bg-{760,1200,1920}.png`, served through `srcset`.

The script quantises each colour channel to a step of 6 before encoding. The
exporter dithers its sky gradient, and that noise is what PNG cannot compress:
**the 1920px variant drops from 814 KB to 86 KB** with no visible banding, since
the artwork is flat colour and soft gradients. Raise `STEP` for a smaller file,
lower it if banding ever appears (`STEP=2 node scripts/build-hero-bg.mjs`).

The artwork leaves its left third clear for the headline. A gradient scrim
behind the copy guarantees contrast anyway, because `object-fit: cover` crops
inward on narrow screens and pulls the ridgeline under the text.

## Specifications catalogue

The "Download Specifications Catalog" button needs a real file behind it:

```bash
node scripts/build-catalog.mjs
```

Writes `assets/docs/riacorp-specifications.pdf` — a four-page A4 catalogue built
from the same figures as the on-page spec tables, with no dependencies. Re-run it
whenever a specification changes so the PDF cannot drift from the site.


The company name beside the mark is live text, not part of the image:
Montserrat 800 for `RIACORP`, Montserrat 300 letterspaced for `INTERNATIONAL`.

## Product photography

Product tiles read their image from a CSS custom property, so a missing file
degrades to a styled placeholder tile rather than a broken-image icon. Drop
files in and they appear — no code change needed.

```
assets/img/products/botanicals/<slug>.jpg      large-cardamom, nepal-ginger, turmeric
assets/img/products/bio-nutrients/<slug>.jpg   psyllium-husk, berberine
assets/img/products/collagen/<slug>.jpg        peptides
assets/img/certificates/<slug>.jpg             iec, apeda, fssai, gst, spices-board,
                                               star-export, brc, iso-22000, haccp,
                                               gmp, usfda, fsma, npop, usda-nop,
                                               eu-organic, kosher, halal, msds
```

Square 1:1 for grid tiles, ideally 800×800 or larger, compressed under ~200 KB.

**Paths must start with a leading slash.** The tiles pass the image in through a
CSS custom property, and a *relative* `url()` inside a custom property is
resolved against the stylesheet's folder (`assets/css/`), not the page — so
`url('assets/img/...')` silently 404s and you just get the placeholder. Always
write `url('/assets/img/...')`. This also means the site has to be served from a
domain root, which it is, both on GitHub Pages and under `python3 -m http.server`.

## Replace before launch

- [ ] **Phone number** — `+00 000 000 0000` in `src/partials/footer.html` and `src/pages/contact.html`
- [ ] **Office address** — same two files
- [ ] **WhatsApp number** — `WHATSAPP_NUMBER` in `assets/js/main.js`. Until it is a real number the intake form falls back to `mailto:`
- [ ] **Social links** — LinkedIn, Instagram, Facebook on the contact page
- [ ] **Product photography** — see the folder convention above
- [ ] **Certificate scans** — `assets/img/certificates/`
- [ ] **Remove `noindex`** — one line in `src/partials/head.html`, plus `robots.txt`, once the real content and domain are live

Every placeholder is marked in the page with a visible `[placeholder]` note or a
dashed callout, so nothing ships silently.

## Specification sourcing

Psyllium figures follow the published specifications of the partner
manufacturing units. Berberine and collagen parameters reflect standard export
grades for those materials and carry a visible source note saying lot values come
from the Certificate of Analysis. **No specification figure on this site was
invented** — where nothing verifiable existed, the page says so rather than
filling the gap.

## Certifications

The certifications page presents all listed certifications as Riacorp's own,
which was a deliberate choice for the demo. If some are in fact held by
manufacturing partners rather than by Riacorp, relabel the relevant section
heading in `src/pages/certifications.html` — the page is already split into
three blocks to make that a one-line change.

## Custom domain

There is no `CNAME` file on purpose. With one present, GitHub Pages redirects
the github.io address to the custom domain, which breaks the site until DNS
exists. Once the domain is live:

```bash
./scripts/set-domain.sh riacorpinternational.com
```

That rewrites the domain across the site, writes `CNAME`, and prints the DNS
records to add.
