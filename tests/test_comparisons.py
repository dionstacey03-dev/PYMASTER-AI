"""Run each comparison's illustrative Python and verify its output."""

from importlib.resources import files
import json
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest


class ComparisonTests(unittest.TestCase):
    def test_all_comparison_examples(self):
        source = files('pymaster_ai').joinpath('static/learning-core.js').read_text()
        comparisons = json.loads(source.split('const comparisons = ', 1)[1].split(';\n  const api=', 1)[0])
        self.assertEqual(len(comparisons), 8)
        with TemporaryDirectory() as folder:
            for item in comparisons:
                for side in ['left', 'right']:
                    with self.subTest(comparison=item['id'], side=side):
                        result = subprocess.run([sys.executable, '-c', item[side + 'Code']], cwd=folder, capture_output=True, text=True, timeout=10)
                        self.assertEqual(result.returncode, 0, result.stderr)
                        self.assertEqual(result.stdout.strip(), item[side + 'Output'])
