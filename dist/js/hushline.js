import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
const docs=[...document.querySelectorAll('pre[data-lang="mermaid"] code,pre code[data-lang="mermaid"]')];
for(const code of docs){const pre=code.parentElement;const wrap=document.createElement('div');wrap.className='mermaid-scroll'+(/\bgantt\b/.test(code.textContent)?' gantt':'')+(/\bmindmap\b/.test(code.textContent)?' mindmap':'');const node=document.createElement('div');node.className='mermaid';node.dataset.source=code.textContent;wrap.append(node);pre.replaceWith(wrap)}
const appearance=window.matchMedia('(prefers-color-scheme: dark)');
function makePalette(dark){
  const p=dark?{background:'#161b20',primaryColor:'#304252',primaryBorderColor:'#8fa6bb',primaryTextColor:'#f3f6f8',secondaryColor:'#263745',secondaryTextColor:'#f3f6f8',tertiaryColor:'#354653',tertiaryTextColor:'#f3f6f8',textColor:'#f3f6f8',nodeTextColor:'#f3f6f8',lineColor:'#a4b5c3',git0:'#405369',gitBranchLabel0:'#ffffff',sectionBkgColor:'#252f39',altSectionBkgColor:'#1d2731',sectionBkgColor2:'#303b46',sectionTitleColor:'#f3f6f8',gridColor:'#66727d',taskBkgColor:'#607f9b',taskBorderColor:'#c2d2df',taskTextColor:'#ffffff',taskTextDarkColor:'#ffffff',taskTextOutsideColor:'#e8eef3',activeTaskBkgColor:'#7194b3',activeTaskBorderColor:'#d0dfeb',doneTaskBkgColor:'#557563',doneTaskBorderColor:'#a9c4b1',critBkgColor:'#8d5d61',critBorderColor:'#d4aeb1',todayLineColor:'#e4a6a6'}:{background:'#eee8d9',primaryColor:'#e1d9c8',primaryBorderColor:'#857b68',primaryTextColor:'#302d27',secondaryColor:'#ddd5c3',secondaryTextColor:'#302d27',tertiaryColor:'#d1c8b5',tertiaryTextColor:'#302d27',textColor:'#302d27',nodeTextColor:'#302d27',lineColor:'#716956',git0:'#cfc6b3',gitBranchLabel0:'#302d27',sectionBkgColor:'#e6dfcf',altSectionBkgColor:'#f4efdf',sectionBkgColor2:'#ddd5c3',sectionTitleColor:'#302d27',gridColor:'#aaa18f',taskBkgColor:'#91a3a2',taskBorderColor:'#536b69',taskTextColor:'#202820',taskTextDarkColor:'#202820',taskTextOutsideColor:'#302d27',activeTaskBkgColor:'#9eaf91',activeTaskBorderColor:'#657655',doneTaskBkgColor:'#a7b49d',doneTaskBorderColor:'#657655',critBkgColor:'#c28d7b',critBorderColor:'#8e5347',todayLineColor:'#a04e4e'};
  for(let i=1;i<=11;i++){p['cScale'+i]=(dark?['#405369','#425a66','#4a596c','#536275']:['#cfc6b3','#c5cfbd','#d8c9b9','#c5ced0'])[(i-1)%4];p['cScaleLabel'+i]=dark?'#ffffff':'#302d27'}
  p.fontSize='13px';return p;
}
async function renderMermaid(){
  const nodes=[...document.querySelectorAll('.mermaid[data-source]')];
  if(!nodes.length)return;
  nodes.forEach(n=>{n.removeAttribute('data-processed');n.replaceChildren();n.textContent=n.dataset.source});
  const dark=document.documentElement.dataset.theme==='dark';
  mermaid.initialize({startOnLoad:false,theme:'base',securityLevel:'strict',themeVariables:{darkMode:dark,...makePalette(dark)},mindmap:{colorBy:'depth'},gantt:{leftPadding:180,barHeight:20,barGap:9}});
  await mermaid.run({nodes});
}
const toggle=document.querySelector('.theme-switch');
function syncThemeButton(){if(toggle)toggle.textContent=document.documentElement.dataset.theme==='dark'?'change to light':'change to dark'}
function applyTheme(theme,save=false){document.documentElement.dataset.theme=theme;document.querySelector('meta[name=theme-color]')?.setAttribute('content',theme==='light'?'#f4efdf':'#0b0b0b');if(save){try{localStorage.setItem('hushline-theme',theme)}catch{}}syncThemeButton();renderMermaid()}
syncThemeButton();renderMermaid();
toggle?.addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark',true));
appearance.addEventListener('change',e=>{let saved=null;try{saved=localStorage.getItem('hushline-theme')}catch{}if(!saved)applyTheme(e.matches?'dark':'light')});
window.addEventListener('load',()=>{if(window.renderMathInElement)renderMathInElement(document.querySelector('.prose')||document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})});

for(const ref of document.querySelectorAll('.footnote-reference a[href^="#"]')){
  const target=document.getElementById(decodeURIComponent(ref.getAttribute('href').slice(1)));
  if(!target||target.querySelector('.footnote-backref'))continue;
  const id='footnote-ref-'+target.id;ref.parentElement.id=id;
  const back=document.createElement('a');back.className='footnote-backref';back.href='#'+id;back.textContent='↩︎';back.setAttribute('aria-label','Back to footnote reference');
  (target.querySelector('p')||target).append(back);
}
