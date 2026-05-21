#!/usr/bin/env bash
# Satu skrip untuk cipta repo, push, dan aktifkan GitHub Pages.
# Usage:
#   export GITHUB_TOKEN="ghp_xxxx"   # https://github.com/settings/tokens (scope: repo)
#   bash scripts/deploy-github.sh

set -euo pipefail

OWNER="mohdfairuzmy2"
REPO="Dashboard-Krisis"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="https://github.com/${OWNER}/${REPO}.git"
PAGES_URL="https://${OWNER}.github.io/${REPO}/"

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "❌ GITHUB_TOKEN tidak ditetapkan."
  echo ""
  echo "1. Buka https://github.com/settings/tokens"
  echo "2. Generate new token (classic) → centang 'repo'"
  echo "3. Jalankan:"
  echo "   export GITHUB_TOKEN=\"ghp_token_anda\""
  echo "   bash scripts/deploy-github.sh"
  exit 1
fi

cd "$ROOT"

echo "→ Semak / cipta repository ${OWNER}/${REPO}..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${OWNER}/${REPO}")

if [[ "$STATUS" == "404" ]]; then
  curl -s -X POST \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/user/repos" \
    -d "{\"name\":\"${REPO}\",\"private\":false,\"description\":\"Krisis Bekalan Global — prototype dashboard\"}" \
    | python3 -c "import json,sys; d=json.load(sys.stdin); print('✓ Repo dicipta:', d.get('html_url', d))" 2>/dev/null || true
  sleep 2
elif [[ "$STATUS" == "200" ]]; then
  echo "✓ Repo sudah wujud"
else
  echo "⚠ Status repo: HTTP ${STATUS} (teruskan push...)"
fi

echo "→ Push kod ke GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${GITHUB_TOKEN}@github.com/${OWNER}/${REPO}.git"
git push -u origin main
git remote set-url origin "$REMOTE"

echo "→ Aktifkan GitHub Pages (GitHub Actions)..."
curl -s -X POST \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${OWNER}/${REPO}/pages" \
  -d '{"build_type":"workflow","source":{"branch":"main","path":"/"}}' \
  >/dev/null 2>&1 || true

echo "→ Picu workflow deploy..."
curl -s -X POST \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/deploy-github-pages.yml/dispatches" \
  -d '{"ref":"main"}' >/dev/null 2>&1 || true

echo ""
echo "════════════════════════════════════════"
echo "✓ Push selesai. Deploy sedang berjalan (~2–5 min)."
echo ""
echo "  Pantau: https://github.com/${OWNER}/${REPO}/actions"
echo "  URL prototype:"
echo "  ${PAGES_URL}"
echo "  ${PAGES_URL}#/fuel"
echo "════════════════════════════════════════"
