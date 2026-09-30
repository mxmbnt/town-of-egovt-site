import BackToTop from '../../components/BackToTop.jsx'
import { useDocumentTitle } from '../../layouts/SiteLayout.jsx'
import Council from './sections/Council.jsx'
import Departments from './sections/Departments.jsx'
import Discover from './sections/Discover.jsx'
import Events from './sections/Events.jsx'
import Footer from './sections/Footer.jsx'
import Header from './sections/Header.jsx'
import Hero from './sections/Hero.jsx'
import Mayor from './sections/Mayor.jsx'
import News from './sections/News.jsx'
import Stats from './sections/Stats.jsx'
import Welcome from './sections/Welcome.jsx'

// Home « Local Town » (home-6) : en-tête et pied de page propres à cette page
export default function Home6() {
  useDocumentTitle('Home 6 - EGovt')

  return (
    <div className="overflow-x-hidden">
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
