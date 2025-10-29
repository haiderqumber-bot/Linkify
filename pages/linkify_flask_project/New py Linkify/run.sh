#!/usr/bin/env bash
export FLASK_APP=app/main.py
python3 -m venv venv || true
source venv/bin/activate
pip install -r requirements.txt
flask run --host=0.0.0.0 --port=5000
