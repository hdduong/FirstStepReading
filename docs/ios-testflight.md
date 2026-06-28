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

The App Store version is automated from `package.json`:

- `package.json` `version` becomes the iOS marketing version shown in App Store Connect.
- Each workflow run gets a unique iOS build number from GitHub's run number and run attempt.
- The manual workflow form also has optional `marketing_version` and `build_number` fields when you need a one-time override.
- `marketing_version` must use `x.y.z` numeric format, such as `1.0.0`.
- `build_number` must use one to three numeric parts, such as `42`, `42.1`, or `42.1.2`.

The workflow:

1. Installs npm dependencies.
2. Resolves the App Store version and build number.
3. Builds the Vite app.
4. Generates or syncs the Capacitor iOS project.
5. Installs the FirstStepReading app icon catalog into the generated iOS project.
6. Signs and archives the iOS app using automatic signing.
7. Uploads the `.ipa` as a short-lived GitHub artifact.
8. Uploads the `.ipa` to TestFlight.

The icon installer uses `assets/app-icon-1024.png` as the source image and generates the
required iPhone, iPad, iPad Pro, and App Store marketing icon sizes on the macOS runner.

The workflow is manual only, so merging code to `main` will not upload a new iOS build by itself.
