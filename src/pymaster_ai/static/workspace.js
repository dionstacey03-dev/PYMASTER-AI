/* Separate workspace behavior; existing course and quiz logic remains intact. */
const workspace = document.getElementById('playground');
const editor = document.getElementById('python-editor');
const runtimeFrame = document.getElementById('runtime-frame');
const consoleOutput = document.getElementById('console-output');
const status = document.getElementById('execution-status');
let active = false;
function setActive(value) { active = value; document.getElementById('run-code').disabled=value; document.getElementById('stop-code').disabled=!value;document.getElementById('runtime-loading').hidden=!value; }
function draftKey() { return 'pymaster-code-' + current; }
function persistDraft() {
  try { localStorage.setItem(draftKey(),editor.value); document.getElementById('save-status').textContent='Draft saved on this device.'; }
  catch { document.getElementById('save-status').textContent='Browser storage unavailable. Download your code to keep it.'; }
}
function updateHighlight() {
  const escape = text => text.replace(/[&<>]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[char]));
  const pattern=/(#[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:def|class|return|if|else|elif|for|while|in|import|from|as|try|except|finally|with|async|await|yield|True|False|None|raise|pass|break|continue)\b|\b\d+(?:\.\d+)?\b)/g;
  let result='', previous=0;
  for (const match of editor.value.matchAll(pattern)) { result+=escape(editor.value.slice(previous,match.index)); const token=match[0];const cls=token.startsWith('#')?'comment':/^['"]/.test(token)?'string':/^\d/.test(token)?'numeric':'keyword';result+='<span class="'+cls+'">'+escape(token)+'</span>';previous=match.index+token.length; }
  document.getElementById('highlight').innerHTML=result+escape(editor.value.slice(previous))+'\n';
  document.getElementById('line-numbers').textContent=editor.value.split('\n').map((_,i)=>i+1).join('\n');
}
function loadWorkspace() {
  if (active) document.getElementById('stop-code').click();
  try { editor.value=localStorage.getItem(draftKey()) ?? lessons[current].code; }
  catch { editor.value=lessons[current].code; }
  consoleOutput.textContent='';status.textContent='Ready';document.getElementById('execution-time').textContent='';document.getElementById('save-status').textContent='Changes save automatically on this device.';updateHighlight();
}
editor.addEventListener('input',()=>{updateHighlight();persistDraft();});
editor.addEventListener('scroll',()=>{document.getElementById('highlight').scrollTop=editor.scrollTop;document.getElementById('highlight').scrollLeft=editor.scrollLeft;document.getElementById('line-numbers').scrollTop=editor.scrollTop;});
editor.addEventListener('keydown',event=>{
  if (event.key==='Tab'&&!event.shiftKey) {event.preventDefault();const start=editor.selectionStart;editor.setRangeText('    ',start,editor.selectionEnd,'end');editor.dispatchEvent(new Event('input'));}
  if ((event.ctrlKey || event.metaKey) && event.key==='Enter') {event.preventDefault();if(!active)document.getElementById('run-code').click();return;}
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase()==='s') {event.preventDefault();document.getElementById('save-code').click();return;}
  if (event.key==='Escape' && active) {event.preventDefault();document.getElementById('stop-code').click();return;}
  if (event.key==='Enter') { event.preventDefault();const before=editor.value.slice(0,editor.selectionStart);const line=before.split('\n').pop();const indent=(line.match(/^\s*/)||[''])[0]+(line.trimEnd().endsWith(':')?'    ':'');editor.setRangeText('\n'+indent,editor.selectionStart,editor.selectionEnd,'end');editor.dispatchEvent(new Event('input')); }
});
// Shift+Tab exits the editor for keyboard navigation.
document.getElementById('run-code').onclick=()=>{if(!editor.value.trim()){status.textContent='Enter some Python code first.';return;}consoleOutput.textContent='';setActive(true);runtimeFrame.contentWindow.postMessage({channel:'pymaster-runtime',type:'run',code:editor.value,input:document.getElementById('program-input').value},'*');};
document.getElementById('stop-code').onclick=()=>{runtimeFrame.contentWindow.postMessage({channel:'pymaster-runtime',type:'stop'},'*');setActive(false);status.textContent='Stopped';};
window.addEventListener('message',event=>{
  if(event.source!==runtimeFrame.contentWindow||event.data?.channel!=='pymaster-runtime')return;
  const {type,text,elapsed}=event.data;if(!active)return;
  if(Number.isFinite(elapsed))document.getElementById('execution-time').textContent='Python execution: '+(elapsed/1000).toFixed(3)+' s (excludes loading)';
  if(type==='output'){consoleOutput.textContent+=(text+'\n');}
  else{status.textContent=text;if(['done','error','stopped'].includes(type)){setActive(false);if(type==='error')consoleOutput.textContent+=text+'\n';}}
});
document.getElementById('reset-code').onclick=()=>{if(confirm('Replace this lesson draft with its original example?')){editor.value=lessons[current].code;updateHighlight();persistDraft();}};
document.getElementById('save-code').onclick=()=>download('lesson-'+(current+1)+'-draft.py',editor.value+'\n');
document.getElementById('copy-draft').onclick=async()=>{try{await navigator.clipboard.writeText(editor.value);status.textContent='Code copied.';}catch{status.textContent='Copy unavailable. Select your code and copy it manually.';}};
document.getElementById('clear-output').onclick=()=>{consoleOutput.textContent='';};
const originalRender=render;render=function(){originalRender();loadWorkspace();};
const originalDashboard=showDashboard;showDashboard=function(){if(active)document.getElementById('stop-code').click();originalDashboard();};
document.getElementById('dashboard-link').onclick=showDashboard;document.getElementById('back-dashboard').onclick=showDashboard;
const themeButton=document.getElementById('theme-toggle');
const themeMedia=window.matchMedia('(prefers-color-scheme: light)');
let preference='dark';
function theme(value){preference=['dark','light','system'].includes(value)?value:'dark';const resolved=preference==='system'?(themeMedia.matches?'light':'dark'):preference;document.documentElement.dataset.theme=resolved;themeButton.textContent=resolved==='light'?'Dark theme':'Light theme';themeButton.setAttribute('aria-pressed',String(resolved==='light'));document.getElementById('theme-select').value=preference;}
function saveTheme(value){theme(value);try{localStorage.setItem('pymaster-theme',preference);}catch{status.textContent='Theme will last for this session only.';}}
try{theme(localStorage.getItem('pymaster-theme')||'dark');}catch{theme('dark');}
themeButton.onclick=()=>saveTheme(document.documentElement.dataset.theme==='light'?'dark':'light');
document.getElementById('theme-select').onchange=event=>saveTheme(event.target.value);
themeMedia.addEventListener('change',()=>{if(preference==='system')theme('system');});
document.getElementById('mobile-dashboard').onclick=showDashboard;
document.getElementById('mobile-continue').onclick=()=>document.getElementById('continue').click();
document.getElementById('mobile-playground').onclick=()=>{if(document.getElementById('lesson-view').hidden)showLesson();workspace.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});};
document.getElementById('starter-template').onchange=event=>{const templates={example:lessons[current].code,blank:'# Write your Python here\n',input:'name = input("Your name: ")\nprint(f"Hello, {name}!")',loop:'for number in range(5):\n    print(number)',function:'def square(number):\n    return number * number\n\nprint(square(4))'};if(confirm('Replace this lesson draft with the selected template?')){editor.value=templates[event.target.value]||lessons[current].code;updateHighlight();persistDraft();}event.target.value='';};
loadWorkspace();

let learningLoad;
function loadLearningTools(){
 if(!learningLoad){const script=src=>new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.onload=resolve;el.onerror=()=>{el.remove();reject(new Error('Could not load learning tools. Check your connection and retry.'));};document.head.append(el);});learningLoad=script('/learning-core.js').then(()=>script('/learning-ui.js')).catch(error=>{learningLoad=null;throw error;});}
 return learningLoad;
}
async function openLearningTools(){const button=document.getElementById('learning-tools');button.disabled=true;try{await loadLearningTools();window.learningUI.show();}catch(error){document.getElementById('learning-load-error').textContent=error.message;}finally{button.disabled=false;}}
document.getElementById('learning-tools').onclick=openLearningTools;
document.getElementById('mobile-learning').onclick=openLearningTools;
document.getElementById('learning-back').onclick=showDashboard;
document.getElementById('show-hints').onclick=async()=>{try{await loadLearningTools();window.learningUI.showHints();}catch(error){document.getElementById('hint-status').textContent=error.message;}};
