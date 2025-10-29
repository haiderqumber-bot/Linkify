import streamlit as st
import re

st.set_page_config(page_title='Linkify', layout='centered')
st.title('Linkify')

URL_REGEX = re.compile(
    r'(?P<url>(https?://|www\.)[\w\-]+(\.[\w\-]+)+(:\d+)?(/[\w\-\./?%&=+#]*)?)',
    flags=re.IGNORECASE
)

def ensure_scheme(u: str) -> str:
    if u.startswith('http://') or u.startswith('https://'):
        return u
    return 'http://' + u

def linkify_text(text: str) -> str:
    def repl(m):
        url = m.group('url')
        href = ensure_scheme(url)
        return f'<a href="{href}" target="_blank" rel="noopener noreferrer nofollow">{url}</a>'
    return URL_REGEX.sub(repl, text)

st.write('Paste text below containing URLs (http(s):// or www.) and click **Linkify**.')
original = st.text_area('Text to convert', height=200, placeholder='Paste text with links here...')
if st.button('Linkify'):
    if not original.strip():
        st.warning('Please enter some text to linkify.')
    else:
        linked_html = linkify_text(original)
        st.markdown('### Result (Rendered)')
        st.markdown(linked_html, unsafe_allow_html=True)
        st.markdown('### Result (HTML)')
        st.code(linked_html, language='html')
        st.caption('You can copy the linked HTML from above.')
