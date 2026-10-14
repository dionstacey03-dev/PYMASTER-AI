/* Runs in an opaque-origin sandbox. No access to the app's DOM or storage. */
function runtimeWorker() {
  let runtime;
  let started;
  const output = text => self.postMessage({type: 'output', text: String(text)});
  self.onmessage = async event => {
    try {
      if (event.data.type === 'init') {
        importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
        runtime = await loadPyodide({indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/', stdout: output, stderr: output});
        self.postMessage({type: 'ready'});
      } else if (event.data.type === 'run' && runtime) {
        const inputs = event.data.input === "" ? [] : event.data.input.split("\n");
        runtime.setStdin({stdin: () => inputs.length ? inputs.shift() : null});
        started = performance.now();
        await runtime.runPythonAsync(event.data.code);
        self.postMessage({type: 'done', elapsed: performance.now() - started});
      }
    } catch (error) { self.postMessage({type: 'error', text: String(error), elapsed: started === undefined ? null : performance.now() - started}); }
  };
}
let worker, timer, pending, pendingInput, count = 0;
function send(type, text, elapsed = null) { parent.postMessage({channel: 'pymaster-runtime', type, text, elapsed}, '*'); }
function stop() { clearTimeout(timer); if (worker) worker.terminate(); worker = null; pending = null; pendingInput = null; }
function timeout(ms, text) { clearTimeout(timer); timer = setTimeout(() => { stop(); send('error', text); }, ms); }
window.addEventListener('message', event => {
  if (event.source !== parent || event.data?.channel !== 'pymaster-runtime') return;
  if (event.data.type === 'stop') { stop(); send('stopped', 'Execution stopped.'); return; }
  if (event.data.type !== 'run' || typeof event.data.code !== 'string') return;
  if (typeof event.data.input !== 'string' || event.data.input.length > 20000) { send('error', 'Input is limited to 20,000 characters.'); return; }
  if (event.data.code.length > 20000) { send('error', 'Code is limited to 20,000 characters.'); return; }
  stop(); count = 0; pending = event.data.code; pendingInput = event.data.input;
  send('loading', 'Loading Python runtime… First use requires Internet access.');
  const url = URL.createObjectURL(new Blob(['(' + runtimeWorker.toString() + ')()'], {type: 'application/javascript'}));
  worker = new Worker(url); URL.revokeObjectURL(url);
  timeout(60000, 'Python could not load within 60 seconds. Check your connection and try again.');
  worker.onerror = () => { stop(); send('error', 'The Python runtime could not start. Check your connection and try again.'); };
  worker.onmessage = event => {
    const message = event.data;
    if (message.type === 'ready') { send('running', 'Running…'); timeout(5000, 'Execution exceeded 5 seconds and was stopped.'); worker.postMessage({type: 'run', code: pending, input: pendingInput}); }
    else if (message.type === 'output') {
      count += message.text.length;
      if (count > 20000) { stop(); send('error', 'Output exceeded 20,000 characters and execution was stopped.'); }
      else send('output', message.text);
    } else if (message.type === 'done' || message.type === 'error') { stop(); send(message.type, message.text || 'Execution complete.', message.elapsed); }
  };
  worker.postMessage({type: 'init'});
});
