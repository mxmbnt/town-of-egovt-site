import A from '../../components/A.jsx'
import Blocks from '../../components/Blocks.jsx'
import { Pagination } from '../../components/common.jsx'
import { Container } from '../../components/ui.jsx'
import data from '../../data/team.json'
import { useEntry } from '../../lib/useData.js'
import NotFound from '../NotFound.jsx'

// Carte membre : photo carrée, réseaux au survol, nom, fonction, contacts
export function TeamCard({ name, href, image, job, email, phone, socials = [] }) {
  return (
    <div className="group h-full shadow-card">
      <div className="relative overflow-hidden">
        <A href={href}>
          <img src={image} alt={name} className="aspect-square w-full object-cover" />
        </A>
        {socials.length > 0 && (
          <ul className="absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-full bg-white transition-transform duration-300 group-hover:translate-y-0">
            {socials.map((s) => (
              <li key={s}>
                <a href="#" className="grid h-9 w-[39px] place-items-center text-[15px] text-link hover:text-primary" aria-label={s}>
                  <i className={s} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white px-[25px] pb-[34px] pt-[25px]">
        <A href={href} className="block font-heading text-[22px] leading-[27px] text-ink transition-colors hover:text-primary">
          {name}
        </A>
        <p className="mb-4 mt-[5px] font-heading text-[17px] text-link">{job}</p>
        <span className="mb-4 block h-px w-10 bg-[#d8d8d8]" />
        {email && (
          <a href={`mailto:${email}`} className="mb-2.5 flex items-center gap-2.5 text-[16px] leading-5 hover:text-primary">
            <i className="fa fa-envelope-o w-3.5 text-[14px] text-ink" />
            {email}
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2.5 text-[16px] leading-5 hover:text-primary">
            <i className="fa fa-phone w-3.5 text-[15px] text-ink" />
            {phone}
          </a>
        )}
      </div>
    </div>
  )
}

export function TeamArchive() {
  const a = useEntry(data.archives)
  if (!a) return <NotFound />
  return (
    <div className="mx-auto w-full max-w-[1300px] px-5 pb-[70px] pt-[110px] xl:px-[15px]">
      <div className="grid gap-x-[30px] gap-y-[60px] sm:grid-cols-2 lg:grid-cols-4">
        {a.cards.map((c) => (
          <TeamCard key={c.href + c.name} {...c} />
        ))}
      </div>
      <Pagination items={a.pagination} />
    </div>
  )
}

export function TeamSingle() {
  const s = useEntry(data.singles)
  if (!s) return <NotFound />
  const [first, ...rest] = s.excerpts
  return (
    <Container className="pb-[70px] pt-[110px]">
      <div className="relative flex flex-col overflow-hidden bg-white shadow-card md:flex-row">
        <img src={s.image} alt={s.name} className="aspect-square w-full object-cover md:w-[420px]" />
        <div className="grid flex-1 gap-10 px-[30px] py-10 md:grid-cols-2 md:px-[60px] md:py-[55px]">
          <div>
            <p className="font-heading text-[22px] text-ink">{s.name}</p>
            <p className="mt-1 font-heading text-[17px] text-link">{s.job}</p>
            <div className="mt-6 space-y-3 text-[16px]">
              {s.fields.map((f) => (
                <div key={f.label}>
                  <span className="mr-2 font-heading text-ink">{f.label}</span>
                  {f.href ? (
                    <a href={f.href} className="hover:text-primary">
                      {f.value}
                    </a>
                  ) : (
                    f.value
                  )}
                </div>
              ))}
            </div>
            <ul className="mt-8 flex gap-2">
              {s.socials.map((c) => (
                <li key={c}>
                  <a href="#" className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#aab1c1] text-[13px] text-white hover:bg-primary" aria-label={c}>
                    <i className={c} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-10">
            {first && <p className="text-[19px] leading-[1.4] text-[#42516d]">{first}</p>}
            {rest.map((e) => (
              <p key={e} className="mt-5 text-[16px] leading-6">
                {e}
              </p>
            ))}
            {s.signature && <img src={s.signature} alt="" className="mt-6" />}
          </div>
        </div>
        {s.icon && (
          <i className={`${s.icon} pointer-events-none absolute -bottom-6 right-2 text-[150px] leading-none text-[#f1f2f5]`} />
        )}
      </div>
      <Blocks blocks={s.blocks} className="mt-[60px]" />
    </Container>
  )
}
