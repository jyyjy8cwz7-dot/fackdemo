const tb=document.getElementById('tb');
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])}
function row(v){v=v||{};const tr=tb.insertRow();tr.innerHTML='<td><input type="date" class="d"></td><td><input type="time" class="s"></td><td><input type="time" class="e"></td><td><input type="number" min="0" step="5" class="b" style="width:80px"></td><td><button type="button" class="btn g x">'+esc(RM)+'</button></td>';
 tr.querySelector('.d').value=v.date||'';tr.querySelector('.s').value=v.start||'';tr.querySelector('.e').value=v.end||'';tr.querySelector('.b').value=(v.brk==null?30:v.brk);tr.querySelector('.x').onclick=()=>tr.remove();}
document.getElementById('add').onclick=()=>{const r=[...tb.querySelectorAll('.d')];let nd='';if(r.length&&r[r.length-1].value){const d=new Date(r[r.length-1].value+'T00:00Z');d.setUTCDate(d.getUTCDate()+1);nd=d.toISOString().slice(0,10)}row({date:nd})};
row();row();row();
document.getElementById('run').onclick=()=>{
 const sh=[...tb.rows].slice(1).map(tr=>({date:tr.querySelector('.d').value,start:tr.querySelector('.s').value,end:tr.querySelector('.e').value,brk:tr.querySelector('.b').value}));
 const res=SchemaCheck.check(sh,{notified:document.getElementById('nt').value,effective:document.getElementById('ef').value});
 let h='',seen={};
 for(const r of res){let t=TX[r.key]||r.key;for(const k in r.p)t=t.split('{'+k+'}').join(r.p[k]);
  h+='<div class="rule '+r.level+'"><div class="lv">'+esc(TX['lvl_'+r.level])+'</div><div>'+esc(t)+'</div>';
  if(RU[r.id]&&RU[r.id].length&&!seen[r.id]){seen[r.id]=1;h+='<details><summary class="meta">'+esc(RL)+'</summary>'+RU[r.id].map(x=>'<blockquote lang="sv" dir="ltr">”'+esc(x.q)+'”</blockquote><div class="meta">'+esc(SRC)+(x.sec?', '+esc(x.sec):'')+'</div>').join('')+'</details>'}
  h+='</div>'}
 document.getElementById('out').innerHTML=h;};
