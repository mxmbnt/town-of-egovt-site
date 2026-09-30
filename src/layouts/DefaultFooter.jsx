import A from '../components/A.jsx'
import { Container } from '../components/ui.jsx'

const topMenu = [
  { label: 'About Us', href: '/about/' },
  { label: 'Services', href: '/page-service/' },
  { label: 'Events', href: '/event/' },
  { label: 'News', href: '/blog/?layout_sidebar=layout_2r&blog_template=default' },
  { label: 'Contact', href: '/contact-1/' },
  { label: 'Portfolio', href: '/ova_por/?archive_type_portfolio=grid' },
]

const columns = [
  {
    title: 'Service Request',
    links: [
      ['Apply for a City Job', '/ova_sev/your-goverment/'],
      ['Request a 311 Service', '/ova_sev/jobs-and-unemployment/'],
      ['Get a Parking Permit', '/ova_sev/business-and-industry-3/'],
      ['Building Permits', '/ova_sev/roads-transportation/'],
      ['Online Birth Certificate', '/ova_sev/culture-recreation/'],
      ['Trade License', '/ova_sev/justice-safty-and-the-law/'],
    ],
  },
  {
    title: 'Useful Links',
    links: [
      ['Our Blog', '/blog/'],
      ['Our History', '/history/'],
      ['Documentation', '/ova_doc/'],
      ['Environmental', '/municipal-faqs/'],
      ['Town Gallery', '/ova_por/?archive_type_portfolio=grid'],
      ['Department', '/department/'],
    ],
  },
]

export const socials = [
  { icon: 'fa fa-facebook-square', label: 'Facebook' },
  { icon: 'fa fa-twitter', label: 'Twitter' },
  { icon: 'fa fa-instagram', label: 'Instagram' },
  { icon: 'fa fa-youtube', label: 'YouTube' },
]

export function SocialCircles({ className = '', size = 'h-[35px] w-[35px]' }) {
  return (
    <div className={`flex gap-[5px] ${className}`}>
      {socials.map((s) => (
        <a
          key={s.label}
          href="#"
          aria-label={s.label}
          className={`grid place-items-center rounded-full border border-transparent bg-white text-[15px] text-navy transition-colors hover:border-white hover:bg-primary-hover hover:text-white ${size}`}
        >
          <i className={s.icon} />
        </a>
      ))}
    </div>
  )
}

export default function DefaultFooter() {
  return (
    <footer className="bg-footer font-heading">
      {/* Menu + réseaux */}
      <div className="border-b border-[#263a65] py-[37px]">
        <Container className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 px-3">
            {topMenu.map((l) => (
              <A key={l.label} href={l.href} className="text-[17px] text-soft transition-colors hover:text-white">
                {l.label}
              </A>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <h4 className="text-[18px] font-normal leading-[26px] !text-soft">Connect With Us</h4>
            <SocialCircles />
          </div>
        </Container>
      </div>

      {/* Colonnes */}
      <div className="pb-[93px] pt-[70px]">
        <Container className="grid gap-12 md:grid-cols-2 lg:grid-cols-[326px_268px_238px_1fr] lg:gap-0">
          <div
            className="bg-contain bg-bottom bg-no-repeat pb-6"
            style={{ backgroundImage: "url('/wp/2020/07/bg_footer.png')" }}
          >
            <A href="/">
              <img src="/wp/2020/07/logo-footer.png" alt="EGovt" className="w-[134px]" />
            </A>
            <p className="mb-3 mt-6 text-[17px] leading-6 tracking-[0.2px] text-soft">
              95 FF3, App Street Avenue
              <br />
              NSW 96209, Canada
            </p>
            <ul className="space-y-[9px] text-[17px] leading-[22px] text-white">
              <li>
                <span className="flex items-center gap-[15px]">
                  <i className="far fa-clock w-[15px] text-[15px] text-muted" />
                  Opening Hours:
                </span>
                <span className="mt-1 block pl-[30px] text-[16px] text-muted">Mon – Fri: 8:00 am – 6:00 pm</span>
              </li>
              <li className="flex items-center gap-[15px]">
                <i className="fas fa-phone-alt w-[15px] text-[15px] text-muted" />
                <a href="tel:18001234567" className="group">
                  Phone: <span className="text-muted transition-colors group-hover:text-primary-hover">1800 123 4567</span>
                </a>
              </li>
              <li className="flex items-center gap-[15px]">
                <i className="fas fa-envelope w-[15px] text-[15px] text-muted" />
                <a href="mailto:demo@example.com" className="group">
                  Email:{' '}
                  <span className="text-muted transition-colors group-hover:text-primary-hover">demo@example.com</span>
                </a>
              </li>
            </ul>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-[24px] font-medium leading-[1.2] !text-white">{c.title}</h4>
              <ul className="mt-[22px] space-y-[11px]">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <A href={href} className="group flex items-center gap-2 text-[17px] text-soft hover:text-white">
                      <i className="arrow_carrot-right text-[14px] text-muted transition-transform group-hover:translate-x-0.5" />
                      {label}
                    </A>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[24px] font-medium leading-[1.2] !text-white">City News &amp; Updates</h4>
            <p className="mt-[22px] font-sans text-[17px] leading-6 text-soft">
              The latest Egovt news, articles, and resources, sent straight to your inbox every month.
            </p>
            <form className="mt-9 flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your Email"
                className="h-[60px] min-w-0 flex-1 bg-white px-5 font-sans text-[17px] text-ink outline-none placeholder:text-[#8c96ac]"
              />
              <button className="h-[60px] bg-primary px-5 text-[16px] font-bold uppercase text-white transition-colors hover:bg-primary-hover">
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </div>

      <div className="bg-navy py-[38px] text-center">
        <h4 className="text-[17px] font-normal !text-soft">EGovt Theme - ovatheme © 2025. All Rights Reserved</h4>
      </div>
    </footer>
  )
}
