# Deployment & DNS Cutover

> **Revision note:** this doc originally recommended Netlify/Vercel as the
> host, with a separate third-party form service. That recommendation is
> superseded — see `06-contact-form-firebase.md`. The project owner already
> has a Google Cloud / Firebase account, so **Firebase Hosting** is now the
> host, and the contact form backend lives there too instead of on a
> separate vendor. The Netlify/Vercel comparison table below is kept for
> reference only — skip to `06` for the current Firebase Hosting + DNS steps.

This is the one part of the project where order matters more than speed.
Follow the sequence below — don't touch DNS until the backend (doc `06`)
is built and tested, and don't touch DNS before step 4 either way.

## 0. Current state (confirmed)

- `scandafriq.se` is registered through WordPress.com, with nameservers
  already pointed at WordPress.com. That means DNS records can be edited
  directly in WordPress.com's dashboard (Domains → DNS records) without any
  nameserver migration — confirmed against WordPress.com's current support
  documentation. You do not need to move the domain anywhere.
- There is presumably a live WordPress placeholder on that domain right
  now. It will stay live and unaffected until DNS is actually changed in
  step 4 — building and testing the new site in steps 1-3 is completely
  safe and reversible.

## 1. Repository

- Create a GitHub repo (e.g. `scandafriq/scandafriq-site` or under your
  personal account).
- Develop locally, push commits as normal. Nothing here touches the live
  domain.

## 2. Choose a host, connect it to GitHub

Recommendation: **Firebase Hosting**, given a Google Cloud account already
exists and the contact form backend is built on Firebase Functions +
Firestore (see `06-firebase-contact-form.md`). Putting hosting on the same
platform avoids managing a third service (Netlify/Vercel) on top of a
Google Cloud project, and keeps one set of credentials, one billing
account, one console to check.

| | GitHub Pages | Netlify / Vercel | Firebase Hosting |
|---|---|---|---|
| Cost | Free | Free tier covers this site | Free tier (Spark plan) covers this site; Functions usage is metered but trivial at this volume |
| Custom domain + HTTPS | Manual DNS records, manual cert renewal awareness | Automatic HTTPS, simple custom-domain flow | Automatic HTTPS, simple custom-domain flow |
| Form/backend handling | None | Built-in forms, but a separate system from a Firebase backend | Native — same project as Functions/Firestore, no second backend to wire up |
| Preview deployments per branch/PR | No | Yes | Yes, via `firebase hosting:channel:deploy` (can be wired into GitHub Actions) |
| Auto-deploy on `git push` | Yes (Pages) | Yes | Yes, via the official Firebase GitHub Action (`firebase init hosting:github`) — not automatic out of the box like Netlify/Vercel, needs this one-time setup step |
| Astro support | Works, needs a small static-export config | Works out of the box | Works — `astro build` output (`dist/`) is just deployed as the Hosting public directory |

If there's a strong existing preference for Netlify or Vercel for the
static site itself, that still works — the Cloud Function backend is
reachable via `fetch()` from any host, it doesn't require Firebase Hosting
specifically. The instructions below assume Firebase Hosting as the
default; if a different host is chosen instead, only this section changes,
not the DNS sequencing in section 4.

Steps (Firebase Hosting, as the recommended path):
1. `firebase init hosting` in the repo (select the existing Firebase
   project, public directory `dist`, configure as a single-page app: No,
   since this is a multi-page static site).
2. `firebase init hosting:github` to set up automatic deploys via GitHub
   Actions on push to `main`, plus preview deploys on pull requests.
3. Push to `main`, confirm the deploy succeeds, and check the site on the
   temporary `*.web.app` or `*.firebaseapp.com` URL Firebase provides.
   Verify every page, **and specifically submit a real test message through
   the contact form** to confirm the Cloud Function, Firestore write, and
   email notification all work end-to-end — before going anywhere near DNS.

## 3. Add the custom domain on the host (before touching WordPress.com)

- In the Firebase console: Hosting → Add custom domain → enter
  `scandafriq.se`. Firebase will ask you to verify ownership (typically a
  TXT record) and will then show the exact A records needed for the apex
  domain, plus the records needed for `www`.
- Note those exact values. Don't add them to WordPress.com yet — just have
  them ready.

## 4. Cut over DNS at WordPress.com

This is the only step that affects the live domain. Do it deliberately:

1. Log into WordPress.com → Domains → `scandafriq.se` → DNS records.
2. **Lower the TTL** on existing A/CNAME records to something short (e.g.
   300 seconds / 5 minutes) and wait for that change to propagate (up to a
   few hours) — this means the *next* change propagates fast instead of
   taking up to 72 hours, which matters if something needs to be reverted
   quickly.
3. Remove the existing A record(s) pointing at WordPress.com's hosting.
4. Add the new record(s) from step 3 above (the apex A/ALIAS record and the
   `www` record that Firebase gave you).
5. Wait for propagation (check with a DNS lookup tool, not just by
   reloading the browser — your own device may cache the old result).
6. Once propagated, confirm HTTPS is active on the new host (Firebase
   auto-provisions a certificate once DNS resolves correctly — this can
   take up to 24 hours after DNS catches up, slower than some other hosts,
   so build in patience here specifically).

## 5. Rollback plan

If something goes wrong after cutover (site broken, cert not issuing,
content error discovered): the previous A records pointing back to
WordPress.com's WordPress hosting can be re-added the same way, and will
take effect on the same shortened TTL. This is why step 2 (lowering TTL
first) matters — without it, a rollback could take up to 72 hours to fully
propagate everywhere instead of minutes.

## 6. After cutover

- Restore TTL to a normal value (e.g. 3600s/1hr) once the new setup is
  confirmed stable for a few days — very short TTLs increase DNS query
  load slightly and aren't needed long-term.
- Set up basic uptime monitoring (even a free tool like UptimeRobot) — at
  idea stage there's no ops team watching this, a downtime alert is cheap
  insurance against losing it to a grant reviewer or partner clicking a
  dead link.
