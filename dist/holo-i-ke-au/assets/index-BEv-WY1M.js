var c0=Object.defineProperty;var l0=(o,t,e)=>t in o?c0(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var So=(o,t,e)=>l0(o,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();const ho=100,h0=8,nh=9e3,ea=1.3,u0=5.5,sh=100,f0=6e3;function ih(o){const t=Math.log(Math.max(1,o)/sh)/Math.log(f0/sh),e=Math.max(0,Math.min(1,t));return ea+(u0-ea)*e*e*(3-2*e)}const fd=2,ts=5,ro=32,rs=16,dd=1.6,ze={far:115,near:75,rig:[95,135],margin:7,band:.5,prefetch:320,linger:25,hold:90},d0=.024;function p0(){const t=new URLSearchParams(location.search).get("data")||"./data/";return t.endsWith("/")?t:`${t}/`}const m0=Math.PI/180;class pd{constructor({lat0:t=20.5,lon0:e=-157.5}={}){this.lat0=t,this.lon0=e,this.kx=Math.cos(t*m0)*111320/ho,this.kz=110574/ho}x(t){return(t-this.lon0)*this.kx}z(t){return-(t-this.lat0)*this.kz}toWorld(t){return[this.x(t[0]),this.z(t[1])]}toLonLat(t,e){return[t/this.kx+this.lon0,-e/this.kz+this.lat0]}rect([t,e,n,s]){return{x0:this.x(t),z0:this.z(s),x1:this.x(n),z1:this.z(e)}}}function lr(o){return String(o||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[ʻʼ‘’'`]/g,"").toLowerCase().replace(/[^a-z]/g,"")}function Xe(o){if(!o)return null;if(o.type==="Point")return o.coordinates;if(o.type==="LineString")return o.coordinates[Math.floor(o.coordinates.length/2)];if(o.type==="MultiPoint")return o.coordinates[0];const t=o.type==="Polygon"?[o.coordinates[0]]:o.type==="MultiPolygon"?o.coordinates.map(i=>i[0]):null;if(!t)return null;let e=0,n=0,s=0;for(const i of t)for(let a=0,r=i.length-1;a<i.length;r=a++){const c=i[r][0]*i[a][1]-i[a][0]*i[r][1];e+=c,n+=(i[r][0]+i[a][0])*c,s+=(i[r][1]+i[a][1])*c}return Math.abs(e)<1e-12?t[0][0]:[n/(3*e),s/(3*e)]}async function On(o){var l;const t=await fetch(o);if(!t.ok)throw new Error(`${o}: HTTP ${t.status}`);const e=await t.blob(),n=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),s=n.width,i=n.height;let a;typeof OffscreenCanvas<"u"?a=new OffscreenCanvas(s,i):(a=document.createElement("canvas"),a.width=s,a.height=i);const r=a.getContext("2d",{willReadFrequently:!0});r.imageSmoothingEnabled=!1,r.drawImage(n,0,0);const c=r.getImageData(0,0,s,i).data;return(l=n.close)==null||l.call(n),{px:c,W:s,H:i}}function md(o,t,e,n,s,i=4){const a=new Float32Array(t*e);for(let r=0,c=0;r<t*e;r++,c+=i)a[r]=(o[c]*256+o[c+1])*n+s;return a}function gd(o,t,e,n=4){const s=new Uint8Array(t*e);for(let i=0,a=0;i<t*e;i++,a+=n)s[i]=o[a];return s}function g0(o){let t=0,e=0;for(let n=0;n<o.length;n+=7)o[n]>0||(t++,o[n]>-1.6&&e++);return t>100&&e>t*.95}function x0(o,t,e,n,s){const i=vn(t,e,a=>o[a]>0,n,s);for(let a=0;a<o.length;a++){if(o[a]>0)continue;const r=i[a]/1e3;o[a]=-(1+30*r+3600*(1-Math.exp(-Math.max(0,r-.6)/6)))}}function jn(o,t,e,n,s=1){let i=Float32Array.from(o);const a=new Float32Array(t*e),r=1/(2*n+1);for(let c=0;c<s;c++){for(let l=0;l<e;l++){const h=l*t;let u=0;for(let f=-n;f<=n;f++)u+=i[h+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)a[h+f]=u*r,u+=i[h+Math.min(t-1,f+n+1)]-i[h+Math.max(0,f-n)]}for(let l=0;l<t;l++){let h=0;for(let u=-n;u<=n;u++)h+=a[Math.min(e-1,Math.max(0,u))*t+l];for(let u=0;u<e;u++)i[u*t+l]=h*r,h+=a[Math.min(e-1,u+n+1)*t+l]-a[Math.max(0,u-n)*t+l]}}return i}function oh(o,t,e,n,s,i){const a=i*i;let r=0;n[0]=0,s[0]=-1/0,s[1]=1/0;for(let c=1;c<t;c++){let l=(o[c]+c*c*a-(o[n[r]]+n[r]*n[r]*a))/(2*a*(c-n[r]));for(;l<=s[r];)r--,l=(o[c]+c*c*a-(o[n[r]]+n[r]*n[r]*a))/(2*a*(c-n[r]));r++,n[r]=c,s[r]=l,s[r+1]=1/0}r=0;for(let c=0;c<t;c++){for(;s[r+1]<c;)r++;const l=(c-n[r])*i;e[c]=l*l+o[n[r]]}}function vn(o,t,e,n=1,s=1){const a=new Float64Array(o*t);for(let d=0;d<o*t;d++)a[d]=e(d)?0:1e20;const r=Math.max(o,t),c=new Float64Array(r),l=new Float64Array(r),h=new Int32Array(r),u=new Float64Array(r+1);for(let d=0;d<o;d++){for(let m=0;m<t;m++)c[m]=a[m*o+d];oh(c,t,l,h,u,s);for(let m=0;m<t;m++)a[m*o+d]=l[m]}const f=new Float32Array(o*t);for(let d=0;d<t;d++){const m=d*o;for(let x=0;x<o;x++)c[x]=a[m+x];oh(c,o,l,h,u,n);for(let x=0;x<o;x++)f[m+x]=Math.sqrt(l[x])}return f}function xd(o,t,e,n,s){const i=Math.max(1,Math.round(Math.max(t,e)/512)),a=Math.ceil(t/i),r=Math.ceil(e/i),c=new Float32Array(a*r);for(let f=0;f<r;f++)for(let d=0;d<a;d++){let m=0,x=0;for(let g=f*i;g<Math.min(e,(f+1)*i);g++)for(let p=d*i;p<Math.min(t,(d+1)*i);p++)m+=Math.max(0,o[g*t+p]),x++;c[f*a+d]=m/x*ea}const l=new Float32Array(a*r),h=[1,2,3,5,7,10,14,19,26,34],u=[];for(let f=0;f<8;f++)u.push([Math.cos(f*Math.PI/4),Math.sin(f*Math.PI/4)]);for(let f=0;f<r;f++)for(let d=0;d<a;d++){const m=c[f*a+d];if(m<=0){l[f*a+d]=1;continue}let x=0;for(const[g,p]of u){let v=0;const w=Math.hypot(g*n,p*s)*i;for(const b of h){const y=Math.round(d+g*b),S=Math.round(f+p*b);if(y<0||S<0||y>=a||S>=r)break;const E=(c[S*a+y]-m)/(b*w);E>v&&(v=E)}x+=v/Math.sqrt(1+v*v)}l[f*a+d]=1-x/8*.95}return{data:l,w:a,h:r,f:i}}function vd(o,t,e,n,s,i){const a=new Uint8Array(t*e*4),r=fd;for(let c=0;c<e;c++){const l=Math.max(0,c-1),h=Math.min(e-1,c+1);for(let u=0;u<t;u++){const f=c*t+u,d=Math.max(0,u-1),m=Math.min(t-1,u+1),x=(o[c*t+m]-o[c*t+d])/((m-d)*n),g=(o[h*t+u]-o[l*t+u])/((h-l)*s),p=-x*r,v=-g*r,w=Math.hypot(p,1,v);a[f*4]=Math.round((p/w*.5+.5)*255),a[f*4+1]=Math.round((1/w*.5+.5)*255),a[f*4+2]=Math.round((v/w*.5+.5)*255);let b=1;if(i){const y=Math.min(i.w-1.001,Math.max(0,(u+.5)/i.f-.5)),S=Math.min(i.h-1.001,Math.max(0,(c+.5)/i.f-.5)),E=y|0,T=S|0,_=y-E,M=S-T,A=T*i.w+E,R=i.data,k=Math.min(i.w-1,E+1)-E,C=Math.min(i.h-1,T+1)-T,z=R[A]+(R[A+k]-R[A])*_,I=R[A+C*i.w]+(R[A+C*i.w+k]-R[A+C*i.w])*_;b=z+(I-z)*M}a[f*4+3]=Math.round(Math.max(0,Math.min(1,b))*255)}}return a}function wd(o,t,e,n,s){const i=t*e,a=n*s/1e6,r=new Float32Array(i);let c=0,l=0;for(let g=0;g<i;g++)o[g]>0&&(r[g]=a,o[g]>c&&(c=o[g]),l++);if(!l)return r;const h=Math.min(65536,Math.ceil(c)+2),u=g=>Math.min(h-1,Math.floor(g/c*(h-2))),f=new Uint32Array(h+1);for(let g=0;g<i;g++)o[g]>0&&f[u(o[g])+1]++;for(let g=0;g<h;g++)f[g+1]+=f[g];const d=new Uint32Array(l),m=f.slice();for(let g=0;g<i;g++)o[g]>0&&(d[m[u(o[g])]++]=g);const x=Math.hypot(n,s);for(let g=l-1;g>=0;g--){const p=d[g],v=p%t,w=(p-v)/t,b=o[p];let y=-1,S=0;for(let E=-1;E<=1;E++){const T=w+E;if(!(T<0||T>=e))for(let _=-1;_<=1;_++){if(!_&&!E)continue;const M=v+_;if(M<0||M>=t)continue;const A=T*t+M,R=(b-o[A])/(_&&E?x:_?n:s);R>S&&(S=R,y=A)}}y>=0&&o[y]>0&&(r[y]+=r[p])}return r}function v0(o,t,e,n,s,i){const a=e*n,r=new Uint8Array(a*4),c=wd(o,e,n,s,i),l=s*i/1e6,h=Math.max(.04,4*l),u=new Float32Array(a);for(let p=0;p<a;p++)u[p]=o[p]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,c[p])/h)/1.6)):0;const f=jn(u,e,n,1,2),d=vn(e,n,p=>o[p]<=0,s,i),m=new Float32Array(a);for(let p=0;p<n;p++)for(let v=0;v<e;v++){const w=p*e+v;if(o[w]<=0||o[w]>9)continue;const b=Math.min(e-1,v+1),y=Math.max(0,v-1),S=Math.min(n-1,p+1),E=Math.max(0,p-1),T=Math.hypot((o[p*e+b]-o[p*e+y])/((b-y)*s),(o[S*e+v]-o[E*e+v])/((S-E)*i));m[w]=d[w]<260+Math.max(s,i)&&T<.12?1:0}const x=jn(m,e,n,1,1),g=1.5*Math.min(1,70/Math.max(s,i));for(let p=0;p<a;p++)r[p*4]=t?t[p]:o[p]>0?82:0,r[p*4+1]=Math.round(255*Math.min(1,x[p]*g)),r[p*4+2]=Math.round(255*Math.min(1,f[p]*1.6)),r[p*4+3]=0;return r}function w0({heightPx:o,rainPx:t,W:e,H:n,scale:s,offset:i,mx:a,mz:r,stride:c=4}){const l=md(o,e,n,s,i,c),h=g0(l);h&&x0(l,e,n,a,r);const u=t?gd(t,e,n,c):null,f=xd(l,e,n,a,r),d=vd(l,e,n,a,r,f),m=v0(l,u,e,n,a,r);let x=1/0,g=-1/0;for(let p=0;p<l.length;p++)l[p]<x&&(x=l[p]),l[p]>g&&(g=l[p]);return{metres:l,normals:d,land:m,flatSea:h,lo:x,hi:g}}async function pa(o){try{const t=await fetch(o);return t.ok?await t.json():null}catch{return null}}async function y0(o,t,e=console.warn){var b,y,S,E;const n=await pa(o("geology/manifest.json"));if(!((y=(b=n==null?void 0:n.seafloor)==null?void 0:b.height)!=null&&y.file))return null;const[s,i,a]=await Promise.all([pa(o("geology/chapters.json")),pa(o("geology/landslides.geojson")),pa(o("geology/volcanoes.json"))]),r=Array.isArray(s)?s:s==null?void 0:s.chapters;if(!Array.isArray(r)||!r.length)return e("geology/manifest.json is here but geology/chapters.json has no chapters: no prologue"),null;const c=n.seafloor,l=t.rect(c.bounds),[h,u]=c.size,f=T=>({url:o(`geology/${T.file}`),scale:T.scale??.25,offset:T.offset??-6e3}),d={rect:l,W:h,H:u,...f(c.height),stats:c.stats||null,sources:c.sources||[]},m=(n.stages||[]).filter(T=>(T==null?void 0:T.id)&&Number.isFinite(T.age)).map(T=>{var _;return{...T,...(_=T.height)!=null&&_.file&&T.height.file!==c.height.file?f(T.height):{url:null,seafloor:!0}}});m.some(T=>T.id==="present")||m.push({id:"present",age:0,method:"survey",seafloor:!0,url:null}),m.sort((T,_)=>_.age-T.age);const x=n.hotspot||(Array.isArray(a)?null:a==null?void 0:a.hotspot)||{},[g,p]=Array.isArray(x.position)?x.position:[x.lon,x.lat],v={lon:g,lat:p,at:Number.isFinite(g)&&Number.isFinite(p)?t.toWorld([g,p]):null,speed:Number.isFinite(x.speed)?x.speed:0,azimuth:Number.isFinite(x.azimuth)?x.azimuth:295,sources:x.sources||[]},w=new Map;for(const T of(i==null?void 0:i.features)||[]){const _=T.properties||{};!_.id||((S=T.geometry)==null?void 0:S.type)!=="Polygon"||w.set(_.id,{..._,ring:T.geometry.coordinates[0],scarRing:((E=_.scar)==null?void 0:E.type)==="Polygon"?_.scar.coordinates[0]:null,blocks:(_.blocks||[]).filter(M=>{var A;return(M==null?void 0:M.coordinates)||((A=M==null?void 0:M.geometry)==null?void 0:A.coordinates)})})}return{manifest:n,seafloor:d,stages:m,hotspot:v,fields:w,chapters:r,sources:n.sources||[]}}function wr(o,t){const e=Math.max(0,t)*((o==null?void 0:o.speed)||0)*10,n=((o==null?void 0:o.azimuth)??295)*Math.PI/180;return[-Math.sin(n)*e*10,Math.cos(n)*e*10]}const Ci=4;function M0(o,t,e,n,s){const i=new Uint16Array(t*e),a=new Float32Array(1),r=new Uint32Array(a.buffer),c=m=>{a[0]=m;const x=r[0],g=x>>>16&32768;let p=(x>>>23&255)-127+15;const v=x&8388607;if(p<=0)return g;if(p>=31)return g|31744;let w=g|p<<10|v>>>13;return v&4096&&w++,w},l=Math.ceil(t/Ci),h=Math.ceil(e/Ci),u=new Float32Array(l*h);let f=1/0,d=-1/0;for(let m=0;m<e;m++)for(let x=0;x<t;x++){const g=m*t+x,p=(o[g*4]*256+o[g*4+1])*n+s;i[g]=c(p),p<f&&(f=p),p>d&&(d=p),x%Ci===0&&m%Ci===0&&(u[m/Ci*l+x/Ci]=p)}return{half:i,coarse:u,cw:l,ch:h,lo:f,hi:d}}class _0{constructor(t=console.warn){this.warn=t,this.jobs=new Map,this.next=1;try{this.worker=new Worker(new URL(""+new URL("geology-worker-D8Cbshcf.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=e=>this.message(e.data),this.worker.onerror=e=>{var n;(n=e.preventDefault)==null||n.call(e),this.worker=null;for(const[s,i]of this.jobs)this.main(s,i)}}catch{this.worker=null}}decode(t,e,n){return new Promise((s,i)=>{const a=this.next++,r={img:t,W:e,H:n,resolve:s,reject:i};this.jobs.set(a,r),this.worker?this.worker.postMessage({id:a,url:t.url,W:e,H:n,scale:t.scale,offset:t.offset}):this.main(a,r)})}message(t){var n;const e=this.jobs.get(t.id);if(e){if(!t.ok&&/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message))return(n=this.worker)==null||n.terminate(),this.worker=null,this.main(t.id,e);this.jobs.delete(t.id),t.ok?e.resolve(t.out):e.reject(new Error(t.message))}}async main(t,e){try{const n=await On(e.img.url);if(n.W!==e.W||n.H!==e.H)throw new Error(`${e.img.url} is ${n.W}×${n.H}, the geology manifest says ${e.W}×${e.H}`);this.jobs.delete(t),e.resolve(M0(n.px,e.W,e.H,e.img.scale,e.img.offset))}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){var t;(t=this.worker)==null||t.terminate(),this.worker=null}}async function Us(o,t,e){try{const n=await fetch(o);if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}catch(n){if(t===void 0)throw new Error(`${o}: ${n.message}`);return e==null||e(`${o}: ${n.message} (carrying on without it)`),t}}const ma=(o,t)=>Array.isArray(o)?o:Array.isArray(o==null?void 0:o[t])?o[t]:[];async function b0(o,t=console.warn){const e=m=>new URL(m,new URL(o,location.href)).href,n=await Us(e("manifest.json")),s=new pd(n.projection||{}),i=y0(e,s,t),[a,r,c,l,h,u,f]=await Promise.all([Us(e("boundaries/moku.geojson"),null,t),Us(e("boundaries/ahupuaa.geojson"),null,t),Us(e("eras.json"),[],t),Us(e("places.json"),[],t),Us(e("events.json"),[],t),Us(e("sources.json"),[],t),Us(e("polities.json"),{polities:[],byEra:{}},t)]),d=(n.packs||[]).map(m=>S0(m,s,e));return{base:o,abs:e,manifest:n,proj:s,packs:d,moku:a,ahupuaa:r,eras:ma(c,"eras"),places:ma(l,"places"),events:ma(h,"events"),sources:ma(u,"sources"),polities:{polities:(f==null?void 0:f.polities)||[],byEra:(f==null?void 0:f.byEra)||{}},geology:await i}}function S0(o,t,e){var a;const n=t.rect(o.bounds),[s,i]=o.size;return{id:o.id,kind:o.kind,name:o.name||o.id,desc:o,rect:n,W:s,H:i,mx:(n.x1-n.x0)*ho/s,mz:(n.z1-n.z0)*ho/i,heightUrl:e(o.height.file),rainUrl:(a=o.rain)!=null&&a.file?e(o.rain.file):null,scale:o.height.scale??.25,offset:o.height.offset??-6e3,sources:o.sources||[],data:null}}class E0{constructor(t=2,e=console.warn){this.warn=e,this.jobs=new Map,this.next=1,this.workers=[],this.free=[],this.queue=[];try{for(let n=0;n<t;n++){const s=new Worker(new URL(""+new URL("worker-D-2AoFNa.js",import.meta.url).href,import.meta.url),{type:"module"});s.onmessage=i=>this.message(s,i.data),s.onerror=i=>{var a;(a=i.preventDefault)==null||a.call(i),this.fallback=!0;for(const[r,c]of this.jobs)c.worker===s&&this.mainThread(r,c)},this.workers.push(s),this.free.push(s)}}catch{this.fallback=!0}}decode(t){return new Promise((e,n)=>{const s=this.next++,i={pack:t,resolve:e,reject:n};this.jobs.set(s,i),this.fallback||!this.workers.length?this.mainThread(s,i):(this.queue.push(s),this.pump())})}pump(){for(;this.free.length&&this.queue.length;){const t=this.queue.shift(),e=this.jobs.get(t),n=this.free.pop();e.worker=n;const s=e.pack;n.postMessage({job:t,heightUrl:s.heightUrl,rainUrl:s.rainUrl,W:s.W,H:s.H,scale:s.scale,offset:s.offset,mx:s.mx,mz:s.mz})}}message(t,e){const n=this.jobs.get(e.job);if(n){if(e.warn)return this.warn(e.warn);this.jobs.delete(e.job),this.free.push(t),e.ok?n.resolve(e):/OffscreenCanvas|getContext|createImageBitmap/i.test(e.message)?(this.fallback=!0,this.jobs.set(e.job,n),this.mainThread(e.job,n)):n.reject(new Error(e.message)),this.pump()}}async mainThread(t,e){try{const n=e.pack,s=await On(n.heightUrl);if(s.W!==n.W||s.H!==n.H)throw new Error(`${n.heightUrl} is ${s.W}×${s.H}, the manifest says ${n.W}×${n.H}`);let i=null;n.rainUrl&&(i=await On(n.rainUrl).then(r=>r.W===n.W&&r.H===n.H?r.px:null).catch(()=>null));const a=w0({heightPx:s.px,rainPx:i,W:n.W,H:n.H,scale:n.scale,offset:n.offset,mx:n.mx,mz:n.mz});this.jobs.delete(t),e.resolve(a)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){for(const t of this.workers)t.terminate()}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const kl="160",A0=0,ah=1,T0=2,yd=1,C0=2,ys=3,Ps=0,pn=1,Un=2,Ls=0,co=1,el=2,rh=3,nl=4,R0=5,di=100,L0=101,P0=102,ch=103,lh=104,k0=200,D0=201,z0=202,I0=203,sl=204,il=205,F0=206,U0=207,N0=208,O0=209,B0=210,W0=211,H0=212,G0=213,V0=214,$0=0,j0=1,q0=2,yr=3,X0=4,Y0=5,K0=6,Z0=7,Md=0,J0=1,Q0=2,Ys=0,tm=1,em=2,nm=3,sm=4,im=5,om=6,_d=300,uo=301,fo=302,ol=303,al=304,Hr=306,Mr=1e3,Ze=1001,rl=1002,ie=1003,hh=1004,ec=1005,Fe=1006,am=1007,bi=1008,pe=1009,rm=1010,cm=1011,Dl=1012,bd=1013,As=1014,Ts=1015,ks=1016,Sd=1017,Ed=1018,wi=1020,lm=1021,Ae=1023,hm=1024,um=1025,yi=1026,po=1027,zs=1028,Ad=1029,Td=1030,Cd=1031,Rd=1033,nc=33776,sc=33777,ic=33778,oc=33779,uh=35840,fh=35841,dh=35842,ph=35843,Ld=36196,mh=37492,gh=37496,xh=37808,vh=37809,wh=37810,yh=37811,Mh=37812,_h=37813,bh=37814,Sh=37815,Eh=37816,Ah=37817,Th=37818,Ch=37819,Rh=37820,Lh=37821,ac=36492,Ph=36494,kh=36495,fm=36283,Dh=36284,zh=36285,Ih=36286,Pd=3e3,Mi=3001,dm=3200,pm=3201,mm=0,gm=1,Nn="",Ke="srgb",Ds="srgb-linear",zl="display-p3",Gr="display-p3-linear",_r="linear",me="srgb",br="rec709",Sr="p3",Ri=7680,Fh=519,xm=512,vm=513,wm=514,kd=515,ym=516,Mm=517,_m=518,bm=519,Uh=35044,an=35048,Nh="300 es",cl=1035,Cs=2e3,Er=2001;class xo{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const i=s.indexOf(e);i!==-1&&s.splice(i,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let i=0,a=s.length;i<a;i++)s[i].call(this,t);t.target=null}}}const tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Oh=1234567;const Ho=Math.PI/180,na=180/Math.PI;function vo(){const o=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[o&255]+tn[o>>8&255]+tn[o>>16&255]+tn[o>>24&255]+"-"+tn[t&255]+tn[t>>8&255]+"-"+tn[t>>16&15|64]+tn[t>>24&255]+"-"+tn[e&63|128]+tn[e>>8&255]+"-"+tn[e>>16&255]+tn[e>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function fn(o,t,e){return Math.max(t,Math.min(e,o))}function Il(o,t){return(o%t+t)%t}function Sm(o,t,e,n,s){return n+(o-t)*(s-n)/(e-t)}function Em(o,t,e){return o!==t?(e-o)/(t-o):0}function Go(o,t,e){return(1-e)*o+e*t}function Am(o,t,e,n){return Go(o,t,1-Math.exp(-e*n))}function Tm(o,t=1){return t-Math.abs(Il(o,t*2)-t)}function Cm(o,t,e){return o<=t?0:o>=e?1:(o=(o-t)/(e-t),o*o*(3-2*o))}function Rm(o,t,e){return o<=t?0:o>=e?1:(o=(o-t)/(e-t),o*o*o*(o*(o*6-15)+10))}function Lm(o,t){return o+Math.floor(Math.random()*(t-o+1))}function Pm(o,t){return o+Math.random()*(t-o)}function km(o){return o*(.5-Math.random())}function Dm(o){o!==void 0&&(Oh=o);let t=Oh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function zm(o){return o*Ho}function Im(o){return o*na}function ll(o){return(o&o-1)===0&&o!==0}function Fm(o){return Math.pow(2,Math.ceil(Math.log(o)/Math.LN2))}function Ar(o){return Math.pow(2,Math.floor(Math.log(o)/Math.LN2))}function Um(o,t,e,n,s){const i=Math.cos,a=Math.sin,r=i(e/2),c=a(e/2),l=i((t+n)/2),h=a((t+n)/2),u=i((t-n)/2),f=a((t-n)/2),d=i((n-t)/2),m=a((n-t)/2);switch(s){case"XYX":o.set(r*h,c*u,c*f,r*l);break;case"YZY":o.set(c*f,r*h,c*u,r*l);break;case"ZXZ":o.set(c*u,c*f,r*h,r*l);break;case"XZX":o.set(r*h,c*m,c*d,r*l);break;case"YXY":o.set(c*d,r*h,c*m,r*l);break;case"ZYZ":o.set(c*m,c*d,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Xi(o,t){switch(t.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function ln(o,t){switch(t.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}const nn={DEG2RAD:Ho,RAD2DEG:na,generateUUID:vo,clamp:fn,euclideanModulo:Il,mapLinear:Sm,inverseLerp:Em,lerp:Go,damp:Am,pingpong:Tm,smoothstep:Cm,smootherstep:Rm,randInt:Lm,randFloat:Pm,randFloatSpread:km,seededRandom:Dm,degToRad:zm,radToDeg:Im,isPowerOfTwo:ll,ceilPowerOfTwo:Fm,floorPowerOfTwo:Ar,setQuaternionFromProperEuler:Um,normalize:ln,denormalize:Xi};class Bt{constructor(t=0,e=0){Bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(fn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),i=this.x-t.x,a=this.y-t.y;return this.x=i*n-a*s+t.x,this.y=i*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class te{constructor(t,e,n,s,i,a,r,c,l){te.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,i,a,r,c,l)}set(t,e,n,s,i,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=i,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,i=this.elements,a=n[0],r=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],m=n[8],x=s[0],g=s[3],p=s[6],v=s[1],w=s[4],b=s[7],y=s[2],S=s[5],E=s[8];return i[0]=a*x+r*v+c*y,i[3]=a*g+r*w+c*S,i[6]=a*p+r*b+c*E,i[1]=l*x+h*v+u*y,i[4]=l*g+h*w+u*S,i[7]=l*p+h*b+u*E,i[2]=f*x+d*v+m*y,i[5]=f*g+d*w+m*S,i[8]=f*p+d*b+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],i=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-n*i*h+n*r*c+s*i*l-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],i=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*a-r*l,f=r*c-h*i,d=l*i-a*c,m=e*u+n*f+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return t[0]=u*x,t[1]=(s*l-h*n)*x,t[2]=(r*n-s*a)*x,t[3]=f*x,t[4]=(h*e-s*c)*x,t[5]=(s*i-r*e)*x,t[6]=d*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*i)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,i,a,r){const c=Math.cos(i),l=Math.sin(i);return this.set(n*c,n*l,-n*(c*a+l*r)+a+t,-s*l,s*c,-s*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(rc.makeScale(t,e)),this}rotate(t){return this.premultiply(rc.makeRotation(-t)),this}translate(t,e){return this.premultiply(rc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const rc=new te;function Dd(o){for(let t=o.length-1;t>=0;--t)if(o[t]>=65535)return!0;return!1}function Tr(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function Nm(){const o=Tr("canvas");return o.style.display="block",o}const Bh={};function Vo(o){o in Bh||(Bh[o]=!0,console.warn(o))}const Wh=new te().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Hh=new te().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ga={[Ds]:{transfer:_r,primaries:br,toReference:o=>o,fromReference:o=>o},[Ke]:{transfer:me,primaries:br,toReference:o=>o.convertSRGBToLinear(),fromReference:o=>o.convertLinearToSRGB()},[Gr]:{transfer:_r,primaries:Sr,toReference:o=>o.applyMatrix3(Hh),fromReference:o=>o.applyMatrix3(Wh)},[zl]:{transfer:me,primaries:Sr,toReference:o=>o.convertSRGBToLinear().applyMatrix3(Hh),fromReference:o=>o.applyMatrix3(Wh).convertLinearToSRGB()}},Om=new Set([Ds,Gr]),ue={enabled:!0,_workingColorSpace:Ds,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(o){if(!Om.has(o))throw new Error(`Unsupported working color space, "${o}".`);this._workingColorSpace=o},convert:function(o,t,e){if(this.enabled===!1||t===e||!t||!e)return o;const n=ga[t].toReference,s=ga[e].fromReference;return s(n(o))},fromWorkingColorSpace:function(o,t){return this.convert(o,this._workingColorSpace,t)},toWorkingColorSpace:function(o,t){return this.convert(o,t,this._workingColorSpace)},getPrimaries:function(o){return ga[o].primaries},getTransfer:function(o){return o===Nn?_r:ga[o].transfer}};function lo(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function cc(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let Li;class zd{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Li===void 0&&(Li=Tr("canvas")),Li.width=t.width,Li.height=t.height;const n=Li.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Li}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Tr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),i=s.data;for(let a=0;a<i.length;a++)i[a]=lo(i[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(lo(e[n]/255)*255):e[n]=lo(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Bm=0;class Id{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Bm++}),this.uuid=vo(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let i;if(Array.isArray(s)){i=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?i.push(lc(s[a].image)):i.push(lc(s[a]))}else i=lc(s);n.url=i}return e||(t.images[this.uuid]=n),n}}function lc(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?zd.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Wm=0;class mn extends xo{constructor(t=mn.DEFAULT_IMAGE,e=mn.DEFAULT_MAPPING,n=Ze,s=Ze,i=Fe,a=bi,r=Ae,c=pe,l=mn.DEFAULT_ANISOTROPY,h=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wm++}),this.uuid=vo(),this.name="",this.source=new Id(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=i,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Bt(0,0),this.repeat=new Bt(1,1),this.center=new Bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Vo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Mi?Ke:Nn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==_d)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Mr:t.x=t.x-Math.floor(t.x);break;case Ze:t.x=t.x<0?0:1;break;case rl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Mr:t.y=t.y-Math.floor(t.y);break;case Ze:t.y=t.y<0?0:1;break;case rl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Vo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ke?Mi:Pd}set encoding(t){Vo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Mi?Ke:Nn}}mn.DEFAULT_IMAGE=null;mn.DEFAULT_MAPPING=_d;mn.DEFAULT_ANISOTROPY=1;class Yt{constructor(t=0,e=0,n=0,s=1){Yt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,i=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*i,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*i,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*i,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*i,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,i;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(l+1)/2,b=(d+1)/2,y=(p+1)/2,S=(h+f)/4,E=(u+x)/4,T=(m+g)/4;return w>b&&w>y?w<.01?(n=0,s=.707106781,i=.707106781):(n=Math.sqrt(w),s=S/n,i=E/n):b>y?b<.01?(n=.707106781,s=0,i=.707106781):(s=Math.sqrt(b),n=S/s,i=T/s):y<.01?(n=.707106781,s=.707106781,i=0):(i=Math.sqrt(y),n=E/i,s=T/i),this.set(n,s,i,e),this}let v=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(u-x)/v,this.z=(f-h)/v,this.w=Math.acos((l+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Hm extends xo{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Yt(0,0,t,e),this.scissorTest=!1,this.viewport=new Yt(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(Vo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Mi?Ke:Nn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Fe,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new mn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Id(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class cs extends Hm{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Fd extends mn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ie,this.minFilter=ie,this.wrapR=Ze,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gm extends mn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ie,this.minFilter=ie,this.wrapR=Ze,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,i,a,r){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=i[a+0],d=i[a+1],m=i[a+2],x=i[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=f,t[e+1]=d,t[e+2]=m,t[e+3]=x;return}if(u!==x||c!==f||l!==d||h!==m){let g=1-r;const p=c*f+l*d+h*m+u*x,v=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const y=Math.sqrt(w),S=Math.atan2(y,p*v);g=Math.sin(g*S)/y,r=Math.sin(r*S)/y}const b=r*v;if(c=c*g+f*b,l=l*g+d*b,h=h*g+m*b,u=u*g+x*b,g===1-r){const y=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=y,l*=y,h*=y,u*=y}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,i,a){const r=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=i[a],f=i[a+1],d=i[a+2],m=i[a+3];return t[e]=r*m+h*u+c*d-l*f,t[e+1]=c*m+h*f+l*u-r*d,t[e+2]=l*m+h*d+r*f-c*u,t[e+3]=h*m-r*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,i=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(n/2),h=r(s/2),u=r(i/2),f=c(n/2),d=c(s/2),m=c(i/2);switch(a){case"XYZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"YXZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"ZXY":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"ZYX":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"YZX":this._x=f*h*u+l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u-f*d*m;break;case"XZY":this._x=f*h*u-l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u+f*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],i=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+r+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(i-l)*d,this._z=(a-s)*d}else if(n>r&&n>u){const d=2*Math.sqrt(1+n-r-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(i+l)/d}else if(r>u){const d=2*Math.sqrt(1+r-n-u);this._w=(i-l)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-r);this._w=(a-s)/d,this._x=(i+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(fn(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,i=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*r+s*l-i*c,this._y=s*h+a*c+i*r-n*l,this._z=i*h+a*l+n*c-s*r,this._w=a*h-n*r-s*c-i*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,i=this._z,a=this._w;let r=a*t._w+n*t._x+s*t._y+i*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=n,this._y=s,this._z=i,this;const c=1-r*r;if(c<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*i+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=i*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),i=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(i),n*Math.cos(i),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(t=0,e=0,n=0){W.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Gh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Gh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6]*s,this.y=i[1]*e+i[4]*n+i[7]*s,this.z=i[2]*e+i[5]*n+i[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,i=t.elements,a=1/(i[3]*e+i[7]*n+i[11]*s+i[15]);return this.x=(i[0]*e+i[4]*n+i[8]*s+i[12])*a,this.y=(i[1]*e+i[5]*n+i[9]*s+i[13])*a,this.z=(i[2]*e+i[6]*n+i[10]*s+i[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,i=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*s-r*n),h=2*(r*e-i*s),u=2*(i*n-a*e);return this.x=e+c*l+a*u-r*h,this.y=n+c*h+r*l-i*u,this.z=s+c*u+i*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,i=t.elements;return this.x=i[0]*e+i[4]*n+i[8]*s,this.y=i[1]*e+i[5]*n+i[9]*s,this.z=i[2]*e+i[6]*n+i[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,i=t.z,a=e.x,r=e.y,c=e.z;return this.x=s*c-i*r,this.y=i*a-n*c,this.z=n*r-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return hc.copy(this).projectOnVector(t),this.sub(hc)}reflect(t){return this.sub(hc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(fn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const hc=new W,Gh=new hs;class yn{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Wn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Wn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Wn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const i=n.getAttribute("position");if(e===!0&&i!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=i.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,Wn):Wn.fromBufferAttribute(i,a),Wn.applyMatrix4(t.matrixWorld),this.expandByPoint(Wn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xa.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xa.copy(n.boundingBox)),xa.applyMatrix4(t.matrixWorld),this.union(xa)}const s=t.children;for(let i=0,a=s.length;i<a;i++)this.expandByObject(s[i],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Wn),Wn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Eo),va.subVectors(this.max,Eo),Pi.subVectors(t.a,Eo),ki.subVectors(t.b,Eo),Di.subVectors(t.c,Eo),Ns.subVectors(ki,Pi),Os.subVectors(Di,ki),si.subVectors(Pi,Di);let e=[0,-Ns.z,Ns.y,0,-Os.z,Os.y,0,-si.z,si.y,Ns.z,0,-Ns.x,Os.z,0,-Os.x,si.z,0,-si.x,-Ns.y,Ns.x,0,-Os.y,Os.x,0,-si.y,si.x,0];return!uc(e,Pi,ki,Di,va)||(e=[1,0,0,0,1,0,0,0,1],!uc(e,Pi,ki,Di,va))?!1:(wa.crossVectors(Ns,Os),e=[wa.x,wa.y,wa.z],uc(e,Pi,ki,Di,va))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Wn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Wn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ps[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ps[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ps[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ps[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ps[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ps[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ps[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ps[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ps),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const ps=[new W,new W,new W,new W,new W,new W,new W,new W],Wn=new W,xa=new yn,Pi=new W,ki=new W,Di=new W,Ns=new W,Os=new W,si=new W,Eo=new W,va=new W,wa=new W,ii=new W;function uc(o,t,e,n,s){for(let i=0,a=o.length-3;i<=a;i+=3){ii.fromArray(o,i);const r=s.x*Math.abs(ii.x)+s.y*Math.abs(ii.y)+s.z*Math.abs(ii.z),c=t.dot(ii),l=e.dot(ii),h=n.dot(ii);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const Vm=new yn,Ao=new W,fc=new W;class Js{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Vm.setFromPoints(t).getCenter(n);let s=0;for(let i=0,a=t.length;i<a;i++)s=Math.max(s,n.distanceToSquared(t[i]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ao.subVectors(t,this.center);const e=Ao.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ao,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(fc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ao.copy(t.center).add(fc)),this.expandByPoint(Ao.copy(t.center).sub(fc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ms=new W,dc=new W,ya=new W,Bs=new W,pc=new W,Ma=new W,mc=new W;class Fl{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ms)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ms.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ms.copy(this.origin).addScaledVector(this.direction,e),ms.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){dc.copy(t).add(e).multiplyScalar(.5),ya.copy(e).sub(t).normalize(),Bs.copy(this.origin).sub(dc);const i=t.distanceTo(e)*.5,a=-this.direction.dot(ya),r=Bs.dot(this.direction),c=-Bs.dot(ya),l=Bs.lengthSq(),h=Math.abs(1-a*a);let u,f,d,m;if(h>0)if(u=a*c-r,f=a*r-c,m=i*h,u>=0)if(f>=-m)if(f<=m){const x=1/h;u*=x,f*=x,d=u*(u+a*f+2*r)+f*(a*u+f+2*c)+l}else f=i,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*c)+l;else f=-i,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*c)+l;else f<=-m?(u=Math.max(0,-(-a*i+r)),f=u>0?-i:Math.min(Math.max(-i,-c),i),d=-u*u+f*(f+2*c)+l):f<=m?(u=0,f=Math.min(Math.max(-i,-c),i),d=f*(f+2*c)+l):(u=Math.max(0,-(a*i+r)),f=u>0?i:Math.min(Math.max(-i,-c),i),d=-u*u+f*(f+2*c)+l);else f=a>0?-i:i,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(dc).addScaledVector(ya,f),d}intersectSphere(t,e){ms.subVectors(t.center,this.origin);const n=ms.dot(this.direction),s=ms.dot(ms)-n*n,i=t.radius*t.radius;if(s>i)return null;const a=Math.sqrt(i-s),r=n-a,c=n+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,i,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(i=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(i=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||i>s||((i>n||isNaN(n))&&(n=i),(a<s||isNaN(s))&&(s=a),u>=0?(r=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(r=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||r>s)||((r>n||n!==n)&&(n=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,ms)!==null}intersectTriangle(t,e,n,s,i){pc.subVectors(e,t),Ma.subVectors(n,t),mc.crossVectors(pc,Ma);let a=this.direction.dot(mc),r;if(a>0){if(s)return null;r=1}else if(a<0)r=-1,a=-a;else return null;Bs.subVectors(this.origin,t);const c=r*this.direction.dot(Ma.crossVectors(Bs,Ma));if(c<0)return null;const l=r*this.direction.dot(pc.cross(Bs));if(l<0||c+l>a)return null;const h=-r*Bs.dot(mc);return h<0?null:this.at(h/a,i)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ne{constructor(t,e,n,s,i,a,r,c,l,h,u,f,d,m,x,g){ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,i,a,r,c,l,h,u,f,d,m,x,g)}set(t,e,n,s,i,a,r,c,l,h,u,f,d,m,x,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=i,p[5]=a,p[9]=r,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ne().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/zi.setFromMatrixColumn(t,0).length(),i=1/zi.setFromMatrixColumn(t,1).length(),a=1/zi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*i,e[5]=n[5]*i,e[6]=n[6]*i,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,i=t.z,a=Math.cos(n),r=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(i),u=Math.sin(i);if(t.order==="XYZ"){const f=a*h,d=a*u,m=r*h,x=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+m*l,e[5]=f-x*l,e[9]=-r*c,e[2]=x-f*l,e[6]=m+d*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,m=l*h,x=l*u;e[0]=f+x*r,e[4]=m*r-d,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=d*r-m,e[6]=x+f*r,e[10]=a*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,m=l*h,x=l*u;e[0]=f-x*r,e[4]=-a*u,e[8]=m+d*r,e[1]=d+m*r,e[5]=a*h,e[9]=x-f*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const f=a*h,d=a*u,m=r*h,x=r*u;e[0]=c*h,e[4]=m*l-d,e[8]=f*l+x,e[1]=c*u,e[5]=x*l+f,e[9]=d*l-m,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,d=a*l,m=r*c,x=r*l;e[0]=c*h,e[4]=x-f*u,e[8]=m*u+d,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=d*u+m,e[10]=f-x*u}else if(t.order==="XZY"){const f=a*c,d=a*l,m=r*c,x=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+x,e[5]=a*h,e[9]=d*u-m,e[2]=m*u-d,e[6]=r*h,e[10]=x*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose($m,t,jm)}lookAt(t,e,n){const s=this.elements;return _n.subVectors(t,e),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),Ws.crossVectors(n,_n),Ws.lengthSq()===0&&(Math.abs(n.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),Ws.crossVectors(n,_n)),Ws.normalize(),_a.crossVectors(_n,Ws),s[0]=Ws.x,s[4]=_a.x,s[8]=_n.x,s[1]=Ws.y,s[5]=_a.y,s[9]=_n.y,s[2]=Ws.z,s[6]=_a.z,s[10]=_n.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,i=this.elements,a=n[0],r=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],m=n[2],x=n[6],g=n[10],p=n[14],v=n[3],w=n[7],b=n[11],y=n[15],S=s[0],E=s[4],T=s[8],_=s[12],M=s[1],A=s[5],R=s[9],k=s[13],C=s[2],z=s[6],I=s[10],O=s[14],U=s[3],V=s[7],B=s[11],q=s[15];return i[0]=a*S+r*M+c*C+l*U,i[4]=a*E+r*A+c*z+l*V,i[8]=a*T+r*R+c*I+l*B,i[12]=a*_+r*k+c*O+l*q,i[1]=h*S+u*M+f*C+d*U,i[5]=h*E+u*A+f*z+d*V,i[9]=h*T+u*R+f*I+d*B,i[13]=h*_+u*k+f*O+d*q,i[2]=m*S+x*M+g*C+p*U,i[6]=m*E+x*A+g*z+p*V,i[10]=m*T+x*R+g*I+p*B,i[14]=m*_+x*k+g*O+p*q,i[3]=v*S+w*M+b*C+y*U,i[7]=v*E+w*A+b*z+y*V,i[11]=v*T+w*R+b*I+y*B,i[15]=v*_+w*k+b*O+y*q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],i=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],m=t[3],x=t[7],g=t[11],p=t[15];return m*(+i*c*u-s*l*u-i*r*f+n*l*f+s*r*d-n*c*d)+x*(+e*c*d-e*l*f+i*a*f-s*a*d+s*l*h-i*c*h)+g*(+e*l*u-e*r*d-i*a*u+n*a*d+i*r*h-n*l*h)+p*(-s*r*h-e*c*u+e*r*f+s*a*u-n*a*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],i=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],m=t[12],x=t[13],g=t[14],p=t[15],v=u*g*l-x*f*l+x*c*d-r*g*d-u*c*p+r*f*p,w=m*f*l-h*g*l-m*c*d+a*g*d+h*c*p-a*f*p,b=h*x*l-m*u*l+m*r*d-a*x*d-h*r*p+a*u*p,y=m*u*c-h*x*c-m*r*f+a*x*f+h*r*g-a*u*g,S=e*v+n*w+s*b+i*y;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=v*E,t[1]=(x*f*i-u*g*i-x*s*d+n*g*d+u*s*p-n*f*p)*E,t[2]=(r*g*i-x*c*i+x*s*l-n*g*l-r*s*p+n*c*p)*E,t[3]=(u*c*i-r*f*i-u*s*l+n*f*l+r*s*d-n*c*d)*E,t[4]=w*E,t[5]=(h*g*i-m*f*i+m*s*d-e*g*d-h*s*p+e*f*p)*E,t[6]=(m*c*i-a*g*i-m*s*l+e*g*l+a*s*p-e*c*p)*E,t[7]=(a*f*i-h*c*i+h*s*l-e*f*l-a*s*d+e*c*d)*E,t[8]=b*E,t[9]=(m*u*i-h*x*i-m*n*d+e*x*d+h*n*p-e*u*p)*E,t[10]=(a*x*i-m*r*i+m*n*l-e*x*l-a*n*p+e*r*p)*E,t[11]=(h*r*i-a*u*i-h*n*l+e*u*l+a*n*d-e*r*d)*E,t[12]=y*E,t[13]=(h*x*s-m*u*s+m*n*f-e*x*f-h*n*g+e*u*g)*E,t[14]=(m*r*s-a*x*s-m*n*c+e*x*c+a*n*g-e*r*g)*E,t[15]=(a*u*s-h*r*s+h*n*c-e*u*c-a*n*f+e*r*f)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,i=t.z;return e[0]*=n,e[4]*=s,e[8]*=i,e[1]*=n,e[5]*=s,e[9]*=i,e[2]*=n,e[6]*=s,e[10]*=i,e[3]*=n,e[7]*=s,e[11]*=i,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),i=1-n,a=t.x,r=t.y,c=t.z,l=i*a,h=i*r;return this.set(l*a+n,l*r-s*c,l*c+s*r,0,l*r+s*c,h*r+n,h*c-s*a,0,l*c-s*r,h*c+s*a,i*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,i,a){return this.set(1,n,i,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,i=e._x,a=e._y,r=e._z,c=e._w,l=i+i,h=a+a,u=r+r,f=i*l,d=i*h,m=i*u,x=a*h,g=a*u,p=r*u,v=c*l,w=c*h,b=c*u,y=n.x,S=n.y,E=n.z;return s[0]=(1-(x+p))*y,s[1]=(d+b)*y,s[2]=(m-w)*y,s[3]=0,s[4]=(d-b)*S,s[5]=(1-(f+p))*S,s[6]=(g+v)*S,s[7]=0,s[8]=(m+w)*E,s[9]=(g-v)*E,s[10]=(1-(f+x))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let i=zi.set(s[0],s[1],s[2]).length();const a=zi.set(s[4],s[5],s[6]).length(),r=zi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(i=-i),t.x=s[12],t.y=s[13],t.z=s[14],Hn.copy(this);const l=1/i,h=1/a,u=1/r;return Hn.elements[0]*=l,Hn.elements[1]*=l,Hn.elements[2]*=l,Hn.elements[4]*=h,Hn.elements[5]*=h,Hn.elements[6]*=h,Hn.elements[8]*=u,Hn.elements[9]*=u,Hn.elements[10]*=u,e.setFromRotationMatrix(Hn),n.x=i,n.y=a,n.z=r,this}makePerspective(t,e,n,s,i,a,r=Cs){const c=this.elements,l=2*i/(e-t),h=2*i/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,m;if(r===Cs)d=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(r===Er)d=-a/(a-i),m=-a*i/(a-i);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,i,a,r=Cs){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(a-i),f=(e+t)*l,d=(n+s)*h;let m,x;if(r===Cs)m=(a+i)*u,x=-2*u;else if(r===Er)m=i*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=x,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const zi=new W,Hn=new ne,$m=new W(0,0,0),jm=new W(1,1,1),Ws=new W,_a=new W,_n=new W,Vh=new ne,$h=new hs;class Vr{constructor(t=0,e=0,n=0,s=Vr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,i=s[0],a=s[4],r=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(fn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-fn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,i),this._z=0);break;case"ZXY":this._x=Math.asin(fn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,i));break;case"ZYX":this._y=Math.asin(-fn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,i)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(fn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(r,d));break;case"XZY":this._z=Math.asin(-fn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(r,i)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Vh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Vh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return $h.setFromEuler(this),this.setFromQuaternion($h,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Vr.DEFAULT_ORDER="XYZ";class Ul{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let qm=0;const jh=new W,Ii=new hs,gs=new ne,ba=new W,To=new W,Xm=new W,Ym=new hs,qh=new W(1,0,0),Xh=new W(0,1,0),Yh=new W(0,0,1),Km={type:"added"},Zm={type:"removed"};class wn extends xo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qm++}),this.uuid=vo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=wn.DEFAULT_UP.clone();const t=new W,e=new Vr,n=new hs,s=new W(1,1,1);function i(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(i),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ne},normalMatrix:{value:new te}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=wn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=wn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ul,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ii.setFromAxisAngle(t,e),this.quaternion.multiply(Ii),this}rotateOnWorldAxis(t,e){return Ii.setFromAxisAngle(t,e),this.quaternion.premultiply(Ii),this}rotateX(t){return this.rotateOnAxis(qh,t)}rotateY(t){return this.rotateOnAxis(Xh,t)}rotateZ(t){return this.rotateOnAxis(Yh,t)}translateOnAxis(t,e){return jh.copy(t).applyQuaternion(this.quaternion),this.position.add(jh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(qh,t)}translateY(t){return this.translateOnAxis(Xh,t)}translateZ(t){return this.translateOnAxis(Yh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(gs.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ba.copy(t):ba.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),To.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gs.lookAt(To,ba,this.up):gs.lookAt(ba,To,this.up),this.quaternion.setFromRotationMatrix(gs),s&&(gs.extractRotation(s.matrixWorld),Ii.setFromRotationMatrix(gs),this.quaternion.premultiply(Ii.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Km)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Zm)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),gs.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),gs.multiply(t.parent.matrixWorld)),t.applyMatrix4(gs),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let i=0,a=s.length;i<a;i++)s[i].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(To,t,Xm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(To,Ym,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const i=e[n];(i.matrixWorldAutoUpdate===!0||t===!0)&&i.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let i=0,a=s.length;i<a;i++){const r=s[i];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function i(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=i(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];i(t.shapes,u)}else i(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(i(t.materials,this.material[c]));s.material=r}else s.material=i(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];s.animations.push(i(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),m=a(t.nodes);r.length>0&&(n.geometries=r),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}wn.DEFAULT_UP=new W(0,1,0);wn.DEFAULT_MATRIX_AUTO_UPDATE=!0;wn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Gn=new W,xs=new W,gc=new W,vs=new W,Fi=new W,Ui=new W,Kh=new W,xc=new W,vc=new W,wc=new W;let Sa=!1;class Xn{constructor(t=new W,e=new W,n=new W){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Gn.subVectors(t,e),s.cross(Gn);const i=s.lengthSq();return i>0?s.multiplyScalar(1/Math.sqrt(i)):s.set(0,0,0)}static getBarycoord(t,e,n,s,i){Gn.subVectors(s,e),xs.subVectors(n,e),gc.subVectors(t,e);const a=Gn.dot(Gn),r=Gn.dot(xs),c=Gn.dot(gc),l=xs.dot(xs),h=xs.dot(gc),u=a*l-r*r;if(u===0)return i.set(0,0,0),null;const f=1/u,d=(l*c-r*h)*f,m=(a*h-r*c)*f;return i.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,vs)===null?!1:vs.x>=0&&vs.y>=0&&vs.x+vs.y<=1}static getUV(t,e,n,s,i,a,r,c){return Sa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Sa=!0),this.getInterpolation(t,e,n,s,i,a,r,c)}static getInterpolation(t,e,n,s,i,a,r,c){return this.getBarycoord(t,e,n,s,vs)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(i,vs.x),c.addScaledVector(a,vs.y),c.addScaledVector(r,vs.z),c)}static isFrontFacing(t,e,n,s){return Gn.subVectors(n,e),xs.subVectors(t,e),Gn.cross(xs).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Gn.subVectors(this.c,this.b),xs.subVectors(this.a,this.b),Gn.cross(xs).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Xn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Xn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,i){return Sa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Sa=!0),Xn.getInterpolation(t,this.a,this.b,this.c,e,n,s,i)}getInterpolation(t,e,n,s,i){return Xn.getInterpolation(t,this.a,this.b,this.c,e,n,s,i)}containsPoint(t){return Xn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Xn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,i=this.c;let a,r;Fi.subVectors(s,n),Ui.subVectors(i,n),xc.subVectors(t,n);const c=Fi.dot(xc),l=Ui.dot(xc);if(c<=0&&l<=0)return e.copy(n);vc.subVectors(t,s);const h=Fi.dot(vc),u=Ui.dot(vc);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(Fi,a);wc.subVectors(t,i);const d=Fi.dot(wc),m=Ui.dot(wc);if(m>=0&&d<=m)return e.copy(i);const x=d*l-c*m;if(x<=0&&l>=0&&m<=0)return r=l/(l-m),e.copy(n).addScaledVector(Ui,r);const g=h*m-d*u;if(g<=0&&u-h>=0&&d-m>=0)return Kh.subVectors(i,s),r=(u-h)/(u-h+(d-m)),e.copy(s).addScaledVector(Kh,r);const p=1/(g+x+f);return a=x*p,r=f*p,e.copy(n).addScaledVector(Fi,a).addScaledVector(Ui,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ud={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hs={h:0,s:0,l:0},Ea={h:0,s:0,l:0};function yc(o,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?o+(t-o)*6*e:e<1/2?t:e<2/3?o+(t-o)*6*(2/3-e):o}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ue.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ue.workingColorSpace){return this.r=t,this.g=e,this.b=n,ue.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ue.workingColorSpace){if(t=Il(t,1),e=fn(e,0,1),n=fn(n,0,1),e===0)this.r=this.g=this.b=n;else{const i=n<=.5?n*(1+e):n+e-n*e,a=2*n-i;this.r=yc(a,i,t+1/3),this.g=yc(a,i,t),this.b=yc(a,i,t-1/3)}return ue.toWorkingColorSpace(this,s),this}setStyle(t,e=Ke){function n(i){i!==void 0&&parseFloat(i)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let i;const a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,e);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,e);break;case"hsl":case"hsla":if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const i=s[1],a=i.length;if(a===3)return this.setRGB(parseInt(i.charAt(0),16)/15,parseInt(i.charAt(1),16)/15,parseInt(i.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(i,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ke){const n=Ud[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=lo(t.r),this.g=lo(t.g),this.b=lo(t.b),this}copyLinearToSRGB(t){return this.r=cc(t.r),this.g=cc(t.g),this.b=cc(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ke){return ue.fromWorkingColorSpace(en.copy(this),t),Math.round(fn(en.r*255,0,255))*65536+Math.round(fn(en.g*255,0,255))*256+Math.round(fn(en.b*255,0,255))}getHexString(t=Ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ue.workingColorSpace){ue.fromWorkingColorSpace(en.copy(this),e);const n=en.r,s=en.g,i=en.b,a=Math.max(n,s,i),r=Math.min(n,s,i);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const u=a-r;switch(l=h<=.5?u/(a+r):u/(2-a-r),a){case n:c=(s-i)/u+(s<i?6:0);break;case s:c=(i-n)/u+2;break;case i:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ue.workingColorSpace){return ue.fromWorkingColorSpace(en.copy(this),e),t.r=en.r,t.g=en.g,t.b=en.b,t}getStyle(t=Ke){ue.fromWorkingColorSpace(en.copy(this),t);const e=en.r,n=en.g,s=en.b;return t!==Ke?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Hs),this.setHSL(Hs.h+t,Hs.s+e,Hs.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Hs),t.getHSL(Ea);const n=Go(Hs.h,Ea.h,e),s=Go(Hs.s,Ea.s,e),i=Go(Hs.l,Ea.l,e);return this.setHSL(n,s,i),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,i=t.elements;return this.r=i[0]*e+i[3]*n+i[6]*s,this.g=i[1]*e+i[4]*n+i[7]*s,this.b=i[2]*e+i[5]*n+i[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const en=new Ht;Ht.NAMES=Ud;let Jm=0;class ca extends xo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jm++}),this.uuid=vo(),this.name="",this.type="Material",this.blending=co,this.side=Ps,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sl,this.blendDst=il,this.blendEquation=di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=yr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ri,this.stencilZFail=Ri,this.stencilZPass=Ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==co&&(n.blending=this.blending),this.side!==Ps&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==sl&&(n.blendSrc=this.blendSrc),this.blendDst!==il&&(n.blendDst=this.blendDst),this.blendEquation!==di&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==yr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ri&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ri&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ri&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(i){const a=[];for(const r in i){const c=i[r];delete c.metadata,a.push(c)}return a}if(e){const i=s(t.textures),a=s(t.images);i.length>0&&(n.textures=i),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let i=0;i!==s;++i)n[i]=e[i].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Nd extends ca{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Md,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Pe=new W,Aa=new Bt;class de{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Uh,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Ts,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,i=this.itemSize;s<i;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Aa.fromBufferAttribute(this,e),Aa.applyMatrix3(t),this.setXY(e,Aa.x,Aa.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix3(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix4(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyNormalMatrix(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.transformDirection(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Xi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ln(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xi(e,this.array)),e}setX(t,e){return this.normalized&&(e=ln(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xi(e,this.array)),e}setY(t,e){return this.normalized&&(e=ln(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ln(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xi(e,this.array)),e}setW(t,e){return this.normalized&&(e=ln(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ln(e,this.array),n=ln(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ln(e,this.array),n=ln(n,this.array),s=ln(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,i){return t*=this.itemSize,this.normalized&&(e=ln(e,this.array),n=ln(n,this.array),s=ln(s,this.array),i=ln(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=i,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Uh&&(t.usage=this.usage),t}}class Od extends de{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Bd extends de{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Ue extends de{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Qm=0;const kn=new ne,Mc=new wn,Ni=new W,bn=new yn,Co=new yn,je=new W;class Je extends xo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Qm++}),this.uuid=vo(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Dd(t)?Bd:Od)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const i=new te().getNormalMatrix(t);n.applyNormalMatrix(i),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return kn.makeRotationFromQuaternion(t),this.applyMatrix4(kn),this}rotateX(t){return kn.makeRotationX(t),this.applyMatrix4(kn),this}rotateY(t){return kn.makeRotationY(t),this.applyMatrix4(kn),this}rotateZ(t){return kn.makeRotationZ(t),this.applyMatrix4(kn),this}translate(t,e,n){return kn.makeTranslation(t,e,n),this.applyMatrix4(kn),this}scale(t,e,n){return kn.makeScale(t,e,n),this.applyMatrix4(kn),this}lookAt(t){return Mc.lookAt(t),Mc.updateMatrix(),this.applyMatrix4(Mc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ni).negate(),this.translate(Ni.x,Ni.y,Ni.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const i=t[n];e.push(i.x,i.y,i.z||0)}return this.setAttribute("position",new Ue(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const i=e[n];bn.setFromBufferAttribute(i),this.morphTargetsRelative?(je.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(je),je.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(je)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Js);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new W,1/0);return}if(t){const n=this.boundingSphere.center;if(bn.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const r=e[i];Co.setFromBufferAttribute(r),this.morphTargetsRelative?(je.addVectors(bn.min,Co.min),bn.expandByPoint(je),je.addVectors(bn.max,Co.max),bn.expandByPoint(je)):(bn.expandByPoint(Co.min),bn.expandByPoint(Co.max))}bn.getCenter(n);let s=0;for(let i=0,a=t.count;i<a;i++)je.fromBufferAttribute(t,i),s=Math.max(s,n.distanceToSquared(je));if(e)for(let i=0,a=e.length;i<a;i++){const r=e[i],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)je.fromBufferAttribute(r,l),c&&(Ni.fromBufferAttribute(t,l),je.add(Ni)),s=Math.max(s,n.distanceToSquared(je))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,i=e.normal.array,a=e.uv.array,r=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new de(new Float32Array(4*r),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let M=0;M<r;M++)l[M]=new W,h[M]=new W;const u=new W,f=new W,d=new W,m=new Bt,x=new Bt,g=new Bt,p=new W,v=new W;function w(M,A,R){u.fromArray(s,M*3),f.fromArray(s,A*3),d.fromArray(s,R*3),m.fromArray(a,M*2),x.fromArray(a,A*2),g.fromArray(a,R*2),f.sub(u),d.sub(u),x.sub(m),g.sub(m);const k=1/(x.x*g.y-g.x*x.y);isFinite(k)&&(p.copy(f).multiplyScalar(g.y).addScaledVector(d,-x.y).multiplyScalar(k),v.copy(d).multiplyScalar(x.x).addScaledVector(f,-g.x).multiplyScalar(k),l[M].add(p),l[A].add(p),l[R].add(p),h[M].add(v),h[A].add(v),h[R].add(v))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let M=0,A=b.length;M<A;++M){const R=b[M],k=R.start,C=R.count;for(let z=k,I=k+C;z<I;z+=3)w(n[z+0],n[z+1],n[z+2])}const y=new W,S=new W,E=new W,T=new W;function _(M){E.fromArray(i,M*3),T.copy(E);const A=l[M];y.copy(A),y.sub(E.multiplyScalar(E.dot(A))).normalize(),S.crossVectors(T,A);const k=S.dot(h[M])<0?-1:1;c[M*4]=y.x,c[M*4+1]=y.y,c[M*4+2]=y.z,c[M*4+3]=k}for(let M=0,A=b.length;M<A;++M){const R=b[M],k=R.start,C=R.count;for(let z=k,I=k+C;z<I;z+=3)_(n[z+0]),_(n[z+1]),_(n[z+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new de(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new W,i=new W,a=new W,r=new W,c=new W,l=new W,h=new W,u=new W;if(t)for(let f=0,d=t.count;f<d;f+=3){const m=t.getX(f+0),x=t.getX(f+1),g=t.getX(f+2);s.fromBufferAttribute(e,m),i.fromBufferAttribute(e,x),a.fromBufferAttribute(e,g),h.subVectors(a,i),u.subVectors(s,i),h.cross(u),r.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),r.add(h),c.add(h),l.add(h),n.setXYZ(m,r.x,r.y,r.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),i.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,i),u.subVectors(s,i),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)je.fromBufferAttribute(t,e),je.normalize(),t.setXYZ(e,je.x,je.y,je.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,f=new l.constructor(c.length*h);let d=0,m=0;for(let x=0,g=c.length;x<g;x++){r.isInterleavedBufferAttribute?d=c[x]*r.data.stride+r.offset:d=c[x]*h;for(let p=0;p<h;p++)f[m++]=l[d++]}return new de(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Je,n=this.index.array,s=this.attributes;for(const r in s){const c=s[r],l=t(c,n);e.setAttribute(r,l)}const i=this.morphAttributes;for(const r in i){const c=[],l=i[r];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let i=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,i=!0)}i&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const i=t.morphAttributes;for(const l in i){const h=[],u=i[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zh=new ne,oi=new Fl,Ta=new Js,Jh=new W,Oi=new W,Bi=new W,Wi=new W,_c=new W,Ca=new W,Ra=new Bt,La=new Bt,Pa=new Bt,Qh=new W,tu=new W,eu=new W,ka=new W,Da=new W;class ge extends wn{constructor(t=new Je,e=new Nd){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,a=s.length;i<a;i++){const r=s[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=i}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(i&&r){Ca.set(0,0,0);for(let c=0,l=i.length;c<l;c++){const h=r[c],u=i[c];h!==0&&(_c.fromBufferAttribute(u,t),a?Ca.addScaledVector(_c,h):Ca.addScaledVector(_c.sub(e),h))}e.add(Ca)}return e}raycast(t,e){const n=this.geometry,s=this.material,i=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ta.copy(n.boundingSphere),Ta.applyMatrix4(i),oi.copy(t.ray).recast(t.near),!(Ta.containsPoint(oi.origin)===!1&&(oi.intersectSphere(Ta,Jh)===null||oi.origin.distanceToSquared(Jh)>(t.far-t.near)**2))&&(Zh.copy(i).invert(),oi.copy(t.ray).applyMatrix4(Zh),!(n.boundingBox!==null&&oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,oi)))}_computeIntersections(t,e,n){let s;const i=this.geometry,a=this.material,r=i.index,c=i.attributes.position,l=i.attributes.uv,h=i.attributes.uv1,u=i.attributes.normal,f=i.groups,d=i.drawRange;if(r!==null)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){const g=f[m],p=a[g.materialIndex],v=Math.max(g.start,d.start),w=Math.min(r.count,Math.min(g.start+g.count,d.start+d.count));for(let b=v,y=w;b<y;b+=3){const S=r.getX(b),E=r.getX(b+1),T=r.getX(b+2);s=za(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),x=Math.min(r.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){const v=r.getX(g),w=r.getX(g+1),b=r.getX(g+2);s=za(this,a,t,n,l,h,u,v,w,b),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){const g=f[m],p=a[g.materialIndex],v=Math.max(g.start,d.start),w=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let b=v,y=w;b<y;b+=3){const S=b,E=b+1,T=b+2;s=za(this,p,t,n,l,h,u,S,E,T),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){const v=g,w=g+1,b=g+2;s=za(this,a,t,n,l,h,u,v,w,b),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function tg(o,t,e,n,s,i,a,r){let c;if(t.side===pn?c=n.intersectTriangle(a,i,s,!0,r):c=n.intersectTriangle(s,i,a,t.side===Ps,r),c===null)return null;Da.copy(r),Da.applyMatrix4(o.matrixWorld);const l=e.ray.origin.distanceTo(Da);return l<e.near||l>e.far?null:{distance:l,point:Da.clone(),object:o}}function za(o,t,e,n,s,i,a,r,c,l){o.getVertexPosition(r,Oi),o.getVertexPosition(c,Bi),o.getVertexPosition(l,Wi);const h=tg(o,t,e,n,Oi,Bi,Wi,ka);if(h){s&&(Ra.fromBufferAttribute(s,r),La.fromBufferAttribute(s,c),Pa.fromBufferAttribute(s,l),h.uv=Xn.getInterpolation(ka,Oi,Bi,Wi,Ra,La,Pa,new Bt)),i&&(Ra.fromBufferAttribute(i,r),La.fromBufferAttribute(i,c),Pa.fromBufferAttribute(i,l),h.uv1=Xn.getInterpolation(ka,Oi,Bi,Wi,Ra,La,Pa,new Bt),h.uv2=h.uv1),a&&(Qh.fromBufferAttribute(a,r),tu.fromBufferAttribute(a,c),eu.fromBufferAttribute(a,l),h.normal=Xn.getInterpolation(ka,Oi,Bi,Wi,Qh,tu,eu,new W),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:c,c:l,normal:new W,materialIndex:0};Xn.getNormal(Oi,Bi,Wi,u.normal),h.face=u}return h}class la extends Je{constructor(t=1,e=1,n=1,s=1,i=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:i,depthSegments:a};const r=this;s=Math.floor(s),i=Math.floor(i),a=Math.floor(a);const c=[],l=[],h=[],u=[];let f=0,d=0;m("z","y","x",-1,-1,n,e,t,a,i,0),m("z","y","x",1,-1,n,e,-t,a,i,1),m("x","z","y",1,1,t,n,e,s,a,2),m("x","z","y",1,-1,t,n,-e,s,a,3),m("x","y","z",1,-1,t,e,n,s,i,4),m("x","y","z",-1,-1,t,e,-n,s,i,5),this.setIndex(c),this.setAttribute("position",new Ue(l,3)),this.setAttribute("normal",new Ue(h,3)),this.setAttribute("uv",new Ue(u,2));function m(x,g,p,v,w,b,y,S,E,T,_){const M=b/E,A=y/T,R=b/2,k=y/2,C=S/2,z=E+1,I=T+1;let O=0,U=0;const V=new W;for(let B=0;B<I;B++){const q=B*A-k;for(let it=0;it<z;it++){const Y=it*M-R;V[x]=Y*v,V[g]=q*w,V[p]=C,l.push(V.x,V.y,V.z),V[x]=0,V[g]=0,V[p]=S>0?1:-1,h.push(V.x,V.y,V.z),u.push(it/E),u.push(1-B/T),O+=1}}for(let B=0;B<T;B++)for(let q=0;q<E;q++){const it=f+q+z*B,Y=f+q+z*(B+1),nt=f+(q+1)+z*(B+1),rt=f+(q+1)+z*B;c.push(it,Y,rt),c.push(Y,nt,rt),U+=6}r.addGroup(d,U,_),d+=U,f+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new la(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function mo(o){const t={};for(const e in o){t[e]={};for(const n in o[e]){const s=o[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function hn(o){const t={};for(let e=0;e<o.length;e++){const n=mo(o[e]);for(const s in n)t[s]=n[s]}return t}function eg(o){const t=[];for(let e=0;e<o.length;e++)t.push(o[e].clone());return t}function Wd(o){return o.getRenderTarget()===null?o.outputColorSpace:ue.workingColorSpace}const ng={clone:mo,merge:hn};var sg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ig=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _e extends ca{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sg,this.fragmentShader=ig,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=mo(t.uniforms),this.uniformsGroups=eg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Hd extends wn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=Cs}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Rn extends Hd{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=na*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ho*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return na*2*Math.atan(Math.tan(Ho*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,i,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ho*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,i=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;i+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const r=this.filmOffset;r!==0&&(i+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Hi=-90,Gi=1;class og extends wn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Rn(Hi,Gi,t,e);s.layers=this.layers,this.add(s);const i=new Rn(Hi,Gi,t,e);i.layers=this.layers,this.add(i);const a=new Rn(Hi,Gi,t,e);a.layers=this.layers,this.add(a);const r=new Rn(Hi,Gi,t,e);r.layers=this.layers,this.add(r);const c=new Rn(Hi,Gi,t,e);c.layers=this.layers,this.add(c);const l=new Rn(Hi,Gi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,i,a,r,c]=e;for(const l of e)this.remove(l);if(t===Cs)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Er)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[i,a,r,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,i),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,r),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Gd extends mn{constructor(t,e,n,s,i,a,r,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:uo,super(t,e,n,s,i,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ag extends cs{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Vo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Mi?Ke:Nn),this.texture=new Gd(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Fe}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new la(5,5,5),i=new _e({name:"CubemapFromEquirect",uniforms:mo(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:pn,blending:Ls});i.uniforms.tEquirect.value=e;const a=new ge(s,i),r=e.minFilter;return e.minFilter===bi&&(e.minFilter=Fe),new og(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const i=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(i)}}const bc=new W,rg=new W,cg=new te;class hi{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=bc.subVectors(n,e).cross(rg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(bc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const i=-(t.start.dot(this.normal)+this.constant)/s;return i<0||i>1?null:e.copy(t.start).addScaledVector(n,i)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||cg.getNormalMatrix(t),s=this.coplanarPoint(bc).applyMatrix4(t),i=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(i),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ai=new Js,Ia=new W;class Is{constructor(t=new hi,e=new hi,n=new hi,s=new hi,i=new hi,a=new hi){this.planes=[t,e,n,s,i,a]}set(t,e,n,s,i,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(n),r[3].copy(s),r[4].copy(i),r[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Cs){const n=this.planes,s=t.elements,i=s[0],a=s[1],r=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],d=s[8],m=s[9],x=s[10],g=s[11],p=s[12],v=s[13],w=s[14],b=s[15];if(n[0].setComponents(c-i,f-l,g-d,b-p).normalize(),n[1].setComponents(c+i,f+l,g+d,b+p).normalize(),n[2].setComponents(c+a,f+h,g+m,b+v).normalize(),n[3].setComponents(c-a,f-h,g-m,b-v).normalize(),n[4].setComponents(c-r,f-u,g-x,b-w).normalize(),e===Cs)n[5].setComponents(c+r,f+u,g+x,b+w).normalize();else if(e===Er)n[5].setComponents(r,u,x,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(t){return ai.center.set(0,0,0),ai.radius=.7071067811865476,ai.applyMatrix4(t.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let i=0;i<6;i++)if(e[i].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ia.x=s.normal.x>0?t.max.x:t.min.x,Ia.y=s.normal.y>0?t.max.y:t.min.y,Ia.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ia)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Vd(){let o=null,t=!1,e=null,n=null;function s(i,a){e(i,a),n=o.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=o.requestAnimationFrame(s),t=!0)},stop:function(){o.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(i){e=i},setContext:function(i){o=i}}}function lg(o,t){const e=t.isWebGL2,n=new WeakMap;function s(l,h){const u=l.array,f=l.usage,d=u.byteLength,m=o.createBuffer();o.bindBuffer(h,m),o.bufferData(h,u,f),l.onUploadCallback();let x;if(u instanceof Float32Array)x=o.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)x=o.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=o.UNSIGNED_SHORT;else if(u instanceof Int16Array)x=o.SHORT;else if(u instanceof Uint32Array)x=o.UNSIGNED_INT;else if(u instanceof Int32Array)x=o.INT;else if(u instanceof Int8Array)x=o.BYTE;else if(u instanceof Uint8Array)x=o.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)x=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:m,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:d}}function i(l,h,u){const f=h.array,d=h._updateRange,m=h.updateRanges;if(o.bindBuffer(u,l),d.count===-1&&m.length===0&&o.bufferSubData(u,0,f),m.length!==0){for(let x=0,g=m.length;x<g;x++){const p=m[x];e?o.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f,p.start,p.count):o.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}d.count!==-1&&(e?o.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):o.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(o.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,l,h),u.version=l.version}}return{get:a,remove:r,update:c}}class Nl extends Je{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const i=t/2,a=e/2,r=Math.floor(n),c=Math.floor(s),l=r+1,h=c+1,u=t/r,f=e/c,d=[],m=[],x=[],g=[];for(let p=0;p<h;p++){const v=p*f-a;for(let w=0;w<l;w++){const b=w*u-i;m.push(b,-v,0),x.push(0,0,1),g.push(w/r),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<r;v++){const w=v+l*p,b=v+l*(p+1),y=v+1+l*(p+1),S=v+1+l*p;d.push(w,b,S),d.push(b,y,S)}this.setIndex(d),this.setAttribute("position",new Ue(m,3)),this.setAttribute("normal",new Ue(x,3)),this.setAttribute("uv",new Ue(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Nl(t.width,t.height,t.widthSegments,t.heightSegments)}}var hg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ug=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pg=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,mg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,xg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vg=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,wg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,yg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_g=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Sg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Eg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Ag=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Lg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Pg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,kg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Dg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,zg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ig=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Fg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ug=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ng=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Og=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Wg=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Hg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Gg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,$g=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Jg=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Qg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,t1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,e1=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,n1=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,s1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,i1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,o1=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,a1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,r1=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,c1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,l1=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,h1=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,u1=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,f1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,d1=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,p1=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,m1=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,g1=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,x1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,v1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,w1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,y1=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,M1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,b1=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,S1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,E1=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,A1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,T1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,C1=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,R1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,L1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,P1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,k1=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,D1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,z1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,I1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,F1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,U1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,N1=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,O1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,B1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,W1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,H1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,G1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,V1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$1=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,j1=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,q1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,X1=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Y1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,K1=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Z1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,J1=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Q1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ex=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,nx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,sx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ix=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ox=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ax=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ux=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,px=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,gx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,xx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,vx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,wx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_x=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Sx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ex=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ax=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Cx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Lx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Px=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,zx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ix=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ux=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Nx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ox=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Wx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zt={alphahash_fragment:hg,alphahash_pars_fragment:ug,alphamap_fragment:fg,alphamap_pars_fragment:dg,alphatest_fragment:pg,alphatest_pars_fragment:mg,aomap_fragment:gg,aomap_pars_fragment:xg,batching_pars_vertex:vg,batching_vertex:wg,begin_vertex:yg,beginnormal_vertex:Mg,bsdfs:_g,iridescence_fragment:bg,bumpmap_pars_fragment:Sg,clipping_planes_fragment:Eg,clipping_planes_pars_fragment:Ag,clipping_planes_pars_vertex:Tg,clipping_planes_vertex:Cg,color_fragment:Rg,color_pars_fragment:Lg,color_pars_vertex:Pg,color_vertex:kg,common:Dg,cube_uv_reflection_fragment:zg,defaultnormal_vertex:Ig,displacementmap_pars_vertex:Fg,displacementmap_vertex:Ug,emissivemap_fragment:Ng,emissivemap_pars_fragment:Og,colorspace_fragment:Bg,colorspace_pars_fragment:Wg,envmap_fragment:Hg,envmap_common_pars_fragment:Gg,envmap_pars_fragment:Vg,envmap_pars_vertex:$g,envmap_physical_pars_fragment:s1,envmap_vertex:jg,fog_vertex:qg,fog_pars_vertex:Xg,fog_fragment:Yg,fog_pars_fragment:Kg,gradientmap_pars_fragment:Zg,lightmap_fragment:Jg,lightmap_pars_fragment:Qg,lights_lambert_fragment:t1,lights_lambert_pars_fragment:e1,lights_pars_begin:n1,lights_toon_fragment:i1,lights_toon_pars_fragment:o1,lights_phong_fragment:a1,lights_phong_pars_fragment:r1,lights_physical_fragment:c1,lights_physical_pars_fragment:l1,lights_fragment_begin:h1,lights_fragment_maps:u1,lights_fragment_end:f1,logdepthbuf_fragment:d1,logdepthbuf_pars_fragment:p1,logdepthbuf_pars_vertex:m1,logdepthbuf_vertex:g1,map_fragment:x1,map_pars_fragment:v1,map_particle_fragment:w1,map_particle_pars_fragment:y1,metalnessmap_fragment:M1,metalnessmap_pars_fragment:_1,morphcolor_vertex:b1,morphnormal_vertex:S1,morphtarget_pars_vertex:E1,morphtarget_vertex:A1,normal_fragment_begin:T1,normal_fragment_maps:C1,normal_pars_fragment:R1,normal_pars_vertex:L1,normal_vertex:P1,normalmap_pars_fragment:k1,clearcoat_normal_fragment_begin:D1,clearcoat_normal_fragment_maps:z1,clearcoat_pars_fragment:I1,iridescence_pars_fragment:F1,opaque_fragment:U1,packing:N1,premultiplied_alpha_fragment:O1,project_vertex:B1,dithering_fragment:W1,dithering_pars_fragment:H1,roughnessmap_fragment:G1,roughnessmap_pars_fragment:V1,shadowmap_pars_fragment:$1,shadowmap_pars_vertex:j1,shadowmap_vertex:q1,shadowmask_pars_fragment:X1,skinbase_vertex:Y1,skinning_pars_vertex:K1,skinning_vertex:Z1,skinnormal_vertex:J1,specularmap_fragment:Q1,specularmap_pars_fragment:tx,tonemapping_fragment:ex,tonemapping_pars_fragment:nx,transmission_fragment:sx,transmission_pars_fragment:ix,uv_pars_fragment:ox,uv_pars_vertex:ax,uv_vertex:rx,worldpos_vertex:cx,background_vert:lx,background_frag:hx,backgroundCube_vert:ux,backgroundCube_frag:fx,cube_vert:dx,cube_frag:px,depth_vert:mx,depth_frag:gx,distanceRGBA_vert:xx,distanceRGBA_frag:vx,equirect_vert:wx,equirect_frag:yx,linedashed_vert:Mx,linedashed_frag:_x,meshbasic_vert:bx,meshbasic_frag:Sx,meshlambert_vert:Ex,meshlambert_frag:Ax,meshmatcap_vert:Tx,meshmatcap_frag:Cx,meshnormal_vert:Rx,meshnormal_frag:Lx,meshphong_vert:Px,meshphong_frag:kx,meshphysical_vert:Dx,meshphysical_frag:zx,meshtoon_vert:Ix,meshtoon_frag:Fx,points_vert:Ux,points_frag:Nx,shadow_vert:Ox,shadow_frag:Bx,sprite_vert:Wx,sprite_frag:Hx},_t={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new Bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new Bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},es={basic:{uniforms:hn([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.fog]),vertexShader:Zt.meshbasic_vert,fragmentShader:Zt.meshbasic_frag},lambert:{uniforms:hn([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Zt.meshlambert_vert,fragmentShader:Zt.meshlambert_frag},phong:{uniforms:hn([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Zt.meshphong_vert,fragmentShader:Zt.meshphong_frag},standard:{uniforms:hn([_t.common,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.roughnessmap,_t.metalnessmap,_t.fog,_t.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag},toon:{uniforms:hn([_t.common,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.gradientmap,_t.fog,_t.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Zt.meshtoon_vert,fragmentShader:Zt.meshtoon_frag},matcap:{uniforms:hn([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,{matcap:{value:null}}]),vertexShader:Zt.meshmatcap_vert,fragmentShader:Zt.meshmatcap_frag},points:{uniforms:hn([_t.points,_t.fog]),vertexShader:Zt.points_vert,fragmentShader:Zt.points_frag},dashed:{uniforms:hn([_t.common,_t.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Zt.linedashed_vert,fragmentShader:Zt.linedashed_frag},depth:{uniforms:hn([_t.common,_t.displacementmap]),vertexShader:Zt.depth_vert,fragmentShader:Zt.depth_frag},normal:{uniforms:hn([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,{opacity:{value:1}}]),vertexShader:Zt.meshnormal_vert,fragmentShader:Zt.meshnormal_frag},sprite:{uniforms:hn([_t.sprite,_t.fog]),vertexShader:Zt.sprite_vert,fragmentShader:Zt.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Zt.background_vert,fragmentShader:Zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Zt.backgroundCube_vert,fragmentShader:Zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Zt.cube_vert,fragmentShader:Zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Zt.equirect_vert,fragmentShader:Zt.equirect_frag},distanceRGBA:{uniforms:hn([_t.common,_t.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Zt.distanceRGBA_vert,fragmentShader:Zt.distanceRGBA_frag},shadow:{uniforms:hn([_t.lights,_t.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Zt.shadow_vert,fragmentShader:Zt.shadow_frag}};es.physical={uniforms:hn([es.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new Bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new Bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new Bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag};const Fa={r:0,b:0,g:0};function Gx(o,t,e,n,s,i,a){const r=new Ht(0);let c=i===!0?0:1,l,h,u=null,f=0,d=null;function m(g,p){let v=!1,w=p.isScene===!0?p.background:null;w&&w.isTexture&&(w=(p.backgroundBlurriness>0?e:t).get(w)),w===null?x(r,c):w&&w.isColor&&(x(w,1),v=!0);const b=o.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(o.autoClear||v)&&o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil),w&&(w.isCubeTexture||w.mapping===Hr)?(h===void 0&&(h=new ge(new la(1,1,1),new _e({name:"BackgroundCubeMaterial",uniforms:mo(es.backgroundCube.uniforms),vertexShader:es.backgroundCube.vertexShader,fragmentShader:es.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(y,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=ue.getTransfer(w.colorSpace)!==me,(u!==w||f!==w.version||d!==o.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,d=o.toneMapping),h.layers.enableAll(),g.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new ge(new Nl(2,2),new _e({name:"BackgroundMaterial",uniforms:mo(es.background.uniforms),vertexShader:es.background.vertexShader,fragmentShader:es.background.fragmentShader,side:Ps,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=ue.getTransfer(w.colorSpace)!==me,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||d!==o.toneMapping)&&(l.material.needsUpdate=!0,u=w,f=w.version,d=o.toneMapping),l.layers.enableAll(),g.unshift(l,l.geometry,l.material,0,0,null))}function x(g,p){g.getRGB(Fa,Wd(o)),n.buffers.color.setClear(Fa.r,Fa.g,Fa.b,p,a)}return{getClearColor:function(){return r},setClearColor:function(g,p=1){r.set(g),c=p,x(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(g){c=g,x(r,c)},render:m}}function Vx(o,t,e,n){const s=o.getParameter(o.MAX_VERTEX_ATTRIBS),i=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||i!==null,r={},c=g(null);let l=c,h=!1;function u(C,z,I,O,U){let V=!1;if(a){const B=x(O,I,z);l!==B&&(l=B,d(l.object)),V=p(C,O,I,U),V&&v(C,O,I,U)}else{const B=z.wireframe===!0;(l.geometry!==O.id||l.program!==I.id||l.wireframe!==B)&&(l.geometry=O.id,l.program=I.id,l.wireframe=B,V=!0)}U!==null&&e.update(U,o.ELEMENT_ARRAY_BUFFER),(V||h)&&(h=!1,T(C,z,I,O),U!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function f(){return n.isWebGL2?o.createVertexArray():i.createVertexArrayOES()}function d(C){return n.isWebGL2?o.bindVertexArray(C):i.bindVertexArrayOES(C)}function m(C){return n.isWebGL2?o.deleteVertexArray(C):i.deleteVertexArrayOES(C)}function x(C,z,I){const O=I.wireframe===!0;let U=r[C.id];U===void 0&&(U={},r[C.id]=U);let V=U[z.id];V===void 0&&(V={},U[z.id]=V);let B=V[O];return B===void 0&&(B=g(f()),V[O]=B),B}function g(C){const z=[],I=[],O=[];for(let U=0;U<s;U++)z[U]=0,I[U]=0,O[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:I,attributeDivisors:O,object:C,attributes:{},index:null}}function p(C,z,I,O){const U=l.attributes,V=z.attributes;let B=0;const q=I.getAttributes();for(const it in q)if(q[it].location>=0){const nt=U[it];let rt=V[it];if(rt===void 0&&(it==="instanceMatrix"&&C.instanceMatrix&&(rt=C.instanceMatrix),it==="instanceColor"&&C.instanceColor&&(rt=C.instanceColor)),nt===void 0||nt.attribute!==rt||rt&&nt.data!==rt.data)return!0;B++}return l.attributesNum!==B||l.index!==O}function v(C,z,I,O){const U={},V=z.attributes;let B=0;const q=I.getAttributes();for(const it in q)if(q[it].location>=0){let nt=V[it];nt===void 0&&(it==="instanceMatrix"&&C.instanceMatrix&&(nt=C.instanceMatrix),it==="instanceColor"&&C.instanceColor&&(nt=C.instanceColor));const rt={};rt.attribute=nt,nt&&nt.data&&(rt.data=nt.data),U[it]=rt,B++}l.attributes=U,l.attributesNum=B,l.index=O}function w(){const C=l.newAttributes;for(let z=0,I=C.length;z<I;z++)C[z]=0}function b(C){y(C,0)}function y(C,z){const I=l.newAttributes,O=l.enabledAttributes,U=l.attributeDivisors;I[C]=1,O[C]===0&&(o.enableVertexAttribArray(C),O[C]=1),U[C]!==z&&((n.isWebGL2?o:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](C,z),U[C]=z)}function S(){const C=l.newAttributes,z=l.enabledAttributes;for(let I=0,O=z.length;I<O;I++)z[I]!==C[I]&&(o.disableVertexAttribArray(I),z[I]=0)}function E(C,z,I,O,U,V,B){B===!0?o.vertexAttribIPointer(C,z,I,U,V):o.vertexAttribPointer(C,z,I,O,U,V)}function T(C,z,I,O){if(n.isWebGL2===!1&&(C.isInstancedMesh||O.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;w();const U=O.attributes,V=I.getAttributes(),B=z.defaultAttributeValues;for(const q in V){const it=V[q];if(it.location>=0){let Y=U[q];if(Y===void 0&&(q==="instanceMatrix"&&C.instanceMatrix&&(Y=C.instanceMatrix),q==="instanceColor"&&C.instanceColor&&(Y=C.instanceColor)),Y!==void 0){const nt=Y.normalized,rt=Y.itemSize,ut=e.get(Y);if(ut===void 0)continue;const xt=ut.buffer,At=ut.type,Rt=ut.bytesPerElement,wt=n.isWebGL2===!0&&(At===o.INT||At===o.UNSIGNED_INT||Y.gpuType===bd);if(Y.isInterleavedBufferAttribute){const kt=Y.data,$=kt.stride,le=Y.offset;if(kt.isInstancedInterleavedBuffer){for(let Tt=0;Tt<it.locationSize;Tt++)y(it.location+Tt,kt.meshPerAttribute);C.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=kt.meshPerAttribute*kt.count)}else for(let Tt=0;Tt<it.locationSize;Tt++)b(it.location+Tt);o.bindBuffer(o.ARRAY_BUFFER,xt);for(let Tt=0;Tt<it.locationSize;Tt++)E(it.location+Tt,rt/it.locationSize,At,nt,$*Rt,(le+rt/it.locationSize*Tt)*Rt,wt)}else{if(Y.isInstancedBufferAttribute){for(let kt=0;kt<it.locationSize;kt++)y(it.location+kt,Y.meshPerAttribute);C.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let kt=0;kt<it.locationSize;kt++)b(it.location+kt);o.bindBuffer(o.ARRAY_BUFFER,xt);for(let kt=0;kt<it.locationSize;kt++)E(it.location+kt,rt/it.locationSize,At,nt,rt*Rt,rt/it.locationSize*kt*Rt,wt)}}else if(B!==void 0){const nt=B[q];if(nt!==void 0)switch(nt.length){case 2:o.vertexAttrib2fv(it.location,nt);break;case 3:o.vertexAttrib3fv(it.location,nt);break;case 4:o.vertexAttrib4fv(it.location,nt);break;default:o.vertexAttrib1fv(it.location,nt)}}}}S()}function _(){R();for(const C in r){const z=r[C];for(const I in z){const O=z[I];for(const U in O)m(O[U].object),delete O[U];delete z[I]}delete r[C]}}function M(C){if(r[C.id]===void 0)return;const z=r[C.id];for(const I in z){const O=z[I];for(const U in O)m(O[U].object),delete O[U];delete z[I]}delete r[C.id]}function A(C){for(const z in r){const I=r[z];if(I[C.id]===void 0)continue;const O=I[C.id];for(const U in O)m(O[U].object),delete O[U];delete I[C.id]}}function R(){k(),h=!0,l!==c&&(l=c,d(l.object))}function k(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:R,resetDefaultState:k,dispose:_,releaseStatesOfGeometry:M,releaseStatesOfProgram:A,initAttributes:w,enableAttribute:b,disableUnusedAttributes:S}}function $x(o,t,e,n){const s=n.isWebGL2;let i;function a(h){i=h}function r(h,u){o.drawArrays(i,h,u),e.update(u,i,1)}function c(h,u,f){if(f===0)return;let d,m;if(s)d=o,m="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[m](i,h,u,f),e.update(u,i,f)}function l(h,u,f){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<f;m++)this.render(h[m],u[m]);else{d.multiDrawArraysWEBGL(i,h,0,u,0,f);let m=0;for(let x=0;x<f;x++)m+=u[x];e.update(m,i,1)}}this.setMode=a,this.render=r,this.renderInstances=c,this.renderMultiDraw=l}function jx(o,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=o.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function i(E){if(E==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&o.constructor.name==="WebGL2RenderingContext";let r=e.precision!==void 0?e.precision:"highp";const c=i(r);c!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",c,"instead."),r=c);const l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),f=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=o.getParameter(o.MAX_TEXTURE_SIZE),m=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),x=o.getParameter(o.MAX_VERTEX_ATTRIBS),g=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),p=o.getParameter(o.MAX_VARYING_VECTORS),v=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),w=f>0,b=a||t.has("OES_texture_float"),y=w&&b,S=a?o.getParameter(o.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:i,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:m,maxAttributes:x,maxVertexUniforms:g,maxVaryings:p,maxFragmentUniforms:v,vertexTextures:w,floatFragmentTextures:b,floatVertexTextures:y,maxSamples:S}}function qx(o){const t=this;let e=null,n=0,s=!1,i=!1;const a=new hi,r=new te,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){i=!0,h(null)},this.endShadows=function(){i=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=o.get(u);if(!s||m===null||m.length===0||i&&!g)i?h(null):l();else{const v=i?0:n,w=v*4;let b=p.clippingState||null;c.value=b,b=h(m,f,w,d);for(let y=0;y!==w;++y)b[y]=e[y];p.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,m){const x=u!==null?u.length:0;let g=null;if(x!==0){if(g=c.value,m!==!0||g===null){const p=d+x*4,v=f.matrixWorldInverse;r.getNormalMatrix(v),(g===null||g.length<p)&&(g=new Float32Array(p));for(let w=0,b=d;w!==x;++w,b+=4)a.copy(u[w]).applyMatrix4(v,r),a.normal.toArray(g,b),g[b+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function Xx(o){let t=new WeakMap;function e(a,r){return r===ol?a.mapping=uo:r===al&&(a.mapping=fo),a}function n(a){if(a&&a.isTexture){const r=a.mapping;if(r===ol||r===al)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new ag(c.height/2);return l.fromEquirectangularTexture(o,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const r=a.target;r.removeEventListener("dispose",s);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function i(){t=new WeakMap}return{get:n,dispose:i}}class $r extends Hd{constructor(t=-1,e=1,n=1,s=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let i=n-t,a=n+t,r=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=l*this.view.offsetX,a=i+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(i,a,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Qi=4,nu=[.125,.215,.35,.446,.526,.582],pi=20,Sc=new $r,su=new Ht;let Ec=null,Ac=0,Tc=0;const ui=(1+Math.sqrt(5))/2,Vi=1/ui,iu=[new W(1,1,1),new W(-1,1,1),new W(1,1,-1),new W(-1,1,-1),new W(0,ui,Vi),new W(0,ui,-Vi),new W(Vi,0,ui),new W(-Vi,0,ui),new W(ui,Vi,0),new W(-ui,Vi,0)];class ou{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ec=this._renderer.getRenderTarget(),Ac=this._renderer.getActiveCubeFace(),Tc=this._renderer.getActiveMipmapLevel(),this._setSize(256);const i=this._allocateTargets();return i.depthBuffer=!0,this._sceneToCubeUV(t,n,s,i),e>0&&this._blur(i,0,0,e),this._applyPMREM(i),this._cleanup(i),i}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ru(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ec,Ac,Tc),t.scissorTest=!1,Ua(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===uo||t.mapping===fo?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ec=this._renderer.getRenderTarget(),Ac=this._renderer.getActiveCubeFace(),Tc=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Fe,minFilter:Fe,generateMipmaps:!1,type:ks,format:Ae,colorSpace:Ds,depthBuffer:!1},s=au(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=au(t,e,n);const{_lodMax:i}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Yx(i)),this._blurMaterial=Kx(i,t,e)}return s}_compileMaterial(t){const e=new ge(this._lodPlanes[0],t);this._renderer.compile(e,Sc)}_sceneToCubeUV(t,e,n,s){const r=new Rn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(su),h.toneMapping=Ys,h.autoClear=!1;const d=new Nd({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1}),m=new ge(new la,d);let x=!1;const g=t.background;g?g.isColor&&(d.color.copy(g),t.background=null,x=!0):(d.color.copy(su),x=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):v===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const w=this._cubeSize;Ua(s,v*w,p>2?w:0,w,w),h.setRenderTarget(s),x&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=g}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===uo||t.mapping===fo;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=cu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ru());const i=s?this._cubemapMaterial:this._equirectMaterial,a=new ge(this._lodPlanes[0],i),r=i.uniforms;r.envMap.value=t;const c=this._cubeSize;Ua(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Sc)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const i=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=iu[(s-1)%iu.length];this._blur(t,s-1,s,i,a)}e.autoClear=n}_blur(t,e,n,s,i){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",i),this._halfBlur(a,t,n,n,s,"longitudinal",i)}_halfBlur(t,e,n,s,i,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ge(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,m=isFinite(i)?Math.PI/(2*d):2*Math.PI/(2*pi-1),x=i/m,g=isFinite(i)?1+Math.floor(h*x):pi;g>pi&&console.warn(`sigmaRadians, ${i}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${pi}`);const p=[];let v=0;for(let E=0;E<pi;++E){const T=E/x,_=Math.exp(-T*T/2);p.push(_),E===0?v+=_:E<g&&(v+=2*_)}for(let E=0;E<p.length;E++)p[E]=p[E]/v;f.envMap.value=t.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=a==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:w}=this;f.dTheta.value=m,f.mipInt.value=w-n;const b=this._sizeLods[s],y=3*b*(s>w-Qi?s-w+Qi:0),S=4*(this._cubeSize-b);Ua(e,y,S,3*b,2*b),c.setRenderTarget(e),c.render(u,Sc)}}function Yx(o){const t=[],e=[],n=[];let s=o;const i=o-Qi+1+nu.length;for(let a=0;a<i;a++){const r=Math.pow(2,s);e.push(r);let c=1/r;a>o-Qi?c=nu[a-o+Qi-1]:a===0&&(c=0),n.push(c);const l=1/(r-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,m=6,x=3,g=2,p=1,v=new Float32Array(x*m*d),w=new Float32Array(g*m*d),b=new Float32Array(p*m*d);for(let S=0;S<d;S++){const E=S%3*2/3-1,T=S>2?0:-1,_=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];v.set(_,x*m*S),w.set(f,g*m*S);const M=[S,S,S,S,S,S];b.set(M,p*m*S)}const y=new Je;y.setAttribute("position",new de(v,x)),y.setAttribute("uv",new de(w,g)),y.setAttribute("faceIndex",new de(b,p)),t.push(y),s>Qi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function au(o,t,e){const n=new cs(o,t,e);return n.texture.mapping=Hr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ua(o,t,e,n,s){o.viewport.set(t,e,n,s),o.scissor.set(t,e,n,s)}function Kx(o,t,e){const n=new Float32Array(pi),s=new W(0,1,0);return new _e({name:"SphericalGaussianBlur",defines:{n:pi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ls,depthTest:!1,depthWrite:!1})}function ru(){return new _e({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ls,depthTest:!1,depthWrite:!1})}function cu(){return new _e({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ls,depthTest:!1,depthWrite:!1})}function Ol(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Zx(o){let t=new WeakMap,e=null;function n(r){if(r&&r.isTexture){const c=r.mapping,l=c===ol||c===al,h=c===uo||c===fo;if(l||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=t.get(r);return e===null&&(e=new ou(o)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),t.set(r,u),u.texture}else{if(t.has(r))return t.get(r).texture;{const u=r.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new ou(o));const f=l?e.fromEquirectangular(r):e.fromCubemap(r);return t.set(r,f),r.addEventListener("dispose",i),f.texture}else return null}}}return r}function s(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function i(r){const c=r.target;c.removeEventListener("dispose",i);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Jx(o){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=o.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Qx(o,t,e,n){const s={},i=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const m in f.attributes)t.remove(f.attributes[m]);for(const m in f.morphAttributes){const x=f.morphAttributes[m];for(let g=0,p=x.length;g<p;g++)t.remove(x[g])}f.removeEventListener("dispose",a),delete s[f.id];const d=i.get(f);d&&(t.remove(d),i.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function r(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const m in f)t.update(f[m],o.ARRAY_BUFFER);const d=u.morphAttributes;for(const m in d){const x=d[m];for(let g=0,p=x.length;g<p;g++)t.update(x[g],o.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,m=u.attributes.position;let x=0;if(d!==null){const v=d.array;x=d.version;for(let w=0,b=v.length;w<b;w+=3){const y=v[w+0],S=v[w+1],E=v[w+2];f.push(y,S,S,E,E,y)}}else if(m!==void 0){const v=m.array;x=m.version;for(let w=0,b=v.length/3-1;w<b;w+=3){const y=w+0,S=w+1,E=w+2;f.push(y,S,S,E,E,y)}}else return;const g=new(Dd(f)?Bd:Od)(f,1);g.version=x;const p=i.get(u);p&&t.remove(p),i.set(u,g)}function h(u){const f=i.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return i.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function tv(o,t,e,n){const s=n.isWebGL2;let i;function a(d){i=d}let r,c;function l(d){r=d.type,c=d.bytesPerElement}function h(d,m){o.drawElements(i,m,r,d*c),e.update(m,i,1)}function u(d,m,x){if(x===0)return;let g,p;if(s)g=o,p="drawElementsInstanced";else if(g=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",g===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[p](i,m,r,d*c,x),e.update(m,i,x)}function f(d,m,x){if(x===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<x;p++)this.render(d[p]/c,m[p]);else{g.multiDrawElementsWEBGL(i,m,0,r,d,0,x);let p=0;for(let v=0;v<x;v++)p+=m[v];e.update(p,i,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function ev(o){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(i,a,r){switch(e.calls++,a){case o.TRIANGLES:e.triangles+=r*(i/3);break;case o.LINES:e.lines+=r*(i/2);break;case o.LINE_STRIP:e.lines+=r*(i-1);break;case o.LINE_LOOP:e.lines+=r*i;break;case o.POINTS:e.points+=r*i;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function nv(o,t){return o[0]-t[0]}function sv(o,t){return Math.abs(t[1])-Math.abs(o[1])}function iv(o,t,e){const n={},s=new Float32Array(8),i=new WeakMap,a=new Yt,r=[];for(let l=0;l<8;l++)r[l]=[l,0];function c(l,h,u){const f=l.morphTargetInfluences;if(t.isWebGL2===!0){const d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,m=d!==void 0?d.length:0;let x=i.get(h);if(x===void 0||x.count!==m){let C=function(){R.dispose(),i.delete(h),h.removeEventListener("dispose",C)};x!==void 0&&x.texture.dispose();const v=h.morphAttributes.position!==void 0,w=h.morphAttributes.normal!==void 0,b=h.morphAttributes.color!==void 0,y=h.morphAttributes.position||[],S=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let T=0;v===!0&&(T=1),w===!0&&(T=2),b===!0&&(T=3);let _=h.attributes.position.count*T,M=1;_>t.maxTextureSize&&(M=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const A=new Float32Array(_*M*4*m),R=new Fd(A,_,M,m);R.type=Ts,R.needsUpdate=!0;const k=T*4;for(let z=0;z<m;z++){const I=y[z],O=S[z],U=E[z],V=_*M*4*z;for(let B=0;B<I.count;B++){const q=B*k;v===!0&&(a.fromBufferAttribute(I,B),A[V+q+0]=a.x,A[V+q+1]=a.y,A[V+q+2]=a.z,A[V+q+3]=0),w===!0&&(a.fromBufferAttribute(O,B),A[V+q+4]=a.x,A[V+q+5]=a.y,A[V+q+6]=a.z,A[V+q+7]=0),b===!0&&(a.fromBufferAttribute(U,B),A[V+q+8]=a.x,A[V+q+9]=a.y,A[V+q+10]=a.z,A[V+q+11]=U.itemSize===4?a.w:1)}}x={count:m,texture:R,size:new Bt(_,M)},i.set(h,x),h.addEventListener("dispose",C)}let g=0;for(let v=0;v<f.length;v++)g+=f[v];const p=h.morphTargetsRelative?1:1-g;u.getUniforms().setValue(o,"morphTargetBaseInfluence",p),u.getUniforms().setValue(o,"morphTargetInfluences",f),u.getUniforms().setValue(o,"morphTargetsTexture",x.texture,e),u.getUniforms().setValue(o,"morphTargetsTextureSize",x.size)}else{const d=f===void 0?0:f.length;let m=n[h.id];if(m===void 0||m.length!==d){m=[];for(let w=0;w<d;w++)m[w]=[w,0];n[h.id]=m}for(let w=0;w<d;w++){const b=m[w];b[0]=w,b[1]=f[w]}m.sort(sv);for(let w=0;w<8;w++)w<d&&m[w][1]?(r[w][0]=m[w][0],r[w][1]=m[w][1]):(r[w][0]=Number.MAX_SAFE_INTEGER,r[w][1]=0);r.sort(nv);const x=h.morphAttributes.position,g=h.morphAttributes.normal;let p=0;for(let w=0;w<8;w++){const b=r[w],y=b[0],S=b[1];y!==Number.MAX_SAFE_INTEGER&&S?(x&&h.getAttribute("morphTarget"+w)!==x[y]&&h.setAttribute("morphTarget"+w,x[y]),g&&h.getAttribute("morphNormal"+w)!==g[y]&&h.setAttribute("morphNormal"+w,g[y]),s[w]=S,p+=S):(x&&h.hasAttribute("morphTarget"+w)===!0&&h.deleteAttribute("morphTarget"+w),g&&h.hasAttribute("morphNormal"+w)===!0&&h.deleteAttribute("morphNormal"+w),s[w]=0)}const v=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(o,"morphTargetBaseInfluence",v),u.getUniforms().setValue(o,"morphTargetInfluences",s)}}return{update:c}}function ov(o,t,e,n){let s=new WeakMap;function i(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==l&&(e.update(c.instanceMatrix,o.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,o.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:i,dispose:a}}class Bl extends mn{constructor(t,e,n,s,i,a,r,c,l,h){if(h=h!==void 0?h:yi,h!==yi&&h!==po)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===yi&&(n=As),n===void 0&&h===po&&(n=wi),super(null,s,i,a,r,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:ie,this.minFilter=c!==void 0?c:ie,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const $d=new mn,jd=new Bl(1,1);jd.compareFunction=kd;const qd=new Fd,Xd=new Gm,Yd=new Gd,lu=[],hu=[],uu=new Float32Array(16),fu=new Float32Array(9),du=new Float32Array(4);function wo(o,t,e){const n=o[0];if(n<=0||n>0)return o;const s=t*e;let i=lu[s];if(i===void 0&&(i=new Float32Array(s),lu[s]=i),t!==0){n.toArray(i,0);for(let a=1,r=0;a!==t;++a)r+=e,o[a].toArray(i,r)}return i}function He(o,t){if(o.length!==t.length)return!1;for(let e=0,n=o.length;e<n;e++)if(o[e]!==t[e])return!1;return!0}function Ge(o,t){for(let e=0,n=t.length;e<n;e++)o[e]=t[e]}function jr(o,t){let e=hu[t];e===void 0&&(e=new Int32Array(t),hu[t]=e);for(let n=0;n!==t;++n)e[n]=o.allocateTextureUnit();return e}function av(o,t){const e=this.cache;e[0]!==t&&(o.uniform1f(this.addr,t),e[0]=t)}function rv(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(o.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;o.uniform2fv(this.addr,t),Ge(e,t)}}function cv(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(o.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(o.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(He(e,t))return;o.uniform3fv(this.addr,t),Ge(e,t)}}function lv(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(o.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;o.uniform4fv(this.addr,t),Ge(e,t)}}function hv(o,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;o.uniformMatrix2fv(this.addr,!1,t),Ge(e,t)}else{if(He(e,n))return;du.set(n),o.uniformMatrix2fv(this.addr,!1,du),Ge(e,n)}}function uv(o,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;o.uniformMatrix3fv(this.addr,!1,t),Ge(e,t)}else{if(He(e,n))return;fu.set(n),o.uniformMatrix3fv(this.addr,!1,fu),Ge(e,n)}}function fv(o,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;o.uniformMatrix4fv(this.addr,!1,t),Ge(e,t)}else{if(He(e,n))return;uu.set(n),o.uniformMatrix4fv(this.addr,!1,uu),Ge(e,n)}}function dv(o,t){const e=this.cache;e[0]!==t&&(o.uniform1i(this.addr,t),e[0]=t)}function pv(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(o.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;o.uniform2iv(this.addr,t),Ge(e,t)}}function mv(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(o.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;o.uniform3iv(this.addr,t),Ge(e,t)}}function gv(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(o.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;o.uniform4iv(this.addr,t),Ge(e,t)}}function xv(o,t){const e=this.cache;e[0]!==t&&(o.uniform1ui(this.addr,t),e[0]=t)}function vv(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(o.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;o.uniform2uiv(this.addr,t),Ge(e,t)}}function wv(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(o.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;o.uniform3uiv(this.addr,t),Ge(e,t)}}function yv(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(o.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;o.uniform4uiv(this.addr,t),Ge(e,t)}}function Mv(o,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(o.uniform1i(this.addr,s),n[0]=s);const i=this.type===o.SAMPLER_2D_SHADOW?jd:$d;e.setTexture2D(t||i,s)}function _v(o,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(o.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Xd,s)}function bv(o,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(o.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Yd,s)}function Sv(o,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(o.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||qd,s)}function Ev(o){switch(o){case 5126:return av;case 35664:return rv;case 35665:return cv;case 35666:return lv;case 35674:return hv;case 35675:return uv;case 35676:return fv;case 5124:case 35670:return dv;case 35667:case 35671:return pv;case 35668:case 35672:return mv;case 35669:case 35673:return gv;case 5125:return xv;case 36294:return vv;case 36295:return wv;case 36296:return yv;case 35678:case 36198:case 36298:case 36306:case 35682:return Mv;case 35679:case 36299:case 36307:return _v;case 35680:case 36300:case 36308:case 36293:return bv;case 36289:case 36303:case 36311:case 36292:return Sv}}function Av(o,t){o.uniform1fv(this.addr,t)}function Tv(o,t){const e=wo(t,this.size,2);o.uniform2fv(this.addr,e)}function Cv(o,t){const e=wo(t,this.size,3);o.uniform3fv(this.addr,e)}function Rv(o,t){const e=wo(t,this.size,4);o.uniform4fv(this.addr,e)}function Lv(o,t){const e=wo(t,this.size,4);o.uniformMatrix2fv(this.addr,!1,e)}function Pv(o,t){const e=wo(t,this.size,9);o.uniformMatrix3fv(this.addr,!1,e)}function kv(o,t){const e=wo(t,this.size,16);o.uniformMatrix4fv(this.addr,!1,e)}function Dv(o,t){o.uniform1iv(this.addr,t)}function zv(o,t){o.uniform2iv(this.addr,t)}function Iv(o,t){o.uniform3iv(this.addr,t)}function Fv(o,t){o.uniform4iv(this.addr,t)}function Uv(o,t){o.uniform1uiv(this.addr,t)}function Nv(o,t){o.uniform2uiv(this.addr,t)}function Ov(o,t){o.uniform3uiv(this.addr,t)}function Bv(o,t){o.uniform4uiv(this.addr,t)}function Wv(o,t,e){const n=this.cache,s=t.length,i=jr(e,s);He(n,i)||(o.uniform1iv(this.addr,i),Ge(n,i));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||$d,i[a])}function Hv(o,t,e){const n=this.cache,s=t.length,i=jr(e,s);He(n,i)||(o.uniform1iv(this.addr,i),Ge(n,i));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Xd,i[a])}function Gv(o,t,e){const n=this.cache,s=t.length,i=jr(e,s);He(n,i)||(o.uniform1iv(this.addr,i),Ge(n,i));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Yd,i[a])}function Vv(o,t,e){const n=this.cache,s=t.length,i=jr(e,s);He(n,i)||(o.uniform1iv(this.addr,i),Ge(n,i));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||qd,i[a])}function $v(o){switch(o){case 5126:return Av;case 35664:return Tv;case 35665:return Cv;case 35666:return Rv;case 35674:return Lv;case 35675:return Pv;case 35676:return kv;case 5124:case 35670:return Dv;case 35667:case 35671:return zv;case 35668:case 35672:return Iv;case 35669:case 35673:return Fv;case 5125:return Uv;case 36294:return Nv;case 36295:return Ov;case 36296:return Bv;case 35678:case 36198:case 36298:case 36306:case 35682:return Wv;case 35679:case 36299:case 36307:return Hv;case 35680:case 36300:case 36308:case 36293:return Gv;case 36289:case 36303:case 36311:case 36292:return Vv}}class jv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Ev(e.type)}}class qv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=$v(e.type)}}class Xv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let i=0,a=s.length;i!==a;++i){const r=s[i];r.setValue(t,e[r.id],n)}}}const Cc=/(\w+)(\])?(\[|\.)?/g;function pu(o,t){o.seq.push(t),o.map[t.id]=t}function Yv(o,t,e){const n=o.name,s=n.length;for(Cc.lastIndex=0;;){const i=Cc.exec(n),a=Cc.lastIndex;let r=i[1];const c=i[2]==="]",l=i[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===s){pu(e,l===void 0?new jv(r,o,t):new qv(r,o,t));break}else{let u=e.map[r];u===void 0&&(u=new Xv(r),pu(e,u)),e=u}}}class hr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const i=t.getActiveUniform(e,s),a=t.getUniformLocation(e,i.name);Yv(i,a,this)}}setValue(t,e,n,s){const i=this.map[e];i!==void 0&&i.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let i=0,a=e.length;i!==a;++i){const r=e[i],c=n[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,i=t.length;s!==i;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function mu(o,t,e){const n=o.createShader(t);return o.shaderSource(n,e),o.compileShader(n),n}const Kv=37297;let Zv=0;function Jv(o,t){const e=o.split(`
`),n=[],s=Math.max(t-6,0),i=Math.min(t+6,e.length);for(let a=s;a<i;a++){const r=a+1;n.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return n.join(`
`)}function Qv(o){const t=ue.getPrimaries(ue.workingColorSpace),e=ue.getPrimaries(o);let n;switch(t===e?n="":t===Sr&&e===br?n="LinearDisplayP3ToLinearSRGB":t===br&&e===Sr&&(n="LinearSRGBToLinearDisplayP3"),o){case Ds:case Gr:return[n,"LinearTransferOETF"];case Ke:case zl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",o),[n,"LinearTransferOETF"]}}function gu(o,t,e){const n=o.getShaderParameter(t,o.COMPILE_STATUS),s=o.getShaderInfoLog(t).trim();if(n&&s==="")return"";const i=/ERROR: 0:(\d+)/.exec(s);if(i){const a=parseInt(i[1]);return e.toUpperCase()+`

`+s+`

`+Jv(o.getShaderSource(t),a)}else return s}function tw(o,t){const e=Qv(t);return`vec4 ${o}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function ew(o,t){let e;switch(t){case tm:e="Linear";break;case em:e="Reinhard";break;case nm:e="OptimizedCineon";break;case sm:e="ACESFilmic";break;case om:e="AgX";break;case im:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+o+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function nw(o){return[o.extensionDerivatives||o.envMapCubeUVHeight||o.bumpMap||o.normalMapTangentSpace||o.clearcoatNormalMap||o.flatShading||o.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(o.extensionFragDepth||o.logarithmicDepthBuffer)&&o.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",o.extensionDrawBuffers&&o.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(o.extensionShaderTextureLOD||o.envMap||o.transmission)&&o.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(to).join(`
`)}function sw(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(to).join(`
`)}function iw(o){const t=[];for(const e in o){const n=o[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ow(o,t){const e={},n=o.getProgramParameter(t,o.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const i=o.getActiveAttrib(t,s),a=i.name;let r=1;i.type===o.FLOAT_MAT2&&(r=2),i.type===o.FLOAT_MAT3&&(r=3),i.type===o.FLOAT_MAT4&&(r=4),e[a]={type:i.type,location:o.getAttribLocation(t,a),locationSize:r}}return e}function to(o){return o!==""}function xu(o,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function vu(o,t){return o.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const aw=/^[ \t]*#include +<([\w\d./]+)>/gm;function hl(o){return o.replace(aw,cw)}const rw=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function cw(o,t){let e=Zt[t];if(e===void 0){const n=rw.get(t);if(n!==void 0)e=Zt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return hl(e)}const lw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wu(o){return o.replace(lw,hw)}function hw(o,t,e,n){let s="";for(let i=parseInt(t);i<parseInt(e);i++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+i+" ]").replace(/UNROLLED_LOOP_INDEX/g,i);return s}function yu(o){let t="precision "+o.precision+` float;
precision `+o.precision+" int;";return o.precision==="highp"?t+=`
#define HIGH_PRECISION`:o.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function uw(o){let t="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===yd?t="SHADOWMAP_TYPE_PCF":o.shadowMapType===C0?t="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===ys&&(t="SHADOWMAP_TYPE_VSM"),t}function fw(o){let t="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case uo:case fo:t="ENVMAP_TYPE_CUBE";break;case Hr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function dw(o){let t="ENVMAP_MODE_REFLECTION";if(o.envMap)switch(o.envMapMode){case fo:t="ENVMAP_MODE_REFRACTION";break}return t}function pw(o){let t="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case Md:t="ENVMAP_BLENDING_MULTIPLY";break;case J0:t="ENVMAP_BLENDING_MIX";break;case Q0:t="ENVMAP_BLENDING_ADD";break}return t}function mw(o){const t=o.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function gw(o,t,e,n){const s=o.getContext(),i=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=uw(e),l=fw(e),h=dw(e),u=pw(e),f=mw(e),d=e.isWebGL2?"":nw(e),m=sw(e),x=iw(i),g=s.createProgram();let p,v,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(to).join(`
`),p.length>0&&(p+=`
`),v=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(to).join(`
`),v.length>0&&(v+=`
`)):(p=[yu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(to).join(`
`),v=[d,yu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ys?"#define TONE_MAPPING":"",e.toneMapping!==Ys?Zt.tonemapping_pars_fragment:"",e.toneMapping!==Ys?ew("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Zt.colorspace_pars_fragment,tw("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(to).join(`
`)),a=hl(a),a=xu(a,e),a=vu(a,e),r=hl(r),r=xu(r,e),r=vu(r,e),a=wu(a),r=wu(r),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,p=[m,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Nh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Nh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const b=w+p+a,y=w+v+r,S=mu(s,s.VERTEX_SHADER,b),E=mu(s,s.FRAGMENT_SHADER,y);s.attachShader(g,S),s.attachShader(g,E),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function T(R){if(o.debug.checkShaderErrors){const k=s.getProgramInfoLog(g).trim(),C=s.getShaderInfoLog(S).trim(),z=s.getShaderInfoLog(E).trim();let I=!0,O=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(I=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(s,g,S,E);else{const U=gu(s,S,"vertex"),V=gu(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Program Info Log: `+k+`
`+U+`
`+V)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(C===""||z==="")&&(O=!1);O&&(R.diagnostics={runnable:I,programLog:k,vertexShader:{log:C,prefix:p},fragmentShader:{log:z,prefix:v}})}s.deleteShader(S),s.deleteShader(E),_=new hr(s,g),M=ow(s,g)}let _;this.getUniforms=function(){return _===void 0&&T(this),_};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let A=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=s.getProgramParameter(g,Kv)),A},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Zv++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=E,this}let xw=0;class vw{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new ww(t),e.set(t,n)),n}}class ww{constructor(t){this.id=xw++,this.code=t,this.usedTimes=0}}function yw(o,t,e,n,s,i,a){const r=new Ul,c=new vw,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return _===0?"uv":`uv${_}`}function g(_,M,A,R,k){const C=R.fog,z=k.geometry,I=_.isMeshStandardMaterial?R.environment:null,O=(_.isMeshStandardMaterial?e:t).get(_.envMap||I),U=O&&O.mapping===Hr?O.image.height:null,V=m[_.type];_.precision!==null&&(d=s.getMaxPrecision(_.precision),d!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const B=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,q=B!==void 0?B.length:0;let it=0;z.morphAttributes.position!==void 0&&(it=1),z.morphAttributes.normal!==void 0&&(it=2),z.morphAttributes.color!==void 0&&(it=3);let Y,nt,rt,ut;if(V){const Le=es[V];Y=Le.vertexShader,nt=Le.fragmentShader}else Y=_.vertexShader,nt=_.fragmentShader,c.update(_),rt=c.getVertexShaderID(_),ut=c.getFragmentShaderID(_);const xt=o.getRenderTarget(),At=k.isInstancedMesh===!0,Rt=k.isBatchedMesh===!0,wt=!!_.map,kt=!!_.matcap,$=!!O,le=!!_.aoMap,Tt=!!_.lightMap,Dt=!!_.bumpMap,Z=!!_.normalMap,lt=!!_.displacementMap,ft=!!_.emissiveMap,P=!!_.metalnessMap,L=!!_.roughnessMap,F=_.anisotropy>0,H=_.clearcoat>0,Q=_.iridescence>0,j=_.sheen>0,et=_.transmission>0,ot=F&&!!_.anisotropyMap,vt=H&&!!_.clearcoatMap,St=H&&!!_.clearcoatNormalMap,Kt=H&&!!_.clearcoatRoughnessMap,ht=Q&&!!_.iridescenceMap,ae=Q&&!!_.iridescenceThicknessMap,X=j&&!!_.sheenColorMap,It=j&&!!_.sheenRoughnessMap,Ct=!!_.specularMap,yt=!!_.specularColorMap,Gt=!!_.specularIntensityMap,ee=et&&!!_.transmissionMap,fe=et&&!!_.thicknessMap,Wt=!!_.gradientMap,ct=!!_.alphaMap,N=_.alphaTest>0,dt=!!_.alphaHash,pt=!!_.extensions,Ut=!!z.attributes.uv1,Nt=!!z.attributes.uv2,se=!!z.attributes.uv3;let re=Ys;return _.toneMapped&&(xt===null||xt.isXRRenderTarget===!0)&&(re=o.toneMapping),{isWebGL2:h,shaderID:V,shaderType:_.type,shaderName:_.name,vertexShader:Y,fragmentShader:nt,defines:_.defines,customVertexShaderID:rt,customFragmentShaderID:ut,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Rt,instancing:At,instancingColor:At&&k.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:xt===null?o.outputColorSpace:xt.isXRRenderTarget===!0?xt.texture.colorSpace:Ds,map:wt,matcap:kt,envMap:$,envMapMode:$&&O.mapping,envMapCubeUVHeight:U,aoMap:le,lightMap:Tt,bumpMap:Dt,normalMap:Z,displacementMap:f&&lt,emissiveMap:ft,normalMapObjectSpace:Z&&_.normalMapType===gm,normalMapTangentSpace:Z&&_.normalMapType===mm,metalnessMap:P,roughnessMap:L,anisotropy:F,anisotropyMap:ot,clearcoat:H,clearcoatMap:vt,clearcoatNormalMap:St,clearcoatRoughnessMap:Kt,iridescence:Q,iridescenceMap:ht,iridescenceThicknessMap:ae,sheen:j,sheenColorMap:X,sheenRoughnessMap:It,specularMap:Ct,specularColorMap:yt,specularIntensityMap:Gt,transmission:et,transmissionMap:ee,thicknessMap:fe,gradientMap:Wt,opaque:_.transparent===!1&&_.blending===co,alphaMap:ct,alphaTest:N,alphaHash:dt,combine:_.combine,mapUv:wt&&x(_.map.channel),aoMapUv:le&&x(_.aoMap.channel),lightMapUv:Tt&&x(_.lightMap.channel),bumpMapUv:Dt&&x(_.bumpMap.channel),normalMapUv:Z&&x(_.normalMap.channel),displacementMapUv:lt&&x(_.displacementMap.channel),emissiveMapUv:ft&&x(_.emissiveMap.channel),metalnessMapUv:P&&x(_.metalnessMap.channel),roughnessMapUv:L&&x(_.roughnessMap.channel),anisotropyMapUv:ot&&x(_.anisotropyMap.channel),clearcoatMapUv:vt&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:St&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Kt&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:ht&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:X&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:It&&x(_.sheenRoughnessMap.channel),specularMapUv:Ct&&x(_.specularMap.channel),specularColorMapUv:yt&&x(_.specularColorMap.channel),specularIntensityMapUv:Gt&&x(_.specularIntensityMap.channel),transmissionMapUv:ee&&x(_.transmissionMap.channel),thicknessMapUv:fe&&x(_.thicknessMap.channel),alphaMapUv:ct&&x(_.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(Z||F),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,vertexUv1s:Ut,vertexUv2s:Nt,vertexUv3s:se,pointsUvs:k.isPoints===!0&&!!z.attributes.uv&&(wt||ct),fog:!!C,useFog:_.fog===!0,fogExp2:C&&C.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:k.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:q,morphTextureStride:it,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:o.shadowMap.enabled&&A.length>0,shadowMapType:o.shadowMap.type,toneMapping:re,useLegacyLights:o._useLegacyLights,decodeVideoTexture:wt&&_.map.isVideoTexture===!0&&ue.getTransfer(_.map.colorSpace)===me,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Un,flipSided:_.side===pn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:pt&&_.extensions.derivatives===!0,extensionFragDepth:pt&&_.extensions.fragDepth===!0,extensionDrawBuffers:pt&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:pt&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:pt&&_.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()}}function p(_){const M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(const A in _.defines)M.push(A),M.push(_.defines[A]);return _.isRawShaderMaterial===!1&&(v(M,_),w(M,_),M.push(o.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function v(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapCubeUVHeight),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.morphAttributeCount),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function w(_,M){r.disableAll(),M.isWebGL2&&r.enable(0),M.supportsVertexTextures&&r.enable(1),M.instancing&&r.enable(2),M.instancingColor&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),_.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.skinning&&r.enable(4),M.morphTargets&&r.enable(5),M.morphNormals&&r.enable(6),M.morphColors&&r.enable(7),M.premultipliedAlpha&&r.enable(8),M.shadowMapEnabled&&r.enable(9),M.useLegacyLights&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),_.push(r.mask)}function b(_){const M=m[_.type];let A;if(M){const R=es[M];A=ng.clone(R.uniforms)}else A=_.uniforms;return A}function y(_,M){let A;for(let R=0,k=l.length;R<k;R++){const C=l[R];if(C.cacheKey===M){A=C,++A.usedTimes;break}}return A===void 0&&(A=new gw(o,M,_,i),l.push(A)),A}function S(_){if(--_.usedTimes===0){const M=l.indexOf(_);l[M]=l[l.length-1],l.pop(),_.destroy()}}function E(_){c.remove(_)}function T(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:b,acquireProgram:y,releaseProgram:S,releaseShaderCache:E,programs:l,dispose:T}}function Mw(){let o=new WeakMap;function t(i){let a=o.get(i);return a===void 0&&(a={},o.set(i,a)),a}function e(i){o.delete(i)}function n(i,a,r){o.get(i)[a]=r}function s(){o=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function _w(o,t){return o.groupOrder!==t.groupOrder?o.groupOrder-t.groupOrder:o.renderOrder!==t.renderOrder?o.renderOrder-t.renderOrder:o.material.id!==t.material.id?o.material.id-t.material.id:o.z!==t.z?o.z-t.z:o.id-t.id}function Mu(o,t){return o.groupOrder!==t.groupOrder?o.groupOrder-t.groupOrder:o.renderOrder!==t.renderOrder?o.renderOrder-t.renderOrder:o.z!==t.z?t.z-o.z:o.id-t.id}function _u(){const o=[];let t=0;const e=[],n=[],s=[];function i(){t=0,e.length=0,n.length=0,s.length=0}function a(u,f,d,m,x,g){let p=o[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:m,renderOrder:u.renderOrder,z:x,group:g},o[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=x,p.group=g),t++,p}function r(u,f,d,m,x,g){const p=a(u,f,d,m,x,g);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,m,x,g){const p=a(u,f,d,m,x,g);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||_w),n.length>1&&n.sort(f||Mu),s.length>1&&s.sort(f||Mu)}function h(){for(let u=t,f=o.length;u<f;u++){const d=o[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:i,push:r,unshift:c,finish:h,sort:l}}function bw(){let o=new WeakMap;function t(n,s){const i=o.get(n);let a;return i===void 0?(a=new _u,o.set(n,[a])):s>=i.length?(a=new _u,i.push(a)):a=i[s],a}function e(){o=new WeakMap}return{get:t,dispose:e}}function Sw(){const o={};return{get:function(t){if(o[t.id]!==void 0)return o[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new Ht};break;case"SpotLight":e={position:new W,direction:new W,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new W,halfWidth:new W,halfHeight:new W};break}return o[t.id]=e,e}}}function Ew(){const o={};return{get:function(t){if(o[t.id]!==void 0)return o[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[t.id]=e,e}}}let Aw=0;function Tw(o,t){return(t.castShadow?2:0)-(o.castShadow?2:0)+(t.map?1:0)-(o.map?1:0)}function Cw(o,t){const e=new Sw,n=Ew(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new W);const i=new W,a=new ne,r=new ne;function c(h,u){let f=0,d=0,m=0;for(let R=0;R<9;R++)s.probe[R].set(0,0,0);let x=0,g=0,p=0,v=0,w=0,b=0,y=0,S=0,E=0,T=0,_=0;h.sort(Tw);const M=u===!0?Math.PI:1;for(let R=0,k=h.length;R<k;R++){const C=h[R],z=C.color,I=C.intensity,O=C.distance,U=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)f+=z.r*I*M,d+=z.g*I*M,m+=z.b*I*M;else if(C.isLightProbe){for(let V=0;V<9;V++)s.probe[V].addScaledVector(C.sh.coefficients[V],I);_++}else if(C.isDirectionalLight){const V=e.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity*M),C.castShadow){const B=C.shadow,q=n.get(C);q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,s.directionalShadow[x]=q,s.directionalShadowMap[x]=U,s.directionalShadowMatrix[x]=C.shadow.matrix,b++}s.directional[x]=V,x++}else if(C.isSpotLight){const V=e.get(C);V.position.setFromMatrixPosition(C.matrixWorld),V.color.copy(z).multiplyScalar(I*M),V.distance=O,V.coneCos=Math.cos(C.angle),V.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),V.decay=C.decay,s.spot[p]=V;const B=C.shadow;if(C.map&&(s.spotLightMap[E]=C.map,E++,B.updateMatrices(C),C.castShadow&&T++),s.spotLightMatrix[p]=B.matrix,C.castShadow){const q=n.get(C);q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,s.spotShadow[p]=q,s.spotShadowMap[p]=U,S++}p++}else if(C.isRectAreaLight){const V=e.get(C);V.color.copy(z).multiplyScalar(I),V.halfWidth.set(C.width*.5,0,0),V.halfHeight.set(0,C.height*.5,0),s.rectArea[v]=V,v++}else if(C.isPointLight){const V=e.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity*M),V.distance=C.distance,V.decay=C.decay,C.castShadow){const B=C.shadow,q=n.get(C);q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,q.shadowCameraNear=B.camera.near,q.shadowCameraFar=B.camera.far,s.pointShadow[g]=q,s.pointShadowMap[g]=U,s.pointShadowMatrix[g]=C.shadow.matrix,y++}s.point[g]=V,g++}else if(C.isHemisphereLight){const V=e.get(C);V.skyColor.copy(C.color).multiplyScalar(I*M),V.groundColor.copy(C.groundColor).multiplyScalar(I*M),s.hemi[w]=V,w++}}v>0&&(t.isWebGL2?o.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=_t.LTC_FLOAT_1,s.rectAreaLTC2=_t.LTC_FLOAT_2):(s.rectAreaLTC1=_t.LTC_HALF_1,s.rectAreaLTC2=_t.LTC_HALF_2):o.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=_t.LTC_FLOAT_1,s.rectAreaLTC2=_t.LTC_FLOAT_2):o.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=_t.LTC_HALF_1,s.rectAreaLTC2=_t.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=d,s.ambient[2]=m;const A=s.hash;(A.directionalLength!==x||A.pointLength!==g||A.spotLength!==p||A.rectAreaLength!==v||A.hemiLength!==w||A.numDirectionalShadows!==b||A.numPointShadows!==y||A.numSpotShadows!==S||A.numSpotMaps!==E||A.numLightProbes!==_)&&(s.directional.length=x,s.spot.length=p,s.rectArea.length=v,s.point.length=g,s.hemi.length=w,s.directionalShadow.length=b,s.directionalShadowMap.length=b,s.pointShadow.length=y,s.pointShadowMap.length=y,s.spotShadow.length=S,s.spotShadowMap.length=S,s.directionalShadowMatrix.length=b,s.pointShadowMatrix.length=y,s.spotLightMatrix.length=S+E-T,s.spotLightMap.length=E,s.numSpotLightShadowsWithMaps=T,s.numLightProbes=_,A.directionalLength=x,A.pointLength=g,A.spotLength=p,A.rectAreaLength=v,A.hemiLength=w,A.numDirectionalShadows=b,A.numPointShadows=y,A.numSpotShadows=S,A.numSpotMaps=E,A.numLightProbes=_,s.version=Aw++)}function l(h,u){let f=0,d=0,m=0,x=0,g=0;const p=u.matrixWorldInverse;for(let v=0,w=h.length;v<w;v++){const b=h[v];if(b.isDirectionalLight){const y=s.directional[f];y.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),f++}else if(b.isSpotLight){const y=s.spot[m];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),m++}else if(b.isRectAreaLight){const y=s.rectArea[x];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(p),r.identity(),a.copy(b.matrixWorld),a.premultiply(p),r.extractRotation(a),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(r),y.halfHeight.applyMatrix4(r),x++}else if(b.isPointLight){const y=s.point[d];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(p),d++}else if(b.isHemisphereLight){const y=s.hemi[g];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(p),g++}}}return{setup:c,setupView:l,state:s}}function bu(o,t){const e=new Cw(o,t),n=[],s=[];function i(){n.length=0,s.length=0}function a(u){n.push(u)}function r(u){s.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:i,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:r}}function Rw(o,t){let e=new WeakMap;function n(i,a=0){const r=e.get(i);let c;return r===void 0?(c=new bu(o,t),e.set(i,[c])):a>=r.length?(c=new bu(o,t),r.push(c)):c=r[a],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class Lw extends ca{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=dm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Pw extends ca{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const kw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Dw=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function zw(o,t,e){let n=new Is;const s=new Bt,i=new Bt,a=new Yt,r=new Lw({depthPacking:pm}),c=new Pw,l={},h=e.maxTextureSize,u={[Ps]:pn,[pn]:Ps,[Un]:Un},f=new _e({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Bt},radius:{value:4}},vertexShader:kw,fragmentShader:Dw}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const m=new Je;m.setAttribute("position",new de(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ge(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=yd;let p=this.type;this.render=function(S,E,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const _=o.getRenderTarget(),M=o.getActiveCubeFace(),A=o.getActiveMipmapLevel(),R=o.state;R.setBlending(Ls),R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const k=p!==ys&&this.type===ys,C=p===ys&&this.type!==ys;for(let z=0,I=S.length;z<I;z++){const O=S[z],U=O.shadow;if(U===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;s.copy(U.mapSize);const V=U.getFrameExtents();if(s.multiply(V),i.copy(U.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(i.x=Math.floor(h/V.x),s.x=i.x*V.x,U.mapSize.x=i.x),s.y>h&&(i.y=Math.floor(h/V.y),s.y=i.y*V.y,U.mapSize.y=i.y)),U.map===null||k===!0||C===!0){const q=this.type!==ys?{minFilter:ie,magFilter:ie}:{};U.map!==null&&U.map.dispose(),U.map=new cs(s.x,s.y,q),U.map.texture.name=O.name+".shadowMap",U.camera.updateProjectionMatrix()}o.setRenderTarget(U.map),o.clear();const B=U.getViewportCount();for(let q=0;q<B;q++){const it=U.getViewport(q);a.set(i.x*it.x,i.y*it.y,i.x*it.z,i.y*it.w),R.viewport(a),U.updateMatrices(O,q),n=U.getFrustum(),b(E,T,U.camera,O,this.type)}U.isPointLightShadow!==!0&&this.type===ys&&v(U,T),U.needsUpdate=!1}p=this.type,g.needsUpdate=!1,o.setRenderTarget(_,M,A)};function v(S,E){const T=t.update(x);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new cs(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,o.setRenderTarget(S.mapPass),o.clear(),o.renderBufferDirect(E,null,T,f,x,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,o.setRenderTarget(S.map),o.clear(),o.renderBufferDirect(E,null,T,d,x,null)}function w(S,E,T,_){let M=null;const A=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)M=A;else if(M=T.isPointLight===!0?c:r,o.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const R=M.uuid,k=E.uuid;let C=l[R];C===void 0&&(C={},l[R]=C);let z=C[k];z===void 0&&(z=M.clone(),C[k]=z,E.addEventListener("dispose",y)),M=z}if(M.visible=E.visible,M.wireframe=E.wireframe,_===ys?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const R=o.properties.get(M);R.light=T}return M}function b(S,E,T,_,M){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===ys)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const k=t.update(S),C=S.material;if(Array.isArray(C)){const z=k.groups;for(let I=0,O=z.length;I<O;I++){const U=z[I],V=C[U.materialIndex];if(V&&V.visible){const B=w(S,V,_,M);S.onBeforeShadow(o,S,E,T,k,B,U),o.renderBufferDirect(T,null,k,B,S,U),S.onAfterShadow(o,S,E,T,k,B,U)}}}else if(C.visible){const z=w(S,C,_,M);S.onBeforeShadow(o,S,E,T,k,z,null),o.renderBufferDirect(T,null,k,z,S,null),S.onAfterShadow(o,S,E,T,k,z,null)}}const R=S.children;for(let k=0,C=R.length;k<C;k++)b(R[k],E,T,_,M)}function y(S){S.target.removeEventListener("dispose",y);for(const T in l){const _=l[T],M=S.target.uuid;M in _&&(_[M].dispose(),delete _[M])}}}function Iw(o,t,e){const n=e.isWebGL2;function s(){let N=!1;const dt=new Yt;let pt=null;const Ut=new Yt(0,0,0,0);return{setMask:function(Nt){pt!==Nt&&!N&&(o.colorMask(Nt,Nt,Nt,Nt),pt=Nt)},setLocked:function(Nt){N=Nt},setClear:function(Nt,se,re,xe,Le){Le===!0&&(Nt*=xe,se*=xe,re*=xe),dt.set(Nt,se,re,xe),Ut.equals(dt)===!1&&(o.clearColor(Nt,se,re,xe),Ut.copy(dt))},reset:function(){N=!1,pt=null,Ut.set(-1,0,0,0)}}}function i(){let N=!1,dt=null,pt=null,Ut=null;return{setTest:function(Nt){Nt?Rt(o.DEPTH_TEST):wt(o.DEPTH_TEST)},setMask:function(Nt){dt!==Nt&&!N&&(o.depthMask(Nt),dt=Nt)},setFunc:function(Nt){if(pt!==Nt){switch(Nt){case $0:o.depthFunc(o.NEVER);break;case j0:o.depthFunc(o.ALWAYS);break;case q0:o.depthFunc(o.LESS);break;case yr:o.depthFunc(o.LEQUAL);break;case X0:o.depthFunc(o.EQUAL);break;case Y0:o.depthFunc(o.GEQUAL);break;case K0:o.depthFunc(o.GREATER);break;case Z0:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}pt=Nt}},setLocked:function(Nt){N=Nt},setClear:function(Nt){Ut!==Nt&&(o.clearDepth(Nt),Ut=Nt)},reset:function(){N=!1,dt=null,pt=null,Ut=null}}}function a(){let N=!1,dt=null,pt=null,Ut=null,Nt=null,se=null,re=null,xe=null,Le=null;return{setTest:function(ce){N||(ce?Rt(o.STENCIL_TEST):wt(o.STENCIL_TEST))},setMask:function(ce){dt!==ce&&!N&&(o.stencilMask(ce),dt=ce)},setFunc:function(ce,Ve,Ln){(pt!==ce||Ut!==Ve||Nt!==Ln)&&(o.stencilFunc(ce,Ve,Ln),pt=ce,Ut=Ve,Nt=Ln)},setOp:function(ce,Ve,Ln){(se!==ce||re!==Ve||xe!==Ln)&&(o.stencilOp(ce,Ve,Ln),se=ce,re=Ve,xe=Ln)},setLocked:function(ce){N=ce},setClear:function(ce){Le!==ce&&(o.clearStencil(ce),Le=ce)},reset:function(){N=!1,dt=null,pt=null,Ut=null,Nt=null,se=null,re=null,xe=null,Le=null}}}const r=new s,c=new i,l=new a,h=new WeakMap,u=new WeakMap;let f={},d={},m=new WeakMap,x=[],g=null,p=!1,v=null,w=null,b=null,y=null,S=null,E=null,T=null,_=new Ht(0,0,0),M=0,A=!1,R=null,k=null,C=null,z=null,I=null;const O=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,V=0;const B=o.getParameter(o.VERSION);B.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(B)[1]),U=V>=1):B.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),U=V>=2);let q=null,it={};const Y=o.getParameter(o.SCISSOR_BOX),nt=o.getParameter(o.VIEWPORT),rt=new Yt().fromArray(Y),ut=new Yt().fromArray(nt);function xt(N,dt,pt,Ut){const Nt=new Uint8Array(4),se=o.createTexture();o.bindTexture(N,se),o.texParameteri(N,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(N,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let re=0;re<pt;re++)n&&(N===o.TEXTURE_3D||N===o.TEXTURE_2D_ARRAY)?o.texImage3D(dt,0,o.RGBA,1,1,Ut,0,o.RGBA,o.UNSIGNED_BYTE,Nt):o.texImage2D(dt+re,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,Nt);return se}const At={};At[o.TEXTURE_2D]=xt(o.TEXTURE_2D,o.TEXTURE_2D,1),At[o.TEXTURE_CUBE_MAP]=xt(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(At[o.TEXTURE_2D_ARRAY]=xt(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),At[o.TEXTURE_3D]=xt(o.TEXTURE_3D,o.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Rt(o.DEPTH_TEST),c.setFunc(yr),ft(!1),P(ah),Rt(o.CULL_FACE),Z(Ls);function Rt(N){f[N]!==!0&&(o.enable(N),f[N]=!0)}function wt(N){f[N]!==!1&&(o.disable(N),f[N]=!1)}function kt(N,dt){return d[N]!==dt?(o.bindFramebuffer(N,dt),d[N]=dt,n&&(N===o.DRAW_FRAMEBUFFER&&(d[o.FRAMEBUFFER]=dt),N===o.FRAMEBUFFER&&(d[o.DRAW_FRAMEBUFFER]=dt)),!0):!1}function $(N,dt){let pt=x,Ut=!1;if(N)if(pt=m.get(dt),pt===void 0&&(pt=[],m.set(dt,pt)),N.isWebGLMultipleRenderTargets){const Nt=N.texture;if(pt.length!==Nt.length||pt[0]!==o.COLOR_ATTACHMENT0){for(let se=0,re=Nt.length;se<re;se++)pt[se]=o.COLOR_ATTACHMENT0+se;pt.length=Nt.length,Ut=!0}}else pt[0]!==o.COLOR_ATTACHMENT0&&(pt[0]=o.COLOR_ATTACHMENT0,Ut=!0);else pt[0]!==o.BACK&&(pt[0]=o.BACK,Ut=!0);Ut&&(e.isWebGL2?o.drawBuffers(pt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(pt))}function le(N){return g!==N?(o.useProgram(N),g=N,!0):!1}const Tt={[di]:o.FUNC_ADD,[L0]:o.FUNC_SUBTRACT,[P0]:o.FUNC_REVERSE_SUBTRACT};if(n)Tt[ch]=o.MIN,Tt[lh]=o.MAX;else{const N=t.get("EXT_blend_minmax");N!==null&&(Tt[ch]=N.MIN_EXT,Tt[lh]=N.MAX_EXT)}const Dt={[k0]:o.ZERO,[D0]:o.ONE,[z0]:o.SRC_COLOR,[sl]:o.SRC_ALPHA,[B0]:o.SRC_ALPHA_SATURATE,[N0]:o.DST_COLOR,[F0]:o.DST_ALPHA,[I0]:o.ONE_MINUS_SRC_COLOR,[il]:o.ONE_MINUS_SRC_ALPHA,[O0]:o.ONE_MINUS_DST_COLOR,[U0]:o.ONE_MINUS_DST_ALPHA,[W0]:o.CONSTANT_COLOR,[H0]:o.ONE_MINUS_CONSTANT_COLOR,[G0]:o.CONSTANT_ALPHA,[V0]:o.ONE_MINUS_CONSTANT_ALPHA};function Z(N,dt,pt,Ut,Nt,se,re,xe,Le,ce){if(N===Ls){p===!0&&(wt(o.BLEND),p=!1);return}if(p===!1&&(Rt(o.BLEND),p=!0),N!==R0){if(N!==v||ce!==A){if((w!==di||S!==di)&&(o.blendEquation(o.FUNC_ADD),w=di,S=di),ce)switch(N){case co:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case el:o.blendFunc(o.ONE,o.ONE);break;case rh:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case nl:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case co:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case el:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case rh:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case nl:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}b=null,y=null,E=null,T=null,_.set(0,0,0),M=0,v=N,A=ce}return}Nt=Nt||dt,se=se||pt,re=re||Ut,(dt!==w||Nt!==S)&&(o.blendEquationSeparate(Tt[dt],Tt[Nt]),w=dt,S=Nt),(pt!==b||Ut!==y||se!==E||re!==T)&&(o.blendFuncSeparate(Dt[pt],Dt[Ut],Dt[se],Dt[re]),b=pt,y=Ut,E=se,T=re),(xe.equals(_)===!1||Le!==M)&&(o.blendColor(xe.r,xe.g,xe.b,Le),_.copy(xe),M=Le),v=N,A=!1}function lt(N,dt){N.side===Un?wt(o.CULL_FACE):Rt(o.CULL_FACE);let pt=N.side===pn;dt&&(pt=!pt),ft(pt),N.blending===co&&N.transparent===!1?Z(Ls):Z(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),c.setFunc(N.depthFunc),c.setTest(N.depthTest),c.setMask(N.depthWrite),r.setMask(N.colorWrite);const Ut=N.stencilWrite;l.setTest(Ut),Ut&&(l.setMask(N.stencilWriteMask),l.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),l.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),F(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Rt(o.SAMPLE_ALPHA_TO_COVERAGE):wt(o.SAMPLE_ALPHA_TO_COVERAGE)}function ft(N){R!==N&&(N?o.frontFace(o.CW):o.frontFace(o.CCW),R=N)}function P(N){N!==A0?(Rt(o.CULL_FACE),N!==k&&(N===ah?o.cullFace(o.BACK):N===T0?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):wt(o.CULL_FACE),k=N}function L(N){N!==C&&(U&&o.lineWidth(N),C=N)}function F(N,dt,pt){N?(Rt(o.POLYGON_OFFSET_FILL),(z!==dt||I!==pt)&&(o.polygonOffset(dt,pt),z=dt,I=pt)):wt(o.POLYGON_OFFSET_FILL)}function H(N){N?Rt(o.SCISSOR_TEST):wt(o.SCISSOR_TEST)}function Q(N){N===void 0&&(N=o.TEXTURE0+O-1),q!==N&&(o.activeTexture(N),q=N)}function j(N,dt,pt){pt===void 0&&(q===null?pt=o.TEXTURE0+O-1:pt=q);let Ut=it[pt];Ut===void 0&&(Ut={type:void 0,texture:void 0},it[pt]=Ut),(Ut.type!==N||Ut.texture!==dt)&&(q!==pt&&(o.activeTexture(pt),q=pt),o.bindTexture(N,dt||At[N]),Ut.type=N,Ut.texture=dt)}function et(){const N=it[q];N!==void 0&&N.type!==void 0&&(o.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function ot(){try{o.compressedTexImage2D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function vt(){try{o.compressedTexImage3D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function St(){try{o.texSubImage2D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Kt(){try{o.texSubImage3D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ht(){try{o.compressedTexSubImage2D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ae(){try{o.compressedTexSubImage3D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function X(){try{o.texStorage2D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function It(){try{o.texStorage3D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ct(){try{o.texImage2D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function yt(){try{o.texImage3D.apply(o,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Gt(N){rt.equals(N)===!1&&(o.scissor(N.x,N.y,N.z,N.w),rt.copy(N))}function ee(N){ut.equals(N)===!1&&(o.viewport(N.x,N.y,N.z,N.w),ut.copy(N))}function fe(N,dt){let pt=u.get(dt);pt===void 0&&(pt=new WeakMap,u.set(dt,pt));let Ut=pt.get(N);Ut===void 0&&(Ut=o.getUniformBlockIndex(dt,N.name),pt.set(N,Ut))}function Wt(N,dt){const Ut=u.get(dt).get(N);h.get(dt)!==Ut&&(o.uniformBlockBinding(dt,Ut,N.__bindingPointIndex),h.set(dt,Ut))}function ct(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),n===!0&&(o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null)),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),f={},q=null,it={},d={},m=new WeakMap,x=[],g=null,p=!1,v=null,w=null,b=null,y=null,S=null,E=null,T=null,_=new Ht(0,0,0),M=0,A=!1,R=null,k=null,C=null,z=null,I=null,rt.set(0,0,o.canvas.width,o.canvas.height),ut.set(0,0,o.canvas.width,o.canvas.height),r.reset(),c.reset(),l.reset()}return{buffers:{color:r,depth:c,stencil:l},enable:Rt,disable:wt,bindFramebuffer:kt,drawBuffers:$,useProgram:le,setBlending:Z,setMaterial:lt,setFlipSided:ft,setCullFace:P,setLineWidth:L,setPolygonOffset:F,setScissorTest:H,activeTexture:Q,bindTexture:j,unbindTexture:et,compressedTexImage2D:ot,compressedTexImage3D:vt,texImage2D:Ct,texImage3D:yt,updateUBOMapping:fe,uniformBlockBinding:Wt,texStorage2D:X,texStorage3D:It,texSubImage2D:St,texSubImage3D:Kt,compressedTexSubImage2D:ht,compressedTexSubImage3D:ae,scissor:Gt,viewport:ee,reset:ct}}function Fw(o,t,e,n,s,i,a){const r=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,L){return d?new OffscreenCanvas(P,L):Tr("canvas")}function x(P,L,F,H){let Q=1;if((P.width>H||P.height>H)&&(Q=H/Math.max(P.width,P.height)),Q<1||L===!0)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap){const j=L?Ar:Math.floor,et=j(Q*P.width),ot=j(Q*P.height);u===void 0&&(u=m(et,ot));const vt=F?m(et,ot):u;return vt.width=et,vt.height=ot,vt.getContext("2d").drawImage(P,0,0,et,ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+P.width+"x"+P.height+") to ("+et+"x"+ot+")."),vt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+P.width+"x"+P.height+")."),P;return P}function g(P){return ll(P.width)&&ll(P.height)}function p(P){return r?!1:P.wrapS!==Ze||P.wrapT!==Ze||P.minFilter!==ie&&P.minFilter!==Fe}function v(P,L){return P.generateMipmaps&&L&&P.minFilter!==ie&&P.minFilter!==Fe}function w(P){o.generateMipmap(P)}function b(P,L,F,H,Q=!1){if(r===!1)return L;if(P!==null){if(o[P]!==void 0)return o[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let j=L;if(L===o.RED&&(F===o.FLOAT&&(j=o.R32F),F===o.HALF_FLOAT&&(j=o.R16F),F===o.UNSIGNED_BYTE&&(j=o.R8)),L===o.RED_INTEGER&&(F===o.UNSIGNED_BYTE&&(j=o.R8UI),F===o.UNSIGNED_SHORT&&(j=o.R16UI),F===o.UNSIGNED_INT&&(j=o.R32UI),F===o.BYTE&&(j=o.R8I),F===o.SHORT&&(j=o.R16I),F===o.INT&&(j=o.R32I)),L===o.RG&&(F===o.FLOAT&&(j=o.RG32F),F===o.HALF_FLOAT&&(j=o.RG16F),F===o.UNSIGNED_BYTE&&(j=o.RG8)),L===o.RGBA){const et=Q?_r:ue.getTransfer(H);F===o.FLOAT&&(j=o.RGBA32F),F===o.HALF_FLOAT&&(j=o.RGBA16F),F===o.UNSIGNED_BYTE&&(j=et===me?o.SRGB8_ALPHA8:o.RGBA8),F===o.UNSIGNED_SHORT_4_4_4_4&&(j=o.RGBA4),F===o.UNSIGNED_SHORT_5_5_5_1&&(j=o.RGB5_A1)}return(j===o.R16F||j===o.R32F||j===o.RG16F||j===o.RG32F||j===o.RGBA16F||j===o.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function y(P,L,F){return v(P,F)===!0||P.isFramebufferTexture&&P.minFilter!==ie&&P.minFilter!==Fe?Math.log2(Math.max(L.width,L.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?L.mipmaps.length:1}function S(P){return P===ie||P===hh||P===ec?o.NEAREST:o.LINEAR}function E(P){const L=P.target;L.removeEventListener("dispose",E),_(L),L.isVideoTexture&&h.delete(L)}function T(P){const L=P.target;L.removeEventListener("dispose",T),A(L)}function _(P){const L=n.get(P);if(L.__webglInit===void 0)return;const F=P.source,H=f.get(F);if(H){const Q=H[L.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&M(P),Object.keys(H).length===0&&f.delete(F)}n.remove(P)}function M(P){const L=n.get(P);o.deleteTexture(L.__webglTexture);const F=P.source,H=f.get(F);delete H[L.__cacheKey],a.memory.textures--}function A(P){const L=P.texture,F=n.get(P),H=n.get(L);if(H.__webglTexture!==void 0&&(o.deleteTexture(H.__webglTexture),a.memory.textures--),P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(F.__webglFramebuffer[Q]))for(let j=0;j<F.__webglFramebuffer[Q].length;j++)o.deleteFramebuffer(F.__webglFramebuffer[Q][j]);else o.deleteFramebuffer(F.__webglFramebuffer[Q]);F.__webglDepthbuffer&&o.deleteRenderbuffer(F.__webglDepthbuffer[Q])}else{if(Array.isArray(F.__webglFramebuffer))for(let Q=0;Q<F.__webglFramebuffer.length;Q++)o.deleteFramebuffer(F.__webglFramebuffer[Q]);else o.deleteFramebuffer(F.__webglFramebuffer);if(F.__webglDepthbuffer&&o.deleteRenderbuffer(F.__webglDepthbuffer),F.__webglMultisampledFramebuffer&&o.deleteFramebuffer(F.__webglMultisampledFramebuffer),F.__webglColorRenderbuffer)for(let Q=0;Q<F.__webglColorRenderbuffer.length;Q++)F.__webglColorRenderbuffer[Q]&&o.deleteRenderbuffer(F.__webglColorRenderbuffer[Q]);F.__webglDepthRenderbuffer&&o.deleteRenderbuffer(F.__webglDepthRenderbuffer)}if(P.isWebGLMultipleRenderTargets)for(let Q=0,j=L.length;Q<j;Q++){const et=n.get(L[Q]);et.__webglTexture&&(o.deleteTexture(et.__webglTexture),a.memory.textures--),n.remove(L[Q])}n.remove(L),n.remove(P)}let R=0;function k(){R=0}function C(){const P=R;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),R+=1,P}function z(P){const L=[];return L.push(P.wrapS),L.push(P.wrapT),L.push(P.wrapR||0),L.push(P.magFilter),L.push(P.minFilter),L.push(P.anisotropy),L.push(P.internalFormat),L.push(P.format),L.push(P.type),L.push(P.generateMipmaps),L.push(P.premultiplyAlpha),L.push(P.flipY),L.push(P.unpackAlignment),L.push(P.colorSpace),L.join()}function I(P,L){const F=n.get(P);if(P.isVideoTexture&&lt(P),P.isRenderTargetTexture===!1&&P.version>0&&F.__version!==P.version){const H=P.image;if(H===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{rt(F,P,L);return}}e.bindTexture(o.TEXTURE_2D,F.__webglTexture,o.TEXTURE0+L)}function O(P,L){const F=n.get(P);if(P.version>0&&F.__version!==P.version){rt(F,P,L);return}e.bindTexture(o.TEXTURE_2D_ARRAY,F.__webglTexture,o.TEXTURE0+L)}function U(P,L){const F=n.get(P);if(P.version>0&&F.__version!==P.version){rt(F,P,L);return}e.bindTexture(o.TEXTURE_3D,F.__webglTexture,o.TEXTURE0+L)}function V(P,L){const F=n.get(P);if(P.version>0&&F.__version!==P.version){ut(F,P,L);return}e.bindTexture(o.TEXTURE_CUBE_MAP,F.__webglTexture,o.TEXTURE0+L)}const B={[Mr]:o.REPEAT,[Ze]:o.CLAMP_TO_EDGE,[rl]:o.MIRRORED_REPEAT},q={[ie]:o.NEAREST,[hh]:o.NEAREST_MIPMAP_NEAREST,[ec]:o.NEAREST_MIPMAP_LINEAR,[Fe]:o.LINEAR,[am]:o.LINEAR_MIPMAP_NEAREST,[bi]:o.LINEAR_MIPMAP_LINEAR},it={[xm]:o.NEVER,[bm]:o.ALWAYS,[vm]:o.LESS,[kd]:o.LEQUAL,[wm]:o.EQUAL,[_m]:o.GEQUAL,[ym]:o.GREATER,[Mm]:o.NOTEQUAL};function Y(P,L,F){if(F?(o.texParameteri(P,o.TEXTURE_WRAP_S,B[L.wrapS]),o.texParameteri(P,o.TEXTURE_WRAP_T,B[L.wrapT]),(P===o.TEXTURE_3D||P===o.TEXTURE_2D_ARRAY)&&o.texParameteri(P,o.TEXTURE_WRAP_R,B[L.wrapR]),o.texParameteri(P,o.TEXTURE_MAG_FILTER,q[L.magFilter]),o.texParameteri(P,o.TEXTURE_MIN_FILTER,q[L.minFilter])):(o.texParameteri(P,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(P,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),(P===o.TEXTURE_3D||P===o.TEXTURE_2D_ARRAY)&&o.texParameteri(P,o.TEXTURE_WRAP_R,o.CLAMP_TO_EDGE),(L.wrapS!==Ze||L.wrapT!==Ze)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),o.texParameteri(P,o.TEXTURE_MAG_FILTER,S(L.magFilter)),o.texParameteri(P,o.TEXTURE_MIN_FILTER,S(L.minFilter)),L.minFilter!==ie&&L.minFilter!==Fe&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),L.compareFunction&&(o.texParameteri(P,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(P,o.TEXTURE_COMPARE_FUNC,it[L.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const H=t.get("EXT_texture_filter_anisotropic");if(L.magFilter===ie||L.minFilter!==ec&&L.minFilter!==bi||L.type===Ts&&t.has("OES_texture_float_linear")===!1||r===!1&&L.type===ks&&t.has("OES_texture_half_float_linear")===!1)return;(L.anisotropy>1||n.get(L).__currentAnisotropy)&&(o.texParameterf(P,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(L.anisotropy,s.getMaxAnisotropy())),n.get(L).__currentAnisotropy=L.anisotropy)}}function nt(P,L){let F=!1;P.__webglInit===void 0&&(P.__webglInit=!0,L.addEventListener("dispose",E));const H=L.source;let Q=f.get(H);Q===void 0&&(Q={},f.set(H,Q));const j=z(L);if(j!==P.__cacheKey){Q[j]===void 0&&(Q[j]={texture:o.createTexture(),usedTimes:0},a.memory.textures++,F=!0),Q[j].usedTimes++;const et=Q[P.__cacheKey];et!==void 0&&(Q[P.__cacheKey].usedTimes--,et.usedTimes===0&&M(L)),P.__cacheKey=j,P.__webglTexture=Q[j].texture}return F}function rt(P,L,F){let H=o.TEXTURE_2D;(L.isDataArrayTexture||L.isCompressedArrayTexture)&&(H=o.TEXTURE_2D_ARRAY),L.isData3DTexture&&(H=o.TEXTURE_3D);const Q=nt(P,L),j=L.source;e.bindTexture(H,P.__webglTexture,o.TEXTURE0+F);const et=n.get(j);if(j.version!==et.__version||Q===!0){e.activeTexture(o.TEXTURE0+F);const ot=ue.getPrimaries(ue.workingColorSpace),vt=L.colorSpace===Nn?null:ue.getPrimaries(L.colorSpace),St=L.colorSpace===Nn||ot===vt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,L.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,L.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);const Kt=p(L)&&g(L.image)===!1;let ht=x(L.image,Kt,!1,s.maxTextureSize);ht=ft(L,ht);const ae=g(ht)||r,X=i.convert(L.format,L.colorSpace);let It=i.convert(L.type),Ct=b(L.internalFormat,X,It,L.colorSpace,L.isVideoTexture);Y(H,L,ae);let yt;const Gt=L.mipmaps,ee=r&&L.isVideoTexture!==!0&&Ct!==Ld,fe=et.__version===void 0||Q===!0,Wt=y(L,ht,ae);if(L.isDepthTexture)Ct=o.DEPTH_COMPONENT,r?L.type===Ts?Ct=o.DEPTH_COMPONENT32F:L.type===As?Ct=o.DEPTH_COMPONENT24:L.type===wi?Ct=o.DEPTH24_STENCIL8:Ct=o.DEPTH_COMPONENT16:L.type===Ts&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),L.format===yi&&Ct===o.DEPTH_COMPONENT&&L.type!==Dl&&L.type!==As&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),L.type=As,It=i.convert(L.type)),L.format===po&&Ct===o.DEPTH_COMPONENT&&(Ct=o.DEPTH_STENCIL,L.type!==wi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),L.type=wi,It=i.convert(L.type))),fe&&(ee?e.texStorage2D(o.TEXTURE_2D,1,Ct,ht.width,ht.height):e.texImage2D(o.TEXTURE_2D,0,Ct,ht.width,ht.height,0,X,It,null));else if(L.isDataTexture)if(Gt.length>0&&ae){ee&&fe&&e.texStorage2D(o.TEXTURE_2D,Wt,Ct,Gt[0].width,Gt[0].height);for(let ct=0,N=Gt.length;ct<N;ct++)yt=Gt[ct],ee?e.texSubImage2D(o.TEXTURE_2D,ct,0,0,yt.width,yt.height,X,It,yt.data):e.texImage2D(o.TEXTURE_2D,ct,Ct,yt.width,yt.height,0,X,It,yt.data);L.generateMipmaps=!1}else ee?(fe&&e.texStorage2D(o.TEXTURE_2D,Wt,Ct,ht.width,ht.height),e.texSubImage2D(o.TEXTURE_2D,0,0,0,ht.width,ht.height,X,It,ht.data)):e.texImage2D(o.TEXTURE_2D,0,Ct,ht.width,ht.height,0,X,It,ht.data);else if(L.isCompressedTexture)if(L.isCompressedArrayTexture){ee&&fe&&e.texStorage3D(o.TEXTURE_2D_ARRAY,Wt,Ct,Gt[0].width,Gt[0].height,ht.depth);for(let ct=0,N=Gt.length;ct<N;ct++)yt=Gt[ct],L.format!==Ae?X!==null?ee?e.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,ct,0,0,0,yt.width,yt.height,ht.depth,X,yt.data,0,0):e.compressedTexImage3D(o.TEXTURE_2D_ARRAY,ct,Ct,yt.width,yt.height,ht.depth,0,yt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ee?e.texSubImage3D(o.TEXTURE_2D_ARRAY,ct,0,0,0,yt.width,yt.height,ht.depth,X,It,yt.data):e.texImage3D(o.TEXTURE_2D_ARRAY,ct,Ct,yt.width,yt.height,ht.depth,0,X,It,yt.data)}else{ee&&fe&&e.texStorage2D(o.TEXTURE_2D,Wt,Ct,Gt[0].width,Gt[0].height);for(let ct=0,N=Gt.length;ct<N;ct++)yt=Gt[ct],L.format!==Ae?X!==null?ee?e.compressedTexSubImage2D(o.TEXTURE_2D,ct,0,0,yt.width,yt.height,X,yt.data):e.compressedTexImage2D(o.TEXTURE_2D,ct,Ct,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ee?e.texSubImage2D(o.TEXTURE_2D,ct,0,0,yt.width,yt.height,X,It,yt.data):e.texImage2D(o.TEXTURE_2D,ct,Ct,yt.width,yt.height,0,X,It,yt.data)}else if(L.isDataArrayTexture)ee?(fe&&e.texStorage3D(o.TEXTURE_2D_ARRAY,Wt,Ct,ht.width,ht.height,ht.depth),e.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,ht.width,ht.height,ht.depth,X,It,ht.data)):e.texImage3D(o.TEXTURE_2D_ARRAY,0,Ct,ht.width,ht.height,ht.depth,0,X,It,ht.data);else if(L.isData3DTexture)ee?(fe&&e.texStorage3D(o.TEXTURE_3D,Wt,Ct,ht.width,ht.height,ht.depth),e.texSubImage3D(o.TEXTURE_3D,0,0,0,0,ht.width,ht.height,ht.depth,X,It,ht.data)):e.texImage3D(o.TEXTURE_3D,0,Ct,ht.width,ht.height,ht.depth,0,X,It,ht.data);else if(L.isFramebufferTexture){if(fe)if(ee)e.texStorage2D(o.TEXTURE_2D,Wt,Ct,ht.width,ht.height);else{let ct=ht.width,N=ht.height;for(let dt=0;dt<Wt;dt++)e.texImage2D(o.TEXTURE_2D,dt,Ct,ct,N,0,X,It,null),ct>>=1,N>>=1}}else if(Gt.length>0&&ae){ee&&fe&&e.texStorage2D(o.TEXTURE_2D,Wt,Ct,Gt[0].width,Gt[0].height);for(let ct=0,N=Gt.length;ct<N;ct++)yt=Gt[ct],ee?e.texSubImage2D(o.TEXTURE_2D,ct,0,0,X,It,yt):e.texImage2D(o.TEXTURE_2D,ct,Ct,X,It,yt);L.generateMipmaps=!1}else ee?(fe&&e.texStorage2D(o.TEXTURE_2D,Wt,Ct,ht.width,ht.height),e.texSubImage2D(o.TEXTURE_2D,0,0,0,X,It,ht)):e.texImage2D(o.TEXTURE_2D,0,Ct,X,It,ht);v(L,ae)&&w(H),et.__version=j.version,L.onUpdate&&L.onUpdate(L)}P.__version=L.version}function ut(P,L,F){if(L.image.length!==6)return;const H=nt(P,L),Q=L.source;e.bindTexture(o.TEXTURE_CUBE_MAP,P.__webglTexture,o.TEXTURE0+F);const j=n.get(Q);if(Q.version!==j.__version||H===!0){e.activeTexture(o.TEXTURE0+F);const et=ue.getPrimaries(ue.workingColorSpace),ot=L.colorSpace===Nn?null:ue.getPrimaries(L.colorSpace),vt=L.colorSpace===Nn||et===ot?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,L.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,L.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const St=L.isCompressedTexture||L.image[0].isCompressedTexture,Kt=L.image[0]&&L.image[0].isDataTexture,ht=[];for(let ct=0;ct<6;ct++)!St&&!Kt?ht[ct]=x(L.image[ct],!1,!0,s.maxCubemapSize):ht[ct]=Kt?L.image[ct].image:L.image[ct],ht[ct]=ft(L,ht[ct]);const ae=ht[0],X=g(ae)||r,It=i.convert(L.format,L.colorSpace),Ct=i.convert(L.type),yt=b(L.internalFormat,It,Ct,L.colorSpace),Gt=r&&L.isVideoTexture!==!0,ee=j.__version===void 0||H===!0;let fe=y(L,ae,X);Y(o.TEXTURE_CUBE_MAP,L,X);let Wt;if(St){Gt&&ee&&e.texStorage2D(o.TEXTURE_CUBE_MAP,fe,yt,ae.width,ae.height);for(let ct=0;ct<6;ct++){Wt=ht[ct].mipmaps;for(let N=0;N<Wt.length;N++){const dt=Wt[N];L.format!==Ae?It!==null?Gt?e.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,N,0,0,dt.width,dt.height,It,dt.data):e.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,N,yt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,N,0,0,dt.width,dt.height,It,Ct,dt.data):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,N,yt,dt.width,dt.height,0,It,Ct,dt.data)}}}else{Wt=L.mipmaps,Gt&&ee&&(Wt.length>0&&fe++,e.texStorage2D(o.TEXTURE_CUBE_MAP,fe,yt,ht[0].width,ht[0].height));for(let ct=0;ct<6;ct++)if(Kt){Gt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,ht[ct].width,ht[ct].height,It,Ct,ht[ct].data):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,yt,ht[ct].width,ht[ct].height,0,It,Ct,ht[ct].data);for(let N=0;N<Wt.length;N++){const pt=Wt[N].image[ct].image;Gt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,N+1,0,0,pt.width,pt.height,It,Ct,pt.data):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,N+1,yt,pt.width,pt.height,0,It,Ct,pt.data)}}else{Gt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,It,Ct,ht[ct]):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,yt,It,Ct,ht[ct]);for(let N=0;N<Wt.length;N++){const dt=Wt[N];Gt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,N+1,0,0,It,Ct,dt.image[ct]):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ct,N+1,yt,It,Ct,dt.image[ct])}}}v(L,X)&&w(o.TEXTURE_CUBE_MAP),j.__version=Q.version,L.onUpdate&&L.onUpdate(L)}P.__version=L.version}function xt(P,L,F,H,Q,j){const et=i.convert(F.format,F.colorSpace),ot=i.convert(F.type),vt=b(F.internalFormat,et,ot,F.colorSpace);if(!n.get(L).__hasExternalTextures){const Kt=Math.max(1,L.width>>j),ht=Math.max(1,L.height>>j);Q===o.TEXTURE_3D||Q===o.TEXTURE_2D_ARRAY?e.texImage3D(Q,j,vt,Kt,ht,L.depth,0,et,ot,null):e.texImage2D(Q,j,vt,Kt,ht,0,et,ot,null)}e.bindFramebuffer(o.FRAMEBUFFER,P),Z(L)?c.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,H,Q,n.get(F).__webglTexture,0,Dt(L)):(Q===o.TEXTURE_2D||Q>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,H,Q,n.get(F).__webglTexture,j),e.bindFramebuffer(o.FRAMEBUFFER,null)}function At(P,L,F){if(o.bindRenderbuffer(o.RENDERBUFFER,P),L.depthBuffer&&!L.stencilBuffer){let H=r===!0?o.DEPTH_COMPONENT24:o.DEPTH_COMPONENT16;if(F||Z(L)){const Q=L.depthTexture;Q&&Q.isDepthTexture&&(Q.type===Ts?H=o.DEPTH_COMPONENT32F:Q.type===As&&(H=o.DEPTH_COMPONENT24));const j=Dt(L);Z(L)?c.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,j,H,L.width,L.height):o.renderbufferStorageMultisample(o.RENDERBUFFER,j,H,L.width,L.height)}else o.renderbufferStorage(o.RENDERBUFFER,H,L.width,L.height);o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,P)}else if(L.depthBuffer&&L.stencilBuffer){const H=Dt(L);F&&Z(L)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,H,o.DEPTH24_STENCIL8,L.width,L.height):Z(L)?c.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,H,o.DEPTH24_STENCIL8,L.width,L.height):o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_STENCIL,L.width,L.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.RENDERBUFFER,P)}else{const H=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let Q=0;Q<H.length;Q++){const j=H[Q],et=i.convert(j.format,j.colorSpace),ot=i.convert(j.type),vt=b(j.internalFormat,et,ot,j.colorSpace),St=Dt(L);F&&Z(L)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,St,vt,L.width,L.height):Z(L)?c.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,St,vt,L.width,L.height):o.renderbufferStorage(o.RENDERBUFFER,vt,L.width,L.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function Rt(P,L){if(L&&L.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(o.FRAMEBUFFER,P),!(L.depthTexture&&L.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(L.depthTexture).__webglTexture||L.depthTexture.image.width!==L.width||L.depthTexture.image.height!==L.height)&&(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),I(L.depthTexture,0);const H=n.get(L.depthTexture).__webglTexture,Q=Dt(L);if(L.depthTexture.format===yi)Z(L)?c.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,H,0,Q):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,H,0);else if(L.depthTexture.format===po)Z(L)?c.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,H,0,Q):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,H,0);else throw new Error("Unknown depthTexture format")}function wt(P){const L=n.get(P),F=P.isWebGLCubeRenderTarget===!0;if(P.depthTexture&&!L.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Rt(L.__webglFramebuffer,P)}else if(F){L.__webglDepthbuffer=[];for(let H=0;H<6;H++)e.bindFramebuffer(o.FRAMEBUFFER,L.__webglFramebuffer[H]),L.__webglDepthbuffer[H]=o.createRenderbuffer(),At(L.__webglDepthbuffer[H],P,!1)}else e.bindFramebuffer(o.FRAMEBUFFER,L.__webglFramebuffer),L.__webglDepthbuffer=o.createRenderbuffer(),At(L.__webglDepthbuffer,P,!1);e.bindFramebuffer(o.FRAMEBUFFER,null)}function kt(P,L,F){const H=n.get(P);L!==void 0&&xt(H.__webglFramebuffer,P,P.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),F!==void 0&&wt(P)}function $(P){const L=P.texture,F=n.get(P),H=n.get(L);P.addEventListener("dispose",T),P.isWebGLMultipleRenderTargets!==!0&&(H.__webglTexture===void 0&&(H.__webglTexture=o.createTexture()),H.__version=L.version,a.memory.textures++);const Q=P.isWebGLCubeRenderTarget===!0,j=P.isWebGLMultipleRenderTargets===!0,et=g(P)||r;if(Q){F.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(r&&L.mipmaps&&L.mipmaps.length>0){F.__webglFramebuffer[ot]=[];for(let vt=0;vt<L.mipmaps.length;vt++)F.__webglFramebuffer[ot][vt]=o.createFramebuffer()}else F.__webglFramebuffer[ot]=o.createFramebuffer()}else{if(r&&L.mipmaps&&L.mipmaps.length>0){F.__webglFramebuffer=[];for(let ot=0;ot<L.mipmaps.length;ot++)F.__webglFramebuffer[ot]=o.createFramebuffer()}else F.__webglFramebuffer=o.createFramebuffer();if(j)if(s.drawBuffers){const ot=P.texture;for(let vt=0,St=ot.length;vt<St;vt++){const Kt=n.get(ot[vt]);Kt.__webglTexture===void 0&&(Kt.__webglTexture=o.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&P.samples>0&&Z(P)===!1){const ot=j?L:[L];F.__webglMultisampledFramebuffer=o.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(o.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let vt=0;vt<ot.length;vt++){const St=ot[vt];F.__webglColorRenderbuffer[vt]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,F.__webglColorRenderbuffer[vt]);const Kt=i.convert(St.format,St.colorSpace),ht=i.convert(St.type),ae=b(St.internalFormat,Kt,ht,St.colorSpace,P.isXRRenderTarget===!0),X=Dt(P);o.renderbufferStorageMultisample(o.RENDERBUFFER,X,ae,P.width,P.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+vt,o.RENDERBUFFER,F.__webglColorRenderbuffer[vt])}o.bindRenderbuffer(o.RENDERBUFFER,null),P.depthBuffer&&(F.__webglDepthRenderbuffer=o.createRenderbuffer(),At(F.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(o.FRAMEBUFFER,null)}}if(Q){e.bindTexture(o.TEXTURE_CUBE_MAP,H.__webglTexture),Y(o.TEXTURE_CUBE_MAP,L,et);for(let ot=0;ot<6;ot++)if(r&&L.mipmaps&&L.mipmaps.length>0)for(let vt=0;vt<L.mipmaps.length;vt++)xt(F.__webglFramebuffer[ot][vt],P,L,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,vt);else xt(F.__webglFramebuffer[ot],P,L,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);v(L,et)&&w(o.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(j){const ot=P.texture;for(let vt=0,St=ot.length;vt<St;vt++){const Kt=ot[vt],ht=n.get(Kt);e.bindTexture(o.TEXTURE_2D,ht.__webglTexture),Y(o.TEXTURE_2D,Kt,et),xt(F.__webglFramebuffer,P,Kt,o.COLOR_ATTACHMENT0+vt,o.TEXTURE_2D,0),v(Kt,et)&&w(o.TEXTURE_2D)}e.unbindTexture()}else{let ot=o.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(r?ot=P.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ot,H.__webglTexture),Y(ot,L,et),r&&L.mipmaps&&L.mipmaps.length>0)for(let vt=0;vt<L.mipmaps.length;vt++)xt(F.__webglFramebuffer[vt],P,L,o.COLOR_ATTACHMENT0,ot,vt);else xt(F.__webglFramebuffer,P,L,o.COLOR_ATTACHMENT0,ot,0);v(L,et)&&w(ot),e.unbindTexture()}P.depthBuffer&&wt(P)}function le(P){const L=g(P)||r,F=P.isWebGLMultipleRenderTargets===!0?P.texture:[P.texture];for(let H=0,Q=F.length;H<Q;H++){const j=F[H];if(v(j,L)){const et=P.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:o.TEXTURE_2D,ot=n.get(j).__webglTexture;e.bindTexture(et,ot),w(et),e.unbindTexture()}}}function Tt(P){if(r&&P.samples>0&&Z(P)===!1){const L=P.isWebGLMultipleRenderTargets?P.texture:[P.texture],F=P.width,H=P.height;let Q=o.COLOR_BUFFER_BIT;const j=[],et=P.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ot=n.get(P),vt=P.isWebGLMultipleRenderTargets===!0;if(vt)for(let St=0;St<L.length;St++)e.bindFramebuffer(o.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+St,o.RENDERBUFFER,null),e.bindFramebuffer(o.FRAMEBUFFER,ot.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+St,o.TEXTURE_2D,null,0);e.bindFramebuffer(o.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer),e.bindFramebuffer(o.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let St=0;St<L.length;St++){j.push(o.COLOR_ATTACHMENT0+St),P.depthBuffer&&j.push(et);const Kt=ot.__ignoreDepthValues!==void 0?ot.__ignoreDepthValues:!1;if(Kt===!1&&(P.depthBuffer&&(Q|=o.DEPTH_BUFFER_BIT),P.stencilBuffer&&(Q|=o.STENCIL_BUFFER_BIT)),vt&&o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,ot.__webglColorRenderbuffer[St]),Kt===!0&&(o.invalidateFramebuffer(o.READ_FRAMEBUFFER,[et]),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[et])),vt){const ht=n.get(L[St]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,ht,0)}o.blitFramebuffer(0,0,F,H,0,0,F,H,Q,o.NEAREST),l&&o.invalidateFramebuffer(o.READ_FRAMEBUFFER,j)}if(e.bindFramebuffer(o.READ_FRAMEBUFFER,null),e.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),vt)for(let St=0;St<L.length;St++){e.bindFramebuffer(o.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+St,o.RENDERBUFFER,ot.__webglColorRenderbuffer[St]);const Kt=n.get(L[St]).__webglTexture;e.bindFramebuffer(o.FRAMEBUFFER,ot.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+St,o.TEXTURE_2D,Kt,0)}e.bindFramebuffer(o.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}}function Dt(P){return Math.min(s.maxSamples,P.samples)}function Z(P){const L=n.get(P);return r&&P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&L.__useRenderToTexture!==!1}function lt(P){const L=a.render.frame;h.get(P)!==L&&(h.set(P,L),P.update())}function ft(P,L){const F=P.colorSpace,H=P.format,Q=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||P.format===cl||F!==Ds&&F!==Nn&&(ue.getTransfer(F)===me?r===!1?t.has("EXT_sRGB")===!0&&H===Ae?(P.format=cl,P.minFilter=Fe,P.generateMipmaps=!1):L=zd.sRGBToLinear(L):(H!==Ae||Q!==pe)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),L}this.allocateTextureUnit=C,this.resetTextureUnits=k,this.setTexture2D=I,this.setTexture2DArray=O,this.setTexture3D=U,this.setTextureCube=V,this.rebindTextures=kt,this.setupRenderTarget=$,this.updateRenderTargetMipmap=le,this.updateMultisampleRenderTarget=Tt,this.setupDepthRenderbuffer=wt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=Z}function Uw(o,t,e){const n=e.isWebGL2;function s(i,a=Nn){let r;const c=ue.getTransfer(a);if(i===pe)return o.UNSIGNED_BYTE;if(i===Sd)return o.UNSIGNED_SHORT_4_4_4_4;if(i===Ed)return o.UNSIGNED_SHORT_5_5_5_1;if(i===rm)return o.BYTE;if(i===cm)return o.SHORT;if(i===Dl)return o.UNSIGNED_SHORT;if(i===bd)return o.INT;if(i===As)return o.UNSIGNED_INT;if(i===Ts)return o.FLOAT;if(i===ks)return n?o.HALF_FLOAT:(r=t.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(i===lm)return o.ALPHA;if(i===Ae)return o.RGBA;if(i===hm)return o.LUMINANCE;if(i===um)return o.LUMINANCE_ALPHA;if(i===yi)return o.DEPTH_COMPONENT;if(i===po)return o.DEPTH_STENCIL;if(i===cl)return r=t.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(i===zs)return o.RED;if(i===Ad)return o.RED_INTEGER;if(i===Td)return o.RG;if(i===Cd)return o.RG_INTEGER;if(i===Rd)return o.RGBA_INTEGER;if(i===nc||i===sc||i===ic||i===oc)if(c===me)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===nc)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===sc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ic)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===oc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===nc)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===sc)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ic)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===oc)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===uh||i===fh||i===dh||i===ph)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===uh)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===fh)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===dh)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ph)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ld)return r=t.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(i===mh||i===gh)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===mh)return c===me?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===gh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===xh||i===vh||i===wh||i===yh||i===Mh||i===_h||i===bh||i===Sh||i===Eh||i===Ah||i===Th||i===Ch||i===Rh||i===Lh)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===xh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===vh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===wh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Mh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===_h)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===bh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Sh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Eh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ah)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Th)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ch)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Rh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Lh)return c===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ac||i===Ph||i===kh)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===ac)return c===me?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ph)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===kh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===fm||i===Dh||i===zh||i===Ih)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===ac)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Dh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===zh)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ih)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===wi?n?o.UNSIGNED_INT_24_8:(r=t.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):o[i]!==void 0?o[i]:null}return{convert:s}}class Nw extends Rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Te extends wn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ow={type:"move"};class Rc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Te,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Te,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Te,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,i=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const x of t.hand.values()){const g=e.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,m=.005;l.inputState.pinching&&f>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(i=e.getPose(t.gripSpace,n),i!==null&&(c.matrix.fromArray(i.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,i.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(i.linearVelocity)):c.hasLinearVelocity=!1,i.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(i.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&i!==null&&(s=i),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Ow)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=i!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Te;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Bw extends xo{constructor(t,e){super();const n=this;let s=null,i=1,a=null,r="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,m=null;const x=e.getContextAttributes();let g=null,p=null;const v=[],w=[],b=new Bt;let y=null;const S=new Rn;S.layers.enable(1),S.viewport=new Yt;const E=new Rn;E.layers.enable(2),E.viewport=new Yt;const T=[S,E],_=new Nw;_.layers.enable(1),_.layers.enable(2);let M=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let nt=v[Y];return nt===void 0&&(nt=new Rc,v[Y]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Y){let nt=v[Y];return nt===void 0&&(nt=new Rc,v[Y]=nt),nt.getGripSpace()},this.getHand=function(Y){let nt=v[Y];return nt===void 0&&(nt=new Rc,v[Y]=nt),nt.getHandSpace()};function R(Y){const nt=w.indexOf(Y.inputSource);if(nt===-1)return;const rt=v[nt];rt!==void 0&&(rt.update(Y.inputSource,Y.frame,l||a),rt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function k(){s.removeEventListener("select",R),s.removeEventListener("selectstart",R),s.removeEventListener("selectend",R),s.removeEventListener("squeeze",R),s.removeEventListener("squeezestart",R),s.removeEventListener("squeezeend",R),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",C);for(let Y=0;Y<v.length;Y++){const nt=w[Y];nt!==null&&(w[Y]=null,v[Y].disconnect(nt))}M=null,A=null,t.setRenderTarget(g),d=null,f=null,u=null,s=null,p=null,it.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){i=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(g=t.getRenderTarget(),s.addEventListener("select",R),s.addEventListener("selectstart",R),s.addEventListener("selectend",R),s.addEventListener("squeeze",R),s.addEventListener("squeezestart",R),s.addEventListener("squeezeend",R),s.addEventListener("end",k),s.addEventListener("inputsourceschange",C),x.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(b),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const nt={antialias:s.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:i};d=new XRWebGLLayer(s,e,nt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new cs(d.framebufferWidth,d.framebufferHeight,{format:Ae,type:pe,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let nt=null,rt=null,ut=null;x.depth&&(ut=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=x.stencil?po:yi,rt=x.stencil?wi:As);const xt={colorFormat:e.RGBA8,depthFormat:ut,scaleFactor:i};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(xt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),p=new cs(f.textureWidth,f.textureHeight,{format:Ae,type:pe,depthTexture:new Bl(f.textureWidth,f.textureHeight,rt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});const At=t.properties.get(p);At.__ignoreDepthValues=f.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(r),it.setContext(s),it.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function C(Y){for(let nt=0;nt<Y.removed.length;nt++){const rt=Y.removed[nt],ut=w.indexOf(rt);ut>=0&&(w[ut]=null,v[ut].disconnect(rt))}for(let nt=0;nt<Y.added.length;nt++){const rt=Y.added[nt];let ut=w.indexOf(rt);if(ut===-1){for(let At=0;At<v.length;At++)if(At>=w.length){w.push(rt),ut=At;break}else if(w[At]===null){w[At]=rt,ut=At;break}if(ut===-1)break}const xt=v[ut];xt&&xt.connect(rt)}}const z=new W,I=new W;function O(Y,nt,rt){z.setFromMatrixPosition(nt.matrixWorld),I.setFromMatrixPosition(rt.matrixWorld);const ut=z.distanceTo(I),xt=nt.projectionMatrix.elements,At=rt.projectionMatrix.elements,Rt=xt[14]/(xt[10]-1),wt=xt[14]/(xt[10]+1),kt=(xt[9]+1)/xt[5],$=(xt[9]-1)/xt[5],le=(xt[8]-1)/xt[0],Tt=(At[8]+1)/At[0],Dt=Rt*le,Z=Rt*Tt,lt=ut/(-le+Tt),ft=lt*-le;nt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ft),Y.translateZ(lt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert();const P=Rt+lt,L=wt+lt,F=Dt-ft,H=Z+(ut-ft),Q=kt*wt/L*P,j=$*wt/L*P;Y.projectionMatrix.makePerspective(F,H,Q,j,P,L),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}function U(Y,nt){nt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(nt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;_.near=E.near=S.near=Y.near,_.far=E.far=S.far=Y.far,(M!==_.near||A!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),M=_.near,A=_.far);const nt=Y.parent,rt=_.cameras;U(_,nt);for(let ut=0;ut<rt.length;ut++)U(rt[ut],nt);rt.length===2?O(_,S,E):_.projectionMatrix.copy(S.projectionMatrix),V(Y,_,nt)};function V(Y,nt,rt){rt===null?Y.matrix.copy(nt.matrixWorld):(Y.matrix.copy(rt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(nt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=na*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(Y){c=Y,f!==null&&(f.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)};let B=null;function q(Y,nt){if(h=nt.getViewerPose(l||a),m=nt,h!==null){const rt=h.views;d!==null&&(t.setRenderTargetFramebuffer(p,d.framebuffer),t.setRenderTarget(p));let ut=!1;rt.length!==_.cameras.length&&(_.cameras.length=0,ut=!0);for(let xt=0;xt<rt.length;xt++){const At=rt[xt];let Rt=null;if(d!==null)Rt=d.getViewport(At);else{const kt=u.getViewSubImage(f,At);Rt=kt.viewport,xt===0&&(t.setRenderTargetTextures(p,kt.colorTexture,f.ignoreDepthValues?void 0:kt.depthStencilTexture),t.setRenderTarget(p))}let wt=T[xt];wt===void 0&&(wt=new Rn,wt.layers.enable(xt),wt.viewport=new Yt,T[xt]=wt),wt.matrix.fromArray(At.transform.matrix),wt.matrix.decompose(wt.position,wt.quaternion,wt.scale),wt.projectionMatrix.fromArray(At.projectionMatrix),wt.projectionMatrixInverse.copy(wt.projectionMatrix).invert(),wt.viewport.set(Rt.x,Rt.y,Rt.width,Rt.height),xt===0&&(_.matrix.copy(wt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ut===!0&&_.cameras.push(wt)}}for(let rt=0;rt<v.length;rt++){const ut=w[rt],xt=v[rt];ut!==null&&xt!==void 0&&xt.update(ut,nt,l||a)}B&&B(Y,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),m=null}const it=new Vd;it.setAnimationLoop(q),this.setAnimationLoop=function(Y){B=Y},this.dispose=function(){}}}function Ww(o,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Wd(o)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,v,w,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?i(g,p):p.isMeshToonMaterial?(i(g,p),u(g,p)):p.isMeshPhongMaterial?(i(g,p),h(g,p)):p.isMeshStandardMaterial?(i(g,p),f(g,p),p.isMeshPhysicalMaterial&&d(g,p,b)):p.isMeshMatcapMaterial?(i(g,p),m(g,p)):p.isMeshDepthMaterial?i(g,p):p.isMeshDistanceMaterial?(i(g,p),x(g,p)):p.isMeshNormalMaterial?i(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?c(g,p,v,w):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function i(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===pn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===pn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const v=t.get(p).envMap;if(v&&(g.envMap.value=v,g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap){g.lightMap.value=p.lightMap;const w=o._useLegacyLights===!0?Math.PI:1;g.lightMapIntensity.value=p.lightMapIntensity*w,e(p.lightMap,g.lightMapTransform)}p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,v,w){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*v,g.scale.value=w*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),t.get(p).envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,v){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===pn&&g.clearcoatNormalScale.value.negate())),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){const v=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Hw(o,t,e,n){let s={},i={},a=[];const r=e.isWebGL2?o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,w){const b=w.program;n.uniformBlockBinding(v,b)}function l(v,w){let b=s[v.id];b===void 0&&(m(v),b=h(v),s[v.id]=b,v.addEventListener("dispose",g));const y=w.program;n.updateUBOMapping(v,y);const S=t.render.frame;i[v.id]!==S&&(f(v),i[v.id]=S)}function h(v){const w=u();v.__bindingPointIndex=w;const b=o.createBuffer(),y=v.__size,S=v.usage;return o.bindBuffer(o.UNIFORM_BUFFER,b),o.bufferData(o.UNIFORM_BUFFER,y,S),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,w,b),b}function u(){for(let v=0;v<r;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const w=s[v.id],b=v.uniforms,y=v.__cache;o.bindBuffer(o.UNIFORM_BUFFER,w);for(let S=0,E=b.length;S<E;S++){const T=Array.isArray(b[S])?b[S]:[b[S]];for(let _=0,M=T.length;_<M;_++){const A=T[_];if(d(A,S,_,y)===!0){const R=A.__offset,k=Array.isArray(A.value)?A.value:[A.value];let C=0;for(let z=0;z<k.length;z++){const I=k[z],O=x(I);typeof I=="number"||typeof I=="boolean"?(A.__data[0]=I,o.bufferSubData(o.UNIFORM_BUFFER,R+C,A.__data)):I.isMatrix3?(A.__data[0]=I.elements[0],A.__data[1]=I.elements[1],A.__data[2]=I.elements[2],A.__data[3]=0,A.__data[4]=I.elements[3],A.__data[5]=I.elements[4],A.__data[6]=I.elements[5],A.__data[7]=0,A.__data[8]=I.elements[6],A.__data[9]=I.elements[7],A.__data[10]=I.elements[8],A.__data[11]=0):(I.toArray(A.__data,C),C+=O.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,R,A.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function d(v,w,b,y){const S=v.value,E=w+"_"+b;if(y[E]===void 0)return typeof S=="number"||typeof S=="boolean"?y[E]=S:y[E]=S.clone(),!0;{const T=y[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return y[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function m(v){const w=v.uniforms;let b=0;const y=16;for(let E=0,T=w.length;E<T;E++){const _=Array.isArray(w[E])?w[E]:[w[E]];for(let M=0,A=_.length;M<A;M++){const R=_[M],k=Array.isArray(R.value)?R.value:[R.value];for(let C=0,z=k.length;C<z;C++){const I=k[C],O=x(I),U=b%y;U!==0&&y-U<O.boundary&&(b+=y-U),R.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=b,b+=O.storage}}}const S=b%y;return S>0&&(b+=y-S),v.__size=b,v.__cache={},this}function x(v){const w={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(w.boundary=4,w.storage=4):v.isVector2?(w.boundary=8,w.storage=8):v.isVector3||v.isColor?(w.boundary=16,w.storage=12):v.isVector4?(w.boundary=16,w.storage=16):v.isMatrix3?(w.boundary=48,w.storage=48):v.isMatrix4?(w.boundary=64,w.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),w}function g(v){const w=v.target;w.removeEventListener("dispose",g);const b=a.indexOf(w.__bindingPointIndex);a.splice(b,1),o.deleteBuffer(s[w.id]),delete s[w.id],delete i[w.id]}function p(){for(const v in s)o.deleteBuffer(s[v]);a=[],s={},i={}}return{bind:c,update:l,dispose:p}}class Kd{constructor(t={}){const{canvas:e=Nm(),context:n=null,depth:s=!0,stencil:i=!0,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=a;const d=new Uint32Array(4),m=new Int32Array(4);let x=null,g=null;const p=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ke,this._useLegacyLights=!1,this.toneMapping=Ys,this.toneMappingExposure=1;const w=this;let b=!1,y=0,S=0,E=null,T=-1,_=null;const M=new Yt,A=new Yt;let R=null;const k=new Ht(0);let C=0,z=e.width,I=e.height,O=1,U=null,V=null;const B=new Yt(0,0,z,I),q=new Yt(0,0,z,I);let it=!1;const Y=new Is;let nt=!1,rt=!1,ut=null;const xt=new ne,At=new Bt,Rt=new W,wt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function kt(){return E===null?O:1}let $=n;function le(D,G){for(let K=0;K<D.length;K++){const tt=D[K],J=e.getContext(tt,G);if(J!==null)return J}return null}try{const D={alpha:!0,depth:s,stencil:i,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${kl}`),e.addEventListener("webglcontextlost",ct,!1),e.addEventListener("webglcontextrestored",N,!1),e.addEventListener("webglcontextcreationerror",dt,!1),$===null){const G=["webgl2","webgl","experimental-webgl"];if(w.isWebGL1Renderer===!0&&G.shift(),$=le(G,D),$===null)throw le(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&$ instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),$.getShaderPrecisionFormat===void 0&&($.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let Tt,Dt,Z,lt,ft,P,L,F,H,Q,j,et,ot,vt,St,Kt,ht,ae,X,It,Ct,yt,Gt,ee;function fe(){Tt=new Jx($),Dt=new jx($,Tt,t),Tt.init(Dt),yt=new Uw($,Tt,Dt),Z=new Iw($,Tt,Dt),lt=new ev($),ft=new Mw,P=new Fw($,Tt,Z,ft,Dt,yt,lt),L=new Xx(w),F=new Zx(w),H=new lg($,Dt),Gt=new Vx($,Tt,H,Dt),Q=new Qx($,H,lt,Gt),j=new ov($,Q,H,lt),X=new iv($,Dt,P),Kt=new qx(ft),et=new yw(w,L,F,Tt,Dt,Gt,Kt),ot=new Ww(w,ft),vt=new bw,St=new Rw(Tt,Dt),ae=new Gx(w,L,F,Z,j,f,c),ht=new zw(w,j,Dt),ee=new Hw($,lt,Dt,Z),It=new $x($,Tt,lt,Dt),Ct=new tv($,Tt,lt,Dt),lt.programs=et.programs,w.capabilities=Dt,w.extensions=Tt,w.properties=ft,w.renderLists=vt,w.shadowMap=ht,w.state=Z,w.info=lt}fe();const Wt=new Bw(w,$);this.xr=Wt,this.getContext=function(){return $},this.getContextAttributes=function(){return $.getContextAttributes()},this.forceContextLoss=function(){const D=Tt.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=Tt.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(D){D!==void 0&&(O=D,this.setSize(z,I,!1))},this.getSize=function(D){return D.set(z,I)},this.setSize=function(D,G,K=!0){if(Wt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=D,I=G,e.width=Math.floor(D*O),e.height=Math.floor(G*O),K===!0&&(e.style.width=D+"px",e.style.height=G+"px"),this.setViewport(0,0,D,G)},this.getDrawingBufferSize=function(D){return D.set(z*O,I*O).floor()},this.setDrawingBufferSize=function(D,G,K){z=D,I=G,O=K,e.width=Math.floor(D*K),e.height=Math.floor(G*K),this.setViewport(0,0,D,G)},this.getCurrentViewport=function(D){return D.copy(M)},this.getViewport=function(D){return D.copy(B)},this.setViewport=function(D,G,K,tt){D.isVector4?B.set(D.x,D.y,D.z,D.w):B.set(D,G,K,tt),Z.viewport(M.copy(B).multiplyScalar(O).floor())},this.getScissor=function(D){return D.copy(q)},this.setScissor=function(D,G,K,tt){D.isVector4?q.set(D.x,D.y,D.z,D.w):q.set(D,G,K,tt),Z.scissor(A.copy(q).multiplyScalar(O).floor())},this.getScissorTest=function(){return it},this.setScissorTest=function(D){Z.setScissorTest(it=D)},this.setOpaqueSort=function(D){U=D},this.setTransparentSort=function(D){V=D},this.getClearColor=function(D){return D.copy(ae.getClearColor())},this.setClearColor=function(){ae.setClearColor.apply(ae,arguments)},this.getClearAlpha=function(){return ae.getClearAlpha()},this.setClearAlpha=function(){ae.setClearAlpha.apply(ae,arguments)},this.clear=function(D=!0,G=!0,K=!0){let tt=0;if(D){let J=!1;if(E!==null){const bt=E.texture.format;J=bt===Rd||bt===Cd||bt===Ad}if(J){const bt=E.texture.type,Lt=bt===pe||bt===As||bt===Dl||bt===wi||bt===Sd||bt===Ed,Pt=ae.getClearColor(),Ft=ae.getClearAlpha(),qt=Pt.r,$t=Pt.g,Xt=Pt.b;Lt?(d[0]=qt,d[1]=$t,d[2]=Xt,d[3]=Ft,$.clearBufferuiv($.COLOR,0,d)):(m[0]=qt,m[1]=$t,m[2]=Xt,m[3]=Ft,$.clearBufferiv($.COLOR,0,m))}else tt|=$.COLOR_BUFFER_BIT}G&&(tt|=$.DEPTH_BUFFER_BIT),K&&(tt|=$.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$.clear(tt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ct,!1),e.removeEventListener("webglcontextrestored",N,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),vt.dispose(),St.dispose(),ft.dispose(),L.dispose(),F.dispose(),j.dispose(),Gt.dispose(),ee.dispose(),et.dispose(),Wt.dispose(),Wt.removeEventListener("sessionstart",Le),Wt.removeEventListener("sessionend",ce),ut&&(ut.dispose(),ut=null),Ve.stop()};function ct(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function N(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const D=lt.autoReset,G=ht.enabled,K=ht.autoUpdate,tt=ht.needsUpdate,J=ht.type;fe(),lt.autoReset=D,ht.enabled=G,ht.autoUpdate=K,ht.needsUpdate=tt,ht.type=J}function dt(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function pt(D){const G=D.target;G.removeEventListener("dispose",pt),Ut(G)}function Ut(D){Nt(D),ft.remove(D)}function Nt(D){const G=ft.get(D).programs;G!==void 0&&(G.forEach(function(K){et.releaseProgram(K)}),D.isShaderMaterial&&et.releaseShaderCache(D))}this.renderBufferDirect=function(D,G,K,tt,J,bt){G===null&&(G=wt);const Lt=J.isMesh&&J.matrixWorld.determinant()<0,Pt=Et(D,G,K,tt,J);Z.setMaterial(tt,Lt);let Ft=K.index,qt=1;if(tt.wireframe===!0){if(Ft=Q.getWireframeAttribute(K),Ft===void 0)return;qt=2}const $t=K.drawRange,Xt=K.attributes.position;let Ce=$t.start*qt,Mn=($t.start+$t.count)*qt;bt!==null&&(Ce=Math.max(Ce,bt.start*qt),Mn=Math.min(Mn,(bt.start+bt.count)*qt)),Ft!==null?(Ce=Math.max(Ce,0),Mn=Math.min(Mn,Ft.count)):Xt!=null&&(Ce=Math.max(Ce,0),Mn=Math.min(Mn,Xt.count));const $e=Mn-Ce;if($e<0||$e===1/0)return;Gt.setup(J,tt,Pt,K,Ft);let ds,ve=It;if(Ft!==null&&(ds=H.get(Ft),ve=Ct,ve.setIndex(ds)),J.isMesh)tt.wireframe===!0?(Z.setLineWidth(tt.wireframeLinewidth*kt()),ve.setMode($.LINES)):ve.setMode($.TRIANGLES);else if(J.isLine){let Qt=tt.linewidth;Qt===void 0&&(Qt=1),Z.setLineWidth(Qt*kt()),J.isLineSegments?ve.setMode($.LINES):J.isLineLoop?ve.setMode($.LINE_LOOP):ve.setMode($.LINE_STRIP)}else J.isPoints?ve.setMode($.POINTS):J.isSprite&&ve.setMode($.TRIANGLES);if(J.isBatchedMesh)ve.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else if(J.isInstancedMesh)ve.renderInstances(Ce,$e,J.count);else if(K.isInstancedBufferGeometry){const Qt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Zr=Math.min(K.instanceCount,Qt);ve.renderInstances(Ce,$e,Zr)}else ve.render(Ce,$e)};function se(D,G,K){D.transparent===!0&&D.side===Un&&D.forceSinglePass===!1?(D.side=pn,D.needsUpdate=!0,fs(D,G,K),D.side=Ps,D.needsUpdate=!0,fs(D,G,K),D.side=Un):fs(D,G,K)}this.compile=function(D,G,K=null){K===null&&(K=D),g=St.get(K),g.init(),v.push(g),K.traverseVisible(function(J){J.isLight&&J.layers.test(G.layers)&&(g.pushLight(J),J.castShadow&&g.pushShadow(J))}),D!==K&&D.traverseVisible(function(J){J.isLight&&J.layers.test(G.layers)&&(g.pushLight(J),J.castShadow&&g.pushShadow(J))}),g.setupLights(w._useLegacyLights);const tt=new Set;return D.traverse(function(J){const bt=J.material;if(bt)if(Array.isArray(bt))for(let Lt=0;Lt<bt.length;Lt++){const Pt=bt[Lt];se(Pt,K,J),tt.add(Pt)}else se(bt,K,J),tt.add(bt)}),v.pop(),g=null,tt},this.compileAsync=function(D,G,K=null){const tt=this.compile(D,G,K);return new Promise(J=>{function bt(){if(tt.forEach(function(Lt){ft.get(Lt).currentProgram.isReady()&&tt.delete(Lt)}),tt.size===0){J(D);return}setTimeout(bt,10)}Tt.get("KHR_parallel_shader_compile")!==null?bt():setTimeout(bt,10)})};let re=null;function xe(D){re&&re(D)}function Le(){Ve.stop()}function ce(){Ve.start()}const Ve=new Vd;Ve.setAnimationLoop(xe),typeof self<"u"&&Ve.setContext(self),this.setAnimationLoop=function(D){re=D,Wt.setAnimationLoop(D),D===null?Ve.stop():Ve.start()},Wt.addEventListener("sessionstart",Le),Wt.addEventListener("sessionend",ce),this.render=function(D,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),Wt.enabled===!0&&Wt.isPresenting===!0&&(Wt.cameraAutoUpdate===!0&&Wt.updateCamera(G),G=Wt.getCamera()),D.isScene===!0&&D.onBeforeRender(w,D,G,E),g=St.get(D,v.length),g.init(),v.push(g),xt.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Y.setFromProjectionMatrix(xt),rt=this.localClippingEnabled,nt=Kt.init(this.clippingPlanes,rt),x=vt.get(D,p.length),x.init(),p.push(x),Ln(D,G,0,w.sortObjects),x.finish(),w.sortObjects===!0&&x.sort(U,V),this.info.render.frame++,nt===!0&&Kt.beginShadows();const K=g.state.shadowsArray;if(ht.render(K,D,G),nt===!0&&Kt.endShadows(),this.info.autoReset===!0&&this.info.reset(),ae.render(x,D),g.setupLights(w._useLegacyLights),G.isArrayCamera){const tt=G.cameras;for(let J=0,bt=tt.length;J<bt;J++){const Lt=tt[J];_o(x,D,Lt,Lt.viewport)}}else _o(x,D,G);E!==null&&(P.updateMultisampleRenderTarget(E),P.updateRenderTargetMipmap(E)),D.isScene===!0&&D.onAfterRender(w,D,G),Gt.resetDefaultState(),T=-1,_=null,v.pop(),v.length>0?g=v[v.length-1]:g=null,p.pop(),p.length>0?x=p[p.length-1]:x=null};function Ln(D,G,K,tt){if(D.visible===!1)return;if(D.layers.test(G.layers)){if(D.isGroup)K=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(G);else if(D.isLight)g.pushLight(D),D.castShadow&&g.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||Y.intersectsSprite(D)){tt&&Rt.setFromMatrixPosition(D.matrixWorld).applyMatrix4(xt);const Lt=j.update(D),Pt=D.material;Pt.visible&&x.push(D,Lt,Pt,K,Rt.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||Y.intersectsObject(D))){const Lt=j.update(D),Pt=D.material;if(tt&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),Rt.copy(D.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),Rt.copy(Lt.boundingSphere.center)),Rt.applyMatrix4(D.matrixWorld).applyMatrix4(xt)),Array.isArray(Pt)){const Ft=Lt.groups;for(let qt=0,$t=Ft.length;qt<$t;qt++){const Xt=Ft[qt],Ce=Pt[Xt.materialIndex];Ce&&Ce.visible&&x.push(D,Lt,Ce,K,Rt.z,Xt)}}else Pt.visible&&x.push(D,Lt,Pt,K,Rt.z,null)}}const bt=D.children;for(let Lt=0,Pt=bt.length;Lt<Pt;Lt++)Ln(bt[Lt],G,K,tt)}function _o(D,G,K,tt){const J=D.opaque,bt=D.transmissive,Lt=D.transparent;g.setupLightsView(K),nt===!0&&Kt.setGlobalState(w.clippingPlanes,K),bt.length>0&&Bn(J,bt,G,K),tt&&Z.viewport(M.copy(tt)),J.length>0&&Ti(J,G,K),bt.length>0&&Ti(bt,G,K),Lt.length>0&&Ti(Lt,G,K),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function Bn(D,G,K,tt){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;const bt=Dt.isWebGL2;ut===null&&(ut=new cs(1,1,{generateMipmaps:!0,type:Tt.has("EXT_color_buffer_half_float")?ks:pe,minFilter:bi,samples:bt?4:0})),w.getDrawingBufferSize(At),bt?ut.setSize(At.x,At.y):ut.setSize(Ar(At.x),Ar(At.y));const Lt=w.getRenderTarget();w.setRenderTarget(ut),w.getClearColor(k),C=w.getClearAlpha(),C<1&&w.setClearColor(16777215,.5),w.clear();const Pt=w.toneMapping;w.toneMapping=Ys,Ti(D,K,tt),P.updateMultisampleRenderTarget(ut),P.updateRenderTargetMipmap(ut);let Ft=!1;for(let qt=0,$t=G.length;qt<$t;qt++){const Xt=G[qt],Ce=Xt.object,Mn=Xt.geometry,$e=Xt.material,ds=Xt.group;if($e.side===Un&&Ce.layers.test(tt.layers)){const ve=$e.side;$e.side=pn,$e.needsUpdate=!0,ti(Ce,K,tt,Mn,$e,ds),$e.side=ve,$e.needsUpdate=!0,Ft=!0}}Ft===!0&&(P.updateMultisampleRenderTarget(ut),P.updateRenderTargetMipmap(ut)),w.setRenderTarget(Lt),w.setClearColor(k,C),w.toneMapping=Pt}function Ti(D,G,K){const tt=G.isScene===!0?G.overrideMaterial:null;for(let J=0,bt=D.length;J<bt;J++){const Lt=D[J],Pt=Lt.object,Ft=Lt.geometry,qt=tt===null?Lt.material:tt,$t=Lt.group;Pt.layers.test(K.layers)&&ti(Pt,G,K,Ft,qt,$t)}}function ti(D,G,K,tt,J,bt){D.onBeforeRender(w,G,K,tt,J,bt),D.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),J.onBeforeRender(w,G,K,tt,D,bt),J.transparent===!0&&J.side===Un&&J.forceSinglePass===!1?(J.side=pn,J.needsUpdate=!0,w.renderBufferDirect(K,G,tt,J,D,bt),J.side=Ps,J.needsUpdate=!0,w.renderBufferDirect(K,G,tt,J,D,bt),J.side=Un):w.renderBufferDirect(K,G,tt,J,D,bt),D.onAfterRender(w,G,K,tt,J,bt)}function fs(D,G,K){G.isScene!==!0&&(G=wt);const tt=ft.get(D),J=g.state.lights,bt=g.state.shadowsArray,Lt=J.state.version,Pt=et.getParameters(D,J.state,bt,G,K),Ft=et.getProgramCacheKey(Pt);let qt=tt.programs;tt.environment=D.isMeshStandardMaterial?G.environment:null,tt.fog=G.fog,tt.envMap=(D.isMeshStandardMaterial?F:L).get(D.envMap||tt.environment),qt===void 0&&(D.addEventListener("dispose",pt),qt=new Map,tt.programs=qt);let $t=qt.get(Ft);if($t!==void 0){if(tt.currentProgram===$t&&tt.lightsStateVersion===Lt)return da(D,Pt),$t}else Pt.uniforms=et.getUniforms(D),D.onBuild(K,Pt,w),D.onBeforeCompile(Pt,w),$t=et.acquireProgram(Pt,Ft),qt.set(Ft,$t),tt.uniforms=Pt.uniforms;const Xt=tt.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(Xt.clippingPlanes=Kt.uniform),da(D,Pt),tt.needsLights=jt(D),tt.lightsStateVersion=Lt,tt.needsLights&&(Xt.ambientLightColor.value=J.state.ambient,Xt.lightProbe.value=J.state.probe,Xt.directionalLights.value=J.state.directional,Xt.directionalLightShadows.value=J.state.directionalShadow,Xt.spotLights.value=J.state.spot,Xt.spotLightShadows.value=J.state.spotShadow,Xt.rectAreaLights.value=J.state.rectArea,Xt.ltc_1.value=J.state.rectAreaLTC1,Xt.ltc_2.value=J.state.rectAreaLTC2,Xt.pointLights.value=J.state.point,Xt.pointLightShadows.value=J.state.pointShadow,Xt.hemisphereLights.value=J.state.hemi,Xt.directionalShadowMap.value=J.state.directionalShadowMap,Xt.directionalShadowMatrix.value=J.state.directionalShadowMatrix,Xt.spotShadowMap.value=J.state.spotShadowMap,Xt.spotLightMatrix.value=J.state.spotLightMatrix,Xt.spotLightMap.value=J.state.spotLightMap,Xt.pointShadowMap.value=J.state.pointShadowMap,Xt.pointShadowMatrix.value=J.state.pointShadowMatrix),tt.currentProgram=$t,tt.uniformsList=null,$t}function fa(D){if(D.uniformsList===null){const G=D.currentProgram.getUniforms();D.uniformsList=hr.seqWithValue(G.seq,D.uniforms)}return D.uniformsList}function da(D,G){const K=ft.get(D);K.outputColorSpace=G.outputColorSpace,K.batching=G.batching,K.instancing=G.instancing,K.instancingColor=G.instancingColor,K.skinning=G.skinning,K.morphTargets=G.morphTargets,K.morphNormals=G.morphNormals,K.morphColors=G.morphColors,K.morphTargetsCount=G.morphTargetsCount,K.numClippingPlanes=G.numClippingPlanes,K.numIntersection=G.numClipIntersection,K.vertexAlphas=G.vertexAlphas,K.vertexTangents=G.vertexTangents,K.toneMapping=G.toneMapping}function Et(D,G,K,tt,J){G.isScene!==!0&&(G=wt),P.resetTextureUnits();const bt=G.fog,Lt=tt.isMeshStandardMaterial?G.environment:null,Pt=E===null?w.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Ds,Ft=(tt.isMeshStandardMaterial?F:L).get(tt.envMap||Lt),qt=tt.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,$t=!!K.attributes.tangent&&(!!tt.normalMap||tt.anisotropy>0),Xt=!!K.morphAttributes.position,Ce=!!K.morphAttributes.normal,Mn=!!K.morphAttributes.color;let $e=Ys;tt.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&($e=w.toneMapping);const ds=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,ve=ds!==void 0?ds.length:0,Qt=ft.get(tt),Zr=g.state.lights;if(nt===!0&&(rt===!0||D!==_)){const Pn=D===_&&tt.id===T;Kt.setState(tt,D,Pn)}let Se=!1;tt.version===Qt.__version?(Qt.needsLights&&Qt.lightsStateVersion!==Zr.state.version||Qt.outputColorSpace!==Pt||J.isBatchedMesh&&Qt.batching===!1||!J.isBatchedMesh&&Qt.batching===!0||J.isInstancedMesh&&Qt.instancing===!1||!J.isInstancedMesh&&Qt.instancing===!0||J.isSkinnedMesh&&Qt.skinning===!1||!J.isSkinnedMesh&&Qt.skinning===!0||J.isInstancedMesh&&Qt.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&Qt.instancingColor===!1&&J.instanceColor!==null||Qt.envMap!==Ft||tt.fog===!0&&Qt.fog!==bt||Qt.numClippingPlanes!==void 0&&(Qt.numClippingPlanes!==Kt.numPlanes||Qt.numIntersection!==Kt.numIntersection)||Qt.vertexAlphas!==qt||Qt.vertexTangents!==$t||Qt.morphTargets!==Xt||Qt.morphNormals!==Ce||Qt.morphColors!==Mn||Qt.toneMapping!==$e||Dt.isWebGL2===!0&&Qt.morphTargetsCount!==ve)&&(Se=!0):(Se=!0,Qt.__version=tt.version);let ei=Qt.currentProgram;Se===!0&&(ei=fs(tt,G,J));let th=!1,bo=!1,Jr=!1;const Qe=ei.getUniforms(),ni=Qt.uniforms;if(Z.useProgram(ei.program)&&(th=!0,bo=!0,Jr=!0),tt.id!==T&&(T=tt.id,bo=!0),th||_!==D){Qe.setValue($,"projectionMatrix",D.projectionMatrix),Qe.setValue($,"viewMatrix",D.matrixWorldInverse);const Pn=Qe.map.cameraPosition;Pn!==void 0&&Pn.setValue($,Rt.setFromMatrixPosition(D.matrixWorld)),Dt.logarithmicDepthBuffer&&Qe.setValue($,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(tt.isMeshPhongMaterial||tt.isMeshToonMaterial||tt.isMeshLambertMaterial||tt.isMeshBasicMaterial||tt.isMeshStandardMaterial||tt.isShaderMaterial)&&Qe.setValue($,"isOrthographic",D.isOrthographicCamera===!0),_!==D&&(_=D,bo=!0,Jr=!0)}if(J.isSkinnedMesh){Qe.setOptional($,J,"bindMatrix"),Qe.setOptional($,J,"bindMatrixInverse");const Pn=J.skeleton;Pn&&(Dt.floatVertexTextures?(Pn.boneTexture===null&&Pn.computeBoneTexture(),Qe.setValue($,"boneTexture",Pn.boneTexture,P)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}J.isBatchedMesh&&(Qe.setOptional($,J,"batchingTexture"),Qe.setValue($,"batchingTexture",J._matricesTexture,P));const Qr=K.morphAttributes;if((Qr.position!==void 0||Qr.normal!==void 0||Qr.color!==void 0&&Dt.isWebGL2===!0)&&X.update(J,K,ei),(bo||Qt.receiveShadow!==J.receiveShadow)&&(Qt.receiveShadow=J.receiveShadow,Qe.setValue($,"receiveShadow",J.receiveShadow)),tt.isMeshGouraudMaterial&&tt.envMap!==null&&(ni.envMap.value=Ft,ni.flipEnvMap.value=Ft.isCubeTexture&&Ft.isRenderTargetTexture===!1?-1:1),bo&&(Qe.setValue($,"toneMappingExposure",w.toneMappingExposure),Qt.needsLights&&Mt(ni,Jr),bt&&tt.fog===!0&&ot.refreshFogUniforms(ni,bt),ot.refreshMaterialUniforms(ni,tt,O,I,ut),hr.upload($,fa(Qt),ni,P)),tt.isShaderMaterial&&tt.uniformsNeedUpdate===!0&&(hr.upload($,fa(Qt),ni,P),tt.uniformsNeedUpdate=!1),tt.isSpriteMaterial&&Qe.setValue($,"center",J.center),Qe.setValue($,"modelViewMatrix",J.modelViewMatrix),Qe.setValue($,"normalMatrix",J.normalMatrix),Qe.setValue($,"modelMatrix",J.matrixWorld),tt.isShaderMaterial||tt.isRawShaderMaterial){const Pn=tt.uniformsGroups;for(let tc=0,r0=Pn.length;tc<r0;tc++)if(Dt.isWebGL2){const eh=Pn[tc];ee.update(eh,ei),ee.bind(eh,ei)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ei}function Mt(D,G){D.ambientLightColor.needsUpdate=G,D.lightProbe.needsUpdate=G,D.directionalLights.needsUpdate=G,D.directionalLightShadows.needsUpdate=G,D.pointLights.needsUpdate=G,D.pointLightShadows.needsUpdate=G,D.spotLights.needsUpdate=G,D.spotLightShadows.needsUpdate=G,D.rectAreaLights.needsUpdate=G,D.hemisphereLights.needsUpdate=G}function jt(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(D,G,K){ft.get(D.texture).__webglTexture=G,ft.get(D.depthTexture).__webglTexture=K;const tt=ft.get(D);tt.__hasExternalTextures=!0,tt.__hasExternalTextures&&(tt.__autoAllocateDepthBuffer=K===void 0,tt.__autoAllocateDepthBuffer||Tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),tt.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(D,G){const K=ft.get(D);K.__webglFramebuffer=G,K.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(D,G=0,K=0){E=D,y=G,S=K;let tt=!0,J=null,bt=!1,Lt=!1;if(D){const Ft=ft.get(D);Ft.__useDefaultFramebuffer!==void 0?(Z.bindFramebuffer($.FRAMEBUFFER,null),tt=!1):Ft.__webglFramebuffer===void 0?P.setupRenderTarget(D):Ft.__hasExternalTextures&&P.rebindTextures(D,ft.get(D.texture).__webglTexture,ft.get(D.depthTexture).__webglTexture);const qt=D.texture;(qt.isData3DTexture||qt.isDataArrayTexture||qt.isCompressedArrayTexture)&&(Lt=!0);const $t=ft.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray($t[G])?J=$t[G][K]:J=$t[G],bt=!0):Dt.isWebGL2&&D.samples>0&&P.useMultisampledRTT(D)===!1?J=ft.get(D).__webglMultisampledFramebuffer:Array.isArray($t)?J=$t[K]:J=$t,M.copy(D.viewport),A.copy(D.scissor),R=D.scissorTest}else M.copy(B).multiplyScalar(O).floor(),A.copy(q).multiplyScalar(O).floor(),R=it;if(Z.bindFramebuffer($.FRAMEBUFFER,J)&&Dt.drawBuffers&&tt&&Z.drawBuffers(D,J),Z.viewport(M),Z.scissor(A),Z.setScissorTest(R),bt){const Ft=ft.get(D.texture);$.framebufferTexture2D($.FRAMEBUFFER,$.COLOR_ATTACHMENT0,$.TEXTURE_CUBE_MAP_POSITIVE_X+G,Ft.__webglTexture,K)}else if(Lt){const Ft=ft.get(D.texture),qt=G||0;$.framebufferTextureLayer($.FRAMEBUFFER,$.COLOR_ATTACHMENT0,Ft.__webglTexture,K||0,qt)}T=-1},this.readRenderTargetPixels=function(D,G,K,tt,J,bt,Lt){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=ft.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Lt!==void 0&&(Pt=Pt[Lt]),Pt){Z.bindFramebuffer($.FRAMEBUFFER,Pt);try{const Ft=D.texture,qt=Ft.format,$t=Ft.type;if(qt!==Ae&&yt.convert(qt)!==$.getParameter($.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Xt=$t===ks&&(Tt.has("EXT_color_buffer_half_float")||Dt.isWebGL2&&Tt.has("EXT_color_buffer_float"));if($t!==pe&&yt.convert($t)!==$.getParameter($.IMPLEMENTATION_COLOR_READ_TYPE)&&!($t===Ts&&(Dt.isWebGL2||Tt.has("OES_texture_float")||Tt.has("WEBGL_color_buffer_float")))&&!Xt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=D.width-tt&&K>=0&&K<=D.height-J&&$.readPixels(G,K,tt,J,yt.convert(qt),yt.convert($t),bt)}finally{const Ft=E!==null?ft.get(E).__webglFramebuffer:null;Z.bindFramebuffer($.FRAMEBUFFER,Ft)}}},this.copyFramebufferToTexture=function(D,G,K=0){const tt=Math.pow(2,-K),J=Math.floor(G.image.width*tt),bt=Math.floor(G.image.height*tt);P.setTexture2D(G,0),$.copyTexSubImage2D($.TEXTURE_2D,K,0,0,D.x,D.y,J,bt),Z.unbindTexture()},this.copyTextureToTexture=function(D,G,K,tt=0){const J=G.image.width,bt=G.image.height,Lt=yt.convert(K.format),Pt=yt.convert(K.type);P.setTexture2D(K,0),$.pixelStorei($.UNPACK_FLIP_Y_WEBGL,K.flipY),$.pixelStorei($.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),$.pixelStorei($.UNPACK_ALIGNMENT,K.unpackAlignment),G.isDataTexture?$.texSubImage2D($.TEXTURE_2D,tt,D.x,D.y,J,bt,Lt,Pt,G.image.data):G.isCompressedTexture?$.compressedTexSubImage2D($.TEXTURE_2D,tt,D.x,D.y,G.mipmaps[0].width,G.mipmaps[0].height,Lt,G.mipmaps[0].data):$.texSubImage2D($.TEXTURE_2D,tt,D.x,D.y,Lt,Pt,G.image),tt===0&&K.generateMipmaps&&$.generateMipmap($.TEXTURE_2D),Z.unbindTexture()},this.copyTextureToTexture3D=function(D,G,K,tt,J=0){if(w.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const bt=D.max.x-D.min.x+1,Lt=D.max.y-D.min.y+1,Pt=D.max.z-D.min.z+1,Ft=yt.convert(tt.format),qt=yt.convert(tt.type);let $t;if(tt.isData3DTexture)P.setTexture3D(tt,0),$t=$.TEXTURE_3D;else if(tt.isDataArrayTexture||tt.isCompressedArrayTexture)P.setTexture2DArray(tt,0),$t=$.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}$.pixelStorei($.UNPACK_FLIP_Y_WEBGL,tt.flipY),$.pixelStorei($.UNPACK_PREMULTIPLY_ALPHA_WEBGL,tt.premultiplyAlpha),$.pixelStorei($.UNPACK_ALIGNMENT,tt.unpackAlignment);const Xt=$.getParameter($.UNPACK_ROW_LENGTH),Ce=$.getParameter($.UNPACK_IMAGE_HEIGHT),Mn=$.getParameter($.UNPACK_SKIP_PIXELS),$e=$.getParameter($.UNPACK_SKIP_ROWS),ds=$.getParameter($.UNPACK_SKIP_IMAGES),ve=K.isCompressedTexture?K.mipmaps[J]:K.image;$.pixelStorei($.UNPACK_ROW_LENGTH,ve.width),$.pixelStorei($.UNPACK_IMAGE_HEIGHT,ve.height),$.pixelStorei($.UNPACK_SKIP_PIXELS,D.min.x),$.pixelStorei($.UNPACK_SKIP_ROWS,D.min.y),$.pixelStorei($.UNPACK_SKIP_IMAGES,D.min.z),K.isDataTexture||K.isData3DTexture?$.texSubImage3D($t,J,G.x,G.y,G.z,bt,Lt,Pt,Ft,qt,ve.data):K.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),$.compressedTexSubImage3D($t,J,G.x,G.y,G.z,bt,Lt,Pt,Ft,ve.data)):$.texSubImage3D($t,J,G.x,G.y,G.z,bt,Lt,Pt,Ft,qt,ve),$.pixelStorei($.UNPACK_ROW_LENGTH,Xt),$.pixelStorei($.UNPACK_IMAGE_HEIGHT,Ce),$.pixelStorei($.UNPACK_SKIP_PIXELS,Mn),$.pixelStorei($.UNPACK_SKIP_ROWS,$e),$.pixelStorei($.UNPACK_SKIP_IMAGES,ds),J===0&&tt.generateMipmaps&&$.generateMipmap($t),Z.unbindTexture()},this.initTexture=function(D){D.isCubeTexture?P.setTextureCube(D,0):D.isData3DTexture?P.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?P.setTexture2DArray(D,0):P.setTexture2D(D,0),Z.unbindTexture()},this.resetState=function(){y=0,S=0,E=null,Z.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cs}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===zl?"display-p3":"srgb",e.unpackColorSpace=ue.workingColorSpace===Gr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ke?Mi:Pd}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Mi?Ke:Ds}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Gw extends Kd{}Gw.prototype.isWebGL1Renderer=!0;class qr extends wn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class We extends mn{constructor(t=null,e=1,n=1,s,i,a,r,c,l=ie,h=ie,u,f){super(null,a,r,c,l,h,s,i,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class he extends de{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const $i=new ne,Su=new ne,Na=[],Eu=new yn,Vw=new ne,Ro=new ge,Lo=new Js;class ha extends ge{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new he(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Vw)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new yn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$i),Eu.copy(t.boundingBox).applyMatrix4($i),this.boundingBox.union(Eu)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Js),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$i),Lo.copy(t.boundingSphere).applyMatrix4($i),this.boundingSphere.union(Lo)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Ro.geometry=this.geometry,Ro.material=this.material,Ro.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Lo.copy(this.boundingSphere),Lo.applyMatrix4(n),t.ray.intersectsSphere(Lo)!==!1))for(let i=0;i<s;i++){this.getMatrixAt(i,$i),Su.multiplyMatrices(n,$i),Ro.matrixWorld=Su,Ro.raycast(t,Na);for(let a=0,r=Na.length;a<r;a++){const c=Na[a];c.instanceId=i,c.object=this,e.push(c)}Na.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new he(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class $w extends ca{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Au=new ne,ul=new Fl,Oa=new Js,Ba=new W;class jw extends wn{constructor(t=new Je,e=new $w){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,i=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Oa.copy(n.boundingSphere),Oa.applyMatrix4(s),Oa.radius+=i,t.ray.intersectsSphere(Oa)===!1)return;Au.copy(s).invert(),ul.copy(t.ray).applyMatrix4(Au);const r=i/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,a.start),d=Math.min(l.count,a.start+a.count);for(let m=f,x=d;m<x;m++){const g=l.getX(m);Ba.fromBufferAttribute(u,g),Tu(Ba,g,c,s,t,e,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let m=f,x=d;m<x;m++)Ba.fromBufferAttribute(u,m),Tu(Ba,m,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,a=s.length;i<a;i++){const r=s[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=i}}}}}function Tu(o,t,e,n,s,i,a){const r=ul.distanceSqToPoint(o);if(r<e){const c=new W;ul.closestPointToPoint(o,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;i.push({distance:l,distanceToRay:Math.sqrt(r),point:c,index:t,face:null,object:a})}}class qw extends mn{constructor(t,e,n,s,i,a,r,c,l){super(t,e,n,s,i,a,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Wl extends Je{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const i=[],a=[];r(s),l(n),h(),this.setAttribute("position",new Ue(i,3)),this.setAttribute("normal",new Ue(i.slice(),3)),this.setAttribute("uv",new Ue(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(v){const w=new W,b=new W,y=new W;for(let S=0;S<e.length;S+=3)d(e[S+0],w),d(e[S+1],b),d(e[S+2],y),c(w,b,y,v)}function c(v,w,b,y){const S=y+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const _=v.clone().lerp(b,T/S),M=w.clone().lerp(b,T/S),A=S-T;for(let R=0;R<=A;R++)R===0&&T===S?E[T][R]=_:E[T][R]=_.clone().lerp(M,R/A)}for(let T=0;T<S;T++)for(let _=0;_<2*(S-T)-1;_++){const M=Math.floor(_/2);_%2===0?(f(E[T][M+1]),f(E[T+1][M]),f(E[T][M])):(f(E[T][M+1]),f(E[T+1][M+1]),f(E[T+1][M]))}}function l(v){const w=new W;for(let b=0;b<i.length;b+=3)w.x=i[b+0],w.y=i[b+1],w.z=i[b+2],w.normalize().multiplyScalar(v),i[b+0]=w.x,i[b+1]=w.y,i[b+2]=w.z}function h(){const v=new W;for(let w=0;w<i.length;w+=3){v.x=i[w+0],v.y=i[w+1],v.z=i[w+2];const b=g(v)/2/Math.PI+.5,y=p(v)/Math.PI+.5;a.push(b,1-y)}m(),u()}function u(){for(let v=0;v<a.length;v+=6){const w=a[v+0],b=a[v+2],y=a[v+4],S=Math.max(w,b,y),E=Math.min(w,b,y);S>.9&&E<.1&&(w<.2&&(a[v+0]+=1),b<.2&&(a[v+2]+=1),y<.2&&(a[v+4]+=1))}}function f(v){i.push(v.x,v.y,v.z)}function d(v,w){const b=v*3;w.x=t[b+0],w.y=t[b+1],w.z=t[b+2]}function m(){const v=new W,w=new W,b=new W,y=new W,S=new Bt,E=new Bt,T=new Bt;for(let _=0,M=0;_<i.length;_+=9,M+=6){v.set(i[_+0],i[_+1],i[_+2]),w.set(i[_+3],i[_+4],i[_+5]),b.set(i[_+6],i[_+7],i[_+8]),S.set(a[M+0],a[M+1]),E.set(a[M+2],a[M+3]),T.set(a[M+4],a[M+5]),y.copy(v).add(w).add(b).divideScalar(3);const A=g(y);x(S,M+0,v,A),x(E,M+2,w,A),x(T,M+4,b,A)}}function x(v,w,b,y){y<0&&v.x===1&&(a[w]=v.x-1),b.x===0&&b.z===0&&(a[w]=y/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wl(t.vertices,t.indices,t.radius,t.details)}}class Hl extends Wl{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],i=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,i,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Hl(t.radius,t.detail)}}class yo extends Je{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Xw{constructor(t,e,n=0,s=1/0){this.ray=new Fl(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Ul,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return fl(t,this,n,e),n.sort(Cu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,i=t.length;s<i;s++)fl(t[s],this,n,e);return n.sort(Cu),n}}function Cu(o,t){return o.distance-t.distance}function fl(o,t,e,n){if(o.layers.test(t.layers)&&o.raycast(t,e),n===!0){const s=o.children;for(let i=0,a=s.length;i<a;i++)fl(s[i],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:kl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=kl);const Po=o=>Number.isInteger(o)?o.toFixed(1):String(o),qn={loi:1,pond:24,other:48,max:63},Yw=.5,Zd=-.6,Kw=.5625,Ne=`
#define PI 3.14159265
#define NEAR_E ${Po(ea)}
#define NORMAL_E ${Po(fd)}
#define SLOTS ${ts}
#define PATCHES ${ro}
#define DIST_PATCHES ${rs}
#define DIST_POND ${qn.pond}
#define DIST_OTHER ${qn.other}
#define DIST_FILL ${Po(Yw)}
#define DIST_POND_LEVEL ${Po(Zd)}
#define DIST_BASE ${Po(Kw)}
`,Mo=`
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), u.x), u.y);
}
// value noise faded to its mean once a cell is smaller than a couple of
// pixels (q: cells per pixel), where it would only sparkle; a camera that
// spans 600 km and 1 km needs this everywhere
float vnoiseF(vec2 p, float q) {
  float k = smoothstep(0.25, 0.6, q);
  return k >= 1.0 ? 0.5 : mix(vnoise(p), 0.5, k);
}
float fbm2(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s;
}
// fbm2 with each octave faded as vnoiseF (q: first-octave cells per pixel)
float fbm2F(vec2 p, float q) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoiseF(p, q); p = p * 2.03 + 17.1; a *= 0.5; q *= 2.03; }
  return s;
}
vec3 voronoi(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  float id = 0.0;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = hash22(n + g);
    vec2 r = g + o - f;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = hash12(n + g + 3.7); }
    else if (d < d2) { d2 = d; }
  }
  return vec3(sqrt(d1), id, sqrt(d2) - sqrt(d1));
}
`,Ye=`
uniform float uVert;           // world Y per metre: the exaggeration of the moment / 100
uniform float uExag;           // the exaggeration itself
uniform sampler2D uArchH;      // archipelago heights, metres (R32F, nearest)
uniform vec4 uArchRect;        // its world rect: x0, z0, x1, z1
uniform vec4 uSlotRect[SLOTS];
uniform vec4 uSlotInfo[SLOTS]; // x detail weight k, y on (0/1), z edge margin (world units)

vec2 rectUv(vec4 r, vec2 xz) { return (xz - r.xy) / (r.zw - r.xy); }
float edgeDist(vec4 r, vec2 xz) {
  vec2 a = min(xz - r.xy, r.zw - xz);
  return min(a.x, a.y);
}
// A manual bilinear fetch of a float height texture over a world rect,
// clamped at its edges (float textures aren't filterable everywhere).
float rectMetres(sampler2D t, vec4 r, vec2 xz) {
  vec2 size = vec2(textureSize(t, 0));
  vec2 p = clamp(rectUv(r, xz) * size - 0.5, vec2(0.0), size - 1.001);
  vec2 fl = floor(p);
  vec2 fr = p - fl;
  ivec2 i = ivec2(fl);
  float h00 = texelFetch(t, i, 0).r;
  float h10 = texelFetch(t, i + ivec2(1, 0), 0).r;
  float h01 = texelFetch(t, i + ivec2(0, 1), 0).r;
  float h11 = texelFetch(t, i + ivec2(1, 1), 0).r;
  return mix(mix(h00, h10, fr.x), mix(h01, h11, fr.x), fr.y);
}
// beyond the archipelago pack it is open ocean
float archMetres(vec2 xz) {
  return edgeDist(uArchRect, xz) < 0.0 ? -4000.0 : rectMetres(uArchH, uArchRect, xz);
}
// the island slot that draws xz, or -1 for the archipelago
int ownerAt(vec2 xz) {
  int o = -1;
  float best = 0.0;
  for (int s = 0; s < SLOTS; s++) {
    if (uSlotInfo[s].y < 0.5) continue;
    float e = edgeDist(uSlotRect[s], xz);
    if (e > best) { best = e; o = s; }
  }
  return o;
}
// how much of slot s's own data shows at xz
float slotWeight(int s, vec2 xz) {
  vec4 info = uSlotInfo[s];
  return info.x * smoothstep(0.0, info.z, edgeDist(uSlotRect[s], xz));
}

// The district, a third level under its island: its rect, and x its detail
// weight k, y on (0/1), z the margin over which it eases back into the
// island, w a band at its very edge where it shows nothing of its own. Its
// mesh draws the whole rect; the island's stop short of it by that band, so
// the two overlap there, at the island's own heights, instead of meeting.
uniform vec4 uDistRect;
uniform vec4 uDistInfo;
float distWeight(vec2 xz) {
  if (uDistInfo.y < 0.5) return 0.0;
  return uDistInfo.x * smoothstep(uDistInfo.w, uDistInfo.z, edgeDist(uDistRect, xz));
}
// whether the district's mesh draws xz, so an island's mesh need not
bool distDraws(vec2 xz) {
  return uDistInfo.y > 0.5 && edgeDist(uDistRect, xz) > uDistInfo.w;
}
`,Gl=`
uniform sampler2D uPatchMap;       // the cropped masks (R8, linear), each with a texel of nothing round it
uniform vec4 uPatchBox[PATCHES];   // each patch's crop in the world: x0, z0, x1, z1, outer edges
uniform vec4 uPatchUv[PATCHES];    // the same in the atlas: u0, v0, u1, v1
uniform vec4 uPatchInfo[PATCHES];  // x its weight in the year, y the reef flat's depth (metres), z 1 a raise, -1 a lower
uniform vec2 uSlotPatch[SLOTS];    // each slot's patches: x the first, y how many
uniform vec4 uSlotPatchBox[SLOTS]; // and the box round all of them (world), so the rest of the island skips the loop
bool inPatchBox(int s, vec2 xz) {
  vec4 b = uSlotPatchBox[s];
  return xz.x >= b.x && xz.y >= b.y && xz.x <= b.z && xz.y <= b.w;
}
// (render/patches.js writes only the patches with any weight in the year,
// so a year after them all costs nothing; and a patch's box is the first
// thing read, since most of the ground is in none of them)
float patchMask(int i, vec2 xz) {
  vec4 b = uPatchBox[i];
  if (xz.x < b.x || xz.y < b.y || xz.x > b.z || xz.y > b.w) return 0.0;
  vec4 u = uPatchUv[i];
  return textureLod(uPatchMap, mix(u.xy, u.zw, (xz - b.xy) / (b.zw - b.xy)), 0.0).r;
}
// how much of the ground the last patchedMetres was asked about is a patch's
// reef flat in the year (0..1): the sea reads it after the depth, rather
// than walk the patches again (patchReef)
float gPatchReef = 0.0;
// slot s's heights h at xz, as the year has them
float patchedMetres(int s, vec2 xz, float h) {
  gPatchReef = 0.0;
  if (!inPatchBox(s, xz)) return h;
  int a = int(uSlotPatch[s].x);
  int n = int(uSlotPatch[s].y);
  for (int i = 0; i < PATCHES; i++) {
    if (i >= n) break;
    float m = patchMask(a + i, xz);
    if (m <= 0.0) continue;
    vec4 info = uPatchInfo[a + i];
    h = mix(h, info.z > 0.0 ? max(h, info.y) : min(h, info.y), m * info.x);
    gPatchReef = max(gPatchReef, m * info.x);
  }
  return h;
}
`,Ru=Array.from({length:ts},(o,t)=>t),Fs=`
${Gl}
${Ru.map(o=>`uniform sampler2D uSlotH${o};`).join(`
`)}
float slotMetres(int s, vec2 xz) {
  // (samplers can only be picked by a constant index; the patches are laid
  // on whichever it was once, so the loop is compiled once, not per slot)
  float h = -4000.0;
${Ru.map(o=>`  ${o?"else ":""}if (s == ${o}) h = rectMetres(uSlotH${o}, uSlotRect[${o}], xz);`).join(`
`)}
  return patchedMetres(s, xz, h);
}
// the archipelago and the islands, without the district
float islandMetres(vec2 xz) {
  float m = archMetres(xz);
  int o = ownerAt(xz);
  if (o >= 0) {
    float w = slotWeight(o, xz);
    if (w > 0.0) m = mix(m, slotMetres(o, xz), w);
  }
  return m;
}

uniform sampler2D uDistH;     // heights today, metres (R32F, nearest)
uniform sampler2D uDistAux;   // r the lower patches' weight, g a feature's mask, b its paddy (hash, and the bank in the top bit), a its index
uniform sampler2D uDistCarve; // a loʻi's r terraces down the valley (modulo 64), g paddies across it (RG16F); off the loʻi, a filled channel's level in r, the normals' offset in g
// The district's patches (district-decode.js patchMap), over the box they
// reach: r which lower patches a texel belongs to (a group, 0 none), g and a
// the weights of the two raise patches over it, b their indices (low and
// high four bits). By group, the lower patches' weight in the year (the most
// of any patch in it) and their depth; by raise patch, its own.
uniform sampler2D uDistPatch;
uniform vec4 uDistPatchBox;               // x0, y0, x1, y1 in the district's texels, the far edges exclusive
uniform vec4 uDistLower[DIST_PATCHES];    // by group: x weight in the year, y depth
uniform vec4 uDistRaise[DIST_PATCHES];    // by raise patch: x weight in the year, y depth
uniform float uDistRaiseTop;              // the highest depth a raise lifts to in the year: ground above it no raise can reach
uniform vec4 uFeatK[16];      // each rastered feature's weight in the year, by index (loʻi DIST_LOI, ponds DIST_POND, the rest after)
float featK(int i) { return uFeatK[i >> 2][i & 3]; }
vec4 distPatchAt(ivec2 p) {
  vec4 b = uDistPatchBox;
  if (float(p.x) < b.x || float(p.y) < b.y || float(p.x) >= b.z || float(p.y) >= b.w) return vec4(0.0);
  return texelFetch(uDistPatch, p - ivec2(b.xy), 0);
}
// today's height h at texel p with the patches of the year laid on it
// (district-decode.js patchLevel): the raises first, then the lowers, whose
// byte in the aux map is under 128 a weight toward the reef flat and from
// 128 a weight toward the fill, at the level the carve keeps there
float distPatched(ivec2 p, float h, float r) {
  // (ground no raise can reach and no lower patch has is today's, without a look at the patch map)
  if (r < 0.5 && h >= uDistRaiseTop) return h;
  vec4 q = distPatchAt(p);
  if (q.g + q.a > 0.0) {
    int ix = int(q.b * 255.0 + 0.5);
    vec4 ra = uDistRaise[ix & 15];
    vec4 rb = uDistRaise[ix >> 4];
    h = mix(h, max(h, ra.y), q.g * ra.x);
    h = mix(h, max(h, rb.y), q.a * rb.x);
  }
  if (r > 0.5) {
    vec4 L = uDistLower[int(q.r * 255.0 + 0.5)];
    if (r < 127.5) h = mix(h, L.y, r / 127.0 * L.x);
    else h = mix(h, max(DIST_FILL, texelFetch(uDistCarve, p, 0).r), (r - 128.0) / 127.0 * L.x);
  }
  return h;
}
float distTexel(ivec2 p) {
  float h = texelFetch(uDistH, p, 0).r;
  vec4 a = texelFetch(uDistAux, p, 0);
  h = distPatched(p, h, a.r * 255.0);
  int f = int(a.a * 255.0 + 0.5);
  if (f > 0) {
    float k = featK(f);
    if (f < DIST_POND) {
      // a loʻi: cut or filled to its terrace's level (district-decode.js loiLevel)
      float tau = texelFetch(uDistCarve, p, 0).r;
      float stp = DIST_BASE * exp2(floor(a.b * 255.0 + 0.5));
      float L = tau + 64.0 * floor((h / stp - tau) / 64.0 + 0.5);
      h += ((floor(L) + 0.5) * stp - h) * a.g * k;
    } else if (f < DIST_OTHER) h = mix(h, DIST_POND_LEVEL, a.g * k);
  }
  return h;
}
vec2 distGrid(vec2 xz) {
  vec2 size = vec2(textureSize(uDistH, 0));
  return clamp(rectUv(uDistRect, xz) * size - 0.5, vec2(0.0), size - 1.001);
}
float distMetres(vec2 xz) {
  vec2 p = distGrid(xz);
  vec2 fl = floor(p);
  vec2 fr = p - fl;
  ivec2 i = ivec2(fl);
  // (the four texels in a loop: one copy of distTexel where it is inlined)
  vec4 t;
  for (int k = 0; k < 4; k++) t[k] = distTexel(i + ivec2(k & 1, k >> 1));
  return mix(mix(t.x, t.y, fr.x), mix(t.z, t.w, fr.x), fr.y);
}
float groundMetres(vec2 xz) {
  gPatchReef = 0.0;
  float w = distWeight(xz);
  // (each read once, behind a branch: a software renderer inlines all of
  // it, and runs what a choice of two values would have it compute)
  float m = 0.0;
  if (w < 1.0) m = islandMetres(xz);
  if (w > 0.0) m = mix(m, distMetres(xz), w);
  return m;
}
// a fishpond's water at xz (0..1), for the sea to lie calm in it
float distPond(vec2 xz) {
  if (distWeight(xz) <= 0.0) return 0.0;
  ivec2 i = ivec2(distGrid(xz) + 0.5);
  vec4 a = texelFetch(uDistAux, i, 0);
  int f = int(a.a * 255.0 + 0.5);
  return f >= DIST_POND && f < DIST_OTHER ? a.g * featK(f) : 0.0;
}
// how much of the water at xz is the reef flat a patch makes in the year
// (0..1), for the sea to show reef there and not open water (ocean.glsl.js);
// asked straight after groundMetres(xz), whose islands' part it reads
float patchReef(vec2 xz) {
  float r = 0.0;
  int o = ownerAt(xz);
  if (o >= 0) r = gPatchReef * slotWeight(o, xz);
  float w = distWeight(xz);
  if (w > 0.0) {
    ivec2 i = ivec2(distGrid(xz) + 0.5);
    vec4 q = distPatchAt(i);
    float d = 0.0;
    if (q.g + q.a > 0.0) {
      int ix = int(q.b * 255.0 + 0.5);
      d = max(q.g * uDistRaise[ix & 15].x, q.a * uDistRaise[ix >> 4].x);
    }
    float lr = texelFetch(uDistAux, i, 0).r * 255.0;
    if (lr > 0.5 && lr < 127.5) d = max(d, lr / 127.0 * uDistLower[int(q.r * 255.0 + 0.5)].x);
    r = mix(r, d, w);
  }
  return r;
}
`,Qs=`
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uMoonDir;
uniform vec3 uMoonColor;
uniform float uTime;
uniform sampler2D uSkyMap;      // equirect sky radiance, elevation squashed to the horizon

vec2 dirToSkyUv(vec3 d) {
  float y = clamp(d.y, -1.0, 1.0);
  return vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, sign(y) * sqrt(abs(y)) * 0.5 + 0.5);
}
vec3 skyMap(vec3 d) { return texture(uSkyMap, dirToSkyUv(d)).rgb; }

float sunVisibility(vec3 p) { return 1.0; }

vec3 ambientLight(vec3 n) {
  return mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
}

vec3 shade(vec3 albedo, vec3 n, vec3 p, float ao, float vis) {
  float ndl = max(dot(n, uSunDir), 0.0);
  float ndm = max(dot(n, uMoonDir), 0.0);
  vec3 direct = uSunColor * ndl * vis + uMoonColor * ndm;
  return albedo * (direct + ambientLight(n) * ao);
}
`,Zw=`
uniform sampler2D uMokuId;   // moku index per texel over the archipelago (R8, nearest), 0 none
uniform vec4 uMokuRect;
uniform sampler2D uPalette;  // 256 × 2: polity colour per moku, row 0 the era before, row 1 after; a: held
uniform float uEraMix;
uniform float uPolityK;      // overall strength: full far out, gone close in
uniform float uHoverMoku;

float mokuAt(vec2 xz) {
  vec2 uv = rectUv(uMokuRect, xz);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x >= 1.0 || uv.y >= 1.0) return 0.0;
  ivec2 size = textureSize(uMokuId, 0);
  return floor(texelFetch(uMokuId, ivec2(uv * vec2(size)), 0).r * 255.0 + 0.5);
}

vec3 applyPolity(vec3 col, vec2 xz, vec3 light) {
  if (uPolityK < 0.002 && uHoverMoku < 0.5) return col;
  float id = mokuAt(xz);
  if (id < 0.5) return col;
  vec4 a = texelFetch(uPalette, ivec2(int(id), 0), 0);
  vec4 b = texelFetch(uPalette, ivec2(int(id), 1), 0);
  // (a moku held in one era and not the other fades its tint rather than its hue)
  vec3 c = a.a > 0.5 && b.a > 0.5 ? mix(a.rgb, b.rgb, uEraMix) : (a.a > 0.5 ? a.rgb : b.rgb);
  float held = mix(a.a, b.a, uEraMix);
  if (a.a < 0.5 && b.a < 0.5) c = vec3(0.96, 0.93, 0.86); // (held by no one: hover shows it pale)
  // the hue from the polity, the brightness from the lit ground under it, so
  // the relief still reads through the colour and a cool hue over tan land
  // doesn't settle to grey
  vec3 lin = pow(c, vec3(2.2));
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  vec3 tint = lin / max(dot(lin, vec3(0.2126, 0.7152, 0.0722)), 0.05) * lum * 1.05;
  float k = uPolityK * 0.66 * held;
  if (abs(id - uHoverMoku) < 0.5) k = max(k, 0.3) + 0.12;
  return mix(col, tint, clamp(k, 0.0, 1.0));
}
`,Jw=`
uniform sampler2D uArchLandA; // over the archipelago, the keyframe before: r cultivation, g settlement (log), b forest
uniform sampler2D uArchLandB; // and after
uniform float uLandT;         // between them
uniform float uLandK;         // overall strength: the land view, faded close in and as the layers arrive
uniform float uLandEarly;     // 0 before about 1100 .. 1 by 1450: the 1778 layers whole

// Settlement as specks: a dot in some cells of a grid about five pixels
// across at any zoom (the power-of-two cell nearest that, the two nearest
// levels crossfaded), fixed to the ground so they hold still as the camera
// moves. area is the share of the ground they cover: below a quarter, more
// cells take a small dot (each fading in, not popping, as the year moves);
// above it the dots grow until they merge into solid town.
float speckLevel(vec2 xz, float level, float area, float px) {
  float cell = exp2(level);
  vec2 p = xz / cell;
  vec2 id = floor(p);
  // (placed and sized at random within the cell, so a dense town isn't a halftone screen)
  vec2 o = id + 0.15 + 0.7 * hash22(id + level * 13.7);
  float present = clamp((area * 4.0 - hash12(id + level * 7.3 + 5.1)) / 0.08, 0.0, 1.0);
  float r = mix(0.28, 1.1, smoothstep(0.25, 1.0, area)) * (0.75 + 0.5 * hash12(id + level * 3.1 + 9.2));
  float aa = px / cell;
  float speck = present * (1.0 - smoothstep(r - aa, r + aa, length(p - o)));
  return max(speck, smoothstep(0.7, 0.95, area));
}
float landSpecks(vec2 xz, float px, float area) {
  float lv = log2(max(px, 1e-4) * 5.0);
  float l0 = floor(lv);
  return mix(speckLevel(xz, l0, area, px), speckLevel(xz, l0 + 1.0, area, px), lv - l0);
}

vec3 applyLand(vec3 col, vec3 m, float rain, vec2 xz, float px, float metres) {
  float k = uLandK * smoothstep(0.0, 2.0, metres);
  // before the leeward field systems: the 1778 cultivation with its dry
  // fields faded and its people thinned (the contact keyframe's note)
  float cult = m.r * mix(0.12 + 0.88 * smoothstep(0.24, 0.46, rain), 1.0, uLandEarly);
  float sv = max(0.0, m.g - 0.1 * (1.0 - uLandEarly));
  float forest = m.b;
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  vec3 c = mix(col, vec3(lum) * vec3(1.10, 1.0, 0.84) * 1.08, 0.6);
  // the canopy keeps a little of the ground's own light and dark, so it isn't a flat sheet
  vec3 canopy = pow(vec3(0.15, 0.31, 0.13), vec3(2.2)) * (0.75 + 0.5 * clamp(lum / 0.12, 0.0, 1.2));
  c = mix(c, canopy, smoothstep(0.03, 0.85, forest) * 0.88);
  // (rising steeply from a little, since a fifth of the ground in fields is
  // a lot of fields, and at the chain's half-kilometre texels the scattered
  // kuleana of 1853 are each a fifth of one)
  vec3 gold = pow(vec3(0.86, 0.64, 0.22), vec3(2.2));
  c = mix(c, gold, pow(clamp((cult - 0.01) / 0.7, 0.0, 1.0), 0.65) * 0.85);
  // settlement (the bytes are log density, DATA.md): a faint wash from
  // about 8 to 110 people a km², and specks from about 30, covering a
  // tenth of the ground at 100, half at 1,000, merged into solid town by
  // about 10,000
  // (with the whole chain in view a shore's villages are a pixel or two
  // wide, so the specks are let to cover more of it there)
  float far = smoothstep(1.0, 5.0, px);
  float wash = mix(0.2, 0.28, far) * smoothstep(0.15, 0.40, sv);
  float cover = clamp((sv - 0.28) / 0.56, 0.0, 1.0);
  float speck = landSpecks(xz, px, pow(cover, 1.5 - 0.6 * far));
  vec3 umber = pow(mix(vec3(0.36, 0.25, 0.16), vec3(0.16, 0.135, 0.11), smoothstep(0.35, 0.9, sv)), vec3(2.2));
  c = mix(c, umber, max(wash, speck * 0.95));
  return mix(col, c, k);
}
`,Cn=24,xn=[1.1,.7],$n={pasture:[.6,.6,.22],lawn:[.45,.45,.12],orchard:[.16,.18,1],coffee:[.1,.14,1]},ns={pasture:6,orchard:7,lawn:8},Jd=.65,gn=o=>Number.isInteger(o)?o.toFixed(1):String(o),Qd=`
uniform vec4 uCropSelA;  // the keyframe shown: one of the crop map's channels
uniform vec4 uCropSelB;  // the one its fields are going over to
uniform float uCropMix;  // how far: a field whose own pick is under this has gone over

#define CROP_REGION ${gn(Cn)}
const vec2 CROP_CELL = vec2(${gn(xn[0])}, ${gn(xn[1])});

float cropHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// A field: its middle (world), where xz lies in it (0..1 along and across),
// the region's frame (q, world units from the region's middle, e1 along),
// its place among the region's fields (lid: along its strip, the strip) and
// an id unique across regions, and its picks (planted; which keyframe, while
// the fields go over).
struct CropCell { vec2 centre; vec2 q; vec2 f; vec2 lid; vec2 id; vec2 rid; vec2 e1; float pick; float pickKf; };
CropCell cropCell(vec2 xz) {
  CropCell c;
  c.rid = floor(xz / CROP_REGION);
  float a = (cropHash(c.rid + 71.3) - 0.5) * 1.4;
  c.e1 = vec2(cos(a), sin(a));
  vec2 e2 = vec2(-c.e1.y, c.e1.x);
  vec2 o = (c.rid + 0.5) * CROP_REGION;
  vec2 d = xz - o;
  c.q = vec2(dot(d, c.e1), dot(d, e2));
  float row = floor(c.q.y / CROP_CELL.y);
  float off = cropHash(vec2(row, 3.7) + c.rid * 13.0);
  float gx = c.q.x / CROP_CELL.x + off;
  c.lid = vec2(floor(gx), row);
  c.f = vec2(gx - c.lid.x, c.q.y / CROP_CELL.y - row);
  vec2 qc = vec2((c.lid.x + 0.5 - off) * CROP_CELL.x, (row + 0.5) * CROP_CELL.y);
  c.centre = o + qc.x * c.e1 + qc.y * e2;
  c.id = c.lid + c.rid * 97.0;
  c.pick = 0.5 * cropHash(c.id + 13.1) + 0.5 * cropHash(vec2(row, 7.9) + c.rid * 13.0);
  c.pickKf = cropHash(c.id + 41.7);
  return c;
}

// the class (x) and the share cultivated (y) at world p on a crop map over
// rect, nearest texel, in the keyframe a field of this pick shows
vec2 cropAt(sampler2D t, vec4 rect, vec2 p, float pick) {
  vec2 uv = rectUv(rect, p);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x >= 1.0 || uv.y >= 1.0) return vec2(0.0);
  vec2 size = vec2(textureSize(t, 0));
  vec4 b = texelFetch(t, ivec2(uv * size), 0);
  float v = floor(dot(b, pick < uCropMix ? uCropSelB : uCropSelA) * 255.0 + 0.5);
  float cls = floor(v / 16.0);
  return vec2(cls > 8.5 ? 0.0 : cls, (v - cls * 16.0) / 15.0);
}

// how much of a field of this class and share is planted: pasture and lawn
// whole, a crop at least half (and whole where the cultivation mask has
// none, so the class alone says it is there), a cultivated texel of no class
// by its share
float cropCover(vec2 cs) {
  if (cs.x < 0.5) return cs.y;
  if (abs(cs.x - 6.0) < 0.5 || cs.x > 7.5 || cs.y <= 0.0) return 1.0;
  return mix(0.55, 1.0, cs.y);
}
`,tp=`
${Qd}
// the open water in the paddies at the last applyCrops (0..1), for the light on it
float gCropWater = 0.0;

// a thin line of width w (world units) at distance d from its middle, antialiased over a pixel of px
float cropLine(float d, float w, float px) {
  return (1.0 - smoothstep(w * 0.5 - px * 0.5, w * 0.5 + px * 0.5, d)) * min(1.0, w / max(px, 1e-5) * 1.5);
}

// each class from afar: what its fields average to, and how much of that is water
vec3 cropTint(float cls, float rain) {
  if (cls < 1.5) return srgb(vec3(0.31, 0.42, 0.25));
  if (cls < 2.5) return srgb(vec3(0.52, 0.50, 0.32));
  if (cls < 3.5) return srgb(vec3(0.51, 0.59, 0.31));
  if (cls < 4.5) return srgb(vec3(0.42, 0.51, 0.22));
  if (cls < 5.5) return srgb(vec3(0.45, 0.43, 0.32));
  if (cls < 6.5) return srgb(mix(vec3(0.59, 0.57, 0.37), vec3(0.50, 0.55, 0.31), smoothstep(0.30, 0.50, rain)));
  if (cls < 7.5) return srgb(vec3(0.38, 0.44, 0.25));
  return srgb(vec3(0.45, 0.55, 0.30));
}
float cropTintWater(float cls) { return cls < 1.5 ? 0.08 : cls < 3.5 && cls > 2.5 ? 0.12 : 0.0; }

// a lattice of trees in the region's frame (step along, step across, the
// chance a point holds one), as features/crops.js plants it: how much of the
// ground at q is under a crown of radius r (world units). A crown lies
// within its own lattice cell (the jitter keeps it a fifth of a step from
// the edge, and every r here is under that), so one cell is enough.
float cropCrowns(vec2 q, vec3 lat, vec2 rid, float seed, float r, float px) {
  vec2 n = floor(q / lat.xy);
  vec2 cid = n + rid * 997.0;
  if (lat.z < 1.0 && cropHash(cid + seed) >= lat.z) return 0.0;
  vec2 jit = lat.z < 1.0 ? vec2(cropHash(cid + seed + 3.1), cropHash(cid + seed + 5.7)) * 0.6 + 0.2 : vec2(0.5);
  float d = length((n + jit) * lat.xy - q);
  return 1.0 - smoothstep(r - px * 0.5, r + px * 0.5, d);
}

// The near look of one field of class cls: c the field, gm the fall (metres
// per metre), px world units a pixel, fwM metres a pixel; water: the
// paddies' open water.
vec3 cropLook(float cls, CropCell c, vec2 xz, float metres, float gm, float rain, float px, float fwM, out float water) {
  water = 0.0;
  vec2 qm = c.q * 100.0;      // metres in the region's frame
  float pm = px * 100.0;      // metres a pixel
  vec3 tint = cropTint(cls, rain);
  if (cls < 1.5 || (cls > 2.5 && cls < 3.5)) {
    // Loʻi and rice: terraces a metre of fall each, paced off into paddies
    // across (taro's about 28 m, rice's 22) and never longer than 35 m, their
    // banks wandering a little; a field's paddies near one stage, each a
    // little its own (a rice field's nearer still); banks between them, a
    // rice field's bunds narrower and barer. What is left of a paddy is open
    // water.
    bool rice = cls > 2.5;
    float tau = metres;
    vec2 wob = vec2(vnoise(qm * 0.021), vnoise(qm * 0.021 + 17.0)) - 0.5;
    float u = qm.x / (rice ? 22.0 : 28.0) + wob.x * 0.7;
    float v = qm.y / (rice ? 26.0 : 35.0) + wob.y * 0.7;
    float hp = cropHash(vec2(floor(tau) + floor(v) * 131.0, floor(u)) + c.rid * 7.3);
    float h = fract(c.pick * 3.1 + hp * (rice ? 0.1 : 0.25));
    float fine = 1.0 - smoothstep(4.0, 14.0, pm);
    vec3 col;
    float open;
    if (!rice) {
      // (a paddy now and then just flooded, or fallow; the rest under taro, a field's of an age)
      float fallow = step(fract(hp * 5.9 + 0.3), 0.03);
      float bare = step(fract(hp * 3.7 + 0.4), 0.06);
      float grow = smoothstep(0.0, 0.8, h);
      float cover = mix(0.72 + 0.25 * grow, 0.15, bare) * (1.0 - fallow);
      // (kalo's leaves a deep blue-green, the paddies wet and darker than the dry ground about them)
      vec3 leaf = mix(srgb(vec3(0.38, 0.47, 0.27)), mix(srgb(vec3(0.28, 0.42, 0.24)), srgb(vec3(0.33, 0.47, 0.27)), fract(hp * 13.7)), grow);
      vec3 mud = srgb(vec3(0.30, 0.29, 0.22));
      col = mix(mix(mud, leaf, cover), srgb(vec3(0.46, 0.48, 0.30)), fallow);
      open = (1.0 - cover) * (1.0 - fallow) * 0.7;
    } else {
      // seedlings standing in water, the green crop, the crop gone gold, stubble
      float st = fract(h * 5.13 + 0.21);
      vec3 green = mix(srgb(vec3(0.50, 0.61, 0.29)), srgb(vec3(0.55, 0.65, 0.31)), fract(hp * 11.3));
      vec3 gold = srgb(vec3(0.66, 0.62, 0.36));
      vec3 stubble = srgb(vec3(0.57, 0.52, 0.37));
      float cover = st < 0.15 ? 0.35 : 0.95;
      col = st < 0.15 ? mix(srgb(vec3(0.36, 0.37, 0.27)), green, cover) : st < 0.7 ? green : st < 0.92 ? gold : stubble;
      open = st < 0.15 ? 0.6 : st < 0.7 ? 0.08 : 0.0;
    }
    // the banks: along the terraces (tau turning over) and across them (u, v)
    float bw = rice ? 1.2 : 2.0;
    float dT = min(fract(tau), 1.0 - fract(tau));
    float bankT = cropLine(dT, bw * max(gm, 0.004), fwM) * smoothstep(0.004, 0.012, gm);
    float dU = min(fract(u), 1.0 - fract(u)) * (rice ? 22.0 : 28.0);
    float dV = min(fract(v), 1.0 - fract(v)) * (rice ? 26.0 : 35.0);
    float bank = max(bankT, max(cropLine(dU, bw, pm), cropLine(dV, bw, pm))) * fine;
    vec3 bankC = rice ? srgb(vec3(0.50, 0.50, 0.33)) : srgb(vec3(0.39, 0.47, 0.24));
    col = mix(col, bankC, bank * 0.85);
    water = mix(open * (1.0 - bank), cropTintWater(cls), 1.0 - fine);
    return mix(tint, col, fine);
  }
  if (cls < 2.5) {
    // Dryland fields: long plots between low walls, three across a field and
    // two along it, sweet potato in mounds, dry taro, grass gone to straw,
    // now and then bare earth; the walls along the strips, where the
    // leeward field systems ran theirs
    float k = cropHash(c.id + 2.3);
    vec2 pid = vec2(floor(c.f.x * 2.0 + k * 0.8), floor(c.f.y * 3.0));
    float h = cropHash(c.id * 3.1 + pid);
    vec3 plot = h < 0.38 ? srgb(vec3(0.47, 0.48, 0.29)) : h < 0.62 ? srgb(vec3(0.44, 0.47, 0.31)) : h < 0.9 ? srgb(vec3(0.57, 0.54, 0.36)) : srgb(vec3(0.52, 0.43, 0.30));
    float fine = 1.0 - smoothstep(6.0, 18.0, pm);
    float rows = 0.5 + 0.5 * sin(qm.x * 4.2);
    plot *= mix(1.0, 0.9 + 0.16 * rows, (1.0 - smoothstep(0.25, 0.6, pm)) * step(h, 0.62));
    float dW = min(fract(c.f.y * 3.0), 1.0 - fract(c.f.y * 3.0)) * CROP_CELL.y / 3.0;
    plot = mix(plot, srgb(vec3(0.47, 0.44, 0.38)), cropLine(dW, 0.016, px) * 0.7);
    return mix(tint, plot, fine);
  }
  if (cls < 4.5) {
    // Cane: blocks of about two fields by two, each at its own stage (tall
    // and dark, young over the furrows, cut to stubble), striped along its
    // rows; dirt roads round each block
    vec2 g = c.q / (CROP_CELL * 2.0);
    vec2 bid = floor(g);
    vec2 bf = g - bid;
    float h = cropHash(bid + c.rid * 977.0 + 3.3);
    float fine = 1.0 - smoothstep(8.0, 30.0, pm);
    vec3 tall = mix(srgb(vec3(0.35, 0.47, 0.18)), srgb(vec3(0.44, 0.53, 0.22)), 0.5 + 0.5 * sin(qm.y * 0.9 + vnoiseF(xz * 9.0, px * 9.0) * 4.0));
    vec3 young = mix(srgb(vec3(0.50, 0.44, 0.30)), srgb(vec3(0.47, 0.55, 0.27)), 0.6 + 0.4 * sin(qm.y * 3.9));
    vec3 cut = srgb(vec3(0.50, 0.42, 0.29));
    vec3 cane = h < 0.12 ? cut : h < 0.32 ? young : tall;
    // (the rows: a few metres apart, while they are a few pixels)
    cane *= mix(1.0, 0.9 + 0.18 * (0.5 + 0.5 * sin(qm.y * 3.9)), 1.0 - smoothstep(0.3, 0.9, pm));
    vec2 dB = min(bf, 1.0 - bf) * CROP_CELL * 2.0;
    float road = max(cropLine(dB.x, 0.06, px), cropLine(dB.y, 0.06, px));
    cane = mix(cane, srgb(vec3(0.62, 0.54, 0.41)), road * 0.85);
    return mix(tint, cane, fine);
  }
  if (cls < 5.5) {
    // Pineapple: beds a couple of metres apart in blocks of a few, the
    // plants' grey-green over red earth, a field at a time newly set, grown,
    // or lying in red fallow; a red road at the field's ends
    float h = cropHash(c.id + 5.9);
    float grown = h < 0.25 ? 0.4 : h < 0.9 ? 0.75 : 0.1;
    vec3 soil = srgb(vec3(0.55, 0.32, 0.20));
    vec3 plant = srgb(vec3(0.36, 0.47, 0.33));
    float bed = 0.5 + 0.5 * sin(qm.y * 6.2832 / 2.2);
    float rowsK = 1.0 - smoothstep(0.4, 1.2, pm);
    float pl = mix(grown, smoothstep(1.0 - grown - 0.15, 1.0 - grown + 0.15, bed), rowsK);
    // (the beds in blocks, a path between: a stripe that holds out to a few metres a pixel)
    float blocks = 1.0 - smoothstep(0.42, 0.48, abs(fract(qm.y / 9.0) - 0.5)) * (1.0 - smoothstep(1.5, 4.0, pm));
    vec3 pine = mix(soil, plant, pl * mix(1.0, 0.25, 1.0 - blocks));
    float dE = min(c.f.x, 1.0 - c.f.x) * CROP_CELL.x;
    pine = mix(pine, srgb(vec3(0.58, 0.37, 0.24)), cropLine(dE, 0.05, px));
    float fine = 1.0 - smoothstep(8.0, 30.0, pm);
    return mix(mix(soil, plant, grown), pine, fine);
  }
  if (cls < 6.5) {
    // Pasture: grass grazed unevenly, drier to leeward; fences along some of
    // the fields' edges, paddocks of two fields by three; a few trees
    vec3 grass = tint * (0.92 + 0.16 * vnoiseF(xz * 3.0, px * 3.0)) * (0.96 + 0.08 * vnoiseF(xz * 21.0, px * 21.0));
    vec2 dE = vec2(min(c.f.x, 1.0 - c.f.x), min(c.f.y, 1.0 - c.f.y)) * CROP_CELL;
    vec2 L = c.lid;
    float fx = c.f.x < 0.5 ? 1.0 - step(0.5, mod(L.x, 2.0)) : 1.0 - step(0.5, mod(L.x + 1.0, 2.0));
    float fz = c.f.y < 0.5 ? 1.0 - step(0.5, mod(L.y, 3.0)) : 1.0 - step(0.5, mod(L.y + 1.0, 3.0));
    float fence = max(cropLine(dE.x, 0.012, px) * fx, cropLine(dE.y, 0.012, px) * fz);
    grass = mix(grass, srgb(vec3(0.34, 0.31, 0.25)), fence * 0.6);
    float tree = cropCrowns(c.q, vec3(${gn($n.pasture[0])}, ${gn($n.pasture[1])}, ${gn($n.pasture[2])}), c.rid, 211.0, 0.075, px) * (1.0 - smoothstep(0.08, 0.2, px));
    return mix(grass, srgb(vec3(0.26, 0.32, 0.16)), tree * 0.85);
  }
  if (cls < 7.5) {
    // Orchards and coffee: rows of small trees over mown grass, or coffee's
    // close hedgerows over red-brown earth, a field at a time
    bool coffee = cropHash(c.id + 9.4) >= ${gn(Jd)};
    vec3 under = coffee ? srgb(vec3(0.46, 0.38, 0.27)) : srgb(vec3(0.50, 0.51, 0.31));
    float crowns = coffee
      ? cropCrowns(c.q, vec3(${gn($n.coffee[0])}, ${gn($n.coffee[1])}, 1.0), c.rid, 0.0, 0.05, px)
      : cropCrowns(c.q, vec3(${gn($n.orchard[0])}, ${gn($n.orchard[1])}, 1.0), c.rid, 0.0, 0.06, px);
    float cov = coffee ? 0.55 : 0.45;
    float k = mix(crowns, cov, smoothstep(0.03, 0.09, px));
    vec3 leaf = coffee ? srgb(vec3(0.22, 0.32, 0.15)) : srgb(vec3(0.26, 0.36, 0.17));
    return mix(under, leaf, k);
  }
  // Lawn: mown green, striped by the mower close in; a few shade trees
  float stripe = 0.5 + 0.5 * sign(sin(qm.x * 0.39));
  vec3 lawn = tint * mix(1.0, 0.95 + 0.1 * stripe, 1.0 - smoothstep(0.6, 2.0, pm)) * (0.96 + 0.08 * vnoiseF(xz * 12.0, px * 12.0));
  float tree = cropCrowns(c.q, vec3(${gn($n.lawn[0])}, ${gn($n.lawn[1])}, ${gn($n.lawn[2])}), c.rid, 307.0, 0.07, px) * (1.0 - smoothstep(0.08, 0.2, px));
  return mix(lawn, srgb(vec3(0.24, 0.33, 0.15)), tree * 0.85);
}

// the era's default for a cultivated texel of no class: loʻi on a wet
// floor, dryland fields elsewhere
float cropDefault(float slope, float rain, float rip) {
  return slope < 0.06 && rip > 0.22 && rain > 0.36 ? 1.0 : 2.0;
}

// a classed field lying fallow: the ground's own colour halfway to its class's
vec3 cropFallow(vec3 base, float cls, float rain) {
  return mix(base, cropTint(cls, rain), 0.45);
}

// one field under a far pixel, by its class's mean: premultiplied colour, and its water added to w
vec4 cropFarTap(vec2 s, vec3 col, float def, float rain, inout float w) {
  float cv = cropCover(s);
  float cl = s.x < 0.5 ? def : s.x;
  w += cropTintWater(cl) * cv;
  return vec4(cropTint(cl, rain), 1.0) * cv + vec4(cropFallow(col, cl, rain), 1.0) * (1.0 - cv) * step(0.5, s.x);
}

// The ground's colour col with what grows over it: the crop map t over rect
// at world xz; dX, dY the pixel's footprint (dFdx and dFdy of xz), px its
// size; slope as the ground has it (1 − n.y at the valley's exaggeration),
// gm the true fall (metres per metre), fwM metres a pixel; rain, sand and
// riparian as the land map has them (nothing grows on the beach). Sets
// gCropWater.
vec3 applyCrops(vec3 col, sampler2D t, vec4 rect, vec2 xz, vec2 dX, vec2 dY, float px, float metres, float slope, float gm, float fwM, float rain, float sand, float rip) {
  gCropWater = 0.0;
  float ground = smoothstep(0.3, 2.0, metres) * (1.0 - smoothstep(0.1, 0.45, sand * (1.0 - smoothstep(4.0, 9.0, metres))));
  if (ground <= 0.0) return col;
  float def = cropDefault(slope, rain, rip);
  CropCell c = cropCell(xz);
  vec2 cs = cropAt(t, rect, c.centre, c.pickKf);
  // with fields finer than a pixel, three under the pixel (its own and two
  // across its footprint), by their mean
  float far = smoothstep(0.12, 0.5, px / CROP_CELL.y);
  vec4 avg = vec4(0.0);
  float avgW = 0.0;
  if (far > 0.0) {
    avg = cropFarTap(cs, col, def, rain, avgW);
    for (int k = 0; k < 2; k++) {
      CropCell ck = cropCell(xz + (k == 0 ? 0.33 : -0.33) * (dX + dY));
      avg += cropFarTap(cropAt(t, rect, ck.centre, ck.pickKf), col, def, rain, avgW);
    }
    avg /= 3.0;
    avgW /= 3.0;
  }
  vec4 near = vec4(0.0);
  float nearW = 0.0;
  float cover = cropCover(cs);
  if (far < 1.0 && cover > 0.0) {
    float cls = cs.x < 0.5 ? def : cs.x;
    // planted or fallow, a field at a time, until the fields get finer than
    // a few pixels; a classed texel's fallow fields are its own, a
    // cultivated one's of no class the ground's
    float planted = mix(step(c.pick, cover), cover, smoothstep(0.08, 0.3, px / CROP_CELL.y));
    float w;
    vec3 look = cropLook(cls, c, xz, metres, gm, rain, px, fwM, w);
    near = vec4(look, 1.0) * planted + vec4(cropFallow(col, cls, rain), 1.0) * (1.0 - planted) * step(0.5, cs.x);
    nearW = w * planted;
  }
  vec4 m = mix(near, avg, far);
  // (a little of the ground's own light and dark kept, so the fields aren't flat sheets)
  float k = m.a * 0.92 * ground;
  gCropWater = m.a > 1e-4 ? mix(nearW, avgW, far) / m.a * k : 0.0;
  return mix(col, m.rgb / max(m.a, 1e-4), k);
}

// the light on a paddy's open water, as the district's loʻi have it: the sky
// in it over muddy brown-green, and the sun's glint, a little quieter
vec3 cropWaterLit(vec3 lit, vec3 p, vec2 xz, float px, float vis, float k) {
  if (k <= 0.0) return lit;
  vec3 V = normalize(cameraPosition - p);
  vec2 rp = xz * 220.0 + vec2(uTime * 0.6, uTime * 0.4);
  vec3 N = normalize(vec3((vnoiseF(rp, px * 220.0) - 0.5) * 0.08, 1.0, (vnoiseF(rp + 13.0, px * 220.0) - 0.5) * 0.08));
  float F = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y);
  vec3 water = vec3(0.09, 0.085, 0.05) * (uSkyColor + uSunColor * max(uSunDir.y, 0.0) * vis);
  water = mix(water, skyMap(R), F * 0.6);
  vec3 H = normalize(uSunDir + V);
  water += uSunColor * pow(max(dot(N, H), 0.0), 300.0) * 3.0 * vis;
  return mix(lit, water, k * 0.75);
}
`,ep=.05,np=`
uniform sampler2D uOwnH;
uniform vec4 uOwnRect;
uniform int uSelf;
float packMetres(vec2 xz) {
  float a = archMetres(xz);
  if (uSelf < 0) return a;
  float w = slotWeight(uSelf, xz);
  if (w > 0.0) a = mix(a, patchedMetres(uSelf, xz, rectMetres(uOwnH, uOwnRect, xz)), w);
  return a;
}
`,sp=`
uniform float uKau;        // the season, 0 hoʻoilo .. 1 kau

vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

// the tree crowns: voronoi() cut to what they use
vec2 crowns(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0;
  vec2 best = n;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 r = g + hash22(n + g) - f;
    float d = dot(r, r);
    if (d < d1) { d1 = d; best = n + g; }
  }
  return vec2(sqrt(d1), hash12(best + 3.7));
}

// nC: the normal at the valley's exaggeration; px: world units per pixel;
// fwM: the metres' change over a pixel; wetHead (0..1): how far the farmed
// band gives way to forest lower down where it is wettest, as at the head of
// Nuʻuanu (the district passes its weight; the islands, 0)
vec3 groundAlbedo(vec2 xz, float metres, float rain, float sand, float rip, vec3 nC, float px, float fwM, float wetHead) {
  float slope = 1.0 - nC.y;
  // (fbm's first three octaves, ~300 m across, faded as they get finer than a pixel)
  float nBig = fbm2F(xz * 0.35, px * 0.35);
  vec3 grassDry = srgb(vec3(0.70, 0.60, 0.38));
  vec3 grassGreen = srgb(vec3(0.47, 0.55, 0.28));
  vec3 shrub = srgb(vec3(0.42, 0.45, 0.25));
  vec3 soil = srgb(vec3(0.52, 0.29, 0.17));
  vec3 rock = srgb(vec3(0.33, 0.29, 0.26));
  vec3 lava = srgb(vec3(0.17, 0.16, 0.155));
  vec3 sandC = srgb(vec3(0.90, 0.84, 0.70));

  float r = rain + (nBig - 0.5) * 0.12;
  float steep = smoothstep(0.32, 0.62, slope);
  vec3 col = vec3(0.0);
  float nMid = 0.5;
  float gN = 0.5;
  if (steep < 1.0) {
    vec3 scrubC = srgb(mix(vec3(0.41, 0.48, 0.28), vec3(0.44, 0.47, 0.29), uKau)); // ʻaʻaliʻi, lama, dry ʻōhiʻa, wiliwili
    vec3 mesic = srgb(vec3(0.37, 0.41, 0.25)); // ʻōhiʻa, koa, lama
    vec3 wet = srgb(vec3(0.33, 0.37, 0.21)); // ʻōhiʻa over hāpuʻu and ʻōlapa
    vec3 cloudF = srgb(vec3(0.33, 0.38, 0.22)); // stunted ʻōhiʻa, ʻōlapa, moss
    vec3 floorC = srgb(vec3(0.33, 0.43, 0.20)); // ʻōhiʻa ʻai and hau on the valley floors
    vec3 uluheC = srgb(vec3(0.49, 0.62, 0.31)); // uluhe, matte yellow-green fern
    vec3 bogC = srgb(vec3(0.43, 0.44, 0.27)); // summit bog
    nMid = fbm2F(xz * 2.1 + 5.0, px * 2.1);
    vec3 ground = mix(grassDry, grassGreen, smoothstep(0.18, 0.42, r + nMid * 0.08));
    float lee = 1.0 - smoothstep(-0.04, 0.04, r - 0.22 - 0.00043 * min(metres, 1500.0));
    ground = mix(ground, srgb(vec3(0.54, 0.62, 0.50)), 0.3 * (1.0 - uKau) * lee);
    float forest = smoothstep(0.30, 0.52, r + (nMid - 0.5) * 0.2);
    // c. 1700 the lowland below about 460 m was farmed and burned, and the
    // native forest stood untouched only above about 760 m: on the moist side
    // the interfluves lie open, the trees in the gulches and on steep slopes
    vec2 band = mix(vec2(420.0, 760.0), vec2(170.0, 330.0), wetHead * smoothstep(0.50, 0.60, r));
    float cult = 1.0 - smoothstep(band.x, band.y, metres + (nBig - 0.5) * 120.0);
    float gul = smoothstep(0.08, 0.3, rip);
    float moistLow = cult * smoothstep(0.30, 0.40, r);
    forest *= mix(1.0, 0.35 + 0.65 * max(gul, smoothstep(0.17, 0.34, slope)), moistLow);
    forest = max(forest, gul * 0.45 * (1.0 - smoothstep(0.30, 0.40, r)));
    // and above the cloud forest the trees give out: the tree line on the
    // high shields is near 2,800 m, thinning from 2,200
    forest *= 1.0 - smoothstep(2200.0, 2900.0, metres + (nBig - 0.5) * 300.0);
    vec3 canopyC = mix(scrubC, mesic, smoothstep(0.36, 0.46, r));
    canopyC = mix(canopyC, wet, smoothstep(0.54, 0.64, r));
    canopyC = mix(canopyC, cloudF, smoothstep(1150.0, 1450.0, metres));
    float flo = max(smoothstep(0.55, 0.85, rip) * (1.0 - smoothstep(0.10, 0.22, slope)),
                    (1.0 - smoothstep(0.03, 0.08, slope)) * smoothstep(0.15, 0.3, rip) * moistLow)
              * (1.0 - smoothstep(450.0, 560.0, metres)) * smoothstep(0.34, 0.40, r);
    canopyC = mix(canopyC, floorC, flo * 0.7);
    // tree crowns, each cell a sunlit dome, while they are several pixels across
    float crownFade = 1.0 - smoothstep(0.02, 0.07, px);
    if (crownFade > 0.0) {
      vec2 vc = crowns(xz * 6.0);
      float dome = sqrt(max(0.0, 1.0 - vc.x * vc.x * 1.6));
      vec2 toC = (xz * 6.0 - (floor(xz * 6.0) + 0.5));
      float lightSide = dot(normalize(vec3(-toC.x, 0.6, -toC.y)), uSunDir) * 0.5 + 0.5;
      float crown = mix(0.84, (0.62 + 0.45 * dome) * (0.78 + 0.4 * lightSide), crownFade);
      vec3 tint = mix(vec3(0.92, 0.96, 0.90), vec3(1.10, 1.06, 1.00), vc.y);
      canopyC *= mix(vec3(1.0), tint, crownFade * 0.7) * crown;
    } else canopyC *= 0.84;
    gN = fbm2F(xz * 18.0, px * 18.0) * 0.6 + 0.2;
    ground *= 0.82 + 0.36 * gN;
    col = mix(ground, canopyC, forest);
    float grove = mix(smoothstep(0.35, 0.65, nMid), 0.5, smoothstep(0.1, 0.3, px));
    float ulu = smoothstep(0.55, 0.65, r) * smoothstep(0.18, 0.34, slope) * smoothstep(120.0, 300.0, metres)
              * (1.0 - smoothstep(1000.0, 1300.0, metres)) * grove * (1.0 - gul);
    col = mix(col, uluheC * (0.85 + 0.3 * gN), ulu * 0.6);
    float bog = smoothstep(1320.0, 1420.0, metres) * (1.0 - smoothstep(1900.0, 2100.0, metres)) * (1.0 - smoothstep(0.03, 0.08, slope)) * smoothstep(0.80, 0.88, r);
    col = mix(col, bogC * (0.85 + 0.3 * nMid), bog * 0.85);
    // dry, bare, red-earth patches on the leeward slopes
    float bare = (1.0 - smoothstep(0.08, 0.3, r)) * smoothstep(0.55, 0.75, nMid + slope * 0.6);
    col = mix(col, soil, bare * 0.7);
  }
  // Above the trees: subalpine shrub and bunchgrass, then the summits'
  // cinder and bare rock, red-brown to grey.
  float sub = smoothstep(2100.0, 2700.0, metres + (nBig - 0.5) * 350.0);
  float alp = smoothstep(3000.0, 3500.0, metres + (nBig - 0.5) * 300.0);
  vec3 subC = mix(srgb(vec3(0.55, 0.50, 0.36)), srgb(vec3(0.45, 0.44, 0.30)), nMid) * (0.9 + 0.2 * gN);
  vec3 cinder = mix(srgb(vec3(0.42, 0.31, 0.26)), srgb(vec3(0.36, 0.34, 0.33)), smoothstep(0.3, 0.7, nMid));
  col = mix(col, subC, sub * (1.0 - steep) * 0.85);
  col = mix(col, cinder * (0.85 + 0.3 * nBig), alp);

  // --- steep ground: fern-hung pali on the wet side, rock on the dry ---------
  // (from ahupuaʻa, without the flow-by-flow detail: the flows stacked in
  // height show as bands, and a grain on the face breaks up the rest)
  if (steep > 0.0) {
    float wetSide = smoothstep(0.25, 0.5, r);
    float sheer = 1.0 - smoothstep(0.12, 0.3, nC.y);
    float hm = metres + (nBig - 0.5) * 40.0;
    float grain = vnoiseF(vec2(dot(xz, normalize(vec2(-nC.z, nC.x) + 1e-4)) * 7.0, hm * 0.07), px * 7.0);
    float rockW = smoothstep(0.25, 0.8, sheer + (grain - 0.5) * 0.5);
    float band = smoothstep(2.0, 5.0, 30.0 / max(fwM, 1e-3));
    float tone = mix(0.5, hash12(vec2(floor(hm / 30.0), 2.9)), band);
    float exposedDry = smoothstep(0.3, 0.7, 1.0 - smoothstep(0.3, 0.62, nC.y));
    float exposed = mix(exposedDry, rockW * 0.85, wetSide);
    vec3 basalt = mix(srgb(vec3(0.24, 0.244, 0.234)), srgb(vec3(0.292, 0.288, 0.274)), smoothstep(0.15, 0.85, tone));
    vec3 basaltDry = mix(rock, srgb(vec3(0.49, 0.315, 0.22)), 0.25 + 0.35 * smoothstep(0.1, 0.9, tone));
    basalt = mix(basaltDry, basalt, wetSide) * (0.86 + 0.28 * grain);
    vec3 fern = mix(srgb(vec3(0.20, 0.34, 0.14)), srgb(vec3(0.29, 0.41, 0.18)), grain);
    vec3 veg = mix(fern * (1.0 - 0.2 * rockW), srgb(vec3(0.15, 0.29, 0.09)), rockW);
    veg = mix(mix(shrub, grassDry, grain * 0.6), veg, wetSide);
    // (and above the trees, the pali are rock and scree)
    veg = mix(veg, mix(subC, cinder, alp), sub);
    vec3 cliff = mix(veg, basalt, exposed);
    col = mix(col, cliff, steep);
  }

  // --- the coast -----------------------------------------------------------
  float beach = sand * (1.0 - smoothstep(4.0, 9.0, metres));
  col = mix(col, sandC, smoothstep(0.15, 0.6, beach));
  col = mix(col, lava, smoothstep(0.6, 0.9, slope) * (1.0 - smoothstep(0.0, 25.0, metres)) * 0.7);
  float under = 1.0 - smoothstep(-0.3, 0.6, metres);
  vec3 seabed = mix(sandC * 0.85, srgb(vec3(0.42, 0.40, 0.33)), smoothstep(0.35, 0.65, nMid));
  col = mix(col, seabed, under);
  col *= 1.0 - 0.25 * smoothstep(1.5, 0.0, metres) * (1.0 - under);

  return col;
}
`,Qw=`
${Ne}
${Ye}
${Gl}
${np}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[12];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;

void main() {
  vec2 g = floor(position.xz * uGrid + 0.5); // this vertex's grid index in its node
  float cell = aNode.z / uGrid;
  vec2 xz = aNode.xy + g * cell;
  float mt = packMetres(xz);
  float dist = distance(uCamPos, vec3(xz.x, mt * uVert, xz.y));
  vec2 m = uMorph[int(aNode.w)];
  float k = clamp((dist - m.x) / (m.y - m.x), 0.0, 1.0);
  // Geomorph (as in ahupuaʻa): toward the outer edge of its range a vertex
  // between the next-coarser grid's vertices blends its height onto that
  // coarser mesh, so by the hand-over the two levels are the same surface.
  vec2 odd = g - 2.0 * floor(g * 0.5);
  if (k > 0.0 && odd.x + odd.y > 0.5) {
    // (the two coarser vertices first, and the ground read at them in one
    // place: packMetres is inlined wherever it is called, patches and all)
    vec2 base = aNode.xy + (g - odd) * cell;
    vec2 pa = base;
    vec2 pb = base + odd * 2.0 * cell;
    if (odd.x > 0.5 && odd.y > 0.5) {
      vec2 pc = (g - odd) * 0.5;
      if (mod(pc.x + pc.y, 2.0) > 0.5) {
        pa = base + vec2(2.0, 0.0) * cell;
        pb = base + vec2(0.0, 2.0) * cell;
      } else pb = base + vec2(2.0) * cell;
    }
    float hc = 0.0;
    for (int q = 0; q < 2; q++) hc += packMetres(q == 0 ? pa : pb);
    mt = mix(mt, hc * 0.5, k);
  }
  // Where the heights lie under the sea the sea is drawn, opaque, and not
  // this mesh (SEA_EDGE), so its seabed is never seen and it stops just
  // under the surface. (Sunk, or left at its own depth, a few hundred
  // metres down off a steep coast at a coarse level, every triangle from a
  // vertex at sea up to one on land dipped under the surface well inland of
  // where the heights meet the sea, and the seabed showed between the water
  // and the land.)
  mt = max(mt, -0.15);
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,ty=`
${Ne}
${Mo}
${Ye}
${Gl}
${np}
${Qs}
${Zw}
${Jw}
${sp}
// (the crops only where a pack has a crop map: overlay/crops.js defines CROPS on its material)
#ifdef CROPS
${tp}
uniform sampler2D uOwnCrop; // this island's crop map, a keyframe a channel (overlay/crops.js)
uniform float uOwnCropOn;  // 1 while it has one
#endif
uniform sampler2D uArchN;  // normals at NORMAL_E (rgb), ambient occlusion (a)
uniform sampler2D uArchL;  // r rain (log), g sand, b riparian, a reserved
uniform sampler2D uOwnN;
uniform sampler2D uOwnL;
uniform sampler2D uOwnS;   // this pack's cast shadows (shadow.js), over its rect
uniform sampler2D uOwnLandA; // this island's era layers, the keyframe before and after (overlay/land.js)
uniform sampler2D uOwnLandB;
uniform float uOwnRain;    // 0: this pack has no rain image, so the archipelago's stands
uniform int uDebug;
in vec3 vWorld;

void main() {
  vec2 xz = vWorld.xz;
  if (ownerAt(xz) != uSelf) discard;
  if (edgeDist(uArchRect, xz) < 0.0) discard;
  // (where the district is down, its own mesh draws the ground)
  if (distDraws(xz)) discard;
  // (and where the heights put the sea, the sea draws: SEA_EDGE; the land
  // takes its colour from the same heights, so a strip of shore or an islet
  // finer than the mesh is coloured as land, not as the seabed it lies on)
  float metres = packMetres(xz);
  if (metres < -${ep.toFixed(2)}) discard;
  float kSelf = uSelf < 0 ? 0.0 : slotWeight(uSelf, xz);
  // (all four sampled every time: mipmapped lookups need uniform control flow)
  vec2 uvA = rectUv(uArchRect, xz);
  vec2 uvO = rectUv(uOwnRect, xz);
  vec4 nt = mix(texture(uArchN, uvA), texture(uOwnN, uvO), kSelf);
  vec4 landA = texture(uArchL, uvA);
  vec4 land = mix(landA, texture(uOwnL, uvO), kSelf);
  if (uOwnRain < 0.5) land.r = landA.r;

  // The normal map holds the ground's slope at NORMAL_E; turn it back into a
  // gradient (metres per metre) and stand it up at the exaggeration of the
  // moment for the light, and at the valley's 1.3 for what grows where, so the
  // forest doesn't turn to cliff as the camera pulls back.
  vec3 n0 = nt.xyz * 2.0 - 1.0;
  vec2 grad = -n0.xz / (max(n0.y, 0.03) * NORMAL_E);
  vec3 n = normalize(vec3(-grad.x * uExag, 1.0, -grad.y * uExag));
  vec3 nC = normalize(vec3(-grad.x * NEAR_E, 1.0, -grad.y * NEAR_E));
  float slope = 1.0 - nC.y;
  float ao = mix(1.0, nt.a, 0.85);
  float rain = land.r;
  float sand = land.g;
  float rip = land.b;

  vec2 dX = dFdx(xz);
  vec2 dY = dFdy(xz);
  float px = length(abs(dX) + abs(dY)); // world units per pixel
  float fwM = fwidth(metres);

  vec3 col = groundAlbedo(xz, metres, rain, sand, rip, nC, px, fwM, 0.0);

  // what grows in the year, by class, over the island's own ground by its weight
  float cropWater = 0.0;
#ifdef CROPS
  if (uOwnCropOn > 0.5 && uSelf >= 0) {
    col = mix(col, applyCrops(col, uOwnCrop, uOwnRect, xz, dX, dY, px, metres, slope, length(grad), fwM, rain, sand, rip), kSelf);
    cropWater = gCropWater * kSelf;
  }
#endif

  // the land view: the archipelago's combined layers, and an island's own
  // over them by its weight, as the maps above (both conditions are
  // uniform, so the mipmapped lookups stay in uniform control flow)
  if (uLandK > 0.002) {
    vec3 lm = mix(texture(uArchLandA, uvA).rgb, texture(uArchLandB, uvA).rgb, uLandT);
    if (uSelf >= 0) lm = mix(lm, mix(texture(uOwnLandA, uvO).rgb, texture(uOwnLandB, uvO).rgb, uLandT), kSelf);
    col = applyLand(col, lm, rain, xz, px, metres);
  }

  // (an island's shadow map already holds its blend with the archipelago)
  float vis = texture(uOwnS, uvO).r;
  vec3 lit = shade(col, n, vWorld, ao, vis);
#ifdef CROPS
  lit = cropWaterLit(lit, vWorld, xz, px, vis, cropWater);
#endif
  vec3 lightLevel = uSunColor * max(dot(n, uSunDir), 0.0) * vis + uSkyColor;
  if (metres > 0.0) lit = applyPolity(lit, xz, lightLevel * 0.5);
  if (uDebug == 1) lit = col * 2.0;
  if (uDebug == 2) lit = n * 0.5 + 0.5;
  if (uDebug == 3) lit = vec3(ao);
  if (uDebug == 4) lit = vec3(rain, sand, rip);
  if (uDebug == 5) lit = uSelf < 0 ? vec3(0.2, 0.2, 0.8) : mix(vec3(0.2, 0.2, 0.8), vec3(0.9, 0.3, 0.1), kSelf);
  if (uDebug == 6) lit = mix(texture(uArchLandA, uvA).rgb, texture(uArchLandB, uvA).rgb, uLandT);
  gl_FragColor = vec4(lit, 1.0);
}
`,ey=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Vl(){const o=new Je;return o.setAttribute("position",new de(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),o}const ny=`
uniform sampler2D uScene;
uniform sampler2D uDepth;
uniform sampler2D uClouds;
uniform float uHasClouds;
uniform vec2 uCloudTexel;
uniform mat4 uInvProj;
uniform mat4 uCamWorld;
uniform vec3 uCamPos;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uFogFalloff;
uniform float uExposure;
uniform float uSaturation;
uniform float uNight;
uniform sampler2D uSkyMap;
in vec2 vUv;

vec3 skyMap(vec3 d) {
  float y = clamp(d.y, -1.0, 1.0);
  return texture(uSkyMap, vec2(atan(d.z, d.x) / 6.2831853 + 0.5, sign(y) * sqrt(abs(y)) * 0.5 + 0.5)).rgb;
}

vec3 aces(vec3 x) {
  // Narkowicz fit — punchy, keeps sunset colour
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
vec3 toSRGB(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec3 col = texture(uScene, vUv).rgb;
  float depth = texture(uDepth, vUv).r;
  vec4 ndc = vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
  vec4 view = uInvProj * ndc;
  view /= view.w;
  vec3 world = (uCamWorld * vec4(view.xyz, 1.0)).xyz;
  vec3 ray = world - uCamPos;
  float dist = length(ray);
  vec3 rd = ray / max(dist, 1e-4);
  if (depth < 1.0) {
    // exponential height fog, integrated along the view ray
    float b = uFogFalloff;
    float k = rd.y * b;
    float base = uFogDensity * exp(-max(uCamPos.y, 0.0) * b);
    float fog = abs(k) > 1e-5 ? base * (1.0 - exp(-dist * k)) / k : base * dist;
    fog = 1.0 - exp(-max(fog, 0.0));
    // the haze takes the colour of the sky just above the horizon behind it
    vec3 fogCol = skyMap(normalize(vec3(rd.x, 0.04 + max(rd.y, 0.0) * 0.5, rd.z)));
    col = mix(col, fogCol, fog);
  }
  if (uHasClouds > 0.5) {
    // a small tent blur hides the ray-march dither when upsampling
    vec2 e = uCloudTexel;
    vec4 c = texture(uClouds, vUv) * 0.36;
    c += texture(uClouds, vUv + vec2(e.x, e.y) * 0.9) * 0.16;
    c += texture(uClouds, vUv + vec2(-e.x, e.y) * 0.9) * 0.16;
    c += texture(uClouds, vUv + vec2(e.x, -e.y) * 0.9) * 0.16;
    c += texture(uClouds, vUv + vec2(-e.x, -e.y) * 0.9) * 0.16;
    col = col * c.a + c.rgb;
  }
  // by moonlight colour drains away and what's left goes blue
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, lum * vec3(0.6, 0.78, 1.18), uNight * 0.75);
  col *= uExposure;
  col = aces(col);
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l), col, uSaturation);
  gl_FragColor = vec4(toSRGB(col), 1.0);
}
`;class sy{constructor(t){this.renderer=t,this.size=new Bt;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?ks:pe,this.sceneRT=new cs(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new Bl(1,1,As),this.quad=new ge(Vl(),new _e({vertexShader:ey,fragmentShader:ny,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Bt},uInvProj:{value:new ne},uCamWorld:{value:new ne},uCamPos:{value:new W},uSunDir:{value:new W(0,1,0)},uSunColor:{value:new Ht},uFogColor:{value:new Ht(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new qr,this.quadScene.add(this.quad),this.quadCam=new $r(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var s;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(s=this.atmosphere)==null||s.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const s=this.uniforms;s.uInvProj.value.copy(e.projectionMatrixInverse),s.uCamWorld.value.copy(e.matrixWorld),s.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),s.uClouds.value=this.atmosphere.texture,s.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),s.uHasClouds.value=1):s.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const iy=`
${Ne}
${Ye}
uniform sampler2D uOwnH;
uniform vec4 uOwnRect;
uniform int uSelf;
uniform vec3 uSunDir;
uniform float uStep;   // world units: about one texel of the map
uniform float uTop;    // world Y of the highest ground; a ray above it is clear
in vec2 vUv;
float packMetres(vec2 xz) {
  float a = archMetres(xz);
  if (uSelf < 0) return a;
  float w = slotWeight(uSelf, xz);
  return w > 0.0 ? mix(a, rectMetres(uOwnH, uOwnRect, xz), w) : a;
}
void main() {
  vec2 xz = uOwnRect.xy + vUv * (uOwnRect.zw - uOwnRect.xy);
  float h0 = max(packMetres(xz), 0.0) * uVert + uStep * 0.02;
  vec2 d = normalize(uSunDir.xz + 1e-6);
  float rise = uSunDir.y / max(length(uSunDir.xz), 1e-4); // world y per unit
  float lit = 1.0;
  float t = uStep * 0.7;
  for (int i = 0; i < 56; i++) {
    vec2 p = xz + d * t;
    float ray = h0 + t * rise;
    float g = max(packMetres(p), 0.0) * uVert;
    lit = min(lit, 10.0 * (ray - g) / t + 0.5);
    if (lit <= 0.0 || ray > uTop) break;
    t = t * 1.085 + uStep * 0.35;
  }
  float s = clamp(lit, 0.0, 1.0);
  s = s * s * (3.0 - 2.0 * s);
  s *= smoothstep(-0.02, 0.04, uSunDir.y);
  gl_FragColor = vec4(s, s, s, 1.0);
}
`;class oy{constructor(t,e=1024,n=iy){const{W:s,H:i}=t,a=Math.min(1,e/Math.max(s,i)),r=Math.max(16,Math.round(s*a)),c=Math.max(16,Math.round(i*a));this.terrain=t,this.rt=new cs(r,c,{type:pe,format:zs,depthBuffer:!1,minFilter:Fe,magFilter:Fe});const l=t.pack.rect;this.uniforms={...t.uniforms,uSunDir:{value:new W(0,1,0)},uStep:{value:Math.max((l.x1-l.x0)/r,(l.z1-l.z0)/c)},uTop:{value:1}},this.material=new _e({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:n,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new qr;const h=new ge(Vl(),this.material);h.frustumCulled=!1,this.scene.add(h),this.cam=new $r(-1,1,1,-1,0,1),this.h=c,this.strips=4,this.strip=-1,this.drawn={sun:new W(0,-2,0),vert:-1,k:-1}}get texture(){return this.rt.texture}update(t,e,n,s,i){const a=this.uniforms,r=this.drawn;if(this.strip<0){if(!(e.angleTo(r.sun)>.004||Math.abs(n-r.vert)>r.vert*.015||Math.abs(s-r.k)>.03))return;if(a.uSunDir.value.copy(e),a.uTop.value=i,r.sun.copy(e),r.vert=n,r.k=s,!this.ever)return this.ever=!0,this.draw(t,-1);this.strip=0}this.draw(t,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e){const n=this.rt;if(e>=0){const i=Math.ceil(this.h/this.strips);n.scissor.set(0,e*i,n.width,i),n.scissorTest=!0}else n.scissorTest=!1;const s=t.getRenderTarget();t.setRenderTarget(n),t.render(this.scene,this.cam),t.setRenderTarget(s),n.scissorTest=!1}dispose(){this.rt.dispose(),this.material.dispose()}}const Lc=32,Lu=1600,Pu=-.5;function ip(o,t,e){const n=new We(o,t,e,zs,Ts);return n.minFilter=ie,n.magFilter=ie,n.wrapS=n.wrapT=Ze,n.needsUpdate=!0,n}function ku(o,t,e,n=1){const s=new We(o,t,e,Ae,pe);return s.minFilter=bi,s.magFilter=Fe,s.generateMipmaps=!0,s.anisotropy=n,s.wrapS=s.wrapT=Ze,s.needsUpdate=!0,s.onUpdate=()=>{s.image.data=null,s.onUpdate=null},s}class dl{constructor(t,e,n=null,s={}){this.pack=t,this.world=e;const i=t.data,{W:a,H:r}=t,{x0:c,z0:l,x1:h,z1:u}=t.rect;this.rect=new Yt(c,l,h,u),this.heights=i.metres,this.W=a,this.H=r;const f=e.app.renderer.capabilities.getMaxAnisotropy();this.heightTex=ip(i.metres,a,r),this.normalTex=ku(i.normals,a,r,Math.min(8,f)),this.landTex=ku(i.land,a,r,Math.min(4,f)),i.normals=null,i.land=null;const d=Math.max((h-c)/a,(u-l)/r);this.texel=d;const m=Math.max(h-c,u-l);this.levels=Math.max(1,Math.ceil(Math.log2(m/(Lc*d)))+1),this.leafSize=m/2**(this.levels-1),this.buildMinMax(Array.isArray(n)?n:n?[n]:[]),this.full=this.makeGrid(Lc),this.half=this.makeGrid(Lc/2),this.morph=[];for(let p=0;p<12;p++)this.morph.push(new Bt);const x=e.uniforms,g=(Array.isArray(n)?null:n)||e.arch||this;this.uniforms={...x,uOwnH:{value:this.heightTex},uOwnRect:{value:this.rect},uOwnN:{value:this.normalTex},uOwnL:{value:this.landTex},uArchN:{value:g.normalTex},uArchL:{value:g.landTex},uOwnS:{value:null},uOwnLandA:{value:null},uOwnLandB:{value:null},uOwnCrop:{value:null},uOwnCropOn:{value:0},uSelf:{value:-1},uOwnRain:{value:n&&!t.rainUrl?0:1},uMorph:{value:this.morph},uCamPos:{value:new W},uKau:{value:.5},uDebug:{value:0},...s.uniforms},this.group=new Te;for(const p of[this.full,this.half])p.material=new _e({vertexShader:s.vertexShader||Qw,fragmentShader:s.fragmentShader||ty,uniforms:{...this.uniforms,uGrid:{value:p.dim}}}),p.mesh=new ge(p.geometry,p.material),p.mesh.frustumCulled=!1,p.mesh.matrixAutoUpdate=!1,this.group.add(p.mesh);this.shadow=new oy(this,s.shadowSize,s.shadowFragment),this.uniforms.uOwnS.value=this.shadow.texture,this._frustum=new Is,this._m=new ne,this._box=new yn,this.rangeK=3.5,this.applyRange(this.rangeK)}makeGrid(t){const e=new yo,n=new Float32Array((t+1)*(t+1)*3);for(let r=0;r<=t;r++)for(let c=0;c<=t;c++){const l=(r*(t+1)+c)*3;n[l]=c/t,n[l+2]=r/t}const s=[];for(let r=0;r<t;r++)for(let c=0;c<t;c++){const l=r*(t+1)+c,h=l+1,u=l+t+1,f=u+1;c+r&1?s.push(l,u,h,h,u,f):s.push(l,u,f,l,f,h)}e.setIndex(s),e.setAttribute("position",new de(n,3));const i=new Float32Array(Lu*4),a=new he(i,4);return a.setUsage(an),e.setAttribute("aNode",a),e.instanceCount=0,{dim:t,geometry:e,data:i,attr:a,count:0}}buildMinMax(t){const{W:e,H:n,heights:s}=this,i=this.pack.rect,a=2**(this.levels-1),r=this.leafSize,c=e/(i.x1-i.x0),l=n/(i.z1-i.z0);let h=new Float32Array(a*a).fill(1/0),u=new Float32Array(a*a).fill(-1/0);for(let d=0;d<a;d++){const m=d*r;if(m>=i.z1-i.z0)continue;const x=Math.max(0,Math.floor(m*l)-1),g=Math.min(n-1,Math.ceil((m+r)*l)+1);for(let p=0;p<a;p++){const v=p*r;if(v>=i.x1-i.x0)continue;const w=Math.max(0,Math.floor(v*c)-1),b=Math.min(e-1,Math.ceil((v+r)*c)+1);let y=1/0,S=-1/0;for(let E=x;E<=g;E++)for(let T=w;T<=b;T++){const _=s[E*e+T];_<y&&(y=_),_>S&&(S=_)}if(t.length){const E=Math.max(2,Math.round((g-x)/16));for(const T of t)for(let _=x;_<=g;_+=E)for(let M=w;M<=b;M+=E){const A=T.metresAt(i.x0+(M+.5)/c,i.z0+(_+.5)/l);A<y&&(y=A),A>S&&(S=A)}y-=40,S+=40}h[d*a+p]=y,u[d*a+p]=S}}this.mm=[{lo:h,hi:u,n:a}];let f=a;for(;f>1;){const d=f/2,m=new Float32Array(d*d),x=new Float32Array(d*d);for(let g=0;g<d;g++)for(let p=0;p<d;p++){const v=2*g*f+2*p;m[g*d+p]=Math.min(h[v],h[v+1],h[v+f],h[v+f+1]),x[g*d+p]=Math.max(u[v],u[v+1],u[v+f],u[v+f+1])}h=m,u=x,f=d,this.mm.push({lo:h,hi:u,n:f})}}metresAt(t,e){const n=this.pack.rect,{W:s,H:i,heights:a}=this;let r=(t-n.x0)/(n.x1-n.x0)*s-.5,c=(e-n.z0)/(n.z1-n.z0)*i-.5;r<0?r=0:r>s-1.001&&(r=s-1.001),c<0?c=0:c>i-1.001&&(c=i-1.001);const l=r|0,h=c|0,u=r-l,f=c-h,d=h*s+l,m=a[d]+(a[d+1]-a[d])*u,x=a[d+s]+(a[d+s+1]-a[d+s])*u;return m+(x-m)*f}applyRange(t){this.rangeK=t;const e=t*this.leafSize;this.ranges=[];for(let n=0;n<this.levels;n++)this.ranges.push(e*2**n);this.ranges[this.levels-1]=1e9;for(let n=0;n<this.levels;n++){const s=this.ranges[n],i=n>0?this.ranges[n-1]:0;this.morph[n].set(i+(s-i)*.5,s*.97)}}setSelf(t){this.uniforms.uSelf.value=t;for(const e of[this.full,this.half])e.material.uniforms.uSelf.value=t}update(t,e){this.group.visible=e,this.full.count=0,this.half.count=0,e&&(this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.vert=this.world.uniforms.uVert.value,this.uniforms.uCamPos.value.copy(t.position),this.select(0,0,this.levels-1));for(const n of[this.full,this.half])n.geometry.instanceCount=n.count,n.attr.needsUpdate=!0}nodeBox(t,e,n){const s=this.mm[n],i=this.leafSize*2**n,a=this.pack.rect.x0+t*i,r=this.pack.rect.z0+e*i,c=this.vert,l=Math.min(0,s.lo[e*s.n+t])*c-.3,h=Math.max(0,s.hi[e*s.n+t])*c+.1;return this._box.min.set(a,l,r),this._box.max.set(a+i,h,r+i),this._box}select(t,e,n){const s=this.mm[n];if(!(s.hi[e*s.n+t]>=Pu))return!0;const a=this.nodeBox(t,e,n);if(a.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(a))return!0;const r=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,r,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,r,n),!0;for(let c=0;c<4;c++){const l=t*2+(c&1),h=e*2+(c>>1);if(!this.select(l,h,n-1)){const u=this.mm[n-1];if(!(u.hi[h*u.n+l]>=Pu))continue;const f=this.nodeBox(l,h,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,l,h,r/2,n)}}return!0}emit(t,e,n,s,i){if(t.count>=Lu)return;const a=t.count*4;t.data[a]=this.pack.rect.x0+e*s,t.data[a+1]=this.pack.rect.z0+n*s,t.data[a+2]=s,t.data[a+3]=i,t.count++}dispose(){for(const t of[this.full,this.half])t.geometry.dispose(),t.material.dispose();this.shadow.dispose(),this.heightTex.dispose(),this.normalTex.dispose(),this.landTex.dispose()}}const ay=["raise","lower"];async function ry(o){const t=await fetch(o);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}function op(o,t,e=console.warn,n=null){const s=(o==null?void 0:o.id)||(o==null?void 0:o.keyframe)||(o==null?void 0:o.file)||"?",i=(o==null?void 0:o.kind)??"lower";if(!ay.includes(i))return e(`patch ${s}: kind "${i}" is neither raise nor lower; not drawn`),null;if(!Number.isFinite(o.until))return e(`patch ${s}: no until year; not drawn`),null;if(!o.file)return e(`patch ${s}: no mask file; not drawn`),null;const a=Array.isArray(o.size)&&o.size.length===2&&o.size.every(r=>Number.isInteger(r)&&r>0)?o.size:null;return{id:String(s),pack:o.pack??n,kind:i,depth:Number.isFinite(o.depth)?o.depth:-1,until:o.until,url:t(o.file),size:a,note:o.note||""}}async function cy(o,t=console.warn){const e=new URL(o,location.href),n=a=>new URL(a,e).href;let s;try{s=await ry(n("patches/manifest.json"))}catch{return[]}const i=[];for(const a of(s==null?void 0:s.patches)||[]){if(!(a!=null&&a.pack)){t(`patch ${(a==null?void 0:a.id)??"?"}: no pack; not drawn`);continue}const r=op(a,n,t);r&&i.push(r)}return i}async function ap(o){const{px:t,W:e,H:n}=await On(o),s=new Uint8Array(e*n);for(let i=0,a=0;i<s.length;i++,a+=4)s[i]=t[a];return{grey:s,W:e,H:n}}function ly(o,t,e,n,s){if(t===n&&e===s)return o;const i=new Uint8Array(n*s);for(let a=0;a<s;a++){const r=Math.min(e-1,Math.max(0,(a+.5)/s*e-.5)),c=Math.floor(r),l=Math.min(e-1,c+1),h=r-c;for(let u=0;u<n;u++){const f=Math.min(t-1,Math.max(0,(u+.5)/n*t-.5)),d=Math.floor(f),m=Math.min(t-1,d+1),x=f-d,g=o[c*t+d]+(o[c*t+m]-o[c*t+d])*x,p=o[l*t+d]+(o[l*t+m]-o[l*t+d])*x;i[a*n+u]=Math.round(g+(p-g)*h)}}return i}function hy(o,t,e){let n=t,s=e,i=-1,a=-1;for(let h=0;h<e;h++){const u=h*t;for(let f=0;f<t;f++)o[u+f]&&(f<n&&(n=f),f>i&&(i=f),h<s&&(s=h),h>a&&(a=h))}if(i<0)return null;n=Math.max(0,n-1),s=Math.max(0,s-1),i=Math.min(t-1,i+1),a=Math.min(e-1,a+1);const r=i-n+1,c=a-s+1,l=new Uint8Array(r*c);for(let h=0;h<c;h++)l.set(o.subarray((s+h)*t+n,(s+h)*t+n+r),h*r);return{data:l,w:r,h:c,i0:n,j0:s}}async function uy(o,t=console.warn){const e=[];for(const n of o.masks||[])try{const s=await ap(n.url),[i,a]=n.size||[o.W,o.H];(s.W!==i||s.H!==a)&&t(`${n.url} is ${s.W}×${s.H}, the manifest says ${i}×${a}; read at its own size`),e.push(ly(s.grey,s.W,s.H,o.W,o.H))}catch(s){t(`${n.url}: ${s.message} (that patch is not drawn)`),e.push(new Uint8Array(o.W*o.H))}return e}function rp(){const o=new We(new Uint8Array(4),1,1,zs,pe);return o.needsUpdate=!0,{uPatchMap:{value:o},uPatchBox:{value:Array.from({length:ro},()=>new Yt(0,0,1,1))},uPatchUv:{value:Array.from({length:ro},()=>new Yt(0,0,1,1))},uPatchInfo:{value:Array.from({length:ro},()=>new Yt(0,-1,-1,0))},uSlotPatch:{value:Array.from({length:ts},()=>new Bt(0,0))},uSlotPatchBox:{value:Array.from({length:ts},()=>new Yt(0,0,-1,-1))}}}function fy(o){const e=o.reduce((c,l)=>c+(l.w+1)*(l.h+1),0),n=Math.max(...o.map(c=>c.w))+2*1,s=Math.min(4096,Math.max(n,64,Math.ceil(Math.sqrt(e*1.25))));let i=1,a=1,r=0;for(const c of[...o].sort((l,h)=>h.h-l.h))i+c.w+1>s&&(i=1,a+=r+1,r=0),c.ax=i,c.ay=a,i+=c.w+1,r=Math.max(r,c.h);return{W:s,H:a+r+1}}class dy{constructor(t){this.app=t,this.world=t.world,this.u=t.world.uniforms,this.all=[],this.recs=[],this.byPack=new Map,this.loaded=!1,this.atlas=null,this.warned=!1,this.ready=new Promise(e=>this.resolveReady=e),this.slotKey=""}async load(t=this.app.params.get("patches")||this.app.data.base){var r;const e=this.app.warn,n=await cy(t,e),s=this.loaded;this.all=n,this.resolveReady(n),s&&((r=this.app.districts)==null||r.setPatches(n));const i=new Map(this.world.islandPacks.map(c=>[c.id,c])),a=[];for(const c of n){const l=i.get(c.pack);if(l)try{const h=await ap(c.url),[u,f]=c.size||[l.W,l.H];(h.W!==u||h.H!==f)&&e(`patch ${c.id}: ${c.url} is ${h.W}×${h.H}, the manifest says ${u}×${f}; drawn at its own size`);const d=hy(h.grey,h.W,h.H);if(!d){e(`patch ${c.id}: its mask marks nothing`);continue}const m=l.rect,x=(m.x1-m.x0)/h.W,g=(m.z1-m.z0)/h.H;a.push({...c,crop:d,box:[m.x0+d.i0*x,m.z0+d.j0*g,m.x0+(d.i0+d.w)*x,m.z0+(d.j0+d.h)*g],k:this.want(c),depthM:c.depth})}catch(h){e(`patch ${c.id}: ${h.message}`)}}return this.setRecs(a),this.loaded=!0,n}forPack(t){return this.all.filter(e=>e.pack===t)}setRecs(t){var e;(e=this.atlas)==null||e.dispose(),this.atlas=null,this.recs=t,this.byPack=new Map;for(const n of t)this.byPack.has(n.pack)||this.byPack.set(n.pack,[]),this.byPack.get(n.pack).push(n);for(const n of this.byPack.values())n.sort((s,i)=>s.kind===i.kind?0:s.kind==="raise"?-1:1);if(t.length){const{W:n,H:s}=fy(t.map(r=>r.crop)),i=new Uint8Array(n*s);for(const{crop:r}of t)for(let c=0;c<r.h;c++)i.set(r.data.subarray(c*r.w,(c+1)*r.w),(r.ay+c)*n+r.ax);const a=new We(i,n,s,zs,pe);a.minFilter=a.magFilter=Fe,a.wrapS=a.wrapT=Ze,a.generateMipmaps=!1,a.unpackAlignment=1,a.needsUpdate=!0,this.atlas=a,this.atlasSize=[n,s];for(const r of t){const c=r.crop;r.uv=[c.ax/n,c.ay/s,(c.ax+c.w)/n,(c.ay+c.h)/s]}}this.u.uPatchMap.value=this.atlas||rp().uPatchMap.value,this.slotKey="",this.write()}want(t,e=this.app.timeline.year){return e<t.until?1:0}update(t){if(!this.recs.length)return;const e=this.app.timeline.year,n=t>0?1-Math.exp(-t*dd):1;for(const s of this.recs){const i=this.want(s,e);s.k+=(i-s.k)*n,Math.abs(i-s.k)<.002&&(s.k=i)}this.write()}settle(){this.update(0)}write(){const t=this.u,e=t.uPatchBox.value,n=t.uPatchUv.value,s=t.uPatchInfo.value,i=t.uSlotPatch.value,a=t.uSlotPatchBox.value;let r=0,c=0;this.world.slots.forEach((l,h)=>{const u=l&&this.byPack.get(l.pack.id)||[],f=r;let d=1/0,m=1/0,x=-1/0,g=-1/0;for(const p of u)if(!(p.k<=0)){if(r>=ro){c++;continue}e[r].set(...p.box),n[r].set(...p.uv),s[r].set(p.k,p.depthM,p.kind==="raise"?1:-1,0),r++,d=Math.min(d,p.box[0]),m=Math.min(m,p.box[1]),x=Math.max(x,p.box[2]),g=Math.max(g,p.box[3])}i[h].set(f,r-f),x>=d?a[h].set(d,m,x,g):a[h].set(0,0,-1,-1)}),c&&!this.warned&&(this.warned=!0,this.app.warn(`more than ${ro} patches on the islands in view; ${c} of them are not drawn`))}apply(t,e,n,s){const i=this.byPack.get(t);if(!i)return s;for(const a of i){if(a.k<=0)continue;const r=a.box,c=(e-r[0])/(r[2]-r[0]),l=(n-r[1])/(r[3]-r[1]);if(c<0||l<0||c>1||l>1)continue;const h=this.maskAt(a.crop,c,l)*a.k;h>0&&(s+=((a.kind==="raise"?Math.max(s,a.depthM):Math.min(s,a.depthM))-s)*h)}return s}maskAt(t,e,n){const s=e*t.w-.5,i=n*t.h-.5,a=Math.floor(s),r=Math.floor(i),c=s-a,l=i-r,h=(d,m)=>d<0||m<0||d>=t.w||m>=t.h?0:t.data[m*t.w+d],u=h(a,r)+(h(a+1,r)-h(a,r))*c,f=h(a,r+1)+(h(a+1,r+1)-h(a,r+1))*c;return(u+(f-u)*l)/255}stats(){return{loaded:this.loaded,listed:this.all.length,atlas:this.atlasSize||null,kB:this.atlasSize?Math.round(this.atlasSize[0]*this.atlasSize[1]/1024):0,islands:this.recs.map(t=>({id:t.id,pack:t.pack,kind:t.kind,depth:t.depthM,until:t.until,k:+t.k.toFixed(3),box:t.box.map(e=>+e.toFixed(3)),texels:t.crop.w*t.crop.h})),inSlots:this.u.uSlotPatch.value.map(t=>t.y)}}}const Du=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)};class py{constructor(t,e){this.app=t,this.data=e,this.packs=e.packs,this.archPack=this.packs.find(a=>a.kind==="archipelago")||this.packs[0],this.islandPacks=this.packs.filter(a=>a!==this.archPack),this.group=new Te,this.terrains=new Map,this.slots=new Array(ts).fill(null),this.exag=ih(5e3),this.noIslands=!1,this.held=!1,this.forceK=null;const n=ip(new Float32Array([-4e3]),1,1),s=new We(new Uint8Array(4),1,1,Ae,pe);s.needsUpdate=!0,this.dummyAux=s;const i=a=>Array.from({length:a},()=>new Yt(0,0,0,0));this.uniforms={uVert:{value:this.exag/100},uExag:{value:this.exag},uArchH:{value:n},uArchRect:{value:new Yt(0,0,1,1)},uSlotRect:{value:Array.from({length:ts},()=>new Yt(0,0,1,1))},uSlotInfo:{value:Array.from({length:ts},()=>new Yt(0,0,1,0))},uDistRect:{value:new Yt(0,0,1,1)},uDistInfo:{value:new Yt(0,0,1,0)},uDistH:{value:n},uDistAux:{value:s},uDistCarve:{value:n},uDistPatch:{value:s},uDistPatchBox:{value:new Yt(0,0,0,0)},uDistLower:{value:i(rs)},uDistRaise:{value:i(rs)},uDistRaiseTop:{value:-1e9},uFeatK:{value:i(16)},uFeatCrop:{value:i(16)},...rp()},this.district=null;for(let a=0;a<ts;a++)this.uniforms[`uSlotH${a}`]={value:n};this._frustum=new Is,this._m=new ne,this._box=new yn,this.dummy=n}setArchipelago(t){const e=new dl(t,this);e.setSelf(-1),this.arch=e,this.terrains.set(t.id,e),this.group.add(e.group),this.uniforms.uArchH.value=e.heightTex,this.uniforms.uArchRect.value.copy(e.rect);const n=t.rect;this.bounds={x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1}}addIsland(t){const e=new dl(t,this,this.arch);e.k=0,e.want=0,e.slot=-1;const n=t.rect;return e.margin=Math.min(15,.08*Math.min(n.x1-n.x0,n.z1-n.z0)),e.group.visible=!1,this.terrains.set(t.id,e),this.group.add(e.group),e}get islands(){return[...this.terrains.values()].filter(t=>t!==this.arch)}wantFor(t,e){const n=t.pack.rect,s=e.position,i=Math.max(n.x0-s.x,0,s.x-n.x1),a=Math.max(n.z0-s.z,0,s.z-n.z1),r=Math.hypot(i,a,Math.max(1,s.y)),c=(innerHeight||800)/(2*Math.tan(e.fov*Math.PI/360)),l=this.arch.texel*c/r;t.score=l;const h=Math.max(1,t.pack.data.hi*this.uniforms.uVert.value);return this._box.min.set(n.x0,0,n.z0),this._box.max.set(n.x1,h,n.z1),this._frustum.intersectsBox(this._box)?Du(1,2.4,l):0}update(t,e,n){var m,x,g;this.exag=ih(e),this.uniforms.uExag.value=this.exag,this.uniforms.uVert.value=this.exag/100;const s=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);const i=this.noIslands||this.held;for(const p of s)p.want=i?0:this.wantFor(p,t);const a=s.filter(p=>p.want>0).sort((p,v)=>v.score-p.score),r=new Set(a.slice(0,ts)),c=1-Math.exp(-n*2.5);for(const p of s){const v=r.has(p)?p.want:0;if(p.slot>=0)p.k+=(v-p.k)*c,Math.abs(v-p.k)<.004&&(p.k=v),p.k<=0&&v<=0&&this.release(p);else if(v>0){const w=this.slots.indexOf(null);w>=0&&this.assign(p,w)}}if(this.forceK!==null)for(const p of this.slots)p&&(p.k=this.forceK);if(i)for(const p of this.slots)p&&this.release(p);const l=this.uniforms;for(let p=0;p<ts;p++){const v=this.slots[p];l.uSlotInfo.value[p].set(v?v.k:0,v?1:0,v?v.margin:1,0)}(m=this.app.patches)==null||m.update(n),this.arch.update(t,!0);for(const p of s)p.update(t,p.slot>=0);(x=this.district)==null||x.update(t,e,n);const h=this.app.renderer,u=this.app.light.sunDir,f=this.uniforms.uVert.value,d=this.maxY+.1;this.arch.shadow.update(h,u,f,0,d);for(const p of s)p.slot>=0&&p.shadow.update(h,u,f,p.k,d);(g=this.district)==null||g.updateShadow(h,u,f,d)}settle(t){var s;const e=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const i of e)i.want=this.held?0:this.wantFor(i,t);const n=e.filter(i=>i.want>0).sort((i,a)=>a.score-i.score).slice(0,this.slots.length);for(const i of e)i.slot>=0&&!n.includes(i)&&this.release(i);for(const i of n){if(i.slot<0){const a=this.slots.indexOf(null);if(a<0)continue;this.assign(i,a)}i.k=i.want}(s=this.app.patches)==null||s.settle()}stats(){var n,s,i;const t={};for(const[a,r]of this.terrains)r.group.visible&&(t[a]=r.full.count+r.half.count);const e=(n=this.district)==null?void 0:n.cur;return(s=e==null?void 0:e.terrain)!=null&&s.group.visible&&(t[e.d.id]=e.terrain.full.count+e.terrain.half.count),{exag:+this.exag.toFixed(2),nodes:t,slots:this.slots.map(a=>a?`${a.pack.id}:${a.k.toFixed(2)}`:null),district:((i=this.district)==null?void 0:i.stats())??null}}assign(t,e){this.slots[e]=t,t.slot=e,t.k=0,t.setSelf(e),t.shadow.ever=!1,t.shadow.strip=-1,t.shadow.drawn.vert=-1,this.uniforms.uSlotRect.value[e].copy(t.rect),this.uniforms[`uSlotH${e}`].value=t.heightTex}release(t){const e=t.slot;e<0||(this.slots[e]=null,t.slot=-1,t.k=0,this.uniforms[`uSlotH${e}`].value=this.dummy,this.uniforms.uSlotInfo.value[e].set(0,0,1,0))}metresAt(t,e){var c;const n=this.arch;if(!n)return-4e3;const s=n.pack.rect;let i=t<s.x0||e<s.z0||t>s.x1||e>s.z1?-4e3:n.metresAt(t,e),a=null,r=0;for(const l of this.slots){if(!l)continue;const h=l.pack.rect,u=Math.min(t-h.x0,h.x1-t,e-h.z0,h.z1-e);u>r&&(r=u,a=l)}if(a){const l=a.k*Du(0,a.margin,r);l>0&&(i+=(this.ownMetres(a,t,e)-i)*l)}return(c=this.district)!=null&&c.on?this.district.blend(t,e,i):i}ownMetres(t,e,n){const s=t.metresAt(e,n);return this.app.patches?this.app.patches.apply(t.pack.id,e,n,s):s}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.uniforms.uVert.value}get maxY(){let t=0;for(const e of this.terrains.values())t=Math.max(t,e.pack.data.hi);return t*this.uniforms.uVert.value}chainShape(){if(this._chain)return this._chain;const t=this.arch,e=48,n=[];let s=null,i=null;for(const c of this.islandPacks){const l=c.rect,h=[];for(let f=0;f<=e;f++)for(let d=0;d<=e;d++){const m=l.x0+(l.x1-l.x0)*d/e,x=l.z0+(l.z1-l.z0)*f/e;t.metresAt(m,x)>0&&h.push([m,x])}if(!h.length)continue;n.push(...h);const u=(l.x0+l.x1)/2;(!s||u<s.cx)&&(s={cx:u,own:h}),(!i||u>i.cx)&&(i={cx:u,own:h})}if(!n.length){const c=this.bounds,l=[[c.x0,c.z0],[c.x1,c.z0],[c.x1,c.z1],[c.x0,c.z1]];return this._chain={hull:l,from:l[0],to:l[2]}}const a=s.own.reduce((c,[l,h])=>[c[0]+l/s.own.length,c[1]+h/s.own.length],[0,0]),r=i.own.reduce((c,l)=>l[0]+l[1]>c[0]+c[1]?l:c);return this._chain={hull:my(n),from:a,to:r}}islandAt(t,e){let n=null,s=0;for(const i of this.islands){const a=i.pack.rect,r=Math.min(t-a.x0,a.x1-t,e-a.z0,a.z1-e);r>s&&(s=r,n=i)}return n}setRange(t){var e,n,s;for(const i of this.terrains.values())i.applyRange(t);(s=(n=(e=this.district)==null?void 0:e.cur)==null?void 0:n.terrain)==null||s.applyRange(t)}setDebug(t){var n,s;for(const i of this.terrains.values())i.uniforms.uDebug.value=t;const e=(s=(n=this.district)==null?void 0:n.cur)==null?void 0:s.terrain;if(e)for(const i of[e.full,e.half])i.material.uniforms.uDebug.value=t}}function my(o){const t=[...o].sort((i,a)=>i[0]-a[0]||i[1]-a[1]);if(t.length<3)return t;const e=(i,a,r)=>(a[0]-i[0])*(r[1]-i[1])-(a[1]-i[1])*(r[0]-i[0]),n=[];for(const i of t){for(;n.length>=2&&e(n.at(-2),n.at(-1),i)<=0;)n.pop();n.push(i)}const s=[];for(let i=t.length-1;i>=0;i--){const a=t[i];for(;s.length>=2&&e(s.at(-2),s.at(-1),a)<=0;)s.pop();s.push(a)}return n.slice(0,-1).concat(s.slice(0,-1))}const gy=`
${Ne}
${Ye}
${Fs}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[12];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out float vMetres;

float packMetres(vec2 xz) { return groundMetres(xz); }
// The seabed is sunk well under the sea so the two never fight over depth,
// but a vertex beside the shore is brought up to it instead: sunk, every
// triangle from it up to the land dipped under the surface a little inland
// of where the heights meet the sea, and the seabed showed between the
// water and the land (ocean.glsl.js). Its eight neighbours a cell away (two
// in a morph, where the coarser grid's are the ones it meets).
#define SHORE_M 0.15
bool besideShore(vec2 xz, float cell) {
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    if (i == 0 && j == 0) continue;
    if (packMetres(xz + vec2(float(i), float(j)) * cell) > -SHORE_M) return true;
  }
  return false;
}

void main() {
  vec2 g = floor(position.xz * uGrid + 0.5);
  float cell = aNode.z / uGrid;
  vec2 xz = aNode.xy + g * cell;
  float mt = packMetres(xz);
  float dist = distance(uCamPos, vec3(xz.x, mt * uVert, xz.y));
  vec2 m = uMorph[int(aNode.w)];
  float k = clamp((dist - m.x) / (m.y - m.x), 0.0, 1.0);
  // (the geomorph of terrain.glsl.js)
  vec2 odd = g - 2.0 * floor(g * 0.5);
  if (k > 0.0 && odd.x + odd.y > 0.5) {
    // (the two coarser vertices first, and the ground read at them in one
    // place: packMetres is inlined wherever it is called, patches and all)
    vec2 base = aNode.xy + (g - odd) * cell;
    vec2 pa = base;
    vec2 pb = base + odd * 2.0 * cell;
    if (odd.x > 0.5 && odd.y > 0.5) {
      vec2 pc = (g - odd) * 0.5;
      if (mod(pc.x + pc.y, 2.0) > 0.5) {
        pa = base + vec2(2.0, 0.0) * cell;
        pb = base + vec2(0.0, 2.0) * cell;
      } else pb = base + vec2(2.0) * cell;
    }
    float hc = 0.0;
    for (int q = 0; q < 2; q++) hc += packMetres(q == 0 ? pa : pb);
    mt = mix(mt, hc * 0.5, k);
  }
  // (beside the shore the seabed comes up to the sea; the rest sinks out of its way: besideShore)
  if (mt < -SHORE_M && besideShore(xz, cell * (k > 0.0 ? 2.0 : 1.0))) mt = -SHORE_M;
  vMetres = mt;
  if (mt < -SHORE_M) mt -= 25.0 * smoothstep(SHORE_M, 3.0, -mt);
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,xy=`
${Ne}
${Mo}
${Ye}
${Fs}
${Qs}
${sp}
// (the crops only while its island has a crop map: overlay/crops.js defines CROPS on its material)
#ifdef CROPS
${tp}
uniform sampler2D uDistCrop;  // its island's crop map (overlay/crops.js), over the island's rect
uniform vec4 uDistCropRect;
uniform float uDistCropOn;
#endif
uniform sampler2D uArchN;
uniform sampler2D uArchL;
uniform sampler2D uParN;   // the island's maps, under the district (its slot's own)
uniform sampler2D uParL;
uniform sampler2D uParS;
uniform vec4 uParRect;
uniform int uParSlot;      // the island's slot, or -1
uniform float uParRain;
uniform sampler2D uDistN;  // the district's normals (today's ground) and occlusion
uniform sampler2D uDistL;  // r rain, g today's beach, b riparian, a the beach of the patched years
uniform sampler2D uDistS;  // its cast shadows
uniform vec4 uFeatCrop[16];   // each rastered loʻi's crop by index: 0 none named, 1 taro, 2 rice
uniform int uDebug;
in vec3 vWorld;
in float vMetres;

// The four texels round xz, raw and as the year has them, and the features
// on them: the year's change to the slope (metres per metre), how much loʻi
// stands here, and its terraces down the valley and paddies across it
// (common.glsl.js), run smoothly between texels, and the village's ground.
struct Year { vec2 dGrad; float loi; float tau; float u; float cls; float trod; };
Year yearAt(vec2 xz) {
  Year y;
  y.dGrad = vec2(0.0);
  y.loi = 0.0;
  y.tau = 0.0;
  y.u = 0.0;
  y.cls = 0.0;
  y.trod = 0.0;
  vec2 p = distGrid(xz);
  vec2 fl = floor(p);
  vec2 fr = p - fl;
  ivec2 i0 = ivec2(fl);
  // (most of the ground is neither patched nor a feature's: nothing to lay on
  // it; a raise patch is in the patch map alone, its strongest in g)
  vec4 a0 = texelFetch(uDistAux, i0, 0);
  vec4 a1 = texelFetch(uDistAux, i0 + ivec2(1, 0), 0);
  vec4 a2 = texelFetch(uDistAux, i0 + ivec2(0, 1), 0);
  vec4 a3 = texelFetch(uDistAux, i0 + ivec2(1, 1), 0);
  float any = max(max(a0.r + a0.a, a1.r + a1.a), max(a2.r + a2.a, a3.r + a3.a));
  if (any <= 0.0 && vMetres < uDistRaiseTop + 0.5) any = distPatchAt(i0).g + distPatchAt(i0 + ivec2(1, 0)).g + distPatchAt(i0 + ivec2(0, 1)).g + distPatchAt(i0 + ivec2(1, 1)).g;
  if (any <= 0.0) return y;
  vec2 texel = (uDistRect.zw - uDistRect.xy) / vec2(textureSize(uDistH, 0)) * 100.0; // metres
  float d[4];
  vec4 loi;
  vec4 tau;
  vec4 u;
  vec4 trod;
  vec4 cls;
  for (int k = 0; k < 4; k++) {
    ivec2 q = i0 + ivec2(k & 1, k >> 1);
    vec4 a = texelFetch(uDistAux, q, 0);
    int f = int(a.a * 255.0 + 0.5);
    vec2 cu = texelFetch(uDistCarve, q, 0).rg;
    // (against the heights the normal map was made on: today's, but for a
    // dug channel it has filled or an islet it has sunk, whose offset the
    // carve keeps off the loʻi; district-decode.js)
    float raw = texelFetch(uDistH, q, 0).r;
    if (a.r > 0.0 && (f == 0 || f >= DIST_POND)) raw += cu.y;
    d[k] = distTexel(q) - raw;
    loi[k] = f > 0 && f < DIST_POND ? a.g * featK(f) : 0.0;
    cls[k] = floor(a.b * 255.0 + 0.5);
    tau[k] = cu.x;
    u[k] = cu.y;
    trod[k] = f >= DIST_OTHER ? a.g * featK(f) : 0.0;
  }
  vec4 bw = vec4((1.0 - fr.x) * (1.0 - fr.y), fr.x * (1.0 - fr.y), (1.0 - fr.x) * fr.y, fr.x * fr.y);
  y.dGrad = vec2(mix(d[1] - d[0], d[3] - d[2], fr.y) / texel.x, mix(d[2] - d[0], d[3] - d[1], fr.x) / texel.y);
  y.loi = dot(bw, loi);
  y.trod = dot(bw, trod);
  // (only from texels that are loʻi, so the coordinates don't sag to 0 at the
  // edge, and of the nearest one's step, since tau counts terraces of that
  // step; tau unwrapped round the nearest: it is kept modulo 64)
  vec4 near = texelFetch(uDistAux, ivec2(p + 0.5), 0);
  y.cls = floor(near.b * 255.0 + 0.5);
  vec4 inL = step(vec4(0.001), loi) * (vec4(1.0) - step(vec4(0.5), abs(cls - y.cls))) * bw;
  float sw = max(dot(inL, vec4(1.0)), 1e-4);
  float tRef = texelFetch(uDistCarve, ivec2(p + 0.5), 0).r;
  vec4 tu = tau + 64.0 * floor((vec4(tRef) - tau) / 64.0 + 0.5);
  y.tau = dot(inL, tu) / sw;
  y.u = dot(inL, u) / sw;
  return y;
}

void main() {
  vec2 xz = vWorld.xz;
  if (edgeDist(uDistRect, xz) < 0.0) discard;
  float w = distWeight(xz);
  float kP = uParSlot >= 0 ? slotWeight(uParSlot, xz) : 0.0;
  vec2 uvA = rectUv(uArchRect, xz);
  vec2 uvP = rectUv(uParRect, xz);
  vec2 uvD = rectUv(uDistRect, xz);
  // the island's maps as the island draws them, the district's over them by its weight
  vec4 ntI = mix(texture(uArchN, uvA), texture(uParN, uvP), kP);
  vec4 lA = texture(uArchL, uvA);
  vec4 lI = mix(lA, texture(uParL, uvP), kP);
  if (uParRain < 0.5) lI.r = lA.r;
  vec4 ntD = texture(uDistN, uvD);
  vec4 lD = texture(uDistL, uvD);
  // (the beach of the year: the lower patches' old shore while theirs, by the
  // weight of the patches that texel's beach belongs to)
  if (abs(lD.a - lD.g) > 0.002) lD.g = mix(lD.g, lD.a, uDistLower[int(distPatchAt(ivec2(distGrid(xz) + 0.5)).r * 255.0 + 0.5)].x);
  vec4 nt = mix(ntI, ntD, w);
  vec4 land = mix(lI, lD, w);

  vec2 dX = dFdx(xz);
  vec2 dY = dFdy(xz);
  float px = length(abs(dX) + abs(dY));
  float fwM = fwidth(vMetres);

  vec3 n0 = nt.xyz * 2.0 - 1.0;
  vec2 grad = -n0.xz / (max(n0.y, 0.03) * NORMAL_E);
  // what the year has done to the slope, while a texel is wider than a pixel
  // or so (finer, it would only sparkle, and the paddies average out to the
  // valley's own slope anyway)
  Year y = yearAt(xz);
  float texelW = (uDistRect.z - uDistRect.x) / float(textureSize(uDistH, 0).x);
  float fine = w * (1.0 - smoothstep(0.6, 1.6, px / texelW));
  grad += y.dGrad * fine;
  vec3 n = normalize(vec3(-grad.x * uExag, 1.0, -grad.y * uExag));
  vec3 nC = normalize(vec3(-grad.x * NEAR_E, 1.0, -grad.y * NEAR_E));
  float ao = mix(1.0, nt.a, 0.85);
  float metres = vMetres;

  // (and the farmed band gives way to forest lower down at the wet valley head, as the trees do)
  vec3 col = groundAlbedo(xz, metres, land.r, land.g, land.b, nC, px, fwM, w);

  // the village: trodden ground between the houses
  float trod = y.trod * w;
  col = mix(col, srgb(vec3(0.55, 0.45, 0.33)) * (0.85 + 0.3 * vnoiseF(xz * 30.0, px * 30.0)), trod * 0.45);

  // what grows in the year, by class: the island's fields, on the district's ground
  float cropWater = 0.0;
#ifdef CROPS
  if (uDistCropOn > 0.5) {
    col = applyCrops(col, uDistCrop, uDistCropRect, xz, dX, dY, px, metres, 1.0 - nC.y, length(grad), fwM, land.r, land.g, land.b);
    cropWater = gCropWater * (1.0 - trod);
  }
#endif

  // --- the loʻi ------------------------------------------------------------
  // A paddy is a terrace (whole tau) and a column across the valley (whole
  // u); the banks (kuāuna) are where either turns over, a couple of metres of
  // grassy earth, the terrace's riser among them. Each paddy at its own stage:
  // most under taro from fresh huli to a full canopy, some just flooded and
  // bare, a few fallow. The tread is cut level, so it is lit level.
  float loi = y.loi * w;
  float waterK = 0.0;
  // (the loʻi under this texel: rice where the one standing in the year names it)
  int fNear = int(texelFetch(uDistAux, ivec2(distGrid(xz) + 0.5), 0).a * 255.0 + 0.5);
  bool rice = fNear > 0 && fNear < DIST_POND && uFeatCrop[fNear >> 2][fNear & 3] > 1.5;
  if (loi > 0.002) {
    float h = hash12(vec2(floor(y.tau) + y.cls * 64.0 + 0.5, floor(y.u) + 11.3));
    float fallow = step(h, 0.07);
    // (most under taro at some stage; one in seven just flooded and bare)
    float age = fract(h * 7.31 + 0.13);
    float bare = step(fract(h * 3.7 + 0.4), 0.14);
    float grow = smoothstep(0.0, 0.8, age);
    float cover = mix(0.4 + 0.57 * grow, 0.04, bare) * (1.0 - fallow);
    // the planting rows, a faint stripe while they are a few pixels apart
    float rows = 0.5 + 0.5 * sin(dot(xz, vec2(0.8, 0.6)) * 380.0);
    cover = mix(cover, cover * (0.8 + 0.3 * rows), 1.0 - smoothstep(0.004, 0.01, px));
    vec3 leafC = mix(srgb(vec3(0.30, 0.46, 0.17)), srgb(vec3(0.40, 0.56, 0.22)), fract(h * 13.7));
    leafC = mix(srgb(vec3(0.42, 0.50, 0.22)), leafC, grow);
    vec3 fallowC = srgb(vec3(0.50, 0.50, 0.30)) * (0.85 + 0.3 * vnoiseF(xz * 60.0, px * 60.0));
    vec3 mud = srgb(vec3(0.33, 0.30, 0.20));
    vec3 paddyC = mix(mix(mud, leafC, cover), fallowC, fallow);
    if (rice) {
      // rice in the terraces: a lighter green, a field at a time seedlings in
      // standing water, grown, gone gold, or cut to stubble; never fallow
      float st = fract(h * 5.13 + 0.21);
      vec3 green = mix(srgb(vec3(0.50, 0.64, 0.27)), srgb(vec3(0.58, 0.70, 0.31)), fract(h * 11.3));
      fallow = 0.0;
      cover = st < 0.25 ? 0.25 : st < 0.7 ? 0.9 : 1.0;
      cover = mix(cover, cover * (0.85 + 0.2 * rows), 1.0 - smoothstep(0.004, 0.01, px));
      paddyC = st < 0.25 ? mix(srgb(vec3(0.34, 0.34, 0.24)), green, cover) : st < 0.7 ? green * (0.92 + 0.12 * rows) : st < 0.9 ? srgb(vec3(0.70, 0.64, 0.35)) : srgb(vec3(0.58, 0.52, 0.36));
    }
    // the banks, antialiased, thinning to nothing as they get finer than a pixel
    float aaT = fwidth(y.tau);
    float aaU = fwidth(y.u);
    float dT = min(fract(y.tau), 1.0 - fract(y.tau));
    float dU = min(fract(y.u), 1.0 - fract(y.u));
    // (a rice field's bunds narrower than taro's banks)
    float wT = rice ? 0.05 : 0.07;
    float wU = (rice ? 0.9 : 1.3) / 29.0;
    float bankT = (1.0 - smoothstep(wT - aaT, wT + aaT, dT)) * (1.0 - smoothstep(0.12, 0.35, aaT));
    float bankU = (1.0 - smoothstep(wU - aaU, wU + aaU, dU)) * (1.0 - smoothstep(0.08, 0.25, aaU));
    float bank = max(bankT, bankU * 0.85);
    vec3 bankC = (rice ? srgb(vec3(0.50, 0.50, 0.32)) : srgb(vec3(0.38, 0.47, 0.22))) * (0.9 + 0.2 * h);
    col = mix(col, mix(paddyC, bankC, bank), loi);
    // what is left of the paddy is open water, lit as water below
    waterK = loi * (1.0 - bank) * (1.0 - fallow) * (1.0 - cover);
    // a tread lies level; a riser keeps the ground's fall and darkens on its shaded side
    vec2 g2 = mix(grad, vec2(0.0), y.loi * w * (1.0 - bankT));
    g2 += grad * bankT * y.loi * w * 1.5;
    n = normalize(vec3(-g2.x * uExag, 1.0, -g2.y * uExag));
  }
  // (the fields' paddies outside the loʻi of the features)
  waterK = max(waterK, cropWater * (1.0 - loi));

  // shadows: the island's map under the district's, by its weight
  float vis = mix(texture(uParS, uvP).r, texture(uDistS, uvD).r, w);
  vec3 lit = shade(col, n, vWorld, ao, vis);
  if (waterK > 0.0) {
    // open water: the sky in it over muddy brown-green, and the sun's glint
    vec3 V = normalize(cameraPosition - vWorld);
    vec2 rp = xz * 220.0 + vec2(uTime * 0.6, uTime * 0.4);
    vec3 N = normalize(vec3((vnoiseF(rp, px * 220.0) - 0.5) * 0.08, 1.0, (vnoiseF(rp + 13.0, px * 220.0) - 0.5) * 0.08));
    float F = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
    vec3 R = reflect(-V, N);
    R.y = abs(R.y);
    vec3 water = vec3(0.09, 0.085, 0.05) * (uSkyColor + uSunColor * max(uSunDir.y, 0.0) * vis);
    water = mix(water, skyMap(R), F * 0.8);
    vec3 H = normalize(uSunDir + V);
    water += uSunColor * pow(max(dot(N, H), 0.0), 300.0) * 4.0 * vis;
    lit = mix(lit, water, waterK);
  }
  if (uDebug == 1) lit = col * 2.0;
  if (uDebug == 2) lit = n * 0.5 + 0.5;
  if (uDebug == 3) lit = vec3(ao);
  if (uDebug == 4) lit = vec3(land.r, land.g, land.b);
  if (uDebug == 5) lit = mix(vec3(0.9, 0.3, 0.1), vec3(0.2, 0.9, 0.3), w);
  if (uDebug == 7) lit = vec3(loi, fract(y.u), trod);
  gl_FragColor = vec4(lit, 1.0);
}
`,vy=`
${Ne}
${Ye}
${Fs}
uniform vec3 uSunDir;
uniform float uStep;
uniform float uTop;
in vec2 vUv;
float rawMetres(vec2 xz) {
  float w = distWeight(xz);
  float m = w < 1.0 ? islandMetres(xz) : 0.0;
  return w > 0.0 ? mix(m, rectMetres(uDistH, uDistRect, xz), w) : m;
}
void main() {
  vec2 xz = uDistRect.xy + vUv * (uDistRect.zw - uDistRect.xy);
  float h0 = max(rawMetres(xz), 0.0) * uVert + uStep * 0.02;
  vec2 d = normalize(uSunDir.xz + 1e-6);
  float rise = uSunDir.y / max(length(uSunDir.xz), 1e-4);
  float lit = 1.0;
  float t = uStep * 0.7;
  for (int i = 0; i < 56; i++) {
    vec2 p = xz + d * t;
    float ray = h0 + t * rise;
    float g = max(rawMetres(p), 0.0) * uVert;
    lit = min(lit, 10.0 * (ray - g) / t + 0.5);
    if (lit <= 0.0 || ray > uTop) break;
    t = t * 1.085 + uStep * 0.35;
  }
  float s = clamp(lit, 0.0, 1.0);
  s = s * s * (3.0 - 2.0 * s);
  s *= smoothstep(-0.02, 0.04, uSunDir.y);
  gl_FragColor = vec4(s, s, s, 1.0);
}
`,we=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)};function wy(o,t,e){const n=t*e,s=new Uint8Array(n),i=new Int32Array(n).fill(-1),a=new Int32Array(n),r=new Float32Array(n);let c=0;const l=new Int32Array(n);let h=0;const u=v=>{let w=h++;const b=r[v];for(;w>0;){const y=w-1>>1;if(r[l[y]]<=b)break;l[w]=l[y],w=y}l[w]=v},f=()=>{const v=l[0],w=l[--h],b=r[w];let y=0;for(;;){let S=2*y+1;if(S>=h||(S+1<h&&r[l[S+1]]<r[l[S]]&&S++,r[l[S]]>=b))break;l[y]=l[S],y=S}return l[y]=w,v},d=new Int32Array(n);let m=0,x=0;for(let v=0;v<n;v++)o[v]<=0&&(s[v]=1);const g=[-1,1,0,0,-1,1,-1,1],p=[0,0,-1,1,-1,-1,1,1];for(let v=0;v<e;v++)for(let w=0;w<t;w++){const b=v*t+w;if(s[b])continue;let y=w===0||v===0||w===t-1||v===e-1,S=-1;for(let E=0;E<8&&!y;E++){const T=w+g[E],M=(v+p[E])*t+T;o[M]<=0&&(y=!0,S=M)}y&&(s[b]=1,i[b]=S,r[b]=o[b],u(b))}for(;h||m<x;){const v=m<x?d[m++]:f();a[c++]=v;const w=r[v],b=v%t,y=(v-b)/t;for(let S=0;S<8;S++){const E=b+g[S],T=y+p[S];if(E<0||T<0||E>=t||T>=e)continue;const _=T*t+E;s[_]||(s[_]=1,i[_]=v,o[_]<=w?(r[_]=w,d[x++]=_):(r[_]=o[_],u(_)))}m===x&&(m=x=0)}return{rec:i,order:a.subarray(0,c)}}function yy(o,t,e,n){const s=new Float32Array(t*e),{rec:i,order:a}=o;for(let r=0;r<a.length;r++)s[a[r]]=n;for(let r=a.length-1;r>=0;r--){const c=a[r],l=i[c];l>=0&&s[l]>0&&(s[l]+=s[c])}return s}function My(o,t,e,n,s,i,a=.14){var g;const r=e*n,{rec:c}=o,l=new Uint8Array(r);for(let p=0;p<r;p++)t[p]>=s&&(l[p]=1);const h=new Uint8Array(r);for(let p=0;p<r;p++)l[p]&&c[p]>=0&&l[c[p]]&&(h[c[p]]=1);const u=new Uint8Array(r),f=[];for(let p=0;p<r;p++)l[p]&&!h[p]&&f.push(p);const d=new Float32Array(f.length);f.forEach((p,v)=>{let w=0;for(let b=p;b>=0&&l[b]&&w<1e6;b=c[b])w++;d[v]=w});const m=f.map((p,v)=>v).sort((p,v)=>d[v]-d[p]),x=[];for(const p of m){const v=[];let w=f[p];for(;w>=0&&l[w];){const y=w%e,S=(w-y)/e,[E,T]=i(y+.5,S+.5);if(v.push([E,T,t[w]]),u[w])break;u[w]=1,w=c[w]}if(w>=0&&!l[w]){const y=w%e,S=(w-y)/e,[E,T]=i(y+.5,S+.5);v.push([E,T,((g=v.at(-1))==null?void 0:g[2])??s])}if(v.length<3)continue;const b=by(_y(v,3),a);if(!(b.length<2)){x.push(b.length);for(const y of b)x.push(y[0],y[1],y[2])}}return new Float32Array(x)}function _y(o,t){const e=o.length,n=o.map(s=>s.slice());for(let s=1;s<e-1;s++){let i=0,a=0,r=0;const c=Math.min(t,s,e-1-s);for(let l=-c;l<=c;l++)i+=o[s+l][0],a+=o[s+l][1],r++;n[s][0]=i/r,n[s][1]=a/r}return n}function by(o,t){const e=[o[0]];let n=0;for(let i=0;i+1<o.length;i++){const a=o[i],r=o[i+1],c=Math.hypot(r[0]-a[0],r[1]-a[1]);let l=t-n;for(;l<c;){const h=l/c;e.push([a[0]+(r[0]-a[0])*h,a[1]+(r[1]-a[1])*h,a[2]+(r[2]-a[2])*h]),l+=t}n=c-(l-t)}const s=o[o.length-1];return Math.hypot(s[0]-e.at(-1)[0],s[1]-e.at(-1)[1])>t*.3&&e.push(s),e}function Sy(o,t,e,n,s){const i=[];let a=1/0,r=-1/0;for(const h of n)for(let u=0;u+1<h.length;u++){const[f,d]=h[u],[m,x]=h[u+1];d!==x&&(i.push(d<x?[d,f,x,m]:[x,m,d,f]),a=Math.min(a,d,x),r=Math.max(r,d,x))}if(!i.length)return 0;const c=[];let l=0;for(let h=Math.max(0,Math.floor(a));h<=Math.min(e-1,Math.ceil(r));h++){const u=h+.5;c.length=0;for(const f of i)f[0]<=u&&f[2]>u&&c.push(f[1]+(u-f[0])/(f[2]-f[0])*(f[3]-f[1]));c.sort((f,d)=>f-d);for(let f=0;f+1<c.length;f+=2){const d=Math.max(0,Math.ceil(c[f]-.5)),m=Math.min(t-1,Math.floor(c[f+1]-.5));for(let x=d;x<=m;x++)o[h*t+x]=s,l++}}return l}function Wa(o,t){let e=o*.1031%1,n=t*.1031%1;e<0&&(e+=1),n<0&&(n+=1);let s=e;const i=e*(n+33.33)+n*(s+33.33)+s*(e+33.33);e+=i,n+=i,s+=i;const a=(e+n)*s%1;return a<0?a+1:a}function pl(o,t){const e=Math.floor(o),n=Math.floor(t),s=o-e,i=t-n,a=s*s*(3-2*s),r=i*i*(3-2*i),c=Wa(e,n),l=Wa(e+1,n),h=Wa(e,n+1),u=Wa(e+1,n+1);return c+(l-c)*a+(h-c+(c-l+u-h)*a)*r}function ye(o,t=0,e=0){let n=Math.imul(o|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e|0,2246822519);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const cp=new Float32Array(1),Ey=new Uint32Array(cp.buffer);function $o(o){cp[0]=o;const t=Ey[0],e=t>>>16&32768;let n=(t>>>23&255)-127+15;const s=t&8388607;return n<=0?e:n>=31?e|31744:e|n<<10|s>>>13}function Xr(o){const t=o>>>10&31,e=o&1023,n=o&32768?-1:1;return t===0?n*e*5960464477539063e-23:t===31?e?NaN:n*(1/0):n*(1+e/1024)*2**(t-15)}const Ay=28,$l=.5625,Pc=[22,36],zu=3.5,Iu=2.6,Ty=32,Cy=.45,kc=[7,16];function Ry({index:o,seed:t=o,inside:e,box:n,m:s,hs:i,cls:a,chanDist:r,aux:c,carve:l,W:h,mx:u,mz:f}){const{x0:d,y0:m,x1:x,y1:g}=n,p=x-d+1,v=g-m+1,w=vn(p,v,y=>!e[(m+Math.floor(y/p))*h+d+y%p],u,f),b=new Set;for(let y=m;y<=g;y++)for(let S=d;S<=x;S++){const E=y*h+S;if(!e[E]||s[E]<=.3)continue;const T=S*u,_=y*f,M=(pl(T/140+t*7.1,_/140)-.5)*24,A=we(0,Ty,w[(y-m)*p+(S-d)]+M),R=we(kc[0],kc[1],r[E]);if(A*R<.02)continue;const k=a[E],C=$l*2**k,z=i[E]/C,I=$o(z-64*Math.floor(z/64)),O=lp(s[E],Xr(I),k),U=Math.round(O/C-.5),V=O-s[E],B=V<0?we(zu+1,zu,-V):we(Iu+1,Iu,V),q=A*R*B;if(q<.02)continue;const it=(r[E]-kc[0])/Ly(U,k,t)+ye(t,U,k*7+2);b.add((k*4096+U)*4096+Math.floor(it)),c[E*4+1]=Math.round(255*q),c[E*4+2]=k,c[E*4+3]=o,l[E*2]=I,l[E*2+1]=$o(it)}return b.size}function Ly(o,t,e){return Pc[0]+(Pc[1]-Pc[0])*ye(e,o,t*7+1)}function Py(o,t,e,n){let s=1/0,i=1/0,a=-1/0,r=-1/0;for(const c of o)for(const[l,h]of c)s=Math.min(s,l),i=Math.min(i,h),a=Math.max(a,l),r=Math.max(r,h);return{x0:Math.max(0,Math.floor(s)-n),y0:Math.max(0,Math.floor(i)-n),x1:Math.min(t-1,Math.ceil(a)+n),y1:Math.min(e-1,Math.ceil(r)+n)}}function lp(o,t,e){const n=$l*2**e,s=t+64*Math.floor((o/n-t)/64+.5);return(Math.floor(s)+.5)*n}const Fu=.346,Uu=.387,Nu=.436,Ou=.575,Bu=.702,eo=["ohia","ohiaKrumm","koa","kukui","ohiaai","hau","hala","wiliwili","lama","aalii","niu","milo"],Jt=Object.fromEntries(eo.map((o,t)=>[o,t])),ko={ohiaDry:[1.48,1.41,1.8],ohiaWet:[.72,.75,.7],olapa:[1.32,1.46,1.17]},Ha=9;function ky(o,t){let e=0;for(let s=0;s<t.length;s++)t[s]>0&&(e+=t[s]);if(e<=0)return-1;o*=e;let n=-1;for(let s=0;s<t.length;s++)if(!(t[s]<=0)&&(n=s,(o-=t[s])<0))return s;return n}function Dy({W:o,H:t,mx:e,mz:n,m:s,m1795:i,rain:a,normals:r,rip:c,tpi:l,chanDist:h,clear:u,patch:f,shore:d,toWorld:m,step:x}){const g=eo.map(()=>[]),p=new Int32Array(eo.length),v=new Float32Array(eo.length),w=Math.floor(o*e/x),b=Math.floor(t*n/x);for(let y=0;y<b;y++)for(let S=0;S<w;S++){const E=(S+ye(S,y,11))*x,T=(y+ye(S,y,12))*x,_=Math.min(o-1,Math.floor(E/e)),M=Math.min(t-1,Math.floor(T/n)),A=M*o+_;if(f[A]>0||s[A]<1.2||i[A]<1.2||h[A]<9)continue;const R=s[A],k=a[A]/255+(ye(S,y,3)-.5)*.1,C=a[A]/255,z=r[A*4+1]/255*2-1,I=1-we(.55,.75,z),O=R-Cr(l,_,M,4),U=Cr(c,_,M,4),V=Math.max(we(.1,.3,U),we(12,30,-O)),B=we(10,30,O)*(1-we(.05,.2,U)),q=we(.94,.97,z)*we(.25,.5,U),it=C-(.22+43e-5*R),Y=we(.5,.6,C),nt=1-we(420-250*Y,760-430*Y,R+(ye(S,y,20)-.5)*120),rt=we(.42,.6,pl(E/210+13.1,T/210+7.7)),ut=we(.6,.7,pl(E/190+41.3,T/190+3.9)),xt=1-we(14,40,h[A]),At=R<670&&C>Fu?(1-we(450,670,R))*(1-we(Bu-.04,Bu+.02,C)):0,Rt=R<610?1:0,wt=R<550&&k>Nu?q>.5?.8+4*ut:.1+6*ut:0,kt=Math.max(we(0,20,O),we(300,420,R));v.fill(0);let $=0,le=1,Tt=null;if(d.a[(M>>1)*d.w+(_>>1)]<70&&R<8)$=.3,v[Jt.niu]=50,v[Jt.hala]=30,v[Jt.milo]=15;else if(k<Uu&&it<.04&&R<300)$=.04+.32*V+.22*I,v[Jt.aalii]=35,v[Jt.wiliwili]=C<Uu-.02?25:8,v[Jt.lama]=25,v[Jt.ohia]=12,Tt=ko.ohiaDry;else if(nt>ye(S,y,22))if(q>.5)$=.45,v[Jt.ohiaai]=40*wt,v[Jt.hau]=70*xt,v[Jt.kukui]=20*At*(1-.9*ut),v[Jt.hala]=5*Rt;else if(V>.4||I>.4)$=.85,v[Jt.kukui]=70*At*(.25+.75*rt)*(1-.9*ut),v[Jt.hala]=14*Rt*(1-.7*ut),v[Jt.ohiaai]=10*wt,v[Jt.hau]=60*xt*(R<450?1:0),v[Jt.lama]=12*(k<Nu&&it<0?1:0),v[Jt.ohia]=(5+45*(1-At)*(k>Fu?1:0))*(R>150?kt:0),v[Jt.ohiaKrumm]=10*(1-At)*(k>=Ou?1:0)*I;else{const F=we(460,640,R);$=.25+.55*F,B>.5?(v[Jt.ohia]=60*(R>150?1:0),v[Jt.koa]=20*(R>250?1:0),v[Jt.hala]=20*Rt*(1-F)):(v[Jt.kukui]=45*At*(.1+.9*rt)*(1-.9*ut),v[Jt.hala]=35*Rt*(1-.7*ut)*(1-.85*F),v[Jt.ohiaai]=10*wt,v[Jt.hau]=60*xt*(R<450?1:0),v[Jt.ohia]=(10+50*F)*(R>150?kt:0),v[Jt.koa]=(10+5*F)*(R>250?1:0))}else k<Ou?($=R<760?.55:.85,v[Jt.ohia]=45,v[Jt.koa]=30*(R>300?1:0),v[Jt.lama]=15,v[Jt.aalii]=5,v[Jt.kukui]=10*At*(V>.5?1:0)):B>.5||I>.5?($=.6,v[Jt.ohiaKrumm]=55,v[Jt.ohia]=45,le=.55+.3*ye(S,y,14)):($=.92,v[Jt.ohia]=80,v[Jt.koa]=10*(z>.8?1:0),v[Jt.ohiaKrumm]=10,Tt=ye(S,y,15)<.12?ko.olapa:ko.ohiaWet);if($<=ye(S,y,5))continue;const Z=ky(ye(S,y,6),v);if(Z<0)continue;const[lt,ft]=m(E/e,T/n),P=.92+.16*ye(S,y,8),L=Z===Jt.ohia&&Tt?Tt:Z===Jt.ohiaKrumm&&Tt===ko.olapa?ko.olapa:[P,P,P];g[Z].push(lt,ft,R-.6,ye(S,y,7)*Math.PI*2,le*(.8+.4*ye(S,y,9)),L[0],L[1],L[2],u[A]),p[Z]++}return{kinds:eo,lists:g.map(y=>new Float32Array(y)),counts:Array.from(p)}}const Yi=-1,jo=.5,Do=16;function jl(o,t,e,n=jo,s=Yi){return t<128?o+(s-o)*(t/127)*e:o+(Math.max(jo,n)-o)*((t-128)/127)*e}function zy({W:o,H:t,lowerMasks:e,lowerOf:n,raises:s,patchMask:i,fill:a,log:r}){const c=o*t;let l=o,h=t,u=-1,f=-1;const d=_=>{const M=_%o,A=(_-M)/o;M<l&&(l=M),M>u&&(u=M),A<h&&(h=A),A>f&&(f=A)};for(let _=0;_<c;_++)if(i[_]||a[_])d(_);else for(const M of s)M[_]&&d(_);if(u<0)return null;l=Math.max(0,l-Do),h=Math.max(0,h-Do),u=Math.min(o-1,u+Do),f=Math.min(t-1,f+Do);const m=u-l+1,x=f-h+1,g=_=>(h+Math.floor(_/m))*o+l+_%m,p=65535,v=new Uint32Array(m*x),w=new Uint16Array(m*x).fill(p);let b=[];for(let _=0;_<m*x;_++){const M=g(_);let A=0;n.forEach((R,k)=>{e[R][M]>=128&&(A|=1<<k)}),A&&(v[_]=A,w[_]=0,b.push(_))}for(let _=1;_<p&&b.length;_++){const M=[];for(const A of b){const R=A%m;for(const k of[R>0?A-1:-1,R<m-1?A+1:-1,A-m,A+m])k<0||k>=m*x||w[k]!==p||_>Do&&!i[g(k)]||(w[k]=_,v[k]=v[A],M.push(k))}b=M}const y=n.reduce((_,M,A)=>_|1<<A,0);for(let _=0;_<m*x;_++)a[g(_)]&&(v[_]=y);const S=[0],E=new Map,T=new Uint8Array(m*x*4);for(let _=0;_<m*x;_++){const M=v[_];if(M){let I=E.get(M);I===void 0&&(S.length<16?I=S.push(M)-1:(I=E.get(y)??S.length-1,r==null||r(`patch map: more than 15 sets of lower patches; ${M.toString(2)} goes with group ${I}`)),E.set(M,I)),T[_*4]=I}const A=g(_);let R=-1,k=0,C=-1,z=0;s.forEach((I,O)=>{const U=I[A];U>k?(C=R,z=k,R=O,k=U):U>z&&(C=O,z=U)}),R>=0&&(T[_*4+1]=k,T[_*4+2]=R&15|(Math.max(0,C)&15)<<4,T[_*4+3]=C>=0?z:0)}return{data:T,x0:l,y0:h,w:m,h:x,groups:S}}function Wu(o,t,e){const n=new Uint8Array(t*e),s=new Int32Array(t*e);let i=0,a=0;const r=c=>{o[c]<=0&&!n[c]&&(n[c]=1,s[a++]=c)};for(let c=0;c<t;c++)r(c),r((e-1)*t+c);for(let c=0;c<e;c++)r(c*t),r(c*t+t-1);for(;i<a;){const c=s[i++],l=c%t,h=(c-l)/t;l>0&&r(c-1),l<t-1&&r(c+1),h>0&&r(c-t),h<e-1&&r(c+t)}return n}function Iy({heightPx:o,rainPx:t,masks:e=[],lower:n=[],raise:s=[],raiseDepth:i=[],W:a,H:r,scale:c,offset:l,mx:h,mz:u,rect:f,features:d,stride:m=4,log:x=()=>{}}){const g=Date.now(),p={};let v=g;const w=Z=>{const lt=Date.now();p[Z]=lt-v,v=lt},b=a*r,y=md(o,a,r,c,l,m),S=t?gd(t,a,r,m):new Uint8Array(b).fill(82),E=new Uint8Array(b);{const Z=Wu(y,a,r);for(let lt=0;lt<b;lt++)y[lt]<=0&&!Z[lt]&&(y[lt]=.3,E[lt]=1)}const T=(f.x1-f.x0)/a,_=(f.z1-f.z0)/r,M=(Z,lt)=>[f.x0+Z*T,f.z0+lt*_];w("decode");const A=[...new Set(n)].map(Z=>e[Z]),R=s.map(Z=>e[Z]),k=new Uint8Array(b);for(const Z of R)for(let lt=0;lt<b;lt++)Z[lt]>k[lt]&&(k[lt]=Z[lt]);const C=new Uint8Array(b);for(const Z of A)for(let lt=0;lt<b;lt++)Z[lt]>=128&&(C[lt]=1);if(A.length){const lt=(L,F)=>{const H=L%a,Q=(L-H)/a;for(let j=-3;j<=3;j++){const et=Q+j;if(!(et<0||et>=r))for(let ot=-3;ot<=3;ot++){const vt=H+ot;if(vt>=0&&vt<a&&F(et*a+vt))return!0}}return!1},ft=[];for(let L=0;L<b;L++)C[L]||y[L]<=0||y[L]>5||lt(L,F=>C[F])&&lt(L,F=>y[F]<=0&&!C[F])&&ft.push(L);for(const L of ft)C[L]=1;const P=new Uint8Array(b);for(let L=0;L<b;L++){if(!E[L]||P[L])continue;const F=[L];P[L]=1;let H=!1;for(let Q=0;Q<F.length;Q++){const j=F[Q];!H&&lt(j,ot=>C[ot]===1)&&(H=!0);const et=j%a;for(const ot of[et>0?j-1:-1,et<a-1?j+1:-1,j-a,j+a])ot>=0&&ot<b&&E[ot]&&!P[ot]&&(P[ot]=1,F.push(ot))}if(H)for(const Q of F)C[Q]=1}}const z=new Uint8Array(b);if(A.length){const lt=H=>y[H]<=0||C[H]===1,ft=vn(a,r,H=>!lt(H),h,u),P=vn(a,r,H=>lt(H)&&ft[H]>45,h,u),L=vn(a,r,H=>C[H]===1,h,u),F=45+1.5*Math.max(h,u);for(let H=0;H<b;H++)y[H]>0||C[H]||P[H]<=F||k[H]>=64||(L[H]<60?C[H]=2:z[H]=1);for(let H=0;H<b;H++)C[H]&&(C[H]=1)}const I=new Uint8Array(b*4),O=Float32Array.from(y);R.forEach((Z,lt)=>{const ft=i[lt]??Yi;for(let P=0;P<b;P++)Z[P]&&(O[P]+=(Math.max(O[P],ft)-O[P])*(Z[P]/255))});let U=null,V=null;{let Z=a,lt=r,ft=-1,P=-1;for(let L=0;L<b;L++){if(!C[L])continue;const F=L%a,H=(L-F)/a;Z=Math.min(Z,F),ft=Math.max(ft,F),lt=Math.min(lt,H),P=Math.max(P,H)}if(ft>=0){Z=Math.max(0,Z-12),lt=Math.max(0,lt-12),ft=Math.min(a-1,ft+12),P=Math.min(r-1,P+12),U={x0:Z,y0:lt,x1:ft,y1:P};const L=ft-Z+1,F=P-lt+1,H=j=>(lt+Math.floor(j/L))*a+Z+j%L,Q=vn(L,F,j=>!C[H(j)]&&y[H(j)]>0,h,u);for(let j=0;j<L*F;j++){const et=H(j);if(!C[et])continue;const ot=we(0,45,Q[j]);I[et*4]=Math.round(127*ot),O[et]+=(Yi-O[et])*ot}}}if(U){const Z=Math.round(15e3/(h*u)),lt=new Uint8Array(b),ft=[];for(let P=0;P<b;P++){const L=P%a,F=(P-L)/a;if(L<U.x0||L>U.x1||F<U.y0||F>U.y1||lt[P]||O[P]<=0)continue;ft.length=0,ft.push(P),lt[P]=1;let H=!1,Q=!1;for(let j=0;j<ft.length;j++){const et=ft[j],ot=et%a,vt=(et-ot)/a;if(ot<=U.x0||vt<=U.y0||ot>=U.x1||vt>=U.y1){Q=!0;continue}for(const St of[et-1,et+1,et-a,et+a])O[St]>0?lt[St]||(lt[St]=1,ft.push(St)):C[St]&&(H=!0);ft.length>Z&&(Q=!0)}if(!(Q||!H)){V||(V=[]);for(const j of ft)C[j]=1,I[j*4]=127,O[j]=Yi,V.push(j)}}}const B=Float32Array.from(y);let q=null;if(A.length){for(let H=0;H<b;H++)z[H]&&(O[H]=jo);const Z=Wu(O,a,r);for(let H=0;H<b;H++)!z[H]&&O[H]<=0&&!Z[H]&&(z[H]=1);const lt=new Float32Array(b),ft=new Float32Array(b);for(let H=0;H<b;H++)z[H]||C[H]||y[H]<=0||(lt[H]=Math.min(y[H],6),ft[H]=1);const P=Math.ceil(30/Math.max(h,u)),L=jn(lt,a,r,P,2),F=jn(ft,a,r,P,2);q=new Float32Array(b);for(let H=0;H<b;H++){if(!z[H])continue;const Q=F[H]>.001?Math.max(jo,Math.min(6,L[H]/F[H]-.2)):jo;q[H]=Q,I[H*4]=255,O[H]=Q,B[H]=Q}}const it=zy({W:a,H:r,lowerMasks:e,lowerOf:n,raises:R,patchMask:C,fill:z,log:x});w("patches");let Y=B;if(V){Y=Float32Array.from(B);for(const Z of V)Y[Z]=Yi}const nt=vd(Y,a,r,h,u,xd(Y,a,r,h,u));w("normals");let rt,ut,xt;{const Z=Ga(B,a,r,2,!0),lt=wy(Z.a,Z.w,Z.h),ft=yy(lt,Z.w,Z.h,4*h*u/1e6);w("routing"),xt=My(lt,ft,Z.w,Z.h,Cy,(F,H)=>M(F*2,H*2)),w("streams"),ut=vn(a,r,F=>{const H=F%a,Q=(F-H)/a;return B[F]>0&&ft[(Q>>1)*Z.w+(H>>1)]>=1},h,u);const P=new Float32Array(Z.w*Z.h);for(let F=0;F<P.length;F++)P[F]=Z.a[F]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,ft[F])/.04)/1.6)):0;const L=Ga(P,Z.w,Z.h,2,!1);rt={a:jn(L.a,L.w,L.h,1,2),w:L.w,h:L.h}}w("riparian");const At=new Uint8Array(b*4);let Rt;{const Z=(lt,ft)=>{const P=Ga(lt,a,r,2,!1),L=vn(P.w,P.h,Q=>P.a[Q]<=0,h*2,u*2),F=new Float32Array(P.w*P.h);for(let Q=1;Q<P.h-1;Q++)for(let j=1;j<P.w-1;j++){const et=Q*P.w+j,ot=P.a[et];if(ot<=0||ot>9)continue;const vt=Math.hypot((P.a[et+1]-P.a[et-1])/(4*h),(P.a[et+P.w]-P.a[et-P.w])/(4*u));F[et]=L[et]<70&&vt<.12?1:0}const H={a:jn(F,P.w,P.h,1,1),w:P.w,h:P.h};for(let Q=0;Q<r;Q++)for(let j=0;j<a;j++)At[(Q*a+j)*4+ft]=lt[Q*a+j]>0?Math.round(255*Math.min(1,Cr(H,j,Q,2)*1.5)):0;return{a:L,w:P.w,h:P.h}};Z(B,1),Rt=Z(O,3)}for(let Z=0;Z<r;Z++)for(let lt=0;lt<a;lt++){const ft=Z*a+lt;At[ft*4]=t?S[ft]:y[ft]>0?82:0,At[ft*4+2]=B[ft]>0?Math.round(255*Math.min(1,Cr(rt,lt,Z,4)*1.6)):0}w("sand");const wt=new Uint16Array(b*2);if(q)for(let Z=0;Z<b;Z++)z[Z]&&(wt[Z*2]=$o(q[Z]),wt[Z*2+1]=$o(q[Z]-y[Z]));if(V)for(const Z of V)wt[Z*2+1]=$o(Yi-y[Z]);const kt={},$=new Uint8Array(b);{const Z=jn(y,a,r,3,2),lt=new Uint8Array(b);{const L=new Float32Array(b);for(let H=1;H<r-1;H++)for(let Q=1;Q<a-1;Q++){const j=H*a+Q;L[j]=Math.hypot((Z[j+1]-Z[j-1])/(2*h),(Z[j+a]-Z[j-a])/(2*u))}const F=jn(L,a,r,6,2);for(let H=0;H<b;H++)lt[H]=Math.max(0,Math.min(3,Math.round(Math.log2(Math.max(1e-6,F[H]*Ay/$l)))))}const ft=new Uint8Array(b),P={village:0,loi:1,pond:2};for(const L of[...d].sort((F,H)=>P[F.kind]-P[H.kind])){const F=Py(L.rings,a,r,4);for(let Q=F.y0;Q<=F.y1;Q++)ft.fill(0,Q*a+F.x0,Q*a+F.x1+1);const H=Sy(ft,a,r,L.rings,1);if(H){if(L.kind==="loi")kt[L.index]=(kt[L.index]||0)+Ry({index:L.index,seed:L.seed,inside:ft,box:F,m:y,hs:Z,cls:lt,chanDist:ut,aux:I,carve:wt,W:a,mx:h,mz:u});else{const Q=F.x1-F.x0+1,j=F.y1-F.y0+1,et=vn(Q,j,ot=>!ft[(F.y0+Math.floor(ot/Q))*a+F.x0+ot%Q],h,u);for(let ot=F.y0;ot<=F.y1;ot++)for(let vt=F.x0;vt<=F.x1;vt++){const St=ot*a+vt;ft[St]&&(I[St*4+1]=Math.round(255*we(0,L.kind==="pond"?9:40,et[(ot-F.y0)*Q+(vt-F.x0)])),I[St*4+2]=0,I[St*4+3]=L.index,wt[St*2]=wt[St*2+1]=0)}kt[L.index]=(kt[L.index]||0)+H}for(let Q=F.y0;Q<=F.y1;Q++)for(let j=F.x0;j<=F.x1;j++)ft[Q*a+j]&&($[Q*a+j]=L.index)}}}w("features");let le;{const Z=Fy($,a,r,5),lt=Ga(y,a,r,4,!1),ft={a:jn(lt.a,lt.w,lt.h,2,2),w:lt.w,h:lt.h};le=Dy({W:a,H:r,mx:h,mz:u,m:y,m1795:O,rain:S,normals:nt,rip:rt,tpi:ft,chanDist:ut,clear:Z,patch:C,shore:Rt,toWorld:M,step:25})}w("trees");let Tt=1/0,Dt=-1/0;for(let Z=0;Z<b;Z++)y[Z]<Tt&&(Tt=y[Z]),y[Z]>Dt&&(Dt=y[Z]);return x(`district decoded in ${Date.now()-g} ms: ${JSON.stringify(p)}`),{metres:y,normals:nt,land:At,aux:I,carve:wt,streams:xt,trees:le,counts:kt,lo:Tt,hi:Dt,patchMap:it,ms:Date.now()-g,times:p}}function Ga(o,t,e,n,s){const i=Math.ceil(t/n),a=Math.ceil(e/n),r=new Float32Array(i*a).fill(s?1/0:-1/0);for(let c=0;c<e;c++){const l=Math.floor(c/n)*i;for(let h=0;h<t;h++){const u=l+Math.floor(h/n),f=o[c*t+h];(s?f<r[u]:f>r[u])&&(r[u]=f)}}return{a:r,w:i,h:a}}function Cr(o,t,e,n){const s=Math.min(o.w-1.001,Math.max(0,(t+.5)/n-.5)),i=Math.min(o.h-1.001,Math.max(0,(e+.5)/n-.5)),a=s|0,r=i|0,c=s-a,l=i-r,h=o.a,u=r*o.w+a,f=h[u]+(h[u+1]-h[u])*c,d=h[u+o.w]+(h[u+o.w+1]-h[u+o.w])*c;return f+(d-f)*l}function Fy(o,t,e,n){const s=Uint8Array.from(o);for(let a=0;a<e;a++)for(let r=0;r<t;r++){const c=a*t+r;if(!o[c])for(let l=1;l<=n;l++){const h=r-l>=0&&o[c-l]||r+l<t&&o[c+l];if(h){s[c]=h;break}}}const i=Uint8Array.from(s);for(let a=0;a<e;a++)for(let r=0;r<t;r++){const c=a*t+r;if(!s[c])for(let l=1;l<=n;l++){const h=a-l>=0&&s[c-l*t]||a+l<e&&s[c+l*t];if(h){i[c]=h;break}}}return i}const Dc=24;async function Hu(o){const t=await fetch(o);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}async function Uy(o,t=console.warn){let e;try{e=await Hu(o.abs("districts/manifest.json"))}catch{return[]}const n=[];for(const s of e.districts||[])try{let i={type:"FeatureCollection",features:[]};if(s.features)try{i=await Hu(o.abs(`districts/${s.features}`))}catch(a){t(`districts/${s.features}: ${a.message} (the district is drawn without its features)`)}n.push(By(s,i,o,t))}catch(i){t(`district ${s.id}: ${i.message}`)}return n}function ml(o){return(o==null?void 0:o.kind)==="loi"&&(o.crop==="taro"||o.crop==="rice")?o.crop:null}function Ks(o){return[Number.isFinite(o==null?void 0:o.from)?o.from:-1/0,Number.isFinite(o==null?void 0:o.to)?o.to:1/0]}function Yr(o,t){const[e,n]=Ks(o);return t>=e&&t<n+1}function hp(o,t,e){for(const n of o.members.get(t)||[])if(Yr(n,e))return n;return null}function Ny(o){const t=o.geometry.coordinates[0];let e=1/0,n=1/0,s=-1/0,i=-1/0;for(const[a,r]of t)e=Math.min(e,a),n=Math.min(n,r),s=Math.max(s,a),i=Math.max(i,r);return[e,n,s,i]}function Oy(o,t){const e=Math.max(0,Math.min(o[2],t[2])-Math.max(o[0],t[0])),n=Math.max(0,Math.min(o[3],t[3])-Math.max(o[1],t[1])),s=(o[2]-o[0])*(o[3]-o[1])+(t[2]-t[0])*(t[3]-t[1])-e*n;return s>0?e*n/s:0}function By(o,t,e,n){var k;const i=e.proj.rect(o.bounds),[a,r]=o.size,[c,l,h,u]=o.bounds,f=C=>e.abs(`districts/${C}`),d=([C,z])=>[(C-c)/(h-c)*a,(u-z)/(u-l)*r],m={loi:qn.loi,pond:qn.pond,other:qn.other},x={loi:qn.pond-1,pond:qn.other-1,other:qn.max},g=C=>C.kind==="loi"?"loi":C.kind==="fishpond"?"pond":C.kind==="village"?"other":null,p=(t.features||[]).filter(C=>{var z;return g(C.properties||{})&&((z=C.geometry)==null?void 0:z.type)==="Polygon"}),v=Object.fromEntries(Object.keys(m).map(C=>[C,p.filter(z=>g(z.properties)===C).length>x[C]-m[C]+1])),w=new Map,b=[];for(const C of p){if(g(C.properties)!=="loi")continue;const z=Ny(C),[I,O]=Ks(C.properties),U=B=>{const[q,it]=Ks(B.f.properties);return I<it+1&&q<O+1};let V=b.find(B=>B.some(q=>Oy(q.box,z)>.6)&&!B.some(U));V||b.push(V=[]),V.push({f:C,box:z}),w.set(C,V)}const y=C=>{const z=w.get(C);return(z?z.map(I=>I.f.properties):[C.properties]).map(I=>`${Ks(I).join(" ")} ${ml(I)??""}`).sort().join("|")},S=new Map,E=new Map,T=[],_=new Map,M=new Map,A=[];for(const C of p){const z=C.properties,I=g(z),O=qn[I]+A.filter(q=>g(q.f.properties)===I).length,U=`${I} ${y(C)}`,V=w.get(C);let B=v[I]?S.get(U):E.get(V);if(B===void 0){if(m[I]>x[I]){n(`district ${o.id}: more ${z.kind} features in years of their own than the aux map has room for; ${z.name} is not drawn`);continue}B=m[I]++,v[I]&&S.set(U,B),V&&E.set(V,B)}T.push({index:B,seed:O,kind:I==="other"?z.kind:I,rings:C.geometry.coordinates.map(q=>q.map(d))}),_.has(B)||(_.set(B,C),M.set(B,V?V.map(q=>q.f.properties):[z])),A.push({index:B,f:C})}const R=(o.patches||[]).map(C=>op(C,f,z=>n(`district ${o.id}: ${z}`),o.id)).filter(Boolean);return{id:o.id,name:o.name||o.id,parent:o.parent||o.island,desc:o,bounds:o.bounds,rect:i,W:a,H:r,mx:(i.x1-i.x0)*ho/a,mz:(i.z1-i.z0)*ho/r,heightUrl:f(o.height.file),rainUrl:(k=o.rain)!=null&&k.file?f(o.rain.file):null,scale:o.height.scale??.25,offset:o.height.offset??-6e3,own:R,patches:R,features:t,raster:T,byIndex:_,members:M,rastered:A,sources:o.sources||[]}}function Wy(o,t=[],e=console.warn){const n=[...o.own,...t.filter(a=>a.pack===o.id)],s=n.filter(a=>a.kind==="lower"),i=n.filter(a=>a.kind==="raise");return s.length>Dc&&e(`district ${o.id}: ${s.length} lower patches, ${Dc} drawn`),i.length>rs&&e(`district ${o.id}: ${i.length} raise patches, ${rs} drawn`),[...i.slice(0,rs),...s.slice(0,Dc)]}class Hy{constructor(t=console.warn){this.warn=t,this.jobs=new Map,this.n=0;try{this.worker=new Worker(new URL(""+new URL("district-worker-M-NrOBek.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=e=>this.message(e.data),this.worker.onerror=e=>{var n;(n=e.preventDefault)==null||n.call(e),this.fallback=!0;for(const[s,i]of this.jobs)this.mainThread(s,i)}}catch{this.fallback=!0}}job(t){const e=[],n=a=>{let r=e.findIndex(c=>c.url===a.url);return r<0&&(r=e.push({url:a.url,size:a.size})-1),r},s=t.patches.filter(a=>a.kind==="lower").map(n),i=t.patches.filter(a=>a.kind==="raise");return{heightUrl:t.heightUrl,rainUrl:t.rainUrl,masks:e,lower:s,raise:i.map(n),raiseDepth:i.map(a=>a.depth),W:t.W,H:t.H,scale:t.scale,offset:t.offset,mx:t.mx,mz:t.mz,rect:{x0:t.rect.x0,z0:t.rect.z0,x1:t.rect.x1,z1:t.rect.z1},features:t.raster.map(a=>({index:a.index,seed:a.seed,kind:a.kind,rings:a.rings}))}}decode(t){return new Promise((e,n)=>{const s=++this.n,i={d:t,resolve:e,reject:n};this.jobs.set(s,i),this.fallback?this.mainThread(s,i):this.worker.postMessage({id:s,...this.job(t)})})}message(t){const e=this.jobs.get(t.id);if(e){if(t.log)return this.warn(t.log);this.jobs.delete(t.id),t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,this.jobs.set(t.id,e),this.mainThread(t.id,e)):e.reject(new Error(t.message))}}async mainThread(t,e){try{const n=this.job(e.d),s=await On(n.heightUrl);if(s.W!==n.W||s.H!==n.H)throw new Error(`${n.heightUrl} is ${s.W}×${s.H}, the manifest says ${n.W}×${n.H}`);const i=n.rainUrl?await On(n.rainUrl).then(c=>c.W===n.W&&c.H===n.H?c.px:null).catch(()=>null):null,a=await uy(n,this.warn),r=Iy({...n,heightPx:s.px,rainPx:i,masks:a});this.jobs.delete(t),e.resolve(r)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){var t;(t=this.worker)==null||t.terminate()}}const Ie=d0,Yn=o=>o*ea/100,st={plain:0,thatch:1,stone:2,leaf:3,water:4,kapa:5,wood:6,skin:7,sand:8,clap:9,windows:10,roof:11,masonry:12};class be{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.feat=[],this.featNow=0,this.xf=null,this.stack=[]}at(t,e,n,s=0,i=Ie){this.stack.push(this.xf);const a=Math.cos(s),r=Math.sin(s);return this.xf=c=>[t+(c[0]*a-c[2]*r)*i,e+c[1]*i,n+(c[0]*r+c[2]*a)*i],this}done(){return this.xf=this.stack.pop()||null,this}feature(t){return this.featNow=t,this}tri(t,e,n,s,i=0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const a=e[0]-t[0],r=e[1]-t[1],c=e[2]-t[2],l=n[0]-t[0],h=n[1]-t[1],u=n[2]-t[2];let f=r*u-c*h,d=c*l-a*u,m=a*h-r*l;const x=Math.hypot(f,d,m)||1;f/=x,d/=x,m/=x;for(const g of[t,e,n])this.pos.push(g[0],g[1],g[2]),this.nor.push(f,d,m),this.col.push(s[0],s[1],s[2]),this.mat.push(i),this.feat.push(this.featNow)}quad(t,e,n,s,i,a=0){this.tri(t,e,n,i,a),this.tri(t,n,s,i,a)}hexa(t,e,n,s=0){this.quad(e[0],e[3],e[2],e[1],n,s),this.quad(t[0],t[1],t[2],t[3],n,s);for(let i=0;i<4;i++)this.quad(t[i],e[i],e[(i+1)%4],t[(i+1)%4],n,s)}box(t,e,n,s,i,a,r,c=0,l=0,h=1){const u=Math.cos(l),f=Math.sin(l),d=(b,y,S)=>[t+b*u-S*f,e+y,n+b*f+S*u],m=s/2,x=a/2,g=m*h,p=x*h,v=[d(-m,0,-x),d(m,0,-x),d(m,0,x),d(-m,0,x)],w=[d(-g,i,-p),d(g,i,-p),d(g,i,p),d(-g,i,p)];i<0?this.hexa(w,v,r,c):this.hexa(v,w,r,c)}cyl(t,e,n,s,i,a=0,r=6){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],l=Math.hypot(...c)||1,h=c.map(g=>g/l),u=Math.abs(h[1])<.9?[0,1,0]:[1,0,0];let f=[h[1]*u[2]-h[2]*u[1],h[2]*u[0]-h[0]*u[2],h[0]*u[1]-h[1]*u[0]];const d=Math.hypot(...f);f=f.map(g=>g/d);const m=[h[1]*f[2]-h[2]*f[1],h[2]*f[0]-h[0]*f[2],h[0]*f[1]-h[1]*f[0]],x=(g,p,v)=>{const w=v/r*Math.PI*2,b=Math.cos(w)*p,y=Math.sin(w)*p;return[g[0]+f[0]*b+m[0]*y,g[1]+f[1]*b+m[1]*y,g[2]+f[2]*b+m[2]*y]};for(let g=0;g<r;g++)this.quad(x(t,n,g),x(t,n,g+1),x(e,s,g+1),x(e,s,g),i,a)}blob(t,e,n,s,i,a,r,c=0,l=0,h=c===st.leaf){const u=(1+Math.sqrt(5))/2,f=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],d=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],m=p=>.85+.3*Math.abs(Math.sin(p*12.9898+l*78.233)*43758.5453%1),x=f.map((p,v)=>{const w=Math.hypot(...p),b=m(v);return[t+p[0]/w*s*b,e+p[1]/w*i*b,n+p[2]/w*a*b]});if(!h){for(const p of d)this.tri(x[p[0]],x[p[1]],x[p[2]],r,c);return}const g=p=>{const v=[(p[0]-t)/(s*s),(p[1]-e)/(i*i),(p[2]-n)/(a*a)],w=Math.hypot(...v)||1;return[v[0]/w,v[1]/w,v[2]/w]};for(const p of d){const v=p.map(b=>x[b]),w=this.xf?v.map(b=>this.xf(b)):v;for(let b=0;b<3;b++)this.pos.push(...w[b]),this.nor.push(...g(v[b])),this.col.push(r[0],r[1],r[2]),this.mat.push(c),this.feat.push(this.featNow)}}wall(t,e,n,s,i=st.stone,a=.7){const r=t.length;if(r<2)return;const c=r>2&&Math.hypot(t[0][0]-t[r-1][0],t[0][2]-t[r-1][2])<1e-9,l=[];for(let x=0;x<r-1;x++){const g=t[x+1][0]-t[x][0],p=t[x+1][2]-t[x][2],v=Math.hypot(g,p)||1;l.push([-p/v,g/v])}const h=t.map((x,g)=>{let p=l[g-1],v=l[g];if(c&&g===0&&(p=l[r-2]),c&&g===r-1&&(v=l[0]),!p)return v;if(!v)return p;const w=p[0]+v[0],b=p[1]+v[1],y=Math.hypot(w,b);if(y<1e-6)return v;const S=1/Math.max(.35,(w*v[0]+b*v[1])/y);return[w/y*S,b/y*S]}),u=e/2,f=e*a/2,d=(x,g,p,v)=>[x[0]+g[0]*p,x[1]+v,x[2]+g[1]*p],m=x=>[d(t[x],h[x],-u,-n*.3),d(t[x],h[x],u,-n*.3),d(t[x],h[x],f,n),d(t[x],h[x],-f,n)];for(let x=0;x<r-1;x++){const[g,p,v,w]=m(x),[b,y,S,E]=m(x+1);this.quad(w,v,S,E,s,i),this.quad(p,y,S,v,s,i),this.quad(b,g,w,E,s,i)}if(!c){const[x,g,p,v]=m(0),[w,b,y,S]=m(r-1);this.quad(x,g,p,v,s,i),this.quad(b,w,S,y,s,i)}}geometry(){const t=new Je;return t.setAttribute("position",new Ue(this.pos,3)),t.setAttribute("normal",new Ue(this.nor,3)),t.setAttribute("color",new Ue(this.col,3)),t.setAttribute("aMat",new Ue(this.mat,1)),t.setAttribute("aFeat",new Ue(this.feat,1)),t.computeBoundingSphere(),t}}function sa(o){const t=o.attributes.position.array,e=o.attributes.normal.array,n=o.attributes.color.array,s=o.attributes.aMat.array,i=new Map,a=[],r=[],c=[],l=[],h=[];for(let f=0;f<s.length;f++){const d=`${t[f*3]},${t[f*3+1]},${t[f*3+2]},${e[f*3]},${e[f*3+1]},${e[f*3+2]},${n[f*3]},${n[f*3+1]},${n[f*3+2]},${s[f]}`;let m=i.get(d);m===void 0&&(m=i.size,i.set(d,m),r.push(t[f*3],t[f*3+1],t[f*3+2]),c.push(e[f*3],e[f*3+1],e[f*3+2]),l.push(n[f*3],n[f*3+1],n[f*3+2]),h.push(s[f])),a.push(m)}const u=new Je;return u.setAttribute("position",new Ue(r,3)),u.setAttribute("normal",new Ue(c,3)),u.setAttribute("color",new Ue(l,3)),u.setAttribute("aMat",new Ue(h,1)),u.setIndex(a),u.computeBoundingSphere(),u}function gt(o,t=0,e=Math.random){const n=new Ht(o),s=1+(e()-.5)*t;return[n.r*s,n.g*s,n.b*s]}const Gy=`
${Ne}
${Ye}
#ifdef CROPS
${Qd}
uniform sampler2D uDistCrop;  // the district's island's crop map, and its rect (overlay/crops.js)
uniform vec4 uDistCropRect;
uniform float uDistCropOn;
// whether a tree at xz gives way to the field it stands in: always in a
// planted field of a crop, but for a few in a pasture, on a lawn and among
// dry fields; never in one lying fallow
float cropClears(vec2 xz) {
  CropCell c = cropCell(xz);
  vec2 cs = cropAt(uDistCrop, uDistCropRect, c.centre, c.pickKf);
  if (c.pick >= cropCover(cs)) return 0.0;
  float keep = abs(cs.x - 6.0) < 0.5 ? 0.25 : cs.x > 7.5 ? 0.15 : cs.x < 0.5 || abs(cs.x - 2.0) < 0.5 ? 0.2 : 0.0;
  return step(keep, cropHash(xz * 37.1 + 5.3));
}
#endif
in float aMat;
in float aFeat;
#ifdef USE_GROW
in vec4 aSpan;               // the years a building stands: in from x to y, out from z to w
in float aStretch;           // its height over its model's (a tower's), for the storeys
out float vFadeOut;          // how far it has gone: the pixels under this are the next one's
#ifdef USE_YIELD
uniform vec4 uYieldRect;     // a district's inner box, where the island's buildings yield to its own (towns.js)
uniform float uYield;        // how far they yield there: the district's weight, once its own are built
#endif
#elif defined(USE_INSTANCING)
in float aClear;
uniform sampler2D uTownClear; // what the town has built in the year (settlements.js)
#endif
uniform float uYearNow;      // the year, eased (settlements.js)
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uShow;         // the district's weight, and the near zoom's
uniform vec4 uFeatK[16];     // (shared) each rastered feature's weight in the year
uniform vec4 uFeatSeen[16];  // whether a feature has stood by the year (its clearing made)
out vec3 vWorld;
out vec3 vNormal;
out vec3 vColor;
out float vMat;
out vec3 vLocal;
out float vFade;
float featV(vec4 a[16], int i) { return a[i >> 2][i & 3]; }
void main() {
  mat4 im = mat4(1.0);
  #ifdef USE_INSTANCING
  im = instanceMatrix;
  #endif
  vec3 p = position;
  mat4 mm = modelMatrix * im;
  vec4 wp = mm * vec4(p, 1.0);
  vec3 origin = (mm * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  // built at the valley's exaggeration; stretched with the ground's as the camera pulls back
  float sy = uExag / NEAR_E;
  wp.y *= sy;
  origin.y *= sy;
  vec3 c = color;
  #ifdef USE_INSTANCING_COLOR
  c *= aMat > 5.5 && aMat < 6.5 ? mix(vec3(1.0), vec3(dot(instanceColor, vec3(0.299, 0.587, 0.114))), 0.25) : instanceColor;
  #endif
  vWorld = wp.xyz;
  vNormal = normalize(mat3(mm) * normal);
  vColor = c;
  vMat = aMat;
  vLocal = p;
  #ifdef USE_GROW
  vLocal.y *= aStretch;
  #endif
  // (whole instances fade together, so a tree never dissolves from one side)
  #ifdef USE_INSTANCING
  float dist = distance(cameraPosition, origin);
  #else
  float dist = distance(cameraPosition, wp.xyz);
  #endif
  float fade = uShow * (1.0 - smoothstep(uFadeNear, uFadeFar, dist));
  int f = int(aFeat + 0.5);
  if (f > 0) fade *= featV(uFeatK, f);
  #ifdef USE_INSTANCING
  #ifdef USE_GROW
  // In by the year, and out by it. A building fading out keeps the pixels
  // above its curve and the one fading in on its lot takes those below the
  // same curve (settlements.js gives the two one window), so they never draw
  // over each other; and an island's building inside a district that is down
  // gives the district's own the pixels it takes, the same way.
  fade *= smoothstep(aSpan.x, aSpan.y, uYearNow);
  float gone = smoothstep(aSpan.z, aSpan.w, uYearNow);
  #ifdef USE_YIELD
  if (edgeDist(uYieldRect, origin.xz) > 0.0) gone = max(gone, uYield);
  #endif
  vFadeOut = gone;
  if (gone >= 0.999) fade = 0.0;
  #else
  int cl = int(aClear + 0.5);
  if (cl > 0) fade *= 1.0 - featV(uFeatSeen, cl);
  // (and a tree stands back from what the town has built round it by the year)
  fade *= 1.0 - smoothstep(0.3, 0.7, texture(uTownClear, rectUv(uDistRect, origin.xz)).r);
  // (and from the fields of the year, where its material has them: overlay/crops.js)
  #ifdef CROPS
  if (uDistCropOn > 0.5) fade *= 1.0 - cropClears(origin.xz);
  #endif
  // and thinner toward the district's edge, as its ground eases into the
  // island's (one tree in so many left out, not every one dissolved; the
  // buildings instead keep their lots inside it, and the island's stand
  // beyond: settlements.js PART)
  float edgeK = smoothstep(uDistInfo.w, uDistInfo.z, edgeDist(uDistRect, origin.xz));
  float pick = fract(sin(dot(origin.xz, vec2(12.9898, 78.233))) * 43758.5453);
  fade *= step(pick, edgeK);
  #endif
  #endif
  vFade = fade;
  gl_Position = fade <= 0.001 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * viewMatrix * wp;
}
`,Vy=`
${Ne}
${Mo}
${Ye}
${Qs}
uniform sampler2D uShadeS;  // the cast shadows of the ground under it (the district's, or an island's)
uniform vec4 uShadeRect;    // and the rect they cover
in vec3 vWorld;
in vec3 vNormal;
in vec3 vColor;
in float vMat;
in vec3 vLocal;
in float vFade;
#ifdef USE_GROW
in float vFadeOut;
#endif
void main() {
  if (vFade <= 0.0) discard;
  // dither in and out instead of popping
  float hd = hash12(gl_FragCoord.xy);
  if (hd >= vFade) discard;
  #ifdef USE_GROW
  if (hd < vFadeOut) discard;
  #endif
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 a = vColor;
  int m = int(vMat + 0.5);
  if (m == 1) {
    float course = fract(vLocal.y * 2.6 + vnoise(vWorld.xz * 400.0) * 0.3);
    a *= 0.78 + 0.32 * smoothstep(0.0, 0.5, course);
  } else if (m == 2) {
    vec2 sp = vWorld.xz * 260.0 + vec2(vWorld.y * 190.0, -vWorld.y * 170.0);
    vec3 v = voronoi(fract(sp / 512.0) * 512.0);
    a *= (0.7 + 0.5 * v.y) * (0.55 + 0.45 * smoothstep(0.0, 0.12, v.z));
  } else if (m == 3) {
    // (the leaves a step darker than the ahupuaʻa app's: seen from a few
    // kilometres, through more air, crowns lit as near ones read as cotton)
    a *= (0.8 + 0.4 * vnoise(vWorld.xz * 600.0 + vLocal.y * 30.0)) * 0.8;
  } else if (m == 6) {
    a *= 0.85 + 0.25 * vnoise(vec2(vLocal.y * 40.0, vWorld.x * 300.0));
  } else if (m >= 9 && abs(n.y) < 0.5) {
    // the town's walls: boards, coursed stone, storeys of windows, each
    // averaged out once it is finer than a pixel or two
    float along = vLocal.x + vLocal.z;
    if (m == 9) a *= 0.93 + 0.08 * vnoise(vec2(along * 0.5, vLocal.y * 2.0));
    else if (m == 12) a *= 0.9 + 0.12 * vnoise(vec2(along * 0.7, vLocal.y * 1.6));
    else if (m == 10) {
      float fy = vLocal.y / 3.6;
      float fl = fract(fy);
      float bay = fract(along / 3.2);
      float w = smoothstep(0.26, 0.34, fl) * (1.0 - smoothstep(0.76, 0.84, fl)) * smoothstep(0.1, 0.2, bay) * (1.0 - smoothstep(0.8, 0.9, bay));
      float aa = 1.0 - smoothstep(0.25, 0.6, fwidth(fy));
      a *= mix(0.84, mix(1.02, 0.52, w), aa);
    }
  } else if (m == 11) {
    // an iron roof's ribs, down the slope
    float r = fract((vLocal.x + vLocal.z) * 0.9);
    float aa = 1.0 - smoothstep(0.3, 0.7, fwidth((vLocal.x + vLocal.z) * 0.9));
    a *= mix(0.94, 0.88 + 0.12 * smoothstep(0.35, 0.5, r), aa);
  }
  vec2 uv = rectUv(uShadeRect, vWorld.xz);
  float vis = texture(uShadeS, uv).r;
  vec3 lit = shade(a, n, vWorld, 1.0, vis);
  // a little wrap and translucency for leaves
  if (m == 3) lit += a * uSunColor * max(dot(-n, uSunDir), 0.0) * 0.25 * vis;
  if (m == 5) lit += a * uSkyColor * 0.15;
  gl_FragColor = vec4(lit, 1.0);
}
`;function Si(o,t,e={}){const[n,s]=e.fade||[60,90];return new _e({vertexShader:Gy,fragmentShader:Vy,vertexColors:!0,side:e.doubleSide?Un:Ps,defines:{...e.grow?{USE_GROW:""}:{},...e.yield?{USE_YIELD:""}:{}},uniforms:{...o.uniforms,uYearNow:{value:0},uTownClear:{value:null},...t,uShadeS:t.uShadeS??t.uDistS??{value:null},uShadeRect:t.uShadeRect??o.uniforms.uDistRect,uFadeNear:{value:n},uFadeFar:{value:s}}})}const qo={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",koa:"#7a4a2a",pondStone:"#8a817a"};function Rr(o,t,e=7,n=4.6,s=5.2,i=!0,a=.6){const r=gt(qo.thatch,.18,t),c=gt(qo.thatchDark,.15,t),l=gt(qo.stone,.15,t);o.box(0,-a,0,e+1.8,.45+a,n+1.8,l,st.stone);const h=.45,u=h+1.05;o.box(0,h,0,e,u-h,n,r,st.thatch);const f=e/2+.35,d=n/2+.45,m=h+s,x=[-f,u-.15,-d],g=[f,u-.15,-d],p=[-f,m,0],v=[f,m,0],w=[-f,u-.15,d],b=[f,u-.15,d];o.quad(x,p,v,g,r,st.thatch),o.quad(b,v,p,w,r,st.thatch),o.quad(g,v,p,x,c,st.thatch),o.quad(w,p,v,b,c,st.thatch);const y=e/2;if(o.tri([-y,u,-n/2],[-y,u,n/2],[-y,m-.2,0],r,st.thatch),o.tri([y,u,n/2],[y,u,-n/2],[y,m-.2,0],r,st.thatch),o.box(0,m-.12,0,e+.9,.35,.55,c,st.thatch),i){const S=[.05,.035,.025];o.box(y+.15,h,0,.3,1.4,.9,S,0)}}function $y(o,t,e=8){const n=gt(qo.koa,.2,t),s=gt("#4a2c18",.2,t),i=e/2;o.box(0,0,0,e*.8,.55,.62,n,st.wood,0,.9),o.box(i*.85,.05,0,e*.2,.6,.4,s,st.wood,0,.5),o.box(-i*.85,.05,0,e*.2,.55,.4,s,st.wood,0,.5);const a=-2.4;for(const r of[-e*.15,e*.15])o.cyl([r,.55,0],[r,.5,a],.06,.06,s,st.wood,4);o.box(0,.05,a,e*.5,.28,.24,s,st.wood,0,.8)}function jy(o,t){const e=gt("#4d4642",.2,t);for(let n=0;n<5;n++)o.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,st.stone,n)}const ur=Math.PI*2,Xo=[[0,1,0]];for(let o=0;o<10;o++){const t=o*Math.PI/5,e=o%2?-1:1;Xo.push([Math.cos(t)*.8944,e*.4472,Math.sin(t)*.8944])}Xo.push([0,-1,0]);const up=[];for(let o=0;o<5;o++){const t=1+2*o,e=t+1,n=1+(2*o+2)%10,s=1+(2*o+3)%10;up.push([0,t,n],[t,e,n],[n,e,s],[11,e,s])}function qy(o,t,e,n,s,i,a,r,c,l=0,h=.1,u=1){const f=(g,p,v)=>{const w=Math.max(0,Math.min(1,(v-g)/(p-g)));return w*w*(3-2*w)},d=Xo.map((g,p)=>{const v=p===0||p===11?1:1-h+2*h*Math.abs(Math.sin(p*12.9898+l*78.233)*43758.5453%1);return[t+g[0]*s*v,e+g[1]*i,n+g[2]*a*v]}),m=Xo.map(g=>{const p=[g[0]/s,g[1]/i,g[2]/a],v=Math.hypot(...p);return[p[0]/v,p[1]/v,p[2]/v]}),x=Xo.map(g=>{const p=u+(1-u)*f(-.8,.3,g[1]);return[r[0]*p,r[1]*p,r[2]*p]});for(const g of up){const[p,v,w]=g.map(T=>d[T]),b=(v[1]-p[1])*(w[2]-p[2])-(v[2]-p[2])*(w[1]-p[1]),y=(v[2]-p[2])*(w[0]-p[0])-(v[0]-p[0])*(w[2]-p[2]),S=(v[0]-p[0])*(w[1]-p[1])-(v[1]-p[1])*(w[0]-p[0]),E=b*(p[0]+v[0]+w[0]-3*t)+y*(p[1]+v[1]+w[1]-3*e)+S*(p[2]+v[2]+w[2]-3*n)>0;for(const T of E?g:[g[0],g[2],g[1]])o.pos.push(d[T][0],d[T][1],d[T][2]),o.nor.push(m[T][0],m[T][1],m[T][2]),o.col.push(x[T][0],x[T][1],x[T][2]),o.mat.push(c),o.feat.push(0)}}function Tn(o,{stick:t,r0:e=.4,r1:n=.25,bark:s="#6a6058",limbs:i=[],crowns:a}){const r=new be,c=gt(s,.1,o);t&&r.cyl([0,0,0],t,e,n,c,st.wood,3);for(const[l,h,u,f]of i)r.cyl(l,h,u,f,c,st.wood,3);for(const[l,h,u,f,d,m,x=st.leaf,g=1,p=1]of a)qy(r,l,h,u,f,d,f,typeof m=="string"?gt(m,.1,o):m,x,g,.1,p);return r.geometry()}function Xy(o){const t=new be,e=gt("#8a7a62",.1,o),n=14;let s=[0,0,0];for(let c=1;c<=4;c++){const l=c/4*n,h=[.06*Math.pow(l,1.5),l,0];t.cyl(s,h,.3-c*.025,.28-c*.03,e,st.wood,5),s=h}const i=s,a=gt("#6E7A3E",.12,o),r=gt("#8f9a43",.1,o);for(let c=0;c<9;c++){const l=c/9*ur+o()*.3,h=5.2+o()*1.2,u=1.4+o()*.8,f=Math.cos(l),d=Math.sin(l);let m=i;for(let x=1;x<=4;x++){const g=x/4,p=[i[0]+f*h*g,i[1]+u*g-3.8*g*g,i[2]+d*h*g],v=1*Math.sin(Math.PI*Math.min(1,g*1.1))+.15,w=-d*v,b=f*v,y=x>2?r:a;t.quad(m,p,[p[0]+w,p[1]-.35*v,p[2]+b],[m[0]+w*.7,m[1]-.25*v,m[2]+b*.7],y,st.leaf),t.quad([m[0]-w*.7,m[1]-.25*v,m[2]-b*.7],[p[0]-w,p[1]-.35*v,p[2]-b],p,m,y,st.leaf),m=p}}return t.geometry()}function Yy(o){const t=[];for(let c=0;c<4;c++){const l=c/4*ur+.3;for(const h of[-1,1])t.push([Math.cos(l+h*.35)*6.2,10.2+(h>0?.4:0),Math.sin(l+h*.35)*6.2])}const e=[[2.6,6.1,.9],[2.1,6.4,-1.6],[-1.9,6.2,1.4],[-2.2,5.9,-1.1]],n=[0,1,2,3,4].map(c=>[Math.cos(c/5*ur)*3.6,3.4,Math.sin(c/5*ur)*3.6]),s="#56603D",i="#66704A",a="#77825A",r=gt("#5C603F",0,o).map(c=>c*.95);return{ohia:Tn(o,{stick:[.3,6.5,.1],bark:"#5A5354",crowns:[[.3,8.6,0,4.6,2.5,r],[2.2,7.7,1,3,1.8,r,st.leaf,2]]}),ohiaKrumm:Tn(o,{crowns:[[.6,2.4,.2,5,1.5,"#596537",st.leaf,1,.75]]}),koa:Tn(o,{stick:[.2,4,-.3],r0:.6,r1:.45,bark:"#5A504B",limbs:[0,2,4,6].map(c=>{const[l,h]=[t[c],t[c+1]];return[[.2,3.8,-.3],[(l[0]+h[0])/2*.9,(l[1]+h[1])/2-.6,(l[2]+h[2])/2*.9],.3,.14]}),crowns:[0,2,4,6].map((c,l)=>{const[h,u]=[t[c],t[c+1]];return[(h[0]+u[0])/2,(h[1]+u[1])/2+.3,(h[2]+u[2])/2,3,1.55,l===1?"#737B5A":"#5E6A3C",st.leaf,l+1]})}),kukui:Tn(o,{stick:[.3,4.2,.1],r0:.45,r1:.35,bark:"#5F5B54",crowns:[[.3,6.5,.1,5.8,3.2,i,st.leaf,1,.62],[.5,8.6,.3,3.4,1.6,a,st.leaf,5,.8],[-2.9,5.6,1.6,2.8,1.9,s,st.leaf,2,.7]]}),ohiaai:Tn(o,{stick:[0,2.4,0],r0:.35,r1:.3,bark:"#8A7458",crowns:[[0,6,0,2.4,3.6,"#3A5026"]]}),hau:Tn(o,{crowns:[[0,2.2,0,5,2.2,"#6E8A3E"]]}),hala:Tn(o,{stick:[.3,3.4,0],r0:.22,r1:.15,bark:"#8E8B82",limbs:[0,2].map(c=>{const[l,h]=e.slice(c,c+2);return[[.3,3.3,0],[(l[0]+h[0])/2,(l[1]+h[1])/2-.45,(l[2]+h[2])/2],.13,.09]}),crowns:e.map((c,l)=>[c[0],c[1]-.35,c[2],1.45,.75,"#55703D",st.leaf,l+1])}),wiliwili:Tn(o,{stick:[.1,2.8,.2],r0:.45,r1:.3,bark:"#9C6C44",limbs:n.map(c=>[[.05,2.5,.2],c,.2,.08]),crowns:[[0,3.9,.2,4.8,1.25,"#788C4A",st.leaf,3,.75]]}),lama:Tn(o,{stick:[.2,3.2,.1],r0:.25,r1:.18,bark:"#3E3A36",crowns:[[.2,5.4,.1,2.6,2,"#4C5E2E"]]}),aalii:Tn(o,{crowns:[[0,1.2,0,1.5,1,"#6F8A4E"]]}),niu:Xy(o),milo:Tn(o,{stick:[.2,2.2,0],r0:.35,r1:.28,bark:"#8A8070",crowns:[[.2,4.6,0,3.6,2.4,"#4A6426"]]})}}const Dn=3,gi=[30,80],Ky=o=>Math.max(gi[0],Math.min(gi[1],o*2)),Gu=24e3;function Zy(o){let t=o>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}class Jy{constructor(t,e,n,s){const i=Zy(5150),a=Yy(i);this.group=new Te,this.rect=e,this.nx=Math.ceil((e.x1-e.x0)/Dn),this.nz=Math.ceil((e.z1-e.z0)/Dn),this.mat=Si(n,s,{fade:[gi[0]-7,gi[0]]}),this.matDS=Si(n,s,{fade:[gi[0]-7,gi[0]],doubleSide:!0}),this.species=[];const r=new ne,c=new hs,l=new W(0,1,0),h=new W,u=new W;this.total=0,eo.forEach((f,d)=>{const m=t.lists[d],x=m.length/Ha,g=new Int32Array(x),p=new Int32Array(this.nx*this.nz);for(let R=0;R<x;R++){const k=Math.min(this.nx-1,Math.max(0,Math.floor((m[R*Ha]-e.x0)/Dn))),C=Math.min(this.nz-1,Math.max(0,Math.floor((m[R*Ha+1]-e.z0)/Dn)));g[R]=C*this.nx+k,p[g[R]]++}const v=new Int32Array(this.nx*this.nz+1);for(let R=0;R<p.length;R++)v[R+1]=v[R]+p[R];const w=v.slice(),b=new Int32Array(x);for(let R=0;R<x;R++)b[w[g[R]]++]=R;for(let R=0;R<p.length;R++)for(let k=v[R+1]-1;k>v[R];k--){const C=v[R]+Math.floor(i()*(k-v[R]+1)),z=b[k];b[k]=b[C],b[C]=z}const y=new Float32Array(x*16),S=new Float32Array(x*3),E=new Float32Array(x);for(let R=0;R<x;R++){const C=b[R]*Ha;c.setFromAxisAngle(l,m[C+3]);const z=Ie*m[C+4];h.set(m[C],Yn(m[C+2]),m[C+1]),u.set(z,z,z),r.compose(h,c,u),r.toArray(y,R*16),S[R*3]=m[C+5],S[R*3+1]=m[C+6],S[R*3+2]=m[C+7],E[R]=m[C+8]}const T=Math.min(x,Gu),_=sa(a[f]),M=new ha(_,f==="niu"||f==="hala"?this.matDS:this.mat,Math.max(1,T));M.name=f,M.count=0,M.frustumCulled=!1,M.instanceMatrix.setUsage(an),M.instanceColor=new he(new Float32Array(Math.max(1,T)*3),3),M.instanceColor.setUsage(an);const A=new he(new Float32Array(Math.max(1,T)),1);A.setUsage(an),_.setAttribute("aClear",A),this.group.add(M),this.species.push({kind:f,mesh:M,aClear:A,start:v,mats:y,cols:S,clear:E,cap:T,n:x}),this.total+=x}),this.frustum=new Is,this.pv=new ne,this.box=new yn,this.key="",this.drawn=0}update(t,e,n,s){if(this.group.visible=e>.001,!this.group.visible)return;const i=Ky(s),a=i*.42;for(const p of[this.mat,this.matDS])p.uniforms.uFadeNear.value=i*.7,p.uniforms.uFadeFar.value=i;const r=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const c=this.rect,l=[],h=Math.max(0,Math.floor((r.x-i-c.x0)/Dn)),u=Math.min(this.nx-1,Math.floor((r.x+i-c.x0)/Dn)),f=Math.max(0,Math.floor((r.z-i-c.z0)/Dn)),d=Math.min(this.nz-1,Math.floor((r.z+i-c.z0)/Dn));for(let p=f;p<=d;p++)for(let v=h;v<=u;v++){const w=c.x0+v*Dn,b=c.z0+p*Dn;this.box.min.set(w,-.5,b),this.box.max.set(w+Dn,n,b+Dn);const y=this.box.distanceToPoint(r);if(y>i||!this.frustum.intersectsBox(this.box))continue;const S=y<a?1:Math.pow(a/y,1.6);l.push(p*this.nx+v,Math.round(S*20))}const m=l.join(",");if(m===this.key)return;this.key=m;let x=0;for(const p of this.species)for(let v=0;v<l.length;v+=2)x+=Math.ceil((p.start[l[v]+1]-p.start[l[v]])*l[v+1]/20);const g=Math.min(1,Gu/Math.max(1,x));this.drawn=0;for(const p of this.species){let v=0;for(let w=0;w<l.length;w+=2){const b=l[w],y=p.start[b],S=p.start[b+1]-y,E=Math.min(Math.ceil(S*l[w+1]*g/20),p.cap-v);E<=0||(p.mesh.instanceMatrix.array.set(p.mats.subarray(y*16,(y+E)*16),v*16),p.mesh.instanceColor.array.set(p.cols.subarray(y*3,(y+E)*3),v*3),p.aClear.array.set(p.clear.subarray(y,y+E),v),v+=E)}p.mesh.count=v,p.mesh.instanceMatrix.needsUpdate=!0,p.mesh.instanceColor.needsUpdate=!0,p.aClear.needsUpdate=!0,p.mesh.visible=v>0,this.drawn+=v}}dispose(){for(const t of this.species)t.mesh.geometry.dispose();this.mat.dispose(),this.matDS.dispose()}}const Qy=`
${Ne}
${Ye}
${Fs}
in vec4 aSeg;   // the segment's ends: ax, az, bx, bz
in vec4 aInfo;  // width at a and at b (world units), distance along at a and at b
in float aEnd;  // the whole line's length
#ifdef USE_SPAN
in vec4 aSpan;  // the years it stands: in from x to y, out from z to w
in float aGrow; // 1: it comes in along its length from x to y
uniform float uYearNow;
uniform vec2 uLod;  // the segments drawn: those whose middle is this near the camera, from x to y (world units)
out vec4 vSpan;
out float vGrow;
#endif
uniform vec3 uCamPos;
uniform float uPxK;    // world units per pixel per unit of distance from the camera
uniform float uMinPx;
uniform float uLift;
out float vSide;
out float vS;
out float vEnd;
out float vGround;
out vec3 vWorld;
void main() {
  #ifdef USE_SPAN
  // (a segment not standing in the year at all is not drawn)
  float yIn = aGrow > 0.5 ? mix(aSpan.x, aSpan.y, clamp(aInfo.z / max(aEnd, 1e-4), 0.0, 1.0)) - 0.6 : aSpan.x;
  if (uYearNow <= yIn || uYearNow >= aSpan.w) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  // (and of a batch drawn at two levels, the fine near the camera and the coarse beyond: works.js)
  float dm = distance(uCamPos.xz, (aSeg.xy + aSeg.zw) * 0.5);
  if (dm < uLod.x || dm >= uLod.y) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vSpan = aSpan;
  vGrow = aGrow;
  #endif
  vec2 a = aSeg.xy;
  vec2 b = aSeg.zw;
  vec2 d = b - a;
  float L = length(d);
  vec2 dir = L > 1e-6 ? d / L : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  vec2 c = atB ? b : a;
  float w = atB ? aInfo.y : aInfo.x;
  vec3 C = vec3(c.x, max(groundMetres(c), 0.0) * uVert, c.y);
  float dist = distance(uCamPos, C);
  w = max(w, uMinPx * dist * uPxK);
  // (half the width either side, and a quarter of it on past each end so the joins close)
  vec2 xz = c + nrm * position.y * w * 0.5 + dir * (atB ? 0.25 : -0.25) * w;
  float g = groundMetres(xz);
  vGround = g;
  vSide = position.y;
  vS = atB ? aInfo.w : aInfo.z;
  vEnd = aEnd;
  vec3 p = vec3(xz.x, max(g, 0.0) * uVert, xz.y);
  p.y += uLift;
  vWorld = p;
  // The ground is drawn by a mesh coarser than the ribbon away from the
  // camera, which can stand metres over a stream's bed: drawn a little toward
  // the eye (as ahupuaʻa draws its ʻauwai), it isn't swallowed, and on the
  // screen it doesn't move.
  vec3 toCam = uCamPos - p;
  float dc = length(toCam);
  p += toCam / max(dc, 1e-3) * min(dc * 0.012, 1.2);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`,tM=`
${Ne}
${Mo}
${Ye}
${Qs}
uniform vec3 uColor;
uniform float uAlpha;
uniform int uMode;    // 0 water, 1 earth, 2 band, 3 paved, 4 stone, 5 rail
uniform float uEndFade; // world units over which a line fades in at its start and out at its end (0: cut square)
uniform float uMarks;   // paved: 1 for a runway's centre line
#ifdef USE_SPAN
uniform float uYearNow;
in vec4 vSpan;
in float vGrow;
#endif
in float vSide;
in float vS;
in float vEnd;
in float vGround;
in vec3 vWorld;
void main() {
  float a = uAlpha;
  if (uEndFade > 0.0) {
    float f = min(uEndFade, vEnd * 0.3);
    a *= smoothstep(0.0, f, vS) * smoothstep(0.0, f, vEnd - vS);
  }
  #ifdef USE_SPAN
  // in by the year (along its length while it is built), and out by it
  float yIn = mix(vSpan.x, vSpan.y, clamp(vS / max(vEnd, 1e-4), 0.0, 1.0));
  a *= (vGrow > 0.5 ? smoothstep(yIn - 0.6, yIn, uYearNow) : smoothstep(vSpan.x, vSpan.y, uYearNow)) * (1.0 - smoothstep(vSpan.z, vSpan.w, uYearNow));
  #endif
  vec3 col;
  float edge = abs(vSide);
  vec3 lit = uSunColor * max(uSunDir.y, 0.0) * 0.8 + uSkyColor;
  if (uMode == 0) {
    // a stream: gone where the ground of the year is the sea's
    a *= smoothstep(0.05, 0.4, vGround) * (1.0 - smoothstep(0.7, 1.0, edge));
    // (a stream from a kilometre up is the sky in it, broken by its riffles)
    vec3 V = normalize(cameraPosition - vWorld);
    float F = 0.04 + 0.96 * pow(1.0 - max(V.y, 0.0), 5.0);
    vec3 water = vec3(0.10, 0.19, 0.21) * (uSkyColor * 1.3 + uSunColor * max(uSunDir.y, 0.0));
    float riffle = vnoise(vec2(vS * 9.0 - uTime * 1.5, vSide * 2.0));
    col = mix(water, skyMap(reflect(-V, vec3(0.0, 1.0, 0.0))), 0.45 + 0.55 * F) * (0.9 + 0.35 * riffle);
  } else if (uMode == 1) {
    // the trail: worn earth, a little uneven along it
    a *= 1.0 - smoothstep(0.55, 1.0, edge);
    float k = 0.85 + 0.3 * vnoise(vec2(vS * 2.3, vSide * 1.7));
    col = uColor * k * (uSunColor * max(uSunDir.y, 0.0) * 0.8 + uSkyColor);
  } else if (uMode == 2) {
    // a front: soft across, a little stronger at its middle
    a *= (1.0 - smoothstep(0.2, 1.0, edge)) * (0.75 + 0.25 * sin(vS * 1.3 + uTime * 0.6));
    col = uColor * (uSunColor * max(uSunDir.y, 0.0) * 0.7 + uSkyColor * 1.1);
  } else if (uMode == 3) {
    // paved: a flat strip, its edges crisp, a little worn along it
    a *= 1.0 - smoothstep(0.86, 1.0, edge);
    float k = 0.93 + 0.1 * vnoise(vec2(vS * 0.9, vSide * 3.0));
    col = uColor * k;
    if (uMarks > 0.5) {
      // a runway's centre line, dashed, once the strip is wide enough on the screen to carry it
      float aa = 1.0 - smoothstep(0.08, 0.2, fwidth(vSide));
      float dash = step(0.4, fract(vS / 0.6));
      col = mix(col, vec3(0.92, 0.91, 0.86), (1.0 - smoothstep(0.035, 0.07, edge)) * dash * aa * 0.85);
    }
    col *= lit;
  } else if (uMode == 4) {
    // stone: a mole of rough rock, mottled
    a *= 1.0 - smoothstep(0.7, 1.0, edge);
    float k = 0.74 + 0.38 * vnoise(vec2(vS * 7.0, vSide * 2.2)) - 0.12 * edge;
    col = uColor * k * lit;
  } else {
    // rail: ballast and the line on it, the ties across it where they are a few pixels apart
    a *= 1.0 - smoothstep(0.55, 1.0, edge);
    float t = vS / 0.024;
    float aa = 1.0 - smoothstep(0.25, 0.5, fwidth(t));
    float tie = step(0.6, fract(t)) * (1.0 - smoothstep(0.75, 0.95, edge));
    col = uColor * (1.0 + 0.9 * tie * aa) * lit;
  }
  if (a <= 0.003) discard;
  gl_FragColor = vec4(col, a);
}
`,eM=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),nM={water:0,earth:1,band:2,paved:3,stone:4,rail:5};class fp{constructor(t,e){this.shared=t,this.camera=e,this.group=new Te,this.batches=[],this._res=new Bt}add(t,e={}){const n=[],s=[],i=[];for(const{pts:a,width:r}of t){let c=0;for(let h=0;h+1<a.length;h++)c+=Math.hypot(a[h+1][0]-a[h][0],a[h+1][1]-a[h][1]);let l=0;for(let h=0;h+1<a.length;h++){const[u,f]=a[h],[d,m]=a[h+1],x=Math.hypot(d-u,m-f);if(x<1e-6)continue;const g=Array.isArray(r)?r[h]:r,p=Array.isArray(r)?r[h+1]:r;n.push(u,f,d,m),s.push(g,p,l,l+x),i.push(c),l+=x}}return n.length?this.addPacked({seg:new Float32Array(n),info:new Float32Array(s),end:new Float32Array(i)},e):null}addPacked({seg:t,info:e,end:n,span:s=null,grow:i=null},{mode:a="earth",colour:r=[1,1,1],alpha:c=1,minPx:l=1,lift:h=.004,order:u=5,endFade:f=0,marks:d=!1,year:m=null}={}){if(!(t!=null&&t.length))return null;const x=new yo;x.setAttribute("position",new de(eM,3)),x.setIndex([0,2,1,1,2,3]),x.setAttribute("aSeg",new he(t,4)),x.setAttribute("aInfo",new he(e,4)),x.setAttribute("aEnd",new he(n,1)),s&&(x.setAttribute("aSpan",new he(s,4)),x.setAttribute("aGrow",new he(i,1))),x.instanceCount=t.length/4;const g={...this.shared.uniforms,uCamPos:{value:new W},uPxK:{value:.001},uMinPx:{value:l},uLift:{value:h},uColor:{value:new Ht(...r)},uAlpha:{value:c},uMode:{value:nM[a]??1},uEndFade:{value:f},uMarks:{value:d?1:0},uYearNow:m||{value:0},uLod:{value:new Bt(0,1e9)}},p=new _e({vertexShader:Qy,fragmentShader:tM,uniforms:g,defines:s?{USE_SPAN:""}:{},transparent:!0,depthWrite:!1,side:Un,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),v=new ge(x,p);v.frustumCulled=!1,v.renderOrder=u,this.group.add(v);const w={mesh:v,uniforms:g,alpha:c,count:x.instanceCount};return this.batches.push(w),w}update(t){t.getDrawingBufferSize(this._res);const e=this.camera,n=2*Math.tan(e.fov*Math.PI/360)/Math.max(1,this._res.y/t.getPixelRatio());for(const s of this.batches)s.uniforms.uCamPos.value.copy(e.position),s.uniforms.uPxK.value=n,s.mesh.visible=s.uniforms.uAlpha.value>.003}dispose(){for(const t of this.batches)t.mesh.geometry.dispose(),t.mesh.material.dispose()}}const gl=8,dn=16,sM={walk:[0,4],run:[4,4],idle:[8,2],engage:[10,4],fall:[14,3]},no=17,Lr=["side","front","back"],fr=["hawaii","oahu","maui"],iM=["bare","kihei","chief"],ql=["spear","club","musket","sling","dagger","rammer","linstock","gun"],Xl={gun:16,sling:16},oM="hHsdetTkKCPmn",aM="gGwWb",Va={o:"#2a201b",h:"#30241e",s:"#a5704b",d:"#7b5035",e:"#2a201b",w:"#97734a",W:"#5b3d27",g:"#8a8e93",G:"#4a4d52",b:"#16110e",c:"#cdb98e",f:"#fff4c4",F:"#f2a03c",S:"#ddd6ca",Z:"#b5ad9f"},rM={hawaii:{m:"#b9791f",n:"#8a5717",kihei:"#d9a548",cloak:"#b03a2c",pattern:"#e3b23e",helmet:"#e3b23e",crest:"#b03a2c"},oahu:{m:"#76609e",n:"#544377",kihei:"#a58fcb",cloak:"#dcb03c",pattern:"#2e2824",helmet:"#2e2824",crest:"#dcb03c"},maui:{m:"#a84b22",n:"#7c3518",kihei:"#cf7f4c",cloak:"#a4342a",pattern:"#2e2824",helmet:"#a4342a",crest:"#2e2824"}};function cM(o,t){const e=rM[o],n={...Va,m:e.m,n:e.n,t:Va.s,T:Va.d,k:Va.s,K:null,C:null,P:null,H:null};return t==="kihei"?(n.k=e.kihei,n.K=e.kihei):t==="chief"&&(n.t=e.cloak,n.T=e.pattern,n.k=e.cloak,n.K=e.cloak,n.C=e.cloak,n.P=e.pattern,n.h=e.helmet,n.H=e.crest),n}function un(o,t=0,e=0){const n={};for(const[s,i]of Object.entries(o)){const a=Number(s)+e;a<0||a>=dn||(n[a]=t>=0?".".repeat(t)+i:i.slice(-t))}return n}function Ms(...o){const t={};for(const e of o)if(e)for(const[n,s]of Object.entries(e)){const i=(t[n]||"").padEnd(s.length,".").split("");for(let a=0;a<s.length;a++)s[a]!=="."&&(i[a]=s[a]);t[n]=i.join("")}return t}const ri=(o,t=null,e=null)=>({body:o,over:t?[t]:[],under:e?[e]:[]}),dp={0:"..HHH...",1:"..hhh...",2:"..hse...",3:"..sss...",4:"...d...."},lM=un(dp,1),pp={5:".Kktt...",6:".Kktt...",7:".KktT...",8:".CkTt..."},hM=un(pp,1),uM={5:".....s..",6:".....s..",7:".....s.."},fM={5:".....s..",6:".....s.."},dM={5:"....ss..",6:"......s."},pM={5:"....s...",6:"...ss..."},mM={1:"....s...",2:".....s..",3:".....s..",4:"....s..."},xi={9:".Cmmn..."},gM={...xi,10:".Cdns...",11:"..d.s...",12:"..d.s...",13:"..d.s...",14:"..ddss.."},xM=[{...xi,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".d...ss."},{...xi,10:".C.dn...",11:"...ds...",12:"...ds...",13:"...dss..",14:"...dd..."},{...xi,10:".Csnd...",11:"..s..d..",12:".s...d..",13:".s...d..",14:".s...dd."},{...xi,10:".C.sn...",11:"...sd...",12:"...sd...",13:"...sdd..",14:"...ss..."}],Oo=un(xi,1),vM=[{...Oo,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:"d.....s.",14:"......ss"},{...Oo,10:"..C.dn..",11:"...dss..",12:"...d..s.",13:"..dd....",14:"........"},{...Oo,10:"..Csnd..",11:"..s...d.",12:".s....d.",13:"s.....d.",14:"......dd"},{...Oo,10:"..C.sn..",11:"...sdd..",12:"...s..d.",13:"..ss....",14:"........"}],wM={...xi,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".dd..ss."},yM={...Oo,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:".d.....s",14:"dd.....s"},MM={1:"......s.",2:"......s.",3:".....s..",4:".....s.."},_M={9:"..Cmmn..",10:"..Cdns..",11:".dd...s.",12:"d.....s.",13:".....s.."},Vu={side:["........","...hhh..","...hse..",".Kktsss.",".KktTds.",".Cmmdds.","...ddss.","........"],front:["........","..hhhh..","..sees..",".sktTks.",".sddsss.","..mmmm..","..dssd..","........"],back:["........","..hhhh..","..hhhh..",".skkTts.",".sCCCCs.","..mmmm..","..dssd..","........"]};function $u(o,t){let e=o.map(s=>s.split(""));for(let s=0;s<t;s++)e=e[0].map((i,a)=>e.map(r=>r[a]).reverse());const n={};return e.forEach((s,i)=>n[i+5]=s.join("")),n}const ju={0:"...HH...",1:"..hhhh..",2:"..hssh..",3:"..ssss..",4:"...dd..."},qu={5:"..kktt..",6:"..tkkT..",7:"..ttkk..",8:"..tTTt.."},Xu={5:".CC..CC.",6:".CP..PC.",7:".CC..CC.",8:".CC..CC.",9:".C....C.",10:".C....C."},bM={5:".s....s.",6:".s....s.",7:".s....s."},$a={5:"......s.",6:"......s.",7:"......s."},xl={5:".s......",6:".s......"},SM={1:".s......",2:".s......",3:".s......",4:".s......"},EM={5:".s......",6:"..s....."},AM={5:".s....s.",6:"..s..s.."},us=(o,t)=>({9:"..mmmm..",10:o,...t}),Pr={11:"..sdds..",12:"..sdds..",13:"..s..s..",14:".ss..ss."},mp=[{11:"..sdds..",12:"..s.ss..",13:"..s.ss..",14:".ss....."},Pr,{11:"..sdds..",12:"..ss.s..",13:"..ss.s..",14:".....ss."},Pr],gp=[{11:"..sdds..",12:"..s.ss..",13:"..s.....",14:".ss....."},{11:"..sdds..",12:".s....s.",13:".s....s.",14:"........"},{11:"..sdds..",12:"..ss.s..",13:".....s..",14:".....ss."},{11:"..sdds..",12:".s....s.",13:".s....s.",14:"........"}],xp={11:"..sdds..",12:".sd..ds.",13:".s....s.",14:"ss....ss"},vp={11:".sd..ds.",12:"s......s",13:"........"},TM=us("..smnd..",Pr),CM=mp.map(o=>us("..smnd..",o)),RM=gp.map(o=>us("..smnd..",o)),LM=[{5:".s....s.",6:".s.....s"},{5:".s....s.",6:".s....s."},{5:".s....s.",6:"s.....s."},{5:".s....s.",6:".s....s."}],Yu=us("..smnd..",xp),PM=us("..smnd..",vp),wp={1:"s......s",2:"s......s",3:".s....s.",4:".s....s."},Ku={0:"...HH...",1:"..hhhh..",2:"..hhhh..",3:"..hhhh..",4:"...dd..."},Zu={5:"..tttt..",6:"..tTTt..",7:"..tTTt..",8:"..tttt.."},Ju={5:"..kkk...",6:"..kkkk..",7:"...kkk..",8:"....kk.."},Qu={5:".CCCCCC.",6:".CPCCPC.",7:".CCPPCC.",8:".CPCCPC.",9:".CCCCCC.",10:"..CCCC.."},kM={5:".s....s.",6:".s....s.",7:".s....s."},ja={5:".s......",6:".s......",7:".s......"},yp={5:"......s.",6:"......s."},DM={1:"......s.",2:"......s.",3:"......s.",4:"......s."},zM={3:"......s.",4:"......s.",5:"......s."},IM={5:"......s.",6:".......s",7:".......s"},FM={3:".s....s.",4:".s....s.",5:".s....s."},UM=us("..dnms..",Pr),NM=mp.map(o=>us("..dnms..",o)),OM=gp.map(o=>us("..dnms..",o)),BM=[{5:".s....s.",6:"s.....s."},{5:".s....s.",6:".s....s."},{5:".s....s.",6:".s.....s"},{5:".s....s.",6:".s....s."}],tf=us("..dnms..",xp),WM=us("..dnms..",vp),HM=wp,GM={side:(o,t,e=!1)=>e?[lM,hM,t,o]:[dp,pp,t,o],front:(o,t,e=!1)=>e?[o,un(ju,0,1),un(qu,0,1),un(Xu,0,1),un(t,0,1)]:[o,ju,qu,Xu,t],back:(o,t,e=!1)=>e?[o,un(Ku,0,1),un(Zu,0,1),un(Ju,0,1),un(Qu,0,1),un(t,0,1)]:[o,Ku,Zu,Ju,Qu,t]},VM={side:{stand:gM,walk:xM,run:vM,brace:wM,lunge:yM,leap:_M,flung:MM},front:{stand:TM,walk:CM,run:RM,brace:Yu,lunge:Yu,leap:PM,flung:wp},back:{stand:UM,walk:NM,run:OM,brace:tf,lunge:tf,leap:WM,flung:HM}},$M={side:{down:uM,grip:fM,out:dM,back:pM,up:mM,free:null,pump:null},front:{down:bM,grip:Ms($a,xl),out:Ms($a,EM),back:Ms($a,xl),up:Ms($a,SM),both:AM,pump:LM},back:{down:kM,grip:Ms(ja,yp),out:Ms(ja,zM),back:Ms(ja,IM),up:Ms(ja,DM),both:FM,pump:BM}};function jM(o,t){const e=GM[o],n=VM[o],s=$M[o],i=t[o],a=[],r=o==="side";for(let c=0;c<4;c++)a.push(ri(e(n.walk[c],s[i.walk.arm]||s.down),i.walk.over,i.walk.under));for(let c=0;c<4;c++){const l=r?un(s[i.run.arm]||s.down,1):Ms(s.pump[c],i.run.arm==="grip"?o==="front"?xl:yp:null);a.push(ri(e(n.run[c],l,r),i.run.over,i.run.under))}for(const c of i.idle)a.push(ri(e(n.stand,s[c.arm]||s.down),c.over,c.under));for(const[c,l,h,u]of i.engage)a.push(ri(e(n[l],s[c]||s.down,l==="lunge"),h,u));return a.push(ri(e(n.leap,n.flung,r),i.leap||null)),a.push(ri([$u(Vu[o],1)])),a.push(ri([$u(Vu[o],2)])),a}const Sn=(o,t,e=6)=>{const n={};for(let s=o;s<=t;s++)n[s]=".".repeat(e)+"w";return n[o]=".".repeat(e)+"W",n},qM={side:{walk:{arm:"down",over:Sn(0,10)},run:{arm:"down",over:{8:"wwwwwwwW"}},idle:[{arm:"down",over:Sn(0,14)},{arm:"grip",over:{...Sn(1,14),0:".......W",1:"......w."}}],engage:[["back","brace",{6:"wwwwW..."}],["out","lunge",{6:"..wwwwwW"}],["grip","brace",{1:".......W",2:"......w.",3:"......w.",4:".....w..",5:".....w..",6:"....w...",7:"....w..."}],["grip","brace",{1:".......W",2:"......w.",3:"......w.",4:".....w..",5:".....w..",6:"....w...",7:"....w..."}]],leap:{0:".......W",1:"......w.",2:".....w..",3:"....w..."}},front:{walk:{arm:"grip",over:Sn(0,11,0)},run:{arm:"grip",over:{7:"..w.....",8:"..W....."}},idle:[{arm:"grip",over:Sn(0,14,0)},{arm:"down",over:{...Sn(1,14,0),0:".W......"}}],engage:[["up","brace",{0:"....w...",1:"...w....",2:"..w.....",3:".w......",4:"W......."}],["out","lunge",{7:"..w.....",8:".WW.....",9:"..W....."}],["grip","brace",Sn(0,12,0)],["grip","brace",Sn(0,12,0)]],leap:{0:"W.......",1:"w.......",2:".w......"}},back:{walk:{arm:"grip",over:Sn(0,11,7)},run:{arm:"grip",over:{2:".......W",3:".......w",4:"......w.",5:"......w."}},idle:[{arm:"grip",over:Sn(0,14,7)},{arm:"down",over:{...Sn(1,14,7),0:"......W."}}],engage:[["back","brace",{2:".......W",3:".......w",4:".......w",5:"......w.",6:"......w.",7:"......w.",8:".....w..",9:".....w.."}],["out","lunge",{0:"......W.",1:"......w.",2:"......w."}],["grip","brace",Sn(0,12,7)],["grip","brace",Sn(0,12,7)]],leap:{0:".......W",1:".......w",2:"......w."}}},XM={side:{walk:{arm:"grip",over:{5:"WWwwww.."}},run:{arm:"grip",over:{1:"......WW",2:"......WW",3:"......w.",4:"......w.",5:"......w."}},idle:[{arm:"down",over:{7:"......w.",8:"......w.",9:"......WW",10:"......WW"}},{arm:"down",over:{7:"......w.",8:"......w.",9:".....WW.",10:".....WW."}}],engage:[["up","brace",null,{0:"WWwww...",1:"WW......"}],["out","lunge",{6:".......w",7:"......WW",8:"......WW"}],["down","brace",{8:"......w.",9:"......w.",10:".....WW.",11:".....WW."}],["down","brace",{8:"......w.",9:"......w.",10:".....WW.",11:".....WW."}]],leap:{0:"......WW",1:"......WW"}},front:{walk:{arm:"grip",over:{3:"WW......",4:"Ww......"}},run:{arm:"grip",over:{1:".WW.....",2:".WW.....",3:".w......",4:".w......"}},idle:[{arm:"down",over:{8:".w......",9:".w......",10:"WW......",11:"WW......"}},{arm:"down",over:{8:".w......",9:"w.......",10:"WW......",11:"W......."}}],engage:[["up","brace",null,{0:"..wwWW..",1:"....WW.."}],["out","lunge",{6:"..WW....",7:"..WW...."}],["down","brace",{8:".w......",9:".w......",10:"WW......",11:"WW......"}],["down","brace",{8:".w......",9:".w......",10:"WW......",11:"WW......"}]],leap:{0:"WW......",1:"WW......"}},back:{walk:{arm:"grip",over:{3:"......WW",4:"......wW"}},run:{arm:"grip",over:{1:".....WW.",2:".....WW.",3:"......w.",4:"......w."}},idle:[{arm:"down",over:{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}},{arm:"down",over:{8:"......w.",9:".......w",10:"......WW",11:".......W"}}],engage:[["up","brace",{0:"..WWww..",1:"..WW...."}],["out","lunge",{1:"......W.",2:"......W."}],["down","brace",{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}],["down","brace",{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}]],leap:{0:"......WW",1:"......WW"}}},Jn=(o,t=6)=>{const e={},n=".".repeat(t);for(let s=o;s<o+6;s++)e[s]=n+"G";e[o]=n+"g";for(let s=o+6;s<=14;s++)e[s]=n+"W";return e},YM={side:{walk:{arm:"grip",over:{6:".....W..",7:".....WW."},under:{0:".g......",1:".G......",2:".G......",3:"..G.....",4:"..G.....",5:"...G....",6:"....G..."}},run:{arm:"grip",over:{1:".......g",2:"......G.",3:"......G.",4:".....G..",5:".....W..",6:"....W...",7:"...W...."}},idle:[{arm:"grip",over:Jn(3)},{arm:"down",over:Jn(3)}],engage:[["out","brace",{4:"..WWGGGg"}],["out","brace",{3:".......F",4:".WWGGGgf",5:".......F"}],["grip","brace",{0:"......SS",1:".....SSZ",2:"......Z.",5:".....W..",6:"......G.",7:"......G."},{2:".......g"}],["grip","brace",{0:".....SS.",1:"....SZ..",5:".....W..",6:"......G.",7:"......G."},{2:".......g"}]],leap:{0:"......g.",1:"......G.",2:".....W.."}},front:{walk:{arm:"grip",over:{6:".W......"},under:{0:"g.......",1:"G.......",2:"G.......",3:".G......",4:".G......",5:".G......"}},run:{arm:"grip",over:{4:"......g.",5:".....G..",6:"....G...",7:"...W....",8:"..W....."}},idle:[{arm:"grip",over:Jn(3,0)},{arm:"down",over:Jn(3,0)}],engage:[["both","brace",{3:".gg.....",4:".gb.....",5:"..W....."}],["both","brace",{1:".F......",2:"FfF.....",3:"fffF....",4:"FfF.....",5:".F......"}],["grip","brace",{0:".SSZ....",1:"SZSS....",2:".SZ....."},Jn(5,0)],["grip","brace",{0:"SZ......",1:".S......"},Jn(5,0)]],leap:{0:"g.......",1:"G.......",2:".W......"}},back:{walk:{arm:"grip",over:{6:"......W."},under:{0:".......g",1:".......G",2:".......G",3:"......G.",4:"......G.",5:"......G."}},run:{arm:"grip",over:{4:".g......",5:"..G.....",6:"...G....",7:"....W...",8:".....W.."}},idle:[{arm:"grip",over:Jn(3,7)},{arm:"down",over:Jn(3,7)}],engage:[["both","brace",{1:"......g.",2:"......G.",3:"......G.",4:"......W."}],["both","brace",{0:".....FfF",1:"......f.",2:"......G.",3:"......G.",4:"......W."}],["grip","brace",{0:"....SSZ.",1:".....ZSS",2:"......S."},Jn(5,7)],["grip","brace",{0:".....ZS.",1:"......S."},Jn(5,7)]],leap:{0:".......g",1:".......G",2:"......W."}}},KM={side:{walk:{arm:"down",over:{8:".........c",9:".........c",10:".........cg"}},run:{arm:"down",over:{8:".......cc.",9:"......g..."}},idle:[{arm:"down",over:{8:".........c",9:".........c",10:".........cg"}},{arm:"down",over:{8:".........c",9:"..........c",10:"..........cg"}}],engage:[["up","brace",null,{0:".....gccc"}],["up","brace",{0:"........ccg"}],["out","lunge",{4:".............g",5:"...........c"}],["out","brace",{3:"...............g",6:"..........c",7:"..........c"}]],leap:{0:"..........c",1:"..........c"}},front:{walk:{arm:"grip",over:{7:".....c",8:".....c",9:"....gc"}},run:{arm:"grip",over:{7:"....c.",8:"...cg."}},idle:[{arm:"down",over:{8:".....c",9:".....c",10:"....gc"}},{arm:"down",over:{8:".....c",9:"....c.",10:"...gc."}}],engage:[["up","brace",null,{0:"..gccc"}],["up","brace",{0:".....ccccg"}],["out","lunge",{8:"...g",7:"....c"}],["out","brace",{11:".g",8:".....c"}]],leap:{0:".....c",1:".....c"}},back:{walk:{arm:"grip",over:{7:"..........c",8:"..........c",9:"..........cg"}},run:{arm:"grip",over:{7:"...........c",8:"...........gc"}},idle:[{arm:"down",over:{8:"..........c",9:"..........c",10:"..........cg"}},{arm:"down",over:{8:"..........c",9:"...........c",10:"...........cg"}}],engage:[["up","brace",{0:".....gcccc"}],["up","brace",null,{0:"..........cccg"}],["out","lunge",{1:"............g",2:"...........c"}],["out","brace",{0:"..............g",4:"...........c"}]],leap:{0:"..........c",1:"..........c"}}},ZM={side:{walk:{arm:"down",over:{8:".....W..",9:".....g.."}},run:{arm:"grip",over:{6:"......Wg"}},idle:[{arm:"down",over:{8:".....W..",9:".....g.."}},{arm:"grip",over:{4:"......g.",5:"......W."}}],engage:[["up","brace",{0:"....Wg.."}],["out","lunge",{6:".......W",7:".......g"}],["grip","brace",{4:"......g.",5:"......W."}],["grip","brace",{4:"......g.",5:"......W."}]],leap:null},front:{walk:{arm:"down",over:{8:".W......",9:".g......"}},run:{arm:"grip",over:{6:"..g....."}},idle:[{arm:"down",over:{8:".W......",9:".g......"}},{arm:"grip",over:{4:".g......",5:".W......"}}],engage:[["up","brace",{0:".g......"}],["out","lunge",{7:"..W.....",8:"..gg...."}],["grip","brace",{4:".g......",5:".W......"}],["grip","brace",{4:".g......",5:".W......"}]],leap:null},back:{walk:{arm:"down",over:{8:"......W.",9:"......g."}},run:{arm:"grip",over:{4:"......g."}},idle:[{arm:"down",over:{8:"......W.",9:"......g."}},{arm:"grip",over:{3:"......g.",4:"......W."}}],engage:[["up","brace",{0:"......g."}],["out","lunge",{1:"......g.",2:"......W."}],["grip","brace",{3:"......g.",4:"......W."}],["grip","brace",{3:"......g.",4:"......W."}]],leap:null}},En=(o,t,e=6)=>{const n={};for(let s=o;s<=t;s++)n[s]=".".repeat(e)+"w";return n[o]=".".repeat(Math.max(0,e-1))+(e>0?"WW":"W"),n},JM={side:{walk:{arm:"down",over:En(0,10)},run:{arm:"down",over:{7:"wwwwwwWW"}},idle:[{arm:"down",over:En(0,14)},{arm:"grip",over:En(1,14)}],engage:[["out","brace",{6:"..wwwwWW"}],["out","lunge",{6:"...wwwwW"}],["back","brace",{6:"wwwwwW.."}],["back","brace",{6:"wwwwwW.."}]]},front:{walk:{arm:"grip",over:En(0,11,0)},run:{arm:"grip",over:{6:"WWwwww.."}},idle:[{arm:"grip",over:En(0,14,0)},{arm:"down",over:En(1,14,0)}],engage:[["both","brace",{5:"WW......",6:".wwww..."}],["both","lunge",{7:"Wwwww..."}],["grip","brace",En(0,12,0)],["grip","brace",En(0,12,0)]]},back:{walk:{arm:"grip",over:En(0,11,7)},run:{arm:"grip",over:{6:"..wwwwWW"}},idle:[{arm:"grip",over:En(0,14,7)},{arm:"down",over:En(1,14,7)}],engage:[["both","brace",{2:"......WW",3:"......w.",4:"......w.",5:".....w..",6:".....w.."}],["both","lunge",{0:"......WW",1:"......w.",2:"......w.",3:".....w.."}],["grip","brace",En(0,12,7)],["grip","brace",En(0,12,7)]]}},rn=(o,t,e=6)=>{const n={};for(let s=o;s<=t;s++)n[s]=".".repeat(e)+"w";return n[o]=".".repeat(e)+"F",n},QM={side:{walk:{arm:"down",over:rn(0,10)},run:{arm:"down",over:{4:".......F",5:"......w.",6:".....w..",7:"....w...",8:"...w...."}},idle:[{arm:"down",over:rn(0,14)},{arm:"down",over:{...rn(1,14),0:"......f."}}],engage:[["out","brace",{7:"......w.",8:"......w.",9:".......w",10:".......F"}],["out","lunge",{7:".......w",8:".......w",9:".......w",10:".......w",11:".......f"}],["grip","brace",rn(0,9)],["grip","brace",rn(0,9)]]},front:{walk:{arm:"grip",over:rn(0,11,0)},run:{arm:"grip",over:{3:"F.......",4:".w......",5:"..w....."}},idle:[{arm:"grip",over:rn(0,14,0)},{arm:"down",over:{...rn(1,14,0),0:"f......."}}],engage:[["grip","brace",{6:".w......",7:"w.......",8:"F......."}],["out","lunge",{7:".w......",8:"w.......",9:"f......."}],["grip","brace",rn(0,9,0)],["grip","brace",rn(0,9,0)]]},back:{walk:{arm:"grip",over:rn(0,11,7)},run:{arm:"grip",over:{3:".......F",4:"......w.",5:".....w.."}},idle:[{arm:"grip",over:rn(0,14,7)},{arm:"down",over:{...rn(1,14,7),0:".......f"}}],engage:[["grip","brace",{4:".......F",5:"......w.",6:"......w."}],["out","lunge",{3:".......f",4:"......w.",5:"......w."}],["grip","brace",rn(0,9,7)],["grip","brace",rn(0,9,7)]]}},Ki={9:"....gggggggggg..",10:"..GGGGWWWGGGGG..",11:"...WWW.w.W...G..",12:"..WW.WwwwW......",13:".WW..W.w.W......",14:"WW....WWW......."},t2={...Ki,11:"...WWWw.wW...G..",12:"..WW.W.w.W......",13:".WW..Ww.wW......"},zo={8:"..ww..gggg..ww..",9:"..WW..gbbg..WW..",10:"..WW.WgbbgW.WW..",11:"..WWWWWggWWWWW..",12:"..WW..W..W..WW..",13:"..ww........ww.."},Io={8:"..ww...gg...ww..",9:"..WW..GggG..WW..",10:"..WW.WGGGGW.WW..",11:"..WWWWWWWWWWWW..",12:"..WW...WW...WW..",13:"..ww...WW...ww..",14:".......WW......."},cn=(o,t=null,e=0,n=0)=>({body:[un(o,e,n)],over:t?[t]:[],under:[]}),Mp={side:[...[0,1,0,1,0,1,0,1,0,0].map(o=>cn(o?t2:Ki)),cn(Ki,{8:"..............F.",9:"..............fF",10:"..............ff",11:"..............F."}),cn(Ki,{6:"............SS..",7:"...........SSSS.",8:"..........SSSZS.",9:"...........ZSS..",10:"............Z..."},-1),cn(Ki,{3:"...........SS...",4:"..........SZSS..",5:"...........ZS..."}),cn(Ki,{2:"............S..."})],front:[...[0,0,0,0,0,0,0,0,0,0].map(()=>cn(zo)),cn(zo,{5:".......FF.......",6:".....FfffF......",7:"....FfffffF.....",8:"...FfffffffF....",9:"....FfffffF.....",10:".....FfffF......",11:".......FF......."}),cn(zo,{4:"......SSZ.......",5:"....SSSSSS......",6:"...SZSSSSZS.....",7:"....SSZSS.......",8:"......S........."},0,-1),cn(zo,{1:".......SS.......",2:".....SZSSS......",3:"......ZS........"}),cn(zo,{0:"......S........."})],back:[...[0,0,0,0,0,0,0,0,0,0].map(()=>cn(Io)),cn(Io,{4:".......FF.......",5:"......FffF......",6:".......ff.......",7:".......FF......."}),cn(Io,{3:"......SSZ.......",4:".....SZSSS......",5:"......SSZ......."},0,1),cn(Io,{0:"......SS........",1:".....SZSS.......",2:"......Z........."}),cn(Io,{0:".......S........"})]};for(const o of Lr)Mp[o].push(...[0,1,2].map(()=>({body:[],over:[],under:[]})));const e2={spear:qM,club:XM,musket:YM,sling:KM,dagger:ZM,rammer:JM,linstock:QM},dr={};for(const o of ql){dr[o]={};for(const t of Lr)if(o==="gun")dr.gun[t]=Mp[t];else{const e=jM(t,e2[o]);dr[o][t]=Xl[o]?e.map(n=>({body:n.body.map(s=>un(s,4)),over:n.over,under:n.under})):e}}function n2(){const o=[];for(const t of fr){for(const e of["bare","kihei"])for(const n of["spear","club","musket","sling","dagger"])o.push({kind:n,side:t,dress:e});for(const e of["spear","club"])o.push({kind:e,side:t,dress:"chief"})}return o.push({kind:"rammer",side:"hawaii",dress:"bare"},{kind:"linstock",side:"hawaii",dress:"kihei"},{kind:"gun",side:"hawaii",dress:"bare"}),o}const s2=200,i2=o=>[parseInt(o.slice(1,3),16),parseInt(o.slice(3,5),16),parseInt(o.slice(5,7),16)];function zc(o,t,e){const n=Array.from({length:dn},()=>new Array(t).fill("."));for(const s of o)for(const[i,a]of Object.entries(s)){const r=Number(i);if(!(r<0||r>=dn))for(let c=0;c<Math.min(t,a.length);c++){const l=a[c];l!=="."&&e[l]&&(n[r][c]=l)}}return n}function o2(o,t,e,n){const s=zc(o.body,t,e),i=zc(o.over,t,e),a=zc(o.under,t,e),r=(h,u)=>u>=0&&u<dn&&h>=0&&h<t&&n.includes(s[u][h]),c=new Uint8Array(t*dn*4),l=(h,u,f)=>{if(f===".")return;const d=e[f];d&&c.set([...i2(d),f==="f"||f==="F"?s2:255],(u*t+h)*4)};for(let h=0;h<dn;h++)for(let u=0;u<t;u++)l(u,h,a[h][u]),!r(u,h)&&(r(u-1,h)||r(u+1,h)||r(u,h-1)||r(u,h+1))&&l(u,h,"o"),l(u,h,s[h][u]),l(u,h,i[h][u]);return c}function a2(){const o=n2(),t=Lr.length*no*16,e=o.length*dn,n=new Uint8Array(t*e*4),s=new Map;o.forEach((r,c)=>{const l=Xl[r.kind]||gl;r.w=l;const h=cM(r.side,r.dress),u=r.kind==="gun"?aM:oM;Lr.forEach((f,d)=>{dr[r.kind][f].forEach((m,x)=>{const g=o2(m,l,h,u),p=(d*no+x)*l;for(let v=0;v<dn;v++)n.set(g.subarray(v*l*4,(v+1)*l*4),((c*dn+v)*t+p)*4)})}),s.set(`${r.kind}/${r.side}/${r.dress}`,{y:c*dn,w:l})});const i=(r,c,l)=>s.get(`${r}/${c}/${l}`)||s.get(`${r}/${c}/bare`)||s.get(`${r}/hawaii/bare`)||s.get(`${r}/hawaii/kihei`);return{width:t,height:e,data:n,rows:o,facingW:no,cell:(r,c,l,h,u,f=0)=>{const d=i(r,c,l),[m,x]=sM[h];return[(f*no+m+u%x)*d.w,d.y,d.w,dn]},at:i,has:(r,c,l)=>s.has(`${r}/${c}/${l}`)}}const _p=`
in vec4 aFoot;   // x, the ground there (metres), z, a nudge toward the eye (world units)
in vec4 aCell;   // the frame in the sheet: x, y, w, h (sheet pixels, y down from the top)
in vec4 aDraw;   // k (screen pixels to a sprite pixel), mirroring times tint (- mirrored), shown (0..1), dx (sprite pixels across the screen)
in vec4 aMix;    // the part of the dither this copy keeps: lo, hi; dy (sprite pixels up the screen); the shadow's width (sprite pixels)
uniform vec2 uViewport;   // the target drawn into, in pixels
uniform float uPxW;       // world units a screen pixel spans, per unit of distance from the eye
// the foot projected and rounded to a pixel corner (x, y), and its depth drawn toward the eye by
// pull (as a fraction of the figure's height) and the figure's own nudge (z); w < 0 when not drawn
vec4 footPixel(vec3 foot, float pull) {
  vec4 clip = projectionMatrix * viewMatrix * vec4(foot, 1.0);
  if (aDraw.z <= 0.0 || clip.w <= 0.0 || aMix.y <= aMix.x) return vec4(0.0, 0.0, 0.0, -1.0);
  vec2 px = floor((clip.xy / clip.w * 0.5 + 0.5) * uViewport + 0.5);
  px += vec2(aDraw.w, aMix.z) * aDraw.x;
  vec3 toEye = cameraPosition - foot;
  float de = length(toEye);
  float h = aCell.w * aDraw.x * uPxW * de;
  float d = min(pull * h + aFoot.w, de * 0.5);
  vec4 cb = projectionMatrix * viewMatrix * vec4(foot + toEye / de * d, 1.0);
  return vec4(px, cb.z / cb.w, 1.0);
}
vec3 footWorld() {
  return vec3(aFoot.x, max(aFoot.y, 0.0) * uVert, aFoot.z);
}
`,bp=`
float bayer4(ivec2 p) {
  int i = (p.x & 3) + 4 * (p.y & 3);
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(m[i]) + 0.5) / 16.0;
}
// kept: the pixel's place in the dither falls in this copy's part, and within it, under how much is shown
bool kept(ivec2 p, vec2 part, float shown) {
  float b = bayer4(p);
  if (b < part.x || b >= part.y) return false;
  return shown >= 0.999 || (b - part.x) / (part.y - part.x) < shown;
}
`,r2=`
${Ne}
${Ye}
${Qs}
${_p}
uniform sampler2D uFigS;  // the district's cast shadows (its shadow map), when it is down
uniform float uHasS;
out vec2 vSp;
flat out vec4 vCell;
flat out vec3 vDraw;   // mirroring, tint, shown
flat out vec2 vPart;
flat out vec3 vLight;
void main() {
  vec3 foot = footWorld();
  vec4 fp = footPixel(foot, 0.5);
  if (fp.w < 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float k = aDraw.x;
  vec2 size = aCell.zw * k;
  vec2 corner = fp.xy + vec2((position.x - 0.5) * size.x, position.y * size.y);
  gl_Position = vec4(corner / uViewport * 2.0 - 1.0, fp.z, 1.0);
  vSp = vec2(position.x * aCell.z, (1.0 - position.y) * aCell.w);
  vCell = aCell;
  vDraw = vec3(sign(aDraw.y), abs(aDraw.y), aDraw.z);
  vPart = aMix.xy;
  // lit as an upright card turned to the eye and tipped a little skyward, in the valley's shadows
  vec3 e = cameraPosition - foot;
  e.y = 0.0;
  vec3 n = normalize(normalize(e + vec3(1e-4, 0.0, 0.0)) + vec3(0.0, 0.9, 0.0));
  float vis = 1.0;
  if (uHasS > 0.5) {
    vec2 uv = rectUv(uDistRect, foot.xz);
    if (uv.x > 0.0 && uv.y > 0.0 && uv.x < 1.0 && uv.y < 1.0) vis = textureLod(uFigS, uv, 0.0).r;
  }
  // (a little under the ground's own, so a figure facing the low sun keeps its earth tones)
  vLight = 0.7 * shade(vec3(1.0), n, foot, 1.0, mix(0.35, 1.0, vis));
}
`,c2=`
${Ne}
${bp}
uniform sampler2D uSheet;
in vec2 vSp;
flat in vec4 vCell;
flat in vec3 vDraw;
flat in vec2 vPart;
flat in vec3 vLight;
void main() {
  ivec2 wh = ivec2(vCell.zw);
  ivec2 t = clamp(ivec2(floor(vSp)), ivec2(0), wh - 1);
  if (vDraw.x < 0.0) t.x = wh.x - 1 - t.x;
  vec4 c = texelFetch(uSheet, ivec2(vCell.xy) + t, 0);
  if (c.a < 0.25) discard;
  if (!kept(t, vPart, vDraw.z)) discard;
  vec3 a = pow(c.rgb, vec3(2.2));
  // (a flash and a match's glow are their own light: the sheet marks them with a lower alpha)
  vec3 col = c.a < 0.9 ? a * 2.4 : a * vDraw.y * vLight;
  gl_FragColor = vec4(col, 1.0);
}
`,l2=`
${Ne}
${Ye}
${_p}
out vec2 vSp;
flat out vec3 vInfo;   // w, h, shown
flat out vec2 vPart;
void main() {
  vec3 foot = footWorld();
  // (a little further than the figure, so its feet are drawn over it)
  vec4 fp = footPixel(foot, 0.42);
  // (nothing under a figure in the air)
  if (fp.w < 0.0 || aMix.w <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float k = aDraw.x;
  float w = aMix.w;
  // four sprite pixels tall, centred on the line of the feet: the half under it shows below them
  vec2 corner = fp.xy + vec2((position.x - 0.5) * w * k, (position.y * 4.0 - 2.0) * k);
  gl_Position = vec4(corner / uViewport * 2.0 - 1.0, fp.z, 1.0);
  vSp = vec2(position.x * w, aCell.w + 2.0 - position.y * 4.0);
  vInfo = vec3(w, aCell.w, aDraw.z);
  vPart = aMix.xy;
}
`,h2=`
${Ne}
${bp}
in vec2 vSp;
flat in vec3 vInfo;
flat in vec2 vPart;
void main() {
  // a pixel ellipse, the width of the figure less a pixel each side, on the line of its feet
  vec2 c = floor(vSp) + 0.5;
  vec2 q = (c - vec2(vInfo.x * 0.5, vInfo.y)) / vec2(vInfo.x * 0.5 - 0.5, 1.6);
  if (dot(q, q) > 1.0) discard;
  if (!kept(ivec2(floor(vSp)), vPart, vInfo.z)) discard;
  gl_FragColor = vec4(vec3(0.55), 1.0);
}
`,u2=2400,An={file:0,knot:1,pacer:2,rank:3,duel:4,piece:5,crew:6,ring:7,leap:8},Fo=Object.fromEntries(ql.map((o,t)=>[o,t])),Uo=0,ef=4,qa=8,Xa=10,f2=14,Oe={right:0,left:1,front:2,back:3},nf=[0,0,1,2],sf=1.25,d2=9,p2=20,of=.35,m2=["march","run","stand","engage","surround","leap"],Ic=["spear","club","sling","dagger","musket"],g2=["spear","club","dagger"],Vn={run:.6,least:18,across:9,up:13,pull:70,fade:10,air:1.6,gap:1.1},Qn={up:20,down:30,dirs:72,step:.05,far:8,clear:.1},kr=(8/85)**1.5;function x2(o){return 1+3*((8/Math.max(o,.5))**1.5-kr)/(1-kr)}function v2(o){return 8/(kr+(o-1)*(1-kr)/3)**(2/3)}function w2(o,t){return Math.max(2,Math.min(4*t,x2(o)*t))}const ss=.3,so=.2,af=2;class y2{constructor(){this.L=NaN,this.s=NaN,this.k=2,this.t=0}step(t,e,n,s){Number.isFinite(this.L)||(this.L=Math.round(t));const i=Math.abs(t-this.s)>1e-4;this.s=t;let a=Math.max(t-so,Math.min(t+so,this.L));const r=Math.floor(a),c=a-r;(!i||e===0)&&c>.5-ss/2&&c<.5+ss/2&&(a=r+(c<.5?.5-ss/2:.5+ss/2)),e===0?this.L=a:this.L+=Math.max(-af*e,Math.min(af*e,a-this.L)),this.L=Math.max(n,Math.min(s,this.L));const l=Math.floor(this.L+1e-9);this.k=l;const h=l>=s?0:(this.L-l-(.5-ss/2))/ss;return this.t=h<1e-6?0:h>1-1e-6?1:h,this}}function M2(o){const t=[];for(let e=2;e<4*o;e++){const n=s=>+v2(s/o).toFixed(2);t.push({k:e,in:[n(e+.5-ss/2+so),n(e+.5+ss/2+so)],out:[n(e+.5+ss/2-so),n(e+.5-ss/2-so)]})}return t}function _2(o,t,e){const n=o.length;let s=Math.atan2(e,t)/(2*Math.PI);s<0&&(s+=1);const i=Math.floor(s*n)%n;return Math.min(o[i],o[(i+1)%n])}function b2(o){let t=o>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const S2=/\bretreat|\bpursu|\bfalls? back|\bescap|\bflee(s|ing)?\b|\brout(ed|s)?\b|\bgot away|\bover the ridge|\bold path/i,E2=/\bposts?\b|ashore|encamp|in order/i;function A2(o){const t=`${o.name||""} ${o.note||""}`;return S2.test(t)?"run":E2.test(`${o.name||""}`)||/putting itself in order|encamped|organising/i.test(o.note||"")?"stand":"walk"}function T2(o){const t=o.p.behaviour;if(m2.includes(t))return t;if(o.line)return"engage";const e=A2(o.p);return e==="walk"?"march":e}function Be(o,t,e){const n=o.cum,s=o.pts;let i=1;for(;i<n.length-1&&n[i]<t;)i++;const a=s[i-1],r=s[i],c=n[i]-n[i-1]||1,l=Math.max(0,Math.min(1,(t-n[i-1])/c));return e[2]=(r[0]-a[0])/c,e[3]=(r[1]-a[1])/c,e[0]=a[0]+(r[0]-a[0])*l,e[1]=a[1]+(r[1]-a[1])*l,e}const rf=o=>o.p.stop===null||o.p.stop===void 0?null:[o.p.stop].flat(),Ya=(o,t)=>{const e=rf(o),n=rf(t);return!e||!n||e.some(s=>n.includes(s))};function C2(o,t,e){const n=t.reduce((c,l)=>c+Math.max(0,o[l]||0),0)||1,s=t.map(c=>Math.max(0,o[c]||0)/n*e),i=s.map(Math.floor);let a=e-i.reduce((c,l)=>c+l,0);const r=s.map((c,l)=>[c-Math.floor(c),l]).sort((c,l)=>l[0]-c[0]);for(let c=0;a>0;c++,a--)i[r[c%r.length][1]]++;return Object.fromEntries(t.map((c,l)=>[c,i[l]]))}class Bo{constructor(t,e,n,s=null){this.app=t,this.recs=e,this.ground=s,this.sheet=a2();const i=b2(1795),a=e.map(()=>[]);this.fronts=[],this.pairs=[],this.guns=[];for(const E of e)E.behaviour=T2(E),E.arms=E.p.arms&&typeof E.p.arms=="object"?E.p.arms:null,E.enemy=this.enemyOf(E,e);const r=e.filter(E=>E.line),c=new Set;for(const E of r)for(const T of r){if(E===T||c.has(E)||c.has(T)||E.event!==T.event||E.side===T.side||JSON.stringify(E.p.stop??E.step)!==JSON.stringify(T.p.stop??T.step))continue;const[_,M]=this.mid(E),[A,R]=this.mid(T);if(Math.hypot(_-A,M-R)>4)continue;const[k,C]=E.side==="oahu"?[T,E]:[E,T];c.add(k),c.add(C),this.planFront(k,C,a,e,i)}for(const E of e){if(E.line||E.behaviour!=="run")continue;const T=this.heading(E);let _=null,M=5;for(const A of e){if(A===E||A.line||A.behaviour!=="run"||A.event!==E.event||A.side===E.side||!Ya(A,E)||A.chase)continue;const R=this.heading(A);if(T[0]*R[0]+T[1]*R[1]<.9)continue;const k=Math.hypot(E.pts[0][0]-A.pts[0][0],E.pts[0][1]-A.pts[0][1]);(A.pts[0][0]-E.pts[0][0])*T[0]+(A.pts[0][1]-E.pts[0][1])*T[1]<0||k<M&&(M=k,_=A)}_&&E.side!=="oahu"&&(E.chase=_)}const l=e.map((E,T)=>T).sort((E,T)=>(e[E].chase?1:0)-(e[T].chase?1:0));for(const E of l){const T=e[E];T.line&&!c.has(T)?this.planRanks(T,null,a[E],i):T.line||this.planForce(T,a[E],i,e)}e.forEach((E,T)=>this.armOut(E,a[T],i));const h=a.reduce((E,T)=>E+T.length,0);this.count=h;const u=Math.max(1,h),f=()=>new Float32Array(u),d=()=>new Uint8Array(u),m=()=>new Int8Array(u);this.f={rec:new Uint16Array(u),mode:d(),kind:d(),side:d(),dress:d(),row:f(),cw:f(),s:f(),s0:f(),lat:f(),spd:f(),thr:f(),inAt:f(),outAt:f(),far:f(),ph:f(),tm:f(),tt:f(),st:d(),off:f(),offTo:f(),face:d(),hand:d(),mirror:m(),grp:new Int16Array(u),role:d(),row2:d(),vis:f(),gm:f(),gx:f(),gz:f(),x:f(),z:f(),hx:f(),hz:f(),lift:f(),air:d(),k:f(),tint:f(),wet:d(),fr:d(),dx:m(),dy:m(),dx0:m(),dy0:m()};const x=this.f;let g=0;e.forEach((E,T)=>{E.o=g,E.n=a[T].length;for(const _ of a[T]){const M=g++;x.rec[M]=T,x.mode[M]=An[_.mode],x.kind[M]=Fo[_.kind],x.side[M]=fr.indexOf(_.side),x.dress[M]=iM.indexOf(_.dress);const A=this.sheet.at(_.kind,_.side,_.dress);x.row[M]=A.y,x.cw[M]=A.w,x.s[M]=x.s0[M]=_.s??0,x.lat[M]=_.lat??0,x.spd[M]=_.spd??1,x.thr[M]=_.thr??i(),x.inAt[M]=_.inAt??-1e9,x.outAt[M]=_.outAt??1e9,x.far[M]=85+i()*25,x.ph[M]=_.ph??i(),x.tm[M]=_.tm??1+i()*6,x.face[M]=Oe.right,x.hand[M]=i()<.12?1:0,x.grp[M]=_.grp??-1,x.dx0[M]=_.dx??0,x.dy0[M]=_.dy??0,x.role[M]=_.role??0,x.row2[M]=_.row2??0,x.tint[M]=.9+i()*.18,x.gx[M]=1e9}}),this.marks=new Float32Array(u*4),this.jump=new Float32Array(u*3);const p=new We(this.sheet.data,this.sheet.width,this.sheet.height,Ae,pe);p.minFilter=p.magFilter=ie,p.generateMipmaps=!1,p.needsUpdate=!0,this.texture=p;const v=Math.max(1,Math.min(h,u2));this.cap=v;const w=v*2;this.capI=w;const b=new yo;b.setAttribute("position",new de(new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),3)),b.setIndex([0,1,2,0,2,3]);const y=E=>{const T=new he(new Float32Array(w*4),4);return T.setUsage(an),b.setAttribute(E,T),T};this.aFoot=y("aFoot"),this.aCell=y("aCell"),this.aDraw=y("aDraw"),this.aMix=y("aMix"),this.attrs=[this.aFoot,this.aCell,this.aDraw,this.aMix],b.instanceCount=0,this.geometry=b,this.range={start:0,count:0},this.own={uSheet:{value:p},uViewport:{value:new Bt(1,1)},uPxW:{value:.001},uFigS:{value:null},uHasS:{value:0}};const S={...n.uniforms,...this.own};this.material=new _e({vertexShader:r2,fragmentShader:c2,uniforms:S,transparent:!0,blending:Ls,depthWrite:!0}),this.shadowMaterial=new _e({vertexShader:l2,fragmentShader:h2,uniforms:S,transparent:!0,depthWrite:!1,blending:nl}),this.mesh=new ge(b,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=8,this.shadows=new ge(b,this.shadowMaterial),this.shadows.frustumCulled=!1,this.shadows.renderOrder=7,this.group=new Te,this.group.add(this.shadows,this.mesh),this.time=0,this.frame=0,this.thin=1,this.drawn=0,this.instances=0,this.scale=new y2,this.unit=.03,this.view={rx:1,rz:0,ax:0,az:-1,sinP:.5},this._p=[0,0,0,0],this._v4=new Yt,this._size=new Bt}enemyOf(t,e){for(const n of[!0,!1]){let s=0,i=0,a=0;for(const r of e)if(!(r.event!==t.event||r.side===t.side||n&&!Ya(r,t)))for(const[c,l]of r.pts)s+=c,i+=l,a++;if(a)return[s/a,i/a]}return null}mid(t){return Be(t,t.total/2,[0,0,0,0])}heading(t){const e=t.pts[0],n=t.pts.at(-1),s=Math.hypot(n[0]-e[0],n[1]-e[1])||1;return[(n[0]-e[0])/s,(n[1]-e[1])/s]}cannonOf(t){if(t.arms)return Math.max(0,Math.round(t.arms.cannon||0));const e=Number.isFinite(t.p.from)?t.p.from:1795;return t.line&&t.side==="hawaii"&&e>=1790?Math.max(1,Math.min(3,Math.round(t.total/2.5))):0}sharesOf(t){if(t.arms)return t.arms;const n=(Number.isFinite(t.p.from)?t.p.from:1795)<1790?0:t.side==="hawaii"?.14:.06;return{spear:.7-n,club:.3,musket:n}}planForce(t,e,n,s){if(t.total<.05)return;t.file=/path/i.test(t.p.name||"")&&t.total<12;const a=t.behaviour;a==="stand"||a==="engage"?this.planStand(t,e,n):a==="surround"?this.planSurround(t,e,n,s):a==="leap"?this.planLeap(t,e,n,s):this.planFiles(t,e,n)}planFiles(t,e,n,{n:s=0,from:i=0,to:a=t.total,at:r=1}={}){var v;const c=Math.max(.05,a-i),l=t.behaviour==="run"||t.behaviour==="surround",h=t.file,f=s||Math.max(12,Math.min(300,Math.round(c*(h?2.5:l?4:5)))),d=h?1:3,m=h?.03:t.side==="hawaii"?.32:.26;let x;if((v=t.chase)!=null&&v.knots){const w=c/Math.max(.05,t.chase.total);x=t.chase.knots.map(b=>({u:b.u,sp:b.sp*w}))}else x=Array.from({length:Math.max(3,Math.min(9,Math.round(f/14)))},()=>({u:n(),sp:l?.85+n()*.3:.88+n()*.24}));t.knots=x;const g=Math.min(c*.15,4),p=t.behaviour==="march"?this.cannonOf(t):0;for(let w=0;w<p;w++){const b=x[w%x.length],y=this.guns.push({r:t,kind:"haul",front:-1,s:i+(b.u+.03)%1*c,spd:b.sp,lat:0,inAt:i+n()*g*.6,outAt:a-g*.2-n()*g,x:0,z:0,ax:1,az:0,period:8,phase:0,on:!1})-1;this.crewOut(e,t,y,n()*.3)}for(let w=0;w<f;w++){const b=x[w%x.length];let y=(b.u+(n()-.5)*(n()<.75?.05:.22))%1;y<0&&(y+=1);const S=Math.floor(n()*d);e.push({mode:"file",s:i+y*c,lat:d>1?((S-(d-1)/2)*.7+(n()-.5)*.5)*m:(n()-.5)*m,spd:b.sp*(.97+n()*.06),inAt:i+n()*g*.6,outAt:a-(a<t.total?0:g*.2)-n()*g*r})}}planStand(t,e,n){const s=t.total,i=s<2,a=Math.max(3,Math.min(12,Math.round(s/2.4)));if(t.enemy){const l=this.mid(t);t.pressed=Math.hypot(t.enemy[0]-l[0],t.enemy[1]-l[1])<6}for(let l=0;l<a;l++){const h=Math.max(0,Math.min(s,(l+.5)/a*s+(n()-.5)*(s/a)*.4)),u=i?4+Math.floor(n()*3):6+Math.floor(n()*9),f=i?4:5;for(let d=0;d<u;d++){const m=Math.round((d-(u-1)/2)*f+(n()-.5)*3);e.push({mode:"knot",s:h,lat:(n()-.5)*.12,dx:m,dy:Math.round((n()-.5)*3),tm:1+n()*6})}if(!i||l===1)for(let d=0;d<2;d++)e.push({mode:"pacer",s:h+(n()-.5)*.8,lat:(n()-.5)*.4,spd:.4+n()*.3,noChief:!0})}const r=this.cannonOf(t),c=[0,0,0,0];for(let l=0;l<r;l++){Be(t,(l+.7)/(r+.4)*s,c);const h=this.guns.push({r:t,kind:"park",front:-1,s:0,spd:0,lat:0,inAt:0,outAt:0,x:c[0]-c[3]*.08,z:c[1]+c[2]*.08,ax:c[2],az:c[3],period:8,phase:n(),on:!0})-1;if(t.enemy){const u=t.enemy[0]-c[0],f=t.enemy[1]-c[1],d=Math.hypot(u,f)||1;this.guns[h].ax=u/d,this.guns[h].az=f/d}this.crewOut(e,t,h,n()*.3)}}planSurround(t,e,n,s){const i=t.total,a=Math.max(24,Math.min(64,Math.round(i*12))),r=t.pts.at(-1),c=[0,0,0,0];Be(t,i,c);let l=null,h=3;for(const b of s)if(!(b===t||b.event!==t.event||b.side===t.side||!Ya(b,t)||!(b.line||b.behaviour==="stand"||b.behaviour==="engage")))for(let y=0;y<=b.total;y+=Math.max(.02,b.total/40)){const S=Be(b,y,[0,0,0,0]),E=Math.hypot(S[0]-r[0],S[1]-r[1]);E<h&&(h=E,l=b)}let u=-c[3],f=c[2],d=.4,[m,x]=r;if(l){const b=this.heading(l);u=b[0],f=b[1],d=Math.max(.2,l.total/2),[m,x]=this.mid(l)}const g=-c[2],p=-c[3],v=-f*g+u*p<0?-1:1;t.ring={cx:m,cz:x,ux:u,uz:f,vx:g,vz:p,nx:-f*v,nz:u*v,half:d,reach:null,inner:d+Qn.clear,band:null},this.ground&&this.reachOf(t.ring,l||{total:0,pts:[r],cum:[0]});const w=Math.min(28,Math.round(a*.45));for(let b=0;b<w;b++){const y=b%2,S=(((b>>1)+.5+(n()-.5)*.5)/Math.ceil(w/2)*2-1)*(72*Math.PI/180);e.push({mode:"ring",s:S,row2:y,close:!0,tm:.5+n()*3,ph:n()})}this.planFiles(t,e,n,{n:a-w,to:Math.max(.1,i-Math.min(1.2,i*.25)),at:2})}reachOf(t,e){const n=this.ground,s=[0,0,0,0];let i=1/0,a=-1/0;for(let c=0;c<=e.total+1e-9;c+=Math.max(.02,e.total/40)){const l=e.total>0?Be(e,c,s):e.pts[0],h=n(l[0],l[1]);if(i=Math.min(i,h),a=Math.max(a,h),!(e.total>0))break}if(!Number.isFinite(i)||!Number.isFinite(a))return;i-=Qn.down,a+=Qn.up;const r=new Float32Array(Qn.dirs);for(let c=0;c<Qn.dirs;c++){const l=c/Qn.dirs*2*Math.PI,h=Math.cos(l),u=Math.sin(l);let f=1/0;for(let d=Qn.step;d<=Qn.far;d+=Qn.step){const m=n(t.cx+h*d,t.cz+u*d);if(m<i||m>a){f=d-Qn.step;break}}r[c]=f}t.reach=r,t.band=[i,a]}planLeap(t,e,n,s){const i=Math.max(5,Math.min(10,Math.round(t.total*10)));let a=3;for(const r of s)if(!(r===t||r.line||r.event!==t.event||r.side!==t.side||r.behaviour!=="stand"||!Ya(r,t)))for(let c=0;c<=r.total;c+=Math.max(.02,r.total/40)){const l=Be(r,c,[0,0,0,0]),h=Math.hypot(l[0]-t.pts[0][0],l[1]-t.pts[0][1]);if(h<a){a=h;const u=this.mid(r),f=this.heading(r);t.flank={cx:u[0],cz:u[1],half:r.total/2,ux:f[0],uz:f[1]}}}for(let r=0;r<i;r++)e.push({mode:"leap",s:0,lat:(n()-.5)*.06,dx:Math.round((n()-.5)*8),tm:.3+r*Vn.gap*(.8+n()*.4)})}planRanks(t,e,n,s,i=[]){var h,u;const a=t.total;if(a<.3)return;const r=this.mid(t);let c=0;e&&(c=(e[0]-r[0])*-r[3]+(e[1]-r[1])*r[2]>0?-1:1),t.back=c;const l=Math.max(24,Math.min(120,Math.round(a*11)));for(let f=0;f<l;f++){const d=(.04+.92*((f+s()*.9)/l))*a;if(i.some(x=>Math.abs(d-x)<.32))continue;const m=c?c*(.15+Math.pow(s(),1.2)*1.2):(s()+s()-1)*.5;n.push({mode:"rank",s:d,lat:m,tm:1+s()*8})}if(!e){const f=this.cannonOf(t),d=[0,0,0,0];for(let m=0;m<f;m++){Be(t,(m+1)/(f+1)*a,d);const x=(((h=t.enemy)==null?void 0:h[0])??d[0]+1)-d[0],g=(((u=t.enemy)==null?void 0:u[1])??d[1])-d[1],p=Math.hypot(x,g)||1,v=this.guns.push({r:t,kind:"park",front:-1,s:0,spd:0,lat:0,inAt:0,outAt:0,x:d[0],z:d[1],ax:x/p,az:g/p,period:8,phase:s(),on:!0})-1;this.crewOut(n,t,v,s()*.3)}}}crewOut(t,e,n,s){t.push({mode:"piece",kind:"gun",side:"hawaii",dress:"bare",grp:n,role:0,thr:s,crew:!0}),t.push({mode:"crew",kind:"linstock",side:"hawaii",dress:"kihei",grp:n,role:1,thr:s,crew:!0}),t.push({mode:"crew",kind:"rammer",side:"hawaii",dress:"bare",grp:n,role:2,thr:s,crew:!0})}planFront(t,e,n,s,i){const a=s.indexOf(t),r=s.indexOf(e),c=T=>{const _=this.cannonOf(T);return Array.from({length:_},(M,A)=>(A+1)/(_+1)*T.total)},l=c(t),h=c(e);this.planRanks(t,this.mid(e),n[a],i,l),this.planRanks(e,this.mid(t),n[r],i,h);const u=24,f=[],d=[],m=[0,0,0,0];for(let T=0;T<=u;T++)Be(t,T/u*t.total,m),f.push([m[0],m[1]]),Be(e,T/u*e.total,m),d.push([m[0],m[1]]);Math.hypot(f[0][0]-d[0][0],f[0][1]-d[0][1])>Math.hypot(f[0][0]-d[u][0],f[0][1]-d[u][1])&&d.reverse();const x=f.map((T,_)=>[(T[0]+d[_][0])/2,(T[1]+d[_][1])/2]);let g=0,p=0;for(let T=0;T<=u;T++)g+=d[T][0]-f[T][0],p+=d[T][1]-f[T][1];const v=Math.hypot(g,p)||1,w={a:t,b:e,nx:g/v,nz:p/v,ia:a,ib:r},b=this.fronts.push(w)-1;t.front=b,e.front=b;const y=[0];for(let T=1;T<=u;T++)y.push(y[T-1]+Math.hypot(x[T][0]-x[T-1][0],x[T][1]-x[T-1][1]));const S={pts:x,cum:y,total:y[u]},E=Math.max(4,Math.min(16,Math.round(S.total*2)));for(let T=0;T<E;T++){Be(S,(.08+.84*((T+.2+i()*.6)/E))*S.total,m);const _=(i()-.5)*.4,M=this.pairs.push({x:m[0]+w.nx*_,z:m[1]+w.nz*_,front:b,period:1.5+i()*.8,phase:i(),sway:i()*Math.PI*2,swayT:3+i()*3})-1,A=i()*.9;n[a].push({mode:"duel",grp:M,role:0,close:!0,thr:A}),n[r].push({mode:"duel",grp:M,role:1,close:!0,thr:A})}for(const[T,_,M]of[[t,l,1],[e,h,-1]])for(const A of _){Be(T,A,m);const R=T.back||-1,k=this.guns.push({r:T,kind:"front",front:b,x:m[0]-m[3]*R*.05,z:m[1]+m[2]*R*.05,ax:w.nx*M,az:w.nz*M,period:7+i()*2.5,phase:i(),on:!0})-1;this.crewOut(n[s.indexOf(T)],T,k,i()*.5)}}armOut(t,e,n){const s=fr.includes(t.side)?t.side:"oahu",i=e.filter(f=>!f.crew);for(const f of e)f.crew&&(f.side="hawaii");const a=C2(this.sharesOf(t),Ic,i.length);t.counts=a;const r=[];for(const f of Ic)for(let d=0;d<a[f];d++)r.push(f);for(let f=r.length-1;f>0;f--){const d=Math.floor(n()*(f+1));[r[f],r[d]]=[r[d],r[f]]}const c=f=>{const d=r.findIndex(m=>f.includes(m));return r.splice(d>=0?d:0,1)[0]||"spear"};for(const f of i)f.close&&(f.kind=c(g2));for(const f of i)f.close||(f.kind=c(Ic));for(const f of i)f.side=s,f.dress=n()<.55?"kihei":"bare";const l=i.filter(f=>(f.kind==="spear"||f.kind==="club")&&!f.noChief);let h=i.length>=12?Math.max(1,Math.round(i.length/32)):0;const u=l.find(f=>f.mode==="duel");u&&h&&(u.dress="chief",h--);for(let f=0;f<h&&l.length;f++)l[Math.floor(n()*l.length)].dress="chief"}update(t,e,n){var Tt,Dt,Z,lt,ft,P,L,F,H,Q;const s=this.app,i=s.camera,a=this.f,r=this.recs;this.hold&&(t=0),this.time+=t,this.frame++;const c=this.time;i.updateMatrixWorld();const l=i.matrixWorld.elements,h=this.view;let u=Math.hypot(l[0],l[2])||1;h.rx=l[0]/u,h.rz=l[2]/u,u=Math.hypot(l[8],l[10])||1,h.ax=-l[8]/u,h.az=-l[10]/u,h.sinP=Math.max(.05,Math.min(1,l[9]));const f=-l[8],d=-l[9],m=-l[10],x=i.position.x,g=i.position.y,p=i.position.z,v=((Tt=s.pipeline)==null?void 0:Tt.size)||s.renderer.getDrawingBufferSize(this._size),w=v.y/Math.max(1,innerHeight);this.dpr=w;const b=Math.tan(i.fov*Math.PI/360);this.own.uViewport.value.set(v.x,v.y),this.own.uPxW.value=2*b/Math.max(1,v.y);const y=(Dt=s.districts)!=null&&Dt.on?(ft=(lt=(Z=s.districts.cur)==null?void 0:Z.terrain)==null?void 0:lt.shadow)==null?void 0:ft.texture:null;this.own.uFigS.value=y||null,this.own.uHasS.value=y?1:0;const S=s.world.uniforms.uVert.value,E=s.districts,T=E!=null&&E.on?1+E.k:0,_=((L=(P=E==null?void 0:E.cur)==null?void 0:P.parent)==null?void 0:L.k)??0,M=((F=s.timeline)==null?void 0:F.year)??0,A=T!==this._g0||_!==this._g1||M!==this._g2;this._g0=T,this._g1=_,this._g2=M;const R=((Q=(H=s.rig)==null?void 0:H.state)==null?void 0:Q.distance)??16,k=this.hold?this.scale:this.scale.step(w2(R,w),t,2,Math.max(2,Math.round(4*w))),C=k.L/w*R*2*b/Math.max(1,innerHeight);this.unit=C;const z=n?.5:1,I=d2*C*z,O=p2*C*z,U=t>0?t/of:1,V=Math.min(1,Math.max(.35,Math.pow(24/Math.max(1,R),.8)));for(const j of this.guns){if(j.kind!=="haul"||j.r.w*e<=.002)continue;const ot=j.r.total;let vt=j.s+I*j.spd*t;vt>ot&&(vt%=ot),j.s=vt;const St=Be(j.r,vt,this._p);j.x=St[0],j.z=St[1],j.ax=St[2],j.az=St[3],j.on=vt>=j.inAt&&vt<=j.outAt}const B=this._p,q=this.marks,it=this.aFoot.array,Y=this.aCell.array,nt=this.aDraw.array,rt=this.aMix.array;let ut=0,xt=0,At=0;const Rt=this.cap,wt=k.k,kt=k.t,$=kt<=15.5/16,le=kt>.5/16;for(let j=0;j<r.length;j++){const et=r[j],ot=et.w*e;if(ot<=.002&&!et.drawnLast)continue;const vt=A||!et.drawnLast;et.drawnLast=ot>.002;const St=et.front!==void 0?this.fronts[et.front]:null,Kt=St?St.a===et:!1,ht=ot*this.thin*(et.line?1:V),ae=!n&&(!!St||et.pressed);for(let X=et.o;X<et.o+et.n;X++){const It=a.mode[X];let Ct=qa,yt=0,Gt=0,ee=0,fe=0,Wt=ht>a.thr[X],ct=0,N=0,dt=a.hx[X],pt=a.hz[X],Ut=!1,Nt=0,se=0,re=-1,xe=0;if(It===An.file){const Et=(et.behaviour==="run"||et.behaviour==="surround"?O:I)*a.spd[X];xe=Et*of*1.3;let Mt=a.s[X]+Et*t;Mt>et.total&&(Mt%=et.total),a.s[X]=Mt,Be(et,Mt,B),ct=B[0]-B[3]*a.lat[X],N=B[1]+B[2]*a.lat[X],dt=B[2],pt=B[3];const jt=et.behaviour!=="march"&&et.behaviour!=="stand",D=(jt?1.7:1.15)*a.spd[X]*z;a.ph[X]=(a.ph[X]+D*t)%1,Ct=jt?ef:Uo,yt=Math.floor(a.ph[X]*4)%4,(Mt<a.inAt[X]||Mt>a.outAt[X])&&(Wt=!1),a.wet[X]&&(a.lat[X]*=1-Math.min(1,t*.5))}else if(It===An.knot||It===An.pacer){let Et=a.s0[X];if(It===An.pacer){a.tt[X]+=I*.6*a.spd[X]*t;const jt=a.tt[X]/(2*.7)+a.ph[X],D=2*Math.abs(jt-Math.floor(jt+.5));Et=Math.max(0,Math.min(et.total,a.s0[X]+(D-.5)*2*.7));const G=jt-Math.floor(jt)<.5?1:-1;Be(et,Et,B),dt=B[2]*G,pt=B[3]*G,Ct=Uo,yt=Math.floor((c*1.1*z+a.ph[X])%1*4)}else Be(et,Et,B),et.enemy?(dt=et.enemy[0]-B[0],pt=et.enemy[1]-B[1]):(dt=-B[3],pt=B[2]),Gt=a.dx0[X],ee=a.dy0[X],[Ct,yt]=this.act(X,t,c,n,ae,!1);ct=B[0]-B[3]*a.lat[X],N=B[1]+B[2]*a.lat[X]}else if(It===An.rank){Be(et,a.s0[X],B);const Et=a.st[X];if([Ct,yt]=this.act(X,t,c,n,ae,!0),a.st[X]===1&&Et===1){const Mt=I*.5*t,jt=a.offTo[X]-a.off[X];Math.abs(jt)<=Mt?(a.off[X]=a.offTo[X],a.st[X]=0):a.off[X]+=Math.sign(jt)*Mt,dt=B[2]*Math.sign(jt),pt=B[3]*Math.sign(jt)}else St?(dt=Kt?St.nx:-St.nx,pt=Kt?St.nz:-St.nz):et.enemy&&(dt=et.enemy[0]-B[0],pt=et.enemy[1]-B[1]);ct=B[0]-B[3]*a.lat[X]+B[2]*a.off[X],N=B[1]+B[2]*a.lat[X]+B[3]*a.off[X]}else if(It===An.duel){const Et=this.pairs[a.grp[X]],Mt=this.fronts[Et.front],jt=a.role[X]===0,D=.1*Math.sin(c*2*Math.PI/Et.swayT+Et.sway);ct=Et.x+Mt.nx*D,N=Et.z+Mt.nz*D,dt=jt?Mt.nx:-Mt.nx,pt=jt?Mt.nz:-Mt.nz;const G=Mt.nx*h.rx+Mt.nz*h.rz,K=(Mt.nx*h.ax+Mt.nz*h.az)*h.sinP,tt=Math.hypot(G,K)||1,J=G/tt,bt=K/tt,Lt=(c/Et.period+Et.phase)%1,Pt=jt?Lt<.5:Lt>=.5,Ft=Lt%.5/.5,qt=1.6*Math.sin(c*2*Math.PI/(Et.swayT*1.7)+Et.sway);let $t=(jt?-4:4)+qt;Ct=Xa,n?(Wt=!1,Ct=qa,yt=0):Pt?yt=Ft<.3?0:Ft<.55?1:2:(yt=2,Ft>=.3&&Ft<.7&&($t+=jt?-1:1)),Gt=Math.round($t*J+(jt?-1.5:1.5)*bt*bt),ee=Math.round($t*bt*.8),fe=.01+(jt?1:-1)*Math.sign(K)*.01}else if(It===An.piece||It===An.crew){const Et=this.guns[a.grp[X]];ct=Et.x,N=Et.z,Et.kind==="haul"&&!Et.on&&(Wt=!1);const Mt=a.role[X];dt=Et.ax,pt=Et.az,Mt===0&&(Et.face=this.faceOf(Et.ax,Et.az,Et.face??Oe.right));const jt=Et.face??Oe.right;re=jt;const D=Et.kind==="haul",G=n||Et.kind!=="front"?99:(c/Et.period+Et.phase)%1*Et.period;let K=-1;if(Mt===0)K=G>=3.5&&G<3.65?0:G>=3.65&&G<4.4?1:G>=4.4&&G<5.2?2:-1,fe=jt===Oe.front?.03:.01;else if(jt<=Oe.left){const tt=jt===Oe.right?1:-1;Mt===1?Gt=-11*tt:(Gt=11*tt,fe=.02,D||(re=jt===Oe.right?Oe.left:Oe.right))}else Gt=Mt===1?-9:9,ee=jt===Oe.back?2:3,se=jt===Oe.back==(Mt===1)?1:-1;Mt===1?K=G>=2.6&&G<3.2?0:G>=3.2&&G<3.6?1:G>=3.6&&G<4.3?2:-1:Mt===2&&(K=G<.9?Math.min(2,Math.floor(G/.3)):-1),D?(Ct=Uo,yt=Math.floor((c*1.15*z+.25*Mt)%1*4)):K>=0?(Ct=Xa,yt=K):(Ct=qa,yt=Mt===0?0:Math.floor(c*(.6+.1*Mt)+a.ph[X])&1)}else if(It===An.ring){const Et=et.ring,Mt=n?0:4*Math.max(0,Math.sin(c/(2.4+a.ph[X])*2*Math.PI+a.ph[X]*6.28)),jt=Math.max(.3,Math.hypot(Et.ux*h.rx+Et.uz*h.rz,(Et.ux*h.ax+Et.uz*h.az)*h.sinP)),D=Math.max(.3,Math.hypot(Et.vx*h.rx+Et.vz*h.rz,(Et.vx*h.ax+Et.vz*h.az)*h.sinP)),G=a.row2[X],K=(Math.max(Et.half*jt/C+16,24)+6*G)*C/jt,tt=(28+9*G)*C/D,J=K-Mt*.5*C/jt,bt=tt-Mt*C/D,Lt=Math.sin(a.s0[X]),Pt=Math.cos(a.s0[X]);let Ft=1;if(Et.reach){const qt=Et.ux*K*Lt+Et.vx*tt*Pt,$t=Et.uz*K*Lt+Et.vz*tt*Pt,Xt=Math.hypot(qt,$t);Xt>1e-6&&(Ft=Math.min(1,Math.max(_2(Et.reach,qt,$t),Et.inner)/Xt))}ct=Et.cx+(Et.ux*J*Lt+Et.vx*bt*Pt)*Ft,N=Et.cz+(Et.uz*J*Lt+Et.vz*bt*Pt)*Ft,dt=Et.cx-ct,pt=Et.cz-N,Mt>3?(Ct=Xa,yt=Mt>3.7?1:0):Mt>.3?(Ct=Uo,yt=Math.floor((c*1.3+a.ph[X])%1*4)):[Ct,yt]=this.act(X,t,c,n,!1,!1)}else if(It===An.leap)if(n)Wt=!1,a.st[X]=0;else{if(a.st[X]===0&&(a.tm[X]-=t,Wt=!1,a.tm[X]<=0&&(a.st[X]=1,a.s[X]=0),Be(et,0,B),ct=B[0],N=B[1]),a.st[X]===1){const Mt=a.s[X]+O*Vn.run*t;a.s[X]=Mt,a.tt[X]+=t,Be(et,Math.min(Mt,et.total),B);const jt=Math.max(0,Mt-et.total);if(ct=B[0]+B[2]*jt-B[3]*a.lat[X],N=B[1]+B[3]*jt+B[2]*a.lat[X],dt=B[2],pt=B[3],Ct=ef,yt=Math.floor((a.tt[X]*1.9+a.ph[X])%1*4),Mt>=et.total){const D=s.world.metresAt(ct,N),G=s.world.metresAt(ct+B[2]*.1,N+B[3]*.1);(D-G>6||jt>.6)&&(a.st[X]=2,a.tt[X]=0,a.gx[X]=1e9,this.jump[X*3]=ct,this.jump[X*3+1]=N,this.jump[X*3+2]=D)}}if(a.st[X]>=1){const Mt=et.pts[0],jt=et.pts.at(-1),D=((jt[0]-Mt[0])*h.rx+(jt[1]-Mt[1])*h.rz)/C,G=((jt[0]-Mt[0])*h.ax+(jt[1]-Mt[1])*h.az)*h.sinP/C,K=Math.hypot(D,G)||1,tt=Math.max(0,Vn.least-K)*(a.st[X]===1?Math.min(1,a.s[X]/et.total):1);Gt=a.dx0[X]+Math.round(D/K*tt),ee=Math.round(G/K*tt);const J=et.flank;if(J){const bt=((Mt[0]-J.cx)*h.rx+(Mt[1]-J.cz)*h.rz)/C,Lt=Math.abs(J.ux*h.rx+J.uz*h.rz)*J.half/C+16,Pt=Math.abs(D)>.2*K?Math.sign(D):Math.sign(bt)||1;Gt+=Pt*Math.round(Math.max(0,Lt+4-Pt*bt))}}if(a.st[X]===2){a.tt[X]+=t;const Mt=a.tt[X];Be(et,et.total,B),ct=this.jump[X*3]+B[2]*Vn.across*C*Mt,N=this.jump[X*3+1]+B[3]*Vn.across*C*Mt,dt=B[2],pt=B[3];const jt=Vn.up*Mt-.5*Vn.pull*Mt*Mt;Ut=!0,Nt=this.jump[X*3+2]+jt*C/S,Ct=f2,yt=Mt<.22?0:1+(Math.floor((Mt-.22)/.14)&1),-jt>Vn.fade&&(Wt=!1),Mt>Vn.air&&(a.st[X]=0,a.tm[X]=Math.max(.4,et.n*Vn.gap*(.85+Math.random()*.3)-Mt-et.total/Math.max(1e-6,O*Vn.run)),a.vis[X]=0,Wt=!1)}}a.hx[X]=dt,a.hz[X]=pt;const Le=re>=0?re:this.faceOf(dt,pt,a.face[X]);if(a.face[X]=Le,Le<=Oe.left?se=Le===Oe.left?-1:1:se||(se=It===An.piece||!a.hand[X]?1:-1),a.mirror[X]=se,a.fr[X]=Ct+yt,a.dx[X]=Gt,a.dy[X]=ee,a.x[X]=ct,a.z[X]=N,a.air[X]=Ut?1:0,(vt||Math.abs(ct-a.gx[X])+Math.abs(N-a.gz[X])>.01||(this.frame+X)%30===0)&&(a.gm[X]=s.world.metresAt(ct,N),a.gx[X]=ct,a.gz[X]=N,a.wet[X]=a.gm[X]<.15?1:0,xe>0&&!a.wet[X])){const Et=Math.hypot(dt,pt)||1;s.world.metresAt(ct+dt/Et*xe,N+pt/Et*xe)<.15&&(a.wet[X]=2)}a.wet[X]&&!Ut&&(Wt=!1);const ce=Ut?Nt:a.gm[X],Ve=Ut&&ce+dn*C/S<a.gm[X];Ve&&(Wt=!1),a.lift[X]=ce;const Ln=Math.max(ce,0)*S,_o=(ct-x)*f+(Ln-g)*d+(N-p)*m;(_o>a.far[X]||_o<.05)&&(Wt=!1),Wt&&At++;let Bn=a.vis[X];Bn=Wt?Math.min(1,Bn+U):Math.max(0,Bn-U),(ot<=.002||Ve)&&(Bn=0),a.vis[X]=Bn;const Ti=kt<.5?wt:wt+1;a.k[X]=Bn>0?Ti:0;const ti=X*4;if(q[ti]=ct,q[ti+1]=N,q[ti+2]=Bn,q[ti+3]=a.k[X],Bn<=0||xt>=Rt)continue;xt++;const fs=a.cw[X],fa=(nf[Le]*no+Ct+yt)*fs,da=Ut?0:fs>gl&&a.kind[X]!==Fo.gun?gl:fs;for(let Et=0;Et<2;Et++){if(Et===0?!$:!le)continue;const Mt=ut*4;it[Mt]=ct,it[Mt+1]=ce,it[Mt+2]=N,it[Mt+3]=fe,Y[Mt]=fa,Y[Mt+1]=a.row[X],Y[Mt+2]=fs,Y[Mt+3]=dn,nt[Mt]=Et===0?wt:wt+1,nt[Mt+1]=se*a.tint[X],nt[Mt+2]=Bn,nt[Mt+3]=Gt,rt[Mt]=Et===0?kt:0,rt[Mt+1]=Et===0?1:kt,rt[Mt+2]=ee,rt[Mt+3]=da,ut++}}}if(At>Rt?this.thin=Math.max(.1,this.thin*.92):At<Rt*.85&&this.thin<1&&(this.thin=Math.min(1,this.thin*1.04)),this.drawn=xt,this.instances=ut,this.geometry.instanceCount=ut,this.group.visible=ut>0,ut>0){this.range.count=ut*4;for(const j of this.attrs)j.clearUpdateRanges(),j.updateRanges.push(this.range),j.needsUpdate=!0}}act(t,e,n,s,i,a){const r=this.f;r.tm[t]-=e,s&&r.st[t]>=2&&(r.st[t]=0);const c=r.st[t];let l=qa,h=Math.floor(n/(.9+r.tint[t])+r.ph[t]*2)&1;if(c===1)l=Uo,h=Math.floor((n*1.15+r.ph[t])%1*4);else if(c>=2){r.tt[t]+=e;const u=r.tt[t];l=Xa,c===2?h=u<.55?0:u<.67?1:2:c===3?h=u<.3?0:u<.5?1:2:h=u<1?Math.floor(u/.12)&1:u<1.15?2:3,u>(c===2?1.4:c===3?.8:1.45)&&(r.st[t]=0)}if(r.st[t]===0&&r.tm[t]<=0){const u=Math.random();r.tm[t]=3+Math.random()*7;const f=r.kind[t];i&&f===Fo.musket?(r.st[t]=2,r.tt[t]=0):i&&f===Fo.sling?(r.st[t]=4,r.tt[t]=0):a&&u<.55?(r.st[t]=1,r.offTo[t]=(Math.random()-.5)*.5):i&&u<.8&&(r.st[t]=3,r.tt[t]=0)}return[l,h]}faceOf(t,e,n){const s=this.view,i=t*s.rx+e*s.rz,a=t*s.ax+e*s.az;return i*i+a*a<1e-12?n:(n>=Oe.front?Math.abs(i)<=sf*Math.abs(a):Math.abs(a)>sf*Math.abs(i))?a>0?Oe.back:Oe.front:i>0?Oe.right:Oe.left}scaleAt(){return this.scale.t<.5?this.scale.k:this.scale.k+1}scaleBands(t=this.dpr||1){return M2(t)}screenRect(t){const e=this.f;if(e.vis[t]<=0||!e.k[t])return null;const n=this.app.camera,s=this._v4.set(e.x[t],Math.max(e.lift[t],0)*this.app.world.uniforms.uVert.value,e.z[t],1);if(s.applyMatrix4(n.matrixWorldInverse).applyMatrix4(n.projectionMatrix),s.w<=0)return null;const i=this.own.uViewport.value.x,a=this.own.uViewport.value.y,r=e.k[t],c=Math.floor((s.x/s.w*.5+.5)*i+.5)+e.dx[t]*r,l=Math.floor((s.y/s.w*.5+.5)*a+.5)+e.dy[t]*r,h=e.cw[t]*r,u=dn*r,f=(nf[e.face[t]]*no+e.fr[t])*e.cw[t];return{x:c-h/2,y:a-l-u,w:h,h:u,k:r,cell:[f,e.row[t],e.cw[t],dn],facing:e.mirror[t],face:e.face[t],vis:e.vis[t],solid:this.scale.t===0||this.scale.t===1}}stats(){const t=this.f,e=["right","left","front","back"],n={figures:this.drawn,instances:this.instances,planned:this.count,fronts:this.fronts.length,pairs:this.pairs.length,guns:this.guns.length,sides:{},kinds:{},faces:{},k:{},scale:{k:this.scale.k,t:+this.scale.t.toFixed(3),level:+this.scale.L.toFixed(3)}};for(let s=0;s<this.count;s++){if(t.vis[s]<=0)continue;const i=fr[t.side[s]],a=ql[t.kind[s]];n.sides[i]=(n.sides[i]||0)+1,n.kinds[a]=(n.kinds[a]||0)+1,n.faces[e[t.face[s]]]=(n.faces[e[t.face[s]]]||0)+1,n.k[t.k[s]]=(n.k[t.k[s]]||0)+1}return n}dispose(){this.geometry.dispose(),this.material.dispose(),this.shadowMaterial.dispose(),this.texture.dispose()}}So(Bo,"MODE",An),So(Bo,"KIND",Fo),So(Bo,"FACE",Oe),So(Bo,"WIDTH",Xl);const R2={hawaii:"#f0ae3c",oahu:"#a88fe6",maui:"#d9703f"};class L2{constructor(t,e,n,s,i=null){var a;this.app=t,this.forces=[],this.lines=[];for(const r of e){const c=r.properties||{};if(c.kind!=="force"&&c.kind!=="line"||((a=r.geometry)==null?void 0:a.type)!=="LineString")continue;const l=r.geometry.coordinates.map(d=>t.data.proj.toWorld(d)),h=[0];for(let d=1;d<l.length;d++)h.push(h[d-1]+Math.hypot(l[d][0]-l[d-1][0],l[d][1]-l[d-1][1]));const u=h.at(-1),f={p:c,pts:l,cum:h,total:u,event:c.event,step:Number.isFinite(c.step)?c.step:0,w:0,goal:0,stop:c.stop??null,line:c.kind==="line"};f.line?(f.side=c.side||(c.role==="advance"?"hawaii":"oahu"),f.batch=s.add([{pts:l,width:.75}],{mode:"band",colour:new Ht(R2[f.side]||"#ffffff").toArray(),alpha:0,minPx:6,lift:.01,order:6,endFade:1.2}),f.mid=Xe(r.geometry),f.stand=!0,this.lines.push(f)):f.side=c.role||"oahu",this.forces.push(f)}this.events=new Map;for(const r of this.forces){if(!r.event)continue;let c=this.events.get(r.event);c||this.events.set(r.event,c={id:r.event,from:1/0,to:-1/0,recs:[]}),c.recs.push(r),Number.isFinite(r.p.from)&&(c.from=Math.min(c.from,r.p.from)),Number.isFinite(r.p.to)&&(c.to=Math.max(c.to,r.p.to))}this.soldiers=new Bo(t,this.forces,n,i),this.count=this.soldiers.count,this.marks=this.soldiers.marks,this.group=this.soldiers.group,this.time=0,this.showing={event:null,steps:[],quiet:!1},this.stopShown=0}stepsAt(t,e){var h;const n=this.events.get(t.id),s=t.stops||[];if(!n||e<0||e>=s.length)return[];const i=(h=this.app.tour)==null?void 0:h.places,a=this.app.data.proj,r=[];for(const u of n.recs){if(u.p.kind!=="line"||!u.mid)continue;const[f,d]=a.toWorld(u.mid);let m=-1,x=6;s.forEach((g,p)=>{const v=i==null?void 0:i.get(g.place),w=v&&Xe(v.geometry);if(!w)return;const[b,y]=a.toWorld(w),S=Math.hypot(b-f,y-d);S<x&&(x=S,m=p)}),m>=0&&r.push(m-u.step)}r.sort((u,f)=>u-f);const c=r.length?r[Math.floor(r.length/2)]:0,l=new Set;for(const u of n.recs){const f=u.step+c;(f===e||e===s.length-1&&f>e)&&l.add(u.step)}return[...l].sort((u,f)=>u-f)}namedStops(t,e){if(t.stop===null||t.stop===void 0)return null;const n=[];for(const s of Array.isArray(t.stop)?t.stop:[t.stop])Number.isInteger(s)?n.push(s):typeof s=="string"&&(e.stops||[]).forEach((i,a)=>i.place===s&&n.push(a));return n}shownAt(t,e){const n=this.events.get(t.id),s=new Set;if(!n)return s;let i=null;for(const a of n.recs){const r=this.namedStops(a,t);if(r){r.includes(e)&&s.add(a);continue}i||(i=this.stepsAt(t,e)),i.includes(a.step)&&s.add(a)}return s}choose(){var s;const t=this.app.tour,e=t!=null&&t.active?t.event:null;if(e&&this.events.has(e.id)&&t.stop>=0){if(((s=this._at)==null?void 0:s.ev)!==e||this._at.stop!==t.stop){const i=this.shownAt(e,t.stop);this._at={ev:e,stop:t.stop,now:{event:e.id,recs:i,steps:[...new Set([...i].map(a=>a.step))].sort((a,r)=>a-r),quiet:!1}}}return this._at.now}this._at=null;const n=this.app.timeline.year;for(const i of this.events.values())if(n>=i.from&&n<i.to+1)return(this._quiet||(this._quiet=new Map)).get(i.id)||this._quiet.set(i.id,{event:i.id,recs:null,steps:null,quiet:!0}).get(i.id);return this._none||(this._none={event:null,recs:new Set,steps:[],quiet:!1})}update(t,e,n=0){e*=1-P2(75,140,n),this.time+=t;const s=this.choose();this.showing=s;const i=t>0?1-Math.exp(-t*2):1;for(const r of this.forces){const c=r.event===s.event&&(s.recs===null||s.recs.has(r));r.goal=c?s.quiet?.2:1:0,r.w+=(r.goal-r.w)*i,Math.abs(r.goal-r.w)<.003&&(r.w=r.goal)}for(const r of this.lines)r.batch&&(r.batch.uniforms.uAlpha.value=.26*r.w*e);let a=0;if(!s.quiet&&s.recs)for(const r of s.recs)a=Math.max(a,r.w);this.stopShown=a*e,this.soldiers.update(t,e,s.quiet),this.marksShown=this.soldiers.drawn}stats(){const t=this.choose(),e=n=>n.event===t.event&&(t.recs===null||t.recs.has(n));return{event:t.event,steps:t.steps,quiet:t.quiet,by:t.recs?[...new Set([...t.recs].map(n=>n.stop===null||n.stop===void 0?"inferred":"named"))].join("+")||"none":"year",forces:this.forces.filter(n=>e(n)&&!n.stand).map(n=>n.p.name),lines:this.lines.filter(e).map(n=>n.p.name),marks:this.count,marksShown:this.marksShown??0,...this.soldiers.stats()}}dispose(){this.soldiers.dispose()}}function P2(o,t,e){const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)}const ji={frame:-1,list:[]},k2=o=>1-Math.max(0,Math.min(1,(o-32)/30));class Sp{constructor(t,e,{items:n=null,alive:s=null,zoom:i=k2,cls:a="dlabel",layer:r="dlabels",avoid:c="",lang:l="haw"}={}){this.app=t,this.zoom=i,this.alive=s||((f,d)=>Yr(f.p,d)),this.avoid=c;const h=document.getElementById("ui")||document.body;this.layer=document.createElement("div"),this.layer.className=r,h.insertBefore(this.layer,h.querySelector(".pins")||h.firstChild),this.items=[];const u=n??e.flatMap(f=>{const d=f.properties||{};if(d.kind!=="label"||!d.name)return[];const m=Xe(f.geometry);if(!m)return[];const[x,g]=t.data.proj.toWorld(m);return[{p:d,name:d.name,x,z:g}]});for(const f of u){const d=document.createElement("div");d.className=f.cls||a,d.textContent=f.name,l&&(d.lang=l),this.layer.appendChild(d),this.items.push({...f,el:d,v:new W,shown:-1,tx:NaN,ty:NaN})}this.panels=[],this.frame=0}panelRects(){if(this.frame++%15===0){this.panels=[];for(const t of document.querySelectorAll(`.card, .timeline, .legend, .tools, .brand, .inspector${this.avoid?`, ${this.avoid}`:""}`)){if(t.hidden||!t.offsetParent)continue;const e=t.getBoundingClientRect();e.width>0&&e.height>0&&this.panels.push(e)}}return this.panels}update(t){const e=this.app,n=e.camera,s=innerWidth,i=innerHeight,a=e.rig.state.distance,r=this.zoom(a);ji.frame!==e.frames?(ji.frame=e.frames,ji.list.length=0):ji.list=ji.list.filter(f=>f[3]!==this);const c=ji.list,l=this.panelRects(),h=e.timeline.year,u=new Set;for(const f of this.items){let d=t*r*(this.alive(f,h)?1:0);if(d>.01&&u.has(f.name)&&(d=0),d>.01){f.v.set(f.x,e.world.heightAt(f.x,f.z)+.05,f.z).project(n),(f.v.z>1||f.v.z<-1)&&(d=0);const x=(f.v.x+1)/2*s,g=(1-f.v.y)/2*i;(x<-80||x>s+80||g<60||g>i+20)&&(d=0);const p=f.el.offsetWidth||60;d>.01&&l.some(v=>x+p/2>v.left-4&&x-p/2<v.right+4&&g+10>v.top-4&&g-10<v.bottom+4)&&(d=0),d>.01&&c.some(v=>Math.abs(v[0]-x)<(v[2]+p)/2+6&&Math.abs(v[1]-g)<18)&&(d=0),d>.01&&(c.push([x,g,p,this]),u.add(f.name)),d>.01&&!(Math.abs(x-f.tx)<=.3&&Math.abs(g-f.ty)<=.3)&&(f.el.style.transform=`translate(${x.toFixed(1)}px, ${g.toFixed(1)}px)`,f.tx=x,f.ty=g)}const m=Math.round(d*20)/20;m!==f.shown&&(f.el.style.opacity=String(m),f.el.style.visibility=m>0?"visible":"hidden",f.shown=m)}}visible(){return this.items.filter(t=>t.shown>.5).map(t=>t.name)}rects(){return this.items.filter(t=>t.shown>.5).map(t=>{const e=t.el.getBoundingClientRect();return{name:t.name,left:e.left,top:e.top,right:e.right,bottom:e.bottom}})}dispose(){this.layer.remove()}}const on=4,Ep={limewash:"#d6d0c0",cream:"#ccbf9f",paleGrey:"#b6b1a4",sage:"#959d86",ochre:"#b59967",duskRed:"#8f6152",paleBlue:"#98a5a4",shingle:"#6c665c",iron:"#6e706c",ironRed:"#7f5446",ironGreen:"#6f7a6a",coral:"#cbc1a8",adobe:"#b39b78",brick:"#97684f",stoneGrey:"#a19b90",concrete:"#c2bdb1",concreteWarm:"#c9bea6",glass:"#6a7f88",dark:"#4b4743",post:"#8a7b66",plinth:"#77706a",asphalt:"#6d6a66"},at=Ep;function Re(o,t,e,n,s,i=0,a=0,r=on){o.box(i,-r,a,t,n+r,e,s,st.stone)}function Zn(o,t,e,n,s,i,a,r,{alongZ:c=!1,wallMat:l=st.plain,roofMat:h=st.roof,x:u=0,z:f=0,oe:d=i*.6}={}){const m=c?C=>[u+C[2],C[1],f+C[0]]:C=>[u+C[0],C[1],f+C[2]],x=c?e:t,g=c?t:e,p=s/(g/2),v=n-p*i,w=x/2+d,b=g/2+i,y=m([-w,v,-b]),S=m([w,v,-b]),E=m([-w,n+s,0]),T=m([w,n+s,0]),_=m([-w,v,b]),M=m([w,v,b]),A=c?(C,z,I,O,U,V)=>o.quad(O,I,z,C,U,V):(C,z,I,O,U,V)=>o.quad(C,z,I,O,U,V),R=c?(C,z,I,O,U)=>o.tri(I,z,C,O,U):(C,z,I,O,U)=>o.tri(C,z,I,O,U);A(y,E,T,S,a,h),A(M,T,E,_,a.map(C=>C*.84),h);const k=x/2;R(m([-k,n,-g/2]),m([-k,n,g/2]),m([-k,n+s,0]),r,l),R(m([k,n,g/2]),m([k,n,-g/2]),m([k,n+s,0]),r,l)}function Zs(o,t,e,n,s,i,a,{roofMat:r=st.roof,x:c=0,z:l=0}={}){const h=s/(e/2),u=n-h*i,f=t/2+i,d=e/2+i,m=Math.max(0,(t-e)/2),x=(v,w)=>[c+v*f,u,l+w*d],g=v=>[c+v*m,n+s,l],p=a.map(v=>v*.84);o.quad(x(-1,-1),g(-1),g(1),x(1,-1),a,r),o.quad(x(1,1),g(1),g(-1),x(-1,1),p,r),o.tri(x(-1,1),g(-1),x(-1,-1),a.map(v=>v*.92),r),o.tri(x(1,-1),g(1),x(1,1),a.map(v=>v*.92),r)}function Ap(o,t,e,n,s,i=0,a=0,r=st.roof){const c=t/2,l=[i,e+n,a],h=(u,f)=>[i+u*c,e,a+f*c];o.tri(h(-1,-1),l,h(1,-1),s,r),o.tri(h(1,1),l,h(-1,1),s.map(u=>u*.84),r),o.tri(h(-1,1),l,h(-1,-1),s.map(u=>u*.92),r),o.tri(h(1,-1),l,h(1,1),s.map(u=>u*.92),r)}function Kn(o,t,e,n,s,i,a,r,c,{posts:l=2,x:h=0,from:u=e/2}={}){const f=e/2,d=f+n;d-u>.05&&o.box(h,s-.35,(u+d)/2,t,.35,d-u,c,st.wood);const m=[h-t/2-.2,i,f],x=[h+t/2+.2,i,f],g=[h+t/2+.2,a,d+.3],p=[h-t/2-.2,a,d+.3];o.quad(m,p,g,x,r,st.roof);for(let v=0;v<l;v++){const w=h-t/2+.3+(t-.6)*v/Math.max(1,l-1);o.box(w,s,d-.2,.28,a-s,.28,c,st.wood)}}function ls(o,t,e,n,s=0,i=0){o.box(i,s,t/2+.15,e,n,.3,gt(at.dark,0),st.plain)}const D2=[[8.2,5,5.6],[7,4.6,5],[6,4.2,4.6],[5.2,4,4.4]];function z2(o,[t,e,n]){const s=new be;return Rr(s,o,t,e,n,!0,on),s}const Fc=[[[-3,-4,.06,0],[5.6,-2.8,1.64,2],[-3.4,4.6,.12,3]],[[-1.6,-2.6,.15,0],[4.2,4.4,1.45,3]],[[-4.2,-4.2,-.05,1],[4.6,-3.6,1.6,2],[-4.8,4,1.5,2],[3.6,4.4,.08,3]],[[.2,-3.5,.04,1],[-4,4,-.06,2],[4.6,3.6,1.62,3]]];function I2(o,t){const e=new be;return e.at(0,0,-2.2,0,1),Rr(e,o,6.8+t*.6,4.6,5.2,!0,on),e.done(),e.at(t?-2.6:2.6,0,4.6,Math.PI/2,1),Rr(e,o,3.6,2.8,3.4,!1,on),e.done(),e}function F2(o,t){const e=new be,n=gt([at.limewash,at.cream,at.paleGrey][t],.06,o),s=gt(at.shingle,.1,o),i=gt(at.post,.1,o);return t===0?(Re(e,9+.4,7+.4,.6,gt(at.plinth,.1,o)),e.box(0,.6,0,9,3,7,n,st.clap),Zn(e,9,7,3.6,2.6,.5,s,n,{wallMat:st.clap}),Kn(e,9,7,2.2,.6,3.3,2.7,s,i,{from:7/2+.2}),ls(e,7,1.1,2.1,.6)):t===1?(Re(e,8+.4,6.5+.4,.5,gt(at.plinth,.1,o)),e.box(0,.5,0,8,5.8,6.5,n,st.clap),Zn(e,8,6.5,6.3,2.4,.5,s,n,{wallMat:st.clap}),Kn(e,8,6.5,2,3.4,5.8,5.4,s,i),Kn(e,8,6.5,2,.5,3.4,3.1,s,i,{from:6.5/2+.2})):(Re(e,9.6+.4,7+.4,.6,gt(at.plinth,.1,o)),e.box(0,.6,0,9.6,2.9,7,n,st.clap),Zs(e,9.6,7,3.5,2.2,.5,s),Kn(e,9.6-1.5,7,2.3,.6,3.2,2.6,s,i,{posts:3,from:7/2+.2})),e}function U2(o,t){const e=new be;if(t===0){const i=gt(at.adobe,.08,o);Re(e,9+.6,6+.6,.3,gt(at.plinth,.1,o)),e.box(0,.3,0,9,2.8,6,i,st.masonry),Zs(e,9,6,3.1,2.8,.7,gt("#a58a5c",.12,o),{roofMat:st.thatch}),ls(e,6,1.1,2,.3)}else{const i=gt(at.coral,.06,o);Re(e,10.4+.4,8+.4,.4,gt(at.plinth,.1,o)),e.box(0,.4,0,10.4,6.4,8,i,st.masonry),Zs(e,10.4,8,6.8,2,.4,gt(at.shingle,.1,o)),Kn(e,10.4,8,2.2,3.6,6.4,6,gt(at.shingle,.1,o),gt(at.post,.1,o),{posts:3}),Kn(e,10.4,8,2.2,.4,3.6,3.2,gt(at.shingle,.1,o),gt(at.post,.1,o),{posts:3,from:8/2+.2})}return e}function N2(o,t){const e=new be,n=gt([at.limewash,at.sage,at.cream][t],.06,o),s=gt([at.iron,at.ironRed,at.ironGreen][t],.08,o),i=gt(at.limewash,.05,o);return Re(e,9.4,8.4,.9,gt(at.plinth,.1,o)),t===1?(e.box(-1.5,.9,-1,7,3.1,6,n,st.clap),Zn(e,7,6,4,2.5,.5,s,n,{wallMat:st.clap,x:-1.5,z:-1}),e.box(2.6,.85,1.05,4,3.1,6.9,n,st.clap),Zn(e,4,6.9,3.95,2,.45,s,n,{wallMat:st.clap,alongZ:!0,x:2.6,z:1.05}),Kn(e,4.5,4,2,.9,3.7,3.2,s,i,{x:-2.3,from:4.2})):(e.box(0,.9,0,9,3.1,7.5,n,st.clap),t===0?Zn(e,9,7.5,4,2.7,.5,s,n,{wallMat:st.clap}):Zs(e,9,7.5,4,2.4,.55,s),Kn(e,9,7.5,2.4,.9,3.8,3.2,s,i,{posts:3,from:4.2}),ls(e,7.5,1,2.2,.9)),e}function O2(o,t,e=5.8){const n=new be,s=12,i=[at.cream,at.limewash,at.ochre,at.paleBlue,at.sage,at.duskRed],a=gt(at.iron,.1,o),r=gt(at.post,.1,o);Re(n,t*e+.4,s+.4,.3,gt(at.plinth,.1,o));for(let c=0;c<t;c++){const l=(c-(t-1)/2)*e,h=gt(i[Math.floor(o()*i.length)],.08,o),u=4.2+o()*1.4;n.box(l,.3,0,e-.15,u,s,h,st.clap);const f=[l-e/2+.075,.3+u-.2,s/2-.6],d=[l+e/2-.075,.3+u-.2,s/2-.6],m=[l+e/2-.075,.3+u-1.3,-s/2-.4],x=[l-e/2+.075,.3+u-1.3,-s/2-.4];n.quad(f,d,m,x,gt(at.iron,.1,o),st.roof),n.box(l,.3+u,s/2-.175,e-.15,1.4+o()*1,.35,h,st.clap),ls(n,s,1.6,2.4,.3,l)}return Kn(n,t*e,s,2.6,.3,3.4,3.1,a,r,{posts:t+1,from:s/2+.2}),n}function B2(o,t){const e=new be,n=[2,3,3][t],s=[11,10.5,11.2][t],i=[12,13,11][t],a=.4+n*3.7,r=gt([at.brick,at.stoneGrey,at.concreteWarm][t],.07,o);return Re(e,s+.3,i+.3,.4,gt(at.plinth,.1,o)),e.box(0,.4,0,s,a-.4,i,r,st.windows),e.box(0,a,0,s+.5,.45,i+.5,r.map(c=>c*.86),st.masonry),e.box(0,a+.45,0,s,.6,i,r.map(c=>c*.95),st.masonry),t===2&&Kn(e,s,i,2.5,.4,4,3.8,gt(at.iron,.1,o),gt(at.dark,.1,o),{posts:4,from:i/2+.15}),e}function Tp(o,t){const e=new be,n=gt([at.cream,at.sage,at.paleGrey][t],.07,o),s=gt([at.ironGreen,at.iron,at.ironRed][t],.1,o),i=[9.8,10,10.2][t],a=[8.6,9.5,8][t];return Re(e,i,a,.8,gt(at.plinth,.1,o)),e.box(0,.8,0,i,2.8,a,n,st.clap),t===1?(Zn(e,i,a,3.6,2,.8,s,n,{wallMat:st.clap}),Kn(e,6,a,2.6,.8,3.4,2.9,s,gt(at.limewash,.05,o),{x:-1.5})):(Zs(e,i+1.2,a+2.4,3.6,1.8,.7,s,{z:1.2}),e.box(0,.8,a/2+1.25,i-.4,.2,2.3,gt(at.post,.1,o),st.wood)),e}function W2(o,t){const e=new be,n=[6,8][t],s=[13.6,13][t],i=[14,15][t],a=n*3.6,r=gt([at.concreteWarm,at.stoneGrey][t],.06,o);return Re(e,s+.3,i+.3,.3,gt(at.plinth,.1,o)),e.box(0,.3,0,s,4.4,i,r.map(c=>c*.9),st.masonry),e.box(0,4.7,0,s,a-4.4,i,r,st.windows),e.box(0,a+.3,0,s+.6,.6,i+.6,r.map(c=>c*.85),st.masonry),e.box(-s/4,a+.9,-i/5,3.5,2.2,3.5,r.map(c=>c*.9),st.plain),e}function H2(o,t){const e=new be,n=gt([at.limewash,at.concreteWarm,at.paleBlue][t],.07,o),s=gt([at.iron,at.shingle,at.ironGreen][t],.1,o);if(t===2)return Re(e,9,8,.3,gt(at.plinth,.1,o)),e.box(0,.3,0,9,5.4,8,n,st.plain),Zn(e,9,8,5.7,1.4,.6,s,n),e;const i=11.5,a=9;return Re(e,i,a,.3,gt(at.plinth,.1,o)),e.box(-1.5,.3,0,i-3,2.7,a,n,st.plain),Zs(e,i-3,a,3,1.3,.7,s,{x:-1.5}),e.box(i/2-1.5,2.6,.4,3.2,.25,a-1.2,s.map(r=>r*.9),st.plain),e.box(i/2-.1,.3,a/2-1,.25,2.3,.25,n,st.plain),t===1&&e.box(-3.2,-on,-a/2-1.4,4.4,on+2.7,2.8,n.map(r=>r*.95),st.plain),e}function G2(o,t){const e=new be,n=[3,4][t],s=18.4,i=10,a=n*3.1,r=gt([at.concrete,at.cream][t],.06,o);Re(e,s,i+2,.6,gt(at.plinth,.1,o)),e.box(0,.6,-.8,s,a,i-1.6,r,st.windows);for(let c=1;c<=n;c++)e.box(0,.6+c*3.1-.3,i/2-.4,s-.3,.3,1.6,r.map(l=>l*.9),st.plain);return Zs(e,s,i-1.6,a+.6,1.2,.4,gt(at.iron,.1,o),{z:-.8}),e}const _s=60;function Cp(o,t){const e=new be,n=gt([at.concrete,at.concreteWarm,at.limewash][t],.06,o),s=n.map((i,a)=>i*.75+gt(at.glass,0,o)[a]*.25);return t===0?(e.box(0,-on*3,0,29,on*3+6,18,n.map(i=>i*.9),st.masonry),e.box(0,6,0,27,_s-6,13,s,st.windows),e.box(0,_s,0,27.6,1.2,13.6,n.map(i=>i*.85),st.plain)):t===1?(e.box(0,-on*3,0,22,on*3+1,22,n.map(i=>i*.9),st.masonry),e.box(0,1,0,20,_s-1,20,s,st.windows),e.box(0,_s,0,8,3,8,n.map(i=>i*.8),st.plain)):(e.box(0,-on*3,0,28,on*3+9,26,n.map(i=>i*.88),st.windows),e.box(-2,9,-2,17,_s-9,16,s,st.windows),e.box(-2,_s,-2,17.6,1,16.6,n.map(i=>i*.85),st.plain)),e}function V2(o,t){const e=new be,n=gt([at.concrete,at.paleGrey,at.stoneGrey][t],.08,o),s=gt([at.iron,at.ironGreen,at.iron][t],.1,o),i=[12,12.2,11.6][t],a=[12.5,12,13][t];if(Re(e,i+.3,a+.3,.25,gt(at.plinth,.1,o)),t===1){e.box(0,.25,0,i,4.6,a,n,st.plain);const c=3,l=a/c;for(let h=0;h<c;h++){const u=-a/2+h*l,f=u+l,d=.25+4.6,m=d+2.2,x=-i/2,g=i/2;e.quad([x,d,u],[x,m,f],[g,m,f],[g,d,u],s,st.roof),e.quad([x,m,f],[x,d,f],[g,d,f],[g,m,f],gt(at.glass,.05,o),st.plain),e.tri([x,d,u],[x,d,f],[x,m,f],n,st.plain),e.tri([g,d,f],[g,d,u],[g,m,f],n,st.plain)}ls(e,a,3.6,3.4,.25)}else{const r=t===0?5.2:3.8;e.box(0,.25,0,i,r,a,n,st.clap),Zn(e,i,a,.25+r,t===0?1.6:2.6,.4,s,n,{alongZ:!0,wallMat:st.clap,roofMat:st.roof}),ls(e,a,t===0?4.2:6.5,t===0?4:3.4,.25)}return e}function Rp(o){const t=new be,e=gt(at.coral,.04,o),n=gt(at.shingle,.08,o),s=24,i=44;Re(t,s+1,i+1,.8,gt(at.plinth,.08,o)),t.box(0,.8,-2,s,9.2,i-4,e,st.masonry),Zn(t,s,i-4,10,6.5,.6,n,e,{alongZ:!0,wallMat:st.masonry,z:-2}),t.box(0,.75,i/2-3.6,9,22.05,8.4,e,st.masonry),t.box(0,22.8,i/2-3.6,9.6,.8,9,e.map(a=>a*.88),st.masonry);for(const[a,r]of[[-1,-1],[1,-1],[1,1],[-1,1]])t.box(a*4,23.6,i/2-3.6+r*3.5,1.2,1.4,1.2,e,st.masonry);return ls(t,2*(i/2-3.6+4.2),2.2,4,.8),t}function $2(o){const t=new be,e=gt(at.limewash,.03,o),n=gt(at.iron,.08,o),s=13,i=24;return Re(t,s+.6,i+.6,.8,gt(at.plinth,.08,o)),t.box(0,.8,-1,s,6.4,i-2,e,st.clap),Zn(t,s,i-2,7.2,4.6,.5,n,e,{alongZ:!0,wallMat:st.clap,z:-1}),t.box(0,.75,i/2-1.3,4.5,14.05,4.9,e,st.clap),Ap(t,4.8,14.8,12,n,0,i/2-1.3),t}function j2(o){const t=new be,e=gt(at.concreteWarm,.03,o);return Re(t,14,14,.5,gt(at.plinth,.08,o)),t.box(0,.5,0,12,40,12,e,st.windows),t.box(0,40.5,0,13,6,13,e.map(n=>n*.93),st.masonry),Ap(t,13,46.5,7,gt(at.ironGreen,.05,o)),t.cyl([0,53.5,0],[0,60,0],.25,.15,gt(at.dark,0),st.plain,4),t}const ua=8;function q2(o){const t=new be,e=gt(at.concrete,.05,o),n=gt([at.iron,at.ironGreen][o()<.5?0:1],.06,o),s=60,i=48,a=9;Re(t,s+.6,i+.6,.3,gt(at.plinth,.08,o),0,0,ua),t.box(0,.3,0,s,a,i,e,st.plain);const r=.3+a,c=[[i/2+.4,r-.2],[i/3,r+3.2],[i/6,r+5],[0,r+5.6]];for(let u=0;u+1<c.length;u++){const[f,d]=c[u],[m,x]=c[u+1];t.quad([-s/2-.4,d,f],[s/2+.4,d,f],[s/2+.4,x,m],[-s/2-.4,x,m],n,st.roof),t.quad([s/2+.4,d,-f],[-s/2-.4,d,-f],[-s/2-.4,x,-m],[s/2+.4,x,-m],n.map(g=>g*.86),st.roof)}const l=u=>{for(let f=0;f+1<c.length;f++){const[d,m]=c[f],[x,g]=c[f+1];if(u<=d&&u>=x)return m+(g-m)*(d-u)/(d-x)}return r},h=[i/2,i/3,i/6,0];for(const u of[-1,1]){const f=u*s/2;for(let d=0;d+1<h.length;d++)for(const m of[1,-1]){const x=m>0?h[d]:-h[d+1],g=m>0?h[d+1]:-h[d],p=[f,r,x],v=[f,r,g],w=[f,l(Math.abs(g)),g],b=[f,l(Math.abs(x)),x];u>0?t.quad(p,v,w,b,e,st.plain):t.quad(b,w,v,p,e,st.plain)}}return ls(t,i,s*.8,a-1.2,.3),t}function cf(o,t){const e=new be,n=gt([at.concrete,at.concreteWarm,at.limewash][Math.floor(o()*3)],.05,o),s=56,i=16,a=t*3.4;return Re(e,s+.4,i+.4,.6,gt(at.plinth,.08,o),0,0,ua),e.box(0,.6,0,s,a,i,n,st.windows),Zs(e,s,i,.6+a,2.6,.9,gt([at.ironRed,at.ironGreen,at.iron][Math.floor(o()*3)],.08,o)),ls(e,i,2.4,2.6,.6),e}function X2(o){const t=new be,e=gt(at.concrete,.06,o),n=26,s=14;return Re(t,n+.4,s+.4,.4,gt(at.plinth,.08,o),0,0,ua),t.box(0,.4,0,n,4.2,s,e,st.clap),Zn(t,n,s,4.6,1.6,.5,gt(at.iron,.08,o),e,{wallMat:st.clap}),ls(t,s,3.2,3,.4),t}function Y2(o){const t=new be,e=gt(at.concrete,.05,o),n=30,s=22,i=4*3.6;return Re(t,n+.4,s+.4,.5,gt(at.plinth,.08,o),0,0,ua),t.box(0,.5,0,n,i,s,e,st.windows),t.box(0,.5+i,0,n+.4,.8,s+.4,e.map(a=>a*.88),st.plain),t}function K2(o){const t=(e,n,s,i=1,a=ua)=>{const r=sa(e.geometry());r.computeBoundingBox();const c=r.boundingBox;return{geometry:r,hx:Math.max(-c.min.x,c.max.x),hz:Math.max(-c.min.z,c.max.z),box:[c.min.x,c.max.x,c.min.z,c.max.z],top:c.max.y,tris:r.index.count/3,L:n,W:s,storeys:i,foot:a}};return{hangar:t(q2(o),60,48),barracks2:t(cf(o,2),56,16,2),barracks3:t(cf(o,3),56,16,3),low:t(X2(o),26,14),block:t(Y2(o),30,22,4),tower:t(Cp(o,0),29,18,Math.round(_s/3.5),on*3),church:t(Rp(o),25,45,1,on),house:t(Tp(o,0),9.8,8.6,1,on)}}function Lp(o,t={}){const e={},n=(s,i)=>{e[s]=i.map(a=>{const r=sa(a.geometry());r.computeBoundingBox();const c=r.boundingBox;r.dispose();const l=on*(s==="tower"?3:1)+.25;t[s]&&a.box(0,-l,0,t[s][0],l+.2,t[s][1],gt(at.concrete,.05,o).map(u=>u*.88),st.plain);const h=sa(a.geometry());return{geometry:h,hx:Math.max(-c.min.x,c.max.x),hz:Math.max(-c.min.z,c.max.z),box:[c.min.x,c.max.x,c.min.z,c.max.z],top:c.max.y,tris:h.index.count/3}})};return n("kauhale",D2.map(s=>z2(o,s))),n("hale",[0,1].map(s=>I2(o,s))),n("frame",[0,1,2].map(s=>F2(o,s))),n("adobe",[0,1].map(s=>U2(o,s))),n("cottage",[0,1,2].map(s=>N2(o,s))),n("store",[[2,5.8],[1,9.4]].map(([s,i])=>O2(o,s,i))),n("block",[0,1,2].map(s=>B2(o,s))),n("bungalow",[0,1,2].map(s=>Tp(o,s))),n("midrise",[0,1].map(s=>W2(o,s))),n("house",[0,1,2].map(s=>H2(o,s))),n("walkup",[0,1].map(s=>G2(o,s))),n("tower",[0,1,2].map(s=>Cp(o,s))),n("shed",[0,1,2].map(s=>V2(o,s))),n("church",[Rp(o)]),n("spire",[$2(o)]),n("clock",[j2(o)]),e}function Yl(o=2,t=5e4){const e=Math.log(1+t/o),n=new Float32Array(256);for(let s=0;s<256;s++)n[s]=o*(Math.exp(s/255*e)-1);return{lut:n,decode:s=>o*(Math.exp(s/255*e)-1),encode:s=>Math.max(0,Math.min(255,Math.round(255*Math.log(1+Math.max(0,s)/o)/e)))}}const Z2=o=>Math.max(1,Math.round(60/Math.max(1,o)));async function Uc(o,t){const{arch:e}=o,n=Yl(o.d0,o.dMax),s=e.W,i=e.H,a=e.rect,r=o.islands,c=new Int8Array(s*i).fill(-1),l=(a.x1-a.x0)/s,h=(a.z1-a.z0)/i;for(let x=0;x<i;x++){const g=a.z0+(x+.5)*h;for(let p=0;p<s;p++){const v=a.x0+(p+.5)*l;let w=0,b=-1;for(let y=0;y<r.length;y++){const S=r[y].rect,E=Math.min(v-S.x0,S.x1-v,g-S.z0,S.z1-g);E>w&&(w=E,b=y)}c[x*s+p]=b}}const u=new Float32Array(s*i*3),f=new Float32Array(s*i),d={kf:o.kf,arch:null,islands:[]};for(let x=0;x<r.length;x++){const g=r[x],{W:p,H:v}=g,[w,b,y]=await Promise.all(["cultivation","settlement","forest"].map(R=>J2(g.layers[R],p,v,t,`${g.id} ${R}`))),S=g.land&&g.land.length===p*v?g.land:null,E=g.rect,T=(E.x1-E.x0)/p,_=(E.z1-E.z0)/v,M=new Int32Array(p);for(let R=0;R<p;R++)M[R]=Math.floor((E.x0+(R+.5)*T-a.x0)/l);for(let R=0;R<v;R++){const k=Math.floor((E.z0+(R+.5)*_-a.z0)/h);if(k<0||k>=i)continue;const C=R*p;for(let z=0;z<p;z++){const I=M[z];if(I<0||I>=s)continue;const O=k*s+I;if(c[O]!==x)continue;const U=C+z;S&&!S[U]||(u[O*3]+=w[U],u[O*3+1]+=n.lut[b[U]],u[O*3+2]+=y[U],f[O]++)}}const A=Math.max(1,g.f||1);if(A===1){const R=new Uint8Array(p*v*4);for(let k=0;k<p*v;k++)R[k*4]=w[k],R[k*4+1]=b[k],R[k*4+2]=y[k],R[k*4+3]=255;S&&Nc(R,p,v,S,2),d.islands.push({id:g.id,W:p,H:v,data:R})}else{const R=Math.max(1,Math.round(p/A)),k=Math.max(1,Math.round(v/A)),C=new Float32Array(R*k*3),z=new Float32Array(R*k),I=new Int32Array(p);for(let U=0;U<p;U++)I[U]=Math.min(R-1,Math.floor((U+.5)*R/p));for(let U=0;U<v;U++){const V=Math.min(k-1,Math.floor((U+.5)*k/v))*R;for(let B=0;B<p;B++){const q=U*p+B;if(S&&!S[q])continue;const it=V+I[B];C[it*3]+=w[q],C[it*3+1]+=n.lut[b[q]],C[it*3+2]+=y[q],z[it]++}}const O=lf(C,z,R*k,n);Nc(O,R,k,z,2),d.islands.push({id:g.id,W:R,H:k,data:O})}}const m=lf(u,f,s*i,n);return Nc(m,s,i,f,3),d.arch={W:s,H:i,data:m},d}function Nc(o,t,e,n,s){let i=Uint8Array.from(n,a=>a?1:0);for(let a=0;a<s;a++){const r=i.slice();for(let c=0;c<e;c++)for(let l=0;l<t;l++){const h=c*t+l;if(i[h])continue;let u=0,f=0,d=0,m=0;const x=g=>{i[g]&&(u++,f+=o[g*4],d+=o[g*4+1],m+=o[g*4+2])};l>0&&x(h-1),l<t-1&&x(h+1),c>0&&x(h-t),c<e-1&&x(h+t),u&&(o[h*4]=Math.round(f/u),o[h*4+1]=Math.round(d/u),o[h*4+2]=Math.round(m/u),r[h]=1)}i=r}}function lf(o,t,e,n){const s=new Uint8Array(e*4);for(let i=0;i<e;i++){const a=t[i];s[i*4+3]=255,a&&(s[i*4]=Math.round(o[i*3]/a),s[i*4+1]=n.encode(o[i*3+1]/a),s[i*4+2]=Math.round(o[i*3+2]/a))}return s}async function J2(o,t,e,n,s){if(!o)return new Uint8Array(t*e);if(typeof o=="string")return Oc(await n(o),t,e,o);const[i,a]=await Promise.all([n(o.from),n(o.to)]),r=Oc(i,t,e,o.from),c=Oc(a,t,e,o.to),l=o.t,h=new Uint8Array(t*e);for(let u=0;u<t*e;u++)h[u]=Math.round(r[u]+(c[u]-r[u])*l);return h}function Oc(o,t,e,n){if(o.W!==t||o.H!==e)throw new Error(`${n} is ${o.W}×${o.H}, the pack is ${t}×${e}`);return o.px}async function go(o,t){const{px:e,W:n,H:s}=await o(t),i=new Uint8Array(n*s);for(let a=0,r=0;a<n*s;a++,r+=4)i[a]=e[r];return{px:i,W:n,H:s}}const hf=["cultivation","settlement","forest"],Q2={cultivation:"Cultivation",settlement:"Settlement",forest:"Native forest"},mi=[1100,1450],t_=3,Ka=.002,e_=10,Zi=(o,t,e)=>Math.max(t,Math.min(e,o)),uf=(o,t,e)=>{const n=Zi((e-o)/(t-o),0,1);return n*n*(3-2*n)};function n_(){const o=new We(new Uint8Array([0,0,0,255]),1,1,Ae,pe);return o.needsUpdate=!0,o}function s_(o){var n;const t=(n=o.data)==null?void 0:n.metres;if(!t)return null;const e=new Uint8Array(t.length);for(let s=0;s<t.length;s++)e[s]=t[s]>0?1:0;return e}function ff(o,t,e,n){const s=new We(o,t,e,Ae,pe);return s.minFilter=bi,s.magFilter=Fe,s.generateMipmaps=!0,s.anisotropy=n,s.wrapS=s.wrapT=Ze,s.needsUpdate=!0,s.onUpdate=()=>{s.image.data=null,s.onUpdate=null},s}class i_{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.blank=n_();const e=t.shared.uniforms;Object.assign(e,{uArchLandA:{value:this.blank},uArchLandB:{value:this.blank},uLandT:{value:0},uLandK:{value:0},uLandEarly:{value:1}}),this.uniforms=e,this.available=null,this.manifest=null,this.keyframes=[],this.resident=new Map,this.loading=new Map,this.bound=null,this.swapTo=null,this.kpShown=0,this.fade=0,this.fadeGoal=0,this.listeners=[],this.chain=Promise.resolve(),this.jobN=0,this.uploads=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){var a;const t=this.data.abs("layers/manifest.json");let e;try{const r=await fetch(t);if(!r.ok)throw new Error(`HTTP ${r.status}`);if(e=await r.json(),!Array.isArray(e==null?void 0:e.keyframes)||!e.keyframes.length||!e.islands)throw new Error("no keyframes or islands")}catch(r){this.available=!1,this.warn(`${t}: ${r.message} (no land layers)`),this.notify();return}this.manifest=e,this.keyframes=[...e.keyframes].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),this.kfIndex=new Map(this.keyframes.map((r,c)=>[r.id,c]));const n=((a=e.encoding)==null?void 0:a.settlement)||{};this.codec=Yl(n.d0??2,n.dMax??5e4);const s=this.app.world;this.islands=s.islandPacks.filter(r=>e.islands[r.id]).map(r=>({pack:r,entry:e.islands[r.id]}));const i=s.archPack;this.arch={W:Math.max(1,Math.round(i.W/2)),H:Math.max(1,Math.round(i.H/2)),rect:i.rect},this.eraYears=this.app.timeline.eras.map(r=>this.eraYear(r)),this.available=!0,this.notify()}eraYear(t,e="cultivation"){var a;const n=(a=this.manifest.eras)==null?void 0:a[t.id],s=(n==null?void 0:n[e])??(n==null?void 0:n.cultivation),i=r=>{var c;return(c=this.keyframes[this.kfIndex.get(r)])==null?void 0:c.year};return s!=null&&s.keyframe&&i(s.keyframe)!==void 0?i(s.keyframe):s!=null&&s.from&&i(s.from)!==void 0&&i(s.to)!==void 0?i(s.from)+(i(s.to)-i(s.from))*(s.t??0):t.year}kpAtYear(t){const e=this.keyframes;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}position(t=this.app.timeline.s,e=this.eraYears){if(!(e!=null&&e.length))return 0;const n=Zi(t,0,e.length-1),s=Math.min(e.length-2,Math.floor(n));return s<0?this.kpAtYear(e[0]):this.kpAtYear(e[s]+(e[s+1]-e[s])*(n-s))}bracket(t){const e=this.keyframes.length,n=r=>this.keyframes[r].id;if(e<2)return{a:n(0),b:n(0),t:0,need:[n(0)]};const s=Zi(Math.floor(t),0,e-2),i=Zi(t-s,0,1),a=i<Ka?[n(s)]:i>1-Ka?[n(s+1)]:[n(s),n(s+1)];return{a:n(s),b:n(s+1),t:i,need:a}}covers(t,e){return t?e>=this.kfIndex.get(t.a)-Ka&&e<=this.kfIndex.get(t.b)+Ka:!1}clampTo(t,e){return Zi(e,this.kfIndex.get(t.a),this.kfIndex.get(t.b))}job(t){var r;const e=this.keyframes,n=this.kfIndex.get(t),s=c=>this.data.abs(`layers/${c}`),i=(c,l)=>{const h=d=>{var m,x,g;return(g=(x=(m=c.layers)==null?void 0:m[e[d].id])==null?void 0:x[l])==null?void 0:g.file};if(h(n))return s(h(n));let u=n-1;for(;u>=0&&!h(u);)u--;let f=n+1;for(;f<e.length&&!h(f);)f++;return u>=0&&f<e.length?{from:s(h(u)),to:s(h(f)),t:(e[n].year-e[u].year)/(e[f].year-e[u].year)}:u>=0?s(h(u)):f<e.length?s(h(f)):null},a=((r=this.manifest.encoding)==null?void 0:r.settlement)||{};return{kf:t,d0:a.d0??2,dMax:a.dMax??5e4,arch:this.arch,islands:this.islands.map(({pack:c,entry:l})=>({id:c.id,W:c.W,H:c.H,f:Z2(Math.max(c.mx,c.mz)),rect:c.rect,land:s_(c),layers:Object.fromEntries(hf.map(h=>[h,i(l,h)]))}))}}request(t){const e=this.chain=this.chain.catch(()=>{}).then(()=>{if(!this.wanted(t))return null;const n=performance.now();return this.run(this.job(t)).then(s=>{this.arrive(s),this.lastBakeMs=Math.round(performance.now()-n)})}).catch(n=>this.warn(`land layers ${t}: ${n.message}`)).finally(()=>{this.loading.delete(t)});return this.loading.set(t,e),e}wanted(t){var n,s;const e=this.bracket(this.position());return this.bound&&this.app.view!=="land"?!1:e.need.includes(t)||((n=this.swapTo)==null?void 0:n.a)===t||((s=this.swapTo)==null?void 0:s.b)===t}run(t){const e=n=>go(On,n);if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("layers-worker-OijIdfIP.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=n=>this.reply(n.data),this.worker.onerror=n=>{var i;(i=n.preventDefault)==null||i.call(n),this.fallback=!0;const s=this.pending;this.pending=null,s&&Uc(s.job,e).then(s.resolve,s.reject)}}catch{this.fallback=!0}return this.fallback?Uc(t,e):new Promise((n,s)=>{const i=++this.jobN;this.pending={id:i,job:t,resolve:n,reject:s},this.worker.postMessage({...t,job:i})})}reply(t){const e=this.pending;!e||t.job!==e.id||(this.pending=null,t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,Uc(e.job,n=>go(On,n)).then(e.resolve,e.reject)):e.reject(new Error(t.message)))}arrive(t){const e=Math.min(4,this.app.renderer.capabilities.getMaxAnisotropy()),n={id:t.kf,arch:ff(t.arch.data,t.arch.W,t.arch.H,e),archData:t.arch.data,islands:new Map(t.islands.map(s=>[s.id,ff(s.data,s.W,s.H,e)])),texels:t.arch.W*t.arch.H+t.islands.reduce((s,i)=>s+i.W*i.H,0),used:performance.now()};this.resident.set(t.kf,n),this.uploads.push(n.arch,...n.islands.values())}dropUnused(){var n,s,i,a;const t=performance.now(),e=new Set([(n=this.bound)==null?void 0:n.a,(s=this.bound)==null?void 0:s.b,(i=this.swapTo)==null?void 0:i.a,(a=this.swapTo)==null?void 0:a.b,...this.bracket(this.position()).need]);for(const[r,c]of this.resident){if(e.has(r)){c.used=t;continue}if(this.resident.size>t_||t-c.used>e_*1e3){c.arch.dispose();for(const l of c.islands.values())l.dispose();this.resident.delete(r),this.uploads=this.uploads.filter(l=>l!==c.arch&&![...c.islands.values()].includes(l))}}}resolve(t){const e=this.resident.has(t.a)?t.a:t.b;return{a:e,b:this.resident.has(t.b)?t.b:e}}bind(t){const{a:e,b:n}=this.resolve(t);this.bound={a:e,b:n};const s=this.resident.get(e),i=this.resident.get(n),a=this.uniforms;a.uArchLandA.value=s.arch,a.uArchLandB.value=i.arch;for(const r of this.app.world.islands)this.attach(r);this.notify()}attach(t){const e=t.uniforms;if(!e.uOwnLandA)return;const n=this.bound&&this.resident.get(this.bound.a),s=this.bound&&this.resident.get(this.bound.b);e.uOwnLandA.value=(n==null?void 0:n.islands.get(t.pack.id))||this.blank,e.uOwnLandB.value=(s==null?void 0:s.islands.get(t.pack.id))||this.blank}update(t,e){const n=this.uniforms;if(n.uLandEarly.value=uf(mi[0],mi[1],this.app.timeline.year),!this.available){n.uLandK.value=0;return}const s=this.position(),i=this.bracket(s);if(this.app.view==="land"||e>.001||!this.bound)for(const l of i.need)!this.resident.has(l)&&!this.loading.has(l)&&this.request(l);const r=i.need.every(l=>this.resident.has(l));if(r&&!this.swapTo&&!this.covers(this.bound,s)&&(!this.bound||this.fade<.02?(this.bind(i),this.kpShown=this.clampTo(this.bound,s)):this.covers(this.resolve(i),this.kpShown)?this.bind(i):this.swapTo=i),this.swapTo?(this.fadeGoal=0,this.fade<.02&&(this.bind(r?i:this.swapTo),this.swapTo=null,this.kpShown=this.clampTo(this.bound,s))):this.fadeGoal=this.bound?1:0,this.bound){const l=this.clampTo(this.bound,s);this.kpShown+=(l-this.kpShown)*(1-Math.exp(-t*8)),Math.abs(l-this.kpShown)<1e-4&&(this.kpShown=l)}this.fade+=(this.fadeGoal-this.fade)*(1-Math.exp(-t*6)),Math.abs(this.fadeGoal-this.fade)<.003&&(this.fade=this.fadeGoal),this.apply(e),this.dropUnused();const c=this.uploads.shift();c!=null&&c.image.data&&this.app.renderer.initTexture(c)}apply(t){const e=this.uniforms;if(this.bound){const n=this.kfIndex.get(this.bound.a),s=this.kfIndex.get(this.bound.b);e.uLandT.value=s>n?Zi((this.kpShown-n)/(s-n),0,1):0}e.uLandK.value=t*this.fade}settle(t){if(!this.available)return;const e=this.position(),n=this.bracket(e);n.need.every(s=>this.resident.has(s))&&!this.covers(this.bound,e)&&this.bind(n),this.swapTo=null,this.bound&&(this.kpShown=this.clampTo(this.bound,e)),this.fade=this.fadeGoal=this.bound?1:0,this.uniforms.uLandEarly.value=uf(mi[0],mi[1],this.app.timeline.year),this.apply(t)}get ready(){return!!this.available&&this.covers(this.bound,this.position())&&!this.swapTo&&this.fade>.99}describe(){if(!this.available)return null;const{a:t,b:e,need:n}=this.bracket(this.position()),s=this.keyframes,i=(l,h)=>{var m,x,g,p,v,w,b,y,S,E;const u=this.kfIndex.get(l),f=(g=(x=(m=this.manifest.methods)==null?void 0:m[l])==null?void 0:x[h])==null?void 0:g.method;if(f||(p=s[u].layers)!=null&&p.includes(h))return f?[f]:[];const d=[];for(let T=u-1;T>=0;T--){const _=(b=(w=(v=this.manifest.methods)==null?void 0:v[s[T].id])==null?void 0:w[h])==null?void 0:b.method;if(_){d.push(_);break}}for(let T=u+1;T<s.length;T++){const _=(E=(S=(y=this.manifest.methods)==null?void 0:y[s[T].id])==null?void 0:S[h])==null?void 0:E.method;if(_){d.push(_);break}}return d},a=hf.map(l=>{const h=n.flatMap(f=>i(f,l)),u=h.includes("modelled")?"modelled":h.includes("mixed")?"partly modelled":"";return{id:l,name:Q2[l],note:u}}),r=l=>s[this.kfIndex.get(l)].year;return{years:n.length>1?[r(t),r(e)]:[r(n[0])],layers:a,early:this.app.timeline.year<mi[1]}}valuesAt(t,e){if(!this.bound)return null;const n=this.resident.get(this.bound.a),s=this.resident.get(this.bound.b);if(!n||!s)return null;const{W:i,H:a,rect:r}=this.arch,c=Math.floor((t-r.x0)/(r.x1-r.x0)*i),l=Math.floor((e-r.z0)/(r.z1-r.z0)*a);if(c<0||l<0||c>=i||l>=a)return null;const h=(l*i+c)*4,u=this.uniforms.uLandT.value,f=d=>n.archData[h+d]+(s.archData[h+d]-n.archData[h+d])*u;return{cultivation:f(0)/255,people:this.codec.decode(f(1)),forest:f(2)/255}}stats(){let t=0,e=0;for(const n of this.resident.values())t+=n.texels,e+=n.archData.byteLength;return{available:this.available,resident:[...this.resident.keys()],bound:this.bound?`${this.bound.a}/${this.bound.b}`:null,t:+this.uniforms.uLandT.value.toFixed(3),k:+this.uniforms.uLandK.value.toFixed(3),gpuMB:+(t*4*4/3/1048576).toFixed(1),cpuMB:+(e/1048576).toFixed(1),bakeMs:this.lastBakeMs??null}}dispose(){var t;for(const e of this.resident.values()){e.arch.dispose();for(const n of e.islands.values())n.dispose()}this.resident.clear(),(t=this.worker)==null||t.terminate()}}const o_={triangulate:function(o,t,e=2){const n=t&&t.length,s=n?t[0]*e:o.length;let i=Pp(o,0,s,e,!0);const a=[];if(!i||i.next===i.prev)return a;let r,c,l,h,u,f,d;if(n&&(i=h_(o,t,i,e)),o.length>80*e){r=l=o[0],c=h=o[1];for(let m=e;m<s;m+=e)u=o[m],f=o[m+1],u<r&&(r=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-r,h-c),d=d!==0?32767/d:0}return ia(i,a,e,r,c,d,0),a}};function Pp(o,t,e,n,s){let i,a;if(s===M_(o,t,e,n)>0)for(i=t;i<e;i+=n)a=df(i,o[i],o[i+1],a);else for(i=e-n;i>=t;i-=n)a=df(i,o[i],o[i+1],a);return a&&Kr(a,a.next)&&(aa(a),a=a.next),a}function Ei(o,t){if(!o)return o;t||(t=o);let e=o,n;do if(n=!1,!e.steiner&&(Kr(e,e.next)||Me(e.prev,e,e.next)===0)){if(aa(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ia(o,t,e,n,s,i,a){if(!o)return;!a&&i&&m_(o,n,s,i);let r=o,c,l;for(;o.prev!==o.next;){if(c=o.prev,l=o.next,i?r_(o,n,s,i):a_(o)){t.push(c.i/e|0),t.push(o.i/e|0),t.push(l.i/e|0),aa(o),o=l.next,r=l.next;continue}if(o=l,o===r){a?a===1?(o=c_(Ei(o),t,e),ia(o,t,e,n,s,i,2)):a===2&&l_(o,t,e,n,s,i):ia(Ei(o),t,e,n,s,i,1);break}}}function a_(o){const t=o.prev,e=o,n=o.next;if(Me(t,e,n)>=0)return!1;const s=t.x,i=e.x,a=n.x,r=t.y,c=e.y,l=n.y,h=s<i?s<a?s:a:i<a?i:a,u=r<c?r<l?r:l:c<l?c:l,f=s>i?s>a?s:a:i>a?i:a,d=r>c?r>l?r:l:c>l?c:l;let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=f&&m.y>=u&&m.y<=d&&io(s,r,i,c,a,l,m.x,m.y)&&Me(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function r_(o,t,e,n){const s=o.prev,i=o,a=o.next;if(Me(s,i,a)>=0)return!1;const r=s.x,c=i.x,l=a.x,h=s.y,u=i.y,f=a.y,d=r<c?r<l?r:l:c<l?c:l,m=h<u?h<f?h:f:u<f?u:f,x=r>c?r>l?r:l:c>l?c:l,g=h>u?h>f?h:f:u>f?u:f,p=vl(d,m,t,e,n),v=vl(x,g,t,e,n);let w=o.prevZ,b=o.nextZ;for(;w&&w.z>=p&&b&&b.z<=v;){if(w.x>=d&&w.x<=x&&w.y>=m&&w.y<=g&&w!==s&&w!==a&&io(r,h,c,u,l,f,w.x,w.y)&&Me(w.prev,w,w.next)>=0||(w=w.prevZ,b.x>=d&&b.x<=x&&b.y>=m&&b.y<=g&&b!==s&&b!==a&&io(r,h,c,u,l,f,b.x,b.y)&&Me(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;w&&w.z>=p;){if(w.x>=d&&w.x<=x&&w.y>=m&&w.y<=g&&w!==s&&w!==a&&io(r,h,c,u,l,f,w.x,w.y)&&Me(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;b&&b.z<=v;){if(b.x>=d&&b.x<=x&&b.y>=m&&b.y<=g&&b!==s&&b!==a&&io(r,h,c,u,l,f,b.x,b.y)&&Me(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function c_(o,t,e){let n=o;do{const s=n.prev,i=n.next.next;!Kr(s,i)&&kp(s,n,n.next,i)&&oa(s,i)&&oa(i,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(i.i/e|0),aa(n),aa(n.next),n=o=i),n=n.next}while(n!==o);return Ei(n)}function l_(o,t,e,n,s,i){let a=o;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&v_(a,r)){let c=Dp(a,r);a=Ei(a,a.next),c=Ei(c,c.next),ia(a,t,e,n,s,i,0),ia(c,t,e,n,s,i,0);return}r=r.next}a=a.next}while(a!==o)}function h_(o,t,e,n){const s=[];let i,a,r,c,l;for(i=0,a=t.length;i<a;i++)r=t[i]*n,c=i<a-1?t[i+1]*n:o.length,l=Pp(o,r,c,n,!1),l===l.next&&(l.steiner=!0),s.push(x_(l));for(s.sort(u_),i=0;i<s.length;i++)e=f_(s[i],e);return e}function u_(o,t){return o.x-t.x}function f_(o,t){const e=d_(o,t);if(!e)return t;const n=Dp(e,o);return Ei(n,n.next),Ei(e,e.next)}function d_(o,t){let e=t,n=-1/0,s;const i=o.x,a=o.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const f=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=i&&f>n&&(n=f,s=e.x<e.next.x?e:e.next,f===i))return s}e=e.next}while(e!==t);if(!s)return null;const r=s,c=s.x,l=s.y;let h=1/0,u;e=s;do i>=e.x&&e.x>=c&&i!==e.x&&io(a<l?i:n,a,c,l,a<l?n:i,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(i-e.x),oa(e,o)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&p_(s,e)))&&(s=e,h=u)),e=e.next;while(e!==r);return s}function p_(o,t){return Me(o.prev,o,t.prev)<0&&Me(t.next,o,o.next)<0}function m_(o,t,e,n){let s=o;do s.z===0&&(s.z=vl(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==o);s.prevZ.nextZ=null,s.prevZ=null,g_(s)}function g_(o){let t,e,n,s,i,a,r,c,l=1;do{for(e=o,o=null,i=null,a=0;e;){for(a++,n=e,r=0,t=0;t<l&&(r++,n=n.nextZ,!!n);t++);for(c=l;r>0||c>0&&n;)r!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,r--):(s=n,n=n.nextZ,c--),i?i.nextZ=s:o=s,s.prevZ=i,i=s;e=n}i.nextZ=null,l*=2}while(a>1);return o}function vl(o,t,e,n,s){return o=(o-e)*s|0,t=(t-n)*s|0,o=(o|o<<8)&16711935,o=(o|o<<4)&252645135,o=(o|o<<2)&858993459,o=(o|o<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,o|t<<1}function x_(o){let t=o,e=o;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==o);return e}function io(o,t,e,n,s,i,a,r){return(s-a)*(t-r)>=(o-a)*(i-r)&&(o-a)*(n-r)>=(e-a)*(t-r)&&(e-a)*(i-r)>=(s-a)*(n-r)}function v_(o,t){return o.next.i!==t.i&&o.prev.i!==t.i&&!w_(o,t)&&(oa(o,t)&&oa(t,o)&&y_(o,t)&&(Me(o.prev,o,t.prev)||Me(o,t.prev,t))||Kr(o,t)&&Me(o.prev,o,o.next)>0&&Me(t.prev,t,t.next)>0)}function Me(o,t,e){return(t.y-o.y)*(e.x-t.x)-(t.x-o.x)*(e.y-t.y)}function Kr(o,t){return o.x===t.x&&o.y===t.y}function kp(o,t,e,n){const s=Ja(Me(o,t,e)),i=Ja(Me(o,t,n)),a=Ja(Me(e,n,o)),r=Ja(Me(e,n,t));return!!(s!==i&&a!==r||s===0&&Za(o,e,t)||i===0&&Za(o,n,t)||a===0&&Za(e,o,n)||r===0&&Za(e,t,n))}function Za(o,t,e){return t.x<=Math.max(o.x,e.x)&&t.x>=Math.min(o.x,e.x)&&t.y<=Math.max(o.y,e.y)&&t.y>=Math.min(o.y,e.y)}function Ja(o){return o>0?1:o<0?-1:0}function w_(o,t){let e=o;do{if(e.i!==o.i&&e.next.i!==o.i&&e.i!==t.i&&e.next.i!==t.i&&kp(e,e.next,o,t))return!0;e=e.next}while(e!==o);return!1}function oa(o,t){return Me(o.prev,o,o.next)<0?Me(o,t,o.next)>=0&&Me(o,o.prev,t)>=0:Me(o,t,o.prev)<0||Me(o,o.next,t)<0}function y_(o,t){let e=o,n=!1;const s=(o.x+t.x)/2,i=(o.y+t.y)/2;do e.y>i!=e.next.y>i&&e.next.y!==e.y&&s<(e.next.x-e.x)*(i-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==o);return n}function Dp(o,t){const e=new wl(o.i,o.x,o.y),n=new wl(t.i,t.x,t.y),s=o.next,i=t.prev;return o.next=t,t.prev=o,e.next=s,s.prev=e,n.next=e,e.prev=n,i.next=n,n.prev=i,n}function df(o,t,e,n){const s=new wl(o,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function aa(o){o.next.prev=o.prev,o.prev.next=o.next,o.prevZ&&(o.prevZ.nextZ=o.nextZ),o.nextZ&&(o.nextZ.prevZ=o.prevZ)}function wl(o,t,e){this.i=o,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function M_(o,t,e,n){let s=0;for(let i=t,a=e-n;i<e;i+=n)s+=(o[a]-o[i])*(o[i+1]+o[a+1]),a=i;return s}const __=1.5,b_=1.5,S_=.25,E_=1,A_={military:["land","runway","pier","block","range"],airport:["field","runway","block"],highway:["road","tunnel"],rail:["line"],harbour:["breakwater","pier"]},T_={interstate:24,state:12,county:8};function pf(o,t){const e=Number(o.lanes);return Number(o.width)||(e>0?e*3.6+2:0)||T_[o.class]||t}const Qa={runway:45,pier:15,breakwater:12,road:10,line:3.5,tunnel:12},C_={land:0,range:1,field:2},yl=["runway","road","stone","rail"],Ml=["hangar","barracks","hospital","warehouse","industrial","office","school","church","residential","tower"],Yo=11,zp=new Set(["block","runway","field","pier","breakwater"]),R_={hangar:"hangar",barracks:"barracks",hospital:"block",office:"block",school:"block",tower:"tower",warehouse:"low",industrial:"low",church:"church",residential:"house"},L_={barracks:2,hospital:6,office:4,school:2,tower:12};function Ip(o,t,e){const n=t||L_[o]||0,s=R_[o];return s==="barracks"?{kind:n>=3?"barracks3":"barracks2",storeys:n}:s?{kind:s,storeys:n}:t>=4?{kind:"block",storeys:t}:t===3?{kind:"barracks3",storeys:t}:t===2?{kind:"barracks2",storeys:t}:t===1?{kind:e&&e<900?"low":"hangar",storeys:t}:{kind:e>2500?"hangar":"barracks2",storeys:t}}const P_={hangar:[60,48],barracks2:[56,16],barracks3:[56,16],low:[26,14],block:[30,22],tower:[29,18],church:[25,45],house:[9.8,8.6]},_l=.013,mf={runway:"runway",road:"road",pier:"stone",breakwater:"stone",line:"rail"},oo=1e5;function k_(o){const t=Number.isFinite(o==null?void 0:o.from)?o.from:null,e=Number.isFinite(o==null?void 0:o.to)?o.to:null,n=Ir(o);let s,i;return n?(s=Math.min(n[0],t??n[0]),i=Math.max(n[1],s+1)):t!==null?(s=t-1,i=t):(s=-oo,i=-oo+1),e!==null?[s,i,e,e+1]:[s,i,oo,oo+1]}const Dr=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)};function zr(o,t){return Dr(o[0],o[1],t)*(1-Dr(o[2],o[3],t))}function Ir(o){return Array.isArray(o==null?void 0:o.built)&&o.built.length===2&&o.built.every(Number.isFinite)?[...o.built].sort((t,e)=>t-e):null}function D_(o,t){const e=Number.isFinite(o==null?void 0:o.from)?o.from:null,n=Ir(o)?Math.floor(t[0]):e!==null?e:-oo,s=Number.isFinite(o==null?void 0:o.to)?o.to+1:1/0;return[n,s]}function gf(o){return o?o.type==="Polygon"?[o.coordinates]:o.type==="MultiPolygon"?o.coordinates:[]:[]}function xf(o){return o?o.type==="LineString"?[o.coordinates]:o.type==="MultiLineString"?o.coordinates:[]:[]}function z_(o){return o?o.type==="Point"?[o.coordinates]:o.type==="MultiPoint"?o.coordinates:[]:[]}function vf(o,t){const e=o.map(n=>t.toWorld(n));if(e.length>1){const n=e[0],s=e[e.length-1];Math.abs(n[0]-s[0])<1e-9&&Math.abs(n[1]-s[1])<1e-9&&e.pop()}return e}function wf(o){let t=0;for(let e=0,n=o.length-1;e<o.length;n=e++)t+=(o[n][0]-o[e][0])*(o[n][1]+o[e][1]);return t/2}function Vs(o,t,e){let n=!1;for(const s of o){const i=s.length/2;for(let a=0,r=i-1;a<i;r=a++){const c=s[a*2],l=s[a*2+1],h=s[r*2],u=s[r*2+1];l>e!=u>e&&t<(h-c)*(e-l)/(u-l)+c&&(n=!n)}}return n}function tr(o,t,e,n){const s=[],i=o.length;for(let a=0;a<i;a++){const r=o[a],c=o[(a+1)%i],l=(r[t]-e)*n,h=(c[t]-e)*n;if(l>=0&&s.push(r),l>=0!=h>=0){const u=l/(l-h);s.push([r[0]+(c[0]-r[0])*u,r[1]+(c[1]-r[1])*u])}}return s}function I_(o,t=__){const e=[],n=[];o.forEach((l,h)=>{h&&n.push(e.length/2);for(const[u,f]of l)e.push(u,f)});const s=o_.triangulate(e,n,2),i=[],a=[],r=new Map,c=(l,h)=>{const u=Math.round(l*2e3)*1e8+Math.round(h*2e3);let f=r.get(u);return f===void 0&&(f=i.length/2,r.set(u,f),i.push(l,h)),f};for(let l=0;l<s.length;l+=3){const h=[s[l],s[l+1],s[l+2]].map(w=>[e[w*2],e[w*2+1]]),u=Math.min(h[0][0],h[1][0],h[2][0]),f=Math.max(h[0][0],h[1][0],h[2][0]),d=Math.min(h[0][1],h[1][1],h[2][1]),m=Math.max(h[0][1],h[1][1],h[2][1]),x=Math.floor(u/t),g=Math.floor(f/t),p=Math.floor(d/t),v=Math.floor(m/t);for(let w=p;w<=v;w++)for(let b=x;b<=g;b++){let y=h;if(x!==g&&(y=tr(tr(y,0,b*t,1),0,(b+1)*t,-1)),y.length>=3&&p!==v&&(y=tr(tr(y,1,w*t,1),1,(w+1)*t,-1)),y.length<3)continue;const S=y.map(([E,T])=>c(E,T));for(let E=1;E+1<S.length;E++){const T=S[0],_=S[E],M=S[E+1];if(T===_||_===M||T===M)continue;const A=(i[_*2]-i[T*2])*(i[M*2+1]-i[T*2+1])-(i[M*2]-i[T*2])*(i[_*2+1]-i[T*2+1]);Math.abs(A)<1e-9||a.push(T,_,M)}}}return{pos:i,index:a,tri:s,flat:e}}function F_(o,t){const e=[o[0]];for(let n=0;n+1<o.length;n++){const[s,i]=o[n],[a,r]=o[n+1],c=Math.max(1,Math.ceil(Math.hypot(a-s,r-i)/t));for(let l=1;l<=c;l++)e.push([s+(a-s)*l/c,i+(r-i)*l/c])}return e}function Fr(o,t,e,n,s,i){const a=s-e,r=i-n,c=a*a+r*r,l=c>0?Math.max(0,Math.min(1,((o-e)*a+(t-n)*r)/c)):0;return Math.hypot(o-e-a*l,t-n-r*l)}function yf(o,t,e,n,s,i,a){const r=Math.cos(e),c=Math.sin(e),l=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([h,u])=>[o+h*n*r-u*s*c,t+h*n*c+u*s*r]);return{rings:[Float32Array.from(l.flat())],box:bl([l]),start:i,end:a,part:"block"}}function U_(o){let t=0,e=0;for(const[m,x]of o)t+=m/o.length,e+=x/o.length;let n=0,s=0,i=0;for(const[m,x]of o)n+=(m-t)**2,s+=(x-e)**2,i+=(m-t)*(x-e);const a=.5*Math.atan2(2*i,n-s),r=[Math.cos(a),Math.sin(a)];let c=1/0,l=-1/0,h=1/0,u=-1/0;for(const[m,x]of o){const g=(m-t)*r[0]+(x-e)*r[1],p=-(m-t)*r[1]+(x-e)*r[0];c=Math.min(c,g),l=Math.max(l,g),h=Math.min(h,p),u=Math.max(u,p)}const f=(c+l)/2,d=(h+u)/2;return{x:t+f*r[0]-d*r[1],z:e+f*r[1]+d*r[0],dir:a,L:l-c,W:u-h}}function N_(o,t=0){let e=o*374761393+t*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function Mf(){return{seg:[],info:[],end:[],span:[],grow:[],n:0}}function _f(o,t,e,n,s,i){let a=0;for(let c=0;c+1<t.length;c++)a+=Math.hypot(t[c+1][0]-t[c][0],t[c+1][1]-t[c][1]);let r=0;for(let c=0;c+1<t.length;c++){const[l,h]=t[c],[u,f]=t[c+1],d=Math.hypot(u-l,f-h);d<1e-6||(i((l+u)/2,(h+f)/2)||(o.seg.push(l,h,u,f),o.info.push(e,e,r,r+d),o.end.push(a),o.span.push(...n),o.grow.push(s?1:0),o.n++),r+=d)}return a}function O_(o,t){const e=[o[0]];let n=0;for(let s=1;s<o.length;s++)n+=Math.hypot(o[s][0]-o[s-1][0],o[s][1]-o[s-1][1]),(n>=t*.9||s===o.length-1)&&(e.push(o[s]),n=0);return e}function B_(o,{lat0:t=20.5,lon0:e=-157.5}={}){var b;const n=Date.now(),s=new pd({lat0:t,lon0:e}),i=[],a={pos:[],span:[],tone:[],index:[]},r={seg:[],s:[],span:[]},c=Object.fromEntries(yl.map(y=>[y,{fine:Mf(),coarse:Mf(),length:0}])),l=[],h=[],u={polys:[],lines:[]},f={},d=((o==null?void 0:o.features)||[]).filter(y=>(y==null?void 0:y.properties)&&y.geometry),m=[];for(const y of d){const S=y.properties;if(S.part==="tunnel")for(const E of xf(y.geometry)){const T=E.map(_=>s.toWorld(_));m.push({group:S.group??null,pts:T,hw:pf(S,Qa.tunnel)/200+.05})}}const x=(y,S,E,T)=>{for(const _ of m){if(_.group!==y&&_.group!==null&&y!==null)continue;const M=_.pts.length;for(let A=0;A+1<M;A++){const[R,k]=_.pts[A],[C,z]=_.pts[A+1],I=C-R,O=z-k,U=((S-R)*I+(E-k)*O)/Math.max(1e-12,I*I+O*O);if(!(A===0&&U<0||A===M-2&&U>1)&&Fr(S,E,R,k,C,z)<Math.max(_.hw,T))return!0}}return!1},g=new Map;for(const y of d){const S=y.properties,E=String(S.kind||""),T=String(S.part||"");if(!((b=A_[E])!=null&&b.includes(T)))continue;f[E]=(f[E]||0)+1;const _=k_(S),[M,A]=D_(S,_),R={i:i.length,id:S.id??null,kind:E,part:T,group:S.group??null,name:S.name??null,owner:S.owner??null,from:S.from??null,to:S.to??null,built:S.built??null,span:_,box:[1/0,1/0,-1/0,-1/0],rep:null,size:0},k=(C,z,I=C,O=z)=>{const U=R.box;U[0]=Math.min(U[0],C),U[1]=Math.min(U[1],z),U[2]=Math.max(U[2],I),U[3]=Math.max(U[3],O)};if(T==="land"||T==="range"||T==="field"){let C=null;for(const z of gf(y.geometry)){const I=z.map(q=>vf(q,s)).filter(q=>q.length>=3);if(!I.length)continue;const O=Math.abs(wf(I[0]))-I.slice(1).reduce((q,it)=>q+Math.abs(wf(it)),0),U=I_(I),V=a.pos.length/2;for(let q=0;q<U.pos.length;q+=2)a.pos.push(U.pos[q],U.pos[q+1]),a.span.push(..._),a.tone.push(C_[T]);for(const q of U.index)a.index.push(V+q);const B=I.map(q=>Float32Array.from(q.flat()));for(const q of I)for(const[it,Y]of q)k(it,Y);if(T==="land")for(const q of I){let it=0;for(let Y=0;Y<q.length;Y++){const[nt,rt]=q[Y],[ut,xt]=q[(Y+1)%q.length],At=Math.hypot(ut-nt,xt-rt);if(At<1e-6)continue;const Rt=Math.max(1,Math.ceil(At/b_));for(let wt=0;wt<Rt;wt++)r.seg.push(nt+(ut-nt)*wt/Rt,rt+(xt-rt)*wt/Rt,nt+(ut-nt)*(wt+1)/Rt,rt+(xt-rt)*(wt+1)/Rt),r.s.push(it+At*wt/Rt,it+At*(wt+1)/Rt),r.span.push(..._);it+=At}}u.polys.push({rings:B,box:bl(I),start:M,end:A,part:T}),R.size+=O,(!C||O>C.area)&&(C={area:O,rings:B,tes:U})}C&&(R.rep=H_(C),S.name&&T!=="range"&&h.push({name:S.name,alt:S.alt??null,kind:T,x:R.rep[0],z:R.rep[1],span:_,size:R.size,i:R.i}))}else if(mf[T]){const C=mf[T],I=(T==="road"?pf(S,Qa.road):T==="line"?Math.max(3,Number(S.width)||Qa.line):Number(S.width)||Qa[T])/100,O=!!Ir(S),U=c[C];let V=null;for(const B of xf(y.geometry)){if(B.length<2)continue;const q=B.map(rt=>s.toWorld(rt)),it=F_(q,S_),Y=(rt,ut)=>T==="road"&&m.length>0&&x(R.group,rt,ut,I/2),nt=_f(U.fine,it,I,_,O,Y);_f(U.coarse,O_(it,E_),I,_,O,Y),U.length+=nt;for(const[rt,ut]of q)k(rt,ut);R.size+=nt,(!V||nt>V.total)&&(V={total:nt,pts:it}),T==="runway"&&(g.has(R.group)||g.set(R.group,[]),g.get(R.group).push(q)),u.lines.push({pts:Float32Array.from(q.flat()),hw:I/2+.06,box:bl([q],I/2+.06),start:M,end:A,part:T})}if(V){const B=W_(V.pts,V.total/2);R.rep=B,S.name&&T==="road"&&h.push({name:S.name,alt:S.alt??null,kind:"road",x:B[0],z:B[1],span:_,size:V.total,i:R.i})}}else if(T==="block"){const C=Number.isFinite(S.storeys)?Math.max(1,Math.round(S.storeys)):0,z=Ml.indexOf(S.use)+1;R.use=z?S.use:null;const I=(O,U,V,B,q)=>{l.push({x:O,z:U,dir:V,L:B,W:q,storeys:C,use:z,span:[..._],keep:[M,A],group:R.group,i:R.i}),k(O,U),R.rep??(R.rep=[O,U])};for(const O of gf(y.geometry)){const U=vf(O[0],s);if(U.length<3)continue;const V=U_(U);I(V.x,V.z,V.dir,V.L,V.W),u.polys.push(yf(V.x,V.z,V.dir,V.L/2,V.W/2,M,A))}for(const O of z_(y.geometry)){const[U,V]=s.toWorld(O);I(U,V,null,0,0)}}i.push(R)}for(const y of l){if(y.dir!==null)continue;let S=8;y.dir=0;for(const _ of g.get(y.group)||[])for(let M=0;M+1<_.length;M++){const A=Fr(y.x,y.z,_[M][0],_[M][1],_[M+1][0],_[M+1][1]);A<S&&(S=A,y.dir=Math.atan2(_[M+1][1]-_[M][1],_[M+1][0]-_[M][0]))}const[E,T]=P_[Ip(Ml[y.use-1],y.storeys,0).kind];u.polys.push(yf(y.x,y.z,y.dir,E*_l/2,T*_l/2,y.keep[0],y.keep[1]))}l.forEach((y,S)=>{if(!Ir(i[y.i]))return;const[E,T]=y.span,_=Math.min(1,T-E),M=E+(T-E-_)*N_(S,17);y.span[0]=M,y.span[1]=M+_});const p=new Float32Array(l.length*Yo);l.forEach((y,S)=>p.set([y.x,y.z,y.dir,y.L,y.W,y.storeys,y.use,...y.span],S*Yo));const v=y=>Float32Array.from(y);return{feats:i,wash:{pos:v(a.pos),span:v(a.span),tone:v(a.tone),index:Uint32Array.from(a.index)},edges:{seg:v(r.seg),s:v(r.s),span:v(r.span)},ribbons:Object.fromEntries(yl.map(y=>{const S=c[y],E=T=>({seg:v(T.seg),info:v(T.info),end:v(T.end),span:v(T.span),grow:v(T.grow),n:T.n});return[y,{fine:E(S.fine),coarse:E(S.coarse),n:S.fine.n,length:S.length}]})),blocks:p,labels:h.sort((y,S)=>S.size-y.size),excl:u,counts:f,ms:Date.now()-n}}function bl(o,t=0){let e=1/0,n=1/0,s=-1/0,i=-1/0;for(const a of o)for(const[r,c]of a)e=Math.min(e,r),n=Math.min(n,c),s=Math.max(s,r),i=Math.max(i,c);return[e-t,n-t,s+t,i+t]}function W_(o,t){let e=0;for(let n=0;n+1<o.length;n++){const s=Math.hypot(o[n+1][0]-o[n][0],o[n+1][1]-o[n][1]);if(e+s>=t&&s>0){const i=(t-e)/s;return[o[n][0]+(o[n+1][0]-o[n][0])*i,o[n][1]+(o[n+1][1]-o[n][1])*i]}e+=s}return o[o.length-1]}function H_({rings:o,tes:t}){const e=o[0];let n=0,s=0,i=0;const a=e.length/2;for(let u=0,f=a-1;u<a;f=u++){const d=e[f*2]*e[u*2+1]-e[u*2]*e[f*2+1];n+=d,s+=(e[f*2]+e[u*2])*d,i+=(e[f*2+1]+e[u*2+1])*d}if(Math.abs(n)>1e-9&&(s/=3*n,i/=3*n,Vs(o,s,i)))return[s,i];let r=null,c=-1;const{tri:l,flat:h}=t;for(let u=0;u<l.length;u+=3){const[f,d,m]=[l[u],l[u+1],l[u+2]],x=Math.abs((h[d*2]-h[f*2])*(h[m*2+1]-h[f*2+1])-(h[m*2]-h[f*2])*(h[d*2+1]-h[f*2+1]));x>c&&(c=x,r=[(h[f*2]+h[d*2]+h[m*2])/3,(h[f*2+1]+h[d*2+1]+h[m*2+1])/3])}return r||[e[0],e[1]]}const zn=4;class G_{constructor(t){this.polys=t.polys,this.lines=t.lines,this.grid=new Map;const e=(n,s)=>{const i=Math.floor(n[0]/zn),a=Math.floor(n[2]/zn),r=Math.floor(n[1]/zn),c=Math.floor(n[3]/zn);for(let l=r;l<=c;l++)for(let h=i;h<=a;h++){const u=h*100003+l;let f=this.grid.get(u);f||this.grid.set(u,f=[]),f.push(s)}};this.polys.forEach((n,s)=>e(n.box,s)),this.lines.forEach((n,s)=>{const i=n.pts.length/2;for(let a=0;a+1<i;a++){const r=n.pts[a*2],c=n.pts[a*2+1],l=n.pts[a*2+2],h=n.pts[a*2+3];e([Math.min(r,l)-n.hw,Math.min(c,h)-n.hw,Math.max(r,l)+n.hw,Math.max(c,h)+n.hw],-1-(s*65536+a))}}),this.breaks=new Set;for(const n of[...this.polys,...this.lines])Number.isFinite(n.start)&&n.start>-oo&&this.breaks.add(n.start),Number.isFinite(n.end)&&this.breaks.add(n.end);this.seen=new Int32Array(this.polys.length+this.lines.length),this.stamp=0}get count(){return this.polys.length+this.lines.length}test(t,e,n,s,i,a){const r=Math.hypot(n,s),c=Math.floor((t-r)/zn),l=Math.floor((t+r)/zn),h=Math.floor((e-r)/zn),u=Math.floor((e+r)/zn),f=Math.cos(i),d=-Math.sin(i),m=f,x=d,g=-d,p=f,v=++this.stamp;let w=0;for(let b=h;b<=u;b++)for(let y=c;y<=l;y++){const S=this.grid.get(y*100003+b);if(S)for(const E of S){let T=!1,_;if(E>=0){if(this.seen[E]===v)continue;this.seen[E]=v,_=this.polys[E];const M=_.box;if(t+r<M[0]||t-r>M[2]||e+r<M[1]||e-r>M[3])continue;for(let A=0;A<9&&!T;A++){const R=A===0?0:A<5?[-1,1,1,-1][A-1]:[0,1,0,-1][A-5],k=A===0?0:A<5?[-1,-1,1,1][A-1]:[-1,0,1,0][A-5];T=Vs(_.rings,t+m*R*n+g*k*s,e+x*R*n+p*k*s)}}else{const M=-1-E,A=Math.floor(M/65536),R=M%65536;_=this.lines[A];const k=_.pts;T=bf(k[R*2]-t,k[R*2+1]-e,k[R*2+2]-t,k[R*2+3]-e,m,x,g,p,n+_.hw,s+_.hw)}if(T&&(w=1,a>=_.start&&a<_.end))return 2}}return w}standing(t,e,n,s){const i=Math.floor((t-n)/zn),a=Math.floor((t+n)/zn),r=Math.floor((e-n)/zn),c=Math.floor((e+n)/zn),l=++this.stamp,h=[];for(let f=r;f<=c;f++)for(let d=i;d<=a;d++){const m=this.grid.get(d*100003+f);if(m)for(const x of m){let g,p;if(x>=0){if(this.seen[x]===l||(this.seen[x]=l,g=this.polys[x],!s.has(g.part)))continue;const v=g.box;if(t+n<v[0]||t-n>v[2]||e+n<v[1]||e-n>v[3])continue;p=Vs(g.rings,t,e)||Vs(g.rings,t-n,e)||Vs(g.rings,t+n,e)||Vs(g.rings,t,e-n)||Vs(g.rings,t,e+n)}else{const v=-1-x;if(g=this.lines[Math.floor(v/65536)],!s.has(g.part))continue;const w=v%65536,b=g.pts;p=Fr(t,e,b[w*2],b[w*2+1],b[w*2+2],b[w*2+3])<g.hw+n}p&&h.push([g.start,g.end])}}if(h.length<2)return h;h.sort((f,d)=>f[0]-d[0]);const u=[h[0].slice()];for(const[f,d]of h.slice(1)){const m=u[u.length-1];f<=m[1]?m[1]=Math.max(m[1],d):u.push([f,d])}return u}raster(t,e,n){const s=e/(t.x1-t.x0),i=e/(t.z1-t.z0),a=1/s,r=1/i,c=Math.hypot(a,r)/2,l=f=>Math.max(0,Math.min(e-1,f)),h=[],u=(f,d)=>f[2]+d<t.x0||f[0]-d>t.x1||f[3]+d<t.z0||f[1]-d>t.z1?null:[l(Math.floor((f[0]-d-t.x0)*s)),l(Math.floor((f[2]+d-t.x0)*s)),l(Math.floor((f[1]-d-t.z0)*i)),l(Math.floor((f[3]+d-t.z0)*i))];for(const f of this.polys){if(!n.has(f.part))continue;const d=u(f.box,0);if(!d)continue;const[m,x,g,p]=d,v=new Set;for(const b of f.rings){const y=b.length/2;for(let S=0;S<y;S++){const E=(S+1)%y,[T,_,M,A]=[b[S*2],b[S*2+1],b[E*2],b[E*2+1]],R=u([Math.min(T,M),Math.min(_,A),Math.max(T,M),Math.max(_,A)],0);if(R)for(let k=R[2];k<=R[3];k++)for(let C=R[0];C<=R[1];C++){const z=t.x0+(C+.5)*a,I=t.z0+(k+.5)*r;bf(T-z,_-I,M-z,A-I,1,0,0,1,a/2,r/2)&&v.add(k*e+C)}}}for(let b=g;b<=p;b++)for(let y=m;y<=x;y++)!v.has(b*e+y)&&Vs(f.rings,t.x0+(y+.5)*a,t.z0+(b+.5)*r)&&v.add(b*e+y);const w=[...v];w.length&&h.push({start:f.start,end:f.end,texels:Int32Array.from(w)})}for(const f of this.lines){if(!n.has(f.part)||!u(f.box,0))continue;const d=new Set,m=f.pts;for(let x=0;x+3<m.length;x+=2){const[g,p,v,w]=[m[x],m[x+1],m[x+2],m[x+3]],b=u([Math.min(g,v),Math.min(p,w),Math.max(g,v),Math.max(p,w)],f.hw+c);if(!b)continue;const[y,S,E,T]=b;for(let _=E;_<=T;_++)for(let M=y;M<=S;M++)Fr(t.x0+(M+.5)*a,t.z0+(_+.5)*r,g,p,v,w)<=f.hw+c&&d.add(_*e+M)}d.size&&h.push({start:f.start,end:f.end,texels:Int32Array.from(d)})}return h}}function V_(o,t,e){return(Number.isFinite(o)?Dr(o-1,o,e):1)*(Number.isFinite(t)?1-Dr(t-1,t,e):1)}function bf(o,t,e,n,s,i,a,r,c,l){const h=[o*s+t*i,o*a+t*r],u=[e*s+n*i,e*a+n*r];let f=0,d=1;for(let m=0;m<2;m++){const x=m?l:c,g=u[m]-h[m];for(const[p,v]of[[-g,h[m]+x],[g,x-h[m]]]){if(Math.abs(p)<1e-12){if(v<0)return!1;continue}const w=v/p;if(p<0?f=Math.max(f,w):d=Math.min(d,w),f>d)return!1}}return!0}const Ot=(o,t,e)=>Math.max(t,Math.min(e,o)),oe=(o,t,e)=>{const n=Ot((e-o)/(t-o),0,1);return n*n*(3-2*n)},$s=.36,bs=.4,Fp=.14,Kl=.14,Es=4*$s+Fp,js=2*bs+Kl,Vt=5,Sf=8/(Es*js)*100,Ef=5e3,is=.012,Zl=Yn(.15),$_=bs/2+Kl/2-is,vi=3.5,Af=.8,Tf=Ie*1.4,ke=Ie*1.25,Rs={kauhale:{sh:Tf,sv:Tf,relief:2.5,loose:!0},hale:{sh:ke,sv:ke,relief:3,jitter:.2},frame:{sh:ke,sv:ke,relief:3,jitter:.3},adobe:{sh:ke,sv:ke,relief:3,jitter:.3},cottage:{sh:ke,sv:ke,relief:3.5},store:{sh:ke,sv:ke,relief:3},block:{sh:ke,sv:ke,relief:3},bungalow:{sh:ke*.92,sv:ke*.92,relief:4},midrise:{sh:Ie,sv:Ie*.8,relief:4},house:{sh:ke*.9,sv:ke*.9,relief:6},walkup:{sh:Ie*.75,sv:Ie*.75,relief:5},tower:{sh:Ie*.48,sv:Ie*.58,relief:6},shed:{sh:ke*.9,sv:ke*.9,relief:4},church:{sh:Ie*.85,sv:Ie*.85,relief:3},spire:{sh:ke*.9,sv:ke*.9,relief:3},clock:{sh:Ie*.7,sv:Ie*.7,relief:3}},os=Object.keys(Rs),Jl=Object.fromEntries(["walkup","tower"].map(o=>[o,[($s-2*is)/Rs[o].sh,(bs-2*is)/Rs[o].sh]])),zt=Object.fromEntries(os.map((o,t)=>[o,t])),j_=new Set(["church","spire","clock"]),Ee={houses:1,lowrise:2,highrise:3,commercial:4,downtown:5,industrial:6,resort:7,agricultural:8,conservation:9,military:10,institutional:11,parks:12},Bc={rural:2,agricultural:3,conservation:4},q_=1960,Wc=1964,Ur={[Ee.downtown]:9e3,[Ee.resort]:8e3,[Ee.commercial]:4e3,[Ee.industrial]:3500,[Ee.institutional]:1500,[Ee.military]:800,[Ee.agricultural]:120},X_=4,Y_=[1100,1200,1300,1400,1450,1600,1700],K_=.6,Cf=2.5,er=1e5,Z_=232,J_=1936,Q_=1800,tb=(()=>{let o=[[0]];for(let t=0;t<3;t++){const e=o.length,n=Array.from({length:2*e},()=>new Array(2*e));for(let s=0;s<e;s++)for(let i=0;i<e;i++){const a=4*o[s][i];n[s][i]=a,n[s][i+e]=a+2,n[s+e][i]=a+3,n[s+e][i+e]=a+1}o=n}return o})(),eb=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];function Nr(o,t,e){const n=Math.floor(o),s=Math.floor(t),i=o-n,a=t-s,r=i*i*(3-2*i),c=a*a*(3-2*a),l=ye(n,s,e),h=ye(n+1,s,e),u=ye(n,s+1,e),f=ye(n+1,s+1,e);return l+(h-l)*r+(u-l+(l-h+f-u)*r)*c}function Ai(o){let t=o>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Up(o,t,e){let n=!1;for(let s=0,i=o.length-1;s<o.length;i=s++){const a=o[s],r=o[i];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function nb(o,t){var i,a,r,c,l,h,u;const e=o==null?void 0:o.zoning,n=((i=e==null?void 0:e.islands)==null?void 0:i[t])??(e==null?void 0:e[t])??((r=(a=o==null?void 0:o.islands)==null?void 0:a[t])==null?void 0:r.zoning)??((u=(h=(l=(c=o==null?void 0:o.islands)==null?void 0:c[t])==null?void 0:l.layers)==null?void 0:h.now)==null?void 0:u.zoning)??null;if(!n)return{zoning:null,lud:null};const s=f=>typeof f=="string"?f:(f==null?void 0:f.file)||null;return{zoning:s(n.zoning??n.now??(n.file?n:null)),lud:s(n.lud)}}async function Np(o,t,e){var h;let n=null,s=t;const i=(h=o.params)==null?void 0:h.get("zoning");if(i)try{n=new URL(i.endsWith("/")?i:`${i}/`,location.href);const u=await fetch(new URL("layers/manifest.json",n));s=u.ok?await u.json():null}catch{s=null}const a=nb(s,e),r=async u=>{if(!u)return null;try{const f=n?new URL(`layers/${u}`,n).href:o.data.abs(`layers/${u}`);return await go(On,f)}catch(f){return o.warn(`zoning ${e}: ${u}: ${f.message} (the settlements go by density and value there)`),null}},[c,l]=await Promise.all([r(a.zoning),r(a.lud)]);return{zoning:c,lud:l,files:a}}function Ko(o,t,e,n){if(!o)return 0;const s=Math.floor((e-t.x0)/(t.x1-t.x0)*o.W),i=Math.floor((n-t.z0)/(t.z1-t.z0)*o.H);return s<0||i<0||s>=o.W||i>=o.H?0:o.px[i*o.W+s]}class Op{constructor(t){this.app=t,this.sites=0}setLayers(t){var a;const e=[...t.keyframes||[]].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),n=((a=t.encoding)==null?void 0:a.settlement)||{},s=n.dMax??5e4;this.d0=n.d0??2,this.L=Math.log(1+s/this.d0),this.codec=Yl(this.d0,s),this.keyframes=e;const i=r=>{var c;return(c=e.find(l=>l.id===r))==null?void 0:c.year};this.eraYears=this.app.timeline.eras.map(r=>{var l,h;const c=(h=(l=t.eras)==null?void 0:l[r.id])==null?void 0:h.settlement;return c!=null&&c.keyframe&&i(c.keyframe)!==void 0?i(c.keyframe):c!=null&&c.from&&i(c.from)!==void 0&&i(c.to)!==void 0?i(c.from)+(i(c.to)-i(c.from))*(c.t??0):r.year}),this.lut=new Float32Array(256*8+1);for(let r=0;r<=256*8;r++)this.lut[r]=this.d0*(Math.exp(r/8/255*this.L)-1)}layerFiles(t){return this.keyframes.map(e=>{var n,s,i,a,r,c;return{settlement:((i=(s=(n=t.layers)==null?void 0:n[e.id])==null?void 0:s.settlement)==null?void 0:i.file)||null,value:((c=(r=(a=t.layers)==null?void 0:a[e.id])==null?void 0:r.value)==null?void 0:c.file)||null}})}kpAt(t){const e=this.app.timeline,n=this.eraYears,s=this.keyframes;let i=t;if(n.length>1){const a=Ot(e.sAtYear(t),0,n.length-1),r=Math.min(n.length-2,Math.floor(a));i=n[r]+(n[r+1]-n[r])*(a-r)}if(i<=s[0].year)return 0;for(let a=0;a+1<s.length;a++)if(i<=s[a+1].year)return a+(i-s[a].year)/(s[a+1].year-s[a].year);return s.length-1}sample(t,e,n,s,i){const a=this.crop,r=Ot((e-a.x0)/a.sx-.5,0,a.w-1.001),c=Ot((n-a.z0)/a.sz-.5,0,a.h-1.001),l=r|0,h=c|0,u=r-l,f=c-h,d=h*a.w+l;for(let m=0;m<t.length;m++){const x=t[m],g=x[d]+(x[d+1]-x[d])*u,p=x[d+a.w]+(x[d+a.w+1]-x[d+a.w])*u,v=g+(p-g)*f;s[m]=v>.5?v+i:0}return s}bytesAt(t,e,n){const s=(Nr(t/1.7,e/1.7,71)-.5)*26+(Nr(t/.55,e/.55,72)-.5)*12;return this.sample(this.bytes,t,e,n,s)}people(t){return t<=0?0:t<256?this.lut[Math.round(t*8)]:this.d0*(Math.exp(t/255*this.L)-1)}townTerm(t,e,n="island"){const s=this.keyframes,i=this.app.data.proj,a=this.crop,r=this.islandRect;this.townTerms=[],s.forEach((c,l)=>{var w,b,y,S,E,T,_,M,A,R;const h=(b=(w=t.methods)==null?void 0:w[c.id])==null?void 0:b.settlement;if(c.year<Q_||!h||(y=h.towns)!=null&&y.length)return;const u=s.slice(l+1).find(k=>{var C,z,I,O;return(O=(I=(z=(C=t.methods)==null?void 0:C[k.id])==null?void 0:z.settlement)==null?void 0:I.towns)==null?void 0:O.length}),f=(S=h.populations)==null?void 0:S[e];if(!u||!Number.isFinite(f))return;const d=t.methods[u.id].settlement,m=d.towns.map(k=>({...k,xz:i.toWorld([k.lon,k.lat])})).filter(k=>k.xz[0]>r.x0&&k.xz[0]<r.x1&&k.xz[1]>r.z0&&k.xz[1]<r.z1&&(k.share||0)>0);if(!m.length)return;const x=(R=(A=(M=(_=(T=(E=t.islands)==null?void 0:E[e])==null?void 0:T.layers)==null?void 0:_[u.id])==null?void 0:M.settlement)==null?void 0:A.stats)==null?void 0:R.people;for(const k of m){let C=1;if(n==="district"){const z=(d.districts||[]).find(I=>I.name===k.district);C=z&&x?Ot(z.pop/x,.05,1):.25}k.people=f*(k.share||0)*C}const g=Math.min(.9,m.reduce((k,C)=>k+C.people,0)/f),p=Float32Array.from(this.bytes[l]),v=new Float32Array(a.w*a.h);for(const k of m){const C=(k.sigma||1500)/1e3,z=4*C*1e3/100,I=Ot(Math.floor((k.xz[0]-z-a.x0)/a.sx),0,a.w-1),O=Ot(Math.ceil((k.xz[0]+z-a.x0)/a.sx),0,a.w-1),U=Ot(Math.floor((k.xz[1]-z-a.z0)/a.sz),0,a.h-1),V=Ot(Math.ceil((k.xz[1]+z-a.z0)/a.sz),0,a.h-1),B=k.people/(2*Math.PI*C*C);for(let q=U;q<=V;q++)for(let it=I;it<=O;it++){const Y=a.x0+(it+.5)*a.sx,nt=a.z0+(q+.5)*a.sz,rt=((Y-k.xz[0])**2+(nt-k.xz[1])**2)/100;v[q*a.w+it]+=B*Math.exp(-rt/(2*C*C))}}for(let k=0;k<p.length;k++){if(p[k]<=0&&v[k]<=0||p[k]<=0)continue;const C=this.codec.decode(p[k])*(1-g)+v[k];p[k]=255*Math.log(1+Math.max(0,C)/this.d0)/this.L}this.bytes[l]=p,this.townTerms.push({keyframe:c.id,from:u.id,towns:m.map(k=>k.name),people:Math.round(f*g)})})}years(t){const e=this.app.timeline,n=e.yearAt(0),s=e.yearAt(e.max),i=new Set([...t].filter(c=>c>n&&c<=s)),a=this.keyframes[0].year,r=new Set([n,...Y_.filter(c=>c>n&&c<a),...i]);for(let c=a;c<=s;c+=X_)r.add(c);r.add(s),this.Ys=[...r].filter(c=>c>=n&&c<=s).sort((c,l)=>c-l),this.isBreak=this.Ys.map(c=>i.has(c)),this.edges=[...i].sort((c,l)=>c-l),this.epochAt=this.Ys.map(c=>this.epochOfYear(c)),this.samples=this.Ys.map(c=>{const l=this.kpAt(c),h=Math.min(this.keyframes.length-2,Math.floor(l)),u=[1820,1860,1900,1960].map(d=>oe(d-10,d+10,c)),f=[1-u[0],u[0]-u[1],u[1]-u[2],u[2]-u[3],u[3]];return{y:c,a:h,t:l-h,early:25.5*(1-oe(mi[0],mi[1],c)),w:f}})}epochOfYear(t){const e=this.edges;let n=0;for(;n<e.length&&t>=e[n];)n++;return n}fill(t,e){const n=Math.min(.08333333333333333,e/(8*Sf)),s=t.w,i=e/Ef;let a=0;return s[1]&&(a+=s[1]*Math.min(.8,Math.max(i,.8*(e/700)**2))),s[2]&&(a+=s[2]*Math.min(.9,Math.max(i,.9*(e/1300)**2.5))),s[3]&&(a+=s[3]*Math.min(.9,Math.max(i,.9*(e/2500)**1.5))),s[4]&&(a+=s[4]*(e<6e3?Math.min(.85,Math.max(i,.85*(e/6e3)**1.2)):.85-.45*oe(6e3,15e3,e))),[a,n]}fillMax(t){return Math.max(4*Math.min(1/12,t/(8*Sf)),Math.min(.9,t/Ef),Math.min(.8,.8*(t/700)**2),Math.min(.9,.9*(t/1300)**2.5),Math.min(.9,.9*(t/2500)**1.5),Math.min(.85,.85*(t/6e3)**1.2))}valueAt(t,e,n){if(t.vb)return Ot((t.vb[e.a]+(t.vb[e.a+1]-t.vb[e.a])*e.t)/255,0,1);const s=oe(1.5,4,Math.log10(Math.max(1,n))),i=oe(1800,2e3,e.y);return Ot(.34*s+.14*t.coast+.16*t.harbour+.22*t.centre+.1*i+.24*(t.r8-.5),0,1)}kindAt(t,e,n,s,i){const a=Ot(Math.log10(Math.max(1,e)/300),-1,1),r=t-s.lag*(1-.6*Math.max(0,a));if(t<1818||r<1820)return i?zt.kauhale:zt.hale;const c=oe(.35,.8,n);if(r<1860){const u=(1-oe(1820,1880,r+12*a))*(1.15-.6*c);return s.r2<u?zt.hale:s.r3<.15+.5*c?zt.adobe:zt.frame}if(r<1900){if(e>1150&&s.r3<.3||e>450&&s.r3<.42*oe(.6,.9,n))return zt.block;if(e>700&&s.r3<.55||e>250&&s.r3<.6*oe(.5,.8,n))return zt.store;const u=(1-oe(1820,1880,r+12*a))*(1.2-.8*c);return s.r2<u?zt.hale:s.r4<.2?zt.frame:zt.cottage}if(r<1960)return e>4e3&&s.r3<.5||e>2e3&&s.r3<.45*oe(.65,.95,n)?zt.midrise:e>1800&&s.r3<.6||e>700&&s.r3<.5*oe(.55,.85,n)?zt.block:(e>900&&s.r3<.4||e>400&&s.r3<.4*oe(.5,.8,n))&&r<1935?zt.store:zt.bungalow;const l=s.zone;if(t>=Wc&&s.lud===Bc.conservation)return-1;if(l)return this.zoneKind(l,r,e,n,s);if(t>=Wc&&s.lud===Bc.agricultural)return s.r3<.4?zt.shed:zt.house;if(t>=Wc&&s.lud===Bc.rural)return zt.house;const h=s.zoned?zt.walkup:zt.tower;return s.core?h:e>2e4?s.r3<.85?h:zt.walkup:e>1e4?s.r3<.2+.5*oe(1e4,2e4,e)+.2*c?h:zt.walkup:e>4e3?s.r3<.45+.2*c?s.r5<.25*oe(.7,.95,n)?h:zt.walkup:zt.house:e>2500&&s.r3<.2+.15*c?zt.walkup:s.r4<.35&&r<1990?zt.bungalow:zt.house}zoneKind(t,e,n,s,i){const a=oe(.35,.8,s);switch(t){case Ee.houses:return i.r4<.35&&e<1990?zt.bungalow:zt.house;case Ee.lowrise:return i.r3<.55+.35*a?zt.walkup:zt.house;case Ee.highrise:return i.r3<.3+.45*oe(4e3,2e4,n)+.2*a?zt.tower:zt.walkup;case Ee.commercial:return n>4e3&&i.r3<.25+.45*a?zt.midrise:n<2e3&&i.r4<.35-.25*a?zt.store:zt.block;case Ee.downtown:return i.core||n>6e3&&i.r3<.25+.5*oe(6e3,15e3,n)+.2*a?zt.tower:n>5e3&&i.r4<.3+.4*a?zt.midrise:n<5e3&&i.r4<.55-.3*a?zt.store:zt.block;case Ee.industrial:case Ee.military:return zt.shed;case Ee.resort:return i.r3<.15+.45*oe(.5,.9,s)+.35*oe(4e3,15e3,n)?zt.tower:zt.walkup;case Ee.agricultural:return zt.shed;case Ee.institutional:return n>3e3&&i.r3<.3*a?zt.midrise:zt.block;case Ee.conservation:case Ee.parks:return-1;default:return zt.house}}variantOf(t,e,n){return e===zt.tower&&t.zone===Ee.resort&&t.r6<.75?0:Math.min(n-1,Math.floor(ye(t.tile,e,Math.floor(t.rank*1e6))*n))}towerHeight(t){return 35+115*oe(4,4.7,Math.log10(Math.max(1,t)))}byteAt(t,e){return t.b[e.a]+(t.b[e.a+1]-t.b[e.a])*e.t-e.early}fillByte(t,e,n){const s=t.zone&&e.w[4]>0&&e.y>=q_?Ur[t.zone]:0;if(!s)return n;const i=255*Math.log(1+s/this.d0)/this.L+10*(t.r6-.5);return i>n?n+(i-n)*e.w[4]:n}scatterLot(t,e,n,s){var h,u;const i=this.Ys.length,a=this.samples,r=new Map;let c=null;const l=f=>{const d=this.instance(t,c,f);if(Array.isArray(d))for(const m of d)s(m);else s(d);c=null};t.core=!1,t.anchor&&(t.yard=new Uint8Array(i));for(let f=0;f<i;f++){const d=a[f];let m=null,x=this.byteAt(t,d);const g=t.core&&d.y>=1960&&(t.zoned?t.zone===Ee.downtown||t.zone===Ee.highrise:!0);g&&(x=Math.max(x,Z_+14*t.r6));const p=this.fillByte(t,d,x),v=(u=(h=t.host)==null?void 0:h.yard)==null?void 0:u[f];if(p>0&&!v){const w=this.people(x),[b,y]=this.fill(d,this.people(p)),S=n(f),E=!!t.anchor&&t.rankY<4*y*t.w*S,T=this.valueAt(t,d,w);let _=-1;if((g||t.rank<b*t.w*S||E)&&(_=this.kindAt(d.y,w,T,t,E)),_===zt.kauhale&&!E&&(_=zt.hale),_>=0&&_!==zt.kauhale&&!(g||t.rank<b*t.w*S)&&(_=-1),_>=0){const M=_===zt.kauhale?Fc.length:this.kits[os[_]].length,A=this.variantOf(t,_,M),R=this.epochAt[f],k=_*16+A;let C=r.get(k*256+255);if(C===void 0&&(C=r.get(k*256+R)),C===void 0){const z=this.pose(t,_,A),I=Rs[os[_]].relief;let O=!1;if(z.parts){C=[];for(const U of z.parts){const V=e(U,I,R);if(O||(O=this.dep),V===null){C=null;break}C.push(V)}}else C=e(z,I,R),O=this.dep;r.set(k*256+(O?R:255),C)}C!==null&&(m={key:k,kind:_,variant:A,top:C,d:w},_===zt.kauhale&&(t.yard[f]=1)),m&&_===zt.midrise&&d.y<=J_&&(t.core=!0)}}if(c&&m&&m.key===c.key){c.d=Math.max(c.d,m.d);continue}c&&l(f),m&&(c={...m,n0:f})}c&&l(i)}fitOf(t,e){const n=t*16+e;this.fits??(this.fits=new Map);let s=this.fits.get(n);if(s!==void 0)return s;const i=os[t],a=Rs[i];if(j_.has(i))s=1;else if(a.loose){let r=0,c=0;for(const[l,h,u,f]of Fc[e]){const d=this.kits[i][f];for(const m of[-.2,.2]){const x=Math.cos(u+m),g=Math.sin(u+m),p=Math.cos(m),v=Math.sin(m),w=l*p+h*v,b=-l*v+h*p;r=Math.max(r,Math.abs(w)+Math.abs(d.hx*x)+Math.abs(d.hz*g)),c=Math.max(c,Math.abs(b)+Math.abs(d.hx*g)+Math.abs(d.hz*x))}}s=Math.min(1,($s-is)/(r*a.sh),(bs-is)/(c*a.sh))}else{const r=this.kits[i][e],[c,l,h,u]=r.box,f=(a.jitter||0)/2,d=Math.cos(f),m=Math.sin(f),x=Math.max(-c,l)*d+Math.max(-h,u)*m,g=-h*d+Math.max(-c,l)*m,p=u*d+Math.max(-c,l)*m,v=a.jitter?.03:0;s=Math.min(1,($s/2-is-v)/(x*a.sh),(bs/2-is-v)/(g*a.sh),($_-v)/(p*a.sh))}return this.fits.set(n,s),s}pose(t,e,n){const s=os[e],i=Rs[s],a=this.fitOf(e,n);let r=t.x,c=t.z,l=t.face;if(i.loose){const m=i.sh*a;r=t.x+$s/2*t.e[0]+bs/2*t.m[0],c=t.z+$s/2*t.e[1]+bs/2*t.m[1],l=Math.atan2(t.e[0],t.e[1])-Math.PI/2+(t.r7-.5)*.4+(t.r5<.5?0:Math.PI);const x=Math.cos(l),g=Math.sin(l),p=Fc[n].map(([v,w,b,y])=>{const S=this.kits[s][y];return{x:r+(v*x+w*g)*m,z:c+(-v*g+w*x)*m,a:l+b,size:y,ax:S.hx*m,az:S.hz*m,f:a}});return{x:r,z:c,a:l,parts:p,f:a}}const h=this.kits[s][n];i.jitter&&(l+=(t.r5-.5)*i.jitter,r+=(t.r6-.5)*.06,c+=(t.r7-.5)*.06);const u=Jl[s],f=u?Math.max(h.hx*i.sh*a,$s/2-is):h.hx*i.sh*a,d=u?Math.max(h.hz*i.sh*a,bs/2-is):h.hz*i.sh*a;return{x:r,z:c,a:l,ax:f,az:d,f:a}}instance(t,e,n){const s=this.Ys,i=s.length,a=os[e.kind],r=Rs[a],c=t.landmark?{x:t.x,z:t.z,a:t.face,f:1}:this.pose(t,e.kind,e.variant),l=new Float32Array(4),h=m=>{const x=s[m-1],g=s[m],p=Math.min(K_,(g-x)/2),v=x+p+ye(t.tile??0,m,Math.floor((t.rank??0)*1e6))*(g-x-2*p);return[v-p,v+p]};e.n0===0?(l[0]=-er,l[1]=-er+1):this.isBreak[e.n0]||t.landmark?(l[0]=s[e.n0],l[1]=s[e.n0]+Cf):[l[0],l[1]]=h(e.n0),n>=i?(l[2]=er,l[3]=er+1):this.isBreak[n]?(l[2]=s[n]-Cf,l[3]=s[n]-.01):[l[2],l[3]]=h(n);const u=a==="tower"?this.towerHeight(e.d)/_s:1,f=.94+.12*(t.r5??.5),d=(m,x,g)=>{const p=this.kits[a][x],v=m.f??c.f??1;return{kind:e.kind,variant:x,site:this.sites,x:m.x,z:m.z,a:m.a,y:Yn(g)+Zl,sh:r.sh*v,sv:r.sv*v*u,stretch:u,span:l,colour:[f*(.98+.04*(t.r6??.5)),f,f*(.98+.04*(t.r7??.5))],rx:p.hx*r.sh*v*.95,rz:p.hz*r.sh*v*.95,landmark:!!t.landmark}};return this.sites++,c.parts?c.parts.map((m,x)=>d(m,m.size,e.top[x])):d(c,e.variant,e.top)}tileLots(t,e,n,s,i,a){const r=[Math.cos(n),Math.sin(n)],c=[-r[1],r[0]];let l=1/0,h=-1/0,u=1/0,f=-1/0;for(const[g,p]of[[t,e],[t+Vt,e],[t,e+Vt],[t+Vt,e+Vt]]){const v=g*c[0]+p*c[1],w=g*r[0]+p*r[1];l=Math.min(l,v),h=Math.max(h,v),u=Math.min(u,w),f=Math.max(f,w)}const d=.42,m=(g,p)=>g>=t&&g<t+Vt&&p>=e&&p<e+Vt&&!(i[0]&&g<t+d||i[1]&&g>=t+Vt-d||i[2]&&p<e+d||i[3]&&p>=e+Vt-d),x=[];for(let g=Math.floor(u/js)-1;g<=Math.ceil(f/js);g++)for(let p=Math.floor(l/Es)-1;p<=Math.ceil(h/Es);p++)for(let v=0;v<2;v++){const w=[[0,0],[1,0],[0,1],[1,1]].map(([S,E])=>{const T=2*v+S,_=p*Es+Fp/2+(T+.5)*$s,M=g*js+Kl/2+(E+.5)*bs,A=_*c[0]+M*r[0],R=_*c[1]+M*r[1];return{iu:T,iv:E,u:_,v:M,x:A,z:R,ok:m(A,R)&&a(A,R)}}),b=w.every(S=>S.ok);let y=null;for(const S of w){if(!S.ok)continue;const{iu:E,iv:T,u:_,v:M,x:A,z:R}=S,k=p*4+E,C=g*2+T,z=(tb[C&7][k&7]+ye(k,C,s*7+1))/64,I=V=>ye(k,C,s*7+V),O=T===0?[-r[0],-r[1]]:r,U={x:A,z:R,rank:z,face:Math.atan2(O[0],O[1]),tile:s,bu:p,bv:g,u:_,v:M,e:c,m:r,lag:25*I(2),r2:I(3),r3:I(4),r4:I(5),r5:I(6),r6:I(7),r7:I(8),r8:I(9)};if(S===w[0]&&b){const V=p*2+v;U.anchor=!0,U.rankY=(eb[g&3][V&3]+ye(V,g,s*7+11))/16,y=U}else y&&(U.host=y);x.push(U)}}return x}}function Bp(o,t,e,n,s){var r,c;let i=t.metresAt(e,n);const a=(c=(r=o.patches)==null?void 0:r.byPack)==null?void 0:c.get(t.pack.id);if(!a)return i;for(const l of a){if(!(s<l.until))continue;const h=l.box,u=(e-h[0])/(h[2]-h[0]),f=(n-h[1])/(h[3]-h[1]);if(u<0||f<0||u>1||f>1)continue;const d=o.patches.maskAt(l.crop,u,f);d>0&&(i+=((l.kind==="raise"?Math.max(i,l.depthM):Math.min(i,l.depthM))-i)*d)}return i}function Wp(o,t){const e=o.data.proj,n=o.data.places||[],s=[],i=[],a=Object.values(t.methods||{}).flatMap(r=>{var c;return((c=r==null?void 0:r.settlement)==null?void 0:c.towns)||[]});for(const r of a){if(!Number.isFinite(r.lon)||!Number.isFinite(r.lat))continue;const[c,l]=e.toWorld([r.lon,r.lat]);s.push({x:c,z:l,s:(r.sigma||1e3)/100})}for(const r of n){if(r.kind!=="town"&&r.kind!=="bay")continue;const c=Xe(r.geometry);if(!c)continue;const[l,h]=e.toWorld(c);r.kind==="town"&&s.push({x:l,z:h,s:8}),i.push({x:l,z:h,town:r.kind==="town"})}return{cores:s,harbours:i}}function Hp(o,t,e,n){let s=0;for(const a of o.cores){const r=(t-a.x)**2+(e-a.z)**2;r>16*a.s*a.s||(s=Math.max(s,Math.exp(-r/(2*a.s*a.s))))}let i=0;for(const a of o.harbours){const r=Math.hypot(t-a.x,e-a.z);r>60||(i=Math.max(i,Math.exp(-r/15)*(a.town?n:1)))}return{centre:s,harbour:i}}const sb=8e3,Rf=8e3,In=3,Gp=o=>Ot(o*2.6,40,110),ib=[1850,1875,1900,1930,1960,2e3],ob=.1,ab=1;class rb extends Op{constructor(t,e,n,s,i){super(t),this.districts=e,this.rec=n,this.own=s,this.ribbons=i,this.group=new Te,this.group.name="settlements",this.group.visible=!1,this.ready=!1,this.failed=null,this.yearNow=t.timeline.year,s.uYearNow.value=this.yearNow,this.drawn=0,this.streamLines=n.data.streams,this.load().catch(a=>{this.failed=a.message,t.warn(`settlements: ${a.message} (the scatter is not drawn)`)})}async load(){var M,A;const t=performance.now(),e=this.app.data,n=await fetch(e.abs("layers/manifest.json"));if(!n.ok)throw new Error(`layers/manifest.json: HTTP ${n.status}`);const s=await n.json(),i=this.rec.d,a=(M=s.islands)==null?void 0:M[i.parent],r=this.app.world.islandPacks.find(R=>R.id===i.parent);if(!a||!r)throw new Error(`no settlement layer for ${i.parent}`);this.setLayers(s);const c=this.layerFiles(a);if(this.keyframes.length<2||c.some(R=>!R.settlement))throw new Error("the settlement layer lacks a keyframe");const l=R=>go(On,e.abs(`layers/${R}`)),[h,u,f,d]=await Promise.all([Promise.all(c.map(R=>l(R.settlement))),c.every(R=>R.value)?Promise.all(c.map(R=>l(R.value))).catch(()=>null):null,Np(this.app,s,i.parent),((A=this.app.works)==null?void 0:A.exclusion(i.parent))??null]);if(this.disposed)return;this.works=d;for(const[R,k]of[...h,...u||[]].entries())if(k.W!==r.W||k.H!==r.H)throw new Error(`a layer of ${i.parent} is ${k.W}×${k.H} (${R}), the pack ${r.W}×${r.H}`);const m=r.rect,x=i.rect,g=(m.x1-m.x0)/r.W,p=(m.z1-m.z0)/r.H,v=Ot(Math.floor((x.x0-m.x0)/g)-2,0,r.W-1),w=Ot(Math.ceil((x.x1-m.x0)/g)+2,0,r.W-1),b=Ot(Math.floor((x.z0-m.z0)/p)-2,0,r.H-1),y=Ot(Math.ceil((x.z1-m.z0)/p)+2,0,r.H-1),S=w-v+1,E=y-b+1;this.crop={x0:m.x0+v*g,z0:m.z0+b*p,sx:g,sz:p,w:S,h:E},this.islandRect=m;const T=R=>{const k=new Float32Array(S*E);for(let C=0;C<E;C++)for(let z=0;z<S;z++)k[C*S+z]=R.px[(b+C)*r.W+v+z];return k};this.bytes=h.map(T),this.values=u?u.map(T):null,this.zoning={...f,rect:m},this.places=Wp(this.app,s),this.townTerm(s,i.parent,"island"),this.loadMs=Math.round(performance.now()-t);const _=performance.now();await this.build()&&(this.buildMs=Math.round(performance.now()-_),this.ready=!0)}async breathe(t=!1){return(t||performance.now()-this.slice>24)&&(await new Promise(e=>setTimeout(e,0)),this.slice=performance.now()),!this.disposed}patchState(t){var r;const e=this.rec,n=e.raise.map(c=>({k:t<c.until?1:0,depth:c.depth})),s=((r=e.pmap)==null?void 0:r.groups)||[0],i=new Float32Array(16),a=new Float32Array(16).fill(-1);for(let c=0;c<s.length;c++){const l=s[c]||0;let h=-1;e.lower.forEach((u,f)=>{l&1<<f&&(h<0&&(h=f),t<u.until&&i[c]<1&&(i[c]=1,a[c]=u.depth))}),!i[c]&&h>=0&&(a[c]=e.lower[h].depth)}return{raise:n,gk:i,gd:a}}groundAt(t,e,n){const s=this.rec,i=s.d.W,a=e*i+t;let r=s.metres[a];const c=this.districts.patchAt(t,e);if(c&&c[1]+c[3]>0){const h=n.raise[c[2]&15],u=n.raise[c[2]>>4];h&&(r+=(Math.max(r,h.depth)-r)*(c[1]/255)*h.k),u&&(r+=(Math.max(r,u.depth)-r)*(c[3]/255)*u.k)}const l=s.aux[a*4];if(l){const h=c?c[0]:0;r=jl(r,l,n.gk[h],Xr(s.carve[a*2]),n.gd[h])}return r}texelOf(t,e){const n=this.rec.d,s=n.rect;return[Ot(Math.floor((t-s.x0)/(s.x1-s.x0)*n.W),0,n.W-1),Ot(Math.floor((e-s.z0)/(s.z1-s.z0)*n.H),0,n.H-1)]}edgeAt(t,e){const n=this.rec.d.rect;return Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e)}allows(t,e,n,s,i,a,r){const c=this.epochs[r],l=this.rec,h=l.aux,u=l.d.W,f=Math.cos(i),d=-Math.sin(i),m=[f,d],x=[-d,f];let g=1/0,p=-1/0,v=-1/0;if(this.dep=!1,this.works){const y=this.works.test(t,e,n,s,i,c.year);if(y&&(this.dep=!0),y===2)return null}const w=l.parent,b=ze.margin;for(let y=0;y<13;y++){const S=y===0?0:y<5?[-1,1,1,-1][y-1]:y<9?[0,1,0,-1][y-5]:[-1,1,1,-1][y-9],E=y===0?0:y<5?[-1,-1,1,1][y-1]:y<9?[-1,0,1,0][y-5]:[-1,-1,1,1][y-9],T=y>=9?1.25:1,_=t+(m[0]*S*n+x[0]*E*s)*T,M=e+(m[1]*S*n+x[1]*E*s)*T,[A,R]=this.texelOf(_,M),k=R*u+A,C=h[k*4+3];if(C>0&&h[k*4+1]>0&&(this.dep=!0,c.features.has(C)))return null;if(y>=9)continue;if(this.streamNear(_,M))return null;(h[k*4]||this.districts.patchAt(A,R))&&(this.dep=!0);let z=this.groundAt(A,R,c.state);if(z<.6)return null;const I=l.metres[k];g=Math.min(g,I),p=Math.max(p,I);const O=this.edgeAt(_,M);if(w&&O<b){const U=oe(ze.band,b,O);z=Math.max(z,Bp(this.app,w,_,M,c.year)*(1-U)+z*U),this.dep=!0}v=Math.max(v,z)}if(p-g>a)return null;for(const y of this.landmarks)if(!(Math.hypot(t-y.x,e-y.z)>=y.r+Math.max(n,s)+is)&&(this.dep=!0,c.year>=y.from))return null;return v}grounds(){const e=this.rec.d,n=e.rect,s=4,i=Math.ceil(e.W/s),a=Math.ceil(e.H/s),r=this.patchState(1800),c=new Uint8Array(i*a);for(let y=0;y<a;y++)for(let S=0;S<i;S++)c[y*i+S]=this.groundAt(Math.min(e.W-1,S*s+2),Math.min(e.H-1,y*s+2),r)<=0?1:0;const l=e.mx*s,h=e.mz*s,u=vn(i,a,y=>c[y]===1,l,h);this.sea={w:i,h:a,k:s,a:Float32Array.from(u)};const f=jn(Float32Array.from(u,y=>Math.min(y,3e3)),i,a,12,3);this.broad={w:i,h:a,a:f};const d=2,m=Math.ceil(e.W/d),x=Math.ceil(e.H/d),g=new Uint8Array(m*x),p=this.streamLines,v=y=>Ot(Math.floor((y-n.x0)/(n.x1-n.x0)*m),0,m-1),w=y=>Ot(Math.floor((y-n.z0)/(n.z1-n.z0)*x),0,x-1);for(let y=0;p&&y<p.length;){const S=p[y++];for(let E=0;E<S;E++,y+=3){if(E+1>=S)continue;const[T,_,M,A]=[p[y],p[y+1],p[y+3],p[y+4]],R=Math.max(1,Math.ceil(Math.hypot(M-T,A-_)/.05));for(let k=0;k<=R;k++)g[w(_+(A-_)*k/R)*m+v(T+(M-T)*k/R)]=1}}const b=vn(m,x,y=>g[y]===1,e.mx*d,e.mz*d);this.stream={w:m,h:x,a:Float32Array.from(b)},this.streamLines=null}coarse(t,e,n){const s=this.rec.d.rect,i=Ot(Math.floor((e-s.x0)/(s.x1-s.x0)*t.w),0,t.w-1),a=Ot(Math.floor((n-s.z0)/(s.z1-s.z0)*t.h),0,t.h-1);return t.a[a*t.w+i]}streamNear(t,e){return this.coarse(this.stream,t,e)<9}mauka(t,e){const n=this.broad,s=this.rec.d.rect,i=(t-s.x0)/(s.x1-s.x0)*n.w,a=(e-s.z0)/(s.z1-s.z0)*n.h,r=(m,x)=>n.a[Ot(x,0,n.h-1)*n.w+Ot(m,0,n.w-1)],c=Math.round(i),l=Math.round(a),h=10,u=r(c+h,l)-r(c-h,l),f=r(c,l+h)-r(c,l-h);if(Math.hypot(u,f)<.001)return Math.PI/2;const d=Math.PI/60;return Math.round(Math.atan2(f,u)/d)*d}weight(t,e){const[n,s]=this.texelOf(t,e),i=this.rec.d,a=this.rec.metres,r=(h,u)=>a[Ot(u,0,i.H-1)*i.W+Ot(h,0,i.W-1)],c=Math.hypot((r(n+2,s)-r(n-2,s))/(4*i.mx),(r(n,s+2)-r(n,s-2))/(4*i.mz));return(.55+.8*Math.max(Math.exp(-this.coarse(this.sea,t,e)/700),Math.exp(-this.coarse(this.stream,t,e)/160)))*(1-.6*oe(.08,.35,c))}epochYears(){var i;const t=this.rec,e=new Set;for(const a of[...t.raise,...t.lower])e.add(a.until);for(const a of t.d.members.values())for(const r of a){const[c,l]=Ks(r);Number.isFinite(c)&&e.add(c),Number.isFinite(l)&&e.add(l+1)}for(const a of this.landmarks)e.add(a.from);for(const a of((i=this.works)==null?void 0:i.breaks)||[])e.add(a);this.years(e);const s=this.app.timeline.yearAt(0);this.epochs=[];for(let a=0;a<=this.edges.length;a++){const r=a===0?s:this.edges[a-1],c=new Set;for(const[l]of t.d.byIndex)hp(t.d,l,r)&&c.add(l);this.epochs.push({year:r,state:this.patchState(r),features:c})}}async build(){const n=this.rec.d.rect,s=Ai(1820);this.times={},this.slice=performance.now();let i=performance.now(),a=0;const r=v=>{this.times[v]=Math.round(a+performance.now()-i),a=0,i=performance.now()},c=async()=>{const v=performance.now(),w=await this.breathe();return performance.now()-v>1&&(a+=v-i,i=performance.now()),w};if(this.kits=Lp(s,Jl),r("kits"),this.grounds(),r("grounds"),!await c())return!1;const l=[],h=Math.ceil((n.x1-n.x0)/Vt),u=Math.ceil((n.z1-n.z0)/Vt),f=new Float32Array(h*u);for(let v=0;v<u;v++)for(let w=0;w<h;w++)f[v*h+w]=this.mauka(n.x0+(w+.5)*Vt,n.z0+(v+.5)*Vt);const d=(v,w)=>v<0||w<0||v>=h||w>=u?NaN:f[w*h+v],m=new Float32Array(this.keyframes.length),x=new Float32Array(this.keyframes.length),g=vi+Af,p=this.zoning;for(let v=0;v<u;v++){if(!await c())return!1;for(let w=0;w<h;w++){const b=n.x0+w*Vt,y=n.z0+v*Vt,S=f[v*h+w],E=[d(w-1,v)!==S,d(w+1,v)!==S,d(w,v-1)!==S,d(w,v+1)!==S],T=v*h+w,_=(M,A)=>this.edgeAt(M,A)>=g;for(const M of this.tileLots(b,y,S,T,E,_)){this.bytesAt(M.x,M.z,m);let A=0;for(const I of m)A=Math.max(A,I);M.zone=Ko(p.zoning,p.rect,M.x,M.z),M.lud=Ko(p.lud,p.rect,M.x,M.z),M.zoned=!!p.zoning;const R=Ur[M.zone];R&&(A=Math.max(A,255*Math.log(1+R/this.d0)/this.L+5));const k=this.fillMax(this.people(A));if(M.rank>=k*1.5&&!(M.anchor&&M.rankY<k*1.5)||(M.w=this.weight(M.x,M.z)*(.85+.3*Nr(M.x/2.3,M.z/2.3,73)),M.rank>=k*M.w&&!(M.anchor&&M.rankY<k*M.w)))continue;M.b=Float32Array.from(m),this.values&&(M.vb=Float32Array.from(this.sample(this.values,M.x,M.z,x,0)));const C=Math.exp(-this.coarse(this.sea,M.x,M.z)/600),z=Hp(this.places,M.x,M.z,C);M.coast=C,M.harbour=z.harbour,M.centre=z.centre,l.push(M)}}}return this.lotCount=l.length,this.gridTiles={nx:h,nz:u},this.ths=f,r("lots"),this.landmarks=[],this.epochYears(),this.placeLandmarks(l),this.landmarks.length&&this.epochYears(),r("landmarks"),!await this.scatter(l,c)||(r("scatter"),this.meshes(),r("meshes"),!await this.streets(c))?!1:(r("streets"),this.instances=null,this.clearing(),!0)}placeLandmarks(t){const e=new Map((this.app.data.places||[]).map(w=>[w.id,w])),n=this.app.data.proj,s=this.keyframes,i=w=>s.findIndex(b=>b.year>=w),a=(w,b,y,S,E,T)=>{const _=this.kits[w][0],M=Rs[w],A=this.epochOfYear(E);if(this.edgeAt(b,y)<vi+Af)return!1;const R=this.allows(b,y,_.hx*M.sh,_.hz*M.sh,S,M.relief+2,A);return R===null?!1:(this.landmarks.push({kind:w,name:T,x:b,z:y,face:S,from:E,r:Math.hypot(_.hx,_.hz)*M.sh,ax:_.hx*M.sh,az:_.hz*M.sh,top:R}),!0)},r=(w,b)=>{let y=null,S=1/0;for(const E of t){const T=Math.hypot(E.x-w,E.z-b);T<S&&(S=T,y=E)}return y},c=(w,b)=>this.people(w.b[b]),l=Math.max(0,i(1853)),h=Math.max(0,i(1896)),u=e.get("kawaiahao"),f=u?n.toWorld(Xe(u.geometry)):null,d=f&&this.edgeAt(f[0],f[1])>=0,m=d?"Kawaiahaʻo":null;let x=!!u&&!d;if(d){const w=r(f[0],f[1]);x=a("church",f[0],f[1],w?w.face:0,1842,m)}if(!x){const w=this.crop,b=this.bytes[l];let y=-1,S=0,E=0;for(let _=0;_<w.h;_++)for(let M=0;M<w.w;M++)b[_*w.w+M]<=y||(y=b[_*w.w+M],S=w.x0+(M+.5)*w.sx,E=w.z0+(_+.5)*w.sz);const T=[...t].sort((_,M)=>Math.hypot(_.x-S,_.z-E)-Math.hypot(M.x-S,M.z-E));for(const _ of T.slice(0,200))if(x=a("church",_.x,_.z,_.face,1842,m))break}const g=[...t].sort((w,b)=>c(b,h)-c(w,h));let p=0;for(const w of g){if(p>=2)break;if(this.landmarks.some(y=>Math.hypot(y.x-w.x,y.z-w.z)<9))continue;let b=null;for(const y of this.samples){if(y.y<1840)continue;const S=w.b[y.a]+(w.b[y.a+1]-w.b[y.a])*y.t;if(this.people(S)>500){b=y.y;break}}b!==null&&a(b<1860?"church":"spire",w.x,w.z,w.face,b,null)&&p++}const v=e.get("aloha-tower");if(v){const[w,b]=n.toWorld(Xe(v.geometry)),y=r(w,b);a("clock",w,b,y?y.face:0,1926,v.name)}}async scatter(t,e){const n=this.Ys.length,s=this.samples,i=new Float64Array(n);for(let h=0;h<t.length;h++){if(h%512===0&&!await e())return!1;const u=t[h];for(let f=0;f<n;f++){const d=s[f],m=this.fillByte(u,d,this.byteAt(u,d));if(m<=0)continue;const[x,g]=this.fill(d,this.people(m));(u.rank<x*u.w||u.anchor&&u.rankY<4*g*u.w)&&i[f]++}}this.cap=Array.from(i,h=>Math.min(1,sb/Math.max(1,h)));const a=[],r=(h,u,f)=>this.allows(h.x,h.z,h.ax,h.az,h.a,u,f),c=h=>this.cap[h],l=h=>a.push(h);for(let h=0;h<t.length;h++){if(h%256===0&&!await e())return!1;this.scatterLot(t[h],r,c,l)}for(const h of this.landmarks){const u=Math.max(0,this.Ys.findIndex(d=>d>=h.from));let f=n;if(this.works)for(let d=u+1;d<n&&f===n;d++)this.works.test(h.x,h.z,h.ax,h.az,h.face,this.Ys[d])===2&&(f=d);a.push(this.instance({x:h.x,z:h.z,face:h.face,landmark:!0,r5:.5,r6:.5,r7:.5},{kind:zt[h.kind],variant:0,top:h.top,d:0,n0:u},f))}return this.instances=a,!0}weightAt(t,e){const n=this.spans;return oe(n[t*4],n[t*4+1],e)*(1-oe(n[t*4+2],n[t*4+3],e))}meshes(){const t=this.rec.d.rect;this.material=Si(this.app.shared,this.own,{fade:[50,70],grow:!0}),this.variants=[];const e=new Map;for(const m of os)this.kits[m].forEach((x,g)=>{e.set(zt[m]*16+g,this.variants.length),this.variants.push({name:m,v:g,kit:x,n:0})});const n=this.instances.length;this.N=n,this.vOf=new Uint16Array(n),this.mats=new Float32Array(n*16),this.spans=new Float32Array(n*4),this.stretches=new Float32Array(n),this.cols=new Float32Array(n*3),this.ix=new Float32Array(n),this.iz=new Float32Array(n),this.ia=new Float32Array(n),this.iy=new Float32Array(n),this.irx=new Float32Array(n),this.irz=new Float32Array(n),this.isv=new Float32Array(n),this.ish=new Float32Array(n),this.ikind=new Uint8Array(n),this.ivar=new Uint8Array(n),this.isite=new Int32Array(n),this.iland=new Uint8Array(n);const s=new ne,i=new hs,a=new W(0,1,0),r=new W,c=new W;this.instances.forEach((m,x)=>{const g=e.get(m.kind*16+m.variant);this.vOf[x]=g,this.variants[g].n++,i.setFromAxisAngle(a,m.a),r.set(m.x,m.y,m.z),c.set(m.sh,m.sv,m.sh),s.compose(r,i,c),s.toArray(this.mats,x*16),this.spans.set(m.span,x*4),this.stretches[x]=m.stretch,this.cols.set(m.colour,x*3),this.ix[x]=m.x,this.iz[x]=m.z,this.ia[x]=m.a,this.iy[x]=m.y,this.irx[x]=m.rx,this.irz[x]=m.rz,this.isv[x]=m.sv,this.ish[x]=m.sh,this.ikind[x]=m.kind,this.ivar[x]=m.variant,this.isite[x]=m.site,this.iland[x]=m.landmark?1:0});for(const m of this.variants){const x=Math.max(1,Math.min(m.n,Rf)),g=m.kit.geometry,p=new ha(g,this.material,x);p.name=`${m.name}-${m.v}`,p.count=0,p.visible=!1,p.frustumCulled=!1,p.instanceMatrix.setUsage(an),p.instanceColor=new he(new Float32Array(x*3),3),p.instanceColor.setUsage(an);const v=new he(new Float32Array(x*4),4);v.setUsage(an);const w=new he(new Float32Array(x),1);w.setUsage(an),g.setAttribute("aSpan",v),g.setAttribute("aStretch",w),Object.assign(m,{mesh:p,cap:x,aSpan:v,aStretch:w}),this.group.add(p)}const l=Ai(1842);this.tnx=Math.ceil((t.x1-t.x0)/In),this.tnz=Math.ceil((t.z1-t.z0)/In);const h=this.tnx*this.tnz,u=new Int32Array(n),f=new Int32Array(h);this.instances.forEach((m,x)=>{const g=Ot(Math.floor((m.x-t.x0)/In),0,this.tnx-1),p=Ot(Math.floor((m.z-t.z0)/In),0,this.tnz-1);u[x]=p*this.tnx+g,f[u[x]]++}),this.tStart=new Int32Array(h+1);for(let m=0;m<h;m++)this.tStart[m+1]=this.tStart[m]+f[m];const d=this.tStart.slice();this.tOrder=new Int32Array(n);for(let m=0;m<n;m++)this.tOrder[d[u[m]]++]=m;for(let m=0;m<h;m++)for(let x=this.tStart[m+1]-1;x>this.tStart[m];x--){const g=this.tStart[m]+Math.floor(l()*(x-this.tStart[m]+1)),p=this.tOrder[x];this.tOrder[x]=this.tOrder[g],this.tOrder[g]=p}this.always=[];for(let m=0;m<n;m++)this.iland[m]&&this.always.push(m);this.frustum=new Is,this.pv=new ne,this.box=new yn,this.key="",this.yearDrawn=NaN}aliveNear(t,e){const n=this.spans;return n[t*4]<e+1&&n[t*4+3]>e-1}refresh(t,e,n){const s=this.yearNow,i=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const a=this.rec.d.rect,r=e*.7,c=[],l=Math.max(0,Math.floor((i.x-e-a.x0)/In)),h=Math.min(this.tnx-1,Math.floor((i.x+e-a.x0)/In)),u=Math.max(0,Math.floor((i.z-e-a.z0)/In)),f=Math.min(this.tnz-1,Math.floor((i.z+e-a.z0)/In));for(let v=u;v<=f;v++)for(let w=l;w<=h;w++){const b=v*this.tnx+w;if(this.tStart[b+1]===this.tStart[b])continue;const y=a.x0+w*In,S=a.z0+v*In;this.box.min.set(y,-.5,S),this.box.max.set(y+In,n,S+In);const E=this.box.distanceToPoint(i);if(E>e||!this.frustum.intersectsBox(this.box))continue;const T=E<r?1:r/E;c.push(b,Math.round(T*20))}const d=c.join(",");if(d===this.key&&Math.abs(s-this.yearDrawn)<.5)return;this.key=d,this.yearDrawn=s;let m=0;const x=[];for(let v=0;v<c.length;v+=2){const w=this.tStart[c[v]],b=this.tStart[c[v]+1];let y=0;for(let S=w;S<b;S++)this.aliveNear(this.tOrder[S],s)&&y++;x.push(y),m+=Math.ceil(y*c[v+1]/20)}const g=Math.min(1,(Rf-this.always.length)/Math.max(1,m));for(const v of this.variants)v.c=0;const p=v=>{const w=this.variants[this.vOf[v]];if(w.c>=w.cap)return;const b=w.c++;w.mesh.instanceMatrix.array.set(this.mats.subarray(v*16,v*16+16),b*16),w.mesh.instanceColor.array.set(this.cols.subarray(v*3,v*3+3),b*3),w.aSpan.array.set(this.spans.subarray(v*4,v*4+4),b*4),w.aStretch.array[b]=this.stretches[v]};for(let v=0;v<c.length;v+=2){const w=Math.ceil(x[v/2]*c[v+1]*g/20);let b=0;for(let y=this.tStart[c[v]];y<this.tStart[c[v]+1]&&b<w;y++){const S=this.tOrder[y];this.iland[S]||!this.aliveNear(S,s)||(p(S),b++)}}for(const v of this.always)this.aliveNear(v,s)&&p(v);this.drawn=0;for(const v of this.variants)v.mesh.count=v.c,v.mesh.visible=v.c>0,v.mesh.instanceMatrix.needsUpdate=!0,v.mesh.instanceColor.needsUpdate=!0,v.aSpan.needsUpdate=!0,v.aStretch.needsUpdate=!0,this.drawn+=v.c}async streets(t){const e=this.app.timeline,n=e.yearAt(e.max),s=this.rec.d.rect,{nx:i,nz:a}=this.gridTiles;this.streetBatches=[];for(const r of ib){if(!await t())return!1;const c=Math.min(r,n),l=this.epochOfYear(c),h=this.epochs[l],u=new Map;for(let y=0;y<this.N;y++){if(Rs[os[this.ikind[y]]].loose||this.iland[y]||this.weightAt(y,c)<.5)continue;const E={x:this.ix[y],z:this.iz[y]},T=Ot(Math.floor((E.x-s.x0)/Vt),0,i-1),_=Ot(Math.floor((E.z-s.z0)/Vt),0,a-1),M=this.ths[_*i+T],A=[Math.cos(M),Math.sin(M)],R=[-A[1],A[0]],k=E.x*R[0]+E.z*R[1],C=E.x*A[0]+E.z*A[1],z=Math.floor(k/Es),I=Math.floor(C/js),O=`${_*i+T}:${z}:${I}`,U=u.get(O)||{th:M,bu:z,bv:I,n:0};U.n++,u.set(O,U)}const f=new Map;for(const y of u.values()){if(y.n<2)continue;const S=[Math.cos(y.th),Math.sin(y.th)],E=[-S[1],S[0]],T=(k,C)=>[k*E[0]+C*S[0],k*E[1]+C*S[1]],_=y.bu*Es,M=_+Es,A=y.bv*js,R=A+js;for(const[k,C,z]of[[`${y.th}:v${y.bv}:${y.bu}`,T(_,A),T(M,A)],[`${y.th}:v${y.bv+1}:${y.bu}`,T(_,R),T(M,R)],[`${y.th}:u${y.bu}:${y.bv}`,T(_,A),T(_,R)],[`${y.th}:u${y.bu+1}:${y.bv}`,T(M,A),T(M,R)]])f.set(k,[C,z])}const d=(y,S,E)=>{const T=Math.max(1,Math.ceil(Math.hypot(S[0]-y[0],S[1]-y[1])/E)),_=[];for(let M=0;M<=T;M++){const A=y[0]+(S[0]-y[0])*M/T,R=y[1]+(S[1]-y[1])*M/T,[k,C]=this.texelOf(A,R),z=C*this.rec.d.W+k,I=this.rec.aux[z*4+3];if(this.groundAt(k,C,h.state)<.4||I>0&&this.rec.aux[z*4+1]>0&&h.features.has(I))return null;_.push([A,R])}return _},m=[];for(const[y,S]of f.values()){const E=d(y,S,.4);E&&m.push({pts:E,width:ob})}const x=[],g=r<1870?1/0:r<1950?5:4;for(const y of u.values()){if(y.n<g)continue;const S=[Math.cos(y.th),Math.sin(y.th)],E=[-S[1],S[0]],T=(y.bv+.5)*js,_=A=>[A*E[0]+T*S[0],A*E[1]+T*S[1]],M=d(_(y.bu*Es+.32),_((y.bu+1)*Es-.32),.3);M&&x.push({pts:M,width:ab})}const p=new Ht(r<1910?"#9a8668":r<1950?"#8a8277":Ep.asphalt).toArray(),v=new Ht(r<1910?"#a38f6f":r<1950?"#a09888":"#a9a59c").toArray(),w=this.ribbons.add(m,{mode:"earth",colour:p,alpha:0,minPx:.7,lift:.004,order:4}),b=this.ribbons.add(x,{mode:"earth",colour:v,alpha:0,minPx:0,lift:.003,order:3});this.streetBatches.push({year:r,batch:w,padBatch:b,n:m.length,pads:x.length})}return!0}streetWeights(t){const e=this.streetBatches;return e.map((n,s)=>{const i=s>0?e[s-1].year:n.year-15,a=s+1<e.length?e[s+1].year:1/0;return t<=n.year?s===0?oe(i,n.year,t):Ot((t-i)/(n.year-i),0,1):a===1/0?1:Ot((a-t)/(a-n.year),0,1)})}clearing(){this.clearN=512,this.clearData=new Uint8Array(512*512);const e=new We(this.clearData,512,512,zs,pe);e.minFilter=e.magFilter=ie,e.needsUpdate=!0,this.clearTex=e,this.own.uTownClear.value=e,this.yearCleared=NaN,this.townsCleared=-1}stamp(t,e,n,s,i,a){const r=this.clearN,c=this.clearData,l=this.rec.d.rect,h=r/(l.x1-l.x0),u=r/(l.z1-l.z0),f=Math.abs(Math.cos(n)),d=Math.abs(Math.sin(n)),m=s*f+i*d,x=s*d+i*f,g=Ot(Math.floor((t-m-l.x0)*h),0,r-1),p=Ot(Math.floor((t+m-l.x0)*h),0,r-1),v=Ot(Math.floor((e-x-l.z0)*u),0,r-1),w=Ot(Math.floor((e+x-l.z0)*u),0,r-1);for(let b=v;b<=w;b++)for(let y=g;y<=p;y++)c[b*r+y]<a&&(c[b*r+y]=a)}stampClearing(t){var n,s;this.clearData.fill(0);for(let i=0;i<this.N;i++){const a=this.weightAt(i,t);a<.02||this.stamp(this.ix[i],this.iz[i],this.ia[i],this.irx[i],this.irz[i],Math.round(255*a))}(n=this.app.towns)==null||n.stampInto(this.rec.d.rect,t,(i,a,r,c,l,h)=>this.stamp(i,a,r,c,l,h)),this.worksClear??(this.worksClear=this.works?this.works.raster(this.rec.d.rect,this.clearN,zp):[]);const e=this.clearData;for(const i of this.worksClear){const a=V_(i.start,i.end,t);if(a<.02)continue;const r=Math.round(255*a);for(const c of i.texels)e[c]<r&&(e[c]=r)}this.clearTex.needsUpdate=!0,this.yearCleared=t,this.townsCleared=((s=this.app.towns)==null?void 0:s.version)??0}update(t,e,n){var c,l;const s=this.app.timeline.year;if(t>0?(this.yearNow+=(s-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(s-this.yearNow)<.05&&(this.yearNow=s)):this.yearNow=s,this.own.uYearNow.value=this.yearNow,!this.ready)return;this.hidden&&(e=0),this.group.visible=e>.001;const i=this.streetWeights(this.yearNow);if(this.streetBatches.forEach((h,u)=>{h.batch&&(h.batch.uniforms.uAlpha.value=.5*i[u]*e),h.padBatch&&(h.padBatch.uniforms.uAlpha.value=(h.year<1910?.3:h.year<1950?.45:.6)*i[u]*e)}),!this.group.visible)return;const a=Gp(n);this.material.uniforms.uFadeNear.value=a*.75,this.material.uniforms.uFadeFar.value=a;const r=(((c=this.rec.data)==null?void 0:c.hi)??1e3)*this.app.world.uniforms.uVert.value+3;this.refresh(this.app.camera,a,r),(!(Math.abs(this.yearNow-this.yearCleared)<.5)||(((l=this.app.towns)==null?void 0:l.version)??0)!==this.townsCleared)&&this.stampClearing(this.yearNow)}alive(t=this.yearNow){if(!this.ready)return[];const e=[];for(let n=0;n<this.N;n++){if(this.weightAt(n,t)<.999)continue;const s=os[this.ikind[n]],i=this.kits[s][this.ivar[n]];e.push({i:n,site:this.isite[n],kind:s,variant:this.ivar[n],x:this.ix[n],z:this.iz[n],a:this.ia[n],ax:i.hx*this.ish[n],az:i.hz*this.ish[n],box:i.box.map(a=>a*this.ish[n]),y:this.iy[n],height:i.top*this.isv[n],landmark:!!this.iland[n]})}return e}census(t=this.yearNow,e=null,n=null,s=1/0){return Vp(this.alive(t),e,n,s)}stats(){if(!this.ready)return{ready:!1,failed:this.failed};const t=this.Ys.findIndex(s=>s>=this.yearNow);let e=this.clearData.byteLength+this.bytes.reduce((s,i)=>s+i.byteLength,0)+this.sea.a.byteLength+this.stream.a.byteLength+this.broad.a.byteLength;for(const s of[this.mats,this.spans,this.cols,this.stretches,this.vOf,this.ix,this.iz,this.ia,this.iy,this.irx,this.irz,this.isv,this.ish,this.ikind,this.ivar,this.isite,this.iland,this.tOrder,this.tStart])e+=s.byteLength;const n=this.census(this.yearNow);return{ready:!0,year:+this.yearNow.toFixed(1),lots:this.lotCount,instances:this.N,placed:n.total,drawn:this.drawn,by:n.by,hale:n.hale,landmarks:this.landmarks.map(s=>`${s.name||s.kind} ${s.from}`),towns:this.townTerms,zoning:{zoning:this.zoning.zoning?`${this.zoning.zoning.W}×${this.zoning.zoning.H}`:null,lud:this.zoning.lud?`${this.zoning.lud.W}×${this.zoning.lud.H}`:null},value:this.values?"mask":"modelled",cap:+(this.cap[Math.max(0,t)]??1).toFixed(2),streets:this.streetBatches.map(s=>{var i;return`${s.year}:${s.n}/${s.pads}:${(((i=s.batch)==null?void 0:i.uniforms.uAlpha.value)??0).toFixed(2)}`}),triangles:this.variants.reduce((s,i)=>s+i.mesh.count*i.kit.tris,0),loadMs:this.loadMs,buildMs:this.buildMs,times:this.times,cpuMB:+(e/1048576).toFixed(1)}}dispose(){var t,e;this.disposed=!0;for(const n of this.variants||[])n.mesh.dispose(),n.kit.geometry.dispose();(t=this.material)==null||t.dispose(),(e=this.clearTex)==null||e.dispose(),this.own.uTownClear.value=null}}function Vp(o,t=null,e=null,n=1/0){const s={},i=new Set;let a=0;for(const r of o)t!==null&&Math.hypot(r.x-t,r.z-e)>n||(r.kind==="kauhale"&&a++,r.kind==="hale"&&(a+=2),!i.has(r.site)&&(i.add(r.site),s[r.kind]=(s[r.kind]||0)+1));return{by:s,total:Object.values(s).reduce((r,c)=>r+c,0),hale:a}}const Gs=Ie*1.4;function cb(o){let t=o>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Lf(o,t,e){let n=!1;for(let s=0,i=o.length-1;s<o.length;i=s++){const a=o[s],r=o[i];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function lb(o,t,e,n,s){const i=Math.cos(e),a=Math.sin(e);return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([r,c])=>[o+(r*n*i-c*s*a)/2,t+(r*n*a+c*s*i)/2])}function hb(o,t){for(const e of[o,t])for(let n=0;n<4;n++){const s=e[n],i=e[(n+1)%4],a=[i[1]-s[1],s[0]-i[0]];let r=1/0,c=-1/0,l=1/0,h=-1/0;for(const u of o){const f=u[0]*a[0]+u[1]*a[1];r=Math.min(r,f),c=Math.max(c,f)}for(const u of t){const f=u[0]*a[0]+u[1]*a[1];l=Math.min(l,f),h=Math.max(h,f)}if(c<l||h<r)return!1}return!0}function Pf(o,t){const e=[o[0]];for(let n=0;n+1<o.length;n++){const[s,i]=o[n],[a,r]=o[n+1],c=Math.max(1,Math.ceil(Math.hypot(a-s,r-i)/t));for(let l=1;l<=c;l++)e.push([s+(a-s)*l/c,i+(r-i)*l/c])}return e}class ub{constructor(t,e,n){var u,f;this.app=t,this.districts=e,this.rec=n,this.group=new Te,this.group.name="district features";const s=t.shared,i=t.data.proj,a=n.d.features.features||[];this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new Yt(0,0,0,0))},uDistS:{value:n.terrain.shadow.texture},uYearNow:{value:t.timeline.year},uTownClear:{value:null}};const r=cb(1795),c=new be;this.counts={hale:0,waa:0,pondWalls:0};for(const{index:d,f:m}of n.d.rastered){const x=(u=m.properties)==null?void 0:u.kind,g=m.geometry.coordinates[0].map(p=>i.toWorld(p));x==="village"?this.buildVillage(c,g,d,r):x==="fishpond"&&this.buildPond(c,g,d,r)}this.structMat=Si(s,this.own,{fade:[70,110]}),this.structures=new ge(c.geometry(),this.structMat),this.structures.frustumCulled=!1,this.group.add(this.structures),this.forest=new Jy(n.data.trees,n.d.rect,s,this.own),this.group.add(this.forest.group),this.ribbons=new fp(s,t.camera);const l=n.data.streams,h=[];for(let d=0;d<l.length;){const m=l[d++],x=[],g=[];for(let p=0;p<m;p++,d+=3)x.push([l[d],l[d+1]]),g.push(Math.min(7.5,1+1.3*Math.pow(l[d+2],.45))*Ie);h.push({pts:x,width:g})}this.streams=this.ribbons.add(h,{mode:"water",alpha:0,minPx:.9,lift:.004,order:5}),this.streamCount=h.length,this.trails=[];for(const d of a){const m=d.properties||{};if(m.kind!=="trail"||((f=d.geometry)==null?void 0:f.type)!=="LineString")continue;const x=Pf(d.geometry.coordinates.map(p=>i.toWorld(p)),.12),g=this.ribbons.add([{pts:x,width:3.2*Ie}],{mode:"earth",colour:new Ht("#9c7f5c").toArray(),alpha:0,minPx:1.3,lift:.006,order:5});g&&this.trails.push({p:m,batch:g,w:0})}this.forces=new L2(t,a,s,this.ribbons,(d,m)=>this.groundAt(d,m,!1)),this.group.add(this.ribbons.group,this.forces.group),this.settlements=new rb(t,e,n,this.own,this.ribbons),this.group.add(this.settlements.group),this.labels=new Sp(t,a),this.show=0}groundAt(t,e,n=!0){const s=this.districts.rawAt(t,e);if(!n)return s;const{d:i}=this.rec,a=i.rect,r=Math.max(0,Math.min(i.W-1,Math.floor((t-a.x0)/(a.x1-a.x0)*i.W))),l=Math.max(0,Math.min(i.H-1,Math.floor((e-a.z0)/(a.z1-a.z0)*i.H)))*i.W+r;return jl(s,this.rec.aux[l*4],1,Xr(this.rec.carve[l*2]))}buildVillage(t,e,n,s){t.feature(n);let i=1/0,a=-1/0,r=1/0,c=-1/0;for(const[f,d]of e)i=Math.min(i,f),a=Math.max(a,f),r=Math.min(r,d),c=Math.max(c,d);const l=.85,h=[],u=[];for(let f=r+l/2;f<c;f+=l)for(let d=i+l/2;d<a;d+=l){const m=d+(s()-.5)*l*.7,x=f+(s()-.5)*l*.7;!Lf(e,m,x)||s()<.25||h.push([m,x])}for(const[f,d]of h){const m=s()*Math.PI*2,x=2+Math.floor(s()*3),g=[];for(let p=0;p<x;p++){const v=m+p/x*Math.PI*2+(s()-.5)*.6,w=p===0?0:.3+s()*.12,b=f+Math.cos(v)*w,y=d+Math.sin(v)*w;if(!Lf(e,b,y)||g.some(([k,C])=>Math.hypot(k-b,C-y)<.3))continue;g.push([b,y]);const S=6+s()*3,E=4+s()*1.4;let T=1/0,_=-1/0;for(const[k,C]of[[0,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const z=this.groundAt(b+k*S*.5*Gs,y+C*E*.5*Gs,!1);T=Math.min(T,z),_=Math.max(_,z)}if(T<.6||_-T>2.5)continue;const M=m+p%2*Math.PI*.5,A=lb(b,y,M,(S+2.4)*Gs,(E+2.4)*Gs);if(u.some(k=>hb(k,A)))continue;u.push(A);const R=Yn(_);t.at(b,R,y,M,Gs),Rr(t,s,S,E,4.6+s()*1.2,!0,.9+Yn(_-T)/Gs),t.done(),this.counts.hale++}if(s()<.4){const p=f+.08,v=d-.06;t.at(p,Yn(this.groundAt(p,v,!1)),v,0,Gs),jy(t,s),t.done()}}this.buildCanoes(t,e,n,s),t.feature(0)}buildCanoes(t,e,n,s){let i=0,a=0;for(const[f,d]of e)i+=f/e.length,a+=d/e.length;const r=[],c=9,l=.06,h=Array.from({length:16},(f,d)=>[Math.cos(d/16*Math.PI*2),Math.sin(d/16*Math.PI*2)]);for(let f=a-c;f<a+c;f+=l)for(let d=i-c;d<i+c;d+=l){const m=this.groundAt(d,f);if(m<.3||m>2.2)continue;let x=null;for(const[g,p]of h)this.groundAt(d+g*.3,f+p*.3)<=0&&(x=x?[x[0]+g,x[1]+p]:[g,p]);x&&r.push([d,f,m,Math.atan2(x[1],x[0]),Math.hypot(d-i,f-a)])}r.sort((f,d)=>f[4]-d[4]);const u=[];for(const f of r){if(u.length>=14)break;u.some(d=>Math.hypot(d[0]-f[0],d[1]-f[1])<.22)||u.push(f)}for(const[f,d,m,x]of u)t.at(f,Yn(m)+.002,d,x,Gs),$y(t,s,7+s()*4),t.done(),this.counts.waa++}buildPond(t,e,n,s){t.feature(n);const i=gt(qo.pondStone,.12,s),a=Pf(e,.05).map(([r,c])=>[r,Yn(Math.max(this.groundAt(r,c),-.8))-.004,c]);t.wall(a,3*Ie,1.6*Ie,i,st.stone,.72),this.counts.pondWalls++,t.feature(0)}update(t,e,n){const s=e;this.show=s,this.own.uShow.value=s;const i=this.districts.featSeen,a=this.own.uFeatSeen.value;for(let l=0;l<64;l++)a[l>>2].setComponent(l&3,i[l]);this.group.visible=s>.001;const r=this.app.timeline.year,c=t>0?1-Math.exp(-t*1.6):1;this.streams&&(this.streams.uniforms.uAlpha.value=.8*s);for(const l of this.trails){const h=Yr(l.p,r)?1:0;l.w+=(h-l.w)*c,Math.abs(h-l.w)<.003&&(l.w=h),l.batch.uniforms.uAlpha.value=.75*l.w*s}this.forest.update(this.app.camera,s,this.rec.data.hi*this.app.world.uniforms.uVert.value+1,n),this.forces.update(t,s,n),this.settlements.update(t,s,n),this.ribbons.update(this.app.renderer),this.labels.update(s)}settle(t,e){this.update(0,t,e)}stats(){return{...this.counts,trees:this.forest.total,treesDrawn:this.forest.drawn,treeRadius:gi,streams:this.streamCount,trails:this.trails.filter(t=>t.w>.5).length,forces:this.forces.stats(),labels:this.labels.visible(),settlements:this.settlements.stats()}}dispose(){this.structures.geometry.dispose(),this.structMat.dispose(),this.forest.dispose(),this.ribbons.dispose(),this.forces.dispose(),this.settlements.dispose(),this.labels.dispose()}}const Hc=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)},Sl=new Float32Array(65536);for(let o=0;o<65536;o++)Sl[o]=Xr(o);class fb{constructor(t){this.app=t,this.world=t.world,this.list=[],this.loaded=!1,this.cur=null,this.incoming=null,this.k=0,this.want=0,this.patchW=new Float32Array(64).fill(1),this.groupK=new Float32Array(rs),this.groupDepth=new Float32Array(rs),this.featK=new Float32Array(64),this.featSeen=new Float32Array(64),this.u=this.world.uniforms,this._frustum=new Is,this._m=new ne,this._box=new yn,this.lastSeen=0,this.log=[]}patchWeights(){const t=this.cur;return t!=null&&t.lower?[...t.raise,...t.lower].map((e,n)=>({id:e.id,kind:e.kind,depth:e.depth,until:e.until,k:+this.patchW[n].toFixed(3)})):[]}async load(){var n;const t=await Uy(this.app.data,this.app.warn),e=await((n=this.app.patches)==null?void 0:n.ready)||[];this.list=t,this.setPatches(e),this.loaded=!0}setPatches(t){const e=this.app.warn;for(const s of this.list)s.patches=Wy(s,t,e);const n=new Set(this.world.islandPacks.map(s=>s.id));for(const s of t)!n.has(s.pack)&&!this.list.some(i=>i.id===s.pack)&&e(`patch ${s.id}: no pack or district ${s.pack} here; not drawn`);this.patchW.fill(1),this.incoming=null,this.cur&&this.drop()}districtAt(t,e,n=0,s=null){var h,u,f;const i=[],a=[];for(const d of this.list){const m=d.rect;if(!(t>m.x0-n&&t<m.x1+n&&e>m.z0-n&&e<m.z1+n))continue;const x=Math.hypot(Math.max(m.x0-t,0,t-m.x1),Math.max(m.z0-e,0,e-m.z1));x===0?i.push(d):a.push([x,d])}if(i.length===1)return i[0];if(!i.length){if(a.length<2)return((h=a[0])==null?void 0:h[1])??null;const d=s||this.mokuAt(t,e),m=d?a.filter(([,x])=>this.homeOf(x)===d):[];return m.length===1?m[0][1]:a.reduce((x,g)=>g[0]<x[0]?g:x)[1]}const r=s||this.mokuAt(t,e),c=r?i.filter(d=>this.homeOf(d)===r):[];if(c.length===1)return c[0];const l=((u=this.incoming)==null?void 0:u.d)??((f=this.cur)==null?void 0:f.d)??null;return i.includes(l)?l:i[0]}homeOf(t){var e,n;if(t.home===void 0){const s=this.app.polity,i=t.rect,a=new Map;for(let r=0;s&&r<12;r++)for(let c=0;c<12;c++){const l=s.mokuAt(i.x0+(c+.5)*(i.x1-i.x0)/12,i.z0+(r+.5)*(i.z1-i.z0)/12);l&&a.set(l.name,(a.get(l.name)||0)+1)}t.home=((e=t.desc)==null?void 0:e.moku)||((n=[...a].sort((r,c)=>c[1]-r[1])[0])==null?void 0:n[0])||null}return t.home}mokuAt(t,e){const n=this.app.polity,s=n==null?void 0:n.mokuAt(t,e);if(!s)return null;for(const[i,a]of[[5,0],[-5,0],[0,5],[0,-5]]){const r=n.mokuAt(t+i,e+a);if(r&&r.name!==s.name)return null}return s.name}reach(t,e){const n=t.rect,s=e.position;return Math.hypot(Math.max(n.x0-s.x,0,s.x-n.x1),Math.max(n.z0-s.z,0,s.z-n.z1),Math.max(1,s.y))}prefetch(t,e,n=null){const s=this.districtAt(t,e,20,n);return s&&(this.prefetchAt=performance.now(),this.prefetched=s,this.prefetchXZ=[t,e],this.stream(s)),s}readyAt(t,e){var s;const n=this.districtAt(t,e);return!!n&&((s=this.cur)==null?void 0:s.d)===n&&this.cur.state==="ready"}get showing(){return!!this.on||this.k>0}stream(t){var n,s;if(((n=this.cur)==null?void 0:n.d)===t){this.incoming=null;return}if(((s=this.incoming)==null?void 0:s.d)===t)return;if(!this.world.terrains.get(t.parent)){this.pending=t;return}this.pending===t&&(this.pending=null);const e={d:t,state:"loading",t0:performance.now()};this.cur&&this.showing?this.incoming=e:(this.incoming=null,this.cur&&this.drop(),this.cur=e),this.lastSeen=e.t0,this.decoder=this.decoder||new Hy(this.app.warn),this.decoder.decode(t).then(i=>{this.cur===e?this.arrive(e,i):this.incoming===e&&(e.out=i,e.state="decoded")}).catch(i=>{this.cur!==e&&this.incoming!==e||(this.app.warn(`district ${t.id}: ${i.message}`),e.state="failed")})}swap(){const t=this.incoming;if(t&&(this.incoming=null,this.cur&&this.drop(),this.cur=t,this.lastSeen=performance.now(),t.out)){const e=t.out;t.out=null,this.arrive(t,e)}}aimed(t){const e=this.app.rig,n=e==null?void 0:e.flight,s=this.prefetched&&performance.now()-(this.prefetchAt??-1e9)<ze.hold*1e3?this.prefetched:null;let i=null,a=!1;if(n){if(n.dest.distance<ze.rig[1]){const r=n.dest.target,c=this.prefetchXZ;i=s&&c&&Math.hypot(r.x-c[0],r.z-c[1])<.5?s:this.districtAt(r.x,r.z,20),a=!!i}}else{const r=e?e.goal.target:t.position,c=this.prefetchXZ,l=s&&c&&Math.hypot(r.x-c[0],r.z-c[1])<.5?s:this.districtAt(r.x,r.z,ze.prefetch),h=l?this.reach(l,t):1/0;h<ze.prefetch&&(i=l),a=h<ze.far}return s&&s!==i&&!(i&&a)&&(i=s),i}arrive(t,e){var l;const{d:n}=t;t.decodeMs=Math.round(performance.now()-t.t0),t.data=e,t.metres=e.metres,t.aux=e.aux,t.carve=e.carve;const s={id:n.id,name:n.name,rect:n.rect,W:n.W,H:n.H,rainUrl:n.rainUrl,data:{metres:e.metres,normals:e.normals,land:e.land,lo:e.lo,hi:e.hi}};t.pack=s;const i=this.world.terrains.get(n.parent);t.parUniforms={uParN:{value:(i==null?void 0:i.normalTex)??null},uParL:{value:(i==null?void 0:i.landTex)??null},uParS:{value:(i==null?void 0:i.shadow.texture)??null},uParRect:{value:i?i.rect:new Yt(0,0,1,1)},uParSlot:{value:-1},uParRain:{value:(i==null?void 0:i.uniforms.uOwnRain.value)??1}};const a=new dl(s,this.world,[this.world.arch,i].filter(Boolean),{vertexShader:gy,fragmentShader:xy,shadowFragment:vy,shadowSize:512,uniforms:{...t.parUniforms,uDistN:{value:null},uDistL:{value:null},uDistS:{value:null}}});for(const h of[a.full,a.half]){const u=h.material.uniforms;u.uDistN.value=a.normalTex,u.uDistL.value=a.landTex,u.uDistS.value=a.shadow.texture}if(a.group.visible=!1,a.group.name=`district ${n.id}`,a.applyRange(((l=this.app.qset)==null?void 0:l.range)??4.6),this.app.params.get("debug"))for(const h of[a.full,a.half])h.material.uniforms.uDebug.value=Number(this.app.params.get("debug"));t.terrain=a,t.parent=i,this.world.group.add(a.group),t.heightTex=a.heightTex;const r=new We(e.aux,n.W,n.H,Ae,pe);r.minFilter=r.magFilter=ie,r.needsUpdate=!0;const c=new We(e.carve,n.W,n.H,Td,ks);if(c.minFilter=c.magFilter=ie,c.needsUpdate=!0,t.auxTex=r,t.carveTex=c,t.pmap=e.patchMap,t.pmap){const h=t.pmap,u=new We(h.data,h.w,h.h,Ae,pe);u.minFilter=u.magFilter=ie,u.needsUpdate=!0,t.patchTex=u,t.patchBox=new Yt(h.x0,h.y0,h.x0+h.w,h.y0+h.h)}t.lower=n.patches.filter(h=>h.kind==="lower"),t.raise=n.patches.filter(h=>h.kind==="raise"),t.uploads=[a.heightTex,r,c,a.normalTex,a.landTex,...t.patchTex?[t.patchTex]:[]],t.state="uploading",t.features=new ub(this.app,this,t),this.app.scene.add(t.features.group),e.normals=e.land=null,e.trees={counts:e.trees.counts},e.streams=null,this.patchW.fill(1),this.featK.fill(0),this.featSeen.fill(0);for(const h of this.u.uFeatK.value)h.set(0,0,0,0);for(const h of this.u.uFeatCrop.value)h.set(0,0,0,0);this.yearWeights(1)}drop(){var e,n,s;const t=this.cur;t&&(this.off(),t.terrain&&(this.world.group.remove(t.terrain.group),t.terrain.dispose()),(e=t.auxTex)==null||e.dispose(),(n=t.carveTex)==null||n.dispose(),(s=t.patchTex)==null||s.dispose(),t.features&&(this.app.scene.remove(t.features.group),t.features.dispose()),this.cur=null,this.k=0)}off(){var e,n;const t=this.u;t.uDistInfo.value.set(0,0,ze.margin,ze.band),t.uDistH.value=this.world.dummy,t.uDistAux.value=this.world.dummyAux,t.uDistCarve.value=this.world.dummy,t.uDistPatch.value=this.world.dummyAux,t.uDistPatchBox.value.set(0,0,0,0),(e=this.app.crops)==null||e.bindDistrict(null),(n=this.cur)!=null&&n.terrain&&(this.cur.terrain.group.visible=!1),this.on=!1}yearWeights(t){var r,c;const e=this.cur,n=this.app.timeline.year,s=this.patchW;if(e!=null&&e.lower){[...e.raise,...e.lower].forEach((x,g)=>{const p=n<x.until?1:0;let v=s[g]+(p-s[g])*t;Math.abs(v-p)<.002&&(v=p),s[g]=v});const h=e.raise.length,u=this.u.uDistRaise.value;let f=-1e9;for(let x=0;x<rs;x++)u[x].set(x<h?s[x]:0,x<h?e.raise[x].depth:0,0,0),x<h&&s[x]>0&&(f=Math.max(f,e.raise[x].depth));this.u.uDistRaiseTop.value=f;const d=this.u.uDistLower.value,m=((r=e.pmap)==null?void 0:r.groups)||[0];for(let x=0;x<rs;x++){let g=0,p=-1;const v=m[x]||0;e.lower.forEach((w,b)=>{v&1<<b&&s[h+b]>g&&(g=s[h+b],p=w.depth)}),g===0&&v&&(p=((c=e.lower.find((w,b)=>v&1<<b))==null?void 0:c.depth)??-1),this.groupK[x]=g,this.groupDepth[x]=p,d[x].set(g,p,0,0)}}const i=this.u.uFeatK.value,a=this.u.uFeatCrop.value;if(e)for(const[l]of e.d.byIndex){const h=hp(e.d,l,n),u=h?1:0;h&&a[l>>2].setComponent(l&3,ml(h)==="rice"?2:ml(h)?1:0);let f=this.featK[l]+(u-this.featK[l])*t;Math.abs(f-u)<.002&&(f=u),this.featK[l]=f;const d=n>=Math.min(...e.d.members.get(l).map(x=>Ks(x)[0]))?1:0;let m=this.featSeen[l]+(d-this.featSeen[l])*t;Math.abs(m-d)<.002&&(m=d),this.featSeen[l]=m,i[l>>2].setComponent(l&3,f)}}wantFor(t,e,n){var l,h;const s=t.rect,i=e.position,a=Math.max(s.x0-i.x,0,i.x-s.x1),r=Math.max(s.z0-i.z,0,i.z-s.z1),c=Math.hypot(a,r,Math.max(1,i.y));return this.dc=c,this._m.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this._box.min.set(s.x0,0,s.z0),this._box.max.set(s.x1,Math.max(1,(((h=(l=this.cur)==null?void 0:l.data)==null?void 0:h.hi)??1e3)*this.u.uVert.value),s.z1),this._frustum.intersectsBox(this._box)?Hc(ze.far,ze.near,c)*(1-Hc(ze.rig[0],ze.rig[1],n)):0}update(t,e,n){var f,d;if(!this.loaded||!this.list.length)return;if(this.pending&&this.world.terrains.get(this.pending.parent)){const m=this.pending;this.pending=null,this.stream(m)}const s=this.aimed(t);s&&this.stream(s),this.incoming&&!this.showing&&this.swap();const i=this.cur,a=1-Math.exp(-n*2.5);if(this.yearWeights(n>0?1-Math.exp(-n*dd):1),!i)return;if(i.state==="uploading"){const m=i.uploads.shift();m&&this.app.renderer.initTexture(m),i.uploads.length||(i.state="ready",i.readyMs=Math.round(performance.now()-i.t0))}const r=i.parent,c=r&&r.slot>=0?r.k:0,l=i.state==="ready"&&!this.incoming?Math.min(this.wantFor(i.d,t,e),c):0;this.want=l,this.forceK!==null&&this.forceK!==void 0&&i.state==="ready"&&c>0&&!this.incoming?this.k=Math.min(this.forceK,c):(this.k+=(l-this.k)*a,Math.abs(l-this.k)<.004&&(this.k=l),this.k=Math.min(this.k,c));const h=i.state==="ready"&&c>0&&(this.k>0||l>0);h?this.switchOn(i):this.on&&this.off(),(h||this.k>0)&&(this.lastSeen=performance.now());const u=Math.max(this.lastSeen,this.prefetched===i.d?(this.prefetchAt??-1e9)+ze.hold*1e3:-1e9);!h&&!this.incoming&&this.reach(i.d,t)>ze.prefetch*1.2&&performance.now()-u>ze.linger*1e3&&i.state!=="loading"&&this.drop(),this.cur&&((f=i.terrain)==null||f.update(t,this.on),(d=i.features)==null||d.update(n,this.on?this.k:0,e))}switchOn(t){var i;const e=this.u,n=t.parent;e.uDistRect.value.copy(t.terrain.rect),e.uDistInfo.value.set(this.k,1,ze.margin,ze.band),e.uDistH.value=t.heightTex,e.uDistAux.value=t.auxTex,e.uDistCarve.value=t.carveTex,e.uDistPatch.value=t.patchTex||this.world.dummyAux,t.patchBox?e.uDistPatchBox.value.copy(t.patchBox):e.uDistPatchBox.value.set(0,0,0,0);const s=t.parUniforms;s.uParSlot.value=n.slot,s.uParN.value=n.normalTex,s.uParL.value=n.landTex,s.uParS.value=n.shadow.texture,(i=this.app.crops)==null||i.bindDistrict(n.pack.id),this.on=!0}updateShadow(t,e,n,s){var i;this.on&&((i=this.cur)!=null&&i.terrain)&&this.cur.terrain.shadow.update(t,e,n,this.k,s)}settle(t,e){var a;this.incoming&&(this.k=0,this.off(),this.swap()),this.yearWeights(1);const n=this.cur;if(!n||n.state!=="ready")return;const s=n.parent,i=s&&s.slot>=0?s.k:0;this.k=Math.min(this.wantFor(n.d,t,e),i),this.k>0?(this.switchOn(n),n.terrain.update(t,!0)):this.on&&this.off(),(a=n.features)==null||a.settle(this.k,e)}weightAt(t,e){if(!this.on)return 0;const n=this.cur.d.rect,s=Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e);return this.k*Hc(ze.band,ze.margin,s)}patchAt(t,e){const n=this.cur.pmap;if(!n||t<n.x0||e<n.y0||t>=n.x0+n.w||e>=n.y0+n.h)return null;const s=((e-n.y0)*n.w+(t-n.x0))*4;return n.data.subarray(s,s+4)}texel(t,e){const n=this.cur,s=n.d.W,i=e*s+t;let a=n.metres[i];const r=n.aux,c=this.patchAt(t,e);if(c&&c[1]+c[3]>0){const u=this.u.uDistRaise.value,f=u[c[2]&15],d=u[c[2]>>4];a+=(Math.max(a,f.y)-a)*(c[1]/255)*f.x,a+=(Math.max(a,d.y)-a)*(c[3]/255)*d.x}const l=r[i*4];if(l){const u=c?c[0]:0;a=jl(a,l,this.groupK[u],Sl[n.carve[i*2]],this.groupDepth[u])}const h=r[i*4+3];if(h>0){const u=this.featK[h];h<qn.pond?a+=(lp(a,Sl[n.carve[i*2]],r[i*4+2])-a)*(r[i*4+1]/255)*u:h<qn.other&&(a+=(Zd-a)*(r[i*4+1]/255)*u)}return a}metresAt(t,e){const{d:n}=this.cur,s=n.rect;let i=(t-s.x0)/(s.x1-s.x0)*n.W-.5,a=(e-s.z0)/(s.z1-s.z0)*n.H-.5;i=Math.max(0,Math.min(n.W-1.001,i)),a=Math.max(0,Math.min(n.H-1.001,a));const r=i|0,c=a|0,l=i-r,h=a-c,u=this.texel(r,c)+(this.texel(r+1,c)-this.texel(r,c))*l,f=this.texel(r,c+1)+(this.texel(r+1,c+1)-this.texel(r,c+1))*l;return u+(f-u)*h}blend(t,e,n){const s=this.weightAt(t,e);return s>0?n+(this.metresAt(t,e)-n)*s:n}rawAt(t,e){const{d:n}=this.cur,s=n.rect,i=Math.max(0,Math.min(n.W-1,Math.floor((t-s.x0)/(s.x1-s.x0)*n.W))),a=Math.max(0,Math.min(n.H-1,Math.floor((e-s.z0)/(s.z1-s.z0)*n.H)));return this.cur.metres[a*n.W+i]}stats(){var i,a;const t=this.cur;if(!t)return{district:null,incoming:this.incoming?`${this.incoming.d.id}:${this.incoming.state}`:null,loaded:this.loaded,count:this.list.length};const e=t.d.W*t.d.H,n=e*4+e*4+e*4+2*(e*4*4/3)+512*512+(t.pmap?t.pmap.w*t.pmap.h*4:0),s=t.metres?e*4+e*4+e*4:0;return{district:t.d.id,incoming:this.incoming?`${this.incoming.d.id}:${this.incoming.state}`:null,state:t.state,k:+this.k.toFixed(3),want:+this.want.toFixed(3),on:!!this.on,patches:this.patchWeights(),patchMap:t.pmap?{box:[t.pmap.x0,t.pmap.y0,t.pmap.w,t.pmap.h],groups:t.pmap.groups.length-1}:null,decodeMs:t.decodeMs??null,readyMs:t.readyMs??null,workerMs:((i=t.data)==null?void 0:i.ms)??null,gpuMB:+(n/1048576).toFixed(1),cpuMB:+(s/1048576).toFixed(1),nodes:t.terrain?t.terrain.full.count+t.terrain.half.count:0,features:((a=t.features)==null?void 0:a.stats())??null}}}const db=`
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,pb=`
${Ne}
${Mo}
${Ye}
${Fs}
${Qs}
uniform vec3 uCamPos;
uniform vec2 uWind;        // direction the wind blows toward, scaled by strength (0..1+)
uniform vec2 uSwellDir;    // direction the swell travels
uniform int uDebug;
in vec3 vWorld;

float seaDepth(vec2 xz) { return -groundMetres(xz); }

// a mottle fixed to the ground, about eight pixels to a patch at any zoom
// (the two power-of-two cells nearest that, crossfaded), so a reef flat
// seen across an island and one seen from a stop both read as reef
float mottle(vec2 xz, float px) {
  float lv = log2(max(px, 1e-4) * 8.0);
  float l0 = floor(lv);
  vec2 a = xz / exp2(l0);
  vec2 b = xz / exp2(l0 + 1.0);
  float m0 = 0.62 * vnoise(a + 3.1) + 0.38 * vnoise(a * 2.07 + 11.3);
  float m1 = 0.62 * vnoise(b + 7.7) + 0.38 * vnoise(b * 2.07 + 5.9);
  return mix(m0, m1, lv - l0);
}

vec2 noiseGrad(vec2 p) {
  const float e = 0.25;
  return vec2(vnoise(p + vec2(e, 0.0)) - vnoise(p - vec2(e, 0.0)), vnoise(p + vec2(0.0, e)) - vnoise(p - vec2(0.0, e))) / (2.0 * e);
}
// Sea-surface slope: a few long swells, plus wind chop made of drifting noise,
// each faded out once it is finer than a pixel (detail: world units per pixel).
vec2 waveSlope(vec2 p, float t, float detail) {
  vec2 d0 = normalize(uWind + vec2(1e-3));
  vec2 sw = normalize(uSwellDir + vec2(1e-3));
  vec2 grad = vec2(0.0);
  float amp = 0.006;
  float k = 2.2;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float ang = (hash12(vec2(fi, 1.7)) - 0.5) * 0.7;
    vec2 d = vec2(sw.x * cos(ang) - sw.y * sin(ang), sw.x * sin(ang) + sw.y * cos(ang));
    float w = sqrt(9.8 * k * 100.0) * 0.01;
    float ph = dot(d, p) * k - t * w + hash12(vec2(fi, 4.2)) * 6.28;
    float fade = 1.0 - smoothstep(0.12, 0.45, detail * k / 6.283);
    grad += d * cos(ph) * amp * k * fade;
    amp *= 0.7;
    k *= 1.45;
  }
  float a = 0.5;
  float f = 1.6;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  vec2 q = p;
  for (int i = 0; i < 5; i++) {
    float fade = 1.0 - smoothstep(0.08, 0.35, detail * f);
    if (fade > 0.0) grad += noiseGrad(q * f + d0 * t * (0.25 + 0.12 * float(i))) * a * 0.022 * f * fade;
    q = rot * q;
    a *= 0.62;
    f *= 2.1;
  }
  return grad;
}

void main() {
  vec2 xz = vWorld.xz;
  float depth = seaDepth(xz);
  if (depth < -${ep.toFixed(2)}) discard; // the land's (terrain.glsl.js SEA_EDGE)
  vec3 V = normalize(uCamPos - vWorld);
  float px = length(fwidth(xz));

  // (in a fishpond, behind its wall, the water lies still and green)
  float pond = distPond(xz);
  vec2 g = waveSlope(xz, uTime, px) * (0.55 + 0.6 * length(uWind));
  g *= (1.0 + 0.6 * (1.0 - smoothstep(0.5, 6.0, depth))) * (1.0 - 0.85 * pond);
  vec3 N = normalize(vec3(-g.x, 1.0, -g.y));

  // --- what's under the surface ------------------------------------------
  float fb = fbm2F(xz * 1.7, px * 1.7);
  vec3 sandC = vec3(0.80, 0.72, 0.55);
  vec3 reefC = mix(vec3(0.30, 0.27, 0.20), vec3(0.42, 0.30, 0.34), fbm2F(xz * 4.0 + 7.0, px * 4.0));
  float reef = smoothstep(0.45, 0.62, fb) * (1.0 - smoothstep(4.0, 14.0, depth));
  vec3 bed = mix(sandC, reefC, clamp(reef, 0.0, 1.0));
  // the reef flat of a patch's years: heads of coral and rubble in the reef's
  // own colours, mottled at a size that reads at any zoom and standing nearer
  // the surface than the flat round them, so the patch is reef and not one
  // even depth of blue, and meets the reef beyond its edge without a seam
  // (a patch's reef flat is a few metres down at most: deeper water never asks)
  float rf = 0.0;
  if (depth < 12.0) rf = patchReef(xz);
  float dU = depth;
  if (rf > 0.002) {
    float mt = mottle(xz, px);
    float head = smoothstep(0.42, 0.66, mt) * rf;
    vec3 coral = mix(vec3(0.30, 0.27, 0.20), vec3(0.42, 0.30, 0.34), smoothstep(0.3, 0.7, mottle(xz * 1.9 + 17.0, px)));
    bed = mix(bed, coral, head * 0.85);
    dU = depth * (1.0 - 0.5 * head);
  }
  vec3 absorb = vec3(0.46, 0.105, 0.055);
  float vis = sunVisibility(vec3(vWorld.x, 0.0, vWorld.z));
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor * 0.8 + uMoonColor * 0.3;
  float caust = 0.0;
  if (px < 0.012) {
    vec2 cp = xz * 70.0;
    float ca = voronoi(cp + vec2(uTime * 0.9, uTime * 0.6)).x;
    float cb = voronoi(cp * 1.31 - vec2(uTime * 0.7, -uTime * 0.5)).x;
    caust = pow(1.0 - min(ca, cb), 6.0) * 1.6 * (1.0 - smoothstep(1.0, 8.0, depth)) * (1.0 - smoothstep(0.003, 0.012, px));
  }
  vec3 under = bed * light * (1.0 + caust * vis) * exp(-absorb * dU * 2.0);
  vec3 amb = uSkyColor * 1.6 + uSunColor * max(uSunDir.y, 0.0) * vis;
  vec3 deepC = vec3(0.004, 0.030, 0.075) * amb;
  vec3 turq = vec3(0.03, 0.20, 0.21) * amb;
  // (and in the channels, a kilometre and more down, the deepest blue)
  vec3 abyss = vec3(0.002, 0.018, 0.060) * amb;
  float scatter = 1.0 - exp(-dU * 0.3);
  vec3 body = mix(turq, deepC, smoothstep(5.0, 45.0, depth));
  body = mix(body, vec3(0.075, 0.13, 0.07) * amb, pond);
  body = mix(body, abyss, smoothstep(200.0, 1500.0, depth));
  vec3 water = under * (1.0 - 0.7 * pond) + body * max(scatter, 0.8 * pond);

  // --- the surface ---------------------------------------------------------
  float cosT = max(dot(N, V), 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y);
  vec3 refl = skyMap(R);
  vec3 H = normalize(uSunDir + V);
  float spec = pow(max(dot(N, H), 0.0), 900.0) * 60.0 + pow(max(dot(N, H), 0.0), 90.0) * 0.6;
  vec3 col = mix(water, refl, F * (1.0 - 0.5 * pond)) + uSunColor * spec * vis * step(0.0, uSunDir.y);

  // --- foam --------------------------------------------------------------------
  // swash at the shore, where the water is shallowest (depth stands in for the
  // distance to land), and whitecaps in the trades out in deeper water
  // (over a patch's reef flat, which is a metre or two down throughout, the
  // swash would cover all of it: there it stays at the real shore's edge)
  float shore = (1.0 - smoothstep(0.1, 1.4, depth)) * (1.0 - pond) * (1.0 - 0.75 * rf);
  float swash = 0.5 + 0.5 * sin(depth * 9.0 - uTime * 1.6 + fbm2F(xz * 3.0, px * 3.0) * 4.0);
  float foamTex = smoothstep(0.35, 0.75, fbm2F(xz * 9.0 + vec2(uTime * 0.3, 0.0), px * 9.0));
  float caps = smoothstep(0.78, 0.92, fbm2F(xz * 0.9 + uWind * uTime * 0.06, px * 0.9)) * smoothstep(0.55, 1.1, length(uWind)) * smoothstep(20.0, 60.0, depth);
  caps *= 1.0 - smoothstep(0.3, 1.2, px);
  float foam = max(shore * swash * 0.9 * (1.0 - smoothstep(0.4, 2.5, px)), caps * 0.5) * mix(1.0, foamTex, 0.5);
  vec3 foamC = vec3(0.92) * (uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor * 1.4);
  col = mix(col, foamC, clamp(foam, 0.0, 1.0));

  if (uDebug == 1) col = vec3(depth / 100.0, fract(depth), 0.0);
  gl_FragColor = vec4(col, 1.0);
}
`;function mb(o,t,e,n){const s=[0,0,0];for(let r=0;r<=n;r++){const c=o*Math.pow(t/o,r/n);for(let l=0;l<e;l++){const h=l/e*Math.PI*2;s.push(Math.cos(h)*c,0,Math.sin(h)*c)}}const i=[];for(let r=0;r<e;r++)i.push(0,1+(r+1)%e,1+r);for(let r=0;r<n;r++)for(let c=0;c<e;c++){const l=1+r*e+c,h=1+r*e+(c+1)%e,u=l+e,f=h+e;i.push(l,h,u,h,f,u)}const a=new Je;return a.setAttribute("position",new Ue(s,3)),a.setIndex(i),a}class gb{constructor(t,e){this.uniforms={...t.uniforms,...e,uCamPos:{value:new W},uWind:{value:new Bt(-.8,.45)},uSwellDir:{value:new Bt(-.6,.8)},uDebug:{value:0}},this.material=new _e({vertexShader:db,fragmentShader:pb,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new ge(mb(1,25e4,96,120),this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const xb=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],vb={ra:12.857,dec:27.13};function wb(o){let t=o>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}const Ss=Math.PI/180,Wo=21*Ss,nr=29.530588,yb=224.1;function kf(o,t,e){const n=Math.cos(o),s=-n*Math.sin(t),i=Math.sin(o)*Math.cos(Wo)-n*Math.cos(t)*Math.sin(Wo),a=Math.sin(o)*Math.sin(Wo)+n*Math.cos(t)*Math.cos(Wo);return e.set(s,a,-i)}function Mb(o,t,e={}){const n=23.44*Ss*Math.sin(2*Math.PI*(284+o)/365),s=(o-80)/365.25*360*Ss,a=((o-80)/365.25*24%24+24)%24+t-12;e.sun=kf(n,(t-12)*15*Ss,e.sun||new W);const r=o+t/24,c=((r-yb)%nr+nr)%nr,l=c/nr,h=s+l*2*Math.PI,u=Math.asin(Math.sin(23.44*Ss)*Math.sin(h)+Math.sin(5.1*Ss)*Math.sin(r*.23)),f=h/(2*Math.PI)*24;return e.moon=kf(u,(a-f)*15*Ss,e.moon||new W),e.phase=l,e.night=Math.min(29,Math.floor(c)),e.illum=.5-.5*Math.cos(l*2*Math.PI),e.lst=a,e.decl=n,e}const $p=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],jp=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],_b=1.6110731556870734,bb=1.5;function Sb(o){return o=Math.max(-1,Math.min(1,o)),1e3*Math.max(0,1-Math.exp(-((_b-Math.acos(o))/bb)))}function Gc(o,t,e,n=[0,0,0]){const s=Sb(t.y),i=.2*e.turbidity*1e-17,a=Math.acos(Math.max(0,o.y)),r=1/(Math.cos(a)+.15*Math.pow(93.885-a*180/Math.PI,-1.253)),c=8400*r,l=1250*r,h=o.x*t.x+o.y*t.y+o.z*t.z,u=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),f=e.mieDirectionalG,d=f*f,m=1/(4*Math.PI)*((1-d)/Math.pow(1-2*f*h+d,1.5)),x=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let g=0;g<3;g++){const p=$p[g]*e.rayleigh,v=.434*i*jp[g]*e.mieCoefficient,w=Math.exp(-(p*c+v*l)),b=(p*u+v*m)/(p+v);let y=Math.pow(s*b*(1-w),1.5);y*=1+(Math.pow(s*b*w,.5)-1)*x;const S=.1*w,E=(y+S)*.04+[0,3e-4,75e-5][g];n[g]=Math.pow(E,1/2.4)}return n}function Eb(o,t,e=[0,0,0]){const n=Math.acos(Math.max(0,o.y)),s=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),i=.2*t.turbidity*1e-17;for(let a=0;a<3;a++){const r=$p[a]*t.rayleigh,c=.434*i*jp[a]*t.mieCoefficient;e[a]=Math.exp(-(r*8400*s+c*1250*s))}return e}const Ab=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,qp=`
uniform vec3 uSun;
uniform vec3 uMoon;
uniform float uPhase;
uniform float uIllum;
uniform float uTurbidity;
uniform float uRayleigh;
uniform float uMie;
uniform float uMieG;
uniform float uNight;
uniform float uLst;   // radians
uniform float uLat;
uniform vec3 uGalPole;
uniform vec3 uGalCentre;

const float pi = 3.141592653589793;
const vec3 totalRayleigh = vec3(5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5);
const vec3 MieConst = vec3(1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14);

float sunIntensity(float zc) {
  zc = clamp(zc, -1.0, 1.0);
  return 1000.0 * max(0.0, 1.0 - exp(-((1.6110731556870734 - acos(zc)) / 1.5)));
}
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash13(i), hash13(i + vec3(1,0,0)), f.x), mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x), mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y), f.z);
}

vec3 skyRadiance(vec3 dir, float disc) {
  vec3 sunDir = normalize(uSun);
  // below the horizon the sea is what you'd see; keep the horizon colour
  vec3 d = vec3(dir.x, max(dir.y, 0.0), dir.z);
  float sunE = sunIntensity(sunDir.y);
  vec3 betaR = totalRayleigh * uRayleigh;
  vec3 betaM = 0.434 * (0.2 * uTurbidity * 10E-18) * MieConst * uMie;
  float zenithAngle = acos(max(0.0, d.y));
  float inv = 1.0 / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));
  vec3 Fex = exp(-(betaR * 8.4E3 * inv + betaM * 1.25E3 * inv));
  float cosTheta = dot(normalize(d + vec3(0.0, 1e-4, 0.0)), sunDir);
  float rPhase = 0.05968310365946075 * (1.0 + pow(cosTheta * 0.5 + 0.5, 2.0));
  float g2 = uMieG * uMieG;
  float mPhase = 0.07957747154594767 * ((1.0 - g2) / pow(1.0 - 2.0 * uMieG * cosTheta + g2, 1.5));
  vec3 ratio = (betaR * rPhase + betaM * mPhase) / (betaR + betaM);
  vec3 Lin = pow(sunE * ratio * (1.0 - Fex), vec3(1.5));
  Lin *= mix(vec3(1.0), pow(sunE * ratio * Fex, vec3(0.5)), clamp(pow(1.0 - sunDir.y, 5.0), 0.0, 1.0));
  vec3 L0 = vec3(0.1) * Fex;
  float sundisk = smoothstep(0.99996, 0.99999, cosTheta) * disc;
  L0 += (sunE * 19000.0 * Fex) * sundisk;
  vec3 tex = (Lin + L0) * 0.04 + vec3(0.0, 0.0003, 0.00075);
  vec3 col = pow(tex, vec3(1.0 / 2.4));

  if (uNight > 0.001) {
    // world → equatorial, for the Milky Way
    float north = -d.z, up = d.y, east = d.x;
    float sd = north * cos(uLat) + up * sin(uLat);
    float cdcH = up * cos(uLat) - north * sin(uLat);
    float H = atan(-east, cdcH);
    float ra = uLst - H;
    float cd = sqrt(max(0.0, 1.0 - sd * sd));
    vec3 eq = vec3(cd * cos(ra), cd * sin(ra), sd);
    float b = dot(eq, uGalPole);
    float band = exp(-pow(b / 0.16, 2.0));
    float core = pow(max(dot(eq, uGalCentre), 0.0), 3.0);
    float dust = vnoise3(eq * 9.0) * 0.6 + vnoise3(eq * 23.0) * 0.4;
    float mw = band * (0.35 + 0.65 * dust) * (0.5 + 1.6 * core) * disc;
    mw *= 1.0 - smoothstep(0.32, 0.12, band * dust) * 0.5;
    vec3 night = vec3(0.0035, 0.0055, 0.011) + vec3(0.016, 0.017, 0.02) * mw;
    night += vec3(0.004, 0.005, 0.006) * pow(1.0 - d.y, 6.0);
    col += night * uNight;
  }
  return col;
}
`,Tb=`
${qp}
in vec3 vDir;
void main() {
  vec3 dir = normalize(vDir);
  vec3 col = skyRadiance(dir, 1.0);
  // --- moon ----------------------------------------------------------------
  vec3 md = normalize(uMoon);
  float mc = dot(dir, md);
  float moonR = 0.0095;
  float mDist = acos(clamp(mc, -1.0, 1.0));
  if (mDist < moonR * 1.2 && md.y > -0.05) {
    vec3 right = normalize(cross(md, vec3(0.0, 1.0, 0.0)));
    vec3 upv = cross(right, md);
    vec2 q = vec2(dot(dir - md, right), dot(dir - md, upv)) / moonR;
    float r2 = dot(q, q);
    if (r2 < 1.0) {
      float z = sqrt(1.0 - r2);
      vec3 sp = vec3(q, z);
      float ph = uPhase * 2.0 * pi;
      vec3 L = normalize(vec3(sin(ph), 0.0, -cos(ph)));
      float lit = smoothstep(-0.05, 0.08, dot(sp, L));
      float maria = 0.75 + 0.25 * vnoise3(vec3(q * 3.0, 1.0));
      vec3 moonC = vec3(1.0, 0.97, 0.9) * (0.04 + 1.6 * lit * maria) * (1.0 - 0.6 * (1.0 - uNight));
      col = mix(col, max(col, moonC), smoothstep(1.0, 0.92, r2));
    }
  }
  col += vec3(0.6, 0.65, 0.7) * pow(max(mc, 0.0), 900.0) * 0.08 * uIllum * uNight;
  gl_FragColor = vec4(col, 1.0);
}
`,Cb=`
${qp}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,Rb=`
in vec3 aStar; // ra (rad), dec (rad), magnitude
uniform float uLst;
uniform float uLat;
uniform float uPixel;
out float vBright;
out float vTw;
void main() {
  float H = uLst - aStar.x;
  float cd = cos(aStar.y);
  float east = -cd * sin(H);
  float north = sin(aStar.y) * cos(uLat) - cd * cos(H) * sin(uLat);
  float up = sin(aStar.y) * sin(uLat) + cd * cos(H) * cos(uLat);
  vec3 dir = vec3(east, up, -north);
  vBright = pow(2.512, -aStar.z) * smoothstep(-0.02, 0.12, up);
  vTw = aStar.x * 37.0 + aStar.y * 91.0;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(dir * 100.0, 1.0);
  gl_Position = p.xyww;
  gl_PointSize = clamp(uPixel * (1.6 + 2.2 * sqrt(vBright)), 1.0, 9.0);
}
`,Lb=`
uniform float uNight;
uniform float uTime;
in float vBright;
in float vTw;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  float tw = 0.75 + 0.25 * sin(uTime * 3.1 + vTw) * sin(uTime * 1.7 + vTw * 0.37);
  float a = exp(-d * 4.0) * vBright * uNight * tw;
  gl_FragColor = vec4(vec3(0.9, 0.94, 1.0) * a * 1.8, 1.0);
}
`;class Pb{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=vb,e=(l,h)=>{const u=l/24*2*Math.PI,f=h*Ss;return new W(Math.cos(f)*Math.cos(u),Math.cos(f)*Math.sin(u),Math.sin(f))};this.uniforms={uSun:{value:new W(0,1,0)},uMoon:{value:new W(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:Wo},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new ge(new Hl(1,5),new _e({vertexShader:Ab,fragmentShader:Tb,uniforms:this.uniforms,side:pn,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const s=wb(4242),i=xb.map(([l,h,u])=>[l/24*2*Math.PI,h*Ss,u]);for(let l=0;l<2600;l++){const h=s()*2-1;i.push([s()*2*Math.PI,Math.asin(h),3.4+Math.pow(s(),.55)*2.8])}const a=new Float32Array(i.length*3);i.forEach((l,h)=>a.set(l,h*3));const r=new Je;r.setAttribute("aStar",new de(a,3)),r.setAttribute("position",new de(new Float32Array(i.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new jw(r,new _e({vertexShader:Rb,fragmentShader:Lb,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:el})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new Te,this.group.add(n,this.stars),this.mapRT=new cs(256,128,{type:ks,depthBuffer:!1}),this.mapRT.texture.wrapS=Mr,this.mapScene=new qr;const c=new ge(Vl(),new _e({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Cb,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));c.frustumCulled=!1,this.mapScene.add(c),this.mapCam=new $r(-1,1,1,-1,0,1),this.astro={},this._v=new W}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,s){const i=Mb(t,e,this.astro),a=i.sun,r=this.uniforms;r.uSun.value.copy(a),r.uMoon.value.copy(i.moon),r.uPhase.value=i.phase,r.uIllum.value=i.illum,r.uLst.value=i.lst/24*2*Math.PI;const c=nn.smoothstep(-a.y,-.02,.2);r.uNight.value=c,this.starUniforms.uNight.value=c,this.starUniforms.uTime.value=n;const l=this.params,h=this._v,u=Gc(h.set(0,1,0),a,l),f=[0,0,0];for(let S=0;S<8;S++){const E=S/8*Math.PI*2,T=Gc(h.set(Math.cos(E),.08,Math.sin(E)).normalize(),a,l);for(let _=0;_<3;_++)f[_]+=T[_]/8}const d=Gc(h.set(a.x,.05,a.z).normalize(),a,l),m=Eb(a,l),x=nn.smoothstep(a.y,-.04,.06),g=3.2;s.sunColor.setRGB(m[0]*g*x,m[1]*g*x,m[2]*g*x);const p=[.0035,.005,.011],w=nn.smoothstep(i.moon.y,-.02,.1)*i.illum*c;s.skyColor.setRGB(u[0]*.55+f[0]*.45+p[0]+.012*w,u[1]*.55+f[1]*.45+p[1]+.016*w,u[2]*.55+f[2]*.45+p[2]+.024*w);const b=s.skyColor.r*.2126+s.skyColor.g*.7152+s.skyColor.b*.0722;s.skyColor.lerp(new Ht(b,b,b),.35),s.zenith.setRGB(u[0],u[1],u[2]),s.horizon.setRGB(f[0]+p[0],f[1]+p[1],f[2]+p[2]),s.sunHorizon.setRGB(d[0],d[1],d[2]);const y=.11;return s.groundColor.setRGB((s.sunColor.r*Math.max(0,a.y)+s.skyColor.r)*y*1.1,(s.sunColor.g*Math.max(0,a.y)+s.skyColor.g)*y,(s.sunColor.b*Math.max(0,a.y)+s.skyColor.b)*y*.8),s.moonColor.setRGB(.05*w,.06*w,.085*w),s.moonDir.copy(i.moon),s.sunDir.copy(a),s.night=c,i}}const Zo=Math.PI*2,Vc=.4,kb=.18,Df=(o,t,e,n)=>e>0?o+(t-o)*(1-Math.exp(-e/n)):t,Db=(o,t,e)=>(o+t+Math.sqrt((o-t)*(o-t)+e*e))/2,zb=o=>o<.5?4*o*o*o:1-Math.pow(-2*o+2,3)/2,sr=o=>((o+Math.PI)%Zo+Zo)%Zo-Math.PI,Ib=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)},El=4e4;function fi(o){return .6+.52*Ib(Math.log(40),Math.log(4500),Math.log(Math.max(1,o)))}class Fb{constructor(t,e,n){this.camera=t,this.dom=e,this.world=n,this.minDistance=h0,this.maxDistance=nh,this._ray=new Xw,this._v=new W,this.home=this.homeView(),this.reach(this.home.distance);const s=this.home;this.state={target:s.target.clone(),distance:s.distance,yaw:s.yaw,pitch:s.pitch,lift:0},this.goal={target:s.target.clone(),distance:s.distance,yaw:s.yaw,pitch:s.pitch,lift:0},this.flight=null,this.floor=0,this.groundM=0,this.pinned=!0,this._lastXZ=new Bt(s.target.x,s.target.z),this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this.bind()}homeView(t={x0:16,y0:72,x1:innerWidth-16,y1:innerHeight-120}){const e=this.world.chainShape();return this.fit({points:e.hull,along:[e.from,e.to],yaw:0,box:t,reach:El})}reach(t){this.maxDistance=Math.max(nh,t*1.15)}bind(){const t=this.dom,e=new Map;let n=null,s=null,i=null;t.addEventListener("contextmenu",r=>r.preventDefault()),t.addEventListener("pointerdown",r=>{this.enabled&&(t.setPointerCapture(r.pointerId),e.set(r.pointerId,{x:r.clientX,y:r.clientY}),e.size===1?(n=r.button===2||r.shiftKey||r.ctrlKey||r.metaKey||r.altKey?"orbit":"pan",s={x:r.clientX,y:r.clientY}):e.size===2&&(n="pinch",i=this.pinchState(e)))}),t.addEventListener("pointermove",r=>{if(e.has(r.pointerId)){if(e.set(r.pointerId,{x:r.clientX,y:r.clientY}),n==="orbit"&&s){const c=r.clientX-s.x,l=r.clientY-s.y;this.goal.yaw-=c*.005,this.goal.pitch=nn.clamp(this.goal.pitch+l*.004,.06,1.52),s={x:r.clientX,y:r.clientY},this.touch()}else if(n==="pan"&&s){const c=r.clientX-s.x,l=r.clientY-s.y;(c||l)&&(this.panBy(c,l),this.touch()),s={x:r.clientX,y:r.clientY}}else if(n==="pinch"&&e.size===2){const c=this.pinchState(e),l=i.dist/Math.max(20,c.dist);this.zoomAt(c.cx,c.cy,l),this.panBy(c.cx-i.cx,c.cy-i.cy),this.goal.yaw-=sr(c.angle-i.angle),i=c,this.touch()}}});const a=r=>{if(e.delete(r.pointerId),e.size===0)n=null;else if(e.size===1){const[c]=e.values();n="pan",s={...c}}};t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a),t.addEventListener("wheel",r=>{if(!this.enabled)return;r.preventDefault();const c=r.deltaMode===1?r.deltaY*30:r.deltaY,l=Math.exp(Math.sign(c)*Math.min(Math.abs(c),150)*.0022);this.zoomAt(r.clientX,r.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",r=>{const c=this.pickGround(r.clientX,r.clientY);if(c){const l=Math.max(this.minDistance,this.goal.distance*.35);this.flyTo({target:c,distance:l,pitch:this.goal.pitch+fi(l)-fi(this.goal.distance)},1.8)}}),addEventListener("keydown",r=>{var f,d;if(!this.enabled||(d=(f=r.target).closest)!=null&&d.call(f,"input, textarea"))return;const c=this.goal.distance*.08,l={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[r.code];if(l&&!r.altKey){const m=Math.sin(this.goal.yaw),x=Math.cos(this.goal.yaw);this.goal.target.x+=(l[0]*x+l[1]*m)*c,this.goal.target.z+=(-l[0]*m+l[1]*x)*c,this.touch()}r.code==="KeyQ"&&(this.goal.yaw+=.12),r.code==="KeyE"&&(this.goal.yaw-=.12);const h=innerWidth/2,u=innerHeight/2;(r.code==="Equal"||r.code==="NumpadAdd")&&this.zoomAt(h,u,.8),(r.code==="Minus"||r.code==="NumpadSubtract")&&this.zoomAt(h,u,1.25)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,s=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,i=Math.sin(this.goal.yaw),a=Math.cos(this.goal.yaw),r=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*a-e*i*r)*s,this.goal.target.z+=(t*i-e*a*r)*s}zoomAt(t,e,n){const s=this.pickGround(t,e),i=this.goal.distance,a=nn.clamp(i*n,this.minDistance,this.maxDistance);if(s){const r=1-a/i;this.goal.target.x+=(s.x-this.goal.target.x)*r,this.goal.target.z+=(s.z-this.goal.target.z)*r}this.goal.pitch=nn.clamp(this.goal.pitch+fi(a)-fi(i),.06,1.52),this.goal.distance=a}pickGround(t,e){const n=this.dom.getBoundingClientRect(),s=new Bt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(s,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e){const n=this.world,s=n.maxY+.05;if(e.y>=0&&t.y>s)return null;const i=e.y<0?t.y/-e.y:4e5;let a=t.y>s&&e.y<0?(t.y-s)/-e.y:0;const r=Math.min(i,4e5),c=this._v;let l=a;for(let h=0;h<700&&a<=r+.001;h++){c.copy(t).addScaledVector(e,a);const u=c.y-n.heightAt(c.x,c.z);if(u<0){let f=l,d=a;for(let m=0;m<24;m++){const x=(f+d)/2;c.copy(t).addScaledVector(e,x),c.y-n.heightAt(c.x,c.z)<0?d=x:f=x}return c.clone()}l=a,a+=Math.max(.02,u*.45,a*.0015)}return i<4e5?t.clone().addScaledVector(e,i).setY(0):null}fit({rect:t,points:e,along:n,distance:s,yaw:i=this.goal.yaw,tilt:a=0,pitch:r,box:c,pad:l=1.06,reach:h=this.maxDistance}){const u=this._fitCam||(this._fitCam=new Rn),f=innerWidth,d=innerHeight;u.fov=this.camera.fov,u.aspect=f/Math.max(1,d),u.near=.1,u.far=1e6,u.updateProjectionMatrix();const m=c||{x0:0,y0:0,x1:f,y1:d},x=Math.max(60,m.x1-m.x0),g=Math.max(60,m.y1-m.y0),p=Math.tan(u.fov*Math.PI/360),v=e||[[t.x0,t.z0],[t.x1,t.z0],[t.x0,t.z1],[t.x1,t.z1]];let w=1/0,b=1/0,y=-1/0,S=-1/0;for(const[I,O]of v)w=Math.min(w,I),y=Math.max(y,I),b=Math.min(b,O),S=Math.max(S,O);let E=(w+y)/2,T=(b+S)/2;const _=s!==void 0;let M=_?s:Math.max(y-w,S-b)/(2*p)*(d/g),A=0;const R=Math.atan2(g,x),k=(I,O)=>Math.atan2(Math.sin(I)/Math.max(.35,Math.sin(O)),Math.cos(I));if(n){const[[I,O],[U,V]]=n;i=k(R,fi(M)+a)-Math.atan2(V-O,U-I)}const C=this._v,z=(I,O,U)=>(C.set(I,O,U).project(u),[(C.x+1)/2*f,(1-C.y)/2*d]);for(let I=0,O=n?14:8;I<O;I++){M=nn.clamp(M,this.minDistance,h),A=nn.clamp(r??fi(M)+a,.06,1.52);const U=Math.cos(A),V=Math.cos(i),B=Math.sin(i),q=_?this.world.heightAt(E,T):0;u.position.set(E+M*U*B,q+M*Math.sin(A),T+M*U*V),u.lookAt(E,q,T),u.updateMatrixWorld();let it=1/0,Y=1/0,nt=-1/0,rt=-1/0;for(const[Rt,wt]of v){const[kt,$]=z(Rt,_?this.world.heightAt(Rt,wt):q,wt);it=Math.min(it,kt),nt=Math.max(nt,kt),Y=Math.min(Y,$),rt=Math.max(rt,$)}if(n){const[[Rt,wt],[kt,$]]=n,[le,Tt]=z(Rt,q,wt),[Dt,Z]=z(kt,q,$);i+=sr(k(R,A)-k(Math.atan2(Z-Tt,Dt-le),A))}_||(M*=nn.clamp(Math.max((nt-it)*l/x,(rt-Y)*l/g),.3,3));const ut=2*M*p/d,xt=((it+nt)/2-(m.x0+m.x1)/2)*ut,At=((Y+rt)/2-(m.y0+m.y1)/2)*ut/Math.max(.35,Math.sin(A));E+=xt*V+At*B,T+=-xt*B+At*V}return M=nn.clamp(M,this.minDistance,h),{target:new W(E,this.world.heightAt(E,T),T),distance:M,yaw:n?sr(i):i,pitch:A}}groundAt(t,e){return Math.max(0,this.world.metresAt(t,e))}smoothGround(t,e,n){const s=kb*n;let i=2*this.groundAt(t,e),a=2;for(let r=0;r<6;r++){const c=r/6*Zo,l=c+Zo/12;i+=this.groundAt(t+Math.cos(c)*s*.5,e+Math.sin(c)*s*.5),i+=this.groundAt(t+Math.cos(l)*s,e+Math.sin(l)*s),a+=2}return i/a}pin(){const t=this.goal.target;this.groundM=this.groundAt(t.x,t.z),this.pinned=!0,this._lastXZ.set(t.x,t.z);const e=this.groundM*this.world.uniforms.uVert.value;t.y=e,this.state.target.y=e}flyTo(t,e=3,n={}){const s={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift,groundM:this.groundM},i={target:t.target?t.target.clone():s.target.clone(),distance:nn.clamp(t.distance??s.distance,this.minDistance,this.maxDistance),yaw:t.yaw??s.yaw,pitch:nn.clamp(t.pitch??s.pitch,.06,1.52),lift:t.lift??0};i.yaw=s.yaw+sr(i.yaw-s.yaw);const a=Math.hypot(s.target.x-i.target.x,s.target.z-i.target.z),r=n.hop??Math.max(0,a*.9-Math.max(s.distance,i.distance)*.6);this.flight={from:s,dest:i,t:0,duration:e,hop:r,onDone:n.onDone,ready:n.ready,held:0}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,this.pin(),(e=t.onDone)==null||e.call(t),this.apply()}jump({x:t,z:e,distance:n,yaw:s,pitch:i}){this.flight=null;for(const a of[this.goal,this.state])t!==void 0&&a.target.set(t,this.world.heightAt(t,e),e),n!==void 0&&(a.distance=n),s!==void 0&&(a.yaw=s),i!==void 0&&(a.pitch=i),a.lift=0;this.pin(),this.apply()}update(t){var r;const e=this.goal;if(this.flight){const c=this.flight;let l=t/c.duration;c.ready&&c.t>.8&&c.held<6&&!c.ready()&&(c.held+=t,l*=.08),c.t=Math.min(1,c.t+l);const h=zb(c.t);e.target.lerpVectors(c.from.target,c.dest.target,h);const u=Math.log(c.from.distance)*(1-h)+Math.log(c.dest.distance)*h;e.distance=Math.exp(u)+c.hop*Math.sin(Math.PI*h),e.yaw=c.from.yaw+(c.dest.yaw-c.from.yaw)*h,e.pitch=c.from.pitch+(c.dest.pitch-c.from.pitch)*h+.2*Math.sin(Math.PI*h)*Math.min(1,c.hop/300),e.pitch=Math.min(1.52,e.pitch),e.lift=c.from.lift+(c.dest.lift-c.from.lift)*h,this.groundM=c.from.groundM+(this.groundAt(c.dest.target.x,c.dest.target.z)-c.from.groundM)*h,c.t>=1&&(this.flight=null,this.pin(),(r=c.onDone)==null||r.call(c))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);const n=this.world.bounds,s=150+e.distance*.3;e.target.x=nn.clamp(e.target.x,n.x0-s,n.x1+s),e.target.z=nn.clamp(e.target.z,n.z0-s,n.z1+s),this.flight||(Math.abs(e.target.x-this._lastXZ.x)+Math.abs(e.target.z-this._lastXZ.y)>1e-7&&(this.pinned=!1),this._lastXZ.set(e.target.x,e.target.z),this.pinned||(this.groundM=Df(this.groundM,this.smoothGround(e.target.x,e.target.z,e.distance),t,Vc))),e.target.y=this.groundM*this.world.uniforms.uVert.value;const i=this.state,a=this.flight?1:1-Math.exp(-t*7);i.target.lerp(e.target,a),i.distance=Math.exp(Math.log(i.distance)+(Math.log(e.distance)-Math.log(i.distance))*a),i.yaw+=(e.yaw-i.yaw)*a,i.pitch+=(e.pitch-i.pitch)*a,i.lift+=(e.lift-i.lift)*a,this.apply(t)}groundAhead(t,e,n){const s=this.world;let i=s.heightAt(t,e);const a=this._prevXZ;if(a&&n>0){const r=(t-a.x)/n,c=(e-a.y)/n,l=Math.hypot(r,c),h=Math.min(20,l*.3);h>.005&&(i=Math.max(i,s.heightAt(t+r/l*h,e+c/l*h)))}return this._prevXZ=(this._prevXZ||new Bt).set(t,e),i}apply(t=0){const e=this.state,n=this.camera,s=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*s*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*s*Math.cos(e.yaw));const i=.12+e.distance*.03,a=this.groundAhead(n.position.x,n.position.z,t),r=Math.max(0,a+i-n.position.y);this.floor=Df(this.floor,r,t,r>this.floor?Vc/3:Vc*2),n.position.y+=this.floor;const c=this.world.heightAt(n.position.x,n.position.z),l=Math.min(.04,i*.3);n.position.y=Db(n.position.y,c+l,l),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const h=n.position.y-c;n.near=nn.clamp(Math.min(h,e.distance)*.12,.02,300),n.far=nn.clamp(e.distance*30+h*60,8e3,3e5),n.updateProjectionMatrix(),n.updateMatrixWorld()}}const Ub=1.5,Nb=`
${Ne}
${Ye}
${Fs}
in vec4 aSeg;            // the segment's ends: ax, az, bx, bz
uniform vec2 uResolution;  // drawing buffer, px
uniform float uWidth;      // px
uniform vec3 uCamPos;
out float vFade;

vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += 0.015 + distance(uCamPos, p) * 0.0022;
  return p;
}

void main() {
  vec3 A = draped(aSeg.xy);
  vec3 B = draped(aSeg.zw);
  mat4 pv = projectionMatrix * viewMatrix;
  vec4 ca = pv * vec4(A, 1.0);
  vec4 cb = pv * vec4(B, 1.0);
  // a segment through the near plane is cut where it crosses it
  const float W0 = 1e-3;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  if (ca.w < W0) ca = mix(ca, cb, (W0 - ca.w) / (cb.w - ca.w));
  if (cb.w < W0) cb = mix(cb, ca, (W0 - cb.w) / (ca.w - cb.w));
  vec2 sa = ca.xy / ca.w;
  vec2 sb = cb.xy / cb.w;
  vec2 d = (sb - sa) * uResolution;
  float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  vec4 c = atB ? cb : ca;
  // half the width either side, and as far again past each end so the joins close
  vec2 off = (nrm * position.y + dir * (atB ? 0.5 : -0.5)) * uWidth / uResolution;
  c.xy += off * c.w;
  gl_Position = c;
  vFade = 1.0;
}
`,Ob=`
uniform vec3 uColor;
uniform float uOpacity;
in float vFade;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vFade);
}
`;function Bb(o){return o?o.type==="Polygon"?o.coordinates:o.type==="MultiPolygon"?o.coordinates.flat():o.type==="LineString"?[o.coordinates]:o.type==="MultiLineString"?o.coordinates:[]:[]}function Wb(o,t){var i;const e=new Map,n=new Set,s=a=>Math.round(a*1e6);for(const a of(o==null?void 0:o.features)||[]){const r=lr((i=a.properties)==null?void 0:i.island)||"other";let c=e.get(r);c||e.set(r,c=[]);for(const l of Bb(a.geometry))for(let h=0;h+1<l.length;h++){const u=l[h],f=l[h+1],d=`${s(u[0])},${s(u[1])}`,m=`${s(f[0])},${s(f[1])}`;if(d===m)continue;const x=d<m?`${d}|${m}`:`${m}|${d}`;if(n.has(x))continue;n.add(x);const[g,p]=t.toWorld(u),[v,w]=t.toWorld(f),b=Math.max(1,Math.ceil(Math.hypot(v-g,w-p)/Ub));for(let y=0;y<b;y++){const S=y/b,E=(y+1)/b;c.push(g+(v-g)*S,p+(w-p)*S,g+(v-g)*E,p+(w-p)*E)}}}return e}class zf{constructor(t,e,n,{color:s,width:i,order:a}){this.group=new Te,this.uniforms={...n,uResolution:{value:new Bt(1,1)},uWidth:{value:i},uCamPos:{value:new W},uColor:{value:new Ht(...s)},uOpacity:{value:1}},this.material=new _e({vertexShader:Nb,fragmentShader:Ob,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});const r=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);this.count=0;for(const[,c]of Wb(t,e)){if(!c.length)continue;const l=new yo;l.setAttribute("position",new de(r,3)),l.setIndex([0,2,1,1,2,3]);const h=new Float32Array(c);l.setAttribute("aSeg",new he(h,4)),l.instanceCount=h.length/4,this.count+=l.instanceCount;let u=1/0,f=-1/0,d=1/0,m=-1/0;for(let p=0;p<h.length;p+=2)u=Math.min(u,h[p]),f=Math.max(f,h[p]),d=Math.min(d,h[p+1]),m=Math.max(m,h[p+1]);const x=new W((u+f)/2,60,(d+m)/2);l.boundingSphere=new Js(x,Math.hypot(f-u,m-d,300)/2+10);const g=new ge(l,this.material);g.renderOrder=a,this.group.add(g)}}update(t,e,n){this.uniforms.uResolution.value.copy(e),this.uniforms.uCamPos.value.copy(t.position),this.uniforms.uOpacity.value=n,this.group.visible=n>.01&&this.count>0}}class Hb{constructor(t,e){this.group=new Te,this.moku=new zf(t.moku,t.proj,e,{color:[1.5,1.08,.52],width:2.2,order:3}),this.ahupuaa=new zf(t.ahupuaa,t.proj,e,{color:[1.25,1.2,1.06],width:1.3,order:2}),this.group.add(this.ahupuaa.group,this.moku.group),this.visible=!0,this._res=new Bt}update(t,e,n,s=1){e.getDrawingBufferSize(this._res);const i=e.getPixelRatio(),a=this.visible?1:0,r=(c,l,h)=>{const u=Math.max(0,Math.min(1,(h-c)/(l-c)));return u*u*(3-2*u)};this.moku.uniforms.uWidth.value=(1.3+1.1*(1-r(800,4e3,n)))*i,this.ahupuaa.uniforms.uWidth.value=1.25*i,this.moku.uniforms.uColor.value.setRGB(1.5*s,1.08*s,.52*s),this.ahupuaa.uniforms.uColor.value.setRGB(1.25*s,1.2*s,1.06*s),this.moku.update(t,this._res,a*(.55+.4*(1-r(1500,6e3,n)))),this.ahupuaa.update(t,this._res,a*.75*(1-r(220,650,n)))}}const Gb=4,If=[300,1e3],Ff=[.4,.7],Vb=9,Uf={voyage:[1.38,1.18,.86],fleet:[1.6,.9,.52],ship:[1,1.1,1.26],trade:[1.15,1.1,.96],schematic:[1.25,1.18,1.02]},Nf={journal:{width:2,opacity:.92,pulse:1},narrative:{width:1.7,opacity:.82,pulse:.9},schematic:{width:1.4,opacity:.62,pulse:.45}},$b={day:0,month:0,year:0,decade:5,generation:12,century:50},$c=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)},jb=`
${Ne}
${Ye}
${Fs}
in vec4 aSeg;    // the segment's ends: ax, az, bx, bz
in vec4 aInfo;   // distance along the route at A and at B (world units), dashed (0/1), arrowhead at B (0/1)
uniform vec2 uResolution;  // drawing buffer, px
uniform float uWidth;      // px
uniform float uHead;       // arrowhead length, px
uniform vec3 uCamPos;
out float vS;
out float vDash;
out float vHead;

vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += 0.02 + distance(uCamPos, p) * 0.0024;
  return p;
}

void main() {
  vec3 A = draped(aSeg.xy);
  vec3 B = draped(aSeg.zw);
  mat4 pv = projectionMatrix * viewMatrix;
  vec4 ca = pv * vec4(A, 1.0);
  vec4 cb = pv * vec4(B, 1.0);
  const float W0 = 1e-3;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  if (ca.w < W0) ca = mix(ca, cb, (W0 - ca.w) / (cb.w - ca.w));
  if (cb.w < W0) cb = mix(cb, ca, (W0 - cb.w) / (ca.w - cb.w));
  vec2 sa = ca.xy / ca.w;
  vec2 sb = cb.xy / cb.w;
  vec2 d = (sb - sa) * uResolution;
  float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  vDash = aInfo.z;
  if (aInfo.w > 0.5) {
    // a soft arrowhead at B, pointing along A -> B: the tip a little past B,
    // the base corners behind it (the quad's two B corners meet at the tip)
    vec4 c = cb;
    vec2 px = atB ? dir * uHead * 0.3 : -dir * uHead * 0.7 + nrm * position.y * uHead * 0.42;
    c.xy += px * 2.0 / uResolution * c.w;
    gl_Position = c;
    vS = aInfo.y;
    vHead = atB ? 1.0 : 0.0;
    return;
  }
  vec4 c = atB ? cb : ca;
  // half the width either side, and as far again past each end so the joins close
  vec2 off = (nrm * position.y + dir * (atB ? 0.5 : -0.5)) * uWidth / uResolution;
  c.xy += off * c.w;
  gl_Position = c;
  vS = atB ? aInfo.y : aInfo.x;
  vHead = -1.0;
}
`,qb=`
uniform vec3 uColor;
uniform float uOpacity;
uniform float uDashLen;   // world units per dash and gap
uniform float uMarch;     // how far the dashes have marched, world units
uniform float uPulse;     // where the brightening is, world units along the route
uniform float uPulseLen;  // its reach either side, world units
uniform float uPulseK;
in float vS;
in float vDash;
in float vHead;
void main() {
  float a = uOpacity;
  if (vHead >= 0.0) {
    a *= mix(0.2, 1.0, vHead);
  } else if (vDash > 0.5) {
    float u = (vS - uMarch) / uDashLen;
    float ph = fract(u);
    float w = max(fwidth(u) * 1.2, 1e-3);
    a *= smoothstep(0.0, w, ph) * (1.0 - smoothstep(0.55 - w, 0.55, ph)) * 0.85;
  }
  float g = uPulseK * exp(-pow((vS - uPulse) / max(uPulseLen, 1e-3), 2.0));
  gl_FragColor = vec4(uColor * (1.0 + 0.7 * g), min(1.0, a * (1.0 + 0.6 * g)));
}
`;function Xb(o){const t=o.when||{},e=(a,r)=>{const c=String(a??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!c)return null;const l=Number(c[1]);return c[2]?l+(Number(c[2])-1+(r?1:0))/12:l+(r?1:0)};let n=e(t.from,!1),s=e(t.to??t.from,!0);if(n===null&&s===null)return null;n===null&&(n=s-1),s===null&&(s=n+1);const i=$b[t.precision]??0;return i&&s-n<=1.01&&(n-=i,s+=i),[n,s]}async function Yb(o,t=console.warn){const e=o!=null&&o.abs?o.abs("routes.json"):new URL("routes.json",new URL((o==null?void 0:o.base)||"./data/",location.href)).href;try{const n=await fetch(e);if(!n.ok)throw new Error(`HTTP ${n.status}`);const s=await n.json();return Array.isArray(s)?s:Array.isArray(s==null?void 0:s.routes)?s.routes:[]}catch(n){return t(`${e}: ${n.message} (no routes)`),[]}}class Kb{constructor(t,e,n){this.route=t,this.span=Xb(t);const s=Nf[t.pointPrecision]?t.pointPrecision:"schematic";this.style=Nf[s],this.ret=t.direction==="return";const i=s==="schematic",a=new Set(t.schematicSegments||[]),r=(t.points||[]).map(w=>e.toWorld(w)),c=[],l=[];let h=0;for(let w=0;w+1<r.length;w++){const[b,y]=r[w],[S,E]=r[w+1],T=Math.hypot(S-b,E-y),_=Math.max(1,Math.ceil(T/Gb)),M=i||a.has(w)?1:0;for(let A=0;A<_;A++){const R=A/_,k=(A+1)/_;c.push(b+(S-b)*R,y+(E-y)*R,b+(S-b)*k,y+(E-y)*k),l.push(h+T*R,h+T*k,M,0)}h+=T}this.total=h;const u=(w,b,y)=>{c.push(w[0],w[1],b[0],b[1]),l.push(y,y,0,1)};r.length>=2&&(u(r.at(-2),r.at(-1),h),this.ret&&u(r[1],r[0],0));const f=new yo;f.setAttribute("position",new de(new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),3)),f.setIndex([0,2,1,1,2,3]);const d=new Float32Array(c);f.setAttribute("aSeg",new he(d,4)),f.setAttribute("aInfo",new he(new Float32Array(l),4)),f.instanceCount=d.length/4;let m=1/0,x=-1/0,g=1/0,p=-1/0;for(const[w,b]of r)m=Math.min(m,w),x=Math.max(x,w),g=Math.min(g,b),p=Math.max(p,b);f.boundingSphere=new Js(new W((m+x)/2,60,(g+p)/2),Math.hypot(x-m,p-g,300)/2+20),this.geometry=f;const v=Uf[t.kind]||Uf.schematic;this.colour=v,this.uniforms={...n,uResolution:{value:new Bt(1,1)},uWidth:{value:this.style.width},uHead:{value:9},uCamPos:{value:new W},uColor:{value:new Ht(...v)},uOpacity:{value:0},uDashLen:{value:30},uMarch:{value:0},uPulse:{value:-1e6},uPulseLen:{value:60},uPulseK:{value:this.style.pulse}},this.material=new _e({vertexShader:jb,fragmentShader:qb,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),this.mesh=new ge(f,this.material),this.mesh.renderOrder=4,this.mesh.visible=!1,this.k=0,this.w=1,this.phase=Zb(t.id||"")%1e3/1e3}dispose(){this.geometry.dispose(),this.material.dispose()}}function Zb(o){let t=2166136261;for(let e=0;e<o.length;e++)t=Math.imul(t^o.charCodeAt(e),16777619);return t>>>0}class Jb{constructor({routes:t=[],proj:e,uniforms:n,camera:s,renderer:i,eras:a=[]}){this.proj=e,this.shared=n,this.camera=s,this.renderer=i,this.eras=[...a].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),this.group=new Te,this.group.name="routes",this.lines=[],this._res=new Bt,this._last=null,this.setRoutes(t)}setRoutes(t){for(const e of this.lines)this.group.remove(e.mesh),e.dispose();this.lines=[];for(const e of t||[]){if(!Array.isArray(e.points)||e.points.length<2)continue;const n=new Kb(e,this.proj,this.shared);n.span&&(this.lines.push(n),this.group.add(n.mesh))}}windowAt(t){const e=this.eras;if(e.length<2)return[t-10,t+10];const n=i=>{if(i<=0)return e[0].year+i*(e[1].year-e[0].year);const a=e.length-1;if(i>=a)return e[a].year+(i-a)*(e[a].year-e[a-1].year);const r=Math.floor(i);return e[r].year+(i-r)*(e[r+1].year-e[r].year)};let s=0;if(t>=e.at(-1).year)s=e.length-1+(t-e.at(-1).year)/Math.max(1e-6,e.at(-1).year-e.at(-2).year);else if(t>e[0].year){for(let i=0;i+1<e.length;i++)if(t<=e[i+1].year){s=i+(t-e[i].year)/Math.max(1e-6,e[i+1].year-e[i].year);break}}return[n(s-.5),n(s+.5)]}visibleRoutes(){return this.lines.filter(t=>t.k>.5&&t.mesh.visible).map(t=>t.route)}update(t,e,{window:n,light:s=1,fill:i=0,section:a=null,all:r=!1}={}){const c=performance.now()/1e3,l=this._last===null?1:Math.max(0,Math.min(.1,c-this._last));this._last=c,this.apply(t,e,{win:n,light:s,fill:i,section:a,all:r},c,1-Math.exp(-l*4))}settle(t,e,{window:n,light:s=1,fill:i=0,section:a=null,all:r=!1}={}){this.apply(t,e,{win:n,light:s,fill:i,section:a,all:r},performance.now()/1e3,1)}apply(t,e,{win:n,light:s,fill:i,section:a,all:r},c,l){var g,p;const[h,u]=n||this.windowAt(t);this.renderer.getDrawingBufferSize(this._res);const f=this.renderer.getPixelRatio(),d=$c(If[0],If[1],e),m=1-$c(Ff[0],Ff[1],i),x=1-$c(800,4e3,e);for(const v of this.lines){const[w,b]=v.span,y=!!a&&(((g=a.routes)==null?void 0:g.has(v.route.id))||((p=a.events)==null?void 0:p.has(v.route.event))),S=y||r&&b>=h&&w<=u?1:0;v.k+=(S-v.k)*l,Math.abs(S-v.k)<.003&&(v.k=S);const E=y&&!r?a.k??1:1;v.w+=(E-v.w)*l,Math.abs(E-v.w)<.003&&(v.w=E);const T=t>=w&&t<=b?1:.55,_=y&&!!a.focus,M=v.style.opacity*v.k*v.w*d*(_?1:m)*T;if(v.mesh.visible=M>.01,!v.mesh.visible)continue;const A=v.uniforms;A.uResolution.value.copy(this._res),A.uCamPos.value.copy(this.camera.position),A.uWidth.value=(v.style.width+.6*x)*f,A.uHead.value=(8+3*x)*f,A.uOpacity.value=M,A.uColor.value.setRGB(v.colour[0]*s,v.colour[1]*s,v.colour[2]*s),A.uPulseK.value=v.style.pulse*v.w,A.uDashLen.value=e*.016,A.uPulseLen.value=Math.min(v.total*.12,e*.035);const R=(c/Vb+v.phase)%1;A.uPulse.value=v.ret?(R<.5?R*2:2-R*2)*v.total:R*v.total,A.uMarch.value=v.ret?0:c*e*.012%(e*.016)}}dispose(){for(const t of this.lines)t.dispose();this.lines=[],this.group.clear()}}const ir=o=>String(o||"").normalize("NFD").replace(/[̀-ͯʻʼ'‘’]/g,"").toLowerCase();function Xp(o,t,e,n,s,i){const a=t/(n.x1-n.x0),r=e/(n.z1-n.z0),c=[];let l=1/0,h=-1/0;for(const x of s)for(let g=0;g+1<x.length;g++){const p=(x[g][0]-n.x0)*a,v=(x[g][1]-n.z0)*r,w=(x[g+1][0]-n.x0)*a,b=(x[g+1][1]-n.z0)*r;v!==b&&(c.push(v<b?[v,p,b,w]:[b,w,v,p]),l=Math.min(l,v,b),h=Math.max(h,v,b))}if(!c.length)return;c.sort((x,g)=>x[0]-g[0]);const u=[],f=Math.max(0,Math.floor(l)),d=Math.min(e-1,Math.ceil(h));let m=0;for(let x=f;x<=d;x++){const g=x+.5;for(u.length=0;m<c.length&&c[m][2]<=g&&c[m][0]<=g;)m++;for(let v=m;v<c.length;v++){const w=c[v];if(w[0]>g)break;w[2]<=g||u.push(w[1]+(g-w[0])/(w[2]-w[0])*(w[3]-w[1]))}u.sort((v,w)=>v-w);const p=x*t;for(let v=0;v+1<u.length;v+=2){const w=Math.max(0,Math.ceil(u[v]-.5)),b=Math.min(t-1,Math.floor(u[v+1]-.5));for(let y=w;y<=b;y++)o[p+y]=i}}}class Qb{constructor(t,e,n,s=console.warn){var u,f;this.data=t,this.rect=e,this.uniforms=n,this.polities=new Map((t.polities.polities||[]).map(d=>[d.id,d]));const i=(((u=t.moku)==null?void 0:u.features)||[]).slice(0,255);(((f=t.moku)==null?void 0:f.features)||[]).length>255&&s("more than 255 moku: the overlay shows the first 255");const a=e.x1-e.x0,r=e.z1-e.z0,c=Math.min(4096,Math.ceil(Math.max(a,r)/1.5));this.W=Math.round(a>=r?c:c*a/r),this.H=Math.round(a>=r?c*r/a:c),this.grid=new Uint8Array(this.W*this.H),this.mokus=[null],i.forEach((d,m)=>{const x=d.properties||{},g=x.name??x.moku??"",p=x.islandId||lr(x.island),v=d.geometry,w=(v==null?void 0:v.type)==="Polygon"?[v.coordinates]:(v==null?void 0:v.type)==="MultiPolygon"?v.coordinates:[];for(const b of w)Xp(this.grid,this.W,this.H,e,b.map(y=>y.map(S=>t.proj.toWorld(S))),m+1);this.mokus.push({index:m+1,name:g,island:x.island,islandKey:p,key:x.mokuKey||`${p}:${g}`,props:x})}),this.loose=new Map(this.mokus.slice(1).map(d=>[`${d.islandKey}:${ir(d.name)}`,d])),this.checkKeys(s);const l=new We(this.grid,this.W,this.H,zs,pe);l.minFilter=ie,l.magFilter=ie,l.unpackAlignment=1,l.needsUpdate=!0,this.idTex=l,this.palette=new Uint8Array(256*2*4);const h=new We(this.palette,256,2,Ae,pe);h.minFilter=ie,h.magFilter=ie,h.needsUpdate=!0,this.palTex=h,n.uMokuId.value=l,n.uMokuRect.value.set(e.x0,e.z0,e.x1,e.z1),n.uPalette.value=h,this.eraKeys=[null,null]}checkKeys(t){const e=new Set(this.mokus.slice(1).map(s=>s.key)),n=new Set;for(const[s,i]of Object.entries(this.data.polities.byEra||{}))for(const a of Object.keys(i)){if(e.has(a))continue;const[r,...c]=a.split(":"),l=this.loose.get(`${lr(r)}:${ir(c.join(":"))}`);n.add(l?`${a} (${s}; the boundary file spells it "${l.name}")`:`${a} (${s})`)}n.size&&t(`polities.json names moku the boundary file doesn't have: ${[...n].slice(0,12).join(", ")}${n.size>12?", …":""}`)}holder(t,e){var i;const n=t?(i=this.data.polities.byEra)==null?void 0:i[t.id]:null;if(!n)return null;let s=n[e.key];if(s===void 0)for(const[a,r]of Object.entries(n)){const[c,...l]=a.split(":");if(lr(c)===e.islandKey&&ir(l.join(":"))===ir(e.name)){s=r;break}}return s?this.polities.get(s)||{id:s,name:s,colour:"#cccccc"}:null}setEras(t,e,n){const s=(t==null?void 0:t.id)??null,i=(e==null?void 0:e.id)??null;if(s!==this.eraKeys[0]||i!==this.eraKeys[1]){this.eraKeys=[s,i];const r=new Ht;this.palette.fill(0);for(const[c,l]of[[0,t],[1,e]])for(const h of this.mokus.slice(1)){const u=this.holder(l,h);if(!u)continue;r.set(u.colour||"#cccccc");const f=(c*256+h.index)*4;this.palette[f]=Math.round(r.r*255),this.palette[f+1]=Math.round(r.g*255),this.palette[f+2]=Math.round(r.b*255),this.palette[f+3]=255}this.palTex.needsUpdate=!0}const a=Math.max(0,Math.min(1,(n-.35)/.3));this.uniforms.uEraMix.value=t===e?0:a*a*(3-2*a)}mokuAt(t,e){const n=this.rect,s=Math.floor((t-n.x0)/(n.x1-n.x0)*this.W),i=Math.floor((e-n.z0)/(n.z1-n.z0)*this.H);return s<0||i<0||s>=this.W||i>=this.H?null:this.mokus[this.grid[i*this.W+s]]||null}politiesIn(t){const e=new Map;for(const n of this.mokus.slice(1)){const s=this.holder(t,n);s&&e.set(s.id,s)}return[...e.values()]}}const pr=1848,ra=[{id:"crown",name:"Crown",colour:"#f0b43c"},{id:"government",name:"Government",colour:"#5e9fd6"},{id:"konohiki",name:"Konohiki",colour:"#c7364f"},{id:"mixed",name:"Mixed",colour:"#a77fcf"},{id:"unknown",name:"Unknown",colour:"#b5b0a5",alpha:.85}],Of=new Map(ra.map((o,t)=>[o.id,t+1]));class tS{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.available=null,this.units=[],this.sources=null,this.built=!1,this.listeners=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){return this.loading?this.loading:(this.loading=(async()=>{var a;const t=this.data.abs("mahele.json");let e;try{const r=(a=this.data.ahupuaa)==null?void 0:a.features;if(!(r!=null&&r.length))throw new Error("no ahupuaʻa boundaries to lay it on");const c=await fetch(t);if(!c.ok)throw new Error(`HTTP ${c.status}`);if(e=await c.json(),!Array.isArray(e==null?void 0:e.ahupuaa))throw new Error("no ahupuaʻa in it")}catch(r){this.available=!1,this.warn(`${t}: ${r.message} (no Māhele view)`),this.notify();return}this.file=e,this.sources=new Set(e.sources||[]);const n=new Map(e.ahupuaa.map(r=>[r.gisId,r])),s=this.data.proj;let i=0;for(const r of this.data.ahupuaa.features){const c=r.properties||{},l=r.geometry,h=(l==null?void 0:l.type)==="Polygon"?[l.coordinates]:(l==null?void 0:l.type)==="MultiPolygon"?l.coordinates:[],u=n.get(c.gisId);u||i++;const f=Of.has(u==null?void 0:u.class)?u.class:"unknown",d=h.map(x=>x.map(g=>g.map(p=>s.toWorld(p)))),m=[1/0,1/0,-1/0,-1/0];for(const x of d)for(const g of x)for(const[p,v]of g)m[0]=Math.min(m[0],p),m[1]=Math.min(m[1],v),m[2]=Math.max(m[2],p),m[3]=Math.max(m[3],v);this.units.push({gisId:c.gisId,name:(u==null?void 0:u.name)??c.name??c.ahupuaa,island:c.island||"",islandId:c.islandId||(u==null?void 0:u.islandId)||"",moku:c.moku||"",cls:f,entry:u||null,rings:d,box:m})}i&&this.warn(`mahele.json has no entry for ${i} of the ahupuaʻa (drawn as unknown)`),this.available=!0,this.notify()})(),this.loading)}build(){if(this.built||!this.available)return this.built;const t=this.app.polity.rect,e=this.app.polity.W,n=this.app.polity.H,s=new Uint8Array(e*n);for(const l of this.units)for(const h of l.rings)Xp(s,e,n,t,h,Of.get(l.cls));const i=new We(s,e,n,zs,pe);i.minFilter=ie,i.magFilter=ie,i.unpackAlignment=1,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null};const a=new Uint8Array(256*2*4),r=new Ht;ra.forEach((l,h)=>{r.set(l.colour);for(const u of[0,1]){const f=(u*256+h+1)*4;a[f]=Math.round(r.r*255),a[f+1]=Math.round(r.g*255),a[f+2]=Math.round(r.b*255),a[f+3]=Math.round((l.alpha??1)*255)}});const c=new We(a,256,2,Ae,pe);return c.minFilter=ie,c.magFilter=ie,c.needsUpdate=!0,this.idTex=i,this.palTex=c,this.rect=t,this.built=!0,!0}availableAt(t=this.app.timeline.year){return this.available!==!1&&t>=pr}unitAt(t,e){for(const n of this.units){const s=n.box;if(!(t<s[0]||e<s[1]||t>s[2]||e>s[3])){for(const i of n.rings)if(eS(i,t,e))return n}}return null}counts(t=null){const e=Object.fromEntries(ra.map(s=>[s.id,0]));let n=0;for(const s of this.units)t&&s.islandId!==t||(e[s.cls]++,n++);return{byClass:e,all:n}}}function eS(o,t,e){let n=!1;for(const s of o)for(let i=0,a=s.length-1;i<s.length;a=i++){const[r,c]=s[i],[l,h]=s[a];c>e!=h>e&&t<(l-r)*(e-c)/(h-c)+r&&(n=!n)}return n}const Bf=["","loʻi kalo","dryland fields","rice","sugar cane","pineapple","pasture","orchards and coffee","lawns and parks"],nS=20,sS=1.4,Yp=4,iS=(o,t,e)=>Math.max(t,Math.min(e,o)),or=o=>o-Math.floor(o);function as(o,t){let e=or(o*.1031),n=or(t*.1031),s=or(o*.1031);const i=e*(n+33.33)+n*(s+33.33)+s*(e+33.33);return e+=i,n+=i,s+=i,or((e+n)*s)}function Kp(o,t){const e=(as(o+71.3,t+71.3)-.5)*1.4;return{rx:o,rz:t,ex:Math.cos(e),ez:Math.sin(e),ox:(o+.5)*Cn,oz:(t+.5)*Cn}}const Zp=(o,t,e)=>[o.ox+t*o.ex-e*o.ez,o.oz+t*o.ez+e*o.ex],Ql=(o,t)=>as(t+o.rx*13,3.7+o.rz*13);function Jp(o,t,e){const n=Ql(o,e),[s,i]=Zp(o,(t+.5-n)*xn[0],(e+.5)*xn[1]),a=t+o.rx*97,r=e+o.rz*97,c=.5*as(a+13.1,r+13.1)+.5*as(e+o.rx*13,7.9+o.rz*13);return{cx:s,cz:i,ix:t,iz:e,idx:a,idz:r,off:n,pick:c,pickKf:as(a+41.7,r+41.7)}}function Wf(o,t,e=null){e??(e=Kp(Math.floor(o/Cn),Math.floor(t/Cn)));const n=o-e.ox,s=t-e.oz,i=n*e.ex+s*e.ez,a=-n*e.ez+s*e.ex,r=Math.floor(a/xn[1]),c=Math.floor(i/xn[0]+Ql(e,r));return{...Jp(e,c,r),qx:i,qz:a}}function Qp(o,t){return o?o===ns.pasture||o===ns.lawn||t<=0?1:.55+.45*t:t}const t0=o=>[o>>4>8?0:o>>4,(o&15)/15];function oS(o,t,e){var a;const n=o==null?void 0:o.crops,s=((a=n==null?void 0:n.islands)==null?void 0:a[t])??null,i=r=>typeof r=="string"?r:(r==null?void 0:r.file)||null;return e.map(r=>{var c,l,h,u,f,d;return i(((c=s==null?void 0:s.layers)==null?void 0:c[r])??(s==null?void 0:s[r])??((l=s==null?void 0:s.keyframes)==null?void 0:l[r])??((d=(f=(u=(h=o==null?void 0:o.islands)==null?void 0:h[t])==null?void 0:u.layers)==null?void 0:f[r])==null?void 0:d.crop))||null})}function aS(o,t){var a,r,c,l,h,u,f,d;const e=o==null?void 0:o.crops,n=(e==null?void 0:e.islands)??{};let s=!1;const i={};for(const m of Object.keys(n)){const x=((r=(a=n[m])==null?void 0:a.layers)==null?void 0:r[t])??((c=n[m])==null?void 0:c[t])??((h=(l=n[m])==null?void 0:l.keyframes)==null?void 0:h[t]),g=((u=x==null?void 0:x.stats)==null?void 0:u.km2)??((f=x==null?void 0:x.stats)==null?void 0:f.texels)??((d=x==null?void 0:x.stats)==null?void 0:d.share)??null;if(!(!g||typeof g!="object")){s=!0;for(const[p,v]of Object.entries(g))Number(p)>0&&v>0&&(i[p]=(i[p]||0)+v)}}return s?i:null}function rS(o,t){const e=o.find(Boolean);if(!e)return null;const{W:n,H:s}=e,i=new Uint8Array(n*s*4),a=[],r=(c,l,h)=>c.W===n&&c.H===s?c.px[h*n+l]:c.px[Math.min(c.H-1,Math.floor((h+.5)*c.H/s))*c.W+Math.min(c.W-1,Math.floor((l+.5)*c.W/n))];for(let c=0;c<Yp;c++){const l=o[c],h=t[c];if(a.push(l?1:0),!!l)for(let u=0;u<s;u++)for(let f=0;f<n;f++){let d=r(l,f,u);d>8&&(d=0);const m=h?r(h,f,u):0,x=m>0?Math.max(1,Math.round(m/255*15)):0;i[(u*n+f)*4+c]=d<<4|x}}return{data:i,W:n,H:s,has:a}}function cS(){const o=new We(new Uint8Array(4),1,1,Ae,pe);return o.needsUpdate=!0,o}const Hf=(o,t)=>o.set(t===0?1:0,t===1?1:0,t===2?1:0,t===3?1:0);function Gf(o,t){!o||"CROPS"in(o.defines??{})===t||(o.defines??(o.defines={}),t?o.defines.CROPS="":delete o.defines.CROPS,o.needsUpdate=!0)}class lS{constructor(t){this.app=t,this.blank=cS();const e=t.shared.uniforms;Object.assign(e,{uCropSelA:{value:new Yt(1,0,0,0)},uCropSelB:{value:new Yt(1,0,0,0)},uCropMix:{value:0},uDistCrop:{value:this.blank},uDistCropRect:{value:new Yt(0,0,1,1)},uDistCropOn:{value:0}}),this.uniforms=e,this.available=null,this.keyframes=[],this.islands=new Map,this.files=new Map,this.shown={a:0,b:0,mix:0},this.hidden=!1,this.uploads=[],this.loads=0,this.releases=0,t.land.onChange(()=>this.start())}start(){var r;const t=this.app.land;if(this.available!==null||t.available===null)return;const e=t.manifest;if(!t.available||!e){this.available=!1;return}this.manifest=e,this.keyframes=t.keyframes.slice(0,Yp);const n=this.keyframes.map(c=>c.id);for(const c of this.app.world.islandPacks){const l=oS(e,c.id,n);l.some(Boolean)&&this.files.set(c.id,l)}this.available=this.files.size>0;const s=((r=e.crops)==null?void 0:r.eras)??{},i=c=>{var l;return(l=this.keyframes.find(h=>h.id===c))==null?void 0:l.year};this.eraYears=this.app.timeline.eras.map(c=>{var l;return i((l=s[c.id])==null?void 0:l.keyframe)??t.eraYear(c,"crop")}),this.edges=this.boundaries();const a=this.nearest();this.shown={a,b:a,mix:0},this.apply()}nearest(t=this.app.timeline.s){return this.keyframes.length?iS(Math.round(this.app.land.position(t,this.eraYears)),0,this.keyframes.length-1):0}boundaries(){const t=this.app.timeline,e=this.keyframes.length,n=Array.from({length:e},()=>[1/0,-1/0]),s=4e3;let i=null;for(let a=0;a<=s;a++){const r=a/s*t.max,c=this.nearest(r),l=t.yearAt(r);if(i!==null&&c!==i.k){let h=i.s,u=r;for(let d=0;d<30;d++){const m=(h+u)/2;this.nearest(m)===i.k?h=m:u=m}const f=t.yearAt(u);n[i.k][1]=Math.max(n[i.k][1],f),n[c][0]=Math.min(n[c][0],f)}i===null&&(n[c][0]=-1/0),i={k:c,s:r,y:l}}return i&&(n[i.k][1]=1/0),n}async load(t,e){var m;const n=performance.now(),s=this.files.get(t),i=this.keyframes.map(x=>x.id),a=(m=this.manifest.islands)==null?void 0:m[t],r=x=>x?go(On,this.app.data.abs(`layers/${x}`)).catch(g=>(this.app.warn(`crops ${t}: ${x}: ${g.message}`),null)):Promise.resolve(null),c=await Promise.all(s.map(r)),l=x=>{var g,p,v;for(let w=0;w<i.length;w++)for(const b of[x-w,x+w])if((v=(p=(g=a==null?void 0:a.layers)==null?void 0:g[i[b]])==null?void 0:p.cultivation)!=null&&v.file)return a.layers[i[b]].cultivation.file;return null},h=await Promise.all(i.map((x,g)=>c[g]?r(l(g)):null));if(e.dropped)return;const u=rS(c,h);if(!u){e.state="none";return}const f=new We(u.data,u.W,u.H,Ae,pe);f.minFilter=f.magFilter=ie,f.generateMipmaps=!1,f.wrapS=f.wrapT=Ze,f.needsUpdate=!0,Object.assign(e,{state:"ready",tex:f,bytes:u.data,W:u.W,H:u.H,has:u.has,ms:Math.round(performance.now()-n)}),this.uploads.push(f),this.loads++;const d=this.app.world.terrains.get(t);d&&this.attach(d)}attach(t){const e=t.uniforms;if(!e.uOwnCrop)return;const n=this.islands.get(t.pack.id),s=(n==null?void 0:n.state)==="ready",i=s&&!this.hidden;e.uOwnCrop.value=i?n.tex:this.blank,e.uOwnCropOn.value=i?1:0;for(const a of[t.full,t.half])Gf(a==null?void 0:a.material,s)}release(t){var s,i;const e=this.islands.get(t);if(!e)return;e.dropped=!0,(s=e.tex)==null||s.dispose(),this.uploads=this.uploads.filter(a=>a!==e.tex),this.islands.delete(t),this.releases++;const n=this.app.world.terrains.get(t);n&&this.attach(n),(i=this.app.cropTrees)==null||i.drop(t)}map(t){const e=this.islands.get(t);return(e==null?void 0:e.state)==="ready"?e:null}bindDistrict(t){var r,c,l,h,u,f;const e=t?this.map(t):null,n=this.uniforms,s=!!e&&!this.hidden;if(n.uDistCrop.value=s?e.tex:this.blank,n.uDistCropOn.value=s?1:0,s){const d=this.app.world.terrains.get(t).rect;n.uDistCropRect.value.copy(d)}if(!e)return;const i=(r=this.app.districts)==null?void 0:r.cur,a=(c=i==null?void 0:i.features)==null?void 0:c.forest;for(const d of[(h=(l=i==null?void 0:i.terrain)==null?void 0:l.full)==null?void 0:h.material,(f=(u=i==null?void 0:i.terrain)==null?void 0:u.half)==null?void 0:f.material,a==null?void 0:a.mat,a==null?void 0:a.matDS])Gf(d,!0)}cell(t,e){return Wf(t,e)}cover(t,e){return Qp(t,e)}classAt(t,e,n,s=this.shown.a){const i=this.map(t);if(!i)return null;const a=Wf(e,n),r=this.app.world.terrains.get(t).pack.rect,c=Math.floor((a.cx-r.x0)/(r.x1-r.x0)*i.W),l=Math.floor((a.cz-r.z0)/(r.z1-r.z0)*i.H);return c<0||l<0||c>=i.W||l>=i.H?[0,0]:t0(i.bytes[(l*i.W+c)*4+s])}update(t){if(!this.available)return;const e=this.nearest(),n=this.shown;e!==n.b&&(n.mix>0&&(n.a=n.mix<.5?n.a:n.b),n.b=e,n.mix=0),n.a!==n.b&&(n.mix+=t*sS,n.mix>=1&&(n.a=n.b,n.mix=0));const s=performance.now();for(const a of this.app.world.islands){const r=a.pack.id;if(!this.files.has(r))continue;let c=this.islands.get(r);a.slot>=0&&a.k>.002?(c||(c={id:r,state:"loading",lastSeen:s},this.islands.set(r,c),this.load(r,c).catch(l=>{c.state="failed",this.app.warn(`crops ${r}: ${l.message} (its ground is drawn without them)`)})),c.lastSeen=s):c&&c.state!=="loading"&&s-c.lastSeen>nS*1e3&&this.release(r)}this.apply();const i=this.uploads.shift();i&&this.app.renderer.initTexture(i)}apply(){const t=this.uniforms;Hf(t.uCropSelA.value,this.shown.a),Hf(t.uCropSelB.value,this.shown.b),t.uCropMix.value=this.shown.mix}settle(){if(!this.available)return;const t=this.nearest();for(this.shown={a:t,b:t,mix:0},this.apply();this.uploads.length;)this.app.renderer.initTexture(this.uploads.shift())}setHidden(t){var n;this.hidden=!!t;for(const s of this.app.world.islands)this.attach(s);const e=this.app.districts;e!=null&&e.on&&e.cur&&this.bindDistrict((n=e.cur.parent)==null?void 0:n.pack.id)}get ready(){if(!this.available)return!0;for(const t of this.app.world.islands){if(!this.files.has(t.pack.id)||!(t.slot>=0&&t.k>.002))continue;const e=this.islands.get(t.pack.id);if(!e||e.state==="loading"||e.tex&&this.uploads.includes(e.tex))return!1}return!0}describe(){if(!this.available)return null;const t=this.keyframes[this.nearest()],e=t?aS(this.manifest,t.id):null;if(!e)return null;const n=Object.keys(e).map(Number).filter(s=>s>0&&s<Bf.length).sort((s,i)=>e[i]-e[s]);return{keyframe:t.id,year:t.year,classes:n.map(s=>({id:s,name:Bf[s]}))}}grown(){var t;return(((t=this.describe())==null?void 0:t.classes)||[]).filter(e=>e.id!==ns.pasture&&e.id!==ns.lawn).map(e=>e.name)}stats(){var s,i,a;const t=[...this.islands.values()],e=t.reduce((r,c)=>r+(c.state==="ready"?c.W*c.H*4:0),0),n=this.shown;return{available:this.available,keyframe:((s=this.keyframes[n.a])==null?void 0:s.id)??null,going:n.a!==n.b?((i=this.keyframes[n.b])==null?void 0:i.id)??null:null,mix:+n.mix.toFixed(3),spans:((a=this.edges)==null?void 0:a.map((r,c)=>[this.keyframes[c].id,r[0]===-1/0?null:+r[0].toFixed(2),r[1]===1/0?null:+r[1].toFixed(2)]))??[],islands:t.map(r=>({id:r.id,state:r.state,size:r.W?`${r.W}×${r.H}`:null,has:r.has??null,ms:r.ms??null})),withMasks:[...this.files.keys()],gpuMB:+(e/1048576).toFixed(2),cpuMB:+(e/1048576).toFixed(2),loads:this.loads,releases:this.releases,hidden:this.hidden}}dispose(){for(const t of[...this.islands.keys()])this.release(t);this.blank.dispose()}}const hS=new Date().getFullYear();function Or(o,t=!1){if(o==null)return null;if(typeof o=="number")return o+(t?1:0);const e=String(o).match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!e)return null;const n=Number(e[1]);if(e[2]){const s=Number(e[2])-1+(t?1:0);return n+s/12}return n+(t?1:0)}const uS={day:0,month:0,year:0,decade:5,generation:12,century:50};function Al(o){const t=o.when||{};let e=Or(t.from),n=Or(t.to??t.from,!0);if(e===null&&n===null)return null;e===null&&(e=n-1),n===null&&(n=e+1);const s=uS[t.precision]??0;return s&&n-e<=1.01&&(e-=s,n+=s),[e,n]}function Br(o){const t=o.when||{};return Or(t.from)??Or(t.to)}const e0=["generation","century","decade"];function n0(o){var e;const t=Br(o);return t===null?"":Jo(Math.floor(t),e0.includes((e=o.when)==null?void 0:e.precision)?10:1)}function fS(o){const t=o.when||{},e=s=>{const i=String(s??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!i)return String(s??"");const a=["January","February","March","April","May","June","July","August","September","October","November","December"],r=Number(i[1]),c=r<0?`${-r} BCE`:String(r);return i[3]?`${Number(i[3])} ${a[Number(i[2])-1]} ${c}`:i[2]?`${a[Number(i[2])-1]} ${c}`:c},n=e0.includes(t.precision)?"c. ":"";return!t.to||t.to===t.from?`${n}${e(t.from)}`:`${n}${e(t.from)} – ${e(t.to)}`}class dS{constructor(t,{now:e=hS}={}){this.eras=[...t].filter(i=>Number.isFinite(i.year)).sort((i,a)=>i.year-a.year),this.s=0,this.listeners=[];const n=this.eras,s=n.at(-1);this.end=s?s.year:1800,this.tail=0,n.length>1&&s.year<e&&s.year+(s.yearPrecision??0)>=e&&(this.end=e,this.tail=(e-s.year)/Math.max(1e-6,s.year-n.at(-2).year))}get n(){return this.eras.length}get max(){return Math.max(0,this.n-1+this.tail)}get reachesNow(){return this.tail>0}eraAt(t){return this.eras[Math.round(Math.max(0,Math.min(this.n-1,t)))]||null}yearAt(t){const e=this.eras;if(!e.length)return 1800;if(e.length===1)return e[0].year+t*50;if(t<=0)return e[0].year+t*(e[1].year-e[0].year);if(t>=e.length-1)return e[e.length-1].year+(t-e.length+1)*(e[e.length-1].year-e[e.length-2].year);const n=Math.floor(t);return e[n].year+(t-n)*(e[n+1].year-e[n].year)}sAtYear(t){const e=this.eras;if(e.length<2||t<=e[0].year)return 0;for(let s=0;s+1<e.length;s++)if(t<=e[s+1].year)return s+(t-e[s].year)/Math.max(1e-6,e[s+1].year-e[s].year);const n=e.length-1;return Math.min(this.max,n+(t-e[n].year)/Math.max(1e-6,e[n].year-e[n-1].year))}get year(){return this.yearAt(this.s)}get era(){return this.eraAt(this.s)}get pair(){const t=Math.max(0,this.n-1),e=Math.max(0,Math.min(t,this.s)),n=Math.floor(e),s=Math.min(t,n+1);return{a:this.eras[n],b:this.eras[s],t:e-n}}get window(){return[this.yearAt(this.s-.5),this.yearAt(this.s+.5)]}set(t){const e=Math.max(0,Math.min(this.max,t));if(e!==this.s){this.s=e;for(const n of this.listeners)n(this)}}setYear(t){this.set(this.sAtYear(t))}onChange(t){this.listeners.push(t)}}function Jo(o,t=1){const e=Math.round(o),n=e<0?`${-e} BCE`:String(e);return t>=10?`c. ${n}`:n}const ws=.05;class pS{constructor(t){const e=t.filter(Number.isFinite);this.oldest=Math.max(.1,...e),this.youngest=Math.max(-ws*.8,Math.min(0,...e)),this.age=this.oldest,this.listeners=[]}get span(){return[Math.log((this.oldest+ws)/ws),Math.log((this.youngest+ws)/ws)]}uAt(t){const[e,n]=this.span,s=Math.max(this.youngest,Math.min(this.oldest,t));return(e-Math.log((s+ws)/ws))/Math.max(1e-6,e-n)}ageAt(t){const[e,n]=this.span,s=Math.max(0,Math.min(1,t));return ws*Math.exp(e-s*(e-n))-ws}get u(){return this.uAt(this.age)}set(t){const e=Math.max(this.youngest,Math.min(this.oldest,t));if(!(Math.abs(e-this.age)<1e-9)){this.age=e;for(const n of this.listeners)n(this)}}setU(t){this.set(this.ageAt(t))}onChange(t){this.listeners.push(t)}ticks(){const t=[20,10,5,2,1,.5,.2,.1].filter(e=>e<=this.oldest*1.0001);return t.push(0),t}}const Qo=o=>Number((o*1e6).toPrecision(2)).toLocaleString("en-US"),ta=o=>{const t=Math.round(o*10)/10;return Number.isInteger(t)?String(t):t.toFixed(1)};function _i(o){return Number.isFinite(o)?Math.abs(o)<5e-4?"now":o<0?`in about ${Qo(-o)} years`:o>=1?`about ${ta(o)} million years ago`:`about ${Qo(o)} years ago`:""}function mS(o){return Number.isFinite(o)?Math.abs(o)<5e-4?"now":Math.abs(o)>=1?`${ta(o)} Ma`:`${Number((o*1e3).toPrecision(2))} ka`:""}function gS(o){if(!Array.isArray(o)||o.length<2||!o.every(Number.isFinite))return"";const[t,e]=o;return Math.abs(e)<5e-4?`${_i(t)} to now`:t>=1&&e>=1?`about ${ta(t)} to ${ta(e)} million years ago`:t>=1?`about ${ta(t)} million to ${Qo(e)} years ago`:`about ${Qo(t)} to ${Qo(e)} years ago`}const s0=`
uniform float uVert;        // world Y per metre (the exaggeration of the moment)
uniform vec4 uGeoRect;      // the seafloor box, world: x0, z0, x1, z1
uniform sampler2D uStageA;  // metres (half float, linear)
uniform sampler2D uStageB;
uniform float uStageMix;
uniform sampler2D uSeafloor; // the seafloor pack (today's ground, sharper than the stages' smoothed floors)
uniform vec2 uDrift;        // the plate's drift at the clock's age, world units
uniform float uAbyss;       // metres, beyond the box
uniform vec4 uSlideAxis;    // a slide's axis in the stage's frame: origin xz, unit direction xz
uniform vec4 uSlide;        // x length, y half width (world), z the front (0..1), w the body's strength (0 none)

vec2 geoUv(vec2 q) { return (q - uGeoRect.xy) / (uGeoRect.zw - uGeoRect.xy); }

// how far inside the box (in uv), negative outside
float geoInside(vec2 uv) { return min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)); }

float stageMetres(vec2 q) {
  vec2 uv = geoUv(q);
  float a = texture(uStageA, uv).r;
  float b = texture(uStageB, uv).r;
  float m = mix(a, b, uStageMix);
  // where a stage is only today's floor smoothed, the floor's own detail:
  // so a crossfade between stages does not soften and sharpen the deep
  // floor, and only what the stages change moves
  float sf = texture(uSeafloor, uv).r;
  m += (sf - m) * (1.0 - smoothstep(120.0, 400.0, abs(sf - m)));
  return mix(uAbyss, m, smoothstep(0.0, 0.025, geoInside(uv)));
}

// the slide's body: where it stands along the axis (front), an ellipse a
// fifth of the run long and most of the field wide; 1 at its middle
float slideBody(vec2 q) {
  if (uSlide.w <= 0.0) return 0.0;
  vec2 d = q - uSlideAxis.xy;
  float along = dot(d, uSlideAxis.zw);
  float across = dot(d, vec2(-uSlideAxis.w, uSlideAxis.z));
  float c = uSlide.z * uSlide.x;
  float u = (along - c) / (0.14 * uSlide.x);
  float v = across / max(1.0, 0.7 * uSlide.y);
  return exp(-(u * u + v * v) * 1.6) * uSlide.w;
}
`,xS=`
${s0}
out vec3 vWorld;
out vec2 vQ;
out float vBody;
void main() {
  vec2 xz = position.xz;
  vec2 q = xz - uDrift;
  float m = stageMetres(q);
  float body = slideBody(q);
  // (the moving mass stands a little proud of the floor it runs over)
  m += body * 700.0;
  vec4 w = modelMatrix * vec4(xz.x, m * uVert, xz.y, 1.0);
  vWorld = w.xyz;
  vQ = q;
  vBody = body;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,vS=`
#define PI 3.14159265
${s0}
${Qs}
uniform vec2 uTexel;        // one texel of the stage images, in uv
uniform float uClear;       // the sea: 0 opaque as the main view's, 1 clear to the floor
uniform sampler2D uField;   // r a lit field's fill, g its outline, b a scar's outline (in the stage's frame)
uniform float uFieldK;      // the wash's strength
uniform vec3 uHotspot;      // x, z (world, fixed), radius
in vec3 vWorld;
in vec2 vQ;
in float vBody;

vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

void main() {
  vec2 q = vQ;
  float m = stageMetres(q);
  // the slope from the heights themselves, a texel either side
  vec2 e = uTexel * (uGeoRect.zw - uGeoRect.xy);
  float hx = stageMetres(q + vec2(e.x, 0.0)) - stageMetres(q - vec2(e.x, 0.0));
  float hz = stageMetres(q + vec2(0.0, e.y)) - stageMetres(q - vec2(0.0, e.y));
  // (the floor's relief read at a steady exaggeration, so the arch and the
  // blocks hold their shading as the camera's exaggeration eases)
  float vx = max(uVert, 0.045) * 1.6;
  vec3 N = normalize(vec3(-hx * vx / (2.0 * e.x), 1.0, -hz * vx / (2.0 * e.y)));
  vec3 V = normalize(cameraPosition - vWorld);
  float px = length(fwidth(vWorld.xz));

  vec3 col;
  if (m > 0.0) {
    // land: green low, browner and greyer with height
    vec3 low = srgb(vec3(0.33, 0.42, 0.22));
    vec3 mid = srgb(vec3(0.46, 0.40, 0.28));
    vec3 high = srgb(vec3(0.52, 0.49, 0.45));
    vec3 alb = mix(low, mid, smoothstep(300.0, 1400.0, m));
    alb = mix(alb, high, smoothstep(2200.0, 3600.0, m));
    // a bright beach line at the shore
    alb = mix(alb, srgb(vec3(0.80, 0.74, 0.58)), 1.0 - smoothstep(0.0, max(40.0, fwidth(m) * 1.5), m));
    col = shade(alb, N, vWorld, 1.0, 1.0);
  } else {
    float depth = -m;
    // the floor: pale sediment, lit as the land is, then seen through the water
    vec3 floorC = shade(srgb(vec3(0.62, 0.60, 0.55)), N, vWorld, 1.0, 1.0);
    vec3 amb = uSkyColor * 1.6 + uSunColor * max(uSunDir.y, 0.0);
    vec3 shelf = srgb(vec3(0.20, 0.62, 0.66)) * 0.25 * amb;
    vec3 deep = srgb(vec3(0.10, 0.28, 0.52)) * 0.16 * amb;
    vec3 body = mix(shelf, deep, smoothstep(40.0, 1800.0, depth));
    vec3 opaque = mix(vec3(0.03, 0.20, 0.21), vec3(0.004, 0.030, 0.075), smoothstep(5.0, 45.0, depth));
    opaque = mix(opaque, vec3(0.002, 0.018, 0.060), smoothstep(200.0, 1500.0, depth)) * amb;
    // clear enough that the floor four or five kilometres down still reads,
    // dim enough that the depth does
    float T = mix(0.85, 0.32, smoothstep(0.0, 5500.0, depth));
    vec3 tint = mix(vec3(0.55, 0.85, 0.92), vec3(0.30, 0.50, 0.85), smoothstep(100.0, 3000.0, depth));
    vec3 seen = floorC * tint * T * 0.4 + body * (1.0 - T);
    col = mix(opaque, seen, uClear);
    // the shore, a fine light line
    float shore = 1.0 - smoothstep(0.0, max(30.0, fwidth(m) * 1.2), depth);
    col = mix(col, srgb(vec3(0.85, 0.88, 0.86)) * amb * 0.35, shore * 0.6);
    // the surface's sheen toward the horizon
    float F = 0.02 + 0.98 * pow(1.0 - max(V.y, 0.0), 5.0);
    col = mix(col, skyMap(reflect(-V, vec3(0.0, 1.0, 0.0))), F * 0.7);
  }

  // a lit field: its wash, revealed up to a running slide's front, and its outline
  vec2 uv = geoUv(q);
  if (uFieldK > 0.002 && geoInside(uv) > 0.0) {
    vec3 f = texture(uField, uv).rgb;
    float reveal = 1.0;
    if (uSlide.w > 0.0 || uSlide.z < 1.0) {
      float along = dot(q - uSlideAxis.xy, uSlideAxis.zw) / max(1.0, uSlide.x);
      reveal = 1.0 - smoothstep(uSlide.z - 0.04, uSlide.z + 0.02, along);
    }
    vec3 washC = srgb(vec3(0.93, 0.70, 0.42));
    float lum = max(0.04, dot(col, vec3(0.2126, 0.7152, 0.0722)));
    col = mix(col, washC * lum * 2.2, f.r * 0.42 * uFieldK * reveal);
    col = mix(col, washC * max(lum * 3.0, 0.08), f.g * 0.85 * uFieldK * reveal);
    col = mix(col, srgb(vec3(0.95, 0.92, 0.85)) * max(lum * 2.5, 0.06), f.b * 0.7 * uFieldK);
  }
  // the sliding mass, translucent
  if (vBody > 0.003) {
    vec3 massC = shade(srgb(vec3(0.70, 0.56, 0.40)), N, vWorld, 1.0, 1.0);
    col = mix(col, massC, clamp(vBody, 0.0, 1.0) * 0.5);
  }
  // the hotspot, where it has always been: a faint warm glow on the floor
  if (uHotspot.z > 0.0) {
    float d = length(vWorld.xz - uHotspot.xy) / uHotspot.z;
    col += srgb(vec3(1.0, 0.55, 0.25)) * 0.05 * exp(-d * d) * uClear;
  }
  gl_FragColor = vec4(col, 1.0);
}
`,Tl=(o,t,e)=>Math.max(t,Math.min(e,o)),ar=(o,t,e)=>{const n=Tl((e-o)/(t-o),0,1);return n*n*(3-2*n)},rr=-4800,wS=4,No=5.5,jc=384,Vf=10;function qc(o,t,e){const n=new We(e,o,t,zs,ks);return n.minFilter=Fe,n.magFilter=Fe,n.wrapS=n.wrapT=Ze,n.generateMipmaps=!1,n.needsUpdate=!0,n}function yS(o,t){const e=(u,f)=>{const d=[];for(let w=0;w<=jc;w++)d.push(u+(f-u)*w/jc);const m=(f-u)/jc,x=Math.pow(t/m,1/Vf),g=[],p=[];let v=m;for(let w=0;w<Vf;w++)v*=x,g.unshift(u-v),p.push(f+v);return[...g,...d,...p]},n=e(o.x0,o.x1),s=e(o.z0,o.z1),i=n.length,a=s.length,r=new Float32Array(i*a*3);for(let u=0;u<a;u++)for(let f=0;f<i;f++){const d=(u*i+f)*3;r[d]=n[f],r[d+2]=s[u]}const c=new Uint32Array((i-1)*(a-1)*6);let l=0;for(let u=0;u<a-1;u++)for(let f=0;f<i-1;f++){const d=u*i+f,m=d+1,x=d+i,g=x+1;c[l++]=d,c[l++]=x,c[l++]=m,c[l++]=m,c[l++]=x,c[l++]=g}const h=new Je;return h.setAttribute("position",new de(r,3)),h.setIndex(new de(c,1)),h}class MS{constructor(t,e){this.app=t,this.geo=e,this.proj=t.data.proj,this.sf=e.seafloor,this.stages=new Map(e.stages.map(i=>[i.id,i])),this.group=new Te,this.group.visible=!1,t.scene.add(this.group),this.want=!1,this.k=0,this.cache=new Map,this.slots=[null,null],this.keys=null,this.lit=[],this.slide=null,this.marks=[],this.loads=0,this.uploads=0,this.releases=0;const n=this.sf.rect,s=t.shared.uniforms;this.uniforms={uSunDir:s.uSunDir,uSunColor:s.uSunColor,uSkyColor:s.uSkyColor,uGroundColor:s.uGroundColor,uMoonDir:s.uMoonDir,uMoonColor:s.uMoonColor,uTime:s.uTime,uSkyMap:s.uSkyMap,uVert:s.uVert,uGeoRect:{value:new Yt(n.x0,n.z0,n.x1,n.z1)},uStageA:{value:null},uStageB:{value:null},uStageMix:{value:0},uSeafloor:{value:null},uDrift:{value:new Bt},uAbyss:{value:rr},uTexel:{value:new Bt(1/this.sf.W,1/this.sf.H)},uClear:{value:0},uField:{value:null},uFieldK:{value:0},uSlideAxis:{value:new Yt(0,0,1,0)},uSlide:{value:new Yt(1,1,1,0)},uHotspot:{value:new W(0,0,0)}},e.hotspot.at&&this.uniforms.uHotspot.value.set(e.hotspot.at[0],e.hotspot.at[1],35)}enter(){this.want=!0,this.decoder||(this.decoder=new _0(this.app.warn)),!this.sfTex&&!this.sfLoading&&(this.sfLoading=this.decoder.decode(this.sf,this.sf.W,this.sf.H).then(t=>{this.sfLoading=null,!(!this.want&&this.k<=0)&&(this.sfData=t,this.sfTex=qc(this.sf.W,this.sf.H,t.half),this.loads++,this.build())},t=>{this.sfLoading=null,this.app.warn(`geology: ${t.message}`)}))}leave(){this.want=!1,this.keys=null,this.slide=null}get covers(){return this.group.visible}build(){if(this.mesh)return;const t=this.sf.rect,e=yS(t,25e4),n=new Uint16Array(this.sf.W*this.sf.H);this.tex=[qc(this.sf.W,this.sf.H,n),qc(this.sf.W,this.sf.H,n)],this.slots=[null,null],this.material=new _e({vertexShader:xS,fragmentShader:vS,uniforms:this.uniforms}),this.mesh=new ge(e,this.material),this.mesh.frustumCulled=!1,this.group.add(this.mesh),this.uniforms.uStageA.value=this.sfTex,this.uniforms.uStageB.value=this.sfTex,this.uniforms.uSeafloor.value=this.sfTex,this.fieldCanvas=document.createElement("canvas"),this.fieldCanvas.width=1024,this.fieldCanvas.height=Math.max(1,Math.round(1024*this.sf.H/this.sf.W)),this.fieldTex=new qw(this.fieldCanvas),this.fieldTex.flipY=!1,this.fieldTex.generateMipmaps=!1,this.fieldTex.minFilter=Fe,this.uniforms.uField.value=this.fieldTex,this.drawFields()}release(){var t,e,n;this.group.visible=!1,this.mesh&&(this.group.remove(this.mesh),this.mesh.geometry.dispose(),this.material.dispose(),this.mesh=null);for(const s of this.tex||[])s.dispose();this.tex=null,(t=this.sfTex)==null||t.dispose(),this.sfTex=null,this.sfData=null,(e=this.fieldTex)==null||e.dispose(),this.fieldTex=null,this.fieldCanvas=null,this.uniforms.uStageA.value=null,this.uniforms.uStageB.value=null,this.uniforms.uSeafloor.value=null,this.uniforms.uField.value=null,this.slots=[null,null],this.cache.clear(),(n=this.decoder)==null||n.dispose(),this.decoder=null;for(const s of this.marks)s.el.remove();this.marks=[],this.releases++}load(t){const e=this.stages.get(t);if(!e)return null;if(e.seafloor)return this.sfData?Promise.resolve(this.sfData):null;let n=this.cache.get(t);if(!n){if(!this.decoder)return null;if(n={data:null,used:performance.now()},n.promise=this.decoder.decode(e,this.sf.W,this.sf.H).then(s=>{n.data=s,this.loads++},s=>{this.app.warn(`geology: stage ${t}: ${s.message}`),this.cache.delete(t)}),this.cache.set(t,n),this.cache.size>wS){const s=[...this.cache.entries()].filter(([i])=>!this.slots.includes(i)).sort((i,a)=>i[1].used-a[1].used)[0];s&&this.cache.delete(s[0])}}return n.used=performance.now(),n.promise}ready(t){var n;const e=this.stages.get(t);return e?e.seafloor?!!this.sfTex:!!((n=this.cache.get(t))!=null&&n.data):!1}texFor(t,e){if(this.stages.get(t).seafloor)return this.sfTex;let s=this.slots.indexOf(t);if(s<0){s=this.slots[0]===e?1:0;const i=this.tex[s];i.image.data=this.cache.get(t).data.half,i.needsUpdate=!0,this.slots[s]=t,this.uploads++}return this.tex[s]}show(t,e,{jump:n=!1}={}){var a,r;if(!this.stages.has(t)){this.app.warn(`geology: no stage “${t}”`),this.keys=null;return}this.load(t);const s=this.app.geoClock.age,i=(a=this.drawn)!=null&&a.b&&this.drawn.mix>.5?this.drawn.b:(r=this.drawn)==null?void 0:r.a;this.keys=n||!i?{from:t,fromAge:e,to:t,toAge:e}:{from:i,fromAge:s,to:t,toAge:e},this.slide=null}pair(t){const e=this.pairAt(t);return e.mix>=1-1e-4?{a:e.b,b:e.b,mix:0}:e.mix<=1e-4?{a:e.a,b:e.a,mix:0}:e}pairAt(t){const e=this.app.geoClock;if(this.slide){const a=Math.max(0,this.slide.t)/No;return{a:this.slide.from,b:this.slide.to,mix:ar(.06,.5,a)}}const n=this.keys;if(n){if(n.from===n.to||Math.abs(n.toAge-n.fromAge)<1e-9)return{a:n.to,b:n.to,mix:0};const a=Math.min(n.fromAge,n.toAge),r=Math.max(n.fromAge,n.toAge);if(t>=a-1e-6&&t<=r+1e-6)return{a:n.from,b:n.to,mix:Tl((e.uAt(t)-e.uAt(n.fromAge))/(e.uAt(n.toAge)-e.uAt(n.fromAge)),0,1)};this.keys=null}const s=this.geo.stages;if(t>=s[0].age)return{a:s[0].id,b:s[0].id,mix:0};for(let a=0;a+1<s.length;a++)if(t<=s[a].age&&t>=s[a+1].age){const r=(e.uAt(t)-e.uAt(s[a].age))/Math.max(1e-6,e.uAt(s[a+1].age)-e.uAt(s[a].age));return{a:s[a].id,b:s[a+1].id,mix:Tl(r,0,1)}}const i=s[s.length-1].id;return{a:i,b:i,mix:0}}light(t=[]){const e=t.filter(n=>this.geo.fields.has(n));e.join()!==this.lit.join()&&(this.lit=e,this.drawFields(),this.makeMarks())}drawFields(){const t=this.fieldCanvas;if(!t)return;const e=t.getContext("2d");e.clearRect(0,0,t.width,t.height);const[n,s,i,a]=this.geo.manifest.seafloor.bounds,r=([l,h])=>[(l-n)/(i-n)*t.width,(a-h)/(a-s)*t.height],c=l=>{e.beginPath(),l.forEach((h,u)=>u?e.lineTo(...r(h)):e.moveTo(...r(h))),e.closePath()};e.globalCompositeOperation="lighter";for(const l of this.lit){const h=this.geo.fields.get(l);c(h.ring),e.fillStyle="#ff0000",e.fill(),e.strokeStyle="#00ff00",e.lineWidth=2,e.stroke(),h.scarRing&&(c(h.scarRing),e.strokeStyle="#0000ff",e.setLineDash([4,3]),e.stroke(),e.setLineDash([]))}this.fieldTex&&(this.fieldTex.needsUpdate=!0)}makeMarks(){var e,n,s;for(const i of this.marks)i.el.remove();this.marks=[];const t=(e=this.app.ui)==null?void 0:e.root;if(t)for(const i of this.lit){const a=this.geo.fields.get(i);for(const r of a.blocks){const c=r.coordinates||((n=r.geometry)==null?void 0:n.coordinates),l=r.name||((s=r.properties)==null?void 0:s.name);if(!c||!l)continue;const h=document.createElement("div");h.className="geo-mark",h.innerHTML="<i></i><span></span>",h.lastChild.textContent=l,t.appendChild(h);const[u,f]=this.proj.toWorld(c);this.marks.push({el:h,x:u,z:f,field:i,name:l,shown:!1,along:0})}}}fieldAxis(t){var h;const e=t.ring.map(u=>this.proj.toWorld(u));let n=null;if(t.scarRing)n=this.proj.toWorld(Xe({type:"Polygon",coordinates:[t.scarRing]}));else{const u=(h=this.app.tour)==null?void 0:h.places.get(t.volcano);u&&(n=this.proj.toWorld(Xe(u.geometry)))}const s=this.proj.toWorld(Xe({type:"Polygon",coordinates:[t.ring]}));n||(n=s);let i=s[0]-n[0],a=s[1]-n[1];const r=Math.hypot(i,a)||1;i/=r,a/=r;let c=0,l=0;for(const[u,f]of e)c=Math.max(c,(u-n[0])*i+(f-n[1])*a),l=Math.max(l,Math.abs(-(u-n[0])*a+(f-n[1])*i));return{o:n,d:[i,a],len:c,wide:l}}playSlide(t,{delay:e=0,prev:n=null}={}){const s=this.slideOf(t,n);if(!s)return!1;const{id:i,from:a,to:r}=s;this.load(a),this.load(r);const c=this.fieldAxis(this.geo.fields.get(i));this.slide={id:i,from:a,to:r,t:-Math.max(0,e),ax:c,step:t.id},this.keys={from:r,fromAge:t.age,to:r,toAge:t.age};const l=this.uniforms;return l.uSlideAxis.value.set(c.o[0],c.o[1],c.d[0],c.d[1]),l.uSlide.value.set(c.len,c.wide,0,0),!0}slideOf(t,e=null){const n=((t==null?void 0:t.landslides)||[]).filter(r=>this.geo.fields.has(r)),s=t==null?void 0:t.stage;if(!n.length||!this.stages.has(s))return null;const i=n.find(r=>!((e==null?void 0:e.landslides)||[]).includes(r))||n[0];let a=s;return t.from&&this.stages.has(t.from)?a=t.from:this.geo.fields.get(i).scarRing&&(e!=null&&e.stage)&&e.stage!==s&&this.stages.has(e.stage)&&(a=e.stage),{id:i,from:a,to:s,fresh:n.some(r=>!((e==null?void 0:e.landslides)||[]).includes(r))}}canSlide(t){return!!this.slideOf(t)}settle(){this.want&&this.mesh?this.k=1:this.want||(this.k=0),this.update(0)}finishSlide(){this.slide&&(this.slide.t=No),this.update(0)}update(t){var d;const e=this.want&&!!this.mesh,n=1-Math.exp(-t*2.2);if(this.k+=((e?1:0)-this.k)*n,Math.abs((e?1:0)-this.k)<.004&&(this.k=e?1:0),!this.want&&this.k<=0){(this.mesh||this.sfTex)&&this.release();return}if(!this.mesh)return;const s=this.app.geoClock.age,i=this.uniforms,a=this.slide;if(!(a&&(!this.ready(a.from)||!this.ready(a.to))))if(a){a.t=Math.min(No,a.t+t);const m=Math.max(0,a.t)/No;i.uSlide.value.z=ar(.08,.92,m),i.uSlide.value.w=a.t>0?ar(.02,.15,m)*(1-ar(.82,1,m)):0,a.t>=No&&(i.uSlide.value.set(a.ax.len,a.ax.wide,1,0),this.slide=null,this.slides=(this.slides||0)+1)}else i.uSlide.value.set(1,1,1,0);const r=this.pair(s);this.load(r.a),this.load(r.b);let c=r.a,l=r.b,h=r.mix;this.ready(l)||(l=c,h=0),this.ready(c)||(c=this.ready(l)?l:((d=this.drawn)==null?void 0:d.a)??"present",this.ready(c)||(c="present"),this.ready(l)||(l=c),c===l&&(h=0)),this.ready(c)&&this.ready(l)&&(i.uStageA.value=this.texFor(c,l),i.uStageB.value=this.texFor(l,c),i.uStageMix.value=c===l?0:h,this.drawn={a:c,b:l,mix:i.uStageMix.value});const[u,f]=wr(this.geo.hotspot,s);i.uDrift.value.set(u,f),i.uClear.value=this.k,i.uFieldK.value+=((this.lit.length?1:0)-i.uFieldK.value)*(1-Math.exp(-t*3)),t||(i.uFieldK.value=this.lit.length?1:0),this.group.visible=!0,this.updateMarks(u,f)}updateMarks(t,e){if(!this.marks.length)return;const n=this.app.camera,s=this._v||(this._v=new W),i=innerWidth,a=innerHeight,r=this.slide,c=this.uniforms.uVert.value;for(const l of this.marks){const h=l.x+t,u=l.z+e;let f=this.k>.5&&this.uniforms.uFieldK.value>.5;if(r&&r.id===l.field){const x=((l.x-r.ax.o[0])*r.ax.d[0]+(l.z-r.ax.o[1])*r.ax.d[1])/Math.max(1,r.ax.len);f=f&&x<=this.uniforms.uSlide.value.z}s.set(h,this.metresAt(h,u)*c,u).project(n);const d=(s.x+1)/2*i,m=(1-s.y)/2*a;f=f&&s.z<1&&d>0&&d<i&&m>84&&m<a,f!==l.shown&&(l.shown=f,l.el.classList.toggle("show",f)),f&&(l.el.style.transform=`translate(${d.toFixed(1)}px, ${m.toFixed(1)}px)`)}}metresAt(t,e){const n=this.drawn;if(!n)return rr;const[s,i]=wr(this.geo.hotspot,this.app.geoClock.age),a=this.coarseAt(n.a,t-s,e-i),r=n.b===n.a?a:this.coarseAt(n.b,t-s,e-i);return a+(r-a)*n.mix}coarseAt(t,e,n){var u;const s=this.stages.get(t),i=s!=null&&s.seafloor?this.sfData:(u=this.cache.get(t))==null?void 0:u.data;if(!i)return rr;const a=this.sf.rect,r=(e-a.x0)/(a.x1-a.x0),c=(n-a.z0)/(a.z1-a.z0);if(r<0||c<0||r>1||c>1)return rr;const l=Math.min(i.cw-1,Math.floor(r*i.cw)),h=Math.min(i.ch-1,Math.floor(c*i.ch));return i.coarse[h*i.cw+l]}stats(){var n,s;const t=this.uniforms,e=(this.sfTex?1:0)*this.sf.W*this.sf.H*2+(this.tex?2:0)*this.sf.W*this.sf.H*2+(this.fieldTex?this.fieldCanvas.width*this.fieldCanvas.height*4:0);return{want:this.want,on:this.covers,k:+this.k.toFixed(3),seafloor:!!this.sfTex,size:[this.sf.W,this.sf.H],slots:[...this.slots],drawn:this.drawn?{...this.drawn,mix:+this.drawn.mix.toFixed(3)}:null,bound:[t.uStageA.value===this.sfTex?"seafloor":((n=this.tex)==null?void 0:n.indexOf(t.uStageA.value))??-1,t.uStageB.value===this.sfTex?"seafloor":((s=this.tex)==null?void 0:s.indexOf(t.uStageB.value))??-1],drift:[+t.uDrift.value.x.toFixed(2),+t.uDrift.value.y.toFixed(2)],lit:[...this.lit],fieldK:+t.uFieldK.value.toFixed(3),slide:this.slide?{id:this.slide.id,from:this.slide.from,to:this.slide.to,t:+this.slide.t.toFixed(2),front:+t.uSlide.value.z.toFixed(3),body:+t.uSlide.value.w.toFixed(3)}:null,marks:this.marks.filter(i=>i.shown).map(i=>i.name),cached:[...this.cache.keys()],gpuMB:+(e/1048576).toFixed(1),slides:this.slides||0,loads:this.loads,uploads:this.uploads,releases:this.releases}}}const $f=[95,135],jf=6e3,_S=30,bS=1.5,qf=[4,40],SS=2,Xf=oe,mr=(o,t,e)=>Math.hypot(Math.max(o.x0-t,0,t-o.x1),Math.max(o.z0-e,0,e-o.z1));class ES{constructor(t){this.app=t,this.group=new Te,this.group.name="towns",this.group.visible=!1,t.scene.add(this.group),this.islands=new Map,this.yearNow=t.timeline.year,this.version=0,this.hidden=!1,this.show=0,this.yieldU={uYieldRect:{value:new Yt(0,0,-1,-1)},uYield:{value:0}},this.manifest=null,t.updaters.push(e=>this.update(e))}layers(){return this.manifest??(this.manifest=fetch(this.app.data.abs("layers/manifest.json")).then(t=>{if(!t.ok)throw new Error(`layers/manifest.json: HTTP ${t.status}`);return t.json()})),this.manifest}updateYield(){var s,i;const t=this.app.districts,e=t==null?void 0:t.cur,n=this.yieldU;if(t!=null&&t.on&&((i=(s=e==null?void 0:e.features)==null?void 0:s.settlements)!=null&&i.ready)){const a=e.d.rect;n.uYieldRect.value.set(a.x0+vi,a.z0+vi,a.x1-vi,a.z1-vi),n.uYield.value=t.k}else n.uYieldRect.value.set(0,0,-1,-1),n.uYield.value=0}update(t,e=Ot((this.app.frameAvg??16)*.25,qf[0],qf[1])){const n=this.app,s=n.timeline.year;t>0?(this.yearNow+=(s-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(s-this.yearNow)<.05&&(this.yearNow=s)):this.yearNow=s;const i=n.rig.state.distance;let a=1-Xf($f[0],$f[1],i);(this.hidden||!n.islandsLoaded)&&(a=0),this.show=a,this.group.visible=a>.001,this.updateYield();const r=performance.now();if(this.group.visible){const c=n.rig.state.target,l=Gp(i);this.R=l;const h=performance.now();for(const u of n.world.islands){let f=this.islands.get(u.pack.id);const d=u.slot>=0?u.k:0;if(d<=.02||mr(u.pack.rect,c.x,c.z)>l){f&&f.hide();continue}f||(f=new ao(this,u),this.islands.set(u.pack.id,f)),f.lastSeen=r,f.update(c,l,a*Xf(.6,.95,d),Math.max(.5,e-(performance.now()-h)))}}else for(const c of this.islands.values())c.hide();for(const[c,l]of this.islands)this.hidden?l.lastSeen=Math.max(l.lastSeen,r):r-l.lastSeen>_S*1e3&&(l.dispose(),this.islands.delete(c))}settle(){this.update(0,1/0)}get idle(){if(!this.group.visible)return!0;for(const t of this.islands.values())if(t.active&&!t.idle)return!1;return!0}stampInto(t,e,n){for(const s of this.islands.values())s.stampInto(t,e,n)}alive(t=this.yearNow,e=null,n=null,s=1/0){const i=[];for(const a of this.islands.values())i.push(...a.alive(t,e,n,s));return i}census(t=this.yearNow,e=null,n=null,s=1/0){return Vp(this.alive(t,e,n,s))}stats(){return{show:+this.show.toFixed(2),year:+this.yearNow.toFixed(1),yield:+this.yieldU.uYield.value.toFixed(2),islands:[...this.islands.values()].map(t=>t.stats()),drawn:[...this.islands.values()].reduce((t,e)=>t+e.drawn,0)}}}class ao extends Op{constructor(t,e){super(t.app),this.towns=t,this.t=e,this.id=e.pack.id,this.group=new Te,this.group.name=`towns ${this.id}`,this.group.visible=!1,t.group.add(this.group),this.tiles=new Map,this.ready=!1,this.failed=null,this.active=!1,this.drawn=0,this.pending=0,this.lastSeen=performance.now(),this.times={build:0,tiles:0},this.load().catch(n=>{this.failed=n.message,this.app.warn(`towns ${this.id}: ${n.message} (its settlements are not drawn)`)})}async load(){var v,w,b,y,S,E,T,_,M;const t=performance.now(),e=this.app,n=await this.towns.layers(),s=(v=n.islands)==null?void 0:v[this.id];if(!s)throw new Error("no settlement layer");this.setLayers(n);const i=this.layerFiles(s);if(this.keyframes.length<2||i.some(A=>!A.settlement))throw new Error("the settlement layer lacks a keyframe");const a=A=>go(On,e.data.abs(`layers/${A}`)),[r,c,l,h,u]=await Promise.all([Promise.all(i.map(A=>a(A.settlement))),i.every(A=>A.value)?Promise.all(i.map(A=>a(A.value))).catch(()=>null):null,Np(e,n,this.id),((w=e.patches)==null?void 0:w.ready)??[],((b=e.works)==null?void 0:b.exclusion(this.id))??null]);if(this.disposed)return;const f=this.t,{W:d,H:m}=f;for(const A of[...r,...c||[]])if(A.W!==d||A.H!==m)throw new Error(`a layer is ${A.W}×${A.H}, the pack ${d}×${m}`);const x=f.pack.rect;this.rect=x,this.islandRect=x,this.crop={x0:x.x0,z0:x.z0,sx:(x.x1-x.x0)/d,sz:(x.z1-x.z0)/m,w:d,h:m},this.bytes=r.map(A=>A.px),this.values=c?c.map(A=>A.px):null,this.zoning={...l,rect:x},this.places=Wp(e,n),this.works=u,this.townTerm(n,this.id,"district"),this.needPatches=(h||[]).some(A=>A.pack===this.id),this.features=[];for(const A of((y=e.districts)==null?void 0:y.list)||[])if(A.parent===this.id)for(const{f:R}of A.rastered){const k=(((E=(S=R.geometry)==null?void 0:S.coordinates)==null?void 0:E[0])||[]).map(I=>e.data.proj.toWorld(I));if(k.length<3)continue;const C=k.map(I=>I[0]),z=k.map(I=>I[1]);this.features.push({ring:k,p:R.properties||{},box:[Math.min(...C),Math.min(...z),Math.max(...C),Math.max(...z)]})}if(await new Promise(A=>setTimeout(A,0)),this.disposed||(this.grounds(),await new Promise(A=>setTimeout(A,0)),this.disposed))return;const g=new Set;for(const A of((_=(T=e.patches)==null?void 0:T.byPack)==null?void 0:_.get(this.id))||[])g.add(A.until);for(const A of h||[])A.pack===this.id&&g.add(A.until);for(const A of this.features){const[R,k]=Ks(A.p);Number.isFinite(R)&&g.add(R),Number.isFinite(k)&&g.add(k+1)}for(const A of((M=this.works)==null?void 0:M.breaks)||[])g.add(A);this.years(g);const p=e.timeline.yearAt(0);this.epochYear=[p,...this.edges],this.kits=Lp(Ai(1820),Jl),this.meshes(),this.salt=1+e.world.islandPacks.findIndex(A=>A.id===this.id),this.loadMs=Math.round(performance.now()-t),this.ready=!0}grounds(){const t=this.t,{W:e,H:n}=t,s=this.rect,i=(s.x1-s.x0)*100/e,a=(s.z1-s.z0)*100/n;this.mx=i,this.mz=a;const r=t.heights,c=vn(e,n,g=>r[g]<=0,i,a);this.sea=c,this.broad=jn(Float32Array.from(c,g=>Math.min(g,3e3)),e,n,Math.max(1,Math.round(290/i)),3);const l=wd(r,e,n,i,a),h=new Uint8Array(e*n);for(let g=0;g<e*n;g++)h[g]=l[g]>=SS&&r[g]>0?1:0;this.streamOn=h,this.toStream=vn(e,n,g=>h[g]===1,i,a);const u=Math.ceil((s.x1-s.x0)/Vt),f=Math.ceil((s.z1-s.z0)/Vt);this.tw=u,this.th=f;const d=new Float32Array(u*f),m=this.zoning;for(let g=0;g<n;g++){const p=Math.min(f-1,Math.floor((g+.5)*this.crop.sz/Vt));for(let v=0;v<e;v++){const w=g*e+v;if(r[w]<=0)continue;const b=Math.min(u-1,Math.floor((v+.5)*this.crop.sx/Vt));let y=0;for(const E of this.bytes)y=Math.max(y,E[w]);if(m.zoning){const E=s.x0+(v+.5)*this.crop.sx,T=s.z0+(g+.5)*this.crop.sz;Ur[Ko(m.zoning,s,E,T)]&&(y=255)}const S=p*u+b;y>d[S]&&(d[S]=y)}}const x=d.slice();for(let g=0;g<f;g++)for(let p=0;p<u;p++)for(let v=-1;v<=1;v++)for(let w=-1;w<=1;w++){const b=p+w,y=g+v;b>=0&&y>=0&&b<u&&y<f&&(x[g*u+p]=Math.max(x[g*u+p],d[y*u+b]-20))}this.most=x,this.ths=new Map}grid(t,e,n){const s=this.crop,i=Ot(Math.floor((e-s.x0)/s.sx),0,s.w-1),a=Ot(Math.floor((n-s.z0)/s.sz),0,s.h-1);return t[a*s.w+i]}mauka(t,e){const n=e*this.tw+t;let s=this.ths.get(n);if(s!==void 0)return s;const i=this.rect.x0+(t+.5)*Vt,a=this.rect.z0+(e+.5)*Vt,r=this.crop,c=this.broad,l=(g,p)=>c[Ot(p,0,r.h-1)*r.w+Ot(g,0,r.w-1)],h=Math.round((i-r.x0)/r.sx-.5),u=Math.round((a-r.z0)/r.sz-.5),f=Math.max(2,Math.round(240/this.mx)),d=l(h+f,u)-l(h-f,u),m=l(h,u+f)-l(h,u-f),x=Math.PI/60;return s=Math.hypot(d,m)<.001?Math.PI/2:Math.round(Math.atan2(m,d)/x)*x,this.ths.set(n,s),s}owns(t,e){const n=i=>Math.min(t-i.x0,i.x1-t,e-i.z0,i.z1-e),s=n(this.rect);for(const i of this.app.world.islandPacks)if(i.id!==this.id&&n(i.rect)>s)return!1;return s>0}weight(t,e){const n=this.t,s=this.crop.sx,i=this.crop.sz,a=Math.hypot((n.metresAt(t+s,e)-n.metresAt(t-s,e))/(2*this.mx),(n.metresAt(t,e+i)-n.metresAt(t,e-i))/(2*this.mz));return(.55+.8*Math.max(Math.exp(-this.grid(this.sea,t,e)/700),Math.exp(-this.grid(this.toStream,t,e)/160)))*(1-.6*oe(.08,.35,a))}allows(t,e,n){const{x:s,z:i,ax:a,az:r,a:c}=t,l=this.epochYear[n],h=this.t,u=Math.cos(c),f=-Math.sin(c),d=[u,f],m=[-f,u];let x=1/0,g=-1/0,p=-1/0;if(this.dep=!1,this.works){const y=this.works.test(s,i,a,r,c,l);if(y&&(this.dep=!0),y===2)return null}const v=this.patchBoxes,w=this.featBox,b=this.patchBox;for(let y=0;y<13;y++){const S=y===0?0:y<5?[-1,1,1,-1][y-1]:y<9?[0,1,0,-1][y-5]:[-1,1,1,-1][y-9],E=y===0?0:y<5?[-1,-1,1,1][y-1]:y<9?[-1,0,1,0][y-5]:[-1,-1,1,1][y-9],T=y>=9?1.25:1,_=s+(d[0]*S*a+m[0]*E*r)*T,M=i+(d[1]*S*a+m[1]*E*r)*T;if(_>=w[0]&&M>=w[1]&&_<=w[2]&&M<=w[3])for(const k of this.features){const C=k.box;if(!(_<C[0]||M<C[1]||_>C[2]||M>C[3])&&Up(k.ring,_,M)&&(this.dep=!0,Yr(k.p,l)))return null}if(y>=9)continue;if(this.grid(this.streamOn,_,M))return null;const A=h.metresAt(_,M);let R=A;if(_>=b[0]&&M>=b[1]&&_<=b[2]&&M<=b[3])for(const k of v){const C=k.box;if(!(_<C[0]||M<C[1]||_>C[2]||M>C[3])&&!(this.app.patches.maskAt(k.crop,(_-C[0])/(C[2]-C[0]),(M-C[1])/(C[3]-C[1]))<=0)){this.dep=!0,R=Bp(this.app,h,_,M,l);break}}if(R<.6)return null;x=Math.min(x,A),g=Math.max(g,A),p=Math.max(p,R)}return g-x>e?null:p}buildTile(t,e){var E;const n=performance.now(),s=this.rect,i=s.x0+t*Vt,a=s.z0+e*Vt,r={ti:t,tj:e,n:0,x0:i,z0:a},c=`${t},${e}`;if(this.tiles.set(c,r),this.most[e*this.tw+t]<1)return r.empty=!0,r;const l=this.mauka(t,e),h=(T,_)=>T<0||_<0||T>=this.tw||_>=this.th?NaN:this.mauka(T,_),u=[h(t-1,e)!==l,h(t+1,e)!==l,h(t,e-1)!==l,h(t,e+1)!==l],f=this.salt*1000003+e*4099+t|0,d=new Float32Array(this.keyframes.length),m=new Float32Array(this.keyframes.length),x=this.zoning,g=(T,_)=>this.owns(T,_)&&this.t.metresAt(T,_)>.3,p=[];for(const T of this.tileLots(i,a,l,f,u,g)){this.bytesAt(T.x,T.z,d);let _=0;for(const C of d)_=Math.max(_,C);T.zone=Ko(x.zoning,x.rect,T.x,T.z),T.lud=Ko(x.lud,x.rect,T.x,T.z),T.zoned=!!x.zoning;const M=Ur[T.zone];M&&(_=Math.max(_,255*Math.log(1+M/this.d0)/this.L+5));const A=this.fillMax(this.people(_));if(T.rank>=A*1.5&&!(T.anchor&&T.rankY<A*1.5)||(T.w=this.weight(T.x,T.z)*(.85+.3*Nr(T.x/2.3,T.z/2.3,73)),T.rank>=A*T.w&&!(T.anchor&&T.rankY<A*T.w)))continue;T.b=Float32Array.from(d),this.values&&(T.vb=Float32Array.from(this.sample(this.values,T.x,T.z,m,0)));const R=Math.exp(-this.grid(this.sea,T.x,T.z)/600),k=Hp(this.places,T.x,T.z,R);T.coast=R,T.harbour=k.harbour,T.centre=k.centre,p.push(T)}const v=[],w=(T,_,M)=>this.allows(T,_,M),b=()=>1,y=T=>v.push(T);for(const T of p)this.scatterLot(T,w,b,y);const S=v.length;if(r.n=S,r.lots=p.length,S){const T=Ai(f),_=Int32Array.from({length:S},(M,A)=>A);for(let M=S-1;M>0;M--){const A=Math.floor(T()*(M+1)),R=_[M];_[M]=_[A],_[A]=R}r.order=_,r.pos=new Float32Array(S*4),r.scale=new Float32Array(S*3),r.spans=new Float32Array(S*4),r.cols=new Float32Array(S*3),r.vOf=new Uint16Array(S),r.kind=new Uint8Array(S),r.site=new Int32Array(S),v.forEach((M,A)=>{r.pos.set([M.x,M.y,M.z,M.a],A*4),r.scale.set([M.sh,M.sv,M.stretch],A*3),r.spans.set(M.span,A*4),r.cols.set(M.colour,A*3),r.vOf[A]=this.byKey.get(M.kind*16+M.variant),r.kind[A]=M.kind,r.site[A]=M.site})}for(const T of((E=this.app.districts)==null?void 0:E.list)||[])mr(T.rect,i+Vt/2,a+Vt/2)<Vt&&this.towns.version++;return this.times.tiles++,this.times.build+=performance.now()-n,r}update(t,e,n,s){var p,v,w,b;if(this.active=!0,this.show=n,!this.ready){this.pending=1;return}if(this.needPatches&&!((p=this.app.patches)!=null&&p.loaded)){this.pending=1;return}this.patchBoxes||(this.patchBoxes=((w=(v=this.app.patches)==null?void 0:v.byPack)==null?void 0:w.get(this.id))||[],this.patchBox=this.patchBoxes.reduce((y,S)=>[Math.min(y[0],S.box[0]),Math.min(y[1],S.box[1]),Math.max(y[2],S.box[2]),Math.max(y[3],S.box[3])],[1/0,1/0,-1/0,-1/0]),this.featBox=this.features.reduce((y,S)=>[Math.min(y[0],S.box[0]),Math.min(y[1],S.box[1]),Math.max(y[2],S.box[2]),Math.max(y[3],S.box[3])],[1/0,1/0,-1/0,-1/0]));const i=this.rect,a=Ot(Math.floor((t.x-e-i.x0)/Vt),0,this.tw-1),r=Ot(Math.floor((t.x+e-i.x0)/Vt),0,this.tw-1),c=Ot(Math.floor((t.z-e-i.z0)/Vt),0,this.th-1),l=Ot(Math.floor((t.z+e-i.z0)/Vt),0,this.th-1),h=[],u=this.towns.yieldU,f=u.uYieldRect.value,d=u.uYield.value>=.999;for(let y=c;y<=l;y++)for(let S=a;S<=r;S++){if(this.tiles.has(`${S},${y}`))continue;const E=i.x0+(S+.5)*Vt,T=i.z0+(y+.5)*Vt;if(d&&E-Vt/2>f.x&&T-Vt/2>f.y&&E+Vt/2<f.z&&T+Vt/2<f.w)continue;const _=Math.hypot(E-t.x,T-t.z);_>e+Vt||h.push([_,S,y])}h.sort((y,S)=>y[0]-S[0]);const m=performance.now();let x=0;for(const[,y,S]of h){if(x&&performance.now()-m>s)break;this.buildTile(y,S),x++}this.pending=h.length-x;const g=e*bS+Vt;for(const[y,S]of this.tiles){const E=S.x0+Vt/2,T=S.z0+Vt/2;if(!(Math.hypot(E-t.x,T-t.z)<=g)&&(this.tiles.delete(y),S.n))for(const _ of((b=this.app.districts)==null?void 0:b.list)||[])mr(_.rect,E,T)<Vt&&this.towns.version++}this.group.visible=n>.001,this.group.visible&&(this.material.uniforms.uShow.value=n,this.material.uniforms.uYearNow.value=this.towns.yearNow,this.material.uniforms.uFadeNear.value=e*.75,this.material.uniforms.uFadeFar.value=e,this.refresh(this.app.camera,e,this.t.pack.data.hi*this.app.world.uniforms.uVert.value+3,x>0))}get idle(){return!!(this.ready||this.failed)&&!this.pending}hide(){this.active=!1,this.group.visible=!1,this.drawn=0,this.key=""}meshes(){this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new Yt(0,0,0,0))},uShadeS:{value:this.t.shadow.texture},uShadeRect:{value:this.t.rect},uYearNow:{value:this.towns.yearNow},...this.towns.yieldU},this.material=Si(this.app.shared,this.own,{fade:[50,70],grow:!0,yield:!0}),this.variants=[],this.byKey=new Map;for(const t of os)this.kits[t].forEach((e,n)=>{this.byKey.set(zt[t]*16+n,this.variants.length),this.variants.push({name:t,v:n,kit:e,cap:0,mesh:null})});this.frustum=new Is,this.pv=new ne,this.box=new yn,this.m4=new ne,this.q=new hs,this.up=new W(0,1,0),this.v3=new W,this.s3=new W,this.key="",this.yearDrawn=NaN}room(t,e){if(t.cap>=e&&t.mesh)return;const n=Math.min(jf,Math.max(64,t.cap*2,e));t.mesh&&(this.group.remove(t.mesh),t.mesh.dispose());const s=t.kit.geometry,i=new ha(s,this.material,n);i.name=`${t.name}-${t.v}`,i.count=0,i.frustumCulled=!1,i.instanceMatrix.setUsage(an),i.instanceColor=new he(new Float32Array(n*3),3),i.instanceColor.setUsage(an);const a=new he(new Float32Array(n*4),4);a.setUsage(an);const r=new he(new Float32Array(n),1);r.setUsage(an),s.setAttribute("aSpan",a),s.setAttribute("aStretch",r),Object.assign(t,{mesh:i,cap:n,aSpan:a,aStretch:r}),this.group.add(i)}static aliveNear(t,e,n){const s=t.spans;return s[e*4]<n+1&&s[e*4+3]>n-1}refresh(t,e,n,s){const i=this.towns.yearNow,a=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const r=e*.7,c=[],l=this.towns.yieldU,h=l.uYieldRect.value,u=l.uYield.value>=.999;let f="";for(const S of this.tiles.values()){if(!S.n)continue;this.box.min.set(S.x0,-.5,S.z0),this.box.max.set(S.x0+Vt,n,S.z0+Vt);const E=this.box.distanceToPoint(a);if(E>e||!this.frustum.intersectsBox(this.box)||u&&S.x0>h.x&&S.z0>h.y&&S.x0+Vt<h.z&&S.z0+Vt<h.w)continue;const T=E<r?1:r/E;c.push([S,Math.round(T*20)]),f+=`${S.ti},${S.tj}:${c[c.length-1][1]};`}const d=this.app.districts,m=!!(d!=null&&d.on);if(f+=`${u?1:0}${m?1:0}`,!s&&f===this.key&&Math.abs(i-this.yearDrawn)<.5)return;this.key=f,this.yearDrawn=i;let x=0;const g=[];for(const[S,E]of c){let T=0;for(let _=0;_<S.n;_++)ao.aliveNear(S,_,i)&&T++;g.push(T),x+=Math.ceil(T*E/20)}const p=Math.min(1,jf/Math.max(1,x)),v=new Int32Array(this.variants.length),w=[];c.forEach(([S,E],T)=>{const _=Math.ceil(g[T]*E*p/20);let M=0;for(let A=0;A<S.n&&M<_;A++){const R=S.order[A];ao.aliveNear(S,R,i)&&(u&&S.pos[R*4]>h.x&&S.pos[R*4+2]>h.y&&S.pos[R*4]<h.z&&S.pos[R*4+2]<h.w||(w.push(S,R),v[S.vOf[R]]++,M++))}}),this.variants.forEach((S,E)=>{v[E]&&this.room(S,v[E]),S.c=0});const b=m?d.cur.d.rect:null,y=this.app.world;for(let S=0;S<w.length;S+=2){const E=w[S],T=w[S+1],_=this.variants[E.vOf[T]];if(_.c>=_.cap)continue;const M=_.c++;let A=E.pos[T*4+1];const R=E.pos[T*4],k=E.pos[T*4+2];if(b&&R>b.x0&&k>b.z0&&R<b.x1&&k<b.z1){const C=_.kit,z=E.scale[T*3];let I=-1/0;for(const[O,U]of[[0,0],[-1,-1],[1,-1],[1,1],[-1,1]])I=Math.max(I,y.metresAt(R+O*C.hx*z,k+U*C.hz*z));A=Math.max(A,Yn(I)+Zl)}this.q.setFromAxisAngle(this.up,E.pos[T*4+3]),this.v3.set(R,A,k),this.s3.set(E.scale[T*3],E.scale[T*3+1],E.scale[T*3]),this.m4.compose(this.v3,this.q,this.s3),this.m4.toArray(_.mesh.instanceMatrix.array,M*16),_.mesh.instanceColor.array.set(E.cols.subarray(T*3,T*3+3),M*3),_.aSpan.array.set(E.spans.subarray(T*4,T*4+4),M*4),_.aStretch.array[M]=E.scale[T*3+2]}this.drawn=0;for(const S of this.variants)S.mesh&&(S.mesh.count=S.c,S.mesh.visible=S.c>0,S.mesh.instanceMatrix.needsUpdate=!0,S.mesh.instanceColor.needsUpdate=!0,S.aSpan.needsUpdate=!0,S.aStretch.needsUpdate=!0,this.drawn+=S.c)}static weightAt(t,e,n){const s=t.spans;return oe(s[e*4],s[e*4+1],n)*(1-oe(s[e*4+2],s[e*4+3],n))}stampInto(t,e,n){if(this.ready){for(const s of this.tiles.values())if(!(!s.n||s.x0>t.x1||s.z0>t.z1||s.x0+Vt<t.x0||s.z0+Vt<t.z0))for(let i=0;i<s.n;i++){const a=s.pos[i*4],r=s.pos[i*4+2];if(Math.min(a-t.x0,t.x1-a,r-t.z0,t.z1-r)>vi)continue;const c=ao.weightAt(s,i,e);if(c<.02)continue;const l=this.variants[s.vOf[i]].kit,h=s.scale[i*3];n(a,r,s.pos[i*4+3],l.hx*h*.95,l.hz*h*.95,Math.round(255*c))}}}alive(t,e=null,n=null,s=1/0){const i=[];if(!this.ready)return i;for(const a of this.tiles.values())if(a.n&&!(e!==null&&mr({x0:a.x0,z0:a.z0,x1:a.x0+Vt,z1:a.z0+Vt},e,n)>s))for(let r=0;r<a.n;r++){if(ao.weightAt(a,r,t)<.999)continue;const c=a.pos[r*4],l=a.pos[r*4+2];if(e!==null&&Math.hypot(c-e,l-n)>s)continue;const h=this.variants[a.vOf[r]],u=a.scale[r*3];i.push({island:this.id,site:a.site[r]+a.ti*1e5+a.tj*1e9,kind:h.name,variant:h.v,x:c,z:l,a:a.pos[r*4+3],ax:h.kit.hx*u,az:h.kit.hz*u,box:h.kit.box.map(f=>f*u),y:a.pos[r*4+1],height:h.kit.top*a.scale[r*3+1]})}return i}stats(){var i;let t=0,e=0,n=0,s=0;for(const a of this.tiles.values()){t+=a.n,e+=a.lots||0,a.empty||s++;for(const r of["order","pos","scale","spans","cols","vOf","kind","site"])n+=((i=a[r])==null?void 0:i.byteLength)||0}if(this.ready)for(const a of[this.sea,this.broad,this.toStream,this.streamOn,this.most,...this.bytes])n+=a.byteLength;return{island:this.id,ready:this.ready,failed:this.failed,tiles:this.tiles.size,worked:s,pending:this.pending,lots:e,instances:t,drawn:this.drawn,triangles:(this.variants||[]).reduce((a,r)=>a+(r.mesh?r.mesh.count*r.kit.tris:0),0),zoning:this.zoning?{zoning:this.zoning.zoning?`${this.zoning.zoning.W}×${this.zoning.zoning.H}`:null,lud:this.zoning.lud?`${this.zoning.lud.W}×${this.zoning.lud.H}`:null}:null,value:this.values?"mask":"modelled",towns:this.townTerms??null,loadMs:this.loadMs??null,buildMs:Math.round(this.times.build),msPerTile:this.times.tiles?+(this.times.build/this.times.tiles).toFixed(2):null,cpuMB:+(n/1048576).toFixed(1)}}dispose(){var t,e;this.disposed=!0,this.towns.group.remove(this.group);for(const n of this.variants||[])(t=n.mesh)==null||t.dispose(),n.kit.geometry.dispose();(e=this.material)==null||e.dispose(),this.tiles.clear()}}const Yf=30,Kf=[150,230],AS=[160,240],Zf=[95,150],TS=280,Jf=o=>o<TS?Math.max(60,o*4):0,Xc=_l,Qf=[[0,0],[-1,-1],[1,-1],[1,1],[-1,1],[0,-1],[1,0],[0,1],[-1,0]],CS=3.5,gr=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)},RS=o=>.5+.5*gr(45,140,o),qs=o=>new Ht(o).toArray(),LS=[qs("#a65a49"),qs("#a65a49"),qs("#b9bdbd")],PS=[.42,.26,.4],kS=qs("#e09a7c"),DS={runway:{mode:"paved",colour:qs("#aaa69c"),minPx:1.3,lift:.006,alpha:.95,marks:!0},road:{mode:"paved",colour:qs("#6e6a64"),minPx:1,lift:.005,alpha:.85},stone:{mode:"stone",colour:qs("#958b80"),minPx:1.1,lift:.012,alpha:.95},rail:{mode:"rail",colour:qs("#2a2522"),minPx:1.6,lift:.007,alpha:.9}},zS=`
${Ne}
${Ye}
${Fs}
in vec4 aSpan;
in float aTone;
uniform vec3 uCamPos;
uniform float uYearNow;
out float vW;
out float vTone;
out float vGround;
out vec3 vWorld;
void main() {
  // (a polygon's vertices share its years: one not standing is not drawn at all)
  float w = smoothstep(aSpan.x, aSpan.y, uYearNow) * (1.0 - smoothstep(aSpan.z, aSpan.w, uYearNow));
  vW = w;
  vTone = aTone;
  if (w <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec2 xz = position.xz;
  float g = groundMetres(xz);
  vGround = g;
  vec3 p = vec3(xz.x, max(g, 0.0) * uVert, xz.y);
  vWorld = p;
  // The ground under a cell of the wash is drawn finer than its corners
  // sample it; drawn a little toward the eye (as the ribbons are), the wash
  // keeps over the ridges between them, and on the screen it doesn't move.
  vec3 toCam = uCamPos - p;
  float dc = length(toCam);
  p += toCam / max(dc, 1e-3) * min(dc * 0.015, 3.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`,IS=`
${Ne}
${Mo}
${Ye}
${Qs}
uniform vec3 uTone[3];
uniform vec3 uToneA;
uniform float uAlpha;
uniform float uHatch;   // world units between a range's hatch lines
in float vW;
in float vTone;
in float vGround;
in vec3 vWorld;
void main() {
  int t = int(vTone + 0.5);
  // (military land may be water, as Pearl Harbor's lochs are; a range and a field keep to the land)
  float a = vW * uAlpha * uToneA[t] * (t == 0 ? 1.0 : smoothstep(-1.5, 0.5, vGround));
  if (t == 1) {
    // a range: hatched, the lines averaged out once they are finer than a few pixels
    float u = (vWorld.x - vWorld.z) / uHatch;
    float f = abs(fract(u) - 0.5) * 2.0;
    float aa = 1.0 - smoothstep(0.25, 0.6, fwidth(u));
    a *= mix(1.0, 0.45 + 1.4 * (1.0 - smoothstep(0.55, 0.75, f)), aa);
  }
  if (a <= 0.003) discard;
  vec3 col = uTone[t] * (uSunColor * max(uSunDir.y, 0.0) * 0.75 + uSkyColor * 0.9);
  gl_FragColor = vec4(col, a);
}
`,FS=`
${Ne}
${Ye}
${Fs}
in vec4 aSeg;   // the segment's ends: ax, az, bx, bz
in vec2 aS;     // the distance along its ring at each end (world units)
in vec4 aSpan;
uniform vec2 uResolution;
uniform float uWidth;
uniform vec3 uCamPos;
uniform float uYearNow;
out float vS;
out float vW;
vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += 0.015 + distance(uCamPos, p) * 0.0022;
  return p;
}
void main() {
  float w = smoothstep(aSpan.x, aSpan.y, uYearNow) * (1.0 - smoothstep(aSpan.z, aSpan.w, uYearNow));
  vW = w;
  if (w <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec3 A = draped(aSeg.xy);
  vec3 B = draped(aSeg.zw);
  mat4 pv = projectionMatrix * viewMatrix;
  vec4 ca = pv * vec4(A, 1.0);
  vec4 cb = pv * vec4(B, 1.0);
  const float W0 = 1e-3;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  if (ca.w < W0) ca = mix(ca, cb, (W0 - ca.w) / (cb.w - ca.w));
  if (cb.w < W0) cb = mix(cb, ca, (W0 - cb.w) / (ca.w - cb.w));
  vec2 sa = ca.xy / ca.w;
  vec2 sb = cb.xy / cb.w;
  vec2 d = (sb - sa) * uResolution;
  float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  vec4 c = atB ? cb : ca;
  vec2 off = (nrm * position.y + dir * (atB ? 0.5 : -0.5)) * uWidth / uResolution;
  c.xy += off * c.w;
  gl_Position = c;
  vS = atB ? aS.y : aS.x;
}
`,US=`
uniform vec3 uColor;
uniform float uOpacity;
uniform float uDash;     // world units a dash and its gap take
uniform float uDashMix;  // toward the dashes twice as long, as the camera pulls back
in float vS;
in float vW;
void main() {
  float d = mix(step(fract(vS / uDash), 0.58), step(fract(vS / (2.0 * uDash)), 0.58), uDashMix);
  float a = uOpacity * vW * d;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}
`,NS=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);class OS{constructor(t){this.app=t,this.group=new Te,this.group.name="works",t.scene.add(this.group),this.islands=new Map,this.entries=new Map,this.yearNow=t.timeline.year,this.yearU={value:this.yearNow},this.hidden=!1,this.tint=!1,this.available=null,this.base=t.params.get("works")||null,this.jobs=new Map,this.jobN=0,t.updaters.push(e=>this.update(e))}setBase(t){var e;for(const n of this.islands.values())(e=n.view)==null||e.dispose();this.islands.clear(),this.entries.clear(),this._files=null,this.available=null,this.base=t}url(t){if(!this.base)return this.app.data.abs(t);const e=this.base.endsWith("/")?this.base:`${this.base}/`;return new URL(t,new URL(e,location.href)).href}files(){return this._files??(this._files=(async()=>{const t=this.url("works/manifest.json");try{const e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);const n=await e.json();this.manifest=n;const s=new Map;for(const i of n.files||[])s.set(String(i).replace(/^.*\//,"").replace(/\.geojson$/,""),`works/${i}`);return this.available=s.size>0,s}catch(e){return this.available=!1,this.app.warn(`${t}: ${e.message} (no works)`),new Map}})()),this._files}entry(t){let e=this.entries.get(t);if(!e){e={id:t,out:null,excl:null,used:performance.now(),done:!1,ms:null};const n=performance.now();e.promise=this.files().then(s=>s.has(t)?this.decode(this.url(s.get(t))):null).then(s=>this.entries.get(t)!==e?null:(e.out=s,e.ms=Math.round(performance.now()-n),s)).catch(s=>(this.app.warn(`works ${t}: ${s.message}`),null)).finally(()=>{e.done=!0}),this.entries.set(t,e)}return e.used=performance.now(),e}async exclusion(t){const e=this.entry(t),n=await e.promise;return n?(e.excl??(e.excl=new G_(n.excl)),e.excl):null}decode(t){const{lat0:e,lon0:n}=this.app.data.proj;if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("works-worker-CQQyerK4.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=s=>{const i=this.jobs.get(s.data.job);i&&(this.jobs.delete(s.data.job),s.data.ok?i.resolve(s.data.out):i.reject(new Error(s.data.message)))},this.worker.onerror=s=>{var i;(i=s.preventDefault)==null||i.call(s),this.fallback=!0;for(const[a,r]of this.jobs)this.jobs.delete(a),this.mainThread(r.url).then(r.resolve,r.reject)}}catch{this.fallback=!0}return this.fallback?this.mainThread(t):new Promise((s,i)=>{const a=++this.jobN;this.jobs.set(a,{url:t,resolve:s,reject:i}),this.worker.postMessage({job:a,url:t,lat0:e,lon0:n})})}async mainThread(t){const e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);const{lat0:n,lon0:s}=this.app.data.proj;return B_(await e.json(),{lat0:n,lon0:s})}update(t){var a;const e=this.app,n=e.timeline.year;t>0?(this.yearNow+=(n-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(n-this.yearNow)<.05&&(this.yearNow=n)):this.yearNow=n,this.yearU.value=this.yearNow;const s=e.rig.state.distance,i=performance.now();for(const r of e.world.islands){const c=r.pack.id,l=r.slot>=0?r.k:0;let h=this.islands.get(c);if(l>.02){const u=this.entry(c);h||this.islands.set(c,h={id:c,t:r,view:null,lastSeen:i}),h.lastSeen=i,!h.view&&u.out&&(h.view=new BS(this,r,u.out),this.group.add(h.view.group))}h!=null&&h.view&&h.view.update(this.hidden?0:l,s)}for(const[r,c]of this.islands)i-c.lastSeen<=Yf*1e3||((a=c.view)==null||a.dispose(),this.islands.delete(r));for(const[r,c]of this.entries)!this.islands.has(r)&&c.done&&i-c.used>Yf*1e3&&this.entries.delete(r)}settle(){this.update(0)}release(){for(const t of this.islands.values())t.lastSeen=-1e9;for(const t of this.entries.values())t.used=-1e9;this.update(0)}feature(t){var e;for(const[n,s]of this.entries){const i=(e=s.out)==null?void 0:e.feats.find(a=>a.id===t);if(i)return{...i,island:n}}return null}weightOf(t,e=this.yearNow){const n=this.feature(t);return n?zr(n.span,e):null}legendRows(){const t=[];for(const e of this.islands.values()){const n=e.view;if(!(!n||n.show<.3||this.hidden)&&n.out.feats.some(s=>s.part==="land"&&zr(s.span,this.yearNow)>.5)){t.push({id:"military",name:"Military land"});break}}return t}stats(){return{available:this.available,base:this.base,year:+this.yearNow.toFixed(2),hidden:this.hidden,entries:[...this.entries.values()].map(t=>{var e,n,s;return{id:t.id,ready:!!t.out,ms:t.ms,decodeMs:((e=t.out)==null?void 0:e.ms)??null,features:((n=t.out)==null?void 0:n.feats.length)??0,counts:((s=t.out)==null?void 0:s.counts)??null}}),islands:[...this.islands.values()].map(t=>({id:t.id,drawn:!!t.view,...t.view?t.view.stats():{}}))}}}class BS{constructor(t,e,n){this.works=t,this.app=t.app,this.t=e,this.out=n,this.id=e.pack.id,this.group=new Te,this.group.name=`works ${this.id}`,this.show=0;const s=this.app,i=s.shared.uniforms,a=t.yearU;this.geometries=[],this.materials=[];const r=n.wash;if(this.washTris=r.index.length/3,r.index.length){const l=r.pos.length/2,h=new Float32Array(l*3);for(let d=0;d<l;d++)h[d*3]=r.pos[d*2],h[d*3+2]=r.pos[d*2+1];const u=new Je;u.setAttribute("position",new de(h,3)),u.setAttribute("aSpan",new de(r.span,4)),u.setAttribute("aTone",new de(r.tone,1)),u.setIndex(new de(r.index,1)),this.washU={...i,uCamPos:{value:new W},uYearNow:a,uTone:{value:LS.map(d=>new W(...d))},uToneA:{value:new W(...PS)},uAlpha:{value:0},uHatch:{value:2}};const f=new _e({vertexShader:zS,fragmentShader:IS,uniforms:this.washU,transparent:!0,depthWrite:!1,side:Un,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2});this.wash=new ge(u,f),this.wash.frustumCulled=!1,this.wash.renderOrder=2,this.group.add(this.wash),this.geometries.push(u),this.materials.push(f)}const c=n.edges;if(this.edgeCount=c.seg.length/4,this.edgeCount){const l=new yo;l.setAttribute("position",new de(NS,3)),l.setIndex([0,2,1,1,2,3]),l.setAttribute("aSeg",new he(c.seg,4)),l.setAttribute("aS",new he(c.s,2)),l.setAttribute("aSpan",new he(c.span,4)),l.instanceCount=this.edgeCount,this.edgeU={...i,uResolution:{value:new Bt(1,1)},uWidth:{value:1.6},uCamPos:{value:new W},uYearNow:a,uColor:{value:new Ht(...kS)},uOpacity:{value:0},uDash:{value:4},uDashMix:{value:0}};const h=new _e({vertexShader:FS,fragmentShader:US,uniforms:this.edgeU,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});this.edges=new ge(l,h),this.edges.frustumCulled=!1,this.edges.renderOrder=4,this.group.add(this.edges),this.geometries.push(l),this.materials.push(h)}this.ribbons=new fp(s.shared,s.camera),this.batches={};for(const l of yl){const h=n.ribbons[l];if(!(h!=null&&h.n))continue;const u=DS[l],f={mode:u.mode,colour:u.colour,alpha:0,minPx:u.minPx,lift:u.lift,order:6,marks:!!u.marks,year:a};this.batches[l]={fine:this.ribbons.addPacked(h.fine,f),coarse:this.ribbons.addPacked(h.coarse,f),look:u,n:h.n,km:h.length/10}}this.group.add(this.ribbons.group),this.buildBlocks(n.blocks),this.labels=new Sp(s,[],{items:n.labels.map(l=>({...l,cls:`dlabel wlabel wl-${l.kind}`})),alive:(l,h)=>zr(l.span,h)>.5,zoom:l=>gr(Zf[0],Zf[1],l),layer:"wlabels",avoid:".pin.show, .cluster.show",lang:""}),this._res=new Bt,this.groundKey=""}buildBlocks(t){const e=t.length/Yo;if(this.blockCount=e,this.blockMeshes=[],!e)return;const n=Ai(1941+e);this.kits=K2(n),this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new Yt(0,0,0,0))},uShadeS:{value:this.t.shadow.texture},uShadeRect:{value:this.t.rect},uYearNow:this.works.yearU},this.blockMat=Si(this.app.shared,this.own,{fade:AS,grow:!0}),this.materials.push(this.blockMat);const s=new Map;this.instances=[];for(let i=0;i<e;i++){const[a,r,c,l,h,u,f,d,m,x,g]=t.subarray(i*Yo,(i+1)*Yo),p=Ml[f-1]??null,{kind:v,storeys:w}=Ip(p,u,l*h*1e4),b=this.kits[v];let y=c,S=l,E=h;S>0&&E>0&&b.W>b.L!=E>S&&(y+=Math.PI/2,S=h,E=l);const T=v==="block"?Math.max(.25,(w||4)/4):v==="tower"?(w||12)*CS/_s:1,_=S>0?S/b.L:Xc,M=E>0?E/b.W:Xc,A={x:a,z:r,dir:y,sx:_,sy:Xc*T,sz:M,stretch:T,span:[d,m,x,g],kind:v,use:p,storeys:w,kit:b,c:.94+.12*n()};s.has(v)||s.set(v,[]),s.get(v).push(A),this.instances.push(A)}for(const[i,a]of s){const c=this.kits[i].geometry,l=new ha(c,this.blockMat,a.length);l.name=`works ${i}`,l.frustumCulled=!1,l.instanceColor=new he(new Float32Array(a.length*3),3);const h=new he(new Float32Array(a.length*4),4),u=new he(new Float32Array(a.length),1);c.setAttribute("aSpan",h),c.setAttribute("aStretch",u),a.forEach((f,d)=>{h.array.set(f.span,d*4),u.array[d]=f.stretch,l.instanceColor.array.set([f.c,f.c,f.c*.98],d*3),f.mesh=l,f.index=d}),this.blockMeshes.push(l),this.group.add(l),this.geometries.push(c)}this._m4=new ne,this._q=new hs,this._v=new W,this._s=new W,this._up=new W(0,1,0),this.placeBlocks()}placeBlocks(t){const e=this.app.world;for(const n of this.instances){if(t!==void 0&&(t<n.span[0]-1||t>n.span[3]+1))continue;const s=Math.cos(n.dir),i=Math.sin(n.dir),a=n.kit.hx*n.sx,r=n.kit.hz*n.sz;let c=0,l=1/0;for(const[u,f]of Qf){const d=Math.max(0,e.metresAt(n.x+u*a*s-f*r*i,n.z+u*a*i+f*r*s));c+=d,l=Math.min(l,d)}const h=Math.min(c/Qf.length,l+n.kit.foot*n.stretch);this._q.setFromAxisAngle(this._up,-n.dir),this._v.set(n.x,Yn(h)+Zl,n.z),this._s.set(n.sx,n.sy,n.sz),this._m4.compose(this._v,this._q,this._s),this._m4.toArray(n.mesh.instanceMatrix.array,n.index*16)}for(const n of this.blockMeshes)n.instanceMatrix.needsUpdate=!0}update(t,e){var l;const n=this.app,s=t;if(this.show=s,this.group.visible=s>.001,!this.group.visible){this.labels.update(0);return}const i=n.camera,a=this.works.tint,r=RS(e);if(this.wash&&(this.washU.uCamPos.value.copy(i.position),this.washU.uAlpha.value=s*r,this.washU.uHatch.value=2**Math.round(Math.log2(Math.max(.05,e*.012)))),this.edges){n.renderer.getDrawingBufferSize(this._res);const h=this.edgeU;h.uResolution.value.copy(this._res),h.uCamPos.value.copy(i.position),h.uWidth.value=1.7*n.renderer.getPixelRatio(),h.uOpacity.value=s*(.55+.4*r);const u=Math.log2(Math.max(.05,e*.012));h.uDash.value=2**Math.floor(u),h.uDashMix.value=u-Math.floor(u)}const c=Jf(e);for(const{fine:h,coarse:u,look:f}of Object.values(this.batches))for(const[d,m]of[[h,c>0],[u,!0]])d&&(d===h?d.uniforms.uLod.value.set(0,c):d.uniforms.uLod.value.set(c,1e9),d.uniforms.uAlpha.value=m?s*(a?1:f.alpha):0,a?d.uniforms.uColor.value.setRGB(3,0,3):d.uniforms.uColor.value.setRGB(...f.colour),d.uniforms.uMinPx.value=a?Math.max(4,f.minPx):f.minPx);if(this.ribbons.update(n.renderer),this.blockMeshes.length){const h=s*(1-gr(Kf[0],Kf[1],e));this.own.uShow.value=h;for(const u of this.blockMeshes)u.visible=h>.001;if(h>.001){const u=n.districts,f=Math.round(n.timeline.year),d=`${u!=null&&u.on?(l=u.cur)==null?void 0:l.d.id:""}:${(u!=null&&u.on?u.k:0).toFixed(2)}:${this.t.k.toFixed(2)}:${f}`;d!==this.groundKey&&(this.groundKey=d,this.placeBlocks(f))}}this.labels.update(s*(1-gr(1500,2300,e)))}stats(){const t=this.works.yearNow,e=this.out.feats.filter(i=>zr(i.span,t)>.5),n={};for(const i of e)n[`${i.kind}:${i.part}`]=(n[`${i.kind}:${i.part}`]||0)+1;let s=0;for(const i of this.geometries)for(const a of Object.values(i.attributes))s+=a.array.byteLength;for(const i of this.geometries)i.index&&(s+=i.index.array.byteLength);for(const i of Object.values(this.batches))for(const a of[i.fine,i.coarse])if(a)for(const r of Object.values(a.mesh.geometry.attributes))s+=r.array.byteLength;return{show:+this.show.toFixed(2),features:this.out.feats.length,standing:n,washTris:this.washTris,edges:this.edgeCount,ribbons:Object.fromEntries(Object.entries(this.batches).map(([i,a])=>[i,{segments:a.n,km:+a.km.toFixed(1)}])),blocks:this.blockCount,blockKinds:this.blockMeshes.length,blocksShown:this.blockMeshes.length?+this.own.uShow.value.toFixed(2):0,calls:(this.wash?1:0)+(this.edges?1:0)+Object.keys(this.batches).length+this.blockMeshes.length,fineReach:Jf(this.works.app.rig.state.distance),labels:this.labels.visible(),gpuMB:+(s/1048576).toFixed(2)}}dispose(){var t;(t=this.group.parent)==null||t.remove(this.group);for(const e of this.geometries)e.dispose();for(const e of Object.values(this.kits||{}))this.geometries.includes(e.geometry)||e.geometry.dispose();for(const e of this.materials)e.dispose();for(const e of this.blockMeshes)e.dispose();this.ribbons.dispose(),this.labels.dispose()}}const De=5,td=[80,125],ed=9e3,nd=[3,30],WS=1.5,HS=o=>Ot(o*1.5,24,36),sd=.6,qi=1e5,GS=.04,xr=["umbrella","orchard"],Yc=Object.fromEntries(xr.map((o,t)=>[o,t])),VS=(o,t,e)=>Math.hypot(Math.max(o.x0-t,0,t-o.x1),Math.max(o.z0-e,0,e-o.z1));function $S(o){return{umbrella:Tn(o,{stick:[.2,3.4,0],r0:.45,r1:.32,bark:"#5c5248",crowns:[[.2,5.4,0,6,1.9,"#4F6230",st.leaf,2,.7],[-1.8,4.8,1.4,3.4,1.4,"#596A35",st.leaf,4,.7]]}),orchard:Tn(o,{stick:[0,1.4,0],r0:.22,r1:.17,bark:"#5c5248",crowns:[[0,3.1,0,2.8,2.2,"#3F5A26",st.leaf,1,.75]]})}}class jS{constructor(t){this.app=t,this.group=new Te,this.group.name="crop trees",this.group.visible=!1,t.scene.add(this.group),this.islands=new Map,this.yearNow=t.timeline.year,this.show=0,this.hidden=!1,this.geoms=null,t.updaters.push(e=>this.update(e))}update(t,e=Ot((this.app.frameAvg??16)*.2,nd[0],nd[1])){const n=this.app,s=n.crops,i=n.timeline.year;t>0?(this.yearNow+=(i-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(i-this.yearNow)<.05&&(this.yearNow=i)):this.yearNow=i;const a=n.rig.state.distance;let r=1-oe(td[0],td[1],a);if((this.hidden||s.hidden||!s.available||!n.islandsLoaded)&&(r=0),this.show=r,this.group.visible=r>.001,!this.group.visible){for(const u of this.islands.values())u.hide();return}const c=n.rig.state.target,l=HS(a);this.R=l;const h=performance.now();for(const u of n.world.islands){const f=s.map(u.pack.id);let d=this.islands.get(u.pack.id);d&&d.map!==f&&(this.drop(u.pack.id),d=null);const m=u.slot>=0?u.k:0;if(!f||m<=.02||VS(u.pack.rect,c.x,c.z)>l){d==null||d.hide();continue}d||(this.geoms??(this.geoms=Object.fromEntries(Object.entries($S(Ai(1898))).map(([x,g])=>[x,sa(g)]))),d=new qS(this,u,f),this.islands.set(u.pack.id,d)),d.update(c,l,r*oe(.6,.95,m),Math.max(.5,e-(performance.now()-h)))}}drop(t){const e=this.islands.get(t);e&&(e.dispose(),this.islands.delete(t))}settle(){this.update(0,1/0)}get idle(){if(!this.group.visible)return!0;for(const t of this.islands.values())if(t.active&&t.pending)return!1;return!0}alive(t=this.yearNow,e=null,n=null,s=1/0){const i=[];for(const a of this.islands.values())i.push(...a.alive(t,e,n,s));return i}stats(){const t=[...this.islands.values()].map(e=>e.stats());return{show:+this.show.toFixed(2),year:+this.yearNow.toFixed(1),islands:t,drawn:t.reduce((e,n)=>e+n.drawn,0),built:t.reduce((e,n)=>e+n.built,0),refills:t.reduce((e,n)=>e+n.refills,0)}}}class qS{constructor(t,e,n){var a,r,c,l;this.mgr=t,this.app=t.app,this.t=e,this.map=n,this.id=e.pack.id,this.rect=e.pack.rect,this.group=new Te,this.group.name=`crop trees ${this.id}`,t.group.add(this.group),this.tiles=new Map,this.active=!1,this.pending=0,this.drawn=0,this.built=0,this.refills=0,this.buildMs=0,this.key="";const s=this.app.crops;this.spans=s.edges.map(([h,u])=>[Number.isFinite(h)?h:-qi,Number.isFinite(u)?u:qi]),this.has=n.has,this.features=[];for(const h of((a=this.app.districts)==null?void 0:a.list)||[])if(h.parent===this.id)for(const{f:u}of h.rastered){const f=(((c=(r=u.geometry)==null?void 0:r.coordinates)==null?void 0:c[0])||[]).map(p=>this.app.data.proj.toWorld(p));if(f.length<3)continue;const d=f.map(p=>p[0]),m=f.map(p=>p[1]),[x,g]=Ks(u.properties);this.features.push({ring:f,span:[Number.isFinite(x)?x:-qi,Number.isFinite(g)?g+1:qi],box:[Math.min(...d),Math.min(...m),Math.max(...d),Math.max(...m)]})}const i=new Set;for(const[h,u]of this.spans)for(const f of[h,u])Math.abs(f)<qi&&i.add(f);for(const h of this.features)for(const u of h.span)Math.abs(u)<qi&&i.add(u);this.edges=[...i].sort((h,u)=>h-u),this.works=this.app.works?void 0:null,(l=this.app.works)==null||l.exclusion(this.id).catch(()=>null).then(h=>{this.disposed||(this.works=h,h&&(this.edges=[...new Set([...this.edges,...[...h.breaks].map(u=>u-.5)])].sort((u,f)=>u-f)),this.tiles.clear(),this.key="")}),this.mostTrees(),this.meshes()}mostTrees(){const{W:t,H:e,bytes:n}=this.map,s=this.rect,i=Math.ceil((s.x1-s.x0)/De),a=Math.ceil((s.z1-s.z0)/De);this.tw=i,this.th=a;const r=new Uint8Array(i*a),c=(s.x1-s.x0)/t,l=(s.z1-s.z0)/e;for(let h=0;h<e;h++){const u=Math.min(a-1,Math.floor((h+.5)*l/De));for(let f=0;f<t;f++){const d=(h*t+f)*4;let m=!1;for(let x=0;x<4&&!m;x++){const g=n[d+x]>>4;m=g===ns.pasture||g===ns.orchard||g===ns.lawn}m&&(r[u*i+Math.min(i-1,Math.floor((f+.5)*c/De))]=1)}}this.anyTree=r.slice();for(let h=0;h<a;h++)for(let u=0;u<i;u++)if(r[h*i+u])for(let f=-1;f<=1;f++)for(let d=-1;d<=1;d++){const m=u+d,x=h+f;m>=0&&x>=0&&m<i&&x<a&&(this.anyTree[x*i+m]=1)}}classesAt(t,e){const{W:n,H:s,bytes:i}=this.map,a=this.rect,r=Math.floor((t-a.x0)/(a.x1-a.x0)*n),c=Math.floor((e-a.z0)/(a.z1-a.z0)*s);if(r<0||c<0||r>=n||c>=s)return null;const l=(c*n+r)*4;return[0,1,2,3].map(h=>t0(i[l+h]))}runs(t){const e=[];let n=0;for(;n<4;){if(!(t&1<<n)){n++;continue}let s=n;for(;s+1<4&&t&1<<s+1;)s++;this.spans[n]&&this.spans[s]&&e.push([this.spans[n][0],this.spans[s][1]]),n=s+1}return e}clip(t,e,n){let s=t;const i=(a,r)=>{const c=[];for(const[l,h]of s)r<=l||a>=h?c.push([l,h]):(a>l&&c.push([l,a]),r<h&&c.push([r,h]));s=c};for(const a of this.features){const r=a.box;e<r[0]||n<r[1]||e>r[2]||n>r[3]||!Up(a.ring,e,n)||i(a.span[0],a.span[1])}if(this.works)for(const[a,r]of this.works.standing(e,n,GS,zp))i(a-.5,r-.5);return s}buildTile(t,e){const n=performance.now(),s=this.rect,i=s.x0+t*De,a=s.z0+e*De,r=i+De,c=a+De,l={ti:t,tj:e,x0:i,z0:a,n:0};if(this.tiles.set(`${t},${e}`,l),this.built++,!this.anyTree[e*this.tw+t])return l;const h=this.t,u=this.has,f=[],d=(g,p,v,w,b)=>{if(!w)return;const y=h.metresAt(p,v);if(!(y<.6))for(const[S,E]of this.clip(this.runs(w),p,v))f.push({kind:g,x:p,z:v,y,a:S,b:E,seed:b})},m=$n;for(let g=Math.floor(a/Cn);g<=Math.floor((c-1e-9)/Cn);g++)for(let p=Math.floor(i/Cn);p<=Math.floor((r-1e-9)/Cn);p++){const v=Kp(p,g),w=Math.max(i,p*Cn),b=Math.max(a,g*Cn),y=Math.min(r,(p+1)*Cn),S=Math.min(c,(g+1)*Cn);let E=[1/0,1/0],T=[-1/0,-1/0];for(const[M,A]of[[w,b],[y,b],[y,S],[w,S]]){const R=M-v.ox,k=A-v.oz,C=R*v.ex+k*v.ez,z=-R*v.ez+k*v.ex;E=[Math.min(E[0],C),Math.min(E[1],z)],T=[Math.max(T[0],C),Math.max(T[1],z)]}const _=(M,A)=>M>=w&&A>=b&&M<y&&A<S;for(let M=Math.floor(E[1]/xn[1]);M<=Math.floor(T[1]/xn[1]);M++){const A=Ql(v,M);for(let R=Math.floor(E[0]/xn[0]+A);R<=Math.floor(T[0]/xn[0]+A);R++){const{cx:k,cz:C,idx:z,idz:I,pick:O}=Jp(v,R,M),U=this.classesAt(k,C);if(!U)continue;const V=as(z+9.4,I+9.4)>=Jd;let B=0,q=0,it=0;for(let ut=0;ut<4;ut++){if(!u[ut])continue;const[xt,At]=U[ut];xt===ns.pasture?B|=1<<ut:xt===ns.lawn?q|=1<<ut:xt===ns.orchard&&O<Qp(xt,At)&&(it|=1<<ut)}if(!(B|q|it))continue;const Y=[(R-A)*xn[0],M*xn[1]],nt=[(R+1-A)*xn[0],(M+1)*xn[1]],rt=(ut,xt,At,Rt)=>{if(!At)return;const[wt,kt,$]=ut;for(let le=Math.floor(Y[1]/kt);le<=Math.floor(nt[1]/kt);le++)for(let Tt=Math.floor(Y[0]/wt);Tt<=Math.floor(nt[0]/wt);Tt++){const Dt=Tt+p*997,Z=le+g*997;if($<1&&as(Dt+xt,Z+xt)>=$)continue;const lt=$<1?as(Dt+xt+3.1,Z+xt+3.1)*.6+.2:.5,ft=$<1?as(Dt+xt+5.7,Z+xt+5.7)*.6+.2:.5,P=(Tt+lt)*wt,L=(le+ft)*kt;if(P<Y[0]||L<Y[1]||P>=nt[0]||L>=nt[1])continue;const[F,H]=Zp(v,P,L);_(F,H)&&d(Rt,F,H,At,Dt*7919+Z)}};rt(m.pasture,211,B,Yc.umbrella),rt(m.lawn,307,q,Yc.umbrella),V||rt(m.orchard,0,it,Yc.orchard)}}}const x=f.length;if(l.n=x,x){const g=Ai(t*4099+e*131+17|0),p=Int32Array.from({length:x},(v,w)=>w);for(let v=x-1;v>0;v--){const w=Math.floor(g()*(v+1)),b=p[v];p[v]=p[w],p[w]=b}l.order=p,l.pos=new Float32Array(x*4),l.spans=new Float32Array(x*2),l.scale=new Float32Array(x),l.cols=new Float32Array(x*3),l.kind=new Uint8Array(x),f.forEach((v,w)=>{const b=S=>as(v.seed*.013+S,v.seed*.0071+S*1.7);l.pos.set([v.x,v.y-sd,v.z,b(1.3)*Math.PI*2],w*4),l.spans.set([v.a,v.b],w*2),l.scale[w]=.8+.4*b(2.9);const y=.9+.2*b(4.1);l.cols.set([y,y*(.97+.06*b(6.6)),y],w*3),l.kind[w]=v.kind})}return this.buildMs+=performance.now()-n,l}update(t,e,n,s){if(this.active=!0,this.works===void 0){this.pending=1,this.group.visible=!1;return}const i=this.rect,a=Ot(Math.floor((t.x-e-i.x0)/De),0,this.tw-1),r=Ot(Math.floor((t.x+e-i.x0)/De),0,this.tw-1),c=Ot(Math.floor((t.z-e-i.z0)/De),0,this.th-1),l=Ot(Math.floor((t.z+e-i.z0)/De),0,this.th-1),h=[];for(let x=c;x<=l;x++)for(let g=a;g<=r;g++){if(this.tiles.has(`${g},${x}`))continue;const p=Math.hypot(i.x0+(g+.5)*De-t.x,i.z0+(x+.5)*De-t.z);p>e+De||h.push([p,g,x])}h.sort((x,g)=>x[0]-g[0]);const u=performance.now();let f=0;for(const[,x,g]of h){if(f&&performance.now()-u>s)break;this.buildTile(x,g),f++}this.pending=h.length-f;const d=e*WS+De;for(const[x,g]of this.tiles)Math.hypot(g.x0+De/2-t.x,g.z0+De/2-t.z)>d&&this.tiles.delete(x);if(this.group.visible=n>.001,!this.group.visible)return;const m=this.material.uniforms;m.uShow.value=n,m.uYearNow.value=this.mgr.yearNow,m.uFadeNear.value=e*.75,m.uFadeFar.value=e,this.refresh(this.app.camera,e,this.t.pack.data.hi*this.app.world.uniforms.uVert.value+3,f>0)}hide(){this.active=!1,this.group.visible=!1,this.drawn=0,this.key=""}meshes(){this.own={uShow:{value:0},uShadeS:{value:this.t.shadow.texture},uShadeRect:{value:this.t.rect},uYearNow:{value:this.mgr.yearNow}},this.material=Si(this.app.shared,this.own,{fade:[50,70],grow:!0}),this.kinds=xr.map(t=>({name:t,geometry:this.mgr.geoms[t].clone(),cap:0,mesh:null,c:0})),this.frustum=new Is,this.pv=new ne,this.box=new yn,this.m4=new ne,this.q=new hs,this.up=new W(0,1,0),this.v3=new W,this.s3=new W}room(t,e){if(t.cap>=e&&t.mesh)return;const n=Math.min(ed,Math.max(256,t.cap*2,e));t.mesh&&(this.group.remove(t.mesh),t.mesh.dispose());const s=t.geometry,i=new ha(s,this.material,n);i.name=t.name,i.count=0,i.frustumCulled=!1,i.instanceMatrix.setUsage(an),i.instanceColor=new he(new Float32Array(n*3),3),i.instanceColor.setUsage(an);const a=new he(new Float32Array(n*4),4);a.setUsage(an);const r=new he(new Float32Array(n).fill(1),1);s.setAttribute("aSpan",a),s.setAttribute("aStretch",r),Object.assign(t,{mesh:i,cap:n,aSpan:a}),this.group.add(i)}epoch(t){let e=0,n=0;for(const s of this.edges)s<t-1.5&&e++,s<t+1.5&&n++;return`${e}/${n}`}refresh(t,e,n,s){var b;const i=this.mgr.yearNow,a=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const r=e*.6,c=[];let l="";for(const y of this.tiles.values()){if(!y.n)continue;this.box.min.set(y.x0,-.5,y.z0),this.box.max.set(y.x0+De,n,y.z0+De);const S=this.box.distanceToPoint(a);if(S>e||!this.frustum.intersectsBox(this.box))continue;const E=Math.round((S<r?1:Math.pow(r/S,1.5))*20);c.push([y,E]),l+=`${y.ti},${y.tj}:${E};`}const h=this.app.districts,u=!!(h!=null&&h.on)&&((b=h.cur)==null?void 0:b.parent)===this.t;if(l+=`|${this.epoch(i)}|${u?Math.round(h.k*8):-1}`,!s&&l===this.key)return;this.key=l,this.refills++;const f=(y,S)=>y.spans[S*2]<i+1&&y.spans[S*2+1]>i-1;let d=0;const m=c.map(([y,S])=>{let E=0;for(let T=0;T<y.n;T++)f(y,T)&&E++;return d+=Math.ceil(E*S/20),E}),x=Math.min(1,ed/Math.max(1,d)),g=[],p=new Int32Array(xr.length);c.forEach(([y,S],E)=>{const T=Math.ceil(m[E]*S*x/20);let _=0;for(let M=0;M<y.n&&_<T;M++){const A=y.order[M];f(y,A)&&(g.push(y,A),p[y.kind[A]]++,_++)}}),this.kinds.forEach((y,S)=>{p[S]&&this.room(y,p[S]),y.c=0});const v=u?h.cur.d.rect:null,w=this.app.world;for(let y=0;y<g.length;y+=2){const S=g[y],E=g[y+1],T=this.kinds[S.kind[E]];if(T.c>=T.cap)continue;const _=T.c++,M=S.pos[E*4],A=S.pos[E*4+2];let R=S.pos[E*4+1];v&&M>v.x0&&A>v.z0&&M<v.x1&&A<v.z1&&(R=w.metresAt(M,A)-sd),this.q.setFromAxisAngle(this.up,S.pos[E*4+3]),this.v3.set(M,Yn(R),A);const k=S.scale[E]*Ie;this.s3.set(k,k,k),this.m4.compose(this.v3,this.q,this.s3),this.m4.toArray(T.mesh.instanceMatrix.array,_*16),T.mesh.instanceColor.array.set(S.cols.subarray(E*3,E*3+3),_*3);const C=S.spans[E*2],z=S.spans[E*2+1];T.aSpan.array.set([C-.5,C+.5,z-.5,z+.5],_*4)}this.drawn=0;for(const y of this.kinds)y.mesh&&(y.mesh.count=y.c,y.mesh.visible=y.c>0,y.mesh.instanceMatrix.needsUpdate=!0,y.mesh.instanceColor.needsUpdate=!0,y.aSpan.needsUpdate=!0,this.drawn+=y.c)}alive(t,e=null,n=null,s=1/0){const i=[];for(const a of this.tiles.values())for(let r=0;r<a.n;r++){if(!(a.spans[r*2]+.5<=t&&a.spans[r*2+1]-.5>t))continue;const c=a.pos[r*4],l=a.pos[r*4+2];e!==null&&Math.hypot(c-e,l-n)>s||i.push({island:this.id,kind:xr[a.kind[r]],x:c,z:l})}return i}stats(){var s;let t=0,e=0,n=0;for(const i of this.tiles.values()){t+=i.n,i.n&&e++;for(const a of["order","pos","spans","scale","cols","kind"])n+=((s=i[a])==null?void 0:s.byteLength)||0}return{island:this.id,tiles:this.tiles.size,worked:e,pending:this.pending,instances:t,drawn:this.drawn,byKind:Object.fromEntries(this.kinds.map(i=>[i.name,i.mesh?i.mesh.count:0])),built:this.built,refills:this.refills,msPerTile:this.built?+(this.buildMs/this.built).toFixed(2):null,cpuMB:+(n/1048576).toFixed(2)}}dispose(){var t;this.disposed=!0,this.mgr.group.remove(this.group);for(const e of this.kinds)(t=e.mesh)==null||t.dispose(),e.geometry.dispose();this.material.dispose(),this.tiles.clear()}}const i0=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)},Kc=["chiefdoms","land","mahele"],Cl=o=>i0(260,900,o),vr=o=>i0(90,300,o);class XS{constructor(t,e,{warn:n=console.warn}={}){this.canvas=t,this.data=e,this.warn=n,this.params=new URLSearchParams(location.search);const s=new Kd({canvas:t,antialias:!1,powerPreference:"high-performance"});s.setClearColor(0,1),s.info.autoReset=!1,this.renderer=s,this.pipeline=new sy(s),this.scene=new qr,this.camera=new Rn(42,1,.1,9e3),this.light={sunDir:new W(0,1,0),sunColor:new Ht,skyColor:new Ht,groundColor:new Ht,moonDir:new W(0,-1,0),moonColor:new Ht,zenith:new Ht,horizon:new Ht,sunHorizon:new Ht,night:0},this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uSkyMap:{value:null},uMokuId:{value:null},uMokuRect:{value:new Yt(0,0,1,1)},uPalette:{value:null},uEraMix:{value:0},uPolityK:{value:0},uHoverMoku:{value:0}}},this.world=new py(this,e),Object.assign(this.shared.uniforms,this.world.uniforms),this.world.uniforms=this.shared.uniforms,this.patches=new dy(this),this.timeline=new dS(e.eras);const i=e.geology;this.geoClock=i?new pS([...i.stages.map(r=>r.age),...i.chapters.flatMap(r=>[r.age,...r.ageSpan||[],...(r.steps||[]).map(c=>c.age)])]):null,this.polity=new Qb(e,this.world.archPack.rect,this.shared.uniforms,n),this.land=new i_(this),this.crops=new lS(this),this.mahele=new tS(this),this.regionOn="chiefdoms",this.overlay={lines:!0,pins:!0,routes:!1};const a=this.params.get("view");this.view=Kc.includes(a)?a:a==="none"?null:"chiefdoms",this.viewChosen=Kc.includes(a)||a==="none",this.viewListeners=[],this.polityK=0,this.landK=0,this.sky=new Pb,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??15.6)},this.time=0,this.frames=0,this.updaters=[]}start(){this.world.setArchipelago(this.world.archPack),this.scene.add(this.world.group),this.districts=new fb(this),this.world.district=this.districts,this.towns=new ES(this),this.works=new OS(this),this.cropTrees=new jS(this),this.ocean=new gb(this.shared,this.shared.uniforms),this.scene.add(this.ocean.mesh),this.lines=new Hb(this.data,this.shared.uniforms),this.scene.add(this.lines.group),this.routes=new Jb({proj:this.data.proj,uniforms:this.shared.uniforms,camera:this.camera,renderer:this.renderer,eras:this.data.eras}),this.scene.add(this.routes.group),Yb(this.data,this.warn).then(a=>this.routes.setRoutes(a)),this.mahele.load(),this.rig=new Fb(this.camera,this.canvas,this.world),this.data.geology&&(this.geology=new MS(this,this.data.geology));const t=this.params.get("cam");if(t){const[a,r,c,l,h]=t.split(",").map(Number);this.rig.jump({x:a,z:r,distance:c,yaw:l,pitch:h})}const e=this.params.get("year");e?this.timeline.setYear(Number(e)):t?this.timeline.set(Math.round(this.timeline.sAtYear(1778))):this.timeline.set(0),this.timeline.onChange(()=>this.syncEras()),this.syncEras(),this.sky.update(this.clock.doy,this.clock.hour,0,this.light);const n=this.renderer.getContext(),s=n.getExtension("WEBGL_debug_renderer_info"),i=s?String(n.getParameter(s.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(i),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.params.get("debug")&&this.world.setDebug(Number(this.params.get("debug"))),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}setView(t,{user:e=!1}={}){e&&(this.viewChosen=!0);const n=Kc.includes(t)?t:null;if(n!==this.view){this.view=n;for(const s of this.viewListeners)s(n)}}get farView(){return this.view==="mahele"&&!this.mahele.availableAt(this.timeline.year)?"chiefdoms":this.view}region(t){if(t===this.regionOn||this.polityK>.004||t==="mahele"&&!this.mahele.build())return;const e=t==="mahele"?this.mahele:this.polity,n=this.shared.uniforms;n.uMokuId.value=e.idTex,n.uPalette.value=e.palTex,n.uMokuRect.value.set(e.rect.x0,e.rect.z0,e.rect.x1,e.rect.z1),this.regionOn=t}regionZoom(t,e){return t!==this.regionOn?0:t==="mahele"?vr(e):t==="chiefdoms"?Cl(e):0}onView(t){this.viewListeners.push(t)}islandFill(){const t=this.rig.state,e=t.target;let n=null,s=0;for(const r of this.world.islandPacks){const c=r.rect,l=Math.min(e.x-c.x0,c.x1-e.x,e.z-c.z0,c.z1-e.z);l>s&&(s=l,n=r)}if(!n)return 0;const i=2*t.distance*Math.tan(this.camera.fov*Math.PI/360),a=n.rect;return Math.max((a.x1-a.x0)/(i*this.camera.aspect),(a.z1-a.z0)/i)}routeSection(){var i;const t=this.tour,e=(i=this.ui)==null?void 0:i.card;let n=null;t!=null&&t.active&&t.event?n=t.event:!(t!=null&&t.active)&&(e==null?void 0:e.mode)==="event"&&e.ev&&(n=e.ev);const s=n?`ev:${n.id}`:"";return s!==this._routeKey&&(this._routeKey=s,this._routeSection=n?{routes:new Set(n.routes||[]),events:new Set([n.id]),k:1,focus:!0}:null),this._routeSection}routeOptions(t){return{window:this.timeline.window,fill:this.islandFill(),section:this.routeSection(),all:this.overlay.routes===!0,...t}}addIsland(t){const e=this.world.addIsland(t);this.land.attach(e),this.crops.attach(e),e.applyRange(this.qset.range),this.params.get("debug")&&(e.uniforms.uDebug.value=Number(this.params.get("debug")))}settle(){var n,s,i,a,r,c,l;(n=this.ui)==null||n.timeline.finish(),this.rig.finishFlight();const t=this.rig.goal;for(const h of[this.rig.goal,this.rig.state])h.target.copy(t.target),h.distance=t.distance,h.yaw=t.yaw,h.pitch=t.pitch;this.world.update(this.camera,t.distance,0),this.world.settle(this.camera),this.crops.update(0),this.crops.settle(),(s=this.districts)==null||s.settle(this.camera,t.distance),(i=this.towns)==null||i.settle(),(a=this.works)==null||a.settle(),(r=this.cropTrees)==null||r.settle(),this.rig.jump({x:t.target.x,z:t.target.z});const e=this.farView;(e==="chiefdoms"||e==="mahele")&&(this.polityK=0,this.region(e)),this.polityK=this.regionZoom(e,t.distance),this.landK=e==="land"?vr(t.distance):0,this.shared.uniforms.uPolityK.value=this.polityK,this.land.settle(this.landK),(c=this.routes)==null||c.settle(this.timeline.year,t.distance,this.routeOptions()),(l=this.geology)==null||l.settle()}get prologue(){var t;return!!((t=this.geology)!=null&&t.want)}setPrologue(t){if(!this.geology||t===this.prologue)return;const e=this.world;if(t){this.archBounds={...e.bounds};const n=this.geology.sf.rect;e.bounds={x0:Math.min(n.x0,e.bounds.x0),z0:Math.min(n.z0,e.bounds.z0),x1:Math.max(n.x1,e.bounds.x1),z1:Math.max(n.z1,e.bounds.z1)},this.geology.enter()}else this.archBounds&&(e.bounds=this.archBounds),this.geology.leave()}stats(){var e;const t=this.renderer.info;return{...this.world.stats(),geology:((e=this.geology)==null?void 0:e.stats())??null,view:this.view,farView:this.farView,frameMs:+(this.frameAvg??0).toFixed(1),calls:t.render.calls,triangles:t.render.triangles,textures:t.memory.textures,quality:this.quality.level}}syncEras(){const{a:t,b:e,t:n}=this.timeline.pair;this.polity.setEras(t,e,n)}applyQuality(){const t=[{range:3,dpr:1},{range:3.8,dpr:1.25},{range:4.6,dpr:1.5},{range:5.5,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.world.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.frameAvg=this.frameAvg===void 0?e*1e3:this.frameAvg+(e*1e3-this.frameAvg)*.1,this.renderer.info.reset(),this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){var f,d;const e=this.clock;this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t);const n=this.rig.state.distance;this.world.update(this.camera,n,t),this.ocean.update(this.camera);const s=1-Math.exp(-t*5),i=this.farView;(i==="chiefdoms"||i==="mahele")&&this.region(i);const a=this.regionZoom(i,n);this.polityK+=(a-this.polityK)*s,Math.abs(a-this.polityK)<.001&&(this.polityK=a),this.shared.uniforms.uPolityK.value=this.polityK;const r=i==="land"?vr(n):0;this.landK+=(r-this.landK)*s,this.land.update(t,this.landK),this.crops.update(t),(f=this.geology)==null||f.update(t);const c=!!((d=this.geology)!=null&&d.covers);this.world.held=c,this.world.group.visible=!c,this.ocean.mesh.visible=!c,this.routes.group.visible=!c,this.lines.visible=this.overlay.lines&&!c;const l=this.light,h=Math.min(1,.25+(l.sunColor.r+l.skyColor.r)*.35);this.lines.update(this.camera,this.renderer,n,h),c&&(this.lines.group.visible=!1),this.routes.update(this.timeline.year,n,this.routeOptions({light:h}));for(const m of this.updaters)m(t,this.time);const u=this.pipeline.uniforms;u.uSunDir.value.copy(l.sunDir),u.uSunColor.value.copy(l.sunHorizon),u.uFogColor.value.copy(l.horizon),u.uFogDensity.value=.09/Math.max(30,n),u.uFogFalloff.value=2/Math.max(30,n),u.uExposure.value=.55*(1+2.2*Math.pow(l.night,1.5)),u.uNight.value=l.night,this.sky.group.position.copy(this.camera.position)}}const qe=(o,t=document)=>t.querySelector(o),sn=(o,t={},e="")=>{const n=document.createElement(o);for(const[s,i]of Object.entries(t))s==="class"?n.className=i:s.startsWith("on")?n.addEventListener(s.slice(2),i):n.setAttribute(s,i);return e&&(n.innerHTML=e),n},YS={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},mt=o=>String(o??"").replace(/[&<>"']/g,t=>YS[t]),Rl={arrival:'<path d="M2.5 15.5h19l-2.6 3.6H5.1z"/><path d="M11.5 15.5V4l6.5 9.2h-6.5"/><path d="M2 21.2c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',voyage:'<path d="M2.5 14.5h19l-2.6 3.6H5.1z"/><path d="M11.5 14.5V3.5l6.5 9h-6.5"/><path d="M6 21c3-1.4 9-1.4 12 0"/>',battle:'<path d="M4.5 19.5 19.5 4.5M4.5 4.5l15 15"/><path d="M16.5 4.5h3v3M7.5 4.5h-3v3"/>',founding:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',construction:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',eruption:'<path d="M2.5 20.5 9 11h6l6.5 9.5z"/><path d="M10.2 8.2c0-2 1-3.1 1.8-4.7.8 1.6 1.8 2.7 1.8 4.7"/><path d="M7 6.5l1.3 1.3M17 6.5l-1.3 1.3"/>',epidemic:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',law:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',treaty:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 15h3"/><path d="M13.5 18.5c1-1 1.8-1 2.8 0"/>',death:'<path d="M3.5 18.5h17"/><path d="M7 18.5a5 5 0 0 1 10 0"/><path d="M12 4.5v5M9.6 7.4 12 9.8l2.4-2.4"/>',protest:'<path d="M6 21V3.5"/><path d="M6 4h11.5l-2.6 4 2.6 4H6"/>',restoration:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',slide:'<path d="M2.5 20.5h19"/><path d="M3 20.5c2.5-6 5-12.5 8.5-14"/><path d="M11.5 6.5c1 3 3.2 6.2 6.5 8.2"/><circle cx="17.5" cy="18" r="1.2"/><circle cx="20" cy="17.4" r=".8"/>',isles:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',replay:'<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 3.5v3.7h3.7"/>',other:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',era:'<path d="M5 13.5h14l-2 2.6H7z"/><path d="M11.5 13.5V3.5l5.5 7.6h-5.5"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',routes:'<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',home:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'};function Fn(o,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Rl[o]||Rl.other}</svg>`}const Ll=o=>o in Rl;class KS{constructor(t,e,n){var a,r;this.app=e,this.ui=n,this.tl=e.timeline,this.geo=e.geoClock,this.tween=null,this.mode="years";const s=this.tl.n;this.el=sn("div",{class:"timeline",role:"group","aria-label":"Time"}),s<2&&this.el.classList.add("single"),s<1&&(this.el.hidden=!0),this.el.innerHTML=`
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${Fn("prev",16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${Fn("next",16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${this.tl.max}" step="0.001" aria-label="Year" />
      </div>`,t.appendChild(this.el),this.input=qe(".tl-input",this.el),this.backBtn=qe(".tl-back",this.el),this.nextBtn=qe(".tl-next",this.el),this.tourEl=qe(".tl-tour",this.el);const i=qe(".tl-ticks",this.el);this.ticksEl=i,this.yearTicks(),addEventListener("resize",()=>this.labelTicks()),(a=document.fonts)==null||a.ready.then(()=>this.labelTicks()),this.input.addEventListener("input",()=>{if(this.tween=null,this.mode==="ma"){this.geo.setU(Number(this.input.value)),this.ui.onScrubAge();return}this.tl.set(Number(this.input.value)),this.ui.onScrub()}),i.addEventListener("click",c=>{const l=c.target.closest(".tl-tick");if(l){if(this.mode==="ma"){this.easeToAge(Number(l.dataset.age),.9),this.ui.onScrubAge(Number(l.dataset.age));return}this.easeTo(Number(l.dataset.i),.9),this.ui.onScrub(Number(l.dataset.i))}}),this.nextBtn.addEventListener("click",()=>{this.el.classList.remove("invite"),this.ui.tour.next()}),this.backBtn.addEventListener("click",()=>this.ui.tour.back()),this.tl.onChange(()=>this.refresh()),(r=this.geo)==null||r.onChange(()=>this.refresh()),this.refresh()}yearTicks(){const t=this.tl.n;this.ticksEl.innerHTML="",this.tl.eras.forEach((e,n)=>{const s=t>1?n/this.tl.max*100:50,i=sn("button",{class:"tl-tick",style:`left:${s}%`,title:`${e.label} · ${Jo(e.year,e.yearPrecision)}`,"aria-label":e.label,"data-i":n});i.innerHTML=`<i></i><span>${mt(Jo(e.year,e.yearPrecision).replace("c. ",""))}</span>`,this.ticksEl.appendChild(i)}),this.labelTicks()}ageTicks(){const t=this.geo;this.ticksEl.innerHTML="",t.ticks().forEach((e,n)=>{const s=e===0?"now":n===0?`${e} Ma`:String(e),i=sn("button",{class:"tl-tick",style:`left:${t.uAt(e)*100}%`,title:_i(e),"aria-label":_i(e),"data-age":e});i.innerHTML=`<i></i><span>${mt(s)}</span>`,this.ticksEl.appendChild(i)}),this.labelTicks()}setMode(t){const e=t==="ma"&&this.geo?"ma":"years";e!==this.mode&&(this.mode=e,this.tween=null,this.el.classList.toggle("ma",e==="ma"),this.el.classList.remove("single"),e==="ma"?(this.input.max="1",this.input.setAttribute("aria-label","Age"),this.ageTicks()):(this.input.max=String(this.tl.max),this.input.setAttribute("aria-label","Year"),this.tl.n<2&&this.el.classList.add("single"),this.yearTicks()),this.tourKey=null,this.refresh())}labelTicks(){const t=[...this.el.querySelectorAll(".tl-tick span")];for(const a of t)a.hidden=!1;const e=t.map(a=>a.getBoundingClientRect());if(!e.some(a=>a.width>0))return;const n=6,s=e.length-1;let i=-1/0;t.forEach((a,r)=>{const c=e[r],l=r===0||r===s||c.left>=i+n&&c.right<=e[s].left-n;a.hidden=!l,l&&(i=c.right)})}easeTo(t,e=1){const n=Math.max(0,Math.min(this.tl.max,t));this.tween={from:this.tl.s,to:n,t:0,dur:e}}easeToAge(t,e=1){this.tween={from:this.geo.u,to:this.geo.uAt(t),t:0,dur:e,ma:!0,age:t}}easeToYear(t,e){this.easeTo(this.tl.sAtYear(t),e)}finish(){const t=this.tween;t&&(t.ma?this.geo.set(t.age):this.tl.set(t.to),this.tween=null)}update(t){const e=this.tween;if(!e)return;e.t=Math.min(1,e.t+t/e.dur);const n=e.t<.5?2*e.t*e.t:1-Math.pow(-2*e.t+2,2)/2;e.ma?e.t>=1?this.geo.set(e.age):this.geo.setU(e.from+(e.to-e.from)*n):this.tl.set(e.from+(e.to-e.from)*n),e.t>=1&&(this.tween=null)}refresh(){if(this.mode==="ma")return this.refreshAge();const t=this.tl,e=t.era;qe(".tl-era",this.el).textContent=e?e.label:"";const n=t.reachesNow&&t.s>=t.max-.001;qe(".tl-year",this.el).textContent=e?Jo(t.year,n?1:e.yearPrecision??1):"",document.activeElement!==this.input&&(this.input.value=String(t.s));const s=t.max>0?t.s/t.max:0;qe(".tl-rail span",this.el).style.width=`${s*100}%`;const i=Math.round(t.s);for(const a of this.el.querySelectorAll(".tl-tick"))a.classList.toggle("on",Number(a.dataset.i)===i)}refreshAge(){var a;const t=this.geo,e=this.ui.tour,n=e!=null&&e.active&&((a=e.current)!=null&&a.prologue)?e.current:e==null?void 0:e.prologueAt(t.age);qe(".tl-era",this.el).textContent=n?n.era.label:"",qe(".tl-year",this.el).textContent=_i(t.age),document.activeElement!==this.input&&(this.input.value=String(t.u)),qe(".tl-rail span",this.el).style.width=`${t.u*100}%`;let s=null,i=1/0;for(const r of this.el.querySelectorAll(".tl-tick")){const c=Math.abs(t.uAt(Number(r.dataset.age))-t.u);c<i&&([i,s]=[c,r])}for(const r of this.el.querySelectorAll(".tl-tick"))r.classList.toggle("on",r===s)}refreshTour(t){const e=`${t.active}:${t.chapter}:${t.step}:${t.stop}:${t.active?"":t.nearestChapter()}:${t.atEnd}:${t.atStart}`;if(e===this.tourKey)return;this.tourKey=e,this.mode==="ma"&&this.refreshAge();const n=t.describe();if(this.backBtn.disabled=!n||t.atStart,this.nextBtn.disabled=!n||t.atEnd,this.el.classList.toggle("off-tour",!!n&&!n.active),this.tourEl.classList.toggle("opening",!!(n!=null&&n.opening)),!n){this.tourEl.innerHTML="";return}const s=n.prologue&&n.of<2?"":` <b>${mt(n.number)}</b> of ${mt(n.ofLabel)}`;this.tourEl.innerHTML=n.active?`<span class="tl-ch">${mt(n.word)}${s}</span><i>·</i><em>${mt(n.name)}</em>${n.step?`<i>·</i><span>${mt(n.step)}</span>`:""}`:`<span>Next resumes at ${mt(n.resume)}</span><i>·</i><em>${mt(n.name)}</em>`,this.nextBtn.title=n.active?"Next (→ or space)":`Back to the tour: ${n.resume}, ${n.name}`}}const id={exact:0,ahupuaa:22,moku:90,island:260,sea:160},od=24;class ZS{constructor(t,e,{onOpen:n,onCluster:s}={}){this.app=e,this.onOpen=n,this.onCluster=s,this.layer=sn("div",{class:"pins"}),t.appendChild(this.layer),this.tip=sn("div",{class:"cl-tip",role:"tooltip"}),t.appendChild(this.tip);const i=new Map(e.data.places.map(c=>[c.id,c]));this.places=i,this.items=[];const a=[];for(const c of e.data.events){const l=(c.where||[]).map(p=>i.get(p.place)).find(p=>p&&Xe(p.geometry)),h=Al(c);if(!l||!h){a.push(c.id);continue}const[u,f]=e.data.proj.toWorld(Xe(l.geometry)),d=Ll(c.kind)?c.kind:"other",m=sn("button",{class:"pin",title:c.title,"aria-label":c.title},`<span class="pin-ic">${Fn(d,16)}</span><span class="pin-label">${mt(c.title)}</span>`);m.addEventListener("click",p=>{var v;p.stopPropagation(),(v=this.onOpen)==null||v.call(this,c)});const x=id[l.placePrecision]??0,g=sn("div",{class:"halo"});this.layer.appendChild(g),this.layer.appendChild(m),this.items.push({ev:c,place:l,x:u,z:f,span:h,start:Br(c)??h[0],el:m,halo:g,soft:x,r:x,pos:new W(u,0,f),shown:!1,active:!1,near:!1,haloShown:!1,tx:NaN,ty:NaN,ts:NaN,hx:NaN,hy:NaN,hr:NaN,ha:NaN})}a.length&&e.warn(`events with no placeable \`where\` or no date, so no pin: ${a.join(", ")}`);const r=this.items.length;this.sx=new Float32Array(r),this.sy=new Float32Array(r),this.vis=new Uint8Array(r),this.root=new Int16Array(r),this.size=new Int16Array(r),this.slot=new Int16Array(r),this.members=new Int16Array(r),this.halos=new Int16Array(r),this.clusters=[],this.nClusters=0,this.hovered=null,this.activeEvent=null,this.stopXZ=null,this.asideNow=!1,this._v=new W,this._w=new W}setStopPlace(t){const e=t&&Xe(t.geometry);this.stopXZ=e?this.app.data.proj.toWorld(e):null,this.stopSoft=t?id[t.placePrecision]??0:0}aside(){var i,a,r,c,l;const t=this.app,e=t.tour,n=e!=null&&e.active&&e.event===this.activeEvent&&e.stop>=0?(i=e.event.stops)==null?void 0:i[e.stop]:null,s=n?Math.max(n.zoom==="near"?1:0,((l=(c=(r=(a=t.districts)==null?void 0:a.cur)==null?void 0:r.features)==null?void 0:c.forces)==null?void 0:l.stopShown)??0):0;return this.asideNow=this.asideNow?s>.2:s>.35,this.asideNow}visibleEvents(){const[t,e]=this.app.timeline.window;return this.items.filter(n=>n.span[1]>=t&&n.span[0]<=e).map(n=>n.ev)}marker(t){let e=this.clusters[t];if(e)return e;const n=sn("button",{class:"cluster"},'<span class="cl-n"></span>');return e={el:n,label:n.firstChild,start:0,count:0,x:0,y:0,key:0,shownCount:-1,tipKey:-1,domKey:-1,shown:!1,beside:!1,tx:NaN,ty:NaN,ts:NaN},n.addEventListener("click",s=>{var i;s.stopPropagation(),this.hideTip(),(i=this.onCluster)==null||i.call(this,this.eventsOf(e))}),n.addEventListener("pointerenter",s=>{s.pointerType!=="touch"&&(this.hovered=e,this.showTip(e))}),n.addEventListener("pointerleave",()=>{this.hovered===e&&this.hideTip()}),this.layer.appendChild(n),this.clusters[t]=e,e}eventsOf(t){const e=[];for(let n=0;n<t.count;n++)e.push(this.items[this.members[t.start+n]]);return e.sort((n,s)=>n.start-s.start).map(n=>n.ev)}groups(){return this.clusters.slice(0,this.nClusters).map(t=>({ids:this.eventsOf(t).map(e=>e.id),count:t.count,x:t.x,y:t.y,beside:t.beside}))}showTip(t){t.tipKey=t.key;const e=this.eventsOf(t).map(n=>`<div class="tip-row"><span class="tip-y">${mt(n0(n))}</span><b>${mt(n.title)}</b></div>`).join("");this.tip.innerHTML=`<div class="tip-head">${t.count} events here</div>${e}<div class="tip-foot">click for the list</div>`,this.tip.classList.add("show"),this.tipX=this.tipY=NaN,this.placeTip(t)}placeTip(t){const e=this.tip.offsetWidth||220,n=this.tip.offsetHeight||120;let s=t.x+22;s+e>innerWidth-10&&(s=t.x-22-e);const i=Math.max(64,Math.min(innerHeight-n-10,t.y-44-n/2)),a=Math.round(s),r=Math.round(i);a===this.tipX&&r===this.tipY||(this.tipX=a,this.tipY=r,this.tip.style.transform=`translate(${a}px, ${r}px)`)}hideTip(){this.hovered=null,this.tip.classList.remove("show")}find(t){const e=this.root;for(;e[t]!==t;)e[t]=e[e[t]],t=e[t];return t}put(t,e,n,s){Math.abs(e-t.tx)<.05&&Math.abs(n-t.ty)<.05&&s===t.ts||(t.tx=e,t.ty=n,t.ts=s,t.el.style.transform=`translate(${e.toFixed(1)}px, ${n.toFixed(1)}px) scale(${s.toFixed(3)})`)}update(t){const e=this.app,n=e.camera,s=innerWidth,i=innerHeight,a=e.timeline,r=a.yearAt(a.s-.5),c=a.yearAt(a.s+.5),l=e.rig.state.distance,h=Math.round(Math.max(.62,Math.min(1,1.18-Math.log(Math.max(1,l)/120)*.13))*200)/200,u=this.items,f=u.length,{sx:d,sy:m,vis:x,root:g,size:p}=this,v=this.activeEvent,w=this.aside(),b=this._v;let y=-1;for(let M=0;M<f;M++){const A=u[M],R=A.ev===v,k=R&&this.stopXZ;A.pos.x=k?this.stopXZ[0]:A.x,A.pos.z=k?this.stopXZ[1]:A.z,A.pos.y=e.world.heightAt(A.pos.x,A.pos.z)+.02,A.r=k?this.stopSoft:A.soft;let C=t&&(R?!w:A.span[1]>=r&&A.span[0]<=c);C&&(b.copy(A.pos).project(n),d[M]=(b.x+1)/2*s,m[M]=(1-b.y)/2*i,C=b.z<1&&d[M]>-60&&d[M]<s+60&&m[M]>84&&m[M]<i+40),x[M]=C?1:0,C&&R&&(y=M),g[M]=M,p[M]=0}const S=od*od;for(let M=0;M<f;M++)if(!(!x[M]||M===y))for(let A=M+1;A<f;A++){if(!x[A]||A===y)continue;const R=d[M]-d[A],k=m[M]-m[A];if(R*R+k*k<S){const C=this.find(M),z=this.find(A);C!==z&&(g[Math.max(C,z)]=Math.min(C,z))}}for(let M=0;M<f;M++)x[M]&&M!==y&&p[this.find(M)]++;let E=0,T=0;for(let M=0;M<f;M++){if(!x[M]||M===y||g[M]!==M||p[M]<2)continue;const A=this.marker(E);this.slot[M]=E++,A.start=T,A.count=0,A.x=0,A.y=0,A.key=0,T+=p[M]}for(let M=0;M<f;M++){if(!x[M]||M===y)continue;const A=this.find(M);if(p[A]<2)continue;const R=this.clusters[this.slot[A]];this.members[R.start+R.count++]=M,R.x+=d[M],R.y+=m[M],R.key=(R.key*61+M+1)%1000003}for(let M=0;M<f;M++){const A=u[M],R=x[M]===1&&(M===y||p[this.find(M)]<2);R!==A.shown&&(A.shown=R,A.el.classList.toggle("show",R));const k=A.ev===v;if(k!==A.active&&(A.active=k,A.el.classList.toggle("active",k)),!R)continue;const C=l<260||k;C!==A.near&&(A.near=C,A.el.classList.toggle("near",C)),this.put(A,d[M],m[M],h)}for(let M=0;M<E;M++){const A=this.clusters[M];A.x/=A.count,A.y/=A.count;const R=y>=0&&Math.abs(A.x-d[y])<30&&Math.abs(A.y-m[y])<30;if(R&&(A.x=d[y]-36*h,A.y=m[y]),R!==A.beside&&(A.beside=R,A.el.classList.toggle("beside",R)),A.count!==A.shownCount&&(A.shownCount=A.count,A.label.textContent=String(A.count),A.el.setAttribute("aria-label",`${A.count} events here`)),A.key!==A.domKey){A.domKey=A.key;let k="";for(let C=0;C<A.count;C++)k+=`${C?" ":""}${u[this.members[A.start+C]].ev.id}`;A.el.dataset.events=k}A.shown||(A.shown=!0,A.el.classList.add("show")),this.put(A,A.x,A.y,h),this.hovered===A&&(A.key!==A.tipKey?this.showTip(A):this.placeTip(A))}for(let M=E;M<this.clusters.length;M++){const A=this.clusters[M];this.hovered===A&&this.hideTip(),A.shown&&(A.shown=!1,A.count=0,A.el.classList.remove("show"))}this.nClusters=E;let _=0;for(let M=0;M<f;M++){const A=u[M];let R=x[M]===1&&A.r>0;for(let I=0;R&&I<_;I++){const O=u[this.halos[I]];Math.abs(O.pos.x-A.pos.x)<.5&&Math.abs(O.pos.z-A.pos.z)<.5&&O.r>=A.r&&(R=!1)}if(R!==A.haloShown&&(A.haloShown=R,A.halo.classList.toggle("show",R)),!R)continue;this.halos[_++]=M,this._w.copy(n.position).sub(A.pos).normalize();const k=this._w.cross(n.up).normalize().multiplyScalar(A.r).add(A.pos);k.project(n);const C=Math.max(6,Math.min(400,Math.hypot((k.x+1)/2*s-d[M],(1-k.y)/2*i-m[M])));Math.abs(d[M]-A.hx)<.05&&Math.abs(m[M]-A.hy)<.05&&Math.abs(C-A.hr)<.05||(A.hx=d[M],A.hy=m[M],A.hr=C,A.halo.style.transform=`translate(${d[M].toFixed(1)}px, ${m[M].toFixed(1)}px) scale(${C.toFixed(1)})`);const z=Math.round(Math.max(.3,Math.min(1,70/C))*100)/100;z!==A.ha&&(A.ha=z,A.halo.style.setProperty("--halo",z.toFixed(2)))}}}const ci={far:2600,island:520,near:70},Zc={far:0,island:1,near:2},JS=1500,li=(o,t,e)=>Math.max(t,Math.min(e,o)),QS=new Set(["law","epidemic","restoration"]);function t3(o,t=null){return(o==null?void 0:o.view)==="land"||(o==null?void 0:o.view)==="chiefdoms"||(o==null?void 0:o.view)==="mahele"?o.view:(o==null?void 0:o.kind)==="law"&&(t!=null&&t.size)&&(o.sources||[]).some(e=>t.has(typeof e=="string"?e:e==null?void 0:e.id))?"mahele":o&&QS.has(o.kind)?"land":"chiefdoms"}function ad(o){return o.short?o.short:String(o.label||o.id).replace(/^in the time of\s+/i,"").split(/,| and the /)[0].trim()}function Xs(o){const t=[[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let e="";for(const[n,s]of t)for(;o>=n;)[o,e]=[o-n,e+s];return e}function rd(o){let t=null;for(const e of o||[])e in Zc&&(t===null||Zc[e]>Zc[t])&&(t=e);return t||"island"}class e3{constructor(t,e){this.app=t,this.ui=e,this.places=new Map(t.data.places.map(n=>[n.id,n])),this.islands=new Map(t.data.packs.filter(n=>n!==t.world.archPack).map(n=>[n.id,n])),this.chapters=this.build(),this.prologue=this.buildPrologue(),this.first=-this.prologue.length,this.steps=new Map(this.prologue.flatMap(n=>n.events.map(s=>[s.id,s]))),this.active=!1,this.chapter=0,this.step=-1,this.stop=-1,this.listeners=[]}build(){const t=this.app,e=t.timeline,n=new Map(e.eras.map((r,c)=>[r.id,c])),s=e.eras.map((r,c)=>({era:r,index:c,name:ad(r),events:[],island:null}));if(!s.length)return s;const i=[],a=s.map(()=>[]);return t.data.events.forEach((r,c)=>{const l=Br(r);if(l===null)return;let h=n.get(r.era);h===void 0&&(h=e.eras.indexOf(e.eraAt(e.sAtYear(l))),i.push(r.id)),a[h].push({ev:r,start:l,order:c})}),i.length&&t.warn(`events whose era is not in eras.json, placed in a chapter by date: ${i.join(", ")}`),s.forEach((r,c)=>{r.events=a[c].sort((l,h)=>l.start-h.start||l.order-h.order).map(l=>l.ev),r.island=this.gathering(r.events)}),s}buildPrologue(){const t=this.app.data.geology;if(!t)return[];const e=t.chapters.length;return t.chapters.map((n,s)=>{const i={id:n.id,label:n.label||n.id,short:n.short,note:n.note||"",sources:n.sources||[],age:n.age,ageSpan:n.ageSpan},a=(n.steps||[]).filter(r=>(r==null?void 0:r.id)&&Number.isFinite(r.age)).map(r=>({...r,prologue:!0}));return{prologue:!0,index:s,at:s-e,era:i,name:ad(i),events:a,island:null}})}chapterAt(t){return t<0?this.prologue[this.prologue.length+t]||null:this.chapters[t]||null}prologueAt(t){let e=null,n=1/0;for(const s of this.prologue){const i=s.era.ageSpan,a=Array.isArray(i)&&t<=Math.max(...i)+1e-9&&t>=Math.min(...i)-1e-9,r=[s.era.age,...s.events.map(l=>l.age)].filter(Number.isFinite),c=Math.min(...r.map(l=>Math.abs(l-t)))-(a?1e6:0);c<n&&([n,e]=[c,s])}return e}gathering(t){const e=new Map;let n=0;for(const a of t){const r=this.placeOf(a);r&&(n++,r.island&&this.islands.has(r.island)&&e.set(r.island,(e.get(r.island)||0)+1))}let s=null,i=0;for(const[a,r]of e)r>i&&([s,i]=[a,r]);return s&&i>=2&&i>=n*.7?s:null}placeOf(t){for(const e of t.where||[]){const n=this.places.get(e.place);if(n&&Xe(n.geometry))return n}return null}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}get current(){return this.chapterAt(this.chapter)}get event(){var t;return this.step>=0&&((t=this.current)==null?void 0:t.events[this.step])||null}get state(){var t;return{active:this.active,chapter:this.chapter,step:this.step,stop:this.stop,event:((t=this.event)==null?void 0:t.id)??null}}get atStart(){return this.active&&this.chapter===this.first&&this.step<0}get atEnd(){var i;const t=this.chapters.length;if(!t)return!0;if(!this.active)return!1;const e=this.current,n=this.event,s=n?(((i=n.stops)==null?void 0:i.length)||0)-1:-1;return this.chapter===t-1&&this.step===e.events.length-1&&this.stop>=s}nearestChapter(){return this.app.prologue&&this.prologue.length?this.prologueAt(this.app.geoClock.age).at:li(Math.round(this.app.timeline.s),0,this.chapters.length-1)}begin(){this.goTo(0,-1,{jump:!0})}next(){var e;if(!this.chapters.length)return;if(!this.active)return this.goTo(this.nearestChapter(),-1);const t=this.event;if(t&&this.stop<(((e=t.stops)==null?void 0:e.length)||0)-1)return this.goStop(this.stop+1);if(this.step<this.current.events.length-1)return this.goTo(this.chapter,this.step+1,{forward:!0});if(this.chapter<this.chapters.length-1)return this.goTo(this.chapter+1,-1)}back(){if(this.chapters.length){if(!this.active)return this.goTo(this.nearestChapter(),-1);if(this.event&&this.stop>0)return this.goStop(this.stop-1);if(this.event&&this.stop===0)return this.goTo(this.chapter,this.step);if(this.step>0)return this.goTo(this.chapter,this.step-1,{stop:"last"});if(this.step===0)return this.goTo(this.chapter,-1);if(this.chapter>this.first){const t=this.chapterAt(this.chapter-1);return this.goTo(this.chapter-1,t.events.length-1,{stop:"last"})}}}skip(t){if(!this.chapters.length)return;const e=this.active?this.chapter:this.nearestChapter(),n=t<0&&this.active&&this.step>=0?e:e+t;n>=this.first&&n<this.chapters.length&&this.goTo(n,-1)}leave(){this.active&&(this.active=!1,this.notify())}locate(t){for(let e=this.first;e<this.chapters.length;e++){const n=this.chapterAt(e).events.indexOf(t);if(n>=0)return[e,n]}return null}open(t,{gentle:e=!1}={}){const n=this.locate(t);if(n)return this.goTo(n[0],n[1],{gentle:e});this.ui.pins.activeEvent=t,this.ui.pins.setStopPlace(null),this.ui.card.open(t),this.fly(this.gentleView(t),!1,this.placeOf(t))}goTo(t,e=-1,{jump:n=!1,gentle:s=!1,stop:i=-1,forward:a=!1}={}){var c,l;const r=this.chapterAt(t);if(r){if(this.active=!0,this.chapter=t,this.step=li(e,-1,r.events.length-1),this.stop=-1,this.setPrologue(!!r.prologue),r.prologue){if(this.step<0)this.showPrologueChapter(r,n);else{const h=r.events[this.step],u=((c=h.stops)==null?void 0:c.length)||0;if(i==="last"&&u)return this.showStep(h,{jump:n,quiet:!0}),this.goStop(u-1,{jump:n});this.showStep(h,{jump:n,forward:a||s})}return this.notify()}if(this.step<0)this.showEra(r,n);else{const h=r.events[this.step],u=((l=h.stops)==null?void 0:l.length)||0;if(i==="last"&&u)return this.goStop(u-1,{jump:n});this.showEvent(h,{jump:n,gentle:s})}this.notify()}}applyView(t){var e;this.app.viewChosen||this.app.setView(t3(t,(e=this.app.mahele)==null?void 0:e.sources))}showEra(t,e){const n=this.ui;this.applyView(null),n.pins.activeEvent=null,n.pins.setStopPlace(null),n.card.openEra(t);const s=t.island?this.islandView(t.island,this.homeYaw()):this.chainView();this.setS(t.index,this.fly(s,e),e)}showEvent(t,{jump:e,gentle:n}){const s=this.ui;this.applyView(t),this.prefetch(t),s.pins.activeEvent=t,s.pins.setStopPlace(null),s.card.open(t);const i=this.fly(n?this.gentleView(t):this.eventView(t),e,this.placeOf(t)),a=this.app.timeline,[r,c]=a.window,l=Al(t);n&&l&&l[1]>=r&&l[0]<=c||this.setYear(this.stepYear(t,this.current),i,e)}goStop(t,{jump:e=!1}={}){const n=this.event,s=(n==null?void 0:n.stops)||[];if(!n||t<-1||t>=s.length)return;if(n.prologue)return this.goPrologueStop(n,t,{jump:e});const i=this.ui;this.active=!0,this.stop=t,this.applyView(n),i.pins.activeEvent=n,i.card.ev!==n&&i.card.open(n),i.card.setStop(t);const a=s[t],r=a?this.places.get(a.place):null,c=r&&Xe(r.geometry);if(i.pins.setStopPlace(c?r:null),this.prefetch(n),a){const l=c?a.camera?this.cameraView(r,a.camera):this.pointView(r,ci[a.zoom]??ci.island):null,h=this.fly(l,e,r);Number.isFinite(a.year)&&this.setYear(a.year,h,e)}this.notify()}prefetch(t){const e=this.app.districts;if(e)for(const n of(t==null?void 0:t.stops)||[]){const s=this.places.get(n.place),i=s&&Xe(s.geometry);if(!i||n.zoom==="far")continue;const[a,r]=this.app.data.proj.toWorld(i);if(e.prefetch(a,r,s.moku))return}}stepYear(t,e){const n=this.app.timeline,s=Br(t),i=Al(t)||[s,s],a=n.yearAt(e.index-.5),r=n.yearAt(e.index+.5);return s>=a&&s<=r?s:i[1]>=a&&i[0]<=r?li(e.era.year,Math.max(i[0],a),Math.min(i[1],r)):s}setYear(t,e,n){this.setS(this.app.timeline.sAtYear(t),e,n)}setS(t,e,n){const s=this.ui.timeline;n?(s.tween=null,this.app.timeline.set(t)):s.easeTo(t,li(e*.8,.6,2.4))}setPrologue(t){const e=this.app;!e.geology||t===e.prologue||(e.setPrologue(t),this.ui.timeline.setMode(t?"ma":"years"),t||e.geology.light([]))}showPrologueChapter(t,e){var r,c;const n=this.ui,s=this.app.geology;n.pins.activeEvent=null,n.pins.setStopPlace(null),n.card.openEra(t);const i=Number.isFinite(t.era.age)?t.era.age:((r=t.events[0])==null?void 0:r.age)??0;(c=t.events[0])!=null&&c.stage&&s.show(t.events[0].stage,i,{jump:e}),s.light([]);const a=this.fly(this.prologueChapterView(t),e);this.setAge(i,a,e)}showStep(t,{jump:e=!1,forward:n=!1,quiet:s=!1}={}){var l;const i=this.ui,a=this.app.geology;i.pins.activeEvent=null,i.pins.setStopPlace(null),i.card.open(t),t.stage&&a.show(t.stage,t.age,{jump:e}),a.light(t.landslides||[]);for(const h of this.nextStages(t))a.load(h);const r=s?0:this.setAge(t.age,this.fly(this.stepView(t),e),e);s&&this.setAge(t.age,1,e);const c=this.prevStep(t);t.kind==="slide"&&n&&((l=a.slideOf(t,c))!=null&&l.fresh)&&a.playSlide(t,{delay:e?0:r+.6,prev:c})}prevStep(t){const e=this.prologue.flatMap(n=>n.events);return e[e.indexOf(t)-1]||null}nextStages(t){var s,i;const e=this.prologue.flatMap(a=>a.events),n=e.indexOf(t);return[(s=e[n+1])==null?void 0:s.stage,(i=e[n-1])==null?void 0:i.stage].filter(Boolean)}goPrologueStop(t,e,{jump:n=!1}={}){const s=this.ui;this.active=!0,this.stop=e,s.card.ev!==t&&s.card.open(t),s.card.setStop(e);const i=t.stops[e];if(i){const a=Number.isFinite(i.age)?i.age:t.age,r=this.fly(this.prologueStopView(t,i,a),n);Number.isFinite(i.age)&&this.setAge(i.age,r,n)}else this.fly(this.stepView(t),n);this.notify()}replaySlide(){var e;const t=this.event;t!=null&&t.prologue&&t.kind==="slide"&&((e=this.app.geology)==null||e.playSlide(t,{delay:0,prev:this.prevStep(t)}))}setAge(t,e,n){const s=this.ui.timeline;if(n)return s.tween=null,this.app.geoClock.set(t),0;const i=li(e*.8,.6,2.4);return s.easeToAge(t,i),i}carried(t,e){const[n,s]=this.app.data.proj.toWorld(t),[i,a]=wr(this.app.data.geology.hotspot,e);return[n+i,s+a]}carriedPlace(t,e){const n=this.places.get(t),s=n&&Xe(n.geometry);return s?this.carried(s,e):null}prologueChapterView(t){const e=[];for(const c of t.events)for(const l of c.places||[]){const h=this.carriedPlace(l,c.age);h&&e.push(h)}const n=this.app.data.geology.hotspot.at;if(n&&e.push(n),e.length<2)return this.carriedChainView(t.era.age??0);const s=this.ui.freeBox(),i=this.homeYaw(s),a=this.app.rig.fit({points:e,yaw:i,box:s,reach:El,pad:1.4}),r=this.farDistance(s);return a.distance<r?this.app.rig.fit({rect:{x0:a.target.x,x1:a.target.x,z0:a.target.z,z1:a.target.z},distance:r,yaw:i,box:s}):(this.app.rig.reach(a.distance),a)}carriedChainView(t){const e=this.chainView(),[n,s]=wr(this.app.data.geology.hotspot,t);return e.target.x+=n,e.target.z+=s,e}stepView(t){const e=(t.places||[]).find(i=>this.places.has(i)),n=e?this.carriedPlace(e,t.age):null;if(!n)return this.carriedChainView(t.age);const s=this.ui.freeBox();return this.app.rig.fit({rect:{x0:n[0],x1:n[0],z0:n[1],z1:n[1]},distance:this.farDistance(s),yaw:this.homeYaw(s),tilt:this.tilt(),box:s})}prologueStopView(t,e,n){const s=e.camera||{},i=Array.isArray(s.target)&&s.target.length>=2&&s.target.every(Number.isFinite)?this.carried(s.target,n):e.place?this.carriedPlace(e.place,n):null;if(!i)return this.stepView(t);const a=this.ui.freeBox();return this.app.rig.fit({rect:{x0:i[0],x1:i[0],z0:i[1],z1:i[1]},distance:Number.isFinite(s.distance)?s.distance:this.farDistance(a),yaw:Number.isFinite(s.bearing)?-s.bearing*Math.PI/180:this.homeYaw(a),pitch:Number.isFinite(s.pitch)?s.pitch*Math.PI/2:void 0,tilt:this.tilt(),box:a})}homeYaw(t=this.ui.freeBox()){return this.chainView(t).yaw}tilt(){const t=this.app.rig.goal;return li(t.pitch-fi(t.distance),-.3,.3)}chainView(t=this.ui.freeBox()){const e=this.app.rig,n=this.app.world.chainShape(),s=e.fit({points:n.hull,along:[n.from,n.to],box:t,reach:El});return e.reach(s.distance),s}islandView(t,e=this.app.rig.goal.yaw,n=0){const s=this.islands.get(t);return this.app.rig.fit({rect:s.rect,yaw:e,tilt:n,box:this.ui.freeBox()})}pointView(t,e,{towardChain:n=0}={}){let[s,i]=this.app.data.proj.toWorld(Xe(t.geometry));if(n){const c=this.app.world.bounds,l=(c.x0+c.x1)/2-s,h=(c.z0+c.z1)/2-i,u=Math.min(n,900/Math.max(1,Math.hypot(l,h)));s+=l*u,i+=h*u}const a=this.ui.freeBox(),r=n?this.homeYaw(a):this.app.rig.goal.yaw;return this.app.rig.fit({rect:{x0:s,x1:s,z0:i,z1:i},distance:e,yaw:r,tilt:this.tilt(),box:a})}cameraView(t,e){const n=Array.isArray(e.target)&&e.target.length>=2&&e.target.every(Number.isFinite)?e.target:Xe(t.geometry),[s,i]=this.app.data.proj.toWorld(n);return this.app.rig.fit({rect:{x0:s,x1:s,z0:i,z1:i},distance:e.distance,yaw:-e.bearing*Math.PI/180,pitch:e.pitch*Math.PI/2,box:this.ui.freeBox()})}eventView(t){const e=this.placeOf(t);if(!e)return null;const n=rd(t.zoom);return n==="near"?this.pointView(e,ci.near):n==="island"&&this.islands.has(e.island)?this.islandView(e.island,this.app.rig.goal.yaw,this.tilt()):n==="island"?this.pointView(e,ci.island):!e.island&&e.placePrecision==="island"?this.chainView():this.pointView(e,this.farDistance(),{towardChain:.35})}farDistance(t=this.ui.freeBox()){const e=Math.tan(this.app.camera.fov*Math.PI/360),n=Math.max(60,Math.min(t.x1-t.x0,t.y1-t.y0));return Math.max(ci.far,JS*innerHeight/(2*e*n))}gentleView(t){const e=this.placeOf(t);if(!e)return null;const n=ci[rd(t.zoom)];return this.pointView(e,Math.min(this.app.rig.goal.distance,Math.max(n,ci.island)))}fly(t,e=!1,n=null){if(!t)return 1;const s=this.app.rig;if(e)return s.jump({x:t.target.x,z:t.target.z,distance:t.distance,yaw:t.yaw,pitch:t.pitch}),0;const i=s.goal,a=Math.hypot(i.target.x-t.target.x,i.target.z-t.target.z),r=Math.abs(Math.log(t.distance/Math.max(1,i.distance))),c=li(1.1+Math.sqrt(a)*.032+r*.28,1.1,3.4),l=this.app.districts,h=l&&t.distance<130?l.prefetch(t.target.x,t.target.z,n==null?void 0:n.moku):null;return s.flyTo(t,c,h?{ready:()=>{var u;return((u=l.cur)==null?void 0:u.d)===h&&l.cur.state==="ready"}}:{}),c}describe(){const t=this.chapters.length||this.prologue.length?this.chapterAt(this.active?this.chapter:this.nearestChapter()):null;if(!t)return null;const e=this.active&&this.step>=0?`${this.step+1} of ${t.events.length}`:"";if(t.prologue){const n=this.prologue.length,s=Xs(t.index+1);return{active:this.active,opening:this.active&&this.step<0,prologue:!0,word:"Prologue",number:s,of:n,ofLabel:Xs(n),chapter:n>1?`Prologue ${s} of ${Xs(n)}`:"Prologue",resume:n>1?`the prologue, ${s} of ${Xs(n)}`:"the prologue",name:t.name,step:e}}return{active:this.active,opening:this.active&&this.step<0,prologue:!1,word:"Chapter",number:t.index+1,of:this.chapters.length,ofLabel:String(this.chapters.length),chapter:`Chapter ${t.index+1} of ${this.chapters.length}`,resume:`chapter ${t.index+1} of ${this.chapters.length}`,name:t.name,step:e}}}const n3={arrival:"arrival",battle:"battle",founding:"founding",construction:"construction",eruption:"eruption",epidemic:"epidemic",law:"law",treaty:"treaty",voyage:"voyage",death:"death",protest:"protest",restoration:"restoration",other:"event"},s3={birth:"a shield rises",slide:"landslide",join:"islands join",part:"islands part",subsidence:"sinking",eruption:"eruption",now:"now"},cd={birth:"eruption",eruption:"eruption",slide:"slide",join:"isles",part:"isles",subsidence:"isles",now:"isles"},Jc=o=>o.prologue?Ll(cd[o.kind])?cd[o.kind]:"other":Ll(o.kind)?o.kind:"other";function Pl(o){return o?o.read!==void 0?o.read==="full"||o.read==="part":o.opened!==!1:!1}function i3(o){const t=String(o).match(/^(in the time of)(\s+)(.+)$/i);return t?{lead:t[1],gap:t[2],name:t[3]}:{lead:"",gap:"",name:String(o)}}class o3{constructor(t,e,n){this.app=e,this.ui=n,this.el=sn("section",{class:"card","aria-live":"polite"}),t.appendChild(this.el),this.places=new Map(e.data.places.map(s=>[s.id,s])),this.sources=new Map(e.data.sources.map(s=>[s.id,s])),this.events=new Map(e.data.events.map(s=>[s.id,s])),this.missing=new Set,this.mode=null,this.ev=null,this.stop=-1,this.chapter=null,this.list=null,this.el.addEventListener("click",s=>this.click(s))}get isOpen(){return this.el.classList.contains("show")}open(t){this.set("event",{ev:t})}setStop(t){this.stop=t,this.render()}openEra(t){this.set("era",{chapter:t})}openList(t){this.set("cluster",{list:t})}set(t,{ev:e=null,chapter:n=null,list:s=null}){this.mode=t,this.ev=e,this.chapter=n,this.list=s,this.stop=-1,this.render()}close(){var e,n;const t=this.ev;this.el.classList.remove("show"),this.mode=null,this.ev=null,this.chapter=null,this.list=null,(n=(e=this.ui).onCardClosed)==null||n.call(e,t)}click(t){var s;const e=t.target.closest("button");if(!e||!this.el.contains(e))return;const n=this.ui.tour;if(e.classList.contains("card-close"))this.close();else if(e.classList.contains("prev"))n.back();else if(e.classList.contains("next"))n.next();else if(e.classList.contains("replay"))n.replaySlide();else if(e.dataset.ev){const i=this.events.get(e.dataset.ev)||((s=n.steps)==null?void 0:s.get(e.dataset.ev));i&&n.open(i,{gentle:this.mode==="cluster"})}}cited(t){const e=this.sources.get(t);return!e&&!this.missing.has(t)&&(this.missing.add(t),this.app.warn(`a card cites ${t}, which is not in sources.json`)),Pl(e)?e:null}sourceLine(t){const e=this.cited(typeof t=="string"?t:t.id);if(!e)return"";const n=typeof t=="object"&&t.where?`, ${mt(t.where)}`:"",s=e.url&&/^https?:/.test(e.url)?`<a href="${mt(e.url)}" target="_blank" rel="noopener">${mt(e.title)}</a>`:mt(e.title),i=e.author?`${mt(e.author)}, `:"",a=e.year?` (${mt(e.year)})`:"";return`<li>${i}<span class="src-title">${s}</span>${a}${n}</li>`}sourcesSection(t){const e=(t||[]).map(n=>this.sourceLine(n)).join("");return e?`<div class="card-sec"><h2>Sources</h2><ul class="sources">${e}</ul></div>`:""}eventRows(t,{gloss:e=!0}={}){return t.map(n=>`<li><button class="ev-row" data-ev="${mt(n.id)}">
          <span class="ev-ic">${Fn(Jc(n),16)}</span>
          <span class="ev-y">${mt(n.prologue?mS(n.age):n0(n))}</span>
          <span class="ev-t"><b>${mt(n.title)}</b>${e&&n.gloss?`<em>${mt(n.gloss)}</em>`:""}</span>
        </button></li>`).join("")}footer(){var a,r;const t=this.ui.tour;if(!(t!=null&&t.active))return"";const e=t.current;let n,s="Next";const i=((a=t.prologue)==null?void 0:a.length)||0;if(this.mode==="era"&&this.chapter===e&&t.step<0)e.prologue?n=`<span class="ch-count">Prologue${i>1?` <b>${Xs(e.index+1)}</b> of ${Xs(i)}`:""}</span>`:n=`<span class="ch-count">Chapter <b>${e.index+1}</b> of ${t.chapters.length}</span>`;else if(this.mode==="event"&&this.ev&&this.ev===t.event){const c=((r=this.ev.stops)==null?void 0:r.length)||0;if(t.stop>=0)n=mt(`stop ${t.stop+1} of ${c}`);else{const l=e.prologue?i>1?`prologue ${Xs(e.index+1)}`:"the prologue":`chapter ${e.index+1}`;n=mt(`${t.step+1} of ${e.events.length} in ${l}`),c&&(s=`Walk ${c} stops`)}}else return"";return`<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${t.atStart?"disabled":""}>${Fn("prev",18)}</button>
      <span class="count">${n}</span>
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${t.atEnd?"disabled":""}><span>${mt(s)}</span>${Fn("next",18)}</button>
    </footer>`}render(){if(this.mode==="era")this.el.innerHTML=this.eraHTML();else if(this.mode==="cluster")this.el.innerHTML=this.clusterHTML();else if(this.mode==="event"&&this.ev)this.el.innerHTML=this.eventHTML();else return;this.el.dataset.mode=this.mode,this.el.classList.toggle("chapter",this.mode==="era"),this.el.classList.add("show"),this.el.scrollTop=0}header(t,e,n){return`<header>
        <div class="card-icon">${Fn(t,26)}</div>
        <div class="card-titles"><h1>${mt(e)}</h1>${n?`<p class="gloss">${mt(n)}</p>`:""}</div>
        <button class="card-close" aria-label="Close">${Fn("close",18)}</button>
      </header>`}eventHTML(){if(this.ev.prologue)return this.stepHTML();const t=this.ev,e=(t.where||[]).map(c=>{const l=this.places.get(c.place);return l?`${mt(l.name)}${c.role?` <em>${mt(c.role)}</em>`:""}`:null}).filter(Boolean),n=Object.entries(t.confidence||{}).map(([c,l])=>`<span class="conf ${mt(l)}"><b>${mt(c)}</b> ${mt(l)}</span>`).join(""),s=(t.tellings||[]).map(c=>{const l=this.cited(c.source);return l?`<li><span class="src-title">${mt(l.title)}</span>: ${mt(c.says)}</li>`:""}).join(""),i=t.stops||[],a=this.stop>=0?i[this.stop]:null,r=a?this.places.get(a.place):null;return`
      ${this.header(Jc(t),t.title,t.gloss)}
      <div class="card-meta"><span class="when">${mt(fS(t))}</span><span class="kind">${mt(n3[t.kind]||t.kind||"event")}</span></div>
      ${e.length?`<div class="card-where">${e.join("<i>·</i>")}</div>`:""}
      ${a?`<div class="stop"><div class="stop-n">${this.stop+1} / ${i.length}${r?` · ${mt(r.name)}`:""}</div><p>${mt(a.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${mt(t.summary)}</p>`:""}</div>
      ${n?`<div class="card-conf">${n}</div>`:""}
      ${s?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${s}</ul></div>`:""}
      ${this.sourcesSection(t.sources)}
      ${this.footer()}`}stepHTML(){var m,x,g,p;const t=this.ev,e=this.ui.tour,n=(t.places||[]).map(v=>this.places.get(v)).filter(Boolean),s=(m=this.app.data.geology)==null?void 0:m.stages.find(v=>v.id===t.stage),i=(t.tellings||[]).map(v=>{const w=this.cited(v.source);return w?`<li><span class="src-title">${mt(w.title)}</span>: ${mt(v.says)}</li>`:""}).join(""),a=t.stops||[],r=this.stop>=0?a[this.stop]:null,c=r!=null&&r.place?this.places.get(r.place):null,l=Object.entries({...t.confidence||{},...s!=null&&s.confidence&&!s.seafloor?{shape:s.confidence}:{}}).map(([v,w])=>`<span class="conf ${mt(w)}"><b>${mt(v)}</b> ${mt(w)}</span>`).join(""),h=(s==null?void 0:s.name)||(s?`the islands modelled as they stood ${_i(s.age)}`:""),u=s&&!s.seafloor?`<div class="card-stage"${s.rule?` title="${mt(s.rule)}"`:""}><span>drawn on</span> ${mt(h)}</div>`:"",f=t.kind==="slide"&&((x=this.app.geology)!=null&&x.canSlide(t))?`<button class="replay" type="button">${Fn("replay",16)}<span>Run the slide again</span></button>`:"",d=((g=t.sources)!=null&&g.length?t.sources:(p=e==null?void 0:e.current)!=null&&p.prologue?e.current.era.sources:[])||[];return`
      ${this.header(Jc(t),t.title,t.gloss)}
      <div class="card-meta"><span class="when">${mt(_i(t.age))}</span><span class="kind">${mt(s3[t.kind]||t.kind||"step")}</span></div>
      ${n.length?`<div class="card-where">${n.map(v=>mt(v.name)).join("<i>·</i>")}</div>`:""}
      ${r?`<div class="stop"><div class="stop-n">${this.stop+1} / ${a.length}${c?` · ${mt(c.name)}`:""}</div><p>${mt(r.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${mt(t.summary)}</p>`:""}${f}</div>
      ${u}
      ${l?`<div class="card-conf">${l}</div>`:""}
      ${i?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${i}</ul></div>`:""}
      ${this.sourcesSection(d)}
      ${this.footer()}`}eraHTML(){var u,f;const t=this.chapter,e=t.era,n=i3(e.label||e.id),i=String(e.note||"").match(/^([ʻʼ'‘“"(]*.)([\s\S]*)$/u),a=i?`<p><span class="initial">${mt(i[1])}</span>${mt(i[2])}</p>`:"",r=((f=(u=this.ui.tour)==null?void 0:u.prologue)==null?void 0:f.length)||0,c=t.prologue?"Prologue":"Chapter",l=t.prologue?r>1?Xs(t.index+1):"":String(t.index+1),h=t.prologue?gS(e.ageSpan)||_i(e.age):Jo(e.year,Math.max(10,e.yearPrecision??10));return`
      <header class="ch-head${t.prologue?" prologue":""}">
        <div class="ch-mark"><span class="ch-word">${c}</span>${l?`<span class="ch-num">${mt(l)}</span>`:""}</div>
        <h1 class="ch-title">${n.lead?`<span class="ch-lead">${mt(n.lead)}</span>${mt(n.gap)}`:""}<span class="ch-name">${mt(n.name)}</span></h1>
        <div class="ch-year">${mt(h)}</div>
        <button class="card-close" aria-label="Close">${Fn("close",18)}</button>
      </header>
      <div class="card-body ch-note">${a}</div>
      ${t.events.length?`<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(t.events,{gloss:!1})}</ul></div>`:""}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`}clusterHTML(){const t=this.list||[],e=[];for(const s of t){const i=(s.where||[]).map(a=>this.places.get(a.place)).find(Boolean);i&&!e.includes(i.name)&&e.push(i.name)}const n=e.length>4?`${e.slice(0,4).join(" · ")} · and ${e.length-4} more`:e.join(" · ");return`
      ${this.header("pins",`${t.length} events`,n)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(t)}</ul></div>`}}const a3=.05,ld=.25,hd="The land division of 1848, by ahupuaʻa",Qc=new Map(ra.map(o=>[o.id,o]));class r3{constructor(t){if(this.app=t,t.ui=this,this.build(),this.bind(),t.updaters.push(e=>this.update(e)),!t.params.has("year")&&!t.params.has("cam")&&this.tour.chapters.length)this.tour.begin(),this.timeline.el.classList.add("invite");else if(!t.params.has("cam")){const e=this.tour.chainView();t.rig.jump({x:e.target.x,z:e.target.z,distance:e.distance,yaw:e.yaw,pitch:e.pitch})}}build(){const t=this.app,e=sn("div",{id:"ui"});document.body.appendChild(e),this.root=e;const n=t.world.archPack.name;this.brand=sn("div",{class:"brand"},`<div class="brand-name">Holo i ke Au</div><div class="brand-sub"><span class="where">${mt(n)}</span><span class="loading"></span></div>`),e.appendChild(this.brand),this.tools=sn("div",{class:"tools"});const s=(a,r,c,l)=>sn("button",{class:`tool${l?" on":""}`,"data-tool":a,title:c,"aria-label":c,"aria-pressed":String(!!l)},Fn(r,20));this.tools.append(s("lines","lines","Moku and ahupuaʻa boundaries",t.overlay.lines),s("routes","routes","Every voyage, fleet and ship at sea in these years",t.overlay.routes),s("pins","pins","Events",t.overlay.pins),s("home","home","The whole chain"),s("help","help","About"),s("full","expand","Full screen")),e.appendChild(this.tools),this.legend=sn("div",{class:"legend"}),this.legend.innerHTML=`
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
        <button type="button" data-view="mahele" aria-pressed="false" title="${hd}">Māhele</button>
      </div>
      <div class="lg-body"></div>`,this.legendBody=qe(".lg-body",this.legend),this.legend.inert=!0,e.appendChild(this.legend),this.inspector=sn("div",{class:"inspector"}),e.appendChild(this.inspector),this.timeline=new KS(e,t,this),this.pins=new ZS(e,t,{onOpen:a=>this.openEvent(a),onCluster:a=>this.openCluster(a)}),this.card=new o3(e,t,this),this.tour=new e3(t,this),t.tour=this.tour,this.tour.onChange(a=>this.timeline.refreshTour(a)),t.timeline.onChange(()=>this.timeline.refreshTour(this.tour)),this.timeline.refreshTour(this.tour),this.help=sn("div",{class:"help hidden"});const i=this.credits();this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${Fn("close",18)}</button>
        <h2>Holo i ke Au</h2>
        <p><em>Holo i ke au</em>: sail on the current, into the era. <em>Au</em> is both a period of time and a current, and the title rides it.</p>
        <p>The Hawaiian Islands from real terrain, across the eras from the first canoes to 1898. Far out, each moku takes the colour of the chiefdom or kingdom that held it; close in, the boundaries of moku and ahupuaʻa lie on the land. Pins are events of the chosen era: open one for its story, how sure the record is, and its sources. A number stands for several events in one spot; open it for the list.</p>
        <p>The switch on the legend turns the far view from the <b>Chiefdoms</b> to the <b>Land</b>: where it was cultivated, where people lived and how many, and the native forest, in the chosen year, blended between layers made for 1778, 1853, 1896 and now. A layer marked <em>modelled</em> was drawn by a written rule where no map of its time exists. From ${pr} it turns to the <b>Māhele</b> too: each ahupuaʻa in the class the land division gave it, crown, government or konohiki land, or mixed where the records give it more than one.</p>
        <p><b>Next</b> walks the story an era at a time: each era opens with its card, then its events in order, the year and the camera moving to each. Look around as you like between steps; the timeline is free too, and Next picks the story up again from the nearest era.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> era by era</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span>
        </div>
        ${i?`<h3>Data</h3><ul class="credits">${i}</ul>`:""}
        <div class="land-credits"></div>
        <div class="mahele-credits"></div>
      </div>`,e.appendChild(this.help),this.refreshLegend()}creditable(t){return this.sourceById||(this.sourceById=new Map(this.app.data.sources.map(e=>[e.id,e]))),Pl(this.sourceById.get(t.id)||t)}credits(){var s,i;const t=this.app.data,e=new Map,n=a=>{a&&a.id&&!e.has(a.id)&&this.creditable(a)&&e.set(a.id,a)};for(const a of t.packs)for(const r of a.sources||[])n(r);for(const a of((s=t.moku)==null?void 0:s.sources)||[])n(a);for(const a of((i=t.ahupuaa)==null?void 0:i.sources)||[])n(a);return tl([...e.values()])}landCredits(){const t=qe(".land-credits",this.help),e=this.app.land.manifest;if(!t||!e||t.childElementCount)return;const n=new Map;for(const s of Object.values(e.methods||{}))for(const i of Object.values(s||{}))for(const a of(i==null?void 0:i.sources)||[])a!=null&&a.id&&/^https?:/.test(a.url||"")&&!n.has(a.id)&&this.creditable(a)&&n.set(a.id,a);n.size&&(t.innerHTML=`<h3>Land layers</h3><ul class="credits">${tl([...n.values()])}</ul>`)}maheleCredits(){const t=qe(".mahele-credits",this.help),e=this.app.mahele.sources;if(!t||!e||t.childElementCount)return;const n=new Map(this.app.data.sources.map(i=>[i.id,i])),s=[...e].map(i=>n.get(i)).filter(i=>Pl(i));s.length&&(t.innerHTML=`<h3>The Māhele</h3><ul class="credits">${tl(s)}</ul>`)}bind(){const t=this.app;this.tools.addEventListener("click",s=>{var r,c,l;const i=s.target.closest("[data-tool]");if(!i)return;const a=i.dataset.tool;if(a==="help")this.help.classList.toggle("hidden");else if(a==="full")document.fullscreenElement?(r=document.exitFullscreen)==null||r.call(document):(l=(c=document.documentElement).requestFullscreen)==null||l.call(c).catch(()=>{});else if(a==="home"){const h=t.rig;h.home=this.tour.chainView(),h.flyTo({target:h.home.target,distance:h.home.distance,yaw:h.home.yaw,pitch:h.home.pitch},3)}else a in t.overlay&&(t.overlay[a]=!t.overlay[a],i.classList.toggle("on",t.overlay[a]),i.setAttribute("aria-pressed",String(t.overlay[a])))}),this.legend.addEventListener("click",s=>{const i=s.target.closest("[data-view]");if(!i||i.disabled)return;const a=i.dataset.view;t.setView(t.farView===a?null:a,{user:!0})}),t.onView(()=>this.refreshLegend()),t.land.onChange(()=>{this.refreshLegend(),this.landCredits()}),t.mahele.onChange(()=>{this.refreshLegend(),this.maheleCredits();const s=this.tour;s.active&&s.event&&s.applyView(s.event)}),this.help.addEventListener("click",s=>{(s.target===this.help||s.target.closest(".help-close"))&&this.help.classList.add("hidden")}),t.timeline.onChange(()=>{(t.timeline.era!==this.legendEra||t.mahele.availableAt()!==this.legendMahele)&&this.refreshLegend()});const e=t.canvas;let n=0;e.addEventListener("pointermove",s=>{if(s.buttons||s.pointerType==="touch")return this.hover(null);const i=performance.now();i-n<70||(n=i,this.hover(s.clientX,s.clientY))}),e.addEventListener("pointerleave",()=>this.hover(null)),e.addEventListener("pointerdown",()=>this.hover(null)),addEventListener("keydown",s=>{var a,r,c,l;if(s.key==="Escape"){this.help.classList.contains("hidden")?this.card.close():this.help.classList.add("hidden");return}if((r=(a=s.target).closest)!=null&&r.call(a,"input, textarea, select")||s.altKey||s.ctrlKey||s.metaKey||!this.help.classList.contains("hidden"))return;const i=this.tour;s.key==="ArrowRight"||s.key===" "&&!((l=(c=s.target).closest)!=null&&l.call(c,"button, a"))?(s.preventDefault(),this.timeline.el.classList.remove("invite"),i.next()):s.key==="ArrowLeft"?(s.preventDefault(),i.back()):s.key===","||s.key==="<"?i.skip(-1):(s.key==="."||s.key===">")&&i.skip(1)})}openEvent(t){this.tour.open(t,{gentle:!0})}openCluster(t){const e=this.tour;this.pins.activeEvent=e.active?e.event:null,this.card.openList(t)}onCardClosed(){const t=this.tour;t.active&&t.event||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}onScrub(t=this.app.timeline.s){var s;this.tour.leave();const n=this.app.timeline;this.card.mode==="era"&&((s=this.card.chapter)==null?void 0:s.era)!==n.eraAt(t)&&this.card.close(),this.card.ev||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}onScrubAge(t=this.app.geoClock.age){var n;const e=this.tour;e.leave(),this.card.mode==="era"&&((n=this.card.chapter)!=null&&n.prologue)&&this.card.chapter!==e.prologueAt(t)&&this.card.close()}freeBox(){const t=innerWidth,e=innerHeight,n={x0:16,y0:72,x1:t-16,y1:e-16},s=this.timeline.el;!s.hidden&&s.offsetHeight&&(n.y1=Math.min(n.y1,s.offsetTop-14));const i=this.card.el;if(this.syncCarded(),this.card.isOpen&&i.offsetWidth)if(i.offsetLeft>t*.35)n.x1=Math.min(n.x1,i.offsetLeft-16);else{n.y1=Math.min(n.y1,i.offsetTop-12);const a=this.legend;a.offsetHeight&&a.offsetTop<e/3&&(n.y0=Math.max(n.y0,a.offsetTop+a.offsetHeight+6))}return n.y1-n.y0<120&&(n.y1=n.y0+120),n}syncCarded(){const t=this.card.isOpen;t!==this.root.classList.contains("carded")&&this.root.classList.toggle("carded",t)}farStrength(t=this.app.rig.state.distance){const e=this.app.farView;return e==="land"||e==="mahele"?vr(t):Cl(t)}inspectorAllowed(){var s,i;const t=this.app,e=this.farStrength();return!!((s=t.districts)!=null&&s.on||((i=t.districts)==null?void 0:i.k)>0)||e<a3?this.nearHeld=!0:e>ld&&(this.nearHeld=!1),!this.nearHeld}hideInspector(){this.app.shared.uniforms.uHoverMoku.value=0,this.inspector.classList.remove("show"),this.inspectorKey=null}hover(t,e){var g;const n=this.app,s=n.shared.uniforms;if(t==null||n.prologue||!this.inspectorAllowed())return this.hideInspector();const i=n.rig.pickGround(t,e),a=i&&n.world.metresAt(i.x,i.z)>0?n.polity.mokuAt(i.x,i.z):null,r=n.farView,c=r==="land"&&n.landK>.25,l=r==="mahele"&&n.regionOn==="mahele"&&n.polityK>.25,h=Cl(n.rig.state.distance)<.05;if(s.uHoverMoku.value=a&&!c&&!h&&n.regionOn==="chiefdoms"?a.index:0,!a){this.inspector.classList.remove("show");return}const u=c?n.land.valuesAt(i.x,i.z):null,f=l?n.mahele.unitAt(i.x,i.z):null,d=`${a.index}:${(g=n.timeline.era)==null?void 0:g.id}:${u?JSON.stringify(u):""}:${f?f.gisId:""}`;if(this.inspectorKey!==d){this.inspectorKey=d;const p=n.polity.holder(n.timeline.era,a),v=(w,b)=>`<div class="in-row"><span class="in-k">${w}</span>${b}</div>`;this.inspector.innerHTML=f?c3(f,a,v):`
        <div class="in-head"><b>${mt(a.name)}</b><span class="in-island">${mt(a.island||"")}</span></div>
        ${v("moku",p?`<span class="in-pol"><i style="background:${mt(p.colour)}"></i>${mt(p.name)}</span>`:'<span class="in-none">no polity recorded</span>')}
        ${u?v("fields",ud(u.cultivation))+v("people",l3(u.people))+v("forest",ud(u.forest)):""}`}this.inspector.classList.add("show");const m=Math.min(innerWidth-250,t+18),x=Math.max(70,Math.min(innerHeight-120,e+18));this.inspector.style.transform=`translate(${m}px, ${x}px)`}refreshLegend(){var r,c;const t=this.app,e=t.timeline.era;this.legendEra=e,this.legendMahele=t.mahele.availableAt();const n=t.farView;for(const l of this.legend.querySelectorAll("[data-view]"))l.setAttribute("aria-pressed",String(n===l.dataset.view)),l.classList.toggle("on",n===l.dataset.view);const s=qe('[data-view="land"]',this.legend);s.disabled=t.land.available===!1,s.title=s.disabled?"No land layers in this data":"Cultivation, settlement and forest in the chosen year";const i=qe('[data-view="mahele"]',this.legend);i.disabled=!this.legendMahele,i.title=t.mahele.available===!1?"No Māhele in this data":this.legendMahele?hd:`The land division, from ${pr}`;let a="";if(n==="mahele"){const l=this.islandInView(),h=t.mahele.counts(l==null?void 0:l.pack.id);h.all&&(a=`<div class="lg-title">The Māhele of ${pr}</div>${ra.map(u=>`<div class="lg lg-mahele"><i style="background:${mt(u.colour)}"></i><b>${mt(u.name)}</b><em>${h.byClass[u.id].toLocaleString("en-US")}</em></div>`).join("")}<div class="lg-note">${mt(`${h.all.toLocaleString("en-US")} ahupuaʻa ${l?`on ${l.pack.name}`:"on all the islands"}`)}</div>`),this.legendIsland=(l==null?void 0:l.pack.id)??null}else if(n==="chiefdoms"){const l=t.polity.politiesIn(e);l.length&&(a=`<div class="lg-title">${mt((e==null?void 0:e.label)||"")}</div>${l.map(h=>`<div class="lg"><i style="background:${mt(h.colour)}"></i><b>${mt(h.name)}</b></div>`).join("")}`)}else if(n==="land"){const l=t.land.describe(),h=((r=t.works)==null?void 0:r.legendRows())??[],u=((c=t.crops)==null?void 0:c.grown())??[];if(this.legendLand=JSON.stringify([l,u,h]),l){const f=l.years.length>1?`between the ${l.years[0]} and ${l.years[1]} layers`:`the ${l.years[0]} layers`,d=t.land.bound?l.early?`${f}, thinned for the early centuries`:f:"the layers are on their way";a=`<div class="lg-title">${mt((e==null?void 0:e.label)||"")}</div>${l.layers.map(m=>`<div class="lg lg-land"><i class="sw-${m.id}"></i><b>${mt(m.name)}</b>${m.note?`<em>${mt(m.note)}</em>`:""}</div>${m.id==="cultivation"&&u.length?`<div class="lg-crops">${mt(u.join(" · "))}</div>`:""}`).join("")}${h.map(m=>`<div class="lg lg-land lg-works"><i class="sw-${m.id}"></i><b>${mt(m.name)}</b></div>`).join("")}<div class="lg-note">${mt(d)}</div>`}}this.legendBody.innerHTML=a}setLoading(t){qe(".loading",this.brand).textContent=t||""}update(t){var i,a;const e=this.app,n=performance.now();this.timeline.update(t),this.pins.update(e.overlay.pins&&!e.prologue);const s=this.farStrength()>ld&&!e.prologue;if(s!==this.legend.classList.contains("show")&&(this.legend.classList.toggle("show",s),this.legend.inert=!s),!this.inspectorAllowed()&&(this.inspector.classList.contains("show")||e.shared.uniforms.uHoverMoku.value)&&this.hideInspector(),this.syncCarded(),e.farView==="land"&&n-(this.landAt||0)>250&&(this.landAt=n,(JSON.stringify([e.land.describe(),((i=e.crops)==null?void 0:i.grown())??[],((a=e.works)==null?void 0:a.legendRows())??[]])!==this.legendLand||!e.land.bound!==this.legendWaiting)&&(this.legendWaiting=!e.land.bound,this.refreshLegend())),n-(this.whereAt||0)>300){this.whereAt=n;const r=this.islandInView();qe(".where",this.brand).textContent=r?r.pack.name:e.world.archPack.name,e.farView==="mahele"&&((r==null?void 0:r.pack.id)??null)!==this.legendIsland&&this.refreshLegend()}}islandInView(){const t=this.app.rig.state;return t.distance<1400?this.app.world.islandAt(t.target.x,t.target.z):null}}function c3(o,t,e){const n=o.entry,s=Qc.get(o.cls),i=l=>`<i style="background:${mt(l.colour)}"></i>`;let a=`<span class="in-pol">${i(s)}${mt(s.name)}</span>`;if(o.cls==="mixed"){const l=[...new Set(((n==null?void 0:n.parts)||[]).map(h=>h.class))].map(h=>Qc.get(h)).filter(Boolean);l.length>1&&(a=`<span class="in-pol">${i(s)}${mt(s.name)}</span><span class="in-v">${mt(l.map(h=>h.name.toLowerCase()).join(" and "))}</span>`)}const r=n&&(o.cls==="konohiki"||o.cls==="mixed")?[].concat(n.awardee||[]).filter(Boolean):[],c=((n==null?void 0:n.later)||[]).map(l=>{var h;return`${((h=Qc.get(l.class))==null?void 0:h.name.toLowerCase())||l.class}, ${l.year}`});return`
    <div class="in-head"><b>${mt(o.name||"Ahupuaʻa")}</b><span class="in-island">${mt(o.island||t.island||"")}</span></div>
    ${e("moku",`<span class="in-v">${mt(o.moku||t.name)}</span>`)}
    ${e("land",a)}
    ${r.length?e("awarded",`<span class="in-v">${mt(r.join(", "))}</span>`):""}
    ${c.length?e("later",`<span class="in-v">${mt(c.join("; "))}</span>`):""}`}function ud(o){const t=o*100;return t<.5?'<span class="in-none">none</span>':t<1?"under 1%":`${Math.round(t)}%`}function l3(o){return o<.5?'<span class="in-none">none</span>':`about ${(o<10?Math.round(o):Number(o.toPrecision(2))).toLocaleString("en-US")} a km²`}function tl(o){return o.map(t=>`<li>${t.url&&/^https?:/.test(t.url)?`<a href="${mt(t.url)}" target="_blank" rel="noopener">${mt(t.title||t.id)}</a>`:mt(t.title||t.id)}${t.licence?` <em>${mt(t.licence)}</em>`:""}${t.fetched?` <em>fetched ${mt(t.fetched)}</em>`:""}</li>`).join("")}const Wr=document.getElementById("boot"),o0=Wr.querySelector(".boot-bar span"),a0=Wr.querySelector(".boot-stage"),cr=(o,t)=>{a0.textContent=o,o0.style.width=`${Math.round(t*100)}%`},Ji=o=>{console.warn(o)};async function h3(){const o=performance.now();cr("reading the gazetteer",.05);const t=await b0(p0(),Ji);if(!t.packs.length)throw new Error("the manifest lists no packs");const e=new XS(document.getElementById("scene"),t,{warn:Ji});window.__app=e;const n=new E0(2,Ji);cr("raising the islands",.25);const s=e.world.archPack;s.data=await n.decode(s),cr("placing the boundaries",.8),await new Promise(c=>setTimeout(c,0)),e.start();const i=new r3(e);e.ui=i,console.log(`archipelago ready in ${((performance.now()-o)/1e3).toFixed(1)} s`),cr("",1);let a=0;const r=()=>{if(++a<4)return requestAnimationFrame(r);Wr.classList.add("gone"),setTimeout(()=>Wr.remove(),1200),u3(e,i,n),e.patches.load().catch(c=>{Ji(`patches: ${c.message}`),e.patches.resolveReady([])}),e.districts.load().catch(c=>Ji(`districts: ${c.message}`))};requestAnimationFrame(r)}async function u3(o,t,e){const n=o.rig.state.target,s=r=>Math.hypot((r.rect.x0+r.rect.x1)/2-n.x,(r.rect.z0+r.rect.z1)/2-n.z),i=[...o.world.islandPacks].sort((r,c)=>s(r)-s(c));let a=0;t.setLoading(i.length?`· ${i.length} islands to come`:""),await Promise.all(i.map(async r=>{try{r.data=await e.decode(r),o.addIsland(r)}catch(c){Ji(`${r.id}: ${c.message}`)}a++,t.setLoading(a<i.length?`· ${i.length-a} islands to come`:"")})),e.dispose(),o.islandsLoaded=!0,o.land.load()}h3().catch(o=>{console.error(o),a0.textContent="something went wrong — see the console",o0.style.background="#c0584a"});
