import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { zipSync } from 'fflate'

const root=fileURLToPath(new URL('../',import.meta.url))
const archive={}
const publicDocs=path.join(root,'public/docs')
await mkdir(publicDocs,{recursive:true})
await mkdir(path.join(root,'public/downloads'),{recursive:true})
for(const [source,destination] of [['CONTRIBUTING.md','CONTRIBUTING.md'],['README.md','README.md'],['LICENSE','LICENSE.txt'],['LICENSE-ASSETS','LICENSE-ASSETS.txt'],['ROADMAP.md','ROADMAP.md'],['THIRD-PARTY-NOTICES.md','THIRD-PARTY-NOTICES.md']]) {
  await writeFile(path.join(publicDocs,destination),await readFile(path.join(root,source)))
}
async function include(relative) {
  const absolute=path.join(root,relative)
  const entries=await readdir(absolute,{withFileTypes:true})
  for(const entry of entries) {
    const file=path.posix.join(relative,entry.name)
    if(entry.isDirectory()) await include(file)
    else if(entry.isFile()) archive[file]=new Uint8Array(await readFile(path.join(root,file)))
  }
}
for(const directory of ['src','scripts','tests','docs','.github','public/fonts','public/docs','public/social']) await include(directory)
for(const file of ['package.json','package-lock.json','index.html','tsconfig.json','vite.config.ts','playwright.config.ts','.gitignore','.env.example','README.md','CONTRIBUTING.md','ROADMAP.md','THIRD-PARTY-NOTICES.md','LICENSE','LICENSE-ASSETS','public/favicon.svg','public/social-preview.svg','public/social-preview.png']) {
  await access(path.join(root,file))
  archive[file]=new Uint8Array(await readFile(path.join(root,file)))
}
const bytes=zipSync(archive,{level:6})
await writeFile(path.join(root,'public/downloads/openform-source.zip'),bytes)
console.log(`✓ Public docs and licenses ready`)
console.log(`✓ Source archive: ${Object.keys(archive).length} files, ${(bytes.byteLength/1024/1024).toFixed(2)} MB`)
console.log('  Includes original font files. Rebuild assets with npm run assets.')
