from flask import Flask, render_template, request, redirect, url_for, flash
import re
from markupsafe import Markup

app = Flask(__name__)
app.secret_key = 'replace-this-with-a-secure-key-for-production'

URL_REGEX = re.compile(
    r'(?P<url>(https?://|www\.)[\w\-]+(\.[\w\-]+)+(:\d+)?(/[\w\-\./?%&=+#]*)?)',
    flags=re.IGNORECASE
)

def ensure_scheme(u):
    if u.startswith('http://') or u.startswith('https://'):
        return u
    return 'http://' + u

def linkify_text(text):
    def repl(m):
        url = m.group('url')
        href = ensure_scheme(url)
        # escape url for safety handled by Markup when returning
        return f'<a href="{href}" target="_blank" rel="noopener noreferrer nofollow">{url}</a>'
    linked = URL_REGEX.sub(repl, text)
    return linked

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/linkify', methods=['GET', 'POST'])
def linkify():
    result = None
    original = ''
    if request.method == 'POST':
        original = request.form.get('text', '')
        if not original.strip():
            flash('Please enter some text to linkify.', 'warning')
            return redirect(url_for('linkify'))
        linked = linkify_text(original)
        # Markup so Jinja doesn't escape HTML anchors
        result = Markup(linked)
    return render_template('linkify.html', result=result, original=original)

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
