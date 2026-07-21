# Cloudflare setup for HomePath AI

You can keep using GitHub Pages for the public HomePath link.

Cloudflare will be used only as the private backend that safely holds the OpenAI key.

## What has already been added

Cloudflare Pages Functions are ready in:

- `functions/api/listing-analysis.js`
- `functions/api/ask-homepath.js`
- `functions/api/chat.js`
- `functions/api/analyse-listing.js`
- `functions/api/explain-results.js`
- `functions/api/health.js`

The key is read from a Cloudflare Secret called:

```text
OPENAI_API_KEY
```

Do not put the key in GitHub, React, Vite, or `public/homepath-config.js`.

## Step-by-step Cloudflare instructions

1. Go to Cloudflare.
2. Open **Workers & Pages**.
3. Click **Create application**.
4. Choose **Pages**.
5. Connect your GitHub account.
6. Pick this repository:

```text
ldaly4/WashingtonIreland
```

7. Use these build settings:

```text
Project name: homepath-ai
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: leave blank
```

8. Deploy once.
9. Open the new Cloudflare Pages project.
10. Go to **Settings**.
11. Go to **Variables and Secrets**.
12. Add a Secret:

```text
OPENAI_API_KEY
```

Paste your new OpenAI key as the value.

13. Add a normal text variable:

```text
OPENAI_MODEL = gpt-5.2
```

14. Save and redeploy.

## After Cloudflare deploys

Cloudflare will give you a URL like:

```text
https://homepath-ai.pages.dev
```

Send that URL back to Codex.

Codex will then update `public/homepath-config.js` to:

```js
window.HOMEPATH_CONFIG = {
  LISTING_ANALYSIS_API_URL: "https://homepath-ai.pages.dev/api/analyse-listing",
  ASK_HOMEPATH_API_URL: "https://homepath-ai.pages.dev/api/chat",
  EXPLAIN_RESULTS_API_URL: "https://homepath-ai.pages.dev/api/explain-results",
};
```

Then GitHub Pages will keep hosting HomePath, but AI requests will go safely through Cloudflare.

## Why this is safe

GitHub Pages is public and static. It cannot safely hide an API key.

Cloudflare Pages Functions run server-side. Cloudflare Secrets are hidden from the browser and only available to the function.
