# HomePath secure AI setup

The OpenAI key must not go in React, Vite, GitHub Pages or `homepath-config.js`.

HomePath now has two serverless API endpoints ready:

- `api/listing-analysis.js`
- `api/ask-homepath.js`

They read the key from a private server environment variable:

```text
OPENAI_API_KEY
```

## Easiest safe setup with Vercel

1. Go to Vercel and create a new project from the `ldaly4/WashingtonIreland` GitHub repository.
2. Set the project root to:

```text
homepath-v2
```

3. In Vercel, open Project Settings → Environment Variables.
4. Add:

```text
OPENAI_API_KEY = your new OpenAI key
OPENAI_MODEL = gpt-5.2
```

5. Deploy the Vercel project.
6. Copy the Vercel project URL, for example:

```text
https://your-project.vercel.app
```

7. Edit `public/homepath-config.js`:

```js
window.HOMEPATH_CONFIG = {
  LISTING_ANALYSIS_API_URL: "https://your-project.vercel.app/api/listing-analysis",
  ASK_HOMEPATH_API_URL: "https://your-project.vercel.app/api/ask-homepath",
};
```

8. Commit and push that config change.

The GitHub Pages site will then call the Vercel API. The browser sees only the Vercel URL, not the OpenAI key.

## What not to do

Do not put the key in:

- `src/`
- `public/homepath-config.js`
- `.env` committed to GitHub
- any `VITE_` environment variable
- GitHub Pages settings

## Local testing

If you later want to test the serverless functions locally, use a local `.env` file, but never commit it.

`.gitignore` already blocks `.env`, `.env.*` and `.vercel`.
