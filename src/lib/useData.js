import { useLocation } from 'react-router-dom'

// Entrée d'archive (liste) ou de fiche correspondant à l'URL courante.
// Les clés sont les chemins du site d'origine, avec la query string pour les variantes.
export function useEntry(table) {
  const { pathname, search } = useLocation()
  const params = new URLSearchParams(search)
  // on ignore les paramètres qui ne changent pas la mise en page (ex. ?s= traité à part)
  const key = pathname + (search && !params.has('s') ? search : '')
  return table?.[key] ?? table?.[pathname] ?? null
}
