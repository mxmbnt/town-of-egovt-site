import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SiteLayout, { ScrollToTop } from './layouts/SiteLayout.jsx'
import NotFound from './pages/NotFound.jsx'

// Chaque famille de pages est chargée à la demande (données JSON comprises)
const Home6 = lazy(() => import('./pages/home6/Home6.jsx'))
const Services = lazy(() => import('./pages/services/Services.jsx').then((m) => ({ default: m.ServicesArchive })))
const Service = lazy(() => import('./pages/services/Services.jsx').then((m) => ({ default: m.ServiceSingle })))
const Departments = lazy(() => import('./pages/departments/Departments.jsx').then((m) => ({ default: m.DepartmentsArchive })))
const Docs = lazy(() => import('./pages/docs/Docs.jsx').then((m) => ({ default: m.DocsArchive })))
const Doc = lazy(() => import('./pages/docs/Docs.jsx').then((m) => ({ default: m.DocSingle })))
const TeamList = lazy(() => import('./pages/team/Team.jsx').then((m) => ({ default: m.TeamArchive })))
const TeamMember = lazy(() => import('./pages/team/Team.jsx').then((m) => ({ default: m.TeamSingle })))
const Dirs = lazy(() => import('./pages/directory/Directory.jsx').then((m) => ({ default: m.DirectoryArchive })))
const Dir = lazy(() => import('./pages/directory/Directory.jsx').then((m) => ({ default: m.DirectorySingle })))
const EventsList = lazy(() => import('./pages/events/Events.jsx').then((m) => ({ default: m.EventsArchive })))
const EventPage = lazy(() => import('./pages/events/Events.jsx').then((m) => ({ default: m.EventSingle })))
const BlogList = lazy(() => import('./pages/blog/Blog.jsx').then((m) => ({ default: m.BlogArchive })))
const Post = lazy(() => import('./pages/blog/Blog.jsx').then((m) => ({ default: m.PostSingle })))
const Search = lazy(() => import('./pages/blog/Blog.jsx').then((m) => ({ default: m.SearchResults })))
const PorList = lazy(() => import('./pages/portfolio/Portfolio.jsx').then((m) => ({ default: m.PortfolioArchive })))
const Por = lazy(() => import('./pages/portfolio/Portfolio.jsx').then((m) => ({ default: m.PortfolioSingle })))
const shop = () => import('./pages/shop/Shop.jsx')
const ShopList = lazy(() => shop().then((m) => ({ default: m.ShopArchive })))
const Product = lazy(() => shop().then((m) => ({ default: m.ProductSingle })))
const Cart = lazy(() => shop().then((m) => ({ default: m.Cart })))
const Checkout = lazy(() => shop().then((m) => ({ default: m.Checkout })))
const MyAccount = lazy(() => shop().then((m) => ({ default: m.MyAccount })))
const LostPassword = lazy(() => shop().then((m) => ({ default: m.LostPassword })))
const DonationsList = lazy(() => import('./pages/donations/Donations.jsx').then((m) => ({ default: m.DonationsArchive })))
const DonationForm = lazy(() => import('./pages/donations/Donations.jsx').then((m) => ({ default: m.DonationForm })))
const LegacyPage = lazy(() => import('./pages/legacy/LegacyPage.jsx'))

// Accueils alternatifs présents seulement en local : sinon, redirection vers la home Local Town
const localHomes = import.meta.glob('./data/legacy/home-*.json')
const hasHome = (name) => `./data/legacy/${name}.json` in localHomes
function Home({ name }) {
  return hasHome(name) ? <LegacyPage name={name} /> : <Navigate to="/home-6/" replace />
}
const Department = lazy(() => import('./pages/departments/Departments.jsx').then((m) => ({ default: m.DepartmentSingle })))

// « / » : accueil par défaut, ou résultats de recherche si ?s= est présent
function Root() {
  const { search } = useLocation()
  if (new URLSearchParams(search).has('s')) {
    return (
      <SiteLayout>
        <Search />
      </SiteLayout>
    )
  }
  return hasHome('home-1') ? <LegacyPage name="home-1" /> : <Home6 />
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/home-6/" element={<Home6 />} />
          <Route path="/home-2/" element={<Home name="home-2" />} />
          <Route path="/home-3/" element={<Home name="home-3" />} />
          <Route path="/home-4/" element={<Home name="home-4" />} />
          <Route path="/home-5/" element={<Home name="home-5" />} />
          <Route path="/home-7/" element={<Home name="home-7" />} />
          <Route path="/home-8/" element={<Home name="home-8" />} />
          <Route path="/home-9/" element={<Home name="home-9" />} />
          <Route path="/coming-soon/" element={<LegacyPage name="coming-soon" />} />
          <Route element={<SiteLayout />}>
            <Route path="/ova_sev/" element={<Services />} />
            <Route path="/ova_sev/:slug/" element={<Service />} />
            <Route path="/ova_dep/" element={<Departments />} />
            <Route path="/ova_dep/page/:n/" element={<Departments />} />
            <Route path="/cat_dep/:cat/" element={<Departments />} />
            <Route path="/cat_dep/:cat/page/:n/" element={<Departments />} />
            <Route path="/ova_dep/:slug/" element={<Department />} />
            <Route path="/ova_doc/" element={<Docs />} />
            <Route path="/cat_doc/:cat/" element={<Docs />} />
            <Route path="/ova_doc/:slug/" element={<Doc />} />
            <Route path="/team/" element={<TeamList />} />
            <Route path="/cat_team/:cat/" element={<TeamList />} />
            <Route path="/team/:slug/" element={<TeamMember />} />
            <Route path="/ova_dir/" element={<Dirs />} />
            <Route path="/cat_dir/:cat/" element={<Dirs />} />
            <Route path="/tag_dir/:tag/" element={<Dirs />} />
            <Route path="/ova_dir/:slug/" element={<Dir />} />
            <Route path="/event/" element={<EventsList />} />
            <Route path="/event_type/:type/" element={<EventsList />} />
            <Route path="/event_tag/:tag/" element={<EventsList />} />
            <Route path="/event/:slug/" element={<EventPage />} />
            <Route path="/blog/" element={<BlogList />} />
            <Route path="/blog/page/:n/" element={<BlogList />} />
            <Route path="/category/:cat/" element={<BlogList />} />
            <Route path="/tag/:tag/" element={<BlogList />} />
            <Route path="/author/:author/" element={<BlogList />} />
            <Route path="/author/:author/page/:n/" element={<BlogList />} />
            <Route path="/ova_por/" element={<PorList />} />
            <Route path="/cat_por/:cat/" element={<PorList />} />
            <Route path="/ova_por/:slug/" element={<Por />} />
            <Route path="/shop/" element={<ShopList />} />
            <Route path="/shop/page/:n/" element={<ShopList />} />
            <Route path="/product-category/:cat/" element={<ShopList />} />
            <Route path="/product-tag/:tag/" element={<ShopList />} />
            <Route path="/product/:slug/" element={<Product />} />
            <Route path="/cart/" element={<Cart />} />
            <Route path="/checkout/" element={<Checkout />} />
            <Route path="/my-account/" element={<MyAccount />} />
            <Route path="/my-account/lost-password/" element={<LostPassword />} />
            <Route path="/donations/" element={<DonationsList />} />
            <Route path="/donations/category/:cat/" element={<DonationsList />} />
            <Route path="/donations/:slug/" element={<DonationForm />} />
            <Route path="/about/" element={<LegacyPage name="about" />} />
            <Route path="/history/" element={<LegacyPage name="history" />} />
            <Route path="/faq/" element={<LegacyPage name="faq" />} />
            <Route path="/municipal-faqs/" element={<LegacyPage name="municipal-faqs" />} />
            <Route path="/page-service/" element={<LegacyPage name="page-service" />} />
            <Route path="/page-team/" element={<LegacyPage name="page-team" />} />
            <Route path="/department/" element={<LegacyPage name="department" />} />
            <Route path="/directory-filter/" element={<LegacyPage name="directory-filter" />} />
            <Route path="/donate/" element={<LegacyPage name="donate" />} />
            <Route path="/become-a-volunteer/" element={<LegacyPage name="become-a-volunteer" />} />
            <Route path="/contact-1/" element={<LegacyPage name="contact-1" />} />
            <Route path="/contact-2/" element={<LegacyPage name="contact-2" />} />
            <Route path="/:slug/" element={<Post />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
