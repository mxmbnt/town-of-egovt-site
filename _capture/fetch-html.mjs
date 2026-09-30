// Télécharge le HTML de chaque URL du crawl dans _capture/html/<slug>.html
import fs from 'fs'
import path from 'path'
const dir = path.dirname(new URL(import.meta.url).pathname)
const list = JSON.parse(fs.readFileSync(path.join(dir, 'crawl.json'), 'utf8')).filter((x) => x.status === 200)
const slug = (u) => {
  const x = new URL(u)
  return (x.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'index') + (x.search ? '__' + x.search.slice(1).replace(/[^a-z0-9]+/gi, '-') : '')
}
const q = [...list]
async function w() {
  while (q.length) {
    const { url } = q.shift()
    const f = path.join(dir, 'html', slug(url) + '.html')
    if (fs.existsSync(f)) continue
    const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
    fs.writeFileSync(f, await r.text())
  }
}
await Promise.all(Array.from({ length: 6 }, w))
console.log(fs.readdirSync(path.join(dir, 'html')).length)
