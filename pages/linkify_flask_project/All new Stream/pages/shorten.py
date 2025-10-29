import streamlit as st
import json, os, random, string
from pathlib import Path

st.set_page_config(page_title='Shorten — LinkShort', layout='centered')
st.title('Create Short Links')

DATA_PATH = Path('data/links.json')
PROFILES_PATH = Path('data/profiles.json')

def load_json(path):
    if path.exists():
        return json.loads(path.read_text(encoding='utf-8'))
    return {}

def save_json(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding='utf-8')

links = load_json(DATA_PATH)
profiles = load_json(PROFILES_PATH)

def make_code(length=6):
    alphabet = string.ascii_letters + string.digits
    for _ in range(10):
        code = ''.join(random.choice(alphabet) for _ in range(length))
        if code not in links:
            return code
    raise RuntimeError('Unable to generate unique code')

st.write('Paste a long URL, optionally set a custom alias or create a username for a profile page.')
long_url = st.text_input('Long URL', placeholder='https://example.com/very/long/path')
custom_alias = st.text_input('Custom alias (optional)', placeholder='my-alias (no spaces)')
username = st.text_input('Your public username/profile (optional)', placeholder='yourname - used for profile page')
ttl_pages = st.number_input('Short code length (6 recommended)', min_value=4, max_value=12, value=6, step=1)

if st.button('Create short link'):
    if not long_url or not long_url.strip():
        st.warning('Enter a valid URL to shorten.')
    else:
        alias = custom_alias.strip() or None
        # sanitize alias
        if alias:
            alias = alias.replace(' ', '').strip()
            if alias in links:
                st.error('Alias already in use. Pick another one.')
                st.stop()
        else:
            alias = make_code(length=ttl_pages)

        # save mapping
        links[alias] = long_url.strip()
        save_json(DATA_PATH, links)

        # if user provided username, create/update profile
        uname = username.strip() or None
        if uname:
            uname = uname.replace(' ', '').lower()
            user = profiles.get(uname, {'links': [], 'display_name': uname})
            # add a reference to the short link in the user's profile
            user_entry = {'alias': alias, 'url': long_url.strip()}
            # avoid duplicate for same url
            if not any(e.get('url') == user_entry['url'] for e in user['links']):
                user['links'].append(user_entry)
            profiles[uname] = user
            save_json(PROFILES_PATH, profiles)

        domain = st.secrets.get('PUBLIC_DOMAIN', 'https://example.com')  # user should set this in Streamlit secrets
        short_url = f"{domain.rstrip('/')}/{alias}"
        st.success('Short link created!')
        st.markdown(f'**Short URL:** [{short_url}]({short_url})')
        st.code(short_url)
        st.markdown('> Note: For local testing, use `http://localhost:8501/?r=ALIAS` or set `PUBLIC_DOMAIN` in Streamlit secrets.')

st.markdown('---')
st.write('**Admin / Dev tools** (local use):')
if st.checkbox('Show raw DB files'):
    st.write('links.json (alias -> long url)')
    st.json(links)
    st.write('profiles.json (username -> profile data)')
    st.json(profiles)
