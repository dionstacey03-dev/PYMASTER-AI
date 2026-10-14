"""Validate runnable lesson examples and their advertised output."""

import json
from importlib.resources import files
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest


class CurriculumTests(unittest.TestCase):
    def test_every_example_matches_its_output(self):
        page = files('pymaster_ai').joinpath('static/index.html').read_text()
        source = page.split('const lessons=', 1)[1].split(';\nconst $=', 1)[0]
        lessons = json.loads(source)
        self.assertEqual(len(lessons), 30)
        self.assertEqual(len({lesson['module'] for lesson in lessons}), 6)
        with TemporaryDirectory() as folder:
            for lesson in lessons:
                with self.subTest(lesson=lesson['title']):
                    self.assertIn(lesson['answer'], range(len(lesson['options'])))
                    result = subprocess.run(
                        [sys.executable, '-c', lesson['code']],
                        cwd=folder, capture_output=True, text=True, timeout=10,
                    )
                    self.assertEqual(result.returncode, 0, result.stderr)
                    self.assertEqual(result.stdout.strip(), lesson['output'])
