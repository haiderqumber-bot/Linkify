# LinkShort + Linktree - Streamlit

Simple Streamlit app that provides URL shortening and Linktree-style public profiles.

## How it works
- Short links and profiles are stored in `data/links.json` and `data/profiles.json`.
- For Streamlit Cloud, data folder persists across runs for the same app (app state).

## Run locally
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Deployment notes
- Set `PUBLIC_DOMAIN` in Streamlit Secrets to your app URL (e.g., `https://your-app.streamlit.app`) to get proper short link display.
- To enable redirecting from `https://your-domain/alias`, you'll need a redirect endpoint configured outside Streamlit (e.g., Netlify/GitHub Pages or a tiny Flask lambda).
