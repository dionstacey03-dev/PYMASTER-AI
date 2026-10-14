# PYMASTER-AI

A Python learning platform with six beginner lessons, example code, quizzes, and browser-saved progress. AI tutoring and interactive code execution are not implemented yet.

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

The UI listens on port 8000 and provides lessons on printing, variables, conditions, loops, lists, and functions. Complete a quiz to mark each lesson done. Progress is stored locally in your browser.
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
