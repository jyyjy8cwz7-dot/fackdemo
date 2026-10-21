// Fackappen v40 – ljud, kaptenen, regelrutor, lagring i telefonen (inget skickas till servern)
(function(){
var LS;try{LS=window.localStorage;LS.getItem('x')}catch(e){LS={getItem:function(){return null},setItem:function(){},removeItem:function(){}}}
window.LSx=LS;
function on(){return LS.getItem('ljud')!=='av'}
var VOL={oppning:.22,kapten:.35,notis:.3,skickat:.35,framme:.35,klart:.28,varning:.28,valkommen:.7},A={};
window.ljud=function(n){if(!on())return;try{var a=A[n]||(A[n]=new Audio('/fackdemo/demo/static/v40/ljud/'+n+'.mp3'));a.volume=VOL[n]||.3;a.currentTime=0;var p=a.play();if(p&&p.catch)p.catch(function(e){if(e&&e.name==='NotAllowedError')PEND={n:n,t:Date.now()}})}catch(e){}};
var PEND=null;function fg(){document.removeEventListener('pointerdown',fg,true);document.removeEventListener('keydown',fg,true);var q=PEND;PEND=null;if(q&&Date.now()-q.t<4000&&q.n!=='oppning')ljud(q.n)}document.addEventListener('pointerdown',fg,true);document.addEventListener('keydown',fg,true);
function mb(){[].forEach.call(document.querySelectorAll('.mute'),function(b){b.textContent=on()?'🔊':'🔇';b.setAttribute('aria-label',on()?'Ljud på. Tryck för att stänga av':'Ljud av. Tryck för att sätta på')})}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.mute');if(!b)return;LS.setItem('ljud',on()?'av':'pa');mb();ljud('notis')});
document.addEventListener('DOMContentLoaded',mb);mb();
window.idag=function(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
var K=["Felet sitter i systemet, inte i kollegan.","Efterlysning: syndabock sökes. Ingen har anmält sig. Felet sitter i bemanningen.","Meddelande till ledningen: bemanningen är försenad på obestämd tid. Personalen ombeds dokumentera.","Riskbedömningen har tyvärr inte checkat in. Senast sedd i en pärm hos ledningen.","Sista utrop för skuldbeläggning. Den avgår inte härifrån.","Turbulens i schemat? Spänn fast bältet och kör Schemakollen."];
window.kapten=function(txt){var t=document.createElement('div');t.className='toast';t.setAttribute('role','status');var i=+(LS.getItem('kix')||0);if(!txt){txt=K[i%K.length];LS.setItem('kix',i+1)}
t.innerHTML='<b>🔔 Kaptenen har ordet</b><span></span><button aria-label="Stäng">✕</button>';t.querySelector('span').textContent=txt;t.querySelector('button').onclick=function(){t.remove()};document.body.appendChild(t);ljud('kapten');setTimeout(function(){t.remove()},9000)};
window.kaptenIbland=function(){if(LS.getItem('kdag')===idag())return;if(Math.random()<.5){LS.setItem('kdag',idag());setTimeout(kapten,1600)}};
window.jget=function(k,d){try{var v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}};
window.jset=function(k,v){try{LS.setItem(k,JSON.stringify(v))}catch(e){}};
window.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
// Regelruta: R={nyckel:[rubrik, citat, fil, fras]}
window.regel=function(k,extra){var r=(window.R||{})[k];if(!r)return;var o=document.getElementById('ov');if(!o){o=document.createElement('div');o.id='ov';o.onclick=function(e){if(e.target===o||e.target.closest('.stang'))o.classList.remove('on')};document.body.appendChild(o)}
o.innerHTML='<div class="card" role="dialog" aria-modal="true">'+(extra?'<div style="font-weight:700">'+esc(extra)+'</div><hr style="border:0;border-top:2px solid #F3E3E6;width:100%">':'')+'<b>📖 '+esc(r[0])+'</b><div>'+esc(r[1])+'</div>'+(r[2]?'<a class="big" href="/fackdemo/demo/dokument.html'+encodeURIComponent(r[2])+'&p='+encodeURIComponent(r[3]||'')+'#hit">📄 Läs hela texten</a>':'')+'<button class="big p stang">Stäng</button></div>';o.classList.add('on')};
window.steg=function(id){[].forEach.call(document.querySelectorAll('.s'),function(s){s.classList.toggle('on',s.id===id)});window.scrollTo(0,0)};
})();
