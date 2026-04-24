# Dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 rentos && \
    adduser  -u 1001 -G rentos -s /bin/sh -D rentos

COPY --from=builder --chown=rentos:rentos /app/.next/standalone ./
COPY --from=builder --chown=rentos:rentos /app/.next/static     ./.next/static
COPY --from=builder --chown=rentos:rentos /app/public           ./public

USER rentos
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]