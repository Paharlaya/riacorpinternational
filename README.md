# RiaCorp International

Static website for RiaCorp International, an Indian supplier and exporter of
spices and psyllium husk. Hand-written HTML, CSS and JavaScript — no framework,
no build step, no package manager. GitHub Pages serves the repository root.

## Running locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home |
| `products.html` | Catalogue index |
| `spices.html` | Spice range, specifications, packing, QC |
| `psyllium-husk.html` | Psyllium grades, specifications, applications |
| `certifications.html` | Registrations, food-safety standards, shipment documents |
| `about.html` | Story, timeline, values, markets, leadership |
| `faq.html` | Buyer FAQ (native `<details>`, works without JavaScript) |
| `contact.html` | Enquiry form and contact details |
| `404.html` | Not found |
| `services.html` | Redirect stub kept so old links do not 404 |

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

The script has no dependencies. It decodes the PNG with node's built-in `zlib`,
keys the white background out to real transparency, splits the mark from the
wordmark, downsamples, and re-encodes. It also prints the brand gold sampled
from the artwork — currently `#dba629`, which is the `--mustard` token in
`assets/css/style.css`. If you replace the artwork, re-run it and update that
token to match.

| File | Used for |
|---|---|
| `logo-mark-88.png` / `-176.png` | Header lockup (1x / 2x) |
| `logo-mark-light-88.png` / `-176.png` | Footer lockup — white ink, for dark backgrounds |
| `logo-mark-512.png` | `og:image`, JSON-LD logo |
| `logo-lockup.png` / `-light.png` | Full stacked lockup for documents |
| `favicon-32.png`, `favicon-64.png` | Favicon |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons (opaque, as maskable icons require) |

The company name beside the mark is live text, not part of the image:
Montserrat 800 for `RIACORP`, Montserrat 300 letterspaced for `INTERNATIONAL`.

## Product photography

Product tiles read their image from a CSS custom property, so a missing file
degrades to a styled placeholder tile rather than a broken-image icon. Drop
files in and they appear — no code change needed.

```
assets/img/products/spices/<slug>.jpg      turmeric, red-chilli, cumin, coriander,
                                           black-pepper, fennel, fenugreek, mustard,
                                           ajwain, cardamom, clove, cinnamon,
                                           bay-leaf, nutmeg, star-anise, onion-garlic,
                                           dry-ginger, asafoetida, brown-cardamom,
                                           poppy-seed
assets/img/products/psyllium/<slug>.jpg    husk-85, husk-95, husk-98, husk-99,
                                           husk-powder, organic-husk, seed, kha-kha
assets/img/products/<line>/_cover.jpg      4:3 cover for the product cards
assets/img/certificates/<slug>.jpg         iec, apeda, fssai, gst, spices-board,
                                           star-export, udyam, factory-licence,
                                           brc, iso-22000, haccp, gmp, usfda, fsma,
                                           npop, usda-nop, eu-organic, kosher,
                                           halal, msds
```

Square 1:1 for grid tiles, ideally 800×800 or larger, compressed under ~200 KB.

**Paths must start with a leading slash.** The tiles pass the image in through a
CSS custom property, and a *relative* `url()` inside a custom property is
resolved against the stylesheet's folder (`assets/css/`), not the page — so
`url('assets/img/...')` silently 404s and you just get the placeholder. Always
write `url('/assets/img/...')`. This also means the site has to be served from a
domain root, which it is, both on GitHub Pages and under `python3 -m http.server`.

## Replace before launch

This is a demo build. The following are placeholders:

- [ ] **Phone number** — `+00 000 000 0000` in `tools/partials/footer.html` and `tools/pages/contact.html`
- [ ] **Office address** — same two files
- [ ] **WhatsApp number** — `WHATSAPP_NUMBER` in `assets/js/main.js`; until it is a real number the enquiry form falls back to `mailto:`
- [ ] **Social links** — LinkedIn, Instagram, Facebook on the contact page
- [ ] **Statistics** — countries served, shipment count, on the home and about pages
- [ ] **Testimonials** — the six quotes on the home page are written for the demo, not supplied by real buyers
- [ ] **Leadership** — founder name, photograph and quotation on the about page
- [ ] **Timeline dates** — the about-page timeline has no years yet
- [ ] **Specifications** — spice and psyllium spec tables follow standard Indian export grades and should be checked against your own certificates of analysis
- [ ] **Certificate scans** — `assets/img/certificates/`
- [ ] **Product photography** — see above

Every placeholder is marked in the page with a visible `[placeholder]` note or
a dashed "Demo note" callout, so nothing ships silently.

## Certifications

The certifications page presents all listed certifications as RiaCorp's own,
which was a deliberate choice for the demo. If some are in fact held by
manufacturing partners rather than by RiaCorp, relabel the relevant section
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
