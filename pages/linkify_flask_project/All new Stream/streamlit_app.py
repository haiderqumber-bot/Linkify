import streamlit as st, json
from pathlib import Path
st.set_page_config(page_title='LinkShort + Linktree', layout='centered')
st.title('LinkShort + Linktree')
params = st.experimental_get_query_params()
alias = None
if 'r' in params:
    alias = params.get('r')[0]
DATA_PATH = Path('data/links.json')
if DATA_PATH.exists() and alias:
    links = json.loads(DATA_PATH.read_text(encoding='utf-8'))
    if alias in links:
        st.markdown(f'Redirecting to [{links[alias]}]({links[alias]}) ...')
        st.experimental_set_query_params()  # clear params
        st.experimental_rerun()
    else:
        st.error('Short link not found.')
st.markdown('''
**Create short links** and **public profile pages** (Linktree style) — ready for Streamlit Cloud.

Use the sidebar or the pages menu to navigate:
- Shorten: create a short URL or custom alias
- Profile: view a public profile with multiple links (create a username when shortening)
- About: project info
''')
st.info('To run locally: `streamlit run streamlit_app.py`')    
