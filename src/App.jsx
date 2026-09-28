import { useEffect, useState } from 'react'
import { Icon } from './components/ui.jsx'
import Header from './sections/Header.jsx'
import Hero from './sections/Hero.jsx'
import Welcome from './sections/Welcome.jsx'
import News from './sections/News.jsx'
import Stats from './sections/Stats.jsx'
import Mayor from './sections/Mayor.jsx'
import Departments from './sections/Departments.jsx'
import Events from './sections/Events.jsx'
import Discover from './sections/Discover.jsx'
import Council from './sections/Council.jsx'
import Footer from './sections/Footer.jsx'

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="#top"
      aria-label="Back to top"
      className={`fixed bottom-4 right-5 z-40 grid h-[30px] w-[30px] place-items-center rounded-[3px] bg-[#e02f12] text-white transition-opacity ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <Icon.chevronUp className="h-3.5 w-3.5" />
    </a>
  )
}

export default function App() {
  return (
    <div id="top" className="overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Welcome />
        <News />
        <Stats />
        <Mayor />
        <Departments />
        <Events />
        <Discover />
        <Council />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
