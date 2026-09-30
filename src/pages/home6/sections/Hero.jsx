import { useEffect, useState } from 'react'
import { Button, Container } from '../../../components/ui.jsx'

const slides = ['/img/hero/slide-1.jpg', '/img/hero/slide-2.jpg', '/img/hero/slide-3.jpg']

const features = [
  {
    title: 'For Business',
    text: 'This present moment is perfect simply due to the fact you’re experiencing it. you can get away.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" className="h-[60px] w-[60px]">
        <rect x="4" y="18" width="56" height="40" rx="3" />
        <path d="M22 18v-7a3 3 0 013-3h14a3 3 0 013 3v7M4 32h56" />
        <rect x="14" y="40" width="10" height="10" />
        <rect x="40" y="40" width="10" height="10" />
        <circle cx="32" cy="26" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'For Visitors',
    text: 'On top of our attention to Politician and service is a commitment to excellence all qualities admire.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" className="h-[60px] w-[60px]">
        <path d="M30 4C18 4 10 13 10 24c0 9 8 16 14 22h12c6-6 14-13 14-22C50 13 42 4 30 4z" />
        <path d="M30 4c-6 5-8 12-8 20s2 16 2 22M30 4c6 5 8 12 8 20s-2 16-2 22" />
        <rect x="23" y="50" width="14" height="10" rx="1" />
        <path d="M44 14a6 6 0 0112 1 5 5 0 01-1 10h-9" />
      </svg>
    ),
  },
  {
    title: 'For Residents',
    text: 'In care winshape camps launched life-changing summers with our very first overnight camp.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-[60px] w-[60px]">
        <circle cx="40" cy="8" r="5" />
        <path d="M36 16l-6 14 10 6-4 18M30 30l-8 6-6-2M40 20l6 10 8 2M36 54h8" />
        <path d="M4 30h10M8 38h10M2 46h12M24 44l-6 12h-6" />
      </svg>
    ),
  },
]

export default function Hero() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative">
      <div className="relative h-[620px] overflow-hidden sm:h-[720px] lg:h-[830px]">
        {slides.map((src, k) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1500ms] ${
              k === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-[#2a4a7a]/35" />

        <div className="relative flex h-full flex-col items-center justify-center px-5 pb-24 text-center lg:pb-[110px]">
          <h1 className="max-w-[700px] text-[44px] font-semibold leading-[1.18] !text-white sm:text-[64px]">
            A vibrant, welcoming, green town
          </h1>
          <p className="mt-6 text-[20px] text-white">
            Every year 2 million people from worldwide don’t forget to visit here.
          </p>
          <Button className="mt-12 h-[50px] px-[31px] text-[18px]">Discover More</Button>
        </div>

        <div className="absolute bottom-40 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden">
          {slides.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Slide ${k + 1}`}
              className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-accent' : 'w-2 bg-white/60'}`}
            />
          ))}
        </div>
      </div>

      {/* Cartes qui chevauchent le bas du hero */}
      <Container className="relative -mt-[110px]">
        <div className="grid gap-[30px] md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="bg-white px-[30px] pt-10 pb-10 shadow-card">
              <div className="text-accent">{f.icon}</div>
              <h3 className="mt-5 text-[30px] font-medium">{f.title}</h3>
              <p className="mt-4 text-[17px] leading-[1.45]">{f.text}</p>
              <a
                href="#"
                className="mt-6 inline-block border-2 border-line px-5 py-2 font-heading text-[16px] font-medium text-ink transition-colors hover:border-accent hover:bg-accent hover:text-white"
              >
                More Details
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
