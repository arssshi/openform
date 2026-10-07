import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

// Load /themes/halcyon/theme.css once in your document head.
// These components preserve ordinary React props and existing interaction handlers.
export function OpenformTheme({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-openform="halcyon" className={`of-theme ${className}`} {...props}>{children}</div>
}
export function ThemeContainer({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`of-container ${className}`} {...props}>{children}</div>
}
export function ThemeButton({ children, className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  return <button type="button" className={`of-button ${variant === 'secondary' ? 'of-button--ghost' : ''} ${className}`} {...props}>{children}</button>
}
export function ThemeCard({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`of-card ${className}`} {...props}><div className="of-card-body">{children}</div></div>
}
export function ThemeHeading({ children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={`of-heading ${className}`} {...props}>{children}</h2>
}
export function ThemeInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`of-input ${className}`} {...props} />
}
export function ThemeBadge({ children, className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`of-badge ${className}`} {...props}>{children}</span>
}
export function ThemeIcon({ name, title }: { name: keyof typeof paths; title?: string }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>{title && <title>{title}</title>}<path d={paths[name]} fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" /></svg>
}
export function ThemeHero({ title, description, actions, children }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; children?: ReactNode }) {
  return <section className="of-hero"><div className="of-container of-hero-inner"><div className="of-hero-copy"><p className="of-eyebrow">REST / RESET / RETURN</p><h1 className="of-display">{title}</h1>{description && <p className="of-lede">{description}</p>}{actions && <div className="of-actions">{actions}</div>}</div>{children || <figure className="of-hero-media"><img src="/themes/halcyon/artwork.svg" alt="The geometry of rest" width="900" height="900" /></figure>}</div></section>
}
const paths = {
  "arrow": "M5 12H19M13 6L19 12L13 18",
  "plus": "M12 5V19M5 12H19",
  "menu": "M4 6H20M4 12H20M4 18H20",
  "close": "M6 6L18 18M18 6L6 18",
  "search": "M16 16L21 21M18 10a8 8 0 1 1-16 0a8 8 0 1 1 16 0",
  "bookmark": "M6 3H18V21L12 17L6 21Z",
  "check": "M4 12L10 18L20 6",
  "mail": "M3 5H21V19H3ZM3 5L12 13L21 5",
  "bag": "M4 7H20V21H4ZM8 7V5a4 4 0 0 1 8 0V7",
  "download": "M12 3V15M6 9L12 15L18 9M4 17V21H20V17",
  "external": "M14 3H21V10M21 3L10 14M10 3H3V21H21V14",
  "star": "M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z"
} as const
