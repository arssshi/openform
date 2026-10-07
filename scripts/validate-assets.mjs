import { readFile, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { unzipSync, strFromU8 } from 'fflate'
import ts from 'typescript'
import { contrast } from './lib/design.mjs'

const root=fileURLToPath(new URL('../',import.meta.url))
const read=async file=>readFile(path.join(root,file),'utf8')
const originals=JSON.parse(await read('src/data/brands.json'))
const systems=JSON.parse(await read('src/data/systems.json'))
const brands=originals.map(brand=>({...brand,system:systems[brand.id]}))
const fonts=JSON.parse(await read('src/data/fonts.json'))
const fontMap=new Map(fonts.map(font=>[font.id,font]))
const collections=JSON.parse(await read('src/data/collections.json'))
const files=JSON.parse(await read('src/data/assets.json')).map(([file])=>file)
const catalog=JSON.parse(await read('public/catalog.json'))
const version=JSON.parse(await read('package.json')).version
const ids=new Set(brands.map(brand=>brand.id))
const symbolHashes=new Set(),artHashes=new Set(),compositions=new Set(),patterns=new Set(),directions=new Set()
const complete=unzipSync(new Uint8Array(await readFile(path.join(root,'public/downloads/openform-complete-library.zip'))))
assert.equal(ids.size,brands.length,'Brand IDs must be unique')
assert.equal(new Set(brands.map(brand=>brand.name.toLowerCase())).size,brands.length)
assert.deepEqual(Object.keys(systems).sort(),[...ids].sort(),'Every identity needs its own direction')
assert.deepEqual(catalog.assetFiles,files)
assert.equal(catalog.version,version)
assert.equal(catalog.totals.brands,brands.length)
assert.equal(catalog.totals.assets,brands.length*files.length)
assert.equal(catalog.totals.themes,brands.length)
assert.equal(catalog.totals.implementationPrompts,brands.length)
let svgCount=0
const fingerprint=content=>createHash('sha256').update(content.replace(/<title[^>]*>.*?<\/title>/g,'').replace(/#[0-9a-f]{6}/gi,'#000000')).digest('hex')

for(const brand of brands) {
  const s=brand.system,base=`public/brands/${brand.id}/`
  assert.match(brand.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  assert.equal(brand.colors.length,4)
  assert.equal(brand.colorNames.length,4)
  brand.colors.forEach(color=>assert.match(color,/^#[0-9A-F]{6}$/))
  assert.ok(s&&s.concept.length>80&&s.layoutNote.length>80,`${brand.id}: incomplete art direction`)
  assert.equal(s.nav.length,3)
  assert.equal(s.features.length,3)
  assert.ok(s.features.every(feature=>feature.length===2&&feature[0].length>3&&feature[1].length>10))
  assert.ok(s.split>=.3&&s.split<=.7)
  assert.ok(s.maxWidth>=1000&&s.maxWidth<=1600)
  assert.ok(['dark','paper','accent'].includes(s.mode))
  assert.ok(!directions.has(s.direction),`${brand.id}: duplicate direction`)
  directions.add(s.direction)
  for(const font of [brand.heading,brand.body,s.accentFont]) assert.ok(fontMap.has(font),`${brand.id}: unknown font ${font}`)
  const range=fontMap.get(brand.heading).weight.split(' ').map(Number)
  assert.ok(brand.weight>=range[0]&&brand.weight<=range.at(-1),`${brand.id}: display weight outside the actual font range`)
  assert.equal(brand.rules.length,3)
  assert.ok(contrast(brand.colors[0],brand.colors[1])>=4.5,`${brand.id}: accent text contrast`)
  assert.ok(contrast(brand.colors[0],brand.colors[2])>=4.5,`${brand.id}: paper text contrast`)
  assert.ok(!compositions.has(brand.layout)&&!patterns.has(brand.pattern),`${brand.id}: duplicate layout/pattern key`)
  compositions.add(brand.layout);patterns.add(brand.pattern)
  assert.ok(collections.find(collection=>collection.id===brand.collection)?.ids.includes(brand.id))

  const zip=unzipSync(new Uint8Array(await readFile(path.join(root,`public/downloads/${brand.id}-brand-kit.zip`))))
  for(const file of [...files,'preview.svg','brand.json','README.md','LICENSE-CC0.txt','LICENSE-CODE.txt']) {
    const content=await read(base+file)
    assert.ok(zip[file],`${brand.id}/${file}: kit file missing`)
    assert.equal(strFromU8(zip[file]),content,`${brand.id}/${file}: kit mismatch`)
    assert.equal(strFromU8(complete[`${brand.id}/${file}`]),content,`${brand.id}/${file}: complete archive mismatch`)
    if(file.endsWith('.svg')) {
      svgCount++
      assert.ok(content.startsWith('<svg')&&content.endsWith('</svg>'))
      assert.ok(!/<(?:script|foreignObject|text)\b/i.test(content),`${brand.id}/${file}: artwork must be portable paths`)
      assert.ok(!/(?:href|src)=["'](?:https?:|\/\/)|url\(https?:/i.test(content),`${brand.id}/${file}: external dependency`)
      assert.ok(!/(?:NaN|Infinity|undefined)/.test(content),`${brand.id}/${file}: invalid geometry`)
      assert.match(content,/viewBox="0 0 [\d.]+ [\d.]+"/)
      assert.match(content,/<title id="title">.+<\/title>/)
    }
  }
  const symbol=fingerprint(await read(base+'mark.svg'))
  const art=fingerprint(await read(base+'artwork.svg'))
  assert.ok(!symbolHashes.has(symbol),`${brand.id}: duplicate symbol geometry`)
  assert.ok(!artHashes.has(art),`${brand.id}: duplicate illustration geometry`)
  symbolHashes.add(symbol);artHashes.add(art)
  const theme=JSON.parse(strFromU8(zip['theme.json']))
  assert.equal(theme.format,'openform-theme')
  assert.equal(theme.version,version)
  assert.equal(theme.id,brand.id)
  assert.deepEqual(theme.exports,files)
  assert.equal(theme.scope.selector,`[data-openform="${brand.id}"]`)
  assert.equal(theme.installation.stylesheet,`/themes/${brand.id}/theme.css`)
  assert.equal(theme.colors.ink,brand.colors[0])
  assert.equal(theme.typography.display.family,fontMap.get(brand.heading).family)
  assert.equal(theme.typography.display.desktopMaxPx,Math.min(s.headingSize,96))
  assert.equal(theme.components.cardRadiusPx,0)
  assert.deepEqual(new Set(theme.fonts.map(font=>font.id)),new Set([brand.heading,brand.body,s.accentFont]))
  const css=strFromU8(zip['theme.css'])
  assert.ok(css.includes(theme.scope.selector))
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'))
  for(const match of css.matchAll(/url\(['"]\.\/(.*?)['"]\)/g)) assert.ok(zip[match[1]],`${brand.id}: unresolved CSS font`)
  for(const font of theme.fonts) {
    assert.ok(zip[font.path]?.byteLength>5000,`${brand.id}: missing local font`)
    assert.deepEqual(zip[font.path],new Uint8Array(await readFile(path.join(root,base,font.path))))
    assert.ok(strFromU8(zip[font.license]).includes('SIL OPEN FONT LICENSE'))
    assert.ok(complete[`${brand.id}/${font.path}`]&&complete[`${brand.id}/${font.license}`])
  }
  for(const file of ['reference.html','components.html']) {
    const html=strFromU8(zip[file])
    assert.ok(html.includes(`data-openform="${brand.id}"`))
    assert.ok(html.includes('name="viewport"'))
    assert.ok(html.includes('name="robots" content="noindex, follow"'))
    for(const match of html.matchAll(/(?:src|href)="\.\/([^"#?]+)(?:[?#][^"]*)?"/g)) assert.ok(zip[match[1]],`${brand.id}/${file}: unresolved local reference ${match[1]}`)
  }
  const prompt=strFromU8(zip['AI-PROMPT.md'])
  for(const term of ['theme.json','reference.html','components.html','install-theme.mjs','data-openform="'+brand.id+'"','/themes/'+brand.id+'/theme.css','of-display','of-input','Preserve','## 7. Finish and verify']) assert.ok(prompt.includes(term),`${brand.id}: prompt missing ${term}`)
  assert.ok(prompt.length>6500,`${brand.id}: incomplete implementation instructions`)
  assert.ok(strFromU8(zip['LICENSE-CODE.txt']).includes('MIT License'))
  assert.ok(strFromU8(zip['LICENSE-CC0.txt']).includes('CC0-1.0'))
  const tokens=JSON.parse(strFromU8(zip['tokens.json']))
  assert.equal(tokens.$extensions.openform.name,brand.name)
  assert.equal(tokens.color.ink.$extensions['openform.hex'],brand.colors[0])
}
for(const collection of collections) for(const id of collection.ids) assert.ok(ids.has(id))
for(const file of ['dm-sans-latin.woff2','instrument-serif-italic-latin.woff2']) {
  await access(path.join(root,'public/fonts',file))
  assert.equal((await readFile(path.join(root,'public/fonts',file))).subarray(0,4).toString(),'wOF2')
}
const program=ts.createProgram(brands.map(brand=>path.join(root,`public/brands/${brand.id}/components.tsx`)),{noEmit:true,strict:true,skipLibCheck:true,jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,target:ts.ScriptTarget.ES2022})
const errors=ts.getPreEmitDiagnostics(program)
assert.equal(errors.length,0,ts.formatDiagnosticsWithColorAndContext(errors,{getCanonicalFileName:file=>file,getCurrentDirectory:()=>root,getNewLine:()=>"\n"}))
console.log(`✓ ${brands.length} distinct symbols, illustrations, and authored directions`)
console.log(`✓ ${svgCount} portable SVGs; ${catalog.totals.assets} primary files match both archive formats`)
console.log(`✓ ${brands.length*2} approved WCAG AA text pairings`)
console.log(`✓ ${brands.length} complete theme contracts, local references, prompts, fonts, and original notices`)
console.log(`✓ All ${brands.length} optional React component files pass actual TypeScript checking`)
console.log('✓ Optimized self-hosted website fonts and catalogue integrity verified')
