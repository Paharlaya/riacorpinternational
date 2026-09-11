# Ria Corp International

Static website for Ria Corp International, an export and import company. Hand-written HTML, CSS and JavaScript with no build step, made for GitHub Pages with a custom domain. The only dependency is GSAP 3.13 with ScrollTrigger from cdnjs (about 40 KB gzipped) for scroll-driven shape motion.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero with the container-ship voyage, what we trade, how a shipment moves, why us |
| `services.html` | Three product lines with goods, quality checks and paperwork, the four support services, Incoterms explained |
| `about.html` | Who we are, how we work, trade lanes |
| `contact.html` | Contact details and enquiry form |
| `404.html` | Not-found page |

Shared assets live in `assets/css/style.css`, `assets/js/main.js` and `assets/img/`.

## Logo

An RC monogram built from geometric strokes, so no font is needed. The wordmark in the lockups is Archivo converted to outlines. All files are SVG in `assets/img/`:

| File | Use |
| --- | --- |
| `logo-mark.svg` | Primary mark: black tile, white R, mustard C. Also the favicon and app icons. |
| `logo-mark-light.svg` | Mustard tile with black letters, for dark backgrounds. |
| `logo-mark-mono.svg` | Letters only in black, for single-colour print or embossing. |
| `logo-horizontal.svg` | Mark plus "RIA CORP / INTERNATIONAL" for letterheads and headers. |
| `logo-horizontal-dark.svg` | Same lockup for dark backgrounds. |
| `logo-stacked.svg` | Mark above the wordmark, for social avatars and square placements. |

## Design

- Colours: white paper, true black ink, mustard `#E4A81B` as the highlight, a pale mustard wash for panels.
- Type: Archivo variable from Google Fonts. Wide weights for headlines, condensed for labels, normal for reading.
- Motion: one page-load sequence on the home hero, a ship that sails the header line as you scroll, a slow port ticker, and shape backdrops on every section (containers, crates, route lines, rings, plus a leaf, mortar and peptide chain for the three product lines). Shapes float with CSS and parallax with GSAP ScrollTrigger loaded from cdnjs; route lines draw in as you scroll. If GSAP fails to load the shapes simply stay still. Everything respects `prefers-reduced-motion`.

## Before going live

1. **Domain.** Run `./set-domain.sh yourdomain.com` to replace `riacorpinternational.com` everywhere and rewrite `CNAME`. Then point DNS at GitHub Pages (the script prints the records) and set the custom domain under Settings, Pages.
2. **Contact details.** Replace the placeholder phone number and address in the footer of every page and in `contact.html`. Search for `+00 000 000 0000` and `Street address`.
3. **WhatsApp.** In `assets/js/main.js`, set `WHATSAPP_NUMBER` to digits only with country code. Until it is set, the enquiry form falls back to opening the visitor's email app addressed to `SITE_EMAIL`.
4. **Product lines.** The site is built around three lines: agro products (spices first), wellness raw materials, and collagen raw materials. The wellness list (ashwagandha, moringa, amla, tulsi, shatavari, essential oils, Himalayan salt) is a placeholder until the confirmed list arrives; replace it in `services.html` and the home manifest. The direction badges (agro = export, wellness = export and import, collagen = import) are assumptions to confirm.

## Local preview

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```
