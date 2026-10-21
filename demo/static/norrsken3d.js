// Norrsken över banan – FÖRSTA Lab 3-versionen (commit 3860e56/5c89445) + flygledartornet från Lab 3 "Tornet" + inflygande plan. Testmaterial.
import * as THREE from './vendor/three/three.module.min.js';
import {EffectComposer} from './vendor/three/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from './vendor/three/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from './vendor/three/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from './vendor/three/jsm/postprocessing/OutputPass.js';
export function startSky(cv,opt={}){
 const R=new THREE.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance'});
 const gx=R.getContext();if(!gx)throw new Error('nogl');const dbg=gx.getExtension('WEBGL_debug_renderer_info'),GPU=dbg?gx.getParameter(dbg.UNMASKED_RENDERER_WEBGL):'';
 const PHONE=Math.min(innerWidth,innerHeight)<700;
 const LOW=opt.low||/swiftshader|llvmpipe|software/i.test(GPU)||(navigator.deviceMemory&&navigator.deviceMemory<=3)||location.search.includes('low');
 const NOBLOOM=LOW||PHONE||location.search.includes('nobloom');
 R.setPixelRatio(Math.min(devicePixelRatio,LOW?1:(PHONE?1.25:1.5)));R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.8;
 let W=innerWidth,H=innerHeight,scene,cam,comp,tick=()=>{};const S={};
 function size(){W=innerWidth;H=innerHeight;R.setSize(W,H,false);if(cam){cam.aspect=W/H;cam.fov=W/H<.7?66:60;cam.updateProjectionMatrix()}comp&&comp.setSize(W,H)}
 function mkComp(bloom=1.2,rad=.6,th=.1){if(NOBLOOM){comp=null;return}comp=new EffectComposer(R);comp.addPass(new RenderPass(scene,cam));if(bloom)comp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),bloom,rad,th));comp.addPass(new OutputPass());comp.setSize(W,H)}
 const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.6,...o});const B=c=>new THREE.MeshBasicMaterial({color:c});
function plane(col=0xe9edf5,acc=0x3a6ea5){const P=new THREE.Group(),wm=M(col,{metalness:.4,roughness:.35}),am=M(acc);
 const f=new THREE.Mesh(new THREE.CapsuleGeometry(.45,4.2,8,24),wm);f.rotation.x=Math.PI/2;P.add(f);
 const w=new THREE.Mesh(new THREE.BoxGeometry(6,.08,1.1),wm);w.position.set(0,-.1,.2);P.add(w);
 const t=new THREE.Mesh(new THREE.BoxGeometry(.08,1.2,.9),am);t.position.set(0,.7,2.2);P.add(t);const h=new THREE.Mesh(new THREE.BoxGeometry(2,.06,.6),wm);h.position.set(0,.1,2.3);P.add(h);
 for(const x of[-1.4,1.4]){const e=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.9,16),am);e.rotation.x=Math.PI/2;e.position.set(x,-.35,-.1);P.add(e)}
 [[-3,0xff2020],[3,0x20ff40]].forEach(([x,c])=>{const l=new THREE.Mesh(new THREE.SphereGeometry(.07),B(c));l.position.set(x,-.1,.2);P.add(l)});
 const win=new THREE.Mesh(new THREE.BoxGeometry(.02,.08,3.2),B(0xffe9b0));win.position.set(.45,.12,-.2);P.add(win);const w2=win.clone();w2.position.x=-.45;P.add(w2);return P}
function runwayLights(scene,len=60,x=5.2,c=0xffd9a0,step=3.5,z0=0){const g=new THREE.SphereGeometry(.08,8,8),m=new THREE.InstancedMesh(g,B(c),len*2),mt=new THREE.Matrix4();for(let i=0;i<len;i++){mt.setPosition(-x,.1,z0-i*step);m.setMatrixAt(i*2,mt);mt.setPosition(x,.1,z0-i*step);m.setMatrixAt(i*2+1,mt)}scene.add(m);return m}
function ground(scene,c=0x0a0d14,o={}){const g=new THREE.Mesh(new THREE.PlaneGeometry(400,400),M(c,o));g.rotation.x=-Math.PI/2;scene.add(g);return g}
function snowPts(n=4000,area=40,h=20){const p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*area;p[i*3+1]=Math.random()*h;p[i*3+2]=(Math.random()-.5)*area}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const s=new THREE.Points(g,new THREE.PointsMaterial({size:.08,color:0xffffff,transparent:true,opacity:.9,depthWrite:false}));
 s.userData.step=dt=>{for(let i=0;i<n;i++){p[i*3+1]-=dt*(1+i%5*.3);p[i*3]+=Math.sin(i+performance.now()*.001)*dt*.3;if(p[i*3+1]<0)p[i*3+1]=h}g.attributes.position.needsUpdate=true};return s}
const AUR=`uniform float t;uniform float k;varying vec2 u;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
 float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
 void main(){vec2 p=u;vec3 sky=mix(vec3(.0,.01,.04),vec3(.01,.04,.12),p.y);float a=0.;
 for(int i=0;i<3;i++){float fi=float(i);float y=.55+.1*fi+.07*sin(p.x*3.+t*.25+fi)+.1*fbm(vec2(p.x*2.+t*.04,fi));a+=exp(-abs(p.y-y)*(16.-fi*3.))*fbm(vec2(p.x*7.-t*.2,p.y*18.+fi));}
 vec3 col=sky+a*mix(vec3(.15,1.,.6),vec3(.6,.25,1.),smoothstep(.5,1.,p.y))*(.6+k*1.4);col+=step(.998,h(floor(p*vec2(800.,1400.))))*p.y*.8;gl_FragColor=vec4(col,1.);}`;
function skyDome(frag,uni){const m=new THREE.ShaderMaterial({uniforms:uni,side:THREE.BackSide,depthWrite:false,vertexShader:'varying vec2 u;void main(){u=vec2(atan(position.x,-position.z)/6.283+.5,clamp(position.y/80.,0.,1.));gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:frag});return new THREE.Mesh(new THREE.SphereGeometry(100,64,32),m)}

 // --- original Norrsken (första versionen) ---
 scene=new THREE.Scene();scene.fog=new THREE.Fog(0x020611,30,150);cam=new THREE.PerspectiveCamera(60,W/H,.1,400);cam.position.set(0,2.5,14);
 const au={t:{value:0},k:{value:0}};scene.add(skyDome(AUR,au));S.au=au;ground(scene,0x0b1220,{roughness:.2,metalness:.5});
 const rw=new THREE.Mesh(new THREE.PlaneGeometry(10,300),M(0x141820,{roughness:.3,metalness:.4}));rw.rotation.x=-Math.PI/2;rw.position.set(0,.01,-120);scene.add(rw);
 S.rl=runwayLights(scene,80);const cm=B(0xffffff);for(let z=0;z>-280;z-=8){const d=new THREE.Mesh(new THREE.PlaneGeometry(.25,3),cm);d.rotation.x=-Math.PI/2;d.position.set(0,.02,z);scene.add(d)}
 const sn=snowPts(LOW?600:1200,60,15);sn.material.size=.05;scene.add(sn);S.sn=sn;scene.add(new THREE.HemisphereLight(0x50ffb0,0x000000,.25));
 const P=plane();P.scale.setScalar(1.5);P.position.set(0,10,-80);scene.add(P);S.P=P;
 // lyx: landningsljus på planet
 const ll=new THREE.Mesh(new THREE.SphereGeometry(.22,10,10),B(0xfff6dd));ll.position.set(0,-.3,-2.4);P.add(ll);const key=new THREE.DirectionalLight(0xdfe8ff,1.6);key.position.set(4,8,20);scene.add(key);scene.add(new THREE.AmbientLight(0x8090b0,.35));const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(255,240,200,.6)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})(),color:0xfff2cc,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.set(1.6,1.6,1);glow.position.set(0,-.3,-2.6);P.add(glow);const stb=new THREE.Mesh(new THREE.SphereGeometry(.12,8,8),B(0xffffff));stb.position.set(0,.9,2.6);P.add(stb);S.stb=stb;
 // --- flygledartornet (Lab 3 "Tornet") ---
 const tw=new THREE.Group();const sh=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.8,16,24),M(0xc9ccd2,{roughness:.5,emissive:0x2a3346}));sh.position.y=8;tw.add(sh);
 const cab=new THREE.Mesh(new THREE.CylinderGeometry(3.2,2.4,2.6,8,1,true),new THREE.MeshStandardMaterial({color:0x6fc8ff,emissive:0x2a9cff,emissiveIntensity:1.4,transparent:true,opacity:.85,side:THREE.DoubleSide}));cab.position.y=17.4;tw.add(cab);
 const roof=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.4,.4,8),M(0x2a2f38));roof.position.y=18.9;tw.add(roof);const bea=new THREE.Mesh(new THREE.SphereGeometry(.25),B(0xff2020));bea.position.y=19.8;tw.add(bea);
 const mast=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1),M(0x999999));mast.position.y=19.4;tw.add(mast);
 tw.scale.setScalar(.55);scene.add(tw);S.tw=tw;
 mkComp(.8,.6,.4);let tt=0;
 tick=dt=>{tt+=dt;au.t.value=tt;if(sn.visible)sn.userData.step(dt*.3);bea.visible=(tt%1.4)<.7;S.stb.visible=(tt%1.2)<.08;
  // inflygning: planet kommer in från horisonten och landar, var 14:e sekund
  const c=(tt%12)/12,k=Math.min(1,c/.8),q=(1-k)*(1-k);P.position.set(6*q,Math.max(.8,11*q+.8*k),-95+92*k-12*Math.max(0,(c-.8)/.2));P.rotation.set(-.08*(1-k),0,0);P.visible=c<.97;
  cam.lookAt(0,6,-30)};
 const place=()=>{const a=W/H;tw.position.set(a<.7?-6.5:-14,0,a<.7?-26:-34)};place();
 size();addEventListener('resize',()=>{size();place()});
 S.sn.visible=opt.snow!==false;const RL=S.rl,RLN=RL.count;
 let ex=opt.dark?0:1,exT=ex,last=performance.now(),run=true,raf=0,fpsAcc=0,fpsN=0,downgraded=LOW;
 function loop(n){raf=requestAnimationFrame(loop);let dt=Math.min(.05,(n-last)/1000);last=n;
  ex+=(exT-ex)*Math.min(1,dt*2.2);R.toneMappingExposure=.08+.72*ex;
  tick(dt);comp?comp.render():R.render(scene,cam);
  if(!downgraded){fpsAcc+=dt;fpsN++;if(fpsN==90){if(fpsAcc/90>1/40){downgraded=true;comp=null;R.setPixelRatio(.85);size()}}}}
 raf=requestAnimationFrame(loop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);run=false}else if(!run){run=true;last=performance.now();raf=requestAnimationFrame(loop)}});
 addEventListener('pagehide',()=>{cancelAnimationFrame(raf);run=false});
 return{low:LOW,ignite(v=1){exT=v},setExposure(v){ex=exT=v},snow(b){S.sn.visible=b},runway(f){RL.count=Math.round(RLN*Math.max(0,Math.min(1,f)))},flash(){au.k.value=1.2;const st=performance.now();(function f(){const k=(performance.now()-st)/2500;au.k.value=Math.max(0,1.2*(1-k));if(k<1)requestAnimationFrame(f)})()}}
}
