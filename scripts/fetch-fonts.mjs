import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const fonts = JSON.parse(await readFile(path.join(root, 'src/data/fonts.json'), 'utf8'))
const destination = path.join(root, 'public/fonts')
await mkdir(destination, { recursive: true })

async function download(url, file) {
  try { await access(file); return } catch { /* Download missing files only. */ }
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status}: ${url}`)
  await writeFile(file, Buffer.from(await response.arrayBuffer()))
}

await Promise.all(fonts.map(async (font) => {
  const base = `https://raw.githubusercontent.com/google/fonts/main/ofl/${font.directory}`
  await download(`${base}/${encodeURIComponent(font.file)}`, path.join(destination, `${font.id}.ttf`))
  await download(`${base}/OFL.txt`, path.join(destination, `${font.id}-OFL.txt`))
  console.log(`✓ ${font.family}${font.style ? ` ${font.style}` : ''}`)
}))

const css = fonts.map(font => `@font-face { font-family: '${font.family}'; src: url('/fonts/${font.id}.ttf') format('truetype'); font-style: ${font.style || 'normal'}; font-weight: ${font.weight}; font-display: swap; }`).join('\n')
await writeFile(path.join(destination, 'fonts.css'), `${css}\n`)
console.log(`${fonts.length} self-hosted font files and their original OFL licenses are ready.`)
