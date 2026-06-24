# Shorty Configuration

See [`.env.example`](../.env.example) for all options.

---

## Authentication

**`NUXT_SITE_TOKEN`** (required)

Dashboard access token. Must be at least 8 characters. Set in `.env`.

---

## General

**`NUXT_PUBLIC_PREVIEW_MODE`**

Enable demo mode. Links expire after 5 minutes and cannot be edited or deleted. Default: `false`.

**`NUXT_PUBLIC_SLUG_DEFAULT_LENGTH`**

Default length for auto-generated slugs. Default: `5`.

**`NUXT_REDIRECT_STATUS_CODE`**

HTTP status code for link redirects: `301`, `302`, `307`, `308`. Default: `308`.

**`NUXT_LINK_CACHE_TTL`**

Link cache TTL in seconds. Higher = faster, lower = changes propagate quicker. Default: `60`.

**`NUXT_REDIRECT_WITH_QUERY`**

Forward query parameters on redirect. Default: `false`.

**`NUXT_HOME_URL`**

Your production domain. Leave empty for local dev. Example: `https://shorty.example.com`.

**`NUXT_CASE_SENSITIVE`**

Enable case-sensitive slugs. Default: `false`.

**`NUXT_LIST_QUERY_LIMIT`**

Maximum items per metric list query. Default: `500`.

**`NUXT_DISABLE_BOT_ACCESS_LOG`**

Exclude bot traffic from analytics. Default: `false`.

---

## AI Slug Generation (OpenAI-Compatible)

Shorty uses OpenAI-compatible APIs for AI-powered slug generation. Any OpenAI-compatible provider works: OpenAI, Groq, Together AI, Ollama, LM Studio, OpenRouter, etc.

**`NUXT_OPENAI_API_KEY`**

Your API key. Leave empty to disable AI slugs. Example: `sk-xxx`.

**`NUXT_OPENAI_BASE_URL`**

API endpoint. Default: `https://api.openai.com/v1`. For Groq: `https://api.groq.com/openai/v1`.

**`NUXT_AI_MODEL`**

Model name. Default: `gpt-4o-mini`. For Groq: `llama-3.3-70b-versatile`.

**`NUXT_AI_PROMPT`**

Custom system prompt for slug generation. Keep `{slugRegex}` placeholder. Default:

```
You are a URL shortening assistant, please shorten the URL provided by the user into a SLUG. The SLUG information must come from the URL itself, do not make any assumptions. A SLUG is human-readable and should not exceed three words and can be validated using regular expressions {slugRegex}. Only the best one is returned, the format must be JSON reference {"slug": "example-slug"}
```

---

## Storage

Shorty uses **SQLite** (`better-sqlite3`) for all persistent storage. The database file is at `.data/shorty.db`.

- **Links**: `links` table
- **Microsites**: `microsites` table
- **Analytics**: `clicks` table

Backup the `.data/` directory to preserve all data.

**`NUXT_DATASET`**

Internal dataset prefix. Default: `shorty`. Not recommended to change.
