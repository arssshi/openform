import { mix } from './artwork.mjs'
import { iconPaths } from './identity.mjs'

const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
const serif=new Set(['instrument-serif','instrument-serif-italic','fraunces','lora','cormorant','playfair','prata'])
const fontStack=font=>`'${font.family}', ${font.id==='dm-mono'?'monospace':serif.has(font.id)?'serif':'sans-serif'}`
const classes={root:'of-theme',container:'of-container',header:'of-header',navigation:'of-nav',mobileNavigation:'of-mobile-nav',logo:'of-logo',eyebrow:'of-eyebrow',hero:'of-hero',heroCopy:'of-hero-copy',heroHeading:'of-display',heroMedia:'of-hero-media',heading:'of-heading',body:'of-body',actions:'of-actions',button:'of-button',secondaryButton:'of-button of-button--ghost',section:'of-section',sectionHeading:'of-section-heading',grid:'of-grid',card:'of-card',cardImage:'of-card-image',badge:'of-badge',form:'of-form',field:'of-field',input:'of-input',select:'of-select',textarea:'of-textarea',notice:'of-notice',table:'of-table',accordion:'of-accordion',footer:'of-footer'}

export function themeManifest(brand,fontMap,files) {
  const s=brand.system,[ink,accent,paper,support]=brand.colors
  const selected=[...new Set([brand.heading,brand.body,s.accentFont])].map(id=>fontMap.get(id))
  const heroBackground=s.mode==='dark'?ink:s.mode==='accent'?accent:paper
  const heroForeground=s.mode==='dark'?paper:ink
  return {
    format:'openform-theme',version:'2.0.0',id:brand.id,name:brand.name,direction:s.direction,concept:s.concept,
    scope:{attribute:'data-openform',value:brand.id,selector:`[data-openform="${brand.id}"]`},
    installation:{command:`node install-theme.mjs --target /path/to/your/project`,publicDirectory:'public',destination:`themes/${brand.id}`,stylesheet:`/themes/${brand.id}/theme.css`,reference:`/themes/${brand.id}/reference.html`,components:`/themes/${brand.id}/components.html`,htmlAttribute:`data-openform="${brand.id}"`},
    colors:{ink,accent,paper,support,secondary:mix(ink,.15,paper),border:mix(ink,.73,paper),heroBackground,heroForeground,buttonBackground:s.mode==='dark'?accent:ink,buttonForeground:s.mode==='dark'?ink:paper},
    typography:{display:{family:fontMap.get(brand.heading).family,file:`fonts/${brand.heading}.ttf`,weight:brand.weight,trackingEm:brand.tracking/100,lineHeight:s.family==='poster'?.96:s.family==='hospitality'?1.04:1.02,desktopMaxPx:Math.min(s.headingSize,96),mobileMinPx:38},body:{family:fontMap.get(brand.body).family,file:`fonts/${brand.body}.ttf`,weight:400,sizePx:16,lineHeight:1.7},accent:{family:fontMap.get(s.accentFont).family,file:`fonts/${s.accentFont}.ttf`,style:fontMap.get(s.accentFont).style||'normal'},label:{sizePx:11,trackingEm:.08,lineHeight:1.5}},
    layout:{id:brand.layout,family:s.family,mode:s.mode,alignment:s.alignment,maxWidthPx:s.maxWidth,pageGutter:'clamp(20px, 4vw, 64px)',sectionGap:'clamp(64px, 9vw, 128px)',heroTextRatio:s.split,gridColumns:s.family==='minimal'?2:3,breakpoints:{mobile:640,tablet:960},description:s.layoutNote},
    components:{classes,radiusPx:brand.radius,cardRadiusPx:0,borderPx:s.border||1,buttonShape:s.button,minimumControlHeightPx:48,inputHeightPx:52,focus:{widthPx:3,offsetPx:4,color:ink}},
    content:{headline:s.headline,eyebrow:s.eyebrow,cta:s.cta,secondaryCta:s.secondaryCta,nav:s.nav,features:s.features},
    rules:[...brand.rules,s.layoutNote,'Use the supplied artwork and SVG logos; keep glyph proportions intact.','Preserve the existing project content, routes, data fetching, and interaction handlers.'],
    fonts:selected.map(font=>({id:font.id,family:font.family,path:`fonts/${font.id}.ttf`,license:`fonts/${font.id}-OFL.txt`,weight:font.weight,style:font.style||'normal'})),
    exports:files,
    license:{artwork:'CC0-1.0',code:'MIT',fonts:'OFL-1.1'},
    acceptance:['The exact stylesheet loads without a 404.','All local fonts load; there are no requests to remote font services.','The root or intended subtree carries the exact data-openform attribute.','The supplied display font, colors, radius, spacing, and layout family are used consistently.','At 360px, 768px, and 1440px there is no horizontal page overflow.','Navigation, forms, routes, and existing business behavior still work.','Controls are keyboard accessible with visible focus; reduced-motion preferences are respected.','The final interface follows reference.html and components.html rather than a guessed visual style.']
  }
}

export function themeCss(brand,fontMap) {
  const s=brand.system,[ink,accent,paper,support]=brand.colors,q=`[data-openform="${brand.id}"]`
  const selected=[...new Set([brand.heading,brand.body,s.accentFont])].map(id=>fontMap.get(id))
  const radius=brand.radius,buttonRadius=s.button==='pill'?999:s.button==='square'?0:Math.min(radius,12)
  const border=s.border||1,bg=s.mode==='dark'?ink:s.mode==='accent'?accent:paper,fg=s.mode==='dark'?paper:ink
  const head=fontMap.get(brand.heading),body=fontMap.get(brand.body),acc=fontMap.get(s.accentFont)
  return `/* Openform ${brand.name} / Edition 02. Code MIT; original artwork CC0; original fonts OFL. */
${selected.map(font=>`@font-face { font-family: '${font.family}'; src: url('./fonts/${font.id}.ttf') format('truetype'); font-style: ${font.style||'normal'}; font-weight: ${font.weight}; font-display: swap; }`).join('\n')}
${q} {
  --of-ink: ${ink}; --of-accent: ${accent}; --of-paper: ${paper}; --of-support: ${support};
  --of-secondary: ${mix(ink,.15,paper)}; --of-border: ${mix(ink,.73,paper)};
  --of-hero-background: ${bg}; --of-hero-foreground: ${fg};
  --of-heading: ${fontStack(head)}; --of-body: ${fontStack(body)}; --of-accent-font: ${fontStack(acc)};
  --of-weight: ${brand.weight}; --of-tracking: ${brand.tracking/100}em;
  --of-display-leading: ${s.family==='poster'?.96:s.family==='hospitality'?1.04:1.02};
  --of-radius: ${radius}px; --of-button-radius: ${buttonRadius}px; --of-line: ${border}px;
  --of-max-width: ${s.maxWidth}px; --of-gutter: clamp(20px, 4vw, 64px); --of-section-gap: clamp(64px, 9vw, 128px);
  --of-space-1: 4px; --of-space-2: 8px; --of-space-3: 12px; --of-space-4: 16px; --of-space-6: 24px; --of-space-8: 32px; --of-space-12: 48px; --of-space-16: 64px;
  --brand-ink: var(--of-ink); --brand-accent: var(--of-accent); --brand-paper: var(--of-paper); --brand-support: var(--of-support);
  --brand-heading: var(--of-heading); --brand-body: var(--of-body); --brand-weight: var(--of-weight); --brand-tracking: var(--of-tracking); --brand-radius: var(--of-radius);
  color: var(--of-ink); background: var(--of-paper); font-family: var(--of-body); font-synthesis: none; line-height: 1.7;
}
${q} *, ${q} *::before, ${q} *::after { box-sizing: border-box; }
${q} body { margin: 0; background: var(--of-paper); color: var(--of-ink); font-family: var(--of-body); -webkit-font-smoothing: antialiased; }
${q} :where(h1,h2,h3,h4,h5,h6) { font-family: var(--of-heading); font-weight: var(--of-weight); letter-spacing: var(--of-tracking); line-height: 1.12; }
${q} :where(button,input,select,textarea) { font: inherit; }
${q} :where(button,a,input,select,textarea,summary):focus-visible { outline: 3px solid var(--of-ink); outline-offset: 4px; }
${q} :where(button) { cursor: pointer; }
${q} :where(a) { color: inherit; }
${q} :where(img,svg) { max-width: 100%; }
${q} :where(img) { display: block; }
${q} :where(code,pre) { font-family: ui-monospace, monospace; overflow-wrap: anywhere; }
${q} .of-theme, ${q} .brand-surface { color: var(--of-ink); background: var(--of-paper); font-family: var(--of-body); line-height: 1.7; }
${q} .of-container { width: min(calc(100% - 2 * var(--of-gutter)), var(--of-max-width)); margin-inline: auto; }
${q} .of-header { min-height: 88px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: var(--of-line) solid var(--of-border); }
${q} .of-logo { width: 204px; max-height: 55px; object-fit: contain; object-position: left; }
${q} .of-nav { display: flex; align-items: center; gap: clamp(20px, 3vw, 48px); }
${q} .of-nav a { text-decoration: none; font-size: 13px; font-weight: 500; padding-block: 12px; border-bottom: 1px solid transparent; }
${q} .of-nav a:hover { border-color: var(--of-ink); }
${q} .of-mobile-nav { display: none; position: relative; }
${q} .of-mobile-nav summary { list-style: none; cursor: pointer; border: var(--of-line) solid var(--of-border); padding: 8px 16px; border-radius: var(--of-button-radius); min-height: 44px; font-size: 13px; }
${q} .of-mobile-nav summary::-webkit-details-marker { display: none; }
${q} .of-mobile-links { position: absolute; z-index: 5; right: 0; top: 54px; width: min(270px, calc(100vw - 48px)); display: grid; padding: 14px 22px; background: var(--of-paper); border: var(--of-line) solid var(--of-ink); border-radius: ${Math.min(radius,12)}px; }
${q} .of-mobile-links a { padding: 13px 0; text-decoration: none; font-size: 14px; border-bottom: 1px solid var(--of-border); }
${q} .of-mobile-links a:last-child { border: 0; }
${q} .of-eyebrow { font-family: var(--of-body); font-size: 11px; font-weight: 500; line-height: 1.5; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 24px; }
${q} .of-hero { background: var(--of-hero-background); color: var(--of-hero-foreground); padding-block: clamp(56px, 7vw, 104px); }
${q} .of-hero-inner { display: grid; grid-template-columns: minmax(0, ${s.split}fr) minmax(0, ${1-s.split}fr); gap: clamp(28px, 5vw, 80px); align-items: center; }
${q} .of-hero-copy { min-width: 0; }
${q} .of-display, ${q} .brand-heading { font-family: var(--of-heading); font-weight: var(--of-weight); letter-spacing: var(--of-tracking); }
${q} .of-display { font-size: clamp(44px, 6.5vw, ${Math.min(s.headingSize,96)}px); line-height: var(--of-display-leading); margin: 0; overflow-wrap: break-word; text-wrap: balance; }
${q} .of-display > span { display: block; }
${q} .of-display em, ${q} .of-accent-type { font-family: var(--of-accent-font); font-style: ${acc.style||'normal'}; font-weight: 400; }
${q} .of-lede { font-size: clamp(16px, 1.4vw, 19px); line-height: 1.75; max-width: 49ch; margin: 28px 0 0; }
${q} .of-hero-media { min-width: 0; margin: 0; }
${q} .of-hero-media img { width: 100%; aspect-ratio: ${s.family==='architecture'?'4 / 5':s.family==='fashion'?'4 / 5':'1 / 1'}; object-fit: cover; border-radius: ${s.family==='playful'?radius:0}px; }
${q} .of-hero-media figcaption { font-size: 12px; margin-top: 15px; }
${q} .of-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 32px; }
${q} .of-button, ${q} .brand-button { display: inline-flex; align-items: center; justify-content: center; gap: 22px; min-height: 48px; max-width: 100%; padding: 14px 24px; border: var(--of-line) solid var(--of-ink); border-radius: var(--of-button-radius); background: var(--of-ink); color: var(--of-paper); font-family: var(--of-body); font-size: 14px; font-weight: 500; line-height: 1.35; text-decoration: none; cursor: pointer; text-align: center; }
${q} .of-button svg { width: 18px; height: 18px; flex-shrink: 0; }
${q} .of-button:hover { text-decoration: underline; text-underline-offset: 4px; }
${q} .of-button:disabled { opacity: .6; cursor: not-allowed; text-decoration: none; }
${q} .of-button--ghost { background: transparent; color: var(--of-ink); }
${q} .of-hero .of-button { background: ${s.mode==='dark'?accent:ink}; color: ${s.mode==='dark'?ink:paper}; border-color: ${s.mode==='dark'?accent:ink}; }
${q} .of-hero .of-button--ghost { background: transparent; color: var(--of-hero-foreground); border-color: var(--of-hero-foreground); }
${q} .of-hero :where(a,button):focus-visible { outline-color: var(--of-hero-foreground); }
${q} .of-heading { font-family: var(--of-heading); font-weight: var(--of-weight); letter-spacing: var(--of-tracking); font-size: clamp(32px, 4vw, 56px); line-height: 1.1; margin: 0; }
${q} .of-body { font-size: 16px; line-height: 1.7; max-width: 65ch; }
${q} .of-section { padding-block: var(--of-section-gap); }
${q} .of-section-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; margin-bottom: 44px; }
${q} .of-section-heading > p { font-size: 14px; line-height: 1.8; max-width: 34ch; margin: 0; color: var(--of-secondary); }
${q} .of-grid { display: grid; grid-template-columns: repeat(${s.family==='minimal'?2:3}, minmax(0,1fr)); gap: ${s.family==='poster'?'0':'24px'}; }
${q} .of-card { border: 0; border-top: var(--of-line) solid var(--of-border); border-radius: 0; background: var(--of-paper); min-width: 0; }
${q} .of-card-image { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
${q} .of-card-body { padding: 26px 0; }
${q} .of-card h3 { font-family: var(--of-heading); font-weight: var(--of-weight); font-size: 25px; line-height: 1.18; margin: 14px 0 12px; }
${q} .of-card p { font-size: 14px; line-height: 1.75; margin: 0; color: var(--of-secondary); }
${q} .of-card .of-eyebrow { color: var(--of-ink); margin: 0; font-size: 10px; }
${q} .of-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; line-height: 1.4; padding: 7px 11px; border-radius: var(--of-button-radius); border: 1px solid var(--of-border); background: var(--of-accent); color: var(--of-ink); }
${q} .of-feature-band { border-block: var(--of-line) solid var(--of-border); padding-block: 23px; }
${q} .of-feature-band .of-container { display: flex; align-items: center; justify-content: space-between; gap: 20px; font-size: 12px; }
${q} .of-feature-band strong { font-weight: 500; font-size: 14px; }
${q} .of-editorial { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 88px); align-items: center; }
${q} .of-editorial > img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border: 1px solid var(--of-border); }
${q} .of-editorial .of-body { color: var(--of-secondary); margin-block: 24px; }
${q} .of-list { list-style: none; padding: 0; margin: 28px 0; }
${q} .of-list li { padding: 17px 0; border-top: 1px solid var(--of-border); display: flex; gap: 19px; font-size: 14px; }
${q} .of-list li span:first-child { font-size: 11px; min-width: 22px; }
${q} .of-form { display: grid; gap: 20px; max-width: 620px; }
${q} .of-field { display: grid; gap: 9px; font-size: 13px; font-weight: 500; }
${q} .of-input, ${q} .of-select, ${q} .of-textarea { display: block; width: 100%; min-height: 52px; padding: 14px 16px; border: var(--of-line) solid var(--of-ink); border-radius: ${Math.min(radius,16)}px; background: var(--of-paper); color: var(--of-ink); font-family: var(--of-body); font-size: 16px; line-height: 1.5; }
${q} .of-input::placeholder, ${q} .of-textarea::placeholder { color: var(--of-secondary); opacity: 1; }
${q} .of-textarea { min-height: 140px; resize: vertical; }
${q} .of-field-help { font-size: 12px; color: var(--of-secondary); font-weight: 400; }
${q} .of-notice { padding: 20px 24px; border: var(--of-line) solid var(--of-ink); border-radius: ${Math.min(radius,16)}px; background: var(--of-accent); color: var(--of-ink); font-size: 14px; line-height: 1.75; }
${q} .of-table-wrap { overflow-x: auto; }
${q} .of-table { border-collapse: collapse; width: 100%; font-size: 14px; text-align: left; }
${q} .of-table th, ${q} .of-table td { padding: 18px 16px; border-bottom: 1px solid var(--of-border); }
${q} .of-table th { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; font-weight: 500; }
${q} .of-accordion { border-top: 1px solid var(--of-border); }
${q} .of-accordion details { border-bottom: 1px solid var(--of-border); }
${q} .of-accordion summary { padding: 23px 0; font-size: 16px; cursor: pointer; }
${q} .of-accordion details p { margin: 0; padding: 0 24px 24px 0; font-size: 14px; line-height: 1.8; color: var(--of-secondary); }
${q} .of-footer { background: var(--of-ink); color: var(--of-paper); padding-block: 56px 30px; }
${q} .of-footer-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; padding-bottom: 39px; }
${q} .of-footer-name { font-family: var(--of-heading); font-weight: var(--of-weight); font-size: clamp(40px,7vw,76px); letter-spacing: var(--of-tracking); line-height: 1.1; margin: 0; }
${q} .of-footer p { font-size: 14px; margin-top: 14px; }
${q} .of-footer-links { display: grid; gap: 14px; font-size: 13px; }
${q} .of-footer-links a { text-underline-offset: 4px; }
${q} .of-footer-bottom { border-top: 1px solid var(--of-paper); padding-top: 24px; display: flex; gap: 20px; justify-content: space-between; font-size: 11px; }
${q} .of-footer :where(a,button):focus-visible { outline-color: var(--of-paper); }
${q} .of-skip-link { position: fixed; z-index: 100; top: -80px; left: 20px; background: var(--of-ink); color: var(--of-paper); padding: 14px 20px; border-radius: 4px; }
${q} .of-skip-link:focus { top: 12px; }
${q} .of-component-group { border-top: 1px solid var(--of-border); padding-block: 40px; }
${q} .of-component-group h2 { font-size: 30px; margin: 0 0 25px; }
${q} .of-component-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
${q} .of-swatches { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
${q} .of-swatch { height: 94px; border: 1px solid var(--of-border); border-radius: ${Math.min(radius,12)}px; }
${q} .of-swatches code { font-size: 12px; }
${s.alignment==='center'?`${q} .of-hero-inner { grid-template-columns: minmax(0,1fr); gap: 42px; text-align: center; }
${q} .of-hero-copy { max-width: 1090px; margin-inline: auto; }
${q} .of-hero .of-lede { margin-inline: auto; }
${q} .of-hero .of-actions { justify-content: center; }
${q} .of-hero-media { width: min(100%, ${s.family==='hospitality'?'940':'1000'}px); margin-inline: auto; }
${q} .of-hero-media { max-width: 590px; }
${q} .of-hero-media img { aspect-ratio: 4 / 3; object-fit: contain; }
`:''}
${s.family==='architecture'?`${q} .of-card { border-radius: 0; border-inline: 0; }
${q} .of-card-body { padding-inline: 0; }
${q} .of-card-image { aspect-ratio: 4 / 5; }
${q} .of-feature-band { background: var(--of-accent); }
${q} .of-header { min-height: 100px; }
`:''}
${s.family==='editorial'?`${q} .of-card { border-radius: 0; border-inline: 0; }
${q} .of-card-body { padding-inline: 0; }
${q} .of-card h3 { font-size: 29px; }
${q} .of-eyebrow { font-size: 10px; }
${q} .of-editorial { grid-template-columns: minmax(0,.83fr) minmax(0,1.17fr); }
`:''}
${s.family==='poster'?`${q} .of-header { border-bottom-color: var(--of-ink); }
${q} .of-card { border-radius: 0; border-color: var(--of-ink); }
${q} .of-card h3 { font-size: 32px; }
${q} .of-heading { text-transform: uppercase; }
${q} .of-feature-band { background: var(--of-accent); border-color: var(--of-ink); }
${q} .of-section-heading { border-bottom: 2px solid var(--of-ink); padding-bottom: 24px; }
`:''}
${s.family==='terminal'?`${q} .of-eyebrow, ${q} .of-badge, ${q} .of-nav { font-family: ${fontStack(body)}; }
${q} .of-card { border-radius: 0; }
${q} .of-card-image { aspect-ratio: 16 / 10; }
${q} .of-feature-band { background: var(--of-ink); color: var(--of-paper); border-color: var(--of-ink); }
`:''}
${s.family==='fashion'?`${q} .of-card { border-radius: 0; border: 0; }
${q} .of-card-image { aspect-ratio: 4 / 5; }
${q} .of-card-body { padding-inline: 0; }
${q} .of-card h3 { font-size: 30px; }
`:''}
${s.family==='playful'?`${q} .of-card:nth-child(2) { background: var(--of-paper); }
${q} .of-card:nth-child(3) .of-card-image { background: var(--of-support); }
${q} .of-card p { color: var(--of-ink); }
${q} .of-feature-band { background: var(--of-accent); }
`:''}
${s.family==='retro'?`${q} .of-card { border-color: var(--of-ink); }
${q} .of-heading { line-height: 1; }
${q} .of-feature-band { background: var(--of-accent); border-color: var(--of-ink); }
`:''}
${s.family==='minimal'?`${q} .of-card { border-radius: 0; border-inline: 0; }
${q} .of-card-body { padding-inline: 0; }
${q} .of-feature-band strong { font-weight: 400; }
${q} .of-section { padding-block: clamp(80px, 11vw, 152px); }
`:''}
${s.family==='expedition'?`${q} .of-card { border-color: var(--of-ink); }
${q} .of-feature-band { background: var(--of-accent); }
${q} .of-list { font-family: ${fontStack(body)}; }
`:''}
@media (max-width: 960px) {
  ${q} .of-hero-inner, ${q} .of-editorial { grid-template-columns: minmax(0,1fr); }
  ${q} .of-hero-media { width: 100%; }
  ${q} .of-hero-media img { aspect-ratio: ${s.alignment==='center'?'16 / 8':'4 / 3'}; }
  ${q} .of-display { font-size: clamp(44px, 8vw, 86px); }
  ${q} .of-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  ${q} .of-nav { gap: 20px; }
  ${q} .of-nav a { font-size: 12px; }
  ${q} .of-logo { width: 170px; }
}
@media (max-width: 640px) {
  ${q} .of-header { min-height: 76px; gap: 16px; }
  ${q} .of-logo { width: min(180px, 55vw); }
  ${q} .of-nav { display: none; }
  ${q} .of-mobile-nav { display: block; }
  ${q} .of-hero { padding-block: 47px; }
  ${q} .of-hero-inner { gap: 32px; }
  ${q} .of-display { font-size: clamp(38px, 10vw, 60px); }
  ${q} .of-eyebrow { font-size: 10px; margin-bottom: 19px; }
  ${q} .of-lede { font-size: 16px; margin-top: 23px; }
  ${q} .of-actions { gap: 12px; margin-top: 27px; }
  ${q} .of-button { font-size: 13px; gap: 15px; padding: 14px 19px; }
  ${q} .of-hero-media img { aspect-ratio: 4 / 3; }
  ${q} .of-hero-media figcaption { font-size: 9px; }
  ${q} .of-grid { grid-template-columns: minmax(0,1fr); gap: ${s.family==='poster'?'0':'22px'}; }
  ${q} .of-section-heading { flex-direction: column; align-items: flex-start; gap: 20px; margin-bottom: 30px; }
  ${q} .of-heading { font-size: clamp(30px, 8vw, 42px); }
  ${q} .of-section-heading > p { font-size: 14px; max-width: 46ch; }
  ${q} .of-card-body { padding: 22px 0; }
  ${q} .of-card h3 { font-size: 25px; }
  ${q} .of-feature-band .of-container { flex-wrap: wrap; font-size: 11px; gap: 12px 24px; }
  ${q} .of-feature-band strong { font-size: 13px; width: 100%; }
  ${q} .of-footer-top { flex-direction: column; gap: 28px; }
  ${q} .of-footer-bottom { flex-wrap: wrap; font-size: 10px; }
  ${q} .of-swatches { grid-template-columns: repeat(2,minmax(0,1fr)); }
  ${q} .of-swatches code { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  ${q}, ${q} * { scroll-behavior: auto !important; }
  ${q} *, ${q} *::before, ${q} *::after { animation: none !important; transition: none !important; }
}
`
}

const arrow='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12H20M14 6L20 12L14 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const button=(text,href,ghost=false)=>`<a class="of-button${ghost?' of-button--ghost':''}" href="${href}">${esc(text)}${arrow}</a>`

function document(brand,title,content) {
  return `<!doctype html>
<html lang="en" data-openform="${brand.id}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><meta name="theme-color" content="${brand.colors[2]}"><title>${esc(title)}</title><meta name="description" content="${esc(brand.system.concept)}"><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./theme.css"><script src="./theme.js" defer></script></head>
<body class="brand-surface">${content}</body></html>
`
}

function header(brand,componentPage=false) {
  const links=brand.system.nav.map((name,i)=>`<a href="${componentPage?'./reference.html':''}#${['collection','approach','notes'][i]}">${esc(name)}</a>`).join('')
  return `<a class="of-skip-link" href="#main">Skip to the main content</a><header class="of-header of-container"><a href="./reference.html" aria-label="${esc(brand.name)} home"><img class="of-logo" src="./lockup.svg" alt="${esc(brand.name)}" width="240" height="50"></a><nav class="of-nav" aria-label="Main navigation">${links}</nav><details class="of-mobile-nav"><summary>Menu</summary><nav class="of-mobile-links" aria-label="Mobile navigation">${links}</nav></details></header>`
}
function footer(brand) {
  return `<footer class="of-footer" id="notes"><div class="of-container"><div class="of-footer-top"><div><p class="of-footer-name">${esc(brand.name)}</p><p>${esc(brand.system.productNote)}</p></div><nav class="of-footer-links" aria-label="Theme resources"><a href="./components.html">Component reference</a><a href="./AI-PROMPT.md" download>Implementation prompt</a><a href="./INSTALL.md" download>Installation guide</a></nav></div><div class="of-footer-bottom"><span>Openform original / Edition 02</span><span>Artwork CC0 · Code MIT · Fonts OFL</span><span>This is a fictional identity and working theme reference.</span></div></div></footer>`
}

export function referencePage(brand) {
  const s=brand.system
  const cards=s.features.map(([name,description],i)=>`<article class="of-card"><div class="of-card-body"><p class="of-eyebrow">0${i+1}</p><h3>${esc(name)}</h3><p>${esc(description)}</p></div></article>`).join('')
  return document(brand,`${brand.name} — ${s.direction} / theme reference`,header(brand)+`
<main id="main">
  <section class="of-hero"><div class="of-container of-hero-inner"><div class="of-hero-copy"><p class="of-eyebrow">${esc(s.eyebrow)}</p><h1 class="of-display">${s.headline.map(line=>`<span>${esc(line)}</span>`).join('')}</h1><p class="of-lede">${esc(brand.tagline)} ${esc(s.productNote)}</p><div class="of-actions">${button(s.cta,'#collection')}${button(s.secondaryCta,'#approach',true)}</div></div><figure class="of-hero-media"><img src="./artwork.svg" alt="${esc(s.direction+' — original '+s.art+' illustration')}" width="900" height="900"><figcaption>${esc(s.direction)} / Original study 01</figcaption></figure></div></section>
  <section class="of-section of-container" id="collection"><div class="of-section-heading"><div><p class="of-eyebrow">A coherent little world</p><h2 class="of-heading">${esc(s.product)}</h2></div><p>${esc(s.productNote)} ${esc(brand.tagline)}</p></div><div class="of-grid">${cards}</div></section>
  <section class="of-section of-container" id="approach"><div class="of-editorial"><img src="./identity-board.svg" alt="${esc(brand.name+' complete identity, typography, color, and applications')}" width="1600" height="1200" loading="lazy"><div><p class="of-eyebrow">The point of view</p><h2 class="of-heading">${esc(s.direction)}.</h2><p class="of-body">${esc(s.concept)}</p><ul class="of-list">${brand.rules.map((rule,i)=>`<li><span>0${i+1}</span><span>${esc(rule)}</span></li>`).join('')}</ul>${button('Explore the component system','./components.html')}</div></div></section>
</main>
${footer(brand)}`)
}

export function componentPage(brand) {
  const [ink,accent,paper,support]=brand.colors
  const form=`<form class="of-form of-demo-form"><label class="of-field" for="theme-name">Your name<input class="of-input" id="theme-name" name="name" placeholder="Alex Rivera" autocomplete="name" required></label><label class="of-field" for="theme-email">Email address<input class="of-input" type="email" id="theme-email" name="email" placeholder="you@example.com" autocomplete="email" required><span class="of-field-help">Reference component. Connect your existing form handler in your project.</span></label><label class="of-field" for="theme-interest">Area of interest<select class="of-select" id="theme-interest" name="interest"><option>Choose a starting point</option> ${brand.system.nav.map(name=>`<option>${esc(name)}</option>`).join('')}</select></label><label class="of-field" for="theme-message">Your message<textarea class="of-textarea" id="theme-message" name="message" placeholder="Tell us what you have in mind."></textarea></label><button class="of-button" type="submit">Preview the form ${arrow}</button><output class="of-demo-message of-notice" hidden aria-live="polite"></output></form>`
  return document(brand,`${brand.name} / component reference`,header(brand,true)+`<main id="main" class="of-container of-section"><p class="of-eyebrow">Edition 02 / the working component system</p><h1 class="of-heading">Every detail, in one language.</h1><p class="of-body">Use the classes in this reference and the exact values in theme.json. These components inherit this identity's fonts, colors, proportions, and controls.</p>
<section class="of-component-group"><h2>Typography</h2><p class="of-eyebrow">Display / ${esc(brand.heading)}</p><p class="of-display">${esc(brand.tagline)}</p><p class="of-body">Reading text is 16px with a 1.7 line height and a maximum line length of 65 characters. A useful hierarchy is a first-class part of the system.</p><span class="of-badge">${esc(brand.system.direction)}</span></section>
<section class="of-component-group"><h2>Color & surfaces</h2><div class="of-swatches">${[ink,accent,paper,support].map((color,i)=>`<div><div class="of-swatch" style="background:${color}"></div><p>${esc(brand.colorNames[i])}<br><code>${color}</code></p></div>`).join('')}</div><p class="of-body">Ink on paper and ink on accent are approved normal-text pairings. Support color is a decorative surface until a specific text pairing is checked.</p></section>
<section class="of-component-group"><h2>Controls</h2><div class="of-component-row">${button('Primary action','#forms')}${button('Secondary action','#forms',true)}<span class="of-badge">A useful label</span></div><p class="of-body">Buttons are at least 48px tall. Focus is visible. Keep existing handlers, links, and form behavior when applying the theme.</p></section>
<section class="of-component-group"><h2>Cards & information</h2><div class="of-grid">${brand.system.features.map(([name,description],i)=>`<article class="of-card"><div class="of-card-body"><p class="of-eyebrow">0${i+1} / ${esc(brand.system.nav[i])}</p><h3>${esc(name)}</h3><p>${esc(description)}</p></div></article>`).join('')}</div></section>
<section class="of-component-group" id="forms"><h2>Forms</h2>${form}</section>
<section class="of-component-group"><h2>Notices</h2><div class="of-notice">This is an informational component. Use the ink / accent pairing for clear, readable supporting information. Connect status text to your real application state.</div></section>
<section class="of-component-group"><h2>Tables</h2><div class="of-table-wrap"><table class="of-table"><caption>Theme system specifications</caption><thead><tr><th scope="col">Element</th><th scope="col">Value</th><th scope="col">Purpose</th></tr></thead><tbody><tr><th scope="row">Spacing unit</th><td>4px</td><td>A consistent compositional rhythm</td></tr><tr><th scope="row">Body text</th><td>16px / 1.7</td><td>Comfortable, readable content</td></tr><tr><th scope="row">Controls</th><td>48px minimum</td><td>Useful touch and keyboard targets</td></tr></tbody></table></div></section>
<section class="of-component-group"><h2>Accordions</h2><div class="of-accordion"><details><summary>How do I install this exact theme?</summary><p>Download the complete kit. Read INSTALL.md, run install-theme.mjs against your project, and attach the exact data-openform attribute to your root or intended subtree.</p></details><details><summary>Can I use it with my existing application?</summary><p>Yes. Use theme.css and map your components to the provided of-* classes. Preserve your routes, application data, interactions, and actual business content.</p></details></div></section>
<section class="of-component-group"><h2>The complete identity</h2><img src="./identity-board.svg" alt="${esc(brand.name+' complete visual identity')}" width="1600" height="1200" loading="lazy"></section>
</main>${footer(brand)}`)
}

export function themeRuntime() {
  return `// Progressive enhancement for the reference pages only. No dependencies.
document.querySelectorAll('.of-mobile-links a').forEach(link => {
  link.addEventListener('click', () => link.closest('details')?.removeAttribute('open'))
})
document.querySelectorAll('.of-demo-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault()
    const output = form.querySelector('.of-demo-message')
    if (output) {
      output.hidden = false
      output.textContent = 'This local reference form works. In your project, preserve or connect your real form handler.'
    }
  })
})
`
}

export function reactComponents(brand) {
  const stroke=brand.style==='Brutalist'?2.3:brand.style==='Elegant'?1.25:1.7
  return `import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

// Load /themes/${brand.id}/theme.css once in your document head.
// These components preserve ordinary React props and existing interaction handlers.
export function OpenformTheme({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-openform="${brand.id}" className={\`of-theme \${className}\`} {...props}>{children}</div>
}
export function ThemeContainer({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={\`of-container \${className}\`} {...props}>{children}</div>
}
export function ThemeButton({ children, className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  return <button type="button" className={\`of-button \${variant === 'secondary' ? 'of-button--ghost' : ''} \${className}\`} {...props}>{children}</button>
}
export function ThemeCard({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={\`of-card \${className}\`} {...props}><div className="of-card-body">{children}</div></div>
}
export function ThemeHeading({ children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={\`of-heading \${className}\`} {...props}>{children}</h2>
}
export function ThemeInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={\`of-input \${className}\`} {...props} />
}
export function ThemeBadge({ children, className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={\`of-badge \${className}\`} {...props}>{children}</span>
}
export function ThemeIcon({ name, title }: { name: keyof typeof paths; title?: string }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>{title && <title>{title}</title>}<path d={paths[name]} fill="none" stroke="currentColor" strokeWidth={${stroke}} strokeLinecap="${brand.style==='Brutalist'?'square':'round'}" strokeLinejoin="${brand.style==='Brutalist'?'miter':'round'}" /></svg>
}
export function ThemeHero({ title, description, actions, children }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; children?: ReactNode }) {
  return <section className="of-hero"><div className="of-container of-hero-inner"><div className="of-hero-copy"><p className="of-eyebrow">${esc(brand.system.eyebrow)}</p><h1 className="of-display">{title}</h1>{description && <p className="of-lede">{description}</p>}{actions && <div className="of-actions">{actions}</div>}</div>{children || <figure className="of-hero-media"><img src="/themes/${brand.id}/artwork.svg" alt="${esc(brand.system.direction)}" width="900" height="900" /></figure>}</div></section>
}
const paths = ${JSON.stringify(iconPaths,null,2)} as const
`
}

export function shortPrompt(brand) {
  return `Install the Openform "${brand.name}" Edition 02 theme in this project. The complete downloaded kit is available locally. Read AI-PROMPT.md and theme.json, run install-theme.mjs against this project's root, then follow reference.html and components.html to apply the exact system across the site. Preserve the existing content, routes, data, and functionality.`
}

export function implementationPrompt(brand,manifest) {
  const s=brand.system
  return `# Install the ${brand.name} theme — an implementation prompt for any coding model

## One-line request

${shortPrompt(brand)}

## Your task

Apply this exact identity to the user's existing website. This kit contains executable theme CSS, local fonts, original SVG assets, working HTML references, reusable React components, and a machine-readable specification. Use those supplied files as the implementation. Do not recreate the look from a verbal adjective.

## 1. Locate the kit and the project

Find the folder containing this AI-PROMPT.md, theme.json, theme.css, reference.html, and install-theme.mjs. Find the existing project root and identify its framework from its files. Read theme.json, INSTALL.md, reference.html, and components.html. Keep the current framework and dependency setup.

Run from the kit folder:

\`\`\`sh
node install-theme.mjs --target "/absolute/path/to/the/existing/project"
\`\`\`

The installer places the complete theme at public/themes/${brand.id}/ by default. For plain HTML with no public directory, use --public-dir . . For a custom static-assets folder, set --public-dir to that folder. It can attach the stylesheet and theme attribute to an existing HTML entry when --html is provided. Use --react to copy the supplied components into src/components/openform/${brand.id}.tsx when that is useful.

## 2. Load the exact theme

\`\`\`html
<link rel="stylesheet" href="/themes/${brand.id}/theme.css">
<html lang="en" data-openform="${brand.id}">
\`\`\`

The data-openform attribute can instead be on one existing root wrapper if the theme should affect only that subtree. Load the stylesheet once, after broad reset or framework styles. Preserve the supplied fonts/ directory next to theme.css. The fonts are local; do not substitute a Google Fonts request.

- Vite / plain HTML: add the link and root attribute to the existing index.html; the installer can do this with --html index.html.
- Next.js App Router: add the attribute to the existing root html or body in app/layout.tsx, and add the stylesheet link in its head. Preserve existing providers, metadata, children, and layout logic.
- Next.js Pages Router: use the existing document/root layout for the stylesheet and attribute.
- Vue / Svelte / Astro: use the existing document or root layout for the link and root attribute; use the HTML component classes below.
- React: optionally copy components.tsx into your existing source tree. It only depends on React and passes through ordinary props and handlers.

## 3. Exact visual specification

- Direction: **${s.direction}**.
- Concept: ${s.concept}
- Ink: **${brand.colors[0]}**. Accent: **${brand.colors[1]}**. Paper: **${brand.colors[2]}**. Support: **${brand.colors[3]}**.
- Display: **${manifest.typography.display.family}**, weight **${brand.weight}**, letter spacing **${brand.tracking/100}em**, line height **${manifest.typography.display.lineHeight}**. The supplied CSS handles the responsive size.
- Body: **${manifest.typography.body.family}**, 16px, weight 400, line height 1.7; keep reading lines at 65 characters or less.
- Page maximum width: **${s.maxWidth}px**. Gutters: **clamp(20px, 4vw, 64px)**. Section spacing: **clamp(64px, 9vw, 128px)**.
- Component corner radius: **${brand.radius}px**. Button shape: **${s.button}**. Borders: **${manifest.components.borderPx}px**. Buttons: at least **48px** high. Inputs: **52px** high.
- Information cards use quiet top dividers and **0px** corners. Keep one focal illustration, a clear type hierarchy, and generous reading space. Do not add decorative layers or dense application collages.
- Layout: ${s.layoutNote}
- Hero background: **${manifest.colors.heroBackground}**. Hero foreground: **${manifest.colors.heroForeground}**. Alignment: **${s.alignment}**.
- Desktop hero text / image proportion: **${Math.round(s.split*100)} / ${Math.round((1-s.split)*100)}**. At 960px the hero becomes one column. At 640px the card grid becomes one column and the mobile navigation takes over.

Identity-specific constraints:
${brand.rules.map((rule,i)=>`${i+1}. ${rule}`).join('\n')}

## 4. Map existing components to the actual provided classes

Use the existing content and existing components. Add these classes or use the included component primitives:

| Existing element | Provided class |
| --- | --- |
| Root wrapper | of-theme, plus data-openform="${brand.id}" |
| Page container | of-container |
| Header and navigation | of-header, of-nav, of-mobile-nav |
| Hero section / inner layout | of-hero / of-hero-inner |
| Hero copy / title / image | of-hero-copy / of-display / of-hero-media |
| Supporting large paragraph | of-lede |
| Section / heading row / heading | of-section / of-section-heading / of-heading |
| Reading text | of-body |
| Small uppercase label | of-eyebrow |
| Action group / primary button | of-actions / of-button |
| Secondary action | of-button of-button--ghost |
| Responsive card grid | of-grid |
| Card / image / body | of-card / of-card-image / of-card-body |
| Badge | of-badge |
| Form / labeled field | of-form / of-field |
| Input / select / textarea | of-input / of-select / of-textarea |
| Notice / table / accordion | of-notice / of-table / of-accordion |
| Footer | of-footer / of-footer-top / of-footer-bottom |

The working markup in reference.html and components.html is authoritative. Copy an appropriate structure, then replace only its demonstration copy with the real project copy. Preserve the real site's SEO metadata; the fictional reference pages' noindex metadata belongs only to the references. Do not replace a working form handler with the local demonstration form handler. Do not invent customer counts, endorsements, or statistics.

## 5. Exact asset paths after installation

\`\`\`text
/themes/${brand.id}/lockup.svg          Primary logo
/themes/${brand.id}/mark.svg            Compact symbol
/themes/${brand.id}/wordmark.svg        Wordmark
/themes/${brand.id}/monochrome.svg      One-color logo
/themes/${brand.id}/artwork.svg         Original hero artwork
/themes/${brand.id}/pattern.svg         Supporting pattern
/themes/${brand.id}/packaging.svg       Product / packaging study
/themes/${brand.id}/stationery.svg      Stationery study
/themes/${brand.id}/identity-board.svg  Complete visual reference
/themes/${brand.id}/reference.html      Working website reference
/themes/${brand.id}/components.html     Working component reference
\`\`\`

Use real img elements with descriptive alt text for meaningful images. Decorative patterns may be CSS backgrounds. Keep logos' aspect ratio. Use the real files rather than emoji, stock icons, placeholder URLs, or textual approximations of the symbol.

## 6. Apply it everywhere the user requested

Apply the type hierarchy, colors, containers, controls, cards, forms, data views, and footer across the existing pages. Keep navigation, route boundaries, application state, API calls, product data, and existing functionality intact. If a current utility class overrides an intended theme property, remove or update that specific conflicting visual utility; do not remove unrelated layout or behavior.

## 7. Finish and verify

${manifest.acceptance.map((check,i)=>`${i+1}. ${check}`).join('\n')}

Compare the completed pages to the working reference at desktop and mobile sizes. Report the files changed, the theme path, and the checks actually performed. Implement the result; do not stop at a plan.

## License

Original artwork and design information: CC0-1.0. Theme code and installer: MIT. Font files: original SIL OFL licenses included. Preserve code and font notices when redistributing those files.
`
}

export function installationGuide(brand) {
  return `# Install ${brand.name} / Openform Edition 02

## Let a coding model do it

Unzip the complete kit into a folder your coding assistant can read. Give it this instruction:

> ${shortPrompt(brand)}

AI-PROMPT.md provides the full ordered implementation instructions. theme.json provides exact values. reference.html and components.html provide executable ground truth.

## One command to install the files

Requires Node.js 18 or newer. No npm dependencies.

\`\`\`sh
node install-theme.mjs --target "/path/to/your/project"
\`\`\`

This copies the supplied files to public/themes/${brand.id}/. It does not replace your application code.

### Also attach it to a Vite or plain HTML document

\`\`\`sh
node install-theme.mjs --target "/path/to/your/project" --html index.html
\`\`\`

The --html option inserts one stylesheet link and the exact data-openform root attribute into the chosen existing HTML file. It is idempotent. It saves the original entry once as index.html.openform-backup.

For a plain static site served directly from its root:

\`\`\`sh
node install-theme.mjs --target "/path/to/site" --public-dir . --html index.html
\`\`\`

### Optional React components

\`\`\`sh
node install-theme.mjs --target "/path/to/project" --react
\`\`\`

This additionally copies components.tsx to src/components/openform/${brand.id}.tsx. The file contains OpenformTheme, ThemeHero, ThemeButton, ThemeCard, ThemeHeading, ThemeInput, ThemeBadge, ThemeContainer, and ThemeIcon. No other libraries are needed.

## Manual installation

Copy the complete kit to your static assets folder, keep fonts/ beside theme.css, then:

\`\`\`html
<html lang="en" data-openform="${brand.id}">
  <head><link rel="stylesheet" href="/themes/${brand.id}/theme.css"></head>
  <body class="brand-surface">
    <main class="of-container of-section">
      <img class="of-logo" src="/themes/${brand.id}/lockup.svg" alt="${brand.name}">
      <h1 class="of-display">Your real project headline.</h1>
      <p class="of-body">Your real project description.</p>
      <a class="of-button" href="/your-existing-route">Your real action</a>
    </main>
  </body>
</html>
\`\`\`

For frameworks, add the link and attribute in the existing root/document layout. The theme is framework-independent CSS. Put the CSS after broad resets and map your existing components to the of-* classes. The installer report prints the exact public paths.

## Preview without a build

Open reference.html or components.html in your browser after unzipping the kit. Fonts, CSS, SVGs, and the small reference script are local. No service or account is required.

## What the theme does

It supplies the exact font pairings, scoped tokens, base typography, grid, hero, navigation, controls, cards, forms, tables, notices, accordions, and footer. A model or developer maps those ready-to-use components onto your existing application; the installer alone does not infer or restructure your business UI.

## Check the result

- Local font and image requests succeed.
- The right root carries data-openform="${brand.id}".
- Desktop and mobile match the included working references.
- Your actual routes, forms, data, and interaction handlers still work.
- Keyboard focus is visible and there is no horizontal page overflow.

Artwork: CC0. Code: MIT. Fonts: original SIL OFL notices included.
`
}
