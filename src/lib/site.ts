const configuredBase = import.meta.env.BASE_URL || '/'

export const siteBasePath = configuredBase === '/'
  ? ''
  : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`

export function sitePath(path = '/') {
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return siteBasePath ? `${siteBasePath}${normalized === '/' ? '/' : normalized}` : normalized
}

export function stripSitePath(pathname: string) {
  if (!siteBasePath) return pathname || '/'
  if (pathname === siteBasePath || pathname === `${siteBasePath}/`) return '/'
  return pathname.startsWith(`${siteBasePath}/`) ? pathname.slice(siteBasePath.length) || '/' : pathname
}
