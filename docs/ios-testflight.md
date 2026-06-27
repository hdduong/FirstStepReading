# iOS TestFlight Upload

FirstStepReading uses Capacitor to generate the iOS project on GitHub's macOS runner, then signs and uploads the app to TestFlight.

## Apple Setup

Register this explicit Bundle ID in Apple Developer:

```text
com.firststepreadingapp.app
```

Create the App Store Connect app record with that Bundle ID before running the workflow.

## GitHub Secrets

Add these repository secrets in GitHub under **Settings > Secrets and variables > Actions > Repository secrets**:

```text
APPLE_TEAM_ID
APP_STORE_CONNECT_ISSUER_ID
APP_STORE_CONNECT_KEY_ID
APP_STORE_CONNECT_API_KEY
```

`APP_STORE_CONNECT_API_KEY` should be the full contents of the downloaded `.p8` file, including the `BEGIN PRIVATE KEY` and `END PRIVATE KEY` lines.

## Manual Upload

Run **Upload iOS to TestFlight** from the GitHub Actions tab.

The workflow uses GitHub's `macos-26` runner and selects Xcode 26, because App Store Connect rejects iOS uploads built with older SDKs.

The workflow:

1. Installs npm dependencies.
2. Builds the Vite app.
3. Generates or syncs the Capacitor iOS project.
4. Installs the FirstStepReading app icon into the generated iOS project.
5. Signs and archives the iOS app using automatic signing.
6. Uploads the `.ipa` as a short-lived GitHub artifact.
7. Uploads the `.ipa` to TestFlight.

The workflow is manual only, so merging code to `main` will not upload a new iOS build by itself.
