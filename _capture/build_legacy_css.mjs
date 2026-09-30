// Réunit le CSS d'origine (thème + plugins + Elementor) et le cantonne à `.egl`,
// pour qu'il ne s'applique qu'aux pages reprises telles quelles (LegacyPage).
// Usage : node _capture/build_legacy_css.mjs
import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import prefixer from 'postcss-prefix-selector'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const ROOT = path.join(HERE, '..')
const SCOPE = '.egl'

const scope = postcss([
  prefixer({
    prefix: SCOPE,
    transform(prefix, selector, prefixed) {
      if (/^(html|body|:root)$/.test(selector)) return prefix
      if (/^(html|body)[\s.:[]/.test(selector)) return selector.replace(/^(html|body)/, prefix)
      if (selector.startsWith(prefix)) return selector
      return prefixed
    },
  }),
  // les feuilles d'impression sont inutiles ici
  {
    postcssPlugin: 'drop-print',
    AtRule: { media: (r) => r.params.trim() === 'print' && r.remove() },
  },
])

async function run(css, from) {
  try {
    return (await scope.process(css, { from })).css
  } catch (e) {
    console.warn('  CSS ignoré (erreur de syntaxe)', from, e.reason)
    return ''
  }
}

const dir = path.join(HERE, 'legacy-css')
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'))
let out = `/* CSS d'origine du thème EGovt, cantonné à ${SCOPE} (généré par _capture/build_legacy_css.mjs) */\n`
for (const f of manifest) out += `/* ${f} */\n` + (await run(fs.readFileSync(path.join(dir, f), 'utf8'), f)) + '\n'
fs.mkdirSync(path.join(ROOT, 'public', 'legacy'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'public', 'legacy', 'legacy.css'), out)

// Les @font-face déclarés dans un Shadow DOM sont ignorés : on les publie aussi au niveau du document
const faces = []
postcss.parse(out).walkAtRules('font-face', (r) => faces.push(r.toString()))
fs.writeFileSync(path.join(ROOT, 'public', 'legacy', 'fonts.css'), faces.join('\n'))
console.log('fonts.css', faces.length, '@font-face')
console.log('legacy.css', Math.round(out.length / 1024), 'Ko')

const pages = path.join(ROOT, 'src', 'data', 'legacy')
for (const f of fs.readdirSync(pages)) {
  const p = path.join(pages, f)
  const d = JSON.parse(fs.readFileSync(p, 'utf8'))
  if (d.cssScoped) continue
  d.css = await run(d.css, f)
  d.cssScoped = true
  fs.writeFileSync(p, JSON.stringify(d))
}
console.log('pages', fs.readdirSync(pages).length)
