import { useState } from 'react'
import { Icon, SocialRound } from '../../../components/ui.jsx'

const quickLinks = ['Request a Service', 'Administrator', 'Goverment', 'FAQs']
const menu = ['Home', 'Pages', 'Department', 'Event', 'Blog', 'Portfolio', 'Contact']

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-30">
      {/* Barre du haut */}
      <div className="bg-navy">
        <div className="mx-auto flex h-[98px] max-w-[1440px] items-stretch">
          <a href="#" className="flex items-center bg-[#1b2a52] px-5 sm:px-[88px] lg:w-[397px]">
            <img src="/img/logo.svg" alt="Town of EGovt, established 1705" className="h-[58px] w-auto" />
          </a>
          <div className="flex flex-1 items-center justify-end gap-8 px-5 lg:px-[95px]">
            <nav className="hidden items-center gap-[30px] xl:flex">
              <span className="flex items-center gap-2 font-heading text-[15px] font-bold text-white">
                <Icon.external className="h-4 w-4 text-accent" />
                QUICK LINK
              </span>
              {quickLinks.map((l) => (
                <a key={l} href="#" className="text-[15px] text-[#a3adc2] transition-colors hover:text-white">
                  {l}
                </a>
              ))}
            </nav>
            <a
              href="#"
              className="hidden bg-accent px-[18px] py-[11px] font-heading text-[17px] font-medium text-white transition-colors hover:bg-white hover:text-accent sm:inline-block"
            >
              Report an Issues
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-11 w-11 place-items-center bg-accent text-white lg:hidden"
              aria-label="Menu"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-[2px] w-5 bg-white" />
                <span className="block h-[2px] w-5 bg-white" />
                <span className="block h-[2px] w-5 bg-white" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu principal */}
      <div className="bg-white">
        <div className="mx-auto hidden h-20 max-w-[1290px] items-center px-5 lg:flex">
          <nav className="flex items-center gap-[26px]">
            {menu.map((m) => (
              <a
                key={m}
                href="#"
                className="flex items-center gap-1 font-heading text-[18px] text-ink transition-colors hover:text-accent"
              >
                {m}
                <Icon.chevronDown className="h-3 w-3" />
              </a>
            ))}
          </nav>
          <form className="ml-auto flex h-[50px] w-[270px]" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search Here..."
              className="h-full flex-1 rounded-l-[30px] border border-r-0 border-[#e0e0e0] px-5 text-[17px] text-ink outline-none placeholder:text-body"
            />
            <button className="grid w-[50px] place-items-center rounded-r-[30px] bg-accent text-white" aria-label="Search">
              <Icon.search className="h-5 w-5" />
            </button>
          </form>
          <div className="ml-[86px]">
            <SocialRound />
          </div>
        </div>

        {open && (
          <nav className="border-t border-black/5 px-5 py-4 lg:hidden">
            {menu.map((m) => (
              <a key={m} href="#" className="block border-b border-black/5 py-3 font-heading text-[17px] text-ink">
                {m}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
