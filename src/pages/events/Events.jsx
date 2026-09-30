import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import A from '../../components/A.jsx'
import Blocks from '../../components/Blocks.jsx'
import { CommentForm, EventGridCard, Pagination, PrevNext, ShareArticle, SidebarWidgets } from '../../components/common.jsx'
import Feather from '../../components/Feather.jsx'
import { Container } from '../../components/ui.jsx'
import data from '../../data/events.json'
import { slugify } from '../../lib/site.js'
import { useEntry } from '../../lib/useData.js'
import { GoogleMap } from '../directory/Directory.jsx'
import NotFound from '../NotFound.jsx'

const TYPES = ['Conference', 'Entertainment', 'Health & Sports', 'Meeting', 'Workshop']

// Formulaire de recherche d'événements (fond beige)
function EventSearch({ current }) {
  const navigate = useNavigate()
  const [type, setType] = useState(current || '')
  const field = 'flex h-[50px] items-center bg-white px-5 text-[17px] text-[#8c96ac] shadow-soft'
  return (
    <form
      className="grid items-end gap-[30px] bg-[#f7f1f0] px-10 pb-10 pt-[35px] md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_187px]"
      onSubmit={(e) => {
        e.preventDefault()
        navigate(type ? `/event_type/${slugify(type).replace('-and-', '-')}/` : '/event/')
      }}
    >
      {['From', 'To'].map((l) => (
        <label key={l} className="block">
          <span className="mb-4 block font-heading text-[17px] font-medium text-ink">{l}</span>
          <span className={field}>
            <input
              type="text"
              placeholder="Choose Date"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => !e.target.value && (e.target.type = 'text')}
              className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-[#8c96ac]"
              aria-label={l}
            />
            <i className="far fa-calendar-alt text-[15px]" />
          </span>
        </label>
      ))}
      <label className="block">
        <span className="mb-4 block font-heading text-[17px] font-medium text-ink">Event Type</span>
        <span className={`${field} relative`}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full appearance-none bg-transparent outline-none"
          >
            <option value="">All Event Type</option>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <i className="arrow_carrot-down pointer-events-none absolute right-5 text-[18px]" />
        </span>
      </label>
      <button className="h-[50px] bg-primary font-heading text-[20px] font-medium text-white transition-colors hover:bg-navy">
        Find Event
      </button>
    </form>
  )
}

function EventRow({ e }) {
  return (
    <div className="flex flex-col items-start gap-8 border border-[#e5e5e5] px-10 py-[30px] md:flex-row md:items-center">
      <div className="w-[160px] shrink-0 font-heading">
        <div className="flex items-end gap-2">
          <span className="text-[46px] leading-none text-primary">{e.day}</span>
          <span className="pb-1 text-[17px] font-medium uppercase text-ink">{e.month}</span>
        </div>
        <div className="mt-1 text-[20px] font-medium uppercase text-[#aab1c1]">{e.weekday}</div>
      </div>
      <A href={e.href} className="shrink-0">
        <img src={e.image} alt="" className="h-40 w-40 rounded-full object-cover" />
      </A>
      <div className="min-w-0 flex-1 md:pl-[18px]">
        {e.category && (
          <A href={e.category.href} className="font-heading text-[17px] text-link hover:text-primary">
            {e.category.label}
          </A>
        )}
        <h2 className="mt-1.5 font-heading text-[26px] font-medium leading-tight text-ink">
          <A href={e.href} className="hover:text-primary">
            {e.title}
          </A>
        </h2>
        <p className="mt-2 flex items-center gap-2 text-[17px]">
          <Feather name="clock" className="h-4 w-4" />
          {e.time.join('')}
        </p>
        <p className="mt-1.5 flex items-center gap-2 text-[17px]">
          <Feather name="map-pin" className="h-4 w-4" />
          {e.venue}
        </p>
      </div>
      <A
        href={e.href}
        className="shrink-0 border-2 border-[#e5e5e5] px-5 py-2 font-heading text-[17px] text-ink transition-colors hover:border-primary hover:bg-primary hover:text-white"
      >
        More Details
      </A>
    </div>
  )
}

export function EventsArchive() {
  const a = useEntry(data.archives)
  const { pathname } = useLocation()
  if (!a) return <NotFound />
  const current = pathname.startsWith('/event_type/') ? a.cards[0]?.category?.label : ''
  const grid = a.variant === 'grid'
  const list = grid ? (
    <div className={`grid gap-x-[30px] gap-y-[60px] md:grid-cols-2 ${a.sidebar ? '' : 'lg:grid-cols-3'}`}>
      {a.cards.map((e) => (
        <EventGridCard key={e.href + e.title} e={e} />
      ))}
    </div>
  ) : (
    <div className="-space-y-px">
      {a.cards.map((e) => (
        <EventRow key={e.href + e.title} e={e} />
      ))}
    </div>
  )
  return (
    <Container className="pb-[110px] pt-[110px]">
      {a.sidebar ? (
        <div className="flex flex-col gap-[60px] lg:flex-row">
          <div className="min-w-0 flex-1">
            <EventSearch current={current} />
            <div className="mt-[70px]">{list}</div>
            <Pagination items={a.pagination} />
          </div>
          <aside className="w-full shrink-0 lg:w-[350px]">
            <SidebarWidgets widgets={data.sidebar} />
          </aside>
        </div>
      ) : (
        <>
          <EventSearch current={current} />
          <div className="mt-[70px]">{list}</div>
          <Pagination items={a.pagination} />
        </>
      )}
    </Container>
  )
}

function InfoTabs({ s }) {
  const [tab, setTab] = useState(0)
  const tabs = ['Location', 'Contact Details', 'Gallery']
  return (
    <div className="mt-12">
      <ul className="flex gap-6 border-b border-[#e5e5e5]">
        {tabs.map((t, k) => (
          <li key={t}>
            <button
              onClick={() => setTab(k)}
              className={`-mb-px border-b-2 pb-2 font-heading text-[20px] ${k === tab ? 'border-primary text-ink' : 'border-transparent text-body'}`}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
      <div className="pt-8">
        {tab === 0 && <GoogleMap query={s.location} className="h-[500px]" />}
        {tab === 1 && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {s.contact.map((c) => (
              <li key={c.label} className="text-[17px]">
                <span className="mr-2 font-heading text-ink">{c.label}</span>
                {c.href ? (
                  <a href={c.href} className="hover:text-primary">
                    {c.value}
                  </a>
                ) : (
                  c.value
                )}
              </li>
            ))}
          </ul>
        )}
        {tab === 2 && (
          <div className="grid grid-cols-2 gap-[30px]">
            {s.gallery.map((src) => (
              <a key={src} href={src} target="_blank" rel="noreferrer">
                <img src={src} alt="" className="w-full" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function EventSingle() {
  const s = useEntry(data.singles)
  if (!s) return <NotFound />
  const band = [
    { label: 'Date', value: s.date, icon: 'lnr lnr-calendar-full' },
    { label: 'Time', value: s.time, icon: 'lnr lnr-clock' },
    { label: 'Location', value: s.location, icon: 'lnr lnr-map-marker' },
  ]
  return (
    <Container className="pb-[70px] pt-[110px]">
      <div className="flex flex-col gap-[80px] lg:flex-row">
        <div className="min-w-0 flex-1">
          <img src={s.image} alt="" className="w-full" />
          <div className="grid gap-4 bg-primary px-10 py-7 text-white sm:grid-cols-3">
            {band.map((b) => (
              <div key={b.label} className="relative overflow-hidden">
                <span className="font-heading text-[22px] font-medium">{b.label}</span>
                <p className="mt-2 font-heading text-[16px]">{b.value}</p>
                <i className={`${b.icon} pointer-events-none absolute -bottom-6 right-6 text-[60px] opacity-20`} />
              </div>
            ))}
          </div>
          <p className="mt-5 text-[15px]">
            In{' '}
            {s.categories.map((c) => (
              <A key={c.href} href={c.href} className="text-link hover:text-primary">
                {c.label}
              </A>
            ))}
          </p>
          <h1 className="mt-2 font-heading text-[26px] font-medium text-ink">{s.title}</h1>
          <Blocks blocks={s.blocks} className="mt-4" />
          <InfoTabs s={s} />
          {s.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span className="font-heading text-[16px] text-ink">Tags:</span>
              {s.tags.map((t) => (
                <A
                  key={t.href}
                  href={t.href}
                  className="border border-[#e5e5e5] px-3 py-0.5 text-[14px] transition-colors hover:border-primary hover:bg-primary hover:text-white"
                >
                  {t.label}
                </A>
              ))}
            </div>
          )}
          <div className="mt-10">
            <PrevNext prev={s.prev} next={s.next} all="/event/" />
            <ShareArticle border={false} />
          </div>
          {s.related.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-8 font-heading text-[30px] font-medium text-ink">Related Events</h3>
              <div className="grid gap-[30px] md:grid-cols-2">
                {s.related.map((e) => (
                  <EventGridCard key={e.href} e={e} />
                ))}
              </div>
            </div>
          )}
          <CommentForm />
        </div>
        <aside className="w-full shrink-0 lg:w-[350px]">
          <SidebarWidgets widgets={data.sidebar} />
        </aside>
      </div>
    </Container>
  )
}
