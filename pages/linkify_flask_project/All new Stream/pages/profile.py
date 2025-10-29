import streamlit as st, json
from pathlib import Path
import urllib.parse

st.set_page_config(page_title='Profile — LinkShort', layout='centered')

st.title('Public Profile Viewer')

profiles_path = Path('data/profiles.json')
if profiles_path.exists():
    profiles = json.loads(profiles_path.read_text(encoding='utf-8'))
else:
    profiles = {}

st.write('Enter a username to view their Linktree-style page.')
username = st.text_input('Username (no spaces)')
if username:
    uname = username.replace(' ', '').lower()
    profile = profiles.get(uname)
    if not profile:
        st.error('Profile not found.')
    else:
        st.header(profile.get('display_name') or uname)
        st.write('Links:')
        for entry in profile.get('links', []):
            alias = entry.get('alias')
            url = entry.get('url')
            # try to build a short domain
            domain = st.secrets.get('PUBLIC_DOMAIN', 'https://example.com').rstrip('/')
            short = f"{domain}/{alias}"
            st.markdown(f"- [{url}]({url}) — Short: [{short}]({short})")
        st.info('Share this username for a public Linktree-style page.')
else:
    st.info('Type a username to view their profile.')

