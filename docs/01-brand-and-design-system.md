# Brand & Design System

## Logo color extraction

Sampled directly from the supplied logo (`2.png`, 500×500, solid background
with white linework — no gradients, no anti-aliasing noise beyond a 1-2px edge):

| Role | Hex | RGB | Notes |
|---|---|---|---|
| Primary brand green | `#4B8276` | 75, 130, 118 | Dominant fill — ~95% of pixels. This is the brand anchor color. |
| White (mark + negative space) | `#FFFFFF` | 255, 255, 255 | Logo linework only. Use as a surface color, not a text color on light backgrounds. |

That's genuinely all that's in the file — it's a one-color mark on a flat
field. Everything else below is derived to support a real site (text, hover
states, accents) and is not "in the logo," so treat it as a proposal, not
an extraction.

## Full palette (derived)

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#4B8276` | Logo green. Header/nav background option, primary buttons, section dividers, icons |
| `--color-primary-dark` | `#2F564C` | Hover/active states on primary, footer background |
| `--color-ink` | `#1A2A26` | Body text on light backgrounds (a near-black tinted toward the green, not pure black — keeps the palette cohesive) |
| `--color-accent` | `#C97B3D` | Warm terracotta/sand — the West Africa half of the brand story. Use sparingly: CTAs that need to stand out from green-on-green, stat highlights, hover underlines |
| `--color-sand` | `#F4EFE6` | Page background alternative to pure white — warmer, less clinical |
| `--color-surface` | `#FFFFFF` | Cards, default page background |
| `--color-grey-600` | `#5B5B5B` | Secondary text, captions |
| `--color-grey-200` | `#E3E0D7` | Borders, dividers, disabled states |

Rationale for the terracotta accent: the logo gives you one color. A site
that is 100% green-and-white reads flat and corporate (think generic eco
brand) rather than "Scandinavia meets West Africa." The terracotta is the
only color choice in this doc that isn't pulled from the file — flag it to
the team as a brand decision, not a Claude Code default, in case there's
already a secondary color in use elsewhere (pitch deck, social media) that
should take precedence instead.

## Typography

- **Headings:** A geometric sans with some personality — `Space Grotesk` or
  `General Sans` (both free, self-hostable, Google Fonts has Space Grotesk).
  Avoid anything that reads as a generic SaaS font (Inter alone, for everything,
  reads template-y).
- **Body:** `Inter` or `IBM Plex Sans` at 16-18px base, 1.6 line-height.
  Optimize for readability of fairly dense problem/solution/market text —
  this is a pitch site, people will actually read paragraphs.
- **Scale:** Use a modular scale (1.25 ratio is enough): 16 / 20 / 25 / 31 /
  39 / 49px. Don't go above ~49px even on hero headings — "modern and simple"
  reads better restrained than oversized.

## Layout principles

- **Generous whitespace, not dense.** This is a pitch and credibility site,
  not a product dashboard. Let sections breathe — min 80-120px vertical
  section padding on desktop.
- **Max content width ~1100-1200px**, centered. Text blocks within that
  should cap around 65-75 characters per line for readability.
- **One accent per screen.** Don't combine terracotta CTA + terracotta stat
  highlight + terracotta icon all in the same viewport — pick one accent
  moment per section so it still reads as an accent.
- **Icon style:** Line icons matching the logo's stroke weight (the leaf/plant
  mark is a clean, even-weight outline — Lucide or Phosphor icon sets match
  that weight well, avoid filled/glyph icon sets which will clash).

## Imagery direction

- No generic stock photography of "diverse people smiling at laptop." If
  real photos aren't available yet (likely, at idea stage), use simple
  custom illustration or abstract geometric shapes in the brand palette
  instead of stock photos — it reads more honest for a pre-launch startup
  than stock photography that implies a product that doesn't exist yet.
- Where a literal scooter/campus image is needed (e.g. referencing the LASU
  precedent), prefer a simple line illustration over a photo unless an
  actual licensed photo is sourced — don't pull random scooter stock photos
  off the web, they'll look like a different (non-Nordic, non-this-brand) company.

## Tone of voice

- Direct and concrete over promotional. The underlying pitch deck already
  leans into stats and named precedents (LASU, TETFUND, Trekk) — the site
  copy should keep that evidence-based tone rather than drifting into vague
  "revolutionizing mobility" startup-speak.
- First person plural ("we"), confident but not overselling — this is an
  idea-stage company seeking grants/partners, and credibility matters more
  than hype to that specific audience.
- Sweden and Nigeria both treated as substantive, not "exotic backdrop."
  Avoid language that frames Malmö as the brains and Lagos as the market —
  the actual team bios should carry the West African insight as real
  expertise, not just lived experience.

## Dark mode

Not required for v1. If added later, primary green and terracotta both have
enough contrast range to support a dark variant (swap `--color-surface` to
a dark desaturated green `#16241F`, keep terracotta as-is, lighten ink to
`#EDEAE2` for text) — don't build it now, just don't paint the CSS into a
corner that makes it hard later (use the tokens above, not hardcoded hex
values, throughout the codebase).
