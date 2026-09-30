import { useEffect, useState } from 'react'

// Remplace Slider Revolution : diapositives en fondu, calques positionnés comme dans l'éditeur
// d'origine (grille de `width` px centrée, décalages x/y par rapport à l'ancrage horizontal/vertical).

const px = (v) => (v == null || v === '' ? undefined : /^-?\d+(\.\d+)?$/.test(String(v)) ? `${v}px` : String(v))

function Layer({ l }) {
  const hAlign = l.h === 'center' ? 'center' : l.h === 'right' ? 'right' : 'left'
  const vAlign = l.v === 'middle' ? 'middle' : l.v === 'bottom' ? 'bottom' : 'top'
  const x = parseFloat(l.x) || 0
  const y = parseFloat(l.y) || 0
  const style = {
    position: 'absolute',
    color: l.color || '#fff',
    fontFamily: l.font ? `${l.font.replace(/'/g, '')}, sans-serif` : undefined,
    fontSize: px(l.size),
    fontWeight: l.weight,
    lineHeight: px(l.lh),
    letterSpacing: px(l.ls),
    textAlign: l.tA || hAlign,
    // retours à la ligne manuels : le texte ne se replie pas en plus
    width: l.w && l.w !== 'auto' && !/\n./.test(l.text || '') ? px(l.w) : undefined,
    whiteSpace: l.w && l.w !== 'auto' && !/\n./.test(l.text || '') ? 'normal' : 'nowrap',
    background: l.bg && l.bg !== 'transparent' ? l.bg : undefined,
    padding: l.pad ? l.pad.map((p) => px(p || 0)).join(' ') : undefined,
    borderRadius: l.radius,
  }
  if (hAlign === 'left') style.left = x
  else if (hAlign === 'right') style.right = x
  else {
    style.left = '50%'
    style.marginLeft = x
  }
  if (vAlign === 'top') style.top = y
  else if (vAlign === 'bottom') style.bottom = y
  else {
    style.top = '50%'
    style.marginTop = y
  }
  // ancrages « center » / « middle » : le calque est centré sur le point d'ancrage
  style.transform = `translate(${hAlign === 'center' ? '-50%' : '0'}, ${vAlign === 'middle' ? '-50%' : '0'})`
  const html = { __html: (l.text || '').replace(/\n/g, '<br/>') }

  if (l.type === 'image' && l.src) return <img src={l.src} alt="" style={style} />
  if (l.type === 'button') {
    return (
      // lien simple : le clic est intercepté par LegacyPage et confié au routeur
      <a href={l.href || '#'} className="egl-slider-btn" style={{ ...style, transition: 'background .3s', '--hover-bg': l.hoverBg || '#06163a' }}>
        <span dangerouslySetInnerHTML={html} />
      </a>
    )
  }
  return <div style={style} dangerouslySetInnerHTML={html} />
}

export default function HeroSlider({ data }) {
  const [i, setI] = useState(0)
  const n = data?.slides?.length || 0
  useEffect(() => {
    if (n < 2) return
    const t = setInterval(() => setI((v) => (v + 1) % n), 7000)
    return () => clearInterval(t)
  }, [n])
  if (!n) return null
  const h = parseInt(data.height, 10) || 810
  const w = parseInt(data.width, 10) || 1240
  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: `min(${h}px, 100vh)` }}>
      {data.slides.map((s, k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'opacity 1s',
            backgroundImage: s.bg ? `url('${s.bg}')` : undefined,
            backgroundColor: s.bgColor,
            opacity: k === i ? 1 : 0,
            zIndex: k === i ? 1 : 0,
          }}
        >
          <div style={{ position: 'relative', margin: '0 auto', height: '100%', maxWidth: '100%', width: w }}>
            {s.layers.map((l, j) => (
              <div key={j} style={{ transition: 'opacity .7s', transitionDelay: `${300 + j * 200}ms`, opacity: k === i ? 1 : 0 }}>
                <Layer l={l} />
              </div>
            ))}
          </div>
        </div>
      ))}
      {n > 1 && (
        <>
          {[-1, 1].map((d) => (
            <button
              key={d}
              onClick={() => setI((v) => (v + d + n) % n)}
              aria-label={d < 0 ? 'Diapositive précédente' : 'Diapositive suivante'}
              className="egl-slider-arrow"
              style={{ [d < 0 ? 'left' : 'right']: 20 }}
            >
              <i className={d < 0 ? 'arrow_carrot-left' : 'arrow_carrot-right'} />
            </button>
          ))}
        </>
      )}
    </div>
  )
}
