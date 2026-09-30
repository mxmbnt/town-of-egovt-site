import A from '../../components/A.jsx'
import Blocks from '../../components/Blocks.jsx'
import { CommentForm, Pagination, ShareArticle } from '../../components/common.jsx'
import Feather from '../../components/Feather.jsx'
import { ArchiveGrid, Container, NarrowContainer } from '../../components/ui.jsx'
import data from '../../data/services.json'
import { useEntry } from '../../lib/useData.js'
import NotFound from '../NotFound.jsx'

// Carte service : icône + titre, l'extrait et « Read More » apparaissent au survol
export function ServiceCard({ title, href, icon, text, more }) {
  return (
    <div className="group relative h-full overflow-hidden border border-[#e5e5e5] bg-white px-[30px] pb-[40px] pt-[40px] transition-shadow duration-300 hover:shadow-card">
      <span className={`${icon} block text-[50px] leading-none text-primary`} />
      <h3 className="mt-[26px] font-heading text-[24px] font-medium leading-[1.2] text-ink">
        <A href={href} className="transition-colors hover:text-primary">
          {title}
        </A>
      </h3>
      <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <p className="mt-3 text-[16px] leading-6">{text}</p>
          <A href={href} className="mt-3 inline-flex items-center gap-2 font-heading text-[16px] text-primary">
            {more}
            <Feather name="arrow-right" className="h-4 w-4" />
          </A>
        </div>
      </div>
      <span
        className={`${icon} pointer-events-none absolute -bottom-5 -right-4 text-[120px] leading-none text-[#f4f4f4] opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
    </div>
  )
}

export function ServicesArchive() {
  const a = useEntry(data.archives)
  return (
    <NarrowContainer className="pb-[70px] pt-[110px]">
      <ArchiveGrid>
        {a.cards.map((c) => (
          <ServiceCard key={c.href + c.title} {...c} />
        ))}
      </ArchiveGrid>
      <Pagination items={a.pagination} />
    </NarrowContainer>
  )
}

// Liste « All … » des barres latérales service / département
export function SideList({ title, titleHref, items }) {
  return (
    <div className="bg-[#f3f3f3] px-5 pb-[60px] pt-[34px]">
      <h3 className="px-2.5 font-heading text-[24px] font-medium text-ink">
        <A href={titleHref} className="flex items-center gap-2 hover:text-primary">
          <i className="arrow_carrot-left text-[22px]" />
          {title}
        </A>
      </h3>
      <ul className="mt-[18px]">
        {items.map((it) => (
          <li key={it.href} className={it.active ? '' : 'border-b border-[#e5e5e5] last:border-0'}>
            <A
              href={it.href}
              className={`block px-2.5 py-3 font-heading text-[18px] leading-[26px] transition-colors hover:text-primary ${
                it.active ? 'bg-white text-primary shadow-card' : 'text-ink'
              }`}
            >
              {it.label}
            </A>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SideFile({ name, type, size, href, icon }) {
  return (
    <div className="flex gap-4 border-2 border-[#e5e5e5] px-[30px] py-5">
      <i className={`${icon || (type?.startsWith('doc') ? 'flaticon-doc' : 'flaticon-pdf')} text-[30px] leading-none text-[#8c96ac]`} />
      <div className="min-w-0">
        <a href={href} download className="block break-words font-heading text-[18px] leading-[1.15] text-ink hover:text-primary">
          {name}
        </a>
        <span className="mt-2 block text-[15px] uppercase">
          {type} <span className="normal-case">{size}</span>
        </span>
      </div>
    </div>
  )
}

export function ServiceSingle() {
  const s = useEntry(data.singles)
  if (!s) return <NotFound />
  return (
    <Container className="pb-[70px] pt-[110px]">
      <div className="flex flex-col gap-[80px] lg:flex-row">
        <div className="min-w-0 flex-1">
          <Blocks blocks={s.blocks} />
          <div className="mt-[60px]">
            <ShareArticle />
            <CommentForm />
          </div>
        </div>
        <aside className="w-full shrink-0 space-y-[50px] lg:w-[317px]">
          <SideList title="All Services" titleHref="/page-service/" items={s.list} />
          {s.files.map((f) => (
            <SideFile key={f.href} {...f} />
          ))}
          {s.sideImage && (
            <A href="/contact-1/">
              <img src={s.sideImage} alt="Need any help? Contact now" className="w-full" />
            </A>
          )}
        </aside>
      </div>
    </Container>
  )
}

