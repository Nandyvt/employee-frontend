# Frontend build-stage Dockerfile.
#
# This app is a static SPA served from S3, NOT from a container — so this
# Dockerfile's only job is to produce a reproducible `/app/dist` build
# artifact that Jenkins extracts and syncs to S3. There is no "runtime"
# stage and no nginx-serving stage; this image is never `docker run` as a
# long-lived service.

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_BASE_URL must be supplied at build time (Vite inlines it into
# the compiled JS) — Jenkins passes it via --build-arg.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build
# Output lands in /app/dist inside this image.
