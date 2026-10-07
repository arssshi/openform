import { brands, collections, styles } from './catalog'
import type { Brand, Collection, Style } from '../types'
import { sitePath, stripSitePath } from './site'

export const brandPath = (id: string) => `/brands/${id}/`
export const stylePath = (style: string) => `/styles/${style.toLowerCase()}/`
export const collectionPath = (id: string) => `/collections/${id}/`
export const guidePath = '/guides/install-brand-theme/'
export const brandUrl = (id: string) => sitePath(brandPath(id))
export const styleUrl = (style: string) => sitePath(stylePath(style))
export const collectionUrl = (id: string) => sitePath(collectionPath(id))
export const guideUrl = sitePath(guidePath)

export type PageRoute =
  | { kind: 'home'; path: '/' }
  | { kind: 'brand'; path: string; brand: Brand }
  | { kind: 'style'; path: string; style: Style }
  | { kind: 'collection'; path: string; collection: Collection }
  | { kind: 'guide'; path: string }
  | { kind: 'not-found'; path: string }

export function resolvePage(pathname: string): PageRoute {
  const cleanPath = stripSitePath(pathname)
  const path = cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/, '') + '/'
  if (path === '/' || path === '/index.html/') return { kind: 'home', path: '/' }
  const brand = brands.find(item => brandPath(item.id) === path)
  if (brand) return { kind: 'brand', path, brand }
  const style = styles.find(item => stylePath(item) === path)
  if (style) return { kind: 'style', path, style }
  const collection = collections.find(item => collectionPath(item.id) === path)
  if (collection) return { kind: 'collection', path, collection }
  if (path === guidePath) return { kind: 'guide', path }
  return { kind: 'not-found', path }
}

export const styleNotes: Record<Style, { headline: string; intro: string; advice: string }> = {
  Minimal: { headline: 'Less, but better.', intro: 'Quiet identities with a strong point of view. Clear geometry, purposeful typography, and space for the important things.', advice: 'Begin with the essentials: a useful mark, one clear type hierarchy, and a palette with a reason to exist. Restraint works when the proportions are considered, not when the design is simply empty.' },
  Organic: { headline: 'A little more natural.', intro: 'Grounded palettes, fluid forms, and thoughtful details. Brand systems with warmth, without the visual noise.', advice: 'Use natural references to inform shape and rhythm. Give expressive illustrations a calm reading surface, and keep product details, ingredients, and instructions comfortably legible.' },
  Playful: { headline: 'Make room for good things.', intro: 'Color with confidence. Shapes with personality. Friendly identities that make everyday things feel a little brighter.', advice: 'A playful identity needs a few memorable gestures, not decoration on every component. Keep navigation and reading text straightforward so the personality can come from the mark, display type, and color.' },
  Editorial: { headline: 'A point of view, well set.', intro: 'Expressive type, considered margins, and identities with something to say. Designed for stories worth staying with.', advice: 'Build a real hierarchy between display, reading text, and metadata. Give the words a comfortable measure, and use rules or annotations to organize information rather than fill empty space.' },
  Futuristic: { headline: 'For what comes next.', intro: 'Precise geometry, fresh color, and forward-looking typography. Digital identities with a human side.', advice: 'Use technical character without sacrificing usability. Clear labels, predictable controls, and readable data matter more than decorative interface effects. Let one distinctive graphic device carry the energy.' },
  Brutalist: { headline: 'A little less ordinary.', intro: 'Bold type. Direct color. Visible structure. Graphic identities that get to the point and make it count.', advice: 'Start with a clear grid and one strong statement. Contrast and scale can do the expressive work; controls, contact details, and long-form copy still need a dependable, readable hierarchy.' },
  Elegant: { headline: 'Beautifully considered.', intro: 'Graceful typography, quiet surfaces, and details that reward a closer look. A slower, more personal kind of identity.', advice: 'Make the care visible in spacing and proportion. Keep fine decorative lines away from essential information, and use high-contrast reading colors even when the palette is soft or tonal.' },
  Retro: { headline: 'Good character. New possibilities.', intro: 'Warm type, familiar forms, and a modern approach to nostalgic design. A good feeling, made useful.', advice: 'Borrow a sense of warmth rather than an entire historical layout. Balance characterful display lettering with clear reading text, accessible colors, and controls that work on modern screens.' },
}

export const questions = [
  { question: 'Are these brand identity kits really free?', answer: 'Yes. The original logos, artwork, palettes, and design information are released under CC0. Theme code is MIT, and the local fonts retain their included SIL Open Font License notices. Personal, client, and commercial projects are welcome.' },
  { question: 'What do I get in a complete kit?', answer: 'Each kit contains 30 primary files: editable SVG logos and applications, named colors, typography, design tokens, scoped CSS, working website and component references, an installer, and clear implementation instructions. Original font files and license notices are included too.' },
  { question: 'Can a coding assistant install the theme for me?', answer: 'Yes. Extract a kit where your assistant can read it and ask it to install that identity using AI-PROMPT.md. The prompt supplies exact paths, values, components, and verification steps. The installer copies the files; the assistant maps the design onto your existing application.' },
  { question: 'How should I use these for design inspiration?', answer: 'Explore the relationship between the mark, type, color, and spacing. Compare identities by style or collection, try your own words in the type playground, and open the real website reference. Use a complete system as a starting point, then adapt it thoughtfully to your own content.' },
]
