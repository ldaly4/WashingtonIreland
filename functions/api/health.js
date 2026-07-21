import { json, requireCors, preflight } from "../_lib/http.js";

export async function onRequestOptions({ request }) {
  return preflight(request);
}

export async function onRequestGet({ request }) {
  const { headers, response } = requireCors(request);
  if (response) return response;
  return json({ ok: true, service: "homepath-ai" }, 200, headers);
}
