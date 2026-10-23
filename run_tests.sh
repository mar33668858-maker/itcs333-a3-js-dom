#!/usr/bin/env bash
# ITCS333 A3 — local test runner (mirrors GitHub Actions).
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -d tests/node_modules ]; then
  echo "Installing test dependencies (first run only)..."
  npm ci --prefix tests
fi
cd tests && npx jest --config jest.config.js --verbose false
