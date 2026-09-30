import { useState } from 'react'
import A from '../../components/A.jsx'
import { Pagination, SearchBox, WidgetTitle } from '../../components/common.jsx'
import { Container } from '../../components/ui.jsx'
import data from '../../data/donations.json'
import { useEntry } from '../../lib/useData.js'
import NotFound from '../NotFound.jsx'

function DonateButton({ href, small = false }) {
  return (
    <A
      href={href}
      className={`inline-block bg-navy font-heading text-white transition-colors hover:bg-primary ${small ? 'px-2 py-1 text-[13px]' : 'px-4 py-2 text-[15px]'}`}
    >
      Donate Now
    </A>
  )
}

function Raised({ raised, goal, sep = '/ Goal' }) {
  return (
    <p className="text-[16px]">
      <span className="font-heading text-ink">Raised</span> {raised} <span className="font-heading text-ink">{sep}</span> {goal}
    </p>
  )
}

function DonationCard({ c }) {
  return (
    <div className="h-full bg-white shadow-card">
      <A href={c.href} className="block overflow-hidden">
        <img src={c.image} alt="" className="aspect-[3/2] w-full object-cover transition-transform duration-500 hover:scale-105" />
      </A>
      <div className="px-5 pb-6 pt-5">
        <h3 className="font-heading text-[22px] font-medium text-ink">
          <A href={c.href} className="hover:text-primary">
            {c.title}
          </A>
        </h3>
        <div className="relative mt-4 h-1 bg-[#eee]">
          <span className="absolute -left-2.5 -top-2 bg-primary px-1.5 py-0.5 text-[10px] text-white">{c.percent}</span>
        </div>
        <div className="mt-8">
          <Raised {...c} />
        </div>
        <div className="mt-5">
          <DonateButton href={c.href} />
        </div>
      </div>
    </div>
  )
}

function DonationSidebar() {
  const s = data.sidebar
  return (
    <div className="space-y-[40px]">
      <SearchBox />
      <div>
        <WidgetTitle>{s.catsTitle}</WidgetTitle>
        <ul className="space-y-2.5 border-t border-[#e5e5e5] pt-4">
          {s.cats.map((c) => (
            <li key={c.href}>
              <A href={c.href} className="flex items-center gap-2 text-[16px] hover:text-primary">
                <i className="arrow_carrot-right" />
                {c.label}
              </A>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <WidgetTitle>{s.urgentTitle}</WidgetTitle>
        <ul className="border-t border-[#e5e5e5]">
          {s.urgent.map((u) => (
            <li key={u.href} className="flex gap-4 border-b border-[#e5e5e5] py-4">
              <A href={u.href} className="shrink-0">
                <img src={u.image} alt="" className="h-20 w-20 object-cover" />
              </A>
              <div>
                <A href={u.href} className="font-heading text-[18px] text-ink hover:text-primary">
                  {u.title}
                </A>
                <div className="text-[14px]">
                  <Raised raised={u.raised} goal={u.goal} sep="/" />
                </div>
                <div className="mt-2">
                  <DonateButton href={u.href} small />
                </div>
              </div>
            </li>
          ))}
        </ul>
        {s.button && (
          <A href={s.button.href} className="mt-5 inline-flex items-center gap-1 font-heading text-[16px] text-ink hover:text-primary">
            {s.button.text}
            <i className="arrow_carrot-right" />
          </A>
        )}
      </div>
      <A href="/contact-1/" className="block">
        <img src="/wp/2020/07/image_sidebar_document.png" alt="Need any help? Contact now" className="w-full max-w-[300px]" />
      </A>
    </div>
  )
}

export function DonationsArchive() {
  const a = useEntry(data.archives)
  if (!a) return <NotFound />
  const cols = { type_1: 'md:grid-cols-2', type_2: 'md:grid-cols-3', type_3: 'sm:grid-cols-2 lg:grid-cols-4', type_4: '' }[a.type]
  const sidebar = a.type === 'type_1' || a.type === 'type_4'
  const grid = (
    <div className={`grid gap-[25px] ${cols}`}>
      {a.cards.map((c) => (
        <DonationCard key={c.href} c={c} />
      ))}
    </div>
  )
  return (
    <Container className="pb-[110px] pt-[90px]">
      {a.title && (
        <div className="mb-[60px] text-center">
          <p className="font-heading text-[15px] font-medium uppercase text-primary">{a.title}</p>
          <h2 className="mx-auto mt-1 max-w-[520px] font-heading text-[40px] font-semibold leading-[1.15] text-ink">{a.subtitle}</h2>
        </div>
      )}
      {sidebar ? (
        <div className="flex flex-col gap-[80px] lg:flex-row">
          <div className="min-w-0 flex-1">{grid}</div>
          <aside className="w-full shrink-0 lg:w-[350px]">
            <DonationSidebar />
          </aside>
        </div>
      ) : (
        grid
      )}
      <Pagination items={a.pagination} />
    </Container>
  )
}

// Formulaire de don façon GiveWP (démo : aucun paiement)
export function DonationForm({ compact = false }) {
  const levels = [10, 25, 50, 100, 250, 500]
  const [amount, setAmount] = useState(10)
  const [custom, setCustom] = useState('')
  const [step, setStep] = useState(0)
  const value = custom ? parseFloat(custom) || 0 : amount
  const field = 'w-full rounded-[4px] border border-[#999] px-4 py-3 text-[16px] text-black outline-none focus:border-[#0b72d9]'
  return (
    <div className={compact ? '' : 'px-5 pb-4 pt-[120px]'}>
      <div className="mx-auto max-w-[560px] rounded-[4px] border border-[#eee] bg-white font-sans text-[#333] shadow-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="border-b-[8px] border-[#dbe2ea] bg-[#fafafa] py-4 text-center text-[16px] font-semibold text-black">
          {step === 0 ? 'How much would you like to donate today?' : step === 1 ? 'Who’s giving today?' : 'Thank you!'}
        </div>
        <div className="p-8">
          {step === 0 && (
            <>
              <p className="text-[16px] leading-6 text-black">All donations directly impact our organization and help us further our mission.</p>
              <div className="mt-6 flex items-center justify-between text-[16px] font-medium text-black">
                <span>
                  Donation Amount <span className="text-red-600">*</span>
                </span>
                <span className="rounded bg-[#e5e7eb] px-3 py-1 text-[12px]">USD $</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setAmount(l)
                      setCustom('')
                    }}
                    className={`rounded-[4px] border py-3.5 text-[18px] font-semibold ${
                      !custom && amount === l ? 'border-[#0b72d9] bg-[#0b72d9] text-white' : 'border-[#999] text-black'
                    }`}
                  >
                    ${l}.00
                  </button>
                ))}
              </div>
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Enter custom amount"
                className="mt-4 w-full rounded-[4px] border border-[#999] py-4 text-center text-[16px] text-black outline-none"
              />
              <button
                onClick={() => value > 0 && setStep(1)}
                className="mt-12 flex w-full items-center justify-center gap-3 rounded-[4px] bg-[#0b72d9] py-3.5 text-[16px] font-semibold text-white hover:bg-[#095cae]"
              >
                Donate now <span aria-hidden>→</span>
              </button>
            </>
          )}
          {step === 1 && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setStep(2)
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="First name" className={field} />
                <input required placeholder="Last name" className={field} />
              </div>
              <input required type="email" placeholder="Email address" className={field} />
              <button className="w-full rounded-[4px] bg-[#0b72d9] py-3.5 text-[16px] font-semibold text-white hover:bg-[#095cae]">
                Donate ${value.toFixed(2)}
              </button>
              <button type="button" onClick={() => setStep(0)} className="w-full text-[14px] text-[#555]">
                ← Back
              </button>
            </form>
          )}
          {step === 2 && <p className="text-center text-[16px] text-black">Ceci est une démo : aucun paiement n'a été effectué.</p>}
          <p className="mt-10 flex items-center justify-center gap-2 text-[13px] font-medium text-black">
            <i className="fas fa-lock text-[#2d9d4f]" /> 100% Secure Donation
          </p>
        </div>
      </div>
    </div>
  )
}
