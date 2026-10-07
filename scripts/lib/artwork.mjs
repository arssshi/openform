import { svg } from './design.mjs'

export const box=(x,y,w,h,fill,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`
export const path=(d,fill,stroke,width=1)=>`<path d="${d}" fill="${fill||'none'}"${stroke?` stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`:''}/>`
export const ellipse=(x,y,rx,ry,fill,stroke,width=1)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill||'none'}"${stroke?` stroke="${stroke}" stroke-width="${width}"`:''}/>`
export function mix(hex,amount,target='#FFFFFF') { const a=hex.slice(1).match(/../g).map(v=>parseInt(v,16)),b=target.slice(1).match(/../g).map(v=>parseInt(v,16));return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*amount).toString(16).padStart(2,'0')).join('') }
const poly=(points,fill,stroke)=>`<polygon points="${points}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="2"`:''}/>`

function leaf(x,y,size,color,angle=0) {
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${size/300})">${path('M0 0C-160-150-104-341 18-403C160-317 163-101 0 0Z',color)}${path('M0 0L18-365',null,mix(color,.25),2)}${Array.from({length:8},(_,i)=>path(`M${i*2} ${-45-i*35}L${i%2?60:-61} ${-89-i*38}`,null,mix(color,.25),1)).join('')}</g>`
}
function isoBlock(x,y,w,h,depth,top,left,right) {
  return poly(`${x},${y} ${x+w},${y-depth} ${x+w+depth},${y} ${x+depth},${y+depth}`,top)+poly(`${x},${y} ${x+depth},${y+depth} ${x+depth},${y+h+depth} ${x},${y+h}`,left)+poly(`${x+depth},${y+depth} ${x+w+depth},${y} ${x+w+depth},${y+h} ${x+depth},${y+h+depth}`,right)
}

/** A single clear idea per illustration. Flat color, generous space, no visual noise. */
export function artworkContent(brand) {
  const [ink,accent,paper,support]=brand.colors
  let bg=paper,art=''
  switch(brand.id) {
    case 'moss': bg=ink;art=path('M430 765C168 598 217 244 651 133C748 424 612 702 430 765Z',accent)+path('M432 769L602 246',null,paper,3);break
    case 'orbit': bg=accent;art=ellipse(450,450,202,202,ink)+`<g transform="rotate(-28 450 450)">${ellipse(450,450,333,119,null,paper,10)}</g>`+ellipse(737,294,24,24,ink);break
    case 'sora': art=box(198,179,504,550,accent)+path('M313 729V383a137 137 0 0 1 274 0v346Z',ink)+box(344,419,212,310,paper);break
    case 'offscript': bg=accent;art=poly('143,297 700,156 755,339 198,480',ink)+poly('188,557 745,416 789,584 231,725',paper);break
    case 'bloom': bg=accent;art=`<g transform="translate(450 450)">${Array.from({length:5},(_,i)=>`<ellipse cx="0" cy="-137" rx="96" ry="174" fill="${paper}" transform="rotate(${i*72})"/>`).join('')}${ellipse(0,0,74,74,ink)}</g>`;break
    case 'aurel': art=path('M206 739V393a244 244 0 0 1 488 0v346Z',accent)+path('M294 739V428a156 156 0 0 1 312 0v311Z',ink)+ellipse(450,430,58,58,paper);break
    case 'fieldwork': bg=paper;art=poly('106,691 305,277 491,538 639,365 794,691',support)+poly('106,691 338,469 565,692',ink)+path('M271 728C446 609 512 641 685 561',null,accent,9);break
    case 'neue': art=poly('216,312 450,166 686,312 450,459',accent)+poly('216,312 450,459 450,747 216,601',ink)+poly('450,459 686,312 686,601 450,747',support);break
    case 'paloma': bg=accent;art=poly('169,244 450,407 325,708',paper)+poly('450,407 730,201 627,520',ink)+poly('450,407 627,520 527,704',support);break
    case 'goodkind': bg=accent;art=path('M232 686C87 309 310 123 449 318L362 402C278 292 236 418 342 615Z',ink)+path('M668 686C813 309 590 123 451 318L538 402C622 292 664 418 558 615Z',paper);break
    case 'relay': bg=ink;art=path('M140 525H288V416H450V304H612V195H760',null,accent,42)+ellipse(760,195,22,22,paper);break
    case 'sundaze': art=path('M154 478a296 296 0 0 1 592 0Z',accent)+box(154,519,592,32,ink)+box(206,595,488,24,ink)+box(279,663,342,16,ink);break
    case 'onda': art=path('M111 556C223 236 354 217 457 429S660 651 789 307',null,accent,94)+path('M111 678C231 420 358 434 463 600S681 741 789 503',null,ink,3);break
    case 'elsewhere': art=box(192,151,516,602,accent)+path('M300 753V401a150 150 0 0 1 300 0v352Z',ink)+ellipse(450,413,50,50,paper)+path('M300 623L430 503L600 633V753H300Z',support);break
    case 'formhaus': bg=ink;art=isoBlock(254,220,297,198,63,paper,accent,support)+isoBlock(254,418,297,53,63,paper,support,accent)+box(254,481,30,249,accent)+box(584,448,30,250,paper);break
    case 'velour': art=path('M305 714C74 371 324 141 548 196C747 245 650 499 440 498L441 375C549 380 581 286 503 276C370 252 235 435 395 643Z',accent)+path('M440 498L606 722L716 638L521 409Z',ink);break
    case 'kinfolk': bg=accent;art=path('M445 764V185',null,ink,12)+path('M445 448C207 433 199 244 233 207C416 203 470 318 445 448Z',ink)+path('M450 337C444 176 638 150 676 178C687 292 592 350 450 337Z',paper);break
    case 'modo': art=isoBlock(212,262,177,360,46,accent,ink,support)+isoBlock(469,393,177,229,46,accent,ink,support);break
    case 'juno': bg=ink;art=ellipse(329,334,191,191,accent)+ellipse(628,531,142,142,paper)+ellipse(282,676,77,77,support);break
    case 'raster': bg=ink;art=box(194,194,512,512,accent)+box(306,306,288,288,ink)+box(650,150,70,70,paper);break
    case 'commonroom': art=ellipse(450,450,204,145,ink)+box(214,211,107,116,accent,18)+box(579,211,107,116,support,18)+box(214,573,107,116,support,18)+box(579,573,107,116,accent,18);break
    case 'caravan': bg=accent;art=ellipse(620,296,62,62,paper)+path('M131 678L339 261L532 566L665 429L769 678Z',ink)+path('M441 760C601 589 349 614 492 474',null,paper,24);break
    case 'halcyon': art=ellipse(450,450,270,270,accent)+ellipse(450,450,193,193,paper)+ellipse(450,450,112,112,support);break
    case 'monument': bg=accent;art=isoBlock(212,524,414,111,62,paper,ink,support)+isoBlock(300,265,238,256,52,paper,ink,support);break
    case 'nori': art=box(174,174,552,552,accent,28)+box(199,199,277,277,paper,12)+box(501,199,200,277,ink,12)+box(199,501,502,200,support,12);break
    case 'tandem': art=ellipse(331,450,158,213,null,ink,43)+ellipse(569,450,158,213,null,accent,43);break
    case 'pebble': art=path('M186 654C171 526 463 498 663 569C834 646 606 780 362 731C265 721 202 697 186 654Z',ink)+path('M299 413C231 264 459 164 590 272C743 409 435 532 299 413Z',accent);break
    case 'phase': bg=ink;art=poly('165,451 506,177 732,364 391,638',accent)+poly('391,638 732,364 732,445 391,719',paper);break
    case 'almanac': art=poly('216,224 450,304 450,719 216,638',ink)+poly('450,304 684,224 684,638 450,719',accent)+path('M450 304V719',null,paper,4);break
    case 'mellow': bg=accent;art=`<g transform="translate(450 450)">${Array.from({length:8},(_,i)=>`<rect x="-43" y="-299" width="86" height="208" rx="43" fill="${paper}" transform="rotate(${i*45})"/>`).join('')}${ellipse(0,0,117,117,ink)}</g>`;break
    case 'atelier-eight': art=poly('450,159 699,323 657,672 450,756 243,672 201,323',accent)+poly('450,159 450,756 243,672 201,323',ink)+poly('450,159 699,323 450,453 201,323',support);break
    case 'unfold': bg=accent;art=poly('179,227 368,157 529,249 721,170 721,657 529,738 368,646 179,716',paper)+poly('368,157 529,249 529,738 368,646',ink);break
    case 'terra': art=path('M135 438C332 221 530 418 765 196V324C530 546 332 349 135 566Z',accent)+path('M135 602C332 385 530 582 765 360V488C530 710 332 513 135 730Z',ink);break
    case 'interval': art=box(218,188,164,523,accent)+box(518,188,164,523,ink);break
    case 'pippa': bg=accent;art=path('M441 421C145 89 68 338 239 437C351 502 436 479 441 421Z',paper)+path('M459 421C755 89 832 338 661 437C549 502 464 479 459 421Z',paper)+path('M416 466L277 739L423 699L450 571L477 699L623 739L484 466Z',ink)+ellipse(450,446,57,57,ink);break
    case 'vertex': bg=ink;art=poly('175,650 489,193 724,248 410,704',paper)+poly('410,704 724,248 724,327 410,783',accent);break
    case 'marginalia': art=box(202,171,471,579,accent)+box(245,150,471,579,paper)+path('M352 291H310V592H352M607 291H650V592H607',null,ink,10);break
    case 'supergood': bg=accent;art=path('M168 437L324 291L426 399L610 188L740 307L426 700Z',ink);break
    case 'serein': bg=ink;art=path('M223 386H632C629 644 565 707 427 707C289 707 226 644 223 386Z',accent)+path('M632 421C807 371 799 606 616 582',null,accent,26)+ellipse(427,386,204,37,paper)+ellipse(651,197,60,60,paper)+ellipse(673,176,61,61,ink);break
    case 'assembly': bg=accent;art=box(208,208,207,207,ink)+box(485,208,207,207,paper)+box(208,485,207,207,support)+box(485,485,207,207,ink);break
    case 'wildroot': art=path('M450 174V760M450 326L270 227M450 475L671 302M450 625L233 456M450 704L641 592',null,ink,12)+ellipse(450,191,78,78,accent);break
    case 'still': art=path('M225 328C225 197 675 197 675 328L629 689C612 749 288 749 271 689Z',accent)+ellipse(450,328,225,105,ink)+ellipse(450,328,151,64,paper);break
    case 'fizz': bg=accent;art=ellipse(450,450,230,230,paper)+`<g transform="translate(450 450)">${Array.from({length:6},(_,i)=>`<path d="M0 0L0-188A188 188 0 0 1 163-94Z" fill="${ink}" transform="rotate(${i*60})"/>`).join('')}</g>`+ellipse(450,450,33,33,paper);break
    case 'axiom': art=poly('450,172 724,648 617,648 450,360 283,648 176,648',ink)+box(303,586,294,62,accent);break
    case 'folio': art=box(195,205,434,549,ink)+box(270,147,434,549,accent)+box(300,180,374,486,paper)+poly('350,530 482,320 624,530',ink);break
    case 'daytrip': art=box(165,213,570,474,accent)+ellipse(610,326,48,48,paper)+path('M165 590L335 326L565 589L660 435L735 590V687H165Z',ink);break
    case 'maison-lune': art=path('M236 748V382a214 214 0 0 1 428 0v366Z',accent)+path('M450 176V748M236 430H664',null,ink,10)+ellipse(548,332,45,45,paper);break
    case 'outlier': bg=accent;art=box(197,197,345,345,ink)+box(358,358,345,345,paper)+box(408,408,245,245,ink);break
    default: throw new Error(`No original illustration for ${brand.id}`)
  }
  return box(0,0,900,900,bg)+art
}

/** Preserved construction studies; the current library uses the essential illustrations above. */
export function detailedArtworkContent(brand,namespace='master') {
  const [ink,accent,paper,support]=brand.colors
  const p=`${brand.id}-${namespace}`
  const g=n=>`url(#${p}-${n})`
  const light=mix(accent,.4),dark=mix(ink,.22,'#000000')
  const defs=`<defs><linearGradient id="${p}-silk" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="${light}"/><stop offset=".42" stop-color="${accent}"/><stop offset="1" stop-color="${ink}"/></linearGradient><linearGradient id="${p}-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${paper}"/><stop offset=".34" stop-color="${accent}"/><stop offset=".49" stop-color="${paper}"/><stop offset=".57" stop-color="${support}"/><stop offset="1" stop-color="${ink}"/></linearGradient><radialGradient id="${p}-orb" cx=".32" cy=".25" r=".75"><stop stop-color="${paper}"/><stop offset=".25" stop-color="${light}"/><stop offset=".62" stop-color="${accent}"/><stop offset="1" stop-color="${ink}"/></radialGradient><linearGradient id="${p}-shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="${dark}"/></linearGradient><pattern id="${p}-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="${ink}" opacity=".12"/></pattern></defs>`
  const shadow=(x=450,y=767,rx=268,ry=32)=>ellipse(x,y,rx,ry,ink)+`<g opacity=".15">${ellipse(x,y+14,rx*.88,ry*.42,ink)}</g>`
  let art='',bg=paper
  switch(brand.id) {
    case 'moss':
      bg=ink;art=`<g opacity=".16">${ellipse(790,160,340,340,support)}${ellipse(70,780,300,300,support)}</g>`+leaf(434,828,510,accent,-17)+leaf(616,827,352,support,33)+leaf(311,812,300,mix(accent,.25),-52)+path('M419 896C411 691 473 457 551 256',null,paper,3)+`<g opacity=".22">${box(0,0,900,900,g('dots'))}</g>`;break
    case 'orbit':
      bg=accent;art=`<g transform="rotate(-28 450 450)">${ellipse(450,455,362,141,null,ink,2)}${ellipse(450,455,335,190,null,paper,10)}${ellipse(450,455,257,350,null,ink,2)}${ellipse(450,455,240,240,g('orb'))}${ellipse(771,391,57,57,g('orb'))}${ellipse(113,485,22,22,support)}${ellipse(450,455,380,220,null,paper,2)}</g>`+path('M42 790H208M694 91H858',null,ink,1);break
    case 'sora':
      bg=accent;art=ellipse(464,781,321,52,mix(ink,.68,paper))+isoBlock(165,272,478,414,100,paper,mix(ink,.5,paper),light)+path('M351 764V465C351 262 591 227 591 436V717Z',ink)+path('M385 741V482C385 323 552 302 552 457V703Z',support)+path('M407 727V487C407 363 529 351 529 473V699Z',dark)+poly('265,786 412,755 642,886 493,900',light)+path('M98 157H713M713 157V628M98 147V167M703 157H723',null,ink,1);break
    case 'offscript':
      bg=accent;art=box(78,74,744,744,paper)+poly('94,265 760,101 819,318 155,482',ink)+poly('146,516 796,352 807,566 185,750',ink)+poly('0,695 403,572 499,900 0,900',support)+`<g transform="rotate(13 450 450)">${Array.from({length:7},(_,i)=>box(120+i*91,85,24,726,ink)).join('')}</g>`+path('M42 40H90M65 17V65M815 834H862M839 810V858',null,ink,3);break
    case 'bloom':
      bg=support;art=ellipse(450,787,289,42,mix(ink,.72,paper))+`<g transform="translate(450 423)">${Array.from({length:5},(_,i)=>`<ellipse cx="0" cy="-166" rx="128" ry="222" fill="${i%2?g('silk'):accent}" transform="rotate(${i*72})"/>`).join('')}${ellipse(0,0,94,94,g('orb'))}</g>`+ellipse(165,164,43,43,paper)+ellipse(764,678,29,29,paper);break
    case 'aurel':
      bg=paper;art=box(95,118,710,670,accent)+path('M159 788V415a291 291 0 0 1 582 0v373Z',ink)+path('M202 788V433a248 248 0 0 1 496 0v355Z',support)+path('M255 788V455a195 195 0 0 1 390 0v333Z',paper)+ellipse(450,461,88,88,accent)+Array.from({length:13},(_,i)=>path(`M${275+i*29} 669L${244+i*34} 788`,null,accent,1)).join('')+path('M255 665H645M255 710H645M255 756H645',null,accent,1);break
    case 'fieldwork':
      bg=paper;art=Array.from({length:20},(_,i)=>path(`M-50 ${290+i*27}C176 ${-3+i*32} 330 ${642-i*4} 510 ${255+i*21}S843 ${350+i*17} 980 ${130+i*37}`,null,i%4?mix(ink,.65,paper):ink,i%4?1:2)).join('')+poly('0,646 193,412 321,566 581,265 900,599 900,900 0,900',support)+poly('0,739 240,581 443,727 733,502 900,696 900,900 0,900',ink)+path('M84 797C237 568 452 812 740 609',null,accent,8)+ellipse(701,135,58,58,accent)+path('M70 76H179M124 28V127',null,ink,2);break
    case 'neue':
      bg=paper;art=ellipse(467,780,300,34,mix(ink,.84,paper))+poly('142,274 420,95 447,103 470,618 207,799',g('metal'))+poly('447,103 720,282 704,799 470,618',ink)+poly('142,274 449,489 720,282 447,103',g('metal'))+poly('449,489 470,618 704,799 720,282',accent)+path('M64 841H836M836 65V843',null,ink,1);break
    case 'paloma':
      bg=accent;art=poly('100,151 505,335 361,704',paper)+poly('505,335 818,91 710,529',ink)+poly('505,335 604,772 361,704',support)+poly('505,335 710,529 844,599 604,772',paper)+path('M95 747C202 838 746 868 834 650',null,ink,2)+Array.from({length:5},(_,i)=>path(`M${142+i*22} ${201+i*17}L${358+i*17} ${374+i*11}`,null,accent,1)).join('');break
    case 'goodkind':
      bg=accent;art=ellipse(450,778,302,28,mix(ink,.75,paper))+path('M130 696C40 301 211 106 426 191L364 320C230 279 181 460 254 650Z',ink)+path('M770 696C860 301 689 106 474 191L536 320C670 279 719 460 646 650Z',support)+path('M246 604C382 753 518 753 654 604L718 703C539 904 361 904 182 703Z',paper)+ellipse(371,468,17,17,ink)+ellipse(529,468,17,17,ink);break
    case 'relay':
      bg=ink;art=Array.from({length:31},(_,i)=>path(`M-10 ${111+i*22}C202 ${100+i*22} 289 ${240+i*3} 442 ${150+i*20}S679 ${420+i*9} 921 ${94+i*22}`,null,i%5?accent:paper,i%5?1.8:3)).join('')+box(66,66,145,26,accent)+path('M66 821H837M837 66V821',null,support,1)+ellipse(648,506,13,13,paper);break
    case 'sundaze':
      bg=paper;art=ellipse(450,456,312,312,accent)+Array.from({length:6},(_,i)=>box(97,464+i*59,706,24,i%2?paper:ink)).join('')+ellipse(450,359,100,100,paper)+path('M134 189L99 156M450 105V51M762 189L802 154',null,ink,6)+path('M213 809H687',null,ink,3);break
    case 'onda':
      bg=paper;art=Array.from({length:12},(_,i)=>path(`M-65 ${275+i*30}C157 ${69+i*36} 372 ${746-i*5} 577 ${489+i*18}S820 ${310+i*20} 975 ${467+i*31}`,null,i<6?accent:ink,i<6?23:2)).join('')+path('M50 643C223 468 484 633 727 405C912 229 872 161 805 128C751 101 700 192 646 237',null,g('silk'),62);break
    case 'elsewhere':
      bg=paper;art=box(93,77,714,746,accent)+path('M232 823V395a218 218 0 0 1 436 0v428Z',ink)+path('M269 823V407a181 181 0 0 1 362 0v416Z',support)+ellipse(450,352,80,80,paper)+path('M269 605C421 473 474 635 631 507V823H269Z',accent)+path('M269 684C421 566 505 763 631 653V823H269Z',paper)+path('M269 778C406 720 511 890 631 794V823H269Z',ink)+path('M232 823L118 866M668 823L790 867',null,ink,2);break
    case 'formhaus':
      bg=ink;art=ellipse(460,783,300,28,dark)+isoBlock(225,223,290,202,75,paper,accent,mix(accent,.2,ink))+isoBlock(225,423,290,73,75,paper,support,accent)+poly('225,423 256,444 256,790 225,772',accent)+poly('589,423 620,401 620,740 589,758',paper)+poly('287,492 318,510 318,819 287,800',accent)+poly('513,478 544,460 544,785 513,804',paper)+path('M165 237L165 795M158 237H172M158 795H172M228 844H620',null,paper,1);break
    case 'velour':
      bg=paper;art=ellipse(450,798,307,26,mix(ink,.87,paper))+path('M201 747C-46 397 311 26 585 133C886 251 644 630 354 498L409 369C577 455 691 266 548 248C382 227 207 451 332 673Z',g('metal'))+path('M352 497C455 606 515 684 594 787L724 715L457 389Z',g('silk'))+path('M271 214C181 344 188 483 241 578',null,paper,3);break
    case 'kinfolk':
      bg=accent;art=path('M396 809C411 581 395 338 432 102',null,ink,13)+leaf(410,530,260,ink,-61)+leaf(427,347,253,support,57)+leaf(418,723,217,paper,-49)+ellipse(614,710,105,119,support)+ellipse(210,770,84,66,ink)+Array.from({length:9},(_,i)=>path(`M${536+i*19} 716C${555+i*17} 643 ${581+i*10} 678 ${574+i*17} 789`,null,paper,1)).join('');break
    case 'modo':
      bg=paper;art=isoBlock(137,272,249,376,68,light,ink,accent)+isoBlock(424,396,249,252,68,accent,ink,light)+poly('205,340 449,167 740,464 672,531 449,326 273,451',g('metal'))+path('M104 786H798M104 808H798M104 830H798',null,accent,1)+ellipse(760,163,34,34,support);break
    case 'juno':
      bg=ink;art=ellipse(294,300,209,209,g('orb'))+ellipse(667,479,173,173,accent)+ellipse(262,713,123,123,support)+ellipse(694,138,82,82,paper)+path('M80 817L792 105M133 98L803 763',null,paper,1)+ellipse(524,701,49,49,paper);break
    case 'raster': {
      bg=ink;const pixels=[];for(let y=0;y<52;y++)for(let x=0;x<52;x++){const dx=(x-26)/26,dy=(y-25)/25,r=Math.sqrt(dx*dx+dy*dy);if(r<.82&&r>.31){const size=4+((dx+1)/2)*9;pixels.push(box(92+x*14,88+y*14,size,size,dy<-.2?paper:accent))}}art=pixels.join('')+path('M51 51H194M51 51V194M849 849H706M849 849V706',null,support,2);break }
    case 'commonroom':
      bg=paper;art=ellipse(450,462,209,152,ink)+Array.from({length:8},(_,i)=>`<g transform="rotate(${i*45} 450 462)">${box(410,112,80,127,i%2?accent:support,35)}${ellipse(450,170,30,21,paper)}</g>`).join('')+ellipse(450,462,161,115,paper)+box(311,445,79,31,accent)+box(403,445,82,31,support)+box(498,445,87,31,accent);break
    case 'caravan':
      bg=accent;art=ellipse(620,240,100,100,paper)+path('M0 488L192 235L392 528L538 378L900 607V900H0Z',support)+path('M0 609L290 456L465 671L724 475L900 637V900H0Z',ink)+path('M398 899C510 751 256 720 377 621S569 577 539 516',null,paper,45)+path('M398 899C510 751 256 720 377 621S569 577 539 516',null,accent,3);break
    case 'halcyon':
      bg=paper;art=ellipse(450,458,319,319,support)+ellipse(450,458,281,281,accent)+ellipse(450,458,237,237,paper)+ellipse(450,458,196,196,g('orb'))+Array.from({length:7},(_,i)=>ellipse(450,481,92+i*26,51+i*20,null,mix(ink,.7,paper),1)).join('')+path('M127 842H774',null,ink,1);break
    case 'monument':
      bg=accent;art=ellipse(455,790,301,41,mix(ink,.72,paper))+isoBlock(157,550,505,114,77,paper,mix(ink,.15),support)+isoBlock(230,330,347,219,65,paper,ink,support)+isoBlock(333,121,149,209,43,paper,ink,support)+path('M746 159V743M738 159H754M738 743H754M137 843H746',null,ink,1);break
    case 'nori':
      bg=paper;art=box(89,97,722,716,accent,57)+box(111,121,409,380,paper,25)+box(543,121,244,260,support,25)+box(543,405,244,382,ink,25)+box(111,525,409,262,support,25)+leaf(315,461,202,ink,-15)+ellipse(665,261,65,65,paper)+Array.from({length:5},(_,i)=>ellipse(171+i*67,650,22,90,paper)).join('')+Array.from({length:7},(_,i)=>path(`M${584+i*23} 458C${629+i*11} 544 ${569+i*29} 674 ${643+i*16} 752`,null,accent,3)).join('');break
    case 'tandem':
      bg=paper;art=`<g transform="rotate(-22 450 450)">${ellipse(326,455,231,267,null,g('metal'),74)}${ellipse(584,455,231,267,null,g('silk'),74)}${path('M355 290C441 225 548 224 624 286',null,ink,12)}</g>`+path('M105 799H280M620 799H795',null,ink,2);break
    case 'pebble':
      bg=paper;art=path('M210 713C200 620 337 579 504 589C649 599 772 652 710 732C639 825 229 831 210 713Z',ink)+path('M256 534C211 434 344 359 506 385C661 410 713 531 623 577C532 623 302 636 256 534Z',support)+path('M329 281C306 222 371 144 460 165C551 187 605 260 553 313C499 367 354 351 329 281Z',g('orb'))+ellipse(650,275,42,42,accent);break
    case 'phase':
      bg=ink;art=poly('73,488 535,119 827,351 365,723',accent)+poly('73,488 365,723 365,819 73,582',support)+poly('365,723 827,351 827,447 365,819',paper)+poly('225,382 338,291 592,490 479,581',ink)+poly('405,238 519,147 774,346 660,438',ink)+path('M79 805L240 674M667 152L802 41',null,accent,1);break
    case 'almanac':
      bg=paper;art=poly('165,202 513,118 766,368 417,461',support)+poly('165,202 417,461 417,796 165,537',ink)+poly('417,461 766,368 766,705 417,796',accent)+Array.from({length:13},(_,i)=>path(`M${184+i*3} ${222+i*19}L${414+i*2} ${461+i*18}L${743+i} ${377+i*19}`,null,paper,2)).join('')+path('M458 502C527 414 587 479 627 421M458 525H687M458 547H637',null,ink,2);break
    case 'mellow':
      bg=accent;art=`<g transform="translate(450 450)">${Array.from({length:20},(_,i)=>`<path d="M-32-130C-75-206-64-303 0-338C67-308 72-203 32-130Z" fill="${i%2?paper:support}" transform="rotate(${i*18})"/>`).join('')}${ellipse(0,0,147,147,g('orb'))}</g>`+ellipse(173,765,49,49,ink)+ellipse(728,153,31,31,ink);break
    case 'atelier-eight':
      bg=paper;art=ellipse(450,788,289,28,mix(ink,.84,paper))+poly('450,90 733,302 714,643 447,790 187,638 164,310',ink)+poly('450,90 733,302 447,438 164,310',g('metal'))+poly('164,310 447,438 447,790 187,638',accent)+poly('733,302 447,438 447,790 714,643',support)+poly('450,90 447,438 330,260',paper)+path('M82 106H193M138 48V163M759 736H837',null,ink,1);break
    case 'unfold':
      bg=accent;art=poly('92,209 339,103 528,225 787,95 810,688 553,814 359,690 115,795',paper)+poly('339,103 359,690 553,814 528,225',ink)+poly('528,225 553,814 810,688 787,95',accent)+path('M136 299L300 224M138 329L303 254M141 359L306 284M591 340L747 264M593 370L749 294',null,ink,3)+path('M68 70H142M104 34V109',null,ink,2);break
    case 'terra':
      bg=paper;art=Array.from({length:8},(_,i)=>{const y=291+i*61;return path(`M87 ${y}C258 ${y-111} 458 ${y-84} 816 ${y-210}L815 ${y+46}C456 ${y+174} 259 ${y+74} 86 ${y+139}Z`,i%3===0?ink:i%3===1?accent:support)}).join('')+ellipse(212,134,60,60,accent);break
    case 'interval':
      bg=paper;art=poly('128,190 361,87 361,745 128,827',accent)+poly('557,87 790,190 790,827 557,745',ink)+poly('361,745 557,745 791,827 128,827',support)+poly('361,87 557,87 557,745 361,745',light)+path('M450 127V705',null,paper,2);break
    case 'pippa':
      bg=accent;art=ellipse(450,780,259,29,mix(ink,.65,paper))+`<g transform="translate(450 448)">${Array.from({length:8},(_,i)=>`<path d="M-42-50C-160-150-183-299-76-338C28-376 82-195 42-50Z" fill="${i%2?g('silk'):paper}" transform="rotate(${i*45})"/>`).join('')}${ellipse(0,0,87,87,ink)}${ellipse(0,0,51,51,paper)}</g>`;break
    case 'vertex':
      bg=ink;art=poly('96,647 530,129 824,187 390,705',g('metal'))+poly('96,647 390,705 472,780 178,722',support)+poly('390,705 824,187 827,269 472,780',accent)+poly('282,577 447,389 593,419 429,608',ink)+Array.from({length:9},(_,i)=>path(`M${91+i*24} ${117+i*23}L${278+i*24} ${344+i*23}`,null,accent,1)).join('');break
    case 'marginalia':
      bg=paper;art=box(107,99,498,676,accent)+`<g transform="rotate(9 498 432)">${box(234,113,498,676,paper)}${path('M301 198H666M301 262H593M301 310H666M301 359H641M301 409H666M301 458H610M301 506H666M301 555H652M301 605H666',null,support,2)}${path('M275 178H255V623H275M674 360H695V511H674',null,ink,3)}${path('M344 344C457 409 486 314 585 364M372 572C453 506 553 602 627 546',null,ink,2)}</g>`+ellipse(754,151,15,15,ink);break
    case 'supergood':
      bg=accent;art=Array.from({length:8},(_,i)=>box(90+i*90,94,90,90,i%2?paper:ink)).join('')+box(142,553,618,127,ink,12)+box(185,680,25,139,ink)+box(691,680,25,139,ink)+path('M217 354L321 259L404 340L586 198L685 302L401 535Z',paper)+ellipse(168,238,46,46,support)+ellipse(749,421,67,67,support);break
    case 'serein':
      bg=ink;art=ellipse(450,790,273,21,dark)+ellipse(650,197,91,91,accent)+ellipse(684,161,91,91,ink)+path('M179 423H639C636 685 591 730 411 730C230 730 183 647 179 423Z',g('metal'))+ellipse(410,423,230,56,paper)+ellipse(410,423,206,43,dark)+path('M639 451C818 399 812 658 618 635',null,accent,27)+ellipse(421,752,316,45,support)+path('M352 310C274 217 449 197 389 105M459 310C381 217 556 197 496 105',null,support,2);break
    case 'assembly':
      bg=accent;art=isoBlock(108,180,247,208,65,ink,paper,support)+isoBlock(469,110,247,208,65,ink,support,paper)+isoBlock(108,541,247,208,65,paper,ink,support)+isoBlock(469,471,247,208,65,support,paper,ink)+path('M429 42V844M44 429H856',null,ink,1);break
    case 'wildroot':
      bg=paper;art=ellipse(450,253,223,181,accent)+path('M450 102V800',null,ink,11)+Array.from({length:7},(_,i)=>{const y=362+i*55;return path(`M450 ${y}C${348-i*20} ${y-42} ${280-i*9} ${y+27} ${179+i*19} ${y+81}M450 ${y+15}C${540+i*14} ${y-62} ${657+i*12} ${y+40} ${749-i*21} ${y+76}`,null,i%2?ink:support,4)}).join('')+leaf(446,334,146,ink,-53)+leaf(451,265,140,support,52);break
    case 'still':
      bg=paper;art=ellipse(450,796,258,25,mix(ink,.83,paper))+path('M196 384C187 220 282 140 450 140C619 140 713 220 704 384L648 724C620 798 281 798 252 724Z',g('metal'))+ellipse(450,318,255,154,accent)+ellipse(450,318,187,106,ink)+ellipse(450,334,160,87,paper)+path('M299 462C324 520 301 639 351 717',null,paper,2);break
    case 'fizz':
      bg=accent;art=ellipse(450,458,263,263,ink)+ellipse(450,458,232,232,paper)+Array.from({length:9},(_,i)=>`<path d="M450 458L450 248A210 210 0 0 1 585 297Z" fill="${i%2?g('silk'):support}" transform="rotate(${i*40} 450 458)"/>`).join('')+ellipse(450,458,36,36,paper)+ellipse(170,146,65,65,g('orb'))+ellipse(751,728,72,72,g('orb'))+ellipse(705,144,34,34,paper)+ellipse(146,751,28,28,paper);break
    case 'axiom':
      bg=paper;art=poly('451,103 802,724 695,724 451,289 273,601 651,601 711,708 85,708',ink)+poly('451,103 497,182 151,788 86,708',accent)+poly('151,788 742,788 802,724 151,724',support)+poly('451,289 517,289 755,708 695,724',accent)+Array.from({length:8},(_,i)=>path(`M${95+i*98} 63V846M62 ${90+i*99}H848`,null,mix(ink,.8,paper),1)).join('');break
    case 'folio':
      bg=paper;art=`<g transform="rotate(-11 450 450)">${box(149,137,531,650,ink)}${box(216,105,531,650,accent)}${box(230,120,503,616,paper)}${path('M282 190H578M282 214H492M282 634H660M282 659H572',null,ink,2)}${poly('281,274 662,274 662,565 281,565',support)}${poly('281,565 451,274 662,565',ink)}${ellipse(558,367,61,61,paper)}</g>`;break
    case 'daytrip':
      bg=paper;art=box(77,102,747,632,accent)+ellipse(674,249,90,90,paper)+path('M77 500L265 299L456 576L574 433L824 628V734H77Z',support)+path('M77 654C330 530 486 748 824 579V734H77Z',ink)+path('M117 623C207 532 293 552 397 620S643 674 780 623',null,paper,6)+path('M130 790H465M626 790H769',null,ink,2);break
    case 'maison-lune':
      bg=accent;art=box(100,98,700,724,paper)+path('M240 822V362a210 210 0 0 1 420 0v460Z',ink)+path('M266 822V378a184 184 0 0 1 368 0v444Z',support)+path('M450 160V822M266 440H634',null,paper,8)+ellipse(546,314,54,54,paper)+ellipse(568,293,55,55,support)+path('M266 667C401 563 519 723 634 627V822H266Z',ink)+path('M267 788H634',null,accent,1);break
    case 'outlier':
      bg=accent;art=poly('113,241 392,70 727,216 774,676 473,831 164,698',ink)+poly('113,241 403,411 727,216 392,70',paper)+poly('403,411 473,831 774,676 727,216',support)+box(397,375,232,232,accent)+box(443,421,232,232,ink)+path('M74 105H249M74 105V272M824 796H649M824 796V629',null,ink,4);break
    default: throw new Error(`No authored artwork for ${brand.id}`)
  }
  return defs+box(0,0,900,900,bg)+art
}

export function artwork(brand) { return svg(artworkContent(brand),900,900,`${brand.name} — ${brand.system.direction}: original illustration`) }
