# PYMASTER-AI

A minimal Python starter with a command-line entry point and browser interface. AI features are not implemented yet.

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

The UI listens on port 8000 and provides a name field and interactive greeting.
Use `--host 0.0.0.0 --port 8000` when your development platform needs to reach
the server through a forwarded port. This is a development server.
