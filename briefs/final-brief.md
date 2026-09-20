# Riacorp International — Final Website Implementation Plan

This document is the final source of truth for the Riacorp International website. It combines Plan B's stronger site architecture with Plan A's technical product content and compliance focus.

## 1. Project Goal

Build a premium, credible B2B export website for international procurement managers, food and beverage manufacturers, pharmaceutical companies, nutraceutical brands, cosmetics manufacturers, and wholesale buyers.

The website must communicate two strengths equally:

1. Premium Himalayan agricultural sourcing.
2. Technically controlled bio-nutrient manufacturing and export.

The final result must feel like **high-altitude natural purity combined with clean-room precision**. It must not look like a retail shop.

### Primary conversion goal

Generate qualified requests for product specifications, Certificates of Analysis, samples, and bulk quotations.

### Non-negotiable rules

- No shopping cart, public retail pricing, or checkout.
- No unsupported certification, purity, exclusivity, logistics, or manufacturing claims.
- No third-party partner names unless Riacorp has permission to publish them.
- Product specifications must be confirmed before launch and aligned across the website and downloadable catalogue.
- Use institutional, precise language rather than exaggerated marketing claims.

## 2. Brand and Visual Direction

### Brand concept

**Clean-Room Compliance Meets High-Altitude Luxury**

The visual identity should combine Himalayan origin, natural quality, laboratory discipline, and international trade capability.

### Colour system

| Use | Colour | Application |
|---|---|---|
| 60% base | Alpine White `#FFFFFF` and Soft Grey `#F8F9FA` | Page backgrounds, whitespace, tables, cards |
| 30% structure | Himalayan Emerald `#0D3E36` | Navigation, footer, headings, dark content panels |
| 10% accent | Champagne Gold `#D4AF37` | Primary CTAs, important highlights, active and hover states |

Gold must remain an accent. It should not be used for large backgrounds or ordinary body text.

### Typography

- Display/headings: Fraunces.
- Body copy, navigation, forms, and tables: Inter.
- Use large, confident headings and short, readable paragraphs.

### Image direction

- Himalayan ridgelines, cultivated terrain, raw materials, laboratories, processing, testing, packaging, and export logistics.
- Images should be bright, clean, realistic, and commercially credible.
- Avoid generic retail spice bowls, excessive decorative textures, crowded collages, and unrelated stock imagery.
- Product imagery should use a consistent square crop and colour treatment.

### Interface principles

- Generous whitespace and clear hierarchy.
- Responsive from mobile through large desktop.
- Strong contrast and visible keyboard focus.
- Subtle motion only, with reduced-motion support.
- Product data should be easy to scan in tables or structured specification blocks.

## 3. Final Information Architecture

### Main navigation

1. Home
2. Products
   - Himalayan Botanicals
   - Plant-Based Bio-Nutrients & Fibers
   - Collagen Peptides
3. Quality & Compliance
4. Supply Chain
5. About
6. FAQ
7. Contact

The persistent navigation CTA will be **Request Quote / COA**.

### Required pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Brand proposition, portfolios, quality, logistics, and primary conversion path |
| Products overview | `products.html` | Overview of all three product groups |
| Himalayan Botanicals | `himalayan-botanicals.html` | Cardamom, ginger, and turmeric |
| Bio-Nutrients & Fibers | `bio-nutrients.html` | Psyllium husk and berberine extract |
| Collagen Peptides | `collagen-peptides.html` | Marine and bovine collagen peptides |
| Quality & Compliance | `compliance.html` | Testing, traceability, documentation, and verified certifications |
| About | `about.html` | Institutional company and operational overview |
| FAQ | `faq.html` | Common procurement, documentation, packaging, and shipping questions |
| Contact / Quote | `contact.html` | B2B procurement inquiry form |
| Not found | `404.html` | Branded recovery page with useful navigation |

The supply-chain story can initially be a substantial homepage section. A standalone page should only be added if the available verified content justifies it.

## 4. Homepage Specification

### 4.1 Hero

Present a visual transition from a pristine Himalayan landscape to a clean laboratory or technical processing environment.

**H1:**  
Pristine Himalayan Botanicals & Advanced Bio-Nutrients, Delivered Worldwide.

**Supporting copy:**  
Riacorp International bridges pristine high-altitude agricultural sourcing with certified industrial bio-nutrient manufacturing. Sourced, lab-tested, and optimized for global trade routes.

**Primary CTA:** Request Bulk Quote / COA  
**Secondary CTA:** Download Specifications Catalogue

The primary CTA uses gold. The secondary CTA uses an outline treatment so the hierarchy is clear.

### 4.2 Trust strip

Immediately below the hero, show concise procurement assurances such as:

- B2B bulk supply
- Batch documentation
- Custom specifications
- Multi-port export coordination

Only use assurances that Riacorp can consistently deliver.

### 4.3 Product portfolio

Give the two core pillars equal visual importance:

#### Premium Himalayan Botanicals

- Himalayan Large Cardamom
- Nepal Ginger
- High-Curcumin Turmeric
- CTA: **View Himalayan Botanicals**

#### Advanced Bio-Nutrients

- Psyllium Husk
- Berberine Extract
- Marine and Bovine Collagen Peptides
- CTAs to the bio-nutrients and collagen pages

No prices or retail purchasing controls will appear.

### 4.4 Quality and documentation

Explain the buyer journey:

`Requirement Review -> Product Matching -> Sample/COA Review -> Batch Testing -> Export Documentation -> Dispatch`

Link to the Quality & Compliance page.

### 4.5 Dual-gateway supply chain

Present two operational corridors without naming third-party partners:

#### Himalayan Botanicals Corridor

High-altitude sourcing and processing network, regional coordination through the Siliguri corridor, and export through Kolkata where applicable.

#### Western and Southern Bio-Industrial Corridors

Specialized manufacturing networks with dispatch through the most suitable verified gateway, including Mundra, Nhava Sheva, or Chennai where applicable.

Use a clear source-to-buyer diagram. Do not promise a specific route for every order because the final route may depend on origin, destination, availability, and shipping conditions.

### 4.6 Industries served

- Pharma and nutraceuticals
- Food and beverage processing
- Cosmetics and personal care
- Ingredient distribution and wholesale blending

### 4.7 Compliance preview

Show only verified certifications and available documents. If a certification belongs to a manufacturing partner, label it as **partner facility certification**, not a Riacorp corporate certification.

### 4.8 Final CTA

End with a strong procurement prompt linking to the inquiry form:

**Request Technical Specifications & Bulk Quotation**

## 5. Product Pages

Each product page will contain:

1. Category introduction.
2. Product cards with concise technical descriptions.
3. Structured specification tables.
4. Applications and buyer industries.
5. Packaging and documentation information.
6. Relevant sourcing and shipping note.
7. Product-specific CTA with the category preselected in the form.

### 5.1 Himalayan Botanicals

#### Himalayan Large Cardamom

High-altitude cultivated cardamom available in appropriate verified grades and drying formats for extraction, flavouring, and wholesale blending.

#### Nepal Ginger

Fibrous, high-pungency ginger available in verified whole dry rhizome, sliced flake, and powder formats.

#### High-Curcumin Turmeric

Laboratory-tested turmeric intended for food, cosmetics, nutraceutical, and extraction applications. Curcuminoid values must be presented by confirmed grade or lot, not as a general unqualified promise.

**CTA:** Request Botanicals Quote, Samples & Specifications

### 5.2 Plant-Based Bio-Nutrients & Fibers

#### Psyllium Husk

Dietary soluble fibre offered in confirmed purity grades and mesh sizes for food, pharmaceutical, and supplement formulations.

#### Berberine Extract

Botanical extract supplied to agreed active-content, stability, heavy-metal, microbiological, and other applicable parameters. Exact values must come from approved specifications or lot COAs.

**CTA:** Request Psyllium / Berberine Specifications & COA

### 5.3 Collagen Peptides

#### Marine Collagen Peptides

Marine-origin collagen peptide material for verified cosmetics, nutraceutical, or formulation applications.

#### Bovine Collagen Peptides

Bovine-origin collagen peptide material supplied to confirmed molecular-weight and quality parameters.

**CTA:** Request Collagen Bulk Pricing & Technical Data

### Specification table fields

Show applicable, confirmed values for:

- Product name and grade
- Source/origin
- Available format
- Appearance
- Purity or active content
- Mesh or particle size
- Moisture
- Microbiological limits
- Heavy-metal limits
- Packaging
- Storage and shelf life
- Minimum order quantity
- Available documents

Use **Available on request** where a parameter is not suitable for public display. Never invent or assume a figure.

## 6. Quality & Compliance Page

This page must build trust through evidence rather than a decorative badge collection.

### Content sections

- Supplier and facility qualification
- Raw-material and batch traceability
- Sampling and laboratory testing
- Certificate of Analysis workflow
- Contaminant, microbiological, and heavy-metal testing where applicable
- Packaging and labelling controls
- Export and phytosanitary documentation
- Document availability by product and destination

### Certification display rules

- Verify each certification's holder, scope, validity, and permission to display it.
- Clearly separate Riacorp registrations from partner-facility certifications.
- Do not display placeholders as if they were active certifications.
- Certificate scans may be supplied privately to qualified buyers if public display is inappropriate.

## 7. About Page

Use an institutional company narrative rather than founder biographies or personal photographs.

### Required sections

1. **Corporate Vision** — Riacorp operates at the intersection of natural sourcing and industrial quality to support dependable international B2B procurement.
2. **Operational Coordination** — Explain cross-border documentation, customs coordination, multimodal transport, and shipment management.
3. **Processing and Technical Network** — Explain oversight of relevant sourcing, processing, and manufacturing networks without overstating ownership or exclusivity.
4. **Why Buyers Choose Riacorp** — Responsive specification matching, documentation support, consolidated communication, and export coordination.

Claims such as **registered**, **exclusive**, **asset-integrated**, or **directly owned** must only be used after documentary confirmation.

## 8. B2B Inquiry Form

### Header

**Request Technical Specifications & Bulk Quotation**

Supporting copy should ask buyers for precise procurement requirements and explain what they will receive in response. A 24–48 hour response promise should only be published if the sales team can reliably meet it.

### Fields

| Field | Type | Required |
|---|---|---|
| Full Name | Text | Yes |
| Corporate Email Address | Email | Yes |
| Company Legal Name | Text | Yes |
| Company Website URL | URL | No |
| Country of Destination | Searchable country select | Yes |
| Product Category | Select | Yes |
| Specific Material Required | Conditional select | Yes |
| Required Format / Purity Grade | Text | Yes |
| Estimated Order Volume | Text | Yes |
| Intended Application Industry | Select | Yes |
| Technical Specifications / Custom Packaging Requirements | Text area | No |
| Buyer specification sheet | File upload | No |
| Privacy consent | Checkbox | Yes |

### Product categories

- Premium Himalayan Botanicals
- Plant-Based Bio-Nutrients & Fibers
- Collagen Raw Materials

The material dropdown changes according to the selected category. Product-page CTAs should open the form with the relevant category and material already selected.

### Submission behaviour

- Submit label: **Submit Procurement Inquiry**.
- Prefer business email addresses, but warn rather than block users of free email services.
- Validate required fields on both the client and submission endpoint.
- Include spam protection and a clear success/error state.
- Send a confirmation to the buyer and a structured inquiry to the sales team.
- Do not expose private email credentials in client-side code.
- Record the page/product that generated the inquiry.

## 9. Content and Claims Policy

Before any factual claim is published, place it into one of these categories:

| Status | Treatment |
|---|---|
| Verified | Publish normally with accurate scope |
| Partner-held | Publish with explicit partner/facility attribution |
| Lot-dependent | State that the final value is confirmed by lot COA |
| Pending verification | Use restrained wording or omit before launch |

The following require confirmation:

- Company registration and export registrations
- Certification ownership and validity
- Product origins
- Purity, curcuminoid, molecular-weight, mesh, moisture, and contaminant values
- Packaging sizes and minimum order quantities
- Manufacturing and processing locations
- Port and logistics routes
- Organic, medicinal-grade, clinical-facility, or similar regulated claims
- Response-time and sample-availability promises

## 10. SEO and Technical Requirements

- Unique page title, meta description, canonical URL, and H1 for every page.
- Product-category copy should target relevant B2B search intent without keyword stuffing.
- Use appropriate Organization, Product, Breadcrumb, and FAQ structured data only when visible page content supports it.
- Generate and validate `sitemap.xml` and `robots.txt`.
- Add descriptive image alt text and meaningful link labels.
- Preserve useful redirects from old page URLs.
- Optimize images and avoid layout shift.
- Target strong Core Web Vitals and fast loading on mobile connections.
- Support keyboard navigation, visible focus, labelled form controls, and WCAG AA colour contrast.
- Keep essential navigation and content usable without JavaScript.

## 11. Implementation Approach

The site remains a lightweight static HTML, CSS, and JavaScript project. Shared templates in `src/partials/` and page bodies in `src/pages/` are the editable source for generated root pages.

### Phase 1 — Confirm source material

- Approve logo and brand presentation.
- Confirm company contact details and legal name.
- Verify product specifications, packaging, minimum quantities, and origins.
- Verify certification ownership and current validity.
- Confirm inquiry destination and preferred form delivery method.
- Collect approved product, facility, and sourcing images.

### Phase 2 — Finalize structure and content

- Implement the final navigation and page hierarchy.
- Finalize homepage sections and product-page templates.
- Replace risky or unverified claims with approved wording.
- Ensure all product specifications are consistent across pages.
- Finalize About, Compliance, FAQ, and logistics content.

### Phase 3 — Build the conversion system

- Complete conditional inquiry-form behaviour.
- Connect the form to the approved secure submission service.
- Add spam protection, confirmation messaging, and internal notifications.
- Preselect products from relevant CTAs.
- Track inquiry sources without collecting unnecessary personal data.

### Phase 4 — Catalogue and assets

- Generate the downloadable specifications catalogue from approved site data.
- Add optimized product and facility images.
- Add verified certificate visuals where permitted.
- Ensure catalogue and website specifications match exactly.

### Phase 5 — Quality assurance

- Test all pages at mobile, tablet, laptop, and large-desktop widths.
- Test navigation with mouse, keyboard, touch, JavaScript disabled, and reduced motion.
- Test every CTA, download, redirect, and form state.
- Validate HTML, accessibility, metadata, structured data, sitemap, and robots rules.
- Check spelling, units, claims, and consistency of product data.
- Run performance checks and optimize any heavy assets.

### Phase 6 — Launch

- Replace all contact and content placeholders.
- Connect and verify the production domain and HTTPS.
- Remove `noindex` only after final approval.
- Submit the sitemap to search engines.
- Test a real inquiry from submission to sales-team receipt and buyer confirmation.
- Archive an approved copy of all launch content and product specifications.

## 12. Launch Acceptance Criteria

The website is ready to launch only when:

- Every navigation item and CTA works.
- All required pages are complete and responsive.
- The three product categories are clearly separated.
- No product has invented or unverified public specifications.
- Certification ownership is clearly labelled.
- No placeholder phone number, address, social link, image, or form destination remains.
- The downloadable catalogue matches the website.
- The inquiry form works end to end and handles errors clearly.
- There is no public pricing, shopping cart, or retail checkout.
- Accessibility and performance checks have been completed.
- Legal, privacy, and contact information has been approved.

## 13. Final Decisions

- Plan B controls the page structure and product segmentation.
- Plan A supplies the stronger product-detail and compliance direction.
- The website will use three dedicated product-category pages.
- Compliance will be evidence-led, not a decorative logo ticker.
- Corporate emails will be encouraged but free email domains will not be automatically rejected.
- The primary form action will be **Submit Procurement Inquiry**.
- Product values and certifications remain unpublished until verified.
- This document supersedes the two drafts in `feedback.md` for implementation decisions.
