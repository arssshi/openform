import rawBrands from '../data/brands.json'
import rawFonts from '../data/fonts.json'
import rawCollections from '../data/collections.json'
import assetDefinitions from '../data/assets.json'
import systems from '../data/systems.json'
import type { Brand, Collection, FontInfo, Style } from '../types'
import { sitePath } from './site'

export const assets = assetDefinitions
export const brands: Brand[] = rawBrands.map((brand, index) => ({ ...brand, system: systems[brand.id as keyof typeof systems], number: index + 1, assets: assets.length })) as Brand[]
export const fonts: FontInfo[] = rawFonts
export const collections: Collection[] = rawCollections
export const styles: Style[] = ['Minimal', 'Organic', 'Playful', 'Editorial', 'Futuristic', 'Brutalist', 'Elegant', 'Retro']
export const industries = [...new Set(brands.map(brand => brand.category))].sort()
export const totalAssets = brands.reduce((count, brand) => count + brand.assets, 0)
export const fontFamily = (id: string) => fonts.find(font => font.id === id)?.family || 'DM Sans'
export const assetUrl = (id: string, file: string) => sitePath(`/brands/${id}/${file}`)
export const kitUrl = (id: string) => sitePath(`/downloads/${id}-brand-kit.zip`)

export function contrast(a: string, b: string) {
  const luminance = (hex: string) => {
    const values = hex.slice(1).match(/../g)!.map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    return .2126 * values[0] + .7152 * values[1] + .0722 * values[2]
  }
  const l1 = luminance(a), l2 = luminance(b)
  return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05)
}
