/* ✨ Nya förslag – kort med Ja/Kanske/Nej och Ta bort förslaget. Sparas bara i telefonen (localStorage). */
(function(){
'use strict';
const BAS=(document.currentScript&&document.currentScript.src||'').replace(/nya\.js.*$/,'')||'nya/';
const I=(n,cls='nf-i')=>`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${(window.NF_IKON||{})[n]||''}</svg>`;
const GRUPPER=[
 ['intro','clapperboard','Introt och 3D-Arlanda','Första mötet med appen. Stort, snyggt och kort.'],
 ['karta','map','Kartan i appen','Riktiga Arlanda att trycka på.'],
 ['funk','sparkles','Effekter i appen','Små ögonblick som påminner om introt.'],
 ['ljud','audio-lines','Ljud och röster','Låter som en riktig flygplats.'],
 ['dela','qr-code','Dela, ikoner och läsbarhet','Lätt att visa en kollega och lätt att läsa.']];
// kalla: var förslaget kommer ifrån (labb/beslut/ny idé)
const F=[
 {id:'introfilm',g:'intro',ik:'tower-control',t:'Introfilm: tornet och landningen',m:'En kort film på cirka 15 sekunder där tornet ger klartecken och ett plan landar mellan banljusen.',k:'Intro',bild:'intro_a.webp',ljud:['torn_samtal.mp3','Lyssna på radiosamtalet'],p:['Intro']},
 {id:'arlanda3d',g:'intro',ik:'layers',t:'3D-Arlanda som startmeny',m:'Hela Arlanda i 3D, där varje del av appen är en plats som lyser på kartan.',k:'Lab 5',bild:'startmeny.webp',p:['Startsida','Intro']},
 {id:'ljuspelare',g:'intro',ik:'lamp-ceiling',t:'Ljuspelare över platserna',m:'Färgade ljusstrålar visar var du trycker för till exempel Dina rättigheter eller Ombud.',k:'Lab 5',bild:'meny_dator.webp',p:['Startsida']},
 {id:'radarsvep',g:'intro',ik:'radar',t:'Radarsvep som ritar fram kartan',m:'Radarn sveper runt och banorna ritas fram där strålen passerar.',k:'Lab 5',pv:'radar',p:['Intro','Startsida']},
 {id:'banljus',g:'intro',ik:'plane-landing',t:'Banljus som tänds i följd',m:'Ljusen längs banan tänds ett efter ett och visar vägen in.',k:'Lab 5',pv:'banljus',p:['Intro']},
 {id:'fyr',g:'intro',ik:'radio-tower',t:'Tornets blinkande fyr',m:'En röd lampa på tornet blinkar lugnt, som på riktigt.',k:'Lab 5',pv:'fyr',p:['Intro','Ombud']},
 {id:'bannamn',g:'intro',ik:'navigation',t:'Glödande bannamn i marken',m:'Bannamnen 01L, 19R och 26 lyser svagt i marken när kameran flyger förbi.',k:'Lab 5',pv:'bannamn',p:['Intro','Startsida']},
 {id:'molnhal',g:'intro',ik:'cloud',t:'Molnhål över banorna',m:'Molnen glider isär och Arlanda syns under, som när planet går ner genom molnen.',k:'Lab 5',pv:'moln',p:['Intro']},
 {id:'kondens',g:'intro',ik:'wind',t:'Kondensstrimma som ritar en båge',m:'Ett plan drar en vit strimma över himlen som blir en snygg båge.',k:'Lab 5',pv:'kondens',p:['Intro','Inställningar']},
 {id:'fonster',g:'intro',ik:'building-2',t:'Terminalfönster som tänds',m:'Fönstren i terminalen tänds ett i taget när kvällen kommer.',k:'Lab 5',pv:'terminal',p:['Intro','Startsida']},
 {id:'himmel',g:'intro',ik:'sun-moon',t:'Himlen följer klockan',m:'Gryning på morgonen, dagsljus mitt på dagen och natt på kvällen, efter telefonens klocka.',k:'Ny idé',pv:'himmel',p:['Startsida']},
 {id:'hoppa',g:'intro',ik:'rotate-ccw',t:'Hoppa över och se introt igen',m:'En tydlig knapp hoppar över introt, och under Inställningar kan man se det igen.',k:'Beslut',pv:'hoppa',p:['Intro','Inställningar']},
 {id:'kartplats',g:'karta',ik:'map-pin',t:'Tryck på kartan för plats i rapporter',m:'Du trycker där det hände, till exempel Ramp CD, och platsen sparas i rapporten.',k:'Lab 5',bild:'kartklick.webp',p:['Rapportera']},
 {id:'heatmap',g:'karta',ik:'siren',t:'Översiktskarta för ombud',m:'Ombuden ser var det ofta händer saker, men aldrig vem som rapporterade.',k:'Ny idé',pv:'heat',p:['Ombud']},
 {id:'viktigtljus',g:'funk',ik:'siren',t:'"Viktigt just nu" lyser som landningsljus',m:'Den röda rutan blinkar med symbolen och en rad ljus som landningsljus.',k:'Idé',pv:'viktigt',p:['Viktigt just nu','Startsida']},
 {id:'tavla',g:'funk',ik:'list-checks',t:'Avgångstavla för ärenden',m:'Ärendena visas som en avgångstavla där bokstäverna fladdrar när något ändras.',k:'Lab 4',pv:'tavla',p:['Ombud']},
 {id:'klartecken',g:'funk',ik:'check',t:'Mattias säger "Klartecken!"',m:'När något är klart tänds en grön lampa och Mattias säger "Klartecken!" som i flygradion.',k:'Idé',pv:'klar',ljud:['mattias_klartecken.mp3','Lyssna på Mattias'],p:['Ombud','Rapportera']},
 {id:'boarding',g:'funk',ik:'plane',t:'Boardingkort när du sparar',m:'Det du sparar glider in som ett boardingkort och får en grön stämpel.',k:'Lab 4',pv:'boarding',p:['Rapportera']},
 {id:'handslag',g:'funk',ik:'hand',t:'Handslag när något är klart',m:'Ett rörligt handslag visas när ett ärende är löst.',k:'Lab 4',pv:'lottie1',p:['Ombud','Rapportera']},
 {id:'vand',g:'funk',ik:'rotate-ccw',t:'3D-vändning mellan sidor',m:'Sidan vänder sig som ett kort när du går vidare.',k:'Lab 4',pv:'vand',p:['Dina rättigheter','Avtal och lön']},
 {id:'luta',g:'funk',ik:'thumbs-up',t:'Knappar som lutar mot fingret',m:'De stora knapparna lutar lite och studsar mjukt när du trycker.',k:'Lab 4',pv:'luta',p:['Startsida']},
 {id:'radio',g:'ljud',ik:'radio-tower',t:'Radiobrus och tornljud',m:'Ett kort brus och pip som i flygradion, till exempel när något skickas.',k:'Lab 5',pv:'vagor',ljud:['radiobrus.mp3','Lyssna på bruset'],p:['Intro','Rapportera']},
 {id:'sofie',g:'ljud',ik:'megaphone',t:'Sofie som utropare',m:'Sofie låter som flygplatsens högtalare, till exempel "Välkommen till Arlanda".',k:'Lab 5',pv:'vagor',ljud:['sofie_utrop.mp3','Lyssna på Sofie'],p:['Intro','Nyheter']},
 {id:'gatechime',g:'ljud',ik:'volume-2',t:'Gate-pling vid nyheter',m:'Ett mjukt pling som på flygplatsen när något nytt kommer.',k:'Lab 5',pv:'vagor',ljud:['gatechime.mp3','Lyssna på plinget'],p:['Nyheter','Viktigt just nu']},
 {id:'qr',g:'dela',ik:'qr-code',t:'"Visa en kollega" med QR-kod',m:'Kollegan skannar koden med kameran och har appen direkt, utan konto.',k:'Beslut',pv:'qr',p:['Startsida','Inställningar']},
 {id:'lottie',g:'dela',ik:'sparkles',t:'Rörliga ikoner (Lottie)',m:'Ikonerna rör sig lite, till exempel ett flygplan som lyfter eller en bock som ritas.',k:'Lab 4',pv:'lottie3',p:['Startsida','Dina rättigheter']},
 {id:'morkt',g:'dela',ik:'moon',t:'Mörkt läge och ljust läge',m:'Mörkt som standard och ljust för den som vill, valt under Inställningar.',k:'Beslut',pv:'tema',p:['Inställningar']},
 {id:'kontrast',g:'dela',ik:'shield-check',t:'Stor text och tydlig kontrast',m:'Alla knappar är minst 48 px och texten syns bra även i solsken.',k:'Beslut',pv:'kontrast',p:['Startsida','Inställningar']}
];
const K='nya_forslag_val';let VAL={};try{VAL=JSON.parse(localStorage.getItem(K)||'{}')||{}}catch(e){VAL={}}
const KB='nya_forslag_bort';let BORT={};try{BORT=JSON.parse(localStorage.getItem(KB)||'{}')||{}}catch(e){BORT={}}
let visaBort=false;
const spara=()=>{try{localStorage.setItem(K,JSON.stringify(VAL));localStorage.setItem(KB,JSON.stringify(BORT))}catch(e){}};
const arBort=id=>!!BORT[id]||(VAL[id]||{}).svar==='nej';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- förhandsvisningar ---------- */
function rnd(a,b){return a+Math.random()*(b-a)}
const PV={
 radar:()=>`<div class="pv-mitt"><div class="pv-radar"><div class="ring"></div><svg viewBox="0 0 150 150"><path d="M40 115 L95 30"/><path d="M60 125 L115 40"/><path d="M20 80 L130 80"/></svg><div class="svep"></div></div></div>`,
 banljus:()=>{let s='';for(let i=0;i<10;i++){const top=i*32+6,d=(9-i)*.12;s+=`<i class="l" style="top:${top}px;animation-delay:${d}s"></i><i class="r" style="top:${top}px;animation-delay:${d}s"></i>`}let m='';for(let i=0;i<10;i++)m+=`<i style="top:${i*32+20}px;animation-delay:${(9-i)*.12+.05}s"></i>`;return `<div class="pv-banljus"><div class="yta">${s}<span class="mitt">${m}</span></div></div>`},
 fyr:()=>`<div class="pv-mitt pv-fyr"><svg viewBox="0 0 100 170"><circle class="halo" cx="50" cy="16" r="8" fill="#ff3b4a55"/><circle class="blink" cx="50" cy="16" r="6" fill="#ff3b4a"/><rect x="47" y="20" width="6" height="12" fill="#3a4766"/><path d="M26 34 h48 l-6 22 h-36z" fill="#1f2b4a" stroke="#e9c77b66"/><path d="M30 38 h40 l-4 14 h-32z" fill="#ffd98a" opacity=".55"/><path d="M38 56 h24 l6 110 h-36z" fill="#18213c" stroke="#ffffff1a"/></svg></div>`,
 bannamn:()=>`<div class="pv-bannamn"><b>01L</b><b>19R</b><b>26</b></div>`,
 moln:()=>`<div class="pv-moln"><div class="mark"></div><div class="m v"></div><div class="m h"></div></div>`,
 kondens:()=>`<div class="pv-kondens" style="position:absolute;inset:0"><svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="nfKg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><path class="strimma" d="M -20 170 C 120 20, 300 20, 420 120"/></svg><svg class="flyg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${(window.NF_IKON||{}).plane||''}</svg></div>`,
 terminal:()=>{let s='';for(let i=0;i<42;i++)s+=`<i style="animation-delay:${rnd(0,2.6).toFixed(2)}s"></i>`;return `<div class="pv-terminal">${s}</div>`},
 himmel:()=>`<div class="pv-himmel"><div class="sol"></div><div class="mark"></div><span class="tid">Följer klockan</span></div>`,
 hoppa:()=>`<div class="pv-mitt"><div class="pv-hoppa"><span>Hoppa över ⏭</span><i>Visa introt igen</i></div></div>`,
 heat:()=>`<div class="pv-heat"><svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice"><g stroke="#e9c77b66" stroke-width="7" stroke-linecap="round"><path d="M90 175 L150 20"/><path d="M250 180 L310 25"/><path d="M40 110 L370 90"/></g><g fill="#26365e"><rect x="170" y="80" width="60" height="30" rx="5"/><rect x="200" y="120" width="40" height="22" rx="5"/></g></svg><i class="p" style="left:44%;top:44%"></i><i class="p" style="left:58%;top:66%;animation-delay:.6s"></i><i class="p" style="left:30%;top:58%;animation-delay:1.2s"></i></div>`,
 viktigt:()=>`<div class="pv-mitt"><div class="pv-viktigt">Viktigt just nu<small>EXEMPEL: Ny regel för avisning från måndag.</small><span class="ljusrad">${Array.from({length:12},(_,i)=>`<i style="animation-delay:${(i*.08).toFixed(2)}s"></i>`).join('')}</span></div></div>`,
 tavla:()=>`<div class="pv-mitt"><div class="pv-tavla" data-tavla><div class="hd"><span>NR</span><span>ÄRENDE</span><span>STATUS</span></div><div class="rad" data-r="0"></div><div class="rad" data-r="1"></div><div class="rad" data-r="2"></div></div></div>`,
 klar:()=>`<div class="pv-mitt"><div class="pv-klar"><div class="lampa"></div><b>KLARTECKEN</b></div></div>`,
 boarding:()=>`<div class="pv-mitt"><div class="pv-boarding"><div class="v">RAPPORT<b>Sparad</b>Bara i din telefon</div><div class="h">ARN</div><div class="stampel">SPARAT</div></div></div>`,
 vand:()=>`<div class="pv-mitt pv-vand"><div class="k"><div class="a">Sida 1</div><div class="b">Sida 2</div></div></div>`,
 luta:()=>`<div class="pv-mitt"><div class="pv-luta"><div>Rapportera</div><div>Rättigheter</div><div>Få hjälp</div><div>Bra att veta</div></div></div>`,
 vagor:()=>`<div class="pv-mitt"><div class="pv-vagor">${Array.from({length:18},(_,i)=>`<i style="animation-delay:${(i*.07).toFixed(2)}s;animation-duration:${(0.9+(i%5)*.15).toFixed(2)}s"></i>`).join('')}</div></div><span class="pv-radio">TESTRÖST · BYTS FÖRE RIKTIG APP</span>`,
 qr:()=>`<div class="pv-mitt"><div class="pv-qr" data-qr></div></div>`,
 lottie1:()=>`<div class="pv-mitt"><div class="pv-lottie"><div data-lottie="noto-handslag" style="width:120px;height:120px"></div></div></div>`,
 lottie3:()=>`<div class="pv-mitt"><div class="pv-lottie"><div data-lottie="noto-flygplan"></div><div data-lottie="noto-bock"></div><div data-lottie="noto-varning"></div></div></div>`,
 tema:()=>`<div class="pv-mitt"><div class="pv-tema"><div class="tel m"><i></i><i></i><i></i><i></i></div><div class="tel l"><i></i><i></i><i></i><i></i></div></div></div>`,
 kontrast:()=>`<div class="pv-mitt"><div class="pv-kontrast"><span>Stor knapp · 52 px</span><small>Kontrast över WCAG AA</small></div></div>`
};
function prevHTML(f){
 if(f.bild)return `<img src="${BAS}bild/${f.bild}" alt="Skärmdump: ${esc(f.t)}" loading="lazy" decoding="async" width="480" height="300"><div class="vinj"></div>`;
 return PV[f.pv]?PV[f.pv]():'';
}
/* ---------- bygg sidan ---------- */
const rot=document.getElementById('nya-rot');if(!rot)return;
const antal=F.length;
rot.innerHTML=`
<section class="nf-hero" aria-labelledby="nf-h1">
 <div class="nf-lager nf-stj" data-par=".15"></div>
 <div class="nf-lager nf-horisont" data-par=".05"></div>
 <div class="nf-lager nf-bana" data-par=".3"><div class="plan"></div><div class="ljus" id="nf-heroljus"></div></div>
 <svg class="nf-flyg" id="nf-heroflyg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" aria-hidden="true">${(window.NF_IKON||{}).plane||''}</svg>
 <div class="nf-hero-text">
  <span class="nf-eyebrow">${I('sparkles','nf-i')}Arlanda-världen</span>
  <h1 id="nf-h1">Nya förslag</h1>
  <p>${antal} nya idéer för utseende, ljud och 3D. Välj <b>Ja</b>, <b>Kanske</b> eller <b>Nej</b>. Nej och borttagna kort göms.</p>
  <div class="nf-hero-rad"><a class="nf-knapp guld" href="#nya">${I('play')}Börja välja</a><span class="nf-stat" id="nf-herostat"></span></div>
 </div>
</section>
<section id="nya" aria-label="Nya förslag">
 <div class="nf-nav">
  <div class="nf-prog"><span id="nf-progtxt">0 av ${antal} valda</span><span class="bar"><i id="nf-progbar"></i></span></div>
  <div class="nf-flikar" role="group" aria-label="Visa">
   <button class="nf-flik" data-filt="alla" aria-pressed="true">Alla</button>
   <button class="nf-flik" data-filt="ovalda" aria-pressed="false">Inte valda</button>
   <button class="nf-flik" data-filt="ja" aria-pressed="false">Ja</button>
   <button class="nf-flik" data-filt="kanske" aria-pressed="false">Kanske</button>
   <button class="nf-flik" data-filt="nej" aria-pressed="false">Nej</button>
   <button class="nf-flik nf-visabort" id="nf-visabort" aria-pressed="false">Visa borttagna</button>
  </div>
 </div>
 <div id="nf-lista"></div>
 <div class="nf-sum" id="nf-sum">
  <h2>Mina val</h2>
  <p>Kort text att klistra in i chatten.</p>
  <label class="nf-sr" for="nf-text">Mina val som text</label>
  <textarea id="nf-text" readonly></textarea>
  <div class="rad"><button class="nf-knapp guld" id="nf-kopiera">${I('copy')}Kopiera mina val</button></div>
  <button class="nf-knapp nf-rensa" id="nf-rensa">${I('rotate-ccw')}Rensa mina val</button>
  <p class="nf-fot">Valen sparas bara i den här telefonen. Testsida, inte den riktiga appen. Rösterna (Sofie, Mattias) är testljud och måste bytas mot licensierad röst eller egen inspelning. Karta: © OpenStreetMap contributors. Rörliga ikoner: Noto Animated Emoji (Google, CC BY 4.0). Ikoner: Lucide (ISC). Typsnitt: Manrope och Inter (SIL OFL). Ljud: CC0.</p>
 </div>
 <div class="nf-avdelare">Tidigare effekter</div>
</section>
<div class="nf-dock" id="nf-dock" aria-hidden="true"><span id="nf-docktxt"></span><button class="nf-knapp guld" id="nf-dockkop" tabindex="-1">${I('copy')}Kopiera</button></div>
<div class="nf-toast" id="nf-toast" role="status" aria-live="polite"></div>`;

const lista=document.getElementById('nf-lista');
GRUPPER.forEach(([gid,gik,gt,gtxt])=>{
 const h=document.createElement('div');h.className='nf-grupp';h.dataset.g=gid;h.innerHTML=`<h2>${I(gik)}${gt}</h2><p>${gtxt}</p>`;lista.appendChild(h);
 const wrap=document.createElement('div');wrap.className='nf-lista';lista.appendChild(wrap);
 F.filter(f=>f.g===gid).forEach(f=>{
  const c=document.createElement('article');c.className='nf-kort';c.id='nf-'+f.id;c.dataset.id=f.id;
  c.innerHTML=`<div class="nf-prev" data-pv>${'' /* fylls när kortet syns */}<span class="nf-tagg">${esc(f.k)}</span></div>
  <div class="nf-kropp"><h3>${I(f.ik)}<span>${esc(f.t)}</span></h3><p>${esc(f.m)}</p>
  ${f.ljud?`<button class="nf-ljud" data-ljud="${f.ljud[0]}"><span class="vag"><i></i><i></i><i></i><i></i></span><span class="lt">${esc(f.ljud[1])}</span></button>`:''}
  <div class="nf-val" role="group" aria-label="Ditt svar: ${esc(f.t)}">
   <button data-v="ja" aria-pressed="false">Ja</button><button data-v="kanske" aria-pressed="false">Kanske</button><button data-v="nej" aria-pressed="false">Nej</button></div>
  <button class="nf-bort" data-bort>Ta bort förslaget</button></div>`;
  wrap.appendChild(c);
 });
});
const kort=[...lista.querySelectorAll('.nf-kort')];
const byId=Object.fromEntries(F.map(f=>[f.id,f]));

/* ---------- ljud ---------- */
let aktiv=null;
function stoppaLjud(){if(aktiv){aktiv.a.pause();aktiv.b.classList.remove('spelar');aktiv=null}}
lista.addEventListener('click',e=>{
 const lb=e.target.closest('.nf-ljud');
 if(lb){const was=aktiv&&aktiv.b===lb;stoppaLjud();if(was)return;const a=new Audio(BAS+'ljud/'+lb.dataset.ljud);a.preload='auto';aktiv={a,b:lb};lb.classList.add('spelar');a.onended=()=>{lb.classList.remove('spelar');if(aktiv&&aktiv.b===lb)aktiv=null};a.play().catch(()=>{lb.classList.remove('spelar')});return}
 const vb=e.target.closest('.nf-val button');
 if(vb){const c=vb.closest('.nf-kort'),id=c.dataset.id,v=vb.dataset.v;const o=VAL[id]||{};
  if(o.svar===v){delete o.svar}else{o.svar=v}
  VAL[id]=o;if(!o.svar)delete VAL[id];spara();ritaKort(c,true);uppdatera();if(o.svar==='nej'&&!visaBort)toast('Nej – kortet göms. Visa borttagna tar fram det.');
  if(v==='ja'&&o.svar==='ja'&&window.gsap&&!RM)gsap.fromTo(c,{scale:.985},{scale:1,duration:.5,ease:'elastic.out(1,.5)'});return}
 const bb=e.target.closest('[data-bort]');
 if(bb){const c=bb.closest('.nf-kort'),id=c.dataset.id;if(BORT[id])delete BORT[id];else BORT[id]=1;spara();ritaKort(c);uppdatera();if(BORT[id]&&!visaBort)toast('Förslaget borttaget. Visa borttagna tar fram det.');return}
});
function ritaKort(c,anim){const o=VAL[c.dataset.id]||{};c.classList.remove('ja','kanske','nej');if(o.svar)c.classList.add(o.svar);
 c.querySelectorAll('.nf-val button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===o.svar)));
 const id=c.dataset.id;c.classList.toggle('borta',arBort(id));const bb=c.querySelector('[data-bort]');
 if(bb){bb.hidden=o.svar==='nej';bb.textContent=BORT[id]?'Ångra borttagning':'Ta bort förslaget'}}

/* ---------- filter ---------- */
let filt='alla';
document.querySelectorAll('.nf-flik[data-filt]').forEach(b=>b.onclick=()=>{filt=b.dataset.filt;document.querySelectorAll('.nf-flik[data-filt]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filtrera()});
const vbk=document.getElementById('nf-visabort');vbk.onclick=()=>{visaBort=!visaBort;filtrera();uppdatera()};
function filtrera(){kort.forEach(c=>{const id=c.dataset.id,s=(VAL[id]||{}).svar;const syn=visaBort||filt==='nej'||!arBort(id);c.hidden=!syn||!(filt==='alla'||(filt==='ovalda'&&!s)||s===filt)});
 lista.querySelectorAll('.nf-grupp').forEach(h=>{const w=h.nextElementSibling;const n=[...w.children].some(c=>!c.hidden);h.hidden=!n;w.hidden=!n})}

/* ---------- text + kopiera ---------- */
function text(){
 const d=new Date(),dat=d.toLocaleDateString('sv-SE',{day:'numeric',month:'short'});
 const rad=v=>F.filter(f=>(VAL[f.id]||{}).svar===v).map(f=>`- ${f.t}`);const bo=F.filter(f=>BORT[f.id]&&(VAL[f.id]||{}).svar!=='nej').map(f=>`- ${f.t}`);
 const ja=rad('ja'),ka=rad('kanske'),ne=rad('nej');const ov=F.filter(f=>!(VAL[f.id]||{}).svar).length;
 let t=`Nya förslag – mina val (${dat}):\n`;
 t+=`JA (${ja.length}):\n${ja.join('\n')||'- inga'}\n`;
 t+=`KANSKE (${ka.length}):\n${ka.join('\n')||'- inga'}\n`;
 t+=`NEJ (${ne.length}):\n${ne.join('\n')||'- inga'}\n`;
 if(bo.length)t+=`BORTTAGNA (${bo.length}):\n${bo.join('\n')}\n`;
 if(ov)t+=`Inte valt än: ${ov} st`;
 return t.trim();
}
const ta=document.getElementById('nf-text');
function uppdatera(){const n=F.filter(f=>(VAL[f.id]||{}).svar).length,ja=F.filter(f=>(VAL[f.id]||{}).svar==='ja').length;
 document.getElementById('nf-progtxt').textContent=`${n} av ${antal} valda`;document.getElementById('nf-progbar').style.width=(n/antal*100)+'%';
 document.getElementById('nf-docktxt').innerHTML=`<b>${n}</b> av ${antal} valda · <b>${ja}</b> ja`;
 document.getElementById('nf-herostat').textContent=n?`${n} av ${antal} valda`:`${antal} förslag · tar ca 5 min`;
 const nb=F.filter(f=>arBort(f.id)).length;vbk.textContent=(visaBort?'Göm borttagna':'Visa borttagna')+(nb?` (${nb})`:'');vbk.setAttribute('aria-pressed',String(visaBort));
 ta.value=text();filtrera()}
function toast(s){const t=document.getElementById('nf-toast');t.textContent=s;t.classList.add('syns');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('syns'),2000)}
async function kopiera(){const s=text();ta.value=s;let ok=false;
 if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(s);ok=true}catch(e){}}
 if(!ok){try{ta.focus();ta.select();ta.setSelectionRange(0,s.length);ok=document.execCommand('copy');ta.blur()}catch(e){}}
 window.__nfKopierat=ok?s:null;toast(ok?'✓ Kopierat! Klistra in i chatten':'Texten är markerad – tryck Kopiera');return ok}
document.getElementById('nf-kopiera').onclick=kopiera;document.getElementById('nf-dockkop').onclick=kopiera;
document.getElementById('nf-rensa').onclick=()=>{if(confirm('Säker? Alla dina val och borttagna förslag återställs.')){VAL={};BORT={};visaBort=false;try{localStorage.removeItem(K);localStorage.removeItem(KB)}catch(e){}kort.forEach(c=>ritaKort(c));uppdatera();toast('Alla val är rensade')}};

/* ---------- lat laddning av förhandsvisningar ---------- */
let lottieP=null;const lotKlar=new Set();
function laddaLottie(){if(window.lottie)return Promise.resolve();if(!lottieP)lottieP=new Promise((res,rej)=>{const s=document.createElement('script');s.src=BAS+'js/lottie.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)});return lottieP}
const TAVLA=[['12','SCHEMA ÄNDRAT ','BEHANDLAS'],['13','OB-TILLÄGG    ','SKICKAT'],['14','SKYDDSRONDEN  ','KLART ✓'],['15','RASTER RAMP   ','NYTT'],['16','ARBETSKLÄDER  ','BEHANDLAS']];
function flippa(el,txt){el.innerHTML=[...txt].map(ch=>`<span class="f">${ch===' '?'&nbsp;':esc(ch)}</span>`).join('');const fs=[...el.children];
 fs.forEach((f,i)=>{const mal=f.textContent;let n=0;const tick=()=>{if(++n<4+i%4){f.textContent='ABCDEFGHIJKLMNOPRSTUVÄÖ0123456789'[Math.random()*33|0];setTimeout(tick,60)}else f.innerHTML=mal===' '||mal==='\u00a0'?'&nbsp;':esc(mal)};if(!RM)tick()})}
const tavlor=new Map();
function startaTavla(c){const t=c.querySelector('[data-tavla]');if(!t||tavlor.has(c))return;let k=0;const rita=()=>{[0,1,2].forEach(r=>{const d=TAVLA[(k+r)%TAVLA.length];const rad=t.querySelector(`[data-r="${r}"]`);rad.innerHTML='<span></span><span></span><span></span>';const s=rad.children;flippa(s[0],d[0]);flippa(s[1],d[1].trim().slice(0,13));flippa(s[2],d[2]);if(d[2].includes('✓'))s[2].classList.add('ok')});k++};rita();tavlor.set(c,setInterval(rita,3200))}
function stoppaTavla(c){if(tavlor.has(c)){clearInterval(tavlor.get(c));tavlor.delete(c)}}
function fyllPrev(c){const p=c.querySelector('[data-pv]');if(p.dataset.fylld)return;p.dataset.fylld='1';p.insertAdjacentHTML('afterbegin',prevHTML(byId[c.dataset.id]));
 const q=p.querySelector('[data-qr]');if(q&&window.qrcode){try{const qr=qrcode(0,'M');qr.addData(location.href.split('#')[0].replace(/valj\/?(index\.html)?$/,''));qr.make();q.innerHTML=qr.createImgTag(4,0);const im=q.querySelector('img');if(im)im.alt='QR-kod (demo-länk)'}catch(e){}}
 const ls=[...p.querySelectorAll('[data-lottie]')];if(ls.length)laddaLottie().then(()=>ls.forEach(el=>{const a=lottie.loadAnimation({container:el,renderer:'svg',loop:true,autoplay:!RM,path:BAS+'lottie/'+el.dataset.lottie+'.json'});el._a=a;lotKlar.add(el)})).catch(()=>{});}
const io=new IntersectionObserver(es=>es.forEach(e=>{const c=e.target;
 if(e.isIntersecting){fyllPrev(c);c.classList.add('live');startaTavla(c);c.querySelectorAll('[data-lottie]').forEach(el=>el._a&&!RM&&el._a.play())}
 else{c.classList.remove('live');stoppaTavla(c);c.querySelectorAll('[data-lottie]').forEach(el=>el._a&&el._a.pause())}}),{rootMargin:'120px 0px'});
kort.forEach(c=>{ritaKort(c);io.observe(c)});uppdatera();

/* ---------- inflyttning med GSAP + parallax ---------- */
if(window.gsap&&!RM){
 gsap.from('.nf-hero-text>*',{y:24,opacity:0,duration:.9,stagger:.12,ease:'power3.out',delay:.1});
 const inIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){gsap.fromTo(e.target,{y:36,opacity:0},{y:0,opacity:1,duration:.75,ease:'power3.out'});inIO.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
 [...kort,...lista.querySelectorAll('.nf-grupp')].forEach(el=>{const r=el.getBoundingClientRect();if(r.top>innerHeight){gsap.set(el,{opacity:0});inIO.observe(el)}});
 const flyg=document.getElementById('nf-heroflyg');gsap.fromTo(flyg,{x:0,y:0},{x:-(innerWidth+260),y:60,duration:14,ease:'none',repeat:-1});
}
// banljus i hero
(function(){const h=document.getElementById('nf-heroljus');if(!h)return;let s='';for(let i=0;i<9;i++){const t=100-i*11;const o=(16-i*1.6).toFixed(1),sz=(6-i*.45).toFixed(1);s+=`<i style="left:calc(50% - ${o}%);bottom:${i*10}%;width:${sz}px;height:${sz}px;animation-delay:${(8-i)*.14}s"></i><i style="left:calc(50% + ${o}%);bottom:${i*10}%;width:${sz}px;height:${sz}px;animation-delay:${(8-i)*.14}s"></i>`}h.innerHTML=s})();
const lager=[...document.querySelectorAll('.nf-lager[data-par]')];let tick=false;
function par(){tick=false;const y=scrollY;if(y>innerHeight*1.2)return;lager.forEach(l=>l.style.transform=`translate3d(0,${y*parseFloat(l.dataset.par)}px,0)`)}
if(!RM)addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(par)}},{passive:true});
// dockan syns när man är bland korten
const dock=document.getElementById('nf-dock');const nya=document.getElementById('nf-lista');
new IntersectionObserver(es=>es.forEach(e=>{dock.classList.toggle('syns',e.isIntersecting);dock.setAttribute('aria-hidden',String(!e.isIntersecting));document.getElementById('nf-dockkop').tabIndex=e.isIntersecting?0:-1}),{rootMargin:'-30% 0px -30% 0px'}).observe(nya);
window.NF={antal,text,VAL:()=>VAL};
})();
