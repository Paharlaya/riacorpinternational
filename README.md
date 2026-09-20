# Riacorp International

Static website for Riacorp International — global B2B supplier and exporter of
premium Himalayan botanicals and advanced bio-nutrients. Hand-written HTML, CSS
and JavaScript: no framework, no build step at runtime, no package manager.
GitHub Pages serves the repository root.

Working plan and requirement coverage: `PLAN.md`.

## Running locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, dual-pillar matrix, dual-gateway logistics, compliance ticker |
| `products.html` | Portfolio overview |
| `himalayan-botanicals.html` | Cardamom, ginger, turmeric |
| `bio-nutrients.html` | Psyllium husk, berberine extract |
| `collagen-peptides.html` | Marine and bovine peptides |
| `compliance.html` | Registrations, food-safety standards, shipment documents |
| `about.html` | Institutional overview |
| `faq.html` | Procurement FAQ (native `<details>`, works without JavaScript) |
| `contact.html` | 11-field corporate intake form |
| `404.html` | Not found |
| `services.html`, `spices.html`, `psyllium-husk.html`, `certifications.html` | Redirect stubs so older links do not 404 |

## Editing

The root `.html` files are the deliverable. They are plain static HTML and can
be edited directly.

They can also be regenerated, which is the easier route when you are changing
something that appears on every page:

```bash
node tools/build-pages.mjs
```

That stitches `tools/partials/` (head, header, footer, sprite, hero, lanes map)
onto the page bodies in `tools/pages/` and writes the root `.html` files. It
keeps the shared chrome byte-identical across all nine pages.

**It overwrites the root files.** If you have edited a root page by hand, copy
that change into `tools/pages/` before running it.

## Logo

The brand artwork is `riacorplogo.png` (2048×2048) — keep it, it is the source.
Everything in `assets/img/` is generated from it:

```bash
node tools/logo-build.mjs
```

The crest's mountains are **knockouts, not white paint** — there is not one
opaque white pixel in it. So it cannot be inverted for a dark background: the
snow caps would fill with whatever is behind them. Everywhere the mark meets
emerald it sits on a white plate instead, which is why only the dark variant is
generated. The crest is 218px tall in the source and the script refuses to
upscale, so large icons place it at native size on a padded canvas.

The script has no dependencies. It decodes the PNG with node's built-in `zlib`,
keys the white background out to real transparency, splits the mark from the
wordmark, downsamples, and re-encodes. It also prints the brand gold sampled
from the artwork — currently `#dba629`, which is the `--mustard` token in
`assets/css/style.css`. If you replace the artwork, re-run it and update that
token to match.

| File | Used for |
|---|---|
| `crest-56/112/168/224.png` | Header and footer mark, in its white plate |
| `lockup.png` | Full stacked lockup, footer |
| `favicon-32.png`, `favicon-64.png` | Favicon |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons (mark on white) |

## Hero background

The hero illustration is `bgriacorp.png` (kept as the source). Derivatives:

```bash
node tools/build-hero-bg.mjs
```

Writes `assets/img/hero-bg-{760,1200,1920}.png`, served through `srcset`.

The script quantises each colour channel to a step of 6 before encoding. The
exporter dithers its sky gradient, and that noise is what PNG cannot compress:
**the 1920px variant drops from 814 KB to 86 KB** with no visible banding, since
the artwork is flat colour and soft gradients. Raise `STEP` for a smaller file,
lower it if banding ever appears (`STEP=2 node tools/build-hero-bg.mjs`).

The artwork leaves its left third clear for the headline. A gradient scrim
behind the copy guarantees contrast anyway, because `object-fit: cover` crops
inward on narrow screens and pulls the ridgeline under the text.

## Specifications catalogue

The "Download Specifications Catalog" button needs a real file behind it:

```bash
node tools/build-catalog.mjs
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

- [ ] **Phone number** — `+00 000 000 0000` in `tools/partials/footer.html` and `tools/pages/contact.html`
- [ ] **Office address** — same two files
- [ ] **WhatsApp number** — `WHATSAPP_NUMBER` in `assets/js/main.js`. Until it is a real number the intake form falls back to `mailto:`
- [ ] **Social links** — LinkedIn, Instagram, Facebook on the contact page
- [ ] **Product photography** — see the folder convention above
- [ ] **Certificate scans** — `assets/img/certificates/`
- [ ] **Remove `noindex`** — one line in `tools/partials/head.html`, plus `robots.txt`, once the real content and domain are live

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
heading in `tools/pages/certifications.html` — the page is already split into
three blocks to make that a one-line change.

## Custom domain

There is no `CNAME` file on purpose. With one present, GitHub Pages redirects
the github.io address to the custom domain, which breaks the site until DNS
exists. Once the domain is live:

```bash
./set-domain.sh riacorpinternational.com
```

That rewrites the domain across the site, writes `CNAME`, and prints the DNS
records to add.
