import streamlit as st
st.set_page_config(page_title='About', layout='centered')
st.title('About LinkShort + Linktree')
st.markdown('''
This app provides:
- URL shortening (custom alias or auto-generated)
- Linktree-style public profiles (username pages with multiple links)
- Storage in local JSON files inside the `data/` folder (works on Streamlit Cloud as app state)

**Notes for deployment**
- Set `PUBLIC_DOMAIN` in Streamlit Secrets to the domain where short links will be served (e.g., `https://your-app.streamlit.app`).
- To actually **redirect** short links on a domain, you need to serve redirects (e.g., via a tiny redirect route or GitHub Pages redirects). For Streamlit demo, users visiting the short path can be handled by the app using query param `?r=ALIAS` on the homepage (advanced).
''')
