import { appendFileSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'))

const marketingVersion =
  process.env.IOS_MARKETING_VERSION_INPUT?.trim() || packageJson.version?.trim()
const buildNumber =
  process.env.IOS_BUILD_NUMBER_INPUT?.trim() ||
  `${process.env.GITHUB_RUN_NUMBER || '1'}.${process.env.GITHUB_RUN_ATTEMPT || '1'}`

if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(marketingVersion)) {
  throw new Error(
    `iOS marketing version must use x.y.z numeric format; found "${marketingVersion}"`,
  )
}

if (!/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){0,2}$/.test(buildNumber)) {
  throw new Error(`iOS build number must be one to three numeric parts; found "${buildNumber}"`)
}

const envLines = [
  `IOS_MARKETING_VERSION=${marketingVersion}`,
  `IOS_BUILD_NUMBER=${buildNumber}`,
]

if (process.env.GITHUB_ENV) {
  appendFileSync(process.env.GITHUB_ENV, `${envLines.join('\n')}\n`)
}

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `${[
      '## iOS App Store version',
      '',
      `- Version: \`${marketingVersion}\``,
      `- Build: \`${buildNumber}\``,
    ].join('\n')}\n`,
  )
}

console.log(`Resolved iOS App Store version ${marketingVersion} (${buildNumber})`)
