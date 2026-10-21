// Norrsken klassisk lyx – fristående 3D-himmel (från lab3, three.js). Testmaterial.
import * as THREE from './vendor/three/three.module.min.js';
import {EffectComposer} from './vendor/three/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from './vendor/three/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from './vendor/three/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from './vendor/three/jsm/postprocessing/OutputPass.js';
export function startSky(cv,opt={}){
 const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
 const gx=R.getContext();if(!gx)throw new Error('nogl');const dbg=gx.getExtension('WEBGL_debug_renderer_info'),GPU=dbg?gx.getParameter(dbg.UNMASKED_RENDERER_WEBGL):'';
 const LOW=opt.low||/swiftshader|llvmpipe|software/i.test(GPU)||(navigator.deviceMemory&&navigator.deviceMemory<=3)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||location.search.includes('low');
 const NOBLOOM=LOW||location.search.includes('nobloom');
 R.setPixelRatio(Math.min(devicePixelRatio,LOW?1:1.75));R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.8;
 let W=innerWidth,H=innerHeight,scene,cam,comp,tick=()=>{};const S={};
 function size(){W=innerWidth;H=innerHeight;R.setSize(W,H,false);if(cam){cam.aspect=W/H;cam.updateProjectionMatrix()}comp&&comp.setSize(W,H)}
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
function skyDome(frag,uni){const m=new THREE.ShaderMaterial({uniforms:uni,side:THREE.BackSide,depthWrite:false,vertexShader:'varying vec2 u;void main(){u=vec2(atan(position.x,-position.z)/6.283+.5,clamp(position.y/80.,0.,1.));gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:frag});return new THREE.Mesh(new THREE.SphereGeometry(100,64,32),m)}
const AURL=`uniform float t;uniform float k;varying vec2 u;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
 float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
 void main(){vec2 p=u;vec3 sky=mix(vec3(.0,.012,.045),vec3(.012,.035,.13),p.y);sky+=vec3(.02,.06,.07)*exp(-p.y*9.);float a=0.,halo=0.;
 for(int i=0;i<3;i++){float fi=float(i);float y=.55+.1*fi+.07*sin(p.x*3.+t*.2+fi)+.1*fbm(vec2(p.x*2.+t*.032,fi));float dd=abs(p.y-y);
  float rays=.75+.25*n(vec2(p.x*90.+fi*7.,t*.6));a+=exp(-dd*(16.-fi*3.))*fbm(vec2(p.x*7.-t*.16,p.y*18.+fi))*rays;halo+=exp(-dd*5.)*.08;}
 vec3 c1=vec3(.08,1.,.62),c2=vec3(.35,1.,.5),c3=vec3(.62,.26,1.),c4=vec3(1.,.35,.75);
 vec3 ac=mix(c1,c2,smoothstep(.4,.6,p.y));ac=mix(ac,c3,smoothstep(.6,.85,p.y));ac=mix(ac,c4,smoothstep(.88,1.,p.y)*.35);
 vec3 col=sky+(a*1.05+halo)*ac*(.6+k*1.4);
 vec2 sp=floor(p*vec2(800.,1400.));float s=h(sp);float tw=.55+.45*sin(t*(1.5+s*3.)+s*60.);col+=step(.9978,s)*p.y*.95*tw*vec3(.92,.96,1.);
 col+=step(.9996,h(floor(p*vec2(400.,700.))))*p.y*1.4*(.6+.4*sin(t*2.3+s*9.))*vec3(1.,.95,.85);
 gl_FragColor=vec4(col,1.);}`;

 scene=new THREE.Scene();scene.fog=new THREE.Fog(0x030817,34,160);cam=new THREE.PerspectiveCamera(60,W/H,.1,400);cam.position.set(0,2.5,14);
  const au={t:{value:0},k:{value:0}};scene.add(skyDome(AURL,au));S.au=au;
  const md=skyDome(AURL,au);md.geometry.dispose();md.geometry=new THREE.SphereGeometry(99,64,16,0,Math.PI*2,0,Math.PI/2);md.material.side=THREE.DoubleSide;md.scale.y=-1;md.position.y=-.05;scene.add(md);
  const gr=ground(scene,0x0b1426,{roughness:.15,metalness:.6});gr.material.transparent=true;gr.material.opacity=.8;
  const rw=new THREE.Mesh(new THREE.PlaneGeometry(10,300),M(0x141a24,{roughness:.25,metalness:.45,transparent:true,opacity:.88}));rw.rotation.x=-Math.PI/2;rw.position.set(0,.01,-120);scene.add(rw);
  S.rl=runwayLights(scene,80);const cm=B(0xffffff);for(let z=0;z>-280;z-=8){const d=new THREE.Mesh(new THREE.PlaneGeometry(.25,3),cm);d.rotation.x=-Math.PI/2;d.position.set(0,.02,z);scene.add(d)}
  const glw=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshBasicMaterial({color:0xffc880,transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false}));const GI=new THREE.InstancedMesh(glw.geometry,glw.material,160),mt=new THREE.Matrix4();let gi=0;
  for(let i=0;i<80;i++)for(const x of[-5.2,5.2]){mt.makeRotationX(-Math.PI/2);mt.setPosition(x,.03,-i*3.5);GI.setMatrixAt(gi++,mt)}scene.add(GI);
  const sn=snowPts(1500,60,15);sn.material.size=.05;sn.material.opacity=.8;scene.add(sn);S.sn=sn;
  const N=700,gp=new Float32Array(N*3),ph=new Float32Array(N);for(let i=0;i<N;i++){gp[i*3]=(Math.random()-.5)*50;gp[i*3+1]=.03;gp[i*3+2]=8-Math.random()*70;ph[i]=Math.random()*6.28}
  const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(gp,3));gg.setAttribute('ph',new THREE.BufferAttribute(ph,1));
  const gu={t:{value:0}};const gm=new THREE.ShaderMaterial({uniforms:gu,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:'attribute float ph;uniform float t;varying float a;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);a=pow(max(0.,sin(t*1.7+ph*7.)),12.);gl_PointSize=(2.+a*3.)*(30./-mv.z);gl_Position=projectionMatrix*mv;}',fragmentShader:'varying float a;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(vec3(.8,1.,.95),a*smoothstep(.5,0.,d));}'});
  const gl=new THREE.Points(gg,gm);gl.frustumCulled=false;scene.add(gl);
  scene.add(new THREE.HemisphereLight(0x60ffc0,0x050810,.32));const rim=new THREE.DirectionalLight(0x9a7cff,.35);rim.position.set(-10,20,-40);scene.add(rim);
  const P=plane();P.position.set(0,10,-80);scene.add(P);S.P=P;const PM=plane();PM.scale.y=-1;scene.add(PM);S.PM=PM;
  const nl=(c,x,y,z)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(.09,8,8),B(c));s.position.set(x,y,z);P.add(s);return s};S.navs=[nl(0xff3030,-3,-.1,.2),nl(0x30ff70,3,-.1,.2)];S.strobe=nl(0xffffff,0,.9,2.6);
  mkComp(1.0,.85,.32);let tt=0,px=0;
  tick=dt=>{tt+=dt;au.t.value=tt;gu.t.value=tt;sn.userData.step(dt*.28);
   if(!S.fly){P.position.set(Math.sin(tt*.06)*2.5,10+Math.sin(tt*.3)*.25,-80);P.rotation.set(0,0,Math.sin(tt*.06+1.57)*.05)}
   PM.position.set(P.position.x,-P.position.y,P.position.z);PM.rotation.copy(P.rotation);PM.rotation.z*=-1;
   S.strobe.visible=(tt%1.2)<.08;GI.material.opacity=.18+Math.sin(tt*2)*.04;
   cam.position.x=Math.sin(tt*.07)*.8;cam.position.y=2.5+Math.sin(tt*.11)*.15;cam.lookAt(0,6,-30)}
 ;size();addEventListener('resize',size);
 S.sn.visible=!!opt.snow;const RL=S.rl,RLN=RL.count;
 let ex=opt.dark?0:1,exT=ex,last=performance.now(),run=true,raf=0,fpsAcc=0,fpsN=0,downgraded=LOW;
 function loop(n){raf=requestAnimationFrame(loop);let dt=Math.min(.05,(n-last)/1000);last=n;
  ex+=(exT-ex)*Math.min(1,dt*2.2);R.toneMappingExposure=.08+.72*ex;
  tick(dt);comp?comp.render():R.render(scene,cam);
  if(!downgraded){fpsAcc+=dt;fpsN++;if(fpsN==90){if(fpsAcc/90>1/32){downgraded=true;comp=null;R.setPixelRatio(1);size()}}}}
 raf=requestAnimationFrame(loop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);run=false}else if(!run){run=true;last=performance.now();raf=requestAnimationFrame(loop)}});
 return{low:LOW,ignite(v=1){exT=v},setExposure(v){ex=exT=v},snow(b){S.sn.visible=b},runway(f){RL.count=Math.round(RLN*Math.max(0,Math.min(1,f)))},flash(){S.au.k.value=1.2;const st=performance.now();(function f(){const k=(performance.now()-st)/2500;S.au.k.value=Math.max(0,1.2*(1-k));if(k<1)requestAnimationFrame(f)})()}}
}
