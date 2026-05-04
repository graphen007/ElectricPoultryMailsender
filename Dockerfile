# ── Stage 1: build frontend ──────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: build backend ───────────────────────────────────────────────────
FROM node:20-alpine AS backend-builder

WORKDIR /backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# ── Stage 3: production image ─────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Production deps only
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Compiled backend
COPY --from=backend-builder /backend/dist ./dist

# Static public assets (images etc.)
COPY --from=backend-builder /backend/public ./public

# Built React app — Express serves this as the SPA
COPY --from=frontend-builder /frontend/dist ./frontend

EXPOSE 8080
ENV PORT=8080

CMD ["node", "dist/index.js"]
