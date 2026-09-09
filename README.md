# Ria Corp International

Static website for Ria Corp International, an export and import company. Hand-written HTML, CSS and JavaScript with no build step, made for GitHub Pages with a custom domain.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero with the container-ship voyage, what we move, how a shipment moves, why us |
| `services.html` | Six services as a ledger, Incoterms explained |
| `about.html` | Who we are, how we work, trade lanes |
| `contact.html` | Contact details and enquiry form |
| `404.html` | Not-found page |

Shared assets live in `assets/css/style.css`, `assets/js/main.js` and `assets/img/`.

## Design

- Colours: white paper, true black ink, mustard `#E4A81B` as the highlight, a pale mustard wash for panels.
- Type: Archivo variable from Google Fonts. Wide weights for headlines, condensed for labels, normal for reading.
- Motion: one page-load sequence on the home hero, a ship that sails the header line as you scroll, and a slow port ticker. Everything respects `prefers-reduced-motion`.

## Before going live

1. **Domain.** Run `./set-domain.sh yourdomain.com` to replace `riacorpinternational.com` everywhere and rewrite `CNAME`. Then point DNS at GitHub Pages (the script prints the records) and set the custom domain under Settings, Pages.
2. **Contact details.** Replace the placeholder phone number and address in the footer of every page and in `contact.html`. Search for `+00 000 000 0000` and `Street address`.
3. **WhatsApp.** In `assets/js/main.js`, set `WHATSAPP_NUMBER` to digits only with country code. Until it is set, the enquiry form falls back to opening the visitor's email app addressed to `SITE_EMAIL`.
4. **Content.** The trade categories on the home page and the service lists are written as sensible defaults. Edit them to match what the company actually ships.

## Local preview

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```
