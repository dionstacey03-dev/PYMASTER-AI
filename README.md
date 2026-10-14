# PYMASTER-AI

A Python learning platform with 30 lessons across six modules, example code, quizzes, and browser-saved progress. Includes an isolated browser Python playground, auto-saved lesson drafts, and dark/light/system themes. AI tutoring is not configured.

## Development

Requires Python 3.12 or newer. From the repository root:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -e .
.venv/bin/pymaster-ai --name Ada
.venv/bin/python -m unittest discover -s tests -v
```

Application code lives in `src/pymaster_ai`, with tests in `tests`.
No API keys are required. The playground downloads its Python runtime from the pinned jsDelivr CDN.

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
- The final project is built and tested locally. The playground executes Python in a sandboxed browser worker. Project code is not graded; AI tutoring is not configured.

Existing progress from the original six lessons is preserved. The automated curriculum test runs all 30 examples and verifies their output.

## Milestone 1: interactive workspace

Run, stop, reset, copy, download, and edit Python with syntax highlighting, line numbers, automatic indentation, starter templates, and keyboard shortcuts. Provide newline-separated values for input() before running. Execution timing measures Python execution rather than download time. Drafts save per lesson on this device; themes persist across reloads and system mode follows OS changes. Mobile bottom navigation supports safe-area insets. Runs stop after five seconds; code/output limits and compatibility notes appear in the UI. There is no strict memory quota.

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [SETUP.md](SETUP.md), [TESTING.md](TESTING.md), and [DEPLOYMENT.md](DEPLOYMENT.md). This is a tested development milestone, not a completed production platform.

## V3 intelligent-learning foundation

Open **Learning tools** in the sidebar or mobile navigation. Generate a deterministic roadmap from existing lessons, edit study time/style, and export it. Specialty paths explicitly identify unavailable course material. Companion preferences are opt-in and device-local with visible retention/delete controls; no AI is configured. Each lesson offers progressive authored hints. Eight concept comparisons include examples, knowledge checks and related lessons. These modules load only when requested.

See [FEATURE_STATUS.md](FEATURE_STATUS.md), [SECURITY.md](SECURITY.md), and [CHANGELOG.md](CHANGELOG.md) for actual implementation boundaries. No database or new Python dependencies were added.

## Vercel frontend deployment

The website can be exported with `python3 scripts/export_site.py`. `vercel.json` configures the static frontend, runtime security headers, and preserved greeting serverless function. See [DEPLOYMENT.md](DEPLOYMENT.md). Deploying the current frontend does not implement the remaining AI/account features.
