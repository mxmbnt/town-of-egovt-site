import A from '../../components/A.jsx'
import Blocks from '../../components/Blocks.jsx'
import { CommentForm, Pagination, ShareArticle } from '../../components/common.jsx'
import Feather from '../../components/Feather.jsx'
import { ArchiveGrid, Container } from '../../components/ui.jsx'
import data from '../../data/departments.json'
import { useEntry } from '../../lib/useData.js'
import NotFound from '../NotFound.jsx'
import { SideFile, SideList } from '../services/Services.jsx'

// Carte département : photo, pastille icône, titre, extrait, bouton pleine largeur
export function DepartmentCard({ title, href, image, icon, text, more }) {
  return (
    <div className="group h-full bg-white text-center shadow-card">
      <A href={href} className="block overflow-hidden">
        <img src={image} alt="" className="h-[211px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </A>
      <div className="relative px-[30px] pb-10">
        <span className="relative -mt-10 inline-grid h-20 w-20 place-items-center rounded-full bg-primary text-[42px] leading-none text-white">
          <i className={icon} />
        </span>
        <h2 className="mt-[30px] font-heading text-[26px] font-medium leading-tight text-ink">
          <A href={href} className="transition-colors hover:text-primary">
            {title}
          </A>
        </h2>
        <p className="mt-4 text-[17px] leading-6">{text}</p>
        <A
          href={href}
          className="mt-[34px] flex h-10 items-center justify-center gap-2 border border-[#e5e5e5] font-heading text-[17px] text-link transition-colors hover:border-primary hover:bg-primary hover:text-white"
        >
          {more}
          <Feather name="arrow-right" className="h-4 w-4" />
        </A>
      </div>
    </div>
  )
}

export function DepartmentsArchive() {
  const a = useEntry(data.archives)
  if (!a) return <NotFound />
  return (
    <Container className="pb-[70px] pt-[110px]">
      <ArchiveGrid className="gap-y-[60px]">
        {a.cards.map((c) => (
          <DepartmentCard key={c.href + c.title} {...c} />
        ))}
      </ArchiveGrid>
      <Pagination items={a.pagination} />
    </Container>
  )
}

export function DepartmentSingle() {
  const s = useEntry(data.singles)
  if (!s) return <NotFound />
  return (
    <Container className="pb-[70px] pt-[110px]">
      <div className="flex flex-col-reverse gap-[80px] lg:flex-row">
        <aside className="w-full shrink-0 space-y-[50px] lg:w-[317px]">
          <SideList title="All Departments" titleHref="/ova_dep/" items={s.list} />
          {s.sidebar?.files.map((f) => (
            <SideFile key={f.href} {...f} />
          ))}
          {s.sidebar?.image && (
            <A href="/contact-1/">
              <img src={s.sidebar.image} alt="Need any help? Contact now" className="w-full" />
            </A>
          )}
        </aside>
        <div className="min-w-0 flex-1">
          <Blocks blocks={s.blocks} />
          <div className="mt-[60px]">
            <ShareArticle />
            <CommentForm />
          </div>
        </div>
      </div>
    </Container>
  )
}
