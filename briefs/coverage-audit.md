# Riacorp International — Website Rebuild Plan

> **Superseded.** `finalplan.md` is now the source of truth for implementation
> decisions. This file is kept for the requirement-coverage audit only.

Combines **Plan A** (Production-Ready Website Brief) and **Plan B** (Complete
Website Master Brief) into one sequential build.

Not linked from the site — internal working document.

---

## 1. Decisions already locked

| # | Decision |
|---|---|
| D1 | Logo: use `newlogo.png` as supplied. Crest is 218 px tall, so icon sizes are capped to what it can carry rather than upscaled. |
| D2 | Palette: the **brief wins** — `#0D3E36` emerald, `#D4AF37` gold. The logo is recoloured to match so mark and UI never clash. |
| D3 | Green carries real structural weight: emerald nav bar, footer, section panels, headings. Gold stays at 10%. |
| D4 | The container ship is removed from the hero and replaced by a Himalayan ridgeline. |
| D5 | Hero art is built illustratively (SVG/CSS) — no photography dependency. |
| D6 | Typography: **Fraunces** display + **Inter** body/UI/tables. Reviewed at the Phase 1 checkpoint. |
| D7 | Where A and B differ, **B wins** on structure (3 product pages, 3 form categories, Mundra included). **A contributes** the compliance ticker. |

---

## 2. Open items — need your answer

All resolved 17 Sep — client delegated the calls.

| # | Item | Resolution |
|---|---|---|
| Q1 | Riacorp vs RiaCorp | **Riacorp** in prose and titles; **RIACORP** all-caps in the logo lockup. |
| Q2 | Specifications Catalog download | Wired to products.html in Phase 2. **Still needs a real PDF or the button should change label — Phase 3.** |
| Q3 | Berberine spec data | Research published manufacturer specs and cite the source. Where nothing verifiable exists, ship the verbatim copy with a "full specification on request" panel. **No invented numbers** on a page aimed at pharmaceutical buyers. |
| Q4 | Collagen spec data | Same rule as Q3. |
| Q5 | Buyer FAQ | **Keep**, reworked to the new portfolio. |
| Q6 | Blue-highlighted passages | Unknown — proceed, flag anything ambiguous at the checkpoints. |
| Q7 | Psyllium grades | Lead with the brief's **95/98/99%**; note 85% available for industrial grades. |
| Q8 | Phone / address / WhatsApp | Remain clearly-marked placeholders until supplied. |

---

## 3. Coverage audit — every requirement in A and B

### Brand & visual

| Requirement | Source | Handled in |
|---|---|---|
| 60% Alpine White `#FFFFFF` / `#F8F9FA`, generous whitespace, **no loud textures** | A+B | 1.3, 1.5 |
| 30% Deep Himalayan Emerald `#0D3E36` — nav bar, title typography, footer, solid section panels | A+B | 1.3, 1.6 |
| 10% Champagne Gold `#D4AF37` — CTAs, hover states, **highlighting quality parameters** | A+B | 1.3, 2.6 |
| Clean-Room Compliance meets High-Altitude Luxury | A+B | 1.4, 1.5, 2.2 |
| Institutional, not retail: no carts, no public pricing, no checkout | A+B | 2.3, 2.6 |

### Homepage

| Requirement | Source | Handled in |
|---|---|---|
| Hero: split peaks → laboratory | A+B | 2.2 |
| H1 verbatim: *Pristine Himalayan Botanicals & Advanced Bio-Nutrients, Delivered Worldwide.* | A+B | 2.2 |
| Sub-headline verbatim | A+B | 2.2 |
| CTA 1 `[ Request Bulk Quote / COA ]` gold | A+B | 2.2 |
| CTA 2 `[ Download Specifications Catalog ]` white outline (B) | B | 2.2, Q2 |
| Dual-Pillar Matrix, 2 columns, **equal visual weight** | A+B | 2.3 |
| Pillar CTAs `[ View Botanicals Catalog ]` / `[ View Bio-Nutrients Catalog ]` | A+B | 2.3 |
| Dual-Gateway supply chain, side-by-side, **no partner company names** | A+B | 2.4 |
| East route header + body copy verbatim | A+B | 2.4 |
| West route header + body copy verbatim (B version, includes Mundra) | B | 2.4 |
| Global Trust & Compliance Ticker — ISO 22000, HACCP, GMP, FSSAI, Phytosanitary | A | 2.5 |

### About

| Requirement | Source | Handled in |
|---|---|---|
| Institutional overview, **no personal names, no photographs, no biographies** | A+B | 2.7 |
| Block 1: The Corporate Vision (verbatim) | A+B | 2.7 |
| Block 2: Logistics & Operational Execution Team (verbatim, merged A+B wording) | A+B | 2.7 |
| Block 3: Technical Processing Advisory (verbatim) | A+B | 2.7 |
| Removes existing founder block and six testimonials | — | 2.7 |

### Products

| Requirement | Source | Handled in |
|---|---|---|
| Products nav **expands into 3 separate sub-pages** | B | 2.1, 1.6 |
| Page 1 Premium Himalayan Botanicals — Cardamom, Ginger, Turmeric | B | 2.6 |
| Page 2 Plant-Based Bio-Nutrients & Fibers — Psyllium, Berberine | B | 2.6 |
| Page 3 Premium Collagen Peptides — Marine, Bovine | B | 2.6 |
| Exact technical copy for all six product cards | A §3 | 2.6 |
| Per-page logistics footnotes (verbatim) | B | 2.6 |
| Per-page gold CTA labels (verbatim) | B | 2.6 |
| Data tables: formats, packaging 25/50 kg, moisture limits | B | 2.6 |
| Data table: mesh 40–100, purity 95/98/99% | B | 2.6, Q7 |

### Form

| Requirement | Source | Handled in |
|---|---|---|
| Header: *Request Technical Specifications & Bulk Quotation* + microcopy verbatim | B | 3.1 |
| 24–48 hour response promise | B | 3.1 |
| Two-column desktop layout | A+B | 3.1 |
| 11 fields, exact labels, mandatory flags, placeholders | A+B | 3.1 |
| Field 7 conditional on Field 6 | A+B | 3.2 |
| Corporate email validation, discourage Gmail/Yahoo | A+B | 3.3 |
| Standard global country list | B | 3.4 |
| Submit `[ GENERATE CORPORATE INQUIRY ]`, champagne gold | A+B | 3.1 |
| **Every gold CTA site-wide links to this form** | B | 3.5 |

### Audience (drives copy and metadata)

International B2B procurement managers · food & beverage manufacturers ·
pharmaceutical and cosmetics raw-material buyers. — Plan A. Handled in 2.9.

---

# PHASE 1 — Brand foundation  ✅ COMPLETE

No content changes. Nothing user-visible breaks.

1. **1.1** Rewrite `scripts/build-logo.mjs` for `newlogo.png` — skip white-keying (already transparent), split crest from wordmark at the measured row gap.
2. **1.2** Recolour the mark to `#0D3E36` / `#D4AF37`; emit crest, horizontal lockup, light-on-dark variants, favicons and app icons at sizes the 218 px source supports.
3. **1.3** Replace colour tokens with the 60-30-10 system; retire `--mustard`, `--ink` and all 39 hardcoded mustard hex values.
4. **1.4** Swap typography to Fraunces (display) + Inter (body, UI, tabular figures); remove Archivo and Montserrat.
5. **1.5** Delete the ten-symbol mustard sprite sheet and ~50 decorative blobs; build the contour-line + globe-arc motif, kept subtle per the "no loud textures" rule.
6. **1.6** Rebuild header as a solid emerald bar (white wordmark, gold CTA) and footer in emerald; add the Products dropdown with three sub-page links.
7. **1.7** Re-verify: responsive 360–1680, contrast ratios on emerald and gold, reduced-motion, no-JS.

**→ CHECKPOINT: brand review on existing pages before any copy changes.**

---

# PHASE 2 — Architecture & content  ✅ COMPLETE

1. **2.1** Create the new page set: `index`, `about`, `products`, `himalayan-botanicals`, `bio-nutrients`, `collagen-peptides`, `compliance`, `contact`, `404`. Turn `spices`, `psyllium-husk`, `certifications` into redirect stubs.
2. **2.2** Rebuild the hero: remove ship, waves and sun disc; add layered Himalayan ridgeline, mist bands, gold summit arcs, corridor ticker; right half resolves into clean-room geometry; H1, sub-headline and both CTAs verbatim.
3. **2.3** Build the Dual-Pillar Product Portfolio matrix — two columns, equal weight, six products, two catalog CTAs, no prices.
4. **2.4** Build the Dual-Gateway logistics section — East and West columns with verbatim copy, animated corridor paths, no partner names.
5. **2.5** Build the Global Trust & Compliance ticker — monochrome badge row.
6. **2.6** Build the three product sub-pages: verbatim technical copy per product, spec tables, packaging, formats, logistics footnote and gold CTA with the exact label given for each page.
7. **2.7** Rewrite About with the three verbatim institutional blocks; delete the founder block and all six testimonials.
8. **2.8** Rework the certifications page into `compliance.html`.
9. **2.9** Rewrite every page title, meta description and JSON-LD for the new entity, offer and buyer segments; drop all "Indian exporter of spices" framing.
10. **2.10** Re-verify links, anchors, assets, overflow at all breakpoints.

**→ CHECKPOINT: content review before the form work.**

---

# PHASE 3 — B2B intake engine, polish, deploy

1. **3.1** Build the quote form: header and microcopy verbatim, two-column desktop, 11 fields with exact labels, mandatory flags and placeholders, gold submit button.
2. **3.2** Wire Field 7 (Specific Material) to switch on Field 6 (Product Category) across the three categories.
3. **3.3** Add corporate-email validation — warn on free domains rather than hard-block, so a legitimate buyer is never locked out.
4. **3.4** Add the full country dropdown.
5. **3.5** Point every gold CTA across every page at the form; confirm none are orphaned.
6. **3.6** Resolve the Specifications Catalog download (Q2).
7. **3.7** Replace remaining placeholders — phone, address, WhatsApp (Q8).
8. **3.8** Full verification: responsive, no-JS, reduced-motion, link and asset integrity, subpath hosting.
9. **3.9** Deploy to GitHub Pages and verify the live site.

**→ CHECKPOINT: sign-off, then remove `noindex` when the real domain is ready.**

---

## 4. Verbatim content inventory

Copy that must appear **word for word**. Kept here so it cannot drift.

**Hero H1** — Pristine Himalayan Botanicals & Advanced Bio-Nutrients, Delivered Worldwide.

**Hero sub-headline** — Riacorp International bridges pristine high-altitude agricultural sourcing with certified industrial bio-nutrient manufacturing. Sourced, lab-tested, and optimized for global trade routes.

**Product card copy** — six blocks: Himalayan Large Cardamom (Black Gold), Pristine Nepal Ginger, High-Curcumin Turmeric, Psyllium Husk (Isabgol), High-Purity Berberine Extract, Premium Collagen Peptides.

**Logistics copy** — East Route and West Route body paragraphs.

**About copy** — The Corporate Vision, Logistics & Operational Execution Team, Technical Processing Advisory.

**Form header** — Request Technical Specifications & Bulk Quotation, plus the microcopy paragraph.

**Button labels** — `Request Bulk Quote / COA` · `Download Specifications Catalog` · `View Botanicals Catalog` · `View Bio-Nutrients Catalog` · `Request Bulk Quote & Cardamom/Ginger/Turmeric Samples` · `Request Psyllium / Berberine Specifications & COA` · `Request Collagen Peptides Bulk Pricing & Tech Data Sheets` · `GENERATE CORPORATE INQUIRY`

---

## 5. What is being deleted

- Container ship, waves and sun disc from the hero
- Ten mustard-era sprite symbols and ~50 decorative blobs
- The entire mustard/black palette
- 20-item spice grid, and the spices page
- Founder / leadership block
- All six buyer testimonials
- Archivo and Montserrat
- Maritime port ticker (replaced by the corridor ticker)
