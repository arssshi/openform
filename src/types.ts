export type Style = 'Minimal' | 'Editorial' | 'Playful' | 'Organic' | 'Futuristic' | 'Brutalist' | 'Elegant' | 'Retro'

export interface Brand {
  id: string
  name: string
  category: string
  style: Style
  tagline: string
  description: string
  colors: [string, string, string, string]
  colorNames: [string, string, string, string]
  heading: string
  body: string
  weight: number
  tracking: number
  mark: string
  layout: string
  pattern: string
  radius: number
  voice: string
  rules: string[]
  collection: string
  featured: boolean
  number: number
  assets: number
  system: IdentitySystem
}

export interface IdentitySystem {
  direction: string
  concept: string
  art: string
  family: string
  mode: string
  alignment: string
  split: number
  maxWidth: number
  headingSize: number
  border: number
  button: string
  accentFont: string
  campaign: string[]
  headline: string[]
  eyebrow: string
  cta: string
  secondaryCta: string
  nav: string[]
  product: string
  productNote: string
  features: string[][]
  layoutNote: string
}

export interface FontInfo {
  id: string
  family: string
  file: string
  directory: string
  weight: string
  style?: string
}

export interface Collection {
  id: string
  name: string
  description: string
  color: string
  ink: string
  ids: string[]
}
