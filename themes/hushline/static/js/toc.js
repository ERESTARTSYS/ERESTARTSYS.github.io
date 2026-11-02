const toc=document.querySelector('#toc-list');
if(toc){
  const used=new Set();
  document.querySelectorAll('.prose h1,.prose h2,.prose h3,.prose h4,.prose h5,.prose h6').forEach((heading,index)=>{
    if(!heading.id){let id='heading-'+(index+1);while(used.has(id)||document.getElementById(id))id+='-2';heading.id=id}
    used.add(heading.id);
    const item=document.createElement('li');item.className='toc-level-'+heading.tagName.slice(1);
    const link=document.createElement('a');link.href='#'+encodeURIComponent(heading.id);link.textContent=heading.textContent.trim();item.append(link);toc.append(item);
  });
  if(!toc.children.length)toc.closest('details').remove();
}

for(const pre of document.querySelectorAll('.prose pre')){
  const code=pre.querySelector('code');
  const lang=(pre.dataset.lang||code?.dataset.lang||'').trim();
  if(!lang||lang.toLowerCase()==='mermaid')continue;
  const badge=document.createElement('span');badge.className='code-language';badge.textContent=lang;
  pre.classList.add('has-code-language');pre.append(badge);
}
