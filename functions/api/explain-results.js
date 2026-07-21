import { errorResponse, json, logRequest, preflight, readJson, requestId, requireCors, stripContactInfo } from "../_lib/http.js";
import { rateLimit } from "../_lib/rateLimit.js";
import { callResponses, model, parseJson, responseText, SMALL_MODEL } from "../_lib/openai.js";
import { retrieveKnowledge } from "../_lib/knowledge.js";

const SYSTEM = `The numerical results provided by HomePath are fixed inputs. Do not recalculate them, change them or invent alternatives. Explain them in plain English.
You provide general educational guidance only. Do not make eligibility, legal, lending, surveying or financial-advice decisions.
Where current scheme rules or precise criteria matter, direct the user to official sources or the relevant professional.
Return strict JSON only.`;

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortAnswer: { type: "string" },
    whatItMeans: { type: "string" },
    supports: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, reason: { type: "string" }, caution: { type: "string" } }, required: ["name","reason","caution"] } },
    searchSuggestions: { type: "array", items: { type: "string" } },
    nextSteps: { type: "array", items: { type: "string" } },
    disclaimer: { type: "string" },
  },
  required: ["shortAnswer","whatItMeans","supports","searchSuggestions","nextSteps","disclaimer"],
};

function fallback(summary) {
  return {
    shortAnswer: "HomePath’s live explanation service is temporarily unavailable. The numbers shown in your dashboard are still valid as rough estimates.",
    whatItMeans: `Based on what you entered, compare your target price, estimated borrowing, cash needed and savings gap. The most useful next step is to check the gap and speak to an appropriate professional.`,
    supports: (summary.relevantSupports || []).slice(0, 4).map(name => ({ name, reason: "May be worth checking against official rules.", caution: "HomePath does not decide eligibility." })),
    searchSuggestions: ["Compare real listings within the estimated buying range.", "Check nearby areas or smaller property types.", "Use Check a house before viewing."],
    nextSteps: ["Review the full cash picture.", "Speak to a mortgage broker, adviser or lender.", "Check official support routes."],
    disclaimer: "General information only. Not a mortgage offer.",
  };
}

export async function onRequestOptions({ request }) {
  return preflight(request);
}

export async function onRequestPost({ request, env }) {
  const started = Date.now(), id = requestId(), endpoint = "/api/explain-results";
  const { headers, response } = requireCors(request);
  if (response) return response;
  const limited = rateLimit(request, "explain", 20);
  if (!limited.ok) return errorResponse("RATE_LIMITED", "You have reached the temporary usage limit. Please try again later.", 429, headers);
  const { body, error } = await readJson(request, headers, 12000);
  if (error) return error;

  const summary = {
    jurisdiction: String(body?.jurisdiction || "").slice(0, 20),
    area: stripContactInfo(body?.area || "").slice(0, 150),
    income: Number(body?.income) || 0,
    savings: Number(body?.savings) || 0,
    targetPrice: Number(body?.targetPrice) || 0,
    estimatedBorrowing: Number(body?.estimatedBorrowing) || 0,
    estimatedCashNeeded: Number(body?.estimatedCashNeeded) || 0,
    savingsGap: Number(body?.savingsGap) || 0,
    relevantSupports: Array.isArray(body?.relevantSupports) ? body.relevantSupports.map(x => String(x).slice(0, 80)).slice(0, 8) : [],
  };
  if (!summary.jurisdiction || (!summary.targetPrice && !summary.estimatedBorrowing && !summary.estimatedCashNeeded)) {
    return errorResponse("INVALID_RESULT_SUMMARY", "The result summary is missing key figures.", 400, headers);
  }
  const entries = retrieveKnowledge(`${summary.jurisdiction} ${summary.relevantSupports.join(" ")} cash broker support`, "/check-position");
  const result = await callResponses(env, {
    model: model(env, SMALL_MODEL),
    max_output_tokens: 850,
    input: [
      { role: "system", content: SYSTEM },
      { role: "user", content: JSON.stringify({ fixedResultSummary: summary, curatedKnowledge: entries }) },
    ],
    text: { format: { type: "json_schema", name: "homepath_result_explanation", schema, strict: true } },
  });
  if (result.error) {
    logRequest(endpoint, result.error.status, started, id, result.error.code);
    return json(fallback(summary), 200, headers);
  }
  const parsed = parseJson(responseText(result.payload));
  if (parsed.error) return json(fallback(summary), 200, headers);
  logRequest(endpoint, 200, started, id);
  return json(parsed.value, 200, headers);
}
