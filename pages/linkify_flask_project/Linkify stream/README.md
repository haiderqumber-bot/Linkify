# Linkify — Streamlit Version

A multi-page Streamlit app that converts plain text URLs into clickable links.

## Pages
- Home: Overview
- Linkify: Paste and convert text to clickable links
- About: Project information

## Run locally
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Deploy to Streamlit Cloud
1. Push this repository to GitHub.
2. In Streamlit Cloud, create a new app and point it to this repo and branch.
3. Streamlit Cloud will install dependencies from `requirements.txt` automatically.
