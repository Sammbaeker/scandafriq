# Claude Code Build Prompt

Paste the block below into Claude Code as the first message in this repo,
with the `docs/` folder (this whole doc set) already copied into the repo
root and the logo file saved at `public/logo.png` (and vectorized to
`public/logo.svg` if possible — flag if not possible from a raster source
and a flat SVG recreation of the mark will need to be done separately).

---

> Build the ScandAfriq marketing/pitch website in this repo using Astro and
> Tailwind CSS, output as a static site with no server runtime.
>
> Before writing code, read all files in `docs/` — `01` through `04` — and
> follow them as the spec:
> - `01-brand-and-design-system.md` for colors, typography, spacing, and tone
> - `02-content-sitemap.md` for the exact page list and the actual copy/content for each page
> - `03-tech-stack-and-structure.md` for the folder structure, component breakdown, and performance/accessibility requirements
> - Do not implement anything from `04-deployment-and-dns.md` yet — that's a deployment step for later, not part of the build.
>
> Specific requirements:
> 1. Set up the Tailwind config with the color tokens and font choices from `01` as named theme values (not raw hex scattered through components).
> 2. Build the shared `BaseLayout`, `Nav`, and `Footer` first, then the page-specific content, using the components listed in `03`.
> 3. Use the team bios in `02-content-sitemap.md` (Team section) for `src/content/team.json` — port them exactly, don't rewrite them.
> 4. Build the contact form UI now, but leave the submission handling as a clearly marked TODO with a comment explaining a static-form backend (Netlify Forms or similar) needs to be wired up after a hosting decision — don't guess at a backend.
> 5. Hit the performance and accessibility bar in `03` — semantic HTML, proper heading hierarchy, keyboard-navigable interactive elements, optimized images, no unnecessary client-side JS.
> 6. After the build, run through every page yourself and flag anything where the content in `02` was ambiguous or incomplete, rather than inventing copy to fill the gap.
>
> Ask me before making any brand or copy decisions that aren't already
> specified in `docs/` — e.g. don't invent a tagline, color, or page that
> isn't in this spec.

---

## Notes for follow-up prompts

- If iterating page-by-page instead of all at once, reference the specific
  doc section rather than re-describing it (e.g. "Build `/impact` per the
  Impact & Sustainability section of `02-content-sitemap.md`").
- If the team bios or business numbers change later, edit `team.json` and
  `02-content-sitemap.md` directly and ask Claude Code to sync the affected
  page — keeping the docs as the source of truth avoids the site and the
  docs drifting apart over time.
- Once the build is reviewed and approved locally, move to
  `04-deployment-and-dns.md` for hosting and the DNS cutover — not before.
