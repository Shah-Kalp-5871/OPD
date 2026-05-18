# =============================================================================
# MedFlow Frontend — Multi-Stage Production Dockerfile
# Next.js SSR Mode (NOT static export)
# Stage 1: Dependencies | Stage 2: Builder | Stage 3: Production
# =============================================================================

# ---------- Stage 1: Dependency Installer ----------
FROM node:20-alpine AS deps

LABEL stage="deps"

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production + dev deps (needed for Next.js build)
RUN npm ci --frozen-lockfile

# ---------- Stage 2: Builder ----------
FROM node:20-alpine AS builder

LABEL stage="builder"

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy entire source
COPY . .

# Set build-time environment variables
# These are baked into the Next.js bundle at build time
# NEXT_PUBLIC_ vars must be set here
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Disable Next.js telemetry in CI/build
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application (SSR mode — output: 'standalone' not set intentionally)
# Preserving current SSR configuration
RUN npm run build

# ---------- Stage 3: Production Runner ----------
FROM node:20-alpine AS production

LABEL maintainer="MedFlow Engineering"
LABEL stage="production"

RUN apk add --no-cache \
    libc6-compat \
    curl \
    dumb-init

# Create non-root user
RUN addgroup -g 1001 -S medflow && \
    adduser -S medflow -u 1001 -G medflow

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy built Next.js application
COPY --from=builder --chown=medflow:medflow /app/.next ./.next
COPY --from=builder --chown=medflow:medflow /app/public ./public
COPY --from=builder --chown=medflow:medflow /app/node_modules ./node_modules
COPY --from=builder --chown=medflow:medflow /app/package.json ./package.json
COPY --from=builder --chown=medflow:medflow /app/next.config.ts ./next.config.ts

# Switch to non-root user
USER medflow

# Expose frontend port
EXPOSE 3000

# Health check — check if Next.js responds at basePath /opd
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/opd || exit 1

ENTRYPOINT ["dumb-init", "--"]

# Start Next.js production server
CMD ["npm", "run", "start"]
