import { useState } from 'react'
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react'
import { assetUrl } from '../lib/catalog'
import type { Brand } from '../types'

const applications = [
  { file: 'identity-board.svg', name: 'The complete world', note: 'Original symbol, typography, palette, and composed applications.' },
  { file: 'artwork.svg', name: 'Signature artwork', note: 'An original illustration with its own visual idea and construction.' },
  { file: 'packaging.svg', name: 'Packaging & objects', note: 'The identity expressed through a product and its useful details.' },
  { file: 'stationery.svg', name: 'Print & correspondence', note: 'Letterhead, envelopes, and small printed objects in one language.' },
  { file: 'website.svg', name: 'The digital direction', note: 'The typographic hierarchy, layout, controls, and visual rhythm.' },
  { file: 'poster.svg', name: 'The campaign', note: 'A display-scale composition with a confident point of view.' },
  { file: 'business-card.svg', name: 'The small details', note: 'Front-and-back cards with considered scale and information hierarchy.' },
  { file: 'social-story.svg', name: 'A vertical story', note: 'A ready-to-use vertical application for a different kind of canvas.' },
]

export default function Applications({ brand }: { brand: Brand }) {
  const [selected, setSelected] = useState(0)
  const active = applications[selected]
  return <>
    <div className="panel-intro"><span className="eyebrow">A COMPLETE WORLD, IN PRACTICE</span><h3>{brand.system.direction}.</h3><p>{brand.system.concept}</p></div>
    <div className="applications-view"><div className="application-menu" aria-label="Choose an identity application">{applications.map((item, index) => <button key={item.file} onClick={() => setSelected(index)} aria-pressed={selected === index}><span>0{index + 1}</span><strong>{item.name}</strong></button>)}</div><div className="application-main"><div className="application-stage"><img key={active.file} src={assetUrl(brand.id, active.file)} alt={`${brand.name}: ${active.name}`} /></div><div className="application-caption"><div><h4>{active.name}</h4><p>{active.note}</p></div><a className="icon-button bordered" href={assetUrl(brand.id, active.file)} download aria-label={`Download ${brand.name} ${active.name}`}><ArrowDownToLine size={17} /></a><a className="icon-button bordered" href={assetUrl(brand.id, active.file)} target="_blank" rel="noreferrer" aria-label={`Open ${brand.name} ${active.name} at full size`}><ArrowUpRight size={17} /></a></div></div></div>
    <div className="application-footnote">Original vector artwork. Outlined typography. Yours to use, edit, and make your own.</div>
  </>
}
