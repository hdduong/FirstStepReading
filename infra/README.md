# Infrastructure (Bicep)

`main.bicep` provisions the Azure resources that host FirstStepReading: a Linux
**App Service plan** + **Web App** (Node 20) that serves the built SPA and the
`/api` backend.

## One-time setup — let GitHub deploy to Azure via OIDC (no stored passwords)

```bash
az login
az account set --subscription <SUBSCRIPTION_ID>

# 1. App registration GitHub Actions will authenticate as
az ad app create --display-name firststepreading-gha
APP_ID=$(az ad app list --display-name firststepreading-gha --query "[0].appId" -o tsv)
az ad sp create --id "$APP_ID"

# 2. Let it manage resources (scope to the RG instead of the sub if you prefer)
az role assignment create --assignee "$APP_ID" --role Contributor \
  --scope /subscriptions/<SUBSCRIPTION_ID>

# 3. Federated credential so the workflow logs in without a secret.
#    Run provision from the default branch so this subject matches.
az ad app federated-credential create --id "$APP_ID" --parameters '{
  "name": "github-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:hdduong/FirstStepReading:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}'
```

Then add three **repo secrets** (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `AZURE_CLIENT_ID` | the app's `appId` |
| `AZURE_TENANT_ID` | `az account show --query tenantId -o tsv` |
| `AZURE_SUBSCRIPTION_ID` | your subscription id |

## Provision the infrastructure

**Actions ▸ "Provision Azure infrastructure (Bicep)" ▸ Run workflow**, or locally:

```bash
az group create -n firststepreading-rg -l eastus
az deployment group create -g firststepreading-rg -f infra/main.bicep -p appName=firststepreading
```

## Then deploy the code

Set `AZURE_WEBAPP_NAME` (your `appName`) in `.github/workflows/deploy.yml`, add the
`AZURE_WEBAPP_PUBLISH_PROFILE` secret (App Service → **Get publish profile**), and
run the **Deploy to Azure App Service** workflow.

> Free (**F1**) tier is fine to start. Custom domains + HTTPS (e.g.
> `firststepreadingapp.com`) need **B1** or higher — bump `sku` in `main.bicep`.
