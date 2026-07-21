export const DEFAULT_MODEL = "gpt-5.2";
export const SMALL_MODEL = "gpt-5-mini";

export function model(env, fallback = DEFAULT_MODEL) {
  return env.OPENAI_MODEL || fallback;
}

export function responseText(payload) {
  if (payload.output_text) return payload.output_text;
  const content = payload.output?.flatMap(item => item.content || []) || [];
  return content.find(part => part.type === "output_text" || part.type === "text")?.text || "";
}

export async function callResponses(env, body) {
  if (!env.OPENAI_API_KEY) {
    return { error: { status: 500, code: "MISSING_API_KEY", message: "HomePath's live explanation service is not configured." } };
  }
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) {
      return { error: { status: 502, code: "OPENAI_UNAVAILABLE", message: "HomePath's live explanation service is temporarily unavailable." } };
    }
    return { payload };
  } catch {
    return { error: { status: 502, code: "OPENAI_UNAVAILABLE", message: "HomePath's live explanation service is temporarily unavailable." } };
  }
}

export function parseJson(text) {
  try {
    return { value: JSON.parse(text) };
  } catch {
    return { error: true };
  }
}
