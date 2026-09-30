import A from '../components/A.jsx'
import { Container } from '../components/ui.jsx'

// Bandeau « titre + fil d'Ariane » présent en haut de toutes les pages internes
export default function PageTitle({ title, crumbs = [], bg }) {
  return (
    <section
      className={`relative bg-cover bg-center ${bg ? 'bg-navy' : 'bg-[#9ca3b0]'}`}
      style={bg ? { backgroundImage: `url('${bg}')` } : undefined}
    >
      {bg && <div className="absolute inset-0 bg-navy/40" />}
      <Container className={`relative flex flex-col justify-center ${title ? 'min-h-[300px] py-16' : 'min-h-[129px]'}`}>
        {title && (
          <h1 className="font-heading text-[40px] font-semibold leading-[1.2] !text-white sm:text-[50px]">{title}</h1>
        )}
        <nav aria-label="Fil d'Ariane" className={title ? 'mt-3' : ''}>
          <ol className="flex flex-wrap items-center gap-x-1 font-heading text-[18px] text-white">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <i className="arrow_carrot-right text-[20px]" aria-hidden="true" />}
                {c.href ? (
                  <A href={c.href} className="transition-colors hover:text-primary">
                    {c.label}
                  </A>
                ) : (
                  <span>{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </section>
  )
}
