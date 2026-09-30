import A from '../../components/A.jsx'
import Blocks, { FileItem } from '../../components/Blocks.jsx'
import { CommentForm, Pagination, ShareArticle } from '../../components/common.jsx'
import { Container } from '../../components/ui.jsx'
import data from '../../data/docs.json'
import { useEntry } from '../../lib/useData.js'
import NotFound from '../NotFound.jsx'

function DocSidebar({ sidebar }) {
  return (
    <aside className="w-full shrink-0 space-y-[50px] lg:w-[317px]">
      <div className="bg-[#f7f1f0] px-[30px] pb-[37px] pt-[26px]">
        <p className="font-heading text-[24px] font-medium text-ink">{sidebar.title}</p>
        <ul className="mt-3">
          {sidebar.items.map((it) => (
            <li key={it.href} className={it.active ? '' : 'border-b border-[#e8e2e1] last:border-0'}>
              <A
                href={it.href}
                className={`block px-2.5 pb-[13px] pt-[17px] font-heading text-[17px] leading-5 transition-colors hover:text-primary ${
                  it.active ? 'bg-white text-primary' : 'text-ink'
                }`}
              >
                {it.label}
              </A>
            </li>
          ))}
        </ul>
      </div>
      {sidebar.image && (
        <A href="/contact-1/">
          <img src={sidebar.image} alt="Need any help? Contact now" className="w-full" />
        </A>
      )}
    </aside>
  )
}

function DocMeta({ date, categories }) {
  return (
    <div className="text-[15px]">
      {date}
      {categories.length > 0 && (
        <>
          {' '}
          - In{' '}
          {categories.map((c, k) => (
            <span key={c.href}>
              {k > 0 && ', '}
              <A href={c.href} className="text-ink hover:text-primary">
                {c.label}
              </A>
            </span>
          ))}
        </>
      )}
    </div>
  )
}

export function DocsArchive() {
  const a = useEntry(data.archives)
  if (!a) return <NotFound />
  return (
    <Container className="pb-[70px] pt-[110px]">
      <div className="flex flex-col gap-[79px] lg:flex-row">
        <div className="order-2 lg:order-1">
          <DocSidebar sidebar={a.sidebar} />
        </div>
        <div className="order-1 min-w-0 flex-1 lg:order-2">
          <div className="grid gap-[30px] md:grid-cols-2">
            {a.cards.map((c) => (
              <div key={c.href} className="bg-white pb-8 pl-8 pr-[60px] pt-[34px] shadow-card">
                <div className="flex gap-4">
                  <i className={`${c.icon} text-[34px] leading-none text-body`} />
                  <div>
                    <h2 className="font-heading text-[20px] font-medium leading-6 text-ink">
                      <A href={c.href} className="hover:text-primary">
                        {c.title}
                      </A>
                    </h2>
                    <DocMeta {...c} />
                  </div>
                </div>
                <A
                  href={c.href}
                  className="mt-4 inline-block border-2 border-[#e8e8e8] px-6 py-1.5 font-heading text-[16px] text-ink transition-colors hover:border-primary hover:bg-primary hover:text-white"
                >
                  {c.more}
                </A>
              </div>
            ))}
          </div>
          <Pagination items={a.pagination} />
        </div>
      </div>
    </Container>
  )
}

export function DocSingle() {
  const s = useEntry(data.singles)
  if (!s) return <NotFound />
  return (
    <Container className="pb-[70px] pt-[110px]">
      <div className="flex flex-col-reverse gap-[79px] lg:flex-row">
        <DocSidebar sidebar={s.sidebar} />
        <div className="min-w-0 flex-1">
          <DocMeta {...s} />
          <Blocks blocks={s.blocks} className="mt-5" />
          {s.files.length > 0 && (
            <div className="mt-6 space-y-5">
              {s.files.map((f) => (
                <FileItem key={f.href} {...f} download />
              ))}
            </div>
          )}
          <div className="mt-[60px]">
            <ShareArticle />
            <CommentForm />
          </div>
        </div>
      </div>
    </Container>
  )
}
