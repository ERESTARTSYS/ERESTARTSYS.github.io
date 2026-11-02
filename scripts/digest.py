"""Hash generated public content without logging it or storing the Markdown."""
import hashlib
import os
from pathlib import Path

files = (sorted(Path('content/blog').glob('issue-*.md')) + [Path('content/about/_index.md'), Path('content/_index.md'), Path('content/blog/_index.md'), Path('zola.template.toml')] + sorted(p for p in Path('themes/hushline').rglob('*') if p.is_file()))
h = hashlib.sha256()
for path in files:
    data = path.read_bytes()
    h.update(len(path.as_posix()).to_bytes(4, 'big'))
    h.update(path.as_posix().encode())
    h.update(len(data).to_bytes(8, 'big'))
    h.update(data)
with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as out:
    out.write('sha=' + h.hexdigest() + '\n')
