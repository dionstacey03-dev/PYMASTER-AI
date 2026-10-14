/* Run against a live server; see TESTING.md. No mocked Python responses. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {chromium} = require('playwright');
(async () => {
  const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
  const context = await browser.newContext();
  const cache = fs.mkdtempSync(path.join(os.tmpdir(),'pymaster-runtime-'));
  // Optional cloud test relay: curl uses the system CA trust store and verifies TLS.
  // It returns actual pinned runtime assets, never synthesized execution results.
  if (process.env.RUNTIME_TLS_RELAY === '1') {
    await context.route('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/**', async route => {
      const url = route.request().url();
      const name = new URL(url).pathname.split('/').pop();
      assert.match(name,/^[a-zA-Z0-9_.-]+$/);
      const file = path.join(cache,name);
      if (!fs.existsSync(file)) execFileSync('curl',['--fail','--silent','--show-error','--max-time','60',url,'-o',file]);
      await route.fulfill({status:200,body:fs.readFileSync(file),headers:{'access-control-allow-origin':'*','content-type':name.endsWith('.wasm')?'application/wasm':name.endsWith('.js')?'text/javascript':'application/octet-stream'}});
    });
  }
  const page = await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:8000';
  async function run(code, expected) {
    await page.locator('#python-editor').fill(code);
    await page.locator('#run-code').click();
    await page.waitForFunction(()=>!document.getElementById('run-code').disabled,null,{timeout:90000});
    assert.match(await page.locator('#console-output').innerText(),expected);
  }
  try {
    await page.goto(base);
    await page.locator('#continue').click();
    await run('print(2 + 3)',/5/);
    assert.match(await page.locator('#execution-time').innerText(), /Python execution: [0-9.]+ s/);
    await page.locator('#program-input').fill('Ada\n42');
    await run('name = input("Name: ")\nnumber = int(input("Number: "))\nprint(name, number + 1)', /Ada 43/);
    await page.locator('#program-input').fill('');
    await run('input("Missing: ")', /EOFError/);
    await run('print(',/SyntaxError/);
    await run('raise ValueError("Try again")',/ValueError: Try again/);
    await run('while True:\n    pass',/exceeded 5 seconds/);
    await run('print("x" * 21000)',/Output exceeded/);
    await run('from js import localStorage\nprint(localStorage)',/(ImportError|SecurityError)/);
    await run('from js import fetch\nawait fetch('+JSON.stringify(base+'/api/greet')+')',/(Failed to fetch|TypeError|NetworkError)/);
    await page.locator('#python-editor').fill('print("saved draft")');
    await page.locator('#next').click();await page.locator('#previous').click();
    assert.equal(await page.locator('#python-editor').inputValue(),'print("saved draft")');
    await page.reload();await page.locator('#continue').click();
    assert.equal(await page.locator('#python-editor').inputValue(),'print("saved draft")');
    await page.locator('#theme-toggle').click();await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    await page.locator('#theme-select').selectOption('system');
    await page.emulateMedia({colorScheme:'light'});
    assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    await page.emulateMedia({colorScheme:'dark'});
    await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
    await page.reload();assert.equal(await page.locator('#theme-select').inputValue(),'system');
    await page.locator('#continue').click();
    await page.locator('#python-editor').fill('if True:');await page.locator('#python-editor').press('End');await page.locator('#python-editor').press('Enter');
    assert.equal(await page.locator('#python-editor').inputValue(),'if True:\n    ');
    await page.locator('#python-editor').press('Shift+Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'python-editor');
    const downloadPromise=page.waitForEvent('download');await page.locator('#save-code').click();assert.match((await downloadPromise).suggestedFilename(),/draft.py$/);
    await page.locator('#run-code').click();await page.locator('#stop-code').click();assert.equal(await page.locator('#run-code').isDisabled(),false);
    await page.locator('#clear-output').click();assert.equal(await page.locator('#console-output').innerText(),'');
    page.on('dialog',dialog=>dialog.accept());await page.locator('#reset-code').click();assert.equal(await page.locator('#python-editor').inputValue(),'print("Hello, Python!")');
    for (const width of [320,375,390,430,768,1024,1440]) {await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
    await page.setViewportSize({width:390,height:900});
    await page.locator('#mobile-dashboard').click();assert.equal(await page.locator('#dashboard').isVisible(),true);
    await page.locator('#mobile-playground').click();assert.equal(await page.locator('#playground').isVisible(),true);
    page.on('dialog',()=>{});
    await page.locator('#starter-template').selectOption('function');
    assert.match(await page.locator('#python-editor').inputValue(), /def square/);
    await page.locator('#python-editor').fill('print("shortcut")');
    await page.locator('#python-editor').press('Control+Enter');
    await page.waitForFunction(()=>!document.getElementById('run-code').disabled,null,{timeout:90000});
    assert.match(await page.locator('#console-output').innerText(),/shortcut/);
    await page.locator('#mobile-dashboard').click();
    for (const width of [320,375,390,430,768,1024,1440]) {await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
    await page.locator('#continue').click();
    await context.route('https://cdn.jsdelivr.net/**',route=>route.abort());
    await run('print("offline")',/(could not|failed to load|NetworkError)/i);
    assert.deepEqual(errors,[]);
    console.log('PASS: execution, syntax/runtime errors, timeout, output limit, storage isolation, blocked app fetch, draft persistence, themes, indentation, keyboard exit, download, stop/reset/clear, system themes, input/EOF, timing, templates, keyboard shortcuts, mobile navigation, seven viewport layouts, network failure.');
  } finally {await browser.close();fs.rmSync(cache,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exit(1);});
