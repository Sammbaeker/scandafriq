# Contact Form Backend — Firebase

Supersedes the hosting/forms portion of `04-deployment-and-dns.md`. The site
is hosted on **Firebase Hosting**, and the contact form writes to
**Firestore**, instead of Netlify + a third-party forms service. Everything
lives in one Google Cloud / Firebase project, and is operable through MCP
from Claude Code.

## Why this over the original Netlify plan

No real downside once you already have the account — it removes a vendor
(the forms service) instead of adding one, and the hosting + backend +
DNS all live in the same console, which matters for a one-person ops team
at idea stage. The only thing to watch: Firebase free tier (Spark plan)
covers Hosting and Firestore for this site's expected traffic comfortably,
but Cloud Functions / Extensions that send email may require the
pay-as-you-go **Blaze** plan (it still has a generous free tier on Blaze —
you don't get billed unless you exceed it, but it does require adding a
billing account). Confirm this before building, not after — flag it back
if a billing account isn't something to add yet.

## 1. Firestore setup

- Create the project (or use the existing one) in Native mode Firestore.
- Pick a region once — this can't be changed later without recreating the
  database. `europe-west1` (Belgium) or `europe-north1` (Finland) are the
  closest regions to Sweden; either is fine, pick one and move on.
- Collection: `contact_submissions`. Fields: `name`, `email`, `audience`
  (funder / university / partner / other — matches the three Get Involved
  blocks in `02-content-sitemap.md`), `message`, `submittedAt` (server
  timestamp).

**Security rules** — public create-only, no read/update/delete from
clients:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contact_submissions/{docId} {
      allow create: if request.resource.data.keys().hasOnly(
        ['name', 'email', 'audience', 'message', 'submittedAt']
      ) && request.resource.data.email is string
        && request.resource.data.message.size() < 5000;
      allow read, update, delete: if false;
    }
  }
}
```

This blocks anyone from reading other people's submissions or editing
existing ones — the only access a public client should ever have is adding
a new one. View submissions through the Firebase console, not a public
read path.

## 2. App Check (do this — don't skip it)

A create-only public rule is still an open write endpoint. Anyone who views
your page source has your Firebase config and can script submissions
straight into Firestore, no form needed. Enable **Firebase App Check**
with reCAPTCHA Enterprise (or reCAPTCHA v3 on Spark plan) on the web app,
and enforce it in the Firestore rules. This is the actual spam/abuse
defense — the security rule alone is not.

## 3. Form wiring

In `ContactForm.astro`, replace the TODO with the Firebase web SDK:

```js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const app = initializeApp(firebaseConfig); // from your Firebase project settings
initializeAppCheck(app, { provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY), isTokenAutoRefreshEnabled: true });
const db = getFirestore(app);

async function handleSubmit(formData) {
  await addDoc(collection(db, "contact_submissions"), {
    name: formData.name,
    email: formData.email,
    audience: formData.audience,
    message: formData.message,
    submittedAt: serverTimestamp(),
  });
}
```

Show a clear success/error state in the UI — a static site form with no
backend round-trip page-load means the user has no other signal that the
submission worked.

## 4. Notification on submission

Install the **"Trigger Email" Firebase Extension**, configured to watch
`contact_submissions` and send via your SMTP credentials (Gmail app
password, or SendGrid) whenever a new document is created. No custom
function code required for the basic case.

If routing by `audience` to different inboxes (funders vs. universities vs.
partners — the three blocks on `/get-involved`) is wanted, that's beyond
what the extension does out of the box — a small Cloud Function
(`onDocumentCreated` trigger) reading the `audience` field and choosing
the destination address is the right escalation, not a workaround on the
extension.

## 5. Deploy to Firebase Hosting

```
firebase init hosting          # public dir = dist, single-page app = No
firebase deploy --only hosting
```

Test everything on the `*.web.app` URL first, including a real form
submission end to end (Firestore doc created, email actually received) —
not just that the page loads.

For CI/CD from GitHub:

```
firebase init hosting:github
```

This sets up a GitHub Action that deploys to a preview channel on pull
requests and to production on merge to `main` — push-to-deploy, matching
the original "build, push to GitHub" workflow, just landing on Firebase
instead of Netlify.

## 6. Custom domain + DNS cutover (replaces step 3-4 of `04`)

Firebase's current process is **TXT verification first, then A records**
— do not add A records before the TXT record is verified, Firebase won't
provision the SSL certificate otherwise.

1. Firebase console → Hosting → Add custom domain → `scandafriq.se`.
2. Firebase gives a TXT record (host/value). Add it at WordPress.com →
   Domains → DNS records. Wait for propagation, click Verify in Firebase
   console. This can take a few hours — don't assume failure if Verify
   doesn't succeed immediately.
3. Once verified, Firebase gives specific A record(s) for the apex domain
   (and a setup path for `www`, typically a CNAME or redirect). At
   WordPress.com: **remove any existing A/AAAA/CNAME records pointing
   elsewhere first** — Firebase explicitly will not issue a certificate if
   conflicting records are still present.
4. Add the Firebase-provided A records. Lower TTL beforehand (same
   reasoning as the original doc `04`: a short TTL means a fast rollback
   if something's wrong, not a 72-hour wait).
5. SSL provisioning after correct DNS can take up to 24 hours in some
   cases (usually faster) — don't panic at an interim certificate warning,
   but don't call it done until the cert is actually issued and `https://scandafriq.se`
   loads cleanly.
6. Restore TTL to normal after a few stable days, same as before.

## 7. Rollback

Same principle as the original plan: keep a note of the WordPress.com
hosting A records you removed in step 3, so they can be re-added the same
way if something breaks post-cutover. Don't cut DNS until steps 1-5 above
are fully verified working on the `*.web.app` URL — that verification is
what makes a rollback unlikely to be needed at all.

## What to hand to Claude Code

Since Claude Code's IDE has MCP access to Firebase, it can run the
`firebase init` / `firebase deploy` steps and write the security rules and
extension config directly — it doesn't need you to do this by hand in the
console first. What it cannot do for you: clicking "Verify" in the
WordPress.com DNS panel and the Firebase console domain wizard, since
those are account-level actions outside any CLI/MCP scope. Expect to do
steps in section 6 yourself even with full MCP access.
