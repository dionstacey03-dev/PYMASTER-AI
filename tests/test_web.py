"""Exercise live HTTP routes and the runtime sandbox policy."""

from http.server import ThreadingHTTPServer
import json
import threading
import unittest
from urllib.error import HTTPError
from urllib.request import urlopen

from pymaster_ai.web import Handler


class WebTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f'http://127.0.0.1:{cls.server.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def test_assets_and_health(self):
        for path, content_type in [('/', 'text/html'), ('/workspace.js', 'text/javascript'), ('/playground-frame.js', 'text/javascript'), ('/playground.html', 'text/html'), ('/learning-core.js', 'text/javascript'), ('/learning-ui.js', 'text/javascript')]:
            with self.subTest(path=path), urlopen(self.base + path) as response:
                self.assertEqual(response.status, 200)
                self.assertIn(content_type, response.headers['Content-Type'])
                self.assertTrue(response.read())
                self.assertEqual(response.headers['X-Content-Type-Options'], 'nosniff')
        with urlopen(self.base + '/health') as response:
            self.assertEqual(json.load(response), {'status': 'ok'})

    def test_runtime_policy_limits_connections(self):
        with urlopen(self.base + '/playground.html') as response:
            policy = response.headers['Content-Security-Policy']
            self.assertIn('connect-src https://cdn.jsdelivr.net;', policy)
            self.assertIn("default-src 'none'", policy)
        with urlopen(self.base) as response:
            page = response.read().decode()
            self.assertIn('sandbox="allow-scripts"', page)
            self.assertNotIn('allow-same-origin', page)

    def test_unknown_routes_and_traversal(self):
        for path in ['/missing', '/../../pyproject.toml', '/.env', '/%2e%2e/pyproject.toml']:
            with self.subTest(path=path), self.assertRaises(HTTPError) as error:
                urlopen(self.base + path)
            self.assertEqual(error.exception.code, 404)

    def test_existing_greeting(self):
        with urlopen(self.base + '/api/greet?name=Ada') as response:
            self.assertEqual(json.load(response)['message'], 'Hello, Ada! Welcome to PYMASTER-AI.')
