#!/usr/bin/env bash
set -euo pipefail

# Deploy FirstStepReading to Azure App Service.
#
# IDs are read from the environment or a gitignored ./.env.azure file — never
# hardcoded here, so this script is safe to commit to a public repo.
#
# Required: AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID
# Optional: APP_NAME, RESOURCE_GROUP, LOCATION, SKU
#
# Create .env.azure (it is git-ignored) with, e.g.:
#   AZURE_TENANT_ID=<your-tenant-id>
#   AZURE_SUBSCRIPTION_ID=<your-subscription-id>
#   APP_NAME=firststepreadingapp
#   SKU=B1

# Load local, untracked config if present.
[ -f .env.azure ] && { set -a; . ./.env.azure; set +a; }

: "${AZURE_TENANT_ID:?Set AZURE_TENANT_ID (e.g. in a gitignored .env.azure)}"
: "${AZURE_SUBSCRIPTION_ID:?Set AZURE_SUBSCRIPTION_ID (e.g. in a gitignored .env.azure)}"
APP_NAME="${APP_NAME:-firststepreadingapp}"        # must be globally unique
RESOURCE_GROUP="${RESOURCE_GROUP:-firststepreading-rg}"
LOCATION="${LOCATION:-eastus}"
SKU="${SKU:-B1}"                                  # B1+ supports custom domains and SSL
DEV_DEPS_PRUNED=0

restore_dev_deps() {
  if [ "$DEV_DEPS_PRUNED" = "1" ]; then
    echo "==> Restore dev deps"
    if npm install >/dev/null; then
      DEV_DEPS_PRUNED=0
    else
      echo "Warning: failed to restore dev dependencies. Run 'npm install' manually." >&2
    fi
  fi
}

create_package() {
  local powershell_cmd=""
  if command -v powershell.exe >/dev/null 2>&1; then
    powershell_cmd="powershell.exe"
  elif command -v pwsh >/dev/null 2>&1; then
    powershell_cmd="pwsh"
  else
    echo "PowerShell is required for packaging with Compress-Archive." >&2
    exit 1
  fi

  "$powershell_cmd" -NoLogo -NoProfile -Command \
    "if (Test-Path app.zip) { Remove-Item app.zip }; Compress-Archive -Path dist,server,package.json,package-lock.json,node_modules -DestinationPath app.zip -Force"
}

trap restore_dev_deps EXIT

[ -f infra/main.bicep ] || { echo "Run from the repo root (infra/main.bicep not found)." >&2; exit 1; }

echo "==> Sign in to tenant"
az login --tenant "$AZURE_TENANT_ID" >/dev/null    # add --use-device-code if no browser
az account set --subscription "$AZURE_SUBSCRIPTION_ID"
echo "    Subscription: $(az account show --query name -o tsv)"

echo "==> Provision infrastructure (Bicep)"
az group create -n "$RESOURCE_GROUP" -l "$LOCATION" -o none
az deployment group create -g "$RESOURCE_GROUP" -f infra/main.bicep -p appName="$APP_NAME" sku="$SKU" -o none

echo "==> Build & package"
npm ci
npm run build
npm prune --omit=dev
DEV_DEPS_PRUNED=1
create_package

echo "==> Deploy"
az webapp deploy -g "$RESOURCE_GROUP" -n "$APP_NAME" --src-path app.zip --type zip

restore_dev_deps

URL="https://$APP_NAME.azurewebsites.net"
echo ""
echo "✅ Done.  App:    $URL"
echo "          Health: $URL/api/health"
