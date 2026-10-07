import * as fontkit from 'fontkit'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { drawSymbol } from './symbols.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const cache = new Map()
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function fontFor(id, weight) {
  const key = `${id}:${weight}`
  if (!cache.has(key)) {
    const font = fontkit.openSync(path.join(root, 'public/fonts', `${id}.ttf`))
    cache.set(key, font.variationAxes?.wght ? font.getVariation({ wght: weight }) : font)
  }
  return cache.get(key)
}

/** Outlined type: SVGs remain visually correct without installed fonts or network access. */
export function type(text, id, size, x, y, fill, { weight = 400, tracking = 0, align = 'left', maxWidth = Infinity } = {}) {
  const font = fontFor(id, weight)
  const run = font.layout(text)
  const scale = size / font.unitsPerEm
  const width = run.positions.reduce((total, p) => total + p.xAdvance * scale, 0) + Math.max(0, run.glyphs.length - 1) * tracking
  const squeeze = Math.min(1, maxWidth / width)
  let offset = 0
  const paths = run.glyphs.map((glyph, i) => {
    const position = run.positions[i]
    const outline = `<path d="${glyph.path.toSVG()}" transform="translate(${offset + position.xOffset * scale} ${-position.yOffset * scale}) scale(${scale} ${-scale})"/>`
    offset += position.xAdvance * scale + tracking
    return outline
  }).join('')
  const shift = align === 'center' ? width * squeeze / 2 : align === 'right' ? width * squeeze : 0
  return `<g aria-label="${esc(text)}" fill="${fill}" transform="translate(${x - shift} ${y}) scale(${squeeze})">${paths}</g>`
}

/** Every symbol has an authored silhouette; no recolored stock icons. Coordinates: 0–100. */
export function symbol(kind) {
  return drawSymbol(kind)
}

export function mark(brand, x, y, size, color, rotation = 0) {
  return `<g fill="${color}" color="${color}" transform="translate(${x} ${y}) scale(${size/100}) rotate(${rotation} 50 50)">${symbol(brand.mark)}</g>`
}

const rect = (x,y,w,h,fill,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`
const rule = (x1,y1,x2,y2,color,width=1) => `<path d="M${x1} ${y1}H${x2}V${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`

export function pattern(brand, width = 960, height = 720, color = brand.colors[0]) {
  const organic = ['contours','waves','strata','ripples'].includes(brand.pattern)
  if (organic) {
    return `<g fill="none" stroke="${color}" stroke-width="${brand.pattern === 'ripples' ? 2 : 3}">${Array.from({length:16},(_,i)=> brand.pattern === 'ripples'
      ? `<ellipse cx="${width*.5}" cy="${height*.5}" rx="${35+i*42}" ry="${20+i*28}"/>`
      : `<path d="M-80 ${i*55-100}C${width*.25} ${i*55-260} ${width*.48} ${i*55+180} ${width*.73} ${i*55-20}S${width+120} ${i*55+40} ${width+180} ${i*55-60}"/>`).join('')}</g>`
  }
  if (['stripes','bars','intervals','rules'].includes(brand.pattern)) {
    const gap = brand.pattern === 'stripes' ? 58 : brand.pattern === 'rules' ? 46 : 90
    return `<g stroke="${color}" stroke-width="${brand.pattern === 'rules' ? 2 : 22}">${Array.from({length:Math.ceil(height/gap)},(_,i)=>`<path d="M0 ${i*gap+20}H${width}"/>`).join('')}</g>`
  }
  if (['lattice','frames','blocks','assemblies','pixels','displacements','folds','corners','annotations'].includes(brand.pattern)) {
    return `<g fill="none" stroke="${color}" stroke-width="2">${Array.from({length:7},(_,i)=>`<path d="M${i*160} 0V${height}"/>`).join('')}${Array.from({length:5},(_,i)=>`<path d="M0 ${i*180}H${width}"/>`).join('')}</g><g opacity=".8">${Array.from({length:12},(_,i)=>mark(brand,(i%4)*250+45,Math.floor(i/4)*245+55,110,color,i%2?180:0)).join('')}</g>`
  }
  if (['rays','vectors','slashes','chevrons','triangles'].includes(brand.pattern)) {
    return `<g>${Array.from({length:12},(_,i)=>mark(brand,(i%4)*250+5,Math.floor(i/4)*260-30,180,color,(i%2)*180)).join('')}</g>`
  }
  const sparse = ['orbits','portals','arches','ribbons','moons','windows','diamonds'].includes(brand.pattern)
  const size = sparse ? 190 : 105
  const stepX = sparse ? 320 : 160
  const stepY = sparse ? 260 : 170
  return `<g>${Array.from({length:sparse?12:35},(_,i)=> {
    const columns = sparse ? 4 : 7
    return mark(brand,(i%columns)*stepX + (Math.floor(i/columns)%2?stepX/2:0)-20,Math.floor(i/columns)*stepY-25,size,color,sparse?0:(i%3-1)*18)
  }).join('')}</g>`
}

export function svg(content, width, height, title, background) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title>${background ? rect(0,0,width,height,background) : ''}${content}</svg>`
}

export function preview(brand) {
  const [ink, accent, paper, extra] = brand.colors
  let bg = accent, fg = ink, art = ''
  const title = (x,y,size=125,align='left',fill=fg,maxWidth=850) => type(brand.name,brand.heading,size,x,y,fill,{weight:brand.weight,tracking:brand.tracking,align,maxWidth})
  const label = (text,x,y,fill=fg,align='left',size=15) => type(text,'dm-mono',size,x,y,fill,{align,maxWidth:840})
  const tagline = (x,y,fill=fg,align='left') => type(brand.tagline,brand.body,20,x,y,fill,{align,maxWidth:830})
  switch (brand.layout) {
    case 'botanical': bg=ink;fg=accent;art=mark(brand,450,-55,540,accent)+title(57,551,160)+tagline(62,602,accent)+label('BOTANICAL GOODS / NATURALLY BETTER',62,66,accent); break
    case 'orbital': art=mark(brand,435,50,470,ink,-10)+title(58,565,163)+tagline(63,619)+label('SPACE FOR YOUR NEXT BIG IDEA',60,62); break
    case 'architectural': art=rect(320,0,320,720,paper)+mark(brand,345,86,270,ink)+title(480,560,122,'center')+label('SPACES / STRUCTURES / POSSIBILITIES',480,633,ink,'center')+rule(45,680,915,680,ink); break
    case 'offset': art=mark(brand,60,45,295,ink)+label('INDEPENDENT BY DESIGN',903,66,ink,'right')+title(47,553,125)+rect(50,578,270,37,ink)+label('CREATIVE STUDIO / NO. 004',63,602,accent, 'left',13)+mark(brand,735,620,120,ink); break
    case 'sticker': art=mark(brand,300,36,355,ink)+rect(100,460,760,143,paper,72)+title(480,570,126,'center')+tagline(480,653,ink,'center'); break
    case 'luxury': bg=paper;art=`<rect x="38" y="38" width="884" height="644" fill="none" stroke="${ink}" stroke-width="1"/>`+mark(brand,369,75,222,ink)+title(480,483,131,'center')+tagline(480,541,ink,'center')+label('A SMALL HOTEL. AN EXTRAORDINARY STAY.',480,642,ink,'center',12); break
    case 'landscape': bg=paper;art=`<g opacity=".24">${pattern(brand,960,450,ink)}</g>`+rect(0,440,960,280,ink)+mark(brand,45,43,190,ink)+title(50,588,116,'left',paper)+tagline(57,650,paper)+label('OUT THERE IS WHERE IT STARTS.',905,63,ink,'right',13); break
    case 'swiss': bg=paper;art=rect(0,0,380,720,accent)+mark(brand,70,100,240,ink)+title(416,350,142)+tagline(420,412)+rule(418,590,910,590,ink)+label('01 / A MORE USEFUL WAY',420,631); break
    case 'editorial': bg=paper;art=rect(620,0,340,720,accent)+mark(brand,670,150,240,ink)+label('INDEPENDENT WORDS / OPEN WORLDS',48,62)+title(45,419,130)+tagline(50,478)+rule(50,605,572,605,ink)+label('THE STORIES ARE JUST BEGINNING.',50,639,ink,'left',13); break
    case 'bubble': art=mark(brand,280,45,400,ink)+title(480,547,127,'center')+tagline(480,609,ink,'center')+rect(331,641,298,34,paper,17)+label('GOOD PEOPLE. GOOD POSSIBILITIES.',480,663,ink,'center',12); break
    case 'terminal': bg=ink;fg=accent;art=label('STATUS: OPEN / SIGNAL: STRONG',55,58,accent)+rule(55,85,905,85,accent)+mark(brand,540,126,345,accent)+title(51,535,118)+tagline(56,597,accent)+label('> CONNECT. BUILD. KEEP MOVING.',57,665,accent); break
    case 'retro': art=mark(brand,333,45,295,ink)+title(480,478,137,'center')+tagline(480,542,ink,'center')+rule(100,594,860,594,ink,2)+label('GOOD COFFEE / GREAT COMPANY / NO HURRY',480,640,ink,'center',13); break
    case 'tidal': bg=paper;art=`<g opacity=".6">${pattern(brand,960,720,accent)}</g>`+mark(brand,385,115,190,ink)+title(480,434,157,'center')+tagline(480,502,ink,'center')+label('MOVE WITH THE MOMENT.',480,654,ink,'center'); break
    case 'postcard': bg=paper;art=rect(48,48,864,540,accent)+mark(brand,680,104,173,ink)+title(94,419,117)+tagline(100,477)+label('GO SLOW. LOOK CLOSER.',58,661)+label('A JOURNAL FOR THE JOURNEY',900,661,ink,'right',13); break
    case 'modular': bg=ink;fg=paper;art=rect(0,0,320,358,accent)+mark(brand,46,37,270,ink)+rule(320,0,320,720,paper)+rule(0,360,960,360,paper)+title(36,541,112)+label('FURNITURE / FORM / FUNCTION',50,654,paper)+label('BUILT FROM THE GROUND UP',370,74,paper); break
    case 'fashion': bg=paper;art=rect(48,48,864,624,accent)+mark(brand,530,4,398,ink)+title(480,470,149,'center')+tagline(480,530,ink,'center')+label('SLOWLY MADE / OFTEN WORN',480,635,ink,'center',12); break
    case 'pantry': art=`<rect x="52" y="50" width="856" height="620" rx="165" fill="none" stroke="${ink}" stroke-width="3"/>`+mark(brand,395,95,170,ink)+title(480,451,146,'center')+tagline(480,516,ink,'center')+label('SEASONAL / LOCAL / FULL OF GOOD',480,595,ink,'center',13); break
    case 'precision': bg=paper;art=rect(580,0,380,720,ink)+mark(brand,640,205,255,accent)+title(48,348,138)+tagline(55,410)+label('MORE CLARITY. MORE CONTROL.',55,651,ink,'left',13); break
    case 'dots': art=rect(0,0,480,720,ink)+mark(brand,490,65,405,paper)+title(52,497,158,'left',accent)+tagline(57,560,accent)+label('EVERY VERSION OF YOU.',56,661,accent); break
    case 'pixel': bg=ink;fg=accent;art=`<g opacity=".1">${pattern(brand,960,720,paper)}</g>`+mark(brand,623,85,250,accent)+label('DESIGN + CODE + MOTION',52,68,paper)+title(50,493,126)+tagline(56,556,paper)+rule(55,638,910,638,paper)+label('FRAME 001 / ENDLESS RESOLUTION',56,675,paper, 'left',12); break
    case 'noticeboard': bg=paper;art=rect(45,45,870,174,ink)+title(80,163,87,'left',paper)+mark(brand,100,297,265,ink)+tagline(435,376)+label('COME IN. THERE IS ROOM.',435,430)+rule(45,582,915,582,ink)+label('YOUR NEIGHBORHOOD / YOUR POSSIBILITY',50,645); break
    case 'badge': art=`<rect x="110" y="60" width="740" height="600" rx="220" fill="none" stroke="${ink}" stroke-width="3"/>`+mark(brand,394,98,180,ink)+title(480,453,150,'center')+tagline(480,520,ink,'center')+label('TAKE THE ROAD LESS HURRIED.',480,588,ink,'center',13); break
    case 'serene': bg=paper;art=mark(brand,580,-120,545,accent)+mark(brand,391,139,178,ink)+title(480,452,142,'center')+tagline(480,510,ink,'center')+label('REST / RESET / RETURN',480,639,ink,'center',13); break
    case 'concrete': art=mark(brand,611,53,283,ink)+label('MATTER. MATERIAL. MEANING.',49,65)+title(42,514,112)+rule(48,565,914,565,ink,4)+tagline(53,633)+label('ARCHITECTURE / URBAN DESIGN',900,668,ink,'right',12); break
    case 'bento': bg=paper;art=rect(35,35,550,650,accent,brand.radius)+rect(605,35,320,315,extra,brand.radius)+rect(605,370,320,315,ink,brand.radius)+mark(brand,640,85,250,ink)+title(85,376,153)+tagline(90,437)+label('PLANTS FIRST. ALWAYS FRESH.',90,635,ink,'left',12)+mark(brand,680,440,150,paper); break
    case 'connected': art=mark(brand,105,70,380,ink)+mark(brand,475,70,380,ink)+title(480,521,142,'center')+tagline(480,588,ink,'center')+label('SHARED JOURNEYS / BETTER DAYS',480,662,ink,'center',13); break
    case 'scattered': bg=paper;art=mark(brand,-60,-30,335,accent,10)+mark(brand,690,470,330,extra,-20)+mark(brand,630,25,195,ink,17)+title(480,407,145,'center')+tagline(480,472,ink,'center')+label('ONE SMALL THING AT A TIME.',480,623,ink,'center'); break
    case 'diagonal': bg=ink;fg=accent;art='<path d="M490 0H960V360L700 720H490L750 360Z" fill="'+accent+'"/>'+mark(brand,610,105,215,ink)+title(46,483,143)+tagline(54,550,paper)+label('BUILD THE NEXT VERSION.',52,659,accent); break
    case 'index': bg=paper;art=rule(53,110,907,110,ink)+label('VOLUME 01 / NOTES ON THE EVERYDAY',54,66)+mark(brand,740,152,130,ink)+title(50,415,122)+tagline(57,472)+rule(54,586,907,586,ink)+label('OBSERVE / RECORD / REDISCOVER',54,635); break
    case 'groovy': art=mark(brand,383,32,195,ink)+mark(brand,57,322,125,extra)+mark(brand,760,338,140,ink)+title(480,446,160,'center')+tagline(480,514,ink,'center')+label('GOOD DAYS, AT YOUR OWN PACE.',480,635,ink,'center',13); break
    case 'atelier': bg=paper;art=rect(650,0,310,720,accent)+mark(brand,680,204,250,ink)+label('OBJECTS / EDITIONS / POSSIBILITIES',53,69)+title(51,400,103)+tagline(57,461)+rule(54,597,601,597,ink)+label('EDITION 008 / MADE WITH INTENTION',55,648,ink,'left',13); break
    case 'folded': art='<path d="M600 0H960V350L600 0Z" fill="'+paper+'"/>'+rule(600,0,600,720,ink,2)+mark(brand,64,63,230,ink)+title(46,535,133)+tagline(55,599)+label('NEW THOUGHTS / NO FIXED FORMAT',54,668,ink,'left',13); break
    case 'strata': bg=paper;art=rect(0,0,960,195,accent)+rect(0,540,960,180,ink)+mark(brand,714,228,176,ink)+title(55,428,155)+tagline(60,487)+label('PLACE / MATERIAL / PURPOSE',59,646,paper); break
    case 'spacious': bg=paper;art=mark(brand,427,116,108,ink)+title(480,420,134,'center')+tagline(480,481,ink,'center')+label('TAKE A MOMENT.',480,649,ink,'center'); break
    case 'gift': art=rect(0,313,960,90,paper)+rect(435,0,90,720,paper)+mark(brand,327,85,305,ink)+rect(140,451,680,146,paper,50)+title(480,567,155,'center')+tagline(480,652,ink,'center'); break
    case 'kinetic': bg=ink;fg=paper;art=mark(brand,485,-50,520,accent)+title(47,512,124)+tagline(55,577,paper)+rule(55,626,901,626,accent)+label('DIRECTION: FORWARD',56,670,accent); break
    case 'margins': bg=paper;art=rect(0,0,230,720,accent)+label('NOTES',36,62)+mark(brand,42,145,146,ink)+rule(255,42,255,679,ink)+title(287,388,104)+tagline(293,452)+label('A STUDIO FOR THE THOUGHTFUL.',292,652,ink,'left',13); break
    case 'checker': art=rect(0,0,960,84,paper)+Array.from({length:12},(_,i)=>rect(i*80,i%2?0:42,80,42,ink)).join('')+mark(brand,382,132,198,ink)+title(480,474,125,'center')+tagline(480,537,ink,'center')+label('MAKE SOMETHING / MEET SOMEONE',480,643,ink,'center',13); break
    case 'nocturne': bg=ink;fg=paper;art=mark(brand,650,55,230,accent)+title(480,442,126,'center')+tagline(480,504,paper,'center')+rule(205,571,755,571,accent)+label('TEA / CONVERSATION / THE SMALL HOURS',480,638,accent,'center',12); break
    case 'public': art=mark(brand,654,36,230,ink)+label('OPEN TO EVERYONE',45,62)+title(39,463,161)+rule(45,511,914,511,ink,3)+tagline(52,582)+label('BRING YOUR PART TO THE WHOLE.',51,656); break
    case 'rooted': bg=paper;art=rect(0,0,300,720,accent)+mark(brand,32,147,230,ink)+title(342,354,114)+tagline(349,415)+label('TOOLS FOR THINGS THAT GROW.',347,639,ink,'left',13); break
    case 'essential': bg=paper;art=mark(brand,329,92,302,accent)+title(480,448,168,'center')+tagline(480,511,ink,'center')+label('FEWER THINGS / BETTER THINGS',480,645,ink,'center',13); break
    case 'pop': art=mark(brand,662,58,264,ink)+mark(brand,-64,390,330,paper)+title(480,446,188,'center')+tagline(480,509,ink,'center')+label('REAL FRUIT / GOOD SPIRITS',480,644,ink,'center'); break
    case 'blueprint': art=`<g opacity=".18" stroke="${ink}" stroke-width="1">${Array.from({length:13},(_,i)=>`<path d="M${i*80} 0V720M0 ${i*60}H960"/>`).join('')}</g>`+mark(brand,361,67,238,ink)+title(480,478,126,'center')+tagline(480,539,ink,'center')+label('OPEN RESEARCH / SHARED DISCOVERY',480,653,ink,'center',13); break
    case 'folio': bg=paper;art=rect(0,0,960,160,accent)+mark(brand,785,208,115,ink)+title(50,422,160)+tagline(57,486)+rule(57,583,903,583,ink)+label('WORK / WORDS / AN INDEPENDENT VIEW',58,639,ink,'left',13); break
    case 'ticket': art=`<rect x="46" y="50" width="868" height="620" rx="35" fill="none" stroke="${ink}" stroke-width="2"/>`+mark(brand,389,86,178,ink)+title(480,451,140,'center')+tagline(480,516,ink,'center')+rule(46,571,914,571,ink)+label('VALID FOR ONE VERY GOOD DAY',480,629,ink,'center',13); break
    case 'maison': bg=paper;art=rect(50,49,860,620,accent)+mark(brand,405,87,150,ink)+title(480,423,104,'center')+tagline(480,487,ink,'center')+label('ROOMS / TABLE / MOMENTS',480,606,ink,'center',13); break
    case 'disruption': art=mark(brand,67,47,258,ink)+rect(560,0,400,270,paper)+title(42,511,173)+tagline(50,582)+label('NO STANDARD ISSUE.',52,665)+label('INDEPENDENT / 001',892,226,ink,'right',13); break
    default: throw new Error(`Unknown layout ${brand.layout}`)
  }
  return svg(art,960,720,`${brand.name} — ${brand.tagline}`,bg)
}

export function logo(brand, mode='lockup') {
  const ink=brand.colors[0]
  if(mode==='mark') return svg(mark(brand,10,10,180,ink),200,200,`${brand.name} symbol`)
  if(mode==='mono') return svg(mark(brand,15,25,150,'#202020')+type(brand.name,brand.heading,92,200,137,'#202020',{weight:brand.weight,tracking:brand.tracking,maxWidth:735}),960,200,`${brand.name} monochrome logo`)
  if(mode==='wordmark') return svg(type(brand.name,brand.heading,125,480,154,ink,{weight:brand.weight,tracking:brand.tracking,align:'center',maxWidth:880}),960,220,`${brand.name} wordmark`)
  return svg(mark(brand,15,25,150,ink)+type(brand.name,brand.heading,92,200,137,ink,{weight:brand.weight,tracking:brand.tracking,maxWidth:735}),960,200,`${brand.name} logo lockup`)
}

export function poster(brand) {
  const [ink,accent,paper]=brand.colors
  const parts=brand.tagline.replace(/[.!]$/,'').split(' ')
  const lines=[]
  let current=''
  for(const word of parts) { if((current+' '+word).trim().length>19&&current){lines.push(current);current=word}else current=(current+' '+word).trim() }
  if(current) lines.push(current)
  return svg(type('OPENFORM / INDEPENDENT IDENTITIES','dm-mono',13,48,55,ink)+mark(brand,270,115,260,ink)+lines.map((text,i)=>type(text,brand.heading,68,48,489+i*85,ink,{weight:brand.weight,maxWidth:704})).join('')+rule(48,920,752,920,ink)+type(brand.name,brand.heading,45,48,981,ink,{weight:brand.weight,tracking:brand.tracking,maxWidth:570})+type('01 / YOUR NEXT CHAPTER', 'dm-mono',12,752,1013,ink,{align:'right'}),800,1066,`${brand.name} display poster`,accent)
}

export function social(brand) {
  const [ink,accent,paper]=brand.colors
  return svg(rect(800,0,400,630,accent)+mark(brand,838,152,320,ink)+type(brand.name,brand.heading,116,65,272,ink,{weight:brand.weight,tracking:brand.tracking,maxWidth:690})+type(brand.tagline,brand.body,28,70,345,ink,{maxWidth:650})+type('AN INDEPENDENT POINT OF VIEW','dm-mono',14,70,561,ink),1200,630,`${brand.name} social sharing card`,paper)
}

export function contrast(a,b) {
  const luminance=hex=>{ const values=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*values[0]+.7152*values[1]+.0722*values[2] }
  const l1=luminance(a),l2=luminance(b)
  return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)
}
