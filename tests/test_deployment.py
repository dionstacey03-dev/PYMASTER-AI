"""Check the deployable export and preserved API entry point."""

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]


class DeploymentTests(unittest.TestCase):
    def test_export_contains_exact_source_assets(self):
        subprocess.run([sys.executable, str(ROOT / 'scripts/export_site.py')], check=True, capture_output=True)
        source = ROOT / 'src/pymaster_ai/static'
        for asset in source.iterdir():
            if asset.suffix in {'.html', '.js'}:
                with self.subTest(asset=asset.name):
                    self.assertEqual((ROOT / 'site-public' / asset.name).read_bytes(), asset.read_bytes())
        self.assertEqual(json.loads((ROOT / 'site-public/health').read_text())['status'], 'ok')

    def test_vercel_preserves_runtime_sandbox_policy(self):
        config = json.loads((ROOT / 'vercel.json').read_text())
        self.assertEqual(config['outputDirectory'], 'site-public')
        headers = next(item['headers'] for item in config['headers'] if item['source'] == '/playground.html')
        policy = next(item['value'] for item in headers if item['key'] == 'Content-Security-Policy')
        self.assertIn("default-src 'none'", policy)
        self.assertIn('connect-src https://cdn.jsdelivr.net;', policy)

    def test_serverless_greeting_reuses_existing_handler(self):
        from pymaster_ai.web import Handler
        spec = importlib.util.spec_from_file_location('vercel_greeting', ROOT / 'api/greet.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        self.assertIs(module.handler, Handler)
