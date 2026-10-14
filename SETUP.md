# Setup

Requires Python 3.12+.

Windows PowerShell, from the project directory:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e .
.\.venv\Scripts\python.exe -m pymaster_ai.web
```

Linux/macOS:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -e .
.venv/bin/python -m pymaster_ai.web
```

Open http://localhost:8000 locally. Stop with Ctrl+C. The application needs no secrets or database in milestone 1. The playground loads pinned Pyodide files from `https://cdn.jsdelivr.net/pyodide/v0.27.7/full/`; allow this HTTPS destination in managed networks. HTTPS or localhost is needed for clipboard support. Download remains an alternative when clipboard access is denied. No API key is embedded in the frontend.

Browser drafts and course progress stay on the current device. Download important code and export progress before clearing browser data. Initial Python load requires Internet. AI tutoring, authentication, and cloud synchronization are not configured.

## Playground input and shortcuts

Supply one response per line in Program input before running code that calls input(). Exhausted input raises EOFError; input values are not saved across reloads. Ctrl/Command+Enter runs, Ctrl/Command+S downloads the draft, Escape stops execution, Tab indents, and Shift+Tab leaves the editor. Starter templates ask before replacing a draft. Select System in the theme menu to follow your operating system.
