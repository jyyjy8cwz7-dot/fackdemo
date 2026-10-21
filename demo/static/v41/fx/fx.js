/* Fackappen effekter p57: bilder visas ALLTID (även med Minska rörelse: lugnare variant), ljud bara om på. Ingen bakgrundsljud.
   p56: Egen kod, inga CDN. Ljud AV som standard (samma knapp 🔇/🔊, nyckel fack_snd).
   Allvarliga sidor laddar inte denna fil alls. Element inom [data-nofx] får inga effekter. */
(function(){
var P=(location.pathname.replace(/^\/fackdemo\/demo/,"").replace(/\.html$/,"").replace(/\/index$/,"/"))||"/",RM0=false,RM=false,BASE=(document.currentScript&&document.currentScript.src?document.currentScript.src.replace(/fx\.js.*$/,""):"/fackdemo/demo/static/v41/fx/"),C={};
if(RM0)document.documentElement.classList.add("fx-lugn");
var LS;try{LS=window.localStorage;LS.getItem("x")}catch(e){LS={getItem:function(){return null},setItem:function(){}}}
var SND=window.SND=window.SND||(function(){var AC=null,M=null,B={},L={},last={},G=0;
 function on(){return LS.getItem('fack_snd')==='1'}
 function ctx(){if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();M=AC.createGain();M.connect(AC.destination)}return AC}
 function unlock(){var c=ctx();if(!c)return;if(c.state!=='running')c.resume();try{var b=c.createBuffer(1,1,22050),s=c.createBufferSource();s.buffer=b;s.connect(c.destination);s.start(0)}catch(e){}}
 ['pointerdown','touchend','keydown'].forEach(function(ev){document.addEventListener(ev,function(){G=Date.now();if(on())unlock()},true)});
 function load(u){if(B[u])return Promise.resolve(B[u]);if(L[u])return L[u];L[u]=fetch(u).then(function(r){return r.arrayBuffer()}).then(function(a){return new Promise(function(ok,no){ctx().decodeAudioData(a,ok,no)})}).then(function(b){B[u]=b;return b});L[u].catch(function(){delete L[u]});return L[u]}
 function play(u,v){if(!on()||Date.now()-G>1500)return;var c=ctx();if(!c)return;var now=Date.now();if(last[u]&&now-last[u]<180)return;last[u]=now;
  var ready=c.state==='running'?Promise.resolve():c.resume();
  Promise.all([ready,load(u)]).then(function(r){var b=r[1];if(!on()||c.state!=='running'||Date.now()-now>1500)return;var s=c.createBufferSource(),g=c.createGain();g.gain.value=v==null?.5:v;s.buffer=b;s.connect(g);g.connect(M);s.start(0)}).catch(function(){})}
 function pre(u){if(on()&&ctx())load(u).catch(function(){})}
 return{on:on,set:function(b){LS.setItem('fack_snd',b?'1':'0');if(b)unlock()},play:play,pre:pre,unlock:unlock}})();
function on(){return window.SND?SND.on():false}
function snd(n,v,voice){if(window.SND)SND.play(BASE+(voice?"rost/":"ljud/")+n+".mp3",v==null?.5:v);return null}
function layer(ms){var d=document.createElement("div");d.className="fxl";document.body.appendChild(d);setTimeout(function(){d.remove()},ms||2500);return d}
function tmp(el,ms){el.classList.add("fx-in");document.body.appendChild(el);setTimeout(function(){el.classList.add("fx-out")},ms-400);setTimeout(function(){el.remove()},ms);return el}
function nofx(t){return t&&t.closest&&t.closest("[data-nofx]")}
/* p58: VISUELLA effekter = exakt Lab 3 Effektkarta (lab3/karta) – GSAP lokalt (vendor), inga CDN. Ljuden oförändrade. */
var G=null,Q=[];function gs(f){if(window.gsap){G=window.gsap;f();return}Q.push(f);if(Q.length>1)return;var sc=document.createElement("script");sc.src=BASE.replace(/v41\/fx\/$/,"vendor/")+"gsap.min.js?v=202610220130";sc.onload=function(){G=window.gsap;var q=Q;Q=[];q.forEach(function(x){try{x()}catch(e){}})};document.head.appendChild(sc)}
var NS="http://www.w3.org/2000/svg";
function lay(t,pad,z){pad=pad||0;var r=t.getBoundingClientRect();var d=document.createElement("div");d.style.cssText="position:fixed;left:"+(r.left-pad)+"px;top:"+(r.top-pad)+"px;width:"+(r.width+pad*2)+"px;height:"+(r.height+pad*2)+"px;pointer-events:none;z-index:"+(z||9000)+";overflow:visible";document.body.appendChild(d);d.r=r;return d}
function svg(w,h,inner,css){return '<svg xmlns="'+NS+'" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" style="overflow:visible;'+(css||"")+'">'+inner+'</svg>'}
function done(d,t){G.delayedCall(t||0,function(){d.remove()})}
function tgt(t){if(t&&t.getBoundingClientRect&&t.getBoundingClientRect().width)return t;var c=document.getElementById("fxctr");if(!c){c=document.createElement("div");c.id="fxctr";c.style.cssText="position:fixed;left:50%;top:42%;width:min(340px,86vw);height:120px;transform:translate(-50%,-50%);pointer-events:none;visibility:hidden";document.body.appendChild(c)}return c}
function el(css,html){var d=document.createElement("div");d.style.cssText="position:fixed;pointer-events:none;z-index:9000;"+css;d.innerHTML=html||"";document.body.appendChild(d);return d}
function buzz(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
var V={
 boarding:function(){var d=el('left:50%;top:40%;width:280px;transform:translate(-50%,-50%);background:#fff;color:#111;border-radius:16px;padding:14px 18px;font:600 14px system-ui;box-shadow:0 20px 50px #0008','<div style="display:flex;justify-content:space-between"><b>BOARDING PASS</b><span>✈️</span></div><div style="font:900 30px system-ui;margin:6px 0">ARN → FACKET</div><div>Gate: § 1 · Plats: 1A · Status: <b style="color:#1b7f4a">SPARAT</b></div><div style="border-top:2px dashed #ccc;margin-top:10px;padding-top:6px;letter-spacing:4px">▌▌ ▌▌▌ ▌ ▌▌ ▌▌▌▌ ▌</div>');G.fromTo(d,{y:300,rotation:8},{y:0,rotation:-3,duration:.6,ease:'back.out(1.5)'});G.to(d,{x:500,rotation:20,delay:1.6,duration:.5,ease:'power2.in',onComplete:function(){d.remove()}})},
 tavla:function(){var txt='SKICKAT  ✓',d=el('left:50%;top:38%;transform:translate(-50%,-50%);display:flex;gap:3px;background:#111;padding:10px;border-radius:10px;box-shadow:0 10px 40px #000a');txt.split("").forEach(function(c,i){var t=document.createElement('span');t.style.cssText='display:inline-block;width:26px;height:40px;background:#222;color:#ffd447;font:800 28px ui-monospace,monospace;text-align:center;line-height:40px;border-radius:4px';t.textContent=' ';d.appendChild(t);var n=0;var iv=setInterval(function(){t.textContent='ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.random()*26|0];if(++n>6+i*2){clearInterval(iv);t.textContent=c}},45)});G.to(d,{opacity:0,delay:2.3,duration:.4,onComplete:function(){d.remove()}})},
 ram:function(){var d=el('inset:8px;border:6px solid #ff3a1f;border-radius:30px;box-shadow:0 0 30px #ff3a1f,inset 0 0 30px #ff3a1f');G.fromTo(d,{opacity:0},{opacity:1,duration:.2,repeat:9,yoyo:true,onComplete:function(){d.remove()}});buzz([60,60,60])},
 vand:function(m){if(!m)return;G.fromTo(m,{rotationY:-90,transformPerspective:1200},{rotationY:0,duration:.45,ease:'back.out(1.4)',clearProps:'transform'})},
 vandHel:function(m){G.timeline().to(m,{rotationY:90,transformPerspective:1200,duration:.35,ease:'power2.in'}).fromTo(m,{rotationY:-90},{rotationY:0,duration:.45,ease:'back.out(1.4)',clearProps:'transform'})},
 snow:function(t){var L=lay(t);L.style.overflow='hidden';L.style.borderRadius='18px';var fl='<path d="M10 0v20M0 10h20M3 3l14 14M17 3L3 17" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>';
  for(var i=0;i<22;i++){var f=document.createElement('div');f.innerHTML=svg(20,20,fl);var s=.4+Math.random()*.7;f.style.cssText='position:absolute;left:'+(Math.random()*100)+'%;top:-24px;opacity:.9';L.appendChild(f);G.fromTo(f,{y:0,rotation:0,scale:s},{y:L.r.height+40,x:'+='+(Math.random()*40-20),rotation:180,duration:1.6+Math.random()*1.2,delay:Math.random()*1.2,ease:'none'})}
  var sp=document.createElement('div');sp.style.cssText='position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px;border:3px solid #ffffff44;border-top-color:#bfe9ff;border-radius:50%';L.appendChild(sp);G.to(sp,{rotation:720,duration:2.8,ease:'none'});G.to(L,{opacity:0,delay:3,duration:.4,onComplete:function(){L.remove()}})},
 radar:function(t){var L=lay(t);var s=Math.min(L.r.height*1.4,140);var r=document.createElement('div');r.style.cssText='position:absolute;left:'+(L.r.width-s*.8)+'px;top:'+(L.r.height/2-s/2)+'px;width:'+s+'px;height:'+s+'px;border-radius:50%;background:radial-gradient(circle,#06281a 0,#03140d 70%);border:2px solid #2ee59d88;box-shadow:0 0 20px #2ee59d44;overflow:hidden';
  r.innerHTML='<div class=sw style="position:absolute;inset:0;background:conic-gradient(from 0deg,#2ee59d00 0deg,#2ee59d00 300deg,#2ee59daa 360deg);border-radius:50%"></div>'+svg(s,s,'<circle cx="'+s/2+'" cy="'+s/2+'" r="'+s*.3+'" stroke="#2ee59d44" fill="none"/><circle cx="'+s/2+'" cy="'+s/2+'" r="'+s*.15+'" stroke="#2ee59d44" fill="none"/><line x1="0" y1="'+s/2+'" x2="'+s+'" y2="'+s/2+'" stroke="#2ee59d33"/><line x1="'+s/2+'" y1="0" x2="'+s/2+'" y2="'+s+'" stroke="#2ee59d33"/>','position:absolute;inset:0');L.appendChild(r);
  for(var i=0;i<4;i++){var b=document.createElement('i');var a=Math.random()*6.28,d=Math.random()*s*.38;b.style.cssText='position:absolute;left:'+(s/2+Math.cos(a)*d-3)+'px;top:'+(s/2+Math.sin(a)*d-3)+'px;width:6px;height:6px;border-radius:50%;background:#7dffc4;box-shadow:0 0 8px #7dffc4;opacity:0';r.appendChild(b);G.to(b,{opacity:1,duration:.1,delay:.3+i*.35,yoyo:true,repeat:1,repeatDelay:.4})}
  G.from(r,{scale:0,duration:.35,ease:'back.out(2)'});G.to(r.querySelector('.sw'),{rotation:720,duration:2.2,ease:'none'});G.to(r,{scale:0,opacity:0,duration:.3,delay:2.3,onComplete:function(){L.remove()}})},
 drake:function(t){var L=lay(t);var d=document.createElement('div');d.textContent='🐉';d.style.cssText='position:absolute;right:10px;top:-40px;font-size:54px';L.appendChild(d);G.timeline().fromTo(d,{scale:.3,opacity:0},{scale:1,opacity:1,duration:.3,ease:'back.out(2)'}).to(d,{x:-4,duration:.05,repeat:7,yoyo:true}).to(d,{y:60,rotation:90,opacity:0,duration:.5,ease:'power2.in'}).add(function(){for(var i=0;i<18;i++){var s=document.createElement('div');s.textContent=['⭐','✨','§'][i%3];s.style.cssText='position:absolute;left:50%;top:40%;font:900 20px system-ui;color:#ffd54a';L.appendChild(s);G.to(s,{x:(Math.random()-.5)*260,y:(Math.random()-.8)*140,opacity:0,duration:1,ease:'power2.out'})}var w=document.createElement('b');w.textContent='Tillsammans är vi starka!';w.style.cssText='position:absolute;left:0;right:0;top:-34px;text-align:center;font:900 18px system-ui;color:#ffd54a';L.appendChild(w);G.fromTo(w,{scale:.5,opacity:0},{scale:1,opacity:1,duration:.4,ease:'back.out(2)'})});done(L,2.6)},
 is:function(t){var L=lay(t);var w=L.r.width,h=L.r.height,cx=w*.55,cy=h*.5,p='';for(var i=0;i<9;i++){var x=cx,y=cy,d='M'+x+' '+y;var a=i/9*6.28;for(var k=1;k<5;k++){x+=Math.cos(a+(Math.random()-.5)*.6)*w*.09;y+=Math.sin(a+(Math.random()-.5)*.6)*h*.18;d+=' L'+x.toFixed(1)+' '+y.toFixed(1)}p+='<path d="'+d+'" stroke="#e8f7ff" stroke-width="1.6" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>'}
  L.innerHTML='<div style="position:absolute;inset:0;border-radius:18px;background:linear-gradient(135deg,#bfe9ff55,#ffffff22)"></div>'+svg(w,h,p,'position:absolute;inset:0');G.to(L.querySelectorAll('path'),{strokeDashoffset:0,duration:.35,stagger:.03,ease:'power2.out'});
  G.to(L,{opacity:0,y:8,duration:.5,delay:1.1,onComplete:function(){L.remove()}});if(t.id!=="fxctr")G.fromTo(t,{x:-2},{x:0,duration:.3,ease:'elastic.out(1,.2)'})},
 lampa:function(t){var L=lay(t);var lp=document.createElement('div');lp.innerHTML='<div style="display:flex;align-items:center;gap:10px;background:#0c1a12ee;border:1px solid #2ee59d66;border-radius:999px;padding:8px 14px 8px 8px;font:800 14px system-ui;color:#d9ffe9"><i style="width:22px;height:22px;border-radius:50%;background:#2ee59d;box-shadow:0 0 0 0 #2ee59d"></i>DE-ICE COMPLETE</div>';lp.style.cssText='position:absolute;left:50%;top:-18px;transform:translateX(-50%)';L.appendChild(lp);
  var i=lp.querySelector('i');G.timeline({onComplete:function(){done(L,1)}}).from(lp,{y:12,opacity:0,duration:.35,ease:'back.out(2)'}).fromTo(i,{background:'#333'},{background:'#2ee59d',duration:.15}).to(i,{boxShadow:'0 0 0 10px #2ee59d00',duration:.7,repeat:1}).to(lp,{opacity:0,duration:.3,delay:.4})},
 puls:function(t){if(t)G.fromTo(t,{scale:1},{scale:1.08,duration:.15,yoyo:true,repeat:1})},
 hopp:function(t){if(t)G.fromTo(t,{y:0},{y:-6,duration:.12,yoyo:true,repeat:3})},
 bak:function(t){if(t)G.fromTo(t,{x:0},{x:-20,duration:.25,yoyo:true,repeat:1})},
 skak:function(t){if(t)G.fromTo(t,{x:-8},{x:0,duration:.5,ease:'elastic.out(3,.2)'})}
};
function vis(fn,a){if(RM0)return;gs(function(){fn(a)})}
var FX={
 spara:function(){snd("bekrafta",.5);setTimeout(function(){snd("klocka",.25)},250);setTimeout(function(){snd("sparat",.6,1)},500);vis(V.boarding)},
 skicka:function(){snd("skicka-svep",.5);vis(V.tavla)},
 laddar:function(t){vis(function(){V.snow(tgt(t))})},
 varning:function(){snd("varning",.55,1);vis(V.ram)},
 sok:function(t){snd("rymdpip",.3);vis(function(){V.radar(tgt(t))})},
 vunnet:function(t){snd("drakvral",.5);setTimeout(function(){snd("fanfar-trumpet",.6)},900);vis(function(){V.drake(tgt(t))})},
 signa:function(t){snd("svardsklang-1",.5);setTimeout(function(){snd(Math.random()<.5?"fler":"tills",.6,1)},700);vis(function(){V.puls(t||document.querySelector("h1"))})},
 notis:function(t){snd("notis-glas",.45);vis(function(){V.hopp(t)})},
 tillbaka:function(t){snd("backpip",.3);vis(function(){V.bak(t)})},
 fel:function(el){snd("fel-2",.45);vis(function(){V.skak(el)})},
 is:function(t){snd("impact",.35);vis(function(){V.is(tgt(t&&t.closest?(t.closest("label,.card,li")||t):t))})},
 rond:function(t){snd("bekrafta-2",.5);snd("spray",.2);vis(function(){V.lampa(tgt(t))})},
 mungiga:function(){snd("mungiga",.6)},
 vand:function(m){vis(function(){V.vandHel(m||document.querySelector("main")||document.body.firstElementChild)})}
};
window.fx=function(n,a){if(FX[n])try{FX[n](a)}catch(e){}};
/* sidbyte: 3D-kortvändning */
var M=document.querySelector("main")||document.querySelector(".st")||document.querySelector(".s.on")||document.body.firstElementChild;if(M&&P!=="/"){vis(function(){V.vand(M)});try{if(sessionStorage.getItem("fx_seen"))snd("blad",.25);sessionStorage.setItem("fx_seen","1")}catch(e){}}
new MutationObserver(function(ms){ms.forEach(function(m){var t=m.target;if(t.classList&&t.classList.contains("s")&&t.classList.contains("on")&&!t._fl){t._fl=1;vis(function(){V.vand(t)});setTimeout(function(){t._fl=0},500)}})}).observe(document.body,{subtree:true,attributes:true,attributeFilter:["class"]});
/* liten skylt: Effekter på */
(function(){return;var b=document.createElement("div");b.className="fx-badge";b.setAttribute("aria-hidden","true");b.textContent="✨ Effekter på";document.body.appendChild(b)})();
/* ljud av/på */
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("#sndt,.mute"))setTimeout(function(){if(on()){SND.unlock();snd("vaxla",.5)}},30)},true);
/* klick: spara / skicka / tillbaka */
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("a,button,input[type=submit]");if(!t||nofx(t))return;var x=(t.textContent||t.value||"").trim().toLowerCase();
 if(t.classList.contains("bk")||/history\.back/.test(t.getAttribute("href")||"")||/^←|ångra/.test(x)){FX.tillbaka(t);return}
 if(t.id==="a55save")return; /* ärendetavlan sköter själv */
 if(/spara|sparat|💾/.test(x)&&!/spara fil/.test(x)){FX.spara();return}
 if(/skicka|dela|📨/.test(x)&&t.tagName==="BUTTON"){FX.skicka();return}},true);
/* formulär: laddar + fel */
document.addEventListener("submit",function(e){if(!nofx(e.target))FX.laddar(e.target)},true);
document.addEventListener("invalid",function(e){if(nofx(e.target))return;var now=Date.now();if(now-(FX._fe||0)>600){FX._fe=now;FX.fel(e.target.closest("form")||e.target)}},true);
/* sök */
var sq=document.querySelectorAll('input[type=search],input[name=q],#a55q');sq.forEach(function(i){i.addEventListener("focus",function(){FX.sok(i)})});
document.addEventListener("submit",function(e){if(e.target.querySelector&&e.target.querySelector("input[name=q]"))FX.sok(e.target.querySelector("input[name=q]"))});
/* notiser (toasts) */
new MutationObserver(function(ms){ms.forEach(function(m){var t=m.target;if(t.classList&&t.classList.contains("toast")&&t.classList.contains("show")&&!t._fx){t._fx=1;FX.notis();setTimeout(function(){t._fx=0},800)}})}).observe(document.body,{subtree:true,attributes:true,attributeFilter:["class"]});
/* mungiga: tryck 5 gånger på Seko-loggan */
var lg=document.querySelector(".logos img"),n=0,lt=0;if(lg)lg.addEventListener("click",function(){var t=Date.now();n=t-lt<900?n+1:1;lt=t;if(n>=5){n=0;FX.mungiga()}});
/* brister: is spricker när en brist kryssas */
if(P==="/fackdemo/demo/n/brister.html")document.addEventListener("change",function(e){var t=e.target;if(t.type==="checkbox"&&t.checked&&!nofx(t))FX.is(t)});
/* skyddsrond klar */
if(P==="/fackdemo/demo/ombud/skyddsombud.html")document.addEventListener("change",function(e){if(!/^r54_/.test(e.target.id||""))return;var a=document.querySelectorAll('input[id^="r54_"]');if(a.length&&Array.prototype.every.call(a,function(c){return c.checked}))FX.rond(e.target.closest("label,.card")||e.target)});
/* ombud: inloggad -> "skriver på" (en gång per session) */
if(P==="/fackdemo/demo/ombud.html"){try{if(!sessionStorage.getItem("fx_sign")){sessionStorage.setItem("fx_sign","1");FX.signa()}}catch(e){}}
/* norrsken på startsidan (syns alltid) */
if(false){var a=document.createElement("div");a.className="fx-aur";a.setAttribute("aria-hidden","true");a.innerHTML="<i></i><i></i><i></i>";document.body.insertBefore(a,document.body.firstChild)}
/* ärendetavlan: deadline-varning */
if(P==="/fackdemo/demo/ombud/arenden.html"){var lst=document.getElementById("a55list"),warned=false;if(lst)new MutationObserver(function(){var w=lst.querySelectorAll(".a55c.w,.a55c.x");if(w.length&&!warned){warned=true;FX.varning(Array.prototype.slice.call(w))}}).observe(lst,{childList:true});
 setTimeout(function(){var w=lst&&lst.querySelectorAll(".a55c.w,.a55c.x");if(w&&w.length&&!warned){warned=true;FX.varning(Array.prototype.slice.call(w))}},300)}
})();
