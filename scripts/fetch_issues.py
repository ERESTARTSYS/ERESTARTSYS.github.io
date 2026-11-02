"""Convert public parent Issues and their sub-issues to Zola pages.

Never log API responses, bodies, titles, or build errors containing Markdown.
"""
import json
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

class FetchError(Exception):
    pass

OWNER = os.environ.get("CONTENT_OWNER", "").strip()
REPO = os.environ.get("CONTENT_REPO", "").strip()
TOKEN = os.environ.get("CONTENT_PAT", "").strip()
if not OWNER or not REPO or not TOKEN:
    raise SystemExit("Missing content repository configuration")
BASE = "https://api.github.com/repos/" + quote(OWNER, safe="") + "/" + quote(REPO, safe="")
HEADERS = {"Authorization": "Bearer " + TOKEN, "Accept": "application/vnd.github.raw+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "hushline-issue-builder"}

def api(path, allow_missing=False):
    req = Request(BASE + path, headers=HEADERS)
    try:
        with urlopen(req, timeout=30) as response:
            return json.load(response)
    except HTTPError as exc:
        if allow_missing and exc.code == 404:
            return None
        raise FetchError(f"GitHub API returned HTTP {exc.code}") from None
    except (URLError, ValueError, TimeoutError):
        raise FetchError("GitHub API request failed") from None

def pages(path):
    result = []
    for number in range(1, 1001):
        separator = "&" if "?" in path else "?"
        batch = api(f"{path}{separator}per_page=100&page={number}")
        if not isinstance(batch, list):
            raise FetchError("Unexpected GitHub API response")
        result.extend(batch)
        if len(batch) < 100:
            return result
    raise FetchError("Too many API pages")

def labels(issue):
    return [str(label.get("name", "")) for label in issue.get("labels", []) if isinstance(label, dict)]

def text(value):
    return value if isinstance(value, str) else ""

def child_bodies(issue_number, seen, depth=0):
    if depth > 20:
        raise FetchError("Sub-issue nesting exceeds limit")
    result = []
    for child in pages(f"/issues/{issue_number}/sub_issues"):
        key = (text(child.get("repository_url")), child.get("number"))
        if key in seen:
            continue
        seen.add(key)
        # Keep the content within the configured content repository.
        if text(child.get("repository_url")).rstrip("/").lower() != BASE.lower():
            continue
        body = text(child.get("body"))
        if body:
            result.append(body)
        result.extend(child_bodies(int(child["number"]), seen, depth + 1))
    return result

def front_matter(title, date, tags=None):
    result = ['+++', 'title = ' + json.dumps(title, ensure_ascii=False), 'date = ' + json.dumps(date),]
    if tags is not None:
        result += ['[taxonomies]', 'tags = ' + json.dumps(tags, ensure_ascii=False)]
    return '\n'.join(result + ['+++', '']) + '\n'

def run():
    issues = [x for x in pages('/issues?state=all&direction=desc') if 'pull_request' not in x]
    public = [x for x in issues if any(label.lower() == 'public' for label in labels(x))]
    top = []
    for issue in public:
        if api(f'/issues/{int(issue["number"])}/parent', allow_missing=True) is None:
            top.append(issue)
    out = Path('content/blog')
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob('issue-*.md'):
        old.unlink()
    about = []
    for issue in top:
        names = labels(issue)
        seen = {(text(issue.get('repository_url')), issue['number'])}
        chunks = [text(issue.get('body'))] + child_bodies(int(issue['number']), seen)
        body = '\n\n'.join(chunk for chunk in chunks if chunk.strip())
        if any(name.lower() == 'content:about' for name in names):
            about.append((text(issue.get('updated_at')), int(issue['number']), body))
            continue
        tags = [name for name in names if name.lower() not in ('public', 'content:about')]
        date = text(issue.get('created_at'))[:10]
        page = front_matter(text(issue.get('title')) or 'Untitled', date, tags) + body + '\n'
        (out / f'issue-{int(issue["number"])}.md').write_text(page, encoding='utf-8')
    Path('content/about/_index.md').write_text(Path('defaults/about.md').read_text(encoding='utf-8'), encoding='utf-8')
    if about:
        _, _, body = max(about)
        Path('content/about/_index.md').write_text('+++\ntitle = "About"\n+++\n\n' + body + '\n', encoding='utf-8')

if __name__ == '__main__':
    try:
        run()
    except (FetchError, KeyError, TypeError, ValueError, OSError):
        print('Content sync failed. Check repository access, issue links, and Markdown locally.', file=sys.stderr)
        sys.exit(1)
