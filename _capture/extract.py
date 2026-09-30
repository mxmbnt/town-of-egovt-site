"""Extrait les données de toutes les pages capturées vers src/data/*.json.
Chaque type produit { singles: {chemin: fiche}, archives: {chemin: {cards, pagination}} }.
Usage : python3 extract.py [type ...]"""
import json
import os
import re
import sys
from urllib.parse import urlparse

from bs4 import BeautifulSoup

import elementor as el
from elementor import href, img, text

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'src', 'data')
crawl = json.load(open(os.path.join(HERE, 'crawl.json')))

EXTRA = {  # pages récupérées hors crawl (variantes à paramètres)
    '/blog/?layout_sidebar=layout_2r&blog_template=default': 'blog__default_2r',
    '/blog/?layout_sidebar=layout_2r&blog_template=grid_sidebar': 'blog__grid_sidebar',
    '/blog/?layout_sidebar=layout_1c&blog_template=grid_medium': 'blog__grid_medium',
    '/blog/?layout_sidebar=layout_1c&blog_template=grid_small': 'blog__grid_small',
    '/ova_por/museum-of-new-york/?single_type_portfolio=type1': 'ova_por__museum-of-new-york__type1',
    '/ova_por/museum-of-new-york/?single_type_portfolio=type2': 'ova_por__museum-of-new-york__type2',
    '/?s=city': 'search__city',
}


def slug_file(u):
    x = urlparse(u)
    s = x.path.strip('/').replace('/', '__') or 'index'
    if x.query:
        s += '__' + re.sub(r'[^a-z0-9]+', '-', x.query, flags=re.I)
    return s


def pages():
    """(chemin, classes du body, soup du <main>) pour chaque page."""
    seen = set()
    items = [(el.href(c['url']), c['body'], slug_file(c['url'])) for c in crawl if c['status'] == 200]
    for p, f in EXTRA.items():
        items.append((p, None, f))
    for path, body, f in items:
        if path in seen:
            continue
        seen.add(path)
        s = open(os.path.join(HERE, 'html', f + '.html'), encoding='utf8').read()
        el.load_css(s)
        if body is None:
            m = re.search(r'<body[^>]*class="([^"]*)"', s)
            body = m.group(1) if m else ''
        i = s.find('<main')
        j = s.find('data-elementor-id="177"')
        j = s.rfind('<', 0, j) if j > 0 else len(s)
        yield path, body, BeautifulSoup(s[i:j], 'html.parser')


def cf_email(a):
    """Décode les adresses protégées par Cloudflare (/cdn-cgi/l/email-protection#hex)."""
    if a is None:
        return None
    h = a.get('href', '')
    m = re.search(r'email-protection#([0-9a-f]+)', h)
    if not m:
        sp = a.select_one('[data-cfemail]')
        if not sp:
            return text(a) or None
        m = re.match(r'([0-9a-f]+)', sp['data-cfemail'])
    enc = m.group(1)
    k = int(enc[:2], 16)
    return ''.join(chr(int(enc[i:i + 2], 16) ^ k) for i in range(2, len(enc), 2))


def links(nodes):
    return [{'label': text(a), 'href': href(a.get('href'))} for a in nodes]


def pagination(main):
    nav = main.select_one('.pagination, .blog_pagination, .woocommerce-pagination, .ova_pagination, nav.navigation')
    if not nav:
        return None
    items = []
    for li in nav.select('li') or nav.find_all(['a', 'span'], recursive=False):
        a = li if li.name == 'a' else li.find('a')
        label = text(li)
        cls = ' '.join(li.get('class', []))
        kind = 'next' if ('next' in cls or 'arrow_carrot-right' in str(li)) else 'prev' if ('prev' in cls or 'arrow_carrot-left' in str(li)) else 'page'
        if kind != 'page':
            label = ''
        items.append({'label': label, 'href': href(a.get('href')) if a else None, 'kind': kind,
                      'current': a is None and kind == 'page'})
    return items or None


def share_present(main):
    return bool(main.select_one('.share-social-icons'))


def comment_form(main):
    return bool(main.select_one('.comment-respond'))


def save(name, data):
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, name + '.json')
    json.dump(data, open(p, 'w'), ensure_ascii=False, separators=(',', ':'))
    print(f'{name}.json  {os.path.getsize(p) // 1024} Ko', {k: len(v) for k, v in data.items() if isinstance(v, dict)})


# ---------------------------------------------------------------- Articles

def post_meta(scope):
    cats = scope.select('.wp-categories .categories a')
    d = scope.select_one('.post-date .right')
    au = scope.select_one('.post-author a')
    return {'date': text(d) or None, 'categories': links(cats), 'author': text(au) or None}


def post_card(art):
    a = art.select_one('.post-title a')
    im = art.select_one('.post-media img')
    ex = art.select_one('.post-excerpt')
    card = {'title': text(a), 'href': href(a.get('href')), 'image': img(im.get('src')) if im else None,
            **post_meta(art)}
    if ex:
        card['excerpt'] = el.clean_html(ex.decode_contents())
    q = art.select_one('blockquote, .post-quote')
    if q:
        card['quote'] = text(q)
    return card


def sidebar_blog(main):
    sb = main.select_one('aside.sidebar')
    return bool(sb)


def extract_posts():
    singles, archives, sidebar = {}, {}, None
    for path, body, main in pages():
        if sidebar is None and main.select_one('aside.sidebar .widget_categories') and 'single-post' in body:
            sidebar = sidebar_widgets(main.select_one('aside.sidebar'))
        if 'single-post' in body:
            art = main.select_one('article.post-wrap')
            im = art.select_one('.post-media img')
            tags = art.select('.post-tags a[href*="/tag/"]')
            nav = main.select_one('.ova-next-pre-post, .post-navigation, .nav-links')
            prev = nxt = None
            if nav:
                p = nav.select_one('a.pre, .nav-previous a')
                n = nav.select_one('a.next, .nav-next a')
                prev = {'title': text(p.select_one('.title') or p), 'href': href(p.get('href'))} if p else None
                nxt = {'title': text(n.select_one('.title') or n), 'href': href(n.get('href'))} if n else None
            body_node = art.select_one('.post-body .post-excerpt .elementor') or art.select_one('.post-body')
            related = [post_card(a) for a in main.select('.related-post article, .related_posts article')]
            singles[path] = {
                'title': text(art.select_one('h1.post-title')), 'image': img(im.get('src')) if im else None,
                **post_meta(art), 'tags': links(tags), 'blocks': el.blocks_from(body_node),
                'prev': prev, 'next': nxt, 'related': related,
                'layout': 'sidebar' if main.select_one('aside.sidebar') else 'full',
            }
        elif re.search(r'\b(blog|category|tag|author|search)\b', body) and main.select_one('article.post-wrap, .blog-grid, .no-results'):
            wrap = main.select_one('.wrap_site')
            grid = main.select_one('.blog-grid, .default')
            tpl = next((c for c in (grid.get('class', []) if grid else []) if c.startswith('grid_') or c == 'default'), 'default')
            archives[path] = {
                'layout': 'layout_2r' if wrap and 'layout_2r' in wrap.get('class', []) else 'layout_1c',
                'template': tpl,
                'cards': [post_card(a) for a in main.select('article.post-wrap')],
                'pagination': pagination(main),
                'empty': text(main.select_one('.no-results, .page-content')) if not main.select_one('article.post-wrap') else None,
            }
    save('posts', {'singles': singles, 'archives': archives, 'sidebar': sidebar})



# ---------------------------------------------------------------- Widgets de barre latérale

def price(node):
    """Prix WooCommerce : {'price': '£10.99', 'regular': '£14.99'} (regular si promo)."""
    if node is None:
        return {}
    ins, dl = node.select_one('ins'), node.select_one('del')
    if ins and dl:
        return {'price': text(ins.select_one('.amount')), 'regular': text(dl.select_one('.amount'))}
    amts = node.select('.amount')
    if len(amts) == 2:
        return {'price': text(amts[0]) + ' – ' + text(amts[1])}
    return {'price': text(amts[0])} if amts else {}


def event_card(it):
    d = it.select_one('.date-event')
    day = d.select_one('.date') or d.select_one('.date-month') if d else None
    day_txt = text(day).split(' ')[0] if day else ''
    im = it.select_one('.event-thumbnail img')
    a = it.select_one('.event_title a')
    times = [text(x) for x in it.select('.time-date-child span')]
    cat = it.select_one('.post_cat a')
    return {
        'day': day_txt, 'month': text(d.select_one('.month')) if d else '',
        'weekday': text(d.select_one('.weekday')) if d else '', 'year': text(d.select_one('.year')) if d else '',
        'image': img(im.get('src')) if im else None, 'category': links([cat])[0] if cat else None,
        'title': text(a), 'href': href(a.get('href')) if a else '#', 'time': times,
        'venue': text(it.select_one('.venue .number')),
    }


def sidebar_widgets(aside):
    if aside is None:
        return None
    out = []
    for w in aside.select(':scope > .widget, :scope > div > .widget'):
        cls = w.get('class', [])
        title = text(w.select_one('.widget-title'))
        if w.select_one('.ova_search, .search-form, .woocommerce-product-search'):
            out.append({'t': 'search', 'placeholder': (w.select_one('input[type=search]') or {}).get('placeholder', 'Search Here ...')})
        elif 'widget_feature_event' in cls:
            out.append({'t': 'featureEvents', 'title': title, 'items': [event_card(x) for x in w.select('.content-grid')]})
        elif 'widget_list_event' in cls:
            items = []
            for x in w.select('.item-event'):
                a = x.select_one('.title a')
                th = x.select_one('.ova-thumb-nail a')
                m = re.search(r'url\(([^)]+)\)', th.get('style', '')) if th else None
                items.append({'title': text(a), 'href': href(a.get('href')), 'image': img(m.group(1).strip('\'"')) if m else None,
                              'date': text(x.select_one('.date')), 'time': text(x.select_one('.bellow'))})
            btn = w.select_one('.button-all-event a')
            out.append({'t': 'listEvents', 'title': title, 'items': items,
                        'button': {'text': text(btn), 'href': href(btn.get('href'))} if btn else None})
        elif 'recent-posts-widget-with-thumbnails' in cls:
            items = []
            for li in w.select('li'):
                a = li.select_one('a')
                im = li.select_one('img')
                items.append({'title': text(li.select_one('.rpwwt-post-title')), 'href': href(a.get('href')),
                              'image': img(im.get('src')) if im else None, 'date': text(li.select_one('.rpwwt-post-date'))})
            out.append({'t': 'recentPosts', 'title': title, 'items': items})
        elif 'widget_media_gallery' in cls:
            out.append({'t': 'gallery', 'title': title, 'images': [img(i.get('src')) for i in w.select('img')]})
        elif 'widget_tag_cloud' in cls or 'widget_product_tag_cloud' in cls:
            out.append({'t': 'tags', 'title': title, 'items': links(w.select('.tagcloud a'))})
        elif 'widget_products' in cls or 'widget_top_rated_products' in cls or 'widget_recent_products' in cls:
            items = []
            for li in w.select('li'):
                a = li.select_one('a')
                im = li.select_one('img')
                items.append({'title': text(li.select_one('.product-title')), 'href': href(a.get('href')),
                              'image': img(im.get('src')) if im else None, **price(li)})
            out.append({'t': 'products', 'title': title, 'items': items})
        elif 'widget_media_image' in cls:
            im = w.select_one('img')
            a = w.select_one('a')
            out.append({'t': 'image', 'src': img(im.get('src')), 'href': href(a.get('href')) if a else '#'})
        elif w.select_one('ul li a') and title:
            out.append({'t': 'links', 'title': title, 'items': [{**links([li.select_one('a')])[0],
                                                                 'current': 'current-cat' in li.get('class', [])}
                                                                for li in w.select('li') if li.select_one('a')]})
        else:
            out.append({'t': 'html', 'title': title, 'html': el.clean_html(w)})
    return out


# ---------------------------------------------------------------- Événements

def extract_events():
    singles, archives, sidebar = {}, {}, None
    for path, body, main in pages():
        if 'single-event' in body:
            intro = main.select_one('.event_intro')
            im = intro.select_one('.image img')
            date = [text(x) for x in intro.select('.wrap-date .general-content')]
            tm = [text(x) for x in intro.select('.wrap-time .general-content')]
            contact = []
            for li in main.select('.info-contact li'):
                a = li.select_one('a')
                if a and 'email-protection' in a.get('href', ''):
                    v = cf_email(a)
                    contact.append({'label': text(li.select_one('span')), 'value': v, 'href': 'mailto:' + v})
                else:
                    contact.append({'label': text(li.select_one('span')), 'value': text(li.select_one('.info')),
                                    'href': href(a.get('href')) if a else None})
            nav = main.select_one('.ova-next-pre-post')
            pv, nx = (nav.select_one('a.pre'), nav.select_one('a.next')) if nav else (None, None)
            singles[path] = {
                'title': text(intro.select_one('h1.title')), 'image': img(im.get('src')) if im else None,
                'date': ' '.join(date), 'time': ' '.join(tm), 'location': text(intro.select_one('.wrap-loc .general-content')),
                'categories': links(intro.select('.cat-ovaev a')), 'blocks': el.blocks_from(intro.select_one('.content .elementor')),
                'contact': contact, 'gallery': [img(i.get('src')) for i in main.select('.gallery-items img')],
                'mapAddress': (main.select_one('#location .ovaev_map, .tab-pane .map, [data-address]') or {}).get('data-address') if main.select_one('[data-address]') else None,
                'tags': links(main.select('.event-tags a')),
                'related': [event_card(x) for x in main.select('.event-related .ovaev-content')],
                'prev': {'title': text(pv.select_one('.title')), 'href': href(pv.get('href'))} if pv else None,
                'next': {'title': text(nx.select_one('.title')), 'href': href(nx.get('href'))} if nx else None,
            }
            if sidebar is None:
                sidebar = sidebar_widgets(main.select_one('.sidebar-event'))
        elif re.search(r'post-type-archive-event|tax-event_type|tax-event_tag', body):
            arch = main.select_one('.archive_event')
            cols = next((c for c in arch.get('class', []) if c.endswith('-columns')), None) if arch else None
            grid = bool(main.select_one('.content-grid'))
            archives[path] = {
                'variant': 'grid' if grid else 'list', 'columns': cols,
                'sidebar': bool(main.select_one('.sidebar-event, .col-lg-4 .sidebar')),
                'cards': [event_card(x) for x in main.select('.archive_event .ovaev-content')],
                'pagination': pagination(main),
            }
    save('events', {'singles': singles, 'archives': archives, 'sidebar': sidebar})


# ---------------------------------------------------------------- Départements

def dep_sidebar(main):
    sb = main.select_one('.ova-dep-sidebar')
    if not sb:
        return None
    f = sb.select_one('.dep-file-sidebar')
    im = sb.select_one('.ova-media img')
    return {'files': [{'name': text(x.select_one('.ova-file-name')), 'type': text(x.select_one('.type')),
                       'size': text(x.select_one('.file-size')), 'href': href(x.select_one('a').get('href'))}
                      for x in sb.select('.dep-file-sidebar')],
            'image': img(im.get('src')) if im else None}


def extract_departments():
    singles, archives = {}, {}
    for path, body, main in pages():
        if 'single-ova_dep' in body:
            items = [{'label': text(li.select_one('a')), 'href': href(li.select_one('a').get('href')),
                      'active': 'active' in li.get('class', [])} for li in main.select('.ova-list-dep ul li')]
            singles[path] = {'list': items, 'sidebar': dep_sidebar(main),
                             'blocks': el.blocks_from(main.select_one('.ova_dep_content .elementor'))}
        elif re.search(r'post-type-archive-ova_dep|tax-cat_dep', body):
            cards = []
            for it in main.select('.archive_dep .wp-item'):
                a = it.select_one('h2.title a')
                im = it.select_one('.ova-media img')
                ic = it.select_one('.icon i')
                cards.append({'title': text(a), 'href': href(a.get('href')), 'image': img(im.get('src')) if im else None,
                              'icon': ' '.join(ic.get('class', [])) if ic else None, 'text': text(it.select_one('.descption')),
                              'more': text(it.select_one('.readmore'))})
            wrap = main.select_one('.archive_dep')
            archives[path] = {'columns': next((c for c in wrap.get('class', []) if c.endswith('_column')), None),
                              'cards': cards, 'pagination': pagination(main)}
    save('departments', {'singles': singles, 'archives': archives})


# ---------------------------------------------------------------- Services

def extract_services():
    singles, archives = {}, {}
    for path, body, main in pages():
        if 'single-ova_sev' in body:
            items = [{'label': text(li.select_one('a')), 'href': href(li.select_one('a').get('href')),
                      'active': 'active' in li.get('class', [])} for li in main.select('.ova-list-sev ul li')]
            sb = main.select_one('.ova-sev-sidebar')
            im = sb.select_one('.ova-media img') if sb else None
            singles[path] = {'list': items,
                             'files': [{'name': text(x.select_one('.ova-file-name')), 'type': text(x.select_one('.type')),
                                        'size': text(x.select_one('.file-size')), 'icon': ' '.join((x.select_one('i') or {}).get('class', [])),
                                        'href': href(x.select_one('a').get('href'))} for x in main.select('.sev-file-sidebar')],
                             'sideImage': img(im.get('src')) if im else None,
                             'blocks': el.blocks_from(main.select_one('.ova_sev_content .elementor'))}
        elif 'post-type-archive-ova_sev' in body:
            cards = []
            for it in main.select('.archive_sev .wp-items'):
                a = it.select_one('h3.title a')
                ic = it.select_one('.icon span')
                cards.append({'title': text(a), 'href': href(a.get('href')), 'icon': ' '.join(ic.get('class', [])) if ic else None,
                              'text': text(it.select_one('.excerpt')), 'more': text(it.select_one('.readmore'))})
            archives[path] = {'cards': cards, 'pagination': pagination(main)}
    save('services', {'singles': singles, 'archives': archives})


# ---------------------------------------------------------------- Documents

def doc_sidebar(main):
    items = [{'label': text(li.select_one('a')), 'href': href(li.select_one('a').get('href')),
              'active': 'active' in li.get('class', [])} for li in main.select('.ova-list-cat ul li')]
    im = main.select_one('.ova-doc-sidebar .ova-media img')
    return {'title': text(main.select_one('.title-list-cat')), 'items': items, 'image': img(im.get('src')) if im else None}


def attachments(scope):
    return [{'name': text(li.select_one('.ova-file-name')), 'type': text(li.select_one('.type')),
             'size': text(li.select_one('.file-size')), 'icon': ' '.join((li.select_one('.icon-attachment i') or {}).get('class', [])),
             'href': href((li.select_one('.ova-download a') or li.select_one('a') or {}).get('href'))}
            for li in scope.select('ul.ova-list-attachment > li')] if scope else []


def extract_docs():
    singles, archives = {}, {}
    for path, body, main in pages():
        if 'single-ova_doc' in body:
            c = main.select_one('.ova_doc_content')
            singles[path] = {'sidebar': doc_sidebar(main), 'date': text(c.select_one('.doc-meta-general')),
                             'categories': links(c.select('.cat-doc a')),
                             'blocks': el.blocks_from(c.select_one('.elementor')),
                             'files': attachments(c.find('ul', class_='ova-list-attachment', recursive=False) and c)}
        elif re.search(r'post-type-archive-ova_doc|tax-cat_doc', body):
            cards = []
            for it in main.select('.items-doc'):
                a = it.select_one('.doc-title a')
                ic = it.select_one('.icon-doc i')
                rm = it.select_one('.doc-readmore a')
                cards.append({'title': text(a), 'href': href(a.get('href')), 'icon': ' '.join(ic.get('class', [])) if ic else None,
                              'date': text(it.select_one('.doc-meta-general')), 'categories': links(it.select('.cat-doc a')),
                              'more': text(rm)})
            archives[path] = {'sidebar': doc_sidebar(main), 'cards': cards, 'pagination': pagination(main)}
    save('docs', {'singles': singles, 'archives': archives})


# ---------------------------------------------------------------- Annuaire

def extract_directory():
    singles, archives, sidebar = {}, {}, None
    for path, body, main in pages():
        if 'single-ova_dir' in body:
            c = main.select_one('.ova_dir_content')
            th = c.select_one('.thumbnail img')
            contact = []
            for li in c.select('.contact-list li'):
                ic = li.select_one('i')
                a = li.select_one('a')
                val = cf_email(a) if a and 'email-protection' in a.get('href', '') else text(li)
                contact.append({'icon': ' '.join(ic.get('class', [])) if ic else None, 'text': val,
                                'href': ('mailto:' + val) if a and 'email-protection' in a.get('href', '') else (href(a.get('href')) if a else None)})
            singles[path] = {
                'image': img(th.get('src')) if th else None,
                'content': el.clean_html(c.select_one('.content').decode_contents()) if c.select_one('.content') else '',
                'contactTitle': text(c.select_one('.contact-box .title')), 'contact': contact,
                'hoursTitle': text(c.select_one('.opening_hours .title')),
                'hours': [[text(tr.select_one('.day')), text(tr.select_one('.time'))] for tr in c.select('.opening_hours tr')],
                'galleryTitle': text(c.select_one('.gallery .title')),
                'gallery': [img(i.get('src')) for i in c.select('.gallery-inner img')],
                'categories': links(c.select('.metabox li:nth-of-type(1) a')), 'tags': links(c.select('.metabox li:nth-of-type(2) a')),
                'map': bool(c.select_one('.map, #ova_dir_map, .dir-map')),
            }
            if sidebar is None:
                sidebar = el.blocks_from(main.select_one('.ova-dir-sidebar .elementor'))
        elif re.search(r'post-type-archive-ova_dir|tax-cat_dir|tax-tag_dir', body):
            cards = []
            for it in main.select('.ova-dir-items .item'):
                a = it.select_one('h2.title a')
                im = it.select_one('.thumbnail img')
                info = []
                for li in it.select('ul.info li'):
                    ic = li.select_one('i')
                    info.append({'icon': ' '.join(ic.get('class', [])) if ic else None, 'text': text(li.select_one('.text')),
                                 'links': links(li.select('.text a'))})
                cards.append({'title': text(a), 'href': href(a.get('href')), 'image': img(im.get('src')) if im else None, 'info': info})
            wrap = main.select_one('.ova-dir-archive')
            archives[path] = {'columns': next((c for c in (wrap.get('class', []) if wrap else []) if c.endswith('_column')), None),
                              'cards': cards, 'pagination': pagination(main),
                              'sidebar': el.blocks_from(main.select_one('.ova-dir-sidebar .elementor'))}
    save('directory', {'singles': singles, 'archives': archives, 'sidebar': sidebar})


# ---------------------------------------------------------------- Portfolio

def por_card(it):
    a = it.select_one('h2.title a')
    im = it.select_one('img')
    return {'title': text(a), 'href': href(a.get('href')) if a else '#', 'image': img(im.get('src')) if im else None,
            'count': text(it.select_one('.number-gallery span')), 'categories': links(it.select('.cat-por a')),
            'filter': [c for c in it.get('class', []) if c != 'ovapor-item']}


def extract_portfolio():
    singles, archives = {}, {}
    for path, body, main in pages():
        if 'single-ova_por' in body:
            sp = main.select_one('.single-por')
            info = []
            for d in main.select('.info-por .category, .info-por .date, .info-por .location, .info-por .department'):
                lab = d.select_one('label')
                a = d.select('a')
                val = ' , '.join(text(x) for x in a) if a else text(d.select_one('span'))
                info.append({'label': text(lab), 'value': val, 'links': links(a) if a else None})
            nav = main.select_one('.ova-next-pre-post')
            pv, nx = (nav.select_one('a.pre'), nav.select_one('a.next')) if nav else (None, None)
            rel = [por_card(it) for it in main.select('.related-por .ovapor-item')]
            singles[path] = {
                'type': next((c for c in sp.get('class', []) if c.startswith('type')), 'type3'),
                'title': text(main.select_one('h1, h2.title-por, .title-por')),
                'gallery': [img(i.get('src')) for i in main.select('.por-gallery img')],
                'blocks': el.blocks_from(main.select_one('.content-info .elementor, .wrap-content-por .elementor')),
                'info': info,
                'prev': {'title': text(pv.select_one('.title')), 'href': href(pv.get('href'))} if pv else None,
                'next': {'title': text(nx.select_one('.title')), 'href': href(nx.get('href'))} if nx else None,
                'related': rel,
            }
        elif re.search(r'post-type-archive-ova_por|tax-cat_por', body):
            cards = [por_card(it) for it in main.select('.content-por .ovapor-item')]
            filters = [{'label': text(li.select_one('a')), 'href': href(li.select_one('a').get('href')),
                        'filter': li.select_one('a').get('data-filter') or (li.get('data-filter')),
                        'active': 'active' in li.get('class', [])} for li in main.select('ul.list-cat-por li')]
            wrap = main.select_one('.content-por')
            archives[path] = {'wrap': ' '.join(c for c in wrap.get('class', []) if c != 'content-por') if wrap else None,
                              'filters': filters, 'cards': cards, 'pagination': pagination(main)}
    save('portfolio', {'singles': singles, 'archives': archives})


# ---------------------------------------------------------------- Équipe

def extract_team():
    singles, archives = {}, {}
    for path, body, main in pages():
        if 'single-team' in body:
            t = main.select_one('.ova_team_single')
            im = t.select_one('.image-team img')
            fields = []
            for k in ('expertise', 'experience', 'email', 'phone'):
                d = t.select_one('.ova-' + k)
                if d:
                    a = d.select_one('a')
                    v = cf_email(a) if k == 'email' else text(d.select_one('span') or a)
                    fields.append({'label': text(d.select_one('label')), 'value': v,
                                   'href': ('mailto:' + v) if k == 'email' else (href(a.get('href')) if a else None)})
            sig = t.select_one('.ova-excerpt-team img')
            ic = t.select_one('.icon_bg i')
            singles[path] = {
                'name': text(t.select_one('.name')), 'job': text(t.select_one('.job')), 'image': img(im.get('src')) if im else None,
                'fields': fields, 'socials': [' '.join(i.get('class', [])) for i in t.select('.ova-social i')],
                'excerpts': [text(x) for x in t.select('.ova-excerpt-team > div')],
                'signature': img(sig.get('src')) if sig else None, 'icon': ' '.join(ic.get('class', [])) if ic else None,
                'blocks': el.blocks_from(t.select_one('.ova_team_content .elementor')),
            }
        elif re.search(r'post-type-archive-team|tax-cat_team', body):
            cards = []
            for it in main.select('.archive_team .content_info'):
                a = it.select_one('a.name')
                im = it.select_one('.ova-media img')
                em = it.select_one('.ova-email a')
                ph = it.select_one('.ova-phone a')
                cards.append({'name': text(a), 'href': href(a.get('href')), 'image': img(im.get('src')) if im else None,
                              'job': text(it.select_one('.job')), 'email': cf_email(em), 'phone': text(ph),
                              'socials': [' '.join(i.get('class', [])) for i in it.select('.ova-social i')]})
            wrap = main.select_one('.archive_team')
            archives[path] = {'columns': next((c for c in wrap.get('class', []) if c.endswith('_column')), None),
                              'cards': cards, 'pagination': pagination(main)}
    save('team', {'singles': singles, 'archives': archives})


# ---------------------------------------------------------------- Boutique

def product_card(li):
    a = li.select_one('a.woocommerce-LoopProduct-link')
    im = li.select_one('img')
    btn = li.select_one('a.button')
    return {'title': text(li.select_one('.woocommerce-loop-product__title')), 'href': href(a.get('href')) if a else '#',
            'image': img(im.get('src')) if im else None, 'sale': bool(li.select_one('.onsale')),
            'rating': (li.select_one('.star-rating') or {}).get('aria-label') if li.select_one('.star-rating') else None,
            'button': text(btn), **price(li.select_one('.price'))}


def extract_shop():
    singles, archives, sidebar = {}, {}, None
    for path, body, main in pages():
        if 'single-product' in body:
            p = main.select_one('div.product')
            s = p.select_one('.summary')
            cats = s.select('.posted_in a')
            tags = s.select('.tagged_as a')
            singles[path] = {
                'title': text(s.select_one('.product_title')), **price(s.select_one('.price')),
                'sale': bool(p.select_one('.onsale')),
                'images': [img(a.get('href')) for a in p.select('.woocommerce-product-gallery__image a')],
                'short': el.clean_html(s.select_one('.woocommerce-product-details__short-description').decode_contents()) if s.select_one('.woocommerce-product-details__short-description') else '',
                'stock': text(s.select_one('.stock')), 'sku': text(s.select_one('.sku')),
                'categories': links(cats), 'tags': links(tags), 'catLabel': (text(s.select_one('.posted_in')).split(':')[0]),
                'tagLabel': (text(s.select_one('.tagged_as')).split(':')[0]) if tags else None,
                'description': el.clean_html(p.select_one('#tab-description').decode_contents()) if p.select_one('#tab-description') else '',
                'tabs': [text(a) for a in p.select('ul.wc-tabs li a')],
                'attributes': [[text(tr.select_one('th')), text(tr.select_one('td'))] for tr in p.select('.woocommerce-product-attributes tr')],
                'related': [product_card(li) for li in p.select('section.related li.product, section.upsells li.product')],
                'relatedTitle': text(p.select_one('section.related > h2')),
                'rating': (s.select_one('.star-rating') or {}).get('aria-label') if s.select_one('.star-rating') else None,
            }
            if sidebar is None:
                sidebar = sidebar_widgets(main.select_one('aside.woo-sidebar'))
                for w in sidebar:  # barre partagée : aucune catégorie active
                    for it in w.get('items', []):
                        it.pop('current', None)
        elif 'woocommerce-shop' in body or 'tax-product_cat' in body or 'tax-product_tag' in body:
            archives[path] = {'count': text(main.select_one('.woocommerce-result-count')),
                              'orderby': [text(o) for o in main.select('select.orderby option')],
                              'cards': [product_card(li) for li in main.select('ul.products li.product')],
                              'pagination': pagination(main)}
        elif 'woocommerce-cart' in body and path.startswith('/cart'):
            archives['/cart/'] = {'empty': text(main.select_one('.cart-empty, .wc-empty-cart-message')),
                                  'html': el.clean_html(main)}
    save('shop', {'singles': singles, 'archives': archives, 'sidebar': sidebar})


# ---------------------------------------------------------------- Dons

def donation_card(it):
    a = it.select_one('.title a')
    im = it.select_one('.thumbnail img')
    return {'title': text(a), 'href': href(a.get('href')) if a else '#', 'image': img(im.get('src')) if im else None,
            'percent': text(it.select_one('.percentage')),
            'raised': text(it.select_one('.income span:nth-of-type(2)')), 'goal': text(it.select_one('.goal span:nth-of-type(2)')),
            'text': text(it.select_one('.excerpt, .description, .give-form-content, p'))}


def extract_donations():
    archives, sidebar = {}, None
    for path, body, main in pages():
        if 'post-type-archive-give_forms' in body or 'tax-give_forms_category' in body:
            wrap = main.select_one('.archive_give_donation')
            if sidebar is None and main.select_one('.sidebar_give'):
                sb = main.select_one('.sidebar_give')
                cats = sb.select_one('.widget_categories')
                urgent = []
                for x in sb.select('.widget_list_give .item-event'):
                    t = x.select_one('.title a')
                    th = x.select_one('.ova-thumb-nail div')
                    m = re.search(r'url\(([^)]+)\)', th.get('style', '')) if th else None
                    urgent.append({'title': text(t), 'href': href(t.get('href')), 'image': img(m.group(1).strip('\'"')) if m else None,
                                   'raised': text(x.select_one('.income span:nth-of-type(2)')), 'goal': text(x.select_one('.goal span'))})
                btn = sb.select_one('.button-all-event a')
                sidebar = {'catsTitle': text(cats.select_one('.widget-title')), 'cats': links(cats.select('a')),
                           'urgentTitle': text(sb.select_one('.widget_list_give .widget-title')), 'urgent': urgent,
                           'button': {'text': text(btn), 'href': href(btn.get('href'))} if btn else None}
            archives[path] = {'type': next((c for c in wrap.get('class', []) if c.startswith('type_')), 'type_1'),
                              'title': text(main.select_one('.title_archive')), 'subtitle': text(main.select_one('.title_archive2')),
                              'sidebar': bool(main.select_one('.sidebar_give')),
                              'cards': [donation_card(x) for x in main.select('.wrap_summary .give_detail')],
                              'pagination': pagination(main)}
    save('donations', {'archives': archives, 'sidebar': sidebar})


TYPES = {'posts': extract_posts, 'events': extract_events, 'departments': extract_departments,
         'services': extract_services, 'docs': extract_docs, 'directory': extract_directory,
         'portfolio': extract_portfolio, 'team': extract_team, 'shop': extract_shop, 'donations': extract_donations}

if __name__ == '__main__':
    for t in (sys.argv[1:] or TYPES):
        TYPES[t]()
    if el.UNKNOWN:
        print('Widgets non gérés :', el.UNKNOWN)
