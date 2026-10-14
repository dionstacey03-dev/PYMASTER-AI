# PYMASTER-AI

A Python learning platform with 30 lessons across six modules, example code, quizzes, and browser-saved progress. AI tutoring and interactive code execution are not implemented yet.

## Development

Requires Python 3.12 or newer. From the repository root:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -e .
.venv/bin/pymaster-ai --name Ada
.venv/bin/python -m unittest discover -s tests -v
```

Application code lives in `src/pymaster_ai`, with tests in `tests`.
No external services or API keys are required for this starter.

## Browser interface

From the repository root, run:

```bash
.venv/bin/python -m pymaster_ai.web
```

The UI listens on port 8000 and covers foundations, data, reliable programs, software design, applied Python, and a final task-tracker project. Complete a quiz to mark each lesson done. Progress is stored locally in your browser.
Use `--host 0.0.0.0 --port 8000` when your development platform needs to reach
the server through a forwarded port. This is a development server.

## Windows PowerShell

With Python 3.12 or newer installed, run from the repository root:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e .
.\.venv\Scripts\python.exe -m pymaster_ai.web
```

Open http://localhost:8000. To update an existing installation, stop the server with Ctrl+C, run `git pull origin main`, then restart it.

## Course features

- 30 lessons with explanations, runnable examples, expected output, practice challenges, and quizzes.
- Search and module filtering, resume learning, and downloadable Python examples.
- Browser-local progress with JSON export/import for backups or moving devices.
- A completion summary after all quizzes pass; it is a personal learning record, not an accredited certificate.
- The final project is built and tested locally. The website does not execute or grade submitted code and has no AI tutor.

Existing progress from the original six lessons is preserved. The automated curriculum test runs all 30 examples and verifies their output.
