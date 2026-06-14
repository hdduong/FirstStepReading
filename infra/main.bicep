// Azure infrastructure for FirstStepReading.
// Provisions a Linux App Service plan + web app (Node) that serves the built
// SPA and the /api backend. Deploy into a resource group:
//   az group create -n <rg> -l <location>
//   az deployment group create -g <rg> -f infra/main.bicep -p appName=<name>

@description('Globally-unique name for the Web App (becomes <name>.azurewebsites.net).')
param appName string

@description('Azure region for the resources.')
param location string = resourceGroup().location

@description('App Service plan SKU. B1 is the default because this app serves bundled MP3/MP4 media and needs custom domain SSL support.')
param sku string = 'B1'

@description('Node LTS version for the Linux runtime. Node 20 reached end-of-life in 2026; 22-lts is the supported successor.')
param nodeVersion string = '22-lts'

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: '${appName}-plan'
  location: location
  kind: 'linux'
  sku: {
    name: sku
  }
  properties: {
    reserved: true // Linux plans must set reserved = true
  }
}

resource site 'Microsoft.Web/sites@2023-12-01' = {
  name: appName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|${nodeVersion}'
      appCommandLine: 'npm start'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      appSettings: [
        {
          // CI builds the app and deploys the artifact, so App Service must not rebuild.
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
      ]
    }
  }
}

@description('Public URL of the deployed app.')
output url string = 'https://${site.properties.defaultHostName}'
