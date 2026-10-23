var cd=Object.defineProperty;var ld=(o,t,e)=>t in o?cd(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var Zs=(o,t,e)=>ld(o,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();const Bs=100,hd=8,Yc=9e3,Eo=1.3,ud=5.5,Kc=100,fd=6e3;function Zc(o){const t=Math.log(Math.max(1,o)/Kc)/Math.log(fd/Kc),e=Math.max(0,Math.min(1,t));return Eo+(ud-Eo)*e*e*(3-2*e)}const Pu=2,Vn=5,Fs=32,Yn=16,Du=1.6,Ee={far:115,near:75,rig:[95,135],margin:7,band:.5,prefetch:320,linger:25,hold:90},dd=.024;function pd(){const t=new URLSearchParams(location.search).get("data")||"./data/";return t.endsWith("/")?t:`${t}/`}const md=Math.PI/180;class gd{constructor({lat0:t=20.5,lon0:e=-157.5}={}){this.lat0=t,this.lon0=e,this.kx=Math.cos(t*md)*111320/Bs,this.kz=110574/Bs}x(t){return(t-this.lon0)*this.kx}z(t){return-(t-this.lat0)*this.kz}toWorld(t){return[this.x(t[0]),this.z(t[1])]}toLonLat(t,e){return[t/this.kx+this.lon0,-e/this.kz+this.lat0]}rect([t,e,n,i]){return{x0:this.x(t),z0:this.z(i),x1:this.x(n),z1:this.z(e)}}}function Ea(o){return String(o||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[ʻʼ‘’'`]/g,"").toLowerCase().replace(/[^a-z]/g,"")}function fn(o){if(!o)return null;if(o.type==="Point")return o.coordinates;if(o.type==="LineString")return o.coordinates[Math.floor(o.coordinates.length/2)];if(o.type==="MultiPoint")return o.coordinates[0];const t=o.type==="Polygon"?[o.coordinates[0]]:o.type==="MultiPolygon"?o.coordinates.map(s=>s[0]):null;if(!t)return null;let e=0,n=0,i=0;for(const s of t)for(let a=0,r=s.length-1;a<s.length;r=a++){const c=s[r][0]*s[a][1]-s[a][0]*s[r][1];e+=c,n+=(s[r][0]+s[a][0])*c,i+=(s[r][1]+s[a][1])*c}return Math.abs(e)<1e-12?t[0][0]:[n/(3*e),i/(3*e)]}async function Zn(o){var l;const t=await fetch(o);if(!t.ok)throw new Error(`${o}: HTTP ${t.status}`);const e=await t.blob(),n=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),i=n.width,s=n.height;let a;typeof OffscreenCanvas<"u"?a=new OffscreenCanvas(i,s):(a=document.createElement("canvas"),a.width=i,a.height=s);const r=a.getContext("2d",{willReadFrequently:!0});r.imageSmoothingEnabled=!1,r.drawImage(n,0,0);const c=r.getImageData(0,0,i,s).data;return(l=n.close)==null||l.call(n),{px:c,W:i,H:s}}function Iu(o,t,e,n,i,s=4){const a=new Float32Array(t*e);for(let r=0,c=0;r<t*e;r++,c+=s)a[r]=(o[c]*256+o[c+1])*n+i;return a}function ku(o,t,e,n=4){const i=new Uint8Array(t*e);for(let s=0,a=0;s<t*e;s++,a+=n)i[s]=o[a];return i}function vd(o){let t=0,e=0;for(let n=0;n<o.length;n+=7)o[n]>0||(t++,o[n]>-1.6&&e++);return t>100&&e>t*.95}function xd(o,t,e,n,i){const s=hn(t,e,a=>o[a]>0,n,i);for(let a=0;a<o.length;a++){if(o[a]>0)continue;const r=s[a]/1e3;o[a]=-(1+30*r+3600*(1-Math.exp(-Math.max(0,r-.6)/6)))}}function zn(o,t,e,n,i=1){let s=Float32Array.from(o);const a=new Float32Array(t*e),r=1/(2*n+1);for(let c=0;c<i;c++){for(let l=0;l<e;l++){const h=l*t;let u=0;for(let f=-n;f<=n;f++)u+=s[h+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)a[h+f]=u*r,u+=s[h+Math.min(t-1,f+n+1)]-s[h+Math.max(0,f-n)]}for(let l=0;l<t;l++){let h=0;for(let u=-n;u<=n;u++)h+=a[Math.min(e-1,Math.max(0,u))*t+l];for(let u=0;u<e;u++)s[u*t+l]=h*r,h+=a[Math.min(e-1,u+n+1)*t+l]-a[Math.max(0,u-n)*t+l]}}return s}function Jc(o,t,e,n,i,s){const a=s*s;let r=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let c=1;c<t;c++){let l=(o[c]+c*c*a-(o[n[r]]+n[r]*n[r]*a))/(2*a*(c-n[r]));for(;l<=i[r];)r--,l=(o[c]+c*c*a-(o[n[r]]+n[r]*n[r]*a))/(2*a*(c-n[r]));r++,n[r]=c,i[r]=l,i[r+1]=1/0}r=0;for(let c=0;c<t;c++){for(;i[r+1]<c;)r++;const l=(c-n[r])*s;e[c]=l*l+o[n[r]]}}function hn(o,t,e,n=1,i=1){const a=new Float64Array(o*t);for(let p=0;p<o*t;p++)a[p]=e(p)?0:1e20;const r=Math.max(o,t),c=new Float64Array(r),l=new Float64Array(r),h=new Int32Array(r),u=new Float64Array(r+1);for(let p=0;p<o;p++){for(let g=0;g<t;g++)c[g]=a[g*o+p];Jc(c,t,l,h,u,i);for(let g=0;g<t;g++)a[g*o+p]=l[g]}const f=new Float32Array(o*t);for(let p=0;p<t;p++){const g=p*o;for(let v=0;v<o;v++)c[v]=a[g+v];Jc(c,o,l,h,u,n);for(let v=0;v<o;v++)f[g+v]=Math.sqrt(l[v])}return f}function Uu(o,t,e,n,i){const s=Math.max(1,Math.round(Math.max(t,e)/512)),a=Math.ceil(t/s),r=Math.ceil(e/s),c=new Float32Array(a*r);for(let f=0;f<r;f++)for(let p=0;p<a;p++){let g=0,v=0;for(let m=f*s;m<Math.min(e,(f+1)*s);m++)for(let d=p*s;d<Math.min(t,(p+1)*s);d++)g+=Math.max(0,o[m*t+d]),v++;c[f*a+p]=g/v*Eo}const l=new Float32Array(a*r),h=[1,2,3,5,7,10,14,19,26,34],u=[];for(let f=0;f<8;f++)u.push([Math.cos(f*Math.PI/4),Math.sin(f*Math.PI/4)]);for(let f=0;f<r;f++)for(let p=0;p<a;p++){const g=c[f*a+p];if(g<=0){l[f*a+p]=1;continue}let v=0;for(const[m,d]of u){let x=0;const M=Math.hypot(m*n,d*i)*s;for(const b of h){const _=Math.round(p+m*b),S=Math.round(f+d*b);if(_<0||S<0||_>=a||S>=r)break;const E=(c[S*a+_]-g)/(b*M);E>x&&(x=E)}v+=x/Math.sqrt(1+x*x)}l[f*a+p]=1-v/8*.95}return{data:l,w:a,h:r,f:s}}function zu(o,t,e,n,i,s){const a=new Uint8Array(t*e*4),r=Pu;for(let c=0;c<e;c++){const l=Math.max(0,c-1),h=Math.min(e-1,c+1);for(let u=0;u<t;u++){const f=c*t+u,p=Math.max(0,u-1),g=Math.min(t-1,u+1),v=(o[c*t+g]-o[c*t+p])/((g-p)*n),m=(o[h*t+u]-o[l*t+u])/((h-l)*i),d=-v*r,x=-m*r,M=Math.hypot(d,1,x);a[f*4]=Math.round((d/M*.5+.5)*255),a[f*4+1]=Math.round((1/M*.5+.5)*255),a[f*4+2]=Math.round((x/M*.5+.5)*255);let b=1;if(s){const _=Math.min(s.w-1.001,Math.max(0,(u+.5)/s.f-.5)),S=Math.min(s.h-1.001,Math.max(0,(c+.5)/s.f-.5)),E=_|0,A=S|0,w=_-E,y=S-A,T=A*s.w+E,L=s.data,I=Math.min(s.w-1,E+1)-E,R=Math.min(s.h-1,A+1)-A,k=L[T]+(L[T+I]-L[T])*w,F=L[T+R*s.w]+(L[T+R*s.w+I]-L[T+R*s.w])*w;b=k+(F-k)*y}a[f*4+3]=Math.round(Math.max(0,Math.min(1,b))*255)}}return a}function Fu(o,t,e,n,i){const s=t*e,a=n*i/1e6,r=new Float32Array(s);let c=0,l=0;for(let m=0;m<s;m++)o[m]>0&&(r[m]=a,o[m]>c&&(c=o[m]),l++);if(!l)return r;const h=Math.min(65536,Math.ceil(c)+2),u=m=>Math.min(h-1,Math.floor(m/c*(h-2))),f=new Uint32Array(h+1);for(let m=0;m<s;m++)o[m]>0&&f[u(o[m])+1]++;for(let m=0;m<h;m++)f[m+1]+=f[m];const p=new Uint32Array(l),g=f.slice();for(let m=0;m<s;m++)o[m]>0&&(p[g[u(o[m])]++]=m);const v=Math.hypot(n,i);for(let m=l-1;m>=0;m--){const d=p[m],x=d%t,M=(d-x)/t,b=o[d];let _=-1,S=0;for(let E=-1;E<=1;E++){const A=M+E;if(!(A<0||A>=e))for(let w=-1;w<=1;w++){if(!w&&!E)continue;const y=x+w;if(y<0||y>=t)continue;const T=A*t+y,L=(b-o[T])/(w&&E?v:w?n:i);L>S&&(S=L,_=T)}}_>=0&&o[_]>0&&(r[_]+=r[d])}return r}function Md(o,t,e,n,i,s){const a=e*n,r=new Uint8Array(a*4),c=Fu(o,e,n,i,s),l=i*s/1e6,h=Math.max(.04,4*l),u=new Float32Array(a);for(let d=0;d<a;d++)u[d]=o[d]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,c[d])/h)/1.6)):0;const f=zn(u,e,n,1,2),p=hn(e,n,d=>o[d]<=0,i,s),g=new Float32Array(a);for(let d=0;d<n;d++)for(let x=0;x<e;x++){const M=d*e+x;if(o[M]<=0||o[M]>9)continue;const b=Math.min(e-1,x+1),_=Math.max(0,x-1),S=Math.min(n-1,d+1),E=Math.max(0,d-1),A=Math.hypot((o[d*e+b]-o[d*e+_])/((b-_)*i),(o[S*e+x]-o[E*e+x])/((S-E)*s));g[M]=p[M]<260+Math.max(i,s)&&A<.12?1:0}const v=zn(g,e,n,1,1),m=1.5*Math.min(1,70/Math.max(i,s));for(let d=0;d<a;d++)r[d*4]=t?t[d]:o[d]>0?82:0,r[d*4+1]=Math.round(255*Math.min(1,v[d]*m)),r[d*4+2]=Math.round(255*Math.min(1,f[d]*1.6)),r[d*4+3]=0;return r}function yd({heightPx:o,rainPx:t,W:e,H:n,scale:i,offset:s,mx:a,mz:r,stride:c=4}){const l=Iu(o,e,n,i,s,c),h=vd(l);h&&xd(l,e,n,a,r);const u=t?ku(t,e,n,c):null,f=Uu(l,e,n,a,r),p=zu(l,e,n,a,r,f),g=Md(l,u,e,n,a,r);let v=1/0,m=-1/0;for(let d=0;d<l.length;d++)l[d]<v&&(v=l[d]),l[d]>m&&(m=l[d]);return{metres:l,normals:p,land:g,flatSea:h,lo:v,hi:m}}async function yi(o,t,e){try{const n=await fetch(o);if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}catch(n){if(t===void 0)throw new Error(`${o}: ${n.message}`);return e==null||e(`${o}: ${n.message} (carrying on without it)`),t}}const No=(o,t)=>Array.isArray(o)?o:Array.isArray(o==null?void 0:o[t])?o[t]:[];async function _d(o,t=console.warn){const e=p=>new URL(p,new URL(o,location.href)).href,n=await yi(e("manifest.json")),[i,s,a,r,c,l,h]=await Promise.all([yi(e("boundaries/moku.geojson"),null,t),yi(e("boundaries/ahupuaa.geojson"),null,t),yi(e("eras.json"),[],t),yi(e("places.json"),[],t),yi(e("events.json"),[],t),yi(e("sources.json"),[],t),yi(e("polities.json"),{polities:[],byEra:{}},t)]),u=new gd(n.projection||{}),f=(n.packs||[]).map(p=>wd(p,u,e));return{base:o,abs:e,manifest:n,proj:u,packs:f,moku:i,ahupuaa:s,eras:No(a,"eras"),places:No(r,"places"),events:No(c,"events"),sources:No(l,"sources"),polities:{polities:(h==null?void 0:h.polities)||[],byEra:(h==null?void 0:h.byEra)||{}}}}function wd(o,t,e){var a;const n=t.rect(o.bounds),[i,s]=o.size;return{id:o.id,kind:o.kind,name:o.name||o.id,desc:o,rect:n,W:i,H:s,mx:(n.x1-n.x0)*Bs/i,mz:(n.z1-n.z0)*Bs/s,heightUrl:e(o.height.file),rainUrl:(a=o.rain)!=null&&a.file?e(o.rain.file):null,scale:o.height.scale??.25,offset:o.height.offset??-6e3,sources:o.sources||[],data:null}}class bd{constructor(t=2,e=console.warn){this.warn=e,this.jobs=new Map,this.next=1,this.workers=[],this.free=[],this.queue=[];try{for(let n=0;n<t;n++){const i=new Worker(new URL(""+new URL("worker-D-2AoFNa.js",import.meta.url).href,import.meta.url),{type:"module"});i.onmessage=s=>this.message(i,s.data),i.onerror=s=>{var a;(a=s.preventDefault)==null||a.call(s),this.fallback=!0;for(const[r,c]of this.jobs)c.worker===i&&this.mainThread(r,c)},this.workers.push(i),this.free.push(i)}}catch{this.fallback=!0}}decode(t){return new Promise((e,n)=>{const i=this.next++,s={pack:t,resolve:e,reject:n};this.jobs.set(i,s),this.fallback||!this.workers.length?this.mainThread(i,s):(this.queue.push(i),this.pump())})}pump(){for(;this.free.length&&this.queue.length;){const t=this.queue.shift(),e=this.jobs.get(t),n=this.free.pop();e.worker=n;const i=e.pack;n.postMessage({job:t,heightUrl:i.heightUrl,rainUrl:i.rainUrl,W:i.W,H:i.H,scale:i.scale,offset:i.offset,mx:i.mx,mz:i.mz})}}message(t,e){const n=this.jobs.get(e.job);if(n){if(e.warn)return this.warn(e.warn);this.jobs.delete(e.job),this.free.push(t),e.ok?n.resolve(e):/OffscreenCanvas|getContext|createImageBitmap/i.test(e.message)?(this.fallback=!0,this.jobs.set(e.job,n),this.mainThread(e.job,n)):n.reject(new Error(e.message)),this.pump()}}async mainThread(t,e){try{const n=e.pack,i=await Zn(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);let s=null;n.rainUrl&&(s=await Zn(n.rainUrl).then(r=>r.W===n.W&&r.H===n.H?r.px:null).catch(()=>null));const a=yd({heightPx:i.px,rainPx:s,W:n.W,H:n.H,scale:n.scale,offset:n.offset,mx:n.mx,mz:n.mz});this.jobs.delete(t),e.resolve(a)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){for(const t of this.workers)t.terminate()}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ac="160",Sd=0,Qc=1,Ed=2,Nu=1,Ad=2,ri=3,xi=0,rn=1,Bn=2,vi=0,Ns=1,sc=2,tl=3,oc=4,Td=5,qi=100,Cd=101,Rd=102,el=103,nl=104,Ld=200,Pd=201,Dd=202,Id=203,ac=204,rc=205,kd=206,Ud=207,zd=208,Fd=209,Nd=210,Od=211,Bd=212,Wd=213,Gd=214,Hd=0,Vd=1,$d=2,Ia=3,Xd=4,jd=5,qd=6,Yd=7,Ou=0,Kd=1,Zd=2,Ri=0,Jd=1,Qd=2,tp=3,ep=4,np=5,ip=6,Bu=300,Ws=301,Gs=302,cc=303,lc=304,Ja=306,ka=1e3,on=1001,hc=1002,ie=1003,il=1004,lr=1005,We=1006,sp=1007,is=1008,de=1009,op=1010,ap=1011,Tc=1012,Wu=1013,di=1014,pi=1015,Li=1016,Gu=1017,Hu=1018,ts=1020,rp=1021,Ae=1023,cp=1024,lp=1025,es=1026,Hs=1027,Pi=1028,Vu=1029,$u=1030,Xu=1031,ju=1033,hr=33776,ur=33777,fr=33778,dr=33779,sl=35840,ol=35841,al=35842,rl=35843,qu=36196,cl=37492,ll=37496,hl=37808,ul=37809,fl=37810,dl=37811,pl=37812,ml=37813,gl=37814,vl=37815,xl=37816,Ml=37817,yl=37818,_l=37819,wl=37820,bl=37821,pr=36492,Sl=36494,El=36495,hp=36283,Al=36284,Tl=36285,Cl=36286,Yu=3e3,ns=3001,up=3200,fp=3201,dp=0,pp=1,Rn="",Be="srgb",Mi="srgb-linear",Cc="display-p3",Qa="display-p3-linear",Ua="linear",fe="srgb",za="rec709",Fa="p3",cs=7680,Rl=519,mp=512,gp=513,vp=514,Ku=515,xp=516,Mp=517,yp=518,_p=519,Ll=35044,wn=35048,Pl="300 es",uc=1035,mi=2e3,Na=2001;class $s{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Dl=1234567;const mo=Math.PI/180,Ao=180/Math.PI;function Xs(){const o=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Xe[o&255]+Xe[o>>8&255]+Xe[o>>16&255]+Xe[o>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]).toLowerCase()}function sn(o,t,e){return Math.max(t,Math.min(e,o))}function Rc(o,t){return(o%t+t)%t}function wp(o,t,e,n,i){return n+(o-t)*(i-n)/(e-t)}function bp(o,t,e){return o!==t?(e-o)/(t-o):0}function go(o,t,e){return(1-e)*o+e*t}function Sp(o,t,e,n){return go(o,t,1-Math.exp(-e*n))}function Ep(o,t=1){return t-Math.abs(Rc(o,t*2)-t)}function Ap(o,t,e){return o<=t?0:o>=e?1:(o=(o-t)/(e-t),o*o*(3-2*o))}function Tp(o,t,e){return o<=t?0:o>=e?1:(o=(o-t)/(e-t),o*o*o*(o*(o*6-15)+10))}function Cp(o,t){return o+Math.floor(Math.random()*(t-o+1))}function Rp(o,t){return o+Math.random()*(t-o)}function Lp(o){return o*(.5-Math.random())}function Pp(o){o!==void 0&&(Dl=o);let t=Dl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Dp(o){return o*mo}function Ip(o){return o*Ao}function fc(o){return(o&o-1)===0&&o!==0}function kp(o){return Math.pow(2,Math.ceil(Math.log(o)/Math.LN2))}function Oa(o){return Math.pow(2,Math.floor(Math.log(o)/Math.LN2))}function Up(o,t,e,n,i){const s=Math.cos,a=Math.sin,r=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),u=s((t-n)/2),f=a((t-n)/2),p=s((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":o.set(r*h,c*u,c*f,r*l);break;case"YZY":o.set(c*f,r*h,c*u,r*l);break;case"ZXZ":o.set(c*u,c*f,r*h,r*l);break;case"XZX":o.set(r*h,c*g,c*p,r*l);break;case"YXY":o.set(c*p,r*h,c*g,r*l);break;case"ZYZ":o.set(c*g,c*p,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function As(o,t){switch(t.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function Je(o,t){switch(t.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}const qe={DEG2RAD:mo,RAD2DEG:Ao,generateUUID:Xs,clamp:sn,euclideanModulo:Rc,mapLinear:wp,inverseLerp:bp,lerp:go,damp:Sp,pingpong:Ep,smoothstep:Ap,smootherstep:Tp,randInt:Cp,randFloat:Rp,randFloatSpread:Lp,seededRandom:Pp,degToRad:Dp,radToDeg:Ip,isPowerOfTwo:fc,ceilPowerOfTwo:kp,floorPowerOfTwo:Oa,setQuaternionFromProperEuler:Up,normalize:Je,denormalize:As};class Vt{constructor(t=0,e=0){Vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(sn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*i+t.x,this.y=s*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qt{constructor(t,e,n,i,s,a,r,c,l){Qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,a,r,c,l)}set(t,e,n,i,s,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=i,h[2]=r,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,a=n[0],r=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],p=n[5],g=n[8],v=i[0],m=i[3],d=i[6],x=i[1],M=i[4],b=i[7],_=i[2],S=i[5],E=i[8];return s[0]=a*v+r*x+c*_,s[3]=a*m+r*M+c*S,s[6]=a*d+r*b+c*E,s[1]=l*v+h*x+u*_,s[4]=l*m+h*M+u*S,s[7]=l*d+h*b+u*E,s[2]=f*v+p*x+g*_,s[5]=f*m+p*M+g*S,s[8]=f*d+p*b+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-n*s*h+n*r*c+i*s*l-i*a*c}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*a-r*l,f=r*c-h*s,p=l*s-a*c,g=e*u+n*f+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(i*l-h*n)*v,t[2]=(r*n-i*a)*v,t[3]=f*v,t[4]=(h*e-i*c)*v,t[5]=(i*s-r*e)*v,t[6]=p*v,t[7]=(n*c-l*e)*v,t[8]=(a*e-n*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,a,r){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*r)+a+t,-i*l,i*c,-i*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(mr.makeScale(t,e)),this}rotate(t){return this.premultiply(mr.makeRotation(-t)),this}translate(t,e){return this.premultiply(mr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const mr=new Qt;function Zu(o){for(let t=o.length-1;t>=0;--t)if(o[t]>=65535)return!0;return!1}function Ba(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function zp(){const o=Ba("canvas");return o.style.display="block",o}const Il={};function vo(o){o in Il||(Il[o]=!0,console.warn(o))}const kl=new Qt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ul=new Qt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Oo={[Mi]:{transfer:Ua,primaries:za,toReference:o=>o,fromReference:o=>o},[Be]:{transfer:fe,primaries:za,toReference:o=>o.convertSRGBToLinear(),fromReference:o=>o.convertLinearToSRGB()},[Qa]:{transfer:Ua,primaries:Fa,toReference:o=>o.applyMatrix3(Ul),fromReference:o=>o.applyMatrix3(kl)},[Cc]:{transfer:fe,primaries:Fa,toReference:o=>o.convertSRGBToLinear().applyMatrix3(Ul),fromReference:o=>o.applyMatrix3(kl).convertLinearToSRGB()}},Fp=new Set([Mi,Qa]),le={enabled:!0,_workingColorSpace:Mi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(o){if(!Fp.has(o))throw new Error(`Unsupported working color space, "${o}".`);this._workingColorSpace=o},convert:function(o,t,e){if(this.enabled===!1||t===e||!t||!e)return o;const n=Oo[t].toReference,i=Oo[e].fromReference;return i(n(o))},fromWorkingColorSpace:function(o,t){return this.convert(o,this._workingColorSpace,t)},toWorkingColorSpace:function(o,t){return this.convert(o,t,this._workingColorSpace)},getPrimaries:function(o){return Oo[o].primaries},getTransfer:function(o){return o===Rn?Ua:Oo[o].transfer}};function Os(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function gr(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let ls;class Ju{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ls===void 0&&(ls=Ba("canvas")),ls.width=t.width,ls.height=t.height;const n=ls.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ls}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ba("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=Os(s[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Os(e[n]/255)*255):e[n]=Os(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Np=0;class Qu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Np++}),this.uuid=Xs(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,r=i.length;a<r;a++)i[a].isDataTexture?s.push(vr(i[a].image)):s.push(vr(i[a]))}else s=vr(i);n.url=s}return e||(t.images[this.uuid]=n),n}}function vr(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?Ju.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Op=0;class dn extends $s{constructor(t=dn.DEFAULT_IMAGE,e=dn.DEFAULT_MAPPING,n=on,i=on,s=We,a=is,r=Ae,c=de,l=dn.DEFAULT_ANISOTROPY,h=Rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Op++}),this.uuid=Xs(),this.name="",this.source=new Qu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Vt(0,0),this.repeat=new Vt(1,1),this.center=new Vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(vo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ns?Be:Rn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Bu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ka:t.x=t.x-Math.floor(t.x);break;case on:t.x=t.x<0?0:1;break;case hc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ka:t.y=t.y-Math.floor(t.y);break;case on:t.y=t.y<0?0:1;break;case hc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return vo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Be?ns:Yu}set encoding(t){vo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===ns?Be:Rn}}dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=Bu;dn.DEFAULT_ANISOTROPY=1;class ee{constructor(t=0,e=0,n=0,i=1){ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],p=c[5],g=c[9],v=c[2],m=c[6],d=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,b=(p+1)/2,_=(d+1)/2,S=(h+f)/4,E=(u+v)/4,A=(g+m)/4;return M>b&&M>_?M<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(M),i=S/n,s=E/n):b>_?b<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(b),n=S/i,s=A/i):_<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(_),n=E/s,i=A/s),this.set(n,i,s,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-v)/x,this.z=(f-h)/x,this.w=Math.acos((l+p+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Bp extends $s{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ee(0,0,t,e),this.scissorTest=!1,this.viewport=new ee(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(vo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ns?Be:Rn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:We,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new dn(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Qu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Jn extends Bp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class tf extends dn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ie,this.minFilter=ie,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Wp extends dn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ie,this.minFilter=ie,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Di{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,a,r){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const f=s[a+0],p=s[a+1],g=s[a+2],v=s[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==f||l!==p||h!==g){let m=1-r;const d=c*f+l*p+h*g+u*v,x=d>=0?1:-1,M=1-d*d;if(M>Number.EPSILON){const _=Math.sqrt(M),S=Math.atan2(_,d*x);m=Math.sin(m*S)/_,r=Math.sin(r*S)/_}const b=r*x;if(c=c*m+f*b,l=l*m+p*b,h=h*m+g*b,u=u*m+v*b,m===1-r){const _=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=_,l*=_,h*=_,u*=_}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,s,a){const r=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=s[a],f=s[a+1],p=s[a+2],g=s[a+3];return t[e]=r*g+h*u+c*p-l*f,t[e+1]=c*g+h*f+l*u-r*p,t[e+2]=l*g+h*p+r*f-c*u,t[e+3]=h*g-r*u-c*f-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,s=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(n/2),h=r(i/2),u=r(s/2),f=c(n/2),p=c(i/2),g=c(s/2);switch(a){case"XYZ":this._x=f*h*u+l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u+f*p*g;break;case"YZX":this._x=f*h*u+l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u-f*p*g;break;case"XZY":this._x=f*h*u-l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],s=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+r+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-c)*p,this._y=(s-l)*p,this._z=(a-i)*p}else if(n>r&&n>u){const p=2*Math.sqrt(1+n-r-u);this._w=(h-c)/p,this._x=.25*p,this._y=(i+a)/p,this._z=(s+l)/p}else if(r>u){const p=2*Math.sqrt(1+r-n-u);this._w=(s-l)/p,this._x=(i+a)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-n-r);this._w=(a-i)/p,this._x=(s+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(sn(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,s=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*r+i*l-s*c,this._y=i*h+a*c+s*r-n*l,this._z=s*h+a*l+n*c-i*r,this._w=a*h-n*r-i*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,s=this._z,a=this._w;let r=a*t._w+n*t._x+i*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*i+e*this._y,this._z=p*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=s*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(s),n*Math.cos(s),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{constructor(t=0,e=0,n=0){B.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(zl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(zl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,s=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*i-r*n),h=2*(r*e-s*i),u=2*(s*n-a*e);return this.x=e+c*l+a*u-r*h,this.y=n+c*h+r*l-s*u,this.z=i+c*u+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,s=t.z,a=e.x,r=e.y,c=e.z;return this.x=i*c-s*r,this.y=s*a-n*c,this.z=n*r-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return xr.copy(this).projectOnVector(t),this.sub(xr)}reflect(t){return this.sub(xr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(sn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const xr=new B,zl=new Di;class bn{constructor(t=new B(1/0,1/0,1/0),e=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Pn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Pn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Pn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=s.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,Pn):Pn.fromBufferAttribute(s,a),Pn.applyMatrix4(t.matrixWorld),this.expandByPoint(Pn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Bo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Bo.copy(n.boundingBox)),Bo.applyMatrix4(t.matrixWorld),this.union(Bo)}const i=t.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Pn),Pn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Js),Wo.subVectors(this.max,Js),hs.subVectors(t.a,Js),us.subVectors(t.b,Js),fs.subVectors(t.c,Js),_i.subVectors(us,hs),wi.subVectors(fs,us),Ni.subVectors(hs,fs);let e=[0,-_i.z,_i.y,0,-wi.z,wi.y,0,-Ni.z,Ni.y,_i.z,0,-_i.x,wi.z,0,-wi.x,Ni.z,0,-Ni.x,-_i.y,_i.x,0,-wi.y,wi.x,0,-Ni.y,Ni.x,0];return!Mr(e,hs,us,fs,Wo)||(e=[1,0,0,0,1,0,0,0,1],!Mr(e,hs,us,fs,Wo))?!1:(Go.crossVectors(_i,wi),e=[Go.x,Go.y,Go.z],Mr(e,hs,us,fs,Wo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Pn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Pn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ni),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const ni=[new B,new B,new B,new B,new B,new B,new B,new B],Pn=new B,Bo=new bn,hs=new B,us=new B,fs=new B,_i=new B,wi=new B,Ni=new B,Js=new B,Wo=new B,Go=new B,Oi=new B;function Mr(o,t,e,n,i){for(let s=0,a=o.length-3;s<=a;s+=3){Oi.fromArray(o,s);const r=i.x*Math.abs(Oi.x)+i.y*Math.abs(Oi.y)+i.z*Math.abs(Oi.z),c=t.dot(Oi),l=e.dot(Oi),h=n.dot(Oi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const Gp=new bn,Qs=new B,yr=new B;class Ii{constructor(t=new B,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Gp.setFromPoints(t).getCenter(n);let i=0;for(let s=0,a=t.length;s<a;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Qs.subVectors(t,this.center);const e=Qs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Qs,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(yr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Qs.copy(t.center).add(yr)),this.expandByPoint(Qs.copy(t.center).sub(yr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ii=new B,_r=new B,Ho=new B,bi=new B,wr=new B,Vo=new B,br=new B;class Lc{constructor(t=new B,e=new B(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ii)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ii.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ii.copy(this.origin).addScaledVector(this.direction,e),ii.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){_r.copy(t).add(e).multiplyScalar(.5),Ho.copy(e).sub(t).normalize(),bi.copy(this.origin).sub(_r);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Ho),r=bi.dot(this.direction),c=-bi.dot(Ho),l=bi.lengthSq(),h=Math.abs(1-a*a);let u,f,p,g;if(h>0)if(u=a*c-r,f=a*r-c,g=s*h,u>=0)if(f>=-g)if(f<=g){const v=1/h;u*=v,f*=v,p=u*(u+a*f+2*r)+f*(a*u+f+2*c)+l}else f=s,u=Math.max(0,-(a*f+r)),p=-u*u+f*(f+2*c)+l;else f=-s,u=Math.max(0,-(a*f+r)),p=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-a*s+r)),f=u>0?-s:Math.min(Math.max(-s,-c),s),p=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-s,-c),s),p=f*(f+2*c)+l):(u=Math.max(0,-(a*s+r)),f=u>0?s:Math.min(Math.max(-s,-c),s),p=-u*u+f*(f+2*c)+l);else f=a>0?-s:s,u=Math.max(0,-(a*f+r)),p=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(_r).addScaledVector(Ho,f),p}intersectSphere(t,e){ii.subVectors(t.center,this.origin);const n=ii.dot(this.direction),i=ii.dot(ii)-n*n,s=t.radius*t.radius;if(i>s)return null;const a=Math.sqrt(s-i),r=n-a,c=n+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,i=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,i=(t.min.x-f.x)*l),h>=0?(s=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(s=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(r=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(r=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||r>i)||((r>n||n!==n)&&(n=r),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ii)!==null}intersectTriangle(t,e,n,i,s){wr.subVectors(e,t),Vo.subVectors(n,t),br.crossVectors(wr,Vo);let a=this.direction.dot(br),r;if(a>0){if(i)return null;r=1}else if(a<0)r=-1,a=-a;else return null;bi.subVectors(this.origin,t);const c=r*this.direction.dot(Vo.crossVectors(bi,Vo));if(c<0)return null;const l=r*this.direction.dot(wr.cross(bi));if(l<0||c+l>a)return null;const h=-r*bi.dot(br);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class se{constructor(t,e,n,i,s,a,r,c,l,h,u,f,p,g,v,m){se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,a,r,c,l,h,u,f,p,g,v,m)}set(t,e,n,i,s,a,r,c,l,h,u,f,p,g,v,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=i,d[1]=s,d[5]=a,d[9]=r,d[13]=c,d[2]=l,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=v,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/ds.setFromMatrixColumn(t,0).length(),s=1/ds.setFromMatrixColumn(t,1).length(),a=1/ds.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,s=t.z,a=Math.cos(n),r=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const f=a*h,p=a*u,g=r*h,v=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=f-v*l,e[9]=-r*c,e[2]=v-f*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*h,p=c*u,g=l*h,v=l*u;e[0]=f+v*r,e[4]=g*r-p,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=p*r-g,e[6]=v+f*r,e[10]=a*c}else if(t.order==="ZXY"){const f=c*h,p=c*u,g=l*h,v=l*u;e[0]=f-v*r,e[4]=-a*u,e[8]=g+p*r,e[1]=p+g*r,e[5]=a*h,e[9]=v-f*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const f=a*h,p=a*u,g=r*h,v=r*u;e[0]=c*h,e[4]=g*l-p,e[8]=f*l+v,e[1]=c*u,e[5]=v*l+f,e[9]=p*l-g,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,p=a*l,g=r*c,v=r*l;e[0]=c*h,e[4]=v-f*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=p*u+g,e[10]=f-v*u}else if(t.order==="XZY"){const f=a*c,p=a*l,g=r*c,v=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+v,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=r*h,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Hp,t,Vp)}lookAt(t,e,n){const i=this.elements;return gn.subVectors(t,e),gn.lengthSq()===0&&(gn.z=1),gn.normalize(),Si.crossVectors(n,gn),Si.lengthSq()===0&&(Math.abs(n.z)===1?gn.x+=1e-4:gn.z+=1e-4,gn.normalize(),Si.crossVectors(n,gn)),Si.normalize(),$o.crossVectors(gn,Si),i[0]=Si.x,i[4]=$o.x,i[8]=gn.x,i[1]=Si.y,i[5]=$o.y,i[9]=gn.y,i[2]=Si.z,i[6]=$o.z,i[10]=gn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,a=n[0],r=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],p=n[13],g=n[2],v=n[6],m=n[10],d=n[14],x=n[3],M=n[7],b=n[11],_=n[15],S=i[0],E=i[4],A=i[8],w=i[12],y=i[1],T=i[5],L=i[9],I=i[13],R=i[2],k=i[6],F=i[10],G=i[14],W=i[3],K=i[7],H=i[11],et=i[15];return s[0]=a*S+r*y+c*R+l*W,s[4]=a*E+r*T+c*k+l*K,s[8]=a*A+r*L+c*F+l*H,s[12]=a*w+r*I+c*G+l*et,s[1]=h*S+u*y+f*R+p*W,s[5]=h*E+u*T+f*k+p*K,s[9]=h*A+u*L+f*F+p*H,s[13]=h*w+u*I+f*G+p*et,s[2]=g*S+v*y+m*R+d*W,s[6]=g*E+v*T+m*k+d*K,s[10]=g*A+v*L+m*F+d*H,s[14]=g*w+v*I+m*G+d*et,s[3]=x*S+M*y+b*R+_*W,s[7]=x*E+M*T+b*k+_*K,s[11]=x*A+M*L+b*F+_*H,s[15]=x*w+M*I+b*G+_*et,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],p=t[14],g=t[3],v=t[7],m=t[11],d=t[15];return g*(+s*c*u-i*l*u-s*r*f+n*l*f+i*r*p-n*c*p)+v*(+e*c*p-e*l*f+s*a*f-i*a*p+i*l*h-s*c*h)+m*(+e*l*u-e*r*p-s*a*u+n*a*p+s*r*h-n*l*h)+d*(-i*r*h-e*c*u+e*r*f+i*a*u-n*a*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],p=t[11],g=t[12],v=t[13],m=t[14],d=t[15],x=u*m*l-v*f*l+v*c*p-r*m*p-u*c*d+r*f*d,M=g*f*l-h*m*l-g*c*p+a*m*p+h*c*d-a*f*d,b=h*v*l-g*u*l+g*r*p-a*v*p-h*r*d+a*u*d,_=g*u*c-h*v*c-g*r*f+a*v*f+h*r*m-a*u*m,S=e*x+n*M+i*b+s*_;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=x*E,t[1]=(v*f*s-u*m*s-v*i*p+n*m*p+u*i*d-n*f*d)*E,t[2]=(r*m*s-v*c*s+v*i*l-n*m*l-r*i*d+n*c*d)*E,t[3]=(u*c*s-r*f*s-u*i*l+n*f*l+r*i*p-n*c*p)*E,t[4]=M*E,t[5]=(h*m*s-g*f*s+g*i*p-e*m*p-h*i*d+e*f*d)*E,t[6]=(g*c*s-a*m*s-g*i*l+e*m*l+a*i*d-e*c*d)*E,t[7]=(a*f*s-h*c*s+h*i*l-e*f*l-a*i*p+e*c*p)*E,t[8]=b*E,t[9]=(g*u*s-h*v*s-g*n*p+e*v*p+h*n*d-e*u*d)*E,t[10]=(a*v*s-g*r*s+g*n*l-e*v*l-a*n*d+e*r*d)*E,t[11]=(h*r*s-a*u*s-h*n*l+e*u*l+a*n*p-e*r*p)*E,t[12]=_*E,t[13]=(h*v*i-g*u*i+g*n*f-e*v*f-h*n*m+e*u*m)*E,t[14]=(g*r*i-a*v*i-g*n*c+e*v*c+a*n*m-e*r*m)*E,t[15]=(a*u*i-h*r*i+h*n*c-e*u*c-a*n*f+e*r*f)*E,this}scale(t){const e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),s=1-n,a=t.x,r=t.y,c=t.z,l=s*a,h=s*r;return this.set(l*a+n,l*r-i*c,l*c+i*r,0,l*r+i*c,h*r+n,h*c-i*a,0,l*c-i*r,h*c+i*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,a){return this.set(1,n,s,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,s=e._x,a=e._y,r=e._z,c=e._w,l=s+s,h=a+a,u=r+r,f=s*l,p=s*h,g=s*u,v=a*h,m=a*u,d=r*u,x=c*l,M=c*h,b=c*u,_=n.x,S=n.y,E=n.z;return i[0]=(1-(v+d))*_,i[1]=(p+b)*_,i[2]=(g-M)*_,i[3]=0,i[4]=(p-b)*S,i[5]=(1-(f+d))*S,i[6]=(m+x)*S,i[7]=0,i[8]=(g+M)*E,i[9]=(m-x)*E,i[10]=(1-(f+v))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let s=ds.set(i[0],i[1],i[2]).length();const a=ds.set(i[4],i[5],i[6]).length(),r=ds.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),t.x=i[12],t.y=i[13],t.z=i[14],Dn.copy(this);const l=1/s,h=1/a,u=1/r;return Dn.elements[0]*=l,Dn.elements[1]*=l,Dn.elements[2]*=l,Dn.elements[4]*=h,Dn.elements[5]*=h,Dn.elements[6]*=h,Dn.elements[8]*=u,Dn.elements[9]*=u,Dn.elements[10]*=u,e.setFromRotationMatrix(Dn),n.x=s,n.y=a,n.z=r,this}makePerspective(t,e,n,i,s,a,r=mi){const c=this.elements,l=2*s/(e-t),h=2*s/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let p,g;if(r===mi)p=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(r===Na)p=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,s,a,r=mi){const c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(a-s),f=(e+t)*l,p=(n+i)*h;let g,v;if(r===mi)g=(a+s)*u,v=-2*u;else if(r===Na)g=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ds=new B,Dn=new se,Hp=new B(0,0,0),Vp=new B(1,1,1),Si=new B,$o=new B,gn=new B,Fl=new se,Nl=new Di;class tr{constructor(t=0,e=0,n=0,i=tr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,s=i[0],a=i[4],r=i[8],c=i[1],l=i[5],h=i[9],u=i[2],f=i[6],p=i[10];switch(e){case"XYZ":this._y=Math.asin(sn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-sn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(sn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-sn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(sn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,p));break;case"XZY":this._z=Math.asin(-sn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Fl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Fl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Nl.setFromEuler(this),this.setFromQuaternion(Nl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}tr.DEFAULT_ORDER="XYZ";class Pc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let $p=0;const Ol=new B,ps=new Di,si=new se,Xo=new B,to=new B,Xp=new B,jp=new Di,Bl=new B(1,0,0),Wl=new B(0,1,0),Gl=new B(0,0,1),qp={type:"added"},Yp={type:"removed"};class pn extends $s{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$p++}),this.uuid=Xs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pn.DEFAULT_UP.clone();const t=new B,e=new tr,n=new Di,i=new B(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new se},normalMatrix:{value:new Qt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=pn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Pc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ps.setFromAxisAngle(t,e),this.quaternion.multiply(ps),this}rotateOnWorldAxis(t,e){return ps.setFromAxisAngle(t,e),this.quaternion.premultiply(ps),this}rotateX(t){return this.rotateOnAxis(Bl,t)}rotateY(t){return this.rotateOnAxis(Wl,t)}rotateZ(t){return this.rotateOnAxis(Gl,t)}translateOnAxis(t,e){return Ol.copy(t).applyQuaternion(this.quaternion),this.position.add(Ol.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Bl,t)}translateY(t){return this.translateOnAxis(Wl,t)}translateZ(t){return this.translateOnAxis(Gl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(si.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Xo.copy(t):Xo.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),to.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?si.lookAt(to,Xo,this.up):si.lookAt(Xo,to,this.up),this.quaternion.setFromRotationMatrix(si),i&&(si.extractRotation(i.matrixWorld),ps.setFromRotationMatrix(si),this.quaternion.premultiply(ps.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(qp)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Yp)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),si.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),si.multiply(t.parent.matrixWorld)),t.applyMatrix4(si),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(to,t,Xp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(to,jp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const s=e[n];(s.matrixWorldAutoUpdate===!0||t===!0)&&s.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++){const r=i[s];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));i.material=r}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let r=0;r<this.children.length;r++)i.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];i.animations.push(s(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),p=a(t.animations),g=a(t.nodes);r.length>0&&(n.geometries=r),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}pn.DEFAULT_UP=new B(0,1,0);pn.DEFAULT_MATRIX_AUTO_UPDATE=!0;pn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const In=new B,oi=new B,Sr=new B,ai=new B,ms=new B,gs=new B,Hl=new B,Er=new B,Ar=new B,Tr=new B;let jo=!1;class Nn{constructor(t=new B,e=new B,n=new B){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),In.subVectors(t,e),i.cross(In);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){In.subVectors(i,e),oi.subVectors(n,e),Sr.subVectors(t,e);const a=In.dot(In),r=In.dot(oi),c=In.dot(Sr),l=oi.dot(oi),h=oi.dot(Sr),u=a*l-r*r;if(u===0)return s.set(0,0,0),null;const f=1/u,p=(l*c-r*h)*f,g=(a*h-r*c)*f;return s.set(1-p-g,g,p)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getUV(t,e,n,i,s,a,r,c){return jo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jo=!0),this.getInterpolation(t,e,n,i,s,a,r,c)}static getInterpolation(t,e,n,i,s,a,r,c){return this.getBarycoord(t,e,n,i,ai)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,ai.x),c.addScaledVector(a,ai.y),c.addScaledVector(r,ai.z),c)}static isFrontFacing(t,e,n,i){return In.subVectors(n,e),oi.subVectors(t,e),In.cross(oi).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return In.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),In.cross(oi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Nn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Nn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,s){return jo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jo=!0),Nn.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}getInterpolation(t,e,n,i,s){return Nn.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return Nn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Nn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,s=this.c;let a,r;ms.subVectors(i,n),gs.subVectors(s,n),Er.subVectors(t,n);const c=ms.dot(Er),l=gs.dot(Er);if(c<=0&&l<=0)return e.copy(n);Ar.subVectors(t,i);const h=ms.dot(Ar),u=gs.dot(Ar);if(h>=0&&u<=h)return e.copy(i);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(ms,a);Tr.subVectors(t,s);const p=ms.dot(Tr),g=gs.dot(Tr);if(g>=0&&p<=g)return e.copy(s);const v=p*l-c*g;if(v<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(n).addScaledVector(gs,r);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Hl.subVectors(s,i),r=(u-h)/(u-h+(p-g)),e.copy(i).addScaledVector(Hl,r);const d=1/(m+v+f);return a=v*d,r=f*d,e.copy(n).addScaledVector(ms,a).addScaledVector(gs,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ef={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},qo={h:0,s:0,l:0};function Cr(o,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?o+(t-o)*6*e:e<1/2?t:e<2/3?o+(t-o)*6*(2/3-e):o}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=le.workingColorSpace){if(t=Rc(t,1),e=sn(e,0,1),n=sn(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Cr(a,s,t+1/3),this.g=Cr(a,s,t),this.b=Cr(a,s,t-1/3)}return le.toWorkingColorSpace(this,i),this}setStyle(t,e=Be){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=i[1],r=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=ef[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Os(t.r),this.g=Os(t.g),this.b=Os(t.b),this}copyLinearToSRGB(t){return this.r=gr(t.r),this.g=gr(t.g),this.b=gr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return le.fromWorkingColorSpace(je.copy(this),t),Math.round(sn(je.r*255,0,255))*65536+Math.round(sn(je.g*255,0,255))*256+Math.round(sn(je.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(je.copy(this),e);const n=je.r,i=je.g,s=je.b,a=Math.max(n,i,s),r=Math.min(n,i,s);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const u=a-r;switch(l=h<=.5?u/(a+r):u/(2-a-r),a){case n:c=(i-s)/u+(i<s?6:0);break;case i:c=(s-n)/u+2;break;case s:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=Be){le.fromWorkingColorSpace(je.copy(this),t);const e=je.r,n=je.g,i=je.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ei),this.setHSL(Ei.h+t,Ei.s+e,Ei.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ei),t.getHSL(qo);const n=go(Ei.h,qo.h,e),i=go(Ei.s,qo.s,e),s=go(Ei.l,qo.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const je=new Ht;Ht.NAMES=ef;let Kp=0;class Lo extends $s{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=Xs(),this.name="",this.type="Material",this.blending=Ns,this.side=xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ac,this.blendDst=rc,this.blendEquation=qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=Ia,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Rl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=cs,this.stencilZFail=cs,this.stencilZPass=cs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ns&&(n.blending=this.blending),this.side!==xi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ac&&(n.blendSrc=this.blendSrc),this.blendDst!==rc&&(n.blendDst=this.blendDst),this.blendEquation!==qi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ia&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Rl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==cs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==cs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==cs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const r in s){const c=s[r];delete c.metadata,a.push(c)}return a}if(e){const s=i(t.textures),a=i(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class nf extends Lo{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ou,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const be=new B,Yo=new Vt;class De{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ll,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=pi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Yo.fromBufferAttribute(this,e),Yo.applyMatrix3(t),this.setXY(e,Yo.x,Yo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=As(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Je(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=As(e,this.array)),e}setX(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=As(e,this.array)),e}setY(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=As(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=As(e,this.array)),e}setW(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),i=Je(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),i=Je(i,this.array),s=Je(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ll&&(t.usage=this.usage),t}}class sf extends De{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class of extends De{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Te extends De{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Zp=0;const An=new se,Rr=new pn,vs=new B,vn=new bn,eo=new bn,Ne=new B;class cn extends $s{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=Xs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Zu(t)?of:sf)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Qt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return An.makeRotationFromQuaternion(t),this.applyMatrix4(An),this}rotateX(t){return An.makeRotationX(t),this.applyMatrix4(An),this}rotateY(t){return An.makeRotationY(t),this.applyMatrix4(An),this}rotateZ(t){return An.makeRotationZ(t),this.applyMatrix4(An),this}translate(t,e,n){return An.makeTranslation(t,e,n),this.applyMatrix4(An),this}scale(t,e,n){return An.makeScale(t,e,n),this.applyMatrix4(An),this}lookAt(t){return Rr.lookAt(t),Rr.updateMatrix(),this.applyMatrix4(Rr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vs).negate(),this.translate(vs.x,vs.y,vs.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const s=t[n];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Te(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new bn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const s=e[n];vn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ne.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(Ne),Ne.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(Ne)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ii);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new B,1/0);return}if(t){const n=this.boundingSphere.center;if(vn.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const r=e[s];eo.setFromBufferAttribute(r),this.morphTargetsRelative?(Ne.addVectors(vn.min,eo.min),vn.expandByPoint(Ne),Ne.addVectors(vn.max,eo.max),vn.expandByPoint(Ne)):(vn.expandByPoint(eo.min),vn.expandByPoint(eo.max))}vn.getCenter(n);let i=0;for(let s=0,a=t.count;s<a;s++)Ne.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(Ne));if(e)for(let s=0,a=e.length;s<a;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)Ne.fromBufferAttribute(r,l),c&&(vs.fromBufferAttribute(t,l),Ne.add(vs)),i=Math.max(i,n.distanceToSquared(Ne))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,s=e.normal.array,a=e.uv.array,r=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new De(new Float32Array(4*r),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let y=0;y<r;y++)l[y]=new B,h[y]=new B;const u=new B,f=new B,p=new B,g=new Vt,v=new Vt,m=new Vt,d=new B,x=new B;function M(y,T,L){u.fromArray(i,y*3),f.fromArray(i,T*3),p.fromArray(i,L*3),g.fromArray(a,y*2),v.fromArray(a,T*2),m.fromArray(a,L*2),f.sub(u),p.sub(u),v.sub(g),m.sub(g);const I=1/(v.x*m.y-m.x*v.y);isFinite(I)&&(d.copy(f).multiplyScalar(m.y).addScaledVector(p,-v.y).multiplyScalar(I),x.copy(p).multiplyScalar(v.x).addScaledVector(f,-m.x).multiplyScalar(I),l[y].add(d),l[T].add(d),l[L].add(d),h[y].add(x),h[T].add(x),h[L].add(x))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let y=0,T=b.length;y<T;++y){const L=b[y],I=L.start,R=L.count;for(let k=I,F=I+R;k<F;k+=3)M(n[k+0],n[k+1],n[k+2])}const _=new B,S=new B,E=new B,A=new B;function w(y){E.fromArray(s,y*3),A.copy(E);const T=l[y];_.copy(T),_.sub(E.multiplyScalar(E.dot(T))).normalize(),S.crossVectors(A,T);const I=S.dot(h[y])<0?-1:1;c[y*4]=_.x,c[y*4+1]=_.y,c[y*4+2]=_.z,c[y*4+3]=I}for(let y=0,T=b.length;y<T;++y){const L=b[y],I=L.start,R=L.count;for(let k=I,F=I+R;k<F;k+=3)w(n[k+0]),w(n[k+1]),w(n[k+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new De(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const i=new B,s=new B,a=new B,r=new B,c=new B,l=new B,h=new B,u=new B;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),v=t.getX(f+1),m=t.getX(f+2);i.fromBufferAttribute(e,g),s.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),r.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),r.add(h),c.add(h),l.add(h),n.setXYZ(g,r.x,r.y,r.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=e.count;f<p;f+=3)i.fromBufferAttribute(e,f+0),s.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ne.fromBufferAttribute(t,e),Ne.normalize(),t.setXYZ(e,Ne.x,Ne.y,Ne.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,f=new l.constructor(c.length*h);let p=0,g=0;for(let v=0,m=c.length;v<m;v++){r.isInterleavedBufferAttribute?p=c[v]*r.data.stride+r.offset:p=c[v]*h;for(let d=0;d<h;d++)f[g++]=l[p++]}return new De(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new cn,n=this.index.array,i=this.attributes;for(const r in i){const c=i[r],l=t(c,n);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let h=0,u=l.length;h<u;h++){const f=l[h],p=t(f,n);c.push(p)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const i={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(i[c]=h,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Vl=new se,Bi=new Lc,Ko=new Ii,$l=new B,xs=new B,Ms=new B,ys=new B,Lr=new B,Zo=new B,Jo=new Vt,Qo=new Vt,ta=new Vt,Xl=new B,jl=new B,ql=new B,ea=new B,na=new B;class ye extends pn{constructor(t=new cn,e=new nf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const r=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const r=this.morphTargetInfluences;if(s&&r){Zo.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=r[c],u=s[c];h!==0&&(Lr.fromBufferAttribute(u,t),a?Zo.addScaledVector(Lr,h):Zo.addScaledVector(Lr.sub(e),h))}e.add(Zo)}return e}raycast(t,e){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ko.copy(n.boundingSphere),Ko.applyMatrix4(s),Bi.copy(t.ray).recast(t.near),!(Ko.containsPoint(Bi.origin)===!1&&(Bi.intersectSphere(Ko,$l)===null||Bi.origin.distanceToSquared($l)>(t.far-t.near)**2))&&(Vl.copy(s).invert(),Bi.copy(t.ray).applyMatrix4(Vl),!(n.boundingBox!==null&&Bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Bi)))}_computeIntersections(t,e,n){let i;const s=this.geometry,a=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,f=s.groups,p=s.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],d=a[m.materialIndex],x=Math.max(m.start,p.start),M=Math.min(r.count,Math.min(m.start+m.count,p.start+p.count));for(let b=x,_=M;b<_;b+=3){const S=r.getX(b),E=r.getX(b+1),A=r.getX(b+2);i=ia(this,d,t,n,l,h,u,S,E,A),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),v=Math.min(r.count,p.start+p.count);for(let m=g,d=v;m<d;m+=3){const x=r.getX(m),M=r.getX(m+1),b=r.getX(m+2);i=ia(this,a,t,n,l,h,u,x,M,b),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],d=a[m.materialIndex],x=Math.max(m.start,p.start),M=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let b=x,_=M;b<_;b+=3){const S=b,E=b+1,A=b+2;i=ia(this,d,t,n,l,h,u,S,E,A),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let m=g,d=v;m<d;m+=3){const x=m,M=m+1,b=m+2;i=ia(this,a,t,n,l,h,u,x,M,b),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function Jp(o,t,e,n,i,s,a,r){let c;if(t.side===rn?c=n.intersectTriangle(a,s,i,!0,r):c=n.intersectTriangle(i,s,a,t.side===xi,r),c===null)return null;na.copy(r),na.applyMatrix4(o.matrixWorld);const l=e.ray.origin.distanceTo(na);return l<e.near||l>e.far?null:{distance:l,point:na.clone(),object:o}}function ia(o,t,e,n,i,s,a,r,c,l){o.getVertexPosition(r,xs),o.getVertexPosition(c,Ms),o.getVertexPosition(l,ys);const h=Jp(o,t,e,n,xs,Ms,ys,ea);if(h){i&&(Jo.fromBufferAttribute(i,r),Qo.fromBufferAttribute(i,c),ta.fromBufferAttribute(i,l),h.uv=Nn.getInterpolation(ea,xs,Ms,ys,Jo,Qo,ta,new Vt)),s&&(Jo.fromBufferAttribute(s,r),Qo.fromBufferAttribute(s,c),ta.fromBufferAttribute(s,l),h.uv1=Nn.getInterpolation(ea,xs,Ms,ys,Jo,Qo,ta,new Vt),h.uv2=h.uv1),a&&(Xl.fromBufferAttribute(a,r),jl.fromBufferAttribute(a,c),ql.fromBufferAttribute(a,l),h.normal=Nn.getInterpolation(ea,xs,Ms,ys,Xl,jl,ql,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:c,c:l,normal:new B,materialIndex:0};Nn.getNormal(xs,Ms,ys,u.normal),h.face=u}return h}class Po extends cn{constructor(t=1,e=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const r=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,e,t,a,s,0),g("z","y","x",1,-1,n,e,-t,a,s,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,s,4),g("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(c),this.setAttribute("position",new Te(l,3)),this.setAttribute("normal",new Te(h,3)),this.setAttribute("uv",new Te(u,2));function g(v,m,d,x,M,b,_,S,E,A,w){const y=b/E,T=_/A,L=b/2,I=_/2,R=S/2,k=E+1,F=A+1;let G=0,W=0;const K=new B;for(let H=0;H<F;H++){const et=H*T-I;for(let ct=0;ct<k;ct++){const Q=ct*y-L;K[v]=Q*x,K[m]=et*M,K[d]=R,l.push(K.x,K.y,K.z),K[v]=0,K[m]=0,K[d]=S>0?1:-1,h.push(K.x,K.y,K.z),u.push(ct/E),u.push(1-H/A),G+=1}}for(let H=0;H<A;H++)for(let et=0;et<E;et++){const ct=f+et+k*H,Q=f+et+k*(H+1),nt=f+(et+1)+k*(H+1),dt=f+(et+1)+k*H;c.push(ct,Q,dt),c.push(Q,nt,dt),W+=6}r.addGroup(p,W,w),p+=W,f+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Po(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Vs(o){const t={};for(const e in o){t[e]={};for(const n in o[e]){const i=o[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Qe(o){const t={};for(let e=0;e<o.length;e++){const n=Vs(o[e]);for(const i in n)t[i]=n[i]}return t}function Qp(o){const t=[];for(let e=0;e<o.length;e++)t.push(o[e].clone());return t}function af(o){return o.getRenderTarget()===null?o.outputColorSpace:le.workingColorSpace}const t0={clone:Vs,merge:Qe};var e0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,n0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ce extends Lo{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=e0,this.fragmentShader=n0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Vs(t.uniforms),this.uniformsGroups=Qp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class rf extends pn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=mi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class _n extends rf{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ao*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(mo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ao*2*Math.atan(Math.tan(mo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(mo*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*i/c,e-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const _s=-90,ws=1;class i0 extends pn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new _n(_s,ws,t,e);i.layers=this.layers,this.add(i);const s=new _n(_s,ws,t,e);s.layers=this.layers,this.add(s);const a=new _n(_s,ws,t,e);a.layers=this.layers,this.add(a);const r=new _n(_s,ws,t,e);r.layers=this.layers,this.add(r);const c=new _n(_s,ws,t,e);c.layers=this.layers,this.add(c);const l=new _n(_s,ws,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,s,a,r,c]=e;for(const l of e)this.remove(l);if(t===mi)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Na)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,r,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,s),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,r),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class cf extends dn{constructor(t,e,n,i,s,a,r,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Ws,super(t,e,n,i,s,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class s0 extends Jn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(vo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===ns?Be:Rn),this.texture=new cf(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:We}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Po(5,5,5),s=new Ce({name:"CubemapFromEquirect",uniforms:Vs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:vi});s.uniforms.tEquirect.value=e;const a=new ye(i,s),r=e.minFilter;return e.minFilter===is&&(e.minFilter=We),new i0(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(s)}}const Pr=new B,o0=new B,a0=new Qt;class Vi{constructor(t=new B(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Pr.subVectors(n,e).cross(o0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Pr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||a0.getNormalMatrix(t),i=this.coplanarPoint(Pr).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Wi=new Ii,sa=new B;class ki{constructor(t=new Vi,e=new Vi,n=new Vi,i=new Vi,s=new Vi,a=new Vi){this.planes=[t,e,n,i,s,a]}set(t,e,n,i,s,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(n),r[3].copy(i),r[4].copy(s),r[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=mi){const n=this.planes,i=t.elements,s=i[0],a=i[1],r=i[2],c=i[3],l=i[4],h=i[5],u=i[6],f=i[7],p=i[8],g=i[9],v=i[10],m=i[11],d=i[12],x=i[13],M=i[14],b=i[15];if(n[0].setComponents(c-s,f-l,m-p,b-d).normalize(),n[1].setComponents(c+s,f+l,m+p,b+d).normalize(),n[2].setComponents(c+a,f+h,m+g,b+x).normalize(),n[3].setComponents(c-a,f-h,m-g,b-x).normalize(),n[4].setComponents(c-r,f-u,m-v,b-M).normalize(),e===mi)n[5].setComponents(c+r,f+u,m+v,b+M).normalize();else if(e===Na)n[5].setComponents(r,u,v,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Wi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Wi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Wi)}intersectsSprite(t){return Wi.center.set(0,0,0),Wi.radius=.7071067811865476,Wi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Wi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(sa.x=i.normal.x>0?t.max.x:t.min.x,sa.y=i.normal.y>0?t.max.y:t.min.y,sa.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(sa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function lf(){let o=null,t=!1,e=null,n=null;function i(s,a){e(s,a),n=o.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=o.requestAnimationFrame(i),t=!0)},stop:function(){o.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){o=s}}}function r0(o,t){const e=t.isWebGL2,n=new WeakMap;function i(l,h){const u=l.array,f=l.usage,p=u.byteLength,g=o.createBuffer();o.bindBuffer(h,g),o.bufferData(h,u,f),l.onUploadCallback();let v;if(u instanceof Float32Array)v=o.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)v=o.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=o.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=o.SHORT;else if(u instanceof Uint32Array)v=o.UNSIGNED_INT;else if(u instanceof Int32Array)v=o.INT;else if(u instanceof Int8Array)v=o.BYTE;else if(u instanceof Uint8Array)v=o.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:p}}function s(l,h,u){const f=h.array,p=h._updateRange,g=h.updateRanges;if(o.bindBuffer(u,l),p.count===-1&&g.length===0&&o.bufferSubData(u,0,f),g.length!==0){for(let v=0,m=g.length;v<m;v++){const d=g[v];e?o.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):o.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}h.clearUpdateRanges()}p.count!==-1&&(e?o.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):o.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(o.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,i(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(u.buffer,l,h),u.version=l.version}}return{get:a,remove:r,update:c}}class Dc extends cn{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const s=t/2,a=e/2,r=Math.floor(n),c=Math.floor(i),l=r+1,h=c+1,u=t/r,f=e/c,p=[],g=[],v=[],m=[];for(let d=0;d<h;d++){const x=d*f-a;for(let M=0;M<l;M++){const b=M*u-s;g.push(b,-x,0),v.push(0,0,1),m.push(M/r),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let x=0;x<r;x++){const M=x+l*d,b=x+l*(d+1),_=x+1+l*(d+1),S=x+1+l*d;p.push(M,b,S),p.push(b,_,S)}this.setIndex(p),this.setAttribute("position",new Te(g,3)),this.setAttribute("normal",new Te(v,3)),this.setAttribute("uv",new Te(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dc(t.width,t.height,t.widthSegments,t.heightSegments)}}var c0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,l0=`#ifdef USE_ALPHAHASH
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
#endif`,h0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,u0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,f0=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,d0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,p0=`#ifdef USE_AOMAP
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
#endif`,m0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,g0=`#ifdef USE_BATCHING
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
#endif`,v0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,x0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,M0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,y0=`float G_BlinnPhong_Implicit( ) {
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
#endif`,w0=`#ifdef USE_BUMPMAP
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
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,S0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,E0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,A0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,T0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,C0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,R0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,L0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,P0=`#define PI 3.141592653589793
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
} // validated`,D0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,I0=`vec3 transformedNormal = objectNormal;
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
#endif`,k0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,U0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,z0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,F0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,N0="gl_FragColor = linearToOutputTexel( gl_FragColor );",O0=`
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
}`,B0=`#ifdef USE_ENVMAP
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
#endif`,W0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,G0=`#ifdef USE_ENVMAP
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
#endif`,H0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,V0=`#ifdef USE_ENVMAP
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
#endif`,$0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,X0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,j0=`#ifdef USE_FOG
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
#endif`,Y0=`#ifdef USE_GRADIENTMAP
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
}`,K0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Z0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,J0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Q0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tm=`uniform bool receiveShadow;
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
#endif`,em=`#ifdef USE_ENVMAP
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
#endif`,nm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,om=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,am=`PhysicalMaterial material;
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
#endif`,rm=`struct PhysicalMaterial {
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
}`,cm=`
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
#endif`,lm=`#if defined( RE_IndirectDiffuse )
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
#endif`,hm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,um=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,pm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,mm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,xm=`#if defined( USE_POINTS_UV )
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
#endif`,Mm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ym=`#ifdef USE_METALNESSMAP
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
#endif`,wm=`#ifdef USE_MORPHNORMALS
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
#endif`,bm=`#ifdef USE_MORPHTARGETS
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
#endif`,Sm=`#ifdef USE_MORPHTARGETS
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
#endif`,Em=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Am=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Tm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Lm=`#ifdef USE_NORMALMAP
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
#endif`,Pm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Im=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,km=`#ifdef USE_IRIDESCENCEMAP
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
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Fm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Nm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Om=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$m=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xm=`float getShadowMask() {
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
}`,jm=`#ifdef USE_SKINNING
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
#endif`,Ym=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Km=`#ifdef USE_SKINNING
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
#endif`,Zm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,eg=`#ifdef USE_TRANSMISSION
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
#endif`,ng=`#ifdef USE_TRANSMISSION
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ag=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const rg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cg=`uniform sampler2D t2D;
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
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`#include <common>
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
}`,pg=`#if DEPTH_PACKING == 3200
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
}`,mg=`#define DISTANCE
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
}`,gg=`#define DISTANCE
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
}`,vg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mg=`uniform float scale;
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
}`,yg=`uniform vec3 diffuse;
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
}`,wg=`uniform vec3 diffuse;
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
}`,bg=`#define LAMBERT
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
}`,Sg=`#define LAMBERT
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
}`,Eg=`#define MATCAP
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
}`,Ag=`#define MATCAP
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
}`,Tg=`#define NORMAL
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
}`,Cg=`#define NORMAL
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
}`,Rg=`#define PHONG
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
}`,Lg=`#define PHONG
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
}`,Pg=`#define STANDARD
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
}`,Dg=`#define STANDARD
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
}`,Ig=`#define TOON
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
}`,kg=`#define TOON
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
}`,zg=`uniform vec3 diffuse;
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
}`,Fg=`#include <common>
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
}`,Ng=`uniform vec3 color;
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
}`,Og=`uniform float rotation;
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
}`,Bg=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:c0,alphahash_pars_fragment:l0,alphamap_fragment:h0,alphamap_pars_fragment:u0,alphatest_fragment:f0,alphatest_pars_fragment:d0,aomap_fragment:p0,aomap_pars_fragment:m0,batching_pars_vertex:g0,batching_vertex:v0,begin_vertex:x0,beginnormal_vertex:M0,bsdfs:y0,iridescence_fragment:_0,bumpmap_pars_fragment:w0,clipping_planes_fragment:b0,clipping_planes_pars_fragment:S0,clipping_planes_pars_vertex:E0,clipping_planes_vertex:A0,color_fragment:T0,color_pars_fragment:C0,color_pars_vertex:R0,color_vertex:L0,common:P0,cube_uv_reflection_fragment:D0,defaultnormal_vertex:I0,displacementmap_pars_vertex:k0,displacementmap_vertex:U0,emissivemap_fragment:z0,emissivemap_pars_fragment:F0,colorspace_fragment:N0,colorspace_pars_fragment:O0,envmap_fragment:B0,envmap_common_pars_fragment:W0,envmap_pars_fragment:G0,envmap_pars_vertex:H0,envmap_physical_pars_fragment:em,envmap_vertex:V0,fog_vertex:$0,fog_pars_vertex:X0,fog_fragment:j0,fog_pars_fragment:q0,gradientmap_pars_fragment:Y0,lightmap_fragment:K0,lightmap_pars_fragment:Z0,lights_lambert_fragment:J0,lights_lambert_pars_fragment:Q0,lights_pars_begin:tm,lights_toon_fragment:nm,lights_toon_pars_fragment:im,lights_phong_fragment:sm,lights_phong_pars_fragment:om,lights_physical_fragment:am,lights_physical_pars_fragment:rm,lights_fragment_begin:cm,lights_fragment_maps:lm,lights_fragment_end:hm,logdepthbuf_fragment:um,logdepthbuf_pars_fragment:fm,logdepthbuf_pars_vertex:dm,logdepthbuf_vertex:pm,map_fragment:mm,map_pars_fragment:gm,map_particle_fragment:vm,map_particle_pars_fragment:xm,metalnessmap_fragment:Mm,metalnessmap_pars_fragment:ym,morphcolor_vertex:_m,morphnormal_vertex:wm,morphtarget_pars_vertex:bm,morphtarget_vertex:Sm,normal_fragment_begin:Em,normal_fragment_maps:Am,normal_pars_fragment:Tm,normal_pars_vertex:Cm,normal_vertex:Rm,normalmap_pars_fragment:Lm,clearcoat_normal_fragment_begin:Pm,clearcoat_normal_fragment_maps:Dm,clearcoat_pars_fragment:Im,iridescence_pars_fragment:km,opaque_fragment:Um,packing:zm,premultiplied_alpha_fragment:Fm,project_vertex:Nm,dithering_fragment:Om,dithering_pars_fragment:Bm,roughnessmap_fragment:Wm,roughnessmap_pars_fragment:Gm,shadowmap_pars_fragment:Hm,shadowmap_pars_vertex:Vm,shadowmap_vertex:$m,shadowmask_pars_fragment:Xm,skinbase_vertex:jm,skinning_pars_vertex:qm,skinning_vertex:Ym,skinnormal_vertex:Km,specularmap_fragment:Zm,specularmap_pars_fragment:Jm,tonemapping_fragment:Qm,tonemapping_pars_fragment:tg,transmission_fragment:eg,transmission_pars_fragment:ng,uv_pars_fragment:ig,uv_pars_vertex:sg,uv_vertex:og,worldpos_vertex:ag,background_vert:rg,background_frag:cg,backgroundCube_vert:lg,backgroundCube_frag:hg,cube_vert:ug,cube_frag:fg,depth_vert:dg,depth_frag:pg,distanceRGBA_vert:mg,distanceRGBA_frag:gg,equirect_vert:vg,equirect_frag:xg,linedashed_vert:Mg,linedashed_frag:yg,meshbasic_vert:_g,meshbasic_frag:wg,meshlambert_vert:bg,meshlambert_frag:Sg,meshmatcap_vert:Eg,meshmatcap_frag:Ag,meshnormal_vert:Tg,meshnormal_frag:Cg,meshphong_vert:Rg,meshphong_frag:Lg,meshphysical_vert:Pg,meshphysical_frag:Dg,meshtoon_vert:Ig,meshtoon_frag:kg,points_vert:Ug,points_frag:zg,shadow_vert:Fg,shadow_frag:Ng,sprite_vert:Og,sprite_frag:Bg},vt={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qt},normalScale:{value:new Vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0},uvTransform:{value:new Qt}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new Vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}}},$n={basic:{uniforms:Qe([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Qe([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Qe([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Qe([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Qe([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Qe([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Qe([vt.points,vt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Qe([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Qe([vt.common,vt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Qe([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Qe([vt.sprite,vt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Qe([vt.common,vt.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Qe([vt.lights,vt.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};$n.physical={uniforms:Qe([$n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qt},clearcoatNormalScale:{value:new Vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qt},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qt},transmissionSamplerSize:{value:new Vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qt},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qt},anisotropyVector:{value:new Vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const oa={r:0,b:0,g:0};function Wg(o,t,e,n,i,s,a){const r=new Ht(0);let c=s===!0?0:1,l,h,u=null,f=0,p=null;function g(m,d){let x=!1,M=d.isScene===!0?d.background:null;M&&M.isTexture&&(M=(d.backgroundBlurriness>0?e:t).get(M)),M===null?v(r,c):M&&M.isColor&&(v(M,1),x=!0);const b=o.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(o.autoClear||x)&&o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Ja)?(h===void 0&&(h=new ye(new Po(1,1,1),new Ce({name:"BackgroundCubeMaterial",uniforms:Vs($n.backgroundCube.uniforms),vertexShader:$n.backgroundCube.vertexShader,fragmentShader:$n.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(_,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=le.getTransfer(M.colorSpace)!==fe,(u!==M||f!==M.version||p!==o.toneMapping)&&(h.material.needsUpdate=!0,u=M,f=M.version,p=o.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new ye(new Dc(2,2),new Ce({name:"BackgroundMaterial",uniforms:Vs($n.background.uniforms),vertexShader:$n.background.vertexShader,fragmentShader:$n.background.fragmentShader,side:xi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,l.material.toneMapped=le.getTransfer(M.colorSpace)!==fe,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||p!==o.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,p=o.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function v(m,d){m.getRGB(oa,af(o)),n.buffers.color.setClear(oa.r,oa.g,oa.b,d,a)}return{getClearColor:function(){return r},setClearColor:function(m,d=1){r.set(m),c=d,v(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,v(r,c)},render:g}}function Gg(o,t,e,n){const i=o.getParameter(o.MAX_VERTEX_ATTRIBS),s=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||s!==null,r={},c=m(null);let l=c,h=!1;function u(R,k,F,G,W){let K=!1;if(a){const H=v(G,F,k);l!==H&&(l=H,p(l.object)),K=d(R,G,F,W),K&&x(R,G,F,W)}else{const H=k.wireframe===!0;(l.geometry!==G.id||l.program!==F.id||l.wireframe!==H)&&(l.geometry=G.id,l.program=F.id,l.wireframe=H,K=!0)}W!==null&&e.update(W,o.ELEMENT_ARRAY_BUFFER),(K||h)&&(h=!1,A(R,k,F,G),W!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function f(){return n.isWebGL2?o.createVertexArray():s.createVertexArrayOES()}function p(R){return n.isWebGL2?o.bindVertexArray(R):s.bindVertexArrayOES(R)}function g(R){return n.isWebGL2?o.deleteVertexArray(R):s.deleteVertexArrayOES(R)}function v(R,k,F){const G=F.wireframe===!0;let W=r[R.id];W===void 0&&(W={},r[R.id]=W);let K=W[k.id];K===void 0&&(K={},W[k.id]=K);let H=K[G];return H===void 0&&(H=m(f()),K[G]=H),H}function m(R){const k=[],F=[],G=[];for(let W=0;W<i;W++)k[W]=0,F[W]=0,G[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:F,attributeDivisors:G,object:R,attributes:{},index:null}}function d(R,k,F,G){const W=l.attributes,K=k.attributes;let H=0;const et=F.getAttributes();for(const ct in et)if(et[ct].location>=0){const nt=W[ct];let dt=K[ct];if(dt===void 0&&(ct==="instanceMatrix"&&R.instanceMatrix&&(dt=R.instanceMatrix),ct==="instanceColor"&&R.instanceColor&&(dt=R.instanceColor)),nt===void 0||nt.attribute!==dt||dt&&nt.data!==dt.data)return!0;H++}return l.attributesNum!==H||l.index!==G}function x(R,k,F,G){const W={},K=k.attributes;let H=0;const et=F.getAttributes();for(const ct in et)if(et[ct].location>=0){let nt=K[ct];nt===void 0&&(ct==="instanceMatrix"&&R.instanceMatrix&&(nt=R.instanceMatrix),ct==="instanceColor"&&R.instanceColor&&(nt=R.instanceColor));const dt={};dt.attribute=nt,nt&&nt.data&&(dt.data=nt.data),W[ct]=dt,H++}l.attributes=W,l.attributesNum=H,l.index=G}function M(){const R=l.newAttributes;for(let k=0,F=R.length;k<F;k++)R[k]=0}function b(R){_(R,0)}function _(R,k){const F=l.newAttributes,G=l.enabledAttributes,W=l.attributeDivisors;F[R]=1,G[R]===0&&(o.enableVertexAttribArray(R),G[R]=1),W[R]!==k&&((n.isWebGL2?o:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,k),W[R]=k)}function S(){const R=l.newAttributes,k=l.enabledAttributes;for(let F=0,G=k.length;F<G;F++)k[F]!==R[F]&&(o.disableVertexAttribArray(F),k[F]=0)}function E(R,k,F,G,W,K,H){H===!0?o.vertexAttribIPointer(R,k,F,W,K):o.vertexAttribPointer(R,k,F,G,W,K)}function A(R,k,F,G){if(n.isWebGL2===!1&&(R.isInstancedMesh||G.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();const W=G.attributes,K=F.getAttributes(),H=k.defaultAttributeValues;for(const et in K){const ct=K[et];if(ct.location>=0){let Q=W[et];if(Q===void 0&&(et==="instanceMatrix"&&R.instanceMatrix&&(Q=R.instanceMatrix),et==="instanceColor"&&R.instanceColor&&(Q=R.instanceColor)),Q!==void 0){const nt=Q.normalized,dt=Q.itemSize,Mt=e.get(Q);if(Mt===void 0)continue;const St=Mt.buffer,Rt=Mt.type,Pt=Mt.bytesPerElement,Et=n.isWebGL2===!0&&(Rt===o.INT||Rt===o.UNSIGNED_INT||Q.gpuType===Wu);if(Q.isInterleavedBufferAttribute){const Ut=Q.data,X=Ut.stride,ue=Q.offset;if(Ut.isInstancedInterleavedBuffer){for(let Ct=0;Ct<ct.locationSize;Ct++)_(ct.location+Ct,Ut.meshPerAttribute);R.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Ut.meshPerAttribute*Ut.count)}else for(let Ct=0;Ct<ct.locationSize;Ct++)b(ct.location+Ct);o.bindBuffer(o.ARRAY_BUFFER,St);for(let Ct=0;Ct<ct.locationSize;Ct++)E(ct.location+Ct,dt/ct.locationSize,Rt,nt,X*Pt,(ue+dt/ct.locationSize*Ct)*Pt,Et)}else{if(Q.isInstancedBufferAttribute){for(let Ut=0;Ut<ct.locationSize;Ut++)_(ct.location+Ut,Q.meshPerAttribute);R.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let Ut=0;Ut<ct.locationSize;Ut++)b(ct.location+Ut);o.bindBuffer(o.ARRAY_BUFFER,St);for(let Ut=0;Ut<ct.locationSize;Ut++)E(ct.location+Ut,dt/ct.locationSize,Rt,nt,dt*Pt,dt/ct.locationSize*Ut*Pt,Et)}}else if(H!==void 0){const nt=H[et];if(nt!==void 0)switch(nt.length){case 2:o.vertexAttrib2fv(ct.location,nt);break;case 3:o.vertexAttrib3fv(ct.location,nt);break;case 4:o.vertexAttrib4fv(ct.location,nt);break;default:o.vertexAttrib1fv(ct.location,nt)}}}}S()}function w(){L();for(const R in r){const k=r[R];for(const F in k){const G=k[F];for(const W in G)g(G[W].object),delete G[W];delete k[F]}delete r[R]}}function y(R){if(r[R.id]===void 0)return;const k=r[R.id];for(const F in k){const G=k[F];for(const W in G)g(G[W].object),delete G[W];delete k[F]}delete r[R.id]}function T(R){for(const k in r){const F=r[k];if(F[R.id]===void 0)continue;const G=F[R.id];for(const W in G)g(G[W].object),delete G[W];delete F[R.id]}}function L(){I(),h=!0,l!==c&&(l=c,p(l.object))}function I(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:L,resetDefaultState:I,dispose:w,releaseStatesOfGeometry:y,releaseStatesOfProgram:T,initAttributes:M,enableAttribute:b,disableUnusedAttributes:S}}function Hg(o,t,e,n){const i=n.isWebGL2;let s;function a(h){s=h}function r(h,u){o.drawArrays(s,h,u),e.update(u,s,1)}function c(h,u,f){if(f===0)return;let p,g;if(i)p=o,g="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](s,h,u,f),e.update(u,s,f)}function l(h,u,f){if(f===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{p.multiDrawArraysWEBGL(s,h,0,u,0,f);let g=0;for(let v=0;v<f;v++)g+=u[v];e.update(g,s,1)}}this.setMode=a,this.render=r,this.renderInstances=c,this.renderMultiDraw=l}function Vg(o,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=o.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function s(E){if(E==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&o.constructor.name==="WebGL2RenderingContext";let r=e.precision!==void 0?e.precision:"highp";const c=s(r);c!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",c,"instead."),r=c);const l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),f=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=o.getParameter(o.MAX_TEXTURE_SIZE),g=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),v=o.getParameter(o.MAX_VERTEX_ATTRIBS),m=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),d=o.getParameter(o.MAX_VARYING_VECTORS),x=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),M=f>0,b=a||t.has("OES_texture_float"),_=M&&b,S=a?o.getParameter(o.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:s,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:x,vertexTextures:M,floatFragmentTextures:b,floatVertexTextures:_,maxSamples:S}}function $g(o){const t=this;let e=null,n=0,i=!1,s=!1;const a=new Vi,r=new Qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||i;return i=f,n=u.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,d=o.get(u);if(!i||g===null||g.length===0||s&&!m)s?h(null):l();else{const x=s?0:n,M=x*4;let b=d.clippingState||null;c.value=b,b=h(g,f,M,p);for(let _=0;_!==M;++_)b[_]=e[_];d.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,p,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const d=p+v*4,x=f.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<d)&&(m=new Float32Array(d));for(let M=0,b=p;M!==v;++M,b+=4)a.copy(u[M]).applyMatrix4(x,r),a.normal.toArray(m,b),m[b+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function Xg(o){let t=new WeakMap;function e(a,r){return r===cc?a.mapping=Ws:r===lc&&(a.mapping=Gs),a}function n(a){if(a&&a.isTexture){const r=a.mapping;if(r===cc||r===lc)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new s0(c.height/2);return l.fromEquirectangularTexture(o,a),t.set(a,l),a.addEventListener("dispose",i),e(l.texture,a.mapping)}else return null}}return a}function i(a){const r=a.target;r.removeEventListener("dispose",i);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class er extends rf{constructor(t=-1,e=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-t,a=n+t,r=i+e,c=i-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ps=4,Yl=[.125,.215,.35,.446,.526,.582],Yi=20,Dr=new er,Kl=new Ht;let Ir=null,kr=0,Ur=0;const $i=(1+Math.sqrt(5))/2,bs=1/$i,Zl=[new B(1,1,1),new B(-1,1,1),new B(1,1,-1),new B(-1,1,-1),new B(0,$i,bs),new B(0,$i,-bs),new B(bs,0,$i),new B(-bs,0,$i),new B($i,bs,0),new B(-$i,bs,0)];class Jl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Ir=this._renderer.getRenderTarget(),kr=this._renderer.getActiveCubeFace(),Ur=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,i,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=eh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=th(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ir,kr,Ur),t.scissorTest=!1,aa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ws||t.mapping===Gs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ir=this._renderer.getRenderTarget(),kr=this._renderer.getActiveCubeFace(),Ur=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:We,minFilter:We,generateMipmaps:!1,type:Li,format:Ae,colorSpace:Mi,depthBuffer:!1},i=Ql(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ql(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=jg(s)),this._blurMaterial=qg(s,t,e)}return i}_compileMaterial(t){const e=new ye(this._lodPlanes[0],t);this._renderer.compile(e,Dr)}_sceneToCubeUV(t,e,n,i){const r=new _n(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Kl),h.toneMapping=Ri,h.autoClear=!1;const p=new nf({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),g=new ye(new Po,p);let v=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,v=!0):(p.color.copy(Kl),v=!0);for(let d=0;d<6;d++){const x=d%3;x===0?(r.up.set(0,c[d],0),r.lookAt(l[d],0,0)):x===1?(r.up.set(0,0,c[d]),r.lookAt(0,l[d],0)):(r.up.set(0,c[d],0),r.lookAt(0,0,l[d]));const M=this._cubeSize;aa(i,x*M,d>2?M:0,M,M),h.setRenderTarget(i),v&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Ws||t.mapping===Gs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=eh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=th());const s=i?this._cubemapMaterial:this._equirectMaterial,a=new ye(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;aa(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Dr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const s=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=Zl[(i-1)%Zl.length];this._blur(t,i-1,i,s,a)}e.autoClear=n}_blur(t,e,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",s),this._halfBlur(a,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ye(this._lodPlanes[i],l),f=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Yi-1),v=s/g,m=isFinite(s)?1+Math.floor(h*v):Yi;m>Yi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Yi}`);const d=[];let x=0;for(let E=0;E<Yi;++E){const A=E/v,w=Math.exp(-A*A/2);d.push(w),E===0?x+=w:E<m&&(x+=2*w)}for(let E=0;E<d.length;E++)d[E]=d[E]/x;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:M}=this;f.dTheta.value=g,f.mipInt.value=M-n;const b=this._sizeLods[i],_=3*b*(i>M-Ps?i-M+Ps:0),S=4*(this._cubeSize-b);aa(e,_,S,3*b,2*b),c.setRenderTarget(e),c.render(u,Dr)}}function jg(o){const t=[],e=[],n=[];let i=o;const s=o-Ps+1+Yl.length;for(let a=0;a<s;a++){const r=Math.pow(2,i);e.push(r);let c=1/r;a>o-Ps?c=Yl[a-o+Ps-1]:a===0&&(c=0),n.push(c);const l=1/(r-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,v=3,m=2,d=1,x=new Float32Array(v*g*p),M=new Float32Array(m*g*p),b=new Float32Array(d*g*p);for(let S=0;S<p;S++){const E=S%3*2/3-1,A=S>2?0:-1,w=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];x.set(w,v*g*S),M.set(f,m*g*S);const y=[S,S,S,S,S,S];b.set(y,d*g*S)}const _=new cn;_.setAttribute("position",new De(x,v)),_.setAttribute("uv",new De(M,m)),_.setAttribute("faceIndex",new De(b,d)),t.push(_),i>Ps&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ql(o,t,e){const n=new Jn(o,t,e);return n.texture.mapping=Ja,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function aa(o,t,e,n,i){o.viewport.set(t,e,n,i),o.scissor.set(t,e,n,i)}function qg(o,t,e){const n=new Float32Array(Yi),i=new B(0,1,0);return new Ce({name:"SphericalGaussianBlur",defines:{n:Yi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ic(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function th(){return new Ce({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ic(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function eh(){return new Ce({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Ic(){return`

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
	`}function Yg(o){let t=new WeakMap,e=null;function n(r){if(r&&r.isTexture){const c=r.mapping,l=c===cc||c===lc,h=c===Ws||c===Gs;if(l||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=t.get(r);return e===null&&(e=new Jl(o)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),t.set(r,u),u.texture}else{if(t.has(r))return t.get(r).texture;{const u=r.image;if(l&&u&&u.height>0||h&&u&&i(u)){e===null&&(e=new Jl(o));const f=l?e.fromEquirectangular(r):e.fromCubemap(r);return t.set(r,f),r.addEventListener("dispose",s),f.texture}else return null}}}return r}function i(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Kg(o){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=o.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Zg(o,t,e,n){const i={},s=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const v=f.morphAttributes[g];for(let m=0,d=v.length;m<d;m++)t.remove(v[m])}f.removeEventListener("dispose",a),delete i[f.id];const p=s.get(f);p&&(t.remove(p),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function r(u,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],o.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const v=p[g];for(let m=0,d=v.length;m<d;m++)t.update(v[m],o.ARRAY_BUFFER)}}function l(u){const f=[],p=u.index,g=u.attributes.position;let v=0;if(p!==null){const x=p.array;v=p.version;for(let M=0,b=x.length;M<b;M+=3){const _=x[M+0],S=x[M+1],E=x[M+2];f.push(_,S,S,E,E,_)}}else if(g!==void 0){const x=g.array;v=g.version;for(let M=0,b=x.length/3-1;M<b;M+=3){const _=M+0,S=M+1,E=M+2;f.push(_,S,S,E,E,_)}}else return;const m=new(Zu(f)?of:sf)(f,1);m.version=v;const d=s.get(u);d&&t.remove(d),s.set(u,m)}function h(u){const f=s.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return s.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function Jg(o,t,e,n){const i=n.isWebGL2;let s;function a(p){s=p}let r,c;function l(p){r=p.type,c=p.bytesPerElement}function h(p,g){o.drawElements(s,g,r,p*c),e.update(g,s,1)}function u(p,g,v){if(v===0)return;let m,d;if(i)m=o,d="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](s,g,r,p*c,v),e.update(g,s,v)}function f(p,g,v){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<v;d++)this.render(p[d]/c,g[d]);else{m.multiDrawElementsWEBGL(s,g,0,r,p,0,v);let d=0;for(let x=0;x<v;x++)d+=g[x];e.update(d,s,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function Qg(o){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,r){switch(e.calls++,a){case o.TRIANGLES:e.triangles+=r*(s/3);break;case o.LINES:e.lines+=r*(s/2);break;case o.LINE_STRIP:e.lines+=r*(s-1);break;case o.LINE_LOOP:e.lines+=r*s;break;case o.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function t1(o,t){return o[0]-t[0]}function e1(o,t){return Math.abs(t[1])-Math.abs(o[1])}function n1(o,t,e){const n={},i=new Float32Array(8),s=new WeakMap,a=new ee,r=[];for(let l=0;l<8;l++)r[l]=[l,0];function c(l,h,u){const f=l.morphTargetInfluences;if(t.isWebGL2===!0){const p=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=p!==void 0?p.length:0;let v=s.get(h);if(v===void 0||v.count!==g){let R=function(){L.dispose(),s.delete(h),h.removeEventListener("dispose",R)};v!==void 0&&v.texture.dispose();const x=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,b=h.morphAttributes.color!==void 0,_=h.morphAttributes.position||[],S=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let A=0;x===!0&&(A=1),M===!0&&(A=2),b===!0&&(A=3);let w=h.attributes.position.count*A,y=1;w>t.maxTextureSize&&(y=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const T=new Float32Array(w*y*4*g),L=new tf(T,w,y,g);L.type=pi,L.needsUpdate=!0;const I=A*4;for(let k=0;k<g;k++){const F=_[k],G=S[k],W=E[k],K=w*y*4*k;for(let H=0;H<F.count;H++){const et=H*I;x===!0&&(a.fromBufferAttribute(F,H),T[K+et+0]=a.x,T[K+et+1]=a.y,T[K+et+2]=a.z,T[K+et+3]=0),M===!0&&(a.fromBufferAttribute(G,H),T[K+et+4]=a.x,T[K+et+5]=a.y,T[K+et+6]=a.z,T[K+et+7]=0),b===!0&&(a.fromBufferAttribute(W,H),T[K+et+8]=a.x,T[K+et+9]=a.y,T[K+et+10]=a.z,T[K+et+11]=W.itemSize===4?a.w:1)}}v={count:g,texture:L,size:new Vt(w,y)},s.set(h,v),h.addEventListener("dispose",R)}let m=0;for(let x=0;x<f.length;x++)m+=f[x];const d=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(o,"morphTargetBaseInfluence",d),u.getUniforms().setValue(o,"morphTargetInfluences",f),u.getUniforms().setValue(o,"morphTargetsTexture",v.texture,e),u.getUniforms().setValue(o,"morphTargetsTextureSize",v.size)}else{const p=f===void 0?0:f.length;let g=n[h.id];if(g===void 0||g.length!==p){g=[];for(let M=0;M<p;M++)g[M]=[M,0];n[h.id]=g}for(let M=0;M<p;M++){const b=g[M];b[0]=M,b[1]=f[M]}g.sort(e1);for(let M=0;M<8;M++)M<p&&g[M][1]?(r[M][0]=g[M][0],r[M][1]=g[M][1]):(r[M][0]=Number.MAX_SAFE_INTEGER,r[M][1]=0);r.sort(t1);const v=h.morphAttributes.position,m=h.morphAttributes.normal;let d=0;for(let M=0;M<8;M++){const b=r[M],_=b[0],S=b[1];_!==Number.MAX_SAFE_INTEGER&&S?(v&&h.getAttribute("morphTarget"+M)!==v[_]&&h.setAttribute("morphTarget"+M,v[_]),m&&h.getAttribute("morphNormal"+M)!==m[_]&&h.setAttribute("morphNormal"+M,m[_]),i[M]=S,d+=S):(v&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),m&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),i[M]=0)}const x=h.morphTargetsRelative?1:1-d;u.getUniforms().setValue(o,"morphTargetBaseInfluence",x),u.getUniforms().setValue(o,"morphTargetInfluences",i)}}return{update:c}}function i1(o,t,e,n){let i=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),i.get(c)!==l&&(e.update(c.instanceMatrix,o.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,o.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return u}function a(){i=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}class kc extends dn{constructor(t,e,n,i,s,a,r,c,l,h){if(h=h!==void 0?h:es,h!==es&&h!==Hs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===es&&(n=di),n===void 0&&h===Hs&&(n=ts),super(null,i,s,a,r,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:ie,this.minFilter=c!==void 0?c:ie,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const hf=new dn,uf=new kc(1,1);uf.compareFunction=Ku;const ff=new tf,df=new Wp,pf=new cf,nh=[],ih=[],sh=new Float32Array(16),oh=new Float32Array(9),ah=new Float32Array(4);function js(o,t,e){const n=o[0];if(n<=0||n>0)return o;const i=t*e;let s=nh[i];if(s===void 0&&(s=new Float32Array(i),nh[i]=s),t!==0){n.toArray(s,0);for(let a=1,r=0;a!==t;++a)r+=e,o[a].toArray(s,r)}return s}function Ie(o,t){if(o.length!==t.length)return!1;for(let e=0,n=o.length;e<n;e++)if(o[e]!==t[e])return!1;return!0}function ke(o,t){for(let e=0,n=t.length;e<n;e++)o[e]=t[e]}function nr(o,t){let e=ih[t];e===void 0&&(e=new Int32Array(t),ih[t]=e);for(let n=0;n!==t;++n)e[n]=o.allocateTextureUnit();return e}function s1(o,t){const e=this.cache;e[0]!==t&&(o.uniform1f(this.addr,t),e[0]=t)}function o1(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(o.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;o.uniform2fv(this.addr,t),ke(e,t)}}function a1(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(o.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(o.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;o.uniform3fv(this.addr,t),ke(e,t)}}function r1(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(o.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;o.uniform4fv(this.addr,t),ke(e,t)}}function c1(o,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;o.uniformMatrix2fv(this.addr,!1,t),ke(e,t)}else{if(Ie(e,n))return;ah.set(n),o.uniformMatrix2fv(this.addr,!1,ah),ke(e,n)}}function l1(o,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;o.uniformMatrix3fv(this.addr,!1,t),ke(e,t)}else{if(Ie(e,n))return;oh.set(n),o.uniformMatrix3fv(this.addr,!1,oh),ke(e,n)}}function h1(o,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;o.uniformMatrix4fv(this.addr,!1,t),ke(e,t)}else{if(Ie(e,n))return;sh.set(n),o.uniformMatrix4fv(this.addr,!1,sh),ke(e,n)}}function u1(o,t){const e=this.cache;e[0]!==t&&(o.uniform1i(this.addr,t),e[0]=t)}function f1(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(o.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;o.uniform2iv(this.addr,t),ke(e,t)}}function d1(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(o.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;o.uniform3iv(this.addr,t),ke(e,t)}}function p1(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(o.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;o.uniform4iv(this.addr,t),ke(e,t)}}function m1(o,t){const e=this.cache;e[0]!==t&&(o.uniform1ui(this.addr,t),e[0]=t)}function g1(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(o.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;o.uniform2uiv(this.addr,t),ke(e,t)}}function v1(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(o.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;o.uniform3uiv(this.addr,t),ke(e,t)}}function x1(o,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(o.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;o.uniform4uiv(this.addr,t),ke(e,t)}}function M1(o,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(o.uniform1i(this.addr,i),n[0]=i);const s=this.type===o.SAMPLER_2D_SHADOW?uf:hf;e.setTexture2D(t||s,i)}function y1(o,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(o.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||df,i)}function _1(o,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(o.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||pf,i)}function w1(o,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(o.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||ff,i)}function b1(o){switch(o){case 5126:return s1;case 35664:return o1;case 35665:return a1;case 35666:return r1;case 35674:return c1;case 35675:return l1;case 35676:return h1;case 5124:case 35670:return u1;case 35667:case 35671:return f1;case 35668:case 35672:return d1;case 35669:case 35673:return p1;case 5125:return m1;case 36294:return g1;case 36295:return v1;case 36296:return x1;case 35678:case 36198:case 36298:case 36306:case 35682:return M1;case 35679:case 36299:case 36307:return y1;case 35680:case 36300:case 36308:case 36293:return _1;case 36289:case 36303:case 36311:case 36292:return w1}}function S1(o,t){o.uniform1fv(this.addr,t)}function E1(o,t){const e=js(t,this.size,2);o.uniform2fv(this.addr,e)}function A1(o,t){const e=js(t,this.size,3);o.uniform3fv(this.addr,e)}function T1(o,t){const e=js(t,this.size,4);o.uniform4fv(this.addr,e)}function C1(o,t){const e=js(t,this.size,4);o.uniformMatrix2fv(this.addr,!1,e)}function R1(o,t){const e=js(t,this.size,9);o.uniformMatrix3fv(this.addr,!1,e)}function L1(o,t){const e=js(t,this.size,16);o.uniformMatrix4fv(this.addr,!1,e)}function P1(o,t){o.uniform1iv(this.addr,t)}function D1(o,t){o.uniform2iv(this.addr,t)}function I1(o,t){o.uniform3iv(this.addr,t)}function k1(o,t){o.uniform4iv(this.addr,t)}function U1(o,t){o.uniform1uiv(this.addr,t)}function z1(o,t){o.uniform2uiv(this.addr,t)}function F1(o,t){o.uniform3uiv(this.addr,t)}function N1(o,t){o.uniform4uiv(this.addr,t)}function O1(o,t,e){const n=this.cache,i=t.length,s=nr(e,i);Ie(n,s)||(o.uniform1iv(this.addr,s),ke(n,s));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||hf,s[a])}function B1(o,t,e){const n=this.cache,i=t.length,s=nr(e,i);Ie(n,s)||(o.uniform1iv(this.addr,s),ke(n,s));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||df,s[a])}function W1(o,t,e){const n=this.cache,i=t.length,s=nr(e,i);Ie(n,s)||(o.uniform1iv(this.addr,s),ke(n,s));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||pf,s[a])}function G1(o,t,e){const n=this.cache,i=t.length,s=nr(e,i);Ie(n,s)||(o.uniform1iv(this.addr,s),ke(n,s));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||ff,s[a])}function H1(o){switch(o){case 5126:return S1;case 35664:return E1;case 35665:return A1;case 35666:return T1;case 35674:return C1;case 35675:return R1;case 35676:return L1;case 5124:case 35670:return P1;case 35667:case 35671:return D1;case 35668:case 35672:return I1;case 35669:case 35673:return k1;case 5125:return U1;case 36294:return z1;case 36295:return F1;case 36296:return N1;case 35678:case 36198:case 36298:case 36306:case 35682:return O1;case 35679:case 36299:case 36307:return B1;case 35680:case 36300:case 36308:case 36293:return W1;case 36289:case 36303:case 36311:case 36292:return G1}}class V1{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=b1(e.type)}}class $1{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=H1(e.type)}}class X1{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const r=i[s];r.setValue(t,e[r.id],n)}}}const zr=/(\w+)(\])?(\[|\.)?/g;function rh(o,t){o.seq.push(t),o.map[t.id]=t}function j1(o,t,e){const n=o.name,i=n.length;for(zr.lastIndex=0;;){const s=zr.exec(n),a=zr.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===i){rh(e,l===void 0?new V1(r,o,t):new $1(r,o,t));break}else{let u=e.map[r];u===void 0&&(u=new X1(r),rh(e,u)),e=u}}}class Aa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=t.getActiveUniform(e,i),a=t.getUniformLocation(e,s.name);j1(s,a,this)}}setValue(t,e,n,i){const s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,a=e.length;s!==a;++s){const r=e[s],c=n[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,s=t.length;i!==s;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function ch(o,t,e){const n=o.createShader(t);return o.shaderSource(n,e),o.compileShader(n),n}const q1=37297;let Y1=0;function K1(o,t){const e=o.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=i;a<s;a++){const r=a+1;n.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return n.join(`
`)}function Z1(o){const t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(o);let n;switch(t===e?n="":t===Fa&&e===za?n="LinearDisplayP3ToLinearSRGB":t===za&&e===Fa&&(n="LinearSRGBToLinearDisplayP3"),o){case Mi:case Qa:return[n,"LinearTransferOETF"];case Be:case Cc:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",o),[n,"LinearTransferOETF"]}}function lh(o,t,e){const n=o.getShaderParameter(t,o.COMPILE_STATUS),i=o.getShaderInfoLog(t).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const a=parseInt(s[1]);return e.toUpperCase()+`

`+i+`

`+K1(o.getShaderSource(t),a)}else return i}function J1(o,t){const e=Z1(t);return`vec4 ${o}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Q1(o,t){let e;switch(t){case Jd:e="Linear";break;case Qd:e="Reinhard";break;case tp:e="OptimizedCineon";break;case ep:e="ACESFilmic";break;case ip:e="AgX";break;case np:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+o+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function tv(o){return[o.extensionDerivatives||o.envMapCubeUVHeight||o.bumpMap||o.normalMapTangentSpace||o.clearcoatNormalMap||o.flatShading||o.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(o.extensionFragDepth||o.logarithmicDepthBuffer)&&o.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",o.extensionDrawBuffers&&o.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(o.extensionShaderTextureLOD||o.envMap||o.transmission)&&o.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ds).join(`
`)}function ev(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ds).join(`
`)}function nv(o){const t=[];for(const e in o){const n=o[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function iv(o,t){const e={},n=o.getProgramParameter(t,o.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=o.getActiveAttrib(t,i),a=s.name;let r=1;s.type===o.FLOAT_MAT2&&(r=2),s.type===o.FLOAT_MAT3&&(r=3),s.type===o.FLOAT_MAT4&&(r=4),e[a]={type:s.type,location:o.getAttribLocation(t,a),locationSize:r}}return e}function Ds(o){return o!==""}function hh(o,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function uh(o,t){return o.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const sv=/^[ \t]*#include +<([\w\d./]+)>/gm;function dc(o){return o.replace(sv,av)}const ov=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function av(o,t){let e=Kt[t];if(e===void 0){const n=ov.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return dc(e)}const rv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fh(o){return o.replace(rv,cv)}function cv(o,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function dh(o){let t="precision "+o.precision+` float;
precision `+o.precision+" int;";return o.precision==="highp"?t+=`
#define HIGH_PRECISION`:o.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function lv(o){let t="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===Nu?t="SHADOWMAP_TYPE_PCF":o.shadowMapType===Ad?t="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===ri&&(t="SHADOWMAP_TYPE_VSM"),t}function hv(o){let t="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case Ws:case Gs:t="ENVMAP_TYPE_CUBE";break;case Ja:t="ENVMAP_TYPE_CUBE_UV";break}return t}function uv(o){let t="ENVMAP_MODE_REFLECTION";if(o.envMap)switch(o.envMapMode){case Gs:t="ENVMAP_MODE_REFRACTION";break}return t}function fv(o){let t="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case Ou:t="ENVMAP_BLENDING_MULTIPLY";break;case Kd:t="ENVMAP_BLENDING_MIX";break;case Zd:t="ENVMAP_BLENDING_ADD";break}return t}function dv(o){const t=o.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function pv(o,t,e,n){const i=o.getContext(),s=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=lv(e),l=hv(e),h=uv(e),u=fv(e),f=dv(e),p=e.isWebGL2?"":tv(e),g=ev(e),v=nv(s),m=i.createProgram();let d,x,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Ds).join(`
`),d.length>0&&(d+=`
`),x=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Ds).join(`
`),x.length>0&&(x+=`
`)):(d=[dh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ds).join(`
`),x=[p,dh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ri?"#define TONE_MAPPING":"",e.toneMapping!==Ri?Kt.tonemapping_pars_fragment:"",e.toneMapping!==Ri?Q1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,J1("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ds).join(`
`)),a=dc(a),a=hh(a,e),a=uh(a,e),r=dc(r),r=hh(r,e),r=uh(r,e),a=fh(a),r=fh(r),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,x=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Pl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Pl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const b=M+d+a,_=M+x+r,S=ch(i,i.VERTEX_SHADER,b),E=ch(i,i.FRAGMENT_SHADER,_);i.attachShader(m,S),i.attachShader(m,E),e.index0AttributeName!==void 0?i.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function A(L){if(o.debug.checkShaderErrors){const I=i.getProgramInfoLog(m).trim(),R=i.getShaderInfoLog(S).trim(),k=i.getShaderInfoLog(E).trim();let F=!0,G=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(F=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(i,m,S,E);else{const W=lh(i,S,"vertex"),K=lh(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Program Info Log: `+I+`
`+W+`
`+K)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(R===""||k==="")&&(G=!1);G&&(L.diagnostics={runnable:F,programLog:I,vertexShader:{log:R,prefix:d},fragmentShader:{log:k,prefix:x}})}i.deleteShader(S),i.deleteShader(E),w=new Aa(i,m),y=iv(i,m)}let w;this.getUniforms=function(){return w===void 0&&A(this),w};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let T=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,q1)),T},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Y1++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=S,this.fragmentShader=E,this}let mv=0;class gv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new vv(t),e.set(t,n)),n}}class vv{constructor(t){this.id=mv++,this.code=t,this.usedTimes=0}}function xv(o,t,e,n,i,s,a){const r=new Pc,c=new gv,l=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,f=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return w===0?"uv":`uv${w}`}function m(w,y,T,L,I){const R=L.fog,k=I.geometry,F=w.isMeshStandardMaterial?L.environment:null,G=(w.isMeshStandardMaterial?e:t).get(w.envMap||F),W=G&&G.mapping===Ja?G.image.height:null,K=g[w.type];w.precision!==null&&(p=i.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const H=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,et=H!==void 0?H.length:0;let ct=0;k.morphAttributes.position!==void 0&&(ct=1),k.morphAttributes.normal!==void 0&&(ct=2),k.morphAttributes.color!==void 0&&(ct=3);let Q,nt,dt,Mt;if(K){const we=$n[K];Q=we.vertexShader,nt=we.fragmentShader}else Q=w.vertexShader,nt=w.fragmentShader,c.update(w),dt=c.getVertexShaderID(w),Mt=c.getFragmentShaderID(w);const St=o.getRenderTarget(),Rt=I.isInstancedMesh===!0,Pt=I.isBatchedMesh===!0,Et=!!w.map,Ut=!!w.matcap,X=!!G,ue=!!w.aoMap,Ct=!!w.lightMap,Ft=!!w.bumpMap,Y=!!w.normalMap,at=!!w.displacementMap,lt=!!w.emissiveMap,P=!!w.metalnessMap,C=!!w.roughnessMap,z=w.anisotropy>0,O=w.clearcoat>0,Z=w.iridescence>0,V=w.sheen>0,tt=w.transmission>0,it=z&&!!w.anisotropyMap,pt=O&&!!w.clearcoatMap,yt=O&&!!w.clearcoatNormalMap,Yt=O&&!!w.clearcoatRoughnessMap,rt=Z&&!!w.iridescenceMap,oe=Z&&!!w.iridescenceThicknessMap,$=V&&!!w.sheenColorMap,It=V&&!!w.sheenRoughnessMap,At=!!w.specularMap,mt=!!w.specularColorMap,Bt=!!w.specularIntensityMap,te=tt&&!!w.transmissionMap,he=tt&&!!w.thicknessMap,Ot=!!w.gradientMap,ot=!!w.alphaMap,U=w.alphaTest>0,ht=!!w.alphaHash,ut=!!w.extensions,zt=!!k.attributes.uv1,Nt=!!k.attributes.uv2,ne=!!k.attributes.uv3;let ae=Ri;return w.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(ae=o.toneMapping),{isWebGL2:h,shaderID:K,shaderType:w.type,shaderName:w.name,vertexShader:Q,fragmentShader:nt,defines:w.defines,customVertexShaderID:dt,customFragmentShaderID:Mt,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Pt,instancing:Rt,instancingColor:Rt&&I.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:St===null?o.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:Mi,map:Et,matcap:Ut,envMap:X,envMapMode:X&&G.mapping,envMapCubeUVHeight:W,aoMap:ue,lightMap:Ct,bumpMap:Ft,normalMap:Y,displacementMap:f&&at,emissiveMap:lt,normalMapObjectSpace:Y&&w.normalMapType===pp,normalMapTangentSpace:Y&&w.normalMapType===dp,metalnessMap:P,roughnessMap:C,anisotropy:z,anisotropyMap:it,clearcoat:O,clearcoatMap:pt,clearcoatNormalMap:yt,clearcoatRoughnessMap:Yt,iridescence:Z,iridescenceMap:rt,iridescenceThicknessMap:oe,sheen:V,sheenColorMap:$,sheenRoughnessMap:It,specularMap:At,specularColorMap:mt,specularIntensityMap:Bt,transmission:tt,transmissionMap:te,thicknessMap:he,gradientMap:Ot,opaque:w.transparent===!1&&w.blending===Ns,alphaMap:ot,alphaTest:U,alphaHash:ht,combine:w.combine,mapUv:Et&&v(w.map.channel),aoMapUv:ue&&v(w.aoMap.channel),lightMapUv:Ct&&v(w.lightMap.channel),bumpMapUv:Ft&&v(w.bumpMap.channel),normalMapUv:Y&&v(w.normalMap.channel),displacementMapUv:at&&v(w.displacementMap.channel),emissiveMapUv:lt&&v(w.emissiveMap.channel),metalnessMapUv:P&&v(w.metalnessMap.channel),roughnessMapUv:C&&v(w.roughnessMap.channel),anisotropyMapUv:it&&v(w.anisotropyMap.channel),clearcoatMapUv:pt&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:yt&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Yt&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:rt&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:$&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:It&&v(w.sheenRoughnessMap.channel),specularMapUv:At&&v(w.specularMap.channel),specularColorMapUv:mt&&v(w.specularColorMap.channel),specularIntensityMapUv:Bt&&v(w.specularIntensityMap.channel),transmissionMapUv:te&&v(w.transmissionMap.channel),thicknessMapUv:he&&v(w.thicknessMap.channel),alphaMapUv:ot&&v(w.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Y||z),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,vertexUv1s:zt,vertexUv2s:Nt,vertexUv3s:ne,pointsUvs:I.isPoints===!0&&!!k.attributes.uv&&(Et||ot),fog:!!R,useFog:w.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:I.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:et,morphTextureStride:ct,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:o.shadowMap.enabled&&T.length>0,shadowMapType:o.shadowMap.type,toneMapping:ae,useLegacyLights:o._useLegacyLights,decodeVideoTexture:Et&&w.map.isVideoTexture===!0&&le.getTransfer(w.map.colorSpace)===fe,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Bn,flipSided:w.side===rn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionDerivatives:ut&&w.extensions.derivatives===!0,extensionFragDepth:ut&&w.extensions.fragDepth===!0,extensionDrawBuffers:ut&&w.extensions.drawBuffers===!0,extensionShaderTextureLOD:ut&&w.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ut&&w.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()}}function d(w){const y=[];if(w.shaderID?y.push(w.shaderID):(y.push(w.customVertexShaderID),y.push(w.customFragmentShaderID)),w.defines!==void 0)for(const T in w.defines)y.push(T),y.push(w.defines[T]);return w.isRawShaderMaterial===!1&&(x(y,w),M(y,w),y.push(o.outputColorSpace)),y.push(w.customProgramCacheKey),y.join()}function x(w,y){w.push(y.precision),w.push(y.outputColorSpace),w.push(y.envMapMode),w.push(y.envMapCubeUVHeight),w.push(y.mapUv),w.push(y.alphaMapUv),w.push(y.lightMapUv),w.push(y.aoMapUv),w.push(y.bumpMapUv),w.push(y.normalMapUv),w.push(y.displacementMapUv),w.push(y.emissiveMapUv),w.push(y.metalnessMapUv),w.push(y.roughnessMapUv),w.push(y.anisotropyMapUv),w.push(y.clearcoatMapUv),w.push(y.clearcoatNormalMapUv),w.push(y.clearcoatRoughnessMapUv),w.push(y.iridescenceMapUv),w.push(y.iridescenceThicknessMapUv),w.push(y.sheenColorMapUv),w.push(y.sheenRoughnessMapUv),w.push(y.specularMapUv),w.push(y.specularColorMapUv),w.push(y.specularIntensityMapUv),w.push(y.transmissionMapUv),w.push(y.thicknessMapUv),w.push(y.combine),w.push(y.fogExp2),w.push(y.sizeAttenuation),w.push(y.morphTargetsCount),w.push(y.morphAttributeCount),w.push(y.numDirLights),w.push(y.numPointLights),w.push(y.numSpotLights),w.push(y.numSpotLightMaps),w.push(y.numHemiLights),w.push(y.numRectAreaLights),w.push(y.numDirLightShadows),w.push(y.numPointLightShadows),w.push(y.numSpotLightShadows),w.push(y.numSpotLightShadowsWithMaps),w.push(y.numLightProbes),w.push(y.shadowMapType),w.push(y.toneMapping),w.push(y.numClippingPlanes),w.push(y.numClipIntersection),w.push(y.depthPacking)}function M(w,y){r.disableAll(),y.isWebGL2&&r.enable(0),y.supportsVertexTextures&&r.enable(1),y.instancing&&r.enable(2),y.instancingColor&&r.enable(3),y.matcap&&r.enable(4),y.envMap&&r.enable(5),y.normalMapObjectSpace&&r.enable(6),y.normalMapTangentSpace&&r.enable(7),y.clearcoat&&r.enable(8),y.iridescence&&r.enable(9),y.alphaTest&&r.enable(10),y.vertexColors&&r.enable(11),y.vertexAlphas&&r.enable(12),y.vertexUv1s&&r.enable(13),y.vertexUv2s&&r.enable(14),y.vertexUv3s&&r.enable(15),y.vertexTangents&&r.enable(16),y.anisotropy&&r.enable(17),y.alphaHash&&r.enable(18),y.batching&&r.enable(19),w.push(r.mask),r.disableAll(),y.fog&&r.enable(0),y.useFog&&r.enable(1),y.flatShading&&r.enable(2),y.logarithmicDepthBuffer&&r.enable(3),y.skinning&&r.enable(4),y.morphTargets&&r.enable(5),y.morphNormals&&r.enable(6),y.morphColors&&r.enable(7),y.premultipliedAlpha&&r.enable(8),y.shadowMapEnabled&&r.enable(9),y.useLegacyLights&&r.enable(10),y.doubleSided&&r.enable(11),y.flipSided&&r.enable(12),y.useDepthPacking&&r.enable(13),y.dithering&&r.enable(14),y.transmission&&r.enable(15),y.sheen&&r.enable(16),y.opaque&&r.enable(17),y.pointsUvs&&r.enable(18),y.decodeVideoTexture&&r.enable(19),w.push(r.mask)}function b(w){const y=g[w.type];let T;if(y){const L=$n[y];T=t0.clone(L.uniforms)}else T=w.uniforms;return T}function _(w,y){let T;for(let L=0,I=l.length;L<I;L++){const R=l[L];if(R.cacheKey===y){T=R,++T.usedTimes;break}}return T===void 0&&(T=new pv(o,y,w,s),l.push(T)),T}function S(w){if(--w.usedTimes===0){const y=l.indexOf(w);l[y]=l[l.length-1],l.pop(),w.destroy()}}function E(w){c.remove(w)}function A(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:b,acquireProgram:_,releaseProgram:S,releaseShaderCache:E,programs:l,dispose:A}}function Mv(){let o=new WeakMap;function t(s){let a=o.get(s);return a===void 0&&(a={},o.set(s,a)),a}function e(s){o.delete(s)}function n(s,a,r){o.get(s)[a]=r}function i(){o=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function yv(o,t){return o.groupOrder!==t.groupOrder?o.groupOrder-t.groupOrder:o.renderOrder!==t.renderOrder?o.renderOrder-t.renderOrder:o.material.id!==t.material.id?o.material.id-t.material.id:o.z!==t.z?o.z-t.z:o.id-t.id}function ph(o,t){return o.groupOrder!==t.groupOrder?o.groupOrder-t.groupOrder:o.renderOrder!==t.renderOrder?o.renderOrder-t.renderOrder:o.z!==t.z?t.z-o.z:o.id-t.id}function mh(){const o=[];let t=0;const e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function a(u,f,p,g,v,m){let d=o[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},o[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=v,d.group=m),t++,d}function r(u,f,p,g,v,m){const d=a(u,f,p,g,v,m);p.transmission>0?n.push(d):p.transparent===!0?i.push(d):e.push(d)}function c(u,f,p,g,v,m){const d=a(u,f,p,g,v,m);p.transmission>0?n.unshift(d):p.transparent===!0?i.unshift(d):e.unshift(d)}function l(u,f){e.length>1&&e.sort(u||yv),n.length>1&&n.sort(f||ph),i.length>1&&i.sort(f||ph)}function h(){for(let u=t,f=o.length;u<f;u++){const p=o[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:r,unshift:c,finish:h,sort:l}}function _v(){let o=new WeakMap;function t(n,i){const s=o.get(n);let a;return s===void 0?(a=new mh,o.set(n,[a])):i>=s.length?(a=new mh,s.push(a)):a=s[i],a}function e(){o=new WeakMap}return{get:t,dispose:e}}function wv(){const o={};return{get:function(t){if(o[t.id]!==void 0)return o[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new B,color:new Ht};break;case"SpotLight":e={position:new B,direction:new B,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new B,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new B,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new B,halfWidth:new B,halfHeight:new B};break}return o[t.id]=e,e}}}function bv(){const o={};return{get:function(t){if(o[t.id]!==void 0)return o[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[t.id]=e,e}}}let Sv=0;function Ev(o,t){return(t.castShadow?2:0)-(o.castShadow?2:0)+(t.map?1:0)-(o.map?1:0)}function Av(o,t){const e=new wv,n=bv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new B);const s=new B,a=new se,r=new se;function c(h,u){let f=0,p=0,g=0;for(let L=0;L<9;L++)i.probe[L].set(0,0,0);let v=0,m=0,d=0,x=0,M=0,b=0,_=0,S=0,E=0,A=0,w=0;h.sort(Ev);const y=u===!0?Math.PI:1;for(let L=0,I=h.length;L<I;L++){const R=h[L],k=R.color,F=R.intensity,G=R.distance,W=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)f+=k.r*F*y,p+=k.g*F*y,g+=k.b*F*y;else if(R.isLightProbe){for(let K=0;K<9;K++)i.probe[K].addScaledVector(R.sh.coefficients[K],F);w++}else if(R.isDirectionalLight){const K=e.get(R);if(K.color.copy(R.color).multiplyScalar(R.intensity*y),R.castShadow){const H=R.shadow,et=n.get(R);et.shadowBias=H.bias,et.shadowNormalBias=H.normalBias,et.shadowRadius=H.radius,et.shadowMapSize=H.mapSize,i.directionalShadow[v]=et,i.directionalShadowMap[v]=W,i.directionalShadowMatrix[v]=R.shadow.matrix,b++}i.directional[v]=K,v++}else if(R.isSpotLight){const K=e.get(R);K.position.setFromMatrixPosition(R.matrixWorld),K.color.copy(k).multiplyScalar(F*y),K.distance=G,K.coneCos=Math.cos(R.angle),K.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),K.decay=R.decay,i.spot[d]=K;const H=R.shadow;if(R.map&&(i.spotLightMap[E]=R.map,E++,H.updateMatrices(R),R.castShadow&&A++),i.spotLightMatrix[d]=H.matrix,R.castShadow){const et=n.get(R);et.shadowBias=H.bias,et.shadowNormalBias=H.normalBias,et.shadowRadius=H.radius,et.shadowMapSize=H.mapSize,i.spotShadow[d]=et,i.spotShadowMap[d]=W,S++}d++}else if(R.isRectAreaLight){const K=e.get(R);K.color.copy(k).multiplyScalar(F),K.halfWidth.set(R.width*.5,0,0),K.halfHeight.set(0,R.height*.5,0),i.rectArea[x]=K,x++}else if(R.isPointLight){const K=e.get(R);if(K.color.copy(R.color).multiplyScalar(R.intensity*y),K.distance=R.distance,K.decay=R.decay,R.castShadow){const H=R.shadow,et=n.get(R);et.shadowBias=H.bias,et.shadowNormalBias=H.normalBias,et.shadowRadius=H.radius,et.shadowMapSize=H.mapSize,et.shadowCameraNear=H.camera.near,et.shadowCameraFar=H.camera.far,i.pointShadow[m]=et,i.pointShadowMap[m]=W,i.pointShadowMatrix[m]=R.shadow.matrix,_++}i.point[m]=K,m++}else if(R.isHemisphereLight){const K=e.get(R);K.skyColor.copy(R.color).multiplyScalar(F*y),K.groundColor.copy(R.groundColor).multiplyScalar(F*y),i.hemi[M]=K,M++}}x>0&&(t.isWebGL2?o.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=vt.LTC_FLOAT_1,i.rectAreaLTC2=vt.LTC_FLOAT_2):(i.rectAreaLTC1=vt.LTC_HALF_1,i.rectAreaLTC2=vt.LTC_HALF_2):o.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=vt.LTC_FLOAT_1,i.rectAreaLTC2=vt.LTC_FLOAT_2):o.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=vt.LTC_HALF_1,i.rectAreaLTC2=vt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=p,i.ambient[2]=g;const T=i.hash;(T.directionalLength!==v||T.pointLength!==m||T.spotLength!==d||T.rectAreaLength!==x||T.hemiLength!==M||T.numDirectionalShadows!==b||T.numPointShadows!==_||T.numSpotShadows!==S||T.numSpotMaps!==E||T.numLightProbes!==w)&&(i.directional.length=v,i.spot.length=d,i.rectArea.length=x,i.point.length=m,i.hemi.length=M,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=S+E-A,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=w,T.directionalLength=v,T.pointLength=m,T.spotLength=d,T.rectAreaLength=x,T.hemiLength=M,T.numDirectionalShadows=b,T.numPointShadows=_,T.numSpotShadows=S,T.numSpotMaps=E,T.numLightProbes=w,i.version=Sv++)}function l(h,u){let f=0,p=0,g=0,v=0,m=0;const d=u.matrixWorldInverse;for(let x=0,M=h.length;x<M;x++){const b=h[x];if(b.isDirectionalLight){const _=i.directional[f];_.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(d),f++}else if(b.isSpotLight){const _=i.spot[g];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(d),_.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(d),g++}else if(b.isRectAreaLight){const _=i.rectArea[v];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(d),r.identity(),a.copy(b.matrixWorld),a.premultiply(d),r.extractRotation(a),_.halfWidth.set(b.width*.5,0,0),_.halfHeight.set(0,b.height*.5,0),_.halfWidth.applyMatrix4(r),_.halfHeight.applyMatrix4(r),v++}else if(b.isPointLight){const _=i.point[p];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(d),p++}else if(b.isHemisphereLight){const _=i.hemi[m];_.direction.setFromMatrixPosition(b.matrixWorld),_.direction.transformDirection(d),m++}}}return{setup:c,setupView:l,state:i}}function gh(o,t){const e=new Av(o,t),n=[],i=[];function s(){n.length=0,i.length=0}function a(u){n.push(u)}function r(u){i.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:s,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:r}}function Tv(o,t){let e=new WeakMap;function n(s,a=0){const r=e.get(s);let c;return r===void 0?(c=new gh(o,t),e.set(s,[c])):a>=r.length?(c=new gh(o,t),r.push(c)):c=r[a],c}function i(){e=new WeakMap}return{get:n,dispose:i}}class Cv extends Lo{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=up,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Rv extends Lo{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Lv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Pv=`uniform sampler2D shadow_pass;
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
}`;function Dv(o,t,e){let n=new ki;const i=new Vt,s=new Vt,a=new ee,r=new Cv({depthPacking:fp}),c=new Rv,l={},h=e.maxTextureSize,u={[xi]:rn,[rn]:xi,[Bn]:Bn},f=new Ce({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Vt},radius:{value:4}},vertexShader:Lv,fragmentShader:Pv}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new cn;g.setAttribute("position",new De(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ye(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nu;let d=this.type;this.render=function(S,E,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const w=o.getRenderTarget(),y=o.getActiveCubeFace(),T=o.getActiveMipmapLevel(),L=o.state;L.setBlending(vi),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const I=d!==ri&&this.type===ri,R=d===ri&&this.type!==ri;for(let k=0,F=S.length;k<F;k++){const G=S[k],W=G.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",G,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);const K=W.getFrameExtents();if(i.multiply(K),s.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/K.x),i.x=s.x*K.x,W.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/K.y),i.y=s.y*K.y,W.mapSize.y=s.y)),W.map===null||I===!0||R===!0){const et=this.type!==ri?{minFilter:ie,magFilter:ie}:{};W.map!==null&&W.map.dispose(),W.map=new Jn(i.x,i.y,et),W.map.texture.name=G.name+".shadowMap",W.camera.updateProjectionMatrix()}o.setRenderTarget(W.map),o.clear();const H=W.getViewportCount();for(let et=0;et<H;et++){const ct=W.getViewport(et);a.set(s.x*ct.x,s.y*ct.y,s.x*ct.z,s.y*ct.w),L.viewport(a),W.updateMatrices(G,et),n=W.getFrustum(),b(E,A,W.camera,G,this.type)}W.isPointLightShadow!==!0&&this.type===ri&&x(W,A),W.needsUpdate=!1}d=this.type,m.needsUpdate=!1,o.setRenderTarget(w,y,T)};function x(S,E){const A=t.update(v);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Jn(i.x,i.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,o.setRenderTarget(S.mapPass),o.clear(),o.renderBufferDirect(E,null,A,f,v,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,o.setRenderTarget(S.map),o.clear(),o.renderBufferDirect(E,null,A,p,v,null)}function M(S,E,A,w){let y=null;const T=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(T!==void 0)y=T;else if(y=A.isPointLight===!0?c:r,o.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const L=y.uuid,I=E.uuid;let R=l[L];R===void 0&&(R={},l[L]=R);let k=R[I];k===void 0&&(k=y.clone(),R[I]=k,E.addEventListener("dispose",_)),y=k}if(y.visible=E.visible,y.wireframe=E.wireframe,w===ri?y.side=E.shadowSide!==null?E.shadowSide:E.side:y.side=E.shadowSide!==null?E.shadowSide:u[E.side],y.alphaMap=E.alphaMap,y.alphaTest=E.alphaTest,y.map=E.map,y.clipShadows=E.clipShadows,y.clippingPlanes=E.clippingPlanes,y.clipIntersection=E.clipIntersection,y.displacementMap=E.displacementMap,y.displacementScale=E.displacementScale,y.displacementBias=E.displacementBias,y.wireframeLinewidth=E.wireframeLinewidth,y.linewidth=E.linewidth,A.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const L=o.properties.get(y);L.light=A}return y}function b(S,E,A,w,y){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&y===ri)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const I=t.update(S),R=S.material;if(Array.isArray(R)){const k=I.groups;for(let F=0,G=k.length;F<G;F++){const W=k[F],K=R[W.materialIndex];if(K&&K.visible){const H=M(S,K,w,y);S.onBeforeShadow(o,S,E,A,I,H,W),o.renderBufferDirect(A,null,I,H,S,W),S.onAfterShadow(o,S,E,A,I,H,W)}}}else if(R.visible){const k=M(S,R,w,y);S.onBeforeShadow(o,S,E,A,I,k,null),o.renderBufferDirect(A,null,I,k,S,null),S.onAfterShadow(o,S,E,A,I,k,null)}}const L=S.children;for(let I=0,R=L.length;I<R;I++)b(L[I],E,A,w,y)}function _(S){S.target.removeEventListener("dispose",_);for(const A in l){const w=l[A],y=S.target.uuid;y in w&&(w[y].dispose(),delete w[y])}}}function Iv(o,t,e){const n=e.isWebGL2;function i(){let U=!1;const ht=new ee;let ut=null;const zt=new ee(0,0,0,0);return{setMask:function(Nt){ut!==Nt&&!U&&(o.colorMask(Nt,Nt,Nt,Nt),ut=Nt)},setLocked:function(Nt){U=Nt},setClear:function(Nt,ne,ae,pe,we){we===!0&&(Nt*=pe,ne*=pe,ae*=pe),ht.set(Nt,ne,ae,pe),zt.equals(ht)===!1&&(o.clearColor(Nt,ne,ae,pe),zt.copy(ht))},reset:function(){U=!1,ut=null,zt.set(-1,0,0,0)}}}function s(){let U=!1,ht=null,ut=null,zt=null;return{setTest:function(Nt){Nt?Pt(o.DEPTH_TEST):Et(o.DEPTH_TEST)},setMask:function(Nt){ht!==Nt&&!U&&(o.depthMask(Nt),ht=Nt)},setFunc:function(Nt){if(ut!==Nt){switch(Nt){case Hd:o.depthFunc(o.NEVER);break;case Vd:o.depthFunc(o.ALWAYS);break;case $d:o.depthFunc(o.LESS);break;case Ia:o.depthFunc(o.LEQUAL);break;case Xd:o.depthFunc(o.EQUAL);break;case jd:o.depthFunc(o.GEQUAL);break;case qd:o.depthFunc(o.GREATER);break;case Yd:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}ut=Nt}},setLocked:function(Nt){U=Nt},setClear:function(Nt){zt!==Nt&&(o.clearDepth(Nt),zt=Nt)},reset:function(){U=!1,ht=null,ut=null,zt=null}}}function a(){let U=!1,ht=null,ut=null,zt=null,Nt=null,ne=null,ae=null,pe=null,we=null;return{setTest:function(re){U||(re?Pt(o.STENCIL_TEST):Et(o.STENCIL_TEST))},setMask:function(re){ht!==re&&!U&&(o.stencilMask(re),ht=re)},setFunc:function(re,ze,Sn){(ut!==re||zt!==ze||Nt!==Sn)&&(o.stencilFunc(re,ze,Sn),ut=re,zt=ze,Nt=Sn)},setOp:function(re,ze,Sn){(ne!==re||ae!==ze||pe!==Sn)&&(o.stencilOp(re,ze,Sn),ne=re,ae=ze,pe=Sn)},setLocked:function(re){U=re},setClear:function(re){we!==re&&(o.clearStencil(re),we=re)},reset:function(){U=!1,ht=null,ut=null,zt=null,Nt=null,ne=null,ae=null,pe=null,we=null}}}const r=new i,c=new s,l=new a,h=new WeakMap,u=new WeakMap;let f={},p={},g=new WeakMap,v=[],m=null,d=!1,x=null,M=null,b=null,_=null,S=null,E=null,A=null,w=new Ht(0,0,0),y=0,T=!1,L=null,I=null,R=null,k=null,F=null;const G=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,K=0;const H=o.getParameter(o.VERSION);H.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(H)[1]),W=K>=1):H.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),W=K>=2);let et=null,ct={};const Q=o.getParameter(o.SCISSOR_BOX),nt=o.getParameter(o.VIEWPORT),dt=new ee().fromArray(Q),Mt=new ee().fromArray(nt);function St(U,ht,ut,zt){const Nt=new Uint8Array(4),ne=o.createTexture();o.bindTexture(U,ne),o.texParameteri(U,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(U,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let ae=0;ae<ut;ae++)n&&(U===o.TEXTURE_3D||U===o.TEXTURE_2D_ARRAY)?o.texImage3D(ht,0,o.RGBA,1,1,zt,0,o.RGBA,o.UNSIGNED_BYTE,Nt):o.texImage2D(ht+ae,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,Nt);return ne}const Rt={};Rt[o.TEXTURE_2D]=St(o.TEXTURE_2D,o.TEXTURE_2D,1),Rt[o.TEXTURE_CUBE_MAP]=St(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Rt[o.TEXTURE_2D_ARRAY]=St(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),Rt[o.TEXTURE_3D]=St(o.TEXTURE_3D,o.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Pt(o.DEPTH_TEST),c.setFunc(Ia),lt(!1),P(Qc),Pt(o.CULL_FACE),Y(vi);function Pt(U){f[U]!==!0&&(o.enable(U),f[U]=!0)}function Et(U){f[U]!==!1&&(o.disable(U),f[U]=!1)}function Ut(U,ht){return p[U]!==ht?(o.bindFramebuffer(U,ht),p[U]=ht,n&&(U===o.DRAW_FRAMEBUFFER&&(p[o.FRAMEBUFFER]=ht),U===o.FRAMEBUFFER&&(p[o.DRAW_FRAMEBUFFER]=ht)),!0):!1}function X(U,ht){let ut=v,zt=!1;if(U)if(ut=g.get(ht),ut===void 0&&(ut=[],g.set(ht,ut)),U.isWebGLMultipleRenderTargets){const Nt=U.texture;if(ut.length!==Nt.length||ut[0]!==o.COLOR_ATTACHMENT0){for(let ne=0,ae=Nt.length;ne<ae;ne++)ut[ne]=o.COLOR_ATTACHMENT0+ne;ut.length=Nt.length,zt=!0}}else ut[0]!==o.COLOR_ATTACHMENT0&&(ut[0]=o.COLOR_ATTACHMENT0,zt=!0);else ut[0]!==o.BACK&&(ut[0]=o.BACK,zt=!0);zt&&(e.isWebGL2?o.drawBuffers(ut):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ut))}function ue(U){return m!==U?(o.useProgram(U),m=U,!0):!1}const Ct={[qi]:o.FUNC_ADD,[Cd]:o.FUNC_SUBTRACT,[Rd]:o.FUNC_REVERSE_SUBTRACT};if(n)Ct[el]=o.MIN,Ct[nl]=o.MAX;else{const U=t.get("EXT_blend_minmax");U!==null&&(Ct[el]=U.MIN_EXT,Ct[nl]=U.MAX_EXT)}const Ft={[Ld]:o.ZERO,[Pd]:o.ONE,[Dd]:o.SRC_COLOR,[ac]:o.SRC_ALPHA,[Nd]:o.SRC_ALPHA_SATURATE,[zd]:o.DST_COLOR,[kd]:o.DST_ALPHA,[Id]:o.ONE_MINUS_SRC_COLOR,[rc]:o.ONE_MINUS_SRC_ALPHA,[Fd]:o.ONE_MINUS_DST_COLOR,[Ud]:o.ONE_MINUS_DST_ALPHA,[Od]:o.CONSTANT_COLOR,[Bd]:o.ONE_MINUS_CONSTANT_COLOR,[Wd]:o.CONSTANT_ALPHA,[Gd]:o.ONE_MINUS_CONSTANT_ALPHA};function Y(U,ht,ut,zt,Nt,ne,ae,pe,we,re){if(U===vi){d===!0&&(Et(o.BLEND),d=!1);return}if(d===!1&&(Pt(o.BLEND),d=!0),U!==Td){if(U!==x||re!==T){if((M!==qi||S!==qi)&&(o.blendEquation(o.FUNC_ADD),M=qi,S=qi),re)switch(U){case Ns:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case sc:o.blendFunc(o.ONE,o.ONE);break;case tl:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case oc:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Ns:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case sc:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case tl:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case oc:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}b=null,_=null,E=null,A=null,w.set(0,0,0),y=0,x=U,T=re}return}Nt=Nt||ht,ne=ne||ut,ae=ae||zt,(ht!==M||Nt!==S)&&(o.blendEquationSeparate(Ct[ht],Ct[Nt]),M=ht,S=Nt),(ut!==b||zt!==_||ne!==E||ae!==A)&&(o.blendFuncSeparate(Ft[ut],Ft[zt],Ft[ne],Ft[ae]),b=ut,_=zt,E=ne,A=ae),(pe.equals(w)===!1||we!==y)&&(o.blendColor(pe.r,pe.g,pe.b,we),w.copy(pe),y=we),x=U,T=!1}function at(U,ht){U.side===Bn?Et(o.CULL_FACE):Pt(o.CULL_FACE);let ut=U.side===rn;ht&&(ut=!ut),lt(ut),U.blending===Ns&&U.transparent===!1?Y(vi):Y(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),c.setFunc(U.depthFunc),c.setTest(U.depthTest),c.setMask(U.depthWrite),r.setMask(U.colorWrite);const zt=U.stencilWrite;l.setTest(zt),zt&&(l.setMask(U.stencilWriteMask),l.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),l.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),z(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Pt(o.SAMPLE_ALPHA_TO_COVERAGE):Et(o.SAMPLE_ALPHA_TO_COVERAGE)}function lt(U){L!==U&&(U?o.frontFace(o.CW):o.frontFace(o.CCW),L=U)}function P(U){U!==Sd?(Pt(o.CULL_FACE),U!==I&&(U===Qc?o.cullFace(o.BACK):U===Ed?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):Et(o.CULL_FACE),I=U}function C(U){U!==R&&(W&&o.lineWidth(U),R=U)}function z(U,ht,ut){U?(Pt(o.POLYGON_OFFSET_FILL),(k!==ht||F!==ut)&&(o.polygonOffset(ht,ut),k=ht,F=ut)):Et(o.POLYGON_OFFSET_FILL)}function O(U){U?Pt(o.SCISSOR_TEST):Et(o.SCISSOR_TEST)}function Z(U){U===void 0&&(U=o.TEXTURE0+G-1),et!==U&&(o.activeTexture(U),et=U)}function V(U,ht,ut){ut===void 0&&(et===null?ut=o.TEXTURE0+G-1:ut=et);let zt=ct[ut];zt===void 0&&(zt={type:void 0,texture:void 0},ct[ut]=zt),(zt.type!==U||zt.texture!==ht)&&(et!==ut&&(o.activeTexture(ut),et=ut),o.bindTexture(U,ht||Rt[U]),zt.type=U,zt.texture=ht)}function tt(){const U=ct[et];U!==void 0&&U.type!==void 0&&(o.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function it(){try{o.compressedTexImage2D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function pt(){try{o.compressedTexImage3D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function yt(){try{o.texSubImage2D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Yt(){try{o.texSubImage3D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function rt(){try{o.compressedTexSubImage2D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function oe(){try{o.compressedTexSubImage3D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $(){try{o.texStorage2D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function It(){try{o.texStorage3D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function At(){try{o.texImage2D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function mt(){try{o.texImage3D.apply(o,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Bt(U){dt.equals(U)===!1&&(o.scissor(U.x,U.y,U.z,U.w),dt.copy(U))}function te(U){Mt.equals(U)===!1&&(o.viewport(U.x,U.y,U.z,U.w),Mt.copy(U))}function he(U,ht){let ut=u.get(ht);ut===void 0&&(ut=new WeakMap,u.set(ht,ut));let zt=ut.get(U);zt===void 0&&(zt=o.getUniformBlockIndex(ht,U.name),ut.set(U,zt))}function Ot(U,ht){const zt=u.get(ht).get(U);h.get(ht)!==zt&&(o.uniformBlockBinding(ht,zt,U.__bindingPointIndex),h.set(ht,zt))}function ot(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),n===!0&&(o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null)),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),f={},et=null,ct={},p={},g=new WeakMap,v=[],m=null,d=!1,x=null,M=null,b=null,_=null,S=null,E=null,A=null,w=new Ht(0,0,0),y=0,T=!1,L=null,I=null,R=null,k=null,F=null,dt.set(0,0,o.canvas.width,o.canvas.height),Mt.set(0,0,o.canvas.width,o.canvas.height),r.reset(),c.reset(),l.reset()}return{buffers:{color:r,depth:c,stencil:l},enable:Pt,disable:Et,bindFramebuffer:Ut,drawBuffers:X,useProgram:ue,setBlending:Y,setMaterial:at,setFlipSided:lt,setCullFace:P,setLineWidth:C,setPolygonOffset:z,setScissorTest:O,activeTexture:Z,bindTexture:V,unbindTexture:tt,compressedTexImage2D:it,compressedTexImage3D:pt,texImage2D:At,texImage3D:mt,updateUBOMapping:he,uniformBlockBinding:Ot,texStorage2D:$,texStorage3D:It,texSubImage2D:yt,texSubImage3D:Yt,compressedTexSubImage2D:rt,compressedTexSubImage3D:oe,scissor:Bt,viewport:te,reset:ot}}function kv(o,t,e,n,i,s,a){const r=i.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,C){return p?new OffscreenCanvas(P,C):Ba("canvas")}function v(P,C,z,O){let Z=1;if((P.width>O||P.height>O)&&(Z=O/Math.max(P.width,P.height)),Z<1||C===!0)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap){const V=C?Oa:Math.floor,tt=V(Z*P.width),it=V(Z*P.height);u===void 0&&(u=g(tt,it));const pt=z?g(tt,it):u;return pt.width=tt,pt.height=it,pt.getContext("2d").drawImage(P,0,0,tt,it),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+P.width+"x"+P.height+") to ("+tt+"x"+it+")."),pt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+P.width+"x"+P.height+")."),P;return P}function m(P){return fc(P.width)&&fc(P.height)}function d(P){return r?!1:P.wrapS!==on||P.wrapT!==on||P.minFilter!==ie&&P.minFilter!==We}function x(P,C){return P.generateMipmaps&&C&&P.minFilter!==ie&&P.minFilter!==We}function M(P){o.generateMipmap(P)}function b(P,C,z,O,Z=!1){if(r===!1)return C;if(P!==null){if(o[P]!==void 0)return o[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let V=C;if(C===o.RED&&(z===o.FLOAT&&(V=o.R32F),z===o.HALF_FLOAT&&(V=o.R16F),z===o.UNSIGNED_BYTE&&(V=o.R8)),C===o.RED_INTEGER&&(z===o.UNSIGNED_BYTE&&(V=o.R8UI),z===o.UNSIGNED_SHORT&&(V=o.R16UI),z===o.UNSIGNED_INT&&(V=o.R32UI),z===o.BYTE&&(V=o.R8I),z===o.SHORT&&(V=o.R16I),z===o.INT&&(V=o.R32I)),C===o.RG&&(z===o.FLOAT&&(V=o.RG32F),z===o.HALF_FLOAT&&(V=o.RG16F),z===o.UNSIGNED_BYTE&&(V=o.RG8)),C===o.RGBA){const tt=Z?Ua:le.getTransfer(O);z===o.FLOAT&&(V=o.RGBA32F),z===o.HALF_FLOAT&&(V=o.RGBA16F),z===o.UNSIGNED_BYTE&&(V=tt===fe?o.SRGB8_ALPHA8:o.RGBA8),z===o.UNSIGNED_SHORT_4_4_4_4&&(V=o.RGBA4),z===o.UNSIGNED_SHORT_5_5_5_1&&(V=o.RGB5_A1)}return(V===o.R16F||V===o.R32F||V===o.RG16F||V===o.RG32F||V===o.RGBA16F||V===o.RGBA32F)&&t.get("EXT_color_buffer_float"),V}function _(P,C,z){return x(P,z)===!0||P.isFramebufferTexture&&P.minFilter!==ie&&P.minFilter!==We?Math.log2(Math.max(C.width,C.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?C.mipmaps.length:1}function S(P){return P===ie||P===il||P===lr?o.NEAREST:o.LINEAR}function E(P){const C=P.target;C.removeEventListener("dispose",E),w(C),C.isVideoTexture&&h.delete(C)}function A(P){const C=P.target;C.removeEventListener("dispose",A),T(C)}function w(P){const C=n.get(P);if(C.__webglInit===void 0)return;const z=P.source,O=f.get(z);if(O){const Z=O[C.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&y(P),Object.keys(O).length===0&&f.delete(z)}n.remove(P)}function y(P){const C=n.get(P);o.deleteTexture(C.__webglTexture);const z=P.source,O=f.get(z);delete O[C.__cacheKey],a.memory.textures--}function T(P){const C=P.texture,z=n.get(P),O=n.get(C);if(O.__webglTexture!==void 0&&(o.deleteTexture(O.__webglTexture),a.memory.textures--),P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(z.__webglFramebuffer[Z]))for(let V=0;V<z.__webglFramebuffer[Z].length;V++)o.deleteFramebuffer(z.__webglFramebuffer[Z][V]);else o.deleteFramebuffer(z.__webglFramebuffer[Z]);z.__webglDepthbuffer&&o.deleteRenderbuffer(z.__webglDepthbuffer[Z])}else{if(Array.isArray(z.__webglFramebuffer))for(let Z=0;Z<z.__webglFramebuffer.length;Z++)o.deleteFramebuffer(z.__webglFramebuffer[Z]);else o.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&o.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&o.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let Z=0;Z<z.__webglColorRenderbuffer.length;Z++)z.__webglColorRenderbuffer[Z]&&o.deleteRenderbuffer(z.__webglColorRenderbuffer[Z]);z.__webglDepthRenderbuffer&&o.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(P.isWebGLMultipleRenderTargets)for(let Z=0,V=C.length;Z<V;Z++){const tt=n.get(C[Z]);tt.__webglTexture&&(o.deleteTexture(tt.__webglTexture),a.memory.textures--),n.remove(C[Z])}n.remove(C),n.remove(P)}let L=0;function I(){L=0}function R(){const P=L;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),L+=1,P}function k(P){const C=[];return C.push(P.wrapS),C.push(P.wrapT),C.push(P.wrapR||0),C.push(P.magFilter),C.push(P.minFilter),C.push(P.anisotropy),C.push(P.internalFormat),C.push(P.format),C.push(P.type),C.push(P.generateMipmaps),C.push(P.premultiplyAlpha),C.push(P.flipY),C.push(P.unpackAlignment),C.push(P.colorSpace),C.join()}function F(P,C){const z=n.get(P);if(P.isVideoTexture&&at(P),P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){const O=P.image;if(O===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(O.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{dt(z,P,C);return}}e.bindTexture(o.TEXTURE_2D,z.__webglTexture,o.TEXTURE0+C)}function G(P,C){const z=n.get(P);if(P.version>0&&z.__version!==P.version){dt(z,P,C);return}e.bindTexture(o.TEXTURE_2D_ARRAY,z.__webglTexture,o.TEXTURE0+C)}function W(P,C){const z=n.get(P);if(P.version>0&&z.__version!==P.version){dt(z,P,C);return}e.bindTexture(o.TEXTURE_3D,z.__webglTexture,o.TEXTURE0+C)}function K(P,C){const z=n.get(P);if(P.version>0&&z.__version!==P.version){Mt(z,P,C);return}e.bindTexture(o.TEXTURE_CUBE_MAP,z.__webglTexture,o.TEXTURE0+C)}const H={[ka]:o.REPEAT,[on]:o.CLAMP_TO_EDGE,[hc]:o.MIRRORED_REPEAT},et={[ie]:o.NEAREST,[il]:o.NEAREST_MIPMAP_NEAREST,[lr]:o.NEAREST_MIPMAP_LINEAR,[We]:o.LINEAR,[sp]:o.LINEAR_MIPMAP_NEAREST,[is]:o.LINEAR_MIPMAP_LINEAR},ct={[mp]:o.NEVER,[_p]:o.ALWAYS,[gp]:o.LESS,[Ku]:o.LEQUAL,[vp]:o.EQUAL,[yp]:o.GEQUAL,[xp]:o.GREATER,[Mp]:o.NOTEQUAL};function Q(P,C,z){if(z?(o.texParameteri(P,o.TEXTURE_WRAP_S,H[C.wrapS]),o.texParameteri(P,o.TEXTURE_WRAP_T,H[C.wrapT]),(P===o.TEXTURE_3D||P===o.TEXTURE_2D_ARRAY)&&o.texParameteri(P,o.TEXTURE_WRAP_R,H[C.wrapR]),o.texParameteri(P,o.TEXTURE_MAG_FILTER,et[C.magFilter]),o.texParameteri(P,o.TEXTURE_MIN_FILTER,et[C.minFilter])):(o.texParameteri(P,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(P,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),(P===o.TEXTURE_3D||P===o.TEXTURE_2D_ARRAY)&&o.texParameteri(P,o.TEXTURE_WRAP_R,o.CLAMP_TO_EDGE),(C.wrapS!==on||C.wrapT!==on)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),o.texParameteri(P,o.TEXTURE_MAG_FILTER,S(C.magFilter)),o.texParameteri(P,o.TEXTURE_MIN_FILTER,S(C.minFilter)),C.minFilter!==ie&&C.minFilter!==We&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),C.compareFunction&&(o.texParameteri(P,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(P,o.TEXTURE_COMPARE_FUNC,ct[C.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const O=t.get("EXT_texture_filter_anisotropic");if(C.magFilter===ie||C.minFilter!==lr&&C.minFilter!==is||C.type===pi&&t.has("OES_texture_float_linear")===!1||r===!1&&C.type===Li&&t.has("OES_texture_half_float_linear")===!1)return;(C.anisotropy>1||n.get(C).__currentAnisotropy)&&(o.texParameterf(P,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,i.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy)}}function nt(P,C){let z=!1;P.__webglInit===void 0&&(P.__webglInit=!0,C.addEventListener("dispose",E));const O=C.source;let Z=f.get(O);Z===void 0&&(Z={},f.set(O,Z));const V=k(C);if(V!==P.__cacheKey){Z[V]===void 0&&(Z[V]={texture:o.createTexture(),usedTimes:0},a.memory.textures++,z=!0),Z[V].usedTimes++;const tt=Z[P.__cacheKey];tt!==void 0&&(Z[P.__cacheKey].usedTimes--,tt.usedTimes===0&&y(C)),P.__cacheKey=V,P.__webglTexture=Z[V].texture}return z}function dt(P,C,z){let O=o.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(O=o.TEXTURE_2D_ARRAY),C.isData3DTexture&&(O=o.TEXTURE_3D);const Z=nt(P,C),V=C.source;e.bindTexture(O,P.__webglTexture,o.TEXTURE0+z);const tt=n.get(V);if(V.version!==tt.__version||Z===!0){e.activeTexture(o.TEXTURE0+z);const it=le.getPrimaries(le.workingColorSpace),pt=C.colorSpace===Rn?null:le.getPrimaries(C.colorSpace),yt=C.colorSpace===Rn||it===pt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,C.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,C.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const Yt=d(C)&&m(C.image)===!1;let rt=v(C.image,Yt,!1,i.maxTextureSize);rt=lt(C,rt);const oe=m(rt)||r,$=s.convert(C.format,C.colorSpace);let It=s.convert(C.type),At=b(C.internalFormat,$,It,C.colorSpace,C.isVideoTexture);Q(O,C,oe);let mt;const Bt=C.mipmaps,te=r&&C.isVideoTexture!==!0&&At!==qu,he=tt.__version===void 0||Z===!0,Ot=_(C,rt,oe);if(C.isDepthTexture)At=o.DEPTH_COMPONENT,r?C.type===pi?At=o.DEPTH_COMPONENT32F:C.type===di?At=o.DEPTH_COMPONENT24:C.type===ts?At=o.DEPTH24_STENCIL8:At=o.DEPTH_COMPONENT16:C.type===pi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),C.format===es&&At===o.DEPTH_COMPONENT&&C.type!==Tc&&C.type!==di&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),C.type=di,It=s.convert(C.type)),C.format===Hs&&At===o.DEPTH_COMPONENT&&(At=o.DEPTH_STENCIL,C.type!==ts&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),C.type=ts,It=s.convert(C.type))),he&&(te?e.texStorage2D(o.TEXTURE_2D,1,At,rt.width,rt.height):e.texImage2D(o.TEXTURE_2D,0,At,rt.width,rt.height,0,$,It,null));else if(C.isDataTexture)if(Bt.length>0&&oe){te&&he&&e.texStorage2D(o.TEXTURE_2D,Ot,At,Bt[0].width,Bt[0].height);for(let ot=0,U=Bt.length;ot<U;ot++)mt=Bt[ot],te?e.texSubImage2D(o.TEXTURE_2D,ot,0,0,mt.width,mt.height,$,It,mt.data):e.texImage2D(o.TEXTURE_2D,ot,At,mt.width,mt.height,0,$,It,mt.data);C.generateMipmaps=!1}else te?(he&&e.texStorage2D(o.TEXTURE_2D,Ot,At,rt.width,rt.height),e.texSubImage2D(o.TEXTURE_2D,0,0,0,rt.width,rt.height,$,It,rt.data)):e.texImage2D(o.TEXTURE_2D,0,At,rt.width,rt.height,0,$,It,rt.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){te&&he&&e.texStorage3D(o.TEXTURE_2D_ARRAY,Ot,At,Bt[0].width,Bt[0].height,rt.depth);for(let ot=0,U=Bt.length;ot<U;ot++)mt=Bt[ot],C.format!==Ae?$!==null?te?e.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,ot,0,0,0,mt.width,mt.height,rt.depth,$,mt.data,0,0):e.compressedTexImage3D(o.TEXTURE_2D_ARRAY,ot,At,mt.width,mt.height,rt.depth,0,mt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):te?e.texSubImage3D(o.TEXTURE_2D_ARRAY,ot,0,0,0,mt.width,mt.height,rt.depth,$,It,mt.data):e.texImage3D(o.TEXTURE_2D_ARRAY,ot,At,mt.width,mt.height,rt.depth,0,$,It,mt.data)}else{te&&he&&e.texStorage2D(o.TEXTURE_2D,Ot,At,Bt[0].width,Bt[0].height);for(let ot=0,U=Bt.length;ot<U;ot++)mt=Bt[ot],C.format!==Ae?$!==null?te?e.compressedTexSubImage2D(o.TEXTURE_2D,ot,0,0,mt.width,mt.height,$,mt.data):e.compressedTexImage2D(o.TEXTURE_2D,ot,At,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):te?e.texSubImage2D(o.TEXTURE_2D,ot,0,0,mt.width,mt.height,$,It,mt.data):e.texImage2D(o.TEXTURE_2D,ot,At,mt.width,mt.height,0,$,It,mt.data)}else if(C.isDataArrayTexture)te?(he&&e.texStorage3D(o.TEXTURE_2D_ARRAY,Ot,At,rt.width,rt.height,rt.depth),e.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,$,It,rt.data)):e.texImage3D(o.TEXTURE_2D_ARRAY,0,At,rt.width,rt.height,rt.depth,0,$,It,rt.data);else if(C.isData3DTexture)te?(he&&e.texStorage3D(o.TEXTURE_3D,Ot,At,rt.width,rt.height,rt.depth),e.texSubImage3D(o.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,$,It,rt.data)):e.texImage3D(o.TEXTURE_3D,0,At,rt.width,rt.height,rt.depth,0,$,It,rt.data);else if(C.isFramebufferTexture){if(he)if(te)e.texStorage2D(o.TEXTURE_2D,Ot,At,rt.width,rt.height);else{let ot=rt.width,U=rt.height;for(let ht=0;ht<Ot;ht++)e.texImage2D(o.TEXTURE_2D,ht,At,ot,U,0,$,It,null),ot>>=1,U>>=1}}else if(Bt.length>0&&oe){te&&he&&e.texStorage2D(o.TEXTURE_2D,Ot,At,Bt[0].width,Bt[0].height);for(let ot=0,U=Bt.length;ot<U;ot++)mt=Bt[ot],te?e.texSubImage2D(o.TEXTURE_2D,ot,0,0,$,It,mt):e.texImage2D(o.TEXTURE_2D,ot,At,$,It,mt);C.generateMipmaps=!1}else te?(he&&e.texStorage2D(o.TEXTURE_2D,Ot,At,rt.width,rt.height),e.texSubImage2D(o.TEXTURE_2D,0,0,0,$,It,rt)):e.texImage2D(o.TEXTURE_2D,0,At,$,It,rt);x(C,oe)&&M(O),tt.__version=V.version,C.onUpdate&&C.onUpdate(C)}P.__version=C.version}function Mt(P,C,z){if(C.image.length!==6)return;const O=nt(P,C),Z=C.source;e.bindTexture(o.TEXTURE_CUBE_MAP,P.__webglTexture,o.TEXTURE0+z);const V=n.get(Z);if(Z.version!==V.__version||O===!0){e.activeTexture(o.TEXTURE0+z);const tt=le.getPrimaries(le.workingColorSpace),it=C.colorSpace===Rn?null:le.getPrimaries(C.colorSpace),pt=C.colorSpace===Rn||tt===it?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,C.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,C.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const yt=C.isCompressedTexture||C.image[0].isCompressedTexture,Yt=C.image[0]&&C.image[0].isDataTexture,rt=[];for(let ot=0;ot<6;ot++)!yt&&!Yt?rt[ot]=v(C.image[ot],!1,!0,i.maxCubemapSize):rt[ot]=Yt?C.image[ot].image:C.image[ot],rt[ot]=lt(C,rt[ot]);const oe=rt[0],$=m(oe)||r,It=s.convert(C.format,C.colorSpace),At=s.convert(C.type),mt=b(C.internalFormat,It,At,C.colorSpace),Bt=r&&C.isVideoTexture!==!0,te=V.__version===void 0||O===!0;let he=_(C,oe,$);Q(o.TEXTURE_CUBE_MAP,C,$);let Ot;if(yt){Bt&&te&&e.texStorage2D(o.TEXTURE_CUBE_MAP,he,mt,oe.width,oe.height);for(let ot=0;ot<6;ot++){Ot=rt[ot].mipmaps;for(let U=0;U<Ot.length;U++){const ht=Ot[U];C.format!==Ae?It!==null?Bt?e.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,U,0,0,ht.width,ht.height,It,ht.data):e.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,U,mt,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Bt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,U,0,0,ht.width,ht.height,It,At,ht.data):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,U,mt,ht.width,ht.height,0,It,At,ht.data)}}}else{Ot=C.mipmaps,Bt&&te&&(Ot.length>0&&he++,e.texStorage2D(o.TEXTURE_CUBE_MAP,he,mt,rt[0].width,rt[0].height));for(let ot=0;ot<6;ot++)if(Yt){Bt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,rt[ot].width,rt[ot].height,It,At,rt[ot].data):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,mt,rt[ot].width,rt[ot].height,0,It,At,rt[ot].data);for(let U=0;U<Ot.length;U++){const ut=Ot[U].image[ot].image;Bt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,U+1,0,0,ut.width,ut.height,It,At,ut.data):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,U+1,mt,ut.width,ut.height,0,It,At,ut.data)}}else{Bt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,It,At,rt[ot]):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,mt,It,At,rt[ot]);for(let U=0;U<Ot.length;U++){const ht=Ot[U];Bt?e.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,U+1,0,0,It,At,ht.image[ot]):e.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+ot,U+1,mt,It,At,ht.image[ot])}}}x(C,$)&&M(o.TEXTURE_CUBE_MAP),V.__version=Z.version,C.onUpdate&&C.onUpdate(C)}P.__version=C.version}function St(P,C,z,O,Z,V){const tt=s.convert(z.format,z.colorSpace),it=s.convert(z.type),pt=b(z.internalFormat,tt,it,z.colorSpace);if(!n.get(C).__hasExternalTextures){const Yt=Math.max(1,C.width>>V),rt=Math.max(1,C.height>>V);Z===o.TEXTURE_3D||Z===o.TEXTURE_2D_ARRAY?e.texImage3D(Z,V,pt,Yt,rt,C.depth,0,tt,it,null):e.texImage2D(Z,V,pt,Yt,rt,0,tt,it,null)}e.bindFramebuffer(o.FRAMEBUFFER,P),Y(C)?c.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,O,Z,n.get(z).__webglTexture,0,Ft(C)):(Z===o.TEXTURE_2D||Z>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,O,Z,n.get(z).__webglTexture,V),e.bindFramebuffer(o.FRAMEBUFFER,null)}function Rt(P,C,z){if(o.bindRenderbuffer(o.RENDERBUFFER,P),C.depthBuffer&&!C.stencilBuffer){let O=r===!0?o.DEPTH_COMPONENT24:o.DEPTH_COMPONENT16;if(z||Y(C)){const Z=C.depthTexture;Z&&Z.isDepthTexture&&(Z.type===pi?O=o.DEPTH_COMPONENT32F:Z.type===di&&(O=o.DEPTH_COMPONENT24));const V=Ft(C);Y(C)?c.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,V,O,C.width,C.height):o.renderbufferStorageMultisample(o.RENDERBUFFER,V,O,C.width,C.height)}else o.renderbufferStorage(o.RENDERBUFFER,O,C.width,C.height);o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,P)}else if(C.depthBuffer&&C.stencilBuffer){const O=Ft(C);z&&Y(C)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,O,o.DEPTH24_STENCIL8,C.width,C.height):Y(C)?c.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,O,o.DEPTH24_STENCIL8,C.width,C.height):o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_STENCIL,C.width,C.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.RENDERBUFFER,P)}else{const O=C.isWebGLMultipleRenderTargets===!0?C.texture:[C.texture];for(let Z=0;Z<O.length;Z++){const V=O[Z],tt=s.convert(V.format,V.colorSpace),it=s.convert(V.type),pt=b(V.internalFormat,tt,it,V.colorSpace),yt=Ft(C);z&&Y(C)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,yt,pt,C.width,C.height):Y(C)?c.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,yt,pt,C.width,C.height):o.renderbufferStorage(o.RENDERBUFFER,pt,C.width,C.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function Pt(P,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(o.FRAMEBUFFER,P),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(C.depthTexture).__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),F(C.depthTexture,0);const O=n.get(C.depthTexture).__webglTexture,Z=Ft(C);if(C.depthTexture.format===es)Y(C)?c.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,O,0,Z):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,O,0);else if(C.depthTexture.format===Hs)Y(C)?c.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,O,0,Z):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,O,0);else throw new Error("Unknown depthTexture format")}function Et(P){const C=n.get(P),z=P.isWebGLCubeRenderTarget===!0;if(P.depthTexture&&!C.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Pt(C.__webglFramebuffer,P)}else if(z){C.__webglDepthbuffer=[];for(let O=0;O<6;O++)e.bindFramebuffer(o.FRAMEBUFFER,C.__webglFramebuffer[O]),C.__webglDepthbuffer[O]=o.createRenderbuffer(),Rt(C.__webglDepthbuffer[O],P,!1)}else e.bindFramebuffer(o.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer=o.createRenderbuffer(),Rt(C.__webglDepthbuffer,P,!1);e.bindFramebuffer(o.FRAMEBUFFER,null)}function Ut(P,C,z){const O=n.get(P);C!==void 0&&St(O.__webglFramebuffer,P,P.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),z!==void 0&&Et(P)}function X(P){const C=P.texture,z=n.get(P),O=n.get(C);P.addEventListener("dispose",A),P.isWebGLMultipleRenderTargets!==!0&&(O.__webglTexture===void 0&&(O.__webglTexture=o.createTexture()),O.__version=C.version,a.memory.textures++);const Z=P.isWebGLCubeRenderTarget===!0,V=P.isWebGLMultipleRenderTargets===!0,tt=m(P)||r;if(Z){z.__webglFramebuffer=[];for(let it=0;it<6;it++)if(r&&C.mipmaps&&C.mipmaps.length>0){z.__webglFramebuffer[it]=[];for(let pt=0;pt<C.mipmaps.length;pt++)z.__webglFramebuffer[it][pt]=o.createFramebuffer()}else z.__webglFramebuffer[it]=o.createFramebuffer()}else{if(r&&C.mipmaps&&C.mipmaps.length>0){z.__webglFramebuffer=[];for(let it=0;it<C.mipmaps.length;it++)z.__webglFramebuffer[it]=o.createFramebuffer()}else z.__webglFramebuffer=o.createFramebuffer();if(V)if(i.drawBuffers){const it=P.texture;for(let pt=0,yt=it.length;pt<yt;pt++){const Yt=n.get(it[pt]);Yt.__webglTexture===void 0&&(Yt.__webglTexture=o.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&P.samples>0&&Y(P)===!1){const it=V?C:[C];z.__webglMultisampledFramebuffer=o.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(o.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let pt=0;pt<it.length;pt++){const yt=it[pt];z.__webglColorRenderbuffer[pt]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,z.__webglColorRenderbuffer[pt]);const Yt=s.convert(yt.format,yt.colorSpace),rt=s.convert(yt.type),oe=b(yt.internalFormat,Yt,rt,yt.colorSpace,P.isXRRenderTarget===!0),$=Ft(P);o.renderbufferStorageMultisample(o.RENDERBUFFER,$,oe,P.width,P.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+pt,o.RENDERBUFFER,z.__webglColorRenderbuffer[pt])}o.bindRenderbuffer(o.RENDERBUFFER,null),P.depthBuffer&&(z.__webglDepthRenderbuffer=o.createRenderbuffer(),Rt(z.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(o.FRAMEBUFFER,null)}}if(Z){e.bindTexture(o.TEXTURE_CUBE_MAP,O.__webglTexture),Q(o.TEXTURE_CUBE_MAP,C,tt);for(let it=0;it<6;it++)if(r&&C.mipmaps&&C.mipmaps.length>0)for(let pt=0;pt<C.mipmaps.length;pt++)St(z.__webglFramebuffer[it][pt],P,C,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+it,pt);else St(z.__webglFramebuffer[it],P,C,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);x(C,tt)&&M(o.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(V){const it=P.texture;for(let pt=0,yt=it.length;pt<yt;pt++){const Yt=it[pt],rt=n.get(Yt);e.bindTexture(o.TEXTURE_2D,rt.__webglTexture),Q(o.TEXTURE_2D,Yt,tt),St(z.__webglFramebuffer,P,Yt,o.COLOR_ATTACHMENT0+pt,o.TEXTURE_2D,0),x(Yt,tt)&&M(o.TEXTURE_2D)}e.unbindTexture()}else{let it=o.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(r?it=P.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(it,O.__webglTexture),Q(it,C,tt),r&&C.mipmaps&&C.mipmaps.length>0)for(let pt=0;pt<C.mipmaps.length;pt++)St(z.__webglFramebuffer[pt],P,C,o.COLOR_ATTACHMENT0,it,pt);else St(z.__webglFramebuffer,P,C,o.COLOR_ATTACHMENT0,it,0);x(C,tt)&&M(it),e.unbindTexture()}P.depthBuffer&&Et(P)}function ue(P){const C=m(P)||r,z=P.isWebGLMultipleRenderTargets===!0?P.texture:[P.texture];for(let O=0,Z=z.length;O<Z;O++){const V=z[O];if(x(V,C)){const tt=P.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:o.TEXTURE_2D,it=n.get(V).__webglTexture;e.bindTexture(tt,it),M(tt),e.unbindTexture()}}}function Ct(P){if(r&&P.samples>0&&Y(P)===!1){const C=P.isWebGLMultipleRenderTargets?P.texture:[P.texture],z=P.width,O=P.height;let Z=o.COLOR_BUFFER_BIT;const V=[],tt=P.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,it=n.get(P),pt=P.isWebGLMultipleRenderTargets===!0;if(pt)for(let yt=0;yt<C.length;yt++)e.bindFramebuffer(o.FRAMEBUFFER,it.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+yt,o.RENDERBUFFER,null),e.bindFramebuffer(o.FRAMEBUFFER,it.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+yt,o.TEXTURE_2D,null,0);e.bindFramebuffer(o.READ_FRAMEBUFFER,it.__webglMultisampledFramebuffer),e.bindFramebuffer(o.DRAW_FRAMEBUFFER,it.__webglFramebuffer);for(let yt=0;yt<C.length;yt++){V.push(o.COLOR_ATTACHMENT0+yt),P.depthBuffer&&V.push(tt);const Yt=it.__ignoreDepthValues!==void 0?it.__ignoreDepthValues:!1;if(Yt===!1&&(P.depthBuffer&&(Z|=o.DEPTH_BUFFER_BIT),P.stencilBuffer&&(Z|=o.STENCIL_BUFFER_BIT)),pt&&o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,it.__webglColorRenderbuffer[yt]),Yt===!0&&(o.invalidateFramebuffer(o.READ_FRAMEBUFFER,[tt]),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[tt])),pt){const rt=n.get(C[yt]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,rt,0)}o.blitFramebuffer(0,0,z,O,0,0,z,O,Z,o.NEAREST),l&&o.invalidateFramebuffer(o.READ_FRAMEBUFFER,V)}if(e.bindFramebuffer(o.READ_FRAMEBUFFER,null),e.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),pt)for(let yt=0;yt<C.length;yt++){e.bindFramebuffer(o.FRAMEBUFFER,it.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+yt,o.RENDERBUFFER,it.__webglColorRenderbuffer[yt]);const Yt=n.get(C[yt]).__webglTexture;e.bindFramebuffer(o.FRAMEBUFFER,it.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+yt,o.TEXTURE_2D,Yt,0)}e.bindFramebuffer(o.DRAW_FRAMEBUFFER,it.__webglMultisampledFramebuffer)}}function Ft(P){return Math.min(i.maxSamples,P.samples)}function Y(P){const C=n.get(P);return r&&P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function at(P){const C=a.render.frame;h.get(P)!==C&&(h.set(P,C),P.update())}function lt(P,C){const z=P.colorSpace,O=P.format,Z=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||P.format===uc||z!==Mi&&z!==Rn&&(le.getTransfer(z)===fe?r===!1?t.has("EXT_sRGB")===!0&&O===Ae?(P.format=uc,P.minFilter=We,P.generateMipmaps=!1):C=Ju.sRGBToLinear(C):(O!==Ae||Z!==de)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),C}this.allocateTextureUnit=R,this.resetTextureUnits=I,this.setTexture2D=F,this.setTexture2DArray=G,this.setTexture3D=W,this.setTextureCube=K,this.rebindTextures=Ut,this.setupRenderTarget=X,this.updateRenderTargetMipmap=ue,this.updateMultisampleRenderTarget=Ct,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=St,this.useMultisampledRTT=Y}function Uv(o,t,e){const n=e.isWebGL2;function i(s,a=Rn){let r;const c=le.getTransfer(a);if(s===de)return o.UNSIGNED_BYTE;if(s===Gu)return o.UNSIGNED_SHORT_4_4_4_4;if(s===Hu)return o.UNSIGNED_SHORT_5_5_5_1;if(s===op)return o.BYTE;if(s===ap)return o.SHORT;if(s===Tc)return o.UNSIGNED_SHORT;if(s===Wu)return o.INT;if(s===di)return o.UNSIGNED_INT;if(s===pi)return o.FLOAT;if(s===Li)return n?o.HALF_FLOAT:(r=t.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(s===rp)return o.ALPHA;if(s===Ae)return o.RGBA;if(s===cp)return o.LUMINANCE;if(s===lp)return o.LUMINANCE_ALPHA;if(s===es)return o.DEPTH_COMPONENT;if(s===Hs)return o.DEPTH_STENCIL;if(s===uc)return r=t.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(s===Pi)return o.RED;if(s===Vu)return o.RED_INTEGER;if(s===$u)return o.RG;if(s===Xu)return o.RG_INTEGER;if(s===ju)return o.RGBA_INTEGER;if(s===hr||s===ur||s===fr||s===dr)if(c===fe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(s===hr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===dr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(s===hr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===ur)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===fr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===dr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===sl||s===ol||s===al||s===rl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(s===sl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===ol)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===al)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===rl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===qu)return r=t.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===cl||s===ll)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(s===cl)return c===fe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(s===ll)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===hl||s===ul||s===fl||s===dl||s===pl||s===ml||s===gl||s===vl||s===xl||s===Ml||s===yl||s===_l||s===wl||s===bl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(s===hl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===ul)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===fl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===dl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===pl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===ml)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===gl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===vl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===xl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===Ml)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===yl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===_l)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===wl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===bl)return c===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===pr||s===Sl||s===El)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(s===pr)return c===fe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Sl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===El)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===hp||s===Al||s===Tl||s===Cl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(s===pr)return r.COMPRESSED_RED_RGTC1_EXT;if(s===Al)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Tl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Cl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===ts?n?o.UNSIGNED_INT_24_8:(r=t.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):o[s]!==void 0?o[s]:null}return{convert:i}}class zv extends _n{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ge extends pn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Fv={type:"move"};class Fr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ge,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ge,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ge,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),d=this._getHandJoint(l,v);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(r.matrix.fromArray(i.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,i.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(i.linearVelocity)):r.hasLinearVelocity=!1,i.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(i.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Fv)))}return r!==null&&(r.visible=i!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ge;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Nv extends $s{constructor(t,e){super();const n=this;let i=null,s=1,a=null,r="local-floor",c=1,l=null,h=null,u=null,f=null,p=null,g=null;const v=e.getContextAttributes();let m=null,d=null;const x=[],M=[],b=new Vt;let _=null;const S=new _n;S.layers.enable(1),S.viewport=new ee;const E=new _n;E.layers.enable(2),E.viewport=new ee;const A=[S,E],w=new zv;w.layers.enable(1),w.layers.enable(2);let y=null,T=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let nt=x[Q];return nt===void 0&&(nt=new Fr,x[Q]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Q){let nt=x[Q];return nt===void 0&&(nt=new Fr,x[Q]=nt),nt.getGripSpace()},this.getHand=function(Q){let nt=x[Q];return nt===void 0&&(nt=new Fr,x[Q]=nt),nt.getHandSpace()};function L(Q){const nt=M.indexOf(Q.inputSource);if(nt===-1)return;const dt=x[nt];dt!==void 0&&(dt.update(Q.inputSource,Q.frame,l||a),dt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function I(){i.removeEventListener("select",L),i.removeEventListener("selectstart",L),i.removeEventListener("selectend",L),i.removeEventListener("squeeze",L),i.removeEventListener("squeezestart",L),i.removeEventListener("squeezeend",L),i.removeEventListener("end",I),i.removeEventListener("inputsourceschange",R);for(let Q=0;Q<x.length;Q++){const nt=M[Q];nt!==null&&(M[Q]=null,x[Q].disconnect(nt))}y=null,T=null,t.setRenderTarget(m),p=null,f=null,u=null,i=null,d=null,ct.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){r=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Q){l=Q},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Q){if(i=Q,i!==null){if(m=t.getRenderTarget(),i.addEventListener("select",L),i.addEventListener("selectstart",L),i.addEventListener("selectend",L),i.addEventListener("squeeze",L),i.addEventListener("squeezestart",L),i.addEventListener("squeezeend",L),i.addEventListener("end",I),i.addEventListener("inputsourceschange",R),v.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(b),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const nt={antialias:i.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(i,e,nt),i.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new Jn(p.framebufferWidth,p.framebufferHeight,{format:Ae,type:de,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let nt=null,dt=null,Mt=null;v.depth&&(Mt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=v.stencil?Hs:es,dt=v.stencil?ts:di);const St={colorFormat:e.RGBA8,depthFormat:Mt,scaleFactor:s};u=new XRWebGLBinding(i,e),f=u.createProjectionLayer(St),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),d=new Jn(f.textureWidth,f.textureHeight,{format:Ae,type:de,depthTexture:new kc(f.textureWidth,f.textureHeight,dt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});const Rt=t.properties.get(d);Rt.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(r),ct.setContext(i),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function R(Q){for(let nt=0;nt<Q.removed.length;nt++){const dt=Q.removed[nt],Mt=M.indexOf(dt);Mt>=0&&(M[Mt]=null,x[Mt].disconnect(dt))}for(let nt=0;nt<Q.added.length;nt++){const dt=Q.added[nt];let Mt=M.indexOf(dt);if(Mt===-1){for(let Rt=0;Rt<x.length;Rt++)if(Rt>=M.length){M.push(dt),Mt=Rt;break}else if(M[Rt]===null){M[Rt]=dt,Mt=Rt;break}if(Mt===-1)break}const St=x[Mt];St&&St.connect(dt)}}const k=new B,F=new B;function G(Q,nt,dt){k.setFromMatrixPosition(nt.matrixWorld),F.setFromMatrixPosition(dt.matrixWorld);const Mt=k.distanceTo(F),St=nt.projectionMatrix.elements,Rt=dt.projectionMatrix.elements,Pt=St[14]/(St[10]-1),Et=St[14]/(St[10]+1),Ut=(St[9]+1)/St[5],X=(St[9]-1)/St[5],ue=(St[8]-1)/St[0],Ct=(Rt[8]+1)/Rt[0],Ft=Pt*ue,Y=Pt*Ct,at=Mt/(-ue+Ct),lt=at*-ue;nt.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(lt),Q.translateZ(at),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert();const P=Pt+at,C=Et+at,z=Ft-lt,O=Y+(Mt-lt),Z=Ut*Et/C*P,V=X*Et/C*P;Q.projectionMatrix.makePerspective(z,O,Z,V,P,C),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}function W(Q,nt){nt===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(nt.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(i===null)return;w.near=E.near=S.near=Q.near,w.far=E.far=S.far=Q.far,(y!==w.near||T!==w.far)&&(i.updateRenderState({depthNear:w.near,depthFar:w.far}),y=w.near,T=w.far);const nt=Q.parent,dt=w.cameras;W(w,nt);for(let Mt=0;Mt<dt.length;Mt++)W(dt[Mt],nt);dt.length===2?G(w,S,E):w.projectionMatrix.copy(S.projectionMatrix),K(Q,w,nt)};function K(Q,nt,dt){dt===null?Q.matrix.copy(nt.matrixWorld):(Q.matrix.copy(dt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(nt.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(nt.projectionMatrix),Q.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Ao*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(Q){c=Q,f!==null&&(f.fixedFoveation=Q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Q)};let H=null;function et(Q,nt){if(h=nt.getViewerPose(l||a),g=nt,h!==null){const dt=h.views;p!==null&&(t.setRenderTargetFramebuffer(d,p.framebuffer),t.setRenderTarget(d));let Mt=!1;dt.length!==w.cameras.length&&(w.cameras.length=0,Mt=!0);for(let St=0;St<dt.length;St++){const Rt=dt[St];let Pt=null;if(p!==null)Pt=p.getViewport(Rt);else{const Ut=u.getViewSubImage(f,Rt);Pt=Ut.viewport,St===0&&(t.setRenderTargetTextures(d,Ut.colorTexture,f.ignoreDepthValues?void 0:Ut.depthStencilTexture),t.setRenderTarget(d))}let Et=A[St];Et===void 0&&(Et=new _n,Et.layers.enable(St),Et.viewport=new ee,A[St]=Et),Et.matrix.fromArray(Rt.transform.matrix),Et.matrix.decompose(Et.position,Et.quaternion,Et.scale),Et.projectionMatrix.fromArray(Rt.projectionMatrix),Et.projectionMatrixInverse.copy(Et.projectionMatrix).invert(),Et.viewport.set(Pt.x,Pt.y,Pt.width,Pt.height),St===0&&(w.matrix.copy(Et.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),Mt===!0&&w.cameras.push(Et)}}for(let dt=0;dt<x.length;dt++){const Mt=M[dt],St=x[dt];Mt!==null&&St!==void 0&&St.update(Mt,nt,l||a)}H&&H(Q,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}const ct=new lf;ct.setAnimationLoop(et),this.setAnimationLoop=function(Q){H=Q},this.dispose=function(){}}}function Ov(o,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,af(o)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function i(m,d,x,M,b){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(m,d):d.isMeshToonMaterial?(s(m,d),u(m,d)):d.isMeshPhongMaterial?(s(m,d),h(m,d)):d.isMeshStandardMaterial?(s(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,b)):d.isMeshMatcapMaterial?(s(m,d),g(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),v(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&r(m,d)):d.isPointsMaterial?c(m,d,x,M):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===rn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===rn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const x=t.get(d).envMap;if(x&&(m.envMap.value=x,m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const M=o._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*M,e(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function r(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,x,M){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*x,m.scale.value=M*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),t.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,x){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===rn&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function v(m,d){const x=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Bv(o,t,e,n){let i={},s={},a=[];const r=e.isWebGL2?o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(x,M){const b=M.program;n.uniformBlockBinding(x,b)}function l(x,M){let b=i[x.id];b===void 0&&(g(x),b=h(x),i[x.id]=b,x.addEventListener("dispose",m));const _=M.program;n.updateUBOMapping(x,_);const S=t.render.frame;s[x.id]!==S&&(f(x),s[x.id]=S)}function h(x){const M=u();x.__bindingPointIndex=M;const b=o.createBuffer(),_=x.__size,S=x.usage;return o.bindBuffer(o.UNIFORM_BUFFER,b),o.bufferData(o.UNIFORM_BUFFER,_,S),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,M,b),b}function u(){for(let x=0;x<r;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const M=i[x.id],b=x.uniforms,_=x.__cache;o.bindBuffer(o.UNIFORM_BUFFER,M);for(let S=0,E=b.length;S<E;S++){const A=Array.isArray(b[S])?b[S]:[b[S]];for(let w=0,y=A.length;w<y;w++){const T=A[w];if(p(T,S,w,_)===!0){const L=T.__offset,I=Array.isArray(T.value)?T.value:[T.value];let R=0;for(let k=0;k<I.length;k++){const F=I[k],G=v(F);typeof F=="number"||typeof F=="boolean"?(T.__data[0]=F,o.bufferSubData(o.UNIFORM_BUFFER,L+R,T.__data)):F.isMatrix3?(T.__data[0]=F.elements[0],T.__data[1]=F.elements[1],T.__data[2]=F.elements[2],T.__data[3]=0,T.__data[4]=F.elements[3],T.__data[5]=F.elements[4],T.__data[6]=F.elements[5],T.__data[7]=0,T.__data[8]=F.elements[6],T.__data[9]=F.elements[7],T.__data[10]=F.elements[8],T.__data[11]=0):(F.toArray(T.__data,R),R+=G.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,L,T.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function p(x,M,b,_){const S=x.value,E=M+"_"+b;if(_[E]===void 0)return typeof S=="number"||typeof S=="boolean"?_[E]=S:_[E]=S.clone(),!0;{const A=_[E];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return _[E]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function g(x){const M=x.uniforms;let b=0;const _=16;for(let E=0,A=M.length;E<A;E++){const w=Array.isArray(M[E])?M[E]:[M[E]];for(let y=0,T=w.length;y<T;y++){const L=w[y],I=Array.isArray(L.value)?L.value:[L.value];for(let R=0,k=I.length;R<k;R++){const F=I[R],G=v(F),W=b%_;W!==0&&_-W<G.boundary&&(b+=_-W),L.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=b,b+=G.storage}}}const S=b%_;return S>0&&(b+=_-S),x.__size=b,x.__cache={},this}function v(x){const M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),M}function m(x){const M=x.target;M.removeEventListener("dispose",m);const b=a.indexOf(M.__bindingPointIndex);a.splice(b,1),o.deleteBuffer(i[M.id]),delete i[M.id],delete s[M.id]}function d(){for(const x in i)o.deleteBuffer(i[x]);a=[],i={},s={}}return{bind:c,update:l,dispose:d}}class mf{constructor(t={}){const{canvas:e=zp(),context:n=null,depth:i=!0,stencil:s=!0,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=a;const p=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const d=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Be,this._useLegacyLights=!1,this.toneMapping=Ri,this.toneMappingExposure=1;const M=this;let b=!1,_=0,S=0,E=null,A=-1,w=null;const y=new ee,T=new ee;let L=null;const I=new Ht(0);let R=0,k=e.width,F=e.height,G=1,W=null,K=null;const H=new ee(0,0,k,F),et=new ee(0,0,k,F);let ct=!1;const Q=new ki;let nt=!1,dt=!1,Mt=null;const St=new se,Rt=new Vt,Pt=new B,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ut(){return E===null?G:1}let X=n;function ue(D,N){for(let j=0;j<D.length;j++){const J=D[j],q=e.getContext(J,N);if(q!==null)return q}return null}try{const D={alpha:!0,depth:i,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ac}`),e.addEventListener("webglcontextlost",ot,!1),e.addEventListener("webglcontextrestored",U,!1),e.addEventListener("webglcontextcreationerror",ht,!1),X===null){const N=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&N.shift(),X=ue(N,D),X===null)throw ue(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let Ct,Ft,Y,at,lt,P,C,z,O,Z,V,tt,it,pt,yt,Yt,rt,oe,$,It,At,mt,Bt,te;function he(){Ct=new Kg(X),Ft=new Vg(X,Ct,t),Ct.init(Ft),mt=new Uv(X,Ct,Ft),Y=new Iv(X,Ct,Ft),at=new Qg(X),lt=new Mv,P=new kv(X,Ct,Y,lt,Ft,mt,at),C=new Xg(M),z=new Yg(M),O=new r0(X,Ft),Bt=new Gg(X,Ct,O,Ft),Z=new Zg(X,O,at,Bt),V=new i1(X,Z,O,at),$=new n1(X,Ft,P),Yt=new $g(lt),tt=new xv(M,C,z,Ct,Ft,Bt,Yt),it=new Ov(M,lt),pt=new _v,yt=new Tv(Ct,Ft),oe=new Wg(M,C,z,Y,V,f,c),rt=new Dv(M,V,Ft),te=new Bv(X,at,Ft,Y),It=new Hg(X,Ct,at,Ft),At=new Jg(X,Ct,at,Ft),at.programs=tt.programs,M.capabilities=Ft,M.extensions=Ct,M.properties=lt,M.renderLists=pt,M.shadowMap=rt,M.state=Y,M.info=at}he();const Ot=new Nv(M,X);this.xr=Ot,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){const D=Ct.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=Ct.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(D){D!==void 0&&(G=D,this.setSize(k,F,!1))},this.getSize=function(D){return D.set(k,F)},this.setSize=function(D,N,j=!0){if(Ot.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=D,F=N,e.width=Math.floor(D*G),e.height=Math.floor(N*G),j===!0&&(e.style.width=D+"px",e.style.height=N+"px"),this.setViewport(0,0,D,N)},this.getDrawingBufferSize=function(D){return D.set(k*G,F*G).floor()},this.setDrawingBufferSize=function(D,N,j){k=D,F=N,G=j,e.width=Math.floor(D*j),e.height=Math.floor(N*j),this.setViewport(0,0,D,N)},this.getCurrentViewport=function(D){return D.copy(y)},this.getViewport=function(D){return D.copy(H)},this.setViewport=function(D,N,j,J){D.isVector4?H.set(D.x,D.y,D.z,D.w):H.set(D,N,j,J),Y.viewport(y.copy(H).multiplyScalar(G).floor())},this.getScissor=function(D){return D.copy(et)},this.setScissor=function(D,N,j,J){D.isVector4?et.set(D.x,D.y,D.z,D.w):et.set(D,N,j,J),Y.scissor(T.copy(et).multiplyScalar(G).floor())},this.getScissorTest=function(){return ct},this.setScissorTest=function(D){Y.setScissorTest(ct=D)},this.setOpaqueSort=function(D){W=D},this.setTransparentSort=function(D){K=D},this.getClearColor=function(D){return D.copy(oe.getClearColor())},this.setClearColor=function(){oe.setClearColor.apply(oe,arguments)},this.getClearAlpha=function(){return oe.getClearAlpha()},this.setClearAlpha=function(){oe.setClearAlpha.apply(oe,arguments)},this.clear=function(D=!0,N=!0,j=!0){let J=0;if(D){let q=!1;if(E!==null){const xt=E.texture.format;q=xt===ju||xt===Xu||xt===Vu}if(q){const xt=E.texture.type,Tt=xt===de||xt===di||xt===Tc||xt===ts||xt===Gu||xt===Hu,Lt=oe.getClearColor(),kt=oe.getClearAlpha(),jt=Lt.r,Gt=Lt.g,qt=Lt.b;Tt?(p[0]=jt,p[1]=Gt,p[2]=qt,p[3]=kt,X.clearBufferuiv(X.COLOR,0,p)):(g[0]=jt,g[1]=Gt,g[2]=qt,g[3]=kt,X.clearBufferiv(X.COLOR,0,g))}else J|=X.COLOR_BUFFER_BIT}N&&(J|=X.DEPTH_BUFFER_BIT),j&&(J|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ot,!1),e.removeEventListener("webglcontextrestored",U,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),pt.dispose(),yt.dispose(),lt.dispose(),C.dispose(),z.dispose(),V.dispose(),Bt.dispose(),te.dispose(),tt.dispose(),Ot.dispose(),Ot.removeEventListener("sessionstart",we),Ot.removeEventListener("sessionend",re),Mt&&(Mt.dispose(),Mt=null),ze.stop()};function ot(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const D=at.autoReset,N=rt.enabled,j=rt.autoUpdate,J=rt.needsUpdate,q=rt.type;he(),at.autoReset=D,rt.enabled=N,rt.autoUpdate=j,rt.needsUpdate=J,rt.type=q}function ht(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function ut(D){const N=D.target;N.removeEventListener("dispose",ut),zt(N)}function zt(D){Nt(D),lt.remove(D)}function Nt(D){const N=lt.get(D).programs;N!==void 0&&(N.forEach(function(j){tt.releaseProgram(j)}),D.isShaderMaterial&&tt.releaseShaderCache(D))}this.renderBufferDirect=function(D,N,j,J,q,xt){N===null&&(N=Et);const Tt=q.isMesh&&q.matrixWorld.determinant()<0,Lt=wt(D,N,j,J,q);Y.setMaterial(J,Tt);let kt=j.index,jt=1;if(J.wireframe===!0){if(kt=Z.getWireframeAttribute(j),kt===void 0)return;jt=2}const Gt=j.drawRange,qt=j.attributes.position;let _e=Gt.start*jt,mn=(Gt.start+Gt.count)*jt;xt!==null&&(_e=Math.max(_e,xt.start*jt),mn=Math.min(mn,(xt.start+xt.count)*jt)),kt!==null?(_e=Math.max(_e,0),mn=Math.min(mn,kt.count)):qt!=null&&(_e=Math.max(_e,0),mn=Math.min(mn,qt.count));const Fe=mn-_e;if(Fe<0||Fe===1/0)return;Bt.setup(q,J,Lt,j,kt);let ei,me=It;if(kt!==null&&(ei=O.get(kt),me=At,me.setIndex(ei)),q.isMesh)J.wireframe===!0?(Y.setLineWidth(J.wireframeLinewidth*Ut()),me.setMode(X.LINES)):me.setMode(X.TRIANGLES);else if(q.isLine){let Jt=J.linewidth;Jt===void 0&&(Jt=1),Y.setLineWidth(Jt*Ut()),q.isLineSegments?me.setMode(X.LINES):q.isLineLoop?me.setMode(X.LINE_LOOP):me.setMode(X.LINE_STRIP)}else q.isPoints?me.setMode(X.POINTS):q.isSprite&&me.setMode(X.TRIANGLES);if(q.isBatchedMesh)me.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else if(q.isInstancedMesh)me.renderInstances(_e,Fe,q.count);else if(j.isInstancedBufferGeometry){const Jt=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,or=Math.min(j.instanceCount,Jt);me.renderInstances(_e,Fe,or)}else me.render(_e,Fe)};function ne(D,N,j){D.transparent===!0&&D.side===Bn&&D.forceSinglePass===!1?(D.side=rn,D.needsUpdate=!0,ti(D,N,j),D.side=xi,D.needsUpdate=!0,ti(D,N,j),D.side=Bn):ti(D,N,j)}this.compile=function(D,N,j=null){j===null&&(j=D),m=yt.get(j),m.init(),x.push(m),j.traverseVisible(function(q){q.isLight&&q.layers.test(N.layers)&&(m.pushLight(q),q.castShadow&&m.pushShadow(q))}),D!==j&&D.traverseVisible(function(q){q.isLight&&q.layers.test(N.layers)&&(m.pushLight(q),q.castShadow&&m.pushShadow(q))}),m.setupLights(M._useLegacyLights);const J=new Set;return D.traverse(function(q){const xt=q.material;if(xt)if(Array.isArray(xt))for(let Tt=0;Tt<xt.length;Tt++){const Lt=xt[Tt];ne(Lt,j,q),J.add(Lt)}else ne(xt,j,q),J.add(xt)}),x.pop(),m=null,J},this.compileAsync=function(D,N,j=null){const J=this.compile(D,N,j);return new Promise(q=>{function xt(){if(J.forEach(function(Tt){lt.get(Tt).currentProgram.isReady()&&J.delete(Tt)}),J.size===0){q(D);return}setTimeout(xt,10)}Ct.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let ae=null;function pe(D){ae&&ae(D)}function we(){ze.stop()}function re(){ze.start()}const ze=new lf;ze.setAnimationLoop(pe),typeof self<"u"&&ze.setContext(self),this.setAnimationLoop=function(D){ae=D,Ot.setAnimationLoop(D),D===null?ze.stop():ze.start()},Ot.addEventListener("sessionstart",we),Ot.addEventListener("sessionend",re),this.render=function(D,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Ot.enabled===!0&&Ot.isPresenting===!0&&(Ot.cameraAutoUpdate===!0&&Ot.updateCamera(N),N=Ot.getCamera()),D.isScene===!0&&D.onBeforeRender(M,D,N,E),m=yt.get(D,x.length),m.init(),x.push(m),St.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Q.setFromProjectionMatrix(St),dt=this.localClippingEnabled,nt=Yt.init(this.clippingPlanes,dt),v=pt.get(D,d.length),v.init(),d.push(v),Sn(D,N,0,M.sortObjects),v.finish(),M.sortObjects===!0&&v.sort(W,K),this.info.render.frame++,nt===!0&&Yt.beginShadows();const j=m.state.shadowsArray;if(rt.render(j,D,N),nt===!0&&Yt.endShadows(),this.info.autoReset===!0&&this.info.reset(),oe.render(v,D),m.setupLights(M._useLegacyLights),N.isArrayCamera){const J=N.cameras;for(let q=0,xt=J.length;q<xt;q++){const Tt=J[q];Ys(v,D,Tt,Tt.viewport)}}else Ys(v,D,N);E!==null&&(P.updateMultisampleRenderTarget(E),P.updateRenderTargetMipmap(E)),D.isScene===!0&&D.onAfterRender(M,D,N),Bt.resetDefaultState(),A=-1,w=null,x.pop(),x.length>0?m=x[x.length-1]:m=null,d.pop(),d.length>0?v=d[d.length-1]:v=null};function Sn(D,N,j,J){if(D.visible===!1)return;if(D.layers.test(N.layers)){if(D.isGroup)j=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(N);else if(D.isLight)m.pushLight(D),D.castShadow&&m.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||Q.intersectsSprite(D)){J&&Pt.setFromMatrixPosition(D.matrixWorld).applyMatrix4(St);const Tt=V.update(D),Lt=D.material;Lt.visible&&v.push(D,Tt,Lt,j,Pt.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||Q.intersectsObject(D))){const Tt=V.update(D),Lt=D.material;if(J&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),Pt.copy(D.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),Pt.copy(Tt.boundingSphere.center)),Pt.applyMatrix4(D.matrixWorld).applyMatrix4(St)),Array.isArray(Lt)){const kt=Tt.groups;for(let jt=0,Gt=kt.length;jt<Gt;jt++){const qt=kt[jt],_e=Lt[qt.materialIndex];_e&&_e.visible&&v.push(D,Tt,_e,j,Pt.z,qt)}}else Lt.visible&&v.push(D,Tt,Lt,j,Pt.z,null)}}const xt=D.children;for(let Tt=0,Lt=xt.length;Tt<Lt;Tt++)Sn(xt[Tt],N,j,J)}function Ys(D,N,j,J){const q=D.opaque,xt=D.transmissive,Tt=D.transparent;m.setupLightsView(j),nt===!0&&Yt.setGlobalState(M.clippingPlanes,j),xt.length>0&&Ln(q,xt,N,j),J&&Y.viewport(y.copy(J)),q.length>0&&rs(q,N,j),xt.length>0&&rs(xt,N,j),Tt.length>0&&rs(Tt,N,j),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function Ln(D,N,j,J){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;const xt=Ft.isWebGL2;Mt===null&&(Mt=new Jn(1,1,{generateMipmaps:!0,type:Ct.has("EXT_color_buffer_half_float")?Li:de,minFilter:is,samples:xt?4:0})),M.getDrawingBufferSize(Rt),xt?Mt.setSize(Rt.x,Rt.y):Mt.setSize(Oa(Rt.x),Oa(Rt.y));const Tt=M.getRenderTarget();M.setRenderTarget(Mt),M.getClearColor(I),R=M.getClearAlpha(),R<1&&M.setClearColor(16777215,.5),M.clear();const Lt=M.toneMapping;M.toneMapping=Ri,rs(D,j,J),P.updateMultisampleRenderTarget(Mt),P.updateRenderTargetMipmap(Mt);let kt=!1;for(let jt=0,Gt=N.length;jt<Gt;jt++){const qt=N[jt],_e=qt.object,mn=qt.geometry,Fe=qt.material,ei=qt.group;if(Fe.side===Bn&&_e.layers.test(J.layers)){const me=Fe.side;Fe.side=rn,Fe.needsUpdate=!0,Ui(_e,j,J,mn,Fe,ei),Fe.side=me,Fe.needsUpdate=!0,kt=!0}}kt===!0&&(P.updateMultisampleRenderTarget(Mt),P.updateRenderTargetMipmap(Mt)),M.setRenderTarget(Tt),M.setClearColor(I,R),M.toneMapping=Lt}function rs(D,N,j){const J=N.isScene===!0?N.overrideMaterial:null;for(let q=0,xt=D.length;q<xt;q++){const Tt=D[q],Lt=Tt.object,kt=Tt.geometry,jt=J===null?Tt.material:J,Gt=Tt.group;Lt.layers.test(j.layers)&&Ui(Lt,N,j,kt,jt,Gt)}}function Ui(D,N,j,J,q,xt){D.onBeforeRender(M,N,j,J,q,xt),D.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),q.onBeforeRender(M,N,j,J,D,xt),q.transparent===!0&&q.side===Bn&&q.forceSinglePass===!1?(q.side=rn,q.needsUpdate=!0,M.renderBufferDirect(j,N,J,q,D,xt),q.side=xi,q.needsUpdate=!0,M.renderBufferDirect(j,N,J,q,D,xt),q.side=Bn):M.renderBufferDirect(j,N,J,q,D,xt),D.onAfterRender(M,N,j,J,q,xt)}function ti(D,N,j){N.isScene!==!0&&(N=Et);const J=lt.get(D),q=m.state.lights,xt=m.state.shadowsArray,Tt=q.state.version,Lt=tt.getParameters(D,q.state,xt,N,j),kt=tt.getProgramCacheKey(Lt);let jt=J.programs;J.environment=D.isMeshStandardMaterial?N.environment:null,J.fog=N.fog,J.envMap=(D.isMeshStandardMaterial?z:C).get(D.envMap||J.environment),jt===void 0&&(D.addEventListener("dispose",ut),jt=new Map,J.programs=jt);let Gt=jt.get(kt);if(Gt!==void 0){if(J.currentProgram===Gt&&J.lightsStateVersion===Tt)return Fo(D,Lt),Gt}else Lt.uniforms=tt.getUniforms(D),D.onBuild(j,Lt,M),D.onBeforeCompile(Lt,M),Gt=tt.acquireProgram(Lt,kt),jt.set(kt,Gt),J.uniforms=Lt.uniforms;const qt=J.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(qt.clippingPlanes=Yt.uniform),Fo(D,Lt),J.needsLights=$t(D),J.lightsStateVersion=Tt,J.needsLights&&(qt.ambientLightColor.value=q.state.ambient,qt.lightProbe.value=q.state.probe,qt.directionalLights.value=q.state.directional,qt.directionalLightShadows.value=q.state.directionalShadow,qt.spotLights.value=q.state.spot,qt.spotLightShadows.value=q.state.spotShadow,qt.rectAreaLights.value=q.state.rectArea,qt.ltc_1.value=q.state.rectAreaLTC1,qt.ltc_2.value=q.state.rectAreaLTC2,qt.pointLights.value=q.state.point,qt.pointLightShadows.value=q.state.pointShadow,qt.hemisphereLights.value=q.state.hemi,qt.directionalShadowMap.value=q.state.directionalShadowMap,qt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,qt.spotShadowMap.value=q.state.spotShadowMap,qt.spotLightMatrix.value=q.state.spotLightMatrix,qt.spotLightMap.value=q.state.spotLightMap,qt.pointShadowMap.value=q.state.pointShadowMap,qt.pointShadowMatrix.value=q.state.pointShadowMatrix),J.currentProgram=Gt,J.uniformsList=null,Gt}function zo(D){if(D.uniformsList===null){const N=D.currentProgram.getUniforms();D.uniformsList=Aa.seqWithValue(N.seq,D.uniforms)}return D.uniformsList}function Fo(D,N){const j=lt.get(D);j.outputColorSpace=N.outputColorSpace,j.batching=N.batching,j.instancing=N.instancing,j.instancingColor=N.instancingColor,j.skinning=N.skinning,j.morphTargets=N.morphTargets,j.morphNormals=N.morphNormals,j.morphColors=N.morphColors,j.morphTargetsCount=N.morphTargetsCount,j.numClippingPlanes=N.numClippingPlanes,j.numIntersection=N.numClipIntersection,j.vertexAlphas=N.vertexAlphas,j.vertexTangents=N.vertexTangents,j.toneMapping=N.toneMapping}function wt(D,N,j,J,q){N.isScene!==!0&&(N=Et),P.resetTextureUnits();const xt=N.fog,Tt=J.isMeshStandardMaterial?N.environment:null,Lt=E===null?M.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Mi,kt=(J.isMeshStandardMaterial?z:C).get(J.envMap||Tt),jt=J.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,Gt=!!j.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),qt=!!j.morphAttributes.position,_e=!!j.morphAttributes.normal,mn=!!j.morphAttributes.color;let Fe=Ri;J.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Fe=M.toneMapping);const ei=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,me=ei!==void 0?ei.length:0,Jt=lt.get(J),or=m.state.lights;if(nt===!0&&(dt===!0||D!==w)){const En=D===w&&J.id===A;Yt.setState(J,D,En)}let xe=!1;J.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==or.state.version||Jt.outputColorSpace!==Lt||q.isBatchedMesh&&Jt.batching===!1||!q.isBatchedMesh&&Jt.batching===!0||q.isInstancedMesh&&Jt.instancing===!1||!q.isInstancedMesh&&Jt.instancing===!0||q.isSkinnedMesh&&Jt.skinning===!1||!q.isSkinnedMesh&&Jt.skinning===!0||q.isInstancedMesh&&Jt.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Jt.instancingColor===!1&&q.instanceColor!==null||Jt.envMap!==kt||J.fog===!0&&Jt.fog!==xt||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==Yt.numPlanes||Jt.numIntersection!==Yt.numIntersection)||Jt.vertexAlphas!==jt||Jt.vertexTangents!==Gt||Jt.morphTargets!==qt||Jt.morphNormals!==_e||Jt.morphColors!==mn||Jt.toneMapping!==Fe||Ft.isWebGL2===!0&&Jt.morphTargetsCount!==me)&&(xe=!0):(xe=!0,Jt.__version=J.version);let zi=Jt.currentProgram;xe===!0&&(zi=ti(J,N,q));let jc=!1,Ks=!1,ar=!1;const $e=zi.getUniforms(),Fi=Jt.uniforms;if(Y.useProgram(zi.program)&&(jc=!0,Ks=!0,ar=!0),J.id!==A&&(A=J.id,Ks=!0),jc||w!==D){$e.setValue(X,"projectionMatrix",D.projectionMatrix),$e.setValue(X,"viewMatrix",D.matrixWorldInverse);const En=$e.map.cameraPosition;En!==void 0&&En.setValue(X,Pt.setFromMatrixPosition(D.matrixWorld)),Ft.logarithmicDepthBuffer&&$e.setValue(X,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&$e.setValue(X,"isOrthographic",D.isOrthographicCamera===!0),w!==D&&(w=D,Ks=!0,ar=!0)}if(q.isSkinnedMesh){$e.setOptional(X,q,"bindMatrix"),$e.setOptional(X,q,"bindMatrixInverse");const En=q.skeleton;En&&(Ft.floatVertexTextures?(En.boneTexture===null&&En.computeBoneTexture(),$e.setValue(X,"boneTexture",En.boneTexture,P)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}q.isBatchedMesh&&($e.setOptional(X,q,"batchingTexture"),$e.setValue(X,"batchingTexture",q._matricesTexture,P));const rr=j.morphAttributes;if((rr.position!==void 0||rr.normal!==void 0||rr.color!==void 0&&Ft.isWebGL2===!0)&&$.update(q,j,zi),(Ks||Jt.receiveShadow!==q.receiveShadow)&&(Jt.receiveShadow=q.receiveShadow,$e.setValue(X,"receiveShadow",q.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(Fi.envMap.value=kt,Fi.flipEnvMap.value=kt.isCubeTexture&&kt.isRenderTargetTexture===!1?-1:1),Ks&&($e.setValue(X,"toneMappingExposure",M.toneMappingExposure),Jt.needsLights&&gt(Fi,ar),xt&&J.fog===!0&&it.refreshFogUniforms(Fi,xt),it.refreshMaterialUniforms(Fi,J,G,F,Mt),Aa.upload(X,zo(Jt),Fi,P)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(Aa.upload(X,zo(Jt),Fi,P),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&$e.setValue(X,"center",q.center),$e.setValue(X,"modelViewMatrix",q.modelViewMatrix),$e.setValue(X,"normalMatrix",q.normalMatrix),$e.setValue(X,"modelMatrix",q.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){const En=J.uniformsGroups;for(let cr=0,rd=En.length;cr<rd;cr++)if(Ft.isWebGL2){const qc=En[cr];te.update(qc,zi),te.bind(qc,zi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return zi}function gt(D,N){D.ambientLightColor.needsUpdate=N,D.lightProbe.needsUpdate=N,D.directionalLights.needsUpdate=N,D.directionalLightShadows.needsUpdate=N,D.pointLights.needsUpdate=N,D.pointLightShadows.needsUpdate=N,D.spotLights.needsUpdate=N,D.spotLightShadows.needsUpdate=N,D.rectAreaLights.needsUpdate=N,D.hemisphereLights.needsUpdate=N}function $t(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return _},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(D,N,j){lt.get(D.texture).__webglTexture=N,lt.get(D.depthTexture).__webglTexture=j;const J=lt.get(D);J.__hasExternalTextures=!0,J.__hasExternalTextures&&(J.__autoAllocateDepthBuffer=j===void 0,J.__autoAllocateDepthBuffer||Ct.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),J.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(D,N){const j=lt.get(D);j.__webglFramebuffer=N,j.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(D,N=0,j=0){E=D,_=N,S=j;let J=!0,q=null,xt=!1,Tt=!1;if(D){const kt=lt.get(D);kt.__useDefaultFramebuffer!==void 0?(Y.bindFramebuffer(X.FRAMEBUFFER,null),J=!1):kt.__webglFramebuffer===void 0?P.setupRenderTarget(D):kt.__hasExternalTextures&&P.rebindTextures(D,lt.get(D.texture).__webglTexture,lt.get(D.depthTexture).__webglTexture);const jt=D.texture;(jt.isData3DTexture||jt.isDataArrayTexture||jt.isCompressedArrayTexture)&&(Tt=!0);const Gt=lt.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(Gt[N])?q=Gt[N][j]:q=Gt[N],xt=!0):Ft.isWebGL2&&D.samples>0&&P.useMultisampledRTT(D)===!1?q=lt.get(D).__webglMultisampledFramebuffer:Array.isArray(Gt)?q=Gt[j]:q=Gt,y.copy(D.viewport),T.copy(D.scissor),L=D.scissorTest}else y.copy(H).multiplyScalar(G).floor(),T.copy(et).multiplyScalar(G).floor(),L=ct;if(Y.bindFramebuffer(X.FRAMEBUFFER,q)&&Ft.drawBuffers&&J&&Y.drawBuffers(D,q),Y.viewport(y),Y.scissor(T),Y.setScissorTest(L),xt){const kt=lt.get(D.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+N,kt.__webglTexture,j)}else if(Tt){const kt=lt.get(D.texture),jt=N||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,kt.__webglTexture,j||0,jt)}A=-1},this.readRenderTargetPixels=function(D,N,j,J,q,xt,Tt){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=lt.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Tt!==void 0&&(Lt=Lt[Tt]),Lt){Y.bindFramebuffer(X.FRAMEBUFFER,Lt);try{const kt=D.texture,jt=kt.format,Gt=kt.type;if(jt!==Ae&&mt.convert(jt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const qt=Gt===Li&&(Ct.has("EXT_color_buffer_half_float")||Ft.isWebGL2&&Ct.has("EXT_color_buffer_float"));if(Gt!==de&&mt.convert(Gt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Gt===pi&&(Ft.isWebGL2||Ct.has("OES_texture_float")||Ct.has("WEBGL_color_buffer_float")))&&!qt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=D.width-J&&j>=0&&j<=D.height-q&&X.readPixels(N,j,J,q,mt.convert(jt),mt.convert(Gt),xt)}finally{const kt=E!==null?lt.get(E).__webglFramebuffer:null;Y.bindFramebuffer(X.FRAMEBUFFER,kt)}}},this.copyFramebufferToTexture=function(D,N,j=0){const J=Math.pow(2,-j),q=Math.floor(N.image.width*J),xt=Math.floor(N.image.height*J);P.setTexture2D(N,0),X.copyTexSubImage2D(X.TEXTURE_2D,j,0,0,D.x,D.y,q,xt),Y.unbindTexture()},this.copyTextureToTexture=function(D,N,j,J=0){const q=N.image.width,xt=N.image.height,Tt=mt.convert(j.format),Lt=mt.convert(j.type);P.setTexture2D(j,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,j.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,j.unpackAlignment),N.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,J,D.x,D.y,q,xt,Tt,Lt,N.image.data):N.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,J,D.x,D.y,N.mipmaps[0].width,N.mipmaps[0].height,Tt,N.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,J,D.x,D.y,Tt,Lt,N.image),J===0&&j.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),Y.unbindTexture()},this.copyTextureToTexture3D=function(D,N,j,J,q=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const xt=D.max.x-D.min.x+1,Tt=D.max.y-D.min.y+1,Lt=D.max.z-D.min.z+1,kt=mt.convert(J.format),jt=mt.convert(J.type);let Gt;if(J.isData3DTexture)P.setTexture3D(J,0),Gt=X.TEXTURE_3D;else if(J.isDataArrayTexture||J.isCompressedArrayTexture)P.setTexture2DArray(J,0),Gt=X.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,J.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,J.unpackAlignment);const qt=X.getParameter(X.UNPACK_ROW_LENGTH),_e=X.getParameter(X.UNPACK_IMAGE_HEIGHT),mn=X.getParameter(X.UNPACK_SKIP_PIXELS),Fe=X.getParameter(X.UNPACK_SKIP_ROWS),ei=X.getParameter(X.UNPACK_SKIP_IMAGES),me=j.isCompressedTexture?j.mipmaps[q]:j.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,me.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,me.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,D.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,D.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,D.min.z),j.isDataTexture||j.isData3DTexture?X.texSubImage3D(Gt,q,N.x,N.y,N.z,xt,Tt,Lt,kt,jt,me.data):j.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(Gt,q,N.x,N.y,N.z,xt,Tt,Lt,kt,me.data)):X.texSubImage3D(Gt,q,N.x,N.y,N.z,xt,Tt,Lt,kt,jt,me),X.pixelStorei(X.UNPACK_ROW_LENGTH,qt),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,_e),X.pixelStorei(X.UNPACK_SKIP_PIXELS,mn),X.pixelStorei(X.UNPACK_SKIP_ROWS,Fe),X.pixelStorei(X.UNPACK_SKIP_IMAGES,ei),q===0&&J.generateMipmaps&&X.generateMipmap(Gt),Y.unbindTexture()},this.initTexture=function(D){D.isCubeTexture?P.setTextureCube(D,0):D.isData3DTexture?P.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?P.setTexture2DArray(D,0):P.setTexture2D(D,0),Y.unbindTexture()},this.resetState=function(){_=0,S=0,E=null,Y.reset(),Bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Cc?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===Qa?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Be?ns:Yu}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===ns?Be:Mi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Wv extends mf{}Wv.prototype.isWebGL1Renderer=!0;class ir extends pn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Ye extends dn{constructor(t=null,e=1,n=1,i,s,a,r,c,l=ie,h=ie,u,f){super(null,a,r,c,l,h,i,s,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Oe extends De{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ss=new se,vh=new se,ra=[],xh=new bn,Gv=new se,no=new ye,io=new Ii;class Uc extends ye{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Oe(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Gv)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new bn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ss),xh.copy(t.boundingBox).applyMatrix4(Ss),this.boundingBox.union(xh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ii),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ss),io.copy(t.boundingSphere).applyMatrix4(Ss),this.boundingSphere.union(io)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(no.geometry=this.geometry,no.material=this.material,no.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),io.copy(this.boundingSphere),io.applyMatrix4(n),t.ray.intersectsSphere(io)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Ss),vh.multiplyMatrices(n,Ss),no.matrixWorld=vh,no.raycast(t,ra);for(let a=0,r=ra.length;a<r;a++){const c=ra[a];c.instanceId=s,c.object=this,e.push(c)}ra.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Oe(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Hv extends Lo{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Mh=new se,pc=new Lc,ca=new Ii,la=new B;class Vv extends pn{constructor(t=new cn,e=new Hv){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,s=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ca.copy(n.boundingSphere),ca.applyMatrix4(i),ca.radius+=s,t.ray.intersectsSphere(ca)===!1)return;Mh.copy(i).invert(),pc.copy(t.ray).applyMatrix4(Mh);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,a.start),p=Math.min(l.count,a.start+a.count);for(let g=f,v=p;g<v;g++){const m=l.getX(g);la.fromBufferAttribute(u,m),yh(la,m,c,i,t,e,this)}}else{const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let g=f,v=p;g<v;g++)la.fromBufferAttribute(u,g),yh(la,g,c,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const r=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function yh(o,t,e,n,i,s,a){const r=pc.distanceSqToPoint(o);if(r<e){const c=new B;pc.closestPointToPoint(o,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;s.push({distance:l,distanceToRay:Math.sqrt(r),point:c,index:t,face:null,object:a})}}class zc extends cn{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const s=[],a=[];r(i),l(n),h(),this.setAttribute("position",new Te(s,3)),this.setAttribute("normal",new Te(s.slice(),3)),this.setAttribute("uv",new Te(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const M=new B,b=new B,_=new B;for(let S=0;S<e.length;S+=3)p(e[S+0],M),p(e[S+1],b),p(e[S+2],_),c(M,b,_,x)}function c(x,M,b,_){const S=_+1,E=[];for(let A=0;A<=S;A++){E[A]=[];const w=x.clone().lerp(b,A/S),y=M.clone().lerp(b,A/S),T=S-A;for(let L=0;L<=T;L++)L===0&&A===S?E[A][L]=w:E[A][L]=w.clone().lerp(y,L/T)}for(let A=0;A<S;A++)for(let w=0;w<2*(S-A)-1;w++){const y=Math.floor(w/2);w%2===0?(f(E[A][y+1]),f(E[A+1][y]),f(E[A][y])):(f(E[A][y+1]),f(E[A+1][y+1]),f(E[A+1][y]))}}function l(x){const M=new B;for(let b=0;b<s.length;b+=3)M.x=s[b+0],M.y=s[b+1],M.z=s[b+2],M.normalize().multiplyScalar(x),s[b+0]=M.x,s[b+1]=M.y,s[b+2]=M.z}function h(){const x=new B;for(let M=0;M<s.length;M+=3){x.x=s[M+0],x.y=s[M+1],x.z=s[M+2];const b=m(x)/2/Math.PI+.5,_=d(x)/Math.PI+.5;a.push(b,1-_)}g(),u()}function u(){for(let x=0;x<a.length;x+=6){const M=a[x+0],b=a[x+2],_=a[x+4],S=Math.max(M,b,_),E=Math.min(M,b,_);S>.9&&E<.1&&(M<.2&&(a[x+0]+=1),b<.2&&(a[x+2]+=1),_<.2&&(a[x+4]+=1))}}function f(x){s.push(x.x,x.y,x.z)}function p(x,M){const b=x*3;M.x=t[b+0],M.y=t[b+1],M.z=t[b+2]}function g(){const x=new B,M=new B,b=new B,_=new B,S=new Vt,E=new Vt,A=new Vt;for(let w=0,y=0;w<s.length;w+=9,y+=6){x.set(s[w+0],s[w+1],s[w+2]),M.set(s[w+3],s[w+4],s[w+5]),b.set(s[w+6],s[w+7],s[w+8]),S.set(a[y+0],a[y+1]),E.set(a[y+2],a[y+3]),A.set(a[y+4],a[y+5]),_.copy(x).add(M).add(b).divideScalar(3);const T=m(_);v(S,y+0,x,T),v(E,y+2,M,T),v(A,y+4,b,T)}}function v(x,M,b,_){_<0&&x.x===1&&(a[M]=x.x-1),b.x===0&&b.z===0&&(a[M]=_/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zc(t.vertices,t.indices,t.radius,t.details)}}class Fc extends zc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Fc(t.radius,t.detail)}}class Do extends cn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class $v{constructor(t,e,n=0,i=1/0){this.ray=new Lc(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Pc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return mc(t,this,n,e),n.sort(_h),n}intersectObjects(t,e=!0,n=[]){for(let i=0,s=t.length;i<s;i++)mc(t[i],this,n,e);return n.sort(_h),n}}function _h(o,t){return o.distance-t.distance}function mc(o,t,e,n){if(o.layers.test(t.layers)&&o.raycast(t,e),n===!0){const i=o.children;for(let s=0,a=i.length;s<a;s++)mc(i[s],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ac}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ac);const so=o=>Number.isInteger(o)?o.toFixed(1):String(o),Fn={loi:1,pond:24,other:48,max:63},Xv=.5,gf=-.6,jv=.5625,Ve=`
#define PI 3.14159265
#define NEAR_E ${so(Eo)}
#define NORMAL_E ${so(Pu)}
#define SLOTS ${Vn}
#define PATCHES ${Fs}
#define DIST_PATCHES ${Yn}
#define DIST_POND ${Fn.pond}
#define DIST_OTHER ${Fn.other}
#define DIST_FILL ${so(Xv)}
#define DIST_POND_LEVEL ${so(gf)}
#define DIST_BASE ${so(jv)}
`,Io=`
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
`,Nc=`
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
`,wh=Array.from({length:Vn},(o,t)=>t),as=`
${Nc}
${wh.map(o=>`uniform sampler2D uSlotH${o};`).join(`
`)}
float slotMetres(int s, vec2 xz) {
  // (samplers can only be picked by a constant index; the patches are laid
  // on whichever it was once, so the loop is compiled once, not per slot)
  float h = -4000.0;
${wh.map(o=>`  ${o?"else ":""}if (s == ${o}) h = rectMetres(uSlotH${o}, uSlotRect[${o}], xz);`).join(`
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
`,Yv=`
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
`,vf=.05,xf=`
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
`,Mf=`
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
`,Kv=`
${Ve}
${ln}
${Nc}
${xf}
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
`,Zv=`
${Ve}
${Io}
${ln}
${Nc}
${xf}
${qs}
${qv}
${Yv}
${Mf}
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
  if (metres < -${vf.toFixed(2)}) discard;
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
`,Jv=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Oc(){const o=new cn;return o.setAttribute("position",new De(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),o}const Qv=`
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
`;class tx{constructor(t){this.renderer=t,this.size=new Vt;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?Li:de,this.sceneRT=new Jn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new kc(1,1,di),this.quad=new ye(Oc(),new Ce({vertexShader:Jv,fragmentShader:Qv,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Vt},uInvProj:{value:new se},uCamWorld:{value:new se},uCamPos:{value:new B},uSunDir:{value:new B(0,1,0)},uSunColor:{value:new Ht},uFogColor:{value:new Ht(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new ir,this.quadScene.add(this.quad),this.quadCam=new er(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const ex=`
${Ve}
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
`;class nx{constructor(t,e=1024,n=ex){const{W:i,H:s}=t,a=Math.min(1,e/Math.max(i,s)),r=Math.max(16,Math.round(i*a)),c=Math.max(16,Math.round(s*a));this.terrain=t,this.rt=new Jn(r,c,{type:de,format:Pi,depthBuffer:!1,minFilter:We,magFilter:We});const l=t.pack.rect;this.uniforms={...t.uniforms,uSunDir:{value:new B(0,1,0)},uStep:{value:Math.max((l.x1-l.x0)/r,(l.z1-l.z0)/c)},uTop:{value:1}},this.material=new Ce({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:n,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new ir;const h=new ye(Oc(),this.material);h.frustumCulled=!1,this.scene.add(h),this.cam=new er(-1,1,1,-1,0,1),this.h=c,this.strips=4,this.strip=-1,this.drawn={sun:new B(0,-2,0),vert:-1,k:-1}}get texture(){return this.rt.texture}update(t,e,n,i,s){const a=this.uniforms,r=this.drawn;if(this.strip<0){if(!(e.angleTo(r.sun)>.004||Math.abs(n-r.vert)>r.vert*.015||Math.abs(i-r.k)>.03))return;if(a.uSunDir.value.copy(e),a.uTop.value=s,r.sun.copy(e),r.vert=n,r.k=i,!this.ever)return this.ever=!0,this.draw(t,-1);this.strip=0}this.draw(t,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e){const n=this.rt;if(e>=0){const s=Math.ceil(this.h/this.strips);n.scissor.set(0,e*s,n.width,s),n.scissorTest=!0}else n.scissorTest=!1;const i=t.getRenderTarget();t.setRenderTarget(n),t.render(this.scene,this.cam),t.setRenderTarget(i),n.scissorTest=!1}dispose(){this.rt.dispose(),this.material.dispose()}}const Nr=32,bh=1600,Sh=-.5;function yf(o,t,e){const n=new Ye(o,t,e,Pi,pi);return n.minFilter=ie,n.magFilter=ie,n.wrapS=n.wrapT=on,n.needsUpdate=!0,n}function Eh(o,t,e,n=1){const i=new Ye(o,t,e,Ae,de);return i.minFilter=is,i.magFilter=We,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=on,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class gc{constructor(t,e,n=null,i={}){this.pack=t,this.world=e;const s=t.data,{W:a,H:r}=t,{x0:c,z0:l,x1:h,z1:u}=t.rect;this.rect=new ee(c,l,h,u),this.heights=s.metres,this.W=a,this.H=r;const f=e.app.renderer.capabilities.getMaxAnisotropy();this.heightTex=yf(s.metres,a,r),this.normalTex=Eh(s.normals,a,r,Math.min(8,f)),this.landTex=Eh(s.land,a,r,Math.min(4,f)),s.normals=null,s.land=null;const p=Math.max((h-c)/a,(u-l)/r);this.texel=p;const g=Math.max(h-c,u-l);this.levels=Math.max(1,Math.ceil(Math.log2(g/(Nr*p)))+1),this.leafSize=g/2**(this.levels-1),this.buildMinMax(Array.isArray(n)?n:n?[n]:[]),this.full=this.makeGrid(Nr),this.half=this.makeGrid(Nr/2),this.morph=[];for(let d=0;d<12;d++)this.morph.push(new Vt);const v=e.uniforms,m=(Array.isArray(n)?null:n)||e.arch||this;this.uniforms={...v,uOwnH:{value:this.heightTex},uOwnRect:{value:this.rect},uOwnN:{value:this.normalTex},uOwnL:{value:this.landTex},uArchN:{value:m.normalTex},uArchL:{value:m.landTex},uOwnS:{value:null},uOwnLandA:{value:null},uOwnLandB:{value:null},uSelf:{value:-1},uOwnRain:{value:n&&!t.rainUrl?0:1},uMorph:{value:this.morph},uCamPos:{value:new B},uKau:{value:.5},uDebug:{value:0},...i.uniforms},this.group=new Ge;for(const d of[this.full,this.half])d.material=new Ce({vertexShader:i.vertexShader||Kv,fragmentShader:i.fragmentShader||Zv,uniforms:{...this.uniforms,uGrid:{value:d.dim}}}),d.mesh=new ye(d.geometry,d.material),d.mesh.frustumCulled=!1,d.mesh.matrixAutoUpdate=!1,this.group.add(d.mesh);this.shadow=new nx(this,i.shadowSize,i.shadowFragment),this.uniforms.uOwnS.value=this.shadow.texture,this._frustum=new ki,this._m=new se,this._box=new bn,this.rangeK=3.5,this.applyRange(this.rangeK)}makeGrid(t){const e=new Do,n=new Float32Array((t+1)*(t+1)*3);for(let r=0;r<=t;r++)for(let c=0;c<=t;c++){const l=(r*(t+1)+c)*3;n[l]=c/t,n[l+2]=r/t}const i=[];for(let r=0;r<t;r++)for(let c=0;c<t;c++){const l=r*(t+1)+c,h=l+1,u=l+t+1,f=u+1;c+r&1?i.push(l,u,h,h,u,f):i.push(l,u,f,l,f,h)}e.setIndex(i),e.setAttribute("position",new De(n,3));const s=new Float32Array(bh*4),a=new Oe(s,4);return a.setUsage(wn),e.setAttribute("aNode",a),e.instanceCount=0,{dim:t,geometry:e,data:s,attr:a,count:0}}buildMinMax(t){const{W:e,H:n,heights:i}=this,s=this.pack.rect,a=2**(this.levels-1),r=this.leafSize,c=e/(s.x1-s.x0),l=n/(s.z1-s.z0);let h=new Float32Array(a*a).fill(1/0),u=new Float32Array(a*a).fill(-1/0);for(let p=0;p<a;p++){const g=p*r;if(g>=s.z1-s.z0)continue;const v=Math.max(0,Math.floor(g*l)-1),m=Math.min(n-1,Math.ceil((g+r)*l)+1);for(let d=0;d<a;d++){const x=d*r;if(x>=s.x1-s.x0)continue;const M=Math.max(0,Math.floor(x*c)-1),b=Math.min(e-1,Math.ceil((x+r)*c)+1);let _=1/0,S=-1/0;for(let E=v;E<=m;E++)for(let A=M;A<=b;A++){const w=i[E*e+A];w<_&&(_=w),w>S&&(S=w)}if(t.length){const E=Math.max(2,Math.round((m-v)/16));for(const A of t)for(let w=v;w<=m;w+=E)for(let y=M;y<=b;y+=E){const T=A.metresAt(s.x0+(y+.5)/c,s.z0+(w+.5)/l);T<_&&(_=T),T>S&&(S=T)}_-=40,S+=40}h[p*a+d]=_,u[p*a+d]=S}}this.mm=[{lo:h,hi:u,n:a}];let f=a;for(;f>1;){const p=f/2,g=new Float32Array(p*p),v=new Float32Array(p*p);for(let m=0;m<p;m++)for(let d=0;d<p;d++){const x=2*m*f+2*d;g[m*p+d]=Math.min(h[x],h[x+1],h[x+f],h[x+f+1]),v[m*p+d]=Math.max(u[x],u[x+1],u[x+f],u[x+f+1])}h=g,u=v,f=p,this.mm.push({lo:h,hi:u,n:f})}}metresAt(t,e){const n=this.pack.rect,{W:i,H:s,heights:a}=this;let r=(t-n.x0)/(n.x1-n.x0)*i-.5,c=(e-n.z0)/(n.z1-n.z0)*s-.5;r<0?r=0:r>i-1.001&&(r=i-1.001),c<0?c=0:c>s-1.001&&(c=s-1.001);const l=r|0,h=c|0,u=r-l,f=c-h,p=h*i+l,g=a[p]+(a[p+1]-a[p])*u,v=a[p+i]+(a[p+i+1]-a[p+i])*u;return g+(v-g)*f}applyRange(t){this.rangeK=t;const e=t*this.leafSize;this.ranges=[];for(let n=0;n<this.levels;n++)this.ranges.push(e*2**n);this.ranges[this.levels-1]=1e9;for(let n=0;n<this.levels;n++){const i=this.ranges[n],s=n>0?this.ranges[n-1]:0;this.morph[n].set(s+(i-s)*.5,i*.97)}}setSelf(t){this.uniforms.uSelf.value=t;for(const e of[this.full,this.half])e.material.uniforms.uSelf.value=t}update(t,e){this.group.visible=e,this.full.count=0,this.half.count=0,e&&(this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.vert=this.world.uniforms.uVert.value,this.uniforms.uCamPos.value.copy(t.position),this.select(0,0,this.levels-1));for(const n of[this.full,this.half])n.geometry.instanceCount=n.count,n.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],s=this.leafSize*2**n,a=this.pack.rect.x0+t*s,r=this.pack.rect.z0+e*s,c=this.vert,l=Math.min(0,i.lo[e*i.n+t])*c-.3,h=Math.max(0,i.hi[e*i.n+t])*c+.1;return this._box.min.set(a,l,r),this._box.max.set(a+s,h,r+s),this._box}select(t,e,n){const i=this.mm[n];if(!(i.hi[e*i.n+t]>=Sh))return!0;const a=this.nodeBox(t,e,n);if(a.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(a))return!0;const r=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,r,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,r,n),!0;for(let c=0;c<4;c++){const l=t*2+(c&1),h=e*2+(c>>1);if(!this.select(l,h,n-1)){const u=this.mm[n-1];if(!(u.hi[h*u.n+l]>=Sh))continue;const f=this.nodeBox(l,h,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,l,h,r/2,n)}}return!0}emit(t,e,n,i,s){if(t.count>=bh)return;const a=t.count*4;t.data[a]=this.pack.rect.x0+e*i,t.data[a+1]=this.pack.rect.z0+n*i,t.data[a+2]=i,t.data[a+3]=s,t.count++}dispose(){for(const t of[this.full,this.half])t.geometry.dispose(),t.material.dispose();this.shadow.dispose(),this.heightTex.dispose(),this.normalTex.dispose(),this.landTex.dispose()}}const ix=["raise","lower"];async function sx(o){const t=await fetch(o);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}function _f(o,t,e=console.warn,n=null){const i=(o==null?void 0:o.id)||(o==null?void 0:o.keyframe)||(o==null?void 0:o.file)||"?",s=(o==null?void 0:o.kind)??"lower";if(!ix.includes(s))return e(`patch ${i}: kind "${s}" is neither raise nor lower; not drawn`),null;if(!Number.isFinite(o.until))return e(`patch ${i}: no until year; not drawn`),null;if(!o.file)return e(`patch ${i}: no mask file; not drawn`),null;const a=Array.isArray(o.size)&&o.size.length===2&&o.size.every(r=>Number.isInteger(r)&&r>0)?o.size:null;return{id:String(i),pack:o.pack??n,kind:s,depth:Number.isFinite(o.depth)?o.depth:-1,until:o.until,url:t(o.file),size:a,note:o.note||""}}async function ox(o,t=console.warn){const e=new URL(o,location.href),n=a=>new URL(a,e).href;let i;try{i=await sx(n("patches/manifest.json"))}catch{return[]}const s=[];for(const a of(i==null?void 0:i.patches)||[]){if(!(a!=null&&a.pack)){t(`patch ${(a==null?void 0:a.id)??"?"}: no pack; not drawn`);continue}const r=_f(a,n,t);r&&s.push(r)}return s}async function wf(o){const{px:t,W:e,H:n}=await Zn(o),i=new Uint8Array(e*n);for(let s=0,a=0;s<i.length;s++,a+=4)i[s]=t[a];return{grey:i,W:e,H:n}}function ax(o,t,e,n,i){if(t===n&&e===i)return o;const s=new Uint8Array(n*i);for(let a=0;a<i;a++){const r=Math.min(e-1,Math.max(0,(a+.5)/i*e-.5)),c=Math.floor(r),l=Math.min(e-1,c+1),h=r-c;for(let u=0;u<n;u++){const f=Math.min(t-1,Math.max(0,(u+.5)/n*t-.5)),p=Math.floor(f),g=Math.min(t-1,p+1),v=f-p,m=o[c*t+p]+(o[c*t+g]-o[c*t+p])*v,d=o[l*t+p]+(o[l*t+g]-o[l*t+p])*v;s[a*n+u]=Math.round(m+(d-m)*h)}}return s}function rx(o,t,e){let n=t,i=e,s=-1,a=-1;for(let h=0;h<e;h++){const u=h*t;for(let f=0;f<t;f++)o[u+f]&&(f<n&&(n=f),f>s&&(s=f),h<i&&(i=h),h>a&&(a=h))}if(s<0)return null;n=Math.max(0,n-1),i=Math.max(0,i-1),s=Math.min(t-1,s+1),a=Math.min(e-1,a+1);const r=s-n+1,c=a-i+1,l=new Uint8Array(r*c);for(let h=0;h<c;h++)l.set(o.subarray((i+h)*t+n,(i+h)*t+n+r),h*r);return{data:l,w:r,h:c,i0:n,j0:i}}async function cx(o,t=console.warn){const e=[];for(const n of o.masks||[])try{const i=await wf(n.url),[s,a]=n.size||[o.W,o.H];(i.W!==s||i.H!==a)&&t(`${n.url} is ${i.W}×${i.H}, the manifest says ${s}×${a}; read at its own size`),e.push(ax(i.grey,i.W,i.H,o.W,o.H))}catch(i){t(`${n.url}: ${i.message} (that patch is not drawn)`),e.push(new Uint8Array(o.W*o.H))}return e}function bf(){const o=new Ye(new Uint8Array(4),1,1,Pi,de);return o.needsUpdate=!0,{uPatchMap:{value:o},uPatchBox:{value:Array.from({length:Fs},()=>new ee(0,0,1,1))},uPatchUv:{value:Array.from({length:Fs},()=>new ee(0,0,1,1))},uPatchInfo:{value:Array.from({length:Fs},()=>new ee(0,-1,-1,0))},uSlotPatch:{value:Array.from({length:Vn},()=>new Vt(0,0))},uSlotPatchBox:{value:Array.from({length:Vn},()=>new ee(0,0,-1,-1))}}}function lx(o){const e=o.reduce((c,l)=>c+(l.w+1)*(l.h+1),0),n=Math.max(...o.map(c=>c.w))+2*1,i=Math.min(4096,Math.max(n,64,Math.ceil(Math.sqrt(e*1.25))));let s=1,a=1,r=0;for(const c of[...o].sort((l,h)=>h.h-l.h))s+c.w+1>i&&(s=1,a+=r+1,r=0),c.ax=s,c.ay=a,s+=c.w+1,r=Math.max(r,c.h);return{W:i,H:a+r+1}}class hx{constructor(t){this.app=t,this.world=t.world,this.u=t.world.uniforms,this.all=[],this.recs=[],this.byPack=new Map,this.loaded=!1,this.atlas=null,this.warned=!1,this.ready=new Promise(e=>this.resolveReady=e),this.slotKey=""}async load(t=this.app.params.get("patches")||this.app.data.base){var r;const e=this.app.warn,n=await ox(t,e),i=this.loaded;this.all=n,this.resolveReady(n),i&&((r=this.app.districts)==null||r.setPatches(n));const s=new Map(this.world.islandPacks.map(c=>[c.id,c])),a=[];for(const c of n){const l=s.get(c.pack);if(l)try{const h=await wf(c.url),[u,f]=c.size||[l.W,l.H];(h.W!==u||h.H!==f)&&e(`patch ${c.id}: ${c.url} is ${h.W}×${h.H}, the manifest says ${u}×${f}; drawn at its own size`);const p=rx(h.grey,h.W,h.H);if(!p){e(`patch ${c.id}: its mask marks nothing`);continue}const g=l.rect,v=(g.x1-g.x0)/h.W,m=(g.z1-g.z0)/h.H;a.push({...c,crop:p,box:[g.x0+p.i0*v,g.z0+p.j0*m,g.x0+(p.i0+p.w)*v,g.z0+(p.j0+p.h)*m],k:this.want(c),depthM:c.depth})}catch(h){e(`patch ${c.id}: ${h.message}`)}}return this.setRecs(a),this.loaded=!0,n}forPack(t){return this.all.filter(e=>e.pack===t)}setRecs(t){var e;(e=this.atlas)==null||e.dispose(),this.atlas=null,this.recs=t,this.byPack=new Map;for(const n of t)this.byPack.has(n.pack)||this.byPack.set(n.pack,[]),this.byPack.get(n.pack).push(n);for(const n of this.byPack.values())n.sort((i,s)=>i.kind===s.kind?0:i.kind==="raise"?-1:1);if(t.length){const{W:n,H:i}=lx(t.map(r=>r.crop)),s=new Uint8Array(n*i);for(const{crop:r}of t)for(let c=0;c<r.h;c++)s.set(r.data.subarray(c*r.w,(c+1)*r.w),(r.ay+c)*n+r.ax);const a=new Ye(s,n,i,Pi,de);a.minFilter=a.magFilter=We,a.wrapS=a.wrapT=on,a.generateMipmaps=!1,a.unpackAlignment=1,a.needsUpdate=!0,this.atlas=a,this.atlasSize=[n,i];for(const r of t){const c=r.crop;r.uv=[c.ax/n,c.ay/i,(c.ax+c.w)/n,(c.ay+c.h)/i]}}this.u.uPatchMap.value=this.atlas||bf().uPatchMap.value,this.slotKey="",this.write()}want(t,e=this.app.timeline.year){return e<t.until?1:0}update(t){if(!this.recs.length)return;const e=this.app.timeline.year,n=t>0?1-Math.exp(-t*Du):1;for(const i of this.recs){const s=this.want(i,e);i.k+=(s-i.k)*n,Math.abs(s-i.k)<.002&&(i.k=s)}this.write()}settle(){this.update(0)}write(){const t=this.u,e=t.uPatchBox.value,n=t.uPatchUv.value,i=t.uPatchInfo.value,s=t.uSlotPatch.value,a=t.uSlotPatchBox.value;let r=0,c=0;this.world.slots.forEach((l,h)=>{const u=l&&this.byPack.get(l.pack.id)||[],f=r;let p=1/0,g=1/0,v=-1/0,m=-1/0;for(const d of u)if(!(d.k<=0)){if(r>=Fs){c++;continue}e[r].set(...d.box),n[r].set(...d.uv),i[r].set(d.k,d.depthM,d.kind==="raise"?1:-1,0),r++,p=Math.min(p,d.box[0]),g=Math.min(g,d.box[1]),v=Math.max(v,d.box[2]),m=Math.max(m,d.box[3])}s[h].set(f,r-f),v>=p?a[h].set(p,g,v,m):a[h].set(0,0,-1,-1)}),c&&!this.warned&&(this.warned=!0,this.app.warn(`more than ${Fs} patches on the islands in view; ${c} of them are not drawn`))}apply(t,e,n,i){const s=this.byPack.get(t);if(!s)return i;for(const a of s){if(a.k<=0)continue;const r=a.box,c=(e-r[0])/(r[2]-r[0]),l=(n-r[1])/(r[3]-r[1]);if(c<0||l<0||c>1||l>1)continue;const h=this.maskAt(a.crop,c,l)*a.k;h>0&&(i+=((a.kind==="raise"?Math.max(i,a.depthM):Math.min(i,a.depthM))-i)*h)}return i}maskAt(t,e,n){const i=e*t.w-.5,s=n*t.h-.5,a=Math.floor(i),r=Math.floor(s),c=i-a,l=s-r,h=(p,g)=>p<0||g<0||p>=t.w||g>=t.h?0:t.data[g*t.w+p],u=h(a,r)+(h(a+1,r)-h(a,r))*c,f=h(a,r+1)+(h(a+1,r+1)-h(a,r+1))*c;return(u+(f-u)*l)/255}stats(){return{loaded:this.loaded,listed:this.all.length,atlas:this.atlasSize||null,kB:this.atlasSize?Math.round(this.atlasSize[0]*this.atlasSize[1]/1024):0,islands:this.recs.map(t=>({id:t.id,pack:t.pack,kind:t.kind,depth:t.depthM,until:t.until,k:+t.k.toFixed(3),box:t.box.map(e=>+e.toFixed(3)),texels:t.crop.w*t.crop.h})),inSlots:this.u.uSlotPatch.value.map(t=>t.y)}}}const Ah=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)};class ux{constructor(t,e){this.app=t,this.data=e,this.packs=e.packs,this.archPack=this.packs.find(a=>a.kind==="archipelago")||this.packs[0],this.islandPacks=this.packs.filter(a=>a!==this.archPack),this.group=new Ge,this.terrains=new Map,this.slots=new Array(Vn).fill(null),this.exag=Zc(5e3),this.noIslands=!1,this.forceK=null;const n=yf(new Float32Array([-4e3]),1,1),i=new Ye(new Uint8Array(4),1,1,Ae,de);i.needsUpdate=!0,this.dummyAux=i;const s=a=>Array.from({length:a},()=>new ee(0,0,0,0));this.uniforms={uVert:{value:this.exag/100},uExag:{value:this.exag},uArchH:{value:n},uArchRect:{value:new ee(0,0,1,1)},uSlotRect:{value:Array.from({length:Vn},()=>new ee(0,0,1,1))},uSlotInfo:{value:Array.from({length:Vn},()=>new ee(0,0,1,0))},uDistRect:{value:new ee(0,0,1,1)},uDistInfo:{value:new ee(0,0,1,0)},uDistH:{value:n},uDistAux:{value:i},uDistCarve:{value:n},uDistPatch:{value:i},uDistPatchBox:{value:new ee(0,0,0,0)},uDistLower:{value:s(Yn)},uDistRaise:{value:s(Yn)},uDistRaiseTop:{value:-1e9},uFeatK:{value:s(16)},...bf()},this.district=null;for(let a=0;a<Vn;a++)this.uniforms[`uSlotH${a}`]={value:n};this._frustum=new ki,this._m=new se,this._box=new bn,this.dummy=n}setArchipelago(t){const e=new gc(t,this);e.setSelf(-1),this.arch=e,this.terrains.set(t.id,e),this.group.add(e.group),this.uniforms.uArchH.value=e.heightTex,this.uniforms.uArchRect.value.copy(e.rect);const n=t.rect;this.bounds={x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1}}addIsland(t){const e=new gc(t,this,this.arch);e.k=0,e.want=0,e.slot=-1;const n=t.rect;return e.margin=Math.min(15,.08*Math.min(n.x1-n.x0,n.z1-n.z0)),e.group.visible=!1,this.terrains.set(t.id,e),this.group.add(e.group),e}get islands(){return[...this.terrains.values()].filter(t=>t!==this.arch)}wantFor(t,e){const n=t.pack.rect,i=e.position,s=Math.max(n.x0-i.x,0,i.x-n.x1),a=Math.max(n.z0-i.z,0,i.z-n.z1),r=Math.hypot(s,a,Math.max(1,i.y)),c=(innerHeight||800)/(2*Math.tan(e.fov*Math.PI/360)),l=this.arch.texel*c/r;t.score=l;const h=Math.max(1,t.pack.data.hi*this.uniforms.uVert.value);return this._box.min.set(n.x0,0,n.z0),this._box.max.set(n.x1,h,n.z1),this._frustum.intersectsBox(this._box)?Ah(1,2.4,l):0}update(t,e,n){var p,g,v;this.exag=Zc(e),this.uniforms.uExag.value=this.exag,this.uniforms.uVert.value=this.exag/100;const i=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const m of i)m.want=this.noIslands?0:this.wantFor(m,t);const s=i.filter(m=>m.want>0).sort((m,d)=>d.score-m.score),a=new Set(s.slice(0,Vn)),r=1-Math.exp(-n*2.5);for(const m of i){const d=a.has(m)?m.want:0;if(m.slot>=0)m.k+=(d-m.k)*r,Math.abs(d-m.k)<.004&&(m.k=d),m.k<=0&&d<=0&&this.release(m);else if(d>0){const x=this.slots.indexOf(null);x>=0&&this.assign(m,x)}}if(this.forceK!==null)for(const m of this.slots)m&&(m.k=this.forceK);if(this.noIslands)for(const m of this.slots)m&&this.release(m);const c=this.uniforms;for(let m=0;m<Vn;m++){const d=this.slots[m];c.uSlotInfo.value[m].set(d?d.k:0,d?1:0,d?d.margin:1,0)}(p=this.app.patches)==null||p.update(n),this.arch.update(t,!0);for(const m of i)m.update(t,m.slot>=0);(g=this.district)==null||g.update(t,e,n);const l=this.app.renderer,h=this.app.light.sunDir,u=this.uniforms.uVert.value,f=this.maxY+.1;this.arch.shadow.update(l,h,u,0,f);for(const m of i)m.slot>=0&&m.shadow.update(l,h,u,m.k,f);(v=this.district)==null||v.updateShadow(l,h,u,f)}settle(t){var i;const e=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const s of e)s.want=this.wantFor(s,t);const n=e.filter(s=>s.want>0).sort((s,a)=>a.score-s.score).slice(0,this.slots.length);for(const s of e)s.slot>=0&&!n.includes(s)&&this.release(s);for(const s of n){if(s.slot<0){const a=this.slots.indexOf(null);if(a<0)continue;this.assign(s,a)}s.k=s.want}(i=this.app.patches)==null||i.settle()}stats(){var n,i,s;const t={};for(const[a,r]of this.terrains)r.group.visible&&(t[a]=r.full.count+r.half.count);const e=(n=this.district)==null?void 0:n.cur;return(i=e==null?void 0:e.terrain)!=null&&i.group.visible&&(t[e.d.id]=e.terrain.full.count+e.terrain.half.count),{exag:+this.exag.toFixed(2),nodes:t,slots:this.slots.map(a=>a?`${a.pack.id}:${a.k.toFixed(2)}`:null),district:((s=this.district)==null?void 0:s.stats())??null}}assign(t,e){this.slots[e]=t,t.slot=e,t.k=0,t.setSelf(e),t.shadow.ever=!1,t.shadow.strip=-1,t.shadow.drawn.vert=-1,this.uniforms.uSlotRect.value[e].copy(t.rect),this.uniforms[`uSlotH${e}`].value=t.heightTex}release(t){const e=t.slot;e<0||(this.slots[e]=null,t.slot=-1,t.k=0,this.uniforms[`uSlotH${e}`].value=this.dummy,this.uniforms.uSlotInfo.value[e].set(0,0,1,0))}metresAt(t,e){var c;const n=this.arch;if(!n)return-4e3;const i=n.pack.rect;let s=t<i.x0||e<i.z0||t>i.x1||e>i.z1?-4e3:n.metresAt(t,e),a=null,r=0;for(const l of this.slots){if(!l)continue;const h=l.pack.rect,u=Math.min(t-h.x0,h.x1-t,e-h.z0,h.z1-e);u>r&&(r=u,a=l)}if(a){const l=a.k*Ah(0,a.margin,r);l>0&&(s+=(this.ownMetres(a,t,e)-s)*l)}return(c=this.district)!=null&&c.on?this.district.blend(t,e,s):s}ownMetres(t,e,n){const i=t.metresAt(e,n);return this.app.patches?this.app.patches.apply(t.pack.id,e,n,i):i}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.uniforms.uVert.value}get maxY(){let t=0;for(const e of this.terrains.values())t=Math.max(t,e.pack.data.hi);return t*this.uniforms.uVert.value}chainShape(){if(this._chain)return this._chain;const t=this.arch,e=48,n=[];let i=null,s=null;for(const c of this.islandPacks){const l=c.rect,h=[];for(let f=0;f<=e;f++)for(let p=0;p<=e;p++){const g=l.x0+(l.x1-l.x0)*p/e,v=l.z0+(l.z1-l.z0)*f/e;t.metresAt(g,v)>0&&h.push([g,v])}if(!h.length)continue;n.push(...h);const u=(l.x0+l.x1)/2;(!i||u<i.cx)&&(i={cx:u,own:h}),(!s||u>s.cx)&&(s={cx:u,own:h})}if(!n.length){const c=this.bounds,l=[[c.x0,c.z0],[c.x1,c.z0],[c.x1,c.z1],[c.x0,c.z1]];return this._chain={hull:l,from:l[0],to:l[2]}}const a=i.own.reduce((c,[l,h])=>[c[0]+l/i.own.length,c[1]+h/i.own.length],[0,0]),r=s.own.reduce((c,l)=>l[0]+l[1]>c[0]+c[1]?l:c);return this._chain={hull:fx(n),from:a,to:r}}islandAt(t,e){let n=null,i=0;for(const s of this.islands){const a=s.pack.rect,r=Math.min(t-a.x0,a.x1-t,e-a.z0,a.z1-e);r>i&&(i=r,n=s)}return n}setRange(t){var e,n,i;for(const s of this.terrains.values())s.applyRange(t);(i=(n=(e=this.district)==null?void 0:e.cur)==null?void 0:n.terrain)==null||i.applyRange(t)}setDebug(t){var n,i;for(const s of this.terrains.values())s.uniforms.uDebug.value=t;const e=(i=(n=this.district)==null?void 0:n.cur)==null?void 0:i.terrain;if(e)for(const s of[e.full,e.half])s.material.uniforms.uDebug.value=t}}function fx(o){const t=[...o].sort((s,a)=>s[0]-a[0]||s[1]-a[1]);if(t.length<3)return t;const e=(s,a,r)=>(a[0]-s[0])*(r[1]-s[1])-(a[1]-s[1])*(r[0]-s[0]),n=[];for(const s of t){for(;n.length>=2&&e(n.at(-2),n.at(-1),s)<=0;)n.pop();n.push(s)}const i=[];for(let s=t.length-1;s>=0;s--){const a=t[s];for(;i.length>=2&&e(i.at(-2),i.at(-1),a)<=0;)i.pop();i.push(a)}return n.slice(0,-1).concat(i.slice(0,-1))}const dx=`
${Ve}
${ln}
${as}
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
`,px=`
${Ve}
${Io}
${ln}
${as}
${qs}
${Mf}
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
`,mx=`
${Ve}
${ln}
${as}
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
`,ge=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)};function gx(o,t,e){const n=t*e,i=new Uint8Array(n),s=new Int32Array(n).fill(-1),a=new Int32Array(n),r=new Float32Array(n);let c=0;const l=new Int32Array(n);let h=0;const u=x=>{let M=h++;const b=r[x];for(;M>0;){const _=M-1>>1;if(r[l[_]]<=b)break;l[M]=l[_],M=_}l[M]=x},f=()=>{const x=l[0],M=l[--h],b=r[M];let _=0;for(;;){let S=2*_+1;if(S>=h||(S+1<h&&r[l[S+1]]<r[l[S]]&&S++,r[l[S]]>=b))break;l[_]=l[S],_=S}return l[_]=M,x},p=new Int32Array(n);let g=0,v=0;for(let x=0;x<n;x++)o[x]<=0&&(i[x]=1);const m=[-1,1,0,0,-1,1,-1,1],d=[0,0,-1,1,-1,-1,1,1];for(let x=0;x<e;x++)for(let M=0;M<t;M++){const b=x*t+M;if(i[b])continue;let _=M===0||x===0||M===t-1||x===e-1,S=-1;for(let E=0;E<8&&!_;E++){const A=M+m[E],y=(x+d[E])*t+A;o[y]<=0&&(_=!0,S=y)}_&&(i[b]=1,s[b]=S,r[b]=o[b],u(b))}for(;h||g<v;){const x=g<v?p[g++]:f();a[c++]=x;const M=r[x],b=x%t,_=(x-b)/t;for(let S=0;S<8;S++){const E=b+m[S],A=_+d[S];if(E<0||A<0||E>=t||A>=e)continue;const w=A*t+E;i[w]||(i[w]=1,s[w]=x,o[w]<=M?(r[w]=M,p[v++]=w):(r[w]=o[w],u(w)))}g===v&&(g=v=0)}return{rec:s,order:a.subarray(0,c)}}function vx(o,t,e,n){const i=new Float32Array(t*e),{rec:s,order:a}=o;for(let r=0;r<a.length;r++)i[a[r]]=n;for(let r=a.length-1;r>=0;r--){const c=a[r],l=s[c];l>=0&&i[l]>0&&(i[l]+=i[c])}return i}function xx(o,t,e,n,i,s,a=.14){var m;const r=e*n,{rec:c}=o,l=new Uint8Array(r);for(let d=0;d<r;d++)t[d]>=i&&(l[d]=1);const h=new Uint8Array(r);for(let d=0;d<r;d++)l[d]&&c[d]>=0&&l[c[d]]&&(h[c[d]]=1);const u=new Uint8Array(r),f=[];for(let d=0;d<r;d++)l[d]&&!h[d]&&f.push(d);const p=new Float32Array(f.length);f.forEach((d,x)=>{let M=0;for(let b=d;b>=0&&l[b]&&M<1e6;b=c[b])M++;p[x]=M});const g=f.map((d,x)=>x).sort((d,x)=>p[x]-p[d]),v=[];for(const d of g){const x=[];let M=f[d];for(;M>=0&&l[M];){const _=M%e,S=(M-_)/e,[E,A]=s(_+.5,S+.5);if(x.push([E,A,t[M]]),u[M])break;u[M]=1,M=c[M]}if(M>=0&&!l[M]){const _=M%e,S=(M-_)/e,[E,A]=s(_+.5,S+.5);x.push([E,A,((m=x.at(-1))==null?void 0:m[2])??i])}if(x.length<3)continue;const b=yx(Mx(x,3),a);if(!(b.length<2)){v.push(b.length);for(const _ of b)v.push(_[0],_[1],_[2])}}return new Float32Array(v)}function Mx(o,t){const e=o.length,n=o.map(i=>i.slice());for(let i=1;i<e-1;i++){let s=0,a=0,r=0;const c=Math.min(t,i,e-1-i);for(let l=-c;l<=c;l++)s+=o[i+l][0],a+=o[i+l][1],r++;n[i][0]=s/r,n[i][1]=a/r}return n}function yx(o,t){const e=[o[0]];let n=0;for(let s=0;s+1<o.length;s++){const a=o[s],r=o[s+1],c=Math.hypot(r[0]-a[0],r[1]-a[1]);let l=t-n;for(;l<c;){const h=l/c;e.push([a[0]+(r[0]-a[0])*h,a[1]+(r[1]-a[1])*h,a[2]+(r[2]-a[2])*h]),l+=t}n=c-(l-t)}const i=o[o.length-1];return Math.hypot(i[0]-e.at(-1)[0],i[1]-e.at(-1)[1])>t*.3&&e.push(i),e}function _x(o,t,e,n,i){const s=[];let a=1/0,r=-1/0;for(const h of n)for(let u=0;u+1<h.length;u++){const[f,p]=h[u],[g,v]=h[u+1];p!==v&&(s.push(p<v?[p,f,v,g]:[v,g,p,f]),a=Math.min(a,p,v),r=Math.max(r,p,v))}if(!s.length)return 0;const c=[];let l=0;for(let h=Math.max(0,Math.floor(a));h<=Math.min(e-1,Math.ceil(r));h++){const u=h+.5;c.length=0;for(const f of s)f[0]<=u&&f[2]>u&&c.push(f[1]+(u-f[0])/(f[2]-f[0])*(f[3]-f[1]));c.sort((f,p)=>f-p);for(let f=0;f+1<c.length;f+=2){const p=Math.max(0,Math.ceil(c[f]-.5)),g=Math.min(t-1,Math.floor(c[f+1]-.5));for(let v=p;v<=g;v++)o[h*t+v]=i,l++}}return l}function ha(o,t){let e=o*.1031%1,n=t*.1031%1;e<0&&(e+=1),n<0&&(n+=1);let i=e;const s=e*(n+33.33)+n*(i+33.33)+i*(e+33.33);e+=s,n+=s,i+=s;const a=(e+n)*i%1;return a<0?a+1:a}function vc(o,t){const e=Math.floor(o),n=Math.floor(t),i=o-e,s=t-n,a=i*i*(3-2*i),r=s*s*(3-2*s),c=ha(e,n),l=ha(e+1,n),h=ha(e,n+1),u=ha(e+1,n+1);return c+(l-c)*a+(h-c+(c-l+u-h)*a)*r}function ve(o,t=0,e=0){let n=Math.imul(o|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e|0,2246822519);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const Sf=new Float32Array(1),wx=new Uint32Array(Sf.buffer);function xo(o){Sf[0]=o;const t=wx[0],e=t>>>16&32768;let n=(t>>>23&255)-127+15;const i=t&8388607;return n<=0?e:n>=31?e|31744:e|n<<10|i>>>13}function sr(o){const t=o>>>10&31,e=o&1023,n=o&32768?-1:1;return t===0?n*e*5960464477539063e-23:t===31?e?NaN:n*(1/0):n*(1+e/1024)*2**(t-15)}const bx=28,Bc=.5625,Or=[22,36],Th=3.5,Ch=2.6,Sx=32,Ex=.45,Br=[7,16];function Ax({index:o,seed:t=o,inside:e,box:n,m:i,hs:s,cls:a,chanDist:r,aux:c,carve:l,W:h,mx:u,mz:f}){const{x0:p,y0:g,x1:v,y1:m}=n,d=v-p+1,x=m-g+1,M=hn(d,x,_=>!e[(g+Math.floor(_/d))*h+p+_%d],u,f),b=new Set;for(let _=g;_<=m;_++)for(let S=p;S<=v;S++){const E=_*h+S;if(!e[E]||i[E]<=.3)continue;const A=S*u,w=_*f,y=(vc(A/140+t*7.1,w/140)-.5)*24,T=ge(0,Sx,M[(_-g)*d+(S-p)]+y),L=ge(Br[0],Br[1],r[E]);if(T*L<.02)continue;const I=a[E],R=Bc*2**I,k=s[E]/R,F=xo(k-64*Math.floor(k/64)),G=Ef(i[E],sr(F),I),W=Math.round(G/R-.5),K=G-i[E],H=K<0?ge(Th+1,Th,-K):ge(Ch+1,Ch,K),et=T*L*H;if(et<.02)continue;const ct=(r[E]-Br[0])/Tx(W,I,t)+ve(t,W,I*7+2);b.add((I*4096+W)*4096+Math.floor(ct)),c[E*4+1]=Math.round(255*et),c[E*4+2]=I,c[E*4+3]=o,l[E*2]=F,l[E*2+1]=xo(ct)}return b.size}function Tx(o,t,e){return Or[0]+(Or[1]-Or[0])*ve(e,o,t*7+1)}function Cx(o,t,e,n){let i=1/0,s=1/0,a=-1/0,r=-1/0;for(const c of o)for(const[l,h]of c)i=Math.min(i,l),s=Math.min(s,h),a=Math.max(a,l),r=Math.max(r,h);return{x0:Math.max(0,Math.floor(i)-n),y0:Math.max(0,Math.floor(s)-n),x1:Math.min(t-1,Math.ceil(a)+n),y1:Math.min(e-1,Math.ceil(r)+n)}}function Ef(o,t,e){const n=Bc*2**e,i=t+64*Math.floor((o/n-t)/64+.5);return(Math.floor(i)+.5)*n}const Rh=.346,Lh=.387,Ph=.436,Dh=.575,Ih=.702,Is=["ohia","ohiaKrumm","koa","kukui","ohiaai","hau","hala","wiliwili","lama","aalii","niu","milo"],Zt=Object.fromEntries(Is.map((o,t)=>[o,t])),oo={ohiaDry:[1.48,1.41,1.8],ohiaWet:[.72,.75,.7],olapa:[1.32,1.46,1.17]},ua=9;function Rx(o,t){let e=0;for(let i=0;i<t.length;i++)t[i]>0&&(e+=t[i]);if(e<=0)return-1;o*=e;let n=-1;for(let i=0;i<t.length;i++)if(!(t[i]<=0)&&(n=i,(o-=t[i])<0))return i;return n}function Lx({W:o,H:t,mx:e,mz:n,m:i,m1795:s,rain:a,normals:r,rip:c,tpi:l,chanDist:h,clear:u,patch:f,shore:p,toWorld:g,step:v}){const m=Is.map(()=>[]),d=new Int32Array(Is.length),x=new Float32Array(Is.length),M=Math.floor(o*e/v),b=Math.floor(t*n/v);for(let _=0;_<b;_++)for(let S=0;S<M;S++){const E=(S+ve(S,_,11))*v,A=(_+ve(S,_,12))*v,w=Math.min(o-1,Math.floor(E/e)),y=Math.min(t-1,Math.floor(A/n)),T=y*o+w;if(f[T]>0||i[T]<1.2||s[T]<1.2||h[T]<9)continue;const L=i[T],I=a[T]/255+(ve(S,_,3)-.5)*.1,R=a[T]/255,k=r[T*4+1]/255*2-1,F=1-ge(.55,.75,k),G=L-Wa(l,w,y,4),W=Wa(c,w,y,4),K=Math.max(ge(.1,.3,W),ge(12,30,-G)),H=ge(10,30,G)*(1-ge(.05,.2,W)),et=ge(.94,.97,k)*ge(.25,.5,W),ct=R-(.22+43e-5*L),Q=ge(.5,.6,R),nt=1-ge(420-250*Q,760-430*Q,L+(ve(S,_,20)-.5)*120),dt=ge(.42,.6,vc(E/210+13.1,A/210+7.7)),Mt=ge(.6,.7,vc(E/190+41.3,A/190+3.9)),St=1-ge(14,40,h[T]),Rt=L<670&&R>Rh?(1-ge(450,670,L))*(1-ge(Ih-.04,Ih+.02,R)):0,Pt=L<610?1:0,Et=L<550&&I>Ph?et>.5?.8+4*Mt:.1+6*Mt:0,Ut=Math.max(ge(0,20,G),ge(300,420,L));x.fill(0);let X=0,ue=1,Ct=null;if(p.a[(y>>1)*p.w+(w>>1)]<70&&L<8)X=.3,x[Zt.niu]=50,x[Zt.hala]=30,x[Zt.milo]=15;else if(I<Lh&&ct<.04&&L<300)X=.04+.32*K+.22*F,x[Zt.aalii]=35,x[Zt.wiliwili]=R<Lh-.02?25:8,x[Zt.lama]=25,x[Zt.ohia]=12,Ct=oo.ohiaDry;else if(nt>ve(S,_,22))if(et>.5)X=.45,x[Zt.ohiaai]=40*Et,x[Zt.hau]=70*St,x[Zt.kukui]=20*Rt*(1-.9*Mt),x[Zt.hala]=5*Pt;else if(K>.4||F>.4)X=.85,x[Zt.kukui]=70*Rt*(.25+.75*dt)*(1-.9*Mt),x[Zt.hala]=14*Pt*(1-.7*Mt),x[Zt.ohiaai]=10*Et,x[Zt.hau]=60*St*(L<450?1:0),x[Zt.lama]=12*(I<Ph&&ct<0?1:0),x[Zt.ohia]=(5+45*(1-Rt)*(I>Rh?1:0))*(L>150?Ut:0),x[Zt.ohiaKrumm]=10*(1-Rt)*(I>=Dh?1:0)*F;else{const z=ge(460,640,L);X=.25+.55*z,H>.5?(x[Zt.ohia]=60*(L>150?1:0),x[Zt.koa]=20*(L>250?1:0),x[Zt.hala]=20*Pt*(1-z)):(x[Zt.kukui]=45*Rt*(.1+.9*dt)*(1-.9*Mt),x[Zt.hala]=35*Pt*(1-.7*Mt)*(1-.85*z),x[Zt.ohiaai]=10*Et,x[Zt.hau]=60*St*(L<450?1:0),x[Zt.ohia]=(10+50*z)*(L>150?Ut:0),x[Zt.koa]=(10+5*z)*(L>250?1:0))}else I<Dh?(X=L<760?.55:.85,x[Zt.ohia]=45,x[Zt.koa]=30*(L>300?1:0),x[Zt.lama]=15,x[Zt.aalii]=5,x[Zt.kukui]=10*Rt*(K>.5?1:0)):H>.5||F>.5?(X=.6,x[Zt.ohiaKrumm]=55,x[Zt.ohia]=45,ue=.55+.3*ve(S,_,14)):(X=.92,x[Zt.ohia]=80,x[Zt.koa]=10*(k>.8?1:0),x[Zt.ohiaKrumm]=10,Ct=ve(S,_,15)<.12?oo.olapa:oo.ohiaWet);if(X<=ve(S,_,5))continue;const Y=Rx(ve(S,_,6),x);if(Y<0)continue;const[at,lt]=g(E/e,A/n),P=.92+.16*ve(S,_,8),C=Y===Zt.ohia&&Ct?Ct:Y===Zt.ohiaKrumm&&Ct===oo.olapa?oo.olapa:[P,P,P];m[Y].push(at,lt,L-.6,ve(S,_,7)*Math.PI*2,ue*(.8+.4*ve(S,_,9)),C[0],C[1],C[2],u[T]),d[Y]++}return{kinds:Is,lists:m.map(_=>new Float32Array(_)),counts:Array.from(d)}}const Ts=-1,Mo=.5,ao=16;function Wc(o,t,e,n=Mo,i=Ts){return t<128?o+(i-o)*(t/127)*e:o+(Math.max(Mo,n)-o)*((t-128)/127)*e}function Px({W:o,H:t,lowerMasks:e,lowerOf:n,raises:i,patchMask:s,fill:a,log:r}){const c=o*t;let l=o,h=t,u=-1,f=-1;const p=w=>{const y=w%o,T=(w-y)/o;y<l&&(l=y),y>u&&(u=y),T<h&&(h=T),T>f&&(f=T)};for(let w=0;w<c;w++)if(s[w]||a[w])p(w);else for(const y of i)y[w]&&p(w);if(u<0)return null;l=Math.max(0,l-ao),h=Math.max(0,h-ao),u=Math.min(o-1,u+ao),f=Math.min(t-1,f+ao);const g=u-l+1,v=f-h+1,m=w=>(h+Math.floor(w/g))*o+l+w%g,d=65535,x=new Uint32Array(g*v),M=new Uint16Array(g*v).fill(d);let b=[];for(let w=0;w<g*v;w++){const y=m(w);let T=0;n.forEach((L,I)=>{e[L][y]>=128&&(T|=1<<I)}),T&&(x[w]=T,M[w]=0,b.push(w))}for(let w=1;w<d&&b.length;w++){const y=[];for(const T of b){const L=T%g;for(const I of[L>0?T-1:-1,L<g-1?T+1:-1,T-g,T+g])I<0||I>=g*v||M[I]!==d||w>ao&&!s[m(I)]||(M[I]=w,x[I]=x[T],y.push(I))}b=y}const _=n.reduce((w,y,T)=>w|1<<T,0);for(let w=0;w<g*v;w++)a[m(w)]&&(x[w]=_);const S=[0],E=new Map,A=new Uint8Array(g*v*4);for(let w=0;w<g*v;w++){const y=x[w];if(y){let F=E.get(y);F===void 0&&(S.length<16?F=S.push(y)-1:(F=E.get(_)??S.length-1,r==null||r(`patch map: more than 15 sets of lower patches; ${y.toString(2)} goes with group ${F}`)),E.set(y,F)),A[w*4]=F}const T=m(w);let L=-1,I=0,R=-1,k=0;i.forEach((F,G)=>{const W=F[T];W>I?(R=L,k=I,L=G,I=W):W>k&&(R=G,k=W)}),L>=0&&(A[w*4+1]=I,A[w*4+2]=L&15|(Math.max(0,R)&15)<<4,A[w*4+3]=R>=0?k:0)}return{data:A,x0:l,y0:h,w:g,h:v,groups:S}}function kh(o,t,e){const n=new Uint8Array(t*e),i=new Int32Array(t*e);let s=0,a=0;const r=c=>{o[c]<=0&&!n[c]&&(n[c]=1,i[a++]=c)};for(let c=0;c<t;c++)r(c),r((e-1)*t+c);for(let c=0;c<e;c++)r(c*t),r(c*t+t-1);for(;s<a;){const c=i[s++],l=c%t,h=(c-l)/t;l>0&&r(c-1),l<t-1&&r(c+1),h>0&&r(c-t),h<e-1&&r(c+t)}return n}function Dx({heightPx:o,rainPx:t,masks:e=[],lower:n=[],raise:i=[],raiseDepth:s=[],W:a,H:r,scale:c,offset:l,mx:h,mz:u,rect:f,features:p,stride:g=4,log:v=()=>{}}){const m=Date.now(),d={};let x=m;const M=Y=>{const at=Date.now();d[Y]=at-x,x=at},b=a*r,_=Iu(o,a,r,c,l,g),S=t?ku(t,a,r,g):new Uint8Array(b).fill(82),E=new Uint8Array(b);{const Y=kh(_,a,r);for(let at=0;at<b;at++)_[at]<=0&&!Y[at]&&(_[at]=.3,E[at]=1)}const A=(f.x1-f.x0)/a,w=(f.z1-f.z0)/r,y=(Y,at)=>[f.x0+Y*A,f.z0+at*w];M("decode");const T=[...new Set(n)].map(Y=>e[Y]),L=i.map(Y=>e[Y]),I=new Uint8Array(b);for(const Y of L)for(let at=0;at<b;at++)Y[at]>I[at]&&(I[at]=Y[at]);const R=new Uint8Array(b);for(const Y of T)for(let at=0;at<b;at++)Y[at]>=128&&(R[at]=1);if(T.length){const at=(C,z)=>{const O=C%a,Z=(C-O)/a;for(let V=-3;V<=3;V++){const tt=Z+V;if(!(tt<0||tt>=r))for(let it=-3;it<=3;it++){const pt=O+it;if(pt>=0&&pt<a&&z(tt*a+pt))return!0}}return!1},lt=[];for(let C=0;C<b;C++)R[C]||_[C]<=0||_[C]>5||at(C,z=>R[z])&&at(C,z=>_[z]<=0&&!R[z])&&lt.push(C);for(const C of lt)R[C]=1;const P=new Uint8Array(b);for(let C=0;C<b;C++){if(!E[C]||P[C])continue;const z=[C];P[C]=1;let O=!1;for(let Z=0;Z<z.length;Z++){const V=z[Z];!O&&at(V,it=>R[it]===1)&&(O=!0);const tt=V%a;for(const it of[tt>0?V-1:-1,tt<a-1?V+1:-1,V-a,V+a])it>=0&&it<b&&E[it]&&!P[it]&&(P[it]=1,z.push(it))}if(O)for(const Z of z)R[Z]=1}}const k=new Uint8Array(b);if(T.length){const at=O=>_[O]<=0||R[O]===1,lt=hn(a,r,O=>!at(O),h,u),P=hn(a,r,O=>at(O)&&lt[O]>45,h,u),C=hn(a,r,O=>R[O]===1,h,u),z=45+1.5*Math.max(h,u);for(let O=0;O<b;O++)_[O]>0||R[O]||P[O]<=z||I[O]>=64||(C[O]<60?R[O]=2:k[O]=1);for(let O=0;O<b;O++)R[O]&&(R[O]=1)}const F=new Uint8Array(b*4),G=Float32Array.from(_);L.forEach((Y,at)=>{const lt=s[at]??Ts;for(let P=0;P<b;P++)Y[P]&&(G[P]+=(Math.max(G[P],lt)-G[P])*(Y[P]/255))});let W=null,K=null;{let Y=a,at=r,lt=-1,P=-1;for(let C=0;C<b;C++){if(!R[C])continue;const z=C%a,O=(C-z)/a;Y=Math.min(Y,z),lt=Math.max(lt,z),at=Math.min(at,O),P=Math.max(P,O)}if(lt>=0){Y=Math.max(0,Y-12),at=Math.max(0,at-12),lt=Math.min(a-1,lt+12),P=Math.min(r-1,P+12),W={x0:Y,y0:at,x1:lt,y1:P};const C=lt-Y+1,z=P-at+1,O=V=>(at+Math.floor(V/C))*a+Y+V%C,Z=hn(C,z,V=>!R[O(V)]&&_[O(V)]>0,h,u);for(let V=0;V<C*z;V++){const tt=O(V);if(!R[tt])continue;const it=ge(0,45,Z[V]);F[tt*4]=Math.round(127*it),G[tt]+=(Ts-G[tt])*it}}}if(W){const Y=Math.round(15e3/(h*u)),at=new Uint8Array(b),lt=[];for(let P=0;P<b;P++){const C=P%a,z=(P-C)/a;if(C<W.x0||C>W.x1||z<W.y0||z>W.y1||at[P]||G[P]<=0)continue;lt.length=0,lt.push(P),at[P]=1;let O=!1,Z=!1;for(let V=0;V<lt.length;V++){const tt=lt[V],it=tt%a,pt=(tt-it)/a;if(it<=W.x0||pt<=W.y0||it>=W.x1||pt>=W.y1){Z=!0;continue}for(const yt of[tt-1,tt+1,tt-a,tt+a])G[yt]>0?at[yt]||(at[yt]=1,lt.push(yt)):R[yt]&&(O=!0);lt.length>Y&&(Z=!0)}if(!(Z||!O)){K||(K=[]);for(const V of lt)R[V]=1,F[V*4]=127,G[V]=Ts,K.push(V)}}}const H=Float32Array.from(_);let et=null;if(T.length){for(let O=0;O<b;O++)k[O]&&(G[O]=Mo);const Y=kh(G,a,r);for(let O=0;O<b;O++)!k[O]&&G[O]<=0&&!Y[O]&&(k[O]=1);const at=new Float32Array(b),lt=new Float32Array(b);for(let O=0;O<b;O++)k[O]||R[O]||_[O]<=0||(at[O]=Math.min(_[O],6),lt[O]=1);const P=Math.ceil(30/Math.max(h,u)),C=zn(at,a,r,P,2),z=zn(lt,a,r,P,2);et=new Float32Array(b);for(let O=0;O<b;O++){if(!k[O])continue;const Z=z[O]>.001?Math.max(Mo,Math.min(6,C[O]/z[O]-.2)):Mo;et[O]=Z,F[O*4]=255,G[O]=Z,H[O]=Z}}const ct=Px({W:a,H:r,lowerMasks:e,lowerOf:n,raises:L,patchMask:R,fill:k,log:v});M("patches");let Q=H;if(K){Q=Float32Array.from(H);for(const Y of K)Q[Y]=Ts}const nt=zu(Q,a,r,h,u,Uu(Q,a,r,h,u));M("normals");let dt,Mt,St;{const Y=fa(H,a,r,2,!0),at=gx(Y.a,Y.w,Y.h),lt=vx(at,Y.w,Y.h,4*h*u/1e6);M("routing"),St=xx(at,lt,Y.w,Y.h,Ex,(z,O)=>y(z*2,O*2)),M("streams"),Mt=hn(a,r,z=>{const O=z%a,Z=(z-O)/a;return H[z]>0&&lt[(Z>>1)*Y.w+(O>>1)]>=1},h,u);const P=new Float32Array(Y.w*Y.h);for(let z=0;z<P.length;z++)P[z]=Y.a[z]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,lt[z])/.04)/1.6)):0;const C=fa(P,Y.w,Y.h,2,!1);dt={a:zn(C.a,C.w,C.h,1,2),w:C.w,h:C.h}}M("riparian");const Rt=new Uint8Array(b*4);let Pt;{const Y=(at,lt)=>{const P=fa(at,a,r,2,!1),C=hn(P.w,P.h,Z=>P.a[Z]<=0,h*2,u*2),z=new Float32Array(P.w*P.h);for(let Z=1;Z<P.h-1;Z++)for(let V=1;V<P.w-1;V++){const tt=Z*P.w+V,it=P.a[tt];if(it<=0||it>9)continue;const pt=Math.hypot((P.a[tt+1]-P.a[tt-1])/(4*h),(P.a[tt+P.w]-P.a[tt-P.w])/(4*u));z[tt]=C[tt]<70&&pt<.12?1:0}const O={a:zn(z,P.w,P.h,1,1),w:P.w,h:P.h};for(let Z=0;Z<r;Z++)for(let V=0;V<a;V++)Rt[(Z*a+V)*4+lt]=at[Z*a+V]>0?Math.round(255*Math.min(1,Wa(O,V,Z,2)*1.5)):0;return{a:C,w:P.w,h:P.h}};Y(H,1),Pt=Y(G,3)}for(let Y=0;Y<r;Y++)for(let at=0;at<a;at++){const lt=Y*a+at;Rt[lt*4]=t?S[lt]:_[lt]>0?82:0,Rt[lt*4+2]=H[lt]>0?Math.round(255*Math.min(1,Wa(dt,at,Y,4)*1.6)):0}M("sand");const Et=new Uint16Array(b*2);if(et)for(let Y=0;Y<b;Y++)k[Y]&&(Et[Y*2]=xo(et[Y]),Et[Y*2+1]=xo(et[Y]-_[Y]));if(K)for(const Y of K)Et[Y*2+1]=xo(Ts-_[Y]);const Ut={},X=new Uint8Array(b);{const Y=zn(_,a,r,3,2),at=new Uint8Array(b);{const C=new Float32Array(b);for(let O=1;O<r-1;O++)for(let Z=1;Z<a-1;Z++){const V=O*a+Z;C[V]=Math.hypot((Y[V+1]-Y[V-1])/(2*h),(Y[V+a]-Y[V-a])/(2*u))}const z=zn(C,a,r,6,2);for(let O=0;O<b;O++)at[O]=Math.max(0,Math.min(3,Math.round(Math.log2(Math.max(1e-6,z[O]*bx/Bc)))))}const lt=new Uint8Array(b),P={village:0,loi:1,pond:2};for(const C of[...p].sort((z,O)=>P[z.kind]-P[O.kind])){const z=Cx(C.rings,a,r,4);for(let Z=z.y0;Z<=z.y1;Z++)lt.fill(0,Z*a+z.x0,Z*a+z.x1+1);const O=_x(lt,a,r,C.rings,1);if(O){if(C.kind==="loi")Ut[C.index]=(Ut[C.index]||0)+Ax({index:C.index,seed:C.seed,inside:lt,box:z,m:_,hs:Y,cls:at,chanDist:Mt,aux:F,carve:Et,W:a,mx:h,mz:u});else{const Z=z.x1-z.x0+1,V=z.y1-z.y0+1,tt=hn(Z,V,it=>!lt[(z.y0+Math.floor(it/Z))*a+z.x0+it%Z],h,u);for(let it=z.y0;it<=z.y1;it++)for(let pt=z.x0;pt<=z.x1;pt++){const yt=it*a+pt;lt[yt]&&(F[yt*4+1]=Math.round(255*ge(0,C.kind==="pond"?9:40,tt[(it-z.y0)*Z+(pt-z.x0)])),F[yt*4+2]=0,F[yt*4+3]=C.index,Et[yt*2]=Et[yt*2+1]=0)}Ut[C.index]=(Ut[C.index]||0)+O}for(let Z=z.y0;Z<=z.y1;Z++)for(let V=z.x0;V<=z.x1;V++)lt[Z*a+V]&&(X[Z*a+V]=C.index)}}}M("features");let ue;{const Y=Ix(X,a,r,5),at=fa(_,a,r,4,!1),lt={a:zn(at.a,at.w,at.h,2,2),w:at.w,h:at.h};ue=Lx({W:a,H:r,mx:h,mz:u,m:_,m1795:G,rain:S,normals:nt,rip:dt,tpi:lt,chanDist:Mt,clear:Y,patch:R,shore:Pt,toWorld:y,step:25})}M("trees");let Ct=1/0,Ft=-1/0;for(let Y=0;Y<b;Y++)_[Y]<Ct&&(Ct=_[Y]),_[Y]>Ft&&(Ft=_[Y]);return v(`district decoded in ${Date.now()-m} ms: ${JSON.stringify(d)}`),{metres:_,normals:nt,land:Rt,aux:F,carve:Et,streams:St,trees:ue,counts:Ut,lo:Ct,hi:Ft,patchMap:ct,ms:Date.now()-m,times:d}}function fa(o,t,e,n,i){const s=Math.ceil(t/n),a=Math.ceil(e/n),r=new Float32Array(s*a).fill(i?1/0:-1/0);for(let c=0;c<e;c++){const l=Math.floor(c/n)*s;for(let h=0;h<t;h++){const u=l+Math.floor(h/n),f=o[c*t+h];(i?f<r[u]:f>r[u])&&(r[u]=f)}}return{a:r,w:s,h:a}}function Wa(o,t,e,n){const i=Math.min(o.w-1.001,Math.max(0,(t+.5)/n-.5)),s=Math.min(o.h-1.001,Math.max(0,(e+.5)/n-.5)),a=i|0,r=s|0,c=i-a,l=s-r,h=o.a,u=r*o.w+a,f=h[u]+(h[u+1]-h[u])*c,p=h[u+o.w]+(h[u+o.w+1]-h[u+o.w])*c;return f+(p-f)*l}function Ix(o,t,e,n){const i=Uint8Array.from(o);for(let a=0;a<e;a++)for(let r=0;r<t;r++){const c=a*t+r;if(!o[c])for(let l=1;l<=n;l++){const h=r-l>=0&&o[c-l]||r+l<t&&o[c+l];if(h){i[c]=h;break}}}const s=Uint8Array.from(i);for(let a=0;a<e;a++)for(let r=0;r<t;r++){const c=a*t+r;if(!i[c])for(let l=1;l<=n;l++){const h=a-l>=0&&i[c-l*t]||a+l<e&&i[c+l*t];if(h){s[c]=h;break}}}return s}const Wr=24;async function Uh(o){const t=await fetch(o);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}async function kx(o,t=console.warn){let e;try{e=await Uh(o.abs("districts/manifest.json"))}catch{return[]}const n=[];for(const i of e.districts||[])try{let s={type:"FeatureCollection",features:[]};if(i.features)try{s=await Uh(o.abs(`districts/${i.features}`))}catch(a){t(`districts/${i.features}: ${a.message} (the district is drawn without its features)`)}n.push(Ux(i,s,o,t))}catch(s){t(`district ${i.id}: ${s.message}`)}return n}function ko(o){return[Number.isFinite(o==null?void 0:o.from)?o.from:-1/0,Number.isFinite(o==null?void 0:o.to)?o.to:1/0]}function Uo(o,t){const[e,n]=ko(o);return t>=e&&t<n+1}function Ux(o,t,e,n){var A;const s=e.proj.rect(o.bounds),[a,r]=o.size,[c,l,h,u]=o.bounds,f=w=>e.abs(`districts/${w}`),p=([w,y])=>[(w-c)/(h-c)*a,(u-y)/(u-l)*r],g={loi:Fn.loi,pond:Fn.pond,other:Fn.other},v={loi:Fn.pond-1,pond:Fn.other-1,other:Fn.max},m=w=>w.kind==="loi"?"loi":w.kind==="fishpond"?"pond":w.kind==="village"?"other":null,d=(t.features||[]).filter(w=>{var y;return m(w.properties||{})&&((y=w.geometry)==null?void 0:y.type)==="Polygon"}),x=Object.fromEntries(Object.keys(g).map(w=>[w,d.filter(y=>m(y.properties)===w).length>v[w]-g[w]+1])),M=new Map,b=[],_=new Map,S=[];for(const w of d){const y=w.properties,T=m(y),L=Fn[T]+S.filter(k=>m(k.f.properties)===T).length,I=`${T} ${ko(y).join(" ")}`;let R=x[T]?M.get(I):void 0;if(R===void 0){if(g[T]>v[T]){n(`district ${o.id}: more ${y.kind} features in years of their own than the aux map has room for; ${y.name} is not drawn`);continue}R=g[T]++,x[T]&&M.set(I,R)}b.push({index:R,seed:L,kind:T==="other"?y.kind:T,rings:w.geometry.coordinates.map(k=>k.map(p))}),_.has(R)||_.set(R,w),S.push({index:R,f:w})}const E=(o.patches||[]).map(w=>_f(w,f,y=>n(`district ${o.id}: ${y}`),o.id)).filter(Boolean);return{id:o.id,name:o.name||o.id,parent:o.parent||o.island,desc:o,bounds:o.bounds,rect:s,W:a,H:r,mx:(s.x1-s.x0)*Bs/a,mz:(s.z1-s.z0)*Bs/r,heightUrl:f(o.height.file),rainUrl:(A=o.rain)!=null&&A.file?f(o.rain.file):null,scale:o.height.scale??.25,offset:o.height.offset??-6e3,own:E,patches:E,features:t,raster:b,byIndex:_,rastered:S,sources:o.sources||[]}}function zx(o,t=[],e=console.warn){const n=[...o.own,...t.filter(a=>a.pack===o.id)],i=n.filter(a=>a.kind==="lower"),s=n.filter(a=>a.kind==="raise");return i.length>Wr&&e(`district ${o.id}: ${i.length} lower patches, ${Wr} drawn`),s.length>Yn&&e(`district ${o.id}: ${s.length} raise patches, ${Yn} drawn`),[...s.slice(0,Yn),...i.slice(0,Wr)]}class Fx{constructor(t=console.warn){this.warn=t,this.jobs=new Map,this.n=0;try{this.worker=new Worker(new URL(""+new URL("district-worker-M-NrOBek.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=e=>this.message(e.data),this.worker.onerror=e=>{var n;(n=e.preventDefault)==null||n.call(e),this.fallback=!0;for(const[i,s]of this.jobs)this.mainThread(i,s)}}catch{this.fallback=!0}}job(t){const e=[],n=a=>{let r=e.findIndex(c=>c.url===a.url);return r<0&&(r=e.push({url:a.url,size:a.size})-1),r},i=t.patches.filter(a=>a.kind==="lower").map(n),s=t.patches.filter(a=>a.kind==="raise");return{heightUrl:t.heightUrl,rainUrl:t.rainUrl,masks:e,lower:i,raise:s.map(n),raiseDepth:s.map(a=>a.depth),W:t.W,H:t.H,scale:t.scale,offset:t.offset,mx:t.mx,mz:t.mz,rect:{x0:t.rect.x0,z0:t.rect.z0,x1:t.rect.x1,z1:t.rect.z1},features:t.raster.map(a=>({index:a.index,seed:a.seed,kind:a.kind,rings:a.rings}))}}decode(t){return new Promise((e,n)=>{const i=++this.n,s={d:t,resolve:e,reject:n};this.jobs.set(i,s),this.fallback?this.mainThread(i,s):this.worker.postMessage({id:i,...this.job(t)})})}message(t){const e=this.jobs.get(t.id);if(e){if(t.log)return this.warn(t.log);this.jobs.delete(t.id),t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,this.jobs.set(t.id,e),this.mainThread(t.id,e)):e.reject(new Error(t.message))}}async mainThread(t,e){try{const n=this.job(e.d),i=await Zn(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);const s=n.rainUrl?await Zn(n.rainUrl).then(c=>c.W===n.W&&c.H===n.H?c.px:null).catch(()=>null):null,a=await cx(n,this.warn),r=Dx({...n,heightPx:i.px,rainPx:s,masks:a});this.jobs.delete(t),e.resolve(r)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){var t;(t=this.worker)==null||t.terminate()}}const Pe=dd,ui=o=>o*Eo/100,st={plain:0,thatch:1,stone:2,leaf:3,water:4,kapa:5,wood:6,skin:7,sand:8,clap:9,windows:10,roof:11,masonry:12};class Ue{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.feat=[],this.featNow=0,this.xf=null,this.stack=[]}at(t,e,n,i=0,s=Pe){this.stack.push(this.xf);const a=Math.cos(i),r=Math.sin(i);return this.xf=c=>[t+(c[0]*a-c[2]*r)*s,e+c[1]*s,n+(c[0]*r+c[2]*a)*s],this}done(){return this.xf=this.stack.pop()||null,this}feature(t){return this.featNow=t,this}tri(t,e,n,i,s=0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const a=e[0]-t[0],r=e[1]-t[1],c=e[2]-t[2],l=n[0]-t[0],h=n[1]-t[1],u=n[2]-t[2];let f=r*u-c*h,p=c*l-a*u,g=a*h-r*l;const v=Math.hypot(f,p,g)||1;f/=v,p/=v,g/=v;for(const m of[t,e,n])this.pos.push(m[0],m[1],m[2]),this.nor.push(f,p,g),this.col.push(i[0],i[1],i[2]),this.mat.push(s),this.feat.push(this.featNow)}quad(t,e,n,i,s,a=0){this.tri(t,e,n,s,a),this.tri(t,n,i,s,a)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let s=0;s<4;s++)this.quad(t[s],e[s],e[(s+1)%4],t[(s+1)%4],n,i)}box(t,e,n,i,s,a,r,c=0,l=0,h=1){const u=Math.cos(l),f=Math.sin(l),p=(b,_,S)=>[t+b*u-S*f,e+_,n+b*f+S*u],g=i/2,v=a/2,m=g*h,d=v*h,x=[p(-g,0,-v),p(g,0,-v),p(g,0,v),p(-g,0,v)],M=[p(-m,s,-d),p(m,s,-d),p(m,s,d),p(-m,s,d)];s<0?this.hexa(M,x,r,c):this.hexa(x,M,r,c)}cyl(t,e,n,i,s,a=0,r=6){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],l=Math.hypot(...c)||1,h=c.map(m=>m/l),u=Math.abs(h[1])<.9?[0,1,0]:[1,0,0];let f=[h[1]*u[2]-h[2]*u[1],h[2]*u[0]-h[0]*u[2],h[0]*u[1]-h[1]*u[0]];const p=Math.hypot(...f);f=f.map(m=>m/p);const g=[h[1]*f[2]-h[2]*f[1],h[2]*f[0]-h[0]*f[2],h[0]*f[1]-h[1]*f[0]],v=(m,d,x)=>{const M=x/r*Math.PI*2,b=Math.cos(M)*d,_=Math.sin(M)*d;return[m[0]+f[0]*b+g[0]*_,m[1]+f[1]*b+g[1]*_,m[2]+f[2]*b+g[2]*_]};for(let m=0;m<r;m++)this.quad(v(t,n,m),v(t,n,m+1),v(e,i,m+1),v(e,i,m),s,a)}blob(t,e,n,i,s,a,r,c=0,l=0,h=c===st.leaf){const u=(1+Math.sqrt(5))/2,f=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],p=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],g=d=>.85+.3*Math.abs(Math.sin(d*12.9898+l*78.233)*43758.5453%1),v=f.map((d,x)=>{const M=Math.hypot(...d),b=g(x);return[t+d[0]/M*i*b,e+d[1]/M*s*b,n+d[2]/M*a*b]});if(!h){for(const d of p)this.tri(v[d[0]],v[d[1]],v[d[2]],r,c);return}const m=d=>{const x=[(d[0]-t)/(i*i),(d[1]-e)/(s*s),(d[2]-n)/(a*a)],M=Math.hypot(...x)||1;return[x[0]/M,x[1]/M,x[2]/M]};for(const d of p){const x=d.map(b=>v[b]),M=this.xf?x.map(b=>this.xf(b)):x;for(let b=0;b<3;b++)this.pos.push(...M[b]),this.nor.push(...m(x[b])),this.col.push(r[0],r[1],r[2]),this.mat.push(c),this.feat.push(this.featNow)}}wall(t,e,n,i,s=st.stone,a=.7){const r=t.length;if(r<2)return;const c=r>2&&Math.hypot(t[0][0]-t[r-1][0],t[0][2]-t[r-1][2])<1e-9,l=[];for(let v=0;v<r-1;v++){const m=t[v+1][0]-t[v][0],d=t[v+1][2]-t[v][2],x=Math.hypot(m,d)||1;l.push([-d/x,m/x])}const h=t.map((v,m)=>{let d=l[m-1],x=l[m];if(c&&m===0&&(d=l[r-2]),c&&m===r-1&&(x=l[0]),!d)return x;if(!x)return d;const M=d[0]+x[0],b=d[1]+x[1],_=Math.hypot(M,b);if(_<1e-6)return x;const S=1/Math.max(.35,(M*x[0]+b*x[1])/_);return[M/_*S,b/_*S]}),u=e/2,f=e*a/2,p=(v,m,d,x)=>[v[0]+m[0]*d,v[1]+x,v[2]+m[1]*d],g=v=>[p(t[v],h[v],-u,-n*.3),p(t[v],h[v],u,-n*.3),p(t[v],h[v],f,n),p(t[v],h[v],-f,n)];for(let v=0;v<r-1;v++){const[m,d,x,M]=g(v),[b,_,S,E]=g(v+1);this.quad(M,x,S,E,i,s),this.quad(d,_,S,x,i,s),this.quad(b,m,M,E,i,s)}if(!c){const[v,m,d,x]=g(0),[M,b,_,S]=g(r-1);this.quad(v,m,d,x,i,s),this.quad(b,M,S,_,i,s)}}geometry(){const t=new cn;return t.setAttribute("position",new Te(this.pos,3)),t.setAttribute("normal",new Te(this.nor,3)),t.setAttribute("color",new Te(this.col,3)),t.setAttribute("aMat",new Te(this.mat,1)),t.setAttribute("aFeat",new Te(this.feat,1)),t.computeBoundingSphere(),t}}function xc(o){const t=o.attributes.position.array,e=o.attributes.normal.array,n=o.attributes.color.array,i=o.attributes.aMat.array,s=new Map,a=[],r=[],c=[],l=[],h=[];for(let f=0;f<i.length;f++){const p=`${t[f*3]},${t[f*3+1]},${t[f*3+2]},${e[f*3]},${e[f*3+1]},${e[f*3+2]},${n[f*3]},${n[f*3+1]},${n[f*3+2]},${i[f]}`;let g=s.get(p);g===void 0&&(g=s.size,s.set(p,g),r.push(t[f*3],t[f*3+1],t[f*3+2]),c.push(e[f*3],e[f*3+1],e[f*3+2]),l.push(n[f*3],n[f*3+1],n[f*3+2]),h.push(i[f])),a.push(g)}const u=new cn;return u.setAttribute("position",new Te(r,3)),u.setAttribute("normal",new Te(c,3)),u.setAttribute("color",new Te(l,3)),u.setAttribute("aMat",new Te(h,1)),u.setIndex(a),u.computeBoundingSphere(),u}function _t(o,t=0,e=Math.random){const n=new Ht(o),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const Nx=`
${Ve}
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
`,Ox=`
${Ve}
${Io}
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
`;function To(o,t,e={}){const[n,i]=e.fade||[60,90];return new Ce({vertexShader:Nx,fragmentShader:Ox,vertexColors:!0,side:e.doubleSide?Bn:xi,defines:{...e.grow?{USE_GROW:""}:{},...e.yield?{USE_YIELD:""}:{}},uniforms:{...o.uniforms,uYearNow:{value:0},uTownClear:{value:null},...t,uShadeS:t.uShadeS??t.uDistS??{value:null},uShadeRect:t.uShadeRect??o.uniforms.uDistRect,uFadeNear:{value:n},uFadeFar:{value:i}}})}const yo={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",koa:"#7a4a2a",pondStone:"#8a817a"};function Ga(o,t,e=7,n=4.6,i=5.2,s=!0,a=.6){const r=_t(yo.thatch,.18,t),c=_t(yo.thatchDark,.15,t),l=_t(yo.stone,.15,t);o.box(0,-a,0,e+1.8,.45+a,n+1.8,l,st.stone);const h=.45,u=h+1.05;o.box(0,h,0,e,u-h,n,r,st.thatch);const f=e/2+.35,p=n/2+.45,g=h+i,v=[-f,u-.15,-p],m=[f,u-.15,-p],d=[-f,g,0],x=[f,g,0],M=[-f,u-.15,p],b=[f,u-.15,p];o.quad(v,d,x,m,r,st.thatch),o.quad(b,x,d,M,r,st.thatch),o.quad(m,x,d,v,c,st.thatch),o.quad(M,d,x,b,c,st.thatch);const _=e/2;if(o.tri([-_,u,-n/2],[-_,u,n/2],[-_,g-.2,0],r,st.thatch),o.tri([_,u,n/2],[_,u,-n/2],[_,g-.2,0],r,st.thatch),o.box(0,g-.12,0,e+.9,.35,.55,c,st.thatch),s){const S=[.05,.035,.025];o.box(_+.15,h,0,.3,1.4,.9,S,0)}}function Bx(o,t,e=8){const n=_t(yo.koa,.2,t),i=_t("#4a2c18",.2,t),s=e/2;o.box(0,0,0,e*.8,.55,.62,n,st.wood,0,.9),o.box(s*.85,.05,0,e*.2,.6,.4,i,st.wood,0,.5),o.box(-s*.85,.05,0,e*.2,.55,.4,i,st.wood,0,.5);const a=-2.4;for(const r of[-e*.15,e*.15])o.cyl([r,.55,0],[r,.5,a],.06,.06,i,st.wood,4);o.box(0,.05,a,e*.5,.28,.24,i,st.wood,0,.8)}function Wx(o,t){const e=_t("#4d4642",.2,t);for(let n=0;n<5;n++)o.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,st.stone,n)}const Ta=Math.PI*2,_o=[[0,1,0]];for(let o=0;o<10;o++){const t=o*Math.PI/5,e=o%2?-1:1;_o.push([Math.cos(t)*.8944,e*.4472,Math.sin(t)*.8944])}_o.push([0,-1,0]);const Af=[];for(let o=0;o<5;o++){const t=1+2*o,e=t+1,n=1+(2*o+2)%10,i=1+(2*o+3)%10;Af.push([0,t,n],[t,e,n],[n,e,i],[11,e,i])}function Gx(o,t,e,n,i,s,a,r,c,l=0,h=.1,u=1){const f=(m,d,x)=>{const M=Math.max(0,Math.min(1,(x-m)/(d-m)));return M*M*(3-2*M)},p=_o.map((m,d)=>{const x=d===0||d===11?1:1-h+2*h*Math.abs(Math.sin(d*12.9898+l*78.233)*43758.5453%1);return[t+m[0]*i*x,e+m[1]*s,n+m[2]*a*x]}),g=_o.map(m=>{const d=[m[0]/i,m[1]/s,m[2]/a],x=Math.hypot(...d);return[d[0]/x,d[1]/x,d[2]/x]}),v=_o.map(m=>{const d=u+(1-u)*f(-.8,.3,m[1]);return[r[0]*d,r[1]*d,r[2]*d]});for(const m of Af){const[d,x,M]=m.map(A=>p[A]),b=(x[1]-d[1])*(M[2]-d[2])-(x[2]-d[2])*(M[1]-d[1]),_=(x[2]-d[2])*(M[0]-d[0])-(x[0]-d[0])*(M[2]-d[2]),S=(x[0]-d[0])*(M[1]-d[1])-(x[1]-d[1])*(M[0]-d[0]),E=b*(d[0]+x[0]+M[0]-3*t)+_*(d[1]+x[1]+M[1]-3*e)+S*(d[2]+x[2]+M[2]-3*n)>0;for(const A of E?m:[m[0],m[2],m[1]])o.pos.push(p[A][0],p[A][1],p[A][2]),o.nor.push(g[A][0],g[A][1],g[A][2]),o.col.push(v[A][0],v[A][1],v[A][2]),o.mat.push(c),o.feat.push(0)}}function kn(o,{stick:t,r0:e=.4,r1:n=.25,bark:i="#6a6058",limbs:s=[],crowns:a}){const r=new Ue,c=_t(i,.1,o);t&&r.cyl([0,0,0],t,e,n,c,st.wood,3);for(const[l,h,u,f]of s)r.cyl(l,h,u,f,c,st.wood,3);for(const[l,h,u,f,p,g,v=st.leaf,m=1,d=1]of a)Gx(r,l,h,u,f,p,f,typeof g=="string"?_t(g,.1,o):g,v,m,.1,d);return r.geometry()}function Hx(o){const t=new Ue,e=_t("#8a7a62",.1,o),n=14;let i=[0,0,0];for(let c=1;c<=4;c++){const l=c/4*n,h=[.06*Math.pow(l,1.5),l,0];t.cyl(i,h,.3-c*.025,.28-c*.03,e,st.wood,5),i=h}const s=i,a=_t("#6E7A3E",.12,o),r=_t("#8f9a43",.1,o);for(let c=0;c<9;c++){const l=c/9*Ta+o()*.3,h=5.2+o()*1.2,u=1.4+o()*.8,f=Math.cos(l),p=Math.sin(l);let g=s;for(let v=1;v<=4;v++){const m=v/4,d=[s[0]+f*h*m,s[1]+u*m-3.8*m*m,s[2]+p*h*m],x=1*Math.sin(Math.PI*Math.min(1,m*1.1))+.15,M=-p*x,b=f*x,_=v>2?r:a;t.quad(g,d,[d[0]+M,d[1]-.35*x,d[2]+b],[g[0]+M*.7,g[1]-.25*x,g[2]+b*.7],_,st.leaf),t.quad([g[0]-M*.7,g[1]-.25*x,g[2]-b*.7],[d[0]-M,d[1]-.35*x,d[2]-b],d,g,_,st.leaf),g=d}}return t.geometry()}function Vx(o){const t=[];for(let c=0;c<4;c++){const l=c/4*Ta+.3;for(const h of[-1,1])t.push([Math.cos(l+h*.35)*6.2,10.2+(h>0?.4:0),Math.sin(l+h*.35)*6.2])}const e=[[2.6,6.1,.9],[2.1,6.4,-1.6],[-1.9,6.2,1.4],[-2.2,5.9,-1.1]],n=[0,1,2,3,4].map(c=>[Math.cos(c/5*Ta)*3.6,3.4,Math.sin(c/5*Ta)*3.6]),i="#56603D",s="#66704A",a="#77825A",r=_t("#5C603F",0,o).map(c=>c*.95);return{ohia:kn(o,{stick:[.3,6.5,.1],bark:"#5A5354",crowns:[[.3,8.6,0,4.6,2.5,r],[2.2,7.7,1,3,1.8,r,st.leaf,2]]}),ohiaKrumm:kn(o,{crowns:[[.6,2.4,.2,5,1.5,"#596537",st.leaf,1,.75]]}),koa:kn(o,{stick:[.2,4,-.3],r0:.6,r1:.45,bark:"#5A504B",limbs:[0,2,4,6].map(c=>{const[l,h]=[t[c],t[c+1]];return[[.2,3.8,-.3],[(l[0]+h[0])/2*.9,(l[1]+h[1])/2-.6,(l[2]+h[2])/2*.9],.3,.14]}),crowns:[0,2,4,6].map((c,l)=>{const[h,u]=[t[c],t[c+1]];return[(h[0]+u[0])/2,(h[1]+u[1])/2+.3,(h[2]+u[2])/2,3,1.55,l===1?"#737B5A":"#5E6A3C",st.leaf,l+1]})}),kukui:kn(o,{stick:[.3,4.2,.1],r0:.45,r1:.35,bark:"#5F5B54",crowns:[[.3,6.5,.1,5.8,3.2,s,st.leaf,1,.62],[.5,8.6,.3,3.4,1.6,a,st.leaf,5,.8],[-2.9,5.6,1.6,2.8,1.9,i,st.leaf,2,.7]]}),ohiaai:kn(o,{stick:[0,2.4,0],r0:.35,r1:.3,bark:"#8A7458",crowns:[[0,6,0,2.4,3.6,"#3A5026"]]}),hau:kn(o,{crowns:[[0,2.2,0,5,2.2,"#6E8A3E"]]}),hala:kn(o,{stick:[.3,3.4,0],r0:.22,r1:.15,bark:"#8E8B82",limbs:[0,2].map(c=>{const[l,h]=e.slice(c,c+2);return[[.3,3.3,0],[(l[0]+h[0])/2,(l[1]+h[1])/2-.45,(l[2]+h[2])/2],.13,.09]}),crowns:e.map((c,l)=>[c[0],c[1]-.35,c[2],1.45,.75,"#55703D",st.leaf,l+1])}),wiliwili:kn(o,{stick:[.1,2.8,.2],r0:.45,r1:.3,bark:"#9C6C44",limbs:n.map(c=>[[.05,2.5,.2],c,.2,.08]),crowns:[[0,3.9,.2,4.8,1.25,"#788C4A",st.leaf,3,.75]]}),lama:kn(o,{stick:[.2,3.2,.1],r0:.25,r1:.18,bark:"#3E3A36",crowns:[[.2,5.4,.1,2.6,2,"#4C5E2E"]]}),aalii:kn(o,{crowns:[[0,1.2,0,1.5,1,"#6F8A4E"]]}),niu:Hx(o),milo:kn(o,{stick:[.2,2.2,0],r0:.35,r1:.28,bark:"#8A8070",crowns:[[.2,4.6,0,3.6,2.4,"#4A6426"]]})}}const Tn=3,Zi=[30,80],$x=o=>Math.max(Zi[0],Math.min(Zi[1],o*2)),zh=24e3;function Xx(o){let t=o>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}class jx{constructor(t,e,n,i){const s=Xx(5150),a=Vx(s);this.group=new Ge,this.rect=e,this.nx=Math.ceil((e.x1-e.x0)/Tn),this.nz=Math.ceil((e.z1-e.z0)/Tn),this.mat=To(n,i,{fade:[Zi[0]-7,Zi[0]]}),this.matDS=To(n,i,{fade:[Zi[0]-7,Zi[0]],doubleSide:!0}),this.species=[];const r=new se,c=new Di,l=new B(0,1,0),h=new B,u=new B;this.total=0,Is.forEach((f,p)=>{const g=t.lists[p],v=g.length/ua,m=new Int32Array(v),d=new Int32Array(this.nx*this.nz);for(let L=0;L<v;L++){const I=Math.min(this.nx-1,Math.max(0,Math.floor((g[L*ua]-e.x0)/Tn))),R=Math.min(this.nz-1,Math.max(0,Math.floor((g[L*ua+1]-e.z0)/Tn)));m[L]=R*this.nx+I,d[m[L]]++}const x=new Int32Array(this.nx*this.nz+1);for(let L=0;L<d.length;L++)x[L+1]=x[L]+d[L];const M=x.slice(),b=new Int32Array(v);for(let L=0;L<v;L++)b[M[m[L]]++]=L;for(let L=0;L<d.length;L++)for(let I=x[L+1]-1;I>x[L];I--){const R=x[L]+Math.floor(s()*(I-x[L]+1)),k=b[I];b[I]=b[R],b[R]=k}const _=new Float32Array(v*16),S=new Float32Array(v*3),E=new Float32Array(v);for(let L=0;L<v;L++){const R=b[L]*ua;c.setFromAxisAngle(l,g[R+3]);const k=Pe*g[R+4];h.set(g[R],ui(g[R+2]),g[R+1]),u.set(k,k,k),r.compose(h,c,u),r.toArray(_,L*16),S[L*3]=g[R+5],S[L*3+1]=g[R+6],S[L*3+2]=g[R+7],E[L]=g[R+8]}const A=Math.min(v,zh),w=xc(a[f]),y=new Uc(w,f==="niu"||f==="hala"?this.matDS:this.mat,Math.max(1,A));y.name=f,y.count=0,y.frustumCulled=!1,y.instanceMatrix.setUsage(wn),y.instanceColor=new Oe(new Float32Array(Math.max(1,A)*3),3),y.instanceColor.setUsage(wn);const T=new Oe(new Float32Array(Math.max(1,A)),1);T.setUsage(wn),w.setAttribute("aClear",T),this.group.add(y),this.species.push({kind:f,mesh:y,aClear:T,start:x,mats:_,cols:S,clear:E,cap:A,n:v}),this.total+=v}),this.frustum=new ki,this.pv=new se,this.box=new bn,this.key="",this.drawn=0}update(t,e,n,i){if(this.group.visible=e>.001,!this.group.visible)return;const s=$x(i),a=s*.42;for(const d of[this.mat,this.matDS])d.uniforms.uFadeNear.value=s*.7,d.uniforms.uFadeFar.value=s;const r=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const c=this.rect,l=[],h=Math.max(0,Math.floor((r.x-s-c.x0)/Tn)),u=Math.min(this.nx-1,Math.floor((r.x+s-c.x0)/Tn)),f=Math.max(0,Math.floor((r.z-s-c.z0)/Tn)),p=Math.min(this.nz-1,Math.floor((r.z+s-c.z0)/Tn));for(let d=f;d<=p;d++)for(let x=h;x<=u;x++){const M=c.x0+x*Tn,b=c.z0+d*Tn;this.box.min.set(M,-.5,b),this.box.max.set(M+Tn,n,b+Tn);const _=this.box.distanceToPoint(r);if(_>s||!this.frustum.intersectsBox(this.box))continue;const S=_<a?1:Math.pow(a/_,1.6);l.push(d*this.nx+x,Math.round(S*20))}const g=l.join(",");if(g===this.key)return;this.key=g;let v=0;for(const d of this.species)for(let x=0;x<l.length;x+=2)v+=Math.ceil((d.start[l[x]+1]-d.start[l[x]])*l[x+1]/20);const m=Math.min(1,zh/Math.max(1,v));this.drawn=0;for(const d of this.species){let x=0;for(let M=0;M<l.length;M+=2){const b=l[M],_=d.start[b],S=d.start[b+1]-_,E=Math.min(Math.ceil(S*l[M+1]*m/20),d.cap-x);E<=0||(d.mesh.instanceMatrix.array.set(d.mats.subarray(_*16,(_+E)*16),x*16),d.mesh.instanceColor.array.set(d.cols.subarray(_*3,(_+E)*3),x*3),d.aClear.array.set(d.clear.subarray(_,_+E),x),x+=E)}d.mesh.count=x,d.mesh.instanceMatrix.needsUpdate=!0,d.mesh.instanceColor.needsUpdate=!0,d.aClear.needsUpdate=!0,d.mesh.visible=x>0,this.drawn+=x}}dispose(){for(const t of this.species)t.mesh.geometry.dispose();this.mat.dispose(),this.matDS.dispose()}}const qx=`
${Ve}
${ln}
${as}
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
`,Yx=`
${Ve}
${Io}
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
`,Kx=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);class Zx{constructor(t,e){this.shared=t,this.camera=e,this.group=new Ge,this.batches=[],this._res=new Vt}add(t,{mode:e="earth",colour:n=[1,1,1],alpha:i=1,minPx:s=1,lift:a=.004,order:r=5,endFade:c=0}={}){const l=[],h=[],u=[];for(const{pts:d,width:x}of t){let M=0;for(let _=0;_+1<d.length;_++)M+=Math.hypot(d[_+1][0]-d[_][0],d[_+1][1]-d[_][1]);let b=0;for(let _=0;_+1<d.length;_++){const[S,E]=d[_],[A,w]=d[_+1],y=Math.hypot(A-S,w-E);if(y<1e-6)continue;const T=Array.isArray(x)?x[_]:x,L=Array.isArray(x)?x[_+1]:x;l.push(S,E,A,w),h.push(T,L,b,b+y),u.push(M),b+=y}}if(!l.length)return null;const f=new Do;f.setAttribute("position",new De(Kx,3)),f.setIndex([0,2,1,1,2,3]),f.setAttribute("aSeg",new Oe(new Float32Array(l),4)),f.setAttribute("aInfo",new Oe(new Float32Array(h),4)),f.setAttribute("aEnd",new Oe(new Float32Array(u),1)),f.instanceCount=l.length/4;const p={...this.shared.uniforms,uCamPos:{value:new B},uPxK:{value:.001},uMinPx:{value:s},uLift:{value:a},uColor:{value:new Ht(...n)},uAlpha:{value:i},uMode:{value:e==="water"?0:e==="earth"?1:2},uEndFade:{value:c}},g=new Ce({vertexShader:qx,fragmentShader:Yx,uniforms:p,transparent:!0,depthWrite:!1,side:Bn,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),v=new ye(f,g);v.frustumCulled=!1,v.renderOrder=r,this.group.add(v);const m={mesh:v,uniforms:p,alpha:i,count:f.instanceCount};return this.batches.push(m),m}update(t){t.getDrawingBufferSize(this._res);const e=this.camera,n=2*Math.tan(e.fov*Math.PI/360)/Math.max(1,this._res.y/t.getPixelRatio());for(const i of this.batches)i.uniforms.uCamPos.value.copy(e.position),i.uniforms.uPxK.value=n,i.mesh.visible=i.uniforms.uAlpha.value>.003}dispose(){for(const t of this.batches)t.mesh.geometry.dispose(),t.mesh.material.dispose()}}const Mc=8,an=16,Jx={walk:[0,4],run:[4,4],idle:[8,2],engage:[10,4],fall:[14,3]},ks=17,Ha=["side","front","back"],Ca=["hawaii","oahu","maui"],Qx=["bare","kihei","chief"],Gc=["spear","club","musket","sling","dagger","rammer","linstock","gun"],Hc={gun:16,sling:16},tM="hHsdetTkKCPmn",eM="gGwWb",da={o:"#2a201b",h:"#30241e",s:"#a5704b",d:"#7b5035",e:"#2a201b",w:"#97734a",W:"#5b3d27",g:"#8a8e93",G:"#4a4d52",b:"#16110e",c:"#cdb98e",f:"#fff4c4",F:"#f2a03c",S:"#ddd6ca",Z:"#b5ad9f"},nM={hawaii:{m:"#b9791f",n:"#8a5717",kihei:"#d9a548",cloak:"#b03a2c",pattern:"#e3b23e",helmet:"#e3b23e",crest:"#b03a2c"},oahu:{m:"#76609e",n:"#544377",kihei:"#a58fcb",cloak:"#dcb03c",pattern:"#2e2824",helmet:"#2e2824",crest:"#dcb03c"},maui:{m:"#a84b22",n:"#7c3518",kihei:"#cf7f4c",cloak:"#a4342a",pattern:"#2e2824",helmet:"#a4342a",crest:"#2e2824"}};function iM(o,t){const e=nM[o],n={...da,m:e.m,n:e.n,t:da.s,T:da.d,k:da.s,K:null,C:null,P:null,H:null};return t==="kihei"?(n.k=e.kihei,n.K=e.kihei):t==="chief"&&(n.t=e.cloak,n.T=e.pattern,n.k=e.cloak,n.K=e.cloak,n.C=e.cloak,n.P=e.pattern,n.h=e.helmet,n.H=e.crest),n}function tn(o,t=0,e=0){const n={};for(const[i,s]of Object.entries(o)){const a=Number(i)+e;a<0||a>=an||(n[a]=t>=0?".".repeat(t)+s:s.slice(-t))}return n}function ci(...o){const t={};for(const e of o)if(e)for(const[n,i]of Object.entries(e)){const s=(t[n]||"").padEnd(i.length,".").split("");for(let a=0;a<i.length;a++)i[a]!=="."&&(s[a]=i[a]);t[n]=s.join("")}return t}const Gi=(o,t=null,e=null)=>({body:o,over:t?[t]:[],under:e?[e]:[]}),Tf={0:"..HHH...",1:"..hhh...",2:"..hse...",3:"..sss...",4:"...d...."},sM=tn(Tf,1),Cf={5:".Kktt...",6:".Kktt...",7:".KktT...",8:".CkTt..."},oM=tn(Cf,1),aM={5:".....s..",6:".....s..",7:".....s.."},rM={5:".....s..",6:".....s.."},cM={5:"....ss..",6:"......s."},lM={5:"....s...",6:"...ss..."},hM={1:"....s...",2:".....s..",3:".....s..",4:"....s..."},Ji={9:".Cmmn..."},uM={...Ji,10:".Cdns...",11:"..d.s...",12:"..d.s...",13:"..d.s...",14:"..ddss.."},fM=[{...Ji,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".d...ss."},{...Ji,10:".C.dn...",11:"...ds...",12:"...ds...",13:"...dss..",14:"...dd..."},{...Ji,10:".Csnd...",11:"..s..d..",12:".s...d..",13:".s...d..",14:".s...dd."},{...Ji,10:".C.sn...",11:"...sd...",12:"...sd...",13:"...sdd..",14:"...ss..."}],uo=tn(Ji,1),dM=[{...uo,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:"d.....s.",14:"......ss"},{...uo,10:"..C.dn..",11:"...dss..",12:"...d..s.",13:"..dd....",14:"........"},{...uo,10:"..Csnd..",11:"..s...d.",12:".s....d.",13:"s.....d.",14:"......dd"},{...uo,10:"..C.sn..",11:"...sdd..",12:"...s..d.",13:"..ss....",14:"........"}],pM={...Ji,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".dd..ss."},mM={...uo,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:".d.....s",14:"dd.....s"},gM={1:"......s.",2:"......s.",3:".....s..",4:".....s.."},vM={9:"..Cmmn..",10:"..Cdns..",11:".dd...s.",12:"d.....s.",13:".....s.."},Fh={side:["........","...hhh..","...hse..",".Kktsss.",".KktTds.",".Cmmdds.","...ddss.","........"],front:["........","..hhhh..","..sees..",".sktTks.",".sddsss.","..mmmm..","..dssd..","........"],back:["........","..hhhh..","..hhhh..",".skkTts.",".sCCCCs.","..mmmm..","..dssd..","........"]};function Nh(o,t){let e=o.map(i=>i.split(""));for(let i=0;i<t;i++)e=e[0].map((s,a)=>e.map(r=>r[a]).reverse());const n={};return e.forEach((i,s)=>n[s+5]=i.join("")),n}const Oh={0:"...HH...",1:"..hhhh..",2:"..hssh..",3:"..ssss..",4:"...dd..."},Bh={5:"..kktt..",6:"..tkkT..",7:"..ttkk..",8:"..tTTt.."},Wh={5:".CC..CC.",6:".CP..PC.",7:".CC..CC.",8:".CC..CC.",9:".C....C.",10:".C....C."},xM={5:".s....s.",6:".s....s.",7:".s....s."},pa={5:"......s.",6:"......s.",7:"......s."},yc={5:".s......",6:".s......"},MM={1:".s......",2:".s......",3:".s......",4:".s......"},yM={5:".s......",6:"..s....."},_M={5:".s....s.",6:"..s..s.."},Qn=(o,t)=>({9:"..mmmm..",10:o,...t}),Va={11:"..sdds..",12:"..sdds..",13:"..s..s..",14:".ss..ss."},Rf=[{11:"..sdds..",12:"..s.ss..",13:"..s.ss..",14:".ss....."},Va,{11:"..sdds..",12:"..ss.s..",13:"..ss.s..",14:".....ss."},Va],Lf=[{11:"..sdds..",12:"..s.ss..",13:"..s.....",14:".ss....."},{11:"..sdds..",12:".s....s.",13:".s....s.",14:"........"},{11:"..sdds..",12:"..ss.s..",13:".....s..",14:".....ss."},{11:"..sdds..",12:".s....s.",13:".s....s.",14:"........"}],Pf={11:"..sdds..",12:".sd..ds.",13:".s....s.",14:"ss....ss"},Df={11:".sd..ds.",12:"s......s",13:"........"},wM=Qn("..smnd..",Va),bM=Rf.map(o=>Qn("..smnd..",o)),SM=Lf.map(o=>Qn("..smnd..",o)),EM=[{5:".s....s.",6:".s.....s"},{5:".s....s.",6:".s....s."},{5:".s....s.",6:"s.....s."},{5:".s....s.",6:".s....s."}],Gh=Qn("..smnd..",Pf),AM=Qn("..smnd..",Df),If={1:"s......s",2:"s......s",3:".s....s.",4:".s....s."},Hh={0:"...HH...",1:"..hhhh..",2:"..hhhh..",3:"..hhhh..",4:"...dd..."},Vh={5:"..tttt..",6:"..tTTt..",7:"..tTTt..",8:"..tttt.."},$h={5:"..kkk...",6:"..kkkk..",7:"...kkk..",8:"....kk.."},Xh={5:".CCCCCC.",6:".CPCCPC.",7:".CCPPCC.",8:".CPCCPC.",9:".CCCCCC.",10:"..CCCC.."},TM={5:".s....s.",6:".s....s.",7:".s....s."},ma={5:".s......",6:".s......",7:".s......"},kf={5:"......s.",6:"......s."},CM={1:"......s.",2:"......s.",3:"......s.",4:"......s."},RM={3:"......s.",4:"......s.",5:"......s."},LM={5:"......s.",6:".......s",7:".......s"},PM={3:".s....s.",4:".s....s.",5:".s....s."},DM=Qn("..dnms..",Va),IM=Rf.map(o=>Qn("..dnms..",o)),kM=Lf.map(o=>Qn("..dnms..",o)),UM=[{5:".s....s.",6:"s.....s."},{5:".s....s.",6:".s....s."},{5:".s....s.",6:".s.....s"},{5:".s....s.",6:".s....s."}],jh=Qn("..dnms..",Pf),zM=Qn("..dnms..",Df),FM=If,NM={side:(o,t,e=!1)=>e?[sM,oM,t,o]:[Tf,Cf,t,o],front:(o,t,e=!1)=>e?[o,tn(Oh,0,1),tn(Bh,0,1),tn(Wh,0,1),tn(t,0,1)]:[o,Oh,Bh,Wh,t],back:(o,t,e=!1)=>e?[o,tn(Hh,0,1),tn(Vh,0,1),tn($h,0,1),tn(Xh,0,1),tn(t,0,1)]:[o,Hh,Vh,$h,Xh,t]},OM={side:{stand:uM,walk:fM,run:dM,brace:pM,lunge:mM,leap:vM,flung:gM},front:{stand:wM,walk:bM,run:SM,brace:Gh,lunge:Gh,leap:AM,flung:If},back:{stand:DM,walk:IM,run:kM,brace:jh,lunge:jh,leap:zM,flung:FM}},BM={side:{down:aM,grip:rM,out:cM,back:lM,up:hM,free:null,pump:null},front:{down:xM,grip:ci(pa,yc),out:ci(pa,yM),back:ci(pa,yc),up:ci(pa,MM),both:_M,pump:EM},back:{down:TM,grip:ci(ma,kf),out:ci(ma,RM),back:ci(ma,LM),up:ci(ma,CM),both:PM,pump:UM}};function WM(o,t){const e=NM[o],n=OM[o],i=BM[o],s=t[o],a=[],r=o==="side";for(let c=0;c<4;c++)a.push(Gi(e(n.walk[c],i[s.walk.arm]||i.down),s.walk.over,s.walk.under));for(let c=0;c<4;c++){const l=r?tn(i[s.run.arm]||i.down,1):ci(i.pump[c],s.run.arm==="grip"?o==="front"?yc:kf:null);a.push(Gi(e(n.run[c],l,r),s.run.over,s.run.under))}for(const c of s.idle)a.push(Gi(e(n.stand,i[c.arm]||i.down),c.over,c.under));for(const[c,l,h,u]of s.engage)a.push(Gi(e(n[l],i[c]||i.down,l==="lunge"),h,u));return a.push(Gi(e(n.leap,n.flung,r),s.leap||null)),a.push(Gi([Nh(Fh[o],1)])),a.push(Gi([Nh(Fh[o],2)])),a}const xn=(o,t,e=6)=>{const n={};for(let i=o;i<=t;i++)n[i]=".".repeat(e)+"w";return n[o]=".".repeat(e)+"W",n},GM={side:{walk:{arm:"down",over:xn(0,10)},run:{arm:"down",over:{8:"wwwwwwwW"}},idle:[{arm:"down",over:xn(0,14)},{arm:"grip",over:{...xn(1,14),0:".......W",1:"......w."}}],engage:[["back","brace",{6:"wwwwW..."}],["out","lunge",{6:"..wwwwwW"}],["grip","brace",{1:".......W",2:"......w.",3:"......w.",4:".....w..",5:".....w..",6:"....w...",7:"....w..."}],["grip","brace",{1:".......W",2:"......w.",3:"......w.",4:".....w..",5:".....w..",6:"....w...",7:"....w..."}]],leap:{0:".......W",1:"......w.",2:".....w..",3:"....w..."}},front:{walk:{arm:"grip",over:xn(0,11,0)},run:{arm:"grip",over:{7:"..w.....",8:"..W....."}},idle:[{arm:"grip",over:xn(0,14,0)},{arm:"down",over:{...xn(1,14,0),0:".W......"}}],engage:[["up","brace",{0:"....w...",1:"...w....",2:"..w.....",3:".w......",4:"W......."}],["out","lunge",{7:"..w.....",8:".WW.....",9:"..W....."}],["grip","brace",xn(0,12,0)],["grip","brace",xn(0,12,0)]],leap:{0:"W.......",1:"w.......",2:".w......"}},back:{walk:{arm:"grip",over:xn(0,11,7)},run:{arm:"grip",over:{2:".......W",3:".......w",4:"......w.",5:"......w."}},idle:[{arm:"grip",over:xn(0,14,7)},{arm:"down",over:{...xn(1,14,7),0:"......W."}}],engage:[["back","brace",{2:".......W",3:".......w",4:".......w",5:"......w.",6:"......w.",7:"......w.",8:".....w..",9:".....w.."}],["out","lunge",{0:"......W.",1:"......w.",2:"......w."}],["grip","brace",xn(0,12,7)],["grip","brace",xn(0,12,7)]],leap:{0:".......W",1:".......w",2:"......w."}}},HM={side:{walk:{arm:"grip",over:{5:"WWwwww.."}},run:{arm:"grip",over:{1:"......WW",2:"......WW",3:"......w.",4:"......w.",5:"......w."}},idle:[{arm:"down",over:{7:"......w.",8:"......w.",9:"......WW",10:"......WW"}},{arm:"down",over:{7:"......w.",8:"......w.",9:".....WW.",10:".....WW."}}],engage:[["up","brace",null,{0:"WWwww...",1:"WW......"}],["out","lunge",{6:".......w",7:"......WW",8:"......WW"}],["down","brace",{8:"......w.",9:"......w.",10:".....WW.",11:".....WW."}],["down","brace",{8:"......w.",9:"......w.",10:".....WW.",11:".....WW."}]],leap:{0:"......WW",1:"......WW"}},front:{walk:{arm:"grip",over:{3:"WW......",4:"Ww......"}},run:{arm:"grip",over:{1:".WW.....",2:".WW.....",3:".w......",4:".w......"}},idle:[{arm:"down",over:{8:".w......",9:".w......",10:"WW......",11:"WW......"}},{arm:"down",over:{8:".w......",9:"w.......",10:"WW......",11:"W......."}}],engage:[["up","brace",null,{0:"..wwWW..",1:"....WW.."}],["out","lunge",{6:"..WW....",7:"..WW...."}],["down","brace",{8:".w......",9:".w......",10:"WW......",11:"WW......"}],["down","brace",{8:".w......",9:".w......",10:"WW......",11:"WW......"}]],leap:{0:"WW......",1:"WW......"}},back:{walk:{arm:"grip",over:{3:"......WW",4:"......wW"}},run:{arm:"grip",over:{1:".....WW.",2:".....WW.",3:"......w.",4:"......w."}},idle:[{arm:"down",over:{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}},{arm:"down",over:{8:"......w.",9:".......w",10:"......WW",11:".......W"}}],engage:[["up","brace",{0:"..WWww..",1:"..WW...."}],["out","lunge",{1:"......W.",2:"......W."}],["down","brace",{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}],["down","brace",{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}]],leap:{0:"......WW",1:"......WW"}}},Gn=(o,t=6)=>{const e={},n=".".repeat(t);for(let i=o;i<o+6;i++)e[i]=n+"G";e[o]=n+"g";for(let i=o+6;i<=14;i++)e[i]=n+"W";return e},VM={side:{walk:{arm:"grip",over:{6:".....W..",7:".....WW."},under:{0:".g......",1:".G......",2:".G......",3:"..G.....",4:"..G.....",5:"...G....",6:"....G..."}},run:{arm:"grip",over:{1:".......g",2:"......G.",3:"......G.",4:".....G..",5:".....W..",6:"....W...",7:"...W...."}},idle:[{arm:"grip",over:Gn(3)},{arm:"down",over:Gn(3)}],engage:[["out","brace",{4:"..WWGGGg"}],["out","brace",{3:".......F",4:".WWGGGgf",5:".......F"}],["grip","brace",{0:"......SS",1:".....SSZ",2:"......Z.",5:".....W..",6:"......G.",7:"......G."},{2:".......g"}],["grip","brace",{0:".....SS.",1:"....SZ..",5:".....W..",6:"......G.",7:"......G."},{2:".......g"}]],leap:{0:"......g.",1:"......G.",2:".....W.."}},front:{walk:{arm:"grip",over:{6:".W......"},under:{0:"g.......",1:"G.......",2:"G.......",3:".G......",4:".G......",5:".G......"}},run:{arm:"grip",over:{4:"......g.",5:".....G..",6:"....G...",7:"...W....",8:"..W....."}},idle:[{arm:"grip",over:Gn(3,0)},{arm:"down",over:Gn(3,0)}],engage:[["both","brace",{3:".gg.....",4:".gb.....",5:"..W....."}],["both","brace",{1:".F......",2:"FfF.....",3:"fffF....",4:"FfF.....",5:".F......"}],["grip","brace",{0:".SSZ....",1:"SZSS....",2:".SZ....."},Gn(5,0)],["grip","brace",{0:"SZ......",1:".S......"},Gn(5,0)]],leap:{0:"g.......",1:"G.......",2:".W......"}},back:{walk:{arm:"grip",over:{6:"......W."},under:{0:".......g",1:".......G",2:".......G",3:"......G.",4:"......G.",5:"......G."}},run:{arm:"grip",over:{4:".g......",5:"..G.....",6:"...G....",7:"....W...",8:".....W.."}},idle:[{arm:"grip",over:Gn(3,7)},{arm:"down",over:Gn(3,7)}],engage:[["both","brace",{1:"......g.",2:"......G.",3:"......G.",4:"......W."}],["both","brace",{0:".....FfF",1:"......f.",2:"......G.",3:"......G.",4:"......W."}],["grip","brace",{0:"....SSZ.",1:".....ZSS",2:"......S."},Gn(5,7)],["grip","brace",{0:".....ZS.",1:"......S."},Gn(5,7)]],leap:{0:".......g",1:".......G",2:"......W."}}},$M={side:{walk:{arm:"down",over:{8:".........c",9:".........c",10:".........cg"}},run:{arm:"down",over:{8:".......cc.",9:"......g..."}},idle:[{arm:"down",over:{8:".........c",9:".........c",10:".........cg"}},{arm:"down",over:{8:".........c",9:"..........c",10:"..........cg"}}],engage:[["up","brace",null,{0:".....gccc"}],["up","brace",{0:"........ccg"}],["out","lunge",{4:".............g",5:"...........c"}],["out","brace",{3:"...............g",6:"..........c",7:"..........c"}]],leap:{0:"..........c",1:"..........c"}},front:{walk:{arm:"grip",over:{7:".....c",8:".....c",9:"....gc"}},run:{arm:"grip",over:{7:"....c.",8:"...cg."}},idle:[{arm:"down",over:{8:".....c",9:".....c",10:"....gc"}},{arm:"down",over:{8:".....c",9:"....c.",10:"...gc."}}],engage:[["up","brace",null,{0:"..gccc"}],["up","brace",{0:".....ccccg"}],["out","lunge",{8:"...g",7:"....c"}],["out","brace",{11:".g",8:".....c"}]],leap:{0:".....c",1:".....c"}},back:{walk:{arm:"grip",over:{7:"..........c",8:"..........c",9:"..........cg"}},run:{arm:"grip",over:{7:"...........c",8:"...........gc"}},idle:[{arm:"down",over:{8:"..........c",9:"..........c",10:"..........cg"}},{arm:"down",over:{8:"..........c",9:"...........c",10:"...........cg"}}],engage:[["up","brace",{0:".....gcccc"}],["up","brace",null,{0:"..........cccg"}],["out","lunge",{1:"............g",2:"...........c"}],["out","brace",{0:"..............g",4:"...........c"}]],leap:{0:"..........c",1:"..........c"}}},XM={side:{walk:{arm:"down",over:{8:".....W..",9:".....g.."}},run:{arm:"grip",over:{6:"......Wg"}},idle:[{arm:"down",over:{8:".....W..",9:".....g.."}},{arm:"grip",over:{4:"......g.",5:"......W."}}],engage:[["up","brace",{0:"....Wg.."}],["out","lunge",{6:".......W",7:".......g"}],["grip","brace",{4:"......g.",5:"......W."}],["grip","brace",{4:"......g.",5:"......W."}]],leap:null},front:{walk:{arm:"down",over:{8:".W......",9:".g......"}},run:{arm:"grip",over:{6:"..g....."}},idle:[{arm:"down",over:{8:".W......",9:".g......"}},{arm:"grip",over:{4:".g......",5:".W......"}}],engage:[["up","brace",{0:".g......"}],["out","lunge",{7:"..W.....",8:"..gg...."}],["grip","brace",{4:".g......",5:".W......"}],["grip","brace",{4:".g......",5:".W......"}]],leap:null},back:{walk:{arm:"down",over:{8:"......W.",9:"......g."}},run:{arm:"grip",over:{4:"......g."}},idle:[{arm:"down",over:{8:"......W.",9:"......g."}},{arm:"grip",over:{3:"......g.",4:"......W."}}],engage:[["up","brace",{0:"......g."}],["out","lunge",{1:"......g.",2:"......W."}],["grip","brace",{3:"......g.",4:"......W."}],["grip","brace",{3:"......g.",4:"......W."}]],leap:null}},Mn=(o,t,e=6)=>{const n={};for(let i=o;i<=t;i++)n[i]=".".repeat(e)+"w";return n[o]=".".repeat(Math.max(0,e-1))+(e>0?"WW":"W"),n},jM={side:{walk:{arm:"down",over:Mn(0,10)},run:{arm:"down",over:{7:"wwwwwwWW"}},idle:[{arm:"down",over:Mn(0,14)},{arm:"grip",over:Mn(1,14)}],engage:[["out","brace",{6:"..wwwwWW"}],["out","lunge",{6:"...wwwwW"}],["back","brace",{6:"wwwwwW.."}],["back","brace",{6:"wwwwwW.."}]]},front:{walk:{arm:"grip",over:Mn(0,11,0)},run:{arm:"grip",over:{6:"WWwwww.."}},idle:[{arm:"grip",over:Mn(0,14,0)},{arm:"down",over:Mn(1,14,0)}],engage:[["both","brace",{5:"WW......",6:".wwww..."}],["both","lunge",{7:"Wwwww..."}],["grip","brace",Mn(0,12,0)],["grip","brace",Mn(0,12,0)]]},back:{walk:{arm:"grip",over:Mn(0,11,7)},run:{arm:"grip",over:{6:"..wwwwWW"}},idle:[{arm:"grip",over:Mn(0,14,7)},{arm:"down",over:Mn(1,14,7)}],engage:[["both","brace",{2:"......WW",3:"......w.",4:"......w.",5:".....w..",6:".....w.."}],["both","lunge",{0:"......WW",1:"......w.",2:"......w.",3:".....w.."}],["grip","brace",Mn(0,12,7)],["grip","brace",Mn(0,12,7)]]}},Ke=(o,t,e=6)=>{const n={};for(let i=o;i<=t;i++)n[i]=".".repeat(e)+"w";return n[o]=".".repeat(e)+"F",n},qM={side:{walk:{arm:"down",over:Ke(0,10)},run:{arm:"down",over:{4:".......F",5:"......w.",6:".....w..",7:"....w...",8:"...w...."}},idle:[{arm:"down",over:Ke(0,14)},{arm:"down",over:{...Ke(1,14),0:"......f."}}],engage:[["out","brace",{7:"......w.",8:"......w.",9:".......w",10:".......F"}],["out","lunge",{7:".......w",8:".......w",9:".......w",10:".......w",11:".......f"}],["grip","brace",Ke(0,9)],["grip","brace",Ke(0,9)]]},front:{walk:{arm:"grip",over:Ke(0,11,0)},run:{arm:"grip",over:{3:"F.......",4:".w......",5:"..w....."}},idle:[{arm:"grip",over:Ke(0,14,0)},{arm:"down",over:{...Ke(1,14,0),0:"f......."}}],engage:[["grip","brace",{6:".w......",7:"w.......",8:"F......."}],["out","lunge",{7:".w......",8:"w.......",9:"f......."}],["grip","brace",Ke(0,9,0)],["grip","brace",Ke(0,9,0)]]},back:{walk:{arm:"grip",over:Ke(0,11,7)},run:{arm:"grip",over:{3:".......F",4:"......w.",5:".....w.."}},idle:[{arm:"grip",over:Ke(0,14,7)},{arm:"down",over:{...Ke(1,14,7),0:".......f"}}],engage:[["grip","brace",{4:".......F",5:"......w.",6:"......w."}],["out","lunge",{3:".......f",4:"......w.",5:"......w."}],["grip","brace",Ke(0,9,7)],["grip","brace",Ke(0,9,7)]]}},Cs={9:"....gggggggggg..",10:"..GGGGWWWGGGGG..",11:"...WWW.w.W...G..",12:"..WW.WwwwW......",13:".WW..W.w.W......",14:"WW....WWW......."},YM={...Cs,11:"...WWWw.wW...G..",12:"..WW.W.w.W......",13:".WW..Ww.wW......"},ro={8:"..ww..gggg..ww..",9:"..WW..gbbg..WW..",10:"..WW.WgbbgW.WW..",11:"..WWWWWggWWWWW..",12:"..WW..W..W..WW..",13:"..ww........ww.."},co={8:"..ww...gg...ww..",9:"..WW..GggG..WW..",10:"..WW.WGGGGW.WW..",11:"..WWWWWWWWWWWW..",12:"..WW...WW...WW..",13:"..ww...WW...ww..",14:".......WW......."},Ze=(o,t=null,e=0,n=0)=>({body:[tn(o,e,n)],over:t?[t]:[],under:[]}),Uf={side:[...[0,1,0,1,0,1,0,1,0,0].map(o=>Ze(o?YM:Cs)),Ze(Cs,{8:"..............F.",9:"..............fF",10:"..............ff",11:"..............F."}),Ze(Cs,{6:"............SS..",7:"...........SSSS.",8:"..........SSSZS.",9:"...........ZSS..",10:"............Z..."},-1),Ze(Cs,{3:"...........SS...",4:"..........SZSS..",5:"...........ZS..."}),Ze(Cs,{2:"............S..."})],front:[...[0,0,0,0,0,0,0,0,0,0].map(()=>Ze(ro)),Ze(ro,{5:".......FF.......",6:".....FfffF......",7:"....FfffffF.....",8:"...FfffffffF....",9:"....FfffffF.....",10:".....FfffF......",11:".......FF......."}),Ze(ro,{4:"......SSZ.......",5:"....SSSSSS......",6:"...SZSSSSZS.....",7:"....SSZSS.......",8:"......S........."},0,-1),Ze(ro,{1:".......SS.......",2:".....SZSSS......",3:"......ZS........"}),Ze(ro,{0:"......S........."})],back:[...[0,0,0,0,0,0,0,0,0,0].map(()=>Ze(co)),Ze(co,{4:".......FF.......",5:"......FffF......",6:".......ff.......",7:".......FF......."}),Ze(co,{3:"......SSZ.......",4:".....SZSSS......",5:"......SSZ......."},0,1),Ze(co,{0:"......SS........",1:".....SZSS.......",2:"......Z........."}),Ze(co,{0:".......S........"})]};for(const o of Ha)Uf[o].push(...[0,1,2].map(()=>({body:[],over:[],under:[]})));const KM={spear:GM,club:HM,musket:VM,sling:$M,dagger:XM,rammer:jM,linstock:qM},Ra={};for(const o of Gc){Ra[o]={};for(const t of Ha)if(o==="gun")Ra.gun[t]=Uf[t];else{const e=WM(t,KM[o]);Ra[o][t]=Hc[o]?e.map(n=>({body:n.body.map(i=>tn(i,4)),over:n.over,under:n.under})):e}}function ZM(){const o=[];for(const t of Ca){for(const e of["bare","kihei"])for(const n of["spear","club","musket","sling","dagger"])o.push({kind:n,side:t,dress:e});for(const e of["spear","club"])o.push({kind:e,side:t,dress:"chief"})}return o.push({kind:"rammer",side:"hawaii",dress:"bare"},{kind:"linstock",side:"hawaii",dress:"kihei"},{kind:"gun",side:"hawaii",dress:"bare"}),o}const JM=200,QM=o=>[parseInt(o.slice(1,3),16),parseInt(o.slice(3,5),16),parseInt(o.slice(5,7),16)];function Gr(o,t,e){const n=Array.from({length:an},()=>new Array(t).fill("."));for(const i of o)for(const[s,a]of Object.entries(i)){const r=Number(s);if(!(r<0||r>=an))for(let c=0;c<Math.min(t,a.length);c++){const l=a[c];l!=="."&&e[l]&&(n[r][c]=l)}}return n}function ty(o,t,e,n){const i=Gr(o.body,t,e),s=Gr(o.over,t,e),a=Gr(o.under,t,e),r=(h,u)=>u>=0&&u<an&&h>=0&&h<t&&n.includes(i[u][h]),c=new Uint8Array(t*an*4),l=(h,u,f)=>{if(f===".")return;const p=e[f];p&&c.set([...QM(p),f==="f"||f==="F"?JM:255],(u*t+h)*4)};for(let h=0;h<an;h++)for(let u=0;u<t;u++)l(u,h,a[h][u]),!r(u,h)&&(r(u-1,h)||r(u+1,h)||r(u,h-1)||r(u,h+1))&&l(u,h,"o"),l(u,h,i[h][u]),l(u,h,s[h][u]);return c}function ey(){const o=ZM(),t=Ha.length*ks*16,e=o.length*an,n=new Uint8Array(t*e*4),i=new Map;o.forEach((r,c)=>{const l=Hc[r.kind]||Mc;r.w=l;const h=iM(r.side,r.dress),u=r.kind==="gun"?eM:tM;Ha.forEach((f,p)=>{Ra[r.kind][f].forEach((g,v)=>{const m=ty(g,l,h,u),d=(p*ks+v)*l;for(let x=0;x<an;x++)n.set(m.subarray(x*l*4,(x+1)*l*4),((c*an+x)*t+d)*4)})}),i.set(`${r.kind}/${r.side}/${r.dress}`,{y:c*an,w:l})});const s=(r,c,l)=>i.get(`${r}/${c}/${l}`)||i.get(`${r}/${c}/bare`)||i.get(`${r}/hawaii/bare`)||i.get(`${r}/hawaii/kihei`);return{width:t,height:e,data:n,rows:o,facingW:ks,cell:(r,c,l,h,u,f=0)=>{const p=s(r,c,l),[g,v]=Jx[h];return[(f*ks+g+u%v)*p.w,p.y,p.w,an]},at:s,has:(r,c,l)=>i.has(`${r}/${c}/${l}`)}}const zf=`
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
`,Ff=`
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
`,ny=`
${Ve}
${ln}
${qs}
${zf}
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
`,iy=`
${Ve}
${Ff}
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
`,sy=`
${Ve}
${ln}
${zf}
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
`,oy=`
${Ve}
${Ff}
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
`,ay=2400,yn={file:0,knot:1,pacer:2,rank:3,duel:4,piece:5,crew:6,ring:7,leap:8},lo=Object.fromEntries(Gc.map((o,t)=>[o,t])),ho=0,qh=4,ga=8,va=10,ry=14,Re={right:0,left:1,front:2,back:3},Yh=[0,0,1,2],Kh=1.25,cy=9,ly=20,Zh=.35,hy=["march","run","stand","engage","surround","leap"],Hr=["spear","club","sling","dagger","musket"],uy=["spear","club","dagger"],Un={run:.6,least:18,across:9,up:13,pull:70,fade:10,air:1.6,gap:1.1},Hn={up:20,down:30,dirs:72,step:.05,far:8,clear:.1},$a=(8/85)**1.5;function fy(o){return 1+3*((8/Math.max(o,.5))**1.5-$a)/(1-$a)}function dy(o){return 8/($a+(o-1)*(1-$a)/3)**(2/3)}function py(o,t){return Math.max(2,Math.min(4*t,fy(o)*t))}const Xn=.3,Us=.2,Jh=2;class my{constructor(){this.L=NaN,this.s=NaN,this.k=2,this.t=0}step(t,e,n,i){Number.isFinite(this.L)||(this.L=Math.round(t));const s=Math.abs(t-this.s)>1e-4;this.s=t;let a=Math.max(t-Us,Math.min(t+Us,this.L));const r=Math.floor(a),c=a-r;(!s||e===0)&&c>.5-Xn/2&&c<.5+Xn/2&&(a=r+(c<.5?.5-Xn/2:.5+Xn/2)),e===0?this.L=a:this.L+=Math.max(-Jh*e,Math.min(Jh*e,a-this.L)),this.L=Math.max(n,Math.min(i,this.L));const l=Math.floor(this.L+1e-9);this.k=l;const h=l>=i?0:(this.L-l-(.5-Xn/2))/Xn;return this.t=h<1e-6?0:h>1-1e-6?1:h,this}}function gy(o){const t=[];for(let e=2;e<4*o;e++){const n=i=>+dy(i/o).toFixed(2);t.push({k:e,in:[n(e+.5-Xn/2+Us),n(e+.5+Xn/2+Us)],out:[n(e+.5+Xn/2-Us),n(e+.5-Xn/2-Us)]})}return t}function vy(o,t,e){const n=o.length;let i=Math.atan2(e,t)/(2*Math.PI);i<0&&(i+=1);const s=Math.floor(i*n)%n;return Math.min(o[s],o[(s+1)%n])}function xy(o){let t=o>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const My=/\bretreat|\bpursu|\bfalls? back|\bescap|\bflee(s|ing)?\b|\brout(ed|s)?\b|\bgot away|\bover the ridge|\bold path/i,yy=/\bposts?\b|ashore|encamp|in order/i;function _y(o){const t=`${o.name||""} ${o.note||""}`;return My.test(t)?"run":yy.test(`${o.name||""}`)||/putting itself in order|encamped|organising/i.test(o.note||"")?"stand":"walk"}function wy(o){const t=o.p.behaviour;if(hy.includes(t))return t;if(o.line)return"engage";const e=_y(o.p);return e==="walk"?"march":e}function Le(o,t,e){const n=o.cum,i=o.pts;let s=1;for(;s<n.length-1&&n[s]<t;)s++;const a=i[s-1],r=i[s],c=n[s]-n[s-1]||1,l=Math.max(0,Math.min(1,(t-n[s-1])/c));return e[2]=(r[0]-a[0])/c,e[3]=(r[1]-a[1])/c,e[0]=a[0]+(r[0]-a[0])*l,e[1]=a[1]+(r[1]-a[1])*l,e}const Qh=o=>o.p.stop===null||o.p.stop===void 0?null:[o.p.stop].flat(),xa=(o,t)=>{const e=Qh(o),n=Qh(t);return!e||!n||e.some(i=>n.includes(i))};function by(o,t,e){const n=t.reduce((c,l)=>c+Math.max(0,o[l]||0),0)||1,i=t.map(c=>Math.max(0,o[c]||0)/n*e),s=i.map(Math.floor);let a=e-s.reduce((c,l)=>c+l,0);const r=i.map((c,l)=>[c-Math.floor(c),l]).sort((c,l)=>l[0]-c[0]);for(let c=0;a>0;c++,a--)s[r[c%r.length][1]]++;return Object.fromEntries(t.map((c,l)=>[c,s[l]]))}class fo{constructor(t,e,n,i=null){this.app=t,this.recs=e,this.ground=i,this.sheet=ey();const s=xy(1795),a=e.map(()=>[]);this.fronts=[],this.pairs=[],this.guns=[];for(const E of e)E.behaviour=wy(E),E.arms=E.p.arms&&typeof E.p.arms=="object"?E.p.arms:null,E.enemy=this.enemyOf(E,e);const r=e.filter(E=>E.line),c=new Set;for(const E of r)for(const A of r){if(E===A||c.has(E)||c.has(A)||E.event!==A.event||E.side===A.side||JSON.stringify(E.p.stop??E.step)!==JSON.stringify(A.p.stop??A.step))continue;const[w,y]=this.mid(E),[T,L]=this.mid(A);if(Math.hypot(w-T,y-L)>4)continue;const[I,R]=E.side==="oahu"?[A,E]:[E,A];c.add(I),c.add(R),this.planFront(I,R,a,e,s)}for(const E of e){if(E.line||E.behaviour!=="run")continue;const A=this.heading(E);let w=null,y=5;for(const T of e){if(T===E||T.line||T.behaviour!=="run"||T.event!==E.event||T.side===E.side||!xa(T,E)||T.chase)continue;const L=this.heading(T);if(A[0]*L[0]+A[1]*L[1]<.9)continue;const I=Math.hypot(E.pts[0][0]-T.pts[0][0],E.pts[0][1]-T.pts[0][1]);(T.pts[0][0]-E.pts[0][0])*A[0]+(T.pts[0][1]-E.pts[0][1])*A[1]<0||I<y&&(y=I,w=T)}w&&E.side!=="oahu"&&(E.chase=w)}const l=e.map((E,A)=>A).sort((E,A)=>(e[E].chase?1:0)-(e[A].chase?1:0));for(const E of l){const A=e[E];A.line&&!c.has(A)?this.planRanks(A,null,a[E],s):A.line||this.planForce(A,a[E],s,e)}e.forEach((E,A)=>this.armOut(E,a[A],s));const h=a.reduce((E,A)=>E+A.length,0);this.count=h;const u=Math.max(1,h),f=()=>new Float32Array(u),p=()=>new Uint8Array(u),g=()=>new Int8Array(u);this.f={rec:new Uint16Array(u),mode:p(),kind:p(),side:p(),dress:p(),row:f(),cw:f(),s:f(),s0:f(),lat:f(),spd:f(),thr:f(),inAt:f(),outAt:f(),far:f(),ph:f(),tm:f(),tt:f(),st:p(),off:f(),offTo:f(),face:p(),hand:p(),mirror:g(),grp:new Int16Array(u),role:p(),row2:p(),vis:f(),gm:f(),gx:f(),gz:f(),x:f(),z:f(),hx:f(),hz:f(),lift:f(),air:p(),k:f(),tint:f(),wet:p(),fr:p(),dx:g(),dy:g(),dx0:g(),dy0:g()};const v=this.f;let m=0;e.forEach((E,A)=>{E.o=m,E.n=a[A].length;for(const w of a[A]){const y=m++;v.rec[y]=A,v.mode[y]=yn[w.mode],v.kind[y]=lo[w.kind],v.side[y]=Ca.indexOf(w.side),v.dress[y]=Qx.indexOf(w.dress);const T=this.sheet.at(w.kind,w.side,w.dress);v.row[y]=T.y,v.cw[y]=T.w,v.s[y]=v.s0[y]=w.s??0,v.lat[y]=w.lat??0,v.spd[y]=w.spd??1,v.thr[y]=w.thr??s(),v.inAt[y]=w.inAt??-1e9,v.outAt[y]=w.outAt??1e9,v.far[y]=85+s()*25,v.ph[y]=w.ph??s(),v.tm[y]=w.tm??1+s()*6,v.face[y]=Re.right,v.hand[y]=s()<.12?1:0,v.grp[y]=w.grp??-1,v.dx0[y]=w.dx??0,v.dy0[y]=w.dy??0,v.role[y]=w.role??0,v.row2[y]=w.row2??0,v.tint[y]=.9+s()*.18,v.gx[y]=1e9}}),this.marks=new Float32Array(u*4),this.jump=new Float32Array(u*3);const d=new Ye(this.sheet.data,this.sheet.width,this.sheet.height,Ae,de);d.minFilter=d.magFilter=ie,d.generateMipmaps=!1,d.needsUpdate=!0,this.texture=d;const x=Math.max(1,Math.min(h,ay));this.cap=x;const M=x*2;this.capI=M;const b=new Do;b.setAttribute("position",new De(new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),3)),b.setIndex([0,1,2,0,2,3]);const _=E=>{const A=new Oe(new Float32Array(M*4),4);return A.setUsage(wn),b.setAttribute(E,A),A};this.aFoot=_("aFoot"),this.aCell=_("aCell"),this.aDraw=_("aDraw"),this.aMix=_("aMix"),this.attrs=[this.aFoot,this.aCell,this.aDraw,this.aMix],b.instanceCount=0,this.geometry=b,this.range={start:0,count:0},this.own={uSheet:{value:d},uViewport:{value:new Vt(1,1)},uPxW:{value:.001},uFigS:{value:null},uHasS:{value:0}};const S={...n.uniforms,...this.own};this.material=new Ce({vertexShader:ny,fragmentShader:iy,uniforms:S,transparent:!0,blending:vi,depthWrite:!0}),this.shadowMaterial=new Ce({vertexShader:sy,fragmentShader:oy,uniforms:S,transparent:!0,depthWrite:!1,blending:oc}),this.mesh=new ye(b,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=8,this.shadows=new ye(b,this.shadowMaterial),this.shadows.frustumCulled=!1,this.shadows.renderOrder=7,this.group=new Ge,this.group.add(this.shadows,this.mesh),this.time=0,this.frame=0,this.thin=1,this.drawn=0,this.instances=0,this.scale=new my,this.unit=.03,this.view={rx:1,rz:0,ax:0,az:-1,sinP:.5},this._p=[0,0,0,0],this._v4=new ee,this._size=new Vt}enemyOf(t,e){for(const n of[!0,!1]){let i=0,s=0,a=0;for(const r of e)if(!(r.event!==t.event||r.side===t.side||n&&!xa(r,t)))for(const[c,l]of r.pts)i+=c,s+=l,a++;if(a)return[i/a,s/a]}return null}mid(t){return Le(t,t.total/2,[0,0,0,0])}heading(t){const e=t.pts[0],n=t.pts.at(-1),i=Math.hypot(n[0]-e[0],n[1]-e[1])||1;return[(n[0]-e[0])/i,(n[1]-e[1])/i]}cannonOf(t){if(t.arms)return Math.max(0,Math.round(t.arms.cannon||0));const e=Number.isFinite(t.p.from)?t.p.from:1795;return t.line&&t.side==="hawaii"&&e>=1790?Math.max(1,Math.min(3,Math.round(t.total/2.5))):0}sharesOf(t){if(t.arms)return t.arms;const n=(Number.isFinite(t.p.from)?t.p.from:1795)<1790?0:t.side==="hawaii"?.14:.06;return{spear:.7-n,club:.3,musket:n}}planForce(t,e,n,i){if(t.total<.05)return;t.file=/path/i.test(t.p.name||"")&&t.total<12;const a=t.behaviour;a==="stand"||a==="engage"?this.planStand(t,e,n):a==="surround"?this.planSurround(t,e,n,i):a==="leap"?this.planLeap(t,e,n,i):this.planFiles(t,e,n)}planFiles(t,e,n,{n:i=0,from:s=0,to:a=t.total,at:r=1}={}){var x;const c=Math.max(.05,a-s),l=t.behaviour==="run"||t.behaviour==="surround",h=t.file,f=i||Math.max(12,Math.min(300,Math.round(c*(h?2.5:l?4:5)))),p=h?1:3,g=h?.03:t.side==="hawaii"?.32:.26;let v;if((x=t.chase)!=null&&x.knots){const M=c/Math.max(.05,t.chase.total);v=t.chase.knots.map(b=>({u:b.u,sp:b.sp*M}))}else v=Array.from({length:Math.max(3,Math.min(9,Math.round(f/14)))},()=>({u:n(),sp:l?.85+n()*.3:.88+n()*.24}));t.knots=v;const m=Math.min(c*.15,4),d=t.behaviour==="march"?this.cannonOf(t):0;for(let M=0;M<d;M++){const b=v[M%v.length],_=this.guns.push({r:t,kind:"haul",front:-1,s:s+(b.u+.03)%1*c,spd:b.sp,lat:0,inAt:s+n()*m*.6,outAt:a-m*.2-n()*m,x:0,z:0,ax:1,az:0,period:8,phase:0,on:!1})-1;this.crewOut(e,t,_,n()*.3)}for(let M=0;M<f;M++){const b=v[M%v.length];let _=(b.u+(n()-.5)*(n()<.75?.05:.22))%1;_<0&&(_+=1);const S=Math.floor(n()*p);e.push({mode:"file",s:s+_*c,lat:p>1?((S-(p-1)/2)*.7+(n()-.5)*.5)*g:(n()-.5)*g,spd:b.sp*(.97+n()*.06),inAt:s+n()*m*.6,outAt:a-(a<t.total?0:m*.2)-n()*m*r})}}planStand(t,e,n){const i=t.total,s=i<2,a=Math.max(3,Math.min(12,Math.round(i/2.4)));if(t.enemy){const l=this.mid(t);t.pressed=Math.hypot(t.enemy[0]-l[0],t.enemy[1]-l[1])<6}for(let l=0;l<a;l++){const h=Math.max(0,Math.min(i,(l+.5)/a*i+(n()-.5)*(i/a)*.4)),u=s?4+Math.floor(n()*3):6+Math.floor(n()*9),f=s?4:5;for(let p=0;p<u;p++){const g=Math.round((p-(u-1)/2)*f+(n()-.5)*3);e.push({mode:"knot",s:h,lat:(n()-.5)*.12,dx:g,dy:Math.round((n()-.5)*3),tm:1+n()*6})}if(!s||l===1)for(let p=0;p<2;p++)e.push({mode:"pacer",s:h+(n()-.5)*.8,lat:(n()-.5)*.4,spd:.4+n()*.3,noChief:!0})}const r=this.cannonOf(t),c=[0,0,0,0];for(let l=0;l<r;l++){Le(t,(l+.7)/(r+.4)*i,c);const h=this.guns.push({r:t,kind:"park",front:-1,s:0,spd:0,lat:0,inAt:0,outAt:0,x:c[0]-c[3]*.08,z:c[1]+c[2]*.08,ax:c[2],az:c[3],period:8,phase:n(),on:!0})-1;if(t.enemy){const u=t.enemy[0]-c[0],f=t.enemy[1]-c[1],p=Math.hypot(u,f)||1;this.guns[h].ax=u/p,this.guns[h].az=f/p}this.crewOut(e,t,h,n()*.3)}}planSurround(t,e,n,i){const s=t.total,a=Math.max(24,Math.min(64,Math.round(s*12))),r=t.pts.at(-1),c=[0,0,0,0];Le(t,s,c);let l=null,h=3;for(const b of i)if(!(b===t||b.event!==t.event||b.side===t.side||!xa(b,t)||!(b.line||b.behaviour==="stand"||b.behaviour==="engage")))for(let _=0;_<=b.total;_+=Math.max(.02,b.total/40)){const S=Le(b,_,[0,0,0,0]),E=Math.hypot(S[0]-r[0],S[1]-r[1]);E<h&&(h=E,l=b)}let u=-c[3],f=c[2],p=.4,[g,v]=r;if(l){const b=this.heading(l);u=b[0],f=b[1],p=Math.max(.2,l.total/2),[g,v]=this.mid(l)}const m=-c[2],d=-c[3],x=-f*m+u*d<0?-1:1;t.ring={cx:g,cz:v,ux:u,uz:f,vx:m,vz:d,nx:-f*x,nz:u*x,half:p,reach:null,inner:p+Hn.clear,band:null},this.ground&&this.reachOf(t.ring,l||{total:0,pts:[r],cum:[0]});const M=Math.min(28,Math.round(a*.45));for(let b=0;b<M;b++){const _=b%2,S=(((b>>1)+.5+(n()-.5)*.5)/Math.ceil(M/2)*2-1)*(72*Math.PI/180);e.push({mode:"ring",s:S,row2:_,close:!0,tm:.5+n()*3,ph:n()})}this.planFiles(t,e,n,{n:a-M,to:Math.max(.1,s-Math.min(1.2,s*.25)),at:2})}reachOf(t,e){const n=this.ground,i=[0,0,0,0];let s=1/0,a=-1/0;for(let c=0;c<=e.total+1e-9;c+=Math.max(.02,e.total/40)){const l=e.total>0?Le(e,c,i):e.pts[0],h=n(l[0],l[1]);if(s=Math.min(s,h),a=Math.max(a,h),!(e.total>0))break}if(!Number.isFinite(s)||!Number.isFinite(a))return;s-=Hn.down,a+=Hn.up;const r=new Float32Array(Hn.dirs);for(let c=0;c<Hn.dirs;c++){const l=c/Hn.dirs*2*Math.PI,h=Math.cos(l),u=Math.sin(l);let f=1/0;for(let p=Hn.step;p<=Hn.far;p+=Hn.step){const g=n(t.cx+h*p,t.cz+u*p);if(g<s||g>a){f=p-Hn.step;break}}r[c]=f}t.reach=r,t.band=[s,a]}planLeap(t,e,n,i){const s=Math.max(5,Math.min(10,Math.round(t.total*10)));let a=3;for(const r of i)if(!(r===t||r.line||r.event!==t.event||r.side!==t.side||r.behaviour!=="stand"||!xa(r,t)))for(let c=0;c<=r.total;c+=Math.max(.02,r.total/40)){const l=Le(r,c,[0,0,0,0]),h=Math.hypot(l[0]-t.pts[0][0],l[1]-t.pts[0][1]);if(h<a){a=h;const u=this.mid(r),f=this.heading(r);t.flank={cx:u[0],cz:u[1],half:r.total/2,ux:f[0],uz:f[1]}}}for(let r=0;r<s;r++)e.push({mode:"leap",s:0,lat:(n()-.5)*.06,dx:Math.round((n()-.5)*8),tm:.3+r*Un.gap*(.8+n()*.4)})}planRanks(t,e,n,i,s=[]){var h,u;const a=t.total;if(a<.3)return;const r=this.mid(t);let c=0;e&&(c=(e[0]-r[0])*-r[3]+(e[1]-r[1])*r[2]>0?-1:1),t.back=c;const l=Math.max(24,Math.min(120,Math.round(a*11)));for(let f=0;f<l;f++){const p=(.04+.92*((f+i()*.9)/l))*a;if(s.some(v=>Math.abs(p-v)<.32))continue;const g=c?c*(.15+Math.pow(i(),1.2)*1.2):(i()+i()-1)*.5;n.push({mode:"rank",s:p,lat:g,tm:1+i()*8})}if(!e){const f=this.cannonOf(t),p=[0,0,0,0];for(let g=0;g<f;g++){Le(t,(g+1)/(f+1)*a,p);const v=(((h=t.enemy)==null?void 0:h[0])??p[0]+1)-p[0],m=(((u=t.enemy)==null?void 0:u[1])??p[1])-p[1],d=Math.hypot(v,m)||1,x=this.guns.push({r:t,kind:"park",front:-1,s:0,spd:0,lat:0,inAt:0,outAt:0,x:p[0],z:p[1],ax:v/d,az:m/d,period:8,phase:i(),on:!0})-1;this.crewOut(n,t,x,i()*.3)}}}crewOut(t,e,n,i){t.push({mode:"piece",kind:"gun",side:"hawaii",dress:"bare",grp:n,role:0,thr:i,crew:!0}),t.push({mode:"crew",kind:"linstock",side:"hawaii",dress:"kihei",grp:n,role:1,thr:i,crew:!0}),t.push({mode:"crew",kind:"rammer",side:"hawaii",dress:"bare",grp:n,role:2,thr:i,crew:!0})}planFront(t,e,n,i,s){const a=i.indexOf(t),r=i.indexOf(e),c=A=>{const w=this.cannonOf(A);return Array.from({length:w},(y,T)=>(T+1)/(w+1)*A.total)},l=c(t),h=c(e);this.planRanks(t,this.mid(e),n[a],s,l),this.planRanks(e,this.mid(t),n[r],s,h);const u=24,f=[],p=[],g=[0,0,0,0];for(let A=0;A<=u;A++)Le(t,A/u*t.total,g),f.push([g[0],g[1]]),Le(e,A/u*e.total,g),p.push([g[0],g[1]]);Math.hypot(f[0][0]-p[0][0],f[0][1]-p[0][1])>Math.hypot(f[0][0]-p[u][0],f[0][1]-p[u][1])&&p.reverse();const v=f.map((A,w)=>[(A[0]+p[w][0])/2,(A[1]+p[w][1])/2]);let m=0,d=0;for(let A=0;A<=u;A++)m+=p[A][0]-f[A][0],d+=p[A][1]-f[A][1];const x=Math.hypot(m,d)||1,M={a:t,b:e,nx:m/x,nz:d/x,ia:a,ib:r},b=this.fronts.push(M)-1;t.front=b,e.front=b;const _=[0];for(let A=1;A<=u;A++)_.push(_[A-1]+Math.hypot(v[A][0]-v[A-1][0],v[A][1]-v[A-1][1]));const S={pts:v,cum:_,total:_[u]},E=Math.max(4,Math.min(16,Math.round(S.total*2)));for(let A=0;A<E;A++){Le(S,(.08+.84*((A+.2+s()*.6)/E))*S.total,g);const w=(s()-.5)*.4,y=this.pairs.push({x:g[0]+M.nx*w,z:g[1]+M.nz*w,front:b,period:1.5+s()*.8,phase:s(),sway:s()*Math.PI*2,swayT:3+s()*3})-1,T=s()*.9;n[a].push({mode:"duel",grp:y,role:0,close:!0,thr:T}),n[r].push({mode:"duel",grp:y,role:1,close:!0,thr:T})}for(const[A,w,y]of[[t,l,1],[e,h,-1]])for(const T of w){Le(A,T,g);const L=A.back||-1,I=this.guns.push({r:A,kind:"front",front:b,x:g[0]-g[3]*L*.05,z:g[1]+g[2]*L*.05,ax:M.nx*y,az:M.nz*y,period:7+s()*2.5,phase:s(),on:!0})-1;this.crewOut(n[i.indexOf(A)],A,I,s()*.5)}}armOut(t,e,n){const i=Ca.includes(t.side)?t.side:"oahu",s=e.filter(f=>!f.crew);for(const f of e)f.crew&&(f.side="hawaii");const a=by(this.sharesOf(t),Hr,s.length);t.counts=a;const r=[];for(const f of Hr)for(let p=0;p<a[f];p++)r.push(f);for(let f=r.length-1;f>0;f--){const p=Math.floor(n()*(f+1));[r[f],r[p]]=[r[p],r[f]]}const c=f=>{const p=r.findIndex(g=>f.includes(g));return r.splice(p>=0?p:0,1)[0]||"spear"};for(const f of s)f.close&&(f.kind=c(uy));for(const f of s)f.close||(f.kind=c(Hr));for(const f of s)f.side=i,f.dress=n()<.55?"kihei":"bare";const l=s.filter(f=>(f.kind==="spear"||f.kind==="club")&&!f.noChief);let h=s.length>=12?Math.max(1,Math.round(s.length/32)):0;const u=l.find(f=>f.mode==="duel");u&&h&&(u.dress="chief",h--);for(let f=0;f<h&&l.length;f++)l[Math.floor(n()*l.length)].dress="chief"}update(t,e,n){var Ct,Ft,Y,at,lt,P,C,z,O,Z;const i=this.app,s=i.camera,a=this.f,r=this.recs;this.hold&&(t=0),this.time+=t,this.frame++;const c=this.time;s.updateMatrixWorld();const l=s.matrixWorld.elements,h=this.view;let u=Math.hypot(l[0],l[2])||1;h.rx=l[0]/u,h.rz=l[2]/u,u=Math.hypot(l[8],l[10])||1,h.ax=-l[8]/u,h.az=-l[10]/u,h.sinP=Math.max(.05,Math.min(1,l[9]));const f=-l[8],p=-l[9],g=-l[10],v=s.position.x,m=s.position.y,d=s.position.z,x=((Ct=i.pipeline)==null?void 0:Ct.size)||i.renderer.getDrawingBufferSize(this._size),M=x.y/Math.max(1,innerHeight);this.dpr=M;const b=Math.tan(s.fov*Math.PI/360);this.own.uViewport.value.set(x.x,x.y),this.own.uPxW.value=2*b/Math.max(1,x.y);const _=(Ft=i.districts)!=null&&Ft.on?(lt=(at=(Y=i.districts.cur)==null?void 0:Y.terrain)==null?void 0:at.shadow)==null?void 0:lt.texture:null;this.own.uFigS.value=_||null,this.own.uHasS.value=_?1:0;const S=i.world.uniforms.uVert.value,E=i.districts,A=E!=null&&E.on?1+E.k:0,w=((C=(P=E==null?void 0:E.cur)==null?void 0:P.parent)==null?void 0:C.k)??0,y=((z=i.timeline)==null?void 0:z.year)??0,T=A!==this._g0||w!==this._g1||y!==this._g2;this._g0=A,this._g1=w,this._g2=y;const L=((Z=(O=i.rig)==null?void 0:O.state)==null?void 0:Z.distance)??16,I=this.hold?this.scale:this.scale.step(py(L,M),t,2,Math.max(2,Math.round(4*M))),R=I.L/M*L*2*b/Math.max(1,innerHeight);this.unit=R;const k=n?.5:1,F=cy*R*k,G=ly*R*k,W=t>0?t/Zh:1,K=Math.min(1,Math.max(.35,Math.pow(24/Math.max(1,L),.8)));for(const V of this.guns){if(V.kind!=="haul"||V.r.w*e<=.002)continue;const it=V.r.total;let pt=V.s+F*V.spd*t;pt>it&&(pt%=it),V.s=pt;const yt=Le(V.r,pt,this._p);V.x=yt[0],V.z=yt[1],V.ax=yt[2],V.az=yt[3],V.on=pt>=V.inAt&&pt<=V.outAt}const H=this._p,et=this.marks,ct=this.aFoot.array,Q=this.aCell.array,nt=this.aDraw.array,dt=this.aMix.array;let Mt=0,St=0,Rt=0;const Pt=this.cap,Et=I.k,Ut=I.t,X=Ut<=15.5/16,ue=Ut>.5/16;for(let V=0;V<r.length;V++){const tt=r[V],it=tt.w*e;if(it<=.002&&!tt.drawnLast)continue;const pt=T||!tt.drawnLast;tt.drawnLast=it>.002;const yt=tt.front!==void 0?this.fronts[tt.front]:null,Yt=yt?yt.a===tt:!1,rt=it*this.thin*(tt.line?1:K),oe=!n&&(!!yt||tt.pressed);for(let $=tt.o;$<tt.o+tt.n;$++){const It=a.mode[$];let At=ga,mt=0,Bt=0,te=0,he=0,Ot=rt>a.thr[$],ot=0,U=0,ht=a.hx[$],ut=a.hz[$],zt=!1,Nt=0,ne=0,ae=-1,pe=0;if(It===yn.file){const wt=(tt.behaviour==="run"||tt.behaviour==="surround"?G:F)*a.spd[$];pe=wt*Zh*1.3;let gt=a.s[$]+wt*t;gt>tt.total&&(gt%=tt.total),a.s[$]=gt,Le(tt,gt,H),ot=H[0]-H[3]*a.lat[$],U=H[1]+H[2]*a.lat[$],ht=H[2],ut=H[3];const $t=tt.behaviour!=="march"&&tt.behaviour!=="stand",D=($t?1.7:1.15)*a.spd[$]*k;a.ph[$]=(a.ph[$]+D*t)%1,At=$t?qh:ho,mt=Math.floor(a.ph[$]*4)%4,(gt<a.inAt[$]||gt>a.outAt[$])&&(Ot=!1),a.wet[$]&&(a.lat[$]*=1-Math.min(1,t*.5))}else if(It===yn.knot||It===yn.pacer){let wt=a.s0[$];if(It===yn.pacer){a.tt[$]+=F*.6*a.spd[$]*t;const $t=a.tt[$]/(2*.7)+a.ph[$],D=2*Math.abs($t-Math.floor($t+.5));wt=Math.max(0,Math.min(tt.total,a.s0[$]+(D-.5)*2*.7));const N=$t-Math.floor($t)<.5?1:-1;Le(tt,wt,H),ht=H[2]*N,ut=H[3]*N,At=ho,mt=Math.floor((c*1.1*k+a.ph[$])%1*4)}else Le(tt,wt,H),tt.enemy?(ht=tt.enemy[0]-H[0],ut=tt.enemy[1]-H[1]):(ht=-H[3],ut=H[2]),Bt=a.dx0[$],te=a.dy0[$],[At,mt]=this.act($,t,c,n,oe,!1);ot=H[0]-H[3]*a.lat[$],U=H[1]+H[2]*a.lat[$]}else if(It===yn.rank){Le(tt,a.s0[$],H);const wt=a.st[$];if([At,mt]=this.act($,t,c,n,oe,!0),a.st[$]===1&&wt===1){const gt=F*.5*t,$t=a.offTo[$]-a.off[$];Math.abs($t)<=gt?(a.off[$]=a.offTo[$],a.st[$]=0):a.off[$]+=Math.sign($t)*gt,ht=H[2]*Math.sign($t),ut=H[3]*Math.sign($t)}else yt?(ht=Yt?yt.nx:-yt.nx,ut=Yt?yt.nz:-yt.nz):tt.enemy&&(ht=tt.enemy[0]-H[0],ut=tt.enemy[1]-H[1]);ot=H[0]-H[3]*a.lat[$]+H[2]*a.off[$],U=H[1]+H[2]*a.lat[$]+H[3]*a.off[$]}else if(It===yn.duel){const wt=this.pairs[a.grp[$]],gt=this.fronts[wt.front],$t=a.role[$]===0,D=.1*Math.sin(c*2*Math.PI/wt.swayT+wt.sway);ot=wt.x+gt.nx*D,U=wt.z+gt.nz*D,ht=$t?gt.nx:-gt.nx,ut=$t?gt.nz:-gt.nz;const N=gt.nx*h.rx+gt.nz*h.rz,j=(gt.nx*h.ax+gt.nz*h.az)*h.sinP,J=Math.hypot(N,j)||1,q=N/J,xt=j/J,Tt=(c/wt.period+wt.phase)%1,Lt=$t?Tt<.5:Tt>=.5,kt=Tt%.5/.5,jt=1.6*Math.sin(c*2*Math.PI/(wt.swayT*1.7)+wt.sway);let Gt=($t?-4:4)+jt;At=va,n?(Ot=!1,At=ga,mt=0):Lt?mt=kt<.3?0:kt<.55?1:2:(mt=2,kt>=.3&&kt<.7&&(Gt+=$t?-1:1)),Bt=Math.round(Gt*q+($t?-1.5:1.5)*xt*xt),te=Math.round(Gt*xt*.8),he=.01+($t?1:-1)*Math.sign(j)*.01}else if(It===yn.piece||It===yn.crew){const wt=this.guns[a.grp[$]];ot=wt.x,U=wt.z,wt.kind==="haul"&&!wt.on&&(Ot=!1);const gt=a.role[$];ht=wt.ax,ut=wt.az,gt===0&&(wt.face=this.faceOf(wt.ax,wt.az,wt.face??Re.right));const $t=wt.face??Re.right;ae=$t;const D=wt.kind==="haul",N=n||wt.kind!=="front"?99:(c/wt.period+wt.phase)%1*wt.period;let j=-1;if(gt===0)j=N>=3.5&&N<3.65?0:N>=3.65&&N<4.4?1:N>=4.4&&N<5.2?2:-1,he=$t===Re.front?.03:.01;else if($t<=Re.left){const J=$t===Re.right?1:-1;gt===1?Bt=-11*J:(Bt=11*J,he=.02,D||(ae=$t===Re.right?Re.left:Re.right))}else Bt=gt===1?-9:9,te=$t===Re.back?2:3,ne=$t===Re.back==(gt===1)?1:-1;gt===1?j=N>=2.6&&N<3.2?0:N>=3.2&&N<3.6?1:N>=3.6&&N<4.3?2:-1:gt===2&&(j=N<.9?Math.min(2,Math.floor(N/.3)):-1),D?(At=ho,mt=Math.floor((c*1.15*k+.25*gt)%1*4)):j>=0?(At=va,mt=j):(At=ga,mt=gt===0?0:Math.floor(c*(.6+.1*gt)+a.ph[$])&1)}else if(It===yn.ring){const wt=tt.ring,gt=n?0:4*Math.max(0,Math.sin(c/(2.4+a.ph[$])*2*Math.PI+a.ph[$]*6.28)),$t=Math.max(.3,Math.hypot(wt.ux*h.rx+wt.uz*h.rz,(wt.ux*h.ax+wt.uz*h.az)*h.sinP)),D=Math.max(.3,Math.hypot(wt.vx*h.rx+wt.vz*h.rz,(wt.vx*h.ax+wt.vz*h.az)*h.sinP)),N=a.row2[$],j=(Math.max(wt.half*$t/R+16,24)+6*N)*R/$t,J=(28+9*N)*R/D,q=j-gt*.5*R/$t,xt=J-gt*R/D,Tt=Math.sin(a.s0[$]),Lt=Math.cos(a.s0[$]);let kt=1;if(wt.reach){const jt=wt.ux*j*Tt+wt.vx*J*Lt,Gt=wt.uz*j*Tt+wt.vz*J*Lt,qt=Math.hypot(jt,Gt);qt>1e-6&&(kt=Math.min(1,Math.max(vy(wt.reach,jt,Gt),wt.inner)/qt))}ot=wt.cx+(wt.ux*q*Tt+wt.vx*xt*Lt)*kt,U=wt.cz+(wt.uz*q*Tt+wt.vz*xt*Lt)*kt,ht=wt.cx-ot,ut=wt.cz-U,gt>3?(At=va,mt=gt>3.7?1:0):gt>.3?(At=ho,mt=Math.floor((c*1.3+a.ph[$])%1*4)):[At,mt]=this.act($,t,c,n,!1,!1)}else if(It===yn.leap)if(n)Ot=!1,a.st[$]=0;else{if(a.st[$]===0&&(a.tm[$]-=t,Ot=!1,a.tm[$]<=0&&(a.st[$]=1,a.s[$]=0),Le(tt,0,H),ot=H[0],U=H[1]),a.st[$]===1){const gt=a.s[$]+G*Un.run*t;a.s[$]=gt,a.tt[$]+=t,Le(tt,Math.min(gt,tt.total),H);const $t=Math.max(0,gt-tt.total);if(ot=H[0]+H[2]*$t-H[3]*a.lat[$],U=H[1]+H[3]*$t+H[2]*a.lat[$],ht=H[2],ut=H[3],At=qh,mt=Math.floor((a.tt[$]*1.9+a.ph[$])%1*4),gt>=tt.total){const D=i.world.metresAt(ot,U),N=i.world.metresAt(ot+H[2]*.1,U+H[3]*.1);(D-N>6||$t>.6)&&(a.st[$]=2,a.tt[$]=0,a.gx[$]=1e9,this.jump[$*3]=ot,this.jump[$*3+1]=U,this.jump[$*3+2]=D)}}if(a.st[$]>=1){const gt=tt.pts[0],$t=tt.pts.at(-1),D=(($t[0]-gt[0])*h.rx+($t[1]-gt[1])*h.rz)/R,N=(($t[0]-gt[0])*h.ax+($t[1]-gt[1])*h.az)*h.sinP/R,j=Math.hypot(D,N)||1,J=Math.max(0,Un.least-j)*(a.st[$]===1?Math.min(1,a.s[$]/tt.total):1);Bt=a.dx0[$]+Math.round(D/j*J),te=Math.round(N/j*J);const q=tt.flank;if(q){const xt=((gt[0]-q.cx)*h.rx+(gt[1]-q.cz)*h.rz)/R,Tt=Math.abs(q.ux*h.rx+q.uz*h.rz)*q.half/R+16,Lt=Math.abs(D)>.2*j?Math.sign(D):Math.sign(xt)||1;Bt+=Lt*Math.round(Math.max(0,Tt+4-Lt*xt))}}if(a.st[$]===2){a.tt[$]+=t;const gt=a.tt[$];Le(tt,tt.total,H),ot=this.jump[$*3]+H[2]*Un.across*R*gt,U=this.jump[$*3+1]+H[3]*Un.across*R*gt,ht=H[2],ut=H[3];const $t=Un.up*gt-.5*Un.pull*gt*gt;zt=!0,Nt=this.jump[$*3+2]+$t*R/S,At=ry,mt=gt<.22?0:1+(Math.floor((gt-.22)/.14)&1),-$t>Un.fade&&(Ot=!1),gt>Un.air&&(a.st[$]=0,a.tm[$]=Math.max(.4,tt.n*Un.gap*(.85+Math.random()*.3)-gt-tt.total/Math.max(1e-6,G*Un.run)),a.vis[$]=0,Ot=!1)}}a.hx[$]=ht,a.hz[$]=ut;const we=ae>=0?ae:this.faceOf(ht,ut,a.face[$]);if(a.face[$]=we,we<=Re.left?ne=we===Re.left?-1:1:ne||(ne=It===yn.piece||!a.hand[$]?1:-1),a.mirror[$]=ne,a.fr[$]=At+mt,a.dx[$]=Bt,a.dy[$]=te,a.x[$]=ot,a.z[$]=U,a.air[$]=zt?1:0,(pt||Math.abs(ot-a.gx[$])+Math.abs(U-a.gz[$])>.01||(this.frame+$)%30===0)&&(a.gm[$]=i.world.metresAt(ot,U),a.gx[$]=ot,a.gz[$]=U,a.wet[$]=a.gm[$]<.15?1:0,pe>0&&!a.wet[$])){const wt=Math.hypot(ht,ut)||1;i.world.metresAt(ot+ht/wt*pe,U+ut/wt*pe)<.15&&(a.wet[$]=2)}a.wet[$]&&!zt&&(Ot=!1);const re=zt?Nt:a.gm[$],ze=zt&&re+an*R/S<a.gm[$];ze&&(Ot=!1),a.lift[$]=re;const Sn=Math.max(re,0)*S,Ys=(ot-v)*f+(Sn-m)*p+(U-d)*g;(Ys>a.far[$]||Ys<.05)&&(Ot=!1),Ot&&Rt++;let Ln=a.vis[$];Ln=Ot?Math.min(1,Ln+W):Math.max(0,Ln-W),(it<=.002||ze)&&(Ln=0),a.vis[$]=Ln;const rs=Ut<.5?Et:Et+1;a.k[$]=Ln>0?rs:0;const Ui=$*4;if(et[Ui]=ot,et[Ui+1]=U,et[Ui+2]=Ln,et[Ui+3]=a.k[$],Ln<=0||St>=Pt)continue;St++;const ti=a.cw[$],zo=(Yh[we]*ks+At+mt)*ti,Fo=zt?0:ti>Mc&&a.kind[$]!==lo.gun?Mc:ti;for(let wt=0;wt<2;wt++){if(wt===0?!X:!ue)continue;const gt=Mt*4;ct[gt]=ot,ct[gt+1]=re,ct[gt+2]=U,ct[gt+3]=he,Q[gt]=zo,Q[gt+1]=a.row[$],Q[gt+2]=ti,Q[gt+3]=an,nt[gt]=wt===0?Et:Et+1,nt[gt+1]=ne*a.tint[$],nt[gt+2]=Ln,nt[gt+3]=Bt,dt[gt]=wt===0?Ut:0,dt[gt+1]=wt===0?1:Ut,dt[gt+2]=te,dt[gt+3]=Fo,Mt++}}}if(Rt>Pt?this.thin=Math.max(.1,this.thin*.92):Rt<Pt*.85&&this.thin<1&&(this.thin=Math.min(1,this.thin*1.04)),this.drawn=St,this.instances=Mt,this.geometry.instanceCount=Mt,this.group.visible=Mt>0,Mt>0){this.range.count=Mt*4;for(const V of this.attrs)V.clearUpdateRanges(),V.updateRanges.push(this.range),V.needsUpdate=!0}}act(t,e,n,i,s,a){const r=this.f;r.tm[t]-=e,i&&r.st[t]>=2&&(r.st[t]=0);const c=r.st[t];let l=ga,h=Math.floor(n/(.9+r.tint[t])+r.ph[t]*2)&1;if(c===1)l=ho,h=Math.floor((n*1.15+r.ph[t])%1*4);else if(c>=2){r.tt[t]+=e;const u=r.tt[t];l=va,c===2?h=u<.55?0:u<.67?1:2:c===3?h=u<.3?0:u<.5?1:2:h=u<1?Math.floor(u/.12)&1:u<1.15?2:3,u>(c===2?1.4:c===3?.8:1.45)&&(r.st[t]=0)}if(r.st[t]===0&&r.tm[t]<=0){const u=Math.random();r.tm[t]=3+Math.random()*7;const f=r.kind[t];s&&f===lo.musket?(r.st[t]=2,r.tt[t]=0):s&&f===lo.sling?(r.st[t]=4,r.tt[t]=0):a&&u<.55?(r.st[t]=1,r.offTo[t]=(Math.random()-.5)*.5):s&&u<.8&&(r.st[t]=3,r.tt[t]=0)}return[l,h]}faceOf(t,e,n){const i=this.view,s=t*i.rx+e*i.rz,a=t*i.ax+e*i.az;return s*s+a*a<1e-12?n:(n>=Re.front?Math.abs(s)<=Kh*Math.abs(a):Math.abs(a)>Kh*Math.abs(s))?a>0?Re.back:Re.front:s>0?Re.right:Re.left}scaleAt(){return this.scale.t<.5?this.scale.k:this.scale.k+1}scaleBands(t=this.dpr||1){return gy(t)}screenRect(t){const e=this.f;if(e.vis[t]<=0||!e.k[t])return null;const n=this.app.camera,i=this._v4.set(e.x[t],Math.max(e.lift[t],0)*this.app.world.uniforms.uVert.value,e.z[t],1);if(i.applyMatrix4(n.matrixWorldInverse).applyMatrix4(n.projectionMatrix),i.w<=0)return null;const s=this.own.uViewport.value.x,a=this.own.uViewport.value.y,r=e.k[t],c=Math.floor((i.x/i.w*.5+.5)*s+.5)+e.dx[t]*r,l=Math.floor((i.y/i.w*.5+.5)*a+.5)+e.dy[t]*r,h=e.cw[t]*r,u=an*r,f=(Yh[e.face[t]]*ks+e.fr[t])*e.cw[t];return{x:c-h/2,y:a-l-u,w:h,h:u,k:r,cell:[f,e.row[t],e.cw[t],an],facing:e.mirror[t],face:e.face[t],vis:e.vis[t],solid:this.scale.t===0||this.scale.t===1}}stats(){const t=this.f,e=["right","left","front","back"],n={figures:this.drawn,instances:this.instances,planned:this.count,fronts:this.fronts.length,pairs:this.pairs.length,guns:this.guns.length,sides:{},kinds:{},faces:{},k:{},scale:{k:this.scale.k,t:+this.scale.t.toFixed(3),level:+this.scale.L.toFixed(3)}};for(let i=0;i<this.count;i++){if(t.vis[i]<=0)continue;const s=Ca[t.side[i]],a=Gc[t.kind[i]];n.sides[s]=(n.sides[s]||0)+1,n.kinds[a]=(n.kinds[a]||0)+1,n.faces[e[t.face[i]]]=(n.faces[e[t.face[i]]]||0)+1,n.k[t.k[i]]=(n.k[t.k[i]]||0)+1}return n}dispose(){this.geometry.dispose(),this.material.dispose(),this.shadowMaterial.dispose(),this.texture.dispose()}}Zs(fo,"MODE",yn),Zs(fo,"KIND",lo),Zs(fo,"FACE",Re),Zs(fo,"WIDTH",Hc);const Sy={hawaii:"#f0ae3c",oahu:"#a88fe6",maui:"#d9703f"};class Ey{constructor(t,e,n,i,s=null){var a;this.app=t,this.forces=[],this.lines=[];for(const r of e){const c=r.properties||{};if(c.kind!=="force"&&c.kind!=="line"||((a=r.geometry)==null?void 0:a.type)!=="LineString")continue;const l=r.geometry.coordinates.map(p=>t.data.proj.toWorld(p)),h=[0];for(let p=1;p<l.length;p++)h.push(h[p-1]+Math.hypot(l[p][0]-l[p-1][0],l[p][1]-l[p-1][1]));const u=h.at(-1),f={p:c,pts:l,cum:h,total:u,event:c.event,step:Number.isFinite(c.step)?c.step:0,w:0,goal:0,stop:c.stop??null,line:c.kind==="line"};f.line?(f.side=c.side||(c.role==="advance"?"hawaii":"oahu"),f.batch=i.add([{pts:l,width:.75}],{mode:"band",colour:new Ht(Sy[f.side]||"#ffffff").toArray(),alpha:0,minPx:6,lift:.01,order:6,endFade:1.2}),f.mid=fn(r.geometry),f.stand=!0,this.lines.push(f)):f.side=c.role||"oahu",this.forces.push(f)}this.events=new Map;for(const r of this.forces){if(!r.event)continue;let c=this.events.get(r.event);c||this.events.set(r.event,c={id:r.event,from:1/0,to:-1/0,recs:[]}),c.recs.push(r),Number.isFinite(r.p.from)&&(c.from=Math.min(c.from,r.p.from)),Number.isFinite(r.p.to)&&(c.to=Math.max(c.to,r.p.to))}this.soldiers=new fo(t,this.forces,n,s),this.count=this.soldiers.count,this.marks=this.soldiers.marks,this.group=this.soldiers.group,this.time=0,this.showing={event:null,steps:[],quiet:!1},this.stopShown=0}stepsAt(t,e){var h;const n=this.events.get(t.id),i=t.stops||[];if(!n||e<0||e>=i.length)return[];const s=(h=this.app.tour)==null?void 0:h.places,a=this.app.data.proj,r=[];for(const u of n.recs){if(u.p.kind!=="line"||!u.mid)continue;const[f,p]=a.toWorld(u.mid);let g=-1,v=6;i.forEach((m,d)=>{const x=s==null?void 0:s.get(m.place),M=x&&fn(x.geometry);if(!M)return;const[b,_]=a.toWorld(M),S=Math.hypot(b-f,_-p);S<v&&(v=S,g=d)}),g>=0&&r.push(g-u.step)}r.sort((u,f)=>u-f);const c=r.length?r[Math.floor(r.length/2)]:0,l=new Set;for(const u of n.recs){const f=u.step+c;(f===e||e===i.length-1&&f>e)&&l.add(u.step)}return[...l].sort((u,f)=>u-f)}namedStops(t,e){if(t.stop===null||t.stop===void 0)return null;const n=[];for(const i of Array.isArray(t.stop)?t.stop:[t.stop])Number.isInteger(i)?n.push(i):typeof i=="string"&&(e.stops||[]).forEach((s,a)=>s.place===i&&n.push(a));return n}shownAt(t,e){const n=this.events.get(t.id),i=new Set;if(!n)return i;let s=null;for(const a of n.recs){const r=this.namedStops(a,t);if(r){r.includes(e)&&i.add(a);continue}s||(s=this.stepsAt(t,e)),s.includes(a.step)&&i.add(a)}return i}choose(){var i;const t=this.app.tour,e=t!=null&&t.active?t.event:null;if(e&&this.events.has(e.id)&&t.stop>=0){if(((i=this._at)==null?void 0:i.ev)!==e||this._at.stop!==t.stop){const s=this.shownAt(e,t.stop);this._at={ev:e,stop:t.stop,now:{event:e.id,recs:s,steps:[...new Set([...s].map(a=>a.step))].sort((a,r)=>a-r),quiet:!1}}}return this._at.now}this._at=null;const n=this.app.timeline.year;for(const s of this.events.values())if(n>=s.from&&n<s.to+1)return(this._quiet||(this._quiet=new Map)).get(s.id)||this._quiet.set(s.id,{event:s.id,recs:null,steps:null,quiet:!0}).get(s.id);return this._none||(this._none={event:null,recs:new Set,steps:[],quiet:!1})}update(t,e,n=0){e*=1-Ay(75,140,n),this.time+=t;const i=this.choose();this.showing=i;const s=t>0?1-Math.exp(-t*2):1;for(const r of this.forces){const c=r.event===i.event&&(i.recs===null||i.recs.has(r));r.goal=c?i.quiet?.2:1:0,r.w+=(r.goal-r.w)*s,Math.abs(r.goal-r.w)<.003&&(r.w=r.goal)}for(const r of this.lines)r.batch&&(r.batch.uniforms.uAlpha.value=.26*r.w*e);let a=0;if(!i.quiet&&i.recs)for(const r of i.recs)a=Math.max(a,r.w);this.stopShown=a*e,this.soldiers.update(t,e,i.quiet),this.marksShown=this.soldiers.drawn}stats(){const t=this.choose(),e=n=>n.event===t.event&&(t.recs===null||t.recs.has(n));return{event:t.event,steps:t.steps,quiet:t.quiet,by:t.recs?[...new Set([...t.recs].map(n=>n.stop===null||n.stop===void 0?"inferred":"named"))].join("+")||"none":"year",forces:this.forces.filter(n=>e(n)&&!n.stand).map(n=>n.p.name),lines:this.lines.filter(e).map(n=>n.p.name),marks:this.count,marksShown:this.marksShown??0,...this.soldiers.stats()}}dispose(){this.soldiers.dispose()}}function Ay(o,t,e){const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)}class Ty{constructor(t,e){this.app=t;const n=document.getElementById("ui")||document.body;this.layer=document.createElement("div"),this.layer.className="dlabels",n.insertBefore(this.layer,n.querySelector(".pins")||n.firstChild),this.items=[];for(const i of e){const s=i.properties||{};if(s.kind!=="label"||!s.name)continue;const a=fn(i.geometry);if(!a)continue;const[r,c]=t.data.proj.toWorld(a),l=document.createElement("div");l.className="dlabel",l.textContent=s.name,l.lang="haw",this.layer.appendChild(l),this.items.push({p:s,x:r,z:c,el:l,v:new B,shown:-1,tx:NaN,ty:NaN})}this.panels=[],this.frame=0}panelRects(){if(this.frame++%15===0){this.panels=[];for(const t of document.querySelectorAll(".card, .timeline, .legend, .tools, .brand, .inspector")){if(t.hidden||!t.offsetParent)continue;const e=t.getBoundingClientRect();e.width>0&&e.height>0&&this.panels.push(e)}}return this.panels}update(t){const e=this.app,n=e.camera,i=innerWidth,s=innerHeight,a=e.rig.state.distance,r=1-Math.max(0,Math.min(1,(a-32)/30)),c=[],l=this.panelRects(),h=e.timeline.year;for(const u of this.items){let f=t*r*(Uo(u.p,h)?1:0);if(f>.01){u.v.set(u.x,e.world.heightAt(u.x,u.z)+.05,u.z).project(n),(u.v.z>1||u.v.z<-1)&&(f=0);const g=(u.v.x+1)/2*i,v=(1-u.v.y)/2*s;(g<-80||g>i+80||v<60||v>s+20)&&(f=0);const m=u.el.offsetWidth||60;f>.01&&l.some(d=>g+m/2>d.left-4&&g-m/2<d.right+4&&v+10>d.top-4&&v-10<d.bottom+4)&&(f=0),f>.01&&c.some(d=>Math.abs(d[0]-g)<(d[2]+m)/2+6&&Math.abs(d[1]-v)<18)&&(f=0),f>.01&&c.push([g,v,m]),f>.01&&!(Math.abs(g-u.tx)<=.3&&Math.abs(v-u.ty)<=.3)&&(u.el.style.transform=`translate(${g.toFixed(1)}px, ${v.toFixed(1)}px)`,u.tx=g,u.ty=v)}const p=Math.round(f*20)/20;p!==u.shown&&(u.el.style.opacity=String(p),u.el.style.visibility=p>0?"visible":"hidden",u.shown=p)}}visible(){return this.items.filter(t=>t.shown>.5).map(t=>t.p.name)}dispose(){this.layer.remove()}}const un=4,Nf={limewash:"#d6d0c0",cream:"#ccbf9f",paleGrey:"#b6b1a4",sage:"#959d86",ochre:"#b59967",duskRed:"#8f6152",paleBlue:"#98a5a4",shingle:"#6c665c",iron:"#6e706c",ironRed:"#7f5446",ironGreen:"#6f7a6a",coral:"#cbc1a8",adobe:"#b39b78",brick:"#97684f",stoneGrey:"#a19b90",concrete:"#c2bdb1",concreteWarm:"#c9bea6",glass:"#6a7f88",dark:"#4b4743",post:"#8a7b66",plinth:"#77706a",asphalt:"#6d6a66"},ft=Nf;function He(o,t,e,n,i,s=0,a=0){o.box(s,-un,a,t,n+un,e,i,st.stone)}function Kn(o,t,e,n,i,s,a,r,{alongZ:c=!1,wallMat:l=st.plain,roofMat:h=st.roof,x:u=0,z:f=0,oe:p=s*.6}={}){const g=c?R=>[u+R[2],R[1],f+R[0]]:R=>[u+R[0],R[1],f+R[2]],v=c?e:t,m=c?t:e,d=i/(m/2),x=n-d*s,M=v/2+p,b=m/2+s,_=g([-M,x,-b]),S=g([M,x,-b]),E=g([-M,n+i,0]),A=g([M,n+i,0]),w=g([-M,x,b]),y=g([M,x,b]),T=c?(R,k,F,G,W,K)=>o.quad(G,F,k,R,W,K):(R,k,F,G,W,K)=>o.quad(R,k,F,G,W,K),L=c?(R,k,F,G,W)=>o.tri(F,k,R,G,W):(R,k,F,G,W)=>o.tri(R,k,F,G,W);T(_,E,A,S,a,h),T(y,A,E,w,a.map(R=>R*.84),h);const I=v/2;L(g([-I,n,-m/2]),g([-I,n,m/2]),g([-I,n+i,0]),r,l),L(g([I,n,m/2]),g([I,n,-m/2]),g([I,n+i,0]),r,l)}function ss(o,t,e,n,i,s,a,{roofMat:r=st.roof,x:c=0,z:l=0}={}){const h=i/(e/2),u=n-h*s,f=t/2+s,p=e/2+s,g=Math.max(0,(t-e)/2),v=(x,M)=>[c+x*f,u,l+M*p],m=x=>[c+x*g,n+i,l],d=a.map(x=>x*.84);o.quad(v(-1,-1),m(-1),m(1),v(1,-1),a,r),o.quad(v(1,1),m(1),m(-1),v(-1,1),d,r),o.tri(v(-1,1),m(-1),v(-1,-1),a.map(x=>x*.92),r),o.tri(v(1,-1),m(1),v(1,1),a.map(x=>x*.92),r)}function Of(o,t,e,n,i,s=0,a=0,r=st.roof){const c=t/2,l=[s,e+n,a],h=(u,f)=>[s+u*c,e,a+f*c];o.tri(h(-1,-1),l,h(1,-1),i,r),o.tri(h(1,1),l,h(-1,1),i.map(u=>u*.84),r),o.tri(h(-1,1),l,h(-1,-1),i.map(u=>u*.92),r),o.tri(h(1,-1),l,h(1,1),i.map(u=>u*.92),r)}function Wn(o,t,e,n,i,s,a,r,c,{posts:l=2,x:h=0,from:u=e/2}={}){const f=e/2,p=f+n;p-u>.05&&o.box(h,i-.35,(u+p)/2,t,.35,p-u,c,st.wood);const g=[h-t/2-.2,s,f],v=[h+t/2+.2,s,f],m=[h+t/2+.2,a,p+.3],d=[h-t/2-.2,a,p+.3];o.quad(g,d,m,v,r,st.roof);for(let x=0;x<l;x++){const M=h-t/2+.3+(t-.6)*x/Math.max(1,l-1);o.box(M,i,p-.2,.28,a-i,.28,c,st.wood)}}function os(o,t,e,n,i=0,s=0){o.box(s,i,t/2+.15,e,n,.3,_t(ft.dark,0),st.plain)}const Cy=[[8.2,5,5.6],[7,4.6,5],[6,4.2,4.6],[5.2,4,4.4]];function Ry(o,[t,e,n]){const i=new Ue;return Ga(i,o,t,e,n,!0,un),i}const Vr=[[[-3,-4,.06,0],[5.6,-2.8,1.64,2],[-3.4,4.6,.12,3]],[[-1.6,-2.6,.15,0],[4.2,4.4,1.45,3]],[[-4.2,-4.2,-.05,1],[4.6,-3.6,1.6,2],[-4.8,4,1.5,2],[3.6,4.4,.08,3]],[[.2,-3.5,.04,1],[-4,4,-.06,2],[4.6,3.6,1.62,3]]];function Ly(o,t){const e=new Ue;return e.at(0,0,-2.2,0,1),Ga(e,o,6.8+t*.6,4.6,5.2,!0,un),e.done(),e.at(t?-2.6:2.6,0,4.6,Math.PI/2,1),Ga(e,o,3.6,2.8,3.4,!1,un),e.done(),e}function Py(o,t){const e=new Ue,n=_t([ft.limewash,ft.cream,ft.paleGrey][t],.06,o),i=_t(ft.shingle,.1,o),s=_t(ft.post,.1,o);return t===0?(He(e,9+.4,7+.4,.6,_t(ft.plinth,.1,o)),e.box(0,.6,0,9,3,7,n,st.clap),Kn(e,9,7,3.6,2.6,.5,i,n,{wallMat:st.clap}),Wn(e,9,7,2.2,.6,3.3,2.7,i,s,{from:7/2+.2}),os(e,7,1.1,2.1,.6)):t===1?(He(e,8+.4,6.5+.4,.5,_t(ft.plinth,.1,o)),e.box(0,.5,0,8,5.8,6.5,n,st.clap),Kn(e,8,6.5,6.3,2.4,.5,i,n,{wallMat:st.clap}),Wn(e,8,6.5,2,3.4,5.8,5.4,i,s),Wn(e,8,6.5,2,.5,3.4,3.1,i,s,{from:6.5/2+.2})):(He(e,9.6+.4,7+.4,.6,_t(ft.plinth,.1,o)),e.box(0,.6,0,9.6,2.9,7,n,st.clap),ss(e,9.6,7,3.5,2.2,.5,i),Wn(e,9.6-1.5,7,2.3,.6,3.2,2.6,i,s,{posts:3,from:7/2+.2})),e}function Dy(o,t){const e=new Ue;if(t===0){const s=_t(ft.adobe,.08,o);He(e,9+.6,6+.6,.3,_t(ft.plinth,.1,o)),e.box(0,.3,0,9,2.8,6,s,st.masonry),ss(e,9,6,3.1,2.8,.7,_t("#a58a5c",.12,o),{roofMat:st.thatch}),os(e,6,1.1,2,.3)}else{const s=_t(ft.coral,.06,o);He(e,10.4+.4,8+.4,.4,_t(ft.plinth,.1,o)),e.box(0,.4,0,10.4,6.4,8,s,st.masonry),ss(e,10.4,8,6.8,2,.4,_t(ft.shingle,.1,o)),Wn(e,10.4,8,2.2,3.6,6.4,6,_t(ft.shingle,.1,o),_t(ft.post,.1,o),{posts:3}),Wn(e,10.4,8,2.2,.4,3.6,3.2,_t(ft.shingle,.1,o),_t(ft.post,.1,o),{posts:3,from:8/2+.2})}return e}function Iy(o,t){const e=new Ue,n=_t([ft.limewash,ft.sage,ft.cream][t],.06,o),i=_t([ft.iron,ft.ironRed,ft.ironGreen][t],.08,o),s=_t(ft.limewash,.05,o);return He(e,9.4,8.4,.9,_t(ft.plinth,.1,o)),t===1?(e.box(-1.5,.9,-1,7,3.1,6,n,st.clap),Kn(e,7,6,4,2.5,.5,i,n,{wallMat:st.clap,x:-1.5,z:-1}),e.box(2.6,.85,1.05,4,3.1,6.9,n,st.clap),Kn(e,4,6.9,3.95,2,.45,i,n,{wallMat:st.clap,alongZ:!0,x:2.6,z:1.05}),Wn(e,4.5,4,2,.9,3.7,3.2,i,s,{x:-2.3,from:4.2})):(e.box(0,.9,0,9,3.1,7.5,n,st.clap),t===0?Kn(e,9,7.5,4,2.7,.5,i,n,{wallMat:st.clap}):ss(e,9,7.5,4,2.4,.55,i),Wn(e,9,7.5,2.4,.9,3.8,3.2,i,s,{posts:3,from:4.2}),os(e,7.5,1,2.2,.9)),e}function ky(o,t,e=5.8){const n=new Ue,i=12,s=[ft.cream,ft.limewash,ft.ochre,ft.paleBlue,ft.sage,ft.duskRed],a=_t(ft.iron,.1,o),r=_t(ft.post,.1,o);He(n,t*e+.4,i+.4,.3,_t(ft.plinth,.1,o));for(let c=0;c<t;c++){const l=(c-(t-1)/2)*e,h=_t(s[Math.floor(o()*s.length)],.08,o),u=4.2+o()*1.4;n.box(l,.3,0,e-.15,u,i,h,st.clap);const f=[l-e/2+.075,.3+u-.2,i/2-.6],p=[l+e/2-.075,.3+u-.2,i/2-.6],g=[l+e/2-.075,.3+u-1.3,-i/2-.4],v=[l-e/2+.075,.3+u-1.3,-i/2-.4];n.quad(f,p,g,v,_t(ft.iron,.1,o),st.roof),n.box(l,.3+u,i/2-.175,e-.15,1.4+o()*1,.35,h,st.clap),os(n,i,1.6,2.4,.3,l)}return Wn(n,t*e,i,2.6,.3,3.4,3.1,a,r,{posts:t+1,from:i/2+.2}),n}function Uy(o,t){const e=new Ue,n=[2,3,3][t],i=[11,10.5,11.2][t],s=[12,13,11][t],a=.4+n*3.7,r=_t([ft.brick,ft.stoneGrey,ft.concreteWarm][t],.07,o);return He(e,i+.3,s+.3,.4,_t(ft.plinth,.1,o)),e.box(0,.4,0,i,a-.4,s,r,st.windows),e.box(0,a,0,i+.5,.45,s+.5,r.map(c=>c*.86),st.masonry),e.box(0,a+.45,0,i,.6,s,r.map(c=>c*.95),st.masonry),t===2&&Wn(e,i,s,2.5,.4,4,3.8,_t(ft.iron,.1,o),_t(ft.dark,.1,o),{posts:4,from:s/2+.15}),e}function zy(o,t){const e=new Ue,n=_t([ft.cream,ft.sage,ft.paleGrey][t],.07,o),i=_t([ft.ironGreen,ft.iron,ft.ironRed][t],.1,o),s=[9.8,10,10.2][t],a=[8.6,9.5,8][t];return He(e,s,a,.8,_t(ft.plinth,.1,o)),e.box(0,.8,0,s,2.8,a,n,st.clap),t===1?(Kn(e,s,a,3.6,2,.8,i,n,{wallMat:st.clap}),Wn(e,6,a,2.6,.8,3.4,2.9,i,_t(ft.limewash,.05,o),{x:-1.5})):(ss(e,s+1.2,a+2.4,3.6,1.8,.7,i,{z:1.2}),e.box(0,.8,a/2+1.25,s-.4,.2,2.3,_t(ft.post,.1,o),st.wood)),e}function Fy(o,t){const e=new Ue,n=[6,8][t],i=[13.6,13][t],s=[14,15][t],a=n*3.6,r=_t([ft.concreteWarm,ft.stoneGrey][t],.06,o);return He(e,i+.3,s+.3,.3,_t(ft.plinth,.1,o)),e.box(0,.3,0,i,4.4,s,r.map(c=>c*.9),st.masonry),e.box(0,4.7,0,i,a-4.4,s,r,st.windows),e.box(0,a+.3,0,i+.6,.6,s+.6,r.map(c=>c*.85),st.masonry),e.box(-i/4,a+.9,-s/5,3.5,2.2,3.5,r.map(c=>c*.9),st.plain),e}function Ny(o,t){const e=new Ue,n=_t([ft.limewash,ft.concreteWarm,ft.paleBlue][t],.07,o),i=_t([ft.iron,ft.shingle,ft.ironGreen][t],.1,o);if(t===2)return He(e,9,8,.3,_t(ft.plinth,.1,o)),e.box(0,.3,0,9,5.4,8,n,st.plain),Kn(e,9,8,5.7,1.4,.6,i,n),e;const s=11.5,a=9;return He(e,s,a,.3,_t(ft.plinth,.1,o)),e.box(-1.5,.3,0,s-3,2.7,a,n,st.plain),ss(e,s-3,a,3,1.3,.7,i,{x:-1.5}),e.box(s/2-1.5,2.6,.4,3.2,.25,a-1.2,i.map(r=>r*.9),st.plain),e.box(s/2-.1,.3,a/2-1,.25,2.3,.25,n,st.plain),t===1&&e.box(-3.2,-un,-a/2-1.4,4.4,un+2.7,2.8,n.map(r=>r*.95),st.plain),e}function Oy(o,t){const e=new Ue,n=[3,4][t],i=18.4,s=10,a=n*3.1,r=_t([ft.concrete,ft.cream][t],.06,o);He(e,i,s+2,.6,_t(ft.plinth,.1,o)),e.box(0,.6,-.8,i,a,s-1.6,r,st.windows);for(let c=1;c<=n;c++)e.box(0,.6+c*3.1-.3,s/2-.4,i-.3,.3,1.6,r.map(l=>l*.9),st.plain);return ss(e,i,s-1.6,a+.6,1.2,.4,_t(ft.iron,.1,o),{z:-.8}),e}const Xi=60;function By(o,t){const e=new Ue,n=_t([ft.concrete,ft.concreteWarm,ft.limewash][t],.06,o),i=n.map((s,a)=>s*.75+_t(ft.glass,0,o)[a]*.25);return t===0?(e.box(0,-un*3,0,29,un*3+6,18,n.map(s=>s*.9),st.masonry),e.box(0,6,0,27,Xi-6,13,i,st.windows),e.box(0,Xi,0,27.6,1.2,13.6,n.map(s=>s*.85),st.plain)):t===1?(e.box(0,-un*3,0,22,un*3+1,22,n.map(s=>s*.9),st.masonry),e.box(0,1,0,20,Xi-1,20,i,st.windows),e.box(0,Xi,0,8,3,8,n.map(s=>s*.8),st.plain)):(e.box(0,-un*3,0,28,un*3+9,26,n.map(s=>s*.88),st.windows),e.box(-2,9,-2,17,Xi-9,16,i,st.windows),e.box(-2,Xi,-2,17.6,1,16.6,n.map(s=>s*.85),st.plain)),e}function Wy(o,t){const e=new Ue,n=_t([ft.concrete,ft.paleGrey,ft.stoneGrey][t],.08,o),i=_t([ft.iron,ft.ironGreen,ft.iron][t],.1,o),s=[12,12.2,11.6][t],a=[12.5,12,13][t];if(He(e,s+.3,a+.3,.25,_t(ft.plinth,.1,o)),t===1){e.box(0,.25,0,s,4.6,a,n,st.plain);const c=3,l=a/c;for(let h=0;h<c;h++){const u=-a/2+h*l,f=u+l,p=.25+4.6,g=p+2.2,v=-s/2,m=s/2;e.quad([v,p,u],[v,g,f],[m,g,f],[m,p,u],i,st.roof),e.quad([v,g,f],[v,p,f],[m,p,f],[m,g,f],_t(ft.glass,.05,o),st.plain),e.tri([v,p,u],[v,p,f],[v,g,f],n,st.plain),e.tri([m,p,f],[m,p,u],[m,g,f],n,st.plain)}os(e,a,3.6,3.4,.25)}else{const r=t===0?5.2:3.8;e.box(0,.25,0,s,r,a,n,st.clap),Kn(e,s,a,.25+r,t===0?1.6:2.6,.4,i,n,{alongZ:!0,wallMat:st.clap,roofMat:st.roof}),os(e,a,t===0?4.2:6.5,t===0?4:3.4,.25)}return e}function Gy(o){const t=new Ue,e=_t(ft.coral,.04,o),n=_t(ft.shingle,.08,o),i=24,s=44;He(t,i+1,s+1,.8,_t(ft.plinth,.08,o)),t.box(0,.8,-2,i,9.2,s-4,e,st.masonry),Kn(t,i,s-4,10,6.5,.6,n,e,{alongZ:!0,wallMat:st.masonry,z:-2}),t.box(0,.75,s/2-3.6,9,22.05,8.4,e,st.masonry),t.box(0,22.8,s/2-3.6,9.6,.8,9,e.map(a=>a*.88),st.masonry);for(const[a,r]of[[-1,-1],[1,-1],[1,1],[-1,1]])t.box(a*4,23.6,s/2-3.6+r*3.5,1.2,1.4,1.2,e,st.masonry);return os(t,2*(s/2-3.6+4.2),2.2,4,.8),t}function Hy(o){const t=new Ue,e=_t(ft.limewash,.03,o),n=_t(ft.iron,.08,o),i=13,s=24;return He(t,i+.6,s+.6,.8,_t(ft.plinth,.08,o)),t.box(0,.8,-1,i,6.4,s-2,e,st.clap),Kn(t,i,s-2,7.2,4.6,.5,n,e,{alongZ:!0,wallMat:st.clap,z:-1}),t.box(0,.75,s/2-1.3,4.5,14.05,4.9,e,st.clap),Of(t,4.8,14.8,12,n,0,s/2-1.3),t}function Vy(o){const t=new Ue,e=_t(ft.concreteWarm,.03,o);return He(t,14,14,.5,_t(ft.plinth,.08,o)),t.box(0,.5,0,12,40,12,e,st.windows),t.box(0,40.5,0,13,6,13,e.map(n=>n*.93),st.masonry),Of(t,13,46.5,7,_t(ft.ironGreen,.05,o)),t.cyl([0,53.5,0],[0,60,0],.25,.15,_t(ft.dark,0),st.plain,4),t}function Bf(o,t={}){const e={},n=(i,s)=>{e[i]=s.map(a=>{const r=xc(a.geometry());r.computeBoundingBox();const c=r.boundingBox;r.dispose();const l=un*(i==="tower"?3:1)+.25;t[i]&&a.box(0,-l,0,t[i][0],l+.2,t[i][1],_t(ft.concrete,.05,o).map(u=>u*.88),st.plain);const h=xc(a.geometry());return{geometry:h,hx:Math.max(-c.min.x,c.max.x),hz:Math.max(-c.min.z,c.max.z),box:[c.min.x,c.max.x,c.min.z,c.max.z],top:c.max.y,tris:h.index.count/3}})};return n("kauhale",Cy.map(i=>Ry(o,i))),n("hale",[0,1].map(i=>Ly(o,i))),n("frame",[0,1,2].map(i=>Py(o,i))),n("adobe",[0,1].map(i=>Dy(o,i))),n("cottage",[0,1,2].map(i=>Iy(o,i))),n("store",[[2,5.8],[1,9.4]].map(([i,s])=>ky(o,i,s))),n("block",[0,1,2].map(i=>Uy(o,i))),n("bungalow",[0,1,2].map(i=>zy(o,i))),n("midrise",[0,1].map(i=>Fy(o,i))),n("house",[0,1,2].map(i=>Ny(o,i))),n("walkup",[0,1].map(i=>Oy(o,i))),n("tower",[0,1,2].map(i=>By(o,i))),n("shed",[0,1,2].map(i=>Wy(o,i))),n("church",[Gy(o)]),n("spire",[Hy(o)]),n("clock",[Vy(o)]),e}function Vc(o=2,t=5e4){const e=Math.log(1+t/o),n=new Float32Array(256);for(let i=0;i<256;i++)n[i]=o*(Math.exp(i/255*e)-1);return{lut:n,decode:i=>o*(Math.exp(i/255*e)-1),encode:i=>Math.max(0,Math.min(255,Math.round(255*Math.log(1+Math.max(0,i)/o)/e)))}}const $y=o=>Math.max(1,Math.round(60/Math.max(1,o)));async function $r(o,t){const{arch:e}=o,n=Vc(o.d0,o.dMax),i=e.W,s=e.H,a=e.rect,r=o.islands,c=new Int8Array(i*s).fill(-1),l=(a.x1-a.x0)/i,h=(a.z1-a.z0)/s;for(let v=0;v<s;v++){const m=a.z0+(v+.5)*h;for(let d=0;d<i;d++){const x=a.x0+(d+.5)*l;let M=0,b=-1;for(let _=0;_<r.length;_++){const S=r[_].rect,E=Math.min(x-S.x0,S.x1-x,m-S.z0,S.z1-m);E>M&&(M=E,b=_)}c[v*i+d]=b}}const u=new Float32Array(i*s*3),f=new Float32Array(i*s),p={kf:o.kf,arch:null,islands:[]};for(let v=0;v<r.length;v++){const m=r[v],{W:d,H:x}=m,[M,b,_]=await Promise.all(["cultivation","settlement","forest"].map(L=>Xy(m.layers[L],d,x,t,`${m.id} ${L}`))),S=m.land&&m.land.length===d*x?m.land:null,E=m.rect,A=(E.x1-E.x0)/d,w=(E.z1-E.z0)/x,y=new Int32Array(d);for(let L=0;L<d;L++)y[L]=Math.floor((E.x0+(L+.5)*A-a.x0)/l);for(let L=0;L<x;L++){const I=Math.floor((E.z0+(L+.5)*w-a.z0)/h);if(I<0||I>=s)continue;const R=L*d;for(let k=0;k<d;k++){const F=y[k];if(F<0||F>=i)continue;const G=I*i+F;if(c[G]!==v)continue;const W=R+k;S&&!S[W]||(u[G*3]+=M[W],u[G*3+1]+=n.lut[b[W]],u[G*3+2]+=_[W],f[G]++)}}const T=Math.max(1,m.f||1);if(T===1){const L=new Uint8Array(d*x*4);for(let I=0;I<d*x;I++)L[I*4]=M[I],L[I*4+1]=b[I],L[I*4+2]=_[I],L[I*4+3]=255;S&&Xr(L,d,x,S,2),p.islands.push({id:m.id,W:d,H:x,data:L})}else{const L=Math.max(1,Math.round(d/T)),I=Math.max(1,Math.round(x/T)),R=new Float32Array(L*I*3),k=new Float32Array(L*I),F=new Int32Array(d);for(let W=0;W<d;W++)F[W]=Math.min(L-1,Math.floor((W+.5)*L/d));for(let W=0;W<x;W++){const K=Math.min(I-1,Math.floor((W+.5)*I/x))*L;for(let H=0;H<d;H++){const et=W*d+H;if(S&&!S[et])continue;const ct=K+F[H];R[ct*3]+=M[et],R[ct*3+1]+=n.lut[b[et]],R[ct*3+2]+=_[et],k[ct]++}}const G=tu(R,k,L*I,n);Xr(G,L,I,k,2),p.islands.push({id:m.id,W:L,H:I,data:G})}}const g=tu(u,f,i*s,n);return Xr(g,i,s,f,3),p.arch={W:i,H:s,data:g},p}function Xr(o,t,e,n,i){let s=Uint8Array.from(n,a=>a?1:0);for(let a=0;a<i;a++){const r=s.slice();for(let c=0;c<e;c++)for(let l=0;l<t;l++){const h=c*t+l;if(s[h])continue;let u=0,f=0,p=0,g=0;const v=m=>{s[m]&&(u++,f+=o[m*4],p+=o[m*4+1],g+=o[m*4+2])};l>0&&v(h-1),l<t-1&&v(h+1),c>0&&v(h-t),c<e-1&&v(h+t),u&&(o[h*4]=Math.round(f/u),o[h*4+1]=Math.round(p/u),o[h*4+2]=Math.round(g/u),r[h]=1)}s=r}}function tu(o,t,e,n){const i=new Uint8Array(e*4);for(let s=0;s<e;s++){const a=t[s];i[s*4+3]=255,a&&(i[s*4]=Math.round(o[s*3]/a),i[s*4+1]=n.encode(o[s*3+1]/a),i[s*4+2]=Math.round(o[s*3+2]/a))}return i}async function Xy(o,t,e,n,i){if(!o)return new Uint8Array(t*e);if(typeof o=="string")return jr(await n(o),t,e,o);const[s,a]=await Promise.all([n(o.from),n(o.to)]),r=jr(s,t,e,o.from),c=jr(a,t,e,o.to),l=o.t,h=new Uint8Array(t*e);for(let u=0;u<t*e;u++)h[u]=Math.round(r[u]+(c[u]-r[u])*l);return h}function jr(o,t,e,n){if(o.W!==t||o.H!==e)throw new Error(`${n} is ${o.W}×${o.H}, the pack is ${t}×${e}`);return o.px}async function Co(o,t){const{px:e,W:n,H:i}=await o(t),s=new Uint8Array(n*i);for(let a=0,r=0;a<n*i;a++,r+=4)s[a]=e[r];return{px:s,W:n,H:i}}const eu=["cultivation","settlement","forest"],jy={cultivation:"Cultivation",settlement:"Settlement",forest:"Native forest"},Ki=[1100,1450],qy=3,Ma=.002,Yy=10,Rs=(o,t,e)=>Math.max(t,Math.min(e,o)),nu=(o,t,e)=>{const n=Rs((e-o)/(t-o),0,1);return n*n*(3-2*n)};function Ky(){const o=new Ye(new Uint8Array([0,0,0,255]),1,1,Ae,de);return o.needsUpdate=!0,o}function Zy(o){var n;const t=(n=o.data)==null?void 0:n.metres;if(!t)return null;const e=new Uint8Array(t.length);for(let i=0;i<t.length;i++)e[i]=t[i]>0?1:0;return e}function iu(o,t,e,n){const i=new Ye(o,t,e,Ae,de);return i.minFilter=is,i.magFilter=We,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=on,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class Jy{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.blank=Ky();const e=t.shared.uniforms;Object.assign(e,{uArchLandA:{value:this.blank},uArchLandB:{value:this.blank},uLandT:{value:0},uLandK:{value:0},uLandEarly:{value:1}}),this.uniforms=e,this.available=null,this.manifest=null,this.keyframes=[],this.resident=new Map,this.loading=new Map,this.bound=null,this.swapTo=null,this.kpShown=0,this.fade=0,this.fadeGoal=0,this.listeners=[],this.chain=Promise.resolve(),this.jobN=0,this.uploads=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){var a;const t=this.data.abs("layers/manifest.json");let e;try{const r=await fetch(t);if(!r.ok)throw new Error(`HTTP ${r.status}`);if(e=await r.json(),!Array.isArray(e==null?void 0:e.keyframes)||!e.keyframes.length||!e.islands)throw new Error("no keyframes or islands")}catch(r){this.available=!1,this.warn(`${t}: ${r.message} (no land layers)`),this.notify();return}this.manifest=e,this.keyframes=[...e.keyframes].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),this.kfIndex=new Map(this.keyframes.map((r,c)=>[r.id,c]));const n=((a=e.encoding)==null?void 0:a.settlement)||{};this.codec=Vc(n.d0??2,n.dMax??5e4);const i=this.app.world;this.islands=i.islandPacks.filter(r=>e.islands[r.id]).map(r=>({pack:r,entry:e.islands[r.id]}));const s=i.archPack;this.arch={W:Math.max(1,Math.round(s.W/2)),H:Math.max(1,Math.round(s.H/2)),rect:s.rect},this.eraYears=this.app.timeline.eras.map(r=>this.eraYear(r)),this.available=!0,this.notify()}eraYear(t){var i,s;const e=(s=(i=this.manifest.eras)==null?void 0:i[t.id])==null?void 0:s.cultivation,n=a=>{var r;return(r=this.keyframes[this.kfIndex.get(a)])==null?void 0:r.year};return e!=null&&e.keyframe&&n(e.keyframe)!==void 0?n(e.keyframe):e!=null&&e.from&&n(e.from)!==void 0&&n(e.to)!==void 0?n(e.from)+(n(e.to)-n(e.from))*(e.t??0):t.year}kpAtYear(t){const e=this.keyframes;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}position(t=this.app.timeline.s){const e=this.eraYears;if(!(e!=null&&e.length))return 0;const n=Rs(t,0,e.length-1),i=Math.min(e.length-2,Math.floor(n));return i<0?this.kpAtYear(e[0]):this.kpAtYear(e[i]+(e[i+1]-e[i])*(n-i))}bracket(t){const e=this.keyframes.length,n=r=>this.keyframes[r].id;if(e<2)return{a:n(0),b:n(0),t:0,need:[n(0)]};const i=Rs(Math.floor(t),0,e-2),s=Rs(t-i,0,1),a=s<Ma?[n(i)]:s>1-Ma?[n(i+1)]:[n(i),n(i+1)];return{a:n(i),b:n(i+1),t:s,need:a}}covers(t,e){return t?e>=this.kfIndex.get(t.a)-Ma&&e<=this.kfIndex.get(t.b)+Ma:!1}clampTo(t,e){return Rs(e,this.kfIndex.get(t.a),this.kfIndex.get(t.b))}job(t){var r;const e=this.keyframes,n=this.kfIndex.get(t),i=c=>this.data.abs(`layers/${c}`),s=(c,l)=>{const h=p=>{var g,v,m;return(m=(v=(g=c.layers)==null?void 0:g[e[p].id])==null?void 0:v[l])==null?void 0:m.file};if(h(n))return i(h(n));let u=n-1;for(;u>=0&&!h(u);)u--;let f=n+1;for(;f<e.length&&!h(f);)f++;return u>=0&&f<e.length?{from:i(h(u)),to:i(h(f)),t:(e[n].year-e[u].year)/(e[f].year-e[u].year)}:u>=0?i(h(u)):f<e.length?i(h(f)):null},a=((r=this.manifest.encoding)==null?void 0:r.settlement)||{};return{kf:t,d0:a.d0??2,dMax:a.dMax??5e4,arch:this.arch,islands:this.islands.map(({pack:c,entry:l})=>({id:c.id,W:c.W,H:c.H,f:$y(Math.max(c.mx,c.mz)),rect:c.rect,land:Zy(c),layers:Object.fromEntries(eu.map(h=>[h,s(l,h)]))}))}}request(t){const e=this.chain=this.chain.catch(()=>{}).then(()=>{if(!this.wanted(t))return null;const n=performance.now();return this.run(this.job(t)).then(i=>{this.arrive(i),this.lastBakeMs=Math.round(performance.now()-n)})}).catch(n=>this.warn(`land layers ${t}: ${n.message}`)).finally(()=>{this.loading.delete(t)});return this.loading.set(t,e),e}wanted(t){var n,i;const e=this.bracket(this.position());return this.bound&&this.app.view!=="land"?!1:e.need.includes(t)||((n=this.swapTo)==null?void 0:n.a)===t||((i=this.swapTo)==null?void 0:i.b)===t}run(t){const e=n=>Co(Zn,n);if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("layers-worker-OijIdfIP.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=n=>this.reply(n.data),this.worker.onerror=n=>{var s;(s=n.preventDefault)==null||s.call(n),this.fallback=!0;const i=this.pending;this.pending=null,i&&$r(i.job,e).then(i.resolve,i.reject)}}catch{this.fallback=!0}return this.fallback?$r(t,e):new Promise((n,i)=>{const s=++this.jobN;this.pending={id:s,job:t,resolve:n,reject:i},this.worker.postMessage({...t,job:s})})}reply(t){const e=this.pending;!e||t.job!==e.id||(this.pending=null,t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,$r(e.job,n=>Co(Zn,n)).then(e.resolve,e.reject)):e.reject(new Error(t.message)))}arrive(t){const e=Math.min(4,this.app.renderer.capabilities.getMaxAnisotropy()),n={id:t.kf,arch:iu(t.arch.data,t.arch.W,t.arch.H,e),archData:t.arch.data,islands:new Map(t.islands.map(i=>[i.id,iu(i.data,i.W,i.H,e)])),texels:t.arch.W*t.arch.H+t.islands.reduce((i,s)=>i+s.W*s.H,0),used:performance.now()};this.resident.set(t.kf,n),this.uploads.push(n.arch,...n.islands.values())}dropUnused(){var n,i,s,a;const t=performance.now(),e=new Set([(n=this.bound)==null?void 0:n.a,(i=this.bound)==null?void 0:i.b,(s=this.swapTo)==null?void 0:s.a,(a=this.swapTo)==null?void 0:a.b,...this.bracket(this.position()).need]);for(const[r,c]of this.resident){if(e.has(r)){c.used=t;continue}if(this.resident.size>qy||t-c.used>Yy*1e3){c.arch.dispose();for(const l of c.islands.values())l.dispose();this.resident.delete(r),this.uploads=this.uploads.filter(l=>l!==c.arch&&![...c.islands.values()].includes(l))}}}resolve(t){const e=this.resident.has(t.a)?t.a:t.b;return{a:e,b:this.resident.has(t.b)?t.b:e}}bind(t){const{a:e,b:n}=this.resolve(t);this.bound={a:e,b:n};const i=this.resident.get(e),s=this.resident.get(n),a=this.uniforms;a.uArchLandA.value=i.arch,a.uArchLandB.value=s.arch;for(const r of this.app.world.islands)this.attach(r);this.notify()}attach(t){const e=t.uniforms;if(!e.uOwnLandA)return;const n=this.bound&&this.resident.get(this.bound.a),i=this.bound&&this.resident.get(this.bound.b);e.uOwnLandA.value=(n==null?void 0:n.islands.get(t.pack.id))||this.blank,e.uOwnLandB.value=(i==null?void 0:i.islands.get(t.pack.id))||this.blank}update(t,e){const n=this.uniforms;if(n.uLandEarly.value=nu(Ki[0],Ki[1],this.app.timeline.year),!this.available){n.uLandK.value=0;return}const i=this.position(),s=this.bracket(i);if(this.app.view==="land"||e>.001||!this.bound)for(const l of s.need)!this.resident.has(l)&&!this.loading.has(l)&&this.request(l);const r=s.need.every(l=>this.resident.has(l));if(r&&!this.swapTo&&!this.covers(this.bound,i)&&(!this.bound||this.fade<.02?(this.bind(s),this.kpShown=this.clampTo(this.bound,i)):this.covers(this.resolve(s),this.kpShown)?this.bind(s):this.swapTo=s),this.swapTo?(this.fadeGoal=0,this.fade<.02&&(this.bind(r?s:this.swapTo),this.swapTo=null,this.kpShown=this.clampTo(this.bound,i))):this.fadeGoal=this.bound?1:0,this.bound){const l=this.clampTo(this.bound,i);this.kpShown+=(l-this.kpShown)*(1-Math.exp(-t*8)),Math.abs(l-this.kpShown)<1e-4&&(this.kpShown=l)}this.fade+=(this.fadeGoal-this.fade)*(1-Math.exp(-t*6)),Math.abs(this.fadeGoal-this.fade)<.003&&(this.fade=this.fadeGoal),this.apply(e),this.dropUnused();const c=this.uploads.shift();c!=null&&c.image.data&&this.app.renderer.initTexture(c)}apply(t){const e=this.uniforms;if(this.bound){const n=this.kfIndex.get(this.bound.a),i=this.kfIndex.get(this.bound.b);e.uLandT.value=i>n?Rs((this.kpShown-n)/(i-n),0,1):0}e.uLandK.value=t*this.fade}settle(t){if(!this.available)return;const e=this.position(),n=this.bracket(e);n.need.every(i=>this.resident.has(i))&&!this.covers(this.bound,e)&&this.bind(n),this.swapTo=null,this.bound&&(this.kpShown=this.clampTo(this.bound,e)),this.fade=this.fadeGoal=this.bound?1:0,this.uniforms.uLandEarly.value=nu(Ki[0],Ki[1],this.app.timeline.year),this.apply(t)}get ready(){return!!this.available&&this.covers(this.bound,this.position())&&!this.swapTo&&this.fade>.99}describe(){if(!this.available)return null;const{a:t,b:e,need:n}=this.bracket(this.position()),i=this.keyframes,s=(l,h)=>{var g,v,m,d,x,M,b,_,S,E;const u=this.kfIndex.get(l),f=(m=(v=(g=this.manifest.methods)==null?void 0:g[l])==null?void 0:v[h])==null?void 0:m.method;if(f||(d=i[u].layers)!=null&&d.includes(h))return f?[f]:[];const p=[];for(let A=u-1;A>=0;A--){const w=(b=(M=(x=this.manifest.methods)==null?void 0:x[i[A].id])==null?void 0:M[h])==null?void 0:b.method;if(w){p.push(w);break}}for(let A=u+1;A<i.length;A++){const w=(E=(S=(_=this.manifest.methods)==null?void 0:_[i[A].id])==null?void 0:S[h])==null?void 0:E.method;if(w){p.push(w);break}}return p},a=eu.map(l=>{const h=n.flatMap(f=>s(f,l)),u=h.includes("modelled")?"modelled":h.includes("mixed")?"partly modelled":"";return{id:l,name:jy[l],note:u}}),r=l=>i[this.kfIndex.get(l)].year;return{years:n.length>1?[r(t),r(e)]:[r(n[0])],layers:a,early:this.app.timeline.year<Ki[1]}}valuesAt(t,e){if(!this.bound)return null;const n=this.resident.get(this.bound.a),i=this.resident.get(this.bound.b);if(!n||!i)return null;const{W:s,H:a,rect:r}=this.arch,c=Math.floor((t-r.x0)/(r.x1-r.x0)*s),l=Math.floor((e-r.z0)/(r.z1-r.z0)*a);if(c<0||l<0||c>=s||l>=a)return null;const h=(l*s+c)*4,u=this.uniforms.uLandT.value,f=p=>n.archData[h+p]+(i.archData[h+p]-n.archData[h+p])*u;return{cultivation:f(0)/255,people:this.codec.decode(f(1)),forest:f(2)/255}}stats(){let t=0,e=0;for(const n of this.resident.values())t+=n.texels,e+=n.archData.byteLength;return{available:this.available,resident:[...this.resident.keys()],bound:this.bound?`${this.bound.a}/${this.bound.b}`:null,t:+this.uniforms.uLandT.value.toFixed(3),k:+this.uniforms.uLandK.value.toFixed(3),gpuMB:+(t*4*4/3/1048576).toFixed(1),cpuMB:+(e/1048576).toFixed(1),bakeMs:this.lastBakeMs??null}}dispose(){var t;for(const e of this.resident.values()){e.arch.dispose();for(const n of e.islands.values())n.dispose()}this.resident.clear(),(t=this.worker)==null||t.terminate()}}const Xt=(o,t,e)=>Math.max(t,Math.min(e,o)),ce=(o,t,e)=>{const n=Xt((e-o)/(t-o),0,1);return n*n*(3-2*n)},Ti=.36,li=.4,Wf=.14,$c=.14,fi=4*Ti+Wf,Ci=2*li+$c,Wt=5,su=8/(fi*Ci)*100,ou=5e3,jn=.012,Gf=ui(.15),Qy=li/2+$c/2-jn,Qi=3.5,au=.8,ru=Pe*1.4,Se=Pe*1.25,gi={kauhale:{sh:ru,sv:ru,relief:2.5,loose:!0},hale:{sh:Se,sv:Se,relief:3,jitter:.2},frame:{sh:Se,sv:Se,relief:3,jitter:.3},adobe:{sh:Se,sv:Se,relief:3,jitter:.3},cottage:{sh:Se,sv:Se,relief:3.5},store:{sh:Se,sv:Se,relief:3},block:{sh:Se,sv:Se,relief:3},bungalow:{sh:Se*.92,sv:Se*.92,relief:4},midrise:{sh:Pe,sv:Pe*.8,relief:4},house:{sh:Se*.9,sv:Se*.9,relief:6},walkup:{sh:Pe*.75,sv:Pe*.75,relief:5},tower:{sh:Pe*.48,sv:Pe*.58,relief:6},shed:{sh:Se*.9,sv:Se*.9,relief:4},church:{sh:Pe*.85,sv:Pe*.85,relief:3},spire:{sh:Se*.9,sv:Se*.9,relief:3},clock:{sh:Pe*.7,sv:Pe*.7,relief:3}},qn=Object.keys(gi),Xc=Object.fromEntries(["walkup","tower"].map(o=>[o,[(Ti-2*jn)/gi[o].sh,(li-2*jn)/gi[o].sh]])),Dt=Object.fromEntries(qn.map((o,t)=>[o,t])),t_=new Set(["church","spire","clock"]),Me={houses:1,lowrise:2,highrise:3,commercial:4,downtown:5,industrial:6,resort:7,agricultural:8,conservation:9,military:10,institutional:11,parks:12},qr={rural:2,agricultural:3,conservation:4},e_=1960,Yr=1964,Xa={[Me.downtown]:9e3,[Me.resort]:8e3,[Me.commercial]:4e3,[Me.industrial]:3500,[Me.institutional]:1500,[Me.military]:800,[Me.agricultural]:120},n_=4,i_=[1100,1200,1300,1400,1450,1600,1700],s_=.6,cu=2.5,ya=1e5,o_=232,a_=1936,r_=1800,c_=(()=>{let o=[[0]];for(let t=0;t<3;t++){const e=o.length,n=Array.from({length:2*e},()=>new Array(2*e));for(let i=0;i<e;i++)for(let s=0;s<e;s++){const a=4*o[i][s];n[i][s]=a,n[i][s+e]=a+2,n[i+e][s]=a+3,n[i+e][s+e]=a+1}o=n}return o})(),l_=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];function ja(o,t,e){const n=Math.floor(o),i=Math.floor(t),s=o-n,a=t-i,r=s*s*(3-2*s),c=a*a*(3-2*a),l=ve(n,i,e),h=ve(n+1,i,e),u=ve(n,i+1,e),f=ve(n+1,i+1,e);return l+(h-l)*r+(u-l+(l-h+f-u)*r)*c}function qa(o){let t=o>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function h_(o,t,e){let n=!1;for(let i=0,s=o.length-1;i<o.length;s=i++){const a=o[i],r=o[s];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function u_(o,t){var s,a,r,c,l,h,u;const e=o==null?void 0:o.zoning,n=((s=e==null?void 0:e.islands)==null?void 0:s[t])??(e==null?void 0:e[t])??((r=(a=o==null?void 0:o.islands)==null?void 0:a[t])==null?void 0:r.zoning)??((u=(h=(l=(c=o==null?void 0:o.islands)==null?void 0:c[t])==null?void 0:l.layers)==null?void 0:h.now)==null?void 0:u.zoning)??null;if(!n)return{zoning:null,lud:null};const i=f=>typeof f=="string"?f:(f==null?void 0:f.file)||null;return{zoning:i(n.zoning??n.now??(n.file?n:null)),lud:i(n.lud)}}async function Hf(o,t,e){var h;let n=null,i=t;const s=(h=o.params)==null?void 0:h.get("zoning");if(s)try{n=new URL(s.endsWith("/")?s:`${s}/`,location.href);const u=await fetch(new URL("layers/manifest.json",n));i=u.ok?await u.json():null}catch{i=null}const a=u_(i,e),r=async u=>{if(!u)return null;try{const f=n?new URL(`layers/${u}`,n).href:o.data.abs(`layers/${u}`);return await Co(Zn,f)}catch(f){return o.warn(`zoning ${e}: ${u}: ${f.message} (the settlements go by density and value there)`),null}},[c,l]=await Promise.all([r(a.zoning),r(a.lud)]);return{zoning:c,lud:l,files:a}}function wo(o,t,e,n){if(!o)return 0;const i=Math.floor((e-t.x0)/(t.x1-t.x0)*o.W),s=Math.floor((n-t.z0)/(t.z1-t.z0)*o.H);return i<0||s<0||i>=o.W||s>=o.H?0:o.px[s*o.W+i]}class Vf{constructor(t){this.app=t,this.sites=0}setLayers(t){var a;const e=[...t.keyframes||[]].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),n=((a=t.encoding)==null?void 0:a.settlement)||{},i=n.dMax??5e4;this.d0=n.d0??2,this.L=Math.log(1+i/this.d0),this.codec=Vc(this.d0,i),this.keyframes=e;const s=r=>{var c;return(c=e.find(l=>l.id===r))==null?void 0:c.year};this.eraYears=this.app.timeline.eras.map(r=>{var l,h;const c=(h=(l=t.eras)==null?void 0:l[r.id])==null?void 0:h.settlement;return c!=null&&c.keyframe&&s(c.keyframe)!==void 0?s(c.keyframe):c!=null&&c.from&&s(c.from)!==void 0&&s(c.to)!==void 0?s(c.from)+(s(c.to)-s(c.from))*(c.t??0):r.year}),this.lut=new Float32Array(256*8+1);for(let r=0;r<=256*8;r++)this.lut[r]=this.d0*(Math.exp(r/8/255*this.L)-1)}layerFiles(t){return this.keyframes.map(e=>{var n,i,s,a,r,c;return{settlement:((s=(i=(n=t.layers)==null?void 0:n[e.id])==null?void 0:i.settlement)==null?void 0:s.file)||null,value:((c=(r=(a=t.layers)==null?void 0:a[e.id])==null?void 0:r.value)==null?void 0:c.file)||null}})}kpAt(t){const e=this.app.timeline,n=this.eraYears,i=this.keyframes;let s=t;if(n.length>1){const a=Xt(e.sAtYear(t),0,n.length-1),r=Math.min(n.length-2,Math.floor(a));s=n[r]+(n[r+1]-n[r])*(a-r)}if(s<=i[0].year)return 0;for(let a=0;a+1<i.length;a++)if(s<=i[a+1].year)return a+(s-i[a].year)/(i[a+1].year-i[a].year);return i.length-1}sample(t,e,n,i,s){const a=this.crop,r=Xt((e-a.x0)/a.sx-.5,0,a.w-1.001),c=Xt((n-a.z0)/a.sz-.5,0,a.h-1.001),l=r|0,h=c|0,u=r-l,f=c-h,p=h*a.w+l;for(let g=0;g<t.length;g++){const v=t[g],m=v[p]+(v[p+1]-v[p])*u,d=v[p+a.w]+(v[p+a.w+1]-v[p+a.w])*u,x=m+(d-m)*f;i[g]=x>.5?x+s:0}return i}bytesAt(t,e,n){const i=(ja(t/1.7,e/1.7,71)-.5)*26+(ja(t/.55,e/.55,72)-.5)*12;return this.sample(this.bytes,t,e,n,i)}people(t){return t<=0?0:t<256?this.lut[Math.round(t*8)]:this.d0*(Math.exp(t/255*this.L)-1)}townTerm(t,e,n="island"){const i=this.keyframes,s=this.app.data.proj,a=this.crop,r=this.islandRect;this.townTerms=[],i.forEach((c,l)=>{var M,b,_,S,E,A,w,y,T,L;const h=(b=(M=t.methods)==null?void 0:M[c.id])==null?void 0:b.settlement;if(c.year<r_||!h||(_=h.towns)!=null&&_.length)return;const u=i.slice(l+1).find(I=>{var R,k,F,G;return(G=(F=(k=(R=t.methods)==null?void 0:R[I.id])==null?void 0:k.settlement)==null?void 0:F.towns)==null?void 0:G.length}),f=(S=h.populations)==null?void 0:S[e];if(!u||!Number.isFinite(f))return;const p=t.methods[u.id].settlement,g=p.towns.map(I=>({...I,xz:s.toWorld([I.lon,I.lat])})).filter(I=>I.xz[0]>r.x0&&I.xz[0]<r.x1&&I.xz[1]>r.z0&&I.xz[1]<r.z1&&(I.share||0)>0);if(!g.length)return;const v=(L=(T=(y=(w=(A=(E=t.islands)==null?void 0:E[e])==null?void 0:A.layers)==null?void 0:w[u.id])==null?void 0:y.settlement)==null?void 0:T.stats)==null?void 0:L.people;for(const I of g){let R=1;if(n==="district"){const k=(p.districts||[]).find(F=>F.name===I.district);R=k&&v?Xt(k.pop/v,.05,1):.25}I.people=f*(I.share||0)*R}const m=Math.min(.9,g.reduce((I,R)=>I+R.people,0)/f),d=Float32Array.from(this.bytes[l]),x=new Float32Array(a.w*a.h);for(const I of g){const R=(I.sigma||1500)/1e3,k=4*R*1e3/100,F=Xt(Math.floor((I.xz[0]-k-a.x0)/a.sx),0,a.w-1),G=Xt(Math.ceil((I.xz[0]+k-a.x0)/a.sx),0,a.w-1),W=Xt(Math.floor((I.xz[1]-k-a.z0)/a.sz),0,a.h-1),K=Xt(Math.ceil((I.xz[1]+k-a.z0)/a.sz),0,a.h-1),H=I.people/(2*Math.PI*R*R);for(let et=W;et<=K;et++)for(let ct=F;ct<=G;ct++){const Q=a.x0+(ct+.5)*a.sx,nt=a.z0+(et+.5)*a.sz,dt=((Q-I.xz[0])**2+(nt-I.xz[1])**2)/100;x[et*a.w+ct]+=H*Math.exp(-dt/(2*R*R))}}for(let I=0;I<d.length;I++){if(d[I]<=0&&x[I]<=0||d[I]<=0)continue;const R=this.codec.decode(d[I])*(1-m)+x[I];d[I]=255*Math.log(1+Math.max(0,R)/this.d0)/this.L}this.bytes[l]=d,this.townTerms.push({keyframe:c.id,from:u.id,towns:g.map(I=>I.name),people:Math.round(f*m)})})}years(t){const e=this.app.timeline,n=e.yearAt(0),i=e.yearAt(e.max),s=new Set([...t].filter(c=>c>n&&c<=i)),a=this.keyframes[0].year,r=new Set([n,...i_.filter(c=>c>n&&c<a),...s]);for(let c=a;c<=i;c+=n_)r.add(c);r.add(i),this.Ys=[...r].filter(c=>c>=n&&c<=i).sort((c,l)=>c-l),this.isBreak=this.Ys.map(c=>s.has(c)),this.edges=[...s].sort((c,l)=>c-l),this.epochAt=this.Ys.map(c=>this.epochOfYear(c)),this.samples=this.Ys.map(c=>{const l=this.kpAt(c),h=Math.min(this.keyframes.length-2,Math.floor(l)),u=[1820,1860,1900,1960].map(p=>ce(p-10,p+10,c)),f=[1-u[0],u[0]-u[1],u[1]-u[2],u[2]-u[3],u[3]];return{y:c,a:h,t:l-h,early:25.5*(1-ce(Ki[0],Ki[1],c)),w:f}})}epochOfYear(t){const e=this.edges;let n=0;for(;n<e.length&&t>=e[n];)n++;return n}fill(t,e){const n=Math.min(.08333333333333333,e/(8*su)),i=t.w,s=e/ou;let a=0;return i[1]&&(a+=i[1]*Math.min(.8,Math.max(s,.8*(e/700)**2))),i[2]&&(a+=i[2]*Math.min(.9,Math.max(s,.9*(e/1300)**2.5))),i[3]&&(a+=i[3]*Math.min(.9,Math.max(s,.9*(e/2500)**1.5))),i[4]&&(a+=i[4]*(e<6e3?Math.min(.85,Math.max(s,.85*(e/6e3)**1.2)):.85-.45*ce(6e3,15e3,e))),[a,n]}fillMax(t){return Math.max(4*Math.min(1/12,t/(8*su)),Math.min(.9,t/ou),Math.min(.8,.8*(t/700)**2),Math.min(.9,.9*(t/1300)**2.5),Math.min(.9,.9*(t/2500)**1.5),Math.min(.85,.85*(t/6e3)**1.2))}valueAt(t,e,n){if(t.vb)return Xt((t.vb[e.a]+(t.vb[e.a+1]-t.vb[e.a])*e.t)/255,0,1);const i=ce(1.5,4,Math.log10(Math.max(1,n))),s=ce(1800,2e3,e.y);return Xt(.34*i+.14*t.coast+.16*t.harbour+.22*t.centre+.1*s+.24*(t.r8-.5),0,1)}kindAt(t,e,n,i,s){const a=Xt(Math.log10(Math.max(1,e)/300),-1,1),r=t-i.lag*(1-.6*Math.max(0,a));if(t<1818||r<1820)return s?Dt.kauhale:Dt.hale;const c=ce(.35,.8,n);if(r<1860){const u=(1-ce(1820,1880,r+12*a))*(1.15-.6*c);return i.r2<u?Dt.hale:i.r3<.15+.5*c?Dt.adobe:Dt.frame}if(r<1900){if(e>1150&&i.r3<.3||e>450&&i.r3<.42*ce(.6,.9,n))return Dt.block;if(e>700&&i.r3<.55||e>250&&i.r3<.6*ce(.5,.8,n))return Dt.store;const u=(1-ce(1820,1880,r+12*a))*(1.2-.8*c);return i.r2<u?Dt.hale:i.r4<.2?Dt.frame:Dt.cottage}if(r<1960)return e>4e3&&i.r3<.5||e>2e3&&i.r3<.45*ce(.65,.95,n)?Dt.midrise:e>1800&&i.r3<.6||e>700&&i.r3<.5*ce(.55,.85,n)?Dt.block:(e>900&&i.r3<.4||e>400&&i.r3<.4*ce(.5,.8,n))&&r<1935?Dt.store:Dt.bungalow;const l=i.zone;if(t>=Yr&&i.lud===qr.conservation)return-1;if(l)return this.zoneKind(l,r,e,n,i);if(t>=Yr&&i.lud===qr.agricultural)return i.r3<.4?Dt.shed:Dt.house;if(t>=Yr&&i.lud===qr.rural)return Dt.house;const h=i.zoned?Dt.walkup:Dt.tower;return i.core?h:e>2e4?i.r3<.85?h:Dt.walkup:e>1e4?i.r3<.2+.5*ce(1e4,2e4,e)+.2*c?h:Dt.walkup:e>4e3?i.r3<.45+.2*c?i.r5<.25*ce(.7,.95,n)?h:Dt.walkup:Dt.house:e>2500&&i.r3<.2+.15*c?Dt.walkup:i.r4<.35&&r<1990?Dt.bungalow:Dt.house}zoneKind(t,e,n,i,s){const a=ce(.35,.8,i);switch(t){case Me.houses:return s.r4<.35&&e<1990?Dt.bungalow:Dt.house;case Me.lowrise:return s.r3<.55+.35*a?Dt.walkup:Dt.house;case Me.highrise:return s.r3<.3+.45*ce(4e3,2e4,n)+.2*a?Dt.tower:Dt.walkup;case Me.commercial:return n>4e3&&s.r3<.25+.45*a?Dt.midrise:n<2e3&&s.r4<.35-.25*a?Dt.store:Dt.block;case Me.downtown:return s.core||n>6e3&&s.r3<.25+.5*ce(6e3,15e3,n)+.2*a?Dt.tower:n>5e3&&s.r4<.3+.4*a?Dt.midrise:n<5e3&&s.r4<.55-.3*a?Dt.store:Dt.block;case Me.industrial:case Me.military:return Dt.shed;case Me.resort:return s.r3<.15+.45*ce(.5,.9,i)+.35*ce(4e3,15e3,n)?Dt.tower:Dt.walkup;case Me.agricultural:return Dt.shed;case Me.institutional:return n>3e3&&s.r3<.3*a?Dt.midrise:Dt.block;case Me.conservation:case Me.parks:return-1;default:return Dt.house}}variantOf(t,e,n){return e===Dt.tower&&t.zone===Me.resort&&t.r6<.75?0:Math.min(n-1,Math.floor(ve(t.tile,e,Math.floor(t.rank*1e6))*n))}towerHeight(t){return 35+115*ce(4,4.7,Math.log10(Math.max(1,t)))}byteAt(t,e){return t.b[e.a]+(t.b[e.a+1]-t.b[e.a])*e.t-e.early}fillByte(t,e,n){const i=t.zone&&e.w[4]>0&&e.y>=e_?Xa[t.zone]:0;if(!i)return n;const s=255*Math.log(1+i/this.d0)/this.L+10*(t.r6-.5);return s>n?n+(s-n)*e.w[4]:n}scatterLot(t,e,n,i){var h,u;const s=this.Ys.length,a=this.samples,r=new Map;let c=null;const l=f=>{const p=this.instance(t,c,f);if(Array.isArray(p))for(const g of p)i(g);else i(p);c=null};t.core=!1,t.anchor&&(t.yard=new Uint8Array(s));for(let f=0;f<s;f++){const p=a[f];let g=null,v=this.byteAt(t,p);const m=t.core&&p.y>=1960&&(t.zoned?t.zone===Me.downtown||t.zone===Me.highrise:!0);m&&(v=Math.max(v,o_+14*t.r6));const d=this.fillByte(t,p,v),x=(u=(h=t.host)==null?void 0:h.yard)==null?void 0:u[f];if(d>0&&!x){const M=this.people(v),[b,_]=this.fill(p,this.people(d)),S=n(f),E=!!t.anchor&&t.rankY<4*_*t.w*S,A=this.valueAt(t,p,M);let w=-1;if((m||t.rank<b*t.w*S||E)&&(w=this.kindAt(p.y,M,A,t,E)),w===Dt.kauhale&&!E&&(w=Dt.hale),w>=0&&w!==Dt.kauhale&&!(m||t.rank<b*t.w*S)&&(w=-1),w>=0){const y=w===Dt.kauhale?Vr.length:this.kits[qn[w]].length,T=this.variantOf(t,w,y),L=this.epochAt[f],I=w*16+T;let R=r.get(I*256+255);if(R===void 0&&(R=r.get(I*256+L)),R===void 0){const k=this.pose(t,w,T),F=gi[qn[w]].relief;let G=!1;if(k.parts){R=[];for(const W of k.parts){const K=e(W,F,L);if(G||(G=this.dep),K===null){R=null;break}R.push(K)}}else R=e(k,F,L),G=this.dep;r.set(I*256+(G?L:255),R)}R!==null&&(g={key:I,kind:w,variant:T,top:R,d:M},w===Dt.kauhale&&(t.yard[f]=1)),g&&w===Dt.midrise&&p.y<=a_&&(t.core=!0)}}if(c&&g&&g.key===c.key){c.d=Math.max(c.d,g.d);continue}c&&l(f),g&&(c={...g,n0:f})}c&&l(s)}fitOf(t,e){const n=t*16+e;this.fits??(this.fits=new Map);let i=this.fits.get(n);if(i!==void 0)return i;const s=qn[t],a=gi[s];if(t_.has(s))i=1;else if(a.loose){let r=0,c=0;for(const[l,h,u,f]of Vr[e]){const p=this.kits[s][f];for(const g of[-.2,.2]){const v=Math.cos(u+g),m=Math.sin(u+g),d=Math.cos(g),x=Math.sin(g),M=l*d+h*x,b=-l*x+h*d;r=Math.max(r,Math.abs(M)+Math.abs(p.hx*v)+Math.abs(p.hz*m)),c=Math.max(c,Math.abs(b)+Math.abs(p.hx*m)+Math.abs(p.hz*v))}}i=Math.min(1,(Ti-jn)/(r*a.sh),(li-jn)/(c*a.sh))}else{const r=this.kits[s][e],[c,l,h,u]=r.box,f=(a.jitter||0)/2,p=Math.cos(f),g=Math.sin(f),v=Math.max(-c,l)*p+Math.max(-h,u)*g,m=-h*p+Math.max(-c,l)*g,d=u*p+Math.max(-c,l)*g,x=a.jitter?.03:0;i=Math.min(1,(Ti/2-jn-x)/(v*a.sh),(li/2-jn-x)/(m*a.sh),(Qy-x)/(d*a.sh))}return this.fits.set(n,i),i}pose(t,e,n){const i=qn[e],s=gi[i],a=this.fitOf(e,n);let r=t.x,c=t.z,l=t.face;if(s.loose){const g=s.sh*a;r=t.x+Ti/2*t.e[0]+li/2*t.m[0],c=t.z+Ti/2*t.e[1]+li/2*t.m[1],l=Math.atan2(t.e[0],t.e[1])-Math.PI/2+(t.r7-.5)*.4+(t.r5<.5?0:Math.PI);const v=Math.cos(l),m=Math.sin(l),d=Vr[n].map(([x,M,b,_])=>{const S=this.kits[i][_];return{x:r+(x*v+M*m)*g,z:c+(-x*m+M*v)*g,a:l+b,size:_,ax:S.hx*g,az:S.hz*g,f:a}});return{x:r,z:c,a:l,parts:d,f:a}}const h=this.kits[i][n];s.jitter&&(l+=(t.r5-.5)*s.jitter,r+=(t.r6-.5)*.06,c+=(t.r7-.5)*.06);const u=Xc[i],f=u?Math.max(h.hx*s.sh*a,Ti/2-jn):h.hx*s.sh*a,p=u?Math.max(h.hz*s.sh*a,li/2-jn):h.hz*s.sh*a;return{x:r,z:c,a:l,ax:f,az:p,f:a}}instance(t,e,n){const i=this.Ys,s=i.length,a=qn[e.kind],r=gi[a],c=t.landmark?{x:t.x,z:t.z,a:t.face,f:1}:this.pose(t,e.kind,e.variant),l=new Float32Array(4),h=g=>{const v=i[g-1],m=i[g],d=Math.min(s_,(m-v)/2),x=v+d+ve(t.tile??0,g,Math.floor((t.rank??0)*1e6))*(m-v-2*d);return[x-d,x+d]};e.n0===0?(l[0]=-ya,l[1]=-ya+1):this.isBreak[e.n0]||t.landmark?(l[0]=i[e.n0],l[1]=i[e.n0]+cu):[l[0],l[1]]=h(e.n0),n>=s?(l[2]=ya,l[3]=ya+1):this.isBreak[n]?(l[2]=i[n]-cu,l[3]=i[n]-.01):[l[2],l[3]]=h(n);const u=a==="tower"?this.towerHeight(e.d)/Xi:1,f=.94+.12*(t.r5??.5),p=(g,v,m)=>{const d=this.kits[a][v],x=g.f??c.f??1;return{kind:e.kind,variant:v,site:this.sites,x:g.x,z:g.z,a:g.a,y:ui(m)+Gf,sh:r.sh*x,sv:r.sv*x*u,stretch:u,span:l,colour:[f*(.98+.04*(t.r6??.5)),f,f*(.98+.04*(t.r7??.5))],rx:d.hx*r.sh*x*.95,rz:d.hz*r.sh*x*.95,landmark:!!t.landmark}};return this.sites++,c.parts?c.parts.map((g,v)=>p(g,g.size,e.top[v])):p(c,e.variant,e.top)}tileLots(t,e,n,i,s,a){const r=[Math.cos(n),Math.sin(n)],c=[-r[1],r[0]];let l=1/0,h=-1/0,u=1/0,f=-1/0;for(const[m,d]of[[t,e],[t+Wt,e],[t,e+Wt],[t+Wt,e+Wt]]){const x=m*c[0]+d*c[1],M=m*r[0]+d*r[1];l=Math.min(l,x),h=Math.max(h,x),u=Math.min(u,M),f=Math.max(f,M)}const p=.42,g=(m,d)=>m>=t&&m<t+Wt&&d>=e&&d<e+Wt&&!(s[0]&&m<t+p||s[1]&&m>=t+Wt-p||s[2]&&d<e+p||s[3]&&d>=e+Wt-p),v=[];for(let m=Math.floor(u/Ci)-1;m<=Math.ceil(f/Ci);m++)for(let d=Math.floor(l/fi)-1;d<=Math.ceil(h/fi);d++)for(let x=0;x<2;x++){const M=[[0,0],[1,0],[0,1],[1,1]].map(([S,E])=>{const A=2*x+S,w=d*fi+Wf/2+(A+.5)*Ti,y=m*Ci+$c/2+(E+.5)*li,T=w*c[0]+y*r[0],L=w*c[1]+y*r[1];return{iu:A,iv:E,u:w,v:y,x:T,z:L,ok:g(T,L)&&a(T,L)}}),b=M.every(S=>S.ok);let _=null;for(const S of M){if(!S.ok)continue;const{iu:E,iv:A,u:w,v:y,x:T,z:L}=S,I=d*4+E,R=m*2+A,k=(c_[R&7][I&7]+ve(I,R,i*7+1))/64,F=K=>ve(I,R,i*7+K),G=A===0?[-r[0],-r[1]]:r,W={x:T,z:L,rank:k,face:Math.atan2(G[0],G[1]),tile:i,bu:d,bv:m,u:w,v:y,e:c,m:r,lag:25*F(2),r2:F(3),r3:F(4),r4:F(5),r5:F(6),r6:F(7),r7:F(8),r8:F(9)};if(S===M[0]&&b){const K=d*2+x;W.anchor=!0,W.rankY=(l_[m&3][K&3]+ve(K,m,i*7+11))/16,_=W}else _&&(W.host=_);v.push(W)}}return v}}function $f(o,t,e,n,i){var r,c;let s=t.metresAt(e,n);const a=(c=(r=o.patches)==null?void 0:r.byPack)==null?void 0:c.get(t.pack.id);if(!a)return s;for(const l of a){if(!(i<l.until))continue;const h=l.box,u=(e-h[0])/(h[2]-h[0]),f=(n-h[1])/(h[3]-h[1]);if(u<0||f<0||u>1||f>1)continue;const p=o.patches.maskAt(l.crop,u,f);p>0&&(s+=((l.kind==="raise"?Math.max(s,l.depthM):Math.min(s,l.depthM))-s)*p)}return s}function Xf(o,t){const e=o.data.proj,n=o.data.places||[],i=[],s=[],a=Object.values(t.methods||{}).flatMap(r=>{var c;return((c=r==null?void 0:r.settlement)==null?void 0:c.towns)||[]});for(const r of a){if(!Number.isFinite(r.lon)||!Number.isFinite(r.lat))continue;const[c,l]=e.toWorld([r.lon,r.lat]);i.push({x:c,z:l,s:(r.sigma||1e3)/100})}for(const r of n){if(r.kind!=="town"&&r.kind!=="bay")continue;const c=fn(r.geometry);if(!c)continue;const[l,h]=e.toWorld(c);r.kind==="town"&&i.push({x:l,z:h,s:8}),s.push({x:l,z:h,town:r.kind==="town"})}return{cores:i,harbours:s}}function jf(o,t,e,n){let i=0;for(const a of o.cores){const r=(t-a.x)**2+(e-a.z)**2;r>16*a.s*a.s||(i=Math.max(i,Math.exp(-r/(2*a.s*a.s))))}let s=0;for(const a of o.harbours){const r=Math.hypot(t-a.x,e-a.z);r>60||(s=Math.max(s,Math.exp(-r/15)*(a.town?n:1)))}return{centre:i,harbour:s}}const f_=8e3,lu=8e3,Cn=3,qf=o=>Xt(o*2.6,40,110),d_=[1850,1875,1900,1930,1960,2e3],p_=.1,m_=1;class g_ extends Vf{constructor(t,e,n,i,s){super(t),this.districts=e,this.rec=n,this.own=i,this.ribbons=s,this.group=new Ge,this.group.name="settlements",this.group.visible=!1,this.ready=!1,this.failed=null,this.yearNow=t.timeline.year,i.uYearNow.value=this.yearNow,this.drawn=0,this.streamLines=n.data.streams,this.load().catch(a=>{this.failed=a.message,t.warn(`settlements: ${a.message} (the scatter is not drawn)`)})}async load(){var w;const t=performance.now(),e=this.app.data,n=await fetch(e.abs("layers/manifest.json"));if(!n.ok)throw new Error(`layers/manifest.json: HTTP ${n.status}`);const i=await n.json(),s=this.rec.d,a=(w=i.islands)==null?void 0:w[s.parent],r=this.app.world.islandPacks.find(y=>y.id===s.parent);if(!a||!r)throw new Error(`no settlement layer for ${s.parent}`);this.setLayers(i);const c=this.layerFiles(a);if(this.keyframes.length<2||c.some(y=>!y.settlement))throw new Error("the settlement layer lacks a keyframe");const l=y=>Co(Zn,e.abs(`layers/${y}`)),[h,u,f]=await Promise.all([Promise.all(c.map(y=>l(y.settlement))),c.every(y=>y.value)?Promise.all(c.map(y=>l(y.value))).catch(()=>null):null,Hf(this.app,i,s.parent)]);for(const[y,T]of[...h,...u||[]].entries())if(T.W!==r.W||T.H!==r.H)throw new Error(`a layer of ${s.parent} is ${T.W}×${T.H} (${y}), the pack ${r.W}×${r.H}`);const p=r.rect,g=s.rect,v=(p.x1-p.x0)/r.W,m=(p.z1-p.z0)/r.H,d=Xt(Math.floor((g.x0-p.x0)/v)-2,0,r.W-1),x=Xt(Math.ceil((g.x1-p.x0)/v)+2,0,r.W-1),M=Xt(Math.floor((g.z0-p.z0)/m)-2,0,r.H-1),b=Xt(Math.ceil((g.z1-p.z0)/m)+2,0,r.H-1),_=x-d+1,S=b-M+1;this.crop={x0:p.x0+d*v,z0:p.z0+M*m,sx:v,sz:m,w:_,h:S},this.islandRect=p;const E=y=>{const T=new Float32Array(_*S);for(let L=0;L<S;L++)for(let I=0;I<_;I++)T[L*_+I]=y.px[(M+L)*r.W+d+I];return T};this.bytes=h.map(E),this.values=u?u.map(E):null,this.zoning={...f,rect:p},this.places=Xf(this.app,i),this.townTerm(i,s.parent,"island"),this.loadMs=Math.round(performance.now()-t);const A=performance.now();await this.build()&&(this.buildMs=Math.round(performance.now()-A),this.ready=!0)}async breathe(t=!1){return(t||performance.now()-this.slice>24)&&(await new Promise(e=>setTimeout(e,0)),this.slice=performance.now()),!this.disposed}patchState(t){var r;const e=this.rec,n=e.raise.map(c=>({k:t<c.until?1:0,depth:c.depth})),i=((r=e.pmap)==null?void 0:r.groups)||[0],s=new Float32Array(16),a=new Float32Array(16).fill(-1);for(let c=0;c<i.length;c++){const l=i[c]||0;let h=-1;e.lower.forEach((u,f)=>{l&1<<f&&(h<0&&(h=f),t<u.until&&s[c]<1&&(s[c]=1,a[c]=u.depth))}),!s[c]&&h>=0&&(a[c]=e.lower[h].depth)}return{raise:n,gk:s,gd:a}}groundAt(t,e,n){const i=this.rec,s=i.d.W,a=e*s+t;let r=i.metres[a];const c=this.districts.patchAt(t,e);if(c&&c[1]+c[3]>0){const h=n.raise[c[2]&15],u=n.raise[c[2]>>4];h&&(r+=(Math.max(r,h.depth)-r)*(c[1]/255)*h.k),u&&(r+=(Math.max(r,u.depth)-r)*(c[3]/255)*u.k)}const l=i.aux[a*4];if(l){const h=c?c[0]:0;r=Wc(r,l,n.gk[h],sr(i.carve[a*2]),n.gd[h])}return r}texelOf(t,e){const n=this.rec.d,i=n.rect;return[Xt(Math.floor((t-i.x0)/(i.x1-i.x0)*n.W),0,n.W-1),Xt(Math.floor((e-i.z0)/(i.z1-i.z0)*n.H),0,n.H-1)]}edgeAt(t,e){const n=this.rec.d.rect;return Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e)}allows(t,e,n,i,s,a,r){const c=this.epochs[r],l=this.rec,h=l.aux,u=l.d.W,f=Math.cos(s),p=-Math.sin(s),g=[f,p],v=[-p,f];let m=1/0,d=-1/0,x=-1/0;this.dep=!1;const M=l.parent,b=Ee.margin;for(let _=0;_<13;_++){const S=_===0?0:_<5?[-1,1,1,-1][_-1]:_<9?[0,1,0,-1][_-5]:[-1,1,1,-1][_-9],E=_===0?0:_<5?[-1,-1,1,1][_-1]:_<9?[-1,0,1,0][_-5]:[-1,-1,1,1][_-9],A=_>=9?1.25:1,w=t+(g[0]*S*n+v[0]*E*i)*A,y=e+(g[1]*S*n+v[1]*E*i)*A,[T,L]=this.texelOf(w,y),I=L*u+T,R=h[I*4+3];if(R>0&&h[I*4+1]>0&&(this.dep=!0,c.features.has(R)))return null;if(_>=9)continue;if(this.streamNear(w,y))return null;(h[I*4]||this.districts.patchAt(T,L))&&(this.dep=!0);let k=this.groundAt(T,L,c.state);if(k<.6)return null;const F=l.metres[I];m=Math.min(m,F),d=Math.max(d,F);const G=this.edgeAt(w,y);if(M&&G<b){const W=ce(Ee.band,b,G);k=Math.max(k,$f(this.app,M,w,y,c.year)*(1-W)+k*W),this.dep=!0}x=Math.max(x,k)}if(d-m>a)return null;for(const _ of this.landmarks)if(!(Math.hypot(t-_.x,e-_.z)>=_.r+Math.max(n,i)+jn)&&(this.dep=!0,c.year>=_.from))return null;return x}grounds(){const e=this.rec.d,n=e.rect,i=4,s=Math.ceil(e.W/i),a=Math.ceil(e.H/i),r=this.patchState(1800),c=new Uint8Array(s*a);for(let _=0;_<a;_++)for(let S=0;S<s;S++)c[_*s+S]=this.groundAt(Math.min(e.W-1,S*i+2),Math.min(e.H-1,_*i+2),r)<=0?1:0;const l=e.mx*i,h=e.mz*i,u=hn(s,a,_=>c[_]===1,l,h);this.sea={w:s,h:a,k:i,a:Float32Array.from(u)};const f=zn(Float32Array.from(u,_=>Math.min(_,3e3)),s,a,12,3);this.broad={w:s,h:a,a:f};const p=2,g=Math.ceil(e.W/p),v=Math.ceil(e.H/p),m=new Uint8Array(g*v),d=this.streamLines,x=_=>Xt(Math.floor((_-n.x0)/(n.x1-n.x0)*g),0,g-1),M=_=>Xt(Math.floor((_-n.z0)/(n.z1-n.z0)*v),0,v-1);for(let _=0;d&&_<d.length;){const S=d[_++];for(let E=0;E<S;E++,_+=3){if(E+1>=S)continue;const[A,w,y,T]=[d[_],d[_+1],d[_+3],d[_+4]],L=Math.max(1,Math.ceil(Math.hypot(y-A,T-w)/.05));for(let I=0;I<=L;I++)m[M(w+(T-w)*I/L)*g+x(A+(y-A)*I/L)]=1}}const b=hn(g,v,_=>m[_]===1,e.mx*p,e.mz*p);this.stream={w:g,h:v,a:Float32Array.from(b)},this.streamLines=null}coarse(t,e,n){const i=this.rec.d.rect,s=Xt(Math.floor((e-i.x0)/(i.x1-i.x0)*t.w),0,t.w-1),a=Xt(Math.floor((n-i.z0)/(i.z1-i.z0)*t.h),0,t.h-1);return t.a[a*t.w+s]}streamNear(t,e){return this.coarse(this.stream,t,e)<9}mauka(t,e){const n=this.broad,i=this.rec.d.rect,s=(t-i.x0)/(i.x1-i.x0)*n.w,a=(e-i.z0)/(i.z1-i.z0)*n.h,r=(g,v)=>n.a[Xt(v,0,n.h-1)*n.w+Xt(g,0,n.w-1)],c=Math.round(s),l=Math.round(a),h=10,u=r(c+h,l)-r(c-h,l),f=r(c,l+h)-r(c,l-h);if(Math.hypot(u,f)<.001)return Math.PI/2;const p=Math.PI/60;return Math.round(Math.atan2(f,u)/p)*p}weight(t,e){const[n,i]=this.texelOf(t,e),s=this.rec.d,a=this.rec.metres,r=(h,u)=>a[Xt(u,0,s.H-1)*s.W+Xt(h,0,s.W-1)],c=Math.hypot((r(n+2,i)-r(n-2,i))/(4*s.mx),(r(n,i+2)-r(n,i-2))/(4*s.mz));return(.55+.8*Math.max(Math.exp(-this.coarse(this.sea,t,e)/700),Math.exp(-this.coarse(this.stream,t,e)/160)))*(1-.6*ce(.08,.35,c))}epochYears(){const t=this.rec,e=new Set;for(const s of[...t.raise,...t.lower])e.add(s.until);for(const[,s]of t.d.byIndex){const[a,r]=ko(s.properties);Number.isFinite(a)&&e.add(a),Number.isFinite(r)&&e.add(r+1)}for(const s of this.landmarks)e.add(s.from);this.years(e);const i=this.app.timeline.yearAt(0);this.epochs=[];for(let s=0;s<=this.edges.length;s++){const a=s===0?i:this.edges[s-1],r=new Set;for(const[c,l]of t.d.byIndex)Uo(l.properties,a)&&r.add(c);this.epochs.push({year:a,state:this.patchState(a),features:r})}}async build(){const n=this.rec.d.rect,i=qa(1820);this.times={},this.slice=performance.now();let s=performance.now(),a=0;const r=x=>{this.times[x]=Math.round(a+performance.now()-s),a=0,s=performance.now()},c=async()=>{const x=performance.now(),M=await this.breathe();return performance.now()-x>1&&(a+=x-s,s=performance.now()),M};if(this.kits=Bf(i,Xc),r("kits"),this.grounds(),r("grounds"),!await c())return!1;const l=[],h=Math.ceil((n.x1-n.x0)/Wt),u=Math.ceil((n.z1-n.z0)/Wt),f=new Float32Array(h*u);for(let x=0;x<u;x++)for(let M=0;M<h;M++)f[x*h+M]=this.mauka(n.x0+(M+.5)*Wt,n.z0+(x+.5)*Wt);const p=(x,M)=>x<0||M<0||x>=h||M>=u?NaN:f[M*h+x],g=new Float32Array(this.keyframes.length),v=new Float32Array(this.keyframes.length),m=Qi+au,d=this.zoning;for(let x=0;x<u;x++){if(!await c())return!1;for(let M=0;M<h;M++){const b=n.x0+M*Wt,_=n.z0+x*Wt,S=f[x*h+M],E=[p(M-1,x)!==S,p(M+1,x)!==S,p(M,x-1)!==S,p(M,x+1)!==S],A=x*h+M,w=(y,T)=>this.edgeAt(y,T)>=m;for(const y of this.tileLots(b,_,S,A,E,w)){this.bytesAt(y.x,y.z,g);let T=0;for(const F of g)T=Math.max(T,F);y.zone=wo(d.zoning,d.rect,y.x,y.z),y.lud=wo(d.lud,d.rect,y.x,y.z),y.zoned=!!d.zoning;const L=Xa[y.zone];L&&(T=Math.max(T,255*Math.log(1+L/this.d0)/this.L+5));const I=this.fillMax(this.people(T));if(y.rank>=I*1.5&&!(y.anchor&&y.rankY<I*1.5)||(y.w=this.weight(y.x,y.z)*(.85+.3*ja(y.x/2.3,y.z/2.3,73)),y.rank>=I*y.w&&!(y.anchor&&y.rankY<I*y.w)))continue;y.b=Float32Array.from(g),this.values&&(y.vb=Float32Array.from(this.sample(this.values,y.x,y.z,v,0)));const R=Math.exp(-this.coarse(this.sea,y.x,y.z)/600),k=jf(this.places,y.x,y.z,R);y.coast=R,y.harbour=k.harbour,y.centre=k.centre,l.push(y)}}}return this.lotCount=l.length,this.gridTiles={nx:h,nz:u},this.ths=f,r("lots"),this.landmarks=[],this.epochYears(),this.placeLandmarks(l),this.landmarks.length&&this.epochYears(),r("landmarks"),!await this.scatter(l,c)||(r("scatter"),this.meshes(),r("meshes"),!await this.streets(c))?!1:(r("streets"),this.instances=null,this.clearing(),!0)}placeLandmarks(t){const e=new Map((this.app.data.places||[]).map(M=>[M.id,M])),n=this.app.data.proj,i=this.keyframes,s=M=>i.findIndex(b=>b.year>=M),a=(M,b,_,S,E,A)=>{const w=this.kits[M][0],y=gi[M],T=this.epochOfYear(E);if(this.edgeAt(b,_)<Qi+au)return!1;const L=this.allows(b,_,w.hx*y.sh,w.hz*y.sh,S,y.relief+2,T);return L===null?!1:(this.landmarks.push({kind:M,name:A,x:b,z:_,face:S,from:E,r:Math.hypot(w.hx,w.hz)*y.sh,top:L}),!0)},r=(M,b)=>{let _=null,S=1/0;for(const E of t){const A=Math.hypot(E.x-M,E.z-b);A<S&&(S=A,_=E)}return _},c=(M,b)=>this.people(M.b[b]),l=Math.max(0,s(1853)),h=Math.max(0,s(1896)),u=e.get("kawaiahao"),f=u?n.toWorld(fn(u.geometry)):null,p=f&&this.edgeAt(f[0],f[1])>=0,g=p?"Kawaiahaʻo":null;let v=!!u&&!p;if(p){const M=r(f[0],f[1]);v=a("church",f[0],f[1],M?M.face:0,1842,g)}if(!v){const M=this.crop,b=this.bytes[l];let _=-1,S=0,E=0;for(let w=0;w<M.h;w++)for(let y=0;y<M.w;y++)b[w*M.w+y]<=_||(_=b[w*M.w+y],S=M.x0+(y+.5)*M.sx,E=M.z0+(w+.5)*M.sz);const A=[...t].sort((w,y)=>Math.hypot(w.x-S,w.z-E)-Math.hypot(y.x-S,y.z-E));for(const w of A.slice(0,200))if(v=a("church",w.x,w.z,w.face,1842,g))break}const m=[...t].sort((M,b)=>c(b,h)-c(M,h));let d=0;for(const M of m){if(d>=2)break;if(this.landmarks.some(_=>Math.hypot(_.x-M.x,_.z-M.z)<9))continue;let b=null;for(const _ of this.samples){if(_.y<1840)continue;const S=M.b[_.a]+(M.b[_.a+1]-M.b[_.a])*_.t;if(this.people(S)>500){b=_.y;break}}b!==null&&a(b<1860?"church":"spire",M.x,M.z,M.face,b,null)&&d++}const x=e.get("aloha-tower");if(x){const[M,b]=n.toWorld(fn(x.geometry)),_=r(M,b);a("clock",M,b,_?_.face:0,1926,x.name)}}async scatter(t,e){const n=this.Ys.length,i=this.samples,s=new Float64Array(n);for(let h=0;h<t.length;h++){if(h%512===0&&!await e())return!1;const u=t[h];for(let f=0;f<n;f++){const p=i[f],g=this.fillByte(u,p,this.byteAt(u,p));if(g<=0)continue;const[v,m]=this.fill(p,this.people(g));(u.rank<v*u.w||u.anchor&&u.rankY<4*m*u.w)&&s[f]++}}this.cap=Array.from(s,h=>Math.min(1,f_/Math.max(1,h)));const a=[],r=(h,u,f)=>this.allows(h.x,h.z,h.ax,h.az,h.a,u,f),c=h=>this.cap[h],l=h=>a.push(h);for(let h=0;h<t.length;h++){if(h%256===0&&!await e())return!1;this.scatterLot(t[h],r,c,l)}for(const h of this.landmarks){const u=this.Ys.findIndex(f=>f>=h.from);a.push(this.instance({x:h.x,z:h.z,face:h.face,landmark:!0,r5:.5,r6:.5,r7:.5},{kind:Dt[h.kind],variant:0,top:h.top,d:0,n0:Math.max(0,u)},n))}return this.instances=a,!0}weightAt(t,e){const n=this.spans;return ce(n[t*4],n[t*4+1],e)*(1-ce(n[t*4+2],n[t*4+3],e))}meshes(){const t=this.rec.d.rect;this.material=To(this.app.shared,this.own,{fade:[50,70],grow:!0}),this.variants=[];const e=new Map;for(const g of qn)this.kits[g].forEach((v,m)=>{e.set(Dt[g]*16+m,this.variants.length),this.variants.push({name:g,v:m,kit:v,n:0})});const n=this.instances.length;this.N=n,this.vOf=new Uint16Array(n),this.mats=new Float32Array(n*16),this.spans=new Float32Array(n*4),this.stretches=new Float32Array(n),this.cols=new Float32Array(n*3),this.ix=new Float32Array(n),this.iz=new Float32Array(n),this.ia=new Float32Array(n),this.iy=new Float32Array(n),this.irx=new Float32Array(n),this.irz=new Float32Array(n),this.isv=new Float32Array(n),this.ish=new Float32Array(n),this.ikind=new Uint8Array(n),this.ivar=new Uint8Array(n),this.isite=new Int32Array(n),this.iland=new Uint8Array(n);const i=new se,s=new Di,a=new B(0,1,0),r=new B,c=new B;this.instances.forEach((g,v)=>{const m=e.get(g.kind*16+g.variant);this.vOf[v]=m,this.variants[m].n++,s.setFromAxisAngle(a,g.a),r.set(g.x,g.y,g.z),c.set(g.sh,g.sv,g.sh),i.compose(r,s,c),i.toArray(this.mats,v*16),this.spans.set(g.span,v*4),this.stretches[v]=g.stretch,this.cols.set(g.colour,v*3),this.ix[v]=g.x,this.iz[v]=g.z,this.ia[v]=g.a,this.iy[v]=g.y,this.irx[v]=g.rx,this.irz[v]=g.rz,this.isv[v]=g.sv,this.ish[v]=g.sh,this.ikind[v]=g.kind,this.ivar[v]=g.variant,this.isite[v]=g.site,this.iland[v]=g.landmark?1:0});for(const g of this.variants){const v=Math.max(1,Math.min(g.n,lu)),m=g.kit.geometry,d=new Uc(m,this.material,v);d.name=`${g.name}-${g.v}`,d.count=0,d.visible=!1,d.frustumCulled=!1,d.instanceMatrix.setUsage(wn),d.instanceColor=new Oe(new Float32Array(v*3),3),d.instanceColor.setUsage(wn);const x=new Oe(new Float32Array(v*4),4);x.setUsage(wn);const M=new Oe(new Float32Array(v),1);M.setUsage(wn),m.setAttribute("aSpan",x),m.setAttribute("aStretch",M),Object.assign(g,{mesh:d,cap:v,aSpan:x,aStretch:M}),this.group.add(d)}const l=qa(1842);this.tnx=Math.ceil((t.x1-t.x0)/Cn),this.tnz=Math.ceil((t.z1-t.z0)/Cn);const h=this.tnx*this.tnz,u=new Int32Array(n),f=new Int32Array(h);this.instances.forEach((g,v)=>{const m=Xt(Math.floor((g.x-t.x0)/Cn),0,this.tnx-1),d=Xt(Math.floor((g.z-t.z0)/Cn),0,this.tnz-1);u[v]=d*this.tnx+m,f[u[v]]++}),this.tStart=new Int32Array(h+1);for(let g=0;g<h;g++)this.tStart[g+1]=this.tStart[g]+f[g];const p=this.tStart.slice();this.tOrder=new Int32Array(n);for(let g=0;g<n;g++)this.tOrder[p[u[g]]++]=g;for(let g=0;g<h;g++)for(let v=this.tStart[g+1]-1;v>this.tStart[g];v--){const m=this.tStart[g]+Math.floor(l()*(v-this.tStart[g]+1)),d=this.tOrder[v];this.tOrder[v]=this.tOrder[m],this.tOrder[m]=d}this.always=[];for(let g=0;g<n;g++)this.iland[g]&&this.always.push(g);this.frustum=new ki,this.pv=new se,this.box=new bn,this.key="",this.yearDrawn=NaN}aliveNear(t,e){const n=this.spans;return n[t*4]<e+1&&n[t*4+3]>e-1}refresh(t,e,n){const i=this.yearNow,s=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const a=this.rec.d.rect,r=e*.7,c=[],l=Math.max(0,Math.floor((s.x-e-a.x0)/Cn)),h=Math.min(this.tnx-1,Math.floor((s.x+e-a.x0)/Cn)),u=Math.max(0,Math.floor((s.z-e-a.z0)/Cn)),f=Math.min(this.tnz-1,Math.floor((s.z+e-a.z0)/Cn));for(let x=u;x<=f;x++)for(let M=l;M<=h;M++){const b=x*this.tnx+M;if(this.tStart[b+1]===this.tStart[b])continue;const _=a.x0+M*Cn,S=a.z0+x*Cn;this.box.min.set(_,-.5,S),this.box.max.set(_+Cn,n,S+Cn);const E=this.box.distanceToPoint(s);if(E>e||!this.frustum.intersectsBox(this.box))continue;const A=E<r?1:r/E;c.push(b,Math.round(A*20))}const p=c.join(",");if(p===this.key&&Math.abs(i-this.yearDrawn)<.5)return;this.key=p,this.yearDrawn=i;let g=0;const v=[];for(let x=0;x<c.length;x+=2){const M=this.tStart[c[x]],b=this.tStart[c[x]+1];let _=0;for(let S=M;S<b;S++)this.aliveNear(this.tOrder[S],i)&&_++;v.push(_),g+=Math.ceil(_*c[x+1]/20)}const m=Math.min(1,(lu-this.always.length)/Math.max(1,g));for(const x of this.variants)x.c=0;const d=x=>{const M=this.variants[this.vOf[x]];if(M.c>=M.cap)return;const b=M.c++;M.mesh.instanceMatrix.array.set(this.mats.subarray(x*16,x*16+16),b*16),M.mesh.instanceColor.array.set(this.cols.subarray(x*3,x*3+3),b*3),M.aSpan.array.set(this.spans.subarray(x*4,x*4+4),b*4),M.aStretch.array[b]=this.stretches[x]};for(let x=0;x<c.length;x+=2){const M=Math.ceil(v[x/2]*c[x+1]*m/20);let b=0;for(let _=this.tStart[c[x]];_<this.tStart[c[x]+1]&&b<M;_++){const S=this.tOrder[_];this.iland[S]||!this.aliveNear(S,i)||(d(S),b++)}}for(const x of this.always)this.aliveNear(x,i)&&d(x);this.drawn=0;for(const x of this.variants)x.mesh.count=x.c,x.mesh.visible=x.c>0,x.mesh.instanceMatrix.needsUpdate=!0,x.mesh.instanceColor.needsUpdate=!0,x.aSpan.needsUpdate=!0,x.aStretch.needsUpdate=!0,this.drawn+=x.c}async streets(t){const e=this.app.timeline,n=e.yearAt(e.max),i=this.rec.d.rect,{nx:s,nz:a}=this.gridTiles;this.streetBatches=[];for(const r of d_){if(!await t())return!1;const c=Math.min(r,n),l=this.epochOfYear(c),h=this.epochs[l],u=new Map;for(let _=0;_<this.N;_++){if(gi[qn[this.ikind[_]]].loose||this.iland[_]||this.weightAt(_,c)<.5)continue;const E={x:this.ix[_],z:this.iz[_]},A=Xt(Math.floor((E.x-i.x0)/Wt),0,s-1),w=Xt(Math.floor((E.z-i.z0)/Wt),0,a-1),y=this.ths[w*s+A],T=[Math.cos(y),Math.sin(y)],L=[-T[1],T[0]],I=E.x*L[0]+E.z*L[1],R=E.x*T[0]+E.z*T[1],k=Math.floor(I/fi),F=Math.floor(R/Ci),G=`${w*s+A}:${k}:${F}`,W=u.get(G)||{th:y,bu:k,bv:F,n:0};W.n++,u.set(G,W)}const f=new Map;for(const _ of u.values()){if(_.n<2)continue;const S=[Math.cos(_.th),Math.sin(_.th)],E=[-S[1],S[0]],A=(I,R)=>[I*E[0]+R*S[0],I*E[1]+R*S[1]],w=_.bu*fi,y=w+fi,T=_.bv*Ci,L=T+Ci;for(const[I,R,k]of[[`${_.th}:v${_.bv}:${_.bu}`,A(w,T),A(y,T)],[`${_.th}:v${_.bv+1}:${_.bu}`,A(w,L),A(y,L)],[`${_.th}:u${_.bu}:${_.bv}`,A(w,T),A(w,L)],[`${_.th}:u${_.bu+1}:${_.bv}`,A(y,T),A(y,L)]])f.set(I,[R,k])}const p=(_,S,E)=>{const A=Math.max(1,Math.ceil(Math.hypot(S[0]-_[0],S[1]-_[1])/E)),w=[];for(let y=0;y<=A;y++){const T=_[0]+(S[0]-_[0])*y/A,L=_[1]+(S[1]-_[1])*y/A,[I,R]=this.texelOf(T,L),k=R*this.rec.d.W+I,F=this.rec.aux[k*4+3];if(this.groundAt(I,R,h.state)<.4||F>0&&this.rec.aux[k*4+1]>0&&h.features.has(F))return null;w.push([T,L])}return w},g=[];for(const[_,S]of f.values()){const E=p(_,S,.4);E&&g.push({pts:E,width:p_})}const v=[],m=r<1870?1/0:r<1950?5:4;for(const _ of u.values()){if(_.n<m)continue;const S=[Math.cos(_.th),Math.sin(_.th)],E=[-S[1],S[0]],A=(_.bv+.5)*Ci,w=T=>[T*E[0]+A*S[0],T*E[1]+A*S[1]],y=p(w(_.bu*fi+.32),w((_.bu+1)*fi-.32),.3);y&&v.push({pts:y,width:m_})}const d=new Ht(r<1910?"#9a8668":r<1950?"#8a8277":Nf.asphalt).toArray(),x=new Ht(r<1910?"#a38f6f":r<1950?"#a09888":"#a9a59c").toArray(),M=this.ribbons.add(g,{mode:"earth",colour:d,alpha:0,minPx:.7,lift:.004,order:4}),b=this.ribbons.add(v,{mode:"earth",colour:x,alpha:0,minPx:0,lift:.003,order:3});this.streetBatches.push({year:r,batch:M,padBatch:b,n:g.length,pads:v.length})}return!0}streetWeights(t){const e=this.streetBatches;return e.map((n,i)=>{const s=i>0?e[i-1].year:n.year-15,a=i+1<e.length?e[i+1].year:1/0;return t<=n.year?i===0?ce(s,n.year,t):Xt((t-s)/(n.year-s),0,1):a===1/0?1:Xt((a-t)/(a-n.year),0,1)})}clearing(){this.clearN=512,this.clearData=new Uint8Array(512*512);const e=new Ye(this.clearData,512,512,Pi,de);e.minFilter=e.magFilter=ie,e.needsUpdate=!0,this.clearTex=e,this.own.uTownClear.value=e,this.yearCleared=NaN,this.townsCleared=-1}stamp(t,e,n,i,s,a){const r=this.clearN,c=this.clearData,l=this.rec.d.rect,h=r/(l.x1-l.x0),u=r/(l.z1-l.z0),f=Math.abs(Math.cos(n)),p=Math.abs(Math.sin(n)),g=i*f+s*p,v=i*p+s*f,m=Xt(Math.floor((t-g-l.x0)*h),0,r-1),d=Xt(Math.floor((t+g-l.x0)*h),0,r-1),x=Xt(Math.floor((e-v-l.z0)*u),0,r-1),M=Xt(Math.floor((e+v-l.z0)*u),0,r-1);for(let b=x;b<=M;b++)for(let _=m;_<=d;_++)c[b*r+_]<a&&(c[b*r+_]=a)}stampClearing(t){var e,n;this.clearData.fill(0);for(let i=0;i<this.N;i++){const s=this.weightAt(i,t);s<.02||this.stamp(this.ix[i],this.iz[i],this.ia[i],this.irx[i],this.irz[i],Math.round(255*s))}(e=this.app.towns)==null||e.stampInto(this.rec.d.rect,t,(i,s,a,r,c,l)=>this.stamp(i,s,a,r,c,l)),this.clearTex.needsUpdate=!0,this.yearCleared=t,this.townsCleared=((n=this.app.towns)==null?void 0:n.version)??0}update(t,e,n){var c,l;const i=this.app.timeline.year;if(t>0?(this.yearNow+=(i-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(i-this.yearNow)<.05&&(this.yearNow=i)):this.yearNow=i,this.own.uYearNow.value=this.yearNow,!this.ready)return;this.hidden&&(e=0),this.group.visible=e>.001;const s=this.streetWeights(this.yearNow);if(this.streetBatches.forEach((h,u)=>{h.batch&&(h.batch.uniforms.uAlpha.value=.5*s[u]*e),h.padBatch&&(h.padBatch.uniforms.uAlpha.value=(h.year<1910?.3:h.year<1950?.45:.6)*s[u]*e)}),!this.group.visible)return;const a=qf(n);this.material.uniforms.uFadeNear.value=a*.75,this.material.uniforms.uFadeFar.value=a;const r=(((c=this.rec.data)==null?void 0:c.hi)??1e3)*this.app.world.uniforms.uVert.value+3;this.refresh(this.app.camera,a,r),(!(Math.abs(this.yearNow-this.yearCleared)<.5)||(((l=this.app.towns)==null?void 0:l.version)??0)!==this.townsCleared)&&this.stampClearing(this.yearNow)}alive(t=this.yearNow){if(!this.ready)return[];const e=[];for(let n=0;n<this.N;n++){if(this.weightAt(n,t)<.999)continue;const i=qn[this.ikind[n]],s=this.kits[i][this.ivar[n]];e.push({i:n,site:this.isite[n],kind:i,variant:this.ivar[n],x:this.ix[n],z:this.iz[n],a:this.ia[n],ax:s.hx*this.ish[n],az:s.hz*this.ish[n],box:s.box.map(a=>a*this.ish[n]),y:this.iy[n],height:s.top*this.isv[n],landmark:!!this.iland[n]})}return e}census(t=this.yearNow,e=null,n=null,i=1/0){return Yf(this.alive(t),e,n,i)}stats(){if(!this.ready)return{ready:!1,failed:this.failed};const t=this.Ys.findIndex(i=>i>=this.yearNow);let e=this.clearData.byteLength+this.bytes.reduce((i,s)=>i+s.byteLength,0)+this.sea.a.byteLength+this.stream.a.byteLength+this.broad.a.byteLength;for(const i of[this.mats,this.spans,this.cols,this.stretches,this.vOf,this.ix,this.iz,this.ia,this.iy,this.irx,this.irz,this.isv,this.ish,this.ikind,this.ivar,this.isite,this.iland,this.tOrder,this.tStart])e+=i.byteLength;const n=this.census(this.yearNow);return{ready:!0,year:+this.yearNow.toFixed(1),lots:this.lotCount,instances:this.N,placed:n.total,drawn:this.drawn,by:n.by,hale:n.hale,landmarks:this.landmarks.map(i=>`${i.name||i.kind} ${i.from}`),towns:this.townTerms,zoning:{zoning:this.zoning.zoning?`${this.zoning.zoning.W}×${this.zoning.zoning.H}`:null,lud:this.zoning.lud?`${this.zoning.lud.W}×${this.zoning.lud.H}`:null},value:this.values?"mask":"modelled",cap:+(this.cap[Math.max(0,t)]??1).toFixed(2),streets:this.streetBatches.map(i=>{var s;return`${i.year}:${i.n}/${i.pads}:${(((s=i.batch)==null?void 0:s.uniforms.uAlpha.value)??0).toFixed(2)}`}),triangles:this.variants.reduce((i,s)=>i+s.mesh.count*s.kit.tris,0),loadMs:this.loadMs,buildMs:this.buildMs,times:this.times,cpuMB:+(e/1048576).toFixed(1)}}dispose(){var t,e;this.disposed=!0;for(const n of this.variants||[])n.mesh.dispose(),n.kit.geometry.dispose();(t=this.material)==null||t.dispose(),(e=this.clearTex)==null||e.dispose(),this.own.uTownClear.value=null}}function Yf(o,t=null,e=null,n=1/0){const i={},s=new Set;let a=0;for(const r of o)t!==null&&Math.hypot(r.x-t,r.z-e)>n||(r.kind==="kauhale"&&a++,r.kind==="hale"&&(a+=2),!s.has(r.site)&&(s.add(r.site),i[r.kind]=(i[r.kind]||0)+1));return{by:i,total:Object.values(i).reduce((r,c)=>r+c,0),hale:a}}const Ai=Pe*1.4;function v_(o){let t=o>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function hu(o,t,e){let n=!1;for(let i=0,s=o.length-1;i<o.length;s=i++){const a=o[i],r=o[s];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function x_(o,t,e,n,i){const s=Math.cos(e),a=Math.sin(e);return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([r,c])=>[o+(r*n*s-c*i*a)/2,t+(r*n*a+c*i*s)/2])}function M_(o,t){for(const e of[o,t])for(let n=0;n<4;n++){const i=e[n],s=e[(n+1)%4],a=[s[1]-i[1],i[0]-s[0]];let r=1/0,c=-1/0,l=1/0,h=-1/0;for(const u of o){const f=u[0]*a[0]+u[1]*a[1];r=Math.min(r,f),c=Math.max(c,f)}for(const u of t){const f=u[0]*a[0]+u[1]*a[1];l=Math.min(l,f),h=Math.max(h,f)}if(c<l||h<r)return!1}return!0}function uu(o,t){const e=[o[0]];for(let n=0;n+1<o.length;n++){const[i,s]=o[n],[a,r]=o[n+1],c=Math.max(1,Math.ceil(Math.hypot(a-i,r-s)/t));for(let l=1;l<=c;l++)e.push([i+(a-i)*l/c,s+(r-s)*l/c])}return e}class y_{constructor(t,e,n){var u,f;this.app=t,this.districts=e,this.rec=n,this.group=new Ge,this.group.name="district features";const i=t.shared,s=t.data.proj,a=n.d.features.features||[];this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new ee(0,0,0,0))},uDistS:{value:n.terrain.shadow.texture},uYearNow:{value:t.timeline.year},uTownClear:{value:null}};const r=v_(1795),c=new Ue;this.counts={hale:0,waa:0,pondWalls:0};for(const{index:p,f:g}of n.d.rastered){const v=(u=g.properties)==null?void 0:u.kind,m=g.geometry.coordinates[0].map(d=>s.toWorld(d));v==="village"?this.buildVillage(c,m,p,r):v==="fishpond"&&this.buildPond(c,m,p,r)}this.structMat=To(i,this.own,{fade:[70,110]}),this.structures=new ye(c.geometry(),this.structMat),this.structures.frustumCulled=!1,this.group.add(this.structures),this.forest=new jx(n.data.trees,n.d.rect,i,this.own),this.group.add(this.forest.group),this.ribbons=new Zx(i,t.camera);const l=n.data.streams,h=[];for(let p=0;p<l.length;){const g=l[p++],v=[],m=[];for(let d=0;d<g;d++,p+=3)v.push([l[p],l[p+1]]),m.push(Math.min(7.5,1+1.3*Math.pow(l[p+2],.45))*Pe);h.push({pts:v,width:m})}this.streams=this.ribbons.add(h,{mode:"water",alpha:0,minPx:.9,lift:.004,order:5}),this.streamCount=h.length,this.trails=[];for(const p of a){const g=p.properties||{};if(g.kind!=="trail"||((f=p.geometry)==null?void 0:f.type)!=="LineString")continue;const v=uu(p.geometry.coordinates.map(d=>s.toWorld(d)),.12),m=this.ribbons.add([{pts:v,width:3.2*Pe}],{mode:"earth",colour:new Ht("#9c7f5c").toArray(),alpha:0,minPx:1.3,lift:.006,order:5});m&&this.trails.push({p:g,batch:m,w:0})}this.forces=new Ey(t,a,i,this.ribbons,(p,g)=>this.groundAt(p,g,!1)),this.group.add(this.ribbons.group,this.forces.group),this.settlements=new g_(t,e,n,this.own,this.ribbons),this.group.add(this.settlements.group),this.labels=new Ty(t,a),this.show=0}groundAt(t,e,n=!0){const i=this.districts.rawAt(t,e);if(!n)return i;const{d:s}=this.rec,a=s.rect,r=Math.max(0,Math.min(s.W-1,Math.floor((t-a.x0)/(a.x1-a.x0)*s.W))),l=Math.max(0,Math.min(s.H-1,Math.floor((e-a.z0)/(a.z1-a.z0)*s.H)))*s.W+r;return Wc(i,this.rec.aux[l*4],1,sr(this.rec.carve[l*2]))}buildVillage(t,e,n,i){t.feature(n);let s=1/0,a=-1/0,r=1/0,c=-1/0;for(const[f,p]of e)s=Math.min(s,f),a=Math.max(a,f),r=Math.min(r,p),c=Math.max(c,p);const l=.85,h=[],u=[];for(let f=r+l/2;f<c;f+=l)for(let p=s+l/2;p<a;p+=l){const g=p+(i()-.5)*l*.7,v=f+(i()-.5)*l*.7;!hu(e,g,v)||i()<.25||h.push([g,v])}for(const[f,p]of h){const g=i()*Math.PI*2,v=2+Math.floor(i()*3),m=[];for(let d=0;d<v;d++){const x=g+d/v*Math.PI*2+(i()-.5)*.6,M=d===0?0:.3+i()*.12,b=f+Math.cos(x)*M,_=p+Math.sin(x)*M;if(!hu(e,b,_)||m.some(([I,R])=>Math.hypot(I-b,R-_)<.3))continue;m.push([b,_]);const S=6+i()*3,E=4+i()*1.4;let A=1/0,w=-1/0;for(const[I,R]of[[0,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const k=this.groundAt(b+I*S*.5*Ai,_+R*E*.5*Ai,!1);A=Math.min(A,k),w=Math.max(w,k)}if(A<.6||w-A>2.5)continue;const y=g+d%2*Math.PI*.5,T=x_(b,_,y,(S+2.4)*Ai,(E+2.4)*Ai);if(u.some(I=>M_(I,T)))continue;u.push(T);const L=ui(w);t.at(b,L,_,y,Ai),Ga(t,i,S,E,4.6+i()*1.2,!0,.9+ui(w-A)/Ai),t.done(),this.counts.hale++}if(i()<.4){const d=f+.08,x=p-.06;t.at(d,ui(this.groundAt(d,x,!1)),x,0,Ai),Wx(t,i),t.done()}}this.buildCanoes(t,e,n,i),t.feature(0)}buildCanoes(t,e,n,i){let s=0,a=0;for(const[f,p]of e)s+=f/e.length,a+=p/e.length;const r=[],c=9,l=.06,h=Array.from({length:16},(f,p)=>[Math.cos(p/16*Math.PI*2),Math.sin(p/16*Math.PI*2)]);for(let f=a-c;f<a+c;f+=l)for(let p=s-c;p<s+c;p+=l){const g=this.groundAt(p,f);if(g<.3||g>2.2)continue;let v=null;for(const[m,d]of h)this.groundAt(p+m*.3,f+d*.3)<=0&&(v=v?[v[0]+m,v[1]+d]:[m,d]);v&&r.push([p,f,g,Math.atan2(v[1],v[0]),Math.hypot(p-s,f-a)])}r.sort((f,p)=>f[4]-p[4]);const u=[];for(const f of r){if(u.length>=14)break;u.some(p=>Math.hypot(p[0]-f[0],p[1]-f[1])<.22)||u.push(f)}for(const[f,p,g,v]of u)t.at(f,ui(g)+.002,p,v,Ai),Bx(t,i,7+i()*4),t.done(),this.counts.waa++}buildPond(t,e,n,i){t.feature(n);const s=_t(yo.pondStone,.12,i),a=uu(e,.05).map(([r,c])=>[r,ui(Math.max(this.groundAt(r,c),-.8))-.004,c]);t.wall(a,3*Pe,1.6*Pe,s,st.stone,.72),this.counts.pondWalls++,t.feature(0)}update(t,e,n){const i=e;this.show=i,this.own.uShow.value=i;const s=this.districts.featSeen,a=this.own.uFeatSeen.value;for(let l=0;l<64;l++)a[l>>2].setComponent(l&3,s[l]);this.group.visible=i>.001;const r=this.app.timeline.year,c=t>0?1-Math.exp(-t*1.6):1;this.streams&&(this.streams.uniforms.uAlpha.value=.8*i);for(const l of this.trails){const h=Uo(l.p,r)?1:0;l.w+=(h-l.w)*c,Math.abs(h-l.w)<.003&&(l.w=h),l.batch.uniforms.uAlpha.value=.75*l.w*i}this.forest.update(this.app.camera,i,this.rec.data.hi*this.app.world.uniforms.uVert.value+1,n),this.forces.update(t,i,n),this.settlements.update(t,i,n),this.ribbons.update(this.app.renderer),this.labels.update(i)}settle(t,e){this.update(0,t,e)}stats(){return{...this.counts,trees:this.forest.total,treesDrawn:this.forest.drawn,treeRadius:Zi,streams:this.streamCount,trails:this.trails.filter(t=>t.w>.5).length,forces:this.forces.stats(),labels:this.labels.visible(),settlements:this.settlements.stats()}}dispose(){this.structures.geometry.dispose(),this.structMat.dispose(),this.forest.dispose(),this.ribbons.dispose(),this.forces.dispose(),this.settlements.dispose(),this.labels.dispose()}}const Kr=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)},_c=new Float32Array(65536);for(let o=0;o<65536;o++)_c[o]=sr(o);class __{constructor(t){this.app=t,this.world=t.world,this.list=[],this.loaded=!1,this.cur=null,this.incoming=null,this.k=0,this.want=0,this.patchW=new Float32Array(64).fill(1),this.groupK=new Float32Array(Yn),this.groupDepth=new Float32Array(Yn),this.featK=new Float32Array(64),this.featSeen=new Float32Array(64),this.u=this.world.uniforms,this._frustum=new ki,this._m=new se,this._box=new bn,this.lastSeen=0,this.log=[]}patchWeights(){const t=this.cur;return t!=null&&t.lower?[...t.raise,...t.lower].map((e,n)=>({id:e.id,kind:e.kind,depth:e.depth,until:e.until,k:+this.patchW[n].toFixed(3)})):[]}async load(){var n;const t=await kx(this.app.data,this.app.warn),e=await((n=this.app.patches)==null?void 0:n.ready)||[];this.list=t,this.setPatches(e),this.loaded=!0}setPatches(t){const e=this.app.warn;for(const i of this.list)i.patches=zx(i,t,e);const n=new Set(this.world.islandPacks.map(i=>i.id));for(const i of t)!n.has(i.pack)&&!this.list.some(s=>s.id===i.pack)&&e(`patch ${i.id}: no pack or district ${i.pack} here; not drawn`);this.patchW.fill(1),this.incoming=null,this.cur&&this.drop()}districtAt(t,e,n=0,i=null){var h,u,f;const s=[],a=[];for(const p of this.list){const g=p.rect;if(!(t>g.x0-n&&t<g.x1+n&&e>g.z0-n&&e<g.z1+n))continue;const v=Math.hypot(Math.max(g.x0-t,0,t-g.x1),Math.max(g.z0-e,0,e-g.z1));v===0?s.push(p):a.push([v,p])}if(s.length===1)return s[0];if(!s.length){if(a.length<2)return((h=a[0])==null?void 0:h[1])??null;const p=i||this.mokuAt(t,e),g=p?a.filter(([,v])=>this.homeOf(v)===p):[];return g.length===1?g[0][1]:a.reduce((v,m)=>m[0]<v[0]?m:v)[1]}const r=i||this.mokuAt(t,e),c=r?s.filter(p=>this.homeOf(p)===r):[];if(c.length===1)return c[0];const l=((u=this.incoming)==null?void 0:u.d)??((f=this.cur)==null?void 0:f.d)??null;return s.includes(l)?l:s[0]}homeOf(t){var e,n;if(t.home===void 0){const i=this.app.polity,s=t.rect,a=new Map;for(let r=0;i&&r<12;r++)for(let c=0;c<12;c++){const l=i.mokuAt(s.x0+(c+.5)*(s.x1-s.x0)/12,s.z0+(r+.5)*(s.z1-s.z0)/12);l&&a.set(l.name,(a.get(l.name)||0)+1)}t.home=((e=t.desc)==null?void 0:e.moku)||((n=[...a].sort((r,c)=>c[1]-r[1])[0])==null?void 0:n[0])||null}return t.home}mokuAt(t,e){const n=this.app.polity,i=n==null?void 0:n.mokuAt(t,e);if(!i)return null;for(const[s,a]of[[5,0],[-5,0],[0,5],[0,-5]]){const r=n.mokuAt(t+s,e+a);if(r&&r.name!==i.name)return null}return i.name}reach(t,e){const n=t.rect,i=e.position;return Math.hypot(Math.max(n.x0-i.x,0,i.x-n.x1),Math.max(n.z0-i.z,0,i.z-n.z1),Math.max(1,i.y))}prefetch(t,e,n=null){const i=this.districtAt(t,e,20,n);return i&&(this.prefetchAt=performance.now(),this.prefetched=i,this.prefetchXZ=[t,e],this.stream(i)),i}readyAt(t,e){var i;const n=this.districtAt(t,e);return!!n&&((i=this.cur)==null?void 0:i.d)===n&&this.cur.state==="ready"}get showing(){return!!this.on||this.k>0}stream(t){var n,i;if(((n=this.cur)==null?void 0:n.d)===t){this.incoming=null;return}if(((i=this.incoming)==null?void 0:i.d)===t)return;if(!this.world.terrains.get(t.parent)){this.pending=t;return}this.pending===t&&(this.pending=null);const e={d:t,state:"loading",t0:performance.now()};this.cur&&this.showing?this.incoming=e:(this.incoming=null,this.cur&&this.drop(),this.cur=e),this.lastSeen=e.t0,this.decoder=this.decoder||new Fx(this.app.warn),this.decoder.decode(t).then(s=>{this.cur===e?this.arrive(e,s):this.incoming===e&&(e.out=s,e.state="decoded")}).catch(s=>{this.cur!==e&&this.incoming!==e||(this.app.warn(`district ${t.id}: ${s.message}`),e.state="failed")})}swap(){const t=this.incoming;if(t&&(this.incoming=null,this.cur&&this.drop(),this.cur=t,this.lastSeen=performance.now(),t.out)){const e=t.out;t.out=null,this.arrive(t,e)}}aimed(t){const e=this.app.rig,n=e==null?void 0:e.flight,i=this.prefetched&&performance.now()-(this.prefetchAt??-1e9)<Ee.hold*1e3?this.prefetched:null;let s=null,a=!1;if(n){if(n.dest.distance<Ee.rig[1]){const r=n.dest.target,c=this.prefetchXZ;s=i&&c&&Math.hypot(r.x-c[0],r.z-c[1])<.5?i:this.districtAt(r.x,r.z,20),a=!!s}}else{const r=e?e.goal.target:t.position,c=this.prefetchXZ,l=i&&c&&Math.hypot(r.x-c[0],r.z-c[1])<.5?i:this.districtAt(r.x,r.z,Ee.prefetch),h=l?this.reach(l,t):1/0;h<Ee.prefetch&&(s=l),a=h<Ee.far}return i&&i!==s&&!(s&&a)&&(s=i),s}arrive(t,e){var l;const{d:n}=t;t.decodeMs=Math.round(performance.now()-t.t0),t.data=e,t.metres=e.metres,t.aux=e.aux,t.carve=e.carve;const i={id:n.id,name:n.name,rect:n.rect,W:n.W,H:n.H,rainUrl:n.rainUrl,data:{metres:e.metres,normals:e.normals,land:e.land,lo:e.lo,hi:e.hi}};t.pack=i;const s=this.world.terrains.get(n.parent);t.parUniforms={uParN:{value:(s==null?void 0:s.normalTex)??null},uParL:{value:(s==null?void 0:s.landTex)??null},uParS:{value:(s==null?void 0:s.shadow.texture)??null},uParRect:{value:s?s.rect:new ee(0,0,1,1)},uParSlot:{value:-1},uParRain:{value:(s==null?void 0:s.uniforms.uOwnRain.value)??1}};const a=new gc(i,this.world,[this.world.arch,s].filter(Boolean),{vertexShader:dx,fragmentShader:px,shadowFragment:mx,shadowSize:512,uniforms:{...t.parUniforms,uDistN:{value:null},uDistL:{value:null},uDistS:{value:null}}});for(const h of[a.full,a.half]){const u=h.material.uniforms;u.uDistN.value=a.normalTex,u.uDistL.value=a.landTex,u.uDistS.value=a.shadow.texture}if(a.group.visible=!1,a.group.name=`district ${n.id}`,a.applyRange(((l=this.app.qset)==null?void 0:l.range)??4.6),this.app.params.get("debug"))for(const h of[a.full,a.half])h.material.uniforms.uDebug.value=Number(this.app.params.get("debug"));t.terrain=a,t.parent=s,this.world.group.add(a.group),t.heightTex=a.heightTex;const r=new Ye(e.aux,n.W,n.H,Ae,de);r.minFilter=r.magFilter=ie,r.needsUpdate=!0;const c=new Ye(e.carve,n.W,n.H,$u,Li);if(c.minFilter=c.magFilter=ie,c.needsUpdate=!0,t.auxTex=r,t.carveTex=c,t.pmap=e.patchMap,t.pmap){const h=t.pmap,u=new Ye(h.data,h.w,h.h,Ae,de);u.minFilter=u.magFilter=ie,u.needsUpdate=!0,t.patchTex=u,t.patchBox=new ee(h.x0,h.y0,h.x0+h.w,h.y0+h.h)}t.lower=n.patches.filter(h=>h.kind==="lower"),t.raise=n.patches.filter(h=>h.kind==="raise"),t.uploads=[a.heightTex,r,c,a.normalTex,a.landTex,...t.patchTex?[t.patchTex]:[]],t.state="uploading",t.features=new y_(this.app,this,t),this.app.scene.add(t.features.group),e.normals=e.land=null,e.trees={counts:e.trees.counts},e.streams=null,this.patchW.fill(1),this.featK.fill(0),this.featSeen.fill(0);for(const h of this.u.uFeatK.value)h.set(0,0,0,0);this.yearWeights(1)}drop(){var e,n,i;const t=this.cur;t&&(this.off(),t.terrain&&(this.world.group.remove(t.terrain.group),t.terrain.dispose()),(e=t.auxTex)==null||e.dispose(),(n=t.carveTex)==null||n.dispose(),(i=t.patchTex)==null||i.dispose(),t.features&&(this.app.scene.remove(t.features.group),t.features.dispose()),this.cur=null,this.k=0)}off(){var e;const t=this.u;t.uDistInfo.value.set(0,0,Ee.margin,Ee.band),t.uDistH.value=this.world.dummy,t.uDistAux.value=this.world.dummyAux,t.uDistCarve.value=this.world.dummy,t.uDistPatch.value=this.world.dummyAux,t.uDistPatchBox.value.set(0,0,0,0),(e=this.cur)!=null&&e.terrain&&(this.cur.terrain.group.visible=!1),this.on=!1}yearWeights(t){var a,r;const e=this.cur,n=this.app.timeline.year,i=this.patchW;if(e!=null&&e.lower){[...e.raise,...e.lower].forEach((g,v)=>{const m=n<g.until?1:0;let d=i[v]+(m-i[v])*t;Math.abs(d-m)<.002&&(d=m),i[v]=d});const l=e.raise.length,h=this.u.uDistRaise.value;let u=-1e9;for(let g=0;g<Yn;g++)h[g].set(g<l?i[g]:0,g<l?e.raise[g].depth:0,0,0),g<l&&i[g]>0&&(u=Math.max(u,e.raise[g].depth));this.u.uDistRaiseTop.value=u;const f=this.u.uDistLower.value,p=((a=e.pmap)==null?void 0:a.groups)||[0];for(let g=0;g<Yn;g++){let v=0,m=-1;const d=p[g]||0;e.lower.forEach((x,M)=>{d&1<<M&&i[l+M]>v&&(v=i[l+M],m=x.depth)}),v===0&&d&&(m=((r=e.lower.find((x,M)=>d&1<<M))==null?void 0:r.depth)??-1),this.groupK[g]=v,this.groupDepth[g]=m,f[g].set(v,m,0,0)}}const s=this.u.uFeatK.value;if(e)for(const[c,l]of e.d.byIndex){const h=Uo(l.properties,n)?1:0;let u=this.featK[c]+(h-this.featK[c])*t;Math.abs(u-h)<.002&&(u=h),this.featK[c]=u;const f=n>=ko(l.properties)[0]?1:0;let p=this.featSeen[c]+(f-this.featSeen[c])*t;Math.abs(p-f)<.002&&(p=f),this.featSeen[c]=p,s[c>>2].setComponent(c&3,u)}}wantFor(t,e,n){var l,h;const i=t.rect,s=e.position,a=Math.max(i.x0-s.x,0,s.x-i.x1),r=Math.max(i.z0-s.z,0,s.z-i.z1),c=Math.hypot(a,r,Math.max(1,s.y));return this.dc=c,this._m.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this._box.min.set(i.x0,0,i.z0),this._box.max.set(i.x1,Math.max(1,(((h=(l=this.cur)==null?void 0:l.data)==null?void 0:h.hi)??1e3)*this.u.uVert.value),i.z1),this._frustum.intersectsBox(this._box)?Kr(Ee.far,Ee.near,c)*(1-Kr(Ee.rig[0],Ee.rig[1],n)):0}update(t,e,n){var f,p;if(!this.loaded||!this.list.length)return;if(this.pending&&this.world.terrains.get(this.pending.parent)){const g=this.pending;this.pending=null,this.stream(g)}const i=this.aimed(t);i&&this.stream(i),this.incoming&&!this.showing&&this.swap();const s=this.cur,a=1-Math.exp(-n*2.5);if(this.yearWeights(n>0?1-Math.exp(-n*Du):1),!s)return;if(s.state==="uploading"){const g=s.uploads.shift();g&&this.app.renderer.initTexture(g),s.uploads.length||(s.state="ready",s.readyMs=Math.round(performance.now()-s.t0))}const r=s.parent,c=r&&r.slot>=0?r.k:0,l=s.state==="ready"&&!this.incoming?Math.min(this.wantFor(s.d,t,e),c):0;this.want=l,this.forceK!==null&&this.forceK!==void 0&&s.state==="ready"&&c>0&&!this.incoming?this.k=Math.min(this.forceK,c):(this.k+=(l-this.k)*a,Math.abs(l-this.k)<.004&&(this.k=l),this.k=Math.min(this.k,c));const h=s.state==="ready"&&c>0&&(this.k>0||l>0);h?this.switchOn(s):this.on&&this.off(),(h||this.k>0)&&(this.lastSeen=performance.now());const u=Math.max(this.lastSeen,this.prefetched===s.d?(this.prefetchAt??-1e9)+Ee.hold*1e3:-1e9);!h&&!this.incoming&&this.reach(s.d,t)>Ee.prefetch*1.2&&performance.now()-u>Ee.linger*1e3&&s.state!=="loading"&&this.drop(),this.cur&&((f=s.terrain)==null||f.update(t,this.on),(p=s.features)==null||p.update(n,this.on?this.k:0,e))}switchOn(t){const e=this.u,n=t.parent;e.uDistRect.value.copy(t.terrain.rect),e.uDistInfo.value.set(this.k,1,Ee.margin,Ee.band),e.uDistH.value=t.heightTex,e.uDistAux.value=t.auxTex,e.uDistCarve.value=t.carveTex,e.uDistPatch.value=t.patchTex||this.world.dummyAux,t.patchBox?e.uDistPatchBox.value.copy(t.patchBox):e.uDistPatchBox.value.set(0,0,0,0);const i=t.parUniforms;i.uParSlot.value=n.slot,i.uParN.value=n.normalTex,i.uParL.value=n.landTex,i.uParS.value=n.shadow.texture,this.on=!0}updateShadow(t,e,n,i){var s;this.on&&((s=this.cur)!=null&&s.terrain)&&this.cur.terrain.shadow.update(t,e,n,this.k,i)}settle(t,e){var a;this.incoming&&(this.k=0,this.off(),this.swap()),this.yearWeights(1);const n=this.cur;if(!n||n.state!=="ready")return;const i=n.parent,s=i&&i.slot>=0?i.k:0;this.k=Math.min(this.wantFor(n.d,t,e),s),this.k>0?(this.switchOn(n),n.terrain.update(t,!0)):this.on&&this.off(),(a=n.features)==null||a.settle(this.k,e)}weightAt(t,e){if(!this.on)return 0;const n=this.cur.d.rect,i=Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e);return this.k*Kr(Ee.band,Ee.margin,i)}patchAt(t,e){const n=this.cur.pmap;if(!n||t<n.x0||e<n.y0||t>=n.x0+n.w||e>=n.y0+n.h)return null;const i=((e-n.y0)*n.w+(t-n.x0))*4;return n.data.subarray(i,i+4)}texel(t,e){const n=this.cur,i=n.d.W,s=e*i+t;let a=n.metres[s];const r=n.aux,c=this.patchAt(t,e);if(c&&c[1]+c[3]>0){const u=this.u.uDistRaise.value,f=u[c[2]&15],p=u[c[2]>>4];a+=(Math.max(a,f.y)-a)*(c[1]/255)*f.x,a+=(Math.max(a,p.y)-a)*(c[3]/255)*p.x}const l=r[s*4];if(l){const u=c?c[0]:0;a=Wc(a,l,this.groupK[u],_c[n.carve[s*2]],this.groupDepth[u])}const h=r[s*4+3];if(h>0){const u=this.featK[h];h<Fn.pond?a+=(Ef(a,_c[n.carve[s*2]],r[s*4+2])-a)*(r[s*4+1]/255)*u:h<Fn.other&&(a+=(gf-a)*(r[s*4+1]/255)*u)}return a}metresAt(t,e){const{d:n}=this.cur,i=n.rect;let s=(t-i.x0)/(i.x1-i.x0)*n.W-.5,a=(e-i.z0)/(i.z1-i.z0)*n.H-.5;s=Math.max(0,Math.min(n.W-1.001,s)),a=Math.max(0,Math.min(n.H-1.001,a));const r=s|0,c=a|0,l=s-r,h=a-c,u=this.texel(r,c)+(this.texel(r+1,c)-this.texel(r,c))*l,f=this.texel(r,c+1)+(this.texel(r+1,c+1)-this.texel(r,c+1))*l;return u+(f-u)*h}blend(t,e,n){const i=this.weightAt(t,e);return i>0?n+(this.metresAt(t,e)-n)*i:n}rawAt(t,e){const{d:n}=this.cur,i=n.rect,s=Math.max(0,Math.min(n.W-1,Math.floor((t-i.x0)/(i.x1-i.x0)*n.W))),a=Math.max(0,Math.min(n.H-1,Math.floor((e-i.z0)/(i.z1-i.z0)*n.H)));return this.cur.metres[a*n.W+s]}stats(){var s,a;const t=this.cur;if(!t)return{district:null,incoming:this.incoming?`${this.incoming.d.id}:${this.incoming.state}`:null,loaded:this.loaded,count:this.list.length};const e=t.d.W*t.d.H,n=e*4+e*4+e*4+2*(e*4*4/3)+512*512+(t.pmap?t.pmap.w*t.pmap.h*4:0),i=t.metres?e*4+e*4+e*4:0;return{district:t.d.id,incoming:this.incoming?`${this.incoming.d.id}:${this.incoming.state}`:null,state:t.state,k:+this.k.toFixed(3),want:+this.want.toFixed(3),on:!!this.on,patches:this.patchWeights(),patchMap:t.pmap?{box:[t.pmap.x0,t.pmap.y0,t.pmap.w,t.pmap.h],groups:t.pmap.groups.length-1}:null,decodeMs:t.decodeMs??null,readyMs:t.readyMs??null,workerMs:((s=t.data)==null?void 0:s.ms)??null,gpuMB:+(n/1048576).toFixed(1),cpuMB:+(i/1048576).toFixed(1),nodes:t.terrain?t.terrain.full.count+t.terrain.half.count:0,features:((a=t.features)==null?void 0:a.stats())??null}}}const w_=`
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,b_=`
${Ve}
${Io}
${ln}
${as}
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
  if (depth < -${vf.toFixed(2)}) discard; // the land's (terrain.glsl.js SEA_EDGE)
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
`;function S_(o,t,e,n){const i=[0,0,0];for(let r=0;r<=n;r++){const c=o*Math.pow(t/o,r/n);for(let l=0;l<e;l++){const h=l/e*Math.PI*2;i.push(Math.cos(h)*c,0,Math.sin(h)*c)}}const s=[];for(let r=0;r<e;r++)s.push(0,1+(r+1)%e,1+r);for(let r=0;r<n;r++)for(let c=0;c<e;c++){const l=1+r*e+c,h=1+r*e+(c+1)%e,u=l+e,f=h+e;s.push(l,h,u,h,f,u)}const a=new cn;return a.setAttribute("position",new Te(i,3)),a.setIndex(s),a}class E_{constructor(t,e){this.uniforms={...t.uniforms,...e,uCamPos:{value:new B},uWind:{value:new Vt(-.8,.45)},uSwellDir:{value:new Vt(-.6,.8)},uDebug:{value:0}},this.material=new Ce({vertexShader:w_,fragmentShader:b_,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new ye(S_(1,25e4,96,120),this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const A_=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],T_={ra:12.857,dec:27.13};function C_(o){let t=o>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}const hi=Math.PI/180,po=21*hi,_a=29.530588,R_=224.1;function fu(o,t,e){const n=Math.cos(o),i=-n*Math.sin(t),s=Math.sin(o)*Math.cos(po)-n*Math.cos(t)*Math.sin(po),a=Math.sin(o)*Math.sin(po)+n*Math.cos(t)*Math.cos(po);return e.set(i,a,-s)}function L_(o,t,e={}){const n=23.44*hi*Math.sin(2*Math.PI*(284+o)/365),i=(o-80)/365.25*360*hi,a=((o-80)/365.25*24%24+24)%24+t-12;e.sun=fu(n,(t-12)*15*hi,e.sun||new B);const r=o+t/24,c=((r-R_)%_a+_a)%_a,l=c/_a,h=i+l*2*Math.PI,u=Math.asin(Math.sin(23.44*hi)*Math.sin(h)+Math.sin(5.1*hi)*Math.sin(r*.23)),f=h/(2*Math.PI)*24;return e.moon=fu(u,(a-f)*15*hi,e.moon||new B),e.phase=l,e.night=Math.min(29,Math.floor(c)),e.illum=.5-.5*Math.cos(l*2*Math.PI),e.lst=a,e.decl=n,e}const Kf=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],Zf=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],P_=1.6110731556870734,D_=1.5;function I_(o){return o=Math.max(-1,Math.min(1,o)),1e3*Math.max(0,1-Math.exp(-((P_-Math.acos(o))/D_)))}function Zr(o,t,e,n=[0,0,0]){const i=I_(t.y),s=.2*e.turbidity*1e-17,a=Math.acos(Math.max(0,o.y)),r=1/(Math.cos(a)+.15*Math.pow(93.885-a*180/Math.PI,-1.253)),c=8400*r,l=1250*r,h=o.x*t.x+o.y*t.y+o.z*t.z,u=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),f=e.mieDirectionalG,p=f*f,g=1/(4*Math.PI)*((1-p)/Math.pow(1-2*f*h+p,1.5)),v=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let m=0;m<3;m++){const d=Kf[m]*e.rayleigh,x=.434*s*Zf[m]*e.mieCoefficient,M=Math.exp(-(d*c+x*l)),b=(d*u+x*g)/(d+x);let _=Math.pow(i*b*(1-M),1.5);_*=1+(Math.pow(i*b*M,.5)-1)*v;const S=.1*M,E=(_+S)*.04+[0,3e-4,75e-5][m];n[m]=Math.pow(E,1/2.4)}return n}function k_(o,t,e=[0,0,0]){const n=Math.acos(Math.max(0,o.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),s=.2*t.turbidity*1e-17;for(let a=0;a<3;a++){const r=Kf[a]*t.rayleigh,c=.434*s*Zf[a]*t.mieCoefficient;e[a]=Math.exp(-(r*8400*i+c*1250*i))}return e}const U_=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,Jf=`
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
`,z_=`
${Jf}
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
`,F_=`
${Jf}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,N_=`
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
`,O_=`
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
`;class B_{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=T_,e=(l,h)=>{const u=l/24*2*Math.PI,f=h*hi;return new B(Math.cos(f)*Math.cos(u),Math.cos(f)*Math.sin(u),Math.sin(f))};this.uniforms={uSun:{value:new B(0,1,0)},uMoon:{value:new B(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:po},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new ye(new Fc(1,5),new Ce({vertexShader:U_,fragmentShader:z_,uniforms:this.uniforms,side:rn,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=C_(4242),s=A_.map(([l,h,u])=>[l/24*2*Math.PI,h*hi,u]);for(let l=0;l<2600;l++){const h=i()*2-1;s.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const a=new Float32Array(s.length*3);s.forEach((l,h)=>a.set(l,h*3));const r=new cn;r.setAttribute("aStar",new De(a,3)),r.setAttribute("position",new De(new Float32Array(s.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new Vv(r,new Ce({vertexShader:N_,fragmentShader:O_,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:sc})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new Ge,this.group.add(n,this.stars),this.mapRT=new Jn(256,128,{type:Li,depthBuffer:!1}),this.mapRT.texture.wrapS=ka,this.mapScene=new ir;const c=new ye(Oc(),new Ce({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:F_,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));c.frustumCulled=!1,this.mapScene.add(c),this.mapCam=new er(-1,1,1,-1,0,1),this.astro={},this._v=new B}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const s=L_(t,e,this.astro),a=s.sun,r=this.uniforms;r.uSun.value.copy(a),r.uMoon.value.copy(s.moon),r.uPhase.value=s.phase,r.uIllum.value=s.illum,r.uLst.value=s.lst/24*2*Math.PI;const c=qe.smoothstep(-a.y,-.02,.2);r.uNight.value=c,this.starUniforms.uNight.value=c,this.starUniforms.uTime.value=n;const l=this.params,h=this._v,u=Zr(h.set(0,1,0),a,l),f=[0,0,0];for(let S=0;S<8;S++){const E=S/8*Math.PI*2,A=Zr(h.set(Math.cos(E),.08,Math.sin(E)).normalize(),a,l);for(let w=0;w<3;w++)f[w]+=A[w]/8}const p=Zr(h.set(a.x,.05,a.z).normalize(),a,l),g=k_(a,l),v=qe.smoothstep(a.y,-.04,.06),m=3.2;i.sunColor.setRGB(g[0]*m*v,g[1]*m*v,g[2]*m*v);const d=[.0035,.005,.011],M=qe.smoothstep(s.moon.y,-.02,.1)*s.illum*c;i.skyColor.setRGB(u[0]*.55+f[0]*.45+d[0]+.012*M,u[1]*.55+f[1]*.45+d[1]+.016*M,u[2]*.55+f[2]*.45+d[2]+.024*M);const b=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Ht(b,b,b),.35),i.zenith.setRGB(u[0],u[1],u[2]),i.horizon.setRGB(f[0]+d[0],f[1]+d[1],f[2]+d[2]),i.sunHorizon.setRGB(p[0],p[1],p[2]);const _=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,a.y)+i.skyColor.r)*_*1.1,(i.sunColor.g*Math.max(0,a.y)+i.skyColor.g)*_,(i.sunColor.b*Math.max(0,a.y)+i.skyColor.b)*_*.8),i.moonColor.setRGB(.05*M,.06*M,.085*M),i.moonDir.copy(s.moon),i.sunDir.copy(a),i.night=c,s}}const bo=Math.PI*2,Jr=.4,W_=.18,du=(o,t,e,n)=>e>0?o+(t-o)*(1-Math.exp(-e/n)):t,G_=(o,t,e)=>(o+t+Math.sqrt((o-t)*(o-t)+e*e))/2,H_=o=>o<.5?4*o*o*o:1-Math.pow(-2*o+2,3)/2,wa=o=>((o+Math.PI)%bo+bo)%bo-Math.PI,V_=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)},Qf=4e4;function ji(o){return .6+.52*V_(Math.log(40),Math.log(4500),Math.log(Math.max(1,o)))}class $_{constructor(t,e,n){this.camera=t,this.dom=e,this.world=n,this.minDistance=hd,this.maxDistance=Yc,this._ray=new $v,this._v=new B,this.home=this.homeView(),this.reach(this.home.distance);const i=this.home;this.state={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.goal={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.flight=null,this.floor=0,this.groundM=0,this.pinned=!0,this._lastXZ=new Vt(i.target.x,i.target.z),this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this.bind()}homeView(t={x0:16,y0:72,x1:innerWidth-16,y1:innerHeight-120}){const e=this.world.chainShape();return this.fit({points:e.hull,along:[e.from,e.to],yaw:0,box:t,reach:Qf})}reach(t){this.maxDistance=Math.max(Yc,t*1.15)}bind(){const t=this.dom,e=new Map;let n=null,i=null,s=null;t.addEventListener("contextmenu",r=>r.preventDefault()),t.addEventListener("pointerdown",r=>{this.enabled&&(t.setPointerCapture(r.pointerId),e.set(r.pointerId,{x:r.clientX,y:r.clientY}),e.size===1?(n=r.button===2||r.shiftKey||r.ctrlKey||r.metaKey||r.altKey?"orbit":"pan",i={x:r.clientX,y:r.clientY}):e.size===2&&(n="pinch",s=this.pinchState(e)))}),t.addEventListener("pointermove",r=>{if(e.has(r.pointerId)){if(e.set(r.pointerId,{x:r.clientX,y:r.clientY}),n==="orbit"&&i){const c=r.clientX-i.x,l=r.clientY-i.y;this.goal.yaw-=c*.005,this.goal.pitch=qe.clamp(this.goal.pitch+l*.004,.06,1.52),i={x:r.clientX,y:r.clientY},this.touch()}else if(n==="pan"&&i){const c=r.clientX-i.x,l=r.clientY-i.y;(c||l)&&(this.panBy(c,l),this.touch()),i={x:r.clientX,y:r.clientY}}else if(n==="pinch"&&e.size===2){const c=this.pinchState(e),l=s.dist/Math.max(20,c.dist);this.zoomAt(c.cx,c.cy,l),this.panBy(c.cx-s.cx,c.cy-s.cy),this.goal.yaw-=wa(c.angle-s.angle),s=c,this.touch()}}});const a=r=>{if(e.delete(r.pointerId),e.size===0)n=null;else if(e.size===1){const[c]=e.values();n="pan",i={...c}}};t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a),t.addEventListener("wheel",r=>{if(!this.enabled)return;r.preventDefault();const c=r.deltaMode===1?r.deltaY*30:r.deltaY,l=Math.exp(Math.sign(c)*Math.min(Math.abs(c),150)*.0022);this.zoomAt(r.clientX,r.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",r=>{const c=this.pickGround(r.clientX,r.clientY);if(c){const l=Math.max(this.minDistance,this.goal.distance*.35);this.flyTo({target:c,distance:l,pitch:this.goal.pitch+ji(l)-ji(this.goal.distance)},1.8)}}),addEventListener("keydown",r=>{var f,p;if(!this.enabled||(p=(f=r.target).closest)!=null&&p.call(f,"input, textarea"))return;const c=this.goal.distance*.08,l={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[r.code];if(l&&!r.altKey){const g=Math.sin(this.goal.yaw),v=Math.cos(this.goal.yaw);this.goal.target.x+=(l[0]*v+l[1]*g)*c,this.goal.target.z+=(-l[0]*g+l[1]*v)*c,this.touch()}r.code==="KeyQ"&&(this.goal.yaw+=.12),r.code==="KeyE"&&(this.goal.yaw-=.12);const h=innerWidth/2,u=innerHeight/2;(r.code==="Equal"||r.code==="NumpadAdd")&&this.zoomAt(h,u,.8),(r.code==="Minus"||r.code==="NumpadSubtract")&&this.zoomAt(h,u,1.25)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,s=Math.sin(this.goal.yaw),a=Math.cos(this.goal.yaw),r=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*a-e*s*r)*i,this.goal.target.z+=(t*s-e*a*r)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),s=this.goal.distance,a=qe.clamp(s*n,this.minDistance,this.maxDistance);if(i){const r=1-a/s;this.goal.target.x+=(i.x-this.goal.target.x)*r,this.goal.target.z+=(i.z-this.goal.target.z)*r}this.goal.pitch=qe.clamp(this.goal.pitch+ji(a)-ji(s),.06,1.52),this.goal.distance=a}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Vt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e){const n=this.world,i=n.maxY+.05;if(e.y>=0&&t.y>i)return null;const s=e.y<0?t.y/-e.y:4e5;let a=t.y>i&&e.y<0?(t.y-i)/-e.y:0;const r=Math.min(s,4e5),c=this._v;let l=a;for(let h=0;h<700&&a<=r+.001;h++){c.copy(t).addScaledVector(e,a);const u=c.y-n.heightAt(c.x,c.z);if(u<0){let f=l,p=a;for(let g=0;g<24;g++){const v=(f+p)/2;c.copy(t).addScaledVector(e,v),c.y-n.heightAt(c.x,c.z)<0?p=v:f=v}return c.clone()}l=a,a+=Math.max(.02,u*.45,a*.0015)}return s<4e5?t.clone().addScaledVector(e,s).setY(0):null}fit({rect:t,points:e,along:n,distance:i,yaw:s=this.goal.yaw,tilt:a=0,pitch:r,box:c,pad:l=1.06,reach:h=this.maxDistance}){const u=this._fitCam||(this._fitCam=new _n),f=innerWidth,p=innerHeight;u.fov=this.camera.fov,u.aspect=f/Math.max(1,p),u.near=.1,u.far=1e6,u.updateProjectionMatrix();const g=c||{x0:0,y0:0,x1:f,y1:p},v=Math.max(60,g.x1-g.x0),m=Math.max(60,g.y1-g.y0),d=Math.tan(u.fov*Math.PI/360),x=e||[[t.x0,t.z0],[t.x1,t.z0],[t.x0,t.z1],[t.x1,t.z1]];let M=1/0,b=1/0,_=-1/0,S=-1/0;for(const[F,G]of x)M=Math.min(M,F),_=Math.max(_,F),b=Math.min(b,G),S=Math.max(S,G);let E=(M+_)/2,A=(b+S)/2;const w=i!==void 0;let y=w?i:Math.max(_-M,S-b)/(2*d)*(p/m),T=0;const L=Math.atan2(m,v),I=(F,G)=>Math.atan2(Math.sin(F)/Math.max(.35,Math.sin(G)),Math.cos(F));if(n){const[[F,G],[W,K]]=n;s=I(L,ji(y)+a)-Math.atan2(K-G,W-F)}const R=this._v,k=(F,G,W)=>(R.set(F,G,W).project(u),[(R.x+1)/2*f,(1-R.y)/2*p]);for(let F=0,G=n?14:8;F<G;F++){y=qe.clamp(y,this.minDistance,h),T=qe.clamp(r??ji(y)+a,.06,1.52);const W=Math.cos(T),K=Math.cos(s),H=Math.sin(s),et=w?this.world.heightAt(E,A):0;u.position.set(E+y*W*H,et+y*Math.sin(T),A+y*W*K),u.lookAt(E,et,A),u.updateMatrixWorld();let ct=1/0,Q=1/0,nt=-1/0,dt=-1/0;for(const[Pt,Et]of x){const[Ut,X]=k(Pt,w?this.world.heightAt(Pt,Et):et,Et);ct=Math.min(ct,Ut),nt=Math.max(nt,Ut),Q=Math.min(Q,X),dt=Math.max(dt,X)}if(n){const[[Pt,Et],[Ut,X]]=n,[ue,Ct]=k(Pt,et,Et),[Ft,Y]=k(Ut,et,X);s+=wa(I(L,T)-I(Math.atan2(Y-Ct,Ft-ue),T))}w||(y*=qe.clamp(Math.max((nt-ct)*l/v,(dt-Q)*l/m),.3,3));const Mt=2*y*d/p,St=((ct+nt)/2-(g.x0+g.x1)/2)*Mt,Rt=((Q+dt)/2-(g.y0+g.y1)/2)*Mt/Math.max(.35,Math.sin(T));E+=St*K+Rt*H,A+=-St*H+Rt*K}return y=qe.clamp(y,this.minDistance,h),{target:new B(E,this.world.heightAt(E,A),A),distance:y,yaw:n?wa(s):s,pitch:T}}groundAt(t,e){return Math.max(0,this.world.metresAt(t,e))}smoothGround(t,e,n){const i=W_*n;let s=2*this.groundAt(t,e),a=2;for(let r=0;r<6;r++){const c=r/6*bo,l=c+bo/12;s+=this.groundAt(t+Math.cos(c)*i*.5,e+Math.sin(c)*i*.5),s+=this.groundAt(t+Math.cos(l)*i,e+Math.sin(l)*i),a+=2}return s/a}pin(){const t=this.goal.target;this.groundM=this.groundAt(t.x,t.z),this.pinned=!0,this._lastXZ.set(t.x,t.z);const e=this.groundM*this.world.uniforms.uVert.value;t.y=e,this.state.target.y=e}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift,groundM:this.groundM},s={target:t.target?t.target.clone():i.target.clone(),distance:qe.clamp(t.distance??i.distance,this.minDistance,this.maxDistance),yaw:t.yaw??i.yaw,pitch:qe.clamp(t.pitch??i.pitch,.06,1.52),lift:t.lift??0};s.yaw=i.yaw+wa(s.yaw-i.yaw);const a=Math.hypot(i.target.x-s.target.x,i.target.z-s.target.z),r=n.hop??Math.max(0,a*.9-Math.max(i.distance,s.distance)*.6);this.flight={from:i,dest:s,t:0,duration:e,hop:r,onDone:n.onDone,ready:n.ready,held:0}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,this.pin(),(e=t.onDone)==null||e.call(t),this.apply()}jump({x:t,z:e,distance:n,yaw:i,pitch:s}){this.flight=null;for(const a of[this.goal,this.state])t!==void 0&&a.target.set(t,this.world.heightAt(t,e),e),n!==void 0&&(a.distance=n),i!==void 0&&(a.yaw=i),s!==void 0&&(a.pitch=s),a.lift=0;this.pin(),this.apply()}update(t){var r;const e=this.goal;if(this.flight){const c=this.flight;let l=t/c.duration;c.ready&&c.t>.8&&c.held<6&&!c.ready()&&(c.held+=t,l*=.08),c.t=Math.min(1,c.t+l);const h=H_(c.t);e.target.lerpVectors(c.from.target,c.dest.target,h);const u=Math.log(c.from.distance)*(1-h)+Math.log(c.dest.distance)*h;e.distance=Math.exp(u)+c.hop*Math.sin(Math.PI*h),e.yaw=c.from.yaw+(c.dest.yaw-c.from.yaw)*h,e.pitch=c.from.pitch+(c.dest.pitch-c.from.pitch)*h+.2*Math.sin(Math.PI*h)*Math.min(1,c.hop/300),e.pitch=Math.min(1.52,e.pitch),e.lift=c.from.lift+(c.dest.lift-c.from.lift)*h,this.groundM=c.from.groundM+(this.groundAt(c.dest.target.x,c.dest.target.z)-c.from.groundM)*h,c.t>=1&&(this.flight=null,this.pin(),(r=c.onDone)==null||r.call(c))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);const n=this.world.bounds,i=150+e.distance*.3;e.target.x=qe.clamp(e.target.x,n.x0-i,n.x1+i),e.target.z=qe.clamp(e.target.z,n.z0-i,n.z1+i),this.flight||(Math.abs(e.target.x-this._lastXZ.x)+Math.abs(e.target.z-this._lastXZ.y)>1e-7&&(this.pinned=!1),this._lastXZ.set(e.target.x,e.target.z),this.pinned||(this.groundM=du(this.groundM,this.smoothGround(e.target.x,e.target.z,e.distance),t,Jr))),e.target.y=this.groundM*this.world.uniforms.uVert.value;const s=this.state,a=this.flight?1:1-Math.exp(-t*7);s.target.lerp(e.target,a),s.distance=Math.exp(Math.log(s.distance)+(Math.log(e.distance)-Math.log(s.distance))*a),s.yaw+=(e.yaw-s.yaw)*a,s.pitch+=(e.pitch-s.pitch)*a,s.lift+=(e.lift-s.lift)*a,this.apply(t)}groundAhead(t,e,n){const i=this.world;let s=i.heightAt(t,e);const a=this._prevXZ;if(a&&n>0){const r=(t-a.x)/n,c=(e-a.y)/n,l=Math.hypot(r,c),h=Math.min(20,l*.3);h>.005&&(s=Math.max(s,i.heightAt(t+r/l*h,e+c/l*h)))}return this._prevXZ=(this._prevXZ||new Vt).set(t,e),s}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const s=.12+e.distance*.03,a=this.groundAhead(n.position.x,n.position.z,t),r=Math.max(0,a+s-n.position.y);this.floor=du(this.floor,r,t,r>this.floor?Jr/3:Jr*2),n.position.y+=this.floor;const c=this.world.heightAt(n.position.x,n.position.z),l=Math.min(.04,s*.3);n.position.y=G_(n.position.y,c+l,l),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const h=n.position.y-c;n.near=qe.clamp(Math.min(h,e.distance)*.12,.02,300),n.far=qe.clamp(e.distance*30+h*60,8e3,3e5),n.updateProjectionMatrix(),n.updateMatrixWorld()}}const X_=1.5,j_=`
${Ve}
${ln}
${as}
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
`,q_=`
uniform vec3 uColor;
uniform float uOpacity;
in float vFade;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vFade);
}
`;function Y_(o){return o?o.type==="Polygon"?o.coordinates:o.type==="MultiPolygon"?o.coordinates.flat():o.type==="LineString"?[o.coordinates]:o.type==="MultiLineString"?o.coordinates:[]:[]}function K_(o,t){var s;const e=new Map,n=new Set,i=a=>Math.round(a*1e6);for(const a of(o==null?void 0:o.features)||[]){const r=Ea((s=a.properties)==null?void 0:s.island)||"other";let c=e.get(r);c||e.set(r,c=[]);for(const l of Y_(a.geometry))for(let h=0;h+1<l.length;h++){const u=l[h],f=l[h+1],p=`${i(u[0])},${i(u[1])}`,g=`${i(f[0])},${i(f[1])}`;if(p===g)continue;const v=p<g?`${p}|${g}`:`${g}|${p}`;if(n.has(v))continue;n.add(v);const[m,d]=t.toWorld(u),[x,M]=t.toWorld(f),b=Math.max(1,Math.ceil(Math.hypot(x-m,M-d)/X_));for(let _=0;_<b;_++){const S=_/b,E=(_+1)/b;c.push(m+(x-m)*S,d+(M-d)*S,m+(x-m)*E,d+(M-d)*E)}}}return e}class pu{constructor(t,e,n,{color:i,width:s,order:a}){this.group=new Ge,this.uniforms={...n,uResolution:{value:new Vt(1,1)},uWidth:{value:s},uCamPos:{value:new B},uColor:{value:new Ht(...i)},uOpacity:{value:1}},this.material=new Ce({vertexShader:j_,fragmentShader:q_,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});const r=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);this.count=0;for(const[,c]of K_(t,e)){if(!c.length)continue;const l=new Do;l.setAttribute("position",new De(r,3)),l.setIndex([0,2,1,1,2,3]);const h=new Float32Array(c);l.setAttribute("aSeg",new Oe(h,4)),l.instanceCount=h.length/4,this.count+=l.instanceCount;let u=1/0,f=-1/0,p=1/0,g=-1/0;for(let d=0;d<h.length;d+=2)u=Math.min(u,h[d]),f=Math.max(f,h[d]),p=Math.min(p,h[d+1]),g=Math.max(g,h[d+1]);const v=new B((u+f)/2,60,(p+g)/2);l.boundingSphere=new Ii(v,Math.hypot(f-u,g-p,300)/2+10);const m=new ye(l,this.material);m.renderOrder=a,this.group.add(m)}}update(t,e,n){this.uniforms.uResolution.value.copy(e),this.uniforms.uCamPos.value.copy(t.position),this.uniforms.uOpacity.value=n,this.group.visible=n>.01&&this.count>0}}class Z_{constructor(t,e){this.group=new Ge,this.moku=new pu(t.moku,t.proj,e,{color:[1.5,1.08,.52],width:2.2,order:3}),this.ahupuaa=new pu(t.ahupuaa,t.proj,e,{color:[1.25,1.2,1.06],width:1.3,order:2}),this.group.add(this.ahupuaa.group,this.moku.group),this.visible=!0,this._res=new Vt}update(t,e,n,i=1){e.getDrawingBufferSize(this._res);const s=e.getPixelRatio(),a=this.visible?1:0,r=(c,l,h)=>{const u=Math.max(0,Math.min(1,(h-c)/(l-c)));return u*u*(3-2*u)};this.moku.uniforms.uWidth.value=(1.3+1.1*(1-r(800,4e3,n)))*s,this.ahupuaa.uniforms.uWidth.value=1.25*s,this.moku.uniforms.uColor.value.setRGB(1.5*i,1.08*i,.52*i),this.ahupuaa.uniforms.uColor.value.setRGB(1.25*i,1.2*i,1.06*i),this.moku.update(t,this._res,a*(.55+.4*(1-r(1500,6e3,n)))),this.ahupuaa.update(t,this._res,a*.75*(1-r(220,650,n)))}}const J_=4,mu=[300,1e3],gu=[.4,.7],Q_=9,vu={voyage:[1.38,1.18,.86],fleet:[1.6,.9,.52],ship:[1,1.1,1.26],trade:[1.15,1.1,.96],schematic:[1.25,1.18,1.02]},xu={journal:{width:2,opacity:.92,pulse:1},narrative:{width:1.7,opacity:.82,pulse:.9},schematic:{width:1.4,opacity:.62,pulse:.45}},tw={day:0,month:0,year:0,decade:5,generation:12,century:50},Qr=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)},ew=`
${Ve}
${ln}
${as}
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
`,nw=`
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
`;function iw(o){const t=o.when||{},e=(a,r)=>{const c=String(a??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!c)return null;const l=Number(c[1]);return c[2]?l+(Number(c[2])-1+(r?1:0))/12:l+(r?1:0)};let n=e(t.from,!1),i=e(t.to??t.from,!0);if(n===null&&i===null)return null;n===null&&(n=i-1),i===null&&(i=n+1);const s=tw[t.precision]??0;return s&&i-n<=1.01&&(n-=s,i+=s),[n,i]}async function sw(o,t=console.warn){const e=o!=null&&o.abs?o.abs("routes.json"):new URL("routes.json",new URL((o==null?void 0:o.base)||"./data/",location.href)).href;try{const n=await fetch(e);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json();return Array.isArray(i)?i:Array.isArray(i==null?void 0:i.routes)?i.routes:[]}catch(n){return t(`${e}: ${n.message} (no routes)`),[]}}class ow{constructor(t,e,n){this.route=t,this.span=iw(t);const i=xu[t.pointPrecision]?t.pointPrecision:"schematic";this.style=xu[i],this.ret=t.direction==="return";const s=i==="schematic",a=new Set(t.schematicSegments||[]),r=(t.points||[]).map(M=>e.toWorld(M)),c=[],l=[];let h=0;for(let M=0;M+1<r.length;M++){const[b,_]=r[M],[S,E]=r[M+1],A=Math.hypot(S-b,E-_),w=Math.max(1,Math.ceil(A/J_)),y=s||a.has(M)?1:0;for(let T=0;T<w;T++){const L=T/w,I=(T+1)/w;c.push(b+(S-b)*L,_+(E-_)*L,b+(S-b)*I,_+(E-_)*I),l.push(h+A*L,h+A*I,y,0)}h+=A}this.total=h;const u=(M,b,_)=>{c.push(M[0],M[1],b[0],b[1]),l.push(_,_,0,1)};r.length>=2&&(u(r.at(-2),r.at(-1),h),this.ret&&u(r[1],r[0],0));const f=new Do;f.setAttribute("position",new De(new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),3)),f.setIndex([0,2,1,1,2,3]);const p=new Float32Array(c);f.setAttribute("aSeg",new Oe(p,4)),f.setAttribute("aInfo",new Oe(new Float32Array(l),4)),f.instanceCount=p.length/4;let g=1/0,v=-1/0,m=1/0,d=-1/0;for(const[M,b]of r)g=Math.min(g,M),v=Math.max(v,M),m=Math.min(m,b),d=Math.max(d,b);f.boundingSphere=new Ii(new B((g+v)/2,60,(m+d)/2),Math.hypot(v-g,d-m,300)/2+20),this.geometry=f;const x=vu[t.kind]||vu.schematic;this.colour=x,this.uniforms={...n,uResolution:{value:new Vt(1,1)},uWidth:{value:this.style.width},uHead:{value:9},uCamPos:{value:new B},uColor:{value:new Ht(...x)},uOpacity:{value:0},uDashLen:{value:30},uMarch:{value:0},uPulse:{value:-1e6},uPulseLen:{value:60},uPulseK:{value:this.style.pulse}},this.material=new Ce({vertexShader:ew,fragmentShader:nw,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),this.mesh=new ye(f,this.material),this.mesh.renderOrder=4,this.mesh.visible=!1,this.k=0,this.w=1,this.phase=aw(t.id||"")%1e3/1e3}dispose(){this.geometry.dispose(),this.material.dispose()}}function aw(o){let t=2166136261;for(let e=0;e<o.length;e++)t=Math.imul(t^o.charCodeAt(e),16777619);return t>>>0}class rw{constructor({routes:t=[],proj:e,uniforms:n,camera:i,renderer:s,eras:a=[]}){this.proj=e,this.shared=n,this.camera=i,this.renderer=s,this.eras=[...a].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),this.group=new Ge,this.group.name="routes",this.lines=[],this._res=new Vt,this._last=null,this.setRoutes(t)}setRoutes(t){for(const e of this.lines)this.group.remove(e.mesh),e.dispose();this.lines=[];for(const e of t||[]){if(!Array.isArray(e.points)||e.points.length<2)continue;const n=new ow(e,this.proj,this.shared);n.span&&(this.lines.push(n),this.group.add(n.mesh))}}windowAt(t){const e=this.eras;if(e.length<2)return[t-10,t+10];const n=s=>{if(s<=0)return e[0].year+s*(e[1].year-e[0].year);const a=e.length-1;if(s>=a)return e[a].year+(s-a)*(e[a].year-e[a-1].year);const r=Math.floor(s);return e[r].year+(s-r)*(e[r+1].year-e[r].year)};let i=0;if(t>=e.at(-1).year)i=e.length-1+(t-e.at(-1).year)/Math.max(1e-6,e.at(-1).year-e.at(-2).year);else if(t>e[0].year){for(let s=0;s+1<e.length;s++)if(t<=e[s+1].year){i=s+(t-e[s].year)/Math.max(1e-6,e[s+1].year-e[s].year);break}}return[n(i-.5),n(i+.5)]}visibleRoutes(){return this.lines.filter(t=>t.k>.5&&t.mesh.visible).map(t=>t.route)}update(t,e,{window:n,light:i=1,fill:s=0,section:a=null,all:r=!1}={}){const c=performance.now()/1e3,l=this._last===null?1:Math.max(0,Math.min(.1,c-this._last));this._last=c,this.apply(t,e,{win:n,light:i,fill:s,section:a,all:r},c,1-Math.exp(-l*4))}settle(t,e,{window:n,light:i=1,fill:s=0,section:a=null,all:r=!1}={}){this.apply(t,e,{win:n,light:i,fill:s,section:a,all:r},performance.now()/1e3,1)}apply(t,e,{win:n,light:i,fill:s,section:a,all:r},c,l){var m,d;const[h,u]=n||this.windowAt(t);this.renderer.getDrawingBufferSize(this._res);const f=this.renderer.getPixelRatio(),p=Qr(mu[0],mu[1],e),g=1-Qr(gu[0],gu[1],s),v=1-Qr(800,4e3,e);for(const x of this.lines){const[M,b]=x.span,_=!!a&&(((m=a.routes)==null?void 0:m.has(x.route.id))||((d=a.events)==null?void 0:d.has(x.route.event))),S=_||r&&b>=h&&M<=u?1:0;x.k+=(S-x.k)*l,Math.abs(S-x.k)<.003&&(x.k=S);const E=_&&!r?a.k??1:1;x.w+=(E-x.w)*l,Math.abs(E-x.w)<.003&&(x.w=E);const A=t>=M&&t<=b?1:.55,w=_&&!!a.focus,y=x.style.opacity*x.k*x.w*p*(w?1:g)*A;if(x.mesh.visible=y>.01,!x.mesh.visible)continue;const T=x.uniforms;T.uResolution.value.copy(this._res),T.uCamPos.value.copy(this.camera.position),T.uWidth.value=(x.style.width+.6*v)*f,T.uHead.value=(8+3*v)*f,T.uOpacity.value=y,T.uColor.value.setRGB(x.colour[0]*i,x.colour[1]*i,x.colour[2]*i),T.uPulseK.value=x.style.pulse*x.w,T.uDashLen.value=e*.016,T.uPulseLen.value=Math.min(x.total*.12,e*.035);const L=(c/Q_+x.phase)%1;T.uPulse.value=x.ret?(L<.5?L*2:2-L*2)*x.total:L*x.total,T.uMarch.value=x.ret?0:c*e*.012%(e*.016)}}dispose(){for(const t of this.lines)t.dispose();this.lines=[],this.group.clear()}}const ba=o=>String(o||"").normalize("NFD").replace(/[̀-ͯʻʼ'‘’]/g,"").toLowerCase();function td(o,t,e,n,i,s){const a=t/(n.x1-n.x0),r=e/(n.z1-n.z0),c=[];let l=1/0,h=-1/0;for(const v of i)for(let m=0;m+1<v.length;m++){const d=(v[m][0]-n.x0)*a,x=(v[m][1]-n.z0)*r,M=(v[m+1][0]-n.x0)*a,b=(v[m+1][1]-n.z0)*r;x!==b&&(c.push(x<b?[x,d,b,M]:[b,M,x,d]),l=Math.min(l,x,b),h=Math.max(h,x,b))}if(!c.length)return;c.sort((v,m)=>v[0]-m[0]);const u=[],f=Math.max(0,Math.floor(l)),p=Math.min(e-1,Math.ceil(h));let g=0;for(let v=f;v<=p;v++){const m=v+.5;for(u.length=0;g<c.length&&c[g][2]<=m&&c[g][0]<=m;)g++;for(let x=g;x<c.length;x++){const M=c[x];if(M[0]>m)break;M[2]<=m||u.push(M[1]+(m-M[0])/(M[2]-M[0])*(M[3]-M[1]))}u.sort((x,M)=>x-M);const d=v*t;for(let x=0;x+1<u.length;x+=2){const M=Math.max(0,Math.ceil(u[x]-.5)),b=Math.min(t-1,Math.floor(u[x+1]-.5));for(let _=M;_<=b;_++)o[d+_]=s}}}class cw{constructor(t,e,n,i=console.warn){var u,f;this.data=t,this.rect=e,this.uniforms=n,this.polities=new Map((t.polities.polities||[]).map(p=>[p.id,p]));const s=(((u=t.moku)==null?void 0:u.features)||[]).slice(0,255);(((f=t.moku)==null?void 0:f.features)||[]).length>255&&i("more than 255 moku: the overlay shows the first 255");const a=e.x1-e.x0,r=e.z1-e.z0,c=Math.min(4096,Math.ceil(Math.max(a,r)/1.5));this.W=Math.round(a>=r?c:c*a/r),this.H=Math.round(a>=r?c*r/a:c),this.grid=new Uint8Array(this.W*this.H),this.mokus=[null],s.forEach((p,g)=>{const v=p.properties||{},m=v.name??v.moku??"",d=v.islandId||Ea(v.island),x=p.geometry,M=(x==null?void 0:x.type)==="Polygon"?[x.coordinates]:(x==null?void 0:x.type)==="MultiPolygon"?x.coordinates:[];for(const b of M)td(this.grid,this.W,this.H,e,b.map(_=>_.map(S=>t.proj.toWorld(S))),g+1);this.mokus.push({index:g+1,name:m,island:v.island,islandKey:d,key:v.mokuKey||`${d}:${m}`,props:v})}),this.loose=new Map(this.mokus.slice(1).map(p=>[`${p.islandKey}:${ba(p.name)}`,p])),this.checkKeys(i);const l=new Ye(this.grid,this.W,this.H,Pi,de);l.minFilter=ie,l.magFilter=ie,l.unpackAlignment=1,l.needsUpdate=!0,this.idTex=l,this.palette=new Uint8Array(256*2*4);const h=new Ye(this.palette,256,2,Ae,de);h.minFilter=ie,h.magFilter=ie,h.needsUpdate=!0,this.palTex=h,n.uMokuId.value=l,n.uMokuRect.value.set(e.x0,e.z0,e.x1,e.z1),n.uPalette.value=h,this.eraKeys=[null,null]}checkKeys(t){const e=new Set(this.mokus.slice(1).map(i=>i.key)),n=new Set;for(const[i,s]of Object.entries(this.data.polities.byEra||{}))for(const a of Object.keys(s)){if(e.has(a))continue;const[r,...c]=a.split(":"),l=this.loose.get(`${Ea(r)}:${ba(c.join(":"))}`);n.add(l?`${a} (${i}; the boundary file spells it "${l.name}")`:`${a} (${i})`)}n.size&&t(`polities.json names moku the boundary file doesn't have: ${[...n].slice(0,12).join(", ")}${n.size>12?", …":""}`)}holder(t,e){var s;const n=t?(s=this.data.polities.byEra)==null?void 0:s[t.id]:null;if(!n)return null;let i=n[e.key];if(i===void 0)for(const[a,r]of Object.entries(n)){const[c,...l]=a.split(":");if(Ea(c)===e.islandKey&&ba(l.join(":"))===ba(e.name)){i=r;break}}return i?this.polities.get(i)||{id:i,name:i,colour:"#cccccc"}:null}setEras(t,e,n){const i=(t==null?void 0:t.id)??null,s=(e==null?void 0:e.id)??null;if(i!==this.eraKeys[0]||s!==this.eraKeys[1]){this.eraKeys=[i,s];const r=new Ht;this.palette.fill(0);for(const[c,l]of[[0,t],[1,e]])for(const h of this.mokus.slice(1)){const u=this.holder(l,h);if(!u)continue;r.set(u.colour||"#cccccc");const f=(c*256+h.index)*4;this.palette[f]=Math.round(r.r*255),this.palette[f+1]=Math.round(r.g*255),this.palette[f+2]=Math.round(r.b*255),this.palette[f+3]=255}this.palTex.needsUpdate=!0}const a=Math.max(0,Math.min(1,(n-.35)/.3));this.uniforms.uEraMix.value=t===e?0:a*a*(3-2*a)}mokuAt(t,e){const n=this.rect,i=Math.floor((t-n.x0)/(n.x1-n.x0)*this.W),s=Math.floor((e-n.z0)/(n.z1-n.z0)*this.H);return i<0||s<0||i>=this.W||s>=this.H?null:this.mokus[this.grid[s*this.W+i]]||null}politiesIn(t){const e=new Map;for(const n of this.mokus.slice(1)){const i=this.holder(t,n);i&&e.set(i.id,i)}return[...e.values()]}}const La=1848,Ro=[{id:"crown",name:"Crown",colour:"#f0b43c"},{id:"government",name:"Government",colour:"#5e9fd6"},{id:"konohiki",name:"Konohiki",colour:"#c7364f"},{id:"mixed",name:"Mixed",colour:"#a77fcf"},{id:"unknown",name:"Unknown",colour:"#b5b0a5",alpha:.85}],Mu=new Map(Ro.map((o,t)=>[o.id,t+1]));class lw{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.available=null,this.units=[],this.sources=null,this.built=!1,this.listeners=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){return this.loading?this.loading:(this.loading=(async()=>{var a;const t=this.data.abs("mahele.json");let e;try{const r=(a=this.data.ahupuaa)==null?void 0:a.features;if(!(r!=null&&r.length))throw new Error("no ahupuaʻa boundaries to lay it on");const c=await fetch(t);if(!c.ok)throw new Error(`HTTP ${c.status}`);if(e=await c.json(),!Array.isArray(e==null?void 0:e.ahupuaa))throw new Error("no ahupuaʻa in it")}catch(r){this.available=!1,this.warn(`${t}: ${r.message} (no Māhele view)`),this.notify();return}this.file=e,this.sources=new Set(e.sources||[]);const n=new Map(e.ahupuaa.map(r=>[r.gisId,r])),i=this.data.proj;let s=0;for(const r of this.data.ahupuaa.features){const c=r.properties||{},l=r.geometry,h=(l==null?void 0:l.type)==="Polygon"?[l.coordinates]:(l==null?void 0:l.type)==="MultiPolygon"?l.coordinates:[],u=n.get(c.gisId);u||s++;const f=Mu.has(u==null?void 0:u.class)?u.class:"unknown",p=h.map(v=>v.map(m=>m.map(d=>i.toWorld(d)))),g=[1/0,1/0,-1/0,-1/0];for(const v of p)for(const m of v)for(const[d,x]of m)g[0]=Math.min(g[0],d),g[1]=Math.min(g[1],x),g[2]=Math.max(g[2],d),g[3]=Math.max(g[3],x);this.units.push({gisId:c.gisId,name:(u==null?void 0:u.name)??c.name??c.ahupuaa,island:c.island||"",islandId:c.islandId||(u==null?void 0:u.islandId)||"",moku:c.moku||"",cls:f,entry:u||null,rings:p,box:g})}s&&this.warn(`mahele.json has no entry for ${s} of the ahupuaʻa (drawn as unknown)`),this.available=!0,this.notify()})(),this.loading)}build(){if(this.built||!this.available)return this.built;const t=this.app.polity.rect,e=this.app.polity.W,n=this.app.polity.H,i=new Uint8Array(e*n);for(const l of this.units)for(const h of l.rings)td(i,e,n,t,h,Mu.get(l.cls));const s=new Ye(i,e,n,Pi,de);s.minFilter=ie,s.magFilter=ie,s.unpackAlignment=1,s.needsUpdate=!0,s.onUpdate=()=>{s.image.data=null,s.onUpdate=null};const a=new Uint8Array(256*2*4),r=new Ht;Ro.forEach((l,h)=>{r.set(l.colour);for(const u of[0,1]){const f=(u*256+h+1)*4;a[f]=Math.round(r.r*255),a[f+1]=Math.round(r.g*255),a[f+2]=Math.round(r.b*255),a[f+3]=Math.round((l.alpha??1)*255)}});const c=new Ye(a,256,2,Ae,de);return c.minFilter=ie,c.magFilter=ie,c.needsUpdate=!0,this.idTex=s,this.palTex=c,this.rect=t,this.built=!0,!0}availableAt(t=this.app.timeline.year){return this.available!==!1&&t>=La}unitAt(t,e){for(const n of this.units){const i=n.box;if(!(t<i[0]||e<i[1]||t>i[2]||e>i[3])){for(const s of n.rings)if(hw(s,t,e))return n}}return null}counts(t=null){const e=Object.fromEntries(Ro.map(i=>[i.id,0]));let n=0;for(const i of this.units)t&&i.islandId!==t||(e[i.cls]++,n++);return{byClass:e,all:n}}}function hw(o,t,e){let n=!1;for(const i of o)for(let s=0,a=i.length-1;s<i.length;a=s++){const[r,c]=i[s],[l,h]=i[a];c>e!=h>e&&t<(l-r)*(e-c)/(h-c)+r&&(n=!n)}return n}const uw=new Date().getFullYear();function Ya(o,t=!1){if(o==null)return null;if(typeof o=="number")return o+(t?1:0);const e=String(o).match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!e)return null;const n=Number(e[1]);if(e[2]){const i=Number(e[2])-1+(t?1:0);return n+i/12}return n+(t?1:0)}const fw={day:0,month:0,year:0,decade:5,generation:12,century:50};function wc(o){const t=o.when||{};let e=Ya(t.from),n=Ya(t.to??t.from,!0);if(e===null&&n===null)return null;e===null&&(e=n-1),n===null&&(n=e+1);const i=fw[t.precision]??0;return i&&n-e<=1.01&&(e-=i,n+=i),[e,n]}function Ka(o){const t=o.when||{};return Ya(t.from)??Ya(t.to)}const ed=["generation","century","decade"];function nd(o){var e;const t=Ka(o);return t===null?"":So(Math.floor(t),ed.includes((e=o.when)==null?void 0:e.precision)?10:1)}function dw(o){const t=o.when||{},e=i=>{const s=String(i??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!s)return String(i??"");const a=["January","February","March","April","May","June","July","August","September","October","November","December"],r=Number(s[1]),c=r<0?`${-r} BCE`:String(r);return s[3]?`${Number(s[3])} ${a[Number(s[2])-1]} ${c}`:s[2]?`${a[Number(s[2])-1]} ${c}`:c},n=ed.includes(t.precision)?"c. ":"";return!t.to||t.to===t.from?`${n}${e(t.from)}`:`${n}${e(t.from)} – ${e(t.to)}`}class pw{constructor(t,{now:e=uw}={}){this.eras=[...t].filter(s=>Number.isFinite(s.year)).sort((s,a)=>s.year-a.year),this.s=0,this.listeners=[];const n=this.eras,i=n.at(-1);this.end=i?i.year:1800,this.tail=0,n.length>1&&i.year<e&&i.year+(i.yearPrecision??0)>=e&&(this.end=e,this.tail=(e-i.year)/Math.max(1e-6,i.year-n.at(-2).year))}get n(){return this.eras.length}get max(){return Math.max(0,this.n-1+this.tail)}get reachesNow(){return this.tail>0}eraAt(t){return this.eras[Math.round(Math.max(0,Math.min(this.n-1,t)))]||null}yearAt(t){const e=this.eras;if(!e.length)return 1800;if(e.length===1)return e[0].year+t*50;if(t<=0)return e[0].year+t*(e[1].year-e[0].year);if(t>=e.length-1)return e[e.length-1].year+(t-e.length+1)*(e[e.length-1].year-e[e.length-2].year);const n=Math.floor(t);return e[n].year+(t-n)*(e[n+1].year-e[n].year)}sAtYear(t){const e=this.eras;if(e.length<2||t<=e[0].year)return 0;for(let i=0;i+1<e.length;i++)if(t<=e[i+1].year)return i+(t-e[i].year)/Math.max(1e-6,e[i+1].year-e[i].year);const n=e.length-1;return Math.min(this.max,n+(t-e[n].year)/Math.max(1e-6,e[n].year-e[n-1].year))}get year(){return this.yearAt(this.s)}get era(){return this.eraAt(this.s)}get pair(){const t=Math.max(0,this.n-1),e=Math.max(0,Math.min(t,this.s)),n=Math.floor(e),i=Math.min(t,n+1);return{a:this.eras[n],b:this.eras[i],t:e-n}}get window(){return[this.yearAt(this.s-.5),this.yearAt(this.s+.5)]}set(t){const e=Math.max(0,Math.min(this.max,t));if(e!==this.s){this.s=e;for(const n of this.listeners)n(this)}}setYear(t){this.set(this.sAtYear(t))}onChange(t){this.listeners.push(t)}}function So(o,t=1){const e=Math.round(o),n=e<0?`${-e} BCE`:String(e);return t>=10?`c. ${n}`:n}const yu=[95,135],_u=6e3,mw=30,gw=1.5,wu=[4,40],vw=2,bu=ce,Pa=(o,t,e)=>Math.hypot(Math.max(o.x0-t,0,t-o.x1),Math.max(o.z0-e,0,e-o.z1));class xw{constructor(t){this.app=t,this.group=new Ge,this.group.name="towns",this.group.visible=!1,t.scene.add(this.group),this.islands=new Map,this.yearNow=t.timeline.year,this.version=0,this.hidden=!1,this.show=0,this.yieldU={uYieldRect:{value:new ee(0,0,-1,-1)},uYield:{value:0}},this.manifest=null,t.updaters.push(e=>this.update(e))}layers(){return this.manifest??(this.manifest=fetch(this.app.data.abs("layers/manifest.json")).then(t=>{if(!t.ok)throw new Error(`layers/manifest.json: HTTP ${t.status}`);return t.json()})),this.manifest}updateYield(){var i,s;const t=this.app.districts,e=t==null?void 0:t.cur,n=this.yieldU;if(t!=null&&t.on&&((s=(i=e==null?void 0:e.features)==null?void 0:i.settlements)!=null&&s.ready)){const a=e.d.rect;n.uYieldRect.value.set(a.x0+Qi,a.z0+Qi,a.x1-Qi,a.z1-Qi),n.uYield.value=t.k}else n.uYieldRect.value.set(0,0,-1,-1),n.uYield.value=0}update(t,e=Xt((this.app.frameAvg??16)*.25,wu[0],wu[1])){const n=this.app,i=n.timeline.year;t>0?(this.yearNow+=(i-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(i-this.yearNow)<.05&&(this.yearNow=i)):this.yearNow=i;const s=n.rig.state.distance;let a=1-bu(yu[0],yu[1],s);(this.hidden||!n.islandsLoaded)&&(a=0),this.show=a,this.group.visible=a>.001,this.updateYield();const r=performance.now();if(this.group.visible){const c=n.rig.state.target,l=qf(s);this.R=l;const h=performance.now();for(const u of n.world.islands){let f=this.islands.get(u.pack.id);const p=u.slot>=0?u.k:0;if(p<=.02||Pa(u.pack.rect,c.x,c.z)>l){f&&f.hide();continue}f||(f=new zs(this,u),this.islands.set(u.pack.id,f)),f.lastSeen=r,f.update(c,l,a*bu(.6,.95,p),Math.max(.5,e-(performance.now()-h)))}}else for(const c of this.islands.values())c.hide();for(const[c,l]of this.islands)this.hidden?l.lastSeen=Math.max(l.lastSeen,r):r-l.lastSeen>mw*1e3&&(l.dispose(),this.islands.delete(c))}settle(){this.update(0,1/0)}get idle(){if(!this.group.visible)return!0;for(const t of this.islands.values())if(t.active&&!t.idle)return!1;return!0}stampInto(t,e,n){for(const i of this.islands.values())i.stampInto(t,e,n)}alive(t=this.yearNow,e=null,n=null,i=1/0){const s=[];for(const a of this.islands.values())s.push(...a.alive(t,e,n,i));return s}census(t=this.yearNow,e=null,n=null,i=1/0){return Yf(this.alive(t,e,n,i))}stats(){return{show:+this.show.toFixed(2),year:+this.yearNow.toFixed(1),yield:+this.yieldU.uYield.value.toFixed(2),islands:[...this.islands.values()].map(t=>t.stats()),drawn:[...this.islands.values()].reduce((t,e)=>t+e.drawn,0)}}}class zs extends Vf{constructor(t,e){super(t.app),this.towns=t,this.t=e,this.id=e.pack.id,this.group=new Ge,this.group.name=`towns ${this.id}`,this.group.visible=!1,t.group.add(this.group),this.tiles=new Map,this.ready=!1,this.failed=null,this.active=!1,this.drawn=0,this.pending=0,this.lastSeen=performance.now(),this.times={build:0,tiles:0},this.load().catch(n=>{this.failed=n.message,this.app.warn(`towns ${this.id}: ${n.message} (its settlements are not drawn)`)})}async load(){var d,x,M,b,_,S,E;const t=performance.now(),e=this.app,n=await this.towns.layers(),i=(d=n.islands)==null?void 0:d[this.id];if(!i)throw new Error("no settlement layer");this.setLayers(n);const s=this.layerFiles(i);if(this.keyframes.length<2||s.some(A=>!A.settlement))throw new Error("the settlement layer lacks a keyframe");const a=A=>Co(Zn,e.data.abs(`layers/${A}`)),[r,c,l,h]=await Promise.all([Promise.all(s.map(A=>a(A.settlement))),s.every(A=>A.value)?Promise.all(s.map(A=>a(A.value))).catch(()=>null):null,Hf(e,n,this.id),((x=e.patches)==null?void 0:x.ready)??[]]);if(this.disposed)return;const u=this.t,{W:f,H:p}=u;for(const A of[...r,...c||[]])if(A.W!==f||A.H!==p)throw new Error(`a layer is ${A.W}×${A.H}, the pack ${f}×${p}`);const g=u.pack.rect;this.rect=g,this.islandRect=g,this.crop={x0:g.x0,z0:g.z0,sx:(g.x1-g.x0)/f,sz:(g.z1-g.z0)/p,w:f,h:p},this.bytes=r.map(A=>A.px),this.values=c?c.map(A=>A.px):null,this.zoning={...l,rect:g},this.places=Xf(e,n),this.townTerm(n,this.id,"district"),this.needPatches=(h||[]).some(A=>A.pack===this.id),this.features=[];for(const A of((M=e.districts)==null?void 0:M.list)||[])if(A.parent===this.id)for(const{f:w}of A.rastered){const y=(((_=(b=w.geometry)==null?void 0:b.coordinates)==null?void 0:_[0])||[]).map(I=>e.data.proj.toWorld(I));if(y.length<3)continue;const T=y.map(I=>I[0]),L=y.map(I=>I[1]);this.features.push({ring:y,p:w.properties||{},box:[Math.min(...T),Math.min(...L),Math.max(...T),Math.max(...L)]})}if(await new Promise(A=>setTimeout(A,0)),this.disposed||(this.grounds(),await new Promise(A=>setTimeout(A,0)),this.disposed))return;const v=new Set;for(const A of((E=(S=e.patches)==null?void 0:S.byPack)==null?void 0:E.get(this.id))||[])v.add(A.until);for(const A of h||[])A.pack===this.id&&v.add(A.until);for(const A of this.features){const[w,y]=ko(A.p);Number.isFinite(w)&&v.add(w),Number.isFinite(y)&&v.add(y+1)}this.years(v);const m=e.timeline.yearAt(0);this.epochYear=[m,...this.edges],this.kits=Bf(qa(1820),Xc),this.meshes(),this.salt=1+e.world.islandPacks.findIndex(A=>A.id===this.id),this.loadMs=Math.round(performance.now()-t),this.ready=!0}grounds(){const t=this.t,{W:e,H:n}=t,i=this.rect,s=(i.x1-i.x0)*100/e,a=(i.z1-i.z0)*100/n;this.mx=s,this.mz=a;const r=t.heights,c=hn(e,n,m=>r[m]<=0,s,a);this.sea=c,this.broad=zn(Float32Array.from(c,m=>Math.min(m,3e3)),e,n,Math.max(1,Math.round(290/s)),3);const l=Fu(r,e,n,s,a),h=new Uint8Array(e*n);for(let m=0;m<e*n;m++)h[m]=l[m]>=vw&&r[m]>0?1:0;this.streamOn=h,this.toStream=hn(e,n,m=>h[m]===1,s,a);const u=Math.ceil((i.x1-i.x0)/Wt),f=Math.ceil((i.z1-i.z0)/Wt);this.tw=u,this.th=f;const p=new Float32Array(u*f),g=this.zoning;for(let m=0;m<n;m++){const d=Math.min(f-1,Math.floor((m+.5)*this.crop.sz/Wt));for(let x=0;x<e;x++){const M=m*e+x;if(r[M]<=0)continue;const b=Math.min(u-1,Math.floor((x+.5)*this.crop.sx/Wt));let _=0;for(const E of this.bytes)_=Math.max(_,E[M]);if(g.zoning){const E=i.x0+(x+.5)*this.crop.sx,A=i.z0+(m+.5)*this.crop.sz;Xa[wo(g.zoning,i,E,A)]&&(_=255)}const S=d*u+b;_>p[S]&&(p[S]=_)}}const v=p.slice();for(let m=0;m<f;m++)for(let d=0;d<u;d++)for(let x=-1;x<=1;x++)for(let M=-1;M<=1;M++){const b=d+M,_=m+x;b>=0&&_>=0&&b<u&&_<f&&(v[m*u+d]=Math.max(v[m*u+d],p[_*u+b]-20))}this.most=v,this.ths=new Map}grid(t,e,n){const i=this.crop,s=Xt(Math.floor((e-i.x0)/i.sx),0,i.w-1),a=Xt(Math.floor((n-i.z0)/i.sz),0,i.h-1);return t[a*i.w+s]}mauka(t,e){const n=e*this.tw+t;let i=this.ths.get(n);if(i!==void 0)return i;const s=this.rect.x0+(t+.5)*Wt,a=this.rect.z0+(e+.5)*Wt,r=this.crop,c=this.broad,l=(m,d)=>c[Xt(d,0,r.h-1)*r.w+Xt(m,0,r.w-1)],h=Math.round((s-r.x0)/r.sx-.5),u=Math.round((a-r.z0)/r.sz-.5),f=Math.max(2,Math.round(240/this.mx)),p=l(h+f,u)-l(h-f,u),g=l(h,u+f)-l(h,u-f),v=Math.PI/60;return i=Math.hypot(p,g)<.001?Math.PI/2:Math.round(Math.atan2(g,p)/v)*v,this.ths.set(n,i),i}owns(t,e){const n=s=>Math.min(t-s.x0,s.x1-t,e-s.z0,s.z1-e),i=n(this.rect);for(const s of this.app.world.islandPacks)if(s.id!==this.id&&n(s.rect)>i)return!1;return i>0}weight(t,e){const n=this.t,i=this.crop.sx,s=this.crop.sz,a=Math.hypot((n.metresAt(t+i,e)-n.metresAt(t-i,e))/(2*this.mx),(n.metresAt(t,e+s)-n.metresAt(t,e-s))/(2*this.mz));return(.55+.8*Math.max(Math.exp(-this.grid(this.sea,t,e)/700),Math.exp(-this.grid(this.toStream,t,e)/160)))*(1-.6*ce(.08,.35,a))}allows(t,e,n){const{x:i,z:s,ax:a,az:r,a:c}=t,l=this.epochYear[n],h=this.t,u=Math.cos(c),f=-Math.sin(c),p=[u,f],g=[-f,u];let v=1/0,m=-1/0,d=-1/0;this.dep=!1;const x=this.patchBoxes,M=this.featBox,b=this.patchBox;for(let _=0;_<13;_++){const S=_===0?0:_<5?[-1,1,1,-1][_-1]:_<9?[0,1,0,-1][_-5]:[-1,1,1,-1][_-9],E=_===0?0:_<5?[-1,-1,1,1][_-1]:_<9?[-1,0,1,0][_-5]:[-1,-1,1,1][_-9],A=_>=9?1.25:1,w=i+(p[0]*S*a+g[0]*E*r)*A,y=s+(p[1]*S*a+g[1]*E*r)*A;if(w>=M[0]&&y>=M[1]&&w<=M[2]&&y<=M[3])for(const I of this.features){const R=I.box;if(!(w<R[0]||y<R[1]||w>R[2]||y>R[3])&&h_(I.ring,w,y)&&(this.dep=!0,Uo(I.p,l)))return null}if(_>=9)continue;if(this.grid(this.streamOn,w,y))return null;const T=h.metresAt(w,y);let L=T;if(w>=b[0]&&y>=b[1]&&w<=b[2]&&y<=b[3])for(const I of x){const R=I.box;if(!(w<R[0]||y<R[1]||w>R[2]||y>R[3])&&!(this.app.patches.maskAt(I.crop,(w-R[0])/(R[2]-R[0]),(y-R[1])/(R[3]-R[1]))<=0)){this.dep=!0,L=$f(this.app,h,w,y,l);break}}if(L<.6)return null;v=Math.min(v,T),m=Math.max(m,T),d=Math.max(d,L)}return m-v>e?null:d}buildTile(t,e){var E;const n=performance.now(),i=this.rect,s=i.x0+t*Wt,a=i.z0+e*Wt,r={ti:t,tj:e,n:0,x0:s,z0:a},c=`${t},${e}`;if(this.tiles.set(c,r),this.most[e*this.tw+t]<1)return r.empty=!0,r;const l=this.mauka(t,e),h=(A,w)=>A<0||w<0||A>=this.tw||w>=this.th?NaN:this.mauka(A,w),u=[h(t-1,e)!==l,h(t+1,e)!==l,h(t,e-1)!==l,h(t,e+1)!==l],f=this.salt*1000003+e*4099+t|0,p=new Float32Array(this.keyframes.length),g=new Float32Array(this.keyframes.length),v=this.zoning,m=(A,w)=>this.owns(A,w)&&this.t.metresAt(A,w)>.3,d=[];for(const A of this.tileLots(s,a,l,f,u,m)){this.bytesAt(A.x,A.z,p);let w=0;for(const R of p)w=Math.max(w,R);A.zone=wo(v.zoning,v.rect,A.x,A.z),A.lud=wo(v.lud,v.rect,A.x,A.z),A.zoned=!!v.zoning;const y=Xa[A.zone];y&&(w=Math.max(w,255*Math.log(1+y/this.d0)/this.L+5));const T=this.fillMax(this.people(w));if(A.rank>=T*1.5&&!(A.anchor&&A.rankY<T*1.5)||(A.w=this.weight(A.x,A.z)*(.85+.3*ja(A.x/2.3,A.z/2.3,73)),A.rank>=T*A.w&&!(A.anchor&&A.rankY<T*A.w)))continue;A.b=Float32Array.from(p),this.values&&(A.vb=Float32Array.from(this.sample(this.values,A.x,A.z,g,0)));const L=Math.exp(-this.grid(this.sea,A.x,A.z)/600),I=jf(this.places,A.x,A.z,L);A.coast=L,A.harbour=I.harbour,A.centre=I.centre,d.push(A)}const x=[],M=(A,w,y)=>this.allows(A,w,y),b=()=>1,_=A=>x.push(A);for(const A of d)this.scatterLot(A,M,b,_);const S=x.length;if(r.n=S,r.lots=d.length,S){const A=qa(f),w=Int32Array.from({length:S},(y,T)=>T);for(let y=S-1;y>0;y--){const T=Math.floor(A()*(y+1)),L=w[y];w[y]=w[T],w[T]=L}r.order=w,r.pos=new Float32Array(S*4),r.scale=new Float32Array(S*3),r.spans=new Float32Array(S*4),r.cols=new Float32Array(S*3),r.vOf=new Uint16Array(S),r.kind=new Uint8Array(S),r.site=new Int32Array(S),x.forEach((y,T)=>{r.pos.set([y.x,y.y,y.z,y.a],T*4),r.scale.set([y.sh,y.sv,y.stretch],T*3),r.spans.set(y.span,T*4),r.cols.set(y.colour,T*3),r.vOf[T]=this.byKey.get(y.kind*16+y.variant),r.kind[T]=y.kind,r.site[T]=y.site})}for(const A of((E=this.app.districts)==null?void 0:E.list)||[])Pa(A.rect,s+Wt/2,a+Wt/2)<Wt&&this.towns.version++;return this.times.tiles++,this.times.build+=performance.now()-n,r}update(t,e,n,i){var d,x,M,b;if(this.active=!0,this.show=n,!this.ready){this.pending=1;return}if(this.needPatches&&!((d=this.app.patches)!=null&&d.loaded)){this.pending=1;return}this.patchBoxes||(this.patchBoxes=((M=(x=this.app.patches)==null?void 0:x.byPack)==null?void 0:M.get(this.id))||[],this.patchBox=this.patchBoxes.reduce((_,S)=>[Math.min(_[0],S.box[0]),Math.min(_[1],S.box[1]),Math.max(_[2],S.box[2]),Math.max(_[3],S.box[3])],[1/0,1/0,-1/0,-1/0]),this.featBox=this.features.reduce((_,S)=>[Math.min(_[0],S.box[0]),Math.min(_[1],S.box[1]),Math.max(_[2],S.box[2]),Math.max(_[3],S.box[3])],[1/0,1/0,-1/0,-1/0]));const s=this.rect,a=Xt(Math.floor((t.x-e-s.x0)/Wt),0,this.tw-1),r=Xt(Math.floor((t.x+e-s.x0)/Wt),0,this.tw-1),c=Xt(Math.floor((t.z-e-s.z0)/Wt),0,this.th-1),l=Xt(Math.floor((t.z+e-s.z0)/Wt),0,this.th-1),h=[],u=this.towns.yieldU,f=u.uYieldRect.value,p=u.uYield.value>=.999;for(let _=c;_<=l;_++)for(let S=a;S<=r;S++){if(this.tiles.has(`${S},${_}`))continue;const E=s.x0+(S+.5)*Wt,A=s.z0+(_+.5)*Wt;if(p&&E-Wt/2>f.x&&A-Wt/2>f.y&&E+Wt/2<f.z&&A+Wt/2<f.w)continue;const w=Math.hypot(E-t.x,A-t.z);w>e+Wt||h.push([w,S,_])}h.sort((_,S)=>_[0]-S[0]);const g=performance.now();let v=0;for(const[,_,S]of h){if(v&&performance.now()-g>i)break;this.buildTile(_,S),v++}this.pending=h.length-v;const m=e*gw+Wt;for(const[_,S]of this.tiles){const E=S.x0+Wt/2,A=S.z0+Wt/2;if(!(Math.hypot(E-t.x,A-t.z)<=m)&&(this.tiles.delete(_),S.n))for(const w of((b=this.app.districts)==null?void 0:b.list)||[])Pa(w.rect,E,A)<Wt&&this.towns.version++}this.group.visible=n>.001,this.group.visible&&(this.material.uniforms.uShow.value=n,this.material.uniforms.uYearNow.value=this.towns.yearNow,this.material.uniforms.uFadeNear.value=e*.75,this.material.uniforms.uFadeFar.value=e,this.refresh(this.app.camera,e,this.t.pack.data.hi*this.app.world.uniforms.uVert.value+3,v>0))}get idle(){return!!(this.ready||this.failed)&&!this.pending}hide(){this.active=!1,this.group.visible=!1,this.drawn=0,this.key=""}meshes(){this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new ee(0,0,0,0))},uShadeS:{value:this.t.shadow.texture},uShadeRect:{value:this.t.rect},uYearNow:{value:this.towns.yearNow},...this.towns.yieldU},this.material=To(this.app.shared,this.own,{fade:[50,70],grow:!0,yield:!0}),this.variants=[],this.byKey=new Map;for(const t of qn)this.kits[t].forEach((e,n)=>{this.byKey.set(Dt[t]*16+n,this.variants.length),this.variants.push({name:t,v:n,kit:e,cap:0,mesh:null})});this.frustum=new ki,this.pv=new se,this.box=new bn,this.m4=new se,this.q=new Di,this.up=new B(0,1,0),this.v3=new B,this.s3=new B,this.key="",this.yearDrawn=NaN}room(t,e){if(t.cap>=e&&t.mesh)return;const n=Math.min(_u,Math.max(64,t.cap*2,e));t.mesh&&(this.group.remove(t.mesh),t.mesh.dispose());const i=t.kit.geometry,s=new Uc(i,this.material,n);s.name=`${t.name}-${t.v}`,s.count=0,s.frustumCulled=!1,s.instanceMatrix.setUsage(wn),s.instanceColor=new Oe(new Float32Array(n*3),3),s.instanceColor.setUsage(wn);const a=new Oe(new Float32Array(n*4),4);a.setUsage(wn);const r=new Oe(new Float32Array(n),1);r.setUsage(wn),i.setAttribute("aSpan",a),i.setAttribute("aStretch",r),Object.assign(t,{mesh:s,cap:n,aSpan:a,aStretch:r}),this.group.add(s)}static aliveNear(t,e,n){const i=t.spans;return i[e*4]<n+1&&i[e*4+3]>n-1}refresh(t,e,n,i){const s=this.towns.yearNow,a=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const r=e*.7,c=[],l=this.towns.yieldU,h=l.uYieldRect.value,u=l.uYield.value>=.999;let f="";for(const S of this.tiles.values()){if(!S.n)continue;this.box.min.set(S.x0,-.5,S.z0),this.box.max.set(S.x0+Wt,n,S.z0+Wt);const E=this.box.distanceToPoint(a);if(E>e||!this.frustum.intersectsBox(this.box)||u&&S.x0>h.x&&S.z0>h.y&&S.x0+Wt<h.z&&S.z0+Wt<h.w)continue;const A=E<r?1:r/E;c.push([S,Math.round(A*20)]),f+=`${S.ti},${S.tj}:${c[c.length-1][1]};`}const p=this.app.districts,g=!!(p!=null&&p.on);if(f+=`${u?1:0}${g?1:0}`,!i&&f===this.key&&Math.abs(s-this.yearDrawn)<.5)return;this.key=f,this.yearDrawn=s;let v=0;const m=[];for(const[S,E]of c){let A=0;for(let w=0;w<S.n;w++)zs.aliveNear(S,w,s)&&A++;m.push(A),v+=Math.ceil(A*E/20)}const d=Math.min(1,_u/Math.max(1,v)),x=new Int32Array(this.variants.length),M=[];c.forEach(([S,E],A)=>{const w=Math.ceil(m[A]*E*d/20);let y=0;for(let T=0;T<S.n&&y<w;T++){const L=S.order[T];zs.aliveNear(S,L,s)&&(u&&S.pos[L*4]>h.x&&S.pos[L*4+2]>h.y&&S.pos[L*4]<h.z&&S.pos[L*4+2]<h.w||(M.push(S,L),x[S.vOf[L]]++,y++))}}),this.variants.forEach((S,E)=>{x[E]&&this.room(S,x[E]),S.c=0});const b=g?p.cur.d.rect:null,_=this.app.world;for(let S=0;S<M.length;S+=2){const E=M[S],A=M[S+1],w=this.variants[E.vOf[A]];if(w.c>=w.cap)continue;const y=w.c++;let T=E.pos[A*4+1];const L=E.pos[A*4],I=E.pos[A*4+2];if(b&&L>b.x0&&I>b.z0&&L<b.x1&&I<b.z1){const R=w.kit,k=E.scale[A*3];let F=-1/0;for(const[G,W]of[[0,0],[-1,-1],[1,-1],[1,1],[-1,1]])F=Math.max(F,_.metresAt(L+G*R.hx*k,I+W*R.hz*k));T=Math.max(T,ui(F)+Gf)}this.q.setFromAxisAngle(this.up,E.pos[A*4+3]),this.v3.set(L,T,I),this.s3.set(E.scale[A*3],E.scale[A*3+1],E.scale[A*3]),this.m4.compose(this.v3,this.q,this.s3),this.m4.toArray(w.mesh.instanceMatrix.array,y*16),w.mesh.instanceColor.array.set(E.cols.subarray(A*3,A*3+3),y*3),w.aSpan.array.set(E.spans.subarray(A*4,A*4+4),y*4),w.aStretch.array[y]=E.scale[A*3+2]}this.drawn=0;for(const S of this.variants)S.mesh&&(S.mesh.count=S.c,S.mesh.visible=S.c>0,S.mesh.instanceMatrix.needsUpdate=!0,S.mesh.instanceColor.needsUpdate=!0,S.aSpan.needsUpdate=!0,S.aStretch.needsUpdate=!0,this.drawn+=S.c)}static weightAt(t,e,n){const i=t.spans;return ce(i[e*4],i[e*4+1],n)*(1-ce(i[e*4+2],i[e*4+3],n))}stampInto(t,e,n){if(this.ready){for(const i of this.tiles.values())if(!(!i.n||i.x0>t.x1||i.z0>t.z1||i.x0+Wt<t.x0||i.z0+Wt<t.z0))for(let s=0;s<i.n;s++){const a=i.pos[s*4],r=i.pos[s*4+2];if(Math.min(a-t.x0,t.x1-a,r-t.z0,t.z1-r)>Qi)continue;const c=zs.weightAt(i,s,e);if(c<.02)continue;const l=this.variants[i.vOf[s]].kit,h=i.scale[s*3];n(a,r,i.pos[s*4+3],l.hx*h*.95,l.hz*h*.95,Math.round(255*c))}}}alive(t,e=null,n=null,i=1/0){const s=[];if(!this.ready)return s;for(const a of this.tiles.values())if(a.n&&!(e!==null&&Pa({x0:a.x0,z0:a.z0,x1:a.x0+Wt,z1:a.z0+Wt},e,n)>i))for(let r=0;r<a.n;r++){if(zs.weightAt(a,r,t)<.999)continue;const c=a.pos[r*4],l=a.pos[r*4+2];if(e!==null&&Math.hypot(c-e,l-n)>i)continue;const h=this.variants[a.vOf[r]],u=a.scale[r*3];s.push({island:this.id,site:a.site[r]+a.ti*1e5+a.tj*1e9,kind:h.name,variant:h.v,x:c,z:l,a:a.pos[r*4+3],ax:h.kit.hx*u,az:h.kit.hz*u,box:h.kit.box.map(f=>f*u),y:a.pos[r*4+1],height:h.kit.top*a.scale[r*3+1]})}return s}stats(){var s;let t=0,e=0,n=0,i=0;for(const a of this.tiles.values()){t+=a.n,e+=a.lots||0,a.empty||i++;for(const r of["order","pos","scale","spans","cols","vOf","kind","site"])n+=((s=a[r])==null?void 0:s.byteLength)||0}if(this.ready)for(const a of[this.sea,this.broad,this.toStream,this.streamOn,this.most,...this.bytes])n+=a.byteLength;return{island:this.id,ready:this.ready,failed:this.failed,tiles:this.tiles.size,worked:i,pending:this.pending,lots:e,instances:t,drawn:this.drawn,triangles:(this.variants||[]).reduce((a,r)=>a+(r.mesh?r.mesh.count*r.kit.tris:0),0),zoning:this.zoning?{zoning:this.zoning.zoning?`${this.zoning.zoning.W}×${this.zoning.zoning.H}`:null,lud:this.zoning.lud?`${this.zoning.lud.W}×${this.zoning.lud.H}`:null}:null,value:this.values?"mask":"modelled",towns:this.townTerms??null,loadMs:this.loadMs??null,buildMs:Math.round(this.times.build),msPerTile:this.times.tiles?+(this.times.build/this.times.tiles).toFixed(2):null,cpuMB:+(n/1048576).toFixed(1)}}dispose(){var t,e;this.disposed=!0,this.towns.group.remove(this.group);for(const n of this.variants||[])(t=n.mesh)==null||t.dispose(),n.kit.geometry.dispose();(e=this.material)==null||e.dispose(),this.tiles.clear()}}const id=(o,t,e)=>{const n=Math.max(0,Math.min(1,(e-o)/(t-o)));return n*n*(3-2*n)},tc=["chiefdoms","land","mahele"],bc=o=>id(260,900,o),Da=o=>id(90,300,o);class Mw{constructor(t,e,{warn:n=console.warn}={}){this.canvas=t,this.data=e,this.warn=n,this.params=new URLSearchParams(location.search);const i=new mf({canvas:t,antialias:!1,powerPreference:"high-performance"});i.setClearColor(0,1),i.info.autoReset=!1,this.renderer=i,this.pipeline=new tx(i),this.scene=new ir,this.camera=new _n(42,1,.1,9e3),this.light={sunDir:new B(0,1,0),sunColor:new Ht,skyColor:new Ht,groundColor:new Ht,moonDir:new B(0,-1,0),moonColor:new Ht,zenith:new Ht,horizon:new Ht,sunHorizon:new Ht,night:0},this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uSkyMap:{value:null},uMokuId:{value:null},uMokuRect:{value:new ee(0,0,1,1)},uPalette:{value:null},uEraMix:{value:0},uPolityK:{value:0},uHoverMoku:{value:0}}},this.world=new ux(this,e),Object.assign(this.shared.uniforms,this.world.uniforms),this.world.uniforms=this.shared.uniforms,this.patches=new hx(this),this.timeline=new pw(e.eras),this.polity=new cw(e,this.world.archPack.rect,this.shared.uniforms,n),this.land=new Jy(this),this.mahele=new lw(this),this.regionOn="chiefdoms",this.overlay={lines:!0,pins:!0,routes:!1};const s=this.params.get("view");this.view=tc.includes(s)?s:s==="none"?null:"chiefdoms",this.viewChosen=tc.includes(s)||s==="none",this.viewListeners=[],this.polityK=0,this.landK=0,this.sky=new B_,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??15.6)},this.time=0,this.frames=0,this.updaters=[]}start(){this.world.setArchipelago(this.world.archPack),this.scene.add(this.world.group),this.districts=new __(this),this.world.district=this.districts,this.towns=new xw(this),this.ocean=new E_(this.shared,this.shared.uniforms),this.scene.add(this.ocean.mesh),this.lines=new Z_(this.data,this.shared.uniforms),this.scene.add(this.lines.group),this.routes=new rw({proj:this.data.proj,uniforms:this.shared.uniforms,camera:this.camera,renderer:this.renderer,eras:this.data.eras}),this.scene.add(this.routes.group),sw(this.data,this.warn).then(a=>this.routes.setRoutes(a)),this.mahele.load(),this.rig=new $_(this.camera,this.canvas,this.world);const t=this.params.get("cam");if(t){const[a,r,c,l,h]=t.split(",").map(Number);this.rig.jump({x:a,z:r,distance:c,yaw:l,pitch:h})}const e=this.params.get("year");e?this.timeline.setYear(Number(e)):t?this.timeline.set(Math.round(this.timeline.sAtYear(1778))):this.timeline.set(0),this.timeline.onChange(()=>this.syncEras()),this.syncEras(),this.sky.update(this.clock.doy,this.clock.hour,0,this.light);const n=this.renderer.getContext(),i=n.getExtension("WEBGL_debug_renderer_info"),s=i?String(n.getParameter(i.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(s),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.params.get("debug")&&this.world.setDebug(Number(this.params.get("debug"))),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}setView(t,{user:e=!1}={}){e&&(this.viewChosen=!0);const n=tc.includes(t)?t:null;if(n!==this.view){this.view=n;for(const i of this.viewListeners)i(n)}}get farView(){return this.view==="mahele"&&!this.mahele.availableAt(this.timeline.year)?"chiefdoms":this.view}region(t){if(t===this.regionOn||this.polityK>.004||t==="mahele"&&!this.mahele.build())return;const e=t==="mahele"?this.mahele:this.polity,n=this.shared.uniforms;n.uMokuId.value=e.idTex,n.uPalette.value=e.palTex,n.uMokuRect.value.set(e.rect.x0,e.rect.z0,e.rect.x1,e.rect.z1),this.regionOn=t}regionZoom(t,e){return t!==this.regionOn?0:t==="mahele"?Da(e):t==="chiefdoms"?bc(e):0}onView(t){this.viewListeners.push(t)}islandFill(){const t=this.rig.state,e=t.target;let n=null,i=0;for(const r of this.world.islandPacks){const c=r.rect,l=Math.min(e.x-c.x0,c.x1-e.x,e.z-c.z0,c.z1-e.z);l>i&&(i=l,n=r)}if(!n)return 0;const s=2*t.distance*Math.tan(this.camera.fov*Math.PI/360),a=n.rect;return Math.max((a.x1-a.x0)/(s*this.camera.aspect),(a.z1-a.z0)/s)}routeSection(){var s;const t=this.tour,e=(s=this.ui)==null?void 0:s.card;let n=null;t!=null&&t.active&&t.event?n=t.event:!(t!=null&&t.active)&&(e==null?void 0:e.mode)==="event"&&e.ev&&(n=e.ev);const i=n?`ev:${n.id}`:"";return i!==this._routeKey&&(this._routeKey=i,this._routeSection=n?{routes:new Set(n.routes||[]),events:new Set([n.id]),k:1,focus:!0}:null),this._routeSection}routeOptions(t){return{window:this.timeline.window,fill:this.islandFill(),section:this.routeSection(),all:this.overlay.routes===!0,...t}}addIsland(t){const e=this.world.addIsland(t);this.land.attach(e),e.applyRange(this.qset.range),this.params.get("debug")&&(e.uniforms.uDebug.value=Number(this.params.get("debug")))}settle(){var n,i,s,a;(n=this.ui)==null||n.timeline.finish(),this.rig.finishFlight();const t=this.rig.goal;for(const r of[this.rig.goal,this.rig.state])r.target.copy(t.target),r.distance=t.distance,r.yaw=t.yaw,r.pitch=t.pitch;this.world.update(this.camera,t.distance,0),this.world.settle(this.camera),(i=this.districts)==null||i.settle(this.camera,t.distance),(s=this.towns)==null||s.settle(),this.rig.jump({x:t.target.x,z:t.target.z});const e=this.farView;(e==="chiefdoms"||e==="mahele")&&(this.polityK=0,this.region(e)),this.polityK=this.regionZoom(e,t.distance),this.landK=e==="land"?Da(t.distance):0,this.shared.uniforms.uPolityK.value=this.polityK,this.land.settle(this.landK),(a=this.routes)==null||a.settle(this.timeline.year,t.distance,this.routeOptions())}stats(){const t=this.renderer.info;return{...this.world.stats(),view:this.view,farView:this.farView,frameMs:+(this.frameAvg??0).toFixed(1),calls:t.render.calls,triangles:t.render.triangles,textures:t.memory.textures,quality:this.quality.level}}syncEras(){const{a:t,b:e,t:n}=this.timeline.pair;this.polity.setEras(t,e,n)}applyQuality(){const t=[{range:3,dpr:1},{range:3.8,dpr:1.25},{range:4.6,dpr:1.5},{range:5.5,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.world.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.frameAvg=this.frameAvg===void 0?e*1e3:this.frameAvg+(e*1e3-this.frameAvg)*.1,this.renderer.info.reset(),this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.clock;this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t);const n=this.rig.state.distance;this.world.update(this.camera,n,t),this.ocean.update(this.camera);const i=1-Math.exp(-t*5),s=this.farView;(s==="chiefdoms"||s==="mahele")&&this.region(s);const a=this.regionZoom(s,n);this.polityK+=(a-this.polityK)*i,Math.abs(a-this.polityK)<.001&&(this.polityK=a),this.shared.uniforms.uPolityK.value=this.polityK;const r=s==="land"?Da(n):0;this.landK+=(r-this.landK)*i,this.land.update(t,this.landK),this.lines.visible=this.overlay.lines;const c=this.light,l=Math.min(1,.25+(c.sunColor.r+c.skyColor.r)*.35);this.lines.update(this.camera,this.renderer,n,l),this.routes.update(this.timeline.year,n,this.routeOptions({light:l}));for(const u of this.updaters)u(t,this.time);const h=this.pipeline.uniforms;h.uSunDir.value.copy(c.sunDir),h.uSunColor.value.copy(c.sunHorizon),h.uFogColor.value.copy(c.horizon),h.uFogDensity.value=.09/Math.max(30,n),h.uFogFalloff.value=2/Math.max(30,n),h.uExposure.value=.55*(1+2.2*Math.pow(c.night,1.5)),h.uNight.value=c.night,this.sky.group.position.copy(this.camera.position)}}const en=(o,t=document)=>t.querySelector(o),nn=(o,t={},e="")=>{const n=document.createElement(o);for(const[i,s]of Object.entries(t))i==="class"?n.className=s:i.startsWith("on")?n.addEventListener(i.slice(2),s):n.setAttribute(i,s);return e&&(n.innerHTML=e),n},yw={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},bt=o=>String(o??"").replace(/[&<>"']/g,t=>yw[t]),Sc={arrival:'<path d="M2.5 15.5h19l-2.6 3.6H5.1z"/><path d="M11.5 15.5V4l6.5 9.2h-6.5"/><path d="M2 21.2c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',voyage:'<path d="M2.5 14.5h19l-2.6 3.6H5.1z"/><path d="M11.5 14.5V3.5l6.5 9h-6.5"/><path d="M6 21c3-1.4 9-1.4 12 0"/>',battle:'<path d="M4.5 19.5 19.5 4.5M4.5 4.5l15 15"/><path d="M16.5 4.5h3v3M7.5 4.5h-3v3"/>',founding:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',construction:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',eruption:'<path d="M2.5 20.5 9 11h6l6.5 9.5z"/><path d="M10.2 8.2c0-2 1-3.1 1.8-4.7.8 1.6 1.8 2.7 1.8 4.7"/><path d="M7 6.5l1.3 1.3M17 6.5l-1.3 1.3"/>',epidemic:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',law:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',treaty:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 15h3"/><path d="M13.5 18.5c1-1 1.8-1 2.8 0"/>',death:'<path d="M3.5 18.5h17"/><path d="M7 18.5a5 5 0 0 1 10 0"/><path d="M12 4.5v5M9.6 7.4 12 9.8l2.4-2.4"/>',protest:'<path d="M6 21V3.5"/><path d="M6 4h11.5l-2.6 4 2.6 4H6"/>',restoration:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',other:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',era:'<path d="M5 13.5h14l-2 2.6H7z"/><path d="M11.5 13.5V3.5l5.5 7.6h-5.5"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',routes:'<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',home:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'};function On(o,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Sc[o]||Sc.other}</svg>`}const sd=o=>o in Sc;class _w{constructor(t,e,n){var a;this.app=e,this.ui=n,this.tl=e.timeline,this.tween=null;const i=this.tl.n;this.el=nn("div",{class:"timeline",role:"group","aria-label":"Time"}),i<2&&this.el.classList.add("single"),i<1&&(this.el.hidden=!0),this.el.innerHTML=`
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${On("prev",16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${On("next",16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${this.tl.max}" step="0.001" aria-label="Year" />
      </div>`,t.appendChild(this.el),this.input=en(".tl-input",this.el),this.backBtn=en(".tl-back",this.el),this.nextBtn=en(".tl-next",this.el),this.tourEl=en(".tl-tour",this.el);const s=en(".tl-ticks",this.el);this.tl.eras.forEach((r,c)=>{const l=i>1?c/this.tl.max*100:50,h=nn("button",{class:"tl-tick",style:`left:${l}%`,title:`${r.label} · ${So(r.year,r.yearPrecision)}`,"aria-label":r.label,"data-i":c});h.innerHTML=`<i></i><span>${bt(So(r.year,r.yearPrecision).replace("c. ",""))}</span>`,s.appendChild(h)}),this.labelTicks(),addEventListener("resize",()=>this.labelTicks()),(a=document.fonts)==null||a.ready.then(()=>this.labelTicks()),this.input.addEventListener("input",()=>{this.tween=null,this.tl.set(Number(this.input.value)),this.ui.onScrub()}),s.addEventListener("click",r=>{const c=r.target.closest(".tl-tick");c&&(this.easeTo(Number(c.dataset.i),.9),this.ui.onScrub(Number(c.dataset.i)))}),this.nextBtn.addEventListener("click",()=>{this.el.classList.remove("invite"),this.ui.tour.next()}),this.backBtn.addEventListener("click",()=>this.ui.tour.back()),this.tl.onChange(()=>this.refresh()),this.refresh()}labelTicks(){const t=[...this.el.querySelectorAll(".tl-tick span")];for(const a of t)a.hidden=!1;const e=t.map(a=>a.getBoundingClientRect());if(!e.some(a=>a.width>0))return;const n=6,i=e.length-1;let s=-1/0;t.forEach((a,r)=>{const c=e[r],l=r===0||r===i||c.left>=s+n&&c.right<=e[i].left-n;a.hidden=!l,l&&(s=c.right)})}easeTo(t,e=1){const n=Math.max(0,Math.min(this.tl.max,t));this.tween={from:this.tl.s,to:n,t:0,dur:e}}easeToYear(t,e){this.easeTo(this.tl.sAtYear(t),e)}finish(){this.tween&&(this.tl.set(this.tween.to),this.tween=null)}update(t){const e=this.tween;if(!e)return;e.t=Math.min(1,e.t+t/e.dur);const n=e.t<.5?2*e.t*e.t:1-Math.pow(-2*e.t+2,2)/2;this.tl.set(e.from+(e.to-e.from)*n),e.t>=1&&(this.tween=null)}refresh(){const t=this.tl,e=t.era;en(".tl-era",this.el).textContent=e?e.label:"";const n=t.reachesNow&&t.s>=t.max-.001;en(".tl-year",this.el).textContent=e?So(t.year,n?1:e.yearPrecision??1):"",document.activeElement!==this.input&&(this.input.value=String(t.s));const i=t.max>0?t.s/t.max:0;en(".tl-rail span",this.el).style.width=`${i*100}%`;const s=Math.round(t.s);for(const a of this.el.querySelectorAll(".tl-tick"))a.classList.toggle("on",Number(a.dataset.i)===s)}refreshTour(t){const e=`${t.active}:${t.chapter}:${t.step}:${t.stop}:${t.active?"":t.nearestChapter()}:${t.atEnd}`;if(e===this.tourKey)return;this.tourKey=e;const n=t.describe();if(this.backBtn.disabled=!n||t.atStart,this.nextBtn.disabled=!n||t.atEnd,this.el.classList.toggle("off-tour",!!n&&!n.active),this.tourEl.classList.toggle("opening",!!(n!=null&&n.opening)),!n){this.tourEl.innerHTML="";return}this.tourEl.innerHTML=n.active?`<span class="tl-ch">Chapter <b>${n.number}</b> of ${n.of}</span><i>·</i><em>${bt(n.name)}</em>${n.step?`<i>·</i><span>${bt(n.step)}</span>`:""}`:`<span>Next resumes at ${bt(n.chapter.toLowerCase())}</span><i>·</i><em>${bt(n.name)}</em>`,this.nextBtn.title=n.active?"Next (→ or space)":`Back to the tour: ${n.chapter.toLowerCase()}, ${n.name}`}}const Su={exact:0,ahupuaa:22,moku:90,island:260,sea:160},Eu=24;class ww{constructor(t,e,{onOpen:n,onCluster:i}={}){this.app=e,this.onOpen=n,this.onCluster=i,this.layer=nn("div",{class:"pins"}),t.appendChild(this.layer),this.tip=nn("div",{class:"cl-tip",role:"tooltip"}),t.appendChild(this.tip);const s=new Map(e.data.places.map(c=>[c.id,c]));this.places=s,this.items=[];const a=[];for(const c of e.data.events){const l=(c.where||[]).map(d=>s.get(d.place)).find(d=>d&&fn(d.geometry)),h=wc(c);if(!l||!h){a.push(c.id);continue}const[u,f]=e.data.proj.toWorld(fn(l.geometry)),p=sd(c.kind)?c.kind:"other",g=nn("button",{class:"pin",title:c.title,"aria-label":c.title},`<span class="pin-ic">${On(p,16)}</span><span class="pin-label">${bt(c.title)}</span>`);g.addEventListener("click",d=>{var x;d.stopPropagation(),(x=this.onOpen)==null||x.call(this,c)});const v=Su[l.placePrecision]??0,m=nn("div",{class:"halo"});this.layer.appendChild(m),this.layer.appendChild(g),this.items.push({ev:c,place:l,x:u,z:f,span:h,start:Ka(c)??h[0],el:g,halo:m,soft:v,r:v,pos:new B(u,0,f),shown:!1,active:!1,near:!1,haloShown:!1,tx:NaN,ty:NaN,ts:NaN,hx:NaN,hy:NaN,hr:NaN,ha:NaN})}a.length&&e.warn(`events with no placeable \`where\` or no date, so no pin: ${a.join(", ")}`);const r=this.items.length;this.sx=new Float32Array(r),this.sy=new Float32Array(r),this.vis=new Uint8Array(r),this.root=new Int16Array(r),this.size=new Int16Array(r),this.slot=new Int16Array(r),this.members=new Int16Array(r),this.halos=new Int16Array(r),this.clusters=[],this.nClusters=0,this.hovered=null,this.activeEvent=null,this.stopXZ=null,this.asideNow=!1,this._v=new B,this._w=new B}setStopPlace(t){const e=t&&fn(t.geometry);this.stopXZ=e?this.app.data.proj.toWorld(e):null,this.stopSoft=t?Su[t.placePrecision]??0:0}aside(){var s,a,r,c,l;const t=this.app,e=t.tour,i=(e!=null&&e.active&&e.event===this.activeEvent&&e.stop>=0?(s=e.event.stops)==null?void 0:s[e.stop]:null)?((l=(c=(r=(a=t.districts)==null?void 0:a.cur)==null?void 0:r.features)==null?void 0:c.forces)==null?void 0:l.stopShown)??0:0;return this.asideNow=this.asideNow?i>.2:i>.35,this.asideNow}visibleEvents(){const[t,e]=this.app.timeline.window;return this.items.filter(n=>n.span[1]>=t&&n.span[0]<=e).map(n=>n.ev)}marker(t){let e=this.clusters[t];if(e)return e;const n=nn("button",{class:"cluster"},'<span class="cl-n"></span>');return e={el:n,label:n.firstChild,start:0,count:0,x:0,y:0,key:0,shownCount:-1,tipKey:-1,domKey:-1,shown:!1,beside:!1,tx:NaN,ty:NaN,ts:NaN},n.addEventListener("click",i=>{var s;i.stopPropagation(),this.hideTip(),(s=this.onCluster)==null||s.call(this,this.eventsOf(e))}),n.addEventListener("pointerenter",i=>{i.pointerType!=="touch"&&(this.hovered=e,this.showTip(e))}),n.addEventListener("pointerleave",()=>{this.hovered===e&&this.hideTip()}),this.layer.appendChild(n),this.clusters[t]=e,e}eventsOf(t){const e=[];for(let n=0;n<t.count;n++)e.push(this.items[this.members[t.start+n]]);return e.sort((n,i)=>n.start-i.start).map(n=>n.ev)}groups(){return this.clusters.slice(0,this.nClusters).map(t=>({ids:this.eventsOf(t).map(e=>e.id),count:t.count,x:t.x,y:t.y,beside:t.beside}))}showTip(t){t.tipKey=t.key;const e=this.eventsOf(t).map(n=>`<div class="tip-row"><span class="tip-y">${bt(nd(n))}</span><b>${bt(n.title)}</b></div>`).join("");this.tip.innerHTML=`<div class="tip-head">${t.count} events here</div>${e}<div class="tip-foot">click for the list</div>`,this.tip.classList.add("show"),this.tipX=this.tipY=NaN,this.placeTip(t)}placeTip(t){const e=this.tip.offsetWidth||220,n=this.tip.offsetHeight||120;let i=t.x+22;i+e>innerWidth-10&&(i=t.x-22-e);const s=Math.max(64,Math.min(innerHeight-n-10,t.y-44-n/2)),a=Math.round(i),r=Math.round(s);a===this.tipX&&r===this.tipY||(this.tipX=a,this.tipY=r,this.tip.style.transform=`translate(${a}px, ${r}px)`)}hideTip(){this.hovered=null,this.tip.classList.remove("show")}find(t){const e=this.root;for(;e[t]!==t;)e[t]=e[e[t]],t=e[t];return t}put(t,e,n,i){Math.abs(e-t.tx)<.05&&Math.abs(n-t.ty)<.05&&i===t.ts||(t.tx=e,t.ty=n,t.ts=i,t.el.style.transform=`translate(${e.toFixed(1)}px, ${n.toFixed(1)}px) scale(${i.toFixed(3)})`)}update(t){const e=this.app,n=e.camera,i=innerWidth,s=innerHeight,a=e.timeline,r=a.yearAt(a.s-.5),c=a.yearAt(a.s+.5),l=e.rig.state.distance,h=Math.round(Math.max(.62,Math.min(1,1.18-Math.log(Math.max(1,l)/120)*.13))*200)/200,u=this.items,f=u.length,{sx:p,sy:g,vis:v,root:m,size:d}=this,x=this.activeEvent,M=this.aside(),b=this._v;let _=-1;for(let y=0;y<f;y++){const T=u[y],L=T.ev===x,I=L&&this.stopXZ;T.pos.x=I?this.stopXZ[0]:T.x,T.pos.z=I?this.stopXZ[1]:T.z,T.pos.y=e.world.heightAt(T.pos.x,T.pos.z)+.02,T.r=I?this.stopSoft:T.soft;let R=t&&(L?!M:T.span[1]>=r&&T.span[0]<=c);R&&(b.copy(T.pos).project(n),p[y]=(b.x+1)/2*i,g[y]=(1-b.y)/2*s,R=b.z<1&&p[y]>-60&&p[y]<i+60&&g[y]>84&&g[y]<s+40),v[y]=R?1:0,R&&L&&(_=y),m[y]=y,d[y]=0}const S=Eu*Eu;for(let y=0;y<f;y++)if(!(!v[y]||y===_))for(let T=y+1;T<f;T++){if(!v[T]||T===_)continue;const L=p[y]-p[T],I=g[y]-g[T];if(L*L+I*I<S){const R=this.find(y),k=this.find(T);R!==k&&(m[Math.max(R,k)]=Math.min(R,k))}}for(let y=0;y<f;y++)v[y]&&y!==_&&d[this.find(y)]++;let E=0,A=0;for(let y=0;y<f;y++){if(!v[y]||y===_||m[y]!==y||d[y]<2)continue;const T=this.marker(E);this.slot[y]=E++,T.start=A,T.count=0,T.x=0,T.y=0,T.key=0,A+=d[y]}for(let y=0;y<f;y++){if(!v[y]||y===_)continue;const T=this.find(y);if(d[T]<2)continue;const L=this.clusters[this.slot[T]];this.members[L.start+L.count++]=y,L.x+=p[y],L.y+=g[y],L.key=(L.key*61+y+1)%1000003}for(let y=0;y<f;y++){const T=u[y],L=v[y]===1&&(y===_||d[this.find(y)]<2);L!==T.shown&&(T.shown=L,T.el.classList.toggle("show",L));const I=T.ev===x;if(I!==T.active&&(T.active=I,T.el.classList.toggle("active",I)),!L)continue;const R=l<260||I;R!==T.near&&(T.near=R,T.el.classList.toggle("near",R)),this.put(T,p[y],g[y],h)}for(let y=0;y<E;y++){const T=this.clusters[y];T.x/=T.count,T.y/=T.count;const L=_>=0&&Math.abs(T.x-p[_])<30&&Math.abs(T.y-g[_])<30;if(L&&(T.x=p[_]-36*h,T.y=g[_]),L!==T.beside&&(T.beside=L,T.el.classList.toggle("beside",L)),T.count!==T.shownCount&&(T.shownCount=T.count,T.label.textContent=String(T.count),T.el.setAttribute("aria-label",`${T.count} events here`)),T.key!==T.domKey){T.domKey=T.key;let I="";for(let R=0;R<T.count;R++)I+=`${R?" ":""}${u[this.members[T.start+R]].ev.id}`;T.el.dataset.events=I}T.shown||(T.shown=!0,T.el.classList.add("show")),this.put(T,T.x,T.y,h),this.hovered===T&&(T.key!==T.tipKey?this.showTip(T):this.placeTip(T))}for(let y=E;y<this.clusters.length;y++){const T=this.clusters[y];this.hovered===T&&this.hideTip(),T.shown&&(T.shown=!1,T.count=0,T.el.classList.remove("show"))}this.nClusters=E;let w=0;for(let y=0;y<f;y++){const T=u[y];let L=v[y]===1&&T.r>0;for(let F=0;L&&F<w;F++){const G=u[this.halos[F]];Math.abs(G.pos.x-T.pos.x)<.5&&Math.abs(G.pos.z-T.pos.z)<.5&&G.r>=T.r&&(L=!1)}if(L!==T.haloShown&&(T.haloShown=L,T.halo.classList.toggle("show",L)),!L)continue;this.halos[w++]=y,this._w.copy(n.position).sub(T.pos).normalize();const I=this._w.cross(n.up).normalize().multiplyScalar(T.r).add(T.pos);I.project(n);const R=Math.max(6,Math.min(400,Math.hypot((I.x+1)/2*i-p[y],(1-I.y)/2*s-g[y])));Math.abs(p[y]-T.hx)<.05&&Math.abs(g[y]-T.hy)<.05&&Math.abs(R-T.hr)<.05||(T.hx=p[y],T.hy=g[y],T.hr=R,T.halo.style.transform=`translate(${p[y].toFixed(1)}px, ${g[y].toFixed(1)}px) scale(${R.toFixed(1)})`);const k=Math.round(Math.max(.3,Math.min(1,70/R))*100)/100;k!==T.ha&&(T.ha=k,T.halo.style.setProperty("--halo",k.toFixed(2)))}}}const bw={arrival:"arrival",battle:"battle",founding:"founding",construction:"construction",eruption:"eruption",epidemic:"epidemic",law:"law",treaty:"treaty",voyage:"voyage",death:"death",protest:"protest",restoration:"restoration",other:"event"},Au=o=>sd(o.kind)?o.kind:"other";function Ec(o){return o?o.read!==void 0?o.read==="full"||o.read==="part":o.opened!==!1:!1}function Sw(o){const t=String(o).match(/^(in the time of)(\s+)(.+)$/i);return t?{lead:t[1],gap:t[2],name:t[3]}:{lead:"",gap:"",name:String(o)}}class Ew{constructor(t,e,n){this.app=e,this.ui=n,this.el=nn("section",{class:"card","aria-live":"polite"}),t.appendChild(this.el),this.places=new Map(e.data.places.map(i=>[i.id,i])),this.sources=new Map(e.data.sources.map(i=>[i.id,i])),this.events=new Map(e.data.events.map(i=>[i.id,i])),this.missing=new Set,this.mode=null,this.ev=null,this.stop=-1,this.chapter=null,this.list=null,this.el.addEventListener("click",i=>this.click(i))}get isOpen(){return this.el.classList.contains("show")}open(t){this.set("event",{ev:t})}setStop(t){this.stop=t,this.render()}openEra(t){this.set("era",{chapter:t})}openList(t){this.set("cluster",{list:t})}set(t,{ev:e=null,chapter:n=null,list:i=null}){this.mode=t,this.ev=e,this.chapter=n,this.list=i,this.stop=-1,this.render()}close(){var e,n;const t=this.ev;this.el.classList.remove("show"),this.mode=null,this.ev=null,this.chapter=null,this.list=null,(n=(e=this.ui).onCardClosed)==null||n.call(e,t)}click(t){const e=t.target.closest("button");if(!e||!this.el.contains(e))return;const n=this.ui.tour;if(e.classList.contains("card-close"))this.close();else if(e.classList.contains("prev"))n.back();else if(e.classList.contains("next"))n.next();else if(e.dataset.ev){const i=this.events.get(e.dataset.ev);i&&n.open(i,{gentle:this.mode==="cluster"})}}cited(t){const e=this.sources.get(t);return!e&&!this.missing.has(t)&&(this.missing.add(t),this.app.warn(`a card cites ${t}, which is not in sources.json`)),Ec(e)?e:null}sourceLine(t){const e=this.cited(typeof t=="string"?t:t.id);if(!e)return"";const n=typeof t=="object"&&t.where?`, ${bt(t.where)}`:"",i=e.url&&/^https?:/.test(e.url)?`<a href="${bt(e.url)}" target="_blank" rel="noopener">${bt(e.title)}</a>`:bt(e.title),s=e.author?`${bt(e.author)}, `:"",a=e.year?` (${bt(e.year)})`:"";return`<li>${s}<span class="src-title">${i}</span>${a}${n}</li>`}sourcesSection(t){const e=(t||[]).map(n=>this.sourceLine(n)).join("");return e?`<div class="card-sec"><h2>Sources</h2><ul class="sources">${e}</ul></div>`:""}eventRows(t,{gloss:e=!0}={}){return t.map(n=>`<li><button class="ev-row" data-ev="${bt(n.id)}">
          <span class="ev-ic">${On(Au(n),16)}</span>
          <span class="ev-y">${bt(nd(n))}</span>
          <span class="ev-t"><b>${bt(n.title)}</b>${e&&n.gloss?`<em>${bt(n.gloss)}</em>`:""}</span>
        </button></li>`).join("")}footer(){var s;const t=this.ui.tour;if(!(t!=null&&t.active))return"";const e=t.current;let n,i="Next";if(this.mode==="era"&&this.chapter===e&&t.step<0)n=`<span class="ch-count">Chapter <b>${e.index+1}</b> of ${t.chapters.length}</span>`;else if(this.mode==="event"&&this.ev&&this.ev===t.event){const a=((s=this.ev.stops)==null?void 0:s.length)||0;t.stop>=0?n=bt(`stop ${t.stop+1} of ${a}`):(n=bt(`${t.step+1} of ${e.events.length} in chapter ${e.index+1}`),a&&(i=`Walk ${a} stops`))}else return"";return`<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${t.atStart?"disabled":""}>${On("prev",18)}</button>
      <span class="count">${n}</span>
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${t.atEnd?"disabled":""}><span>${bt(i)}</span>${On("next",18)}</button>
    </footer>`}render(){if(this.mode==="era")this.el.innerHTML=this.eraHTML();else if(this.mode==="cluster")this.el.innerHTML=this.clusterHTML();else if(this.mode==="event"&&this.ev)this.el.innerHTML=this.eventHTML();else return;this.el.dataset.mode=this.mode,this.el.classList.toggle("chapter",this.mode==="era"),this.el.classList.add("show"),this.el.scrollTop=0}header(t,e,n){return`<header>
        <div class="card-icon">${On(t,26)}</div>
        <div class="card-titles"><h1>${bt(e)}</h1>${n?`<p class="gloss">${bt(n)}</p>`:""}</div>
        <button class="card-close" aria-label="Close">${On("close",18)}</button>
      </header>`}eventHTML(){const t=this.ev,e=(t.where||[]).map(c=>{const l=this.places.get(c.place);return l?`${bt(l.name)}${c.role?` <em>${bt(c.role)}</em>`:""}`:null}).filter(Boolean),n=Object.entries(t.confidence||{}).map(([c,l])=>`<span class="conf ${bt(l)}"><b>${bt(c)}</b> ${bt(l)}</span>`).join(""),i=(t.tellings||[]).map(c=>{const l=this.cited(c.source);return l?`<li><span class="src-title">${bt(l.title)}</span>: ${bt(c.says)}</li>`:""}).join(""),s=t.stops||[],a=this.stop>=0?s[this.stop]:null,r=a?this.places.get(a.place):null;return`
      ${this.header(Au(t),t.title,t.gloss)}
      <div class="card-meta"><span class="when">${bt(dw(t))}</span><span class="kind">${bt(bw[t.kind]||t.kind||"event")}</span></div>
      ${e.length?`<div class="card-where">${e.join("<i>·</i>")}</div>`:""}
      ${a?`<div class="stop"><div class="stop-n">${this.stop+1} / ${s.length}${r?` · ${bt(r.name)}`:""}</div><p>${bt(a.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${bt(t.summary)}</p>`:""}</div>
      ${n?`<div class="card-conf">${n}</div>`:""}
      ${i?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${i}</ul></div>`:""}
      ${this.sourcesSection(t.sources)}
      ${this.footer()}`}eraHTML(){const t=this.chapter,e=t.era,n=Sw(e.label||e.id),s=String(e.note||"").match(/^([ʻʼ'‘“"(]*.)([\s\S]*)$/u),a=s?`<p><span class="initial">${bt(s[1])}</span>${bt(s[2])}</p>`:"";return`
      <header class="ch-head">
        <div class="ch-mark"><span class="ch-word">Chapter</span><span class="ch-num">${t.index+1}</span></div>
        <h1 class="ch-title">${n.lead?`<span class="ch-lead">${bt(n.lead)}</span>${bt(n.gap)}`:""}<span class="ch-name">${bt(n.name)}</span></h1>
        <div class="ch-year">${bt(So(e.year,Math.max(10,e.yearPrecision??10)))}</div>
        <button class="card-close" aria-label="Close">${On("close",18)}</button>
      </header>
      <div class="card-body ch-note">${a}</div>
      ${t.events.length?`<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(t.events,{gloss:!1})}</ul></div>`:""}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`}clusterHTML(){const t=this.list||[],e=[];for(const i of t){const s=(i.where||[]).map(a=>this.places.get(a.place)).find(Boolean);s&&!e.includes(s.name)&&e.push(s.name)}const n=e.length>4?`${e.slice(0,4).join(" · ")} · and ${e.length-4} more`:e.join(" · ");return`
      ${this.header("pins",`${t.length} events`,n)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(t)}</ul></div>`}}const Hi={far:2600,island:520,near:70},ec={far:0,island:1,near:2},Aw=1500,Es=(o,t,e)=>Math.max(t,Math.min(e,o)),Tw=new Set(["law","epidemic","restoration"]);function Cw(o,t=null){return(o==null?void 0:o.view)==="land"||(o==null?void 0:o.view)==="chiefdoms"||(o==null?void 0:o.view)==="mahele"?o.view:(o==null?void 0:o.kind)==="law"&&(t!=null&&t.size)&&(o.sources||[]).some(e=>t.has(typeof e=="string"?e:e==null?void 0:e.id))?"mahele":o&&Tw.has(o.kind)?"land":"chiefdoms"}function Rw(o){return o.short?o.short:String(o.label||o.id).replace(/^in the time of\s+/i,"").split(/,| and the /)[0].trim()}function Tu(o){let t=null;for(const e of o||[])e in ec&&(t===null||ec[e]>ec[t])&&(t=e);return t||"island"}class Lw{constructor(t,e){this.app=t,this.ui=e,this.places=new Map(t.data.places.map(n=>[n.id,n])),this.islands=new Map(t.data.packs.filter(n=>n!==t.world.archPack).map(n=>[n.id,n])),this.chapters=this.build(),this.active=!1,this.chapter=0,this.step=-1,this.stop=-1,this.listeners=[]}build(){const t=this.app,e=t.timeline,n=new Map(e.eras.map((r,c)=>[r.id,c])),i=e.eras.map((r,c)=>({era:r,index:c,name:Rw(r),events:[],island:null}));if(!i.length)return i;const s=[],a=i.map(()=>[]);return t.data.events.forEach((r,c)=>{const l=Ka(r);if(l===null)return;let h=n.get(r.era);h===void 0&&(h=e.eras.indexOf(e.eraAt(e.sAtYear(l))),s.push(r.id)),a[h].push({ev:r,start:l,order:c})}),s.length&&t.warn(`events whose era is not in eras.json, placed in a chapter by date: ${s.join(", ")}`),i.forEach((r,c)=>{r.events=a[c].sort((l,h)=>l.start-h.start||l.order-h.order).map(l=>l.ev),r.island=this.gathering(r.events)}),i}gathering(t){const e=new Map;let n=0;for(const a of t){const r=this.placeOf(a);r&&(n++,r.island&&this.islands.has(r.island)&&e.set(r.island,(e.get(r.island)||0)+1))}let i=null,s=0;for(const[a,r]of e)r>s&&([i,s]=[a,r]);return i&&s>=2&&s>=n*.7?i:null}placeOf(t){for(const e of t.where||[]){const n=this.places.get(e.place);if(n&&fn(n.geometry))return n}return null}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}get current(){return this.chapters[this.chapter]||null}get event(){var t;return this.step>=0&&((t=this.current)==null?void 0:t.events[this.step])||null}get state(){var t;return{active:this.active,chapter:this.chapter,step:this.step,stop:this.stop,event:((t=this.event)==null?void 0:t.id)??null}}get atStart(){return this.active&&this.chapter===0&&this.step<0}get atEnd(){var s;const t=this.chapters.length;if(!t)return!0;if(!this.active)return!1;const e=this.current,n=this.event,i=n?(((s=n.stops)==null?void 0:s.length)||0)-1:-1;return this.chapter===t-1&&this.step===e.events.length-1&&this.stop>=i}nearestChapter(){return Es(Math.round(this.app.timeline.s),0,this.chapters.length-1)}begin(){this.goTo(0,-1,{jump:!0})}next(){var e;if(!this.chapters.length)return;if(!this.active)return this.goTo(this.nearestChapter(),-1);const t=this.event;if(t&&this.stop<(((e=t.stops)==null?void 0:e.length)||0)-1)return this.goStop(this.stop+1);if(this.step<this.current.events.length-1)return this.goTo(this.chapter,this.step+1);if(this.chapter<this.chapters.length-1)return this.goTo(this.chapter+1,-1)}back(){if(this.chapters.length){if(!this.active)return this.goTo(this.nearestChapter(),-1);if(this.event&&this.stop>0)return this.goStop(this.stop-1);if(this.event&&this.stop===0)return this.goTo(this.chapter,this.step);if(this.step>0)return this.goTo(this.chapter,this.step-1,{stop:"last"});if(this.step===0)return this.goTo(this.chapter,-1);if(this.chapter>0){const t=this.chapters[this.chapter-1];return this.goTo(this.chapter-1,t.events.length-1,{stop:"last"})}}}skip(t){if(!this.chapters.length)return;const e=this.active?this.chapter:this.nearestChapter(),n=t<0&&this.active&&this.step>=0?e:e+t;n>=0&&n<this.chapters.length&&this.goTo(n,-1)}leave(){this.active&&(this.active=!1,this.notify())}locate(t){for(let e=0;e<this.chapters.length;e++){const n=this.chapters[e].events.indexOf(t);if(n>=0)return[e,n]}return null}open(t,{gentle:e=!1}={}){const n=this.locate(t);if(n)return this.goTo(n[0],n[1],{gentle:e});this.ui.pins.activeEvent=t,this.ui.pins.setStopPlace(null),this.ui.card.open(t),this.fly(this.gentleView(t),!1,this.placeOf(t))}goTo(t,e=-1,{jump:n=!1,gentle:i=!1,stop:s=-1}={}){var r;const a=this.chapters[t];if(a){if(this.active=!0,this.chapter=t,this.step=Es(e,-1,a.events.length-1),this.stop=-1,this.step<0)this.showEra(a,n);else{const c=a.events[this.step],l=((r=c.stops)==null?void 0:r.length)||0;if(s==="last"&&l)return this.goStop(l-1,{jump:n});this.showEvent(c,{jump:n,gentle:i})}this.notify()}}applyView(t){var e;this.app.viewChosen||this.app.setView(Cw(t,(e=this.app.mahele)==null?void 0:e.sources))}showEra(t,e){const n=this.ui;this.applyView(null),n.pins.activeEvent=null,n.pins.setStopPlace(null),n.card.openEra(t);const i=t.island?this.islandView(t.island,this.homeYaw()):this.chainView();this.setS(t.index,this.fly(i,e),e)}showEvent(t,{jump:e,gentle:n}){const i=this.ui;this.applyView(t),this.prefetch(t),i.pins.activeEvent=t,i.pins.setStopPlace(null),i.card.open(t);const s=this.fly(n?this.gentleView(t):this.eventView(t),e,this.placeOf(t)),a=this.app.timeline,[r,c]=a.window,l=wc(t);n&&l&&l[1]>=r&&l[0]<=c||this.setYear(this.stepYear(t,this.current),s,e)}goStop(t,{jump:e=!1}={}){const n=this.event,i=(n==null?void 0:n.stops)||[];if(!n||t<-1||t>=i.length)return;const s=this.ui;this.active=!0,this.stop=t,this.applyView(n),s.pins.activeEvent=n,s.card.ev!==n&&s.card.open(n),s.card.setStop(t);const a=i[t],r=a?this.places.get(a.place):null,c=r&&fn(r.geometry);if(s.pins.setStopPlace(c?r:null),this.prefetch(n),a){const l=c?a.camera?this.cameraView(r,a.camera):this.pointView(r,Hi[a.zoom]??Hi.island):null,h=this.fly(l,e,r);Number.isFinite(a.year)&&this.setYear(a.year,h,e)}this.notify()}prefetch(t){const e=this.app.districts;if(e)for(const n of(t==null?void 0:t.stops)||[]){const i=this.places.get(n.place),s=i&&fn(i.geometry);if(!s||n.zoom==="far")continue;const[a,r]=this.app.data.proj.toWorld(s);if(e.prefetch(a,r,i.moku))return}}stepYear(t,e){const n=this.app.timeline,i=Ka(t),s=wc(t)||[i,i],a=n.yearAt(e.index-.5),r=n.yearAt(e.index+.5);return i>=a&&i<=r?i:s[1]>=a&&s[0]<=r?Es(e.era.year,Math.max(s[0],a),Math.min(s[1],r)):i}setYear(t,e,n){this.setS(this.app.timeline.sAtYear(t),e,n)}setS(t,e,n){const i=this.ui.timeline;n?(i.tween=null,this.app.timeline.set(t)):i.easeTo(t,Es(e*.8,.6,2.4))}homeYaw(t=this.ui.freeBox()){return this.chainView(t).yaw}tilt(){const t=this.app.rig.goal;return Es(t.pitch-ji(t.distance),-.3,.3)}chainView(t=this.ui.freeBox()){const e=this.app.rig,n=this.app.world.chainShape(),i=e.fit({points:n.hull,along:[n.from,n.to],box:t,reach:Qf});return e.reach(i.distance),i}islandView(t,e=this.app.rig.goal.yaw,n=0){const i=this.islands.get(t);return this.app.rig.fit({rect:i.rect,yaw:e,tilt:n,box:this.ui.freeBox()})}pointView(t,e,{towardChain:n=0}={}){let[i,s]=this.app.data.proj.toWorld(fn(t.geometry));if(n){const c=this.app.world.bounds,l=(c.x0+c.x1)/2-i,h=(c.z0+c.z1)/2-s,u=Math.min(n,900/Math.max(1,Math.hypot(l,h)));i+=l*u,s+=h*u}const a=this.ui.freeBox(),r=n?this.homeYaw(a):this.app.rig.goal.yaw;return this.app.rig.fit({rect:{x0:i,x1:i,z0:s,z1:s},distance:e,yaw:r,tilt:this.tilt(),box:a})}cameraView(t,e){const n=Array.isArray(e.target)&&e.target.length>=2&&e.target.every(Number.isFinite)?e.target:fn(t.geometry),[i,s]=this.app.data.proj.toWorld(n);return this.app.rig.fit({rect:{x0:i,x1:i,z0:s,z1:s},distance:e.distance,yaw:-e.bearing*Math.PI/180,pitch:e.pitch*Math.PI/2,box:this.ui.freeBox()})}eventView(t){const e=this.placeOf(t);if(!e)return null;const n=Tu(t.zoom);return n==="near"?this.pointView(e,Hi.near):n==="island"&&this.islands.has(e.island)?this.islandView(e.island,this.app.rig.goal.yaw,this.tilt()):n==="island"?this.pointView(e,Hi.island):!e.island&&e.placePrecision==="island"?this.chainView():this.pointView(e,this.farDistance(),{towardChain:.35})}farDistance(t=this.ui.freeBox()){const e=Math.tan(this.app.camera.fov*Math.PI/360),n=Math.max(60,Math.min(t.x1-t.x0,t.y1-t.y0));return Math.max(Hi.far,Aw*innerHeight/(2*e*n))}gentleView(t){const e=this.placeOf(t);if(!e)return null;const n=Hi[Tu(t.zoom)];return this.pointView(e,Math.min(this.app.rig.goal.distance,Math.max(n,Hi.island)))}fly(t,e=!1,n=null){if(!t)return 1;const i=this.app.rig;if(e)return i.jump({x:t.target.x,z:t.target.z,distance:t.distance,yaw:t.yaw,pitch:t.pitch}),0;const s=i.goal,a=Math.hypot(s.target.x-t.target.x,s.target.z-t.target.z),r=Math.abs(Math.log(t.distance/Math.max(1,s.distance))),c=Es(1.1+Math.sqrt(a)*.032+r*.28,1.1,3.4),l=this.app.districts,h=l&&t.distance<130?l.prefetch(t.target.x,t.target.z,n==null?void 0:n.moku):null;return i.flyTo(t,c,h?{ready:()=>{var u;return((u=l.cur)==null?void 0:u.d)===h&&l.cur.state==="ready"}}:{}),c}describe(){const t=this.chapters.length?this.chapters[this.active?this.chapter:this.nearestChapter()]:null;return t?{active:this.active,opening:this.active&&this.step<0,number:t.index+1,of:this.chapters.length,chapter:`Chapter ${t.index+1} of ${this.chapters.length}`,name:t.name,step:this.active&&this.step>=0?`${this.step+1} of ${t.events.length}`:""}:null}}const Pw=.05,Cu=.25,Ru="The land division of 1848, by ahupuaʻa",nc=new Map(Ro.map(o=>[o.id,o]));class Dw{constructor(t){if(this.app=t,t.ui=this,this.build(),this.bind(),t.updaters.push(e=>this.update(e)),!t.params.has("year")&&!t.params.has("cam")&&this.tour.chapters.length)this.tour.begin(),this.timeline.el.classList.add("invite");else if(!t.params.has("cam")){const e=this.tour.chainView();t.rig.jump({x:e.target.x,z:e.target.z,distance:e.distance,yaw:e.yaw,pitch:e.pitch})}}build(){const t=this.app,e=nn("div",{id:"ui"});document.body.appendChild(e),this.root=e;const n=t.world.archPack.name;this.brand=nn("div",{class:"brand"},`<div class="brand-name">Holo i ke Au</div><div class="brand-sub"><span class="where">${bt(n)}</span><span class="loading"></span></div>`),e.appendChild(this.brand),this.tools=nn("div",{class:"tools"});const i=(a,r,c,l)=>nn("button",{class:`tool${l?" on":""}`,"data-tool":a,title:c,"aria-label":c,"aria-pressed":String(!!l)},On(r,20));this.tools.append(i("lines","lines","Moku and ahupuaʻa boundaries",t.overlay.lines),i("routes","routes","Every voyage, fleet and ship at sea in these years",t.overlay.routes),i("pins","pins","Events",t.overlay.pins),i("home","home","The whole chain"),i("help","help","About"),i("full","expand","Full screen")),e.appendChild(this.tools),this.legend=nn("div",{class:"legend"}),this.legend.innerHTML=`
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
        <button type="button" data-view="mahele" aria-pressed="false" title="${Ru}">Māhele</button>
      </div>
      <div class="lg-body"></div>`,this.legendBody=en(".lg-body",this.legend),this.legend.inert=!0,e.appendChild(this.legend),this.inspector=nn("div",{class:"inspector"}),e.appendChild(this.inspector),this.timeline=new _w(e,t,this),this.pins=new ww(e,t,{onOpen:a=>this.openEvent(a),onCluster:a=>this.openCluster(a)}),this.card=new Ew(e,t,this),this.tour=new Lw(t,this),t.tour=this.tour,this.tour.onChange(a=>this.timeline.refreshTour(a)),t.timeline.onChange(()=>this.timeline.refreshTour(this.tour)),this.timeline.refreshTour(this.tour),this.help=nn("div",{class:"help hidden"});const s=this.credits();this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${On("close",18)}</button>
        <h2>Holo i ke Au</h2>
        <p><em>Holo i ke au</em>: sail on the current, into the era. <em>Au</em> is both a period of time and a current, and the title rides it.</p>
        <p>The Hawaiian Islands from real terrain, across the eras from the first canoes to 1898. Far out, each moku takes the colour of the chiefdom or kingdom that held it; close in, the boundaries of moku and ahupuaʻa lie on the land. Pins are events of the chosen era: open one for its story, how sure the record is, and its sources. A number stands for several events in one spot; open it for the list.</p>
        <p>The switch on the legend turns the far view from the <b>Chiefdoms</b> to the <b>Land</b>: where it was cultivated, where people lived and how many, and the native forest, in the chosen year, blended between layers made for 1778, 1853, 1896 and now. A layer marked <em>modelled</em> was drawn by a written rule where no map of its time exists. From ${La} it turns to the <b>Māhele</b> too: each ahupuaʻa in the class the land division gave it, crown, government or konohiki land, or mixed where the records give it more than one.</p>
        <p><b>Next</b> walks the story an era at a time: each era opens with its card, then its events in order, the year and the camera moving to each. Look around as you like between steps; the timeline is free too, and Next picks the story up again from the nearest era.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> era by era</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span>
        </div>
        ${s?`<h3>Data</h3><ul class="credits">${s}</ul>`:""}
        <div class="land-credits"></div>
        <div class="mahele-credits"></div>
      </div>`,e.appendChild(this.help),this.refreshLegend()}creditable(t){return this.sourceById||(this.sourceById=new Map(this.app.data.sources.map(e=>[e.id,e]))),Ec(this.sourceById.get(t.id)||t)}credits(){var i,s;const t=this.app.data,e=new Map,n=a=>{a&&a.id&&!e.has(a.id)&&this.creditable(a)&&e.set(a.id,a)};for(const a of t.packs)for(const r of a.sources||[])n(r);for(const a of((i=t.moku)==null?void 0:i.sources)||[])n(a);for(const a of((s=t.ahupuaa)==null?void 0:s.sources)||[])n(a);return ic([...e.values()])}landCredits(){const t=en(".land-credits",this.help),e=this.app.land.manifest;if(!t||!e||t.childElementCount)return;const n=new Map;for(const i of Object.values(e.methods||{}))for(const s of Object.values(i||{}))for(const a of(s==null?void 0:s.sources)||[])a!=null&&a.id&&/^https?:/.test(a.url||"")&&!n.has(a.id)&&this.creditable(a)&&n.set(a.id,a);n.size&&(t.innerHTML=`<h3>Land layers</h3><ul class="credits">${ic([...n.values()])}</ul>`)}maheleCredits(){const t=en(".mahele-credits",this.help),e=this.app.mahele.sources;if(!t||!e||t.childElementCount)return;const n=new Map(this.app.data.sources.map(s=>[s.id,s])),i=[...e].map(s=>n.get(s)).filter(s=>Ec(s));i.length&&(t.innerHTML=`<h3>The Māhele</h3><ul class="credits">${ic(i)}</ul>`)}bind(){const t=this.app;this.tools.addEventListener("click",i=>{var r,c,l;const s=i.target.closest("[data-tool]");if(!s)return;const a=s.dataset.tool;if(a==="help")this.help.classList.toggle("hidden");else if(a==="full")document.fullscreenElement?(r=document.exitFullscreen)==null||r.call(document):(l=(c=document.documentElement).requestFullscreen)==null||l.call(c).catch(()=>{});else if(a==="home"){const h=t.rig;h.home=this.tour.chainView(),h.flyTo({target:h.home.target,distance:h.home.distance,yaw:h.home.yaw,pitch:h.home.pitch},3)}else a in t.overlay&&(t.overlay[a]=!t.overlay[a],s.classList.toggle("on",t.overlay[a]),s.setAttribute("aria-pressed",String(t.overlay[a])))}),this.legend.addEventListener("click",i=>{const s=i.target.closest("[data-view]");if(!s||s.disabled)return;const a=s.dataset.view;t.setView(t.farView===a?null:a,{user:!0})}),t.onView(()=>this.refreshLegend()),t.land.onChange(()=>{this.refreshLegend(),this.landCredits()}),t.mahele.onChange(()=>{this.refreshLegend(),this.maheleCredits();const i=this.tour;i.active&&i.event&&i.applyView(i.event)}),this.help.addEventListener("click",i=>{(i.target===this.help||i.target.closest(".help-close"))&&this.help.classList.add("hidden")}),t.timeline.onChange(()=>{(t.timeline.era!==this.legendEra||t.mahele.availableAt()!==this.legendMahele)&&this.refreshLegend()});const e=t.canvas;let n=0;e.addEventListener("pointermove",i=>{if(i.buttons||i.pointerType==="touch")return this.hover(null);const s=performance.now();s-n<70||(n=s,this.hover(i.clientX,i.clientY))}),e.addEventListener("pointerleave",()=>this.hover(null)),e.addEventListener("pointerdown",()=>this.hover(null)),addEventListener("keydown",i=>{var a,r,c,l;if(i.key==="Escape"){this.help.classList.contains("hidden")?this.card.close():this.help.classList.add("hidden");return}if((r=(a=i.target).closest)!=null&&r.call(a,"input, textarea, select")||i.altKey||i.ctrlKey||i.metaKey||!this.help.classList.contains("hidden"))return;const s=this.tour;i.key==="ArrowRight"||i.key===" "&&!((l=(c=i.target).closest)!=null&&l.call(c,"button, a"))?(i.preventDefault(),this.timeline.el.classList.remove("invite"),s.next()):i.key==="ArrowLeft"?(i.preventDefault(),s.back()):i.key===","||i.key==="<"?s.skip(-1):(i.key==="."||i.key===">")&&s.skip(1)})}openEvent(t){this.tour.open(t,{gentle:!0})}openCluster(t){const e=this.tour;this.pins.activeEvent=e.active?e.event:null,this.card.openList(t)}onCardClosed(){const t=this.tour;t.active&&t.event||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}onScrub(t=this.app.timeline.s){var i;this.tour.leave();const n=this.app.timeline;this.card.mode==="era"&&((i=this.card.chapter)==null?void 0:i.era)!==n.eraAt(t)&&this.card.close(),this.card.ev||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}freeBox(){const t=innerWidth,e=innerHeight,n={x0:16,y0:72,x1:t-16,y1:e-16},i=this.timeline.el;!i.hidden&&i.offsetHeight&&(n.y1=Math.min(n.y1,i.offsetTop-14));const s=this.card.el;if(this.syncCarded(),this.card.isOpen&&s.offsetWidth)if(s.offsetLeft>t*.35)n.x1=Math.min(n.x1,s.offsetLeft-16);else{n.y1=Math.min(n.y1,s.offsetTop-12);const a=this.legend;a.offsetHeight&&a.offsetTop<e/3&&(n.y0=Math.max(n.y0,a.offsetTop+a.offsetHeight+6))}return n.y1-n.y0<120&&(n.y1=n.y0+120),n}syncCarded(){const t=this.card.isOpen;t!==this.root.classList.contains("carded")&&this.root.classList.toggle("carded",t)}farStrength(t=this.app.rig.state.distance){const e=this.app.farView;return e==="land"||e==="mahele"?Da(t):bc(t)}inspectorAllowed(){var i,s;const t=this.app,e=this.farStrength();return!!((i=t.districts)!=null&&i.on||((s=t.districts)==null?void 0:s.k)>0)||e<Pw?this.nearHeld=!0:e>Cu&&(this.nearHeld=!1),!this.nearHeld}hideInspector(){this.app.shared.uniforms.uHoverMoku.value=0,this.inspector.classList.remove("show"),this.inspectorKey=null}hover(t,e){var m;const n=this.app,i=n.shared.uniforms;if(t==null||!this.inspectorAllowed())return this.hideInspector();const s=n.rig.pickGround(t,e),a=s&&n.world.metresAt(s.x,s.z)>0?n.polity.mokuAt(s.x,s.z):null,r=n.farView,c=r==="land"&&n.landK>.25,l=r==="mahele"&&n.regionOn==="mahele"&&n.polityK>.25,h=bc(n.rig.state.distance)<.05;if(i.uHoverMoku.value=a&&!c&&!h&&n.regionOn==="chiefdoms"?a.index:0,!a){this.inspector.classList.remove("show");return}const u=c?n.land.valuesAt(s.x,s.z):null,f=l?n.mahele.unitAt(s.x,s.z):null,p=`${a.index}:${(m=n.timeline.era)==null?void 0:m.id}:${u?JSON.stringify(u):""}:${f?f.gisId:""}`;if(this.inspectorKey!==p){this.inspectorKey=p;const d=n.polity.holder(n.timeline.era,a),x=(M,b)=>`<div class="in-row"><span class="in-k">${M}</span>${b}</div>`;this.inspector.innerHTML=f?Iw(f,a,x):`
        <div class="in-head"><b>${bt(a.name)}</b><span class="in-island">${bt(a.island||"")}</span></div>
        ${x("moku",d?`<span class="in-pol"><i style="background:${bt(d.colour)}"></i>${bt(d.name)}</span>`:'<span class="in-none">no polity recorded</span>')}
        ${u?x("fields",Lu(u.cultivation))+x("people",kw(u.people))+x("forest",Lu(u.forest)):""}`}this.inspector.classList.add("show");const g=Math.min(innerWidth-250,t+18),v=Math.max(70,Math.min(innerHeight-120,e+18));this.inspector.style.transform=`translate(${g}px, ${v}px)`}refreshLegend(){const t=this.app,e=t.timeline.era;this.legendEra=e,this.legendMahele=t.mahele.availableAt();const n=t.farView;for(const r of this.legend.querySelectorAll("[data-view]"))r.setAttribute("aria-pressed",String(n===r.dataset.view)),r.classList.toggle("on",n===r.dataset.view);const i=en('[data-view="land"]',this.legend);i.disabled=t.land.available===!1,i.title=i.disabled?"No land layers in this data":"Cultivation, settlement and forest in the chosen year";const s=en('[data-view="mahele"]',this.legend);s.disabled=!this.legendMahele,s.title=t.mahele.available===!1?"No Māhele in this data":this.legendMahele?Ru:`The land division, from ${La}`;let a="";if(n==="mahele"){const r=this.islandInView(),c=t.mahele.counts(r==null?void 0:r.pack.id);c.all&&(a=`<div class="lg-title">The Māhele of ${La}</div>${Ro.map(l=>`<div class="lg lg-mahele"><i style="background:${bt(l.colour)}"></i><b>${bt(l.name)}</b><em>${c.byClass[l.id].toLocaleString("en-US")}</em></div>`).join("")}<div class="lg-note">${bt(`${c.all.toLocaleString("en-US")} ahupuaʻa ${r?`on ${r.pack.name}`:"on all the islands"}`)}</div>`),this.legendIsland=(r==null?void 0:r.pack.id)??null}else if(n==="chiefdoms"){const r=t.polity.politiesIn(e);r.length&&(a=`<div class="lg-title">${bt((e==null?void 0:e.label)||"")}</div>${r.map(c=>`<div class="lg"><i style="background:${bt(c.colour)}"></i><b>${bt(c.name)}</b></div>`).join("")}`)}else if(n==="land"){const r=t.land.describe();if(this.legendLand=JSON.stringify(r),r){const c=r.years.length>1?`between the ${r.years[0]} and ${r.years[1]} layers`:`the ${r.years[0]} layers`,l=t.land.bound?r.early?`${c}, thinned for the early centuries`:c:"the layers are on their way";a=`<div class="lg-title">${bt((e==null?void 0:e.label)||"")}</div>${r.layers.map(h=>`<div class="lg lg-land"><i class="sw-${h.id}"></i><b>${bt(h.name)}</b>${h.note?`<em>${bt(h.note)}</em>`:""}</div>`).join("")}<div class="lg-note">${bt(l)}</div>`}}this.legendBody.innerHTML=a}setLoading(t){en(".loading",this.brand).textContent=t||""}update(t){const e=this.app,n=performance.now();this.timeline.update(t),this.pins.update(e.overlay.pins);const i=this.farStrength()>Cu;if(i!==this.legend.classList.contains("show")&&(this.legend.classList.toggle("show",i),this.legend.inert=!i),!this.inspectorAllowed()&&(this.inspector.classList.contains("show")||e.shared.uniforms.uHoverMoku.value)&&this.hideInspector(),this.syncCarded(),e.farView==="land"&&n-(this.landAt||0)>250&&(this.landAt=n,(JSON.stringify(e.land.describe())!==this.legendLand||!e.land.bound!==this.legendWaiting)&&(this.legendWaiting=!e.land.bound,this.refreshLegend())),n-(this.whereAt||0)>300){this.whereAt=n;const s=this.islandInView();en(".where",this.brand).textContent=s?s.pack.name:e.world.archPack.name,e.farView==="mahele"&&((s==null?void 0:s.pack.id)??null)!==this.legendIsland&&this.refreshLegend()}}islandInView(){const t=this.app.rig.state;return t.distance<1400?this.app.world.islandAt(t.target.x,t.target.z):null}}function Iw(o,t,e){const n=o.entry,i=nc.get(o.cls),s=l=>`<i style="background:${bt(l.colour)}"></i>`;let a=`<span class="in-pol">${s(i)}${bt(i.name)}</span>`;if(o.cls==="mixed"){const l=[...new Set(((n==null?void 0:n.parts)||[]).map(h=>h.class))].map(h=>nc.get(h)).filter(Boolean);l.length>1&&(a=`<span class="in-pol">${s(i)}${bt(i.name)}</span><span class="in-v">${bt(l.map(h=>h.name.toLowerCase()).join(" and "))}</span>`)}const r=n&&(o.cls==="konohiki"||o.cls==="mixed")?[].concat(n.awardee||[]).filter(Boolean):[],c=((n==null?void 0:n.later)||[]).map(l=>{var h;return`${((h=nc.get(l.class))==null?void 0:h.name.toLowerCase())||l.class}, ${l.year}`});return`
    <div class="in-head"><b>${bt(o.name||"Ahupuaʻa")}</b><span class="in-island">${bt(o.island||t.island||"")}</span></div>
    ${e("moku",`<span class="in-v">${bt(o.moku||t.name)}</span>`)}
    ${e("land",a)}
    ${r.length?e("awarded",`<span class="in-v">${bt(r.join(", "))}</span>`):""}
    ${c.length?e("later",`<span class="in-v">${bt(c.join("; "))}</span>`):""}`}function Lu(o){const t=o*100;return t<.5?'<span class="in-none">none</span>':t<1?"under 1%":`${Math.round(t)}%`}function kw(o){return o<.5?'<span class="in-none">none</span>':`about ${(o<10?Math.round(o):Number(o.toPrecision(2))).toLocaleString("en-US")} a km²`}function ic(o){return o.map(t=>`<li>${t.url&&/^https?:/.test(t.url)?`<a href="${bt(t.url)}" target="_blank" rel="noopener">${bt(t.title||t.id)}</a>`:bt(t.title||t.id)}${t.licence?` <em>${bt(t.licence)}</em>`:""}${t.fetched?` <em>fetched ${bt(t.fetched)}</em>`:""}</li>`).join("")}const Za=document.getElementById("boot"),od=Za.querySelector(".boot-bar span"),ad=Za.querySelector(".boot-stage"),Sa=(o,t)=>{ad.textContent=o,od.style.width=`${Math.round(t*100)}%`},Ls=o=>{console.warn(o)};async function Uw(){const o=performance.now();Sa("reading the gazetteer",.05);const t=await _d(pd(),Ls);if(!t.packs.length)throw new Error("the manifest lists no packs");const e=new Mw(document.getElementById("scene"),t,{warn:Ls});window.__app=e;const n=new bd(2,Ls);Sa("raising the islands",.25);const i=e.world.archPack;i.data=await n.decode(i),Sa("placing the boundaries",.8),await new Promise(c=>setTimeout(c,0)),e.start();const s=new Dw(e);e.ui=s,console.log(`archipelago ready in ${((performance.now()-o)/1e3).toFixed(1)} s`),Sa("",1);let a=0;const r=()=>{if(++a<4)return requestAnimationFrame(r);Za.classList.add("gone"),setTimeout(()=>Za.remove(),1200),zw(e,s,n),e.patches.load().catch(c=>{Ls(`patches: ${c.message}`),e.patches.resolveReady([])}),e.districts.load().catch(c=>Ls(`districts: ${c.message}`))};requestAnimationFrame(r)}async function zw(o,t,e){const n=o.rig.state.target,i=r=>Math.hypot((r.rect.x0+r.rect.x1)/2-n.x,(r.rect.z0+r.rect.z1)/2-n.z),s=[...o.world.islandPacks].sort((r,c)=>i(r)-i(c));let a=0;t.setLoading(s.length?`· ${s.length} islands to come`:""),await Promise.all(s.map(async r=>{try{r.data=await e.decode(r),o.addIsland(r)}catch(c){Ls(`${r.id}: ${c.message}`)}a++,t.setLoading(a<s.length?`· ${s.length-a} islands to come`:"")})),e.dispose(),o.islandsLoaded=!0,o.land.load()}Uw().catch(o=>{console.error(o),ad.textContent="something went wrong — see the console",od.style.background="#c0584a"});
