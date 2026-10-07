import { renderToString } from 'react-dom/server'
import { MotionConfig } from 'motion/react'
import App from './App'
import { brands, collections, styles } from './lib/catalog'
import { brandUrl, collectionUrl, guideUrl, resolvePage, styleUrl } from './lib/pages'
import { pageMeta } from './lib/seo'

export const routes = ['/', ...brands.map(b => brandUrl(b.id)), ...styles.map(styleUrl), ...collections.map(c => collectionUrl(c.id)), guideUrl]

export function render(path: string, origin = '') {
  return {
    html: renderToString(<MotionConfig reducedMotion="user"><App initialPath={path} /></MotionConfig>),
    meta: pageMeta(resolvePage(path), origin),
  }
}
