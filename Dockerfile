# syntax=docker/dockerfile:1

# ─── Deps Stage (cached) ────────────────────────────────────
FROM node:22-alpine AS deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch --frozen-lockfile

# ─── Build Stage ──────────────────────────────────────────────
FROM node:22-alpine AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# Install only production deps + offline cache from fetch stage
COPY --from=deps /app/node_modules/.pnpm ./node_modules/.pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --offline --ignore-scripts && pnpm rebuild better-sqlite3

COPY . .
ENV NODE_OPTIONS=--max-old-space-size=6144
RUN pnpm build && pnpm prune --prod

# ─── Runtime Stage ────────────────────────────────────────────
FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=7465

RUN addgroup -S shorty && adduser -S shorty -G shorty

WORKDIR /app

COPY --from=build --chown=shorty:shorty /app/.output ./.output
COPY --from=build --chown=shorty:shorty /app/public ./public

# Copy only the prod node_modules needed at runtime
COPY --from=build --chown=shorty:shorty /app/node_modules ./node_modules
COPY --from=build --chown=shorty:shorty /app/package.json ./

RUN mkdir -p .data/links .data/assets

USER shorty
EXPOSE 7465

CMD ["node", ".output/server/index.mjs"]
