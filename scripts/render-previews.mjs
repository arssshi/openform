import { createServer } from 'vite'
import { chromium } from '@playwright/test'
import { readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import assert from 'node:assert/strict'

const root=fileURLToPath(new URL('../',import.meta.url))
const brands=JSON.parse(await readFile(path.join(root,'src/data/brands.json'),'utf8'))
const assets=JSON.parse(await readFile(path.join(root,'src/data/assets.json'),'utf8'))
const output=process.env.OPENFORM_PREVIEW_DIR||'/tmp/omnirush/openform-review'
await mkdir(output,{recursive:true})
await mkdir(path.join(output,'themes'),{recursive:true})
await mkdir(path.join(root,'public/social'),{recursive:true})
const server=await createServer({root,server:{host:'127.0.0.1',port:5196,strictPort:true}})
await server.listen()
const base='http://127.0.0.1:5196'
const browser=await chromium.launch()
const escape=text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')

try {
  const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1})
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto(`${base}/social-preview.svg`)
  await page.screenshot({path:path.join(root,'public/social-preview.png')})
  for(const brand of brands) {
    await page.goto(`${base}/brands/${brand.id}/social.svg`)
    await page.screenshot({path:path.join(root,'public/social',`${brand.id}.png`)})
  }
  console.log('✓ Main and 48 identity-specific social PNGs rendered from actual artwork')

  const documents=[]
  for(const brand of brands) for(const filename of [...assets.map(([file])=>file).filter(file=>file.endsWith('.svg')),'preview.svg']) documents.push({name:`${brand.id}/${filename}`,svg:await readFile(path.join(root,'public/brands',brand.id,filename),'utf8')})
  const malformed=await page.evaluate(docs=>docs.filter(doc=>new DOMParser().parseFromString(doc.svg,'image/svg+xml').querySelector('parsererror')).map(doc=>doc.name),documents)
  assert.deepEqual(malformed,[],'Browser XML parser found invalid SVGs')
  console.log(`✓ ${documents.length} portable SVG documents parsed in Chromium`)

  await page.route('**/__review',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="en"><head><title>Openform review</title></head><body></body></html>'}))
  async function sheet(filename,file,columns=6) {
    await page.setViewportSize({width:1800,height:1000})
    await page.goto(`${base}/__review`)
    await page.setContent(`<html lang="en"><head><style>*{box-sizing:border-box}body{margin:0;padding:32px;background:#f7f8f3;color:#191a1c;font-family:system-ui}h1{font-size:34px;font-weight:500;letter-spacing:-1px;margin:0 0 10px}p{font-size:13px;margin:0 0 28px;color:#676d60}.grid{display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr));gap:22px 18px}figure{margin:0;min-width:0}img{width:100%;display:block;border-radius:3px}figcaption{font-size:11px;padding-top:8px;display:flex;justify-content:space-between}small{font-size:9px;color:#626d58}</style></head><body><h1>Openform / A clear idea. A complete identity.</h1><p>48 original systems. Essential compositions. ${escape(file)} review.</p><div class="grid">${brands.map((b,i)=>`<figure><img src="${base}/brands/${b.id}/${file}" alt="${escape(b.name)}"><figcaption><span>${String(i+1).padStart(2,'0')} / ${escape(b.name)}</span><small>${b.style}</small></figcaption></figure>`).join('')}</div></body></html>`)
    await page.waitForFunction(()=>[...document.images].every(image=>image.complete&&image.naturalWidth>0))
    await page.screenshot({path:path.join(output,filename),fullPage:true})
  }
  await sheet('all-48-identities.png','preview.svg')
  await sheet('all-48-boards.png','identity-board.svg',4)
  await sheet('all-48-artwork.png','artwork.svg')
  console.log('✓ Complete identity, board, and simplified-artwork review sheets')

  for(const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
    await page.setViewportSize({width,height:width===1440?1000:844})
    await page.goto(base)
    await page.evaluate(()=>document.fonts.ready)
    await page.waitForFunction(()=>[...document.querySelectorAll('.studio-hero-art img')].every(image=>image.complete&&image.naturalWidth>0))
    await page.screenshot({path:path.join(output,`website-${name}.png`),fullPage:true})
    await page.screenshot({path:path.join(output,`website-${name}-first-screen.png`)})
  }
  await page.setViewportSize({width:1440,height:1000})
  await page.goto(`${base}/brands/moss/`)
  await page.evaluate(()=>document.fonts.ready)
  await page.screenshot({path:path.join(output,'identity-page.png'),fullPage:true})
  await page.getByRole('tab',{name:'Applications',exact:true}).click()
  await page.screenshot({path:path.join(output,'identity-applications.png')})
  await page.getByRole('tab',{name:'Assets 30'}).click()
  await page.screenshot({path:path.join(output,'identity-assets.png')})
  await page.getByRole('tab',{name:'Install theme'}).click()
  await page.screenshot({path:path.join(output,'identity-install.png'),fullPage:true})
  console.log('✓ Modern showcase, identity page, applications, assets, and installation screenshots')

  for(const brand of brands) {
    for(const [width,height,name] of [[1440,1000,'desktop'],[390,844,'mobile']]) {
      await page.setViewportSize({width,height})
      await page.goto(`${base}/brands/${brand.id}/reference.html`)
      await page.evaluate(()=>document.fonts.ready)
      await page.waitForFunction(()=>[...document.querySelectorAll('.of-hero img')].every(image=>image.complete&&image.naturalWidth>0))
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${brand.id}: ${name} page overflow`)
      await page.screenshot({path:path.join(output,'themes',`${brand.id}-${name}.png`)})
    }
  }
  await page.route('**/__theme-review/**',async route=>{
    const basename=decodeURIComponent(new URL(route.request().url()).pathname.split('/').pop())
    await route.fulfill({contentType:'image/png',body:await readFile(path.join(output,'themes',basename))})
  })
  for(const device of ['desktop','mobile']) {
    await page.setViewportSize({width:1800,height:1000})
    await page.goto(`${base}/__review`)
    await page.setContent(`<html><head><style>*{box-sizing:border-box}body{margin:0;background:#f7f8f3;padding:30px;font:12px system-ui;color:#191a1c}.grid{display:grid;grid-template-columns:repeat(${device==='mobile'?8:4},minmax(0,1fr));gap:24px 18px}figure{margin:0}img{display:block;width:100%}figcaption{margin-top:8px}</style></head><body><h1>Openform / ${device} theme references</h1><div class="grid">${brands.map(b=>`<figure><img src="${base}/__theme-review/${b.id}-${device}.png"><figcaption>${escape(b.name)}</figcaption></figure>`).join('')}</div></body></html>`)
    await page.waitForFunction(()=>[...document.images].every(image=>image.complete&&image.naturalWidth>0))
    await page.screenshot({path:path.join(output,`all-48-themes-${device}.png`),fullPage:true})
  }
  console.log(`✓ All 48 desktop/mobile references fit their viewport; complete review sheets in ${output}`)
} finally {
  await browser.close()
  await server.close()
}
