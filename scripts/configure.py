"""Configure the checkout for its GitHub Pages URL without printing secrets."""
import os
from pathlib import Path
from urllib.parse import urlsplit

repo = os.environ["GITHUB_REPOSITORY"].split("/", 1)
if len(repo) != 2:
    raise SystemExit("Invalid repository context")
owner, name = repo
base = os.environ.get("SITE_BASE_URL", "").strip()
if not base:
    base = f"https://{owner.lower()}.github.io/"
    if name.lower() != f"{owner.lower()}.github.io":
        base += f"{name}/"
parts = urlsplit(base)
if parts.scheme != "https" or not parts.netloc or parts.query or parts.fragment:
    raise SystemExit("SITE_BASE_URL must be an HTTPS URL")
base = base.rstrip("/") + "/"
template = Path("zola.template.toml").read_text(encoding="utf-8")
Path("zola.toml").write_text(template.replace('base_url = "https://example.com/"', f'base_url = "{base}"'), encoding="utf-8")
