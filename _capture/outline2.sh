#!/bin/sh
# outline2.sh <slug> [max] : arbre du <main> sans le contenu Elementor ni le pied de page
python3 - "$1" <<'PY'
import sys,re
from bs4 import BeautifulSoup
s=open('html/'+sys.argv[1]+'.html').read()
i=s.find('<main'); j=s.find('data-elementor-id="177"'); j=s.rfind('<',0,j)
soup=BeautifulSoup(s[i:j],'html.parser')
for e in soup.select('div.elementor'):
    e.clear(); e.append('[ELEMENTOR]')
open('/tmp/o2.html','w').write(str(soup))
PY
python3 outline.py /tmp/o2.html '<main' | grep -v '^\s*div$' | cut -c1-165 | head -${2:-150}
