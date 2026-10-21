// Kolla ditt schema – körs helt i webbläsaren. Inget sparas eller skickas.
// Alla tider tolkas som svensk lokal tid (Europe/Stockholm), med verklig förfluten tid över sommar/vintertid.
(function(root){
const TZ='Europe/Stockholm', MIN=60e3, H=3600e3, D=24*H;
const FMT=new Intl.DateTimeFormat('en-US',{timeZone:TZ,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',weekday:'short'});
function parts(ms){const o={};for(const p of FMT.formatToParts(ms))o[p.type]=p.value;return {y:+o.year,m:+o.month,d:+o.day,h:+o.hour%24,mi:+o.minute,s:+o.second,wd:o.weekday};}
function tzoff(ms){const p=parts(ms);return Date.UTC(p.y,p.m-1,p.d,p.h,p.mi,p.s)-Math.floor(ms/1000)*1000;}
function toEpoch(date,time){const [y,m,d]=date.split('-').map(Number),[h,mi]=time.split(':').map(Number);const g=Date.UTC(y,m-1,d,h,mi);let t=g-tzoff(g);t=g-tzoff(t);return t;}
function addDays(date,n){const [y,m,d]=date.split('-').map(Number);const x=new Date(Date.UTC(y,m-1,d+n));return x.toISOString().slice(0,10);}
function localDate(ms){const p=parts(ms);return p.y+'-'+String(p.m).padStart(2,'0')+'-'+String(p.d).padStart(2,'0');}
function hhmm(ms){const p=parts(ms);return String(p.h).padStart(2,'0')+':'+String(p.mi).padStart(2,'0');}
const okTime=t=>/^([01]\d|2[0-3]):[0-5]\d$/.test(t||'');
function okDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return false;const [y,m,d]=s.split('-').map(Number);const x=new Date(Date.UTC(y,m-1,d));return x.getUTCFullYear()===y&&x.getUTCMonth()===m-1&&x.getUTCDate()===d;}
const r1=x=>Math.round(x*10)/10;
function isoWeekOf(date){const [y,m,d]=date.split('-').map(Number);const x=new Date(Date.UTC(y,m-1,d));const day=(x.getUTCDay()+6)%7;x.setUTCDate(x.getUTCDate()-day+3);const yy=x.getUTCFullYear();const f=new Date(Date.UTC(yy,0,4));return yy+'-v'+String(1+Math.round(((x-f)/864e5-3+((f.getUTCDay()+6)%7))/7)).padStart(2,'0');}
function mondayOf(date){const [y,m,d]=date.split('-').map(Number);const day=(new Date(Date.UTC(y,m-1,d)).getUTCDay()+6)%7;return addDays(date,-day);}

function parse(shifts){
  const ok=[],msgs=[];
  shifts.forEach((s,i)=>{const r=i+1;
    const any=s&&(s.date||s.start||s.end||(s.brk!==''&&s.brk!=null&&s.brk!==30&&s.brk!=='30'));
    if(!s||(!s.date&&!s.start&&!s.end)) return; // tom rad ignoreras
    if(!s.date||!s.start||!s.end){msgs.push({key:'r_incomplete',p:{r}});return;}
    if(!okDate(s.date)){msgs.push({key:'r_invalid_date',p:{r}});return;}
    if(!okTime(s.start)||!okTime(s.end)){msgs.push({key:'r_invalid_time',p:{r}});return;}
    if(s.start===s.end){msgs.push({key:'r_same',p:{r}});return;}
    const a=toEpoch(s.date,s.start), endDate=s.end>s.start?s.date:addDays(s.date,1), b=toEpoch(endDate,s.end);
    let brk=(s.brk===''||s.brk==null)?null:Number(s.brk);
    if(brk!==null&&(!isFinite(brk)||brk<0)){msgs.push({key:'r_invalid_break',p:{r}});return;}
    if(brk!==null&&brk*MIN>=b-a){msgs.push({key:'r_break_ge',p:{r}});return;}
    ok.push({r,date:s.date,start:s.start,a,b,brk});
  });
  ok.sort((x,y)=>x.a-y.a||x.b-y.b);
  // exakta dubbletter tas bort
  const out=[];for(const s of ok){const p=out[out.length-1];if(p&&p.a===s.a&&p.b===s.b){msgs.push({key:'r_dup',p:{d:s.date,r:s.r}});continue;}out.push(s);}
  return {iv:out,msgs};
}
function maxFree(iv,p0,p1){let cur=p0,best=0;for(const s of iv){if(s.b<=p0||s.a>=p1)continue;best=Math.max(best,Math.max(s.a,p0)-cur);cur=Math.max(cur,Math.min(s.b,p1));}return Math.max(best,p1-cur);}
// Tid före första och efter sista passet räknas som ledig. Alla perioder som rör listan prövas.
function fixedPeriods(iv,R0,lastEnd,len,step,need){const ok=[];for(let off=0;off<len;off+=step){let all=true;for(let p0=R0-len+off;p0<lastEnd;p0+=len){if(maxFree(iv,p0,p0+len)<need){all=false;break;}}if(all)ok.push(off);}return ok;}
function nightMin(s){let t=0;for(let k=-1;k<=1;k++){const day=addDays(localDate(s.a),k);const n0=toEpoch(day,'22:00'),n1=toEpoch(addDays(day,1),'06:00');t+=Math.max(0,Math.min(s.b,n1)-Math.max(s.a,n0));}return t/MIN;}

function check(shifts,opt){
  opt=opt||{}; const R=[]; const {iv,msgs}=parse(shifts);
  for(const m of msgs) R.push({id:'input',level:'input',key:m.key,p:m.p});
  // Varsel (§ 6 Mom 1)
  let notice;
  if(opt.notified||opt.effective){
    if(!(opt.notified&&opt.effective)) notice={id:'notice',level:'yellow',key:'r_notice_skip',p:{}};
    else if(!okDate(opt.notified)||!okDate(opt.effective)) notice={id:'input',level:'input',key:'r_invalid_date',p:{r:'–'}};
    else {const n=Math.round((Date.UTC(...opt.effective.split('-').map((v,i)=>i==1?v-1:+v))-Date.UTC(...opt.notified.split('-').map((v,i)=>i==1?v-1:+v)))/864e5);
      notice=n<0?{id:'input',level:'input',key:'r_notice_order',p:{}}:(n<14?{id:'notice',level:'red',key:'r_notice_bad',p:{n}}:{id:'notice',level:'green',key:'r_notice_ok',p:{n}});}
  } else notice={id:'notice',level:'yellow',key:'r_notice_skip',p:{}};
  if(!iv.length){R.push({id:'input',level:'input',key:'none',p:{}});R.push(notice);return R;}
  // Överlapp: inmatningsfel; passen slås ihop så att timmar inte räknas dubbelt
  const blocks=[];
  for(const s of iv){const p=blocks[blocks.length-1];
    if(p&&s.a<p.b){R.push({id:'input',level:'input',key:'r_overlap',p:{a:p.date,b:s.date}});p.b=Math.max(p.b,s.b);p.brk=(p.brk===null||s.brk===null)?null:p.brk+s.brk;p.rows.push(s.r);}
    else blocks.push({...s,rows:[s.r]});}
  const R0=toEpoch(localDate(blocks[0].a),'00:00'), lastEnd=Math.max(...blocks.map(s=>s.b));
  // Dygnsvila (§ 6 Mom 2)
  let minGap=Infinity;
  for(let i=1;i<blocks.length;i++){const g=blocks[i].a-blocks[i-1].b;minGap=Math.min(minGap,g);if(g<11*H)R.push({id:'rest',level:'yellow',key:'r_rest_short',p:{a:blocks[i-1].date,b:blocks[i].date,h:r1(g/H)}});}
  const dr=fixedPeriods(blocks,R0,lastEnd,D,H/2,11*H);
  R.push(dr.length?{id:'rest',level:'green',key:'r_rest_ok',p:{t:hhmm(R0+dr[0])}}:{id:'rest',level:'red',key:'r_rest_bad',p:{h:isFinite(minGap)?r1(minGap/H):'–'}});
  // Veckovila (§ 6 Mom 3)
  if(lastEnd-blocks[0].a<7*D) R.push({id:'week',level:'yellow',key:'r_week_short',p:{}});
  else {const wr=fixedPeriods(blocks,R0,lastEnd,7*D,H,36*H);R.push(wr.length?{id:'week',level:'green',key:'r_week_ok',p:{}}:{id:'week',level:'red',key:'r_week_bad',p:{}});}
  // Raster (§ 6 Mom 4): pass med mindre än 30 min mellanrum räknas ihop
  const groups=[];
  for(const s of blocks){const g=groups[groups.length-1];
    if(g&&s.a-g.b<30*MIN){R.push({id:'break',level:'yellow',key:'r_merged',p:{a:g.date,b:s.date,h:r1((s.b-g.a)/H)}});g.b=s.b;g.brk=(g.brk===null||s.brk===null)?null:g.brk+s.brk;}
    else groups.push({...s});}
  let brIssue=false; const longDates=[];
  for(const g of groups){const len=(g.b-g.a)/H; if(len<=5) continue;
    if(g.brk===null){R.push({id:'break',level:'yellow',key:'r_break_missing',p:{d:g.date}});brIssue=true;continue;}
    if(g.brk===0){R.push({id:'break',level:'red',key:'r_break_none',p:{d:g.date,h:r1(len)}});brIssue=true;continue;}
    if(g.brk<30){R.push({id:'break',level:'yellow',key:'r_break_short',p:{d:g.date,m:g.brk}});brIssue=true;}
    if(len-g.brk/60>10){longDates.push(g.date);brIssue=true;}}
  if(longDates.length) R.push({id:'break',level:'yellow',key:'r_break_place',p:{d:longDates.join(', ')}});
  if(!brIssue) R.push({id:'break',level:'green',key:'r_break_ok',p:{}});
  // Natt (§ 6 Mom 5): natt 22–06; nattarbetande = normalt minst 3 h av passet under natt
  const nInfo=[],nLong=[];
  for(const s of blocks){const nm=nightMin(s);if(nm>=180){nInfo.push(s.date+' ('+r1(nm/60)+' h)');const w=(s.b-s.a)/H-(s.brk||0)/60;if(w>8)nLong.push(s.date+' ('+r1(w)+' h)');}}
  if(nInfo.length){R.push({id:'night',level:'yellow',key:'r_night_info',p:{d:nInfo.join(', ')}});
    if(nLong.length)R.push({id:'night',level:'yellow',key:'r_night_long',p:{d:nLong.join(', ')}});
    R.push({id:'night',level:'yellow',key:'r_night_avg',p:{}});
    R.push({id:'night_med',level:'info',key:'r_night_med',p:{}});}
  else R.push({id:'night',level:'green',key:'r_night_none',p:{}});
  R.push(notice);
  // Veckoarbetstid – information. Pass delas vid måndag 00:00; rast fördelas efter andel.
  const wk={};let anyNull=false;
  for(const s of blocks){let a=s.a;const tot=s.b-s.a;if(s.brk===null)anyNull=true;
    while(a<s.b){const ld=localDate(a);const nb=toEpoch(addDays(mondayOf(ld),7),'00:00');const e=Math.min(s.b,nb);const k=isoWeekOf(ld);
      wk[k]=(wk[k]||0)+(e-a)/H-((s.brk||0)/60)*((e-a)/tot);a=e;}}
  for(const k of Object.keys(wk).sort()) R.push({id:'hours',level:'yellow',key:'r_hours',p:{w:k,h:r1(wk[k])}});
  if(anyNull) R.push({id:'hours',level:'yellow',key:'r_hours_nobreak',p:{}});
  R.push({id:'hours',level:'yellow',key:'r_hours_info',p:{}});
  return R;
}
const api={check,parse,nightMin,toEpoch};
if(typeof module!=='undefined') module.exports=api; else root.SchemaCheck=api;
})(this);
