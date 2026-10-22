var rd=Object.defineProperty;var cd=(s,t,e)=>t in s?rd(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var Ks=(s,t,e)=>cd(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const Os=100,ld=8,jc=9e3,So=1.3,hd=5.5,Yc=100,ud=6e3;function Kc(s){const t=Math.log(Math.max(1,s)/Yc)/Math.log(ud/Yc),e=Math.max(0,Math.min(1,t));return So+(hd-So)*e*e*(3-2*e)}const Lu=2,Gn=5,zs=32,jn=16,Pu=1.6,qe={far:115,near:75,rig:[95,135],margin:7,band:.5,prefetch:320,linger:25,hold:90},fd=.024;function dd(){const t=new URLSearchParams(location.search).get("data")||"./data/";return t.endsWith("/")?t:`${t}/`}const pd=Math.PI/180;class md{constructor({lat0:t=20.5,lon0:e=-157.5}={}){this.lat0=t,this.lon0=e,this.kx=Math.cos(t*pd)*111320/Os,this.kz=110574/Os}x(t){return(t-this.lon0)*this.kx}z(t){return-(t-this.lat0)*this.kz}toWorld(t){return[this.x(t[0]),this.z(t[1])]}toLonLat(t,e){return[t/this.kx+this.lon0,-e/this.kz+this.lat0]}rect([t,e,n,i]){return{x0:this.x(t),z0:this.z(i),x1:this.x(n),z1:this.z(e)}}}function ba(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[ʻʼ‘’'`]/g,"").toLowerCase().replace(/[^a-z]/g,"")}function fn(s){if(!s)return null;if(s.type==="Point")return s.coordinates;if(s.type==="LineString")return s.coordinates[Math.floor(s.coordinates.length/2)];if(s.type==="MultiPoint")return s.coordinates[0];const t=s.type==="Polygon"?[s.coordinates[0]]:s.type==="MultiPolygon"?s.coordinates.map(o=>o[0]):null;if(!t)return null;let e=0,n=0,i=0;for(const o of t)for(let a=0,r=o.length-1;a<o.length;r=a++){const c=o[r][0]*o[a][1]-o[a][0]*o[r][1];e+=c,n+=(o[r][0]+o[a][0])*c,i+=(o[r][1]+o[a][1])*c}return Math.abs(e)<1e-12?t[0][0]:[n/(3*e),i/(3*e)]}async function Kn(s){var l;const t=await fetch(s);if(!t.ok)throw new Error(`${s}: HTTP ${t.status}`);const e=await t.blob(),n=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),i=n.width,o=n.height;let a;typeof OffscreenCanvas<"u"?a=new OffscreenCanvas(i,o):(a=document.createElement("canvas"),a.width=i,a.height=o);const r=a.getContext("2d",{willReadFrequently:!0});r.imageSmoothingEnabled=!1,r.drawImage(n,0,0);const c=r.getImageData(0,0,i,o).data;return(l=n.close)==null||l.call(n),{px:c,W:i,H:o}}function Du(s,t,e,n,i,o=4){const a=new Float32Array(t*e);for(let r=0,c=0;r<t*e;r++,c+=o)a[r]=(s[c]*256+s[c+1])*n+i;return a}function Iu(s,t,e,n=4){const i=new Uint8Array(t*e);for(let o=0,a=0;o<t*e;o++,a+=n)i[o]=s[a];return i}function gd(s){let t=0,e=0;for(let n=0;n<s.length;n+=7)s[n]>0||(t++,s[n]>-1.6&&e++);return t>100&&e>t*.95}function vd(s,t,e,n,i){const o=hn(t,e,a=>s[a]>0,n,i);for(let a=0;a<s.length;a++){if(s[a]>0)continue;const r=o[a]/1e3;s[a]=-(1+30*r+3600*(1-Math.exp(-Math.max(0,r-.6)/6)))}}function zn(s,t,e,n,i=1){let o=Float32Array.from(s);const a=new Float32Array(t*e),r=1/(2*n+1);for(let c=0;c<i;c++){for(let l=0;l<e;l++){const h=l*t;let u=0;for(let f=-n;f<=n;f++)u+=o[h+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)a[h+f]=u*r,u+=o[h+Math.min(t-1,f+n+1)]-o[h+Math.max(0,f-n)]}for(let l=0;l<t;l++){let h=0;for(let u=-n;u<=n;u++)h+=a[Math.min(e-1,Math.max(0,u))*t+l];for(let u=0;u<e;u++)o[u*t+l]=h*r,h+=a[Math.min(e-1,u+n+1)*t+l]-a[Math.max(0,u-n)*t+l]}}return o}function Zc(s,t,e,n,i,o){const a=o*o;let r=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let c=1;c<t;c++){let l=(s[c]+c*c*a-(s[n[r]]+n[r]*n[r]*a))/(2*a*(c-n[r]));for(;l<=i[r];)r--,l=(s[c]+c*c*a-(s[n[r]]+n[r]*n[r]*a))/(2*a*(c-n[r]));r++,n[r]=c,i[r]=l,i[r+1]=1/0}r=0;for(let c=0;c<t;c++){for(;i[r+1]<c;)r++;const l=(c-n[r])*o;e[c]=l*l+s[n[r]]}}function hn(s,t,e,n=1,i=1){const a=new Float64Array(s*t);for(let m=0;m<s*t;m++)a[m]=e(m)?0:1e20;const r=Math.max(s,t),c=new Float64Array(r),l=new Float64Array(r),h=new Int32Array(r),u=new Float64Array(r+1);for(let m=0;m<s;m++){for(let g=0;g<t;g++)c[g]=a[g*s+m];Zc(c,t,l,h,u,i);for(let g=0;g<t;g++)a[g*s+m]=l[g]}const f=new Float32Array(s*t);for(let m=0;m<t;m++){const g=m*s;for(let x=0;x<s;x++)c[x]=a[g+x];Zc(c,s,l,h,u,n);for(let x=0;x<s;x++)f[g+x]=Math.sqrt(l[x])}return f}function Uu(s,t,e,n,i){const o=Math.max(1,Math.round(Math.max(t,e)/512)),a=Math.ceil(t/o),r=Math.ceil(e/o),c=new Float32Array(a*r);for(let f=0;f<r;f++)for(let m=0;m<a;m++){let g=0,x=0;for(let p=f*o;p<Math.min(e,(f+1)*o);p++)for(let d=m*o;d<Math.min(t,(m+1)*o);d++)g+=Math.max(0,s[p*t+d]),x++;c[f*a+m]=g/x*So}const l=new Float32Array(a*r),h=[1,2,3,5,7,10,14,19,26,34],u=[];for(let f=0;f<8;f++)u.push([Math.cos(f*Math.PI/4),Math.sin(f*Math.PI/4)]);for(let f=0;f<r;f++)for(let m=0;m<a;m++){const g=c[f*a+m];if(g<=0){l[f*a+m]=1;continue}let x=0;for(const[p,d]of u){let v=0;const M=Math.hypot(p*n,d*i)*o;for(const S of h){const b=Math.round(m+p*S),w=Math.round(f+d*S);if(b<0||w<0||b>=a||w>=r)break;const E=(c[w*a+b]-g)/(S*M);E>v&&(v=E)}x+=v/Math.sqrt(1+v*v)}l[f*a+m]=1-x/8*.95}return{data:l,w:a,h:r,f:o}}function ku(s,t,e,n,i,o){const a=new Uint8Array(t*e*4),r=Lu;for(let c=0;c<e;c++){const l=Math.max(0,c-1),h=Math.min(e-1,c+1);for(let u=0;u<t;u++){const f=c*t+u,m=Math.max(0,u-1),g=Math.min(t-1,u+1),x=(s[c*t+g]-s[c*t+m])/((g-m)*n),p=(s[h*t+u]-s[l*t+u])/((h-l)*i),d=-x*r,v=-p*r,M=Math.hypot(d,1,v);a[f*4]=Math.round((d/M*.5+.5)*255),a[f*4+1]=Math.round((1/M*.5+.5)*255),a[f*4+2]=Math.round((v/M*.5+.5)*255);let S=1;if(o){const b=Math.min(o.w-1.001,Math.max(0,(u+.5)/o.f-.5)),w=Math.min(o.h-1.001,Math.max(0,(c+.5)/o.f-.5)),E=b|0,A=w|0,_=b-E,y=w-A,C=A*o.w+E,P=o.data,I=Math.min(o.w-1,E+1)-E,R=Math.min(o.h-1,A+1)-A,U=P[C]+(P[C+I]-P[C])*_,F=P[C+R*o.w]+(P[C+R*o.w+I]-P[C+R*o.w])*_;S=U+(F-U)*y}a[f*4+3]=Math.round(Math.max(0,Math.min(1,S))*255)}}return a}function zu(s,t,e,n,i){const o=t*e,a=n*i/1e6,r=new Float32Array(o);let c=0,l=0;for(let p=0;p<o;p++)s[p]>0&&(r[p]=a,s[p]>c&&(c=s[p]),l++);if(!l)return r;const h=Math.min(65536,Math.ceil(c)+2),u=p=>Math.min(h-1,Math.floor(p/c*(h-2))),f=new Uint32Array(h+1);for(let p=0;p<o;p++)s[p]>0&&f[u(s[p])+1]++;for(let p=0;p<h;p++)f[p+1]+=f[p];const m=new Uint32Array(l),g=f.slice();for(let p=0;p<o;p++)s[p]>0&&(m[g[u(s[p])]++]=p);const x=Math.hypot(n,i);for(let p=l-1;p>=0;p--){const d=m[p],v=d%t,M=(d-v)/t,S=s[d];let b=-1,w=0;for(let E=-1;E<=1;E++){const A=M+E;if(!(A<0||A>=e))for(let _=-1;_<=1;_++){if(!_&&!E)continue;const y=v+_;if(y<0||y>=t)continue;const C=A*t+y,P=(S-s[C])/(_&&E?x:_?n:i);P>w&&(w=P,b=C)}}b>=0&&s[b]>0&&(r[b]+=r[d])}return r}function xd(s,t,e,n,i,o){const a=e*n,r=new Uint8Array(a*4),c=zu(s,e,n,i,o),l=i*o/1e6,h=Math.max(.04,4*l),u=new Float32Array(a);for(let d=0;d<a;d++)u[d]=s[d]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,c[d])/h)/1.6)):0;const f=zn(u,e,n,1,2),m=hn(e,n,d=>s[d]<=0,i,o),g=new Float32Array(a);for(let d=0;d<n;d++)for(let v=0;v<e;v++){const M=d*e+v;if(s[M]<=0||s[M]>9)continue;const S=Math.min(e-1,v+1),b=Math.max(0,v-1),w=Math.min(n-1,d+1),E=Math.max(0,d-1),A=Math.hypot((s[d*e+S]-s[d*e+b])/((S-b)*i),(s[w*e+v]-s[E*e+v])/((w-E)*o));g[M]=m[M]<260+Math.max(i,o)&&A<.12?1:0}const x=zn(g,e,n,1,1),p=1.5*Math.min(1,70/Math.max(i,o));for(let d=0;d<a;d++)r[d*4]=t?t[d]:s[d]>0?82:0,r[d*4+1]=Math.round(255*Math.min(1,x[d]*p)),r[d*4+2]=Math.round(255*Math.min(1,f[d]*1.6)),r[d*4+3]=0;return r}function Md({heightPx:s,rainPx:t,W:e,H:n,scale:i,offset:o,mx:a,mz:r,stride:c=4}){const l=Du(s,e,n,i,o,c),h=gd(l);h&&vd(l,e,n,a,r);const u=t?Iu(t,e,n,c):null,f=Uu(l,e,n,a,r),m=ku(l,e,n,a,r,f),g=xd(l,u,e,n,a,r);let x=1/0,p=-1/0;for(let d=0;d<l.length;d++)l[d]<x&&(x=l[d]),l[d]>p&&(p=l[d]);return{metres:l,normals:m,land:g,flatSea:h,lo:x,hi:p}}async function Mi(s,t,e){try{const n=await fetch(s);if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}catch(n){if(t===void 0)throw new Error(`${s}: ${n.message}`);return e==null||e(`${s}: ${n.message} (carrying on without it)`),t}}const zo=(s,t)=>Array.isArray(s)?s:Array.isArray(s==null?void 0:s[t])?s[t]:[];async function _d(s,t=console.warn){const e=m=>new URL(m,new URL(s,location.href)).href,n=await Mi(e("manifest.json")),[i,o,a,r,c,l,h]=await Promise.all([Mi(e("boundaries/moku.geojson"),null,t),Mi(e("boundaries/ahupuaa.geojson"),null,t),Mi(e("eras.json"),[],t),Mi(e("places.json"),[],t),Mi(e("events.json"),[],t),Mi(e("sources.json"),[],t),Mi(e("polities.json"),{polities:[],byEra:{}},t)]),u=new md(n.projection||{}),f=(n.packs||[]).map(m=>yd(m,u,e));return{base:s,abs:e,manifest:n,proj:u,packs:f,moku:i,ahupuaa:o,eras:zo(a,"eras"),places:zo(r,"places"),events:zo(c,"events"),sources:zo(l,"sources"),polities:{polities:(h==null?void 0:h.polities)||[],byEra:(h==null?void 0:h.byEra)||{}}}}function yd(s,t,e){var a;const n=t.rect(s.bounds),[i,o]=s.size;return{id:s.id,kind:s.kind,name:s.name||s.id,desc:s,rect:n,W:i,H:o,mx:(n.x1-n.x0)*Os/i,mz:(n.z1-n.z0)*Os/o,heightUrl:e(s.height.file),rainUrl:(a=s.rain)!=null&&a.file?e(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,sources:s.sources||[],data:null}}class wd{constructor(t=2,e=console.warn){this.warn=e,this.jobs=new Map,this.next=1,this.workers=[],this.free=[],this.queue=[];try{for(let n=0;n<t;n++){const i=new Worker(new URL(""+new URL("worker-D-2AoFNa.js",import.meta.url).href,import.meta.url),{type:"module"});i.onmessage=o=>this.message(i,o.data),i.onerror=o=>{var a;(a=o.preventDefault)==null||a.call(o),this.fallback=!0;for(const[r,c]of this.jobs)c.worker===i&&this.mainThread(r,c)},this.workers.push(i),this.free.push(i)}}catch{this.fallback=!0}}decode(t){return new Promise((e,n)=>{const i=this.next++,o={pack:t,resolve:e,reject:n};this.jobs.set(i,o),this.fallback||!this.workers.length?this.mainThread(i,o):(this.queue.push(i),this.pump())})}pump(){for(;this.free.length&&this.queue.length;){const t=this.queue.shift(),e=this.jobs.get(t),n=this.free.pop();e.worker=n;const i=e.pack;n.postMessage({job:t,heightUrl:i.heightUrl,rainUrl:i.rainUrl,W:i.W,H:i.H,scale:i.scale,offset:i.offset,mx:i.mx,mz:i.mz})}}message(t,e){const n=this.jobs.get(e.job);if(n){if(e.warn)return this.warn(e.warn);this.jobs.delete(e.job),this.free.push(t),e.ok?n.resolve(e):/OffscreenCanvas|getContext|createImageBitmap/i.test(e.message)?(this.fallback=!0,this.jobs.set(e.job,n),this.mainThread(e.job,n)):n.reject(new Error(e.message)),this.pump()}}async mainThread(t,e){try{const n=e.pack,i=await Kn(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);let o=null;n.rainUrl&&(o=await Kn(n.rainUrl).then(r=>r.W===n.W&&r.H===n.H?r.px:null).catch(()=>null));const a=Md({heightPx:i.px,rainPx:o,W:n.W,H:n.H,scale:n.scale,offset:n.offset,mx:n.mx,mz:n.mz});this.jobs.delete(t),e.resolve(a)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){for(const t of this.workers)t.terminate()}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ec="160",bd=0,Jc=1,Sd=2,Fu=1,Ed=2,ai=3,vi=0,rn=1,On=2,gi=0,Fs=1,ic=2,Qc=3,sc=4,Ad=5,qi=100,Td=101,Cd=102,tl=103,el=104,Rd=200,Ld=201,Pd=202,Dd=203,oc=204,ac=205,Id=206,Ud=207,kd=208,zd=209,Fd=210,Nd=211,Od=212,Bd=213,Wd=214,Gd=0,Hd=1,Vd=2,Pa=3,$d=4,Xd=5,qd=6,jd=7,Nu=0,Yd=1,Kd=2,Ci=0,Zd=1,Jd=2,Qd=3,tp=4,ep=5,np=6,Ou=300,Bs=301,Ws=302,rc=303,cc=304,Ka=306,Da=1e3,on=1001,lc=1002,ie=1003,nl=1004,cr=1005,Be=1006,ip=1007,ns=1008,de=1009,sp=1010,op=1011,Ac=1012,Bu=1013,fi=1014,di=1015,Ri=1016,Wu=1017,Gu=1018,Qi=1020,ap=1021,Ee=1023,rp=1024,cp=1025,ts=1026,Gs=1027,Li=1028,Hu=1029,Vu=1030,$u=1031,Xu=1033,lr=33776,hr=33777,ur=33778,fr=33779,il=35840,sl=35841,ol=35842,al=35843,qu=36196,rl=37492,cl=37496,ll=37808,hl=37809,ul=37810,fl=37811,dl=37812,pl=37813,ml=37814,gl=37815,vl=37816,xl=37817,Ml=37818,_l=37819,yl=37820,wl=37821,dr=36492,bl=36494,Sl=36495,lp=36283,El=36284,Al=36285,Tl=36286,ju=3e3,es=3001,hp=3200,up=3201,fp=0,dp=1,Rn="",Oe="srgb",xi="srgb-linear",Tc="display-p3",Za="display-p3-linear",Ia="linear",fe="srgb",Ua="rec709",ka="p3",rs=7680,Cl=519,pp=512,mp=513,gp=514,Yu=515,vp=516,xp=517,Mp=518,_p=519,Rl=35044,wn=35048,Ll="300 es",hc=1035,pi=2e3,za=2001;class Vs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const o=i.indexOf(e);o!==-1&&i.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let o=0,a=i.length;o<a;o++)i[o].call(this,t);t.target=null}}}const $e=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Pl=1234567;const po=Math.PI/180,Eo=180/Math.PI;function $s(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return($e[s&255]+$e[s>>8&255]+$e[s>>16&255]+$e[s>>24&255]+"-"+$e[t&255]+$e[t>>8&255]+"-"+$e[t>>16&15|64]+$e[t>>24&255]+"-"+$e[e&63|128]+$e[e>>8&255]+"-"+$e[e>>16&255]+$e[e>>24&255]+$e[n&255]+$e[n>>8&255]+$e[n>>16&255]+$e[n>>24&255]).toLowerCase()}function sn(s,t,e){return Math.max(t,Math.min(e,s))}function Cc(s,t){return(s%t+t)%t}function yp(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function wp(s,t,e){return s!==t?(e-s)/(t-s):0}function mo(s,t,e){return(1-e)*s+e*t}function bp(s,t,e,n){return mo(s,t,1-Math.exp(-e*n))}function Sp(s,t=1){return t-Math.abs(Cc(s,t*2)-t)}function Ep(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Ap(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Tp(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Cp(s,t){return s+Math.random()*(t-s)}function Rp(s){return s*(.5-Math.random())}function Lp(s){s!==void 0&&(Pl=s);let t=Pl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Pp(s){return s*po}function Dp(s){return s*Eo}function uc(s){return(s&s-1)===0&&s!==0}function Ip(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Fa(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Up(s,t,e,n,i){const o=Math.cos,a=Math.sin,r=o(e/2),c=a(e/2),l=o((t+n)/2),h=a((t+n)/2),u=o((t-n)/2),f=a((t-n)/2),m=o((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":s.set(r*h,c*u,c*f,r*l);break;case"YZY":s.set(c*f,r*h,c*u,r*l);break;case"ZXZ":s.set(c*u,c*f,r*h,r*l);break;case"XZX":s.set(r*h,c*g,c*m,r*l);break;case"YXY":s.set(c*m,r*h,c*g,r*l);break;case"ZYZ":s.set(c*g,c*m,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Es(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Je(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const je={DEG2RAD:po,RAD2DEG:Eo,generateUUID:$s,clamp:sn,euclideanModulo:Cc,mapLinear:yp,inverseLerp:wp,lerp:mo,damp:bp,pingpong:Sp,smoothstep:Ep,smootherstep:Ap,randInt:Tp,randFloat:Cp,randFloatSpread:Rp,seededRandom:Lp,degToRad:Pp,radToDeg:Dp,isPowerOfTwo:uc,ceilPowerOfTwo:Ip,floorPowerOfTwo:Fa,setQuaternionFromProperEuler:Up,normalize:Je,denormalize:Es};class Ht{constructor(t=0,e=0){Ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(sn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*n-a*i+t.x,this.y=o*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qt{constructor(t,e,n,i,o,a,r,c,l){Qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,a,r,c,l)}set(t,e,n,i,o,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=i,h[2]=r,h[3]=e,h[4]=o,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,a=n[0],r=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],m=n[5],g=n[8],x=i[0],p=i[3],d=i[6],v=i[1],M=i[4],S=i[7],b=i[2],w=i[5],E=i[8];return o[0]=a*x+r*v+c*b,o[3]=a*p+r*M+c*w,o[6]=a*d+r*S+c*E,o[1]=l*x+h*v+u*b,o[4]=l*p+h*M+u*w,o[7]=l*d+h*S+u*E,o[2]=f*x+m*v+g*b,o[5]=f*p+m*M+g*w,o[8]=f*d+m*S+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-n*o*h+n*r*c+i*o*l-i*a*c}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*a-r*l,f=r*c-h*o,m=l*o-a*c,g=e*u+n*f+i*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=u*x,t[1]=(i*l-h*n)*x,t[2]=(r*n-i*a)*x,t[3]=f*x,t[4]=(h*e-i*c)*x,t[5]=(i*o-r*e)*x,t[6]=m*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*o)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,o,a,r){const c=Math.cos(o),l=Math.sin(o);return this.set(n*c,n*l,-n*(c*a+l*r)+a+t,-i*l,i*c,-i*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(pr.makeScale(t,e)),this}rotate(t){return this.premultiply(pr.makeRotation(-t)),this}translate(t,e){return this.premultiply(pr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const pr=new Qt;function Ku(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Na(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function kp(){const s=Na("canvas");return s.style.display="block",s}const Dl={};function go(s){s in Dl||(Dl[s]=!0,console.warn(s))}const Il=new Qt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ul=new Qt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Fo={[xi]:{transfer:Ia,primaries:Ua,toReference:s=>s,fromReference:s=>s},[Oe]:{transfer:fe,primaries:Ua,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Za]:{transfer:Ia,primaries:ka,toReference:s=>s.applyMatrix3(Ul),fromReference:s=>s.applyMatrix3(Il)},[Tc]:{transfer:fe,primaries:ka,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Ul),fromReference:s=>s.applyMatrix3(Il).convertLinearToSRGB()}},zp=new Set([xi,Za]),le={enabled:!0,_workingColorSpace:xi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!zp.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=Fo[t].toReference,i=Fo[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Fo[s].primaries},getTransfer:function(s){return s===Rn?Ia:Fo[s].transfer}};function Ns(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function mr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let cs;class Zu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{cs===void 0&&(cs=Na("canvas")),cs.width=t.width,cs.height=t.height;const n=cs.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=cs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Na("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),o=i.data;for(let a=0;a<o.length;a++)o[a]=Ns(o[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ns(e[n]/255)*255):e[n]=Ns(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Fp=0;class Ju{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Fp++}),this.uuid=$s(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let o;if(Array.isArray(i)){o=[];for(let a=0,r=i.length;a<r;a++)i[a].isDataTexture?o.push(gr(i[a].image)):o.push(gr(i[a]))}else o=gr(i);n.url=o}return e||(t.images[this.uuid]=n),n}}function gr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Zu.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Np=0;class dn extends Vs{constructor(t=dn.DEFAULT_IMAGE,e=dn.DEFAULT_MAPPING,n=on,i=on,o=Be,a=ns,r=Ee,c=de,l=dn.DEFAULT_ANISOTROPY,h=Rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Np++}),this.uuid=$s(),this.name="",this.source=new Ju(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=o,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Ht(0,0),this.repeat=new Ht(1,1),this.center=new Ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(go("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===es?Oe:Rn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ou)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Da:t.x=t.x-Math.floor(t.x);break;case on:t.x=t.x<0?0:1;break;case lc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Da:t.y=t.y-Math.floor(t.y);break;case on:t.y=t.y<0?0:1;break;case lc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return go("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Oe?es:ju}set encoding(t){go("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===es?Oe:Rn}}dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=Ou;dn.DEFAULT_ANISOTROPY=1;class ee{constructor(t=0,e=0,n=0,i=1){ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*o,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*o,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*o,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,o;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],m=c[5],g=c[9],x=c[2],p=c[6],d=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,S=(m+1)/2,b=(d+1)/2,w=(h+f)/4,E=(u+x)/4,A=(g+p)/4;return M>S&&M>b?M<.01?(n=0,i=.707106781,o=.707106781):(n=Math.sqrt(M),i=w/n,o=E/n):S>b?S<.01?(n=.707106781,i=0,o=.707106781):(i=Math.sqrt(S),n=w/i,o=A/i):b<.01?(n=.707106781,i=.707106781,o=0):(o=Math.sqrt(b),n=E/o,i=A/o),this.set(n,i,o,e),this}let v=Math.sqrt((p-g)*(p-g)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(p-g)/v,this.y=(u-x)/v,this.z=(f-h)/v,this.w=Math.acos((l+m+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Op extends Vs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ee(0,0,t,e),this.scissorTest=!1,this.viewport=new ee(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(go("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===es?Oe:Rn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Be,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new dn(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Ju(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zn extends Op{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Qu extends dn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ie,this.minFilter=ie,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Bp extends dn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ie,this.minFilter=ie,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pi{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,o,a,r){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const f=o[a+0],m=o[a+1],g=o[a+2],x=o[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=f,t[e+1]=m,t[e+2]=g,t[e+3]=x;return}if(u!==x||c!==f||l!==m||h!==g){let p=1-r;const d=c*f+l*m+h*g+u*x,v=d>=0?1:-1,M=1-d*d;if(M>Number.EPSILON){const b=Math.sqrt(M),w=Math.atan2(b,d*v);p=Math.sin(p*w)/b,r=Math.sin(r*w)/b}const S=r*v;if(c=c*p+f*S,l=l*p+m*S,h=h*p+g*S,u=u*p+x*S,p===1-r){const b=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=b,l*=b,h*=b,u*=b}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,o,a){const r=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=o[a],f=o[a+1],m=o[a+2],g=o[a+3];return t[e]=r*g+h*u+c*m-l*f,t[e+1]=c*g+h*f+l*u-r*m,t[e+2]=l*g+h*m+r*f-c*u,t[e+3]=h*g-r*u-c*f-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,o=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(n/2),h=r(i/2),u=r(o/2),f=c(n/2),m=c(i/2),g=c(o/2);switch(a){case"XYZ":this._x=f*h*u+l*m*g,this._y=l*m*u-f*h*g,this._z=l*h*g+f*m*u,this._w=l*h*u-f*m*g;break;case"YXZ":this._x=f*h*u+l*m*g,this._y=l*m*u-f*h*g,this._z=l*h*g-f*m*u,this._w=l*h*u+f*m*g;break;case"ZXY":this._x=f*h*u-l*m*g,this._y=l*m*u+f*h*g,this._z=l*h*g+f*m*u,this._w=l*h*u-f*m*g;break;case"ZYX":this._x=f*h*u-l*m*g,this._y=l*m*u+f*h*g,this._z=l*h*g-f*m*u,this._w=l*h*u+f*m*g;break;case"YZX":this._x=f*h*u+l*m*g,this._y=l*m*u+f*h*g,this._z=l*h*g-f*m*u,this._w=l*h*u-f*m*g;break;case"XZY":this._x=f*h*u-l*m*g,this._y=l*m*u-f*h*g,this._z=l*h*g+f*m*u,this._w=l*h*u+f*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],o=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+r+u;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-c)*m,this._y=(o-l)*m,this._z=(a-i)*m}else if(n>r&&n>u){const m=2*Math.sqrt(1+n-r-u);this._w=(h-c)/m,this._x=.25*m,this._y=(i+a)/m,this._z=(o+l)/m}else if(r>u){const m=2*Math.sqrt(1+r-n-u);this._w=(o-l)/m,this._x=(i+a)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+u-n-r);this._w=(a-i)/m,this._x=(o+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(sn(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,o=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*r+i*l-o*c,this._y=i*h+a*c+o*r-n*l,this._z=o*h+a*l+n*c-i*r,this._w=a*h-n*r-i*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,o=this._z,a=this._w;let r=a*t._w+n*t._x+i*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=n,this._y=i,this._z=o,this;const c=1-r*r;if(c<=Number.EPSILON){const m=1-e;return this._w=m*a+e*this._w,this._x=m*n+e*this._x,this._y=m*i+e*this._y,this._z=m*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(o),n*Math.cos(o),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{constructor(t=0,e=0,n=0){B.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(kl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(kl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*i,this.y=o[1]*e+o[4]*n+o[7]*i,this.z=o[2]*e+o[5]*n+o[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=t.elements,a=1/(o[3]*e+o[7]*n+o[11]*i+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*i+o[12])*a,this.y=(o[1]*e+o[5]*n+o[9]*i+o[13])*a,this.z=(o[2]*e+o[6]*n+o[10]*i+o[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,o=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*i-r*n),h=2*(r*e-o*i),u=2*(o*n-a*e);return this.x=e+c*l+a*u-r*h,this.y=n+c*h+r*l-o*u,this.z=i+c*u+o*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i,this.y=o[1]*e+o[5]*n+o[9]*i,this.z=o[2]*e+o[6]*n+o[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,o=t.z,a=e.x,r=e.y,c=e.z;return this.x=i*c-o*r,this.y=o*a-n*c,this.z=n*r-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return vr.copy(this).projectOnVector(t),this.sub(vr)}reflect(t){return this.sub(vr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(sn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vr=new B,kl=new Pi;class bn{constructor(t=new B(1/0,1/0,1/0),e=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Pn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Pn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Pn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,Pn):Pn.fromBufferAttribute(o,a),Pn.applyMatrix4(t.matrixWorld),this.expandByPoint(Pn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),No.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),No.copy(n.boundingBox)),No.applyMatrix4(t.matrixWorld),this.union(No)}const i=t.children;for(let o=0,a=i.length;o<a;o++)this.expandByObject(i[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Pn),Pn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Zs),Oo.subVectors(this.max,Zs),ls.subVectors(t.a,Zs),hs.subVectors(t.b,Zs),us.subVectors(t.c,Zs),_i.subVectors(hs,ls),yi.subVectors(us,hs),Fi.subVectors(ls,us);let e=[0,-_i.z,_i.y,0,-yi.z,yi.y,0,-Fi.z,Fi.y,_i.z,0,-_i.x,yi.z,0,-yi.x,Fi.z,0,-Fi.x,-_i.y,_i.x,0,-yi.y,yi.x,0,-Fi.y,Fi.x,0];return!xr(e,ls,hs,us,Oo)||(e=[1,0,0,0,1,0,0,0,1],!xr(e,ls,hs,us,Oo))?!1:(Bo.crossVectors(_i,yi),e=[Bo.x,Bo.y,Bo.z],xr(e,ls,hs,us,Oo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Pn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Pn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ei),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const ei=[new B,new B,new B,new B,new B,new B,new B,new B],Pn=new B,No=new bn,ls=new B,hs=new B,us=new B,_i=new B,yi=new B,Fi=new B,Zs=new B,Oo=new B,Bo=new B,Ni=new B;function xr(s,t,e,n,i){for(let o=0,a=s.length-3;o<=a;o+=3){Ni.fromArray(s,o);const r=i.x*Math.abs(Ni.x)+i.y*Math.abs(Ni.y)+i.z*Math.abs(Ni.z),c=t.dot(Ni),l=e.dot(Ni),h=n.dot(Ni);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const Wp=new bn,Js=new B,Mr=new B;class Di{constructor(t=new B,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Wp.setFromPoints(t).getCenter(n);let i=0;for(let o=0,a=t.length;o<a;o++)i=Math.max(i,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Js.subVectors(t,this.center);const e=Js.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Js,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Mr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Js.copy(t.center).add(Mr)),this.expandByPoint(Js.copy(t.center).sub(Mr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ni=new B,_r=new B,Wo=new B,wi=new B,yr=new B,Go=new B,wr=new B;class Rc{constructor(t=new B,e=new B(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ni)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ni.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ni.copy(this.origin).addScaledVector(this.direction,e),ni.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){_r.copy(t).add(e).multiplyScalar(.5),Wo.copy(e).sub(t).normalize(),wi.copy(this.origin).sub(_r);const o=t.distanceTo(e)*.5,a=-this.direction.dot(Wo),r=wi.dot(this.direction),c=-wi.dot(Wo),l=wi.lengthSq(),h=Math.abs(1-a*a);let u,f,m,g;if(h>0)if(u=a*c-r,f=a*r-c,g=o*h,u>=0)if(f>=-g)if(f<=g){const x=1/h;u*=x,f*=x,m=u*(u+a*f+2*r)+f*(a*u+f+2*c)+l}else f=o,u=Math.max(0,-(a*f+r)),m=-u*u+f*(f+2*c)+l;else f=-o,u=Math.max(0,-(a*f+r)),m=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-a*o+r)),f=u>0?-o:Math.min(Math.max(-o,-c),o),m=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-o,-c),o),m=f*(f+2*c)+l):(u=Math.max(0,-(a*o+r)),f=u>0?o:Math.min(Math.max(-o,-c),o),m=-u*u+f*(f+2*c)+l);else f=a>0?-o:o,u=Math.max(0,-(a*f+r)),m=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(_r).addScaledVector(Wo,f),m}intersectSphere(t,e){ni.subVectors(t.center,this.origin);const n=ni.dot(this.direction),i=ni.dot(ni)-n*n,o=t.radius*t.radius;if(i>o)return null;const a=Math.sqrt(o-i),r=n-a,c=n+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,o,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,i=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,i=(t.min.x-f.x)*l),h>=0?(o=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(o=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||o>i||((o>n||isNaN(n))&&(n=o),(a<i||isNaN(i))&&(i=a),u>=0?(r=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(r=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||r>i)||((r>n||n!==n)&&(n=r),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ni)!==null}intersectTriangle(t,e,n,i,o){yr.subVectors(e,t),Go.subVectors(n,t),wr.crossVectors(yr,Go);let a=this.direction.dot(wr),r;if(a>0){if(i)return null;r=1}else if(a<0)r=-1,a=-a;else return null;wi.subVectors(this.origin,t);const c=r*this.direction.dot(Go.crossVectors(wi,Go));if(c<0)return null;const l=r*this.direction.dot(yr.cross(wi));if(l<0||c+l>a)return null;const h=-r*wi.dot(wr);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class se{constructor(t,e,n,i,o,a,r,c,l,h,u,f,m,g,x,p){se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,a,r,c,l,h,u,f,m,g,x,p)}set(t,e,n,i,o,a,r,c,l,h,u,f,m,g,x,p){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=i,d[1]=o,d[5]=a,d[9]=r,d[13]=c,d[2]=l,d[6]=h,d[10]=u,d[14]=f,d[3]=m,d[7]=g,d[11]=x,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/fs.setFromMatrixColumn(t,0).length(),o=1/fs.setFromMatrixColumn(t,1).length(),a=1/fs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,o=t.z,a=Math.cos(n),r=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const f=a*h,m=a*u,g=r*h,x=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=m+g*l,e[5]=f-x*l,e[9]=-r*c,e[2]=x-f*l,e[6]=g+m*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*h,m=c*u,g=l*h,x=l*u;e[0]=f+x*r,e[4]=g*r-m,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=m*r-g,e[6]=x+f*r,e[10]=a*c}else if(t.order==="ZXY"){const f=c*h,m=c*u,g=l*h,x=l*u;e[0]=f-x*r,e[4]=-a*u,e[8]=g+m*r,e[1]=m+g*r,e[5]=a*h,e[9]=x-f*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const f=a*h,m=a*u,g=r*h,x=r*u;e[0]=c*h,e[4]=g*l-m,e[8]=f*l+x,e[1]=c*u,e[5]=x*l+f,e[9]=m*l-g,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,m=a*l,g=r*c,x=r*l;e[0]=c*h,e[4]=x-f*u,e[8]=g*u+m,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=m*u+g,e[10]=f-x*u}else if(t.order==="XZY"){const f=a*c,m=a*l,g=r*c,x=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+x,e[5]=a*h,e[9]=m*u-g,e[2]=g*u-m,e[6]=r*h,e[10]=x*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Gp,t,Hp)}lookAt(t,e,n){const i=this.elements;return gn.subVectors(t,e),gn.lengthSq()===0&&(gn.z=1),gn.normalize(),bi.crossVectors(n,gn),bi.lengthSq()===0&&(Math.abs(n.z)===1?gn.x+=1e-4:gn.z+=1e-4,gn.normalize(),bi.crossVectors(n,gn)),bi.normalize(),Ho.crossVectors(gn,bi),i[0]=bi.x,i[4]=Ho.x,i[8]=gn.x,i[1]=bi.y,i[5]=Ho.y,i[9]=gn.y,i[2]=bi.z,i[6]=Ho.z,i[10]=gn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,a=n[0],r=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],m=n[13],g=n[2],x=n[6],p=n[10],d=n[14],v=n[3],M=n[7],S=n[11],b=n[15],w=i[0],E=i[4],A=i[8],_=i[12],y=i[1],C=i[5],P=i[9],I=i[13],R=i[2],U=i[6],F=i[10],G=i[14],W=i[3],K=i[7],H=i[11],et=i[15];return o[0]=a*w+r*y+c*R+l*W,o[4]=a*E+r*C+c*U+l*K,o[8]=a*A+r*P+c*F+l*H,o[12]=a*_+r*I+c*G+l*et,o[1]=h*w+u*y+f*R+m*W,o[5]=h*E+u*C+f*U+m*K,o[9]=h*A+u*P+f*F+m*H,o[13]=h*_+u*I+f*G+m*et,o[2]=g*w+x*y+p*R+d*W,o[6]=g*E+x*C+p*U+d*K,o[10]=g*A+x*P+p*F+d*H,o[14]=g*_+x*I+p*G+d*et,o[3]=v*w+M*y+S*R+b*W,o[7]=v*E+M*C+S*U+b*K,o[11]=v*A+M*P+S*F+b*H,o[15]=v*_+M*I+S*G+b*et,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],o=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],m=t[14],g=t[3],x=t[7],p=t[11],d=t[15];return g*(+o*c*u-i*l*u-o*r*f+n*l*f+i*r*m-n*c*m)+x*(+e*c*m-e*l*f+o*a*f-i*a*m+i*l*h-o*c*h)+p*(+e*l*u-e*r*m-o*a*u+n*a*m+o*r*h-n*l*h)+d*(-i*r*h-e*c*u+e*r*f+i*a*u-n*a*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],m=t[11],g=t[12],x=t[13],p=t[14],d=t[15],v=u*p*l-x*f*l+x*c*m-r*p*m-u*c*d+r*f*d,M=g*f*l-h*p*l-g*c*m+a*p*m+h*c*d-a*f*d,S=h*x*l-g*u*l+g*r*m-a*x*m-h*r*d+a*u*d,b=g*u*c-h*x*c-g*r*f+a*x*f+h*r*p-a*u*p,w=e*v+n*M+i*S+o*b;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/w;return t[0]=v*E,t[1]=(x*f*o-u*p*o-x*i*m+n*p*m+u*i*d-n*f*d)*E,t[2]=(r*p*o-x*c*o+x*i*l-n*p*l-r*i*d+n*c*d)*E,t[3]=(u*c*o-r*f*o-u*i*l+n*f*l+r*i*m-n*c*m)*E,t[4]=M*E,t[5]=(h*p*o-g*f*o+g*i*m-e*p*m-h*i*d+e*f*d)*E,t[6]=(g*c*o-a*p*o-g*i*l+e*p*l+a*i*d-e*c*d)*E,t[7]=(a*f*o-h*c*o+h*i*l-e*f*l-a*i*m+e*c*m)*E,t[8]=S*E,t[9]=(g*u*o-h*x*o-g*n*m+e*x*m+h*n*d-e*u*d)*E,t[10]=(a*x*o-g*r*o+g*n*l-e*x*l-a*n*d+e*r*d)*E,t[11]=(h*r*o-a*u*o-h*n*l+e*u*l+a*n*m-e*r*m)*E,t[12]=b*E,t[13]=(h*x*i-g*u*i+g*n*f-e*x*f-h*n*p+e*u*p)*E,t[14]=(g*r*i-a*x*i-g*n*c+e*x*c+a*n*p-e*r*p)*E,t[15]=(a*u*i-h*r*i+h*n*c-e*u*c-a*n*f+e*r*f)*E,this}scale(t){const e=this.elements,n=t.x,i=t.y,o=t.z;return e[0]*=n,e[4]*=i,e[8]*=o,e[1]*=n,e[5]*=i,e[9]*=o,e[2]*=n,e[6]*=i,e[10]*=o,e[3]*=n,e[7]*=i,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),o=1-n,a=t.x,r=t.y,c=t.z,l=o*a,h=o*r;return this.set(l*a+n,l*r-i*c,l*c+i*r,0,l*r+i*c,h*r+n,h*c-i*a,0,l*c-i*r,h*c+i*a,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,o,a){return this.set(1,n,o,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,o=e._x,a=e._y,r=e._z,c=e._w,l=o+o,h=a+a,u=r+r,f=o*l,m=o*h,g=o*u,x=a*h,p=a*u,d=r*u,v=c*l,M=c*h,S=c*u,b=n.x,w=n.y,E=n.z;return i[0]=(1-(x+d))*b,i[1]=(m+S)*b,i[2]=(g-M)*b,i[3]=0,i[4]=(m-S)*w,i[5]=(1-(f+d))*w,i[6]=(p+v)*w,i[7]=0,i[8]=(g+M)*E,i[9]=(p-v)*E,i[10]=(1-(f+x))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let o=fs.set(i[0],i[1],i[2]).length();const a=fs.set(i[4],i[5],i[6]).length(),r=fs.set(i[8],i[9],i[10]).length();this.determinant()<0&&(o=-o),t.x=i[12],t.y=i[13],t.z=i[14],Dn.copy(this);const l=1/o,h=1/a,u=1/r;return Dn.elements[0]*=l,Dn.elements[1]*=l,Dn.elements[2]*=l,Dn.elements[4]*=h,Dn.elements[5]*=h,Dn.elements[6]*=h,Dn.elements[8]*=u,Dn.elements[9]*=u,Dn.elements[10]*=u,e.setFromRotationMatrix(Dn),n.x=o,n.y=a,n.z=r,this}makePerspective(t,e,n,i,o,a,r=pi){const c=this.elements,l=2*o/(e-t),h=2*o/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let m,g;if(r===pi)m=-(a+o)/(a-o),g=-2*a*o/(a-o);else if(r===za)m=-a/(a-o),g=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,o,a,r=pi){const c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(a-o),f=(e+t)*l,m=(n+i)*h;let g,x;if(r===pi)g=(a+o)*u,x=-2*u;else if(r===za)g=o*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=x,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const fs=new B,Dn=new se,Gp=new B(0,0,0),Hp=new B(1,1,1),bi=new B,Ho=new B,gn=new B,zl=new se,Fl=new Pi;class Ja{constructor(t=0,e=0,n=0,i=Ja.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,o=i[0],a=i[4],r=i[8],c=i[1],l=i[5],h=i[9],u=i[2],f=i[6],m=i[10];switch(e){case"XYZ":this._y=Math.asin(sn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-sn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(sn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-sn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(sn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,m));break;case"XZY":this._z=Math.asin(-sn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return zl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(zl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Fl.setFromEuler(this),this.setFromQuaternion(Fl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ja.DEFAULT_ORDER="XYZ";class Lc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Vp=0;const Nl=new B,ds=new Pi,ii=new se,Vo=new B,Qs=new B,$p=new B,Xp=new Pi,Ol=new B(1,0,0),Bl=new B(0,1,0),Wl=new B(0,0,1),qp={type:"added"},jp={type:"removed"};class pn extends Vs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vp++}),this.uuid=$s(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pn.DEFAULT_UP.clone();const t=new B,e=new Ja,n=new Pi,i=new B(1,1,1);function o(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new se},normalMatrix:{value:new Qt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=pn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ds.setFromAxisAngle(t,e),this.quaternion.multiply(ds),this}rotateOnWorldAxis(t,e){return ds.setFromAxisAngle(t,e),this.quaternion.premultiply(ds),this}rotateX(t){return this.rotateOnAxis(Ol,t)}rotateY(t){return this.rotateOnAxis(Bl,t)}rotateZ(t){return this.rotateOnAxis(Wl,t)}translateOnAxis(t,e){return Nl.copy(t).applyQuaternion(this.quaternion),this.position.add(Nl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ol,t)}translateY(t){return this.translateOnAxis(Bl,t)}translateZ(t){return this.translateOnAxis(Wl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ii.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Vo.copy(t):Vo.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ii.lookAt(Qs,Vo,this.up):ii.lookAt(Vo,Qs,this.up),this.quaternion.setFromRotationMatrix(ii),i&&(ii.extractRotation(i.matrixWorld),ds.setFromRotationMatrix(ii),this.quaternion.premultiply(ds.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(qp)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(jp)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ii.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ii.multiply(t.parent.matrixWorld)),t.applyMatrix4(ii),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let o=0,a=i.length;o<a;o++)i[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,t,$p),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,Xp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const o=e[n];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let o=0,a=i.length;o<a;o++){const r=i[o];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function o(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(o(t.materials,this.material[c]));i.material=r}else i.material=o(t.materials,this.material);if(this.children.length>0){i.children=[];for(let r=0;r<this.children.length;r++)i.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];i.animations.push(o(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),m=a(t.animations),g=a(t.nodes);r.length>0&&(n.geometries=r),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}pn.DEFAULT_UP=new B(0,1,0);pn.DEFAULT_MATRIX_AUTO_UPDATE=!0;pn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const In=new B,si=new B,br=new B,oi=new B,ps=new B,ms=new B,Gl=new B,Sr=new B,Er=new B,Ar=new B;let $o=!1;class Fn{constructor(t=new B,e=new B,n=new B){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),In.subVectors(t,e),i.cross(In);const o=i.lengthSq();return o>0?i.multiplyScalar(1/Math.sqrt(o)):i.set(0,0,0)}static getBarycoord(t,e,n,i,o){In.subVectors(i,e),si.subVectors(n,e),br.subVectors(t,e);const a=In.dot(In),r=In.dot(si),c=In.dot(br),l=si.dot(si),h=si.dot(br),u=a*l-r*r;if(u===0)return o.set(0,0,0),null;const f=1/u,m=(l*c-r*h)*f,g=(a*h-r*c)*f;return o.set(1-m-g,g,m)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,oi)===null?!1:oi.x>=0&&oi.y>=0&&oi.x+oi.y<=1}static getUV(t,e,n,i,o,a,r,c){return $o===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$o=!0),this.getInterpolation(t,e,n,i,o,a,r,c)}static getInterpolation(t,e,n,i,o,a,r,c){return this.getBarycoord(t,e,n,i,oi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,oi.x),c.addScaledVector(a,oi.y),c.addScaledVector(r,oi.z),c)}static isFrontFacing(t,e,n,i){return In.subVectors(n,e),si.subVectors(t,e),In.cross(si).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return In.subVectors(this.c,this.b),si.subVectors(this.a,this.b),In.cross(si).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Fn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Fn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,o){return $o===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$o=!0),Fn.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}getInterpolation(t,e,n,i,o){return Fn.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}containsPoint(t){return Fn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Fn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,o=this.c;let a,r;ps.subVectors(i,n),ms.subVectors(o,n),Sr.subVectors(t,n);const c=ps.dot(Sr),l=ms.dot(Sr);if(c<=0&&l<=0)return e.copy(n);Er.subVectors(t,i);const h=ps.dot(Er),u=ms.dot(Er);if(h>=0&&u<=h)return e.copy(i);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(ps,a);Ar.subVectors(t,o);const m=ps.dot(Ar),g=ms.dot(Ar);if(g>=0&&m<=g)return e.copy(o);const x=m*l-c*g;if(x<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(n).addScaledVector(ms,r);const p=h*g-m*u;if(p<=0&&u-h>=0&&m-g>=0)return Gl.subVectors(o,i),r=(u-h)/(u-h+(m-g)),e.copy(i).addScaledVector(Gl,r);const d=1/(p+x+f);return a=x*d,r=f*d,e.copy(n).addScaledVector(ps,a).addScaledVector(ms,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const tf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Si={h:0,s:0,l:0},Xo={h:0,s:0,l:0};function Tr(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Gt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=le.workingColorSpace){if(t=Cc(t,1),e=sn(e,0,1),n=sn(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,a=2*n-o;this.r=Tr(a,o,t+1/3),this.g=Tr(a,o,t),this.b=Tr(a,o,t-1/3)}return le.toWorkingColorSpace(this,i),this}setStyle(t,e=Oe){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=i[1],r=i[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=i[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Oe){const n=tf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ns(t.r),this.g=Ns(t.g),this.b=Ns(t.b),this}copyLinearToSRGB(t){return this.r=mr(t.r),this.g=mr(t.g),this.b=mr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Oe){return le.fromWorkingColorSpace(Xe.copy(this),t),Math.round(sn(Xe.r*255,0,255))*65536+Math.round(sn(Xe.g*255,0,255))*256+Math.round(sn(Xe.b*255,0,255))}getHexString(t=Oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(Xe.copy(this),e);const n=Xe.r,i=Xe.g,o=Xe.b,a=Math.max(n,i,o),r=Math.min(n,i,o);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const u=a-r;switch(l=h<=.5?u/(a+r):u/(2-a-r),a){case n:c=(i-o)/u+(i<o?6:0);break;case i:c=(o-n)/u+2;break;case o:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(Xe.copy(this),e),t.r=Xe.r,t.g=Xe.g,t.b=Xe.b,t}getStyle(t=Oe){le.fromWorkingColorSpace(Xe.copy(this),t);const e=Xe.r,n=Xe.g,i=Xe.b;return t!==Oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Si),this.setHSL(Si.h+t,Si.s+e,Si.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Si),t.getHSL(Xo);const n=mo(Si.h,Xo.h,e),i=mo(Si.s,Xo.s,e),o=mo(Si.l,Xo.l,e);return this.setHSL(n,i,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*i,this.g=o[1]*e+o[4]*n+o[7]*i,this.b=o[2]*e+o[5]*n+o[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xe=new Gt;Gt.NAMES=tf;let Yp=0;class Ro extends Vs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=$s(),this.name="",this.type="Material",this.blending=Fs,this.side=vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=oc,this.blendDst=ac,this.blendEquation=qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=Pa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Cl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rs,this.stencilZFail=rs,this.stencilZPass=rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Fs&&(n.blending=this.blending),this.side!==vi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==oc&&(n.blendSrc=this.blendSrc),this.blendDst!==ac&&(n.blendDst=this.blendDst),this.blendEquation!==qi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Pa&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Cl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==rs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==rs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==rs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(o){const a=[];for(const r in o){const c=o[r];delete c.metadata,a.push(c)}return a}if(e){const o=i(t.textures),a=i(t.images);o.length>0&&(n.textures=o),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let o=0;o!==i;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ef extends Ro{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Nu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const be=new B,qo=new Ht;class Le{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Rl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=di,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,o=this.itemSize;i<o;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)qo.fromBufferAttribute(this,e),qo.applyMatrix3(t),this.setXY(e,qo.x,qo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Es(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Je(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Es(e,this.array)),e}setX(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Es(e,this.array)),e}setY(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Es(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Es(e,this.array)),e}setW(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),i=Je(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,o){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),i=Je(i,this.array),o=Je(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Rl&&(t.usage=this.usage),t}}class nf extends Le{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class sf extends Le{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Ae extends Le{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Kp=0;const An=new se,Cr=new pn,gs=new B,vn=new bn,to=new bn,ze=new B;class cn extends Vs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=$s(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ku(t)?sf:nf)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Qt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return An.makeRotationFromQuaternion(t),this.applyMatrix4(An),this}rotateX(t){return An.makeRotationX(t),this.applyMatrix4(An),this}rotateY(t){return An.makeRotationY(t),this.applyMatrix4(An),this}rotateZ(t){return An.makeRotationZ(t),this.applyMatrix4(An),this}translate(t,e,n){return An.makeTranslation(t,e,n),this.applyMatrix4(An),this}scale(t,e,n){return An.makeScale(t,e,n),this.applyMatrix4(An),this}lookAt(t){return Cr.lookAt(t),Cr.updateMatrix(),this.applyMatrix4(Cr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gs).negate(),this.translate(gs.x,gs.y,gs.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const o=t[n];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new Ae(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new bn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const o=e[n];vn.setFromBufferAttribute(o),this.morphTargetsRelative?(ze.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(ze),ze.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(ze)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Di);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new B,1/0);return}if(t){const n=this.boundingSphere.center;if(vn.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];to.setFromBufferAttribute(r),this.morphTargetsRelative?(ze.addVectors(vn.min,to.min),vn.expandByPoint(ze),ze.addVectors(vn.max,to.max),vn.expandByPoint(ze)):(vn.expandByPoint(to.min),vn.expandByPoint(to.max))}vn.getCenter(n);let i=0;for(let o=0,a=t.count;o<a;o++)ze.fromBufferAttribute(t,o),i=Math.max(i,n.distanceToSquared(ze));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)ze.fromBufferAttribute(r,l),c&&(gs.fromBufferAttribute(t,l),ze.add(gs)),i=Math.max(i,n.distanceToSquared(ze))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,o=e.normal.array,a=e.uv.array,r=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Le(new Float32Array(4*r),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let y=0;y<r;y++)l[y]=new B,h[y]=new B;const u=new B,f=new B,m=new B,g=new Ht,x=new Ht,p=new Ht,d=new B,v=new B;function M(y,C,P){u.fromArray(i,y*3),f.fromArray(i,C*3),m.fromArray(i,P*3),g.fromArray(a,y*2),x.fromArray(a,C*2),p.fromArray(a,P*2),f.sub(u),m.sub(u),x.sub(g),p.sub(g);const I=1/(x.x*p.y-p.x*x.y);isFinite(I)&&(d.copy(f).multiplyScalar(p.y).addScaledVector(m,-x.y).multiplyScalar(I),v.copy(m).multiplyScalar(x.x).addScaledVector(f,-p.x).multiplyScalar(I),l[y].add(d),l[C].add(d),l[P].add(d),h[y].add(v),h[C].add(v),h[P].add(v))}let S=this.groups;S.length===0&&(S=[{start:0,count:n.length}]);for(let y=0,C=S.length;y<C;++y){const P=S[y],I=P.start,R=P.count;for(let U=I,F=I+R;U<F;U+=3)M(n[U+0],n[U+1],n[U+2])}const b=new B,w=new B,E=new B,A=new B;function _(y){E.fromArray(o,y*3),A.copy(E);const C=l[y];b.copy(C),b.sub(E.multiplyScalar(E.dot(C))).normalize(),w.crossVectors(A,C);const I=w.dot(h[y])<0?-1:1;c[y*4]=b.x,c[y*4+1]=b.y,c[y*4+2]=b.z,c[y*4+3]=I}for(let y=0,C=S.length;y<C;++y){const P=S[y],I=P.start,R=P.count;for(let U=I,F=I+R;U<F;U+=3)_(n[U+0]),_(n[U+1]),_(n[U+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Le(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const i=new B,o=new B,a=new B,r=new B,c=new B,l=new B,h=new B,u=new B;if(t)for(let f=0,m=t.count;f<m;f+=3){const g=t.getX(f+0),x=t.getX(f+1),p=t.getX(f+2);i.fromBufferAttribute(e,g),o.fromBufferAttribute(e,x),a.fromBufferAttribute(e,p),h.subVectors(a,o),u.subVectors(i,o),h.cross(u),r.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,p),r.add(h),c.add(h),l.add(h),n.setXYZ(g,r.x,r.y,r.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,m=e.count;f<m;f+=3)i.fromBufferAttribute(e,f+0),o.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,o),u.subVectors(i,o),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ze.fromBufferAttribute(t,e),ze.normalize(),t.setXYZ(e,ze.x,ze.y,ze.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,f=new l.constructor(c.length*h);let m=0,g=0;for(let x=0,p=c.length;x<p;x++){r.isInterleavedBufferAttribute?m=c[x]*r.data.stride+r.offset:m=c[x]*h;for(let d=0;d<h;d++)f[g++]=l[m++]}return new Le(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new cn,n=this.index.array,i=this.attributes;for(const r in i){const c=i[r],l=t(c,n);e.setAttribute(r,l)}const o=this.morphAttributes;for(const r in o){const c=[],l=o[r];for(let h=0,u=l.length;h<u;h++){const f=l[h],m=t(f,n);c.push(m)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const i={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const m=l[u];h.push(m.toJSON(t.data))}h.length>0&&(i[c]=h,o=!0)}o&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let f=0,m=u.length;f<m;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Hl=new se,Oi=new Rc,jo=new Di,Vl=new B,vs=new B,xs=new B,Ms=new B,Rr=new B,Yo=new B,Ko=new Ht,Zo=new Ht,Jo=new Ht,$l=new B,Xl=new B,ql=new B,Qo=new B,ta=new B;class _e extends pn{constructor(t=new cn,e=new ef){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=i.length;o<a;o++){const r=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,o=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const r=this.morphTargetInfluences;if(o&&r){Yo.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=r[c],u=o[c];h!==0&&(Rr.fromBufferAttribute(u,t),a?Yo.addScaledVector(Rr,h):Yo.addScaledVector(Rr.sub(e),h))}e.add(Yo)}return e}raycast(t,e){const n=this.geometry,i=this.material,o=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),jo.copy(n.boundingSphere),jo.applyMatrix4(o),Oi.copy(t.ray).recast(t.near),!(jo.containsPoint(Oi.origin)===!1&&(Oi.intersectSphere(jo,Vl)===null||Oi.origin.distanceToSquared(Vl)>(t.far-t.near)**2))&&(Hl.copy(o).invert(),Oi.copy(t.ray).applyMatrix4(Hl),!(n.boundingBox!==null&&Oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Oi)))}_computeIntersections(t,e,n){let i;const o=this.geometry,a=this.material,r=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,m=o.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,x=f.length;g<x;g++){const p=f[g],d=a[p.materialIndex],v=Math.max(p.start,m.start),M=Math.min(r.count,Math.min(p.start+p.count,m.start+m.count));for(let S=v,b=M;S<b;S+=3){const w=r.getX(S),E=r.getX(S+1),A=r.getX(S+2);i=ea(this,d,t,n,l,h,u,w,E,A),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const g=Math.max(0,m.start),x=Math.min(r.count,m.start+m.count);for(let p=g,d=x;p<d;p+=3){const v=r.getX(p),M=r.getX(p+1),S=r.getX(p+2);i=ea(this,a,t,n,l,h,u,v,M,S),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,x=f.length;g<x;g++){const p=f[g],d=a[p.materialIndex],v=Math.max(p.start,m.start),M=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let S=v,b=M;S<b;S+=3){const w=S,E=S+1,A=S+2;i=ea(this,d,t,n,l,h,u,w,E,A),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const g=Math.max(0,m.start),x=Math.min(c.count,m.start+m.count);for(let p=g,d=x;p<d;p+=3){const v=p,M=p+1,S=p+2;i=ea(this,a,t,n,l,h,u,v,M,S),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function Zp(s,t,e,n,i,o,a,r){let c;if(t.side===rn?c=n.intersectTriangle(a,o,i,!0,r):c=n.intersectTriangle(i,o,a,t.side===vi,r),c===null)return null;ta.copy(r),ta.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(ta);return l<e.near||l>e.far?null:{distance:l,point:ta.clone(),object:s}}function ea(s,t,e,n,i,o,a,r,c,l){s.getVertexPosition(r,vs),s.getVertexPosition(c,xs),s.getVertexPosition(l,Ms);const h=Zp(s,t,e,n,vs,xs,Ms,Qo);if(h){i&&(Ko.fromBufferAttribute(i,r),Zo.fromBufferAttribute(i,c),Jo.fromBufferAttribute(i,l),h.uv=Fn.getInterpolation(Qo,vs,xs,Ms,Ko,Zo,Jo,new Ht)),o&&(Ko.fromBufferAttribute(o,r),Zo.fromBufferAttribute(o,c),Jo.fromBufferAttribute(o,l),h.uv1=Fn.getInterpolation(Qo,vs,xs,Ms,Ko,Zo,Jo,new Ht),h.uv2=h.uv1),a&&($l.fromBufferAttribute(a,r),Xl.fromBufferAttribute(a,c),ql.fromBufferAttribute(a,l),h.normal=Fn.getInterpolation(Qo,vs,xs,Ms,$l,Xl,ql,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:c,c:l,normal:new B,materialIndex:0};Fn.getNormal(vs,xs,Ms,u.normal),h.face=u}return h}class Lo extends cn{constructor(t=1,e=1,n=1,i=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:o,depthSegments:a};const r=this;i=Math.floor(i),o=Math.floor(o),a=Math.floor(a);const c=[],l=[],h=[],u=[];let f=0,m=0;g("z","y","x",-1,-1,n,e,t,a,o,0),g("z","y","x",1,-1,n,e,-t,a,o,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,o,4),g("x","y","z",-1,-1,t,e,-n,i,o,5),this.setIndex(c),this.setAttribute("position",new Ae(l,3)),this.setAttribute("normal",new Ae(h,3)),this.setAttribute("uv",new Ae(u,2));function g(x,p,d,v,M,S,b,w,E,A,_){const y=S/E,C=b/A,P=S/2,I=b/2,R=w/2,U=E+1,F=A+1;let G=0,W=0;const K=new B;for(let H=0;H<F;H++){const et=H*C-I;for(let ct=0;ct<U;ct++){const Q=ct*y-P;K[x]=Q*v,K[p]=et*M,K[d]=R,l.push(K.x,K.y,K.z),K[x]=0,K[p]=0,K[d]=w>0?1:-1,h.push(K.x,K.y,K.z),u.push(ct/E),u.push(1-H/A),G+=1}}for(let H=0;H<A;H++)for(let et=0;et<E;et++){const ct=f+et+U*H,Q=f+et+U*(H+1),nt=f+(et+1)+U*(H+1),dt=f+(et+1)+U*H;c.push(ct,Q,dt),c.push(Q,nt,dt),W+=6}r.addGroup(m,W,_),m+=W,f+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Lo(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Hs(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Qe(s){const t={};for(let e=0;e<s.length;e++){const n=Hs(s[e]);for(const i in n)t[i]=n[i]}return t}function Jp(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function of(s){return s.getRenderTarget()===null?s.outputColorSpace:le.workingColorSpace}const Qp={clone:Hs,merge:Qe};var t0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,e0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Te extends Ro{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=t0,this.fragmentShader=e0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Hs(t.uniforms),this.uniformsGroups=Jp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class af extends pn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=pi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class yn extends af{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Eo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(po*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Eo*2*Math.atan(Math.tan(po*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(po*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,o=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;o+=a.offsetX*i/c,e-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const _s=-90,ys=1;class n0 extends pn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new yn(_s,ys,t,e);i.layers=this.layers,this.add(i);const o=new yn(_s,ys,t,e);o.layers=this.layers,this.add(o);const a=new yn(_s,ys,t,e);a.layers=this.layers,this.add(a);const r=new yn(_s,ys,t,e);r.layers=this.layers,this.add(r);const c=new yn(_s,ys,t,e);c.layers=this.layers,this.add(c);const l=new yn(_s,ys,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,o,a,r,c]=e;for(const l of e)this.remove(l);if(t===pi)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===za)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,o),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,r),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,f,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class rf extends dn{constructor(t,e,n,i,o,a,r,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Bs,super(t,e,n,i,o,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class i0 extends Zn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(go("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===es?Oe:Rn),this.texture=new rf(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Be}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Lo(5,5,5),o=new Te({name:"CubemapFromEquirect",uniforms:Hs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:gi});o.uniforms.tEquirect.value=e;const a=new _e(i,o),r=e.minFilter;return e.minFilter===ns&&(e.minFilter=Be),new n0(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(o)}}const Lr=new B,s0=new B,o0=new Qt;class Hi{constructor(t=new B(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Lr.subVectors(n,e).cross(s0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Lr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/i;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||o0.getNormalMatrix(t),i=this.coplanarPoint(Lr).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Bi=new Di,na=new B;class Ii{constructor(t=new Hi,e=new Hi,n=new Hi,i=new Hi,o=new Hi,a=new Hi){this.planes=[t,e,n,i,o,a]}set(t,e,n,i,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(n),r[3].copy(i),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=pi){const n=this.planes,i=t.elements,o=i[0],a=i[1],r=i[2],c=i[3],l=i[4],h=i[5],u=i[6],f=i[7],m=i[8],g=i[9],x=i[10],p=i[11],d=i[12],v=i[13],M=i[14],S=i[15];if(n[0].setComponents(c-o,f-l,p-m,S-d).normalize(),n[1].setComponents(c+o,f+l,p+m,S+d).normalize(),n[2].setComponents(c+a,f+h,p+g,S+v).normalize(),n[3].setComponents(c-a,f-h,p-g,S-v).normalize(),n[4].setComponents(c-r,f-u,p-x,S-M).normalize(),e===pi)n[5].setComponents(c+r,f+u,p+x,S+M).normalize();else if(e===za)n[5].setComponents(r,u,x,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Bi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Bi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Bi)}intersectsSprite(t){return Bi.center.set(0,0,0),Bi.radius=.7071067811865476,Bi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Bi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(na.x=i.normal.x>0?t.max.x:t.min.x,na.y=i.normal.y>0?t.max.y:t.min.y,na.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(na)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function cf(){let s=null,t=!1,e=null,n=null;function i(o,a){e(o,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){s=o}}}function a0(s,t){const e=t.isWebGL2,n=new WeakMap;function i(l,h){const u=l.array,f=l.usage,m=u.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,u,f),l.onUploadCallback();let x;if(u instanceof Float32Array)x=s.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)x=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)x=s.SHORT;else if(u instanceof Uint32Array)x=s.UNSIGNED_INT;else if(u instanceof Int32Array)x=s.INT;else if(u instanceof Int8Array)x=s.BYTE;else if(u instanceof Uint8Array)x=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)x=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:m}}function o(l,h,u){const f=h.array,m=h._updateRange,g=h.updateRanges;if(s.bindBuffer(u,l),m.count===-1&&g.length===0&&s.bufferSubData(u,0,f),g.length!==0){for(let x=0,p=g.length;x<p;x++){const d=g[x];e?s.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):s.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}h.clearUpdateRanges()}m.count!==-1&&(e?s.bufferSubData(u,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):s.bufferSubData(u,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(s.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,i(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(u.buffer,l,h),u.version=l.version}}return{get:a,remove:r,update:c}}class Pc extends cn{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const o=t/2,a=e/2,r=Math.floor(n),c=Math.floor(i),l=r+1,h=c+1,u=t/r,f=e/c,m=[],g=[],x=[],p=[];for(let d=0;d<h;d++){const v=d*f-a;for(let M=0;M<l;M++){const S=M*u-o;g.push(S,-v,0),x.push(0,0,1),p.push(M/r),p.push(1-d/c)}}for(let d=0;d<c;d++)for(let v=0;v<r;v++){const M=v+l*d,S=v+l*(d+1),b=v+1+l*(d+1),w=v+1+l*d;m.push(M,S,w),m.push(S,b,w)}this.setIndex(m),this.setAttribute("position",new Ae(g,3)),this.setAttribute("normal",new Ae(x,3)),this.setAttribute("uv",new Ae(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pc(t.width,t.height,t.widthSegments,t.heightSegments)}}var r0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,c0=`#ifdef USE_ALPHAHASH
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
#endif`,l0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,h0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,u0=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,f0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,d0=`#ifdef USE_AOMAP
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
#endif`,p0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,m0=`#ifdef USE_BATCHING
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
#endif`,g0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,v0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,x0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,M0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_0=`#ifdef USE_IRIDESCENCE
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
#endif`,y0=`#ifdef USE_BUMPMAP
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
#endif`,w0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,S0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,E0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,A0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,T0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,C0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,R0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,L0=`#define PI 3.141592653589793
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
} // validated`,P0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,D0=`vec3 transformedNormal = objectNormal;
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
#endif`,I0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,U0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,k0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,z0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,F0="gl_FragColor = linearToOutputTexel( gl_FragColor );",N0=`
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
}`,O0=`#ifdef USE_ENVMAP
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
#endif`,B0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,W0=`#ifdef USE_ENVMAP
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
#endif`,G0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,H0=`#ifdef USE_ENVMAP
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
#endif`,V0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,X0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,q0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,j0=`#ifdef USE_GRADIENTMAP
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
}`,Y0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,K0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Z0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,J0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Q0=`uniform bool receiveShadow;
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
#endif`,tm=`#ifdef USE_ENVMAP
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
#endif`,em=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,im=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,om=`PhysicalMaterial material;
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
#endif`,am=`struct PhysicalMaterial {
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
}`,rm=`
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
#endif`,cm=`#if defined( RE_IndirectDiffuse )
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
#endif`,lm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,um=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,dm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,pm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vm=`#if defined( USE_POINTS_UV )
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
#endif`,xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_m=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ym=`#ifdef USE_MORPHNORMALS
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
#endif`,wm=`#ifdef USE_MORPHTARGETS
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
#endif`,bm=`#ifdef USE_MORPHTARGETS
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
#endif`,Sm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Em=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Am=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rm=`#ifdef USE_NORMALMAP
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
#endif`,Lm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Dm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Im=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Um=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,km=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,zm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Nm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Om=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Hm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,$m=`float getShadowMask() {
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
}`,Xm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qm=`#ifdef USE_SKINNING
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
#endif`,jm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ym=`#ifdef USE_SKINNING
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
#endif`,Km=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Zm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Jm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,tg=`#ifdef USE_TRANSMISSION
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
#endif`,eg=`#ifdef USE_TRANSMISSION
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,og=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ag=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rg=`uniform sampler2D t2D;
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
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ug=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fg=`#include <common>
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
}`,dg=`#if DEPTH_PACKING == 3200
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
}`,pg=`#define DISTANCE
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
}`,mg=`#define DISTANCE
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
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`uniform float scale;
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
}`,Mg=`uniform vec3 diffuse;
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
}`,_g=`#include <common>
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
}`,yg=`uniform vec3 diffuse;
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
}`,wg=`#define LAMBERT
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
}`,bg=`#define LAMBERT
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
}`,Sg=`#define MATCAP
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
}`,Eg=`#define MATCAP
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
}`,Ag=`#define NORMAL
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
}`,Tg=`#define NORMAL
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
}`,Cg=`#define PHONG
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
}`,Rg=`#define PHONG
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
}`,Lg=`#define STANDARD
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
}`,Pg=`#define STANDARD
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
}`,Dg=`#define TOON
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
}`,Ig=`#define TOON
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
}`,Ug=`uniform float size;
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
}`,kg=`uniform vec3 diffuse;
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
}`,zg=`#include <common>
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
}`,Fg=`uniform vec3 color;
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
}`,Ng=`uniform float rotation;
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
}`,Og=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:r0,alphahash_pars_fragment:c0,alphamap_fragment:l0,alphamap_pars_fragment:h0,alphatest_fragment:u0,alphatest_pars_fragment:f0,aomap_fragment:d0,aomap_pars_fragment:p0,batching_pars_vertex:m0,batching_vertex:g0,begin_vertex:v0,beginnormal_vertex:x0,bsdfs:M0,iridescence_fragment:_0,bumpmap_pars_fragment:y0,clipping_planes_fragment:w0,clipping_planes_pars_fragment:b0,clipping_planes_pars_vertex:S0,clipping_planes_vertex:E0,color_fragment:A0,color_pars_fragment:T0,color_pars_vertex:C0,color_vertex:R0,common:L0,cube_uv_reflection_fragment:P0,defaultnormal_vertex:D0,displacementmap_pars_vertex:I0,displacementmap_vertex:U0,emissivemap_fragment:k0,emissivemap_pars_fragment:z0,colorspace_fragment:F0,colorspace_pars_fragment:N0,envmap_fragment:O0,envmap_common_pars_fragment:B0,envmap_pars_fragment:W0,envmap_pars_vertex:G0,envmap_physical_pars_fragment:tm,envmap_vertex:H0,fog_vertex:V0,fog_pars_vertex:$0,fog_fragment:X0,fog_pars_fragment:q0,gradientmap_pars_fragment:j0,lightmap_fragment:Y0,lightmap_pars_fragment:K0,lights_lambert_fragment:Z0,lights_lambert_pars_fragment:J0,lights_pars_begin:Q0,lights_toon_fragment:em,lights_toon_pars_fragment:nm,lights_phong_fragment:im,lights_phong_pars_fragment:sm,lights_physical_fragment:om,lights_physical_pars_fragment:am,lights_fragment_begin:rm,lights_fragment_maps:cm,lights_fragment_end:lm,logdepthbuf_fragment:hm,logdepthbuf_pars_fragment:um,logdepthbuf_pars_vertex:fm,logdepthbuf_vertex:dm,map_fragment:pm,map_pars_fragment:mm,map_particle_fragment:gm,map_particle_pars_fragment:vm,metalnessmap_fragment:xm,metalnessmap_pars_fragment:Mm,morphcolor_vertex:_m,morphnormal_vertex:ym,morphtarget_pars_vertex:wm,morphtarget_vertex:bm,normal_fragment_begin:Sm,normal_fragment_maps:Em,normal_pars_fragment:Am,normal_pars_vertex:Tm,normal_vertex:Cm,normalmap_pars_fragment:Rm,clearcoat_normal_fragment_begin:Lm,clearcoat_normal_fragment_maps:Pm,clearcoat_pars_fragment:Dm,iridescence_pars_fragment:Im,opaque_fragment:Um,packing:km,premultiplied_alpha_fragment:zm,project_vertex:Fm,dithering_fragment:Nm,dithering_pars_fragment:Om,roughnessmap_fragment:Bm,roughnessmap_pars_fragment:Wm,shadowmap_pars_fragment:Gm,shadowmap_pars_vertex:Hm,shadowmap_vertex:Vm,shadowmask_pars_fragment:$m,skinbase_vertex:Xm,skinning_pars_vertex:qm,skinning_vertex:jm,skinnormal_vertex:Ym,specularmap_fragment:Km,specularmap_pars_fragment:Zm,tonemapping_fragment:Jm,tonemapping_pars_fragment:Qm,transmission_fragment:tg,transmission_pars_fragment:eg,uv_pars_fragment:ng,uv_pars_vertex:ig,uv_vertex:sg,worldpos_vertex:og,background_vert:ag,background_frag:rg,backgroundCube_vert:cg,backgroundCube_frag:lg,cube_vert:hg,cube_frag:ug,depth_vert:fg,depth_frag:dg,distanceRGBA_vert:pg,distanceRGBA_frag:mg,equirect_vert:gg,equirect_frag:vg,linedashed_vert:xg,linedashed_frag:Mg,meshbasic_vert:_g,meshbasic_frag:yg,meshlambert_vert:wg,meshlambert_frag:bg,meshmatcap_vert:Sg,meshmatcap_frag:Eg,meshnormal_vert:Ag,meshnormal_frag:Tg,meshphong_vert:Cg,meshphong_frag:Rg,meshphysical_vert:Lg,meshphysical_frag:Pg,meshtoon_vert:Dg,meshtoon_frag:Ig,points_vert:Ug,points_frag:kg,shadow_vert:zg,shadow_frag:Fg,sprite_vert:Ng,sprite_frag:Og},vt={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qt},normalScale:{value:new Ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0},uvTransform:{value:new Qt}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new Ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}}},Hn={basic:{uniforms:Qe([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Qe([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Gt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Qe([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Qe([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Qe([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new Gt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Qe([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Qe([vt.points,vt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Qe([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Qe([vt.common,vt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Qe([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Qe([vt.sprite,vt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Qe([vt.common,vt.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Qe([vt.lights,vt.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};Hn.physical={uniforms:Qe([Hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qt},clearcoatNormalScale:{value:new Ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qt},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qt},transmissionSamplerSize:{value:new Ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qt},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qt},anisotropyVector:{value:new Ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const ia={r:0,b:0,g:0};function Bg(s,t,e,n,i,o,a){const r=new Gt(0);let c=o===!0?0:1,l,h,u=null,f=0,m=null;function g(p,d){let v=!1,M=d.isScene===!0?d.background:null;M&&M.isTexture&&(M=(d.backgroundBlurriness>0?e:t).get(M)),M===null?x(r,c):M&&M.isColor&&(x(M,1),v=!0);const S=s.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||v)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Ka)?(h===void 0&&(h=new _e(new Lo(1,1,1),new Te({name:"BackgroundCubeMaterial",uniforms:Hs(Hn.backgroundCube.uniforms),vertexShader:Hn.backgroundCube.vertexShader,fragmentShader:Hn.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=le.getTransfer(M.colorSpace)!==fe,(u!==M||f!==M.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,u=M,f=M.version,m=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new _e(new Pc(2,2),new Te({name:"BackgroundMaterial",uniforms:Hs(Hn.background.uniforms),vertexShader:Hn.background.vertexShader,fragmentShader:Hn.background.fragmentShader,side:vi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,l.material.toneMapped=le.getTransfer(M.colorSpace)!==fe,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||m!==s.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,m=s.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function x(p,d){p.getRGB(ia,of(s)),n.buffers.color.setClear(ia.r,ia.g,ia.b,d,a)}return{getClearColor:function(){return r},setClearColor:function(p,d=1){r.set(p),c=d,x(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,x(r,c)},render:g}}function Wg(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),o=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||o!==null,r={},c=p(null);let l=c,h=!1;function u(R,U,F,G,W){let K=!1;if(a){const H=x(G,F,U);l!==H&&(l=H,m(l.object)),K=d(R,G,F,W),K&&v(R,G,F,W)}else{const H=U.wireframe===!0;(l.geometry!==G.id||l.program!==F.id||l.wireframe!==H)&&(l.geometry=G.id,l.program=F.id,l.wireframe=H,K=!0)}W!==null&&e.update(W,s.ELEMENT_ARRAY_BUFFER),(K||h)&&(h=!1,A(R,U,F,G),W!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function f(){return n.isWebGL2?s.createVertexArray():o.createVertexArrayOES()}function m(R){return n.isWebGL2?s.bindVertexArray(R):o.bindVertexArrayOES(R)}function g(R){return n.isWebGL2?s.deleteVertexArray(R):o.deleteVertexArrayOES(R)}function x(R,U,F){const G=F.wireframe===!0;let W=r[R.id];W===void 0&&(W={},r[R.id]=W);let K=W[U.id];K===void 0&&(K={},W[U.id]=K);let H=K[G];return H===void 0&&(H=p(f()),K[G]=H),H}function p(R){const U=[],F=[],G=[];for(let W=0;W<i;W++)U[W]=0,F[W]=0,G[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:F,attributeDivisors:G,object:R,attributes:{},index:null}}function d(R,U,F,G){const W=l.attributes,K=U.attributes;let H=0;const et=F.getAttributes();for(const ct in et)if(et[ct].location>=0){const nt=W[ct];let dt=K[ct];if(dt===void 0&&(ct==="instanceMatrix"&&R.instanceMatrix&&(dt=R.instanceMatrix),ct==="instanceColor"&&R.instanceColor&&(dt=R.instanceColor)),nt===void 0||nt.attribute!==dt||dt&&nt.data!==dt.data)return!0;H++}return l.attributesNum!==H||l.index!==G}function v(R,U,F,G){const W={},K=U.attributes;let H=0;const et=F.getAttributes();for(const ct in et)if(et[ct].location>=0){let nt=K[ct];nt===void 0&&(ct==="instanceMatrix"&&R.instanceMatrix&&(nt=R.instanceMatrix),ct==="instanceColor"&&R.instanceColor&&(nt=R.instanceColor));const dt={};dt.attribute=nt,nt&&nt.data&&(dt.data=nt.data),W[ct]=dt,H++}l.attributes=W,l.attributesNum=H,l.index=G}function M(){const R=l.newAttributes;for(let U=0,F=R.length;U<F;U++)R[U]=0}function S(R){b(R,0)}function b(R,U){const F=l.newAttributes,G=l.enabledAttributes,W=l.attributeDivisors;F[R]=1,G[R]===0&&(s.enableVertexAttribArray(R),G[R]=1),W[R]!==U&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,U),W[R]=U)}function w(){const R=l.newAttributes,U=l.enabledAttributes;for(let F=0,G=U.length;F<G;F++)U[F]!==R[F]&&(s.disableVertexAttribArray(F),U[F]=0)}function E(R,U,F,G,W,K,H){H===!0?s.vertexAttribIPointer(R,U,F,W,K):s.vertexAttribPointer(R,U,F,G,W,K)}function A(R,U,F,G){if(n.isWebGL2===!1&&(R.isInstancedMesh||G.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();const W=G.attributes,K=F.getAttributes(),H=U.defaultAttributeValues;for(const et in K){const ct=K[et];if(ct.location>=0){let Q=W[et];if(Q===void 0&&(et==="instanceMatrix"&&R.instanceMatrix&&(Q=R.instanceMatrix),et==="instanceColor"&&R.instanceColor&&(Q=R.instanceColor)),Q!==void 0){const nt=Q.normalized,dt=Q.itemSize,Mt=e.get(Q);if(Mt===void 0)continue;const bt=Mt.buffer,Rt=Mt.type,Lt=Mt.bytesPerElement,St=n.isWebGL2===!0&&(Rt===s.INT||Rt===s.UNSIGNED_INT||Q.gpuType===Bu);if(Q.isInterleavedBufferAttribute){const Ft=Q.data,X=Ft.stride,ue=Q.offset;if(Ft.isInstancedInterleavedBuffer){for(let Tt=0;Tt<ct.locationSize;Tt++)b(ct.location+Tt,Ft.meshPerAttribute);R.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Ft.meshPerAttribute*Ft.count)}else for(let Tt=0;Tt<ct.locationSize;Tt++)S(ct.location+Tt);s.bindBuffer(s.ARRAY_BUFFER,bt);for(let Tt=0;Tt<ct.locationSize;Tt++)E(ct.location+Tt,dt/ct.locationSize,Rt,nt,X*Lt,(ue+dt/ct.locationSize*Tt)*Lt,St)}else{if(Q.isInstancedBufferAttribute){for(let Ft=0;Ft<ct.locationSize;Ft++)b(ct.location+Ft,Q.meshPerAttribute);R.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let Ft=0;Ft<ct.locationSize;Ft++)S(ct.location+Ft);s.bindBuffer(s.ARRAY_BUFFER,bt);for(let Ft=0;Ft<ct.locationSize;Ft++)E(ct.location+Ft,dt/ct.locationSize,Rt,nt,dt*Lt,dt/ct.locationSize*Ft*Lt,St)}}else if(H!==void 0){const nt=H[et];if(nt!==void 0)switch(nt.length){case 2:s.vertexAttrib2fv(ct.location,nt);break;case 3:s.vertexAttrib3fv(ct.location,nt);break;case 4:s.vertexAttrib4fv(ct.location,nt);break;default:s.vertexAttrib1fv(ct.location,nt)}}}}w()}function _(){P();for(const R in r){const U=r[R];for(const F in U){const G=U[F];for(const W in G)g(G[W].object),delete G[W];delete U[F]}delete r[R]}}function y(R){if(r[R.id]===void 0)return;const U=r[R.id];for(const F in U){const G=U[F];for(const W in G)g(G[W].object),delete G[W];delete U[F]}delete r[R.id]}function C(R){for(const U in r){const F=r[U];if(F[R.id]===void 0)continue;const G=F[R.id];for(const W in G)g(G[W].object),delete G[W];delete F[R.id]}}function P(){I(),h=!0,l!==c&&(l=c,m(l.object))}function I(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:P,resetDefaultState:I,dispose:_,releaseStatesOfGeometry:y,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:S,disableUnusedAttributes:w}}function Gg(s,t,e,n){const i=n.isWebGL2;let o;function a(h){o=h}function r(h,u){s.drawArrays(o,h,u),e.update(u,o,1)}function c(h,u,f){if(f===0)return;let m,g;if(i)m=s,g="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](o,h,u,f),e.update(u,o,f)}function l(h,u,f){if(f===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{m.multiDrawArraysWEBGL(o,h,0,u,0,f);let g=0;for(let x=0;x<f;x++)g+=u[x];e.update(g,o,1)}}this.setMode=a,this.render=r,this.renderInstances=c,this.renderMultiDraw=l}function Hg(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function o(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let r=e.precision!==void 0?e.precision:"highp";const c=o(r);c!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",c,"instead."),r=c);const l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),x=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),d=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),M=f>0,S=a||t.has("OES_texture_float"),b=M&&S,w=a?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:o,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:p,maxVaryings:d,maxFragmentUniforms:v,vertexTextures:M,floatFragmentTextures:S,floatVertexTextures:b,maxSamples:w}}function Vg(s){const t=this;let e=null,n=0,i=!1,o=!1;const a=new Hi,r=new Qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const m=u.length!==0||f||n!==0||i;return i=f,n=u.length,m},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,m){const g=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,d=s.get(u);if(!i||g===null||g.length===0||o&&!p)o?h(null):l();else{const v=o?0:n,M=v*4;let S=d.clippingState||null;c.value=S,S=h(g,f,M,m);for(let b=0;b!==M;++b)S[b]=e[b];d.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,m,g){const x=u!==null?u.length:0;let p=null;if(x!==0){if(p=c.value,g!==!0||p===null){const d=m+x*4,v=f.matrixWorldInverse;r.getNormalMatrix(v),(p===null||p.length<d)&&(p=new Float32Array(d));for(let M=0,S=m;M!==x;++M,S+=4)a.copy(u[M]).applyMatrix4(v,r),a.normal.toArray(p,S),p[S+3]=a.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}function $g(s){let t=new WeakMap;function e(a,r){return r===rc?a.mapping=Bs:r===cc&&(a.mapping=Ws),a}function n(a){if(a&&a.isTexture){const r=a.mapping;if(r===rc||r===cc)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new i0(c.height/2);return l.fromEquirectangularTexture(s,a),t.set(a,l),a.addEventListener("dispose",i),e(l.texture,a.mapping)}else return null}}return a}function i(a){const r=a.target;r.removeEventListener("dispose",i);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class Qa extends af{constructor(t=-1,e=1,n=1,i=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let o=n-t,a=n+t,r=i+e,c=i-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,a=o+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ls=4,jl=[.125,.215,.35,.446,.526,.582],ji=20,Pr=new Qa,Yl=new Gt;let Dr=null,Ir=0,Ur=0;const Vi=(1+Math.sqrt(5))/2,ws=1/Vi,Kl=[new B(1,1,1),new B(-1,1,1),new B(1,1,-1),new B(-1,1,-1),new B(0,Vi,ws),new B(0,Vi,-ws),new B(ws,0,Vi),new B(-ws,0,Vi),new B(Vi,ws,0),new B(-Vi,ws,0)];class Zl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Dr=this._renderer.getRenderTarget(),Ir=this._renderer.getActiveCubeFace(),Ur=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,i,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=th(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ql(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Dr,Ir,Ur),t.scissorTest=!1,sa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Bs||t.mapping===Ws?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Dr=this._renderer.getRenderTarget(),Ir=this._renderer.getActiveCubeFace(),Ur=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Be,minFilter:Be,generateMipmaps:!1,type:Ri,format:Ee,colorSpace:xi,depthBuffer:!1},i=Jl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jl(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Xg(o)),this._blurMaterial=qg(o,t,e)}return i}_compileMaterial(t){const e=new _e(this._lodPlanes[0],t);this._renderer.compile(e,Pr)}_sceneToCubeUV(t,e,n,i){const r=new yn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Yl),h.toneMapping=Ci,h.autoClear=!1;const m=new ef({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),g=new _e(new Lo,m);let x=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,x=!0):(m.color.copy(Yl),x=!0);for(let d=0;d<6;d++){const v=d%3;v===0?(r.up.set(0,c[d],0),r.lookAt(l[d],0,0)):v===1?(r.up.set(0,0,c[d]),r.lookAt(0,l[d],0)):(r.up.set(0,c[d],0),r.lookAt(0,0,l[d]));const M=this._cubeSize;sa(i,v*M,d>2?M:0,M,M),h.setRenderTarget(i),x&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Bs||t.mapping===Ws;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=th()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ql());const o=i?this._cubemapMaterial:this._equirectMaterial,a=new _e(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const c=this._cubeSize;sa(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Pr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const o=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=Kl[(i-1)%Kl.length];this._blur(t,i-1,i,o,a)}e.autoClear=n}_blur(t,e,n,i,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",o),this._halfBlur(a,t,n,n,i,"longitudinal",o)}_halfBlur(t,e,n,i,o,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new _e(this._lodPlanes[i],l),f=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*m):2*Math.PI/(2*ji-1),x=o/g,p=isFinite(o)?1+Math.floor(h*x):ji;p>ji&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ji}`);const d=[];let v=0;for(let E=0;E<ji;++E){const A=E/x,_=Math.exp(-A*A/2);d.push(_),E===0?v+=_:E<p&&(v+=2*_)}for(let E=0;E<d.length;E++)d[E]=d[E]/v;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=a==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:M}=this;f.dTheta.value=g,f.mipInt.value=M-n;const S=this._sizeLods[i],b=3*S*(i>M-Ls?i-M+Ls:0),w=4*(this._cubeSize-S);sa(e,b,w,3*S,2*S),c.setRenderTarget(e),c.render(u,Pr)}}function Xg(s){const t=[],e=[],n=[];let i=s;const o=s-Ls+1+jl.length;for(let a=0;a<o;a++){const r=Math.pow(2,i);e.push(r);let c=1/r;a>s-Ls?c=jl[a-s+Ls-1]:a===0&&(c=0),n.push(c);const l=1/(r-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,x=3,p=2,d=1,v=new Float32Array(x*g*m),M=new Float32Array(p*g*m),S=new Float32Array(d*g*m);for(let w=0;w<m;w++){const E=w%3*2/3-1,A=w>2?0:-1,_=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];v.set(_,x*g*w),M.set(f,p*g*w);const y=[w,w,w,w,w,w];S.set(y,d*g*w)}const b=new cn;b.setAttribute("position",new Le(v,x)),b.setAttribute("uv",new Le(M,p)),b.setAttribute("faceIndex",new Le(S,d)),t.push(b),i>Ls&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Jl(s,t,e){const n=new Zn(s,t,e);return n.texture.mapping=Ka,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function sa(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function qg(s,t,e){const n=new Float32Array(ji),i=new B(0,1,0);return new Te({name:"SphericalGaussianBlur",defines:{n:ji,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Dc(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Ql(){return new Te({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Dc(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function th(){return new Te({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Dc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Dc(){return`

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
	`}function jg(s){let t=new WeakMap,e=null;function n(r){if(r&&r.isTexture){const c=r.mapping,l=c===rc||c===cc,h=c===Bs||c===Ws;if(l||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=t.get(r);return e===null&&(e=new Zl(s)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),t.set(r,u),u.texture}else{if(t.has(r))return t.get(r).texture;{const u=r.image;if(l&&u&&u.height>0||h&&u&&i(u)){e===null&&(e=new Zl(s));const f=l?e.fromEquirectangular(r):e.fromCubemap(r);return t.set(r,f),r.addEventListener("dispose",o),f.texture}else return null}}}return r}function i(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function o(r){const c=r.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Yg(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Kg(s,t,e,n){const i={},o=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const x=f.morphAttributes[g];for(let p=0,d=x.length;p<d;p++)t.remove(x[p])}f.removeEventListener("dispose",a),delete i[f.id];const m=o.get(f);m&&(t.remove(m),o.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function r(u,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],s.ARRAY_BUFFER);const m=u.morphAttributes;for(const g in m){const x=m[g];for(let p=0,d=x.length;p<d;p++)t.update(x[p],s.ARRAY_BUFFER)}}function l(u){const f=[],m=u.index,g=u.attributes.position;let x=0;if(m!==null){const v=m.array;x=m.version;for(let M=0,S=v.length;M<S;M+=3){const b=v[M+0],w=v[M+1],E=v[M+2];f.push(b,w,w,E,E,b)}}else if(g!==void 0){const v=g.array;x=g.version;for(let M=0,S=v.length/3-1;M<S;M+=3){const b=M+0,w=M+1,E=M+2;f.push(b,w,w,E,E,b)}}else return;const p=new(Ku(f)?sf:nf)(f,1);p.version=x;const d=o.get(u);d&&t.remove(d),o.set(u,p)}function h(u){const f=o.get(u);if(f){const m=u.index;m!==null&&f.version<m.version&&l(u)}else l(u);return o.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function Zg(s,t,e,n){const i=n.isWebGL2;let o;function a(m){o=m}let r,c;function l(m){r=m.type,c=m.bytesPerElement}function h(m,g){s.drawElements(o,g,r,m*c),e.update(g,o,1)}function u(m,g,x){if(x===0)return;let p,d;if(i)p=s,d="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[d](o,g,r,m*c,x),e.update(g,o,x)}function f(m,g,x){if(x===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<x;d++)this.render(m[d]/c,g[d]);else{p.multiDrawElementsWEBGL(o,g,0,r,m,0,x);let d=0;for(let v=0;v<x;v++)d+=g[v];e.update(d,o,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function Jg(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,a,r){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=r*(o/3);break;case s.LINES:e.lines+=r*(o/2);break;case s.LINE_STRIP:e.lines+=r*(o-1);break;case s.LINE_LOOP:e.lines+=r*o;break;case s.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Qg(s,t){return s[0]-t[0]}function t1(s,t){return Math.abs(t[1])-Math.abs(s[1])}function e1(s,t,e){const n={},i=new Float32Array(8),o=new WeakMap,a=new ee,r=[];for(let l=0;l<8;l++)r[l]=[l,0];function c(l,h,u){const f=l.morphTargetInfluences;if(t.isWebGL2===!0){const m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=m!==void 0?m.length:0;let x=o.get(h);if(x===void 0||x.count!==g){let R=function(){P.dispose(),o.delete(h),h.removeEventListener("dispose",R)};x!==void 0&&x.texture.dispose();const v=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,S=h.morphAttributes.color!==void 0,b=h.morphAttributes.position||[],w=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let A=0;v===!0&&(A=1),M===!0&&(A=2),S===!0&&(A=3);let _=h.attributes.position.count*A,y=1;_>t.maxTextureSize&&(y=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const C=new Float32Array(_*y*4*g),P=new Qu(C,_,y,g);P.type=di,P.needsUpdate=!0;const I=A*4;for(let U=0;U<g;U++){const F=b[U],G=w[U],W=E[U],K=_*y*4*U;for(let H=0;H<F.count;H++){const et=H*I;v===!0&&(a.fromBufferAttribute(F,H),C[K+et+0]=a.x,C[K+et+1]=a.y,C[K+et+2]=a.z,C[K+et+3]=0),M===!0&&(a.fromBufferAttribute(G,H),C[K+et+4]=a.x,C[K+et+5]=a.y,C[K+et+6]=a.z,C[K+et+7]=0),S===!0&&(a.fromBufferAttribute(W,H),C[K+et+8]=a.x,C[K+et+9]=a.y,C[K+et+10]=a.z,C[K+et+11]=W.itemSize===4?a.w:1)}}x={count:g,texture:P,size:new Ht(_,y)},o.set(h,x),h.addEventListener("dispose",R)}let p=0;for(let v=0;v<f.length;v++)p+=f[v];const d=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(s,"morphTargetBaseInfluence",d),u.getUniforms().setValue(s,"morphTargetInfluences",f),u.getUniforms().setValue(s,"morphTargetsTexture",x.texture,e),u.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}else{const m=f===void 0?0:f.length;let g=n[h.id];if(g===void 0||g.length!==m){g=[];for(let M=0;M<m;M++)g[M]=[M,0];n[h.id]=g}for(let M=0;M<m;M++){const S=g[M];S[0]=M,S[1]=f[M]}g.sort(t1);for(let M=0;M<8;M++)M<m&&g[M][1]?(r[M][0]=g[M][0],r[M][1]=g[M][1]):(r[M][0]=Number.MAX_SAFE_INTEGER,r[M][1]=0);r.sort(Qg);const x=h.morphAttributes.position,p=h.morphAttributes.normal;let d=0;for(let M=0;M<8;M++){const S=r[M],b=S[0],w=S[1];b!==Number.MAX_SAFE_INTEGER&&w?(x&&h.getAttribute("morphTarget"+M)!==x[b]&&h.setAttribute("morphTarget"+M,x[b]),p&&h.getAttribute("morphNormal"+M)!==p[b]&&h.setAttribute("morphNormal"+M,p[b]),i[M]=w,d+=w):(x&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),p&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),i[M]=0)}const v=h.morphTargetsRelative?1:1-d;u.getUniforms().setValue(s,"morphTargetBaseInfluence",v),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:c}}function n1(s,t,e,n){let i=new WeakMap;function o(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return u}function a(){i=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:a}}class Ic extends dn{constructor(t,e,n,i,o,a,r,c,l,h){if(h=h!==void 0?h:ts,h!==ts&&h!==Gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ts&&(n=fi),n===void 0&&h===Gs&&(n=Qi),super(null,i,o,a,r,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:ie,this.minFilter=c!==void 0?c:ie,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const lf=new dn,hf=new Ic(1,1);hf.compareFunction=Yu;const uf=new Qu,ff=new Bp,df=new rf,eh=[],nh=[],ih=new Float32Array(16),sh=new Float32Array(9),oh=new Float32Array(4);function Xs(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let o=eh[i];if(o===void 0&&(o=new Float32Array(i),eh[i]=o),t!==0){n.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,s[a].toArray(o,r)}return o}function Pe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function De(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function tr(s,t){let e=nh[t];e===void 0&&(e=new Int32Array(t),nh[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function i1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function s1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;s.uniform2fv(this.addr,t),De(e,t)}}function o1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;s.uniform3fv(this.addr,t),De(e,t)}}function a1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;s.uniform4fv(this.addr,t),De(e,t)}}function r1(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),De(e,t)}else{if(Pe(e,n))return;oh.set(n),s.uniformMatrix2fv(this.addr,!1,oh),De(e,n)}}function c1(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),De(e,t)}else{if(Pe(e,n))return;sh.set(n),s.uniformMatrix3fv(this.addr,!1,sh),De(e,n)}}function l1(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),De(e,t)}else{if(Pe(e,n))return;ih.set(n),s.uniformMatrix4fv(this.addr,!1,ih),De(e,n)}}function h1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function u1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;s.uniform2iv(this.addr,t),De(e,t)}}function f1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;s.uniform3iv(this.addr,t),De(e,t)}}function d1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;s.uniform4iv(this.addr,t),De(e,t)}}function p1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function m1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;s.uniform2uiv(this.addr,t),De(e,t)}}function g1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;s.uniform3uiv(this.addr,t),De(e,t)}}function v1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;s.uniform4uiv(this.addr,t),De(e,t)}}function x1(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const o=this.type===s.SAMPLER_2D_SHADOW?hf:lf;e.setTexture2D(t||o,i)}function M1(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||ff,i)}function _1(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||df,i)}function y1(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||uf,i)}function w1(s){switch(s){case 5126:return i1;case 35664:return s1;case 35665:return o1;case 35666:return a1;case 35674:return r1;case 35675:return c1;case 35676:return l1;case 5124:case 35670:return h1;case 35667:case 35671:return u1;case 35668:case 35672:return f1;case 35669:case 35673:return d1;case 5125:return p1;case 36294:return m1;case 36295:return g1;case 36296:return v1;case 35678:case 36198:case 36298:case 36306:case 35682:return x1;case 35679:case 36299:case 36307:return M1;case 35680:case 36300:case 36308:case 36293:return _1;case 36289:case 36303:case 36311:case 36292:return y1}}function b1(s,t){s.uniform1fv(this.addr,t)}function S1(s,t){const e=Xs(t,this.size,2);s.uniform2fv(this.addr,e)}function E1(s,t){const e=Xs(t,this.size,3);s.uniform3fv(this.addr,e)}function A1(s,t){const e=Xs(t,this.size,4);s.uniform4fv(this.addr,e)}function T1(s,t){const e=Xs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function C1(s,t){const e=Xs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function R1(s,t){const e=Xs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function L1(s,t){s.uniform1iv(this.addr,t)}function P1(s,t){s.uniform2iv(this.addr,t)}function D1(s,t){s.uniform3iv(this.addr,t)}function I1(s,t){s.uniform4iv(this.addr,t)}function U1(s,t){s.uniform1uiv(this.addr,t)}function k1(s,t){s.uniform2uiv(this.addr,t)}function z1(s,t){s.uniform3uiv(this.addr,t)}function F1(s,t){s.uniform4uiv(this.addr,t)}function N1(s,t,e){const n=this.cache,i=t.length,o=tr(e,i);Pe(n,o)||(s.uniform1iv(this.addr,o),De(n,o));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||lf,o[a])}function O1(s,t,e){const n=this.cache,i=t.length,o=tr(e,i);Pe(n,o)||(s.uniform1iv(this.addr,o),De(n,o));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||ff,o[a])}function B1(s,t,e){const n=this.cache,i=t.length,o=tr(e,i);Pe(n,o)||(s.uniform1iv(this.addr,o),De(n,o));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||df,o[a])}function W1(s,t,e){const n=this.cache,i=t.length,o=tr(e,i);Pe(n,o)||(s.uniform1iv(this.addr,o),De(n,o));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||uf,o[a])}function G1(s){switch(s){case 5126:return b1;case 35664:return S1;case 35665:return E1;case 35666:return A1;case 35674:return T1;case 35675:return C1;case 35676:return R1;case 5124:case 35670:return L1;case 35667:case 35671:return P1;case 35668:case 35672:return D1;case 35669:case 35673:return I1;case 5125:return U1;case 36294:return k1;case 36295:return z1;case 36296:return F1;case 35678:case 36198:case 36298:case 36306:case 35682:return N1;case 35679:case 36299:case 36307:return O1;case 35680:case 36300:case 36308:case 36293:return B1;case 36289:case 36303:case 36311:case 36292:return W1}}class H1{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=w1(e.type)}}class V1{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=G1(e.type)}}class $1{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let o=0,a=i.length;o!==a;++o){const r=i[o];r.setValue(t,e[r.id],n)}}}const kr=/(\w+)(\])?(\[|\.)?/g;function ah(s,t){s.seq.push(t),s.map[t.id]=t}function X1(s,t,e){const n=s.name,i=n.length;for(kr.lastIndex=0;;){const o=kr.exec(n),a=kr.lastIndex;let r=o[1];const c=o[2]==="]",l=o[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===i){ah(e,l===void 0?new H1(r,s,t):new V1(r,s,t));break}else{let u=e.map[r];u===void 0&&(u=new $1(r),ah(e,u)),e=u}}}class Sa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const o=t.getActiveUniform(e,i),a=t.getUniformLocation(e,o.name);X1(o,a,this)}}setValue(t,e,n,i){const o=this.map[e];o!==void 0&&o.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let o=0,a=e.length;o!==a;++o){const r=e[o],c=n[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,o=t.length;i!==o;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function rh(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const q1=37297;let j1=0;function Y1(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=i;a<o;a++){const r=a+1;n.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return n.join(`
`)}function K1(s){const t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(s);let n;switch(t===e?n="":t===ka&&e===Ua?n="LinearDisplayP3ToLinearSRGB":t===Ua&&e===ka&&(n="LinearSRGBToLinearDisplayP3"),s){case xi:case Za:return[n,"LinearTransferOETF"];case Oe:case Tc:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function ch(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const o=/ERROR: 0:(\d+)/.exec(i);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+i+`

`+Y1(s.getShaderSource(t),a)}else return i}function Z1(s,t){const e=K1(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function J1(s,t){let e;switch(t){case Zd:e="Linear";break;case Jd:e="Reinhard";break;case Qd:e="OptimizedCineon";break;case tp:e="ACESFilmic";break;case np:e="AgX";break;case ep:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Q1(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ps).join(`
`)}function tv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ps).join(`
`)}function ev(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function nv(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const o=s.getActiveAttrib(t,i),a=o.name;let r=1;o.type===s.FLOAT_MAT2&&(r=2),o.type===s.FLOAT_MAT3&&(r=3),o.type===s.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:s.getAttribLocation(t,a),locationSize:r}}return e}function Ps(s){return s!==""}function lh(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hh(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const iv=/^[ \t]*#include +<([\w\d./]+)>/gm;function fc(s){return s.replace(iv,ov)}const sv=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function ov(s,t){let e=Kt[t];if(e===void 0){const n=sv.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return fc(e)}const av=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uh(s){return s.replace(av,rv)}function rv(s,t,e,n){let i="";for(let o=parseInt(t);o<parseInt(e);o++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return i}function fh(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function cv(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Fu?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Ed?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===ai&&(t="SHADOWMAP_TYPE_VSM"),t}function lv(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Bs:case Ws:t="ENVMAP_TYPE_CUBE";break;case Ka:t="ENVMAP_TYPE_CUBE_UV";break}return t}function hv(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ws:t="ENVMAP_MODE_REFRACTION";break}return t}function uv(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Nu:t="ENVMAP_BLENDING_MULTIPLY";break;case Yd:t="ENVMAP_BLENDING_MIX";break;case Kd:t="ENVMAP_BLENDING_ADD";break}return t}function fv(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function dv(s,t,e,n){const i=s.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=cv(e),l=lv(e),h=hv(e),u=uv(e),f=fv(e),m=e.isWebGL2?"":Q1(e),g=tv(e),x=ev(o),p=i.createProgram();let d,v,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Ps).join(`
`),d.length>0&&(d+=`
`),v=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Ps).join(`
`),v.length>0&&(v+=`
`)):(d=[fh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ps).join(`
`),v=[m,fh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ci?"#define TONE_MAPPING":"",e.toneMapping!==Ci?Kt.tonemapping_pars_fragment:"",e.toneMapping!==Ci?J1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,Z1("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ps).join(`
`)),a=fc(a),a=lh(a,e),a=hh(a,e),r=fc(r),r=lh(r,e),r=hh(r,e),a=uh(a),r=uh(r),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Ll?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ll?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const S=M+d+a,b=M+v+r,w=rh(i,i.VERTEX_SHADER,S),E=rh(i,i.FRAGMENT_SHADER,b);i.attachShader(p,w),i.attachShader(p,E),e.index0AttributeName!==void 0?i.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function A(P){if(s.debug.checkShaderErrors){const I=i.getProgramInfoLog(p).trim(),R=i.getShaderInfoLog(w).trim(),U=i.getShaderInfoLog(E).trim();let F=!0,G=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(F=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,p,w,E);else{const W=ch(i,w,"vertex"),K=ch(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+I+`
`+W+`
`+K)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(R===""||U==="")&&(G=!1);G&&(P.diagnostics={runnable:F,programLog:I,vertexShader:{log:R,prefix:d},fragmentShader:{log:U,prefix:v}})}i.deleteShader(w),i.deleteShader(E),_=new Sa(i,p),y=nv(i,p)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(p,q1)),C},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=j1++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=E,this}let pv=0;class mv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),o=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new gv(t),e.set(t,n)),n}}class gv{constructor(t){this.id=pv++,this.code=t,this.usedTimes=0}}function vv(s,t,e,n,i,o,a){const r=new Lc,c=new mv,l=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,f=i.vertexTextures;let m=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return _===0?"uv":`uv${_}`}function p(_,y,C,P,I){const R=P.fog,U=I.geometry,F=_.isMeshStandardMaterial?P.environment:null,G=(_.isMeshStandardMaterial?e:t).get(_.envMap||F),W=G&&G.mapping===Ka?G.image.height:null,K=g[_.type];_.precision!==null&&(m=i.getMaxPrecision(_.precision),m!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",m,"instead."));const H=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,et=H!==void 0?H.length:0;let ct=0;U.morphAttributes.position!==void 0&&(ct=1),U.morphAttributes.normal!==void 0&&(ct=2),U.morphAttributes.color!==void 0&&(ct=3);let Q,nt,dt,Mt;if(K){const we=Hn[K];Q=we.vertexShader,nt=we.fragmentShader}else Q=_.vertexShader,nt=_.fragmentShader,c.update(_),dt=c.getVertexShaderID(_),Mt=c.getFragmentShaderID(_);const bt=s.getRenderTarget(),Rt=I.isInstancedMesh===!0,Lt=I.isBatchedMesh===!0,St=!!_.map,Ft=!!_.matcap,X=!!G,ue=!!_.aoMap,Tt=!!_.lightMap,kt=!!_.bumpMap,Y=!!_.normalMap,at=!!_.displacementMap,lt=!!_.emissiveMap,L=!!_.metalnessMap,T=!!_.roughnessMap,z=_.anisotropy>0,O=_.clearcoat>0,Z=_.iridescence>0,V=_.sheen>0,tt=_.transmission>0,it=z&&!!_.anisotropyMap,pt=O&&!!_.clearcoatMap,_t=O&&!!_.clearcoatNormalMap,qt=O&&!!_.clearcoatRoughnessMap,rt=Z&&!!_.iridescenceMap,oe=Z&&!!_.iridescenceThicknessMap,$=V&&!!_.sheenColorMap,Dt=V&&!!_.sheenRoughnessMap,Et=!!_.specularMap,mt=!!_.specularColorMap,Ot=!!_.specularIntensityMap,te=tt&&!!_.transmissionMap,he=tt&&!!_.thicknessMap,Nt=!!_.gradientMap,ot=!!_.alphaMap,k=_.alphaTest>0,ht=!!_.alphaHash,ut=!!_.extensions,It=!!U.attributes.uv1,zt=!!U.attributes.uv2,ne=!!U.attributes.uv3;let ae=Ci;return _.toneMapped&&(bt===null||bt.isXRRenderTarget===!0)&&(ae=s.toneMapping),{isWebGL2:h,shaderID:K,shaderType:_.type,shaderName:_.name,vertexShader:Q,fragmentShader:nt,defines:_.defines,customVertexShaderID:dt,customFragmentShaderID:Mt,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:m,batching:Lt,instancing:Rt,instancingColor:Rt&&I.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:bt===null?s.outputColorSpace:bt.isXRRenderTarget===!0?bt.texture.colorSpace:xi,map:St,matcap:Ft,envMap:X,envMapMode:X&&G.mapping,envMapCubeUVHeight:W,aoMap:ue,lightMap:Tt,bumpMap:kt,normalMap:Y,displacementMap:f&&at,emissiveMap:lt,normalMapObjectSpace:Y&&_.normalMapType===dp,normalMapTangentSpace:Y&&_.normalMapType===fp,metalnessMap:L,roughnessMap:T,anisotropy:z,anisotropyMap:it,clearcoat:O,clearcoatMap:pt,clearcoatNormalMap:_t,clearcoatRoughnessMap:qt,iridescence:Z,iridescenceMap:rt,iridescenceThicknessMap:oe,sheen:V,sheenColorMap:$,sheenRoughnessMap:Dt,specularMap:Et,specularColorMap:mt,specularIntensityMap:Ot,transmission:tt,transmissionMap:te,thicknessMap:he,gradientMap:Nt,opaque:_.transparent===!1&&_.blending===Fs,alphaMap:ot,alphaTest:k,alphaHash:ht,combine:_.combine,mapUv:St&&x(_.map.channel),aoMapUv:ue&&x(_.aoMap.channel),lightMapUv:Tt&&x(_.lightMap.channel),bumpMapUv:kt&&x(_.bumpMap.channel),normalMapUv:Y&&x(_.normalMap.channel),displacementMapUv:at&&x(_.displacementMap.channel),emissiveMapUv:lt&&x(_.emissiveMap.channel),metalnessMapUv:L&&x(_.metalnessMap.channel),roughnessMapUv:T&&x(_.roughnessMap.channel),anisotropyMapUv:it&&x(_.anisotropyMap.channel),clearcoatMapUv:pt&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:_t&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:qt&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:rt&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:$&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:Dt&&x(_.sheenRoughnessMap.channel),specularMapUv:Et&&x(_.specularMap.channel),specularColorMapUv:mt&&x(_.specularColorMap.channel),specularIntensityMapUv:Ot&&x(_.specularIntensityMap.channel),transmissionMapUv:te&&x(_.transmissionMap.channel),thicknessMapUv:he&&x(_.thicknessMap.channel),alphaMapUv:ot&&x(_.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(Y||z),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,vertexUv1s:It,vertexUv2s:zt,vertexUv3s:ne,pointsUvs:I.isPoints===!0&&!!U.attributes.uv&&(St||ot),fog:!!R,useFog:_.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:I.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:et,morphTextureStride:ct,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:ae,useLegacyLights:s._useLegacyLights,decodeVideoTexture:St&&_.map.isVideoTexture===!0&&le.getTransfer(_.map.colorSpace)===fe,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===On,flipSided:_.side===rn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:ut&&_.extensions.derivatives===!0,extensionFragDepth:ut&&_.extensions.fragDepth===!0,extensionDrawBuffers:ut&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:ut&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ut&&_.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()}}function d(_){const y=[];if(_.shaderID?y.push(_.shaderID):(y.push(_.customVertexShaderID),y.push(_.customFragmentShaderID)),_.defines!==void 0)for(const C in _.defines)y.push(C),y.push(_.defines[C]);return _.isRawShaderMaterial===!1&&(v(y,_),M(y,_),y.push(s.outputColorSpace)),y.push(_.customProgramCacheKey),y.join()}function v(_,y){_.push(y.precision),_.push(y.outputColorSpace),_.push(y.envMapMode),_.push(y.envMapCubeUVHeight),_.push(y.mapUv),_.push(y.alphaMapUv),_.push(y.lightMapUv),_.push(y.aoMapUv),_.push(y.bumpMapUv),_.push(y.normalMapUv),_.push(y.displacementMapUv),_.push(y.emissiveMapUv),_.push(y.metalnessMapUv),_.push(y.roughnessMapUv),_.push(y.anisotropyMapUv),_.push(y.clearcoatMapUv),_.push(y.clearcoatNormalMapUv),_.push(y.clearcoatRoughnessMapUv),_.push(y.iridescenceMapUv),_.push(y.iridescenceThicknessMapUv),_.push(y.sheenColorMapUv),_.push(y.sheenRoughnessMapUv),_.push(y.specularMapUv),_.push(y.specularColorMapUv),_.push(y.specularIntensityMapUv),_.push(y.transmissionMapUv),_.push(y.thicknessMapUv),_.push(y.combine),_.push(y.fogExp2),_.push(y.sizeAttenuation),_.push(y.morphTargetsCount),_.push(y.morphAttributeCount),_.push(y.numDirLights),_.push(y.numPointLights),_.push(y.numSpotLights),_.push(y.numSpotLightMaps),_.push(y.numHemiLights),_.push(y.numRectAreaLights),_.push(y.numDirLightShadows),_.push(y.numPointLightShadows),_.push(y.numSpotLightShadows),_.push(y.numSpotLightShadowsWithMaps),_.push(y.numLightProbes),_.push(y.shadowMapType),_.push(y.toneMapping),_.push(y.numClippingPlanes),_.push(y.numClipIntersection),_.push(y.depthPacking)}function M(_,y){r.disableAll(),y.isWebGL2&&r.enable(0),y.supportsVertexTextures&&r.enable(1),y.instancing&&r.enable(2),y.instancingColor&&r.enable(3),y.matcap&&r.enable(4),y.envMap&&r.enable(5),y.normalMapObjectSpace&&r.enable(6),y.normalMapTangentSpace&&r.enable(7),y.clearcoat&&r.enable(8),y.iridescence&&r.enable(9),y.alphaTest&&r.enable(10),y.vertexColors&&r.enable(11),y.vertexAlphas&&r.enable(12),y.vertexUv1s&&r.enable(13),y.vertexUv2s&&r.enable(14),y.vertexUv3s&&r.enable(15),y.vertexTangents&&r.enable(16),y.anisotropy&&r.enable(17),y.alphaHash&&r.enable(18),y.batching&&r.enable(19),_.push(r.mask),r.disableAll(),y.fog&&r.enable(0),y.useFog&&r.enable(1),y.flatShading&&r.enable(2),y.logarithmicDepthBuffer&&r.enable(3),y.skinning&&r.enable(4),y.morphTargets&&r.enable(5),y.morphNormals&&r.enable(6),y.morphColors&&r.enable(7),y.premultipliedAlpha&&r.enable(8),y.shadowMapEnabled&&r.enable(9),y.useLegacyLights&&r.enable(10),y.doubleSided&&r.enable(11),y.flipSided&&r.enable(12),y.useDepthPacking&&r.enable(13),y.dithering&&r.enable(14),y.transmission&&r.enable(15),y.sheen&&r.enable(16),y.opaque&&r.enable(17),y.pointsUvs&&r.enable(18),y.decodeVideoTexture&&r.enable(19),_.push(r.mask)}function S(_){const y=g[_.type];let C;if(y){const P=Hn[y];C=Qp.clone(P.uniforms)}else C=_.uniforms;return C}function b(_,y){let C;for(let P=0,I=l.length;P<I;P++){const R=l[P];if(R.cacheKey===y){C=R,++C.usedTimes;break}}return C===void 0&&(C=new dv(s,y,_,o),l.push(C)),C}function w(_){if(--_.usedTimes===0){const y=l.indexOf(_);l[y]=l[l.length-1],l.pop(),_.destroy()}}function E(_){c.remove(_)}function A(){c.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:S,acquireProgram:b,releaseProgram:w,releaseShaderCache:E,programs:l,dispose:A}}function xv(){let s=new WeakMap;function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function e(o){s.delete(o)}function n(o,a,r){s.get(o)[a]=r}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Mv(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function dh(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function ph(){const s=[];let t=0;const e=[],n=[],i=[];function o(){t=0,e.length=0,n.length=0,i.length=0}function a(u,f,m,g,x,p){let d=s[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:m,groupOrder:g,renderOrder:u.renderOrder,z:x,group:p},s[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=m,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=x,d.group=p),t++,d}function r(u,f,m,g,x,p){const d=a(u,f,m,g,x,p);m.transmission>0?n.push(d):m.transparent===!0?i.push(d):e.push(d)}function c(u,f,m,g,x,p){const d=a(u,f,m,g,x,p);m.transmission>0?n.unshift(d):m.transparent===!0?i.unshift(d):e.unshift(d)}function l(u,f){e.length>1&&e.sort(u||Mv),n.length>1&&n.sort(f||dh),i.length>1&&i.sort(f||dh)}function h(){for(let u=t,f=s.length;u<f;u++){const m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:o,push:r,unshift:c,finish:h,sort:l}}function _v(){let s=new WeakMap;function t(n,i){const o=s.get(n);let a;return o===void 0?(a=new ph,s.set(n,[a])):i>=o.length?(a=new ph,o.push(a)):a=o[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function yv(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new B,color:new Gt};break;case"SpotLight":e={position:new B,direction:new B,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new B,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new B,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":e={color:new Gt,position:new B,halfWidth:new B,halfHeight:new B};break}return s[t.id]=e,e}}}function wv(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let bv=0;function Sv(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Ev(s,t){const e=new yv,n=wv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new B);const o=new B,a=new se,r=new se;function c(h,u){let f=0,m=0,g=0;for(let P=0;P<9;P++)i.probe[P].set(0,0,0);let x=0,p=0,d=0,v=0,M=0,S=0,b=0,w=0,E=0,A=0,_=0;h.sort(Sv);const y=u===!0?Math.PI:1;for(let P=0,I=h.length;P<I;P++){const R=h[P],U=R.color,F=R.intensity,G=R.distance,W=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)f+=U.r*F*y,m+=U.g*F*y,g+=U.b*F*y;else if(R.isLightProbe){for(let K=0;K<9;K++)i.probe[K].addScaledVector(R.sh.coefficients[K],F);_++}else if(R.isDirectionalLight){const K=e.get(R);if(K.color.copy(R.color).multiplyScalar(R.intensity*y),R.castShadow){const H=R.shadow,et=n.get(R);et.shadowBias=H.bias,et.shadowNormalBias=H.normalBias,et.shadowRadius=H.radius,et.shadowMapSize=H.mapSize,i.directionalShadow[x]=et,i.directionalShadowMap[x]=W,i.directionalShadowMatrix[x]=R.shadow.matrix,S++}i.directional[x]=K,x++}else if(R.isSpotLight){const K=e.get(R);K.position.setFromMatrixPosition(R.matrixWorld),K.color.copy(U).multiplyScalar(F*y),K.distance=G,K.coneCos=Math.cos(R.angle),K.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),K.decay=R.decay,i.spot[d]=K;const H=R.shadow;if(R.map&&(i.spotLightMap[E]=R.map,E++,H.updateMatrices(R),R.castShadow&&A++),i.spotLightMatrix[d]=H.matrix,R.castShadow){const et=n.get(R);et.shadowBias=H.bias,et.shadowNormalBias=H.normalBias,et.shadowRadius=H.radius,et.shadowMapSize=H.mapSize,i.spotShadow[d]=et,i.spotShadowMap[d]=W,w++}d++}else if(R.isRectAreaLight){const K=e.get(R);K.color.copy(U).multiplyScalar(F),K.halfWidth.set(R.width*.5,0,0),K.halfHeight.set(0,R.height*.5,0),i.rectArea[v]=K,v++}else if(R.isPointLight){const K=e.get(R);if(K.color.copy(R.color).multiplyScalar(R.intensity*y),K.distance=R.distance,K.decay=R.decay,R.castShadow){const H=R.shadow,et=n.get(R);et.shadowBias=H.bias,et.shadowNormalBias=H.normalBias,et.shadowRadius=H.radius,et.shadowMapSize=H.mapSize,et.shadowCameraNear=H.camera.near,et.shadowCameraFar=H.camera.far,i.pointShadow[p]=et,i.pointShadowMap[p]=W,i.pointShadowMatrix[p]=R.shadow.matrix,b++}i.point[p]=K,p++}else if(R.isHemisphereLight){const K=e.get(R);K.skyColor.copy(R.color).multiplyScalar(F*y),K.groundColor.copy(R.groundColor).multiplyScalar(F*y),i.hemi[M]=K,M++}}v>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=vt.LTC_FLOAT_1,i.rectAreaLTC2=vt.LTC_FLOAT_2):(i.rectAreaLTC1=vt.LTC_HALF_1,i.rectAreaLTC2=vt.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=vt.LTC_FLOAT_1,i.rectAreaLTC2=vt.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=vt.LTC_HALF_1,i.rectAreaLTC2=vt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=m,i.ambient[2]=g;const C=i.hash;(C.directionalLength!==x||C.pointLength!==p||C.spotLength!==d||C.rectAreaLength!==v||C.hemiLength!==M||C.numDirectionalShadows!==S||C.numPointShadows!==b||C.numSpotShadows!==w||C.numSpotMaps!==E||C.numLightProbes!==_)&&(i.directional.length=x,i.spot.length=d,i.rectArea.length=v,i.point.length=p,i.hemi.length=M,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=w+E-A,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=_,C.directionalLength=x,C.pointLength=p,C.spotLength=d,C.rectAreaLength=v,C.hemiLength=M,C.numDirectionalShadows=S,C.numPointShadows=b,C.numSpotShadows=w,C.numSpotMaps=E,C.numLightProbes=_,i.version=bv++)}function l(h,u){let f=0,m=0,g=0,x=0,p=0;const d=u.matrixWorldInverse;for(let v=0,M=h.length;v<M;v++){const S=h[v];if(S.isDirectionalLight){const b=i.directional[f];b.direction.setFromMatrixPosition(S.matrixWorld),o.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(o),b.direction.transformDirection(d),f++}else if(S.isSpotLight){const b=i.spot[g];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(d),b.direction.setFromMatrixPosition(S.matrixWorld),o.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(o),b.direction.transformDirection(d),g++}else if(S.isRectAreaLight){const b=i.rectArea[x];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(d),r.identity(),a.copy(S.matrixWorld),a.premultiply(d),r.extractRotation(a),b.halfWidth.set(S.width*.5,0,0),b.halfHeight.set(0,S.height*.5,0),b.halfWidth.applyMatrix4(r),b.halfHeight.applyMatrix4(r),x++}else if(S.isPointLight){const b=i.point[m];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(d),m++}else if(S.isHemisphereLight){const b=i.hemi[p];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(d),p++}}}return{setup:c,setupView:l,state:i}}function mh(s,t){const e=new Ev(s,t),n=[],i=[];function o(){n.length=0,i.length=0}function a(u){n.push(u)}function r(u){i.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:o,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:r}}function Av(s,t){let e=new WeakMap;function n(o,a=0){const r=e.get(o);let c;return r===void 0?(c=new mh(s,t),e.set(o,[c])):a>=r.length?(c=new mh(s,t),r.push(c)):c=r[a],c}function i(){e=new WeakMap}return{get:n,dispose:i}}class Tv extends Ro{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Cv extends Ro{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Rv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Lv=`uniform sampler2D shadow_pass;
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
}`;function Pv(s,t,e){let n=new Ii;const i=new Ht,o=new Ht,a=new ee,r=new Tv({depthPacking:up}),c=new Cv,l={},h=e.maxTextureSize,u={[vi]:rn,[rn]:vi,[On]:On},f=new Te({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ht},radius:{value:4}},vertexShader:Rv,fragmentShader:Lv}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new cn;g.setAttribute("position",new Le(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new _e(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fu;let d=this.type;this.render=function(w,E,A){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const _=s.getRenderTarget(),y=s.getActiveCubeFace(),C=s.getActiveMipmapLevel(),P=s.state;P.setBlending(gi),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const I=d!==ai&&this.type===ai,R=d===ai&&this.type!==ai;for(let U=0,F=w.length;U<F;U++){const G=w[U],W=G.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",G,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);const K=W.getFrameExtents();if(i.multiply(K),o.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(o.x=Math.floor(h/K.x),i.x=o.x*K.x,W.mapSize.x=o.x),i.y>h&&(o.y=Math.floor(h/K.y),i.y=o.y*K.y,W.mapSize.y=o.y)),W.map===null||I===!0||R===!0){const et=this.type!==ai?{minFilter:ie,magFilter:ie}:{};W.map!==null&&W.map.dispose(),W.map=new Zn(i.x,i.y,et),W.map.texture.name=G.name+".shadowMap",W.camera.updateProjectionMatrix()}s.setRenderTarget(W.map),s.clear();const H=W.getViewportCount();for(let et=0;et<H;et++){const ct=W.getViewport(et);a.set(o.x*ct.x,o.y*ct.y,o.x*ct.z,o.y*ct.w),P.viewport(a),W.updateMatrices(G,et),n=W.getFrustum(),S(E,A,W.camera,G,this.type)}W.isPointLightShadow!==!0&&this.type===ai&&v(W,A),W.needsUpdate=!1}d=this.type,p.needsUpdate=!1,s.setRenderTarget(_,y,C)};function v(w,E){const A=t.update(x);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Zn(i.x,i.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(E,null,A,f,x,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(E,null,A,m,x,null)}function M(w,E,A,_){let y=null;const C=A.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)y=C;else if(y=A.isPointLight===!0?c:r,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const P=y.uuid,I=E.uuid;let R=l[P];R===void 0&&(R={},l[P]=R);let U=R[I];U===void 0&&(U=y.clone(),R[I]=U,E.addEventListener("dispose",b)),y=U}if(y.visible=E.visible,y.wireframe=E.wireframe,_===ai?y.side=E.shadowSide!==null?E.shadowSide:E.side:y.side=E.shadowSide!==null?E.shadowSide:u[E.side],y.alphaMap=E.alphaMap,y.alphaTest=E.alphaTest,y.map=E.map,y.clipShadows=E.clipShadows,y.clippingPlanes=E.clippingPlanes,y.clipIntersection=E.clipIntersection,y.displacementMap=E.displacementMap,y.displacementScale=E.displacementScale,y.displacementBias=E.displacementBias,y.wireframeLinewidth=E.wireframeLinewidth,y.linewidth=E.linewidth,A.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const P=s.properties.get(y);P.light=A}return y}function S(w,E,A,_,y){if(w.visible===!1)return;if(w.layers.test(E.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===ai)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,w.matrixWorld);const I=t.update(w),R=w.material;if(Array.isArray(R)){const U=I.groups;for(let F=0,G=U.length;F<G;F++){const W=U[F],K=R[W.materialIndex];if(K&&K.visible){const H=M(w,K,_,y);w.onBeforeShadow(s,w,E,A,I,H,W),s.renderBufferDirect(A,null,I,H,w,W),w.onAfterShadow(s,w,E,A,I,H,W)}}}else if(R.visible){const U=M(w,R,_,y);w.onBeforeShadow(s,w,E,A,I,U,null),s.renderBufferDirect(A,null,I,U,w,null),w.onAfterShadow(s,w,E,A,I,U,null)}}const P=w.children;for(let I=0,R=P.length;I<R;I++)S(P[I],E,A,_,y)}function b(w){w.target.removeEventListener("dispose",b);for(const A in l){const _=l[A],y=w.target.uuid;y in _&&(_[y].dispose(),delete _[y])}}}function Dv(s,t,e){const n=e.isWebGL2;function i(){let k=!1;const ht=new ee;let ut=null;const It=new ee(0,0,0,0);return{setMask:function(zt){ut!==zt&&!k&&(s.colorMask(zt,zt,zt,zt),ut=zt)},setLocked:function(zt){k=zt},setClear:function(zt,ne,ae,pe,we){we===!0&&(zt*=pe,ne*=pe,ae*=pe),ht.set(zt,ne,ae,pe),It.equals(ht)===!1&&(s.clearColor(zt,ne,ae,pe),It.copy(ht))},reset:function(){k=!1,ut=null,It.set(-1,0,0,0)}}}function o(){let k=!1,ht=null,ut=null,It=null;return{setTest:function(zt){zt?Lt(s.DEPTH_TEST):St(s.DEPTH_TEST)},setMask:function(zt){ht!==zt&&!k&&(s.depthMask(zt),ht=zt)},setFunc:function(zt){if(ut!==zt){switch(zt){case Gd:s.depthFunc(s.NEVER);break;case Hd:s.depthFunc(s.ALWAYS);break;case Vd:s.depthFunc(s.LESS);break;case Pa:s.depthFunc(s.LEQUAL);break;case $d:s.depthFunc(s.EQUAL);break;case Xd:s.depthFunc(s.GEQUAL);break;case qd:s.depthFunc(s.GREATER);break;case jd:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ut=zt}},setLocked:function(zt){k=zt},setClear:function(zt){It!==zt&&(s.clearDepth(zt),It=zt)},reset:function(){k=!1,ht=null,ut=null,It=null}}}function a(){let k=!1,ht=null,ut=null,It=null,zt=null,ne=null,ae=null,pe=null,we=null;return{setTest:function(re){k||(re?Lt(s.STENCIL_TEST):St(s.STENCIL_TEST))},setMask:function(re){ht!==re&&!k&&(s.stencilMask(re),ht=re)},setFunc:function(re,Ue,Sn){(ut!==re||It!==Ue||zt!==Sn)&&(s.stencilFunc(re,Ue,Sn),ut=re,It=Ue,zt=Sn)},setOp:function(re,Ue,Sn){(ne!==re||ae!==Ue||pe!==Sn)&&(s.stencilOp(re,Ue,Sn),ne=re,ae=Ue,pe=Sn)},setLocked:function(re){k=re},setClear:function(re){we!==re&&(s.clearStencil(re),we=re)},reset:function(){k=!1,ht=null,ut=null,It=null,zt=null,ne=null,ae=null,pe=null,we=null}}}const r=new i,c=new o,l=new a,h=new WeakMap,u=new WeakMap;let f={},m={},g=new WeakMap,x=[],p=null,d=!1,v=null,M=null,S=null,b=null,w=null,E=null,A=null,_=new Gt(0,0,0),y=0,C=!1,P=null,I=null,R=null,U=null,F=null;const G=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,K=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(H)[1]),W=K>=1):H.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),W=K>=2);let et=null,ct={};const Q=s.getParameter(s.SCISSOR_BOX),nt=s.getParameter(s.VIEWPORT),dt=new ee().fromArray(Q),Mt=new ee().fromArray(nt);function bt(k,ht,ut,It){const zt=new Uint8Array(4),ne=s.createTexture();s.bindTexture(k,ne),s.texParameteri(k,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(k,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ae=0;ae<ut;ae++)n&&(k===s.TEXTURE_3D||k===s.TEXTURE_2D_ARRAY)?s.texImage3D(ht,0,s.RGBA,1,1,It,0,s.RGBA,s.UNSIGNED_BYTE,zt):s.texImage2D(ht+ae,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,zt);return ne}const Rt={};Rt[s.TEXTURE_2D]=bt(s.TEXTURE_2D,s.TEXTURE_2D,1),Rt[s.TEXTURE_CUBE_MAP]=bt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Rt[s.TEXTURE_2D_ARRAY]=bt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Rt[s.TEXTURE_3D]=bt(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Lt(s.DEPTH_TEST),c.setFunc(Pa),lt(!1),L(Jc),Lt(s.CULL_FACE),Y(gi);function Lt(k){f[k]!==!0&&(s.enable(k),f[k]=!0)}function St(k){f[k]!==!1&&(s.disable(k),f[k]=!1)}function Ft(k,ht){return m[k]!==ht?(s.bindFramebuffer(k,ht),m[k]=ht,n&&(k===s.DRAW_FRAMEBUFFER&&(m[s.FRAMEBUFFER]=ht),k===s.FRAMEBUFFER&&(m[s.DRAW_FRAMEBUFFER]=ht)),!0):!1}function X(k,ht){let ut=x,It=!1;if(k)if(ut=g.get(ht),ut===void 0&&(ut=[],g.set(ht,ut)),k.isWebGLMultipleRenderTargets){const zt=k.texture;if(ut.length!==zt.length||ut[0]!==s.COLOR_ATTACHMENT0){for(let ne=0,ae=zt.length;ne<ae;ne++)ut[ne]=s.COLOR_ATTACHMENT0+ne;ut.length=zt.length,It=!0}}else ut[0]!==s.COLOR_ATTACHMENT0&&(ut[0]=s.COLOR_ATTACHMENT0,It=!0);else ut[0]!==s.BACK&&(ut[0]=s.BACK,It=!0);It&&(e.isWebGL2?s.drawBuffers(ut):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ut))}function ue(k){return p!==k?(s.useProgram(k),p=k,!0):!1}const Tt={[qi]:s.FUNC_ADD,[Td]:s.FUNC_SUBTRACT,[Cd]:s.FUNC_REVERSE_SUBTRACT};if(n)Tt[tl]=s.MIN,Tt[el]=s.MAX;else{const k=t.get("EXT_blend_minmax");k!==null&&(Tt[tl]=k.MIN_EXT,Tt[el]=k.MAX_EXT)}const kt={[Rd]:s.ZERO,[Ld]:s.ONE,[Pd]:s.SRC_COLOR,[oc]:s.SRC_ALPHA,[Fd]:s.SRC_ALPHA_SATURATE,[kd]:s.DST_COLOR,[Id]:s.DST_ALPHA,[Dd]:s.ONE_MINUS_SRC_COLOR,[ac]:s.ONE_MINUS_SRC_ALPHA,[zd]:s.ONE_MINUS_DST_COLOR,[Ud]:s.ONE_MINUS_DST_ALPHA,[Nd]:s.CONSTANT_COLOR,[Od]:s.ONE_MINUS_CONSTANT_COLOR,[Bd]:s.CONSTANT_ALPHA,[Wd]:s.ONE_MINUS_CONSTANT_ALPHA};function Y(k,ht,ut,It,zt,ne,ae,pe,we,re){if(k===gi){d===!0&&(St(s.BLEND),d=!1);return}if(d===!1&&(Lt(s.BLEND),d=!0),k!==Ad){if(k!==v||re!==C){if((M!==qi||w!==qi)&&(s.blendEquation(s.FUNC_ADD),M=qi,w=qi),re)switch(k){case Fs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ic:s.blendFunc(s.ONE,s.ONE);break;case Qc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case sc:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case Fs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ic:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Qc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case sc:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}S=null,b=null,E=null,A=null,_.set(0,0,0),y=0,v=k,C=re}return}zt=zt||ht,ne=ne||ut,ae=ae||It,(ht!==M||zt!==w)&&(s.blendEquationSeparate(Tt[ht],Tt[zt]),M=ht,w=zt),(ut!==S||It!==b||ne!==E||ae!==A)&&(s.blendFuncSeparate(kt[ut],kt[It],kt[ne],kt[ae]),S=ut,b=It,E=ne,A=ae),(pe.equals(_)===!1||we!==y)&&(s.blendColor(pe.r,pe.g,pe.b,we),_.copy(pe),y=we),v=k,C=!1}function at(k,ht){k.side===On?St(s.CULL_FACE):Lt(s.CULL_FACE);let ut=k.side===rn;ht&&(ut=!ut),lt(ut),k.blending===Fs&&k.transparent===!1?Y(gi):Y(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),c.setFunc(k.depthFunc),c.setTest(k.depthTest),c.setMask(k.depthWrite),r.setMask(k.colorWrite);const It=k.stencilWrite;l.setTest(It),It&&(l.setMask(k.stencilWriteMask),l.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),l.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),z(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?Lt(s.SAMPLE_ALPHA_TO_COVERAGE):St(s.SAMPLE_ALPHA_TO_COVERAGE)}function lt(k){P!==k&&(k?s.frontFace(s.CW):s.frontFace(s.CCW),P=k)}function L(k){k!==bd?(Lt(s.CULL_FACE),k!==I&&(k===Jc?s.cullFace(s.BACK):k===Sd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):St(s.CULL_FACE),I=k}function T(k){k!==R&&(W&&s.lineWidth(k),R=k)}function z(k,ht,ut){k?(Lt(s.POLYGON_OFFSET_FILL),(U!==ht||F!==ut)&&(s.polygonOffset(ht,ut),U=ht,F=ut)):St(s.POLYGON_OFFSET_FILL)}function O(k){k?Lt(s.SCISSOR_TEST):St(s.SCISSOR_TEST)}function Z(k){k===void 0&&(k=s.TEXTURE0+G-1),et!==k&&(s.activeTexture(k),et=k)}function V(k,ht,ut){ut===void 0&&(et===null?ut=s.TEXTURE0+G-1:ut=et);let It=ct[ut];It===void 0&&(It={type:void 0,texture:void 0},ct[ut]=It),(It.type!==k||It.texture!==ht)&&(et!==ut&&(s.activeTexture(ut),et=ut),s.bindTexture(k,ht||Rt[k]),It.type=k,It.texture=ht)}function tt(){const k=ct[et];k!==void 0&&k.type!==void 0&&(s.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function it(){try{s.compressedTexImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function pt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function _t(){try{s.texSubImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function qt(){try{s.texSubImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function rt(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function oe(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function $(){try{s.texStorage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Dt(){try{s.texStorage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Et(){try{s.texImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function mt(){try{s.texImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ot(k){dt.equals(k)===!1&&(s.scissor(k.x,k.y,k.z,k.w),dt.copy(k))}function te(k){Mt.equals(k)===!1&&(s.viewport(k.x,k.y,k.z,k.w),Mt.copy(k))}function he(k,ht){let ut=u.get(ht);ut===void 0&&(ut=new WeakMap,u.set(ht,ut));let It=ut.get(k);It===void 0&&(It=s.getUniformBlockIndex(ht,k.name),ut.set(k,It))}function Nt(k,ht){const It=u.get(ht).get(k);h.get(ht)!==It&&(s.uniformBlockBinding(ht,It,k.__bindingPointIndex),h.set(ht,It))}function ot(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),f={},et=null,ct={},m={},g=new WeakMap,x=[],p=null,d=!1,v=null,M=null,S=null,b=null,w=null,E=null,A=null,_=new Gt(0,0,0),y=0,C=!1,P=null,I=null,R=null,U=null,F=null,dt.set(0,0,s.canvas.width,s.canvas.height),Mt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),c.reset(),l.reset()}return{buffers:{color:r,depth:c,stencil:l},enable:Lt,disable:St,bindFramebuffer:Ft,drawBuffers:X,useProgram:ue,setBlending:Y,setMaterial:at,setFlipSided:lt,setCullFace:L,setLineWidth:T,setPolygonOffset:z,setScissorTest:O,activeTexture:Z,bindTexture:V,unbindTexture:tt,compressedTexImage2D:it,compressedTexImage3D:pt,texImage2D:Et,texImage3D:mt,updateUBOMapping:he,uniformBlockBinding:Nt,texStorage2D:$,texStorage3D:Dt,texSubImage2D:_t,texSubImage3D:qt,compressedTexSubImage2D:rt,compressedTexSubImage3D:oe,scissor:Ot,viewport:te,reset:ot}}function Iv(s,t,e,n,i,o,a){const r=i.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,T){return m?new OffscreenCanvas(L,T):Na("canvas")}function x(L,T,z,O){let Z=1;if((L.width>O||L.height>O)&&(Z=O/Math.max(L.width,L.height)),Z<1||T===!0)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap){const V=T?Fa:Math.floor,tt=V(Z*L.width),it=V(Z*L.height);u===void 0&&(u=g(tt,it));const pt=z?g(tt,it):u;return pt.width=tt,pt.height=it,pt.getContext("2d").drawImage(L,0,0,tt,it),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+L.width+"x"+L.height+") to ("+tt+"x"+it+")."),pt}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+L.width+"x"+L.height+")."),L;return L}function p(L){return uc(L.width)&&uc(L.height)}function d(L){return r?!1:L.wrapS!==on||L.wrapT!==on||L.minFilter!==ie&&L.minFilter!==Be}function v(L,T){return L.generateMipmaps&&T&&L.minFilter!==ie&&L.minFilter!==Be}function M(L){s.generateMipmap(L)}function S(L,T,z,O,Z=!1){if(r===!1)return T;if(L!==null){if(s[L]!==void 0)return s[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let V=T;if(T===s.RED&&(z===s.FLOAT&&(V=s.R32F),z===s.HALF_FLOAT&&(V=s.R16F),z===s.UNSIGNED_BYTE&&(V=s.R8)),T===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(V=s.R8UI),z===s.UNSIGNED_SHORT&&(V=s.R16UI),z===s.UNSIGNED_INT&&(V=s.R32UI),z===s.BYTE&&(V=s.R8I),z===s.SHORT&&(V=s.R16I),z===s.INT&&(V=s.R32I)),T===s.RG&&(z===s.FLOAT&&(V=s.RG32F),z===s.HALF_FLOAT&&(V=s.RG16F),z===s.UNSIGNED_BYTE&&(V=s.RG8)),T===s.RGBA){const tt=Z?Ia:le.getTransfer(O);z===s.FLOAT&&(V=s.RGBA32F),z===s.HALF_FLOAT&&(V=s.RGBA16F),z===s.UNSIGNED_BYTE&&(V=tt===fe?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT_4_4_4_4&&(V=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(V=s.RGB5_A1)}return(V===s.R16F||V===s.R32F||V===s.RG16F||V===s.RG32F||V===s.RGBA16F||V===s.RGBA32F)&&t.get("EXT_color_buffer_float"),V}function b(L,T,z){return v(L,z)===!0||L.isFramebufferTexture&&L.minFilter!==ie&&L.minFilter!==Be?Math.log2(Math.max(T.width,T.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?T.mipmaps.length:1}function w(L){return L===ie||L===nl||L===cr?s.NEAREST:s.LINEAR}function E(L){const T=L.target;T.removeEventListener("dispose",E),_(T),T.isVideoTexture&&h.delete(T)}function A(L){const T=L.target;T.removeEventListener("dispose",A),C(T)}function _(L){const T=n.get(L);if(T.__webglInit===void 0)return;const z=L.source,O=f.get(z);if(O){const Z=O[T.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&y(L),Object.keys(O).length===0&&f.delete(z)}n.remove(L)}function y(L){const T=n.get(L);s.deleteTexture(T.__webglTexture);const z=L.source,O=f.get(z);delete O[T.__cacheKey],a.memory.textures--}function C(L){const T=L.texture,z=n.get(L),O=n.get(T);if(O.__webglTexture!==void 0&&(s.deleteTexture(O.__webglTexture),a.memory.textures--),L.depthTexture&&L.depthTexture.dispose(),L.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(z.__webglFramebuffer[Z]))for(let V=0;V<z.__webglFramebuffer[Z].length;V++)s.deleteFramebuffer(z.__webglFramebuffer[Z][V]);else s.deleteFramebuffer(z.__webglFramebuffer[Z]);z.__webglDepthbuffer&&s.deleteRenderbuffer(z.__webglDepthbuffer[Z])}else{if(Array.isArray(z.__webglFramebuffer))for(let Z=0;Z<z.__webglFramebuffer.length;Z++)s.deleteFramebuffer(z.__webglFramebuffer[Z]);else s.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&s.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&s.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let Z=0;Z<z.__webglColorRenderbuffer.length;Z++)z.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(z.__webglColorRenderbuffer[Z]);z.__webglDepthRenderbuffer&&s.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(L.isWebGLMultipleRenderTargets)for(let Z=0,V=T.length;Z<V;Z++){const tt=n.get(T[Z]);tt.__webglTexture&&(s.deleteTexture(tt.__webglTexture),a.memory.textures--),n.remove(T[Z])}n.remove(T),n.remove(L)}let P=0;function I(){P=0}function R(){const L=P;return L>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+i.maxTextures),P+=1,L}function U(L){const T=[];return T.push(L.wrapS),T.push(L.wrapT),T.push(L.wrapR||0),T.push(L.magFilter),T.push(L.minFilter),T.push(L.anisotropy),T.push(L.internalFormat),T.push(L.format),T.push(L.type),T.push(L.generateMipmaps),T.push(L.premultiplyAlpha),T.push(L.flipY),T.push(L.unpackAlignment),T.push(L.colorSpace),T.join()}function F(L,T){const z=n.get(L);if(L.isVideoTexture&&at(L),L.isRenderTargetTexture===!1&&L.version>0&&z.__version!==L.version){const O=L.image;if(O===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(O.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{dt(z,L,T);return}}e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+T)}function G(L,T){const z=n.get(L);if(L.version>0&&z.__version!==L.version){dt(z,L,T);return}e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+T)}function W(L,T){const z=n.get(L);if(L.version>0&&z.__version!==L.version){dt(z,L,T);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+T)}function K(L,T){const z=n.get(L);if(L.version>0&&z.__version!==L.version){Mt(z,L,T);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+T)}const H={[Da]:s.REPEAT,[on]:s.CLAMP_TO_EDGE,[lc]:s.MIRRORED_REPEAT},et={[ie]:s.NEAREST,[nl]:s.NEAREST_MIPMAP_NEAREST,[cr]:s.NEAREST_MIPMAP_LINEAR,[Be]:s.LINEAR,[ip]:s.LINEAR_MIPMAP_NEAREST,[ns]:s.LINEAR_MIPMAP_LINEAR},ct={[pp]:s.NEVER,[_p]:s.ALWAYS,[mp]:s.LESS,[Yu]:s.LEQUAL,[gp]:s.EQUAL,[Mp]:s.GEQUAL,[vp]:s.GREATER,[xp]:s.NOTEQUAL};function Q(L,T,z){if(z?(s.texParameteri(L,s.TEXTURE_WRAP_S,H[T.wrapS]),s.texParameteri(L,s.TEXTURE_WRAP_T,H[T.wrapT]),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,H[T.wrapR]),s.texParameteri(L,s.TEXTURE_MAG_FILTER,et[T.magFilter]),s.texParameteri(L,s.TEXTURE_MIN_FILTER,et[T.minFilter])):(s.texParameteri(L,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(L,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(T.wrapS!==on||T.wrapT!==on)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(L,s.TEXTURE_MAG_FILTER,w(T.magFilter)),s.texParameteri(L,s.TEXTURE_MIN_FILTER,w(T.minFilter)),T.minFilter!==ie&&T.minFilter!==Be&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),T.compareFunction&&(s.texParameteri(L,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(L,s.TEXTURE_COMPARE_FUNC,ct[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const O=t.get("EXT_texture_filter_anisotropic");if(T.magFilter===ie||T.minFilter!==cr&&T.minFilter!==ns||T.type===di&&t.has("OES_texture_float_linear")===!1||r===!1&&T.type===Ri&&t.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||n.get(T).__currentAnisotropy)&&(s.texParameterf(L,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy)}}function nt(L,T){let z=!1;L.__webglInit===void 0&&(L.__webglInit=!0,T.addEventListener("dispose",E));const O=T.source;let Z=f.get(O);Z===void 0&&(Z={},f.set(O,Z));const V=U(T);if(V!==L.__cacheKey){Z[V]===void 0&&(Z[V]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,z=!0),Z[V].usedTimes++;const tt=Z[L.__cacheKey];tt!==void 0&&(Z[L.__cacheKey].usedTimes--,tt.usedTimes===0&&y(T)),L.__cacheKey=V,L.__webglTexture=Z[V].texture}return z}function dt(L,T,z){let O=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(O=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(O=s.TEXTURE_3D);const Z=nt(L,T),V=T.source;e.bindTexture(O,L.__webglTexture,s.TEXTURE0+z);const tt=n.get(V);if(V.version!==tt.__version||Z===!0){e.activeTexture(s.TEXTURE0+z);const it=le.getPrimaries(le.workingColorSpace),pt=T.colorSpace===Rn?null:le.getPrimaries(T.colorSpace),_t=T.colorSpace===Rn||it===pt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const qt=d(T)&&p(T.image)===!1;let rt=x(T.image,qt,!1,i.maxTextureSize);rt=lt(T,rt);const oe=p(rt)||r,$=o.convert(T.format,T.colorSpace);let Dt=o.convert(T.type),Et=S(T.internalFormat,$,Dt,T.colorSpace,T.isVideoTexture);Q(O,T,oe);let mt;const Ot=T.mipmaps,te=r&&T.isVideoTexture!==!0&&Et!==qu,he=tt.__version===void 0||Z===!0,Nt=b(T,rt,oe);if(T.isDepthTexture)Et=s.DEPTH_COMPONENT,r?T.type===di?Et=s.DEPTH_COMPONENT32F:T.type===fi?Et=s.DEPTH_COMPONENT24:T.type===Qi?Et=s.DEPTH24_STENCIL8:Et=s.DEPTH_COMPONENT16:T.type===di&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===ts&&Et===s.DEPTH_COMPONENT&&T.type!==Ac&&T.type!==fi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=fi,Dt=o.convert(T.type)),T.format===Gs&&Et===s.DEPTH_COMPONENT&&(Et=s.DEPTH_STENCIL,T.type!==Qi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=Qi,Dt=o.convert(T.type))),he&&(te?e.texStorage2D(s.TEXTURE_2D,1,Et,rt.width,rt.height):e.texImage2D(s.TEXTURE_2D,0,Et,rt.width,rt.height,0,$,Dt,null));else if(T.isDataTexture)if(Ot.length>0&&oe){te&&he&&e.texStorage2D(s.TEXTURE_2D,Nt,Et,Ot[0].width,Ot[0].height);for(let ot=0,k=Ot.length;ot<k;ot++)mt=Ot[ot],te?e.texSubImage2D(s.TEXTURE_2D,ot,0,0,mt.width,mt.height,$,Dt,mt.data):e.texImage2D(s.TEXTURE_2D,ot,Et,mt.width,mt.height,0,$,Dt,mt.data);T.generateMipmaps=!1}else te?(he&&e.texStorage2D(s.TEXTURE_2D,Nt,Et,rt.width,rt.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,rt.width,rt.height,$,Dt,rt.data)):e.texImage2D(s.TEXTURE_2D,0,Et,rt.width,rt.height,0,$,Dt,rt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){te&&he&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Nt,Et,Ot[0].width,Ot[0].height,rt.depth);for(let ot=0,k=Ot.length;ot<k;ot++)mt=Ot[ot],T.format!==Ee?$!==null?te?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ot,0,0,0,mt.width,mt.height,rt.depth,$,mt.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ot,Et,mt.width,mt.height,rt.depth,0,mt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):te?e.texSubImage3D(s.TEXTURE_2D_ARRAY,ot,0,0,0,mt.width,mt.height,rt.depth,$,Dt,mt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,ot,Et,mt.width,mt.height,rt.depth,0,$,Dt,mt.data)}else{te&&he&&e.texStorage2D(s.TEXTURE_2D,Nt,Et,Ot[0].width,Ot[0].height);for(let ot=0,k=Ot.length;ot<k;ot++)mt=Ot[ot],T.format!==Ee?$!==null?te?e.compressedTexSubImage2D(s.TEXTURE_2D,ot,0,0,mt.width,mt.height,$,mt.data):e.compressedTexImage2D(s.TEXTURE_2D,ot,Et,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):te?e.texSubImage2D(s.TEXTURE_2D,ot,0,0,mt.width,mt.height,$,Dt,mt.data):e.texImage2D(s.TEXTURE_2D,ot,Et,mt.width,mt.height,0,$,Dt,mt.data)}else if(T.isDataArrayTexture)te?(he&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Nt,Et,rt.width,rt.height,rt.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,$,Dt,rt.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,Et,rt.width,rt.height,rt.depth,0,$,Dt,rt.data);else if(T.isData3DTexture)te?(he&&e.texStorage3D(s.TEXTURE_3D,Nt,Et,rt.width,rt.height,rt.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,$,Dt,rt.data)):e.texImage3D(s.TEXTURE_3D,0,Et,rt.width,rt.height,rt.depth,0,$,Dt,rt.data);else if(T.isFramebufferTexture){if(he)if(te)e.texStorage2D(s.TEXTURE_2D,Nt,Et,rt.width,rt.height);else{let ot=rt.width,k=rt.height;for(let ht=0;ht<Nt;ht++)e.texImage2D(s.TEXTURE_2D,ht,Et,ot,k,0,$,Dt,null),ot>>=1,k>>=1}}else if(Ot.length>0&&oe){te&&he&&e.texStorage2D(s.TEXTURE_2D,Nt,Et,Ot[0].width,Ot[0].height);for(let ot=0,k=Ot.length;ot<k;ot++)mt=Ot[ot],te?e.texSubImage2D(s.TEXTURE_2D,ot,0,0,$,Dt,mt):e.texImage2D(s.TEXTURE_2D,ot,Et,$,Dt,mt);T.generateMipmaps=!1}else te?(he&&e.texStorage2D(s.TEXTURE_2D,Nt,Et,rt.width,rt.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,$,Dt,rt)):e.texImage2D(s.TEXTURE_2D,0,Et,$,Dt,rt);v(T,oe)&&M(O),tt.__version=V.version,T.onUpdate&&T.onUpdate(T)}L.__version=T.version}function Mt(L,T,z){if(T.image.length!==6)return;const O=nt(L,T),Z=T.source;e.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+z);const V=n.get(Z);if(Z.version!==V.__version||O===!0){e.activeTexture(s.TEXTURE0+z);const tt=le.getPrimaries(le.workingColorSpace),it=T.colorSpace===Rn?null:le.getPrimaries(T.colorSpace),pt=T.colorSpace===Rn||tt===it?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const _t=T.isCompressedTexture||T.image[0].isCompressedTexture,qt=T.image[0]&&T.image[0].isDataTexture,rt=[];for(let ot=0;ot<6;ot++)!_t&&!qt?rt[ot]=x(T.image[ot],!1,!0,i.maxCubemapSize):rt[ot]=qt?T.image[ot].image:T.image[ot],rt[ot]=lt(T,rt[ot]);const oe=rt[0],$=p(oe)||r,Dt=o.convert(T.format,T.colorSpace),Et=o.convert(T.type),mt=S(T.internalFormat,Dt,Et,T.colorSpace),Ot=r&&T.isVideoTexture!==!0,te=V.__version===void 0||O===!0;let he=b(T,oe,$);Q(s.TEXTURE_CUBE_MAP,T,$);let Nt;if(_t){Ot&&te&&e.texStorage2D(s.TEXTURE_CUBE_MAP,he,mt,oe.width,oe.height);for(let ot=0;ot<6;ot++){Nt=rt[ot].mipmaps;for(let k=0;k<Nt.length;k++){const ht=Nt[k];T.format!==Ee?Dt!==null?Ot?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,k,0,0,ht.width,ht.height,Dt,ht.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,k,mt,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,k,0,0,ht.width,ht.height,Dt,Et,ht.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,k,mt,ht.width,ht.height,0,Dt,Et,ht.data)}}}else{Nt=T.mipmaps,Ot&&te&&(Nt.length>0&&he++,e.texStorage2D(s.TEXTURE_CUBE_MAP,he,mt,rt[0].width,rt[0].height));for(let ot=0;ot<6;ot++)if(qt){Ot?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,rt[ot].width,rt[ot].height,Dt,Et,rt[ot].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,mt,rt[ot].width,rt[ot].height,0,Dt,Et,rt[ot].data);for(let k=0;k<Nt.length;k++){const ut=Nt[k].image[ot].image;Ot?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,k+1,0,0,ut.width,ut.height,Dt,Et,ut.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,k+1,mt,ut.width,ut.height,0,Dt,Et,ut.data)}}else{Ot?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Dt,Et,rt[ot]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,mt,Dt,Et,rt[ot]);for(let k=0;k<Nt.length;k++){const ht=Nt[k];Ot?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,k+1,0,0,Dt,Et,ht.image[ot]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,k+1,mt,Dt,Et,ht.image[ot])}}}v(T,$)&&M(s.TEXTURE_CUBE_MAP),V.__version=Z.version,T.onUpdate&&T.onUpdate(T)}L.__version=T.version}function bt(L,T,z,O,Z,V){const tt=o.convert(z.format,z.colorSpace),it=o.convert(z.type),pt=S(z.internalFormat,tt,it,z.colorSpace);if(!n.get(T).__hasExternalTextures){const qt=Math.max(1,T.width>>V),rt=Math.max(1,T.height>>V);Z===s.TEXTURE_3D||Z===s.TEXTURE_2D_ARRAY?e.texImage3D(Z,V,pt,qt,rt,T.depth,0,tt,it,null):e.texImage2D(Z,V,pt,qt,rt,0,tt,it,null)}e.bindFramebuffer(s.FRAMEBUFFER,L),Y(T)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,O,Z,n.get(z).__webglTexture,0,kt(T)):(Z===s.TEXTURE_2D||Z>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,O,Z,n.get(z).__webglTexture,V),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Rt(L,T,z){if(s.bindRenderbuffer(s.RENDERBUFFER,L),T.depthBuffer&&!T.stencilBuffer){let O=r===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(z||Y(T)){const Z=T.depthTexture;Z&&Z.isDepthTexture&&(Z.type===di?O=s.DEPTH_COMPONENT32F:Z.type===fi&&(O=s.DEPTH_COMPONENT24));const V=kt(T);Y(T)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,V,O,T.width,T.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,V,O,T.width,T.height)}else s.renderbufferStorage(s.RENDERBUFFER,O,T.width,T.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,L)}else if(T.depthBuffer&&T.stencilBuffer){const O=kt(T);z&&Y(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,O,s.DEPTH24_STENCIL8,T.width,T.height):Y(T)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,O,s.DEPTH24_STENCIL8,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,L)}else{const O=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let Z=0;Z<O.length;Z++){const V=O[Z],tt=o.convert(V.format,V.colorSpace),it=o.convert(V.type),pt=S(V.internalFormat,tt,it,V.colorSpace),_t=kt(T);z&&Y(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,_t,pt,T.width,T.height):Y(T)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,_t,pt,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,pt,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Lt(L,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,L),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),F(T.depthTexture,0);const O=n.get(T.depthTexture).__webglTexture,Z=kt(T);if(T.depthTexture.format===ts)Y(T)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,O,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,O,0);else if(T.depthTexture.format===Gs)Y(T)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,O,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,O,0);else throw new Error("Unknown depthTexture format")}function St(L){const T=n.get(L),z=L.isWebGLCubeRenderTarget===!0;if(L.depthTexture&&!T.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Lt(T.__webglFramebuffer,L)}else if(z){T.__webglDepthbuffer=[];for(let O=0;O<6;O++)e.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[O]),T.__webglDepthbuffer[O]=s.createRenderbuffer(),Rt(T.__webglDepthbuffer[O],L,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=s.createRenderbuffer(),Rt(T.__webglDepthbuffer,L,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Ft(L,T,z){const O=n.get(L);T!==void 0&&bt(O.__webglFramebuffer,L,L.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&St(L)}function X(L){const T=L.texture,z=n.get(L),O=n.get(T);L.addEventListener("dispose",A),L.isWebGLMultipleRenderTargets!==!0&&(O.__webglTexture===void 0&&(O.__webglTexture=s.createTexture()),O.__version=T.version,a.memory.textures++);const Z=L.isWebGLCubeRenderTarget===!0,V=L.isWebGLMultipleRenderTargets===!0,tt=p(L)||r;if(Z){z.__webglFramebuffer=[];for(let it=0;it<6;it++)if(r&&T.mipmaps&&T.mipmaps.length>0){z.__webglFramebuffer[it]=[];for(let pt=0;pt<T.mipmaps.length;pt++)z.__webglFramebuffer[it][pt]=s.createFramebuffer()}else z.__webglFramebuffer[it]=s.createFramebuffer()}else{if(r&&T.mipmaps&&T.mipmaps.length>0){z.__webglFramebuffer=[];for(let it=0;it<T.mipmaps.length;it++)z.__webglFramebuffer[it]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(V)if(i.drawBuffers){const it=L.texture;for(let pt=0,_t=it.length;pt<_t;pt++){const qt=n.get(it[pt]);qt.__webglTexture===void 0&&(qt.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&L.samples>0&&Y(L)===!1){const it=V?T:[T];z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let pt=0;pt<it.length;pt++){const _t=it[pt];z.__webglColorRenderbuffer[pt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[pt]);const qt=o.convert(_t.format,_t.colorSpace),rt=o.convert(_t.type),oe=S(_t.internalFormat,qt,rt,_t.colorSpace,L.isXRRenderTarget===!0),$=kt(L);s.renderbufferStorageMultisample(s.RENDERBUFFER,$,oe,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,z.__webglColorRenderbuffer[pt])}s.bindRenderbuffer(s.RENDERBUFFER,null),L.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),Rt(z.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Z){e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture),Q(s.TEXTURE_CUBE_MAP,T,tt);for(let it=0;it<6;it++)if(r&&T.mipmaps&&T.mipmaps.length>0)for(let pt=0;pt<T.mipmaps.length;pt++)bt(z.__webglFramebuffer[it][pt],L,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+it,pt);else bt(z.__webglFramebuffer[it],L,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);v(T,tt)&&M(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(V){const it=L.texture;for(let pt=0,_t=it.length;pt<_t;pt++){const qt=it[pt],rt=n.get(qt);e.bindTexture(s.TEXTURE_2D,rt.__webglTexture),Q(s.TEXTURE_2D,qt,tt),bt(z.__webglFramebuffer,L,qt,s.COLOR_ATTACHMENT0+pt,s.TEXTURE_2D,0),v(qt,tt)&&M(s.TEXTURE_2D)}e.unbindTexture()}else{let it=s.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(r?it=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(it,O.__webglTexture),Q(it,T,tt),r&&T.mipmaps&&T.mipmaps.length>0)for(let pt=0;pt<T.mipmaps.length;pt++)bt(z.__webglFramebuffer[pt],L,T,s.COLOR_ATTACHMENT0,it,pt);else bt(z.__webglFramebuffer,L,T,s.COLOR_ATTACHMENT0,it,0);v(T,tt)&&M(it),e.unbindTexture()}L.depthBuffer&&St(L)}function ue(L){const T=p(L)||r,z=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let O=0,Z=z.length;O<Z;O++){const V=z[O];if(v(V,T)){const tt=L.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,it=n.get(V).__webglTexture;e.bindTexture(tt,it),M(tt),e.unbindTexture()}}}function Tt(L){if(r&&L.samples>0&&Y(L)===!1){const T=L.isWebGLMultipleRenderTargets?L.texture:[L.texture],z=L.width,O=L.height;let Z=s.COLOR_BUFFER_BIT;const V=[],tt=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,it=n.get(L),pt=L.isWebGLMultipleRenderTargets===!0;if(pt)for(let _t=0;_t<T.length;_t++)e.bindFramebuffer(s.FRAMEBUFFER,it.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+_t,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,it.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+_t,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,it.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,it.__webglFramebuffer);for(let _t=0;_t<T.length;_t++){V.push(s.COLOR_ATTACHMENT0+_t),L.depthBuffer&&V.push(tt);const qt=it.__ignoreDepthValues!==void 0?it.__ignoreDepthValues:!1;if(qt===!1&&(L.depthBuffer&&(Z|=s.DEPTH_BUFFER_BIT),L.stencilBuffer&&(Z|=s.STENCIL_BUFFER_BIT)),pt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,it.__webglColorRenderbuffer[_t]),qt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[tt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[tt])),pt){const rt=n.get(T[_t]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,rt,0)}s.blitFramebuffer(0,0,z,O,0,0,z,O,Z,s.NEAREST),l&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,V)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),pt)for(let _t=0;_t<T.length;_t++){e.bindFramebuffer(s.FRAMEBUFFER,it.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+_t,s.RENDERBUFFER,it.__webglColorRenderbuffer[_t]);const qt=n.get(T[_t]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,it.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+_t,s.TEXTURE_2D,qt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,it.__webglMultisampledFramebuffer)}}function kt(L){return Math.min(i.maxSamples,L.samples)}function Y(L){const T=n.get(L);return r&&L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function at(L){const T=a.render.frame;h.get(L)!==T&&(h.set(L,T),L.update())}function lt(L,T){const z=L.colorSpace,O=L.format,Z=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||L.format===hc||z!==xi&&z!==Rn&&(le.getTransfer(z)===fe?r===!1?t.has("EXT_sRGB")===!0&&O===Ee?(L.format=hc,L.minFilter=Be,L.generateMipmaps=!1):T=Zu.sRGBToLinear(T):(O!==Ee||Z!==de)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),T}this.allocateTextureUnit=R,this.resetTextureUnits=I,this.setTexture2D=F,this.setTexture2DArray=G,this.setTexture3D=W,this.setTextureCube=K,this.rebindTextures=Ft,this.setupRenderTarget=X,this.updateRenderTargetMipmap=ue,this.updateMultisampleRenderTarget=Tt,this.setupDepthRenderbuffer=St,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=Y}function Uv(s,t,e){const n=e.isWebGL2;function i(o,a=Rn){let r;const c=le.getTransfer(a);if(o===de)return s.UNSIGNED_BYTE;if(o===Wu)return s.UNSIGNED_SHORT_4_4_4_4;if(o===Gu)return s.UNSIGNED_SHORT_5_5_5_1;if(o===sp)return s.BYTE;if(o===op)return s.SHORT;if(o===Ac)return s.UNSIGNED_SHORT;if(o===Bu)return s.INT;if(o===fi)return s.UNSIGNED_INT;if(o===di)return s.FLOAT;if(o===Ri)return n?s.HALF_FLOAT:(r=t.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(o===ap)return s.ALPHA;if(o===Ee)return s.RGBA;if(o===rp)return s.LUMINANCE;if(o===cp)return s.LUMINANCE_ALPHA;if(o===ts)return s.DEPTH_COMPONENT;if(o===Gs)return s.DEPTH_STENCIL;if(o===hc)return r=t.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(o===Li)return s.RED;if(o===Hu)return s.RED_INTEGER;if(o===Vu)return s.RG;if(o===$u)return s.RG_INTEGER;if(o===Xu)return s.RGBA_INTEGER;if(o===lr||o===hr||o===ur||o===fr)if(c===fe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(o===lr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(o===lr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===hr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===ur)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===fr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===il||o===sl||o===ol||o===al)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(o===il)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===sl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===ol)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===al)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===qu)return r=t.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===rl||o===cl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(o===rl)return c===fe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(o===cl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===ll||o===hl||o===ul||o===fl||o===dl||o===pl||o===ml||o===gl||o===vl||o===xl||o===Ml||o===_l||o===yl||o===wl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(o===ll)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===hl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===ul)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===fl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===dl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===pl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===ml)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===gl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===vl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===xl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===Ml)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===_l)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===yl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===wl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===dr||o===bl||o===Sl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(o===dr)return c===fe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===bl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===Sl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===lp||o===El||o===Al||o===Tl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(o===dr)return r.COMPRESSED_RED_RGTC1_EXT;if(o===El)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===Al)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===Tl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===Qi?n?s.UNSIGNED_INT_24_8:(r=t.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):s[o]!==void 0?s[o]:null}return{convert:i}}class kv extends yn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class We extends pn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const zv={type:"move"};class zr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new We,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new We,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new We,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,o=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const x of t.hand.values()){const p=e.getJointPose(x,n),d=this._getHandJoint(l,x);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&f>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&o!==null&&(i=o),i!==null&&(r.matrix.fromArray(i.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,i.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(i.linearVelocity)):r.hasLinearVelocity=!1,i.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(i.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(zv)))}return r!==null&&(r.visible=i!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new We;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Fv extends Vs{constructor(t,e){super();const n=this;let i=null,o=1,a=null,r="local-floor",c=1,l=null,h=null,u=null,f=null,m=null,g=null;const x=e.getContextAttributes();let p=null,d=null;const v=[],M=[],S=new Ht;let b=null;const w=new yn;w.layers.enable(1),w.viewport=new ee;const E=new yn;E.layers.enable(2),E.viewport=new ee;const A=[w,E],_=new kv;_.layers.enable(1),_.layers.enable(2);let y=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let nt=v[Q];return nt===void 0&&(nt=new zr,v[Q]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Q){let nt=v[Q];return nt===void 0&&(nt=new zr,v[Q]=nt),nt.getGripSpace()},this.getHand=function(Q){let nt=v[Q];return nt===void 0&&(nt=new zr,v[Q]=nt),nt.getHandSpace()};function P(Q){const nt=M.indexOf(Q.inputSource);if(nt===-1)return;const dt=v[nt];dt!==void 0&&(dt.update(Q.inputSource,Q.frame,l||a),dt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function I(){i.removeEventListener("select",P),i.removeEventListener("selectstart",P),i.removeEventListener("selectend",P),i.removeEventListener("squeeze",P),i.removeEventListener("squeezestart",P),i.removeEventListener("squeezeend",P),i.removeEventListener("end",I),i.removeEventListener("inputsourceschange",R);for(let Q=0;Q<v.length;Q++){const nt=M[Q];nt!==null&&(M[Q]=null,v[Q].disconnect(nt))}y=null,C=null,t.setRenderTarget(p),m=null,f=null,u=null,i=null,d=null,ct.stop(),n.isPresenting=!1,t.setPixelRatio(b),t.setSize(S.width,S.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){o=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){r=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Q){l=Q},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Q){if(i=Q,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",P),i.addEventListener("selectstart",P),i.addEventListener("selectend",P),i.addEventListener("squeeze",P),i.addEventListener("squeezestart",P),i.addEventListener("squeezeend",P),i.addEventListener("end",I),i.addEventListener("inputsourceschange",R),x.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(S),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const nt={antialias:i.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:o};m=new XRWebGLLayer(i,e,nt),i.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),d=new Zn(m.framebufferWidth,m.framebufferHeight,{format:Ee,type:de,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let nt=null,dt=null,Mt=null;x.depth&&(Mt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=x.stencil?Gs:ts,dt=x.stencil?Qi:fi);const bt={colorFormat:e.RGBA8,depthFormat:Mt,scaleFactor:o};u=new XRWebGLBinding(i,e),f=u.createProjectionLayer(bt),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),d=new Zn(f.textureWidth,f.textureHeight,{format:Ee,type:de,depthTexture:new Ic(f.textureWidth,f.textureHeight,dt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});const Rt=t.properties.get(d);Rt.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(r),ct.setContext(i),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function R(Q){for(let nt=0;nt<Q.removed.length;nt++){const dt=Q.removed[nt],Mt=M.indexOf(dt);Mt>=0&&(M[Mt]=null,v[Mt].disconnect(dt))}for(let nt=0;nt<Q.added.length;nt++){const dt=Q.added[nt];let Mt=M.indexOf(dt);if(Mt===-1){for(let Rt=0;Rt<v.length;Rt++)if(Rt>=M.length){M.push(dt),Mt=Rt;break}else if(M[Rt]===null){M[Rt]=dt,Mt=Rt;break}if(Mt===-1)break}const bt=v[Mt];bt&&bt.connect(dt)}}const U=new B,F=new B;function G(Q,nt,dt){U.setFromMatrixPosition(nt.matrixWorld),F.setFromMatrixPosition(dt.matrixWorld);const Mt=U.distanceTo(F),bt=nt.projectionMatrix.elements,Rt=dt.projectionMatrix.elements,Lt=bt[14]/(bt[10]-1),St=bt[14]/(bt[10]+1),Ft=(bt[9]+1)/bt[5],X=(bt[9]-1)/bt[5],ue=(bt[8]-1)/bt[0],Tt=(Rt[8]+1)/Rt[0],kt=Lt*ue,Y=Lt*Tt,at=Mt/(-ue+Tt),lt=at*-ue;nt.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(lt),Q.translateZ(at),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert();const L=Lt+at,T=St+at,z=kt-lt,O=Y+(Mt-lt),Z=Ft*St/T*L,V=X*St/T*L;Q.projectionMatrix.makePerspective(z,O,Z,V,L,T),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}function W(Q,nt){nt===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(nt.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(i===null)return;_.near=E.near=w.near=Q.near,_.far=E.far=w.far=Q.far,(y!==_.near||C!==_.far)&&(i.updateRenderState({depthNear:_.near,depthFar:_.far}),y=_.near,C=_.far);const nt=Q.parent,dt=_.cameras;W(_,nt);for(let Mt=0;Mt<dt.length;Mt++)W(dt[Mt],nt);dt.length===2?G(_,w,E):_.projectionMatrix.copy(w.projectionMatrix),K(Q,_,nt)};function K(Q,nt,dt){dt===null?Q.matrix.copy(nt.matrixWorld):(Q.matrix.copy(dt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(nt.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(nt.projectionMatrix),Q.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Eo*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(Q){c=Q,f!==null&&(f.fixedFoveation=Q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Q)};let H=null;function et(Q,nt){if(h=nt.getViewerPose(l||a),g=nt,h!==null){const dt=h.views;m!==null&&(t.setRenderTargetFramebuffer(d,m.framebuffer),t.setRenderTarget(d));let Mt=!1;dt.length!==_.cameras.length&&(_.cameras.length=0,Mt=!0);for(let bt=0;bt<dt.length;bt++){const Rt=dt[bt];let Lt=null;if(m!==null)Lt=m.getViewport(Rt);else{const Ft=u.getViewSubImage(f,Rt);Lt=Ft.viewport,bt===0&&(t.setRenderTargetTextures(d,Ft.colorTexture,f.ignoreDepthValues?void 0:Ft.depthStencilTexture),t.setRenderTarget(d))}let St=A[bt];St===void 0&&(St=new yn,St.layers.enable(bt),St.viewport=new ee,A[bt]=St),St.matrix.fromArray(Rt.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(Rt.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(Lt.x,Lt.y,Lt.width,Lt.height),bt===0&&(_.matrix.copy(St.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),Mt===!0&&_.cameras.push(St)}}for(let dt=0;dt<v.length;dt++){const Mt=M[dt],bt=v[dt];Mt!==null&&bt!==void 0&&bt.update(Mt,nt,l||a)}H&&H(Q,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}const ct=new cf;ct.setAnimationLoop(et),this.setAnimationLoop=function(Q){H=Q},this.dispose=function(){}}}function Nv(s,t){function e(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function n(p,d){d.color.getRGB(p.fogColor.value,of(s)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function i(p,d,v,M,S){d.isMeshBasicMaterial||d.isMeshLambertMaterial?o(p,d):d.isMeshToonMaterial?(o(p,d),u(p,d)):d.isMeshPhongMaterial?(o(p,d),h(p,d)):d.isMeshStandardMaterial?(o(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,S)):d.isMeshMatcapMaterial?(o(p,d),g(p,d)):d.isMeshDepthMaterial?o(p,d):d.isMeshDistanceMaterial?(o(p,d),x(p,d)):d.isMeshNormalMaterial?o(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&r(p,d)):d.isPointsMaterial?c(p,d,v,M):d.isSpriteMaterial?l(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function o(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,e(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===rn&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,e(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===rn&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,e(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,e(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const v=t.get(d).envMap;if(v&&(p.envMap.value=v,p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap){p.lightMap.value=d.lightMap;const M=s._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=d.lightMapIntensity*M,e(d.lightMap,p.lightMapTransform)}d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform))}function r(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function c(p,d,v,M){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*v,p.scale.value=M*.5,d.map&&(p.map.value=d.map,e(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function l(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function h(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function u(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,p.roughnessMapTransform)),t.get(d).envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,v){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===rn&&p.clearcoatNormalScale.value.negate())),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,d){d.matcap&&(p.matcap.value=d.matcap)}function x(p,d){const v=t.get(d).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Ov(s,t,e,n){let i={},o={},a=[];const r=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,M){const S=M.program;n.uniformBlockBinding(v,S)}function l(v,M){let S=i[v.id];S===void 0&&(g(v),S=h(v),i[v.id]=S,v.addEventListener("dispose",p));const b=M.program;n.updateUBOMapping(v,b);const w=t.render.frame;o[v.id]!==w&&(f(v),o[v.id]=w)}function h(v){const M=u();v.__bindingPointIndex=M;const S=s.createBuffer(),b=v.__size,w=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,S),s.bufferData(s.UNIFORM_BUFFER,b,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,M,S),S}function u(){for(let v=0;v<r;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const M=i[v.id],S=v.uniforms,b=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,M);for(let w=0,E=S.length;w<E;w++){const A=Array.isArray(S[w])?S[w]:[S[w]];for(let _=0,y=A.length;_<y;_++){const C=A[_];if(m(C,w,_,b)===!0){const P=C.__offset,I=Array.isArray(C.value)?C.value:[C.value];let R=0;for(let U=0;U<I.length;U++){const F=I[U],G=x(F);typeof F=="number"||typeof F=="boolean"?(C.__data[0]=F,s.bufferSubData(s.UNIFORM_BUFFER,P+R,C.__data)):F.isMatrix3?(C.__data[0]=F.elements[0],C.__data[1]=F.elements[1],C.__data[2]=F.elements[2],C.__data[3]=0,C.__data[4]=F.elements[3],C.__data[5]=F.elements[4],C.__data[6]=F.elements[5],C.__data[7]=0,C.__data[8]=F.elements[6],C.__data[9]=F.elements[7],C.__data[10]=F.elements[8],C.__data[11]=0):(F.toArray(C.__data,R),R+=G.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,P,C.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(v,M,S,b){const w=v.value,E=M+"_"+S;if(b[E]===void 0)return typeof w=="number"||typeof w=="boolean"?b[E]=w:b[E]=w.clone(),!0;{const A=b[E];if(typeof w=="number"||typeof w=="boolean"){if(A!==w)return b[E]=w,!0}else if(A.equals(w)===!1)return A.copy(w),!0}return!1}function g(v){const M=v.uniforms;let S=0;const b=16;for(let E=0,A=M.length;E<A;E++){const _=Array.isArray(M[E])?M[E]:[M[E]];for(let y=0,C=_.length;y<C;y++){const P=_[y],I=Array.isArray(P.value)?P.value:[P.value];for(let R=0,U=I.length;R<U;R++){const F=I[R],G=x(F),W=S%b;W!==0&&b-W<G.boundary&&(S+=b-W),P.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=S,S+=G.storage}}}const w=S%b;return w>0&&(S+=b-w),v.__size=S,v.__cache={},this}function x(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function p(v){const M=v.target;M.removeEventListener("dispose",p);const S=a.indexOf(M.__bindingPointIndex);a.splice(S,1),s.deleteBuffer(i[M.id]),delete i[M.id],delete o[M.id]}function d(){for(const v in i)s.deleteBuffer(i[v]);a=[],i={},o={}}return{bind:c,update:l,dispose:d}}class pf{constructor(t={}){const{canvas:e=kp(),context:n=null,depth:i=!0,stencil:o=!0,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=a;const m=new Uint32Array(4),g=new Int32Array(4);let x=null,p=null;const d=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Oe,this._useLegacyLights=!1,this.toneMapping=Ci,this.toneMappingExposure=1;const M=this;let S=!1,b=0,w=0,E=null,A=-1,_=null;const y=new ee,C=new ee;let P=null;const I=new Gt(0);let R=0,U=e.width,F=e.height,G=1,W=null,K=null;const H=new ee(0,0,U,F),et=new ee(0,0,U,F);let ct=!1;const Q=new Ii;let nt=!1,dt=!1,Mt=null;const bt=new se,Rt=new Ht,Lt=new B,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ft(){return E===null?G:1}let X=n;function ue(D,N){for(let q=0;q<D.length;q++){const J=D[q],j=e.getContext(J,N);if(j!==null)return j}return null}try{const D={alpha:!0,depth:i,stencil:o,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ec}`),e.addEventListener("webglcontextlost",ot,!1),e.addEventListener("webglcontextrestored",k,!1),e.addEventListener("webglcontextcreationerror",ht,!1),X===null){const N=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&N.shift(),X=ue(N,D),X===null)throw ue(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let Tt,kt,Y,at,lt,L,T,z,O,Z,V,tt,it,pt,_t,qt,rt,oe,$,Dt,Et,mt,Ot,te;function he(){Tt=new Yg(X),kt=new Hg(X,Tt,t),Tt.init(kt),mt=new Uv(X,Tt,kt),Y=new Dv(X,Tt,kt),at=new Jg(X),lt=new xv,L=new Iv(X,Tt,Y,lt,kt,mt,at),T=new $g(M),z=new jg(M),O=new a0(X,kt),Ot=new Wg(X,Tt,O,kt),Z=new Kg(X,O,at,Ot),V=new n1(X,Z,O,at),$=new e1(X,kt,L),qt=new Vg(lt),tt=new vv(M,T,z,Tt,kt,Ot,qt),it=new Nv(M,lt),pt=new _v,_t=new Av(Tt,kt),oe=new Bg(M,T,z,Y,V,f,c),rt=new Pv(M,V,kt),te=new Ov(X,at,kt,Y),Dt=new Gg(X,Tt,at,kt),Et=new Zg(X,Tt,at,kt),at.programs=tt.programs,M.capabilities=kt,M.extensions=Tt,M.properties=lt,M.renderLists=pt,M.shadowMap=rt,M.state=Y,M.info=at}he();const Nt=new Fv(M,X);this.xr=Nt,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){const D=Tt.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=Tt.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(D){D!==void 0&&(G=D,this.setSize(U,F,!1))},this.getSize=function(D){return D.set(U,F)},this.setSize=function(D,N,q=!0){if(Nt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=D,F=N,e.width=Math.floor(D*G),e.height=Math.floor(N*G),q===!0&&(e.style.width=D+"px",e.style.height=N+"px"),this.setViewport(0,0,D,N)},this.getDrawingBufferSize=function(D){return D.set(U*G,F*G).floor()},this.setDrawingBufferSize=function(D,N,q){U=D,F=N,G=q,e.width=Math.floor(D*q),e.height=Math.floor(N*q),this.setViewport(0,0,D,N)},this.getCurrentViewport=function(D){return D.copy(y)},this.getViewport=function(D){return D.copy(H)},this.setViewport=function(D,N,q,J){D.isVector4?H.set(D.x,D.y,D.z,D.w):H.set(D,N,q,J),Y.viewport(y.copy(H).multiplyScalar(G).floor())},this.getScissor=function(D){return D.copy(et)},this.setScissor=function(D,N,q,J){D.isVector4?et.set(D.x,D.y,D.z,D.w):et.set(D,N,q,J),Y.scissor(C.copy(et).multiplyScalar(G).floor())},this.getScissorTest=function(){return ct},this.setScissorTest=function(D){Y.setScissorTest(ct=D)},this.setOpaqueSort=function(D){W=D},this.setTransparentSort=function(D){K=D},this.getClearColor=function(D){return D.copy(oe.getClearColor())},this.setClearColor=function(){oe.setClearColor.apply(oe,arguments)},this.getClearAlpha=function(){return oe.getClearAlpha()},this.setClearAlpha=function(){oe.setClearAlpha.apply(oe,arguments)},this.clear=function(D=!0,N=!0,q=!0){let J=0;if(D){let j=!1;if(E!==null){const xt=E.texture.format;j=xt===Xu||xt===$u||xt===Hu}if(j){const xt=E.texture.type,Ct=xt===de||xt===fi||xt===Ac||xt===Qi||xt===Wu||xt===Gu,Ut=oe.getClearColor(),Bt=oe.getClearAlpha(),jt=Ut.r,Vt=Ut.g,Yt=Ut.b;Ct?(m[0]=jt,m[1]=Vt,m[2]=Yt,m[3]=Bt,X.clearBufferuiv(X.COLOR,0,m)):(g[0]=jt,g[1]=Vt,g[2]=Yt,g[3]=Bt,X.clearBufferiv(X.COLOR,0,g))}else J|=X.COLOR_BUFFER_BIT}N&&(J|=X.DEPTH_BUFFER_BIT),q&&(J|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ot,!1),e.removeEventListener("webglcontextrestored",k,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),pt.dispose(),_t.dispose(),lt.dispose(),T.dispose(),z.dispose(),V.dispose(),Ot.dispose(),te.dispose(),tt.dispose(),Nt.dispose(),Nt.removeEventListener("sessionstart",we),Nt.removeEventListener("sessionend",re),Mt&&(Mt.dispose(),Mt=null),Ue.stop()};function ot(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function k(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const D=at.autoReset,N=rt.enabled,q=rt.autoUpdate,J=rt.needsUpdate,j=rt.type;he(),at.autoReset=D,rt.enabled=N,rt.autoUpdate=q,rt.needsUpdate=J,rt.type=j}function ht(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function ut(D){const N=D.target;N.removeEventListener("dispose",ut),It(N)}function It(D){zt(D),lt.remove(D)}function zt(D){const N=lt.get(D).programs;N!==void 0&&(N.forEach(function(q){tt.releaseProgram(q)}),D.isShaderMaterial&&tt.releaseShaderCache(D))}this.renderBufferDirect=function(D,N,q,J,j,xt){N===null&&(N=St);const Ct=j.isMesh&&j.matrixWorld.determinant()<0,Ut=At(D,N,q,J,j);Y.setMaterial(J,Ct);let Bt=q.index,jt=1;if(J.wireframe===!0){if(Bt=Z.getWireframeAttribute(q),Bt===void 0)return;jt=2}const Vt=q.drawRange,Yt=q.attributes.position;let ye=Vt.start*jt,mn=(Vt.start+Vt.count)*jt;xt!==null&&(ye=Math.max(ye,xt.start*jt),mn=Math.min(mn,(xt.start+xt.count)*jt)),Bt!==null?(ye=Math.max(ye,0),mn=Math.min(mn,Bt.count)):Yt!=null&&(ye=Math.max(ye,0),mn=Math.min(mn,Yt.count));const ke=mn-ye;if(ke<0||ke===1/0)return;Ot.setup(j,J,Ut,q,Bt);let ti,me=Dt;if(Bt!==null&&(ti=O.get(Bt),me=Et,me.setIndex(ti)),j.isMesh)J.wireframe===!0?(Y.setLineWidth(J.wireframeLinewidth*Ft()),me.setMode(X.LINES)):me.setMode(X.TRIANGLES);else if(j.isLine){let Jt=J.linewidth;Jt===void 0&&(Jt=1),Y.setLineWidth(Jt*Ft()),j.isLineSegments?me.setMode(X.LINES):j.isLineLoop?me.setMode(X.LINE_LOOP):me.setMode(X.LINE_STRIP)}else j.isPoints?me.setMode(X.POINTS):j.isSprite&&me.setMode(X.TRIANGLES);if(j.isBatchedMesh)me.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else if(j.isInstancedMesh)me.renderInstances(ye,ke,j.count);else if(q.isInstancedBufferGeometry){const Jt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,sr=Math.min(q.instanceCount,Jt);me.renderInstances(ye,ke,sr)}else me.render(ye,ke)};function ne(D,N,q){D.transparent===!0&&D.side===On&&D.forceSinglePass===!1?(D.side=rn,D.needsUpdate=!0,Qn(D,N,q),D.side=vi,D.needsUpdate=!0,Qn(D,N,q),D.side=On):Qn(D,N,q)}this.compile=function(D,N,q=null){q===null&&(q=D),p=_t.get(q),p.init(),v.push(p),q.traverseVisible(function(j){j.isLight&&j.layers.test(N.layers)&&(p.pushLight(j),j.castShadow&&p.pushShadow(j))}),D!==q&&D.traverseVisible(function(j){j.isLight&&j.layers.test(N.layers)&&(p.pushLight(j),j.castShadow&&p.pushShadow(j))}),p.setupLights(M._useLegacyLights);const J=new Set;return D.traverse(function(j){const xt=j.material;if(xt)if(Array.isArray(xt))for(let Ct=0;Ct<xt.length;Ct++){const Ut=xt[Ct];ne(Ut,q,j),J.add(Ut)}else ne(xt,q,j),J.add(xt)}),v.pop(),p=null,J},this.compileAsync=function(D,N,q=null){const J=this.compile(D,N,q);return new Promise(j=>{function xt(){if(J.forEach(function(Ct){lt.get(Ct).currentProgram.isReady()&&J.delete(Ct)}),J.size===0){j(D);return}setTimeout(xt,10)}Tt.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let ae=null;function pe(D){ae&&ae(D)}function we(){Ue.stop()}function re(){Ue.start()}const Ue=new cf;Ue.setAnimationLoop(pe),typeof self<"u"&&Ue.setContext(self),this.setAnimationLoop=function(D){ae=D,Nt.setAnimationLoop(D),D===null?Ue.stop():Ue.start()},Nt.addEventListener("sessionstart",we),Nt.addEventListener("sessionend",re),this.render=function(D,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Nt.enabled===!0&&Nt.isPresenting===!0&&(Nt.cameraAutoUpdate===!0&&Nt.updateCamera(N),N=Nt.getCamera()),D.isScene===!0&&D.onBeforeRender(M,D,N,E),p=_t.get(D,v.length),p.init(),v.push(p),bt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Q.setFromProjectionMatrix(bt),dt=this.localClippingEnabled,nt=qt.init(this.clippingPlanes,dt),x=pt.get(D,d.length),x.init(),d.push(x),Sn(D,N,0,M.sortObjects),x.finish(),M.sortObjects===!0&&x.sort(W,K),this.info.render.frame++,nt===!0&&qt.beginShadows();const q=p.state.shadowsArray;if(rt.render(q,D,N),nt===!0&&qt.endShadows(),this.info.autoReset===!0&&this.info.reset(),oe.render(x,D),p.setupLights(M._useLegacyLights),N.isArrayCamera){const J=N.cameras;for(let j=0,xt=J.length;j<xt;j++){const Ct=J[j];js(x,D,Ct,Ct.viewport)}}else js(x,D,N);E!==null&&(L.updateMultisampleRenderTarget(E),L.updateRenderTargetMipmap(E)),D.isScene===!0&&D.onAfterRender(M,D,N),Ot.resetDefaultState(),A=-1,_=null,v.pop(),v.length>0?p=v[v.length-1]:p=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function Sn(D,N,q,J){if(D.visible===!1)return;if(D.layers.test(N.layers)){if(D.isGroup)q=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(N);else if(D.isLight)p.pushLight(D),D.castShadow&&p.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||Q.intersectsSprite(D)){J&&Lt.setFromMatrixPosition(D.matrixWorld).applyMatrix4(bt);const Ct=V.update(D),Ut=D.material;Ut.visible&&x.push(D,Ct,Ut,q,Lt.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||Q.intersectsObject(D))){const Ct=V.update(D),Ut=D.material;if(J&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),Lt.copy(D.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Lt.copy(Ct.boundingSphere.center)),Lt.applyMatrix4(D.matrixWorld).applyMatrix4(bt)),Array.isArray(Ut)){const Bt=Ct.groups;for(let jt=0,Vt=Bt.length;jt<Vt;jt++){const Yt=Bt[jt],ye=Ut[Yt.materialIndex];ye&&ye.visible&&x.push(D,Ct,ye,q,Lt.z,Yt)}}else Ut.visible&&x.push(D,Ct,Ut,q,Lt.z,null)}}const xt=D.children;for(let Ct=0,Ut=xt.length;Ct<Ut;Ct++)Sn(xt[Ct],N,q,J)}function js(D,N,q,J){const j=D.opaque,xt=D.transmissive,Ct=D.transparent;p.setupLightsView(q),nt===!0&&qt.setGlobalState(M.clippingPlanes,q),xt.length>0&&Ln(j,xt,N,q),J&&Y.viewport(y.copy(J)),j.length>0&&as(j,N,q),xt.length>0&&as(xt,N,q),Ct.length>0&&as(Ct,N,q),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function Ln(D,N,q,J){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;const xt=kt.isWebGL2;Mt===null&&(Mt=new Zn(1,1,{generateMipmaps:!0,type:Tt.has("EXT_color_buffer_half_float")?Ri:de,minFilter:ns,samples:xt?4:0})),M.getDrawingBufferSize(Rt),xt?Mt.setSize(Rt.x,Rt.y):Mt.setSize(Fa(Rt.x),Fa(Rt.y));const Ct=M.getRenderTarget();M.setRenderTarget(Mt),M.getClearColor(I),R=M.getClearAlpha(),R<1&&M.setClearColor(16777215,.5),M.clear();const Ut=M.toneMapping;M.toneMapping=Ci,as(D,q,J),L.updateMultisampleRenderTarget(Mt),L.updateRenderTargetMipmap(Mt);let Bt=!1;for(let jt=0,Vt=N.length;jt<Vt;jt++){const Yt=N[jt],ye=Yt.object,mn=Yt.geometry,ke=Yt.material,ti=Yt.group;if(ke.side===On&&ye.layers.test(J.layers)){const me=ke.side;ke.side=rn,ke.needsUpdate=!0,Ui(ye,q,J,mn,ke,ti),ke.side=me,ke.needsUpdate=!0,Bt=!0}}Bt===!0&&(L.updateMultisampleRenderTarget(Mt),L.updateRenderTargetMipmap(Mt)),M.setRenderTarget(Ct),M.setClearColor(I,R),M.toneMapping=Ut}function as(D,N,q){const J=N.isScene===!0?N.overrideMaterial:null;for(let j=0,xt=D.length;j<xt;j++){const Ct=D[j],Ut=Ct.object,Bt=Ct.geometry,jt=J===null?Ct.material:J,Vt=Ct.group;Ut.layers.test(q.layers)&&Ui(Ut,N,q,Bt,jt,Vt)}}function Ui(D,N,q,J,j,xt){D.onBeforeRender(M,N,q,J,j,xt),D.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),j.onBeforeRender(M,N,q,J,D,xt),j.transparent===!0&&j.side===On&&j.forceSinglePass===!1?(j.side=rn,j.needsUpdate=!0,M.renderBufferDirect(q,N,J,j,D,xt),j.side=vi,j.needsUpdate=!0,M.renderBufferDirect(q,N,J,j,D,xt),j.side=On):M.renderBufferDirect(q,N,J,j,D,xt),D.onAfterRender(M,N,q,J,j,xt)}function Qn(D,N,q){N.isScene!==!0&&(N=St);const J=lt.get(D),j=p.state.lights,xt=p.state.shadowsArray,Ct=j.state.version,Ut=tt.getParameters(D,j.state,xt,N,q),Bt=tt.getProgramCacheKey(Ut);let jt=J.programs;J.environment=D.isMeshStandardMaterial?N.environment:null,J.fog=N.fog,J.envMap=(D.isMeshStandardMaterial?z:T).get(D.envMap||J.environment),jt===void 0&&(D.addEventListener("dispose",ut),jt=new Map,J.programs=jt);let Vt=jt.get(Bt);if(Vt!==void 0){if(J.currentProgram===Vt&&J.lightsStateVersion===Ct)return ko(D,Ut),Vt}else Ut.uniforms=tt.getUniforms(D),D.onBuild(q,Ut,M),D.onBeforeCompile(Ut,M),Vt=tt.acquireProgram(Ut,Bt),jt.set(Bt,Vt),J.uniforms=Ut.uniforms;const Yt=J.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(Yt.clippingPlanes=qt.uniform),ko(D,Ut),J.needsLights=Xt(D),J.lightsStateVersion=Ct,J.needsLights&&(Yt.ambientLightColor.value=j.state.ambient,Yt.lightProbe.value=j.state.probe,Yt.directionalLights.value=j.state.directional,Yt.directionalLightShadows.value=j.state.directionalShadow,Yt.spotLights.value=j.state.spot,Yt.spotLightShadows.value=j.state.spotShadow,Yt.rectAreaLights.value=j.state.rectArea,Yt.ltc_1.value=j.state.rectAreaLTC1,Yt.ltc_2.value=j.state.rectAreaLTC2,Yt.pointLights.value=j.state.point,Yt.pointLightShadows.value=j.state.pointShadow,Yt.hemisphereLights.value=j.state.hemi,Yt.directionalShadowMap.value=j.state.directionalShadowMap,Yt.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Yt.spotShadowMap.value=j.state.spotShadowMap,Yt.spotLightMatrix.value=j.state.spotLightMatrix,Yt.spotLightMap.value=j.state.spotLightMap,Yt.pointShadowMap.value=j.state.pointShadowMap,Yt.pointShadowMatrix.value=j.state.pointShadowMatrix),J.currentProgram=Vt,J.uniformsList=null,Vt}function Uo(D){if(D.uniformsList===null){const N=D.currentProgram.getUniforms();D.uniformsList=Sa.seqWithValue(N.seq,D.uniforms)}return D.uniformsList}function ko(D,N){const q=lt.get(D);q.outputColorSpace=N.outputColorSpace,q.batching=N.batching,q.instancing=N.instancing,q.instancingColor=N.instancingColor,q.skinning=N.skinning,q.morphTargets=N.morphTargets,q.morphNormals=N.morphNormals,q.morphColors=N.morphColors,q.morphTargetsCount=N.morphTargetsCount,q.numClippingPlanes=N.numClippingPlanes,q.numIntersection=N.numClipIntersection,q.vertexAlphas=N.vertexAlphas,q.vertexTangents=N.vertexTangents,q.toneMapping=N.toneMapping}function At(D,N,q,J,j){N.isScene!==!0&&(N=St),L.resetTextureUnits();const xt=N.fog,Ct=J.isMeshStandardMaterial?N.environment:null,Ut=E===null?M.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:xi,Bt=(J.isMeshStandardMaterial?z:T).get(J.envMap||Ct),jt=J.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Vt=!!q.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Yt=!!q.morphAttributes.position,ye=!!q.morphAttributes.normal,mn=!!q.morphAttributes.color;let ke=Ci;J.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(ke=M.toneMapping);const ti=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,me=ti!==void 0?ti.length:0,Jt=lt.get(J),sr=p.state.lights;if(nt===!0&&(dt===!0||D!==_)){const En=D===_&&J.id===A;qt.setState(J,D,En)}let xe=!1;J.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==sr.state.version||Jt.outputColorSpace!==Ut||j.isBatchedMesh&&Jt.batching===!1||!j.isBatchedMesh&&Jt.batching===!0||j.isInstancedMesh&&Jt.instancing===!1||!j.isInstancedMesh&&Jt.instancing===!0||j.isSkinnedMesh&&Jt.skinning===!1||!j.isSkinnedMesh&&Jt.skinning===!0||j.isInstancedMesh&&Jt.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&Jt.instancingColor===!1&&j.instanceColor!==null||Jt.envMap!==Bt||J.fog===!0&&Jt.fog!==xt||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==qt.numPlanes||Jt.numIntersection!==qt.numIntersection)||Jt.vertexAlphas!==jt||Jt.vertexTangents!==Vt||Jt.morphTargets!==Yt||Jt.morphNormals!==ye||Jt.morphColors!==mn||Jt.toneMapping!==ke||kt.isWebGL2===!0&&Jt.morphTargetsCount!==me)&&(xe=!0):(xe=!0,Jt.__version=J.version);let ki=Jt.currentProgram;xe===!0&&(ki=Qn(J,N,j));let Xc=!1,Ys=!1,or=!1;const Ve=ki.getUniforms(),zi=Jt.uniforms;if(Y.useProgram(ki.program)&&(Xc=!0,Ys=!0,or=!0),J.id!==A&&(A=J.id,Ys=!0),Xc||_!==D){Ve.setValue(X,"projectionMatrix",D.projectionMatrix),Ve.setValue(X,"viewMatrix",D.matrixWorldInverse);const En=Ve.map.cameraPosition;En!==void 0&&En.setValue(X,Lt.setFromMatrixPosition(D.matrixWorld)),kt.logarithmicDepthBuffer&&Ve.setValue(X,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&Ve.setValue(X,"isOrthographic",D.isOrthographicCamera===!0),_!==D&&(_=D,Ys=!0,or=!0)}if(j.isSkinnedMesh){Ve.setOptional(X,j,"bindMatrix"),Ve.setOptional(X,j,"bindMatrixInverse");const En=j.skeleton;En&&(kt.floatVertexTextures?(En.boneTexture===null&&En.computeBoneTexture(),Ve.setValue(X,"boneTexture",En.boneTexture,L)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}j.isBatchedMesh&&(Ve.setOptional(X,j,"batchingTexture"),Ve.setValue(X,"batchingTexture",j._matricesTexture,L));const ar=q.morphAttributes;if((ar.position!==void 0||ar.normal!==void 0||ar.color!==void 0&&kt.isWebGL2===!0)&&$.update(j,q,ki),(Ys||Jt.receiveShadow!==j.receiveShadow)&&(Jt.receiveShadow=j.receiveShadow,Ve.setValue(X,"receiveShadow",j.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(zi.envMap.value=Bt,zi.flipEnvMap.value=Bt.isCubeTexture&&Bt.isRenderTargetTexture===!1?-1:1),Ys&&(Ve.setValue(X,"toneMappingExposure",M.toneMappingExposure),Jt.needsLights&&gt(zi,or),xt&&J.fog===!0&&it.refreshFogUniforms(zi,xt),it.refreshMaterialUniforms(zi,J,G,F,Mt),Sa.upload(X,Uo(Jt),zi,L)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(Sa.upload(X,Uo(Jt),zi,L),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&Ve.setValue(X,"center",j.center),Ve.setValue(X,"modelViewMatrix",j.modelViewMatrix),Ve.setValue(X,"normalMatrix",j.normalMatrix),Ve.setValue(X,"modelMatrix",j.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){const En=J.uniformsGroups;for(let rr=0,ad=En.length;rr<ad;rr++)if(kt.isWebGL2){const qc=En[rr];te.update(qc,ki),te.bind(qc,ki)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ki}function gt(D,N){D.ambientLightColor.needsUpdate=N,D.lightProbe.needsUpdate=N,D.directionalLights.needsUpdate=N,D.directionalLightShadows.needsUpdate=N,D.pointLights.needsUpdate=N,D.pointLightShadows.needsUpdate=N,D.spotLights.needsUpdate=N,D.spotLightShadows.needsUpdate=N,D.rectAreaLights.needsUpdate=N,D.hemisphereLights.needsUpdate=N}function Xt(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(D,N,q){lt.get(D.texture).__webglTexture=N,lt.get(D.depthTexture).__webglTexture=q;const J=lt.get(D);J.__hasExternalTextures=!0,J.__hasExternalTextures&&(J.__autoAllocateDepthBuffer=q===void 0,J.__autoAllocateDepthBuffer||Tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),J.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(D,N){const q=lt.get(D);q.__webglFramebuffer=N,q.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(D,N=0,q=0){E=D,b=N,w=q;let J=!0,j=null,xt=!1,Ct=!1;if(D){const Bt=lt.get(D);Bt.__useDefaultFramebuffer!==void 0?(Y.bindFramebuffer(X.FRAMEBUFFER,null),J=!1):Bt.__webglFramebuffer===void 0?L.setupRenderTarget(D):Bt.__hasExternalTextures&&L.rebindTextures(D,lt.get(D.texture).__webglTexture,lt.get(D.depthTexture).__webglTexture);const jt=D.texture;(jt.isData3DTexture||jt.isDataArrayTexture||jt.isCompressedArrayTexture)&&(Ct=!0);const Vt=lt.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(Vt[N])?j=Vt[N][q]:j=Vt[N],xt=!0):kt.isWebGL2&&D.samples>0&&L.useMultisampledRTT(D)===!1?j=lt.get(D).__webglMultisampledFramebuffer:Array.isArray(Vt)?j=Vt[q]:j=Vt,y.copy(D.viewport),C.copy(D.scissor),P=D.scissorTest}else y.copy(H).multiplyScalar(G).floor(),C.copy(et).multiplyScalar(G).floor(),P=ct;if(Y.bindFramebuffer(X.FRAMEBUFFER,j)&&kt.drawBuffers&&J&&Y.drawBuffers(D,j),Y.viewport(y),Y.scissor(C),Y.setScissorTest(P),xt){const Bt=lt.get(D.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+N,Bt.__webglTexture,q)}else if(Ct){const Bt=lt.get(D.texture),jt=N||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,Bt.__webglTexture,q||0,jt)}A=-1},this.readRenderTargetPixels=function(D,N,q,J,j,xt,Ct){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ut=lt.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Ct!==void 0&&(Ut=Ut[Ct]),Ut){Y.bindFramebuffer(X.FRAMEBUFFER,Ut);try{const Bt=D.texture,jt=Bt.format,Vt=Bt.type;if(jt!==Ee&&mt.convert(jt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Yt=Vt===Ri&&(Tt.has("EXT_color_buffer_half_float")||kt.isWebGL2&&Tt.has("EXT_color_buffer_float"));if(Vt!==de&&mt.convert(Vt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Vt===di&&(kt.isWebGL2||Tt.has("OES_texture_float")||Tt.has("WEBGL_color_buffer_float")))&&!Yt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=D.width-J&&q>=0&&q<=D.height-j&&X.readPixels(N,q,J,j,mt.convert(jt),mt.convert(Vt),xt)}finally{const Bt=E!==null?lt.get(E).__webglFramebuffer:null;Y.bindFramebuffer(X.FRAMEBUFFER,Bt)}}},this.copyFramebufferToTexture=function(D,N,q=0){const J=Math.pow(2,-q),j=Math.floor(N.image.width*J),xt=Math.floor(N.image.height*J);L.setTexture2D(N,0),X.copyTexSubImage2D(X.TEXTURE_2D,q,0,0,D.x,D.y,j,xt),Y.unbindTexture()},this.copyTextureToTexture=function(D,N,q,J=0){const j=N.image.width,xt=N.image.height,Ct=mt.convert(q.format),Ut=mt.convert(q.type);L.setTexture2D(q,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,q.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,q.unpackAlignment),N.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,J,D.x,D.y,j,xt,Ct,Ut,N.image.data):N.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,J,D.x,D.y,N.mipmaps[0].width,N.mipmaps[0].height,Ct,N.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,J,D.x,D.y,Ct,Ut,N.image),J===0&&q.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),Y.unbindTexture()},this.copyTextureToTexture3D=function(D,N,q,J,j=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const xt=D.max.x-D.min.x+1,Ct=D.max.y-D.min.y+1,Ut=D.max.z-D.min.z+1,Bt=mt.convert(J.format),jt=mt.convert(J.type);let Vt;if(J.isData3DTexture)L.setTexture3D(J,0),Vt=X.TEXTURE_3D;else if(J.isDataArrayTexture||J.isCompressedArrayTexture)L.setTexture2DArray(J,0),Vt=X.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,J.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,J.unpackAlignment);const Yt=X.getParameter(X.UNPACK_ROW_LENGTH),ye=X.getParameter(X.UNPACK_IMAGE_HEIGHT),mn=X.getParameter(X.UNPACK_SKIP_PIXELS),ke=X.getParameter(X.UNPACK_SKIP_ROWS),ti=X.getParameter(X.UNPACK_SKIP_IMAGES),me=q.isCompressedTexture?q.mipmaps[j]:q.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,me.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,me.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,D.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,D.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,D.min.z),q.isDataTexture||q.isData3DTexture?X.texSubImage3D(Vt,j,N.x,N.y,N.z,xt,Ct,Ut,Bt,jt,me.data):q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(Vt,j,N.x,N.y,N.z,xt,Ct,Ut,Bt,me.data)):X.texSubImage3D(Vt,j,N.x,N.y,N.z,xt,Ct,Ut,Bt,jt,me),X.pixelStorei(X.UNPACK_ROW_LENGTH,Yt),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,ye),X.pixelStorei(X.UNPACK_SKIP_PIXELS,mn),X.pixelStorei(X.UNPACK_SKIP_ROWS,ke),X.pixelStorei(X.UNPACK_SKIP_IMAGES,ti),j===0&&J.generateMipmaps&&X.generateMipmap(Vt),Y.unbindTexture()},this.initTexture=function(D){D.isCubeTexture?L.setTextureCube(D,0):D.isData3DTexture?L.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?L.setTexture2DArray(D,0):L.setTexture2D(D,0),Y.unbindTexture()},this.resetState=function(){b=0,w=0,E=null,Y.reset(),Ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Tc?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===Za?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Oe?es:ju}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===es?Oe:xi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Bv extends pf{}Bv.prototype.isWebGL1Renderer=!0;class er extends pn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Ye extends dn{constructor(t=null,e=1,n=1,i,o,a,r,c,l=ie,h=ie,u,f){super(null,a,r,c,l,h,i,o,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ne extends Le{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const bs=new se,gh=new se,oa=[],vh=new bn,Wv=new se,eo=new _e,no=new Di;class Uc extends _e{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ne(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Wv)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new bn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bs),vh.copy(t.boundingBox).applyMatrix4(bs),this.boundingBox.union(vh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Di),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bs),no.copy(t.boundingSphere).applyMatrix4(bs),this.boundingSphere.union(no)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(eo.geometry=this.geometry,eo.material=this.material,eo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),no.copy(this.boundingSphere),no.applyMatrix4(n),t.ray.intersectsSphere(no)!==!1))for(let o=0;o<i;o++){this.getMatrixAt(o,bs),gh.multiplyMatrices(n,bs),eo.matrixWorld=gh,eo.raycast(t,oa);for(let a=0,r=oa.length;a<r;a++){const c=oa[a];c.instanceId=o,c.object=this,e.push(c)}oa.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ne(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Gv extends Ro{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Gt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const xh=new se,dc=new Rc,aa=new Di,ra=new B;class Hv extends pn{constructor(t=new cn,e=new Gv){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,o=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),aa.copy(n.boundingSphere),aa.applyMatrix4(i),aa.radius+=o,t.ray.intersectsSphere(aa)===!1)return;xh.copy(i).invert(),dc.copy(t.ray).applyMatrix4(xh);const r=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,a.start),m=Math.min(l.count,a.start+a.count);for(let g=f,x=m;g<x;g++){const p=l.getX(g);ra.fromBufferAttribute(u,p),Mh(ra,p,c,i,t,e,this)}}else{const f=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let g=f,x=m;g<x;g++)ra.fromBufferAttribute(u,g),Mh(ra,g,c,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=i.length;o<a;o++){const r=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}}function Mh(s,t,e,n,i,o,a){const r=dc.distanceSqToPoint(s);if(r<e){const c=new B;dc.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;o.push({distance:l,distanceToRay:Math.sqrt(r),point:c,index:t,face:null,object:a})}}class kc extends cn{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const o=[],a=[];r(i),l(n),h(),this.setAttribute("position",new Ae(o,3)),this.setAttribute("normal",new Ae(o.slice(),3)),this.setAttribute("uv",new Ae(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function r(v){const M=new B,S=new B,b=new B;for(let w=0;w<e.length;w+=3)m(e[w+0],M),m(e[w+1],S),m(e[w+2],b),c(M,S,b,v)}function c(v,M,S,b){const w=b+1,E=[];for(let A=0;A<=w;A++){E[A]=[];const _=v.clone().lerp(S,A/w),y=M.clone().lerp(S,A/w),C=w-A;for(let P=0;P<=C;P++)P===0&&A===w?E[A][P]=_:E[A][P]=_.clone().lerp(y,P/C)}for(let A=0;A<w;A++)for(let _=0;_<2*(w-A)-1;_++){const y=Math.floor(_/2);_%2===0?(f(E[A][y+1]),f(E[A+1][y]),f(E[A][y])):(f(E[A][y+1]),f(E[A+1][y+1]),f(E[A+1][y]))}}function l(v){const M=new B;for(let S=0;S<o.length;S+=3)M.x=o[S+0],M.y=o[S+1],M.z=o[S+2],M.normalize().multiplyScalar(v),o[S+0]=M.x,o[S+1]=M.y,o[S+2]=M.z}function h(){const v=new B;for(let M=0;M<o.length;M+=3){v.x=o[M+0],v.y=o[M+1],v.z=o[M+2];const S=p(v)/2/Math.PI+.5,b=d(v)/Math.PI+.5;a.push(S,1-b)}g(),u()}function u(){for(let v=0;v<a.length;v+=6){const M=a[v+0],S=a[v+2],b=a[v+4],w=Math.max(M,S,b),E=Math.min(M,S,b);w>.9&&E<.1&&(M<.2&&(a[v+0]+=1),S<.2&&(a[v+2]+=1),b<.2&&(a[v+4]+=1))}}function f(v){o.push(v.x,v.y,v.z)}function m(v,M){const S=v*3;M.x=t[S+0],M.y=t[S+1],M.z=t[S+2]}function g(){const v=new B,M=new B,S=new B,b=new B,w=new Ht,E=new Ht,A=new Ht;for(let _=0,y=0;_<o.length;_+=9,y+=6){v.set(o[_+0],o[_+1],o[_+2]),M.set(o[_+3],o[_+4],o[_+5]),S.set(o[_+6],o[_+7],o[_+8]),w.set(a[y+0],a[y+1]),E.set(a[y+2],a[y+3]),A.set(a[y+4],a[y+5]),b.copy(v).add(M).add(S).divideScalar(3);const C=p(b);x(w,y+0,v,C),x(E,y+2,M,C),x(A,y+4,S,C)}}function x(v,M,S,b){b<0&&v.x===1&&(a[M]=v.x-1),S.x===0&&S.z===0&&(a[M]=b/2/Math.PI+.5)}function p(v){return Math.atan2(v.z,-v.x)}function d(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kc(t.vertices,t.indices,t.radius,t.details)}}class zc extends kc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new zc(t.radius,t.detail)}}class Po extends cn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Vv{constructor(t,e,n=0,i=1/0){this.ray=new Rc(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Lc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return pc(t,this,n,e),n.sort(_h),n}intersectObjects(t,e=!0,n=[]){for(let i=0,o=t.length;i<o;i++)pc(t[i],this,n,e);return n.sort(_h),n}}function _h(s,t){return s.distance-t.distance}function pc(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let o=0,a=i.length;o<a;o++)pc(i[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ec}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ec);const io=s=>Number.isInteger(s)?s.toFixed(1):String(s),Vn={loi:1,pond:24,other:48,max:63},$v=.5,mf=-.6,Xv=.5625,He=`
#define PI 3.14159265
#define NEAR_E ${io(So)}
#define NORMAL_E ${io(Lu)}
#define SLOTS ${Gn}
#define PATCHES ${zs}
#define DIST_PATCHES ${jn}
#define DIST_POND ${Vn.pond}
#define DIST_OTHER ${Vn.other}
#define DIST_FILL ${io($v)}
#define DIST_POND_LEVEL ${io(mf)}
#define DIST_BASE ${io(Xv)}
`,Do=`
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
`,ln=`
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
`,Fc=`
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
`,yh=Array.from({length:Gn},(s,t)=>t),os=`
${Fc}
${yh.map(s=>`uniform sampler2D uSlotH${s};`).join(`
`)}
float slotMetres(int s, vec2 xz) {
  // (samplers can only be picked by a constant index; the patches are laid
  // on whichever it was once, so the loop is compiled once, not per slot)
  float h = -4000.0;
${yh.map(s=>`  ${s?"else ":""}if (s == ${s}) h = rectMetres(uSlotH${s}, uSlotRect[${s}], xz);`).join(`
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
`,qs=`
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
`,qv=`
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
`,jv=`
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
`,gf=.05,vf=`
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
`,xf=`
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
`,Yv=`
${He}
${ln}
${Fc}
${vf}
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
`,Kv=`
${He}
${Do}
${ln}
${Fc}
${vf}
${qs}
${qv}
${jv}
${xf}
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
  if (metres < -${gf.toFixed(2)}) discard;
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
`,Zv=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Nc(){const s=new cn;return s.setAttribute("position",new Le(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const Jv=`
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
`;class Qv{constructor(t){this.renderer=t,this.size=new Ht;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?Ri:de,this.sceneRT=new Zn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new Ic(1,1,fi),this.quad=new _e(Nc(),new Te({vertexShader:Zv,fragmentShader:Jv,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Ht},uInvProj:{value:new se},uCamWorld:{value:new se},uCamPos:{value:new B},uSunDir:{value:new B(0,1,0)},uSunColor:{value:new Gt},uFogColor:{value:new Gt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new er,this.quadScene.add(this.quad),this.quadCam=new Qa(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const tx=`
${He}
${ln}
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
`;class ex{constructor(t,e=1024,n=tx){const{W:i,H:o}=t,a=Math.min(1,e/Math.max(i,o)),r=Math.max(16,Math.round(i*a)),c=Math.max(16,Math.round(o*a));this.terrain=t,this.rt=new Zn(r,c,{type:de,format:Li,depthBuffer:!1,minFilter:Be,magFilter:Be});const l=t.pack.rect;this.uniforms={...t.uniforms,uSunDir:{value:new B(0,1,0)},uStep:{value:Math.max((l.x1-l.x0)/r,(l.z1-l.z0)/c)},uTop:{value:1}},this.material=new Te({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:n,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new er;const h=new _e(Nc(),this.material);h.frustumCulled=!1,this.scene.add(h),this.cam=new Qa(-1,1,1,-1,0,1),this.h=c,this.strips=4,this.strip=-1,this.drawn={sun:new B(0,-2,0),vert:-1,k:-1}}get texture(){return this.rt.texture}update(t,e,n,i,o){const a=this.uniforms,r=this.drawn;if(this.strip<0){if(!(e.angleTo(r.sun)>.004||Math.abs(n-r.vert)>r.vert*.015||Math.abs(i-r.k)>.03))return;if(a.uSunDir.value.copy(e),a.uTop.value=o,r.sun.copy(e),r.vert=n,r.k=i,!this.ever)return this.ever=!0,this.draw(t,-1);this.strip=0}this.draw(t,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e){const n=this.rt;if(e>=0){const o=Math.ceil(this.h/this.strips);n.scissor.set(0,e*o,n.width,o),n.scissorTest=!0}else n.scissorTest=!1;const i=t.getRenderTarget();t.setRenderTarget(n),t.render(this.scene,this.cam),t.setRenderTarget(i),n.scissorTest=!1}dispose(){this.rt.dispose(),this.material.dispose()}}const Fr=32,wh=1600,bh=-.5;function Mf(s,t,e){const n=new Ye(s,t,e,Li,di);return n.minFilter=ie,n.magFilter=ie,n.wrapS=n.wrapT=on,n.needsUpdate=!0,n}function Sh(s,t,e,n=1){const i=new Ye(s,t,e,Ee,de);return i.minFilter=ns,i.magFilter=Be,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=on,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class mc{constructor(t,e,n=null,i={}){this.pack=t,this.world=e;const o=t.data,{W:a,H:r}=t,{x0:c,z0:l,x1:h,z1:u}=t.rect;this.rect=new ee(c,l,h,u),this.heights=o.metres,this.W=a,this.H=r;const f=e.app.renderer.capabilities.getMaxAnisotropy();this.heightTex=Mf(o.metres,a,r),this.normalTex=Sh(o.normals,a,r,Math.min(8,f)),this.landTex=Sh(o.land,a,r,Math.min(4,f)),o.normals=null,o.land=null;const m=Math.max((h-c)/a,(u-l)/r);this.texel=m;const g=Math.max(h-c,u-l);this.levels=Math.max(1,Math.ceil(Math.log2(g/(Fr*m)))+1),this.leafSize=g/2**(this.levels-1),this.buildMinMax(Array.isArray(n)?n:n?[n]:[]),this.full=this.makeGrid(Fr),this.half=this.makeGrid(Fr/2),this.morph=[];for(let d=0;d<12;d++)this.morph.push(new Ht);const x=e.uniforms,p=(Array.isArray(n)?null:n)||e.arch||this;this.uniforms={...x,uOwnH:{value:this.heightTex},uOwnRect:{value:this.rect},uOwnN:{value:this.normalTex},uOwnL:{value:this.landTex},uArchN:{value:p.normalTex},uArchL:{value:p.landTex},uOwnS:{value:null},uOwnLandA:{value:null},uOwnLandB:{value:null},uSelf:{value:-1},uOwnRain:{value:n&&!t.rainUrl?0:1},uMorph:{value:this.morph},uCamPos:{value:new B},uKau:{value:.5},uDebug:{value:0},...i.uniforms},this.group=new We;for(const d of[this.full,this.half])d.material=new Te({vertexShader:i.vertexShader||Yv,fragmentShader:i.fragmentShader||Kv,uniforms:{...this.uniforms,uGrid:{value:d.dim}}}),d.mesh=new _e(d.geometry,d.material),d.mesh.frustumCulled=!1,d.mesh.matrixAutoUpdate=!1,this.group.add(d.mesh);this.shadow=new ex(this,i.shadowSize,i.shadowFragment),this.uniforms.uOwnS.value=this.shadow.texture,this._frustum=new Ii,this._m=new se,this._box=new bn,this.rangeK=3.5,this.applyRange(this.rangeK)}makeGrid(t){const e=new Po,n=new Float32Array((t+1)*(t+1)*3);for(let r=0;r<=t;r++)for(let c=0;c<=t;c++){const l=(r*(t+1)+c)*3;n[l]=c/t,n[l+2]=r/t}const i=[];for(let r=0;r<t;r++)for(let c=0;c<t;c++){const l=r*(t+1)+c,h=l+1,u=l+t+1,f=u+1;c+r&1?i.push(l,u,h,h,u,f):i.push(l,u,f,l,f,h)}e.setIndex(i),e.setAttribute("position",new Le(n,3));const o=new Float32Array(wh*4),a=new Ne(o,4);return a.setUsage(wn),e.setAttribute("aNode",a),e.instanceCount=0,{dim:t,geometry:e,data:o,attr:a,count:0}}buildMinMax(t){const{W:e,H:n,heights:i}=this,o=this.pack.rect,a=2**(this.levels-1),r=this.leafSize,c=e/(o.x1-o.x0),l=n/(o.z1-o.z0);let h=new Float32Array(a*a).fill(1/0),u=new Float32Array(a*a).fill(-1/0);for(let m=0;m<a;m++){const g=m*r;if(g>=o.z1-o.z0)continue;const x=Math.max(0,Math.floor(g*l)-1),p=Math.min(n-1,Math.ceil((g+r)*l)+1);for(let d=0;d<a;d++){const v=d*r;if(v>=o.x1-o.x0)continue;const M=Math.max(0,Math.floor(v*c)-1),S=Math.min(e-1,Math.ceil((v+r)*c)+1);let b=1/0,w=-1/0;for(let E=x;E<=p;E++)for(let A=M;A<=S;A++){const _=i[E*e+A];_<b&&(b=_),_>w&&(w=_)}if(t.length){const E=Math.max(2,Math.round((p-x)/16));for(const A of t)for(let _=x;_<=p;_+=E)for(let y=M;y<=S;y+=E){const C=A.metresAt(o.x0+(y+.5)/c,o.z0+(_+.5)/l);C<b&&(b=C),C>w&&(w=C)}b-=40,w+=40}h[m*a+d]=b,u[m*a+d]=w}}this.mm=[{lo:h,hi:u,n:a}];let f=a;for(;f>1;){const m=f/2,g=new Float32Array(m*m),x=new Float32Array(m*m);for(let p=0;p<m;p++)for(let d=0;d<m;d++){const v=2*p*f+2*d;g[p*m+d]=Math.min(h[v],h[v+1],h[v+f],h[v+f+1]),x[p*m+d]=Math.max(u[v],u[v+1],u[v+f],u[v+f+1])}h=g,u=x,f=m,this.mm.push({lo:h,hi:u,n:f})}}metresAt(t,e){const n=this.pack.rect,{W:i,H:o,heights:a}=this;let r=(t-n.x0)/(n.x1-n.x0)*i-.5,c=(e-n.z0)/(n.z1-n.z0)*o-.5;r<0?r=0:r>i-1.001&&(r=i-1.001),c<0?c=0:c>o-1.001&&(c=o-1.001);const l=r|0,h=c|0,u=r-l,f=c-h,m=h*i+l,g=a[m]+(a[m+1]-a[m])*u,x=a[m+i]+(a[m+i+1]-a[m+i])*u;return g+(x-g)*f}applyRange(t){this.rangeK=t;const e=t*this.leafSize;this.ranges=[];for(let n=0;n<this.levels;n++)this.ranges.push(e*2**n);this.ranges[this.levels-1]=1e9;for(let n=0;n<this.levels;n++){const i=this.ranges[n],o=n>0?this.ranges[n-1]:0;this.morph[n].set(o+(i-o)*.5,i*.97)}}setSelf(t){this.uniforms.uSelf.value=t;for(const e of[this.full,this.half])e.material.uniforms.uSelf.value=t}update(t,e){this.group.visible=e,this.full.count=0,this.half.count=0,e&&(this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.vert=this.world.uniforms.uVert.value,this.uniforms.uCamPos.value.copy(t.position),this.select(0,0,this.levels-1));for(const n of[this.full,this.half])n.geometry.instanceCount=n.count,n.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],o=this.leafSize*2**n,a=this.pack.rect.x0+t*o,r=this.pack.rect.z0+e*o,c=this.vert,l=Math.min(0,i.lo[e*i.n+t])*c-.3,h=Math.max(0,i.hi[e*i.n+t])*c+.1;return this._box.min.set(a,l,r),this._box.max.set(a+o,h,r+o),this._box}select(t,e,n){const i=this.mm[n];if(!(i.hi[e*i.n+t]>=bh))return!0;const a=this.nodeBox(t,e,n);if(a.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(a))return!0;const r=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,r,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,r,n),!0;for(let c=0;c<4;c++){const l=t*2+(c&1),h=e*2+(c>>1);if(!this.select(l,h,n-1)){const u=this.mm[n-1];if(!(u.hi[h*u.n+l]>=bh))continue;const f=this.nodeBox(l,h,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,l,h,r/2,n)}}return!0}emit(t,e,n,i,o){if(t.count>=wh)return;const a=t.count*4;t.data[a]=this.pack.rect.x0+e*i,t.data[a+1]=this.pack.rect.z0+n*i,t.data[a+2]=i,t.data[a+3]=o,t.count++}dispose(){for(const t of[this.full,this.half])t.geometry.dispose(),t.material.dispose();this.shadow.dispose(),this.heightTex.dispose(),this.normalTex.dispose(),this.landTex.dispose()}}const nx=["raise","lower"];async function ix(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}function _f(s,t,e=console.warn,n=null){const i=(s==null?void 0:s.id)||(s==null?void 0:s.keyframe)||(s==null?void 0:s.file)||"?",o=(s==null?void 0:s.kind)??"lower";if(!nx.includes(o))return e(`patch ${i}: kind "${o}" is neither raise nor lower; not drawn`),null;if(!Number.isFinite(s.until))return e(`patch ${i}: no until year; not drawn`),null;if(!s.file)return e(`patch ${i}: no mask file; not drawn`),null;const a=Array.isArray(s.size)&&s.size.length===2&&s.size.every(r=>Number.isInteger(r)&&r>0)?s.size:null;return{id:String(i),pack:s.pack??n,kind:o,depth:Number.isFinite(s.depth)?s.depth:-1,until:s.until,url:t(s.file),size:a,note:s.note||""}}async function sx(s,t=console.warn){const e=new URL(s,location.href),n=a=>new URL(a,e).href;let i;try{i=await ix(n("patches/manifest.json"))}catch{return[]}const o=[];for(const a of(i==null?void 0:i.patches)||[]){if(!(a!=null&&a.pack)){t(`patch ${(a==null?void 0:a.id)??"?"}: no pack; not drawn`);continue}const r=_f(a,n,t);r&&o.push(r)}return o}async function yf(s){const{px:t,W:e,H:n}=await Kn(s),i=new Uint8Array(e*n);for(let o=0,a=0;o<i.length;o++,a+=4)i[o]=t[a];return{grey:i,W:e,H:n}}function ox(s,t,e,n,i){if(t===n&&e===i)return s;const o=new Uint8Array(n*i);for(let a=0;a<i;a++){const r=Math.min(e-1,Math.max(0,(a+.5)/i*e-.5)),c=Math.floor(r),l=Math.min(e-1,c+1),h=r-c;for(let u=0;u<n;u++){const f=Math.min(t-1,Math.max(0,(u+.5)/n*t-.5)),m=Math.floor(f),g=Math.min(t-1,m+1),x=f-m,p=s[c*t+m]+(s[c*t+g]-s[c*t+m])*x,d=s[l*t+m]+(s[l*t+g]-s[l*t+m])*x;o[a*n+u]=Math.round(p+(d-p)*h)}}return o}function ax(s,t,e){let n=t,i=e,o=-1,a=-1;for(let h=0;h<e;h++){const u=h*t;for(let f=0;f<t;f++)s[u+f]&&(f<n&&(n=f),f>o&&(o=f),h<i&&(i=h),h>a&&(a=h))}if(o<0)return null;n=Math.max(0,n-1),i=Math.max(0,i-1),o=Math.min(t-1,o+1),a=Math.min(e-1,a+1);const r=o-n+1,c=a-i+1,l=new Uint8Array(r*c);for(let h=0;h<c;h++)l.set(s.subarray((i+h)*t+n,(i+h)*t+n+r),h*r);return{data:l,w:r,h:c,i0:n,j0:i}}async function rx(s,t=console.warn){const e=[];for(const n of s.masks||[])try{const i=await yf(n.url),[o,a]=n.size||[s.W,s.H];(i.W!==o||i.H!==a)&&t(`${n.url} is ${i.W}×${i.H}, the manifest says ${o}×${a}; read at its own size`),e.push(ox(i.grey,i.W,i.H,s.W,s.H))}catch(i){t(`${n.url}: ${i.message} (that patch is not drawn)`),e.push(new Uint8Array(s.W*s.H))}return e}function wf(){const s=new Ye(new Uint8Array(4),1,1,Li,de);return s.needsUpdate=!0,{uPatchMap:{value:s},uPatchBox:{value:Array.from({length:zs},()=>new ee(0,0,1,1))},uPatchUv:{value:Array.from({length:zs},()=>new ee(0,0,1,1))},uPatchInfo:{value:Array.from({length:zs},()=>new ee(0,-1,-1,0))},uSlotPatch:{value:Array.from({length:Gn},()=>new Ht(0,0))},uSlotPatchBox:{value:Array.from({length:Gn},()=>new ee(0,0,-1,-1))}}}function cx(s){const e=s.reduce((c,l)=>c+(l.w+1)*(l.h+1),0),n=Math.max(...s.map(c=>c.w))+2*1,i=Math.min(4096,Math.max(n,64,Math.ceil(Math.sqrt(e*1.25))));let o=1,a=1,r=0;for(const c of[...s].sort((l,h)=>h.h-l.h))o+c.w+1>i&&(o=1,a+=r+1,r=0),c.ax=o,c.ay=a,o+=c.w+1,r=Math.max(r,c.h);return{W:i,H:a+r+1}}class lx{constructor(t){this.app=t,this.world=t.world,this.u=t.world.uniforms,this.all=[],this.recs=[],this.byPack=new Map,this.loaded=!1,this.atlas=null,this.warned=!1,this.ready=new Promise(e=>this.resolveReady=e),this.slotKey=""}async load(t=this.app.params.get("patches")||this.app.data.base){var r;const e=this.app.warn,n=await sx(t,e),i=this.loaded;this.all=n,this.resolveReady(n),i&&((r=this.app.districts)==null||r.setPatches(n));const o=new Map(this.world.islandPacks.map(c=>[c.id,c])),a=[];for(const c of n){const l=o.get(c.pack);if(l)try{const h=await yf(c.url),[u,f]=c.size||[l.W,l.H];(h.W!==u||h.H!==f)&&e(`patch ${c.id}: ${c.url} is ${h.W}×${h.H}, the manifest says ${u}×${f}; drawn at its own size`);const m=ax(h.grey,h.W,h.H);if(!m){e(`patch ${c.id}: its mask marks nothing`);continue}const g=l.rect,x=(g.x1-g.x0)/h.W,p=(g.z1-g.z0)/h.H;a.push({...c,crop:m,box:[g.x0+m.i0*x,g.z0+m.j0*p,g.x0+(m.i0+m.w)*x,g.z0+(m.j0+m.h)*p],k:this.want(c),depthM:c.depth})}catch(h){e(`patch ${c.id}: ${h.message}`)}}return this.setRecs(a),this.loaded=!0,n}forPack(t){return this.all.filter(e=>e.pack===t)}setRecs(t){var e;(e=this.atlas)==null||e.dispose(),this.atlas=null,this.recs=t,this.byPack=new Map;for(const n of t)this.byPack.has(n.pack)||this.byPack.set(n.pack,[]),this.byPack.get(n.pack).push(n);for(const n of this.byPack.values())n.sort((i,o)=>i.kind===o.kind?0:i.kind==="raise"?-1:1);if(t.length){const{W:n,H:i}=cx(t.map(r=>r.crop)),o=new Uint8Array(n*i);for(const{crop:r}of t)for(let c=0;c<r.h;c++)o.set(r.data.subarray(c*r.w,(c+1)*r.w),(r.ay+c)*n+r.ax);const a=new Ye(o,n,i,Li,de);a.minFilter=a.magFilter=Be,a.wrapS=a.wrapT=on,a.generateMipmaps=!1,a.unpackAlignment=1,a.needsUpdate=!0,this.atlas=a,this.atlasSize=[n,i];for(const r of t){const c=r.crop;r.uv=[c.ax/n,c.ay/i,(c.ax+c.w)/n,(c.ay+c.h)/i]}}this.u.uPatchMap.value=this.atlas||wf().uPatchMap.value,this.slotKey="",this.write()}want(t,e=this.app.timeline.year){return e<t.until?1:0}update(t){if(!this.recs.length)return;const e=this.app.timeline.year,n=t>0?1-Math.exp(-t*Pu):1;for(const i of this.recs){const o=this.want(i,e);i.k+=(o-i.k)*n,Math.abs(o-i.k)<.002&&(i.k=o)}this.write()}settle(){this.update(0)}write(){const t=this.u,e=t.uPatchBox.value,n=t.uPatchUv.value,i=t.uPatchInfo.value,o=t.uSlotPatch.value,a=t.uSlotPatchBox.value;let r=0,c=0;this.world.slots.forEach((l,h)=>{const u=l&&this.byPack.get(l.pack.id)||[],f=r;let m=1/0,g=1/0,x=-1/0,p=-1/0;for(const d of u)if(!(d.k<=0)){if(r>=zs){c++;continue}e[r].set(...d.box),n[r].set(...d.uv),i[r].set(d.k,d.depthM,d.kind==="raise"?1:-1,0),r++,m=Math.min(m,d.box[0]),g=Math.min(g,d.box[1]),x=Math.max(x,d.box[2]),p=Math.max(p,d.box[3])}o[h].set(f,r-f),x>=m?a[h].set(m,g,x,p):a[h].set(0,0,-1,-1)}),c&&!this.warned&&(this.warned=!0,this.app.warn(`more than ${zs} patches on the islands in view; ${c} of them are not drawn`))}apply(t,e,n,i){const o=this.byPack.get(t);if(!o)return i;for(const a of o){if(a.k<=0)continue;const r=a.box,c=(e-r[0])/(r[2]-r[0]),l=(n-r[1])/(r[3]-r[1]);if(c<0||l<0||c>1||l>1)continue;const h=this.maskAt(a.crop,c,l)*a.k;h>0&&(i+=((a.kind==="raise"?Math.max(i,a.depthM):Math.min(i,a.depthM))-i)*h)}return i}maskAt(t,e,n){const i=e*t.w-.5,o=n*t.h-.5,a=Math.floor(i),r=Math.floor(o),c=i-a,l=o-r,h=(m,g)=>m<0||g<0||m>=t.w||g>=t.h?0:t.data[g*t.w+m],u=h(a,r)+(h(a+1,r)-h(a,r))*c,f=h(a,r+1)+(h(a+1,r+1)-h(a,r+1))*c;return(u+(f-u)*l)/255}stats(){return{loaded:this.loaded,listed:this.all.length,atlas:this.atlasSize||null,kB:this.atlasSize?Math.round(this.atlasSize[0]*this.atlasSize[1]/1024):0,islands:this.recs.map(t=>({id:t.id,pack:t.pack,kind:t.kind,depth:t.depthM,until:t.until,k:+t.k.toFixed(3),box:t.box.map(e=>+e.toFixed(3)),texels:t.crop.w*t.crop.h})),inSlots:this.u.uSlotPatch.value.map(t=>t.y)}}}const Eh=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};class hx{constructor(t,e){this.app=t,this.data=e,this.packs=e.packs,this.archPack=this.packs.find(a=>a.kind==="archipelago")||this.packs[0],this.islandPacks=this.packs.filter(a=>a!==this.archPack),this.group=new We,this.terrains=new Map,this.slots=new Array(Gn).fill(null),this.exag=Kc(5e3),this.noIslands=!1,this.forceK=null;const n=Mf(new Float32Array([-4e3]),1,1),i=new Ye(new Uint8Array(4),1,1,Ee,de);i.needsUpdate=!0,this.dummyAux=i;const o=a=>Array.from({length:a},()=>new ee(0,0,0,0));this.uniforms={uVert:{value:this.exag/100},uExag:{value:this.exag},uArchH:{value:n},uArchRect:{value:new ee(0,0,1,1)},uSlotRect:{value:Array.from({length:Gn},()=>new ee(0,0,1,1))},uSlotInfo:{value:Array.from({length:Gn},()=>new ee(0,0,1,0))},uDistRect:{value:new ee(0,0,1,1)},uDistInfo:{value:new ee(0,0,1,0)},uDistH:{value:n},uDistAux:{value:i},uDistCarve:{value:n},uDistPatch:{value:i},uDistPatchBox:{value:new ee(0,0,0,0)},uDistLower:{value:o(jn)},uDistRaise:{value:o(jn)},uDistRaiseTop:{value:-1e9},uFeatK:{value:o(16)},...wf()},this.district=null;for(let a=0;a<Gn;a++)this.uniforms[`uSlotH${a}`]={value:n};this._frustum=new Ii,this._m=new se,this._box=new bn,this.dummy=n}setArchipelago(t){const e=new mc(t,this);e.setSelf(-1),this.arch=e,this.terrains.set(t.id,e),this.group.add(e.group),this.uniforms.uArchH.value=e.heightTex,this.uniforms.uArchRect.value.copy(e.rect);const n=t.rect;this.bounds={x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1}}addIsland(t){const e=new mc(t,this,this.arch);e.k=0,e.want=0,e.slot=-1;const n=t.rect;return e.margin=Math.min(15,.08*Math.min(n.x1-n.x0,n.z1-n.z0)),e.group.visible=!1,this.terrains.set(t.id,e),this.group.add(e.group),e}get islands(){return[...this.terrains.values()].filter(t=>t!==this.arch)}wantFor(t,e){const n=t.pack.rect,i=e.position,o=Math.max(n.x0-i.x,0,i.x-n.x1),a=Math.max(n.z0-i.z,0,i.z-n.z1),r=Math.hypot(o,a,Math.max(1,i.y)),c=(innerHeight||800)/(2*Math.tan(e.fov*Math.PI/360)),l=this.arch.texel*c/r;t.score=l;const h=Math.max(1,t.pack.data.hi*this.uniforms.uVert.value);return this._box.min.set(n.x0,0,n.z0),this._box.max.set(n.x1,h,n.z1),this._frustum.intersectsBox(this._box)?Eh(1,2.4,l):0}update(t,e,n){var m,g,x;this.exag=Kc(e),this.uniforms.uExag.value=this.exag,this.uniforms.uVert.value=this.exag/100;const i=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const p of i)p.want=this.noIslands?0:this.wantFor(p,t);const o=i.filter(p=>p.want>0).sort((p,d)=>d.score-p.score),a=new Set(o.slice(0,Gn)),r=1-Math.exp(-n*2.5);for(const p of i){const d=a.has(p)?p.want:0;if(p.slot>=0)p.k+=(d-p.k)*r,Math.abs(d-p.k)<.004&&(p.k=d),p.k<=0&&d<=0&&this.release(p);else if(d>0){const v=this.slots.indexOf(null);v>=0&&this.assign(p,v)}}if(this.forceK!==null)for(const p of this.slots)p&&(p.k=this.forceK);if(this.noIslands)for(const p of this.slots)p&&this.release(p);const c=this.uniforms;for(let p=0;p<Gn;p++){const d=this.slots[p];c.uSlotInfo.value[p].set(d?d.k:0,d?1:0,d?d.margin:1,0)}(m=this.app.patches)==null||m.update(n),this.arch.update(t,!0);for(const p of i)p.update(t,p.slot>=0);(g=this.district)==null||g.update(t,e,n);const l=this.app.renderer,h=this.app.light.sunDir,u=this.uniforms.uVert.value,f=this.maxY+.1;this.arch.shadow.update(l,h,u,0,f);for(const p of i)p.slot>=0&&p.shadow.update(l,h,u,p.k,f);(x=this.district)==null||x.updateShadow(l,h,u,f)}settle(t){var i;const e=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const o of e)o.want=this.wantFor(o,t);const n=e.filter(o=>o.want>0).sort((o,a)=>a.score-o.score).slice(0,this.slots.length);for(const o of e)o.slot>=0&&!n.includes(o)&&this.release(o);for(const o of n){if(o.slot<0){const a=this.slots.indexOf(null);if(a<0)continue;this.assign(o,a)}o.k=o.want}(i=this.app.patches)==null||i.settle()}stats(){var n,i,o;const t={};for(const[a,r]of this.terrains)r.group.visible&&(t[a]=r.full.count+r.half.count);const e=(n=this.district)==null?void 0:n.cur;return(i=e==null?void 0:e.terrain)!=null&&i.group.visible&&(t[e.d.id]=e.terrain.full.count+e.terrain.half.count),{exag:+this.exag.toFixed(2),nodes:t,slots:this.slots.map(a=>a?`${a.pack.id}:${a.k.toFixed(2)}`:null),district:((o=this.district)==null?void 0:o.stats())??null}}assign(t,e){this.slots[e]=t,t.slot=e,t.k=0,t.setSelf(e),t.shadow.ever=!1,t.shadow.strip=-1,t.shadow.drawn.vert=-1,this.uniforms.uSlotRect.value[e].copy(t.rect),this.uniforms[`uSlotH${e}`].value=t.heightTex}release(t){const e=t.slot;e<0||(this.slots[e]=null,t.slot=-1,t.k=0,this.uniforms[`uSlotH${e}`].value=this.dummy,this.uniforms.uSlotInfo.value[e].set(0,0,1,0))}metresAt(t,e){var c;const n=this.arch;if(!n)return-4e3;const i=n.pack.rect;let o=t<i.x0||e<i.z0||t>i.x1||e>i.z1?-4e3:n.metresAt(t,e),a=null,r=0;for(const l of this.slots){if(!l)continue;const h=l.pack.rect,u=Math.min(t-h.x0,h.x1-t,e-h.z0,h.z1-e);u>r&&(r=u,a=l)}if(a){const l=a.k*Eh(0,a.margin,r);l>0&&(o+=(this.ownMetres(a,t,e)-o)*l)}return(c=this.district)!=null&&c.on?this.district.blend(t,e,o):o}ownMetres(t,e,n){const i=t.metresAt(e,n);return this.app.patches?this.app.patches.apply(t.pack.id,e,n,i):i}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.uniforms.uVert.value}get maxY(){let t=0;for(const e of this.terrains.values())t=Math.max(t,e.pack.data.hi);return t*this.uniforms.uVert.value}chainShape(){if(this._chain)return this._chain;const t=this.arch,e=48,n=[];let i=null,o=null;for(const c of this.islandPacks){const l=c.rect,h=[];for(let f=0;f<=e;f++)for(let m=0;m<=e;m++){const g=l.x0+(l.x1-l.x0)*m/e,x=l.z0+(l.z1-l.z0)*f/e;t.metresAt(g,x)>0&&h.push([g,x])}if(!h.length)continue;n.push(...h);const u=(l.x0+l.x1)/2;(!i||u<i.cx)&&(i={cx:u,own:h}),(!o||u>o.cx)&&(o={cx:u,own:h})}if(!n.length){const c=this.bounds,l=[[c.x0,c.z0],[c.x1,c.z0],[c.x1,c.z1],[c.x0,c.z1]];return this._chain={hull:l,from:l[0],to:l[2]}}const a=i.own.reduce((c,[l,h])=>[c[0]+l/i.own.length,c[1]+h/i.own.length],[0,0]),r=o.own.reduce((c,l)=>l[0]+l[1]>c[0]+c[1]?l:c);return this._chain={hull:ux(n),from:a,to:r}}islandAt(t,e){let n=null,i=0;for(const o of this.islands){const a=o.pack.rect,r=Math.min(t-a.x0,a.x1-t,e-a.z0,a.z1-e);r>i&&(i=r,n=o)}return n}setRange(t){var e,n,i;for(const o of this.terrains.values())o.applyRange(t);(i=(n=(e=this.district)==null?void 0:e.cur)==null?void 0:n.terrain)==null||i.applyRange(t)}setDebug(t){var n,i;for(const o of this.terrains.values())o.uniforms.uDebug.value=t;const e=(i=(n=this.district)==null?void 0:n.cur)==null?void 0:i.terrain;if(e)for(const o of[e.full,e.half])o.material.uniforms.uDebug.value=t}}function ux(s){const t=[...s].sort((o,a)=>o[0]-a[0]||o[1]-a[1]);if(t.length<3)return t;const e=(o,a,r)=>(a[0]-o[0])*(r[1]-o[1])-(a[1]-o[1])*(r[0]-o[0]),n=[];for(const o of t){for(;n.length>=2&&e(n.at(-2),n.at(-1),o)<=0;)n.pop();n.push(o)}const i=[];for(let o=t.length-1;o>=0;o--){const a=t[o];for(;i.length>=2&&e(i.at(-2),i.at(-1),a)<=0;)i.pop();i.push(a)}return n.slice(0,-1).concat(i.slice(0,-1))}const fx=`
${He}
${ln}
${os}
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
`,dx=`
${He}
${Do}
${ln}
${os}
${qs}
${xf}
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

  // --- the loʻi ------------------------------------------------------------
  // A paddy is a terrace (whole tau) and a column across the valley (whole
  // u); the banks (kuāuna) are where either turns over, a couple of metres of
  // grassy earth, the terrace's riser among them. Each paddy at its own stage:
  // most under taro from fresh huli to a full canopy, some just flooded and
  // bare, a few fallow. The tread is cut level, so it is lit level.
  float loi = y.loi * w;
  float waterK = 0.0;
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
    // the banks, antialiased, thinning to nothing as they get finer than a pixel
    float aaT = fwidth(y.tau);
    float aaU = fwidth(y.u);
    float dT = min(fract(y.tau), 1.0 - fract(y.tau));
    float dU = min(fract(y.u), 1.0 - fract(y.u));
    float wT = 0.07;
    float wU = 1.3 / 29.0;
    float bankT = (1.0 - smoothstep(wT - aaT, wT + aaT, dT)) * (1.0 - smoothstep(0.12, 0.35, aaT));
    float bankU = (1.0 - smoothstep(wU - aaU, wU + aaU, dU)) * (1.0 - smoothstep(0.08, 0.25, aaU));
    float bank = max(bankT, bankU * 0.85);
    vec3 bankC = srgb(vec3(0.38, 0.47, 0.22)) * (0.9 + 0.2 * h);
    col = mix(col, mix(paddyC, bankC, bank), loi);
    // what is left of the paddy is open water, lit as water below
    waterK = loi * (1.0 - bank) * (1.0 - fallow) * (1.0 - cover);
    // a tread lies level; a riser keeps the ground's fall and darkens on its shaded side
    vec2 g2 = mix(grad, vec2(0.0), y.loi * w * (1.0 - bankT));
    g2 += grad * bankT * y.loi * w * 1.5;
    n = normalize(vec3(-g2.x * uExag, 1.0, -g2.y * uExag));
  }

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
`,px=`
${He}
${ln}
${os}
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
`,ge=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};function mx(s,t,e){const n=t*e,i=new Uint8Array(n),o=new Int32Array(n).fill(-1),a=new Int32Array(n),r=new Float32Array(n);let c=0;const l=new Int32Array(n);let h=0;const u=v=>{let M=h++;const S=r[v];for(;M>0;){const b=M-1>>1;if(r[l[b]]<=S)break;l[M]=l[b],M=b}l[M]=v},f=()=>{const v=l[0],M=l[--h],S=r[M];let b=0;for(;;){let w=2*b+1;if(w>=h||(w+1<h&&r[l[w+1]]<r[l[w]]&&w++,r[l[w]]>=S))break;l[b]=l[w],b=w}return l[b]=M,v},m=new Int32Array(n);let g=0,x=0;for(let v=0;v<n;v++)s[v]<=0&&(i[v]=1);const p=[-1,1,0,0,-1,1,-1,1],d=[0,0,-1,1,-1,-1,1,1];for(let v=0;v<e;v++)for(let M=0;M<t;M++){const S=v*t+M;if(i[S])continue;let b=M===0||v===0||M===t-1||v===e-1,w=-1;for(let E=0;E<8&&!b;E++){const A=M+p[E],y=(v+d[E])*t+A;s[y]<=0&&(b=!0,w=y)}b&&(i[S]=1,o[S]=w,r[S]=s[S],u(S))}for(;h||g<x;){const v=g<x?m[g++]:f();a[c++]=v;const M=r[v],S=v%t,b=(v-S)/t;for(let w=0;w<8;w++){const E=S+p[w],A=b+d[w];if(E<0||A<0||E>=t||A>=e)continue;const _=A*t+E;i[_]||(i[_]=1,o[_]=v,s[_]<=M?(r[_]=M,m[x++]=_):(r[_]=s[_],u(_)))}g===x&&(g=x=0)}return{rec:o,order:a.subarray(0,c)}}function gx(s,t,e,n){const i=new Float32Array(t*e),{rec:o,order:a}=s;for(let r=0;r<a.length;r++)i[a[r]]=n;for(let r=a.length-1;r>=0;r--){const c=a[r],l=o[c];l>=0&&i[l]>0&&(i[l]+=i[c])}return i}function vx(s,t,e,n,i,o,a=.14){var p;const r=e*n,{rec:c}=s,l=new Uint8Array(r);for(let d=0;d<r;d++)t[d]>=i&&(l[d]=1);const h=new Uint8Array(r);for(let d=0;d<r;d++)l[d]&&c[d]>=0&&l[c[d]]&&(h[c[d]]=1);const u=new Uint8Array(r),f=[];for(let d=0;d<r;d++)l[d]&&!h[d]&&f.push(d);const m=new Float32Array(f.length);f.forEach((d,v)=>{let M=0;for(let S=d;S>=0&&l[S]&&M<1e6;S=c[S])M++;m[v]=M});const g=f.map((d,v)=>v).sort((d,v)=>m[v]-m[d]),x=[];for(const d of g){const v=[];let M=f[d];for(;M>=0&&l[M];){const b=M%e,w=(M-b)/e,[E,A]=o(b+.5,w+.5);if(v.push([E,A,t[M]]),u[M])break;u[M]=1,M=c[M]}if(M>=0&&!l[M]){const b=M%e,w=(M-b)/e,[E,A]=o(b+.5,w+.5);v.push([E,A,((p=v.at(-1))==null?void 0:p[2])??i])}if(v.length<3)continue;const S=Mx(xx(v,3),a);if(!(S.length<2)){x.push(S.length);for(const b of S)x.push(b[0],b[1],b[2])}}return new Float32Array(x)}function xx(s,t){const e=s.length,n=s.map(i=>i.slice());for(let i=1;i<e-1;i++){let o=0,a=0,r=0;const c=Math.min(t,i,e-1-i);for(let l=-c;l<=c;l++)o+=s[i+l][0],a+=s[i+l][1],r++;n[i][0]=o/r,n[i][1]=a/r}return n}function Mx(s,t){const e=[s[0]];let n=0;for(let o=0;o+1<s.length;o++){const a=s[o],r=s[o+1],c=Math.hypot(r[0]-a[0],r[1]-a[1]);let l=t-n;for(;l<c;){const h=l/c;e.push([a[0]+(r[0]-a[0])*h,a[1]+(r[1]-a[1])*h,a[2]+(r[2]-a[2])*h]),l+=t}n=c-(l-t)}const i=s[s.length-1];return Math.hypot(i[0]-e.at(-1)[0],i[1]-e.at(-1)[1])>t*.3&&e.push(i),e}function _x(s,t,e,n,i){const o=[];let a=1/0,r=-1/0;for(const h of n)for(let u=0;u+1<h.length;u++){const[f,m]=h[u],[g,x]=h[u+1];m!==x&&(o.push(m<x?[m,f,x,g]:[x,g,m,f]),a=Math.min(a,m,x),r=Math.max(r,m,x))}if(!o.length)return 0;const c=[];let l=0;for(let h=Math.max(0,Math.floor(a));h<=Math.min(e-1,Math.ceil(r));h++){const u=h+.5;c.length=0;for(const f of o)f[0]<=u&&f[2]>u&&c.push(f[1]+(u-f[0])/(f[2]-f[0])*(f[3]-f[1]));c.sort((f,m)=>f-m);for(let f=0;f+1<c.length;f+=2){const m=Math.max(0,Math.ceil(c[f]-.5)),g=Math.min(t-1,Math.floor(c[f+1]-.5));for(let x=m;x<=g;x++)s[h*t+x]=i,l++}}return l}function ca(s,t){let e=s*.1031%1,n=t*.1031%1;e<0&&(e+=1),n<0&&(n+=1);let i=e;const o=e*(n+33.33)+n*(i+33.33)+i*(e+33.33);e+=o,n+=o,i+=o;const a=(e+n)*i%1;return a<0?a+1:a}function gc(s,t){const e=Math.floor(s),n=Math.floor(t),i=s-e,o=t-n,a=i*i*(3-2*i),r=o*o*(3-2*o),c=ca(e,n),l=ca(e+1,n),h=ca(e,n+1),u=ca(e+1,n+1);return c+(l-c)*a+(h-c+(c-l+u-h)*a)*r}function ve(s,t=0,e=0){let n=Math.imul(s|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e|0,2246822519);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const bf=new Float32Array(1),yx=new Uint32Array(bf.buffer);function vo(s){bf[0]=s;const t=yx[0],e=t>>>16&32768;let n=(t>>>23&255)-127+15;const i=t&8388607;return n<=0?e:n>=31?e|31744:e|n<<10|i>>>13}function nr(s){const t=s>>>10&31,e=s&1023,n=s&32768?-1:1;return t===0?n*e*5960464477539063e-23:t===31?e?NaN:n*(1/0):n*(1+e/1024)*2**(t-15)}const wx=28,Oc=.5625,Nr=[22,36],Ah=3.5,Th=2.6,bx=32,Sx=.45,Or=[7,16];function Ex({index:s,inside:t,box:e,m:n,hs:i,cls:o,chanDist:a,aux:r,carve:c,W:l,mx:h,mz:u}){const{x0:f,y0:m,x1:g,y1:x}=e,p=g-f+1,d=x-m+1,v=hn(p,d,S=>!t[(m+Math.floor(S/p))*l+f+S%p],h,u),M=new Set;for(let S=m;S<=x;S++)for(let b=f;b<=g;b++){const w=S*l+b;if(!t[w]||n[w]<=.3)continue;const E=b*h,A=S*u,_=(gc(E/140+s*7.1,A/140)-.5)*24,y=ge(0,bx,v[(S-m)*p+(b-f)]+_),C=ge(Or[0],Or[1],a[w]);if(y*C<.02)continue;const P=o[w],I=Oc*2**P,R=i[w]/I,U=vo(R-64*Math.floor(R/64)),F=Sf(n[w],nr(U),P),G=Math.round(F/I-.5),W=F-n[w],K=W<0?ge(Ah+1,Ah,-W):ge(Th+1,Th,W),H=y*C*K;if(H<.02)continue;const et=(a[w]-Or[0])/Ax(G,P,s)+ve(s,G,P*7+2);M.add((P*4096+G)*4096+Math.floor(et)),r[w*4+1]=Math.round(255*H),r[w*4+2]=P,r[w*4+3]=s,c[w*2]=U,c[w*2+1]=vo(et)}return M.size}function Ax(s,t,e){return Nr[0]+(Nr[1]-Nr[0])*ve(e,s,t*7+1)}function Tx(s,t,e,n){let i=1/0,o=1/0,a=-1/0,r=-1/0;for(const c of s)for(const[l,h]of c)i=Math.min(i,l),o=Math.min(o,h),a=Math.max(a,l),r=Math.max(r,h);return{x0:Math.max(0,Math.floor(i)-n),y0:Math.max(0,Math.floor(o)-n),x1:Math.min(t-1,Math.ceil(a)+n),y1:Math.min(e-1,Math.ceil(r)+n)}}function Sf(s,t,e){const n=Oc*2**e,i=t+64*Math.floor((s/n-t)/64+.5);return(Math.floor(i)+.5)*n}const Ch=.346,Rh=.387,Lh=.436,Ph=.575,Dh=.702,Ds=["ohia","ohiaKrumm","koa","kukui","ohiaai","hau","hala","wiliwili","lama","aalii","niu","milo"],Zt=Object.fromEntries(Ds.map((s,t)=>[s,t])),so={ohiaDry:[1.48,1.41,1.8],ohiaWet:[.72,.75,.7],olapa:[1.32,1.46,1.17]},la=9;function Cx(s,t){let e=0;for(let i=0;i<t.length;i++)t[i]>0&&(e+=t[i]);if(e<=0)return-1;s*=e;let n=-1;for(let i=0;i<t.length;i++)if(!(t[i]<=0)&&(n=i,(s-=t[i])<0))return i;return n}function Rx({W:s,H:t,mx:e,mz:n,m:i,m1795:o,rain:a,normals:r,rip:c,tpi:l,chanDist:h,clear:u,patch:f,shore:m,toWorld:g,step:x}){const p=Ds.map(()=>[]),d=new Int32Array(Ds.length),v=new Float32Array(Ds.length),M=Math.floor(s*e/x),S=Math.floor(t*n/x);for(let b=0;b<S;b++)for(let w=0;w<M;w++){const E=(w+ve(w,b,11))*x,A=(b+ve(w,b,12))*x,_=Math.min(s-1,Math.floor(E/e)),y=Math.min(t-1,Math.floor(A/n)),C=y*s+_;if(f[C]>0||i[C]<1.2||o[C]<1.2||h[C]<9)continue;const P=i[C],I=a[C]/255+(ve(w,b,3)-.5)*.1,R=a[C]/255,U=r[C*4+1]/255*2-1,F=1-ge(.55,.75,U),G=P-Oa(l,_,y,4),W=Oa(c,_,y,4),K=Math.max(ge(.1,.3,W),ge(12,30,-G)),H=ge(10,30,G)*(1-ge(.05,.2,W)),et=ge(.94,.97,U)*ge(.25,.5,W),ct=R-(.22+43e-5*P),Q=ge(.5,.6,R),nt=1-ge(420-250*Q,760-430*Q,P+(ve(w,b,20)-.5)*120),dt=ge(.42,.6,gc(E/210+13.1,A/210+7.7)),Mt=ge(.6,.7,gc(E/190+41.3,A/190+3.9)),bt=1-ge(14,40,h[C]),Rt=P<670&&R>Ch?(1-ge(450,670,P))*(1-ge(Dh-.04,Dh+.02,R)):0,Lt=P<610?1:0,St=P<550&&I>Lh?et>.5?.8+4*Mt:.1+6*Mt:0,Ft=Math.max(ge(0,20,G),ge(300,420,P));v.fill(0);let X=0,ue=1,Tt=null;if(m.a[(y>>1)*m.w+(_>>1)]<70&&P<8)X=.3,v[Zt.niu]=50,v[Zt.hala]=30,v[Zt.milo]=15;else if(I<Rh&&ct<.04&&P<300)X=.04+.32*K+.22*F,v[Zt.aalii]=35,v[Zt.wiliwili]=R<Rh-.02?25:8,v[Zt.lama]=25,v[Zt.ohia]=12,Tt=so.ohiaDry;else if(nt>ve(w,b,22))if(et>.5)X=.45,v[Zt.ohiaai]=40*St,v[Zt.hau]=70*bt,v[Zt.kukui]=20*Rt*(1-.9*Mt),v[Zt.hala]=5*Lt;else if(K>.4||F>.4)X=.85,v[Zt.kukui]=70*Rt*(.25+.75*dt)*(1-.9*Mt),v[Zt.hala]=14*Lt*(1-.7*Mt),v[Zt.ohiaai]=10*St,v[Zt.hau]=60*bt*(P<450?1:0),v[Zt.lama]=12*(I<Lh&&ct<0?1:0),v[Zt.ohia]=(5+45*(1-Rt)*(I>Ch?1:0))*(P>150?Ft:0),v[Zt.ohiaKrumm]=10*(1-Rt)*(I>=Ph?1:0)*F;else{const z=ge(460,640,P);X=.25+.55*z,H>.5?(v[Zt.ohia]=60*(P>150?1:0),v[Zt.koa]=20*(P>250?1:0),v[Zt.hala]=20*Lt*(1-z)):(v[Zt.kukui]=45*Rt*(.1+.9*dt)*(1-.9*Mt),v[Zt.hala]=35*Lt*(1-.7*Mt)*(1-.85*z),v[Zt.ohiaai]=10*St,v[Zt.hau]=60*bt*(P<450?1:0),v[Zt.ohia]=(10+50*z)*(P>150?Ft:0),v[Zt.koa]=(10+5*z)*(P>250?1:0))}else I<Ph?(X=P<760?.55:.85,v[Zt.ohia]=45,v[Zt.koa]=30*(P>300?1:0),v[Zt.lama]=15,v[Zt.aalii]=5,v[Zt.kukui]=10*Rt*(K>.5?1:0)):H>.5||F>.5?(X=.6,v[Zt.ohiaKrumm]=55,v[Zt.ohia]=45,ue=.55+.3*ve(w,b,14)):(X=.92,v[Zt.ohia]=80,v[Zt.koa]=10*(U>.8?1:0),v[Zt.ohiaKrumm]=10,Tt=ve(w,b,15)<.12?so.olapa:so.ohiaWet);if(X<=ve(w,b,5))continue;const Y=Cx(ve(w,b,6),v);if(Y<0)continue;const[at,lt]=g(E/e,A/n),L=.92+.16*ve(w,b,8),T=Y===Zt.ohia&&Tt?Tt:Y===Zt.ohiaKrumm&&Tt===so.olapa?so.olapa:[L,L,L];p[Y].push(at,lt,P-.6,ve(w,b,7)*Math.PI*2,ue*(.8+.4*ve(w,b,9)),T[0],T[1],T[2],u[C]),d[Y]++}return{kinds:Ds,lists:p.map(b=>new Float32Array(b)),counts:Array.from(d)}}const As=-1,xo=.5,oo=16;function Bc(s,t,e,n=xo,i=As){return t<128?s+(i-s)*(t/127)*e:s+(Math.max(xo,n)-s)*((t-128)/127)*e}function Lx({W:s,H:t,lowerMasks:e,lowerOf:n,raises:i,patchMask:o,fill:a,log:r}){const c=s*t;let l=s,h=t,u=-1,f=-1;const m=_=>{const y=_%s,C=(_-y)/s;y<l&&(l=y),y>u&&(u=y),C<h&&(h=C),C>f&&(f=C)};for(let _=0;_<c;_++)if(o[_]||a[_])m(_);else for(const y of i)y[_]&&m(_);if(u<0)return null;l=Math.max(0,l-oo),h=Math.max(0,h-oo),u=Math.min(s-1,u+oo),f=Math.min(t-1,f+oo);const g=u-l+1,x=f-h+1,p=_=>(h+Math.floor(_/g))*s+l+_%g,d=65535,v=new Uint32Array(g*x),M=new Uint16Array(g*x).fill(d);let S=[];for(let _=0;_<g*x;_++){const y=p(_);let C=0;n.forEach((P,I)=>{e[P][y]>=128&&(C|=1<<I)}),C&&(v[_]=C,M[_]=0,S.push(_))}for(let _=1;_<d&&S.length;_++){const y=[];for(const C of S){const P=C%g;for(const I of[P>0?C-1:-1,P<g-1?C+1:-1,C-g,C+g])I<0||I>=g*x||M[I]!==d||_>oo&&!o[p(I)]||(M[I]=_,v[I]=v[C],y.push(I))}S=y}const b=n.reduce((_,y,C)=>_|1<<C,0);for(let _=0;_<g*x;_++)a[p(_)]&&(v[_]=b);const w=[0],E=new Map,A=new Uint8Array(g*x*4);for(let _=0;_<g*x;_++){const y=v[_];if(y){let F=E.get(y);F===void 0&&(w.length<16?F=w.push(y)-1:(F=E.get(b)??w.length-1,r==null||r(`patch map: more than 15 sets of lower patches; ${y.toString(2)} goes with group ${F}`)),E.set(y,F)),A[_*4]=F}const C=p(_);let P=-1,I=0,R=-1,U=0;i.forEach((F,G)=>{const W=F[C];W>I?(R=P,U=I,P=G,I=W):W>U&&(R=G,U=W)}),P>=0&&(A[_*4+1]=I,A[_*4+2]=P&15|(Math.max(0,R)&15)<<4,A[_*4+3]=R>=0?U:0)}return{data:A,x0:l,y0:h,w:g,h:x,groups:w}}function Ih(s,t,e){const n=new Uint8Array(t*e),i=new Int32Array(t*e);let o=0,a=0;const r=c=>{s[c]<=0&&!n[c]&&(n[c]=1,i[a++]=c)};for(let c=0;c<t;c++)r(c),r((e-1)*t+c);for(let c=0;c<e;c++)r(c*t),r(c*t+t-1);for(;o<a;){const c=i[o++],l=c%t,h=(c-l)/t;l>0&&r(c-1),l<t-1&&r(c+1),h>0&&r(c-t),h<e-1&&r(c+t)}return n}function Px({heightPx:s,rainPx:t,masks:e=[],lower:n=[],raise:i=[],raiseDepth:o=[],W:a,H:r,scale:c,offset:l,mx:h,mz:u,rect:f,features:m,stride:g=4,log:x=()=>{}}){const p=Date.now(),d={};let v=p;const M=Y=>{const at=Date.now();d[Y]=at-v,v=at},S=a*r,b=Du(s,a,r,c,l,g),w=t?Iu(t,a,r,g):new Uint8Array(S).fill(82),E=new Uint8Array(S);{const Y=Ih(b,a,r);for(let at=0;at<S;at++)b[at]<=0&&!Y[at]&&(b[at]=.3,E[at]=1)}const A=(f.x1-f.x0)/a,_=(f.z1-f.z0)/r,y=(Y,at)=>[f.x0+Y*A,f.z0+at*_];M("decode");const C=[...new Set(n)].map(Y=>e[Y]),P=i.map(Y=>e[Y]),I=new Uint8Array(S);for(const Y of P)for(let at=0;at<S;at++)Y[at]>I[at]&&(I[at]=Y[at]);const R=new Uint8Array(S);for(const Y of C)for(let at=0;at<S;at++)Y[at]>=128&&(R[at]=1);if(C.length){const at=(T,z)=>{const O=T%a,Z=(T-O)/a;for(let V=-3;V<=3;V++){const tt=Z+V;if(!(tt<0||tt>=r))for(let it=-3;it<=3;it++){const pt=O+it;if(pt>=0&&pt<a&&z(tt*a+pt))return!0}}return!1},lt=[];for(let T=0;T<S;T++)R[T]||b[T]<=0||b[T]>5||at(T,z=>R[z])&&at(T,z=>b[z]<=0&&!R[z])&&lt.push(T);for(const T of lt)R[T]=1;const L=new Uint8Array(S);for(let T=0;T<S;T++){if(!E[T]||L[T])continue;const z=[T];L[T]=1;let O=!1;for(let Z=0;Z<z.length;Z++){const V=z[Z];!O&&at(V,it=>R[it]===1)&&(O=!0);const tt=V%a;for(const it of[tt>0?V-1:-1,tt<a-1?V+1:-1,V-a,V+a])it>=0&&it<S&&E[it]&&!L[it]&&(L[it]=1,z.push(it))}if(O)for(const Z of z)R[Z]=1}}const U=new Uint8Array(S);if(C.length){const at=O=>b[O]<=0||R[O]===1,lt=hn(a,r,O=>!at(O),h,u),L=hn(a,r,O=>at(O)&&lt[O]>45,h,u),T=hn(a,r,O=>R[O]===1,h,u),z=45+1.5*Math.max(h,u);for(let O=0;O<S;O++)b[O]>0||R[O]||L[O]<=z||I[O]>=64||(T[O]<60?R[O]=2:U[O]=1);for(let O=0;O<S;O++)R[O]&&(R[O]=1)}const F=new Uint8Array(S*4),G=Float32Array.from(b);P.forEach((Y,at)=>{const lt=o[at]??As;for(let L=0;L<S;L++)Y[L]&&(G[L]+=(Math.max(G[L],lt)-G[L])*(Y[L]/255))});let W=null,K=null;{let Y=a,at=r,lt=-1,L=-1;for(let T=0;T<S;T++){if(!R[T])continue;const z=T%a,O=(T-z)/a;Y=Math.min(Y,z),lt=Math.max(lt,z),at=Math.min(at,O),L=Math.max(L,O)}if(lt>=0){Y=Math.max(0,Y-12),at=Math.max(0,at-12),lt=Math.min(a-1,lt+12),L=Math.min(r-1,L+12),W={x0:Y,y0:at,x1:lt,y1:L};const T=lt-Y+1,z=L-at+1,O=V=>(at+Math.floor(V/T))*a+Y+V%T,Z=hn(T,z,V=>!R[O(V)]&&b[O(V)]>0,h,u);for(let V=0;V<T*z;V++){const tt=O(V);if(!R[tt])continue;const it=ge(0,45,Z[V]);F[tt*4]=Math.round(127*it),G[tt]+=(As-G[tt])*it}}}if(W){const Y=Math.round(15e3/(h*u)),at=new Uint8Array(S),lt=[];for(let L=0;L<S;L++){const T=L%a,z=(L-T)/a;if(T<W.x0||T>W.x1||z<W.y0||z>W.y1||at[L]||G[L]<=0)continue;lt.length=0,lt.push(L),at[L]=1;let O=!1,Z=!1;for(let V=0;V<lt.length;V++){const tt=lt[V],it=tt%a,pt=(tt-it)/a;if(it<=W.x0||pt<=W.y0||it>=W.x1||pt>=W.y1){Z=!0;continue}for(const _t of[tt-1,tt+1,tt-a,tt+a])G[_t]>0?at[_t]||(at[_t]=1,lt.push(_t)):R[_t]&&(O=!0);lt.length>Y&&(Z=!0)}if(!(Z||!O)){K||(K=[]);for(const V of lt)R[V]=1,F[V*4]=127,G[V]=As,K.push(V)}}}const H=Float32Array.from(b);let et=null;if(C.length){for(let O=0;O<S;O++)U[O]&&(G[O]=xo);const Y=Ih(G,a,r);for(let O=0;O<S;O++)!U[O]&&G[O]<=0&&!Y[O]&&(U[O]=1);const at=new Float32Array(S),lt=new Float32Array(S);for(let O=0;O<S;O++)U[O]||R[O]||b[O]<=0||(at[O]=Math.min(b[O],6),lt[O]=1);const L=Math.ceil(30/Math.max(h,u)),T=zn(at,a,r,L,2),z=zn(lt,a,r,L,2);et=new Float32Array(S);for(let O=0;O<S;O++){if(!U[O])continue;const Z=z[O]>.001?Math.max(xo,Math.min(6,T[O]/z[O]-.2)):xo;et[O]=Z,F[O*4]=255,G[O]=Z,H[O]=Z}}const ct=Lx({W:a,H:r,lowerMasks:e,lowerOf:n,raises:P,patchMask:R,fill:U,log:x});M("patches");let Q=H;if(K){Q=Float32Array.from(H);for(const Y of K)Q[Y]=As}const nt=ku(Q,a,r,h,u,Uu(Q,a,r,h,u));M("normals");let dt,Mt,bt;{const Y=ha(H,a,r,2,!0),at=mx(Y.a,Y.w,Y.h),lt=gx(at,Y.w,Y.h,4*h*u/1e6);M("routing"),bt=vx(at,lt,Y.w,Y.h,Sx,(z,O)=>y(z*2,O*2)),M("streams"),Mt=hn(a,r,z=>{const O=z%a,Z=(z-O)/a;return H[z]>0&&lt[(Z>>1)*Y.w+(O>>1)]>=1},h,u);const L=new Float32Array(Y.w*Y.h);for(let z=0;z<L.length;z++)L[z]=Y.a[z]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,lt[z])/.04)/1.6)):0;const T=ha(L,Y.w,Y.h,2,!1);dt={a:zn(T.a,T.w,T.h,1,2),w:T.w,h:T.h}}M("riparian");const Rt=new Uint8Array(S*4);let Lt;{const Y=(at,lt)=>{const L=ha(at,a,r,2,!1),T=hn(L.w,L.h,Z=>L.a[Z]<=0,h*2,u*2),z=new Float32Array(L.w*L.h);for(let Z=1;Z<L.h-1;Z++)for(let V=1;V<L.w-1;V++){const tt=Z*L.w+V,it=L.a[tt];if(it<=0||it>9)continue;const pt=Math.hypot((L.a[tt+1]-L.a[tt-1])/(4*h),(L.a[tt+L.w]-L.a[tt-L.w])/(4*u));z[tt]=T[tt]<70&&pt<.12?1:0}const O={a:zn(z,L.w,L.h,1,1),w:L.w,h:L.h};for(let Z=0;Z<r;Z++)for(let V=0;V<a;V++)Rt[(Z*a+V)*4+lt]=at[Z*a+V]>0?Math.round(255*Math.min(1,Oa(O,V,Z,2)*1.5)):0;return{a:T,w:L.w,h:L.h}};Y(H,1),Lt=Y(G,3)}for(let Y=0;Y<r;Y++)for(let at=0;at<a;at++){const lt=Y*a+at;Rt[lt*4]=t?w[lt]:b[lt]>0?82:0,Rt[lt*4+2]=H[lt]>0?Math.round(255*Math.min(1,Oa(dt,at,Y,4)*1.6)):0}M("sand");const St=new Uint16Array(S*2);if(et)for(let Y=0;Y<S;Y++)U[Y]&&(St[Y*2]=vo(et[Y]),St[Y*2+1]=vo(et[Y]-b[Y]));if(K)for(const Y of K)St[Y*2+1]=vo(As-b[Y]);const Ft={},X=new Uint8Array(S);{const Y=zn(b,a,r,3,2),at=new Uint8Array(S);{const T=new Float32Array(S);for(let O=1;O<r-1;O++)for(let Z=1;Z<a-1;Z++){const V=O*a+Z;T[V]=Math.hypot((Y[V+1]-Y[V-1])/(2*h),(Y[V+a]-Y[V-a])/(2*u))}const z=zn(T,a,r,6,2);for(let O=0;O<S;O++)at[O]=Math.max(0,Math.min(3,Math.round(Math.log2(Math.max(1e-6,z[O]*wx/Oc)))))}const lt=new Uint8Array(S),L={village:0,loi:1,pond:2};for(const T of[...m].sort((z,O)=>L[z.kind]-L[O.kind])){const z=Tx(T.rings,a,r,4);for(let Z=z.y0;Z<=z.y1;Z++)lt.fill(0,Z*a+z.x0,Z*a+z.x1+1);const O=_x(lt,a,r,T.rings,1);if(O){if(T.kind==="loi")Ft[T.index]=Ex({index:T.index,inside:lt,box:z,m:b,hs:Y,cls:at,chanDist:Mt,aux:F,carve:St,W:a,mx:h,mz:u});else{const Z=z.x1-z.x0+1,V=z.y1-z.y0+1,tt=hn(Z,V,it=>!lt[(z.y0+Math.floor(it/Z))*a+z.x0+it%Z],h,u);for(let it=z.y0;it<=z.y1;it++)for(let pt=z.x0;pt<=z.x1;pt++){const _t=it*a+pt;lt[_t]&&(F[_t*4+1]=Math.round(255*ge(0,T.kind==="pond"?9:40,tt[(it-z.y0)*Z+(pt-z.x0)])),F[_t*4+2]=0,F[_t*4+3]=T.index,St[_t*2]=St[_t*2+1]=0)}Ft[T.index]=O}for(let Z=z.y0;Z<=z.y1;Z++)for(let V=z.x0;V<=z.x1;V++)lt[Z*a+V]&&(X[Z*a+V]=T.index)}}}M("features");let ue;{const Y=Dx(X,a,r,5),at=ha(b,a,r,4,!1),lt={a:zn(at.a,at.w,at.h,2,2),w:at.w,h:at.h};ue=Rx({W:a,H:r,mx:h,mz:u,m:b,m1795:G,rain:w,normals:nt,rip:dt,tpi:lt,chanDist:Mt,clear:Y,patch:R,shore:Lt,toWorld:y,step:25})}M("trees");let Tt=1/0,kt=-1/0;for(let Y=0;Y<S;Y++)b[Y]<Tt&&(Tt=b[Y]),b[Y]>kt&&(kt=b[Y]);return x(`district decoded in ${Date.now()-p} ms: ${JSON.stringify(d)}`),{metres:b,normals:nt,land:Rt,aux:F,carve:St,streams:bt,trees:ue,counts:Ft,lo:Tt,hi:kt,patchMap:ct,ms:Date.now()-p,times:d}}function ha(s,t,e,n,i){const o=Math.ceil(t/n),a=Math.ceil(e/n),r=new Float32Array(o*a).fill(i?1/0:-1/0);for(let c=0;c<e;c++){const l=Math.floor(c/n)*o;for(let h=0;h<t;h++){const u=l+Math.floor(h/n),f=s[c*t+h];(i?f<r[u]:f>r[u])&&(r[u]=f)}}return{a:r,w:o,h:a}}function Oa(s,t,e,n){const i=Math.min(s.w-1.001,Math.max(0,(t+.5)/n-.5)),o=Math.min(s.h-1.001,Math.max(0,(e+.5)/n-.5)),a=i|0,r=o|0,c=i-a,l=o-r,h=s.a,u=r*s.w+a,f=h[u]+(h[u+1]-h[u])*c,m=h[u+s.w]+(h[u+s.w+1]-h[u+s.w])*c;return f+(m-f)*l}function Dx(s,t,e,n){const i=Uint8Array.from(s);for(let a=0;a<e;a++)for(let r=0;r<t;r++){const c=a*t+r;if(!s[c])for(let l=1;l<=n;l++){const h=r-l>=0&&s[c-l]||r+l<t&&s[c+l];if(h){i[c]=h;break}}}const o=Uint8Array.from(i);for(let a=0;a<e;a++)for(let r=0;r<t;r++){const c=a*t+r;if(!i[c])for(let l=1;l<=n;l++){const h=a-l>=0&&i[c-l*t]||a+l<e&&i[c+l*t];if(h){o[c]=h;break}}}return o}const Br=24;async function Uh(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}async function Ix(s,t=console.warn){let e;try{e=await Uh(s.abs("districts/manifest.json"))}catch{return[]}const n=[];for(const i of e.districts||[])try{let o={type:"FeatureCollection",features:[]};if(i.features)try{o=await Uh(s.abs(`districts/${i.features}`))}catch(a){t(`districts/${i.features}: ${a.message} (the district is drawn without its features)`)}n.push(Ux(i,o,s,t))}catch(o){t(`district ${i.id}: ${o.message}`)}return n}function ir(s){return[Number.isFinite(s==null?void 0:s.from)?s.from:-1/0,Number.isFinite(s==null?void 0:s.to)?s.to:1/0]}function Io(s,t){const[e,n]=ir(s);return t>=e&&t<n+1}function Ux(s,t,e,n){var M;const o=e.proj.rect(s.bounds),[a,r]=s.size,[c,l,h,u]=s.bounds,f=S=>e.abs(`districts/${S}`),m=([S,b])=>[(S-c)/(h-c)*a,(u-b)/(u-l)*r],g={loi:Vn.loi,pond:Vn.pond,other:Vn.other},x={loi:Vn.pond-1,pond:Vn.other-1,other:Vn.max},p=[],d=new Map;for(const S of t.features||[]){const b=S.properties||{},w=b.kind==="loi"?"loi":b.kind==="fishpond"?"pond":b.kind==="village"?"other":null,E=S.geometry;if(!w||(E==null?void 0:E.type)!=="Polygon")continue;if(g[w]>x[w]){n(`district ${s.id}: more ${b.kind} features than the aux map has room for; ${b.name} is not drawn`);continue}const A=g[w]++;p.push({index:A,kind:w==="other"?b.kind:w,rings:E.coordinates.map(_=>_.map(m))}),d.set(A,S)}const v=(s.patches||[]).map(S=>_f(S,f,b=>n(`district ${s.id}: ${b}`),s.id)).filter(Boolean);return{id:s.id,name:s.name||s.id,parent:s.parent||s.island,desc:s,bounds:s.bounds,rect:o,W:a,H:r,mx:(o.x1-o.x0)*Os/a,mz:(o.z1-o.z0)*Os/r,heightUrl:f(s.height.file),rainUrl:(M=s.rain)!=null&&M.file?f(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,own:v,patches:v,features:t,raster:p,byIndex:d,sources:s.sources||[]}}function kx(s,t=[],e=console.warn){const n=[...s.own,...t.filter(a=>a.pack===s.id)],i=n.filter(a=>a.kind==="lower"),o=n.filter(a=>a.kind==="raise");return i.length>Br&&e(`district ${s.id}: ${i.length} lower patches, ${Br} drawn`),o.length>jn&&e(`district ${s.id}: ${o.length} raise patches, ${jn} drawn`),[...o.slice(0,jn),...i.slice(0,Br)]}class zx{constructor(t=console.warn){this.warn=t,this.jobs=new Map,this.n=0;try{this.worker=new Worker(new URL(""+new URL("district-worker-DsB0McXu.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=e=>this.message(e.data),this.worker.onerror=e=>{var n;(n=e.preventDefault)==null||n.call(e),this.fallback=!0;for(const[i,o]of this.jobs)this.mainThread(i,o)}}catch{this.fallback=!0}}job(t){const e=[],n=a=>{let r=e.findIndex(c=>c.url===a.url);return r<0&&(r=e.push({url:a.url,size:a.size})-1),r},i=t.patches.filter(a=>a.kind==="lower").map(n),o=t.patches.filter(a=>a.kind==="raise");return{heightUrl:t.heightUrl,rainUrl:t.rainUrl,masks:e,lower:i,raise:o.map(n),raiseDepth:o.map(a=>a.depth),W:t.W,H:t.H,scale:t.scale,offset:t.offset,mx:t.mx,mz:t.mz,rect:{x0:t.rect.x0,z0:t.rect.z0,x1:t.rect.x1,z1:t.rect.z1},features:t.raster.map(a=>({index:a.index,kind:a.kind,rings:a.rings}))}}decode(t){return new Promise((e,n)=>{const i=++this.n,o={d:t,resolve:e,reject:n};this.jobs.set(i,o),this.fallback?this.mainThread(i,o):this.worker.postMessage({id:i,...this.job(t)})})}message(t){const e=this.jobs.get(t.id);if(e){if(t.log)return this.warn(t.log);this.jobs.delete(t.id),t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,this.jobs.set(t.id,e),this.mainThread(t.id,e)):e.reject(new Error(t.message))}}async mainThread(t,e){try{const n=this.job(e.d),i=await Kn(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);const o=n.rainUrl?await Kn(n.rainUrl).then(c=>c.W===n.W&&c.H===n.H?c.px:null).catch(()=>null):null,a=await rx(n,this.warn),r=Px({...n,heightPx:i.px,rainPx:o,masks:a});this.jobs.delete(t),e.resolve(r)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){var t;(t=this.worker)==null||t.terminate()}}const Re=fd,hi=s=>s*So/100,st={plain:0,thatch:1,stone:2,leaf:3,water:4,kapa:5,wood:6,skin:7,sand:8,clap:9,windows:10,roof:11,masonry:12};class Ie{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.feat=[],this.featNow=0,this.xf=null,this.stack=[]}at(t,e,n,i=0,o=Re){this.stack.push(this.xf);const a=Math.cos(i),r=Math.sin(i);return this.xf=c=>[t+(c[0]*a-c[2]*r)*o,e+c[1]*o,n+(c[0]*r+c[2]*a)*o],this}done(){return this.xf=this.stack.pop()||null,this}feature(t){return this.featNow=t,this}tri(t,e,n,i,o=0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const a=e[0]-t[0],r=e[1]-t[1],c=e[2]-t[2],l=n[0]-t[0],h=n[1]-t[1],u=n[2]-t[2];let f=r*u-c*h,m=c*l-a*u,g=a*h-r*l;const x=Math.hypot(f,m,g)||1;f/=x,m/=x,g/=x;for(const p of[t,e,n])this.pos.push(p[0],p[1],p[2]),this.nor.push(f,m,g),this.col.push(i[0],i[1],i[2]),this.mat.push(o),this.feat.push(this.featNow)}quad(t,e,n,i,o,a=0){this.tri(t,e,n,o,a),this.tri(t,n,i,o,a)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let o=0;o<4;o++)this.quad(t[o],e[o],e[(o+1)%4],t[(o+1)%4],n,i)}box(t,e,n,i,o,a,r,c=0,l=0,h=1){const u=Math.cos(l),f=Math.sin(l),m=(S,b,w)=>[t+S*u-w*f,e+b,n+S*f+w*u],g=i/2,x=a/2,p=g*h,d=x*h,v=[m(-g,0,-x),m(g,0,-x),m(g,0,x),m(-g,0,x)],M=[m(-p,o,-d),m(p,o,-d),m(p,o,d),m(-p,o,d)];o<0?this.hexa(M,v,r,c):this.hexa(v,M,r,c)}cyl(t,e,n,i,o,a=0,r=6){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],l=Math.hypot(...c)||1,h=c.map(p=>p/l),u=Math.abs(h[1])<.9?[0,1,0]:[1,0,0];let f=[h[1]*u[2]-h[2]*u[1],h[2]*u[0]-h[0]*u[2],h[0]*u[1]-h[1]*u[0]];const m=Math.hypot(...f);f=f.map(p=>p/m);const g=[h[1]*f[2]-h[2]*f[1],h[2]*f[0]-h[0]*f[2],h[0]*f[1]-h[1]*f[0]],x=(p,d,v)=>{const M=v/r*Math.PI*2,S=Math.cos(M)*d,b=Math.sin(M)*d;return[p[0]+f[0]*S+g[0]*b,p[1]+f[1]*S+g[1]*b,p[2]+f[2]*S+g[2]*b]};for(let p=0;p<r;p++)this.quad(x(t,n,p),x(t,n,p+1),x(e,i,p+1),x(e,i,p),o,a)}blob(t,e,n,i,o,a,r,c=0,l=0,h=c===st.leaf){const u=(1+Math.sqrt(5))/2,f=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],m=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],g=d=>.85+.3*Math.abs(Math.sin(d*12.9898+l*78.233)*43758.5453%1),x=f.map((d,v)=>{const M=Math.hypot(...d),S=g(v);return[t+d[0]/M*i*S,e+d[1]/M*o*S,n+d[2]/M*a*S]});if(!h){for(const d of m)this.tri(x[d[0]],x[d[1]],x[d[2]],r,c);return}const p=d=>{const v=[(d[0]-t)/(i*i),(d[1]-e)/(o*o),(d[2]-n)/(a*a)],M=Math.hypot(...v)||1;return[v[0]/M,v[1]/M,v[2]/M]};for(const d of m){const v=d.map(S=>x[S]),M=this.xf?v.map(S=>this.xf(S)):v;for(let S=0;S<3;S++)this.pos.push(...M[S]),this.nor.push(...p(v[S])),this.col.push(r[0],r[1],r[2]),this.mat.push(c),this.feat.push(this.featNow)}}wall(t,e,n,i,o=st.stone,a=.7){const r=t.length;if(r<2)return;const c=r>2&&Math.hypot(t[0][0]-t[r-1][0],t[0][2]-t[r-1][2])<1e-9,l=[];for(let x=0;x<r-1;x++){const p=t[x+1][0]-t[x][0],d=t[x+1][2]-t[x][2],v=Math.hypot(p,d)||1;l.push([-d/v,p/v])}const h=t.map((x,p)=>{let d=l[p-1],v=l[p];if(c&&p===0&&(d=l[r-2]),c&&p===r-1&&(v=l[0]),!d)return v;if(!v)return d;const M=d[0]+v[0],S=d[1]+v[1],b=Math.hypot(M,S);if(b<1e-6)return v;const w=1/Math.max(.35,(M*v[0]+S*v[1])/b);return[M/b*w,S/b*w]}),u=e/2,f=e*a/2,m=(x,p,d,v)=>[x[0]+p[0]*d,x[1]+v,x[2]+p[1]*d],g=x=>[m(t[x],h[x],-u,-n*.3),m(t[x],h[x],u,-n*.3),m(t[x],h[x],f,n),m(t[x],h[x],-f,n)];for(let x=0;x<r-1;x++){const[p,d,v,M]=g(x),[S,b,w,E]=g(x+1);this.quad(M,v,w,E,i,o),this.quad(d,b,w,v,i,o),this.quad(S,p,M,E,i,o)}if(!c){const[x,p,d,v]=g(0),[M,S,b,w]=g(r-1);this.quad(x,p,d,v,i,o),this.quad(S,M,w,b,i,o)}}geometry(){const t=new cn;return t.setAttribute("position",new Ae(this.pos,3)),t.setAttribute("normal",new Ae(this.nor,3)),t.setAttribute("color",new Ae(this.col,3)),t.setAttribute("aMat",new Ae(this.mat,1)),t.setAttribute("aFeat",new Ae(this.feat,1)),t.computeBoundingSphere(),t}}function vc(s){const t=s.attributes.position.array,e=s.attributes.normal.array,n=s.attributes.color.array,i=s.attributes.aMat.array,o=new Map,a=[],r=[],c=[],l=[],h=[];for(let f=0;f<i.length;f++){const m=`${t[f*3]},${t[f*3+1]},${t[f*3+2]},${e[f*3]},${e[f*3+1]},${e[f*3+2]},${n[f*3]},${n[f*3+1]},${n[f*3+2]},${i[f]}`;let g=o.get(m);g===void 0&&(g=o.size,o.set(m,g),r.push(t[f*3],t[f*3+1],t[f*3+2]),c.push(e[f*3],e[f*3+1],e[f*3+2]),l.push(n[f*3],n[f*3+1],n[f*3+2]),h.push(i[f])),a.push(g)}const u=new cn;return u.setAttribute("position",new Ae(r,3)),u.setAttribute("normal",new Ae(c,3)),u.setAttribute("color",new Ae(l,3)),u.setAttribute("aMat",new Ae(h,1)),u.setIndex(a),u.computeBoundingSphere(),u}function yt(s,t=0,e=Math.random){const n=new Gt(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const Fx=`
${He}
${ln}
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
`,Nx=`
${He}
${Do}
${ln}
${qs}
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
`;function Ao(s,t,e={}){const[n,i]=e.fade||[60,90];return new Te({vertexShader:Fx,fragmentShader:Nx,vertexColors:!0,side:e.doubleSide?On:vi,defines:{...e.grow?{USE_GROW:""}:{},...e.yield?{USE_YIELD:""}:{}},uniforms:{...s.uniforms,uYearNow:{value:0},uTownClear:{value:null},...t,uShadeS:t.uShadeS??t.uDistS??{value:null},uShadeRect:t.uShadeRect??s.uniforms.uDistRect,uFadeNear:{value:n},uFadeFar:{value:i}}})}const Mo={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",koa:"#7a4a2a",pondStone:"#8a817a"};function Ba(s,t,e=7,n=4.6,i=5.2,o=!0,a=.6){const r=yt(Mo.thatch,.18,t),c=yt(Mo.thatchDark,.15,t),l=yt(Mo.stone,.15,t);s.box(0,-a,0,e+1.8,.45+a,n+1.8,l,st.stone);const h=.45,u=h+1.05;s.box(0,h,0,e,u-h,n,r,st.thatch);const f=e/2+.35,m=n/2+.45,g=h+i,x=[-f,u-.15,-m],p=[f,u-.15,-m],d=[-f,g,0],v=[f,g,0],M=[-f,u-.15,m],S=[f,u-.15,m];s.quad(x,d,v,p,r,st.thatch),s.quad(S,v,d,M,r,st.thatch),s.quad(p,v,d,x,c,st.thatch),s.quad(M,d,v,S,c,st.thatch);const b=e/2;if(s.tri([-b,u,-n/2],[-b,u,n/2],[-b,g-.2,0],r,st.thatch),s.tri([b,u,n/2],[b,u,-n/2],[b,g-.2,0],r,st.thatch),s.box(0,g-.12,0,e+.9,.35,.55,c,st.thatch),o){const w=[.05,.035,.025];s.box(b+.15,h,0,.3,1.4,.9,w,0)}}function Ox(s,t,e=8){const n=yt(Mo.koa,.2,t),i=yt("#4a2c18",.2,t),o=e/2;s.box(0,0,0,e*.8,.55,.62,n,st.wood,0,.9),s.box(o*.85,.05,0,e*.2,.6,.4,i,st.wood,0,.5),s.box(-o*.85,.05,0,e*.2,.55,.4,i,st.wood,0,.5);const a=-2.4;for(const r of[-e*.15,e*.15])s.cyl([r,.55,0],[r,.5,a],.06,.06,i,st.wood,4);s.box(0,.05,a,e*.5,.28,.24,i,st.wood,0,.8)}function Bx(s,t){const e=yt("#4d4642",.2,t);for(let n=0;n<5;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,st.stone,n)}const Ea=Math.PI*2,_o=[[0,1,0]];for(let s=0;s<10;s++){const t=s*Math.PI/5,e=s%2?-1:1;_o.push([Math.cos(t)*.8944,e*.4472,Math.sin(t)*.8944])}_o.push([0,-1,0]);const Ef=[];for(let s=0;s<5;s++){const t=1+2*s,e=t+1,n=1+(2*s+2)%10,i=1+(2*s+3)%10;Ef.push([0,t,n],[t,e,n],[n,e,i],[11,e,i])}function Wx(s,t,e,n,i,o,a,r,c,l=0,h=.1,u=1){const f=(p,d,v)=>{const M=Math.max(0,Math.min(1,(v-p)/(d-p)));return M*M*(3-2*M)},m=_o.map((p,d)=>{const v=d===0||d===11?1:1-h+2*h*Math.abs(Math.sin(d*12.9898+l*78.233)*43758.5453%1);return[t+p[0]*i*v,e+p[1]*o,n+p[2]*a*v]}),g=_o.map(p=>{const d=[p[0]/i,p[1]/o,p[2]/a],v=Math.hypot(...d);return[d[0]/v,d[1]/v,d[2]/v]}),x=_o.map(p=>{const d=u+(1-u)*f(-.8,.3,p[1]);return[r[0]*d,r[1]*d,r[2]*d]});for(const p of Ef){const[d,v,M]=p.map(A=>m[A]),S=(v[1]-d[1])*(M[2]-d[2])-(v[2]-d[2])*(M[1]-d[1]),b=(v[2]-d[2])*(M[0]-d[0])-(v[0]-d[0])*(M[2]-d[2]),w=(v[0]-d[0])*(M[1]-d[1])-(v[1]-d[1])*(M[0]-d[0]),E=S*(d[0]+v[0]+M[0]-3*t)+b*(d[1]+v[1]+M[1]-3*e)+w*(d[2]+v[2]+M[2]-3*n)>0;for(const A of E?p:[p[0],p[2],p[1]])s.pos.push(m[A][0],m[A][1],m[A][2]),s.nor.push(g[A][0],g[A][1],g[A][2]),s.col.push(x[A][0],x[A][1],x[A][2]),s.mat.push(c),s.feat.push(0)}}function Un(s,{stick:t,r0:e=.4,r1:n=.25,bark:i="#6a6058",limbs:o=[],crowns:a}){const r=new Ie,c=yt(i,.1,s);t&&r.cyl([0,0,0],t,e,n,c,st.wood,3);for(const[l,h,u,f]of o)r.cyl(l,h,u,f,c,st.wood,3);for(const[l,h,u,f,m,g,x=st.leaf,p=1,d=1]of a)Wx(r,l,h,u,f,m,f,typeof g=="string"?yt(g,.1,s):g,x,p,.1,d);return r.geometry()}function Gx(s){const t=new Ie,e=yt("#8a7a62",.1,s),n=14;let i=[0,0,0];for(let c=1;c<=4;c++){const l=c/4*n,h=[.06*Math.pow(l,1.5),l,0];t.cyl(i,h,.3-c*.025,.28-c*.03,e,st.wood,5),i=h}const o=i,a=yt("#6E7A3E",.12,s),r=yt("#8f9a43",.1,s);for(let c=0;c<9;c++){const l=c/9*Ea+s()*.3,h=5.2+s()*1.2,u=1.4+s()*.8,f=Math.cos(l),m=Math.sin(l);let g=o;for(let x=1;x<=4;x++){const p=x/4,d=[o[0]+f*h*p,o[1]+u*p-3.8*p*p,o[2]+m*h*p],v=1*Math.sin(Math.PI*Math.min(1,p*1.1))+.15,M=-m*v,S=f*v,b=x>2?r:a;t.quad(g,d,[d[0]+M,d[1]-.35*v,d[2]+S],[g[0]+M*.7,g[1]-.25*v,g[2]+S*.7],b,st.leaf),t.quad([g[0]-M*.7,g[1]-.25*v,g[2]-S*.7],[d[0]-M,d[1]-.35*v,d[2]-S],d,g,b,st.leaf),g=d}}return t.geometry()}function Hx(s){const t=[];for(let c=0;c<4;c++){const l=c/4*Ea+.3;for(const h of[-1,1])t.push([Math.cos(l+h*.35)*6.2,10.2+(h>0?.4:0),Math.sin(l+h*.35)*6.2])}const e=[[2.6,6.1,.9],[2.1,6.4,-1.6],[-1.9,6.2,1.4],[-2.2,5.9,-1.1]],n=[0,1,2,3,4].map(c=>[Math.cos(c/5*Ea)*3.6,3.4,Math.sin(c/5*Ea)*3.6]),i="#56603D",o="#66704A",a="#77825A",r=yt("#5C603F",0,s).map(c=>c*.95);return{ohia:Un(s,{stick:[.3,6.5,.1],bark:"#5A5354",crowns:[[.3,8.6,0,4.6,2.5,r],[2.2,7.7,1,3,1.8,r,st.leaf,2]]}),ohiaKrumm:Un(s,{crowns:[[.6,2.4,.2,5,1.5,"#596537",st.leaf,1,.75]]}),koa:Un(s,{stick:[.2,4,-.3],r0:.6,r1:.45,bark:"#5A504B",limbs:[0,2,4,6].map(c=>{const[l,h]=[t[c],t[c+1]];return[[.2,3.8,-.3],[(l[0]+h[0])/2*.9,(l[1]+h[1])/2-.6,(l[2]+h[2])/2*.9],.3,.14]}),crowns:[0,2,4,6].map((c,l)=>{const[h,u]=[t[c],t[c+1]];return[(h[0]+u[0])/2,(h[1]+u[1])/2+.3,(h[2]+u[2])/2,3,1.55,l===1?"#737B5A":"#5E6A3C",st.leaf,l+1]})}),kukui:Un(s,{stick:[.3,4.2,.1],r0:.45,r1:.35,bark:"#5F5B54",crowns:[[.3,6.5,.1,5.8,3.2,o,st.leaf,1,.62],[.5,8.6,.3,3.4,1.6,a,st.leaf,5,.8],[-2.9,5.6,1.6,2.8,1.9,i,st.leaf,2,.7]]}),ohiaai:Un(s,{stick:[0,2.4,0],r0:.35,r1:.3,bark:"#8A7458",crowns:[[0,6,0,2.4,3.6,"#3A5026"]]}),hau:Un(s,{crowns:[[0,2.2,0,5,2.2,"#6E8A3E"]]}),hala:Un(s,{stick:[.3,3.4,0],r0:.22,r1:.15,bark:"#8E8B82",limbs:[0,2].map(c=>{const[l,h]=e.slice(c,c+2);return[[.3,3.3,0],[(l[0]+h[0])/2,(l[1]+h[1])/2-.45,(l[2]+h[2])/2],.13,.09]}),crowns:e.map((c,l)=>[c[0],c[1]-.35,c[2],1.45,.75,"#55703D",st.leaf,l+1])}),wiliwili:Un(s,{stick:[.1,2.8,.2],r0:.45,r1:.3,bark:"#9C6C44",limbs:n.map(c=>[[.05,2.5,.2],c,.2,.08]),crowns:[[0,3.9,.2,4.8,1.25,"#788C4A",st.leaf,3,.75]]}),lama:Un(s,{stick:[.2,3.2,.1],r0:.25,r1:.18,bark:"#3E3A36",crowns:[[.2,5.4,.1,2.6,2,"#4C5E2E"]]}),aalii:Un(s,{crowns:[[0,1.2,0,1.5,1,"#6F8A4E"]]}),niu:Gx(s),milo:Un(s,{stick:[.2,2.2,0],r0:.35,r1:.28,bark:"#8A8070",crowns:[[.2,4.6,0,3.6,2.4,"#4A6426"]]})}}const Tn=3,Ki=[30,80],Vx=s=>Math.max(Ki[0],Math.min(Ki[1],s*2)),kh=24e3;function $x(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}class Xx{constructor(t,e,n,i){const o=$x(5150),a=Hx(o);this.group=new We,this.rect=e,this.nx=Math.ceil((e.x1-e.x0)/Tn),this.nz=Math.ceil((e.z1-e.z0)/Tn),this.mat=Ao(n,i,{fade:[Ki[0]-7,Ki[0]]}),this.matDS=Ao(n,i,{fade:[Ki[0]-7,Ki[0]],doubleSide:!0}),this.species=[];const r=new se,c=new Pi,l=new B(0,1,0),h=new B,u=new B;this.total=0,Ds.forEach((f,m)=>{const g=t.lists[m],x=g.length/la,p=new Int32Array(x),d=new Int32Array(this.nx*this.nz);for(let P=0;P<x;P++){const I=Math.min(this.nx-1,Math.max(0,Math.floor((g[P*la]-e.x0)/Tn))),R=Math.min(this.nz-1,Math.max(0,Math.floor((g[P*la+1]-e.z0)/Tn)));p[P]=R*this.nx+I,d[p[P]]++}const v=new Int32Array(this.nx*this.nz+1);for(let P=0;P<d.length;P++)v[P+1]=v[P]+d[P];const M=v.slice(),S=new Int32Array(x);for(let P=0;P<x;P++)S[M[p[P]]++]=P;for(let P=0;P<d.length;P++)for(let I=v[P+1]-1;I>v[P];I--){const R=v[P]+Math.floor(o()*(I-v[P]+1)),U=S[I];S[I]=S[R],S[R]=U}const b=new Float32Array(x*16),w=new Float32Array(x*3),E=new Float32Array(x);for(let P=0;P<x;P++){const R=S[P]*la;c.setFromAxisAngle(l,g[R+3]);const U=Re*g[R+4];h.set(g[R],hi(g[R+2]),g[R+1]),u.set(U,U,U),r.compose(h,c,u),r.toArray(b,P*16),w[P*3]=g[R+5],w[P*3+1]=g[R+6],w[P*3+2]=g[R+7],E[P]=g[R+8]}const A=Math.min(x,kh),_=vc(a[f]),y=new Uc(_,f==="niu"||f==="hala"?this.matDS:this.mat,Math.max(1,A));y.name=f,y.count=0,y.frustumCulled=!1,y.instanceMatrix.setUsage(wn),y.instanceColor=new Ne(new Float32Array(Math.max(1,A)*3),3),y.instanceColor.setUsage(wn);const C=new Ne(new Float32Array(Math.max(1,A)),1);C.setUsage(wn),_.setAttribute("aClear",C),this.group.add(y),this.species.push({kind:f,mesh:y,aClear:C,start:v,mats:b,cols:w,clear:E,cap:A,n:x}),this.total+=x}),this.frustum=new Ii,this.pv=new se,this.box=new bn,this.key="",this.drawn=0}update(t,e,n,i){if(this.group.visible=e>.001,!this.group.visible)return;const o=Vx(i),a=o*.42;for(const d of[this.mat,this.matDS])d.uniforms.uFadeNear.value=o*.7,d.uniforms.uFadeFar.value=o;const r=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const c=this.rect,l=[],h=Math.max(0,Math.floor((r.x-o-c.x0)/Tn)),u=Math.min(this.nx-1,Math.floor((r.x+o-c.x0)/Tn)),f=Math.max(0,Math.floor((r.z-o-c.z0)/Tn)),m=Math.min(this.nz-1,Math.floor((r.z+o-c.z0)/Tn));for(let d=f;d<=m;d++)for(let v=h;v<=u;v++){const M=c.x0+v*Tn,S=c.z0+d*Tn;this.box.min.set(M,-.5,S),this.box.max.set(M+Tn,n,S+Tn);const b=this.box.distanceToPoint(r);if(b>o||!this.frustum.intersectsBox(this.box))continue;const w=b<a?1:Math.pow(a/b,1.6);l.push(d*this.nx+v,Math.round(w*20))}const g=l.join(",");if(g===this.key)return;this.key=g;let x=0;for(const d of this.species)for(let v=0;v<l.length;v+=2)x+=Math.ceil((d.start[l[v]+1]-d.start[l[v]])*l[v+1]/20);const p=Math.min(1,kh/Math.max(1,x));this.drawn=0;for(const d of this.species){let v=0;for(let M=0;M<l.length;M+=2){const S=l[M],b=d.start[S],w=d.start[S+1]-b,E=Math.min(Math.ceil(w*l[M+1]*p/20),d.cap-v);E<=0||(d.mesh.instanceMatrix.array.set(d.mats.subarray(b*16,(b+E)*16),v*16),d.mesh.instanceColor.array.set(d.cols.subarray(b*3,(b+E)*3),v*3),d.aClear.array.set(d.clear.subarray(b,b+E),v),v+=E)}d.mesh.count=v,d.mesh.instanceMatrix.needsUpdate=!0,d.mesh.instanceColor.needsUpdate=!0,d.aClear.needsUpdate=!0,d.mesh.visible=v>0,this.drawn+=v}}dispose(){for(const t of this.species)t.mesh.geometry.dispose();this.mat.dispose(),this.matDS.dispose()}}const qx=`
${He}
${ln}
${os}
in vec4 aSeg;   // the segment's ends: ax, az, bx, bz
in vec4 aInfo;  // width at a and at b (world units), distance along at a and at b
in float aEnd;  // the whole line's length
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
`,jx=`
${He}
${Do}
${ln}
${qs}
uniform vec3 uColor;
uniform float uAlpha;
uniform int uMode;    // 0 water, 1 earth, 2 band
uniform float uEndFade; // world units over which a line fades in at its start and out at its end (0: cut square)
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
  vec3 col;
  float edge = abs(vSide);
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
  } else {
    // a front: soft across, a little stronger at its middle
    a *= (1.0 - smoothstep(0.2, 1.0, edge)) * (0.75 + 0.25 * sin(vS * 1.3 + uTime * 0.6));
    col = uColor * (uSunColor * max(uSunDir.y, 0.0) * 0.7 + uSkyColor * 1.1);
  }
  if (a <= 0.003) discard;
  gl_FragColor = vec4(col, a);
}
`,Yx=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);class Kx{constructor(t,e){this.shared=t,this.camera=e,this.group=new We,this.batches=[],this._res=new Ht}add(t,{mode:e="earth",colour:n=[1,1,1],alpha:i=1,minPx:o=1,lift:a=.004,order:r=5,endFade:c=0}={}){const l=[],h=[],u=[];for(const{pts:d,width:v}of t){let M=0;for(let b=0;b+1<d.length;b++)M+=Math.hypot(d[b+1][0]-d[b][0],d[b+1][1]-d[b][1]);let S=0;for(let b=0;b+1<d.length;b++){const[w,E]=d[b],[A,_]=d[b+1],y=Math.hypot(A-w,_-E);if(y<1e-6)continue;const C=Array.isArray(v)?v[b]:v,P=Array.isArray(v)?v[b+1]:v;l.push(w,E,A,_),h.push(C,P,S,S+y),u.push(M),S+=y}}if(!l.length)return null;const f=new Po;f.setAttribute("position",new Le(Yx,3)),f.setIndex([0,2,1,1,2,3]),f.setAttribute("aSeg",new Ne(new Float32Array(l),4)),f.setAttribute("aInfo",new Ne(new Float32Array(h),4)),f.setAttribute("aEnd",new Ne(new Float32Array(u),1)),f.instanceCount=l.length/4;const m={...this.shared.uniforms,uCamPos:{value:new B},uPxK:{value:.001},uMinPx:{value:o},uLift:{value:a},uColor:{value:new Gt(...n)},uAlpha:{value:i},uMode:{value:e==="water"?0:e==="earth"?1:2},uEndFade:{value:c}},g=new Te({vertexShader:qx,fragmentShader:jx,uniforms:m,transparent:!0,depthWrite:!1,side:On,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),x=new _e(f,g);x.frustumCulled=!1,x.renderOrder=r,this.group.add(x);const p={mesh:x,uniforms:m,alpha:i,count:f.instanceCount};return this.batches.push(p),p}update(t){t.getDrawingBufferSize(this._res);const e=this.camera,n=2*Math.tan(e.fov*Math.PI/360)/Math.max(1,this._res.y/t.getPixelRatio());for(const i of this.batches)i.uniforms.uCamPos.value.copy(e.position),i.uniforms.uPxK.value=n,i.mesh.visible=i.uniforms.uAlpha.value>.003}dispose(){for(const t of this.batches)t.mesh.geometry.dispose(),t.mesh.material.dispose()}}const xc=8,an=16,Zx={walk:[0,4],run:[4,4],idle:[8,2],engage:[10,4],fall:[14,3]},Is=17,Wa=["side","front","back"],Aa=["hawaii","oahu","maui"],Jx=["bare","kihei","chief"],Wc=["spear","club","musket","sling","dagger","rammer","linstock","gun"],Gc={gun:16,sling:16},Qx="hHsdetTkKCPmn",tM="gGwWb",ua={o:"#2a201b",h:"#30241e",s:"#a5704b",d:"#7b5035",e:"#2a201b",w:"#97734a",W:"#5b3d27",g:"#8a8e93",G:"#4a4d52",b:"#16110e",c:"#cdb98e",f:"#fff4c4",F:"#f2a03c",S:"#ddd6ca",Z:"#b5ad9f"},eM={hawaii:{m:"#b9791f",n:"#8a5717",kihei:"#d9a548",cloak:"#b03a2c",pattern:"#e3b23e",helmet:"#e3b23e",crest:"#b03a2c"},oahu:{m:"#76609e",n:"#544377",kihei:"#a58fcb",cloak:"#dcb03c",pattern:"#2e2824",helmet:"#2e2824",crest:"#dcb03c"},maui:{m:"#a84b22",n:"#7c3518",kihei:"#cf7f4c",cloak:"#a4342a",pattern:"#2e2824",helmet:"#a4342a",crest:"#2e2824"}};function nM(s,t){const e=eM[s],n={...ua,m:e.m,n:e.n,t:ua.s,T:ua.d,k:ua.s,K:null,C:null,P:null,H:null};return t==="kihei"?(n.k=e.kihei,n.K=e.kihei):t==="chief"&&(n.t=e.cloak,n.T=e.pattern,n.k=e.cloak,n.K=e.cloak,n.C=e.cloak,n.P=e.pattern,n.h=e.helmet,n.H=e.crest),n}function tn(s,t=0,e=0){const n={};for(const[i,o]of Object.entries(s)){const a=Number(i)+e;a<0||a>=an||(n[a]=t>=0?".".repeat(t)+o:o.slice(-t))}return n}function ri(...s){const t={};for(const e of s)if(e)for(const[n,i]of Object.entries(e)){const o=(t[n]||"").padEnd(i.length,".").split("");for(let a=0;a<i.length;a++)i[a]!=="."&&(o[a]=i[a]);t[n]=o.join("")}return t}const Wi=(s,t=null,e=null)=>({body:s,over:t?[t]:[],under:e?[e]:[]}),Af={0:"..HHH...",1:"..hhh...",2:"..hse...",3:"..sss...",4:"...d...."},iM=tn(Af,1),Tf={5:".Kktt...",6:".Kktt...",7:".KktT...",8:".CkTt..."},sM=tn(Tf,1),oM={5:".....s..",6:".....s..",7:".....s.."},aM={5:".....s..",6:".....s.."},rM={5:"....ss..",6:"......s."},cM={5:"....s...",6:"...ss..."},lM={1:"....s...",2:".....s..",3:".....s..",4:"....s..."},Zi={9:".Cmmn..."},hM={...Zi,10:".Cdns...",11:"..d.s...",12:"..d.s...",13:"..d.s...",14:"..ddss.."},uM=[{...Zi,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".d...ss."},{...Zi,10:".C.dn...",11:"...ds...",12:"...ds...",13:"...dss..",14:"...dd..."},{...Zi,10:".Csnd...",11:"..s..d..",12:".s...d..",13:".s...d..",14:".s...dd."},{...Zi,10:".C.sn...",11:"...sd...",12:"...sd...",13:"...sdd..",14:"...ss..."}],ho=tn(Zi,1),fM=[{...ho,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:"d.....s.",14:"......ss"},{...ho,10:"..C.dn..",11:"...dss..",12:"...d..s.",13:"..dd....",14:"........"},{...ho,10:"..Csnd..",11:"..s...d.",12:".s....d.",13:"s.....d.",14:"......dd"},{...ho,10:"..C.sn..",11:"...sdd..",12:"...s..d.",13:"..ss....",14:"........"}],dM={...Zi,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".dd..ss."},pM={...ho,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:".d.....s",14:"dd.....s"},mM={1:"......s.",2:"......s.",3:".....s..",4:".....s.."},gM={9:"..Cmmn..",10:"..Cdns..",11:".dd...s.",12:"d.....s.",13:".....s.."},zh={side:["........","...hhh..","...hse..",".Kktsss.",".KktTds.",".Cmmdds.","...ddss.","........"],front:["........","..hhhh..","..sees..",".sktTks.",".sddsss.","..mmmm..","..dssd..","........"],back:["........","..hhhh..","..hhhh..",".skkTts.",".sCCCCs.","..mmmm..","..dssd..","........"]};function Fh(s,t){let e=s.map(i=>i.split(""));for(let i=0;i<t;i++)e=e[0].map((o,a)=>e.map(r=>r[a]).reverse());const n={};return e.forEach((i,o)=>n[o+5]=i.join("")),n}const Nh={0:"...HH...",1:"..hhhh..",2:"..hssh..",3:"..ssss..",4:"...dd..."},Oh={5:"..kktt..",6:"..tkkT..",7:"..ttkk..",8:"..tTTt.."},Bh={5:".CC..CC.",6:".CP..PC.",7:".CC..CC.",8:".CC..CC.",9:".C....C.",10:".C....C."},vM={5:".s....s.",6:".s....s.",7:".s....s."},fa={5:"......s.",6:"......s.",7:"......s."},Mc={5:".s......",6:".s......"},xM={1:".s......",2:".s......",3:".s......",4:".s......"},MM={5:".s......",6:"..s....."},_M={5:".s....s.",6:"..s..s.."},Jn=(s,t)=>({9:"..mmmm..",10:s,...t}),Ga={11:"..sdds..",12:"..sdds..",13:"..s..s..",14:".ss..ss."},Cf=[{11:"..sdds..",12:"..s.ss..",13:"..s.ss..",14:".ss....."},Ga,{11:"..sdds..",12:"..ss.s..",13:"..ss.s..",14:".....ss."},Ga],Rf=[{11:"..sdds..",12:"..s.ss..",13:"..s.....",14:".ss....."},{11:"..sdds..",12:".s....s.",13:".s....s.",14:"........"},{11:"..sdds..",12:"..ss.s..",13:".....s..",14:".....ss."},{11:"..sdds..",12:".s....s.",13:".s....s.",14:"........"}],Lf={11:"..sdds..",12:".sd..ds.",13:".s....s.",14:"ss....ss"},Pf={11:".sd..ds.",12:"s......s",13:"........"},yM=Jn("..smnd..",Ga),wM=Cf.map(s=>Jn("..smnd..",s)),bM=Rf.map(s=>Jn("..smnd..",s)),SM=[{5:".s....s.",6:".s.....s"},{5:".s....s.",6:".s....s."},{5:".s....s.",6:"s.....s."},{5:".s....s.",6:".s....s."}],Wh=Jn("..smnd..",Lf),EM=Jn("..smnd..",Pf),Df={1:"s......s",2:"s......s",3:".s....s.",4:".s....s."},Gh={0:"...HH...",1:"..hhhh..",2:"..hhhh..",3:"..hhhh..",4:"...dd..."},Hh={5:"..tttt..",6:"..tTTt..",7:"..tTTt..",8:"..tttt.."},Vh={5:"..kkk...",6:"..kkkk..",7:"...kkk..",8:"....kk.."},$h={5:".CCCCCC.",6:".CPCCPC.",7:".CCPPCC.",8:".CPCCPC.",9:".CCCCCC.",10:"..CCCC.."},AM={5:".s....s.",6:".s....s.",7:".s....s."},da={5:".s......",6:".s......",7:".s......"},If={5:"......s.",6:"......s."},TM={1:"......s.",2:"......s.",3:"......s.",4:"......s."},CM={3:"......s.",4:"......s.",5:"......s."},RM={5:"......s.",6:".......s",7:".......s"},LM={3:".s....s.",4:".s....s.",5:".s....s."},PM=Jn("..dnms..",Ga),DM=Cf.map(s=>Jn("..dnms..",s)),IM=Rf.map(s=>Jn("..dnms..",s)),UM=[{5:".s....s.",6:"s.....s."},{5:".s....s.",6:".s....s."},{5:".s....s.",6:".s.....s"},{5:".s....s.",6:".s....s."}],Xh=Jn("..dnms..",Lf),kM=Jn("..dnms..",Pf),zM=Df,FM={side:(s,t,e=!1)=>e?[iM,sM,t,s]:[Af,Tf,t,s],front:(s,t,e=!1)=>e?[s,tn(Nh,0,1),tn(Oh,0,1),tn(Bh,0,1),tn(t,0,1)]:[s,Nh,Oh,Bh,t],back:(s,t,e=!1)=>e?[s,tn(Gh,0,1),tn(Hh,0,1),tn(Vh,0,1),tn($h,0,1),tn(t,0,1)]:[s,Gh,Hh,Vh,$h,t]},NM={side:{stand:hM,walk:uM,run:fM,brace:dM,lunge:pM,leap:gM,flung:mM},front:{stand:yM,walk:wM,run:bM,brace:Wh,lunge:Wh,leap:EM,flung:Df},back:{stand:PM,walk:DM,run:IM,brace:Xh,lunge:Xh,leap:kM,flung:zM}},OM={side:{down:oM,grip:aM,out:rM,back:cM,up:lM,free:null,pump:null},front:{down:vM,grip:ri(fa,Mc),out:ri(fa,MM),back:ri(fa,Mc),up:ri(fa,xM),both:_M,pump:SM},back:{down:AM,grip:ri(da,If),out:ri(da,CM),back:ri(da,RM),up:ri(da,TM),both:LM,pump:UM}};function BM(s,t){const e=FM[s],n=NM[s],i=OM[s],o=t[s],a=[],r=s==="side";for(let c=0;c<4;c++)a.push(Wi(e(n.walk[c],i[o.walk.arm]||i.down),o.walk.over,o.walk.under));for(let c=0;c<4;c++){const l=r?tn(i[o.run.arm]||i.down,1):ri(i.pump[c],o.run.arm==="grip"?s==="front"?Mc:If:null);a.push(Wi(e(n.run[c],l,r),o.run.over,o.run.under))}for(const c of o.idle)a.push(Wi(e(n.stand,i[c.arm]||i.down),c.over,c.under));for(const[c,l,h,u]of o.engage)a.push(Wi(e(n[l],i[c]||i.down,l==="lunge"),h,u));return a.push(Wi(e(n.leap,n.flung,r),o.leap||null)),a.push(Wi([Fh(zh[s],1)])),a.push(Wi([Fh(zh[s],2)])),a}const xn=(s,t,e=6)=>{const n={};for(let i=s;i<=t;i++)n[i]=".".repeat(e)+"w";return n[s]=".".repeat(e)+"W",n},WM={side:{walk:{arm:"down",over:xn(0,10)},run:{arm:"down",over:{8:"wwwwwwwW"}},idle:[{arm:"down",over:xn(0,14)},{arm:"grip",over:{...xn(1,14),0:".......W",1:"......w."}}],engage:[["back","brace",{6:"wwwwW..."}],["out","lunge",{6:"..wwwwwW"}],["grip","brace",{1:".......W",2:"......w.",3:"......w.",4:".....w..",5:".....w..",6:"....w...",7:"....w..."}],["grip","brace",{1:".......W",2:"......w.",3:"......w.",4:".....w..",5:".....w..",6:"....w...",7:"....w..."}]],leap:{0:".......W",1:"......w.",2:".....w..",3:"....w..."}},front:{walk:{arm:"grip",over:xn(0,11,0)},run:{arm:"grip",over:{7:"..w.....",8:"..W....."}},idle:[{arm:"grip",over:xn(0,14,0)},{arm:"down",over:{...xn(1,14,0),0:".W......"}}],engage:[["up","brace",{0:"....w...",1:"...w....",2:"..w.....",3:".w......",4:"W......."}],["out","lunge",{7:"..w.....",8:".WW.....",9:"..W....."}],["grip","brace",xn(0,12,0)],["grip","brace",xn(0,12,0)]],leap:{0:"W.......",1:"w.......",2:".w......"}},back:{walk:{arm:"grip",over:xn(0,11,7)},run:{arm:"grip",over:{2:".......W",3:".......w",4:"......w.",5:"......w."}},idle:[{arm:"grip",over:xn(0,14,7)},{arm:"down",over:{...xn(1,14,7),0:"......W."}}],engage:[["back","brace",{2:".......W",3:".......w",4:".......w",5:"......w.",6:"......w.",7:"......w.",8:".....w..",9:".....w.."}],["out","lunge",{0:"......W.",1:"......w.",2:"......w."}],["grip","brace",xn(0,12,7)],["grip","brace",xn(0,12,7)]],leap:{0:".......W",1:".......w",2:"......w."}}},GM={side:{walk:{arm:"grip",over:{5:"WWwwww.."}},run:{arm:"grip",over:{1:"......WW",2:"......WW",3:"......w.",4:"......w.",5:"......w."}},idle:[{arm:"down",over:{7:"......w.",8:"......w.",9:"......WW",10:"......WW"}},{arm:"down",over:{7:"......w.",8:"......w.",9:".....WW.",10:".....WW."}}],engage:[["up","brace",null,{0:"WWwww...",1:"WW......"}],["out","lunge",{6:".......w",7:"......WW",8:"......WW"}],["down","brace",{8:"......w.",9:"......w.",10:".....WW.",11:".....WW."}],["down","brace",{8:"......w.",9:"......w.",10:".....WW.",11:".....WW."}]],leap:{0:"......WW",1:"......WW"}},front:{walk:{arm:"grip",over:{3:"WW......",4:"Ww......"}},run:{arm:"grip",over:{1:".WW.....",2:".WW.....",3:".w......",4:".w......"}},idle:[{arm:"down",over:{8:".w......",9:".w......",10:"WW......",11:"WW......"}},{arm:"down",over:{8:".w......",9:"w.......",10:"WW......",11:"W......."}}],engage:[["up","brace",null,{0:"..wwWW..",1:"....WW.."}],["out","lunge",{6:"..WW....",7:"..WW...."}],["down","brace",{8:".w......",9:".w......",10:"WW......",11:"WW......"}],["down","brace",{8:".w......",9:".w......",10:"WW......",11:"WW......"}]],leap:{0:"WW......",1:"WW......"}},back:{walk:{arm:"grip",over:{3:"......WW",4:"......wW"}},run:{arm:"grip",over:{1:".....WW.",2:".....WW.",3:"......w.",4:"......w."}},idle:[{arm:"down",over:{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}},{arm:"down",over:{8:"......w.",9:".......w",10:"......WW",11:".......W"}}],engage:[["up","brace",{0:"..WWww..",1:"..WW...."}],["out","lunge",{1:"......W.",2:"......W."}],["down","brace",{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}],["down","brace",{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}]],leap:{0:"......WW",1:"......WW"}}},Wn=(s,t=6)=>{const e={},n=".".repeat(t);for(let i=s;i<s+6;i++)e[i]=n+"G";e[s]=n+"g";for(let i=s+6;i<=14;i++)e[i]=n+"W";return e},HM={side:{walk:{arm:"grip",over:{6:".....W..",7:".....WW."},under:{0:".g......",1:".G......",2:".G......",3:"..G.....",4:"..G.....",5:"...G....",6:"....G..."}},run:{arm:"grip",over:{1:".......g",2:"......G.",3:"......G.",4:".....G..",5:".....W..",6:"....W...",7:"...W...."}},idle:[{arm:"grip",over:Wn(3)},{arm:"down",over:Wn(3)}],engage:[["out","brace",{4:"..WWGGGg"}],["out","brace",{3:".......F",4:".WWGGGgf",5:".......F"}],["grip","brace",{0:"......SS",1:".....SSZ",2:"......Z.",5:".....W..",6:"......G.",7:"......G."},{2:".......g"}],["grip","brace",{0:".....SS.",1:"....SZ..",5:".....W..",6:"......G.",7:"......G."},{2:".......g"}]],leap:{0:"......g.",1:"......G.",2:".....W.."}},front:{walk:{arm:"grip",over:{6:".W......"},under:{0:"g.......",1:"G.......",2:"G.......",3:".G......",4:".G......",5:".G......"}},run:{arm:"grip",over:{4:"......g.",5:".....G..",6:"....G...",7:"...W....",8:"..W....."}},idle:[{arm:"grip",over:Wn(3,0)},{arm:"down",over:Wn(3,0)}],engage:[["both","brace",{3:".gg.....",4:".gb.....",5:"..W....."}],["both","brace",{1:".F......",2:"FfF.....",3:"fffF....",4:"FfF.....",5:".F......"}],["grip","brace",{0:".SSZ....",1:"SZSS....",2:".SZ....."},Wn(5,0)],["grip","brace",{0:"SZ......",1:".S......"},Wn(5,0)]],leap:{0:"g.......",1:"G.......",2:".W......"}},back:{walk:{arm:"grip",over:{6:"......W."},under:{0:".......g",1:".......G",2:".......G",3:"......G.",4:"......G.",5:"......G."}},run:{arm:"grip",over:{4:".g......",5:"..G.....",6:"...G....",7:"....W...",8:".....W.."}},idle:[{arm:"grip",over:Wn(3,7)},{arm:"down",over:Wn(3,7)}],engage:[["both","brace",{1:"......g.",2:"......G.",3:"......G.",4:"......W."}],["both","brace",{0:".....FfF",1:"......f.",2:"......G.",3:"......G.",4:"......W."}],["grip","brace",{0:"....SSZ.",1:".....ZSS",2:"......S."},Wn(5,7)],["grip","brace",{0:".....ZS.",1:"......S."},Wn(5,7)]],leap:{0:".......g",1:".......G",2:"......W."}}},VM={side:{walk:{arm:"down",over:{8:".........c",9:".........c",10:".........cg"}},run:{arm:"down",over:{8:".......cc.",9:"......g..."}},idle:[{arm:"down",over:{8:".........c",9:".........c",10:".........cg"}},{arm:"down",over:{8:".........c",9:"..........c",10:"..........cg"}}],engage:[["up","brace",null,{0:".....gccc"}],["up","brace",{0:"........ccg"}],["out","lunge",{4:".............g",5:"...........c"}],["out","brace",{3:"...............g",6:"..........c",7:"..........c"}]],leap:{0:"..........c",1:"..........c"}},front:{walk:{arm:"grip",over:{7:".....c",8:".....c",9:"....gc"}},run:{arm:"grip",over:{7:"....c.",8:"...cg."}},idle:[{arm:"down",over:{8:".....c",9:".....c",10:"....gc"}},{arm:"down",over:{8:".....c",9:"....c.",10:"...gc."}}],engage:[["up","brace",null,{0:"..gccc"}],["up","brace",{0:".....ccccg"}],["out","lunge",{8:"...g",7:"....c"}],["out","brace",{11:".g",8:".....c"}]],leap:{0:".....c",1:".....c"}},back:{walk:{arm:"grip",over:{7:"..........c",8:"..........c",9:"..........cg"}},run:{arm:"grip",over:{7:"...........c",8:"...........gc"}},idle:[{arm:"down",over:{8:"..........c",9:"..........c",10:"..........cg"}},{arm:"down",over:{8:"..........c",9:"...........c",10:"...........cg"}}],engage:[["up","brace",{0:".....gcccc"}],["up","brace",null,{0:"..........cccg"}],["out","lunge",{1:"............g",2:"...........c"}],["out","brace",{0:"..............g",4:"...........c"}]],leap:{0:"..........c",1:"..........c"}}},$M={side:{walk:{arm:"down",over:{8:".....W..",9:".....g.."}},run:{arm:"grip",over:{6:"......Wg"}},idle:[{arm:"down",over:{8:".....W..",9:".....g.."}},{arm:"grip",over:{4:"......g.",5:"......W."}}],engage:[["up","brace",{0:"....Wg.."}],["out","lunge",{6:".......W",7:".......g"}],["grip","brace",{4:"......g.",5:"......W."}],["grip","brace",{4:"......g.",5:"......W."}]],leap:null},front:{walk:{arm:"down",over:{8:".W......",9:".g......"}},run:{arm:"grip",over:{6:"..g....."}},idle:[{arm:"down",over:{8:".W......",9:".g......"}},{arm:"grip",over:{4:".g......",5:".W......"}}],engage:[["up","brace",{0:".g......"}],["out","lunge",{7:"..W.....",8:"..gg...."}],["grip","brace",{4:".g......",5:".W......"}],["grip","brace",{4:".g......",5:".W......"}]],leap:null},back:{walk:{arm:"down",over:{8:"......W.",9:"......g."}},run:{arm:"grip",over:{4:"......g."}},idle:[{arm:"down",over:{8:"......W.",9:"......g."}},{arm:"grip",over:{3:"......g.",4:"......W."}}],engage:[["up","brace",{0:"......g."}],["out","lunge",{1:"......g.",2:"......W."}],["grip","brace",{3:"......g.",4:"......W."}],["grip","brace",{3:"......g.",4:"......W."}]],leap:null}},Mn=(s,t,e=6)=>{const n={};for(let i=s;i<=t;i++)n[i]=".".repeat(e)+"w";return n[s]=".".repeat(Math.max(0,e-1))+(e>0?"WW":"W"),n},XM={side:{walk:{arm:"down",over:Mn(0,10)},run:{arm:"down",over:{7:"wwwwwwWW"}},idle:[{arm:"down",over:Mn(0,14)},{arm:"grip",over:Mn(1,14)}],engage:[["out","brace",{6:"..wwwwWW"}],["out","lunge",{6:"...wwwwW"}],["back","brace",{6:"wwwwwW.."}],["back","brace",{6:"wwwwwW.."}]]},front:{walk:{arm:"grip",over:Mn(0,11,0)},run:{arm:"grip",over:{6:"WWwwww.."}},idle:[{arm:"grip",over:Mn(0,14,0)},{arm:"down",over:Mn(1,14,0)}],engage:[["both","brace",{5:"WW......",6:".wwww..."}],["both","lunge",{7:"Wwwww..."}],["grip","brace",Mn(0,12,0)],["grip","brace",Mn(0,12,0)]]},back:{walk:{arm:"grip",over:Mn(0,11,7)},run:{arm:"grip",over:{6:"..wwwwWW"}},idle:[{arm:"grip",over:Mn(0,14,7)},{arm:"down",over:Mn(1,14,7)}],engage:[["both","brace",{2:"......WW",3:"......w.",4:"......w.",5:".....w..",6:".....w.."}],["both","lunge",{0:"......WW",1:"......w.",2:"......w.",3:".....w.."}],["grip","brace",Mn(0,12,7)],["grip","brace",Mn(0,12,7)]]}},Ke=(s,t,e=6)=>{const n={};for(let i=s;i<=t;i++)n[i]=".".repeat(e)+"w";return n[s]=".".repeat(e)+"F",n},qM={side:{walk:{arm:"down",over:Ke(0,10)},run:{arm:"down",over:{4:".......F",5:"......w.",6:".....w..",7:"....w...",8:"...w...."}},idle:[{arm:"down",over:Ke(0,14)},{arm:"down",over:{...Ke(1,14),0:"......f."}}],engage:[["out","brace",{7:"......w.",8:"......w.",9:".......w",10:".......F"}],["out","lunge",{7:".......w",8:".......w",9:".......w",10:".......w",11:".......f"}],["grip","brace",Ke(0,9)],["grip","brace",Ke(0,9)]]},front:{walk:{arm:"grip",over:Ke(0,11,0)},run:{arm:"grip",over:{3:"F.......",4:".w......",5:"..w....."}},idle:[{arm:"grip",over:Ke(0,14,0)},{arm:"down",over:{...Ke(1,14,0),0:"f......."}}],engage:[["grip","brace",{6:".w......",7:"w.......",8:"F......."}],["out","lunge",{7:".w......",8:"w.......",9:"f......."}],["grip","brace",Ke(0,9,0)],["grip","brace",Ke(0,9,0)]]},back:{walk:{arm:"grip",over:Ke(0,11,7)},run:{arm:"grip",over:{3:".......F",4:"......w.",5:".....w.."}},idle:[{arm:"grip",over:Ke(0,14,7)},{arm:"down",over:{...Ke(1,14,7),0:".......f"}}],engage:[["grip","brace",{4:".......F",5:"......w.",6:"......w."}],["out","lunge",{3:".......f",4:"......w.",5:"......w."}],["grip","brace",Ke(0,9,7)],["grip","brace",Ke(0,9,7)]]}},Ts={9:"....gggggggggg..",10:"..GGGGWWWGGGGG..",11:"...WWW.w.W...G..",12:"..WW.WwwwW......",13:".WW..W.w.W......",14:"WW....WWW......."},jM={...Ts,11:"...WWWw.wW...G..",12:"..WW.W.w.W......",13:".WW..Ww.wW......"},ao={8:"..ww..gggg..ww..",9:"..WW..gbbg..WW..",10:"..WW.WgbbgW.WW..",11:"..WWWWWggWWWWW..",12:"..WW..W..W..WW..",13:"..ww........ww.."},ro={8:"..ww...gg...ww..",9:"..WW..GggG..WW..",10:"..WW.WGGGGW.WW..",11:"..WWWWWWWWWWWW..",12:"..WW...WW...WW..",13:"..ww...WW...ww..",14:".......WW......."},Ze=(s,t=null,e=0,n=0)=>({body:[tn(s,e,n)],over:t?[t]:[],under:[]}),Uf={side:[...[0,1,0,1,0,1,0,1,0,0].map(s=>Ze(s?jM:Ts)),Ze(Ts,{8:"..............F.",9:"..............fF",10:"..............ff",11:"..............F."}),Ze(Ts,{6:"............SS..",7:"...........SSSS.",8:"..........SSSZS.",9:"...........ZSS..",10:"............Z..."},-1),Ze(Ts,{3:"...........SS...",4:"..........SZSS..",5:"...........ZS..."}),Ze(Ts,{2:"............S..."})],front:[...[0,0,0,0,0,0,0,0,0,0].map(()=>Ze(ao)),Ze(ao,{5:".......FF.......",6:".....FfffF......",7:"....FfffffF.....",8:"...FfffffffF....",9:"....FfffffF.....",10:".....FfffF......",11:".......FF......."}),Ze(ao,{4:"......SSZ.......",5:"....SSSSSS......",6:"...SZSSSSZS.....",7:"....SSZSS.......",8:"......S........."},0,-1),Ze(ao,{1:".......SS.......",2:".....SZSSS......",3:"......ZS........"}),Ze(ao,{0:"......S........."})],back:[...[0,0,0,0,0,0,0,0,0,0].map(()=>Ze(ro)),Ze(ro,{4:".......FF.......",5:"......FffF......",6:".......ff.......",7:".......FF......."}),Ze(ro,{3:"......SSZ.......",4:".....SZSSS......",5:"......SSZ......."},0,1),Ze(ro,{0:"......SS........",1:".....SZSS.......",2:"......Z........."}),Ze(ro,{0:".......S........"})]};for(const s of Wa)Uf[s].push(...[0,1,2].map(()=>({body:[],over:[],under:[]})));const YM={spear:WM,club:GM,musket:HM,sling:VM,dagger:$M,rammer:XM,linstock:qM},Ta={};for(const s of Wc){Ta[s]={};for(const t of Wa)if(s==="gun")Ta.gun[t]=Uf[t];else{const e=BM(t,YM[s]);Ta[s][t]=Gc[s]?e.map(n=>({body:n.body.map(i=>tn(i,4)),over:n.over,under:n.under})):e}}function KM(){const s=[];for(const t of Aa){for(const e of["bare","kihei"])for(const n of["spear","club","musket","sling","dagger"])s.push({kind:n,side:t,dress:e});for(const e of["spear","club"])s.push({kind:e,side:t,dress:"chief"})}return s.push({kind:"rammer",side:"hawaii",dress:"bare"},{kind:"linstock",side:"hawaii",dress:"kihei"},{kind:"gun",side:"hawaii",dress:"bare"}),s}const ZM=200,JM=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];function Wr(s,t,e){const n=Array.from({length:an},()=>new Array(t).fill("."));for(const i of s)for(const[o,a]of Object.entries(i)){const r=Number(o);if(!(r<0||r>=an))for(let c=0;c<Math.min(t,a.length);c++){const l=a[c];l!=="."&&e[l]&&(n[r][c]=l)}}return n}function QM(s,t,e,n){const i=Wr(s.body,t,e),o=Wr(s.over,t,e),a=Wr(s.under,t,e),r=(h,u)=>u>=0&&u<an&&h>=0&&h<t&&n.includes(i[u][h]),c=new Uint8Array(t*an*4),l=(h,u,f)=>{if(f===".")return;const m=e[f];m&&c.set([...JM(m),f==="f"||f==="F"?ZM:255],(u*t+h)*4)};for(let h=0;h<an;h++)for(let u=0;u<t;u++)l(u,h,a[h][u]),!r(u,h)&&(r(u-1,h)||r(u+1,h)||r(u,h-1)||r(u,h+1))&&l(u,h,"o"),l(u,h,i[h][u]),l(u,h,o[h][u]);return c}function t_(){const s=KM(),t=Wa.length*Is*16,e=s.length*an,n=new Uint8Array(t*e*4),i=new Map;s.forEach((r,c)=>{const l=Gc[r.kind]||xc;r.w=l;const h=nM(r.side,r.dress),u=r.kind==="gun"?tM:Qx;Wa.forEach((f,m)=>{Ta[r.kind][f].forEach((g,x)=>{const p=QM(g,l,h,u),d=(m*Is+x)*l;for(let v=0;v<an;v++)n.set(p.subarray(v*l*4,(v+1)*l*4),((c*an+v)*t+d)*4)})}),i.set(`${r.kind}/${r.side}/${r.dress}`,{y:c*an,w:l})});const o=(r,c,l)=>i.get(`${r}/${c}/${l}`)||i.get(`${r}/${c}/bare`)||i.get(`${r}/hawaii/bare`)||i.get(`${r}/hawaii/kihei`);return{width:t,height:e,data:n,rows:s,facingW:Is,cell:(r,c,l,h,u,f=0)=>{const m=o(r,c,l),[g,x]=Zx[h];return[(f*Is+g+u%x)*m.w,m.y,m.w,an]},at:o,has:(r,c,l)=>i.has(`${r}/${c}/${l}`)}}const kf=`
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
`,zf=`
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
`,e_=`
${He}
${ln}
${qs}
${kf}
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
`,n_=`
${He}
${zf}
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
`,i_=`
${He}
${ln}
${kf}
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
`,s_=`
${He}
${zf}
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
`,o_=2400,_n={file:0,knot:1,pacer:2,rank:3,duel:4,piece:5,crew:6,ring:7,leap:8},co=Object.fromEntries(Wc.map((s,t)=>[s,t])),lo=0,qh=4,pa=8,ma=10,a_=14,Ce={right:0,left:1,front:2,back:3},jh=[0,0,1,2],Yh=1.25,r_=9,c_=20,Kh=.35,l_=["march","run","stand","engage","surround","leap"],Gr=["spear","club","sling","dagger","musket"],h_=["spear","club","dagger"],kn={run:.6,least:18,across:9,up:13,pull:70,fade:10,air:1.6,gap:1.1},Ha=(8/85)**1.5;function u_(s){return 1+3*((8/Math.max(s,.5))**1.5-Ha)/(1-Ha)}function f_(s){return 8/(Ha+(s-1)*(1-Ha)/3)**(2/3)}function d_(s,t){return Math.max(2,Math.min(4*t,u_(s)*t))}const $n=.3,Us=.2,Zh=2;class p_{constructor(){this.L=NaN,this.s=NaN,this.k=2,this.t=0}step(t,e,n,i){Number.isFinite(this.L)||(this.L=Math.round(t));const o=Math.abs(t-this.s)>1e-4;this.s=t;let a=Math.max(t-Us,Math.min(t+Us,this.L));const r=Math.floor(a),c=a-r;(!o||e===0)&&c>.5-$n/2&&c<.5+$n/2&&(a=r+(c<.5?.5-$n/2:.5+$n/2)),e===0?this.L=a:this.L+=Math.max(-Zh*e,Math.min(Zh*e,a-this.L)),this.L=Math.max(n,Math.min(i,this.L));const l=Math.floor(this.L+1e-9);this.k=l;const h=l>=i?0:(this.L-l-(.5-$n/2))/$n;return this.t=h<1e-6?0:h>1-1e-6?1:h,this}}function m_(s){const t=[];for(let e=2;e<4*s;e++){const n=i=>+f_(i/s).toFixed(2);t.push({k:e,in:[n(e+.5-$n/2+Us),n(e+.5+$n/2+Us)],out:[n(e+.5+$n/2-Us),n(e+.5-$n/2-Us)]})}return t}function g_(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const v_=/\bretreat|\bpursu|\bfalls? back|\bescap|\bflee(s|ing)?\b|\brout(ed|s)?\b|\bgot away|\bover the ridge|\bold path/i,x_=/\bposts?\b|ashore|encamp|in order/i;function M_(s){const t=`${s.name||""} ${s.note||""}`;return v_.test(t)?"run":x_.test(`${s.name||""}`)||/putting itself in order|encamped|organising/i.test(s.note||"")?"stand":"walk"}function __(s){const t=s.p.behaviour;if(l_.includes(t))return t;if(s.line)return"engage";const e=M_(s.p);return e==="walk"?"march":e}function Fe(s,t,e){const n=s.cum,i=s.pts;let o=1;for(;o<n.length-1&&n[o]<t;)o++;const a=i[o-1],r=i[o],c=n[o]-n[o-1]||1,l=Math.max(0,Math.min(1,(t-n[o-1])/c));return e[2]=(r[0]-a[0])/c,e[3]=(r[1]-a[1])/c,e[0]=a[0]+(r[0]-a[0])*l,e[1]=a[1]+(r[1]-a[1])*l,e}const Jh=s=>s.p.stop===null||s.p.stop===void 0?null:[s.p.stop].flat(),ga=(s,t)=>{const e=Jh(s),n=Jh(t);return!e||!n||e.some(i=>n.includes(i))};function y_(s,t,e){const n=t.reduce((c,l)=>c+Math.max(0,s[l]||0),0)||1,i=t.map(c=>Math.max(0,s[c]||0)/n*e),o=i.map(Math.floor);let a=e-o.reduce((c,l)=>c+l,0);const r=i.map((c,l)=>[c-Math.floor(c),l]).sort((c,l)=>l[0]-c[0]);for(let c=0;a>0;c++,a--)o[r[c%r.length][1]]++;return Object.fromEntries(t.map((c,l)=>[c,o[l]]))}class uo{constructor(t,e,n){this.app=t,this.recs=e,this.sheet=t_();const i=g_(1795),o=e.map(()=>[]);this.fronts=[],this.pairs=[],this.guns=[];for(const w of e)w.behaviour=__(w),w.arms=w.p.arms&&typeof w.p.arms=="object"?w.p.arms:null,w.enemy=this.enemyOf(w,e);const a=e.filter(w=>w.line),r=new Set;for(const w of a)for(const E of a){if(w===E||r.has(w)||r.has(E)||w.event!==E.event||w.side===E.side||JSON.stringify(w.p.stop??w.step)!==JSON.stringify(E.p.stop??E.step))continue;const[A,_]=this.mid(w),[y,C]=this.mid(E);if(Math.hypot(A-y,_-C)>4)continue;const[P,I]=w.side==="oahu"?[E,w]:[w,E];r.add(P),r.add(I),this.planFront(P,I,o,e,i)}for(const w of e){if(w.line||w.behaviour!=="run")continue;const E=this.heading(w);let A=null,_=5;for(const y of e){if(y===w||y.line||y.behaviour!=="run"||y.event!==w.event||y.side===w.side||!ga(y,w)||y.chase)continue;const C=this.heading(y);if(E[0]*C[0]+E[1]*C[1]<.9)continue;const P=Math.hypot(w.pts[0][0]-y.pts[0][0],w.pts[0][1]-y.pts[0][1]);(y.pts[0][0]-w.pts[0][0])*E[0]+(y.pts[0][1]-w.pts[0][1])*E[1]<0||P<_&&(_=P,A=y)}A&&w.side!=="oahu"&&(w.chase=A)}const c=e.map((w,E)=>E).sort((w,E)=>(e[w].chase?1:0)-(e[E].chase?1:0));for(const w of c){const E=e[w];E.line&&!r.has(E)?this.planRanks(E,null,o[w],i):E.line||this.planForce(E,o[w],i,e)}e.forEach((w,E)=>this.armOut(w,o[E],i));const l=o.reduce((w,E)=>w+E.length,0);this.count=l;const h=Math.max(1,l),u=()=>new Float32Array(h),f=()=>new Uint8Array(h),m=()=>new Int8Array(h);this.f={rec:new Uint16Array(h),mode:f(),kind:f(),side:f(),dress:f(),row:u(),cw:u(),s:u(),s0:u(),lat:u(),spd:u(),thr:u(),inAt:u(),outAt:u(),far:u(),ph:u(),tm:u(),tt:u(),st:f(),off:u(),offTo:u(),face:f(),hand:f(),mirror:m(),grp:new Int16Array(h),role:f(),row2:f(),vis:u(),gm:u(),gx:u(),gz:u(),x:u(),z:u(),hx:u(),hz:u(),lift:u(),air:f(),k:u(),tint:u(),wet:f(),fr:f(),dx:m(),dy:m(),dx0:m(),dy0:m()};const g=this.f;let x=0;e.forEach((w,E)=>{w.o=x,w.n=o[E].length;for(const A of o[E]){const _=x++;g.rec[_]=E,g.mode[_]=_n[A.mode],g.kind[_]=co[A.kind],g.side[_]=Aa.indexOf(A.side),g.dress[_]=Jx.indexOf(A.dress);const y=this.sheet.at(A.kind,A.side,A.dress);g.row[_]=y.y,g.cw[_]=y.w,g.s[_]=g.s0[_]=A.s??0,g.lat[_]=A.lat??0,g.spd[_]=A.spd??1,g.thr[_]=A.thr??i(),g.inAt[_]=A.inAt??-1e9,g.outAt[_]=A.outAt??1e9,g.far[_]=85+i()*25,g.ph[_]=A.ph??i(),g.tm[_]=A.tm??1+i()*6,g.face[_]=Ce.right,g.hand[_]=i()<.12?1:0,g.grp[_]=A.grp??-1,g.dx0[_]=A.dx??0,g.dy0[_]=A.dy??0,g.role[_]=A.role??0,g.row2[_]=A.row2??0,g.tint[_]=.9+i()*.18,g.gx[_]=1e9}}),this.marks=new Float32Array(h*4),this.jump=new Float32Array(h*3);const p=new Ye(this.sheet.data,this.sheet.width,this.sheet.height,Ee,de);p.minFilter=p.magFilter=ie,p.generateMipmaps=!1,p.needsUpdate=!0,this.texture=p;const d=Math.max(1,Math.min(l,o_));this.cap=d;const v=d*2;this.capI=v;const M=new Po;M.setAttribute("position",new Le(new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),3)),M.setIndex([0,1,2,0,2,3]);const S=w=>{const E=new Ne(new Float32Array(v*4),4);return E.setUsage(wn),M.setAttribute(w,E),E};this.aFoot=S("aFoot"),this.aCell=S("aCell"),this.aDraw=S("aDraw"),this.aMix=S("aMix"),this.attrs=[this.aFoot,this.aCell,this.aDraw,this.aMix],M.instanceCount=0,this.geometry=M,this.range={start:0,count:0},this.own={uSheet:{value:p},uViewport:{value:new Ht(1,1)},uPxW:{value:.001},uFigS:{value:null},uHasS:{value:0}};const b={...n.uniforms,...this.own};this.material=new Te({vertexShader:e_,fragmentShader:n_,uniforms:b,transparent:!0,blending:gi,depthWrite:!0}),this.shadowMaterial=new Te({vertexShader:i_,fragmentShader:s_,uniforms:b,transparent:!0,depthWrite:!1,blending:sc}),this.mesh=new _e(M,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=8,this.shadows=new _e(M,this.shadowMaterial),this.shadows.frustumCulled=!1,this.shadows.renderOrder=7,this.group=new We,this.group.add(this.shadows,this.mesh),this.time=0,this.frame=0,this.thin=1,this.drawn=0,this.instances=0,this.scale=new p_,this.unit=.03,this.view={rx:1,rz:0,ax:0,az:-1,sinP:.5},this._p=[0,0,0,0],this._v4=new ee,this._size=new Ht}enemyOf(t,e){for(const n of[!0,!1]){let i=0,o=0,a=0;for(const r of e)if(!(r.event!==t.event||r.side===t.side||n&&!ga(r,t)))for(const[c,l]of r.pts)i+=c,o+=l,a++;if(a)return[i/a,o/a]}return null}mid(t){return Fe(t,t.total/2,[0,0,0,0])}heading(t){const e=t.pts[0],n=t.pts.at(-1),i=Math.hypot(n[0]-e[0],n[1]-e[1])||1;return[(n[0]-e[0])/i,(n[1]-e[1])/i]}cannonOf(t){if(t.arms)return Math.max(0,Math.round(t.arms.cannon||0));const e=Number.isFinite(t.p.from)?t.p.from:1795;return t.line&&t.side==="hawaii"&&e>=1790?Math.max(1,Math.min(3,Math.round(t.total/2.5))):0}sharesOf(t){if(t.arms)return t.arms;const n=(Number.isFinite(t.p.from)?t.p.from:1795)<1790?0:t.side==="hawaii"?.14:.06;return{spear:.7-n,club:.3,musket:n}}planForce(t,e,n,i){if(t.total<.05)return;t.file=/path/i.test(t.p.name||"")&&t.total<12;const a=t.behaviour;a==="stand"||a==="engage"?this.planStand(t,e,n):a==="surround"?this.planSurround(t,e,n,i):a==="leap"?this.planLeap(t,e,n,i):this.planFiles(t,e,n)}planFiles(t,e,n,{n:i=0,from:o=0,to:a=t.total,at:r=1}={}){var v;const c=Math.max(.05,a-o),l=t.behaviour==="run"||t.behaviour==="surround",h=t.file,f=i||Math.max(12,Math.min(300,Math.round(c*(h?2.5:l?4:5)))),m=h?1:3,g=h?.03:t.side==="hawaii"?.32:.26;let x;if((v=t.chase)!=null&&v.knots){const M=c/Math.max(.05,t.chase.total);x=t.chase.knots.map(S=>({u:S.u,sp:S.sp*M}))}else x=Array.from({length:Math.max(3,Math.min(9,Math.round(f/14)))},()=>({u:n(),sp:l?.85+n()*.3:.88+n()*.24}));t.knots=x;const p=Math.min(c*.15,4),d=t.behaviour==="march"?this.cannonOf(t):0;for(let M=0;M<d;M++){const S=x[M%x.length],b=this.guns.push({r:t,kind:"haul",front:-1,s:o+(S.u+.03)%1*c,spd:S.sp,lat:0,inAt:o+n()*p*.6,outAt:a-p*.2-n()*p,x:0,z:0,ax:1,az:0,period:8,phase:0,on:!1})-1;this.crewOut(e,t,b,n()*.3)}for(let M=0;M<f;M++){const S=x[M%x.length];let b=(S.u+(n()-.5)*(n()<.75?.05:.22))%1;b<0&&(b+=1);const w=Math.floor(n()*m);e.push({mode:"file",s:o+b*c,lat:m>1?((w-(m-1)/2)*.7+(n()-.5)*.5)*g:(n()-.5)*g,spd:S.sp*(.97+n()*.06),inAt:o+n()*p*.6,outAt:a-(a<t.total?0:p*.2)-n()*p*r})}}planStand(t,e,n){const i=t.total,o=i<2,a=Math.max(3,Math.min(12,Math.round(i/2.4)));if(t.enemy){const l=this.mid(t);t.pressed=Math.hypot(t.enemy[0]-l[0],t.enemy[1]-l[1])<6}for(let l=0;l<a;l++){const h=Math.max(0,Math.min(i,(l+.5)/a*i+(n()-.5)*(i/a)*.4)),u=o?4+Math.floor(n()*3):6+Math.floor(n()*9),f=o?4:5;for(let m=0;m<u;m++){const g=Math.round((m-(u-1)/2)*f+(n()-.5)*3);e.push({mode:"knot",s:h,lat:(n()-.5)*.12,dx:g,dy:Math.round((n()-.5)*3),tm:1+n()*6})}if(!o||l===1)for(let m=0;m<2;m++)e.push({mode:"pacer",s:h+(n()-.5)*.8,lat:(n()-.5)*.4,spd:.4+n()*.3,noChief:!0})}const r=this.cannonOf(t),c=[0,0,0,0];for(let l=0;l<r;l++){Fe(t,(l+.7)/(r+.4)*i,c);const h=this.guns.push({r:t,kind:"park",front:-1,s:0,spd:0,lat:0,inAt:0,outAt:0,x:c[0]-c[3]*.08,z:c[1]+c[2]*.08,ax:c[2],az:c[3],period:8,phase:n(),on:!0})-1;if(t.enemy){const u=t.enemy[0]-c[0],f=t.enemy[1]-c[1],m=Math.hypot(u,f)||1;this.guns[h].ax=u/m,this.guns[h].az=f/m}this.crewOut(e,t,h,n()*.3)}}planSurround(t,e,n,i){const o=t.total,a=Math.max(24,Math.min(64,Math.round(o*12))),r=t.pts.at(-1),c=[0,0,0,0];Fe(t,o,c);let l=null,h=3;for(const S of i)if(!(S===t||S.event!==t.event||S.side===t.side||!ga(S,t)||!(S.line||S.behaviour==="stand"||S.behaviour==="engage")))for(let b=0;b<=S.total;b+=Math.max(.02,S.total/40)){const w=Fe(S,b,[0,0,0,0]),E=Math.hypot(w[0]-r[0],w[1]-r[1]);E<h&&(h=E,l=S)}let u=-c[3],f=c[2],m=.4,[g,x]=r;if(l){const S=this.heading(l);u=S[0],f=S[1],m=Math.max(.2,l.total/2),[g,x]=this.mid(l)}const p=-c[2],d=-c[3],v=-f*p+u*d<0?-1:1;t.ring={cx:g,cz:x,ux:u,uz:f,vx:p,vz:d,nx:-f*v,nz:u*v,half:m};const M=Math.min(28,Math.round(a*.45));for(let S=0;S<M;S++){const b=S%2,w=(((S>>1)+.5+(n()-.5)*.5)/Math.ceil(M/2)*2-1)*(72*Math.PI/180);e.push({mode:"ring",s:w,row2:b,close:!0,tm:.5+n()*3,ph:n()})}this.planFiles(t,e,n,{n:a-M,to:Math.max(.1,o-Math.min(1.2,o*.25)),at:2})}planLeap(t,e,n,i){const o=Math.max(5,Math.min(10,Math.round(t.total*10)));let a=3;for(const r of i)if(!(r===t||r.line||r.event!==t.event||r.side!==t.side||r.behaviour!=="stand"||!ga(r,t)))for(let c=0;c<=r.total;c+=Math.max(.02,r.total/40)){const l=Fe(r,c,[0,0,0,0]),h=Math.hypot(l[0]-t.pts[0][0],l[1]-t.pts[0][1]);if(h<a){a=h;const u=this.mid(r),f=this.heading(r);t.flank={cx:u[0],cz:u[1],half:r.total/2,ux:f[0],uz:f[1]}}}for(let r=0;r<o;r++)e.push({mode:"leap",s:0,lat:(n()-.5)*.06,dx:Math.round((n()-.5)*8),tm:.3+r*kn.gap*(.8+n()*.4)})}planRanks(t,e,n,i,o=[]){var h,u;const a=t.total;if(a<.3)return;const r=this.mid(t);let c=0;e&&(c=(e[0]-r[0])*-r[3]+(e[1]-r[1])*r[2]>0?-1:1),t.back=c;const l=Math.max(24,Math.min(120,Math.round(a*11)));for(let f=0;f<l;f++){const m=(.04+.92*((f+i()*.9)/l))*a;if(o.some(x=>Math.abs(m-x)<.32))continue;const g=c?c*(.15+Math.pow(i(),1.2)*1.2):(i()+i()-1)*.5;n.push({mode:"rank",s:m,lat:g,tm:1+i()*8})}if(!e){const f=this.cannonOf(t),m=[0,0,0,0];for(let g=0;g<f;g++){Fe(t,(g+1)/(f+1)*a,m);const x=(((h=t.enemy)==null?void 0:h[0])??m[0]+1)-m[0],p=(((u=t.enemy)==null?void 0:u[1])??m[1])-m[1],d=Math.hypot(x,p)||1,v=this.guns.push({r:t,kind:"park",front:-1,s:0,spd:0,lat:0,inAt:0,outAt:0,x:m[0],z:m[1],ax:x/d,az:p/d,period:8,phase:i(),on:!0})-1;this.crewOut(n,t,v,i()*.3)}}}crewOut(t,e,n,i){t.push({mode:"piece",kind:"gun",side:"hawaii",dress:"bare",grp:n,role:0,thr:i,crew:!0}),t.push({mode:"crew",kind:"linstock",side:"hawaii",dress:"kihei",grp:n,role:1,thr:i,crew:!0}),t.push({mode:"crew",kind:"rammer",side:"hawaii",dress:"bare",grp:n,role:2,thr:i,crew:!0})}planFront(t,e,n,i,o){const a=i.indexOf(t),r=i.indexOf(e),c=A=>{const _=this.cannonOf(A);return Array.from({length:_},(y,C)=>(C+1)/(_+1)*A.total)},l=c(t),h=c(e);this.planRanks(t,this.mid(e),n[a],o,l),this.planRanks(e,this.mid(t),n[r],o,h);const u=24,f=[],m=[],g=[0,0,0,0];for(let A=0;A<=u;A++)Fe(t,A/u*t.total,g),f.push([g[0],g[1]]),Fe(e,A/u*e.total,g),m.push([g[0],g[1]]);Math.hypot(f[0][0]-m[0][0],f[0][1]-m[0][1])>Math.hypot(f[0][0]-m[u][0],f[0][1]-m[u][1])&&m.reverse();const x=f.map((A,_)=>[(A[0]+m[_][0])/2,(A[1]+m[_][1])/2]);let p=0,d=0;for(let A=0;A<=u;A++)p+=m[A][0]-f[A][0],d+=m[A][1]-f[A][1];const v=Math.hypot(p,d)||1,M={a:t,b:e,nx:p/v,nz:d/v,ia:a,ib:r},S=this.fronts.push(M)-1;t.front=S,e.front=S;const b=[0];for(let A=1;A<=u;A++)b.push(b[A-1]+Math.hypot(x[A][0]-x[A-1][0],x[A][1]-x[A-1][1]));const w={pts:x,cum:b,total:b[u]},E=Math.max(4,Math.min(16,Math.round(w.total*2)));for(let A=0;A<E;A++){Fe(w,(.08+.84*((A+.2+o()*.6)/E))*w.total,g);const _=(o()-.5)*.4,y=this.pairs.push({x:g[0]+M.nx*_,z:g[1]+M.nz*_,front:S,period:1.5+o()*.8,phase:o(),sway:o()*Math.PI*2,swayT:3+o()*3})-1,C=o()*.9;n[a].push({mode:"duel",grp:y,role:0,close:!0,thr:C}),n[r].push({mode:"duel",grp:y,role:1,close:!0,thr:C})}for(const[A,_,y]of[[t,l,1],[e,h,-1]])for(const C of _){Fe(A,C,g);const P=A.back||-1,I=this.guns.push({r:A,kind:"front",front:S,x:g[0]-g[3]*P*.05,z:g[1]+g[2]*P*.05,ax:M.nx*y,az:M.nz*y,period:7+o()*2.5,phase:o(),on:!0})-1;this.crewOut(n[i.indexOf(A)],A,I,o()*.5)}}armOut(t,e,n){const i=Aa.includes(t.side)?t.side:"oahu",o=e.filter(f=>!f.crew);for(const f of e)f.crew&&(f.side="hawaii");const a=y_(this.sharesOf(t),Gr,o.length);t.counts=a;const r=[];for(const f of Gr)for(let m=0;m<a[f];m++)r.push(f);for(let f=r.length-1;f>0;f--){const m=Math.floor(n()*(f+1));[r[f],r[m]]=[r[m],r[f]]}const c=f=>{const m=r.findIndex(g=>f.includes(g));return r.splice(m>=0?m:0,1)[0]||"spear"};for(const f of o)f.close&&(f.kind=c(h_));for(const f of o)f.close||(f.kind=c(Gr));for(const f of o)f.side=i,f.dress=n()<.55?"kihei":"bare";const l=o.filter(f=>(f.kind==="spear"||f.kind==="club")&&!f.noChief);let h=o.length>=12?Math.max(1,Math.round(o.length/32)):0;const u=l.find(f=>f.mode==="duel");u&&h&&(u.dress="chief",h--);for(let f=0;f<h&&l.length;f++)l[Math.floor(n()*l.length)].dress="chief"}update(t,e,n){var Tt,kt,Y,at,lt,L,T,z,O,Z;const i=this.app,o=i.camera,a=this.f,r=this.recs;this.hold&&(t=0),this.time+=t,this.frame++;const c=this.time;o.updateMatrixWorld();const l=o.matrixWorld.elements,h=this.view;let u=Math.hypot(l[0],l[2])||1;h.rx=l[0]/u,h.rz=l[2]/u,u=Math.hypot(l[8],l[10])||1,h.ax=-l[8]/u,h.az=-l[10]/u,h.sinP=Math.max(.05,Math.min(1,l[9]));const f=-l[8],m=-l[9],g=-l[10],x=o.position.x,p=o.position.y,d=o.position.z,v=((Tt=i.pipeline)==null?void 0:Tt.size)||i.renderer.getDrawingBufferSize(this._size),M=v.y/Math.max(1,innerHeight);this.dpr=M;const S=Math.tan(o.fov*Math.PI/360);this.own.uViewport.value.set(v.x,v.y),this.own.uPxW.value=2*S/Math.max(1,v.y);const b=(kt=i.districts)!=null&&kt.on?(lt=(at=(Y=i.districts.cur)==null?void 0:Y.terrain)==null?void 0:at.shadow)==null?void 0:lt.texture:null;this.own.uFigS.value=b||null,this.own.uHasS.value=b?1:0;const w=i.world.uniforms.uVert.value,E=i.districts,A=E!=null&&E.on?1+E.k:0,_=((T=(L=E==null?void 0:E.cur)==null?void 0:L.parent)==null?void 0:T.k)??0,y=((z=i.timeline)==null?void 0:z.year)??0,C=A!==this._g0||_!==this._g1||y!==this._g2;this._g0=A,this._g1=_,this._g2=y;const P=((Z=(O=i.rig)==null?void 0:O.state)==null?void 0:Z.distance)??16,I=this.hold?this.scale:this.scale.step(d_(P,M),t,2,Math.max(2,Math.round(4*M))),R=I.L/M*P*2*S/Math.max(1,innerHeight);this.unit=R;const U=n?.5:1,F=r_*R*U,G=c_*R*U,W=t>0?t/Kh:1,K=Math.min(1,Math.max(.35,Math.pow(24/Math.max(1,P),.8)));for(const V of this.guns){if(V.kind!=="haul"||V.r.w*e<=.002)continue;const it=V.r.total;let pt=V.s+F*V.spd*t;pt>it&&(pt%=it),V.s=pt;const _t=Fe(V.r,pt,this._p);V.x=_t[0],V.z=_t[1],V.ax=_t[2],V.az=_t[3],V.on=pt>=V.inAt&&pt<=V.outAt}const H=this._p,et=this.marks,ct=this.aFoot.array,Q=this.aCell.array,nt=this.aDraw.array,dt=this.aMix.array;let Mt=0,bt=0,Rt=0;const Lt=this.cap,St=I.k,Ft=I.t,X=Ft<=15.5/16,ue=Ft>.5/16;for(let V=0;V<r.length;V++){const tt=r[V],it=tt.w*e;if(it<=.002&&!tt.drawnLast)continue;const pt=C||!tt.drawnLast;tt.drawnLast=it>.002;const _t=tt.front!==void 0?this.fronts[tt.front]:null,qt=_t?_t.a===tt:!1,rt=it*this.thin*(tt.line?1:K),oe=!n&&(!!_t||tt.pressed);for(let $=tt.o;$<tt.o+tt.n;$++){const Dt=a.mode[$];let Et=pa,mt=0,Ot=0,te=0,he=0,Nt=rt>a.thr[$],ot=0,k=0,ht=a.hx[$],ut=a.hz[$],It=!1,zt=0,ne=0,ae=-1,pe=0;if(Dt===_n.file){const At=(tt.behaviour==="run"||tt.behaviour==="surround"?G:F)*a.spd[$];pe=At*Kh*1.3;let gt=a.s[$]+At*t;gt>tt.total&&(gt%=tt.total),a.s[$]=gt,Fe(tt,gt,H),ot=H[0]-H[3]*a.lat[$],k=H[1]+H[2]*a.lat[$],ht=H[2],ut=H[3];const Xt=tt.behaviour!=="march"&&tt.behaviour!=="stand",D=(Xt?1.7:1.15)*a.spd[$]*U;a.ph[$]=(a.ph[$]+D*t)%1,Et=Xt?qh:lo,mt=Math.floor(a.ph[$]*4)%4,(gt<a.inAt[$]||gt>a.outAt[$])&&(Nt=!1),a.wet[$]&&(a.lat[$]*=1-Math.min(1,t*.5))}else if(Dt===_n.knot||Dt===_n.pacer){let At=a.s0[$];if(Dt===_n.pacer){a.tt[$]+=F*.6*a.spd[$]*t;const Xt=a.tt[$]/(2*.7)+a.ph[$],D=2*Math.abs(Xt-Math.floor(Xt+.5));At=Math.max(0,Math.min(tt.total,a.s0[$]+(D-.5)*2*.7));const N=Xt-Math.floor(Xt)<.5?1:-1;Fe(tt,At,H),ht=H[2]*N,ut=H[3]*N,Et=lo,mt=Math.floor((c*1.1*U+a.ph[$])%1*4)}else Fe(tt,At,H),tt.enemy?(ht=tt.enemy[0]-H[0],ut=tt.enemy[1]-H[1]):(ht=-H[3],ut=H[2]),Ot=a.dx0[$],te=a.dy0[$],[Et,mt]=this.act($,t,c,n,oe,!1);ot=H[0]-H[3]*a.lat[$],k=H[1]+H[2]*a.lat[$]}else if(Dt===_n.rank){Fe(tt,a.s0[$],H);const At=a.st[$];if([Et,mt]=this.act($,t,c,n,oe,!0),a.st[$]===1&&At===1){const gt=F*.5*t,Xt=a.offTo[$]-a.off[$];Math.abs(Xt)<=gt?(a.off[$]=a.offTo[$],a.st[$]=0):a.off[$]+=Math.sign(Xt)*gt,ht=H[2]*Math.sign(Xt),ut=H[3]*Math.sign(Xt)}else _t?(ht=qt?_t.nx:-_t.nx,ut=qt?_t.nz:-_t.nz):tt.enemy&&(ht=tt.enemy[0]-H[0],ut=tt.enemy[1]-H[1]);ot=H[0]-H[3]*a.lat[$]+H[2]*a.off[$],k=H[1]+H[2]*a.lat[$]+H[3]*a.off[$]}else if(Dt===_n.duel){const At=this.pairs[a.grp[$]],gt=this.fronts[At.front],Xt=a.role[$]===0,D=.1*Math.sin(c*2*Math.PI/At.swayT+At.sway);ot=At.x+gt.nx*D,k=At.z+gt.nz*D,ht=Xt?gt.nx:-gt.nx,ut=Xt?gt.nz:-gt.nz;const N=gt.nx*h.rx+gt.nz*h.rz,q=(gt.nx*h.ax+gt.nz*h.az)*h.sinP,J=Math.hypot(N,q)||1,j=N/J,xt=q/J,Ct=(c/At.period+At.phase)%1,Ut=Xt?Ct<.5:Ct>=.5,Bt=Ct%.5/.5,jt=1.6*Math.sin(c*2*Math.PI/(At.swayT*1.7)+At.sway);let Vt=(Xt?-4:4)+jt;Et=ma,n?(Nt=!1,Et=pa,mt=0):Ut?mt=Bt<.3?0:Bt<.55?1:2:(mt=2,Bt>=.3&&Bt<.7&&(Vt+=Xt?-1:1)),Ot=Math.round(Vt*j+(Xt?-1.5:1.5)*xt*xt),te=Math.round(Vt*xt*.8),he=.01+(Xt?1:-1)*Math.sign(q)*.01}else if(Dt===_n.piece||Dt===_n.crew){const At=this.guns[a.grp[$]];ot=At.x,k=At.z,At.kind==="haul"&&!At.on&&(Nt=!1);const gt=a.role[$];ht=At.ax,ut=At.az,gt===0&&(At.face=this.faceOf(At.ax,At.az,At.face??Ce.right));const Xt=At.face??Ce.right;ae=Xt;const D=At.kind==="haul",N=n||At.kind!=="front"?99:(c/At.period+At.phase)%1*At.period;let q=-1;if(gt===0)q=N>=3.5&&N<3.65?0:N>=3.65&&N<4.4?1:N>=4.4&&N<5.2?2:-1,he=Xt===Ce.front?.03:.01;else if(Xt<=Ce.left){const J=Xt===Ce.right?1:-1;gt===1?Ot=-11*J:(Ot=11*J,he=.02,D||(ae=Xt===Ce.right?Ce.left:Ce.right))}else Ot=gt===1?-9:9,te=Xt===Ce.back?2:3,ne=Xt===Ce.back==(gt===1)?1:-1;gt===1?q=N>=2.6&&N<3.2?0:N>=3.2&&N<3.6?1:N>=3.6&&N<4.3?2:-1:gt===2&&(q=N<.9?Math.min(2,Math.floor(N/.3)):-1),D?(Et=lo,mt=Math.floor((c*1.15*U+.25*gt)%1*4)):q>=0?(Et=ma,mt=q):(Et=pa,mt=gt===0?0:Math.floor(c*(.6+.1*gt)+a.ph[$])&1)}else if(Dt===_n.ring){const At=tt.ring,gt=n?0:4*Math.max(0,Math.sin(c/(2.4+a.ph[$])*2*Math.PI+a.ph[$]*6.28)),Xt=Math.max(.3,Math.hypot(At.ux*h.rx+At.uz*h.rz,(At.ux*h.ax+At.uz*h.az)*h.sinP)),D=Math.max(.3,Math.hypot(At.vx*h.rx+At.vz*h.rz,(At.vx*h.ax+At.vz*h.az)*h.sinP)),N=a.row2[$],q=(Math.max(At.half*Xt/R+16,24)+6*N-gt*.5)*R/Xt,J=(28+9*N-gt)*R/D,j=Math.sin(a.s0[$]),xt=Math.cos(a.s0[$]);ot=At.cx+At.ux*q*j+At.vx*J*xt,k=At.cz+At.uz*q*j+At.vz*J*xt,ht=At.cx-ot,ut=At.cz-k,gt>3?(Et=ma,mt=gt>3.7?1:0):gt>.3?(Et=lo,mt=Math.floor((c*1.3+a.ph[$])%1*4)):[Et,mt]=this.act($,t,c,n,!1,!1)}else if(Dt===_n.leap)if(n)Nt=!1,a.st[$]=0;else{if(a.st[$]===0&&(a.tm[$]-=t,Nt=!1,a.tm[$]<=0&&(a.st[$]=1,a.s[$]=0),Fe(tt,0,H),ot=H[0],k=H[1]),a.st[$]===1){const gt=a.s[$]+G*kn.run*t;a.s[$]=gt,a.tt[$]+=t,Fe(tt,Math.min(gt,tt.total),H);const Xt=Math.max(0,gt-tt.total);if(ot=H[0]+H[2]*Xt-H[3]*a.lat[$],k=H[1]+H[3]*Xt+H[2]*a.lat[$],ht=H[2],ut=H[3],Et=qh,mt=Math.floor((a.tt[$]*1.9+a.ph[$])%1*4),gt>=tt.total){const D=i.world.metresAt(ot,k),N=i.world.metresAt(ot+H[2]*.1,k+H[3]*.1);(D-N>6||Xt>.6)&&(a.st[$]=2,a.tt[$]=0,a.gx[$]=1e9,this.jump[$*3]=ot,this.jump[$*3+1]=k,this.jump[$*3+2]=D)}}if(a.st[$]>=1){const gt=tt.pts[0],Xt=tt.pts.at(-1),D=((Xt[0]-gt[0])*h.rx+(Xt[1]-gt[1])*h.rz)/R,N=((Xt[0]-gt[0])*h.ax+(Xt[1]-gt[1])*h.az)*h.sinP/R,q=Math.hypot(D,N)||1,J=Math.max(0,kn.least-q)*(a.st[$]===1?Math.min(1,a.s[$]/tt.total):1);Ot=a.dx0[$]+Math.round(D/q*J),te=Math.round(N/q*J);const j=tt.flank;if(j){const xt=((gt[0]-j.cx)*h.rx+(gt[1]-j.cz)*h.rz)/R,Ct=Math.abs(j.ux*h.rx+j.uz*h.rz)*j.half/R+16,Ut=Math.abs(D)>.2*q?Math.sign(D):Math.sign(xt)||1;Ot+=Ut*Math.round(Math.max(0,Ct+4-Ut*xt))}}if(a.st[$]===2){a.tt[$]+=t;const gt=a.tt[$];Fe(tt,tt.total,H),ot=this.jump[$*3]+H[2]*kn.across*R*gt,k=this.jump[$*3+1]+H[3]*kn.across*R*gt,ht=H[2],ut=H[3];const Xt=kn.up*gt-.5*kn.pull*gt*gt;It=!0,zt=this.jump[$*3+2]+Xt*R/w,Et=a_,mt=gt<.22?0:1+(Math.floor((gt-.22)/.14)&1),-Xt>kn.fade&&(Nt=!1),gt>kn.air&&(a.st[$]=0,a.tm[$]=Math.max(.4,tt.n*kn.gap*(.85+Math.random()*.3)-gt-tt.total/Math.max(1e-6,G*kn.run)),a.vis[$]=0,Nt=!1)}}a.hx[$]=ht,a.hz[$]=ut;const we=ae>=0?ae:this.faceOf(ht,ut,a.face[$]);if(a.face[$]=we,we<=Ce.left?ne=we===Ce.left?-1:1:ne||(ne=Dt===_n.piece||!a.hand[$]?1:-1),a.mirror[$]=ne,a.fr[$]=Et+mt,a.dx[$]=Ot,a.dy[$]=te,a.x[$]=ot,a.z[$]=k,a.air[$]=It?1:0,(pt||Math.abs(ot-a.gx[$])+Math.abs(k-a.gz[$])>.01||(this.frame+$)%30===0)&&(a.gm[$]=i.world.metresAt(ot,k),a.gx[$]=ot,a.gz[$]=k,a.wet[$]=a.gm[$]<.15?1:0,pe>0&&!a.wet[$])){const At=Math.hypot(ht,ut)||1;i.world.metresAt(ot+ht/At*pe,k+ut/At*pe)<.15&&(a.wet[$]=2)}a.wet[$]&&!It&&(Nt=!1);const re=It?zt:a.gm[$],Ue=It&&re+an*R/w<a.gm[$];Ue&&(Nt=!1),a.lift[$]=re;const Sn=Math.max(re,0)*w,js=(ot-x)*f+(Sn-p)*m+(k-d)*g;(js>a.far[$]||js<.05)&&(Nt=!1),Nt&&Rt++;let Ln=a.vis[$];Ln=Nt?Math.min(1,Ln+W):Math.max(0,Ln-W),(it<=.002||Ue)&&(Ln=0),a.vis[$]=Ln;const as=Ft<.5?St:St+1;a.k[$]=Ln>0?as:0;const Ui=$*4;if(et[Ui]=ot,et[Ui+1]=k,et[Ui+2]=Ln,et[Ui+3]=a.k[$],Ln<=0||bt>=Lt)continue;bt++;const Qn=a.cw[$],Uo=(jh[we]*Is+Et+mt)*Qn,ko=It?0:Qn>xc&&a.kind[$]!==co.gun?xc:Qn;for(let At=0;At<2;At++){if(At===0?!X:!ue)continue;const gt=Mt*4;ct[gt]=ot,ct[gt+1]=re,ct[gt+2]=k,ct[gt+3]=he,Q[gt]=Uo,Q[gt+1]=a.row[$],Q[gt+2]=Qn,Q[gt+3]=an,nt[gt]=At===0?St:St+1,nt[gt+1]=ne*a.tint[$],nt[gt+2]=Ln,nt[gt+3]=Ot,dt[gt]=At===0?Ft:0,dt[gt+1]=At===0?1:Ft,dt[gt+2]=te,dt[gt+3]=ko,Mt++}}}if(Rt>Lt?this.thin=Math.max(.1,this.thin*.92):Rt<Lt*.85&&this.thin<1&&(this.thin=Math.min(1,this.thin*1.04)),this.drawn=bt,this.instances=Mt,this.geometry.instanceCount=Mt,this.group.visible=Mt>0,Mt>0){this.range.count=Mt*4;for(const V of this.attrs)V.clearUpdateRanges(),V.updateRanges.push(this.range),V.needsUpdate=!0}}act(t,e,n,i,o,a){const r=this.f;r.tm[t]-=e,i&&r.st[t]>=2&&(r.st[t]=0);const c=r.st[t];let l=pa,h=Math.floor(n/(.9+r.tint[t])+r.ph[t]*2)&1;if(c===1)l=lo,h=Math.floor((n*1.15+r.ph[t])%1*4);else if(c>=2){r.tt[t]+=e;const u=r.tt[t];l=ma,c===2?h=u<.55?0:u<.67?1:2:c===3?h=u<.3?0:u<.5?1:2:h=u<1?Math.floor(u/.12)&1:u<1.15?2:3,u>(c===2?1.4:c===3?.8:1.45)&&(r.st[t]=0)}if(r.st[t]===0&&r.tm[t]<=0){const u=Math.random();r.tm[t]=3+Math.random()*7;const f=r.kind[t];o&&f===co.musket?(r.st[t]=2,r.tt[t]=0):o&&f===co.sling?(r.st[t]=4,r.tt[t]=0):a&&u<.55?(r.st[t]=1,r.offTo[t]=(Math.random()-.5)*.5):o&&u<.8&&(r.st[t]=3,r.tt[t]=0)}return[l,h]}faceOf(t,e,n){const i=this.view,o=t*i.rx+e*i.rz,a=t*i.ax+e*i.az;return o*o+a*a<1e-12?n:(n>=Ce.front?Math.abs(o)<=Yh*Math.abs(a):Math.abs(a)>Yh*Math.abs(o))?a>0?Ce.back:Ce.front:o>0?Ce.right:Ce.left}scaleAt(){return this.scale.t<.5?this.scale.k:this.scale.k+1}scaleBands(t=this.dpr||1){return m_(t)}screenRect(t){const e=this.f;if(e.vis[t]<=0||!e.k[t])return null;const n=this.app.camera,i=this._v4.set(e.x[t],Math.max(e.lift[t],0)*this.app.world.uniforms.uVert.value,e.z[t],1);if(i.applyMatrix4(n.matrixWorldInverse).applyMatrix4(n.projectionMatrix),i.w<=0)return null;const o=this.own.uViewport.value.x,a=this.own.uViewport.value.y,r=e.k[t],c=Math.floor((i.x/i.w*.5+.5)*o+.5)+e.dx[t]*r,l=Math.floor((i.y/i.w*.5+.5)*a+.5)+e.dy[t]*r,h=e.cw[t]*r,u=an*r,f=(jh[e.face[t]]*Is+e.fr[t])*e.cw[t];return{x:c-h/2,y:a-l-u,w:h,h:u,k:r,cell:[f,e.row[t],e.cw[t],an],facing:e.mirror[t],face:e.face[t],vis:e.vis[t],solid:this.scale.t===0||this.scale.t===1}}stats(){const t=this.f,e=["right","left","front","back"],n={figures:this.drawn,instances:this.instances,planned:this.count,fronts:this.fronts.length,pairs:this.pairs.length,guns:this.guns.length,sides:{},kinds:{},faces:{},k:{},scale:{k:this.scale.k,t:+this.scale.t.toFixed(3),level:+this.scale.L.toFixed(3)}};for(let i=0;i<this.count;i++){if(t.vis[i]<=0)continue;const o=Aa[t.side[i]],a=Wc[t.kind[i]];n.sides[o]=(n.sides[o]||0)+1,n.kinds[a]=(n.kinds[a]||0)+1,n.faces[e[t.face[i]]]=(n.faces[e[t.face[i]]]||0)+1,n.k[t.k[i]]=(n.k[t.k[i]]||0)+1}return n}dispose(){this.geometry.dispose(),this.material.dispose(),this.shadowMaterial.dispose(),this.texture.dispose()}}Ks(uo,"MODE",_n),Ks(uo,"KIND",co),Ks(uo,"FACE",Ce),Ks(uo,"WIDTH",Gc);const w_={hawaii:"#f0ae3c",oahu:"#a88fe6",maui:"#d9703f"};class b_{constructor(t,e,n,i){var o;this.app=t,this.forces=[],this.lines=[];for(const a of e){const r=a.properties||{};if(r.kind!=="force"&&r.kind!=="line"||((o=a.geometry)==null?void 0:o.type)!=="LineString")continue;const c=a.geometry.coordinates.map(f=>t.data.proj.toWorld(f)),l=[0];for(let f=1;f<c.length;f++)l.push(l[f-1]+Math.hypot(c[f][0]-c[f-1][0],c[f][1]-c[f-1][1]));const h=l.at(-1),u={p:r,pts:c,cum:l,total:h,event:r.event,step:Number.isFinite(r.step)?r.step:0,w:0,goal:0,stop:r.stop??null,line:r.kind==="line"};u.line?(u.side=r.side||(r.role==="advance"?"hawaii":"oahu"),u.batch=i.add([{pts:c,width:.75}],{mode:"band",colour:new Gt(w_[u.side]||"#ffffff").toArray(),alpha:0,minPx:6,lift:.01,order:6,endFade:1.2}),u.mid=fn(a.geometry),u.stand=!0,this.lines.push(u)):u.side=r.role||"oahu",this.forces.push(u)}this.events=new Map;for(const a of this.forces){if(!a.event)continue;let r=this.events.get(a.event);r||this.events.set(a.event,r={id:a.event,from:1/0,to:-1/0,recs:[]}),r.recs.push(a),Number.isFinite(a.p.from)&&(r.from=Math.min(r.from,a.p.from)),Number.isFinite(a.p.to)&&(r.to=Math.max(r.to,a.p.to))}this.soldiers=new uo(t,this.forces,n),this.count=this.soldiers.count,this.marks=this.soldiers.marks,this.group=this.soldiers.group,this.time=0,this.showing={event:null,steps:[],quiet:!1}}stepsAt(t,e){var h;const n=this.events.get(t.id),i=t.stops||[];if(!n||e<0||e>=i.length)return[];const o=(h=this.app.tour)==null?void 0:h.places,a=this.app.data.proj,r=[];for(const u of n.recs){if(u.p.kind!=="line"||!u.mid)continue;const[f,m]=a.toWorld(u.mid);let g=-1,x=6;i.forEach((p,d)=>{const v=o==null?void 0:o.get(p.place),M=v&&fn(v.geometry);if(!M)return;const[S,b]=a.toWorld(M),w=Math.hypot(S-f,b-m);w<x&&(x=w,g=d)}),g>=0&&r.push(g-u.step)}r.sort((u,f)=>u-f);const c=r.length?r[Math.floor(r.length/2)]:0,l=new Set;for(const u of n.recs){const f=u.step+c;(f===e||e===i.length-1&&f>e)&&l.add(u.step)}return[...l].sort((u,f)=>u-f)}namedStops(t,e){if(t.stop===null||t.stop===void 0)return null;const n=[];for(const i of Array.isArray(t.stop)?t.stop:[t.stop])Number.isInteger(i)?n.push(i):typeof i=="string"&&(e.stops||[]).forEach((o,a)=>o.place===i&&n.push(a));return n}shownAt(t,e){const n=this.events.get(t.id),i=new Set;if(!n)return i;let o=null;for(const a of n.recs){const r=this.namedStops(a,t);if(r){r.includes(e)&&i.add(a);continue}o||(o=this.stepsAt(t,e)),o.includes(a.step)&&i.add(a)}return i}choose(){var i;const t=this.app.tour,e=t!=null&&t.active?t.event:null;if(e&&this.events.has(e.id)&&t.stop>=0){if(((i=this._at)==null?void 0:i.ev)!==e||this._at.stop!==t.stop){const o=this.shownAt(e,t.stop);this._at={ev:e,stop:t.stop,now:{event:e.id,recs:o,steps:[...new Set([...o].map(a=>a.step))].sort((a,r)=>a-r),quiet:!1}}}return this._at.now}this._at=null;const n=this.app.timeline.year;for(const o of this.events.values())if(n>=o.from&&n<o.to+1)return(this._quiet||(this._quiet=new Map)).get(o.id)||this._quiet.set(o.id,{event:o.id,recs:null,steps:null,quiet:!0}).get(o.id);return this._none||(this._none={event:null,recs:new Set,steps:[],quiet:!1})}update(t,e,n=0){e*=1-S_(75,140,n),this.time+=t;const i=this.choose();this.showing=i;const o=t>0?1-Math.exp(-t*2):1;for(const a of this.forces){const r=a.event===i.event&&(i.recs===null||i.recs.has(a));a.goal=r?i.quiet?.2:1:0,a.w+=(a.goal-a.w)*o,Math.abs(a.goal-a.w)<.003&&(a.w=a.goal)}for(const a of this.lines)a.batch&&(a.batch.uniforms.uAlpha.value=.26*a.w*e);this.soldiers.update(t,e,i.quiet),this.marksShown=this.soldiers.drawn}stats(){const t=this.choose(),e=n=>n.event===t.event&&(t.recs===null||t.recs.has(n));return{event:t.event,steps:t.steps,quiet:t.quiet,by:t.recs?[...new Set([...t.recs].map(n=>n.stop===null||n.stop===void 0?"inferred":"named"))].join("+")||"none":"year",forces:this.forces.filter(n=>e(n)&&!n.stand).map(n=>n.p.name),lines:this.lines.filter(e).map(n=>n.p.name),marks:this.count,marksShown:this.marksShown??0,...this.soldiers.stats()}}dispose(){this.soldiers.dispose()}}function S_(s,t,e){const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)}class E_{constructor(t,e){this.app=t;const n=document.getElementById("ui")||document.body;this.layer=document.createElement("div"),this.layer.className="dlabels",n.insertBefore(this.layer,n.querySelector(".pins")||n.firstChild),this.items=[];for(const i of e){const o=i.properties||{};if(o.kind!=="label"||!o.name)continue;const a=fn(i.geometry);if(!a)continue;const[r,c]=t.data.proj.toWorld(a),l=document.createElement("div");l.className="dlabel",l.textContent=o.name,l.lang="haw",this.layer.appendChild(l),this.items.push({p:o,x:r,z:c,el:l,v:new B,shown:-1,tx:NaN,ty:NaN})}this.panels=[],this.frame=0}panelRects(){if(this.frame++%15===0){this.panels=[];for(const t of document.querySelectorAll(".card, .timeline, .legend, .tools, .brand, .inspector")){if(t.hidden||!t.offsetParent)continue;const e=t.getBoundingClientRect();e.width>0&&e.height>0&&this.panels.push(e)}}return this.panels}update(t){const e=this.app,n=e.camera,i=innerWidth,o=innerHeight,a=e.rig.state.distance,r=1-Math.max(0,Math.min(1,(a-32)/30)),c=[],l=this.panelRects(),h=e.timeline.year;for(const u of this.items){let f=t*r*(Io(u.p,h)?1:0);if(f>.01){u.v.set(u.x,e.world.heightAt(u.x,u.z)+.05,u.z).project(n),(u.v.z>1||u.v.z<-1)&&(f=0);const g=(u.v.x+1)/2*i,x=(1-u.v.y)/2*o;(g<-80||g>i+80||x<60||x>o+20)&&(f=0);const p=u.el.offsetWidth||60;f>.01&&l.some(d=>g+p/2>d.left-4&&g-p/2<d.right+4&&x+10>d.top-4&&x-10<d.bottom+4)&&(f=0),f>.01&&c.some(d=>Math.abs(d[0]-g)<(d[2]+p)/2+6&&Math.abs(d[1]-x)<18)&&(f=0),f>.01&&c.push([g,x,p]),f>.01&&!(Math.abs(g-u.tx)<=.3&&Math.abs(x-u.ty)<=.3)&&(u.el.style.transform=`translate(${g.toFixed(1)}px, ${x.toFixed(1)}px)`,u.tx=g,u.ty=x)}const m=Math.round(f*20)/20;m!==u.shown&&(u.el.style.opacity=String(m),u.el.style.visibility=m>0?"visible":"hidden",u.shown=m)}}visible(){return this.items.filter(t=>t.shown>.5).map(t=>t.p.name)}dispose(){this.layer.remove()}}const un=4,Ff={limewash:"#d6d0c0",cream:"#ccbf9f",paleGrey:"#b6b1a4",sage:"#959d86",ochre:"#b59967",duskRed:"#8f6152",paleBlue:"#98a5a4",shingle:"#6c665c",iron:"#6e706c",ironRed:"#7f5446",ironGreen:"#6f7a6a",coral:"#cbc1a8",adobe:"#b39b78",brick:"#97684f",stoneGrey:"#a19b90",concrete:"#c2bdb1",concreteWarm:"#c9bea6",glass:"#6a7f88",dark:"#4b4743",post:"#8a7b66",plinth:"#77706a",asphalt:"#6d6a66"},ft=Ff;function Ge(s,t,e,n,i,o=0,a=0){s.box(o,-un,a,t,n+un,e,i,st.stone)}function Yn(s,t,e,n,i,o,a,r,{alongZ:c=!1,wallMat:l=st.plain,roofMat:h=st.roof,x:u=0,z:f=0,oe:m=o*.6}={}){const g=c?R=>[u+R[2],R[1],f+R[0]]:R=>[u+R[0],R[1],f+R[2]],x=c?e:t,p=c?t:e,d=i/(p/2),v=n-d*o,M=x/2+m,S=p/2+o,b=g([-M,v,-S]),w=g([M,v,-S]),E=g([-M,n+i,0]),A=g([M,n+i,0]),_=g([-M,v,S]),y=g([M,v,S]),C=c?(R,U,F,G,W,K)=>s.quad(G,F,U,R,W,K):(R,U,F,G,W,K)=>s.quad(R,U,F,G,W,K),P=c?(R,U,F,G,W)=>s.tri(F,U,R,G,W):(R,U,F,G,W)=>s.tri(R,U,F,G,W);C(b,E,A,w,a,h),C(y,A,E,_,a.map(R=>R*.84),h);const I=x/2;P(g([-I,n,-p/2]),g([-I,n,p/2]),g([-I,n+i,0]),r,l),P(g([I,n,p/2]),g([I,n,-p/2]),g([I,n+i,0]),r,l)}function is(s,t,e,n,i,o,a,{roofMat:r=st.roof,x:c=0,z:l=0}={}){const h=i/(e/2),u=n-h*o,f=t/2+o,m=e/2+o,g=Math.max(0,(t-e)/2),x=(v,M)=>[c+v*f,u,l+M*m],p=v=>[c+v*g,n+i,l],d=a.map(v=>v*.84);s.quad(x(-1,-1),p(-1),p(1),x(1,-1),a,r),s.quad(x(1,1),p(1),p(-1),x(-1,1),d,r),s.tri(x(-1,1),p(-1),x(-1,-1),a.map(v=>v*.92),r),s.tri(x(1,-1),p(1),x(1,1),a.map(v=>v*.92),r)}function Nf(s,t,e,n,i,o=0,a=0,r=st.roof){const c=t/2,l=[o,e+n,a],h=(u,f)=>[o+u*c,e,a+f*c];s.tri(h(-1,-1),l,h(1,-1),i,r),s.tri(h(1,1),l,h(-1,1),i.map(u=>u*.84),r),s.tri(h(-1,1),l,h(-1,-1),i.map(u=>u*.92),r),s.tri(h(1,-1),l,h(1,1),i.map(u=>u*.92),r)}function Bn(s,t,e,n,i,o,a,r,c,{posts:l=2,x:h=0,from:u=e/2}={}){const f=e/2,m=f+n;m-u>.05&&s.box(h,i-.35,(u+m)/2,t,.35,m-u,c,st.wood);const g=[h-t/2-.2,o,f],x=[h+t/2+.2,o,f],p=[h+t/2+.2,a,m+.3],d=[h-t/2-.2,a,m+.3];s.quad(g,d,p,x,r,st.roof);for(let v=0;v<l;v++){const M=h-t/2+.3+(t-.6)*v/Math.max(1,l-1);s.box(M,i,m-.2,.28,a-i,.28,c,st.wood)}}function ss(s,t,e,n,i=0,o=0){s.box(o,i,t/2+.15,e,n,.3,yt(ft.dark,0),st.plain)}const A_=[[8.2,5,5.6],[7,4.6,5],[6,4.2,4.6],[5.2,4,4.4]];function T_(s,[t,e,n]){const i=new Ie;return Ba(i,s,t,e,n,!0,un),i}const Hr=[[[-3,-4,.06,0],[5.6,-2.8,1.64,2],[-3.4,4.6,.12,3]],[[-1.6,-2.6,.15,0],[4.2,4.4,1.45,3]],[[-4.2,-4.2,-.05,1],[4.6,-3.6,1.6,2],[-4.8,4,1.5,2],[3.6,4.4,.08,3]],[[.2,-3.5,.04,1],[-4,4,-.06,2],[4.6,3.6,1.62,3]]];function C_(s,t){const e=new Ie;return e.at(0,0,-2.2,0,1),Ba(e,s,6.8+t*.6,4.6,5.2,!0,un),e.done(),e.at(t?-2.6:2.6,0,4.6,Math.PI/2,1),Ba(e,s,3.6,2.8,3.4,!1,un),e.done(),e}function R_(s,t){const e=new Ie,n=yt([ft.limewash,ft.cream,ft.paleGrey][t],.06,s),i=yt(ft.shingle,.1,s),o=yt(ft.post,.1,s);return t===0?(Ge(e,9+.4,7+.4,.6,yt(ft.plinth,.1,s)),e.box(0,.6,0,9,3,7,n,st.clap),Yn(e,9,7,3.6,2.6,.5,i,n,{wallMat:st.clap}),Bn(e,9,7,2.2,.6,3.3,2.7,i,o,{from:7/2+.2}),ss(e,7,1.1,2.1,.6)):t===1?(Ge(e,8+.4,6.5+.4,.5,yt(ft.plinth,.1,s)),e.box(0,.5,0,8,5.8,6.5,n,st.clap),Yn(e,8,6.5,6.3,2.4,.5,i,n,{wallMat:st.clap}),Bn(e,8,6.5,2,3.4,5.8,5.4,i,o),Bn(e,8,6.5,2,.5,3.4,3.1,i,o,{from:6.5/2+.2})):(Ge(e,9.6+.4,7+.4,.6,yt(ft.plinth,.1,s)),e.box(0,.6,0,9.6,2.9,7,n,st.clap),is(e,9.6,7,3.5,2.2,.5,i),Bn(e,9.6-1.5,7,2.3,.6,3.2,2.6,i,o,{posts:3,from:7/2+.2})),e}function L_(s,t){const e=new Ie;if(t===0){const o=yt(ft.adobe,.08,s);Ge(e,9+.6,6+.6,.3,yt(ft.plinth,.1,s)),e.box(0,.3,0,9,2.8,6,o,st.masonry),is(e,9,6,3.1,2.8,.7,yt("#a58a5c",.12,s),{roofMat:st.thatch}),ss(e,6,1.1,2,.3)}else{const o=yt(ft.coral,.06,s);Ge(e,10.4+.4,8+.4,.4,yt(ft.plinth,.1,s)),e.box(0,.4,0,10.4,6.4,8,o,st.masonry),is(e,10.4,8,6.8,2,.4,yt(ft.shingle,.1,s)),Bn(e,10.4,8,2.2,3.6,6.4,6,yt(ft.shingle,.1,s),yt(ft.post,.1,s),{posts:3}),Bn(e,10.4,8,2.2,.4,3.6,3.2,yt(ft.shingle,.1,s),yt(ft.post,.1,s),{posts:3,from:8/2+.2})}return e}function P_(s,t){const e=new Ie,n=yt([ft.limewash,ft.sage,ft.cream][t],.06,s),i=yt([ft.iron,ft.ironRed,ft.ironGreen][t],.08,s),o=yt(ft.limewash,.05,s);return Ge(e,9.4,8.4,.9,yt(ft.plinth,.1,s)),t===1?(e.box(-1.5,.9,-1,7,3.1,6,n,st.clap),Yn(e,7,6,4,2.5,.5,i,n,{wallMat:st.clap,x:-1.5,z:-1}),e.box(2.6,.85,1.05,4,3.1,6.9,n,st.clap),Yn(e,4,6.9,3.95,2,.45,i,n,{wallMat:st.clap,alongZ:!0,x:2.6,z:1.05}),Bn(e,4.5,4,2,.9,3.7,3.2,i,o,{x:-2.3,from:4.2})):(e.box(0,.9,0,9,3.1,7.5,n,st.clap),t===0?Yn(e,9,7.5,4,2.7,.5,i,n,{wallMat:st.clap}):is(e,9,7.5,4,2.4,.55,i),Bn(e,9,7.5,2.4,.9,3.8,3.2,i,o,{posts:3,from:4.2}),ss(e,7.5,1,2.2,.9)),e}function D_(s,t,e=5.8){const n=new Ie,i=12,o=[ft.cream,ft.limewash,ft.ochre,ft.paleBlue,ft.sage,ft.duskRed],a=yt(ft.iron,.1,s),r=yt(ft.post,.1,s);Ge(n,t*e+.4,i+.4,.3,yt(ft.plinth,.1,s));for(let c=0;c<t;c++){const l=(c-(t-1)/2)*e,h=yt(o[Math.floor(s()*o.length)],.08,s),u=4.2+s()*1.4;n.box(l,.3,0,e-.15,u,i,h,st.clap);const f=[l-e/2+.075,.3+u-.2,i/2-.6],m=[l+e/2-.075,.3+u-.2,i/2-.6],g=[l+e/2-.075,.3+u-1.3,-i/2-.4],x=[l-e/2+.075,.3+u-1.3,-i/2-.4];n.quad(f,m,g,x,yt(ft.iron,.1,s),st.roof),n.box(l,.3+u,i/2-.175,e-.15,1.4+s()*1,.35,h,st.clap),ss(n,i,1.6,2.4,.3,l)}return Bn(n,t*e,i,2.6,.3,3.4,3.1,a,r,{posts:t+1,from:i/2+.2}),n}function I_(s,t){const e=new Ie,n=[2,3,3][t],i=[11,10.5,11.2][t],o=[12,13,11][t],a=.4+n*3.7,r=yt([ft.brick,ft.stoneGrey,ft.concreteWarm][t],.07,s);return Ge(e,i+.3,o+.3,.4,yt(ft.plinth,.1,s)),e.box(0,.4,0,i,a-.4,o,r,st.windows),e.box(0,a,0,i+.5,.45,o+.5,r.map(c=>c*.86),st.masonry),e.box(0,a+.45,0,i,.6,o,r.map(c=>c*.95),st.masonry),t===2&&Bn(e,i,o,2.5,.4,4,3.8,yt(ft.iron,.1,s),yt(ft.dark,.1,s),{posts:4,from:o/2+.15}),e}function U_(s,t){const e=new Ie,n=yt([ft.cream,ft.sage,ft.paleGrey][t],.07,s),i=yt([ft.ironGreen,ft.iron,ft.ironRed][t],.1,s),o=[9.8,10,10.2][t],a=[8.6,9.5,8][t];return Ge(e,o,a,.8,yt(ft.plinth,.1,s)),e.box(0,.8,0,o,2.8,a,n,st.clap),t===1?(Yn(e,o,a,3.6,2,.8,i,n,{wallMat:st.clap}),Bn(e,6,a,2.6,.8,3.4,2.9,i,yt(ft.limewash,.05,s),{x:-1.5})):(is(e,o+1.2,a+2.4,3.6,1.8,.7,i,{z:1.2}),e.box(0,.8,a/2+1.25,o-.4,.2,2.3,yt(ft.post,.1,s),st.wood)),e}function k_(s,t){const e=new Ie,n=[6,8][t],i=[13.6,13][t],o=[14,15][t],a=n*3.6,r=yt([ft.concreteWarm,ft.stoneGrey][t],.06,s);return Ge(e,i+.3,o+.3,.3,yt(ft.plinth,.1,s)),e.box(0,.3,0,i,4.4,o,r.map(c=>c*.9),st.masonry),e.box(0,4.7,0,i,a-4.4,o,r,st.windows),e.box(0,a+.3,0,i+.6,.6,o+.6,r.map(c=>c*.85),st.masonry),e.box(-i/4,a+.9,-o/5,3.5,2.2,3.5,r.map(c=>c*.9),st.plain),e}function z_(s,t){const e=new Ie,n=yt([ft.limewash,ft.concreteWarm,ft.paleBlue][t],.07,s),i=yt([ft.iron,ft.shingle,ft.ironGreen][t],.1,s);if(t===2)return Ge(e,9,8,.3,yt(ft.plinth,.1,s)),e.box(0,.3,0,9,5.4,8,n,st.plain),Yn(e,9,8,5.7,1.4,.6,i,n),e;const o=11.5,a=9;return Ge(e,o,a,.3,yt(ft.plinth,.1,s)),e.box(-1.5,.3,0,o-3,2.7,a,n,st.plain),is(e,o-3,a,3,1.3,.7,i,{x:-1.5}),e.box(o/2-1.5,2.6,.4,3.2,.25,a-1.2,i.map(r=>r*.9),st.plain),e.box(o/2-.1,.3,a/2-1,.25,2.3,.25,n,st.plain),t===1&&e.box(-3.2,-un,-a/2-1.4,4.4,un+2.7,2.8,n.map(r=>r*.95),st.plain),e}function F_(s,t){const e=new Ie,n=[3,4][t],i=18.4,o=10,a=n*3.1,r=yt([ft.concrete,ft.cream][t],.06,s);Ge(e,i,o+2,.6,yt(ft.plinth,.1,s)),e.box(0,.6,-.8,i,a,o-1.6,r,st.windows);for(let c=1;c<=n;c++)e.box(0,.6+c*3.1-.3,o/2-.4,i-.3,.3,1.6,r.map(l=>l*.9),st.plain);return is(e,i,o-1.6,a+.6,1.2,.4,yt(ft.iron,.1,s),{z:-.8}),e}const $i=60;function N_(s,t){const e=new Ie,n=yt([ft.concrete,ft.concreteWarm,ft.limewash][t],.06,s),i=n.map((o,a)=>o*.75+yt(ft.glass,0,s)[a]*.25);return t===0?(e.box(0,-un*3,0,29,un*3+6,18,n.map(o=>o*.9),st.masonry),e.box(0,6,0,27,$i-6,13,i,st.windows),e.box(0,$i,0,27.6,1.2,13.6,n.map(o=>o*.85),st.plain)):t===1?(e.box(0,-un*3,0,22,un*3+1,22,n.map(o=>o*.9),st.masonry),e.box(0,1,0,20,$i-1,20,i,st.windows),e.box(0,$i,0,8,3,8,n.map(o=>o*.8),st.plain)):(e.box(0,-un*3,0,28,un*3+9,26,n.map(o=>o*.88),st.windows),e.box(-2,9,-2,17,$i-9,16,i,st.windows),e.box(-2,$i,-2,17.6,1,16.6,n.map(o=>o*.85),st.plain)),e}function O_(s,t){const e=new Ie,n=yt([ft.concrete,ft.paleGrey,ft.stoneGrey][t],.08,s),i=yt([ft.iron,ft.ironGreen,ft.iron][t],.1,s),o=[12,12.2,11.6][t],a=[12.5,12,13][t];if(Ge(e,o+.3,a+.3,.25,yt(ft.plinth,.1,s)),t===1){e.box(0,.25,0,o,4.6,a,n,st.plain);const c=3,l=a/c;for(let h=0;h<c;h++){const u=-a/2+h*l,f=u+l,m=.25+4.6,g=m+2.2,x=-o/2,p=o/2;e.quad([x,m,u],[x,g,f],[p,g,f],[p,m,u],i,st.roof),e.quad([x,g,f],[x,m,f],[p,m,f],[p,g,f],yt(ft.glass,.05,s),st.plain),e.tri([x,m,u],[x,m,f],[x,g,f],n,st.plain),e.tri([p,m,f],[p,m,u],[p,g,f],n,st.plain)}ss(e,a,3.6,3.4,.25)}else{const r=t===0?5.2:3.8;e.box(0,.25,0,o,r,a,n,st.clap),Yn(e,o,a,.25+r,t===0?1.6:2.6,.4,i,n,{alongZ:!0,wallMat:st.clap,roofMat:st.roof}),ss(e,a,t===0?4.2:6.5,t===0?4:3.4,.25)}return e}function B_(s){const t=new Ie,e=yt(ft.coral,.04,s),n=yt(ft.shingle,.08,s),i=24,o=44;Ge(t,i+1,o+1,.8,yt(ft.plinth,.08,s)),t.box(0,.8,-2,i,9.2,o-4,e,st.masonry),Yn(t,i,o-4,10,6.5,.6,n,e,{alongZ:!0,wallMat:st.masonry,z:-2}),t.box(0,.75,o/2-3.6,9,22.05,8.4,e,st.masonry),t.box(0,22.8,o/2-3.6,9.6,.8,9,e.map(a=>a*.88),st.masonry);for(const[a,r]of[[-1,-1],[1,-1],[1,1],[-1,1]])t.box(a*4,23.6,o/2-3.6+r*3.5,1.2,1.4,1.2,e,st.masonry);return ss(t,2*(o/2-3.6+4.2),2.2,4,.8),t}function W_(s){const t=new Ie,e=yt(ft.limewash,.03,s),n=yt(ft.iron,.08,s),i=13,o=24;return Ge(t,i+.6,o+.6,.8,yt(ft.plinth,.08,s)),t.box(0,.8,-1,i,6.4,o-2,e,st.clap),Yn(t,i,o-2,7.2,4.6,.5,n,e,{alongZ:!0,wallMat:st.clap,z:-1}),t.box(0,.75,o/2-1.3,4.5,14.05,4.9,e,st.clap),Nf(t,4.8,14.8,12,n,0,o/2-1.3),t}function G_(s){const t=new Ie,e=yt(ft.concreteWarm,.03,s);return Ge(t,14,14,.5,yt(ft.plinth,.08,s)),t.box(0,.5,0,12,40,12,e,st.windows),t.box(0,40.5,0,13,6,13,e.map(n=>n*.93),st.masonry),Nf(t,13,46.5,7,yt(ft.ironGreen,.05,s)),t.cyl([0,53.5,0],[0,60,0],.25,.15,yt(ft.dark,0),st.plain,4),t}function Of(s,t={}){const e={},n=(i,o)=>{e[i]=o.map(a=>{const r=vc(a.geometry());r.computeBoundingBox();const c=r.boundingBox;r.dispose();const l=un*(i==="tower"?3:1)+.25;t[i]&&a.box(0,-l,0,t[i][0],l+.2,t[i][1],yt(ft.concrete,.05,s).map(u=>u*.88),st.plain);const h=vc(a.geometry());return{geometry:h,hx:Math.max(-c.min.x,c.max.x),hz:Math.max(-c.min.z,c.max.z),box:[c.min.x,c.max.x,c.min.z,c.max.z],top:c.max.y,tris:h.index.count/3}})};return n("kauhale",A_.map(i=>T_(s,i))),n("hale",[0,1].map(i=>C_(s,i))),n("frame",[0,1,2].map(i=>R_(s,i))),n("adobe",[0,1].map(i=>L_(s,i))),n("cottage",[0,1,2].map(i=>P_(s,i))),n("store",[[2,5.8],[1,9.4]].map(([i,o])=>D_(s,i,o))),n("block",[0,1,2].map(i=>I_(s,i))),n("bungalow",[0,1,2].map(i=>U_(s,i))),n("midrise",[0,1].map(i=>k_(s,i))),n("house",[0,1,2].map(i=>z_(s,i))),n("walkup",[0,1].map(i=>F_(s,i))),n("tower",[0,1,2].map(i=>N_(s,i))),n("shed",[0,1,2].map(i=>O_(s,i))),n("church",[B_(s)]),n("spire",[W_(s)]),n("clock",[G_(s)]),e}function Hc(s=2,t=5e4){const e=Math.log(1+t/s),n=new Float32Array(256);for(let i=0;i<256;i++)n[i]=s*(Math.exp(i/255*e)-1);return{lut:n,decode:i=>s*(Math.exp(i/255*e)-1),encode:i=>Math.max(0,Math.min(255,Math.round(255*Math.log(1+Math.max(0,i)/s)/e)))}}const H_=s=>Math.max(1,Math.round(60/Math.max(1,s)));async function Vr(s,t){const{arch:e}=s,n=Hc(s.d0,s.dMax),i=e.W,o=e.H,a=e.rect,r=s.islands,c=new Int8Array(i*o).fill(-1),l=(a.x1-a.x0)/i,h=(a.z1-a.z0)/o;for(let x=0;x<o;x++){const p=a.z0+(x+.5)*h;for(let d=0;d<i;d++){const v=a.x0+(d+.5)*l;let M=0,S=-1;for(let b=0;b<r.length;b++){const w=r[b].rect,E=Math.min(v-w.x0,w.x1-v,p-w.z0,w.z1-p);E>M&&(M=E,S=b)}c[x*i+d]=S}}const u=new Float32Array(i*o*3),f=new Float32Array(i*o),m={kf:s.kf,arch:null,islands:[]};for(let x=0;x<r.length;x++){const p=r[x],{W:d,H:v}=p,[M,S,b]=await Promise.all(["cultivation","settlement","forest"].map(P=>V_(p.layers[P],d,v,t,`${p.id} ${P}`))),w=p.land&&p.land.length===d*v?p.land:null,E=p.rect,A=(E.x1-E.x0)/d,_=(E.z1-E.z0)/v,y=new Int32Array(d);for(let P=0;P<d;P++)y[P]=Math.floor((E.x0+(P+.5)*A-a.x0)/l);for(let P=0;P<v;P++){const I=Math.floor((E.z0+(P+.5)*_-a.z0)/h);if(I<0||I>=o)continue;const R=P*d;for(let U=0;U<d;U++){const F=y[U];if(F<0||F>=i)continue;const G=I*i+F;if(c[G]!==x)continue;const W=R+U;w&&!w[W]||(u[G*3]+=M[W],u[G*3+1]+=n.lut[S[W]],u[G*3+2]+=b[W],f[G]++)}}const C=Math.max(1,p.f||1);if(C===1){const P=new Uint8Array(d*v*4);for(let I=0;I<d*v;I++)P[I*4]=M[I],P[I*4+1]=S[I],P[I*4+2]=b[I],P[I*4+3]=255;w&&$r(P,d,v,w,2),m.islands.push({id:p.id,W:d,H:v,data:P})}else{const P=Math.max(1,Math.round(d/C)),I=Math.max(1,Math.round(v/C)),R=new Float32Array(P*I*3),U=new Float32Array(P*I),F=new Int32Array(d);for(let W=0;W<d;W++)F[W]=Math.min(P-1,Math.floor((W+.5)*P/d));for(let W=0;W<v;W++){const K=Math.min(I-1,Math.floor((W+.5)*I/v))*P;for(let H=0;H<d;H++){const et=W*d+H;if(w&&!w[et])continue;const ct=K+F[H];R[ct*3]+=M[et],R[ct*3+1]+=n.lut[S[et]],R[ct*3+2]+=b[et],U[ct]++}}const G=Qh(R,U,P*I,n);$r(G,P,I,U,2),m.islands.push({id:p.id,W:P,H:I,data:G})}}const g=Qh(u,f,i*o,n);return $r(g,i,o,f,3),m.arch={W:i,H:o,data:g},m}function $r(s,t,e,n,i){let o=Uint8Array.from(n,a=>a?1:0);for(let a=0;a<i;a++){const r=o.slice();for(let c=0;c<e;c++)for(let l=0;l<t;l++){const h=c*t+l;if(o[h])continue;let u=0,f=0,m=0,g=0;const x=p=>{o[p]&&(u++,f+=s[p*4],m+=s[p*4+1],g+=s[p*4+2])};l>0&&x(h-1),l<t-1&&x(h+1),c>0&&x(h-t),c<e-1&&x(h+t),u&&(s[h*4]=Math.round(f/u),s[h*4+1]=Math.round(m/u),s[h*4+2]=Math.round(g/u),r[h]=1)}o=r}}function Qh(s,t,e,n){const i=new Uint8Array(e*4);for(let o=0;o<e;o++){const a=t[o];i[o*4+3]=255,a&&(i[o*4]=Math.round(s[o*3]/a),i[o*4+1]=n.encode(s[o*3+1]/a),i[o*4+2]=Math.round(s[o*3+2]/a))}return i}async function V_(s,t,e,n,i){if(!s)return new Uint8Array(t*e);if(typeof s=="string")return Xr(await n(s),t,e,s);const[o,a]=await Promise.all([n(s.from),n(s.to)]),r=Xr(o,t,e,s.from),c=Xr(a,t,e,s.to),l=s.t,h=new Uint8Array(t*e);for(let u=0;u<t*e;u++)h[u]=Math.round(r[u]+(c[u]-r[u])*l);return h}function Xr(s,t,e,n){if(s.W!==t||s.H!==e)throw new Error(`${n} is ${s.W}×${s.H}, the pack is ${t}×${e}`);return s.px}async function To(s,t){const{px:e,W:n,H:i}=await s(t),o=new Uint8Array(n*i);for(let a=0,r=0;a<n*i;a++,r+=4)o[a]=e[r];return{px:o,W:n,H:i}}const tu=["cultivation","settlement","forest"],$_={cultivation:"Cultivation",settlement:"Settlement",forest:"Native forest"},Yi=[1100,1450],X_=3,va=.002,q_=10,Cs=(s,t,e)=>Math.max(t,Math.min(e,s)),eu=(s,t,e)=>{const n=Cs((e-s)/(t-s),0,1);return n*n*(3-2*n)};function j_(){const s=new Ye(new Uint8Array([0,0,0,255]),1,1,Ee,de);return s.needsUpdate=!0,s}function Y_(s){var n;const t=(n=s.data)==null?void 0:n.metres;if(!t)return null;const e=new Uint8Array(t.length);for(let i=0;i<t.length;i++)e[i]=t[i]>0?1:0;return e}function nu(s,t,e,n){const i=new Ye(s,t,e,Ee,de);return i.minFilter=ns,i.magFilter=Be,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=on,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class K_{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.blank=j_();const e=t.shared.uniforms;Object.assign(e,{uArchLandA:{value:this.blank},uArchLandB:{value:this.blank},uLandT:{value:0},uLandK:{value:0},uLandEarly:{value:1}}),this.uniforms=e,this.available=null,this.manifest=null,this.keyframes=[],this.resident=new Map,this.loading=new Map,this.bound=null,this.swapTo=null,this.kpShown=0,this.fade=0,this.fadeGoal=0,this.listeners=[],this.chain=Promise.resolve(),this.jobN=0,this.uploads=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){var a;const t=this.data.abs("layers/manifest.json");let e;try{const r=await fetch(t);if(!r.ok)throw new Error(`HTTP ${r.status}`);if(e=await r.json(),!Array.isArray(e==null?void 0:e.keyframes)||!e.keyframes.length||!e.islands)throw new Error("no keyframes or islands")}catch(r){this.available=!1,this.warn(`${t}: ${r.message} (no land layers)`),this.notify();return}this.manifest=e,this.keyframes=[...e.keyframes].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),this.kfIndex=new Map(this.keyframes.map((r,c)=>[r.id,c]));const n=((a=e.encoding)==null?void 0:a.settlement)||{};this.codec=Hc(n.d0??2,n.dMax??5e4);const i=this.app.world;this.islands=i.islandPacks.filter(r=>e.islands[r.id]).map(r=>({pack:r,entry:e.islands[r.id]}));const o=i.archPack;this.arch={W:Math.max(1,Math.round(o.W/2)),H:Math.max(1,Math.round(o.H/2)),rect:o.rect},this.eraYears=this.app.timeline.eras.map(r=>this.eraYear(r)),this.available=!0,this.notify()}eraYear(t){var i,o;const e=(o=(i=this.manifest.eras)==null?void 0:i[t.id])==null?void 0:o.cultivation,n=a=>{var r;return(r=this.keyframes[this.kfIndex.get(a)])==null?void 0:r.year};return e!=null&&e.keyframe&&n(e.keyframe)!==void 0?n(e.keyframe):e!=null&&e.from&&n(e.from)!==void 0&&n(e.to)!==void 0?n(e.from)+(n(e.to)-n(e.from))*(e.t??0):t.year}kpAtYear(t){const e=this.keyframes;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}position(t=this.app.timeline.s){const e=this.eraYears;if(!(e!=null&&e.length))return 0;const n=Cs(t,0,e.length-1),i=Math.min(e.length-2,Math.floor(n));return i<0?this.kpAtYear(e[0]):this.kpAtYear(e[i]+(e[i+1]-e[i])*(n-i))}bracket(t){const e=this.keyframes.length,n=r=>this.keyframes[r].id;if(e<2)return{a:n(0),b:n(0),t:0,need:[n(0)]};const i=Cs(Math.floor(t),0,e-2),o=Cs(t-i,0,1),a=o<va?[n(i)]:o>1-va?[n(i+1)]:[n(i),n(i+1)];return{a:n(i),b:n(i+1),t:o,need:a}}covers(t,e){return t?e>=this.kfIndex.get(t.a)-va&&e<=this.kfIndex.get(t.b)+va:!1}clampTo(t,e){return Cs(e,this.kfIndex.get(t.a),this.kfIndex.get(t.b))}job(t){var r;const e=this.keyframes,n=this.kfIndex.get(t),i=c=>this.data.abs(`layers/${c}`),o=(c,l)=>{const h=m=>{var g,x,p;return(p=(x=(g=c.layers)==null?void 0:g[e[m].id])==null?void 0:x[l])==null?void 0:p.file};if(h(n))return i(h(n));let u=n-1;for(;u>=0&&!h(u);)u--;let f=n+1;for(;f<e.length&&!h(f);)f++;return u>=0&&f<e.length?{from:i(h(u)),to:i(h(f)),t:(e[n].year-e[u].year)/(e[f].year-e[u].year)}:u>=0?i(h(u)):f<e.length?i(h(f)):null},a=((r=this.manifest.encoding)==null?void 0:r.settlement)||{};return{kf:t,d0:a.d0??2,dMax:a.dMax??5e4,arch:this.arch,islands:this.islands.map(({pack:c,entry:l})=>({id:c.id,W:c.W,H:c.H,f:H_(Math.max(c.mx,c.mz)),rect:c.rect,land:Y_(c),layers:Object.fromEntries(tu.map(h=>[h,o(l,h)]))}))}}request(t){const e=this.chain=this.chain.catch(()=>{}).then(()=>{if(!this.wanted(t))return null;const n=performance.now();return this.run(this.job(t)).then(i=>{this.arrive(i),this.lastBakeMs=Math.round(performance.now()-n)})}).catch(n=>this.warn(`land layers ${t}: ${n.message}`)).finally(()=>{this.loading.delete(t)});return this.loading.set(t,e),e}wanted(t){var n,i;const e=this.bracket(this.position());return this.bound&&this.app.view!=="land"?!1:e.need.includes(t)||((n=this.swapTo)==null?void 0:n.a)===t||((i=this.swapTo)==null?void 0:i.b)===t}run(t){const e=n=>To(Kn,n);if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("layers-worker-OijIdfIP.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=n=>this.reply(n.data),this.worker.onerror=n=>{var o;(o=n.preventDefault)==null||o.call(n),this.fallback=!0;const i=this.pending;this.pending=null,i&&Vr(i.job,e).then(i.resolve,i.reject)}}catch{this.fallback=!0}return this.fallback?Vr(t,e):new Promise((n,i)=>{const o=++this.jobN;this.pending={id:o,job:t,resolve:n,reject:i},this.worker.postMessage({...t,job:o})})}reply(t){const e=this.pending;!e||t.job!==e.id||(this.pending=null,t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,Vr(e.job,n=>To(Kn,n)).then(e.resolve,e.reject)):e.reject(new Error(t.message)))}arrive(t){const e=Math.min(4,this.app.renderer.capabilities.getMaxAnisotropy()),n={id:t.kf,arch:nu(t.arch.data,t.arch.W,t.arch.H,e),archData:t.arch.data,islands:new Map(t.islands.map(i=>[i.id,nu(i.data,i.W,i.H,e)])),texels:t.arch.W*t.arch.H+t.islands.reduce((i,o)=>i+o.W*o.H,0),used:performance.now()};this.resident.set(t.kf,n),this.uploads.push(n.arch,...n.islands.values())}dropUnused(){var n,i,o,a;const t=performance.now(),e=new Set([(n=this.bound)==null?void 0:n.a,(i=this.bound)==null?void 0:i.b,(o=this.swapTo)==null?void 0:o.a,(a=this.swapTo)==null?void 0:a.b,...this.bracket(this.position()).need]);for(const[r,c]of this.resident){if(e.has(r)){c.used=t;continue}if(this.resident.size>X_||t-c.used>q_*1e3){c.arch.dispose();for(const l of c.islands.values())l.dispose();this.resident.delete(r),this.uploads=this.uploads.filter(l=>l!==c.arch&&![...c.islands.values()].includes(l))}}}resolve(t){const e=this.resident.has(t.a)?t.a:t.b;return{a:e,b:this.resident.has(t.b)?t.b:e}}bind(t){const{a:e,b:n}=this.resolve(t);this.bound={a:e,b:n};const i=this.resident.get(e),o=this.resident.get(n),a=this.uniforms;a.uArchLandA.value=i.arch,a.uArchLandB.value=o.arch;for(const r of this.app.world.islands)this.attach(r);this.notify()}attach(t){const e=t.uniforms;if(!e.uOwnLandA)return;const n=this.bound&&this.resident.get(this.bound.a),i=this.bound&&this.resident.get(this.bound.b);e.uOwnLandA.value=(n==null?void 0:n.islands.get(t.pack.id))||this.blank,e.uOwnLandB.value=(i==null?void 0:i.islands.get(t.pack.id))||this.blank}update(t,e){const n=this.uniforms;if(n.uLandEarly.value=eu(Yi[0],Yi[1],this.app.timeline.year),!this.available){n.uLandK.value=0;return}const i=this.position(),o=this.bracket(i);if(this.app.view==="land"||e>.001||!this.bound)for(const l of o.need)!this.resident.has(l)&&!this.loading.has(l)&&this.request(l);const r=o.need.every(l=>this.resident.has(l));if(r&&!this.swapTo&&!this.covers(this.bound,i)&&(!this.bound||this.fade<.02?(this.bind(o),this.kpShown=this.clampTo(this.bound,i)):this.covers(this.resolve(o),this.kpShown)?this.bind(o):this.swapTo=o),this.swapTo?(this.fadeGoal=0,this.fade<.02&&(this.bind(r?o:this.swapTo),this.swapTo=null,this.kpShown=this.clampTo(this.bound,i))):this.fadeGoal=this.bound?1:0,this.bound){const l=this.clampTo(this.bound,i);this.kpShown+=(l-this.kpShown)*(1-Math.exp(-t*8)),Math.abs(l-this.kpShown)<1e-4&&(this.kpShown=l)}this.fade+=(this.fadeGoal-this.fade)*(1-Math.exp(-t*6)),Math.abs(this.fadeGoal-this.fade)<.003&&(this.fade=this.fadeGoal),this.apply(e),this.dropUnused();const c=this.uploads.shift();c!=null&&c.image.data&&this.app.renderer.initTexture(c)}apply(t){const e=this.uniforms;if(this.bound){const n=this.kfIndex.get(this.bound.a),i=this.kfIndex.get(this.bound.b);e.uLandT.value=i>n?Cs((this.kpShown-n)/(i-n),0,1):0}e.uLandK.value=t*this.fade}settle(t){if(!this.available)return;const e=this.position(),n=this.bracket(e);n.need.every(i=>this.resident.has(i))&&!this.covers(this.bound,e)&&this.bind(n),this.swapTo=null,this.bound&&(this.kpShown=this.clampTo(this.bound,e)),this.fade=this.fadeGoal=this.bound?1:0,this.uniforms.uLandEarly.value=eu(Yi[0],Yi[1],this.app.timeline.year),this.apply(t)}get ready(){return!!this.available&&this.covers(this.bound,this.position())&&!this.swapTo&&this.fade>.99}describe(){if(!this.available)return null;const{a:t,b:e,need:n}=this.bracket(this.position()),i=this.keyframes,o=(l,h)=>{var g,x,p,d,v,M,S,b,w,E;const u=this.kfIndex.get(l),f=(p=(x=(g=this.manifest.methods)==null?void 0:g[l])==null?void 0:x[h])==null?void 0:p.method;if(f||(d=i[u].layers)!=null&&d.includes(h))return f?[f]:[];const m=[];for(let A=u-1;A>=0;A--){const _=(S=(M=(v=this.manifest.methods)==null?void 0:v[i[A].id])==null?void 0:M[h])==null?void 0:S.method;if(_){m.push(_);break}}for(let A=u+1;A<i.length;A++){const _=(E=(w=(b=this.manifest.methods)==null?void 0:b[i[A].id])==null?void 0:w[h])==null?void 0:E.method;if(_){m.push(_);break}}return m},a=tu.map(l=>{const h=n.flatMap(f=>o(f,l)),u=h.includes("modelled")?"modelled":h.includes("mixed")?"partly modelled":"";return{id:l,name:$_[l],note:u}}),r=l=>i[this.kfIndex.get(l)].year;return{years:n.length>1?[r(t),r(e)]:[r(n[0])],layers:a,early:this.app.timeline.year<Yi[1]}}valuesAt(t,e){if(!this.bound)return null;const n=this.resident.get(this.bound.a),i=this.resident.get(this.bound.b);if(!n||!i)return null;const{W:o,H:a,rect:r}=this.arch,c=Math.floor((t-r.x0)/(r.x1-r.x0)*o),l=Math.floor((e-r.z0)/(r.z1-r.z0)*a);if(c<0||l<0||c>=o||l>=a)return null;const h=(l*o+c)*4,u=this.uniforms.uLandT.value,f=m=>n.archData[h+m]+(i.archData[h+m]-n.archData[h+m])*u;return{cultivation:f(0)/255,people:this.codec.decode(f(1)),forest:f(2)/255}}stats(){let t=0,e=0;for(const n of this.resident.values())t+=n.texels,e+=n.archData.byteLength;return{available:this.available,resident:[...this.resident.keys()],bound:this.bound?`${this.bound.a}/${this.bound.b}`:null,t:+this.uniforms.uLandT.value.toFixed(3),k:+this.uniforms.uLandK.value.toFixed(3),gpuMB:+(t*4*4/3/1048576).toFixed(1),cpuMB:+(e/1048576).toFixed(1),bakeMs:this.lastBakeMs??null}}dispose(){var t;for(const e of this.resident.values()){e.arch.dispose();for(const n of e.islands.values())n.dispose()}this.resident.clear(),(t=this.worker)==null||t.terminate()}}const $t=(s,t,e)=>Math.max(t,Math.min(e,s)),ce=(s,t,e)=>{const n=$t((e-s)/(t-s),0,1);return n*n*(3-2*n)},Ai=.36,ci=.4,Bf=.14,Vc=.14,ui=4*Ai+Bf,Ti=2*ci+Vc,Wt=5,iu=8/(ui*Ti)*100,su=5e3,Xn=.012,Wf=hi(.15),Z_=ci/2+Vc/2-Xn,Ji=3.5,ou=.8,au=Re*1.4,Se=Re*1.25,mi={kauhale:{sh:au,sv:au,relief:2.5,loose:!0},hale:{sh:Se,sv:Se,relief:3,jitter:.2},frame:{sh:Se,sv:Se,relief:3,jitter:.3},adobe:{sh:Se,sv:Se,relief:3,jitter:.3},cottage:{sh:Se,sv:Se,relief:3.5},store:{sh:Se,sv:Se,relief:3},block:{sh:Se,sv:Se,relief:3},bungalow:{sh:Se*.92,sv:Se*.92,relief:4},midrise:{sh:Re,sv:Re*.8,relief:4},house:{sh:Se*.9,sv:Se*.9,relief:6},walkup:{sh:Re*.75,sv:Re*.75,relief:5},tower:{sh:Re*.48,sv:Re*.58,relief:6},shed:{sh:Se*.9,sv:Se*.9,relief:4},church:{sh:Re*.85,sv:Re*.85,relief:3},spire:{sh:Se*.9,sv:Se*.9,relief:3},clock:{sh:Re*.7,sv:Re*.7,relief:3}},qn=Object.keys(mi),$c=Object.fromEntries(["walkup","tower"].map(s=>[s,[(Ai-2*Xn)/mi[s].sh,(ci-2*Xn)/mi[s].sh]])),Pt=Object.fromEntries(qn.map((s,t)=>[s,t])),J_=new Set(["church","spire","clock"]),Me={houses:1,lowrise:2,highrise:3,commercial:4,downtown:5,industrial:6,resort:7,agricultural:8,conservation:9,military:10,institutional:11,parks:12},qr={rural:2,agricultural:3,conservation:4},Q_=1960,jr=1964,Va={[Me.downtown]:9e3,[Me.resort]:8e3,[Me.commercial]:4e3,[Me.industrial]:3500,[Me.institutional]:1500,[Me.military]:800,[Me.agricultural]:120},ty=4,ey=[1100,1200,1300,1400,1450,1600,1700],ny=.6,ru=2.5,xa=1e5,iy=232,sy=1936,oy=1800,ay=(()=>{let s=[[0]];for(let t=0;t<3;t++){const e=s.length,n=Array.from({length:2*e},()=>new Array(2*e));for(let i=0;i<e;i++)for(let o=0;o<e;o++){const a=4*s[i][o];n[i][o]=a,n[i][o+e]=a+2,n[i+e][o]=a+3,n[i+e][o+e]=a+1}s=n}return s})(),ry=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];function $a(s,t,e){const n=Math.floor(s),i=Math.floor(t),o=s-n,a=t-i,r=o*o*(3-2*o),c=a*a*(3-2*a),l=ve(n,i,e),h=ve(n+1,i,e),u=ve(n,i+1,e),f=ve(n+1,i+1,e);return l+(h-l)*r+(u-l+(l-h+f-u)*r)*c}function Xa(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function cy(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function ly(s,t){var o,a,r,c,l,h,u;const e=s==null?void 0:s.zoning,n=((o=e==null?void 0:e.islands)==null?void 0:o[t])??(e==null?void 0:e[t])??((r=(a=s==null?void 0:s.islands)==null?void 0:a[t])==null?void 0:r.zoning)??((u=(h=(l=(c=s==null?void 0:s.islands)==null?void 0:c[t])==null?void 0:l.layers)==null?void 0:h.now)==null?void 0:u.zoning)??null;if(!n)return{zoning:null,lud:null};const i=f=>typeof f=="string"?f:(f==null?void 0:f.file)||null;return{zoning:i(n.zoning??n.now??(n.file?n:null)),lud:i(n.lud)}}async function Gf(s,t,e){var h;let n=null,i=t;const o=(h=s.params)==null?void 0:h.get("zoning");if(o)try{n=new URL(o.endsWith("/")?o:`${o}/`,location.href);const u=await fetch(new URL("layers/manifest.json",n));i=u.ok?await u.json():null}catch{i=null}const a=ly(i,e),r=async u=>{if(!u)return null;try{const f=n?new URL(`layers/${u}`,n).href:s.data.abs(`layers/${u}`);return await To(Kn,f)}catch(f){return s.warn(`zoning ${e}: ${u}: ${f.message} (the settlements go by density and value there)`),null}},[c,l]=await Promise.all([r(a.zoning),r(a.lud)]);return{zoning:c,lud:l,files:a}}function yo(s,t,e,n){if(!s)return 0;const i=Math.floor((e-t.x0)/(t.x1-t.x0)*s.W),o=Math.floor((n-t.z0)/(t.z1-t.z0)*s.H);return i<0||o<0||i>=s.W||o>=s.H?0:s.px[o*s.W+i]}class Hf{constructor(t){this.app=t,this.sites=0}setLayers(t){var a;const e=[...t.keyframes||[]].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),n=((a=t.encoding)==null?void 0:a.settlement)||{},i=n.dMax??5e4;this.d0=n.d0??2,this.L=Math.log(1+i/this.d0),this.codec=Hc(this.d0,i),this.keyframes=e;const o=r=>{var c;return(c=e.find(l=>l.id===r))==null?void 0:c.year};this.eraYears=this.app.timeline.eras.map(r=>{var l,h;const c=(h=(l=t.eras)==null?void 0:l[r.id])==null?void 0:h.settlement;return c!=null&&c.keyframe&&o(c.keyframe)!==void 0?o(c.keyframe):c!=null&&c.from&&o(c.from)!==void 0&&o(c.to)!==void 0?o(c.from)+(o(c.to)-o(c.from))*(c.t??0):r.year}),this.lut=new Float32Array(256*8+1);for(let r=0;r<=256*8;r++)this.lut[r]=this.d0*(Math.exp(r/8/255*this.L)-1)}layerFiles(t){return this.keyframes.map(e=>{var n,i,o,a,r,c;return{settlement:((o=(i=(n=t.layers)==null?void 0:n[e.id])==null?void 0:i.settlement)==null?void 0:o.file)||null,value:((c=(r=(a=t.layers)==null?void 0:a[e.id])==null?void 0:r.value)==null?void 0:c.file)||null}})}kpAt(t){const e=this.app.timeline,n=this.eraYears,i=this.keyframes;let o=t;if(n.length>1){const a=$t(e.sAtYear(t),0,n.length-1),r=Math.min(n.length-2,Math.floor(a));o=n[r]+(n[r+1]-n[r])*(a-r)}if(o<=i[0].year)return 0;for(let a=0;a+1<i.length;a++)if(o<=i[a+1].year)return a+(o-i[a].year)/(i[a+1].year-i[a].year);return i.length-1}sample(t,e,n,i,o){const a=this.crop,r=$t((e-a.x0)/a.sx-.5,0,a.w-1.001),c=$t((n-a.z0)/a.sz-.5,0,a.h-1.001),l=r|0,h=c|0,u=r-l,f=c-h,m=h*a.w+l;for(let g=0;g<t.length;g++){const x=t[g],p=x[m]+(x[m+1]-x[m])*u,d=x[m+a.w]+(x[m+a.w+1]-x[m+a.w])*u,v=p+(d-p)*f;i[g]=v>.5?v+o:0}return i}bytesAt(t,e,n){const i=($a(t/1.7,e/1.7,71)-.5)*26+($a(t/.55,e/.55,72)-.5)*12;return this.sample(this.bytes,t,e,n,i)}people(t){return t<=0?0:t<256?this.lut[Math.round(t*8)]:this.d0*(Math.exp(t/255*this.L)-1)}townTerm(t,e,n="island"){const i=this.keyframes,o=this.app.data.proj,a=this.crop,r=this.islandRect;this.townTerms=[],i.forEach((c,l)=>{var M,S,b,w,E,A,_,y,C,P;const h=(S=(M=t.methods)==null?void 0:M[c.id])==null?void 0:S.settlement;if(c.year<oy||!h||(b=h.towns)!=null&&b.length)return;const u=i.slice(l+1).find(I=>{var R,U,F,G;return(G=(F=(U=(R=t.methods)==null?void 0:R[I.id])==null?void 0:U.settlement)==null?void 0:F.towns)==null?void 0:G.length}),f=(w=h.populations)==null?void 0:w[e];if(!u||!Number.isFinite(f))return;const m=t.methods[u.id].settlement,g=m.towns.map(I=>({...I,xz:o.toWorld([I.lon,I.lat])})).filter(I=>I.xz[0]>r.x0&&I.xz[0]<r.x1&&I.xz[1]>r.z0&&I.xz[1]<r.z1&&(I.share||0)>0);if(!g.length)return;const x=(P=(C=(y=(_=(A=(E=t.islands)==null?void 0:E[e])==null?void 0:A.layers)==null?void 0:_[u.id])==null?void 0:y.settlement)==null?void 0:C.stats)==null?void 0:P.people;for(const I of g){let R=1;if(n==="district"){const U=(m.districts||[]).find(F=>F.name===I.district);R=U&&x?$t(U.pop/x,.05,1):.25}I.people=f*(I.share||0)*R}const p=Math.min(.9,g.reduce((I,R)=>I+R.people,0)/f),d=Float32Array.from(this.bytes[l]),v=new Float32Array(a.w*a.h);for(const I of g){const R=(I.sigma||1500)/1e3,U=4*R*1e3/100,F=$t(Math.floor((I.xz[0]-U-a.x0)/a.sx),0,a.w-1),G=$t(Math.ceil((I.xz[0]+U-a.x0)/a.sx),0,a.w-1),W=$t(Math.floor((I.xz[1]-U-a.z0)/a.sz),0,a.h-1),K=$t(Math.ceil((I.xz[1]+U-a.z0)/a.sz),0,a.h-1),H=I.people/(2*Math.PI*R*R);for(let et=W;et<=K;et++)for(let ct=F;ct<=G;ct++){const Q=a.x0+(ct+.5)*a.sx,nt=a.z0+(et+.5)*a.sz,dt=((Q-I.xz[0])**2+(nt-I.xz[1])**2)/100;v[et*a.w+ct]+=H*Math.exp(-dt/(2*R*R))}}for(let I=0;I<d.length;I++){if(d[I]<=0&&v[I]<=0||d[I]<=0)continue;const R=this.codec.decode(d[I])*(1-p)+v[I];d[I]=255*Math.log(1+Math.max(0,R)/this.d0)/this.L}this.bytes[l]=d,this.townTerms.push({keyframe:c.id,from:u.id,towns:g.map(I=>I.name),people:Math.round(f*p)})})}years(t){const e=this.app.timeline,n=e.yearAt(0),i=e.yearAt(e.max),o=new Set([...t].filter(c=>c>n&&c<=i)),a=this.keyframes[0].year,r=new Set([n,...ey.filter(c=>c>n&&c<a),...o]);for(let c=a;c<=i;c+=ty)r.add(c);r.add(i),this.Ys=[...r].filter(c=>c>=n&&c<=i).sort((c,l)=>c-l),this.isBreak=this.Ys.map(c=>o.has(c)),this.edges=[...o].sort((c,l)=>c-l),this.epochAt=this.Ys.map(c=>this.epochOfYear(c)),this.samples=this.Ys.map(c=>{const l=this.kpAt(c),h=Math.min(this.keyframes.length-2,Math.floor(l)),u=[1820,1860,1900,1960].map(m=>ce(m-10,m+10,c)),f=[1-u[0],u[0]-u[1],u[1]-u[2],u[2]-u[3],u[3]];return{y:c,a:h,t:l-h,early:25.5*(1-ce(Yi[0],Yi[1],c)),w:f}})}epochOfYear(t){const e=this.edges;let n=0;for(;n<e.length&&t>=e[n];)n++;return n}fill(t,e){const n=Math.min(.08333333333333333,e/(8*iu)),i=t.w,o=e/su;let a=0;return i[1]&&(a+=i[1]*Math.min(.8,Math.max(o,.8*(e/700)**2))),i[2]&&(a+=i[2]*Math.min(.9,Math.max(o,.9*(e/1300)**2.5))),i[3]&&(a+=i[3]*Math.min(.9,Math.max(o,.9*(e/2500)**1.5))),i[4]&&(a+=i[4]*(e<6e3?Math.min(.85,Math.max(o,.85*(e/6e3)**1.2)):.85-.45*ce(6e3,15e3,e))),[a,n]}fillMax(t){return Math.max(4*Math.min(1/12,t/(8*iu)),Math.min(.9,t/su),Math.min(.8,.8*(t/700)**2),Math.min(.9,.9*(t/1300)**2.5),Math.min(.9,.9*(t/2500)**1.5),Math.min(.85,.85*(t/6e3)**1.2))}valueAt(t,e,n){if(t.vb)return $t((t.vb[e.a]+(t.vb[e.a+1]-t.vb[e.a])*e.t)/255,0,1);const i=ce(1.5,4,Math.log10(Math.max(1,n))),o=ce(1800,2e3,e.y);return $t(.34*i+.14*t.coast+.16*t.harbour+.22*t.centre+.1*o+.24*(t.r8-.5),0,1)}kindAt(t,e,n,i,o){const a=$t(Math.log10(Math.max(1,e)/300),-1,1),r=t-i.lag*(1-.6*Math.max(0,a));if(t<1818||r<1820)return o?Pt.kauhale:Pt.hale;const c=ce(.35,.8,n);if(r<1860){const u=(1-ce(1820,1880,r+12*a))*(1.15-.6*c);return i.r2<u?Pt.hale:i.r3<.15+.5*c?Pt.adobe:Pt.frame}if(r<1900){if(e>1150&&i.r3<.3||e>450&&i.r3<.42*ce(.6,.9,n))return Pt.block;if(e>700&&i.r3<.55||e>250&&i.r3<.6*ce(.5,.8,n))return Pt.store;const u=(1-ce(1820,1880,r+12*a))*(1.2-.8*c);return i.r2<u?Pt.hale:i.r4<.2?Pt.frame:Pt.cottage}if(r<1960)return e>4e3&&i.r3<.5||e>2e3&&i.r3<.45*ce(.65,.95,n)?Pt.midrise:e>1800&&i.r3<.6||e>700&&i.r3<.5*ce(.55,.85,n)?Pt.block:(e>900&&i.r3<.4||e>400&&i.r3<.4*ce(.5,.8,n))&&r<1935?Pt.store:Pt.bungalow;const l=i.zone;if(t>=jr&&i.lud===qr.conservation)return-1;if(l)return this.zoneKind(l,r,e,n,i);if(t>=jr&&i.lud===qr.agricultural)return i.r3<.4?Pt.shed:Pt.house;if(t>=jr&&i.lud===qr.rural)return Pt.house;const h=i.zoned?Pt.walkup:Pt.tower;return i.core?h:e>2e4?i.r3<.85?h:Pt.walkup:e>1e4?i.r3<.2+.5*ce(1e4,2e4,e)+.2*c?h:Pt.walkup:e>4e3?i.r3<.45+.2*c?i.r5<.25*ce(.7,.95,n)?h:Pt.walkup:Pt.house:e>2500&&i.r3<.2+.15*c?Pt.walkup:i.r4<.35&&r<1990?Pt.bungalow:Pt.house}zoneKind(t,e,n,i,o){const a=ce(.35,.8,i);switch(t){case Me.houses:return o.r4<.35&&e<1990?Pt.bungalow:Pt.house;case Me.lowrise:return o.r3<.55+.35*a?Pt.walkup:Pt.house;case Me.highrise:return o.r3<.3+.45*ce(4e3,2e4,n)+.2*a?Pt.tower:Pt.walkup;case Me.commercial:return n>4e3&&o.r3<.25+.45*a?Pt.midrise:n<2e3&&o.r4<.35-.25*a?Pt.store:Pt.block;case Me.downtown:return o.core||n>6e3&&o.r3<.25+.5*ce(6e3,15e3,n)+.2*a?Pt.tower:n>5e3&&o.r4<.3+.4*a?Pt.midrise:n<5e3&&o.r4<.55-.3*a?Pt.store:Pt.block;case Me.industrial:case Me.military:return Pt.shed;case Me.resort:return o.r3<.15+.45*ce(.5,.9,i)+.35*ce(4e3,15e3,n)?Pt.tower:Pt.walkup;case Me.agricultural:return Pt.shed;case Me.institutional:return n>3e3&&o.r3<.3*a?Pt.midrise:Pt.block;case Me.conservation:case Me.parks:return-1;default:return Pt.house}}variantOf(t,e,n){return e===Pt.tower&&t.zone===Me.resort&&t.r6<.75?0:Math.min(n-1,Math.floor(ve(t.tile,e,Math.floor(t.rank*1e6))*n))}towerHeight(t){return 35+115*ce(4,4.7,Math.log10(Math.max(1,t)))}byteAt(t,e){return t.b[e.a]+(t.b[e.a+1]-t.b[e.a])*e.t-e.early}fillByte(t,e,n){const i=t.zone&&e.w[4]>0&&e.y>=Q_?Va[t.zone]:0;if(!i)return n;const o=255*Math.log(1+i/this.d0)/this.L+10*(t.r6-.5);return o>n?n+(o-n)*e.w[4]:n}scatterLot(t,e,n,i){var h,u;const o=this.Ys.length,a=this.samples,r=new Map;let c=null;const l=f=>{const m=this.instance(t,c,f);if(Array.isArray(m))for(const g of m)i(g);else i(m);c=null};t.core=!1,t.anchor&&(t.yard=new Uint8Array(o));for(let f=0;f<o;f++){const m=a[f];let g=null,x=this.byteAt(t,m);const p=t.core&&m.y>=1960&&(t.zoned?t.zone===Me.downtown||t.zone===Me.highrise:!0);p&&(x=Math.max(x,iy+14*t.r6));const d=this.fillByte(t,m,x),v=(u=(h=t.host)==null?void 0:h.yard)==null?void 0:u[f];if(d>0&&!v){const M=this.people(x),[S,b]=this.fill(m,this.people(d)),w=n(f),E=!!t.anchor&&t.rankY<4*b*t.w*w,A=this.valueAt(t,m,M);let _=-1;if((p||t.rank<S*t.w*w||E)&&(_=this.kindAt(m.y,M,A,t,E)),_===Pt.kauhale&&!E&&(_=Pt.hale),_>=0&&_!==Pt.kauhale&&!(p||t.rank<S*t.w*w)&&(_=-1),_>=0){const y=_===Pt.kauhale?Hr.length:this.kits[qn[_]].length,C=this.variantOf(t,_,y),P=this.epochAt[f],I=_*16+C;let R=r.get(I*256+255);if(R===void 0&&(R=r.get(I*256+P)),R===void 0){const U=this.pose(t,_,C),F=mi[qn[_]].relief;let G=!1;if(U.parts){R=[];for(const W of U.parts){const K=e(W,F,P);if(G||(G=this.dep),K===null){R=null;break}R.push(K)}}else R=e(U,F,P),G=this.dep;r.set(I*256+(G?P:255),R)}R!==null&&(g={key:I,kind:_,variant:C,top:R,d:M},_===Pt.kauhale&&(t.yard[f]=1)),g&&_===Pt.midrise&&m.y<=sy&&(t.core=!0)}}if(c&&g&&g.key===c.key){c.d=Math.max(c.d,g.d);continue}c&&l(f),g&&(c={...g,n0:f})}c&&l(o)}fitOf(t,e){const n=t*16+e;this.fits??(this.fits=new Map);let i=this.fits.get(n);if(i!==void 0)return i;const o=qn[t],a=mi[o];if(J_.has(o))i=1;else if(a.loose){let r=0,c=0;for(const[l,h,u,f]of Hr[e]){const m=this.kits[o][f];for(const g of[-.2,.2]){const x=Math.cos(u+g),p=Math.sin(u+g),d=Math.cos(g),v=Math.sin(g),M=l*d+h*v,S=-l*v+h*d;r=Math.max(r,Math.abs(M)+Math.abs(m.hx*x)+Math.abs(m.hz*p)),c=Math.max(c,Math.abs(S)+Math.abs(m.hx*p)+Math.abs(m.hz*x))}}i=Math.min(1,(Ai-Xn)/(r*a.sh),(ci-Xn)/(c*a.sh))}else{const r=this.kits[o][e],[c,l,h,u]=r.box,f=(a.jitter||0)/2,m=Math.cos(f),g=Math.sin(f),x=Math.max(-c,l)*m+Math.max(-h,u)*g,p=-h*m+Math.max(-c,l)*g,d=u*m+Math.max(-c,l)*g,v=a.jitter?.03:0;i=Math.min(1,(Ai/2-Xn-v)/(x*a.sh),(ci/2-Xn-v)/(p*a.sh),(Z_-v)/(d*a.sh))}return this.fits.set(n,i),i}pose(t,e,n){const i=qn[e],o=mi[i],a=this.fitOf(e,n);let r=t.x,c=t.z,l=t.face;if(o.loose){const g=o.sh*a;r=t.x+Ai/2*t.e[0]+ci/2*t.m[0],c=t.z+Ai/2*t.e[1]+ci/2*t.m[1],l=Math.atan2(t.e[0],t.e[1])-Math.PI/2+(t.r7-.5)*.4+(t.r5<.5?0:Math.PI);const x=Math.cos(l),p=Math.sin(l),d=Hr[n].map(([v,M,S,b])=>{const w=this.kits[i][b];return{x:r+(v*x+M*p)*g,z:c+(-v*p+M*x)*g,a:l+S,size:b,ax:w.hx*g,az:w.hz*g,f:a}});return{x:r,z:c,a:l,parts:d,f:a}}const h=this.kits[i][n];o.jitter&&(l+=(t.r5-.5)*o.jitter,r+=(t.r6-.5)*.06,c+=(t.r7-.5)*.06);const u=$c[i],f=u?Math.max(h.hx*o.sh*a,Ai/2-Xn):h.hx*o.sh*a,m=u?Math.max(h.hz*o.sh*a,ci/2-Xn):h.hz*o.sh*a;return{x:r,z:c,a:l,ax:f,az:m,f:a}}instance(t,e,n){const i=this.Ys,o=i.length,a=qn[e.kind],r=mi[a],c=t.landmark?{x:t.x,z:t.z,a:t.face,f:1}:this.pose(t,e.kind,e.variant),l=new Float32Array(4),h=g=>{const x=i[g-1],p=i[g],d=Math.min(ny,(p-x)/2),v=x+d+ve(t.tile??0,g,Math.floor((t.rank??0)*1e6))*(p-x-2*d);return[v-d,v+d]};e.n0===0?(l[0]=-xa,l[1]=-xa+1):this.isBreak[e.n0]||t.landmark?(l[0]=i[e.n0],l[1]=i[e.n0]+ru):[l[0],l[1]]=h(e.n0),n>=o?(l[2]=xa,l[3]=xa+1):this.isBreak[n]?(l[2]=i[n]-ru,l[3]=i[n]-.01):[l[2],l[3]]=h(n);const u=a==="tower"?this.towerHeight(e.d)/$i:1,f=.94+.12*(t.r5??.5),m=(g,x,p)=>{const d=this.kits[a][x],v=g.f??c.f??1;return{kind:e.kind,variant:x,site:this.sites,x:g.x,z:g.z,a:g.a,y:hi(p)+Wf,sh:r.sh*v,sv:r.sv*v*u,stretch:u,span:l,colour:[f*(.98+.04*(t.r6??.5)),f,f*(.98+.04*(t.r7??.5))],rx:d.hx*r.sh*v*.95,rz:d.hz*r.sh*v*.95,landmark:!!t.landmark}};return this.sites++,c.parts?c.parts.map((g,x)=>m(g,g.size,e.top[x])):m(c,e.variant,e.top)}tileLots(t,e,n,i,o,a){const r=[Math.cos(n),Math.sin(n)],c=[-r[1],r[0]];let l=1/0,h=-1/0,u=1/0,f=-1/0;for(const[p,d]of[[t,e],[t+Wt,e],[t,e+Wt],[t+Wt,e+Wt]]){const v=p*c[0]+d*c[1],M=p*r[0]+d*r[1];l=Math.min(l,v),h=Math.max(h,v),u=Math.min(u,M),f=Math.max(f,M)}const m=.42,g=(p,d)=>p>=t&&p<t+Wt&&d>=e&&d<e+Wt&&!(o[0]&&p<t+m||o[1]&&p>=t+Wt-m||o[2]&&d<e+m||o[3]&&d>=e+Wt-m),x=[];for(let p=Math.floor(u/Ti)-1;p<=Math.ceil(f/Ti);p++)for(let d=Math.floor(l/ui)-1;d<=Math.ceil(h/ui);d++)for(let v=0;v<2;v++){const M=[[0,0],[1,0],[0,1],[1,1]].map(([w,E])=>{const A=2*v+w,_=d*ui+Bf/2+(A+.5)*Ai,y=p*Ti+Vc/2+(E+.5)*ci,C=_*c[0]+y*r[0],P=_*c[1]+y*r[1];return{iu:A,iv:E,u:_,v:y,x:C,z:P,ok:g(C,P)&&a(C,P)}}),S=M.every(w=>w.ok);let b=null;for(const w of M){if(!w.ok)continue;const{iu:E,iv:A,u:_,v:y,x:C,z:P}=w,I=d*4+E,R=p*2+A,U=(ay[R&7][I&7]+ve(I,R,i*7+1))/64,F=K=>ve(I,R,i*7+K),G=A===0?[-r[0],-r[1]]:r,W={x:C,z:P,rank:U,face:Math.atan2(G[0],G[1]),tile:i,bu:d,bv:p,u:_,v:y,e:c,m:r,lag:25*F(2),r2:F(3),r3:F(4),r4:F(5),r5:F(6),r6:F(7),r7:F(8),r8:F(9)};if(w===M[0]&&S){const K=d*2+v;W.anchor=!0,W.rankY=(ry[p&3][K&3]+ve(K,p,i*7+11))/16,b=W}else b&&(W.host=b);x.push(W)}}return x}}function Vf(s,t,e,n,i){var r,c;let o=t.metresAt(e,n);const a=(c=(r=s.patches)==null?void 0:r.byPack)==null?void 0:c.get(t.pack.id);if(!a)return o;for(const l of a){if(!(i<l.until))continue;const h=l.box,u=(e-h[0])/(h[2]-h[0]),f=(n-h[1])/(h[3]-h[1]);if(u<0||f<0||u>1||f>1)continue;const m=s.patches.maskAt(l.crop,u,f);m>0&&(o+=((l.kind==="raise"?Math.max(o,l.depthM):Math.min(o,l.depthM))-o)*m)}return o}function $f(s,t){const e=s.data.proj,n=s.data.places||[],i=[],o=[],a=Object.values(t.methods||{}).flatMap(r=>{var c;return((c=r==null?void 0:r.settlement)==null?void 0:c.towns)||[]});for(const r of a){if(!Number.isFinite(r.lon)||!Number.isFinite(r.lat))continue;const[c,l]=e.toWorld([r.lon,r.lat]);i.push({x:c,z:l,s:(r.sigma||1e3)/100})}for(const r of n){if(r.kind!=="town"&&r.kind!=="bay")continue;const c=fn(r.geometry);if(!c)continue;const[l,h]=e.toWorld(c);r.kind==="town"&&i.push({x:l,z:h,s:8}),o.push({x:l,z:h,town:r.kind==="town"})}return{cores:i,harbours:o}}function Xf(s,t,e,n){let i=0;for(const a of s.cores){const r=(t-a.x)**2+(e-a.z)**2;r>16*a.s*a.s||(i=Math.max(i,Math.exp(-r/(2*a.s*a.s))))}let o=0;for(const a of s.harbours){const r=Math.hypot(t-a.x,e-a.z);r>60||(o=Math.max(o,Math.exp(-r/15)*(a.town?n:1)))}return{centre:i,harbour:o}}const hy=8e3,cu=8e3,Cn=3,qf=s=>$t(s*2.6,40,110),uy=[1850,1875,1900,1930,1960,2e3],fy=.1,dy=1;class py extends Hf{constructor(t,e,n,i,o){super(t),this.districts=e,this.rec=n,this.own=i,this.ribbons=o,this.group=new We,this.group.name="settlements",this.group.visible=!1,this.ready=!1,this.failed=null,this.yearNow=t.timeline.year,i.uYearNow.value=this.yearNow,this.drawn=0,this.streamLines=n.data.streams,this.load().catch(a=>{this.failed=a.message,t.warn(`settlements: ${a.message} (the scatter is not drawn)`)})}async load(){var _;const t=performance.now(),e=this.app.data,n=await fetch(e.abs("layers/manifest.json"));if(!n.ok)throw new Error(`layers/manifest.json: HTTP ${n.status}`);const i=await n.json(),o=this.rec.d,a=(_=i.islands)==null?void 0:_[o.parent],r=this.app.world.islandPacks.find(y=>y.id===o.parent);if(!a||!r)throw new Error(`no settlement layer for ${o.parent}`);this.setLayers(i);const c=this.layerFiles(a);if(this.keyframes.length<2||c.some(y=>!y.settlement))throw new Error("the settlement layer lacks a keyframe");const l=y=>To(Kn,e.abs(`layers/${y}`)),[h,u,f]=await Promise.all([Promise.all(c.map(y=>l(y.settlement))),c.every(y=>y.value)?Promise.all(c.map(y=>l(y.value))).catch(()=>null):null,Gf(this.app,i,o.parent)]);for(const[y,C]of[...h,...u||[]].entries())if(C.W!==r.W||C.H!==r.H)throw new Error(`a layer of ${o.parent} is ${C.W}×${C.H} (${y}), the pack ${r.W}×${r.H}`);const m=r.rect,g=o.rect,x=(m.x1-m.x0)/r.W,p=(m.z1-m.z0)/r.H,d=$t(Math.floor((g.x0-m.x0)/x)-2,0,r.W-1),v=$t(Math.ceil((g.x1-m.x0)/x)+2,0,r.W-1),M=$t(Math.floor((g.z0-m.z0)/p)-2,0,r.H-1),S=$t(Math.ceil((g.z1-m.z0)/p)+2,0,r.H-1),b=v-d+1,w=S-M+1;this.crop={x0:m.x0+d*x,z0:m.z0+M*p,sx:x,sz:p,w:b,h:w},this.islandRect=m;const E=y=>{const C=new Float32Array(b*w);for(let P=0;P<w;P++)for(let I=0;I<b;I++)C[P*b+I]=y.px[(M+P)*r.W+d+I];return C};this.bytes=h.map(E),this.values=u?u.map(E):null,this.zoning={...f,rect:m},this.places=$f(this.app,i),this.townTerm(i,o.parent,"island"),this.loadMs=Math.round(performance.now()-t);const A=performance.now();await this.build()&&(this.buildMs=Math.round(performance.now()-A),this.ready=!0)}async breathe(t=!1){return(t||performance.now()-this.slice>24)&&(await new Promise(e=>setTimeout(e,0)),this.slice=performance.now()),!this.disposed}patchState(t){var r;const e=this.rec,n=e.raise.map(c=>({k:t<c.until?1:0,depth:c.depth})),i=((r=e.pmap)==null?void 0:r.groups)||[0],o=new Float32Array(16),a=new Float32Array(16).fill(-1);for(let c=0;c<i.length;c++){const l=i[c]||0;let h=-1;e.lower.forEach((u,f)=>{l&1<<f&&(h<0&&(h=f),t<u.until&&o[c]<1&&(o[c]=1,a[c]=u.depth))}),!o[c]&&h>=0&&(a[c]=e.lower[h].depth)}return{raise:n,gk:o,gd:a}}groundAt(t,e,n){const i=this.rec,o=i.d.W,a=e*o+t;let r=i.metres[a];const c=this.districts.patchAt(t,e);if(c&&c[1]+c[3]>0){const h=n.raise[c[2]&15],u=n.raise[c[2]>>4];h&&(r+=(Math.max(r,h.depth)-r)*(c[1]/255)*h.k),u&&(r+=(Math.max(r,u.depth)-r)*(c[3]/255)*u.k)}const l=i.aux[a*4];if(l){const h=c?c[0]:0;r=Bc(r,l,n.gk[h],nr(i.carve[a*2]),n.gd[h])}return r}texelOf(t,e){const n=this.rec.d,i=n.rect;return[$t(Math.floor((t-i.x0)/(i.x1-i.x0)*n.W),0,n.W-1),$t(Math.floor((e-i.z0)/(i.z1-i.z0)*n.H),0,n.H-1)]}edgeAt(t,e){const n=this.rec.d.rect;return Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e)}allows(t,e,n,i,o,a,r){const c=this.epochs[r],l=this.rec,h=l.aux,u=l.d.W,f=Math.cos(o),m=-Math.sin(o),g=[f,m],x=[-m,f];let p=1/0,d=-1/0,v=-1/0;this.dep=!1;const M=l.parent,S=qe.margin;for(let b=0;b<13;b++){const w=b===0?0:b<5?[-1,1,1,-1][b-1]:b<9?[0,1,0,-1][b-5]:[-1,1,1,-1][b-9],E=b===0?0:b<5?[-1,-1,1,1][b-1]:b<9?[-1,0,1,0][b-5]:[-1,-1,1,1][b-9],A=b>=9?1.25:1,_=t+(g[0]*w*n+x[0]*E*i)*A,y=e+(g[1]*w*n+x[1]*E*i)*A,[C,P]=this.texelOf(_,y),I=P*u+C,R=h[I*4+3];if(R>0&&h[I*4+1]>0&&(this.dep=!0,c.features.has(R)))return null;if(b>=9)continue;if(this.streamNear(_,y))return null;(h[I*4]||this.districts.patchAt(C,P))&&(this.dep=!0);let U=this.groundAt(C,P,c.state);if(U<.6)return null;const F=l.metres[I];p=Math.min(p,F),d=Math.max(d,F);const G=this.edgeAt(_,y);if(M&&G<S){const W=ce(qe.band,S,G);U=Math.max(U,Vf(this.app,M,_,y,c.year)*(1-W)+U*W),this.dep=!0}v=Math.max(v,U)}if(d-p>a)return null;for(const b of this.landmarks)if(!(Math.hypot(t-b.x,e-b.z)>=b.r+Math.max(n,i)+Xn)&&(this.dep=!0,c.year>=b.from))return null;return v}grounds(){const e=this.rec.d,n=e.rect,i=4,o=Math.ceil(e.W/i),a=Math.ceil(e.H/i),r=this.patchState(1800),c=new Uint8Array(o*a);for(let b=0;b<a;b++)for(let w=0;w<o;w++)c[b*o+w]=this.groundAt(Math.min(e.W-1,w*i+2),Math.min(e.H-1,b*i+2),r)<=0?1:0;const l=e.mx*i,h=e.mz*i,u=hn(o,a,b=>c[b]===1,l,h);this.sea={w:o,h:a,k:i,a:Float32Array.from(u)};const f=zn(Float32Array.from(u,b=>Math.min(b,3e3)),o,a,12,3);this.broad={w:o,h:a,a:f};const m=2,g=Math.ceil(e.W/m),x=Math.ceil(e.H/m),p=new Uint8Array(g*x),d=this.streamLines,v=b=>$t(Math.floor((b-n.x0)/(n.x1-n.x0)*g),0,g-1),M=b=>$t(Math.floor((b-n.z0)/(n.z1-n.z0)*x),0,x-1);for(let b=0;d&&b<d.length;){const w=d[b++];for(let E=0;E<w;E++,b+=3){if(E+1>=w)continue;const[A,_,y,C]=[d[b],d[b+1],d[b+3],d[b+4]],P=Math.max(1,Math.ceil(Math.hypot(y-A,C-_)/.05));for(let I=0;I<=P;I++)p[M(_+(C-_)*I/P)*g+v(A+(y-A)*I/P)]=1}}const S=hn(g,x,b=>p[b]===1,e.mx*m,e.mz*m);this.stream={w:g,h:x,a:Float32Array.from(S)},this.streamLines=null}coarse(t,e,n){const i=this.rec.d.rect,o=$t(Math.floor((e-i.x0)/(i.x1-i.x0)*t.w),0,t.w-1),a=$t(Math.floor((n-i.z0)/(i.z1-i.z0)*t.h),0,t.h-1);return t.a[a*t.w+o]}streamNear(t,e){return this.coarse(this.stream,t,e)<9}mauka(t,e){const n=this.broad,i=this.rec.d.rect,o=(t-i.x0)/(i.x1-i.x0)*n.w,a=(e-i.z0)/(i.z1-i.z0)*n.h,r=(g,x)=>n.a[$t(x,0,n.h-1)*n.w+$t(g,0,n.w-1)],c=Math.round(o),l=Math.round(a),h=10,u=r(c+h,l)-r(c-h,l),f=r(c,l+h)-r(c,l-h);if(Math.hypot(u,f)<.001)return Math.PI/2;const m=Math.PI/60;return Math.round(Math.atan2(f,u)/m)*m}weight(t,e){const[n,i]=this.texelOf(t,e),o=this.rec.d,a=this.rec.metres,r=(h,u)=>a[$t(u,0,o.H-1)*o.W+$t(h,0,o.W-1)],c=Math.hypot((r(n+2,i)-r(n-2,i))/(4*o.mx),(r(n,i+2)-r(n,i-2))/(4*o.mz));return(.55+.8*Math.max(Math.exp(-this.coarse(this.sea,t,e)/700),Math.exp(-this.coarse(this.stream,t,e)/160)))*(1-.6*ce(.08,.35,c))}epochYears(){const t=this.rec,e=new Set;for(const o of[...t.raise,...t.lower])e.add(o.until);for(const[,o]of t.d.byIndex){const[a,r]=ir(o.properties);Number.isFinite(a)&&e.add(a),Number.isFinite(r)&&e.add(r+1)}for(const o of this.landmarks)e.add(o.from);this.years(e);const i=this.app.timeline.yearAt(0);this.epochs=[];for(let o=0;o<=this.edges.length;o++){const a=o===0?i:this.edges[o-1],r=new Set;for(const[c,l]of t.d.byIndex)Io(l.properties,a)&&r.add(c);this.epochs.push({year:a,state:this.patchState(a),features:r})}}async build(){const n=this.rec.d.rect,i=Xa(1820);this.times={},this.slice=performance.now();let o=performance.now(),a=0;const r=v=>{this.times[v]=Math.round(a+performance.now()-o),a=0,o=performance.now()},c=async()=>{const v=performance.now(),M=await this.breathe();return performance.now()-v>1&&(a+=v-o,o=performance.now()),M};if(this.kits=Of(i,$c),r("kits"),this.grounds(),r("grounds"),!await c())return!1;const l=[],h=Math.ceil((n.x1-n.x0)/Wt),u=Math.ceil((n.z1-n.z0)/Wt),f=new Float32Array(h*u);for(let v=0;v<u;v++)for(let M=0;M<h;M++)f[v*h+M]=this.mauka(n.x0+(M+.5)*Wt,n.z0+(v+.5)*Wt);const m=(v,M)=>v<0||M<0||v>=h||M>=u?NaN:f[M*h+v],g=new Float32Array(this.keyframes.length),x=new Float32Array(this.keyframes.length),p=Ji+ou,d=this.zoning;for(let v=0;v<u;v++){if(!await c())return!1;for(let M=0;M<h;M++){const S=n.x0+M*Wt,b=n.z0+v*Wt,w=f[v*h+M],E=[m(M-1,v)!==w,m(M+1,v)!==w,m(M,v-1)!==w,m(M,v+1)!==w],A=v*h+M,_=(y,C)=>this.edgeAt(y,C)>=p;for(const y of this.tileLots(S,b,w,A,E,_)){this.bytesAt(y.x,y.z,g);let C=0;for(const F of g)C=Math.max(C,F);y.zone=yo(d.zoning,d.rect,y.x,y.z),y.lud=yo(d.lud,d.rect,y.x,y.z),y.zoned=!!d.zoning;const P=Va[y.zone];P&&(C=Math.max(C,255*Math.log(1+P/this.d0)/this.L+5));const I=this.fillMax(this.people(C));if(y.rank>=I*1.5&&!(y.anchor&&y.rankY<I*1.5)||(y.w=this.weight(y.x,y.z)*(.85+.3*$a(y.x/2.3,y.z/2.3,73)),y.rank>=I*y.w&&!(y.anchor&&y.rankY<I*y.w)))continue;y.b=Float32Array.from(g),this.values&&(y.vb=Float32Array.from(this.sample(this.values,y.x,y.z,x,0)));const R=Math.exp(-this.coarse(this.sea,y.x,y.z)/600),U=Xf(this.places,y.x,y.z,R);y.coast=R,y.harbour=U.harbour,y.centre=U.centre,l.push(y)}}}return this.lotCount=l.length,this.gridTiles={nx:h,nz:u},this.ths=f,r("lots"),this.landmarks=[],this.epochYears(),this.placeLandmarks(l),this.landmarks.length&&this.epochYears(),r("landmarks"),!await this.scatter(l,c)||(r("scatter"),this.meshes(),r("meshes"),!await this.streets(c))?!1:(r("streets"),this.instances=null,this.clearing(),!0)}placeLandmarks(t){const e=new Map((this.app.data.places||[]).map(p=>[p.id,p])),n=this.app.data.proj,i=this.keyframes,o=p=>i.findIndex(d=>d.year>=p),a=(p,d,v,M,S,b)=>{const w=this.kits[p][0],E=mi[p],A=this.epochOfYear(S);if(this.edgeAt(d,v)<Ji+ou)return!1;const _=this.allows(d,v,w.hx*E.sh,w.hz*E.sh,M,E.relief+2,A);return _===null?!1:(this.landmarks.push({kind:p,name:b,x:d,z:v,face:M,from:S,r:Math.hypot(w.hx,w.hz)*E.sh,top:_}),!0)},r=(p,d)=>{let v=null,M=1/0;for(const S of t){const b=Math.hypot(S.x-p,S.z-d);b<M&&(M=b,v=S)}return v},c=(p,d)=>this.people(p.b[d]),l=Math.max(0,o(1853)),h=Math.max(0,o(1896)),u=e.get("kawaiahao");let f=!1;if(u){const[p,d]=n.toWorld(fn(u.geometry)),v=r(p,d);f=a("church",p,d,v?v.face:0,1842,"Kawaiahaʻo")}if(!f){const p=this.crop,d=this.bytes[l];let v=-1,M=0,S=0;for(let w=0;w<p.h;w++)for(let E=0;E<p.w;E++)d[w*p.w+E]<=v||(v=d[w*p.w+E],M=p.x0+(E+.5)*p.sx,S=p.z0+(w+.5)*p.sz);const b=[...t].sort((w,E)=>Math.hypot(w.x-M,w.z-S)-Math.hypot(E.x-M,E.z-S));for(const w of b.slice(0,200))if(f=a("church",w.x,w.z,w.face,1842,"Kawaiahaʻo"))break}const m=[...t].sort((p,d)=>c(d,h)-c(p,h));let g=0;for(const p of m){if(g>=2)break;if(this.landmarks.some(v=>Math.hypot(v.x-p.x,v.z-p.z)<9))continue;let d=null;for(const v of this.samples){if(v.y<1840)continue;const M=p.b[v.a]+(p.b[v.a+1]-p.b[v.a])*v.t;if(this.people(M)>500){d=v.y;break}}d!==null&&a(d<1860?"church":"spire",p.x,p.z,p.face,d,null)&&g++}const x=e.get("aloha-tower");if(x){const[p,d]=n.toWorld(fn(x.geometry)),v=r(p,d);a("clock",p,d,v?v.face:0,1926,x.name)}}async scatter(t,e){const n=this.Ys.length,i=this.samples,o=new Float64Array(n);for(let h=0;h<t.length;h++){if(h%512===0&&!await e())return!1;const u=t[h];for(let f=0;f<n;f++){const m=i[f],g=this.fillByte(u,m,this.byteAt(u,m));if(g<=0)continue;const[x,p]=this.fill(m,this.people(g));(u.rank<x*u.w||u.anchor&&u.rankY<4*p*u.w)&&o[f]++}}this.cap=Array.from(o,h=>Math.min(1,hy/Math.max(1,h)));const a=[],r=(h,u,f)=>this.allows(h.x,h.z,h.ax,h.az,h.a,u,f),c=h=>this.cap[h],l=h=>a.push(h);for(let h=0;h<t.length;h++){if(h%256===0&&!await e())return!1;this.scatterLot(t[h],r,c,l)}for(const h of this.landmarks){const u=this.Ys.findIndex(f=>f>=h.from);a.push(this.instance({x:h.x,z:h.z,face:h.face,landmark:!0,r5:.5,r6:.5,r7:.5},{kind:Pt[h.kind],variant:0,top:h.top,d:0,n0:Math.max(0,u)},n))}return this.instances=a,!0}weightAt(t,e){const n=this.spans;return ce(n[t*4],n[t*4+1],e)*(1-ce(n[t*4+2],n[t*4+3],e))}meshes(){const t=this.rec.d.rect;this.material=Ao(this.app.shared,this.own,{fade:[50,70],grow:!0}),this.variants=[];const e=new Map;for(const g of qn)this.kits[g].forEach((x,p)=>{e.set(Pt[g]*16+p,this.variants.length),this.variants.push({name:g,v:p,kit:x,n:0})});const n=this.instances.length;this.N=n,this.vOf=new Uint16Array(n),this.mats=new Float32Array(n*16),this.spans=new Float32Array(n*4),this.stretches=new Float32Array(n),this.cols=new Float32Array(n*3),this.ix=new Float32Array(n),this.iz=new Float32Array(n),this.ia=new Float32Array(n),this.iy=new Float32Array(n),this.irx=new Float32Array(n),this.irz=new Float32Array(n),this.isv=new Float32Array(n),this.ish=new Float32Array(n),this.ikind=new Uint8Array(n),this.ivar=new Uint8Array(n),this.isite=new Int32Array(n),this.iland=new Uint8Array(n);const i=new se,o=new Pi,a=new B(0,1,0),r=new B,c=new B;this.instances.forEach((g,x)=>{const p=e.get(g.kind*16+g.variant);this.vOf[x]=p,this.variants[p].n++,o.setFromAxisAngle(a,g.a),r.set(g.x,g.y,g.z),c.set(g.sh,g.sv,g.sh),i.compose(r,o,c),i.toArray(this.mats,x*16),this.spans.set(g.span,x*4),this.stretches[x]=g.stretch,this.cols.set(g.colour,x*3),this.ix[x]=g.x,this.iz[x]=g.z,this.ia[x]=g.a,this.iy[x]=g.y,this.irx[x]=g.rx,this.irz[x]=g.rz,this.isv[x]=g.sv,this.ish[x]=g.sh,this.ikind[x]=g.kind,this.ivar[x]=g.variant,this.isite[x]=g.site,this.iland[x]=g.landmark?1:0});for(const g of this.variants){const x=Math.max(1,Math.min(g.n,cu)),p=g.kit.geometry,d=new Uc(p,this.material,x);d.name=`${g.name}-${g.v}`,d.count=0,d.visible=!1,d.frustumCulled=!1,d.instanceMatrix.setUsage(wn),d.instanceColor=new Ne(new Float32Array(x*3),3),d.instanceColor.setUsage(wn);const v=new Ne(new Float32Array(x*4),4);v.setUsage(wn);const M=new Ne(new Float32Array(x),1);M.setUsage(wn),p.setAttribute("aSpan",v),p.setAttribute("aStretch",M),Object.assign(g,{mesh:d,cap:x,aSpan:v,aStretch:M}),this.group.add(d)}const l=Xa(1842);this.tnx=Math.ceil((t.x1-t.x0)/Cn),this.tnz=Math.ceil((t.z1-t.z0)/Cn);const h=this.tnx*this.tnz,u=new Int32Array(n),f=new Int32Array(h);this.instances.forEach((g,x)=>{const p=$t(Math.floor((g.x-t.x0)/Cn),0,this.tnx-1),d=$t(Math.floor((g.z-t.z0)/Cn),0,this.tnz-1);u[x]=d*this.tnx+p,f[u[x]]++}),this.tStart=new Int32Array(h+1);for(let g=0;g<h;g++)this.tStart[g+1]=this.tStart[g]+f[g];const m=this.tStart.slice();this.tOrder=new Int32Array(n);for(let g=0;g<n;g++)this.tOrder[m[u[g]]++]=g;for(let g=0;g<h;g++)for(let x=this.tStart[g+1]-1;x>this.tStart[g];x--){const p=this.tStart[g]+Math.floor(l()*(x-this.tStart[g]+1)),d=this.tOrder[x];this.tOrder[x]=this.tOrder[p],this.tOrder[p]=d}this.always=[];for(let g=0;g<n;g++)this.iland[g]&&this.always.push(g);this.frustum=new Ii,this.pv=new se,this.box=new bn,this.key="",this.yearDrawn=NaN}aliveNear(t,e){const n=this.spans;return n[t*4]<e+1&&n[t*4+3]>e-1}refresh(t,e,n){const i=this.yearNow,o=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const a=this.rec.d.rect,r=e*.7,c=[],l=Math.max(0,Math.floor((o.x-e-a.x0)/Cn)),h=Math.min(this.tnx-1,Math.floor((o.x+e-a.x0)/Cn)),u=Math.max(0,Math.floor((o.z-e-a.z0)/Cn)),f=Math.min(this.tnz-1,Math.floor((o.z+e-a.z0)/Cn));for(let v=u;v<=f;v++)for(let M=l;M<=h;M++){const S=v*this.tnx+M;if(this.tStart[S+1]===this.tStart[S])continue;const b=a.x0+M*Cn,w=a.z0+v*Cn;this.box.min.set(b,-.5,w),this.box.max.set(b+Cn,n,w+Cn);const E=this.box.distanceToPoint(o);if(E>e||!this.frustum.intersectsBox(this.box))continue;const A=E<r?1:r/E;c.push(S,Math.round(A*20))}const m=c.join(",");if(m===this.key&&Math.abs(i-this.yearDrawn)<.5)return;this.key=m,this.yearDrawn=i;let g=0;const x=[];for(let v=0;v<c.length;v+=2){const M=this.tStart[c[v]],S=this.tStart[c[v]+1];let b=0;for(let w=M;w<S;w++)this.aliveNear(this.tOrder[w],i)&&b++;x.push(b),g+=Math.ceil(b*c[v+1]/20)}const p=Math.min(1,(cu-this.always.length)/Math.max(1,g));for(const v of this.variants)v.c=0;const d=v=>{const M=this.variants[this.vOf[v]];if(M.c>=M.cap)return;const S=M.c++;M.mesh.instanceMatrix.array.set(this.mats.subarray(v*16,v*16+16),S*16),M.mesh.instanceColor.array.set(this.cols.subarray(v*3,v*3+3),S*3),M.aSpan.array.set(this.spans.subarray(v*4,v*4+4),S*4),M.aStretch.array[S]=this.stretches[v]};for(let v=0;v<c.length;v+=2){const M=Math.ceil(x[v/2]*c[v+1]*p/20);let S=0;for(let b=this.tStart[c[v]];b<this.tStart[c[v]+1]&&S<M;b++){const w=this.tOrder[b];this.iland[w]||!this.aliveNear(w,i)||(d(w),S++)}}for(const v of this.always)this.aliveNear(v,i)&&d(v);this.drawn=0;for(const v of this.variants)v.mesh.count=v.c,v.mesh.visible=v.c>0,v.mesh.instanceMatrix.needsUpdate=!0,v.mesh.instanceColor.needsUpdate=!0,v.aSpan.needsUpdate=!0,v.aStretch.needsUpdate=!0,this.drawn+=v.c}async streets(t){const e=this.app.timeline,n=e.yearAt(e.max),i=this.rec.d.rect,{nx:o,nz:a}=this.gridTiles;this.streetBatches=[];for(const r of uy){if(!await t())return!1;const c=Math.min(r,n),l=this.epochOfYear(c),h=this.epochs[l],u=new Map;for(let b=0;b<this.N;b++){if(mi[qn[this.ikind[b]]].loose||this.iland[b]||this.weightAt(b,c)<.5)continue;const E={x:this.ix[b],z:this.iz[b]},A=$t(Math.floor((E.x-i.x0)/Wt),0,o-1),_=$t(Math.floor((E.z-i.z0)/Wt),0,a-1),y=this.ths[_*o+A],C=[Math.cos(y),Math.sin(y)],P=[-C[1],C[0]],I=E.x*P[0]+E.z*P[1],R=E.x*C[0]+E.z*C[1],U=Math.floor(I/ui),F=Math.floor(R/Ti),G=`${_*o+A}:${U}:${F}`,W=u.get(G)||{th:y,bu:U,bv:F,n:0};W.n++,u.set(G,W)}const f=new Map;for(const b of u.values()){if(b.n<2)continue;const w=[Math.cos(b.th),Math.sin(b.th)],E=[-w[1],w[0]],A=(I,R)=>[I*E[0]+R*w[0],I*E[1]+R*w[1]],_=b.bu*ui,y=_+ui,C=b.bv*Ti,P=C+Ti;for(const[I,R,U]of[[`${b.th}:v${b.bv}:${b.bu}`,A(_,C),A(y,C)],[`${b.th}:v${b.bv+1}:${b.bu}`,A(_,P),A(y,P)],[`${b.th}:u${b.bu}:${b.bv}`,A(_,C),A(_,P)],[`${b.th}:u${b.bu+1}:${b.bv}`,A(y,C),A(y,P)]])f.set(I,[R,U])}const m=(b,w,E)=>{const A=Math.max(1,Math.ceil(Math.hypot(w[0]-b[0],w[1]-b[1])/E)),_=[];for(let y=0;y<=A;y++){const C=b[0]+(w[0]-b[0])*y/A,P=b[1]+(w[1]-b[1])*y/A,[I,R]=this.texelOf(C,P),U=R*this.rec.d.W+I,F=this.rec.aux[U*4+3];if(this.groundAt(I,R,h.state)<.4||F>0&&this.rec.aux[U*4+1]>0&&h.features.has(F))return null;_.push([C,P])}return _},g=[];for(const[b,w]of f.values()){const E=m(b,w,.4);E&&g.push({pts:E,width:fy})}const x=[],p=r<1870?1/0:r<1950?5:4;for(const b of u.values()){if(b.n<p)continue;const w=[Math.cos(b.th),Math.sin(b.th)],E=[-w[1],w[0]],A=(b.bv+.5)*Ti,_=C=>[C*E[0]+A*w[0],C*E[1]+A*w[1]],y=m(_(b.bu*ui+.32),_((b.bu+1)*ui-.32),.3);y&&x.push({pts:y,width:dy})}const d=new Gt(r<1910?"#9a8668":r<1950?"#8a8277":Ff.asphalt).toArray(),v=new Gt(r<1910?"#a38f6f":r<1950?"#a09888":"#a9a59c").toArray(),M=this.ribbons.add(g,{mode:"earth",colour:d,alpha:0,minPx:.7,lift:.004,order:4}),S=this.ribbons.add(x,{mode:"earth",colour:v,alpha:0,minPx:0,lift:.003,order:3});this.streetBatches.push({year:r,batch:M,padBatch:S,n:g.length,pads:x.length})}return!0}streetWeights(t){const e=this.streetBatches;return e.map((n,i)=>{const o=i>0?e[i-1].year:n.year-15,a=i+1<e.length?e[i+1].year:1/0;return t<=n.year?i===0?ce(o,n.year,t):$t((t-o)/(n.year-o),0,1):a===1/0?1:$t((a-t)/(a-n.year),0,1)})}clearing(){this.clearN=512,this.clearData=new Uint8Array(512*512);const e=new Ye(this.clearData,512,512,Li,de);e.minFilter=e.magFilter=ie,e.needsUpdate=!0,this.clearTex=e,this.own.uTownClear.value=e,this.yearCleared=NaN,this.townsCleared=-1}stamp(t,e,n,i,o,a){const r=this.clearN,c=this.clearData,l=this.rec.d.rect,h=r/(l.x1-l.x0),u=r/(l.z1-l.z0),f=Math.abs(Math.cos(n)),m=Math.abs(Math.sin(n)),g=i*f+o*m,x=i*m+o*f,p=$t(Math.floor((t-g-l.x0)*h),0,r-1),d=$t(Math.floor((t+g-l.x0)*h),0,r-1),v=$t(Math.floor((e-x-l.z0)*u),0,r-1),M=$t(Math.floor((e+x-l.z0)*u),0,r-1);for(let S=v;S<=M;S++)for(let b=p;b<=d;b++)c[S*r+b]<a&&(c[S*r+b]=a)}stampClearing(t){var e,n;this.clearData.fill(0);for(let i=0;i<this.N;i++){const o=this.weightAt(i,t);o<.02||this.stamp(this.ix[i],this.iz[i],this.ia[i],this.irx[i],this.irz[i],Math.round(255*o))}(e=this.app.towns)==null||e.stampInto(this.rec.d.rect,t,(i,o,a,r,c,l)=>this.stamp(i,o,a,r,c,l)),this.clearTex.needsUpdate=!0,this.yearCleared=t,this.townsCleared=((n=this.app.towns)==null?void 0:n.version)??0}update(t,e,n){var c,l;const i=this.app.timeline.year;if(t>0?(this.yearNow+=(i-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(i-this.yearNow)<.05&&(this.yearNow=i)):this.yearNow=i,this.own.uYearNow.value=this.yearNow,!this.ready)return;this.hidden&&(e=0),this.group.visible=e>.001;const o=this.streetWeights(this.yearNow);if(this.streetBatches.forEach((h,u)=>{h.batch&&(h.batch.uniforms.uAlpha.value=.5*o[u]*e),h.padBatch&&(h.padBatch.uniforms.uAlpha.value=(h.year<1910?.3:h.year<1950?.45:.6)*o[u]*e)}),!this.group.visible)return;const a=qf(n);this.material.uniforms.uFadeNear.value=a*.75,this.material.uniforms.uFadeFar.value=a;const r=(((c=this.rec.data)==null?void 0:c.hi)??1e3)*this.app.world.uniforms.uVert.value+3;this.refresh(this.app.camera,a,r),(!(Math.abs(this.yearNow-this.yearCleared)<.5)||(((l=this.app.towns)==null?void 0:l.version)??0)!==this.townsCleared)&&this.stampClearing(this.yearNow)}alive(t=this.yearNow){if(!this.ready)return[];const e=[];for(let n=0;n<this.N;n++){if(this.weightAt(n,t)<.999)continue;const i=qn[this.ikind[n]],o=this.kits[i][this.ivar[n]];e.push({i:n,site:this.isite[n],kind:i,variant:this.ivar[n],x:this.ix[n],z:this.iz[n],a:this.ia[n],ax:o.hx*this.ish[n],az:o.hz*this.ish[n],box:o.box.map(a=>a*this.ish[n]),y:this.iy[n],height:o.top*this.isv[n],landmark:!!this.iland[n]})}return e}census(t=this.yearNow,e=null,n=null,i=1/0){return jf(this.alive(t),e,n,i)}stats(){if(!this.ready)return{ready:!1,failed:this.failed};const t=this.Ys.findIndex(i=>i>=this.yearNow);let e=this.clearData.byteLength+this.bytes.reduce((i,o)=>i+o.byteLength,0)+this.sea.a.byteLength+this.stream.a.byteLength+this.broad.a.byteLength;for(const i of[this.mats,this.spans,this.cols,this.stretches,this.vOf,this.ix,this.iz,this.ia,this.iy,this.irx,this.irz,this.isv,this.ish,this.ikind,this.ivar,this.isite,this.iland,this.tOrder,this.tStart])e+=i.byteLength;const n=this.census(this.yearNow);return{ready:!0,year:+this.yearNow.toFixed(1),lots:this.lotCount,instances:this.N,placed:n.total,drawn:this.drawn,by:n.by,hale:n.hale,landmarks:this.landmarks.map(i=>`${i.name||i.kind} ${i.from}`),towns:this.townTerms,zoning:{zoning:this.zoning.zoning?`${this.zoning.zoning.W}×${this.zoning.zoning.H}`:null,lud:this.zoning.lud?`${this.zoning.lud.W}×${this.zoning.lud.H}`:null},value:this.values?"mask":"modelled",cap:+(this.cap[Math.max(0,t)]??1).toFixed(2),streets:this.streetBatches.map(i=>{var o;return`${i.year}:${i.n}/${i.pads}:${(((o=i.batch)==null?void 0:o.uniforms.uAlpha.value)??0).toFixed(2)}`}),triangles:this.variants.reduce((i,o)=>i+o.mesh.count*o.kit.tris,0),loadMs:this.loadMs,buildMs:this.buildMs,times:this.times,cpuMB:+(e/1048576).toFixed(1)}}dispose(){var t,e;this.disposed=!0;for(const n of this.variants||[])n.mesh.dispose(),n.kit.geometry.dispose();(t=this.material)==null||t.dispose(),(e=this.clearTex)==null||e.dispose(),this.own.uTownClear.value=null}}function jf(s,t=null,e=null,n=1/0){const i={},o=new Set;let a=0;for(const r of s)t!==null&&Math.hypot(r.x-t,r.z-e)>n||(r.kind==="kauhale"&&a++,r.kind==="hale"&&(a+=2),!o.has(r.site)&&(o.add(r.site),i[r.kind]=(i[r.kind]||0)+1));return{by:i,total:Object.values(i).reduce((r,c)=>r+c,0),hale:a}}const Ei=Re*1.4;function my(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function lu(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function gy(s,t,e,n,i){const o=Math.cos(e),a=Math.sin(e);return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([r,c])=>[s+(r*n*o-c*i*a)/2,t+(r*n*a+c*i*o)/2])}function vy(s,t){for(const e of[s,t])for(let n=0;n<4;n++){const i=e[n],o=e[(n+1)%4],a=[o[1]-i[1],i[0]-o[0]];let r=1/0,c=-1/0,l=1/0,h=-1/0;for(const u of s){const f=u[0]*a[0]+u[1]*a[1];r=Math.min(r,f),c=Math.max(c,f)}for(const u of t){const f=u[0]*a[0]+u[1]*a[1];l=Math.min(l,f),h=Math.max(h,f)}if(c<l||h<r)return!1}return!0}function hu(s,t){const e=[s[0]];for(let n=0;n+1<s.length;n++){const[i,o]=s[n],[a,r]=s[n+1],c=Math.max(1,Math.ceil(Math.hypot(a-i,r-o)/t));for(let l=1;l<=c;l++)e.push([i+(a-i)*l/c,o+(r-o)*l/c])}return e}class xy{constructor(t,e,n){var u,f;this.app=t,this.districts=e,this.rec=n,this.group=new We,this.group.name="district features";const i=t.shared,o=t.data.proj,a=n.d.features.features||[];this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new ee(0,0,0,0))},uDistS:{value:n.terrain.shadow.texture},uYearNow:{value:t.timeline.year},uTownClear:{value:null}};const r=my(1795),c=new Ie;this.counts={hale:0,waa:0,pondWalls:0};for(const[m,g]of n.d.byIndex){const x=(u=g.properties)==null?void 0:u.kind,p=g.geometry.coordinates[0].map(d=>o.toWorld(d));x==="village"?this.buildVillage(c,p,m,r):x==="fishpond"&&this.buildPond(c,p,m,r)}this.structMat=Ao(i,this.own,{fade:[70,110]}),this.structures=new _e(c.geometry(),this.structMat),this.structures.frustumCulled=!1,this.group.add(this.structures),this.forest=new Xx(n.data.trees,n.d.rect,i,this.own),this.group.add(this.forest.group),this.ribbons=new Kx(i,t.camera);const l=n.data.streams,h=[];for(let m=0;m<l.length;){const g=l[m++],x=[],p=[];for(let d=0;d<g;d++,m+=3)x.push([l[m],l[m+1]]),p.push(Math.min(7.5,1+1.3*Math.pow(l[m+2],.45))*Re);h.push({pts:x,width:p})}this.streams=this.ribbons.add(h,{mode:"water",alpha:0,minPx:.9,lift:.004,order:5}),this.streamCount=h.length,this.trails=[];for(const m of a){const g=m.properties||{};if(g.kind!=="trail"||((f=m.geometry)==null?void 0:f.type)!=="LineString")continue;const x=hu(m.geometry.coordinates.map(d=>o.toWorld(d)),.12),p=this.ribbons.add([{pts:x,width:3.2*Re}],{mode:"earth",colour:new Gt("#9c7f5c").toArray(),alpha:0,minPx:1.3,lift:.006,order:5});p&&this.trails.push({p:g,batch:p,w:0})}this.forces=new b_(t,a,i,this.ribbons),this.group.add(this.ribbons.group,this.forces.group),this.settlements=new py(t,e,n,this.own,this.ribbons),this.group.add(this.settlements.group),this.labels=new E_(t,a),this.show=0}groundAt(t,e,n=!0){const i=this.districts.rawAt(t,e);if(!n)return i;const{d:o}=this.rec,a=o.rect,r=Math.max(0,Math.min(o.W-1,Math.floor((t-a.x0)/(a.x1-a.x0)*o.W))),l=Math.max(0,Math.min(o.H-1,Math.floor((e-a.z0)/(a.z1-a.z0)*o.H)))*o.W+r;return Bc(i,this.rec.aux[l*4],1,nr(this.rec.carve[l*2]))}buildVillage(t,e,n,i){t.feature(n);let o=1/0,a=-1/0,r=1/0,c=-1/0;for(const[f,m]of e)o=Math.min(o,f),a=Math.max(a,f),r=Math.min(r,m),c=Math.max(c,m);const l=.85,h=[],u=[];for(let f=r+l/2;f<c;f+=l)for(let m=o+l/2;m<a;m+=l){const g=m+(i()-.5)*l*.7,x=f+(i()-.5)*l*.7;!lu(e,g,x)||i()<.25||h.push([g,x])}for(const[f,m]of h){const g=i()*Math.PI*2,x=2+Math.floor(i()*3),p=[];for(let d=0;d<x;d++){const v=g+d/x*Math.PI*2+(i()-.5)*.6,M=d===0?0:.3+i()*.12,S=f+Math.cos(v)*M,b=m+Math.sin(v)*M;if(!lu(e,S,b)||p.some(([I,R])=>Math.hypot(I-S,R-b)<.3))continue;p.push([S,b]);const w=6+i()*3,E=4+i()*1.4;let A=1/0,_=-1/0;for(const[I,R]of[[0,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const U=this.groundAt(S+I*w*.5*Ei,b+R*E*.5*Ei,!1);A=Math.min(A,U),_=Math.max(_,U)}if(A<.6||_-A>2.5)continue;const y=g+d%2*Math.PI*.5,C=gy(S,b,y,(w+2.4)*Ei,(E+2.4)*Ei);if(u.some(I=>vy(I,C)))continue;u.push(C);const P=hi(_);t.at(S,P,b,y,Ei),Ba(t,i,w,E,4.6+i()*1.2,!0,.9+hi(_-A)/Ei),t.done(),this.counts.hale++}if(i()<.4){const d=f+.08,v=m-.06;t.at(d,hi(this.groundAt(d,v,!1)),v,0,Ei),Bx(t,i),t.done()}}this.buildCanoes(t,e,n,i),t.feature(0)}buildCanoes(t,e,n,i){let o=0,a=0;for(const[f,m]of e)o+=f/e.length,a+=m/e.length;const r=[],c=9,l=.06,h=Array.from({length:16},(f,m)=>[Math.cos(m/16*Math.PI*2),Math.sin(m/16*Math.PI*2)]);for(let f=a-c;f<a+c;f+=l)for(let m=o-c;m<o+c;m+=l){const g=this.groundAt(m,f);if(g<.3||g>2.2)continue;let x=null;for(const[p,d]of h)this.groundAt(m+p*.3,f+d*.3)<=0&&(x=x?[x[0]+p,x[1]+d]:[p,d]);x&&r.push([m,f,g,Math.atan2(x[1],x[0]),Math.hypot(m-o,f-a)])}r.sort((f,m)=>f[4]-m[4]);const u=[];for(const f of r){if(u.length>=14)break;u.some(m=>Math.hypot(m[0]-f[0],m[1]-f[1])<.22)||u.push(f)}for(const[f,m,g,x]of u)t.at(f,hi(g)+.002,m,x,Ei),Ox(t,i,7+i()*4),t.done(),this.counts.waa++}buildPond(t,e,n,i){t.feature(n);const o=yt(Mo.pondStone,.12,i),a=hu(e,.05).map(([r,c])=>[r,hi(Math.max(this.groundAt(r,c),-.8))-.004,c]);t.wall(a,3*Re,1.6*Re,o,st.stone,.72),this.counts.pondWalls++,t.feature(0)}update(t,e,n){const i=e;this.show=i,this.own.uShow.value=i;const o=this.districts.featSeen,a=this.own.uFeatSeen.value;for(let l=0;l<64;l++)a[l>>2].setComponent(l&3,o[l]);this.group.visible=i>.001;const r=this.app.timeline.year,c=t>0?1-Math.exp(-t*1.6):1;this.streams&&(this.streams.uniforms.uAlpha.value=.8*i);for(const l of this.trails){const h=Io(l.p,r)?1:0;l.w+=(h-l.w)*c,Math.abs(h-l.w)<.003&&(l.w=h),l.batch.uniforms.uAlpha.value=.75*l.w*i}this.forest.update(this.app.camera,i,this.rec.data.hi*this.app.world.uniforms.uVert.value+1,n),this.forces.update(t,i,n),this.settlements.update(t,i,n),this.ribbons.update(this.app.renderer),this.labels.update(i)}settle(t,e){this.update(0,t,e)}stats(){return{...this.counts,trees:this.forest.total,treesDrawn:this.forest.drawn,treeRadius:Ki,streams:this.streamCount,trails:this.trails.filter(t=>t.w>.5).length,forces:this.forces.stats(),labels:this.labels.visible(),settlements:this.settlements.stats()}}dispose(){this.structures.geometry.dispose(),this.structMat.dispose(),this.forest.dispose(),this.ribbons.dispose(),this.forces.dispose(),this.settlements.dispose(),this.labels.dispose()}}const Yr=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},_c=new Float32Array(65536);for(let s=0;s<65536;s++)_c[s]=nr(s);class My{constructor(t){this.app=t,this.world=t.world,this.list=[],this.loaded=!1,this.cur=null,this.k=0,this.want=0,this.patchW=new Float32Array(64).fill(1),this.groupK=new Float32Array(jn),this.groupDepth=new Float32Array(jn),this.featK=new Float32Array(64),this.featSeen=new Float32Array(64),this.u=this.world.uniforms,this._frustum=new Ii,this._m=new se,this._box=new bn,this.lastSeen=0,this.log=[]}patchWeights(){const t=this.cur;return t!=null&&t.lower?[...t.raise,...t.lower].map((e,n)=>({id:e.id,kind:e.kind,depth:e.depth,until:e.until,k:+this.patchW[n].toFixed(3)})):[]}async load(){var n;const t=await Ix(this.app.data,this.app.warn),e=await((n=this.app.patches)==null?void 0:n.ready)||[];this.list=t,this.setPatches(e),this.loaded=!0}setPatches(t){const e=this.app.warn;for(const i of this.list)i.patches=kx(i,t,e);const n=new Set(this.world.islandPacks.map(i=>i.id));for(const i of t)!n.has(i.pack)&&!this.list.some(o=>o.id===i.pack)&&e(`patch ${i.id}: no pack or district ${i.pack} here; not drawn`);this.patchW.fill(1),this.cur&&this.drop()}districtAt(t,e,n=0){for(const i of this.list){const o=i.rect;if(t>o.x0-n&&t<o.x1+n&&e>o.z0-n&&e<o.z1+n)return i}return null}prefetch(t,e){const n=this.districtAt(t,e,20);return n&&(this.prefetchAt=performance.now(),this.stream(n)),n}readyAt(t,e){var i;const n=this.districtAt(t,e);return!!n&&((i=this.cur)==null?void 0:i.d)===n&&this.cur.state==="ready"}stream(t){var n;if(((n=this.cur)==null?void 0:n.d)===t)return;if(!this.world.terrains.get(t.parent)){this.pending=t;return}this.cur&&this.drop();const e={d:t,state:"loading",t0:performance.now()};this.cur=e,this.lastSeen=e.t0,this.decoder=this.decoder||new zx(this.app.warn),this.decoder.decode(t).then(i=>{this.cur===e&&this.arrive(e,i)}).catch(i=>{this.cur===e&&(this.app.warn(`district ${t.id}: ${i.message}`),e.state="failed")})}arrive(t,e){var l;const{d:n}=t;t.decodeMs=Math.round(performance.now()-t.t0),t.data=e,t.metres=e.metres,t.aux=e.aux,t.carve=e.carve;const i={id:n.id,name:n.name,rect:n.rect,W:n.W,H:n.H,rainUrl:n.rainUrl,data:{metres:e.metres,normals:e.normals,land:e.land,lo:e.lo,hi:e.hi}};t.pack=i;const o=this.world.terrains.get(n.parent);t.parUniforms={uParN:{value:(o==null?void 0:o.normalTex)??null},uParL:{value:(o==null?void 0:o.landTex)??null},uParS:{value:(o==null?void 0:o.shadow.texture)??null},uParRect:{value:o?o.rect:new ee(0,0,1,1)},uParSlot:{value:-1},uParRain:{value:(o==null?void 0:o.uniforms.uOwnRain.value)??1}};const a=new mc(i,this.world,[this.world.arch,o].filter(Boolean),{vertexShader:fx,fragmentShader:dx,shadowFragment:px,shadowSize:512,uniforms:{...t.parUniforms,uDistN:{value:null},uDistL:{value:null},uDistS:{value:null}}});for(const h of[a.full,a.half]){const u=h.material.uniforms;u.uDistN.value=a.normalTex,u.uDistL.value=a.landTex,u.uDistS.value=a.shadow.texture}if(a.group.visible=!1,a.applyRange(((l=this.app.qset)==null?void 0:l.range)??4.6),this.app.params.get("debug"))for(const h of[a.full,a.half])h.material.uniforms.uDebug.value=Number(this.app.params.get("debug"));t.terrain=a,t.parent=o,this.world.group.add(a.group),t.heightTex=a.heightTex;const r=new Ye(e.aux,n.W,n.H,Ee,de);r.minFilter=r.magFilter=ie,r.needsUpdate=!0;const c=new Ye(e.carve,n.W,n.H,Vu,Ri);if(c.minFilter=c.magFilter=ie,c.needsUpdate=!0,t.auxTex=r,t.carveTex=c,t.pmap=e.patchMap,t.pmap){const h=t.pmap,u=new Ye(h.data,h.w,h.h,Ee,de);u.minFilter=u.magFilter=ie,u.needsUpdate=!0,t.patchTex=u,t.patchBox=new ee(h.x0,h.y0,h.x0+h.w,h.y0+h.h)}t.lower=n.patches.filter(h=>h.kind==="lower"),t.raise=n.patches.filter(h=>h.kind==="raise"),t.uploads=[a.heightTex,r,c,a.normalTex,a.landTex,...t.patchTex?[t.patchTex]:[]],t.state="uploading",t.features=new xy(this.app,this,t),this.app.scene.add(t.features.group),e.normals=e.land=null,e.trees={counts:e.trees.counts},e.streams=null,this.patchW.fill(1),this.yearWeights(1)}drop(){var e,n,i;const t=this.cur;t&&(this.off(),t.terrain&&(this.world.group.remove(t.terrain.group),t.terrain.dispose()),(e=t.auxTex)==null||e.dispose(),(n=t.carveTex)==null||n.dispose(),(i=t.patchTex)==null||i.dispose(),t.features&&(this.app.scene.remove(t.features.group),t.features.dispose()),this.cur=null,this.k=0)}off(){var e;const t=this.u;t.uDistInfo.value.set(0,0,qe.margin,qe.band),t.uDistH.value=this.world.dummy,t.uDistAux.value=this.world.dummyAux,t.uDistCarve.value=this.world.dummy,t.uDistPatch.value=this.world.dummyAux,t.uDistPatchBox.value.set(0,0,0,0),(e=this.cur)!=null&&e.terrain&&(this.cur.terrain.group.visible=!1),this.on=!1}yearWeights(t){var a,r;const e=this.cur,n=this.app.timeline.year,i=this.patchW;if(e!=null&&e.lower){[...e.raise,...e.lower].forEach((g,x)=>{const p=n<g.until?1:0;let d=i[x]+(p-i[x])*t;Math.abs(d-p)<.002&&(d=p),i[x]=d});const l=e.raise.length,h=this.u.uDistRaise.value;let u=-1e9;for(let g=0;g<jn;g++)h[g].set(g<l?i[g]:0,g<l?e.raise[g].depth:0,0,0),g<l&&i[g]>0&&(u=Math.max(u,e.raise[g].depth));this.u.uDistRaiseTop.value=u;const f=this.u.uDistLower.value,m=((a=e.pmap)==null?void 0:a.groups)||[0];for(let g=0;g<jn;g++){let x=0,p=-1;const d=m[g]||0;e.lower.forEach((v,M)=>{d&1<<M&&i[l+M]>x&&(x=i[l+M],p=v.depth)}),x===0&&d&&(p=((r=e.lower.find((v,M)=>d&1<<M))==null?void 0:r.depth)??-1),this.groupK[g]=x,this.groupDepth[g]=p,f[g].set(x,p,0,0)}}const o=this.u.uFeatK.value;if(e)for(const[c,l]of e.d.byIndex){const h=Io(l.properties,n)?1:0;let u=this.featK[c]+(h-this.featK[c])*t;Math.abs(u-h)<.002&&(u=h),this.featK[c]=u;const f=n>=ir(l.properties)[0]?1:0;let m=this.featSeen[c]+(f-this.featSeen[c])*t;Math.abs(m-f)<.002&&(m=f),this.featSeen[c]=m,o[c>>2].setComponent(c&3,u)}}wantFor(t,e,n){var l,h;const i=t.rect,o=e.position,a=Math.max(i.x0-o.x,0,o.x-i.x1),r=Math.max(i.z0-o.z,0,o.z-i.z1),c=Math.hypot(a,r,Math.max(1,o.y));return this.dc=c,this._m.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this._box.min.set(i.x0,0,i.z0),this._box.max.set(i.x1,Math.max(1,(((h=(l=this.cur)==null?void 0:l.data)==null?void 0:h.hi)??1e3)*this.u.uVert.value),i.z1),this._frustum.intersectsBox(this._box)?Yr(qe.far,qe.near,c)*(1-Yr(qe.rig[0],qe.rig[1],n)):0}update(t,e,n){var g,x,p;if(!this.loaded||!this.list.length)return;if(this.pending&&this.world.terrains.get(this.pending.parent)){const d=this.pending;this.pending=null,this.stream(d)}const i=t.position;let o=null,a=1/0;for(const d of this.list){const v=d.rect,M=Math.hypot(Math.max(v.x0-i.x,0,i.x-v.x1),Math.max(v.z0-i.z,0,i.z-v.z1),Math.max(1,i.y));M<a&&(a=M,o=d)}o&&a<qe.prefetch&&((g=this.cur)==null?void 0:g.d)!==o&&this.stream(o);const r=this.cur,c=1-Math.exp(-n*2.5);if(this.yearWeights(n>0?1-Math.exp(-n*Pu):1),!r)return;if(r.state==="uploading"){const d=r.uploads.shift();d&&this.app.renderer.initTexture(d),r.uploads.length||(r.state="ready",r.readyMs=Math.round(performance.now()-r.t0))}const l=r.parent,h=l&&l.slot>=0?l.k:0,u=r.state==="ready"?Math.min(this.wantFor(r.d,t,e),h):0;this.want=u,this.forceK!==null&&this.forceK!==void 0&&r.state==="ready"&&h>0?this.k=Math.min(this.forceK,h):(this.k+=(u-this.k)*c,Math.abs(u-this.k)<.004&&(this.k=u),this.k=Math.min(this.k,h));const f=r.state==="ready"&&h>0&&(this.k>0||u>0);f?this.switchOn(r):this.on&&this.off(),(f||this.k>0)&&(this.lastSeen=performance.now());const m=Math.max(this.lastSeen,(this.prefetchAt??-1e9)+qe.hold*1e3);!f&&a>qe.prefetch*1.2&&performance.now()-m>qe.linger*1e3&&r.state!=="loading"&&this.drop(),this.cur&&((x=r.terrain)==null||x.update(t,this.on),(p=r.features)==null||p.update(n,this.on?this.k:0,e))}switchOn(t){const e=this.u,n=t.parent;e.uDistRect.value.copy(t.terrain.rect),e.uDistInfo.value.set(this.k,1,qe.margin,qe.band),e.uDistH.value=t.heightTex,e.uDistAux.value=t.auxTex,e.uDistCarve.value=t.carveTex,e.uDistPatch.value=t.patchTex||this.world.dummyAux,t.patchBox?e.uDistPatchBox.value.copy(t.patchBox):e.uDistPatchBox.value.set(0,0,0,0);const i=t.parUniforms;i.uParSlot.value=n.slot,i.uParN.value=n.normalTex,i.uParL.value=n.landTex,i.uParS.value=n.shadow.texture,this.on=!0}updateShadow(t,e,n,i){var o;this.on&&((o=this.cur)!=null&&o.terrain)&&this.cur.terrain.shadow.update(t,e,n,this.k,i)}settle(t,e){var a;this.yearWeights(1);const n=this.cur;if(!n||n.state!=="ready")return;const i=n.parent,o=i&&i.slot>=0?i.k:0;this.k=Math.min(this.wantFor(n.d,t,e),o),this.k>0?(this.switchOn(n),n.terrain.update(t,!0)):this.on&&this.off(),(a=n.features)==null||a.settle(this.k,e)}weightAt(t,e){if(!this.on)return 0;const n=this.cur.d.rect,i=Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e);return this.k*Yr(qe.band,qe.margin,i)}patchAt(t,e){const n=this.cur.pmap;if(!n||t<n.x0||e<n.y0||t>=n.x0+n.w||e>=n.y0+n.h)return null;const i=((e-n.y0)*n.w+(t-n.x0))*4;return n.data.subarray(i,i+4)}texel(t,e){const n=this.cur,i=n.d.W,o=e*i+t;let a=n.metres[o];const r=n.aux,c=this.patchAt(t,e);if(c&&c[1]+c[3]>0){const u=this.u.uDistRaise.value,f=u[c[2]&15],m=u[c[2]>>4];a+=(Math.max(a,f.y)-a)*(c[1]/255)*f.x,a+=(Math.max(a,m.y)-a)*(c[3]/255)*m.x}const l=r[o*4];if(l){const u=c?c[0]:0;a=Bc(a,l,this.groupK[u],_c[n.carve[o*2]],this.groupDepth[u])}const h=r[o*4+3];if(h>0){const u=this.featK[h];h<Vn.pond?a+=(Sf(a,_c[n.carve[o*2]],r[o*4+2])-a)*(r[o*4+1]/255)*u:h<Vn.other&&(a+=(mf-a)*(r[o*4+1]/255)*u)}return a}metresAt(t,e){const{d:n}=this.cur,i=n.rect;let o=(t-i.x0)/(i.x1-i.x0)*n.W-.5,a=(e-i.z0)/(i.z1-i.z0)*n.H-.5;o=Math.max(0,Math.min(n.W-1.001,o)),a=Math.max(0,Math.min(n.H-1.001,a));const r=o|0,c=a|0,l=o-r,h=a-c,u=this.texel(r,c)+(this.texel(r+1,c)-this.texel(r,c))*l,f=this.texel(r,c+1)+(this.texel(r+1,c+1)-this.texel(r,c+1))*l;return u+(f-u)*h}blend(t,e,n){const i=this.weightAt(t,e);return i>0?n+(this.metresAt(t,e)-n)*i:n}rawAt(t,e){const{d:n}=this.cur,i=n.rect,o=Math.max(0,Math.min(n.W-1,Math.floor((t-i.x0)/(i.x1-i.x0)*n.W))),a=Math.max(0,Math.min(n.H-1,Math.floor((e-i.z0)/(i.z1-i.z0)*n.H)));return this.cur.metres[a*n.W+o]}stats(){var o,a;const t=this.cur;if(!t)return{district:null,loaded:this.loaded,count:this.list.length};const e=t.d.W*t.d.H,n=e*4+e*4+e*4+2*(e*4*4/3)+512*512+(t.pmap?t.pmap.w*t.pmap.h*4:0),i=t.metres?e*4+e*4+e*4:0;return{district:t.d.id,state:t.state,k:+this.k.toFixed(3),want:+this.want.toFixed(3),on:!!this.on,patches:this.patchWeights(),patchMap:t.pmap?{box:[t.pmap.x0,t.pmap.y0,t.pmap.w,t.pmap.h],groups:t.pmap.groups.length-1}:null,decodeMs:t.decodeMs??null,readyMs:t.readyMs??null,workerMs:((o=t.data)==null?void 0:o.ms)??null,gpuMB:+(n/1048576).toFixed(1),cpuMB:+(i/1048576).toFixed(1),nodes:t.terrain?t.terrain.full.count+t.terrain.half.count:0,features:((a=t.features)==null?void 0:a.stats())??null}}}const _y=`
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,yy=`
${He}
${Do}
${ln}
${os}
${qs}
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
  if (depth < -${gf.toFixed(2)}) discard; // the land's (terrain.glsl.js SEA_EDGE)
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
`;function wy(s,t,e,n){const i=[0,0,0];for(let r=0;r<=n;r++){const c=s*Math.pow(t/s,r/n);for(let l=0;l<e;l++){const h=l/e*Math.PI*2;i.push(Math.cos(h)*c,0,Math.sin(h)*c)}}const o=[];for(let r=0;r<e;r++)o.push(0,1+(r+1)%e,1+r);for(let r=0;r<n;r++)for(let c=0;c<e;c++){const l=1+r*e+c,h=1+r*e+(c+1)%e,u=l+e,f=h+e;o.push(l,h,u,h,f,u)}const a=new cn;return a.setAttribute("position",new Ae(i,3)),a.setIndex(o),a}class by{constructor(t,e){this.uniforms={...t.uniforms,...e,uCamPos:{value:new B},uWind:{value:new Ht(-.8,.45)},uSwellDir:{value:new Ht(-.6,.8)},uDebug:{value:0}},this.material=new Te({vertexShader:_y,fragmentShader:yy,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new _e(wy(1,25e4,96,120),this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const Sy=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],Ey={ra:12.857,dec:27.13};function Ay(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}const li=Math.PI/180,fo=21*li,Ma=29.530588,Ty=224.1;function uu(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),o=Math.sin(s)*Math.cos(fo)-n*Math.cos(t)*Math.sin(fo),a=Math.sin(s)*Math.sin(fo)+n*Math.cos(t)*Math.cos(fo);return e.set(i,a,-o)}function Cy(s,t,e={}){const n=23.44*li*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*li,a=((s-80)/365.25*24%24+24)%24+t-12;e.sun=uu(n,(t-12)*15*li,e.sun||new B);const r=s+t/24,c=((r-Ty)%Ma+Ma)%Ma,l=c/Ma,h=i+l*2*Math.PI,u=Math.asin(Math.sin(23.44*li)*Math.sin(h)+Math.sin(5.1*li)*Math.sin(r*.23)),f=h/(2*Math.PI)*24;return e.moon=uu(u,(a-f)*15*li,e.moon||new B),e.phase=l,e.night=Math.min(29,Math.floor(c)),e.illum=.5-.5*Math.cos(l*2*Math.PI),e.lst=a,e.decl=n,e}const Yf=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],Kf=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],Ry=1.6110731556870734,Ly=1.5;function Py(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((Ry-Math.acos(s))/Ly)))}function Kr(s,t,e,n=[0,0,0]){const i=Py(t.y),o=.2*e.turbidity*1e-17,a=Math.acos(Math.max(0,s.y)),r=1/(Math.cos(a)+.15*Math.pow(93.885-a*180/Math.PI,-1.253)),c=8400*r,l=1250*r,h=s.x*t.x+s.y*t.y+s.z*t.z,u=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),f=e.mieDirectionalG,m=f*f,g=1/(4*Math.PI)*((1-m)/Math.pow(1-2*f*h+m,1.5)),x=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let p=0;p<3;p++){const d=Yf[p]*e.rayleigh,v=.434*o*Kf[p]*e.mieCoefficient,M=Math.exp(-(d*c+v*l)),S=(d*u+v*g)/(d+v);let b=Math.pow(i*S*(1-M),1.5);b*=1+(Math.pow(i*S*M,.5)-1)*x;const w=.1*M,E=(b+w)*.04+[0,3e-4,75e-5][p];n[p]=Math.pow(E,1/2.4)}return n}function Dy(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),o=.2*t.turbidity*1e-17;for(let a=0;a<3;a++){const r=Yf[a]*t.rayleigh,c=.434*o*Kf[a]*t.mieCoefficient;e[a]=Math.exp(-(r*8400*i+c*1250*i))}return e}const Iy=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,Zf=`
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
`,Uy=`
${Zf}
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
`,ky=`
${Zf}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,zy=`
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
`,Fy=`
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
`;class Ny{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=Ey,e=(l,h)=>{const u=l/24*2*Math.PI,f=h*li;return new B(Math.cos(f)*Math.cos(u),Math.cos(f)*Math.sin(u),Math.sin(f))};this.uniforms={uSun:{value:new B(0,1,0)},uMoon:{value:new B(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:fo},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new _e(new zc(1,5),new Te({vertexShader:Iy,fragmentShader:Uy,uniforms:this.uniforms,side:rn,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=Ay(4242),o=Sy.map(([l,h,u])=>[l/24*2*Math.PI,h*li,u]);for(let l=0;l<2600;l++){const h=i()*2-1;o.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const a=new Float32Array(o.length*3);o.forEach((l,h)=>a.set(l,h*3));const r=new cn;r.setAttribute("aStar",new Le(a,3)),r.setAttribute("position",new Le(new Float32Array(o.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new Hv(r,new Te({vertexShader:zy,fragmentShader:Fy,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:ic})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new We,this.group.add(n,this.stars),this.mapRT=new Zn(256,128,{type:Ri,depthBuffer:!1}),this.mapRT.texture.wrapS=Da,this.mapScene=new er;const c=new _e(Nc(),new Te({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:ky,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));c.frustumCulled=!1,this.mapScene.add(c),this.mapCam=new Qa(-1,1,1,-1,0,1),this.astro={},this._v=new B}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const o=Cy(t,e,this.astro),a=o.sun,r=this.uniforms;r.uSun.value.copy(a),r.uMoon.value.copy(o.moon),r.uPhase.value=o.phase,r.uIllum.value=o.illum,r.uLst.value=o.lst/24*2*Math.PI;const c=je.smoothstep(-a.y,-.02,.2);r.uNight.value=c,this.starUniforms.uNight.value=c,this.starUniforms.uTime.value=n;const l=this.params,h=this._v,u=Kr(h.set(0,1,0),a,l),f=[0,0,0];for(let w=0;w<8;w++){const E=w/8*Math.PI*2,A=Kr(h.set(Math.cos(E),.08,Math.sin(E)).normalize(),a,l);for(let _=0;_<3;_++)f[_]+=A[_]/8}const m=Kr(h.set(a.x,.05,a.z).normalize(),a,l),g=Dy(a,l),x=je.smoothstep(a.y,-.04,.06),p=3.2;i.sunColor.setRGB(g[0]*p*x,g[1]*p*x,g[2]*p*x);const d=[.0035,.005,.011],M=je.smoothstep(o.moon.y,-.02,.1)*o.illum*c;i.skyColor.setRGB(u[0]*.55+f[0]*.45+d[0]+.012*M,u[1]*.55+f[1]*.45+d[1]+.016*M,u[2]*.55+f[2]*.45+d[2]+.024*M);const S=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Gt(S,S,S),.35),i.zenith.setRGB(u[0],u[1],u[2]),i.horizon.setRGB(f[0]+d[0],f[1]+d[1],f[2]+d[2]),i.sunHorizon.setRGB(m[0],m[1],m[2]);const b=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,a.y)+i.skyColor.r)*b*1.1,(i.sunColor.g*Math.max(0,a.y)+i.skyColor.g)*b,(i.sunColor.b*Math.max(0,a.y)+i.skyColor.b)*b*.8),i.moonColor.setRGB(.05*M,.06*M,.085*M),i.moonDir.copy(o.moon),i.sunDir.copy(a),i.night=c,o}}const wo=Math.PI*2,Zr=.4,Oy=.18,fu=(s,t,e,n)=>e>0?s+(t-s)*(1-Math.exp(-e/n)):t,By=(s,t,e)=>(s+t+Math.sqrt((s-t)*(s-t)+e*e))/2,Wy=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,_a=s=>((s+Math.PI)%wo+wo)%wo-Math.PI,Gy=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Jf=4e4;function Xi(s){return .6+.52*Gy(Math.log(40),Math.log(4500),Math.log(Math.max(1,s)))}class Hy{constructor(t,e,n){this.camera=t,this.dom=e,this.world=n,this.minDistance=ld,this.maxDistance=jc,this._ray=new Vv,this._v=new B,this.home=this.homeView(),this.reach(this.home.distance);const i=this.home;this.state={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.goal={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.flight=null,this.floor=0,this.groundM=0,this.pinned=!0,this._lastXZ=new Ht(i.target.x,i.target.z),this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this.bind()}homeView(t={x0:16,y0:72,x1:innerWidth-16,y1:innerHeight-120}){const e=this.world.chainShape();return this.fit({points:e.hull,along:[e.from,e.to],yaw:0,box:t,reach:Jf})}reach(t){this.maxDistance=Math.max(jc,t*1.15)}bind(){const t=this.dom,e=new Map;let n=null,i=null,o=null;t.addEventListener("contextmenu",r=>r.preventDefault()),t.addEventListener("pointerdown",r=>{this.enabled&&(t.setPointerCapture(r.pointerId),e.set(r.pointerId,{x:r.clientX,y:r.clientY}),e.size===1?(n=r.button===2||r.shiftKey||r.ctrlKey||r.metaKey||r.altKey?"orbit":"pan",i={x:r.clientX,y:r.clientY}):e.size===2&&(n="pinch",o=this.pinchState(e)))}),t.addEventListener("pointermove",r=>{if(e.has(r.pointerId)){if(e.set(r.pointerId,{x:r.clientX,y:r.clientY}),n==="orbit"&&i){const c=r.clientX-i.x,l=r.clientY-i.y;this.goal.yaw-=c*.005,this.goal.pitch=je.clamp(this.goal.pitch+l*.004,.06,1.52),i={x:r.clientX,y:r.clientY},this.touch()}else if(n==="pan"&&i){const c=r.clientX-i.x,l=r.clientY-i.y;(c||l)&&(this.panBy(c,l),this.touch()),i={x:r.clientX,y:r.clientY}}else if(n==="pinch"&&e.size===2){const c=this.pinchState(e),l=o.dist/Math.max(20,c.dist);this.zoomAt(c.cx,c.cy,l),this.panBy(c.cx-o.cx,c.cy-o.cy),this.goal.yaw-=_a(c.angle-o.angle),o=c,this.touch()}}});const a=r=>{if(e.delete(r.pointerId),e.size===0)n=null;else if(e.size===1){const[c]=e.values();n="pan",i={...c}}};t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a),t.addEventListener("wheel",r=>{if(!this.enabled)return;r.preventDefault();const c=r.deltaMode===1?r.deltaY*30:r.deltaY,l=Math.exp(Math.sign(c)*Math.min(Math.abs(c),150)*.0022);this.zoomAt(r.clientX,r.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",r=>{const c=this.pickGround(r.clientX,r.clientY);if(c){const l=Math.max(this.minDistance,this.goal.distance*.35);this.flyTo({target:c,distance:l,pitch:this.goal.pitch+Xi(l)-Xi(this.goal.distance)},1.8)}}),addEventListener("keydown",r=>{var f,m;if(!this.enabled||(m=(f=r.target).closest)!=null&&m.call(f,"input, textarea"))return;const c=this.goal.distance*.08,l={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[r.code];if(l&&!r.altKey){const g=Math.sin(this.goal.yaw),x=Math.cos(this.goal.yaw);this.goal.target.x+=(l[0]*x+l[1]*g)*c,this.goal.target.z+=(-l[0]*g+l[1]*x)*c,this.touch()}r.code==="KeyQ"&&(this.goal.yaw+=.12),r.code==="KeyE"&&(this.goal.yaw-=.12);const h=innerWidth/2,u=innerHeight/2;(r.code==="Equal"||r.code==="NumpadAdd")&&this.zoomAt(h,u,.8),(r.code==="Minus"||r.code==="NumpadSubtract")&&this.zoomAt(h,u,1.25)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,o=Math.sin(this.goal.yaw),a=Math.cos(this.goal.yaw),r=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*a-e*o*r)*i,this.goal.target.z+=(t*o-e*a*r)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),o=this.goal.distance,a=je.clamp(o*n,this.minDistance,this.maxDistance);if(i){const r=1-a/o;this.goal.target.x+=(i.x-this.goal.target.x)*r,this.goal.target.z+=(i.z-this.goal.target.z)*r}this.goal.pitch=je.clamp(this.goal.pitch+Xi(a)-Xi(o),.06,1.52),this.goal.distance=a}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Ht((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e){const n=this.world,i=n.maxY+.05;if(e.y>=0&&t.y>i)return null;const o=e.y<0?t.y/-e.y:4e5;let a=t.y>i&&e.y<0?(t.y-i)/-e.y:0;const r=Math.min(o,4e5),c=this._v;let l=a;for(let h=0;h<700&&a<=r+.001;h++){c.copy(t).addScaledVector(e,a);const u=c.y-n.heightAt(c.x,c.z);if(u<0){let f=l,m=a;for(let g=0;g<24;g++){const x=(f+m)/2;c.copy(t).addScaledVector(e,x),c.y-n.heightAt(c.x,c.z)<0?m=x:f=x}return c.clone()}l=a,a+=Math.max(.02,u*.45,a*.0015)}return o<4e5?t.clone().addScaledVector(e,o).setY(0):null}fit({rect:t,points:e,along:n,distance:i,yaw:o=this.goal.yaw,tilt:a=0,pitch:r,box:c,pad:l=1.06,reach:h=this.maxDistance}){const u=this._fitCam||(this._fitCam=new yn),f=innerWidth,m=innerHeight;u.fov=this.camera.fov,u.aspect=f/Math.max(1,m),u.near=.1,u.far=1e6,u.updateProjectionMatrix();const g=c||{x0:0,y0:0,x1:f,y1:m},x=Math.max(60,g.x1-g.x0),p=Math.max(60,g.y1-g.y0),d=Math.tan(u.fov*Math.PI/360),v=e||[[t.x0,t.z0],[t.x1,t.z0],[t.x0,t.z1],[t.x1,t.z1]];let M=1/0,S=1/0,b=-1/0,w=-1/0;for(const[F,G]of v)M=Math.min(M,F),b=Math.max(b,F),S=Math.min(S,G),w=Math.max(w,G);let E=(M+b)/2,A=(S+w)/2;const _=i!==void 0;let y=_?i:Math.max(b-M,w-S)/(2*d)*(m/p),C=0;const P=Math.atan2(p,x),I=(F,G)=>Math.atan2(Math.sin(F)/Math.max(.35,Math.sin(G)),Math.cos(F));if(n){const[[F,G],[W,K]]=n;o=I(P,Xi(y)+a)-Math.atan2(K-G,W-F)}const R=this._v,U=(F,G,W)=>(R.set(F,G,W).project(u),[(R.x+1)/2*f,(1-R.y)/2*m]);for(let F=0,G=n?14:8;F<G;F++){y=je.clamp(y,this.minDistance,h),C=je.clamp(r??Xi(y)+a,.06,1.52);const W=Math.cos(C),K=Math.cos(o),H=Math.sin(o),et=_?this.world.heightAt(E,A):0;u.position.set(E+y*W*H,et+y*Math.sin(C),A+y*W*K),u.lookAt(E,et,A),u.updateMatrixWorld();let ct=1/0,Q=1/0,nt=-1/0,dt=-1/0;for(const[Lt,St]of v){const[Ft,X]=U(Lt,_?this.world.heightAt(Lt,St):et,St);ct=Math.min(ct,Ft),nt=Math.max(nt,Ft),Q=Math.min(Q,X),dt=Math.max(dt,X)}if(n){const[[Lt,St],[Ft,X]]=n,[ue,Tt]=U(Lt,et,St),[kt,Y]=U(Ft,et,X);o+=_a(I(P,C)-I(Math.atan2(Y-Tt,kt-ue),C))}_||(y*=je.clamp(Math.max((nt-ct)*l/x,(dt-Q)*l/p),.3,3));const Mt=2*y*d/m,bt=((ct+nt)/2-(g.x0+g.x1)/2)*Mt,Rt=((Q+dt)/2-(g.y0+g.y1)/2)*Mt/Math.max(.35,Math.sin(C));E+=bt*K+Rt*H,A+=-bt*H+Rt*K}return y=je.clamp(y,this.minDistance,h),{target:new B(E,this.world.heightAt(E,A),A),distance:y,yaw:n?_a(o):o,pitch:C}}groundAt(t,e){return Math.max(0,this.world.metresAt(t,e))}smoothGround(t,e,n){const i=Oy*n;let o=2*this.groundAt(t,e),a=2;for(let r=0;r<6;r++){const c=r/6*wo,l=c+wo/12;o+=this.groundAt(t+Math.cos(c)*i*.5,e+Math.sin(c)*i*.5),o+=this.groundAt(t+Math.cos(l)*i,e+Math.sin(l)*i),a+=2}return o/a}pin(){const t=this.goal.target;this.groundM=this.groundAt(t.x,t.z),this.pinned=!0,this._lastXZ.set(t.x,t.z);const e=this.groundM*this.world.uniforms.uVert.value;t.y=e,this.state.target.y=e}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift,groundM:this.groundM},o={target:t.target?t.target.clone():i.target.clone(),distance:je.clamp(t.distance??i.distance,this.minDistance,this.maxDistance),yaw:t.yaw??i.yaw,pitch:je.clamp(t.pitch??i.pitch,.06,1.52),lift:t.lift??0};o.yaw=i.yaw+_a(o.yaw-i.yaw);const a=Math.hypot(i.target.x-o.target.x,i.target.z-o.target.z),r=n.hop??Math.max(0,a*.9-Math.max(i.distance,o.distance)*.6);this.flight={from:i,dest:o,t:0,duration:e,hop:r,onDone:n.onDone,ready:n.ready,held:0}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,this.pin(),(e=t.onDone)==null||e.call(t),this.apply()}jump({x:t,z:e,distance:n,yaw:i,pitch:o}){this.flight=null;for(const a of[this.goal,this.state])t!==void 0&&a.target.set(t,this.world.heightAt(t,e),e),n!==void 0&&(a.distance=n),i!==void 0&&(a.yaw=i),o!==void 0&&(a.pitch=o),a.lift=0;this.pin(),this.apply()}update(t){var r;const e=this.goal;if(this.flight){const c=this.flight;let l=t/c.duration;c.ready&&c.t>.8&&c.held<6&&!c.ready()&&(c.held+=t,l*=.08),c.t=Math.min(1,c.t+l);const h=Wy(c.t);e.target.lerpVectors(c.from.target,c.dest.target,h);const u=Math.log(c.from.distance)*(1-h)+Math.log(c.dest.distance)*h;e.distance=Math.exp(u)+c.hop*Math.sin(Math.PI*h),e.yaw=c.from.yaw+(c.dest.yaw-c.from.yaw)*h,e.pitch=c.from.pitch+(c.dest.pitch-c.from.pitch)*h+.2*Math.sin(Math.PI*h)*Math.min(1,c.hop/300),e.pitch=Math.min(1.52,e.pitch),e.lift=c.from.lift+(c.dest.lift-c.from.lift)*h,this.groundM=c.from.groundM+(this.groundAt(c.dest.target.x,c.dest.target.z)-c.from.groundM)*h,c.t>=1&&(this.flight=null,this.pin(),(r=c.onDone)==null||r.call(c))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);const n=this.world.bounds,i=150+e.distance*.3;e.target.x=je.clamp(e.target.x,n.x0-i,n.x1+i),e.target.z=je.clamp(e.target.z,n.z0-i,n.z1+i),this.flight||(Math.abs(e.target.x-this._lastXZ.x)+Math.abs(e.target.z-this._lastXZ.y)>1e-7&&(this.pinned=!1),this._lastXZ.set(e.target.x,e.target.z),this.pinned||(this.groundM=fu(this.groundM,this.smoothGround(e.target.x,e.target.z,e.distance),t,Zr))),e.target.y=this.groundM*this.world.uniforms.uVert.value;const o=this.state,a=this.flight?1:1-Math.exp(-t*7);o.target.lerp(e.target,a),o.distance=Math.exp(Math.log(o.distance)+(Math.log(e.distance)-Math.log(o.distance))*a),o.yaw+=(e.yaw-o.yaw)*a,o.pitch+=(e.pitch-o.pitch)*a,o.lift+=(e.lift-o.lift)*a,this.apply(t)}groundAhead(t,e,n){const i=this.world;let o=i.heightAt(t,e);const a=this._prevXZ;if(a&&n>0){const r=(t-a.x)/n,c=(e-a.y)/n,l=Math.hypot(r,c),h=Math.min(20,l*.3);h>.005&&(o=Math.max(o,i.heightAt(t+r/l*h,e+c/l*h)))}return this._prevXZ=(this._prevXZ||new Ht).set(t,e),o}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const o=.12+e.distance*.03,a=this.groundAhead(n.position.x,n.position.z,t),r=Math.max(0,a+o-n.position.y);this.floor=fu(this.floor,r,t,r>this.floor?Zr/3:Zr*2),n.position.y+=this.floor;const c=this.world.heightAt(n.position.x,n.position.z),l=Math.min(.04,o*.3);n.position.y=By(n.position.y,c+l,l),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const h=n.position.y-c;n.near=je.clamp(Math.min(h,e.distance)*.12,.02,300),n.far=je.clamp(e.distance*30+h*60,8e3,3e5),n.updateProjectionMatrix(),n.updateMatrixWorld()}}const Vy=1.5,$y=`
${He}
${ln}
${os}
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
`,Xy=`
uniform vec3 uColor;
uniform float uOpacity;
in float vFade;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vFade);
}
`;function qy(s){return s?s.type==="Polygon"?s.coordinates:s.type==="MultiPolygon"?s.coordinates.flat():s.type==="LineString"?[s.coordinates]:s.type==="MultiLineString"?s.coordinates:[]:[]}function jy(s,t){var o;const e=new Map,n=new Set,i=a=>Math.round(a*1e6);for(const a of(s==null?void 0:s.features)||[]){const r=ba((o=a.properties)==null?void 0:o.island)||"other";let c=e.get(r);c||e.set(r,c=[]);for(const l of qy(a.geometry))for(let h=0;h+1<l.length;h++){const u=l[h],f=l[h+1],m=`${i(u[0])},${i(u[1])}`,g=`${i(f[0])},${i(f[1])}`;if(m===g)continue;const x=m<g?`${m}|${g}`:`${g}|${m}`;if(n.has(x))continue;n.add(x);const[p,d]=t.toWorld(u),[v,M]=t.toWorld(f),S=Math.max(1,Math.ceil(Math.hypot(v-p,M-d)/Vy));for(let b=0;b<S;b++){const w=b/S,E=(b+1)/S;c.push(p+(v-p)*w,d+(M-d)*w,p+(v-p)*E,d+(M-d)*E)}}}return e}class du{constructor(t,e,n,{color:i,width:o,order:a}){this.group=new We,this.uniforms={...n,uResolution:{value:new Ht(1,1)},uWidth:{value:o},uCamPos:{value:new B},uColor:{value:new Gt(...i)},uOpacity:{value:1}},this.material=new Te({vertexShader:$y,fragmentShader:Xy,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});const r=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);this.count=0;for(const[,c]of jy(t,e)){if(!c.length)continue;const l=new Po;l.setAttribute("position",new Le(r,3)),l.setIndex([0,2,1,1,2,3]);const h=new Float32Array(c);l.setAttribute("aSeg",new Ne(h,4)),l.instanceCount=h.length/4,this.count+=l.instanceCount;let u=1/0,f=-1/0,m=1/0,g=-1/0;for(let d=0;d<h.length;d+=2)u=Math.min(u,h[d]),f=Math.max(f,h[d]),m=Math.min(m,h[d+1]),g=Math.max(g,h[d+1]);const x=new B((u+f)/2,60,(m+g)/2);l.boundingSphere=new Di(x,Math.hypot(f-u,g-m,300)/2+10);const p=new _e(l,this.material);p.renderOrder=a,this.group.add(p)}}update(t,e,n){this.uniforms.uResolution.value.copy(e),this.uniforms.uCamPos.value.copy(t.position),this.uniforms.uOpacity.value=n,this.group.visible=n>.01&&this.count>0}}class Yy{constructor(t,e){this.group=new We,this.moku=new du(t.moku,t.proj,e,{color:[1.5,1.08,.52],width:2.2,order:3}),this.ahupuaa=new du(t.ahupuaa,t.proj,e,{color:[1.25,1.2,1.06],width:1.3,order:2}),this.group.add(this.ahupuaa.group,this.moku.group),this.visible=!0,this._res=new Ht}update(t,e,n,i=1){e.getDrawingBufferSize(this._res);const o=e.getPixelRatio(),a=this.visible?1:0,r=(c,l,h)=>{const u=Math.max(0,Math.min(1,(h-c)/(l-c)));return u*u*(3-2*u)};this.moku.uniforms.uWidth.value=(1.3+1.1*(1-r(800,4e3,n)))*o,this.ahupuaa.uniforms.uWidth.value=1.25*o,this.moku.uniforms.uColor.value.setRGB(1.5*i,1.08*i,.52*i),this.ahupuaa.uniforms.uColor.value.setRGB(1.25*i,1.2*i,1.06*i),this.moku.update(t,this._res,a*(.55+.4*(1-r(1500,6e3,n)))),this.ahupuaa.update(t,this._res,a*.75*(1-r(220,650,n)))}}const Ky=4,pu=[300,1e3],mu=[.4,.7],Zy=9,gu={voyage:[1.38,1.18,.86],fleet:[1.6,.9,.52],ship:[1,1.1,1.26],trade:[1.15,1.1,.96],schematic:[1.25,1.18,1.02]},vu={journal:{width:2,opacity:.92,pulse:1},narrative:{width:1.7,opacity:.82,pulse:.9},schematic:{width:1.4,opacity:.62,pulse:.45}},Jy={day:0,month:0,year:0,decade:5,generation:12,century:50},Jr=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Qy=`
${He}
${ln}
${os}
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
`,tw=`
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
`;function ew(s){const t=s.when||{},e=(a,r)=>{const c=String(a??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!c)return null;const l=Number(c[1]);return c[2]?l+(Number(c[2])-1+(r?1:0))/12:l+(r?1:0)};let n=e(t.from,!1),i=e(t.to??t.from,!0);if(n===null&&i===null)return null;n===null&&(n=i-1),i===null&&(i=n+1);const o=Jy[t.precision]??0;return o&&i-n<=1.01&&(n-=o,i+=o),[n,i]}async function nw(s,t=console.warn){const e=s!=null&&s.abs?s.abs("routes.json"):new URL("routes.json",new URL((s==null?void 0:s.base)||"./data/",location.href)).href;try{const n=await fetch(e);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json();return Array.isArray(i)?i:Array.isArray(i==null?void 0:i.routes)?i.routes:[]}catch(n){return t(`${e}: ${n.message} (no routes)`),[]}}class iw{constructor(t,e,n){this.route=t,this.span=ew(t);const i=vu[t.pointPrecision]?t.pointPrecision:"schematic";this.style=vu[i],this.ret=t.direction==="return";const o=i==="schematic",a=new Set(t.schematicSegments||[]),r=(t.points||[]).map(M=>e.toWorld(M)),c=[],l=[];let h=0;for(let M=0;M+1<r.length;M++){const[S,b]=r[M],[w,E]=r[M+1],A=Math.hypot(w-S,E-b),_=Math.max(1,Math.ceil(A/Ky)),y=o||a.has(M)?1:0;for(let C=0;C<_;C++){const P=C/_,I=(C+1)/_;c.push(S+(w-S)*P,b+(E-b)*P,S+(w-S)*I,b+(E-b)*I),l.push(h+A*P,h+A*I,y,0)}h+=A}this.total=h;const u=(M,S,b)=>{c.push(M[0],M[1],S[0],S[1]),l.push(b,b,0,1)};r.length>=2&&(u(r.at(-2),r.at(-1),h),this.ret&&u(r[1],r[0],0));const f=new Po;f.setAttribute("position",new Le(new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),3)),f.setIndex([0,2,1,1,2,3]);const m=new Float32Array(c);f.setAttribute("aSeg",new Ne(m,4)),f.setAttribute("aInfo",new Ne(new Float32Array(l),4)),f.instanceCount=m.length/4;let g=1/0,x=-1/0,p=1/0,d=-1/0;for(const[M,S]of r)g=Math.min(g,M),x=Math.max(x,M),p=Math.min(p,S),d=Math.max(d,S);f.boundingSphere=new Di(new B((g+x)/2,60,(p+d)/2),Math.hypot(x-g,d-p,300)/2+20),this.geometry=f;const v=gu[t.kind]||gu.schematic;this.colour=v,this.uniforms={...n,uResolution:{value:new Ht(1,1)},uWidth:{value:this.style.width},uHead:{value:9},uCamPos:{value:new B},uColor:{value:new Gt(...v)},uOpacity:{value:0},uDashLen:{value:30},uMarch:{value:0},uPulse:{value:-1e6},uPulseLen:{value:60},uPulseK:{value:this.style.pulse}},this.material=new Te({vertexShader:Qy,fragmentShader:tw,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),this.mesh=new _e(f,this.material),this.mesh.renderOrder=4,this.mesh.visible=!1,this.k=0,this.w=1,this.phase=sw(t.id||"")%1e3/1e3}dispose(){this.geometry.dispose(),this.material.dispose()}}function sw(s){let t=2166136261;for(let e=0;e<s.length;e++)t=Math.imul(t^s.charCodeAt(e),16777619);return t>>>0}class ow{constructor({routes:t=[],proj:e,uniforms:n,camera:i,renderer:o,eras:a=[]}){this.proj=e,this.shared=n,this.camera=i,this.renderer=o,this.eras=[...a].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),this.group=new We,this.group.name="routes",this.lines=[],this._res=new Ht,this._last=null,this.setRoutes(t)}setRoutes(t){for(const e of this.lines)this.group.remove(e.mesh),e.dispose();this.lines=[];for(const e of t||[]){if(!Array.isArray(e.points)||e.points.length<2)continue;const n=new iw(e,this.proj,this.shared);n.span&&(this.lines.push(n),this.group.add(n.mesh))}}windowAt(t){const e=this.eras;if(e.length<2)return[t-10,t+10];const n=o=>{if(o<=0)return e[0].year+o*(e[1].year-e[0].year);const a=e.length-1;if(o>=a)return e[a].year+(o-a)*(e[a].year-e[a-1].year);const r=Math.floor(o);return e[r].year+(o-r)*(e[r+1].year-e[r].year)};let i=0;if(t>=e.at(-1).year)i=e.length-1;else if(t>e[0].year){for(let o=0;o+1<e.length;o++)if(t<=e[o+1].year){i=o+(t-e[o].year)/Math.max(1e-6,e[o+1].year-e[o].year);break}}return[n(i-.5),n(i+.5)]}visibleRoutes(){return this.lines.filter(t=>t.k>.5&&t.mesh.visible).map(t=>t.route)}update(t,e,{window:n,light:i=1,fill:o=0,section:a=null,all:r=!1}={}){const c=performance.now()/1e3,l=this._last===null?1:Math.max(0,Math.min(.1,c-this._last));this._last=c,this.apply(t,e,{win:n,light:i,fill:o,section:a,all:r},c,1-Math.exp(-l*4))}settle(t,e,{window:n,light:i=1,fill:o=0,section:a=null,all:r=!1}={}){this.apply(t,e,{win:n,light:i,fill:o,section:a,all:r},performance.now()/1e3,1)}apply(t,e,{win:n,light:i,fill:o,section:a,all:r},c,l){var p,d;const[h,u]=n||this.windowAt(t);this.renderer.getDrawingBufferSize(this._res);const f=this.renderer.getPixelRatio(),m=Jr(pu[0],pu[1],e),g=1-Jr(mu[0],mu[1],o),x=1-Jr(800,4e3,e);for(const v of this.lines){const[M,S]=v.span,b=!!a&&(((p=a.routes)==null?void 0:p.has(v.route.id))||((d=a.events)==null?void 0:d.has(v.route.event))),w=b||r&&S>=h&&M<=u?1:0;v.k+=(w-v.k)*l,Math.abs(w-v.k)<.003&&(v.k=w);const E=b&&!r?a.k??1:1;v.w+=(E-v.w)*l,Math.abs(E-v.w)<.003&&(v.w=E);const A=t>=M&&t<=S?1:.55,_=b&&!!a.focus,y=v.style.opacity*v.k*v.w*m*(_?1:g)*A;if(v.mesh.visible=y>.01,!v.mesh.visible)continue;const C=v.uniforms;C.uResolution.value.copy(this._res),C.uCamPos.value.copy(this.camera.position),C.uWidth.value=(v.style.width+.6*x)*f,C.uHead.value=(8+3*x)*f,C.uOpacity.value=y,C.uColor.value.setRGB(v.colour[0]*i,v.colour[1]*i,v.colour[2]*i),C.uPulseK.value=v.style.pulse*v.w,C.uDashLen.value=e*.016,C.uPulseLen.value=Math.min(v.total*.12,e*.035);const P=(c/Zy+v.phase)%1;C.uPulse.value=v.ret?(P<.5?P*2:2-P*2)*v.total:P*v.total,C.uMarch.value=v.ret?0:c*e*.012%(e*.016)}}dispose(){for(const t of this.lines)t.dispose();this.lines=[],this.group.clear()}}const ya=s=>String(s||"").normalize("NFD").replace(/[̀-ͯʻʼ'‘’]/g,"").toLowerCase();function Qf(s,t,e,n,i,o){const a=t/(n.x1-n.x0),r=e/(n.z1-n.z0),c=[];let l=1/0,h=-1/0;for(const x of i)for(let p=0;p+1<x.length;p++){const d=(x[p][0]-n.x0)*a,v=(x[p][1]-n.z0)*r,M=(x[p+1][0]-n.x0)*a,S=(x[p+1][1]-n.z0)*r;v!==S&&(c.push(v<S?[v,d,S,M]:[S,M,v,d]),l=Math.min(l,v,S),h=Math.max(h,v,S))}if(!c.length)return;c.sort((x,p)=>x[0]-p[0]);const u=[],f=Math.max(0,Math.floor(l)),m=Math.min(e-1,Math.ceil(h));let g=0;for(let x=f;x<=m;x++){const p=x+.5;for(u.length=0;g<c.length&&c[g][2]<=p&&c[g][0]<=p;)g++;for(let v=g;v<c.length;v++){const M=c[v];if(M[0]>p)break;M[2]<=p||u.push(M[1]+(p-M[0])/(M[2]-M[0])*(M[3]-M[1]))}u.sort((v,M)=>v-M);const d=x*t;for(let v=0;v+1<u.length;v+=2){const M=Math.max(0,Math.ceil(u[v]-.5)),S=Math.min(t-1,Math.floor(u[v+1]-.5));for(let b=M;b<=S;b++)s[d+b]=o}}}class aw{constructor(t,e,n,i=console.warn){var u,f;this.data=t,this.rect=e,this.uniforms=n,this.polities=new Map((t.polities.polities||[]).map(m=>[m.id,m]));const o=(((u=t.moku)==null?void 0:u.features)||[]).slice(0,255);(((f=t.moku)==null?void 0:f.features)||[]).length>255&&i("more than 255 moku: the overlay shows the first 255");const a=e.x1-e.x0,r=e.z1-e.z0,c=Math.min(4096,Math.ceil(Math.max(a,r)/1.5));this.W=Math.round(a>=r?c:c*a/r),this.H=Math.round(a>=r?c*r/a:c),this.grid=new Uint8Array(this.W*this.H),this.mokus=[null],o.forEach((m,g)=>{const x=m.properties||{},p=x.name??x.moku??"",d=x.islandId||ba(x.island),v=m.geometry,M=(v==null?void 0:v.type)==="Polygon"?[v.coordinates]:(v==null?void 0:v.type)==="MultiPolygon"?v.coordinates:[];for(const S of M)Qf(this.grid,this.W,this.H,e,S.map(b=>b.map(w=>t.proj.toWorld(w))),g+1);this.mokus.push({index:g+1,name:p,island:x.island,islandKey:d,key:x.mokuKey||`${d}:${p}`,props:x})}),this.loose=new Map(this.mokus.slice(1).map(m=>[`${m.islandKey}:${ya(m.name)}`,m])),this.checkKeys(i);const l=new Ye(this.grid,this.W,this.H,Li,de);l.minFilter=ie,l.magFilter=ie,l.unpackAlignment=1,l.needsUpdate=!0,this.idTex=l,this.palette=new Uint8Array(256*2*4);const h=new Ye(this.palette,256,2,Ee,de);h.minFilter=ie,h.magFilter=ie,h.needsUpdate=!0,this.palTex=h,n.uMokuId.value=l,n.uMokuRect.value.set(e.x0,e.z0,e.x1,e.z1),n.uPalette.value=h,this.eraKeys=[null,null]}checkKeys(t){const e=new Set(this.mokus.slice(1).map(i=>i.key)),n=new Set;for(const[i,o]of Object.entries(this.data.polities.byEra||{}))for(const a of Object.keys(o)){if(e.has(a))continue;const[r,...c]=a.split(":"),l=this.loose.get(`${ba(r)}:${ya(c.join(":"))}`);n.add(l?`${a} (${i}; the boundary file spells it "${l.name}")`:`${a} (${i})`)}n.size&&t(`polities.json names moku the boundary file doesn't have: ${[...n].slice(0,12).join(", ")}${n.size>12?", …":""}`)}holder(t,e){var o;const n=t?(o=this.data.polities.byEra)==null?void 0:o[t.id]:null;if(!n)return null;let i=n[e.key];if(i===void 0)for(const[a,r]of Object.entries(n)){const[c,...l]=a.split(":");if(ba(c)===e.islandKey&&ya(l.join(":"))===ya(e.name)){i=r;break}}return i?this.polities.get(i)||{id:i,name:i,colour:"#cccccc"}:null}setEras(t,e,n){const i=(t==null?void 0:t.id)??null,o=(e==null?void 0:e.id)??null;if(i!==this.eraKeys[0]||o!==this.eraKeys[1]){this.eraKeys=[i,o];const r=new Gt;this.palette.fill(0);for(const[c,l]of[[0,t],[1,e]])for(const h of this.mokus.slice(1)){const u=this.holder(l,h);if(!u)continue;r.set(u.colour||"#cccccc");const f=(c*256+h.index)*4;this.palette[f]=Math.round(r.r*255),this.palette[f+1]=Math.round(r.g*255),this.palette[f+2]=Math.round(r.b*255),this.palette[f+3]=255}this.palTex.needsUpdate=!0}const a=Math.max(0,Math.min(1,(n-.35)/.3));this.uniforms.uEraMix.value=t===e?0:a*a*(3-2*a)}mokuAt(t,e){const n=this.rect,i=Math.floor((t-n.x0)/(n.x1-n.x0)*this.W),o=Math.floor((e-n.z0)/(n.z1-n.z0)*this.H);return i<0||o<0||i>=this.W||o>=this.H?null:this.mokus[this.grid[o*this.W+i]]||null}politiesIn(t){const e=new Map;for(const n of this.mokus.slice(1)){const i=this.holder(t,n);i&&e.set(i.id,i)}return[...e.values()]}}const Ca=1848,Co=[{id:"crown",name:"Crown",colour:"#f0b43c"},{id:"government",name:"Government",colour:"#5e9fd6"},{id:"konohiki",name:"Konohiki",colour:"#c7364f"},{id:"mixed",name:"Mixed",colour:"#a77fcf"},{id:"unknown",name:"Unknown",colour:"#b5b0a5",alpha:.85}],xu=new Map(Co.map((s,t)=>[s.id,t+1]));class rw{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.available=null,this.units=[],this.sources=null,this.built=!1,this.listeners=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){return this.loading?this.loading:(this.loading=(async()=>{var a;const t=this.data.abs("mahele.json");let e;try{const r=(a=this.data.ahupuaa)==null?void 0:a.features;if(!(r!=null&&r.length))throw new Error("no ahupuaʻa boundaries to lay it on");const c=await fetch(t);if(!c.ok)throw new Error(`HTTP ${c.status}`);if(e=await c.json(),!Array.isArray(e==null?void 0:e.ahupuaa))throw new Error("no ahupuaʻa in it")}catch(r){this.available=!1,this.warn(`${t}: ${r.message} (no Māhele view)`),this.notify();return}this.file=e,this.sources=new Set(e.sources||[]);const n=new Map(e.ahupuaa.map(r=>[r.gisId,r])),i=this.data.proj;let o=0;for(const r of this.data.ahupuaa.features){const c=r.properties||{},l=r.geometry,h=(l==null?void 0:l.type)==="Polygon"?[l.coordinates]:(l==null?void 0:l.type)==="MultiPolygon"?l.coordinates:[],u=n.get(c.gisId);u||o++;const f=xu.has(u==null?void 0:u.class)?u.class:"unknown",m=h.map(x=>x.map(p=>p.map(d=>i.toWorld(d)))),g=[1/0,1/0,-1/0,-1/0];for(const x of m)for(const p of x)for(const[d,v]of p)g[0]=Math.min(g[0],d),g[1]=Math.min(g[1],v),g[2]=Math.max(g[2],d),g[3]=Math.max(g[3],v);this.units.push({gisId:c.gisId,name:(u==null?void 0:u.name)??c.name??c.ahupuaa,island:c.island||"",islandId:c.islandId||(u==null?void 0:u.islandId)||"",moku:c.moku||"",cls:f,entry:u||null,rings:m,box:g})}o&&this.warn(`mahele.json has no entry for ${o} of the ahupuaʻa (drawn as unknown)`),this.available=!0,this.notify()})(),this.loading)}build(){if(this.built||!this.available)return this.built;const t=this.app.polity.rect,e=this.app.polity.W,n=this.app.polity.H,i=new Uint8Array(e*n);for(const l of this.units)for(const h of l.rings)Qf(i,e,n,t,h,xu.get(l.cls));const o=new Ye(i,e,n,Li,de);o.minFilter=ie,o.magFilter=ie,o.unpackAlignment=1,o.needsUpdate=!0,o.onUpdate=()=>{o.image.data=null,o.onUpdate=null};const a=new Uint8Array(256*2*4),r=new Gt;Co.forEach((l,h)=>{r.set(l.colour);for(const u of[0,1]){const f=(u*256+h+1)*4;a[f]=Math.round(r.r*255),a[f+1]=Math.round(r.g*255),a[f+2]=Math.round(r.b*255),a[f+3]=Math.round((l.alpha??1)*255)}});const c=new Ye(a,256,2,Ee,de);return c.minFilter=ie,c.magFilter=ie,c.needsUpdate=!0,this.idTex=o,this.palTex=c,this.rect=t,this.built=!0,!0}availableAt(t=this.app.timeline.year){return this.available!==!1&&t>=Ca}unitAt(t,e){for(const n of this.units){const i=n.box;if(!(t<i[0]||e<i[1]||t>i[2]||e>i[3])){for(const o of n.rings)if(cw(o,t,e))return n}}return null}counts(t=null){const e=Object.fromEntries(Co.map(i=>[i.id,0]));let n=0;for(const i of this.units)t&&i.islandId!==t||(e[i.cls]++,n++);return{byClass:e,all:n}}}function cw(s,t,e){let n=!1;for(const i of s)for(let o=0,a=i.length-1;o<i.length;a=o++){const[r,c]=i[o],[l,h]=i[a];c>e!=h>e&&t<(l-r)*(e-c)/(h-c)+r&&(n=!n)}return n}function qa(s,t=!1){if(s==null)return null;if(typeof s=="number")return s+(t?1:0);const e=String(s).match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!e)return null;const n=Number(e[1]);if(e[2]){const i=Number(e[2])-1+(t?1:0);return n+i/12}return n+(t?1:0)}const lw={day:0,month:0,year:0,decade:5,generation:12,century:50};function yc(s){const t=s.when||{};let e=qa(t.from),n=qa(t.to??t.from,!0);if(e===null&&n===null)return null;e===null&&(e=n-1),n===null&&(n=e+1);const i=lw[t.precision]??0;return i&&n-e<=1.01&&(e-=i,n+=i),[e,n]}function ja(s){const t=s.when||{};return qa(t.from)??qa(t.to)}const td=["generation","century","decade"];function ed(s){var e;const t=ja(s);return t===null?"":bo(Math.floor(t),td.includes((e=s.when)==null?void 0:e.precision)?10:1)}function hw(s){const t=s.when||{},e=i=>{const o=String(i??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!o)return String(i??"");const a=["January","February","March","April","May","June","July","August","September","October","November","December"],r=Number(o[1]),c=r<0?`${-r} BCE`:String(r);return o[3]?`${Number(o[3])} ${a[Number(o[2])-1]} ${c}`:o[2]?`${a[Number(o[2])-1]} ${c}`:c},n=td.includes(t.precision)?"c. ":"";return!t.to||t.to===t.from?`${n}${e(t.from)}`:`${n}${e(t.from)} – ${e(t.to)}`}class uw{constructor(t){this.eras=[...t].filter(e=>Number.isFinite(e.year)).sort((e,n)=>e.year-n.year),this.s=0,this.listeners=[]}get n(){return this.eras.length}get max(){return Math.max(0,this.n-1)}yearAt(t){const e=this.eras;if(!e.length)return 1800;if(e.length===1)return e[0].year+t*50;if(t<=0)return e[0].year+t*(e[1].year-e[0].year);if(t>=e.length-1)return e[e.length-1].year+(t-e.length+1)*(e[e.length-1].year-e[e.length-2].year);const n=Math.floor(t);return e[n].year+(t-n)*(e[n+1].year-e[n].year)}sAtYear(t){const e=this.eras;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}get year(){return this.yearAt(this.s)}get era(){return this.eras[Math.round(Math.max(0,Math.min(this.max,this.s)))]||null}get pair(){const t=Math.max(0,Math.min(this.max,this.s)),e=Math.floor(t),n=Math.min(this.max,e+1);return{a:this.eras[e],b:this.eras[n],t:t-e}}get window(){return[this.yearAt(this.s-.5),this.yearAt(this.s+.5)]}set(t){const e=Math.max(0,Math.min(this.max,t));if(e!==this.s){this.s=e;for(const n of this.listeners)n(this)}}setYear(t){this.set(this.sAtYear(t))}onChange(t){this.listeners.push(t)}}function bo(s,t=1){const e=Math.round(s),n=e<0?`${-e} BCE`:String(e);return t>=10?`c. ${n}`:n}const Mu=[95,135],_u=6e3,fw=30,dw=1.5,yu=[4,40],pw=2,wu=ce,Ra=(s,t,e)=>Math.hypot(Math.max(s.x0-t,0,t-s.x1),Math.max(s.z0-e,0,e-s.z1));class mw{constructor(t){this.app=t,this.group=new We,this.group.name="towns",this.group.visible=!1,t.scene.add(this.group),this.islands=new Map,this.yearNow=t.timeline.year,this.version=0,this.hidden=!1,this.show=0,this.yieldU={uYieldRect:{value:new ee(0,0,-1,-1)},uYield:{value:0}},this.manifest=null,t.updaters.push(e=>this.update(e))}layers(){return this.manifest??(this.manifest=fetch(this.app.data.abs("layers/manifest.json")).then(t=>{if(!t.ok)throw new Error(`layers/manifest.json: HTTP ${t.status}`);return t.json()})),this.manifest}updateYield(){var i,o;const t=this.app.districts,e=t==null?void 0:t.cur,n=this.yieldU;if(t!=null&&t.on&&((o=(i=e==null?void 0:e.features)==null?void 0:i.settlements)!=null&&o.ready)){const a=e.d.rect;n.uYieldRect.value.set(a.x0+Ji,a.z0+Ji,a.x1-Ji,a.z1-Ji),n.uYield.value=t.k}else n.uYieldRect.value.set(0,0,-1,-1),n.uYield.value=0}update(t,e=$t((this.app.frameAvg??16)*.25,yu[0],yu[1])){const n=this.app,i=n.timeline.year;t>0?(this.yearNow+=(i-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(i-this.yearNow)<.05&&(this.yearNow=i)):this.yearNow=i;const o=n.rig.state.distance;let a=1-wu(Mu[0],Mu[1],o);(this.hidden||!n.islandsLoaded)&&(a=0),this.show=a,this.group.visible=a>.001,this.updateYield();const r=performance.now();if(this.group.visible){const c=n.rig.state.target,l=qf(o);this.R=l;const h=performance.now();for(const u of n.world.islands){let f=this.islands.get(u.pack.id);const m=u.slot>=0?u.k:0;if(m<=.02||Ra(u.pack.rect,c.x,c.z)>l){f&&f.hide();continue}f||(f=new ks(this,u),this.islands.set(u.pack.id,f)),f.lastSeen=r,f.update(c,l,a*wu(.6,.95,m),Math.max(.5,e-(performance.now()-h)))}}else for(const c of this.islands.values())c.hide();for(const[c,l]of this.islands)this.hidden?l.lastSeen=Math.max(l.lastSeen,r):r-l.lastSeen>fw*1e3&&(l.dispose(),this.islands.delete(c))}settle(){this.update(0,1/0)}get idle(){if(!this.group.visible)return!0;for(const t of this.islands.values())if(t.active&&!t.idle)return!1;return!0}stampInto(t,e,n){for(const i of this.islands.values())i.stampInto(t,e,n)}alive(t=this.yearNow,e=null,n=null,i=1/0){const o=[];for(const a of this.islands.values())o.push(...a.alive(t,e,n,i));return o}census(t=this.yearNow,e=null,n=null,i=1/0){return jf(this.alive(t,e,n,i))}stats(){return{show:+this.show.toFixed(2),year:+this.yearNow.toFixed(1),yield:+this.yieldU.uYield.value.toFixed(2),islands:[...this.islands.values()].map(t=>t.stats()),drawn:[...this.islands.values()].reduce((t,e)=>t+e.drawn,0)}}}class ks extends Hf{constructor(t,e){super(t.app),this.towns=t,this.t=e,this.id=e.pack.id,this.group=new We,this.group.name=`towns ${this.id}`,this.group.visible=!1,t.group.add(this.group),this.tiles=new Map,this.ready=!1,this.failed=null,this.active=!1,this.drawn=0,this.pending=0,this.lastSeen=performance.now(),this.times={build:0,tiles:0},this.load().catch(n=>{this.failed=n.message,this.app.warn(`towns ${this.id}: ${n.message} (its settlements are not drawn)`)})}async load(){var d,v,M,S,b,w,E;const t=performance.now(),e=this.app,n=await this.towns.layers(),i=(d=n.islands)==null?void 0:d[this.id];if(!i)throw new Error("no settlement layer");this.setLayers(n);const o=this.layerFiles(i);if(this.keyframes.length<2||o.some(A=>!A.settlement))throw new Error("the settlement layer lacks a keyframe");const a=A=>To(Kn,e.data.abs(`layers/${A}`)),[r,c,l,h]=await Promise.all([Promise.all(o.map(A=>a(A.settlement))),o.every(A=>A.value)?Promise.all(o.map(A=>a(A.value))).catch(()=>null):null,Gf(e,n,this.id),((v=e.patches)==null?void 0:v.ready)??[]]);if(this.disposed)return;const u=this.t,{W:f,H:m}=u;for(const A of[...r,...c||[]])if(A.W!==f||A.H!==m)throw new Error(`a layer is ${A.W}×${A.H}, the pack ${f}×${m}`);const g=u.pack.rect;this.rect=g,this.islandRect=g,this.crop={x0:g.x0,z0:g.z0,sx:(g.x1-g.x0)/f,sz:(g.z1-g.z0)/m,w:f,h:m},this.bytes=r.map(A=>A.px),this.values=c?c.map(A=>A.px):null,this.zoning={...l,rect:g},this.places=$f(e,n),this.townTerm(n,this.id,"district"),this.needPatches=(h||[]).some(A=>A.pack===this.id),this.features=[];for(const A of((M=e.districts)==null?void 0:M.list)||[])if(A.parent===this.id)for(const[,_]of A.byIndex){const y=(((b=(S=_.geometry)==null?void 0:S.coordinates)==null?void 0:b[0])||[]).map(I=>e.data.proj.toWorld(I));if(y.length<3)continue;const C=y.map(I=>I[0]),P=y.map(I=>I[1]);this.features.push({ring:y,p:_.properties||{},box:[Math.min(...C),Math.min(...P),Math.max(...C),Math.max(...P)]})}if(await new Promise(A=>setTimeout(A,0)),this.disposed||(this.grounds(),await new Promise(A=>setTimeout(A,0)),this.disposed))return;const x=new Set;for(const A of((E=(w=e.patches)==null?void 0:w.byPack)==null?void 0:E.get(this.id))||[])x.add(A.until);for(const A of h||[])A.pack===this.id&&x.add(A.until);for(const A of this.features){const[_,y]=ir(A.p);Number.isFinite(_)&&x.add(_),Number.isFinite(y)&&x.add(y+1)}this.years(x);const p=e.timeline.yearAt(0);this.epochYear=[p,...this.edges],this.kits=Of(Xa(1820),$c),this.meshes(),this.salt=1+e.world.islandPacks.findIndex(A=>A.id===this.id),this.loadMs=Math.round(performance.now()-t),this.ready=!0}grounds(){const t=this.t,{W:e,H:n}=t,i=this.rect,o=(i.x1-i.x0)*100/e,a=(i.z1-i.z0)*100/n;this.mx=o,this.mz=a;const r=t.heights,c=hn(e,n,p=>r[p]<=0,o,a);this.sea=c,this.broad=zn(Float32Array.from(c,p=>Math.min(p,3e3)),e,n,Math.max(1,Math.round(290/o)),3);const l=zu(r,e,n,o,a),h=new Uint8Array(e*n);for(let p=0;p<e*n;p++)h[p]=l[p]>=pw&&r[p]>0?1:0;this.streamOn=h,this.toStream=hn(e,n,p=>h[p]===1,o,a);const u=Math.ceil((i.x1-i.x0)/Wt),f=Math.ceil((i.z1-i.z0)/Wt);this.tw=u,this.th=f;const m=new Float32Array(u*f),g=this.zoning;for(let p=0;p<n;p++){const d=Math.min(f-1,Math.floor((p+.5)*this.crop.sz/Wt));for(let v=0;v<e;v++){const M=p*e+v;if(r[M]<=0)continue;const S=Math.min(u-1,Math.floor((v+.5)*this.crop.sx/Wt));let b=0;for(const E of this.bytes)b=Math.max(b,E[M]);if(g.zoning){const E=i.x0+(v+.5)*this.crop.sx,A=i.z0+(p+.5)*this.crop.sz;Va[yo(g.zoning,i,E,A)]&&(b=255)}const w=d*u+S;b>m[w]&&(m[w]=b)}}const x=m.slice();for(let p=0;p<f;p++)for(let d=0;d<u;d++)for(let v=-1;v<=1;v++)for(let M=-1;M<=1;M++){const S=d+M,b=p+v;S>=0&&b>=0&&S<u&&b<f&&(x[p*u+d]=Math.max(x[p*u+d],m[b*u+S]-20))}this.most=x,this.ths=new Map}grid(t,e,n){const i=this.crop,o=$t(Math.floor((e-i.x0)/i.sx),0,i.w-1),a=$t(Math.floor((n-i.z0)/i.sz),0,i.h-1);return t[a*i.w+o]}mauka(t,e){const n=e*this.tw+t;let i=this.ths.get(n);if(i!==void 0)return i;const o=this.rect.x0+(t+.5)*Wt,a=this.rect.z0+(e+.5)*Wt,r=this.crop,c=this.broad,l=(p,d)=>c[$t(d,0,r.h-1)*r.w+$t(p,0,r.w-1)],h=Math.round((o-r.x0)/r.sx-.5),u=Math.round((a-r.z0)/r.sz-.5),f=Math.max(2,Math.round(240/this.mx)),m=l(h+f,u)-l(h-f,u),g=l(h,u+f)-l(h,u-f),x=Math.PI/60;return i=Math.hypot(m,g)<.001?Math.PI/2:Math.round(Math.atan2(g,m)/x)*x,this.ths.set(n,i),i}owns(t,e){const n=o=>Math.min(t-o.x0,o.x1-t,e-o.z0,o.z1-e),i=n(this.rect);for(const o of this.app.world.islandPacks)if(o.id!==this.id&&n(o.rect)>i)return!1;return i>0}weight(t,e){const n=this.t,i=this.crop.sx,o=this.crop.sz,a=Math.hypot((n.metresAt(t+i,e)-n.metresAt(t-i,e))/(2*this.mx),(n.metresAt(t,e+o)-n.metresAt(t,e-o))/(2*this.mz));return(.55+.8*Math.max(Math.exp(-this.grid(this.sea,t,e)/700),Math.exp(-this.grid(this.toStream,t,e)/160)))*(1-.6*ce(.08,.35,a))}allows(t,e,n){const{x:i,z:o,ax:a,az:r,a:c}=t,l=this.epochYear[n],h=this.t,u=Math.cos(c),f=-Math.sin(c),m=[u,f],g=[-f,u];let x=1/0,p=-1/0,d=-1/0;this.dep=!1;const v=this.patchBoxes,M=this.featBox,S=this.patchBox;for(let b=0;b<13;b++){const w=b===0?0:b<5?[-1,1,1,-1][b-1]:b<9?[0,1,0,-1][b-5]:[-1,1,1,-1][b-9],E=b===0?0:b<5?[-1,-1,1,1][b-1]:b<9?[-1,0,1,0][b-5]:[-1,-1,1,1][b-9],A=b>=9?1.25:1,_=i+(m[0]*w*a+g[0]*E*r)*A,y=o+(m[1]*w*a+g[1]*E*r)*A;if(_>=M[0]&&y>=M[1]&&_<=M[2]&&y<=M[3])for(const I of this.features){const R=I.box;if(!(_<R[0]||y<R[1]||_>R[2]||y>R[3])&&cy(I.ring,_,y)&&(this.dep=!0,Io(I.p,l)))return null}if(b>=9)continue;if(this.grid(this.streamOn,_,y))return null;const C=h.metresAt(_,y);let P=C;if(_>=S[0]&&y>=S[1]&&_<=S[2]&&y<=S[3])for(const I of v){const R=I.box;if(!(_<R[0]||y<R[1]||_>R[2]||y>R[3])&&!(this.app.patches.maskAt(I.crop,(_-R[0])/(R[2]-R[0]),(y-R[1])/(R[3]-R[1]))<=0)){this.dep=!0,P=Vf(this.app,h,_,y,l);break}}if(P<.6)return null;x=Math.min(x,C),p=Math.max(p,C),d=Math.max(d,P)}return p-x>e?null:d}buildTile(t,e){var E;const n=performance.now(),i=this.rect,o=i.x0+t*Wt,a=i.z0+e*Wt,r={ti:t,tj:e,n:0,x0:o,z0:a},c=`${t},${e}`;if(this.tiles.set(c,r),this.most[e*this.tw+t]<1)return r.empty=!0,r;const l=this.mauka(t,e),h=(A,_)=>A<0||_<0||A>=this.tw||_>=this.th?NaN:this.mauka(A,_),u=[h(t-1,e)!==l,h(t+1,e)!==l,h(t,e-1)!==l,h(t,e+1)!==l],f=this.salt*1000003+e*4099+t|0,m=new Float32Array(this.keyframes.length),g=new Float32Array(this.keyframes.length),x=this.zoning,p=(A,_)=>this.owns(A,_)&&this.t.metresAt(A,_)>.3,d=[];for(const A of this.tileLots(o,a,l,f,u,p)){this.bytesAt(A.x,A.z,m);let _=0;for(const R of m)_=Math.max(_,R);A.zone=yo(x.zoning,x.rect,A.x,A.z),A.lud=yo(x.lud,x.rect,A.x,A.z),A.zoned=!!x.zoning;const y=Va[A.zone];y&&(_=Math.max(_,255*Math.log(1+y/this.d0)/this.L+5));const C=this.fillMax(this.people(_));if(A.rank>=C*1.5&&!(A.anchor&&A.rankY<C*1.5)||(A.w=this.weight(A.x,A.z)*(.85+.3*$a(A.x/2.3,A.z/2.3,73)),A.rank>=C*A.w&&!(A.anchor&&A.rankY<C*A.w)))continue;A.b=Float32Array.from(m),this.values&&(A.vb=Float32Array.from(this.sample(this.values,A.x,A.z,g,0)));const P=Math.exp(-this.grid(this.sea,A.x,A.z)/600),I=Xf(this.places,A.x,A.z,P);A.coast=P,A.harbour=I.harbour,A.centre=I.centre,d.push(A)}const v=[],M=(A,_,y)=>this.allows(A,_,y),S=()=>1,b=A=>v.push(A);for(const A of d)this.scatterLot(A,M,S,b);const w=v.length;if(r.n=w,r.lots=d.length,w){const A=Xa(f),_=Int32Array.from({length:w},(y,C)=>C);for(let y=w-1;y>0;y--){const C=Math.floor(A()*(y+1)),P=_[y];_[y]=_[C],_[C]=P}r.order=_,r.pos=new Float32Array(w*4),r.scale=new Float32Array(w*3),r.spans=new Float32Array(w*4),r.cols=new Float32Array(w*3),r.vOf=new Uint16Array(w),r.kind=new Uint8Array(w),r.site=new Int32Array(w),v.forEach((y,C)=>{r.pos.set([y.x,y.y,y.z,y.a],C*4),r.scale.set([y.sh,y.sv,y.stretch],C*3),r.spans.set(y.span,C*4),r.cols.set(y.colour,C*3),r.vOf[C]=this.byKey.get(y.kind*16+y.variant),r.kind[C]=y.kind,r.site[C]=y.site})}for(const A of((E=this.app.districts)==null?void 0:E.list)||[])Ra(A.rect,o+Wt/2,a+Wt/2)<Wt&&this.towns.version++;return this.times.tiles++,this.times.build+=performance.now()-n,r}update(t,e,n,i){var d,v,M,S;if(this.active=!0,this.show=n,!this.ready){this.pending=1;return}if(this.needPatches&&!((d=this.app.patches)!=null&&d.loaded)){this.pending=1;return}this.patchBoxes||(this.patchBoxes=((M=(v=this.app.patches)==null?void 0:v.byPack)==null?void 0:M.get(this.id))||[],this.patchBox=this.patchBoxes.reduce((b,w)=>[Math.min(b[0],w.box[0]),Math.min(b[1],w.box[1]),Math.max(b[2],w.box[2]),Math.max(b[3],w.box[3])],[1/0,1/0,-1/0,-1/0]),this.featBox=this.features.reduce((b,w)=>[Math.min(b[0],w.box[0]),Math.min(b[1],w.box[1]),Math.max(b[2],w.box[2]),Math.max(b[3],w.box[3])],[1/0,1/0,-1/0,-1/0]));const o=this.rect,a=$t(Math.floor((t.x-e-o.x0)/Wt),0,this.tw-1),r=$t(Math.floor((t.x+e-o.x0)/Wt),0,this.tw-1),c=$t(Math.floor((t.z-e-o.z0)/Wt),0,this.th-1),l=$t(Math.floor((t.z+e-o.z0)/Wt),0,this.th-1),h=[],u=this.towns.yieldU,f=u.uYieldRect.value,m=u.uYield.value>=.999;for(let b=c;b<=l;b++)for(let w=a;w<=r;w++){if(this.tiles.has(`${w},${b}`))continue;const E=o.x0+(w+.5)*Wt,A=o.z0+(b+.5)*Wt;if(m&&E-Wt/2>f.x&&A-Wt/2>f.y&&E+Wt/2<f.z&&A+Wt/2<f.w)continue;const _=Math.hypot(E-t.x,A-t.z);_>e+Wt||h.push([_,w,b])}h.sort((b,w)=>b[0]-w[0]);const g=performance.now();let x=0;for(const[,b,w]of h){if(x&&performance.now()-g>i)break;this.buildTile(b,w),x++}this.pending=h.length-x;const p=e*dw+Wt;for(const[b,w]of this.tiles){const E=w.x0+Wt/2,A=w.z0+Wt/2;if(!(Math.hypot(E-t.x,A-t.z)<=p)&&(this.tiles.delete(b),w.n))for(const _ of((S=this.app.districts)==null?void 0:S.list)||[])Ra(_.rect,E,A)<Wt&&this.towns.version++}this.group.visible=n>.001,this.group.visible&&(this.material.uniforms.uShow.value=n,this.material.uniforms.uYearNow.value=this.towns.yearNow,this.material.uniforms.uFadeNear.value=e*.75,this.material.uniforms.uFadeFar.value=e,this.refresh(this.app.camera,e,this.t.pack.data.hi*this.app.world.uniforms.uVert.value+3,x>0))}get idle(){return!!(this.ready||this.failed)&&!this.pending}hide(){this.active=!1,this.group.visible=!1,this.drawn=0,this.key=""}meshes(){this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new ee(0,0,0,0))},uShadeS:{value:this.t.shadow.texture},uShadeRect:{value:this.t.rect},uYearNow:{value:this.towns.yearNow},...this.towns.yieldU},this.material=Ao(this.app.shared,this.own,{fade:[50,70],grow:!0,yield:!0}),this.variants=[],this.byKey=new Map;for(const t of qn)this.kits[t].forEach((e,n)=>{this.byKey.set(Pt[t]*16+n,this.variants.length),this.variants.push({name:t,v:n,kit:e,cap:0,mesh:null})});this.frustum=new Ii,this.pv=new se,this.box=new bn,this.m4=new se,this.q=new Pi,this.up=new B(0,1,0),this.v3=new B,this.s3=new B,this.key="",this.yearDrawn=NaN}room(t,e){if(t.cap>=e&&t.mesh)return;const n=Math.min(_u,Math.max(64,t.cap*2,e));t.mesh&&(this.group.remove(t.mesh),t.mesh.dispose());const i=t.kit.geometry,o=new Uc(i,this.material,n);o.name=`${t.name}-${t.v}`,o.count=0,o.frustumCulled=!1,o.instanceMatrix.setUsage(wn),o.instanceColor=new Ne(new Float32Array(n*3),3),o.instanceColor.setUsage(wn);const a=new Ne(new Float32Array(n*4),4);a.setUsage(wn);const r=new Ne(new Float32Array(n),1);r.setUsage(wn),i.setAttribute("aSpan",a),i.setAttribute("aStretch",r),Object.assign(t,{mesh:o,cap:n,aSpan:a,aStretch:r}),this.group.add(o)}static aliveNear(t,e,n){const i=t.spans;return i[e*4]<n+1&&i[e*4+3]>n-1}refresh(t,e,n,i){const o=this.towns.yearNow,a=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const r=e*.7,c=[],l=this.towns.yieldU,h=l.uYieldRect.value,u=l.uYield.value>=.999;let f="";for(const w of this.tiles.values()){if(!w.n)continue;this.box.min.set(w.x0,-.5,w.z0),this.box.max.set(w.x0+Wt,n,w.z0+Wt);const E=this.box.distanceToPoint(a);if(E>e||!this.frustum.intersectsBox(this.box)||u&&w.x0>h.x&&w.z0>h.y&&w.x0+Wt<h.z&&w.z0+Wt<h.w)continue;const A=E<r?1:r/E;c.push([w,Math.round(A*20)]),f+=`${w.ti},${w.tj}:${c[c.length-1][1]};`}const m=this.app.districts,g=!!(m!=null&&m.on);if(f+=`${u?1:0}${g?1:0}`,!i&&f===this.key&&Math.abs(o-this.yearDrawn)<.5)return;this.key=f,this.yearDrawn=o;let x=0;const p=[];for(const[w,E]of c){let A=0;for(let _=0;_<w.n;_++)ks.aliveNear(w,_,o)&&A++;p.push(A),x+=Math.ceil(A*E/20)}const d=Math.min(1,_u/Math.max(1,x)),v=new Int32Array(this.variants.length),M=[];c.forEach(([w,E],A)=>{const _=Math.ceil(p[A]*E*d/20);let y=0;for(let C=0;C<w.n&&y<_;C++){const P=w.order[C];ks.aliveNear(w,P,o)&&(u&&w.pos[P*4]>h.x&&w.pos[P*4+2]>h.y&&w.pos[P*4]<h.z&&w.pos[P*4+2]<h.w||(M.push(w,P),v[w.vOf[P]]++,y++))}}),this.variants.forEach((w,E)=>{v[E]&&this.room(w,v[E]),w.c=0});const S=g?m.cur.d.rect:null,b=this.app.world;for(let w=0;w<M.length;w+=2){const E=M[w],A=M[w+1],_=this.variants[E.vOf[A]];if(_.c>=_.cap)continue;const y=_.c++;let C=E.pos[A*4+1];const P=E.pos[A*4],I=E.pos[A*4+2];if(S&&P>S.x0&&I>S.z0&&P<S.x1&&I<S.z1){const R=_.kit,U=E.scale[A*3];let F=-1/0;for(const[G,W]of[[0,0],[-1,-1],[1,-1],[1,1],[-1,1]])F=Math.max(F,b.metresAt(P+G*R.hx*U,I+W*R.hz*U));C=Math.max(C,hi(F)+Wf)}this.q.setFromAxisAngle(this.up,E.pos[A*4+3]),this.v3.set(P,C,I),this.s3.set(E.scale[A*3],E.scale[A*3+1],E.scale[A*3]),this.m4.compose(this.v3,this.q,this.s3),this.m4.toArray(_.mesh.instanceMatrix.array,y*16),_.mesh.instanceColor.array.set(E.cols.subarray(A*3,A*3+3),y*3),_.aSpan.array.set(E.spans.subarray(A*4,A*4+4),y*4),_.aStretch.array[y]=E.scale[A*3+2]}this.drawn=0;for(const w of this.variants)w.mesh&&(w.mesh.count=w.c,w.mesh.visible=w.c>0,w.mesh.instanceMatrix.needsUpdate=!0,w.mesh.instanceColor.needsUpdate=!0,w.aSpan.needsUpdate=!0,w.aStretch.needsUpdate=!0,this.drawn+=w.c)}static weightAt(t,e,n){const i=t.spans;return ce(i[e*4],i[e*4+1],n)*(1-ce(i[e*4+2],i[e*4+3],n))}stampInto(t,e,n){if(this.ready){for(const i of this.tiles.values())if(!(!i.n||i.x0>t.x1||i.z0>t.z1||i.x0+Wt<t.x0||i.z0+Wt<t.z0))for(let o=0;o<i.n;o++){const a=i.pos[o*4],r=i.pos[o*4+2];if(Math.min(a-t.x0,t.x1-a,r-t.z0,t.z1-r)>Ji)continue;const c=ks.weightAt(i,o,e);if(c<.02)continue;const l=this.variants[i.vOf[o]].kit,h=i.scale[o*3];n(a,r,i.pos[o*4+3],l.hx*h*.95,l.hz*h*.95,Math.round(255*c))}}}alive(t,e=null,n=null,i=1/0){const o=[];if(!this.ready)return o;for(const a of this.tiles.values())if(a.n&&!(e!==null&&Ra({x0:a.x0,z0:a.z0,x1:a.x0+Wt,z1:a.z0+Wt},e,n)>i))for(let r=0;r<a.n;r++){if(ks.weightAt(a,r,t)<.999)continue;const c=a.pos[r*4],l=a.pos[r*4+2];if(e!==null&&Math.hypot(c-e,l-n)>i)continue;const h=this.variants[a.vOf[r]],u=a.scale[r*3];o.push({island:this.id,site:a.site[r]+a.ti*1e5+a.tj*1e9,kind:h.name,variant:h.v,x:c,z:l,a:a.pos[r*4+3],ax:h.kit.hx*u,az:h.kit.hz*u,box:h.kit.box.map(f=>f*u),y:a.pos[r*4+1],height:h.kit.top*a.scale[r*3+1]})}return o}stats(){var o;let t=0,e=0,n=0,i=0;for(const a of this.tiles.values()){t+=a.n,e+=a.lots||0,a.empty||i++;for(const r of["order","pos","scale","spans","cols","vOf","kind","site"])n+=((o=a[r])==null?void 0:o.byteLength)||0}if(this.ready)for(const a of[this.sea,this.broad,this.toStream,this.streamOn,this.most,...this.bytes])n+=a.byteLength;return{island:this.id,ready:this.ready,failed:this.failed,tiles:this.tiles.size,worked:i,pending:this.pending,lots:e,instances:t,drawn:this.drawn,triangles:(this.variants||[]).reduce((a,r)=>a+(r.mesh?r.mesh.count*r.kit.tris:0),0),zoning:this.zoning?{zoning:this.zoning.zoning?`${this.zoning.zoning.W}×${this.zoning.zoning.H}`:null,lud:this.zoning.lud?`${this.zoning.lud.W}×${this.zoning.lud.H}`:null}:null,value:this.values?"mask":"modelled",towns:this.townTerms??null,loadMs:this.loadMs??null,buildMs:Math.round(this.times.build),msPerTile:this.times.tiles?+(this.times.build/this.times.tiles).toFixed(2):null,cpuMB:+(n/1048576).toFixed(1)}}dispose(){var t,e;this.disposed=!0,this.towns.group.remove(this.group);for(const n of this.variants||[])(t=n.mesh)==null||t.dispose(),n.kit.geometry.dispose();(e=this.material)==null||e.dispose(),this.tiles.clear()}}const nd=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Qr=["chiefdoms","land","mahele"],wc=s=>nd(260,900,s),La=s=>nd(90,300,s);class gw{constructor(t,e,{warn:n=console.warn}={}){this.canvas=t,this.data=e,this.warn=n,this.params=new URLSearchParams(location.search);const i=new pf({canvas:t,antialias:!1,powerPreference:"high-performance"});i.setClearColor(0,1),i.info.autoReset=!1,this.renderer=i,this.pipeline=new Qv(i),this.scene=new er,this.camera=new yn(42,1,.1,9e3),this.light={sunDir:new B(0,1,0),sunColor:new Gt,skyColor:new Gt,groundColor:new Gt,moonDir:new B(0,-1,0),moonColor:new Gt,zenith:new Gt,horizon:new Gt,sunHorizon:new Gt,night:0},this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uSkyMap:{value:null},uMokuId:{value:null},uMokuRect:{value:new ee(0,0,1,1)},uPalette:{value:null},uEraMix:{value:0},uPolityK:{value:0},uHoverMoku:{value:0}}},this.world=new hx(this,e),Object.assign(this.shared.uniforms,this.world.uniforms),this.world.uniforms=this.shared.uniforms,this.patches=new lx(this),this.timeline=new uw(e.eras),this.polity=new aw(e,this.world.archPack.rect,this.shared.uniforms,n),this.land=new K_(this),this.mahele=new rw(this),this.regionOn="chiefdoms",this.overlay={lines:!0,pins:!0,routes:!1};const o=this.params.get("view");this.view=Qr.includes(o)?o:o==="none"?null:"chiefdoms",this.viewChosen=Qr.includes(o)||o==="none",this.viewListeners=[],this.polityK=0,this.landK=0,this.sky=new Ny,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??15.6)},this.time=0,this.frames=0,this.updaters=[]}start(){this.world.setArchipelago(this.world.archPack),this.scene.add(this.world.group),this.districts=new My(this),this.world.district=this.districts,this.towns=new mw(this),this.ocean=new by(this.shared,this.shared.uniforms),this.scene.add(this.ocean.mesh),this.lines=new Yy(this.data,this.shared.uniforms),this.scene.add(this.lines.group),this.routes=new ow({proj:this.data.proj,uniforms:this.shared.uniforms,camera:this.camera,renderer:this.renderer,eras:this.data.eras}),this.scene.add(this.routes.group),nw(this.data,this.warn).then(a=>this.routes.setRoutes(a)),this.mahele.load(),this.rig=new Hy(this.camera,this.canvas,this.world);const t=this.params.get("cam");if(t){const[a,r,c,l,h]=t.split(",").map(Number);this.rig.jump({x:a,z:r,distance:c,yaw:l,pitch:h})}const e=this.params.get("year");e?this.timeline.setYear(Number(e)):t?this.timeline.set(Math.round(this.timeline.sAtYear(1778))):this.timeline.set(0),this.timeline.onChange(()=>this.syncEras()),this.syncEras(),this.sky.update(this.clock.doy,this.clock.hour,0,this.light);const n=this.renderer.getContext(),i=n.getExtension("WEBGL_debug_renderer_info"),o=i?String(n.getParameter(i.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(o),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.params.get("debug")&&this.world.setDebug(Number(this.params.get("debug"))),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}setView(t,{user:e=!1}={}){e&&(this.viewChosen=!0);const n=Qr.includes(t)?t:null;if(n!==this.view){this.view=n;for(const i of this.viewListeners)i(n)}}get farView(){return this.view==="mahele"&&!this.mahele.availableAt(this.timeline.year)?"chiefdoms":this.view}region(t){if(t===this.regionOn||this.polityK>.004||t==="mahele"&&!this.mahele.build())return;const e=t==="mahele"?this.mahele:this.polity,n=this.shared.uniforms;n.uMokuId.value=e.idTex,n.uPalette.value=e.palTex,n.uMokuRect.value.set(e.rect.x0,e.rect.z0,e.rect.x1,e.rect.z1),this.regionOn=t}regionZoom(t,e){return t!==this.regionOn?0:t==="mahele"?La(e):t==="chiefdoms"?wc(e):0}onView(t){this.viewListeners.push(t)}islandFill(){const t=this.rig.state,e=t.target;let n=null,i=0;for(const r of this.world.islandPacks){const c=r.rect,l=Math.min(e.x-c.x0,c.x1-e.x,e.z-c.z0,c.z1-e.z);l>i&&(i=l,n=r)}if(!n)return 0;const o=2*t.distance*Math.tan(this.camera.fov*Math.PI/360),a=n.rect;return Math.max((a.x1-a.x0)/(o*this.camera.aspect),(a.z1-a.z0)/o)}routeSection(){var o;const t=this.tour,e=(o=this.ui)==null?void 0:o.card;let n=null;t!=null&&t.active&&t.event?n=t.event:!(t!=null&&t.active)&&(e==null?void 0:e.mode)==="event"&&e.ev&&(n=e.ev);const i=n?`ev:${n.id}`:"";return i!==this._routeKey&&(this._routeKey=i,this._routeSection=n?{routes:new Set(n.routes||[]),events:new Set([n.id]),k:1,focus:!0}:null),this._routeSection}routeOptions(t){return{window:this.timeline.window,fill:this.islandFill(),section:this.routeSection(),all:this.overlay.routes===!0,...t}}addIsland(t){const e=this.world.addIsland(t);this.land.attach(e),e.applyRange(this.qset.range),this.params.get("debug")&&(e.uniforms.uDebug.value=Number(this.params.get("debug")))}settle(){var n,i,o,a;(n=this.ui)==null||n.timeline.finish(),this.rig.finishFlight();const t=this.rig.goal;for(const r of[this.rig.goal,this.rig.state])r.target.copy(t.target),r.distance=t.distance,r.yaw=t.yaw,r.pitch=t.pitch;this.world.update(this.camera,t.distance,0),this.world.settle(this.camera),(i=this.districts)==null||i.settle(this.camera,t.distance),(o=this.towns)==null||o.settle(),this.rig.jump({x:t.target.x,z:t.target.z});const e=this.farView;(e==="chiefdoms"||e==="mahele")&&(this.polityK=0,this.region(e)),this.polityK=this.regionZoom(e,t.distance),this.landK=e==="land"?La(t.distance):0,this.shared.uniforms.uPolityK.value=this.polityK,this.land.settle(this.landK),(a=this.routes)==null||a.settle(this.timeline.year,t.distance,this.routeOptions())}stats(){const t=this.renderer.info;return{...this.world.stats(),view:this.view,farView:this.farView,frameMs:+(this.frameAvg??0).toFixed(1),calls:t.render.calls,triangles:t.render.triangles,textures:t.memory.textures,quality:this.quality.level}}syncEras(){const{a:t,b:e,t:n}=this.timeline.pair;this.polity.setEras(t,e,n)}applyQuality(){const t=[{range:3,dpr:1},{range:3.8,dpr:1.25},{range:4.6,dpr:1.5},{range:5.5,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.world.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.frameAvg=this.frameAvg===void 0?e*1e3:this.frameAvg+(e*1e3-this.frameAvg)*.1,this.renderer.info.reset(),this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.clock;this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t);const n=this.rig.state.distance;this.world.update(this.camera,n,t),this.ocean.update(this.camera);const i=1-Math.exp(-t*5),o=this.farView;(o==="chiefdoms"||o==="mahele")&&this.region(o);const a=this.regionZoom(o,n);this.polityK+=(a-this.polityK)*i,Math.abs(a-this.polityK)<.001&&(this.polityK=a),this.shared.uniforms.uPolityK.value=this.polityK;const r=o==="land"?La(n):0;this.landK+=(r-this.landK)*i,this.land.update(t,this.landK),this.lines.visible=this.overlay.lines;const c=this.light,l=Math.min(1,.25+(c.sunColor.r+c.skyColor.r)*.35);this.lines.update(this.camera,this.renderer,n,l),this.routes.update(this.timeline.year,n,this.routeOptions({light:l}));for(const u of this.updaters)u(t,this.time);const h=this.pipeline.uniforms;h.uSunDir.value.copy(c.sunDir),h.uSunColor.value.copy(c.sunHorizon),h.uFogColor.value.copy(c.horizon),h.uFogDensity.value=.09/Math.max(30,n),h.uFogFalloff.value=2/Math.max(30,n),h.uExposure.value=.55*(1+2.2*Math.pow(c.night,1.5)),h.uNight.value=c.night,this.sky.group.position.copy(this.camera.position)}}const en=(s,t=document)=>t.querySelector(s),nn=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,o]of Object.entries(t))i==="class"?n.className=o:i.startsWith("on")?n.addEventListener(i.slice(2),o):n.setAttribute(i,o);return e&&(n.innerHTML=e),n},vw={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},wt=s=>String(s??"").replace(/[&<>"']/g,t=>vw[t]),bc={arrival:'<path d="M2.5 15.5h19l-2.6 3.6H5.1z"/><path d="M11.5 15.5V4l6.5 9.2h-6.5"/><path d="M2 21.2c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',voyage:'<path d="M2.5 14.5h19l-2.6 3.6H5.1z"/><path d="M11.5 14.5V3.5l6.5 9h-6.5"/><path d="M6 21c3-1.4 9-1.4 12 0"/>',battle:'<path d="M4.5 19.5 19.5 4.5M4.5 4.5l15 15"/><path d="M16.5 4.5h3v3M7.5 4.5h-3v3"/>',founding:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',construction:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',eruption:'<path d="M2.5 20.5 9 11h6l6.5 9.5z"/><path d="M10.2 8.2c0-2 1-3.1 1.8-4.7.8 1.6 1.8 2.7 1.8 4.7"/><path d="M7 6.5l1.3 1.3M17 6.5l-1.3 1.3"/>',epidemic:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',law:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',treaty:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 15h3"/><path d="M13.5 18.5c1-1 1.8-1 2.8 0"/>',death:'<path d="M3.5 18.5h17"/><path d="M7 18.5a5 5 0 0 1 10 0"/><path d="M12 4.5v5M9.6 7.4 12 9.8l2.4-2.4"/>',protest:'<path d="M6 21V3.5"/><path d="M6 4h11.5l-2.6 4 2.6 4H6"/>',restoration:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',other:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',era:'<path d="M5 13.5h14l-2 2.6H7z"/><path d="M11.5 13.5V3.5l5.5 7.6h-5.5"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',routes:'<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',home:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'};function Nn(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${bc[s]||bc.other}</svg>`}const id=s=>s in bc;class xw{constructor(t,e,n){var a;this.app=e,this.ui=n,this.tl=e.timeline,this.tween=null;const i=this.tl.n;this.el=nn("div",{class:"timeline",role:"group","aria-label":"Time"}),i<2&&this.el.classList.add("single"),i<1&&(this.el.hidden=!0),this.el.innerHTML=`
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${Nn("prev",16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${Nn("next",16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${Math.max(0,i-1)}" step="0.001" aria-label="Year" />
      </div>`,t.appendChild(this.el),this.input=en(".tl-input",this.el),this.backBtn=en(".tl-back",this.el),this.nextBtn=en(".tl-next",this.el),this.tourEl=en(".tl-tour",this.el);const o=en(".tl-ticks",this.el);this.tl.eras.forEach((r,c)=>{const l=i>1?c/(i-1)*100:50,h=nn("button",{class:"tl-tick",style:`left:${l}%`,title:`${r.label} · ${bo(r.year,r.yearPrecision)}`,"aria-label":r.label,"data-i":c});h.innerHTML=`<i></i><span>${wt(bo(r.year,r.yearPrecision).replace("c. ",""))}</span>`,o.appendChild(h)}),this.labelTicks(),addEventListener("resize",()=>this.labelTicks()),(a=document.fonts)==null||a.ready.then(()=>this.labelTicks()),this.input.addEventListener("input",()=>{this.tween=null,this.tl.set(Number(this.input.value)),this.ui.onScrub()}),o.addEventListener("click",r=>{const c=r.target.closest(".tl-tick");c&&(this.easeTo(Number(c.dataset.i),.9),this.ui.onScrub(Number(c.dataset.i)))}),this.nextBtn.addEventListener("click",()=>{this.el.classList.remove("invite"),this.ui.tour.next()}),this.backBtn.addEventListener("click",()=>this.ui.tour.back()),this.tl.onChange(()=>this.refresh()),this.refresh()}labelTicks(){const t=[...this.el.querySelectorAll(".tl-tick span")];for(const a of t)a.hidden=!1;const e=t.map(a=>a.getBoundingClientRect());if(!e.some(a=>a.width>0))return;const n=6,i=e.length-1;let o=-1/0;t.forEach((a,r)=>{const c=e[r],l=r===0||r===i||c.left>=o+n&&c.right<=e[i].left-n;a.hidden=!l,l&&(o=c.right)})}easeTo(t,e=1){const n=Math.max(0,Math.min(this.tl.max,t));this.tween={from:this.tl.s,to:n,t:0,dur:e}}easeToYear(t,e){this.easeTo(this.tl.sAtYear(t),e)}finish(){this.tween&&(this.tl.set(this.tween.to),this.tween=null)}update(t){const e=this.tween;if(!e)return;e.t=Math.min(1,e.t+t/e.dur);const n=e.t<.5?2*e.t*e.t:1-Math.pow(-2*e.t+2,2)/2;this.tl.set(e.from+(e.to-e.from)*n),e.t>=1&&(this.tween=null)}refresh(){const t=this.tl,e=t.era;en(".tl-era",this.el).textContent=e?e.label:"",en(".tl-year",this.el).textContent=e?bo(t.year,e.yearPrecision??1):"",document.activeElement!==this.input&&(this.input.value=String(t.s));const n=t.max>0?t.s/t.max:0;en(".tl-rail span",this.el).style.width=`${n*100}%`;const i=Math.round(t.s);for(const o of this.el.querySelectorAll(".tl-tick"))o.classList.toggle("on",Number(o.dataset.i)===i)}refreshTour(t){const e=`${t.active}:${t.chapter}:${t.step}:${t.stop}:${t.active?"":t.nearestChapter()}:${t.atEnd}`;if(e===this.tourKey)return;this.tourKey=e;const n=t.describe();if(this.backBtn.disabled=!n||t.atStart,this.nextBtn.disabled=!n||t.atEnd,this.el.classList.toggle("off-tour",!!n&&!n.active),this.tourEl.classList.toggle("opening",!!(n!=null&&n.opening)),!n){this.tourEl.innerHTML="";return}this.tourEl.innerHTML=n.active?`<span class="tl-ch">Chapter <b>${n.number}</b> of ${n.of}</span><i>·</i><em>${wt(n.name)}</em>${n.step?`<i>·</i><span>${wt(n.step)}</span>`:""}`:`<span>Next resumes at ${wt(n.chapter.toLowerCase())}</span><i>·</i><em>${wt(n.name)}</em>`,this.nextBtn.title=n.active?"Next (→ or space)":`Back to the tour: ${n.chapter.toLowerCase()}, ${n.name}`}}const bu={exact:0,ahupuaa:22,moku:90,island:260,sea:160},Su=24;class Mw{constructor(t,e,{onOpen:n,onCluster:i}={}){this.app=e,this.onOpen=n,this.onCluster=i,this.layer=nn("div",{class:"pins"}),t.appendChild(this.layer),this.tip=nn("div",{class:"cl-tip",role:"tooltip"}),t.appendChild(this.tip);const o=new Map(e.data.places.map(c=>[c.id,c]));this.places=o,this.items=[];const a=[];for(const c of e.data.events){const l=(c.where||[]).map(d=>o.get(d.place)).find(d=>d&&fn(d.geometry)),h=yc(c);if(!l||!h){a.push(c.id);continue}const[u,f]=e.data.proj.toWorld(fn(l.geometry)),m=id(c.kind)?c.kind:"other",g=nn("button",{class:"pin",title:c.title,"aria-label":c.title},`<span class="pin-ic">${Nn(m,16)}</span><span class="pin-label">${wt(c.title)}</span>`);g.addEventListener("click",d=>{var v;d.stopPropagation(),(v=this.onOpen)==null||v.call(this,c)});const x=bu[l.placePrecision]??0,p=nn("div",{class:"halo"});this.layer.appendChild(p),this.layer.appendChild(g),this.items.push({ev:c,place:l,x:u,z:f,span:h,start:ja(c)??h[0],el:g,halo:p,soft:x,r:x,pos:new B(u,0,f),shown:!1,active:!1,near:!1,haloShown:!1,tx:NaN,ty:NaN,ts:NaN,hx:NaN,hy:NaN,hr:NaN,ha:NaN})}a.length&&e.warn(`events with no placeable \`where\` or no date, so no pin: ${a.join(", ")}`);const r=this.items.length;this.sx=new Float32Array(r),this.sy=new Float32Array(r),this.vis=new Uint8Array(r),this.root=new Int16Array(r),this.size=new Int16Array(r),this.slot=new Int16Array(r),this.members=new Int16Array(r),this.halos=new Int16Array(r),this.clusters=[],this.nClusters=0,this.hovered=null,this.activeEvent=null,this.stopXZ=null,this._v=new B,this._w=new B}setStopPlace(t){const e=t&&fn(t.geometry);this.stopXZ=e?this.app.data.proj.toWorld(e):null,this.stopSoft=t?bu[t.placePrecision]??0:0}visibleEvents(){const[t,e]=this.app.timeline.window;return this.items.filter(n=>n.span[1]>=t&&n.span[0]<=e).map(n=>n.ev)}marker(t){let e=this.clusters[t];if(e)return e;const n=nn("button",{class:"cluster"},'<span class="cl-n"></span>');return e={el:n,label:n.firstChild,start:0,count:0,x:0,y:0,key:0,shownCount:-1,tipKey:-1,domKey:-1,shown:!1,beside:!1,tx:NaN,ty:NaN,ts:NaN},n.addEventListener("click",i=>{var o;i.stopPropagation(),this.hideTip(),(o=this.onCluster)==null||o.call(this,this.eventsOf(e))}),n.addEventListener("pointerenter",i=>{i.pointerType!=="touch"&&(this.hovered=e,this.showTip(e))}),n.addEventListener("pointerleave",()=>{this.hovered===e&&this.hideTip()}),this.layer.appendChild(n),this.clusters[t]=e,e}eventsOf(t){const e=[];for(let n=0;n<t.count;n++)e.push(this.items[this.members[t.start+n]]);return e.sort((n,i)=>n.start-i.start).map(n=>n.ev)}groups(){return this.clusters.slice(0,this.nClusters).map(t=>({ids:this.eventsOf(t).map(e=>e.id),count:t.count,x:t.x,y:t.y,beside:t.beside}))}showTip(t){t.tipKey=t.key;const e=this.eventsOf(t).map(n=>`<div class="tip-row"><span class="tip-y">${wt(ed(n))}</span><b>${wt(n.title)}</b></div>`).join("");this.tip.innerHTML=`<div class="tip-head">${t.count} events here</div>${e}<div class="tip-foot">click for the list</div>`,this.tip.classList.add("show"),this.tipX=this.tipY=NaN,this.placeTip(t)}placeTip(t){const e=this.tip.offsetWidth||220,n=this.tip.offsetHeight||120;let i=t.x+22;i+e>innerWidth-10&&(i=t.x-22-e);const o=Math.max(64,Math.min(innerHeight-n-10,t.y-44-n/2)),a=Math.round(i),r=Math.round(o);a===this.tipX&&r===this.tipY||(this.tipX=a,this.tipY=r,this.tip.style.transform=`translate(${a}px, ${r}px)`)}hideTip(){this.hovered=null,this.tip.classList.remove("show")}find(t){const e=this.root;for(;e[t]!==t;)e[t]=e[e[t]],t=e[t];return t}put(t,e,n,i){Math.abs(e-t.tx)<.05&&Math.abs(n-t.ty)<.05&&i===t.ts||(t.tx=e,t.ty=n,t.ts=i,t.el.style.transform=`translate(${e.toFixed(1)}px, ${n.toFixed(1)}px) scale(${i.toFixed(3)})`)}update(t){const e=this.app,n=e.camera,i=innerWidth,o=innerHeight,a=e.timeline,r=a.yearAt(a.s-.5),c=a.yearAt(a.s+.5),l=e.rig.state.distance,h=Math.round(Math.max(.62,Math.min(1,1.18-Math.log(Math.max(1,l)/120)*.13))*200)/200,u=this.items,f=u.length,{sx:m,sy:g,vis:x,root:p,size:d}=this,v=this.activeEvent,M=this._v;let S=-1;for(let _=0;_<f;_++){const y=u[_],C=y.ev===v,P=C&&this.stopXZ;y.pos.x=P?this.stopXZ[0]:y.x,y.pos.z=P?this.stopXZ[1]:y.z,y.pos.y=e.world.heightAt(y.pos.x,y.pos.z)+.02,y.r=P?this.stopSoft:y.soft;let I=t&&(C||y.span[1]>=r&&y.span[0]<=c);I&&(M.copy(y.pos).project(n),m[_]=(M.x+1)/2*i,g[_]=(1-M.y)/2*o,I=M.z<1&&m[_]>-60&&m[_]<i+60&&g[_]>84&&g[_]<o+40),x[_]=I?1:0,I&&C&&(S=_),p[_]=_,d[_]=0}const b=Su*Su;for(let _=0;_<f;_++)if(!(!x[_]||_===S))for(let y=_+1;y<f;y++){if(!x[y]||y===S)continue;const C=m[_]-m[y],P=g[_]-g[y];if(C*C+P*P<b){const I=this.find(_),R=this.find(y);I!==R&&(p[Math.max(I,R)]=Math.min(I,R))}}for(let _=0;_<f;_++)x[_]&&_!==S&&d[this.find(_)]++;let w=0,E=0;for(let _=0;_<f;_++){if(!x[_]||_===S||p[_]!==_||d[_]<2)continue;const y=this.marker(w);this.slot[_]=w++,y.start=E,y.count=0,y.x=0,y.y=0,y.key=0,E+=d[_]}for(let _=0;_<f;_++){if(!x[_]||_===S)continue;const y=this.find(_);if(d[y]<2)continue;const C=this.clusters[this.slot[y]];this.members[C.start+C.count++]=_,C.x+=m[_],C.y+=g[_],C.key=(C.key*61+_+1)%1000003}for(let _=0;_<f;_++){const y=u[_],C=x[_]===1&&(_===S||d[this.find(_)]<2);C!==y.shown&&(y.shown=C,y.el.classList.toggle("show",C));const P=y.ev===v;if(P!==y.active&&(y.active=P,y.el.classList.toggle("active",P)),!C)continue;const I=l<260||P;I!==y.near&&(y.near=I,y.el.classList.toggle("near",I)),this.put(y,m[_],g[_],h)}for(let _=0;_<w;_++){const y=this.clusters[_];y.x/=y.count,y.y/=y.count;const C=S>=0&&Math.abs(y.x-m[S])<30&&Math.abs(y.y-g[S])<30;if(C&&(y.x=m[S]-36*h,y.y=g[S]),C!==y.beside&&(y.beside=C,y.el.classList.toggle("beside",C)),y.count!==y.shownCount&&(y.shownCount=y.count,y.label.textContent=String(y.count),y.el.setAttribute("aria-label",`${y.count} events here`)),y.key!==y.domKey){y.domKey=y.key;let P="";for(let I=0;I<y.count;I++)P+=`${I?" ":""}${u[this.members[y.start+I]].ev.id}`;y.el.dataset.events=P}y.shown||(y.shown=!0,y.el.classList.add("show")),this.put(y,y.x,y.y,h),this.hovered===y&&(y.key!==y.tipKey?this.showTip(y):this.placeTip(y))}for(let _=w;_<this.clusters.length;_++){const y=this.clusters[_];this.hovered===y&&this.hideTip(),y.shown&&(y.shown=!1,y.count=0,y.el.classList.remove("show"))}this.nClusters=w;let A=0;for(let _=0;_<f;_++){const y=u[_];let C=x[_]===1&&y.r>0;for(let U=0;C&&U<A;U++){const F=u[this.halos[U]];Math.abs(F.pos.x-y.pos.x)<.5&&Math.abs(F.pos.z-y.pos.z)<.5&&F.r>=y.r&&(C=!1)}if(C!==y.haloShown&&(y.haloShown=C,y.halo.classList.toggle("show",C)),!C)continue;this.halos[A++]=_,this._w.copy(n.position).sub(y.pos).normalize();const P=this._w.cross(n.up).normalize().multiplyScalar(y.r).add(y.pos);P.project(n);const I=Math.max(6,Math.min(400,Math.hypot((P.x+1)/2*i-m[_],(1-P.y)/2*o-g[_])));Math.abs(m[_]-y.hx)<.05&&Math.abs(g[_]-y.hy)<.05&&Math.abs(I-y.hr)<.05||(y.hx=m[_],y.hy=g[_],y.hr=I,y.halo.style.transform=`translate(${m[_].toFixed(1)}px, ${g[_].toFixed(1)}px) scale(${I.toFixed(1)})`);const R=Math.round(Math.max(.3,Math.min(1,70/I))*100)/100;R!==y.ha&&(y.ha=R,y.halo.style.setProperty("--halo",R.toFixed(2)))}}}const _w={arrival:"arrival",battle:"battle",founding:"founding",construction:"construction",eruption:"eruption",epidemic:"epidemic",law:"law",treaty:"treaty",voyage:"voyage",death:"death",protest:"protest",restoration:"restoration",other:"event"},Eu=s=>id(s.kind)?s.kind:"other";function Sc(s){return s?s.read!==void 0?s.read==="full"||s.read==="part":s.opened!==!1:!1}function yw(s){const t=String(s).match(/^(in the time of)(\s+)(.+)$/i);return t?{lead:t[1],gap:t[2],name:t[3]}:{lead:"",gap:"",name:String(s)}}class ww{constructor(t,e,n){this.app=e,this.ui=n,this.el=nn("section",{class:"card","aria-live":"polite"}),t.appendChild(this.el),this.places=new Map(e.data.places.map(i=>[i.id,i])),this.sources=new Map(e.data.sources.map(i=>[i.id,i])),this.events=new Map(e.data.events.map(i=>[i.id,i])),this.missing=new Set,this.mode=null,this.ev=null,this.stop=-1,this.chapter=null,this.list=null,this.el.addEventListener("click",i=>this.click(i))}get isOpen(){return this.el.classList.contains("show")}open(t){this.set("event",{ev:t})}setStop(t){this.stop=t,this.render()}openEra(t){this.set("era",{chapter:t})}openList(t){this.set("cluster",{list:t})}set(t,{ev:e=null,chapter:n=null,list:i=null}){this.mode=t,this.ev=e,this.chapter=n,this.list=i,this.stop=-1,this.render()}close(){var e,n;const t=this.ev;this.el.classList.remove("show"),this.mode=null,this.ev=null,this.chapter=null,this.list=null,(n=(e=this.ui).onCardClosed)==null||n.call(e,t)}click(t){const e=t.target.closest("button");if(!e||!this.el.contains(e))return;const n=this.ui.tour;if(e.classList.contains("card-close"))this.close();else if(e.classList.contains("prev"))n.back();else if(e.classList.contains("next"))n.next();else if(e.dataset.ev){const i=this.events.get(e.dataset.ev);i&&n.open(i,{gentle:this.mode==="cluster"})}}cited(t){const e=this.sources.get(t);return!e&&!this.missing.has(t)&&(this.missing.add(t),this.app.warn(`a card cites ${t}, which is not in sources.json`)),Sc(e)?e:null}sourceLine(t){const e=this.cited(typeof t=="string"?t:t.id);if(!e)return"";const n=typeof t=="object"&&t.where?`, ${wt(t.where)}`:"",i=e.url&&/^https?:/.test(e.url)?`<a href="${wt(e.url)}" target="_blank" rel="noopener">${wt(e.title)}</a>`:wt(e.title),o=e.author?`${wt(e.author)}, `:"",a=e.year?` (${wt(e.year)})`:"";return`<li>${o}<span class="src-title">${i}</span>${a}${n}</li>`}sourcesSection(t){const e=(t||[]).map(n=>this.sourceLine(n)).join("");return e?`<div class="card-sec"><h2>Sources</h2><ul class="sources">${e}</ul></div>`:""}eventRows(t,{gloss:e=!0}={}){return t.map(n=>`<li><button class="ev-row" data-ev="${wt(n.id)}">
          <span class="ev-ic">${Nn(Eu(n),16)}</span>
          <span class="ev-y">${wt(ed(n))}</span>
          <span class="ev-t"><b>${wt(n.title)}</b>${e&&n.gloss?`<em>${wt(n.gloss)}</em>`:""}</span>
        </button></li>`).join("")}footer(){var o;const t=this.ui.tour;if(!(t!=null&&t.active))return"";const e=t.current;let n,i="Next";if(this.mode==="era"&&this.chapter===e&&t.step<0)n=`<span class="ch-count">Chapter <b>${e.index+1}</b> of ${t.chapters.length}</span>`;else if(this.mode==="event"&&this.ev&&this.ev===t.event){const a=((o=this.ev.stops)==null?void 0:o.length)||0;t.stop>=0?n=wt(`stop ${t.stop+1} of ${a}`):(n=wt(`${t.step+1} of ${e.events.length} in chapter ${e.index+1}`),a&&(i=`Walk ${a} stops`))}else return"";return`<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${t.atStart?"disabled":""}>${Nn("prev",18)}</button>
      <span class="count">${n}</span>
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${t.atEnd?"disabled":""}><span>${wt(i)}</span>${Nn("next",18)}</button>
    </footer>`}render(){if(this.mode==="era")this.el.innerHTML=this.eraHTML();else if(this.mode==="cluster")this.el.innerHTML=this.clusterHTML();else if(this.mode==="event"&&this.ev)this.el.innerHTML=this.eventHTML();else return;this.el.dataset.mode=this.mode,this.el.classList.toggle("chapter",this.mode==="era"),this.el.classList.add("show"),this.el.scrollTop=0}header(t,e,n){return`<header>
        <div class="card-icon">${Nn(t,26)}</div>
        <div class="card-titles"><h1>${wt(e)}</h1>${n?`<p class="gloss">${wt(n)}</p>`:""}</div>
        <button class="card-close" aria-label="Close">${Nn("close",18)}</button>
      </header>`}eventHTML(){const t=this.ev,e=(t.where||[]).map(c=>{const l=this.places.get(c.place);return l?`${wt(l.name)}${c.role?` <em>${wt(c.role)}</em>`:""}`:null}).filter(Boolean),n=Object.entries(t.confidence||{}).map(([c,l])=>`<span class="conf ${wt(l)}"><b>${wt(c)}</b> ${wt(l)}</span>`).join(""),i=(t.tellings||[]).map(c=>{const l=this.cited(c.source);return l?`<li><span class="src-title">${wt(l.title)}</span>: ${wt(c.says)}</li>`:""}).join(""),o=t.stops||[],a=this.stop>=0?o[this.stop]:null,r=a?this.places.get(a.place):null;return`
      ${this.header(Eu(t),t.title,t.gloss)}
      <div class="card-meta"><span class="when">${wt(hw(t))}</span><span class="kind">${wt(_w[t.kind]||t.kind||"event")}</span></div>
      ${e.length?`<div class="card-where">${e.join("<i>·</i>")}</div>`:""}
      ${a?`<div class="stop"><div class="stop-n">${this.stop+1} / ${o.length}${r?` · ${wt(r.name)}`:""}</div><p>${wt(a.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${wt(t.summary)}</p>`:""}</div>
      ${n?`<div class="card-conf">${n}</div>`:""}
      ${i?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${i}</ul></div>`:""}
      ${this.sourcesSection(t.sources)}
      ${this.footer()}`}eraHTML(){const t=this.chapter,e=t.era,n=yw(e.label||e.id),o=String(e.note||"").match(/^([ʻʼ'‘“"(]*.)([\s\S]*)$/u),a=o?`<p><span class="initial">${wt(o[1])}</span>${wt(o[2])}</p>`:"";return`
      <header class="ch-head">
        <div class="ch-mark"><span class="ch-word">Chapter</span><span class="ch-num">${t.index+1}</span></div>
        <h1 class="ch-title">${n.lead?`<span class="ch-lead">${wt(n.lead)}</span>${wt(n.gap)}`:""}<span class="ch-name">${wt(n.name)}</span></h1>
        <div class="ch-year">${wt(bo(e.year,Math.max(10,e.yearPrecision??10)))}</div>
        <button class="card-close" aria-label="Close">${Nn("close",18)}</button>
      </header>
      <div class="card-body ch-note">${a}</div>
      ${t.events.length?`<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(t.events,{gloss:!1})}</ul></div>`:""}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`}clusterHTML(){const t=this.list||[],e=[];for(const i of t){const o=(i.where||[]).map(a=>this.places.get(a.place)).find(Boolean);o&&!e.includes(o.name)&&e.push(o.name)}const n=e.length>4?`${e.slice(0,4).join(" · ")} · and ${e.length-4} more`:e.join(" · ");return`
      ${this.header("pins",`${t.length} events`,n)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(t)}</ul></div>`}}const Gi={far:2600,island:520,near:70},tc={far:0,island:1,near:2},bw=1500,Ss=(s,t,e)=>Math.max(t,Math.min(e,s)),Sw=new Set(["law","epidemic","restoration"]);function Ew(s,t=null){return(s==null?void 0:s.view)==="land"||(s==null?void 0:s.view)==="chiefdoms"||(s==null?void 0:s.view)==="mahele"?s.view:(s==null?void 0:s.kind)==="law"&&(t!=null&&t.size)&&(s.sources||[]).some(e=>t.has(typeof e=="string"?e:e==null?void 0:e.id))?"mahele":s&&Sw.has(s.kind)?"land":"chiefdoms"}function Aw(s){return s.short?s.short:String(s.label||s.id).replace(/^in the time of\s+/i,"").split(/,| and the /)[0].trim()}function Au(s){let t=null;for(const e of s||[])e in tc&&(t===null||tc[e]>tc[t])&&(t=e);return t||"island"}class Tw{constructor(t,e){this.app=t,this.ui=e,this.places=new Map(t.data.places.map(n=>[n.id,n])),this.islands=new Map(t.data.packs.filter(n=>n!==t.world.archPack).map(n=>[n.id,n])),this.chapters=this.build(),this.active=!1,this.chapter=0,this.step=-1,this.stop=-1,this.listeners=[]}build(){const t=this.app,e=t.timeline,n=new Map(e.eras.map((r,c)=>[r.id,c])),i=e.eras.map((r,c)=>({era:r,index:c,name:Aw(r),events:[],island:null}));if(!i.length)return i;const o=[],a=i.map(()=>[]);return t.data.events.forEach((r,c)=>{const l=ja(r);if(l===null)return;let h=n.get(r.era);h===void 0&&(h=Math.round(e.sAtYear(l)),o.push(r.id)),a[h].push({ev:r,start:l,order:c})}),o.length&&t.warn(`events whose era is not in eras.json, placed in a chapter by date: ${o.join(", ")}`),i.forEach((r,c)=>{r.events=a[c].sort((l,h)=>l.start-h.start||l.order-h.order).map(l=>l.ev),r.island=this.gathering(r.events)}),i}gathering(t){const e=new Map;let n=0;for(const a of t){const r=this.placeOf(a);r&&(n++,r.island&&this.islands.has(r.island)&&e.set(r.island,(e.get(r.island)||0)+1))}let i=null,o=0;for(const[a,r]of e)r>o&&([i,o]=[a,r]);return i&&o>=2&&o>=n*.7?i:null}placeOf(t){for(const e of t.where||[]){const n=this.places.get(e.place);if(n&&fn(n.geometry))return n}return null}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}get current(){return this.chapters[this.chapter]||null}get event(){var t;return this.step>=0&&((t=this.current)==null?void 0:t.events[this.step])||null}get state(){var t;return{active:this.active,chapter:this.chapter,step:this.step,stop:this.stop,event:((t=this.event)==null?void 0:t.id)??null}}get atStart(){return this.active&&this.chapter===0&&this.step<0}get atEnd(){var o;const t=this.chapters.length;if(!t)return!0;if(!this.active)return!1;const e=this.current,n=this.event,i=n?(((o=n.stops)==null?void 0:o.length)||0)-1:-1;return this.chapter===t-1&&this.step===e.events.length-1&&this.stop>=i}nearestChapter(){return Ss(Math.round(this.app.timeline.s),0,this.chapters.length-1)}begin(){this.goTo(0,-1,{jump:!0})}next(){var e;if(!this.chapters.length)return;if(!this.active)return this.goTo(this.nearestChapter(),-1);const t=this.event;if(t&&this.stop<(((e=t.stops)==null?void 0:e.length)||0)-1)return this.goStop(this.stop+1);if(this.step<this.current.events.length-1)return this.goTo(this.chapter,this.step+1);if(this.chapter<this.chapters.length-1)return this.goTo(this.chapter+1,-1)}back(){if(this.chapters.length){if(!this.active)return this.goTo(this.nearestChapter(),-1);if(this.event&&this.stop>0)return this.goStop(this.stop-1);if(this.event&&this.stop===0)return this.goTo(this.chapter,this.step);if(this.step>0)return this.goTo(this.chapter,this.step-1,{stop:"last"});if(this.step===0)return this.goTo(this.chapter,-1);if(this.chapter>0){const t=this.chapters[this.chapter-1];return this.goTo(this.chapter-1,t.events.length-1,{stop:"last"})}}}skip(t){if(!this.chapters.length)return;const e=this.active?this.chapter:this.nearestChapter(),n=t<0&&this.active&&this.step>=0?e:e+t;n>=0&&n<this.chapters.length&&this.goTo(n,-1)}leave(){this.active&&(this.active=!1,this.notify())}locate(t){for(let e=0;e<this.chapters.length;e++){const n=this.chapters[e].events.indexOf(t);if(n>=0)return[e,n]}return null}open(t,{gentle:e=!1}={}){const n=this.locate(t);if(n)return this.goTo(n[0],n[1],{gentle:e});this.ui.pins.activeEvent=t,this.ui.pins.setStopPlace(null),this.ui.card.open(t),this.fly(this.gentleView(t))}goTo(t,e=-1,{jump:n=!1,gentle:i=!1,stop:o=-1}={}){var r;const a=this.chapters[t];if(a){if(this.active=!0,this.chapter=t,this.step=Ss(e,-1,a.events.length-1),this.stop=-1,this.step<0)this.showEra(a,n);else{const c=a.events[this.step],l=((r=c.stops)==null?void 0:r.length)||0;if(o==="last"&&l)return this.goStop(l-1,{jump:n});this.showEvent(c,{jump:n,gentle:i})}this.notify()}}applyView(t){var e;this.app.viewChosen||this.app.setView(Ew(t,(e=this.app.mahele)==null?void 0:e.sources))}showEra(t,e){const n=this.ui;this.applyView(null),n.pins.activeEvent=null,n.pins.setStopPlace(null),n.card.openEra(t);const i=t.island?this.islandView(t.island,this.homeYaw()):this.chainView();this.setS(t.index,this.fly(i,e),e)}showEvent(t,{jump:e,gentle:n}){const i=this.ui;this.applyView(t),this.prefetch(t),i.pins.activeEvent=t,i.pins.setStopPlace(null),i.card.open(t);const o=this.fly(n?this.gentleView(t):this.eventView(t),e),a=this.app.timeline,[r,c]=a.window,l=yc(t);n&&l&&l[1]>=r&&l[0]<=c||this.setYear(this.stepYear(t,this.current),o,e)}goStop(t,{jump:e=!1}={}){const n=this.event,i=(n==null?void 0:n.stops)||[];if(!n||t<-1||t>=i.length)return;const o=this.ui;this.active=!0,this.stop=t,this.applyView(n),o.pins.activeEvent=n,o.card.ev!==n&&o.card.open(n),o.card.setStop(t);const a=i[t],r=a?this.places.get(a.place):null,c=r&&fn(r.geometry);if(o.pins.setStopPlace(c?r:null),this.prefetch(n),a){const l=c?a.camera?this.cameraView(r,a.camera):this.pointView(r,Gi[a.zoom]??Gi.island):null,h=this.fly(l,e);Number.isFinite(a.year)&&this.setYear(a.year,h,e)}this.notify()}prefetch(t){const e=this.app.districts;if(e)for(const n of(t==null?void 0:t.stops)||[]){const i=this.places.get(n.place),o=i&&fn(i.geometry);if(!o||n.zoom==="far")continue;const[a,r]=this.app.data.proj.toWorld(o);if(e.prefetch(a,r))return}}stepYear(t,e){const n=this.app.timeline,i=ja(t),o=yc(t)||[i,i],a=n.yearAt(e.index-.5),r=n.yearAt(e.index+.5);return i>=a&&i<=r?i:o[1]>=a&&o[0]<=r?Ss(e.era.year,Math.max(o[0],a),Math.min(o[1],r)):i}setYear(t,e,n){this.setS(this.app.timeline.sAtYear(t),e,n)}setS(t,e,n){const i=this.ui.timeline;n?(i.tween=null,this.app.timeline.set(t)):i.easeTo(t,Ss(e*.8,.6,2.4))}homeYaw(t=this.ui.freeBox()){return this.chainView(t).yaw}tilt(){const t=this.app.rig.goal;return Ss(t.pitch-Xi(t.distance),-.3,.3)}chainView(t=this.ui.freeBox()){const e=this.app.rig,n=this.app.world.chainShape(),i=e.fit({points:n.hull,along:[n.from,n.to],box:t,reach:Jf});return e.reach(i.distance),i}islandView(t,e=this.app.rig.goal.yaw,n=0){const i=this.islands.get(t);return this.app.rig.fit({rect:i.rect,yaw:e,tilt:n,box:this.ui.freeBox()})}pointView(t,e,{towardChain:n=0}={}){let[i,o]=this.app.data.proj.toWorld(fn(t.geometry));if(n){const c=this.app.world.bounds,l=(c.x0+c.x1)/2-i,h=(c.z0+c.z1)/2-o,u=Math.min(n,900/Math.max(1,Math.hypot(l,h)));i+=l*u,o+=h*u}const a=this.ui.freeBox(),r=n?this.homeYaw(a):this.app.rig.goal.yaw;return this.app.rig.fit({rect:{x0:i,x1:i,z0:o,z1:o},distance:e,yaw:r,tilt:this.tilt(),box:a})}cameraView(t,e){const n=Array.isArray(e.target)&&e.target.length>=2&&e.target.every(Number.isFinite)?e.target:fn(t.geometry),[i,o]=this.app.data.proj.toWorld(n);return this.app.rig.fit({rect:{x0:i,x1:i,z0:o,z1:o},distance:e.distance,yaw:-e.bearing*Math.PI/180,pitch:e.pitch*Math.PI/2,box:this.ui.freeBox()})}eventView(t){const e=this.placeOf(t);if(!e)return null;const n=Au(t.zoom);return n==="near"?this.pointView(e,Gi.near):n==="island"&&this.islands.has(e.island)?this.islandView(e.island,this.app.rig.goal.yaw,this.tilt()):n==="island"?this.pointView(e,Gi.island):!e.island&&e.placePrecision==="island"?this.chainView():this.pointView(e,this.farDistance(),{towardChain:.35})}farDistance(t=this.ui.freeBox()){const e=Math.tan(this.app.camera.fov*Math.PI/360),n=Math.max(60,Math.min(t.x1-t.x0,t.y1-t.y0));return Math.max(Gi.far,bw*innerHeight/(2*e*n))}gentleView(t){const e=this.placeOf(t);if(!e)return null;const n=Gi[Au(t.zoom)];return this.pointView(e,Math.min(this.app.rig.goal.distance,Math.max(n,Gi.island)))}fly(t,e=!1){if(!t)return 1;const n=this.app.rig;if(e)return n.jump({x:t.target.x,z:t.target.z,distance:t.distance,yaw:t.yaw,pitch:t.pitch}),0;const i=n.goal,o=Math.hypot(i.target.x-t.target.x,i.target.z-t.target.z),a=Math.abs(Math.log(t.distance/Math.max(1,i.distance))),r=Ss(1.1+Math.sqrt(o)*.032+a*.28,1.1,3.4),c=this.app.districts,l=c&&t.distance<130?c.prefetch(t.target.x,t.target.z):null;return n.flyTo(t,r,l?{ready:()=>c.readyAt(t.target.x,t.target.z)}:{}),r}describe(){const t=this.chapters.length?this.chapters[this.active?this.chapter:this.nearestChapter()]:null;return t?{active:this.active,opening:this.active&&this.step<0,number:t.index+1,of:this.chapters.length,chapter:`Chapter ${t.index+1} of ${this.chapters.length}`,name:t.name,step:this.active&&this.step>=0?`${this.step+1} of ${t.events.length}`:""}:null}}const Cw=.05,Tu=.25,Cu="The land division of 1848, by ahupuaʻa",ec=new Map(Co.map(s=>[s.id,s]));class Rw{constructor(t){if(this.app=t,t.ui=this,this.build(),this.bind(),t.updaters.push(e=>this.update(e)),!t.params.has("year")&&!t.params.has("cam")&&this.tour.chapters.length)this.tour.begin(),this.timeline.el.classList.add("invite");else if(!t.params.has("cam")){const e=this.tour.chainView();t.rig.jump({x:e.target.x,z:e.target.z,distance:e.distance,yaw:e.yaw,pitch:e.pitch})}}build(){const t=this.app,e=nn("div",{id:"ui"});document.body.appendChild(e),this.root=e;const n=t.world.archPack.name;this.brand=nn("div",{class:"brand"},`<div class="brand-name">Holo i ke Au</div><div class="brand-sub"><span class="where">${wt(n)}</span><span class="loading"></span></div>`),e.appendChild(this.brand),this.tools=nn("div",{class:"tools"});const i=(a,r,c,l)=>nn("button",{class:`tool${l?" on":""}`,"data-tool":a,title:c,"aria-label":c,"aria-pressed":String(!!l)},Nn(r,20));this.tools.append(i("lines","lines","Moku and ahupuaʻa boundaries",t.overlay.lines),i("routes","routes","Every voyage, fleet and ship at sea in these years",t.overlay.routes),i("pins","pins","Events",t.overlay.pins),i("home","home","The whole chain"),i("help","help","About"),i("full","expand","Full screen")),e.appendChild(this.tools),this.legend=nn("div",{class:"legend"}),this.legend.innerHTML=`
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
        <button type="button" data-view="mahele" aria-pressed="false" title="${Cu}">Māhele</button>
      </div>
      <div class="lg-body"></div>`,this.legendBody=en(".lg-body",this.legend),this.legend.inert=!0,e.appendChild(this.legend),this.inspector=nn("div",{class:"inspector"}),e.appendChild(this.inspector),this.timeline=new xw(e,t,this),this.pins=new Mw(e,t,{onOpen:a=>this.openEvent(a),onCluster:a=>this.openCluster(a)}),this.card=new ww(e,t,this),this.tour=new Tw(t,this),t.tour=this.tour,this.tour.onChange(a=>this.timeline.refreshTour(a)),t.timeline.onChange(()=>this.timeline.refreshTour(this.tour)),this.timeline.refreshTour(this.tour),this.help=nn("div",{class:"help hidden"});const o=this.credits();this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${Nn("close",18)}</button>
        <h2>Holo i ke Au</h2>
        <p><em>Holo i ke au</em>: sail on the current, into the era. <em>Au</em> is both a period of time and a current, and the title rides it.</p>
        <p>The Hawaiian Islands from real terrain, across the eras from the first canoes to 1898. Far out, each moku takes the colour of the chiefdom or kingdom that held it; close in, the boundaries of moku and ahupuaʻa lie on the land. Pins are events of the chosen era: open one for its story, how sure the record is, and its sources. A number stands for several events in one spot; open it for the list.</p>
        <p>The switch on the legend turns the far view from the <b>Chiefdoms</b> to the <b>Land</b>: where it was cultivated, where people lived and how many, and the native forest, in the chosen year, blended between layers made for 1778, 1853, 1896 and now. A layer marked <em>modelled</em> was drawn by a written rule where no map of its time exists. From ${Ca} it turns to the <b>Māhele</b> too: each ahupuaʻa in the class the land division gave it, crown, government or konohiki land, or mixed where the records give it more than one.</p>
        <p><b>Next</b> walks the story an era at a time: each era opens with its card, then its events in order, the year and the camera moving to each. Look around as you like between steps; the timeline is free too, and Next picks the story up again from the nearest era.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> era by era</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span>
        </div>
        ${o?`<h3>Data</h3><ul class="credits">${o}</ul>`:""}
        <div class="land-credits"></div>
        <div class="mahele-credits"></div>
      </div>`,e.appendChild(this.help),this.refreshLegend()}creditable(t){return this.sourceById||(this.sourceById=new Map(this.app.data.sources.map(e=>[e.id,e]))),Sc(this.sourceById.get(t.id)||t)}credits(){var i,o;const t=this.app.data,e=new Map,n=a=>{a&&a.id&&!e.has(a.id)&&this.creditable(a)&&e.set(a.id,a)};for(const a of t.packs)for(const r of a.sources||[])n(r);for(const a of((i=t.moku)==null?void 0:i.sources)||[])n(a);for(const a of((o=t.ahupuaa)==null?void 0:o.sources)||[])n(a);return nc([...e.values()])}landCredits(){const t=en(".land-credits",this.help),e=this.app.land.manifest;if(!t||!e||t.childElementCount)return;const n=new Map;for(const i of Object.values(e.methods||{}))for(const o of Object.values(i||{}))for(const a of(o==null?void 0:o.sources)||[])a!=null&&a.id&&/^https?:/.test(a.url||"")&&!n.has(a.id)&&this.creditable(a)&&n.set(a.id,a);n.size&&(t.innerHTML=`<h3>Land layers</h3><ul class="credits">${nc([...n.values()])}</ul>`)}maheleCredits(){const t=en(".mahele-credits",this.help),e=this.app.mahele.sources;if(!t||!e||t.childElementCount)return;const n=new Map(this.app.data.sources.map(o=>[o.id,o])),i=[...e].map(o=>n.get(o)).filter(o=>Sc(o));i.length&&(t.innerHTML=`<h3>The Māhele</h3><ul class="credits">${nc(i)}</ul>`)}bind(){const t=this.app;this.tools.addEventListener("click",i=>{var r,c,l;const o=i.target.closest("[data-tool]");if(!o)return;const a=o.dataset.tool;if(a==="help")this.help.classList.toggle("hidden");else if(a==="full")document.fullscreenElement?(r=document.exitFullscreen)==null||r.call(document):(l=(c=document.documentElement).requestFullscreen)==null||l.call(c).catch(()=>{});else if(a==="home"){const h=t.rig;h.home=this.tour.chainView(),h.flyTo({target:h.home.target,distance:h.home.distance,yaw:h.home.yaw,pitch:h.home.pitch},3)}else a in t.overlay&&(t.overlay[a]=!t.overlay[a],o.classList.toggle("on",t.overlay[a]),o.setAttribute("aria-pressed",String(t.overlay[a])))}),this.legend.addEventListener("click",i=>{const o=i.target.closest("[data-view]");if(!o||o.disabled)return;const a=o.dataset.view;t.setView(t.farView===a?null:a,{user:!0})}),t.onView(()=>this.refreshLegend()),t.land.onChange(()=>{this.refreshLegend(),this.landCredits()}),t.mahele.onChange(()=>{this.refreshLegend(),this.maheleCredits();const i=this.tour;i.active&&i.event&&i.applyView(i.event)}),this.help.addEventListener("click",i=>{(i.target===this.help||i.target.closest(".help-close"))&&this.help.classList.add("hidden")}),t.timeline.onChange(()=>{(t.timeline.era!==this.legendEra||t.mahele.availableAt()!==this.legendMahele)&&this.refreshLegend()});const e=t.canvas;let n=0;e.addEventListener("pointermove",i=>{if(i.buttons||i.pointerType==="touch")return this.hover(null);const o=performance.now();o-n<70||(n=o,this.hover(i.clientX,i.clientY))}),e.addEventListener("pointerleave",()=>this.hover(null)),e.addEventListener("pointerdown",()=>this.hover(null)),addEventListener("keydown",i=>{var a,r,c,l;if(i.key==="Escape"){this.help.classList.contains("hidden")?this.card.close():this.help.classList.add("hidden");return}if((r=(a=i.target).closest)!=null&&r.call(a,"input, textarea, select")||i.altKey||i.ctrlKey||i.metaKey||!this.help.classList.contains("hidden"))return;const o=this.tour;i.key==="ArrowRight"||i.key===" "&&!((l=(c=i.target).closest)!=null&&l.call(c,"button, a"))?(i.preventDefault(),this.timeline.el.classList.remove("invite"),o.next()):i.key==="ArrowLeft"?(i.preventDefault(),o.back()):i.key===","||i.key==="<"?o.skip(-1):(i.key==="."||i.key===">")&&o.skip(1)})}openEvent(t){this.tour.open(t,{gentle:!0})}openCluster(t){const e=this.tour;this.pins.activeEvent=e.active?e.event:null,this.card.openList(t)}onCardClosed(){const t=this.tour;t.active&&t.event||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}onScrub(t=this.app.timeline.s){var i;this.tour.leave();const n=this.app.timeline;this.card.mode==="era"&&((i=this.card.chapter)==null?void 0:i.era)!==n.eras[Math.round(Math.max(0,Math.min(n.max,t)))]&&this.card.close(),this.card.ev||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}freeBox(){const t=innerWidth,e=innerHeight,n={x0:16,y0:72,x1:t-16,y1:e-16},i=this.timeline.el;!i.hidden&&i.offsetHeight&&(n.y1=Math.min(n.y1,i.offsetTop-14));const o=this.card.el;if(this.syncCarded(),this.card.isOpen&&o.offsetWidth)if(o.offsetLeft>t*.35)n.x1=Math.min(n.x1,o.offsetLeft-16);else{n.y1=Math.min(n.y1,o.offsetTop-12);const a=this.legend;a.offsetHeight&&a.offsetTop<e/3&&(n.y0=Math.max(n.y0,a.offsetTop+a.offsetHeight+6))}return n.y1-n.y0<120&&(n.y1=n.y0+120),n}syncCarded(){const t=this.card.isOpen;t!==this.root.classList.contains("carded")&&this.root.classList.toggle("carded",t)}farStrength(t=this.app.rig.state.distance){const e=this.app.farView;return e==="land"||e==="mahele"?La(t):wc(t)}inspectorAllowed(){var i,o;const t=this.app,e=this.farStrength();return!!((i=t.districts)!=null&&i.on||((o=t.districts)==null?void 0:o.k)>0)||e<Cw?this.nearHeld=!0:e>Tu&&(this.nearHeld=!1),!this.nearHeld}hideInspector(){this.app.shared.uniforms.uHoverMoku.value=0,this.inspector.classList.remove("show"),this.inspectorKey=null}hover(t,e){var p;const n=this.app,i=n.shared.uniforms;if(t==null||!this.inspectorAllowed())return this.hideInspector();const o=n.rig.pickGround(t,e),a=o&&n.world.metresAt(o.x,o.z)>0?n.polity.mokuAt(o.x,o.z):null,r=n.farView,c=r==="land"&&n.landK>.25,l=r==="mahele"&&n.regionOn==="mahele"&&n.polityK>.25,h=wc(n.rig.state.distance)<.05;if(i.uHoverMoku.value=a&&!c&&!h&&n.regionOn==="chiefdoms"?a.index:0,!a){this.inspector.classList.remove("show");return}const u=c?n.land.valuesAt(o.x,o.z):null,f=l?n.mahele.unitAt(o.x,o.z):null,m=`${a.index}:${(p=n.timeline.era)==null?void 0:p.id}:${u?JSON.stringify(u):""}:${f?f.gisId:""}`;if(this.inspectorKey!==m){this.inspectorKey=m;const d=n.polity.holder(n.timeline.era,a),v=(M,S)=>`<div class="in-row"><span class="in-k">${M}</span>${S}</div>`;this.inspector.innerHTML=f?Lw(f,a,v):`
        <div class="in-head"><b>${wt(a.name)}</b><span class="in-island">${wt(a.island||"")}</span></div>
        ${v("moku",d?`<span class="in-pol"><i style="background:${wt(d.colour)}"></i>${wt(d.name)}</span>`:'<span class="in-none">no polity recorded</span>')}
        ${u?v("fields",Ru(u.cultivation))+v("people",Pw(u.people))+v("forest",Ru(u.forest)):""}`}this.inspector.classList.add("show");const g=Math.min(innerWidth-250,t+18),x=Math.max(70,Math.min(innerHeight-120,e+18));this.inspector.style.transform=`translate(${g}px, ${x}px)`}refreshLegend(){const t=this.app,e=t.timeline.era;this.legendEra=e,this.legendMahele=t.mahele.availableAt();const n=t.farView;for(const r of this.legend.querySelectorAll("[data-view]"))r.setAttribute("aria-pressed",String(n===r.dataset.view)),r.classList.toggle("on",n===r.dataset.view);const i=en('[data-view="land"]',this.legend);i.disabled=t.land.available===!1,i.title=i.disabled?"No land layers in this data":"Cultivation, settlement and forest in the chosen year";const o=en('[data-view="mahele"]',this.legend);o.disabled=!this.legendMahele,o.title=t.mahele.available===!1?"No Māhele in this data":this.legendMahele?Cu:`The land division, from ${Ca}`;let a="";if(n==="mahele"){const r=this.islandInView(),c=t.mahele.counts(r==null?void 0:r.pack.id);c.all&&(a=`<div class="lg-title">The Māhele of ${Ca}</div>${Co.map(l=>`<div class="lg lg-mahele"><i style="background:${wt(l.colour)}"></i><b>${wt(l.name)}</b><em>${c.byClass[l.id].toLocaleString("en-US")}</em></div>`).join("")}<div class="lg-note">${wt(`${c.all.toLocaleString("en-US")} ahupuaʻa ${r?`on ${r.pack.name}`:"on all the islands"}`)}</div>`),this.legendIsland=(r==null?void 0:r.pack.id)??null}else if(n==="chiefdoms"){const r=t.polity.politiesIn(e);r.length&&(a=`<div class="lg-title">${wt((e==null?void 0:e.label)||"")}</div>${r.map(c=>`<div class="lg"><i style="background:${wt(c.colour)}"></i><b>${wt(c.name)}</b></div>`).join("")}`)}else if(n==="land"){const r=t.land.describe();if(this.legendLand=JSON.stringify(r),r){const c=r.years.length>1?`between the ${r.years[0]} and ${r.years[1]} layers`:`the ${r.years[0]} layers`,l=t.land.bound?r.early?`${c}, thinned for the early centuries`:c:"the layers are on their way";a=`<div class="lg-title">${wt((e==null?void 0:e.label)||"")}</div>${r.layers.map(h=>`<div class="lg lg-land"><i class="sw-${h.id}"></i><b>${wt(h.name)}</b>${h.note?`<em>${wt(h.note)}</em>`:""}</div>`).join("")}<div class="lg-note">${wt(l)}</div>`}}this.legendBody.innerHTML=a}setLoading(t){en(".loading",this.brand).textContent=t||""}update(t){const e=this.app,n=performance.now();this.timeline.update(t),this.pins.update(e.overlay.pins);const i=this.farStrength()>Tu;if(i!==this.legend.classList.contains("show")&&(this.legend.classList.toggle("show",i),this.legend.inert=!i),!this.inspectorAllowed()&&(this.inspector.classList.contains("show")||e.shared.uniforms.uHoverMoku.value)&&this.hideInspector(),this.syncCarded(),e.farView==="land"&&n-(this.landAt||0)>250&&(this.landAt=n,(JSON.stringify(e.land.describe())!==this.legendLand||!e.land.bound!==this.legendWaiting)&&(this.legendWaiting=!e.land.bound,this.refreshLegend())),n-(this.whereAt||0)>300){this.whereAt=n;const o=this.islandInView();en(".where",this.brand).textContent=o?o.pack.name:e.world.archPack.name,e.farView==="mahele"&&((o==null?void 0:o.pack.id)??null)!==this.legendIsland&&this.refreshLegend()}}islandInView(){const t=this.app.rig.state;return t.distance<1400?this.app.world.islandAt(t.target.x,t.target.z):null}}function Lw(s,t,e){const n=s.entry,i=ec.get(s.cls),o=l=>`<i style="background:${wt(l.colour)}"></i>`;let a=`<span class="in-pol">${o(i)}${wt(i.name)}</span>`;if(s.cls==="mixed"){const l=[...new Set(((n==null?void 0:n.parts)||[]).map(h=>h.class))].map(h=>ec.get(h)).filter(Boolean);l.length>1&&(a=`<span class="in-pol">${o(i)}${wt(i.name)}</span><span class="in-v">${wt(l.map(h=>h.name.toLowerCase()).join(" and "))}</span>`)}const r=n&&(s.cls==="konohiki"||s.cls==="mixed")?[].concat(n.awardee||[]).filter(Boolean):[],c=((n==null?void 0:n.later)||[]).map(l=>{var h;return`${((h=ec.get(l.class))==null?void 0:h.name.toLowerCase())||l.class}, ${l.year}`});return`
    <div class="in-head"><b>${wt(s.name||"Ahupuaʻa")}</b><span class="in-island">${wt(s.island||t.island||"")}</span></div>
    ${e("moku",`<span class="in-v">${wt(s.moku||t.name)}</span>`)}
    ${e("land",a)}
    ${r.length?e("awarded",`<span class="in-v">${wt(r.join(", "))}</span>`):""}
    ${c.length?e("later",`<span class="in-v">${wt(c.join("; "))}</span>`):""}`}function Ru(s){const t=s*100;return t<.5?'<span class="in-none">none</span>':t<1?"under 1%":`${Math.round(t)}%`}function Pw(s){return s<.5?'<span class="in-none">none</span>':`about ${(s<10?Math.round(s):Number(s.toPrecision(2))).toLocaleString("en-US")} a km²`}function nc(s){return s.map(t=>`<li>${t.url&&/^https?:/.test(t.url)?`<a href="${wt(t.url)}" target="_blank" rel="noopener">${wt(t.title||t.id)}</a>`:wt(t.title||t.id)}${t.licence?` <em>${wt(t.licence)}</em>`:""}${t.fetched?` <em>fetched ${wt(t.fetched)}</em>`:""}</li>`).join("")}const Ya=document.getElementById("boot"),sd=Ya.querySelector(".boot-bar span"),od=Ya.querySelector(".boot-stage"),wa=(s,t)=>{od.textContent=s,sd.style.width=`${Math.round(t*100)}%`},Rs=s=>{console.warn(s)};async function Dw(){const s=performance.now();wa("reading the gazetteer",.05);const t=await _d(dd(),Rs);if(!t.packs.length)throw new Error("the manifest lists no packs");const e=new gw(document.getElementById("scene"),t,{warn:Rs});window.__app=e;const n=new wd(2,Rs);wa("raising the islands",.25);const i=e.world.archPack;i.data=await n.decode(i),wa("placing the boundaries",.8),await new Promise(c=>setTimeout(c,0)),e.start();const o=new Rw(e);e.ui=o,console.log(`archipelago ready in ${((performance.now()-s)/1e3).toFixed(1)} s`),wa("",1);let a=0;const r=()=>{if(++a<4)return requestAnimationFrame(r);Ya.classList.add("gone"),setTimeout(()=>Ya.remove(),1200),Iw(e,o,n),e.patches.load().catch(c=>{Rs(`patches: ${c.message}`),e.patches.resolveReady([])}),e.districts.load().catch(c=>Rs(`districts: ${c.message}`))};requestAnimationFrame(r)}async function Iw(s,t,e){const n=s.rig.state.target,i=r=>Math.hypot((r.rect.x0+r.rect.x1)/2-n.x,(r.rect.z0+r.rect.z1)/2-n.z),o=[...s.world.islandPacks].sort((r,c)=>i(r)-i(c));let a=0;t.setLoading(o.length?`· ${o.length} islands to come`:""),await Promise.all(o.map(async r=>{try{r.data=await e.decode(r),s.addIsland(r)}catch(c){Rs(`${r.id}: ${c.message}`)}a++,t.setLoading(a<o.length?`· ${o.length-a} islands to come`:"")})),e.dispose(),s.islandsLoaded=!0,s.land.load()}Dw().catch(s=>{console.error(s),od.textContent="something went wrong — see the console",sd.style.background="#c0584a"});
