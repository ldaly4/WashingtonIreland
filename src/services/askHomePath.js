export const ASK_HOMEPATH_API_URL =
  globalThis.HOMEPATH_CONFIG?.ASK_HOMEPATH_API_URL || "";

export async function askHomePath(question) {
  if (!ASK_HOMEPATH_API_URL) {
    return {
      source: "local",
      error: "Ask HomePath AI is not connected yet. The local guidance library is being used.",
    };
  }

  const response = await fetch(ASK_HOMEPATH_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Ask HomePath is unavailable");
  return { source: "ai", answer: payload.answer };
}
