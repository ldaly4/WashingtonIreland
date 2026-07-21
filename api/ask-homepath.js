const allowedOrigins = [
  "https://ldaly4.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function setCors(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function responseText(payload) {
  if (payload.output_text) return payload.output_text;
  const content = payload.output?.flatMap(item => item.content || []) || [];
  const text = content.find(part => part.type === "output_text" || part.type === "text")?.text;
  if (text) return text;
  return "";
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY is not configured on the server." });

  const question = String(req.body?.question || "").slice(0, 1200);
  if (!question.trim()) return res.status(400).json({ error: "Ask a question first." });

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      input: [
        {
          role: "system",
          content: "You are Ask HomePath. Use British English and very plain language. Give concise general housing guidance for first-time buyers in the Republic of Ireland and Northern Ireland. Point users to relevant HomePath areas where useful: My position, Buying explained, Check a house, Savings plan, Buying basics modules, Glossary, Housing Pulse and Advice centre. State uncertainty, distinguish ROI and NI where relevant, never decide eligibility, never invent scheme limits or legal rules, never replace a broker, lender, solicitor, conveyancer, surveyor, tax authority or official scheme provider, and tell users when to check official sources.",
        },
        { role: "user", content: question },
      ],
    }),
  });

  const payload = await response.json();
  if (!response.ok) return res.status(response.status).json({ error: payload.error?.message || "OpenAI request failed" });

  return res.status(200).json({ answer: responseText(payload) || "I could not produce an answer. Please try again." });
}
