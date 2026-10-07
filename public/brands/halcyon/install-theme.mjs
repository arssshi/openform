#!/usr/bin/env node
/** Openform portable theme installer. MIT License — Openform contributors. */
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const source=path.dirname(fileURLToPath(import.meta.url))
const args=process.argv.slice(2)
const options={target:process.cwd(),publicDir:'public',html:null,react:false,help:false}
for(let i=0;i<args.length;i++) {
  const arg=args[i]
  if(arg==='--help'||arg==='-h') options.help=true
  else if(arg==='--react') options.react=true
  else if(['--target','--public-dir','--html'].includes(arg)) {
    if(!args[i+1]||args[i+1].startsWith('--')) throw new Error(`Missing value for ${arg}`)
    options[{'--target':'target','--public-dir':'publicDir','--html':'html'}[arg]]=args[++i]
  } else throw new Error(`Unknown option: ${arg}. Run with --help for usage.`)
}
if(options.help) {
  console.log('Openform theme installer\n\nnode install-theme.mjs --target /path/to/project [--public-dir public] [--html index.html] [--react]\n\nCopies local assets and fonts. --html attaches the theme to an existing HTML document. --react copies the optional React components. No npm dependencies.')
  process.exit(0)
}

const manifest=JSON.parse(await readFile(path.join(source,'theme.json'),'utf8'))
if(manifest.format!=='openform-theme'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.id)) throw new Error('Invalid Openform theme manifest.')
const target=path.resolve(options.target)
await access(target)
const publicRoot=path.resolve(target,options.publicDir)
if(publicRoot!==target&&!publicRoot.startsWith(target+path.sep)) throw new Error('--public-dir must be inside the chosen project.')
const destination=path.join(publicRoot,'themes',manifest.id)
if(destination===source) throw new Error('Choose a project target outside the extracted kit folder.')

const files=[...new Set([...manifest.exports,...manifest.fonts.flatMap(font=>[font.path,font.license]),'README.md','LICENSE-CC0.txt','LICENSE-CODE.txt'])]
// Preflight everything before copying, so an incomplete kit never installs half a theme.
for(const file of files) {
  if(path.isAbsolute(file)||file.split(/[\\/]/).includes('..')) throw new Error(`Unsafe manifest path: ${file}`)
  await access(path.join(source,file))
}
let htmlPath,htmlOriginal,htmlUpdated
if(options.html) {
  htmlPath=path.resolve(target,options.html)
  if(!htmlPath.startsWith(target+path.sep)) throw new Error('--html must name an existing document inside the chosen project.')
  htmlOriginal=await readFile(htmlPath,'utf8')
  if(!/<html\b/i.test(htmlOriginal)||!/<\/head\s*>/i.test(htmlOriginal)) throw new Error('The selected file must be a complete HTML document with a head element.')
  const href=options.publicDir==='.'?path.relative(path.dirname(htmlPath),path.join(destination,'theme.css')).split(path.sep).join('/'):`/themes/${manifest.id}/theme.css`
  htmlUpdated=htmlOriginal.replace(/<html\b([^>]*)>/i,(_,attributes)=>`<html${attributes.replace(/\sdata-openform\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,'')} data-openform="${manifest.id}">`)
  // Replace an existing Openform stylesheet when switching identities; never duplicate it.
  htmlUpdated=htmlUpdated.replace(/<link\b[^>]*\bdata-openform-stylesheet(?:\s*=\s*(?:"[^"]*"|'[^']*'))?[^>]*>\s*/gi,'')
  const alreadyIncluded=new RegExp(`<link\\b[^>]*href=["']${href.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["'][^>]*>`,'i').test(htmlUpdated)
  if(!alreadyIncluded) htmlUpdated=htmlUpdated.replace(/<\/head\s*>/i,`  <link rel="stylesheet" href="${href}" data-openform-stylesheet>\n</head>`)
}

await mkdir(destination,{recursive:true})
for(const file of files) {
  const output=path.join(destination,file)
  await mkdir(path.dirname(output),{recursive:true})
  await copyFile(path.join(source,file),output)
}
if(options.react) {
  const components=path.join(target,'src/components/openform',`${manifest.id}.tsx`)
  await mkdir(path.dirname(components),{recursive:true})
  await copyFile(path.join(source,'components.tsx'),components)
}
if(htmlPath&&htmlUpdated!==htmlOriginal) {
  const backup=htmlPath+'.openform-backup'
  try { await access(backup) } catch { await writeFile(backup,htmlOriginal) }
  await writeFile(htmlPath,htmlUpdated)
}
const report={theme:manifest.id,version:manifest.version,destination,stylesheet:manifest.installation.stylesheet,rootAttribute:manifest.installation.htmlAttribute,htmlEntry:htmlPath||null,reference:manifest.installation.reference,componentsCopied:options.react,files:files.length}
await writeFile(path.join(destination,'installation.json'),JSON.stringify(report,null,2)+'\n')
console.log(`\nInstalled ${manifest.name} / ${manifest.direction}\n${files.length} local files copied to ${destination}\n\nStylesheet: ${manifest.installation.stylesheet}\nRoot attribute: ${manifest.installation.htmlAttribute}\nReference: ${manifest.installation.reference}\n${htmlPath?`HTML entry updated: ${htmlPath}`:'Add the stylesheet and root attribute to your existing document/layout.'}\n\nRead AI-PROMPT.md to apply the exact component system throughout your project.\n`)
