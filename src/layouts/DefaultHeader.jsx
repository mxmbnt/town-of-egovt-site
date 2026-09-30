import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import A from '../components/A.jsx'
import Feather from '../components/Feather.jsx'
import { Container } from '../components/ui.jsx'
import menu from '../data/menu.js'

const topLinks = [
  { label: 'Council', href: '/ova_dep/art-and-culture-2/' },
  { label: 'Vacancies', href: '/ova_dep/roads-and-transport/' },
  { label: 'Complaints', href: '/ova_dep/housing-and-land/' },
]

// Vrai si l'élément (ou un de ses descendants) pointe vers la page courante
function isActive(item, current) {
  if (item.href !== '#' && item.href === current) return true
  return (item.children || []).some((c) => isActive(c, current))
}

function Dropdown({ items, current, nested = false }) {
  return (
    <ul
      className={`invisible absolute z-50 min-w-[13rem] bg-white p-[15px] opacity-0 shadow-card transition-all duration-300 ${
        nested
          ? 'left-full top-0 -mt-[15px] group-hover/sub:visible group-hover/sub:opacity-100'
          : 'left-0 top-[110%] group-hover/top:visible group-hover/top:top-full group-hover/top:opacity-100'
      }`}
    >
      {items.map((it) => (
        <li key={it.label + it.href} className="group/sub relative">
          <A
            href={it.href}
            className={`flex items-center justify-between gap-3 whitespace-nowrap px-[15px] py-[5px] font-heading text-[17px] leading-6 transition-colors hover:bg-primary hover:text-white ${
              isActive(it, current) ? 'text-primary' : 'text-ink'
            }`}
          >
            {it.label}
            {it.children && <i className="arrow_carrot-right text-[16px]" aria-hidden="true" />}
          </A>
          {it.children && <Dropdown items={it.children} current={current} nested />}
        </li>
      ))}
    </ul>
  )
}

function MobileMenu({ items, current, depth = 0 }) {
  const [open, setOpen] = useState({})
  return (
    <ul className={depth ? 'pl-4' : ''}>
      {items.map((it) => (
        <li key={it.label + it.href} className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <A
              href={it.href}
              className={`block py-3 font-heading text-[17px] ${isActive(it, current) ? 'text-primary' : 'text-white'}`}
            >
              {it.label}
            </A>
            {it.children && (
              <button
                onClick={() => setOpen((o) => ({ ...o, [it.label]: !o[it.label] }))}
                className="px-2 text-white"
                aria-label="Ouvrir le sous-menu"
              >
                <i className={open[it.label] ? 'arrow_carrot-up' : 'arrow_carrot-down'} />
              </button>
            )}
          </div>
          {it.children && open[it.label] && <MobileMenu items={it.children} current={current} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  )
}

function SearchPopup({ onClose }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-navy/95 px-5" onClick={onClose}>
      <button className="absolute right-8 top-8 text-3xl text-white" aria-label="Fermer">
        <i className="fas fa-times" />
      </button>
      <form
        className="flex w-full max-w-[700px] border-b-2 border-white/40"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          onClose()
          navigate(`/?s=${encodeURIComponent(q)}`)
        }}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search …"
          className="flex-1 bg-transparent py-4 text-[28px] text-white outline-none placeholder:text-white/60"
        />
        <button className="px-3 text-[22px] text-white" aria-label="Search">
          <i className="icon_search" />
        </button>
      </form>
    </div>
  )
}

function LangSwitch() {
  const [lang, setLang] = useState('Eng')
  return (
    <div className="group/lang relative mr-7">
      <button className="flex items-center gap-2 rounded-full border border-[#e0e0e0] px-[18px] py-[3px] font-heading text-[17px] text-ink">
        {lang}
        <i className="arrow_carrot-down text-[18px]" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 mt-1 w-full bg-white py-1 opacity-0 shadow-card transition group-hover/lang:visible group-hover/lang:opacity-100">
        {['Eng', 'Es', 'It', 'Sp']
          .filter((l) => l !== lang)
          .map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="block w-full px-[18px] py-1 text-left font-heading text-[16px] text-ink hover:text-primary"
            >
              {l}
            </button>
          ))}
      </div>
    </div>
  )
}

export default function DefaultHeader() {
  const { pathname, search } = useLocation()
  const current = pathname + search
  const [mobile, setMobile] = useState(false)
  const [searching, setSearching] = useState(false)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobile(false), [current])

  return (
    <header className="relative z-40">
      {/* Barre d'informations */}
      <div className="hidden border-b border-[#e5e5e5] bg-navy lg:block">
        <Container className="flex h-[46px] items-center justify-between text-[15px] text-[#eee]">
          <div className="flex items-center">
            <a href="tel:18001234567" className="mr-[38px] flex items-center gap-2.5 hover:text-white">
              <Feather name="phone-incoming" className="h-[18px] w-[18px] text-primary" />
              Call on: 1800 123 4567
            </a>
            <span className="hidden items-center gap-2.5 xl:flex">
              <Feather name="clock" className="h-[18px] w-[18px] text-primary" />
              Open Hours: Mon - Fri 8.00 am - 6.00 pm
            </span>
          </div>
          <div className="flex gap-[30px]">
            {topLinks.map((l) => (
              <A key={l.label} href={l.href} className="leading-6 transition-colors hover:text-primary-hover">
                {l.label}
              </A>
            ))}
          </div>
        </Container>
      </div>

      {/* Barre principale (collante au scroll) */}
      <div className={stuck ? 'h-[105px] max-lg:h-[80px]' : ''}>
        <div
          className={`bg-white ${stuck ? 'fixed inset-x-0 top-0 animate-[slideDown_.4s_ease] shadow-card' : 'relative'}`}
        >
          <Container className="flex h-[80px] items-center lg:h-[105px]">
            <A href="/" className="shrink-0">
              <img src="/wp/2020/07/Logo_black_text-1.svg" alt="EGovt" className="w-[132px]" />
            </A>

            <nav className="ml-auto hidden lg:block">
              <ul className="flex">
                {menu.map((it) => (
                  <li key={it.label} className="group/top relative">
                    <A
                      href={it.href}
                      className={`flex items-center gap-1 px-[11px] py-10 font-heading text-[17px] leading-6 transition-colors hover:text-primary ${
                        isActive(it, current) ? 'text-primary' : 'text-ink'
                      }`}
                    >
                      {it.label}
                      <i className="arrow_carrot-down text-[13px]" aria-hidden="true" />
                    </A>
                    {it.children && <Dropdown items={it.children} current={current} />}
                  </li>
                ))}
              </ul>
            </nav>

            <button
              onClick={() => setSearching(true)}
              className="ml-auto mr-4 mt-0.5 text-[20px] text-ink hover:text-primary lg:ml-[25px] lg:mr-[70px]"
              aria-label="Search"
            >
              <i className="icon_search inline-block -scale-x-100" />
            </button>

            <div className="hidden items-center xl:flex">
              <LangSwitch />
            </div>
            <A
              href="/contact-1/"
              className="hidden border-2 border-link px-[19px] py-[10px] font-heading text-[18px] leading-6 tracking-[0.2px] text-link transition-colors hover:bg-link hover:text-white sm:inline-block"
            >
              Report an Issues
            </A>

            <button
              onClick={() => setMobile(true)}
              className="ml-4 rounded-[5px] bg-[#242424] px-[15px] py-[10px] text-white lg:hidden"
              aria-label="Menu"
            >
              <i className="fas fa-bars" />
            </button>
          </Container>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={`fixed inset-0 z-[90] bg-black/50 transition-opacity lg:hidden ${
          mobile ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobile(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-[95] w-[300px] overflow-y-auto bg-[#343434] px-6 pb-10 pt-16 transition-transform lg:hidden ${
          mobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobile(false)}
          className="absolute right-5 top-5 text-[20px] text-white"
          aria-label="Fermer le menu"
        >
          <i className="fas fa-times" />
        </button>
        <MobileMenu items={menu} current={current} />
      </div>

      {searching && <SearchPopup onClose={() => setSearching(false)} />}
    </header>
  )
}
