/**
 * HR referral capture — Apps Script attached to YOUR Google Sheet.
 *
 * External React apps (hr-referral-web) POST JSON to this Web App URL with
 * Content-Type: text/plain;charset=utf-8 (see submit-lead.ts) so browsers avoid CORS preflight.
 *
 * File: Code.gs only (React app POSTs JSON; no HTML file in this project).
 *
 * Deploy → Web app → Execute as: Me, Who has access: Anyone.
 *
 * Sheet "Sheet1" row 1 must match appendRow column order exactly:
 * Submitted at | Name | Email | Phone | UTM_ID | UTM_SOURCE | CTA
 *
 * HR routing still uses payload utm_id against HR_UTM_MAP (not stored as a separate HR Name column).
 */

/** Server-side mapping: utm_id → canonical HR display name */
var HR_UTM_MAP = {
  HR_TANUSHREE_001: "Tanushree",
  HR_TADAKSHA_001: "Tadaksha",
  HR_SRAVANI_001: "Sravani",
};

/** Duplicate email check on column C (Email). Set false to allow repeats. */
var DEDUPE_EMAIL = true;

/** Optional JSON POST secret. Leave "" unless you POST JSON from your server with { secret: "..." }. */
var WEBHOOK_SECRET = "";

var CTA_LABELS = {
  google_meet: "Google Meet",
  direct_call: "Direct call",
  no_call: "No call",
};

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
  return sh;
}

function validateCta(raw) {
  var k = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (k === "googlemeet" || k === "google_meet") return "google_meet";
  if (k === "directcall" || k === "direct_call") return "direct_call";
  if (k === "nocall" || k === "no_call") return "no_call";
  return "";
}

function appendLeadRow_(payload) {
  var sheet = getSheet();
  var tz = Session.getScriptTimeZone() || "Asia/Kolkata";
  var now = new Date();
  var submittedAt =
    Utilities.formatDate(now, tz, "dd-MM-yyyy") + " " + Utilities.formatDate(now, tz, "hh:mm a");

  var utmId = String(payload.utm_id || "").trim();
  if (!HR_UTM_MAP[utmId]) {
    throw new Error("Invalid or missing utm_id for HR routing.");
  }

  var emailNorm = normalizeEmail(payload.email);
  if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    throw new Error("Invalid email.");
  }

  var name = String(payload.name || "").trim();
  if (name.length < 2) throw new Error("Invalid name.");

  var phone = String(payload.phone || "").replace(/\s+/g, " ").trim();
  if (phone.length < 8) throw new Error("Invalid phone.");

  var ctaKey = validateCta(payload.cta);
  if (!ctaKey) throw new Error("Invalid CTA.");

  if (DEDUPE_EMAIL && emailNorm) {
    var lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      var emailRange = sheet.getRange(2, 3, lastRow, 3);
      var hit = emailRange
        .createTextFinder(emailNorm)
        .matchCase(false)
        .matchEntireCell(true)
        .findNext();
      if (hit) throw new Error("DUPLICATE_EMAIL");
    }
  }

  var lock = LockService.getDocumentLock();
  lock.waitLock(5000);
  try {
    sheet.appendRow([
      submittedAt,
      name,
      payload.email || "",
      phone,
      utmId,
      String(payload.utm_source || "").trim(),
      CTA_LABELS[ctaKey],
    ]);
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

/**
 * GET: short text only. Lead capture uses POST → doPost (React app).
 */
function doGet(e) {
  return ContentService.createTextOutput(
    "SurelyPlaced HR referral Web App — submit leads via POST (JSON) from your deployed app; see doPost in Code.gs.",
  ).setMimeType(ContentService.MimeType.TEXT);
}

/** Optional: JSON POST (server-to-server). Requires WEBHOOK_SECRET if set. */
function doPost(e) {
  var out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);

  try {
    if (!e.postData || !e.postData.contents) {
      out.setContent(JSON.stringify({ ok: false, error: "No body" }));
      return out;
    }
    var data = JSON.parse(e.postData.contents);
    if (WEBHOOK_SECRET && data.secret !== WEBHOOK_SECRET) {
      out.setContent(JSON.stringify({ ok: false, error: "Unauthorized" }));
      return out;
    }
    appendLeadRow_(data);
    out.setContent(JSON.stringify({ ok: true }));
    return out;
  } catch (err) {
    var msg = String(err && err.message ? err.message : err);
    if (msg === "DUPLICATE_EMAIL") {
      out.setContent(
        JSON.stringify({
          ok: false,
          error: "DUPLICATE_EMAIL",
          message: "You already submitted with this email.",
        }),
      );
      return out;
    }
    out.setContent(JSON.stringify({ ok: false, error: msg }));
    return out;
  }
}
