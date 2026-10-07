import { ArrowUpRight, Bookmark, Download } from 'lucide-react'
import { assetUrl, kitUrl } from '../lib/catalog'
import type { Brand } from '../types'
import { brandUrl } from '../lib/pages'

interface Props {
  brand: Brand
  saved: boolean
  onSave: (id: string) => void
}

export default function BrandCard({ brand, saved, onSave }: Props) {
  return (
    <article className="brand-card" data-brand={brand.id}>
      <div className="card-art">
        <a className="art-link" href={brandUrl(brand.id)} aria-label={`Explore ${brand.name} brand system`}>
          <img src={assetUrl(brand.id, 'preview.svg')} alt={`${brand.name} identity: ${brand.style.toLowerCase()} design in ${brand.colorNames[1].toLowerCase()} and ${brand.colorNames[0].toLowerCase()}`} loading="lazy" width="960" height="720" />
          <span className="card-hover"><span>Explore the identity <ArrowUpRight size={17} /></span></span>
        </a>
        <span className="card-number">{String(brand.number).padStart(3, '0')}</span>
        <button className={`save-button icon-button ${saved ? 'is-saved' : ''}`} onClick={() => onSave(brand.id)} aria-label={`${saved ? 'Unsave' : 'Save'} ${brand.name}`} aria-pressed={saved}>
          <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="card-info">
        <div className="card-heading"><a href={brandUrl(brand.id)}>{brand.name}<ArrowUpRight size={16} /></a><div className="mini-palette" aria-label={`${brand.name} color palette`}>{brand.colors.map(color => <span key={color} style={{ background: color }} title={color} />)}</div></div>
        <p className="card-direction">{brand.system.direction}</p>
        <div className="card-meta"><span>{brand.category}<span className="meta-dot">·</span>{brand.style}</span><a href={kitUrl(brand.id)} download aria-label={`Download ${brand.name} complete brand kit`}><Download size={13} /><span>{brand.assets} assets</span></a></div>
      </div>
    </article>
  )
}
