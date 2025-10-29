#!/usr/bin/env bash
# Simple run script for local development
python3 -m venv venv || true
source venv/bin/activate
pip install -r requirements.txt
python app.py
