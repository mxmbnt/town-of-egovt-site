import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BackToTop from '../components/BackToTop.jsx'
import meta from '../data/pages-meta.json'
import DefaultFooter from './DefaultFooter.jsx'
import DefaultHeader from './DefaultHeader.jsx'
import PageTitle from './PageTitle.jsx'

// Métadonnées (bandeau, titre d'onglet) de l'URL courante, telles qu'extraites du site d'origine
export function usePageMeta() {
  const { pathname, search } = useLocation()
  return meta[pathname + search] || meta[pathname] || null
}

export function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])
  return null
}

export function useDocumentTitle(title) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])
}

// Habillage des pages internes : en-tête, bandeau titre, contenu, pied de page
export default function SiteLayout({ children }) {
  const m = usePageMeta()
  useDocumentTitle(m?.title || 'EGovt')

  return (
    <div className="overflow-x-clip">
      <DefaultHeader />
      {m?.heading && <PageTitle title={m.heading} crumbs={m.crumbs} bg={m.banner} />}
      <main>
        {children ?? <Outlet />}
      </main>
      <DefaultFooter />
      <BackToTop />
    </div>
  )
}
