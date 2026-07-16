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

function safeListing(input = {}) {
  return {
    site: String(input.site || "").slice(0, 40),
    price: String(input.price || "").slice(0, 30),
    location: String(input.location || "").slice(0, 120),
    bedrooms: String(input.bedrooms || "").slice(0, 20),
    type: String(input.type || "").slice(0, 40),
    energy: String(input.energy || "").slice(0, 20),
    description: String(input.description || "").slice(0, 8000),
  };
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY is not configured on the server." });

  const listing = safeListing(req.body?.listing);
  if (!listing.description && !listing.price && !listing.location) {
    return res.status(400).json({ error: "Add listing text or property details before analysing." });
  }

  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      extractedAskingPrice: { type: ["string", "null"] },
      location: { type: ["string", "null"] },
      propertyType: { type: ["string", "null"] },
      bedrooms: { type: ["string", "null"] },
      energyRating: { type: ["string", "null"] },
      listingPhrasesWorthNoticing: { type: "array", items: { type: "string" } },
      likelyLevelOfWork: { type: "string" },
      viewingQuestions: { type: "array", items: { type: "string" } },
      risksRequiringProfessionalInvestigation: { type: "array", items: { type: "string" } },
      roughRenovationCategories: { type: "array", items: { type: "string" } },
      relevantHomePathLearningModules: { type: "array", items: { type: "string" } },
      relevantSchemesWorthChecking: { type: "array", items: { type: "string" } },
      uncertaintyNotes: { type: "array", items: { type: "string" } },
    },
    required: [
      "extractedAskingPrice",
      "location",
      "propertyType",
      "bedrooms",
      "energyRating",
      "listingPhrasesWorthNoticing",
      "likelyLevelOfWork",
      "viewingQuestions",
      "risksRequiringProfessionalInvestigation",
      "roughRenovationCategories",
      "relevantHomePathLearningModules",
      "relevantSchemesWorthChecking",
      "uncertaintyNotes",
    ],
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: [
        {
          role: "system",
          content: "You help Irish and Northern Irish first-time buyers understand property listings. Use British English. Do not diagnose structural safety, replace a surveyor, make legal conclusions, or decide scheme eligibility. Be cautious and practical.",
        },
        {
          role: "user",
          content: `Analyse this property listing as structured JSON only. Treat missing details as unknown. Listing: ${JSON.stringify(listing)}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "homepath_listing_analysis",
          schema,
          strict: true,
        },
      },
    }),
  });

  const payload = await response.json();
  if (!response.ok) return res.status(response.status).json({ error: payload.error?.message || "OpenAI request failed" });

  const text = payload.output_text || payload.output?.flatMap(item => item.content || []).find(part => part.type === "output_text")?.text;
  if (!text) return res.status(502).json({ error: "No structured analysis returned" });

  return res.status(200).json(JSON.parse(text));
}
