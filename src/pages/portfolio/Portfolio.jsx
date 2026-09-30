import { useState } from 'react'
import A from '../../components/A.jsx'
import Blocks from '../../components/Blocks.jsx'
import { PrevNext, ShareIcons } from '../../components/common.jsx'
import Feather from '../../components/Feather.jsx'
import { Container } from '../../components/ui.jsx'
import data from '../../data/portfolio.json'
import { useEntry } from '../../lib/useData.js'
import NotFound from '../NotFound.jsx'

// Toutes les réalisations connues (listes + projets liés), pour le bouton « Load More »
const ALL = (() => {
  const seen = new Map()
  for (const a of Object.values(data.archives)) for (const c of a.cards) seen.set(c.href, c)
  for (const s of Object.values(data.singles)) for (const c of s.related) if (!seen.has(c.href)) seen.set(c.href, c)
  return [...seen.values()]
})()

function Count({ n }) {
  return (
    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-0.5 text-[15px] text-white">
      <Feather name="image" className="h-4 w-4" />
      {n}
    </span>
  )
}

function Cats({ categories, className }) {
  return (
    <div className={className}>
      {categories.map((c, k) => (
        <span key={c.href}>
          {k > 0 && ' , '}
          <A href={c.href} className="hover:text-primary">
            {c.label}
          </A>
        </span>
      ))}
    </div>
  )
}

// style : classic (texte sous l'image) | grid (texte sur l'image) | modern (texte au survol)
export function PorCard({ c, style = 'classic' }) {
  if (style === 'classic') {
    return (
      <div className="group">
        <A href={c.href} className="relative block overflow-hidden">
          <img src={c.image} alt="" className="aspect-[393/293] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {c.count && <Count n={c.count} />}
        </A>
        <div className="px-[25px] pt-[22px]">
          <Cats categories={c.categories} className="text-[15px]" />
          <h2 className="mt-0.5 font-heading text-[24px] font-medium text-ink">
            <A href={c.href} className="hover:text-primary">
              {c.title}
            </A>
          </h2>
        </div>
      </div>
    )
  }
  const modern = style === 'modern'
  return (
    <div className="group relative overflow-hidden">
      <img src={c.image} alt="" className="aspect-[393/293] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity ${
          modern ? 'opacity-0 group-hover:opacity-100' : ''
        }`}
      />
      {c.count && !modern && <Count n={c.count} />}
      <div className={`absolute inset-x-[25px] bottom-[22px] text-white transition-opacity ${modern ? 'opacity-0 group-hover:opacity-100' : ''}`}>
        <Cats categories={c.categories} className="text-[15px] [&_a]:text-white/90" />
        <h2 className="font-heading text-[24px] font-medium !text-white">
          <A href={c.href}>{c.title}</A>
        </h2>
      </div>
      <A href={c.href} className="absolute inset-0" aria-label={c.title} />
    </div>
  )
}

export function PortfolioArchive() {
  const a = useEntry(data.archives)
  const [filter, setFilter] = useState('*')
  const [more, setMore] = useState(false)
  if (!a) return <NotFound />
  const style = a.wrap?.includes('grid') ? 'grid' : a.wrap?.includes('modern') ? 'modern' : 'classic'
  const isMain = a.filters.length > 0
  const extra = isMain && more ? ALL.filter((c) => !a.cards.some((x) => x.href === c.href)) : []
  const cards = [...a.cards, ...extra].filter((c) => filter === '*' || c.filter.includes(filter.slice(1)))
  return (
    <Container className="pb-[110px] pt-[110px]">
      {isMain && (
        <ul className="mb-[60px] flex flex-wrap justify-center gap-1.5">
          {a.filters.map((f) => (
            <li key={f.label}>
              <button
                onClick={() => setFilter(f.filter)}
                className={`px-[15px] py-1.5 font-heading text-[17px] transition-colors ${
                  filter === f.filter ? 'bg-primary text-white' : 'text-ink hover:text-primary'
                }`}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={`grid gap-[30px] px-[5px] sm:grid-cols-2 lg:grid-cols-3 ${style === 'classic' ? 'gap-y-[60px]' : ''}`}>
        {cards.map((c) => (
          <PorCard key={c.href} c={c} style={style} />
        ))}
      </div>
      {isMain && !more && (
        <div className="mt-[65px] text-center">
          <button
            onClick={() => setMore(true)}
            className="bg-primary px-10 py-[17px] font-heading text-[18px] text-white transition-colors hover:bg-navy"
          >
            Load More
          </button>
        </div>
      )}
    </Container>
  )
}

function Info({ info, inline = false }) {
  if (inline) {
    return (
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[15px]">
        {info.map((i) => (
          <span key={i.label}>
            <span className="mr-1 font-heading text-ink">{i.label}:</span>
            {i.value}
          </span>
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-5">
      {info.map((i) => (
        <div key={i.label}>
          <div className="font-heading text-[17px] font-medium text-ink">{i.label}</div>
          <div className="text-[16px]">{i.value}</div>
        </div>
      ))}
    </div>
  )
}

function Gallery({ images, cols }) {
  return (
    <div className={`grid gap-[30px] ${cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
      {images.map((src) => (
        <a key={src} href={src} target="_blank" rel="noreferrer" className="block overflow-hidden">
          <img src={src} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105" />
        </a>
      ))}
    </div>
  )
}

function Share() {
  return (
    <div>
      <div className="mb-3 font-heading text-[17px] font-medium text-ink">Share</div>
      <ShareIcons />
    </div>
  )
}

export function PortfolioSingle() {
  const s = useEntry(data.singles)
  if (!s) return <NotFound />
  return (
    <>
      <Container className="pb-[70px] pt-[110px]">
        {s.type === 'type3' && (
          <div className="flex flex-col gap-[75px] lg:flex-row">
            <div className="min-w-0 lg:w-[860px]">
              <Gallery images={s.gallery} cols={2} />
            </div>
            <div className="flex-1 space-y-6">
              <Blocks blocks={s.blocks} />
              <Info info={s.info} />
              <Share />
            </div>
          </div>
        )}
        {s.type === 'type1' && (
          <>
            <Gallery images={s.gallery} cols={3} />
            <div className="mt-[70px] flex flex-col gap-[75px] lg:flex-row">
              <div className="min-w-0 flex-1">
                <Blocks blocks={s.blocks} />
              </div>
              <div className="h-fit space-y-5 bg-white p-8 shadow-card lg:w-[300px]">
                <Info info={s.info} />
                <Share />
              </div>
            </div>
          </>
        )}
        {s.type === 'type2' && (
          <>
            <Info info={s.info} inline />
            <div className="mt-10">
              <Gallery images={s.gallery} cols={3} />
            </div>
            <Blocks blocks={s.blocks} className="mt-[70px]" />
            <div className="mt-10 text-center">
              <div className="mb-3 font-heading text-[24px] font-medium text-ink">Share Article</div>
              <ShareIcons className="justify-center" />
            </div>
          </>
        )}
      </Container>
      <div className="border-t border-[#eee]">
        <Container>
          <div className="[&>div]:border-t-0">
            <PrevNext prev={s.prev} next={s.next} all="/ova_por/" />
          </div>
        </Container>
      </div>
      {s.related.length > 0 && (
        <section className="bg-cloud pb-[110px] pt-[90px]">
          <Container>
            <h3 className="mb-[40px] text-center font-heading text-[36px] font-medium text-ink">Related Projects</h3>
            <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
              {s.related.map((c) => (
                <PorCard key={c.href} c={c} style="grid" />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
