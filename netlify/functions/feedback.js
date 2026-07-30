/**
 * feedback.js  (Netlify Function)
 * ------------------------------------------------------------
 * Persistent store for visitor feedback on the Micah portfolio.
 * Replaces the previous localStorage-only flow so submissions are
 * visible to every visitor once the admin approves them.
 *
 * Storage: Netlify Blobs (free tier, scoped to this site).
 *   - One blob named "feedback" holds a JSON array of entries.
 *   - Each entry: { id, name, authorMeta, rating, message, ts, status }
 *     status is "pending" until the admin approves it.
 *
 * Endpoints (default Netlify Functions path):
 *   GET  /.netlify/functions/feedback                 -> list approved entries
 *   GET  /.netlify/functions/feedback?view=admin      -> list all entries (requires admin auth)
 *   POST /.netlify/functions/feedback                 -> submit a new "pending" entry
 *   POST /.netlify/functions/feedback?action=approve  -> mark approved   (admin auth)
 *   POST /.netlify/functions/feedback?action=hide     -> mark pending    (admin auth)
 *   POST /.netlify/functions/feedback?action=delete   -> remove entry    (admin auth)
 *
 * Admin auth mirrors the browser side: client sends the SHA-256 hash of
 * the password in `x-admin-hash`. Compared to the same hash the static
 * site uses (window.ADMIN_CONFIG.passwordHash) so no new secret is
 * introduced. Hash-only is fine here because we already publish the hash
 * to every visitor — it isn't a server-only secret.
 * ------------------------------------------------------------
 */

const { getStore } = require("@netlify/blobs");

const STORE_NAME = "feedback";
const BLOB_KEY = "feedback";
const MAX_ENTRIES = 200; // hard cap so a spam run can't grow the blob forever

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-hash",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

function ok(body, status = 200) {
  return { statusCode: status, headers: corsHeaders, body: JSON.stringify(body) };
}

function bad(message, status = 400) {
  return ok({ error: message }, status);
}

async function readAll(store) {
  try {
    const raw = await store.get(BLOB_KEY, { type: "json" });
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (err) {
    // Blobs throws on a missing key — treat as empty list, not an error.
    // The SDK's exact error shape varies by version ("not found",
    // status 404, code 'blob_not_found', etc.), so we accept any of these.
    const msg = String((err && err.message) || "");
    const code = String((err && err.code) || "");
    const status = (err && (err.status || err.statusCode)) || 0;
    const looksLikeMissing =
      status === 404 ||
      /not\s*found/i.test(msg) ||
      code === "blob_not_found" ||
      err instanceof TypeError === false && /missing/i.test(msg);
    if (looksLikeMissing) return [];
    console.error("feedback: readAll failed:", err);
    return [];
  }
}

async function writeAll(store, list) {
  // Sort newest-first so the public view doesn't need to sort on the client.
  const sorted = list.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
  // Cap to MAX_ENTRIES to keep the blob small even under spam.
  const trimmed = sorted.slice(0, MAX_ENTRIES);
  await store.set(BLOB_KEY, JSON.stringify(trimmed));
}

function newId() {
  return "fb_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

function sanitizeEntry(input) {
  if (!input || typeof input !== "object") return null;
  const rating = Math.max(0, Math.min(5, Number(input.rating) || 0));
  const message = String(input.message || "").trim().slice(0, 500);
  if (!message || !rating) return null;
  return {
    id: newId(),
    name: String(input.name || "").trim().slice(0, 60),
    authorMeta: String(input.authorMeta || input.company || "").trim().slice(0, 80),
    rating,
    message,
    ts: Date.now(),
    status: "pending",
  };
}

function isAdminAuthed(event) {
  const expected = process.env.ADMIN_PASSWORD_HASH;
  if (!expected) return false;
  const provided = (event.headers || {})["x-admin-hash"] || (event.headers || {})["X-Admin-Hash"];
  if (!provided || typeof provided !== "string") return false;
  // Constant-time compare (length matters too — return early on length only,
  // not on first byte, then continue comparing).
  if (provided.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < provided.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return bad("Method not allowed", 405);
  }

  let store;
  try {
    store = getStore(STORE_NAME);
  } catch (err) {
    // Outside Netlify (local dev without netlify-cli) the Blobs SDK can
    // throw because the site context isn't set. Fall back to a no-op
    // response so the client can show a friendly "feedback unavailable"
    // state instead of a 500.
    console.error("feedback: getStore failed:", err);
    return bad("Feedback storage is not available in this environment.", 503);
  }

  const params = event.queryStringParameters || {};
  const action = params.action;

  // -------- READ --------
  if (event.httpMethod === "GET") {
    const list = await readAll(store);
    if (params.view === "admin") {
      if (!isAdminAuthed(event)) return bad("Admin auth required.", 401);
      return ok({ entries: list });
    }
    // Public view: only approved entries. Sort newest-first for consistency.
    const approved = list
      .filter((f) => f && f.status === "approved")
      .sort((a, b) => (b.ts || 0) - (a.ts || 0));
    return ok({ entries: approved });
  }

  // -------- WRITE --------
  // Both submit (public) and admin actions come in as POST.
  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return bad("Invalid JSON body.");
  }

  let list;
  try {
    list = await readAll(store);
  } catch (err) {
    console.error("feedback: readAll threw unexpectedly:", err);
    return bad("Couldn't read feedback storage.", 500);
  }

  if (action === "approve" || action === "hide" || action === "delete") {
    if (!isAdminAuthed(event)) return bad("Admin auth required.", 401);
    const id = String(payload.id || "");
    if (!id) return bad("Missing id.");
    const idx = list.findIndex((f) => f && f.id === id);
    if (idx === -1) return bad("Entry not found.", 404);
    if (action === "delete") {
      list.splice(idx, 1);
    } else {
      list[idx].status = action === "approve" ? "approved" : "pending";
    }
    try {
      await writeAll(store, list);
    } catch (err) {
      console.error("feedback: writeAll failed:", err);
      return bad("Couldn't save feedback change.", 500);
    }
    return ok({ ok: true, entries: list });
  }

  // Default POST = public submit.
  const entry = sanitizeEntry(payload);
  if (!entry) return bad("Feedback needs a rating (1-5) and a message.");
  list.push(entry);
  try {
    await writeAll(store, list);
  } catch (err) {
    console.error("feedback: writeAll on submit failed:", err);
    return bad("Couldn't save feedback.", 500);
  }
  return ok({ ok: true, entry }, 201);
};
