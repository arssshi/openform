import { brands, fontFamily } from './catalog'
import { brandPath, collectionPath, guidePath, questions, styleNotes, stylePath } from './pages'
import { siteBasePath, sitePath } from './site'
import type { PageRoute } from './pages'

export interface PageMeta { title: string; description: string; path: string; image: string; robots: string; graph: object[] }
export const configuredOrigin = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')
const joinSiteUrl = (path: string, site: string) => new URL(path.replace(/^\/+/, ''), `${site.replace(/\/$/, '')}/`).href
export const absoluteUrl = (path: string, origin = configuredOrigin) => origin ? joinSiteUrl(path, origin) : sitePath(path)

export function pageMeta(route: PageRoute, origin = configuredOrigin): PageMeta {
  const url = (path: string) => absoluteUrl(path, origin)
  const publisher = { '@type': 'Organization', '@id': url('/#openform'), name: 'Openform', url: url('/'), logo: url('/favicon.svg') }
  let title = 'Free Brand Identity Kits & Design Inspiration | Openform'
  let description = 'Find your next brand identity. Explore 48 original logo, color, and typography systems. Download free kits, local fonts, and ready-to-install website themes.'
  let image = '/social-preview.png'
  const graph: object[] = []
  const breadcrumb = (name: string, path: string) => graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Openform', item: url('/') }, { '@type': 'ListItem', position: 2, name, item: url(path) }] })
  if (route.kind === 'brand') {
    const b = route.brand
    title = `${b.name} — ${b.style} Brand Identity & Free Theme | Openform`
    description = `Explore ${b.name}: ${b.system.direction.toLowerCase()}. Original SVG logos, ${fontFamily(b.heading)} typography, a named palette, and a free installable website theme.`
    image = `/social/${b.id}.png`
    breadcrumb(b.name, route.path)
    graph.push({ '@type': 'CreativeWork', name: `${b.name} brand identity`, description: b.system.concept, url: url(route.path), image: url(image), genre: b.style, creator: { '@id': url('/#openform') }, license: 'https://creativecommons.org/publicdomain/zero/1.0/', isAccessibleForFree: true, keywords: [b.category, b.style, b.system.direction] })
  } else if (route.kind === 'style') {
    title = `${route.style} Brand Identity Inspiration & Free Kits | Openform`
    description = `${styleNotes[route.style].intro} Explore original ${route.style.toLowerCase()} logos, palettes, fonts, and free website themes.`
    breadcrumb(`${route.style} design`, stylePath(route.style))
  } else if (route.kind === 'collection') {
    title = `${route.collection.name} — Brand Design Collection | Openform`
    description = `${route.collection.description} Explore ${route.collection.ids.length} complete identities with original logos, typography, palettes, and installable themes.`
    breadcrumb(route.collection.name, collectionPath(route.collection.id))
  } else if (route.kind === 'guide') {
    title = 'How to Install a Brand Theme on Your Website | Openform'
    description = 'A practical guide to applying a complete Openform identity: install local files, load the CSS, map your components, and verify typography, accessibility, and mobile layouts.'
    breadcrumb('Install a brand theme', guidePath)
    graph.push({ '@type': 'TechArticle', headline: 'How to install an Openform brand theme', description, url: url(guidePath), image: url(image), author: { '@id': url('/#openform') }, publisher: { '@id': url('/#openform') }, inLanguage: 'en', isAccessibleForFree: true })
  }
  if (route.kind === 'home') {
    graph.push({ '@type': 'WebSite', '@id': url('/#website'), name: 'Openform', url: url('/'), description, publisher: { '@id': url('/#openform') }, inLanguage: 'en', potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: url('/?q={search_term_string}#library') }, 'query-input': 'required name=search_term_string' } })
    graph.push({ '@type': 'FAQPage', mainEntity: questions.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) })
  }
  if (['home', 'style', 'collection'].includes(route.kind)) {
    const list = brands.filter(b => route.kind === 'style' ? b.style === route.style : route.kind === 'collection' ? b.collection === route.collection.id : true)
    graph.push({ '@type': 'ItemList', name: route.kind === 'home' ? 'Openform brand identity library' : title.split(' | ')[0], numberOfItems: list.length, itemListElement: list.map((b, index) => ({ '@type': 'ListItem', position: index + 1, name: b.name, url: url(brandPath(b.id)) })) })
  }
  graph.unshift(publisher)
  const notFound = route.kind === 'not-found'
  return { title: notFound ? 'Page Not Found | Openform' : title, description: description.length > 175 ? description.slice(0, 172).replace(/\s+\S*$/, '') + '…' : description, path: route.path, image, robots: notFound ? 'noindex, follow' : 'index, follow, max-image-preview:large', graph: notFound ? [] : graph }
}

export function updatePageMeta(route: PageRoute) {
  const publicSite = configuredOrigin || `${location.origin}${siteBasePath}`
  const meta = pageMeta(route, publicSite)
  if (route.kind === 'brand' && !document.getElementById('openform-brand-fonts')) {
    const fonts = document.createElement('link')
    fonts.id = 'openform-brand-fonts'
    fonts.rel = 'stylesheet'
    fonts.href = sitePath('/fonts/fonts.css')
    document.head.append(fonts)
  }
  document.title = meta.title
  const set = (attribute: 'name' | 'property', key: string, content: string) => {
    let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
    if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element) }
    element.content = content
  }
  set('name', 'description', meta.description)
  const filtered = ['q', 'style', 'industry', 'collection'].some(key => new URLSearchParams(location.search).has(key))
  set('name', 'robots', filtered ? 'noindex, follow' : meta.robots)
  for (const [key, value] of Object.entries({ title: meta.title, description: meta.description, type: route.kind === 'guide' ? 'article' : 'website', url: absoluteUrl(meta.path, publicSite), image: absoluteUrl(meta.image, publicSite), 'image:alt': route.kind === 'brand' ? `${route.brand.name} original brand identity` : 'Openform — original brand identities and free website themes' })) set('property', `og:${key}`, value)
  for (const [key, value] of Object.entries({ card: 'summary_large_image', title: meta.title, description: meta.description, image: absoluteUrl(meta.image, publicSite) })) set('name', `twitter:${key}`, value)
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
  canonical.href = absoluteUrl(meta.path, publicSite)
  let structured = document.getElementById('openform-schema') as HTMLScriptElement | null
  if (!structured) { structured = document.createElement('script'); structured.id = 'openform-schema'; structured.type = 'application/ld+json'; document.head.append(structured) }
  structured.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': meta.graph })
}
