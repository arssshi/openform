import { renderToString } from 'react-dom/server'
import { MotionConfig } from 'motion/react'
import App from './App'
import { brands, collections, styles } from './lib/catalog'
import { brandPath, collectionPath, guidePath, resolvePage, stylePath } from './lib/pages'
import { pageMeta } from './lib/seo'

export const routes = ['/', ...brands.map(b => brandPath(b.id)), ...styles.map(stylePath), ...collections.map(c => collectionPath(c.id)), guidePath]

export function render(path: string, origin = '') {
  return {
    html: renderToString(<MotionConfig reducedMotion="user"><App initialPath={path} /></MotionConfig>),
    meta: pageMeta(resolvePage(path), origin),
  }
}
