const allowedOrigins = [
  "https://ldaly4.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function responseText(payload) {
  if (payload.output_text) return payload.output_text;
  const content = payload.output?.flatMap(item => item.content || []) || [];
  const text = content.find(part => part.type === "output_text" || part.type === "text")?.text;
  if (text) return text;
  return "";
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders(request);
  if (!env.OPENAI_API_KEY) return json({ error: "OPENAI_API_KEY is not configured on Cloudflare." }, 500, headers);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400, headers);
  }

  const question = String(body?.question || "").slice(0, 1200);
  if (!question.trim()) return json({ error: "Ask a question first." }, 400, headers);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5.2",
      input: [
        {
          role: "system",
          content: "You are Ask HomePath. Use British English. Give concise general housing guidance for first-time buyers in the Republic of Ireland and Northern Ireland. State uncertainty, never decide eligibility, never replace a broker, lender, solicitor, surveyor, tax authority or official scheme provider, and tell users when to check official sources.",
        },
        { role: "user", content: question },
      ],
    }),
  });

  const payload = await response.json();
  if (!response.ok) return json({ error: payload.error?.message || "OpenAI request failed" }, response.status, headers);

  return json({ answer: responseText(payload) || "I could not produce an answer. Please try again." }, 200, headers);
}
