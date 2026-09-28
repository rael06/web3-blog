# syntax=docker/dockerfile:1

# ---- Build: install, compile, then keep production dependencies only
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Validated by serverEnvVars when pages are collected at build time.
# NEXT_PUBLIC_* values are also inlined into the client bundle.
ARG NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_IPFS_GET_URL
ARG NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL
ARG NEXT_PUBLIC_CHAIN_ID
ARG NEXT_PUBLIC_CHAINS
ARG NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
ARG NEXT_IPFS_API_URL=http://ipfs-node:5001
ARG NEXT_IS_IPFS_PIN_ENABLED=true

# The RPC URL holds a key: a build secret, never written in the image or its history.
RUN --mount=type=secret,id=NEXT_BLOCKCHAIN_RPC_URL,env=NEXT_BLOCKCHAIN_RPC_URL \
    npm run build && npm prune --omit=dev

# ---- Runtime: unprivileged user, no build tooling
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3093

COPY --from=build /app/package.json /app/next.config.ts ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next

USER node
EXPOSE 3093
CMD ["node", "node_modules/next/dist/bin/next", "start"]
