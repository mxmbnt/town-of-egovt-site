import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useNavigate } from 'react-router-dom'
import Swiper from 'swiper'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import swiperCss from 'swiper/css?inline'
import BackToTop from '../../components/BackToTop.jsx'
import { isInternal } from '../../lib/site.js'
import { DonationForm } from '../donations/Donations.jsx'
import HeroSlider from './HeroSlider.jsx'

// Pages composées dans Elementor sur le site d'origine (about, contact, accueils…) :
// on réutilise leur balisage et leur CSS d'origine (cantonné à .egl), puis on
// rebranche en React ce que faisait le JavaScript du thème.
const pages = import.meta.glob('../../data/legacy/*.json')

// Polices : les @font-face doivent être déclarés au niveau du document (ignorés dans un Shadow DOM)
function useLegacyFonts() {
  useEffect(() => {
    if (document.getElementById('egl-fonts')) return
    const l = document.createElement('link')
    l.id = 'egl-fonts'
    l.rel = 'stylesheet'
    l.href = '/legacy/fonts.css'
    document.head.appendChild(l)
  }, [])
}

// Styles propres au clone, ajoutés dans le Shadow DOM à côté du CSS d'origine
const SHADOW_CSS = `
:host { display: block; }
.egl img { max-width: 100%; height: auto; }
.egl-slider-btn:hover { background: var(--hover-bg) !important; }
.egl-slider-arrow { position: absolute; top: 50%; z-index: 10; display: grid; place-items: center; width: 70px; height: 70px;
  transform: translateY(-50%); border: 0; border-radius: 50%; background: rgba(0,0,0,.5); color: #fff; font-size: 20px; cursor: pointer; }
.egl-slider-arrow:hover { background: rgba(0,0,0,.7); }
@media (max-width: 767px) { .egl-slider-arrow { display: none; } }
.egl-video { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; background: rgba(0,0,0,.85); padding: 20px; }
.egl-video > div { position: relative; width: 100%; max-width: 960px; aspect-ratio: 16/9; }
.egl-video iframe { width: 100%; height: 100%; border: 0; }
`

// Monte un composant React dans le Shadow DOM, dans sa propre racine (les évènements React
// ne traversent pas une frontière d'ombre depuis la racine de l'application)
function mount(el, node, withAppCss = false) {
  let target = el
  if (withAppCss) {
    // formulaire en Tailwind : Shadow DOM imbriqué qui reçoit les styles de l'application
    const inner = el.attachShadow({ mode: 'open' })
    document.querySelectorAll('head style, head link[rel="stylesheet"]').forEach((s) => {
      if (!s.id?.startsWith('egl')) inner.appendChild(s.cloneNode(true))
    })
    target = document.createElement('div')
    inner.appendChild(target)
  }
  const r = createRoot(target)
  r.render(node)
  return () => setTimeout(() => r.unmount())
}

function useFonts(urls = []) {
  useEffect(() => {
    for (const href of urls) {
      if (document.querySelector(`link[href="${href}"]`)) continue
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      document.head.appendChild(l)
    }
  }, [urls])
}

// ---------------------------------------------------------------- Comportements rebranchés

function initSwipers(root) {
  const list = []
  root.querySelectorAll('[data-options] > .swiper').forEach((el) => {
    const box = el.parentElement
    let o = {}
    try {
      o = JSON.parse(box.dataset.options)
    } catch {
      /* réglages illisibles : valeurs par défaut */
    }
    el.classList.remove('swiper-loading')
    const bp = {}
    for (const [w, v] of Object.entries(o.breakpoints || {})) bp[w] = { slidesPerView: v.slidesPerView }
    list.push(
      new Swiper(el, {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: o.slidesPerView || 1,
        slidesPerGroup: o.slidesPerGroup || 1,
        spaceBetween: o.spaceBetween ?? 30,
        speed: o.speed || 500,
        loop: !!o.loop,
        centeredSlides: !!o.centeredSlides,
        autoplay: o.autoplay ? { delay: o.delay || 3000, pauseOnMouseEnter: !!o.pauseOnMouseEnter } : false,
        navigation: o.nav ? { prevEl: box.querySelector('.button-prev'), nextEl: box.querySelector('.button-next') } : false,
        pagination: o.dots && box.querySelector('.button-dots') ? { el: box.querySelector('.button-dots'), clickable: true } : false,
        breakpoints: bp,
      }),
    )
  })
  return () => list.forEach((s) => s.destroy(true, false))
}

function initCounters(root) {
  const els = [...root.querySelectorAll('.elementor-counter-number')]
  const run = (el) => {
    const to = parseFloat(el.dataset.toValue || '0')
    const dec = (el.dataset.toValue || '').split('.')[1]?.length || 0
    const dur = parseInt(el.dataset.duration || '2000', 10)
    const t0 = performance.now()
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur)
      el.textContent = (to * k).toFixed(dec)
      if (k < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => (el.textContent = el.dataset.toValue))
    return () => {}
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries)
      if (e.isIntersecting) {
        run(e.target)
        io.unobserve(e.target)
      }
  })
  els.forEach((el) => io.observe(el))
  return () => io.disconnect()
}

// Onglets / accordéons / bascules Elementor, menus, recherche, formulaires…
function onClick(root, navigate) {
  return (e) => {
    const t = e.target
    // accordéon, bascule, onglets Elementor
    const title = t.closest('.elementor-tab-title')
    if (title) {
      const w = title.closest('.elementor-widget')
      const tab = title.dataset.tab
      const isTabs = w.classList.contains('elementor-widget-tabs')
      const isAcc = w.classList.contains('elementor-widget-accordion')
      w.querySelectorAll('.elementor-tab-title').forEach((x) => {
        const on = x.dataset.tab === tab ? (isTabs ? true : !title.classList.contains('elementor-active')) : isTabs || isAcc ? false : x.classList.contains('elementor-active')
        x.classList.toggle('elementor-active', on)
      })
      w.querySelectorAll('.elementor-tab-content').forEach((c) => {
        const on = w.querySelector(`.elementor-tab-title[data-tab="${c.dataset.tab}"].elementor-active`)
        c.classList.toggle('elementor-active', !!on)
        c.style.display = on ? 'block' : 'none'
        c.hidden = !on
      })
      return
    }
    // onglets du thème (ova_tabs)
    const ovaTab = t.closest('.tab-wrapper .tab a')
    if (ovaTab) {
      e.preventDefault()
      showOvaTab(ovaTab.closest('.tab-wrapper'), ovaTab.getAttribute('aria-controls'))
      return
    }
    // menu mobile et sous-menus
    const open = t.closest('.ova_openNav')
    if (open) {
      open.closest('.ova_wrap_nav')?.querySelector('.ova_nav')?.classList.add('show')
      open.closest('.ova_wrap_nav')?.querySelector('.ova_closeCanvas')?.classList.add('show')
      return
    }
    if (t.closest('.ova_closeNav')) {
      const wrap = t.closest('.ova_wrap_nav')
      wrap?.querySelectorAll('.show').forEach((x) => x.classList.remove('show'))
      return
    }
    const toggle = t.closest('.dropdown-toggle')
    if (toggle) {
      toggle.parentElement.classList.toggle('active_sub')
      return
    }
    // recherche en surimpression
    const sBtn = t.closest('.ova_search_popup_btn, .ova_wrap_search_popup > i, .ova_wrap_search_popup .icon_search')
    if (sBtn) {
      sBtn.closest('.ova_wrap_search_popup')?.classList.add('show')
      return
    }
    if (t.closest('.btn_close, .ova_search_close')) {
      t.closest('.ova_wrap_search_popup')?.classList.remove('show')
      return
    }
    // vidéo en lecture au clic
    const overlay = t.closest('.elementor-custom-embed-image-overlay, [data-elementor-open-lightbox] .elementor-custom-embed-play')
    if (overlay) {
      const w = overlay.closest('.elementor-widget-video')
      const s = w && JSON.parse(w.dataset.settings || '{}')
      const url = s.youtube_url || ''
      const id = (url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1]
      if (id) {
        e.preventDefault()
        showVideo(root, id)
      }
      return
    }
    const video = t.closest('a[href*="youtube.com"], a[href*="youtu.be"]')
    if (video && (video.closest('.ova-video, .video, [class*="video"]') || video.querySelector('i'))) {
      const id = (video.href.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1]
      if (id) {
        e.preventDefault()
        showVideo(root, id)
        return
      }
    }
    // liens internes : routeur
    const a = t.closest('a')
    const href = a?.getAttribute('href')
    if (href === '#' || href === '') {
      e.preventDefault()
      return
    }
    if (href && isInternal(href) && a.target !== '_blank') {
      e.preventDefault()
      navigate(href)
    }
  }
}

function showOvaTab(box, id) {
  box.querySelectorAll('.tab li').forEach((li) => {
    const on = li.querySelector('a')?.getAttribute('aria-controls') === id
    li.classList.toggle('active', on)
    li.querySelector('a')?.setAttribute('aria-selected', on)
  })
  box.querySelectorAll('.tab-item').forEach((it) => (it.style.display = it.id === id ? 'block' : 'none'))
}

function showVideo(root, id) {
  const box = document.createElement('div')
  box.className = 'egl-video'
  box.innerHTML = `<div><iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`
  box.addEventListener('click', () => box.remove())
  root.appendChild(box)
}

function onSubmit(navigate) {
  return (e) => {
    const f = e.target
    e.preventDefault()
    const q = f.querySelector('input[name="s"]')
    if (q) return navigate(`/?s=${encodeURIComponent(q.value)}`)
    let msg = f.querySelector('.egl-sent')
    if (!msg) {
      msg = document.createElement('p')
      msg.className = 'egl-sent'
      msg.style.cssText = 'margin-top:15px;color:#202b5d'
      f.appendChild(msg)
    }
    msg.textContent = 'Thank you for your message. It has been sent.'
    f.reset()
  }
}

// Compte à rebours (Coming soon)
function initCountdowns(root) {
  const els = [...root.querySelectorAll('.due_date[data-day]')]
  const tick = () =>
    els.forEach((el) => {
      const target = new Date(el.dataset.day.replace(' ', 'T')).getTime()
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000))
      const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60]
      el.innerHTML = ['Days', 'Hours', 'Minutes', 'Seconds']
        .map((l, k) => `<span class="countdown-section"><span class="countdown-amount">${parts[k]}</span><span class="countdown-period">${l}</span></span>`)
        .join('')
    })
  tick()
  const t = setInterval(tick, 1000)
  return () => clearInterval(t)
}

// En-tête collant des accueils
function initSticky(root) {
  const bar = root.querySelector('.ovamenu_shrink')
  if (!bar) return () => {}
  const spacer = document.createElement('div')
  const onScroll = () => {
    const on = window.scrollY > 300
    if (on && !bar.classList.contains('active_fixed')) {
      spacer.style.height = bar.offsetHeight + 'px'
      bar.after(spacer)
    }
    if (!on && bar.classList.contains('active_fixed')) spacer.remove()
    bar.classList.toggle('active_fixed', on)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    window.removeEventListener('scroll', onScroll)
    spacer.remove()
  }
}

// Grilles isotope : placement en maçonnerie (colonnes de la largeur de .grid-sizer), comme Isotope
function layoutMasonry(grid) {
  const W = grid.clientWidth
  if (!W) return
  const sizer = grid.querySelector('.grid-sizer')
  sizer.style.display = 'block'
  const colW = sizer.getBoundingClientRect().width || W / 5
  sizer.style.display = 'none'
  const n = Math.max(1, Math.round(W / colW))
  const heights = new Array(n).fill(0)
  grid.style.position = 'relative'
  for (const it of grid.querySelectorAll('.grid-item')) {
    if (it.style.display === 'none') continue
    it.style.position = 'absolute'
    const span = Math.min(n, Math.max(1, Math.round(it.getBoundingClientRect().width / colW)))
    let best = 0
    let bestY = Infinity
    for (let c = 0; c + span <= n; c++) {
      const y = Math.max(...heights.slice(c, c + span))
      if (y < bestY - 1) {
        bestY = y
        best = c
      }
    }
    it.style.left = `${best * colW}px`
    it.style.top = `${bestY}px`
    const h = it.getBoundingClientRect().height
    for (let c = best; c < best + span; c++) heights[c] = bestY + h
  }
  grid.style.height = `${Math.max(...heights)}px`
}

function initMasonry(root) {
  const grids = [...root.querySelectorAll('.ova_isotope.grid')]
  const run = () => grids.forEach(layoutMasonry)
  grids.forEach((g) => g.querySelectorAll('img').forEach((i) => i.complete || i.addEventListener('load', run)))
  run()
  window.addEventListener('resize', run)
  return () => window.removeEventListener('resize', run)
}

// Filtres de grille (boutons data-filter) : filtrage simple
function initIsotope(root) {
  root.querySelectorAll('[data-filter]').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault()
      const f = b.dataset.filter
      const box = b.closest('.elementor-widget')
      box.querySelectorAll('[data-filter]').forEach((x) => x.classList.toggle('active', x === b))
      box.querySelectorAll('.grid-item').forEach((it) => {
        it.style.display = f === '*' || it.matches(f) ? '' : 'none'
      })
    })
  })
}

// ---------------------------------------------------------------- Composant

export default function LegacyPage({ name }) {
  const [page, setPage] = useState(null)
  const host = useRef(null)
  const navigate = useNavigate()
  useLegacyFonts()
  useFonts(page?.fonts)

  useEffect(() => {
    let alive = true
    pages[`../../data/legacy/${name}.json`]().then((m) => alive && setPage(m.default || m))
    return () => {
      alive = false
    }
  }, [name])

  useLayoutEffect(() => {
    const el = host.current
    if (!page || !el) return
    const shadow = el.shadowRoot || el.attachShadow({ mode: 'open' })
    shadow.innerHTML = `<link rel="stylesheet" href="/legacy/legacy.css"><style>${swiperCss}${SHADOW_CSS}${page.css}</style>`
    const wrap = document.createElement('div')
    wrap.className = `egl ${page.bodyClass}`
    if (!page.chrome) wrap.style.paddingTop = '110px'
    wrap.innerHTML = page.html
    // la page reste masquée tant que la feuille d'origine n'est pas chargée
    wrap.style.visibility = 'hidden'
    shadow.querySelector('link').addEventListener('load', () => (wrap.style.visibility = ''))
    shadow.appendChild(wrap)
    const root = wrap
    root.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'))
    const offs = [
      ...[...root.querySelectorAll('.egl-slider')].map((s) => mount(s, <HeroSlider data={page.sliders[+s.dataset.slider]} />)),
      ...[...root.querySelectorAll('.root-data-givewp-embed')].map((s) => ((s.innerHTML = ''), mount(s, <DonationForm compact />, true))),
      initSwipers(root),
      initCounters(root),
      initCountdowns(root),
      initSticky(root),
      initMasonry(root),
    ]
    initIsotope(root)
    root.querySelectorAll('.tab-wrapper').forEach((b) => showOvaTab(b, b.querySelector('.tab a')?.getAttribute('aria-controls')))
    const click = onClick(root, navigate)
    const submit = onSubmit(navigate)
    root.addEventListener('click', click)
    root.addEventListener('submit', submit)
    return () => {
      offs.forEach((f) => f())
      root.removeEventListener('click', click)
      root.removeEventListener('submit', submit)
      shadow.innerHTML = ''
    }
  }, [page, navigate])

  return (
    <>
      <div ref={host} className="min-h-screen" />
      {page?.chrome && <BackToTop />}
    </>
  )
}
