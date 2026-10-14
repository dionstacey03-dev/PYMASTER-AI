# Vercel deployment

The current browser frontend is deployable as static assets; it does not expose the standard-library development server. `vercel.json` runs `python3 scripts/export_site.py` and serves `site-public`. The existing greeting endpoint is preserved with a small Python serverless entry point in `api/greet.py`. There is no server-side learner code execution or account database.

## Local checks

```bash
python3 scripts/export_site.py
python -m unittest discover -s tests -v
node --test tests/js/learning-core.test.cjs
```

The export includes every browser asset. Vercel configuration supplies the runtime iframe CSP and common response headers. Static `/health` reports only frontend availability; it does not imply AI/account readiness. The deployable export has been exercised locally using the learning and actual-runtime workspace browser suites. A remote Vercel deployment has not yet been verified.

## Publish from Vercel

Import `dionstacey03-dev/PYMASTER-AI` from GitHub into Vercel. Select **Other** as the framework, keep the repository root, and let `vercel.json` supply the build/output settings. The project needs no runtime API keys for its existing features. The build must have Python 3.12 or newer available, as provided by Vercel's Python environment for the serverless function.

Alternatively use the Vercel CLI from the repository root with a securely configured personal `VERCEL_TOKEN` and the intended account/team:

```bash
vercel deploy --prod --yes
```

Never paste a token into chat or commit it. The onboarding environment has no usable Vercel credential, and the current proxy rejects api.vercel.com with HTTP 403; a `VERCEL_TOKEN` requirement for `api.vercel.com` has been saved for secure entry. Review/save the environment setting and publish the environment configuration if required by that UI, then retry the authorized deployment. A configuration save alone does not deploy a website.

## Boundaries

Current progress and drafts are browser-local. Moving from localhost to a new public origin does not automatically migrate local storage: export progress and download important drafts first. AI/provider calls, authenticated synchronization, certificates, community features and private cloud data are not implemented. Do not claim that deploying the frontend completes the requested production platform. The sandbox has time/output caps but not a strict browser memory quota. Initial Python runtime loading needs HTTPS access to the pinned jsDelivr CDN; no complete offline/PWA support is claimed.

Future authenticated features require a production backend, database migrations/backups, recovery delivery, provider quotas, authorization, logging and deployment tests. No database migration is required now. Public deployment is authorized by the user's latest request; remote publication still requires usable hosting credentials.
