# HomePath v2

A standalone, rules-based housing guidance prototype for the Republic of Ireland and Northern Ireland.

Live frontend:

```text
https://ldaly4.github.io/WashingtonIreland/#/
```

Cloudflare Worker / Pages Functions base URL:

```text
https://washingtonireland.pages.dev
```

## AI API routes

The browser never calls OpenAI directly. It calls Cloudflare:

```text
GET  /api/health
POST /api/chat
POST /api/analyse-listing
POST /api/explain-results
```

Compatibility routes remain available:

```text
POST /api/ask-homepath
POST /api/listing-analysis
```

Required Cloudflare secret binding:

```text
OPENAI_API_KEY
```

Non-secret variable:

```text
OPENAI_MODEL=gpt-5.2
```

Approved CORS origins:

```text
https://ldaly4.github.io
http://localhost:5173
http://127.0.0.1:5173
```

To test the Worker health endpoint, open:

```text
https://washingtonireland.pages.dev/api/health
```

## Updating verified scheme and guidance content

Curated AI context lives in:

```text
functions/_lib/knowledge.js
```

Frontend glossary and survey findings live in:

```text
src/data/glossary.js
src/data/surveyFindings.js
```

When changing scheme information, update the official URL, source label and last-reviewed date. Do not ask AI to invent current limits, thresholds or eligibility rules.

## Rotating the OpenAI key

1. Revoke the old key in OpenAI.
2. Create a new key.
3. In Cloudflare, open Workers & Pages → `washingtonireland` → Settings → Variables and Secrets.
4. Replace the `OPENAI_API_KEY` secret.
5. Redeploy Cloudflare Pages.

Never commit the key to GitHub.

## Disabling AI safely

To disable AI without breaking the core site, clear these values in `public/homepath-config.js`:

```js
LISTING_ANALYSIS_API_URL: "",
ASK_HOMEPATH_API_URL: "",
EXPLAIN_RESULTS_API_URL: "",
```

The rules-based calculator, guides and listing checker fallback will still work.

## Run locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm test
npm run build
```

All calculations are deliberately rough assumptions for guidance. No form data is stored or transmitted.
