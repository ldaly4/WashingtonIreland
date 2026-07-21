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

  const listing = safeListing(body?.listing);
  if (!listing.description && !listing.price && !listing.location) {
    return json({ error: "Add listing text or property details before analysing." }, 400, headers);
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
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5-mini",
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
  if (!response.ok) return json({ error: payload.error?.message || "OpenAI request failed" }, response.status, headers);

  const text = payload.output_text || payload.output?.flatMap(item => item.content || []).find(part => part.type === "output_text")?.text;
  if (!text) return json({ error: "No structured analysis returned" }, 502, headers);

  return json(JSON.parse(text), 200, headers);
}
