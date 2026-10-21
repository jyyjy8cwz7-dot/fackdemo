/* Fackappen effekter p57: bilder visas ALLTID (även med Minska rörelse: lugnare variant), ljud bara om på. Ingen bakgrundsljud.
   p56: Egen kod, inga CDN. Ljud AV som standard (samma knapp 🔇/🔊, nyckel fack_snd).
   Allvarliga sidor laddar inte denna fil alls. Element inom [data-nofx] får inga effekter. */
(function(){
var P=(location.pathname.replace(/^\/fackdemo\/demo/,"").replace(/\.html$/,"").replace(/\/index$/,"/"))||"/",RM0=matchMedia("(prefers-reduced-motion: reduce)").matches,RM=false,BASE=(document.currentScript&&document.currentScript.src?document.currentScript.src.replace(/fx\.js.*$/,""):"/fackdemo/demo/static/v41/fx/"),C={};
if(RM0)document.documentElement.classList.add("fx-lugn");
function on(){try{return localStorage.getItem("fack_snd")==="1"}catch(e){return false}}
function snd(n,v,voice){if(!on())return null;try{var a=C[n]||(C[n]=new Audio(BASE+(voice?"rost/":"ljud/")+n+".mp3"));a=a.paused?a:a.cloneNode();a.volume=v==null?.5:v;a.currentTime=0;a.play().catch(function(){});return a}catch(e){return null}}
function layer(ms){var d=document.createElement("div");d.className="fxl";document.body.appendChild(d);setTimeout(function(){d.remove()},ms||2500);return d}
function tmp(el,ms){el.classList.add("fx-in");document.body.appendChild(el);setTimeout(function(){el.classList.add("fx-out")},ms-400);setTimeout(function(){el.remove()},ms);return el}
function nofx(t){return t&&t.closest&&t.closest("[data-nofx]")}
var FX={
 spara:function(){snd("bekrafta",.5);setTimeout(function(){snd("klocka",.25)},250);setTimeout(function(){snd("sparat",.6,1)},500);if(RM)return;
  var c=document.createElement("div");c.className="fx-card";c.innerHTML="<b>BOARDING</b><div>SPARAT ✓<small>Gate: din telefon · "+new Date().toTimeString().slice(0,5)+"</small></div>";tmp(c,2000)},
 skicka:function(){snd("skicka-svep",.5);if(RM)return;var b=document.createElement("div");b.className="fx-board";var s="SKICKAT ✈ AVGÅNG ",i=0;b.textContent="";tmp(b,2000);var t=setInterval(function(){b.textContent=s.slice(0,++i);if(i>=s.length)clearInterval(t)},45)},
 laddar:function(){if(RM)return;var L=layer(1800),bg=document.createElement("div");bg.className="fx-snowbg";L.appendChild(bg);for(var i=0;i<28;i++){var f=document.createElement("span");f.className="fx-snow";f.textContent="❄";f.style.left=Math.random()*100+"%";f.style.animationDuration=(1+Math.random()*.9)+"s";f.style.fontSize=(18+Math.random()*18)+"px";L.appendChild(f)}},
 varning:function(els){snd("varning",.55,1);if(RM)return;(els||[]).forEach(function(e){e.classList.remove("fx-blink");void e.offsetWidth;e.classList.add("fx-blink")})},
 sok:function(t){snd("rymdpip",.3);if(RM||!t)return;var r=t.getBoundingClientRect(),L=layer(2100),d=document.createElement("div");d.className="fx-radar";d.style.left=Math.max(0,r.right-130)+"px";d.style.top=(r.top+r.height/2-60)+"px";L.appendChild(d)},
 vunnet:function(){snd("drakvral",.5);setTimeout(function(){snd("fanfar-trumpet",.6)},900);if(RM)return;var L=layer(3200),d=document.createElement("div");d.className="fx-big";d.textContent="🐉";L.appendChild(d);
  d.animate([{transform:"translate(-50%,-50%) scale(.3)",opacity:0},{transform:"translate(-50%,-50%) scale(1)",opacity:1,offset:.25},{transform:"translate(-46%,-50%)",offset:.35},{transform:"translate(-54%,-50%)",offset:.45},{transform:"translate(-50%,10%) rotate(90deg)",opacity:0}],{duration:1400,fill:"forwards"});
  setTimeout(function(){var s=document.createElement("div");s.className="fx-big";s.textContent="🏆";s.style.fontSize="64px";L.appendChild(s);s.animate([{transform:"translate(-50%,-50%) scale(0)"},{transform:"translate(-50%,-50%) scale(1)"}],{duration:400,easing:"cubic-bezier(.3,1.6,.5,1)",fill:"forwards"});
   for(var i=0;i<26;i++){var c=document.createElement("i");c.className="fx-conf";c.style.background=["#ffd447","#2ee59d","#B02A43","#5fd3ff"][i%4];c.style.setProperty("--x",(Math.random()*360-180)+"px");c.style.setProperty("--y",(Math.random()*300-200)+"px");L.appendChild(c)}},1300)},
 signa:function(){snd("svardsklang-1",.5);setTimeout(function(){snd(Math.random()<.5?"fler":"tills",.6,1)},700);if(RM)return;var L=layer(1500),d=document.createElement("div");d.className="fx-big";d.textContent="⚔️";L.appendChild(d);d.animate([{transform:"translate(-50%,-50%) scale(.4) rotate(-30deg)",opacity:0},{transform:"translate(-50%,-50%) scale(1.1)",opacity:1},{transform:"translate(-50%,-50%) scale(1)",opacity:0}],{duration:1400,fill:"forwards"})},
 notis:function(){snd("notis-glas",.45)},
 tillbaka:function(){snd("backpip",.3)},
 fel:function(el){snd("fel-2",.45);if(RM||!el)return;el.classList.remove("fx-shake");void el.offsetWidth;el.classList.add("fx-shake")},
 is:function(t){snd("impact",.35);if(RM)return;var L=layer(1600),w=innerWidth,h=innerHeight,r=t&&t.getBoundingClientRect?t.getBoundingClientRect():{left:w/2,top:h/2,width:0,height:0},cx=r.left+r.width/2,cy=r.top+r.height/2,p="";
  for(var i=0;i<9;i++){var x=cx,y=cy,d="M"+x+" "+y,a=i/9*6.28;for(var k=1;k<5;k++){x+=Math.cos(a+(Math.random()-.5)*.6)*34;y+=Math.sin(a+(Math.random()-.5)*.6)*30;d+=" L"+x.toFixed(1)+" "+y.toFixed(1)}p+='<path d="'+d+'" stroke="#9fd8ff" stroke-width="2" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" to="0" dur=".35s" fill="freeze"/></path>'}
  L.innerHTML='<svg width="'+w+'" height="'+h+'" style="position:absolute;inset:0">'+p+'</svg>'},
 rond:function(){snd("bekrafta-2",.5);snd("spray",.2);if(RM)return;var l=document.createElement("div");l.className="fx-lamp";l.innerHTML="<i></i>DE-ICE COMPLETE · Skyddsrond klar";tmp(l,3000)},
 mungiga:function(){snd("mungiga",.6);if(RM)return;var L=layer(1600),d=document.createElement("div");d.className="fx-big";d.textContent="🤠";L.appendChild(d);d.animate([{transform:"translate(-50%,-50%) rotate(-12deg)"},{transform:"translate(-50%,-50%) rotate(12deg)"}],{duration:160,iterations:8,direction:"alternate"})}
};
window.fx=function(n,a){if(FX[n])try{FX[n](a)}catch(e){}};
/* sidbyte: 3D-kortvändning */
var M=document.querySelector("main")||document.querySelector(".st")||document.querySelector(".s.on")||document.body.firstElementChild;if(M){M.classList.add("fx-flip");try{if(sessionStorage.getItem("fx_seen"))snd("blad",.25);sessionStorage.setItem("fx_seen","1")}catch(e){}}
new MutationObserver(function(ms){ms.forEach(function(m){var t=m.target;if(t.classList&&t.classList.contains("s")&&t.classList.contains("on")&&!t._fl){t._fl=1;t.classList.remove("fx-flip");void t.offsetWidth;t.classList.add("fx-flip");setTimeout(function(){t._fl=0},500)}})}).observe(document.body,{subtree:true,attributes:true,attributeFilter:["class"]});
/* liten skylt: Effekter på */
(function(){var b=document.createElement("div");b.className="fx-badge";b.setAttribute("aria-hidden","true");b.textContent="✨ Effekter på";document.body.appendChild(b)})();
/* iOS: lås upp ljud vid första tryck */
document.addEventListener("touchend",function u(){document.removeEventListener("touchend",u,true);if(!on())return;try{var a=new Audio(BASE+"ljud/backpip.mp3");a.volume=0;a.play().catch(function(){})}catch(e){}},true);
/* ljud av/på */
var T=document.getElementById("sndt");if(T)T.addEventListener("click",function(){setTimeout(function(){if(on())snd("vaxla",.5);},30)});
/* klick: spara / skicka / tillbaka */
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("a,button,input[type=submit]");if(!t||nofx(t))return;var x=(t.textContent||t.value||"").trim().toLowerCase();
 if(t.classList.contains("bk")||/history\.back/.test(t.getAttribute("href")||"")||/^←|ångra/.test(x)){FX.tillbaka();return}
 if(t.id==="a55save")return; /* ärendetavlan sköter själv */
 if(/spara|sparat|💾/.test(x)&&!/spara fil/.test(x)){FX.spara();return}
 if(/skicka|dela|📨/.test(x)&&t.tagName==="BUTTON"){FX.skicka();return}},true);
/* formulär: laddar + fel */
document.addEventListener("submit",function(e){if(!nofx(e.target))FX.laddar()},true);
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
if(P==="/fackdemo/demo/ombud/skyddsombud.html")document.addEventListener("change",function(e){if(!/^r54_/.test(e.target.id||""))return;var a=document.querySelectorAll('input[id^="r54_"]');if(a.length&&Array.prototype.every.call(a,function(c){return c.checked}))FX.rond()});
/* ombud: inloggad -> "skriver på" (en gång per session) */
if(P==="/fackdemo/demo/ombud.html"){try{if(!sessionStorage.getItem("fx_sign")){sessionStorage.setItem("fx_sign","1");FX.signa()}}catch(e){}}
/* norrsken på startsidan (syns alltid) */
if(P==="/"){var a=document.createElement("div");a.className="fx-aur";a.setAttribute("aria-hidden","true");a.innerHTML="<i></i><i></i><i></i>";document.body.insertBefore(a,document.body.firstChild)}
/* ärendetavlan: deadline-varning */
if(P==="/fackdemo/demo/ombud/arenden.html"){var lst=document.getElementById("a55list"),warned=false;if(lst)new MutationObserver(function(){var w=lst.querySelectorAll(".a55c.w,.a55c.x");if(w.length&&!warned){warned=true;FX.varning(Array.prototype.slice.call(w))}}).observe(lst,{childList:true});
 setTimeout(function(){var w=lst&&lst.querySelectorAll(".a55c.w,.a55c.x");if(w&&w.length&&!warned){warned=true;FX.varning(Array.prototype.slice.call(w))}},300)}
})();
