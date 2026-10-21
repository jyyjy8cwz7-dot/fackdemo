(function(){
// Testsida: lägger till Filma-knapp bredvid Foto. Inget laddas upp.
var P=window.__P||"/";
function add(){var f=document.querySelectorAll('a[href*="/n/foto.html"]');f.forEach(function(a){if(a.dataset.fm)return;a.dataset.fm=1;var b=a.cloneNode(false);b.removeAttribute('id');b.href="/fackdemo/demo/n/filma.html";b.textContent="🎥 Filma";b.dataset.fm=1;a.parentNode.insertBefore(b,a.nextSibling);var pn=a.parentNode;if(getComputedStyle(pn).display!=="flex"){b.style.display="block";b.style.marginTop="8px"}else{pn.style.flexWrap="nowrap";Array.prototype.forEach.call(pn.children,function(x){x.style.fontSize="16px";x.style.padding="12px 4px";x.style.minWidth="0";x.style.lineHeight="1.15"})}})}
if(P.indexOf("/n/rapportera")===0||P==="/")add();

window.__PG=function(){return PG.map(function(p){return p.map(function(u){var r=u.getBoundingClientRect();return u.tagName+"."+u.className+" h"+Math.round(u.offsetHeight)})})};})();
(function(){var s=document.createElement("style");s.textContent=".tile{min-height:clamp(60px,9.5dvh,112px)!important}.grid{gap:1dvh 10px!important}.a55t button{color:#1E2A38}.a55t button.on{color:#fff}body.fit .st>*{min-height:0!important;flex-shrink:1!important}body.fit .doc span{font-size:15px!important;line-height:1.2!important}body.fit .st{padding-bottom:22px!important}body.fit a.doc[href$=\"beratta.html\"]{flex:0 0 auto!important;padding:10px!important;font-size:18px!important}body.fit .doc b{font-size:clamp(20px,3.4dvh,32px)!important}body.fit .g6 .t{min-height:0!important}";document.head.appendChild(s)})();
/* Sidbläddrare: delar upp innehåll som inte får plats i skärmbitar med stora knappar. Ingen scroll. */
(function(){
var NAV=null,U=[],PG=[],cur=0,busy=false,SPL=[],FB=0,CT=[];
function vis(e){if(!(e instanceof HTMLElement))return false;if(/^(SCRIPT|STYLE|LINK|META|TEMPLATE)$/.test(e.tagName))return false;if(e.id==="testband"||e===NAV||/(^|\s)(intro|wel|toast|fxl)(\s|$)/.test(e.className))return false;var s=getComputedStyle(e);if(s.display==="none"||s.position==="fixed")return false;return true}
function over(){var d=document.scrollingElement||document.documentElement,L=innerHeight-(document.body.classList.contains("pgon")&&NAV?NAV.offsetHeight+22:0);return d.scrollHeight>L+1}
function units(el,av,out){Array.prototype.forEach.call(el.children,function(c){if(!vis(c))return;var kids=Array.prototype.filter.call(c.children,vis);if((c.offsetHeight>av*0.85||SPL.indexOf(c)>=0)&&kids.length>1&&!/^(svg|video|canvas|textarea|select|button|a)$/i.test(c.tagName)){CT.push(c);units(c,av,out)}else out.push(c)})}
function sync(){for(var i=CT.length-1;i>=0;i--){var c=CT[i],any=U.some(function(u){return c.contains(u)&&u.style.display!=="none"});if(any)show(c);else hide(c)}}
function reset(){CT.forEach(function(c){c.style.display=c.dataset.pd||"";delete c.dataset.pd});CT=[];U.forEach(function(u){u.style.display=u.dataset.pd||"";delete u.dataset.pd});U=[];PG=[];if(NAV)NAV.style.display="none";document.body.classList.remove("pgon")}
function hide(u){if(u.dataset.pd===undefined)u.dataset.pd=u.style.display;u.style.display="none"}
function show(u){u.style.display=u.dataset.pd||""}
function build(){if(busy||document.body.classList.contains("fit")||/nopg/.test(location.search))return;busy=true;reset();SPL=[];if(!over()){busy=false;return}
 for(var k=0;k<6;k++){if(!pass())break}if(PG.length>1&&NAV.style.display!=="none")go(Math.min(cur,PG.length-1));busy=false}
function fixedBottom(){var m=0;document.querySelectorAll("body *").forEach(function(e){if(e===NAV||e.id==="testband"||(NAV&&NAV.contains(e)))return;var s=getComputedStyle(e);if(s.position!=="fixed"||s.display==="none")return;var r=e.getBoundingClientRect();if(r.height&&r.height<160&&r.bottom>=innerHeight-30&&r.width>innerWidth*0.5)m=Math.max(m,innerHeight-r.top)});return m}
function pass(){reset();
 mk();FB=fixedBottom();NAV.style.bottom=(FB?FB:22)+"px";NAV.style.display="flex";document.body.classList.add("pgon");
 var av=innerHeight-NAV.offsetHeight-(FB||22);var root=document.body;units(root,av,U);U=U.filter(function(u){var r=u.getBoundingClientRect();return !(r.top<130&&r.height<130&&r.top+scrollY<130)});
 U.forEach(hide);var p=[];
 function fits(){sync();var L=innerHeight-NAV.offsetHeight-(FB||22),m=0;U.forEach(function(u){if(u.style.display!=="none"){var r=u.getBoundingClientRect();if(r.height)m=Math.max(m,r.bottom+scrollY)}});return m<=L+1}
 for(var i=0;i<U.length;i++){show(U[i]);p.push(U[i]);if(!fits()&&p.length>1){hide(U[i]);p.pop();PG.push(p);p.forEach(hide);p=[U[i]];show(U[i])}}
 if(p.length)PG.push(p);p.forEach(hide);
 if(PG.length<2&&fitsAll()){NAV.style.visibility="hidden";U.forEach(show);sync();return false}
 var again=false;PG.forEach(function(g){if(g.length===1){U.forEach(hide);show(g[0]);if(!fits()&&Array.prototype.filter.call(g[0].children,vis).length>1){SPL.push(g[0]);again=true}}});
 if(again)return true;go(Math.min(cur,PG.length-1));return false;
 function fitsAll(){U.forEach(show);var f=fits();return f}}
function go(n){NAV.style.visibility="";cur=n;U.forEach(hide);PG[n].forEach(show);sync();NAV.querySelector(".pi").textContent=(n+1)+" / "+PG.length;NAV.querySelector(".pp").disabled=n===0;NAV.querySelector(".pn").disabled=n===PG.length-1;scrollTo(0,0)}
function mk(){if(NAV)return;var st=document.createElement("style");st.textContent="body.pgon{padding-bottom:0!important}body.pgon .s{min-height:0!important;height:auto!important}body.pgon main{min-height:0!important;padding-bottom:0!important}.a55t button{color:#1E2A38}.a55t button.on{color:#fff}#pgnav{position:fixed;left:0;right:0;bottom:22px;z-index:30;display:none;gap:8px;padding:6px 10px;background:rgba(255,248,246,.96);box-shadow:0 -2px 10px rgba(80,20,30,.12);max-width:900px;margin:0 auto}#pgnav button{flex:1;min-height:50px;border:0;border-radius:14px;background:#8E1F35;color:#fff;font:800 19px system-ui,sans-serif;cursor:pointer}#pgnav button:disabled{opacity:.3}#pgnav .pi{flex:0 0 70px;display:grid;place-items:center;font:800 16px system-ui;color:#8E1F35}";document.head.appendChild(st);
 NAV=document.createElement("div");NAV.id="pgnav";NAV.setAttribute("data-nofx","");NAV.innerHTML='<button class="pp" aria-label="Föregående">← Bakåt</button><span class="pi"></span><button class="pn" aria-label="Nästa">Nästa →</button>';document.body.appendChild(NAV);
 NAV.querySelector(".pp").onclick=function(){if(cur>0)go(cur-1)};NAV.querySelector(".pn").onclick=function(){if(cur<PG.length-1)go(cur+1)}}
var t;function later(){clearTimeout(t);t=setTimeout(function(){cur=0;build()},120)}
addEventListener("resize",later);
new MutationObserver(function(ms){if(busy)return;for(var i=0;i<ms.length;i++){var m=ms[i];if(m.type==="attributes"&&m.attributeName==="class"&&/(^|\s)s(\s|$)/.test(m.target.className)){later();return}if(m.type==="attributes"&&m.attributeName==="hidden"){later();return}}}).observe(document.body,{subtree:true,attributes:true,attributeFilter:["class","hidden"]});
new MutationObserver(function(ms){if(busy)return;for(var i=0;i<ms.length;i++){var n=[].concat([].slice.call(ms[i].addedNodes),[].slice.call(ms[i].removedNodes));for(var j=0;j<n.length;j++){var e=n[j];if(e.nodeType===1&&e!==NAV&&!/(^|\s)(intro|wel|toast|fxl|fx-)/.test(e.className||"")){later();return}}}}).observe(document.body,{childList:true});
if(document.readyState==="complete")setTimeout(build,50);else addEventListener("load",function(){setTimeout(build,50)});
window.__PG=function(){return PG.map(function(p){return p.map(function(u){var r=u.getBoundingClientRect();return u.tagName+"."+u.className+" h"+Math.round(u.offsetHeight)})})};})();
