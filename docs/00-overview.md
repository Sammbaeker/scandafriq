# ScandAfriq Website — Build Documentation

This folder is the full brief for building scandafriq.se as a native, hand-coded
static site, replacing the current WordPress placeholder. It is written to be
fed directly to Claude Code as project context.

## How to use this with Claude Code

1. Create a new GitHub repository (e.g. `scandafriq-site`), clone it locally,
   and copy this `docs/` folder into the repo root.
2. Open Claude Code in that repo directory.
3. Point it at this folder and ask it to read all six files before writing
   any code — the brand system, content, and tech spec are split out so each
   can be revised independently without re-prompting the whole brief.
4. Use `05-claude-code-build-prompt.md` as the literal first prompt. It
   references the other files instead of repeating them, so Claude Code pulls
   structure from `02`, look-and-feel from `01`, and stack decisions from `03`.
5. Do not touch DNS (`04-deployment-and-dns.md`) until the site is deployed
   and verified on its hosting URL. DNS is the last step, not a parallel one.

## File map

| File | Purpose |
|---|---|
| `01-brand-and-design-system.md` | Colors (extracted from logo), type, spacing, tone, component look |
| `02-content-sitemap.md` | Page list and the actual copy/content for each page |
| `03-tech-stack-and-structure.md` | Stack choice, folder structure, components, performance/accessibility bar |
| `04-deployment-and-dns.md` | GitHub → hosting → DNS cutover, in order, with rollback |
| `05-claude-code-build-prompt.md` | The prompt to paste into Claude Code to kick off the build |

## Project in one paragraph

ScandAfriq is an idea-stage social enterprise based in Malmö, building a
solar-charged electric scooter-sharing network for Nigerian university
campuses, pairing Scandinavian micromobility know-how with West African
market insight. The site's job at this stage is not e-commerce or a booking
flow — it's a credible pitch surface: explain the problem and solution
clearly, show the team is real, and give grant bodies, investors, university
partners, and early supporters a way to get in touch. Simple, fast, and
trustworthy beats flashy.

## Known constraints going in

- Domain `scandafriq.se` is registered through WordPress.com. Nameservers
  already point to WordPress.com, which means DNS records can be edited
  there directly — no nameserver migration needed (see `04`).
- No backend, CMS, or database needed for v1. Content changes should be
  editable by changing files in the repo, not by logging into an admin panel.
- Site must work from idea-stage today through pilot-stage content updates
  later (the team, market numbers, and "what we're seeking" sections will
  change as the pilot progresses — keep those in clearly separate, easy-to-find
  content blocks, not buried in layout markup).
