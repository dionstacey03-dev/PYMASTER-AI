# PYMASTER-AI

**A hands-on programming learning platform — start with Python, then explore the web and Java.**

PYMASTER-AI brings structured lessons, editable examples, quick knowledge checks, and a browser-based coding workspace into one responsive learning experience.

## Learning paths

| Language | What you'll learn | Practice experience |
|---|---|---|
| **Python** | 30 lessons across 6 modules, from fundamentals to applied programming and a final task-tracker project | Interactive quizzes, editable code, and a sandboxed browser Python playground |
| **HTML** | Page structure, links, images, lists, forms, and semantic elements | Edit examples and preview pages in the browser |
| **CSS** | Selectors, colours, the box model, spacing, Flexbox, and responsive layouts | Edit styles and preview the result in the browser |
| **TypeScript** | Types, variables, functions, interfaces, arrays, and generics | Editable examples with local TypeScript compiler instructions |
| **Java** | First programs, variables, decisions, classes, and objects | Editable examples with local JDK compile/run instructions |

The HTML and CSS tracks include an isolated live preview. TypeScript and Java examples are editable and downloadable, but are **not executed inside the browser**; use the compiler/JDK instructions in each lesson to run them locally.

## Platform features

- **Guided learning:** short explanations, example code, practice prompts, and knowledge checks.
- **Python workspace:** syntax highlighting, line numbers, automatic indentation, starter templates, copy/download, and run/stop controls.
- **Browser Python runtime:** Python executes in an isolated browser worker; the runtime is loaded from a pinned jsDelivr CDN asset.
- **Multi-language lessons:** dedicated HTML, CSS, TypeScript, and Java learning paths.
- **Progress and drafts:** lesson progress and code drafts are saved locally in your browser. Python progress can be exported/imported as JSON.
- **Learning tools:** a deterministic study roadmap, progressive authored hints, concept comparisons, and optional device-local study preferences.
- **Responsive interface:** mobile navigation, dark/light/system themes, and reduced-motion/reduced-transparency preferences.

## Quick start

### Requirements

- Python **3.12 or newer**
- Git
- Node.js **22 or newer** for the JavaScript checks in CI

### Install

Clone the repository and install the package in editable mode:

```bash
git clone https://github.com/dionstacey03-dev/PYMASTER-AI.git
cd PYMASTER-AI

python3 -m venv .venv
.venv/bin/python -m pip install -e .
```

On Windows PowerShell:

```powershell
git clone https://github.com/dionstacey03-dev/PYMASTER-AI.git
cd PYMASTER-AI

py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e .
```

### Run the browser interface

From the repository root:

```bash
.venv/bin/python -m pymaster_ai.web
```

Then open [http://localhost:8000](http://localhost:8000).

On Windows PowerShell:

```powershell
.\.venv\Scripts\python.exe -m pymaster_ai.web
```

The development server can be bound to a forwarded interface when needed:

```bash
.venv/bin/python -m pymaster_ai.web --host 0.0.0.0 --port 8000
```

No API keys are required for the currently implemented learning features. The browser Python runtime needs internet access to download its pinned runtime asset.

## Run checks

Python unit tests:

```bash
.venv/bin/python -m unittest discover -s tests -v
```

JavaScript learning-core tests:

```bash
node --test tests/js/learning-core.test.cjs
```

Check the multi-language lesson script:

```bash
node --check src/pymaster_ai/static/languages.js
```

Export the static frontend used by the Vercel configuration:

```bash
python3 scripts/export_site.py
```

The GitHub Actions workflow runs the Python and JavaScript checks, validates JavaScript syntax, verifies the static export, and checks the Vercel configuration.

## Project structure

```text
PYMASTER-AI/
├── .github/workflows/       # GitHub Actions CI
├── api/                     # Small serverless API endpoints
├── scripts/                 # Static-site export and project scripts
├── src/pymaster_ai/
│   ├── static/              # Browser UI, lessons, and JavaScript assets
│   ├── __main__.py           # CLI entry point
│   └── web.py                # Local development server
├── tests/                   # Python and JavaScript tests
├── DEPLOYMENT.md             # Vercel deployment instructions and limits
├── ARCHITECTURE.md           # Architecture overview
├── FEATURE_STATUS.md         # Implemented features and boundaries
├── SECURITY.md               # Security notes
└── pyproject.toml            # Python package configuration
```

## Deployment

The repository includes a static frontend export and Vercel configuration. To prepare the deployable site locally:

```bash
python3 scripts/export_site.py
```

For the Vercel import and deployment steps, see [DEPLOYMENT.md](DEPLOYMENT.md).

**Deployment status:** repository configuration is present, but a live production deployment should only be considered complete after it has been published and verified.

## Important implementation boundaries

- Progress, drafts, and optional study preferences are stored in the current browser/device; there is no account-based synchronization.
- AI tutoring and AI-generated lessons are not configured.
- The study roadmap and concept tools use authored content and deterministic rules, not an AI model.
- The Python playground runs in a browser worker with execution-time and output limits. It is not a general-purpose server-side execution environment.
- TypeScript and Java lessons provide editable examples and local compiler instructions; they do not include an in-browser compiler/runtime.
- A static frontend deployment does not add authentication, a database, cloud progress sync, or unfinished backend features.

See [FEATURE_STATUS.md](FEATURE_STATUS.md), [SECURITY.md](SECURITY.md), [ARCHITECTURE.md](ARCHITECTURE.md), [SETUP.md](SETUP.md), [TESTING.md](TESTING.md), and [CHANGELOG.md](CHANGELOG.md) for more detail.

## Contributing

Contributions are welcome. Please open an issue to report a bug or suggest a learning path, lesson, accessibility improvement, or feature. For code changes, include tests where practical and keep existing Python learning functionality intact.

## License

Check the repository's license file for the current licensing terms.

---

Built to make learning programming more practical, one lesson at a time.
