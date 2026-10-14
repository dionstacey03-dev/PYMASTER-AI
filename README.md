# PYMASTER-AI

A minimal Python starter with a command-line entry point. AI features are not implemented yet.

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
