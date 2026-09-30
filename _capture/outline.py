"""Affiche l'arbre simplifié d'une page HTML capturée : balise.classe + texte + src.
Usage : python3 outline.py <fichier.html> [selecteur-debut] [--max N]
Par défaut, part de <main> (ou du body) et coupe avant le footer."""
import sys, re
from html.parser import HTMLParser

VOID = {'img','br','hr','input','meta','link','source','area','col','embed','param','track','wbr'}
SKIP = {'script','style','svg','noscript','iframe','template'}

class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.out=[]; s.depth=0; s.skip=0; s.stack=[]
    def handle_starttag(s,t,a):
        if s.skip or t in SKIP:
            if t not in VOID: s.skip+=1 if (s.skip or t in SKIP) else 0
            return
        a=dict(a); cls=(a.get('class') or '').split()
        cls=[c for c in cls if not re.match(r'(elementor-(element-|repeater|widget-wrap|column-wrap|widget-container|row|container)|e-con|e-flex|e-child|e-parent|animated|fadeIn)',c)]
        label=t+('.'+'.'.join(cls[:4]) if cls else '')
        ex=''
        if t=='img': ex=' src='+(a.get('data-src') or a.get('src') or '')
        if t=='a' and a.get('href'): ex=' href='+a['href'][:90]
        if t=='input' or t=='textarea' or t=='select': ex=f" type={a.get('type','')} ph={a.get('placeholder','')} name={a.get('name','')}"
        st=a.get('style','')
        if 'background' in st: ex+=' bg='+ (re.findall(r'url\(([^)]+)\)',st) or [''])[0]
        dbg=a.get('data-settings','')
        if 'background_image' in dbg:
            m=re.search(r'"url":"([^"]+)"',dbg); ex+=' bgimg='+(m.group(1).replace('\\/','/') if m else '')
        s.out.append('  '*s.depth+label+ex)
        if t not in VOID: s.depth+=1; s.stack.append(t)
    def handle_endtag(s,t):
        if s.skip:
            if t in SKIP or True: s.skip-=1
            return
        if t in VOID: return
        if s.stack:
            s.stack.pop(); s.depth=max(0,s.depth-1)
    def handle_data(s,d):
        if s.skip: return
        d=' '.join(d.split())
        if d: s.out.append('  '*s.depth+'"'+d[:160]+'"')

f=sys.argv[1]; html=open(f,encoding='utf8',errors='ignore').read()
start=sys.argv[2] if len(sys.argv)>2 and not sys.argv[2].startswith('--') else None
i=html.find(start) if start else html.find('<main')
if i<0: i=html.find('<body')
i=html.rfind('<',0,i+1)
end=-1
for k in ['class="ova_footer','elementor-location-footer','id="colophon"']:
    j=html.find(k,i)
    if j>0 and (end<0 or j<end): end=html.rfind('<',0,j)
html=html[i:end if end>0 else None]
p=P(); p.feed(html)
lines=[l for l in p.out]
# compresse les wrappers vides successifs
mx=int(sys.argv[sys.argv.index('--max')+1]) if '--max' in sys.argv else 100000
print('\n'.join(lines[:mx]))
