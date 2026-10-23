var tp=Object.defineProperty;var ep=(s,t,e)=>t in s?tp(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var ro=(s,t,e)=>ep(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const qs=100,np=8,wl=9e3,Io=1.3,ip=5.5,yl=100,sp=6e3;function Ml(s){const t=Math.log(Math.max(1,s)/yl)/Math.log(sp/yl),e=Math.max(0,Math.min(1,t));return Io+(ip-Io)*e*e*(3-2*e)}const xf=2,jn=5,$s=32,Jn=16,wf=1.6,Pe={far:115,near:75,rig:[95,135],margin:7,band:.5,prefetch:320,linger:25,hold:90},op=.024;function ap(){const t=new URLSearchParams(location.search).get("data")||"./data/";return t.endsWith("/")?t:`${t}/`}const rp=Math.PI/180;class yf{constructor({lat0:t=20.5,lon0:e=-157.5}={}){this.lat0=t,this.lon0=e,this.kx=Math.cos(t*rp)*111320/qs,this.kz=110574/qs}x(t){return(t-this.lon0)*this.kx}z(t){return-(t-this.lat0)*this.kz}toWorld(t){return[this.x(t[0]),this.z(t[1])]}toLonLat(t,e){return[t/this.kx+this.lon0,-e/this.kz+this.lat0]}rect([t,e,n,i]){return{x0:this.x(t),z0:this.z(i),x1:this.x(n),z1:this.z(e)}}}function Ba(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[ʻʼ‘’'`]/g,"").toLowerCase().replace(/[^a-z]/g,"")}function dn(s){if(!s)return null;if(s.type==="Point")return s.coordinates;if(s.type==="LineString")return s.coordinates[Math.floor(s.coordinates.length/2)];if(s.type==="MultiPoint")return s.coordinates[0];const t=s.type==="Polygon"?[s.coordinates[0]]:s.type==="MultiPolygon"?s.coordinates.map(o=>o[0]):null;if(!t)return null;let e=0,n=0,i=0;for(const o of t)for(let a=0,r=o.length-1;a<o.length;r=a++){const c=o[r][0]*o[a][1]-o[a][0]*o[r][1];e+=c,n+=(o[r][0]+o[a][0])*c,i+=(o[r][1]+o[a][1])*c}return Math.abs(e)<1e-12?t[0][0]:[n/(3*e),i/(3*e)]}async function Qn(s){var l;const t=await fetch(s);if(!t.ok)throw new Error(`${s}: HTTP ${t.status}`);const e=await t.blob(),n=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),i=n.width,o=n.height;let a;typeof OffscreenCanvas<"u"?a=new OffscreenCanvas(i,o):(a=document.createElement("canvas"),a.width=i,a.height=o);const r=a.getContext("2d",{willReadFrequently:!0});r.imageSmoothingEnabled=!1,r.drawImage(n,0,0);const c=r.getImageData(0,0,i,o).data;return(l=n.close)==null||l.call(n),{px:c,W:i,H:o}}function Mf(s,t,e,n,i,o=4){const a=new Float32Array(t*e);for(let r=0,c=0;r<t*e;r++,c+=o)a[r]=(s[c]*256+s[c+1])*n+i;return a}function _f(s,t,e,n=4){const i=new Uint8Array(t*e);for(let o=0,a=0;o<t*e;o++,a+=n)i[o]=s[a];return i}function cp(s){let t=0,e=0;for(let n=0;n<s.length;n+=7)s[n]>0||(t++,s[n]>-1.6&&e++);return t>100&&e>t*.95}function lp(s,t,e,n,i){const o=un(t,e,a=>s[a]>0,n,i);for(let a=0;a<s.length;a++){if(s[a]>0)continue;const r=o[a]/1e3;s[a]=-(1+30*r+3600*(1-Math.exp(-Math.max(0,r-.6)/6)))}}function Nn(s,t,e,n,i=1){let o=Float32Array.from(s);const a=new Float32Array(t*e),r=1/(2*n+1);for(let c=0;c<i;c++){for(let l=0;l<e;l++){const h=l*t;let u=0;for(let f=-n;f<=n;f++)u+=o[h+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)a[h+f]=u*r,u+=o[h+Math.min(t-1,f+n+1)]-o[h+Math.max(0,f-n)]}for(let l=0;l<t;l++){let h=0;for(let u=-n;u<=n;u++)h+=a[Math.min(e-1,Math.max(0,u))*t+l];for(let u=0;u<e;u++)o[u*t+l]=h*r,h+=a[Math.min(e-1,u+n+1)*t+l]-a[Math.max(0,u-n)*t+l]}}return o}function _l(s,t,e,n,i,o){const a=o*o;let r=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let c=1;c<t;c++){let l=(s[c]+c*c*a-(s[n[r]]+n[r]*n[r]*a))/(2*a*(c-n[r]));for(;l<=i[r];)r--,l=(s[c]+c*c*a-(s[n[r]]+n[r]*n[r]*a))/(2*a*(c-n[r]));r++,n[r]=c,i[r]=l,i[r+1]=1/0}r=0;for(let c=0;c<t;c++){for(;i[r+1]<c;)r++;const l=(c-n[r])*o;e[c]=l*l+s[n[r]]}}function un(s,t,e,n=1,i=1){const a=new Float64Array(s*t);for(let d=0;d<s*t;d++)a[d]=e(d)?0:1e20;const r=Math.max(s,t),c=new Float64Array(r),l=new Float64Array(r),h=new Int32Array(r),u=new Float64Array(r+1);for(let d=0;d<s;d++){for(let g=0;g<t;g++)c[g]=a[g*s+d];_l(c,t,l,h,u,i);for(let g=0;g<t;g++)a[g*s+d]=l[g]}const f=new Float32Array(s*t);for(let d=0;d<t;d++){const g=d*s;for(let v=0;v<s;v++)c[v]=a[g+v];_l(c,s,l,h,u,n);for(let v=0;v<s;v++)f[g+v]=Math.sqrt(l[v])}return f}function bf(s,t,e,n,i){const o=Math.max(1,Math.round(Math.max(t,e)/512)),a=Math.ceil(t/o),r=Math.ceil(e/o),c=new Float32Array(a*r);for(let f=0;f<r;f++)for(let d=0;d<a;d++){let g=0,v=0;for(let m=f*o;m<Math.min(e,(f+1)*o);m++)for(let p=d*o;p<Math.min(t,(d+1)*o);p++)g+=Math.max(0,s[m*t+p]),v++;c[f*a+d]=g/v*Io}const l=new Float32Array(a*r),h=[1,2,3,5,7,10,14,19,26,34],u=[];for(let f=0;f<8;f++)u.push([Math.cos(f*Math.PI/4),Math.sin(f*Math.PI/4)]);for(let f=0;f<r;f++)for(let d=0;d<a;d++){const g=c[f*a+d];if(g<=0){l[f*a+d]=1;continue}let v=0;for(const[m,p]of u){let x=0;const w=Math.hypot(m*n,p*i)*o;for(const b of h){const y=Math.round(d+m*b),S=Math.round(f+p*b);if(y<0||S<0||y>=a||S>=r)break;const E=(c[S*a+y]-g)/(b*w);E>x&&(x=E)}v+=x/Math.sqrt(1+x*x)}l[f*a+d]=1-v/8*.95}return{data:l,w:a,h:r,f:o}}function Sf(s,t,e,n,i,o){const a=new Uint8Array(t*e*4),r=xf;for(let c=0;c<e;c++){const l=Math.max(0,c-1),h=Math.min(e-1,c+1);for(let u=0;u<t;u++){const f=c*t+u,d=Math.max(0,u-1),g=Math.min(t-1,u+1),v=(s[c*t+g]-s[c*t+d])/((g-d)*n),m=(s[h*t+u]-s[l*t+u])/((h-l)*i),p=-v*r,x=-m*r,w=Math.hypot(p,1,x);a[f*4]=Math.round((p/w*.5+.5)*255),a[f*4+1]=Math.round((1/w*.5+.5)*255),a[f*4+2]=Math.round((x/w*.5+.5)*255);let b=1;if(o){const y=Math.min(o.w-1.001,Math.max(0,(u+.5)/o.f-.5)),S=Math.min(o.h-1.001,Math.max(0,(c+.5)/o.f-.5)),E=y|0,T=S|0,M=y-E,_=S-T,A=T*o.w+E,R=o.data,D=Math.min(o.w-1,E+1)-E,C=Math.min(o.h-1,T+1)-T,z=R[A]+(R[A+D]-R[A])*M,I=R[A+C*o.w]+(R[A+C*o.w+D]-R[A+C*o.w])*M;b=z+(I-z)*_}a[f*4+3]=Math.round(Math.max(0,Math.min(1,b))*255)}}return a}function Ef(s,t,e,n,i){const o=t*e,a=n*i/1e6,r=new Float32Array(o);let c=0,l=0;for(let m=0;m<o;m++)s[m]>0&&(r[m]=a,s[m]>c&&(c=s[m]),l++);if(!l)return r;const h=Math.min(65536,Math.ceil(c)+2),u=m=>Math.min(h-1,Math.floor(m/c*(h-2))),f=new Uint32Array(h+1);for(let m=0;m<o;m++)s[m]>0&&f[u(s[m])+1]++;for(let m=0;m<h;m++)f[m+1]+=f[m];const d=new Uint32Array(l),g=f.slice();for(let m=0;m<o;m++)s[m]>0&&(d[g[u(s[m])]++]=m);const v=Math.hypot(n,i);for(let m=l-1;m>=0;m--){const p=d[m],x=p%t,w=(p-x)/t,b=s[p];let y=-1,S=0;for(let E=-1;E<=1;E++){const T=w+E;if(!(T<0||T>=e))for(let M=-1;M<=1;M++){if(!M&&!E)continue;const _=x+M;if(_<0||_>=t)continue;const A=T*t+_,R=(b-s[A])/(M&&E?v:M?n:i);R>S&&(S=R,y=A)}}y>=0&&s[y]>0&&(r[y]+=r[p])}return r}function hp(s,t,e,n,i,o){const a=e*n,r=new Uint8Array(a*4),c=Ef(s,e,n,i,o),l=i*o/1e6,h=Math.max(.04,4*l),u=new Float32Array(a);for(let p=0;p<a;p++)u[p]=s[p]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,c[p])/h)/1.6)):0;const f=Nn(u,e,n,1,2),d=un(e,n,p=>s[p]<=0,i,o),g=new Float32Array(a);for(let p=0;p<n;p++)for(let x=0;x<e;x++){const w=p*e+x;if(s[w]<=0||s[w]>9)continue;const b=Math.min(e-1,x+1),y=Math.max(0,x-1),S=Math.min(n-1,p+1),E=Math.max(0,p-1),T=Math.hypot((s[p*e+b]-s[p*e+y])/((b-y)*i),(s[S*e+x]-s[E*e+x])/((S-E)*o));g[w]=d[w]<260+Math.max(i,o)&&T<.12?1:0}const v=Nn(g,e,n,1,1),m=1.5*Math.min(1,70/Math.max(i,o));for(let p=0;p<a;p++)r[p*4]=t?t[p]:s[p]>0?82:0,r[p*4+1]=Math.round(255*Math.min(1,v[p]*m)),r[p*4+2]=Math.round(255*Math.min(1,f[p]*1.6)),r[p*4+3]=0;return r}function up({heightPx:s,rainPx:t,W:e,H:n,scale:i,offset:o,mx:a,mz:r,stride:c=4}){const l=Mf(s,e,n,i,o,c),h=cp(l);h&&lp(l,e,n,a,r);const u=t?_f(t,e,n,c):null,f=bf(l,e,n,a,r),d=Sf(l,e,n,a,r,f),g=hp(l,u,e,n,a,r);let v=1/0,m=-1/0;for(let p=0;p<l.length;p++)l[p]<v&&(v=l[p]),l[p]>m&&(m=l[p]);return{metres:l,normals:d,land:g,flatSea:h,lo:v,hi:m}}async function Si(s,t,e){try{const n=await fetch(s);if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}catch(n){if(t===void 0)throw new Error(`${s}: ${n.message}`);return e==null||e(`${s}: ${n.message} (carrying on without it)`),t}}const Yo=(s,t)=>Array.isArray(s)?s:Array.isArray(s==null?void 0:s[t])?s[t]:[];async function fp(s,t=console.warn){const e=d=>new URL(d,new URL(s,location.href)).href,n=await Si(e("manifest.json")),[i,o,a,r,c,l,h]=await Promise.all([Si(e("boundaries/moku.geojson"),null,t),Si(e("boundaries/ahupuaa.geojson"),null,t),Si(e("eras.json"),[],t),Si(e("places.json"),[],t),Si(e("events.json"),[],t),Si(e("sources.json"),[],t),Si(e("polities.json"),{polities:[],byEra:{}},t)]),u=new yf(n.projection||{}),f=(n.packs||[]).map(d=>dp(d,u,e));return{base:s,abs:e,manifest:n,proj:u,packs:f,moku:i,ahupuaa:o,eras:Yo(a,"eras"),places:Yo(r,"places"),events:Yo(c,"events"),sources:Yo(l,"sources"),polities:{polities:(h==null?void 0:h.polities)||[],byEra:(h==null?void 0:h.byEra)||{}}}}function dp(s,t,e){var a;const n=t.rect(s.bounds),[i,o]=s.size;return{id:s.id,kind:s.kind,name:s.name||s.id,desc:s,rect:n,W:i,H:o,mx:(n.x1-n.x0)*qs/i,mz:(n.z1-n.z0)*qs/o,heightUrl:e(s.height.file),rainUrl:(a=s.rain)!=null&&a.file?e(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,sources:s.sources||[],data:null}}class pp{constructor(t=2,e=console.warn){this.warn=e,this.jobs=new Map,this.next=1,this.workers=[],this.free=[],this.queue=[];try{for(let n=0;n<t;n++){const i=new Worker(new URL(""+new URL("worker-D-2AoFNa.js",import.meta.url).href,import.meta.url),{type:"module"});i.onmessage=o=>this.message(i,o.data),i.onerror=o=>{var a;(a=o.preventDefault)==null||a.call(o),this.fallback=!0;for(const[r,c]of this.jobs)c.worker===i&&this.mainThread(r,c)},this.workers.push(i),this.free.push(i)}}catch{this.fallback=!0}}decode(t){return new Promise((e,n)=>{const i=this.next++,o={pack:t,resolve:e,reject:n};this.jobs.set(i,o),this.fallback||!this.workers.length?this.mainThread(i,o):(this.queue.push(i),this.pump())})}pump(){for(;this.free.length&&this.queue.length;){const t=this.queue.shift(),e=this.jobs.get(t),n=this.free.pop();e.worker=n;const i=e.pack;n.postMessage({job:t,heightUrl:i.heightUrl,rainUrl:i.rainUrl,W:i.W,H:i.H,scale:i.scale,offset:i.offset,mx:i.mx,mz:i.mz})}}message(t,e){const n=this.jobs.get(e.job);if(n){if(e.warn)return this.warn(e.warn);this.jobs.delete(e.job),this.free.push(t),e.ok?n.resolve(e):/OffscreenCanvas|getContext|createImageBitmap/i.test(e.message)?(this.fallback=!0,this.jobs.set(e.job,n),this.mainThread(e.job,n)):n.reject(new Error(e.message)),this.pump()}}async mainThread(t,e){try{const n=e.pack,i=await Qn(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);let o=null;n.rainUrl&&(o=await Qn(n.rainUrl).then(r=>r.W===n.W&&r.H===n.H?r.px:null).catch(()=>null));const a=up({heightPx:i.px,rainPx:o,W:n.W,H:n.H,scale:n.scale,offset:n.offset,mx:n.mx,mz:n.mz});this.jobs.delete(t),e.resolve(a)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){for(const t of this.workers)t.terminate()}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Kc="160",mp=0,bl=1,gp=2,Af=1,vp=2,hi=3,yi=0,hn=1,Ln=2,wi=0,js=1,Ac=2,Sl=3,Tc=4,xp=5,ts=100,wp=101,yp=102,El=103,Al=104,Mp=200,_p=201,bp=202,Sp=203,Cc=204,Rc=205,Ep=206,Ap=207,Tp=208,Cp=209,Rp=210,Lp=211,Pp=212,Dp=213,kp=214,zp=0,Ip=1,Up=2,Ya=3,Fp=4,Np=5,Op=6,Bp=7,Tf=0,Wp=1,Gp=2,Ii=0,Hp=1,Vp=2,$p=3,jp=4,Xp=5,qp=6,Cf=300,Ys=301,Ks=302,Lc=303,Pc=304,gr=306,Ka=1e3,cn=1001,Dc=1002,se=1003,Tl=1004,Rr=1005,je=1006,Yp=1007,ls=1008,ge=1009,Kp=1010,Zp=1011,Zc=1012,Rf=1013,mi=1014,gi=1015,Ui=1016,Lf=1017,Pf=1018,as=1020,Jp=1021,De=1023,Qp=1024,t0=1025,rs=1026,Zs=1027,Ni=1028,Df=1029,kf=1030,zf=1031,If=1033,Lr=33776,Pr=33777,Dr=33778,kr=33779,Cl=35840,Rl=35841,Ll=35842,Pl=35843,Uf=36196,Dl=37492,kl=37496,zl=37808,Il=37809,Ul=37810,Fl=37811,Nl=37812,Ol=37813,Bl=37814,Wl=37815,Gl=37816,Hl=37817,Vl=37818,$l=37819,jl=37820,Xl=37821,zr=36492,ql=36494,Yl=36495,e0=36283,Kl=36284,Zl=36285,Jl=36286,Ff=3e3,cs=3001,n0=3200,i0=3201,s0=0,o0=1,Pn="",$e="srgb",Mi="srgb-linear",Jc="display-p3",vr="display-p3-linear",Za="linear",de="srgb",Ja="rec709",Qa="p3",ds=7680,Ql=519,a0=512,r0=513,c0=514,Nf=515,l0=516,h0=517,u0=518,f0=519,th=35044,bn=35048,eh="300 es",kc=1035,vi=2e3,tr=2001;class to{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const o=i.indexOf(e);o!==-1&&i.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let o=0,a=i.length;o<a;o++)i[o].call(this,t);t.target=null}}}const qe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let nh=1234567;const Eo=Math.PI/180,Uo=180/Math.PI;function eo(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qe[s&255]+qe[s>>8&255]+qe[s>>16&255]+qe[s>>24&255]+"-"+qe[t&255]+qe[t>>8&255]+"-"+qe[t>>16&15|64]+qe[t>>24&255]+"-"+qe[e&63|128]+qe[e>>8&255]+"-"+qe[e>>16&255]+qe[e>>24&255]+qe[n&255]+qe[n>>8&255]+qe[n>>16&255]+qe[n>>24&255]).toLowerCase()}function rn(s,t,e){return Math.max(t,Math.min(e,s))}function Qc(s,t){return(s%t+t)%t}function d0(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function p0(s,t,e){return s!==t?(e-s)/(t-s):0}function Ao(s,t,e){return(1-e)*s+e*t}function m0(s,t,e,n){return Ao(s,t,1-Math.exp(-e*n))}function g0(s,t=1){return t-Math.abs(Qc(s,t*2)-t)}function v0(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function x0(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function w0(s,t){return s+Math.floor(Math.random()*(t-s+1))}function y0(s,t){return s+Math.random()*(t-s)}function M0(s){return s*(.5-Math.random())}function _0(s){s!==void 0&&(nh=s);let t=nh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function b0(s){return s*Eo}function S0(s){return s*Uo}function zc(s){return(s&s-1)===0&&s!==0}function E0(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function er(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function A0(s,t,e,n,i){const o=Math.cos,a=Math.sin,r=o(e/2),c=a(e/2),l=o((t+n)/2),h=a((t+n)/2),u=o((t-n)/2),f=a((t-n)/2),d=o((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":s.set(r*h,c*u,c*f,r*l);break;case"YZY":s.set(c*f,r*h,c*u,r*l);break;case"ZXZ":s.set(c*u,c*f,r*h,r*l);break;case"XZX":s.set(r*h,c*g,c*d,r*l);break;case"YXY":s.set(c*d,r*h,c*g,r*l);break;case"ZYZ":s.set(c*g,c*d,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Ds(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function en(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Ke={DEG2RAD:Eo,RAD2DEG:Uo,generateUUID:eo,clamp:rn,euclideanModulo:Qc,mapLinear:d0,inverseLerp:p0,lerp:Ao,damp:m0,pingpong:g0,smoothstep:v0,smootherstep:x0,randInt:w0,randFloat:y0,randFloatSpread:M0,seededRandom:_0,degToRad:b0,radToDeg:S0,isPowerOfTwo:zc,ceilPowerOfTwo:E0,floorPowerOfTwo:er,setQuaternionFromProperEuler:A0,normalize:en,denormalize:Ds};class Ht{constructor(t=0,e=0){Ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(rn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*n-a*i+t.x,this.y=o*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qt{constructor(t,e,n,i,o,a,r,c,l){Qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,a,r,c,l)}set(t,e,n,i,o,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=i,h[2]=r,h[3]=e,h[4]=o,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,a=n[0],r=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],v=i[0],m=i[3],p=i[6],x=i[1],w=i[4],b=i[7],y=i[2],S=i[5],E=i[8];return o[0]=a*v+r*x+c*y,o[3]=a*m+r*w+c*S,o[6]=a*p+r*b+c*E,o[1]=l*v+h*x+u*y,o[4]=l*m+h*w+u*S,o[7]=l*p+h*b+u*E,o[2]=f*v+d*x+g*y,o[5]=f*m+d*w+g*S,o[8]=f*p+d*b+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-n*o*h+n*r*c+i*o*l-i*a*c}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*a-r*l,f=r*c-h*o,d=l*o-a*c,g=e*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(i*l-h*n)*v,t[2]=(r*n-i*a)*v,t[3]=f*v,t[4]=(h*e-i*c)*v,t[5]=(i*o-r*e)*v,t[6]=d*v,t[7]=(n*c-l*e)*v,t[8]=(a*e-n*o)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,o,a,r){const c=Math.cos(o),l=Math.sin(o);return this.set(n*c,n*l,-n*(c*a+l*r)+a+t,-i*l,i*c,-i*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Ir.makeScale(t,e)),this}rotate(t){return this.premultiply(Ir.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ir.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ir=new Qt;function Of(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function nr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function T0(){const s=nr("canvas");return s.style.display="block",s}const ih={};function To(s){s in ih||(ih[s]=!0,console.warn(s))}const sh=new Qt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),oh=new Qt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ko={[Mi]:{transfer:Za,primaries:Ja,toReference:s=>s,fromReference:s=>s},[$e]:{transfer:de,primaries:Ja,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[vr]:{transfer:Za,primaries:Qa,toReference:s=>s.applyMatrix3(oh),fromReference:s=>s.applyMatrix3(sh)},[Jc]:{transfer:de,primaries:Qa,toReference:s=>s.convertSRGBToLinear().applyMatrix3(oh),fromReference:s=>s.applyMatrix3(sh).convertLinearToSRGB()}},C0=new Set([Mi,vr]),le={enabled:!0,_workingColorSpace:Mi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!C0.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=Ko[t].toReference,i=Ko[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Ko[s].primaries},getTransfer:function(s){return s===Pn?Za:Ko[s].transfer}};function Xs(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ur(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ps;class Bf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ps===void 0&&(ps=nr("canvas")),ps.width=t.width,ps.height=t.height;const n=ps.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ps}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=nr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),o=i.data;for(let a=0;a<o.length;a++)o[a]=Xs(o[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Xs(e[n]/255)*255):e[n]=Xs(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let R0=0;class Wf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:R0++}),this.uuid=eo(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let o;if(Array.isArray(i)){o=[];for(let a=0,r=i.length;a<r;a++)i[a].isDataTexture?o.push(Fr(i[a].image)):o.push(Fr(i[a]))}else o=Fr(i);n.url=o}return e||(t.images[this.uuid]=n),n}}function Fr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Bf.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let L0=0;class pn extends to{constructor(t=pn.DEFAULT_IMAGE,e=pn.DEFAULT_MAPPING,n=cn,i=cn,o=je,a=ls,r=De,c=ge,l=pn.DEFAULT_ANISOTROPY,h=Pn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:L0++}),this.uuid=eo(),this.name="",this.source=new Wf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=o,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Ht(0,0),this.repeat=new Ht(1,1),this.center=new Ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(To("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===cs?$e:Pn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Cf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ka:t.x=t.x-Math.floor(t.x);break;case cn:t.x=t.x<0?0:1;break;case Dc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ka:t.y=t.y-Math.floor(t.y);break;case cn:t.y=t.y<0?0:1;break;case Dc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return To("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===$e?cs:Ff}set encoding(t){To("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===cs?$e:Pn}}pn.DEFAULT_IMAGE=null;pn.DEFAULT_MAPPING=Cf;pn.DEFAULT_ANISOTROPY=1;class te{constructor(t=0,e=0,n=0,i=1){te.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*o,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*o,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*o,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,o;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(l+1)/2,b=(d+1)/2,y=(p+1)/2,S=(h+f)/4,E=(u+v)/4,T=(g+m)/4;return w>b&&w>y?w<.01?(n=0,i=.707106781,o=.707106781):(n=Math.sqrt(w),i=S/n,o=E/n):b>y?b<.01?(n=.707106781,i=0,o=.707106781):(i=Math.sqrt(b),n=S/i,o=T/i):y<.01?(n=.707106781,i=.707106781,o=0):(o=Math.sqrt(y),n=E/o,i=T/o),this.set(n,i,o,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-v)/x,this.z=(f-h)/x,this.w=Math.acos((l+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class P0 extends to{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new te(0,0,t,e),this.scissorTest=!1,this.viewport=new te(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(To("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===cs?$e:Pn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:je,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new pn(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Wf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ti extends P0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Gf extends pn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=se,this.minFilter=se,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class D0 extends pn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=se,this.minFilter=se,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _i{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,o,a,r){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const f=o[a+0],d=o[a+1],g=o[a+2],v=o[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==f||l!==d||h!==g){let m=1-r;const p=c*f+l*d+h*g+u*v,x=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const y=Math.sqrt(w),S=Math.atan2(y,p*x);m=Math.sin(m*S)/y,r=Math.sin(r*S)/y}const b=r*x;if(c=c*m+f*b,l=l*m+d*b,h=h*m+g*b,u=u*m+v*b,m===1-r){const y=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=y,l*=y,h*=y,u*=y}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,o,a){const r=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=o[a],f=o[a+1],d=o[a+2],g=o[a+3];return t[e]=r*g+h*u+c*d-l*f,t[e+1]=c*g+h*f+l*u-r*d,t[e+2]=l*g+h*d+r*f-c*u,t[e+3]=h*g-r*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,o=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(n/2),h=r(i/2),u=r(o/2),f=c(n/2),d=c(i/2),g=c(o/2);switch(a){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],o=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+r+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(o-l)*d,this._z=(a-i)*d}else if(n>r&&n>u){const d=2*Math.sqrt(1+n-r-u);this._w=(h-c)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(o+l)/d}else if(r>u){const d=2*Math.sqrt(1+r-n-u);this._w=(o-l)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-r);this._w=(a-i)/d,this._x=(o+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(rn(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,o=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*r+i*l-o*c,this._y=i*h+a*c+o*r-n*l,this._z=o*h+a*l+n*c-i*r,this._w=a*h-n*r-i*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,o=this._z,a=this._w;let r=a*t._w+n*t._x+i*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=n,this._y=i,this._z=o,this;const c=1-r*r;if(c<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*i+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(o),n*Math.cos(o),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(t=0,e=0,n=0){W.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ah.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ah.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*i,this.y=o[1]*e+o[4]*n+o[7]*i,this.z=o[2]*e+o[5]*n+o[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=t.elements,a=1/(o[3]*e+o[7]*n+o[11]*i+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*i+o[12])*a,this.y=(o[1]*e+o[5]*n+o[9]*i+o[13])*a,this.z=(o[2]*e+o[6]*n+o[10]*i+o[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,o=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*i-r*n),h=2*(r*e-o*i),u=2*(o*n-a*e);return this.x=e+c*l+a*u-r*h,this.y=n+c*h+r*l-o*u,this.z=i+c*u+o*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i,this.y=o[1]*e+o[5]*n+o[9]*i,this.z=o[2]*e+o[6]*n+o[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,o=t.z,a=e.x,r=e.y,c=e.z;return this.x=i*c-o*r,this.y=o*a-n*c,this.z=n*r-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Nr.copy(this).projectOnVector(t),this.sub(Nr)}reflect(t){return this.sub(Nr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(rn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Nr=new W,ah=new _i;class Sn{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(kn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(kn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=kn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,kn):kn.fromBufferAttribute(o,a),kn.applyMatrix4(t.matrixWorld),this.expandByPoint(kn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Zo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Zo.copy(n.boundingBox)),Zo.applyMatrix4(t.matrixWorld),this.union(Zo)}const i=t.children;for(let o=0,a=i.length;o<a;o++)this.expandByObject(i[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,kn),kn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(co),Jo.subVectors(this.max,co),ms.subVectors(t.a,co),gs.subVectors(t.b,co),vs.subVectors(t.c,co),Ei.subVectors(gs,ms),Ai.subVectors(vs,gs),Vi.subVectors(ms,vs);let e=[0,-Ei.z,Ei.y,0,-Ai.z,Ai.y,0,-Vi.z,Vi.y,Ei.z,0,-Ei.x,Ai.z,0,-Ai.x,Vi.z,0,-Vi.x,-Ei.y,Ei.x,0,-Ai.y,Ai.x,0,-Vi.y,Vi.x,0];return!Or(e,ms,gs,vs,Jo)||(e=[1,0,0,0,1,0,0,0,1],!Or(e,ms,gs,vs,Jo))?!1:(Qo.crossVectors(Ei,Ai),e=[Qo.x,Qo.y,Qo.z],Or(e,ms,gs,vs,Jo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,kn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(kn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const oi=[new W,new W,new W,new W,new W,new W,new W,new W],kn=new W,Zo=new Sn,ms=new W,gs=new W,vs=new W,Ei=new W,Ai=new W,Vi=new W,co=new W,Jo=new W,Qo=new W,$i=new W;function Or(s,t,e,n,i){for(let o=0,a=s.length-3;o<=a;o+=3){$i.fromArray(s,o);const r=i.x*Math.abs($i.x)+i.y*Math.abs($i.y)+i.z*Math.abs($i.z),c=t.dot($i),l=e.dot($i),h=n.dot($i);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const k0=new Sn,lo=new W,Br=new W;class Oi{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):k0.setFromPoints(t).getCenter(n);let i=0;for(let o=0,a=t.length;o<a;o++)i=Math.max(i,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;lo.subVectors(t,this.center);const e=lo.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(lo,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Br.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(lo.copy(t.center).add(Br)),this.expandByPoint(lo.copy(t.center).sub(Br))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ai=new W,Wr=new W,ta=new W,Ti=new W,Gr=new W,ea=new W,Hr=new W;class tl{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ai)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ai.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ai.copy(this.origin).addScaledVector(this.direction,e),ai.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Wr.copy(t).add(e).multiplyScalar(.5),ta.copy(e).sub(t).normalize(),Ti.copy(this.origin).sub(Wr);const o=t.distanceTo(e)*.5,a=-this.direction.dot(ta),r=Ti.dot(this.direction),c=-Ti.dot(ta),l=Ti.lengthSq(),h=Math.abs(1-a*a);let u,f,d,g;if(h>0)if(u=a*c-r,f=a*r-c,g=o*h,u>=0)if(f>=-g)if(f<=g){const v=1/h;u*=v,f*=v,d=u*(u+a*f+2*r)+f*(a*u+f+2*c)+l}else f=o,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*c)+l;else f=-o,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-a*o+r)),f=u>0?-o:Math.min(Math.max(-o,-c),o),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-o,-c),o),d=f*(f+2*c)+l):(u=Math.max(0,-(a*o+r)),f=u>0?o:Math.min(Math.max(-o,-c),o),d=-u*u+f*(f+2*c)+l);else f=a>0?-o:o,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Wr).addScaledVector(ta,f),d}intersectSphere(t,e){ai.subVectors(t.center,this.origin);const n=ai.dot(this.direction),i=ai.dot(ai)-n*n,o=t.radius*t.radius;if(i>o)return null;const a=Math.sqrt(o-i),r=n-a,c=n+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,o,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,i=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,i=(t.min.x-f.x)*l),h>=0?(o=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(o=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||o>i||((o>n||isNaN(n))&&(n=o),(a<i||isNaN(i))&&(i=a),u>=0?(r=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(r=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||r>i)||((r>n||n!==n)&&(n=r),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ai)!==null}intersectTriangle(t,e,n,i,o){Gr.subVectors(e,t),ea.subVectors(n,t),Hr.crossVectors(Gr,ea);let a=this.direction.dot(Hr),r;if(a>0){if(i)return null;r=1}else if(a<0)r=-1,a=-a;else return null;Ti.subVectors(this.origin,t);const c=r*this.direction.dot(ea.crossVectors(Ti,ea));if(c<0)return null;const l=r*this.direction.dot(Gr.cross(Ti));if(l<0||c+l>a)return null;const h=-r*Ti.dot(Hr);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ie{constructor(t,e,n,i,o,a,r,c,l,h,u,f,d,g,v,m){ie.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,a,r,c,l,h,u,f,d,g,v,m)}set(t,e,n,i,o,a,r,c,l,h,u,f,d,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=o,p[5]=a,p[9]=r,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ie().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/xs.setFromMatrixColumn(t,0).length(),o=1/xs.setFromMatrixColumn(t,1).length(),a=1/xs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,o=t.z,a=Math.cos(n),r=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const f=a*h,d=a*u,g=r*h,v=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+g*l,e[5]=f-v*l,e[9]=-r*c,e[2]=v-f*l,e[6]=g+d*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,g=l*h,v=l*u;e[0]=f+v*r,e[4]=g*r-d,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=d*r-g,e[6]=v+f*r,e[10]=a*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,g=l*h,v=l*u;e[0]=f-v*r,e[4]=-a*u,e[8]=g+d*r,e[1]=d+g*r,e[5]=a*h,e[9]=v-f*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const f=a*h,d=a*u,g=r*h,v=r*u;e[0]=c*h,e[4]=g*l-d,e[8]=f*l+v,e[1]=c*u,e[5]=v*l+f,e[9]=d*l-g,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,d=a*l,g=r*c,v=r*l;e[0]=c*h,e[4]=v-f*u,e[8]=g*u+d,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=d*u+g,e[10]=f-v*u}else if(t.order==="XZY"){const f=a*c,d=a*l,g=r*c,v=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+v,e[5]=a*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=r*h,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(z0,t,I0)}lookAt(t,e,n){const i=this.elements;return vn.subVectors(t,e),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Ci.crossVectors(n,vn),Ci.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Ci.crossVectors(n,vn)),Ci.normalize(),na.crossVectors(vn,Ci),i[0]=Ci.x,i[4]=na.x,i[8]=vn.x,i[1]=Ci.y,i[5]=na.y,i[9]=vn.y,i[2]=Ci.z,i[6]=na.z,i[10]=vn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,a=n[0],r=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],v=n[6],m=n[10],p=n[14],x=n[3],w=n[7],b=n[11],y=n[15],S=i[0],E=i[4],T=i[8],M=i[12],_=i[1],A=i[5],R=i[9],D=i[13],C=i[2],z=i[6],I=i[10],O=i[14],N=i[3],j=i[7],H=i[11],J=i[15];return o[0]=a*S+r*_+c*C+l*N,o[4]=a*E+r*A+c*z+l*j,o[8]=a*T+r*R+c*I+l*H,o[12]=a*M+r*D+c*O+l*J,o[1]=h*S+u*_+f*C+d*N,o[5]=h*E+u*A+f*z+d*j,o[9]=h*T+u*R+f*I+d*H,o[13]=h*M+u*D+f*O+d*J,o[2]=g*S+v*_+m*C+p*N,o[6]=g*E+v*A+m*z+p*j,o[10]=g*T+v*R+m*I+p*H,o[14]=g*M+v*D+m*O+p*J,o[3]=x*S+w*_+b*C+y*N,o[7]=x*E+w*A+b*z+y*j,o[11]=x*T+w*R+b*I+y*H,o[15]=x*M+w*D+b*O+y*J,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],o=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+o*c*u-i*l*u-o*r*f+n*l*f+i*r*d-n*c*d)+v*(+e*c*d-e*l*f+o*a*f-i*a*d+i*l*h-o*c*h)+m*(+e*l*u-e*r*d-o*a*u+n*a*d+o*r*h-n*l*h)+p*(-i*r*h-e*c*u+e*r*f+i*a*u-n*a*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],v=t[13],m=t[14],p=t[15],x=u*m*l-v*f*l+v*c*d-r*m*d-u*c*p+r*f*p,w=g*f*l-h*m*l-g*c*d+a*m*d+h*c*p-a*f*p,b=h*v*l-g*u*l+g*r*d-a*v*d-h*r*p+a*u*p,y=g*u*c-h*v*c-g*r*f+a*v*f+h*r*m-a*u*m,S=e*x+n*w+i*b+o*y;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=x*E,t[1]=(v*f*o-u*m*o-v*i*d+n*m*d+u*i*p-n*f*p)*E,t[2]=(r*m*o-v*c*o+v*i*l-n*m*l-r*i*p+n*c*p)*E,t[3]=(u*c*o-r*f*o-u*i*l+n*f*l+r*i*d-n*c*d)*E,t[4]=w*E,t[5]=(h*m*o-g*f*o+g*i*d-e*m*d-h*i*p+e*f*p)*E,t[6]=(g*c*o-a*m*o-g*i*l+e*m*l+a*i*p-e*c*p)*E,t[7]=(a*f*o-h*c*o+h*i*l-e*f*l-a*i*d+e*c*d)*E,t[8]=b*E,t[9]=(g*u*o-h*v*o-g*n*d+e*v*d+h*n*p-e*u*p)*E,t[10]=(a*v*o-g*r*o+g*n*l-e*v*l-a*n*p+e*r*p)*E,t[11]=(h*r*o-a*u*o-h*n*l+e*u*l+a*n*d-e*r*d)*E,t[12]=y*E,t[13]=(h*v*i-g*u*i+g*n*f-e*v*f-h*n*m+e*u*m)*E,t[14]=(g*r*i-a*v*i-g*n*c+e*v*c+a*n*m-e*r*m)*E,t[15]=(a*u*i-h*r*i+h*n*c-e*u*c-a*n*f+e*r*f)*E,this}scale(t){const e=this.elements,n=t.x,i=t.y,o=t.z;return e[0]*=n,e[4]*=i,e[8]*=o,e[1]*=n,e[5]*=i,e[9]*=o,e[2]*=n,e[6]*=i,e[10]*=o,e[3]*=n,e[7]*=i,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),o=1-n,a=t.x,r=t.y,c=t.z,l=o*a,h=o*r;return this.set(l*a+n,l*r-i*c,l*c+i*r,0,l*r+i*c,h*r+n,h*c-i*a,0,l*c-i*r,h*c+i*a,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,o,a){return this.set(1,n,o,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,o=e._x,a=e._y,r=e._z,c=e._w,l=o+o,h=a+a,u=r+r,f=o*l,d=o*h,g=o*u,v=a*h,m=a*u,p=r*u,x=c*l,w=c*h,b=c*u,y=n.x,S=n.y,E=n.z;return i[0]=(1-(v+p))*y,i[1]=(d+b)*y,i[2]=(g-w)*y,i[3]=0,i[4]=(d-b)*S,i[5]=(1-(f+p))*S,i[6]=(m+x)*S,i[7]=0,i[8]=(g+w)*E,i[9]=(m-x)*E,i[10]=(1-(f+v))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let o=xs.set(i[0],i[1],i[2]).length();const a=xs.set(i[4],i[5],i[6]).length(),r=xs.set(i[8],i[9],i[10]).length();this.determinant()<0&&(o=-o),t.x=i[12],t.y=i[13],t.z=i[14],zn.copy(this);const l=1/o,h=1/a,u=1/r;return zn.elements[0]*=l,zn.elements[1]*=l,zn.elements[2]*=l,zn.elements[4]*=h,zn.elements[5]*=h,zn.elements[6]*=h,zn.elements[8]*=u,zn.elements[9]*=u,zn.elements[10]*=u,e.setFromRotationMatrix(zn),n.x=o,n.y=a,n.z=r,this}makePerspective(t,e,n,i,o,a,r=vi){const c=this.elements,l=2*o/(e-t),h=2*o/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let d,g;if(r===vi)d=-(a+o)/(a-o),g=-2*a*o/(a-o);else if(r===tr)d=-a/(a-o),g=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,o,a,r=vi){const c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(a-o),f=(e+t)*l,d=(n+i)*h;let g,v;if(r===vi)g=(a+o)*u,v=-2*u;else if(r===tr)g=o*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const xs=new W,zn=new ie,z0=new W(0,0,0),I0=new W(1,1,1),Ci=new W,na=new W,vn=new W,rh=new ie,ch=new _i;class xr{constructor(t=0,e=0,n=0,i=xr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,o=i[0],a=i[4],r=i[8],c=i[1],l=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(rn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-rn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(rn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-rn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(rn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,d));break;case"XZY":this._z=Math.asin(-rn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return rh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(rh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ch.setFromEuler(this),this.setFromQuaternion(ch,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xr.DEFAULT_ORDER="XYZ";class el{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let U0=0;const lh=new W,ws=new _i,ri=new ie,ia=new W,ho=new W,F0=new W,N0=new _i,hh=new W(1,0,0),uh=new W(0,1,0),fh=new W(0,0,1),O0={type:"added"},B0={type:"removed"};class mn extends to{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:U0++}),this.uuid=eo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=mn.DEFAULT_UP.clone();const t=new W,e=new xr,n=new _i,i=new W(1,1,1);function o(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ie},normalMatrix:{value:new Qt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=mn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=mn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new el,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ws.setFromAxisAngle(t,e),this.quaternion.multiply(ws),this}rotateOnWorldAxis(t,e){return ws.setFromAxisAngle(t,e),this.quaternion.premultiply(ws),this}rotateX(t){return this.rotateOnAxis(hh,t)}rotateY(t){return this.rotateOnAxis(uh,t)}rotateZ(t){return this.rotateOnAxis(fh,t)}translateOnAxis(t,e){return lh.copy(t).applyQuaternion(this.quaternion),this.position.add(lh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(hh,t)}translateY(t){return this.translateOnAxis(uh,t)}translateZ(t){return this.translateOnAxis(fh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ri.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ia.copy(t):ia.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ho.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ri.lookAt(ho,ia,this.up):ri.lookAt(ia,ho,this.up),this.quaternion.setFromRotationMatrix(ri),i&&(ri.extractRotation(i.matrixWorld),ws.setFromRotationMatrix(ri),this.quaternion.premultiply(ws.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(O0)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(B0)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ri.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ri.multiply(t.parent.matrixWorld)),t.applyMatrix4(ri),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let o=0,a=i.length;o<a;o++)i[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ho,t,F0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ho,N0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const o=e[n];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let o=0,a=i.length;o<a;o++){const r=i[o];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function o(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(o(t.materials,this.material[c]));i.material=r}else i.material=o(t.materials,this.material);if(this.children.length>0){i.children=[];for(let r=0;r<this.children.length;r++)i.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];i.animations.push(o(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),g=a(t.nodes);r.length>0&&(n.geometries=r),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}mn.DEFAULT_UP=new W(0,1,0);mn.DEFAULT_MATRIX_AUTO_UPDATE=!0;mn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const In=new W,ci=new W,Vr=new W,li=new W,ys=new W,Ms=new W,dh=new W,$r=new W,jr=new W,Xr=new W;let sa=!1;class Bn{constructor(t=new W,e=new W,n=new W){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),In.subVectors(t,e),i.cross(In);const o=i.lengthSq();return o>0?i.multiplyScalar(1/Math.sqrt(o)):i.set(0,0,0)}static getBarycoord(t,e,n,i,o){In.subVectors(i,e),ci.subVectors(n,e),Vr.subVectors(t,e);const a=In.dot(In),r=In.dot(ci),c=In.dot(Vr),l=ci.dot(ci),h=ci.dot(Vr),u=a*l-r*r;if(u===0)return o.set(0,0,0),null;const f=1/u,d=(l*c-r*h)*f,g=(a*h-r*c)*f;return o.set(1-d-g,g,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,li)===null?!1:li.x>=0&&li.y>=0&&li.x+li.y<=1}static getUV(t,e,n,i,o,a,r,c){return sa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),sa=!0),this.getInterpolation(t,e,n,i,o,a,r,c)}static getInterpolation(t,e,n,i,o,a,r,c){return this.getBarycoord(t,e,n,i,li)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,li.x),c.addScaledVector(a,li.y),c.addScaledVector(r,li.z),c)}static isFrontFacing(t,e,n,i){return In.subVectors(n,e),ci.subVectors(t,e),In.cross(ci).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return In.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),In.cross(ci).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Bn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,o){return sa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),sa=!0),Bn.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}getInterpolation(t,e,n,i,o){return Bn.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}containsPoint(t){return Bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,o=this.c;let a,r;ys.subVectors(i,n),Ms.subVectors(o,n),$r.subVectors(t,n);const c=ys.dot($r),l=Ms.dot($r);if(c<=0&&l<=0)return e.copy(n);jr.subVectors(t,i);const h=ys.dot(jr),u=Ms.dot(jr);if(h>=0&&u<=h)return e.copy(i);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(ys,a);Xr.subVectors(t,o);const d=ys.dot(Xr),g=Ms.dot(Xr);if(g>=0&&d<=g)return e.copy(o);const v=d*l-c*g;if(v<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(n).addScaledVector(Ms,r);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return dh.subVectors(o,i),r=(u-h)/(u-h+(d-g)),e.copy(i).addScaledVector(dh,r);const p=1/(m+v+f);return a=v*p,r=f*p,e.copy(n).addScaledVector(ys,a).addScaledVector(Ms,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Hf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ri={h:0,s:0,l:0},oa={h:0,s:0,l:0};function qr(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=$e){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=le.workingColorSpace){if(t=Qc(t,1),e=rn(e,0,1),n=rn(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,a=2*n-o;this.r=qr(a,o,t+1/3),this.g=qr(a,o,t),this.b=qr(a,o,t-1/3)}return le.toWorkingColorSpace(this,i),this}setStyle(t,e=$e){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=i[1],r=i[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=i[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=$e){const n=Hf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Xs(t.r),this.g=Xs(t.g),this.b=Xs(t.b),this}copyLinearToSRGB(t){return this.r=Ur(t.r),this.g=Ur(t.g),this.b=Ur(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=$e){return le.fromWorkingColorSpace(Ye.copy(this),t),Math.round(rn(Ye.r*255,0,255))*65536+Math.round(rn(Ye.g*255,0,255))*256+Math.round(rn(Ye.b*255,0,255))}getHexString(t=$e){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(Ye.copy(this),e);const n=Ye.r,i=Ye.g,o=Ye.b,a=Math.max(n,i,o),r=Math.min(n,i,o);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const u=a-r;switch(l=h<=.5?u/(a+r):u/(2-a-r),a){case n:c=(i-o)/u+(i<o?6:0);break;case i:c=(o-n)/u+2;break;case o:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(Ye.copy(this),e),t.r=Ye.r,t.g=Ye.g,t.b=Ye.b,t}getStyle(t=$e){le.fromWorkingColorSpace(Ye.copy(this),t);const e=Ye.r,n=Ye.g,i=Ye.b;return t!==$e?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ri),this.setHSL(Ri.h+t,Ri.s+e,Ri.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ri),t.getHSL(oa);const n=Ao(Ri.h,oa.h,e),i=Ao(Ri.s,oa.s,e),o=Ao(Ri.l,oa.l,e);return this.setHSL(n,i,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*i,this.g=o[1]*e+o[4]*n+o[7]*i,this.b=o[2]*e+o[5]*n+o[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ye=new Bt;Bt.NAMES=Hf;let W0=0;class Ho extends to{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:W0++}),this.uuid=eo(),this.name="",this.type="Material",this.blending=js,this.side=yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Cc,this.blendDst=Rc,this.blendEquation=ts,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=Ya,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ql,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ds,this.stencilZFail=ds,this.stencilZPass=ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==js&&(n.blending=this.blending),this.side!==yi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Cc&&(n.blendSrc=this.blendSrc),this.blendDst!==Rc&&(n.blendDst=this.blendDst),this.blendEquation!==ts&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ya&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ql&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ds&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ds&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ds&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(o){const a=[];for(const r in o){const c=o[r];delete c.metadata,a.push(c)}return a}if(e){const o=i(t.textures),a=i(t.images);o.length>0&&(n.textures=o),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let o=0;o!==i;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Vf extends Ho{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Tf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Re=new W,aa=new Ht;class pe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=th,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=gi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,o=this.itemSize;i<o;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)aa.fromBufferAttribute(this,e),aa.applyMatrix3(t),this.setXY(e,aa.x,aa.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix3(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix4(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyNormalMatrix(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.transformDirection(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ds(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=en(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ds(e,this.array)),e}setX(t,e){return this.normalized&&(e=en(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ds(e,this.array)),e}setY(t,e){return this.normalized&&(e=en(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ds(e,this.array)),e}setZ(t,e){return this.normalized&&(e=en(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ds(e,this.array)),e}setW(t,e){return this.normalized&&(e=en(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=en(e,this.array),n=en(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=en(e,this.array),n=en(n,this.array),i=en(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,o){return t*=this.itemSize,this.normalized&&(e=en(e,this.array),n=en(n,this.array),i=en(i,this.array),o=en(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==th&&(t.usage=this.usage),t}}class $f extends pe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class jf extends pe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ke extends pe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let G0=0;const Tn=new ie,Yr=new mn,_s=new W,xn=new Sn,uo=new Sn,He=new W;class Je extends to{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:G0++}),this.uuid=eo(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Of(t)?jf:$f)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Qt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Tn.makeRotationFromQuaternion(t),this.applyMatrix4(Tn),this}rotateX(t){return Tn.makeRotationX(t),this.applyMatrix4(Tn),this}rotateY(t){return Tn.makeRotationY(t),this.applyMatrix4(Tn),this}rotateZ(t){return Tn.makeRotationZ(t),this.applyMatrix4(Tn),this}translate(t,e,n){return Tn.makeTranslation(t,e,n),this.applyMatrix4(Tn),this}scale(t,e,n){return Tn.makeScale(t,e,n),this.applyMatrix4(Tn),this}lookAt(t){return Yr.lookAt(t),Yr.updateMatrix(),this.applyMatrix4(Yr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_s).negate(),this.translate(_s.x,_s.y,_s.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const o=t[n];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new ke(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const o=e[n];xn.setFromBufferAttribute(o),this.morphTargetsRelative?(He.addVectors(this.boundingBox.min,xn.min),this.boundingBox.expandByPoint(He),He.addVectors(this.boundingBox.max,xn.max),this.boundingBox.expandByPoint(He)):(this.boundingBox.expandByPoint(xn.min),this.boundingBox.expandByPoint(xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Oi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new W,1/0);return}if(t){const n=this.boundingSphere.center;if(xn.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];uo.setFromBufferAttribute(r),this.morphTargetsRelative?(He.addVectors(xn.min,uo.min),xn.expandByPoint(He),He.addVectors(xn.max,uo.max),xn.expandByPoint(He)):(xn.expandByPoint(uo.min),xn.expandByPoint(uo.max))}xn.getCenter(n);let i=0;for(let o=0,a=t.count;o<a;o++)He.fromBufferAttribute(t,o),i=Math.max(i,n.distanceToSquared(He));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)He.fromBufferAttribute(r,l),c&&(_s.fromBufferAttribute(t,l),He.add(_s)),i=Math.max(i,n.distanceToSquared(He))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,o=e.normal.array,a=e.uv.array,r=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pe(new Float32Array(4*r),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let _=0;_<r;_++)l[_]=new W,h[_]=new W;const u=new W,f=new W,d=new W,g=new Ht,v=new Ht,m=new Ht,p=new W,x=new W;function w(_,A,R){u.fromArray(i,_*3),f.fromArray(i,A*3),d.fromArray(i,R*3),g.fromArray(a,_*2),v.fromArray(a,A*2),m.fromArray(a,R*2),f.sub(u),d.sub(u),v.sub(g),m.sub(g);const D=1/(v.x*m.y-m.x*v.y);isFinite(D)&&(p.copy(f).multiplyScalar(m.y).addScaledVector(d,-v.y).multiplyScalar(D),x.copy(d).multiplyScalar(v.x).addScaledVector(f,-m.x).multiplyScalar(D),l[_].add(p),l[A].add(p),l[R].add(p),h[_].add(x),h[A].add(x),h[R].add(x))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let _=0,A=b.length;_<A;++_){const R=b[_],D=R.start,C=R.count;for(let z=D,I=D+C;z<I;z+=3)w(n[z+0],n[z+1],n[z+2])}const y=new W,S=new W,E=new W,T=new W;function M(_){E.fromArray(o,_*3),T.copy(E);const A=l[_];y.copy(A),y.sub(E.multiplyScalar(E.dot(A))).normalize(),S.crossVectors(T,A);const D=S.dot(h[_])<0?-1:1;c[_*4]=y.x,c[_*4+1]=y.y,c[_*4+2]=y.z,c[_*4+3]=D}for(let _=0,A=b.length;_<A;++_){const R=b[_],D=R.start,C=R.count;for(let z=D,I=D+C;z<I;z+=3)M(n[z+0]),M(n[z+1]),M(n[z+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new pe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new W,o=new W,a=new W,r=new W,c=new W,l=new W,h=new W,u=new W;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),v=t.getX(f+1),m=t.getX(f+2);i.fromBufferAttribute(e,g),o.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,o),u.subVectors(i,o),h.cross(u),r.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),r.add(h),c.add(h),l.add(h),n.setXYZ(g,r.x,r.y,r.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)i.fromBufferAttribute(e,f+0),o.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,o),u.subVectors(i,o),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)He.fromBufferAttribute(t,e),He.normalize(),t.setXYZ(e,He.x,He.y,He.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,f=new l.constructor(c.length*h);let d=0,g=0;for(let v=0,m=c.length;v<m;v++){r.isInterleavedBufferAttribute?d=c[v]*r.data.stride+r.offset:d=c[v]*h;for(let p=0;p<h;p++)f[g++]=l[d++]}return new pe(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Je,n=this.index.array,i=this.attributes;for(const r in i){const c=i[r],l=t(c,n);e.setAttribute(r,l)}const o=this.morphAttributes;for(const r in o){const c=[],l=o[r];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const i={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(i[c]=h,o=!0)}o&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ph=new ie,ji=new tl,ra=new Oi,mh=new W,bs=new W,Ss=new W,Es=new W,Kr=new W,ca=new W,la=new Ht,ha=new Ht,ua=new Ht,gh=new W,vh=new W,xh=new W,fa=new W,da=new W;class me extends mn{constructor(t=new Je,e=new Vf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=i.length;o<a;o++){const r=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,o=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const r=this.morphTargetInfluences;if(o&&r){ca.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=r[c],u=o[c];h!==0&&(Kr.fromBufferAttribute(u,t),a?ca.addScaledVector(Kr,h):ca.addScaledVector(Kr.sub(e),h))}e.add(ca)}return e}raycast(t,e){const n=this.geometry,i=this.material,o=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ra.copy(n.boundingSphere),ra.applyMatrix4(o),ji.copy(t.ray).recast(t.near),!(ra.containsPoint(ji.origin)===!1&&(ji.intersectSphere(ra,mh)===null||ji.origin.distanceToSquared(mh)>(t.far-t.near)**2))&&(ph.copy(o).invert(),ji.copy(t.ray).applyMatrix4(ph),!(n.boundingBox!==null&&ji.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ji)))}_computeIntersections(t,e,n){let i;const o=this.geometry,a=this.material,r=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,d=o.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],x=Math.max(m.start,d.start),w=Math.min(r.count,Math.min(m.start+m.count,d.start+d.count));for(let b=x,y=w;b<y;b+=3){const S=r.getX(b),E=r.getX(b+1),T=r.getX(b+2);i=pa(this,p,t,n,l,h,u,S,E,T),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(r.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const x=r.getX(m),w=r.getX(m+1),b=r.getX(m+2);i=pa(this,a,t,n,l,h,u,x,w,b),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],x=Math.max(m.start,d.start),w=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let b=x,y=w;b<y;b+=3){const S=b,E=b+1,T=b+2;i=pa(this,p,t,n,l,h,u,S,E,T),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(c.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const x=m,w=m+1,b=m+2;i=pa(this,a,t,n,l,h,u,x,w,b),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function H0(s,t,e,n,i,o,a,r){let c;if(t.side===hn?c=n.intersectTriangle(a,o,i,!0,r):c=n.intersectTriangle(i,o,a,t.side===yi,r),c===null)return null;da.copy(r),da.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(da);return l<e.near||l>e.far?null:{distance:l,point:da.clone(),object:s}}function pa(s,t,e,n,i,o,a,r,c,l){s.getVertexPosition(r,bs),s.getVertexPosition(c,Ss),s.getVertexPosition(l,Es);const h=H0(s,t,e,n,bs,Ss,Es,fa);if(h){i&&(la.fromBufferAttribute(i,r),ha.fromBufferAttribute(i,c),ua.fromBufferAttribute(i,l),h.uv=Bn.getInterpolation(fa,bs,Ss,Es,la,ha,ua,new Ht)),o&&(la.fromBufferAttribute(o,r),ha.fromBufferAttribute(o,c),ua.fromBufferAttribute(o,l),h.uv1=Bn.getInterpolation(fa,bs,Ss,Es,la,ha,ua,new Ht),h.uv2=h.uv1),a&&(gh.fromBufferAttribute(a,r),vh.fromBufferAttribute(a,c),xh.fromBufferAttribute(a,l),h.normal=Bn.getInterpolation(fa,bs,Ss,Es,gh,vh,xh,new W),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:c,c:l,normal:new W,materialIndex:0};Bn.getNormal(bs,Ss,Es,u.normal),h.face=u}return h}class Vo extends Je{constructor(t=1,e=1,n=1,i=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:o,depthSegments:a};const r=this;i=Math.floor(i),o=Math.floor(o),a=Math.floor(a);const c=[],l=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,a,o,0),g("z","y","x",1,-1,n,e,-t,a,o,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,o,4),g("x","y","z",-1,-1,t,e,-n,i,o,5),this.setIndex(c),this.setAttribute("position",new ke(l,3)),this.setAttribute("normal",new ke(h,3)),this.setAttribute("uv",new ke(u,2));function g(v,m,p,x,w,b,y,S,E,T,M){const _=b/E,A=y/T,R=b/2,D=y/2,C=S/2,z=E+1,I=T+1;let O=0,N=0;const j=new W;for(let H=0;H<I;H++){const J=H*A-D;for(let ot=0;ot<z;ot++){const Y=ot*_-R;j[v]=Y*x,j[m]=J*w,j[p]=C,l.push(j.x,j.y,j.z),j[v]=0,j[m]=0,j[p]=S>0?1:-1,h.push(j.x,j.y,j.z),u.push(ot/E),u.push(1-H/T),O+=1}}for(let H=0;H<T;H++)for(let J=0;J<E;J++){const ot=f+J+z*H,Y=f+J+z*(H+1),nt=f+(J+1)+z*(H+1),ct=f+(J+1)+z*H;c.push(ot,Y,ct),c.push(Y,nt,ct),N+=6}r.addGroup(d,N,M),d+=N,f+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vo(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Js(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function nn(s){const t={};for(let e=0;e<s.length;e++){const n=Js(s[e]);for(const i in n)t[i]=n[i]}return t}function V0(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Xf(s){return s.getRenderTarget()===null?s.outputColorSpace:le.workingColorSpace}const $0={clone:Js,merge:nn};var j0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,X0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ee extends Ho{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=j0,this.fragmentShader=X0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Js(t.uniforms),this.uniformsGroups=V0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class qf extends mn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=vi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class _n extends qf{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Uo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Eo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Uo*2*Math.atan(Math.tan(Eo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Eo*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,o=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;o+=a.offsetX*i/c,e-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const As=-90,Ts=1;class q0 extends mn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new _n(As,Ts,t,e);i.layers=this.layers,this.add(i);const o=new _n(As,Ts,t,e);o.layers=this.layers,this.add(o);const a=new _n(As,Ts,t,e);a.layers=this.layers,this.add(a);const r=new _n(As,Ts,t,e);r.layers=this.layers,this.add(r);const c=new _n(As,Ts,t,e);c.layers=this.layers,this.add(c);const l=new _n(As,Ts,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,o,a,r,c]=e;for(const l of e)this.remove(l);if(t===vi)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===tr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,o),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,r),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Yf extends pn{constructor(t,e,n,i,o,a,r,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Ys,super(t,e,n,i,o,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Y0 extends ti{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(To("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===cs?$e:Pn),this.texture=new Yf(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:je}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Vo(5,5,5),o=new Ee({name:"CubemapFromEquirect",uniforms:Js(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:hn,blending:wi});o.uniforms.tEquirect.value=e;const a=new me(i,o),r=e.minFilter;return e.minFilter===ls&&(e.minFilter=je),new q0(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(o)}}const Zr=new W,K0=new W,Z0=new Qt;class Ki{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Zr.subVectors(n,e).cross(K0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Zr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/i;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Z0.getNormalMatrix(t),i=this.coplanarPoint(Zr).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Xi=new Oi,ma=new W;class Bi{constructor(t=new Ki,e=new Ki,n=new Ki,i=new Ki,o=new Ki,a=new Ki){this.planes=[t,e,n,i,o,a]}set(t,e,n,i,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(n),r[3].copy(i),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=vi){const n=this.planes,i=t.elements,o=i[0],a=i[1],r=i[2],c=i[3],l=i[4],h=i[5],u=i[6],f=i[7],d=i[8],g=i[9],v=i[10],m=i[11],p=i[12],x=i[13],w=i[14],b=i[15];if(n[0].setComponents(c-o,f-l,m-d,b-p).normalize(),n[1].setComponents(c+o,f+l,m+d,b+p).normalize(),n[2].setComponents(c+a,f+h,m+g,b+x).normalize(),n[3].setComponents(c-a,f-h,m-g,b-x).normalize(),n[4].setComponents(c-r,f-u,m-v,b-w).normalize(),e===vi)n[5].setComponents(c+r,f+u,m+v,b+w).normalize();else if(e===tr)n[5].setComponents(r,u,v,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Xi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Xi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Xi)}intersectsSprite(t){return Xi.center.set(0,0,0),Xi.radius=.7071067811865476,Xi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Xi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(ma.x=i.normal.x>0?t.max.x:t.min.x,ma.y=i.normal.y>0?t.max.y:t.min.y,ma.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(ma)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Kf(){let s=null,t=!1,e=null,n=null;function i(o,a){e(o,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){s=o}}}function J0(s,t){const e=t.isWebGL2,n=new WeakMap;function i(l,h){const u=l.array,f=l.usage,d=u.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,u,f),l.onUploadCallback();let v;if(u instanceof Float32Array)v=s.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)v=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=s.SHORT;else if(u instanceof Uint32Array)v=s.UNSIGNED_INT;else if(u instanceof Int32Array)v=s.INT;else if(u instanceof Int8Array)v=s.BYTE;else if(u instanceof Uint8Array)v=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:d}}function o(l,h,u){const f=h.array,d=h._updateRange,g=h.updateRanges;if(s.bindBuffer(u,l),d.count===-1&&g.length===0&&s.bufferSubData(u,0,f),g.length!==0){for(let v=0,m=g.length;v<m;v++){const p=g[v];e?s.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f,p.start,p.count):s.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}d.count!==-1&&(e?s.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):s.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(s.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,i(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(u.buffer,l,h),u.version=l.version}}return{get:a,remove:r,update:c}}class nl extends Je{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const o=t/2,a=e/2,r=Math.floor(n),c=Math.floor(i),l=r+1,h=c+1,u=t/r,f=e/c,d=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*f-a;for(let w=0;w<l;w++){const b=w*u-o;g.push(b,-x,0),v.push(0,0,1),m.push(w/r),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<r;x++){const w=x+l*p,b=x+l*(p+1),y=x+1+l*(p+1),S=x+1+l*p;d.push(w,b,S),d.push(b,y,S)}this.setIndex(d),this.setAttribute("position",new ke(g,3)),this.setAttribute("normal",new ke(v,3)),this.setAttribute("uv",new ke(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nl(t.width,t.height,t.widthSegments,t.heightSegments)}}var Q0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,tm=`#ifdef USE_ALPHAHASH
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
#endif`,em=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,nm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,im=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,sm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,om=`#ifdef USE_AOMAP
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
#endif`,am=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rm=`#ifdef USE_BATCHING
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
#endif`,cm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,lm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,um=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,fm=`#ifdef USE_IRIDESCENCE
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
#endif`,dm=`#ifdef USE_BUMPMAP
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
#endif`,pm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,wm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ym=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Mm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,_m=`#define PI 3.141592653589793
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
} // validated`,bm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Sm=`vec3 transformedNormal = objectNormal;
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
#endif`,Em=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Am=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Cm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Rm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Lm=`
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
}`,Pm=`#ifdef USE_ENVMAP
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
#endif`,Dm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,km=`#ifdef USE_ENVMAP
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
#endif`,zm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Im=`#ifdef USE_ENVMAP
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
#endif`,Um=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Fm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Nm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Om=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Bm=`#ifdef USE_GRADIENTMAP
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
}`,Wm=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Gm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Hm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Vm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$m=`uniform bool receiveShadow;
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
#endif`,jm=`#ifdef USE_ENVMAP
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
#endif`,Xm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,qm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ym=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Km=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Zm=`PhysicalMaterial material;
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
#endif`,Jm=`struct PhysicalMaterial {
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
}`,Qm=`
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
#endif`,tg=`#if defined( RE_IndirectDiffuse )
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
#endif`,eg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ng=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ig=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sg=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,og=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,ag=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,rg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,lg=`#if defined( USE_POINTS_UV )
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
#endif`,hg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ug=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,fg=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dg=`#ifdef USE_MORPHNORMALS
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
#endif`,pg=`#ifdef USE_MORPHTARGETS
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
#endif`,mg=`#ifdef USE_MORPHTARGETS
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
#endif`,gg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,vg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,xg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Mg=`#ifdef USE_NORMALMAP
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
#endif`,_g=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Sg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Eg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ag=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Tg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Cg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Rg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,zg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ig=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ug=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Fg=`float getShadowMask() {
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
}`,Ng=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Og=`#ifdef USE_SKINNING
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
#endif`,Bg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wg=`#ifdef USE_SKINNING
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
#endif`,Gg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Hg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Vg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$g=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,jg=`#ifdef USE_TRANSMISSION
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
#endif`,Xg=`#ifdef USE_TRANSMISSION
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
#endif`,qg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Kg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Jg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Qg=`uniform sampler2D t2D;
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
}`,t1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,e1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,n1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s1=`#include <common>
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
}`,o1=`#if DEPTH_PACKING == 3200
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
}`,a1=`#define DISTANCE
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
}`,r1=`#define DISTANCE
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
}`,c1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,l1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,h1=`uniform float scale;
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
}`,u1=`uniform vec3 diffuse;
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
}`,f1=`#include <common>
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
}`,d1=`uniform vec3 diffuse;
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
}`,p1=`#define LAMBERT
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
}`,m1=`#define LAMBERT
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
}`,g1=`#define MATCAP
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
}`,v1=`#define MATCAP
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
}`,x1=`#define NORMAL
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
}`,w1=`#define NORMAL
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
}`,y1=`#define PHONG
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
}`,M1=`#define PHONG
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
}`,_1=`#define STANDARD
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
}`,b1=`#define STANDARD
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
}`,S1=`#define TOON
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
}`,E1=`#define TOON
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
}`,A1=`uniform float size;
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
}`,T1=`uniform vec3 diffuse;
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
}`,C1=`#include <common>
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
}`,R1=`uniform vec3 color;
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
}`,L1=`uniform float rotation;
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
}`,P1=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:Q0,alphahash_pars_fragment:tm,alphamap_fragment:em,alphamap_pars_fragment:nm,alphatest_fragment:im,alphatest_pars_fragment:sm,aomap_fragment:om,aomap_pars_fragment:am,batching_pars_vertex:rm,batching_vertex:cm,begin_vertex:lm,beginnormal_vertex:hm,bsdfs:um,iridescence_fragment:fm,bumpmap_pars_fragment:dm,clipping_planes_fragment:pm,clipping_planes_pars_fragment:mm,clipping_planes_pars_vertex:gm,clipping_planes_vertex:vm,color_fragment:xm,color_pars_fragment:wm,color_pars_vertex:ym,color_vertex:Mm,common:_m,cube_uv_reflection_fragment:bm,defaultnormal_vertex:Sm,displacementmap_pars_vertex:Em,displacementmap_vertex:Am,emissivemap_fragment:Tm,emissivemap_pars_fragment:Cm,colorspace_fragment:Rm,colorspace_pars_fragment:Lm,envmap_fragment:Pm,envmap_common_pars_fragment:Dm,envmap_pars_fragment:km,envmap_pars_vertex:zm,envmap_physical_pars_fragment:jm,envmap_vertex:Im,fog_vertex:Um,fog_pars_vertex:Fm,fog_fragment:Nm,fog_pars_fragment:Om,gradientmap_pars_fragment:Bm,lightmap_fragment:Wm,lightmap_pars_fragment:Gm,lights_lambert_fragment:Hm,lights_lambert_pars_fragment:Vm,lights_pars_begin:$m,lights_toon_fragment:Xm,lights_toon_pars_fragment:qm,lights_phong_fragment:Ym,lights_phong_pars_fragment:Km,lights_physical_fragment:Zm,lights_physical_pars_fragment:Jm,lights_fragment_begin:Qm,lights_fragment_maps:tg,lights_fragment_end:eg,logdepthbuf_fragment:ng,logdepthbuf_pars_fragment:ig,logdepthbuf_pars_vertex:sg,logdepthbuf_vertex:og,map_fragment:ag,map_pars_fragment:rg,map_particle_fragment:cg,map_particle_pars_fragment:lg,metalnessmap_fragment:hg,metalnessmap_pars_fragment:ug,morphcolor_vertex:fg,morphnormal_vertex:dg,morphtarget_pars_vertex:pg,morphtarget_vertex:mg,normal_fragment_begin:gg,normal_fragment_maps:vg,normal_pars_fragment:xg,normal_pars_vertex:wg,normal_vertex:yg,normalmap_pars_fragment:Mg,clearcoat_normal_fragment_begin:_g,clearcoat_normal_fragment_maps:bg,clearcoat_pars_fragment:Sg,iridescence_pars_fragment:Eg,opaque_fragment:Ag,packing:Tg,premultiplied_alpha_fragment:Cg,project_vertex:Rg,dithering_fragment:Lg,dithering_pars_fragment:Pg,roughnessmap_fragment:Dg,roughnessmap_pars_fragment:kg,shadowmap_pars_fragment:zg,shadowmap_pars_vertex:Ig,shadowmap_vertex:Ug,shadowmask_pars_fragment:Fg,skinbase_vertex:Ng,skinning_pars_vertex:Og,skinning_vertex:Bg,skinnormal_vertex:Wg,specularmap_fragment:Gg,specularmap_pars_fragment:Hg,tonemapping_fragment:Vg,tonemapping_pars_fragment:$g,transmission_fragment:jg,transmission_pars_fragment:Xg,uv_pars_fragment:qg,uv_pars_vertex:Yg,uv_vertex:Kg,worldpos_vertex:Zg,background_vert:Jg,background_frag:Qg,backgroundCube_vert:t1,backgroundCube_frag:e1,cube_vert:n1,cube_frag:i1,depth_vert:s1,depth_frag:o1,distanceRGBA_vert:a1,distanceRGBA_frag:r1,equirect_vert:c1,equirect_frag:l1,linedashed_vert:h1,linedashed_frag:u1,meshbasic_vert:f1,meshbasic_frag:d1,meshlambert_vert:p1,meshlambert_frag:m1,meshmatcap_vert:g1,meshmatcap_frag:v1,meshnormal_vert:x1,meshnormal_frag:w1,meshphong_vert:y1,meshphong_frag:M1,meshphysical_vert:_1,meshphysical_frag:b1,meshtoon_vert:S1,meshtoon_frag:E1,points_vert:A1,points_frag:T1,shadow_vert:C1,shadow_frag:R1,sprite_vert:L1,sprite_frag:P1},wt={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qt},normalScale:{value:new Ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0},uvTransform:{value:new Qt}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new Ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}}},Xn={basic:{uniforms:nn([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:nn([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:nn([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:nn([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:nn([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:nn([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:nn([wt.points,wt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:nn([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:nn([wt.common,wt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:nn([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:nn([wt.sprite,wt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:nn([wt.common,wt.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:nn([wt.lights,wt.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};Xn.physical={uniforms:nn([Xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qt},clearcoatNormalScale:{value:new Ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qt},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qt},transmissionSamplerSize:{value:new Ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qt},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qt},anisotropyVector:{value:new Ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const ga={r:0,b:0,g:0};function D1(s,t,e,n,i,o,a){const r=new Bt(0);let c=o===!0?0:1,l,h,u=null,f=0,d=null;function g(m,p){let x=!1,w=p.isScene===!0?p.background:null;w&&w.isTexture&&(w=(p.backgroundBlurriness>0?e:t).get(w)),w===null?v(r,c):w&&w.isColor&&(v(w,1),x=!0);const b=s.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||x)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),w&&(w.isCubeTexture||w.mapping===gr)?(h===void 0&&(h=new me(new Vo(1,1,1),new Ee({name:"BackgroundCubeMaterial",uniforms:Js(Xn.backgroundCube.uniforms),vertexShader:Xn.backgroundCube.vertexShader,fragmentShader:Xn.backgroundCube.fragmentShader,side:hn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(y,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=le.getTransfer(w.colorSpace)!==de,(u!==w||f!==w.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,d=s.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new me(new nl(2,2),new Ee({name:"BackgroundMaterial",uniforms:Js(Xn.background.uniforms),vertexShader:Xn.background.vertexShader,fragmentShader:Xn.background.fragmentShader,side:yi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=le.getTransfer(w.colorSpace)!==de,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,u=w,f=w.version,d=s.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function v(m,p){m.getRGB(ga,Xf(s)),n.buffers.color.setClear(ga.r,ga.g,ga.b,p,a)}return{getClearColor:function(){return r},setClearColor:function(m,p=1){r.set(m),c=p,v(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,v(r,c)},render:g}}function k1(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),o=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||o!==null,r={},c=m(null);let l=c,h=!1;function u(C,z,I,O,N){let j=!1;if(a){const H=v(O,I,z);l!==H&&(l=H,d(l.object)),j=p(C,O,I,N),j&&x(C,O,I,N)}else{const H=z.wireframe===!0;(l.geometry!==O.id||l.program!==I.id||l.wireframe!==H)&&(l.geometry=O.id,l.program=I.id,l.wireframe=H,j=!0)}N!==null&&e.update(N,s.ELEMENT_ARRAY_BUFFER),(j||h)&&(h=!1,T(C,z,I,O),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function f(){return n.isWebGL2?s.createVertexArray():o.createVertexArrayOES()}function d(C){return n.isWebGL2?s.bindVertexArray(C):o.bindVertexArrayOES(C)}function g(C){return n.isWebGL2?s.deleteVertexArray(C):o.deleteVertexArrayOES(C)}function v(C,z,I){const O=I.wireframe===!0;let N=r[C.id];N===void 0&&(N={},r[C.id]=N);let j=N[z.id];j===void 0&&(j={},N[z.id]=j);let H=j[O];return H===void 0&&(H=m(f()),j[O]=H),H}function m(C){const z=[],I=[],O=[];for(let N=0;N<i;N++)z[N]=0,I[N]=0,O[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:I,attributeDivisors:O,object:C,attributes:{},index:null}}function p(C,z,I,O){const N=l.attributes,j=z.attributes;let H=0;const J=I.getAttributes();for(const ot in J)if(J[ot].location>=0){const nt=N[ot];let ct=j[ot];if(ct===void 0&&(ot==="instanceMatrix"&&C.instanceMatrix&&(ct=C.instanceMatrix),ot==="instanceColor"&&C.instanceColor&&(ct=C.instanceColor)),nt===void 0||nt.attribute!==ct||ct&&nt.data!==ct.data)return!0;H++}return l.attributesNum!==H||l.index!==O}function x(C,z,I,O){const N={},j=z.attributes;let H=0;const J=I.getAttributes();for(const ot in J)if(J[ot].location>=0){let nt=j[ot];nt===void 0&&(ot==="instanceMatrix"&&C.instanceMatrix&&(nt=C.instanceMatrix),ot==="instanceColor"&&C.instanceColor&&(nt=C.instanceColor));const ct={};ct.attribute=nt,nt&&nt.data&&(ct.data=nt.data),N[ot]=ct,H++}l.attributes=N,l.attributesNum=H,l.index=O}function w(){const C=l.newAttributes;for(let z=0,I=C.length;z<I;z++)C[z]=0}function b(C){y(C,0)}function y(C,z){const I=l.newAttributes,O=l.enabledAttributes,N=l.attributeDivisors;I[C]=1,O[C]===0&&(s.enableVertexAttribArray(C),O[C]=1),N[C]!==z&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](C,z),N[C]=z)}function S(){const C=l.newAttributes,z=l.enabledAttributes;for(let I=0,O=z.length;I<O;I++)z[I]!==C[I]&&(s.disableVertexAttribArray(I),z[I]=0)}function E(C,z,I,O,N,j,H){H===!0?s.vertexAttribIPointer(C,z,I,N,j):s.vertexAttribPointer(C,z,I,O,N,j)}function T(C,z,I,O){if(n.isWebGL2===!1&&(C.isInstancedMesh||O.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;w();const N=O.attributes,j=I.getAttributes(),H=z.defaultAttributeValues;for(const J in j){const ot=j[J];if(ot.location>=0){let Y=N[J];if(Y===void 0&&(J==="instanceMatrix"&&C.instanceMatrix&&(Y=C.instanceMatrix),J==="instanceColor"&&C.instanceColor&&(Y=C.instanceColor)),Y!==void 0){const nt=Y.normalized,ct=Y.itemSize,mt=e.get(Y);if(mt===void 0)continue;const St=mt.buffer,Tt=mt.type,Rt=mt.bytesPerElement,yt=n.isWebGL2===!0&&(Tt===s.INT||Tt===s.UNSIGNED_INT||Y.gpuType===Rf);if(Y.isInterleavedBufferAttribute){const It=Y.data,X=It.stride,fe=Y.offset;if(It.isInstancedInterleavedBuffer){for(let Lt=0;Lt<ot.locationSize;Lt++)y(ot.location+Lt,It.meshPerAttribute);C.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=It.meshPerAttribute*It.count)}else for(let Lt=0;Lt<ot.locationSize;Lt++)b(ot.location+Lt);s.bindBuffer(s.ARRAY_BUFFER,St);for(let Lt=0;Lt<ot.locationSize;Lt++)E(ot.location+Lt,ct/ot.locationSize,Tt,nt,X*Rt,(fe+ct/ot.locationSize*Lt)*Rt,yt)}else{if(Y.isInstancedBufferAttribute){for(let It=0;It<ot.locationSize;It++)y(ot.location+It,Y.meshPerAttribute);C.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let It=0;It<ot.locationSize;It++)b(ot.location+It);s.bindBuffer(s.ARRAY_BUFFER,St);for(let It=0;It<ot.locationSize;It++)E(ot.location+It,ct/ot.locationSize,Tt,nt,ct*Rt,ct/ot.locationSize*It*Rt,yt)}}else if(H!==void 0){const nt=H[J];if(nt!==void 0)switch(nt.length){case 2:s.vertexAttrib2fv(ot.location,nt);break;case 3:s.vertexAttrib3fv(ot.location,nt);break;case 4:s.vertexAttrib4fv(ot.location,nt);break;default:s.vertexAttrib1fv(ot.location,nt)}}}}S()}function M(){R();for(const C in r){const z=r[C];for(const I in z){const O=z[I];for(const N in O)g(O[N].object),delete O[N];delete z[I]}delete r[C]}}function _(C){if(r[C.id]===void 0)return;const z=r[C.id];for(const I in z){const O=z[I];for(const N in O)g(O[N].object),delete O[N];delete z[I]}delete r[C.id]}function A(C){for(const z in r){const I=r[z];if(I[C.id]===void 0)continue;const O=I[C.id];for(const N in O)g(O[N].object),delete O[N];delete I[C.id]}}function R(){D(),h=!0,l!==c&&(l=c,d(l.object))}function D(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:R,resetDefaultState:D,dispose:M,releaseStatesOfGeometry:_,releaseStatesOfProgram:A,initAttributes:w,enableAttribute:b,disableUnusedAttributes:S}}function z1(s,t,e,n){const i=n.isWebGL2;let o;function a(h){o=h}function r(h,u){s.drawArrays(o,h,u),e.update(u,o,1)}function c(h,u,f){if(f===0)return;let d,g;if(i)d=s,g="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[g](o,h,u,f),e.update(u,o,f)}function l(h,u,f){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{d.multiDrawArraysWEBGL(o,h,0,u,0,f);let g=0;for(let v=0;v<f;v++)g+=u[v];e.update(g,o,1)}}this.setMode=a,this.render=r,this.renderInstances=c,this.renderMultiDraw=l}function I1(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function o(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let r=e.precision!==void 0?e.precision:"highp";const c=o(r);c!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",c,"instead."),r=c);const l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),v=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),w=f>0,b=a||t.has("OES_texture_float"),y=w&&b,S=a?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:o,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:x,vertexTextures:w,floatFragmentTextures:b,floatVertexTextures:y,maxSamples:S}}function U1(s){const t=this;let e=null,n=0,i=!1,o=!1;const a=new Ki,r=new Qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||o&&!m)o?h(null):l();else{const x=o?0:n,w=x*4;let b=p.clippingState||null;c.value=b,b=h(g,f,w,d);for(let y=0;y!==w;++y)b[y]=e[y];p.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=d+v*4,x=f.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let w=0,b=d;w!==v;++w,b+=4)a.copy(u[w]).applyMatrix4(x,r),a.normal.toArray(m,b),m[b+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function F1(s){let t=new WeakMap;function e(a,r){return r===Lc?a.mapping=Ys:r===Pc&&(a.mapping=Ks),a}function n(a){if(a&&a.isTexture){const r=a.mapping;if(r===Lc||r===Pc)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Y0(c.height/2);return l.fromEquirectangularTexture(s,a),t.set(a,l),a.addEventListener("dispose",i),e(l.texture,a.mapping)}else return null}}return a}function i(a){const r=a.target;r.removeEventListener("dispose",i);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class wr extends qf{constructor(t=-1,e=1,n=1,i=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let o=n-t,a=n+t,r=i+e,c=i-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,a=o+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Fs=4,wh=[.125,.215,.35,.446,.526,.582],es=20,Jr=new wr,yh=new Bt;let Qr=null,tc=0,ec=0;const Zi=(1+Math.sqrt(5))/2,Cs=1/Zi,Mh=[new W(1,1,1),new W(-1,1,1),new W(1,1,-1),new W(-1,1,-1),new W(0,Zi,Cs),new W(0,Zi,-Cs),new W(Cs,0,Zi),new W(-Cs,0,Zi),new W(Zi,Cs,0),new W(-Zi,Cs,0)];class _h{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Qr=this._renderer.getRenderTarget(),tc=this._renderer.getActiveCubeFace(),ec=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,i,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Eh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Qr,tc,ec),t.scissorTest=!1,va(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ys||t.mapping===Ks?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Qr=this._renderer.getRenderTarget(),tc=this._renderer.getActiveCubeFace(),ec=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:je,minFilter:je,generateMipmaps:!1,type:Ui,format:De,colorSpace:Mi,depthBuffer:!1},i=bh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bh(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=N1(o)),this._blurMaterial=O1(o,t,e)}return i}_compileMaterial(t){const e=new me(this._lodPlanes[0],t);this._renderer.compile(e,Jr)}_sceneToCubeUV(t,e,n,i){const r=new _n(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(yh),h.toneMapping=Ii,h.autoClear=!1;const d=new Vf({name:"PMREM.Background",side:hn,depthWrite:!1,depthTest:!1}),g=new me(new Vo,d);let v=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,v=!0):(d.color.copy(yh),v=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):x===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const w=this._cubeSize;va(i,x*w,p>2?w:0,w,w),h.setRenderTarget(i),v&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Ys||t.mapping===Ks;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Eh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sh());const o=i?this._cubemapMaterial:this._equirectMaterial,a=new me(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const c=this._cubeSize;va(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Jr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const o=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=Mh[(i-1)%Mh.length];this._blur(t,i-1,i,o,a)}e.autoClear=n}_blur(t,e,n,i,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",o),this._halfBlur(a,t,n,n,i,"longitudinal",o)}_halfBlur(t,e,n,i,o,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new me(this._lodPlanes[i],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*es-1),v=o/g,m=isFinite(o)?1+Math.floor(h*v):es;m>es&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${es}`);const p=[];let x=0;for(let E=0;E<es;++E){const T=E/v,M=Math.exp(-T*T/2);p.push(M),E===0?x+=M:E<m&&(x+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/x;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=a==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:w}=this;f.dTheta.value=g,f.mipInt.value=w-n;const b=this._sizeLods[i],y=3*b*(i>w-Fs?i-w+Fs:0),S=4*(this._cubeSize-b);va(e,y,S,3*b,2*b),c.setRenderTarget(e),c.render(u,Jr)}}function N1(s){const t=[],e=[],n=[];let i=s;const o=s-Fs+1+wh.length;for(let a=0;a<o;a++){const r=Math.pow(2,i);e.push(r);let c=1/r;a>s-Fs?c=wh[a-s+Fs-1]:a===0&&(c=0),n.push(c);const l=1/(r-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,v=3,m=2,p=1,x=new Float32Array(v*g*d),w=new Float32Array(m*g*d),b=new Float32Array(p*g*d);for(let S=0;S<d;S++){const E=S%3*2/3-1,T=S>2?0:-1,M=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];x.set(M,v*g*S),w.set(f,m*g*S);const _=[S,S,S,S,S,S];b.set(_,p*g*S)}const y=new Je;y.setAttribute("position",new pe(x,v)),y.setAttribute("uv",new pe(w,m)),y.setAttribute("faceIndex",new pe(b,p)),t.push(y),i>Fs&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function bh(s,t,e){const n=new ti(s,t,e);return n.texture.mapping=gr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function va(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function O1(s,t,e){const n=new Float32Array(es),i=new W(0,1,0);return new Ee({name:"SphericalGaussianBlur",defines:{n:es,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:il(),fragmentShader:`

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
		`,blending:wi,depthTest:!1,depthWrite:!1})}function Sh(){return new Ee({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:il(),fragmentShader:`

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
		`,blending:wi,depthTest:!1,depthWrite:!1})}function Eh(){return new Ee({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wi,depthTest:!1,depthWrite:!1})}function il(){return`

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
	`}function B1(s){let t=new WeakMap,e=null;function n(r){if(r&&r.isTexture){const c=r.mapping,l=c===Lc||c===Pc,h=c===Ys||c===Ks;if(l||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=t.get(r);return e===null&&(e=new _h(s)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),t.set(r,u),u.texture}else{if(t.has(r))return t.get(r).texture;{const u=r.image;if(l&&u&&u.height>0||h&&u&&i(u)){e===null&&(e=new _h(s));const f=l?e.fromEquirectangular(r):e.fromCubemap(r);return t.set(r,f),r.addEventListener("dispose",o),f.texture}else return null}}}return r}function i(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function o(r){const c=r.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function W1(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function G1(s,t,e,n){const i={},o=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const v=f.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}f.removeEventListener("dispose",a),delete i[f.id];const d=o.get(f);d&&(t.remove(d),o.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function r(u,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],s.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const v=d[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],s.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,g=u.attributes.position;let v=0;if(d!==null){const x=d.array;v=d.version;for(let w=0,b=x.length;w<b;w+=3){const y=x[w+0],S=x[w+1],E=x[w+2];f.push(y,S,S,E,E,y)}}else if(g!==void 0){const x=g.array;v=g.version;for(let w=0,b=x.length/3-1;w<b;w+=3){const y=w+0,S=w+1,E=w+2;f.push(y,S,S,E,E,y)}}else return;const m=new(Of(f)?jf:$f)(f,1);m.version=v;const p=o.get(u);p&&t.remove(p),o.set(u,m)}function h(u){const f=o.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return o.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function H1(s,t,e,n){const i=n.isWebGL2;let o;function a(d){o=d}let r,c;function l(d){r=d.type,c=d.bytesPerElement}function h(d,g){s.drawElements(o,g,r,d*c),e.update(g,o,1)}function u(d,g,v){if(v===0)return;let m,p;if(i)m=s,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](o,g,r,d*c,v),e.update(g,o,v)}function f(d,g,v){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<v;p++)this.render(d[p]/c,g[p]);else{m.multiDrawElementsWEBGL(o,g,0,r,d,0,v);let p=0;for(let x=0;x<v;x++)p+=g[x];e.update(p,o,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function V1(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,a,r){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=r*(o/3);break;case s.LINES:e.lines+=r*(o/2);break;case s.LINE_STRIP:e.lines+=r*(o-1);break;case s.LINE_LOOP:e.lines+=r*o;break;case s.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function $1(s,t){return s[0]-t[0]}function j1(s,t){return Math.abs(t[1])-Math.abs(s[1])}function X1(s,t,e){const n={},i=new Float32Array(8),o=new WeakMap,a=new te,r=[];for(let l=0;l<8;l++)r[l]=[l,0];function c(l,h,u){const f=l.morphTargetInfluences;if(t.isWebGL2===!0){const d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=d!==void 0?d.length:0;let v=o.get(h);if(v===void 0||v.count!==g){let C=function(){R.dispose(),o.delete(h),h.removeEventListener("dispose",C)};v!==void 0&&v.texture.dispose();const x=h.morphAttributes.position!==void 0,w=h.morphAttributes.normal!==void 0,b=h.morphAttributes.color!==void 0,y=h.morphAttributes.position||[],S=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let T=0;x===!0&&(T=1),w===!0&&(T=2),b===!0&&(T=3);let M=h.attributes.position.count*T,_=1;M>t.maxTextureSize&&(_=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const A=new Float32Array(M*_*4*g),R=new Gf(A,M,_,g);R.type=gi,R.needsUpdate=!0;const D=T*4;for(let z=0;z<g;z++){const I=y[z],O=S[z],N=E[z],j=M*_*4*z;for(let H=0;H<I.count;H++){const J=H*D;x===!0&&(a.fromBufferAttribute(I,H),A[j+J+0]=a.x,A[j+J+1]=a.y,A[j+J+2]=a.z,A[j+J+3]=0),w===!0&&(a.fromBufferAttribute(O,H),A[j+J+4]=a.x,A[j+J+5]=a.y,A[j+J+6]=a.z,A[j+J+7]=0),b===!0&&(a.fromBufferAttribute(N,H),A[j+J+8]=a.x,A[j+J+9]=a.y,A[j+J+10]=a.z,A[j+J+11]=N.itemSize===4?a.w:1)}}v={count:g,texture:R,size:new Ht(M,_)},o.set(h,v),h.addEventListener("dispose",C)}let m=0;for(let x=0;x<f.length;x++)m+=f[x];const p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(s,"morphTargetBaseInfluence",p),u.getUniforms().setValue(s,"morphTargetInfluences",f),u.getUniforms().setValue(s,"morphTargetsTexture",v.texture,e),u.getUniforms().setValue(s,"morphTargetsTextureSize",v.size)}else{const d=f===void 0?0:f.length;let g=n[h.id];if(g===void 0||g.length!==d){g=[];for(let w=0;w<d;w++)g[w]=[w,0];n[h.id]=g}for(let w=0;w<d;w++){const b=g[w];b[0]=w,b[1]=f[w]}g.sort(j1);for(let w=0;w<8;w++)w<d&&g[w][1]?(r[w][0]=g[w][0],r[w][1]=g[w][1]):(r[w][0]=Number.MAX_SAFE_INTEGER,r[w][1]=0);r.sort($1);const v=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let w=0;w<8;w++){const b=r[w],y=b[0],S=b[1];y!==Number.MAX_SAFE_INTEGER&&S?(v&&h.getAttribute("morphTarget"+w)!==v[y]&&h.setAttribute("morphTarget"+w,v[y]),m&&h.getAttribute("morphNormal"+w)!==m[y]&&h.setAttribute("morphNormal"+w,m[y]),i[w]=S,p+=S):(v&&h.hasAttribute("morphTarget"+w)===!0&&h.deleteAttribute("morphTarget"+w),m&&h.hasAttribute("morphNormal"+w)===!0&&h.deleteAttribute("morphNormal"+w),i[w]=0)}const x=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(s,"morphTargetBaseInfluence",x),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:c}}function q1(s,t,e,n){let i=new WeakMap;function o(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return u}function a(){i=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:a}}class sl extends pn{constructor(t,e,n,i,o,a,r,c,l,h){if(h=h!==void 0?h:rs,h!==rs&&h!==Zs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===rs&&(n=mi),n===void 0&&h===Zs&&(n=as),super(null,i,o,a,r,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:se,this.minFilter=c!==void 0?c:se,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Zf=new pn,Jf=new sl(1,1);Jf.compareFunction=Nf;const Qf=new Gf,td=new D0,ed=new Yf,Ah=[],Th=[],Ch=new Float32Array(16),Rh=new Float32Array(9),Lh=new Float32Array(4);function no(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let o=Ah[i];if(o===void 0&&(o=new Float32Array(i),Ah[i]=o),t!==0){n.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,s[a].toArray(o,r)}return o}function Oe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Be(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function yr(s,t){let e=Th[t];e===void 0&&(e=new Int32Array(t),Th[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Y1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function K1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;s.uniform2fv(this.addr,t),Be(e,t)}}function Z1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Oe(e,t))return;s.uniform3fv(this.addr,t),Be(e,t)}}function J1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;s.uniform4fv(this.addr,t),Be(e,t)}}function Q1(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Oe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,n))return;Lh.set(n),s.uniformMatrix2fv(this.addr,!1,Lh),Be(e,n)}}function tv(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Oe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,n))return;Rh.set(n),s.uniformMatrix3fv(this.addr,!1,Rh),Be(e,n)}}function ev(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Oe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,n))return;Ch.set(n),s.uniformMatrix4fv(this.addr,!1,Ch),Be(e,n)}}function nv(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function iv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;s.uniform2iv(this.addr,t),Be(e,t)}}function sv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;s.uniform3iv(this.addr,t),Be(e,t)}}function ov(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;s.uniform4iv(this.addr,t),Be(e,t)}}function av(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function rv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;s.uniform2uiv(this.addr,t),Be(e,t)}}function cv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;s.uniform3uiv(this.addr,t),Be(e,t)}}function lv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;s.uniform4uiv(this.addr,t),Be(e,t)}}function hv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const o=this.type===s.SAMPLER_2D_SHADOW?Jf:Zf;e.setTexture2D(t||o,i)}function uv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||td,i)}function fv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||ed,i)}function dv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Qf,i)}function pv(s){switch(s){case 5126:return Y1;case 35664:return K1;case 35665:return Z1;case 35666:return J1;case 35674:return Q1;case 35675:return tv;case 35676:return ev;case 5124:case 35670:return nv;case 35667:case 35671:return iv;case 35668:case 35672:return sv;case 35669:case 35673:return ov;case 5125:return av;case 36294:return rv;case 36295:return cv;case 36296:return lv;case 35678:case 36198:case 36298:case 36306:case 35682:return hv;case 35679:case 36299:case 36307:return uv;case 35680:case 36300:case 36308:case 36293:return fv;case 36289:case 36303:case 36311:case 36292:return dv}}function mv(s,t){s.uniform1fv(this.addr,t)}function gv(s,t){const e=no(t,this.size,2);s.uniform2fv(this.addr,e)}function vv(s,t){const e=no(t,this.size,3);s.uniform3fv(this.addr,e)}function xv(s,t){const e=no(t,this.size,4);s.uniform4fv(this.addr,e)}function wv(s,t){const e=no(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function yv(s,t){const e=no(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Mv(s,t){const e=no(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function _v(s,t){s.uniform1iv(this.addr,t)}function bv(s,t){s.uniform2iv(this.addr,t)}function Sv(s,t){s.uniform3iv(this.addr,t)}function Ev(s,t){s.uniform4iv(this.addr,t)}function Av(s,t){s.uniform1uiv(this.addr,t)}function Tv(s,t){s.uniform2uiv(this.addr,t)}function Cv(s,t){s.uniform3uiv(this.addr,t)}function Rv(s,t){s.uniform4uiv(this.addr,t)}function Lv(s,t,e){const n=this.cache,i=t.length,o=yr(e,i);Oe(n,o)||(s.uniform1iv(this.addr,o),Be(n,o));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||Zf,o[a])}function Pv(s,t,e){const n=this.cache,i=t.length,o=yr(e,i);Oe(n,o)||(s.uniform1iv(this.addr,o),Be(n,o));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||td,o[a])}function Dv(s,t,e){const n=this.cache,i=t.length,o=yr(e,i);Oe(n,o)||(s.uniform1iv(this.addr,o),Be(n,o));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||ed,o[a])}function kv(s,t,e){const n=this.cache,i=t.length,o=yr(e,i);Oe(n,o)||(s.uniform1iv(this.addr,o),Be(n,o));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Qf,o[a])}function zv(s){switch(s){case 5126:return mv;case 35664:return gv;case 35665:return vv;case 35666:return xv;case 35674:return wv;case 35675:return yv;case 35676:return Mv;case 5124:case 35670:return _v;case 35667:case 35671:return bv;case 35668:case 35672:return Sv;case 35669:case 35673:return Ev;case 5125:return Av;case 36294:return Tv;case 36295:return Cv;case 36296:return Rv;case 35678:case 36198:case 36298:case 36306:case 35682:return Lv;case 35679:case 36299:case 36307:return Pv;case 35680:case 36300:case 36308:case 36293:return Dv;case 36289:case 36303:case 36311:case 36292:return kv}}class Iv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=pv(e.type)}}class Uv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=zv(e.type)}}class Fv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let o=0,a=i.length;o!==a;++o){const r=i[o];r.setValue(t,e[r.id],n)}}}const nc=/(\w+)(\])?(\[|\.)?/g;function Ph(s,t){s.seq.push(t),s.map[t.id]=t}function Nv(s,t,e){const n=s.name,i=n.length;for(nc.lastIndex=0;;){const o=nc.exec(n),a=nc.lastIndex;let r=o[1];const c=o[2]==="]",l=o[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===i){Ph(e,l===void 0?new Iv(r,s,t):new Uv(r,s,t));break}else{let u=e.map[r];u===void 0&&(u=new Fv(r),Ph(e,u)),e=u}}}class Wa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const o=t.getActiveUniform(e,i),a=t.getUniformLocation(e,o.name);Nv(o,a,this)}}setValue(t,e,n,i){const o=this.map[e];o!==void 0&&o.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let o=0,a=e.length;o!==a;++o){const r=e[o],c=n[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,o=t.length;i!==o;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Dh(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Ov=37297;let Bv=0;function Wv(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=i;a<o;a++){const r=a+1;n.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return n.join(`
`)}function Gv(s){const t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(s);let n;switch(t===e?n="":t===Qa&&e===Ja?n="LinearDisplayP3ToLinearSRGB":t===Ja&&e===Qa&&(n="LinearSRGBToLinearDisplayP3"),s){case Mi:case vr:return[n,"LinearTransferOETF"];case $e:case Jc:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function kh(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const o=/ERROR: 0:(\d+)/.exec(i);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+i+`

`+Wv(s.getShaderSource(t),a)}else return i}function Hv(s,t){const e=Gv(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Vv(s,t){let e;switch(t){case Hp:e="Linear";break;case Vp:e="Reinhard";break;case $p:e="OptimizedCineon";break;case jp:e="ACESFilmic";break;case qp:e="AgX";break;case Xp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function $v(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ns).join(`
`)}function jv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ns).join(`
`)}function Xv(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function qv(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const o=s.getActiveAttrib(t,i),a=o.name;let r=1;o.type===s.FLOAT_MAT2&&(r=2),o.type===s.FLOAT_MAT3&&(r=3),o.type===s.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:s.getAttribLocation(t,a),locationSize:r}}return e}function Ns(s){return s!==""}function zh(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ih(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Yv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ic(s){return s.replace(Yv,Zv)}const Kv=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Zv(s,t){let e=Kt[t];if(e===void 0){const n=Kv.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ic(e)}const Jv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Uh(s){return s.replace(Jv,Qv)}function Qv(s,t,e,n){let i="";for(let o=parseInt(t);o<parseInt(e);o++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return i}function Fh(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function tx(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Af?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===vp?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===hi&&(t="SHADOWMAP_TYPE_VSM"),t}function ex(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ys:case Ks:t="ENVMAP_TYPE_CUBE";break;case gr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function nx(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ks:t="ENVMAP_MODE_REFRACTION";break}return t}function ix(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Tf:t="ENVMAP_BLENDING_MULTIPLY";break;case Wp:t="ENVMAP_BLENDING_MIX";break;case Gp:t="ENVMAP_BLENDING_ADD";break}return t}function sx(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function ox(s,t,e,n){const i=s.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=tx(e),l=ex(e),h=nx(e),u=ix(e),f=sx(e),d=e.isWebGL2?"":$v(e),g=jv(e),v=Xv(o),m=i.createProgram();let p,x,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Ns).join(`
`),p.length>0&&(p+=`
`),x=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Ns).join(`
`),x.length>0&&(x+=`
`)):(p=[Fh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ns).join(`
`),x=[d,Fh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ii?"#define TONE_MAPPING":"",e.toneMapping!==Ii?Kt.tonemapping_pars_fragment:"",e.toneMapping!==Ii?Vv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,Hv("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ns).join(`
`)),a=Ic(a),a=zh(a,e),a=Ih(a,e),r=Ic(r),r=zh(r,e),r=Ih(r,e),a=Uh(a),r=Uh(r),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,x=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===eh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===eh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const b=w+p+a,y=w+x+r,S=Dh(i,i.VERTEX_SHADER,b),E=Dh(i,i.FRAGMENT_SHADER,y);i.attachShader(m,S),i.attachShader(m,E),e.index0AttributeName!==void 0?i.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function T(R){if(s.debug.checkShaderErrors){const D=i.getProgramInfoLog(m).trim(),C=i.getShaderInfoLog(S).trim(),z=i.getShaderInfoLog(E).trim();let I=!0,O=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(I=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,m,S,E);else{const N=kh(i,S,"vertex"),j=kh(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Program Info Log: `+D+`
`+N+`
`+j)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):(C===""||z==="")&&(O=!1);O&&(R.diagnostics={runnable:I,programLog:D,vertexShader:{log:C,prefix:p},fragmentShader:{log:z,prefix:x}})}i.deleteShader(S),i.deleteShader(E),M=new Wa(i,m),_=qv(i,m)}let M;this.getUniforms=function(){return M===void 0&&T(this),M};let _;this.getAttributes=function(){return _===void 0&&T(this),_};let A=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=i.getProgramParameter(m,Ov)),A},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Bv++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=S,this.fragmentShader=E,this}let ax=0;class rx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),o=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new cx(t),e.set(t,n)),n}}class cx{constructor(t){this.id=ax++,this.code=t,this.usedTimes=0}}function lx(s,t,e,n,i,o,a){const r=new el,c=new rx,l=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return M===0?"uv":`uv${M}`}function m(M,_,A,R,D){const C=R.fog,z=D.geometry,I=M.isMeshStandardMaterial?R.environment:null,O=(M.isMeshStandardMaterial?e:t).get(M.envMap||I),N=O&&O.mapping===gr?O.image.height:null,j=g[M.type];M.precision!==null&&(d=i.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const H=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,J=H!==void 0?H.length:0;let ot=0;z.morphAttributes.position!==void 0&&(ot=1),z.morphAttributes.normal!==void 0&&(ot=2),z.morphAttributes.color!==void 0&&(ot=3);let Y,nt,ct,mt;if(j){const Ce=Xn[j];Y=Ce.vertexShader,nt=Ce.fragmentShader}else Y=M.vertexShader,nt=M.fragmentShader,c.update(M),ct=c.getVertexShaderID(M),mt=c.getFragmentShaderID(M);const St=s.getRenderTarget(),Tt=D.isInstancedMesh===!0,Rt=D.isBatchedMesh===!0,yt=!!M.map,It=!!M.matcap,X=!!O,fe=!!M.aoMap,Lt=!!M.lightMap,Ft=!!M.bumpMap,Z=!!M.normalMap,lt=!!M.displacementMap,ut=!!M.emissiveMap,P=!!M.metalnessMap,L=!!M.roughnessMap,F=M.anisotropy>0,G=M.clearcoat>0,Q=M.iridescence>0,V=M.sheen>0,et=M.transmission>0,st=F&&!!M.anisotropyMap,gt=G&&!!M.clearcoatMap,_t=G&&!!M.clearcoatNormalMap,Yt=G&&!!M.clearcoatRoughnessMap,ht=Q&&!!M.iridescenceMap,oe=Q&&!!M.iridescenceThicknessMap,$=V&&!!M.sheenColorMap,kt=V&&!!M.sheenRoughnessMap,At=!!M.specularMap,vt=!!M.specularColorMap,Wt=!!M.specularIntensityMap,ee=et&&!!M.transmissionMap,he=et&&!!M.thicknessMap,Ot=!!M.gradientMap,rt=!!M.alphaMap,U=M.alphaTest>0,ft=!!M.alphaHash,dt=!!M.extensions,Ut=!!z.attributes.uv1,Nt=!!z.attributes.uv2,ne=!!z.attributes.uv3;let ae=Ii;return M.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(ae=s.toneMapping),{isWebGL2:h,shaderID:j,shaderType:M.type,shaderName:M.name,vertexShader:Y,fragmentShader:nt,defines:M.defines,customVertexShaderID:ct,customFragmentShaderID:mt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:Rt,instancing:Tt,instancingColor:Tt&&D.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:St===null?s.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:Mi,map:yt,matcap:It,envMap:X,envMapMode:X&&O.mapping,envMapCubeUVHeight:N,aoMap:fe,lightMap:Lt,bumpMap:Ft,normalMap:Z,displacementMap:f&&lt,emissiveMap:ut,normalMapObjectSpace:Z&&M.normalMapType===o0,normalMapTangentSpace:Z&&M.normalMapType===s0,metalnessMap:P,roughnessMap:L,anisotropy:F,anisotropyMap:st,clearcoat:G,clearcoatMap:gt,clearcoatNormalMap:_t,clearcoatRoughnessMap:Yt,iridescence:Q,iridescenceMap:ht,iridescenceThicknessMap:oe,sheen:V,sheenColorMap:$,sheenRoughnessMap:kt,specularMap:At,specularColorMap:vt,specularIntensityMap:Wt,transmission:et,transmissionMap:ee,thicknessMap:he,gradientMap:Ot,opaque:M.transparent===!1&&M.blending===js,alphaMap:rt,alphaTest:U,alphaHash:ft,combine:M.combine,mapUv:yt&&v(M.map.channel),aoMapUv:fe&&v(M.aoMap.channel),lightMapUv:Lt&&v(M.lightMap.channel),bumpMapUv:Ft&&v(M.bumpMap.channel),normalMapUv:Z&&v(M.normalMap.channel),displacementMapUv:lt&&v(M.displacementMap.channel),emissiveMapUv:ut&&v(M.emissiveMap.channel),metalnessMapUv:P&&v(M.metalnessMap.channel),roughnessMapUv:L&&v(M.roughnessMap.channel),anisotropyMapUv:st&&v(M.anisotropyMap.channel),clearcoatMapUv:gt&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:_t&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Yt&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:ht&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:$&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:kt&&v(M.sheenRoughnessMap.channel),specularMapUv:At&&v(M.specularMap.channel),specularColorMapUv:vt&&v(M.specularColorMap.channel),specularIntensityMapUv:Wt&&v(M.specularIntensityMap.channel),transmissionMapUv:ee&&v(M.transmissionMap.channel),thicknessMapUv:he&&v(M.thicknessMap.channel),alphaMapUv:rt&&v(M.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(Z||F),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,vertexUv1s:Ut,vertexUv2s:Nt,vertexUv3s:ne,pointsUvs:D.isPoints===!0&&!!z.attributes.uv&&(yt||rt),fog:!!C,useFog:M.fog===!0,fogExp2:C&&C.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:D.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:ot,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&A.length>0,shadowMapType:s.shadowMap.type,toneMapping:ae,useLegacyLights:s._useLegacyLights,decodeVideoTexture:yt&&M.map.isVideoTexture===!0&&le.getTransfer(M.map.colorSpace)===de,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Ln,flipSided:M.side===hn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:dt&&M.extensions.derivatives===!0,extensionFragDepth:dt&&M.extensions.fragDepth===!0,extensionDrawBuffers:dt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:dt&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:dt&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function p(M){const _=[];if(M.shaderID?_.push(M.shaderID):(_.push(M.customVertexShaderID),_.push(M.customFragmentShaderID)),M.defines!==void 0)for(const A in M.defines)_.push(A),_.push(M.defines[A]);return M.isRawShaderMaterial===!1&&(x(_,M),w(_,M),_.push(s.outputColorSpace)),_.push(M.customProgramCacheKey),_.join()}function x(M,_){M.push(_.precision),M.push(_.outputColorSpace),M.push(_.envMapMode),M.push(_.envMapCubeUVHeight),M.push(_.mapUv),M.push(_.alphaMapUv),M.push(_.lightMapUv),M.push(_.aoMapUv),M.push(_.bumpMapUv),M.push(_.normalMapUv),M.push(_.displacementMapUv),M.push(_.emissiveMapUv),M.push(_.metalnessMapUv),M.push(_.roughnessMapUv),M.push(_.anisotropyMapUv),M.push(_.clearcoatMapUv),M.push(_.clearcoatNormalMapUv),M.push(_.clearcoatRoughnessMapUv),M.push(_.iridescenceMapUv),M.push(_.iridescenceThicknessMapUv),M.push(_.sheenColorMapUv),M.push(_.sheenRoughnessMapUv),M.push(_.specularMapUv),M.push(_.specularColorMapUv),M.push(_.specularIntensityMapUv),M.push(_.transmissionMapUv),M.push(_.thicknessMapUv),M.push(_.combine),M.push(_.fogExp2),M.push(_.sizeAttenuation),M.push(_.morphTargetsCount),M.push(_.morphAttributeCount),M.push(_.numDirLights),M.push(_.numPointLights),M.push(_.numSpotLights),M.push(_.numSpotLightMaps),M.push(_.numHemiLights),M.push(_.numRectAreaLights),M.push(_.numDirLightShadows),M.push(_.numPointLightShadows),M.push(_.numSpotLightShadows),M.push(_.numSpotLightShadowsWithMaps),M.push(_.numLightProbes),M.push(_.shadowMapType),M.push(_.toneMapping),M.push(_.numClippingPlanes),M.push(_.numClipIntersection),M.push(_.depthPacking)}function w(M,_){r.disableAll(),_.isWebGL2&&r.enable(0),_.supportsVertexTextures&&r.enable(1),_.instancing&&r.enable(2),_.instancingColor&&r.enable(3),_.matcap&&r.enable(4),_.envMap&&r.enable(5),_.normalMapObjectSpace&&r.enable(6),_.normalMapTangentSpace&&r.enable(7),_.clearcoat&&r.enable(8),_.iridescence&&r.enable(9),_.alphaTest&&r.enable(10),_.vertexColors&&r.enable(11),_.vertexAlphas&&r.enable(12),_.vertexUv1s&&r.enable(13),_.vertexUv2s&&r.enable(14),_.vertexUv3s&&r.enable(15),_.vertexTangents&&r.enable(16),_.anisotropy&&r.enable(17),_.alphaHash&&r.enable(18),_.batching&&r.enable(19),M.push(r.mask),r.disableAll(),_.fog&&r.enable(0),_.useFog&&r.enable(1),_.flatShading&&r.enable(2),_.logarithmicDepthBuffer&&r.enable(3),_.skinning&&r.enable(4),_.morphTargets&&r.enable(5),_.morphNormals&&r.enable(6),_.morphColors&&r.enable(7),_.premultipliedAlpha&&r.enable(8),_.shadowMapEnabled&&r.enable(9),_.useLegacyLights&&r.enable(10),_.doubleSided&&r.enable(11),_.flipSided&&r.enable(12),_.useDepthPacking&&r.enable(13),_.dithering&&r.enable(14),_.transmission&&r.enable(15),_.sheen&&r.enable(16),_.opaque&&r.enable(17),_.pointsUvs&&r.enable(18),_.decodeVideoTexture&&r.enable(19),M.push(r.mask)}function b(M){const _=g[M.type];let A;if(_){const R=Xn[_];A=$0.clone(R.uniforms)}else A=M.uniforms;return A}function y(M,_){let A;for(let R=0,D=l.length;R<D;R++){const C=l[R];if(C.cacheKey===_){A=C,++A.usedTimes;break}}return A===void 0&&(A=new ox(s,_,M,o),l.push(A)),A}function S(M){if(--M.usedTimes===0){const _=l.indexOf(M);l[_]=l[l.length-1],l.pop(),M.destroy()}}function E(M){c.remove(M)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:b,acquireProgram:y,releaseProgram:S,releaseShaderCache:E,programs:l,dispose:T}}function hx(){let s=new WeakMap;function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function e(o){s.delete(o)}function n(o,a,r){s.get(o)[a]=r}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function ux(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Nh(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Oh(){const s=[];let t=0;const e=[],n=[],i=[];function o(){t=0,e.length=0,n.length=0,i.length=0}function a(u,f,d,g,v,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function r(u,f,d,g,v,m){const p=a(u,f,d,g,v,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):e.push(p)}function c(u,f,d,g,v,m){const p=a(u,f,d,g,v,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||ux),n.length>1&&n.sort(f||Nh),i.length>1&&i.sort(f||Nh)}function h(){for(let u=t,f=s.length;u<f;u++){const d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:i,init:o,push:r,unshift:c,finish:h,sort:l}}function fx(){let s=new WeakMap;function t(n,i){const o=s.get(n);let a;return o===void 0?(a=new Oh,s.set(n,[a])):i>=o.length?(a=new Oh,o.push(a)):a=o[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function dx(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new Bt};break;case"SpotLight":e={position:new W,direction:new W,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new W,halfWidth:new W,halfHeight:new W};break}return s[t.id]=e,e}}}function px(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let mx=0;function gx(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function vx(s,t){const e=new dx,n=px(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new W);const o=new W,a=new ie,r=new ie;function c(h,u){let f=0,d=0,g=0;for(let R=0;R<9;R++)i.probe[R].set(0,0,0);let v=0,m=0,p=0,x=0,w=0,b=0,y=0,S=0,E=0,T=0,M=0;h.sort(gx);const _=u===!0?Math.PI:1;for(let R=0,D=h.length;R<D;R++){const C=h[R],z=C.color,I=C.intensity,O=C.distance,N=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)f+=z.r*I*_,d+=z.g*I*_,g+=z.b*I*_;else if(C.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(C.sh.coefficients[j],I);M++}else if(C.isDirectionalLight){const j=e.get(C);if(j.color.copy(C.color).multiplyScalar(C.intensity*_),C.castShadow){const H=C.shadow,J=n.get(C);J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,i.directionalShadow[v]=J,i.directionalShadowMap[v]=N,i.directionalShadowMatrix[v]=C.shadow.matrix,b++}i.directional[v]=j,v++}else if(C.isSpotLight){const j=e.get(C);j.position.setFromMatrixPosition(C.matrixWorld),j.color.copy(z).multiplyScalar(I*_),j.distance=O,j.coneCos=Math.cos(C.angle),j.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),j.decay=C.decay,i.spot[p]=j;const H=C.shadow;if(C.map&&(i.spotLightMap[E]=C.map,E++,H.updateMatrices(C),C.castShadow&&T++),i.spotLightMatrix[p]=H.matrix,C.castShadow){const J=n.get(C);J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,i.spotShadow[p]=J,i.spotShadowMap[p]=N,S++}p++}else if(C.isRectAreaLight){const j=e.get(C);j.color.copy(z).multiplyScalar(I),j.halfWidth.set(C.width*.5,0,0),j.halfHeight.set(0,C.height*.5,0),i.rectArea[x]=j,x++}else if(C.isPointLight){const j=e.get(C);if(j.color.copy(C.color).multiplyScalar(C.intensity*_),j.distance=C.distance,j.decay=C.decay,C.castShadow){const H=C.shadow,J=n.get(C);J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,J.shadowCameraNear=H.camera.near,J.shadowCameraFar=H.camera.far,i.pointShadow[m]=J,i.pointShadowMap[m]=N,i.pointShadowMatrix[m]=C.shadow.matrix,y++}i.point[m]=j,m++}else if(C.isHemisphereLight){const j=e.get(C);j.skyColor.copy(C.color).multiplyScalar(I*_),j.groundColor.copy(C.groundColor).multiplyScalar(I*_),i.hemi[w]=j,w++}}x>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=wt.LTC_FLOAT_1,i.rectAreaLTC2=wt.LTC_FLOAT_2):(i.rectAreaLTC1=wt.LTC_HALF_1,i.rectAreaLTC2=wt.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=wt.LTC_FLOAT_1,i.rectAreaLTC2=wt.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=wt.LTC_HALF_1,i.rectAreaLTC2=wt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=d,i.ambient[2]=g;const A=i.hash;(A.directionalLength!==v||A.pointLength!==m||A.spotLength!==p||A.rectAreaLength!==x||A.hemiLength!==w||A.numDirectionalShadows!==b||A.numPointShadows!==y||A.numSpotShadows!==S||A.numSpotMaps!==E||A.numLightProbes!==M)&&(i.directional.length=v,i.spot.length=p,i.rectArea.length=x,i.point.length=m,i.hemi.length=w,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=S+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=M,A.directionalLength=v,A.pointLength=m,A.spotLength=p,A.rectAreaLength=x,A.hemiLength=w,A.numDirectionalShadows=b,A.numPointShadows=y,A.numSpotShadows=S,A.numSpotMaps=E,A.numLightProbes=M,i.version=mx++)}function l(h,u){let f=0,d=0,g=0,v=0,m=0;const p=u.matrixWorldInverse;for(let x=0,w=h.length;x<w;x++){const b=h[x];if(b.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(b.matrixWorld),o.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(o),y.direction.transformDirection(p),f++}else if(b.isSpotLight){const y=i.spot[g];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(b.matrixWorld),o.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(o),y.direction.transformDirection(p),g++}else if(b.isRectAreaLight){const y=i.rectArea[v];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(p),r.identity(),a.copy(b.matrixWorld),a.premultiply(p),r.extractRotation(a),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(r),y.halfHeight.applyMatrix4(r),v++}else if(b.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(p),d++}else if(b.isHemisphereLight){const y=i.hemi[m];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(p),m++}}}return{setup:c,setupView:l,state:i}}function Bh(s,t){const e=new vx(s,t),n=[],i=[];function o(){n.length=0,i.length=0}function a(u){n.push(u)}function r(u){i.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:o,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:r}}function xx(s,t){let e=new WeakMap;function n(o,a=0){const r=e.get(o);let c;return r===void 0?(c=new Bh(s,t),e.set(o,[c])):a>=r.length?(c=new Bh(s,t),r.push(c)):c=r[a],c}function i(){e=new WeakMap}return{get:n,dispose:i}}class wx extends Ho{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=n0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class yx extends Ho{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Mx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_x=`uniform sampler2D shadow_pass;
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
}`;function bx(s,t,e){let n=new Bi;const i=new Ht,o=new Ht,a=new te,r=new wx({depthPacking:i0}),c=new yx,l={},h=e.maxTextureSize,u={[yi]:hn,[hn]:yi,[Ln]:Ln},f=new Ee({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ht},radius:{value:4}},vertexShader:Mx,fragmentShader:_x}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Je;g.setAttribute("position",new pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new me(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Af;let p=this.type;this.render=function(S,E,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const M=s.getRenderTarget(),_=s.getActiveCubeFace(),A=s.getActiveMipmapLevel(),R=s.state;R.setBlending(wi),R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const D=p!==hi&&this.type===hi,C=p===hi&&this.type!==hi;for(let z=0,I=S.length;z<I;z++){const O=S[z],N=O.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;i.copy(N.mapSize);const j=N.getFrameExtents();if(i.multiply(j),o.copy(N.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(o.x=Math.floor(h/j.x),i.x=o.x*j.x,N.mapSize.x=o.x),i.y>h&&(o.y=Math.floor(h/j.y),i.y=o.y*j.y,N.mapSize.y=o.y)),N.map===null||D===!0||C===!0){const J=this.type!==hi?{minFilter:se,magFilter:se}:{};N.map!==null&&N.map.dispose(),N.map=new ti(i.x,i.y,J),N.map.texture.name=O.name+".shadowMap",N.camera.updateProjectionMatrix()}s.setRenderTarget(N.map),s.clear();const H=N.getViewportCount();for(let J=0;J<H;J++){const ot=N.getViewport(J);a.set(o.x*ot.x,o.y*ot.y,o.x*ot.z,o.y*ot.w),R.viewport(a),N.updateMatrices(O,J),n=N.getFrustum(),b(E,T,N.camera,O,this.type)}N.isPointLightShadow!==!0&&this.type===hi&&x(N,T),N.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(M,_,A)};function x(S,E){const T=t.update(v);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new ti(i.x,i.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(E,null,T,f,v,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(E,null,T,d,v,null)}function w(S,E,T,M){let _=null;const A=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)_=A;else if(_=T.isPointLight===!0?c:r,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const R=_.uuid,D=E.uuid;let C=l[R];C===void 0&&(C={},l[R]=C);let z=C[D];z===void 0&&(z=_.clone(),C[D]=z,E.addEventListener("dispose",y)),_=z}if(_.visible=E.visible,_.wireframe=E.wireframe,M===hi?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:u[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,T.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const R=s.properties.get(_);R.light=T}return _}function b(S,E,T,M,_){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&_===hi)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const D=t.update(S),C=S.material;if(Array.isArray(C)){const z=D.groups;for(let I=0,O=z.length;I<O;I++){const N=z[I],j=C[N.materialIndex];if(j&&j.visible){const H=w(S,j,M,_);S.onBeforeShadow(s,S,E,T,D,H,N),s.renderBufferDirect(T,null,D,H,S,N),S.onAfterShadow(s,S,E,T,D,H,N)}}}else if(C.visible){const z=w(S,C,M,_);S.onBeforeShadow(s,S,E,T,D,z,null),s.renderBufferDirect(T,null,D,z,S,null),S.onAfterShadow(s,S,E,T,D,z,null)}}const R=S.children;for(let D=0,C=R.length;D<C;D++)b(R[D],E,T,M,_)}function y(S){S.target.removeEventListener("dispose",y);for(const T in l){const M=l[T],_=S.target.uuid;_ in M&&(M[_].dispose(),delete M[_])}}}function Sx(s,t,e){const n=e.isWebGL2;function i(){let U=!1;const ft=new te;let dt=null;const Ut=new te(0,0,0,0);return{setMask:function(Nt){dt!==Nt&&!U&&(s.colorMask(Nt,Nt,Nt,Nt),dt=Nt)},setLocked:function(Nt){U=Nt},setClear:function(Nt,ne,ae,ve,Ce){Ce===!0&&(Nt*=ve,ne*=ve,ae*=ve),ft.set(Nt,ne,ae,ve),Ut.equals(ft)===!1&&(s.clearColor(Nt,ne,ae,ve),Ut.copy(ft))},reset:function(){U=!1,dt=null,Ut.set(-1,0,0,0)}}}function o(){let U=!1,ft=null,dt=null,Ut=null;return{setTest:function(Nt){Nt?Rt(s.DEPTH_TEST):yt(s.DEPTH_TEST)},setMask:function(Nt){ft!==Nt&&!U&&(s.depthMask(Nt),ft=Nt)},setFunc:function(Nt){if(dt!==Nt){switch(Nt){case zp:s.depthFunc(s.NEVER);break;case Ip:s.depthFunc(s.ALWAYS);break;case Up:s.depthFunc(s.LESS);break;case Ya:s.depthFunc(s.LEQUAL);break;case Fp:s.depthFunc(s.EQUAL);break;case Np:s.depthFunc(s.GEQUAL);break;case Op:s.depthFunc(s.GREATER);break;case Bp:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}dt=Nt}},setLocked:function(Nt){U=Nt},setClear:function(Nt){Ut!==Nt&&(s.clearDepth(Nt),Ut=Nt)},reset:function(){U=!1,ft=null,dt=null,Ut=null}}}function a(){let U=!1,ft=null,dt=null,Ut=null,Nt=null,ne=null,ae=null,ve=null,Ce=null;return{setTest:function(re){U||(re?Rt(s.STENCIL_TEST):yt(s.STENCIL_TEST))},setMask:function(re){ft!==re&&!U&&(s.stencilMask(re),ft=re)},setFunc:function(re,We,En){(dt!==re||Ut!==We||Nt!==En)&&(s.stencilFunc(re,We,En),dt=re,Ut=We,Nt=En)},setOp:function(re,We,En){(ne!==re||ae!==We||ve!==En)&&(s.stencilOp(re,We,En),ne=re,ae=We,ve=En)},setLocked:function(re){U=re},setClear:function(re){Ce!==re&&(s.clearStencil(re),Ce=re)},reset:function(){U=!1,ft=null,dt=null,Ut=null,Nt=null,ne=null,ae=null,ve=null,Ce=null}}}const r=new i,c=new o,l=new a,h=new WeakMap,u=new WeakMap;let f={},d={},g=new WeakMap,v=[],m=null,p=!1,x=null,w=null,b=null,y=null,S=null,E=null,T=null,M=new Bt(0,0,0),_=0,A=!1,R=null,D=null,C=null,z=null,I=null;const O=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,j=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(H)[1]),N=j>=1):H.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),N=j>=2);let J=null,ot={};const Y=s.getParameter(s.SCISSOR_BOX),nt=s.getParameter(s.VIEWPORT),ct=new te().fromArray(Y),mt=new te().fromArray(nt);function St(U,ft,dt,Ut){const Nt=new Uint8Array(4),ne=s.createTexture();s.bindTexture(U,ne),s.texParameteri(U,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(U,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ae=0;ae<dt;ae++)n&&(U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY)?s.texImage3D(ft,0,s.RGBA,1,1,Ut,0,s.RGBA,s.UNSIGNED_BYTE,Nt):s.texImage2D(ft+ae,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Nt);return ne}const Tt={};Tt[s.TEXTURE_2D]=St(s.TEXTURE_2D,s.TEXTURE_2D,1),Tt[s.TEXTURE_CUBE_MAP]=St(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Tt[s.TEXTURE_2D_ARRAY]=St(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Tt[s.TEXTURE_3D]=St(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Rt(s.DEPTH_TEST),c.setFunc(Ya),ut(!1),P(bl),Rt(s.CULL_FACE),Z(wi);function Rt(U){f[U]!==!0&&(s.enable(U),f[U]=!0)}function yt(U){f[U]!==!1&&(s.disable(U),f[U]=!1)}function It(U,ft){return d[U]!==ft?(s.bindFramebuffer(U,ft),d[U]=ft,n&&(U===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ft),U===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ft)),!0):!1}function X(U,ft){let dt=v,Ut=!1;if(U)if(dt=g.get(ft),dt===void 0&&(dt=[],g.set(ft,dt)),U.isWebGLMultipleRenderTargets){const Nt=U.texture;if(dt.length!==Nt.length||dt[0]!==s.COLOR_ATTACHMENT0){for(let ne=0,ae=Nt.length;ne<ae;ne++)dt[ne]=s.COLOR_ATTACHMENT0+ne;dt.length=Nt.length,Ut=!0}}else dt[0]!==s.COLOR_ATTACHMENT0&&(dt[0]=s.COLOR_ATTACHMENT0,Ut=!0);else dt[0]!==s.BACK&&(dt[0]=s.BACK,Ut=!0);Ut&&(e.isWebGL2?s.drawBuffers(dt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(dt))}function fe(U){return m!==U?(s.useProgram(U),m=U,!0):!1}const Lt={[ts]:s.FUNC_ADD,[wp]:s.FUNC_SUBTRACT,[yp]:s.FUNC_REVERSE_SUBTRACT};if(n)Lt[El]=s.MIN,Lt[Al]=s.MAX;else{const U=t.get("EXT_blend_minmax");U!==null&&(Lt[El]=U.MIN_EXT,Lt[Al]=U.MAX_EXT)}const Ft={[Mp]:s.ZERO,[_p]:s.ONE,[bp]:s.SRC_COLOR,[Cc]:s.SRC_ALPHA,[Rp]:s.SRC_ALPHA_SATURATE,[Tp]:s.DST_COLOR,[Ep]:s.DST_ALPHA,[Sp]:s.ONE_MINUS_SRC_COLOR,[Rc]:s.ONE_MINUS_SRC_ALPHA,[Cp]:s.ONE_MINUS_DST_COLOR,[Ap]:s.ONE_MINUS_DST_ALPHA,[Lp]:s.CONSTANT_COLOR,[Pp]:s.ONE_MINUS_CONSTANT_COLOR,[Dp]:s.CONSTANT_ALPHA,[kp]:s.ONE_MINUS_CONSTANT_ALPHA};function Z(U,ft,dt,Ut,Nt,ne,ae,ve,Ce,re){if(U===wi){p===!0&&(yt(s.BLEND),p=!1);return}if(p===!1&&(Rt(s.BLEND),p=!0),U!==xp){if(U!==x||re!==A){if((w!==ts||S!==ts)&&(s.blendEquation(s.FUNC_ADD),w=ts,S=ts),re)switch(U){case js:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ac:s.blendFunc(s.ONE,s.ONE);break;case Sl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Tc:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case js:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ac:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Sl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Tc:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}b=null,y=null,E=null,T=null,M.set(0,0,0),_=0,x=U,A=re}return}Nt=Nt||ft,ne=ne||dt,ae=ae||Ut,(ft!==w||Nt!==S)&&(s.blendEquationSeparate(Lt[ft],Lt[Nt]),w=ft,S=Nt),(dt!==b||Ut!==y||ne!==E||ae!==T)&&(s.blendFuncSeparate(Ft[dt],Ft[Ut],Ft[ne],Ft[ae]),b=dt,y=Ut,E=ne,T=ae),(ve.equals(M)===!1||Ce!==_)&&(s.blendColor(ve.r,ve.g,ve.b,Ce),M.copy(ve),_=Ce),x=U,A=!1}function lt(U,ft){U.side===Ln?yt(s.CULL_FACE):Rt(s.CULL_FACE);let dt=U.side===hn;ft&&(dt=!dt),ut(dt),U.blending===js&&U.transparent===!1?Z(wi):Z(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),c.setFunc(U.depthFunc),c.setTest(U.depthTest),c.setMask(U.depthWrite),r.setMask(U.colorWrite);const Ut=U.stencilWrite;l.setTest(Ut),Ut&&(l.setMask(U.stencilWriteMask),l.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),l.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),F(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Rt(s.SAMPLE_ALPHA_TO_COVERAGE):yt(s.SAMPLE_ALPHA_TO_COVERAGE)}function ut(U){R!==U&&(U?s.frontFace(s.CW):s.frontFace(s.CCW),R=U)}function P(U){U!==mp?(Rt(s.CULL_FACE),U!==D&&(U===bl?s.cullFace(s.BACK):U===gp?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):yt(s.CULL_FACE),D=U}function L(U){U!==C&&(N&&s.lineWidth(U),C=U)}function F(U,ft,dt){U?(Rt(s.POLYGON_OFFSET_FILL),(z!==ft||I!==dt)&&(s.polygonOffset(ft,dt),z=ft,I=dt)):yt(s.POLYGON_OFFSET_FILL)}function G(U){U?Rt(s.SCISSOR_TEST):yt(s.SCISSOR_TEST)}function Q(U){U===void 0&&(U=s.TEXTURE0+O-1),J!==U&&(s.activeTexture(U),J=U)}function V(U,ft,dt){dt===void 0&&(J===null?dt=s.TEXTURE0+O-1:dt=J);let Ut=ot[dt];Ut===void 0&&(Ut={type:void 0,texture:void 0},ot[dt]=Ut),(Ut.type!==U||Ut.texture!==ft)&&(J!==dt&&(s.activeTexture(dt),J=dt),s.bindTexture(U,ft||Tt[U]),Ut.type=U,Ut.texture=ft)}function et(){const U=ot[J];U!==void 0&&U.type!==void 0&&(s.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function st(){try{s.compressedTexImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function gt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function _t(){try{s.texSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Yt(){try{s.texSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ht(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function oe(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $(){try{s.texStorage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function kt(){try{s.texStorage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function At(){try{s.texImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function vt(){try{s.texImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Wt(U){ct.equals(U)===!1&&(s.scissor(U.x,U.y,U.z,U.w),ct.copy(U))}function ee(U){mt.equals(U)===!1&&(s.viewport(U.x,U.y,U.z,U.w),mt.copy(U))}function he(U,ft){let dt=u.get(ft);dt===void 0&&(dt=new WeakMap,u.set(ft,dt));let Ut=dt.get(U);Ut===void 0&&(Ut=s.getUniformBlockIndex(ft,U.name),dt.set(U,Ut))}function Ot(U,ft){const Ut=u.get(ft).get(U);h.get(ft)!==Ut&&(s.uniformBlockBinding(ft,Ut,U.__bindingPointIndex),h.set(ft,Ut))}function rt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),f={},J=null,ot={},d={},g=new WeakMap,v=[],m=null,p=!1,x=null,w=null,b=null,y=null,S=null,E=null,T=null,M=new Bt(0,0,0),_=0,A=!1,R=null,D=null,C=null,z=null,I=null,ct.set(0,0,s.canvas.width,s.canvas.height),mt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),c.reset(),l.reset()}return{buffers:{color:r,depth:c,stencil:l},enable:Rt,disable:yt,bindFramebuffer:It,drawBuffers:X,useProgram:fe,setBlending:Z,setMaterial:lt,setFlipSided:ut,setCullFace:P,setLineWidth:L,setPolygonOffset:F,setScissorTest:G,activeTexture:Q,bindTexture:V,unbindTexture:et,compressedTexImage2D:st,compressedTexImage3D:gt,texImage2D:At,texImage3D:vt,updateUBOMapping:he,uniformBlockBinding:Ot,texStorage2D:$,texStorage3D:kt,texSubImage2D:_t,texSubImage3D:Yt,compressedTexSubImage2D:ht,compressedTexSubImage3D:oe,scissor:Wt,viewport:ee,reset:rt}}function Ex(s,t,e,n,i,o,a){const r=i.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,L){return d?new OffscreenCanvas(P,L):nr("canvas")}function v(P,L,F,G){let Q=1;if((P.width>G||P.height>G)&&(Q=G/Math.max(P.width,P.height)),Q<1||L===!0)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap){const V=L?er:Math.floor,et=V(Q*P.width),st=V(Q*P.height);u===void 0&&(u=g(et,st));const gt=F?g(et,st):u;return gt.width=et,gt.height=st,gt.getContext("2d").drawImage(P,0,0,et,st),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+P.width+"x"+P.height+") to ("+et+"x"+st+")."),gt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+P.width+"x"+P.height+")."),P;return P}function m(P){return zc(P.width)&&zc(P.height)}function p(P){return r?!1:P.wrapS!==cn||P.wrapT!==cn||P.minFilter!==se&&P.minFilter!==je}function x(P,L){return P.generateMipmaps&&L&&P.minFilter!==se&&P.minFilter!==je}function w(P){s.generateMipmap(P)}function b(P,L,F,G,Q=!1){if(r===!1)return L;if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let V=L;if(L===s.RED&&(F===s.FLOAT&&(V=s.R32F),F===s.HALF_FLOAT&&(V=s.R16F),F===s.UNSIGNED_BYTE&&(V=s.R8)),L===s.RED_INTEGER&&(F===s.UNSIGNED_BYTE&&(V=s.R8UI),F===s.UNSIGNED_SHORT&&(V=s.R16UI),F===s.UNSIGNED_INT&&(V=s.R32UI),F===s.BYTE&&(V=s.R8I),F===s.SHORT&&(V=s.R16I),F===s.INT&&(V=s.R32I)),L===s.RG&&(F===s.FLOAT&&(V=s.RG32F),F===s.HALF_FLOAT&&(V=s.RG16F),F===s.UNSIGNED_BYTE&&(V=s.RG8)),L===s.RGBA){const et=Q?Za:le.getTransfer(G);F===s.FLOAT&&(V=s.RGBA32F),F===s.HALF_FLOAT&&(V=s.RGBA16F),F===s.UNSIGNED_BYTE&&(V=et===de?s.SRGB8_ALPHA8:s.RGBA8),F===s.UNSIGNED_SHORT_4_4_4_4&&(V=s.RGBA4),F===s.UNSIGNED_SHORT_5_5_5_1&&(V=s.RGB5_A1)}return(V===s.R16F||V===s.R32F||V===s.RG16F||V===s.RG32F||V===s.RGBA16F||V===s.RGBA32F)&&t.get("EXT_color_buffer_float"),V}function y(P,L,F){return x(P,F)===!0||P.isFramebufferTexture&&P.minFilter!==se&&P.minFilter!==je?Math.log2(Math.max(L.width,L.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?L.mipmaps.length:1}function S(P){return P===se||P===Tl||P===Rr?s.NEAREST:s.LINEAR}function E(P){const L=P.target;L.removeEventListener("dispose",E),M(L),L.isVideoTexture&&h.delete(L)}function T(P){const L=P.target;L.removeEventListener("dispose",T),A(L)}function M(P){const L=n.get(P);if(L.__webglInit===void 0)return;const F=P.source,G=f.get(F);if(G){const Q=G[L.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&_(P),Object.keys(G).length===0&&f.delete(F)}n.remove(P)}function _(P){const L=n.get(P);s.deleteTexture(L.__webglTexture);const F=P.source,G=f.get(F);delete G[L.__cacheKey],a.memory.textures--}function A(P){const L=P.texture,F=n.get(P),G=n.get(L);if(G.__webglTexture!==void 0&&(s.deleteTexture(G.__webglTexture),a.memory.textures--),P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(F.__webglFramebuffer[Q]))for(let V=0;V<F.__webglFramebuffer[Q].length;V++)s.deleteFramebuffer(F.__webglFramebuffer[Q][V]);else s.deleteFramebuffer(F.__webglFramebuffer[Q]);F.__webglDepthbuffer&&s.deleteRenderbuffer(F.__webglDepthbuffer[Q])}else{if(Array.isArray(F.__webglFramebuffer))for(let Q=0;Q<F.__webglFramebuffer.length;Q++)s.deleteFramebuffer(F.__webglFramebuffer[Q]);else s.deleteFramebuffer(F.__webglFramebuffer);if(F.__webglDepthbuffer&&s.deleteRenderbuffer(F.__webglDepthbuffer),F.__webglMultisampledFramebuffer&&s.deleteFramebuffer(F.__webglMultisampledFramebuffer),F.__webglColorRenderbuffer)for(let Q=0;Q<F.__webglColorRenderbuffer.length;Q++)F.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(F.__webglColorRenderbuffer[Q]);F.__webglDepthRenderbuffer&&s.deleteRenderbuffer(F.__webglDepthRenderbuffer)}if(P.isWebGLMultipleRenderTargets)for(let Q=0,V=L.length;Q<V;Q++){const et=n.get(L[Q]);et.__webglTexture&&(s.deleteTexture(et.__webglTexture),a.memory.textures--),n.remove(L[Q])}n.remove(L),n.remove(P)}let R=0;function D(){R=0}function C(){const P=R;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),R+=1,P}function z(P){const L=[];return L.push(P.wrapS),L.push(P.wrapT),L.push(P.wrapR||0),L.push(P.magFilter),L.push(P.minFilter),L.push(P.anisotropy),L.push(P.internalFormat),L.push(P.format),L.push(P.type),L.push(P.generateMipmaps),L.push(P.premultiplyAlpha),L.push(P.flipY),L.push(P.unpackAlignment),L.push(P.colorSpace),L.join()}function I(P,L){const F=n.get(P);if(P.isVideoTexture&&lt(P),P.isRenderTargetTexture===!1&&P.version>0&&F.__version!==P.version){const G=P.image;if(G===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ct(F,P,L);return}}e.bindTexture(s.TEXTURE_2D,F.__webglTexture,s.TEXTURE0+L)}function O(P,L){const F=n.get(P);if(P.version>0&&F.__version!==P.version){ct(F,P,L);return}e.bindTexture(s.TEXTURE_2D_ARRAY,F.__webglTexture,s.TEXTURE0+L)}function N(P,L){const F=n.get(P);if(P.version>0&&F.__version!==P.version){ct(F,P,L);return}e.bindTexture(s.TEXTURE_3D,F.__webglTexture,s.TEXTURE0+L)}function j(P,L){const F=n.get(P);if(P.version>0&&F.__version!==P.version){mt(F,P,L);return}e.bindTexture(s.TEXTURE_CUBE_MAP,F.__webglTexture,s.TEXTURE0+L)}const H={[Ka]:s.REPEAT,[cn]:s.CLAMP_TO_EDGE,[Dc]:s.MIRRORED_REPEAT},J={[se]:s.NEAREST,[Tl]:s.NEAREST_MIPMAP_NEAREST,[Rr]:s.NEAREST_MIPMAP_LINEAR,[je]:s.LINEAR,[Yp]:s.LINEAR_MIPMAP_NEAREST,[ls]:s.LINEAR_MIPMAP_LINEAR},ot={[a0]:s.NEVER,[f0]:s.ALWAYS,[r0]:s.LESS,[Nf]:s.LEQUAL,[c0]:s.EQUAL,[u0]:s.GEQUAL,[l0]:s.GREATER,[h0]:s.NOTEQUAL};function Y(P,L,F){if(F?(s.texParameteri(P,s.TEXTURE_WRAP_S,H[L.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,H[L.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,H[L.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,J[L.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,J[L.minFilter])):(s.texParameteri(P,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(P,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(L.wrapS!==cn||L.wrapT!==cn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(P,s.TEXTURE_MAG_FILTER,S(L.magFilter)),s.texParameteri(P,s.TEXTURE_MIN_FILTER,S(L.minFilter)),L.minFilter!==se&&L.minFilter!==je&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),L.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,ot[L.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const G=t.get("EXT_texture_filter_anisotropic");if(L.magFilter===se||L.minFilter!==Rr&&L.minFilter!==ls||L.type===gi&&t.has("OES_texture_float_linear")===!1||r===!1&&L.type===Ui&&t.has("OES_texture_half_float_linear")===!1)return;(L.anisotropy>1||n.get(L).__currentAnisotropy)&&(s.texParameterf(P,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(L.anisotropy,i.getMaxAnisotropy())),n.get(L).__currentAnisotropy=L.anisotropy)}}function nt(P,L){let F=!1;P.__webglInit===void 0&&(P.__webglInit=!0,L.addEventListener("dispose",E));const G=L.source;let Q=f.get(G);Q===void 0&&(Q={},f.set(G,Q));const V=z(L);if(V!==P.__cacheKey){Q[V]===void 0&&(Q[V]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,F=!0),Q[V].usedTimes++;const et=Q[P.__cacheKey];et!==void 0&&(Q[P.__cacheKey].usedTimes--,et.usedTimes===0&&_(L)),P.__cacheKey=V,P.__webglTexture=Q[V].texture}return F}function ct(P,L,F){let G=s.TEXTURE_2D;(L.isDataArrayTexture||L.isCompressedArrayTexture)&&(G=s.TEXTURE_2D_ARRAY),L.isData3DTexture&&(G=s.TEXTURE_3D);const Q=nt(P,L),V=L.source;e.bindTexture(G,P.__webglTexture,s.TEXTURE0+F);const et=n.get(V);if(V.version!==et.__version||Q===!0){e.activeTexture(s.TEXTURE0+F);const st=le.getPrimaries(le.workingColorSpace),gt=L.colorSpace===Pn?null:le.getPrimaries(L.colorSpace),_t=L.colorSpace===Pn||st===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,L.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,L.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const Yt=p(L)&&m(L.image)===!1;let ht=v(L.image,Yt,!1,i.maxTextureSize);ht=ut(L,ht);const oe=m(ht)||r,$=o.convert(L.format,L.colorSpace);let kt=o.convert(L.type),At=b(L.internalFormat,$,kt,L.colorSpace,L.isVideoTexture);Y(G,L,oe);let vt;const Wt=L.mipmaps,ee=r&&L.isVideoTexture!==!0&&At!==Uf,he=et.__version===void 0||Q===!0,Ot=y(L,ht,oe);if(L.isDepthTexture)At=s.DEPTH_COMPONENT,r?L.type===gi?At=s.DEPTH_COMPONENT32F:L.type===mi?At=s.DEPTH_COMPONENT24:L.type===as?At=s.DEPTH24_STENCIL8:At=s.DEPTH_COMPONENT16:L.type===gi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),L.format===rs&&At===s.DEPTH_COMPONENT&&L.type!==Zc&&L.type!==mi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),L.type=mi,kt=o.convert(L.type)),L.format===Zs&&At===s.DEPTH_COMPONENT&&(At=s.DEPTH_STENCIL,L.type!==as&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),L.type=as,kt=o.convert(L.type))),he&&(ee?e.texStorage2D(s.TEXTURE_2D,1,At,ht.width,ht.height):e.texImage2D(s.TEXTURE_2D,0,At,ht.width,ht.height,0,$,kt,null));else if(L.isDataTexture)if(Wt.length>0&&oe){ee&&he&&e.texStorage2D(s.TEXTURE_2D,Ot,At,Wt[0].width,Wt[0].height);for(let rt=0,U=Wt.length;rt<U;rt++)vt=Wt[rt],ee?e.texSubImage2D(s.TEXTURE_2D,rt,0,0,vt.width,vt.height,$,kt,vt.data):e.texImage2D(s.TEXTURE_2D,rt,At,vt.width,vt.height,0,$,kt,vt.data);L.generateMipmaps=!1}else ee?(he&&e.texStorage2D(s.TEXTURE_2D,Ot,At,ht.width,ht.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,ht.width,ht.height,$,kt,ht.data)):e.texImage2D(s.TEXTURE_2D,0,At,ht.width,ht.height,0,$,kt,ht.data);else if(L.isCompressedTexture)if(L.isCompressedArrayTexture){ee&&he&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ot,At,Wt[0].width,Wt[0].height,ht.depth);for(let rt=0,U=Wt.length;rt<U;rt++)vt=Wt[rt],L.format!==De?$!==null?ee?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,rt,0,0,0,vt.width,vt.height,ht.depth,$,vt.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,rt,At,vt.width,vt.height,ht.depth,0,vt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ee?e.texSubImage3D(s.TEXTURE_2D_ARRAY,rt,0,0,0,vt.width,vt.height,ht.depth,$,kt,vt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,rt,At,vt.width,vt.height,ht.depth,0,$,kt,vt.data)}else{ee&&he&&e.texStorage2D(s.TEXTURE_2D,Ot,At,Wt[0].width,Wt[0].height);for(let rt=0,U=Wt.length;rt<U;rt++)vt=Wt[rt],L.format!==De?$!==null?ee?e.compressedTexSubImage2D(s.TEXTURE_2D,rt,0,0,vt.width,vt.height,$,vt.data):e.compressedTexImage2D(s.TEXTURE_2D,rt,At,vt.width,vt.height,0,vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ee?e.texSubImage2D(s.TEXTURE_2D,rt,0,0,vt.width,vt.height,$,kt,vt.data):e.texImage2D(s.TEXTURE_2D,rt,At,vt.width,vt.height,0,$,kt,vt.data)}else if(L.isDataArrayTexture)ee?(he&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ot,At,ht.width,ht.height,ht.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ht.width,ht.height,ht.depth,$,kt,ht.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,At,ht.width,ht.height,ht.depth,0,$,kt,ht.data);else if(L.isData3DTexture)ee?(he&&e.texStorage3D(s.TEXTURE_3D,Ot,At,ht.width,ht.height,ht.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ht.width,ht.height,ht.depth,$,kt,ht.data)):e.texImage3D(s.TEXTURE_3D,0,At,ht.width,ht.height,ht.depth,0,$,kt,ht.data);else if(L.isFramebufferTexture){if(he)if(ee)e.texStorage2D(s.TEXTURE_2D,Ot,At,ht.width,ht.height);else{let rt=ht.width,U=ht.height;for(let ft=0;ft<Ot;ft++)e.texImage2D(s.TEXTURE_2D,ft,At,rt,U,0,$,kt,null),rt>>=1,U>>=1}}else if(Wt.length>0&&oe){ee&&he&&e.texStorage2D(s.TEXTURE_2D,Ot,At,Wt[0].width,Wt[0].height);for(let rt=0,U=Wt.length;rt<U;rt++)vt=Wt[rt],ee?e.texSubImage2D(s.TEXTURE_2D,rt,0,0,$,kt,vt):e.texImage2D(s.TEXTURE_2D,rt,At,$,kt,vt);L.generateMipmaps=!1}else ee?(he&&e.texStorage2D(s.TEXTURE_2D,Ot,At,ht.width,ht.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,$,kt,ht)):e.texImage2D(s.TEXTURE_2D,0,At,$,kt,ht);x(L,oe)&&w(G),et.__version=V.version,L.onUpdate&&L.onUpdate(L)}P.__version=L.version}function mt(P,L,F){if(L.image.length!==6)return;const G=nt(P,L),Q=L.source;e.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+F);const V=n.get(Q);if(Q.version!==V.__version||G===!0){e.activeTexture(s.TEXTURE0+F);const et=le.getPrimaries(le.workingColorSpace),st=L.colorSpace===Pn?null:le.getPrimaries(L.colorSpace),gt=L.colorSpace===Pn||et===st?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,L.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,L.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const _t=L.isCompressedTexture||L.image[0].isCompressedTexture,Yt=L.image[0]&&L.image[0].isDataTexture,ht=[];for(let rt=0;rt<6;rt++)!_t&&!Yt?ht[rt]=v(L.image[rt],!1,!0,i.maxCubemapSize):ht[rt]=Yt?L.image[rt].image:L.image[rt],ht[rt]=ut(L,ht[rt]);const oe=ht[0],$=m(oe)||r,kt=o.convert(L.format,L.colorSpace),At=o.convert(L.type),vt=b(L.internalFormat,kt,At,L.colorSpace),Wt=r&&L.isVideoTexture!==!0,ee=V.__version===void 0||G===!0;let he=y(L,oe,$);Y(s.TEXTURE_CUBE_MAP,L,$);let Ot;if(_t){Wt&&ee&&e.texStorage2D(s.TEXTURE_CUBE_MAP,he,vt,oe.width,oe.height);for(let rt=0;rt<6;rt++){Ot=ht[rt].mipmaps;for(let U=0;U<Ot.length;U++){const ft=Ot[U];L.format!==De?kt!==null?Wt?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,U,0,0,ft.width,ft.height,kt,ft.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,U,vt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Wt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,U,0,0,ft.width,ft.height,kt,At,ft.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,U,vt,ft.width,ft.height,0,kt,At,ft.data)}}}else{Ot=L.mipmaps,Wt&&ee&&(Ot.length>0&&he++,e.texStorage2D(s.TEXTURE_CUBE_MAP,he,vt,ht[0].width,ht[0].height));for(let rt=0;rt<6;rt++)if(Yt){Wt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,ht[rt].width,ht[rt].height,kt,At,ht[rt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,vt,ht[rt].width,ht[rt].height,0,kt,At,ht[rt].data);for(let U=0;U<Ot.length;U++){const dt=Ot[U].image[rt].image;Wt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,U+1,0,0,dt.width,dt.height,kt,At,dt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,U+1,vt,dt.width,dt.height,0,kt,At,dt.data)}}else{Wt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,kt,At,ht[rt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,vt,kt,At,ht[rt]);for(let U=0;U<Ot.length;U++){const ft=Ot[U];Wt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,U+1,0,0,kt,At,ft.image[rt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+rt,U+1,vt,kt,At,ft.image[rt])}}}x(L,$)&&w(s.TEXTURE_CUBE_MAP),V.__version=Q.version,L.onUpdate&&L.onUpdate(L)}P.__version=L.version}function St(P,L,F,G,Q,V){const et=o.convert(F.format,F.colorSpace),st=o.convert(F.type),gt=b(F.internalFormat,et,st,F.colorSpace);if(!n.get(L).__hasExternalTextures){const Yt=Math.max(1,L.width>>V),ht=Math.max(1,L.height>>V);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?e.texImage3D(Q,V,gt,Yt,ht,L.depth,0,et,st,null):e.texImage2D(Q,V,gt,Yt,ht,0,et,st,null)}e.bindFramebuffer(s.FRAMEBUFFER,P),Z(L)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,G,Q,n.get(F).__webglTexture,0,Ft(L)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,G,Q,n.get(F).__webglTexture,V),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Tt(P,L,F){if(s.bindRenderbuffer(s.RENDERBUFFER,P),L.depthBuffer&&!L.stencilBuffer){let G=r===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(F||Z(L)){const Q=L.depthTexture;Q&&Q.isDepthTexture&&(Q.type===gi?G=s.DEPTH_COMPONENT32F:Q.type===mi&&(G=s.DEPTH_COMPONENT24));const V=Ft(L);Z(L)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,V,G,L.width,L.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,V,G,L.width,L.height)}else s.renderbufferStorage(s.RENDERBUFFER,G,L.width,L.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,P)}else if(L.depthBuffer&&L.stencilBuffer){const G=Ft(L);F&&Z(L)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,G,s.DEPTH24_STENCIL8,L.width,L.height):Z(L)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,G,s.DEPTH24_STENCIL8,L.width,L.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,P)}else{const G=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let Q=0;Q<G.length;Q++){const V=G[Q],et=o.convert(V.format,V.colorSpace),st=o.convert(V.type),gt=b(V.internalFormat,et,st,V.colorSpace),_t=Ft(L);F&&Z(L)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,_t,gt,L.width,L.height):Z(L)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,_t,gt,L.width,L.height):s.renderbufferStorage(s.RENDERBUFFER,gt,L.width,L.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Rt(P,L){if(L&&L.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,P),!(L.depthTexture&&L.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(L.depthTexture).__webglTexture||L.depthTexture.image.width!==L.width||L.depthTexture.image.height!==L.height)&&(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),I(L.depthTexture,0);const G=n.get(L.depthTexture).__webglTexture,Q=Ft(L);if(L.depthTexture.format===rs)Z(L)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,G,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,G,0);else if(L.depthTexture.format===Zs)Z(L)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,G,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,G,0);else throw new Error("Unknown depthTexture format")}function yt(P){const L=n.get(P),F=P.isWebGLCubeRenderTarget===!0;if(P.depthTexture&&!L.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Rt(L.__webglFramebuffer,P)}else if(F){L.__webglDepthbuffer=[];for(let G=0;G<6;G++)e.bindFramebuffer(s.FRAMEBUFFER,L.__webglFramebuffer[G]),L.__webglDepthbuffer[G]=s.createRenderbuffer(),Tt(L.__webglDepthbuffer[G],P,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,L.__webglFramebuffer),L.__webglDepthbuffer=s.createRenderbuffer(),Tt(L.__webglDepthbuffer,P,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function It(P,L,F){const G=n.get(P);L!==void 0&&St(G.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),F!==void 0&&yt(P)}function X(P){const L=P.texture,F=n.get(P),G=n.get(L);P.addEventListener("dispose",T),P.isWebGLMultipleRenderTargets!==!0&&(G.__webglTexture===void 0&&(G.__webglTexture=s.createTexture()),G.__version=L.version,a.memory.textures++);const Q=P.isWebGLCubeRenderTarget===!0,V=P.isWebGLMultipleRenderTargets===!0,et=m(P)||r;if(Q){F.__webglFramebuffer=[];for(let st=0;st<6;st++)if(r&&L.mipmaps&&L.mipmaps.length>0){F.__webglFramebuffer[st]=[];for(let gt=0;gt<L.mipmaps.length;gt++)F.__webglFramebuffer[st][gt]=s.createFramebuffer()}else F.__webglFramebuffer[st]=s.createFramebuffer()}else{if(r&&L.mipmaps&&L.mipmaps.length>0){F.__webglFramebuffer=[];for(let st=0;st<L.mipmaps.length;st++)F.__webglFramebuffer[st]=s.createFramebuffer()}else F.__webglFramebuffer=s.createFramebuffer();if(V)if(i.drawBuffers){const st=P.texture;for(let gt=0,_t=st.length;gt<_t;gt++){const Yt=n.get(st[gt]);Yt.__webglTexture===void 0&&(Yt.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&P.samples>0&&Z(P)===!1){const st=V?L:[L];F.__webglMultisampledFramebuffer=s.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let gt=0;gt<st.length;gt++){const _t=st[gt];F.__webglColorRenderbuffer[gt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,F.__webglColorRenderbuffer[gt]);const Yt=o.convert(_t.format,_t.colorSpace),ht=o.convert(_t.type),oe=b(_t.internalFormat,Yt,ht,_t.colorSpace,P.isXRRenderTarget===!0),$=Ft(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,$,oe,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.RENDERBUFFER,F.__webglColorRenderbuffer[gt])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(F.__webglDepthRenderbuffer=s.createRenderbuffer(),Tt(F.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){e.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture),Y(s.TEXTURE_CUBE_MAP,L,et);for(let st=0;st<6;st++)if(r&&L.mipmaps&&L.mipmaps.length>0)for(let gt=0;gt<L.mipmaps.length;gt++)St(F.__webglFramebuffer[st][gt],P,L,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+st,gt);else St(F.__webglFramebuffer[st],P,L,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0);x(L,et)&&w(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(V){const st=P.texture;for(let gt=0,_t=st.length;gt<_t;gt++){const Yt=st[gt],ht=n.get(Yt);e.bindTexture(s.TEXTURE_2D,ht.__webglTexture),Y(s.TEXTURE_2D,Yt,et),St(F.__webglFramebuffer,P,Yt,s.COLOR_ATTACHMENT0+gt,s.TEXTURE_2D,0),x(Yt,et)&&w(s.TEXTURE_2D)}e.unbindTexture()}else{let st=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(r?st=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(st,G.__webglTexture),Y(st,L,et),r&&L.mipmaps&&L.mipmaps.length>0)for(let gt=0;gt<L.mipmaps.length;gt++)St(F.__webglFramebuffer[gt],P,L,s.COLOR_ATTACHMENT0,st,gt);else St(F.__webglFramebuffer,P,L,s.COLOR_ATTACHMENT0,st,0);x(L,et)&&w(st),e.unbindTexture()}P.depthBuffer&&yt(P)}function fe(P){const L=m(P)||r,F=P.isWebGLMultipleRenderTargets===!0?P.texture:[P.texture];for(let G=0,Q=F.length;G<Q;G++){const V=F[G];if(x(V,L)){const et=P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,st=n.get(V).__webglTexture;e.bindTexture(et,st),w(et),e.unbindTexture()}}}function Lt(P){if(r&&P.samples>0&&Z(P)===!1){const L=P.isWebGLMultipleRenderTargets?P.texture:[P.texture],F=P.width,G=P.height;let Q=s.COLOR_BUFFER_BIT;const V=[],et=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,st=n.get(P),gt=P.isWebGLMultipleRenderTargets===!0;if(gt)for(let _t=0;_t<L.length;_t++)e.bindFramebuffer(s.FRAMEBUFFER,st.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+_t,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,st.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+_t,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,st.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,st.__webglFramebuffer);for(let _t=0;_t<L.length;_t++){V.push(s.COLOR_ATTACHMENT0+_t),P.depthBuffer&&V.push(et);const Yt=st.__ignoreDepthValues!==void 0?st.__ignoreDepthValues:!1;if(Yt===!1&&(P.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),gt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,st.__webglColorRenderbuffer[_t]),Yt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[et]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[et])),gt){const ht=n.get(L[_t]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ht,0)}s.blitFramebuffer(0,0,F,G,0,0,F,G,Q,s.NEAREST),l&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,V)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),gt)for(let _t=0;_t<L.length;_t++){e.bindFramebuffer(s.FRAMEBUFFER,st.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+_t,s.RENDERBUFFER,st.__webglColorRenderbuffer[_t]);const Yt=n.get(L[_t]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,st.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+_t,s.TEXTURE_2D,Yt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,st.__webglMultisampledFramebuffer)}}function Ft(P){return Math.min(i.maxSamples,P.samples)}function Z(P){const L=n.get(P);return r&&P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&L.__useRenderToTexture!==!1}function lt(P){const L=a.render.frame;h.get(P)!==L&&(h.set(P,L),P.update())}function ut(P,L){const F=P.colorSpace,G=P.format,Q=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||P.format===kc||F!==Mi&&F!==Pn&&(le.getTransfer(F)===de?r===!1?t.has("EXT_sRGB")===!0&&G===De?(P.format=kc,P.minFilter=je,P.generateMipmaps=!1):L=Bf.sRGBToLinear(L):(G!==De||Q!==ge)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),L}this.allocateTextureUnit=C,this.resetTextureUnits=D,this.setTexture2D=I,this.setTexture2DArray=O,this.setTexture3D=N,this.setTextureCube=j,this.rebindTextures=It,this.setupRenderTarget=X,this.updateRenderTargetMipmap=fe,this.updateMultisampleRenderTarget=Lt,this.setupDepthRenderbuffer=yt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=Z}function Ax(s,t,e){const n=e.isWebGL2;function i(o,a=Pn){let r;const c=le.getTransfer(a);if(o===ge)return s.UNSIGNED_BYTE;if(o===Lf)return s.UNSIGNED_SHORT_4_4_4_4;if(o===Pf)return s.UNSIGNED_SHORT_5_5_5_1;if(o===Kp)return s.BYTE;if(o===Zp)return s.SHORT;if(o===Zc)return s.UNSIGNED_SHORT;if(o===Rf)return s.INT;if(o===mi)return s.UNSIGNED_INT;if(o===gi)return s.FLOAT;if(o===Ui)return n?s.HALF_FLOAT:(r=t.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(o===Jp)return s.ALPHA;if(o===De)return s.RGBA;if(o===Qp)return s.LUMINANCE;if(o===t0)return s.LUMINANCE_ALPHA;if(o===rs)return s.DEPTH_COMPONENT;if(o===Zs)return s.DEPTH_STENCIL;if(o===kc)return r=t.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(o===Ni)return s.RED;if(o===Df)return s.RED_INTEGER;if(o===kf)return s.RG;if(o===zf)return s.RG_INTEGER;if(o===If)return s.RGBA_INTEGER;if(o===Lr||o===Pr||o===Dr||o===kr)if(c===de)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(o===Lr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===Pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===Dr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(o===Lr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===Pr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===Dr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===kr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===Cl||o===Rl||o===Ll||o===Pl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(o===Cl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===Rl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===Ll)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===Pl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Uf)return r=t.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===Dl||o===kl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(o===Dl)return c===de?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(o===kl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===zl||o===Il||o===Ul||o===Fl||o===Nl||o===Ol||o===Bl||o===Wl||o===Gl||o===Hl||o===Vl||o===$l||o===jl||o===Xl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(o===zl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===Il)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===Ul)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===Fl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===Nl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===Ol)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===Bl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===Wl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===Gl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===Hl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===Vl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===$l)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===jl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===Xl)return c===de?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===zr||o===ql||o===Yl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(o===zr)return c===de?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===ql)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===Yl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===e0||o===Kl||o===Zl||o===Jl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(o===zr)return r.COMPRESSED_RED_RGTC1_EXT;if(o===Kl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===Zl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===Jl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===as?n?s.UNSIGNED_INT_24_8:(r=t.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):s[o]!==void 0?s[o]:null}return{convert:i}}class Tx extends _n{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ne extends mn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Cx={type:"move"};class ic{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ne,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ne,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ne,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,o=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&o!==null&&(i=o),i!==null&&(r.matrix.fromArray(i.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,i.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(i.linearVelocity)):r.hasLinearVelocity=!1,i.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(i.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Cx)))}return r!==null&&(r.visible=i!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ne;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Rx extends to{constructor(t,e){super();const n=this;let i=null,o=1,a=null,r="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null;const v=e.getContextAttributes();let m=null,p=null;const x=[],w=[],b=new Ht;let y=null;const S=new _n;S.layers.enable(1),S.viewport=new te;const E=new _n;E.layers.enable(2),E.viewport=new te;const T=[S,E],M=new Tx;M.layers.enable(1),M.layers.enable(2);let _=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let nt=x[Y];return nt===void 0&&(nt=new ic,x[Y]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Y){let nt=x[Y];return nt===void 0&&(nt=new ic,x[Y]=nt),nt.getGripSpace()},this.getHand=function(Y){let nt=x[Y];return nt===void 0&&(nt=new ic,x[Y]=nt),nt.getHandSpace()};function R(Y){const nt=w.indexOf(Y.inputSource);if(nt===-1)return;const ct=x[nt];ct!==void 0&&(ct.update(Y.inputSource,Y.frame,l||a),ct.dispatchEvent({type:Y.type,data:Y.inputSource}))}function D(){i.removeEventListener("select",R),i.removeEventListener("selectstart",R),i.removeEventListener("selectend",R),i.removeEventListener("squeeze",R),i.removeEventListener("squeezestart",R),i.removeEventListener("squeezeend",R),i.removeEventListener("end",D),i.removeEventListener("inputsourceschange",C);for(let Y=0;Y<x.length;Y++){const nt=w[Y];nt!==null&&(w[Y]=null,x[Y].disconnect(nt))}_=null,A=null,t.setRenderTarget(m),d=null,f=null,u=null,i=null,p=null,ot.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(m=t.getRenderTarget(),i.addEventListener("select",R),i.addEventListener("selectstart",R),i.addEventListener("selectend",R),i.addEventListener("squeeze",R),i.addEventListener("squeezestart",R),i.addEventListener("squeezeend",R),i.addEventListener("end",D),i.addEventListener("inputsourceschange",C),v.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(b),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const nt={antialias:i.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(i,e,nt),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new ti(d.framebufferWidth,d.framebufferHeight,{format:De,type:ge,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let nt=null,ct=null,mt=null;v.depth&&(mt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=v.stencil?Zs:rs,ct=v.stencil?as:mi);const St={colorFormat:e.RGBA8,depthFormat:mt,scaleFactor:o};u=new XRWebGLBinding(i,e),f=u.createProjectionLayer(St),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),p=new ti(f.textureWidth,f.textureHeight,{format:De,type:ge,depthTexture:new sl(f.textureWidth,f.textureHeight,ct,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});const Tt=t.properties.get(p);Tt.__ignoreDepthValues=f.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(r),ot.setContext(i),ot.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function C(Y){for(let nt=0;nt<Y.removed.length;nt++){const ct=Y.removed[nt],mt=w.indexOf(ct);mt>=0&&(w[mt]=null,x[mt].disconnect(ct))}for(let nt=0;nt<Y.added.length;nt++){const ct=Y.added[nt];let mt=w.indexOf(ct);if(mt===-1){for(let Tt=0;Tt<x.length;Tt++)if(Tt>=w.length){w.push(ct),mt=Tt;break}else if(w[Tt]===null){w[Tt]=ct,mt=Tt;break}if(mt===-1)break}const St=x[mt];St&&St.connect(ct)}}const z=new W,I=new W;function O(Y,nt,ct){z.setFromMatrixPosition(nt.matrixWorld),I.setFromMatrixPosition(ct.matrixWorld);const mt=z.distanceTo(I),St=nt.projectionMatrix.elements,Tt=ct.projectionMatrix.elements,Rt=St[14]/(St[10]-1),yt=St[14]/(St[10]+1),It=(St[9]+1)/St[5],X=(St[9]-1)/St[5],fe=(St[8]-1)/St[0],Lt=(Tt[8]+1)/Tt[0],Ft=Rt*fe,Z=Rt*Lt,lt=mt/(-fe+Lt),ut=lt*-fe;nt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ut),Y.translateZ(lt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert();const P=Rt+lt,L=yt+lt,F=Ft-ut,G=Z+(mt-ut),Q=It*yt/L*P,V=X*yt/L*P;Y.projectionMatrix.makePerspective(F,G,Q,V,P,L),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}function N(Y,nt){nt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(nt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;M.near=E.near=S.near=Y.near,M.far=E.far=S.far=Y.far,(_!==M.near||A!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),_=M.near,A=M.far);const nt=Y.parent,ct=M.cameras;N(M,nt);for(let mt=0;mt<ct.length;mt++)N(ct[mt],nt);ct.length===2?O(M,S,E):M.projectionMatrix.copy(S.projectionMatrix),j(Y,M,nt)};function j(Y,nt,ct){ct===null?Y.matrix.copy(nt.matrixWorld):(Y.matrix.copy(ct.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(nt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Uo*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(Y){c=Y,f!==null&&(f.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)};let H=null;function J(Y,nt){if(h=nt.getViewerPose(l||a),g=nt,h!==null){const ct=h.views;d!==null&&(t.setRenderTargetFramebuffer(p,d.framebuffer),t.setRenderTarget(p));let mt=!1;ct.length!==M.cameras.length&&(M.cameras.length=0,mt=!0);for(let St=0;St<ct.length;St++){const Tt=ct[St];let Rt=null;if(d!==null)Rt=d.getViewport(Tt);else{const It=u.getViewSubImage(f,Tt);Rt=It.viewport,St===0&&(t.setRenderTargetTextures(p,It.colorTexture,f.ignoreDepthValues?void 0:It.depthStencilTexture),t.setRenderTarget(p))}let yt=T[St];yt===void 0&&(yt=new _n,yt.layers.enable(St),yt.viewport=new te,T[St]=yt),yt.matrix.fromArray(Tt.transform.matrix),yt.matrix.decompose(yt.position,yt.quaternion,yt.scale),yt.projectionMatrix.fromArray(Tt.projectionMatrix),yt.projectionMatrixInverse.copy(yt.projectionMatrix).invert(),yt.viewport.set(Rt.x,Rt.y,Rt.width,Rt.height),St===0&&(M.matrix.copy(yt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),mt===!0&&M.cameras.push(yt)}}for(let ct=0;ct<x.length;ct++){const mt=w[ct],St=x[ct];mt!==null&&St!==void 0&&St.update(mt,nt,l||a)}H&&H(Y,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}const ot=new Kf;ot.setAnimationLoop(J),this.setAnimationLoop=function(Y){H=Y},this.dispose=function(){}}}function Lx(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Xf(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,x,w,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),u(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,b)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),v(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?c(m,p,x,w):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===hn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===hn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p).envMap;if(x&&(m.envMap.value=x,m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const w=s._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*w,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,w){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=w*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===hn&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Px(s,t,e,n){let i={},o={},a=[];const r=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(x,w){const b=w.program;n.uniformBlockBinding(x,b)}function l(x,w){let b=i[x.id];b===void 0&&(g(x),b=h(x),i[x.id]=b,x.addEventListener("dispose",m));const y=w.program;n.updateUBOMapping(x,y);const S=t.render.frame;o[x.id]!==S&&(f(x),o[x.id]=S)}function h(x){const w=u();x.__bindingPointIndex=w;const b=s.createBuffer(),y=x.__size,S=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,y,S),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,w,b),b}function u(){for(let x=0;x<r;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const w=i[x.id],b=x.uniforms,y=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,w);for(let S=0,E=b.length;S<E;S++){const T=Array.isArray(b[S])?b[S]:[b[S]];for(let M=0,_=T.length;M<_;M++){const A=T[M];if(d(A,S,M,y)===!0){const R=A.__offset,D=Array.isArray(A.value)?A.value:[A.value];let C=0;for(let z=0;z<D.length;z++){const I=D[z],O=v(I);typeof I=="number"||typeof I=="boolean"?(A.__data[0]=I,s.bufferSubData(s.UNIFORM_BUFFER,R+C,A.__data)):I.isMatrix3?(A.__data[0]=I.elements[0],A.__data[1]=I.elements[1],A.__data[2]=I.elements[2],A.__data[3]=0,A.__data[4]=I.elements[3],A.__data[5]=I.elements[4],A.__data[6]=I.elements[5],A.__data[7]=0,A.__data[8]=I.elements[6],A.__data[9]=I.elements[7],A.__data[10]=I.elements[8],A.__data[11]=0):(I.toArray(A.__data,C),C+=O.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,R,A.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(x,w,b,y){const S=x.value,E=w+"_"+b;if(y[E]===void 0)return typeof S=="number"||typeof S=="boolean"?y[E]=S:y[E]=S.clone(),!0;{const T=y[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return y[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function g(x){const w=x.uniforms;let b=0;const y=16;for(let E=0,T=w.length;E<T;E++){const M=Array.isArray(w[E])?w[E]:[w[E]];for(let _=0,A=M.length;_<A;_++){const R=M[_],D=Array.isArray(R.value)?R.value:[R.value];for(let C=0,z=D.length;C<z;C++){const I=D[C],O=v(I),N=b%y;N!==0&&y-N<O.boundary&&(b+=y-N),R.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=b,b+=O.storage}}}const S=b%y;return S>0&&(b+=y-S),x.__size=b,x.__cache={},this}function v(x){const w={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(w.boundary=4,w.storage=4):x.isVector2?(w.boundary=8,w.storage=8):x.isVector3||x.isColor?(w.boundary=16,w.storage=12):x.isVector4?(w.boundary=16,w.storage=16):x.isMatrix3?(w.boundary=48,w.storage=48):x.isMatrix4?(w.boundary=64,w.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),w}function m(x){const w=x.target;w.removeEventListener("dispose",m);const b=a.indexOf(w.__bindingPointIndex);a.splice(b,1),s.deleteBuffer(i[w.id]),delete i[w.id],delete o[w.id]}function p(){for(const x in i)s.deleteBuffer(i[x]);a=[],i={},o={}}return{bind:c,update:l,dispose:p}}class nd{constructor(t={}){const{canvas:e=T0(),context:n=null,depth:i=!0,stencil:o=!0,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=a;const d=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=$e,this._useLegacyLights=!1,this.toneMapping=Ii,this.toneMappingExposure=1;const w=this;let b=!1,y=0,S=0,E=null,T=-1,M=null;const _=new te,A=new te;let R=null;const D=new Bt(0);let C=0,z=e.width,I=e.height,O=1,N=null,j=null;const H=new te(0,0,z,I),J=new te(0,0,z,I);let ot=!1;const Y=new Bi;let nt=!1,ct=!1,mt=null;const St=new ie,Tt=new Ht,Rt=new W,yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function It(){return E===null?O:1}let X=n;function fe(k,B){for(let q=0;q<k.length;q++){const tt=k[q],K=e.getContext(tt,B);if(K!==null)return K}return null}try{const k={alpha:!0,depth:i,stencil:o,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Kc}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",U,!1),e.addEventListener("webglcontextcreationerror",ft,!1),X===null){const B=["webgl2","webgl","experimental-webgl"];if(w.isWebGL1Renderer===!0&&B.shift(),X=fe(B,k),X===null)throw fe(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(k){throw console.error("THREE.WebGLRenderer: "+k.message),k}let Lt,Ft,Z,lt,ut,P,L,F,G,Q,V,et,st,gt,_t,Yt,ht,oe,$,kt,At,vt,Wt,ee;function he(){Lt=new W1(X),Ft=new I1(X,Lt,t),Lt.init(Ft),vt=new Ax(X,Lt,Ft),Z=new Sx(X,Lt,Ft),lt=new V1(X),ut=new hx,P=new Ex(X,Lt,Z,ut,Ft,vt,lt),L=new F1(w),F=new B1(w),G=new J0(X,Ft),Wt=new k1(X,Lt,G,Ft),Q=new G1(X,G,lt,Wt),V=new q1(X,Q,G,lt),$=new X1(X,Ft,P),Yt=new U1(ut),et=new lx(w,L,F,Lt,Ft,Wt,Yt),st=new Lx(w,ut),gt=new fx,_t=new xx(Lt,Ft),oe=new D1(w,L,F,Z,V,f,c),ht=new bx(w,V,Ft),ee=new Px(X,lt,Ft,Z),kt=new z1(X,Lt,lt,Ft),At=new H1(X,Lt,lt,Ft),lt.programs=et.programs,w.capabilities=Ft,w.extensions=Lt,w.properties=ut,w.renderLists=gt,w.shadowMap=ht,w.state=Z,w.info=lt}he();const Ot=new Rx(w,X);this.xr=Ot,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){const k=Lt.get("WEBGL_lose_context");k&&k.loseContext()},this.forceContextRestore=function(){const k=Lt.get("WEBGL_lose_context");k&&k.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(k){k!==void 0&&(O=k,this.setSize(z,I,!1))},this.getSize=function(k){return k.set(z,I)},this.setSize=function(k,B,q=!0){if(Ot.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=k,I=B,e.width=Math.floor(k*O),e.height=Math.floor(B*O),q===!0&&(e.style.width=k+"px",e.style.height=B+"px"),this.setViewport(0,0,k,B)},this.getDrawingBufferSize=function(k){return k.set(z*O,I*O).floor()},this.setDrawingBufferSize=function(k,B,q){z=k,I=B,O=q,e.width=Math.floor(k*q),e.height=Math.floor(B*q),this.setViewport(0,0,k,B)},this.getCurrentViewport=function(k){return k.copy(_)},this.getViewport=function(k){return k.copy(H)},this.setViewport=function(k,B,q,tt){k.isVector4?H.set(k.x,k.y,k.z,k.w):H.set(k,B,q,tt),Z.viewport(_.copy(H).multiplyScalar(O).floor())},this.getScissor=function(k){return k.copy(J)},this.setScissor=function(k,B,q,tt){k.isVector4?J.set(k.x,k.y,k.z,k.w):J.set(k,B,q,tt),Z.scissor(A.copy(J).multiplyScalar(O).floor())},this.getScissorTest=function(){return ot},this.setScissorTest=function(k){Z.setScissorTest(ot=k)},this.setOpaqueSort=function(k){N=k},this.setTransparentSort=function(k){j=k},this.getClearColor=function(k){return k.copy(oe.getClearColor())},this.setClearColor=function(){oe.setClearColor.apply(oe,arguments)},this.getClearAlpha=function(){return oe.getClearAlpha()},this.setClearAlpha=function(){oe.setClearAlpha.apply(oe,arguments)},this.clear=function(k=!0,B=!0,q=!0){let tt=0;if(k){let K=!1;if(E!==null){const Mt=E.texture.format;K=Mt===If||Mt===zf||Mt===Df}if(K){const Mt=E.texture.type,Ct=Mt===ge||Mt===mi||Mt===Zc||Mt===as||Mt===Lf||Mt===Pf,Pt=oe.getClearColor(),zt=oe.getClearAlpha(),Xt=Pt.r,Vt=Pt.g,qt=Pt.b;Ct?(d[0]=Xt,d[1]=Vt,d[2]=qt,d[3]=zt,X.clearBufferuiv(X.COLOR,0,d)):(g[0]=Xt,g[1]=Vt,g[2]=qt,g[3]=zt,X.clearBufferiv(X.COLOR,0,g))}else tt|=X.COLOR_BUFFER_BIT}B&&(tt|=X.DEPTH_BUFFER_BIT),q&&(tt|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(tt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",U,!1),e.removeEventListener("webglcontextcreationerror",ft,!1),gt.dispose(),_t.dispose(),ut.dispose(),L.dispose(),F.dispose(),V.dispose(),Wt.dispose(),ee.dispose(),et.dispose(),Ot.dispose(),Ot.removeEventListener("sessionstart",Ce),Ot.removeEventListener("sessionend",re),mt&&(mt.dispose(),mt=null),We.stop()};function rt(k){k.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const k=lt.autoReset,B=ht.enabled,q=ht.autoUpdate,tt=ht.needsUpdate,K=ht.type;he(),lt.autoReset=k,ht.enabled=B,ht.autoUpdate=q,ht.needsUpdate=tt,ht.type=K}function ft(k){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",k.statusMessage)}function dt(k){const B=k.target;B.removeEventListener("dispose",dt),Ut(B)}function Ut(k){Nt(k),ut.remove(k)}function Nt(k){const B=ut.get(k).programs;B!==void 0&&(B.forEach(function(q){et.releaseProgram(q)}),k.isShaderMaterial&&et.releaseShaderCache(k))}this.renderBufferDirect=function(k,B,q,tt,K,Mt){B===null&&(B=yt);const Ct=K.isMesh&&K.matrixWorld.determinant()<0,Pt=bt(k,B,q,tt,K);Z.setMaterial(tt,Ct);let zt=q.index,Xt=1;if(tt.wireframe===!0){if(zt=Q.getWireframeAttribute(q),zt===void 0)return;Xt=2}const Vt=q.drawRange,qt=q.attributes.position;let Ae=Vt.start*Xt,gn=(Vt.start+Vt.count)*Xt;Mt!==null&&(Ae=Math.max(Ae,Mt.start*Xt),gn=Math.min(gn,(Mt.start+Mt.count)*Xt)),zt!==null?(Ae=Math.max(Ae,0),gn=Math.min(gn,zt.count)):qt!=null&&(Ae=Math.max(Ae,0),gn=Math.min(gn,qt.count));const Ge=gn-Ae;if(Ge<0||Ge===1/0)return;Wt.setup(K,tt,Pt,q,zt);let si,xe=kt;if(zt!==null&&(si=G.get(zt),xe=At,xe.setIndex(si)),K.isMesh)tt.wireframe===!0?(Z.setLineWidth(tt.wireframeLinewidth*It()),xe.setMode(X.LINES)):xe.setMode(X.TRIANGLES);else if(K.isLine){let Jt=tt.linewidth;Jt===void 0&&(Jt=1),Z.setLineWidth(Jt*It()),K.isLineSegments?xe.setMode(X.LINES):K.isLineLoop?xe.setMode(X.LINE_LOOP):xe.setMode(X.LINE_STRIP)}else K.isPoints?xe.setMode(X.POINTS):K.isSprite&&xe.setMode(X.TRIANGLES);if(K.isBatchedMesh)xe.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else if(K.isInstancedMesh)xe.renderInstances(Ae,Ge,K.count);else if(q.isInstancedBufferGeometry){const Jt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Er=Math.min(q.instanceCount,Jt);xe.renderInstances(Ae,Ge,Er)}else xe.render(Ae,Ge)};function ne(k,B,q){k.transparent===!0&&k.side===Ln&&k.forceSinglePass===!1?(k.side=hn,k.needsUpdate=!0,ii(k,B,q),k.side=yi,k.needsUpdate=!0,ii(k,B,q),k.side=Ln):ii(k,B,q)}this.compile=function(k,B,q=null){q===null&&(q=k),m=_t.get(q),m.init(),x.push(m),q.traverseVisible(function(K){K.isLight&&K.layers.test(B.layers)&&(m.pushLight(K),K.castShadow&&m.pushShadow(K))}),k!==q&&k.traverseVisible(function(K){K.isLight&&K.layers.test(B.layers)&&(m.pushLight(K),K.castShadow&&m.pushShadow(K))}),m.setupLights(w._useLegacyLights);const tt=new Set;return k.traverse(function(K){const Mt=K.material;if(Mt)if(Array.isArray(Mt))for(let Ct=0;Ct<Mt.length;Ct++){const Pt=Mt[Ct];ne(Pt,q,K),tt.add(Pt)}else ne(Mt,q,K),tt.add(Mt)}),x.pop(),m=null,tt},this.compileAsync=function(k,B,q=null){const tt=this.compile(k,B,q);return new Promise(K=>{function Mt(){if(tt.forEach(function(Ct){ut.get(Ct).currentProgram.isReady()&&tt.delete(Ct)}),tt.size===0){K(k);return}setTimeout(Mt,10)}Lt.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let ae=null;function ve(k){ae&&ae(k)}function Ce(){We.stop()}function re(){We.start()}const We=new Kf;We.setAnimationLoop(ve),typeof self<"u"&&We.setContext(self),this.setAnimationLoop=function(k){ae=k,Ot.setAnimationLoop(k),k===null?We.stop():We.start()},Ot.addEventListener("sessionstart",Ce),Ot.addEventListener("sessionend",re),this.render=function(k,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Ot.enabled===!0&&Ot.isPresenting===!0&&(Ot.cameraAutoUpdate===!0&&Ot.updateCamera(B),B=Ot.getCamera()),k.isScene===!0&&k.onBeforeRender(w,k,B,E),m=_t.get(k,x.length),m.init(),x.push(m),St.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Y.setFromProjectionMatrix(St),ct=this.localClippingEnabled,nt=Yt.init(this.clippingPlanes,ct),v=gt.get(k,p.length),v.init(),p.push(v),En(k,B,0,w.sortObjects),v.finish(),w.sortObjects===!0&&v.sort(N,j),this.info.render.frame++,nt===!0&&Yt.beginShadows();const q=m.state.shadowsArray;if(ht.render(q,k,B),nt===!0&&Yt.endShadows(),this.info.autoReset===!0&&this.info.reset(),oe.render(v,k),m.setupLights(w._useLegacyLights),B.isArrayCamera){const tt=B.cameras;for(let K=0,Mt=tt.length;K<Mt;K++){const Ct=tt[K];oo(v,k,Ct,Ct.viewport)}}else oo(v,k,B);E!==null&&(P.updateMultisampleRenderTarget(E),P.updateRenderTargetMipmap(E)),k.isScene===!0&&k.onAfterRender(w,k,B),Wt.resetDefaultState(),T=-1,M=null,x.pop(),x.length>0?m=x[x.length-1]:m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function En(k,B,q,tt){if(k.visible===!1)return;if(k.layers.test(B.layers)){if(k.isGroup)q=k.renderOrder;else if(k.isLOD)k.autoUpdate===!0&&k.update(B);else if(k.isLight)m.pushLight(k),k.castShadow&&m.pushShadow(k);else if(k.isSprite){if(!k.frustumCulled||Y.intersectsSprite(k)){tt&&Rt.setFromMatrixPosition(k.matrixWorld).applyMatrix4(St);const Ct=V.update(k),Pt=k.material;Pt.visible&&v.push(k,Ct,Pt,q,Rt.z,null)}}else if((k.isMesh||k.isLine||k.isPoints)&&(!k.frustumCulled||Y.intersectsObject(k))){const Ct=V.update(k),Pt=k.material;if(tt&&(k.boundingSphere!==void 0?(k.boundingSphere===null&&k.computeBoundingSphere(),Rt.copy(k.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Rt.copy(Ct.boundingSphere.center)),Rt.applyMatrix4(k.matrixWorld).applyMatrix4(St)),Array.isArray(Pt)){const zt=Ct.groups;for(let Xt=0,Vt=zt.length;Xt<Vt;Xt++){const qt=zt[Xt],Ae=Pt[qt.materialIndex];Ae&&Ae.visible&&v.push(k,Ct,Ae,q,Rt.z,qt)}}else Pt.visible&&v.push(k,Ct,Pt,q,Rt.z,null)}}const Mt=k.children;for(let Ct=0,Pt=Mt.length;Ct<Pt;Ct++)En(Mt[Ct],B,q,tt)}function oo(k,B,q,tt){const K=k.opaque,Mt=k.transmissive,Ct=k.transparent;m.setupLightsView(q),nt===!0&&Yt.setGlobalState(w.clippingPlanes,q),Mt.length>0&&Dn(K,Mt,B,q),tt&&Z.viewport(_.copy(tt)),K.length>0&&fs(K,B,q),Mt.length>0&&fs(Mt,B,q),Ct.length>0&&fs(Ct,B,q),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function Dn(k,B,q,tt){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;const Mt=Ft.isWebGL2;mt===null&&(mt=new ti(1,1,{generateMipmaps:!0,type:Lt.has("EXT_color_buffer_half_float")?Ui:ge,minFilter:ls,samples:Mt?4:0})),w.getDrawingBufferSize(Tt),Mt?mt.setSize(Tt.x,Tt.y):mt.setSize(er(Tt.x),er(Tt.y));const Ct=w.getRenderTarget();w.setRenderTarget(mt),w.getClearColor(D),C=w.getClearAlpha(),C<1&&w.setClearColor(16777215,.5),w.clear();const Pt=w.toneMapping;w.toneMapping=Ii,fs(k,q,tt),P.updateMultisampleRenderTarget(mt),P.updateRenderTargetMipmap(mt);let zt=!1;for(let Xt=0,Vt=B.length;Xt<Vt;Xt++){const qt=B[Xt],Ae=qt.object,gn=qt.geometry,Ge=qt.material,si=qt.group;if(Ge.side===Ln&&Ae.layers.test(tt.layers)){const xe=Ge.side;Ge.side=hn,Ge.needsUpdate=!0,Wi(Ae,q,tt,gn,Ge,si),Ge.side=xe,Ge.needsUpdate=!0,zt=!0}}zt===!0&&(P.updateMultisampleRenderTarget(mt),P.updateRenderTargetMipmap(mt)),w.setRenderTarget(Ct),w.setClearColor(D,C),w.toneMapping=Pt}function fs(k,B,q){const tt=B.isScene===!0?B.overrideMaterial:null;for(let K=0,Mt=k.length;K<Mt;K++){const Ct=k[K],Pt=Ct.object,zt=Ct.geometry,Xt=tt===null?Ct.material:tt,Vt=Ct.group;Pt.layers.test(q.layers)&&Wi(Pt,B,q,zt,Xt,Vt)}}function Wi(k,B,q,tt,K,Mt){k.onBeforeRender(w,B,q,tt,K,Mt),k.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,k.matrixWorld),k.normalMatrix.getNormalMatrix(k.modelViewMatrix),K.onBeforeRender(w,B,q,tt,k,Mt),K.transparent===!0&&K.side===Ln&&K.forceSinglePass===!1?(K.side=hn,K.needsUpdate=!0,w.renderBufferDirect(q,B,tt,K,k,Mt),K.side=yi,K.needsUpdate=!0,w.renderBufferDirect(q,B,tt,K,k,Mt),K.side=Ln):w.renderBufferDirect(q,B,tt,K,k,Mt),k.onAfterRender(w,B,q,tt,K,Mt)}function ii(k,B,q){B.isScene!==!0&&(B=yt);const tt=ut.get(k),K=m.state.lights,Mt=m.state.shadowsArray,Ct=K.state.version,Pt=et.getParameters(k,K.state,Mt,B,q),zt=et.getProgramCacheKey(Pt);let Xt=tt.programs;tt.environment=k.isMeshStandardMaterial?B.environment:null,tt.fog=B.fog,tt.envMap=(k.isMeshStandardMaterial?F:L).get(k.envMap||tt.environment),Xt===void 0&&(k.addEventListener("dispose",dt),Xt=new Map,tt.programs=Xt);let Vt=Xt.get(zt);if(Vt!==void 0){if(tt.currentProgram===Vt&&tt.lightsStateVersion===Ct)return qo(k,Pt),Vt}else Pt.uniforms=et.getUniforms(k),k.onBuild(q,Pt,w),k.onBeforeCompile(Pt,w),Vt=et.acquireProgram(Pt,zt),Xt.set(zt,Vt),tt.uniforms=Pt.uniforms;const qt=tt.uniforms;return(!k.isShaderMaterial&&!k.isRawShaderMaterial||k.clipping===!0)&&(qt.clippingPlanes=Yt.uniform),qo(k,Pt),tt.needsLights=$t(k),tt.lightsStateVersion=Ct,tt.needsLights&&(qt.ambientLightColor.value=K.state.ambient,qt.lightProbe.value=K.state.probe,qt.directionalLights.value=K.state.directional,qt.directionalLightShadows.value=K.state.directionalShadow,qt.spotLights.value=K.state.spot,qt.spotLightShadows.value=K.state.spotShadow,qt.rectAreaLights.value=K.state.rectArea,qt.ltc_1.value=K.state.rectAreaLTC1,qt.ltc_2.value=K.state.rectAreaLTC2,qt.pointLights.value=K.state.point,qt.pointLightShadows.value=K.state.pointShadow,qt.hemisphereLights.value=K.state.hemi,qt.directionalShadowMap.value=K.state.directionalShadowMap,qt.directionalShadowMatrix.value=K.state.directionalShadowMatrix,qt.spotShadowMap.value=K.state.spotShadowMap,qt.spotLightMatrix.value=K.state.spotLightMatrix,qt.spotLightMap.value=K.state.spotLightMap,qt.pointShadowMap.value=K.state.pointShadowMap,qt.pointShadowMatrix.value=K.state.pointShadowMatrix),tt.currentProgram=Vt,tt.uniformsList=null,Vt}function Xo(k){if(k.uniformsList===null){const B=k.currentProgram.getUniforms();k.uniformsList=Wa.seqWithValue(B.seq,k.uniforms)}return k.uniformsList}function qo(k,B){const q=ut.get(k);q.outputColorSpace=B.outputColorSpace,q.batching=B.batching,q.instancing=B.instancing,q.instancingColor=B.instancingColor,q.skinning=B.skinning,q.morphTargets=B.morphTargets,q.morphNormals=B.morphNormals,q.morphColors=B.morphColors,q.morphTargetsCount=B.morphTargetsCount,q.numClippingPlanes=B.numClippingPlanes,q.numIntersection=B.numClipIntersection,q.vertexAlphas=B.vertexAlphas,q.vertexTangents=B.vertexTangents,q.toneMapping=B.toneMapping}function bt(k,B,q,tt,K){B.isScene!==!0&&(B=yt),P.resetTextureUnits();const Mt=B.fog,Ct=tt.isMeshStandardMaterial?B.environment:null,Pt=E===null?w.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Mi,zt=(tt.isMeshStandardMaterial?F:L).get(tt.envMap||Ct),Xt=tt.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Vt=!!q.attributes.tangent&&(!!tt.normalMap||tt.anisotropy>0),qt=!!q.morphAttributes.position,Ae=!!q.morphAttributes.normal,gn=!!q.morphAttributes.color;let Ge=Ii;tt.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Ge=w.toneMapping);const si=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,xe=si!==void 0?si.length:0,Jt=ut.get(tt),Er=m.state.lights;if(nt===!0&&(ct===!0||k!==M)){const An=k===M&&tt.id===T;Yt.setState(tt,k,An)}let be=!1;tt.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==Er.state.version||Jt.outputColorSpace!==Pt||K.isBatchedMesh&&Jt.batching===!1||!K.isBatchedMesh&&Jt.batching===!0||K.isInstancedMesh&&Jt.instancing===!1||!K.isInstancedMesh&&Jt.instancing===!0||K.isSkinnedMesh&&Jt.skinning===!1||!K.isSkinnedMesh&&Jt.skinning===!0||K.isInstancedMesh&&Jt.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&Jt.instancingColor===!1&&K.instanceColor!==null||Jt.envMap!==zt||tt.fog===!0&&Jt.fog!==Mt||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==Yt.numPlanes||Jt.numIntersection!==Yt.numIntersection)||Jt.vertexAlphas!==Xt||Jt.vertexTangents!==Vt||Jt.morphTargets!==qt||Jt.morphNormals!==Ae||Jt.morphColors!==gn||Jt.toneMapping!==Ge||Ft.isWebGL2===!0&&Jt.morphTargetsCount!==xe)&&(be=!0):(be=!0,Jt.__version=tt.version);let Gi=Jt.currentProgram;be===!0&&(Gi=ii(tt,B,K));let vl=!1,ao=!1,Ar=!1;const Xe=Gi.getUniforms(),Hi=Jt.uniforms;if(Z.useProgram(Gi.program)&&(vl=!0,ao=!0,Ar=!0),tt.id!==T&&(T=tt.id,ao=!0),vl||M!==k){Xe.setValue(X,"projectionMatrix",k.projectionMatrix),Xe.setValue(X,"viewMatrix",k.matrixWorldInverse);const An=Xe.map.cameraPosition;An!==void 0&&An.setValue(X,Rt.setFromMatrixPosition(k.matrixWorld)),Ft.logarithmicDepthBuffer&&Xe.setValue(X,"logDepthBufFC",2/(Math.log(k.far+1)/Math.LN2)),(tt.isMeshPhongMaterial||tt.isMeshToonMaterial||tt.isMeshLambertMaterial||tt.isMeshBasicMaterial||tt.isMeshStandardMaterial||tt.isShaderMaterial)&&Xe.setValue(X,"isOrthographic",k.isOrthographicCamera===!0),M!==k&&(M=k,ao=!0,Ar=!0)}if(K.isSkinnedMesh){Xe.setOptional(X,K,"bindMatrix"),Xe.setOptional(X,K,"bindMatrixInverse");const An=K.skeleton;An&&(Ft.floatVertexTextures?(An.boneTexture===null&&An.computeBoneTexture(),Xe.setValue(X,"boneTexture",An.boneTexture,P)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}K.isBatchedMesh&&(Xe.setOptional(X,K,"batchingTexture"),Xe.setValue(X,"batchingTexture",K._matricesTexture,P));const Tr=q.morphAttributes;if((Tr.position!==void 0||Tr.normal!==void 0||Tr.color!==void 0&&Ft.isWebGL2===!0)&&$.update(K,q,Gi),(ao||Jt.receiveShadow!==K.receiveShadow)&&(Jt.receiveShadow=K.receiveShadow,Xe.setValue(X,"receiveShadow",K.receiveShadow)),tt.isMeshGouraudMaterial&&tt.envMap!==null&&(Hi.envMap.value=zt,Hi.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),ao&&(Xe.setValue(X,"toneMappingExposure",w.toneMappingExposure),Jt.needsLights&&xt(Hi,Ar),Mt&&tt.fog===!0&&st.refreshFogUniforms(Hi,Mt),st.refreshMaterialUniforms(Hi,tt,O,I,mt),Wa.upload(X,Xo(Jt),Hi,P)),tt.isShaderMaterial&&tt.uniformsNeedUpdate===!0&&(Wa.upload(X,Xo(Jt),Hi,P),tt.uniformsNeedUpdate=!1),tt.isSpriteMaterial&&Xe.setValue(X,"center",K.center),Xe.setValue(X,"modelViewMatrix",K.modelViewMatrix),Xe.setValue(X,"normalMatrix",K.normalMatrix),Xe.setValue(X,"modelMatrix",K.matrixWorld),tt.isShaderMaterial||tt.isRawShaderMaterial){const An=tt.uniformsGroups;for(let Cr=0,Qd=An.length;Cr<Qd;Cr++)if(Ft.isWebGL2){const xl=An[Cr];ee.update(xl,Gi),ee.bind(xl,Gi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Gi}function xt(k,B){k.ambientLightColor.needsUpdate=B,k.lightProbe.needsUpdate=B,k.directionalLights.needsUpdate=B,k.directionalLightShadows.needsUpdate=B,k.pointLights.needsUpdate=B,k.pointLightShadows.needsUpdate=B,k.spotLights.needsUpdate=B,k.spotLightShadows.needsUpdate=B,k.rectAreaLights.needsUpdate=B,k.hemisphereLights.needsUpdate=B}function $t(k){return k.isMeshLambertMaterial||k.isMeshToonMaterial||k.isMeshPhongMaterial||k.isMeshStandardMaterial||k.isShadowMaterial||k.isShaderMaterial&&k.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(k,B,q){ut.get(k.texture).__webglTexture=B,ut.get(k.depthTexture).__webglTexture=q;const tt=ut.get(k);tt.__hasExternalTextures=!0,tt.__hasExternalTextures&&(tt.__autoAllocateDepthBuffer=q===void 0,tt.__autoAllocateDepthBuffer||Lt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),tt.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(k,B){const q=ut.get(k);q.__webglFramebuffer=B,q.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(k,B=0,q=0){E=k,y=B,S=q;let tt=!0,K=null,Mt=!1,Ct=!1;if(k){const zt=ut.get(k);zt.__useDefaultFramebuffer!==void 0?(Z.bindFramebuffer(X.FRAMEBUFFER,null),tt=!1):zt.__webglFramebuffer===void 0?P.setupRenderTarget(k):zt.__hasExternalTextures&&P.rebindTextures(k,ut.get(k.texture).__webglTexture,ut.get(k.depthTexture).__webglTexture);const Xt=k.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Ct=!0);const Vt=ut.get(k).__webglFramebuffer;k.isWebGLCubeRenderTarget?(Array.isArray(Vt[B])?K=Vt[B][q]:K=Vt[B],Mt=!0):Ft.isWebGL2&&k.samples>0&&P.useMultisampledRTT(k)===!1?K=ut.get(k).__webglMultisampledFramebuffer:Array.isArray(Vt)?K=Vt[q]:K=Vt,_.copy(k.viewport),A.copy(k.scissor),R=k.scissorTest}else _.copy(H).multiplyScalar(O).floor(),A.copy(J).multiplyScalar(O).floor(),R=ot;if(Z.bindFramebuffer(X.FRAMEBUFFER,K)&&Ft.drawBuffers&&tt&&Z.drawBuffers(k,K),Z.viewport(_),Z.scissor(A),Z.setScissorTest(R),Mt){const zt=ut.get(k.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+B,zt.__webglTexture,q)}else if(Ct){const zt=ut.get(k.texture),Xt=B||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,zt.__webglTexture,q||0,Xt)}T=-1},this.readRenderTargetPixels=function(k,B,q,tt,K,Mt,Ct){if(!(k&&k.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=ut.get(k).__webglFramebuffer;if(k.isWebGLCubeRenderTarget&&Ct!==void 0&&(Pt=Pt[Ct]),Pt){Z.bindFramebuffer(X.FRAMEBUFFER,Pt);try{const zt=k.texture,Xt=zt.format,Vt=zt.type;if(Xt!==De&&vt.convert(Xt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const qt=Vt===Ui&&(Lt.has("EXT_color_buffer_half_float")||Ft.isWebGL2&&Lt.has("EXT_color_buffer_float"));if(Vt!==ge&&vt.convert(Vt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Vt===gi&&(Ft.isWebGL2||Lt.has("OES_texture_float")||Lt.has("WEBGL_color_buffer_float")))&&!qt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=k.width-tt&&q>=0&&q<=k.height-K&&X.readPixels(B,q,tt,K,vt.convert(Xt),vt.convert(Vt),Mt)}finally{const zt=E!==null?ut.get(E).__webglFramebuffer:null;Z.bindFramebuffer(X.FRAMEBUFFER,zt)}}},this.copyFramebufferToTexture=function(k,B,q=0){const tt=Math.pow(2,-q),K=Math.floor(B.image.width*tt),Mt=Math.floor(B.image.height*tt);P.setTexture2D(B,0),X.copyTexSubImage2D(X.TEXTURE_2D,q,0,0,k.x,k.y,K,Mt),Z.unbindTexture()},this.copyTextureToTexture=function(k,B,q,tt=0){const K=B.image.width,Mt=B.image.height,Ct=vt.convert(q.format),Pt=vt.convert(q.type);P.setTexture2D(q,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,q.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,q.unpackAlignment),B.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,tt,k.x,k.y,K,Mt,Ct,Pt,B.image.data):B.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,tt,k.x,k.y,B.mipmaps[0].width,B.mipmaps[0].height,Ct,B.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,tt,k.x,k.y,Ct,Pt,B.image),tt===0&&q.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),Z.unbindTexture()},this.copyTextureToTexture3D=function(k,B,q,tt,K=0){if(w.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Mt=k.max.x-k.min.x+1,Ct=k.max.y-k.min.y+1,Pt=k.max.z-k.min.z+1,zt=vt.convert(tt.format),Xt=vt.convert(tt.type);let Vt;if(tt.isData3DTexture)P.setTexture3D(tt,0),Vt=X.TEXTURE_3D;else if(tt.isDataArrayTexture||tt.isCompressedArrayTexture)P.setTexture2DArray(tt,0),Vt=X.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,tt.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,tt.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,tt.unpackAlignment);const qt=X.getParameter(X.UNPACK_ROW_LENGTH),Ae=X.getParameter(X.UNPACK_IMAGE_HEIGHT),gn=X.getParameter(X.UNPACK_SKIP_PIXELS),Ge=X.getParameter(X.UNPACK_SKIP_ROWS),si=X.getParameter(X.UNPACK_SKIP_IMAGES),xe=q.isCompressedTexture?q.mipmaps[K]:q.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,xe.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,xe.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,k.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,k.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,k.min.z),q.isDataTexture||q.isData3DTexture?X.texSubImage3D(Vt,K,B.x,B.y,B.z,Mt,Ct,Pt,zt,Xt,xe.data):q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(Vt,K,B.x,B.y,B.z,Mt,Ct,Pt,zt,xe.data)):X.texSubImage3D(Vt,K,B.x,B.y,B.z,Mt,Ct,Pt,zt,Xt,xe),X.pixelStorei(X.UNPACK_ROW_LENGTH,qt),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,Ae),X.pixelStorei(X.UNPACK_SKIP_PIXELS,gn),X.pixelStorei(X.UNPACK_SKIP_ROWS,Ge),X.pixelStorei(X.UNPACK_SKIP_IMAGES,si),K===0&&tt.generateMipmaps&&X.generateMipmap(Vt),Z.unbindTexture()},this.initTexture=function(k){k.isCubeTexture?P.setTextureCube(k,0):k.isData3DTexture?P.setTexture3D(k,0):k.isDataArrayTexture||k.isCompressedArrayTexture?P.setTexture2DArray(k,0):P.setTexture2D(k,0),Z.unbindTexture()},this.resetState=function(){y=0,S=0,E=null,Z.reset(),Wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Jc?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===vr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===$e?cs:Ff}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===cs?$e:Mi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Dx extends nd{}Dx.prototype.isWebGL1Renderer=!0;class Mr extends mn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Ze extends pn{constructor(t=null,e=1,n=1,i,o,a,r,c,l=se,h=se,u,f){super(null,a,r,c,l,h,i,o,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ue extends pe{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Rs=new ie,Wh=new ie,xa=[],Gh=new Sn,kx=new ie,fo=new me,po=new Oi;class _r extends me{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ue(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,kx)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Sn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Rs),Gh.copy(t.boundingBox).applyMatrix4(Rs),this.boundingBox.union(Gh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Oi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Rs),po.copy(t.boundingSphere).applyMatrix4(Rs),this.boundingSphere.union(po)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(fo.geometry=this.geometry,fo.material=this.material,fo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),po.copy(this.boundingSphere),po.applyMatrix4(n),t.ray.intersectsSphere(po)!==!1))for(let o=0;o<i;o++){this.getMatrixAt(o,Rs),Wh.multiplyMatrices(n,Rs),fo.matrixWorld=Wh,fo.raycast(t,xa);for(let a=0,r=xa.length;a<r;a++){const c=xa[a];c.instanceId=o,c.object=this,e.push(c)}xa.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new ue(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class zx extends Ho{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Hh=new ie,Uc=new tl,wa=new Oi,ya=new W;class Ix extends mn{constructor(t=new Je,e=new zx){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,o=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wa.copy(n.boundingSphere),wa.applyMatrix4(i),wa.radius+=o,t.ray.intersectsSphere(wa)===!1)return;Hh.copy(i).invert(),Uc.copy(t.ray).applyMatrix4(Hh);const r=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,a.start),d=Math.min(l.count,a.start+a.count);for(let g=f,v=d;g<v;g++){const m=l.getX(g);ya.fromBufferAttribute(u,m),Vh(ya,m,c,i,t,e,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let g=f,v=d;g<v;g++)ya.fromBufferAttribute(u,g),Vh(ya,g,c,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=i.length;o<a;o++){const r=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}}function Vh(s,t,e,n,i,o,a){const r=Uc.distanceSqToPoint(s);if(r<e){const c=new W;Uc.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;o.push({distance:l,distanceToRay:Math.sqrt(r),point:c,index:t,face:null,object:a})}}class ol extends Je{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const o=[],a=[];r(i),l(n),h(),this.setAttribute("position",new ke(o,3)),this.setAttribute("normal",new ke(o.slice(),3)),this.setAttribute("uv",new ke(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const w=new W,b=new W,y=new W;for(let S=0;S<e.length;S+=3)d(e[S+0],w),d(e[S+1],b),d(e[S+2],y),c(w,b,y,x)}function c(x,w,b,y){const S=y+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const M=x.clone().lerp(b,T/S),_=w.clone().lerp(b,T/S),A=S-T;for(let R=0;R<=A;R++)R===0&&T===S?E[T][R]=M:E[T][R]=M.clone().lerp(_,R/A)}for(let T=0;T<S;T++)for(let M=0;M<2*(S-T)-1;M++){const _=Math.floor(M/2);M%2===0?(f(E[T][_+1]),f(E[T+1][_]),f(E[T][_])):(f(E[T][_+1]),f(E[T+1][_+1]),f(E[T+1][_]))}}function l(x){const w=new W;for(let b=0;b<o.length;b+=3)w.x=o[b+0],w.y=o[b+1],w.z=o[b+2],w.normalize().multiplyScalar(x),o[b+0]=w.x,o[b+1]=w.y,o[b+2]=w.z}function h(){const x=new W;for(let w=0;w<o.length;w+=3){x.x=o[w+0],x.y=o[w+1],x.z=o[w+2];const b=m(x)/2/Math.PI+.5,y=p(x)/Math.PI+.5;a.push(b,1-y)}g(),u()}function u(){for(let x=0;x<a.length;x+=6){const w=a[x+0],b=a[x+2],y=a[x+4],S=Math.max(w,b,y),E=Math.min(w,b,y);S>.9&&E<.1&&(w<.2&&(a[x+0]+=1),b<.2&&(a[x+2]+=1),y<.2&&(a[x+4]+=1))}}function f(x){o.push(x.x,x.y,x.z)}function d(x,w){const b=x*3;w.x=t[b+0],w.y=t[b+1],w.z=t[b+2]}function g(){const x=new W,w=new W,b=new W,y=new W,S=new Ht,E=new Ht,T=new Ht;for(let M=0,_=0;M<o.length;M+=9,_+=6){x.set(o[M+0],o[M+1],o[M+2]),w.set(o[M+3],o[M+4],o[M+5]),b.set(o[M+6],o[M+7],o[M+8]),S.set(a[_+0],a[_+1]),E.set(a[_+2],a[_+3]),T.set(a[_+4],a[_+5]),y.copy(x).add(w).add(b).divideScalar(3);const A=m(y);v(S,_+0,x,A),v(E,_+2,w,A),v(T,_+4,b,A)}}function v(x,w,b,y){y<0&&x.x===1&&(a[w]=x.x-1),b.x===0&&b.z===0&&(a[w]=y/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ol(t.vertices,t.indices,t.radius,t.details)}}class al extends ol{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new al(t.radius,t.detail)}}class io extends Je{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Ux{constructor(t,e,n=0,i=1/0){this.ray=new tl(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new el,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Fc(t,this,n,e),n.sort($h),n}intersectObjects(t,e=!0,n=[]){for(let i=0,o=t.length;i<o;i++)Fc(t[i],this,n,e);return n.sort($h),n}}function $h(s,t){return s.distance-t.distance}function Fc(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let o=0,a=i.length;o<a;o++)Fc(i[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Kc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Kc);const mo=s=>Number.isInteger(s)?s.toFixed(1):String(s),On={loi:1,pond:24,other:48,max:63},Fx=.5,id=-.6,Nx=.5625,ze=`
#define PI 3.14159265
#define NEAR_E ${mo(Io)}
#define NORMAL_E ${mo(xf)}
#define SLOTS ${jn}
#define PATCHES ${$s}
#define DIST_PATCHES ${Jn}
#define DIST_POND ${On.pond}
#define DIST_OTHER ${On.other}
#define DIST_FILL ${mo(Fx)}
#define DIST_POND_LEVEL ${mo(id)}
#define DIST_BASE ${mo(Nx)}
`,so=`
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
`,Ve=`
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
`,rl=`
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
`,jh=Array.from({length:jn},(s,t)=>t),bi=`
${rl}
${jh.map(s=>`uniform sampler2D uSlotH${s};`).join(`
`)}
float slotMetres(int s, vec2 xz) {
  // (samplers can only be picked by a constant index; the patches are laid
  // on whichever it was once, so the loop is compiled once, not per slot)
  float h = -4000.0;
${jh.map(s=>`  ${s?"else ":""}if (s == ${s}) h = rectMetres(uSlotH${s}, uSlotRect[${s}], xz);`).join(`
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
`,us=`
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
`,Ox=`
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
`,Bx=`
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
`,sd=.05,od=`
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
`,ad=`
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
`,Wx=`
${ze}
${Ve}
${rl}
${od}
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
`,Gx=`
${ze}
${so}
${Ve}
${rl}
${od}
${us}
${Ox}
${Bx}
${ad}
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
  if (metres < -${sd.toFixed(2)}) discard;
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
`,Hx=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function cl(){const s=new Je;return s.setAttribute("position",new pe(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const Vx=`
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
`;class $x{constructor(t){this.renderer=t,this.size=new Ht;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?Ui:ge,this.sceneRT=new ti(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new sl(1,1,mi),this.quad=new me(cl(),new Ee({vertexShader:Hx,fragmentShader:Vx,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Ht},uInvProj:{value:new ie},uCamWorld:{value:new ie},uCamPos:{value:new W},uSunDir:{value:new W(0,1,0)},uSunColor:{value:new Bt},uFogColor:{value:new Bt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Mr,this.quadScene.add(this.quad),this.quadCam=new wr(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const jx=`
${ze}
${Ve}
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
`;class Xx{constructor(t,e=1024,n=jx){const{W:i,H:o}=t,a=Math.min(1,e/Math.max(i,o)),r=Math.max(16,Math.round(i*a)),c=Math.max(16,Math.round(o*a));this.terrain=t,this.rt=new ti(r,c,{type:ge,format:Ni,depthBuffer:!1,minFilter:je,magFilter:je});const l=t.pack.rect;this.uniforms={...t.uniforms,uSunDir:{value:new W(0,1,0)},uStep:{value:Math.max((l.x1-l.x0)/r,(l.z1-l.z0)/c)},uTop:{value:1}},this.material=new Ee({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:n,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new Mr;const h=new me(cl(),this.material);h.frustumCulled=!1,this.scene.add(h),this.cam=new wr(-1,1,1,-1,0,1),this.h=c,this.strips=4,this.strip=-1,this.drawn={sun:new W(0,-2,0),vert:-1,k:-1}}get texture(){return this.rt.texture}update(t,e,n,i,o){const a=this.uniforms,r=this.drawn;if(this.strip<0){if(!(e.angleTo(r.sun)>.004||Math.abs(n-r.vert)>r.vert*.015||Math.abs(i-r.k)>.03))return;if(a.uSunDir.value.copy(e),a.uTop.value=o,r.sun.copy(e),r.vert=n,r.k=i,!this.ever)return this.ever=!0,this.draw(t,-1);this.strip=0}this.draw(t,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e){const n=this.rt;if(e>=0){const o=Math.ceil(this.h/this.strips);n.scissor.set(0,e*o,n.width,o),n.scissorTest=!0}else n.scissorTest=!1;const i=t.getRenderTarget();t.setRenderTarget(n),t.render(this.scene,this.cam),t.setRenderTarget(i),n.scissorTest=!1}dispose(){this.rt.dispose(),this.material.dispose()}}const sc=32,Xh=1600,qh=-.5;function rd(s,t,e){const n=new Ze(s,t,e,Ni,gi);return n.minFilter=se,n.magFilter=se,n.wrapS=n.wrapT=cn,n.needsUpdate=!0,n}function Yh(s,t,e,n=1){const i=new Ze(s,t,e,De,ge);return i.minFilter=ls,i.magFilter=je,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=cn,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class Nc{constructor(t,e,n=null,i={}){this.pack=t,this.world=e;const o=t.data,{W:a,H:r}=t,{x0:c,z0:l,x1:h,z1:u}=t.rect;this.rect=new te(c,l,h,u),this.heights=o.metres,this.W=a,this.H=r;const f=e.app.renderer.capabilities.getMaxAnisotropy();this.heightTex=rd(o.metres,a,r),this.normalTex=Yh(o.normals,a,r,Math.min(8,f)),this.landTex=Yh(o.land,a,r,Math.min(4,f)),o.normals=null,o.land=null;const d=Math.max((h-c)/a,(u-l)/r);this.texel=d;const g=Math.max(h-c,u-l);this.levels=Math.max(1,Math.ceil(Math.log2(g/(sc*d)))+1),this.leafSize=g/2**(this.levels-1),this.buildMinMax(Array.isArray(n)?n:n?[n]:[]),this.full=this.makeGrid(sc),this.half=this.makeGrid(sc/2),this.morph=[];for(let p=0;p<12;p++)this.morph.push(new Ht);const v=e.uniforms,m=(Array.isArray(n)?null:n)||e.arch||this;this.uniforms={...v,uOwnH:{value:this.heightTex},uOwnRect:{value:this.rect},uOwnN:{value:this.normalTex},uOwnL:{value:this.landTex},uArchN:{value:m.normalTex},uArchL:{value:m.landTex},uOwnS:{value:null},uOwnLandA:{value:null},uOwnLandB:{value:null},uSelf:{value:-1},uOwnRain:{value:n&&!t.rainUrl?0:1},uMorph:{value:this.morph},uCamPos:{value:new W},uKau:{value:.5},uDebug:{value:0},...i.uniforms},this.group=new Ne;for(const p of[this.full,this.half])p.material=new Ee({vertexShader:i.vertexShader||Wx,fragmentShader:i.fragmentShader||Gx,uniforms:{...this.uniforms,uGrid:{value:p.dim}}}),p.mesh=new me(p.geometry,p.material),p.mesh.frustumCulled=!1,p.mesh.matrixAutoUpdate=!1,this.group.add(p.mesh);this.shadow=new Xx(this,i.shadowSize,i.shadowFragment),this.uniforms.uOwnS.value=this.shadow.texture,this._frustum=new Bi,this._m=new ie,this._box=new Sn,this.rangeK=3.5,this.applyRange(this.rangeK)}makeGrid(t){const e=new io,n=new Float32Array((t+1)*(t+1)*3);for(let r=0;r<=t;r++)for(let c=0;c<=t;c++){const l=(r*(t+1)+c)*3;n[l]=c/t,n[l+2]=r/t}const i=[];for(let r=0;r<t;r++)for(let c=0;c<t;c++){const l=r*(t+1)+c,h=l+1,u=l+t+1,f=u+1;c+r&1?i.push(l,u,h,h,u,f):i.push(l,u,f,l,f,h)}e.setIndex(i),e.setAttribute("position",new pe(n,3));const o=new Float32Array(Xh*4),a=new ue(o,4);return a.setUsage(bn),e.setAttribute("aNode",a),e.instanceCount=0,{dim:t,geometry:e,data:o,attr:a,count:0}}buildMinMax(t){const{W:e,H:n,heights:i}=this,o=this.pack.rect,a=2**(this.levels-1),r=this.leafSize,c=e/(o.x1-o.x0),l=n/(o.z1-o.z0);let h=new Float32Array(a*a).fill(1/0),u=new Float32Array(a*a).fill(-1/0);for(let d=0;d<a;d++){const g=d*r;if(g>=o.z1-o.z0)continue;const v=Math.max(0,Math.floor(g*l)-1),m=Math.min(n-1,Math.ceil((g+r)*l)+1);for(let p=0;p<a;p++){const x=p*r;if(x>=o.x1-o.x0)continue;const w=Math.max(0,Math.floor(x*c)-1),b=Math.min(e-1,Math.ceil((x+r)*c)+1);let y=1/0,S=-1/0;for(let E=v;E<=m;E++)for(let T=w;T<=b;T++){const M=i[E*e+T];M<y&&(y=M),M>S&&(S=M)}if(t.length){const E=Math.max(2,Math.round((m-v)/16));for(const T of t)for(let M=v;M<=m;M+=E)for(let _=w;_<=b;_+=E){const A=T.metresAt(o.x0+(_+.5)/c,o.z0+(M+.5)/l);A<y&&(y=A),A>S&&(S=A)}y-=40,S+=40}h[d*a+p]=y,u[d*a+p]=S}}this.mm=[{lo:h,hi:u,n:a}];let f=a;for(;f>1;){const d=f/2,g=new Float32Array(d*d),v=new Float32Array(d*d);for(let m=0;m<d;m++)for(let p=0;p<d;p++){const x=2*m*f+2*p;g[m*d+p]=Math.min(h[x],h[x+1],h[x+f],h[x+f+1]),v[m*d+p]=Math.max(u[x],u[x+1],u[x+f],u[x+f+1])}h=g,u=v,f=d,this.mm.push({lo:h,hi:u,n:f})}}metresAt(t,e){const n=this.pack.rect,{W:i,H:o,heights:a}=this;let r=(t-n.x0)/(n.x1-n.x0)*i-.5,c=(e-n.z0)/(n.z1-n.z0)*o-.5;r<0?r=0:r>i-1.001&&(r=i-1.001),c<0?c=0:c>o-1.001&&(c=o-1.001);const l=r|0,h=c|0,u=r-l,f=c-h,d=h*i+l,g=a[d]+(a[d+1]-a[d])*u,v=a[d+i]+(a[d+i+1]-a[d+i])*u;return g+(v-g)*f}applyRange(t){this.rangeK=t;const e=t*this.leafSize;this.ranges=[];for(let n=0;n<this.levels;n++)this.ranges.push(e*2**n);this.ranges[this.levels-1]=1e9;for(let n=0;n<this.levels;n++){const i=this.ranges[n],o=n>0?this.ranges[n-1]:0;this.morph[n].set(o+(i-o)*.5,i*.97)}}setSelf(t){this.uniforms.uSelf.value=t;for(const e of[this.full,this.half])e.material.uniforms.uSelf.value=t}update(t,e){this.group.visible=e,this.full.count=0,this.half.count=0,e&&(this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.vert=this.world.uniforms.uVert.value,this.uniforms.uCamPos.value.copy(t.position),this.select(0,0,this.levels-1));for(const n of[this.full,this.half])n.geometry.instanceCount=n.count,n.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],o=this.leafSize*2**n,a=this.pack.rect.x0+t*o,r=this.pack.rect.z0+e*o,c=this.vert,l=Math.min(0,i.lo[e*i.n+t])*c-.3,h=Math.max(0,i.hi[e*i.n+t])*c+.1;return this._box.min.set(a,l,r),this._box.max.set(a+o,h,r+o),this._box}select(t,e,n){const i=this.mm[n];if(!(i.hi[e*i.n+t]>=qh))return!0;const a=this.nodeBox(t,e,n);if(a.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(a))return!0;const r=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,r,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,r,n),!0;for(let c=0;c<4;c++){const l=t*2+(c&1),h=e*2+(c>>1);if(!this.select(l,h,n-1)){const u=this.mm[n-1];if(!(u.hi[h*u.n+l]>=qh))continue;const f=this.nodeBox(l,h,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,l,h,r/2,n)}}return!0}emit(t,e,n,i,o){if(t.count>=Xh)return;const a=t.count*4;t.data[a]=this.pack.rect.x0+e*i,t.data[a+1]=this.pack.rect.z0+n*i,t.data[a+2]=i,t.data[a+3]=o,t.count++}dispose(){for(const t of[this.full,this.half])t.geometry.dispose(),t.material.dispose();this.shadow.dispose(),this.heightTex.dispose(),this.normalTex.dispose(),this.landTex.dispose()}}const qx=["raise","lower"];async function Yx(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}function cd(s,t,e=console.warn,n=null){const i=(s==null?void 0:s.id)||(s==null?void 0:s.keyframe)||(s==null?void 0:s.file)||"?",o=(s==null?void 0:s.kind)??"lower";if(!qx.includes(o))return e(`patch ${i}: kind "${o}" is neither raise nor lower; not drawn`),null;if(!Number.isFinite(s.until))return e(`patch ${i}: no until year; not drawn`),null;if(!s.file)return e(`patch ${i}: no mask file; not drawn`),null;const a=Array.isArray(s.size)&&s.size.length===2&&s.size.every(r=>Number.isInteger(r)&&r>0)?s.size:null;return{id:String(i),pack:s.pack??n,kind:o,depth:Number.isFinite(s.depth)?s.depth:-1,until:s.until,url:t(s.file),size:a,note:s.note||""}}async function Kx(s,t=console.warn){const e=new URL(s,location.href),n=a=>new URL(a,e).href;let i;try{i=await Yx(n("patches/manifest.json"))}catch{return[]}const o=[];for(const a of(i==null?void 0:i.patches)||[]){if(!(a!=null&&a.pack)){t(`patch ${(a==null?void 0:a.id)??"?"}: no pack; not drawn`);continue}const r=cd(a,n,t);r&&o.push(r)}return o}async function ld(s){const{px:t,W:e,H:n}=await Qn(s),i=new Uint8Array(e*n);for(let o=0,a=0;o<i.length;o++,a+=4)i[o]=t[a];return{grey:i,W:e,H:n}}function Zx(s,t,e,n,i){if(t===n&&e===i)return s;const o=new Uint8Array(n*i);for(let a=0;a<i;a++){const r=Math.min(e-1,Math.max(0,(a+.5)/i*e-.5)),c=Math.floor(r),l=Math.min(e-1,c+1),h=r-c;for(let u=0;u<n;u++){const f=Math.min(t-1,Math.max(0,(u+.5)/n*t-.5)),d=Math.floor(f),g=Math.min(t-1,d+1),v=f-d,m=s[c*t+d]+(s[c*t+g]-s[c*t+d])*v,p=s[l*t+d]+(s[l*t+g]-s[l*t+d])*v;o[a*n+u]=Math.round(m+(p-m)*h)}}return o}function Jx(s,t,e){let n=t,i=e,o=-1,a=-1;for(let h=0;h<e;h++){const u=h*t;for(let f=0;f<t;f++)s[u+f]&&(f<n&&(n=f),f>o&&(o=f),h<i&&(i=h),h>a&&(a=h))}if(o<0)return null;n=Math.max(0,n-1),i=Math.max(0,i-1),o=Math.min(t-1,o+1),a=Math.min(e-1,a+1);const r=o-n+1,c=a-i+1,l=new Uint8Array(r*c);for(let h=0;h<c;h++)l.set(s.subarray((i+h)*t+n,(i+h)*t+n+r),h*r);return{data:l,w:r,h:c,i0:n,j0:i}}async function Qx(s,t=console.warn){const e=[];for(const n of s.masks||[])try{const i=await ld(n.url),[o,a]=n.size||[s.W,s.H];(i.W!==o||i.H!==a)&&t(`${n.url} is ${i.W}×${i.H}, the manifest says ${o}×${a}; read at its own size`),e.push(Zx(i.grey,i.W,i.H,s.W,s.H))}catch(i){t(`${n.url}: ${i.message} (that patch is not drawn)`),e.push(new Uint8Array(s.W*s.H))}return e}function hd(){const s=new Ze(new Uint8Array(4),1,1,Ni,ge);return s.needsUpdate=!0,{uPatchMap:{value:s},uPatchBox:{value:Array.from({length:$s},()=>new te(0,0,1,1))},uPatchUv:{value:Array.from({length:$s},()=>new te(0,0,1,1))},uPatchInfo:{value:Array.from({length:$s},()=>new te(0,-1,-1,0))},uSlotPatch:{value:Array.from({length:jn},()=>new Ht(0,0))},uSlotPatchBox:{value:Array.from({length:jn},()=>new te(0,0,-1,-1))}}}function tw(s){const e=s.reduce((c,l)=>c+(l.w+1)*(l.h+1),0),n=Math.max(...s.map(c=>c.w))+2*1,i=Math.min(4096,Math.max(n,64,Math.ceil(Math.sqrt(e*1.25))));let o=1,a=1,r=0;for(const c of[...s].sort((l,h)=>h.h-l.h))o+c.w+1>i&&(o=1,a+=r+1,r=0),c.ax=o,c.ay=a,o+=c.w+1,r=Math.max(r,c.h);return{W:i,H:a+r+1}}class ew{constructor(t){this.app=t,this.world=t.world,this.u=t.world.uniforms,this.all=[],this.recs=[],this.byPack=new Map,this.loaded=!1,this.atlas=null,this.warned=!1,this.ready=new Promise(e=>this.resolveReady=e),this.slotKey=""}async load(t=this.app.params.get("patches")||this.app.data.base){var r;const e=this.app.warn,n=await Kx(t,e),i=this.loaded;this.all=n,this.resolveReady(n),i&&((r=this.app.districts)==null||r.setPatches(n));const o=new Map(this.world.islandPacks.map(c=>[c.id,c])),a=[];for(const c of n){const l=o.get(c.pack);if(l)try{const h=await ld(c.url),[u,f]=c.size||[l.W,l.H];(h.W!==u||h.H!==f)&&e(`patch ${c.id}: ${c.url} is ${h.W}×${h.H}, the manifest says ${u}×${f}; drawn at its own size`);const d=Jx(h.grey,h.W,h.H);if(!d){e(`patch ${c.id}: its mask marks nothing`);continue}const g=l.rect,v=(g.x1-g.x0)/h.W,m=(g.z1-g.z0)/h.H;a.push({...c,crop:d,box:[g.x0+d.i0*v,g.z0+d.j0*m,g.x0+(d.i0+d.w)*v,g.z0+(d.j0+d.h)*m],k:this.want(c),depthM:c.depth})}catch(h){e(`patch ${c.id}: ${h.message}`)}}return this.setRecs(a),this.loaded=!0,n}forPack(t){return this.all.filter(e=>e.pack===t)}setRecs(t){var e;(e=this.atlas)==null||e.dispose(),this.atlas=null,this.recs=t,this.byPack=new Map;for(const n of t)this.byPack.has(n.pack)||this.byPack.set(n.pack,[]),this.byPack.get(n.pack).push(n);for(const n of this.byPack.values())n.sort((i,o)=>i.kind===o.kind?0:i.kind==="raise"?-1:1);if(t.length){const{W:n,H:i}=tw(t.map(r=>r.crop)),o=new Uint8Array(n*i);for(const{crop:r}of t)for(let c=0;c<r.h;c++)o.set(r.data.subarray(c*r.w,(c+1)*r.w),(r.ay+c)*n+r.ax);const a=new Ze(o,n,i,Ni,ge);a.minFilter=a.magFilter=je,a.wrapS=a.wrapT=cn,a.generateMipmaps=!1,a.unpackAlignment=1,a.needsUpdate=!0,this.atlas=a,this.atlasSize=[n,i];for(const r of t){const c=r.crop;r.uv=[c.ax/n,c.ay/i,(c.ax+c.w)/n,(c.ay+c.h)/i]}}this.u.uPatchMap.value=this.atlas||hd().uPatchMap.value,this.slotKey="",this.write()}want(t,e=this.app.timeline.year){return e<t.until?1:0}update(t){if(!this.recs.length)return;const e=this.app.timeline.year,n=t>0?1-Math.exp(-t*wf):1;for(const i of this.recs){const o=this.want(i,e);i.k+=(o-i.k)*n,Math.abs(o-i.k)<.002&&(i.k=o)}this.write()}settle(){this.update(0)}write(){const t=this.u,e=t.uPatchBox.value,n=t.uPatchUv.value,i=t.uPatchInfo.value,o=t.uSlotPatch.value,a=t.uSlotPatchBox.value;let r=0,c=0;this.world.slots.forEach((l,h)=>{const u=l&&this.byPack.get(l.pack.id)||[],f=r;let d=1/0,g=1/0,v=-1/0,m=-1/0;for(const p of u)if(!(p.k<=0)){if(r>=$s){c++;continue}e[r].set(...p.box),n[r].set(...p.uv),i[r].set(p.k,p.depthM,p.kind==="raise"?1:-1,0),r++,d=Math.min(d,p.box[0]),g=Math.min(g,p.box[1]),v=Math.max(v,p.box[2]),m=Math.max(m,p.box[3])}o[h].set(f,r-f),v>=d?a[h].set(d,g,v,m):a[h].set(0,0,-1,-1)}),c&&!this.warned&&(this.warned=!0,this.app.warn(`more than ${$s} patches on the islands in view; ${c} of them are not drawn`))}apply(t,e,n,i){const o=this.byPack.get(t);if(!o)return i;for(const a of o){if(a.k<=0)continue;const r=a.box,c=(e-r[0])/(r[2]-r[0]),l=(n-r[1])/(r[3]-r[1]);if(c<0||l<0||c>1||l>1)continue;const h=this.maskAt(a.crop,c,l)*a.k;h>0&&(i+=((a.kind==="raise"?Math.max(i,a.depthM):Math.min(i,a.depthM))-i)*h)}return i}maskAt(t,e,n){const i=e*t.w-.5,o=n*t.h-.5,a=Math.floor(i),r=Math.floor(o),c=i-a,l=o-r,h=(d,g)=>d<0||g<0||d>=t.w||g>=t.h?0:t.data[g*t.w+d],u=h(a,r)+(h(a+1,r)-h(a,r))*c,f=h(a,r+1)+(h(a+1,r+1)-h(a,r+1))*c;return(u+(f-u)*l)/255}stats(){return{loaded:this.loaded,listed:this.all.length,atlas:this.atlasSize||null,kB:this.atlasSize?Math.round(this.atlasSize[0]*this.atlasSize[1]/1024):0,islands:this.recs.map(t=>({id:t.id,pack:t.pack,kind:t.kind,depth:t.depthM,until:t.until,k:+t.k.toFixed(3),box:t.box.map(e=>+e.toFixed(3)),texels:t.crop.w*t.crop.h})),inSlots:this.u.uSlotPatch.value.map(t=>t.y)}}}const Kh=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};class nw{constructor(t,e){this.app=t,this.data=e,this.packs=e.packs,this.archPack=this.packs.find(a=>a.kind==="archipelago")||this.packs[0],this.islandPacks=this.packs.filter(a=>a!==this.archPack),this.group=new Ne,this.terrains=new Map,this.slots=new Array(jn).fill(null),this.exag=Ml(5e3),this.noIslands=!1,this.forceK=null;const n=rd(new Float32Array([-4e3]),1,1),i=new Ze(new Uint8Array(4),1,1,De,ge);i.needsUpdate=!0,this.dummyAux=i;const o=a=>Array.from({length:a},()=>new te(0,0,0,0));this.uniforms={uVert:{value:this.exag/100},uExag:{value:this.exag},uArchH:{value:n},uArchRect:{value:new te(0,0,1,1)},uSlotRect:{value:Array.from({length:jn},()=>new te(0,0,1,1))},uSlotInfo:{value:Array.from({length:jn},()=>new te(0,0,1,0))},uDistRect:{value:new te(0,0,1,1)},uDistInfo:{value:new te(0,0,1,0)},uDistH:{value:n},uDistAux:{value:i},uDistCarve:{value:n},uDistPatch:{value:i},uDistPatchBox:{value:new te(0,0,0,0)},uDistLower:{value:o(Jn)},uDistRaise:{value:o(Jn)},uDistRaiseTop:{value:-1e9},uFeatK:{value:o(16)},...hd()},this.district=null;for(let a=0;a<jn;a++)this.uniforms[`uSlotH${a}`]={value:n};this._frustum=new Bi,this._m=new ie,this._box=new Sn,this.dummy=n}setArchipelago(t){const e=new Nc(t,this);e.setSelf(-1),this.arch=e,this.terrains.set(t.id,e),this.group.add(e.group),this.uniforms.uArchH.value=e.heightTex,this.uniforms.uArchRect.value.copy(e.rect);const n=t.rect;this.bounds={x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1}}addIsland(t){const e=new Nc(t,this,this.arch);e.k=0,e.want=0,e.slot=-1;const n=t.rect;return e.margin=Math.min(15,.08*Math.min(n.x1-n.x0,n.z1-n.z0)),e.group.visible=!1,this.terrains.set(t.id,e),this.group.add(e.group),e}get islands(){return[...this.terrains.values()].filter(t=>t!==this.arch)}wantFor(t,e){const n=t.pack.rect,i=e.position,o=Math.max(n.x0-i.x,0,i.x-n.x1),a=Math.max(n.z0-i.z,0,i.z-n.z1),r=Math.hypot(o,a,Math.max(1,i.y)),c=(innerHeight||800)/(2*Math.tan(e.fov*Math.PI/360)),l=this.arch.texel*c/r;t.score=l;const h=Math.max(1,t.pack.data.hi*this.uniforms.uVert.value);return this._box.min.set(n.x0,0,n.z0),this._box.max.set(n.x1,h,n.z1),this._frustum.intersectsBox(this._box)?Kh(1,2.4,l):0}update(t,e,n){var d,g,v;this.exag=Ml(e),this.uniforms.uExag.value=this.exag,this.uniforms.uVert.value=this.exag/100;const i=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const m of i)m.want=this.noIslands?0:this.wantFor(m,t);const o=i.filter(m=>m.want>0).sort((m,p)=>p.score-m.score),a=new Set(o.slice(0,jn)),r=1-Math.exp(-n*2.5);for(const m of i){const p=a.has(m)?m.want:0;if(m.slot>=0)m.k+=(p-m.k)*r,Math.abs(p-m.k)<.004&&(m.k=p),m.k<=0&&p<=0&&this.release(m);else if(p>0){const x=this.slots.indexOf(null);x>=0&&this.assign(m,x)}}if(this.forceK!==null)for(const m of this.slots)m&&(m.k=this.forceK);if(this.noIslands)for(const m of this.slots)m&&this.release(m);const c=this.uniforms;for(let m=0;m<jn;m++){const p=this.slots[m];c.uSlotInfo.value[m].set(p?p.k:0,p?1:0,p?p.margin:1,0)}(d=this.app.patches)==null||d.update(n),this.arch.update(t,!0);for(const m of i)m.update(t,m.slot>=0);(g=this.district)==null||g.update(t,e,n);const l=this.app.renderer,h=this.app.light.sunDir,u=this.uniforms.uVert.value,f=this.maxY+.1;this.arch.shadow.update(l,h,u,0,f);for(const m of i)m.slot>=0&&m.shadow.update(l,h,u,m.k,f);(v=this.district)==null||v.updateShadow(l,h,u,f)}settle(t){var i;const e=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const o of e)o.want=this.wantFor(o,t);const n=e.filter(o=>o.want>0).sort((o,a)=>a.score-o.score).slice(0,this.slots.length);for(const o of e)o.slot>=0&&!n.includes(o)&&this.release(o);for(const o of n){if(o.slot<0){const a=this.slots.indexOf(null);if(a<0)continue;this.assign(o,a)}o.k=o.want}(i=this.app.patches)==null||i.settle()}stats(){var n,i,o;const t={};for(const[a,r]of this.terrains)r.group.visible&&(t[a]=r.full.count+r.half.count);const e=(n=this.district)==null?void 0:n.cur;return(i=e==null?void 0:e.terrain)!=null&&i.group.visible&&(t[e.d.id]=e.terrain.full.count+e.terrain.half.count),{exag:+this.exag.toFixed(2),nodes:t,slots:this.slots.map(a=>a?`${a.pack.id}:${a.k.toFixed(2)}`:null),district:((o=this.district)==null?void 0:o.stats())??null}}assign(t,e){this.slots[e]=t,t.slot=e,t.k=0,t.setSelf(e),t.shadow.ever=!1,t.shadow.strip=-1,t.shadow.drawn.vert=-1,this.uniforms.uSlotRect.value[e].copy(t.rect),this.uniforms[`uSlotH${e}`].value=t.heightTex}release(t){const e=t.slot;e<0||(this.slots[e]=null,t.slot=-1,t.k=0,this.uniforms[`uSlotH${e}`].value=this.dummy,this.uniforms.uSlotInfo.value[e].set(0,0,1,0))}metresAt(t,e){var c;const n=this.arch;if(!n)return-4e3;const i=n.pack.rect;let o=t<i.x0||e<i.z0||t>i.x1||e>i.z1?-4e3:n.metresAt(t,e),a=null,r=0;for(const l of this.slots){if(!l)continue;const h=l.pack.rect,u=Math.min(t-h.x0,h.x1-t,e-h.z0,h.z1-e);u>r&&(r=u,a=l)}if(a){const l=a.k*Kh(0,a.margin,r);l>0&&(o+=(this.ownMetres(a,t,e)-o)*l)}return(c=this.district)!=null&&c.on?this.district.blend(t,e,o):o}ownMetres(t,e,n){const i=t.metresAt(e,n);return this.app.patches?this.app.patches.apply(t.pack.id,e,n,i):i}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.uniforms.uVert.value}get maxY(){let t=0;for(const e of this.terrains.values())t=Math.max(t,e.pack.data.hi);return t*this.uniforms.uVert.value}chainShape(){if(this._chain)return this._chain;const t=this.arch,e=48,n=[];let i=null,o=null;for(const c of this.islandPacks){const l=c.rect,h=[];for(let f=0;f<=e;f++)for(let d=0;d<=e;d++){const g=l.x0+(l.x1-l.x0)*d/e,v=l.z0+(l.z1-l.z0)*f/e;t.metresAt(g,v)>0&&h.push([g,v])}if(!h.length)continue;n.push(...h);const u=(l.x0+l.x1)/2;(!i||u<i.cx)&&(i={cx:u,own:h}),(!o||u>o.cx)&&(o={cx:u,own:h})}if(!n.length){const c=this.bounds,l=[[c.x0,c.z0],[c.x1,c.z0],[c.x1,c.z1],[c.x0,c.z1]];return this._chain={hull:l,from:l[0],to:l[2]}}const a=i.own.reduce((c,[l,h])=>[c[0]+l/i.own.length,c[1]+h/i.own.length],[0,0]),r=o.own.reduce((c,l)=>l[0]+l[1]>c[0]+c[1]?l:c);return this._chain={hull:iw(n),from:a,to:r}}islandAt(t,e){let n=null,i=0;for(const o of this.islands){const a=o.pack.rect,r=Math.min(t-a.x0,a.x1-t,e-a.z0,a.z1-e);r>i&&(i=r,n=o)}return n}setRange(t){var e,n,i;for(const o of this.terrains.values())o.applyRange(t);(i=(n=(e=this.district)==null?void 0:e.cur)==null?void 0:n.terrain)==null||i.applyRange(t)}setDebug(t){var n,i;for(const o of this.terrains.values())o.uniforms.uDebug.value=t;const e=(i=(n=this.district)==null?void 0:n.cur)==null?void 0:i.terrain;if(e)for(const o of[e.full,e.half])o.material.uniforms.uDebug.value=t}}function iw(s){const t=[...s].sort((o,a)=>o[0]-a[0]||o[1]-a[1]);if(t.length<3)return t;const e=(o,a,r)=>(a[0]-o[0])*(r[1]-o[1])-(a[1]-o[1])*(r[0]-o[0]),n=[];for(const o of t){for(;n.length>=2&&e(n.at(-2),n.at(-1),o)<=0;)n.pop();n.push(o)}const i=[];for(let o=t.length-1;o>=0;o--){const a=t[o];for(;i.length>=2&&e(i.at(-2),i.at(-1),a)<=0;)i.pop();i.push(a)}return n.slice(0,-1).concat(i.slice(0,-1))}const sw=`
${ze}
${Ve}
${bi}
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
`,ow=`
${ze}
${so}
${Ve}
${bi}
${us}
${ad}
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
`,aw=`
${ze}
${Ve}
${bi}
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
`,we=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};function rw(s,t,e){const n=t*e,i=new Uint8Array(n),o=new Int32Array(n).fill(-1),a=new Int32Array(n),r=new Float32Array(n);let c=0;const l=new Int32Array(n);let h=0;const u=x=>{let w=h++;const b=r[x];for(;w>0;){const y=w-1>>1;if(r[l[y]]<=b)break;l[w]=l[y],w=y}l[w]=x},f=()=>{const x=l[0],w=l[--h],b=r[w];let y=0;for(;;){let S=2*y+1;if(S>=h||(S+1<h&&r[l[S+1]]<r[l[S]]&&S++,r[l[S]]>=b))break;l[y]=l[S],y=S}return l[y]=w,x},d=new Int32Array(n);let g=0,v=0;for(let x=0;x<n;x++)s[x]<=0&&(i[x]=1);const m=[-1,1,0,0,-1,1,-1,1],p=[0,0,-1,1,-1,-1,1,1];for(let x=0;x<e;x++)for(let w=0;w<t;w++){const b=x*t+w;if(i[b])continue;let y=w===0||x===0||w===t-1||x===e-1,S=-1;for(let E=0;E<8&&!y;E++){const T=w+m[E],_=(x+p[E])*t+T;s[_]<=0&&(y=!0,S=_)}y&&(i[b]=1,o[b]=S,r[b]=s[b],u(b))}for(;h||g<v;){const x=g<v?d[g++]:f();a[c++]=x;const w=r[x],b=x%t,y=(x-b)/t;for(let S=0;S<8;S++){const E=b+m[S],T=y+p[S];if(E<0||T<0||E>=t||T>=e)continue;const M=T*t+E;i[M]||(i[M]=1,o[M]=x,s[M]<=w?(r[M]=w,d[v++]=M):(r[M]=s[M],u(M)))}g===v&&(g=v=0)}return{rec:o,order:a.subarray(0,c)}}function cw(s,t,e,n){const i=new Float32Array(t*e),{rec:o,order:a}=s;for(let r=0;r<a.length;r++)i[a[r]]=n;for(let r=a.length-1;r>=0;r--){const c=a[r],l=o[c];l>=0&&i[l]>0&&(i[l]+=i[c])}return i}function lw(s,t,e,n,i,o,a=.14){var m;const r=e*n,{rec:c}=s,l=new Uint8Array(r);for(let p=0;p<r;p++)t[p]>=i&&(l[p]=1);const h=new Uint8Array(r);for(let p=0;p<r;p++)l[p]&&c[p]>=0&&l[c[p]]&&(h[c[p]]=1);const u=new Uint8Array(r),f=[];for(let p=0;p<r;p++)l[p]&&!h[p]&&f.push(p);const d=new Float32Array(f.length);f.forEach((p,x)=>{let w=0;for(let b=p;b>=0&&l[b]&&w<1e6;b=c[b])w++;d[x]=w});const g=f.map((p,x)=>x).sort((p,x)=>d[x]-d[p]),v=[];for(const p of g){const x=[];let w=f[p];for(;w>=0&&l[w];){const y=w%e,S=(w-y)/e,[E,T]=o(y+.5,S+.5);if(x.push([E,T,t[w]]),u[w])break;u[w]=1,w=c[w]}if(w>=0&&!l[w]){const y=w%e,S=(w-y)/e,[E,T]=o(y+.5,S+.5);x.push([E,T,((m=x.at(-1))==null?void 0:m[2])??i])}if(x.length<3)continue;const b=uw(hw(x,3),a);if(!(b.length<2)){v.push(b.length);for(const y of b)v.push(y[0],y[1],y[2])}}return new Float32Array(v)}function hw(s,t){const e=s.length,n=s.map(i=>i.slice());for(let i=1;i<e-1;i++){let o=0,a=0,r=0;const c=Math.min(t,i,e-1-i);for(let l=-c;l<=c;l++)o+=s[i+l][0],a+=s[i+l][1],r++;n[i][0]=o/r,n[i][1]=a/r}return n}function uw(s,t){const e=[s[0]];let n=0;for(let o=0;o+1<s.length;o++){const a=s[o],r=s[o+1],c=Math.hypot(r[0]-a[0],r[1]-a[1]);let l=t-n;for(;l<c;){const h=l/c;e.push([a[0]+(r[0]-a[0])*h,a[1]+(r[1]-a[1])*h,a[2]+(r[2]-a[2])*h]),l+=t}n=c-(l-t)}const i=s[s.length-1];return Math.hypot(i[0]-e.at(-1)[0],i[1]-e.at(-1)[1])>t*.3&&e.push(i),e}function fw(s,t,e,n,i){const o=[];let a=1/0,r=-1/0;for(const h of n)for(let u=0;u+1<h.length;u++){const[f,d]=h[u],[g,v]=h[u+1];d!==v&&(o.push(d<v?[d,f,v,g]:[v,g,d,f]),a=Math.min(a,d,v),r=Math.max(r,d,v))}if(!o.length)return 0;const c=[];let l=0;for(let h=Math.max(0,Math.floor(a));h<=Math.min(e-1,Math.ceil(r));h++){const u=h+.5;c.length=0;for(const f of o)f[0]<=u&&f[2]>u&&c.push(f[1]+(u-f[0])/(f[2]-f[0])*(f[3]-f[1]));c.sort((f,d)=>f-d);for(let f=0;f+1<c.length;f+=2){const d=Math.max(0,Math.ceil(c[f]-.5)),g=Math.min(t-1,Math.floor(c[f+1]-.5));for(let v=d;v<=g;v++)s[h*t+v]=i,l++}}return l}function Ma(s,t){let e=s*.1031%1,n=t*.1031%1;e<0&&(e+=1),n<0&&(n+=1);let i=e;const o=e*(n+33.33)+n*(i+33.33)+i*(e+33.33);e+=o,n+=o,i+=o;const a=(e+n)*i%1;return a<0?a+1:a}function Oc(s,t){const e=Math.floor(s),n=Math.floor(t),i=s-e,o=t-n,a=i*i*(3-2*i),r=o*o*(3-2*o),c=Ma(e,n),l=Ma(e+1,n),h=Ma(e,n+1),u=Ma(e+1,n+1);return c+(l-c)*a+(h-c+(c-l+u-h)*a)*r}function ye(s,t=0,e=0){let n=Math.imul(s|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e|0,2246822519);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const ud=new Float32Array(1),dw=new Uint32Array(ud.buffer);function Co(s){ud[0]=s;const t=dw[0],e=t>>>16&32768;let n=(t>>>23&255)-127+15;const i=t&8388607;return n<=0?e:n>=31?e|31744:e|n<<10|i>>>13}function br(s){const t=s>>>10&31,e=s&1023,n=s&32768?-1:1;return t===0?n*e*5960464477539063e-23:t===31?e?NaN:n*(1/0):n*(1+e/1024)*2**(t-15)}const pw=28,ll=.5625,oc=[22,36],Zh=3.5,Jh=2.6,mw=32,gw=.45,ac=[7,16];function vw({index:s,seed:t=s,inside:e,box:n,m:i,hs:o,cls:a,chanDist:r,aux:c,carve:l,W:h,mx:u,mz:f}){const{x0:d,y0:g,x1:v,y1:m}=n,p=v-d+1,x=m-g+1,w=un(p,x,y=>!e[(g+Math.floor(y/p))*h+d+y%p],u,f),b=new Set;for(let y=g;y<=m;y++)for(let S=d;S<=v;S++){const E=y*h+S;if(!e[E]||i[E]<=.3)continue;const T=S*u,M=y*f,_=(Oc(T/140+t*7.1,M/140)-.5)*24,A=we(0,mw,w[(y-g)*p+(S-d)]+_),R=we(ac[0],ac[1],r[E]);if(A*R<.02)continue;const D=a[E],C=ll*2**D,z=o[E]/C,I=Co(z-64*Math.floor(z/64)),O=fd(i[E],br(I),D),N=Math.round(O/C-.5),j=O-i[E],H=j<0?we(Zh+1,Zh,-j):we(Jh+1,Jh,j),J=A*R*H;if(J<.02)continue;const ot=(r[E]-ac[0])/xw(N,D,t)+ye(t,N,D*7+2);b.add((D*4096+N)*4096+Math.floor(ot)),c[E*4+1]=Math.round(255*J),c[E*4+2]=D,c[E*4+3]=s,l[E*2]=I,l[E*2+1]=Co(ot)}return b.size}function xw(s,t,e){return oc[0]+(oc[1]-oc[0])*ye(e,s,t*7+1)}function ww(s,t,e,n){let i=1/0,o=1/0,a=-1/0,r=-1/0;for(const c of s)for(const[l,h]of c)i=Math.min(i,l),o=Math.min(o,h),a=Math.max(a,l),r=Math.max(r,h);return{x0:Math.max(0,Math.floor(i)-n),y0:Math.max(0,Math.floor(o)-n),x1:Math.min(t-1,Math.ceil(a)+n),y1:Math.min(e-1,Math.ceil(r)+n)}}function fd(s,t,e){const n=ll*2**e,i=t+64*Math.floor((s/n-t)/64+.5);return(Math.floor(i)+.5)*n}const Qh=.346,tu=.387,eu=.436,nu=.575,iu=.702,Os=["ohia","ohiaKrumm","koa","kukui","ohiaai","hau","hala","wiliwili","lama","aalii","niu","milo"],Zt=Object.fromEntries(Os.map((s,t)=>[s,t])),go={ohiaDry:[1.48,1.41,1.8],ohiaWet:[.72,.75,.7],olapa:[1.32,1.46,1.17]},_a=9;function yw(s,t){let e=0;for(let i=0;i<t.length;i++)t[i]>0&&(e+=t[i]);if(e<=0)return-1;s*=e;let n=-1;for(let i=0;i<t.length;i++)if(!(t[i]<=0)&&(n=i,(s-=t[i])<0))return i;return n}function Mw({W:s,H:t,mx:e,mz:n,m:i,m1795:o,rain:a,normals:r,rip:c,tpi:l,chanDist:h,clear:u,patch:f,shore:d,toWorld:g,step:v}){const m=Os.map(()=>[]),p=new Int32Array(Os.length),x=new Float32Array(Os.length),w=Math.floor(s*e/v),b=Math.floor(t*n/v);for(let y=0;y<b;y++)for(let S=0;S<w;S++){const E=(S+ye(S,y,11))*v,T=(y+ye(S,y,12))*v,M=Math.min(s-1,Math.floor(E/e)),_=Math.min(t-1,Math.floor(T/n)),A=_*s+M;if(f[A]>0||i[A]<1.2||o[A]<1.2||h[A]<9)continue;const R=i[A],D=a[A]/255+(ye(S,y,3)-.5)*.1,C=a[A]/255,z=r[A*4+1]/255*2-1,I=1-we(.55,.75,z),O=R-ir(l,M,_,4),N=ir(c,M,_,4),j=Math.max(we(.1,.3,N),we(12,30,-O)),H=we(10,30,O)*(1-we(.05,.2,N)),J=we(.94,.97,z)*we(.25,.5,N),ot=C-(.22+43e-5*R),Y=we(.5,.6,C),nt=1-we(420-250*Y,760-430*Y,R+(ye(S,y,20)-.5)*120),ct=we(.42,.6,Oc(E/210+13.1,T/210+7.7)),mt=we(.6,.7,Oc(E/190+41.3,T/190+3.9)),St=1-we(14,40,h[A]),Tt=R<670&&C>Qh?(1-we(450,670,R))*(1-we(iu-.04,iu+.02,C)):0,Rt=R<610?1:0,yt=R<550&&D>eu?J>.5?.8+4*mt:.1+6*mt:0,It=Math.max(we(0,20,O),we(300,420,R));x.fill(0);let X=0,fe=1,Lt=null;if(d.a[(_>>1)*d.w+(M>>1)]<70&&R<8)X=.3,x[Zt.niu]=50,x[Zt.hala]=30,x[Zt.milo]=15;else if(D<tu&&ot<.04&&R<300)X=.04+.32*j+.22*I,x[Zt.aalii]=35,x[Zt.wiliwili]=C<tu-.02?25:8,x[Zt.lama]=25,x[Zt.ohia]=12,Lt=go.ohiaDry;else if(nt>ye(S,y,22))if(J>.5)X=.45,x[Zt.ohiaai]=40*yt,x[Zt.hau]=70*St,x[Zt.kukui]=20*Tt*(1-.9*mt),x[Zt.hala]=5*Rt;else if(j>.4||I>.4)X=.85,x[Zt.kukui]=70*Tt*(.25+.75*ct)*(1-.9*mt),x[Zt.hala]=14*Rt*(1-.7*mt),x[Zt.ohiaai]=10*yt,x[Zt.hau]=60*St*(R<450?1:0),x[Zt.lama]=12*(D<eu&&ot<0?1:0),x[Zt.ohia]=(5+45*(1-Tt)*(D>Qh?1:0))*(R>150?It:0),x[Zt.ohiaKrumm]=10*(1-Tt)*(D>=nu?1:0)*I;else{const F=we(460,640,R);X=.25+.55*F,H>.5?(x[Zt.ohia]=60*(R>150?1:0),x[Zt.koa]=20*(R>250?1:0),x[Zt.hala]=20*Rt*(1-F)):(x[Zt.kukui]=45*Tt*(.1+.9*ct)*(1-.9*mt),x[Zt.hala]=35*Rt*(1-.7*mt)*(1-.85*F),x[Zt.ohiaai]=10*yt,x[Zt.hau]=60*St*(R<450?1:0),x[Zt.ohia]=(10+50*F)*(R>150?It:0),x[Zt.koa]=(10+5*F)*(R>250?1:0))}else D<nu?(X=R<760?.55:.85,x[Zt.ohia]=45,x[Zt.koa]=30*(R>300?1:0),x[Zt.lama]=15,x[Zt.aalii]=5,x[Zt.kukui]=10*Tt*(j>.5?1:0)):H>.5||I>.5?(X=.6,x[Zt.ohiaKrumm]=55,x[Zt.ohia]=45,fe=.55+.3*ye(S,y,14)):(X=.92,x[Zt.ohia]=80,x[Zt.koa]=10*(z>.8?1:0),x[Zt.ohiaKrumm]=10,Lt=ye(S,y,15)<.12?go.olapa:go.ohiaWet);if(X<=ye(S,y,5))continue;const Z=yw(ye(S,y,6),x);if(Z<0)continue;const[lt,ut]=g(E/e,T/n),P=.92+.16*ye(S,y,8),L=Z===Zt.ohia&&Lt?Lt:Z===Zt.ohiaKrumm&&Lt===go.olapa?go.olapa:[P,P,P];m[Z].push(lt,ut,R-.6,ye(S,y,7)*Math.PI*2,fe*(.8+.4*ye(S,y,9)),L[0],L[1],L[2],u[A]),p[Z]++}return{kinds:Os,lists:m.map(y=>new Float32Array(y)),counts:Array.from(p)}}const ks=-1,Ro=.5,vo=16;function hl(s,t,e,n=Ro,i=ks){return t<128?s+(i-s)*(t/127)*e:s+(Math.max(Ro,n)-s)*((t-128)/127)*e}function _w({W:s,H:t,lowerMasks:e,lowerOf:n,raises:i,patchMask:o,fill:a,log:r}){const c=s*t;let l=s,h=t,u=-1,f=-1;const d=M=>{const _=M%s,A=(M-_)/s;_<l&&(l=_),_>u&&(u=_),A<h&&(h=A),A>f&&(f=A)};for(let M=0;M<c;M++)if(o[M]||a[M])d(M);else for(const _ of i)_[M]&&d(M);if(u<0)return null;l=Math.max(0,l-vo),h=Math.max(0,h-vo),u=Math.min(s-1,u+vo),f=Math.min(t-1,f+vo);const g=u-l+1,v=f-h+1,m=M=>(h+Math.floor(M/g))*s+l+M%g,p=65535,x=new Uint32Array(g*v),w=new Uint16Array(g*v).fill(p);let b=[];for(let M=0;M<g*v;M++){const _=m(M);let A=0;n.forEach((R,D)=>{e[R][_]>=128&&(A|=1<<D)}),A&&(x[M]=A,w[M]=0,b.push(M))}for(let M=1;M<p&&b.length;M++){const _=[];for(const A of b){const R=A%g;for(const D of[R>0?A-1:-1,R<g-1?A+1:-1,A-g,A+g])D<0||D>=g*v||w[D]!==p||M>vo&&!o[m(D)]||(w[D]=M,x[D]=x[A],_.push(D))}b=_}const y=n.reduce((M,_,A)=>M|1<<A,0);for(let M=0;M<g*v;M++)a[m(M)]&&(x[M]=y);const S=[0],E=new Map,T=new Uint8Array(g*v*4);for(let M=0;M<g*v;M++){const _=x[M];if(_){let I=E.get(_);I===void 0&&(S.length<16?I=S.push(_)-1:(I=E.get(y)??S.length-1,r==null||r(`patch map: more than 15 sets of lower patches; ${_.toString(2)} goes with group ${I}`)),E.set(_,I)),T[M*4]=I}const A=m(M);let R=-1,D=0,C=-1,z=0;i.forEach((I,O)=>{const N=I[A];N>D?(C=R,z=D,R=O,D=N):N>z&&(C=O,z=N)}),R>=0&&(T[M*4+1]=D,T[M*4+2]=R&15|(Math.max(0,C)&15)<<4,T[M*4+3]=C>=0?z:0)}return{data:T,x0:l,y0:h,w:g,h:v,groups:S}}function su(s,t,e){const n=new Uint8Array(t*e),i=new Int32Array(t*e);let o=0,a=0;const r=c=>{s[c]<=0&&!n[c]&&(n[c]=1,i[a++]=c)};for(let c=0;c<t;c++)r(c),r((e-1)*t+c);for(let c=0;c<e;c++)r(c*t),r(c*t+t-1);for(;o<a;){const c=i[o++],l=c%t,h=(c-l)/t;l>0&&r(c-1),l<t-1&&r(c+1),h>0&&r(c-t),h<e-1&&r(c+t)}return n}function bw({heightPx:s,rainPx:t,masks:e=[],lower:n=[],raise:i=[],raiseDepth:o=[],W:a,H:r,scale:c,offset:l,mx:h,mz:u,rect:f,features:d,stride:g=4,log:v=()=>{}}){const m=Date.now(),p={};let x=m;const w=Z=>{const lt=Date.now();p[Z]=lt-x,x=lt},b=a*r,y=Mf(s,a,r,c,l,g),S=t?_f(t,a,r,g):new Uint8Array(b).fill(82),E=new Uint8Array(b);{const Z=su(y,a,r);for(let lt=0;lt<b;lt++)y[lt]<=0&&!Z[lt]&&(y[lt]=.3,E[lt]=1)}const T=(f.x1-f.x0)/a,M=(f.z1-f.z0)/r,_=(Z,lt)=>[f.x0+Z*T,f.z0+lt*M];w("decode");const A=[...new Set(n)].map(Z=>e[Z]),R=i.map(Z=>e[Z]),D=new Uint8Array(b);for(const Z of R)for(let lt=0;lt<b;lt++)Z[lt]>D[lt]&&(D[lt]=Z[lt]);const C=new Uint8Array(b);for(const Z of A)for(let lt=0;lt<b;lt++)Z[lt]>=128&&(C[lt]=1);if(A.length){const lt=(L,F)=>{const G=L%a,Q=(L-G)/a;for(let V=-3;V<=3;V++){const et=Q+V;if(!(et<0||et>=r))for(let st=-3;st<=3;st++){const gt=G+st;if(gt>=0&&gt<a&&F(et*a+gt))return!0}}return!1},ut=[];for(let L=0;L<b;L++)C[L]||y[L]<=0||y[L]>5||lt(L,F=>C[F])&&lt(L,F=>y[F]<=0&&!C[F])&&ut.push(L);for(const L of ut)C[L]=1;const P=new Uint8Array(b);for(let L=0;L<b;L++){if(!E[L]||P[L])continue;const F=[L];P[L]=1;let G=!1;for(let Q=0;Q<F.length;Q++){const V=F[Q];!G&&lt(V,st=>C[st]===1)&&(G=!0);const et=V%a;for(const st of[et>0?V-1:-1,et<a-1?V+1:-1,V-a,V+a])st>=0&&st<b&&E[st]&&!P[st]&&(P[st]=1,F.push(st))}if(G)for(const Q of F)C[Q]=1}}const z=new Uint8Array(b);if(A.length){const lt=G=>y[G]<=0||C[G]===1,ut=un(a,r,G=>!lt(G),h,u),P=un(a,r,G=>lt(G)&&ut[G]>45,h,u),L=un(a,r,G=>C[G]===1,h,u),F=45+1.5*Math.max(h,u);for(let G=0;G<b;G++)y[G]>0||C[G]||P[G]<=F||D[G]>=64||(L[G]<60?C[G]=2:z[G]=1);for(let G=0;G<b;G++)C[G]&&(C[G]=1)}const I=new Uint8Array(b*4),O=Float32Array.from(y);R.forEach((Z,lt)=>{const ut=o[lt]??ks;for(let P=0;P<b;P++)Z[P]&&(O[P]+=(Math.max(O[P],ut)-O[P])*(Z[P]/255))});let N=null,j=null;{let Z=a,lt=r,ut=-1,P=-1;for(let L=0;L<b;L++){if(!C[L])continue;const F=L%a,G=(L-F)/a;Z=Math.min(Z,F),ut=Math.max(ut,F),lt=Math.min(lt,G),P=Math.max(P,G)}if(ut>=0){Z=Math.max(0,Z-12),lt=Math.max(0,lt-12),ut=Math.min(a-1,ut+12),P=Math.min(r-1,P+12),N={x0:Z,y0:lt,x1:ut,y1:P};const L=ut-Z+1,F=P-lt+1,G=V=>(lt+Math.floor(V/L))*a+Z+V%L,Q=un(L,F,V=>!C[G(V)]&&y[G(V)]>0,h,u);for(let V=0;V<L*F;V++){const et=G(V);if(!C[et])continue;const st=we(0,45,Q[V]);I[et*4]=Math.round(127*st),O[et]+=(ks-O[et])*st}}}if(N){const Z=Math.round(15e3/(h*u)),lt=new Uint8Array(b),ut=[];for(let P=0;P<b;P++){const L=P%a,F=(P-L)/a;if(L<N.x0||L>N.x1||F<N.y0||F>N.y1||lt[P]||O[P]<=0)continue;ut.length=0,ut.push(P),lt[P]=1;let G=!1,Q=!1;for(let V=0;V<ut.length;V++){const et=ut[V],st=et%a,gt=(et-st)/a;if(st<=N.x0||gt<=N.y0||st>=N.x1||gt>=N.y1){Q=!0;continue}for(const _t of[et-1,et+1,et-a,et+a])O[_t]>0?lt[_t]||(lt[_t]=1,ut.push(_t)):C[_t]&&(G=!0);ut.length>Z&&(Q=!0)}if(!(Q||!G)){j||(j=[]);for(const V of ut)C[V]=1,I[V*4]=127,O[V]=ks,j.push(V)}}}const H=Float32Array.from(y);let J=null;if(A.length){for(let G=0;G<b;G++)z[G]&&(O[G]=Ro);const Z=su(O,a,r);for(let G=0;G<b;G++)!z[G]&&O[G]<=0&&!Z[G]&&(z[G]=1);const lt=new Float32Array(b),ut=new Float32Array(b);for(let G=0;G<b;G++)z[G]||C[G]||y[G]<=0||(lt[G]=Math.min(y[G],6),ut[G]=1);const P=Math.ceil(30/Math.max(h,u)),L=Nn(lt,a,r,P,2),F=Nn(ut,a,r,P,2);J=new Float32Array(b);for(let G=0;G<b;G++){if(!z[G])continue;const Q=F[G]>.001?Math.max(Ro,Math.min(6,L[G]/F[G]-.2)):Ro;J[G]=Q,I[G*4]=255,O[G]=Q,H[G]=Q}}const ot=_w({W:a,H:r,lowerMasks:e,lowerOf:n,raises:R,patchMask:C,fill:z,log:v});w("patches");let Y=H;if(j){Y=Float32Array.from(H);for(const Z of j)Y[Z]=ks}const nt=Sf(Y,a,r,h,u,bf(Y,a,r,h,u));w("normals");let ct,mt,St;{const Z=ba(H,a,r,2,!0),lt=rw(Z.a,Z.w,Z.h),ut=cw(lt,Z.w,Z.h,4*h*u/1e6);w("routing"),St=lw(lt,ut,Z.w,Z.h,gw,(F,G)=>_(F*2,G*2)),w("streams"),mt=un(a,r,F=>{const G=F%a,Q=(F-G)/a;return H[F]>0&&ut[(Q>>1)*Z.w+(G>>1)]>=1},h,u);const P=new Float32Array(Z.w*Z.h);for(let F=0;F<P.length;F++)P[F]=Z.a[F]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,ut[F])/.04)/1.6)):0;const L=ba(P,Z.w,Z.h,2,!1);ct={a:Nn(L.a,L.w,L.h,1,2),w:L.w,h:L.h}}w("riparian");const Tt=new Uint8Array(b*4);let Rt;{const Z=(lt,ut)=>{const P=ba(lt,a,r,2,!1),L=un(P.w,P.h,Q=>P.a[Q]<=0,h*2,u*2),F=new Float32Array(P.w*P.h);for(let Q=1;Q<P.h-1;Q++)for(let V=1;V<P.w-1;V++){const et=Q*P.w+V,st=P.a[et];if(st<=0||st>9)continue;const gt=Math.hypot((P.a[et+1]-P.a[et-1])/(4*h),(P.a[et+P.w]-P.a[et-P.w])/(4*u));F[et]=L[et]<70&&gt<.12?1:0}const G={a:Nn(F,P.w,P.h,1,1),w:P.w,h:P.h};for(let Q=0;Q<r;Q++)for(let V=0;V<a;V++)Tt[(Q*a+V)*4+ut]=lt[Q*a+V]>0?Math.round(255*Math.min(1,ir(G,V,Q,2)*1.5)):0;return{a:L,w:P.w,h:P.h}};Z(H,1),Rt=Z(O,3)}for(let Z=0;Z<r;Z++)for(let lt=0;lt<a;lt++){const ut=Z*a+lt;Tt[ut*4]=t?S[ut]:y[ut]>0?82:0,Tt[ut*4+2]=H[ut]>0?Math.round(255*Math.min(1,ir(ct,lt,Z,4)*1.6)):0}w("sand");const yt=new Uint16Array(b*2);if(J)for(let Z=0;Z<b;Z++)z[Z]&&(yt[Z*2]=Co(J[Z]),yt[Z*2+1]=Co(J[Z]-y[Z]));if(j)for(const Z of j)yt[Z*2+1]=Co(ks-y[Z]);const It={},X=new Uint8Array(b);{const Z=Nn(y,a,r,3,2),lt=new Uint8Array(b);{const L=new Float32Array(b);for(let G=1;G<r-1;G++)for(let Q=1;Q<a-1;Q++){const V=G*a+Q;L[V]=Math.hypot((Z[V+1]-Z[V-1])/(2*h),(Z[V+a]-Z[V-a])/(2*u))}const F=Nn(L,a,r,6,2);for(let G=0;G<b;G++)lt[G]=Math.max(0,Math.min(3,Math.round(Math.log2(Math.max(1e-6,F[G]*pw/ll)))))}const ut=new Uint8Array(b),P={village:0,loi:1,pond:2};for(const L of[...d].sort((F,G)=>P[F.kind]-P[G.kind])){const F=ww(L.rings,a,r,4);for(let Q=F.y0;Q<=F.y1;Q++)ut.fill(0,Q*a+F.x0,Q*a+F.x1+1);const G=fw(ut,a,r,L.rings,1);if(G){if(L.kind==="loi")It[L.index]=(It[L.index]||0)+vw({index:L.index,seed:L.seed,inside:ut,box:F,m:y,hs:Z,cls:lt,chanDist:mt,aux:I,carve:yt,W:a,mx:h,mz:u});else{const Q=F.x1-F.x0+1,V=F.y1-F.y0+1,et=un(Q,V,st=>!ut[(F.y0+Math.floor(st/Q))*a+F.x0+st%Q],h,u);for(let st=F.y0;st<=F.y1;st++)for(let gt=F.x0;gt<=F.x1;gt++){const _t=st*a+gt;ut[_t]&&(I[_t*4+1]=Math.round(255*we(0,L.kind==="pond"?9:40,et[(st-F.y0)*Q+(gt-F.x0)])),I[_t*4+2]=0,I[_t*4+3]=L.index,yt[_t*2]=yt[_t*2+1]=0)}It[L.index]=(It[L.index]||0)+G}for(let Q=F.y0;Q<=F.y1;Q++)for(let V=F.x0;V<=F.x1;V++)ut[Q*a+V]&&(X[Q*a+V]=L.index)}}}w("features");let fe;{const Z=Sw(X,a,r,5),lt=ba(y,a,r,4,!1),ut={a:Nn(lt.a,lt.w,lt.h,2,2),w:lt.w,h:lt.h};fe=Mw({W:a,H:r,mx:h,mz:u,m:y,m1795:O,rain:S,normals:nt,rip:ct,tpi:ut,chanDist:mt,clear:Z,patch:C,shore:Rt,toWorld:_,step:25})}w("trees");let Lt=1/0,Ft=-1/0;for(let Z=0;Z<b;Z++)y[Z]<Lt&&(Lt=y[Z]),y[Z]>Ft&&(Ft=y[Z]);return v(`district decoded in ${Date.now()-m} ms: ${JSON.stringify(p)}`),{metres:y,normals:nt,land:Tt,aux:I,carve:yt,streams:St,trees:fe,counts:It,lo:Lt,hi:Ft,patchMap:ot,ms:Date.now()-m,times:p}}function ba(s,t,e,n,i){const o=Math.ceil(t/n),a=Math.ceil(e/n),r=new Float32Array(o*a).fill(i?1/0:-1/0);for(let c=0;c<e;c++){const l=Math.floor(c/n)*o;for(let h=0;h<t;h++){const u=l+Math.floor(h/n),f=s[c*t+h];(i?f<r[u]:f>r[u])&&(r[u]=f)}}return{a:r,w:o,h:a}}function ir(s,t,e,n){const i=Math.min(s.w-1.001,Math.max(0,(t+.5)/n-.5)),o=Math.min(s.h-1.001,Math.max(0,(e+.5)/n-.5)),a=i|0,r=o|0,c=i-a,l=o-r,h=s.a,u=r*s.w+a,f=h[u]+(h[u+1]-h[u])*c,d=h[u+s.w]+(h[u+s.w+1]-h[u+s.w])*c;return f+(d-f)*l}function Sw(s,t,e,n){const i=Uint8Array.from(s);for(let a=0;a<e;a++)for(let r=0;r<t;r++){const c=a*t+r;if(!s[c])for(let l=1;l<=n;l++){const h=r-l>=0&&s[c-l]||r+l<t&&s[c+l];if(h){i[c]=h;break}}}const o=Uint8Array.from(i);for(let a=0;a<e;a++)for(let r=0;r<t;r++){const c=a*t+r;if(!i[c])for(let l=1;l<=n;l++){const h=a-l>=0&&i[c-l*t]||a+l<e&&i[c+l*t];if(h){o[c]=h;break}}}return o}const rc=24;async function ou(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}async function Ew(s,t=console.warn){let e;try{e=await ou(s.abs("districts/manifest.json"))}catch{return[]}const n=[];for(const i of e.districts||[])try{let o={type:"FeatureCollection",features:[]};if(i.features)try{o=await ou(s.abs(`districts/${i.features}`))}catch(a){t(`districts/${i.features}: ${a.message} (the district is drawn without its features)`)}n.push(Aw(i,o,s,t))}catch(o){t(`district ${i.id}: ${o.message}`)}return n}function $o(s){return[Number.isFinite(s==null?void 0:s.from)?s.from:-1/0,Number.isFinite(s==null?void 0:s.to)?s.to:1/0]}function jo(s,t){const[e,n]=$o(s);return t>=e&&t<n+1}function Aw(s,t,e,n){var T;const o=e.proj.rect(s.bounds),[a,r]=s.size,[c,l,h,u]=s.bounds,f=M=>e.abs(`districts/${M}`),d=([M,_])=>[(M-c)/(h-c)*a,(u-_)/(u-l)*r],g={loi:On.loi,pond:On.pond,other:On.other},v={loi:On.pond-1,pond:On.other-1,other:On.max},m=M=>M.kind==="loi"?"loi":M.kind==="fishpond"?"pond":M.kind==="village"?"other":null,p=(t.features||[]).filter(M=>{var _;return m(M.properties||{})&&((_=M.geometry)==null?void 0:_.type)==="Polygon"}),x=Object.fromEntries(Object.keys(g).map(M=>[M,p.filter(_=>m(_.properties)===M).length>v[M]-g[M]+1])),w=new Map,b=[],y=new Map,S=[];for(const M of p){const _=M.properties,A=m(_),R=On[A]+S.filter(z=>m(z.f.properties)===A).length,D=`${A} ${$o(_).join(" ")}`;let C=x[A]?w.get(D):void 0;if(C===void 0){if(g[A]>v[A]){n(`district ${s.id}: more ${_.kind} features in years of their own than the aux map has room for; ${_.name} is not drawn`);continue}C=g[A]++,x[A]&&w.set(D,C)}b.push({index:C,seed:R,kind:A==="other"?_.kind:A,rings:M.geometry.coordinates.map(z=>z.map(d))}),y.has(C)||y.set(C,M),S.push({index:C,f:M})}const E=(s.patches||[]).map(M=>cd(M,f,_=>n(`district ${s.id}: ${_}`),s.id)).filter(Boolean);return{id:s.id,name:s.name||s.id,parent:s.parent||s.island,desc:s,bounds:s.bounds,rect:o,W:a,H:r,mx:(o.x1-o.x0)*qs/a,mz:(o.z1-o.z0)*qs/r,heightUrl:f(s.height.file),rainUrl:(T=s.rain)!=null&&T.file?f(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,own:E,patches:E,features:t,raster:b,byIndex:y,rastered:S,sources:s.sources||[]}}function Tw(s,t=[],e=console.warn){const n=[...s.own,...t.filter(a=>a.pack===s.id)],i=n.filter(a=>a.kind==="lower"),o=n.filter(a=>a.kind==="raise");return i.length>rc&&e(`district ${s.id}: ${i.length} lower patches, ${rc} drawn`),o.length>Jn&&e(`district ${s.id}: ${o.length} raise patches, ${Jn} drawn`),[...o.slice(0,Jn),...i.slice(0,rc)]}class Cw{constructor(t=console.warn){this.warn=t,this.jobs=new Map,this.n=0;try{this.worker=new Worker(new URL(""+new URL("district-worker-M-NrOBek.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=e=>this.message(e.data),this.worker.onerror=e=>{var n;(n=e.preventDefault)==null||n.call(e),this.fallback=!0;for(const[i,o]of this.jobs)this.mainThread(i,o)}}catch{this.fallback=!0}}job(t){const e=[],n=a=>{let r=e.findIndex(c=>c.url===a.url);return r<0&&(r=e.push({url:a.url,size:a.size})-1),r},i=t.patches.filter(a=>a.kind==="lower").map(n),o=t.patches.filter(a=>a.kind==="raise");return{heightUrl:t.heightUrl,rainUrl:t.rainUrl,masks:e,lower:i,raise:o.map(n),raiseDepth:o.map(a=>a.depth),W:t.W,H:t.H,scale:t.scale,offset:t.offset,mx:t.mx,mz:t.mz,rect:{x0:t.rect.x0,z0:t.rect.z0,x1:t.rect.x1,z1:t.rect.z1},features:t.raster.map(a=>({index:a.index,seed:a.seed,kind:a.kind,rings:a.rings}))}}decode(t){return new Promise((e,n)=>{const i=++this.n,o={d:t,resolve:e,reject:n};this.jobs.set(i,o),this.fallback?this.mainThread(i,o):this.worker.postMessage({id:i,...this.job(t)})})}message(t){const e=this.jobs.get(t.id);if(e){if(t.log)return this.warn(t.log);this.jobs.delete(t.id),t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,this.jobs.set(t.id,e),this.mainThread(t.id,e)):e.reject(new Error(t.message))}}async mainThread(t,e){try{const n=this.job(e.d),i=await Qn(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);const o=n.rainUrl?await Qn(n.rainUrl).then(c=>c.W===n.W&&c.H===n.H?c.px:null).catch(()=>null):null,a=await Qx(n,this.warn),r=bw({...n,heightPx:i.px,rainPx:o,masks:a});this.jobs.delete(t),e.resolve(r)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){var t;(t=this.worker)==null||t.terminate()}}const Fe=op,Kn=s=>s*Io/100,it={plain:0,thatch:1,stone:2,leaf:3,water:4,kapa:5,wood:6,skin:7,sand:8,clap:9,windows:10,roof:11,masonry:12};class _e{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.feat=[],this.featNow=0,this.xf=null,this.stack=[]}at(t,e,n,i=0,o=Fe){this.stack.push(this.xf);const a=Math.cos(i),r=Math.sin(i);return this.xf=c=>[t+(c[0]*a-c[2]*r)*o,e+c[1]*o,n+(c[0]*r+c[2]*a)*o],this}done(){return this.xf=this.stack.pop()||null,this}feature(t){return this.featNow=t,this}tri(t,e,n,i,o=0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const a=e[0]-t[0],r=e[1]-t[1],c=e[2]-t[2],l=n[0]-t[0],h=n[1]-t[1],u=n[2]-t[2];let f=r*u-c*h,d=c*l-a*u,g=a*h-r*l;const v=Math.hypot(f,d,g)||1;f/=v,d/=v,g/=v;for(const m of[t,e,n])this.pos.push(m[0],m[1],m[2]),this.nor.push(f,d,g),this.col.push(i[0],i[1],i[2]),this.mat.push(o),this.feat.push(this.featNow)}quad(t,e,n,i,o,a=0){this.tri(t,e,n,o,a),this.tri(t,n,i,o,a)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let o=0;o<4;o++)this.quad(t[o],e[o],e[(o+1)%4],t[(o+1)%4],n,i)}box(t,e,n,i,o,a,r,c=0,l=0,h=1){const u=Math.cos(l),f=Math.sin(l),d=(b,y,S)=>[t+b*u-S*f,e+y,n+b*f+S*u],g=i/2,v=a/2,m=g*h,p=v*h,x=[d(-g,0,-v),d(g,0,-v),d(g,0,v),d(-g,0,v)],w=[d(-m,o,-p),d(m,o,-p),d(m,o,p),d(-m,o,p)];o<0?this.hexa(w,x,r,c):this.hexa(x,w,r,c)}cyl(t,e,n,i,o,a=0,r=6){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],l=Math.hypot(...c)||1,h=c.map(m=>m/l),u=Math.abs(h[1])<.9?[0,1,0]:[1,0,0];let f=[h[1]*u[2]-h[2]*u[1],h[2]*u[0]-h[0]*u[2],h[0]*u[1]-h[1]*u[0]];const d=Math.hypot(...f);f=f.map(m=>m/d);const g=[h[1]*f[2]-h[2]*f[1],h[2]*f[0]-h[0]*f[2],h[0]*f[1]-h[1]*f[0]],v=(m,p,x)=>{const w=x/r*Math.PI*2,b=Math.cos(w)*p,y=Math.sin(w)*p;return[m[0]+f[0]*b+g[0]*y,m[1]+f[1]*b+g[1]*y,m[2]+f[2]*b+g[2]*y]};for(let m=0;m<r;m++)this.quad(v(t,n,m),v(t,n,m+1),v(e,i,m+1),v(e,i,m),o,a)}blob(t,e,n,i,o,a,r,c=0,l=0,h=c===it.leaf){const u=(1+Math.sqrt(5))/2,f=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],d=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],g=p=>.85+.3*Math.abs(Math.sin(p*12.9898+l*78.233)*43758.5453%1),v=f.map((p,x)=>{const w=Math.hypot(...p),b=g(x);return[t+p[0]/w*i*b,e+p[1]/w*o*b,n+p[2]/w*a*b]});if(!h){for(const p of d)this.tri(v[p[0]],v[p[1]],v[p[2]],r,c);return}const m=p=>{const x=[(p[0]-t)/(i*i),(p[1]-e)/(o*o),(p[2]-n)/(a*a)],w=Math.hypot(...x)||1;return[x[0]/w,x[1]/w,x[2]/w]};for(const p of d){const x=p.map(b=>v[b]),w=this.xf?x.map(b=>this.xf(b)):x;for(let b=0;b<3;b++)this.pos.push(...w[b]),this.nor.push(...m(x[b])),this.col.push(r[0],r[1],r[2]),this.mat.push(c),this.feat.push(this.featNow)}}wall(t,e,n,i,o=it.stone,a=.7){const r=t.length;if(r<2)return;const c=r>2&&Math.hypot(t[0][0]-t[r-1][0],t[0][2]-t[r-1][2])<1e-9,l=[];for(let v=0;v<r-1;v++){const m=t[v+1][0]-t[v][0],p=t[v+1][2]-t[v][2],x=Math.hypot(m,p)||1;l.push([-p/x,m/x])}const h=t.map((v,m)=>{let p=l[m-1],x=l[m];if(c&&m===0&&(p=l[r-2]),c&&m===r-1&&(x=l[0]),!p)return x;if(!x)return p;const w=p[0]+x[0],b=p[1]+x[1],y=Math.hypot(w,b);if(y<1e-6)return x;const S=1/Math.max(.35,(w*x[0]+b*x[1])/y);return[w/y*S,b/y*S]}),u=e/2,f=e*a/2,d=(v,m,p,x)=>[v[0]+m[0]*p,v[1]+x,v[2]+m[1]*p],g=v=>[d(t[v],h[v],-u,-n*.3),d(t[v],h[v],u,-n*.3),d(t[v],h[v],f,n),d(t[v],h[v],-f,n)];for(let v=0;v<r-1;v++){const[m,p,x,w]=g(v),[b,y,S,E]=g(v+1);this.quad(w,x,S,E,i,o),this.quad(p,y,S,x,i,o),this.quad(b,m,w,E,i,o)}if(!c){const[v,m,p,x]=g(0),[w,b,y,S]=g(r-1);this.quad(v,m,p,x,i,o),this.quad(b,w,S,y,i,o)}}geometry(){const t=new Je;return t.setAttribute("position",new ke(this.pos,3)),t.setAttribute("normal",new ke(this.nor,3)),t.setAttribute("color",new ke(this.col,3)),t.setAttribute("aMat",new ke(this.mat,1)),t.setAttribute("aFeat",new ke(this.feat,1)),t.computeBoundingSphere(),t}}function sr(s){const t=s.attributes.position.array,e=s.attributes.normal.array,n=s.attributes.color.array,i=s.attributes.aMat.array,o=new Map,a=[],r=[],c=[],l=[],h=[];for(let f=0;f<i.length;f++){const d=`${t[f*3]},${t[f*3+1]},${t[f*3+2]},${e[f*3]},${e[f*3+1]},${e[f*3+2]},${n[f*3]},${n[f*3+1]},${n[f*3+2]},${i[f]}`;let g=o.get(d);g===void 0&&(g=o.size,o.set(d,g),r.push(t[f*3],t[f*3+1],t[f*3+2]),c.push(e[f*3],e[f*3+1],e[f*3+2]),l.push(n[f*3],n[f*3+1],n[f*3+2]),h.push(i[f])),a.push(g)}const u=new Je;return u.setAttribute("position",new ke(r,3)),u.setAttribute("normal",new ke(c,3)),u.setAttribute("color",new ke(l,3)),u.setAttribute("aMat",new ke(h,1)),u.setIndex(a),u.computeBoundingSphere(),u}function pt(s,t=0,e=Math.random){const n=new Bt(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const Rw=`
${ze}
${Ve}
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
`,Lw=`
${ze}
${so}
${Ve}
${us}
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
`;function Qs(s,t,e={}){const[n,i]=e.fade||[60,90];return new Ee({vertexShader:Rw,fragmentShader:Lw,vertexColors:!0,side:e.doubleSide?Ln:yi,defines:{...e.grow?{USE_GROW:""}:{},...e.yield?{USE_YIELD:""}:{}},uniforms:{...s.uniforms,uYearNow:{value:0},uTownClear:{value:null},...t,uShadeS:t.uShadeS??t.uDistS??{value:null},uShadeRect:t.uShadeRect??s.uniforms.uDistRect,uFadeNear:{value:n},uFadeFar:{value:i}}})}const Lo={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",koa:"#7a4a2a",pondStone:"#8a817a"};function or(s,t,e=7,n=4.6,i=5.2,o=!0,a=.6){const r=pt(Lo.thatch,.18,t),c=pt(Lo.thatchDark,.15,t),l=pt(Lo.stone,.15,t);s.box(0,-a,0,e+1.8,.45+a,n+1.8,l,it.stone);const h=.45,u=h+1.05;s.box(0,h,0,e,u-h,n,r,it.thatch);const f=e/2+.35,d=n/2+.45,g=h+i,v=[-f,u-.15,-d],m=[f,u-.15,-d],p=[-f,g,0],x=[f,g,0],w=[-f,u-.15,d],b=[f,u-.15,d];s.quad(v,p,x,m,r,it.thatch),s.quad(b,x,p,w,r,it.thatch),s.quad(m,x,p,v,c,it.thatch),s.quad(w,p,x,b,c,it.thatch);const y=e/2;if(s.tri([-y,u,-n/2],[-y,u,n/2],[-y,g-.2,0],r,it.thatch),s.tri([y,u,n/2],[y,u,-n/2],[y,g-.2,0],r,it.thatch),s.box(0,g-.12,0,e+.9,.35,.55,c,it.thatch),o){const S=[.05,.035,.025];s.box(y+.15,h,0,.3,1.4,.9,S,0)}}function Pw(s,t,e=8){const n=pt(Lo.koa,.2,t),i=pt("#4a2c18",.2,t),o=e/2;s.box(0,0,0,e*.8,.55,.62,n,it.wood,0,.9),s.box(o*.85,.05,0,e*.2,.6,.4,i,it.wood,0,.5),s.box(-o*.85,.05,0,e*.2,.55,.4,i,it.wood,0,.5);const a=-2.4;for(const r of[-e*.15,e*.15])s.cyl([r,.55,0],[r,.5,a],.06,.06,i,it.wood,4);s.box(0,.05,a,e*.5,.28,.24,i,it.wood,0,.8)}function Dw(s,t){const e=pt("#4d4642",.2,t);for(let n=0;n<5;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,it.stone,n)}const Ga=Math.PI*2,Po=[[0,1,0]];for(let s=0;s<10;s++){const t=s*Math.PI/5,e=s%2?-1:1;Po.push([Math.cos(t)*.8944,e*.4472,Math.sin(t)*.8944])}Po.push([0,-1,0]);const dd=[];for(let s=0;s<5;s++){const t=1+2*s,e=t+1,n=1+(2*s+2)%10,i=1+(2*s+3)%10;dd.push([0,t,n],[t,e,n],[n,e,i],[11,e,i])}function kw(s,t,e,n,i,o,a,r,c,l=0,h=.1,u=1){const f=(m,p,x)=>{const w=Math.max(0,Math.min(1,(x-m)/(p-m)));return w*w*(3-2*w)},d=Po.map((m,p)=>{const x=p===0||p===11?1:1-h+2*h*Math.abs(Math.sin(p*12.9898+l*78.233)*43758.5453%1);return[t+m[0]*i*x,e+m[1]*o,n+m[2]*a*x]}),g=Po.map(m=>{const p=[m[0]/i,m[1]/o,m[2]/a],x=Math.hypot(...p);return[p[0]/x,p[1]/x,p[2]/x]}),v=Po.map(m=>{const p=u+(1-u)*f(-.8,.3,m[1]);return[r[0]*p,r[1]*p,r[2]*p]});for(const m of dd){const[p,x,w]=m.map(T=>d[T]),b=(x[1]-p[1])*(w[2]-p[2])-(x[2]-p[2])*(w[1]-p[1]),y=(x[2]-p[2])*(w[0]-p[0])-(x[0]-p[0])*(w[2]-p[2]),S=(x[0]-p[0])*(w[1]-p[1])-(x[1]-p[1])*(w[0]-p[0]),E=b*(p[0]+x[0]+w[0]-3*t)+y*(p[1]+x[1]+w[1]-3*e)+S*(p[2]+x[2]+w[2]-3*n)>0;for(const T of E?m:[m[0],m[2],m[1]])s.pos.push(d[T][0],d[T][1],d[T][2]),s.nor.push(g[T][0],g[T][1],g[T][2]),s.col.push(v[T][0],v[T][1],v[T][2]),s.mat.push(c),s.feat.push(0)}}function Un(s,{stick:t,r0:e=.4,r1:n=.25,bark:i="#6a6058",limbs:o=[],crowns:a}){const r=new _e,c=pt(i,.1,s);t&&r.cyl([0,0,0],t,e,n,c,it.wood,3);for(const[l,h,u,f]of o)r.cyl(l,h,u,f,c,it.wood,3);for(const[l,h,u,f,d,g,v=it.leaf,m=1,p=1]of a)kw(r,l,h,u,f,d,f,typeof g=="string"?pt(g,.1,s):g,v,m,.1,p);return r.geometry()}function zw(s){const t=new _e,e=pt("#8a7a62",.1,s),n=14;let i=[0,0,0];for(let c=1;c<=4;c++){const l=c/4*n,h=[.06*Math.pow(l,1.5),l,0];t.cyl(i,h,.3-c*.025,.28-c*.03,e,it.wood,5),i=h}const o=i,a=pt("#6E7A3E",.12,s),r=pt("#8f9a43",.1,s);for(let c=0;c<9;c++){const l=c/9*Ga+s()*.3,h=5.2+s()*1.2,u=1.4+s()*.8,f=Math.cos(l),d=Math.sin(l);let g=o;for(let v=1;v<=4;v++){const m=v/4,p=[o[0]+f*h*m,o[1]+u*m-3.8*m*m,o[2]+d*h*m],x=1*Math.sin(Math.PI*Math.min(1,m*1.1))+.15,w=-d*x,b=f*x,y=v>2?r:a;t.quad(g,p,[p[0]+w,p[1]-.35*x,p[2]+b],[g[0]+w*.7,g[1]-.25*x,g[2]+b*.7],y,it.leaf),t.quad([g[0]-w*.7,g[1]-.25*x,g[2]-b*.7],[p[0]-w,p[1]-.35*x,p[2]-b],p,g,y,it.leaf),g=p}}return t.geometry()}function Iw(s){const t=[];for(let c=0;c<4;c++){const l=c/4*Ga+.3;for(const h of[-1,1])t.push([Math.cos(l+h*.35)*6.2,10.2+(h>0?.4:0),Math.sin(l+h*.35)*6.2])}const e=[[2.6,6.1,.9],[2.1,6.4,-1.6],[-1.9,6.2,1.4],[-2.2,5.9,-1.1]],n=[0,1,2,3,4].map(c=>[Math.cos(c/5*Ga)*3.6,3.4,Math.sin(c/5*Ga)*3.6]),i="#56603D",o="#66704A",a="#77825A",r=pt("#5C603F",0,s).map(c=>c*.95);return{ohia:Un(s,{stick:[.3,6.5,.1],bark:"#5A5354",crowns:[[.3,8.6,0,4.6,2.5,r],[2.2,7.7,1,3,1.8,r,it.leaf,2]]}),ohiaKrumm:Un(s,{crowns:[[.6,2.4,.2,5,1.5,"#596537",it.leaf,1,.75]]}),koa:Un(s,{stick:[.2,4,-.3],r0:.6,r1:.45,bark:"#5A504B",limbs:[0,2,4,6].map(c=>{const[l,h]=[t[c],t[c+1]];return[[.2,3.8,-.3],[(l[0]+h[0])/2*.9,(l[1]+h[1])/2-.6,(l[2]+h[2])/2*.9],.3,.14]}),crowns:[0,2,4,6].map((c,l)=>{const[h,u]=[t[c],t[c+1]];return[(h[0]+u[0])/2,(h[1]+u[1])/2+.3,(h[2]+u[2])/2,3,1.55,l===1?"#737B5A":"#5E6A3C",it.leaf,l+1]})}),kukui:Un(s,{stick:[.3,4.2,.1],r0:.45,r1:.35,bark:"#5F5B54",crowns:[[.3,6.5,.1,5.8,3.2,o,it.leaf,1,.62],[.5,8.6,.3,3.4,1.6,a,it.leaf,5,.8],[-2.9,5.6,1.6,2.8,1.9,i,it.leaf,2,.7]]}),ohiaai:Un(s,{stick:[0,2.4,0],r0:.35,r1:.3,bark:"#8A7458",crowns:[[0,6,0,2.4,3.6,"#3A5026"]]}),hau:Un(s,{crowns:[[0,2.2,0,5,2.2,"#6E8A3E"]]}),hala:Un(s,{stick:[.3,3.4,0],r0:.22,r1:.15,bark:"#8E8B82",limbs:[0,2].map(c=>{const[l,h]=e.slice(c,c+2);return[[.3,3.3,0],[(l[0]+h[0])/2,(l[1]+h[1])/2-.45,(l[2]+h[2])/2],.13,.09]}),crowns:e.map((c,l)=>[c[0],c[1]-.35,c[2],1.45,.75,"#55703D",it.leaf,l+1])}),wiliwili:Un(s,{stick:[.1,2.8,.2],r0:.45,r1:.3,bark:"#9C6C44",limbs:n.map(c=>[[.05,2.5,.2],c,.2,.08]),crowns:[[0,3.9,.2,4.8,1.25,"#788C4A",it.leaf,3,.75]]}),lama:Un(s,{stick:[.2,3.2,.1],r0:.25,r1:.18,bark:"#3E3A36",crowns:[[.2,5.4,.1,2.6,2,"#4C5E2E"]]}),aalii:Un(s,{crowns:[[0,1.2,0,1.5,1,"#6F8A4E"]]}),niu:zw(s),milo:Un(s,{stick:[.2,2.2,0],r0:.35,r1:.28,bark:"#8A8070",crowns:[[.2,4.6,0,3.6,2.4,"#4A6426"]]})}}const Cn=3,is=[30,80],Uw=s=>Math.max(is[0],Math.min(is[1],s*2)),au=24e3;function Fw(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}class Nw{constructor(t,e,n,i){const o=Fw(5150),a=Iw(o);this.group=new Ne,this.rect=e,this.nx=Math.ceil((e.x1-e.x0)/Cn),this.nz=Math.ceil((e.z1-e.z0)/Cn),this.mat=Qs(n,i,{fade:[is[0]-7,is[0]]}),this.matDS=Qs(n,i,{fade:[is[0]-7,is[0]],doubleSide:!0}),this.species=[];const r=new ie,c=new _i,l=new W(0,1,0),h=new W,u=new W;this.total=0,Os.forEach((f,d)=>{const g=t.lists[d],v=g.length/_a,m=new Int32Array(v),p=new Int32Array(this.nx*this.nz);for(let R=0;R<v;R++){const D=Math.min(this.nx-1,Math.max(0,Math.floor((g[R*_a]-e.x0)/Cn))),C=Math.min(this.nz-1,Math.max(0,Math.floor((g[R*_a+1]-e.z0)/Cn)));m[R]=C*this.nx+D,p[m[R]]++}const x=new Int32Array(this.nx*this.nz+1);for(let R=0;R<p.length;R++)x[R+1]=x[R]+p[R];const w=x.slice(),b=new Int32Array(v);for(let R=0;R<v;R++)b[w[m[R]]++]=R;for(let R=0;R<p.length;R++)for(let D=x[R+1]-1;D>x[R];D--){const C=x[R]+Math.floor(o()*(D-x[R]+1)),z=b[D];b[D]=b[C],b[C]=z}const y=new Float32Array(v*16),S=new Float32Array(v*3),E=new Float32Array(v);for(let R=0;R<v;R++){const C=b[R]*_a;c.setFromAxisAngle(l,g[C+3]);const z=Fe*g[C+4];h.set(g[C],Kn(g[C+2]),g[C+1]),u.set(z,z,z),r.compose(h,c,u),r.toArray(y,R*16),S[R*3]=g[C+5],S[R*3+1]=g[C+6],S[R*3+2]=g[C+7],E[R]=g[C+8]}const T=Math.min(v,au),M=sr(a[f]),_=new _r(M,f==="niu"||f==="hala"?this.matDS:this.mat,Math.max(1,T));_.name=f,_.count=0,_.frustumCulled=!1,_.instanceMatrix.setUsage(bn),_.instanceColor=new ue(new Float32Array(Math.max(1,T)*3),3),_.instanceColor.setUsage(bn);const A=new ue(new Float32Array(Math.max(1,T)),1);A.setUsage(bn),M.setAttribute("aClear",A),this.group.add(_),this.species.push({kind:f,mesh:_,aClear:A,start:x,mats:y,cols:S,clear:E,cap:T,n:v}),this.total+=v}),this.frustum=new Bi,this.pv=new ie,this.box=new Sn,this.key="",this.drawn=0}update(t,e,n,i){if(this.group.visible=e>.001,!this.group.visible)return;const o=Uw(i),a=o*.42;for(const p of[this.mat,this.matDS])p.uniforms.uFadeNear.value=o*.7,p.uniforms.uFadeFar.value=o;const r=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const c=this.rect,l=[],h=Math.max(0,Math.floor((r.x-o-c.x0)/Cn)),u=Math.min(this.nx-1,Math.floor((r.x+o-c.x0)/Cn)),f=Math.max(0,Math.floor((r.z-o-c.z0)/Cn)),d=Math.min(this.nz-1,Math.floor((r.z+o-c.z0)/Cn));for(let p=f;p<=d;p++)for(let x=h;x<=u;x++){const w=c.x0+x*Cn,b=c.z0+p*Cn;this.box.min.set(w,-.5,b),this.box.max.set(w+Cn,n,b+Cn);const y=this.box.distanceToPoint(r);if(y>o||!this.frustum.intersectsBox(this.box))continue;const S=y<a?1:Math.pow(a/y,1.6);l.push(p*this.nx+x,Math.round(S*20))}const g=l.join(",");if(g===this.key)return;this.key=g;let v=0;for(const p of this.species)for(let x=0;x<l.length;x+=2)v+=Math.ceil((p.start[l[x]+1]-p.start[l[x]])*l[x+1]/20);const m=Math.min(1,au/Math.max(1,v));this.drawn=0;for(const p of this.species){let x=0;for(let w=0;w<l.length;w+=2){const b=l[w],y=p.start[b],S=p.start[b+1]-y,E=Math.min(Math.ceil(S*l[w+1]*m/20),p.cap-x);E<=0||(p.mesh.instanceMatrix.array.set(p.mats.subarray(y*16,(y+E)*16),x*16),p.mesh.instanceColor.array.set(p.cols.subarray(y*3,(y+E)*3),x*3),p.aClear.array.set(p.clear.subarray(y,y+E),x),x+=E)}p.mesh.count=x,p.mesh.instanceMatrix.needsUpdate=!0,p.mesh.instanceColor.needsUpdate=!0,p.aClear.needsUpdate=!0,p.mesh.visible=x>0,this.drawn+=x}}dispose(){for(const t of this.species)t.mesh.geometry.dispose();this.mat.dispose(),this.matDS.dispose()}}const Ow=`
${ze}
${Ve}
${bi}
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
`,Bw=`
${ze}
${so}
${Ve}
${us}
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
`,Ww=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),Gw={water:0,earth:1,band:2,paved:3,stone:4,rail:5};class pd{constructor(t,e){this.shared=t,this.camera=e,this.group=new Ne,this.batches=[],this._res=new Ht}add(t,e={}){const n=[],i=[],o=[];for(const{pts:a,width:r}of t){let c=0;for(let h=0;h+1<a.length;h++)c+=Math.hypot(a[h+1][0]-a[h][0],a[h+1][1]-a[h][1]);let l=0;for(let h=0;h+1<a.length;h++){const[u,f]=a[h],[d,g]=a[h+1],v=Math.hypot(d-u,g-f);if(v<1e-6)continue;const m=Array.isArray(r)?r[h]:r,p=Array.isArray(r)?r[h+1]:r;n.push(u,f,d,g),i.push(m,p,l,l+v),o.push(c),l+=v}}return n.length?this.addPacked({seg:new Float32Array(n),info:new Float32Array(i),end:new Float32Array(o)},e):null}addPacked({seg:t,info:e,end:n,span:i=null,grow:o=null},{mode:a="earth",colour:r=[1,1,1],alpha:c=1,minPx:l=1,lift:h=.004,order:u=5,endFade:f=0,marks:d=!1,year:g=null}={}){if(!(t!=null&&t.length))return null;const v=new io;v.setAttribute("position",new pe(Ww,3)),v.setIndex([0,2,1,1,2,3]),v.setAttribute("aSeg",new ue(t,4)),v.setAttribute("aInfo",new ue(e,4)),v.setAttribute("aEnd",new ue(n,1)),i&&(v.setAttribute("aSpan",new ue(i,4)),v.setAttribute("aGrow",new ue(o,1))),v.instanceCount=t.length/4;const m={...this.shared.uniforms,uCamPos:{value:new W},uPxK:{value:.001},uMinPx:{value:l},uLift:{value:h},uColor:{value:new Bt(...r)},uAlpha:{value:c},uMode:{value:Gw[a]??1},uEndFade:{value:f},uMarks:{value:d?1:0},uYearNow:g||{value:0},uLod:{value:new Ht(0,1e9)}},p=new Ee({vertexShader:Ow,fragmentShader:Bw,uniforms:m,defines:i?{USE_SPAN:""}:{},transparent:!0,depthWrite:!1,side:Ln,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),x=new me(v,p);x.frustumCulled=!1,x.renderOrder=u,this.group.add(x);const w={mesh:x,uniforms:m,alpha:c,count:v.instanceCount};return this.batches.push(w),w}update(t){t.getDrawingBufferSize(this._res);const e=this.camera,n=2*Math.tan(e.fov*Math.PI/360)/Math.max(1,this._res.y/t.getPixelRatio());for(const i of this.batches)i.uniforms.uCamPos.value.copy(e.position),i.uniforms.uPxK.value=n,i.mesh.visible=i.uniforms.uAlpha.value>.003}dispose(){for(const t of this.batches)t.mesh.geometry.dispose(),t.mesh.material.dispose()}}const Bc=8,ln=16,Hw={walk:[0,4],run:[4,4],idle:[8,2],engage:[10,4],fall:[14,3]},Bs=17,ar=["side","front","back"],Ha=["hawaii","oahu","maui"],Vw=["bare","kihei","chief"],ul=["spear","club","musket","sling","dagger","rammer","linstock","gun"],fl={gun:16,sling:16},$w="hHsdetTkKCPmn",jw="gGwWb",Sa={o:"#2a201b",h:"#30241e",s:"#a5704b",d:"#7b5035",e:"#2a201b",w:"#97734a",W:"#5b3d27",g:"#8a8e93",G:"#4a4d52",b:"#16110e",c:"#cdb98e",f:"#fff4c4",F:"#f2a03c",S:"#ddd6ca",Z:"#b5ad9f"},Xw={hawaii:{m:"#b9791f",n:"#8a5717",kihei:"#d9a548",cloak:"#b03a2c",pattern:"#e3b23e",helmet:"#e3b23e",crest:"#b03a2c"},oahu:{m:"#76609e",n:"#544377",kihei:"#a58fcb",cloak:"#dcb03c",pattern:"#2e2824",helmet:"#2e2824",crest:"#dcb03c"},maui:{m:"#a84b22",n:"#7c3518",kihei:"#cf7f4c",cloak:"#a4342a",pattern:"#2e2824",helmet:"#a4342a",crest:"#2e2824"}};function qw(s,t){const e=Xw[s],n={...Sa,m:e.m,n:e.n,t:Sa.s,T:Sa.d,k:Sa.s,K:null,C:null,P:null,H:null};return t==="kihei"?(n.k=e.kihei,n.K=e.kihei):t==="chief"&&(n.t=e.cloak,n.T=e.pattern,n.k=e.cloak,n.K=e.cloak,n.C=e.cloak,n.P=e.pattern,n.h=e.helmet,n.H=e.crest),n}function sn(s,t=0,e=0){const n={};for(const[i,o]of Object.entries(s)){const a=Number(i)+e;a<0||a>=ln||(n[a]=t>=0?".".repeat(t)+o:o.slice(-t))}return n}function ui(...s){const t={};for(const e of s)if(e)for(const[n,i]of Object.entries(e)){const o=(t[n]||"").padEnd(i.length,".").split("");for(let a=0;a<i.length;a++)i[a]!=="."&&(o[a]=i[a]);t[n]=o.join("")}return t}const qi=(s,t=null,e=null)=>({body:s,over:t?[t]:[],under:e?[e]:[]}),md={0:"..HHH...",1:"..hhh...",2:"..hse...",3:"..sss...",4:"...d...."},Yw=sn(md,1),gd={5:".Kktt...",6:".Kktt...",7:".KktT...",8:".CkTt..."},Kw=sn(gd,1),Zw={5:".....s..",6:".....s..",7:".....s.."},Jw={5:".....s..",6:".....s.."},Qw={5:"....ss..",6:"......s."},ty={5:"....s...",6:"...ss..."},ey={1:"....s...",2:".....s..",3:".....s..",4:"....s..."},ss={9:".Cmmn..."},ny={...ss,10:".Cdns...",11:"..d.s...",12:"..d.s...",13:"..d.s...",14:"..ddss.."},iy=[{...ss,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".d...ss."},{...ss,10:".C.dn...",11:"...ds...",12:"...ds...",13:"...dss..",14:"...dd..."},{...ss,10:".Csnd...",11:"..s..d..",12:".s...d..",13:".s...d..",14:".s...dd."},{...ss,10:".C.sn...",11:"...sd...",12:"...sd...",13:"...sdd..",14:"...ss..."}],_o=sn(ss,1),sy=[{..._o,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:"d.....s.",14:"......ss"},{..._o,10:"..C.dn..",11:"...dss..",12:"...d..s.",13:"..dd....",14:"........"},{..._o,10:"..Csnd..",11:"..s...d.",12:".s....d.",13:"s.....d.",14:"......dd"},{..._o,10:"..C.sn..",11:"...sdd..",12:"...s..d.",13:"..ss....",14:"........"}],oy={...ss,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".dd..ss."},ay={..._o,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:".d.....s",14:"dd.....s"},ry={1:"......s.",2:"......s.",3:".....s..",4:".....s.."},cy={9:"..Cmmn..",10:"..Cdns..",11:".dd...s.",12:"d.....s.",13:".....s.."},ru={side:["........","...hhh..","...hse..",".Kktsss.",".KktTds.",".Cmmdds.","...ddss.","........"],front:["........","..hhhh..","..sees..",".sktTks.",".sddsss.","..mmmm..","..dssd..","........"],back:["........","..hhhh..","..hhhh..",".skkTts.",".sCCCCs.","..mmmm..","..dssd..","........"]};function cu(s,t){let e=s.map(i=>i.split(""));for(let i=0;i<t;i++)e=e[0].map((o,a)=>e.map(r=>r[a]).reverse());const n={};return e.forEach((i,o)=>n[o+5]=i.join("")),n}const lu={0:"...HH...",1:"..hhhh..",2:"..hssh..",3:"..ssss..",4:"...dd..."},hu={5:"..kktt..",6:"..tkkT..",7:"..ttkk..",8:"..tTTt.."},uu={5:".CC..CC.",6:".CP..PC.",7:".CC..CC.",8:".CC..CC.",9:".C....C.",10:".C....C."},ly={5:".s....s.",6:".s....s.",7:".s....s."},Ea={5:"......s.",6:"......s.",7:"......s."},Wc={5:".s......",6:".s......"},hy={1:".s......",2:".s......",3:".s......",4:".s......"},uy={5:".s......",6:"..s....."},fy={5:".s....s.",6:"..s..s.."},ni=(s,t)=>({9:"..mmmm..",10:s,...t}),rr={11:"..sdds..",12:"..sdds..",13:"..s..s..",14:".ss..ss."},vd=[{11:"..sdds..",12:"..s.ss..",13:"..s.ss..",14:".ss....."},rr,{11:"..sdds..",12:"..ss.s..",13:"..ss.s..",14:".....ss."},rr],xd=[{11:"..sdds..",12:"..s.ss..",13:"..s.....",14:".ss....."},{11:"..sdds..",12:".s....s.",13:".s....s.",14:"........"},{11:"..sdds..",12:"..ss.s..",13:".....s..",14:".....ss."},{11:"..sdds..",12:".s....s.",13:".s....s.",14:"........"}],wd={11:"..sdds..",12:".sd..ds.",13:".s....s.",14:"ss....ss"},yd={11:".sd..ds.",12:"s......s",13:"........"},dy=ni("..smnd..",rr),py=vd.map(s=>ni("..smnd..",s)),my=xd.map(s=>ni("..smnd..",s)),gy=[{5:".s....s.",6:".s.....s"},{5:".s....s.",6:".s....s."},{5:".s....s.",6:"s.....s."},{5:".s....s.",6:".s....s."}],fu=ni("..smnd..",wd),vy=ni("..smnd..",yd),Md={1:"s......s",2:"s......s",3:".s....s.",4:".s....s."},du={0:"...HH...",1:"..hhhh..",2:"..hhhh..",3:"..hhhh..",4:"...dd..."},pu={5:"..tttt..",6:"..tTTt..",7:"..tTTt..",8:"..tttt.."},mu={5:"..kkk...",6:"..kkkk..",7:"...kkk..",8:"....kk.."},gu={5:".CCCCCC.",6:".CPCCPC.",7:".CCPPCC.",8:".CPCCPC.",9:".CCCCCC.",10:"..CCCC.."},xy={5:".s....s.",6:".s....s.",7:".s....s."},Aa={5:".s......",6:".s......",7:".s......"},_d={5:"......s.",6:"......s."},wy={1:"......s.",2:"......s.",3:"......s.",4:"......s."},yy={3:"......s.",4:"......s.",5:"......s."},My={5:"......s.",6:".......s",7:".......s"},_y={3:".s....s.",4:".s....s.",5:".s....s."},by=ni("..dnms..",rr),Sy=vd.map(s=>ni("..dnms..",s)),Ey=xd.map(s=>ni("..dnms..",s)),Ay=[{5:".s....s.",6:"s.....s."},{5:".s....s.",6:".s....s."},{5:".s....s.",6:".s.....s"},{5:".s....s.",6:".s....s."}],vu=ni("..dnms..",wd),Ty=ni("..dnms..",yd),Cy=Md,Ry={side:(s,t,e=!1)=>e?[Yw,Kw,t,s]:[md,gd,t,s],front:(s,t,e=!1)=>e?[s,sn(lu,0,1),sn(hu,0,1),sn(uu,0,1),sn(t,0,1)]:[s,lu,hu,uu,t],back:(s,t,e=!1)=>e?[s,sn(du,0,1),sn(pu,0,1),sn(mu,0,1),sn(gu,0,1),sn(t,0,1)]:[s,du,pu,mu,gu,t]},Ly={side:{stand:ny,walk:iy,run:sy,brace:oy,lunge:ay,leap:cy,flung:ry},front:{stand:dy,walk:py,run:my,brace:fu,lunge:fu,leap:vy,flung:Md},back:{stand:by,walk:Sy,run:Ey,brace:vu,lunge:vu,leap:Ty,flung:Cy}},Py={side:{down:Zw,grip:Jw,out:Qw,back:ty,up:ey,free:null,pump:null},front:{down:ly,grip:ui(Ea,Wc),out:ui(Ea,uy),back:ui(Ea,Wc),up:ui(Ea,hy),both:fy,pump:gy},back:{down:xy,grip:ui(Aa,_d),out:ui(Aa,yy),back:ui(Aa,My),up:ui(Aa,wy),both:_y,pump:Ay}};function Dy(s,t){const e=Ry[s],n=Ly[s],i=Py[s],o=t[s],a=[],r=s==="side";for(let c=0;c<4;c++)a.push(qi(e(n.walk[c],i[o.walk.arm]||i.down),o.walk.over,o.walk.under));for(let c=0;c<4;c++){const l=r?sn(i[o.run.arm]||i.down,1):ui(i.pump[c],o.run.arm==="grip"?s==="front"?Wc:_d:null);a.push(qi(e(n.run[c],l,r),o.run.over,o.run.under))}for(const c of o.idle)a.push(qi(e(n.stand,i[c.arm]||i.down),c.over,c.under));for(const[c,l,h,u]of o.engage)a.push(qi(e(n[l],i[c]||i.down,l==="lunge"),h,u));return a.push(qi(e(n.leap,n.flung,r),o.leap||null)),a.push(qi([cu(ru[s],1)])),a.push(qi([cu(ru[s],2)])),a}const wn=(s,t,e=6)=>{const n={};for(let i=s;i<=t;i++)n[i]=".".repeat(e)+"w";return n[s]=".".repeat(e)+"W",n},ky={side:{walk:{arm:"down",over:wn(0,10)},run:{arm:"down",over:{8:"wwwwwwwW"}},idle:[{arm:"down",over:wn(0,14)},{arm:"grip",over:{...wn(1,14),0:".......W",1:"......w."}}],engage:[["back","brace",{6:"wwwwW..."}],["out","lunge",{6:"..wwwwwW"}],["grip","brace",{1:".......W",2:"......w.",3:"......w.",4:".....w..",5:".....w..",6:"....w...",7:"....w..."}],["grip","brace",{1:".......W",2:"......w.",3:"......w.",4:".....w..",5:".....w..",6:"....w...",7:"....w..."}]],leap:{0:".......W",1:"......w.",2:".....w..",3:"....w..."}},front:{walk:{arm:"grip",over:wn(0,11,0)},run:{arm:"grip",over:{7:"..w.....",8:"..W....."}},idle:[{arm:"grip",over:wn(0,14,0)},{arm:"down",over:{...wn(1,14,0),0:".W......"}}],engage:[["up","brace",{0:"....w...",1:"...w....",2:"..w.....",3:".w......",4:"W......."}],["out","lunge",{7:"..w.....",8:".WW.....",9:"..W....."}],["grip","brace",wn(0,12,0)],["grip","brace",wn(0,12,0)]],leap:{0:"W.......",1:"w.......",2:".w......"}},back:{walk:{arm:"grip",over:wn(0,11,7)},run:{arm:"grip",over:{2:".......W",3:".......w",4:"......w.",5:"......w."}},idle:[{arm:"grip",over:wn(0,14,7)},{arm:"down",over:{...wn(1,14,7),0:"......W."}}],engage:[["back","brace",{2:".......W",3:".......w",4:".......w",5:"......w.",6:"......w.",7:"......w.",8:".....w..",9:".....w.."}],["out","lunge",{0:"......W.",1:"......w.",2:"......w."}],["grip","brace",wn(0,12,7)],["grip","brace",wn(0,12,7)]],leap:{0:".......W",1:".......w",2:"......w."}}},zy={side:{walk:{arm:"grip",over:{5:"WWwwww.."}},run:{arm:"grip",over:{1:"......WW",2:"......WW",3:"......w.",4:"......w.",5:"......w."}},idle:[{arm:"down",over:{7:"......w.",8:"......w.",9:"......WW",10:"......WW"}},{arm:"down",over:{7:"......w.",8:"......w.",9:".....WW.",10:".....WW."}}],engage:[["up","brace",null,{0:"WWwww...",1:"WW......"}],["out","lunge",{6:".......w",7:"......WW",8:"......WW"}],["down","brace",{8:"......w.",9:"......w.",10:".....WW.",11:".....WW."}],["down","brace",{8:"......w.",9:"......w.",10:".....WW.",11:".....WW."}]],leap:{0:"......WW",1:"......WW"}},front:{walk:{arm:"grip",over:{3:"WW......",4:"Ww......"}},run:{arm:"grip",over:{1:".WW.....",2:".WW.....",3:".w......",4:".w......"}},idle:[{arm:"down",over:{8:".w......",9:".w......",10:"WW......",11:"WW......"}},{arm:"down",over:{8:".w......",9:"w.......",10:"WW......",11:"W......."}}],engage:[["up","brace",null,{0:"..wwWW..",1:"....WW.."}],["out","lunge",{6:"..WW....",7:"..WW...."}],["down","brace",{8:".w......",9:".w......",10:"WW......",11:"WW......"}],["down","brace",{8:".w......",9:".w......",10:"WW......",11:"WW......"}]],leap:{0:"WW......",1:"WW......"}},back:{walk:{arm:"grip",over:{3:"......WW",4:"......wW"}},run:{arm:"grip",over:{1:".....WW.",2:".....WW.",3:"......w.",4:"......w."}},idle:[{arm:"down",over:{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}},{arm:"down",over:{8:"......w.",9:".......w",10:"......WW",11:".......W"}}],engage:[["up","brace",{0:"..WWww..",1:"..WW...."}],["out","lunge",{1:"......W.",2:"......W."}],["down","brace",{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}],["down","brace",{8:"......w.",9:"......w.",10:"......WW",11:"......WW"}]],leap:{0:"......WW",1:"......WW"}}},Vn=(s,t=6)=>{const e={},n=".".repeat(t);for(let i=s;i<s+6;i++)e[i]=n+"G";e[s]=n+"g";for(let i=s+6;i<=14;i++)e[i]=n+"W";return e},Iy={side:{walk:{arm:"grip",over:{6:".....W..",7:".....WW."},under:{0:".g......",1:".G......",2:".G......",3:"..G.....",4:"..G.....",5:"...G....",6:"....G..."}},run:{arm:"grip",over:{1:".......g",2:"......G.",3:"......G.",4:".....G..",5:".....W..",6:"....W...",7:"...W...."}},idle:[{arm:"grip",over:Vn(3)},{arm:"down",over:Vn(3)}],engage:[["out","brace",{4:"..WWGGGg"}],["out","brace",{3:".......F",4:".WWGGGgf",5:".......F"}],["grip","brace",{0:"......SS",1:".....SSZ",2:"......Z.",5:".....W..",6:"......G.",7:"......G."},{2:".......g"}],["grip","brace",{0:".....SS.",1:"....SZ..",5:".....W..",6:"......G.",7:"......G."},{2:".......g"}]],leap:{0:"......g.",1:"......G.",2:".....W.."}},front:{walk:{arm:"grip",over:{6:".W......"},under:{0:"g.......",1:"G.......",2:"G.......",3:".G......",4:".G......",5:".G......"}},run:{arm:"grip",over:{4:"......g.",5:".....G..",6:"....G...",7:"...W....",8:"..W....."}},idle:[{arm:"grip",over:Vn(3,0)},{arm:"down",over:Vn(3,0)}],engage:[["both","brace",{3:".gg.....",4:".gb.....",5:"..W....."}],["both","brace",{1:".F......",2:"FfF.....",3:"fffF....",4:"FfF.....",5:".F......"}],["grip","brace",{0:".SSZ....",1:"SZSS....",2:".SZ....."},Vn(5,0)],["grip","brace",{0:"SZ......",1:".S......"},Vn(5,0)]],leap:{0:"g.......",1:"G.......",2:".W......"}},back:{walk:{arm:"grip",over:{6:"......W."},under:{0:".......g",1:".......G",2:".......G",3:"......G.",4:"......G.",5:"......G."}},run:{arm:"grip",over:{4:".g......",5:"..G.....",6:"...G....",7:"....W...",8:".....W.."}},idle:[{arm:"grip",over:Vn(3,7)},{arm:"down",over:Vn(3,7)}],engage:[["both","brace",{1:"......g.",2:"......G.",3:"......G.",4:"......W."}],["both","brace",{0:".....FfF",1:"......f.",2:"......G.",3:"......G.",4:"......W."}],["grip","brace",{0:"....SSZ.",1:".....ZSS",2:"......S."},Vn(5,7)],["grip","brace",{0:".....ZS.",1:"......S."},Vn(5,7)]],leap:{0:".......g",1:".......G",2:"......W."}}},Uy={side:{walk:{arm:"down",over:{8:".........c",9:".........c",10:".........cg"}},run:{arm:"down",over:{8:".......cc.",9:"......g..."}},idle:[{arm:"down",over:{8:".........c",9:".........c",10:".........cg"}},{arm:"down",over:{8:".........c",9:"..........c",10:"..........cg"}}],engage:[["up","brace",null,{0:".....gccc"}],["up","brace",{0:"........ccg"}],["out","lunge",{4:".............g",5:"...........c"}],["out","brace",{3:"...............g",6:"..........c",7:"..........c"}]],leap:{0:"..........c",1:"..........c"}},front:{walk:{arm:"grip",over:{7:".....c",8:".....c",9:"....gc"}},run:{arm:"grip",over:{7:"....c.",8:"...cg."}},idle:[{arm:"down",over:{8:".....c",9:".....c",10:"....gc"}},{arm:"down",over:{8:".....c",9:"....c.",10:"...gc."}}],engage:[["up","brace",null,{0:"..gccc"}],["up","brace",{0:".....ccccg"}],["out","lunge",{8:"...g",7:"....c"}],["out","brace",{11:".g",8:".....c"}]],leap:{0:".....c",1:".....c"}},back:{walk:{arm:"grip",over:{7:"..........c",8:"..........c",9:"..........cg"}},run:{arm:"grip",over:{7:"...........c",8:"...........gc"}},idle:[{arm:"down",over:{8:"..........c",9:"..........c",10:"..........cg"}},{arm:"down",over:{8:"..........c",9:"...........c",10:"...........cg"}}],engage:[["up","brace",{0:".....gcccc"}],["up","brace",null,{0:"..........cccg"}],["out","lunge",{1:"............g",2:"...........c"}],["out","brace",{0:"..............g",4:"...........c"}]],leap:{0:"..........c",1:"..........c"}}},Fy={side:{walk:{arm:"down",over:{8:".....W..",9:".....g.."}},run:{arm:"grip",over:{6:"......Wg"}},idle:[{arm:"down",over:{8:".....W..",9:".....g.."}},{arm:"grip",over:{4:"......g.",5:"......W."}}],engage:[["up","brace",{0:"....Wg.."}],["out","lunge",{6:".......W",7:".......g"}],["grip","brace",{4:"......g.",5:"......W."}],["grip","brace",{4:"......g.",5:"......W."}]],leap:null},front:{walk:{arm:"down",over:{8:".W......",9:".g......"}},run:{arm:"grip",over:{6:"..g....."}},idle:[{arm:"down",over:{8:".W......",9:".g......"}},{arm:"grip",over:{4:".g......",5:".W......"}}],engage:[["up","brace",{0:".g......"}],["out","lunge",{7:"..W.....",8:"..gg...."}],["grip","brace",{4:".g......",5:".W......"}],["grip","brace",{4:".g......",5:".W......"}]],leap:null},back:{walk:{arm:"down",over:{8:"......W.",9:"......g."}},run:{arm:"grip",over:{4:"......g."}},idle:[{arm:"down",over:{8:"......W.",9:"......g."}},{arm:"grip",over:{3:"......g.",4:"......W."}}],engage:[["up","brace",{0:"......g."}],["out","lunge",{1:"......g.",2:"......W."}],["grip","brace",{3:"......g.",4:"......W."}],["grip","brace",{3:"......g.",4:"......W."}]],leap:null}},yn=(s,t,e=6)=>{const n={};for(let i=s;i<=t;i++)n[i]=".".repeat(e)+"w";return n[s]=".".repeat(Math.max(0,e-1))+(e>0?"WW":"W"),n},Ny={side:{walk:{arm:"down",over:yn(0,10)},run:{arm:"down",over:{7:"wwwwwwWW"}},idle:[{arm:"down",over:yn(0,14)},{arm:"grip",over:yn(1,14)}],engage:[["out","brace",{6:"..wwwwWW"}],["out","lunge",{6:"...wwwwW"}],["back","brace",{6:"wwwwwW.."}],["back","brace",{6:"wwwwwW.."}]]},front:{walk:{arm:"grip",over:yn(0,11,0)},run:{arm:"grip",over:{6:"WWwwww.."}},idle:[{arm:"grip",over:yn(0,14,0)},{arm:"down",over:yn(1,14,0)}],engage:[["both","brace",{5:"WW......",6:".wwww..."}],["both","lunge",{7:"Wwwww..."}],["grip","brace",yn(0,12,0)],["grip","brace",yn(0,12,0)]]},back:{walk:{arm:"grip",over:yn(0,11,7)},run:{arm:"grip",over:{6:"..wwwwWW"}},idle:[{arm:"grip",over:yn(0,14,7)},{arm:"down",over:yn(1,14,7)}],engage:[["both","brace",{2:"......WW",3:"......w.",4:"......w.",5:".....w..",6:".....w.."}],["both","lunge",{0:"......WW",1:"......w.",2:"......w.",3:".....w.."}],["grip","brace",yn(0,12,7)],["grip","brace",yn(0,12,7)]]}},Qe=(s,t,e=6)=>{const n={};for(let i=s;i<=t;i++)n[i]=".".repeat(e)+"w";return n[s]=".".repeat(e)+"F",n},Oy={side:{walk:{arm:"down",over:Qe(0,10)},run:{arm:"down",over:{4:".......F",5:"......w.",6:".....w..",7:"....w...",8:"...w...."}},idle:[{arm:"down",over:Qe(0,14)},{arm:"down",over:{...Qe(1,14),0:"......f."}}],engage:[["out","brace",{7:"......w.",8:"......w.",9:".......w",10:".......F"}],["out","lunge",{7:".......w",8:".......w",9:".......w",10:".......w",11:".......f"}],["grip","brace",Qe(0,9)],["grip","brace",Qe(0,9)]]},front:{walk:{arm:"grip",over:Qe(0,11,0)},run:{arm:"grip",over:{3:"F.......",4:".w......",5:"..w....."}},idle:[{arm:"grip",over:Qe(0,14,0)},{arm:"down",over:{...Qe(1,14,0),0:"f......."}}],engage:[["grip","brace",{6:".w......",7:"w.......",8:"F......."}],["out","lunge",{7:".w......",8:"w.......",9:"f......."}],["grip","brace",Qe(0,9,0)],["grip","brace",Qe(0,9,0)]]},back:{walk:{arm:"grip",over:Qe(0,11,7)},run:{arm:"grip",over:{3:".......F",4:"......w.",5:".....w.."}},idle:[{arm:"grip",over:Qe(0,14,7)},{arm:"down",over:{...Qe(1,14,7),0:".......f"}}],engage:[["grip","brace",{4:".......F",5:"......w.",6:"......w."}],["out","lunge",{3:".......f",4:"......w.",5:"......w."}],["grip","brace",Qe(0,9,7)],["grip","brace",Qe(0,9,7)]]}},zs={9:"....gggggggggg..",10:"..GGGGWWWGGGGG..",11:"...WWW.w.W...G..",12:"..WW.WwwwW......",13:".WW..W.w.W......",14:"WW....WWW......."},By={...zs,11:"...WWWw.wW...G..",12:"..WW.W.w.W......",13:".WW..Ww.wW......"},xo={8:"..ww..gggg..ww..",9:"..WW..gbbg..WW..",10:"..WW.WgbbgW.WW..",11:"..WWWWWggWWWWW..",12:"..WW..W..W..WW..",13:"..ww........ww.."},wo={8:"..ww...gg...ww..",9:"..WW..GggG..WW..",10:"..WW.WGGGGW.WW..",11:"..WWWWWWWWWWWW..",12:"..WW...WW...WW..",13:"..ww...WW...ww..",14:".......WW......."},tn=(s,t=null,e=0,n=0)=>({body:[sn(s,e,n)],over:t?[t]:[],under:[]}),bd={side:[...[0,1,0,1,0,1,0,1,0,0].map(s=>tn(s?By:zs)),tn(zs,{8:"..............F.",9:"..............fF",10:"..............ff",11:"..............F."}),tn(zs,{6:"............SS..",7:"...........SSSS.",8:"..........SSSZS.",9:"...........ZSS..",10:"............Z..."},-1),tn(zs,{3:"...........SS...",4:"..........SZSS..",5:"...........ZS..."}),tn(zs,{2:"............S..."})],front:[...[0,0,0,0,0,0,0,0,0,0].map(()=>tn(xo)),tn(xo,{5:".......FF.......",6:".....FfffF......",7:"....FfffffF.....",8:"...FfffffffF....",9:"....FfffffF.....",10:".....FfffF......",11:".......FF......."}),tn(xo,{4:"......SSZ.......",5:"....SSSSSS......",6:"...SZSSSSZS.....",7:"....SSZSS.......",8:"......S........."},0,-1),tn(xo,{1:".......SS.......",2:".....SZSSS......",3:"......ZS........"}),tn(xo,{0:"......S........."})],back:[...[0,0,0,0,0,0,0,0,0,0].map(()=>tn(wo)),tn(wo,{4:".......FF.......",5:"......FffF......",6:".......ff.......",7:".......FF......."}),tn(wo,{3:"......SSZ.......",4:".....SZSSS......",5:"......SSZ......."},0,1),tn(wo,{0:"......SS........",1:".....SZSS.......",2:"......Z........."}),tn(wo,{0:".......S........"})]};for(const s of ar)bd[s].push(...[0,1,2].map(()=>({body:[],over:[],under:[]})));const Wy={spear:ky,club:zy,musket:Iy,sling:Uy,dagger:Fy,rammer:Ny,linstock:Oy},Va={};for(const s of ul){Va[s]={};for(const t of ar)if(s==="gun")Va.gun[t]=bd[t];else{const e=Dy(t,Wy[s]);Va[s][t]=fl[s]?e.map(n=>({body:n.body.map(i=>sn(i,4)),over:n.over,under:n.under})):e}}function Gy(){const s=[];for(const t of Ha){for(const e of["bare","kihei"])for(const n of["spear","club","musket","sling","dagger"])s.push({kind:n,side:t,dress:e});for(const e of["spear","club"])s.push({kind:e,side:t,dress:"chief"})}return s.push({kind:"rammer",side:"hawaii",dress:"bare"},{kind:"linstock",side:"hawaii",dress:"kihei"},{kind:"gun",side:"hawaii",dress:"bare"}),s}const Hy=200,Vy=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];function cc(s,t,e){const n=Array.from({length:ln},()=>new Array(t).fill("."));for(const i of s)for(const[o,a]of Object.entries(i)){const r=Number(o);if(!(r<0||r>=ln))for(let c=0;c<Math.min(t,a.length);c++){const l=a[c];l!=="."&&e[l]&&(n[r][c]=l)}}return n}function $y(s,t,e,n){const i=cc(s.body,t,e),o=cc(s.over,t,e),a=cc(s.under,t,e),r=(h,u)=>u>=0&&u<ln&&h>=0&&h<t&&n.includes(i[u][h]),c=new Uint8Array(t*ln*4),l=(h,u,f)=>{if(f===".")return;const d=e[f];d&&c.set([...Vy(d),f==="f"||f==="F"?Hy:255],(u*t+h)*4)};for(let h=0;h<ln;h++)for(let u=0;u<t;u++)l(u,h,a[h][u]),!r(u,h)&&(r(u-1,h)||r(u+1,h)||r(u,h-1)||r(u,h+1))&&l(u,h,"o"),l(u,h,i[h][u]),l(u,h,o[h][u]);return c}function jy(){const s=Gy(),t=ar.length*Bs*16,e=s.length*ln,n=new Uint8Array(t*e*4),i=new Map;s.forEach((r,c)=>{const l=fl[r.kind]||Bc;r.w=l;const h=qw(r.side,r.dress),u=r.kind==="gun"?jw:$w;ar.forEach((f,d)=>{Va[r.kind][f].forEach((g,v)=>{const m=$y(g,l,h,u),p=(d*Bs+v)*l;for(let x=0;x<ln;x++)n.set(m.subarray(x*l*4,(x+1)*l*4),((c*ln+x)*t+p)*4)})}),i.set(`${r.kind}/${r.side}/${r.dress}`,{y:c*ln,w:l})});const o=(r,c,l)=>i.get(`${r}/${c}/${l}`)||i.get(`${r}/${c}/bare`)||i.get(`${r}/hawaii/bare`)||i.get(`${r}/hawaii/kihei`);return{width:t,height:e,data:n,rows:s,facingW:Bs,cell:(r,c,l,h,u,f=0)=>{const d=o(r,c,l),[g,v]=Hw[h];return[(f*Bs+g+u%v)*d.w,d.y,d.w,ln]},at:o,has:(r,c,l)=>i.has(`${r}/${c}/${l}`)}}const Sd=`
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
`,Ed=`
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
`,Xy=`
${ze}
${Ve}
${us}
${Sd}
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
`,qy=`
${ze}
${Ed}
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
`,Yy=`
${ze}
${Ve}
${Sd}
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
`,Ky=`
${ze}
${Ed}
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
`,Zy=2400,Mn={file:0,knot:1,pacer:2,rank:3,duel:4,piece:5,crew:6,ring:7,leap:8},yo=Object.fromEntries(ul.map((s,t)=>[s,t])),Mo=0,xu=4,Ta=8,Ca=10,Jy=14,Ie={right:0,left:1,front:2,back:3},wu=[0,0,1,2],yu=1.25,Qy=9,tM=20,Mu=.35,eM=["march","run","stand","engage","surround","leap"],lc=["spear","club","sling","dagger","musket"],nM=["spear","club","dagger"],Fn={run:.6,least:18,across:9,up:13,pull:70,fade:10,air:1.6,gap:1.1},$n={up:20,down:30,dirs:72,step:.05,far:8,clear:.1},cr=(8/85)**1.5;function iM(s){return 1+3*((8/Math.max(s,.5))**1.5-cr)/(1-cr)}function sM(s){return 8/(cr+(s-1)*(1-cr)/3)**(2/3)}function oM(s,t){return Math.max(2,Math.min(4*t,iM(s)*t))}const qn=.3,Ws=.2,_u=2;class aM{constructor(){this.L=NaN,this.s=NaN,this.k=2,this.t=0}step(t,e,n,i){Number.isFinite(this.L)||(this.L=Math.round(t));const o=Math.abs(t-this.s)>1e-4;this.s=t;let a=Math.max(t-Ws,Math.min(t+Ws,this.L));const r=Math.floor(a),c=a-r;(!o||e===0)&&c>.5-qn/2&&c<.5+qn/2&&(a=r+(c<.5?.5-qn/2:.5+qn/2)),e===0?this.L=a:this.L+=Math.max(-_u*e,Math.min(_u*e,a-this.L)),this.L=Math.max(n,Math.min(i,this.L));const l=Math.floor(this.L+1e-9);this.k=l;const h=l>=i?0:(this.L-l-(.5-qn/2))/qn;return this.t=h<1e-6?0:h>1-1e-6?1:h,this}}function rM(s){const t=[];for(let e=2;e<4*s;e++){const n=i=>+sM(i/s).toFixed(2);t.push({k:e,in:[n(e+.5-qn/2+Ws),n(e+.5+qn/2+Ws)],out:[n(e+.5+qn/2-Ws),n(e+.5-qn/2-Ws)]})}return t}function cM(s,t,e){const n=s.length;let i=Math.atan2(e,t)/(2*Math.PI);i<0&&(i+=1);const o=Math.floor(i*n)%n;return Math.min(s[o],s[(o+1)%n])}function lM(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const hM=/\bretreat|\bpursu|\bfalls? back|\bescap|\bflee(s|ing)?\b|\brout(ed|s)?\b|\bgot away|\bover the ridge|\bold path/i,uM=/\bposts?\b|ashore|encamp|in order/i;function fM(s){const t=`${s.name||""} ${s.note||""}`;return hM.test(t)?"run":uM.test(`${s.name||""}`)||/putting itself in order|encamped|organising/i.test(s.note||"")?"stand":"walk"}function dM(s){const t=s.p.behaviour;if(eM.includes(t))return t;if(s.line)return"engage";const e=fM(s.p);return e==="walk"?"march":e}function Ue(s,t,e){const n=s.cum,i=s.pts;let o=1;for(;o<n.length-1&&n[o]<t;)o++;const a=i[o-1],r=i[o],c=n[o]-n[o-1]||1,l=Math.max(0,Math.min(1,(t-n[o-1])/c));return e[2]=(r[0]-a[0])/c,e[3]=(r[1]-a[1])/c,e[0]=a[0]+(r[0]-a[0])*l,e[1]=a[1]+(r[1]-a[1])*l,e}const bu=s=>s.p.stop===null||s.p.stop===void 0?null:[s.p.stop].flat(),Ra=(s,t)=>{const e=bu(s),n=bu(t);return!e||!n||e.some(i=>n.includes(i))};function pM(s,t,e){const n=t.reduce((c,l)=>c+Math.max(0,s[l]||0),0)||1,i=t.map(c=>Math.max(0,s[c]||0)/n*e),o=i.map(Math.floor);let a=e-o.reduce((c,l)=>c+l,0);const r=i.map((c,l)=>[c-Math.floor(c),l]).sort((c,l)=>l[0]-c[0]);for(let c=0;a>0;c++,a--)o[r[c%r.length][1]]++;return Object.fromEntries(t.map((c,l)=>[c,o[l]]))}class bo{constructor(t,e,n,i=null){this.app=t,this.recs=e,this.ground=i,this.sheet=jy();const o=lM(1795),a=e.map(()=>[]);this.fronts=[],this.pairs=[],this.guns=[];for(const E of e)E.behaviour=dM(E),E.arms=E.p.arms&&typeof E.p.arms=="object"?E.p.arms:null,E.enemy=this.enemyOf(E,e);const r=e.filter(E=>E.line),c=new Set;for(const E of r)for(const T of r){if(E===T||c.has(E)||c.has(T)||E.event!==T.event||E.side===T.side||JSON.stringify(E.p.stop??E.step)!==JSON.stringify(T.p.stop??T.step))continue;const[M,_]=this.mid(E),[A,R]=this.mid(T);if(Math.hypot(M-A,_-R)>4)continue;const[D,C]=E.side==="oahu"?[T,E]:[E,T];c.add(D),c.add(C),this.planFront(D,C,a,e,o)}for(const E of e){if(E.line||E.behaviour!=="run")continue;const T=this.heading(E);let M=null,_=5;for(const A of e){if(A===E||A.line||A.behaviour!=="run"||A.event!==E.event||A.side===E.side||!Ra(A,E)||A.chase)continue;const R=this.heading(A);if(T[0]*R[0]+T[1]*R[1]<.9)continue;const D=Math.hypot(E.pts[0][0]-A.pts[0][0],E.pts[0][1]-A.pts[0][1]);(A.pts[0][0]-E.pts[0][0])*T[0]+(A.pts[0][1]-E.pts[0][1])*T[1]<0||D<_&&(_=D,M=A)}M&&E.side!=="oahu"&&(E.chase=M)}const l=e.map((E,T)=>T).sort((E,T)=>(e[E].chase?1:0)-(e[T].chase?1:0));for(const E of l){const T=e[E];T.line&&!c.has(T)?this.planRanks(T,null,a[E],o):T.line||this.planForce(T,a[E],o,e)}e.forEach((E,T)=>this.armOut(E,a[T],o));const h=a.reduce((E,T)=>E+T.length,0);this.count=h;const u=Math.max(1,h),f=()=>new Float32Array(u),d=()=>new Uint8Array(u),g=()=>new Int8Array(u);this.f={rec:new Uint16Array(u),mode:d(),kind:d(),side:d(),dress:d(),row:f(),cw:f(),s:f(),s0:f(),lat:f(),spd:f(),thr:f(),inAt:f(),outAt:f(),far:f(),ph:f(),tm:f(),tt:f(),st:d(),off:f(),offTo:f(),face:d(),hand:d(),mirror:g(),grp:new Int16Array(u),role:d(),row2:d(),vis:f(),gm:f(),gx:f(),gz:f(),x:f(),z:f(),hx:f(),hz:f(),lift:f(),air:d(),k:f(),tint:f(),wet:d(),fr:d(),dx:g(),dy:g(),dx0:g(),dy0:g()};const v=this.f;let m=0;e.forEach((E,T)=>{E.o=m,E.n=a[T].length;for(const M of a[T]){const _=m++;v.rec[_]=T,v.mode[_]=Mn[M.mode],v.kind[_]=yo[M.kind],v.side[_]=Ha.indexOf(M.side),v.dress[_]=Vw.indexOf(M.dress);const A=this.sheet.at(M.kind,M.side,M.dress);v.row[_]=A.y,v.cw[_]=A.w,v.s[_]=v.s0[_]=M.s??0,v.lat[_]=M.lat??0,v.spd[_]=M.spd??1,v.thr[_]=M.thr??o(),v.inAt[_]=M.inAt??-1e9,v.outAt[_]=M.outAt??1e9,v.far[_]=85+o()*25,v.ph[_]=M.ph??o(),v.tm[_]=M.tm??1+o()*6,v.face[_]=Ie.right,v.hand[_]=o()<.12?1:0,v.grp[_]=M.grp??-1,v.dx0[_]=M.dx??0,v.dy0[_]=M.dy??0,v.role[_]=M.role??0,v.row2[_]=M.row2??0,v.tint[_]=.9+o()*.18,v.gx[_]=1e9}}),this.marks=new Float32Array(u*4),this.jump=new Float32Array(u*3);const p=new Ze(this.sheet.data,this.sheet.width,this.sheet.height,De,ge);p.minFilter=p.magFilter=se,p.generateMipmaps=!1,p.needsUpdate=!0,this.texture=p;const x=Math.max(1,Math.min(h,Zy));this.cap=x;const w=x*2;this.capI=w;const b=new io;b.setAttribute("position",new pe(new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),3)),b.setIndex([0,1,2,0,2,3]);const y=E=>{const T=new ue(new Float32Array(w*4),4);return T.setUsage(bn),b.setAttribute(E,T),T};this.aFoot=y("aFoot"),this.aCell=y("aCell"),this.aDraw=y("aDraw"),this.aMix=y("aMix"),this.attrs=[this.aFoot,this.aCell,this.aDraw,this.aMix],b.instanceCount=0,this.geometry=b,this.range={start:0,count:0},this.own={uSheet:{value:p},uViewport:{value:new Ht(1,1)},uPxW:{value:.001},uFigS:{value:null},uHasS:{value:0}};const S={...n.uniforms,...this.own};this.material=new Ee({vertexShader:Xy,fragmentShader:qy,uniforms:S,transparent:!0,blending:wi,depthWrite:!0}),this.shadowMaterial=new Ee({vertexShader:Yy,fragmentShader:Ky,uniforms:S,transparent:!0,depthWrite:!1,blending:Tc}),this.mesh=new me(b,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=8,this.shadows=new me(b,this.shadowMaterial),this.shadows.frustumCulled=!1,this.shadows.renderOrder=7,this.group=new Ne,this.group.add(this.shadows,this.mesh),this.time=0,this.frame=0,this.thin=1,this.drawn=0,this.instances=0,this.scale=new aM,this.unit=.03,this.view={rx:1,rz:0,ax:0,az:-1,sinP:.5},this._p=[0,0,0,0],this._v4=new te,this._size=new Ht}enemyOf(t,e){for(const n of[!0,!1]){let i=0,o=0,a=0;for(const r of e)if(!(r.event!==t.event||r.side===t.side||n&&!Ra(r,t)))for(const[c,l]of r.pts)i+=c,o+=l,a++;if(a)return[i/a,o/a]}return null}mid(t){return Ue(t,t.total/2,[0,0,0,0])}heading(t){const e=t.pts[0],n=t.pts.at(-1),i=Math.hypot(n[0]-e[0],n[1]-e[1])||1;return[(n[0]-e[0])/i,(n[1]-e[1])/i]}cannonOf(t){if(t.arms)return Math.max(0,Math.round(t.arms.cannon||0));const e=Number.isFinite(t.p.from)?t.p.from:1795;return t.line&&t.side==="hawaii"&&e>=1790?Math.max(1,Math.min(3,Math.round(t.total/2.5))):0}sharesOf(t){if(t.arms)return t.arms;const n=(Number.isFinite(t.p.from)?t.p.from:1795)<1790?0:t.side==="hawaii"?.14:.06;return{spear:.7-n,club:.3,musket:n}}planForce(t,e,n,i){if(t.total<.05)return;t.file=/path/i.test(t.p.name||"")&&t.total<12;const a=t.behaviour;a==="stand"||a==="engage"?this.planStand(t,e,n):a==="surround"?this.planSurround(t,e,n,i):a==="leap"?this.planLeap(t,e,n,i):this.planFiles(t,e,n)}planFiles(t,e,n,{n:i=0,from:o=0,to:a=t.total,at:r=1}={}){var x;const c=Math.max(.05,a-o),l=t.behaviour==="run"||t.behaviour==="surround",h=t.file,f=i||Math.max(12,Math.min(300,Math.round(c*(h?2.5:l?4:5)))),d=h?1:3,g=h?.03:t.side==="hawaii"?.32:.26;let v;if((x=t.chase)!=null&&x.knots){const w=c/Math.max(.05,t.chase.total);v=t.chase.knots.map(b=>({u:b.u,sp:b.sp*w}))}else v=Array.from({length:Math.max(3,Math.min(9,Math.round(f/14)))},()=>({u:n(),sp:l?.85+n()*.3:.88+n()*.24}));t.knots=v;const m=Math.min(c*.15,4),p=t.behaviour==="march"?this.cannonOf(t):0;for(let w=0;w<p;w++){const b=v[w%v.length],y=this.guns.push({r:t,kind:"haul",front:-1,s:o+(b.u+.03)%1*c,spd:b.sp,lat:0,inAt:o+n()*m*.6,outAt:a-m*.2-n()*m,x:0,z:0,ax:1,az:0,period:8,phase:0,on:!1})-1;this.crewOut(e,t,y,n()*.3)}for(let w=0;w<f;w++){const b=v[w%v.length];let y=(b.u+(n()-.5)*(n()<.75?.05:.22))%1;y<0&&(y+=1);const S=Math.floor(n()*d);e.push({mode:"file",s:o+y*c,lat:d>1?((S-(d-1)/2)*.7+(n()-.5)*.5)*g:(n()-.5)*g,spd:b.sp*(.97+n()*.06),inAt:o+n()*m*.6,outAt:a-(a<t.total?0:m*.2)-n()*m*r})}}planStand(t,e,n){const i=t.total,o=i<2,a=Math.max(3,Math.min(12,Math.round(i/2.4)));if(t.enemy){const l=this.mid(t);t.pressed=Math.hypot(t.enemy[0]-l[0],t.enemy[1]-l[1])<6}for(let l=0;l<a;l++){const h=Math.max(0,Math.min(i,(l+.5)/a*i+(n()-.5)*(i/a)*.4)),u=o?4+Math.floor(n()*3):6+Math.floor(n()*9),f=o?4:5;for(let d=0;d<u;d++){const g=Math.round((d-(u-1)/2)*f+(n()-.5)*3);e.push({mode:"knot",s:h,lat:(n()-.5)*.12,dx:g,dy:Math.round((n()-.5)*3),tm:1+n()*6})}if(!o||l===1)for(let d=0;d<2;d++)e.push({mode:"pacer",s:h+(n()-.5)*.8,lat:(n()-.5)*.4,spd:.4+n()*.3,noChief:!0})}const r=this.cannonOf(t),c=[0,0,0,0];for(let l=0;l<r;l++){Ue(t,(l+.7)/(r+.4)*i,c);const h=this.guns.push({r:t,kind:"park",front:-1,s:0,spd:0,lat:0,inAt:0,outAt:0,x:c[0]-c[3]*.08,z:c[1]+c[2]*.08,ax:c[2],az:c[3],period:8,phase:n(),on:!0})-1;if(t.enemy){const u=t.enemy[0]-c[0],f=t.enemy[1]-c[1],d=Math.hypot(u,f)||1;this.guns[h].ax=u/d,this.guns[h].az=f/d}this.crewOut(e,t,h,n()*.3)}}planSurround(t,e,n,i){const o=t.total,a=Math.max(24,Math.min(64,Math.round(o*12))),r=t.pts.at(-1),c=[0,0,0,0];Ue(t,o,c);let l=null,h=3;for(const b of i)if(!(b===t||b.event!==t.event||b.side===t.side||!Ra(b,t)||!(b.line||b.behaviour==="stand"||b.behaviour==="engage")))for(let y=0;y<=b.total;y+=Math.max(.02,b.total/40)){const S=Ue(b,y,[0,0,0,0]),E=Math.hypot(S[0]-r[0],S[1]-r[1]);E<h&&(h=E,l=b)}let u=-c[3],f=c[2],d=.4,[g,v]=r;if(l){const b=this.heading(l);u=b[0],f=b[1],d=Math.max(.2,l.total/2),[g,v]=this.mid(l)}const m=-c[2],p=-c[3],x=-f*m+u*p<0?-1:1;t.ring={cx:g,cz:v,ux:u,uz:f,vx:m,vz:p,nx:-f*x,nz:u*x,half:d,reach:null,inner:d+$n.clear,band:null},this.ground&&this.reachOf(t.ring,l||{total:0,pts:[r],cum:[0]});const w=Math.min(28,Math.round(a*.45));for(let b=0;b<w;b++){const y=b%2,S=(((b>>1)+.5+(n()-.5)*.5)/Math.ceil(w/2)*2-1)*(72*Math.PI/180);e.push({mode:"ring",s:S,row2:y,close:!0,tm:.5+n()*3,ph:n()})}this.planFiles(t,e,n,{n:a-w,to:Math.max(.1,o-Math.min(1.2,o*.25)),at:2})}reachOf(t,e){const n=this.ground,i=[0,0,0,0];let o=1/0,a=-1/0;for(let c=0;c<=e.total+1e-9;c+=Math.max(.02,e.total/40)){const l=e.total>0?Ue(e,c,i):e.pts[0],h=n(l[0],l[1]);if(o=Math.min(o,h),a=Math.max(a,h),!(e.total>0))break}if(!Number.isFinite(o)||!Number.isFinite(a))return;o-=$n.down,a+=$n.up;const r=new Float32Array($n.dirs);for(let c=0;c<$n.dirs;c++){const l=c/$n.dirs*2*Math.PI,h=Math.cos(l),u=Math.sin(l);let f=1/0;for(let d=$n.step;d<=$n.far;d+=$n.step){const g=n(t.cx+h*d,t.cz+u*d);if(g<o||g>a){f=d-$n.step;break}}r[c]=f}t.reach=r,t.band=[o,a]}planLeap(t,e,n,i){const o=Math.max(5,Math.min(10,Math.round(t.total*10)));let a=3;for(const r of i)if(!(r===t||r.line||r.event!==t.event||r.side!==t.side||r.behaviour!=="stand"||!Ra(r,t)))for(let c=0;c<=r.total;c+=Math.max(.02,r.total/40)){const l=Ue(r,c,[0,0,0,0]),h=Math.hypot(l[0]-t.pts[0][0],l[1]-t.pts[0][1]);if(h<a){a=h;const u=this.mid(r),f=this.heading(r);t.flank={cx:u[0],cz:u[1],half:r.total/2,ux:f[0],uz:f[1]}}}for(let r=0;r<o;r++)e.push({mode:"leap",s:0,lat:(n()-.5)*.06,dx:Math.round((n()-.5)*8),tm:.3+r*Fn.gap*(.8+n()*.4)})}planRanks(t,e,n,i,o=[]){var h,u;const a=t.total;if(a<.3)return;const r=this.mid(t);let c=0;e&&(c=(e[0]-r[0])*-r[3]+(e[1]-r[1])*r[2]>0?-1:1),t.back=c;const l=Math.max(24,Math.min(120,Math.round(a*11)));for(let f=0;f<l;f++){const d=(.04+.92*((f+i()*.9)/l))*a;if(o.some(v=>Math.abs(d-v)<.32))continue;const g=c?c*(.15+Math.pow(i(),1.2)*1.2):(i()+i()-1)*.5;n.push({mode:"rank",s:d,lat:g,tm:1+i()*8})}if(!e){const f=this.cannonOf(t),d=[0,0,0,0];for(let g=0;g<f;g++){Ue(t,(g+1)/(f+1)*a,d);const v=(((h=t.enemy)==null?void 0:h[0])??d[0]+1)-d[0],m=(((u=t.enemy)==null?void 0:u[1])??d[1])-d[1],p=Math.hypot(v,m)||1,x=this.guns.push({r:t,kind:"park",front:-1,s:0,spd:0,lat:0,inAt:0,outAt:0,x:d[0],z:d[1],ax:v/p,az:m/p,period:8,phase:i(),on:!0})-1;this.crewOut(n,t,x,i()*.3)}}}crewOut(t,e,n,i){t.push({mode:"piece",kind:"gun",side:"hawaii",dress:"bare",grp:n,role:0,thr:i,crew:!0}),t.push({mode:"crew",kind:"linstock",side:"hawaii",dress:"kihei",grp:n,role:1,thr:i,crew:!0}),t.push({mode:"crew",kind:"rammer",side:"hawaii",dress:"bare",grp:n,role:2,thr:i,crew:!0})}planFront(t,e,n,i,o){const a=i.indexOf(t),r=i.indexOf(e),c=T=>{const M=this.cannonOf(T);return Array.from({length:M},(_,A)=>(A+1)/(M+1)*T.total)},l=c(t),h=c(e);this.planRanks(t,this.mid(e),n[a],o,l),this.planRanks(e,this.mid(t),n[r],o,h);const u=24,f=[],d=[],g=[0,0,0,0];for(let T=0;T<=u;T++)Ue(t,T/u*t.total,g),f.push([g[0],g[1]]),Ue(e,T/u*e.total,g),d.push([g[0],g[1]]);Math.hypot(f[0][0]-d[0][0],f[0][1]-d[0][1])>Math.hypot(f[0][0]-d[u][0],f[0][1]-d[u][1])&&d.reverse();const v=f.map((T,M)=>[(T[0]+d[M][0])/2,(T[1]+d[M][1])/2]);let m=0,p=0;for(let T=0;T<=u;T++)m+=d[T][0]-f[T][0],p+=d[T][1]-f[T][1];const x=Math.hypot(m,p)||1,w={a:t,b:e,nx:m/x,nz:p/x,ia:a,ib:r},b=this.fronts.push(w)-1;t.front=b,e.front=b;const y=[0];for(let T=1;T<=u;T++)y.push(y[T-1]+Math.hypot(v[T][0]-v[T-1][0],v[T][1]-v[T-1][1]));const S={pts:v,cum:y,total:y[u]},E=Math.max(4,Math.min(16,Math.round(S.total*2)));for(let T=0;T<E;T++){Ue(S,(.08+.84*((T+.2+o()*.6)/E))*S.total,g);const M=(o()-.5)*.4,_=this.pairs.push({x:g[0]+w.nx*M,z:g[1]+w.nz*M,front:b,period:1.5+o()*.8,phase:o(),sway:o()*Math.PI*2,swayT:3+o()*3})-1,A=o()*.9;n[a].push({mode:"duel",grp:_,role:0,close:!0,thr:A}),n[r].push({mode:"duel",grp:_,role:1,close:!0,thr:A})}for(const[T,M,_]of[[t,l,1],[e,h,-1]])for(const A of M){Ue(T,A,g);const R=T.back||-1,D=this.guns.push({r:T,kind:"front",front:b,x:g[0]-g[3]*R*.05,z:g[1]+g[2]*R*.05,ax:w.nx*_,az:w.nz*_,period:7+o()*2.5,phase:o(),on:!0})-1;this.crewOut(n[i.indexOf(T)],T,D,o()*.5)}}armOut(t,e,n){const i=Ha.includes(t.side)?t.side:"oahu",o=e.filter(f=>!f.crew);for(const f of e)f.crew&&(f.side="hawaii");const a=pM(this.sharesOf(t),lc,o.length);t.counts=a;const r=[];for(const f of lc)for(let d=0;d<a[f];d++)r.push(f);for(let f=r.length-1;f>0;f--){const d=Math.floor(n()*(f+1));[r[f],r[d]]=[r[d],r[f]]}const c=f=>{const d=r.findIndex(g=>f.includes(g));return r.splice(d>=0?d:0,1)[0]||"spear"};for(const f of o)f.close&&(f.kind=c(nM));for(const f of o)f.close||(f.kind=c(lc));for(const f of o)f.side=i,f.dress=n()<.55?"kihei":"bare";const l=o.filter(f=>(f.kind==="spear"||f.kind==="club")&&!f.noChief);let h=o.length>=12?Math.max(1,Math.round(o.length/32)):0;const u=l.find(f=>f.mode==="duel");u&&h&&(u.dress="chief",h--);for(let f=0;f<h&&l.length;f++)l[Math.floor(n()*l.length)].dress="chief"}update(t,e,n){var Lt,Ft,Z,lt,ut,P,L,F,G,Q;const i=this.app,o=i.camera,a=this.f,r=this.recs;this.hold&&(t=0),this.time+=t,this.frame++;const c=this.time;o.updateMatrixWorld();const l=o.matrixWorld.elements,h=this.view;let u=Math.hypot(l[0],l[2])||1;h.rx=l[0]/u,h.rz=l[2]/u,u=Math.hypot(l[8],l[10])||1,h.ax=-l[8]/u,h.az=-l[10]/u,h.sinP=Math.max(.05,Math.min(1,l[9]));const f=-l[8],d=-l[9],g=-l[10],v=o.position.x,m=o.position.y,p=o.position.z,x=((Lt=i.pipeline)==null?void 0:Lt.size)||i.renderer.getDrawingBufferSize(this._size),w=x.y/Math.max(1,innerHeight);this.dpr=w;const b=Math.tan(o.fov*Math.PI/360);this.own.uViewport.value.set(x.x,x.y),this.own.uPxW.value=2*b/Math.max(1,x.y);const y=(Ft=i.districts)!=null&&Ft.on?(ut=(lt=(Z=i.districts.cur)==null?void 0:Z.terrain)==null?void 0:lt.shadow)==null?void 0:ut.texture:null;this.own.uFigS.value=y||null,this.own.uHasS.value=y?1:0;const S=i.world.uniforms.uVert.value,E=i.districts,T=E!=null&&E.on?1+E.k:0,M=((L=(P=E==null?void 0:E.cur)==null?void 0:P.parent)==null?void 0:L.k)??0,_=((F=i.timeline)==null?void 0:F.year)??0,A=T!==this._g0||M!==this._g1||_!==this._g2;this._g0=T,this._g1=M,this._g2=_;const R=((Q=(G=i.rig)==null?void 0:G.state)==null?void 0:Q.distance)??16,D=this.hold?this.scale:this.scale.step(oM(R,w),t,2,Math.max(2,Math.round(4*w))),C=D.L/w*R*2*b/Math.max(1,innerHeight);this.unit=C;const z=n?.5:1,I=Qy*C*z,O=tM*C*z,N=t>0?t/Mu:1,j=Math.min(1,Math.max(.35,Math.pow(24/Math.max(1,R),.8)));for(const V of this.guns){if(V.kind!=="haul"||V.r.w*e<=.002)continue;const st=V.r.total;let gt=V.s+I*V.spd*t;gt>st&&(gt%=st),V.s=gt;const _t=Ue(V.r,gt,this._p);V.x=_t[0],V.z=_t[1],V.ax=_t[2],V.az=_t[3],V.on=gt>=V.inAt&&gt<=V.outAt}const H=this._p,J=this.marks,ot=this.aFoot.array,Y=this.aCell.array,nt=this.aDraw.array,ct=this.aMix.array;let mt=0,St=0,Tt=0;const Rt=this.cap,yt=D.k,It=D.t,X=It<=15.5/16,fe=It>.5/16;for(let V=0;V<r.length;V++){const et=r[V],st=et.w*e;if(st<=.002&&!et.drawnLast)continue;const gt=A||!et.drawnLast;et.drawnLast=st>.002;const _t=et.front!==void 0?this.fronts[et.front]:null,Yt=_t?_t.a===et:!1,ht=st*this.thin*(et.line?1:j),oe=!n&&(!!_t||et.pressed);for(let $=et.o;$<et.o+et.n;$++){const kt=a.mode[$];let At=Ta,vt=0,Wt=0,ee=0,he=0,Ot=ht>a.thr[$],rt=0,U=0,ft=a.hx[$],dt=a.hz[$],Ut=!1,Nt=0,ne=0,ae=-1,ve=0;if(kt===Mn.file){const bt=(et.behaviour==="run"||et.behaviour==="surround"?O:I)*a.spd[$];ve=bt*Mu*1.3;let xt=a.s[$]+bt*t;xt>et.total&&(xt%=et.total),a.s[$]=xt,Ue(et,xt,H),rt=H[0]-H[3]*a.lat[$],U=H[1]+H[2]*a.lat[$],ft=H[2],dt=H[3];const $t=et.behaviour!=="march"&&et.behaviour!=="stand",k=($t?1.7:1.15)*a.spd[$]*z;a.ph[$]=(a.ph[$]+k*t)%1,At=$t?xu:Mo,vt=Math.floor(a.ph[$]*4)%4,(xt<a.inAt[$]||xt>a.outAt[$])&&(Ot=!1),a.wet[$]&&(a.lat[$]*=1-Math.min(1,t*.5))}else if(kt===Mn.knot||kt===Mn.pacer){let bt=a.s0[$];if(kt===Mn.pacer){a.tt[$]+=I*.6*a.spd[$]*t;const $t=a.tt[$]/(2*.7)+a.ph[$],k=2*Math.abs($t-Math.floor($t+.5));bt=Math.max(0,Math.min(et.total,a.s0[$]+(k-.5)*2*.7));const B=$t-Math.floor($t)<.5?1:-1;Ue(et,bt,H),ft=H[2]*B,dt=H[3]*B,At=Mo,vt=Math.floor((c*1.1*z+a.ph[$])%1*4)}else Ue(et,bt,H),et.enemy?(ft=et.enemy[0]-H[0],dt=et.enemy[1]-H[1]):(ft=-H[3],dt=H[2]),Wt=a.dx0[$],ee=a.dy0[$],[At,vt]=this.act($,t,c,n,oe,!1);rt=H[0]-H[3]*a.lat[$],U=H[1]+H[2]*a.lat[$]}else if(kt===Mn.rank){Ue(et,a.s0[$],H);const bt=a.st[$];if([At,vt]=this.act($,t,c,n,oe,!0),a.st[$]===1&&bt===1){const xt=I*.5*t,$t=a.offTo[$]-a.off[$];Math.abs($t)<=xt?(a.off[$]=a.offTo[$],a.st[$]=0):a.off[$]+=Math.sign($t)*xt,ft=H[2]*Math.sign($t),dt=H[3]*Math.sign($t)}else _t?(ft=Yt?_t.nx:-_t.nx,dt=Yt?_t.nz:-_t.nz):et.enemy&&(ft=et.enemy[0]-H[0],dt=et.enemy[1]-H[1]);rt=H[0]-H[3]*a.lat[$]+H[2]*a.off[$],U=H[1]+H[2]*a.lat[$]+H[3]*a.off[$]}else if(kt===Mn.duel){const bt=this.pairs[a.grp[$]],xt=this.fronts[bt.front],$t=a.role[$]===0,k=.1*Math.sin(c*2*Math.PI/bt.swayT+bt.sway);rt=bt.x+xt.nx*k,U=bt.z+xt.nz*k,ft=$t?xt.nx:-xt.nx,dt=$t?xt.nz:-xt.nz;const B=xt.nx*h.rx+xt.nz*h.rz,q=(xt.nx*h.ax+xt.nz*h.az)*h.sinP,tt=Math.hypot(B,q)||1,K=B/tt,Mt=q/tt,Ct=(c/bt.period+bt.phase)%1,Pt=$t?Ct<.5:Ct>=.5,zt=Ct%.5/.5,Xt=1.6*Math.sin(c*2*Math.PI/(bt.swayT*1.7)+bt.sway);let Vt=($t?-4:4)+Xt;At=Ca,n?(Ot=!1,At=Ta,vt=0):Pt?vt=zt<.3?0:zt<.55?1:2:(vt=2,zt>=.3&&zt<.7&&(Vt+=$t?-1:1)),Wt=Math.round(Vt*K+($t?-1.5:1.5)*Mt*Mt),ee=Math.round(Vt*Mt*.8),he=.01+($t?1:-1)*Math.sign(q)*.01}else if(kt===Mn.piece||kt===Mn.crew){const bt=this.guns[a.grp[$]];rt=bt.x,U=bt.z,bt.kind==="haul"&&!bt.on&&(Ot=!1);const xt=a.role[$];ft=bt.ax,dt=bt.az,xt===0&&(bt.face=this.faceOf(bt.ax,bt.az,bt.face??Ie.right));const $t=bt.face??Ie.right;ae=$t;const k=bt.kind==="haul",B=n||bt.kind!=="front"?99:(c/bt.period+bt.phase)%1*bt.period;let q=-1;if(xt===0)q=B>=3.5&&B<3.65?0:B>=3.65&&B<4.4?1:B>=4.4&&B<5.2?2:-1,he=$t===Ie.front?.03:.01;else if($t<=Ie.left){const tt=$t===Ie.right?1:-1;xt===1?Wt=-11*tt:(Wt=11*tt,he=.02,k||(ae=$t===Ie.right?Ie.left:Ie.right))}else Wt=xt===1?-9:9,ee=$t===Ie.back?2:3,ne=$t===Ie.back==(xt===1)?1:-1;xt===1?q=B>=2.6&&B<3.2?0:B>=3.2&&B<3.6?1:B>=3.6&&B<4.3?2:-1:xt===2&&(q=B<.9?Math.min(2,Math.floor(B/.3)):-1),k?(At=Mo,vt=Math.floor((c*1.15*z+.25*xt)%1*4)):q>=0?(At=Ca,vt=q):(At=Ta,vt=xt===0?0:Math.floor(c*(.6+.1*xt)+a.ph[$])&1)}else if(kt===Mn.ring){const bt=et.ring,xt=n?0:4*Math.max(0,Math.sin(c/(2.4+a.ph[$])*2*Math.PI+a.ph[$]*6.28)),$t=Math.max(.3,Math.hypot(bt.ux*h.rx+bt.uz*h.rz,(bt.ux*h.ax+bt.uz*h.az)*h.sinP)),k=Math.max(.3,Math.hypot(bt.vx*h.rx+bt.vz*h.rz,(bt.vx*h.ax+bt.vz*h.az)*h.sinP)),B=a.row2[$],q=(Math.max(bt.half*$t/C+16,24)+6*B)*C/$t,tt=(28+9*B)*C/k,K=q-xt*.5*C/$t,Mt=tt-xt*C/k,Ct=Math.sin(a.s0[$]),Pt=Math.cos(a.s0[$]);let zt=1;if(bt.reach){const Xt=bt.ux*q*Ct+bt.vx*tt*Pt,Vt=bt.uz*q*Ct+bt.vz*tt*Pt,qt=Math.hypot(Xt,Vt);qt>1e-6&&(zt=Math.min(1,Math.max(cM(bt.reach,Xt,Vt),bt.inner)/qt))}rt=bt.cx+(bt.ux*K*Ct+bt.vx*Mt*Pt)*zt,U=bt.cz+(bt.uz*K*Ct+bt.vz*Mt*Pt)*zt,ft=bt.cx-rt,dt=bt.cz-U,xt>3?(At=Ca,vt=xt>3.7?1:0):xt>.3?(At=Mo,vt=Math.floor((c*1.3+a.ph[$])%1*4)):[At,vt]=this.act($,t,c,n,!1,!1)}else if(kt===Mn.leap)if(n)Ot=!1,a.st[$]=0;else{if(a.st[$]===0&&(a.tm[$]-=t,Ot=!1,a.tm[$]<=0&&(a.st[$]=1,a.s[$]=0),Ue(et,0,H),rt=H[0],U=H[1]),a.st[$]===1){const xt=a.s[$]+O*Fn.run*t;a.s[$]=xt,a.tt[$]+=t,Ue(et,Math.min(xt,et.total),H);const $t=Math.max(0,xt-et.total);if(rt=H[0]+H[2]*$t-H[3]*a.lat[$],U=H[1]+H[3]*$t+H[2]*a.lat[$],ft=H[2],dt=H[3],At=xu,vt=Math.floor((a.tt[$]*1.9+a.ph[$])%1*4),xt>=et.total){const k=i.world.metresAt(rt,U),B=i.world.metresAt(rt+H[2]*.1,U+H[3]*.1);(k-B>6||$t>.6)&&(a.st[$]=2,a.tt[$]=0,a.gx[$]=1e9,this.jump[$*3]=rt,this.jump[$*3+1]=U,this.jump[$*3+2]=k)}}if(a.st[$]>=1){const xt=et.pts[0],$t=et.pts.at(-1),k=(($t[0]-xt[0])*h.rx+($t[1]-xt[1])*h.rz)/C,B=(($t[0]-xt[0])*h.ax+($t[1]-xt[1])*h.az)*h.sinP/C,q=Math.hypot(k,B)||1,tt=Math.max(0,Fn.least-q)*(a.st[$]===1?Math.min(1,a.s[$]/et.total):1);Wt=a.dx0[$]+Math.round(k/q*tt),ee=Math.round(B/q*tt);const K=et.flank;if(K){const Mt=((xt[0]-K.cx)*h.rx+(xt[1]-K.cz)*h.rz)/C,Ct=Math.abs(K.ux*h.rx+K.uz*h.rz)*K.half/C+16,Pt=Math.abs(k)>.2*q?Math.sign(k):Math.sign(Mt)||1;Wt+=Pt*Math.round(Math.max(0,Ct+4-Pt*Mt))}}if(a.st[$]===2){a.tt[$]+=t;const xt=a.tt[$];Ue(et,et.total,H),rt=this.jump[$*3]+H[2]*Fn.across*C*xt,U=this.jump[$*3+1]+H[3]*Fn.across*C*xt,ft=H[2],dt=H[3];const $t=Fn.up*xt-.5*Fn.pull*xt*xt;Ut=!0,Nt=this.jump[$*3+2]+$t*C/S,At=Jy,vt=xt<.22?0:1+(Math.floor((xt-.22)/.14)&1),-$t>Fn.fade&&(Ot=!1),xt>Fn.air&&(a.st[$]=0,a.tm[$]=Math.max(.4,et.n*Fn.gap*(.85+Math.random()*.3)-xt-et.total/Math.max(1e-6,O*Fn.run)),a.vis[$]=0,Ot=!1)}}a.hx[$]=ft,a.hz[$]=dt;const Ce=ae>=0?ae:this.faceOf(ft,dt,a.face[$]);if(a.face[$]=Ce,Ce<=Ie.left?ne=Ce===Ie.left?-1:1:ne||(ne=kt===Mn.piece||!a.hand[$]?1:-1),a.mirror[$]=ne,a.fr[$]=At+vt,a.dx[$]=Wt,a.dy[$]=ee,a.x[$]=rt,a.z[$]=U,a.air[$]=Ut?1:0,(gt||Math.abs(rt-a.gx[$])+Math.abs(U-a.gz[$])>.01||(this.frame+$)%30===0)&&(a.gm[$]=i.world.metresAt(rt,U),a.gx[$]=rt,a.gz[$]=U,a.wet[$]=a.gm[$]<.15?1:0,ve>0&&!a.wet[$])){const bt=Math.hypot(ft,dt)||1;i.world.metresAt(rt+ft/bt*ve,U+dt/bt*ve)<.15&&(a.wet[$]=2)}a.wet[$]&&!Ut&&(Ot=!1);const re=Ut?Nt:a.gm[$],We=Ut&&re+ln*C/S<a.gm[$];We&&(Ot=!1),a.lift[$]=re;const En=Math.max(re,0)*S,oo=(rt-v)*f+(En-m)*d+(U-p)*g;(oo>a.far[$]||oo<.05)&&(Ot=!1),Ot&&Tt++;let Dn=a.vis[$];Dn=Ot?Math.min(1,Dn+N):Math.max(0,Dn-N),(st<=.002||We)&&(Dn=0),a.vis[$]=Dn;const fs=It<.5?yt:yt+1;a.k[$]=Dn>0?fs:0;const Wi=$*4;if(J[Wi]=rt,J[Wi+1]=U,J[Wi+2]=Dn,J[Wi+3]=a.k[$],Dn<=0||St>=Rt)continue;St++;const ii=a.cw[$],Xo=(wu[Ce]*Bs+At+vt)*ii,qo=Ut?0:ii>Bc&&a.kind[$]!==yo.gun?Bc:ii;for(let bt=0;bt<2;bt++){if(bt===0?!X:!fe)continue;const xt=mt*4;ot[xt]=rt,ot[xt+1]=re,ot[xt+2]=U,ot[xt+3]=he,Y[xt]=Xo,Y[xt+1]=a.row[$],Y[xt+2]=ii,Y[xt+3]=ln,nt[xt]=bt===0?yt:yt+1,nt[xt+1]=ne*a.tint[$],nt[xt+2]=Dn,nt[xt+3]=Wt,ct[xt]=bt===0?It:0,ct[xt+1]=bt===0?1:It,ct[xt+2]=ee,ct[xt+3]=qo,mt++}}}if(Tt>Rt?this.thin=Math.max(.1,this.thin*.92):Tt<Rt*.85&&this.thin<1&&(this.thin=Math.min(1,this.thin*1.04)),this.drawn=St,this.instances=mt,this.geometry.instanceCount=mt,this.group.visible=mt>0,mt>0){this.range.count=mt*4;for(const V of this.attrs)V.clearUpdateRanges(),V.updateRanges.push(this.range),V.needsUpdate=!0}}act(t,e,n,i,o,a){const r=this.f;r.tm[t]-=e,i&&r.st[t]>=2&&(r.st[t]=0);const c=r.st[t];let l=Ta,h=Math.floor(n/(.9+r.tint[t])+r.ph[t]*2)&1;if(c===1)l=Mo,h=Math.floor((n*1.15+r.ph[t])%1*4);else if(c>=2){r.tt[t]+=e;const u=r.tt[t];l=Ca,c===2?h=u<.55?0:u<.67?1:2:c===3?h=u<.3?0:u<.5?1:2:h=u<1?Math.floor(u/.12)&1:u<1.15?2:3,u>(c===2?1.4:c===3?.8:1.45)&&(r.st[t]=0)}if(r.st[t]===0&&r.tm[t]<=0){const u=Math.random();r.tm[t]=3+Math.random()*7;const f=r.kind[t];o&&f===yo.musket?(r.st[t]=2,r.tt[t]=0):o&&f===yo.sling?(r.st[t]=4,r.tt[t]=0):a&&u<.55?(r.st[t]=1,r.offTo[t]=(Math.random()-.5)*.5):o&&u<.8&&(r.st[t]=3,r.tt[t]=0)}return[l,h]}faceOf(t,e,n){const i=this.view,o=t*i.rx+e*i.rz,a=t*i.ax+e*i.az;return o*o+a*a<1e-12?n:(n>=Ie.front?Math.abs(o)<=yu*Math.abs(a):Math.abs(a)>yu*Math.abs(o))?a>0?Ie.back:Ie.front:o>0?Ie.right:Ie.left}scaleAt(){return this.scale.t<.5?this.scale.k:this.scale.k+1}scaleBands(t=this.dpr||1){return rM(t)}screenRect(t){const e=this.f;if(e.vis[t]<=0||!e.k[t])return null;const n=this.app.camera,i=this._v4.set(e.x[t],Math.max(e.lift[t],0)*this.app.world.uniforms.uVert.value,e.z[t],1);if(i.applyMatrix4(n.matrixWorldInverse).applyMatrix4(n.projectionMatrix),i.w<=0)return null;const o=this.own.uViewport.value.x,a=this.own.uViewport.value.y,r=e.k[t],c=Math.floor((i.x/i.w*.5+.5)*o+.5)+e.dx[t]*r,l=Math.floor((i.y/i.w*.5+.5)*a+.5)+e.dy[t]*r,h=e.cw[t]*r,u=ln*r,f=(wu[e.face[t]]*Bs+e.fr[t])*e.cw[t];return{x:c-h/2,y:a-l-u,w:h,h:u,k:r,cell:[f,e.row[t],e.cw[t],ln],facing:e.mirror[t],face:e.face[t],vis:e.vis[t],solid:this.scale.t===0||this.scale.t===1}}stats(){const t=this.f,e=["right","left","front","back"],n={figures:this.drawn,instances:this.instances,planned:this.count,fronts:this.fronts.length,pairs:this.pairs.length,guns:this.guns.length,sides:{},kinds:{},faces:{},k:{},scale:{k:this.scale.k,t:+this.scale.t.toFixed(3),level:+this.scale.L.toFixed(3)}};for(let i=0;i<this.count;i++){if(t.vis[i]<=0)continue;const o=Ha[t.side[i]],a=ul[t.kind[i]];n.sides[o]=(n.sides[o]||0)+1,n.kinds[a]=(n.kinds[a]||0)+1,n.faces[e[t.face[i]]]=(n.faces[e[t.face[i]]]||0)+1,n.k[t.k[i]]=(n.k[t.k[i]]||0)+1}return n}dispose(){this.geometry.dispose(),this.material.dispose(),this.shadowMaterial.dispose(),this.texture.dispose()}}ro(bo,"MODE",Mn),ro(bo,"KIND",yo),ro(bo,"FACE",Ie),ro(bo,"WIDTH",fl);const mM={hawaii:"#f0ae3c",oahu:"#a88fe6",maui:"#d9703f"};class gM{constructor(t,e,n,i,o=null){var a;this.app=t,this.forces=[],this.lines=[];for(const r of e){const c=r.properties||{};if(c.kind!=="force"&&c.kind!=="line"||((a=r.geometry)==null?void 0:a.type)!=="LineString")continue;const l=r.geometry.coordinates.map(d=>t.data.proj.toWorld(d)),h=[0];for(let d=1;d<l.length;d++)h.push(h[d-1]+Math.hypot(l[d][0]-l[d-1][0],l[d][1]-l[d-1][1]));const u=h.at(-1),f={p:c,pts:l,cum:h,total:u,event:c.event,step:Number.isFinite(c.step)?c.step:0,w:0,goal:0,stop:c.stop??null,line:c.kind==="line"};f.line?(f.side=c.side||(c.role==="advance"?"hawaii":"oahu"),f.batch=i.add([{pts:l,width:.75}],{mode:"band",colour:new Bt(mM[f.side]||"#ffffff").toArray(),alpha:0,minPx:6,lift:.01,order:6,endFade:1.2}),f.mid=dn(r.geometry),f.stand=!0,this.lines.push(f)):f.side=c.role||"oahu",this.forces.push(f)}this.events=new Map;for(const r of this.forces){if(!r.event)continue;let c=this.events.get(r.event);c||this.events.set(r.event,c={id:r.event,from:1/0,to:-1/0,recs:[]}),c.recs.push(r),Number.isFinite(r.p.from)&&(c.from=Math.min(c.from,r.p.from)),Number.isFinite(r.p.to)&&(c.to=Math.max(c.to,r.p.to))}this.soldiers=new bo(t,this.forces,n,o),this.count=this.soldiers.count,this.marks=this.soldiers.marks,this.group=this.soldiers.group,this.time=0,this.showing={event:null,steps:[],quiet:!1},this.stopShown=0}stepsAt(t,e){var h;const n=this.events.get(t.id),i=t.stops||[];if(!n||e<0||e>=i.length)return[];const o=(h=this.app.tour)==null?void 0:h.places,a=this.app.data.proj,r=[];for(const u of n.recs){if(u.p.kind!=="line"||!u.mid)continue;const[f,d]=a.toWorld(u.mid);let g=-1,v=6;i.forEach((m,p)=>{const x=o==null?void 0:o.get(m.place),w=x&&dn(x.geometry);if(!w)return;const[b,y]=a.toWorld(w),S=Math.hypot(b-f,y-d);S<v&&(v=S,g=p)}),g>=0&&r.push(g-u.step)}r.sort((u,f)=>u-f);const c=r.length?r[Math.floor(r.length/2)]:0,l=new Set;for(const u of n.recs){const f=u.step+c;(f===e||e===i.length-1&&f>e)&&l.add(u.step)}return[...l].sort((u,f)=>u-f)}namedStops(t,e){if(t.stop===null||t.stop===void 0)return null;const n=[];for(const i of Array.isArray(t.stop)?t.stop:[t.stop])Number.isInteger(i)?n.push(i):typeof i=="string"&&(e.stops||[]).forEach((o,a)=>o.place===i&&n.push(a));return n}shownAt(t,e){const n=this.events.get(t.id),i=new Set;if(!n)return i;let o=null;for(const a of n.recs){const r=this.namedStops(a,t);if(r){r.includes(e)&&i.add(a);continue}o||(o=this.stepsAt(t,e)),o.includes(a.step)&&i.add(a)}return i}choose(){var i;const t=this.app.tour,e=t!=null&&t.active?t.event:null;if(e&&this.events.has(e.id)&&t.stop>=0){if(((i=this._at)==null?void 0:i.ev)!==e||this._at.stop!==t.stop){const o=this.shownAt(e,t.stop);this._at={ev:e,stop:t.stop,now:{event:e.id,recs:o,steps:[...new Set([...o].map(a=>a.step))].sort((a,r)=>a-r),quiet:!1}}}return this._at.now}this._at=null;const n=this.app.timeline.year;for(const o of this.events.values())if(n>=o.from&&n<o.to+1)return(this._quiet||(this._quiet=new Map)).get(o.id)||this._quiet.set(o.id,{event:o.id,recs:null,steps:null,quiet:!0}).get(o.id);return this._none||(this._none={event:null,recs:new Set,steps:[],quiet:!1})}update(t,e,n=0){e*=1-vM(75,140,n),this.time+=t;const i=this.choose();this.showing=i;const o=t>0?1-Math.exp(-t*2):1;for(const r of this.forces){const c=r.event===i.event&&(i.recs===null||i.recs.has(r));r.goal=c?i.quiet?.2:1:0,r.w+=(r.goal-r.w)*o,Math.abs(r.goal-r.w)<.003&&(r.w=r.goal)}for(const r of this.lines)r.batch&&(r.batch.uniforms.uAlpha.value=.26*r.w*e);let a=0;if(!i.quiet&&i.recs)for(const r of i.recs)a=Math.max(a,r.w);this.stopShown=a*e,this.soldiers.update(t,e,i.quiet),this.marksShown=this.soldiers.drawn}stats(){const t=this.choose(),e=n=>n.event===t.event&&(t.recs===null||t.recs.has(n));return{event:t.event,steps:t.steps,quiet:t.quiet,by:t.recs?[...new Set([...t.recs].map(n=>n.stop===null||n.stop===void 0?"inferred":"named"))].join("+")||"none":"year",forces:this.forces.filter(n=>e(n)&&!n.stand).map(n=>n.p.name),lines:this.lines.filter(e).map(n=>n.p.name),marks:this.count,marksShown:this.marksShown??0,...this.soldiers.stats()}}dispose(){this.soldiers.dispose()}}function vM(s,t,e){const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)}const Ls={frame:-1,list:[]},xM=s=>1-Math.max(0,Math.min(1,(s-32)/30));class Ad{constructor(t,e,{items:n=null,alive:i=null,zoom:o=xM,cls:a="dlabel",layer:r="dlabels",avoid:c="",lang:l="haw"}={}){this.app=t,this.zoom=o,this.alive=i||((f,d)=>jo(f.p,d)),this.avoid=c;const h=document.getElementById("ui")||document.body;this.layer=document.createElement("div"),this.layer.className=r,h.insertBefore(this.layer,h.querySelector(".pins")||h.firstChild),this.items=[];const u=n??e.flatMap(f=>{const d=f.properties||{};if(d.kind!=="label"||!d.name)return[];const g=dn(f.geometry);if(!g)return[];const[v,m]=t.data.proj.toWorld(g);return[{p:d,name:d.name,x:v,z:m}]});for(const f of u){const d=document.createElement("div");d.className=f.cls||a,d.textContent=f.name,l&&(d.lang=l),this.layer.appendChild(d),this.items.push({...f,el:d,v:new W,shown:-1,tx:NaN,ty:NaN})}this.panels=[],this.frame=0}panelRects(){if(this.frame++%15===0){this.panels=[];for(const t of document.querySelectorAll(`.card, .timeline, .legend, .tools, .brand, .inspector${this.avoid?`, ${this.avoid}`:""}`)){if(t.hidden||!t.offsetParent)continue;const e=t.getBoundingClientRect();e.width>0&&e.height>0&&this.panels.push(e)}}return this.panels}update(t){const e=this.app,n=e.camera,i=innerWidth,o=innerHeight,a=e.rig.state.distance,r=this.zoom(a);Ls.frame!==e.frames?(Ls.frame=e.frames,Ls.list.length=0):Ls.list=Ls.list.filter(f=>f[3]!==this);const c=Ls.list,l=this.panelRects(),h=e.timeline.year,u=new Set;for(const f of this.items){let d=t*r*(this.alive(f,h)?1:0);if(d>.01&&u.has(f.name)&&(d=0),d>.01){f.v.set(f.x,e.world.heightAt(f.x,f.z)+.05,f.z).project(n),(f.v.z>1||f.v.z<-1)&&(d=0);const v=(f.v.x+1)/2*i,m=(1-f.v.y)/2*o;(v<-80||v>i+80||m<60||m>o+20)&&(d=0);const p=f.el.offsetWidth||60;d>.01&&l.some(x=>v+p/2>x.left-4&&v-p/2<x.right+4&&m+10>x.top-4&&m-10<x.bottom+4)&&(d=0),d>.01&&c.some(x=>Math.abs(x[0]-v)<(x[2]+p)/2+6&&Math.abs(x[1]-m)<18)&&(d=0),d>.01&&(c.push([v,m,p,this]),u.add(f.name)),d>.01&&!(Math.abs(v-f.tx)<=.3&&Math.abs(m-f.ty)<=.3)&&(f.el.style.transform=`translate(${v.toFixed(1)}px, ${m.toFixed(1)}px)`,f.tx=v,f.ty=m)}const g=Math.round(d*20)/20;g!==f.shown&&(f.el.style.opacity=String(g),f.el.style.visibility=g>0?"visible":"hidden",f.shown=g)}}visible(){return this.items.filter(t=>t.shown>.5).map(t=>t.name)}rects(){return this.items.filter(t=>t.shown>.5).map(t=>{const e=t.el.getBoundingClientRect();return{name:t.name,left:e.left,top:e.top,right:e.right,bottom:e.bottom}})}dispose(){this.layer.remove()}}const fn=4,Td={limewash:"#d6d0c0",cream:"#ccbf9f",paleGrey:"#b6b1a4",sage:"#959d86",ochre:"#b59967",duskRed:"#8f6152",paleBlue:"#98a5a4",shingle:"#6c665c",iron:"#6e706c",ironRed:"#7f5446",ironGreen:"#6f7a6a",coral:"#cbc1a8",adobe:"#b39b78",brick:"#97684f",stoneGrey:"#a19b90",concrete:"#c2bdb1",concreteWarm:"#c9bea6",glass:"#6a7f88",dark:"#4b4743",post:"#8a7b66",plinth:"#77706a",asphalt:"#6d6a66"},at=Td;function Te(s,t,e,n,i,o=0,a=0){s.box(o,-fn,a,t,n+fn,e,i,it.stone)}function Hn(s,t,e,n,i,o,a,r,{alongZ:c=!1,wallMat:l=it.plain,roofMat:h=it.roof,x:u=0,z:f=0,oe:d=o*.6}={}){const g=c?C=>[u+C[2],C[1],f+C[0]]:C=>[u+C[0],C[1],f+C[2]],v=c?e:t,m=c?t:e,p=i/(m/2),x=n-p*o,w=v/2+d,b=m/2+o,y=g([-w,x,-b]),S=g([w,x,-b]),E=g([-w,n+i,0]),T=g([w,n+i,0]),M=g([-w,x,b]),_=g([w,x,b]),A=c?(C,z,I,O,N,j)=>s.quad(O,I,z,C,N,j):(C,z,I,O,N,j)=>s.quad(C,z,I,O,N,j),R=c?(C,z,I,O,N)=>s.tri(I,z,C,O,N):(C,z,I,O,N)=>s.tri(C,z,I,O,N);A(y,E,T,S,a,h),A(_,T,E,M,a.map(C=>C*.84),h);const D=v/2;R(g([-D,n,-m/2]),g([-D,n,m/2]),g([-D,n+i,0]),r,l),R(g([D,n,m/2]),g([D,n,-m/2]),g([D,n+i,0]),r,l)}function Fi(s,t,e,n,i,o,a,{roofMat:r=it.roof,x:c=0,z:l=0}={}){const h=i/(e/2),u=n-h*o,f=t/2+o,d=e/2+o,g=Math.max(0,(t-e)/2),v=(x,w)=>[c+x*f,u,l+w*d],m=x=>[c+x*g,n+i,l],p=a.map(x=>x*.84);s.quad(v(-1,-1),m(-1),m(1),v(1,-1),a,r),s.quad(v(1,1),m(1),m(-1),v(-1,1),p,r),s.tri(v(-1,1),m(-1),v(-1,-1),a.map(x=>x*.92),r),s.tri(v(1,-1),m(1),v(1,1),a.map(x=>x*.92),r)}function Cd(s,t,e,n,i,o=0,a=0,r=it.roof){const c=t/2,l=[o,e+n,a],h=(u,f)=>[o+u*c,e,a+f*c];s.tri(h(-1,-1),l,h(1,-1),i,r),s.tri(h(1,1),l,h(-1,1),i.map(u=>u*.84),r),s.tri(h(-1,1),l,h(-1,-1),i.map(u=>u*.92),r),s.tri(h(1,-1),l,h(1,1),i.map(u=>u*.92),r)}function Gn(s,t,e,n,i,o,a,r,c,{posts:l=2,x:h=0,from:u=e/2}={}){const f=e/2,d=f+n;d-u>.05&&s.box(h,i-.35,(u+d)/2,t,.35,d-u,c,it.wood);const g=[h-t/2-.2,o,f],v=[h+t/2+.2,o,f],m=[h+t/2+.2,a,d+.3],p=[h-t/2-.2,a,d+.3];s.quad(g,p,m,v,r,it.roof);for(let x=0;x<l;x++){const w=h-t/2+.3+(t-.6)*x/Math.max(1,l-1);s.box(w,i,d-.2,.28,a-i,.28,c,it.wood)}}function ei(s,t,e,n,i=0,o=0){s.box(o,i,t/2+.15,e,n,.3,pt(at.dark,0),it.plain)}const wM=[[8.2,5,5.6],[7,4.6,5],[6,4.2,4.6],[5.2,4,4.4]];function yM(s,[t,e,n]){const i=new _e;return or(i,s,t,e,n,!0,fn),i}const hc=[[[-3,-4,.06,0],[5.6,-2.8,1.64,2],[-3.4,4.6,.12,3]],[[-1.6,-2.6,.15,0],[4.2,4.4,1.45,3]],[[-4.2,-4.2,-.05,1],[4.6,-3.6,1.6,2],[-4.8,4,1.5,2],[3.6,4.4,.08,3]],[[.2,-3.5,.04,1],[-4,4,-.06,2],[4.6,3.6,1.62,3]]];function MM(s,t){const e=new _e;return e.at(0,0,-2.2,0,1),or(e,s,6.8+t*.6,4.6,5.2,!0,fn),e.done(),e.at(t?-2.6:2.6,0,4.6,Math.PI/2,1),or(e,s,3.6,2.8,3.4,!1,fn),e.done(),e}function _M(s,t){const e=new _e,n=pt([at.limewash,at.cream,at.paleGrey][t],.06,s),i=pt(at.shingle,.1,s),o=pt(at.post,.1,s);return t===0?(Te(e,9+.4,7+.4,.6,pt(at.plinth,.1,s)),e.box(0,.6,0,9,3,7,n,it.clap),Hn(e,9,7,3.6,2.6,.5,i,n,{wallMat:it.clap}),Gn(e,9,7,2.2,.6,3.3,2.7,i,o,{from:7/2+.2}),ei(e,7,1.1,2.1,.6)):t===1?(Te(e,8+.4,6.5+.4,.5,pt(at.plinth,.1,s)),e.box(0,.5,0,8,5.8,6.5,n,it.clap),Hn(e,8,6.5,6.3,2.4,.5,i,n,{wallMat:it.clap}),Gn(e,8,6.5,2,3.4,5.8,5.4,i,o),Gn(e,8,6.5,2,.5,3.4,3.1,i,o,{from:6.5/2+.2})):(Te(e,9.6+.4,7+.4,.6,pt(at.plinth,.1,s)),e.box(0,.6,0,9.6,2.9,7,n,it.clap),Fi(e,9.6,7,3.5,2.2,.5,i),Gn(e,9.6-1.5,7,2.3,.6,3.2,2.6,i,o,{posts:3,from:7/2+.2})),e}function bM(s,t){const e=new _e;if(t===0){const o=pt(at.adobe,.08,s);Te(e,9+.6,6+.6,.3,pt(at.plinth,.1,s)),e.box(0,.3,0,9,2.8,6,o,it.masonry),Fi(e,9,6,3.1,2.8,.7,pt("#a58a5c",.12,s),{roofMat:it.thatch}),ei(e,6,1.1,2,.3)}else{const o=pt(at.coral,.06,s);Te(e,10.4+.4,8+.4,.4,pt(at.plinth,.1,s)),e.box(0,.4,0,10.4,6.4,8,o,it.masonry),Fi(e,10.4,8,6.8,2,.4,pt(at.shingle,.1,s)),Gn(e,10.4,8,2.2,3.6,6.4,6,pt(at.shingle,.1,s),pt(at.post,.1,s),{posts:3}),Gn(e,10.4,8,2.2,.4,3.6,3.2,pt(at.shingle,.1,s),pt(at.post,.1,s),{posts:3,from:8/2+.2})}return e}function SM(s,t){const e=new _e,n=pt([at.limewash,at.sage,at.cream][t],.06,s),i=pt([at.iron,at.ironRed,at.ironGreen][t],.08,s),o=pt(at.limewash,.05,s);return Te(e,9.4,8.4,.9,pt(at.plinth,.1,s)),t===1?(e.box(-1.5,.9,-1,7,3.1,6,n,it.clap),Hn(e,7,6,4,2.5,.5,i,n,{wallMat:it.clap,x:-1.5,z:-1}),e.box(2.6,.85,1.05,4,3.1,6.9,n,it.clap),Hn(e,4,6.9,3.95,2,.45,i,n,{wallMat:it.clap,alongZ:!0,x:2.6,z:1.05}),Gn(e,4.5,4,2,.9,3.7,3.2,i,o,{x:-2.3,from:4.2})):(e.box(0,.9,0,9,3.1,7.5,n,it.clap),t===0?Hn(e,9,7.5,4,2.7,.5,i,n,{wallMat:it.clap}):Fi(e,9,7.5,4,2.4,.55,i),Gn(e,9,7.5,2.4,.9,3.8,3.2,i,o,{posts:3,from:4.2}),ei(e,7.5,1,2.2,.9)),e}function EM(s,t,e=5.8){const n=new _e,i=12,o=[at.cream,at.limewash,at.ochre,at.paleBlue,at.sage,at.duskRed],a=pt(at.iron,.1,s),r=pt(at.post,.1,s);Te(n,t*e+.4,i+.4,.3,pt(at.plinth,.1,s));for(let c=0;c<t;c++){const l=(c-(t-1)/2)*e,h=pt(o[Math.floor(s()*o.length)],.08,s),u=4.2+s()*1.4;n.box(l,.3,0,e-.15,u,i,h,it.clap);const f=[l-e/2+.075,.3+u-.2,i/2-.6],d=[l+e/2-.075,.3+u-.2,i/2-.6],g=[l+e/2-.075,.3+u-1.3,-i/2-.4],v=[l-e/2+.075,.3+u-1.3,-i/2-.4];n.quad(f,d,g,v,pt(at.iron,.1,s),it.roof),n.box(l,.3+u,i/2-.175,e-.15,1.4+s()*1,.35,h,it.clap),ei(n,i,1.6,2.4,.3,l)}return Gn(n,t*e,i,2.6,.3,3.4,3.1,a,r,{posts:t+1,from:i/2+.2}),n}function AM(s,t){const e=new _e,n=[2,3,3][t],i=[11,10.5,11.2][t],o=[12,13,11][t],a=.4+n*3.7,r=pt([at.brick,at.stoneGrey,at.concreteWarm][t],.07,s);return Te(e,i+.3,o+.3,.4,pt(at.plinth,.1,s)),e.box(0,.4,0,i,a-.4,o,r,it.windows),e.box(0,a,0,i+.5,.45,o+.5,r.map(c=>c*.86),it.masonry),e.box(0,a+.45,0,i,.6,o,r.map(c=>c*.95),it.masonry),t===2&&Gn(e,i,o,2.5,.4,4,3.8,pt(at.iron,.1,s),pt(at.dark,.1,s),{posts:4,from:o/2+.15}),e}function TM(s,t){const e=new _e,n=pt([at.cream,at.sage,at.paleGrey][t],.07,s),i=pt([at.ironGreen,at.iron,at.ironRed][t],.1,s),o=[9.8,10,10.2][t],a=[8.6,9.5,8][t];return Te(e,o,a,.8,pt(at.plinth,.1,s)),e.box(0,.8,0,o,2.8,a,n,it.clap),t===1?(Hn(e,o,a,3.6,2,.8,i,n,{wallMat:it.clap}),Gn(e,6,a,2.6,.8,3.4,2.9,i,pt(at.limewash,.05,s),{x:-1.5})):(Fi(e,o+1.2,a+2.4,3.6,1.8,.7,i,{z:1.2}),e.box(0,.8,a/2+1.25,o-.4,.2,2.3,pt(at.post,.1,s),it.wood)),e}function CM(s,t){const e=new _e,n=[6,8][t],i=[13.6,13][t],o=[14,15][t],a=n*3.6,r=pt([at.concreteWarm,at.stoneGrey][t],.06,s);return Te(e,i+.3,o+.3,.3,pt(at.plinth,.1,s)),e.box(0,.3,0,i,4.4,o,r.map(c=>c*.9),it.masonry),e.box(0,4.7,0,i,a-4.4,o,r,it.windows),e.box(0,a+.3,0,i+.6,.6,o+.6,r.map(c=>c*.85),it.masonry),e.box(-i/4,a+.9,-o/5,3.5,2.2,3.5,r.map(c=>c*.9),it.plain),e}function RM(s,t){const e=new _e,n=pt([at.limewash,at.concreteWarm,at.paleBlue][t],.07,s),i=pt([at.iron,at.shingle,at.ironGreen][t],.1,s);if(t===2)return Te(e,9,8,.3,pt(at.plinth,.1,s)),e.box(0,.3,0,9,5.4,8,n,it.plain),Hn(e,9,8,5.7,1.4,.6,i,n),e;const o=11.5,a=9;return Te(e,o,a,.3,pt(at.plinth,.1,s)),e.box(-1.5,.3,0,o-3,2.7,a,n,it.plain),Fi(e,o-3,a,3,1.3,.7,i,{x:-1.5}),e.box(o/2-1.5,2.6,.4,3.2,.25,a-1.2,i.map(r=>r*.9),it.plain),e.box(o/2-.1,.3,a/2-1,.25,2.3,.25,n,it.plain),t===1&&e.box(-3.2,-fn,-a/2-1.4,4.4,fn+2.7,2.8,n.map(r=>r*.95),it.plain),e}function LM(s,t){const e=new _e,n=[3,4][t],i=18.4,o=10,a=n*3.1,r=pt([at.concrete,at.cream][t],.06,s);Te(e,i,o+2,.6,pt(at.plinth,.1,s)),e.box(0,.6,-.8,i,a,o-1.6,r,it.windows);for(let c=1;c<=n;c++)e.box(0,.6+c*3.1-.3,o/2-.4,i-.3,.3,1.6,r.map(l=>l*.9),it.plain);return Fi(e,i,o-1.6,a+.6,1.2,.4,pt(at.iron,.1,s),{z:-.8}),e}const Ji=60;function PM(s,t){const e=new _e,n=pt([at.concrete,at.concreteWarm,at.limewash][t],.06,s),i=n.map((o,a)=>o*.75+pt(at.glass,0,s)[a]*.25);return t===0?(e.box(0,-fn*3,0,29,fn*3+6,18,n.map(o=>o*.9),it.masonry),e.box(0,6,0,27,Ji-6,13,i,it.windows),e.box(0,Ji,0,27.6,1.2,13.6,n.map(o=>o*.85),it.plain)):t===1?(e.box(0,-fn*3,0,22,fn*3+1,22,n.map(o=>o*.9),it.masonry),e.box(0,1,0,20,Ji-1,20,i,it.windows),e.box(0,Ji,0,8,3,8,n.map(o=>o*.8),it.plain)):(e.box(0,-fn*3,0,28,fn*3+9,26,n.map(o=>o*.88),it.windows),e.box(-2,9,-2,17,Ji-9,16,i,it.windows),e.box(-2,Ji,-2,17.6,1,16.6,n.map(o=>o*.85),it.plain)),e}function DM(s,t){const e=new _e,n=pt([at.concrete,at.paleGrey,at.stoneGrey][t],.08,s),i=pt([at.iron,at.ironGreen,at.iron][t],.1,s),o=[12,12.2,11.6][t],a=[12.5,12,13][t];if(Te(e,o+.3,a+.3,.25,pt(at.plinth,.1,s)),t===1){e.box(0,.25,0,o,4.6,a,n,it.plain);const c=3,l=a/c;for(let h=0;h<c;h++){const u=-a/2+h*l,f=u+l,d=.25+4.6,g=d+2.2,v=-o/2,m=o/2;e.quad([v,d,u],[v,g,f],[m,g,f],[m,d,u],i,it.roof),e.quad([v,g,f],[v,d,f],[m,d,f],[m,g,f],pt(at.glass,.05,s),it.plain),e.tri([v,d,u],[v,d,f],[v,g,f],n,it.plain),e.tri([m,d,f],[m,d,u],[m,g,f],n,it.plain)}ei(e,a,3.6,3.4,.25)}else{const r=t===0?5.2:3.8;e.box(0,.25,0,o,r,a,n,it.clap),Hn(e,o,a,.25+r,t===0?1.6:2.6,.4,i,n,{alongZ:!0,wallMat:it.clap,roofMat:it.roof}),ei(e,a,t===0?4.2:6.5,t===0?4:3.4,.25)}return e}function kM(s){const t=new _e,e=pt(at.coral,.04,s),n=pt(at.shingle,.08,s),i=24,o=44;Te(t,i+1,o+1,.8,pt(at.plinth,.08,s)),t.box(0,.8,-2,i,9.2,o-4,e,it.masonry),Hn(t,i,o-4,10,6.5,.6,n,e,{alongZ:!0,wallMat:it.masonry,z:-2}),t.box(0,.75,o/2-3.6,9,22.05,8.4,e,it.masonry),t.box(0,22.8,o/2-3.6,9.6,.8,9,e.map(a=>a*.88),it.masonry);for(const[a,r]of[[-1,-1],[1,-1],[1,1],[-1,1]])t.box(a*4,23.6,o/2-3.6+r*3.5,1.2,1.4,1.2,e,it.masonry);return ei(t,2*(o/2-3.6+4.2),2.2,4,.8),t}function zM(s){const t=new _e,e=pt(at.limewash,.03,s),n=pt(at.iron,.08,s),i=13,o=24;return Te(t,i+.6,o+.6,.8,pt(at.plinth,.08,s)),t.box(0,.8,-1,i,6.4,o-2,e,it.clap),Hn(t,i,o-2,7.2,4.6,.5,n,e,{alongZ:!0,wallMat:it.clap,z:-1}),t.box(0,.75,o/2-1.3,4.5,14.05,4.9,e,it.clap),Cd(t,4.8,14.8,12,n,0,o/2-1.3),t}function IM(s){const t=new _e,e=pt(at.concreteWarm,.03,s);return Te(t,14,14,.5,pt(at.plinth,.08,s)),t.box(0,.5,0,12,40,12,e,it.windows),t.box(0,40.5,0,13,6,13,e.map(n=>n*.93),it.masonry),Cd(t,13,46.5,7,pt(at.ironGreen,.05,s)),t.cyl([0,53.5,0],[0,60,0],.25,.15,pt(at.dark,0),it.plain,4),t}function UM(s){const t=new _e,e=pt(at.concrete,.05,s),n=pt([at.iron,at.ironGreen][s()<.5?0:1],.06,s),i=60,o=48,a=9;Te(t,i+.6,o+.6,.3,pt(at.plinth,.08,s)),t.box(0,.3,0,i,a,o,e,it.plain);const r=.3+a,c=[[o/2+.4,r-.2],[o/3,r+3.2],[o/6,r+5],[0,r+5.6]];for(let u=0;u+1<c.length;u++){const[f,d]=c[u],[g,v]=c[u+1];t.quad([-i/2-.4,d,f],[i/2+.4,d,f],[i/2+.4,v,g],[-i/2-.4,v,g],n,it.roof),t.quad([i/2+.4,d,-f],[-i/2-.4,d,-f],[-i/2-.4,v,-g],[i/2+.4,v,-g],n.map(m=>m*.86),it.roof)}const l=u=>{for(let f=0;f+1<c.length;f++){const[d,g]=c[f],[v,m]=c[f+1];if(u<=d&&u>=v)return g+(m-g)*(d-u)/(d-v)}return r},h=[o/2,o/3,o/6,0];for(const u of[-1,1]){const f=u*i/2;for(let d=0;d+1<h.length;d++)for(const g of[1,-1]){const v=g>0?h[d]:-h[d+1],m=g>0?h[d+1]:-h[d],p=[f,r,v],x=[f,r,m],w=[f,l(Math.abs(m)),m],b=[f,l(Math.abs(v)),v];u>0?t.quad(p,x,w,b,e,it.plain):t.quad(b,w,x,p,e,it.plain)}}return ei(t,o,i*.8,a-1.2,.3),t}function Su(s,t){const e=new _e,n=pt([at.concrete,at.concreteWarm,at.limewash][Math.floor(s()*3)],.05,s),i=56,o=16,a=t*3.4;return Te(e,i+.4,o+.4,.6,pt(at.plinth,.08,s)),e.box(0,.6,0,i,a,o,n,it.windows),Fi(e,i,o,.6+a,2.6,.9,pt([at.ironRed,at.ironGreen,at.iron][Math.floor(s()*3)],.08,s)),ei(e,o,2.4,2.6,.6),e}function FM(s){const t=new _e,e=pt(at.concrete,.06,s),n=26,i=14;return Te(t,n+.4,i+.4,.4,pt(at.plinth,.08,s)),t.box(0,.4,0,n,4.2,i,e,it.clap),Hn(t,n,i,4.6,1.6,.5,pt(at.iron,.08,s),e,{wallMat:it.clap}),ei(t,i,3.2,3,.4),t}function NM(s){const t=new _e,e=pt(at.concrete,.05,s),n=30,i=22,o=4*3.6;return Te(t,n+.4,i+.4,.5,pt(at.plinth,.08,s)),t.box(0,.5,0,n,o,i,e,it.windows),t.box(0,.5+o,0,n+.4,.8,i+.4,e.map(a=>a*.88),it.plain),t}function OM(s){const t=(e,n,i,o=1)=>{const a=sr(e.geometry());a.computeBoundingBox();const r=a.boundingBox;return{geometry:a,hx:Math.max(-r.min.x,r.max.x),hz:Math.max(-r.min.z,r.max.z),box:[r.min.x,r.max.x,r.min.z,r.max.z],top:r.max.y,tris:a.index.count/3,L:n,W:i,storeys:o}};return{hangar:t(UM(s),60,48),barracks2:t(Su(s,2),56,16,2),barracks3:t(Su(s,3),56,16,3),low:t(FM(s),26,14),block:t(NM(s),30,22,4)}}function Rd(s,t={}){const e={},n=(i,o)=>{e[i]=o.map(a=>{const r=sr(a.geometry());r.computeBoundingBox();const c=r.boundingBox;r.dispose();const l=fn*(i==="tower"?3:1)+.25;t[i]&&a.box(0,-l,0,t[i][0],l+.2,t[i][1],pt(at.concrete,.05,s).map(u=>u*.88),it.plain);const h=sr(a.geometry());return{geometry:h,hx:Math.max(-c.min.x,c.max.x),hz:Math.max(-c.min.z,c.max.z),box:[c.min.x,c.max.x,c.min.z,c.max.z],top:c.max.y,tris:h.index.count/3}})};return n("kauhale",wM.map(i=>yM(s,i))),n("hale",[0,1].map(i=>MM(s,i))),n("frame",[0,1,2].map(i=>_M(s,i))),n("adobe",[0,1].map(i=>bM(s,i))),n("cottage",[0,1,2].map(i=>SM(s,i))),n("store",[[2,5.8],[1,9.4]].map(([i,o])=>EM(s,i,o))),n("block",[0,1,2].map(i=>AM(s,i))),n("bungalow",[0,1,2].map(i=>TM(s,i))),n("midrise",[0,1].map(i=>CM(s,i))),n("house",[0,1,2].map(i=>RM(s,i))),n("walkup",[0,1].map(i=>LM(s,i))),n("tower",[0,1,2].map(i=>PM(s,i))),n("shed",[0,1,2].map(i=>DM(s,i))),n("church",[kM(s)]),n("spire",[zM(s)]),n("clock",[IM(s)]),e}function dl(s=2,t=5e4){const e=Math.log(1+t/s),n=new Float32Array(256);for(let i=0;i<256;i++)n[i]=s*(Math.exp(i/255*e)-1);return{lut:n,decode:i=>s*(Math.exp(i/255*e)-1),encode:i=>Math.max(0,Math.min(255,Math.round(255*Math.log(1+Math.max(0,i)/s)/e)))}}const BM=s=>Math.max(1,Math.round(60/Math.max(1,s)));async function uc(s,t){const{arch:e}=s,n=dl(s.d0,s.dMax),i=e.W,o=e.H,a=e.rect,r=s.islands,c=new Int8Array(i*o).fill(-1),l=(a.x1-a.x0)/i,h=(a.z1-a.z0)/o;for(let v=0;v<o;v++){const m=a.z0+(v+.5)*h;for(let p=0;p<i;p++){const x=a.x0+(p+.5)*l;let w=0,b=-1;for(let y=0;y<r.length;y++){const S=r[y].rect,E=Math.min(x-S.x0,S.x1-x,m-S.z0,S.z1-m);E>w&&(w=E,b=y)}c[v*i+p]=b}}const u=new Float32Array(i*o*3),f=new Float32Array(i*o),d={kf:s.kf,arch:null,islands:[]};for(let v=0;v<r.length;v++){const m=r[v],{W:p,H:x}=m,[w,b,y]=await Promise.all(["cultivation","settlement","forest"].map(R=>WM(m.layers[R],p,x,t,`${m.id} ${R}`))),S=m.land&&m.land.length===p*x?m.land:null,E=m.rect,T=(E.x1-E.x0)/p,M=(E.z1-E.z0)/x,_=new Int32Array(p);for(let R=0;R<p;R++)_[R]=Math.floor((E.x0+(R+.5)*T-a.x0)/l);for(let R=0;R<x;R++){const D=Math.floor((E.z0+(R+.5)*M-a.z0)/h);if(D<0||D>=o)continue;const C=R*p;for(let z=0;z<p;z++){const I=_[z];if(I<0||I>=i)continue;const O=D*i+I;if(c[O]!==v)continue;const N=C+z;S&&!S[N]||(u[O*3]+=w[N],u[O*3+1]+=n.lut[b[N]],u[O*3+2]+=y[N],f[O]++)}}const A=Math.max(1,m.f||1);if(A===1){const R=new Uint8Array(p*x*4);for(let D=0;D<p*x;D++)R[D*4]=w[D],R[D*4+1]=b[D],R[D*4+2]=y[D],R[D*4+3]=255;S&&fc(R,p,x,S,2),d.islands.push({id:m.id,W:p,H:x,data:R})}else{const R=Math.max(1,Math.round(p/A)),D=Math.max(1,Math.round(x/A)),C=new Float32Array(R*D*3),z=new Float32Array(R*D),I=new Int32Array(p);for(let N=0;N<p;N++)I[N]=Math.min(R-1,Math.floor((N+.5)*R/p));for(let N=0;N<x;N++){const j=Math.min(D-1,Math.floor((N+.5)*D/x))*R;for(let H=0;H<p;H++){const J=N*p+H;if(S&&!S[J])continue;const ot=j+I[H];C[ot*3]+=w[J],C[ot*3+1]+=n.lut[b[J]],C[ot*3+2]+=y[J],z[ot]++}}const O=Eu(C,z,R*D,n);fc(O,R,D,z,2),d.islands.push({id:m.id,W:R,H:D,data:O})}}const g=Eu(u,f,i*o,n);return fc(g,i,o,f,3),d.arch={W:i,H:o,data:g},d}function fc(s,t,e,n,i){let o=Uint8Array.from(n,a=>a?1:0);for(let a=0;a<i;a++){const r=o.slice();for(let c=0;c<e;c++)for(let l=0;l<t;l++){const h=c*t+l;if(o[h])continue;let u=0,f=0,d=0,g=0;const v=m=>{o[m]&&(u++,f+=s[m*4],d+=s[m*4+1],g+=s[m*4+2])};l>0&&v(h-1),l<t-1&&v(h+1),c>0&&v(h-t),c<e-1&&v(h+t),u&&(s[h*4]=Math.round(f/u),s[h*4+1]=Math.round(d/u),s[h*4+2]=Math.round(g/u),r[h]=1)}o=r}}function Eu(s,t,e,n){const i=new Uint8Array(e*4);for(let o=0;o<e;o++){const a=t[o];i[o*4+3]=255,a&&(i[o*4]=Math.round(s[o*3]/a),i[o*4+1]=n.encode(s[o*3+1]/a),i[o*4+2]=Math.round(s[o*3+2]/a))}return i}async function WM(s,t,e,n,i){if(!s)return new Uint8Array(t*e);if(typeof s=="string")return dc(await n(s),t,e,s);const[o,a]=await Promise.all([n(s.from),n(s.to)]),r=dc(o,t,e,s.from),c=dc(a,t,e,s.to),l=s.t,h=new Uint8Array(t*e);for(let u=0;u<t*e;u++)h[u]=Math.round(r[u]+(c[u]-r[u])*l);return h}function dc(s,t,e,n){if(s.W!==t||s.H!==e)throw new Error(`${n} is ${s.W}×${s.H}, the pack is ${t}×${e}`);return s.px}async function Fo(s,t){const{px:e,W:n,H:i}=await s(t),o=new Uint8Array(n*i);for(let a=0,r=0;a<n*i;a++,r+=4)o[a]=e[r];return{px:o,W:n,H:i}}const Au=["cultivation","settlement","forest"],GM={cultivation:"Cultivation",settlement:"Settlement",forest:"Native forest"},ns=[1100,1450],HM=3,La=.002,VM=10,Is=(s,t,e)=>Math.max(t,Math.min(e,s)),Tu=(s,t,e)=>{const n=Is((e-s)/(t-s),0,1);return n*n*(3-2*n)};function $M(){const s=new Ze(new Uint8Array([0,0,0,255]),1,1,De,ge);return s.needsUpdate=!0,s}function jM(s){var n;const t=(n=s.data)==null?void 0:n.metres;if(!t)return null;const e=new Uint8Array(t.length);for(let i=0;i<t.length;i++)e[i]=t[i]>0?1:0;return e}function Cu(s,t,e,n){const i=new Ze(s,t,e,De,ge);return i.minFilter=ls,i.magFilter=je,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=cn,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class XM{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.blank=$M();const e=t.shared.uniforms;Object.assign(e,{uArchLandA:{value:this.blank},uArchLandB:{value:this.blank},uLandT:{value:0},uLandK:{value:0},uLandEarly:{value:1}}),this.uniforms=e,this.available=null,this.manifest=null,this.keyframes=[],this.resident=new Map,this.loading=new Map,this.bound=null,this.swapTo=null,this.kpShown=0,this.fade=0,this.fadeGoal=0,this.listeners=[],this.chain=Promise.resolve(),this.jobN=0,this.uploads=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){var a;const t=this.data.abs("layers/manifest.json");let e;try{const r=await fetch(t);if(!r.ok)throw new Error(`HTTP ${r.status}`);if(e=await r.json(),!Array.isArray(e==null?void 0:e.keyframes)||!e.keyframes.length||!e.islands)throw new Error("no keyframes or islands")}catch(r){this.available=!1,this.warn(`${t}: ${r.message} (no land layers)`),this.notify();return}this.manifest=e,this.keyframes=[...e.keyframes].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),this.kfIndex=new Map(this.keyframes.map((r,c)=>[r.id,c]));const n=((a=e.encoding)==null?void 0:a.settlement)||{};this.codec=dl(n.d0??2,n.dMax??5e4);const i=this.app.world;this.islands=i.islandPacks.filter(r=>e.islands[r.id]).map(r=>({pack:r,entry:e.islands[r.id]}));const o=i.archPack;this.arch={W:Math.max(1,Math.round(o.W/2)),H:Math.max(1,Math.round(o.H/2)),rect:o.rect},this.eraYears=this.app.timeline.eras.map(r=>this.eraYear(r)),this.available=!0,this.notify()}eraYear(t){var i,o;const e=(o=(i=this.manifest.eras)==null?void 0:i[t.id])==null?void 0:o.cultivation,n=a=>{var r;return(r=this.keyframes[this.kfIndex.get(a)])==null?void 0:r.year};return e!=null&&e.keyframe&&n(e.keyframe)!==void 0?n(e.keyframe):e!=null&&e.from&&n(e.from)!==void 0&&n(e.to)!==void 0?n(e.from)+(n(e.to)-n(e.from))*(e.t??0):t.year}kpAtYear(t){const e=this.keyframes;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}position(t=this.app.timeline.s){const e=this.eraYears;if(!(e!=null&&e.length))return 0;const n=Is(t,0,e.length-1),i=Math.min(e.length-2,Math.floor(n));return i<0?this.kpAtYear(e[0]):this.kpAtYear(e[i]+(e[i+1]-e[i])*(n-i))}bracket(t){const e=this.keyframes.length,n=r=>this.keyframes[r].id;if(e<2)return{a:n(0),b:n(0),t:0,need:[n(0)]};const i=Is(Math.floor(t),0,e-2),o=Is(t-i,0,1),a=o<La?[n(i)]:o>1-La?[n(i+1)]:[n(i),n(i+1)];return{a:n(i),b:n(i+1),t:o,need:a}}covers(t,e){return t?e>=this.kfIndex.get(t.a)-La&&e<=this.kfIndex.get(t.b)+La:!1}clampTo(t,e){return Is(e,this.kfIndex.get(t.a),this.kfIndex.get(t.b))}job(t){var r;const e=this.keyframes,n=this.kfIndex.get(t),i=c=>this.data.abs(`layers/${c}`),o=(c,l)=>{const h=d=>{var g,v,m;return(m=(v=(g=c.layers)==null?void 0:g[e[d].id])==null?void 0:v[l])==null?void 0:m.file};if(h(n))return i(h(n));let u=n-1;for(;u>=0&&!h(u);)u--;let f=n+1;for(;f<e.length&&!h(f);)f++;return u>=0&&f<e.length?{from:i(h(u)),to:i(h(f)),t:(e[n].year-e[u].year)/(e[f].year-e[u].year)}:u>=0?i(h(u)):f<e.length?i(h(f)):null},a=((r=this.manifest.encoding)==null?void 0:r.settlement)||{};return{kf:t,d0:a.d0??2,dMax:a.dMax??5e4,arch:this.arch,islands:this.islands.map(({pack:c,entry:l})=>({id:c.id,W:c.W,H:c.H,f:BM(Math.max(c.mx,c.mz)),rect:c.rect,land:jM(c),layers:Object.fromEntries(Au.map(h=>[h,o(l,h)]))}))}}request(t){const e=this.chain=this.chain.catch(()=>{}).then(()=>{if(!this.wanted(t))return null;const n=performance.now();return this.run(this.job(t)).then(i=>{this.arrive(i),this.lastBakeMs=Math.round(performance.now()-n)})}).catch(n=>this.warn(`land layers ${t}: ${n.message}`)).finally(()=>{this.loading.delete(t)});return this.loading.set(t,e),e}wanted(t){var n,i;const e=this.bracket(this.position());return this.bound&&this.app.view!=="land"?!1:e.need.includes(t)||((n=this.swapTo)==null?void 0:n.a)===t||((i=this.swapTo)==null?void 0:i.b)===t}run(t){const e=n=>Fo(Qn,n);if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("layers-worker-OijIdfIP.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=n=>this.reply(n.data),this.worker.onerror=n=>{var o;(o=n.preventDefault)==null||o.call(n),this.fallback=!0;const i=this.pending;this.pending=null,i&&uc(i.job,e).then(i.resolve,i.reject)}}catch{this.fallback=!0}return this.fallback?uc(t,e):new Promise((n,i)=>{const o=++this.jobN;this.pending={id:o,job:t,resolve:n,reject:i},this.worker.postMessage({...t,job:o})})}reply(t){const e=this.pending;!e||t.job!==e.id||(this.pending=null,t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,uc(e.job,n=>Fo(Qn,n)).then(e.resolve,e.reject)):e.reject(new Error(t.message)))}arrive(t){const e=Math.min(4,this.app.renderer.capabilities.getMaxAnisotropy()),n={id:t.kf,arch:Cu(t.arch.data,t.arch.W,t.arch.H,e),archData:t.arch.data,islands:new Map(t.islands.map(i=>[i.id,Cu(i.data,i.W,i.H,e)])),texels:t.arch.W*t.arch.H+t.islands.reduce((i,o)=>i+o.W*o.H,0),used:performance.now()};this.resident.set(t.kf,n),this.uploads.push(n.arch,...n.islands.values())}dropUnused(){var n,i,o,a;const t=performance.now(),e=new Set([(n=this.bound)==null?void 0:n.a,(i=this.bound)==null?void 0:i.b,(o=this.swapTo)==null?void 0:o.a,(a=this.swapTo)==null?void 0:a.b,...this.bracket(this.position()).need]);for(const[r,c]of this.resident){if(e.has(r)){c.used=t;continue}if(this.resident.size>HM||t-c.used>VM*1e3){c.arch.dispose();for(const l of c.islands.values())l.dispose();this.resident.delete(r),this.uploads=this.uploads.filter(l=>l!==c.arch&&![...c.islands.values()].includes(l))}}}resolve(t){const e=this.resident.has(t.a)?t.a:t.b;return{a:e,b:this.resident.has(t.b)?t.b:e}}bind(t){const{a:e,b:n}=this.resolve(t);this.bound={a:e,b:n};const i=this.resident.get(e),o=this.resident.get(n),a=this.uniforms;a.uArchLandA.value=i.arch,a.uArchLandB.value=o.arch;for(const r of this.app.world.islands)this.attach(r);this.notify()}attach(t){const e=t.uniforms;if(!e.uOwnLandA)return;const n=this.bound&&this.resident.get(this.bound.a),i=this.bound&&this.resident.get(this.bound.b);e.uOwnLandA.value=(n==null?void 0:n.islands.get(t.pack.id))||this.blank,e.uOwnLandB.value=(i==null?void 0:i.islands.get(t.pack.id))||this.blank}update(t,e){const n=this.uniforms;if(n.uLandEarly.value=Tu(ns[0],ns[1],this.app.timeline.year),!this.available){n.uLandK.value=0;return}const i=this.position(),o=this.bracket(i);if(this.app.view==="land"||e>.001||!this.bound)for(const l of o.need)!this.resident.has(l)&&!this.loading.has(l)&&this.request(l);const r=o.need.every(l=>this.resident.has(l));if(r&&!this.swapTo&&!this.covers(this.bound,i)&&(!this.bound||this.fade<.02?(this.bind(o),this.kpShown=this.clampTo(this.bound,i)):this.covers(this.resolve(o),this.kpShown)?this.bind(o):this.swapTo=o),this.swapTo?(this.fadeGoal=0,this.fade<.02&&(this.bind(r?o:this.swapTo),this.swapTo=null,this.kpShown=this.clampTo(this.bound,i))):this.fadeGoal=this.bound?1:0,this.bound){const l=this.clampTo(this.bound,i);this.kpShown+=(l-this.kpShown)*(1-Math.exp(-t*8)),Math.abs(l-this.kpShown)<1e-4&&(this.kpShown=l)}this.fade+=(this.fadeGoal-this.fade)*(1-Math.exp(-t*6)),Math.abs(this.fadeGoal-this.fade)<.003&&(this.fade=this.fadeGoal),this.apply(e),this.dropUnused();const c=this.uploads.shift();c!=null&&c.image.data&&this.app.renderer.initTexture(c)}apply(t){const e=this.uniforms;if(this.bound){const n=this.kfIndex.get(this.bound.a),i=this.kfIndex.get(this.bound.b);e.uLandT.value=i>n?Is((this.kpShown-n)/(i-n),0,1):0}e.uLandK.value=t*this.fade}settle(t){if(!this.available)return;const e=this.position(),n=this.bracket(e);n.need.every(i=>this.resident.has(i))&&!this.covers(this.bound,e)&&this.bind(n),this.swapTo=null,this.bound&&(this.kpShown=this.clampTo(this.bound,e)),this.fade=this.fadeGoal=this.bound?1:0,this.uniforms.uLandEarly.value=Tu(ns[0],ns[1],this.app.timeline.year),this.apply(t)}get ready(){return!!this.available&&this.covers(this.bound,this.position())&&!this.swapTo&&this.fade>.99}describe(){if(!this.available)return null;const{a:t,b:e,need:n}=this.bracket(this.position()),i=this.keyframes,o=(l,h)=>{var g,v,m,p,x,w,b,y,S,E;const u=this.kfIndex.get(l),f=(m=(v=(g=this.manifest.methods)==null?void 0:g[l])==null?void 0:v[h])==null?void 0:m.method;if(f||(p=i[u].layers)!=null&&p.includes(h))return f?[f]:[];const d=[];for(let T=u-1;T>=0;T--){const M=(b=(w=(x=this.manifest.methods)==null?void 0:x[i[T].id])==null?void 0:w[h])==null?void 0:b.method;if(M){d.push(M);break}}for(let T=u+1;T<i.length;T++){const M=(E=(S=(y=this.manifest.methods)==null?void 0:y[i[T].id])==null?void 0:S[h])==null?void 0:E.method;if(M){d.push(M);break}}return d},a=Au.map(l=>{const h=n.flatMap(f=>o(f,l)),u=h.includes("modelled")?"modelled":h.includes("mixed")?"partly modelled":"";return{id:l,name:GM[l],note:u}}),r=l=>i[this.kfIndex.get(l)].year;return{years:n.length>1?[r(t),r(e)]:[r(n[0])],layers:a,early:this.app.timeline.year<ns[1]}}valuesAt(t,e){if(!this.bound)return null;const n=this.resident.get(this.bound.a),i=this.resident.get(this.bound.b);if(!n||!i)return null;const{W:o,H:a,rect:r}=this.arch,c=Math.floor((t-r.x0)/(r.x1-r.x0)*o),l=Math.floor((e-r.z0)/(r.z1-r.z0)*a);if(c<0||l<0||c>=o||l>=a)return null;const h=(l*o+c)*4,u=this.uniforms.uLandT.value,f=d=>n.archData[h+d]+(i.archData[h+d]-n.archData[h+d])*u;return{cultivation:f(0)/255,people:this.codec.decode(f(1)),forest:f(2)/255}}stats(){let t=0,e=0;for(const n of this.resident.values())t+=n.texels,e+=n.archData.byteLength;return{available:this.available,resident:[...this.resident.keys()],bound:this.bound?`${this.bound.a}/${this.bound.b}`:null,t:+this.uniforms.uLandT.value.toFixed(3),k:+this.uniforms.uLandK.value.toFixed(3),gpuMB:+(t*4*4/3/1048576).toFixed(1),cpuMB:+(e/1048576).toFixed(1),bakeMs:this.lastBakeMs??null}}dispose(){var t;for(const e of this.resident.values()){e.arch.dispose();for(const n of e.islands.values())n.dispose()}this.resident.clear(),(t=this.worker)==null||t.terminate()}}const jt=(s,t,e)=>Math.max(t,Math.min(e,s)),ce=(s,t,e)=>{const n=jt((e-s)/(t-s),0,1);return n*n*(3-2*n)},Di=.36,fi=.4,Ld=.14,pl=.14,pi=4*Di+Ld,ki=2*fi+pl,Gt=5,Ru=8/(pi*ki)*100,Lu=5e3,Yn=.012,ml=Kn(.15),qM=fi/2+pl/2-Yn,os=3.5,Pu=.8,Du=Fe*1.4,Le=Fe*1.25,xi={kauhale:{sh:Du,sv:Du,relief:2.5,loose:!0},hale:{sh:Le,sv:Le,relief:3,jitter:.2},frame:{sh:Le,sv:Le,relief:3,jitter:.3},adobe:{sh:Le,sv:Le,relief:3,jitter:.3},cottage:{sh:Le,sv:Le,relief:3.5},store:{sh:Le,sv:Le,relief:3},block:{sh:Le,sv:Le,relief:3},bungalow:{sh:Le*.92,sv:Le*.92,relief:4},midrise:{sh:Fe,sv:Fe*.8,relief:4},house:{sh:Le*.9,sv:Le*.9,relief:6},walkup:{sh:Fe*.75,sv:Fe*.75,relief:5},tower:{sh:Fe*.48,sv:Fe*.58,relief:6},shed:{sh:Le*.9,sv:Le*.9,relief:4},church:{sh:Fe*.85,sv:Fe*.85,relief:3},spire:{sh:Le*.9,sv:Le*.9,relief:3},clock:{sh:Fe*.7,sv:Fe*.7,relief:3}},Zn=Object.keys(xi),gl=Object.fromEntries(["walkup","tower"].map(s=>[s,[(Di-2*Yn)/xi[s].sh,(fi-2*Yn)/xi[s].sh]])),Dt=Object.fromEntries(Zn.map((s,t)=>[s,t])),YM=new Set(["church","spire","clock"]),Se={houses:1,lowrise:2,highrise:3,commercial:4,downtown:5,industrial:6,resort:7,agricultural:8,conservation:9,military:10,institutional:11,parks:12},pc={rural:2,agricultural:3,conservation:4},KM=1960,mc=1964,lr={[Se.downtown]:9e3,[Se.resort]:8e3,[Se.commercial]:4e3,[Se.industrial]:3500,[Se.institutional]:1500,[Se.military]:800,[Se.agricultural]:120},ZM=4,JM=[1100,1200,1300,1400,1450,1600,1700],QM=.6,ku=2.5,Pa=1e5,t_=232,e_=1936,n_=1800,i_=(()=>{let s=[[0]];for(let t=0;t<3;t++){const e=s.length,n=Array.from({length:2*e},()=>new Array(2*e));for(let i=0;i<e;i++)for(let o=0;o<e;o++){const a=4*s[i][o];n[i][o]=a,n[i][o+e]=a+2,n[i+e][o]=a+3,n[i+e][o+e]=a+1}s=n}return s})(),s_=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];function hr(s,t,e){const n=Math.floor(s),i=Math.floor(t),o=s-n,a=t-i,r=o*o*(3-2*o),c=a*a*(3-2*a),l=ye(n,i,e),h=ye(n+1,i,e),u=ye(n,i+1,e),f=ye(n+1,i+1,e);return l+(h-l)*r+(u-l+(l-h+f-u)*r)*c}function No(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function o_(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function a_(s,t){var o,a,r,c,l,h,u;const e=s==null?void 0:s.zoning,n=((o=e==null?void 0:e.islands)==null?void 0:o[t])??(e==null?void 0:e[t])??((r=(a=s==null?void 0:s.islands)==null?void 0:a[t])==null?void 0:r.zoning)??((u=(h=(l=(c=s==null?void 0:s.islands)==null?void 0:c[t])==null?void 0:l.layers)==null?void 0:h.now)==null?void 0:u.zoning)??null;if(!n)return{zoning:null,lud:null};const i=f=>typeof f=="string"?f:(f==null?void 0:f.file)||null;return{zoning:i(n.zoning??n.now??(n.file?n:null)),lud:i(n.lud)}}async function Pd(s,t,e){var h;let n=null,i=t;const o=(h=s.params)==null?void 0:h.get("zoning");if(o)try{n=new URL(o.endsWith("/")?o:`${o}/`,location.href);const u=await fetch(new URL("layers/manifest.json",n));i=u.ok?await u.json():null}catch{i=null}const a=a_(i,e),r=async u=>{if(!u)return null;try{const f=n?new URL(`layers/${u}`,n).href:s.data.abs(`layers/${u}`);return await Fo(Qn,f)}catch(f){return s.warn(`zoning ${e}: ${u}: ${f.message} (the settlements go by density and value there)`),null}},[c,l]=await Promise.all([r(a.zoning),r(a.lud)]);return{zoning:c,lud:l,files:a}}function Do(s,t,e,n){if(!s)return 0;const i=Math.floor((e-t.x0)/(t.x1-t.x0)*s.W),o=Math.floor((n-t.z0)/(t.z1-t.z0)*s.H);return i<0||o<0||i>=s.W||o>=s.H?0:s.px[o*s.W+i]}class Dd{constructor(t){this.app=t,this.sites=0}setLayers(t){var a;const e=[...t.keyframes||[]].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),n=((a=t.encoding)==null?void 0:a.settlement)||{},i=n.dMax??5e4;this.d0=n.d0??2,this.L=Math.log(1+i/this.d0),this.codec=dl(this.d0,i),this.keyframes=e;const o=r=>{var c;return(c=e.find(l=>l.id===r))==null?void 0:c.year};this.eraYears=this.app.timeline.eras.map(r=>{var l,h;const c=(h=(l=t.eras)==null?void 0:l[r.id])==null?void 0:h.settlement;return c!=null&&c.keyframe&&o(c.keyframe)!==void 0?o(c.keyframe):c!=null&&c.from&&o(c.from)!==void 0&&o(c.to)!==void 0?o(c.from)+(o(c.to)-o(c.from))*(c.t??0):r.year}),this.lut=new Float32Array(256*8+1);for(let r=0;r<=256*8;r++)this.lut[r]=this.d0*(Math.exp(r/8/255*this.L)-1)}layerFiles(t){return this.keyframes.map(e=>{var n,i,o,a,r,c;return{settlement:((o=(i=(n=t.layers)==null?void 0:n[e.id])==null?void 0:i.settlement)==null?void 0:o.file)||null,value:((c=(r=(a=t.layers)==null?void 0:a[e.id])==null?void 0:r.value)==null?void 0:c.file)||null}})}kpAt(t){const e=this.app.timeline,n=this.eraYears,i=this.keyframes;let o=t;if(n.length>1){const a=jt(e.sAtYear(t),0,n.length-1),r=Math.min(n.length-2,Math.floor(a));o=n[r]+(n[r+1]-n[r])*(a-r)}if(o<=i[0].year)return 0;for(let a=0;a+1<i.length;a++)if(o<=i[a+1].year)return a+(o-i[a].year)/(i[a+1].year-i[a].year);return i.length-1}sample(t,e,n,i,o){const a=this.crop,r=jt((e-a.x0)/a.sx-.5,0,a.w-1.001),c=jt((n-a.z0)/a.sz-.5,0,a.h-1.001),l=r|0,h=c|0,u=r-l,f=c-h,d=h*a.w+l;for(let g=0;g<t.length;g++){const v=t[g],m=v[d]+(v[d+1]-v[d])*u,p=v[d+a.w]+(v[d+a.w+1]-v[d+a.w])*u,x=m+(p-m)*f;i[g]=x>.5?x+o:0}return i}bytesAt(t,e,n){const i=(hr(t/1.7,e/1.7,71)-.5)*26+(hr(t/.55,e/.55,72)-.5)*12;return this.sample(this.bytes,t,e,n,i)}people(t){return t<=0?0:t<256?this.lut[Math.round(t*8)]:this.d0*(Math.exp(t/255*this.L)-1)}townTerm(t,e,n="island"){const i=this.keyframes,o=this.app.data.proj,a=this.crop,r=this.islandRect;this.townTerms=[],i.forEach((c,l)=>{var w,b,y,S,E,T,M,_,A,R;const h=(b=(w=t.methods)==null?void 0:w[c.id])==null?void 0:b.settlement;if(c.year<n_||!h||(y=h.towns)!=null&&y.length)return;const u=i.slice(l+1).find(D=>{var C,z,I,O;return(O=(I=(z=(C=t.methods)==null?void 0:C[D.id])==null?void 0:z.settlement)==null?void 0:I.towns)==null?void 0:O.length}),f=(S=h.populations)==null?void 0:S[e];if(!u||!Number.isFinite(f))return;const d=t.methods[u.id].settlement,g=d.towns.map(D=>({...D,xz:o.toWorld([D.lon,D.lat])})).filter(D=>D.xz[0]>r.x0&&D.xz[0]<r.x1&&D.xz[1]>r.z0&&D.xz[1]<r.z1&&(D.share||0)>0);if(!g.length)return;const v=(R=(A=(_=(M=(T=(E=t.islands)==null?void 0:E[e])==null?void 0:T.layers)==null?void 0:M[u.id])==null?void 0:_.settlement)==null?void 0:A.stats)==null?void 0:R.people;for(const D of g){let C=1;if(n==="district"){const z=(d.districts||[]).find(I=>I.name===D.district);C=z&&v?jt(z.pop/v,.05,1):.25}D.people=f*(D.share||0)*C}const m=Math.min(.9,g.reduce((D,C)=>D+C.people,0)/f),p=Float32Array.from(this.bytes[l]),x=new Float32Array(a.w*a.h);for(const D of g){const C=(D.sigma||1500)/1e3,z=4*C*1e3/100,I=jt(Math.floor((D.xz[0]-z-a.x0)/a.sx),0,a.w-1),O=jt(Math.ceil((D.xz[0]+z-a.x0)/a.sx),0,a.w-1),N=jt(Math.floor((D.xz[1]-z-a.z0)/a.sz),0,a.h-1),j=jt(Math.ceil((D.xz[1]+z-a.z0)/a.sz),0,a.h-1),H=D.people/(2*Math.PI*C*C);for(let J=N;J<=j;J++)for(let ot=I;ot<=O;ot++){const Y=a.x0+(ot+.5)*a.sx,nt=a.z0+(J+.5)*a.sz,ct=((Y-D.xz[0])**2+(nt-D.xz[1])**2)/100;x[J*a.w+ot]+=H*Math.exp(-ct/(2*C*C))}}for(let D=0;D<p.length;D++){if(p[D]<=0&&x[D]<=0||p[D]<=0)continue;const C=this.codec.decode(p[D])*(1-m)+x[D];p[D]=255*Math.log(1+Math.max(0,C)/this.d0)/this.L}this.bytes[l]=p,this.townTerms.push({keyframe:c.id,from:u.id,towns:g.map(D=>D.name),people:Math.round(f*m)})})}years(t){const e=this.app.timeline,n=e.yearAt(0),i=e.yearAt(e.max),o=new Set([...t].filter(c=>c>n&&c<=i)),a=this.keyframes[0].year,r=new Set([n,...JM.filter(c=>c>n&&c<a),...o]);for(let c=a;c<=i;c+=ZM)r.add(c);r.add(i),this.Ys=[...r].filter(c=>c>=n&&c<=i).sort((c,l)=>c-l),this.isBreak=this.Ys.map(c=>o.has(c)),this.edges=[...o].sort((c,l)=>c-l),this.epochAt=this.Ys.map(c=>this.epochOfYear(c)),this.samples=this.Ys.map(c=>{const l=this.kpAt(c),h=Math.min(this.keyframes.length-2,Math.floor(l)),u=[1820,1860,1900,1960].map(d=>ce(d-10,d+10,c)),f=[1-u[0],u[0]-u[1],u[1]-u[2],u[2]-u[3],u[3]];return{y:c,a:h,t:l-h,early:25.5*(1-ce(ns[0],ns[1],c)),w:f}})}epochOfYear(t){const e=this.edges;let n=0;for(;n<e.length&&t>=e[n];)n++;return n}fill(t,e){const n=Math.min(.08333333333333333,e/(8*Ru)),i=t.w,o=e/Lu;let a=0;return i[1]&&(a+=i[1]*Math.min(.8,Math.max(o,.8*(e/700)**2))),i[2]&&(a+=i[2]*Math.min(.9,Math.max(o,.9*(e/1300)**2.5))),i[3]&&(a+=i[3]*Math.min(.9,Math.max(o,.9*(e/2500)**1.5))),i[4]&&(a+=i[4]*(e<6e3?Math.min(.85,Math.max(o,.85*(e/6e3)**1.2)):.85-.45*ce(6e3,15e3,e))),[a,n]}fillMax(t){return Math.max(4*Math.min(1/12,t/(8*Ru)),Math.min(.9,t/Lu),Math.min(.8,.8*(t/700)**2),Math.min(.9,.9*(t/1300)**2.5),Math.min(.9,.9*(t/2500)**1.5),Math.min(.85,.85*(t/6e3)**1.2))}valueAt(t,e,n){if(t.vb)return jt((t.vb[e.a]+(t.vb[e.a+1]-t.vb[e.a])*e.t)/255,0,1);const i=ce(1.5,4,Math.log10(Math.max(1,n))),o=ce(1800,2e3,e.y);return jt(.34*i+.14*t.coast+.16*t.harbour+.22*t.centre+.1*o+.24*(t.r8-.5),0,1)}kindAt(t,e,n,i,o){const a=jt(Math.log10(Math.max(1,e)/300),-1,1),r=t-i.lag*(1-.6*Math.max(0,a));if(t<1818||r<1820)return o?Dt.kauhale:Dt.hale;const c=ce(.35,.8,n);if(r<1860){const u=(1-ce(1820,1880,r+12*a))*(1.15-.6*c);return i.r2<u?Dt.hale:i.r3<.15+.5*c?Dt.adobe:Dt.frame}if(r<1900){if(e>1150&&i.r3<.3||e>450&&i.r3<.42*ce(.6,.9,n))return Dt.block;if(e>700&&i.r3<.55||e>250&&i.r3<.6*ce(.5,.8,n))return Dt.store;const u=(1-ce(1820,1880,r+12*a))*(1.2-.8*c);return i.r2<u?Dt.hale:i.r4<.2?Dt.frame:Dt.cottage}if(r<1960)return e>4e3&&i.r3<.5||e>2e3&&i.r3<.45*ce(.65,.95,n)?Dt.midrise:e>1800&&i.r3<.6||e>700&&i.r3<.5*ce(.55,.85,n)?Dt.block:(e>900&&i.r3<.4||e>400&&i.r3<.4*ce(.5,.8,n))&&r<1935?Dt.store:Dt.bungalow;const l=i.zone;if(t>=mc&&i.lud===pc.conservation)return-1;if(l)return this.zoneKind(l,r,e,n,i);if(t>=mc&&i.lud===pc.agricultural)return i.r3<.4?Dt.shed:Dt.house;if(t>=mc&&i.lud===pc.rural)return Dt.house;const h=i.zoned?Dt.walkup:Dt.tower;return i.core?h:e>2e4?i.r3<.85?h:Dt.walkup:e>1e4?i.r3<.2+.5*ce(1e4,2e4,e)+.2*c?h:Dt.walkup:e>4e3?i.r3<.45+.2*c?i.r5<.25*ce(.7,.95,n)?h:Dt.walkup:Dt.house:e>2500&&i.r3<.2+.15*c?Dt.walkup:i.r4<.35&&r<1990?Dt.bungalow:Dt.house}zoneKind(t,e,n,i,o){const a=ce(.35,.8,i);switch(t){case Se.houses:return o.r4<.35&&e<1990?Dt.bungalow:Dt.house;case Se.lowrise:return o.r3<.55+.35*a?Dt.walkup:Dt.house;case Se.highrise:return o.r3<.3+.45*ce(4e3,2e4,n)+.2*a?Dt.tower:Dt.walkup;case Se.commercial:return n>4e3&&o.r3<.25+.45*a?Dt.midrise:n<2e3&&o.r4<.35-.25*a?Dt.store:Dt.block;case Se.downtown:return o.core||n>6e3&&o.r3<.25+.5*ce(6e3,15e3,n)+.2*a?Dt.tower:n>5e3&&o.r4<.3+.4*a?Dt.midrise:n<5e3&&o.r4<.55-.3*a?Dt.store:Dt.block;case Se.industrial:case Se.military:return Dt.shed;case Se.resort:return o.r3<.15+.45*ce(.5,.9,i)+.35*ce(4e3,15e3,n)?Dt.tower:Dt.walkup;case Se.agricultural:return Dt.shed;case Se.institutional:return n>3e3&&o.r3<.3*a?Dt.midrise:Dt.block;case Se.conservation:case Se.parks:return-1;default:return Dt.house}}variantOf(t,e,n){return e===Dt.tower&&t.zone===Se.resort&&t.r6<.75?0:Math.min(n-1,Math.floor(ye(t.tile,e,Math.floor(t.rank*1e6))*n))}towerHeight(t){return 35+115*ce(4,4.7,Math.log10(Math.max(1,t)))}byteAt(t,e){return t.b[e.a]+(t.b[e.a+1]-t.b[e.a])*e.t-e.early}fillByte(t,e,n){const i=t.zone&&e.w[4]>0&&e.y>=KM?lr[t.zone]:0;if(!i)return n;const o=255*Math.log(1+i/this.d0)/this.L+10*(t.r6-.5);return o>n?n+(o-n)*e.w[4]:n}scatterLot(t,e,n,i){var h,u;const o=this.Ys.length,a=this.samples,r=new Map;let c=null;const l=f=>{const d=this.instance(t,c,f);if(Array.isArray(d))for(const g of d)i(g);else i(d);c=null};t.core=!1,t.anchor&&(t.yard=new Uint8Array(o));for(let f=0;f<o;f++){const d=a[f];let g=null,v=this.byteAt(t,d);const m=t.core&&d.y>=1960&&(t.zoned?t.zone===Se.downtown||t.zone===Se.highrise:!0);m&&(v=Math.max(v,t_+14*t.r6));const p=this.fillByte(t,d,v),x=(u=(h=t.host)==null?void 0:h.yard)==null?void 0:u[f];if(p>0&&!x){const w=this.people(v),[b,y]=this.fill(d,this.people(p)),S=n(f),E=!!t.anchor&&t.rankY<4*y*t.w*S,T=this.valueAt(t,d,w);let M=-1;if((m||t.rank<b*t.w*S||E)&&(M=this.kindAt(d.y,w,T,t,E)),M===Dt.kauhale&&!E&&(M=Dt.hale),M>=0&&M!==Dt.kauhale&&!(m||t.rank<b*t.w*S)&&(M=-1),M>=0){const _=M===Dt.kauhale?hc.length:this.kits[Zn[M]].length,A=this.variantOf(t,M,_),R=this.epochAt[f],D=M*16+A;let C=r.get(D*256+255);if(C===void 0&&(C=r.get(D*256+R)),C===void 0){const z=this.pose(t,M,A),I=xi[Zn[M]].relief;let O=!1;if(z.parts){C=[];for(const N of z.parts){const j=e(N,I,R);if(O||(O=this.dep),j===null){C=null;break}C.push(j)}}else C=e(z,I,R),O=this.dep;r.set(D*256+(O?R:255),C)}C!==null&&(g={key:D,kind:M,variant:A,top:C,d:w},M===Dt.kauhale&&(t.yard[f]=1)),g&&M===Dt.midrise&&d.y<=e_&&(t.core=!0)}}if(c&&g&&g.key===c.key){c.d=Math.max(c.d,g.d);continue}c&&l(f),g&&(c={...g,n0:f})}c&&l(o)}fitOf(t,e){const n=t*16+e;this.fits??(this.fits=new Map);let i=this.fits.get(n);if(i!==void 0)return i;const o=Zn[t],a=xi[o];if(YM.has(o))i=1;else if(a.loose){let r=0,c=0;for(const[l,h,u,f]of hc[e]){const d=this.kits[o][f];for(const g of[-.2,.2]){const v=Math.cos(u+g),m=Math.sin(u+g),p=Math.cos(g),x=Math.sin(g),w=l*p+h*x,b=-l*x+h*p;r=Math.max(r,Math.abs(w)+Math.abs(d.hx*v)+Math.abs(d.hz*m)),c=Math.max(c,Math.abs(b)+Math.abs(d.hx*m)+Math.abs(d.hz*v))}}i=Math.min(1,(Di-Yn)/(r*a.sh),(fi-Yn)/(c*a.sh))}else{const r=this.kits[o][e],[c,l,h,u]=r.box,f=(a.jitter||0)/2,d=Math.cos(f),g=Math.sin(f),v=Math.max(-c,l)*d+Math.max(-h,u)*g,m=-h*d+Math.max(-c,l)*g,p=u*d+Math.max(-c,l)*g,x=a.jitter?.03:0;i=Math.min(1,(Di/2-Yn-x)/(v*a.sh),(fi/2-Yn-x)/(m*a.sh),(qM-x)/(p*a.sh))}return this.fits.set(n,i),i}pose(t,e,n){const i=Zn[e],o=xi[i],a=this.fitOf(e,n);let r=t.x,c=t.z,l=t.face;if(o.loose){const g=o.sh*a;r=t.x+Di/2*t.e[0]+fi/2*t.m[0],c=t.z+Di/2*t.e[1]+fi/2*t.m[1],l=Math.atan2(t.e[0],t.e[1])-Math.PI/2+(t.r7-.5)*.4+(t.r5<.5?0:Math.PI);const v=Math.cos(l),m=Math.sin(l),p=hc[n].map(([x,w,b,y])=>{const S=this.kits[i][y];return{x:r+(x*v+w*m)*g,z:c+(-x*m+w*v)*g,a:l+b,size:y,ax:S.hx*g,az:S.hz*g,f:a}});return{x:r,z:c,a:l,parts:p,f:a}}const h=this.kits[i][n];o.jitter&&(l+=(t.r5-.5)*o.jitter,r+=(t.r6-.5)*.06,c+=(t.r7-.5)*.06);const u=gl[i],f=u?Math.max(h.hx*o.sh*a,Di/2-Yn):h.hx*o.sh*a,d=u?Math.max(h.hz*o.sh*a,fi/2-Yn):h.hz*o.sh*a;return{x:r,z:c,a:l,ax:f,az:d,f:a}}instance(t,e,n){const i=this.Ys,o=i.length,a=Zn[e.kind],r=xi[a],c=t.landmark?{x:t.x,z:t.z,a:t.face,f:1}:this.pose(t,e.kind,e.variant),l=new Float32Array(4),h=g=>{const v=i[g-1],m=i[g],p=Math.min(QM,(m-v)/2),x=v+p+ye(t.tile??0,g,Math.floor((t.rank??0)*1e6))*(m-v-2*p);return[x-p,x+p]};e.n0===0?(l[0]=-Pa,l[1]=-Pa+1):this.isBreak[e.n0]||t.landmark?(l[0]=i[e.n0],l[1]=i[e.n0]+ku):[l[0],l[1]]=h(e.n0),n>=o?(l[2]=Pa,l[3]=Pa+1):this.isBreak[n]?(l[2]=i[n]-ku,l[3]=i[n]-.01):[l[2],l[3]]=h(n);const u=a==="tower"?this.towerHeight(e.d)/Ji:1,f=.94+.12*(t.r5??.5),d=(g,v,m)=>{const p=this.kits[a][v],x=g.f??c.f??1;return{kind:e.kind,variant:v,site:this.sites,x:g.x,z:g.z,a:g.a,y:Kn(m)+ml,sh:r.sh*x,sv:r.sv*x*u,stretch:u,span:l,colour:[f*(.98+.04*(t.r6??.5)),f,f*(.98+.04*(t.r7??.5))],rx:p.hx*r.sh*x*.95,rz:p.hz*r.sh*x*.95,landmark:!!t.landmark}};return this.sites++,c.parts?c.parts.map((g,v)=>d(g,g.size,e.top[v])):d(c,e.variant,e.top)}tileLots(t,e,n,i,o,a){const r=[Math.cos(n),Math.sin(n)],c=[-r[1],r[0]];let l=1/0,h=-1/0,u=1/0,f=-1/0;for(const[m,p]of[[t,e],[t+Gt,e],[t,e+Gt],[t+Gt,e+Gt]]){const x=m*c[0]+p*c[1],w=m*r[0]+p*r[1];l=Math.min(l,x),h=Math.max(h,x),u=Math.min(u,w),f=Math.max(f,w)}const d=.42,g=(m,p)=>m>=t&&m<t+Gt&&p>=e&&p<e+Gt&&!(o[0]&&m<t+d||o[1]&&m>=t+Gt-d||o[2]&&p<e+d||o[3]&&p>=e+Gt-d),v=[];for(let m=Math.floor(u/ki)-1;m<=Math.ceil(f/ki);m++)for(let p=Math.floor(l/pi)-1;p<=Math.ceil(h/pi);p++)for(let x=0;x<2;x++){const w=[[0,0],[1,0],[0,1],[1,1]].map(([S,E])=>{const T=2*x+S,M=p*pi+Ld/2+(T+.5)*Di,_=m*ki+pl/2+(E+.5)*fi,A=M*c[0]+_*r[0],R=M*c[1]+_*r[1];return{iu:T,iv:E,u:M,v:_,x:A,z:R,ok:g(A,R)&&a(A,R)}}),b=w.every(S=>S.ok);let y=null;for(const S of w){if(!S.ok)continue;const{iu:E,iv:T,u:M,v:_,x:A,z:R}=S,D=p*4+E,C=m*2+T,z=(i_[C&7][D&7]+ye(D,C,i*7+1))/64,I=j=>ye(D,C,i*7+j),O=T===0?[-r[0],-r[1]]:r,N={x:A,z:R,rank:z,face:Math.atan2(O[0],O[1]),tile:i,bu:p,bv:m,u:M,v:_,e:c,m:r,lag:25*I(2),r2:I(3),r3:I(4),r4:I(5),r5:I(6),r6:I(7),r7:I(8),r8:I(9)};if(S===w[0]&&b){const j=p*2+x;N.anchor=!0,N.rankY=(s_[m&3][j&3]+ye(j,m,i*7+11))/16,y=N}else y&&(N.host=y);v.push(N)}}return v}}function kd(s,t,e,n,i){var r,c;let o=t.metresAt(e,n);const a=(c=(r=s.patches)==null?void 0:r.byPack)==null?void 0:c.get(t.pack.id);if(!a)return o;for(const l of a){if(!(i<l.until))continue;const h=l.box,u=(e-h[0])/(h[2]-h[0]),f=(n-h[1])/(h[3]-h[1]);if(u<0||f<0||u>1||f>1)continue;const d=s.patches.maskAt(l.crop,u,f);d>0&&(o+=((l.kind==="raise"?Math.max(o,l.depthM):Math.min(o,l.depthM))-o)*d)}return o}function zd(s,t){const e=s.data.proj,n=s.data.places||[],i=[],o=[],a=Object.values(t.methods||{}).flatMap(r=>{var c;return((c=r==null?void 0:r.settlement)==null?void 0:c.towns)||[]});for(const r of a){if(!Number.isFinite(r.lon)||!Number.isFinite(r.lat))continue;const[c,l]=e.toWorld([r.lon,r.lat]);i.push({x:c,z:l,s:(r.sigma||1e3)/100})}for(const r of n){if(r.kind!=="town"&&r.kind!=="bay")continue;const c=dn(r.geometry);if(!c)continue;const[l,h]=e.toWorld(c);r.kind==="town"&&i.push({x:l,z:h,s:8}),o.push({x:l,z:h,town:r.kind==="town"})}return{cores:i,harbours:o}}function Id(s,t,e,n){let i=0;for(const a of s.cores){const r=(t-a.x)**2+(e-a.z)**2;r>16*a.s*a.s||(i=Math.max(i,Math.exp(-r/(2*a.s*a.s))))}let o=0;for(const a of s.harbours){const r=Math.hypot(t-a.x,e-a.z);r>60||(o=Math.max(o,Math.exp(-r/15)*(a.town?n:1)))}return{centre:i,harbour:o}}const r_=8e3,zu=8e3,Rn=3,Ud=s=>jt(s*2.6,40,110),c_=[1850,1875,1900,1930,1960,2e3],l_=.1,h_=1;class u_ extends Dd{constructor(t,e,n,i,o){super(t),this.districts=e,this.rec=n,this.own=i,this.ribbons=o,this.group=new Ne,this.group.name="settlements",this.group.visible=!1,this.ready=!1,this.failed=null,this.yearNow=t.timeline.year,i.uYearNow.value=this.yearNow,this.drawn=0,this.streamLines=n.data.streams,this.load().catch(a=>{this.failed=a.message,t.warn(`settlements: ${a.message} (the scatter is not drawn)`)})}async load(){var _,A;const t=performance.now(),e=this.app.data,n=await fetch(e.abs("layers/manifest.json"));if(!n.ok)throw new Error(`layers/manifest.json: HTTP ${n.status}`);const i=await n.json(),o=this.rec.d,a=(_=i.islands)==null?void 0:_[o.parent],r=this.app.world.islandPacks.find(R=>R.id===o.parent);if(!a||!r)throw new Error(`no settlement layer for ${o.parent}`);this.setLayers(i);const c=this.layerFiles(a);if(this.keyframes.length<2||c.some(R=>!R.settlement))throw new Error("the settlement layer lacks a keyframe");const l=R=>Fo(Qn,e.abs(`layers/${R}`)),[h,u,f,d]=await Promise.all([Promise.all(c.map(R=>l(R.settlement))),c.every(R=>R.value)?Promise.all(c.map(R=>l(R.value))).catch(()=>null):null,Pd(this.app,i,o.parent),((A=this.app.works)==null?void 0:A.exclusion(o.parent))??null]);if(this.disposed)return;this.works=d;for(const[R,D]of[...h,...u||[]].entries())if(D.W!==r.W||D.H!==r.H)throw new Error(`a layer of ${o.parent} is ${D.W}×${D.H} (${R}), the pack ${r.W}×${r.H}`);const g=r.rect,v=o.rect,m=(g.x1-g.x0)/r.W,p=(g.z1-g.z0)/r.H,x=jt(Math.floor((v.x0-g.x0)/m)-2,0,r.W-1),w=jt(Math.ceil((v.x1-g.x0)/m)+2,0,r.W-1),b=jt(Math.floor((v.z0-g.z0)/p)-2,0,r.H-1),y=jt(Math.ceil((v.z1-g.z0)/p)+2,0,r.H-1),S=w-x+1,E=y-b+1;this.crop={x0:g.x0+x*m,z0:g.z0+b*p,sx:m,sz:p,w:S,h:E},this.islandRect=g;const T=R=>{const D=new Float32Array(S*E);for(let C=0;C<E;C++)for(let z=0;z<S;z++)D[C*S+z]=R.px[(b+C)*r.W+x+z];return D};this.bytes=h.map(T),this.values=u?u.map(T):null,this.zoning={...f,rect:g},this.places=zd(this.app,i),this.townTerm(i,o.parent,"island"),this.loadMs=Math.round(performance.now()-t);const M=performance.now();await this.build()&&(this.buildMs=Math.round(performance.now()-M),this.ready=!0)}async breathe(t=!1){return(t||performance.now()-this.slice>24)&&(await new Promise(e=>setTimeout(e,0)),this.slice=performance.now()),!this.disposed}patchState(t){var r;const e=this.rec,n=e.raise.map(c=>({k:t<c.until?1:0,depth:c.depth})),i=((r=e.pmap)==null?void 0:r.groups)||[0],o=new Float32Array(16),a=new Float32Array(16).fill(-1);for(let c=0;c<i.length;c++){const l=i[c]||0;let h=-1;e.lower.forEach((u,f)=>{l&1<<f&&(h<0&&(h=f),t<u.until&&o[c]<1&&(o[c]=1,a[c]=u.depth))}),!o[c]&&h>=0&&(a[c]=e.lower[h].depth)}return{raise:n,gk:o,gd:a}}groundAt(t,e,n){const i=this.rec,o=i.d.W,a=e*o+t;let r=i.metres[a];const c=this.districts.patchAt(t,e);if(c&&c[1]+c[3]>0){const h=n.raise[c[2]&15],u=n.raise[c[2]>>4];h&&(r+=(Math.max(r,h.depth)-r)*(c[1]/255)*h.k),u&&(r+=(Math.max(r,u.depth)-r)*(c[3]/255)*u.k)}const l=i.aux[a*4];if(l){const h=c?c[0]:0;r=hl(r,l,n.gk[h],br(i.carve[a*2]),n.gd[h])}return r}texelOf(t,e){const n=this.rec.d,i=n.rect;return[jt(Math.floor((t-i.x0)/(i.x1-i.x0)*n.W),0,n.W-1),jt(Math.floor((e-i.z0)/(i.z1-i.z0)*n.H),0,n.H-1)]}edgeAt(t,e){const n=this.rec.d.rect;return Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e)}allows(t,e,n,i,o,a,r){const c=this.epochs[r],l=this.rec,h=l.aux,u=l.d.W,f=Math.cos(o),d=-Math.sin(o),g=[f,d],v=[-d,f];let m=1/0,p=-1/0,x=-1/0;if(this.dep=!1,this.works){const y=this.works.test(t,e,n,i,o,c.year);if(y&&(this.dep=!0),y===2)return null}const w=l.parent,b=Pe.margin;for(let y=0;y<13;y++){const S=y===0?0:y<5?[-1,1,1,-1][y-1]:y<9?[0,1,0,-1][y-5]:[-1,1,1,-1][y-9],E=y===0?0:y<5?[-1,-1,1,1][y-1]:y<9?[-1,0,1,0][y-5]:[-1,-1,1,1][y-9],T=y>=9?1.25:1,M=t+(g[0]*S*n+v[0]*E*i)*T,_=e+(g[1]*S*n+v[1]*E*i)*T,[A,R]=this.texelOf(M,_),D=R*u+A,C=h[D*4+3];if(C>0&&h[D*4+1]>0&&(this.dep=!0,c.features.has(C)))return null;if(y>=9)continue;if(this.streamNear(M,_))return null;(h[D*4]||this.districts.patchAt(A,R))&&(this.dep=!0);let z=this.groundAt(A,R,c.state);if(z<.6)return null;const I=l.metres[D];m=Math.min(m,I),p=Math.max(p,I);const O=this.edgeAt(M,_);if(w&&O<b){const N=ce(Pe.band,b,O);z=Math.max(z,kd(this.app,w,M,_,c.year)*(1-N)+z*N),this.dep=!0}x=Math.max(x,z)}if(p-m>a)return null;for(const y of this.landmarks)if(!(Math.hypot(t-y.x,e-y.z)>=y.r+Math.max(n,i)+Yn)&&(this.dep=!0,c.year>=y.from))return null;return x}grounds(){const e=this.rec.d,n=e.rect,i=4,o=Math.ceil(e.W/i),a=Math.ceil(e.H/i),r=this.patchState(1800),c=new Uint8Array(o*a);for(let y=0;y<a;y++)for(let S=0;S<o;S++)c[y*o+S]=this.groundAt(Math.min(e.W-1,S*i+2),Math.min(e.H-1,y*i+2),r)<=0?1:0;const l=e.mx*i,h=e.mz*i,u=un(o,a,y=>c[y]===1,l,h);this.sea={w:o,h:a,k:i,a:Float32Array.from(u)};const f=Nn(Float32Array.from(u,y=>Math.min(y,3e3)),o,a,12,3);this.broad={w:o,h:a,a:f};const d=2,g=Math.ceil(e.W/d),v=Math.ceil(e.H/d),m=new Uint8Array(g*v),p=this.streamLines,x=y=>jt(Math.floor((y-n.x0)/(n.x1-n.x0)*g),0,g-1),w=y=>jt(Math.floor((y-n.z0)/(n.z1-n.z0)*v),0,v-1);for(let y=0;p&&y<p.length;){const S=p[y++];for(let E=0;E<S;E++,y+=3){if(E+1>=S)continue;const[T,M,_,A]=[p[y],p[y+1],p[y+3],p[y+4]],R=Math.max(1,Math.ceil(Math.hypot(_-T,A-M)/.05));for(let D=0;D<=R;D++)m[w(M+(A-M)*D/R)*g+x(T+(_-T)*D/R)]=1}}const b=un(g,v,y=>m[y]===1,e.mx*d,e.mz*d);this.stream={w:g,h:v,a:Float32Array.from(b)},this.streamLines=null}coarse(t,e,n){const i=this.rec.d.rect,o=jt(Math.floor((e-i.x0)/(i.x1-i.x0)*t.w),0,t.w-1),a=jt(Math.floor((n-i.z0)/(i.z1-i.z0)*t.h),0,t.h-1);return t.a[a*t.w+o]}streamNear(t,e){return this.coarse(this.stream,t,e)<9}mauka(t,e){const n=this.broad,i=this.rec.d.rect,o=(t-i.x0)/(i.x1-i.x0)*n.w,a=(e-i.z0)/(i.z1-i.z0)*n.h,r=(g,v)=>n.a[jt(v,0,n.h-1)*n.w+jt(g,0,n.w-1)],c=Math.round(o),l=Math.round(a),h=10,u=r(c+h,l)-r(c-h,l),f=r(c,l+h)-r(c,l-h);if(Math.hypot(u,f)<.001)return Math.PI/2;const d=Math.PI/60;return Math.round(Math.atan2(f,u)/d)*d}weight(t,e){const[n,i]=this.texelOf(t,e),o=this.rec.d,a=this.rec.metres,r=(h,u)=>a[jt(u,0,o.H-1)*o.W+jt(h,0,o.W-1)],c=Math.hypot((r(n+2,i)-r(n-2,i))/(4*o.mx),(r(n,i+2)-r(n,i-2))/(4*o.mz));return(.55+.8*Math.max(Math.exp(-this.coarse(this.sea,t,e)/700),Math.exp(-this.coarse(this.stream,t,e)/160)))*(1-.6*ce(.08,.35,c))}epochYears(){var o;const t=this.rec,e=new Set;for(const a of[...t.raise,...t.lower])e.add(a.until);for(const[,a]of t.d.byIndex){const[r,c]=$o(a.properties);Number.isFinite(r)&&e.add(r),Number.isFinite(c)&&e.add(c+1)}for(const a of this.landmarks)e.add(a.from);for(const a of((o=this.works)==null?void 0:o.breaks)||[])e.add(a);this.years(e);const i=this.app.timeline.yearAt(0);this.epochs=[];for(let a=0;a<=this.edges.length;a++){const r=a===0?i:this.edges[a-1],c=new Set;for(const[l,h]of t.d.byIndex)jo(h.properties,r)&&c.add(l);this.epochs.push({year:r,state:this.patchState(r),features:c})}}async build(){const n=this.rec.d.rect,i=No(1820);this.times={},this.slice=performance.now();let o=performance.now(),a=0;const r=x=>{this.times[x]=Math.round(a+performance.now()-o),a=0,o=performance.now()},c=async()=>{const x=performance.now(),w=await this.breathe();return performance.now()-x>1&&(a+=x-o,o=performance.now()),w};if(this.kits=Rd(i,gl),r("kits"),this.grounds(),r("grounds"),!await c())return!1;const l=[],h=Math.ceil((n.x1-n.x0)/Gt),u=Math.ceil((n.z1-n.z0)/Gt),f=new Float32Array(h*u);for(let x=0;x<u;x++)for(let w=0;w<h;w++)f[x*h+w]=this.mauka(n.x0+(w+.5)*Gt,n.z0+(x+.5)*Gt);const d=(x,w)=>x<0||w<0||x>=h||w>=u?NaN:f[w*h+x],g=new Float32Array(this.keyframes.length),v=new Float32Array(this.keyframes.length),m=os+Pu,p=this.zoning;for(let x=0;x<u;x++){if(!await c())return!1;for(let w=0;w<h;w++){const b=n.x0+w*Gt,y=n.z0+x*Gt,S=f[x*h+w],E=[d(w-1,x)!==S,d(w+1,x)!==S,d(w,x-1)!==S,d(w,x+1)!==S],T=x*h+w,M=(_,A)=>this.edgeAt(_,A)>=m;for(const _ of this.tileLots(b,y,S,T,E,M)){this.bytesAt(_.x,_.z,g);let A=0;for(const I of g)A=Math.max(A,I);_.zone=Do(p.zoning,p.rect,_.x,_.z),_.lud=Do(p.lud,p.rect,_.x,_.z),_.zoned=!!p.zoning;const R=lr[_.zone];R&&(A=Math.max(A,255*Math.log(1+R/this.d0)/this.L+5));const D=this.fillMax(this.people(A));if(_.rank>=D*1.5&&!(_.anchor&&_.rankY<D*1.5)||(_.w=this.weight(_.x,_.z)*(.85+.3*hr(_.x/2.3,_.z/2.3,73)),_.rank>=D*_.w&&!(_.anchor&&_.rankY<D*_.w)))continue;_.b=Float32Array.from(g),this.values&&(_.vb=Float32Array.from(this.sample(this.values,_.x,_.z,v,0)));const C=Math.exp(-this.coarse(this.sea,_.x,_.z)/600),z=Id(this.places,_.x,_.z,C);_.coast=C,_.harbour=z.harbour,_.centre=z.centre,l.push(_)}}}return this.lotCount=l.length,this.gridTiles={nx:h,nz:u},this.ths=f,r("lots"),this.landmarks=[],this.epochYears(),this.placeLandmarks(l),this.landmarks.length&&this.epochYears(),r("landmarks"),!await this.scatter(l,c)||(r("scatter"),this.meshes(),r("meshes"),!await this.streets(c))?!1:(r("streets"),this.instances=null,this.clearing(),!0)}placeLandmarks(t){const e=new Map((this.app.data.places||[]).map(w=>[w.id,w])),n=this.app.data.proj,i=this.keyframes,o=w=>i.findIndex(b=>b.year>=w),a=(w,b,y,S,E,T)=>{const M=this.kits[w][0],_=xi[w],A=this.epochOfYear(E);if(this.edgeAt(b,y)<os+Pu)return!1;const R=this.allows(b,y,M.hx*_.sh,M.hz*_.sh,S,_.relief+2,A);return R===null?!1:(this.landmarks.push({kind:w,name:T,x:b,z:y,face:S,from:E,r:Math.hypot(M.hx,M.hz)*_.sh,ax:M.hx*_.sh,az:M.hz*_.sh,top:R}),!0)},r=(w,b)=>{let y=null,S=1/0;for(const E of t){const T=Math.hypot(E.x-w,E.z-b);T<S&&(S=T,y=E)}return y},c=(w,b)=>this.people(w.b[b]),l=Math.max(0,o(1853)),h=Math.max(0,o(1896)),u=e.get("kawaiahao"),f=u?n.toWorld(dn(u.geometry)):null,d=f&&this.edgeAt(f[0],f[1])>=0,g=d?"Kawaiahaʻo":null;let v=!!u&&!d;if(d){const w=r(f[0],f[1]);v=a("church",f[0],f[1],w?w.face:0,1842,g)}if(!v){const w=this.crop,b=this.bytes[l];let y=-1,S=0,E=0;for(let M=0;M<w.h;M++)for(let _=0;_<w.w;_++)b[M*w.w+_]<=y||(y=b[M*w.w+_],S=w.x0+(_+.5)*w.sx,E=w.z0+(M+.5)*w.sz);const T=[...t].sort((M,_)=>Math.hypot(M.x-S,M.z-E)-Math.hypot(_.x-S,_.z-E));for(const M of T.slice(0,200))if(v=a("church",M.x,M.z,M.face,1842,g))break}const m=[...t].sort((w,b)=>c(b,h)-c(w,h));let p=0;for(const w of m){if(p>=2)break;if(this.landmarks.some(y=>Math.hypot(y.x-w.x,y.z-w.z)<9))continue;let b=null;for(const y of this.samples){if(y.y<1840)continue;const S=w.b[y.a]+(w.b[y.a+1]-w.b[y.a])*y.t;if(this.people(S)>500){b=y.y;break}}b!==null&&a(b<1860?"church":"spire",w.x,w.z,w.face,b,null)&&p++}const x=e.get("aloha-tower");if(x){const[w,b]=n.toWorld(dn(x.geometry)),y=r(w,b);a("clock",w,b,y?y.face:0,1926,x.name)}}async scatter(t,e){const n=this.Ys.length,i=this.samples,o=new Float64Array(n);for(let h=0;h<t.length;h++){if(h%512===0&&!await e())return!1;const u=t[h];for(let f=0;f<n;f++){const d=i[f],g=this.fillByte(u,d,this.byteAt(u,d));if(g<=0)continue;const[v,m]=this.fill(d,this.people(g));(u.rank<v*u.w||u.anchor&&u.rankY<4*m*u.w)&&o[f]++}}this.cap=Array.from(o,h=>Math.min(1,r_/Math.max(1,h)));const a=[],r=(h,u,f)=>this.allows(h.x,h.z,h.ax,h.az,h.a,u,f),c=h=>this.cap[h],l=h=>a.push(h);for(let h=0;h<t.length;h++){if(h%256===0&&!await e())return!1;this.scatterLot(t[h],r,c,l)}for(const h of this.landmarks){const u=Math.max(0,this.Ys.findIndex(d=>d>=h.from));let f=n;if(this.works)for(let d=u+1;d<n&&f===n;d++)this.works.test(h.x,h.z,h.ax,h.az,h.face,this.Ys[d])===2&&(f=d);a.push(this.instance({x:h.x,z:h.z,face:h.face,landmark:!0,r5:.5,r6:.5,r7:.5},{kind:Dt[h.kind],variant:0,top:h.top,d:0,n0:u},f))}return this.instances=a,!0}weightAt(t,e){const n=this.spans;return ce(n[t*4],n[t*4+1],e)*(1-ce(n[t*4+2],n[t*4+3],e))}meshes(){const t=this.rec.d.rect;this.material=Qs(this.app.shared,this.own,{fade:[50,70],grow:!0}),this.variants=[];const e=new Map;for(const g of Zn)this.kits[g].forEach((v,m)=>{e.set(Dt[g]*16+m,this.variants.length),this.variants.push({name:g,v:m,kit:v,n:0})});const n=this.instances.length;this.N=n,this.vOf=new Uint16Array(n),this.mats=new Float32Array(n*16),this.spans=new Float32Array(n*4),this.stretches=new Float32Array(n),this.cols=new Float32Array(n*3),this.ix=new Float32Array(n),this.iz=new Float32Array(n),this.ia=new Float32Array(n),this.iy=new Float32Array(n),this.irx=new Float32Array(n),this.irz=new Float32Array(n),this.isv=new Float32Array(n),this.ish=new Float32Array(n),this.ikind=new Uint8Array(n),this.ivar=new Uint8Array(n),this.isite=new Int32Array(n),this.iland=new Uint8Array(n);const i=new ie,o=new _i,a=new W(0,1,0),r=new W,c=new W;this.instances.forEach((g,v)=>{const m=e.get(g.kind*16+g.variant);this.vOf[v]=m,this.variants[m].n++,o.setFromAxisAngle(a,g.a),r.set(g.x,g.y,g.z),c.set(g.sh,g.sv,g.sh),i.compose(r,o,c),i.toArray(this.mats,v*16),this.spans.set(g.span,v*4),this.stretches[v]=g.stretch,this.cols.set(g.colour,v*3),this.ix[v]=g.x,this.iz[v]=g.z,this.ia[v]=g.a,this.iy[v]=g.y,this.irx[v]=g.rx,this.irz[v]=g.rz,this.isv[v]=g.sv,this.ish[v]=g.sh,this.ikind[v]=g.kind,this.ivar[v]=g.variant,this.isite[v]=g.site,this.iland[v]=g.landmark?1:0});for(const g of this.variants){const v=Math.max(1,Math.min(g.n,zu)),m=g.kit.geometry,p=new _r(m,this.material,v);p.name=`${g.name}-${g.v}`,p.count=0,p.visible=!1,p.frustumCulled=!1,p.instanceMatrix.setUsage(bn),p.instanceColor=new ue(new Float32Array(v*3),3),p.instanceColor.setUsage(bn);const x=new ue(new Float32Array(v*4),4);x.setUsage(bn);const w=new ue(new Float32Array(v),1);w.setUsage(bn),m.setAttribute("aSpan",x),m.setAttribute("aStretch",w),Object.assign(g,{mesh:p,cap:v,aSpan:x,aStretch:w}),this.group.add(p)}const l=No(1842);this.tnx=Math.ceil((t.x1-t.x0)/Rn),this.tnz=Math.ceil((t.z1-t.z0)/Rn);const h=this.tnx*this.tnz,u=new Int32Array(n),f=new Int32Array(h);this.instances.forEach((g,v)=>{const m=jt(Math.floor((g.x-t.x0)/Rn),0,this.tnx-1),p=jt(Math.floor((g.z-t.z0)/Rn),0,this.tnz-1);u[v]=p*this.tnx+m,f[u[v]]++}),this.tStart=new Int32Array(h+1);for(let g=0;g<h;g++)this.tStart[g+1]=this.tStart[g]+f[g];const d=this.tStart.slice();this.tOrder=new Int32Array(n);for(let g=0;g<n;g++)this.tOrder[d[u[g]]++]=g;for(let g=0;g<h;g++)for(let v=this.tStart[g+1]-1;v>this.tStart[g];v--){const m=this.tStart[g]+Math.floor(l()*(v-this.tStart[g]+1)),p=this.tOrder[v];this.tOrder[v]=this.tOrder[m],this.tOrder[m]=p}this.always=[];for(let g=0;g<n;g++)this.iland[g]&&this.always.push(g);this.frustum=new Bi,this.pv=new ie,this.box=new Sn,this.key="",this.yearDrawn=NaN}aliveNear(t,e){const n=this.spans;return n[t*4]<e+1&&n[t*4+3]>e-1}refresh(t,e,n){const i=this.yearNow,o=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const a=this.rec.d.rect,r=e*.7,c=[],l=Math.max(0,Math.floor((o.x-e-a.x0)/Rn)),h=Math.min(this.tnx-1,Math.floor((o.x+e-a.x0)/Rn)),u=Math.max(0,Math.floor((o.z-e-a.z0)/Rn)),f=Math.min(this.tnz-1,Math.floor((o.z+e-a.z0)/Rn));for(let x=u;x<=f;x++)for(let w=l;w<=h;w++){const b=x*this.tnx+w;if(this.tStart[b+1]===this.tStart[b])continue;const y=a.x0+w*Rn,S=a.z0+x*Rn;this.box.min.set(y,-.5,S),this.box.max.set(y+Rn,n,S+Rn);const E=this.box.distanceToPoint(o);if(E>e||!this.frustum.intersectsBox(this.box))continue;const T=E<r?1:r/E;c.push(b,Math.round(T*20))}const d=c.join(",");if(d===this.key&&Math.abs(i-this.yearDrawn)<.5)return;this.key=d,this.yearDrawn=i;let g=0;const v=[];for(let x=0;x<c.length;x+=2){const w=this.tStart[c[x]],b=this.tStart[c[x]+1];let y=0;for(let S=w;S<b;S++)this.aliveNear(this.tOrder[S],i)&&y++;v.push(y),g+=Math.ceil(y*c[x+1]/20)}const m=Math.min(1,(zu-this.always.length)/Math.max(1,g));for(const x of this.variants)x.c=0;const p=x=>{const w=this.variants[this.vOf[x]];if(w.c>=w.cap)return;const b=w.c++;w.mesh.instanceMatrix.array.set(this.mats.subarray(x*16,x*16+16),b*16),w.mesh.instanceColor.array.set(this.cols.subarray(x*3,x*3+3),b*3),w.aSpan.array.set(this.spans.subarray(x*4,x*4+4),b*4),w.aStretch.array[b]=this.stretches[x]};for(let x=0;x<c.length;x+=2){const w=Math.ceil(v[x/2]*c[x+1]*m/20);let b=0;for(let y=this.tStart[c[x]];y<this.tStart[c[x]+1]&&b<w;y++){const S=this.tOrder[y];this.iland[S]||!this.aliveNear(S,i)||(p(S),b++)}}for(const x of this.always)this.aliveNear(x,i)&&p(x);this.drawn=0;for(const x of this.variants)x.mesh.count=x.c,x.mesh.visible=x.c>0,x.mesh.instanceMatrix.needsUpdate=!0,x.mesh.instanceColor.needsUpdate=!0,x.aSpan.needsUpdate=!0,x.aStretch.needsUpdate=!0,this.drawn+=x.c}async streets(t){const e=this.app.timeline,n=e.yearAt(e.max),i=this.rec.d.rect,{nx:o,nz:a}=this.gridTiles;this.streetBatches=[];for(const r of c_){if(!await t())return!1;const c=Math.min(r,n),l=this.epochOfYear(c),h=this.epochs[l],u=new Map;for(let y=0;y<this.N;y++){if(xi[Zn[this.ikind[y]]].loose||this.iland[y]||this.weightAt(y,c)<.5)continue;const E={x:this.ix[y],z:this.iz[y]},T=jt(Math.floor((E.x-i.x0)/Gt),0,o-1),M=jt(Math.floor((E.z-i.z0)/Gt),0,a-1),_=this.ths[M*o+T],A=[Math.cos(_),Math.sin(_)],R=[-A[1],A[0]],D=E.x*R[0]+E.z*R[1],C=E.x*A[0]+E.z*A[1],z=Math.floor(D/pi),I=Math.floor(C/ki),O=`${M*o+T}:${z}:${I}`,N=u.get(O)||{th:_,bu:z,bv:I,n:0};N.n++,u.set(O,N)}const f=new Map;for(const y of u.values()){if(y.n<2)continue;const S=[Math.cos(y.th),Math.sin(y.th)],E=[-S[1],S[0]],T=(D,C)=>[D*E[0]+C*S[0],D*E[1]+C*S[1]],M=y.bu*pi,_=M+pi,A=y.bv*ki,R=A+ki;for(const[D,C,z]of[[`${y.th}:v${y.bv}:${y.bu}`,T(M,A),T(_,A)],[`${y.th}:v${y.bv+1}:${y.bu}`,T(M,R),T(_,R)],[`${y.th}:u${y.bu}:${y.bv}`,T(M,A),T(M,R)],[`${y.th}:u${y.bu+1}:${y.bv}`,T(_,A),T(_,R)]])f.set(D,[C,z])}const d=(y,S,E)=>{const T=Math.max(1,Math.ceil(Math.hypot(S[0]-y[0],S[1]-y[1])/E)),M=[];for(let _=0;_<=T;_++){const A=y[0]+(S[0]-y[0])*_/T,R=y[1]+(S[1]-y[1])*_/T,[D,C]=this.texelOf(A,R),z=C*this.rec.d.W+D,I=this.rec.aux[z*4+3];if(this.groundAt(D,C,h.state)<.4||I>0&&this.rec.aux[z*4+1]>0&&h.features.has(I))return null;M.push([A,R])}return M},g=[];for(const[y,S]of f.values()){const E=d(y,S,.4);E&&g.push({pts:E,width:l_})}const v=[],m=r<1870?1/0:r<1950?5:4;for(const y of u.values()){if(y.n<m)continue;const S=[Math.cos(y.th),Math.sin(y.th)],E=[-S[1],S[0]],T=(y.bv+.5)*ki,M=A=>[A*E[0]+T*S[0],A*E[1]+T*S[1]],_=d(M(y.bu*pi+.32),M((y.bu+1)*pi-.32),.3);_&&v.push({pts:_,width:h_})}const p=new Bt(r<1910?"#9a8668":r<1950?"#8a8277":Td.asphalt).toArray(),x=new Bt(r<1910?"#a38f6f":r<1950?"#a09888":"#a9a59c").toArray(),w=this.ribbons.add(g,{mode:"earth",colour:p,alpha:0,minPx:.7,lift:.004,order:4}),b=this.ribbons.add(v,{mode:"earth",colour:x,alpha:0,minPx:0,lift:.003,order:3});this.streetBatches.push({year:r,batch:w,padBatch:b,n:g.length,pads:v.length})}return!0}streetWeights(t){const e=this.streetBatches;return e.map((n,i)=>{const o=i>0?e[i-1].year:n.year-15,a=i+1<e.length?e[i+1].year:1/0;return t<=n.year?i===0?ce(o,n.year,t):jt((t-o)/(n.year-o),0,1):a===1/0?1:jt((a-t)/(a-n.year),0,1)})}clearing(){this.clearN=512,this.clearData=new Uint8Array(512*512);const e=new Ze(this.clearData,512,512,Ni,ge);e.minFilter=e.magFilter=se,e.needsUpdate=!0,this.clearTex=e,this.own.uTownClear.value=e,this.yearCleared=NaN,this.townsCleared=-1}stamp(t,e,n,i,o,a){const r=this.clearN,c=this.clearData,l=this.rec.d.rect,h=r/(l.x1-l.x0),u=r/(l.z1-l.z0),f=Math.abs(Math.cos(n)),d=Math.abs(Math.sin(n)),g=i*f+o*d,v=i*d+o*f,m=jt(Math.floor((t-g-l.x0)*h),0,r-1),p=jt(Math.floor((t+g-l.x0)*h),0,r-1),x=jt(Math.floor((e-v-l.z0)*u),0,r-1),w=jt(Math.floor((e+v-l.z0)*u),0,r-1);for(let b=x;b<=w;b++)for(let y=m;y<=p;y++)c[b*r+y]<a&&(c[b*r+y]=a)}stampClearing(t){var e,n;this.clearData.fill(0);for(let i=0;i<this.N;i++){const o=this.weightAt(i,t);o<.02||this.stamp(this.ix[i],this.iz[i],this.ia[i],this.irx[i],this.irz[i],Math.round(255*o))}(e=this.app.towns)==null||e.stampInto(this.rec.d.rect,t,(i,o,a,r,c,l)=>this.stamp(i,o,a,r,c,l)),this.clearTex.needsUpdate=!0,this.yearCleared=t,this.townsCleared=((n=this.app.towns)==null?void 0:n.version)??0}update(t,e,n){var c,l;const i=this.app.timeline.year;if(t>0?(this.yearNow+=(i-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(i-this.yearNow)<.05&&(this.yearNow=i)):this.yearNow=i,this.own.uYearNow.value=this.yearNow,!this.ready)return;this.hidden&&(e=0),this.group.visible=e>.001;const o=this.streetWeights(this.yearNow);if(this.streetBatches.forEach((h,u)=>{h.batch&&(h.batch.uniforms.uAlpha.value=.5*o[u]*e),h.padBatch&&(h.padBatch.uniforms.uAlpha.value=(h.year<1910?.3:h.year<1950?.45:.6)*o[u]*e)}),!this.group.visible)return;const a=Ud(n);this.material.uniforms.uFadeNear.value=a*.75,this.material.uniforms.uFadeFar.value=a;const r=(((c=this.rec.data)==null?void 0:c.hi)??1e3)*this.app.world.uniforms.uVert.value+3;this.refresh(this.app.camera,a,r),(!(Math.abs(this.yearNow-this.yearCleared)<.5)||(((l=this.app.towns)==null?void 0:l.version)??0)!==this.townsCleared)&&this.stampClearing(this.yearNow)}alive(t=this.yearNow){if(!this.ready)return[];const e=[];for(let n=0;n<this.N;n++){if(this.weightAt(n,t)<.999)continue;const i=Zn[this.ikind[n]],o=this.kits[i][this.ivar[n]];e.push({i:n,site:this.isite[n],kind:i,variant:this.ivar[n],x:this.ix[n],z:this.iz[n],a:this.ia[n],ax:o.hx*this.ish[n],az:o.hz*this.ish[n],box:o.box.map(a=>a*this.ish[n]),y:this.iy[n],height:o.top*this.isv[n],landmark:!!this.iland[n]})}return e}census(t=this.yearNow,e=null,n=null,i=1/0){return Fd(this.alive(t),e,n,i)}stats(){if(!this.ready)return{ready:!1,failed:this.failed};const t=this.Ys.findIndex(i=>i>=this.yearNow);let e=this.clearData.byteLength+this.bytes.reduce((i,o)=>i+o.byteLength,0)+this.sea.a.byteLength+this.stream.a.byteLength+this.broad.a.byteLength;for(const i of[this.mats,this.spans,this.cols,this.stretches,this.vOf,this.ix,this.iz,this.ia,this.iy,this.irx,this.irz,this.isv,this.ish,this.ikind,this.ivar,this.isite,this.iland,this.tOrder,this.tStart])e+=i.byteLength;const n=this.census(this.yearNow);return{ready:!0,year:+this.yearNow.toFixed(1),lots:this.lotCount,instances:this.N,placed:n.total,drawn:this.drawn,by:n.by,hale:n.hale,landmarks:this.landmarks.map(i=>`${i.name||i.kind} ${i.from}`),towns:this.townTerms,zoning:{zoning:this.zoning.zoning?`${this.zoning.zoning.W}×${this.zoning.zoning.H}`:null,lud:this.zoning.lud?`${this.zoning.lud.W}×${this.zoning.lud.H}`:null},value:this.values?"mask":"modelled",cap:+(this.cap[Math.max(0,t)]??1).toFixed(2),streets:this.streetBatches.map(i=>{var o;return`${i.year}:${i.n}/${i.pads}:${(((o=i.batch)==null?void 0:o.uniforms.uAlpha.value)??0).toFixed(2)}`}),triangles:this.variants.reduce((i,o)=>i+o.mesh.count*o.kit.tris,0),loadMs:this.loadMs,buildMs:this.buildMs,times:this.times,cpuMB:+(e/1048576).toFixed(1)}}dispose(){var t,e;this.disposed=!0;for(const n of this.variants||[])n.mesh.dispose(),n.kit.geometry.dispose();(t=this.material)==null||t.dispose(),(e=this.clearTex)==null||e.dispose(),this.own.uTownClear.value=null}}function Fd(s,t=null,e=null,n=1/0){const i={},o=new Set;let a=0;for(const r of s)t!==null&&Math.hypot(r.x-t,r.z-e)>n||(r.kind==="kauhale"&&a++,r.kind==="hale"&&(a+=2),!o.has(r.site)&&(o.add(r.site),i[r.kind]=(i[r.kind]||0)+1));return{by:i,total:Object.values(i).reduce((r,c)=>r+c,0),hale:a}}const Li=Fe*1.4;function f_(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Iu(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function d_(s,t,e,n,i){const o=Math.cos(e),a=Math.sin(e);return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([r,c])=>[s+(r*n*o-c*i*a)/2,t+(r*n*a+c*i*o)/2])}function p_(s,t){for(const e of[s,t])for(let n=0;n<4;n++){const i=e[n],o=e[(n+1)%4],a=[o[1]-i[1],i[0]-o[0]];let r=1/0,c=-1/0,l=1/0,h=-1/0;for(const u of s){const f=u[0]*a[0]+u[1]*a[1];r=Math.min(r,f),c=Math.max(c,f)}for(const u of t){const f=u[0]*a[0]+u[1]*a[1];l=Math.min(l,f),h=Math.max(h,f)}if(c<l||h<r)return!1}return!0}function Uu(s,t){const e=[s[0]];for(let n=0;n+1<s.length;n++){const[i,o]=s[n],[a,r]=s[n+1],c=Math.max(1,Math.ceil(Math.hypot(a-i,r-o)/t));for(let l=1;l<=c;l++)e.push([i+(a-i)*l/c,o+(r-o)*l/c])}return e}class m_{constructor(t,e,n){var u,f;this.app=t,this.districts=e,this.rec=n,this.group=new Ne,this.group.name="district features";const i=t.shared,o=t.data.proj,a=n.d.features.features||[];this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new te(0,0,0,0))},uDistS:{value:n.terrain.shadow.texture},uYearNow:{value:t.timeline.year},uTownClear:{value:null}};const r=f_(1795),c=new _e;this.counts={hale:0,waa:0,pondWalls:0};for(const{index:d,f:g}of n.d.rastered){const v=(u=g.properties)==null?void 0:u.kind,m=g.geometry.coordinates[0].map(p=>o.toWorld(p));v==="village"?this.buildVillage(c,m,d,r):v==="fishpond"&&this.buildPond(c,m,d,r)}this.structMat=Qs(i,this.own,{fade:[70,110]}),this.structures=new me(c.geometry(),this.structMat),this.structures.frustumCulled=!1,this.group.add(this.structures),this.forest=new Nw(n.data.trees,n.d.rect,i,this.own),this.group.add(this.forest.group),this.ribbons=new pd(i,t.camera);const l=n.data.streams,h=[];for(let d=0;d<l.length;){const g=l[d++],v=[],m=[];for(let p=0;p<g;p++,d+=3)v.push([l[d],l[d+1]]),m.push(Math.min(7.5,1+1.3*Math.pow(l[d+2],.45))*Fe);h.push({pts:v,width:m})}this.streams=this.ribbons.add(h,{mode:"water",alpha:0,minPx:.9,lift:.004,order:5}),this.streamCount=h.length,this.trails=[];for(const d of a){const g=d.properties||{};if(g.kind!=="trail"||((f=d.geometry)==null?void 0:f.type)!=="LineString")continue;const v=Uu(d.geometry.coordinates.map(p=>o.toWorld(p)),.12),m=this.ribbons.add([{pts:v,width:3.2*Fe}],{mode:"earth",colour:new Bt("#9c7f5c").toArray(),alpha:0,minPx:1.3,lift:.006,order:5});m&&this.trails.push({p:g,batch:m,w:0})}this.forces=new gM(t,a,i,this.ribbons,(d,g)=>this.groundAt(d,g,!1)),this.group.add(this.ribbons.group,this.forces.group),this.settlements=new u_(t,e,n,this.own,this.ribbons),this.group.add(this.settlements.group),this.labels=new Ad(t,a),this.show=0}groundAt(t,e,n=!0){const i=this.districts.rawAt(t,e);if(!n)return i;const{d:o}=this.rec,a=o.rect,r=Math.max(0,Math.min(o.W-1,Math.floor((t-a.x0)/(a.x1-a.x0)*o.W))),l=Math.max(0,Math.min(o.H-1,Math.floor((e-a.z0)/(a.z1-a.z0)*o.H)))*o.W+r;return hl(i,this.rec.aux[l*4],1,br(this.rec.carve[l*2]))}buildVillage(t,e,n,i){t.feature(n);let o=1/0,a=-1/0,r=1/0,c=-1/0;for(const[f,d]of e)o=Math.min(o,f),a=Math.max(a,f),r=Math.min(r,d),c=Math.max(c,d);const l=.85,h=[],u=[];for(let f=r+l/2;f<c;f+=l)for(let d=o+l/2;d<a;d+=l){const g=d+(i()-.5)*l*.7,v=f+(i()-.5)*l*.7;!Iu(e,g,v)||i()<.25||h.push([g,v])}for(const[f,d]of h){const g=i()*Math.PI*2,v=2+Math.floor(i()*3),m=[];for(let p=0;p<v;p++){const x=g+p/v*Math.PI*2+(i()-.5)*.6,w=p===0?0:.3+i()*.12,b=f+Math.cos(x)*w,y=d+Math.sin(x)*w;if(!Iu(e,b,y)||m.some(([D,C])=>Math.hypot(D-b,C-y)<.3))continue;m.push([b,y]);const S=6+i()*3,E=4+i()*1.4;let T=1/0,M=-1/0;for(const[D,C]of[[0,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const z=this.groundAt(b+D*S*.5*Li,y+C*E*.5*Li,!1);T=Math.min(T,z),M=Math.max(M,z)}if(T<.6||M-T>2.5)continue;const _=g+p%2*Math.PI*.5,A=d_(b,y,_,(S+2.4)*Li,(E+2.4)*Li);if(u.some(D=>p_(D,A)))continue;u.push(A);const R=Kn(M);t.at(b,R,y,_,Li),or(t,i,S,E,4.6+i()*1.2,!0,.9+Kn(M-T)/Li),t.done(),this.counts.hale++}if(i()<.4){const p=f+.08,x=d-.06;t.at(p,Kn(this.groundAt(p,x,!1)),x,0,Li),Dw(t,i),t.done()}}this.buildCanoes(t,e,n,i),t.feature(0)}buildCanoes(t,e,n,i){let o=0,a=0;for(const[f,d]of e)o+=f/e.length,a+=d/e.length;const r=[],c=9,l=.06,h=Array.from({length:16},(f,d)=>[Math.cos(d/16*Math.PI*2),Math.sin(d/16*Math.PI*2)]);for(let f=a-c;f<a+c;f+=l)for(let d=o-c;d<o+c;d+=l){const g=this.groundAt(d,f);if(g<.3||g>2.2)continue;let v=null;for(const[m,p]of h)this.groundAt(d+m*.3,f+p*.3)<=0&&(v=v?[v[0]+m,v[1]+p]:[m,p]);v&&r.push([d,f,g,Math.atan2(v[1],v[0]),Math.hypot(d-o,f-a)])}r.sort((f,d)=>f[4]-d[4]);const u=[];for(const f of r){if(u.length>=14)break;u.some(d=>Math.hypot(d[0]-f[0],d[1]-f[1])<.22)||u.push(f)}for(const[f,d,g,v]of u)t.at(f,Kn(g)+.002,d,v,Li),Pw(t,i,7+i()*4),t.done(),this.counts.waa++}buildPond(t,e,n,i){t.feature(n);const o=pt(Lo.pondStone,.12,i),a=Uu(e,.05).map(([r,c])=>[r,Kn(Math.max(this.groundAt(r,c),-.8))-.004,c]);t.wall(a,3*Fe,1.6*Fe,o,it.stone,.72),this.counts.pondWalls++,t.feature(0)}update(t,e,n){const i=e;this.show=i,this.own.uShow.value=i;const o=this.districts.featSeen,a=this.own.uFeatSeen.value;for(let l=0;l<64;l++)a[l>>2].setComponent(l&3,o[l]);this.group.visible=i>.001;const r=this.app.timeline.year,c=t>0?1-Math.exp(-t*1.6):1;this.streams&&(this.streams.uniforms.uAlpha.value=.8*i);for(const l of this.trails){const h=jo(l.p,r)?1:0;l.w+=(h-l.w)*c,Math.abs(h-l.w)<.003&&(l.w=h),l.batch.uniforms.uAlpha.value=.75*l.w*i}this.forest.update(this.app.camera,i,this.rec.data.hi*this.app.world.uniforms.uVert.value+1,n),this.forces.update(t,i,n),this.settlements.update(t,i,n),this.ribbons.update(this.app.renderer),this.labels.update(i)}settle(t,e){this.update(0,t,e)}stats(){return{...this.counts,trees:this.forest.total,treesDrawn:this.forest.drawn,treeRadius:is,streams:this.streamCount,trails:this.trails.filter(t=>t.w>.5).length,forces:this.forces.stats(),labels:this.labels.visible(),settlements:this.settlements.stats()}}dispose(){this.structures.geometry.dispose(),this.structMat.dispose(),this.forest.dispose(),this.ribbons.dispose(),this.forces.dispose(),this.settlements.dispose(),this.labels.dispose()}}const gc=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Gc=new Float32Array(65536);for(let s=0;s<65536;s++)Gc[s]=br(s);class g_{constructor(t){this.app=t,this.world=t.world,this.list=[],this.loaded=!1,this.cur=null,this.incoming=null,this.k=0,this.want=0,this.patchW=new Float32Array(64).fill(1),this.groupK=new Float32Array(Jn),this.groupDepth=new Float32Array(Jn),this.featK=new Float32Array(64),this.featSeen=new Float32Array(64),this.u=this.world.uniforms,this._frustum=new Bi,this._m=new ie,this._box=new Sn,this.lastSeen=0,this.log=[]}patchWeights(){const t=this.cur;return t!=null&&t.lower?[...t.raise,...t.lower].map((e,n)=>({id:e.id,kind:e.kind,depth:e.depth,until:e.until,k:+this.patchW[n].toFixed(3)})):[]}async load(){var n;const t=await Ew(this.app.data,this.app.warn),e=await((n=this.app.patches)==null?void 0:n.ready)||[];this.list=t,this.setPatches(e),this.loaded=!0}setPatches(t){const e=this.app.warn;for(const i of this.list)i.patches=Tw(i,t,e);const n=new Set(this.world.islandPacks.map(i=>i.id));for(const i of t)!n.has(i.pack)&&!this.list.some(o=>o.id===i.pack)&&e(`patch ${i.id}: no pack or district ${i.pack} here; not drawn`);this.patchW.fill(1),this.incoming=null,this.cur&&this.drop()}districtAt(t,e,n=0,i=null){var h,u,f;const o=[],a=[];for(const d of this.list){const g=d.rect;if(!(t>g.x0-n&&t<g.x1+n&&e>g.z0-n&&e<g.z1+n))continue;const v=Math.hypot(Math.max(g.x0-t,0,t-g.x1),Math.max(g.z0-e,0,e-g.z1));v===0?o.push(d):a.push([v,d])}if(o.length===1)return o[0];if(!o.length){if(a.length<2)return((h=a[0])==null?void 0:h[1])??null;const d=i||this.mokuAt(t,e),g=d?a.filter(([,v])=>this.homeOf(v)===d):[];return g.length===1?g[0][1]:a.reduce((v,m)=>m[0]<v[0]?m:v)[1]}const r=i||this.mokuAt(t,e),c=r?o.filter(d=>this.homeOf(d)===r):[];if(c.length===1)return c[0];const l=((u=this.incoming)==null?void 0:u.d)??((f=this.cur)==null?void 0:f.d)??null;return o.includes(l)?l:o[0]}homeOf(t){var e,n;if(t.home===void 0){const i=this.app.polity,o=t.rect,a=new Map;for(let r=0;i&&r<12;r++)for(let c=0;c<12;c++){const l=i.mokuAt(o.x0+(c+.5)*(o.x1-o.x0)/12,o.z0+(r+.5)*(o.z1-o.z0)/12);l&&a.set(l.name,(a.get(l.name)||0)+1)}t.home=((e=t.desc)==null?void 0:e.moku)||((n=[...a].sort((r,c)=>c[1]-r[1])[0])==null?void 0:n[0])||null}return t.home}mokuAt(t,e){const n=this.app.polity,i=n==null?void 0:n.mokuAt(t,e);if(!i)return null;for(const[o,a]of[[5,0],[-5,0],[0,5],[0,-5]]){const r=n.mokuAt(t+o,e+a);if(r&&r.name!==i.name)return null}return i.name}reach(t,e){const n=t.rect,i=e.position;return Math.hypot(Math.max(n.x0-i.x,0,i.x-n.x1),Math.max(n.z0-i.z,0,i.z-n.z1),Math.max(1,i.y))}prefetch(t,e,n=null){const i=this.districtAt(t,e,20,n);return i&&(this.prefetchAt=performance.now(),this.prefetched=i,this.prefetchXZ=[t,e],this.stream(i)),i}readyAt(t,e){var i;const n=this.districtAt(t,e);return!!n&&((i=this.cur)==null?void 0:i.d)===n&&this.cur.state==="ready"}get showing(){return!!this.on||this.k>0}stream(t){var n,i;if(((n=this.cur)==null?void 0:n.d)===t){this.incoming=null;return}if(((i=this.incoming)==null?void 0:i.d)===t)return;if(!this.world.terrains.get(t.parent)){this.pending=t;return}this.pending===t&&(this.pending=null);const e={d:t,state:"loading",t0:performance.now()};this.cur&&this.showing?this.incoming=e:(this.incoming=null,this.cur&&this.drop(),this.cur=e),this.lastSeen=e.t0,this.decoder=this.decoder||new Cw(this.app.warn),this.decoder.decode(t).then(o=>{this.cur===e?this.arrive(e,o):this.incoming===e&&(e.out=o,e.state="decoded")}).catch(o=>{this.cur!==e&&this.incoming!==e||(this.app.warn(`district ${t.id}: ${o.message}`),e.state="failed")})}swap(){const t=this.incoming;if(t&&(this.incoming=null,this.cur&&this.drop(),this.cur=t,this.lastSeen=performance.now(),t.out)){const e=t.out;t.out=null,this.arrive(t,e)}}aimed(t){const e=this.app.rig,n=e==null?void 0:e.flight,i=this.prefetched&&performance.now()-(this.prefetchAt??-1e9)<Pe.hold*1e3?this.prefetched:null;let o=null,a=!1;if(n){if(n.dest.distance<Pe.rig[1]){const r=n.dest.target,c=this.prefetchXZ;o=i&&c&&Math.hypot(r.x-c[0],r.z-c[1])<.5?i:this.districtAt(r.x,r.z,20),a=!!o}}else{const r=e?e.goal.target:t.position,c=this.prefetchXZ,l=i&&c&&Math.hypot(r.x-c[0],r.z-c[1])<.5?i:this.districtAt(r.x,r.z,Pe.prefetch),h=l?this.reach(l,t):1/0;h<Pe.prefetch&&(o=l),a=h<Pe.far}return i&&i!==o&&!(o&&a)&&(o=i),o}arrive(t,e){var l;const{d:n}=t;t.decodeMs=Math.round(performance.now()-t.t0),t.data=e,t.metres=e.metres,t.aux=e.aux,t.carve=e.carve;const i={id:n.id,name:n.name,rect:n.rect,W:n.W,H:n.H,rainUrl:n.rainUrl,data:{metres:e.metres,normals:e.normals,land:e.land,lo:e.lo,hi:e.hi}};t.pack=i;const o=this.world.terrains.get(n.parent);t.parUniforms={uParN:{value:(o==null?void 0:o.normalTex)??null},uParL:{value:(o==null?void 0:o.landTex)??null},uParS:{value:(o==null?void 0:o.shadow.texture)??null},uParRect:{value:o?o.rect:new te(0,0,1,1)},uParSlot:{value:-1},uParRain:{value:(o==null?void 0:o.uniforms.uOwnRain.value)??1}};const a=new Nc(i,this.world,[this.world.arch,o].filter(Boolean),{vertexShader:sw,fragmentShader:ow,shadowFragment:aw,shadowSize:512,uniforms:{...t.parUniforms,uDistN:{value:null},uDistL:{value:null},uDistS:{value:null}}});for(const h of[a.full,a.half]){const u=h.material.uniforms;u.uDistN.value=a.normalTex,u.uDistL.value=a.landTex,u.uDistS.value=a.shadow.texture}if(a.group.visible=!1,a.group.name=`district ${n.id}`,a.applyRange(((l=this.app.qset)==null?void 0:l.range)??4.6),this.app.params.get("debug"))for(const h of[a.full,a.half])h.material.uniforms.uDebug.value=Number(this.app.params.get("debug"));t.terrain=a,t.parent=o,this.world.group.add(a.group),t.heightTex=a.heightTex;const r=new Ze(e.aux,n.W,n.H,De,ge);r.minFilter=r.magFilter=se,r.needsUpdate=!0;const c=new Ze(e.carve,n.W,n.H,kf,Ui);if(c.minFilter=c.magFilter=se,c.needsUpdate=!0,t.auxTex=r,t.carveTex=c,t.pmap=e.patchMap,t.pmap){const h=t.pmap,u=new Ze(h.data,h.w,h.h,De,ge);u.minFilter=u.magFilter=se,u.needsUpdate=!0,t.patchTex=u,t.patchBox=new te(h.x0,h.y0,h.x0+h.w,h.y0+h.h)}t.lower=n.patches.filter(h=>h.kind==="lower"),t.raise=n.patches.filter(h=>h.kind==="raise"),t.uploads=[a.heightTex,r,c,a.normalTex,a.landTex,...t.patchTex?[t.patchTex]:[]],t.state="uploading",t.features=new m_(this.app,this,t),this.app.scene.add(t.features.group),e.normals=e.land=null,e.trees={counts:e.trees.counts},e.streams=null,this.patchW.fill(1),this.featK.fill(0),this.featSeen.fill(0);for(const h of this.u.uFeatK.value)h.set(0,0,0,0);this.yearWeights(1)}drop(){var e,n,i;const t=this.cur;t&&(this.off(),t.terrain&&(this.world.group.remove(t.terrain.group),t.terrain.dispose()),(e=t.auxTex)==null||e.dispose(),(n=t.carveTex)==null||n.dispose(),(i=t.patchTex)==null||i.dispose(),t.features&&(this.app.scene.remove(t.features.group),t.features.dispose()),this.cur=null,this.k=0)}off(){var e;const t=this.u;t.uDistInfo.value.set(0,0,Pe.margin,Pe.band),t.uDistH.value=this.world.dummy,t.uDistAux.value=this.world.dummyAux,t.uDistCarve.value=this.world.dummy,t.uDistPatch.value=this.world.dummyAux,t.uDistPatchBox.value.set(0,0,0,0),(e=this.cur)!=null&&e.terrain&&(this.cur.terrain.group.visible=!1),this.on=!1}yearWeights(t){var a,r;const e=this.cur,n=this.app.timeline.year,i=this.patchW;if(e!=null&&e.lower){[...e.raise,...e.lower].forEach((g,v)=>{const m=n<g.until?1:0;let p=i[v]+(m-i[v])*t;Math.abs(p-m)<.002&&(p=m),i[v]=p});const l=e.raise.length,h=this.u.uDistRaise.value;let u=-1e9;for(let g=0;g<Jn;g++)h[g].set(g<l?i[g]:0,g<l?e.raise[g].depth:0,0,0),g<l&&i[g]>0&&(u=Math.max(u,e.raise[g].depth));this.u.uDistRaiseTop.value=u;const f=this.u.uDistLower.value,d=((a=e.pmap)==null?void 0:a.groups)||[0];for(let g=0;g<Jn;g++){let v=0,m=-1;const p=d[g]||0;e.lower.forEach((x,w)=>{p&1<<w&&i[l+w]>v&&(v=i[l+w],m=x.depth)}),v===0&&p&&(m=((r=e.lower.find((x,w)=>p&1<<w))==null?void 0:r.depth)??-1),this.groupK[g]=v,this.groupDepth[g]=m,f[g].set(v,m,0,0)}}const o=this.u.uFeatK.value;if(e)for(const[c,l]of e.d.byIndex){const h=jo(l.properties,n)?1:0;let u=this.featK[c]+(h-this.featK[c])*t;Math.abs(u-h)<.002&&(u=h),this.featK[c]=u;const f=n>=$o(l.properties)[0]?1:0;let d=this.featSeen[c]+(f-this.featSeen[c])*t;Math.abs(d-f)<.002&&(d=f),this.featSeen[c]=d,o[c>>2].setComponent(c&3,u)}}wantFor(t,e,n){var l,h;const i=t.rect,o=e.position,a=Math.max(i.x0-o.x,0,o.x-i.x1),r=Math.max(i.z0-o.z,0,o.z-i.z1),c=Math.hypot(a,r,Math.max(1,o.y));return this.dc=c,this._m.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this._box.min.set(i.x0,0,i.z0),this._box.max.set(i.x1,Math.max(1,(((h=(l=this.cur)==null?void 0:l.data)==null?void 0:h.hi)??1e3)*this.u.uVert.value),i.z1),this._frustum.intersectsBox(this._box)?gc(Pe.far,Pe.near,c)*(1-gc(Pe.rig[0],Pe.rig[1],n)):0}update(t,e,n){var f,d;if(!this.loaded||!this.list.length)return;if(this.pending&&this.world.terrains.get(this.pending.parent)){const g=this.pending;this.pending=null,this.stream(g)}const i=this.aimed(t);i&&this.stream(i),this.incoming&&!this.showing&&this.swap();const o=this.cur,a=1-Math.exp(-n*2.5);if(this.yearWeights(n>0?1-Math.exp(-n*wf):1),!o)return;if(o.state==="uploading"){const g=o.uploads.shift();g&&this.app.renderer.initTexture(g),o.uploads.length||(o.state="ready",o.readyMs=Math.round(performance.now()-o.t0))}const r=o.parent,c=r&&r.slot>=0?r.k:0,l=o.state==="ready"&&!this.incoming?Math.min(this.wantFor(o.d,t,e),c):0;this.want=l,this.forceK!==null&&this.forceK!==void 0&&o.state==="ready"&&c>0&&!this.incoming?this.k=Math.min(this.forceK,c):(this.k+=(l-this.k)*a,Math.abs(l-this.k)<.004&&(this.k=l),this.k=Math.min(this.k,c));const h=o.state==="ready"&&c>0&&(this.k>0||l>0);h?this.switchOn(o):this.on&&this.off(),(h||this.k>0)&&(this.lastSeen=performance.now());const u=Math.max(this.lastSeen,this.prefetched===o.d?(this.prefetchAt??-1e9)+Pe.hold*1e3:-1e9);!h&&!this.incoming&&this.reach(o.d,t)>Pe.prefetch*1.2&&performance.now()-u>Pe.linger*1e3&&o.state!=="loading"&&this.drop(),this.cur&&((f=o.terrain)==null||f.update(t,this.on),(d=o.features)==null||d.update(n,this.on?this.k:0,e))}switchOn(t){const e=this.u,n=t.parent;e.uDistRect.value.copy(t.terrain.rect),e.uDistInfo.value.set(this.k,1,Pe.margin,Pe.band),e.uDistH.value=t.heightTex,e.uDistAux.value=t.auxTex,e.uDistCarve.value=t.carveTex,e.uDistPatch.value=t.patchTex||this.world.dummyAux,t.patchBox?e.uDistPatchBox.value.copy(t.patchBox):e.uDistPatchBox.value.set(0,0,0,0);const i=t.parUniforms;i.uParSlot.value=n.slot,i.uParN.value=n.normalTex,i.uParL.value=n.landTex,i.uParS.value=n.shadow.texture,this.on=!0}updateShadow(t,e,n,i){var o;this.on&&((o=this.cur)!=null&&o.terrain)&&this.cur.terrain.shadow.update(t,e,n,this.k,i)}settle(t,e){var a;this.incoming&&(this.k=0,this.off(),this.swap()),this.yearWeights(1);const n=this.cur;if(!n||n.state!=="ready")return;const i=n.parent,o=i&&i.slot>=0?i.k:0;this.k=Math.min(this.wantFor(n.d,t,e),o),this.k>0?(this.switchOn(n),n.terrain.update(t,!0)):this.on&&this.off(),(a=n.features)==null||a.settle(this.k,e)}weightAt(t,e){if(!this.on)return 0;const n=this.cur.d.rect,i=Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e);return this.k*gc(Pe.band,Pe.margin,i)}patchAt(t,e){const n=this.cur.pmap;if(!n||t<n.x0||e<n.y0||t>=n.x0+n.w||e>=n.y0+n.h)return null;const i=((e-n.y0)*n.w+(t-n.x0))*4;return n.data.subarray(i,i+4)}texel(t,e){const n=this.cur,i=n.d.W,o=e*i+t;let a=n.metres[o];const r=n.aux,c=this.patchAt(t,e);if(c&&c[1]+c[3]>0){const u=this.u.uDistRaise.value,f=u[c[2]&15],d=u[c[2]>>4];a+=(Math.max(a,f.y)-a)*(c[1]/255)*f.x,a+=(Math.max(a,d.y)-a)*(c[3]/255)*d.x}const l=r[o*4];if(l){const u=c?c[0]:0;a=hl(a,l,this.groupK[u],Gc[n.carve[o*2]],this.groupDepth[u])}const h=r[o*4+3];if(h>0){const u=this.featK[h];h<On.pond?a+=(fd(a,Gc[n.carve[o*2]],r[o*4+2])-a)*(r[o*4+1]/255)*u:h<On.other&&(a+=(id-a)*(r[o*4+1]/255)*u)}return a}metresAt(t,e){const{d:n}=this.cur,i=n.rect;let o=(t-i.x0)/(i.x1-i.x0)*n.W-.5,a=(e-i.z0)/(i.z1-i.z0)*n.H-.5;o=Math.max(0,Math.min(n.W-1.001,o)),a=Math.max(0,Math.min(n.H-1.001,a));const r=o|0,c=a|0,l=o-r,h=a-c,u=this.texel(r,c)+(this.texel(r+1,c)-this.texel(r,c))*l,f=this.texel(r,c+1)+(this.texel(r+1,c+1)-this.texel(r,c+1))*l;return u+(f-u)*h}blend(t,e,n){const i=this.weightAt(t,e);return i>0?n+(this.metresAt(t,e)-n)*i:n}rawAt(t,e){const{d:n}=this.cur,i=n.rect,o=Math.max(0,Math.min(n.W-1,Math.floor((t-i.x0)/(i.x1-i.x0)*n.W))),a=Math.max(0,Math.min(n.H-1,Math.floor((e-i.z0)/(i.z1-i.z0)*n.H)));return this.cur.metres[a*n.W+o]}stats(){var o,a;const t=this.cur;if(!t)return{district:null,incoming:this.incoming?`${this.incoming.d.id}:${this.incoming.state}`:null,loaded:this.loaded,count:this.list.length};const e=t.d.W*t.d.H,n=e*4+e*4+e*4+2*(e*4*4/3)+512*512+(t.pmap?t.pmap.w*t.pmap.h*4:0),i=t.metres?e*4+e*4+e*4:0;return{district:t.d.id,incoming:this.incoming?`${this.incoming.d.id}:${this.incoming.state}`:null,state:t.state,k:+this.k.toFixed(3),want:+this.want.toFixed(3),on:!!this.on,patches:this.patchWeights(),patchMap:t.pmap?{box:[t.pmap.x0,t.pmap.y0,t.pmap.w,t.pmap.h],groups:t.pmap.groups.length-1}:null,decodeMs:t.decodeMs??null,readyMs:t.readyMs??null,workerMs:((o=t.data)==null?void 0:o.ms)??null,gpuMB:+(n/1048576).toFixed(1),cpuMB:+(i/1048576).toFixed(1),nodes:t.terrain?t.terrain.full.count+t.terrain.half.count:0,features:((a=t.features)==null?void 0:a.stats())??null}}}const v_=`
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,x_=`
${ze}
${so}
${Ve}
${bi}
${us}
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
  if (depth < -${sd.toFixed(2)}) discard; // the land's (terrain.glsl.js SEA_EDGE)
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
`;function w_(s,t,e,n){const i=[0,0,0];for(let r=0;r<=n;r++){const c=s*Math.pow(t/s,r/n);for(let l=0;l<e;l++){const h=l/e*Math.PI*2;i.push(Math.cos(h)*c,0,Math.sin(h)*c)}}const o=[];for(let r=0;r<e;r++)o.push(0,1+(r+1)%e,1+r);for(let r=0;r<n;r++)for(let c=0;c<e;c++){const l=1+r*e+c,h=1+r*e+(c+1)%e,u=l+e,f=h+e;o.push(l,h,u,h,f,u)}const a=new Je;return a.setAttribute("position",new ke(i,3)),a.setIndex(o),a}class y_{constructor(t,e){this.uniforms={...t.uniforms,...e,uCamPos:{value:new W},uWind:{value:new Ht(-.8,.45)},uSwellDir:{value:new Ht(-.6,.8)},uDebug:{value:0}},this.material=new Ee({vertexShader:v_,fragmentShader:x_,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new me(w_(1,25e4,96,120),this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const M_=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],__={ra:12.857,dec:27.13};function b_(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}const di=Math.PI/180,So=21*di,Da=29.530588,S_=224.1;function Fu(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),o=Math.sin(s)*Math.cos(So)-n*Math.cos(t)*Math.sin(So),a=Math.sin(s)*Math.sin(So)+n*Math.cos(t)*Math.cos(So);return e.set(i,a,-o)}function E_(s,t,e={}){const n=23.44*di*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*di,a=((s-80)/365.25*24%24+24)%24+t-12;e.sun=Fu(n,(t-12)*15*di,e.sun||new W);const r=s+t/24,c=((r-S_)%Da+Da)%Da,l=c/Da,h=i+l*2*Math.PI,u=Math.asin(Math.sin(23.44*di)*Math.sin(h)+Math.sin(5.1*di)*Math.sin(r*.23)),f=h/(2*Math.PI)*24;return e.moon=Fu(u,(a-f)*15*di,e.moon||new W),e.phase=l,e.night=Math.min(29,Math.floor(c)),e.illum=.5-.5*Math.cos(l*2*Math.PI),e.lst=a,e.decl=n,e}const Nd=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],Od=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],A_=1.6110731556870734,T_=1.5;function C_(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((A_-Math.acos(s))/T_)))}function vc(s,t,e,n=[0,0,0]){const i=C_(t.y),o=.2*e.turbidity*1e-17,a=Math.acos(Math.max(0,s.y)),r=1/(Math.cos(a)+.15*Math.pow(93.885-a*180/Math.PI,-1.253)),c=8400*r,l=1250*r,h=s.x*t.x+s.y*t.y+s.z*t.z,u=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),f=e.mieDirectionalG,d=f*f,g=1/(4*Math.PI)*((1-d)/Math.pow(1-2*f*h+d,1.5)),v=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let m=0;m<3;m++){const p=Nd[m]*e.rayleigh,x=.434*o*Od[m]*e.mieCoefficient,w=Math.exp(-(p*c+x*l)),b=(p*u+x*g)/(p+x);let y=Math.pow(i*b*(1-w),1.5);y*=1+(Math.pow(i*b*w,.5)-1)*v;const S=.1*w,E=(y+S)*.04+[0,3e-4,75e-5][m];n[m]=Math.pow(E,1/2.4)}return n}function R_(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),o=.2*t.turbidity*1e-17;for(let a=0;a<3;a++){const r=Nd[a]*t.rayleigh,c=.434*o*Od[a]*t.mieCoefficient;e[a]=Math.exp(-(r*8400*i+c*1250*i))}return e}const L_=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,Bd=`
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
`,P_=`
${Bd}
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
`,D_=`
${Bd}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,k_=`
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
`,z_=`
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
`;class I_{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=__,e=(l,h)=>{const u=l/24*2*Math.PI,f=h*di;return new W(Math.cos(f)*Math.cos(u),Math.cos(f)*Math.sin(u),Math.sin(f))};this.uniforms={uSun:{value:new W(0,1,0)},uMoon:{value:new W(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:So},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new me(new al(1,5),new Ee({vertexShader:L_,fragmentShader:P_,uniforms:this.uniforms,side:hn,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=b_(4242),o=M_.map(([l,h,u])=>[l/24*2*Math.PI,h*di,u]);for(let l=0;l<2600;l++){const h=i()*2-1;o.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const a=new Float32Array(o.length*3);o.forEach((l,h)=>a.set(l,h*3));const r=new Je;r.setAttribute("aStar",new pe(a,3)),r.setAttribute("position",new pe(new Float32Array(o.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new Ix(r,new Ee({vertexShader:k_,fragmentShader:z_,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:Ac})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new Ne,this.group.add(n,this.stars),this.mapRT=new ti(256,128,{type:Ui,depthBuffer:!1}),this.mapRT.texture.wrapS=Ka,this.mapScene=new Mr;const c=new me(cl(),new Ee({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:D_,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));c.frustumCulled=!1,this.mapScene.add(c),this.mapCam=new wr(-1,1,1,-1,0,1),this.astro={},this._v=new W}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const o=E_(t,e,this.astro),a=o.sun,r=this.uniforms;r.uSun.value.copy(a),r.uMoon.value.copy(o.moon),r.uPhase.value=o.phase,r.uIllum.value=o.illum,r.uLst.value=o.lst/24*2*Math.PI;const c=Ke.smoothstep(-a.y,-.02,.2);r.uNight.value=c,this.starUniforms.uNight.value=c,this.starUniforms.uTime.value=n;const l=this.params,h=this._v,u=vc(h.set(0,1,0),a,l),f=[0,0,0];for(let S=0;S<8;S++){const E=S/8*Math.PI*2,T=vc(h.set(Math.cos(E),.08,Math.sin(E)).normalize(),a,l);for(let M=0;M<3;M++)f[M]+=T[M]/8}const d=vc(h.set(a.x,.05,a.z).normalize(),a,l),g=R_(a,l),v=Ke.smoothstep(a.y,-.04,.06),m=3.2;i.sunColor.setRGB(g[0]*m*v,g[1]*m*v,g[2]*m*v);const p=[.0035,.005,.011],w=Ke.smoothstep(o.moon.y,-.02,.1)*o.illum*c;i.skyColor.setRGB(u[0]*.55+f[0]*.45+p[0]+.012*w,u[1]*.55+f[1]*.45+p[1]+.016*w,u[2]*.55+f[2]*.45+p[2]+.024*w);const b=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Bt(b,b,b),.35),i.zenith.setRGB(u[0],u[1],u[2]),i.horizon.setRGB(f[0]+p[0],f[1]+p[1],f[2]+p[2]),i.sunHorizon.setRGB(d[0],d[1],d[2]);const y=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,a.y)+i.skyColor.r)*y*1.1,(i.sunColor.g*Math.max(0,a.y)+i.skyColor.g)*y,(i.sunColor.b*Math.max(0,a.y)+i.skyColor.b)*y*.8),i.moonColor.setRGB(.05*w,.06*w,.085*w),i.moonDir.copy(o.moon),i.sunDir.copy(a),i.night=c,o}}const ko=Math.PI*2,xc=.4,U_=.18,Nu=(s,t,e,n)=>e>0?s+(t-s)*(1-Math.exp(-e/n)):t,F_=(s,t,e)=>(s+t+Math.sqrt((s-t)*(s-t)+e*e))/2,N_=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,ka=s=>((s+Math.PI)%ko+ko)%ko-Math.PI,O_=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Wd=4e4;function Qi(s){return .6+.52*O_(Math.log(40),Math.log(4500),Math.log(Math.max(1,s)))}class B_{constructor(t,e,n){this.camera=t,this.dom=e,this.world=n,this.minDistance=np,this.maxDistance=wl,this._ray=new Ux,this._v=new W,this.home=this.homeView(),this.reach(this.home.distance);const i=this.home;this.state={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.goal={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.flight=null,this.floor=0,this.groundM=0,this.pinned=!0,this._lastXZ=new Ht(i.target.x,i.target.z),this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this.bind()}homeView(t={x0:16,y0:72,x1:innerWidth-16,y1:innerHeight-120}){const e=this.world.chainShape();return this.fit({points:e.hull,along:[e.from,e.to],yaw:0,box:t,reach:Wd})}reach(t){this.maxDistance=Math.max(wl,t*1.15)}bind(){const t=this.dom,e=new Map;let n=null,i=null,o=null;t.addEventListener("contextmenu",r=>r.preventDefault()),t.addEventListener("pointerdown",r=>{this.enabled&&(t.setPointerCapture(r.pointerId),e.set(r.pointerId,{x:r.clientX,y:r.clientY}),e.size===1?(n=r.button===2||r.shiftKey||r.ctrlKey||r.metaKey||r.altKey?"orbit":"pan",i={x:r.clientX,y:r.clientY}):e.size===2&&(n="pinch",o=this.pinchState(e)))}),t.addEventListener("pointermove",r=>{if(e.has(r.pointerId)){if(e.set(r.pointerId,{x:r.clientX,y:r.clientY}),n==="orbit"&&i){const c=r.clientX-i.x,l=r.clientY-i.y;this.goal.yaw-=c*.005,this.goal.pitch=Ke.clamp(this.goal.pitch+l*.004,.06,1.52),i={x:r.clientX,y:r.clientY},this.touch()}else if(n==="pan"&&i){const c=r.clientX-i.x,l=r.clientY-i.y;(c||l)&&(this.panBy(c,l),this.touch()),i={x:r.clientX,y:r.clientY}}else if(n==="pinch"&&e.size===2){const c=this.pinchState(e),l=o.dist/Math.max(20,c.dist);this.zoomAt(c.cx,c.cy,l),this.panBy(c.cx-o.cx,c.cy-o.cy),this.goal.yaw-=ka(c.angle-o.angle),o=c,this.touch()}}});const a=r=>{if(e.delete(r.pointerId),e.size===0)n=null;else if(e.size===1){const[c]=e.values();n="pan",i={...c}}};t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a),t.addEventListener("wheel",r=>{if(!this.enabled)return;r.preventDefault();const c=r.deltaMode===1?r.deltaY*30:r.deltaY,l=Math.exp(Math.sign(c)*Math.min(Math.abs(c),150)*.0022);this.zoomAt(r.clientX,r.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",r=>{const c=this.pickGround(r.clientX,r.clientY);if(c){const l=Math.max(this.minDistance,this.goal.distance*.35);this.flyTo({target:c,distance:l,pitch:this.goal.pitch+Qi(l)-Qi(this.goal.distance)},1.8)}}),addEventListener("keydown",r=>{var f,d;if(!this.enabled||(d=(f=r.target).closest)!=null&&d.call(f,"input, textarea"))return;const c=this.goal.distance*.08,l={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[r.code];if(l&&!r.altKey){const g=Math.sin(this.goal.yaw),v=Math.cos(this.goal.yaw);this.goal.target.x+=(l[0]*v+l[1]*g)*c,this.goal.target.z+=(-l[0]*g+l[1]*v)*c,this.touch()}r.code==="KeyQ"&&(this.goal.yaw+=.12),r.code==="KeyE"&&(this.goal.yaw-=.12);const h=innerWidth/2,u=innerHeight/2;(r.code==="Equal"||r.code==="NumpadAdd")&&this.zoomAt(h,u,.8),(r.code==="Minus"||r.code==="NumpadSubtract")&&this.zoomAt(h,u,1.25)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,o=Math.sin(this.goal.yaw),a=Math.cos(this.goal.yaw),r=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*a-e*o*r)*i,this.goal.target.z+=(t*o-e*a*r)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),o=this.goal.distance,a=Ke.clamp(o*n,this.minDistance,this.maxDistance);if(i){const r=1-a/o;this.goal.target.x+=(i.x-this.goal.target.x)*r,this.goal.target.z+=(i.z-this.goal.target.z)*r}this.goal.pitch=Ke.clamp(this.goal.pitch+Qi(a)-Qi(o),.06,1.52),this.goal.distance=a}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Ht((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e){const n=this.world,i=n.maxY+.05;if(e.y>=0&&t.y>i)return null;const o=e.y<0?t.y/-e.y:4e5;let a=t.y>i&&e.y<0?(t.y-i)/-e.y:0;const r=Math.min(o,4e5),c=this._v;let l=a;for(let h=0;h<700&&a<=r+.001;h++){c.copy(t).addScaledVector(e,a);const u=c.y-n.heightAt(c.x,c.z);if(u<0){let f=l,d=a;for(let g=0;g<24;g++){const v=(f+d)/2;c.copy(t).addScaledVector(e,v),c.y-n.heightAt(c.x,c.z)<0?d=v:f=v}return c.clone()}l=a,a+=Math.max(.02,u*.45,a*.0015)}return o<4e5?t.clone().addScaledVector(e,o).setY(0):null}fit({rect:t,points:e,along:n,distance:i,yaw:o=this.goal.yaw,tilt:a=0,pitch:r,box:c,pad:l=1.06,reach:h=this.maxDistance}){const u=this._fitCam||(this._fitCam=new _n),f=innerWidth,d=innerHeight;u.fov=this.camera.fov,u.aspect=f/Math.max(1,d),u.near=.1,u.far=1e6,u.updateProjectionMatrix();const g=c||{x0:0,y0:0,x1:f,y1:d},v=Math.max(60,g.x1-g.x0),m=Math.max(60,g.y1-g.y0),p=Math.tan(u.fov*Math.PI/360),x=e||[[t.x0,t.z0],[t.x1,t.z0],[t.x0,t.z1],[t.x1,t.z1]];let w=1/0,b=1/0,y=-1/0,S=-1/0;for(const[I,O]of x)w=Math.min(w,I),y=Math.max(y,I),b=Math.min(b,O),S=Math.max(S,O);let E=(w+y)/2,T=(b+S)/2;const M=i!==void 0;let _=M?i:Math.max(y-w,S-b)/(2*p)*(d/m),A=0;const R=Math.atan2(m,v),D=(I,O)=>Math.atan2(Math.sin(I)/Math.max(.35,Math.sin(O)),Math.cos(I));if(n){const[[I,O],[N,j]]=n;o=D(R,Qi(_)+a)-Math.atan2(j-O,N-I)}const C=this._v,z=(I,O,N)=>(C.set(I,O,N).project(u),[(C.x+1)/2*f,(1-C.y)/2*d]);for(let I=0,O=n?14:8;I<O;I++){_=Ke.clamp(_,this.minDistance,h),A=Ke.clamp(r??Qi(_)+a,.06,1.52);const N=Math.cos(A),j=Math.cos(o),H=Math.sin(o),J=M?this.world.heightAt(E,T):0;u.position.set(E+_*N*H,J+_*Math.sin(A),T+_*N*j),u.lookAt(E,J,T),u.updateMatrixWorld();let ot=1/0,Y=1/0,nt=-1/0,ct=-1/0;for(const[Rt,yt]of x){const[It,X]=z(Rt,M?this.world.heightAt(Rt,yt):J,yt);ot=Math.min(ot,It),nt=Math.max(nt,It),Y=Math.min(Y,X),ct=Math.max(ct,X)}if(n){const[[Rt,yt],[It,X]]=n,[fe,Lt]=z(Rt,J,yt),[Ft,Z]=z(It,J,X);o+=ka(D(R,A)-D(Math.atan2(Z-Lt,Ft-fe),A))}M||(_*=Ke.clamp(Math.max((nt-ot)*l/v,(ct-Y)*l/m),.3,3));const mt=2*_*p/d,St=((ot+nt)/2-(g.x0+g.x1)/2)*mt,Tt=((Y+ct)/2-(g.y0+g.y1)/2)*mt/Math.max(.35,Math.sin(A));E+=St*j+Tt*H,T+=-St*H+Tt*j}return _=Ke.clamp(_,this.minDistance,h),{target:new W(E,this.world.heightAt(E,T),T),distance:_,yaw:n?ka(o):o,pitch:A}}groundAt(t,e){return Math.max(0,this.world.metresAt(t,e))}smoothGround(t,e,n){const i=U_*n;let o=2*this.groundAt(t,e),a=2;for(let r=0;r<6;r++){const c=r/6*ko,l=c+ko/12;o+=this.groundAt(t+Math.cos(c)*i*.5,e+Math.sin(c)*i*.5),o+=this.groundAt(t+Math.cos(l)*i,e+Math.sin(l)*i),a+=2}return o/a}pin(){const t=this.goal.target;this.groundM=this.groundAt(t.x,t.z),this.pinned=!0,this._lastXZ.set(t.x,t.z);const e=this.groundM*this.world.uniforms.uVert.value;t.y=e,this.state.target.y=e}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift,groundM:this.groundM},o={target:t.target?t.target.clone():i.target.clone(),distance:Ke.clamp(t.distance??i.distance,this.minDistance,this.maxDistance),yaw:t.yaw??i.yaw,pitch:Ke.clamp(t.pitch??i.pitch,.06,1.52),lift:t.lift??0};o.yaw=i.yaw+ka(o.yaw-i.yaw);const a=Math.hypot(i.target.x-o.target.x,i.target.z-o.target.z),r=n.hop??Math.max(0,a*.9-Math.max(i.distance,o.distance)*.6);this.flight={from:i,dest:o,t:0,duration:e,hop:r,onDone:n.onDone,ready:n.ready,held:0}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,this.pin(),(e=t.onDone)==null||e.call(t),this.apply()}jump({x:t,z:e,distance:n,yaw:i,pitch:o}){this.flight=null;for(const a of[this.goal,this.state])t!==void 0&&a.target.set(t,this.world.heightAt(t,e),e),n!==void 0&&(a.distance=n),i!==void 0&&(a.yaw=i),o!==void 0&&(a.pitch=o),a.lift=0;this.pin(),this.apply()}update(t){var r;const e=this.goal;if(this.flight){const c=this.flight;let l=t/c.duration;c.ready&&c.t>.8&&c.held<6&&!c.ready()&&(c.held+=t,l*=.08),c.t=Math.min(1,c.t+l);const h=N_(c.t);e.target.lerpVectors(c.from.target,c.dest.target,h);const u=Math.log(c.from.distance)*(1-h)+Math.log(c.dest.distance)*h;e.distance=Math.exp(u)+c.hop*Math.sin(Math.PI*h),e.yaw=c.from.yaw+(c.dest.yaw-c.from.yaw)*h,e.pitch=c.from.pitch+(c.dest.pitch-c.from.pitch)*h+.2*Math.sin(Math.PI*h)*Math.min(1,c.hop/300),e.pitch=Math.min(1.52,e.pitch),e.lift=c.from.lift+(c.dest.lift-c.from.lift)*h,this.groundM=c.from.groundM+(this.groundAt(c.dest.target.x,c.dest.target.z)-c.from.groundM)*h,c.t>=1&&(this.flight=null,this.pin(),(r=c.onDone)==null||r.call(c))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);const n=this.world.bounds,i=150+e.distance*.3;e.target.x=Ke.clamp(e.target.x,n.x0-i,n.x1+i),e.target.z=Ke.clamp(e.target.z,n.z0-i,n.z1+i),this.flight||(Math.abs(e.target.x-this._lastXZ.x)+Math.abs(e.target.z-this._lastXZ.y)>1e-7&&(this.pinned=!1),this._lastXZ.set(e.target.x,e.target.z),this.pinned||(this.groundM=Nu(this.groundM,this.smoothGround(e.target.x,e.target.z,e.distance),t,xc))),e.target.y=this.groundM*this.world.uniforms.uVert.value;const o=this.state,a=this.flight?1:1-Math.exp(-t*7);o.target.lerp(e.target,a),o.distance=Math.exp(Math.log(o.distance)+(Math.log(e.distance)-Math.log(o.distance))*a),o.yaw+=(e.yaw-o.yaw)*a,o.pitch+=(e.pitch-o.pitch)*a,o.lift+=(e.lift-o.lift)*a,this.apply(t)}groundAhead(t,e,n){const i=this.world;let o=i.heightAt(t,e);const a=this._prevXZ;if(a&&n>0){const r=(t-a.x)/n,c=(e-a.y)/n,l=Math.hypot(r,c),h=Math.min(20,l*.3);h>.005&&(o=Math.max(o,i.heightAt(t+r/l*h,e+c/l*h)))}return this._prevXZ=(this._prevXZ||new Ht).set(t,e),o}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const o=.12+e.distance*.03,a=this.groundAhead(n.position.x,n.position.z,t),r=Math.max(0,a+o-n.position.y);this.floor=Nu(this.floor,r,t,r>this.floor?xc/3:xc*2),n.position.y+=this.floor;const c=this.world.heightAt(n.position.x,n.position.z),l=Math.min(.04,o*.3);n.position.y=F_(n.position.y,c+l,l),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const h=n.position.y-c;n.near=Ke.clamp(Math.min(h,e.distance)*.12,.02,300),n.far=Ke.clamp(e.distance*30+h*60,8e3,3e5),n.updateProjectionMatrix(),n.updateMatrixWorld()}}const W_=1.5,G_=`
${ze}
${Ve}
${bi}
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
`,H_=`
uniform vec3 uColor;
uniform float uOpacity;
in float vFade;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vFade);
}
`;function V_(s){return s?s.type==="Polygon"?s.coordinates:s.type==="MultiPolygon"?s.coordinates.flat():s.type==="LineString"?[s.coordinates]:s.type==="MultiLineString"?s.coordinates:[]:[]}function $_(s,t){var o;const e=new Map,n=new Set,i=a=>Math.round(a*1e6);for(const a of(s==null?void 0:s.features)||[]){const r=Ba((o=a.properties)==null?void 0:o.island)||"other";let c=e.get(r);c||e.set(r,c=[]);for(const l of V_(a.geometry))for(let h=0;h+1<l.length;h++){const u=l[h],f=l[h+1],d=`${i(u[0])},${i(u[1])}`,g=`${i(f[0])},${i(f[1])}`;if(d===g)continue;const v=d<g?`${d}|${g}`:`${g}|${d}`;if(n.has(v))continue;n.add(v);const[m,p]=t.toWorld(u),[x,w]=t.toWorld(f),b=Math.max(1,Math.ceil(Math.hypot(x-m,w-p)/W_));for(let y=0;y<b;y++){const S=y/b,E=(y+1)/b;c.push(m+(x-m)*S,p+(w-p)*S,m+(x-m)*E,p+(w-p)*E)}}}return e}class Ou{constructor(t,e,n,{color:i,width:o,order:a}){this.group=new Ne,this.uniforms={...n,uResolution:{value:new Ht(1,1)},uWidth:{value:o},uCamPos:{value:new W},uColor:{value:new Bt(...i)},uOpacity:{value:1}},this.material=new Ee({vertexShader:G_,fragmentShader:H_,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});const r=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);this.count=0;for(const[,c]of $_(t,e)){if(!c.length)continue;const l=new io;l.setAttribute("position",new pe(r,3)),l.setIndex([0,2,1,1,2,3]);const h=new Float32Array(c);l.setAttribute("aSeg",new ue(h,4)),l.instanceCount=h.length/4,this.count+=l.instanceCount;let u=1/0,f=-1/0,d=1/0,g=-1/0;for(let p=0;p<h.length;p+=2)u=Math.min(u,h[p]),f=Math.max(f,h[p]),d=Math.min(d,h[p+1]),g=Math.max(g,h[p+1]);const v=new W((u+f)/2,60,(d+g)/2);l.boundingSphere=new Oi(v,Math.hypot(f-u,g-d,300)/2+10);const m=new me(l,this.material);m.renderOrder=a,this.group.add(m)}}update(t,e,n){this.uniforms.uResolution.value.copy(e),this.uniforms.uCamPos.value.copy(t.position),this.uniforms.uOpacity.value=n,this.group.visible=n>.01&&this.count>0}}class j_{constructor(t,e){this.group=new Ne,this.moku=new Ou(t.moku,t.proj,e,{color:[1.5,1.08,.52],width:2.2,order:3}),this.ahupuaa=new Ou(t.ahupuaa,t.proj,e,{color:[1.25,1.2,1.06],width:1.3,order:2}),this.group.add(this.ahupuaa.group,this.moku.group),this.visible=!0,this._res=new Ht}update(t,e,n,i=1){e.getDrawingBufferSize(this._res);const o=e.getPixelRatio(),a=this.visible?1:0,r=(c,l,h)=>{const u=Math.max(0,Math.min(1,(h-c)/(l-c)));return u*u*(3-2*u)};this.moku.uniforms.uWidth.value=(1.3+1.1*(1-r(800,4e3,n)))*o,this.ahupuaa.uniforms.uWidth.value=1.25*o,this.moku.uniforms.uColor.value.setRGB(1.5*i,1.08*i,.52*i),this.ahupuaa.uniforms.uColor.value.setRGB(1.25*i,1.2*i,1.06*i),this.moku.update(t,this._res,a*(.55+.4*(1-r(1500,6e3,n)))),this.ahupuaa.update(t,this._res,a*.75*(1-r(220,650,n)))}}const X_=4,Bu=[300,1e3],Wu=[.4,.7],q_=9,Gu={voyage:[1.38,1.18,.86],fleet:[1.6,.9,.52],ship:[1,1.1,1.26],trade:[1.15,1.1,.96],schematic:[1.25,1.18,1.02]},Hu={journal:{width:2,opacity:.92,pulse:1},narrative:{width:1.7,opacity:.82,pulse:.9},schematic:{width:1.4,opacity:.62,pulse:.45}},Y_={day:0,month:0,year:0,decade:5,generation:12,century:50},wc=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},K_=`
${ze}
${Ve}
${bi}
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
`,Z_=`
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
`;function J_(s){const t=s.when||{},e=(a,r)=>{const c=String(a??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!c)return null;const l=Number(c[1]);return c[2]?l+(Number(c[2])-1+(r?1:0))/12:l+(r?1:0)};let n=e(t.from,!1),i=e(t.to??t.from,!0);if(n===null&&i===null)return null;n===null&&(n=i-1),i===null&&(i=n+1);const o=Y_[t.precision]??0;return o&&i-n<=1.01&&(n-=o,i+=o),[n,i]}async function Q_(s,t=console.warn){const e=s!=null&&s.abs?s.abs("routes.json"):new URL("routes.json",new URL((s==null?void 0:s.base)||"./data/",location.href)).href;try{const n=await fetch(e);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json();return Array.isArray(i)?i:Array.isArray(i==null?void 0:i.routes)?i.routes:[]}catch(n){return t(`${e}: ${n.message} (no routes)`),[]}}class t2{constructor(t,e,n){this.route=t,this.span=J_(t);const i=Hu[t.pointPrecision]?t.pointPrecision:"schematic";this.style=Hu[i],this.ret=t.direction==="return";const o=i==="schematic",a=new Set(t.schematicSegments||[]),r=(t.points||[]).map(w=>e.toWorld(w)),c=[],l=[];let h=0;for(let w=0;w+1<r.length;w++){const[b,y]=r[w],[S,E]=r[w+1],T=Math.hypot(S-b,E-y),M=Math.max(1,Math.ceil(T/X_)),_=o||a.has(w)?1:0;for(let A=0;A<M;A++){const R=A/M,D=(A+1)/M;c.push(b+(S-b)*R,y+(E-y)*R,b+(S-b)*D,y+(E-y)*D),l.push(h+T*R,h+T*D,_,0)}h+=T}this.total=h;const u=(w,b,y)=>{c.push(w[0],w[1],b[0],b[1]),l.push(y,y,0,1)};r.length>=2&&(u(r.at(-2),r.at(-1),h),this.ret&&u(r[1],r[0],0));const f=new io;f.setAttribute("position",new pe(new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),3)),f.setIndex([0,2,1,1,2,3]);const d=new Float32Array(c);f.setAttribute("aSeg",new ue(d,4)),f.setAttribute("aInfo",new ue(new Float32Array(l),4)),f.instanceCount=d.length/4;let g=1/0,v=-1/0,m=1/0,p=-1/0;for(const[w,b]of r)g=Math.min(g,w),v=Math.max(v,w),m=Math.min(m,b),p=Math.max(p,b);f.boundingSphere=new Oi(new W((g+v)/2,60,(m+p)/2),Math.hypot(v-g,p-m,300)/2+20),this.geometry=f;const x=Gu[t.kind]||Gu.schematic;this.colour=x,this.uniforms={...n,uResolution:{value:new Ht(1,1)},uWidth:{value:this.style.width},uHead:{value:9},uCamPos:{value:new W},uColor:{value:new Bt(...x)},uOpacity:{value:0},uDashLen:{value:30},uMarch:{value:0},uPulse:{value:-1e6},uPulseLen:{value:60},uPulseK:{value:this.style.pulse}},this.material=new Ee({vertexShader:K_,fragmentShader:Z_,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),this.mesh=new me(f,this.material),this.mesh.renderOrder=4,this.mesh.visible=!1,this.k=0,this.w=1,this.phase=e2(t.id||"")%1e3/1e3}dispose(){this.geometry.dispose(),this.material.dispose()}}function e2(s){let t=2166136261;for(let e=0;e<s.length;e++)t=Math.imul(t^s.charCodeAt(e),16777619);return t>>>0}class n2{constructor({routes:t=[],proj:e,uniforms:n,camera:i,renderer:o,eras:a=[]}){this.proj=e,this.shared=n,this.camera=i,this.renderer=o,this.eras=[...a].filter(r=>Number.isFinite(r.year)).sort((r,c)=>r.year-c.year),this.group=new Ne,this.group.name="routes",this.lines=[],this._res=new Ht,this._last=null,this.setRoutes(t)}setRoutes(t){for(const e of this.lines)this.group.remove(e.mesh),e.dispose();this.lines=[];for(const e of t||[]){if(!Array.isArray(e.points)||e.points.length<2)continue;const n=new t2(e,this.proj,this.shared);n.span&&(this.lines.push(n),this.group.add(n.mesh))}}windowAt(t){const e=this.eras;if(e.length<2)return[t-10,t+10];const n=o=>{if(o<=0)return e[0].year+o*(e[1].year-e[0].year);const a=e.length-1;if(o>=a)return e[a].year+(o-a)*(e[a].year-e[a-1].year);const r=Math.floor(o);return e[r].year+(o-r)*(e[r+1].year-e[r].year)};let i=0;if(t>=e.at(-1).year)i=e.length-1+(t-e.at(-1).year)/Math.max(1e-6,e.at(-1).year-e.at(-2).year);else if(t>e[0].year){for(let o=0;o+1<e.length;o++)if(t<=e[o+1].year){i=o+(t-e[o].year)/Math.max(1e-6,e[o+1].year-e[o].year);break}}return[n(i-.5),n(i+.5)]}visibleRoutes(){return this.lines.filter(t=>t.k>.5&&t.mesh.visible).map(t=>t.route)}update(t,e,{window:n,light:i=1,fill:o=0,section:a=null,all:r=!1}={}){const c=performance.now()/1e3,l=this._last===null?1:Math.max(0,Math.min(.1,c-this._last));this._last=c,this.apply(t,e,{win:n,light:i,fill:o,section:a,all:r},c,1-Math.exp(-l*4))}settle(t,e,{window:n,light:i=1,fill:o=0,section:a=null,all:r=!1}={}){this.apply(t,e,{win:n,light:i,fill:o,section:a,all:r},performance.now()/1e3,1)}apply(t,e,{win:n,light:i,fill:o,section:a,all:r},c,l){var m,p;const[h,u]=n||this.windowAt(t);this.renderer.getDrawingBufferSize(this._res);const f=this.renderer.getPixelRatio(),d=wc(Bu[0],Bu[1],e),g=1-wc(Wu[0],Wu[1],o),v=1-wc(800,4e3,e);for(const x of this.lines){const[w,b]=x.span,y=!!a&&(((m=a.routes)==null?void 0:m.has(x.route.id))||((p=a.events)==null?void 0:p.has(x.route.event))),S=y||r&&b>=h&&w<=u?1:0;x.k+=(S-x.k)*l,Math.abs(S-x.k)<.003&&(x.k=S);const E=y&&!r?a.k??1:1;x.w+=(E-x.w)*l,Math.abs(E-x.w)<.003&&(x.w=E);const T=t>=w&&t<=b?1:.55,M=y&&!!a.focus,_=x.style.opacity*x.k*x.w*d*(M?1:g)*T;if(x.mesh.visible=_>.01,!x.mesh.visible)continue;const A=x.uniforms;A.uResolution.value.copy(this._res),A.uCamPos.value.copy(this.camera.position),A.uWidth.value=(x.style.width+.6*v)*f,A.uHead.value=(8+3*v)*f,A.uOpacity.value=_,A.uColor.value.setRGB(x.colour[0]*i,x.colour[1]*i,x.colour[2]*i),A.uPulseK.value=x.style.pulse*x.w,A.uDashLen.value=e*.016,A.uPulseLen.value=Math.min(x.total*.12,e*.035);const R=(c/q_+x.phase)%1;A.uPulse.value=x.ret?(R<.5?R*2:2-R*2)*x.total:R*x.total,A.uMarch.value=x.ret?0:c*e*.012%(e*.016)}}dispose(){for(const t of this.lines)t.dispose();this.lines=[],this.group.clear()}}const za=s=>String(s||"").normalize("NFD").replace(/[̀-ͯʻʼ'‘’]/g,"").toLowerCase();function Gd(s,t,e,n,i,o){const a=t/(n.x1-n.x0),r=e/(n.z1-n.z0),c=[];let l=1/0,h=-1/0;for(const v of i)for(let m=0;m+1<v.length;m++){const p=(v[m][0]-n.x0)*a,x=(v[m][1]-n.z0)*r,w=(v[m+1][0]-n.x0)*a,b=(v[m+1][1]-n.z0)*r;x!==b&&(c.push(x<b?[x,p,b,w]:[b,w,x,p]),l=Math.min(l,x,b),h=Math.max(h,x,b))}if(!c.length)return;c.sort((v,m)=>v[0]-m[0]);const u=[],f=Math.max(0,Math.floor(l)),d=Math.min(e-1,Math.ceil(h));let g=0;for(let v=f;v<=d;v++){const m=v+.5;for(u.length=0;g<c.length&&c[g][2]<=m&&c[g][0]<=m;)g++;for(let x=g;x<c.length;x++){const w=c[x];if(w[0]>m)break;w[2]<=m||u.push(w[1]+(m-w[0])/(w[2]-w[0])*(w[3]-w[1]))}u.sort((x,w)=>x-w);const p=v*t;for(let x=0;x+1<u.length;x+=2){const w=Math.max(0,Math.ceil(u[x]-.5)),b=Math.min(t-1,Math.floor(u[x+1]-.5));for(let y=w;y<=b;y++)s[p+y]=o}}}class i2{constructor(t,e,n,i=console.warn){var u,f;this.data=t,this.rect=e,this.uniforms=n,this.polities=new Map((t.polities.polities||[]).map(d=>[d.id,d]));const o=(((u=t.moku)==null?void 0:u.features)||[]).slice(0,255);(((f=t.moku)==null?void 0:f.features)||[]).length>255&&i("more than 255 moku: the overlay shows the first 255");const a=e.x1-e.x0,r=e.z1-e.z0,c=Math.min(4096,Math.ceil(Math.max(a,r)/1.5));this.W=Math.round(a>=r?c:c*a/r),this.H=Math.round(a>=r?c*r/a:c),this.grid=new Uint8Array(this.W*this.H),this.mokus=[null],o.forEach((d,g)=>{const v=d.properties||{},m=v.name??v.moku??"",p=v.islandId||Ba(v.island),x=d.geometry,w=(x==null?void 0:x.type)==="Polygon"?[x.coordinates]:(x==null?void 0:x.type)==="MultiPolygon"?x.coordinates:[];for(const b of w)Gd(this.grid,this.W,this.H,e,b.map(y=>y.map(S=>t.proj.toWorld(S))),g+1);this.mokus.push({index:g+1,name:m,island:v.island,islandKey:p,key:v.mokuKey||`${p}:${m}`,props:v})}),this.loose=new Map(this.mokus.slice(1).map(d=>[`${d.islandKey}:${za(d.name)}`,d])),this.checkKeys(i);const l=new Ze(this.grid,this.W,this.H,Ni,ge);l.minFilter=se,l.magFilter=se,l.unpackAlignment=1,l.needsUpdate=!0,this.idTex=l,this.palette=new Uint8Array(256*2*4);const h=new Ze(this.palette,256,2,De,ge);h.minFilter=se,h.magFilter=se,h.needsUpdate=!0,this.palTex=h,n.uMokuId.value=l,n.uMokuRect.value.set(e.x0,e.z0,e.x1,e.z1),n.uPalette.value=h,this.eraKeys=[null,null]}checkKeys(t){const e=new Set(this.mokus.slice(1).map(i=>i.key)),n=new Set;for(const[i,o]of Object.entries(this.data.polities.byEra||{}))for(const a of Object.keys(o)){if(e.has(a))continue;const[r,...c]=a.split(":"),l=this.loose.get(`${Ba(r)}:${za(c.join(":"))}`);n.add(l?`${a} (${i}; the boundary file spells it "${l.name}")`:`${a} (${i})`)}n.size&&t(`polities.json names moku the boundary file doesn't have: ${[...n].slice(0,12).join(", ")}${n.size>12?", …":""}`)}holder(t,e){var o;const n=t?(o=this.data.polities.byEra)==null?void 0:o[t.id]:null;if(!n)return null;let i=n[e.key];if(i===void 0)for(const[a,r]of Object.entries(n)){const[c,...l]=a.split(":");if(Ba(c)===e.islandKey&&za(l.join(":"))===za(e.name)){i=r;break}}return i?this.polities.get(i)||{id:i,name:i,colour:"#cccccc"}:null}setEras(t,e,n){const i=(t==null?void 0:t.id)??null,o=(e==null?void 0:e.id)??null;if(i!==this.eraKeys[0]||o!==this.eraKeys[1]){this.eraKeys=[i,o];const r=new Bt;this.palette.fill(0);for(const[c,l]of[[0,t],[1,e]])for(const h of this.mokus.slice(1)){const u=this.holder(l,h);if(!u)continue;r.set(u.colour||"#cccccc");const f=(c*256+h.index)*4;this.palette[f]=Math.round(r.r*255),this.palette[f+1]=Math.round(r.g*255),this.palette[f+2]=Math.round(r.b*255),this.palette[f+3]=255}this.palTex.needsUpdate=!0}const a=Math.max(0,Math.min(1,(n-.35)/.3));this.uniforms.uEraMix.value=t===e?0:a*a*(3-2*a)}mokuAt(t,e){const n=this.rect,i=Math.floor((t-n.x0)/(n.x1-n.x0)*this.W),o=Math.floor((e-n.z0)/(n.z1-n.z0)*this.H);return i<0||o<0||i>=this.W||o>=this.H?null:this.mokus[this.grid[o*this.W+i]]||null}politiesIn(t){const e=new Map;for(const n of this.mokus.slice(1)){const i=this.holder(t,n);i&&e.set(i.id,i)}return[...e.values()]}}const $a=1848,Oo=[{id:"crown",name:"Crown",colour:"#f0b43c"},{id:"government",name:"Government",colour:"#5e9fd6"},{id:"konohiki",name:"Konohiki",colour:"#c7364f"},{id:"mixed",name:"Mixed",colour:"#a77fcf"},{id:"unknown",name:"Unknown",colour:"#b5b0a5",alpha:.85}],Vu=new Map(Oo.map((s,t)=>[s.id,t+1]));class s2{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.available=null,this.units=[],this.sources=null,this.built=!1,this.listeners=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){return this.loading?this.loading:(this.loading=(async()=>{var a;const t=this.data.abs("mahele.json");let e;try{const r=(a=this.data.ahupuaa)==null?void 0:a.features;if(!(r!=null&&r.length))throw new Error("no ahupuaʻa boundaries to lay it on");const c=await fetch(t);if(!c.ok)throw new Error(`HTTP ${c.status}`);if(e=await c.json(),!Array.isArray(e==null?void 0:e.ahupuaa))throw new Error("no ahupuaʻa in it")}catch(r){this.available=!1,this.warn(`${t}: ${r.message} (no Māhele view)`),this.notify();return}this.file=e,this.sources=new Set(e.sources||[]);const n=new Map(e.ahupuaa.map(r=>[r.gisId,r])),i=this.data.proj;let o=0;for(const r of this.data.ahupuaa.features){const c=r.properties||{},l=r.geometry,h=(l==null?void 0:l.type)==="Polygon"?[l.coordinates]:(l==null?void 0:l.type)==="MultiPolygon"?l.coordinates:[],u=n.get(c.gisId);u||o++;const f=Vu.has(u==null?void 0:u.class)?u.class:"unknown",d=h.map(v=>v.map(m=>m.map(p=>i.toWorld(p)))),g=[1/0,1/0,-1/0,-1/0];for(const v of d)for(const m of v)for(const[p,x]of m)g[0]=Math.min(g[0],p),g[1]=Math.min(g[1],x),g[2]=Math.max(g[2],p),g[3]=Math.max(g[3],x);this.units.push({gisId:c.gisId,name:(u==null?void 0:u.name)??c.name??c.ahupuaa,island:c.island||"",islandId:c.islandId||(u==null?void 0:u.islandId)||"",moku:c.moku||"",cls:f,entry:u||null,rings:d,box:g})}o&&this.warn(`mahele.json has no entry for ${o} of the ahupuaʻa (drawn as unknown)`),this.available=!0,this.notify()})(),this.loading)}build(){if(this.built||!this.available)return this.built;const t=this.app.polity.rect,e=this.app.polity.W,n=this.app.polity.H,i=new Uint8Array(e*n);for(const l of this.units)for(const h of l.rings)Gd(i,e,n,t,h,Vu.get(l.cls));const o=new Ze(i,e,n,Ni,ge);o.minFilter=se,o.magFilter=se,o.unpackAlignment=1,o.needsUpdate=!0,o.onUpdate=()=>{o.image.data=null,o.onUpdate=null};const a=new Uint8Array(256*2*4),r=new Bt;Oo.forEach((l,h)=>{r.set(l.colour);for(const u of[0,1]){const f=(u*256+h+1)*4;a[f]=Math.round(r.r*255),a[f+1]=Math.round(r.g*255),a[f+2]=Math.round(r.b*255),a[f+3]=Math.round((l.alpha??1)*255)}});const c=new Ze(a,256,2,De,ge);return c.minFilter=se,c.magFilter=se,c.needsUpdate=!0,this.idTex=o,this.palTex=c,this.rect=t,this.built=!0,!0}availableAt(t=this.app.timeline.year){return this.available!==!1&&t>=$a}unitAt(t,e){for(const n of this.units){const i=n.box;if(!(t<i[0]||e<i[1]||t>i[2]||e>i[3])){for(const o of n.rings)if(o2(o,t,e))return n}}return null}counts(t=null){const e=Object.fromEntries(Oo.map(i=>[i.id,0]));let n=0;for(const i of this.units)t&&i.islandId!==t||(e[i.cls]++,n++);return{byClass:e,all:n}}}function o2(s,t,e){let n=!1;for(const i of s)for(let o=0,a=i.length-1;o<i.length;a=o++){const[r,c]=i[o],[l,h]=i[a];c>e!=h>e&&t<(l-r)*(e-c)/(h-c)+r&&(n=!n)}return n}const a2=new Date().getFullYear();function ur(s,t=!1){if(s==null)return null;if(typeof s=="number")return s+(t?1:0);const e=String(s).match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!e)return null;const n=Number(e[1]);if(e[2]){const i=Number(e[2])-1+(t?1:0);return n+i/12}return n+(t?1:0)}const r2={day:0,month:0,year:0,decade:5,generation:12,century:50};function Hc(s){const t=s.when||{};let e=ur(t.from),n=ur(t.to??t.from,!0);if(e===null&&n===null)return null;e===null&&(e=n-1),n===null&&(n=e+1);const i=r2[t.precision]??0;return i&&n-e<=1.01&&(e-=i,n+=i),[e,n]}function fr(s){const t=s.when||{};return ur(t.from)??ur(t.to)}const Hd=["generation","century","decade"];function Vd(s){var e;const t=fr(s);return t===null?"":zo(Math.floor(t),Hd.includes((e=s.when)==null?void 0:e.precision)?10:1)}function c2(s){const t=s.when||{},e=i=>{const o=String(i??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!o)return String(i??"");const a=["January","February","March","April","May","June","July","August","September","October","November","December"],r=Number(o[1]),c=r<0?`${-r} BCE`:String(r);return o[3]?`${Number(o[3])} ${a[Number(o[2])-1]} ${c}`:o[2]?`${a[Number(o[2])-1]} ${c}`:c},n=Hd.includes(t.precision)?"c. ":"";return!t.to||t.to===t.from?`${n}${e(t.from)}`:`${n}${e(t.from)} – ${e(t.to)}`}class l2{constructor(t,{now:e=a2}={}){this.eras=[...t].filter(o=>Number.isFinite(o.year)).sort((o,a)=>o.year-a.year),this.s=0,this.listeners=[];const n=this.eras,i=n.at(-1);this.end=i?i.year:1800,this.tail=0,n.length>1&&i.year<e&&i.year+(i.yearPrecision??0)>=e&&(this.end=e,this.tail=(e-i.year)/Math.max(1e-6,i.year-n.at(-2).year))}get n(){return this.eras.length}get max(){return Math.max(0,this.n-1+this.tail)}get reachesNow(){return this.tail>0}eraAt(t){return this.eras[Math.round(Math.max(0,Math.min(this.n-1,t)))]||null}yearAt(t){const e=this.eras;if(!e.length)return 1800;if(e.length===1)return e[0].year+t*50;if(t<=0)return e[0].year+t*(e[1].year-e[0].year);if(t>=e.length-1)return e[e.length-1].year+(t-e.length+1)*(e[e.length-1].year-e[e.length-2].year);const n=Math.floor(t);return e[n].year+(t-n)*(e[n+1].year-e[n].year)}sAtYear(t){const e=this.eras;if(e.length<2||t<=e[0].year)return 0;for(let i=0;i+1<e.length;i++)if(t<=e[i+1].year)return i+(t-e[i].year)/Math.max(1e-6,e[i+1].year-e[i].year);const n=e.length-1;return Math.min(this.max,n+(t-e[n].year)/Math.max(1e-6,e[n].year-e[n-1].year))}get year(){return this.yearAt(this.s)}get era(){return this.eraAt(this.s)}get pair(){const t=Math.max(0,this.n-1),e=Math.max(0,Math.min(t,this.s)),n=Math.floor(e),i=Math.min(t,n+1);return{a:this.eras[n],b:this.eras[i],t:e-n}}get window(){return[this.yearAt(this.s-.5),this.yearAt(this.s+.5)]}set(t){const e=Math.max(0,Math.min(this.max,t));if(e!==this.s){this.s=e;for(const n of this.listeners)n(this)}}setYear(t){this.set(this.sAtYear(t))}onChange(t){this.listeners.push(t)}}function zo(s,t=1){const e=Math.round(s),n=e<0?`${-e} BCE`:String(e);return t>=10?`c. ${n}`:n}const $u=[95,135],ju=6e3,h2=30,u2=1.5,Xu=[4,40],f2=2,qu=ce,ja=(s,t,e)=>Math.hypot(Math.max(s.x0-t,0,t-s.x1),Math.max(s.z0-e,0,e-s.z1));class d2{constructor(t){this.app=t,this.group=new Ne,this.group.name="towns",this.group.visible=!1,t.scene.add(this.group),this.islands=new Map,this.yearNow=t.timeline.year,this.version=0,this.hidden=!1,this.show=0,this.yieldU={uYieldRect:{value:new te(0,0,-1,-1)},uYield:{value:0}},this.manifest=null,t.updaters.push(e=>this.update(e))}layers(){return this.manifest??(this.manifest=fetch(this.app.data.abs("layers/manifest.json")).then(t=>{if(!t.ok)throw new Error(`layers/manifest.json: HTTP ${t.status}`);return t.json()})),this.manifest}updateYield(){var i,o;const t=this.app.districts,e=t==null?void 0:t.cur,n=this.yieldU;if(t!=null&&t.on&&((o=(i=e==null?void 0:e.features)==null?void 0:i.settlements)!=null&&o.ready)){const a=e.d.rect;n.uYieldRect.value.set(a.x0+os,a.z0+os,a.x1-os,a.z1-os),n.uYield.value=t.k}else n.uYieldRect.value.set(0,0,-1,-1),n.uYield.value=0}update(t,e=jt((this.app.frameAvg??16)*.25,Xu[0],Xu[1])){const n=this.app,i=n.timeline.year;t>0?(this.yearNow+=(i-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(i-this.yearNow)<.05&&(this.yearNow=i)):this.yearNow=i;const o=n.rig.state.distance;let a=1-qu($u[0],$u[1],o);(this.hidden||!n.islandsLoaded)&&(a=0),this.show=a,this.group.visible=a>.001,this.updateYield();const r=performance.now();if(this.group.visible){const c=n.rig.state.target,l=Ud(o);this.R=l;const h=performance.now();for(const u of n.world.islands){let f=this.islands.get(u.pack.id);const d=u.slot>=0?u.k:0;if(d<=.02||ja(u.pack.rect,c.x,c.z)>l){f&&f.hide();continue}f||(f=new Gs(this,u),this.islands.set(u.pack.id,f)),f.lastSeen=r,f.update(c,l,a*qu(.6,.95,d),Math.max(.5,e-(performance.now()-h)))}}else for(const c of this.islands.values())c.hide();for(const[c,l]of this.islands)this.hidden?l.lastSeen=Math.max(l.lastSeen,r):r-l.lastSeen>h2*1e3&&(l.dispose(),this.islands.delete(c))}settle(){this.update(0,1/0)}get idle(){if(!this.group.visible)return!0;for(const t of this.islands.values())if(t.active&&!t.idle)return!1;return!0}stampInto(t,e,n){for(const i of this.islands.values())i.stampInto(t,e,n)}alive(t=this.yearNow,e=null,n=null,i=1/0){const o=[];for(const a of this.islands.values())o.push(...a.alive(t,e,n,i));return o}census(t=this.yearNow,e=null,n=null,i=1/0){return Fd(this.alive(t,e,n,i))}stats(){return{show:+this.show.toFixed(2),year:+this.yearNow.toFixed(1),yield:+this.yieldU.uYield.value.toFixed(2),islands:[...this.islands.values()].map(t=>t.stats()),drawn:[...this.islands.values()].reduce((t,e)=>t+e.drawn,0)}}}class Gs extends Dd{constructor(t,e){super(t.app),this.towns=t,this.t=e,this.id=e.pack.id,this.group=new Ne,this.group.name=`towns ${this.id}`,this.group.visible=!1,t.group.add(this.group),this.tiles=new Map,this.ready=!1,this.failed=null,this.active=!1,this.drawn=0,this.pending=0,this.lastSeen=performance.now(),this.times={build:0,tiles:0},this.load().catch(n=>{this.failed=n.message,this.app.warn(`towns ${this.id}: ${n.message} (its settlements are not drawn)`)})}async load(){var x,w,b,y,S,E,T,M,_;const t=performance.now(),e=this.app,n=await this.towns.layers(),i=(x=n.islands)==null?void 0:x[this.id];if(!i)throw new Error("no settlement layer");this.setLayers(n);const o=this.layerFiles(i);if(this.keyframes.length<2||o.some(A=>!A.settlement))throw new Error("the settlement layer lacks a keyframe");const a=A=>Fo(Qn,e.data.abs(`layers/${A}`)),[r,c,l,h,u]=await Promise.all([Promise.all(o.map(A=>a(A.settlement))),o.every(A=>A.value)?Promise.all(o.map(A=>a(A.value))).catch(()=>null):null,Pd(e,n,this.id),((w=e.patches)==null?void 0:w.ready)??[],((b=e.works)==null?void 0:b.exclusion(this.id))??null]);if(this.disposed)return;const f=this.t,{W:d,H:g}=f;for(const A of[...r,...c||[]])if(A.W!==d||A.H!==g)throw new Error(`a layer is ${A.W}×${A.H}, the pack ${d}×${g}`);const v=f.pack.rect;this.rect=v,this.islandRect=v,this.crop={x0:v.x0,z0:v.z0,sx:(v.x1-v.x0)/d,sz:(v.z1-v.z0)/g,w:d,h:g},this.bytes=r.map(A=>A.px),this.values=c?c.map(A=>A.px):null,this.zoning={...l,rect:v},this.places=zd(e,n),this.works=u,this.townTerm(n,this.id,"district"),this.needPatches=(h||[]).some(A=>A.pack===this.id),this.features=[];for(const A of((y=e.districts)==null?void 0:y.list)||[])if(A.parent===this.id)for(const{f:R}of A.rastered){const D=(((E=(S=R.geometry)==null?void 0:S.coordinates)==null?void 0:E[0])||[]).map(I=>e.data.proj.toWorld(I));if(D.length<3)continue;const C=D.map(I=>I[0]),z=D.map(I=>I[1]);this.features.push({ring:D,p:R.properties||{},box:[Math.min(...C),Math.min(...z),Math.max(...C),Math.max(...z)]})}if(await new Promise(A=>setTimeout(A,0)),this.disposed||(this.grounds(),await new Promise(A=>setTimeout(A,0)),this.disposed))return;const m=new Set;for(const A of((M=(T=e.patches)==null?void 0:T.byPack)==null?void 0:M.get(this.id))||[])m.add(A.until);for(const A of h||[])A.pack===this.id&&m.add(A.until);for(const A of this.features){const[R,D]=$o(A.p);Number.isFinite(R)&&m.add(R),Number.isFinite(D)&&m.add(D+1)}for(const A of((_=this.works)==null?void 0:_.breaks)||[])m.add(A);this.years(m);const p=e.timeline.yearAt(0);this.epochYear=[p,...this.edges],this.kits=Rd(No(1820),gl),this.meshes(),this.salt=1+e.world.islandPacks.findIndex(A=>A.id===this.id),this.loadMs=Math.round(performance.now()-t),this.ready=!0}grounds(){const t=this.t,{W:e,H:n}=t,i=this.rect,o=(i.x1-i.x0)*100/e,a=(i.z1-i.z0)*100/n;this.mx=o,this.mz=a;const r=t.heights,c=un(e,n,m=>r[m]<=0,o,a);this.sea=c,this.broad=Nn(Float32Array.from(c,m=>Math.min(m,3e3)),e,n,Math.max(1,Math.round(290/o)),3);const l=Ef(r,e,n,o,a),h=new Uint8Array(e*n);for(let m=0;m<e*n;m++)h[m]=l[m]>=f2&&r[m]>0?1:0;this.streamOn=h,this.toStream=un(e,n,m=>h[m]===1,o,a);const u=Math.ceil((i.x1-i.x0)/Gt),f=Math.ceil((i.z1-i.z0)/Gt);this.tw=u,this.th=f;const d=new Float32Array(u*f),g=this.zoning;for(let m=0;m<n;m++){const p=Math.min(f-1,Math.floor((m+.5)*this.crop.sz/Gt));for(let x=0;x<e;x++){const w=m*e+x;if(r[w]<=0)continue;const b=Math.min(u-1,Math.floor((x+.5)*this.crop.sx/Gt));let y=0;for(const E of this.bytes)y=Math.max(y,E[w]);if(g.zoning){const E=i.x0+(x+.5)*this.crop.sx,T=i.z0+(m+.5)*this.crop.sz;lr[Do(g.zoning,i,E,T)]&&(y=255)}const S=p*u+b;y>d[S]&&(d[S]=y)}}const v=d.slice();for(let m=0;m<f;m++)for(let p=0;p<u;p++)for(let x=-1;x<=1;x++)for(let w=-1;w<=1;w++){const b=p+w,y=m+x;b>=0&&y>=0&&b<u&&y<f&&(v[m*u+p]=Math.max(v[m*u+p],d[y*u+b]-20))}this.most=v,this.ths=new Map}grid(t,e,n){const i=this.crop,o=jt(Math.floor((e-i.x0)/i.sx),0,i.w-1),a=jt(Math.floor((n-i.z0)/i.sz),0,i.h-1);return t[a*i.w+o]}mauka(t,e){const n=e*this.tw+t;let i=this.ths.get(n);if(i!==void 0)return i;const o=this.rect.x0+(t+.5)*Gt,a=this.rect.z0+(e+.5)*Gt,r=this.crop,c=this.broad,l=(m,p)=>c[jt(p,0,r.h-1)*r.w+jt(m,0,r.w-1)],h=Math.round((o-r.x0)/r.sx-.5),u=Math.round((a-r.z0)/r.sz-.5),f=Math.max(2,Math.round(240/this.mx)),d=l(h+f,u)-l(h-f,u),g=l(h,u+f)-l(h,u-f),v=Math.PI/60;return i=Math.hypot(d,g)<.001?Math.PI/2:Math.round(Math.atan2(g,d)/v)*v,this.ths.set(n,i),i}owns(t,e){const n=o=>Math.min(t-o.x0,o.x1-t,e-o.z0,o.z1-e),i=n(this.rect);for(const o of this.app.world.islandPacks)if(o.id!==this.id&&n(o.rect)>i)return!1;return i>0}weight(t,e){const n=this.t,i=this.crop.sx,o=this.crop.sz,a=Math.hypot((n.metresAt(t+i,e)-n.metresAt(t-i,e))/(2*this.mx),(n.metresAt(t,e+o)-n.metresAt(t,e-o))/(2*this.mz));return(.55+.8*Math.max(Math.exp(-this.grid(this.sea,t,e)/700),Math.exp(-this.grid(this.toStream,t,e)/160)))*(1-.6*ce(.08,.35,a))}allows(t,e,n){const{x:i,z:o,ax:a,az:r,a:c}=t,l=this.epochYear[n],h=this.t,u=Math.cos(c),f=-Math.sin(c),d=[u,f],g=[-f,u];let v=1/0,m=-1/0,p=-1/0;if(this.dep=!1,this.works){const y=this.works.test(i,o,a,r,c,l);if(y&&(this.dep=!0),y===2)return null}const x=this.patchBoxes,w=this.featBox,b=this.patchBox;for(let y=0;y<13;y++){const S=y===0?0:y<5?[-1,1,1,-1][y-1]:y<9?[0,1,0,-1][y-5]:[-1,1,1,-1][y-9],E=y===0?0:y<5?[-1,-1,1,1][y-1]:y<9?[-1,0,1,0][y-5]:[-1,-1,1,1][y-9],T=y>=9?1.25:1,M=i+(d[0]*S*a+g[0]*E*r)*T,_=o+(d[1]*S*a+g[1]*E*r)*T;if(M>=w[0]&&_>=w[1]&&M<=w[2]&&_<=w[3])for(const D of this.features){const C=D.box;if(!(M<C[0]||_<C[1]||M>C[2]||_>C[3])&&o_(D.ring,M,_)&&(this.dep=!0,jo(D.p,l)))return null}if(y>=9)continue;if(this.grid(this.streamOn,M,_))return null;const A=h.metresAt(M,_);let R=A;if(M>=b[0]&&_>=b[1]&&M<=b[2]&&_<=b[3])for(const D of x){const C=D.box;if(!(M<C[0]||_<C[1]||M>C[2]||_>C[3])&&!(this.app.patches.maskAt(D.crop,(M-C[0])/(C[2]-C[0]),(_-C[1])/(C[3]-C[1]))<=0)){this.dep=!0,R=kd(this.app,h,M,_,l);break}}if(R<.6)return null;v=Math.min(v,A),m=Math.max(m,A),p=Math.max(p,R)}return m-v>e?null:p}buildTile(t,e){var E;const n=performance.now(),i=this.rect,o=i.x0+t*Gt,a=i.z0+e*Gt,r={ti:t,tj:e,n:0,x0:o,z0:a},c=`${t},${e}`;if(this.tiles.set(c,r),this.most[e*this.tw+t]<1)return r.empty=!0,r;const l=this.mauka(t,e),h=(T,M)=>T<0||M<0||T>=this.tw||M>=this.th?NaN:this.mauka(T,M),u=[h(t-1,e)!==l,h(t+1,e)!==l,h(t,e-1)!==l,h(t,e+1)!==l],f=this.salt*1000003+e*4099+t|0,d=new Float32Array(this.keyframes.length),g=new Float32Array(this.keyframes.length),v=this.zoning,m=(T,M)=>this.owns(T,M)&&this.t.metresAt(T,M)>.3,p=[];for(const T of this.tileLots(o,a,l,f,u,m)){this.bytesAt(T.x,T.z,d);let M=0;for(const C of d)M=Math.max(M,C);T.zone=Do(v.zoning,v.rect,T.x,T.z),T.lud=Do(v.lud,v.rect,T.x,T.z),T.zoned=!!v.zoning;const _=lr[T.zone];_&&(M=Math.max(M,255*Math.log(1+_/this.d0)/this.L+5));const A=this.fillMax(this.people(M));if(T.rank>=A*1.5&&!(T.anchor&&T.rankY<A*1.5)||(T.w=this.weight(T.x,T.z)*(.85+.3*hr(T.x/2.3,T.z/2.3,73)),T.rank>=A*T.w&&!(T.anchor&&T.rankY<A*T.w)))continue;T.b=Float32Array.from(d),this.values&&(T.vb=Float32Array.from(this.sample(this.values,T.x,T.z,g,0)));const R=Math.exp(-this.grid(this.sea,T.x,T.z)/600),D=Id(this.places,T.x,T.z,R);T.coast=R,T.harbour=D.harbour,T.centre=D.centre,p.push(T)}const x=[],w=(T,M,_)=>this.allows(T,M,_),b=()=>1,y=T=>x.push(T);for(const T of p)this.scatterLot(T,w,b,y);const S=x.length;if(r.n=S,r.lots=p.length,S){const T=No(f),M=Int32Array.from({length:S},(_,A)=>A);for(let _=S-1;_>0;_--){const A=Math.floor(T()*(_+1)),R=M[_];M[_]=M[A],M[A]=R}r.order=M,r.pos=new Float32Array(S*4),r.scale=new Float32Array(S*3),r.spans=new Float32Array(S*4),r.cols=new Float32Array(S*3),r.vOf=new Uint16Array(S),r.kind=new Uint8Array(S),r.site=new Int32Array(S),x.forEach((_,A)=>{r.pos.set([_.x,_.y,_.z,_.a],A*4),r.scale.set([_.sh,_.sv,_.stretch],A*3),r.spans.set(_.span,A*4),r.cols.set(_.colour,A*3),r.vOf[A]=this.byKey.get(_.kind*16+_.variant),r.kind[A]=_.kind,r.site[A]=_.site})}for(const T of((E=this.app.districts)==null?void 0:E.list)||[])ja(T.rect,o+Gt/2,a+Gt/2)<Gt&&this.towns.version++;return this.times.tiles++,this.times.build+=performance.now()-n,r}update(t,e,n,i){var p,x,w,b;if(this.active=!0,this.show=n,!this.ready){this.pending=1;return}if(this.needPatches&&!((p=this.app.patches)!=null&&p.loaded)){this.pending=1;return}this.patchBoxes||(this.patchBoxes=((w=(x=this.app.patches)==null?void 0:x.byPack)==null?void 0:w.get(this.id))||[],this.patchBox=this.patchBoxes.reduce((y,S)=>[Math.min(y[0],S.box[0]),Math.min(y[1],S.box[1]),Math.max(y[2],S.box[2]),Math.max(y[3],S.box[3])],[1/0,1/0,-1/0,-1/0]),this.featBox=this.features.reduce((y,S)=>[Math.min(y[0],S.box[0]),Math.min(y[1],S.box[1]),Math.max(y[2],S.box[2]),Math.max(y[3],S.box[3])],[1/0,1/0,-1/0,-1/0]));const o=this.rect,a=jt(Math.floor((t.x-e-o.x0)/Gt),0,this.tw-1),r=jt(Math.floor((t.x+e-o.x0)/Gt),0,this.tw-1),c=jt(Math.floor((t.z-e-o.z0)/Gt),0,this.th-1),l=jt(Math.floor((t.z+e-o.z0)/Gt),0,this.th-1),h=[],u=this.towns.yieldU,f=u.uYieldRect.value,d=u.uYield.value>=.999;for(let y=c;y<=l;y++)for(let S=a;S<=r;S++){if(this.tiles.has(`${S},${y}`))continue;const E=o.x0+(S+.5)*Gt,T=o.z0+(y+.5)*Gt;if(d&&E-Gt/2>f.x&&T-Gt/2>f.y&&E+Gt/2<f.z&&T+Gt/2<f.w)continue;const M=Math.hypot(E-t.x,T-t.z);M>e+Gt||h.push([M,S,y])}h.sort((y,S)=>y[0]-S[0]);const g=performance.now();let v=0;for(const[,y,S]of h){if(v&&performance.now()-g>i)break;this.buildTile(y,S),v++}this.pending=h.length-v;const m=e*u2+Gt;for(const[y,S]of this.tiles){const E=S.x0+Gt/2,T=S.z0+Gt/2;if(!(Math.hypot(E-t.x,T-t.z)<=m)&&(this.tiles.delete(y),S.n))for(const M of((b=this.app.districts)==null?void 0:b.list)||[])ja(M.rect,E,T)<Gt&&this.towns.version++}this.group.visible=n>.001,this.group.visible&&(this.material.uniforms.uShow.value=n,this.material.uniforms.uYearNow.value=this.towns.yearNow,this.material.uniforms.uFadeNear.value=e*.75,this.material.uniforms.uFadeFar.value=e,this.refresh(this.app.camera,e,this.t.pack.data.hi*this.app.world.uniforms.uVert.value+3,v>0))}get idle(){return!!(this.ready||this.failed)&&!this.pending}hide(){this.active=!1,this.group.visible=!1,this.drawn=0,this.key=""}meshes(){this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new te(0,0,0,0))},uShadeS:{value:this.t.shadow.texture},uShadeRect:{value:this.t.rect},uYearNow:{value:this.towns.yearNow},...this.towns.yieldU},this.material=Qs(this.app.shared,this.own,{fade:[50,70],grow:!0,yield:!0}),this.variants=[],this.byKey=new Map;for(const t of Zn)this.kits[t].forEach((e,n)=>{this.byKey.set(Dt[t]*16+n,this.variants.length),this.variants.push({name:t,v:n,kit:e,cap:0,mesh:null})});this.frustum=new Bi,this.pv=new ie,this.box=new Sn,this.m4=new ie,this.q=new _i,this.up=new W(0,1,0),this.v3=new W,this.s3=new W,this.key="",this.yearDrawn=NaN}room(t,e){if(t.cap>=e&&t.mesh)return;const n=Math.min(ju,Math.max(64,t.cap*2,e));t.mesh&&(this.group.remove(t.mesh),t.mesh.dispose());const i=t.kit.geometry,o=new _r(i,this.material,n);o.name=`${t.name}-${t.v}`,o.count=0,o.frustumCulled=!1,o.instanceMatrix.setUsage(bn),o.instanceColor=new ue(new Float32Array(n*3),3),o.instanceColor.setUsage(bn);const a=new ue(new Float32Array(n*4),4);a.setUsage(bn);const r=new ue(new Float32Array(n),1);r.setUsage(bn),i.setAttribute("aSpan",a),i.setAttribute("aStretch",r),Object.assign(t,{mesh:o,cap:n,aSpan:a,aStretch:r}),this.group.add(o)}static aliveNear(t,e,n){const i=t.spans;return i[e*4]<n+1&&i[e*4+3]>n-1}refresh(t,e,n,i){const o=this.towns.yearNow,a=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const r=e*.7,c=[],l=this.towns.yieldU,h=l.uYieldRect.value,u=l.uYield.value>=.999;let f="";for(const S of this.tiles.values()){if(!S.n)continue;this.box.min.set(S.x0,-.5,S.z0),this.box.max.set(S.x0+Gt,n,S.z0+Gt);const E=this.box.distanceToPoint(a);if(E>e||!this.frustum.intersectsBox(this.box)||u&&S.x0>h.x&&S.z0>h.y&&S.x0+Gt<h.z&&S.z0+Gt<h.w)continue;const T=E<r?1:r/E;c.push([S,Math.round(T*20)]),f+=`${S.ti},${S.tj}:${c[c.length-1][1]};`}const d=this.app.districts,g=!!(d!=null&&d.on);if(f+=`${u?1:0}${g?1:0}`,!i&&f===this.key&&Math.abs(o-this.yearDrawn)<.5)return;this.key=f,this.yearDrawn=o;let v=0;const m=[];for(const[S,E]of c){let T=0;for(let M=0;M<S.n;M++)Gs.aliveNear(S,M,o)&&T++;m.push(T),v+=Math.ceil(T*E/20)}const p=Math.min(1,ju/Math.max(1,v)),x=new Int32Array(this.variants.length),w=[];c.forEach(([S,E],T)=>{const M=Math.ceil(m[T]*E*p/20);let _=0;for(let A=0;A<S.n&&_<M;A++){const R=S.order[A];Gs.aliveNear(S,R,o)&&(u&&S.pos[R*4]>h.x&&S.pos[R*4+2]>h.y&&S.pos[R*4]<h.z&&S.pos[R*4+2]<h.w||(w.push(S,R),x[S.vOf[R]]++,_++))}}),this.variants.forEach((S,E)=>{x[E]&&this.room(S,x[E]),S.c=0});const b=g?d.cur.d.rect:null,y=this.app.world;for(let S=0;S<w.length;S+=2){const E=w[S],T=w[S+1],M=this.variants[E.vOf[T]];if(M.c>=M.cap)continue;const _=M.c++;let A=E.pos[T*4+1];const R=E.pos[T*4],D=E.pos[T*4+2];if(b&&R>b.x0&&D>b.z0&&R<b.x1&&D<b.z1){const C=M.kit,z=E.scale[T*3];let I=-1/0;for(const[O,N]of[[0,0],[-1,-1],[1,-1],[1,1],[-1,1]])I=Math.max(I,y.metresAt(R+O*C.hx*z,D+N*C.hz*z));A=Math.max(A,Kn(I)+ml)}this.q.setFromAxisAngle(this.up,E.pos[T*4+3]),this.v3.set(R,A,D),this.s3.set(E.scale[T*3],E.scale[T*3+1],E.scale[T*3]),this.m4.compose(this.v3,this.q,this.s3),this.m4.toArray(M.mesh.instanceMatrix.array,_*16),M.mesh.instanceColor.array.set(E.cols.subarray(T*3,T*3+3),_*3),M.aSpan.array.set(E.spans.subarray(T*4,T*4+4),_*4),M.aStretch.array[_]=E.scale[T*3+2]}this.drawn=0;for(const S of this.variants)S.mesh&&(S.mesh.count=S.c,S.mesh.visible=S.c>0,S.mesh.instanceMatrix.needsUpdate=!0,S.mesh.instanceColor.needsUpdate=!0,S.aSpan.needsUpdate=!0,S.aStretch.needsUpdate=!0,this.drawn+=S.c)}static weightAt(t,e,n){const i=t.spans;return ce(i[e*4],i[e*4+1],n)*(1-ce(i[e*4+2],i[e*4+3],n))}stampInto(t,e,n){if(this.ready){for(const i of this.tiles.values())if(!(!i.n||i.x0>t.x1||i.z0>t.z1||i.x0+Gt<t.x0||i.z0+Gt<t.z0))for(let o=0;o<i.n;o++){const a=i.pos[o*4],r=i.pos[o*4+2];if(Math.min(a-t.x0,t.x1-a,r-t.z0,t.z1-r)>os)continue;const c=Gs.weightAt(i,o,e);if(c<.02)continue;const l=this.variants[i.vOf[o]].kit,h=i.scale[o*3];n(a,r,i.pos[o*4+3],l.hx*h*.95,l.hz*h*.95,Math.round(255*c))}}}alive(t,e=null,n=null,i=1/0){const o=[];if(!this.ready)return o;for(const a of this.tiles.values())if(a.n&&!(e!==null&&ja({x0:a.x0,z0:a.z0,x1:a.x0+Gt,z1:a.z0+Gt},e,n)>i))for(let r=0;r<a.n;r++){if(Gs.weightAt(a,r,t)<.999)continue;const c=a.pos[r*4],l=a.pos[r*4+2];if(e!==null&&Math.hypot(c-e,l-n)>i)continue;const h=this.variants[a.vOf[r]],u=a.scale[r*3];o.push({island:this.id,site:a.site[r]+a.ti*1e5+a.tj*1e9,kind:h.name,variant:h.v,x:c,z:l,a:a.pos[r*4+3],ax:h.kit.hx*u,az:h.kit.hz*u,box:h.kit.box.map(f=>f*u),y:a.pos[r*4+1],height:h.kit.top*a.scale[r*3+1]})}return o}stats(){var o;let t=0,e=0,n=0,i=0;for(const a of this.tiles.values()){t+=a.n,e+=a.lots||0,a.empty||i++;for(const r of["order","pos","scale","spans","cols","vOf","kind","site"])n+=((o=a[r])==null?void 0:o.byteLength)||0}if(this.ready)for(const a of[this.sea,this.broad,this.toStream,this.streamOn,this.most,...this.bytes])n+=a.byteLength;return{island:this.id,ready:this.ready,failed:this.failed,tiles:this.tiles.size,worked:i,pending:this.pending,lots:e,instances:t,drawn:this.drawn,triangles:(this.variants||[]).reduce((a,r)=>a+(r.mesh?r.mesh.count*r.kit.tris:0),0),zoning:this.zoning?{zoning:this.zoning.zoning?`${this.zoning.zoning.W}×${this.zoning.zoning.H}`:null,lud:this.zoning.lud?`${this.zoning.lud.W}×${this.zoning.lud.H}`:null}:null,value:this.values?"mask":"modelled",towns:this.townTerms??null,loadMs:this.loadMs??null,buildMs:Math.round(this.times.build),msPerTile:this.times.tiles?+(this.times.build/this.times.tiles).toFixed(2):null,cpuMB:+(n/1048576).toFixed(1)}}dispose(){var t,e;this.disposed=!0,this.towns.group.remove(this.group);for(const n of this.variants||[])(t=n.mesh)==null||t.dispose(),n.kit.geometry.dispose();(e=this.material)==null||e.dispose(),this.tiles.clear()}}const p2={triangulate:function(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let o=$d(s,0,i,e,!0);const a=[];if(!o||o.next===o.prev)return a;let r,c,l,h,u,f,d;if(n&&(o=w2(s,t,o,e)),s.length>80*e){r=l=s[0],c=h=s[1];for(let g=e;g<i;g+=e)u=s[g],f=s[g+1],u<r&&(r=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-r,h-c),d=d!==0?32767/d:0}return Bo(o,a,e,r,c,d,0),a}};function $d(s,t,e,n,i){let o,a;if(i===L2(s,t,e,n)>0)for(o=t;o<e;o+=n)a=Yu(o,s[o],s[o+1],a);else for(o=e-n;o>=t;o-=n)a=Yu(o,s[o],s[o+1],a);return a&&Sr(a,a.next)&&(Go(a),a=a.next),a}function hs(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Sr(e,e.next)||Me(e.prev,e,e.next)===0)){if(Go(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Bo(s,t,e,n,i,o,a){if(!s)return;!a&&o&&S2(s,n,i,o);let r=s,c,l;for(;s.prev!==s.next;){if(c=s.prev,l=s.next,o?g2(s,n,i,o):m2(s)){t.push(c.i/e|0),t.push(s.i/e|0),t.push(l.i/e|0),Go(s),s=l.next,r=l.next;continue}if(s=l,s===r){a?a===1?(s=v2(hs(s),t,e),Bo(s,t,e,n,i,o,2)):a===2&&x2(s,t,e,n,i,o):Bo(hs(s),t,e,n,i,o,1);break}}}function m2(s){const t=s.prev,e=s,n=s.next;if(Me(t,e,n)>=0)return!1;const i=t.x,o=e.x,a=n.x,r=t.y,c=e.y,l=n.y,h=i<o?i<a?i:a:o<a?o:a,u=r<c?r<l?r:l:c<l?c:l,f=i>o?i>a?i:a:o>a?o:a,d=r>c?r>l?r:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&Hs(i,r,o,c,a,l,g.x,g.y)&&Me(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function g2(s,t,e,n){const i=s.prev,o=s,a=s.next;if(Me(i,o,a)>=0)return!1;const r=i.x,c=o.x,l=a.x,h=i.y,u=o.y,f=a.y,d=r<c?r<l?r:l:c<l?c:l,g=h<u?h<f?h:f:u<f?u:f,v=r>c?r>l?r:l:c>l?c:l,m=h>u?h>f?h:f:u>f?u:f,p=Vc(d,g,t,e,n),x=Vc(v,m,t,e,n);let w=s.prevZ,b=s.nextZ;for(;w&&w.z>=p&&b&&b.z<=x;){if(w.x>=d&&w.x<=v&&w.y>=g&&w.y<=m&&w!==i&&w!==a&&Hs(r,h,c,u,l,f,w.x,w.y)&&Me(w.prev,w,w.next)>=0||(w=w.prevZ,b.x>=d&&b.x<=v&&b.y>=g&&b.y<=m&&b!==i&&b!==a&&Hs(r,h,c,u,l,f,b.x,b.y)&&Me(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;w&&w.z>=p;){if(w.x>=d&&w.x<=v&&w.y>=g&&w.y<=m&&w!==i&&w!==a&&Hs(r,h,c,u,l,f,w.x,w.y)&&Me(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;b&&b.z<=x;){if(b.x>=d&&b.x<=v&&b.y>=g&&b.y<=m&&b!==i&&b!==a&&Hs(r,h,c,u,l,f,b.x,b.y)&&Me(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function v2(s,t,e){let n=s;do{const i=n.prev,o=n.next.next;!Sr(i,o)&&jd(i,n,n.next,o)&&Wo(i,o)&&Wo(o,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),Go(n),Go(n.next),n=s=o),n=n.next}while(n!==s);return hs(n)}function x2(s,t,e,n,i,o){let a=s;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&T2(a,r)){let c=Xd(a,r);a=hs(a,a.next),c=hs(c,c.next),Bo(a,t,e,n,i,o,0),Bo(c,t,e,n,i,o,0);return}r=r.next}a=a.next}while(a!==s)}function w2(s,t,e,n){const i=[];let o,a,r,c,l;for(o=0,a=t.length;o<a;o++)r=t[o]*n,c=o<a-1?t[o+1]*n:s.length,l=$d(s,r,c,n,!1),l===l.next&&(l.steiner=!0),i.push(A2(l));for(i.sort(y2),o=0;o<i.length;o++)e=M2(i[o],e);return e}function y2(s,t){return s.x-t.x}function M2(s,t){const e=_2(s,t);if(!e)return t;const n=Xd(e,s);return hs(n,n.next),hs(e,e.next)}function _2(s,t){let e=t,n=-1/0,i;const o=s.x,a=s.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const f=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=o&&f>n&&(n=f,i=e.x<e.next.x?e:e.next,f===o))return i}e=e.next}while(e!==t);if(!i)return null;const r=i,c=i.x,l=i.y;let h=1/0,u;e=i;do o>=e.x&&e.x>=c&&o!==e.x&&Hs(a<l?o:n,a,c,l,a<l?n:o,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(o-e.x),Wo(e,s)&&(u<h||u===h&&(e.x>i.x||e.x===i.x&&b2(i,e)))&&(i=e,h=u)),e=e.next;while(e!==r);return i}function b2(s,t){return Me(s.prev,s,t.prev)<0&&Me(t.next,s,s.next)<0}function S2(s,t,e,n){let i=s;do i.z===0&&(i.z=Vc(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,E2(i)}function E2(s){let t,e,n,i,o,a,r,c,l=1;do{for(e=s,s=null,o=null,a=0;e;){for(a++,n=e,r=0,t=0;t<l&&(r++,n=n.nextZ,!!n);t++);for(c=l;r>0||c>0&&n;)r!==0&&(c===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,r--):(i=n,n=n.nextZ,c--),o?o.nextZ=i:s=i,i.prevZ=o,o=i;e=n}o.nextZ=null,l*=2}while(a>1);return s}function Vc(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function A2(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Hs(s,t,e,n,i,o,a,r){return(i-a)*(t-r)>=(s-a)*(o-r)&&(s-a)*(n-r)>=(e-a)*(t-r)&&(e-a)*(o-r)>=(i-a)*(n-r)}function T2(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!C2(s,t)&&(Wo(s,t)&&Wo(t,s)&&R2(s,t)&&(Me(s.prev,s,t.prev)||Me(s,t.prev,t))||Sr(s,t)&&Me(s.prev,s,s.next)>0&&Me(t.prev,t,t.next)>0)}function Me(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Sr(s,t){return s.x===t.x&&s.y===t.y}function jd(s,t,e,n){const i=Ua(Me(s,t,e)),o=Ua(Me(s,t,n)),a=Ua(Me(e,n,s)),r=Ua(Me(e,n,t));return!!(i!==o&&a!==r||i===0&&Ia(s,e,t)||o===0&&Ia(s,n,t)||a===0&&Ia(e,s,n)||r===0&&Ia(e,t,n))}function Ia(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Ua(s){return s>0?1:s<0?-1:0}function C2(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&jd(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Wo(s,t){return Me(s.prev,s,s.next)<0?Me(s,t,s.next)>=0&&Me(s,s.prev,t)>=0:Me(s,t,s.prev)<0||Me(s,s.next,t)<0}function R2(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,o=(s.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&i<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Xd(s,t){const e=new $c(s.i,s.x,s.y),n=new $c(t.i,t.x,t.y),i=s.next,o=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function Yu(s,t,e,n){const i=new $c(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Go(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function $c(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function L2(s,t,e,n){let i=0;for(let o=t,a=e-n;o<e;o+=n)i+=(s[a]-s[o])*(s[o+1]+s[a+1]),a=o;return i}const P2=1.5,D2=1.5,k2=.25,z2=1,I2={military:["land","runway","pier","block","range"],airport:["field","runway","block"],highway:["road","tunnel"],rail:["line"],harbour:["breakwater","pier"]},U2={interstate:24,state:12,county:8};function Ku(s,t){const e=Number(s.lanes);return Number(s.width)||(e>0?e*3.6+2:0)||U2[s.class]||t}const Fa={runway:45,pier:15,breakwater:12,road:10,line:3.5,tunnel:12},F2={land:0,range:1,field:2},jc=["runway","road","stone","rail"],Zu={runway:"runway",road:"road",pier:"stone",breakwater:"stone",line:"rail"},Vs=1e5;function N2(s){const t=Number.isFinite(s==null?void 0:s.from)?s.from:null,e=Number.isFinite(s==null?void 0:s.to)?s.to:null,n=pr(s);let i,o;return n?(i=Math.min(n[0],t??n[0]),o=Math.max(n[1],i+1)):t!==null?(i=t-1,o=t):(i=-Vs,o=-Vs+1),e!==null?[i,o,e,e+1]:[i,o,Vs,Vs+1]}const Ju=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};function dr(s,t){return Ju(s[0],s[1],t)*(1-Ju(s[2],s[3],t))}function pr(s){return Array.isArray(s==null?void 0:s.built)&&s.built.length===2&&s.built.every(Number.isFinite)?[...s.built].sort((t,e)=>t-e):null}function O2(s,t){const e=Number.isFinite(s==null?void 0:s.from)?s.from:null,n=pr(s)?Math.floor(t[0]):e!==null?e:-Vs,i=Number.isFinite(s==null?void 0:s.to)?s.to+1:1/0;return[n,i]}function Qu(s){return s?s.type==="Polygon"?[s.coordinates]:s.type==="MultiPolygon"?s.coordinates:[]:[]}function tf(s){return s?s.type==="LineString"?[s.coordinates]:s.type==="MultiLineString"?s.coordinates:[]:[]}function B2(s){return s?s.type==="Point"?[s.coordinates]:s.type==="MultiPoint"?s.coordinates:[]:[]}function ef(s,t){const e=s.map(n=>t.toWorld(n));if(e.length>1){const n=e[0],i=e[e.length-1];Math.abs(n[0]-i[0])<1e-9&&Math.abs(n[1]-i[1])<1e-9&&e.pop()}return e}function nf(s){let t=0;for(let e=0,n=s.length-1;e<s.length;n=e++)t+=(s[n][0]-s[e][0])*(s[n][1]+s[e][1]);return t/2}function qd(s,t,e){let n=!1;for(const i of s){const o=i.length/2;for(let a=0,r=o-1;a<o;r=a++){const c=i[a*2],l=i[a*2+1],h=i[r*2],u=i[r*2+1];l>e!=u>e&&t<(h-c)*(e-l)/(u-l)+c&&(n=!n)}}return n}function Na(s,t,e,n){const i=[],o=s.length;for(let a=0;a<o;a++){const r=s[a],c=s[(a+1)%o],l=(r[t]-e)*n,h=(c[t]-e)*n;if(l>=0&&i.push(r),l>=0!=h>=0){const u=l/(l-h);i.push([r[0]+(c[0]-r[0])*u,r[1]+(c[1]-r[1])*u])}}return i}function W2(s,t=P2){const e=[],n=[];s.forEach((l,h)=>{h&&n.push(e.length/2);for(const[u,f]of l)e.push(u,f)});const i=p2.triangulate(e,n,2),o=[],a=[],r=new Map,c=(l,h)=>{const u=Math.round(l*2e3)*1e8+Math.round(h*2e3);let f=r.get(u);return f===void 0&&(f=o.length/2,r.set(u,f),o.push(l,h)),f};for(let l=0;l<i.length;l+=3){const h=[i[l],i[l+1],i[l+2]].map(w=>[e[w*2],e[w*2+1]]),u=Math.min(h[0][0],h[1][0],h[2][0]),f=Math.max(h[0][0],h[1][0],h[2][0]),d=Math.min(h[0][1],h[1][1],h[2][1]),g=Math.max(h[0][1],h[1][1],h[2][1]),v=Math.floor(u/t),m=Math.floor(f/t),p=Math.floor(d/t),x=Math.floor(g/t);for(let w=p;w<=x;w++)for(let b=v;b<=m;b++){let y=h;if(v!==m&&(y=Na(Na(y,0,b*t,1),0,(b+1)*t,-1)),y.length>=3&&p!==x&&(y=Na(Na(y,1,w*t,1),1,(w+1)*t,-1)),y.length<3)continue;const S=y.map(([E,T])=>c(E,T));for(let E=1;E+1<S.length;E++){const T=S[0],M=S[E],_=S[E+1];if(T===M||M===_||T===_)continue;const A=(o[M*2]-o[T*2])*(o[_*2+1]-o[T*2+1])-(o[_*2]-o[T*2])*(o[M*2+1]-o[T*2+1]);Math.abs(A)<1e-9||a.push(T,M,_)}}}return{pos:o,index:a,tri:i,flat:e}}function G2(s,t){const e=[s[0]];for(let n=0;n+1<s.length;n++){const[i,o]=s[n],[a,r]=s[n+1],c=Math.max(1,Math.ceil(Math.hypot(a-i,r-o)/t));for(let l=1;l<=c;l++)e.push([i+(a-i)*l/c,o+(r-o)*l/c])}return e}function sf(s,t,e,n,i,o){const a=i-e,r=o-n,c=a*a+r*r,l=c>0?Math.max(0,Math.min(1,((s-e)*a+(t-n)*r)/c)):0;return Math.hypot(s-e-a*l,t-n-r*l)}function H2(s){let t=0,e=0;for(const[g,v]of s)t+=g/s.length,e+=v/s.length;let n=0,i=0,o=0;for(const[g,v]of s)n+=(g-t)**2,i+=(v-e)**2,o+=(g-t)*(v-e);const a=.5*Math.atan2(2*o,n-i),r=[Math.cos(a),Math.sin(a)];let c=1/0,l=-1/0,h=1/0,u=-1/0;for(const[g,v]of s){const m=(g-t)*r[0]+(v-e)*r[1],p=-(g-t)*r[1]+(v-e)*r[0];c=Math.min(c,m),l=Math.max(l,m),h=Math.min(h,p),u=Math.max(u,p)}const f=(c+l)/2,d=(h+u)/2;return{x:t+f*r[0]-d*r[1],z:e+f*r[1]+d*r[0],dir:a,L:l-c,W:u-h}}function V2(s,t=0){let e=s*374761393+t*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function of(){return{seg:[],info:[],end:[],span:[],grow:[],n:0}}function af(s,t,e,n,i,o){let a=0;for(let c=0;c+1<t.length;c++)a+=Math.hypot(t[c+1][0]-t[c][0],t[c+1][1]-t[c][1]);let r=0;for(let c=0;c+1<t.length;c++){const[l,h]=t[c],[u,f]=t[c+1],d=Math.hypot(u-l,f-h);d<1e-6||(o((l+u)/2,(h+f)/2)||(s.seg.push(l,h,u,f),s.info.push(e,e,r,r+d),s.end.push(a),s.span.push(...n),s.grow.push(i?1:0),s.n++),r+=d)}return a}function $2(s,t){const e=[s[0]];let n=0;for(let i=1;i<s.length;i++)n+=Math.hypot(s[i][0]-s[i-1][0],s[i][1]-s[i-1][1]),(n>=t*.9||i===s.length-1)&&(e.push(s[i]),n=0);return e}function j2(s,{lat0:t=20.5,lon0:e=-157.5}={}){var b;const n=Date.now(),i=new yf({lat0:t,lon0:e}),o=[],a={pos:[],span:[],tone:[],index:[]},r={seg:[],s:[],span:[]},c=Object.fromEntries(jc.map(y=>[y,{fine:of(),coarse:of(),length:0}])),l=[],h=[],u={polys:[],lines:[]},f={},d=((s==null?void 0:s.features)||[]).filter(y=>(y==null?void 0:y.properties)&&y.geometry),g=[];for(const y of d){const S=y.properties;if(S.part==="tunnel")for(const E of tf(y.geometry)){const T=E.map(M=>i.toWorld(M));g.push({group:S.group??null,pts:T,hw:Ku(S,Fa.tunnel)/200+.05})}}const v=(y,S,E,T)=>{for(const M of g){if(M.group!==y&&M.group!==null&&y!==null)continue;const _=M.pts.length;for(let A=0;A+1<_;A++){const[R,D]=M.pts[A],[C,z]=M.pts[A+1],I=C-R,O=z-D,N=((S-R)*I+(E-D)*O)/Math.max(1e-12,I*I+O*O);if(!(A===0&&N<0||A===_-2&&N>1)&&sf(S,E,R,D,C,z)<Math.max(M.hw,T))return!0}}return!1},m=new Map;for(const y of d){const S=y.properties,E=String(S.kind||""),T=String(S.part||"");if(!((b=I2[E])!=null&&b.includes(T)))continue;f[E]=(f[E]||0)+1;const M=N2(S),[_,A]=O2(S,M),R={i:o.length,id:S.id??null,kind:E,part:T,group:S.group??null,name:S.name??null,owner:S.owner??null,from:S.from??null,to:S.to??null,built:S.built??null,span:M,box:[1/0,1/0,-1/0,-1/0],rep:null,size:0},D=(C,z,I=C,O=z)=>{const N=R.box;N[0]=Math.min(N[0],C),N[1]=Math.min(N[1],z),N[2]=Math.max(N[2],I),N[3]=Math.max(N[3],O)};if(T==="land"||T==="range"||T==="field"){let C=null;for(const z of Qu(y.geometry)){const I=z.map(J=>ef(J,i)).filter(J=>J.length>=3);if(!I.length)continue;const O=Math.abs(nf(I[0]))-I.slice(1).reduce((J,ot)=>J+Math.abs(nf(ot)),0),N=W2(I),j=a.pos.length/2;for(let J=0;J<N.pos.length;J+=2)a.pos.push(N.pos[J],N.pos[J+1]),a.span.push(...M),a.tone.push(F2[T]);for(const J of N.index)a.index.push(j+J);const H=I.map(J=>Float32Array.from(J.flat()));for(const J of I)for(const[ot,Y]of J)D(ot,Y);if(T==="land")for(const J of I){let ot=0;for(let Y=0;Y<J.length;Y++){const[nt,ct]=J[Y],[mt,St]=J[(Y+1)%J.length],Tt=Math.hypot(mt-nt,St-ct);if(Tt<1e-6)continue;const Rt=Math.max(1,Math.ceil(Tt/D2));for(let yt=0;yt<Rt;yt++)r.seg.push(nt+(mt-nt)*yt/Rt,ct+(St-ct)*yt/Rt,nt+(mt-nt)*(yt+1)/Rt,ct+(St-ct)*(yt+1)/Rt),r.s.push(ot+Tt*yt/Rt,ot+Tt*(yt+1)/Rt),r.span.push(...M);ot+=Tt}}u.polys.push({rings:H,box:yc(I),start:_,end:A,part:T}),R.size+=O,(!C||O>C.area)&&(C={area:O,rings:H,tes:N})}C&&(R.rep=q2(C),S.name&&T!=="range"&&h.push({name:S.name,alt:S.alt??null,kind:T,x:R.rep[0],z:R.rep[1],span:M,size:R.size,i:R.i}))}else if(Zu[T]){const C=Zu[T],I=(T==="road"?Ku(S,Fa.road):T==="line"?Math.max(3,Number(S.width)||Fa.line):Number(S.width)||Fa[T])/100,O=!!pr(S),N=c[C];let j=null;for(const H of tf(y.geometry)){if(H.length<2)continue;const J=H.map(ct=>i.toWorld(ct)),ot=G2(J,k2),Y=(ct,mt)=>T==="road"&&g.length>0&&v(R.group,ct,mt,I/2),nt=af(N.fine,ot,I,M,O,Y);af(N.coarse,$2(ot,z2),I,M,O,Y),N.length+=nt;for(const[ct,mt]of J)D(ct,mt);R.size+=nt,(!j||nt>j.total)&&(j={total:nt,pts:ot}),T==="runway"&&(m.has(R.group)||m.set(R.group,[]),m.get(R.group).push(J)),u.lines.push({pts:Float32Array.from(J.flat()),hw:I/2+.06,box:yc([J],I/2+.06),start:_,end:A,part:T})}if(j){const H=X2(j.pts,j.total/2);R.rep=H,S.name&&T==="road"&&h.push({name:S.name,alt:S.alt??null,kind:"road",x:H[0],z:H[1],span:M,size:j.total,i:R.i})}}else if(T==="block"){const C=Number.isFinite(S.storeys)?Math.max(1,Math.round(S.storeys)):0,z=(I,O,N,j,H)=>{l.push({x:I,z:O,dir:N,L:j,W:H,storeys:C,span:[...M],group:R.group,i:R.i}),D(I,O),R.rep??(R.rep=[I,O])};for(const I of Qu(y.geometry)){const O=ef(I[0],i);if(O.length<3)continue;const N=H2(O);z(N.x,N.z,N.dir,N.L,N.W),u.polys.push({rings:[Float32Array.from(O.flat())],box:yc([O]),start:_,end:A,part:T})}for(const I of B2(y.geometry)){const[O,N]=i.toWorld(I);z(O,N,null,0,0)}}o.push(R)}for(const y of l){if(y.dir!==null)continue;let S=8;y.dir=0;for(const E of m.get(y.group)||[])for(let T=0;T+1<E.length;T++){const M=sf(y.x,y.z,E[T][0],E[T][1],E[T+1][0],E[T+1][1]);M<S&&(S=M,y.dir=Math.atan2(E[T+1][1]-E[T][1],E[T+1][0]-E[T][0]))}}l.forEach((y,S)=>{if(!pr(o[y.i]))return;const[E,T]=y.span,M=Math.min(1,T-E),_=E+(T-E-M)*V2(S,17);y.span[0]=_,y.span[1]=_+M});const p=new Float32Array(l.length*10);l.forEach((y,S)=>p.set([y.x,y.z,y.dir,y.L,y.W,y.storeys,...y.span],S*10));const x=y=>Float32Array.from(y);return{feats:o,wash:{pos:x(a.pos),span:x(a.span),tone:x(a.tone),index:Uint32Array.from(a.index)},edges:{seg:x(r.seg),s:x(r.s),span:x(r.span)},ribbons:Object.fromEntries(jc.map(y=>{const S=c[y],E=T=>({seg:x(T.seg),info:x(T.info),end:x(T.end),span:x(T.span),grow:x(T.grow),n:T.n});return[y,{fine:E(S.fine),coarse:E(S.coarse),n:S.fine.n,length:S.length}]})),blocks:p,labels:h.sort((y,S)=>S.size-y.size),excl:u,counts:f,ms:Date.now()-n}}function yc(s,t=0){let e=1/0,n=1/0,i=-1/0,o=-1/0;for(const a of s)for(const[r,c]of a)e=Math.min(e,r),n=Math.min(n,c),i=Math.max(i,r),o=Math.max(o,c);return[e-t,n-t,i+t,o+t]}function X2(s,t){let e=0;for(let n=0;n+1<s.length;n++){const i=Math.hypot(s[n+1][0]-s[n][0],s[n+1][1]-s[n][1]);if(e+i>=t&&i>0){const o=(t-e)/i;return[s[n][0]+(s[n+1][0]-s[n][0])*o,s[n][1]+(s[n+1][1]-s[n][1])*o]}e+=i}return s[s.length-1]}function q2({rings:s,tes:t}){const e=s[0];let n=0,i=0,o=0;const a=e.length/2;for(let u=0,f=a-1;u<a;f=u++){const d=e[f*2]*e[u*2+1]-e[u*2]*e[f*2+1];n+=d,i+=(e[f*2]+e[u*2])*d,o+=(e[f*2+1]+e[u*2+1])*d}if(Math.abs(n)>1e-9&&(i/=3*n,o/=3*n,qd(s,i,o)))return[i,o];let r=null,c=-1;const{tri:l,flat:h}=t;for(let u=0;u<l.length;u+=3){const[f,d,g]=[l[u],l[u+1],l[u+2]],v=Math.abs((h[d*2]-h[f*2])*(h[g*2+1]-h[f*2+1])-(h[g*2]-h[f*2])*(h[d*2+1]-h[f*2+1]));v>c&&(c=v,r=[(h[f*2]+h[d*2]+h[g*2])/3,(h[f*2+1]+h[d*2+1]+h[g*2+1])/3])}return r||[e[0],e[1]]}const Pi=4;class Y2{constructor(t){this.polys=t.polys,this.lines=t.lines,this.grid=new Map;const e=(n,i)=>{const o=Math.floor(n[0]/Pi),a=Math.floor(n[2]/Pi),r=Math.floor(n[1]/Pi),c=Math.floor(n[3]/Pi);for(let l=r;l<=c;l++)for(let h=o;h<=a;h++){const u=h*100003+l;let f=this.grid.get(u);f||this.grid.set(u,f=[]),f.push(i)}};this.polys.forEach((n,i)=>e(n.box,i)),this.lines.forEach((n,i)=>{const o=n.pts.length/2;for(let a=0;a+1<o;a++){const r=n.pts[a*2],c=n.pts[a*2+1],l=n.pts[a*2+2],h=n.pts[a*2+3];e([Math.min(r,l)-n.hw,Math.min(c,h)-n.hw,Math.max(r,l)+n.hw,Math.max(c,h)+n.hw],-1-(i*65536+a))}}),this.breaks=new Set;for(const n of[...this.polys,...this.lines])Number.isFinite(n.start)&&n.start>-Vs&&this.breaks.add(n.start),Number.isFinite(n.end)&&this.breaks.add(n.end);this.seen=new Int32Array(this.polys.length+this.lines.length),this.stamp=0}get count(){return this.polys.length+this.lines.length}test(t,e,n,i,o,a){const r=Math.hypot(n,i),c=Math.floor((t-r)/Pi),l=Math.floor((t+r)/Pi),h=Math.floor((e-r)/Pi),u=Math.floor((e+r)/Pi),f=Math.cos(o),d=-Math.sin(o),g=f,v=d,m=-d,p=f,x=++this.stamp;let w=0;for(let b=h;b<=u;b++)for(let y=c;y<=l;y++){const S=this.grid.get(y*100003+b);if(S)for(const E of S){let T=!1,M;if(E>=0){if(this.seen[E]===x)continue;this.seen[E]=x,M=this.polys[E];const _=M.box;if(t+r<_[0]||t-r>_[2]||e+r<_[1]||e-r>_[3])continue;for(let A=0;A<9&&!T;A++){const R=A===0?0:A<5?[-1,1,1,-1][A-1]:[0,1,0,-1][A-5],D=A===0?0:A<5?[-1,-1,1,1][A-1]:[-1,0,1,0][A-5];T=qd(M.rings,t+g*R*n+m*D*i,e+v*R*n+p*D*i)}}else{const _=-1-E,A=Math.floor(_/65536),R=_%65536;M=this.lines[A];const D=M.pts;T=K2(D[R*2]-t,D[R*2+1]-e,D[R*2+2]-t,D[R*2+3]-e,g,v,m,p,n+M.hw,i+M.hw)}if(T&&(w=1,a>=M.start&&a<M.end))return 2}}return w}}function K2(s,t,e,n,i,o,a,r,c,l){const h=[s*i+t*o,s*a+t*r],u=[e*i+n*o,e*a+n*r];let f=0,d=1;for(let g=0;g<2;g++){const v=g?l:c,m=u[g]-h[g];for(const[p,x]of[[-m,h[g]+v],[m,v-h[g]]]){if(Math.abs(p)<1e-12){if(x<0)return!1;continue}const w=x/p;if(p<0?f=Math.max(f,w):d=Math.min(d,w),f>d)return!1}}return!0}const rf=30,cf=[150,230],Z2=[160,240],lf=[95,150],J2=280,hf=s=>s<J2?Math.max(60,s*4):0,Mc=.013,Xa=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Q2=s=>.5+.5*Xa(45,140,s),zi=s=>new Bt(s).toArray(),tb=[zi("#a65a49"),zi("#a65a49"),zi("#b9bdbd")],eb=[.42,.26,.4],nb=zi("#e09a7c"),ib={runway:{mode:"paved",colour:zi("#aaa69c"),minPx:1.3,lift:.006,alpha:.95,marks:!0},road:{mode:"paved",colour:zi("#6e6a64"),minPx:1,lift:.005,alpha:.85},stone:{mode:"stone",colour:zi("#958b80"),minPx:1.1,lift:.012,alpha:.95},rail:{mode:"rail",colour:zi("#3b3532"),minPx:.8,lift:.007,alpha:.85}},sb=`
${ze}
${Ve}
${bi}
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
`,ob=`
${ze}
${so}
${Ve}
${us}
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
`,ab=`
${ze}
${Ve}
${bi}
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
`,rb=`
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
`,cb=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);class lb{constructor(t){this.app=t,this.group=new Ne,this.group.name="works",t.scene.add(this.group),this.islands=new Map,this.entries=new Map,this.yearNow=t.timeline.year,this.yearU={value:this.yearNow},this.hidden=!1,this.tint=!1,this.available=null,this.base=t.params.get("works")||null,this.jobs=new Map,this.jobN=0,t.updaters.push(e=>this.update(e))}setBase(t){var e;for(const n of this.islands.values())(e=n.view)==null||e.dispose();this.islands.clear(),this.entries.clear(),this._files=null,this.available=null,this.base=t}url(t){if(!this.base)return this.app.data.abs(t);const e=this.base.endsWith("/")?this.base:`${this.base}/`;return new URL(t,new URL(e,location.href)).href}files(){return this._files??(this._files=(async()=>{const t=this.url("works/manifest.json");try{const e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);const n=await e.json();this.manifest=n;const i=new Map;for(const o of n.files||[])i.set(String(o).replace(/^.*\//,"").replace(/\.geojson$/,""),`works/${o}`);return this.available=i.size>0,i}catch(e){return this.available=!1,this.app.warn(`${t}: ${e.message} (no works)`),new Map}})()),this._files}entry(t){let e=this.entries.get(t);if(!e){e={id:t,out:null,excl:null,used:performance.now(),done:!1,ms:null};const n=performance.now();e.promise=this.files().then(i=>i.has(t)?this.decode(this.url(i.get(t))):null).then(i=>this.entries.get(t)!==e?null:(e.out=i,e.ms=Math.round(performance.now()-n),i)).catch(i=>(this.app.warn(`works ${t}: ${i.message}`),null)).finally(()=>{e.done=!0}),this.entries.set(t,e)}return e.used=performance.now(),e}async exclusion(t){const e=this.entry(t),n=await e.promise;return n?(e.excl??(e.excl=new Y2(n.excl)),e.excl):null}decode(t){const{lat0:e,lon0:n}=this.app.data.proj;if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("works-worker-BP8Q5RS3.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=i=>{const o=this.jobs.get(i.data.job);o&&(this.jobs.delete(i.data.job),i.data.ok?o.resolve(i.data.out):o.reject(new Error(i.data.message)))},this.worker.onerror=i=>{var o;(o=i.preventDefault)==null||o.call(i),this.fallback=!0;for(const[a,r]of this.jobs)this.jobs.delete(a),this.mainThread(r.url).then(r.resolve,r.reject)}}catch{this.fallback=!0}return this.fallback?this.mainThread(t):new Promise((i,o)=>{const a=++this.jobN;this.jobs.set(a,{url:t,resolve:i,reject:o}),this.worker.postMessage({job:a,url:t,lat0:e,lon0:n})})}async mainThread(t){const e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);const{lat0:n,lon0:i}=this.app.data.proj;return j2(await e.json(),{lat0:n,lon0:i})}update(t){var a;const e=this.app,n=e.timeline.year;t>0?(this.yearNow+=(n-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(n-this.yearNow)<.05&&(this.yearNow=n)):this.yearNow=n,this.yearU.value=this.yearNow;const i=e.rig.state.distance,o=performance.now();for(const r of e.world.islands){const c=r.pack.id,l=r.slot>=0?r.k:0;let h=this.islands.get(c);if(l>.02){const u=this.entry(c);h||this.islands.set(c,h={id:c,t:r,view:null,lastSeen:o}),h.lastSeen=o,!h.view&&u.out&&(h.view=new hb(this,r,u.out),this.group.add(h.view.group))}h!=null&&h.view&&h.view.update(this.hidden?0:l,i)}for(const[r,c]of this.islands)o-c.lastSeen<=rf*1e3||((a=c.view)==null||a.dispose(),this.islands.delete(r));for(const[r,c]of this.entries)!this.islands.has(r)&&c.done&&o-c.used>rf*1e3&&this.entries.delete(r)}settle(){this.update(0)}release(){for(const t of this.islands.values())t.lastSeen=-1e9;for(const t of this.entries.values())t.used=-1e9;this.update(0)}feature(t){var e;for(const[n,i]of this.entries){const o=(e=i.out)==null?void 0:e.feats.find(a=>a.id===t);if(o)return{...o,island:n}}return null}weightOf(t,e=this.yearNow){const n=this.feature(t);return n?dr(n.span,e):null}legendRows(){const t=[];for(const e of this.islands.values()){const n=e.view;if(!(!n||n.show<.3||this.hidden)&&n.out.feats.some(i=>i.part==="land"&&dr(i.span,this.yearNow)>.5)){t.push({id:"military",name:"Military land"});break}}return t}stats(){return{available:this.available,base:this.base,year:+this.yearNow.toFixed(2),hidden:this.hidden,entries:[...this.entries.values()].map(t=>{var e,n,i;return{id:t.id,ready:!!t.out,ms:t.ms,decodeMs:((e=t.out)==null?void 0:e.ms)??null,features:((n=t.out)==null?void 0:n.feats.length)??0,counts:((i=t.out)==null?void 0:i.counts)??null}}),islands:[...this.islands.values()].map(t=>({id:t.id,drawn:!!t.view,...t.view?t.view.stats():{}}))}}}class hb{constructor(t,e,n){this.works=t,this.app=t.app,this.t=e,this.out=n,this.id=e.pack.id,this.group=new Ne,this.group.name=`works ${this.id}`,this.show=0;const i=this.app,o=i.shared.uniforms,a=t.yearU;this.geometries=[],this.materials=[];const r=n.wash;if(this.washTris=r.index.length/3,r.index.length){const l=r.pos.length/2,h=new Float32Array(l*3);for(let d=0;d<l;d++)h[d*3]=r.pos[d*2],h[d*3+2]=r.pos[d*2+1];const u=new Je;u.setAttribute("position",new pe(h,3)),u.setAttribute("aSpan",new pe(r.span,4)),u.setAttribute("aTone",new pe(r.tone,1)),u.setIndex(new pe(r.index,1)),this.washU={...o,uCamPos:{value:new W},uYearNow:a,uTone:{value:tb.map(d=>new W(...d))},uToneA:{value:new W(...eb)},uAlpha:{value:0},uHatch:{value:2}};const f=new Ee({vertexShader:sb,fragmentShader:ob,uniforms:this.washU,transparent:!0,depthWrite:!1,side:Ln,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2});this.wash=new me(u,f),this.wash.frustumCulled=!1,this.wash.renderOrder=2,this.group.add(this.wash),this.geometries.push(u),this.materials.push(f)}const c=n.edges;if(this.edgeCount=c.seg.length/4,this.edgeCount){const l=new io;l.setAttribute("position",new pe(cb,3)),l.setIndex([0,2,1,1,2,3]),l.setAttribute("aSeg",new ue(c.seg,4)),l.setAttribute("aS",new ue(c.s,2)),l.setAttribute("aSpan",new ue(c.span,4)),l.instanceCount=this.edgeCount,this.edgeU={...o,uResolution:{value:new Ht(1,1)},uWidth:{value:1.6},uCamPos:{value:new W},uYearNow:a,uColor:{value:new Bt(...nb)},uOpacity:{value:0},uDash:{value:4},uDashMix:{value:0}};const h=new Ee({vertexShader:ab,fragmentShader:rb,uniforms:this.edgeU,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});this.edges=new me(l,h),this.edges.frustumCulled=!1,this.edges.renderOrder=4,this.group.add(this.edges),this.geometries.push(l),this.materials.push(h)}this.ribbons=new pd(i.shared,i.camera),this.batches={};for(const l of jc){const h=n.ribbons[l];if(!(h!=null&&h.n))continue;const u=ib[l],f={mode:u.mode,colour:u.colour,alpha:0,minPx:u.minPx,lift:u.lift,order:6,marks:!!u.marks,year:a};this.batches[l]={fine:this.ribbons.addPacked(h.fine,f),coarse:this.ribbons.addPacked(h.coarse,f),look:u,n:h.n,km:h.length/10}}this.group.add(this.ribbons.group),this.buildBlocks(n.blocks),this.labels=new Ad(i,[],{items:n.labels.map(l=>({...l,cls:`dlabel wlabel wl-${l.kind}`})),alive:(l,h)=>dr(l.span,h)>.5,zoom:l=>Xa(lf[0],lf[1],l),layer:"wlabels",avoid:".pin.show, .cluster.show",lang:""}),this._res=new Ht,this.groundKey=""}buildBlocks(t){const e=t.length/10;if(this.blockCount=e,this.blockMeshes=[],!e)return;const n=No(1941+e);this.kits=OM(n),this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new te(0,0,0,0))},uShadeS:{value:this.t.shadow.texture},uShadeRect:{value:this.t.rect},uYearNow:this.works.yearU},this.blockMat=Qs(this.app.shared,this.own,{fade:Z2,grow:!0}),this.materials.push(this.blockMat);const i=new Map;this.instances=[];for(let o=0;o<e;o++){const[a,r,c,l,h,u,f,d,g,v]=t.subarray(o*10,o*10+10),m=l*h*1e4;let p;u>=4?p="block":u===3?p="barracks3":u===2?p="barracks2":u===1?p=m&&m<900?"low":"hangar":p=m>2500?"hangar":"barracks2";const x=this.kits[p],w=p==="block"?Math.max(1,u/4):1,b=l>0?l/x.L:Mc,y=h>0?h/x.W:Mc,S={x:a,z:r,dir:c,sx:b,sy:Mc*w,sz:y,stretch:w,span:[f,d,g,v],kind:p,kit:x,c:.94+.12*n()};i.has(p)||i.set(p,[]),i.get(p).push(S),this.instances.push(S)}for(const[o,a]of i){const c=this.kits[o].geometry,l=new _r(c,this.blockMat,a.length);l.name=`works ${o}`,l.frustumCulled=!1,l.instanceColor=new ue(new Float32Array(a.length*3),3);const h=new ue(new Float32Array(a.length*4),4),u=new ue(new Float32Array(a.length),1);c.setAttribute("aSpan",h),c.setAttribute("aStretch",u),a.forEach((f,d)=>{h.array.set(f.span,d*4),u.array[d]=f.stretch,l.instanceColor.array.set([f.c,f.c,f.c*.98],d*3),f.mesh=l,f.index=d}),this.blockMeshes.push(l),this.group.add(l),this.geometries.push(c)}this._m4=new ie,this._q=new _i,this._v=new W,this._s=new W,this._up=new W(0,1,0)}placeBlocks(){const t=this.app.world;for(const e of this.instances){const n=Math.cos(e.dir),i=Math.sin(e.dir),o=e.kit.hx*e.sx,a=e.kit.hz*e.sz;let r=-1/0;for(const[c,l]of[[0,0],[-1,-1],[1,-1],[1,1],[-1,1]])r=Math.max(r,t.metresAt(e.x+c*o*n-l*a*i,e.z+c*o*i+l*a*n));this._q.setFromAxisAngle(this._up,-e.dir),this._v.set(e.x,Kn(Math.max(r,0))+ml,e.z),this._s.set(e.sx,e.sy,e.sz),this._m4.compose(this._v,this._q,this._s),this._m4.toArray(e.mesh.instanceMatrix.array,e.index*16)}for(const e of this.blockMeshes)e.instanceMatrix.needsUpdate=!0}update(t,e){var l;const n=this.app,i=t;if(this.show=i,this.group.visible=i>.001,!this.group.visible){this.labels.update(0);return}const o=n.camera,a=this.works.tint,r=Q2(e);if(this.wash&&(this.washU.uCamPos.value.copy(o.position),this.washU.uAlpha.value=i*r,this.washU.uHatch.value=2**Math.round(Math.log2(Math.max(.05,e*.012)))),this.edges){n.renderer.getDrawingBufferSize(this._res);const h=this.edgeU;h.uResolution.value.copy(this._res),h.uCamPos.value.copy(o.position),h.uWidth.value=1.7*n.renderer.getPixelRatio(),h.uOpacity.value=i*(.55+.4*r);const u=Math.log2(Math.max(.05,e*.012));h.uDash.value=2**Math.floor(u),h.uDashMix.value=u-Math.floor(u)}const c=hf(e);for(const{fine:h,coarse:u,look:f}of Object.values(this.batches))for(const[d,g]of[[h,c>0],[u,!0]])d&&(d===h?d.uniforms.uLod.value.set(0,c):d.uniforms.uLod.value.set(c,1e9),d.uniforms.uAlpha.value=g?i*(a?1:f.alpha):0,a?d.uniforms.uColor.value.setRGB(3,0,3):d.uniforms.uColor.value.setRGB(...f.colour),d.uniforms.uMinPx.value=a?Math.max(4,f.minPx):f.minPx);if(this.ribbons.update(n.renderer),this.blockMeshes.length){const h=i*(1-Xa(cf[0],cf[1],e));this.own.uShow.value=h;for(const u of this.blockMeshes)u.visible=h>.001;if(h>.001){const u=n.districts,f=`${u!=null&&u.on?(l=u.cur)==null?void 0:l.d.id:""}:${(u!=null&&u.on?u.k:0).toFixed(2)}:${this.t.k.toFixed(2)}:${Math.round(n.timeline.year)}`;f!==this.groundKey&&(this.groundKey=f,this.placeBlocks())}}this.labels.update(i*(1-Xa(1500,2300,e)))}stats(){const t=this.works.yearNow,e=this.out.feats.filter(o=>dr(o.span,t)>.5),n={};for(const o of e)n[`${o.kind}:${o.part}`]=(n[`${o.kind}:${o.part}`]||0)+1;let i=0;for(const o of this.geometries)for(const a of Object.values(o.attributes))i+=a.array.byteLength;for(const o of this.geometries)o.index&&(i+=o.index.array.byteLength);for(const o of Object.values(this.batches))for(const a of[o.fine,o.coarse])if(a)for(const r of Object.values(a.mesh.geometry.attributes))i+=r.array.byteLength;return{show:+this.show.toFixed(2),features:this.out.feats.length,standing:n,washTris:this.washTris,edges:this.edgeCount,ribbons:Object.fromEntries(Object.entries(this.batches).map(([o,a])=>[o,{segments:a.n,km:+a.km.toFixed(1)}])),blocks:this.blockCount,blocksShown:this.blockMeshes.length?+this.own.uShow.value.toFixed(2):0,calls:(this.wash?1:0)+(this.edges?1:0)+Object.keys(this.batches).length+this.blockMeshes.length,fineReach:hf(this.works.app.rig.state.distance),labels:this.labels.visible(),gpuMB:+(i/1048576).toFixed(2)}}dispose(){var t;(t=this.group.parent)==null||t.remove(this.group);for(const e of this.geometries)e.dispose();for(const e of Object.values(this.kits||{}))e.geometry.dispose();for(const e of this.materials)e.dispose();for(const e of this.blockMeshes)e.dispose();this.ribbons.dispose(),this.labels.dispose()}}const Yd=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},_c=["chiefdoms","land","mahele"],Xc=s=>Yd(260,900,s),qa=s=>Yd(90,300,s);class ub{constructor(t,e,{warn:n=console.warn}={}){this.canvas=t,this.data=e,this.warn=n,this.params=new URLSearchParams(location.search);const i=new nd({canvas:t,antialias:!1,powerPreference:"high-performance"});i.setClearColor(0,1),i.info.autoReset=!1,this.renderer=i,this.pipeline=new $x(i),this.scene=new Mr,this.camera=new _n(42,1,.1,9e3),this.light={sunDir:new W(0,1,0),sunColor:new Bt,skyColor:new Bt,groundColor:new Bt,moonDir:new W(0,-1,0),moonColor:new Bt,zenith:new Bt,horizon:new Bt,sunHorizon:new Bt,night:0},this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uSkyMap:{value:null},uMokuId:{value:null},uMokuRect:{value:new te(0,0,1,1)},uPalette:{value:null},uEraMix:{value:0},uPolityK:{value:0},uHoverMoku:{value:0}}},this.world=new nw(this,e),Object.assign(this.shared.uniforms,this.world.uniforms),this.world.uniforms=this.shared.uniforms,this.patches=new ew(this),this.timeline=new l2(e.eras),this.polity=new i2(e,this.world.archPack.rect,this.shared.uniforms,n),this.land=new XM(this),this.mahele=new s2(this),this.regionOn="chiefdoms",this.overlay={lines:!0,pins:!0,routes:!1};const o=this.params.get("view");this.view=_c.includes(o)?o:o==="none"?null:"chiefdoms",this.viewChosen=_c.includes(o)||o==="none",this.viewListeners=[],this.polityK=0,this.landK=0,this.sky=new I_,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??15.6)},this.time=0,this.frames=0,this.updaters=[]}start(){this.world.setArchipelago(this.world.archPack),this.scene.add(this.world.group),this.districts=new g_(this),this.world.district=this.districts,this.towns=new d2(this),this.works=new lb(this),this.ocean=new y_(this.shared,this.shared.uniforms),this.scene.add(this.ocean.mesh),this.lines=new j_(this.data,this.shared.uniforms),this.scene.add(this.lines.group),this.routes=new n2({proj:this.data.proj,uniforms:this.shared.uniforms,camera:this.camera,renderer:this.renderer,eras:this.data.eras}),this.scene.add(this.routes.group),Q_(this.data,this.warn).then(a=>this.routes.setRoutes(a)),this.mahele.load(),this.rig=new B_(this.camera,this.canvas,this.world);const t=this.params.get("cam");if(t){const[a,r,c,l,h]=t.split(",").map(Number);this.rig.jump({x:a,z:r,distance:c,yaw:l,pitch:h})}const e=this.params.get("year");e?this.timeline.setYear(Number(e)):t?this.timeline.set(Math.round(this.timeline.sAtYear(1778))):this.timeline.set(0),this.timeline.onChange(()=>this.syncEras()),this.syncEras(),this.sky.update(this.clock.doy,this.clock.hour,0,this.light);const n=this.renderer.getContext(),i=n.getExtension("WEBGL_debug_renderer_info"),o=i?String(n.getParameter(i.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(o),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.params.get("debug")&&this.world.setDebug(Number(this.params.get("debug"))),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}setView(t,{user:e=!1}={}){e&&(this.viewChosen=!0);const n=_c.includes(t)?t:null;if(n!==this.view){this.view=n;for(const i of this.viewListeners)i(n)}}get farView(){return this.view==="mahele"&&!this.mahele.availableAt(this.timeline.year)?"chiefdoms":this.view}region(t){if(t===this.regionOn||this.polityK>.004||t==="mahele"&&!this.mahele.build())return;const e=t==="mahele"?this.mahele:this.polity,n=this.shared.uniforms;n.uMokuId.value=e.idTex,n.uPalette.value=e.palTex,n.uMokuRect.value.set(e.rect.x0,e.rect.z0,e.rect.x1,e.rect.z1),this.regionOn=t}regionZoom(t,e){return t!==this.regionOn?0:t==="mahele"?qa(e):t==="chiefdoms"?Xc(e):0}onView(t){this.viewListeners.push(t)}islandFill(){const t=this.rig.state,e=t.target;let n=null,i=0;for(const r of this.world.islandPacks){const c=r.rect,l=Math.min(e.x-c.x0,c.x1-e.x,e.z-c.z0,c.z1-e.z);l>i&&(i=l,n=r)}if(!n)return 0;const o=2*t.distance*Math.tan(this.camera.fov*Math.PI/360),a=n.rect;return Math.max((a.x1-a.x0)/(o*this.camera.aspect),(a.z1-a.z0)/o)}routeSection(){var o;const t=this.tour,e=(o=this.ui)==null?void 0:o.card;let n=null;t!=null&&t.active&&t.event?n=t.event:!(t!=null&&t.active)&&(e==null?void 0:e.mode)==="event"&&e.ev&&(n=e.ev);const i=n?`ev:${n.id}`:"";return i!==this._routeKey&&(this._routeKey=i,this._routeSection=n?{routes:new Set(n.routes||[]),events:new Set([n.id]),k:1,focus:!0}:null),this._routeSection}routeOptions(t){return{window:this.timeline.window,fill:this.islandFill(),section:this.routeSection(),all:this.overlay.routes===!0,...t}}addIsland(t){const e=this.world.addIsland(t);this.land.attach(e),e.applyRange(this.qset.range),this.params.get("debug")&&(e.uniforms.uDebug.value=Number(this.params.get("debug")))}settle(){var n,i,o,a,r;(n=this.ui)==null||n.timeline.finish(),this.rig.finishFlight();const t=this.rig.goal;for(const c of[this.rig.goal,this.rig.state])c.target.copy(t.target),c.distance=t.distance,c.yaw=t.yaw,c.pitch=t.pitch;this.world.update(this.camera,t.distance,0),this.world.settle(this.camera),(i=this.districts)==null||i.settle(this.camera,t.distance),(o=this.towns)==null||o.settle(),(a=this.works)==null||a.settle(),this.rig.jump({x:t.target.x,z:t.target.z});const e=this.farView;(e==="chiefdoms"||e==="mahele")&&(this.polityK=0,this.region(e)),this.polityK=this.regionZoom(e,t.distance),this.landK=e==="land"?qa(t.distance):0,this.shared.uniforms.uPolityK.value=this.polityK,this.land.settle(this.landK),(r=this.routes)==null||r.settle(this.timeline.year,t.distance,this.routeOptions())}stats(){const t=this.renderer.info;return{...this.world.stats(),view:this.view,farView:this.farView,frameMs:+(this.frameAvg??0).toFixed(1),calls:t.render.calls,triangles:t.render.triangles,textures:t.memory.textures,quality:this.quality.level}}syncEras(){const{a:t,b:e,t:n}=this.timeline.pair;this.polity.setEras(t,e,n)}applyQuality(){const t=[{range:3,dpr:1},{range:3.8,dpr:1.25},{range:4.6,dpr:1.5},{range:5.5,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.world.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.frameAvg=this.frameAvg===void 0?e*1e3:this.frameAvg+(e*1e3-this.frameAvg)*.1,this.renderer.info.reset(),this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.clock;this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t);const n=this.rig.state.distance;this.world.update(this.camera,n,t),this.ocean.update(this.camera);const i=1-Math.exp(-t*5),o=this.farView;(o==="chiefdoms"||o==="mahele")&&this.region(o);const a=this.regionZoom(o,n);this.polityK+=(a-this.polityK)*i,Math.abs(a-this.polityK)<.001&&(this.polityK=a),this.shared.uniforms.uPolityK.value=this.polityK;const r=o==="land"?qa(n):0;this.landK+=(r-this.landK)*i,this.land.update(t,this.landK),this.lines.visible=this.overlay.lines;const c=this.light,l=Math.min(1,.25+(c.sunColor.r+c.skyColor.r)*.35);this.lines.update(this.camera,this.renderer,n,l),this.routes.update(this.timeline.year,n,this.routeOptions({light:l}));for(const u of this.updaters)u(t,this.time);const h=this.pipeline.uniforms;h.uSunDir.value.copy(c.sunDir),h.uSunColor.value.copy(c.sunHorizon),h.uFogColor.value.copy(c.horizon),h.uFogDensity.value=.09/Math.max(30,n),h.uFogFalloff.value=2/Math.max(30,n),h.uExposure.value=.55*(1+2.2*Math.pow(c.night,1.5)),h.uNight.value=c.night,this.sky.group.position.copy(this.camera.position)}}const on=(s,t=document)=>t.querySelector(s),an=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,o]of Object.entries(t))i==="class"?n.className=o:i.startsWith("on")?n.addEventListener(i.slice(2),o):n.setAttribute(i,o);return e&&(n.innerHTML=e),n},fb={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Et=s=>String(s??"").replace(/[&<>"']/g,t=>fb[t]),qc={arrival:'<path d="M2.5 15.5h19l-2.6 3.6H5.1z"/><path d="M11.5 15.5V4l6.5 9.2h-6.5"/><path d="M2 21.2c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',voyage:'<path d="M2.5 14.5h19l-2.6 3.6H5.1z"/><path d="M11.5 14.5V3.5l6.5 9h-6.5"/><path d="M6 21c3-1.4 9-1.4 12 0"/>',battle:'<path d="M4.5 19.5 19.5 4.5M4.5 4.5l15 15"/><path d="M16.5 4.5h3v3M7.5 4.5h-3v3"/>',founding:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',construction:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',eruption:'<path d="M2.5 20.5 9 11h6l6.5 9.5z"/><path d="M10.2 8.2c0-2 1-3.1 1.8-4.7.8 1.6 1.8 2.7 1.8 4.7"/><path d="M7 6.5l1.3 1.3M17 6.5l-1.3 1.3"/>',epidemic:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',law:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',treaty:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 15h3"/><path d="M13.5 18.5c1-1 1.8-1 2.8 0"/>',death:'<path d="M3.5 18.5h17"/><path d="M7 18.5a5 5 0 0 1 10 0"/><path d="M12 4.5v5M9.6 7.4 12 9.8l2.4-2.4"/>',protest:'<path d="M6 21V3.5"/><path d="M6 4h11.5l-2.6 4 2.6 4H6"/>',restoration:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',other:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',era:'<path d="M5 13.5h14l-2 2.6H7z"/><path d="M11.5 13.5V3.5l5.5 7.6h-5.5"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',routes:'<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',home:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'};function Wn(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${qc[s]||qc.other}</svg>`}const Kd=s=>s in qc;class db{constructor(t,e,n){var a;this.app=e,this.ui=n,this.tl=e.timeline,this.tween=null;const i=this.tl.n;this.el=an("div",{class:"timeline",role:"group","aria-label":"Time"}),i<2&&this.el.classList.add("single"),i<1&&(this.el.hidden=!0),this.el.innerHTML=`
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${Wn("prev",16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${Wn("next",16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${this.tl.max}" step="0.001" aria-label="Year" />
      </div>`,t.appendChild(this.el),this.input=on(".tl-input",this.el),this.backBtn=on(".tl-back",this.el),this.nextBtn=on(".tl-next",this.el),this.tourEl=on(".tl-tour",this.el);const o=on(".tl-ticks",this.el);this.tl.eras.forEach((r,c)=>{const l=i>1?c/this.tl.max*100:50,h=an("button",{class:"tl-tick",style:`left:${l}%`,title:`${r.label} · ${zo(r.year,r.yearPrecision)}`,"aria-label":r.label,"data-i":c});h.innerHTML=`<i></i><span>${Et(zo(r.year,r.yearPrecision).replace("c. ",""))}</span>`,o.appendChild(h)}),this.labelTicks(),addEventListener("resize",()=>this.labelTicks()),(a=document.fonts)==null||a.ready.then(()=>this.labelTicks()),this.input.addEventListener("input",()=>{this.tween=null,this.tl.set(Number(this.input.value)),this.ui.onScrub()}),o.addEventListener("click",r=>{const c=r.target.closest(".tl-tick");c&&(this.easeTo(Number(c.dataset.i),.9),this.ui.onScrub(Number(c.dataset.i)))}),this.nextBtn.addEventListener("click",()=>{this.el.classList.remove("invite"),this.ui.tour.next()}),this.backBtn.addEventListener("click",()=>this.ui.tour.back()),this.tl.onChange(()=>this.refresh()),this.refresh()}labelTicks(){const t=[...this.el.querySelectorAll(".tl-tick span")];for(const a of t)a.hidden=!1;const e=t.map(a=>a.getBoundingClientRect());if(!e.some(a=>a.width>0))return;const n=6,i=e.length-1;let o=-1/0;t.forEach((a,r)=>{const c=e[r],l=r===0||r===i||c.left>=o+n&&c.right<=e[i].left-n;a.hidden=!l,l&&(o=c.right)})}easeTo(t,e=1){const n=Math.max(0,Math.min(this.tl.max,t));this.tween={from:this.tl.s,to:n,t:0,dur:e}}easeToYear(t,e){this.easeTo(this.tl.sAtYear(t),e)}finish(){this.tween&&(this.tl.set(this.tween.to),this.tween=null)}update(t){const e=this.tween;if(!e)return;e.t=Math.min(1,e.t+t/e.dur);const n=e.t<.5?2*e.t*e.t:1-Math.pow(-2*e.t+2,2)/2;this.tl.set(e.from+(e.to-e.from)*n),e.t>=1&&(this.tween=null)}refresh(){const t=this.tl,e=t.era;on(".tl-era",this.el).textContent=e?e.label:"";const n=t.reachesNow&&t.s>=t.max-.001;on(".tl-year",this.el).textContent=e?zo(t.year,n?1:e.yearPrecision??1):"",document.activeElement!==this.input&&(this.input.value=String(t.s));const i=t.max>0?t.s/t.max:0;on(".tl-rail span",this.el).style.width=`${i*100}%`;const o=Math.round(t.s);for(const a of this.el.querySelectorAll(".tl-tick"))a.classList.toggle("on",Number(a.dataset.i)===o)}refreshTour(t){const e=`${t.active}:${t.chapter}:${t.step}:${t.stop}:${t.active?"":t.nearestChapter()}:${t.atEnd}`;if(e===this.tourKey)return;this.tourKey=e;const n=t.describe();if(this.backBtn.disabled=!n||t.atStart,this.nextBtn.disabled=!n||t.atEnd,this.el.classList.toggle("off-tour",!!n&&!n.active),this.tourEl.classList.toggle("opening",!!(n!=null&&n.opening)),!n){this.tourEl.innerHTML="";return}this.tourEl.innerHTML=n.active?`<span class="tl-ch">Chapter <b>${n.number}</b> of ${n.of}</span><i>·</i><em>${Et(n.name)}</em>${n.step?`<i>·</i><span>${Et(n.step)}</span>`:""}`:`<span>Next resumes at ${Et(n.chapter.toLowerCase())}</span><i>·</i><em>${Et(n.name)}</em>`,this.nextBtn.title=n.active?"Next (→ or space)":`Back to the tour: ${n.chapter.toLowerCase()}, ${n.name}`}}const uf={exact:0,ahupuaa:22,moku:90,island:260,sea:160},ff=24;class pb{constructor(t,e,{onOpen:n,onCluster:i}={}){this.app=e,this.onOpen=n,this.onCluster=i,this.layer=an("div",{class:"pins"}),t.appendChild(this.layer),this.tip=an("div",{class:"cl-tip",role:"tooltip"}),t.appendChild(this.tip);const o=new Map(e.data.places.map(c=>[c.id,c]));this.places=o,this.items=[];const a=[];for(const c of e.data.events){const l=(c.where||[]).map(p=>o.get(p.place)).find(p=>p&&dn(p.geometry)),h=Hc(c);if(!l||!h){a.push(c.id);continue}const[u,f]=e.data.proj.toWorld(dn(l.geometry)),d=Kd(c.kind)?c.kind:"other",g=an("button",{class:"pin",title:c.title,"aria-label":c.title},`<span class="pin-ic">${Wn(d,16)}</span><span class="pin-label">${Et(c.title)}</span>`);g.addEventListener("click",p=>{var x;p.stopPropagation(),(x=this.onOpen)==null||x.call(this,c)});const v=uf[l.placePrecision]??0,m=an("div",{class:"halo"});this.layer.appendChild(m),this.layer.appendChild(g),this.items.push({ev:c,place:l,x:u,z:f,span:h,start:fr(c)??h[0],el:g,halo:m,soft:v,r:v,pos:new W(u,0,f),shown:!1,active:!1,near:!1,haloShown:!1,tx:NaN,ty:NaN,ts:NaN,hx:NaN,hy:NaN,hr:NaN,ha:NaN})}a.length&&e.warn(`events with no placeable \`where\` or no date, so no pin: ${a.join(", ")}`);const r=this.items.length;this.sx=new Float32Array(r),this.sy=new Float32Array(r),this.vis=new Uint8Array(r),this.root=new Int16Array(r),this.size=new Int16Array(r),this.slot=new Int16Array(r),this.members=new Int16Array(r),this.halos=new Int16Array(r),this.clusters=[],this.nClusters=0,this.hovered=null,this.activeEvent=null,this.stopXZ=null,this.asideNow=!1,this._v=new W,this._w=new W}setStopPlace(t){const e=t&&dn(t.geometry);this.stopXZ=e?this.app.data.proj.toWorld(e):null,this.stopSoft=t?uf[t.placePrecision]??0:0}aside(){var o,a,r,c,l;const t=this.app,e=t.tour,n=e!=null&&e.active&&e.event===this.activeEvent&&e.stop>=0?(o=e.event.stops)==null?void 0:o[e.stop]:null,i=n?Math.max(n.zoom==="near"?1:0,((l=(c=(r=(a=t.districts)==null?void 0:a.cur)==null?void 0:r.features)==null?void 0:c.forces)==null?void 0:l.stopShown)??0):0;return this.asideNow=this.asideNow?i>.2:i>.35,this.asideNow}visibleEvents(){const[t,e]=this.app.timeline.window;return this.items.filter(n=>n.span[1]>=t&&n.span[0]<=e).map(n=>n.ev)}marker(t){let e=this.clusters[t];if(e)return e;const n=an("button",{class:"cluster"},'<span class="cl-n"></span>');return e={el:n,label:n.firstChild,start:0,count:0,x:0,y:0,key:0,shownCount:-1,tipKey:-1,domKey:-1,shown:!1,beside:!1,tx:NaN,ty:NaN,ts:NaN},n.addEventListener("click",i=>{var o;i.stopPropagation(),this.hideTip(),(o=this.onCluster)==null||o.call(this,this.eventsOf(e))}),n.addEventListener("pointerenter",i=>{i.pointerType!=="touch"&&(this.hovered=e,this.showTip(e))}),n.addEventListener("pointerleave",()=>{this.hovered===e&&this.hideTip()}),this.layer.appendChild(n),this.clusters[t]=e,e}eventsOf(t){const e=[];for(let n=0;n<t.count;n++)e.push(this.items[this.members[t.start+n]]);return e.sort((n,i)=>n.start-i.start).map(n=>n.ev)}groups(){return this.clusters.slice(0,this.nClusters).map(t=>({ids:this.eventsOf(t).map(e=>e.id),count:t.count,x:t.x,y:t.y,beside:t.beside}))}showTip(t){t.tipKey=t.key;const e=this.eventsOf(t).map(n=>`<div class="tip-row"><span class="tip-y">${Et(Vd(n))}</span><b>${Et(n.title)}</b></div>`).join("");this.tip.innerHTML=`<div class="tip-head">${t.count} events here</div>${e}<div class="tip-foot">click for the list</div>`,this.tip.classList.add("show"),this.tipX=this.tipY=NaN,this.placeTip(t)}placeTip(t){const e=this.tip.offsetWidth||220,n=this.tip.offsetHeight||120;let i=t.x+22;i+e>innerWidth-10&&(i=t.x-22-e);const o=Math.max(64,Math.min(innerHeight-n-10,t.y-44-n/2)),a=Math.round(i),r=Math.round(o);a===this.tipX&&r===this.tipY||(this.tipX=a,this.tipY=r,this.tip.style.transform=`translate(${a}px, ${r}px)`)}hideTip(){this.hovered=null,this.tip.classList.remove("show")}find(t){const e=this.root;for(;e[t]!==t;)e[t]=e[e[t]],t=e[t];return t}put(t,e,n,i){Math.abs(e-t.tx)<.05&&Math.abs(n-t.ty)<.05&&i===t.ts||(t.tx=e,t.ty=n,t.ts=i,t.el.style.transform=`translate(${e.toFixed(1)}px, ${n.toFixed(1)}px) scale(${i.toFixed(3)})`)}update(t){const e=this.app,n=e.camera,i=innerWidth,o=innerHeight,a=e.timeline,r=a.yearAt(a.s-.5),c=a.yearAt(a.s+.5),l=e.rig.state.distance,h=Math.round(Math.max(.62,Math.min(1,1.18-Math.log(Math.max(1,l)/120)*.13))*200)/200,u=this.items,f=u.length,{sx:d,sy:g,vis:v,root:m,size:p}=this,x=this.activeEvent,w=this.aside(),b=this._v;let y=-1;for(let _=0;_<f;_++){const A=u[_],R=A.ev===x,D=R&&this.stopXZ;A.pos.x=D?this.stopXZ[0]:A.x,A.pos.z=D?this.stopXZ[1]:A.z,A.pos.y=e.world.heightAt(A.pos.x,A.pos.z)+.02,A.r=D?this.stopSoft:A.soft;let C=t&&(R?!w:A.span[1]>=r&&A.span[0]<=c);C&&(b.copy(A.pos).project(n),d[_]=(b.x+1)/2*i,g[_]=(1-b.y)/2*o,C=b.z<1&&d[_]>-60&&d[_]<i+60&&g[_]>84&&g[_]<o+40),v[_]=C?1:0,C&&R&&(y=_),m[_]=_,p[_]=0}const S=ff*ff;for(let _=0;_<f;_++)if(!(!v[_]||_===y))for(let A=_+1;A<f;A++){if(!v[A]||A===y)continue;const R=d[_]-d[A],D=g[_]-g[A];if(R*R+D*D<S){const C=this.find(_),z=this.find(A);C!==z&&(m[Math.max(C,z)]=Math.min(C,z))}}for(let _=0;_<f;_++)v[_]&&_!==y&&p[this.find(_)]++;let E=0,T=0;for(let _=0;_<f;_++){if(!v[_]||_===y||m[_]!==_||p[_]<2)continue;const A=this.marker(E);this.slot[_]=E++,A.start=T,A.count=0,A.x=0,A.y=0,A.key=0,T+=p[_]}for(let _=0;_<f;_++){if(!v[_]||_===y)continue;const A=this.find(_);if(p[A]<2)continue;const R=this.clusters[this.slot[A]];this.members[R.start+R.count++]=_,R.x+=d[_],R.y+=g[_],R.key=(R.key*61+_+1)%1000003}for(let _=0;_<f;_++){const A=u[_],R=v[_]===1&&(_===y||p[this.find(_)]<2);R!==A.shown&&(A.shown=R,A.el.classList.toggle("show",R));const D=A.ev===x;if(D!==A.active&&(A.active=D,A.el.classList.toggle("active",D)),!R)continue;const C=l<260||D;C!==A.near&&(A.near=C,A.el.classList.toggle("near",C)),this.put(A,d[_],g[_],h)}for(let _=0;_<E;_++){const A=this.clusters[_];A.x/=A.count,A.y/=A.count;const R=y>=0&&Math.abs(A.x-d[y])<30&&Math.abs(A.y-g[y])<30;if(R&&(A.x=d[y]-36*h,A.y=g[y]),R!==A.beside&&(A.beside=R,A.el.classList.toggle("beside",R)),A.count!==A.shownCount&&(A.shownCount=A.count,A.label.textContent=String(A.count),A.el.setAttribute("aria-label",`${A.count} events here`)),A.key!==A.domKey){A.domKey=A.key;let D="";for(let C=0;C<A.count;C++)D+=`${C?" ":""}${u[this.members[A.start+C]].ev.id}`;A.el.dataset.events=D}A.shown||(A.shown=!0,A.el.classList.add("show")),this.put(A,A.x,A.y,h),this.hovered===A&&(A.key!==A.tipKey?this.showTip(A):this.placeTip(A))}for(let _=E;_<this.clusters.length;_++){const A=this.clusters[_];this.hovered===A&&this.hideTip(),A.shown&&(A.shown=!1,A.count=0,A.el.classList.remove("show"))}this.nClusters=E;let M=0;for(let _=0;_<f;_++){const A=u[_];let R=v[_]===1&&A.r>0;for(let I=0;R&&I<M;I++){const O=u[this.halos[I]];Math.abs(O.pos.x-A.pos.x)<.5&&Math.abs(O.pos.z-A.pos.z)<.5&&O.r>=A.r&&(R=!1)}if(R!==A.haloShown&&(A.haloShown=R,A.halo.classList.toggle("show",R)),!R)continue;this.halos[M++]=_,this._w.copy(n.position).sub(A.pos).normalize();const D=this._w.cross(n.up).normalize().multiplyScalar(A.r).add(A.pos);D.project(n);const C=Math.max(6,Math.min(400,Math.hypot((D.x+1)/2*i-d[_],(1-D.y)/2*o-g[_])));Math.abs(d[_]-A.hx)<.05&&Math.abs(g[_]-A.hy)<.05&&Math.abs(C-A.hr)<.05||(A.hx=d[_],A.hy=g[_],A.hr=C,A.halo.style.transform=`translate(${d[_].toFixed(1)}px, ${g[_].toFixed(1)}px) scale(${C.toFixed(1)})`);const z=Math.round(Math.max(.3,Math.min(1,70/C))*100)/100;z!==A.ha&&(A.ha=z,A.halo.style.setProperty("--halo",z.toFixed(2)))}}}const mb={arrival:"arrival",battle:"battle",founding:"founding",construction:"construction",eruption:"eruption",epidemic:"epidemic",law:"law",treaty:"treaty",voyage:"voyage",death:"death",protest:"protest",restoration:"restoration",other:"event"},df=s=>Kd(s.kind)?s.kind:"other";function Yc(s){return s?s.read!==void 0?s.read==="full"||s.read==="part":s.opened!==!1:!1}function gb(s){const t=String(s).match(/^(in the time of)(\s+)(.+)$/i);return t?{lead:t[1],gap:t[2],name:t[3]}:{lead:"",gap:"",name:String(s)}}class vb{constructor(t,e,n){this.app=e,this.ui=n,this.el=an("section",{class:"card","aria-live":"polite"}),t.appendChild(this.el),this.places=new Map(e.data.places.map(i=>[i.id,i])),this.sources=new Map(e.data.sources.map(i=>[i.id,i])),this.events=new Map(e.data.events.map(i=>[i.id,i])),this.missing=new Set,this.mode=null,this.ev=null,this.stop=-1,this.chapter=null,this.list=null,this.el.addEventListener("click",i=>this.click(i))}get isOpen(){return this.el.classList.contains("show")}open(t){this.set("event",{ev:t})}setStop(t){this.stop=t,this.render()}openEra(t){this.set("era",{chapter:t})}openList(t){this.set("cluster",{list:t})}set(t,{ev:e=null,chapter:n=null,list:i=null}){this.mode=t,this.ev=e,this.chapter=n,this.list=i,this.stop=-1,this.render()}close(){var e,n;const t=this.ev;this.el.classList.remove("show"),this.mode=null,this.ev=null,this.chapter=null,this.list=null,(n=(e=this.ui).onCardClosed)==null||n.call(e,t)}click(t){const e=t.target.closest("button");if(!e||!this.el.contains(e))return;const n=this.ui.tour;if(e.classList.contains("card-close"))this.close();else if(e.classList.contains("prev"))n.back();else if(e.classList.contains("next"))n.next();else if(e.dataset.ev){const i=this.events.get(e.dataset.ev);i&&n.open(i,{gentle:this.mode==="cluster"})}}cited(t){const e=this.sources.get(t);return!e&&!this.missing.has(t)&&(this.missing.add(t),this.app.warn(`a card cites ${t}, which is not in sources.json`)),Yc(e)?e:null}sourceLine(t){const e=this.cited(typeof t=="string"?t:t.id);if(!e)return"";const n=typeof t=="object"&&t.where?`, ${Et(t.where)}`:"",i=e.url&&/^https?:/.test(e.url)?`<a href="${Et(e.url)}" target="_blank" rel="noopener">${Et(e.title)}</a>`:Et(e.title),o=e.author?`${Et(e.author)}, `:"",a=e.year?` (${Et(e.year)})`:"";return`<li>${o}<span class="src-title">${i}</span>${a}${n}</li>`}sourcesSection(t){const e=(t||[]).map(n=>this.sourceLine(n)).join("");return e?`<div class="card-sec"><h2>Sources</h2><ul class="sources">${e}</ul></div>`:""}eventRows(t,{gloss:e=!0}={}){return t.map(n=>`<li><button class="ev-row" data-ev="${Et(n.id)}">
          <span class="ev-ic">${Wn(df(n),16)}</span>
          <span class="ev-y">${Et(Vd(n))}</span>
          <span class="ev-t"><b>${Et(n.title)}</b>${e&&n.gloss?`<em>${Et(n.gloss)}</em>`:""}</span>
        </button></li>`).join("")}footer(){var o;const t=this.ui.tour;if(!(t!=null&&t.active))return"";const e=t.current;let n,i="Next";if(this.mode==="era"&&this.chapter===e&&t.step<0)n=`<span class="ch-count">Chapter <b>${e.index+1}</b> of ${t.chapters.length}</span>`;else if(this.mode==="event"&&this.ev&&this.ev===t.event){const a=((o=this.ev.stops)==null?void 0:o.length)||0;t.stop>=0?n=Et(`stop ${t.stop+1} of ${a}`):(n=Et(`${t.step+1} of ${e.events.length} in chapter ${e.index+1}`),a&&(i=`Walk ${a} stops`))}else return"";return`<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${t.atStart?"disabled":""}>${Wn("prev",18)}</button>
      <span class="count">${n}</span>
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${t.atEnd?"disabled":""}><span>${Et(i)}</span>${Wn("next",18)}</button>
    </footer>`}render(){if(this.mode==="era")this.el.innerHTML=this.eraHTML();else if(this.mode==="cluster")this.el.innerHTML=this.clusterHTML();else if(this.mode==="event"&&this.ev)this.el.innerHTML=this.eventHTML();else return;this.el.dataset.mode=this.mode,this.el.classList.toggle("chapter",this.mode==="era"),this.el.classList.add("show"),this.el.scrollTop=0}header(t,e,n){return`<header>
        <div class="card-icon">${Wn(t,26)}</div>
        <div class="card-titles"><h1>${Et(e)}</h1>${n?`<p class="gloss">${Et(n)}</p>`:""}</div>
        <button class="card-close" aria-label="Close">${Wn("close",18)}</button>
      </header>`}eventHTML(){const t=this.ev,e=(t.where||[]).map(c=>{const l=this.places.get(c.place);return l?`${Et(l.name)}${c.role?` <em>${Et(c.role)}</em>`:""}`:null}).filter(Boolean),n=Object.entries(t.confidence||{}).map(([c,l])=>`<span class="conf ${Et(l)}"><b>${Et(c)}</b> ${Et(l)}</span>`).join(""),i=(t.tellings||[]).map(c=>{const l=this.cited(c.source);return l?`<li><span class="src-title">${Et(l.title)}</span>: ${Et(c.says)}</li>`:""}).join(""),o=t.stops||[],a=this.stop>=0?o[this.stop]:null,r=a?this.places.get(a.place):null;return`
      ${this.header(df(t),t.title,t.gloss)}
      <div class="card-meta"><span class="when">${Et(c2(t))}</span><span class="kind">${Et(mb[t.kind]||t.kind||"event")}</span></div>
      ${e.length?`<div class="card-where">${e.join("<i>·</i>")}</div>`:""}
      ${a?`<div class="stop"><div class="stop-n">${this.stop+1} / ${o.length}${r?` · ${Et(r.name)}`:""}</div><p>${Et(a.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${Et(t.summary)}</p>`:""}</div>
      ${n?`<div class="card-conf">${n}</div>`:""}
      ${i?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${i}</ul></div>`:""}
      ${this.sourcesSection(t.sources)}
      ${this.footer()}`}eraHTML(){const t=this.chapter,e=t.era,n=gb(e.label||e.id),o=String(e.note||"").match(/^([ʻʼ'‘“"(]*.)([\s\S]*)$/u),a=o?`<p><span class="initial">${Et(o[1])}</span>${Et(o[2])}</p>`:"";return`
      <header class="ch-head">
        <div class="ch-mark"><span class="ch-word">Chapter</span><span class="ch-num">${t.index+1}</span></div>
        <h1 class="ch-title">${n.lead?`<span class="ch-lead">${Et(n.lead)}</span>${Et(n.gap)}`:""}<span class="ch-name">${Et(n.name)}</span></h1>
        <div class="ch-year">${Et(zo(e.year,Math.max(10,e.yearPrecision??10)))}</div>
        <button class="card-close" aria-label="Close">${Wn("close",18)}</button>
      </header>
      <div class="card-body ch-note">${a}</div>
      ${t.events.length?`<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(t.events,{gloss:!1})}</ul></div>`:""}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`}clusterHTML(){const t=this.list||[],e=[];for(const i of t){const o=(i.where||[]).map(a=>this.places.get(a.place)).find(Boolean);o&&!e.includes(o.name)&&e.push(o.name)}const n=e.length>4?`${e.slice(0,4).join(" · ")} · and ${e.length-4} more`:e.join(" · ");return`
      ${this.header("pins",`${t.length} events`,n)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(t)}</ul></div>`}}const Yi={far:2600,island:520,near:70},bc={far:0,island:1,near:2},xb=1500,Ps=(s,t,e)=>Math.max(t,Math.min(e,s)),wb=new Set(["law","epidemic","restoration"]);function yb(s,t=null){return(s==null?void 0:s.view)==="land"||(s==null?void 0:s.view)==="chiefdoms"||(s==null?void 0:s.view)==="mahele"?s.view:(s==null?void 0:s.kind)==="law"&&(t!=null&&t.size)&&(s.sources||[]).some(e=>t.has(typeof e=="string"?e:e==null?void 0:e.id))?"mahele":s&&wb.has(s.kind)?"land":"chiefdoms"}function Mb(s){return s.short?s.short:String(s.label||s.id).replace(/^in the time of\s+/i,"").split(/,| and the /)[0].trim()}function pf(s){let t=null;for(const e of s||[])e in bc&&(t===null||bc[e]>bc[t])&&(t=e);return t||"island"}class _b{constructor(t,e){this.app=t,this.ui=e,this.places=new Map(t.data.places.map(n=>[n.id,n])),this.islands=new Map(t.data.packs.filter(n=>n!==t.world.archPack).map(n=>[n.id,n])),this.chapters=this.build(),this.active=!1,this.chapter=0,this.step=-1,this.stop=-1,this.listeners=[]}build(){const t=this.app,e=t.timeline,n=new Map(e.eras.map((r,c)=>[r.id,c])),i=e.eras.map((r,c)=>({era:r,index:c,name:Mb(r),events:[],island:null}));if(!i.length)return i;const o=[],a=i.map(()=>[]);return t.data.events.forEach((r,c)=>{const l=fr(r);if(l===null)return;let h=n.get(r.era);h===void 0&&(h=e.eras.indexOf(e.eraAt(e.sAtYear(l))),o.push(r.id)),a[h].push({ev:r,start:l,order:c})}),o.length&&t.warn(`events whose era is not in eras.json, placed in a chapter by date: ${o.join(", ")}`),i.forEach((r,c)=>{r.events=a[c].sort((l,h)=>l.start-h.start||l.order-h.order).map(l=>l.ev),r.island=this.gathering(r.events)}),i}gathering(t){const e=new Map;let n=0;for(const a of t){const r=this.placeOf(a);r&&(n++,r.island&&this.islands.has(r.island)&&e.set(r.island,(e.get(r.island)||0)+1))}let i=null,o=0;for(const[a,r]of e)r>o&&([i,o]=[a,r]);return i&&o>=2&&o>=n*.7?i:null}placeOf(t){for(const e of t.where||[]){const n=this.places.get(e.place);if(n&&dn(n.geometry))return n}return null}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}get current(){return this.chapters[this.chapter]||null}get event(){var t;return this.step>=0&&((t=this.current)==null?void 0:t.events[this.step])||null}get state(){var t;return{active:this.active,chapter:this.chapter,step:this.step,stop:this.stop,event:((t=this.event)==null?void 0:t.id)??null}}get atStart(){return this.active&&this.chapter===0&&this.step<0}get atEnd(){var o;const t=this.chapters.length;if(!t)return!0;if(!this.active)return!1;const e=this.current,n=this.event,i=n?(((o=n.stops)==null?void 0:o.length)||0)-1:-1;return this.chapter===t-1&&this.step===e.events.length-1&&this.stop>=i}nearestChapter(){return Ps(Math.round(this.app.timeline.s),0,this.chapters.length-1)}begin(){this.goTo(0,-1,{jump:!0})}next(){var e;if(!this.chapters.length)return;if(!this.active)return this.goTo(this.nearestChapter(),-1);const t=this.event;if(t&&this.stop<(((e=t.stops)==null?void 0:e.length)||0)-1)return this.goStop(this.stop+1);if(this.step<this.current.events.length-1)return this.goTo(this.chapter,this.step+1);if(this.chapter<this.chapters.length-1)return this.goTo(this.chapter+1,-1)}back(){if(this.chapters.length){if(!this.active)return this.goTo(this.nearestChapter(),-1);if(this.event&&this.stop>0)return this.goStop(this.stop-1);if(this.event&&this.stop===0)return this.goTo(this.chapter,this.step);if(this.step>0)return this.goTo(this.chapter,this.step-1,{stop:"last"});if(this.step===0)return this.goTo(this.chapter,-1);if(this.chapter>0){const t=this.chapters[this.chapter-1];return this.goTo(this.chapter-1,t.events.length-1,{stop:"last"})}}}skip(t){if(!this.chapters.length)return;const e=this.active?this.chapter:this.nearestChapter(),n=t<0&&this.active&&this.step>=0?e:e+t;n>=0&&n<this.chapters.length&&this.goTo(n,-1)}leave(){this.active&&(this.active=!1,this.notify())}locate(t){for(let e=0;e<this.chapters.length;e++){const n=this.chapters[e].events.indexOf(t);if(n>=0)return[e,n]}return null}open(t,{gentle:e=!1}={}){const n=this.locate(t);if(n)return this.goTo(n[0],n[1],{gentle:e});this.ui.pins.activeEvent=t,this.ui.pins.setStopPlace(null),this.ui.card.open(t),this.fly(this.gentleView(t),!1,this.placeOf(t))}goTo(t,e=-1,{jump:n=!1,gentle:i=!1,stop:o=-1}={}){var r;const a=this.chapters[t];if(a){if(this.active=!0,this.chapter=t,this.step=Ps(e,-1,a.events.length-1),this.stop=-1,this.step<0)this.showEra(a,n);else{const c=a.events[this.step],l=((r=c.stops)==null?void 0:r.length)||0;if(o==="last"&&l)return this.goStop(l-1,{jump:n});this.showEvent(c,{jump:n,gentle:i})}this.notify()}}applyView(t){var e;this.app.viewChosen||this.app.setView(yb(t,(e=this.app.mahele)==null?void 0:e.sources))}showEra(t,e){const n=this.ui;this.applyView(null),n.pins.activeEvent=null,n.pins.setStopPlace(null),n.card.openEra(t);const i=t.island?this.islandView(t.island,this.homeYaw()):this.chainView();this.setS(t.index,this.fly(i,e),e)}showEvent(t,{jump:e,gentle:n}){const i=this.ui;this.applyView(t),this.prefetch(t),i.pins.activeEvent=t,i.pins.setStopPlace(null),i.card.open(t);const o=this.fly(n?this.gentleView(t):this.eventView(t),e,this.placeOf(t)),a=this.app.timeline,[r,c]=a.window,l=Hc(t);n&&l&&l[1]>=r&&l[0]<=c||this.setYear(this.stepYear(t,this.current),o,e)}goStop(t,{jump:e=!1}={}){const n=this.event,i=(n==null?void 0:n.stops)||[];if(!n||t<-1||t>=i.length)return;const o=this.ui;this.active=!0,this.stop=t,this.applyView(n),o.pins.activeEvent=n,o.card.ev!==n&&o.card.open(n),o.card.setStop(t);const a=i[t],r=a?this.places.get(a.place):null,c=r&&dn(r.geometry);if(o.pins.setStopPlace(c?r:null),this.prefetch(n),a){const l=c?a.camera?this.cameraView(r,a.camera):this.pointView(r,Yi[a.zoom]??Yi.island):null,h=this.fly(l,e,r);Number.isFinite(a.year)&&this.setYear(a.year,h,e)}this.notify()}prefetch(t){const e=this.app.districts;if(e)for(const n of(t==null?void 0:t.stops)||[]){const i=this.places.get(n.place),o=i&&dn(i.geometry);if(!o||n.zoom==="far")continue;const[a,r]=this.app.data.proj.toWorld(o);if(e.prefetch(a,r,i.moku))return}}stepYear(t,e){const n=this.app.timeline,i=fr(t),o=Hc(t)||[i,i],a=n.yearAt(e.index-.5),r=n.yearAt(e.index+.5);return i>=a&&i<=r?i:o[1]>=a&&o[0]<=r?Ps(e.era.year,Math.max(o[0],a),Math.min(o[1],r)):i}setYear(t,e,n){this.setS(this.app.timeline.sAtYear(t),e,n)}setS(t,e,n){const i=this.ui.timeline;n?(i.tween=null,this.app.timeline.set(t)):i.easeTo(t,Ps(e*.8,.6,2.4))}homeYaw(t=this.ui.freeBox()){return this.chainView(t).yaw}tilt(){const t=this.app.rig.goal;return Ps(t.pitch-Qi(t.distance),-.3,.3)}chainView(t=this.ui.freeBox()){const e=this.app.rig,n=this.app.world.chainShape(),i=e.fit({points:n.hull,along:[n.from,n.to],box:t,reach:Wd});return e.reach(i.distance),i}islandView(t,e=this.app.rig.goal.yaw,n=0){const i=this.islands.get(t);return this.app.rig.fit({rect:i.rect,yaw:e,tilt:n,box:this.ui.freeBox()})}pointView(t,e,{towardChain:n=0}={}){let[i,o]=this.app.data.proj.toWorld(dn(t.geometry));if(n){const c=this.app.world.bounds,l=(c.x0+c.x1)/2-i,h=(c.z0+c.z1)/2-o,u=Math.min(n,900/Math.max(1,Math.hypot(l,h)));i+=l*u,o+=h*u}const a=this.ui.freeBox(),r=n?this.homeYaw(a):this.app.rig.goal.yaw;return this.app.rig.fit({rect:{x0:i,x1:i,z0:o,z1:o},distance:e,yaw:r,tilt:this.tilt(),box:a})}cameraView(t,e){const n=Array.isArray(e.target)&&e.target.length>=2&&e.target.every(Number.isFinite)?e.target:dn(t.geometry),[i,o]=this.app.data.proj.toWorld(n);return this.app.rig.fit({rect:{x0:i,x1:i,z0:o,z1:o},distance:e.distance,yaw:-e.bearing*Math.PI/180,pitch:e.pitch*Math.PI/2,box:this.ui.freeBox()})}eventView(t){const e=this.placeOf(t);if(!e)return null;const n=pf(t.zoom);return n==="near"?this.pointView(e,Yi.near):n==="island"&&this.islands.has(e.island)?this.islandView(e.island,this.app.rig.goal.yaw,this.tilt()):n==="island"?this.pointView(e,Yi.island):!e.island&&e.placePrecision==="island"?this.chainView():this.pointView(e,this.farDistance(),{towardChain:.35})}farDistance(t=this.ui.freeBox()){const e=Math.tan(this.app.camera.fov*Math.PI/360),n=Math.max(60,Math.min(t.x1-t.x0,t.y1-t.y0));return Math.max(Yi.far,xb*innerHeight/(2*e*n))}gentleView(t){const e=this.placeOf(t);if(!e)return null;const n=Yi[pf(t.zoom)];return this.pointView(e,Math.min(this.app.rig.goal.distance,Math.max(n,Yi.island)))}fly(t,e=!1,n=null){if(!t)return 1;const i=this.app.rig;if(e)return i.jump({x:t.target.x,z:t.target.z,distance:t.distance,yaw:t.yaw,pitch:t.pitch}),0;const o=i.goal,a=Math.hypot(o.target.x-t.target.x,o.target.z-t.target.z),r=Math.abs(Math.log(t.distance/Math.max(1,o.distance))),c=Ps(1.1+Math.sqrt(a)*.032+r*.28,1.1,3.4),l=this.app.districts,h=l&&t.distance<130?l.prefetch(t.target.x,t.target.z,n==null?void 0:n.moku):null;return i.flyTo(t,c,h?{ready:()=>{var u;return((u=l.cur)==null?void 0:u.d)===h&&l.cur.state==="ready"}}:{}),c}describe(){const t=this.chapters.length?this.chapters[this.active?this.chapter:this.nearestChapter()]:null;return t?{active:this.active,opening:this.active&&this.step<0,number:t.index+1,of:this.chapters.length,chapter:`Chapter ${t.index+1} of ${this.chapters.length}`,name:t.name,step:this.active&&this.step>=0?`${this.step+1} of ${t.events.length}`:""}:null}}const bb=.05,mf=.25,gf="The land division of 1848, by ahupuaʻa",Sc=new Map(Oo.map(s=>[s.id,s]));class Sb{constructor(t){if(this.app=t,t.ui=this,this.build(),this.bind(),t.updaters.push(e=>this.update(e)),!t.params.has("year")&&!t.params.has("cam")&&this.tour.chapters.length)this.tour.begin(),this.timeline.el.classList.add("invite");else if(!t.params.has("cam")){const e=this.tour.chainView();t.rig.jump({x:e.target.x,z:e.target.z,distance:e.distance,yaw:e.yaw,pitch:e.pitch})}}build(){const t=this.app,e=an("div",{id:"ui"});document.body.appendChild(e),this.root=e;const n=t.world.archPack.name;this.brand=an("div",{class:"brand"},`<div class="brand-name">Holo i ke Au</div><div class="brand-sub"><span class="where">${Et(n)}</span><span class="loading"></span></div>`),e.appendChild(this.brand),this.tools=an("div",{class:"tools"});const i=(a,r,c,l)=>an("button",{class:`tool${l?" on":""}`,"data-tool":a,title:c,"aria-label":c,"aria-pressed":String(!!l)},Wn(r,20));this.tools.append(i("lines","lines","Moku and ahupuaʻa boundaries",t.overlay.lines),i("routes","routes","Every voyage, fleet and ship at sea in these years",t.overlay.routes),i("pins","pins","Events",t.overlay.pins),i("home","home","The whole chain"),i("help","help","About"),i("full","expand","Full screen")),e.appendChild(this.tools),this.legend=an("div",{class:"legend"}),this.legend.innerHTML=`
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
        <button type="button" data-view="mahele" aria-pressed="false" title="${gf}">Māhele</button>
      </div>
      <div class="lg-body"></div>`,this.legendBody=on(".lg-body",this.legend),this.legend.inert=!0,e.appendChild(this.legend),this.inspector=an("div",{class:"inspector"}),e.appendChild(this.inspector),this.timeline=new db(e,t,this),this.pins=new pb(e,t,{onOpen:a=>this.openEvent(a),onCluster:a=>this.openCluster(a)}),this.card=new vb(e,t,this),this.tour=new _b(t,this),t.tour=this.tour,this.tour.onChange(a=>this.timeline.refreshTour(a)),t.timeline.onChange(()=>this.timeline.refreshTour(this.tour)),this.timeline.refreshTour(this.tour),this.help=an("div",{class:"help hidden"});const o=this.credits();this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${Wn("close",18)}</button>
        <h2>Holo i ke Au</h2>
        <p><em>Holo i ke au</em>: sail on the current, into the era. <em>Au</em> is both a period of time and a current, and the title rides it.</p>
        <p>The Hawaiian Islands from real terrain, across the eras from the first canoes to 1898. Far out, each moku takes the colour of the chiefdom or kingdom that held it; close in, the boundaries of moku and ahupuaʻa lie on the land. Pins are events of the chosen era: open one for its story, how sure the record is, and its sources. A number stands for several events in one spot; open it for the list.</p>
        <p>The switch on the legend turns the far view from the <b>Chiefdoms</b> to the <b>Land</b>: where it was cultivated, where people lived and how many, and the native forest, in the chosen year, blended between layers made for 1778, 1853, 1896 and now. A layer marked <em>modelled</em> was drawn by a written rule where no map of its time exists. From ${$a} it turns to the <b>Māhele</b> too: each ahupuaʻa in the class the land division gave it, crown, government or konohiki land, or mixed where the records give it more than one.</p>
        <p><b>Next</b> walks the story an era at a time: each era opens with its card, then its events in order, the year and the camera moving to each. Look around as you like between steps; the timeline is free too, and Next picks the story up again from the nearest era.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> era by era</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span>
        </div>
        ${o?`<h3>Data</h3><ul class="credits">${o}</ul>`:""}
        <div class="land-credits"></div>
        <div class="mahele-credits"></div>
      </div>`,e.appendChild(this.help),this.refreshLegend()}creditable(t){return this.sourceById||(this.sourceById=new Map(this.app.data.sources.map(e=>[e.id,e]))),Yc(this.sourceById.get(t.id)||t)}credits(){var i,o;const t=this.app.data,e=new Map,n=a=>{a&&a.id&&!e.has(a.id)&&this.creditable(a)&&e.set(a.id,a)};for(const a of t.packs)for(const r of a.sources||[])n(r);for(const a of((i=t.moku)==null?void 0:i.sources)||[])n(a);for(const a of((o=t.ahupuaa)==null?void 0:o.sources)||[])n(a);return Ec([...e.values()])}landCredits(){const t=on(".land-credits",this.help),e=this.app.land.manifest;if(!t||!e||t.childElementCount)return;const n=new Map;for(const i of Object.values(e.methods||{}))for(const o of Object.values(i||{}))for(const a of(o==null?void 0:o.sources)||[])a!=null&&a.id&&/^https?:/.test(a.url||"")&&!n.has(a.id)&&this.creditable(a)&&n.set(a.id,a);n.size&&(t.innerHTML=`<h3>Land layers</h3><ul class="credits">${Ec([...n.values()])}</ul>`)}maheleCredits(){const t=on(".mahele-credits",this.help),e=this.app.mahele.sources;if(!t||!e||t.childElementCount)return;const n=new Map(this.app.data.sources.map(o=>[o.id,o])),i=[...e].map(o=>n.get(o)).filter(o=>Yc(o));i.length&&(t.innerHTML=`<h3>The Māhele</h3><ul class="credits">${Ec(i)}</ul>`)}bind(){const t=this.app;this.tools.addEventListener("click",i=>{var r,c,l;const o=i.target.closest("[data-tool]");if(!o)return;const a=o.dataset.tool;if(a==="help")this.help.classList.toggle("hidden");else if(a==="full")document.fullscreenElement?(r=document.exitFullscreen)==null||r.call(document):(l=(c=document.documentElement).requestFullscreen)==null||l.call(c).catch(()=>{});else if(a==="home"){const h=t.rig;h.home=this.tour.chainView(),h.flyTo({target:h.home.target,distance:h.home.distance,yaw:h.home.yaw,pitch:h.home.pitch},3)}else a in t.overlay&&(t.overlay[a]=!t.overlay[a],o.classList.toggle("on",t.overlay[a]),o.setAttribute("aria-pressed",String(t.overlay[a])))}),this.legend.addEventListener("click",i=>{const o=i.target.closest("[data-view]");if(!o||o.disabled)return;const a=o.dataset.view;t.setView(t.farView===a?null:a,{user:!0})}),t.onView(()=>this.refreshLegend()),t.land.onChange(()=>{this.refreshLegend(),this.landCredits()}),t.mahele.onChange(()=>{this.refreshLegend(),this.maheleCredits();const i=this.tour;i.active&&i.event&&i.applyView(i.event)}),this.help.addEventListener("click",i=>{(i.target===this.help||i.target.closest(".help-close"))&&this.help.classList.add("hidden")}),t.timeline.onChange(()=>{(t.timeline.era!==this.legendEra||t.mahele.availableAt()!==this.legendMahele)&&this.refreshLegend()});const e=t.canvas;let n=0;e.addEventListener("pointermove",i=>{if(i.buttons||i.pointerType==="touch")return this.hover(null);const o=performance.now();o-n<70||(n=o,this.hover(i.clientX,i.clientY))}),e.addEventListener("pointerleave",()=>this.hover(null)),e.addEventListener("pointerdown",()=>this.hover(null)),addEventListener("keydown",i=>{var a,r,c,l;if(i.key==="Escape"){this.help.classList.contains("hidden")?this.card.close():this.help.classList.add("hidden");return}if((r=(a=i.target).closest)!=null&&r.call(a,"input, textarea, select")||i.altKey||i.ctrlKey||i.metaKey||!this.help.classList.contains("hidden"))return;const o=this.tour;i.key==="ArrowRight"||i.key===" "&&!((l=(c=i.target).closest)!=null&&l.call(c,"button, a"))?(i.preventDefault(),this.timeline.el.classList.remove("invite"),o.next()):i.key==="ArrowLeft"?(i.preventDefault(),o.back()):i.key===","||i.key==="<"?o.skip(-1):(i.key==="."||i.key===">")&&o.skip(1)})}openEvent(t){this.tour.open(t,{gentle:!0})}openCluster(t){const e=this.tour;this.pins.activeEvent=e.active?e.event:null,this.card.openList(t)}onCardClosed(){const t=this.tour;t.active&&t.event||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}onScrub(t=this.app.timeline.s){var i;this.tour.leave();const n=this.app.timeline;this.card.mode==="era"&&((i=this.card.chapter)==null?void 0:i.era)!==n.eraAt(t)&&this.card.close(),this.card.ev||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}freeBox(){const t=innerWidth,e=innerHeight,n={x0:16,y0:72,x1:t-16,y1:e-16},i=this.timeline.el;!i.hidden&&i.offsetHeight&&(n.y1=Math.min(n.y1,i.offsetTop-14));const o=this.card.el;if(this.syncCarded(),this.card.isOpen&&o.offsetWidth)if(o.offsetLeft>t*.35)n.x1=Math.min(n.x1,o.offsetLeft-16);else{n.y1=Math.min(n.y1,o.offsetTop-12);const a=this.legend;a.offsetHeight&&a.offsetTop<e/3&&(n.y0=Math.max(n.y0,a.offsetTop+a.offsetHeight+6))}return n.y1-n.y0<120&&(n.y1=n.y0+120),n}syncCarded(){const t=this.card.isOpen;t!==this.root.classList.contains("carded")&&this.root.classList.toggle("carded",t)}farStrength(t=this.app.rig.state.distance){const e=this.app.farView;return e==="land"||e==="mahele"?qa(t):Xc(t)}inspectorAllowed(){var i,o;const t=this.app,e=this.farStrength();return!!((i=t.districts)!=null&&i.on||((o=t.districts)==null?void 0:o.k)>0)||e<bb?this.nearHeld=!0:e>mf&&(this.nearHeld=!1),!this.nearHeld}hideInspector(){this.app.shared.uniforms.uHoverMoku.value=0,this.inspector.classList.remove("show"),this.inspectorKey=null}hover(t,e){var m;const n=this.app,i=n.shared.uniforms;if(t==null||!this.inspectorAllowed())return this.hideInspector();const o=n.rig.pickGround(t,e),a=o&&n.world.metresAt(o.x,o.z)>0?n.polity.mokuAt(o.x,o.z):null,r=n.farView,c=r==="land"&&n.landK>.25,l=r==="mahele"&&n.regionOn==="mahele"&&n.polityK>.25,h=Xc(n.rig.state.distance)<.05;if(i.uHoverMoku.value=a&&!c&&!h&&n.regionOn==="chiefdoms"?a.index:0,!a){this.inspector.classList.remove("show");return}const u=c?n.land.valuesAt(o.x,o.z):null,f=l?n.mahele.unitAt(o.x,o.z):null,d=`${a.index}:${(m=n.timeline.era)==null?void 0:m.id}:${u?JSON.stringify(u):""}:${f?f.gisId:""}`;if(this.inspectorKey!==d){this.inspectorKey=d;const p=n.polity.holder(n.timeline.era,a),x=(w,b)=>`<div class="in-row"><span class="in-k">${w}</span>${b}</div>`;this.inspector.innerHTML=f?Eb(f,a,x):`
        <div class="in-head"><b>${Et(a.name)}</b><span class="in-island">${Et(a.island||"")}</span></div>
        ${x("moku",p?`<span class="in-pol"><i style="background:${Et(p.colour)}"></i>${Et(p.name)}</span>`:'<span class="in-none">no polity recorded</span>')}
        ${u?x("fields",vf(u.cultivation))+x("people",Ab(u.people))+x("forest",vf(u.forest)):""}`}this.inspector.classList.add("show");const g=Math.min(innerWidth-250,t+18),v=Math.max(70,Math.min(innerHeight-120,e+18));this.inspector.style.transform=`translate(${g}px, ${v}px)`}refreshLegend(){var r;const t=this.app,e=t.timeline.era;this.legendEra=e,this.legendMahele=t.mahele.availableAt();const n=t.farView;for(const c of this.legend.querySelectorAll("[data-view]"))c.setAttribute("aria-pressed",String(n===c.dataset.view)),c.classList.toggle("on",n===c.dataset.view);const i=on('[data-view="land"]',this.legend);i.disabled=t.land.available===!1,i.title=i.disabled?"No land layers in this data":"Cultivation, settlement and forest in the chosen year";const o=on('[data-view="mahele"]',this.legend);o.disabled=!this.legendMahele,o.title=t.mahele.available===!1?"No Māhele in this data":this.legendMahele?gf:`The land division, from ${$a}`;let a="";if(n==="mahele"){const c=this.islandInView(),l=t.mahele.counts(c==null?void 0:c.pack.id);l.all&&(a=`<div class="lg-title">The Māhele of ${$a}</div>${Oo.map(h=>`<div class="lg lg-mahele"><i style="background:${Et(h.colour)}"></i><b>${Et(h.name)}</b><em>${l.byClass[h.id].toLocaleString("en-US")}</em></div>`).join("")}<div class="lg-note">${Et(`${l.all.toLocaleString("en-US")} ahupuaʻa ${c?`on ${c.pack.name}`:"on all the islands"}`)}</div>`),this.legendIsland=(c==null?void 0:c.pack.id)??null}else if(n==="chiefdoms"){const c=t.polity.politiesIn(e);c.length&&(a=`<div class="lg-title">${Et((e==null?void 0:e.label)||"")}</div>${c.map(l=>`<div class="lg"><i style="background:${Et(l.colour)}"></i><b>${Et(l.name)}</b></div>`).join("")}`)}else if(n==="land"){const c=t.land.describe(),l=((r=t.works)==null?void 0:r.legendRows())??[];if(this.legendLand=JSON.stringify([c,l]),c){const h=c.years.length>1?`between the ${c.years[0]} and ${c.years[1]} layers`:`the ${c.years[0]} layers`,u=t.land.bound?c.early?`${h}, thinned for the early centuries`:h:"the layers are on their way";a=`<div class="lg-title">${Et((e==null?void 0:e.label)||"")}</div>${c.layers.map(f=>`<div class="lg lg-land"><i class="sw-${f.id}"></i><b>${Et(f.name)}</b>${f.note?`<em>${Et(f.note)}</em>`:""}</div>`).join("")}${l.map(f=>`<div class="lg lg-land lg-works"><i class="sw-${f.id}"></i><b>${Et(f.name)}</b></div>`).join("")}<div class="lg-note">${Et(u)}</div>`}}this.legendBody.innerHTML=a}setLoading(t){on(".loading",this.brand).textContent=t||""}update(t){var o;const e=this.app,n=performance.now();this.timeline.update(t),this.pins.update(e.overlay.pins);const i=this.farStrength()>mf;if(i!==this.legend.classList.contains("show")&&(this.legend.classList.toggle("show",i),this.legend.inert=!i),!this.inspectorAllowed()&&(this.inspector.classList.contains("show")||e.shared.uniforms.uHoverMoku.value)&&this.hideInspector(),this.syncCarded(),e.farView==="land"&&n-(this.landAt||0)>250&&(this.landAt=n,(JSON.stringify([e.land.describe(),((o=e.works)==null?void 0:o.legendRows())??[]])!==this.legendLand||!e.land.bound!==this.legendWaiting)&&(this.legendWaiting=!e.land.bound,this.refreshLegend())),n-(this.whereAt||0)>300){this.whereAt=n;const a=this.islandInView();on(".where",this.brand).textContent=a?a.pack.name:e.world.archPack.name,e.farView==="mahele"&&((a==null?void 0:a.pack.id)??null)!==this.legendIsland&&this.refreshLegend()}}islandInView(){const t=this.app.rig.state;return t.distance<1400?this.app.world.islandAt(t.target.x,t.target.z):null}}function Eb(s,t,e){const n=s.entry,i=Sc.get(s.cls),o=l=>`<i style="background:${Et(l.colour)}"></i>`;let a=`<span class="in-pol">${o(i)}${Et(i.name)}</span>`;if(s.cls==="mixed"){const l=[...new Set(((n==null?void 0:n.parts)||[]).map(h=>h.class))].map(h=>Sc.get(h)).filter(Boolean);l.length>1&&(a=`<span class="in-pol">${o(i)}${Et(i.name)}</span><span class="in-v">${Et(l.map(h=>h.name.toLowerCase()).join(" and "))}</span>`)}const r=n&&(s.cls==="konohiki"||s.cls==="mixed")?[].concat(n.awardee||[]).filter(Boolean):[],c=((n==null?void 0:n.later)||[]).map(l=>{var h;return`${((h=Sc.get(l.class))==null?void 0:h.name.toLowerCase())||l.class}, ${l.year}`});return`
    <div class="in-head"><b>${Et(s.name||"Ahupuaʻa")}</b><span class="in-island">${Et(s.island||t.island||"")}</span></div>
    ${e("moku",`<span class="in-v">${Et(s.moku||t.name)}</span>`)}
    ${e("land",a)}
    ${r.length?e("awarded",`<span class="in-v">${Et(r.join(", "))}</span>`):""}
    ${c.length?e("later",`<span class="in-v">${Et(c.join("; "))}</span>`):""}`}function vf(s){const t=s*100;return t<.5?'<span class="in-none">none</span>':t<1?"under 1%":`${Math.round(t)}%`}function Ab(s){return s<.5?'<span class="in-none">none</span>':`about ${(s<10?Math.round(s):Number(s.toPrecision(2))).toLocaleString("en-US")} a km²`}function Ec(s){return s.map(t=>`<li>${t.url&&/^https?:/.test(t.url)?`<a href="${Et(t.url)}" target="_blank" rel="noopener">${Et(t.title||t.id)}</a>`:Et(t.title||t.id)}${t.licence?` <em>${Et(t.licence)}</em>`:""}${t.fetched?` <em>fetched ${Et(t.fetched)}</em>`:""}</li>`).join("")}const mr=document.getElementById("boot"),Zd=mr.querySelector(".boot-bar span"),Jd=mr.querySelector(".boot-stage"),Oa=(s,t)=>{Jd.textContent=s,Zd.style.width=`${Math.round(t*100)}%`},Us=s=>{console.warn(s)};async function Tb(){const s=performance.now();Oa("reading the gazetteer",.05);const t=await fp(ap(),Us);if(!t.packs.length)throw new Error("the manifest lists no packs");const e=new ub(document.getElementById("scene"),t,{warn:Us});window.__app=e;const n=new pp(2,Us);Oa("raising the islands",.25);const i=e.world.archPack;i.data=await n.decode(i),Oa("placing the boundaries",.8),await new Promise(c=>setTimeout(c,0)),e.start();const o=new Sb(e);e.ui=o,console.log(`archipelago ready in ${((performance.now()-s)/1e3).toFixed(1)} s`),Oa("",1);let a=0;const r=()=>{if(++a<4)return requestAnimationFrame(r);mr.classList.add("gone"),setTimeout(()=>mr.remove(),1200),Cb(e,o,n),e.patches.load().catch(c=>{Us(`patches: ${c.message}`),e.patches.resolveReady([])}),e.districts.load().catch(c=>Us(`districts: ${c.message}`))};requestAnimationFrame(r)}async function Cb(s,t,e){const n=s.rig.state.target,i=r=>Math.hypot((r.rect.x0+r.rect.x1)/2-n.x,(r.rect.z0+r.rect.z1)/2-n.z),o=[...s.world.islandPacks].sort((r,c)=>i(r)-i(c));let a=0;t.setLoading(o.length?`· ${o.length} islands to come`:""),await Promise.all(o.map(async r=>{try{r.data=await e.decode(r),s.addIsland(r)}catch(c){Us(`${r.id}: ${c.message}`)}a++,t.setLoading(a<o.length?`· ${o.length-a} islands to come`:"")})),e.dispose(),s.islandsLoaded=!0,s.land.load()}Tb().catch(s=>{console.error(s),Jd.textContent="something went wrong — see the console",Zd.style.background="#c0584a"});
