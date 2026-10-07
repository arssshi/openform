import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const root=fileURLToPath(new URL('../',import.meta.url))
const dist=path.join(root,'dist')
const brands=JSON.parse(await readFile(path.join(root,'src/data/brands.json'),'utf8'))
const collections=JSON.parse(await readFile(path.join(root,'src/data/collections.json'),'utf8'))
const styles=['Minimal','Organic','Playful','Editorial','Futuristic','Brutalist','Elegant','Retro']
const brandUrl=id=>`/brands/${id}/`
const collectionUrl=id=>`/collections/${id}/`
const styleUrl=style=>`/styles/${style.toLowerCase()}/`
const guideUrl='/guides/install-brand-theme/'
const routes=['/',...brands.map(brand=>brandUrl(brand.id)),...styles.map(styleUrl),...collections.map(collection=>collectionUrl(collection.id)),guideUrl]
const html=async route=>readFile(route==='/'?path.join(dist,'index.html'):path.join(dist,route.slice(1),'index.html'),'utf8')
const titles=new Set(), descriptions=new Set()
for(const route of routes) {
  const page=await html(route)
  assert.match(page,/<title>[^<]{20,}<\/title>/,`${route}: missing useful title`)
  assert.match(page,/<meta name="description" content="[^"\n]{80,}"\s*\/>|<meta name="description" content="[^"\n]{80,}">/,`${route}: missing useful description`)
  assert.match(page,/<link rel="canonical" href="[^"]+"\s*\/>|<link rel="canonical" href="[^"]+">/,`${route}: missing canonical`)
  assert.match(page,/<script type="application\/ld\+json" id="openform-schema">/,`${route}: missing JSON-LD`)
  assert.match(page,/<h1[\s>]/,`${route}: no crawlable H1`)
  const title=page.match(/<title>(.*?)<\/title>/)?.[1]
  const description=page.match(/<meta name="description" content="(.*?)"\s*\/?\s*>/)?.[1]
  assert.ok(title&&!titles.has(title),`${route}: duplicate title`)
  assert.ok(description&&!descriptions.has(description),`${route}: duplicate description`)
  titles.add(title);descriptions.add(description)
}
const robots=await readFile(path.join(dist,'robots.txt'),'utf8')
assert.match(robots,/User-agent: \*/)
assert.match(robots,/Allow: \//)
const origin=process.env.VITE_SITE_URL
if(origin) {
  const sitemap=await readFile(path.join(dist,'sitemap.xml'),'utf8')
  assert.equal((sitemap.match(/<url>/g)||[]).length,routes.length)
  assert.ok(sitemap.includes(`${origin.replace(/\/$/,'')}/brands/moss/`))
}
await access(path.join(dist,'social-preview.png'))
await access(path.join(dist,'assets'))
console.log(`✓ ${routes.length} production pages have unique titles, descriptions, canonicals, H1s, and JSON-LD`)
console.log(origin?'✓ Public-origin sitemap contains every crawlable page':'✓ robots.txt is present; set VITE_SITE_URL for absolute sitemap URLs at publish time')
