import { useEffect, useRef, useState } from 'react'
import { Button, Container, SectionHeading } from '../../../components/ui.jsx'

const svg = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' }

// Pictos au trait blanc, dans l'esprit des flaticons du thème
const icons = {
  house: <path d="M6 30L24 14l18 16M10 27v17h28V27M20 44V33h8v11" />,
  leaf: <path d="M10 42C10 20 24 8 42 8c0 18-12 32-32 34zM10 42L28 24" />,
  shield: <path d="M24 4l16 6v12c0 11-7 19-16 22C15 41 8 33 8 22V10zM17 24l5 5 9-10" />,
  chart: <path d="M6 42h36M10 42V28h6v14M21 42V20h6v22M32 42V12h6v30" />,
  scale: (
    <path d="M24 6v34M14 44h20M10 12h28M10 12L4 26a6 6 0 0012 0zM38 12l-6 14a6 6 0 0012 0zM24 4a2 2 0 010 4" />
  ),
  money: <path d="M18 10h12l-3 6h-6zM21 16C10 20 8 30 10 36c2 5 8 8 14 8s12-3 14-8c2-6 0-16-11-20M24 24v14M28 27h-6a2 2 0 000 5h4a2 2 0 010 5h-6" />,
  train: <path d="M14 6h20a4 4 0 014 4v22a4 4 0 01-4 4H14a4 4 0 01-4-4V10a4 4 0 014-4zM10 22h28M17 29h.01M31 29h.01M16 36l-6 8M32 36l6 8" />,
  tent: <path d="M24 6v6M24 12L6 26h36zM8 26v18h32V26M18 44V34a6 6 0 0112 0v10M24 6l6 3-6 3" />,
  tree: <path d="M24 44V22M24 30l-6-5M24 26l6-5M24 4c-9 0-14 7-14 14 0 6 4 10 14 10s14-4 14-10c0-7-5-14-14-14zM14 44h20" />,
}

const departments = [
  { title: 'Constution and Law', img: '/img/dept/law.jpg', icon: 'scale' },
  { title: 'Finance and Economy', img: '/img/dept/finance.jpg', icon: 'money' },
  { title: 'Roads and Transport', img: '/img/dept/roads.jpg', icon: 'train' },
  { title: 'Art and Culture', img: '/img/dept/art.jpg', icon: 'tent' },
  { title: 'Park and Recreation', img: '/img/dept/park.jpg', icon: 'tree' },
  { title: 'Housing and Land', img: '/img/dept/housing.jpg', icon: 'house' },
  { title: 'Agriculture and Food', img: '/img/dept/agriculture.jpg', icon: 'leaf' },
  { title: 'Policing and Crime', img: '/img/dept/policing.jpg', icon: 'shield' },
  { title: 'Business & Industry', img: '/img/dept/business.jpg', icon: 'chart' },
]

export default function Departments() {
  const track = useRef(null)
  const [active, setActive] = useState(0)

  // Synchronise les puces avec le défilement du carrousel
  useEffect(() => {
    const el = track.current
    const onScroll = () => {
      const card = el.firstElementChild
      if (!card) return
      setActive(Math.round(el.scrollLeft / (card.offsetWidth + 30)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (k) => {
    const card = track.current.children[k]
    track.current.scrollTo({ left: card.offsetLeft - track.current.offsetLeft, behavior: 'smooth' })
  }

  return (
    <section className="py-[100px]">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <SectionHeading
            className="max-w-[640px]"
            title="Explore Our Goverment Departments"
            text="We are offering the following information's about us that what we actually."
          />
          <Button variant="navy" className="h-[50px] px-[30px] text-[18px]">
            Explore Services
          </Button>
        </div>

        <div ref={track} className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-[30px] overflow-x-auto">
          {departments.map((d) => (
            <a
              key={d.title}
              href="#"
              className="group relative h-[350px] w-[80%] shrink-0 snap-start overflow-hidden sm:w-[calc((100%-30px)/2)] lg:w-[calc((100%-90px)/4)]"
            >
              <img
                src={d.img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-[60px] left-[30px] right-5 text-white">
                <svg viewBox="0 0 48 48" {...svg} className="h-[46px] w-[46px]">
                  {icons[d.icon]}
                </svg>
                <h3 className="mt-5 text-[24px] font-medium leading-tight !text-white">{d.title}</h3>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-7 flex justify-center gap-3">
          {departments.map((d, k) => (
            <button
              key={d.title}
              onClick={() => goTo(k)}
              aria-label={`Slide ${k + 1}`}
              className={`h-[6px] rounded-full transition-all ${k === active ? 'w-3 bg-accent' : 'w-[6px] bg-[#e0e0e0]'}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
