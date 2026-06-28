import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

/** Allowed audience values — must match the <select> options in ContactForm.astro */
const VALID_AUDIENCES = ["funder", "university", "mobility-energy", "other"];

/** Basic email format check — not exhaustive, just catches obviously wrong input */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface ContactPayload {
  name: string;
  email: string;
  audience: string;
  message: string;
}

/**
 * Validates and writes a contact form submission to Firestore.
 *
 * Accepts POST requests with JSON body:
 *   { name, email, audience, message }
 *
 * Returns 200 on success, 400 on validation error, 500 on server error.
 *
 * This function uses the Admin SDK to write to Firestore, bypassing
 * security rules entirely — the firestore.rules file denies all client
 * access, which is correct since no client should ever write directly.
 */
export const submitContactForm = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    // CORS — allow the site's own origin (and localhost for dev)
    const allowedOrigins = [
      "https://scandafriq.se",
      "https://scandafriq-site.web.app",
      "https://scandafriq-site.firebaseapp.com",
      "http://localhost:4321",
    ];
    const origin = req.headers.origin || "";
    if (allowedOrigins.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    // Only accept POST
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // Parse and validate
    const body = req.body as Partial<ContactPayload>;

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const audience = (body.audience || "").trim();
    const message = (body.message || "").trim();

    const errors: string[] = [];

    if (!name) {
      errors.push("Name is required.");
    }
    if (!email) {
      errors.push("Email is required.");
    } else if (!isValidEmail(email)) {
      errors.push("Email format is invalid.");
    }
    if (!audience) {
      errors.push("Please select an audience.");
    } else if (!VALID_AUDIENCES.includes(audience)) {
      errors.push("Invalid audience selection.");
    }
    if (!message) {
      errors.push("Message is required.");
    } else if (message.length > 5000) {
      errors.push("Message must be under 5,000 characters.");
    }

    if (errors.length > 0) {
      res.status(400).json({ error: errors.join(" ") });
      return;
    }

    // Write to Firestore
    try {
      await db.collection("contact_submissions").add({
        name,
        email,
        audience,
        message,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("✅ NEW SUCCESSFUL SUBMISSION:", { name, email, audience, message });
      res.status(200).json({ success: true });
    } catch (err) {
      functions.logger.error("Failed to write contact submission", err);
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  });
