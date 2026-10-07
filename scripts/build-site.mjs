import { build, loadEnv } from 'vite'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root=fileURLToPath(new URL('../',import.meta.url))
const environment=loadEnv('production',root,'VITE_')
const configured=process.env.VITE_SITE_URL||environment.VITE_SITE_URL||''
let origin=''
if(configured) {
  const url=new URL(configured)
  if(!['https:','http:'].includes(url.protocol)||url.pathname!=='/'||url.search||url.hash) throw new Error('VITE_SITE_URL must be the public site origin, such as https://your-domain.com, with no path or query.')
  origin=url.origin
}
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
const publicUrl=relative=>origin?new URL(relative,origin).href:relative
const temporary=path.join(root,'.openform-ssr')
await build({root})
try {
  await build({root,build:{ssr:'src/entry-server.tsx',outDir:temporary,emptyOutDir:true,copyPublicDir:false,sourcemap:false,minify:false},ssr:{noExternal:['motion','lucide-react']}})
  const {routes,render}=await import(pathToFileURL(path.join(temporary,'entry-server.js')).href)
  const template=await readFile(path.join(root,'dist/index.html'),'utf8')
  const manifest=[]
  function document(pathname) {
    const {html,meta}=render(pathname,origin)
    const head=`<title>${escape(meta.title)}</title>
    ${pathname.startsWith('/brands/')?'<link id="openform-brand-fonts" rel="stylesheet" href="/fonts/fonts.css">':''}
    <meta name="description" content="${escape(meta.description)}">
    <meta name="robots" content="${escape(meta.robots)}">
    ${pathname==='/404/'?'':`<link rel="canonical" href="${escape(publicUrl(meta.path))}">`}
    <meta property="og:site_name" content="Openform">
    <meta property="og:locale" content="en_US">
    <meta property="og:type" content="${pathname.startsWith('/guides/')?'article':'website'}">
    <meta property="og:title" content="${escape(meta.title)}">
    <meta property="og:description" content="${escape(meta.description)}">
    <meta property="og:url" content="${escape(publicUrl(meta.path))}">
    <meta property="og:image" content="${escape(publicUrl(meta.image))}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${escape(meta.title.split(' | ')[0])}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escape(meta.title)}">
    <meta name="twitter:description" content="${escape(meta.description)}">
    <meta name="twitter:image" content="${escape(publicUrl(meta.image))}">
    <script type="application/ld+json" id="openform-schema">${JSON.stringify({'@context':'https://schema.org','@graph':meta.graph}).replaceAll('<','\\u003c')}</script>`
    if(pathname!=='/404/') manifest.push({path:pathname,...meta,canonical:publicUrl(meta.path)})
    return template.replace(/<title>[\s\S]*?<\/title>/,'').replace(/<meta\b[^>]*(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g,'').replace('<!--openform-head-->',head).replace('<div id="root"></div>',`<div id="root">${html}</div>`)
  }
  for(const route of routes) {
    const file=route==='/'?path.join(root,'dist/index.html'):path.join(root,'dist',route.slice(1),'index.html')
    await mkdir(path.dirname(file),{recursive:true})
    await writeFile(file,document(route))
  }
  await writeFile(path.join(root,'dist/404.html'),document('/404/'))
  const robots=`User-agent: *\nAllow: /\nDisallow: /downloads/\n${origin?`\nSitemap: ${origin}/sitemap.xml\n`:''}`
  await writeFile(path.join(root,'dist/robots.txt'),robots)
  if(origin) {
    const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route=>`  <url><loc>${escape(publicUrl(route))}</loc></url>`).join('\n')}\n</urlset>\n`
    await writeFile(path.join(root,'dist/sitemap.xml'),xml)
  }
  await writeFile(path.join(root,'dist/seo-manifest.json'),JSON.stringify({origin:origin||null,sitemap:origin?'/sitemap.xml':null,pages:manifest},null,2)+'\n')
  console.log(`✓ ${routes.length} crawlable, prerendered pages with unique metadata and structured data`)
  console.log('✓ Real identity, style, collection, and guide URLs; accessible content without JavaScript')
  console.log(origin?`✓ Absolute canonicals, social URLs, robots.txt, and sitemap: ${origin}`:'✓ Relative canonicals and robots.txt ready. Set VITE_SITE_URL to generate the public-domain sitemap when publishing.')
} finally {
  await rm(temporary,{recursive:true,force:true})
}
