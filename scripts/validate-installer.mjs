import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import assert from 'node:assert/strict'

const run=promisify(execFile)
const root=fileURLToPath(new URL('../',import.meta.url))
const kit=path.join(root,'public/brands/moss')
const scratch=await mkdtemp(path.join(tmpdir(),'openform-installer-'))
try {
  await mkdir(path.join(scratch,'public'),{recursive:true})
  await mkdir(path.join(scratch,'src'),{recursive:true})
  const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Existing app</title></head><body><div id="root">Existing content</div></body></html>\n'
  const htmlPath=path.join(scratch,'index.html')
  await writeFile(htmlPath,html)
  const installer=path.join(kit,'install-theme.mjs')
  await run(process.execPath,[installer,'--target',scratch,'--html','index.html','--react'],{cwd:kit})
  const destination=path.join(scratch,'public','themes','moss')
  assert.ok((await readFile(path.join(destination,'theme.css'),'utf8')).includes('[data-openform="moss"]'))
  assert.ok((await readFile(path.join(destination,'fonts','manrope.ttf'))).byteLength>5000)
  assert.ok((await readFile(path.join(scratch,'src/components/openform/moss.tsx'),'utf8')).includes('OpenformTheme'))
  const installed=await readFile(htmlPath,'utf8')
  assert.equal((installed.match(/data-openform="moss"/g)||[]).length,1)
  assert.equal((installed.match(/data-openform-stylesheet/g)||[]).length,1)
  assert.ok(installed.includes('/themes/moss/theme.css'))
  assert.equal(await readFile(`${htmlPath}.openform-backup`,'utf8'),html)
  await run(process.execPath,[installer,'--target',scratch,'--html','index.html','--react'],{cwd:kit})
  const repeated=await readFile(htmlPath,'utf8')
  assert.equal((repeated.match(/data-openform="moss"/g)||[]).length,1)
  assert.equal((repeated.match(/data-openform-stylesheet/g)||[]).length,1)
  assert.equal(await readFile(`${htmlPath}.openform-backup`,'utf8'),html)

  const plain=await mkdtemp(path.join(tmpdir(),'openform-static-'))
  await writeFile(path.join(plain,'index.html'),html)
  await run(process.execPath,[installer,'--target',plain,'--public-dir','.','--html','index.html'],{cwd:kit})
  const plainHtml=await readFile(path.join(plain,'index.html'),'utf8')
  assert.ok(plainHtml.includes('href="themes/moss/theme.css"'))
  assert.ok(plainHtml.includes('data-openform="moss"'))
  await rm(plain,{recursive:true,force:true})
  let failed=false
  try { await run(process.execPath,[installer,'--target',scratch,'--public-dir','../outside'],{cwd:kit}) } catch { failed=true }
  assert.equal(failed,true,'unsafe public directories must be rejected')
  console.log('✓ Installer copies complete themes, local fonts, React primitives, HTML attributes, and one-time backups')
  console.log('✓ Installer is idempotent, supports a plain static root, and rejects unsafe paths')
} finally { await rm(scratch,{recursive:true,force:true}) }
