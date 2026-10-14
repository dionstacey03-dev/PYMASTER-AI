"""Browser interface for the greeting app."""

import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from urllib.parse import parse_qs, urlsplit


PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>PYMASTER-AI</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;background:#0d1425;color:#edf2ff;min-height:100vh;display:grid;place-items:center;padding:24px}
main{width:100%;max-width:640px;background:#172139;border:1px solid #31405b;border-radius:24px;padding:40px;box-shadow:0 24px 80px #0004}
.badge{color:#b9a7ff;font-size:13px;font-weight:700;letter-spacing:2px}h1{font-size:clamp(32px,7vw,48px);margin:16px 0}p{color:#b5c1d8;line-height:1.6}
label{display:block;margin:28px 0 8px;font-weight:600}input{width:100%;padding:15px;border-radius:10px;border:1px solid #52617c;background:#0d1425;color:white;font:inherit}
button{margin-top:16px;padding:14px 24px;border:0;border-radius:10px;background:#b9a7ff;color:#17112f;font:inherit;font-weight:700;cursor:pointer}button:disabled{opacity:.6}input:focus-visible,button:focus-visible{outline:3px solid #d8ccff;outline-offset:3px}
#result{margin-top:24px;padding:20px;background:#0d1425;border-radius:12px;min-height:68px;overflow-wrap:anywhere}footer{margin-top:28px;color:#b5c1d8;font-size:13px}
</style>
</head>
<body><main>
<div class="badge">PYMASTER-AI</div><h1>Hello, possibilities.</h1>
<p>Your Python workspace, now with a browser interface. Enter your name to get started.</p>
<form id="greeting"><label for="name">Your name</label><input id="name" name="name" placeholder="e.g. Ada" maxlength="200" autocomplete="given-name"><button type="submit">Say hello →</button></form>
<div id="result" role="status" aria-live="polite">Your greeting will appear here.</div>
<footer>Python starter · AI features coming later</footer>
</main><script>
const form=document.querySelector('#greeting'),result=document.querySelector('#result'),button=form.querySelector('button');
form.addEventListener('submit',async event=>{event.preventDefault();button.disabled=true;result.textContent='Preparing your greeting…';
try{const response=await fetch('/api/greet?'+new URLSearchParams({name:form.elements.name.value}));if(!response.ok)throw new Error('Request failed');const data=await response.json();result.textContent=data.message;}
catch(error){result.textContent='Could not load your greeting. Please try again.';}finally{button.disabled=false;}});
</script></body></html>"""


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlsplit(self.path)
        if url.path == "/":
            body = PAGE.encode()
            content_type = "text/html; charset=utf-8"
        elif url.path == "/api/greet":
            name = parse_qs(url.query).get("name", ["world"])[0].strip() or "world"
            if len(name) > 200:
                self.send_error(400, "Name must be 200 characters or fewer")
                return
            body = json.dumps({"message": f"Hello, {name}! Welcome to PYMASTER-AI."}).encode()
            content_type = "application/json; charset=utf-8"
        else:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)


def main():
    parser = argparse.ArgumentParser(description="Run the PYMASTER-AI browser interface")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"PYMASTER-AI UI listening on {args.host}:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
