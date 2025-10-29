# Linkify Flask Project

A small Flask web app that provides a Linkify page — paste text and all URLs (http(s):// and www.) are turned into clickable links.

## Included
- `app.py` — Flask application
- `templates/` — HTML pages (index, linkify, about) using simple, responsive layout
- `static/css/style.css` — styles
- `requirements.txt` — Python dependencies
- `run.sh` — simple run script
- `.gitignore` — ready for GitHub
- `README.md` — this file

## Quick start (Linux / macOS)

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Then open http://127.0.0.1:5000 in your browser.

## Linkify behavior
- Detects `http://`, `https://`, and `www.` style URLs
- Opens links in a new tab with `rel="noopener noreferrer nofollow"`

## Notes for GitHub
- Replace the `app.secret_key` in `app.py` before deploying to production.
- Add CI/workflow or Dockerfile as needed.
