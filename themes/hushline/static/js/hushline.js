import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
const docs=[...document.querySelectorAll('pre[data-lang="mermaid"] code,pre code[data-lang="mermaid"]')];
for(const code of docs){const pre=code.parentElement;const wrap=document.createElement('div');wrap.className='mermaid-scroll'+(/\bgantt\b/.test(code.textContent)?' gantt':'')+(/\bmindmap\b/.test(code.textContent)?' mindmap':'');const node=document.createElement('div');node.className='mermaid';node.textContent=code.textContent;wrap.append(node);pre.replaceWith(wrap)}
const palette={darkMode:true,background:'#161b20',primaryColor:'#304252',primaryBorderColor:'#8fa6bb',primaryTextColor:'#f3f6f8',secondaryColor:'#263745',secondaryTextColor:'#f3f6f8',tertiaryColor:'#354653',tertiaryTextColor:'#f3f6f8',textColor:'#f3f6f8',nodeTextColor:'#f3f6f8',lineColor:'#a4b5c3',git0:'#405369',gitBranchLabel0:'#ffffff',sectionBkgColor:'#252f39',altSectionBkgColor:'#1d2731',sectionBkgColor2:'#303b46',sectionTitleColor:'#f3f6f8',gridColor:'#66727d',taskBkgColor:'#607f9b',taskBorderColor:'#c2d2df',taskTextColor:'#ffffff',taskTextDarkColor:'#ffffff',taskTextOutsideColor:'#e8eef3',activeTaskBkgColor:'#7194b3',activeTaskBorderColor:'#d0dfeb',doneTaskBkgColor:'#557563',doneTaskBorderColor:'#a9c4b1',critBkgColor:'#8d5d61',critBorderColor:'#d4aeb1',todayLineColor:'#e4a6a6',fontSize:'13px'};
for(let i=1;i<=11;i++){palette['cScale'+i]=['#405369','#425a66','#4a596c','#536275'][((i-1)%4)];palette['cScaleLabel'+i]='#ffffff'}
mermaid.initialize({startOnLoad:false,theme:'base',securityLevel:'strict',themeVariables:palette,mindmap:{colorBy:'depth'},gantt:{leftPadding:180,barHeight:20,barGap:9}});
if(document.querySelector('.mermaid'))mermaid.run({querySelector:'.mermaid'});
window.addEventListener('load',()=>{if(window.renderMathInElement)renderMathInElement(document.querySelector('.prose')||document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})});

for(const ref of document.querySelectorAll('.footnote-reference a[href^="#"]')){
  const target=document.getElementById(decodeURIComponent(ref.getAttribute('href').slice(1)));
  if(!target||target.querySelector('.footnote-backref'))continue;
  const id='footnote-ref-'+target.id;ref.parentElement.id=id;
  const back=document.createElement('a');back.className='footnote-backref';back.href='#'+id;back.textContent='↩';back.setAttribute('aria-label','Back to footnote reference');
  (target.querySelector('p')||target).append(back);
}
