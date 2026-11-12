import pathlib

EXCLUDED = (
    'admin-', 'bvs-admin', 'ems-hms-admin', 'member-panel',
    'member-registration', 'member-verification', 'member.html',
    'policy.html', 'verify-member', 'swarnim-book-office',
    'swarnim-seva-admin', 'women-empowerment-admin'
)
TAG = '<script defer src="/assets/sbpf-universal-card-share.js"></script>'

count = 0
for page in pathlib.Path('.').rglob('*.html'):
    if '.git' in page.parts or 'node_modules' in page.parts:
        continue
    if page.name.lower().startswith(EXCLUDED):
        continue
    source = page.read_text(encoding='utf-8')
    if TAG in source:
        continue
    lower = source.lower()
    if '</body>' in lower:
        pos = lower.rfind('</body>')
        source = source[:pos] + TAG + '\n' + source[pos:]
    else:
        source += '\n' + TAG + '\n'
    page.write_text(source, encoding='utf-8')
    count += 1
print(f'Enabled universal SBPF sharing on {count} public HTML pages.')
