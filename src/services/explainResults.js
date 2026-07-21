export const EXPLAIN_RESULTS_API_URL =
  globalThis.HOMEPATH_CONFIG?.EXPLAIN_RESULTS_API_URL || "";

export async function explainResults(summary) {
  if (!EXPLAIN_RESULTS_API_URL) throw new Error("Live explanation service is not connected.");
  const response = await fetch(EXPLAIN_RESULTS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(summary),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || "Live explanation service is unavailable.");
  return payload;
}
