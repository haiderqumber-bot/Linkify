import streamlit as st

st.set_page_config(page_title='About — Linkify', layout='centered')
st.title('About Linkify')
st.markdown('''
This is a Streamlit adaptation of the Linkify app.

**Features:**
- Multi-page app (Home, Linkify, About)
- Detects `http://`, `https://`, and `www.` links
- Renders clickable links and shows HTML output
- Ready for Streamlit Cloud deployment
''')
st.write('To run locally: `streamlit run streamlit_app.py`')
