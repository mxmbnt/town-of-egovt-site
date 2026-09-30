import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import A from '../components/A.jsx'
import Feather from '../components/Feather.jsx'
import { useDocumentTitle } from '../layouts/SiteLayout.jsx'
import PageTitle from '../layouts/PageTitle.jsx'

// Page 404 du thème (bandeau fil d'Ariane seul, illustration, recherche, retour)
export default function NotFound() {
  useDocumentTitle('Page not found - EGovt')
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  return (
    <>
      <PageTitle
        bg="/wp/2020/08/13.jpg"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'You got it Error 404 not Found' }]}
      />
      <div className="px-5 pb-[110px] pt-[100px] text-center">
        <img src="/wp/theme/img_404.png" alt="404" className="mx-auto" />
        <h1 className="mt-6 font-heading text-[40px] font-semibold text-ink">Ohh! Page Not Found</h1>
        <p className="mx-auto mt-4 max-w-[540px] text-[17px]">
          It looks like nothing was found at this location. Click the button below to return home.
        </p>
        <form
          className="mx-auto mt-9 flex h-[60px] max-w-[458px] shadow-card"
          onSubmit={(e) => {
            e.preventDefault()
            navigate(`/?s=${encodeURIComponent(q)}`)
          }}
        >
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search …"
            className="min-w-0 flex-1 px-5 text-[17px] text-ink outline-none placeholder:text-body"
          />
          <button className="bg-primary px-5 font-heading text-[18px] text-white hover:bg-navy">Search</button>
        </form>
        <A
          href="/"
          className="mt-[60px] inline-flex items-center gap-3 bg-navy px-[27px] py-[17px] font-heading text-[18px] font-medium text-white transition-colors hover:bg-primary"
        >
          Back to Home
          <Feather name="arrow-right" className="h-4 w-4" />
        </A>
      </div>
    </>
  )
}
