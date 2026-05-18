# =============================================================================
# MedFlow Backend — Multi-Stage Production Dockerfile
# Stage 1: Build | Stage 2: Production
# =============================================================================

# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder

LABEL maintainer="MedFlow Engineering"
LABEL stage="builder"

# Install OS-level dependencies for Prisma + bcrypt native bindings
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files first for Docker layer caching
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci --frozen-lockfile

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build NestJS application
RUN npm run build

# Prune devDependencies for production
RUN npm prune --production

# ---------- Stage 2: Production Runner ----------
FROM node:20-alpine AS production

LABEL maintainer="MedFlow Engineering"
LABEL stage="production"

# Install runtime OS dependencies (Prisma needs openssl at runtime)
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    curl \
    dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S medflow && \
    adduser -S medflow -u 1001 -G medflow

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder --chown=medflow:medflow /app/dist ./dist
COPY --from=builder --chown=medflow:medflow /app/node_modules ./node_modules
COPY --from=builder --chown=medflow:medflow /app/prisma ./prisma
COPY --from=builder --chown=medflow:medflow /app/package.json ./package.json

# Create uploads directory with proper ownership
RUN mkdir -p /app/uploads && chown -R medflow:medflow /app/uploads

# Switch to non-root user
USER medflow

# Expose application port
EXPOSE 3001

# Health check — uses the existing /api/health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# Entrypoint: run migrations then start server
# Using dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run prisma migrate deploy (safe, non-interactive) then start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
