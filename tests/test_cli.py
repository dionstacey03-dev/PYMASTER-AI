"""Exercise the public command-line interface."""

import subprocess
import sys
import unittest


class CliTests(unittest.TestCase):
    def test_default_greeting(self):
        result = subprocess.run(
            [sys.executable, "-m", "pymaster_ai"],
            capture_output=True, text=True, check=True,
        )
        self.assertEqual(result.stdout.strip(), "Hello, world! Welcome to PYMASTER-AI.")

    def test_custom_name(self):
        result = subprocess.run(
            [sys.executable, "-m", "pymaster_ai", "--name", "Ada"],
            capture_output=True, text=True, check=True,
        )
        self.assertEqual(result.stdout.strip(), "Hello, Ada! Welcome to PYMASTER-AI.")

    def test_unknown_argument_is_rejected(self):
        result = subprocess.run(
            [sys.executable, "-m", "pymaster_ai", "--unknown"],
            capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 2)


if __name__ == "__main__":
    unittest.main()
