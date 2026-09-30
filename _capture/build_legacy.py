"""Convertit les pages composées dans Elementor (about, contact, accueils…) en fragments HTML
réutilisables par src/pages/legacy/LegacyPage.jsx, avec leur CSS d'origine.

Sorties :
  src/data/legacy/<nom>.json   { html, css, fonts, sliders, chrome }
  _capture/legacy-css/*.css    feuilles du thème téléchargées (réunies par build_legacy_css.mjs)
Usage : python3 build_legacy.py
"""
import hashlib
import json
import os
import re
import urllib.request
from urllib.parse import urljoin

from bs4 import BeautifulSoup, Comment

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
OUT = os.path.join(ROOT, 'src', 'data', 'legacy')
CSS_DIR = os.path.join(HERE, 'legacy-css')
ASSETS = os.path.join(ROOT, 'public', 'legacy')
ORIGIN = 'https://egovt.ovathemewp.com'

# nom -> (fichier html, chemin du clone). chrome=True : en-tête/pied d'origine conservés (accueils, coming soon)
PAGES = {
    'about': ('about', '/about/'), 'history': ('history', '/history/'), 'faq': ('faq', '/faq/'),
    'municipal-faqs': ('municipal-faqs', '/municipal-faqs/'), 'page-service': ('page-service', '/page-service/'),
    'page-team': ('page-team', '/page-team/'), 'department': ('department', '/department/'),
    'directory-filter': ('directory-filter', '/directory-filter/'), 'donate': ('donate', '/donate/'),
    'become-a-volunteer': ('become-a-volunteer', '/become-a-volunteer/'), 'coming-soon': ('coming-soon', '/coming-soon/'),
    'contact-1': ('contact-1', '/contact-1/'), 'contact-2': ('contact-2', '/contact-2/'),
    'home-1': ('index', '/'), 'home-2': ('home-2', '/home-2/'), 'home-3': ('home-3', '/home-3/'),
    'home-4': ('home-4', '/home-4/'), 'home-5': ('home-5', '/home-5/'), 'home-7': ('home-7', '/home-7/'),
    'home-8': ('home-8', '/home-8/'), 'home-9': ('home-9', '/home-9/'),
}
DEFAULT_CHROME = ('131', '177')  # en-tête / pied de page reproduits en React


def fetch(url, dest):
    if os.path.exists(dest):
        return True
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=60).read()
        open(dest, 'wb').write(data)
        return True
    except Exception as e:  # noqa: BLE001
        print('  ! échec', url, e)
        return False


def local_url(u, base=ORIGIN + '/'):
    """URL d'origine (image, police…) -> chemin local, en téléchargeant si nécessaire."""
    u = u.strip().strip('\'"')
    if not u or u.startswith(('data:', '#', 'mailto:', 'tel:', 'javascript:')):
        return u
    full = urljoin(base, u.replace('\\/', '/'))
    if full.startswith('//'):
        full = 'https:' + full
    m = re.match(r'https?://(?:egovt\.ovathemewp\.com|demo\.ovatheme\.com/egovt)/wp-content/uploads/([^?#]+)', full)
    if m:
        dest = os.path.join(ROOT, 'public', 'wp', m.group(1))
        fetch(full.split('?')[0], dest)
        return '/wp/' + m.group(1)
    m = re.match(r'https?://egovt\.ovathemewp\.com/(wp-content|wp-includes)/([^?#]+)', full)
    if m:
        rel = m.group(2)
        dest = os.path.join(ASSETS, rel)
        if fetch(full.split('#')[0], dest):
            return '/legacy/' + rel + (('#' + full.split('#')[1]) if '#' in full else '')
    return full


def page_link(h):
    if not h:
        return h
    h = h.strip()
    for o in (ORIGIN, 'https://demo.ovatheme.com/egovt', 'http://egovt.ovathemewp.com'):
        if h.startswith(o):
            p = h[len(o):] or '/'
            if '/wp-content/uploads/' in p:
                return local_url(h)
            return p
    if h.startswith('/cdn-cgi/l/email-protection'):
        return 'mailto:demo@example.com'
    return h


def decode_cf(tag):
    enc = tag.get('data-cfemail')
    if not enc:
        return None
    k = int(enc[:2], 16)
    return ''.join(chr(int(enc[i:i + 2], 16) ^ k) for i in range(2, len(enc), 2))


def css_urls(css, base):
    def rep(m):
        raw = m.group(1).strip()
        if raw.strip('\'"').startswith('data:'):
            return m.group(0)  # URI data : laissée telle quelle (peut contenir des apostrophes)
        return f"url('{local_url(raw, base)}')"
    return re.sub(r'url\(\s*((?:"[^"]*"|\'[^\']*\'|[^)])+?)\s*\)', rep, css)


def slider_data(module, html):
    """Données d'un Slider Revolution 7 (images, calques texte/bouton) depuis SR7.JSON."""
    sid = module.get('id')
    m = re.search(r"SR7\.JSON\['" + re.escape(sid) + r"'\] = (\{.*?\});\s*\n", html, re.S)
    if not m:
        return None
    d = json.loads(m.group(1))
    if 'settings' not in d:
        return slider_data_v6(d, module)

    def pick(v, i=0):
        if isinstance(v, list):
            for x in (v[i], v[1] if len(v) > 1 else None, v[0]):
                if x not in (None, '#a', 'inherit'):
                    return x
            return None
        return v

    size = d['settings'].get('size', {})
    slides = []
    for s in d['slides'].values():
        slide = {'bg': None, 'layers': []}
        for l in s['layers'] if isinstance(s['layers'], list) else s['layers'].values():
            if l.get('subtype') == 'slidebg':
                src = (l.get('bg', {}).get('image') or {}).get('src')
                slide['bg'] = local_url(src) if src else None
                col = (l.get('bg', {}).get('color') or {}).get('string')
                if col:
                    slide['bgColor'] = col
                continue
            if l.get('type') not in ('text', 'image', 'shape'):
                continue
            pos, font = l.get('pos', {}), l.get('font', {})
            p = l.get('p', {})
            layer = {
                'type': 'button' if l.get('subtype') == 'button' else l.get('type'),
                'text': (l.get('content') or {}).get('text', ''),
                'src': local_url((l.get('content') or {}).get('src', '')) if l.get('type') == 'image' else None,
                'href': page_link(l.get('href')),
                'x': pick(pos.get('x')), 'y': pick(pos.get('y')), 'h': pick(pos.get('h')) or 'left',
                'v': pick(pos.get('v')) or 'top', 'align': (l.get('attr') or {}).get('aO', 'ml'),
                'w': pick((l.get('size') or {}).get('w')), 'hgt': pick((l.get('size') or {}).get('h')),
                'color': pick(l.get('color')), 'font': font.get('family'), 'size': pick(font.get('size')),
                'weight': pick(font.get('weight')), 'lh': pick(l.get('lh')), 'ls': pick(font.get('ls')),
                'tA': pick(l.get('tA')), 'bg': ((l.get('bg') or {}).get('color') or {}).get('string'),
                'pad': [pick(p.get(k)) for k in ('t', 'r', 'b', 'l')] if p else None,
                'hoverBg': (((l.get('hov') or {}).get('color') or {}).get('bg') or {}).get('string'),
                'radius': (l.get('radius') or {}).get('t'),
                'border': (l.get('border') or {}),
            }
            slide['layers'].append(layer)
        if slide['bg'] or slide['layers']:
            slides.append(slide)
    return {'width': pick(size.get('width')), 'height': pick(size.get('height')), 'slides': slides}


def slider_data_v6(d, module):
    """Ancien format (SR6 migré) : slider_params / slides[].layers{}."""
    def dv(o):
        if not isinstance(o, dict):
            return o
        for k in ('d', 'n', 't', 'm'):
            if isinstance(o.get(k), dict) and o[k].get('v') not in (None, ''):
                return o[k]['v']
        return o.get('v')

    size = d['slider_params'].get('size', {})
    hrefs = [[page_link(a.get('href')) for a in sl.select('a.sr7-layer')] for sl in module.select('sr7-slide')]
    slides = []
    for n, s in enumerate(d['slides']):
        bg = (s.get('params') or {}).get('bg') or {}
        slide = {'bg': local_url(bg['image']) if bg.get('image') else None, 'layers': []}
        if bg.get('color'):
            slide['bgColor'] = bg['color'] if isinstance(bg['color'], str) else None
        links = iter(hrefs[n] if n < len(hrefs) else [])
        for l in (s.get('layers') or {}).values():
            if l.get('type') not in ('text', 'button', 'image'):
                continue
            idle, pos, size_ = l.get('idle') or {}, l.get('position') or {}, l.get('size') or {}
            pad = dv(idle.get('padding'))
            layer = {
                'type': l['type'], 'text': l.get('text', ''),
                'src': local_url((l.get('media') or {}).get('imageUrl', '')) if l['type'] == 'image' else None,
                'href': next(links, None) if l['type'] == 'button' else None,
                'x': dv(pos.get('x')), 'y': dv(pos.get('y')), 'h': dv(pos.get('horizontal')) or 'left',
                'v': dv(pos.get('vertical')) or 'top', 'w': dv(size_.get('width')), 'hgt': dv(size_.get('height')),
                'color': dv(idle.get('color')), 'font': idle.get('fontFamily'), 'size': dv(idle.get('fontSize')),
                'weight': dv(idle.get('fontWeight')), 'lh': dv(idle.get('lineHeight')), 'ls': dv(idle.get('letterSpacing')),
                'tA': dv(idle.get('textAlign')), 'bg': dv(idle.get('backgroundColor')) if not isinstance(idle.get('backgroundColor'), dict) or 'd' in idle.get('backgroundColor', {}) else None,
                'pad': pad if isinstance(pad, list) else None,
                'hoverBg': ((l.get('hover') or {}).get('backgroundColor')), 'radius': None, 'border': {},
            }
            if isinstance(layer['bg'], dict):
                layer['bg'] = layer['bg'].get('orig') or layer['bg'].get('string')
            slide['layers'].append(layer)
        slides.append(slide)
    return {'width': size.get('width', {}).get('d') if isinstance(size.get('width'), dict) else size.get('width'),
            'height': size.get('height', {}).get('d') if isinstance(size.get('height'), dict) else size.get('height'),
            'slides': slides}


FEATHER = json.load(open(os.path.join(HERE, 'feather-icons.json')))


def clean(node, html, sliders):
    for c in node.find_all(string=lambda t: isinstance(t, Comment)):
        c.extract()
    # icônes Feather : équivalent de feather.replace() exécuté par le thème
    for i in node.select('i[data-feather]'):
        name = i['data-feather']
        if name in FEATHER:
            cls = ' '.join(['feather', f'feather-{name}'] + [c for c in i.get('class', [])])
            svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" '
                   f'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="{cls}">'
                   f'{FEATHER[name]}</svg>')
            i.replace_with(BeautifulSoup(svg, 'html.parser'))
    for mod in node.find_all('sr7-module'):
        data = slider_data(mod, html)
        ph = BeautifulSoup(f'<div class="egl-slider" data-slider="{len(sliders)}"></div>', 'html.parser').div
        sliders.append(data)
        (mod.find_parent('sr7-module-wrap') or mod).replace_with(ph)
    for t in node.find_all(['script', 'noscript', 'link', 'meta']):
        t.decompose()
    for t in node.find_all('style'):
        t.decompose()
    for t in node.find_all(True):
        for a in ('src', 'data-src', 'data-lazy-src', 'poster'):
            if t.get(a):
                t[a] = local_url(t[a])
        if t.get('data-src') and not t.get('src'):
            t['src'] = t['data-src']
        for a in ('srcset', 'data-srcset', 'sizes'):
            if a in t.attrs:
                del t[a]
        if t.get('href'):
            t['href'] = page_link(t['href'])
        if t.get('style'):
            t['style'] = css_urls(t['style'], ORIGIN + '/')
        for a in ('data-settings', 'data-background', 'data-bg'):
            if t.get(a) and 'http' in t[a]:
                t[a] = re.sub(r'https?:\\?/\\?/egovt\.ovathemewp\.com\\?/wp-content\\?/uploads\\?/([^"\\]+)',
                              lambda m: '/wp/' + m.group(1).replace('\\/', '/'), t[a])
        cls = t.get('class')
        if cls:
            t['class'] = [c for c in cls if c not in ('elementor-invisible',)] + (['e-lazyloaded'] if 'elementor-element' in cls else [])
        if t.name == 'span' and t.get('data-cfemail'):
            t.replace_with(decode_cf(t) or '')
    # adresses e-mail protégées : lien mailto réel
    for a in node.select('a[href^="mailto:demo"]'):
        txt = a.get_text(strip=True)
        if '@' in txt:
            a['href'] = 'mailto:' + txt
    return node


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(CSS_DIR, exist_ok=True)
    order = []  # feuilles de style partagées, dans l'ordre d'apparition
    inline_shared = {}
    for name, (f, path) in PAGES.items():
        html = open(os.path.join(HERE, 'html', f + '.html'), encoding='utf8').read()
        soup = BeautifulSoup(html, 'html.parser')
        # feuilles externes
        for l in soup.select('link[rel=stylesheet]'):
            h = l.get('href', '')
            if 'fonts.googleapis' in h or not h:
                continue
            full = urljoin(ORIGIN + '/', h)
            key = full.split('?')[0]
            if key not in order:
                order.append(key)
        fonts = sorted({urljoin('https:', l['href']) for l in soup.select('link[rel=stylesheet]') if 'fonts.googleapis' in l.get('href', '')})
        # styles internes : partagés (thème) ou propres à la page (elementor-post-<id>)
        page_css = []
        ids = [e['data-elementor-id'] for e in soup.select('[data-elementor-type="wp-post"], [data-elementor-type="wp-page"]')]
        header_id = ids[0] if ids else None
        footer_id = ids[-1] if ids else None
        chrome = (header_id, footer_id) != DEFAULT_CHROME or name == 'coming-soon'
        for st in soup.find_all('style'):
            sid = st.get('id', '')
            css = st.string or ''
            if not css.strip():
                continue
            m = re.match(r'elementor-post-(\d+)', sid)
            if sid == 'elementor-frontend-inline-css':
                if not chrome:  # retire les règles de l'en-tête / pied par défaut, rendus en React
                    css = re.sub(r'[^{}]*\.elementor-(131|177)\b[^{}]*\{[^{}]*\}', '', css)
                page_css.append(css_urls(css, ORIGIN + '/'))
            elif m:
                if not chrome and m.group(1) in DEFAULT_CHROME:
                    continue
                page_css.append(css_urls(css, ORIGIN + '/'))
            elif sid in ('egovt-style-inline-css', 'global-styles-inline-css',
                         'woocommerce-inline-inline-css', 'egovt-child-style-inline-css') or not sid:
                inline_shared.setdefault(sid or hashlib.md5(css.encode()).hexdigest()[:8], css_urls(css, ORIGIN + '/'))
        # contenu
        sliders = []
        if chrome:
            body = soup.body
            for sel in ('#wpadminbar', '.ova_search_popup', 'div.gdpr', '#give-donation-modal'):
                for t in body.select(sel):
                    t.decompose()
            content = clean(body, html, sliders)
            inner = ''.join(str(c) for c in content.contents)
        else:
            page = soup.select_one('[data-elementor-type="wp-page"]')
            content = clean(page, html, sliders)
            inner = str(content)
        inner = re.sub(r'\s{2,}', ' ', inner)
        cls = ' '.join(soup.body.get('class', []))
        json.dump({'path': path, 'chrome': chrome, 'bodyClass': cls, 'html': inner, 'css': '\n'.join(page_css),
                   'fonts': fonts, 'sliders': sliders},
                  open(os.path.join(OUT, name + '.json'), 'w'), ensure_ascii=False)
        print(f'{name:20s} chrome={chrome!s:5s} {len(inner) // 1024:4d} Ko html, {sum(map(len, page_css)) // 1024:3d} Ko css, {len(sliders)} slider(s)')

    # téléchargement des feuilles externes (URLs internes réécrites)
    manifest = []
    for i, url in enumerate(order):
        dest = os.path.join(CSS_DIR, f'{i:03d}-' + re.sub(r'[^a-z0-9.]+', '-', url.split('/wp-content/')[-1].lower())[-80:])
        raw = os.path.join(CSS_DIR, 'raw', os.path.basename(dest))
        if not fetch(url, raw):
            continue
        css = open(raw, encoding='utf8', errors='ignore').read()
        open(dest, 'w').write(css_urls(css, url))
        manifest.append(os.path.basename(dest))
    for k, css in inline_shared.items():
        dest = f'{len(manifest):03d}-inline-{k}.css'
        open(os.path.join(CSS_DIR, dest), 'w').write(css)
        manifest.append(dest)
    json.dump(manifest, open(os.path.join(CSS_DIR, 'manifest.json'), 'w'), indent=1)
    print(len(manifest), 'feuilles de style')


if __name__ == '__main__':
    main()
