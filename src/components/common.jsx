import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import A from './A.jsx'
import Feather from './Feather.jsx'

const shareIcons = [
  { icon: 'fab fa-facebook-square', bg: 'bg-[#3b5998]', label: 'Facebook' },
  { icon: 'fab fa-x-twitter', bg: 'bg-[#1da1f2]', label: 'X' },
  { icon: 'fab fa-pinterest', bg: 'bg-[#e02f12]', label: 'Pinterest' },
  { icon: 'fab fa-linkedin-in', bg: 'bg-[#4a5dce]', label: 'LinkedIn' },
]

export function ShareIcons({ className = '' }) {
  return (
    <ul className={`flex gap-2 ${className}`}>
      {shareIcons.map((s) => (
        <li key={s.label}>
          <a
            href="#"
            aria-label={`Partager sur ${s.label}`}
            className={`grid h-10 w-10 place-items-center rounded-full text-[16px] text-white transition-opacity hover:opacity-80 ${s.bg}`}
          >
            <i className={s.icon} />
          </a>
        </li>
      ))}
    </ul>
  )
}

// Bloc « Share Article » centré entre deux filets
export function ShareArticle({ border = true }) {
  return (
    <div className={`py-[45px] text-center ${border ? 'border-y border-[#e5e5e5]' : ''}`}>
      <span className="font-heading text-[24px] font-medium text-ink">Share Article</span>
      <ShareIcons className="mt-4 justify-center" />
    </div>
  )
}

export function CommentForm() {
  return (
    <div className="pt-[50px]">
      <h3 className="font-heading text-[30px] font-medium text-ink">Leave Your Comment</h3>
      <p className="mt-6 text-[17px]">
        You must be{' '}
        <A href="/my-account/" className="text-link hover:underline">
          logged in
        </A>{' '}
        to post a comment.
      </p>
    </div>
  )
}

// Navigation « Previous · ⋯ · Next » des fiches
export function PrevNext({ prev, next, all }) {
  if (!prev && !next) return null
  const circle =
    'grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e5e5e5] text-[20px] text-ink transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white'
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[#e5e5e5] py-[30px]">
      {prev ? (
        <A href={prev.href} className="group flex max-w-[45%] items-center gap-4">
          <span className={circle}>
            <i className="arrow_carrot-left" />
          </span>
          <span>
            <span className="block font-heading text-[16px] text-primary">Previous</span>
            <span className="block font-heading text-[18px] leading-tight text-ink">{prev.title}</span>
          </span>
        </A>
      ) : (
        <span />
      )}
      <A href={all} className="flex gap-[5px]" aria-label="Tout voir">
        {[0, 1, 2].map((k) => (
          <span key={k} className="h-[5px] w-[5px] rounded-full bg-[#c4c4c4]" />
        ))}
      </A>
      {next ? (
        <A href={next.href} className="group flex max-w-[45%] items-center gap-4 text-right">
          <span>
            <span className="block font-heading text-[16px] text-primary">Next</span>
            <span className="block font-heading text-[18px] leading-tight text-ink">{next.title}</span>
          </span>
          <span className={circle}>
            <i className="arrow_carrot-right" />
          </span>
        </A>
      ) : (
        <span />
      )}
    </div>
  )
}

export function Pagination({ items }) {
  if (!items?.length) return null
  return (
    <nav className="mt-[70px] flex justify-center">
      <ul className="flex gap-2.5">
        {items.map((p, k) => {
          const base =
            'grid h-10 min-w-10 place-items-center border px-2 font-heading text-[17px] transition-colors'
          const inner =
            p.kind === 'next' ? (
              <i className="arrow_carrot-right text-[20px]" />
            ) : p.kind === 'prev' ? (
              <i className="arrow_carrot-left text-[20px]" />
            ) : (
              p.label
            )
          return (
            <li key={k}>
              {p.current || !p.href ? (
                <span className={`${base} border-primary bg-primary text-white`}>{inner}</span>
              ) : (
                <A href={p.href} className={`${base} border-[#e5e5e5] text-ink hover:border-primary hover:bg-primary hover:text-white`}>
                  {inner}
                </A>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// ---------------------------------------------------------------- Barres latérales

export function SearchBox({ placeholder = 'Search Here ...', action = '/' }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  return (
    <form
      className="flex h-[50px]"
      onSubmit={(e) => {
        e.preventDefault()
        navigate(`${action}?s=${encodeURIComponent(q)}`)
      }}
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 border border-[#e5e5e5] bg-[#f2f2f2] px-5 text-[17px] text-ink outline-none placeholder:text-body"
      />
      <button className="w-[50px] bg-primary text-[18px] text-white transition-colors hover:bg-navy" aria-label="Search">
        <i className="icon_search inline-block -scale-x-100" />
      </button>
    </form>
  )
}

export function WidgetTitle({ children }) {
  return <h4 className="mb-[30px] font-heading text-[26px] font-medium !text-[#343434]">{children}</h4>
}

export function EventGridCard({ e, compact = false }) {
  return (
    <div className="h-full bg-white shadow-card">
      <div className="relative overflow-hidden">
        {e.image && (
          <A href={e.href}>
            <img src={e.image} alt="" className="aspect-[600/447] w-full object-cover transition-transform duration-500 hover:scale-105" />
          </A>
        )}
        <span className="absolute left-2.5 top-2.5 flex items-stretch font-heading text-[14px] font-medium text-white">
          <span className="bg-primary px-2 py-1">{e.day}</span>
          <span className="bg-white px-2 py-1 uppercase text-ink">
            {e.month} {e.year}
          </span>
        </span>
      </div>
      <div className={compact ? 'p-5' : 'px-[25px] pb-[30px] pt-5'}>
        {e.category && (
          <A href={e.category.href} className="text-[14px] text-link hover:text-primary">
            {e.category.label}
          </A>
        )}
        <h2 className="mt-1 font-heading text-[20px] font-medium leading-[1.2] text-ink">
          <A href={e.href} className="hover:text-primary">
            {e.title}
          </A>
        </h2>
        <div className="mt-3 space-y-1.5 text-[14px] leading-5">
          <p className="flex gap-2">
            <Feather name="clock" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{e.time.join(' ')}</span>
          </p>
          {e.venue && (
            <p className="flex gap-2">
              <Feather name="map-pin" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{e.venue}</span>
            </p>
          )}
        </div>
        <A
          href={e.href}
          className="mt-5 inline-block border border-[#e0e0e0] px-4 py-1.5 font-heading text-[15px] text-ink transition-colors hover:border-primary hover:bg-primary hover:text-white"
        >
          More Details
        </A>
      </div>
    </div>
  )
}

export function SidebarWidgets({ widgets = [] }) {
  return (
    <div className="space-y-[50px]">
      {widgets.map((w, k) => (
        <SidebarWidget key={k} w={w} />
      ))}
    </div>
  )
}

function SidebarWidget({ w }) {
  switch (w.t) {
    case 'search':
      return <SearchBox placeholder={w.placeholder} />
    case 'links':
      return (
        <div>
          <WidgetTitle>{w.title}</WidgetTitle>
          <ul className="space-y-[14px]">
            {w.items.map((it) => (
              <li key={it.href}>
                <A
                  href={it.href}
                  className={`flex items-center gap-4 text-[17px] transition-colors hover:text-primary ${
                    it.current ? 'text-primary' : 'text-body'
                  }`}
                >
                  <span className="h-[5px] w-[5px] rounded-full bg-primary" />
                  {it.label}
                </A>
              </li>
            ))}
          </ul>
        </div>
      )
    case 'recentPosts':
      return (
        <div>
          <WidgetTitle>{w.title}</WidgetTitle>
          <ul>
            {w.items.map((it) => (
              <li key={it.href} className="border-b border-[#e5e5e5] py-5 first:pt-0">
                <A href={it.href} className="group flex gap-5">
                  <img src={it.image} alt="" className="h-[80px] w-[80px] shrink-0 object-cover" />
                  <span>
                    <span className="block font-heading text-[18px] leading-6 text-ink group-hover:text-primary">
                      {it.title}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 font-heading text-[16px]">
                      <Feather name="clock" className="h-4 w-4 text-primary" />
                      {it.date}
                    </span>
                  </span>
                </A>
              </li>
            ))}
          </ul>
        </div>
      )
    case 'gallery':
      return (
        <div>
          <WidgetTitle>{w.title}</WidgetTitle>
          <div className="grid grid-cols-3 gap-2.5">
            {w.images.map((src) => (
              <a key={src} href={src} target="_blank" rel="noreferrer">
                <img src={src} alt="" className="aspect-square w-full object-cover transition-opacity hover:opacity-80" />
              </a>
            ))}
          </div>
        </div>
      )
    case 'tags':
      return (
        <div>
          <WidgetTitle>{w.title}</WidgetTitle>
          <div className="flex flex-wrap gap-2.5">
            {w.items.map((t) => (
              <A
                key={t.href}
                href={t.href}
                className="border border-[#e5e5e5] px-3 py-1 font-heading text-[15px] text-body transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                {t.label}
              </A>
            ))}
          </div>
        </div>
      )
    case 'image':
      return (
        <A href={w.href}>
          <img src={w.src} alt="" className="w-full" />
        </A>
      )
    case 'featureEvents':
      return (
        <div>
          <WidgetTitle>{w.title}</WidgetTitle>
          {w.items[0] && <EventGridCard e={w.items[0]} compact />}
        </div>
      )
    case 'listEvents':
      return (
        <div>
          <WidgetTitle>{w.title}</WidgetTitle>
          <ul className="space-y-5">
            {w.items.map((it) => (
              <li key={it.href} className="flex gap-4">
                <A href={it.href} className="shrink-0">
                  <img src={it.image} alt="" className="h-[70px] w-[70px] object-cover" />
                </A>
                <div>
                  <A href={it.href} className="block font-heading text-[16px] font-medium leading-[1.3] text-ink hover:text-primary">
                    {it.title}
                  </A>
                  <p className="mt-1 text-[14px] leading-5">
                    {it.date}
                    <br />
                    {it.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {w.button && (
            <A href={w.button.href} className="mt-5 inline-flex items-center gap-1 font-heading text-[16px] text-link hover:text-primary">
              {w.button.text}
              <i className="arrow_carrot-right" />
            </A>
          )}
        </div>
      )
    case 'priceFilter':
      return <PriceFilter />
    case 'products':
      return (
        <div>
          <WidgetTitle>{w.title}</WidgetTitle>
          <ul className="space-y-5">
            {w.items.map((it) => (
              <li key={it.href}>
                <A href={it.href} className="group flex items-center gap-4">
                  <img src={it.image} alt="" className="h-[70px] w-[70px] shrink-0 object-cover" />
                  <span>
                    <span className="block font-heading text-[17px] text-ink group-hover:text-primary">{it.title}</span>
                    <Price {...it} className="mt-1 text-[16px] !text-body" />
                  </span>
                </A>
              </li>
            ))}
          </ul>
        </div>
      )
    default:
      return null
  }
}

function PriceFilter() {
  const [max, setMax] = useState(30)
  return (
    <div>
      <WidgetTitle>Filter By Price</WidgetTitle>
      <input type="range" min={0} max={30} value={max} onChange={(e) => setMax(+e.target.value)} className="w-full accent-primary" />
      <div className="mt-4 flex items-center justify-between">
        <button className="bg-[#4f5f7f] px-4 py-1.5 font-heading text-[15px] text-white hover:bg-primary">Filter</button>
        <span className="text-[14px] uppercase">Price: £0 — £{max}</span>
      </div>
    </div>
  )
}

export function Price({ price, regular, className = '' }) {
  return (
    <span className={`font-heading text-primary ${className}`}>
      {regular && <del className="mr-2">{regular}</del>}
      {regular ? <ins>{price}</ins> : price}
    </span>
  )
}

// Grille « contenu + barre latérale » utilisée par le blog, les événements, la boutique…
export function WithSidebar({ side = 'right', sidebar, children, sideWidth = 'lg:w-[370px]' }) {
  if (!sidebar) return children
  return (
    <div className={`flex flex-col gap-[60px] lg:flex-row ${side === 'left' ? 'lg:flex-row-reverse' : ''}`}>
      <div className="min-w-0 flex-1">{children}</div>
      <aside className={`w-full shrink-0 ${sideWidth}`}>{sidebar}</aside>
    </div>
  )
}
