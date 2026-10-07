import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, Bookmark, Check, Download, GitBranch, Github, GitPullRequest, Menu, Plus, X } from 'lucide-react'
import BrandDetail from './components/BrandDetail'
import Guide from './components/Guide'
import InfoDialog from './components/InfoDialog'
import Library from './components/Library'
import { assetUrl, brands, collections, totalAssets } from './lib/catalog'
import { brandUrl, collectionUrl, guideUrl, questions, resolvePage, styleNotes, styleUrl } from './lib/pages'
import { updatePageMeta } from './lib/seo'
import { sitePath } from './lib/site'

function Mark() { return <span className="site-mark" aria-hidden="true"><i /><i /><i /><i /></span> }
function readSaved(): string[] { try { const value: unknown = JSON.parse(localStorage.getItem('openform-saved') || '[]'); return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && brands.some(b => b.id === id)))] : [] } catch { return [] } }
const repoUrl = import.meta.env.VITE_REPO_URL || 'https://github.com/arssshi/openform'

export default function App({ initialPath = '/' }: { initialPath?: string }) {
  const route = resolvePage(typeof location === 'undefined' ? initialPath : location.pathname)
  const [saved, setSaved] = useState<string[]>([])
  const [savedOnly, setSavedOnly] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [info, setInfo] = useState<'contribute' | 'license' | null>(null)
  const [toast, setToast] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const browse = ['home', 'style', 'collection'].includes(route.kind)

  useEffect(() => {
    updatePageMeta(route)
    setSaved(readSaved())
    const sync = (event: StorageEvent) => { if (event.key === 'openform-saved') setSaved(readSaved()) }
    window.addEventListener('storage', sync)
    const legacy = location.hash.match(/^#brand\/([a-z0-9-]+)$/)
    if (legacy && brands.some(b => b.id === legacy[1])) location.replace(brandUrl(legacy[1]))
    const closeMenu = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenu(false) }
    window.addEventListener('keydown', closeMenu)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('keydown', closeMenu); if (timer.current) clearTimeout(timer.current) }
  // A native page navigation remounts the application with the next stable route.
  }, [])

  const notify = useCallback((message: string) => { setToast(message); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setToast(''), 2600) }, [])
  const toggleSave = useCallback((id: string) => {
    const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id]
    setSaved(next)
    try { localStorage.setItem('openform-saved', JSON.stringify(next)) } catch { /* The current session still retains the selection. */ }
    notify(next.includes(id) ? 'Saved. A little inspiration for later.' : 'Removed from your saved identities.')
  }, [saved, notify])
  const changeSavedOnly = useCallback((value: boolean) => setSavedOnly(value), [])
  function showSaved() { if (browse) { setSavedOnly(!savedOnly); document.getElementById('library')?.scrollIntoView({ behavior: 'instant' }) } else location.assign(sitePath('/?saved=1#library')) }

  return <>
    <a className="skip-link" href={route.kind === 'guide' || route.kind === 'brand' || route.kind === 'not-found' ? '#main' : '#library'}>Skip to the main content</a>
    <header className="site-header"><div className="site-header-inner container">
      <a href={sitePath('/')} className="site-wordmark" aria-label="Openform home"><Mark />openform<span aria-hidden="true">✳</span></a>
      <nav className="site-nav" aria-label="Main navigation"><a href={sitePath('/#library')} aria-current={browse ? 'page' : undefined}>Explore<span>{brands.length}</span></a><a href={sitePath('/#collections')}>Collections</a><a href={guideUrl}>How it works<ArrowUpRight size={13} /></a></nav>
      <div className="site-header-actions"><button className={`site-saved ${savedOnly ? 'selected' : ''}`} aria-label={`Show ${saved.length} saved identities`} aria-pressed={savedOnly} onClick={showSaved}><Bookmark size={18} fill={savedOnly ? 'currentColor' : 'none'} /><span>Saved{saved.length > 0 && <b>{saved.length}</b>}</span></button><a className="button button-dark header-download" href={sitePath('/downloads/openform-complete-library.zip')} download>Get the library<Download size={16} /></a><button className="mobile-menu-button icon-button" aria-label={mobileMenu ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenu} aria-controls="mobile-navigation" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={22} /> : <Menu size={22} />}</button></div>
    </div>{mobileMenu && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation"><a href={sitePath('/#library')} onClick={() => setMobileMenu(false)}>Explore the library<ArrowUpRight size={16} /></a><a href={sitePath('/#collections')} onClick={() => setMobileMenu(false)}>Collections<ArrowUpRight size={16} /></a><a href={guideUrl} onClick={() => setMobileMenu(false)}>How it works<ArrowUpRight size={16} /></a><a href={sitePath('/downloads/openform-complete-library.zip')} download onClick={() => setMobileMenu(false)}>Download the library<Download size={16} /></a></nav>}</header>

    {browse && <main id="main">
      {route.kind === 'home' ? <>
        <section className="studio-hero container" aria-labelledby="hero-title"><div className="studio-hero-copy"><span className="eyebrow hero-kicker"><span className="status-dot" />INDEPENDENT DESIGN. OPEN POSSIBILITIES.</span><h1 id="hero-title">A good idea.<br />A great <em>identity.</em></h1><p>A thoughtfully made collection of brand identities.<br className="desktop-break" /> Find your inspiration. Make it your own.<br className="desktop-break" /> Build something that feels like you.</p><div className="hero-actions"><a href="#library" className="button button-dark">Find your starting point<ArrowDown size={17} /></a><a className="text-link" href={guideUrl}>More than a moodboard<ArrowUpRight size={16} /></a></div><div className="hero-proof"><span><Check size={15} />Free to use. Made to be used.</span><span>{brands.length} original identities</span></div></div><div className="repo-hero-panel" aria-label="Openform open source repository"><div className="repo-panel-grid" aria-hidden="true" /><div className="repo-panel-orbit repo-panel-orbit-one" aria-hidden="true" /><div className="repo-panel-orbit repo-panel-orbit-two" aria-hidden="true" /><div className="repo-panel-topline"><span><Github size={15} />ARSSSHI / OPENFORM</span><span className="repo-public"><i />PUBLIC</span></div><div className="repo-panel-copy"><span className="eyebrow">OPEN SOURCE DESIGN SYSTEMS</span><h2>48 visual worlds.<br /><em>One open library.</em></h2><p>Original identity kits, self-hosted fonts, installable website themes, and the tools to make a good starting point yours.</p><a className="repo-panel-link" href={repoUrl} target="_blank" rel="noreferrer">View the repository<ArrowUpRight size={17} /></a></div><div className="repo-panel-stats"><span><strong>48</strong><small>identities</small></span><span><strong>1,440</strong><small>primary files</small></span><span><strong>MIT · CC0</strong><small>open licenses</small></span></div><div className="repo-panel-terminal"><span className="repo-terminal-label"><i /><i /><i /><b>main</b></span><code>git clone github.com/arssshi/openform</code><span className="repo-build"><i />building in public</span></div><div className="repo-panel-actions"><span><GitBranch size={15} /> versioned source</span><span><GitPullRequest size={15} /> open to contribution</span></div></div></section>
        <div className="studio-manifesto container"><span>GOOD DESIGN IS A BETTER BEGINNING.</span><p>Original marks. Considered type. <em>Everything belongs.</em></p><ArrowDown size={18} /></div>
      </> : <section className="browse-hero container"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href={sitePath('/')}>Openform</a><span>/</span><span>{route.kind === 'style' ? 'Design styles' : 'Collections'}</span></nav><span className="eyebrow">{route.kind === 'style' ? `${route.style.toUpperCase()} / A DIFFERENT DIRECTION` : 'A CURATED POINT OF VIEW'}</span><h1>{route.kind === 'style' ? <>{route.style} identities.<br /><em>{styleNotes[route.style].headline}</em></> : <>{route.kind === 'collection' && route.collection.name}<span className="heading-dot">.</span></>}</h1><p>{route.kind === 'style' ? styleNotes[route.style].intro : route.kind === 'collection' ? route.collection.description : ''}</p></section>}
      <Library route={route} saved={saved} savedOnly={savedOnly} onSavedOnly={changeSavedOnly} onSave={toggleSave} />

      <section className="studio-collections container" id="collections" aria-labelledby="collections-title"><div className="library-heading"><div><span className="eyebrow">A LITTLE CURATION</span><h2 id="collections-title">Follow a <em>feeling.</em></h2></div><p>Different moods.<br />The same room for possibility.</p></div><div className="studio-collection-grid">{collections.map((item, index) => <a className="studio-collection-card" key={item.id} href={collectionUrl(item.id)} style={{ background: item.color, color: item.ink }}><span className="collection-index">0{index + 1} / {item.ids.length} identities</span><img src={assetUrl(item.ids[0], 'mark.svg')} alt="" width="160" height="160" loading="lazy" /><div><h3>{item.name}</h3><ArrowUpRight size={21} /></div><p>{item.description}</p></a>)}</div></section>

      <section className="studio-how" id="how-it-works" aria-labelledby="how-title"><div className="container"><div className="how-heading"><span className="eyebrow">INSPIRATION, WITH A NEXT STEP.</span><h2 id="how-title">Made to inspire.<br /><em>Ready to build.</em></h2><p>A complete system without the complexity.<br />Take the good idea all the way to your website.</p><a href={guideUrl} className="button button-light">See how it works<ArrowUpRight size={17} /></a></div><div className="how-steps">{[
        ['Find your starting point.', 'Explore the mark, typography, palette, and the feeling that holds them together.'],
        ['Make it feel like you.', 'Try your words. Use the original files. Adapt the system to your actual project.'],
        ['Take it to the web.', 'Install the local theme, or give your coding assistant the exact implementation prompt.'],
      ].map(([title, text], index) => <div key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Plus size={20} /></div>)}</div></div></section>

      <section className="studio-faq container" aria-labelledby="faq-title"><div><span className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</span><h2 id="faq-title">Open by default.<br /><em>Simple by design.</em></h2><button className="text-link" onClick={() => setInfo('license')}>The license story<ArrowRight size={16} /></button></div><div className="faq-list">{questions.map(item => <details key={item.question}><summary>{item.question}<Plus size={18} /></summary><p>{item.answer}</p></details>)}</div></section>
    </main>}

    {route.kind === 'brand' && <main className="identity-page container" id="main"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href={sitePath('/')}>Openform</a><span>/</span><a href={styleUrl(route.brand.style)}>{route.brand.style}</a><span>/</span><span>{route.brand.name}</span></nav><BrandDetail standalone brand={route.brand} saved={saved.includes(route.brand.id)} onSave={toggleSave} onClose={() => location.assign(sitePath('/#library'))} notify={notify} /></main>}
    {route.kind === 'guide' && <Guide />}
    {route.kind === 'not-found' && <main id="main" className="not-found container"><span className="eyebrow">404 / A DIFFERENT DIRECTION</span><h1>This page took<br /><em>another path.</em></h1><p>There is plenty of good design back in the library.</p><a className="button button-dark" href={sitePath('/')}>Explore Openform<ArrowRight size={17} /></a></main>}

    <footer className="studio-footer container"><div className="footer-intro"><p>A better beginning,<br /><em>for your next thing.</em></p><button className="text-link" onClick={() => setInfo('contribute')}>A little better, together<ArrowUpRight size={17} /></button></div><a className="footer-wordmark" href={sitePath('/')} aria-label="Openform home">openform<span>.</span><Mark /></a><div className="footer-links"><span>Original design. Shared openly.</span><nav aria-label="Footer navigation"><a href={sitePath('/#library')}>Explore</a><a href={guideUrl}>Design notes</a><button onClick={() => setInfo('license')}>Licenses</button><button onClick={() => setInfo('contribute')}>Open source<ArrowUpRight size={13} /></button></nav></div><details className="identity-directory"><summary>Browse all {brands.length} brand identities<Plus size={14} /></summary><nav aria-label="Complete identity directory">{brands.map(b => <a key={b.id} href={brandUrl(b.id)}>{b.name}</a>)}</nav></details><div className="footer-small"><span>{brands.length} identities · {totalAssets.toLocaleString('en-US')} primary files · Made with care.</span><span>Artwork CC0 · Theme code MIT · Fonts OFL</span><a href={sitePath('/downloads/openform-source.zip')} download>Download source<ArrowDownToLine size={12} /></a></div></footer>
    {info && <InfoDialog mode={info} onClose={() => setInfo(null)} />}
    <div className="toast-region" role="status" aria-live="polite"><AnimatePresence>{toast && <motion.div className="toast" key={toast} initial={{ opacity: 0, transform: 'translateY(6px)' }} animate={{ opacity: 1, transform: 'translateY(0)' }} exit={{ opacity: 0 }} transition={{ duration: .18 }}><Check size={16} /><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15} /></button></motion.div>}</AnimatePresence></div>
  </>
}
