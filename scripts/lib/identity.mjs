import { mark, type, svg, pattern, contrast } from './design.mjs'
import { artworkContent, box, path, ellipse, mix } from './artwork.mjs'

const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')
const nested=(content,x,y,w,h,vw=1200,vh=900,fit='xMidYMid meet')=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="${fit}" overflow="hidden">${content}</svg>`
const label=(text,x,y,color,size=13,align='left',width=1100)=>type(text,'dm-mono',size,x,y,color,{align,maxWidth:width})
const headline=(brand,text,x,y,size,color,width,align='left')=>type(text,brand.heading,size,x,y,color,{weight:brand.weight,tracking:size*brand.tracking/100,maxWidth:width,align})
const stamp=(brand,x,y,size,color)=>mark(brand,x,y,size,color)
const border=(x,y,w,h,color,width=1,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${color}" stroke-width="${width}"/>`
const dark=brand=>brand.system.mode==='dark'
const background=brand=>dark(brand)?brand.colors[0]:brand.system.mode==='accent'?brand.colors[1]:brand.colors[2]
const foreground=brand=>dark(brand)?brand.colors[2]:brand.colors[0]

// Forty-eight editorial compositions. Boxes describe purpose, not anonymous decorative tiles.
const compositions={
  moss:[['campaign',18,18,564,424],['package',594,18,348,528],['type',18,454,270,248],['pattern',300,454,282,248],['label',594,558,348,144]],
  orbit:[['campaign',18,18,590,450],['pattern',620,18,322,218],['web',620,248,322,454],['label',18,480,590,94],['type',18,586,590,116]],
  sora:[['campaign',18,18,402,420],['art',432,18,510,420],['stationery',18,450,474,252],['type',504,450,270,252],['palette',786,450,156,252]],
  offscript:[['campaign',18,18,590,500],['stationery',620,18,322,310],['pattern',620,340,322,178],['web',18,530,438,172],['label',468,530,474,172]],
  bloom:[['art',18,18,336,360],['campaign',366,18,576,360],['package',18,390,474,312],['type',504,390,268,312],['palette',784,390,158,312]],
  aurel:[['campaign',18,18,390,684],['stationery',420,18,522,328],['package',420,358,314,344],['pattern',746,358,196,198],['label',746,568,196,134]],
  fieldwork:[['art',18,18,624,398],['label',654,18,288,136],['type',654,166,288,250],['campaign',18,428,392,274],['stationery',422,428,310,274],['pattern',744,428,198,274]],
  neue:[['campaign',18,18,554,350],['art',584,18,358,350],['web',18,380,554,322],['palette',584,380,358,108],['type',584,500,358,202]],
  paloma:[['campaign',18,18,398,470],['package',428,18,514,470],['type',18,500,398,202],['pattern',428,500,238,202],['stationery',678,500,264,202]],
  goodkind:[['campaign',18,18,572,390],['art',602,18,340,390],['stationery',18,420,314,282],['pattern',344,420,246,282],['web',602,420,340,282]],
  relay:[['campaign',18,18,616,480],['type',646,18,296,224],['pattern',646,254,296,244],['web',18,510,616,192],['label',646,510,296,192]],
  sundaze:[['campaign',18,18,540,418],['package',570,18,372,418],['pattern',18,448,286,254],['stationery',316,448,430,254],['type',758,448,184,254]],
  onda:[['art',18,18,924,322],['campaign',18,352,404,350],['pattern',434,352,234,350],['web',680,352,262,350]],
  elsewhere:[['campaign',18,18,460,454],['art',490,18,452,454],['stationery',18,484,460,218],['package',490,484,282,218],['type',784,484,158,218]],
  formhaus:[['campaign',18,18,444,376],['art',474,18,468,376],['stationery',18,406,444,296],['pattern',474,406,238,296],['type',724,406,218,296]],
  velour:[['art',18,18,414,450],['campaign',444,18,498,450],['package',18,480,414,222],['stationery',444,480,284,222],['label',740,480,202,222]],
  kinfolk:[['campaign',18,18,578,448],['package',608,18,334,684],['pattern',18,478,278,224],['type',308,478,288,224]],
  modo:[['web',18,18,592,438],['art',622,18,320,438],['campaign',18,468,372,234],['type',402,468,208,234],['palette',622,468,320,90],['label',622,570,320,132]],
  juno:[['campaign',18,18,520,416],['art',550,18,392,416],['package',18,446,334,256],['pattern',364,446,174,256],['stationery',550,446,392,256]],
  raster:[['campaign',18,18,516,478],['art',546,18,396,478],['type',18,508,256,194],['web',286,508,424,194],['pattern',722,508,220,194]],
  commonroom:[['campaign',18,18,570,336],['stationery',600,18,342,336],['web',18,366,570,336],['art',600,366,342,222],['label',600,600,342,102]],
  caravan:[['campaign',18,18,404,684],['art',434,18,508,364],['package',434,394,276,308],['type',722,394,220,308]],
  halcyon:[['campaign',18,18,924,350],['stationery',18,380,322,322],['art',352,380,322,322],['type',686,380,256,322]],
  monument:[['campaign',18,18,504,404],['art',534,18,408,404],['type',18,434,224,268],['stationery',254,434,268,268],['web',534,434,408,268]],
  nori:[['campaign',18,18,420,364],['package',450,18,492,364],['art',18,394,294,308],['type',324,394,222,308],['pattern',558,394,384,308]],
  tandem:[['campaign',18,18,538,438],['art',568,18,374,438],['web',18,468,538,234],['stationery',568,468,230,234],['palette',810,468,132,234]],
  pebble:[['art',18,18,380,392],['campaign',410,18,532,392],['web',18,422,380,280],['type',410,422,308,280],['pattern',730,422,212,280]],
  phase:[['campaign',18,18,584,456],['art',614,18,328,456],['pattern',18,486,238,216],['web',268,486,334,216],['label',614,486,328,216]],
  almanac:[['package',18,18,350,456],['campaign',380,18,562,456],['type',18,486,350,216],['stationery',380,486,324,216],['pattern',716,486,226,216]],
  mellow:[['campaign',18,18,514,436],['art',544,18,398,436],['package',18,466,302,236],['type',332,466,200,236],['pattern',544,466,398,236]],
  'atelier-eight':[['campaign',18,18,396,392],['art',426,18,516,392],['stationery',18,422,396,280],['package',426,422,292,280],['label',730,422,212,280]],
  unfold:[['campaign',18,18,608,446],['package',638,18,304,446],['pattern',18,476,290,226],['type',320,476,306,226],['web',638,476,304,226]],
  terra:[['art',18,18,924,312],['campaign',18,342,442,360],['stationery',472,342,276,360],['type',760,342,182,360]],
  interval:[['campaign',18,18,540,372],['art',570,18,372,372],['web',18,402,540,300],['type',570,402,372,178],['label',570,592,372,110]],
  pippa:[['campaign',18,18,450,430],['package',480,18,462,430],['art',18,460,282,242],['type',312,460,282,242],['pattern',606,460,336,242]],
  vertex:[['campaign',18,18,600,424],['art',630,18,312,424],['web',18,454,600,248],['type',630,454,312,248]],
  marginalia:[['campaign',18,18,536,400],['stationery',566,18,376,400],['art',18,430,314,272],['type',344,430,210,272],['web',566,430,376,272]],
  supergood:[['campaign',18,18,496,376],['art',526,18,416,376],['stationery',18,406,288,296],['package',318,406,196,296],['pattern',526,406,416,296]],
  serein:[['campaign',18,18,366,684],['art',396,18,546,388],['stationery',396,418,308,284],['pattern',716,418,226,284]],
  assembly:[['campaign',18,18,584,386],['art',614,18,328,386],['stationery',18,416,360,286],['type',390,416,212,286],['pattern',614,416,328,286]],
  wildroot:[['campaign',18,18,430,402],['art',460,18,482,402],['package',18,432,260,270],['type',290,432,158,270],['stationery',460,432,482,270]],
  still:[['art',18,18,410,456],['campaign',440,18,502,456],['package',18,486,410,216],['type',440,486,286,216],['palette',738,486,204,216]],
  fizz:[['campaign',18,18,532,400],['package',562,18,380,400],['art',18,430,320,272],['type',350,430,200,272],['pattern',562,430,380,272]],
  axiom:[['campaign',18,18,488,420],['art',518,18,424,420],['web',18,450,488,252],['type',518,450,214,252],['pattern',744,450,198,252]],
  folio:[['campaign',18,18,568,382],['package',598,18,344,382],['stationery',18,412,346,290],['type',376,412,210,290],['art',598,412,344,290]],
  daytrip:[['campaign',18,18,528,410],['art',558,18,384,410],['stationery',18,440,298,262],['package',328,440,218,262],['type',558,440,384,262]],
  'maison-lune':[['campaign',18,18,414,438],['art',444,18,498,438],['package',18,468,244,234],['stationery',274,468,158,234],['type',444,468,276,234],['pattern',732,468,210,234]],
  outlier:[['campaign',18,18,604,416],['art',634,18,308,416],['package',18,446,350,256],['stationery',380,446,242,256],['pattern',634,446,308,256]],
}

export function campaignContent(brand,namespace='campaign') {
  const [ink,accent,paper]=brand.colors,s=brand.system,bg=background(brand),fg=foreground(brand)
  let content=box(0,0,1200,900,bg)
  if(s.alignment==='center') {
    content+=stamp(brand,566,35,68,fg)+headline(brand,brand.name,600,158,46,fg,900,'center')
    content+=s.campaign.map((line,i)=>headline(brand,line,600,270+i*94,s.family==='hospitality'?87:94,fg,1050,'center')).join('')
    content+=nested(artworkContent(brand,namespace),130,496,940,354,900,900,'xMidYMid slice')
    content+=label(s.eyebrow,600,884,fg,11,'center',1040)
  } else {
    content+=headline(brand,brand.name,59,103,62,fg,690)+label('OPENFORM ORIGINAL / EDITION 02',1141,68,fg,11,'right',500)
    content+=nested(artworkContent(brand,namespace),675,183,525,627,900,900,'xMidYMid slice')
    content+=s.campaign.map((line,i)=>headline(brand,line,58,322+i*135,s.family==='poster'?151:132,fg,602)).join('')
    content+=label(s.eyebrow,60,795,fg,12,'left',583)+path('M60 822H624',null,fg,1)
    content+=type(brand.tagline,brand.body,20,60,865,fg,{maxWidth:800})
  }
  return content
}

function typeTile(brand) {
  const [ink,accent,paper]=brand.colors
  return box(0,0,900,900,paper)+label('A VOICE OF ITS OWN',55,73,ink,16)+headline(brand,'Aa',48,506,448,ink,804)+path('M54 600H846',null,ink,1)+type('Good ideas deserve',brand.body,47,55,685,ink,{maxWidth:800})+type('a distinct voice.',brand.body,47,55,746,ink,{maxWidth:800})+box(55,806,790,29,accent)
}
function typeStrip(brand) {
  const [ink,accent,paper]=brand.colors
  return box(0,0,1600,420,paper)+headline(brand,'Aa',45,343,362,ink,449)+path('M547 48V371',null,ink,1)+label('DISPLAY / '+brand.heading.toUpperCase(),590,103,ink,18)+type('Good ideas deserve',brand.body,53,589,201,ink,{maxWidth:950})+type('a distinct voice.',brand.body,53,589,273,ink,{maxWidth:950})+box(590,332,930,22,accent)
}
function campaignPortrait(brand,namespace) {
  const s=brand.system,fg=foreground(brand),bg=background(brand)
  return box(0,0,800,1280,bg)+headline(brand,brand.name,44,101,51,fg,609)+stamp(brand,680,37,76,fg)+path('M44 144H756',null,fg,1)+s.campaign.map((line,i)=>headline(brand,line,s.alignment==='center'?400:42,289+i*121,s.family==='hospitality'?103:123,fg,711,s.alignment==='center'?'center':'left')).join('')+nested(artworkContent(brand,namespace),44,632,712,520,900,900,'xMidYMid slice')+label(s.eyebrow,45,1211,fg,10,'left',710)
}
function phoneContent(brand,namespace) {
  const [ink,accent,paper]=brand.colors,s=brand.system,bg=background(brand),fg=foreground(brand)
  return box(0,0,720,1100,bg)+headline(brand,brand.name,44,83,42,fg,505)+path('M619 47H675M619 63H675M619 79H675',null,fg,2)+path('M43 117H677',null,fg,1)+label(s.eyebrow,44,176,fg,9,'left',630)+s.headline.map((line,i)=>headline(brand,line,42,282+i*84,77,fg,638)).join('')+box(44,434,367,57,dark(brand)?accent:ink,s.button==='pill'?28:3)+type(s.cta,brand.body,17,227,472,dark(brand)?ink:paper,{align:'center',maxWidth:328})+nested(artworkContent(brand,namespace),44,527,632,451,900,900,'xMidYMid slice')+label('A COHERENT WORLD / READY TO INSTALL',45,1050,fg,11,'left',630)
}
function paletteTile(brand) {
  return brand.colors.map((color,i)=>box(0,i*225,900,225,color)+label(brand.colorNames[i].toUpperCase(),42,i*225+62,contrast(color,brand.colors[0])>=4.5?brand.colors[0]:brand.colors[2],19)+label(color,42,i*225+181,contrast(color,brand.colors[0])>=4.5?brand.colors[0]:brand.colors[2],17)).join('')
}
function labelTile(brand) {
  const [ink,accent,paper]=brand.colors
  return box(0,0,1200,600,dark(brand)?accent:ink)+stamp(brand,62,76,124,dark(brand)?ink:paper)+headline(brand,brand.name,232,211,112,dark(brand)?ink:paper,891)+path('M62 321H1138',null,dark(brand)?ink:paper,1)+label(brand.system.direction.toUpperCase(),62,391,dark(brand)?ink:paper,21)+type(brand.tagline,brand.body,31,62,488,dark(brand)?ink:paper,{maxWidth:1080})
}

export function packagingContent(brand,namespace='packaging') {
  const [ink,accent,paper,support]=brand.colors,s=brand.system
  const bottled=['moss','onda','halcyon','pebble','interval'].includes(brand.id)
  const cup=['sundaze','serein'].includes(brand.id)
  const can=brand.id==='fizz'
  const bag=['bloom','juno','velour','pippa','outlier','supergood'].includes(brand.id)
  const book=brand.category==='Publishing'||['elsewhere','marginalia','folio','daytrip'].includes(brand.id)
  const p=`${brand.id}-${namespace}`
  let content=`<defs><linearGradient id="${p}-body"><stop stop-color="${mix(ink,.12)}"/><stop offset=".28" stop-color="${ink}"/><stop offset=".8" stop-color="${mix(ink,.18,'#000000')}"/><stop offset="1" stop-color="${ink}"/></linearGradient></defs>`+box(0,0,1200,900,paper)
  content+=ellipse(650,781,349,29,mix(ink,.82,paper))+ellipse(650,788,260,14,mix(ink,.88,paper))
  if(bottled||can) {
    const x=can?425:441,w=can?350:310
    content+=box(x,can?159:225,w,523,`url(#${p}-body)`,can?42:61)+ellipse(x+w/2,can?176:225,w/2,26,ink)
    if(!can) content+=box(x+82,112,w-164,116,ink,9)+Array.from({length:12},(_,i)=>path(`M${x+88+i*11} 123V205`,null,support,1)).join('')
    if(can) content+=ellipse(x+w/2,176,128,17,paper)+ellipse(x+w/2,176,44,11,support)
    content+=box(x+10,337,w-20,280,accent)+stamp(brand,x+w/2-47,354,94,ink)+headline(brand,brand.name,x+w/2,524,68,ink,w-38,'center')+label(s.product.toUpperCase(),x+w/2,566,ink,13,'center',w-30)+label(can?'BOTANICAL SODA / A BRIGHT LITTLE MOMENT':'A CONSIDERED DAILY RITUAL',x+w/2,597,ink,8,'center',w-30)
    content+=box(198,394,176,346,support)+nested(pattern(brand,900,900,ink),207,409,158,210,900,900,'xMidYMid slice')+headline(brand,brand.name,218,688,34,ink,139)
  } else if(cup) {
    content+=path('M410 251H808L745 739H473Z',accent)+ellipse(609,251,213,42,ink)+ellipse(609,239,193,33,paper)+ellipse(609,234,158,20,ink)
    content+=Array.from({length:6},(_,i)=>box(451,396+i*42,320,14,i%2?paper:ink)).join('')+box(450,452,320,181,paper)+stamp(brand,558,465,99,ink)+headline(brand,brand.name,611,608,61,ink,296,'center')
    content+=box(181,533,198,201,support,4)+stamp(brand,244,563,72,ink)+label('A SOFTER LITTLE RITUAL',280,690,ink,8,'center',170)
  } else if(bag) {
    content+=path('M498 302V219C498 89 709 89 709 219V302',null,ink,14)+path('M468 310V242C468 132 670 132 670 242V310',null,support,7)
    content+=box(378,284,481,466,accent)+path('M859 284L912 321V731L859 750Z',support)+path('M378 750H859L809 706H425Z',mix(ink,.74,paper))
    content+=stamp(brand,541,345,145,ink)+headline(brand,brand.name,617,589,97,ink,430,'center')+type(s.productNote,brand.body,17,617,646,ink,{align:'center',maxWidth:418})
    content+=`<g transform="rotate(-10 254 657)">${box(138,571,218,153,ink)}${headline(brand,brand.name,160,657,43,paper,175)}${label('MAKE IT YOUR OWN',161,693,paper,8)}</g>`
  } else if(book) {
    content+=`<g transform="rotate(-9 650 450)">${box(409,119,407,631,ink)}${box(433,102,407,631,accent)}${box(457,102,5,631,ink)}${nested(artworkContent(brand,namespace+'-jacket'),480,155,313,315,900,900)}${headline(brand,brand.name,483,575,59,ink,313)}${label(s.product.toUpperCase(),483,634,ink,12,'left',315)}</g>`
    content+=`<g transform="rotate(8 281 603)">${box(126,412,317,310,paper)}${border(126,412,317,310,ink)}${stamp(brand,168,457,104,ink)}${label('AN INDEPENDENT POINT OF VIEW',162,665,ink,8,'left',249)}</g>`
  } else {
    content+=path('M308 280L735 137L941 281L515 439Z',accent)+path('M308 280L515 439V746L308 587Z',support)+path('M515 439L941 281V587L515 746Z',ink)
    content+=`<g transform="matrix(.94 -.35 0 1 537 461)">${stamp(brand,21,17,106,paper)}${headline(brand,brand.name,24,191,69,paper,332)}${label('CONSIDERED BY DESIGN',24,244,paper,11)}</g>`
    content+=`<g transform="rotate(-7 258 682)">${box(105,579,283,147,accent)}${headline(brand,brand.name,129,662,55,ink,228)}${label('EDITION 02 / OPENFORM ORIGINAL',130,700,ink,8)}</g>`
  }
  content+=label(s.product.toUpperCase(),52,71,ink,15,'left',1090)+label('ORIGINAL VECTOR APPLICATION / EDITION 02',1149,853,ink,11,'right')
  return content
}

export function stationeryContent(brand,namespace='stationery') {
  const [ink,accent,paper,support]=brand.colors
  return box(0,0,1200,900,mix(accent,.55,paper))+
    `<g transform="rotate(-9 427 447)">${box(131,91,503,718,mix(ink,.84,paper))}${box(118,79,503,718,paper)}${headline(brand,brand.name,157,183,61,ink,412)}${stamp(brand,527,111,55,ink)}${path('M157 227H580',null,ink,1)}${label('A DISTINCT POINT OF VIEW.',158,299,ink,13)}${[0,1,2,3,4,5,6].map(i=>box(158,347+i*24,i%3===2?260:365,3,mix(ink,.72,paper))).join('')}${type(brand.tagline,brand.heading,29,158,633,ink,{weight:brand.weight,maxWidth:370})}${path('M158 686H581',null,ink,1)}${label('OPENFORM ORIGINAL / EDITION 02',158,742,ink,10)}</g>`+
    `<g transform="rotate(8 795 311)">${box(623,123,471,293,ink)}${path('M623 123L860 285L1094 123',null,accent,1)}${stamp(brand,804,220,94,paper)}${label(brand.system.direction.toUpperCase(),859,383,paper,10,'center',390)}</g>`+
    `<g transform="rotate(-5 811 647)">${box(561,465,481,290,accent)}${headline(brand,brand.name,602,601,70,ink,396)}${path('M602 641H1002',null,ink,1)}${label(brand.tagline.toUpperCase(),602,699,ink,11,'left',399)}</g>`+
    label('STATIONERY / A COHERENT LITTLE WORLD',52,855,ink,12)
}

export function websiteContent(brand,namespace='web') {
  const [ink,accent,paper]=brand.colors,s=brand.system,bg=background(brand),fg=foreground(brand)
  let content=box(0,0,1440,960,paper)+box(0,0,1440,760,bg)+headline(brand,brand.name,63,75,39,fg,395)+path('M60 109H1380',null,fg,s.border||1)
  content+=s.nav.map((item,i)=>type(item,brand.body,14,853+i*177,65,fg,{maxWidth:168})).join('')
  if(s.alignment==='center') {
    content+=label(s.eyebrow,720,170,fg,10,'center')+s.headline.map((line,i)=>headline(brand,line,720,274+i*98,94,fg,1180,'center')).join('')
    content+=box(572,420,296,47,dark(brand)?accent:ink,s.button==='pill'?24:3)+type(s.cta,brand.body,14,720,451,dark(brand)?ink:paper,{align:'center',maxWidth:273})
    content+=nested(artworkContent(brand,namespace),264,494,912,230,900,900,'xMidYMid slice')
  } else {
    content+=label(s.eyebrow,61,213,fg,10,'left',650)+s.headline.map((line,i)=>headline(brand,line,57,345+i*113,s.family==='poster'?110:94,fg,654)).join('')
    content+=type(brand.tagline,brand.body,21,61,527,fg,{maxWidth:598})+box(61,576,322,55,dark(brand)?accent:ink,s.button==='pill'?28:3)+type(s.cta,brand.body,16,222,612,dark(brand)?ink:paper,{align:'center',maxWidth:290})
    content+=nested(artworkContent(brand,namespace),773,155,600,550,900,900,'xMidYMid slice')
  }
  content+=label('THE DETAILS MAKE THE DIFFERENCE.',61,810,ink,11)
  content+=s.features.map(([title],i)=>border(60+i*448,836,423,93,ink,1,s.family==='playful'?18:3)+type(title,brand.heading,24,80+i*448,883,ink,{weight:brand.weight,maxWidth:383})+path(`M${80+i*448} 902H${381+i*448}`,null,mix(ink,.6,paper),1)).join('')
  return content
}

function panelContent(brand,kind,namespace) {
  const [ink,accent,paper]=brand.colors
  if(kind==='campaign') return {content:campaignContent(brand,namespace),w:1200,h:900}
  if(kind==='art') return {content:artworkContent(brand,namespace),w:900,h:900}
  if(kind==='package') return {content:packagingContent(brand,namespace),w:1200,h:900}
  if(kind==='stationery') return {content:stationeryContent(brand,namespace),w:1200,h:900}
  if(kind==='web') return {content:websiteContent(brand,namespace),w:1440,h:960}
  if(kind==='type') return {content:typeTile(brand),w:900,h:900}
  if(kind==='label') return {content:labelTile(brand),w:1200,h:600}
  if(kind==='palette') return {content:paletteTile(brand),w:900,h:900}
  if(kind==='pattern') return {content:box(0,0,900,900,accent)+pattern(brand,900,900,ink),w:900,h:900}
  throw new Error(`Unknown application ${kind}`)
}

export function detailedIdentityPreview(brand) {
  const composition=compositions[brand.id]
  if(!composition) throw new Error(`Missing art-directed board for ${brand.id}`)
  const body=composition.map(([kind,x,y,w,h],i)=>{
    let panel=panelContent(brand,kind,`cover-${i}`)
    if(kind==='campaign'&&w/h<1.15) panel={content:campaignPortrait(brand,`cover-${i}-portrait`),w:800,h:1280}
    if(kind==='web'&&w/h<1.05) panel={content:phoneContent(brand,`cover-${i}-phone`),w:720,h:1100}
    if(kind==='type'&&w/h>2) panel={content:typeStrip(brand),w:1600,h:420}
    const fit=['campaign','web','type','label','stationery'].includes(kind)?'xMidYMid meet':'xMidYMid slice'
    return box(x,y,w,h,kind==='campaign'?background(brand):brand.colors[2])+nested(panel.content,x,y,w,h,panel.w,panel.h,fit)+border(x,y,w,h,brand.colors[0]+'18',.5)
  }).join('')
  return svg(body,960,720,`${brand.name} — ${brand.system.direction}: complete identity and applications`,mix(brand.colors[2],.035,brand.colors[0]))
}

export function identityBoard(brand) {
  const [ink,accent,paper]=brand.colors
  const darkPaper=brand.system.mode==='dark',base=identityPreview(brand).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'').replace(/<title[^>]*>.*?<\/title>/,'')
  const content=box(0,0,1600,1200,paper)+headline(brand,brand.name,64,101,56,ink,1010)+label('THE ESSENTIAL IDENTITY',1536,84,ink,13,'right')+path('M64 142H1536',null,ink,1)
    +nested(base,64,182,888,666,960,720)+box(984,182,552,666,accent)+stamp(brand,1149,239,214,ink)+headline(brand,'Aa',1027,666,194,ink,470)+label(brand.heading.toUpperCase(),1032,746,ink,15,'left',470)
    +box(64,880,888,251,darkPaper?accent:ink)+headline(brand,brand.name,108,1055,96,darkPaper?ink:paper,790)
    +brand.colors.map((color,i)=>box(984+i*138,880,138,174,color)).join('')+label('INK / ACCENT / PAPER / SUPPORT',985,1108,ink,12,'left',551)
  return svg(content,1600,1200,`${brand.name} essential identity: logo, typography, and palette`)
}

export function identityPreview(brand) {
  const [ink,accent,paper]=brand.colors,s=brand.system,bg=background(brand),fg=foreground(brand)
  const center=['hospitality','fashion','retro'].includes(s.family)||s.alignment==='center'
  let content=box(0,0,960,720,bg)
  if(center) {
    content+=stamp(brand,375,105,210,dark(brand)?accent:ink)+headline(brand,brand.name,480,482,156,fg,816,'center')+type(brand.tagline,brand.body,23,480,554,fg,{align:'center',maxWidth:780})
  } else {
    content+=stamp(brand,620,111,230,dark(brand)?accent:ink)+headline(brand,brand.name,63,500,s.family==='poster'?172:146,fg,826)+type(brand.tagline,brand.body,23,69,565,fg,{maxWidth:800})
  }
  content+=label(s.direction.toUpperCase(),center?480:69,651,fg,12,center?'center':'left',826)
  return svg(content,960,720,`${brand.name} — ${s.direction}: original logo and typography`)
}

export function premiumPoster(brand) {
  const [ink,accent,paper]=brand.colors,fg=foreground(brand),bg=background(brand),s=brand.system
  let content=box(0,0,800,1066,bg)+headline(brand,brand.name,43,92,47,fg,628)+stamp(brand,683,39,68,fg)+path('M43 121H757',null,fg,1)
  content+=s.campaign.map((line,i)=>headline(brand,line,39,263+i*122,s.family==='poster'?130:112,fg,716)).join('')
  content+=stamp(brand,287,664,226,dark(brand)?accent:ink)
  content+=label(s.eyebrow,44,997,fg,10,'left',710)+label('OPENFORM / ORIGINAL EDITION 02',44,1036,fg,9)
  return svg(content,800,1066,`${brand.name} art-directed campaign poster`)
}
export function premiumSocial(brand) {
  const fg=foreground(brand),glyph=dark(brand)?brand.colors[1]:fg
  return svg(box(0,0,1200,630,background(brand))+headline(brand,brand.name,54,91,50,fg,754)+brand.system.campaign.map((line,i)=>headline(brand,line,49,230+i*102,106,fg,731)).join('')+stamp(brand,879,201,242,glyph)+type(brand.tagline,brand.body,20,54,582,fg,{maxWidth:1080}),1200,630,`${brand.name} simple typographic campaign`)
}
export function socialStory(brand) { const fg=foreground(brand);return svg(box(0,0,1080,1920,background(brand))+headline(brand,brand.name,77,156,69,fg,920)+brand.system.campaign.map((line,i)=>headline(brand,line,69,425+i*180,168,fg,927)).join('')+stamp(brand,345,1110,390,dark(brand)?brand.colors[1]:fg)+type(brand.tagline,brand.body,29,80,1800,fg,{maxWidth:920}),1080,1920,`${brand.name} essential vertical campaign`) }
export function businessCards(brand) {
  const [ink,accent,paper]=brand.colors
  return svg(box(0,0,1200,900,paper)+`<g transform="rotate(-6 383 332)">${box(88,120,708,422,ink)}${stamp(brand,126,161,92,paper)}${headline(brand,brand.name,127,367,104,paper,628)}${label(brand.system.direction.toUpperCase(),130,473,paper,14)}</g>`+`<g transform="rotate(7 789 624)">${box(416,423,708,422,accent)}${headline(brand,brand.name,459,547,61,ink,627)}${path('M459 591H1079',null,ink,1)}${type(brand.tagline,brand.body,27,459,664,ink,{maxWidth:621})}${label('DESIGNED TO BE YOUR OWN.',459,785,ink,13)}</g>`,1200,900,`${brand.name} business card front and back`)
}
export function palette(brand) { return svg(paletteTile(brand),900,900,`${brand.name} named color palette`) }
export function typography(brand) { return svg(typeTile(brand),900,900,`${brand.name} display and reading typography`) }

export const iconPaths={
  arrow:'M5 12H19M13 6L19 12L13 18',plus:'M12 5V19M5 12H19',menu:'M4 6H20M4 12H20M4 18H20',close:'M6 6L18 18M18 6L6 18',
  search:'M16 16L21 21M18 10a8 8 0 1 1-16 0a8 8 0 1 1 16 0',bookmark:'M6 3H18V21L12 17L6 21Z',check:'M4 12L10 18L20 6',
  mail:'M3 5H21V19H3ZM3 5L12 13L21 5',bag:'M4 7H20V21H4ZM8 7V5a4 4 0 0 1 8 0V7',download:'M12 3V15M6 9L12 15L18 9M4 17V21H20V17',
  external:'M14 3H21V10M21 3L10 14M10 3H3V21H21V14',star:'M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z',
}
export function icons(brand) {
  const [ink,,paper]=brand.colors,strokeWidth=brand.style==='Brutalist'?2.3:brand.style==='Elegant'?1.25:1.7
  const content=box(0,0,960,720,paper)+label('A COHERENT INTERFACE LANGUAGE',42,57,ink,14)+Object.entries(iconPaths).map(([name,d],i)=>{
    const x=55+(i%4)*239,y=102+Math.floor(i/4)*196
    return `<g transform="translate(${x+62} ${y+17}) scale(3.5)"><path d="${esc(d)}" fill="none" stroke="${ink}" stroke-width="${strokeWidth}" stroke-linecap="${brand.style==='Brutalist'?'square':'round'}" stroke-linejoin="${brand.style==='Brutalist'?'miter':'round'}"/></g>`+label(name.toUpperCase(),x+106,y+134,ink,12,'center')
  }).join('')
  return svg(content,960,720,`${brand.name} twelve interface icons`)
}
