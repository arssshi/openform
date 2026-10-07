import { access, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root=fileURLToPath(new URL('../',import.meta.url))
const fonts=[['DM Sans','dm-sans-latin.woff2','normal'],['Instrument Serif','instrument-serif-italic-latin.woff2','italic']]
const missing=[]
for(const font of fonts) {
  try { const bytes=await readFile(path.join(root,'public/fonts',font[1])); if(bytes.subarray(0,4).toString()!=='wOF2') throw new Error('Invalid WOFF2'); console.log(`✓ ${font[1]} already available`) } catch { missing.push(font) }
}
if(missing.length) {
  const response=await fetch('https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..1000&family=Instrument+Serif:ital@1&display=swap',{headers:{'User-Agent':'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}})
  if(!response.ok) throw new Error(`Font stylesheet request failed: ${response.status}`)
  const css=await response.text()
  const latin=[...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].map(match=>match[1])
  for(const [family,file,style] of missing) {
    const face=latin.find(block=>block.includes(`font-family: '${family}'`)&&block.includes(`font-style: ${style}`))
    const url=face?.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/)?.[1]
    if(!url) throw new Error(`Original Latin WOFF2 not found for ${family}`)
    const download=await fetch(url)
    if(!download.ok) throw new Error(`Font download failed: ${download.status}`)
    const bytes=Buffer.from(await download.arrayBuffer())
    if(bytes.subarray(0,4).toString()!=='wOF2') throw new Error(`Invalid WOFF2 for ${family}`)
    await access(path.join(root,'public/fonts'))
    await writeFile(path.join(root,'public/fonts',file),bytes)
    console.log(`✓ Original ${family} Latin WOFF2 self-hosted: ${(bytes.length/1024).toFixed(1)} KB`)
  }
}
