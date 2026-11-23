# ─────────────────────────────────────────────────────────────────────────────
# WEBSITE / STOREFRONT (Next.js) — Docker image for Dokploy
#
#   Build args (Dokploy → Environment → "Build-time Arguments"): every NEXT_PUBLIC_* value is
#   written into the browser code at build time → change one = Rebuild.
#   DASHBOARD_URL is a build arg too (next.config.ts allows images from it).
#   Secrets (AUTH_SECRET, BACKEND_SECRET, REVALIDATE_SECRET, SMTP…) are normal runtime variables.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_CLIENT_ID=masi
ARG NEXT_PUBLIC_DATA_SOURCE=api
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ARG DASHBOARD_URL
ENV NEXT_PUBLIC_CLIENT_ID=$NEXT_PUBLIC_CLIENT_ID \
    NEXT_PUBLIC_DATA_SOURCE=$NEXT_PUBLIC_DATA_SOURCE \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    DASHBOARD_URL=$DASHBOARD_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build && npm prune --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 3000
CMD ["sh", "-c", "exec node_modules/.bin/next start -H 0.0.0.0 -p ${PORT}"]
