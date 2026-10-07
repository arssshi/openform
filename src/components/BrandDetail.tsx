import { useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Bookmark, Check, CheckCheck, FileCode2, Image, Palette, Share2, Type } from 'lucide-react'
import Dialog from './Dialog'
import InstallTheme from './InstallTheme'
import Applications from './Applications'
import { assets, assetUrl, brands, contrast, fontFamily, kitUrl } from '../lib/catalog'
import type { Brand } from '../types'
import { brandUrl } from '../lib/pages'

interface Props {
  brand: Brand
  saved: boolean
  onClose: () => void
  onSave: (id: string) => void
  notify: (message: string) => void
  initialTab?: BrandTab
  standalone?: boolean
}

const tabs = ['Overview', 'Applications', 'Assets', 'Type playground', 'Install theme'] as const
export type BrandTab = typeof tabs[number]

export default function BrandDetail({ brand, saved, onClose, onSave, notify, initialTab = 'Overview', standalone = false }: Props) {
  const [tab, setTab] = useState<BrandTab>(initialTab)
  const [assetGroup, setAssetGroup] = useState('all')
  const [sample, setSample] = useState(brand.tagline)
  const [size, setSize] = useState(64)
  const [surface, setSurface] = useState<'paper' | 'accent' | 'ink'>('paper')
  const [copied, setCopied] = useState('')
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current) }, [])
  useEffect(() => { if (standalone && location.hash === '#install') setTab('Install theme') }, [standalone])
  const related = brands.filter(item => item.style === brand.style && item.id !== brand.id).slice(0, 3)
  const visibleAssets = assets.filter(([file]) => assetGroup === 'all' || (assetGroup === 'art' && file.endsWith('.svg')) || (assetGroup === 'instructions' && file.endsWith('.md')) || (assetGroup === 'theme' && !file.endsWith('.svg') && !file.endsWith('.md')))

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(''), 1800)
      notify(`${label} copied to clipboard`)
    } catch { notify('Clipboard unavailable. You can select and copy the value directly.') }
  }

  function selectTab(index: number) {
    const next = tabs[(index + tabs.length) % tabs.length]
    setTab(next)
    document.getElementById(`brand-tab-${tabs.indexOf(next)}`)?.focus()
  }

  const Heading = standalone ? 'h1' : 'h2'
  const content = (
    <>
      <div className="detail-topline"><span className="eyebrow">IDENTITY {String(brand.number).padStart(3, '0')} / EDITION 02 / OPENFORM ORIGINAL</span><span className="detail-license"><span className="status-dot" /> Assets CC0 · Theme MIT</span></div>
      <div className="detail-heading"><div><Heading style={{ fontFamily: fontFamily(brand.heading), fontWeight: brand.weight, letterSpacing: `${brand.tracking / 100}em` }}>{brand.name}</Heading><p>{brand.category}<span className="meta-dot">·</span>{brand.style}<span className="meta-dot">·</span>{brand.assets} primary files</p></div><div className="detail-actions"><button className="icon-button bordered" aria-label={`${saved ? 'Unsave' : 'Save'} ${brand.name}`} aria-pressed={saved} onClick={() => onSave(brand.id)}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button><button className="icon-button bordered" aria-label="Copy link to this identity" onClick={() => copy(`${location.origin}${brandUrl(brand.id)}`, 'Identity link')}><Share2 size={18} /></button><a className="button button-dark" href={kitUrl(brand.id)} download><ArrowDownToLine size={17} /> Download kit</a></div></div>
      <div className="detail-tabs" role="tablist" aria-label="Brand system sections">{tabs.map((item, index) => <button key={item} className={item === 'Install theme' ? 'install-tab' : ''} role="tab" id={`brand-tab-${index}`} aria-selected={tab === item} aria-controls="brand-tab-panel" tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)} onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); selectTab(index + 1) } if (event.key === 'ArrowLeft') { event.preventDefault(); selectTab(index - 1) } if (event.key === 'Home') { event.preventDefault(); selectTab(0) } if (event.key === 'End') { event.preventDefault(); selectTab(tabs.length - 1) } }}>{item}{item === 'Assets' && <span>{brand.assets}</span>}{item === 'Install theme' && <ArrowUpRight size={13} />}</button>)}</div>
      <div id="brand-tab-panel" role="tabpanel" aria-labelledby={`brand-tab-${tabs.indexOf(tab)}`} className="detail-panel" tabIndex={0}>
        {tab === 'Overview' && <>
          <div className="detail-overview"><img className="detail-preview" src={assetUrl(brand.id, 'preview.svg')} width="960" height="720" alt={`${brand.name} complete identity and applications`} /><div className="detail-story"><span className="eyebrow">{brand.system.direction.toUpperCase()}</span><h3>{brand.tagline}</h3><p>{brand.system.concept}</p><div className="voice-block"><span className="eyebrow">HOW IT SOUNDS</span><p>{brand.voice}</p></div><button className="text-link" onClick={() => setTab('Applications')}>Explore the complete visual world <ArrowRight size={16} /></button><button className="button button-dark overview-install" onClick={() => setTab('Install theme')}>Install this identity <ArrowUpRight size={15} /></button></div></div>
          <div className="system-ready-band"><div><Check size={16} /><span><strong>A complete, installable system.</strong> Working CSS, local fonts, real components, and an exact AI implementation prompt.</span></div><button onClick={() => setTab('Install theme')}>See how it installs <ArrowRight size={15} /></button></div>
          <div className="detail-section"><div className="section-label"><Palette size={17} /><h3>A palette with purpose.</h3><span>Click a color to copy</span></div><div className="detail-palette">{brand.colors.map((color, index) => <button key={color} onClick={() => copy(color, color)} aria-label={`Copy ${brand.colorNames[index]} ${color}`}><span className="swatch" style={{ background: color }}>{copied === color && <Check size={25} style={{ color: contrast(color, '#FFFFFF') >= 4.5 ? '#FFFFFF' : '#202421' }} />}</span><span className="swatch-name">{brand.colorNames[index]}<span>{['Ink', 'Accent', 'Paper', 'Support'][index]}</span></span><code>{color}</code></button>)}</div><div className="contrast-note"><CheckCheck size={16} /><span>Ink on paper: <strong>{contrast(brand.colors[0], brand.colors[2]).toFixed(1)}:1</strong> · Ink on accent: <strong>{contrast(brand.colors[0], brand.colors[1]).toFixed(1)}:1</strong> · Both meet WCAG AA for normal text.</span></div></div>
          <div className="type-pairing detail-section"><div className="section-label"><Type size={18} /><h3>Type that sets the tone.</h3><span>Openly licensed · Included in your kit</span></div><div className="type-cards"><div><span className="eyebrow">DISPLAY / {fontFamily(brand.heading)}</span><span className="big-aa" style={{ fontFamily: fontFamily(brand.heading), fontWeight: brand.weight }}>Aa</span><p>Weight {brand.weight} · Tracking {brand.tracking / 100}em</p></div><div><span className="eyebrow">BODY / {fontFamily(brand.body)}</span><p className="type-sentence" style={{ fontFamily: fontFamily(brand.body) }}>The best ideas deserve a voice of their own.</p><p>SIL Open Font License · Self-hosted font files</p></div></div></div>
          <div className="detail-section"><div className="section-label"><h3>The little rules that make it distinct.</h3></div><ol className="brand-rules">{brand.rules.map((rule, index) => <li key={rule}><span>0{index + 1}</span><p>{rule}</p></li>)}</ol></div>
          <div className="detail-section related-section"><div className="section-label"><h3>A similar spirit. A different identity.</h3></div><div className="related-grid">{related.map(item => <a key={item.id} href={brandUrl(item.id)}><img src={assetUrl(item.id, 'preview.svg')} alt={`${item.name} identity`} width="960" height="720" loading="lazy" /><span>{item.name}<ArrowRight size={16} /></span></a>)}</div></div>
        </>}
        {tab === 'Applications' && <Applications brand={brand} />}
        {tab === 'Assets' && <><div className="panel-intro"><span className="eyebrow">BUILT TO BE USED</span><h3>Everything you need. Yours to make your own.</h3><p>Original vector artwork, a complete scoped theme, working references, a portable installer, and implementation instructions. The complete kit includes the local fonts and original licenses.</p></div><div className="asset-filters" aria-label="Choose asset category">{[['all', `All ${brand.assets} files`], ['art', 'Visual assets'], ['theme', 'Theme & components'], ['instructions', 'Instructions']].map(([value, name]) => <button key={value} onClick={() => setAssetGroup(value)} aria-pressed={assetGroup === value}>{name}</button>)}</div><div className="asset-grid">{visibleAssets.map(([file, name, format]) => <a key={file} className="asset-card" href={assetUrl(brand.id, file)} download><div className={`asset-preview ${file === 'monochrome.svg' ? 'mono' : ''}`} style={{ background: file === 'mark.svg' || file === 'lockup.svg' || file === 'wordmark.svg' ? brand.colors[2] : undefined }}>{file.endsWith('.svg') ? <img src={assetUrl(brand.id, file)} alt="" loading="lazy" /> : <div className="file-preview">{/\.(css|js|mjs|tsx|html)$/.test(file) ? <FileCode2 size={44} /> : file.endsWith('.json') ? <Palette size={44} /> : <Image size={44} />}<code>{file}</code></div>}</div><div className="asset-description"><div><h4>{name}</h4><p>{format}</p></div><ArrowDownToLine size={18} /></div></a>)}</div><div className="assets-footnote"><Check size={17} />Artwork CC0 · Theme code MIT · Original local fonts SIL OFL.</div></>}
        {tab === 'Type playground' && <><div className="panel-intro"><span className="eyebrow">MAKE IT SAY SOMETHING</span><h3>Try your words in this world.</h3><p>A live preview of the actual font pairing, colors, and typographic rhythm in this kit.</p></div><div className="playground-controls"><label>Your headline<input value={sample} onChange={event => setSample(event.target.value)} maxLength={140} placeholder="Your next big idea" /></label><label className="size-control">Size <span>{size}px</span><input type="range" aria-label="Headline font size" min="24" max="110" value={size} onChange={event => setSize(Number(event.target.value))} /></label><div><span className="control-label">Surface</span><div className="surface-controls">{(['paper', 'accent', 'ink'] as const).map(value => <button key={value} onClick={() => setSurface(value)} aria-pressed={surface === value}>{value.charAt(0).toUpperCase() + value.slice(1)}</button>)}</div></div></div><div className="type-playground" style={{ background: brand.colors[surface === 'ink' ? 0 : surface === 'accent' ? 1 : 2], color: brand.colors[surface === 'ink' ? 2 : 0] }}><img src={assetUrl(brand.id, 'mark.svg')} alt="" className={surface === 'ink' ? 'inverted-mark' : ''} /><p className="playground-heading" style={{ fontFamily: fontFamily(brand.heading), fontWeight: brand.weight, fontSize: size, letterSpacing: `${brand.tracking / 100}em` }}>{sample || 'Your next big idea.'}</p><p className="playground-body" style={{ fontFamily: fontFamily(brand.body) }}>Good design is more than a beautiful logo. It is a feeling, a rhythm, and a consistent way of showing up. Make this identity yours.</p><span className="eyebrow">{fontFamily(brand.heading)} + {fontFamily(brand.body)}</span></div></>}
        {tab === 'Install theme' && <InstallTheme brand={brand} notify={notify} />}
      </div>
      <div className="detail-bottom"><span>Distinct by design. Open by default.</span><a href={kitUrl(brand.id)} className="text-link" download>Get the complete {brand.name} kit <ArrowDownToLine size={16} /></a></div>
    </>
  )
  return standalone ? <section className="brand-page-detail" aria-label={`${brand.name} brand identity`}>{content}</section> : <Dialog label={`${brand.name} brand system`} onClose={onClose} className="brand-dialog">{content}</Dialog>
}
