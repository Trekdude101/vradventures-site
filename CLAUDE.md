# VR Adventures Site — Project Instructions

## Pre-Commit Checklist
Before committing, check if any changes affect site SEO or discoverability:

### Sitemap (`sitemap.xml`)
- New pages added? Add `<url>` entry with `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- Pages removed? Remove the entry
- Significant content changes? Update `<lastmod>` to today's date

### Meta Tags (per page)
- New page? Ensure it has: `<title>`, `<meta name="description">`, canonical URL, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), and `hreflang` alternates
- Changed page title or description? Update the corresponding `<title>`, `<meta description>`, OG, and Twitter Card tags to match

### Structured Data
- Changes to business info (address, services, pricing)? Update the JSON-LD in `index.html`

### Images
- New images added? Ensure all `<img>` tags have descriptive `alt` text, `width`/`height` attributes, and `loading="lazy"` (except above-the-fold)

### Navigation & Internal Links
- New page? Add nav link to all pages' `<header>` (keep headers identical across pages)
- Page removed or renamed? Update all internal links and nav references

### Translations (i18n)
- New user-facing text? Add both NL and EN translations in `js/main.js` and use `data-i18n` attributes
