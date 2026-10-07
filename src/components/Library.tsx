import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Bookmark, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import BrandCard from './BrandCard'
import { brands, collections, fontFamily, industries, styles } from '../lib/catalog'
import { collectionUrl, styleNotes, styleUrl } from '../lib/pages'
import { sitePath } from '../lib/site'
import type { PageRoute } from '../lib/pages'

interface Props { route: PageRoute; saved: string[]; savedOnly: boolean; onSavedOnly: (value: boolean) => void; onSave: (id: string) => void }

export default function Library({ route, saved, savedOnly, onSavedOnly, onSave }: Props) {
  const baseStyle = route.kind === 'style' ? route.style : ''
  const baseCollection = route.kind === 'collection' ? route.collection.id : ''
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState('')
  const [collection, setCollection] = useState(baseCollection)
  const [sort, setSort] = useState('curated')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)
  const [initialized, setInitialized] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(location.search)
      setQuery(params.get('q') || '')
      setIndustry(industries.includes(params.get('industry') || '') ? params.get('industry')! : '')
      setCollection(collections.some(item => item.id === params.get('collection')) ? params.get('collection')! : baseCollection)
      onSavedOnly(params.get('saved') === '1')
    }
    restore()
    setInitialized(true)
    window.addEventListener('popstate', restore)
    const keyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) && !target.isContentEditable && !document.querySelector('dialog[open]')) {
        event.preventDefault()
        searchRef.current?.focus()
        document.getElementById('library')?.scrollIntoView({ behavior: 'instant' })
      }
    }
    window.addEventListener('keydown', keyboard)
    return () => { window.removeEventListener('popstate', restore); window.removeEventListener('keydown', keyboard) }
  }, [baseCollection, onSavedOnly])

  useEffect(() => {
    if (!initialized) return
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (industry) params.set('industry', industry)
    if (collection && collection !== baseCollection) params.set('collection', collection)
    if (savedOnly) params.set('saved', '1')
    const search = params.toString()
    history.replaceState(null, '', `${location.pathname}${search ? '?' + search : ''}${location.hash}`)
    document.querySelector('meta[name="robots"]')?.setAttribute('content', query || industry || (collection && collection !== baseCollection) || savedOnly ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    setVisibleCount(12)
  }, [query, industry, collection, savedOnly, initialized, baseCollection])

  const filtered = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    const result = brands.filter(brand => {
      const text = `${brand.name} ${brand.category} ${brand.style} ${brand.tagline} ${brand.system.direction} ${brand.system.concept} ${brand.system.product} ${brand.colorNames.join(' ')} ${brand.colors.join(' ')} ${fontFamily(brand.heading)} ${fontFamily(brand.body)}`.toLowerCase()
      return terms.every(term => text.includes(term)) && (!baseStyle || brand.style === baseStyle) && (!industry || brand.category === industry) && (!collection || brand.collection === collection) && (!savedOnly || saved.includes(brand.id))
    })
    if (sort === 'az') result.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'za') result.sort((a, b) => b.name.localeCompare(a.name))
    if (sort === 'curated') result.sort((a, b) => Number(b.featured) - Number(a.featured) || a.number - b.number)
    return result
  }, [query, baseStyle, industry, collection, savedOnly, saved, sort])

  function reset() { setQuery(''); setIndustry(''); setCollection(baseCollection); onSavedOnly(false) }

  return <section className="library-section container" id="library" aria-labelledby="library-title">
    <div className="library-heading"><div><span className="eyebrow">THE OPEN DESIGN LIBRARY</span><h2 id="library-title">Find your kind of <em>different.</em></h2></div><p>A clear idea. A complete identity.<br />A better starting point for your next thing.</p></div>
    <div className="library-toolbar">
      <div className="search-box"><Search size={20} /><label className="sr-only" htmlFor="brand-search">Search brand identities</label><input id="brand-search" ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="A name, a feeling, a typeface…" autoComplete="off" spellCheck={false} />{query ? <button className="icon-button" aria-label="Clear search" onClick={() => { setQuery(''); searchRef.current?.focus() }}><X size={17} /></button> : <kbd>/</kbd>}</div>
      <button className={`filter-button ${filtersOpen ? 'selected' : ''}`} onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="filter-panel"><SlidersHorizontal size={17} />Filters{(industry || (collection && !baseCollection)) && <span className="filter-dot" />}</button>
    </div>
    {filtersOpen && <div className="filter-panel" id="filter-panel">
      <label className="filter-control">Industry<span className="select-wrap"><select value={industry} onChange={event => setIndustry(event.target.value)}><option value="">Every industry</option>{industries.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></span></label>
      <label className="filter-control">Collection<span className="select-wrap"><select value={collection} onChange={event => setCollection(event.target.value)}><option value="">Every collection</option>{collections.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown size={15} /></span></label>
      <label className="saved-checkbox"><input type="checkbox" checked={savedOnly} onChange={event => onSavedOnly(event.target.checked)} /><Bookmark size={16} />Only my saved identities</label>
      <button className="text-link" onClick={reset}>Reset filters<X size={15} /></button>
    </div>}
    <nav className="style-filters" aria-label="Browse design styles"><a className={!baseStyle ? 'active' : ''} href={sitePath('/#library')} aria-current={!baseStyle ? 'page' : undefined}>All styles<span>{brands.length}</span></a>{styles.map(item => <a key={item} href={styleUrl(item)} className={baseStyle === item ? 'active' : ''} aria-current={baseStyle === item ? 'page' : undefined}>{item}</a>)}</nav>
    <div className="results-row"><div className="results-text" role="status" aria-live="polite"><span>{filtered.length} {filtered.length === 1 ? 'identity' : 'identities'}{savedOnly ? ' saved' : ''}</span>{savedOnly && <button className="active-chip" onClick={() => onSavedOnly(false)}>Saved<X size={12} /></button>}{collection && <a className="active-chip" href={collectionUrl(collection)}>{collections.find(item => item.id === collection)?.name}<ArrowRight size={12} /></a>}</div><label className="sort-control">Sort by<span className="select-wrap"><select value={sort} onChange={event => setSort(event.target.value)}><option value="curated">Curated order</option><option value="az">Name A–Z</option><option value="za">Name Z–A</option></select><ChevronDown size={14} /></span></label></div>
    {filtered.length ? <>
      <div className="brand-grid library-grid">{filtered.slice(0, visibleCount).map(brand => <BrandCard key={brand.id} brand={brand} saved={saved.includes(brand.id)} onSave={onSave} />)}</div>
      {filtered.length > visibleCount ? <div className="load-more"><button className="button button-outline" onClick={() => setVisibleCount(count => count + 12)}>A little more inspiration<ArrowDown size={17} /></button><span>Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} identities</span></div> : <p className="library-end">A different starting point. Yours to make your own.</p>}
    </> : <div className="empty-state"><Bookmark size={28} /><h3>{savedOnly && !saved.length ? 'Keep a little inspiration for later.' : 'Let’s try a different direction.'}</h3><p>{savedOnly && !saved.length ? 'Save an identity to build your own little collection.' : 'There are no matches for this combination. Try a different word or reset your filters.'}</p><button className="button button-dark" onClick={reset}>Reset this search<ArrowRight size={16} /></button></div>}
    {route.kind === 'style' && <div className="editorial-note"><span className="eyebrow">A NOTE ON {route.style.toUpperCase()} DESIGN</span><p>{styleNotes[route.style].advice}</p></div>}
  </section>
}
