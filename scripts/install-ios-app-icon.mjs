import { spawnSync } from 'node:child_process'
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
const contentsPath = resolve(appIconSet, 'Contents.json')
const resizeMode = process.env.IOS_APP_ICON_RESIZE_MODE || 'sips'

const appIconImages = [
  { idiom: 'iphone', size: '20x20', scale: '2x', pixels: 40 },
  { idiom: 'iphone', size: '20x20', scale: '3x', pixels: 60 },
  { idiom: 'iphone', size: '29x29', scale: '2x', pixels: 58 },
  { idiom: 'iphone', size: '29x29', scale: '3x', pixels: 87 },
  { idiom: 'iphone', size: '40x40', scale: '2x', pixels: 80 },
  { idiom: 'iphone', size: '40x40', scale: '3x', pixels: 120 },
  { idiom: 'iphone', size: '60x60', scale: '2x', pixels: 120 },
  { idiom: 'iphone', size: '60x60', scale: '3x', pixels: 180 },
  { idiom: 'ipad', size: '20x20', scale: '1x', pixels: 20 },
  { idiom: 'ipad', size: '20x20', scale: '2x', pixels: 40 },
  { idiom: 'ipad', size: '29x29', scale: '1x', pixels: 29 },
  { idiom: 'ipad', size: '29x29', scale: '2x', pixels: 58 },
  { idiom: 'ipad', size: '40x40', scale: '1x', pixels: 40 },
  { idiom: 'ipad', size: '40x40', scale: '2x', pixels: 80 },
  { idiom: 'ipad', size: '76x76', scale: '1x', pixels: 76 },
  { idiom: 'ipad', size: '76x76', scale: '2x', pixels: 152 },
  { idiom: 'ipad', size: '83.5x83.5', scale: '2x', pixels: 167 },
  { idiom: 'ios-marketing', size: '1024x1024', scale: '1x', pixels: 1024 },
].map((image) => ({
  ...image,
  filename: `AppIcon-${image.idiom}-${image.size.replaceAll('.', '_')}@${image.scale}.png`,
}))

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
let foundIend = false

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
    if (chunkLength !== 0) {
      throw new Error(`${sourceIcon} contains an invalid PNG IEND chunk`)
    }
    foundIend = true
    break
  }

  chunkOffset = nextChunkOffset
}

if (!foundIend) {
  throw new Error(`${sourceIcon} is missing the required PNG IEND chunk`)
}

function installImage(image) {
  const destination = resolve(appIconSet, image.filename)

  if (image.pixels === 1024 || resizeMode === 'copy') {
    copyFileSync(sourceIcon, destination)
    return
  }

  if (resizeMode !== 'sips') {
    throw new Error(`Unsupported iOS app icon resize mode: ${resizeMode}`)
  }

  const result = spawnSync('sips', ['-z', `${image.pixels}`, `${image.pixels}`, sourceIcon, '--out', destination], {
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if (result.error) {
    throw new Error(
      `Failed to run sips while generating ${image.filename}. This script expects macOS for resizing.`,
      { cause: result.error },
    )
  }

  if (result.status !== 0) {
    throw new Error(
      `sips failed while generating ${image.filename}:\n${result.stdout}\n${result.stderr}`,
    )
  }
}

mkdirSync(appIconSet, { recursive: true })

for (const image of appIconImages) {
  installImage(image)
}

writeFileSync(
  contentsPath,
  `${JSON.stringify(
    {
      images: appIconImages.map(({ filename, idiom, scale, size }) => ({
        filename,
        idiom,
        scale,
        size,
      })),
      info: {
        author: 'xcode',
        version: 1,
      },
    },
    null,
    2,
  )}\n`,
)

console.log(`Installed ${appIconImages.length} iOS app icon files at ${appIconSet}`)
