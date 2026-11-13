# MAG Global Link: launch checklist

Checked 13 November 2026 against the Pre-Launch Checklists (01 Launch essentials, 02 Polish, 03 SEO, 04 Security, 05 Performance, 08 Online visibility). Only the items that apply to a static marketing site are listed.

## Done in the code

- [x] Custom 404 page (`404.html`, served by Vercel for unknown URLs)
- [x] Privacy page (`/privacy`)
- [x] Real contact details, clickable WhatsApp and email links
- [x] Favicon set: `favicon.ico`, 32px PNG, apple-touch-icon, web manifest with 192/512 icons
- [x] Unique title and meta description on every page
- [x] Open Graph and Twitter card tags (1200×630 image)
- [x] One clear call to action per page, above the fold, plus the floating WhatsApp button on mobile
- [x] Form: required name with inline error, tells people it opens WhatsApp, nothing stored
- [x] Alt text on content images, decorative images use empty alt
- [x] No horizontal scroll at 320 to 414px, mobile menu opens, closes on link tap and Esc
- [x] No placeholder text, no em dashes, dynamic copyright year
- [x] `robots.txt` allowing everything and pointing to the sitemap
- [x] `sitemap.xml` listing all 10 public pages
- [x] Canonical tag on every page, `noindex` only on the 404 page
- [x] Exactly one H1 per page, headings in order
- [x] Clean URLs (`/import-from-china/south-africa`), `.html` URLs redirect
- [x] Internal links between the home page, country hub and all five country pages
- [x] JSON-LD: Organization and WebSite (home), Service, BreadcrumbList and FAQPage (country pages)
- [x] Security headers in `vercel.json`: HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy
- [x] No secrets in the code (static site, no API keys)
- [x] Images converted to WebP at display size (2.3 MB down to about 550 KB), lazy loading below the fold, hero preloaded
- [x] Long cache headers on `/assets`
- [x] Vercel Web Analytics script added (cookieless)
- [x] Company profile: `/company-profile` (web) and `/MAG-Global-Link-Company-Profile.pdf` (725 KB, 9 phone-size pages)

## Needs you (in this order)

1. **Buy `maggloballink.com`** and add it to the Vercel project. Make the bare domain primary and redirect `www` to it.
2. **Enable Web Analytics** in the Vercel project (Analytics tab, Enable). Until then the analytics script returns 404, which is harmless.
3. **Google Search Console**: add a Domain property for `maggloballink.com`, verify with the DNS TXT record, then submit `https://maggloballink.com/sitemap.xml`. Use URL Inspection to request indexing for the home page and the five country pages.
4. **Bing Webmaster Tools**: sign in and import the site from Search Console.
5. **Test a WhatsApp link preview** by sending `https://maggloballink.com` to yourself once the domain is live.
6. **PageSpeed Insights** on mobile for the home page and one country page.
7. **Optional redirect**: once the domain works, redirect `mag-global-link.vercel.app` to it (Vercel domain settings).

## Online visibility (checklist 08)

- [ ] Google Business Profile (only if the business has an address customers can visit or a service area)
- [ ] Facebook page, Instagram, LinkedIn company page, with the same name, phone, email and website everywhere
- [ ] Send the social links so they can be added to the site's structured data (`sameAs`)
- [ ] Ask happy clients for Google reviews once the profile exists

## Editing the site

- Home page: edit `index.html` directly.
- Country pages, hub, privacy, 404, sitemap and robots: edit `scripts/build-pages.mjs`, then run `node scripts/build-pages.mjs`.
- Company profile: edit `company-profile.html`, then regenerate the PDF from a local server:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=MAG-Global-Link-Company-Profile.pdf http://127.0.0.1:4321/company-profile`
- Changing the domain: replace `https://maggloballink.com` in `index.html`, `company-profile.html` and `SITE` in `scripts/build-pages.mjs`, then rebuild.
