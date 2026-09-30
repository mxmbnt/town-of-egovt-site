"""Convertit le HTML Elementor du site d'origine en blocs JSON simples,
rendus côté React par src/components/Blocks.jsx."""
import re
from bs4 import BeautifulSoup, NavigableString, Tag

ORIGIN = 'https://egovt.ovathemewp.com'
UNKNOWN = set()
STYLES = {}  # data-id -> {'root': {...}, 'title': {...}, 'container': {...}} pour la page en cours

KEEP_PROPS = {'color', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'font-style',
              'text-align', 'font-family', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
              'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'background-color',
              'width', 'max-width', 'border-style', 'border-width', 'border-color', 'border-radius'}


def _strip_media(css):
    """Ne garde que les styles bureau : blocs @media(min-width) dépliés, @media(max-width) retirés."""
    out, i = [], 0
    while True:
        j = css.find('@media', i)
        if j < 0:
            out.append(css[i:])
            break
        out.append(css[i:j])
        k = css.find('{', j)
        cond = css[j:k]
        depth, m = 1, k + 1
        while depth and m < len(css):
            depth += {'{': 1, '}': -1}.get(css[m], 0)
            m += 1
        if 'min-width' in cond and 'max-width' not in cond:
            out.append(css[k + 1:m - 1])
        i = m
    return ''.join(out)


def load_css(html):
    """Indexe les styles Elementor (par data-id) des balises <style> de la page."""
    STYLES.clear()
    for m in re.finditer(r'<style[^>]*id="elementor-(?:post-\d+|frontend-inline-css)"[^>]*>(.*?)</style>', html, re.S):
        css = _strip_media(m.group(1))
        for rule in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
            decls = {}
            for d in rule.group(2).split(';'):
                if ':' in d:
                    k, v = d.split(':', 1)
                    k, v = k.strip(), v.strip()
                    v = re.sub(r'var\(\s*--[\w-]+\s*,\s*([^)]+?)\s*\)', r'\1', v)  # var(--x, 50%) -> 50%
                    if k in KEEP_PROPS and 'var(' not in v:
                        decls[k] = v
            if not decls:
                continue
            for sel in rule.group(1).split(','):
                sm = re.search(r'\.elementor-element-([0-9a-f]{6,8})(.*)$', sel.strip())
                if not sm:
                    continue
                suffix = sm.group(2).strip()
                if suffix == '':
                    slot = 'root'
                elif re.fullmatch(r'>?\s*\.elementor-widget-container', suffix):
                    slot = 'container'
                elif re.fullmatch(r'\.elementor-(heading-title|text-editor)', suffix) or suffix in ('p', '.elementor-widget-container p'):
                    slot = 'title'
                elif re.fullmatch(r'>\s*\.elementor-(element-populated|widget-wrap)', suffix):
                    slot = 'populated'
                else:
                    continue
                STYLES.setdefault(sm.group(1), {}).setdefault(slot, {}).update(decls)


def camel(k):
    return re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)


def style_for(node):
    st = STYLES.get(node.get('data-id') or '', {})
    merged = {}
    for slot in ('root', 'title', 'container'):
        for k, v in st.get(slot, {}).items():
            if slot == 'root' and k.startswith(('margin', 'padding', 'background', 'border')):
                continue  # marges de l'élément racine gérées par le conteneur
            if k in ('width', 'max-width') and slot != 'root':
                continue
            merged[camel(k)] = v.replace('"', '').replace(', Sans-serif', ', sans-serif')
    return merged


def img(u):
    if not u:
        return u
    u = u.strip()
    u = re.sub(r'^(https?:)?//egovt\.ovathemewp\.com/wp-content/uploads/', '/wp/', u)
    return u


def href(u):
    if not u:
        return '#'
    u = u.strip()
    if '/wp-content/uploads/' in u:
        return img(u)
    if u.startswith(ORIGIN):
        return u[len(ORIGIN):] or '/'
    if u.startswith('/cdn-cgi/l/email-protection'):
        return 'mailto:demo@example.com'
    return u


def text(el):
    return ' '.join(el.get_text(' ', strip=True).split()) if el else ''


KEEP = {'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'blockquote', 'img', 'span', 'sup', 'sub', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'figure',
        'figcaption', 'hr', 'cite', 'code', 'pre', 'del', 'ins', 'mark', 'small', 'dl', 'dt', 'dd'}
KEEP_CLASS = {'ova-single-text': 'dropcap'}


def clean_html(node):
    """HTML nettoyé (balises et classes utiles seulement, liens et images réécrits)."""
    soup = BeautifulSoup(str(node), 'html.parser')
    for t in soup.find_all(['script', 'style', 'noscript', 'svg', 'iframe']):
        t.decompose()
    for t in soup.find_all(True):
        if t.name not in KEEP:
            t.unwrap()
            continue
        attrs = {}
        if t.name == 'a':
            attrs['href'] = href(t.get('href'))
            if t.get('target'):
                attrs['target'] = t['target']
        if t.name == 'img':
            attrs['src'] = img(t.get('data-src') or t.get('src'))
            attrs['alt'] = t.get('alt', '')
        if t.name == 'i' and t.get('class'):
            attrs['class'] = ' '.join(t['class'])
        cls = [KEEP_CLASS[c] for c in (t.get('class') or []) if c in KEEP_CLASS]
        if cls:
            attrs['class'] = ' '.join(cls)
        st = ';'.join(d.strip() for d in (t.get('style') or '').split(';')
                      if d.split(':')[0].strip() in ('color', 'font-size', 'font-weight', 'font-style', 'text-align',
                                                     'text-decoration', 'background-color'))
        if st:
            attrs['style'] = st
        t.attrs = attrs
    h = str(soup)
    h = re.sub(r'\s+', ' ', h).strip()
    h = h.replace('<span> ', ' <span>')
    h = re.sub(r'<span>([^<]*?)</span>', r'\1', h)
    return h


def col_width(col):
    w = STYLES.get(col.get('data-id') or '', {}).get('root', {}).get('width', '')
    if w.endswith('%'):
        return float(w[:-1])
    for c in col.get('class', []):
        m = re.match(r'elementor-col-(\d+)', c)
        if m:
            return int(m.group(1))
    return 100


def widget_block(w):
    b = _widget_block(w)
    if b is not None:
        st = style_for(w)
        if 'elementor-widget__width-auto' in w.get('class', []):
            st['width'] = 'auto'
        elif 'elementor-widget__width-initial' not in w.get('class', []):
            st.pop('width', None)
            st.pop('maxWidth', None)
        if st:
            b['s'] = st
    return b


def _widget_block(w):
    wt = (w.get('data-widget_type') or '').split('.')[0]
    c = w.select_one('.elementor-widget-container') or w
    cls = [x for x in w.get('class', []) if not x.startswith('elementor')]
    if wt == 'text-editor':
        h = clean_html(c)
        return {'t': 'html', 'html': h} if h else None
    if wt == 'heading':
        hd = c.find(re.compile(r'^(h[1-6]|p|div|span)$'))
        return {'t': 'heading', 'tag': hd.name if hd else 'h3', 'text': text(hd), **({'cls': cls} if cls else {})}
    if wt == 'image':
        i = c.find('img')
        a = c.find('a')
        cap = c.find('figcaption')
        b = {'t': 'image', 'src': img(i.get('data-src') or i.get('src')), 'alt': i.get('alt', '')}
        if a:
            b['href'] = href(a.get('href'))
        if cap:
            b['caption'] = text(cap)
        return b
    if wt == 'image-carousel':
        return {'t': 'carousel', 'images': [img(i.get('data-src') or i.get('src')) for i in c.select('img.swiper-slide-image')]}
    if wt == 'icon-list':
        items = []
        for li in c.select('li.elementor-icon-list-item'):
            ic = li.select_one('.elementor-icon-list-icon i')
            a = li.find('a')
            items.append({'icon': ' '.join(ic.get('class', [])) if ic else None,
                          'text': text(li.select_one('.elementor-icon-list-text')),
                          **({'href': href(a.get('href'))} if a else {})})
        return {'t': 'iconList', 'items': items}
    if wt == 'ova_time_countdown':
        d = c.select_one('.due_date')
        a = c.select_one('.ova-button a')
        return {'t': 'countdown', 'date': d.get('data-day') if d else None,
                'button': {'text': text(a), 'href': href(a.get('href'))} if a else None}
    if wt == 'ova_team_slider':
        items = []
        for it in c.select('.swiper-slide'):
            av = it.select_one('.avata')
            st = av.get('style', '') if av else ''
            m = re.search(r'url\(([^)]+)\)', st)
            items.append({'name': text(it.select_one('.name')), 'job': text(it.select_one('.job')),
                          'img': img(m.group(1).strip('\'"')) if m else None,
                          'href': href(av.get('href')) if av else '#'})
        return {'t': 'teamSlider', 'items': items}
    if wt == 'ova_feature':
        it = c.select_one('.items')
        ic = it.select_one('.icon span, .icon i')
        a = it.select_one('h3.title a')
        rm = it.select_one('.readmore')
        return {'t': 'feature', 'icon': ' '.join(ic.get('class', [])) if ic else None, 'title': text(it.select_one('h3.title')),
                'text': text(it.select_one('.excerpt')), 'href': href(a.get('href')) if a else '#',
                'more': text(rm) if rm else None, 'version': ' '.join(c.select_one('.ova_feature').get('class', [])[1:])}
    if wt == 'ova_list_checked':
        return {'t': 'checked', 'items': [text(li) for li in c.select('li')]}
    if wt in ('ova_dep_list_file', 'ova_sev_list_file'):
        root = c.find(class_=re.compile('list_file'))
        items = []
        for li in c.select('ul.ova-list-attachment > li'):
            a = li.select_one('a')
            items.append({'name': text(li.select_one('.ova-file-name')), 'type': text(li.select_one('.type')),
                          'size': text(li.select_one('.file-size')), 'href': href(a.get('href')) if a else '#'})
        return {'t': 'files', 'items': items, 'columns': 2 if root and 'two_column' in root.get('class', []) else 1}
    if wt == 'accordion':
        items = []
        for it in c.select('.elementor-accordion-item'):
            items.append({'title': text(it.select_one('.elementor-accordion-title')),
                          'html': clean_html(it.select_one('.elementor-tab-content').decode_contents())})
        return {'t': 'accordion', 'items': items}
    if wt == 'toggle':
        items = []
        for it in c.select('.elementor-toggle-item'):
            items.append({'title': text(it.select_one('.elementor-toggle-title')),
                          'html': clean_html(it.select_one('.elementor-tab-content').decode_contents())})
        return {'t': 'accordion', 'items': items, 'toggle': True}
    if wt == 'tabs':
        titles = [text(t) for t in c.select('.elementor-tab-desktop-title')]
        bodies = [clean_html(b.decode_contents()) for b in c.select('.elementor-tab-content')]
        return {'t': 'tabs', 'items': [{'title': t, 'html': b} for t, b in zip(titles, bodies)]}
    if wt == 'ova_dir_category':
        return {'t': 'dirCategories', 'title': text(c.select_one('.title')),
                'items': [{'label': text(a), 'href': href(a.get('href'))} for a in c.select('a.item-link')]}
    if wt == 'ova_education':
        return {'t': 'education', 'time': text(c.select_one('.time')), 'position': text(c.select_one('.position')),
                'college': text(c.select_one('.college'))}
    if wt == 'ova_skill_bar':
        return {'t': 'skills', 'items': [{'label': text(s.select_one('.text-skill-bar')), 'percent': s.get('data-percent')}
                                        for s in c.select('.skillbar')]}
    if wt == 'ova_form_mail':
        return {'t': 'formMail', 'button': (c.select_one('input[type=submit]') or {}).get('value', 'Send Message')}
    if wt == 'spacer':
        return None
    if wt == 'divider':
        return {'t': 'divider'}
    if wt == 'button':
        a = c.select_one('a')
        return {'t': 'button', 'text': text(a), 'href': href(a.get('href')) if a else '#'}
    if wt == 'video':
        return {'t': 'video'}
    UNKNOWN.add(wt)
    return {'t': 'unknown', 'widget': wt, 'html': clean_html(c)}


def children_blocks(wrap):
    """Blocs d'un .elementor-widget-wrap (widgets + sections internes)."""
    out = []
    for ch in wrap.find_all(True, recursive=False):
        classes = ch.get('class', [])
        if 'elementor-widget' in classes:
            b = widget_block(ch)
            if b:
                out.append(b)
        elif 'elementor-section' in classes:
            out.extend(section_blocks(ch))
    return out


def section_blocks(sec):
    cols = sec.select(':scope > .elementor-container > .elementor-column')
    res = []
    for col in cols:
        wrap = col.select_one(':scope > .elementor-widget-wrap')
        c = {'w': col_width(col), 'blocks': children_blocks(wrap) if wrap else []}
        st = {camel(k): v for k, v in STYLES.get(col.get('data-id') or '', {}).get('populated', {}).items()}
        if st.get('borderStyle') and 'borderColor' not in st and 'egovt-border-color' in col.get('class', []):
            st['borderColor'] = '#e02f12'
        if st:
            c['s'] = st
        res.append(c)
    if len(res) == 1:
        st = {camel(k): v for k, v in STYLES.get(sec.get('data-id') or '', {}).get('root', {}).items()
              if k.startswith(('margin', 'padding', 'border', 'background'))}
        st.update(res[0].get('s', {}))
        if st and 'elementor-inner-section' in sec.get('class', []):
            return [{'t': 'group', 'blocks': res[0]['blocks'], 's': st}]
        return res[0]['blocks']
    cls = [x for x in sec.get('class', []) if not x.startswith('elementor')]
    row = {'t': 'row', 'cols': res, **({'cls': cls} if cls else {}), 'id': sec.get('data-id')}
    st = {camel(k): v for k, v in STYLES.get(sec.get('data-id') or '', {}).get('root', {}).items()
          if k.startswith(('margin', 'padding', 'background'))}
    if st:
        row['s'] = st
    return [row]


def blocks_from(container):
    """Blocs d'un conteneur .elementor (ou de son parent)."""
    if container is None:
        return []
    root = container if 'elementor' in (container.get('class') or []) else container.select_one('.elementor')
    if root is None:
        h = clean_html(container)
        return [{'t': 'html', 'html': h}] if h else []
    out = []
    for sec in root.select(':scope > .elementor-section, :scope > .elementor-section-wrap > .elementor-section'):
        out.extend(section_blocks(sec))
    return out
