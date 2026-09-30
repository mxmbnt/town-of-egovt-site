import { Container, Icon, SocialRound } from '../../../components/ui.jsx'

const columns = [
  {
    title: 'Service Request',
    links: ['Apply for a City Job', 'Request a 311 Service', 'Get a Parking Permit', 'Building Permits', 'Online Birth Certificate', 'Trade License'],
  },
  {
    title: 'Useful Links',
    links: ['Our Blog', 'Our History', 'Documentation', 'Environmental', 'Town Gallery', 'Department'],
  },
  {
    title: 'More Info',
    links: ['Get the Theme!', 'Documentation', 'Demo Credit', 'Get More Themes', 'Support Center'],
  },
]

function Newsletter() {
  return (
    <div className="relative z-10 mx-auto max-w-[1290px] px-5 lg:px-[10px]">
      <div
        className="flex flex-col gap-8 bg-accent bg-cover bg-center px-6 py-[70px] lg:flex-row lg:items-center lg:gap-5 lg:px-[24px]"
        style={{ backgroundImage: "url('/img/newsletter-pattern.jpg')" }}
      >
        <div className="flex items-center gap-9 lg:w-[440px] lg:shrink-0">
          <svg viewBox="0 0 48 52" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" className="h-[52px] w-[44px] shrink-0">
            <path d="M2 22l22-14 22 14v28H2zM2 22l22 16 22-16M2 50l16-14M46 50L30 36" />
            <rect x="12" y="2" width="24" height="26" rx="2" fill="#df193a" />
            <path d="M18 10h12M18 16h12" />
          </svg>
          <h2 className="text-[32px] font-medium !text-white">Be Updated with us</h2>
        </div>
        <form className="grid flex-1 gap-5 sm:grid-cols-[1fr_1fr_150px]" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Your Name" className="h-[60px] bg-white px-5 text-[17px] text-ink outline-none placeholder:text-[#a3adc2]" />
          <input type="email" placeholder="Your Email" className="h-[60px] bg-white px-5 text-[17px] text-ink outline-none placeholder:text-[#a3adc2]" />
          <button className="h-[60px] bg-navy font-heading text-[16px] font-bold text-white transition-colors hover:bg-white hover:text-navy">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative">
      <div className="absolute inset-x-0 bottom-0 top-[100px] bg-footer" />
      <Newsletter />

      <Container className="relative grid gap-12 pt-[90px] pb-[90px] md:grid-cols-2 lg:grid-cols-[505px_287px_243px_1fr] lg:gap-0">
        <div>
          <img src="/img/logo.svg" alt="Town of EGovt" className="h-[70px] w-auto" />
          <p className="mt-6 max-w-[430px] text-[17px] leading-[1.45] text-[#8f9bb4]">
            Egovt WordPress theme is ideal for presenting your town, city, local municipality, community, business,
            Corporate Non profit or political websites as well.
          </p>
          <div className="mt-6">
            <SocialRound light size="h-[35px] w-[35px]" networks={['facebook', 'twitter', 'instagram', 'youtube']} />
          </div>
        </div>

        {columns.map((c) => (
          <div key={c.title}>
            <h4 className="text-[24px] font-medium !text-white">{c.title}</h4>
            <ul className="mt-6 space-y-[11px]">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="group flex items-center gap-1.5 font-heading text-[18px] text-[#a3adc2] hover:text-white">
                    <Icon.chevronRight className="h-3 w-3 text-[#5f6d8d] transition-transform group-hover:translate-x-0.5" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="relative bg-navy py-9 text-center font-heading text-[18px] text-[#a3adc2]">
        EGovt Template - Mad UX © 2020. All Rights Reserved
      </div>
    </footer>
  )
}
