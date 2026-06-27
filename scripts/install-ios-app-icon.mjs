import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceIcon = resolve(
  repoRoot,
  process.env.IOS_APP_ICON_SOURCE || 'assets/app-icon-1024.png',
)
const appIconSet = resolve(
  repoRoot,
  process.env.IOS_APP_ICON_SET_DIR || 'ios/App/App/Assets.xcassets/AppIcon.appiconset',
)
const destinationIcon = resolve(appIconSet, 'AppIcon-512@2x.png')
const contentsPath = resolve(appIconSet, 'Contents.json')

const icon = readFileSync(sourceIcon)
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

if (icon.length < 33) {
  throw new Error(`${sourceIcon} is too small to be a valid PNG file`)
}

if (!icon.subarray(0, pngSignature.length).equals(pngSignature)) {
  throw new Error(`${sourceIcon} must be a PNG file`)
}

const ihdrLength = icon.readUInt32BE(8)
const ihdrType = icon.subarray(12, 16).toString('ascii')

if (ihdrLength !== 13 || ihdrType !== 'IHDR') {
  throw new Error(`${sourceIcon} must start with a valid PNG IHDR chunk`)
}

const width = icon.readUInt32BE(16)
const height = icon.readUInt32BE(20)
const bitDepth = icon[24]
const colorType = icon[25]

if (width !== 1024 || height !== 1024) {
  throw new Error(`${sourceIcon} must be 1024x1024; found ${width}x${height}`)
}

if (bitDepth !== 8 || colorType !== 2) {
  throw new Error(
    `${sourceIcon} must be an opaque 8-bit truecolor PNG; found bit depth ${bitDepth}, color type ${colorType}`,
  )
}

let chunkOffset = 8

while (chunkOffset + 8 <= icon.length) {
  const chunkLength = icon.readUInt32BE(chunkOffset)
  const chunkType = icon.subarray(chunkOffset + 4, chunkOffset + 8).toString('ascii')
  const nextChunkOffset = chunkOffset + 12 + chunkLength

  if (nextChunkOffset > icon.length) {
    throw new Error(`${sourceIcon} contains a truncated PNG chunk`)
  }

  if (chunkType === 'tRNS') {
    throw new Error(`${sourceIcon} must not include PNG transparency chunks`)
  }

  if (chunkType === 'IEND') {
    break
  }

  chunkOffset = nextChunkOffset
}

mkdirSync(appIconSet, { recursive: true })
copyFileSync(sourceIcon, destinationIcon)
writeFileSync(
  contentsPath,
  `${JSON.stringify(
    {
      images: [
        {
          filename: 'AppIcon-512@2x.png',
          idiom: 'ios-marketing',
          scale: '1x',
          size: '1024x1024',
        },
      ],
      info: {
        author: 'xcode',
        version: 1,
      },
    },
    null,
    2,
  )}\n`,
)

console.log(`Installed iOS app icon at ${destinationIcon}`)
