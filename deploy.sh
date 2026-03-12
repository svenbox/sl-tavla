#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📦 Hämtar senaste versionen från git..."
cd "$REPO_DIR"
git pull

echo "🔨 Bygger och startar om containers..."
docker compose up -d --build

echo "✅ Klart! Kör på http://localhost:8087"
docker compose ps
