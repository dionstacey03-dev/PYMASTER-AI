"""Vercel's Python handler reuses the existing read-only greeting API."""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src'))

from pymaster_ai.web import Handler as handler  # noqa: E402,F401
