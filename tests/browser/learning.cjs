const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const base=process.env.TEST_BASE_URL||'http://127.0.0.1:8000';
 try{
  await page.goto(base);
  assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').some(entry=>entry.name.includes('learning-core.js'))),false,'Learning module must be lazy');assert.ok(await page.evaluate(()=>performance.getEntriesByType('navigation')[0].encodedBodySize < 100 * 1024),'Initial HTML budget: 100 KiB');
  await page.evaluate(()=>{localStorage.setItem('pymaster-progress','[0]');localStorage.setItem('pymaster-code-0','print("existing draft")');});await page.reload();
  await page.locator('#learning-tools').click();await page.locator('#learning-title').waitFor({state:'visible'});
  assert.equal(await page.locator('#companion-opt-in').isChecked(),false);
  await page.locator('#roadmap-goal').selectOption('software');await page.locator('#roadmap-minutes').fill('15');await page.locator('#roadmap-form button[type=submit]').click();
  assert.match(await page.locator('#roadmap-result').innerText(),/29 lessons remaining/);
  assert.match(await page.locator('#roadmap-result').innerText(),/span multiple weeks/);
  assert.equal(await page.locator('.roadmap-week').count(),87);
  const exportPromise=page.waitForEvent('download');await page.locator('#export-roadmap').click();assert.equal((await exportPromise).suggestedFilename(),'pymaster-roadmap.json');
  await page.locator('#companion-opt-in').check();await page.locator('#companion-goal').fill('<img src=x onerror=alert(1)>');await page.locator('#companion-preference').fill('Use short examples');await page.locator('#companion-form button[type=submit]').click();
  assert.equal(await page.locator('#companion-visible img').count(),0);assert.match(await page.locator('#companion-visible').innerText(),/<img/);
  await page.reload();await page.locator('#learning-tools').click();await page.locator('#learning-title').waitFor({state:'visible'});
  assert.equal(await page.locator('#companion-goal').inputValue(),'<img src=x onerror=alert(1)>');assert.equal(await page.locator('#roadmap-minutes').inputValue(),'15');
  await page.locator('#delete-memory').click();assert.equal(await page.evaluate(()=>localStorage.getItem('pymaster-v3-companion')),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('pymaster-progress')),'[0]');assert.equal(await page.evaluate(()=>localStorage.getItem('pymaster-code-0')),'print("existing draft")');
  const comparisons=await page.evaluate(()=>PyMasterLearning.comparisons.map(item=>({id:item.id,answer:item.answer})));
  for(const item of comparisons){await page.locator('#comparison-select').selectOption(item.id);await page.locator(`#comparison-options input[value="${item.answer}"]`).check();await page.locator('#comparison-form button').click();assert.match(await page.locator('#comparison-feedback').innerText(),/^Correct/);}
  await page.locator('#learning-back').click();await page.locator('#lessons button').first().click();
  await page.locator('#options input[value="1"]').check();for(let i=0;i<2;i++)await page.locator('#quiz button[type=submit]').click();
  for(let i=0;i<5;i++)await page.locator('#show-hints').click();assert.equal(await page.locator('.hint-step').count(),5);
  assert.match(await page.locator('#hint-status').innerText(),/No points are deducted/);assert.match(await page.locator('#hint-status').innerText(),/missed this quiz at least twice/);
  await page.locator('#next').click();assert.equal(await page.locator('.hint-step').count(),0);await page.locator('#show-hints').click();assert.equal(await page.locator('.hint-step').count(),1);
  await page.locator('#learning-tools').click();
  for(const theme of ['dark','light']){await page.locator('#theme-select').selectOption(theme);for(const width of [320,375,390,430,768,1024,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${theme} ${width}`);}}
  await page.evaluate(()=>localStorage.setItem('pymaster-v3-companion',JSON.stringify({optIn:true,goal:'expired',preference:'old',retentionDays:7,updatedAt:Date.now()-9*86400000})));await page.reload();await page.locator('#learning-tools').click();await page.locator('#learning-title').waitFor({state:'visible'});assert.equal(await page.locator('#companion-opt-in').isChecked(),false);assert.equal(await page.evaluate(()=>localStorage.getItem('pymaster-v3-companion')),null);
  assert.deepEqual(errors,[]);
  await page.route('**/learning-ui.js',route=>route.abort());await page.reload();await page.locator('#learning-tools').click();await page.getByText('Could not load learning tools. Check your connection and retry.').waitFor();
  await page.unroute('**/learning-ui.js');await page.locator('#learning-tools').click();await page.locator('#learning-title').waitFor({state:'visible'});
  console.log('PASS: lazy loading, goal planning, budget splitting, roadmap export/restore, opt-in preference editing/deletion/expiry, safe rendering, legacy progress/draft preservation, eight comparisons, progressive hints/reset, seven-width dark/light layouts and network failure.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
