// Utilitaires pour passer des URLs du site d'origine aux chemins du clone.

export const ORIGIN = 'https://egovt.ovathemewp.com'

// "https://egovt.ovathemewp.com/wp-content/uploads/2020/07/x.jpg" -> "/wp/2020/07/x.jpg"
export function img(url) {
  if (!url) return url
  return url.replace(/^(https?:)?\/\/egovt\.ovathemewp\.com\/wp-content\/uploads\//, '/wp/').replace(/^\/wp-content\/uploads\//, '/wp/')
}

// URL absolue du site d'origine -> route locale ("/ova_sev/your-goverment/")
export function route(href) {
  if (!href) return '#'
  if (href.startsWith(ORIGIN)) return href.slice(ORIGIN.length) || '/'
  return href
}

export function isInternal(href) {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/wp/')
}

// "Art & Culture" -> "art-and-culture"
export function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
