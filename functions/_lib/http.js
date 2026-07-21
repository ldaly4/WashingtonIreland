export const APPROVED_ORIGINS = [
  "https://ldaly4.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export function requestId() {
  return crypto.randomUUID?.() || String(Date.now());
}

export function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  if (!origin) {
    return {
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
  }
  if (!APPROVED_ORIGINS.includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export function errorResponse(code, message, status, headers = {}) {
  return json({ error: { code, message } }, status, headers);
}

export function preflight(request) {
  const headers = corsHeaders(request);
  if (!headers) return errorResponse("DISALLOWED_ORIGIN", "This origin is not allowed to use HomePath AI.", 403);
  return new Response(null, { status: 204, headers });
}

export function requireCors(request) {
  const headers = corsHeaders(request);
  if (!headers) return { response: errorResponse("DISALLOWED_ORIGIN", "This origin is not allowed to use HomePath AI.", 403) };
  return { headers };
}

export async function readJson(request, headers, maxBytes = 32000) {
  const type = request.headers.get("Content-Type") || "";
  if (!type.includes("application/json")) {
    return { error: errorResponse("UNSUPPORTED_CONTENT_TYPE", "Send JSON with Content-Type: application/json.", 400, headers) };
  }
  const text = await request.text();
  if (text.length > maxBytes) return { error: errorResponse("PAYLOAD_TOO_LARGE", "This request is too large. Please shorten it and try again.", 413, headers) };
  try {
    return { body: JSON.parse(text) };
  } catch {
    return { error: errorResponse("INVALID_JSON", "The request could not be read as JSON.", 400, headers) };
  }
}

export function stripContactInfo(value = "") {
  return String(value)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email removed]")
    .replace(/\b(?:\+?\d[\s-]?){8,}\b/g, "[phone or account number removed]")
    .slice(0, 20000);
}

export function logRequest(endpoint, status, started, id, category = "ok") {
  console.log(JSON.stringify({ endpoint, status, durationMs: Date.now() - started, requestId: id, category }));
}
