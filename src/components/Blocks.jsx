import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import A from './A.jsx'
import Feather from './Feather.jsx'
import { isInternal } from '../lib/site.js'

// Rendu des blocs extraits du contenu Elementor d'origine (voir _capture/elementor.py)

// HTML riche : les liens internes passent par le routeur
export function RichHtml({ html, className = '' }) {
  const navigate = useNavigate()
  const onClick = (e) => {
    const a = e.target.closest('a')
    const href = a?.getAttribute('href')
    if (href && isInternal(href) && !a.target) {
      e.preventDefault()
      navigate(href)
    }
  }
  return <div className={`rich ${className}`} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
}

function Heading({ tag = 'h3', text, s: style }) {
  const Tag = tag
  return (
    <Tag className="font-heading text-[24px] font-medium leading-[1.3] text-ink" style={style}>
      {text}
    </Tag>
  )
}

function Carousel({ images }) {
  const [i, setI] = useState(0)
  const go = (d) => setI((v) => (v + d + images.length) % images.length)
  return (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${i * 100}%)` }}>
        {images.map((src) => (
          <img key={src} src={src} alt="" className="w-full shrink-0 object-cover" />
        ))}
      </div>
      {images.length > 1 &&
        [-1, 1].map((d) => (
          <button
            key={d}
            onClick={() => go(d)}
            aria-label={d < 0 ? 'Précédent' : 'Suivant'}
            className={`absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow transition-colors hover:bg-primary hover:text-white ${
              d < 0 ? 'left-4' : 'right-4'
            }`}
          >
            <i className={d < 0 ? 'arrow_carrot-left text-xl' : 'arrow_carrot-right text-xl'} />
          </button>
        ))}
    </div>
  )
}

function IconList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((it, k) => (
        <li key={k} className="flex gap-3 text-[16px] leading-[1.6]">
          {it.icon && <i className={`${it.icon} mt-[11px] text-[5px] text-ink`} />}
          {it.href ? <A href={it.href}>{it.text}</A> : <span>{it.text}</span>}
        </li>
      ))}
    </ul>
  )
}

function useCountdown(date) {
  const target = date ? new Date(date.replace(' ', 'T')).getTime() : 0
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.max(0, Math.floor((target - now) / 1000))
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60]
}

export function Countdown({ date, button }) {
  const parts = useCountdown(date)
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 bg-[#2a2f3b] px-[30px] py-[26px]">
      <div className="flex gap-8">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((l, k) => (
          <div key={l} className="text-center text-white">
            <div className="font-heading text-[30px] leading-none">{parts[k]}</div>
            <div className="mt-2 text-[14px]">{l}</div>
          </div>
        ))}
      </div>
      {button && (
        <A
          href={button.href}
          className="bg-white px-5 py-2.5 font-heading text-[16px] text-ink transition-colors hover:bg-primary hover:text-white"
        >
          {button.text}
        </A>
      )}
    </div>
  )
}

export function TeamSlider({ items }) {
  const per = 3
  const pages = Math.max(1, items.length - per + 1)
  const [i, setI] = useState(0)
  return (
    <div>
      <div className="overflow-hidden pb-10 pt-2">
        <div className="-mr-[30px] flex transition-transform duration-500" style={{ transform: `translateX(-${(i * 100) / per}%)` }}>
          {items.map((m) => (
            <div key={m.name} className="w-full shrink-0 pr-[30px] sm:w-1/2 md:w-1/3">
              <div className="bg-white px-5 pb-8 pt-[30px] text-center shadow-card">
                <A href={m.href} className="mx-auto block h-[120px] w-[120px] overflow-hidden rounded-full">
                  <img src={m.img} alt={m.name} className="h-full w-full object-cover" />
                </A>
                <A href={m.href} className="mt-5 block font-heading text-[18px] font-medium text-ink hover:text-primary">
                  {m.name}
                </A>
                <p className="text-[15px]">{m.job}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        {Array.from({ length: pages }, (_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Diapositive ${k + 1}`}
            className={`h-[5px] rounded-full transition-all ${k === i ? 'w-3 bg-primary' : 'w-[5px] bg-[#d9d9d9]'}`}
          />
        ))}
      </div>
    </div>
  )
}

export function FeatureCard({ icon, title, text, href, more, version = 'version_1' }) {
  if (version.includes('version_2')) {
    return (
      <A href={href} className="group block h-full bg-white px-5 pb-[58px] pt-[42px] text-center shadow-card">
        <span className={`${icon} text-[50px] leading-none text-primary`} />
        <h3 className="mt-5 font-heading text-[24px] font-medium leading-[1.05] text-ink transition-colors group-hover:text-primary">
          {title}
        </h3>
      </A>
    )
  }
  return (
    <div className="group relative h-full overflow-hidden border border-[#e5e5e5] bg-white p-[30px] transition-shadow hover:shadow-card">
      <span className={`${icon} block text-[50px] leading-none text-primary`} />
      <h3 className="mt-6 font-heading text-[24px] font-medium leading-[1.2] text-ink">
        <A href={href} className="transition-colors hover:text-primary">
          {title}
        </A>
      </h3>
      {text && (
        <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="mt-3 text-[16px]">{text}</p>
            {more && (
              <A href={href} className="mt-3 inline-flex items-center gap-2 font-heading text-[16px] text-primary">
                {more}
                <Feather name="arrow-right" className="h-4 w-4" />
              </A>
            )}
          </div>
        </div>
      )}
      <span
        className={`${icon} pointer-events-none absolute -bottom-4 -right-3 text-[110px] leading-none text-[#f3f3f3] opacity-0 transition-opacity group-hover:opacity-100`}
      />
    </div>
  )
}

export function CheckedList({ items }) {
  return (
    <ul className="space-y-[14px]">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3.5 text-[17px] leading-6 text-[#42516d]">
          <Feather name="check-circle" className="mt-0.5 h-[20px] w-[20px] shrink-0 text-primary" />
          {t}
        </li>
      ))}
    </ul>
  )
}

export function FileItem({ name, type, size, href, icon, download = false }) {
  const ico = icon || (type?.toLowerCase().startsWith('doc') ? 'flaticon-doc' : 'flaticon-pdf')
  return (
    <div className="flex items-center gap-4 border-2 border-[#e5e5e5] px-[30px] py-[20px]">
      <i className={`${ico} text-[30px] leading-none text-[#8c96ac]`} />
      <div className="min-w-0 flex-1">
        <a href={href} download className="block break-all font-heading text-[18px] leading-[1.15] text-ink hover:text-primary">
          {name}
        </a>
        <span className="mt-1 block text-[15px] capitalize">
          {type} {size}
        </span>
      </div>
      {download && (
        <a href={href} download className="shrink-0 font-heading text-[16px] text-primary hover:underline">
          [ download ]
        </a>
      )}
    </div>
  )
}

function Files({ items, columns = 1 }) {
  return (
    <div className={`grid gap-[30px] ${columns === 2 ? 'sm:grid-cols-2' : 'gap-y-4'}`}>
      {items.map((f) => (
        <FileItem key={f.name + f.href} {...f} download={columns !== 2} />
      ))}
    </div>
  )
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="space-y-4">
      {items.map((it, k) => (
        <div key={it.title} className="border border-[#e5e5e5]">
          <button
            onClick={() => setOpen(open === k ? -1 : k)}
            className="flex w-full items-center justify-between px-6 py-4 text-left font-heading text-[18px] text-ink"
          >
            {it.title}
            <i className={`fas ${open === k ? 'fa-chevron-up' : 'fa-chevron-down'} text-[12px]`} />
          </button>
          {open === k && <RichHtml html={it.html} className="px-6 pb-5 text-[16px]" />}
        </div>
      ))}
    </div>
  )
}

export function Tabs({ items }) {
  const [i, setI] = useState(0)
  return (
    <div>
      <div className="flex flex-wrap">
        {items.map((it, k) => (
          <button
            key={it.title}
            onClick={() => setI(k)}
            className={`-mb-px border px-[30px] py-[15px] font-heading text-[20px] text-ink ${
              k === i ? 'border-[#e0e0e0] border-b-white border-t-2 border-t-primary bg-white' : 'border-transparent'
            }`}
          >
            {it.title}
          </button>
        ))}
      </div>
      <RichHtml html={items[i].html} className="border border-[#e0e0e0] px-[30px] py-[30px]" />
    </div>
  )
}

export function Education({ time, position, college }) {
  return (
    <div>
      <h3 className="flex items-center gap-3 font-heading text-[20px] font-normal text-ink">
        <span className="h-[9px] w-[9px] rounded-full border-2 border-primary" />
        {time}
      </h3>
      <p className="mt-3 pl-[21px] font-heading text-[17px] text-ink">{position}</p>
      <p className="pl-[21px] text-[16px]">{college}</p>
    </div>
  )
}

export function Skills({ items }) {
  return (
    <div className="space-y-[26px]">
      {items.map((s) => (
        <div key={s.label}>
          <div className="flex justify-between font-heading text-[17px] text-ink">
            {s.label}
            <span className="font-sans text-[15px] text-body">{s.percent}</span>
          </div>
          <div className="mt-3 h-[4px] bg-[#e5e5e5]">
            <div className="h-full bg-primary" style={{ width: s.percent }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ContactForm({ button = 'Send Message' }) {
  const [sent, setSent] = useState(false)
  const field = 'w-full border border-[#e0e0e0] bg-white px-5 py-3 text-[16px] text-ink outline-none focus:border-primary'
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <input required placeholder="Name" className={field} />
        <input required type="email" placeholder="Email" className={field} />
      </div>
      <input required placeholder="Subject" className={field} />
      <textarea required rows={5} placeholder="Write your message..." className={field} />
      <button className="bg-primary px-6 py-3 font-heading text-[17px] text-white transition-colors hover:bg-navy">
        {button}
      </button>
      {sent && <p className="text-[16px] text-ink">Thank you, your message has been sent.</p>}
    </form>
  )
}

export function DirCategories({ title, items }) {
  return (
    <div className="bg-[#f5f5f5] p-[30px]">
      <h2 className="font-heading text-[24px] font-medium text-ink">{title}</h2>
      <ul className="mt-4">
        {items.map((it) => (
          <li key={it.href} className="border-b border-[#e5e5e5] last:border-0">
            <A href={it.href} className="block py-2.5 font-heading text-[17px] text-ink hover:text-primary">
              {it.label}
            </A>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Block({ b }) {
  switch (b.t) {
    case 'html':
      return <RichHtml html={b.html} />
    case 'heading':
      return <Heading {...b} />
    case 'image':
      return b.href && b.href !== '#' ? (
        <A href={b.href}>
          <img src={b.src} alt={b.alt} className="w-full" />
        </A>
      ) : (
        <img src={b.src} alt={b.alt} className="w-full" />
      )
    case 'row': {
      // Colonnes Elementor : 10px de padding latéral par défaut, compensé par une marge négative de la rangée
      const plain = b.cols.every((c) => !c.s?.padding)
      return (
        <div className="flex flex-col md:flex-row" style={{ ...(plain ? { margin: '0 -10px' } : {}), ...b.s }}>
          {b.cols.map((c, k) => (
            <div key={k} className="min-w-0 max-md:!px-0" style={{ flex: `0 0 ${c.w}%`, padding: '0 10px', ...c.s }}>
              <Blocks blocks={c.blocks} />
            </div>
          ))}
        </div>
      )
    }
    case 'group':
      return <Blocks blocks={b.blocks} />
    case 'carousel':
      return <Carousel images={b.images} />
    case 'iconList':
      return <IconList items={b.items} />
    case 'countdown':
      return <Countdown {...b} />
    case 'teamSlider':
      return <TeamSlider items={b.items} />
    case 'feature':
      return <FeatureCard {...b} />
    case 'checked':
      return <CheckedList items={b.items} />
    case 'files':
      return <Files {...b} />
    case 'accordion':
      return <Accordion items={b.items} />
    case 'tabs':
      return <Tabs items={b.items} />
    case 'education':
      return <Education {...b} />
    case 'skills':
      return <Skills items={b.items} />
    case 'formMail':
      return <ContactForm button={b.button} />
    case 'dirCategories':
      return <DirCategories {...b} />
    case 'button':
      return (
        <A href={b.href} className="inline-block bg-primary px-6 py-3 font-heading text-white hover:bg-navy">
          {b.text}
        </A>
      )
    case 'divider':
      return <hr className="border-[#e5e5e5]" />
    default:
      return b.html ? <RichHtml html={b.html} /> : null
  }
}

// Styles Elementor propres au widget : la typographie va sur le titre, les marges sur l'enveloppe
const BOX = ['margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderStyle', 'borderWidth', 'borderColor', 'borderRadius', 'backgroundColor']
function split(style = {}) {
  const box = {}
  const typo = {}
  const size = {}
  for (const [k, v] of Object.entries(style)) {
    if (k === 'width' || k === 'maxWidth') size[k] = v
    else (BOX.includes(k) ? box : typo)[k] = v
  }
  return [box, typo, size]
}

// Comme Elementor : conteneur flex qui passe à la ligne, widgets pleine largeur sauf largeur personnalisée
export default function Blocks({ blocks = [], className = '' }) {
  return (
    <div className={`flex flex-wrap content-start ${className}`}>
      {blocks.map((b, k) => {
        const [box, typo, size] = split(b.s)
        const heading = b.t === 'heading'
        return (
          <div key={k} className={`min-w-0 ${size.width ? 'max-md:!w-full max-md:!max-w-full' : 'w-full'}`} style={size}>
            <div style={heading ? box : { ...box, ...typo }}>
              <Block b={heading ? { ...b, s: typo } : b} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
