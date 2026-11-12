#!/usr/bin/env python3
"""Generate static Open Graph landing pages for SBPF shareable cards."""
import html
import json
import os
import pathlib
import re
import urllib.parse
import urllib.request
from html.parser import HTMLParser

ROOT = pathlib.Path('.')
SITE = 'https://swarnimbharatclub.in/'
SUPABASE = 'https://dxowhzghrdghfzoggorx.supabase.co/rest/v1/'
KEY = 'sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo'
LOGO = SITE + 'public/assets/sbpf-logo.svg'
EXCLUDED = ('admin-', 'bvs-admin', 'ems-hms-admin', 'member-panel',
            'member-registration', 'member-verification', 'member.html',
            'policy.html', 'verify-member', 'swarnim-book-office',
            'swarnim-seva-admin', 'women-empowerment-admin')
CARD_CLASSES = {'campaign', 'pillar', 'info', 'card', 'service-card',
                'work-area-card', 'focus-area-card', 'project-card',
                'scheme-card', 'benefit-card', 'job-card', 'opportunity-card',
                'feature-card', 'content-card', 'post-card', 'media-card',
                'listing-card', 'seva-card', 'sbpf-shareable-card'}

def clean(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def slugify(value):
    value = clean(value).lower()
    value = re.sub(r'[^\w-]+', '-', value, flags=re.UNICODE).strip('-')
    return (value[:110] or 'sbpf-card')

def fetch_rows(table):
    url = SUPABASE + table + '?is_active=eq.true&select=id,name,slug,description,image_url&order=id.asc'
    request = urllib.request.Request(url, headers={'apikey': KEY, 'Authorization': 'Bearer ' + KEY})
    with urllib.request.urlopen(request, timeout=35) as response:
        data = json.loads(response.read().decode('utf-8'))
    return data if isinstance(data, list) else []

def absolute_image(value):
    value = clean(value)
    if not value:
        return LOGO
    return urllib.parse.urljoin(SITE, value)

def route_page(record):
    route = 'share/{}/{}/'.format(record['type'], record['slug'])
    return route + 'index.html'

def render_page(record):
    title = clean(record['title']) or 'SBPF'
    description = clean(record['description']) or 'सेवा • सहयोग • स्वावलंबन • सशक्तिकरण'
    target = record.get('target') or 'index.html'
    target_url = urllib.parse.urljoin(SITE, target)
    canonical = SITE + urllib.parse.quote(route_page(record).removesuffix('index.html'), safe='/-')
    image = absolute_image(record.get('image'))
    esc = html.escape
    return f'''<!doctype html>
<html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} | SBPF</title>
<meta name="description" content="{esc(description[:300])}">
<link rel="canonical" href="{esc(canonical)}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="article"><meta property="og:site_name" content="स्वर्णिम भारत परिवार फाउंडेशन">
<meta property="og:locale" content="hi_IN"><meta property="og:title" content="{esc(title)} | SBPF">
<meta property="og:description" content="{esc(description[:300])}">
<meta property="og:url" content="{esc(canonical)}"><meta property="og:image" content="{esc(image)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)} | SBPF">
<meta name="twitter:description" content="{esc(description[:300])}"><meta name="twitter:image" content="{esc(image)}">
<meta http-equiv="refresh" content="3;url={esc(target_url)}">
<style>body{{margin:0;background:#f7f2eb;color:#31252a;font:16px system-ui,sans-serif}}main{{max-width:760px;margin:6vh auto;padding:24px}}article{{background:#fff;border:1px solid #eadfce;border-radius:18px;padding:22px;box-shadow:0 8px 28px #321c1212}}img{{display:block;max-width:100%;max-height:390px;object-fit:contain;margin:0 auto 18px;border-radius:12px}}h1{{color:#781626;line-height:1.4}}p{{line-height:1.8}}a,button{{display:inline-block;border:0;border-radius:9px;background:#781626;color:#fff;padding:12px 18px;text-decoration:none;font-weight:700;cursor:pointer}}</style>
</head><body data-card-type="{esc(record['type'])}" data-card-slug="{esc(record['slug'])}" data-card-title="{esc(title)}" data-target="{esc(target_url)}">
<main><article><img src="{esc(image)}" alt="{esc(title)}"><h1>{esc(title)}</h1><p>{esc(description)}</p>
<p>स्वर्णिम भारत परिवार फाउंडेशन • सेवा • सहयोग • स्वावलंबन • सशक्तिकरण</p>
<button id="sbpfOpenCard" type="button">पूरी जानकारी खोलें</button></article></main>
<script defer src="/assets/sbpf-share-landing.js"></script></body></html>'''

class CardParser(HTMLParser):
    def __init__(self, source_path):
        super().__init__(convert_charrefs=True)
        self.source_path = source_path
        self.depth = 0
        self.stack = []
        self.current = None
        self.capture = None
        self.records = []
    def handle_starttag(self, tag, attrs):
        self.depth += 1
        attr = dict(attrs)
        classes = set((attr.get('class') or '').split())
        parent_ids = {x.get('id') for x in self.stack}
        if self.current is None and classes.intersection(CARD_CLASSES):
            card_type = 'campaign' if 'sbpfCampaignGrid' in parent_ids else ('focus_area' if 'sbpfFocusGrid' in parent_ids else 'campaign_content')
            self.current = {'tag':tag,'depth':self.depth,'type':card_type,
                            'id':attr.get('id') or '', 'slug':attr.get('data-share-slug') or '',
                            'title':attr.get('data-share-title') or '', 'description':attr.get('data-share-description') or '',
                            'image':'', 'target':'', 'title_parts':[],'description_parts':[]}
        if self.current:
            if tag in ('h1','h2','h3','h4') and not self.current['title']:
                self.capture = ('title',tag,self.depth)
            elif tag == 'p' and not self.current['description']:
                self.capture = ('description',tag,self.depth)
            if tag == 'img' and not self.current['image']:
                self.current['image'] = attr.get('src') or attr.get('data-src') or ''
            if tag == 'a' and not self.current['target']:
                href = attr.get('href') or ''
                if href and not href.startswith(('#','javascript:','mailto:','tel:')):
                    self.current['target'] = href
        self.stack.append({'tag':tag,'id':attr.get('id')})
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs); self.handle_endtag(tag)
    def handle_data(self, data):
        if self.current and self.capture:
            kind, _, _ = self.capture
            self.current[kind + '_parts'].append(data)
    def handle_endtag(self, tag):
        if self.capture and self.capture[1] == tag and self.capture[2] == self.depth:
            self.capture = None
        if self.current and self.current['tag'] == tag and self.current['depth'] == self.depth:
            item = self.current
            title = clean(item['title'] or ''.join(item['title_parts']))
            if title:
                slug = slugify(item['slug'] or item['id'] or title)
                target = item['target'] or (self.source_path + '#' + (item['id'] or ('sbpf-card-' + slug)))
                self.records.append({'type':item['type'],'slug':slug,'title':title,
                    'description':clean(item['description'] or ''.join(item['description_parts'])),
                    'image':item['image'],'target':target})
            self.current = None; self.capture = None
        if self.stack:
            self.stack.pop()
        self.depth = max(0,self.depth-1)

def main():
    records = {}
    # Fetch the current public campaign and work-area catalogue from the existing Supabase project.
    for table, card_type in (('campaigns','campaign'),('focus_areas','focus_area')):
        try:
            rows = fetch_rows(table)
        except Exception as exc:
            raise SystemExit('Could not load public {} from existing Supabase: {}'.format(table, exc))
        for row in rows:
            slug = slugify(row.get('slug') or row.get('name'))
            if card_type == 'campaign':
                special = {'swarnim-book':'swarnim-book.html','swarnim-media':'swarnim-media/index.html',
                           'swarnim-creator':'swarnim-creator.html','swarnim-csc':'swarnim-csc.html'}
                target = special.get(slug, 'campaign.html?slug=' + urllib.parse.quote(slug))
            else:
                target = 'work-area.html?slug=' + urllib.parse.quote(slug)
            rec = {'type':card_type,'slug':slug,'title':row.get('name') or slug,
                   'description':row.get('description') or '', 'image':row.get('image_url') or '',
                   'target':target}
            records[(card_type,slug)] = rec
    extras = [
        {'type':'campaign','slug':'swarnim-creator','title':'स्वर्णिम Creator',
         'description':'वीडियो निर्माण, संपादन और रचनात्मक डिजिटल सामग्री के लिए स्वर्णिम Creator।',
         'image':'','target':'swarnim-creator.html'},
        {'type':'campaign','slug':'swarnim-csc','title':'स्वर्णिम जनसुविधा केंद्र',
         'description':'सरकारी सेवाएँ, योजनाएँ, प्रमाणपत्र, रोजगार और अधिकृत पोर्टल की जानकारी।',
         'image':'','target':'swarnim-csc.html'}
    ]
    for rec in extras:
        records[(rec['type'],rec['slug'])] = rec
    # Include the other static cards used across public SBPF pages.
    for page in ROOT.rglob('*.html'):
        rel = page.as_posix()
        if '.git' in page.parts or 'node_modules' in page.parts or page.name.lower().startswith(EXCLUDED):
            continue
        try:
            parser = CardParser(rel); parser.feed(page.read_text(encoding='utf-8'))
            for rec in parser.records:
                key = (rec['type'],rec['slug'])
                records.setdefault(key,rec)
        except Exception as exc:
            print('Skipped card extraction for {}: {}'.format(rel,exc))
    # Build a clean directory tree on every Pages build to avoid stale share metadata.
    share_root = ROOT / 'share'
    if share_root.exists():
        import shutil
        shutil.rmtree(share_root)
    for rec in records.values():
        output = ROOT / route_page(rec)
        output.parent.mkdir(parents=True,exist_ok=True)
        output.write_text(render_page(rec),encoding='utf-8')
    print('Generated {} individual SBPF Open Graph share pages.'.format(len(records)))

if __name__ == '__main__':
    main()
