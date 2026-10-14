const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const page=await browser.newPage();
 try{
  await page.goto(process.env.TEST_BASE_URL||'http://127.0.0.1:8000');
  for(const theme of ['dark','light']){
   await page.locator('#theme-select').selectOption(theme);
   for(const width of [320,375,390,430,768,1024,1440]){
    await page.setViewportSize({width,height:900});
    await page.locator('#dashboard-link').click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`dashboard ${theme} ${width}`);
    await page.locator('#continue').click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`lesson ${theme} ${width}`);
    assert.equal(await page.locator('#python-editor').getAttribute('aria-label'),'Python code editor');
    assert.equal(await page.locator('#program-input').evaluate(el=>el.labels.length),1);
   }
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('#runtime-loading').evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.equal(await page.locator('#course-progress-ring').getAttribute('aria-label'),'Course progress 0 percent');
  console.log('PASS: dark/light dashboard and lesson layouts at seven widths, editor/input labels, reduced-motion loading indicator and progress ring accessibility.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
