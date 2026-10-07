import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { zipSync, strToU8 } from 'fflate'
import { logo, svg, mark, pattern, contrast, type } from './lib/design.mjs'
import { artwork } from './lib/artwork.mjs'
import { identityPreview, identityBoard, packagingContent, stationeryContent, websiteContent, premiumPoster, premiumSocial, socialStory, businessCards, palette, typography, icons } from './lib/identity.mjs'
import { themeManifest, themeCss, referencePage, componentPage, reactComponents, themeRuntime, implementationPrompt, installationGuide, shortPrompt } from './lib/theme.mjs'

const root=fileURLToPath(new URL('../',import.meta.url))
const read=async file=>readFile(path.join(root,file),'utf8')
const originals=JSON.parse(await read('src/data/brands.json'))
const systems=JSON.parse(await read('src/data/systems.json'))
const fonts=JSON.parse(await read('src/data/fonts.json'))
const assets=JSON.parse(await read('src/data/assets.json'))
const fontMap=new Map(fonts.map(font=>[font.id,font]))
const cc0=await read('LICENSE-ASSETS')
const mit=await read('LICENSE')
const installer=await read('scripts/theme-installer.mjs')
const allFiles={}
const json=value=>JSON.stringify(value,null,2)+'\n'
const files=assets.map(([file])=>file)
const manifest=[]

function guidelines(brand,theme,pairings) {
  const s=brand.system
  return `# ${brand.name} / Edition 02

> ${brand.tagline}

## ${s.direction}

${s.concept}

${brand.description}

## A complete, usable visual world

This identity includes an individually authored master symbol, real font files, original illustration, art-directed campaign, composed identity board, stationery, packaging, web direction, icon sheet, and a complete working theme. The illustrations and applications are original vector artwork, not photographs or official assets of an existing company.

Start by opening **reference.html** and **components.html**. They are working local pages, not screenshots. Open identity-board.svg for the full visual system. To apply the design to an existing project, read INSTALL.md or give a coding model AI-PROMPT.md.

## Personality

${brand.voice}

## The distinguishing decisions

${brand.rules.map((rule,i)=>`${i+1}. ${rule}`).join('\n')}

4. ${s.layoutNote}
5. Use the supplied ${s.art} artwork as the principal visual device. Do not substitute an unrelated stock image or a generic gradient.
6. Keep informational reading areas calm and aligned even where the campaign is expressive.

## Logo system

- lockup.svg: primary symbol-and-wordmark configuration.
- wordmark.svg: independent typographic wordmark.
- mark.svg: compact master symbol; useful for avatars, corners, and interface accents.
- monochrome.svg: genuine single-color version.
- favicon.svg and avatar.svg: ready-sized applications.

All artwork typography is outlined. The artwork renders correctly without installed fonts or internet access. Keep clear space of at least half a symbol height around independent lockups; minimum recommended symbol width is 24px and lockup width is 160px. Never stretch glyphs or separately distort part of a mark. Intentional large crops belong in campaigns, not the primary logo file.

## Color roles

| Role | Name | Value |
| --- | --- | --- |
${brand.colors.map((value,i)=>`| ${['Ink','Accent','Paper','Support'][i]} | ${brand.colorNames[i]} | ${value} |`).join('\n')}

### Approved normal-text combinations

${pairings.map(pair=>`- ${pair.foreground} on ${pair.background}: ${pair.ratio}:1, meets WCAG AA for normal text.`).join('\n')}

Support color is an illustration / decorative surface until its intended text pairing is independently checked. The theme uses approved primary pairs and an explicitly derived secondary reading color.

## Typography

- Display: ${theme.typography.display.family}, weight ${brand.weight}, tracking ${brand.tracking/100}em, leading ${theme.typography.display.lineHeight}.
- Reading: ${theme.typography.body.family}, weight 400, 16px, 1.7 leading, up to 65 characters per line.
- Accent: ${theme.typography.accent.family}, ${theme.typography.accent.style}.
- Labels: 11px, 0.08em tracking, 1.5 leading.
- Maximum desktop display size: ${theme.typography.display.desktopMaxPx}px. Use the provided CSS clamps on narrower screens.
- Keep the original, unmodified local font files and their original SIL OFL notices together.

## The layout grammar

${s.layoutNote}

The page maximum width is ${s.maxWidth}px. Gutters use clamp(20px, 4vw, 64px). Section spacing uses clamp(64px, 9vw, 128px). The base spacing unit is 4px. The desktop hero's text/image proportion is ${Math.round(s.split*100)}/${Math.round((1-s.split)*100)}; centered compositions use a single wide column. At 960px the hero becomes one column. At 640px the card grid becomes one column and native mobile navigation becomes available.

## Components

The base radius is ${brand.radius}px; information cards use 0px corners and a quiet top divider. Borders are ${theme.components.borderPx}px; buttons follow the ${s.button} direction. Buttons are at least 48px high; inputs are 52px high. Controls keep a visible 3px focus outline with a 4px offset. Motion preferences are respected. Keep one clear focal idea per composition.

The class map and exact values live in theme.json. The live inventory in components.html includes real typography, controls, cards, badges, forms, tables, notices, and accordions. Optional components.tsx provides typed React primitives with no dependency beyond React.

## Applications and formats

${assets.map(([file,name,format])=>`- **${name}** — ${file} (${format}).`).join('\n')}

The composed preview is supplementary to the ${files.length} primary files; original font files and license notices are supplementary too. Counts do not include duplicate ZIP archives, repeated licenses, or per-font support files.

## Installing the theme

\`\`\`sh
node install-theme.mjs --target "/path/to/your/project"
\`\`\`

Load /themes/${brand.id}/theme.css and attach data-openform="${brand.id}" to the existing document root or desired subtree. Use the supplied of-* classes to apply the actual component system. Preserve your own content, routes, application state, and real form handlers.

### The instruction to give an AI coding assistant

${shortPrompt(brand)}

AI-PROMPT.md contains concrete ordered steps, framework mappings, exact asset paths, component names, numeric constraints, and acceptance checks. It is written so a coding model with access to the kit can implement the provided design instead of guessing it.

## Licenses

Original artwork, design information, and identity metadata: CC0-1.0. Theme code, installer, and component code: MIT. Font software retains its original SIL Open Font License. See LICENSE-CC0.txt, LICENSE-CODE.txt, and fonts/*-OFL.txt. These are fictional identity concepts; names are not trademark clearances.
`
}

await mkdir(path.join(root,'public/brands'),{recursive:true})
await mkdir(path.join(root,'public/downloads'),{recursive:true})
await mkdir(path.join(root,'public/social'),{recursive:true})
for(const [index,original] of originals.entries()) {
  if(!systems[original.id]) throw new Error(`Missing identity direction: ${original.id}`)
  const brand={...original,system:systems[original.id]}
  const directory=path.join(root,'public/brands',brand.id)
  await mkdir(directory,{recursive:true})
  const pairings=[1,2].map(i=>({foreground:brand.colors[0],background:brand.colors[i],ratio:Number(contrast(brand.colors[0],brand.colors[i]).toFixed(2)),aaNormal:contrast(brand.colors[0],brand.colors[i])>=4.5}))
  if(pairings.some(pair=>!pair.aaNormal)) throw new Error(`${brand.id}: primary text pairing does not pass WCAG AA`)
  const theme=themeManifest(brand,fontMap,files)
  const tokens={
    $description:`${brand.name} / ${brand.system.direction} / Edition 02`,
    color:Object.fromEntries(brand.colors.map((hex,i)=>[['ink','accent','paper','support'][i],{$type:'color',$value:{colorSpace:'srgb',components:hex.slice(1).match(/../g).map(c=>Number((parseInt(c,16)/255).toFixed(5))),alpha:1},$extensions:{'openform.hex':hex}}])),
    typography:{heading:{$type:'fontFamily',$value:theme.typography.display.family},body:{$type:'fontFamily',$value:theme.typography.body.family},headingWeight:{$type:'fontWeight',$value:brand.weight},tracking:{$type:'number',$value:brand.tracking/100,$description:'Display letter spacing in em units.'},bodySize:{$type:'dimension',$value:{value:16,unit:'px'}},bodyLeading:{$type:'number',$value:1.7}},
    radius:{$type:'dimension',$value:{value:brand.radius,unit:'px'}},
    spacing:{unit:{$type:'dimension',$value:{value:4,unit:'px'}},pageMinimum:{$type:'dimension',$value:{value:20,unit:'px'}},pageMaximum:{$type:'dimension',$value:{value:64,unit:'px'}}},
    $extensions:{openform:{name:brand.name,version:'2.0.0',style:brand.style,direction:brand.system.direction,voice:brand.voice,layout:theme.layout,contrast:pairings}}
  }
  const output={
    'mark.svg':logo(brand,'mark'),'lockup.svg':logo(brand),'wordmark.svg':logo(brand,'wordmark'),'monochrome.svg':logo(brand,'mono'),
    'pattern.svg':svg(pattern(brand),960,720,`${brand.name} signature pattern`,brand.colors[2]),
    'poster.svg':premiumPoster(brand),'social.svg':premiumSocial(brand),
    'avatar.svg':svg(mark(brand,76,76,360,brand.colors[0]),512,512,`${brand.name} avatar`,brand.colors[1]),
    'favicon.svg':svg(mark(brand,4,4,56,brand.colors[0]),64,64,`${brand.name} favicon`,brand.colors[1]),
    'artwork.svg':artwork(brand),'identity-board.svg':identityBoard(brand),
    'stationery.svg':svg(stationeryContent(brand),1200,900,`${brand.name} stationery system`),
    'packaging.svg':svg(packagingContent(brand),1200,900,`${brand.name} packaging study`),
    'website.svg':svg(websiteContent(brand),1440,960,`${brand.name} website direction`),
    'social-story.svg':socialStory(brand),'icon-set.svg':icons(brand),'palette.svg':palette(brand),'typography.svg':typography(brand),'business-card.svg':businessCards(brand),
    'tokens.json':json(tokens),'theme.css':themeCss(brand,fontMap),'theme.json':json(theme),'theme.js':themeRuntime(),
    'reference.html':referencePage(brand),'components.html':componentPage(brand),'components.tsx':reactComponents(brand),
    'install-theme.mjs':installer,'AI-PROMPT.md':implementationPrompt(brand,theme),'INSTALL.md':installationGuide(brand),
    'guidelines.md':guidelines(brand,theme,pairings),
    'README.md':`# ${brand.name} / Edition 02\n\n${brand.system.direction}.\n\nOpen reference.html to see the working design. Open components.html for the component system. Give your coding assistant AI-PROMPT.md or follow INSTALL.md.\n\nnode install-theme.mjs --target "/path/to/project"\n\nAll SVGs are original and self-contained. Fonts are local. Artwork and design information: CC0-1.0. Code: MIT. Font software: original SIL OFL licenses.\n`,
    'LICENSE-CC0.txt':cc0,'LICENSE-CODE.txt':mit,
    'brand.json':json({...brand,version:'2.0.0',number:index+1,assets:files.length}),
    'preview.svg':identityPreview(brand)
  }
  for(const file of files) if(!output[file]) throw new Error(`${brand.id}: primary asset is not generated: ${file}`)
  const kitFiles={}
  for(const [name,content] of Object.entries(output)) {
    await writeFile(path.join(directory,name),content)
    kitFiles[name]=strToU8(content)
    allFiles[`${brand.id}/${name}`]=strToU8(content)
  }
  await mkdir(path.join(directory,'fonts'),{recursive:true})
  for(const font of theme.fonts) {
    for(const filename of [font.path,font.license]) {
      const basename=path.basename(filename)
      const bytes=new Uint8Array(await readFile(path.join(root,'public/fonts',basename)))
      await writeFile(path.join(directory,filename),bytes)
      kitFiles[filename]=bytes
      allFiles[`${brand.id}/${filename}`]=bytes
    }
  }
  const zip=zipSync(kitFiles,{level:6})
  await writeFile(path.join(root,'public/downloads',`${brand.id}-brand-kit.zip`),zip)
  manifest.push({...brand,version:'2.0.0',number:index+1,assets:files.length,downloadBytes:zip.byteLength,theme:{scope:theme.scope,installation:theme.installation},contrast:pairings})
  console.log(`✓ ${String(index+1).padStart(2,'0')} ${brand.name} / ${brand.system.direction} — ${files.length} primary files + installable theme`)
}
allFiles['README.md']=strToU8(`# Openform / Edition 02\n\n${originals.length} art-directed identities. ${files.length} primary files per identity. Every kit includes an installable theme and an exact implementation prompt. Begin with reference.html, INSTALL.md, or AI-PROMPT.md in any kit.\n\nOriginal assets: CC0-1.0. Code: MIT. Fonts: original SIL OFL licenses.\n`)
await writeFile(path.join(root,'public/downloads/openform-complete-library.zip'),zipSync(allFiles,{level:6}))
await writeFile(path.join(root,'public/catalog.json'),json({version:'2.0.0',license:'CC0-1.0',codeLicense:'MIT',fontLicense:'OFL-1.1',brands:manifest,assetFiles:files,totals:{brands:originals.length,assets:originals.length*files.length,themes:originals.length,implementationPrompts:originals.length,fontFamilies:new Set(fonts.map(font=>font.family)).size}}))
await writeFile(path.join(root,'public/favicon.svg'),svg('<path d="M8 8H29V29H8ZM35 8H56V29H35ZM8 35H29V56H8ZM35 35H56V56H35Z" fill="#28352A"/>',64,64,'Openform','#D5EF8F'))
await writeFile(path.join(root,'public/social-preview.svg'),svg(type('A good idea.','dm-sans',106,65,231,'#191A1C',{weight:500,maxWidth:1080})+type('A great identity.','instrument-serif-italic',137,63,405,'#191A1C',{maxWidth:1080})+type('OPENFORM / ORIGINAL DESIGN. OPEN POSSIBILITIES.','dm-sans',18,70,542,'#62685B',{maxWidth:1070}),1200,630,'Openform — free brand identity kits and design inspiration.','#F2F4E9'))
console.log(`\nEdition 02: ${originals.length} original visual systems, ${originals.length*files.length} primary files, ${originals.length} working themes and implementation prompts.`)
