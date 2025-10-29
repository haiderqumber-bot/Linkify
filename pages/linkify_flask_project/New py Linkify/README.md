# Linkify Flask Project v2

A clean Flask web app that converts URLs in text to clickable links.

## Project structure
- `app/main.py`: Main Flask app file
- `app/templates/`: HTML templates
- `app/static/css/style.css`: Styling
- `requirements.txt`: Dependencies

## Run locally
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app/main.py
```

## Bug Fixes
- Disabled Flask reloader to prevent signal/thread errors
- Ready for Streamlit / Cloud / Replit hosting
