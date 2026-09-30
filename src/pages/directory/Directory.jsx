import A from '../../components/A.jsx'
import { CommentForm, Pagination } from '../../components/common.jsx'
import { Container } from '../../components/ui.jsx'
import data from '../../data/directory.json'
import { useEntry } from '../../lib/useData.js'
import NotFound from '../NotFound.jsx'

// Carte Google intégrée (sans clé d'API)
export function GoogleMap({ query, zoom = 13, className = 'h-[400px]' }) {
  return (
    <iframe
      title={`Carte : ${query}`}
      src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`}
      className={`w-full border-0 ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}

// Widget « All Categories » de la barre latérale de l'annuaire
function Categories({ sidebar }) {
  const w = sidebar?.find((b) => b.t === 'dirCategories')
  if (!w) return null
  return (
    <div>
      <h2 className="font-heading text-[26px] font-medium text-ink">{w.title}</h2>
      <ul className="mt-5 space-y-2.5">
        {w.items.map((it) => (
          <li key={it.href} className="flex items-center gap-3">
            <span className="h-[5px] w-[5px] rounded-full bg-primary" />
            <A href={it.href} className="text-[16px] text-body transition-colors hover:text-primary">
              {it.label}
            </A>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Layout({ sidebar, children }) {
  return (
    <Container className="pb-[100px] pt-[110px]">
      <div className="flex flex-col gap-[40px] lg:flex-row">
        <div className="min-w-0 lg:w-[850px]">{children}</div>
        <aside className="flex-1">
          <Categories sidebar={sidebar} />
        </aside>
      </div>
    </Container>
  )
}

function Info({ icon, text, links }) {
  return (
    <li className="flex gap-2 text-[13px] leading-[18px]">
      <i className={`${icon} mt-0.5 w-3.5 text-center text-[13px] text-ink`} />
      <span>
        {links?.length
          ? links.map((l, k) => (
              <span key={l.href}>
                {k > 0 && ', '}
                <A href={l.href} className="text-ink hover:text-primary">
                  {l.label}
                </A>
              </span>
            ))
          : text}
      </span>
    </li>
  )
}

export function DirectoryArchive() {
  const a = useEntry(data.archives)
  if (!a) return <NotFound />
  return (
    <Layout sidebar={a.sidebar}>
      <GoogleMap query="Bristol, UK" zoom={4} />
      <div className="mt-[30px] grid gap-[30px] md:grid-cols-2">
        {a.cards.map((c) => (
          <div key={c.href} className="bg-white shadow-card">
            <A href={c.href} className="block overflow-hidden">
              <img src={c.image} alt="" className="aspect-[410/256] w-full object-cover transition-transform duration-500 hover:scale-105" />
            </A>
            <div className="px-6 pb-8 pt-5">
              <h2 className="font-heading text-[18px] font-medium text-ink">
                <A href={c.href} className="hover:text-primary">
                  {c.title}
                </A>
              </h2>
              <ul className="mt-3 space-y-1.5">
                {c.info.map((i, k) => (
                  <Info key={k} {...i} />
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <Pagination items={a.pagination} />
    </Layout>
  )
}

export function DirectorySingle() {
  const s = useEntry(data.singles)
  if (!s) return <NotFound />
  const address = s.contact.find((c) => c.icon?.includes('map-marker'))?.text || 'Bristol, UK'
  return (
    <Layout sidebar={data.sidebar}>
      {s.image && <img src={s.image} alt="" className="w-full" />}
      <div className="rich mt-6 text-[15px] leading-6" dangerouslySetInnerHTML={{ __html: s.content }} />

      <h2 className="mt-2 font-heading text-[22px] font-medium text-ink">{s.contactTitle}</h2>
      <ul className="mt-3 space-y-1">
        {s.contact.map((c, k) => (
          <li key={k} className="flex items-center gap-3 text-[15px]">
            <i className={`${c.icon} w-4 text-center text-[14px] text-ink`} />
            {c.href ? (
              <a href={c.href} className="text-link hover:text-primary">
                {c.text}
              </a>
            ) : (
              <span>{c.text}</span>
            )}
          </li>
        ))}
      </ul>

      <ul className="mt-8 flex gap-3">
        {['fab fa-facebook-square', 'fab fa-x-twitter', 'fab fa-pinterest', 'fab fa-linkedin-in'].map((i) => (
          <li key={i}>
            <a href="#" className="grid h-10 w-10 place-items-center rounded-full bg-[#f2f2f2] text-[13px] text-ink hover:bg-primary hover:text-white" aria-label="Partager">
              <i className={i} />
            </a>
          </li>
        ))}
      </ul>

      <GoogleMap query={address} className="mt-8 h-[400px]" />

      <h2 className="mt-6 font-heading text-[22px] font-medium text-ink">{s.hoursTitle}</h2>
      <table className="mt-3 w-full text-[15px]">
        <tbody>
          {s.hours.map(([day, time]) => (
            <tr key={day} className="odd:bg-[#f5f5f5]">
              <td className="px-3 py-4">{day}</td>
              <td className="px-3 py-4">{time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-6 font-heading text-[22px] font-medium text-ink">{s.galleryTitle}</h2>
      <div className="mt-3 grid grid-cols-5 gap-[5px]">
        {s.gallery.map((src) => (
          <a key={src} href={src} target="_blank" rel="noreferrer">
            <img src={src} alt="" className="aspect-square w-full object-cover" />
          </a>
        ))}
      </div>

      <ul className="mt-10 space-y-1 border-t border-[#eee] pt-5 text-[15px]">
        <li className="flex items-center gap-3">
          <i className="far fa-folder w-4 text-ink" />
          <span>
            {s.categories.map((c, k) => (
              <span key={c.href}>
                {k > 0 && ', '}
                <A href={c.href} className="text-link hover:text-primary">
                  {c.label}
                </A>
              </span>
            ))}
          </span>
        </li>
        <li className="flex items-center gap-3">
          <i className="fas fa-tags w-4 text-ink" />
          <span>
            {s.tags.map((c, k) => (
              <span key={c.href}>
                {k > 0 && ', '}
                <A href={c.href} className="text-link hover:text-primary">
                  {c.label}
                </A>
              </span>
            ))}
          </span>
        </li>
      </ul>
      <CommentForm />
    </Layout>
  )
}
