# Tech Stack & Project Structure

## Stack choice

**Astro + Tailwind CSS**, output as static HTML, deployed as a static site.

Why this over alternatives:

- **vs. plain HTML/CSS/JS:** Six content-heavy pages with a shared nav,
  footer, and design tokens will produce a lot of copy-pasted markup in
  plain HTML. Astro gives component reuse and layouts with effectively zero
  client-side JS shipped by default — it still outputs static HTML, so it
  doesn't add runtime complexity, it just removes the copy-paste.
- **vs. Next.js/React SPA:** This site has no app state, no auth, no data
  fetching, no booking flow. A full React framework is more machinery than
  six pitch pages need, and it ships more JS to the browser for no benefit.
  If the rider app or a dashboard gets built later, that's a separate
  project — this is the marketing/credibility site, keep it light.
- **vs. a static site generator like Hugo/Jekyll:** Astro's component model
  (props, slots) makes it much easier to keep the team-card, stat-strip, and
  CTA-band components consistent across pages than templating languages do,
  and Claude Code works with it cleanly since it's just JS/TS + HTML-like
  syntax, no separate templating DSL to get wrong.

Tailwind for styling because the design tokens in `01-brand-and-design-system.md`
map directly onto a Tailwind config (`theme.extend.colors`, `theme.extend.fontFamily`)
— it keeps colors and spacing consistent without hand-maintaining a separate
CSS variables file in parallel.

## Required output

Static HTML/CSS/JS only. No server runtime, no database, no environment
variables required at request time. This must be deployable to GitHub
Pages, Netlify, Vercel, or Cloudflare Pages without modification — don't
introduce anything (API routes, server actions, SSR) that requires a
specific host's runtime, since the hosting decision is made in
`04-deployment-and-dns.md`, not here, and may change.

## Folder structure

```
scandafriq-site/
├── docs/                        # this documentation set
├── public/
│   ├── favicon.svg              # derived from logo mark
│   ├── logo.svg                 # the supplied logo, vectorized if possible
│   └── og-image.png             # social share preview image
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro      # <head>, nav, footer, shared across all pages
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── StatStrip.astro
│   │   ├── TeamCard.astro
│   │   ├── CtaBand.astro
│   │   └── ContactForm.astro
│   ├── content/
│   │   └── team.json            # the three team bios as structured data,
│   │                             # consumed by TeamCard — keeps copy edits
│   │                             # out of component markup
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── how-it-works.astro
│   │   ├── impact.astro
│   │   ├── team.astro
│   │   ├── get-involved.astro
│   │   └── contact.astro
│   └── styles/
│       └── global.css           # Tailwind import + any custom @layer rules
├── tailwind.config.mjs           # design tokens from 01-brand-and-design-system.md
├── astro.config.mjs
└── package.json
```

## Component notes

- **`TeamCard.astro`** reads from `team.json` rather than hardcoding bios in
  the page — when a bio changes (likely, as the team or roles evolve),
  that's a data edit, not a markup edit.
- **`ContactForm.astro`** needs a form backend since this is a static site
  with no server. Use a static-form-friendly service (Netlify Forms if
  hosting on Netlify, or Formspree/Web3Forms if hosting elsewhere) —
  decide this alongside the hosting choice in `04`, don't build the form
  assuming a specific backend before that's settled.
- **`StatStrip.astro`** and **`CtaBand.astro`** are reused across Home,
  Impact, and Get Involved — build them generic enough (props for
  heading/stats/CTA text) to avoid three near-duplicate components.

## Performance bar

- Lighthouse performance ≥ 95 on mobile for every page. This is an easy bar
  for a static Astro site with no client JS frameworks shipped — if it's
  not hit, something unnecessary (an embedded video, an unoptimized image,
  a client-side widget) has been added that doesn't belong on a six-page
  pitch site.
- Images: serve as WebP/AVIF with explicit width/height (Astro's built-in
  `<Image />` component handles this), no images over ~200KB.
- No layout shift from web fonts — use `font-display: swap` and preload the
  two font files actually used (heading + body), don't load a full Google
  Fonts family with every weight.

## Accessibility bar

- Semantic HTML throughout (`<nav>`, `<main>`, `<header>`, `<footer>`,
  proper heading hierarchy per page — one `<h1>` per page, not per section).
- Color contrast: verify `--color-ink` on `--color-surface` and white text
  on `--color-primary` both pass WCAG AA (4.5:1) before using them for body
  text — the primary green is mid-toned enough that white-on-green text
  should be checked, not assumed.
- All interactive elements (nav, CTAs, form fields) keyboard-navigable with
  visible focus states — don't strip default focus outlines without
  replacing them with an equally visible custom one.

## What NOT to build in v1

- No CMS integration, no admin login, no database.
- No multi-language toggle (Swedish/English) — pick one language for launch
  (English, given the audience is grant bodies and Nigerian university
  partners more than local Malmö residents) and revisit later if needed.
- No blog/news section unless there's already a commitment to maintain it —
  an empty or stale blog hurts credibility more than no blog at all.
