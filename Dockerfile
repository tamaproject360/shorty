# syntax=docker/dockerfile:1

# ─── Build Stage ──────────────────────────────────────────────
FROM node:22-alpine AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ─── Runtime Stage ────────────────────────────────────────────
FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=7465

RUN addgroup -S shorty && adduser -S shorty -G shorty

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./
COPY --from=build /app/public ./public

RUN mkdir -p .data/links .data/assets && chown -R shorty:shorty .

USER shorty
EXPOSE 7465

CMD ["node", ".output/server/index.mjs"]
