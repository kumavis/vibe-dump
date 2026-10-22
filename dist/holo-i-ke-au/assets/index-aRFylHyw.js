var tf=Object.defineProperty;var ef=(s,t,e)=>t in s?tf(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var Da=(s,t,e)=>ef(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const ws=100,nf=8,xc=9e3,ir=1.3,sf=5.5,_c=100,rf=6e3;function Mc(s){const t=Math.log(Math.max(1,s)/_c)/Math.log(rf/_c),e=Math.max(0,Math.min(1,t));return ir+(sf-ir)*e*e*(3-2*e)}const zh=2,Un=5,_s=32,Fn=16,Fh=1.6,Qe={far:115,near:75,rig:[95,135],margin:7,band:.5,prefetch:320,linger:25,hold:90},af=.024;function of(){const t=new URLSearchParams(location.search).get("data")||"./data/";return t.endsWith("/")?t:`${t}/`}const cf=Math.PI/180;class lf{constructor({lat0:t=20.5,lon0:e=-157.5}={}){this.lat0=t,this.lon0=e,this.kx=Math.cos(t*cf)*111320/ws,this.kz=110574/ws}x(t){return(t-this.lon0)*this.kx}z(t){return-(t-this.lat0)*this.kz}toWorld(t){return[this.x(t[0]),this.z(t[1])]}toLonLat(t,e){return[t/this.kx+this.lon0,-e/this.kz+this.lat0]}rect([t,e,n,i]){return{x0:this.x(t),z0:this.z(i),x1:this.x(n),z1:this.z(e)}}}function ta(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[ʻʼ‘’'`]/g,"").toLowerCase().replace(/[^a-z]/g,"")}function un(s){if(!s)return null;if(s.type==="Point")return s.coordinates;if(s.type==="LineString")return s.coordinates[Math.floor(s.coordinates.length/2)];if(s.type==="MultiPoint")return s.coordinates[0];const t=s.type==="Polygon"?[s.coordinates[0]]:s.type==="MultiPolygon"?s.coordinates.map(r=>r[0]):null;if(!t)return null;let e=0,n=0,i=0;for(const r of t)for(let a=0,o=r.length-1;a<r.length;o=a++){const c=r[o][0]*r[a][1]-r[a][0]*r[o][1];e+=c,n+=(r[o][0]+r[a][0])*c,i+=(r[o][1]+r[a][1])*c}return Math.abs(e)<1e-12?t[0][0]:[n/(3*e),i/(3*e)]}async function vi(s){var l;const t=await fetch(s);if(!t.ok)throw new Error(`${s}: HTTP ${t.status}`);const e=await t.blob(),n=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),i=n.width,r=n.height;let a;typeof OffscreenCanvas<"u"?a=new OffscreenCanvas(i,r):(a=document.createElement("canvas"),a.width=i,a.height=r);const o=a.getContext("2d",{willReadFrequently:!0});o.imageSmoothingEnabled=!1,o.drawImage(n,0,0);const c=o.getImageData(0,0,i,r).data;return(l=n.close)==null||l.call(n),{px:c,W:i,H:r}}function kh(s,t,e,n,i,r=4){const a=new Float32Array(t*e);for(let o=0,c=0;o<t*e;o++,c+=r)a[o]=(s[c]*256+s[c+1])*n+i;return a}function Oh(s,t,e,n=4){const i=new Uint8Array(t*e);for(let r=0,a=0;r<t*e;r++,a+=n)i[r]=s[a];return i}function hf(s){let t=0,e=0;for(let n=0;n<s.length;n+=7)s[n]>0||(t++,s[n]>-1.6&&e++);return t>100&&e>t*.95}function uf(s,t,e,n,i){const r=vn(t,e,a=>s[a]>0,n,i);for(let a=0;a<s.length;a++){if(s[a]>0)continue;const o=r[a]/1e3;s[a]=-(1+30*o+3600*(1-Math.exp(-Math.max(0,o-.6)/6)))}}function In(s,t,e,n,i=1){let r=Float32Array.from(s);const a=new Float32Array(t*e),o=1/(2*n+1);for(let c=0;c<i;c++){for(let l=0;l<e;l++){const h=l*t;let u=0;for(let d=-n;d<=n;d++)u+=r[h+Math.min(t-1,Math.max(0,d))];for(let d=0;d<t;d++)a[h+d]=u*o,u+=r[h+Math.min(t-1,d+n+1)]-r[h+Math.max(0,d-n)]}for(let l=0;l<t;l++){let h=0;for(let u=-n;u<=n;u++)h+=a[Math.min(e-1,Math.max(0,u))*t+l];for(let u=0;u<e;u++)r[u*t+l]=h*o,h+=a[Math.min(e-1,u+n+1)*t+l]-a[Math.max(0,u-n)*t+l]}}return r}function yc(s,t,e,n,i,r){const a=r*r;let o=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let c=1;c<t;c++){let l=(s[c]+c*c*a-(s[n[o]]+n[o]*n[o]*a))/(2*a*(c-n[o]));for(;l<=i[o];)o--,l=(s[c]+c*c*a-(s[n[o]]+n[o]*n[o]*a))/(2*a*(c-n[o]));o++,n[o]=c,i[o]=l,i[o+1]=1/0}o=0;for(let c=0;c<t;c++){for(;i[o+1]<c;)o++;const l=(c-n[o])*r;e[c]=l*l+s[n[o]]}}function vn(s,t,e,n=1,i=1){const a=new Float64Array(s*t);for(let g=0;g<s*t;g++)a[g]=e(g)?0:1e20;const o=Math.max(s,t),c=new Float64Array(o),l=new Float64Array(o),h=new Int32Array(o),u=new Float64Array(o+1);for(let g=0;g<s;g++){for(let m=0;m<t;m++)c[m]=a[m*s+g];yc(c,t,l,h,u,i);for(let m=0;m<t;m++)a[m*s+g]=l[m]}const d=new Float32Array(s*t);for(let g=0;g<t;g++){const m=g*s;for(let x=0;x<s;x++)c[x]=a[m+x];yc(c,s,l,h,u,n);for(let x=0;x<s;x++)d[m+x]=Math.sqrt(l[x])}return d}function Bh(s,t,e,n,i){const r=Math.max(1,Math.round(Math.max(t,e)/512)),a=Math.ceil(t/r),o=Math.ceil(e/r),c=new Float32Array(a*o);for(let d=0;d<o;d++)for(let g=0;g<a;g++){let m=0,x=0;for(let p=d*r;p<Math.min(e,(d+1)*r);p++)for(let f=g*r;f<Math.min(t,(g+1)*r);f++)m+=Math.max(0,s[p*t+f]),x++;c[d*a+g]=m/x*ir}const l=new Float32Array(a*o),h=[1,2,3,5,7,10,14,19,26,34],u=[];for(let d=0;d<8;d++)u.push([Math.cos(d*Math.PI/4),Math.sin(d*Math.PI/4)]);for(let d=0;d<o;d++)for(let g=0;g<a;g++){const m=c[d*a+g];if(m<=0){l[d*a+g]=1;continue}let x=0;for(const[p,f]of u){let v=0;const _=Math.hypot(p*n,f*i)*r;for(const M of h){const w=Math.round(g+p*M),S=Math.round(d+f*M);if(w<0||S<0||w>=a||S>=o)break;const E=(c[S*a+w]-m)/(M*_);E>v&&(v=E)}x+=v/Math.sqrt(1+v*v)}l[d*a+g]=1-x/8*.95}return{data:l,w:a,h:o,f:r}}function Gh(s,t,e,n,i,r){const a=new Uint8Array(t*e*4),o=zh;for(let c=0;c<e;c++){const l=Math.max(0,c-1),h=Math.min(e-1,c+1);for(let u=0;u<t;u++){const d=c*t+u,g=Math.max(0,u-1),m=Math.min(t-1,u+1),x=(s[c*t+m]-s[c*t+g])/((m-g)*n),p=(s[h*t+u]-s[l*t+u])/((h-l)*i),f=-x*o,v=-p*o,_=Math.hypot(f,1,v);a[d*4]=Math.round((f/_*.5+.5)*255),a[d*4+1]=Math.round((1/_*.5+.5)*255),a[d*4+2]=Math.round((v/_*.5+.5)*255);let M=1;if(r){const w=Math.min(r.w-1.001,Math.max(0,(u+.5)/r.f-.5)),S=Math.min(r.h-1.001,Math.max(0,(c+.5)/r.f-.5)),E=w|0,C=S|0,y=w-E,b=S-C,R=C*r.w+E,P=r.data,F=Math.min(r.w-1,E+1)-E,I=Math.min(r.h-1,C+1)-C,z=P[R]+(P[R+F]-P[R])*y,N=P[R+I*r.w]+(P[R+I*r.w+F]-P[R+I*r.w])*y;M=z+(N-z)*b}a[d*4+3]=Math.round(Math.max(0,Math.min(1,M))*255)}}return a}function ff(s,t,e,n,i){const r=t*e,a=n*i/1e6,o=new Float32Array(r);let c=0,l=0;for(let p=0;p<r;p++)s[p]>0&&(o[p]=a,s[p]>c&&(c=s[p]),l++);if(!l)return o;const h=Math.min(65536,Math.ceil(c)+2),u=p=>Math.min(h-1,Math.floor(p/c*(h-2))),d=new Uint32Array(h+1);for(let p=0;p<r;p++)s[p]>0&&d[u(s[p])+1]++;for(let p=0;p<h;p++)d[p+1]+=d[p];const g=new Uint32Array(l),m=d.slice();for(let p=0;p<r;p++)s[p]>0&&(g[m[u(s[p])]++]=p);const x=Math.hypot(n,i);for(let p=l-1;p>=0;p--){const f=g[p],v=f%t,_=(f-v)/t,M=s[f];let w=-1,S=0;for(let E=-1;E<=1;E++){const C=_+E;if(!(C<0||C>=e))for(let y=-1;y<=1;y++){if(!y&&!E)continue;const b=v+y;if(b<0||b>=t)continue;const R=C*t+b,P=(M-s[R])/(y&&E?x:y?n:i);P>S&&(S=P,w=R)}}w>=0&&s[w]>0&&(o[w]+=o[f])}return o}function df(s,t,e,n,i,r){const a=e*n,o=new Uint8Array(a*4),c=ff(s,e,n,i,r),l=i*r/1e6,h=Math.max(.04,4*l),u=new Float32Array(a);for(let f=0;f<a;f++)u[f]=s[f]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,c[f])/h)/1.6)):0;const d=In(u,e,n,1,2),g=vn(e,n,f=>s[f]<=0,i,r),m=new Float32Array(a);for(let f=0;f<n;f++)for(let v=0;v<e;v++){const _=f*e+v;if(s[_]<=0||s[_]>9)continue;const M=Math.min(e-1,v+1),w=Math.max(0,v-1),S=Math.min(n-1,f+1),E=Math.max(0,f-1),C=Math.hypot((s[f*e+M]-s[f*e+w])/((M-w)*i),(s[S*e+v]-s[E*e+v])/((S-E)*r));m[_]=g[_]<260+Math.max(i,r)&&C<.12?1:0}const x=In(m,e,n,1,1),p=1.5*Math.min(1,70/Math.max(i,r));for(let f=0;f<a;f++)o[f*4]=t?t[f]:s[f]>0?82:0,o[f*4+1]=Math.round(255*Math.min(1,x[f]*p)),o[f*4+2]=Math.round(255*Math.min(1,d[f]*1.6)),o[f*4+3]=0;return o}function pf({heightPx:s,rainPx:t,W:e,H:n,scale:i,offset:r,mx:a,mz:o,stride:c=4}){const l=kh(s,e,n,i,r,c),h=hf(l);h&&uf(l,e,n,a,o);const u=t?Oh(t,e,n,c):null,d=Bh(l,e,n,a,o),g=Gh(l,e,n,a,o,d),m=df(l,u,e,n,a,o);let x=1/0,p=-1/0;for(let f=0;f<l.length;f++)l[f]<x&&(x=l[f]),l[f]>p&&(p=l[f]);return{metres:l,normals:g,land:m,flatSea:h,lo:x,hi:p}}async function oi(s,t,e){try{const n=await fetch(s);if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}catch(n){if(t===void 0)throw new Error(`${s}: ${n.message}`);return e==null||e(`${s}: ${n.message} (carrying on without it)`),t}}const pr=(s,t)=>Array.isArray(s)?s:Array.isArray(s==null?void 0:s[t])?s[t]:[];async function mf(s,t=console.warn){const e=g=>new URL(g,new URL(s,location.href)).href,n=await oi(e("manifest.json")),[i,r,a,o,c,l,h]=await Promise.all([oi(e("boundaries/moku.geojson"),null,t),oi(e("boundaries/ahupuaa.geojson"),null,t),oi(e("eras.json"),[],t),oi(e("places.json"),[],t),oi(e("events.json"),[],t),oi(e("sources.json"),[],t),oi(e("polities.json"),{polities:[],byEra:{}},t)]),u=new lf(n.projection||{}),d=(n.packs||[]).map(g=>gf(g,u,e));return{base:s,abs:e,manifest:n,proj:u,packs:d,moku:i,ahupuaa:r,eras:pr(a,"eras"),places:pr(o,"places"),events:pr(c,"events"),sources:pr(l,"sources"),polities:{polities:(h==null?void 0:h.polities)||[],byEra:(h==null?void 0:h.byEra)||{}}}}function gf(s,t,e){var a;const n=t.rect(s.bounds),[i,r]=s.size;return{id:s.id,kind:s.kind,name:s.name||s.id,desc:s,rect:n,W:i,H:r,mx:(n.x1-n.x0)*ws/i,mz:(n.z1-n.z0)*ws/r,heightUrl:e(s.height.file),rainUrl:(a=s.rain)!=null&&a.file?e(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,sources:s.sources||[],data:null}}class vf{constructor(t=2,e=console.warn){this.warn=e,this.jobs=new Map,this.next=1,this.workers=[],this.free=[],this.queue=[];try{for(let n=0;n<t;n++){const i=new Worker(new URL(""+new URL("worker-D-2AoFNa.js",import.meta.url).href,import.meta.url),{type:"module"});i.onmessage=r=>this.message(i,r.data),i.onerror=r=>{var a;(a=r.preventDefault)==null||a.call(r),this.fallback=!0;for(const[o,c]of this.jobs)c.worker===i&&this.mainThread(o,c)},this.workers.push(i),this.free.push(i)}}catch{this.fallback=!0}}decode(t){return new Promise((e,n)=>{const i=this.next++,r={pack:t,resolve:e,reject:n};this.jobs.set(i,r),this.fallback||!this.workers.length?this.mainThread(i,r):(this.queue.push(i),this.pump())})}pump(){for(;this.free.length&&this.queue.length;){const t=this.queue.shift(),e=this.jobs.get(t),n=this.free.pop();e.worker=n;const i=e.pack;n.postMessage({job:t,heightUrl:i.heightUrl,rainUrl:i.rainUrl,W:i.W,H:i.H,scale:i.scale,offset:i.offset,mx:i.mx,mz:i.mz})}}message(t,e){const n=this.jobs.get(e.job);if(n){if(e.warn)return this.warn(e.warn);this.jobs.delete(e.job),this.free.push(t),e.ok?n.resolve(e):/OffscreenCanvas|getContext|createImageBitmap/i.test(e.message)?(this.fallback=!0,this.jobs.set(e.job,n),this.mainThread(e.job,n)):n.reject(new Error(e.message)),this.pump()}}async mainThread(t,e){try{const n=e.pack,i=await vi(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);let r=null;n.rainUrl&&(r=await vi(n.rainUrl).then(o=>o.W===n.W&&o.H===n.H?o.px:null).catch(()=>null));const a=pf({heightPx:i.px,rainPx:r,W:n.W,H:n.H,scale:n.scale,offset:n.offset,mx:n.mx,mz:n.mz});this.jobs.delete(t),e.resolve(a)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){for(const t of this.workers)t.terminate()}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Yo="160",xf=0,wc=1,_f=2,Hh=1,Mf=2,Yn=3,ri=0,Ye=1,An=2,ii=0,Ms=1,To=2,bc=3,Ro=4,yf=5,Di=100,wf=101,bf=102,Sc=103,Ec=104,Sf=200,Ef=201,Af=202,Tf=203,Co=204,Lo=205,Rf=206,Cf=207,Lf=208,Pf=209,Df=210,If=211,Uf=212,Nf=213,zf=214,Ff=0,kf=1,Of=2,sa=3,Bf=4,Gf=5,Hf=6,Vf=7,Vh=0,Wf=1,$f=2,gi=0,Xf=1,qf=2,jf=3,Yf=4,Kf=5,Zf=6,Wh=300,bs=301,Ss=302,Po=303,Do=304,_a=306,ra=1e3,qe=1001,Io=1002,re=1003,Ac=1004,Ia=1005,De=1006,Jf=1007,Gi=1008,ge=1009,Qf=1010,td=1011,Ko=1012,$h=1013,Qn=1014,ti=1015,xi=1016,Xh=1017,qh=1018,ki=1020,ed=1021,Se=1023,nd=1024,id=1025,Oi=1026,Es=1027,Vi=1028,jh=1029,Yh=1030,Kh=1031,Zh=1033,Ua=33776,Na=33777,za=33778,Fa=33779,Tc=35840,Rc=35841,Cc=35842,Lc=35843,Jh=36196,Pc=37492,Dc=37496,Ic=37808,Uc=37809,Nc=37810,zc=37811,Fc=37812,kc=37813,Oc=37814,Bc=37815,Gc=37816,Hc=37817,Vc=37818,Wc=37819,$c=37820,Xc=37821,ka=36492,qc=36494,jc=36495,sd=36283,Yc=36284,Kc=36285,Zc=36286,Qh=3e3,Bi=3001,rd=3200,ad=3201,od=0,cd=1,xn="",Pe="srgb",ai="srgb-linear",Zo="display-p3",Ma="display-p3-linear",aa="linear",he="srgb",oa="rec709",ca="p3",qi=7680,Jc=519,ld=512,hd=513,ud=514,tu=515,fd=516,dd=517,pd=518,md=519,Qc=35044,ei=35048,tl="300 es",Uo=1035,ni=2e3,la=2001;class Ts{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let el=1234567;const Ws=Math.PI/180,sr=180/Math.PI;function Rs(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[s&255]+Ne[s>>8&255]+Ne[s>>16&255]+Ne[s>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function Xe(s,t,e){return Math.max(t,Math.min(e,s))}function Jo(s,t){return(s%t+t)%t}function gd(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function vd(s,t,e){return s!==t?(e-s)/(t-s):0}function $s(s,t,e){return(1-e)*s+e*t}function xd(s,t,e,n){return $s(s,t,1-Math.exp(-e*n))}function _d(s,t=1){return t-Math.abs(Jo(s,t*2)-t)}function Md(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function yd(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function wd(s,t){return s+Math.floor(Math.random()*(t-s+1))}function bd(s,t){return s+Math.random()*(t-s)}function Sd(s){return s*(.5-Math.random())}function Ed(s){s!==void 0&&(el=s);let t=el+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ad(s){return s*Ws}function Td(s){return s*sr}function No(s){return(s&s-1)===0&&s!==0}function Rd(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function ha(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Cd(s,t,e,n,i){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),g=r((n-t)/2),m=a((n-t)/2);switch(i){case"XYX":s.set(o*h,c*u,c*d,o*l);break;case"YZY":s.set(c*d,o*h,c*u,o*l);break;case"ZXZ":s.set(c*u,c*d,o*h,o*l);break;case"XZX":s.set(o*h,c*m,c*g,o*l);break;case"YXY":s.set(c*g,o*h,c*m,o*l);break;case"ZYZ":s.set(c*m,c*g,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function fs(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ve(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Oe={DEG2RAD:Ws,RAD2DEG:sr,generateUUID:Rs,clamp:Xe,euclideanModulo:Jo,mapLinear:gd,inverseLerp:vd,lerp:$s,damp:xd,pingpong:_d,smoothstep:Md,smootherstep:yd,randInt:wd,randFloat:bd,randFloatSpread:Sd,seededRandom:Ed,degToRad:Ad,radToDeg:Td,isPowerOfTwo:No,ceilPowerOfTwo:Rd,floorPowerOfTwo:ha,setQuaternionFromProperEuler:Cd,normalize:Ve,denormalize:fs};class zt{constructor(t=0,e=0){zt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qt{constructor(t,e,n,i,r,a,o,c,l){qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,c,l)}set(t,e,n,i,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],g=n[5],m=n[8],x=i[0],p=i[3],f=i[6],v=i[1],_=i[4],M=i[7],w=i[2],S=i[5],E=i[8];return r[0]=a*x+o*v+c*w,r[3]=a*p+o*_+c*S,r[6]=a*f+o*M+c*E,r[1]=l*x+h*v+u*w,r[4]=l*p+h*_+u*S,r[7]=l*f+h*M+u*E,r[2]=d*x+g*v+m*w,r[5]=d*p+g*_+m*S,r[8]=d*f+g*M+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*r,g=l*r-a*c,m=e*u+n*d+i*g;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return t[0]=u*x,t[1]=(i*l-h*n)*x,t[2]=(o*n-i*a)*x,t[3]=d*x,t[4]=(h*e-i*c)*x,t[5]=(i*r-o*e)*x,t[6]=g*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-i*l,i*c,-i*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Oa.makeScale(t,e)),this}rotate(t){return this.premultiply(Oa.makeRotation(-t)),this}translate(t,e){return this.premultiply(Oa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Oa=new qt;function eu(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function ua(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Ld(){const s=ua("canvas");return s.style.display="block",s}const nl={};function Xs(s){s in nl||(nl[s]=!0,console.warn(s))}const il=new qt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),sl=new qt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),mr={[ai]:{transfer:aa,primaries:oa,toReference:s=>s,fromReference:s=>s},[Pe]:{transfer:he,primaries:oa,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Ma]:{transfer:aa,primaries:ca,toReference:s=>s.applyMatrix3(sl),fromReference:s=>s.applyMatrix3(il)},[Zo]:{transfer:he,primaries:ca,toReference:s=>s.convertSRGBToLinear().applyMatrix3(sl),fromReference:s=>s.applyMatrix3(il).convertLinearToSRGB()}},Pd=new Set([ai,Ma]),se={enabled:!0,_workingColorSpace:ai,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Pd.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=mr[t].toReference,i=mr[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return mr[s].primaries},getTransfer:function(s){return s===xn?aa:mr[s].transfer}};function ys(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ba(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ji;class nu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ji===void 0&&(ji=ua("canvas")),ji.width=t.width,ji.height=t.height;const n=ji.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ji}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ua("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=ys(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ys(e[n]/255)*255):e[n]=ys(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Dd=0;class iu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Dd++}),this.uuid=Rs(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Ga(i[a].image)):r.push(Ga(i[a]))}else r=Ga(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function Ga(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?nu.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Id=0;class en extends Ts{constructor(t=en.DEFAULT_IMAGE,e=en.DEFAULT_MAPPING,n=qe,i=qe,r=De,a=Gi,o=Se,c=ge,l=en.DEFAULT_ANISOTROPY,h=xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=Rs(),this.name="",this.source=new iu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new zt(0,0),this.repeat=new zt(1,1),this.center=new zt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Xs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Bi?Pe:xn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Wh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ra:t.x=t.x-Math.floor(t.x);break;case qe:t.x=t.x<0?0:1;break;case Io:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ra:t.y=t.y-Math.floor(t.y);break;case qe:t.y=t.y<0?0:1;break;case Io:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Xs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Pe?Bi:Qh}set encoding(t){Xs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Bi?Pe:xn}}en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=Wh;en.DEFAULT_ANISOTROPY=1;class Zt{constructor(t=0,e=0,n=0,i=1){Zt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],g=c[5],m=c[9],x=c[2],p=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+p)<.1&&Math.abs(l+g+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(l+1)/2,M=(g+1)/2,w=(f+1)/2,S=(h+d)/4,E=(u+x)/4,C=(m+p)/4;return _>M&&_>w?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=S/n,r=E/n):M>w?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=S/i,r=C/i):w<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(w),n=E/r,i=C/r),this.set(n,i,r,e),this}let v=Math.sqrt((p-m)*(p-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(p-m)/v,this.y=(u-x)/v,this.z=(d-h)/v,this.w=Math.acos((l+g+f-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ud extends Ts{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Zt(0,0,t,e),this.scissorTest=!1,this.viewport=new Zt(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(Xs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Bi?Pe:xn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:De,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new en(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new iu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Gn extends Ud{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class su extends en{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=re,this.minFilter=re,this.wrapR=qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nd extends en{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=re,this.minFilter=re,this.wrapR=qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Wi{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const d=r[a+0],g=r[a+1],m=r[a+2],x=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=g,t[e+2]=m,t[e+3]=x;return}if(u!==x||c!==d||l!==g||h!==m){let p=1-o;const f=c*d+l*g+h*m+u*x,v=f>=0?1:-1,_=1-f*f;if(_>Number.EPSILON){const w=Math.sqrt(_),S=Math.atan2(w,f*v);p=Math.sin(p*S)/w,o=Math.sin(o*S)/w}const M=o*v;if(c=c*p+d*M,l=l*p+g*M,h=h*p+m*M,u=u*p+x*M,p===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=w,l*=w,h*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[a],d=r[a+1],g=r[a+2],m=r[a+3];return t[e]=o*m+h*u+c*g-l*d,t[e+1]=c*m+h*d+l*u-o*g,t[e+2]=l*m+h*g+o*d-c*u,t[e+3]=h*m-o*u-c*d-l*g,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),u=o(r/2),d=c(n/2),g=c(i/2),m=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*g*m,this._y=l*g*u-d*h*m,this._z=l*h*m+d*g*u,this._w=l*h*u-d*g*m;break;case"YXZ":this._x=d*h*u+l*g*m,this._y=l*g*u-d*h*m,this._z=l*h*m-d*g*u,this._w=l*h*u+d*g*m;break;case"ZXY":this._x=d*h*u-l*g*m,this._y=l*g*u+d*h*m,this._z=l*h*m+d*g*u,this._w=l*h*u-d*g*m;break;case"ZYX":this._x=d*h*u-l*g*m,this._y=l*g*u+d*h*m,this._z=l*h*m-d*g*u,this._w=l*h*u+d*g*m;break;case"YZX":this._x=d*h*u+l*g*m,this._y=l*g*u+d*h*m,this._z=l*h*m-d*g*u,this._w=l*h*u-d*g*m;break;case"XZY":this._x=d*h*u-l*g*m,this._y=l*g*u-d*h*m,this._z=l*h*m+d*g*u,this._w=l*h*u+d*g*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const g=.5/Math.sqrt(d+1);this._w=.25/g,this._x=(h-c)*g,this._y=(r-l)*g,this._z=(a-i)*g}else if(n>o&&n>u){const g=2*Math.sqrt(1+n-o-u);this._w=(h-c)/g,this._x=.25*g,this._y=(i+a)/g,this._z=(r+l)/g}else if(o>u){const g=2*Math.sqrt(1+o-n-u);this._w=(r-l)/g,this._x=(i+a)/g,this._y=.25*g,this._z=(c+h)/g}else{const g=2*Math.sqrt(1+u-n-o);this._w=(a-i)/g,this._x=(r+l)/g,this._y=(c+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+i*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const g=1-e;return this._w=g*a+e*this._w,this._x=g*n+e*this._x,this._y=g*i+e*this._y,this._z=g*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(r),n*Math.cos(r),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(t=0,e=0,n=0){O.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*i-o*n),h=2*(o*e-r*i),u=2*(r*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=i+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ha.copy(this).projectOnVector(t),this.sub(Ha)}reflect(t){return this.sub(Ha.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ha=new O,rl=new Wi;class _n{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Mn):Mn.fromBufferAttribute(r,a),Mn.applyMatrix4(t.matrixWorld),this.expandByPoint(Mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),gr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),gr.copy(n.boundingBox)),gr.applyMatrix4(t.matrixWorld),this.union(gr)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Mn),Mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ds),vr.subVectors(this.max,Ds),Yi.subVectors(t.a,Ds),Ki.subVectors(t.b,Ds),Zi.subVectors(t.c,Ds),ci.subVectors(Ki,Yi),li.subVectors(Zi,Ki),bi.subVectors(Yi,Zi);let e=[0,-ci.z,ci.y,0,-li.z,li.y,0,-bi.z,bi.y,ci.z,0,-ci.x,li.z,0,-li.x,bi.z,0,-bi.x,-ci.y,ci.x,0,-li.y,li.x,0,-bi.y,bi.x,0];return!Va(e,Yi,Ki,Zi,vr)||(e=[1,0,0,0,1,0,0,0,1],!Va(e,Yi,Ki,Zi,vr))?!1:(xr.crossVectors(ci,li),e=[xr.x,xr.y,xr.z],Va(e,Yi,Ki,Zi,vr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Wn=[new O,new O,new O,new O,new O,new O,new O,new O],Mn=new O,gr=new _n,Yi=new O,Ki=new O,Zi=new O,ci=new O,li=new O,bi=new O,Ds=new O,vr=new O,xr=new O,Si=new O;function Va(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Si.fromArray(s,r);const o=i.x*Math.abs(Si.x)+i.y*Math.abs(Si.y)+i.z*Math.abs(Si.z),c=t.dot(Si),l=e.dot(Si),h=n.dot(Si);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const zd=new _n,Is=new O,Wa=new O;class Mi{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):zd.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Is.subVectors(t,this.center);const e=Is.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Is,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Wa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Is.copy(t.center).add(Wa)),this.expandByPoint(Is.copy(t.center).sub(Wa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const $n=new O,$a=new O,_r=new O,hi=new O,Xa=new O,Mr=new O,qa=new O;class Qo{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,$n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=$n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):($n.copy(this.origin).addScaledVector(this.direction,e),$n.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){$a.copy(t).add(e).multiplyScalar(.5),_r.copy(e).sub(t).normalize(),hi.copy(this.origin).sub($a);const r=t.distanceTo(e)*.5,a=-this.direction.dot(_r),o=hi.dot(this.direction),c=-hi.dot(_r),l=hi.lengthSq(),h=Math.abs(1-a*a);let u,d,g,m;if(h>0)if(u=a*c-o,d=a*o-c,m=r*h,u>=0)if(d>=-m)if(d<=m){const x=1/h;u*=x,d*=x,g=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),g=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),g=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),g=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-r,-c),r),g=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),g=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),g=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy($a).addScaledVector(_r,d),g}intersectSphere(t,e){$n.subVectors(t.center,this.origin);const n=$n.dot(this.direction),i=$n.dot($n)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,i=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,i=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,$n)!==null}intersectTriangle(t,e,n,i,r){Xa.subVectors(e,t),Mr.subVectors(n,t),qa.crossVectors(Xa,Mr);let a=this.direction.dot(qa),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;hi.subVectors(this.origin,t);const c=o*this.direction.dot(Mr.crossVectors(hi,Mr));if(c<0)return null;const l=o*this.direction.dot(Xa.cross(hi));if(l<0||c+l>a)return null;const h=-o*hi.dot(qa);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ee{constructor(t,e,n,i,r,a,o,c,l,h,u,d,g,m,x,p){ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,c,l,h,u,d,g,m,x,p)}set(t,e,n,i,r,a,o,c,l,h,u,d,g,m,x,p){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=i,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=g,f[7]=m,f[11]=x,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ee().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/Ji.setFromMatrixColumn(t,0).length(),r=1/Ji.setFromMatrixColumn(t,1).length(),a=1/Ji.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,g=a*u,m=o*h,x=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=g+m*l,e[5]=d-x*l,e[9]=-o*c,e[2]=x-d*l,e[6]=m+g*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,g=c*u,m=l*h,x=l*u;e[0]=d+x*o,e[4]=m*o-g,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=g*o-m,e[6]=x+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,g=c*u,m=l*h,x=l*u;e[0]=d-x*o,e[4]=-a*u,e[8]=m+g*o,e[1]=g+m*o,e[5]=a*h,e[9]=x-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,g=a*u,m=o*h,x=o*u;e[0]=c*h,e[4]=m*l-g,e[8]=d*l+x,e[1]=c*u,e[5]=x*l+d,e[9]=g*l-m,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,g=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=x-d*u,e[8]=m*u+g,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=g*u+m,e[10]=d-x*u}else if(t.order==="XZY"){const d=a*c,g=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+x,e[5]=a*h,e[9]=g*u-m,e[2]=m*u-g,e[6]=o*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Fd,t,kd)}lookAt(t,e,n){const i=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),ui.crossVectors(n,an),ui.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),ui.crossVectors(n,an)),ui.normalize(),yr.crossVectors(an,ui),i[0]=ui.x,i[4]=yr.x,i[8]=an.x,i[1]=ui.y,i[5]=yr.y,i[9]=an.y,i[2]=ui.z,i[6]=yr.z,i[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],g=n[13],m=n[2],x=n[6],p=n[10],f=n[14],v=n[3],_=n[7],M=n[11],w=n[15],S=i[0],E=i[4],C=i[8],y=i[12],b=i[1],R=i[5],P=i[9],F=i[13],I=i[2],z=i[6],N=i[10],H=i[14],B=i[3],q=i[7],J=i[11],Q=i[15];return r[0]=a*S+o*b+c*I+l*B,r[4]=a*E+o*R+c*z+l*q,r[8]=a*C+o*P+c*N+l*J,r[12]=a*y+o*F+c*H+l*Q,r[1]=h*S+u*b+d*I+g*B,r[5]=h*E+u*R+d*z+g*q,r[9]=h*C+u*P+d*N+g*J,r[13]=h*y+u*F+d*H+g*Q,r[2]=m*S+x*b+p*I+f*B,r[6]=m*E+x*R+p*z+f*q,r[10]=m*C+x*P+p*N+f*J,r[14]=m*y+x*F+p*H+f*Q,r[3]=v*S+_*b+M*I+w*B,r[7]=v*E+_*R+M*z+w*q,r[11]=v*C+_*P+M*N+w*J,r[15]=v*y+_*F+M*H+w*Q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],g=t[14],m=t[3],x=t[7],p=t[11],f=t[15];return m*(+r*c*u-i*l*u-r*o*d+n*l*d+i*o*g-n*c*g)+x*(+e*c*g-e*l*d+r*a*d-i*a*g+i*l*h-r*c*h)+p*(+e*l*u-e*o*g-r*a*u+n*a*g+r*o*h-n*l*h)+f*(-i*o*h-e*c*u+e*o*d+i*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],g=t[11],m=t[12],x=t[13],p=t[14],f=t[15],v=u*p*l-x*d*l+x*c*g-o*p*g-u*c*f+o*d*f,_=m*d*l-h*p*l-m*c*g+a*p*g+h*c*f-a*d*f,M=h*x*l-m*u*l+m*o*g-a*x*g-h*o*f+a*u*f,w=m*u*c-h*x*c-m*o*d+a*x*d+h*o*p-a*u*p,S=e*v+n*_+i*M+r*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=v*E,t[1]=(x*d*r-u*p*r-x*i*g+n*p*g+u*i*f-n*d*f)*E,t[2]=(o*p*r-x*c*r+x*i*l-n*p*l-o*i*f+n*c*f)*E,t[3]=(u*c*r-o*d*r-u*i*l+n*d*l+o*i*g-n*c*g)*E,t[4]=_*E,t[5]=(h*p*r-m*d*r+m*i*g-e*p*g-h*i*f+e*d*f)*E,t[6]=(m*c*r-a*p*r-m*i*l+e*p*l+a*i*f-e*c*f)*E,t[7]=(a*d*r-h*c*r+h*i*l-e*d*l-a*i*g+e*c*g)*E,t[8]=M*E,t[9]=(m*u*r-h*x*r-m*n*g+e*x*g+h*n*f-e*u*f)*E,t[10]=(a*x*r-m*o*r+m*n*l-e*x*l-a*n*f+e*o*f)*E,t[11]=(h*o*r-a*u*r-h*n*l+e*u*l+a*n*g-e*o*g)*E,t[12]=w*E,t[13]=(h*x*i-m*u*i+m*n*d-e*x*d-h*n*p+e*u*p)*E,t[14]=(m*o*i-a*x*i-m*n*c+e*x*c+a*n*p-e*o*p)*E,t[15]=(a*u*i-h*o*i+h*n*c-e*u*c-a*n*d+e*o*d)*E,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,d=r*l,g=r*h,m=r*u,x=a*h,p=a*u,f=o*u,v=c*l,_=c*h,M=c*u,w=n.x,S=n.y,E=n.z;return i[0]=(1-(x+f))*w,i[1]=(g+M)*w,i[2]=(m-_)*w,i[3]=0,i[4]=(g-M)*S,i[5]=(1-(d+f))*S,i[6]=(p+v)*S,i[7]=0,i[8]=(m+_)*E,i[9]=(p-v)*E,i[10]=(1-(d+x))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=Ji.set(i[0],i[1],i[2]).length();const a=Ji.set(i[4],i[5],i[6]).length(),o=Ji.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],yn.copy(this);const l=1/r,h=1/a,u=1/o;return yn.elements[0]*=l,yn.elements[1]*=l,yn.elements[2]*=l,yn.elements[4]*=h,yn.elements[5]*=h,yn.elements[6]*=h,yn.elements[8]*=u,yn.elements[9]*=u,yn.elements[10]*=u,e.setFromRotationMatrix(yn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,i,r,a,o=ni){const c=this.elements,l=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i);let g,m;if(o===ni)g=-(a+r)/(a-r),m=-2*a*r/(a-r);else if(o===la)g=-a/(a-r),m=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=ni){const c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(a-r),d=(e+t)*l,g=(n+i)*h;let m,x;if(o===ni)m=(a+r)*u,x=-2*u;else if(o===la)m=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-g,c[2]=0,c[6]=0,c[10]=x,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ji=new O,yn=new ee,Fd=new O(0,0,0),kd=new O(1,1,1),ui=new O,yr=new O,an=new O,al=new ee,ol=new Wi;class ya{constructor(t=0,e=0,n=0,i=ya.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],g=i[10];switch(e){case"XYZ":this._y=Math.asin(Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,g),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Xe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,g),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Xe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-Xe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return al.makeRotationFromQuaternion(t),this.setFromRotationMatrix(al,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ol.setFromEuler(this),this.setFromQuaternion(ol,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ya.DEFAULT_ORDER="XYZ";class tc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Od=0;const cl=new O,Qi=new Wi,Xn=new ee,wr=new O,Us=new O,Bd=new O,Gd=new Wi,ll=new O(1,0,0),hl=new O(0,1,0),ul=new O(0,0,1),Hd={type:"added"},Vd={type:"removed"};class nn extends Ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=Rs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=nn.DEFAULT_UP.clone();const t=new O,e=new ya,n=new Wi,i=new O(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ee},normalMatrix:{value:new qt}}),this.matrix=new ee,this.matrixWorld=new ee,this.matrixAutoUpdate=nn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Qi.setFromAxisAngle(t,e),this.quaternion.multiply(Qi),this}rotateOnWorldAxis(t,e){return Qi.setFromAxisAngle(t,e),this.quaternion.premultiply(Qi),this}rotateX(t){return this.rotateOnAxis(ll,t)}rotateY(t){return this.rotateOnAxis(hl,t)}rotateZ(t){return this.rotateOnAxis(ul,t)}translateOnAxis(t,e){return cl.copy(t).applyQuaternion(this.quaternion),this.position.add(cl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ll,t)}translateY(t){return this.translateOnAxis(hl,t)}translateZ(t){return this.translateOnAxis(ul,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?wr.copy(t):wr.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(Us,wr,this.up):Xn.lookAt(wr,Us,this.up),this.quaternion.setFromRotationMatrix(Xn),i&&(Xn.extractRotation(i.matrixWorld),Qi.setFromRotationMatrix(Xn),this.quaternion.premultiply(Qi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Hd)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Vd)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Xn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,t,Bd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,Gd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++){const o=i[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),g=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),g.length>0&&(n.animations=g),m.length>0&&(n.nodes=m)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}nn.DEFAULT_UP=new O(0,1,0);nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const wn=new O,qn=new O,ja=new O,jn=new O,ts=new O,es=new O,fl=new O,Ya=new O,Ka=new O,Za=new O;let br=!1;class Sn{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),wn.subVectors(t,e),i.cross(wn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){wn.subVectors(i,e),qn.subVectors(n,e),ja.subVectors(t,e);const a=wn.dot(wn),o=wn.dot(qn),c=wn.dot(ja),l=qn.dot(qn),h=qn.dot(ja),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,g=(l*c-o*h)*d,m=(a*h-o*c)*d;return r.set(1-g-m,m,g)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,jn)===null?!1:jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getUV(t,e,n,i,r,a,o,c){return br===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),br=!0),this.getInterpolation(t,e,n,i,r,a,o,c)}static getInterpolation(t,e,n,i,r,a,o,c){return this.getBarycoord(t,e,n,i,jn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,jn.x),c.addScaledVector(a,jn.y),c.addScaledVector(o,jn.z),c)}static isFrontFacing(t,e,n,i){return wn.subVectors(n,e),qn.subVectors(t,e),wn.cross(qn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return wn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),wn.cross(qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Sn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Sn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,r){return br===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),br=!0),Sn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}getInterpolation(t,e,n,i,r){return Sn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return Sn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Sn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;ts.subVectors(i,n),es.subVectors(r,n),Ya.subVectors(t,n);const c=ts.dot(Ya),l=es.dot(Ya);if(c<=0&&l<=0)return e.copy(n);Ka.subVectors(t,i);const h=ts.dot(Ka),u=es.dot(Ka);if(h>=0&&u<=h)return e.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(ts,a);Za.subVectors(t,r);const g=ts.dot(Za),m=es.dot(Za);if(m>=0&&g<=m)return e.copy(r);const x=g*l-c*m;if(x<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector(es,o);const p=h*m-g*u;if(p<=0&&u-h>=0&&g-m>=0)return fl.subVectors(r,i),o=(u-h)/(u-h+(g-m)),e.copy(i).addScaledVector(fl,o);const f=1/(p+x+d);return a=x*f,o=d*f,e.copy(n).addScaledVector(ts,a).addScaledVector(es,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ru={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fi={h:0,s:0,l:0},Sr={h:0,s:0,l:0};function Ja(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Nt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Pe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=se.workingColorSpace){if(t=Jo(t,1),e=Xe(e,0,1),n=Xe(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Ja(a,r,t+1/3),this.g=Ja(a,r,t),this.b=Ja(a,r,t-1/3)}return se.toWorkingColorSpace(this,i),this}setStyle(t,e=Pe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Pe){const n=ru[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ys(t.r),this.g=ys(t.g),this.b=ys(t.b),this}copyLinearToSRGB(t){return this.r=Ba(t.r),this.g=Ba(t.g),this.b=Ba(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Pe){return se.fromWorkingColorSpace(ze.copy(this),t),Math.round(Xe(ze.r*255,0,255))*65536+Math.round(Xe(ze.g*255,0,255))*256+Math.round(Xe(ze.b*255,0,255))}getHexString(t=Pe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.fromWorkingColorSpace(ze.copy(this),e);const n=ze.r,i=ze.g,r=ze.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.fromWorkingColorSpace(ze.copy(this),e),t.r=ze.r,t.g=ze.g,t.b=ze.b,t}getStyle(t=Pe){se.fromWorkingColorSpace(ze.copy(this),t);const e=ze.r,n=ze.g,i=ze.b;return t!==Pe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(fi),this.setHSL(fi.h+t,fi.s+e,fi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(fi),t.getHSL(Sr);const n=$s(fi.h,Sr.h,e),i=$s(fi.s,Sr.s,e),r=$s(fi.l,Sr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ze=new Nt;Nt.NAMES=ru;let Wd=0;class rr extends Ts{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Rs(),this.name="",this.type="Material",this.blending=Ms,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Co,this.blendDst=Lo,this.blendEquation=Di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Nt(0,0,0),this.blendAlpha=0,this.depthFunc=sa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qi,this.stencilZFail=qi,this.stencilZPass=qi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ms&&(n.blending=this.blending),this.side!==ri&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Co&&(n.blendSrc=this.blendSrc),this.blendDst!==Lo&&(n.blendDst=this.blendDst),this.blendEquation!==Di&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==sa&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==qi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==qi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class au extends rr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Vh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const _e=new O,Er=new zt;class Ee{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Qc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=ti,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Er.fromBufferAttribute(this,e),Er.applyMatrix3(t),this.setXY(e,Er.x,Er.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix3(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix4(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.applyNormalMatrix(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.transformDirection(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=fs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=fs(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=fs(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=fs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=fs(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),i=Ve(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),i=Ve(i,this.array),r=Ve(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Qc&&(t.usage=this.usage),t}}class ou extends Ee{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class cu extends Ee{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ye extends Ee{constructor(t,e,n){super(new Float32Array(t),e,n)}}let $d=0;const pn=new ee,Qa=new nn,ns=new O,on=new _n,Ns=new _n,Ce=new O;class Ze extends Ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=Rs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(eu(t)?cu:ou)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new qt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pn.makeRotationFromQuaternion(t),this.applyMatrix4(pn),this}rotateX(t){return pn.makeRotationX(t),this.applyMatrix4(pn),this}rotateY(t){return pn.makeRotationY(t),this.applyMatrix4(pn),this}rotateZ(t){return pn.makeRotationZ(t),this.applyMatrix4(pn),this}translate(t,e,n){return pn.makeTranslation(t,e,n),this.applyMatrix4(pn),this}scale(t,e,n){return pn.makeScale(t,e,n),this.applyMatrix4(pn),this}lookAt(t){return Qa.lookAt(t),Qa.updateMatrix(),this.applyMatrix4(Qa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ns).negate(),this.translate(ns.x,ns.y,ns.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ye(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _n);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Ce.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Ce),Ce.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Ce)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new O,1/0);return}if(t){const n=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Ns.setFromBufferAttribute(o),this.morphTargetsRelative?(Ce.addVectors(on.min,Ns.min),on.expandByPoint(Ce),Ce.addVectors(on.max,Ns.max),on.expandByPoint(Ce)):(on.expandByPoint(Ns.min),on.expandByPoint(Ns.max))}on.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)Ce.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Ce));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ce.fromBufferAttribute(o,l),c&&(ns.fromBufferAttribute(t,l),Ce.add(ns)),i=Math.max(i,n.distanceToSquared(Ce))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,r=e.normal.array,a=e.uv.array,o=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ee(new Float32Array(4*o),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let b=0;b<o;b++)l[b]=new O,h[b]=new O;const u=new O,d=new O,g=new O,m=new zt,x=new zt,p=new zt,f=new O,v=new O;function _(b,R,P){u.fromArray(i,b*3),d.fromArray(i,R*3),g.fromArray(i,P*3),m.fromArray(a,b*2),x.fromArray(a,R*2),p.fromArray(a,P*2),d.sub(u),g.sub(u),x.sub(m),p.sub(m);const F=1/(x.x*p.y-p.x*x.y);isFinite(F)&&(f.copy(d).multiplyScalar(p.y).addScaledVector(g,-x.y).multiplyScalar(F),v.copy(g).multiplyScalar(x.x).addScaledVector(d,-p.x).multiplyScalar(F),l[b].add(f),l[R].add(f),l[P].add(f),h[b].add(v),h[R].add(v),h[P].add(v))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let b=0,R=M.length;b<R;++b){const P=M[b],F=P.start,I=P.count;for(let z=F,N=F+I;z<N;z+=3)_(n[z+0],n[z+1],n[z+2])}const w=new O,S=new O,E=new O,C=new O;function y(b){E.fromArray(r,b*3),C.copy(E);const R=l[b];w.copy(R),w.sub(E.multiplyScalar(E.dot(R))).normalize(),S.crossVectors(C,R);const F=S.dot(h[b])<0?-1:1;c[b*4]=w.x,c[b*4+1]=w.y,c[b*4+2]=w.z,c[b*4+3]=F}for(let b=0,R=M.length;b<R;++b){const P=M[b],F=P.start,I=P.count;for(let z=F,N=F+I;z<N;z+=3)y(n[z+0]),y(n[z+1]),y(n[z+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ee(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,g=n.count;d<g;d++)n.setXYZ(d,0,0,0);const i=new O,r=new O,a=new O,o=new O,c=new O,l=new O,h=new O,u=new O;if(t)for(let d=0,g=t.count;d<g;d+=3){const m=t.getX(d+0),x=t.getX(d+1),p=t.getX(d+2);i.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,p),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,p),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,g=e.count;d<g;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ce.fromBufferAttribute(t,e),Ce.normalize(),t.setXYZ(e,Ce.x,Ce.y,Ce.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let g=0,m=0;for(let x=0,p=c.length;x<p;x++){o.isInterleavedBufferAttribute?g=c[x]*o.data.stride+o.offset:g=c[x]*h;for(let f=0;f<h;f++)d[m++]=l[g++]}return new Ee(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ze,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=t(c,n);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],g=t(d,n);c.push(g)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const g=l[u];h.push(g.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,g=u.length;d<g;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const dl=new ee,Ei=new Qo,Ar=new Mi,pl=new O,is=new O,ss=new O,rs=new O,to=new O,Tr=new O,Rr=new zt,Cr=new zt,Lr=new zt,ml=new O,gl=new O,vl=new O,Pr=new O,Dr=new O;class me extends nn{constructor(t=new Ze,e=new au){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){Tr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(to.fromBufferAttribute(u,t),a?Tr.addScaledVector(to,h):Tr.addScaledVector(to.sub(e),h))}e.add(Tr)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ar.copy(n.boundingSphere),Ar.applyMatrix4(r),Ei.copy(t.ray).recast(t.near),!(Ar.containsPoint(Ei.origin)===!1&&(Ei.intersectSphere(Ar,pl)===null||Ei.origin.distanceToSquared(pl)>(t.far-t.near)**2))&&(dl.copy(r).invert(),Ei.copy(t.ray).applyMatrix4(dl),!(n.boundingBox!==null&&Ei.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ei)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,g=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const p=d[m],f=a[p.materialIndex],v=Math.max(p.start,g.start),_=Math.min(o.count,Math.min(p.start+p.count,g.start+g.count));for(let M=v,w=_;M<w;M+=3){const S=o.getX(M),E=o.getX(M+1),C=o.getX(M+2);i=Ir(this,f,t,n,l,h,u,S,E,C),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const m=Math.max(0,g.start),x=Math.min(o.count,g.start+g.count);for(let p=m,f=x;p<f;p+=3){const v=o.getX(p),_=o.getX(p+1),M=o.getX(p+2);i=Ir(this,a,t,n,l,h,u,v,_,M),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const p=d[m],f=a[p.materialIndex],v=Math.max(p.start,g.start),_=Math.min(c.count,Math.min(p.start+p.count,g.start+g.count));for(let M=v,w=_;M<w;M+=3){const S=M,E=M+1,C=M+2;i=Ir(this,f,t,n,l,h,u,S,E,C),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const m=Math.max(0,g.start),x=Math.min(c.count,g.start+g.count);for(let p=m,f=x;p<f;p+=3){const v=p,_=p+1,M=p+2;i=Ir(this,a,t,n,l,h,u,v,_,M),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function Xd(s,t,e,n,i,r,a,o){let c;if(t.side===Ye?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,t.side===ri,o),c===null)return null;Dr.copy(o),Dr.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(Dr);return l<e.near||l>e.far?null:{distance:l,point:Dr.clone(),object:s}}function Ir(s,t,e,n,i,r,a,o,c,l){s.getVertexPosition(o,is),s.getVertexPosition(c,ss),s.getVertexPosition(l,rs);const h=Xd(s,t,e,n,is,ss,rs,Pr);if(h){i&&(Rr.fromBufferAttribute(i,o),Cr.fromBufferAttribute(i,c),Lr.fromBufferAttribute(i,l),h.uv=Sn.getInterpolation(Pr,is,ss,rs,Rr,Cr,Lr,new zt)),r&&(Rr.fromBufferAttribute(r,o),Cr.fromBufferAttribute(r,c),Lr.fromBufferAttribute(r,l),h.uv1=Sn.getInterpolation(Pr,is,ss,rs,Rr,Cr,Lr,new zt),h.uv2=h.uv1),a&&(ml.fromBufferAttribute(a,o),gl.fromBufferAttribute(a,c),vl.fromBufferAttribute(a,l),h.normal=Sn.getInterpolation(Pr,is,ss,rs,ml,gl,vl,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new O,materialIndex:0};Sn.getNormal(is,ss,rs,u.normal),h.face=u}return h}class ar extends Ze{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,g=0;m("z","y","x",-1,-1,n,e,t,a,r,0),m("z","y","x",1,-1,n,e,-t,a,r,1),m("x","z","y",1,1,t,n,e,i,a,2),m("x","z","y",1,-1,t,n,-e,i,a,3),m("x","y","z",1,-1,t,e,n,i,r,4),m("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new ye(l,3)),this.setAttribute("normal",new ye(h,3)),this.setAttribute("uv",new ye(u,2));function m(x,p,f,v,_,M,w,S,E,C,y){const b=M/E,R=w/C,P=M/2,F=w/2,I=S/2,z=E+1,N=C+1;let H=0,B=0;const q=new O;for(let J=0;J<N;J++){const Q=J*R-F;for(let ut=0;ut<z;ut++){const j=ut*b-P;q[x]=j*v,q[p]=Q*_,q[f]=I,l.push(q.x,q.y,q.z),q[x]=0,q[p]=0,q[f]=S>0?1:-1,h.push(q.x,q.y,q.z),u.push(ut/E),u.push(1-J/C),H+=1}}for(let J=0;J<C;J++)for(let Q=0;Q<E;Q++){const ut=d+Q+z*J,j=d+Q+z*(J+1),tt=d+(Q+1)+z*(J+1),ft=d+(Q+1)+z*J;c.push(ut,j,ft),c.push(j,tt,ft),B+=6}o.addGroup(g,B,y),g+=B,d+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ar(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function As(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function We(s){const t={};for(let e=0;e<s.length;e++){const n=As(s[e]);for(const i in n)t[i]=n[i]}return t}function qd(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function lu(s){return s.getRenderTarget()===null?s.outputColorSpace:se.workingColorSpace}const jd={clone:As,merge:We};var Yd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class we extends rr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Yd,this.fragmentShader=Kd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=As(t.uniforms),this.uniformsGroups=qd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class hu extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ee,this.projectionMatrix=new ee,this.projectionMatrixInverse=new ee,this.coordinateSystem=ni}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class ln extends hu{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=sr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ws*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return sr*2*Math.atan(Math.tan(Ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ws*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,e-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const as=-90,os=1;class Zd extends nn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new ln(as,os,t,e);i.layers=this.layers,this.add(i);const r=new ln(as,os,t,e);r.layers=this.layers,this.add(r);const a=new ln(as,os,t,e);a.layers=this.layers,this.add(a);const o=new ln(as,os,t,e);o.layers=this.layers,this.add(o);const c=new ln(as,os,t,e);c.layers=this.layers,this.add(c);const l=new ln(as,os,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===ni)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===la)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),g=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,g),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class uu extends en{constructor(t,e,n,i,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:bs,super(t,e,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Jd extends Gn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(Xs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Bi?Pe:xn),this.texture=new uu(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:De}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ar(5,5,5),r=new we({name:"CubemapFromEquirect",uniforms:As(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ye,blending:ii});r.uniforms.tEquirect.value=e;const a=new me(i,r),o=e.minFilter;return e.minFilter===Gi&&(e.minFilter=De),new Zd(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}const eo=new O,Qd=new O,tp=new qt;class Ri{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=eo.subVectors(n,e).cross(Qd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(eo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||tp.getNormalMatrix(t),i=this.coplanarPoint(eo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ai=new Mi,Ur=new O;class $i{constructor(t=new Ri,e=new Ri,n=new Ri,i=new Ri,r=new Ri,a=new Ri){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ni){const n=this.planes,i=t.elements,r=i[0],a=i[1],o=i[2],c=i[3],l=i[4],h=i[5],u=i[6],d=i[7],g=i[8],m=i[9],x=i[10],p=i[11],f=i[12],v=i[13],_=i[14],M=i[15];if(n[0].setComponents(c-r,d-l,p-g,M-f).normalize(),n[1].setComponents(c+r,d+l,p+g,M+f).normalize(),n[2].setComponents(c+a,d+h,p+m,M+v).normalize(),n[3].setComponents(c-a,d-h,p-m,M-v).normalize(),n[4].setComponents(c-o,d-u,p-x,M-_).normalize(),e===ni)n[5].setComponents(c+o,d+u,p+x,M+_).normalize();else if(e===la)n[5].setComponents(o,u,x,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ai.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ai.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ai)}intersectsSprite(t){return Ai.center.set(0,0,0),Ai.radius=.7071067811865476,Ai.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ai)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Ur.x=i.normal.x>0?t.max.x:t.min.x,Ur.y=i.normal.y>0?t.max.y:t.min.y,Ur.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Ur)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function fu(){let s=null,t=!1,e=null,n=null;function i(r,a){e(r,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function ep(s,t){const e=t.isWebGL2,n=new WeakMap;function i(l,h){const u=l.array,d=l.usage,g=u.byteLength,m=s.createBuffer();s.bindBuffer(h,m),s.bufferData(h,u,d),l.onUploadCallback();let x;if(u instanceof Float32Array)x=s.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)x=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)x=s.SHORT;else if(u instanceof Uint32Array)x=s.UNSIGNED_INT;else if(u instanceof Int32Array)x=s.INT;else if(u instanceof Int8Array)x=s.BYTE;else if(u instanceof Uint8Array)x=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)x=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:m,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:g}}function r(l,h,u){const d=h.array,g=h._updateRange,m=h.updateRanges;if(s.bindBuffer(u,l),g.count===-1&&m.length===0&&s.bufferSubData(u,0,d),m.length!==0){for(let x=0,p=m.length;x<p;x++){const f=m[x];e?s.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):s.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}g.count!==-1&&(e?s.bufferSubData(u,g.offset*d.BYTES_PER_ELEMENT,d,g.offset,g.count):s.bufferSubData(u,g.offset*d.BYTES_PER_ELEMENT,d.subarray(g.offset,g.offset+g.count)),g.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(s.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,i(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:a,remove:o,update:c}}class ec extends Ze{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,u=t/o,d=e/c,g=[],m=[],x=[],p=[];for(let f=0;f<h;f++){const v=f*d-a;for(let _=0;_<l;_++){const M=_*u-r;m.push(M,-v,0),x.push(0,0,1),p.push(_/o),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let v=0;v<o;v++){const _=v+l*f,M=v+l*(f+1),w=v+1+l*(f+1),S=v+1+l*f;g.push(_,M,S),g.push(M,w,S)}this.setIndex(g),this.setAttribute("position",new ye(m,3)),this.setAttribute("normal",new ye(x,3)),this.setAttribute("uv",new ye(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ec(t.width,t.height,t.widthSegments,t.heightSegments)}}var np=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ip=`#ifdef USE_ALPHAHASH
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
#endif`,sp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ap=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,op=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cp=`#ifdef USE_AOMAP
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
#endif`,lp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hp=`#ifdef USE_BATCHING
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
#endif`,up=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,fp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,mp=`#ifdef USE_IRIDESCENCE
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
#endif`,gp=`#ifdef USE_BUMPMAP
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
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,xp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,wp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Sp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Ep=`#define PI 3.141592653589793
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
} // validated`,Ap=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Tp=`vec3 transformedNormal = objectNormal;
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
#endif`,Rp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Cp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ip=`
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
}`,Up=`#ifdef USE_ENVMAP
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
#endif`,Np=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,zp=`#ifdef USE_ENVMAP
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
#endif`,Fp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,kp=`#ifdef USE_ENVMAP
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
#endif`,Op=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Gp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vp=`#ifdef USE_GRADIENTMAP
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
}`,Wp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,$p=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Xp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,qp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,jp=`uniform bool receiveShadow;
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
#endif`,Yp=`#ifdef USE_ENVMAP
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
#endif`,Kp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,t0=`PhysicalMaterial material;
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
#endif`,e0=`struct PhysicalMaterial {
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
}`,n0=`
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
#endif`,i0=`#if defined( RE_IndirectDiffuse )
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
#endif`,s0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,r0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,a0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,o0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,c0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,l0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,h0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,u0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,f0=`#if defined( USE_POINTS_UV )
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
#endif`,d0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,p0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,m0=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,g0=`#ifdef USE_MORPHNORMALS
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
#endif`,v0=`#ifdef USE_MORPHTARGETS
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
#endif`,x0=`#ifdef USE_MORPHTARGETS
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
#endif`,_0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,M0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,y0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,w0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,b0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,S0=`#ifdef USE_NORMALMAP
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
#endif`,E0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,A0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,T0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,R0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,C0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,L0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,P0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,D0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,I0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,U0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,N0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,z0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,F0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,k0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,O0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,B0=`float getShadowMask() {
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
}`,G0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,H0=`#ifdef USE_SKINNING
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
#endif`,V0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,W0=`#ifdef USE_SKINNING
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
#endif`,$0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,X0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,q0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,j0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Y0=`#ifdef USE_TRANSMISSION
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
#endif`,K0=`#ifdef USE_TRANSMISSION
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
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,J0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const em=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nm=`uniform sampler2D t2D;
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
}`,im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,am=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,om=`#include <common>
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
}`,cm=`#if DEPTH_PACKING == 3200
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
}`,lm=`#define DISTANCE
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
}`,hm=`#define DISTANCE
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
}`,um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dm=`uniform float scale;
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
}`,pm=`uniform vec3 diffuse;
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
}`,mm=`#include <common>
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
}`,gm=`uniform vec3 diffuse;
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
}`,vm=`#define LAMBERT
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
}`,xm=`#define LAMBERT
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
}`,_m=`#define MATCAP
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
}`,Mm=`#define MATCAP
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
}`,ym=`#define NORMAL
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
}`,wm=`#define NORMAL
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
}`,bm=`#define PHONG
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
}`,Sm=`#define PHONG
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
}`,Em=`#define STANDARD
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
}`,Am=`#define STANDARD
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
}`,Tm=`#define TOON
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
}`,Rm=`#define TOON
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
}`,Cm=`uniform float size;
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
}`,Lm=`uniform vec3 diffuse;
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
}`,Pm=`#include <common>
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
}`,Dm=`uniform vec3 color;
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
}`,Im=`uniform float rotation;
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
}`,Um=`uniform vec3 diffuse;
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
}`,Vt={alphahash_fragment:np,alphahash_pars_fragment:ip,alphamap_fragment:sp,alphamap_pars_fragment:rp,alphatest_fragment:ap,alphatest_pars_fragment:op,aomap_fragment:cp,aomap_pars_fragment:lp,batching_pars_vertex:hp,batching_vertex:up,begin_vertex:fp,beginnormal_vertex:dp,bsdfs:pp,iridescence_fragment:mp,bumpmap_pars_fragment:gp,clipping_planes_fragment:vp,clipping_planes_pars_fragment:xp,clipping_planes_pars_vertex:_p,clipping_planes_vertex:Mp,color_fragment:yp,color_pars_fragment:wp,color_pars_vertex:bp,color_vertex:Sp,common:Ep,cube_uv_reflection_fragment:Ap,defaultnormal_vertex:Tp,displacementmap_pars_vertex:Rp,displacementmap_vertex:Cp,emissivemap_fragment:Lp,emissivemap_pars_fragment:Pp,colorspace_fragment:Dp,colorspace_pars_fragment:Ip,envmap_fragment:Up,envmap_common_pars_fragment:Np,envmap_pars_fragment:zp,envmap_pars_vertex:Fp,envmap_physical_pars_fragment:Yp,envmap_vertex:kp,fog_vertex:Op,fog_pars_vertex:Bp,fog_fragment:Gp,fog_pars_fragment:Hp,gradientmap_pars_fragment:Vp,lightmap_fragment:Wp,lightmap_pars_fragment:$p,lights_lambert_fragment:Xp,lights_lambert_pars_fragment:qp,lights_pars_begin:jp,lights_toon_fragment:Kp,lights_toon_pars_fragment:Zp,lights_phong_fragment:Jp,lights_phong_pars_fragment:Qp,lights_physical_fragment:t0,lights_physical_pars_fragment:e0,lights_fragment_begin:n0,lights_fragment_maps:i0,lights_fragment_end:s0,logdepthbuf_fragment:r0,logdepthbuf_pars_fragment:a0,logdepthbuf_pars_vertex:o0,logdepthbuf_vertex:c0,map_fragment:l0,map_pars_fragment:h0,map_particle_fragment:u0,map_particle_pars_fragment:f0,metalnessmap_fragment:d0,metalnessmap_pars_fragment:p0,morphcolor_vertex:m0,morphnormal_vertex:g0,morphtarget_pars_vertex:v0,morphtarget_vertex:x0,normal_fragment_begin:_0,normal_fragment_maps:M0,normal_pars_fragment:y0,normal_pars_vertex:w0,normal_vertex:b0,normalmap_pars_fragment:S0,clearcoat_normal_fragment_begin:E0,clearcoat_normal_fragment_maps:A0,clearcoat_pars_fragment:T0,iridescence_pars_fragment:R0,opaque_fragment:C0,packing:L0,premultiplied_alpha_fragment:P0,project_vertex:D0,dithering_fragment:I0,dithering_pars_fragment:U0,roughnessmap_fragment:N0,roughnessmap_pars_fragment:z0,shadowmap_pars_fragment:F0,shadowmap_pars_vertex:k0,shadowmap_vertex:O0,shadowmask_pars_fragment:B0,skinbase_vertex:G0,skinning_pars_vertex:H0,skinning_vertex:V0,skinnormal_vertex:W0,specularmap_fragment:$0,specularmap_pars_fragment:X0,tonemapping_fragment:q0,tonemapping_pars_fragment:j0,transmission_fragment:Y0,transmission_pars_fragment:K0,uv_pars_fragment:Z0,uv_pars_vertex:J0,uv_vertex:Q0,worldpos_vertex:tm,background_vert:em,background_frag:nm,backgroundCube_vert:im,backgroundCube_frag:sm,cube_vert:rm,cube_frag:am,depth_vert:om,depth_frag:cm,distanceRGBA_vert:lm,distanceRGBA_frag:hm,equirect_vert:um,equirect_frag:fm,linedashed_vert:dm,linedashed_frag:pm,meshbasic_vert:mm,meshbasic_frag:gm,meshlambert_vert:vm,meshlambert_frag:xm,meshmatcap_vert:_m,meshmatcap_frag:Mm,meshnormal_vert:ym,meshnormal_frag:wm,meshphong_vert:bm,meshphong_frag:Sm,meshphysical_vert:Em,meshphysical_frag:Am,meshtoon_vert:Tm,meshtoon_frag:Rm,points_vert:Cm,points_frag:Lm,shadow_vert:Pm,shadow_frag:Dm,sprite_vert:Im,sprite_frag:Um},mt={common:{diffuse:{value:new Nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new zt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new Nt(16777215)},opacity:{value:1},center:{value:new zt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},Nn={basic:{uniforms:We([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:We([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:We([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Nt(0)},specular:{value:new Nt(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:We([mt.common,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.roughnessmap,mt.metalnessmap,mt.fog,mt.lights,{emissive:{value:new Nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:We([mt.common,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.gradientmap,mt.fog,mt.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:We([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:We([mt.points,mt.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:We([mt.common,mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:We([mt.common,mt.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:We([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:We([mt.sprite,mt.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:We([mt.common,mt.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:We([mt.lights,mt.fog,{color:{value:new Nt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};Nn.physical={uniforms:We([Nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new zt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new Nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new zt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new Nt(0)},specularColor:{value:new Nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new zt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};const Nr={r:0,b:0,g:0};function Nm(s,t,e,n,i,r,a){const o=new Nt(0);let c=r===!0?0:1,l,h,u=null,d=0,g=null;function m(p,f){let v=!1,_=f.isScene===!0?f.background:null;_&&_.isTexture&&(_=(f.backgroundBlurriness>0?e:t).get(_)),_===null?x(o,c):_&&_.isColor&&(x(_,1),v=!0);const M=s.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,a):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||v)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),_&&(_.isCubeTexture||_.mapping===_a)?(h===void 0&&(h=new me(new ar(1,1,1),new we({name:"BackgroundCubeMaterial",uniforms:As(Nn.backgroundCube.uniforms),vertexShader:Nn.backgroundCube.vertexShader,fragmentShader:Nn.backgroundCube.fragmentShader,side:Ye,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=se.getTransfer(_.colorSpace)!==he,(u!==_||d!==_.version||g!==s.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,g=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new me(new ec(2,2),new we({name:"BackgroundMaterial",uniforms:As(Nn.background.uniforms),vertexShader:Nn.background.vertexShader,fragmentShader:Nn.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,l.material.toneMapped=se.getTransfer(_.colorSpace)!==he,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||g!==s.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,g=s.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function x(p,f){p.getRGB(Nr,lu(s)),n.buffers.color.setClear(Nr.r,Nr.g,Nr.b,f,a)}return{getClearColor:function(){return o},setClearColor:function(p,f=1){o.set(p),c=f,x(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,x(o,c)},render:m}}function zm(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},c=p(null);let l=c,h=!1;function u(I,z,N,H,B){let q=!1;if(a){const J=x(H,N,z);l!==J&&(l=J,g(l.object)),q=f(I,H,N,B),q&&v(I,H,N,B)}else{const J=z.wireframe===!0;(l.geometry!==H.id||l.program!==N.id||l.wireframe!==J)&&(l.geometry=H.id,l.program=N.id,l.wireframe=J,q=!0)}B!==null&&e.update(B,s.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,C(I,z,N,H),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function d(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function g(I){return n.isWebGL2?s.bindVertexArray(I):r.bindVertexArrayOES(I)}function m(I){return n.isWebGL2?s.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function x(I,z,N){const H=N.wireframe===!0;let B=o[I.id];B===void 0&&(B={},o[I.id]=B);let q=B[z.id];q===void 0&&(q={},B[z.id]=q);let J=q[H];return J===void 0&&(J=p(d()),q[H]=J),J}function p(I){const z=[],N=[],H=[];for(let B=0;B<i;B++)z[B]=0,N[B]=0,H[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:N,attributeDivisors:H,object:I,attributes:{},index:null}}function f(I,z,N,H){const B=l.attributes,q=z.attributes;let J=0;const Q=N.getAttributes();for(const ut in Q)if(Q[ut].location>=0){const tt=B[ut];let ft=q[ut];if(ft===void 0&&(ut==="instanceMatrix"&&I.instanceMatrix&&(ft=I.instanceMatrix),ut==="instanceColor"&&I.instanceColor&&(ft=I.instanceColor)),tt===void 0||tt.attribute!==ft||ft&&tt.data!==ft.data)return!0;J++}return l.attributesNum!==J||l.index!==H}function v(I,z,N,H){const B={},q=z.attributes;let J=0;const Q=N.getAttributes();for(const ut in Q)if(Q[ut].location>=0){let tt=q[ut];tt===void 0&&(ut==="instanceMatrix"&&I.instanceMatrix&&(tt=I.instanceMatrix),ut==="instanceColor"&&I.instanceColor&&(tt=I.instanceColor));const ft={};ft.attribute=tt,tt&&tt.data&&(ft.data=tt.data),B[ut]=ft,J++}l.attributes=B,l.attributesNum=J,l.index=H}function _(){const I=l.newAttributes;for(let z=0,N=I.length;z<N;z++)I[z]=0}function M(I){w(I,0)}function w(I,z){const N=l.newAttributes,H=l.enabledAttributes,B=l.attributeDivisors;N[I]=1,H[I]===0&&(s.enableVertexAttribArray(I),H[I]=1),B[I]!==z&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,z),B[I]=z)}function S(){const I=l.newAttributes,z=l.enabledAttributes;for(let N=0,H=z.length;N<H;N++)z[N]!==I[N]&&(s.disableVertexAttribArray(N),z[N]=0)}function E(I,z,N,H,B,q,J){J===!0?s.vertexAttribIPointer(I,z,N,B,q):s.vertexAttribPointer(I,z,N,H,B,q)}function C(I,z,N,H){if(n.isWebGL2===!1&&(I.isInstancedMesh||H.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();const B=H.attributes,q=N.getAttributes(),J=z.defaultAttributeValues;for(const Q in q){const ut=q[Q];if(ut.location>=0){let j=B[Q];if(j===void 0&&(Q==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),Q==="instanceColor"&&I.instanceColor&&(j=I.instanceColor)),j!==void 0){const tt=j.normalized,ft=j.itemSize,xt=e.get(j);if(xt===void 0)continue;const yt=xt.buffer,Et=xt.type,Rt=xt.bytesPerElement,bt=n.isWebGL2===!0&&(Et===s.INT||Et===s.UNSIGNED_INT||j.gpuType===$h);if(j.isInterleavedBufferAttribute){const Dt=j.data,G=Dt.stride,ae=j.offset;if(Dt.isInstancedInterleavedBuffer){for(let gt=0;gt<ut.locationSize;gt++)w(ut.location+gt,Dt.meshPerAttribute);I.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=Dt.meshPerAttribute*Dt.count)}else for(let gt=0;gt<ut.locationSize;gt++)M(ut.location+gt);s.bindBuffer(s.ARRAY_BUFFER,yt);for(let gt=0;gt<ut.locationSize;gt++)E(ut.location+gt,ft/ut.locationSize,Et,tt,G*Rt,(ae+ft/ut.locationSize*gt)*Rt,bt)}else{if(j.isInstancedBufferAttribute){for(let Dt=0;Dt<ut.locationSize;Dt++)w(ut.location+Dt,j.meshPerAttribute);I.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Dt=0;Dt<ut.locationSize;Dt++)M(ut.location+Dt);s.bindBuffer(s.ARRAY_BUFFER,yt);for(let Dt=0;Dt<ut.locationSize;Dt++)E(ut.location+Dt,ft/ut.locationSize,Et,tt,ft*Rt,ft/ut.locationSize*Dt*Rt,bt)}}else if(J!==void 0){const tt=J[Q];if(tt!==void 0)switch(tt.length){case 2:s.vertexAttrib2fv(ut.location,tt);break;case 3:s.vertexAttrib3fv(ut.location,tt);break;case 4:s.vertexAttrib4fv(ut.location,tt);break;default:s.vertexAttrib1fv(ut.location,tt)}}}}S()}function y(){P();for(const I in o){const z=o[I];for(const N in z){const H=z[N];for(const B in H)m(H[B].object),delete H[B];delete z[N]}delete o[I]}}function b(I){if(o[I.id]===void 0)return;const z=o[I.id];for(const N in z){const H=z[N];for(const B in H)m(H[B].object),delete H[B];delete z[N]}delete o[I.id]}function R(I){for(const z in o){const N=o[z];if(N[I.id]===void 0)continue;const H=N[I.id];for(const B in H)m(H[B].object),delete H[B];delete N[I.id]}}function P(){F(),h=!0,l!==c&&(l=c,g(l.object))}function F(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:P,resetDefaultState:F,dispose:y,releaseStatesOfGeometry:b,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:M,disableUnusedAttributes:S}}function Fm(s,t,e,n){const i=n.isWebGL2;let r;function a(h){r=h}function o(h,u){s.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,d){if(d===0)return;let g,m;if(i)g=s,m="drawArraysInstanced";else if(g=t.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",g===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[m](r,h,u,d),e.update(u,r,d)}function l(h,u,d){if(d===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d;m++)this.render(h[m],u[m]);else{g.multiDrawArraysWEBGL(r,h,0,u,0,d);let m=0;for(let x=0;x<d;x++)m+=u[x];e.update(m,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l}function km(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);const l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),x=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),f=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),_=d>0,M=a||t.has("OES_texture_float"),w=_&&M,S=a?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:g,maxCubemapSize:m,maxAttributes:x,maxVertexUniforms:p,maxVaryings:f,maxFragmentUniforms:v,vertexTextures:_,floatFragmentTextures:M,floatVertexTextures:w,maxSamples:S}}function Om(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new Ri,o=new qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const g=u.length!==0||d||n!==0||i;return i=d,n=u.length,g},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,g){const m=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,f=s.get(u);if(!i||m===null||m.length===0||r&&!p)r?h(null):l();else{const v=r?0:n,_=v*4;let M=f.clippingState||null;c.value=M,M=h(m,d,_,g);for(let w=0;w!==_;++w)M[w]=e[w];f.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,g,m){const x=u!==null?u.length:0;let p=null;if(x!==0){if(p=c.value,m!==!0||p===null){const f=g+x*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(p===null||p.length<f)&&(p=new Float32Array(f));for(let _=0,M=g;_!==x;++_,M+=4)a.copy(u[_]).applyMatrix4(v,o),a.normal.toArray(p,M),p[M+3]=a.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}function Bm(s){let t=new WeakMap;function e(a,o){return o===Po?a.mapping=bs:o===Do&&(a.mapping=Ss),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Po||o===Do)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Jd(c.height/2);return l.fromEquirectangularTexture(s,a),t.set(a,l),a.addEventListener("dispose",i),e(l.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class wa extends hu{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,c=i-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const gs=4,xl=[.125,.215,.35,.446,.526,.582],Ii=20,no=new wa,_l=new Nt;let io=null,so=0,ro=0;const Ci=(1+Math.sqrt(5))/2,cs=1/Ci,Ml=[new O(1,1,1),new O(-1,1,1),new O(1,1,-1),new O(-1,1,-1),new O(0,Ci,cs),new O(0,Ci,-cs),new O(cs,0,Ci),new O(-cs,0,Ci),new O(Ci,cs,0),new O(-Ci,cs,0)];class yl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){io=this._renderer.getRenderTarget(),so=this._renderer.getActiveCubeFace(),ro=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(io,so,ro),t.scissorTest=!1,zr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===bs||t.mapping===Ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),io=this._renderer.getRenderTarget(),so=this._renderer.getActiveCubeFace(),ro=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:De,minFilter:De,generateMipmaps:!1,type:xi,format:Se,colorSpace:ai,depthBuffer:!1},i=wl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gm(r)),this._blurMaterial=Hm(r,t,e)}return i}_compileMaterial(t){const e=new me(this._lodPlanes[0],t);this._renderer.compile(e,no)}_sceneToCubeUV(t,e,n,i){const o=new ln(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(_l),h.toneMapping=gi,h.autoClear=!1;const g=new au({name:"PMREM.Background",side:Ye,depthWrite:!1,depthTest:!1}),m=new me(new ar,g);let x=!1;const p=t.background;p?p.isColor&&(g.color.copy(p),t.background=null,x=!0):(g.color.copy(_l),x=!0);for(let f=0;f<6;f++){const v=f%3;v===0?(o.up.set(0,c[f],0),o.lookAt(l[f],0,0)):v===1?(o.up.set(0,0,c[f]),o.lookAt(0,l[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,l[f]));const _=this._cubeSize;zr(i,v*_,f>2?_:0,_,_),h.setRenderTarget(i),x&&h.render(m,o),h.render(t,o)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===bs||t.mapping===Ss;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bl());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new me(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;zr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,no)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=Ml[(i-1)%Ml.length];this._blur(t,i-1,i,r,a)}e.autoClear=n}_blur(t,e,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",r),this._halfBlur(a,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new me(this._lodPlanes[i],l),d=l.uniforms,g=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*Ii-1),x=r/m,p=isFinite(r)?1+Math.floor(h*x):Ii;p>Ii&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Ii}`);const f=[];let v=0;for(let E=0;E<Ii;++E){const C=E/x,y=Math.exp(-C*C/2);f.push(y),E===0?v+=y:E<p&&(v+=2*y)}for(let E=0;E<f.length;E++)f[E]=f[E]/v;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:_}=this;d.dTheta.value=m,d.mipInt.value=_-n;const M=this._sizeLods[i],w=3*M*(i>_-gs?i-_+gs:0),S=4*(this._cubeSize-M);zr(e,w,S,3*M,2*M),c.setRenderTarget(e),c.render(u,no)}}function Gm(s){const t=[],e=[],n=[];let i=s;const r=s-gs+1+xl.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);e.push(o);let c=1/o;a>s-gs?c=xl[a-s+gs-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],g=6,m=6,x=3,p=2,f=1,v=new Float32Array(x*m*g),_=new Float32Array(p*m*g),M=new Float32Array(f*m*g);for(let S=0;S<g;S++){const E=S%3*2/3-1,C=S>2?0:-1,y=[E,C,0,E+2/3,C,0,E+2/3,C+1,0,E,C,0,E+2/3,C+1,0,E,C+1,0];v.set(y,x*m*S),_.set(d,p*m*S);const b=[S,S,S,S,S,S];M.set(b,f*m*S)}const w=new Ze;w.setAttribute("position",new Ee(v,x)),w.setAttribute("uv",new Ee(_,p)),w.setAttribute("faceIndex",new Ee(M,f)),t.push(w),i>gs&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function wl(s,t,e){const n=new Gn(s,t,e);return n.texture.mapping=_a,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function zr(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Hm(s,t,e){const n=new Float32Array(Ii),i=new O(0,1,0);return new we({name:"SphericalGaussianBlur",defines:{n:Ii,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:nc(),fragmentShader:`

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
		`,blending:ii,depthTest:!1,depthWrite:!1})}function bl(){return new we({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nc(),fragmentShader:`

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
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Sl(){return new we({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function nc(){return`

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
	`}function Vm(s){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Po||c===Do,h=c===bs||c===Ss;if(l||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new yl(s)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{const u=o.image;if(l&&u&&u.height>0||h&&u&&i(u)){e===null&&(e=new yl(s));const d=l?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,d),o.addEventListener("dispose",r),d.texture}else return null}}}return o}function i(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Wm(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function $m(s,t,e,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const x=d.morphAttributes[m];for(let p=0,f=x.length;p<f;p++)t.remove(x[p])}d.removeEventListener("dispose",a),delete i[d.id];const g=r.get(d);g&&(t.remove(g),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const m in d)t.update(d[m],s.ARRAY_BUFFER);const g=u.morphAttributes;for(const m in g){const x=g[m];for(let p=0,f=x.length;p<f;p++)t.update(x[p],s.ARRAY_BUFFER)}}function l(u){const d=[],g=u.index,m=u.attributes.position;let x=0;if(g!==null){const v=g.array;x=g.version;for(let _=0,M=v.length;_<M;_+=3){const w=v[_+0],S=v[_+1],E=v[_+2];d.push(w,S,S,E,E,w)}}else if(m!==void 0){const v=m.array;x=m.version;for(let _=0,M=v.length/3-1;_<M;_+=3){const w=_+0,S=_+1,E=_+2;d.push(w,S,S,E,E,w)}}else return;const p=new(eu(d)?cu:ou)(d,1);p.version=x;const f=r.get(u);f&&t.remove(f),r.set(u,p)}function h(u){const d=r.get(u);if(d){const g=u.index;g!==null&&d.version<g.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Xm(s,t,e,n){const i=n.isWebGL2;let r;function a(g){r=g}let o,c;function l(g){o=g.type,c=g.bytesPerElement}function h(g,m){s.drawElements(r,m,o,g*c),e.update(m,r,1)}function u(g,m,x){if(x===0)return;let p,f;if(i)p=s,f="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](r,m,o,g*c,x),e.update(m,r,x)}function d(g,m,x){if(x===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<x;f++)this.render(g[f]/c,m[f]);else{p.multiDrawElementsWEBGL(r,m,0,o,g,0,x);let f=0;for(let v=0;v<x;v++)f+=m[v];e.update(f,r,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function qm(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function jm(s,t){return s[0]-t[0]}function Ym(s,t){return Math.abs(t[1])-Math.abs(s[1])}function Km(s,t,e){const n={},i=new Float32Array(8),r=new WeakMap,a=new Zt,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,h,u){const d=l.morphTargetInfluences;if(t.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,m=g!==void 0?g.length:0;let x=r.get(h);if(x===void 0||x.count!==m){let I=function(){P.dispose(),r.delete(h),h.removeEventListener("dispose",I)};x!==void 0&&x.texture.dispose();const v=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,M=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],S=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let C=0;v===!0&&(C=1),_===!0&&(C=2),M===!0&&(C=3);let y=h.attributes.position.count*C,b=1;y>t.maxTextureSize&&(b=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const R=new Float32Array(y*b*4*m),P=new su(R,y,b,m);P.type=ti,P.needsUpdate=!0;const F=C*4;for(let z=0;z<m;z++){const N=w[z],H=S[z],B=E[z],q=y*b*4*z;for(let J=0;J<N.count;J++){const Q=J*F;v===!0&&(a.fromBufferAttribute(N,J),R[q+Q+0]=a.x,R[q+Q+1]=a.y,R[q+Q+2]=a.z,R[q+Q+3]=0),_===!0&&(a.fromBufferAttribute(H,J),R[q+Q+4]=a.x,R[q+Q+5]=a.y,R[q+Q+6]=a.z,R[q+Q+7]=0),M===!0&&(a.fromBufferAttribute(B,J),R[q+Q+8]=a.x,R[q+Q+9]=a.y,R[q+Q+10]=a.z,R[q+Q+11]=B.itemSize===4?a.w:1)}}x={count:m,texture:P,size:new zt(y,b)},r.set(h,x),h.addEventListener("dispose",I)}let p=0;for(let v=0;v<d.length;v++)p+=d[v];const f=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(s,"morphTargetBaseInfluence",f),u.getUniforms().setValue(s,"morphTargetInfluences",d),u.getUniforms().setValue(s,"morphTargetsTexture",x.texture,e),u.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}else{const g=d===void 0?0:d.length;let m=n[h.id];if(m===void 0||m.length!==g){m=[];for(let _=0;_<g;_++)m[_]=[_,0];n[h.id]=m}for(let _=0;_<g;_++){const M=m[_];M[0]=_,M[1]=d[_]}m.sort(Ym);for(let _=0;_<8;_++)_<g&&m[_][1]?(o[_][0]=m[_][0],o[_][1]=m[_][1]):(o[_][0]=Number.MAX_SAFE_INTEGER,o[_][1]=0);o.sort(jm);const x=h.morphAttributes.position,p=h.morphAttributes.normal;let f=0;for(let _=0;_<8;_++){const M=o[_],w=M[0],S=M[1];w!==Number.MAX_SAFE_INTEGER&&S?(x&&h.getAttribute("morphTarget"+_)!==x[w]&&h.setAttribute("morphTarget"+_,x[w]),p&&h.getAttribute("morphNormal"+_)!==p[w]&&h.setAttribute("morphNormal"+_,p[w]),i[_]=S,f+=S):(x&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),i[_]=0)}const v=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(s,"morphTargetBaseInfluence",v),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:c}}function Zm(s,t,e,n){let i=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function a(){i=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}class ic extends en{constructor(t,e,n,i,r,a,o,c,l,h){if(h=h!==void 0?h:Oi,h!==Oi&&h!==Es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Oi&&(n=Qn),n===void 0&&h===Es&&(n=ki),super(null,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:re,this.minFilter=c!==void 0?c:re,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const du=new en,pu=new ic(1,1);pu.compareFunction=tu;const mu=new su,gu=new Nd,vu=new uu,El=[],Al=[],Tl=new Float32Array(16),Rl=new Float32Array(9),Cl=new Float32Array(4);function Cs(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=El[i];if(r===void 0&&(r=new Float32Array(i),El[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function Ae(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Te(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function ba(s,t){let e=Al[t];e===void 0&&(e=new Int32Array(t),Al[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Jm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Qm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;s.uniform2fv(this.addr,t),Te(e,t)}}function tg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;s.uniform3fv(this.addr,t),Te(e,t)}}function eg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;s.uniform4fv(this.addr,t),Te(e,t)}}function ng(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(Ae(e,n))return;Cl.set(n),s.uniformMatrix2fv(this.addr,!1,Cl),Te(e,n)}}function ig(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(Ae(e,n))return;Rl.set(n),s.uniformMatrix3fv(this.addr,!1,Rl),Te(e,n)}}function sg(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(Ae(e,n))return;Tl.set(n),s.uniformMatrix4fv(this.addr,!1,Tl),Te(e,n)}}function rg(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function ag(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;s.uniform2iv(this.addr,t),Te(e,t)}}function og(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;s.uniform3iv(this.addr,t),Te(e,t)}}function cg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;s.uniform4iv(this.addr,t),Te(e,t)}}function lg(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function hg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;s.uniform2uiv(this.addr,t),Te(e,t)}}function ug(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;s.uniform3uiv(this.addr,t),Te(e,t)}}function fg(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;s.uniform4uiv(this.addr,t),Te(e,t)}}function dg(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?pu:du;e.setTexture2D(t||r,i)}function pg(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||gu,i)}function mg(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||vu,i)}function gg(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||mu,i)}function vg(s){switch(s){case 5126:return Jm;case 35664:return Qm;case 35665:return tg;case 35666:return eg;case 35674:return ng;case 35675:return ig;case 35676:return sg;case 5124:case 35670:return rg;case 35667:case 35671:return ag;case 35668:case 35672:return og;case 35669:case 35673:return cg;case 5125:return lg;case 36294:return hg;case 36295:return ug;case 36296:return fg;case 35678:case 36198:case 36298:case 36306:case 35682:return dg;case 35679:case 36299:case 36307:return pg;case 35680:case 36300:case 36308:case 36293:return mg;case 36289:case 36303:case 36311:case 36292:return gg}}function xg(s,t){s.uniform1fv(this.addr,t)}function _g(s,t){const e=Cs(t,this.size,2);s.uniform2fv(this.addr,e)}function Mg(s,t){const e=Cs(t,this.size,3);s.uniform3fv(this.addr,e)}function yg(s,t){const e=Cs(t,this.size,4);s.uniform4fv(this.addr,e)}function wg(s,t){const e=Cs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function bg(s,t){const e=Cs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Sg(s,t){const e=Cs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Eg(s,t){s.uniform1iv(this.addr,t)}function Ag(s,t){s.uniform2iv(this.addr,t)}function Tg(s,t){s.uniform3iv(this.addr,t)}function Rg(s,t){s.uniform4iv(this.addr,t)}function Cg(s,t){s.uniform1uiv(this.addr,t)}function Lg(s,t){s.uniform2uiv(this.addr,t)}function Pg(s,t){s.uniform3uiv(this.addr,t)}function Dg(s,t){s.uniform4uiv(this.addr,t)}function Ig(s,t,e){const n=this.cache,i=t.length,r=ba(e,i);Ae(n,r)||(s.uniform1iv(this.addr,r),Te(n,r));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||du,r[a])}function Ug(s,t,e){const n=this.cache,i=t.length,r=ba(e,i);Ae(n,r)||(s.uniform1iv(this.addr,r),Te(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||gu,r[a])}function Ng(s,t,e){const n=this.cache,i=t.length,r=ba(e,i);Ae(n,r)||(s.uniform1iv(this.addr,r),Te(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||vu,r[a])}function zg(s,t,e){const n=this.cache,i=t.length,r=ba(e,i);Ae(n,r)||(s.uniform1iv(this.addr,r),Te(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||mu,r[a])}function Fg(s){switch(s){case 5126:return xg;case 35664:return _g;case 35665:return Mg;case 35666:return yg;case 35674:return wg;case 35675:return bg;case 35676:return Sg;case 5124:case 35670:return Eg;case 35667:case 35671:return Ag;case 35668:case 35672:return Tg;case 35669:case 35673:return Rg;case 5125:return Cg;case 36294:return Lg;case 36295:return Pg;case 36296:return Dg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ig;case 35679:case 36299:case 36307:return Ug;case 35680:case 36300:case 36308:case 36293:return Ng;case 36289:case 36303:case 36311:case 36292:return zg}}class kg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=vg(e.type)}}class Og{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Fg(e.type)}}class Bg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const ao=/(\w+)(\])?(\[|\.)?/g;function Ll(s,t){s.seq.push(t),s.map[t.id]=t}function Gg(s,t,e){const n=s.name,i=n.length;for(ao.lastIndex=0;;){const r=ao.exec(n),a=ao.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){Ll(e,l===void 0?new kg(o,s,t):new Og(o,s,t));break}else{let u=e.map[o];u===void 0&&(u=new Bg(o),Ll(e,u)),e=u}}}class ea{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),a=t.getUniformLocation(e,r.name);Gg(r,a,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Pl(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Hg=37297;let Vg=0;function Wg(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function $g(s){const t=se.getPrimaries(se.workingColorSpace),e=se.getPrimaries(s);let n;switch(t===e?n="":t===ca&&e===oa?n="LinearDisplayP3ToLinearSRGB":t===oa&&e===ca&&(n="LinearSRGBToLinearDisplayP3"),s){case ai:case Ma:return[n,"LinearTransferOETF"];case Pe:case Zo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Dl(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+Wg(s.getShaderSource(t),a)}else return i}function Xg(s,t){const e=$g(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function qg(s,t){let e;switch(t){case Xf:e="Linear";break;case qf:e="Reinhard";break;case jf:e="OptimizedCineon";break;case Yf:e="ACESFilmic";break;case Zf:e="AgX";break;case Kf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function jg(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(vs).join(`
`)}function Yg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(vs).join(`
`)}function Kg(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Zg(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function vs(s){return s!==""}function Il(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ul(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Jg=/^[ \t]*#include +<([\w\d./]+)>/gm;function zo(s){return s.replace(Jg,tv)}const Qg=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function tv(s,t){let e=Vt[t];if(e===void 0){const n=Qg.get(t);if(n!==void 0)e=Vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return zo(e)}const ev=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Nl(s){return s.replace(ev,nv)}function nv(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function zl(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function iv(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Hh?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Mf?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Yn&&(t="SHADOWMAP_TYPE_VSM"),t}function sv(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case bs:case Ss:t="ENVMAP_TYPE_CUBE";break;case _a:t="ENVMAP_TYPE_CUBE_UV";break}return t}function rv(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ss:t="ENVMAP_MODE_REFRACTION";break}return t}function av(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Vh:t="ENVMAP_BLENDING_MULTIPLY";break;case Wf:t="ENVMAP_BLENDING_MIX";break;case $f:t="ENVMAP_BLENDING_ADD";break}return t}function ov(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function cv(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=iv(e),l=sv(e),h=rv(e),u=av(e),d=ov(e),g=e.isWebGL2?"":jg(e),m=Yg(e),x=Kg(r),p=i.createProgram();let f,v,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(vs).join(`
`),f.length>0&&(f+=`
`),v=[g,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(vs).join(`
`),v.length>0&&(v+=`
`)):(f=[zl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),v=[g,zl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==gi?"#define TONE_MAPPING":"",e.toneMapping!==gi?Vt.tonemapping_pars_fragment:"",e.toneMapping!==gi?qg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,Xg("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vs).join(`
`)),a=zo(a),a=Il(a,e),a=Ul(a,e),o=zo(o),o=Il(o,e),o=Ul(o,e),a=Nl(a),o=Nl(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,f=[m,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===tl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===tl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const M=_+f+a,w=_+v+o,S=Pl(i,i.VERTEX_SHADER,M),E=Pl(i,i.FRAGMENT_SHADER,w);i.attachShader(p,S),i.attachShader(p,E),e.index0AttributeName!==void 0?i.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function C(P){if(s.debug.checkShaderErrors){const F=i.getProgramInfoLog(p).trim(),I=i.getShaderInfoLog(S).trim(),z=i.getShaderInfoLog(E).trim();let N=!0,H=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(N=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,p,S,E);else{const B=Dl(i,S,"vertex"),q=Dl(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+F+`
`+B+`
`+q)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(I===""||z==="")&&(H=!1);H&&(P.diagnostics={runnable:N,programLog:F,vertexShader:{log:I,prefix:f},fragmentShader:{log:z,prefix:v}})}i.deleteShader(S),i.deleteShader(E),y=new ea(i,p),b=Zg(i,p)}let y;this.getUniforms=function(){return y===void 0&&C(this),y};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(p,Hg)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Vg++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=S,this.fragmentShader=E,this}let lv=0;class hv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new uv(t),e.set(t,n)),n}}class uv{constructor(t){this.id=lv++,this.code=t,this.usedTimes=0}}function fv(s,t,e,n,i,r,a){const o=new tc,c=new hv,l=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,d=i.vertexTextures;let g=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return y===0?"uv":`uv${y}`}function p(y,b,R,P,F){const I=P.fog,z=F.geometry,N=y.isMeshStandardMaterial?P.environment:null,H=(y.isMeshStandardMaterial?e:t).get(y.envMap||N),B=H&&H.mapping===_a?H.image.height:null,q=m[y.type];y.precision!==null&&(g=i.getMaxPrecision(y.precision),g!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",g,"instead."));const J=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Q=J!==void 0?J.length:0;let ut=0;z.morphAttributes.position!==void 0&&(ut=1),z.morphAttributes.normal!==void 0&&(ut=2),z.morphAttributes.color!==void 0&&(ut=3);let j,tt,ft,xt;if(q){const Ge=Nn[q];j=Ge.vertexShader,tt=Ge.fragmentShader}else j=y.vertexShader,tt=y.fragmentShader,c.update(y),ft=c.getVertexShaderID(y),xt=c.getFragmentShaderID(y);const yt=s.getRenderTarget(),Et=F.isInstancedMesh===!0,Rt=F.isBatchedMesh===!0,bt=!!y.map,Dt=!!y.matcap,G=!!H,ae=!!y.aoMap,gt=!!y.lightMap,lt=!!y.bumpMap,X=!!y.normalMap,st=!!y.displacementMap,ot=!!y.emissiveMap,T=!!y.metalnessMap,A=!!y.roughnessMap,L=y.anisotropy>0,k=y.clearcoat>0,$=y.iridescence>0,W=y.sheen>0,ht=y.transmission>0,it=L&&!!y.anisotropyMap,dt=k&&!!y.clearcoatMap,vt=k&&!!y.clearcoatNormalMap,Ct=k&&!!y.clearcoatRoughnessMap,nt=$&&!!y.iridescenceMap,Jt=$&&!!y.iridescenceThicknessMap,Bt=W&&!!y.sheenColorMap,It=W&&!!y.sheenRoughnessMap,Lt=!!y.specularMap,_t=!!y.specularColorMap,kt=!!y.specularIntensityMap,Kt=ht&&!!y.transmissionMap,jt=ht&&!!y.thicknessMap,Gt=!!y.gradientMap,et=!!y.alphaMap,U=y.alphaTest>0,rt=!!y.alphaHash,at=!!y.extensions,St=!!z.attributes.uv1,At=!!z.attributes.uv2,ne=!!z.attributes.uv3;let Qt=gi;return y.toneMapped&&(yt===null||yt.isXRRenderTarget===!0)&&(Qt=s.toneMapping),{isWebGL2:h,shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:j,fragmentShader:tt,defines:y.defines,customVertexShaderID:ft,customFragmentShaderID:xt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:g,batching:Rt,instancing:Et,instancingColor:Et&&F.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:yt===null?s.outputColorSpace:yt.isXRRenderTarget===!0?yt.texture.colorSpace:ai,map:bt,matcap:Dt,envMap:G,envMapMode:G&&H.mapping,envMapCubeUVHeight:B,aoMap:ae,lightMap:gt,bumpMap:lt,normalMap:X,displacementMap:d&&st,emissiveMap:ot,normalMapObjectSpace:X&&y.normalMapType===cd,normalMapTangentSpace:X&&y.normalMapType===od,metalnessMap:T,roughnessMap:A,anisotropy:L,anisotropyMap:it,clearcoat:k,clearcoatMap:dt,clearcoatNormalMap:vt,clearcoatRoughnessMap:Ct,iridescence:$,iridescenceMap:nt,iridescenceThicknessMap:Jt,sheen:W,sheenColorMap:Bt,sheenRoughnessMap:It,specularMap:Lt,specularColorMap:_t,specularIntensityMap:kt,transmission:ht,transmissionMap:Kt,thicknessMap:jt,gradientMap:Gt,opaque:y.transparent===!1&&y.blending===Ms,alphaMap:et,alphaTest:U,alphaHash:rt,combine:y.combine,mapUv:bt&&x(y.map.channel),aoMapUv:ae&&x(y.aoMap.channel),lightMapUv:gt&&x(y.lightMap.channel),bumpMapUv:lt&&x(y.bumpMap.channel),normalMapUv:X&&x(y.normalMap.channel),displacementMapUv:st&&x(y.displacementMap.channel),emissiveMapUv:ot&&x(y.emissiveMap.channel),metalnessMapUv:T&&x(y.metalnessMap.channel),roughnessMapUv:A&&x(y.roughnessMap.channel),anisotropyMapUv:it&&x(y.anisotropyMap.channel),clearcoatMapUv:dt&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:vt&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ct&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:Jt&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:Bt&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:It&&x(y.sheenRoughnessMap.channel),specularMapUv:Lt&&x(y.specularMap.channel),specularColorMapUv:_t&&x(y.specularColorMap.channel),specularIntensityMapUv:kt&&x(y.specularIntensityMap.channel),transmissionMapUv:Kt&&x(y.transmissionMap.channel),thicknessMapUv:jt&&x(y.thicknessMap.channel),alphaMapUv:et&&x(y.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(X||L),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,vertexUv1s:St,vertexUv2s:At,vertexUv3s:ne,pointsUvs:F.isPoints===!0&&!!z.attributes.uv&&(bt||et),fog:!!I,useFog:y.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:F.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:ut,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&R.length>0,shadowMapType:s.shadowMap.type,toneMapping:Qt,useLegacyLights:s._useLegacyLights,decodeVideoTexture:bt&&y.map.isVideoTexture===!0&&se.getTransfer(y.map.colorSpace)===he,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===An,flipSided:y.side===Ye,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:at&&y.extensions.derivatives===!0,extensionFragDepth:at&&y.extensions.fragDepth===!0,extensionDrawBuffers:at&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:at&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:at&&y.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function f(y){const b=[];if(y.shaderID?b.push(y.shaderID):(b.push(y.customVertexShaderID),b.push(y.customFragmentShaderID)),y.defines!==void 0)for(const R in y.defines)b.push(R),b.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(v(b,y),_(b,y),b.push(s.outputColorSpace)),b.push(y.customProgramCacheKey),b.join()}function v(y,b){y.push(b.precision),y.push(b.outputColorSpace),y.push(b.envMapMode),y.push(b.envMapCubeUVHeight),y.push(b.mapUv),y.push(b.alphaMapUv),y.push(b.lightMapUv),y.push(b.aoMapUv),y.push(b.bumpMapUv),y.push(b.normalMapUv),y.push(b.displacementMapUv),y.push(b.emissiveMapUv),y.push(b.metalnessMapUv),y.push(b.roughnessMapUv),y.push(b.anisotropyMapUv),y.push(b.clearcoatMapUv),y.push(b.clearcoatNormalMapUv),y.push(b.clearcoatRoughnessMapUv),y.push(b.iridescenceMapUv),y.push(b.iridescenceThicknessMapUv),y.push(b.sheenColorMapUv),y.push(b.sheenRoughnessMapUv),y.push(b.specularMapUv),y.push(b.specularColorMapUv),y.push(b.specularIntensityMapUv),y.push(b.transmissionMapUv),y.push(b.thicknessMapUv),y.push(b.combine),y.push(b.fogExp2),y.push(b.sizeAttenuation),y.push(b.morphTargetsCount),y.push(b.morphAttributeCount),y.push(b.numDirLights),y.push(b.numPointLights),y.push(b.numSpotLights),y.push(b.numSpotLightMaps),y.push(b.numHemiLights),y.push(b.numRectAreaLights),y.push(b.numDirLightShadows),y.push(b.numPointLightShadows),y.push(b.numSpotLightShadows),y.push(b.numSpotLightShadowsWithMaps),y.push(b.numLightProbes),y.push(b.shadowMapType),y.push(b.toneMapping),y.push(b.numClippingPlanes),y.push(b.numClipIntersection),y.push(b.depthPacking)}function _(y,b){o.disableAll(),b.isWebGL2&&o.enable(0),b.supportsVertexTextures&&o.enable(1),b.instancing&&o.enable(2),b.instancingColor&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),y.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.skinning&&o.enable(4),b.morphTargets&&o.enable(5),b.morphNormals&&o.enable(6),b.morphColors&&o.enable(7),b.premultipliedAlpha&&o.enable(8),b.shadowMapEnabled&&o.enable(9),b.useLegacyLights&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),y.push(o.mask)}function M(y){const b=m[y.type];let R;if(b){const P=Nn[b];R=jd.clone(P.uniforms)}else R=y.uniforms;return R}function w(y,b){let R;for(let P=0,F=l.length;P<F;P++){const I=l[P];if(I.cacheKey===b){R=I,++R.usedTimes;break}}return R===void 0&&(R=new cv(s,b,y,r),l.push(R)),R}function S(y){if(--y.usedTimes===0){const b=l.indexOf(y);l[b]=l[l.length-1],l.pop(),y.destroy()}}function E(y){c.remove(y)}function C(){c.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:M,acquireProgram:w,releaseProgram:S,releaseShaderCache:E,programs:l,dispose:C}}function dv(){let s=new WeakMap;function t(r){let a=s.get(r);return a===void 0&&(a={},s.set(r,a)),a}function e(r){s.delete(r)}function n(r,a,o){s.get(r)[a]=o}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function pv(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Fl(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function kl(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u,d,g,m,x,p){let f=s[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:g,groupOrder:m,renderOrder:u.renderOrder,z:x,group:p},s[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=g,f.groupOrder=m,f.renderOrder=u.renderOrder,f.z=x,f.group=p),t++,f}function o(u,d,g,m,x,p){const f=a(u,d,g,m,x,p);g.transmission>0?n.push(f):g.transparent===!0?i.push(f):e.push(f)}function c(u,d,g,m,x,p){const f=a(u,d,g,m,x,p);g.transmission>0?n.unshift(f):g.transparent===!0?i.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||pv),n.length>1&&n.sort(d||Fl),i.length>1&&i.sort(d||Fl)}function h(){for(let u=t,d=s.length;u<d;u++){const g=s[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:o,unshift:c,finish:h,sort:l}}function mv(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new kl,s.set(n,[a])):i>=r.length?(a=new kl,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function gv(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new Nt};break;case"SpotLight":e={position:new O,direction:new O,color:new Nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new Nt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new Nt,groundColor:new Nt};break;case"RectAreaLight":e={color:new Nt,position:new O,halfWidth:new O,halfHeight:new O};break}return s[t.id]=e,e}}}function vv(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new zt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new zt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new zt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let xv=0;function _v(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Mv(s,t){const e=new gv,n=vv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new O);const r=new O,a=new ee,o=new ee;function c(h,u){let d=0,g=0,m=0;for(let P=0;P<9;P++)i.probe[P].set(0,0,0);let x=0,p=0,f=0,v=0,_=0,M=0,w=0,S=0,E=0,C=0,y=0;h.sort(_v);const b=u===!0?Math.PI:1;for(let P=0,F=h.length;P<F;P++){const I=h[P],z=I.color,N=I.intensity,H=I.distance,B=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)d+=z.r*N*b,g+=z.g*N*b,m+=z.b*N*b;else if(I.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(I.sh.coefficients[q],N);y++}else if(I.isDirectionalLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*b),I.castShadow){const J=I.shadow,Q=n.get(I);Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize=J.mapSize,i.directionalShadow[x]=Q,i.directionalShadowMap[x]=B,i.directionalShadowMatrix[x]=I.shadow.matrix,M++}i.directional[x]=q,x++}else if(I.isSpotLight){const q=e.get(I);q.position.setFromMatrixPosition(I.matrixWorld),q.color.copy(z).multiplyScalar(N*b),q.distance=H,q.coneCos=Math.cos(I.angle),q.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),q.decay=I.decay,i.spot[f]=q;const J=I.shadow;if(I.map&&(i.spotLightMap[E]=I.map,E++,J.updateMatrices(I),I.castShadow&&C++),i.spotLightMatrix[f]=J.matrix,I.castShadow){const Q=n.get(I);Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize=J.mapSize,i.spotShadow[f]=Q,i.spotShadowMap[f]=B,S++}f++}else if(I.isRectAreaLight){const q=e.get(I);q.color.copy(z).multiplyScalar(N),q.halfWidth.set(I.width*.5,0,0),q.halfHeight.set(0,I.height*.5,0),i.rectArea[v]=q,v++}else if(I.isPointLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*b),q.distance=I.distance,q.decay=I.decay,I.castShadow){const J=I.shadow,Q=n.get(I);Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize=J.mapSize,Q.shadowCameraNear=J.camera.near,Q.shadowCameraFar=J.camera.far,i.pointShadow[p]=Q,i.pointShadowMap[p]=B,i.pointShadowMatrix[p]=I.shadow.matrix,w++}i.point[p]=q,p++}else if(I.isHemisphereLight){const q=e.get(I);q.skyColor.copy(I.color).multiplyScalar(N*b),q.groundColor.copy(I.groundColor).multiplyScalar(N*b),i.hemi[_]=q,_++}}v>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=mt.LTC_FLOAT_1,i.rectAreaLTC2=mt.LTC_FLOAT_2):(i.rectAreaLTC1=mt.LTC_HALF_1,i.rectAreaLTC2=mt.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=mt.LTC_FLOAT_1,i.rectAreaLTC2=mt.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=mt.LTC_HALF_1,i.rectAreaLTC2=mt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=g,i.ambient[2]=m;const R=i.hash;(R.directionalLength!==x||R.pointLength!==p||R.spotLength!==f||R.rectAreaLength!==v||R.hemiLength!==_||R.numDirectionalShadows!==M||R.numPointShadows!==w||R.numSpotShadows!==S||R.numSpotMaps!==E||R.numLightProbes!==y)&&(i.directional.length=x,i.spot.length=f,i.rectArea.length=v,i.point.length=p,i.hemi.length=_,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=S+E-C,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=y,R.directionalLength=x,R.pointLength=p,R.spotLength=f,R.rectAreaLength=v,R.hemiLength=_,R.numDirectionalShadows=M,R.numPointShadows=w,R.numSpotShadows=S,R.numSpotMaps=E,R.numLightProbes=y,i.version=xv++)}function l(h,u){let d=0,g=0,m=0,x=0,p=0;const f=u.matrixWorldInverse;for(let v=0,_=h.length;v<_;v++){const M=h[v];if(M.isDirectionalLight){const w=i.directional[d];w.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(f),d++}else if(M.isSpotLight){const w=i.spot[m];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(f),w.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(f),m++}else if(M.isRectAreaLight){const w=i.rectArea[x];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(f),o.identity(),a.copy(M.matrixWorld),a.premultiply(f),o.extractRotation(a),w.halfWidth.set(M.width*.5,0,0),w.halfHeight.set(0,M.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),x++}else if(M.isPointLight){const w=i.point[g];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(f),g++}else if(M.isHemisphereLight){const w=i.hemi[p];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(f),p++}}}return{setup:c,setupView:l,state:i}}function Ol(s,t){const e=new Mv(s,t),n=[],i=[];function r(){n.length=0,i.length=0}function a(u){n.push(u)}function o(u){i.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function yv(s,t){let e=new WeakMap;function n(r,a=0){const o=e.get(r);let c;return o===void 0?(c=new Ol(s,t),e.set(r,[c])):a>=o.length?(c=new Ol(s,t),o.push(c)):c=o[a],c}function i(){e=new WeakMap}return{get:n,dispose:i}}class wv extends rr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=rd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class bv extends rr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Sv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ev=`uniform sampler2D shadow_pass;
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
}`;function Av(s,t,e){let n=new $i;const i=new zt,r=new zt,a=new Zt,o=new wv({depthPacking:ad}),c=new bv,l={},h=e.maxTextureSize,u={[ri]:Ye,[Ye]:ri,[An]:An},d=new we({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new zt},radius:{value:4}},vertexShader:Sv,fragmentShader:Ev}),g=d.clone();g.defines.HORIZONTAL_PASS=1;const m=new Ze;m.setAttribute("position",new Ee(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new me(m,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hh;let f=this.type;this.render=function(S,E,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;const y=s.getRenderTarget(),b=s.getActiveCubeFace(),R=s.getActiveMipmapLevel(),P=s.state;P.setBlending(ii),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const F=f!==Yn&&this.type===Yn,I=f===Yn&&this.type!==Yn;for(let z=0,N=S.length;z<N;z++){const H=S[z],B=H.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);const q=B.getFrameExtents();if(i.multiply(q),r.copy(B.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/q.x),i.x=r.x*q.x,B.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/q.y),i.y=r.y*q.y,B.mapSize.y=r.y)),B.map===null||F===!0||I===!0){const Q=this.type!==Yn?{minFilter:re,magFilter:re}:{};B.map!==null&&B.map.dispose(),B.map=new Gn(i.x,i.y,Q),B.map.texture.name=H.name+".shadowMap",B.camera.updateProjectionMatrix()}s.setRenderTarget(B.map),s.clear();const J=B.getViewportCount();for(let Q=0;Q<J;Q++){const ut=B.getViewport(Q);a.set(r.x*ut.x,r.y*ut.y,r.x*ut.z,r.y*ut.w),P.viewport(a),B.updateMatrices(H,Q),n=B.getFrustum(),M(E,C,B.camera,H,this.type)}B.isPointLightShadow!==!0&&this.type===Yn&&v(B,C),B.needsUpdate=!1}f=this.type,p.needsUpdate=!1,s.setRenderTarget(y,b,R)};function v(S,E){const C=t.update(x);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,g.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,g.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Gn(i.x,i.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(E,null,C,d,x,null),g.uniforms.shadow_pass.value=S.mapPass.texture,g.uniforms.resolution.value=S.mapSize,g.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(E,null,C,g,x,null)}function _(S,E,C,y){let b=null;const R=C.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)b=R;else if(b=C.isPointLight===!0?c:o,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const P=b.uuid,F=E.uuid;let I=l[P];I===void 0&&(I={},l[P]=I);let z=I[F];z===void 0&&(z=b.clone(),I[F]=z,E.addEventListener("dispose",w)),b=z}if(b.visible=E.visible,b.wireframe=E.wireframe,y===Yn?b.side=E.shadowSide!==null?E.shadowSide:E.side:b.side=E.shadowSide!==null?E.shadowSide:u[E.side],b.alphaMap=E.alphaMap,b.alphaTest=E.alphaTest,b.map=E.map,b.clipShadows=E.clipShadows,b.clippingPlanes=E.clippingPlanes,b.clipIntersection=E.clipIntersection,b.displacementMap=E.displacementMap,b.displacementScale=E.displacementScale,b.displacementBias=E.displacementBias,b.wireframeLinewidth=E.wireframeLinewidth,b.linewidth=E.linewidth,C.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const P=s.properties.get(b);P.light=C}return b}function M(S,E,C,y,b){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===Yn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,S.matrixWorld);const F=t.update(S),I=S.material;if(Array.isArray(I)){const z=F.groups;for(let N=0,H=z.length;N<H;N++){const B=z[N],q=I[B.materialIndex];if(q&&q.visible){const J=_(S,q,y,b);S.onBeforeShadow(s,S,E,C,F,J,B),s.renderBufferDirect(C,null,F,J,S,B),S.onAfterShadow(s,S,E,C,F,J,B)}}}else if(I.visible){const z=_(S,I,y,b);S.onBeforeShadow(s,S,E,C,F,z,null),s.renderBufferDirect(C,null,F,z,S,null),S.onAfterShadow(s,S,E,C,F,z,null)}}const P=S.children;for(let F=0,I=P.length;F<I;F++)M(P[F],E,C,y,b)}function w(S){S.target.removeEventListener("dispose",w);for(const C in l){const y=l[C],b=S.target.uuid;b in y&&(y[b].dispose(),delete y[b])}}}function Tv(s,t,e){const n=e.isWebGL2;function i(){let U=!1;const rt=new Zt;let at=null;const St=new Zt(0,0,0,0);return{setMask:function(At){at!==At&&!U&&(s.colorMask(At,At,At,At),at=At)},setLocked:function(At){U=At},setClear:function(At,ne,Qt,xe,Ge){Ge===!0&&(At*=xe,ne*=xe,Qt*=xe),rt.set(At,ne,Qt,xe),St.equals(rt)===!1&&(s.clearColor(At,ne,Qt,xe),St.copy(rt))},reset:function(){U=!1,at=null,St.set(-1,0,0,0)}}}function r(){let U=!1,rt=null,at=null,St=null;return{setTest:function(At){At?Rt(s.DEPTH_TEST):bt(s.DEPTH_TEST)},setMask:function(At){rt!==At&&!U&&(s.depthMask(At),rt=At)},setFunc:function(At){if(at!==At){switch(At){case Ff:s.depthFunc(s.NEVER);break;case kf:s.depthFunc(s.ALWAYS);break;case Of:s.depthFunc(s.LESS);break;case sa:s.depthFunc(s.LEQUAL);break;case Bf:s.depthFunc(s.EQUAL);break;case Gf:s.depthFunc(s.GEQUAL);break;case Hf:s.depthFunc(s.GREATER);break;case Vf:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}at=At}},setLocked:function(At){U=At},setClear:function(At){St!==At&&(s.clearDepth(At),St=At)},reset:function(){U=!1,rt=null,at=null,St=null}}}function a(){let U=!1,rt=null,at=null,St=null,At=null,ne=null,Qt=null,xe=null,Ge=null;return{setTest:function(oe){U||(oe?Rt(s.STENCIL_TEST):bt(s.STENCIL_TEST))},setMask:function(oe){rt!==oe&&!U&&(s.stencilMask(oe),rt=oe)},setFunc:function(oe,He,Ln){(at!==oe||St!==He||At!==Ln)&&(s.stencilFunc(oe,He,Ln),at=oe,St=He,At=Ln)},setOp:function(oe,He,Ln){(ne!==oe||Qt!==He||xe!==Ln)&&(s.stencilOp(oe,He,Ln),ne=oe,Qt=He,xe=Ln)},setLocked:function(oe){U=oe},setClear:function(oe){Ge!==oe&&(s.clearStencil(oe),Ge=oe)},reset:function(){U=!1,rt=null,at=null,St=null,At=null,ne=null,Qt=null,xe=null,Ge=null}}}const o=new i,c=new r,l=new a,h=new WeakMap,u=new WeakMap;let d={},g={},m=new WeakMap,x=[],p=null,f=!1,v=null,_=null,M=null,w=null,S=null,E=null,C=null,y=new Nt(0,0,0),b=0,R=!1,P=null,F=null,I=null,z=null,N=null;const H=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,q=0;const J=s.getParameter(s.VERSION);J.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(J)[1]),B=q>=1):J.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),B=q>=2);let Q=null,ut={};const j=s.getParameter(s.SCISSOR_BOX),tt=s.getParameter(s.VIEWPORT),ft=new Zt().fromArray(j),xt=new Zt().fromArray(tt);function yt(U,rt,at,St){const At=new Uint8Array(4),ne=s.createTexture();s.bindTexture(U,ne),s.texParameteri(U,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(U,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Qt=0;Qt<at;Qt++)n&&(U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY)?s.texImage3D(rt,0,s.RGBA,1,1,St,0,s.RGBA,s.UNSIGNED_BYTE,At):s.texImage2D(rt+Qt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,At);return ne}const Et={};Et[s.TEXTURE_2D]=yt(s.TEXTURE_2D,s.TEXTURE_2D,1),Et[s.TEXTURE_CUBE_MAP]=yt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Et[s.TEXTURE_2D_ARRAY]=yt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Et[s.TEXTURE_3D]=yt(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Rt(s.DEPTH_TEST),c.setFunc(sa),ot(!1),T(wc),Rt(s.CULL_FACE),X(ii);function Rt(U){d[U]!==!0&&(s.enable(U),d[U]=!0)}function bt(U){d[U]!==!1&&(s.disable(U),d[U]=!1)}function Dt(U,rt){return g[U]!==rt?(s.bindFramebuffer(U,rt),g[U]=rt,n&&(U===s.DRAW_FRAMEBUFFER&&(g[s.FRAMEBUFFER]=rt),U===s.FRAMEBUFFER&&(g[s.DRAW_FRAMEBUFFER]=rt)),!0):!1}function G(U,rt){let at=x,St=!1;if(U)if(at=m.get(rt),at===void 0&&(at=[],m.set(rt,at)),U.isWebGLMultipleRenderTargets){const At=U.texture;if(at.length!==At.length||at[0]!==s.COLOR_ATTACHMENT0){for(let ne=0,Qt=At.length;ne<Qt;ne++)at[ne]=s.COLOR_ATTACHMENT0+ne;at.length=At.length,St=!0}}else at[0]!==s.COLOR_ATTACHMENT0&&(at[0]=s.COLOR_ATTACHMENT0,St=!0);else at[0]!==s.BACK&&(at[0]=s.BACK,St=!0);St&&(e.isWebGL2?s.drawBuffers(at):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(at))}function ae(U){return p!==U?(s.useProgram(U),p=U,!0):!1}const gt={[Di]:s.FUNC_ADD,[wf]:s.FUNC_SUBTRACT,[bf]:s.FUNC_REVERSE_SUBTRACT};if(n)gt[Sc]=s.MIN,gt[Ec]=s.MAX;else{const U=t.get("EXT_blend_minmax");U!==null&&(gt[Sc]=U.MIN_EXT,gt[Ec]=U.MAX_EXT)}const lt={[Sf]:s.ZERO,[Ef]:s.ONE,[Af]:s.SRC_COLOR,[Co]:s.SRC_ALPHA,[Df]:s.SRC_ALPHA_SATURATE,[Lf]:s.DST_COLOR,[Rf]:s.DST_ALPHA,[Tf]:s.ONE_MINUS_SRC_COLOR,[Lo]:s.ONE_MINUS_SRC_ALPHA,[Pf]:s.ONE_MINUS_DST_COLOR,[Cf]:s.ONE_MINUS_DST_ALPHA,[If]:s.CONSTANT_COLOR,[Uf]:s.ONE_MINUS_CONSTANT_COLOR,[Nf]:s.CONSTANT_ALPHA,[zf]:s.ONE_MINUS_CONSTANT_ALPHA};function X(U,rt,at,St,At,ne,Qt,xe,Ge,oe){if(U===ii){f===!0&&(bt(s.BLEND),f=!1);return}if(f===!1&&(Rt(s.BLEND),f=!0),U!==yf){if(U!==v||oe!==R){if((_!==Di||S!==Di)&&(s.blendEquation(s.FUNC_ADD),_=Di,S=Di),oe)switch(U){case Ms:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case To:s.blendFunc(s.ONE,s.ONE);break;case bc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ro:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Ms:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case To:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case bc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ro:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}M=null,w=null,E=null,C=null,y.set(0,0,0),b=0,v=U,R=oe}return}At=At||rt,ne=ne||at,Qt=Qt||St,(rt!==_||At!==S)&&(s.blendEquationSeparate(gt[rt],gt[At]),_=rt,S=At),(at!==M||St!==w||ne!==E||Qt!==C)&&(s.blendFuncSeparate(lt[at],lt[St],lt[ne],lt[Qt]),M=at,w=St,E=ne,C=Qt),(xe.equals(y)===!1||Ge!==b)&&(s.blendColor(xe.r,xe.g,xe.b,Ge),y.copy(xe),b=Ge),v=U,R=!1}function st(U,rt){U.side===An?bt(s.CULL_FACE):Rt(s.CULL_FACE);let at=U.side===Ye;rt&&(at=!at),ot(at),U.blending===Ms&&U.transparent===!1?X(ii):X(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),c.setFunc(U.depthFunc),c.setTest(U.depthTest),c.setMask(U.depthWrite),o.setMask(U.colorWrite);const St=U.stencilWrite;l.setTest(St),St&&(l.setMask(U.stencilWriteMask),l.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),l.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),L(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Rt(s.SAMPLE_ALPHA_TO_COVERAGE):bt(s.SAMPLE_ALPHA_TO_COVERAGE)}function ot(U){P!==U&&(U?s.frontFace(s.CW):s.frontFace(s.CCW),P=U)}function T(U){U!==xf?(Rt(s.CULL_FACE),U!==F&&(U===wc?s.cullFace(s.BACK):U===_f?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):bt(s.CULL_FACE),F=U}function A(U){U!==I&&(B&&s.lineWidth(U),I=U)}function L(U,rt,at){U?(Rt(s.POLYGON_OFFSET_FILL),(z!==rt||N!==at)&&(s.polygonOffset(rt,at),z=rt,N=at)):bt(s.POLYGON_OFFSET_FILL)}function k(U){U?Rt(s.SCISSOR_TEST):bt(s.SCISSOR_TEST)}function $(U){U===void 0&&(U=s.TEXTURE0+H-1),Q!==U&&(s.activeTexture(U),Q=U)}function W(U,rt,at){at===void 0&&(Q===null?at=s.TEXTURE0+H-1:at=Q);let St=ut[at];St===void 0&&(St={type:void 0,texture:void 0},ut[at]=St),(St.type!==U||St.texture!==rt)&&(Q!==at&&(s.activeTexture(at),Q=at),s.bindTexture(U,rt||Et[U]),St.type=U,St.texture=rt)}function ht(){const U=ut[Q];U!==void 0&&U.type!==void 0&&(s.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function it(){try{s.compressedTexImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function dt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function vt(){try{s.texSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ct(){try{s.texSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function nt(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Jt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Bt(){try{s.texStorage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function It(){try{s.texStorage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Lt(){try{s.texImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function _t(){try{s.texImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function kt(U){ft.equals(U)===!1&&(s.scissor(U.x,U.y,U.z,U.w),ft.copy(U))}function Kt(U){xt.equals(U)===!1&&(s.viewport(U.x,U.y,U.z,U.w),xt.copy(U))}function jt(U,rt){let at=u.get(rt);at===void 0&&(at=new WeakMap,u.set(rt,at));let St=at.get(U);St===void 0&&(St=s.getUniformBlockIndex(rt,U.name),at.set(U,St))}function Gt(U,rt){const St=u.get(rt).get(U);h.get(rt)!==St&&(s.uniformBlockBinding(rt,St,U.__bindingPointIndex),h.set(rt,St))}function et(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},Q=null,ut={},g={},m=new WeakMap,x=[],p=null,f=!1,v=null,_=null,M=null,w=null,S=null,E=null,C=null,y=new Nt(0,0,0),b=0,R=!1,P=null,F=null,I=null,z=null,N=null,ft.set(0,0,s.canvas.width,s.canvas.height),xt.set(0,0,s.canvas.width,s.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:Rt,disable:bt,bindFramebuffer:Dt,drawBuffers:G,useProgram:ae,setBlending:X,setMaterial:st,setFlipSided:ot,setCullFace:T,setLineWidth:A,setPolygonOffset:L,setScissorTest:k,activeTexture:$,bindTexture:W,unbindTexture:ht,compressedTexImage2D:it,compressedTexImage3D:dt,texImage2D:Lt,texImage3D:_t,updateUBOMapping:jt,uniformBlockBinding:Gt,texStorage2D:Bt,texStorage3D:It,texSubImage2D:vt,texSubImage3D:Ct,compressedTexSubImage2D:nt,compressedTexSubImage3D:Jt,scissor:kt,viewport:Kt,reset:et}}function Rv(s,t,e,n,i,r,a){const o=i.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(T,A){return g?new OffscreenCanvas(T,A):ua("canvas")}function x(T,A,L,k){let $=1;if((T.width>k||T.height>k)&&($=k/Math.max(T.width,T.height)),$<1||A===!0)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap){const W=A?ha:Math.floor,ht=W($*T.width),it=W($*T.height);u===void 0&&(u=m(ht,it));const dt=L?m(ht,it):u;return dt.width=ht,dt.height=it,dt.getContext("2d").drawImage(T,0,0,ht,it),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+T.width+"x"+T.height+") to ("+ht+"x"+it+")."),dt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+T.width+"x"+T.height+")."),T;return T}function p(T){return No(T.width)&&No(T.height)}function f(T){return o?!1:T.wrapS!==qe||T.wrapT!==qe||T.minFilter!==re&&T.minFilter!==De}function v(T,A){return T.generateMipmaps&&A&&T.minFilter!==re&&T.minFilter!==De}function _(T){s.generateMipmap(T)}function M(T,A,L,k,$=!1){if(o===!1)return A;if(T!==null){if(s[T]!==void 0)return s[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let W=A;if(A===s.RED&&(L===s.FLOAT&&(W=s.R32F),L===s.HALF_FLOAT&&(W=s.R16F),L===s.UNSIGNED_BYTE&&(W=s.R8)),A===s.RED_INTEGER&&(L===s.UNSIGNED_BYTE&&(W=s.R8UI),L===s.UNSIGNED_SHORT&&(W=s.R16UI),L===s.UNSIGNED_INT&&(W=s.R32UI),L===s.BYTE&&(W=s.R8I),L===s.SHORT&&(W=s.R16I),L===s.INT&&(W=s.R32I)),A===s.RG&&(L===s.FLOAT&&(W=s.RG32F),L===s.HALF_FLOAT&&(W=s.RG16F),L===s.UNSIGNED_BYTE&&(W=s.RG8)),A===s.RGBA){const ht=$?aa:se.getTransfer(k);L===s.FLOAT&&(W=s.RGBA32F),L===s.HALF_FLOAT&&(W=s.RGBA16F),L===s.UNSIGNED_BYTE&&(W=ht===he?s.SRGB8_ALPHA8:s.RGBA8),L===s.UNSIGNED_SHORT_4_4_4_4&&(W=s.RGBA4),L===s.UNSIGNED_SHORT_5_5_5_1&&(W=s.RGB5_A1)}return(W===s.R16F||W===s.R32F||W===s.RG16F||W===s.RG32F||W===s.RGBA16F||W===s.RGBA32F)&&t.get("EXT_color_buffer_float"),W}function w(T,A,L){return v(T,L)===!0||T.isFramebufferTexture&&T.minFilter!==re&&T.minFilter!==De?Math.log2(Math.max(A.width,A.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?A.mipmaps.length:1}function S(T){return T===re||T===Ac||T===Ia?s.NEAREST:s.LINEAR}function E(T){const A=T.target;A.removeEventListener("dispose",E),y(A),A.isVideoTexture&&h.delete(A)}function C(T){const A=T.target;A.removeEventListener("dispose",C),R(A)}function y(T){const A=n.get(T);if(A.__webglInit===void 0)return;const L=T.source,k=d.get(L);if(k){const $=k[A.__cacheKey];$.usedTimes--,$.usedTimes===0&&b(T),Object.keys(k).length===0&&d.delete(L)}n.remove(T)}function b(T){const A=n.get(T);s.deleteTexture(A.__webglTexture);const L=T.source,k=d.get(L);delete k[A.__cacheKey],a.memory.textures--}function R(T){const A=T.texture,L=n.get(T),k=n.get(A);if(k.__webglTexture!==void 0&&(s.deleteTexture(k.__webglTexture),a.memory.textures--),T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(L.__webglFramebuffer[$]))for(let W=0;W<L.__webglFramebuffer[$].length;W++)s.deleteFramebuffer(L.__webglFramebuffer[$][W]);else s.deleteFramebuffer(L.__webglFramebuffer[$]);L.__webglDepthbuffer&&s.deleteRenderbuffer(L.__webglDepthbuffer[$])}else{if(Array.isArray(L.__webglFramebuffer))for(let $=0;$<L.__webglFramebuffer.length;$++)s.deleteFramebuffer(L.__webglFramebuffer[$]);else s.deleteFramebuffer(L.__webglFramebuffer);if(L.__webglDepthbuffer&&s.deleteRenderbuffer(L.__webglDepthbuffer),L.__webglMultisampledFramebuffer&&s.deleteFramebuffer(L.__webglMultisampledFramebuffer),L.__webglColorRenderbuffer)for(let $=0;$<L.__webglColorRenderbuffer.length;$++)L.__webglColorRenderbuffer[$]&&s.deleteRenderbuffer(L.__webglColorRenderbuffer[$]);L.__webglDepthRenderbuffer&&s.deleteRenderbuffer(L.__webglDepthRenderbuffer)}if(T.isWebGLMultipleRenderTargets)for(let $=0,W=A.length;$<W;$++){const ht=n.get(A[$]);ht.__webglTexture&&(s.deleteTexture(ht.__webglTexture),a.memory.textures--),n.remove(A[$])}n.remove(A),n.remove(T)}let P=0;function F(){P=0}function I(){const T=P;return T>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+i.maxTextures),P+=1,T}function z(T){const A=[];return A.push(T.wrapS),A.push(T.wrapT),A.push(T.wrapR||0),A.push(T.magFilter),A.push(T.minFilter),A.push(T.anisotropy),A.push(T.internalFormat),A.push(T.format),A.push(T.type),A.push(T.generateMipmaps),A.push(T.premultiplyAlpha),A.push(T.flipY),A.push(T.unpackAlignment),A.push(T.colorSpace),A.join()}function N(T,A){const L=n.get(T);if(T.isVideoTexture&&st(T),T.isRenderTargetTexture===!1&&T.version>0&&L.__version!==T.version){const k=T.image;if(k===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ft(L,T,A);return}}e.bindTexture(s.TEXTURE_2D,L.__webglTexture,s.TEXTURE0+A)}function H(T,A){const L=n.get(T);if(T.version>0&&L.__version!==T.version){ft(L,T,A);return}e.bindTexture(s.TEXTURE_2D_ARRAY,L.__webglTexture,s.TEXTURE0+A)}function B(T,A){const L=n.get(T);if(T.version>0&&L.__version!==T.version){ft(L,T,A);return}e.bindTexture(s.TEXTURE_3D,L.__webglTexture,s.TEXTURE0+A)}function q(T,A){const L=n.get(T);if(T.version>0&&L.__version!==T.version){xt(L,T,A);return}e.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+A)}const J={[ra]:s.REPEAT,[qe]:s.CLAMP_TO_EDGE,[Io]:s.MIRRORED_REPEAT},Q={[re]:s.NEAREST,[Ac]:s.NEAREST_MIPMAP_NEAREST,[Ia]:s.NEAREST_MIPMAP_LINEAR,[De]:s.LINEAR,[Jf]:s.LINEAR_MIPMAP_NEAREST,[Gi]:s.LINEAR_MIPMAP_LINEAR},ut={[ld]:s.NEVER,[md]:s.ALWAYS,[hd]:s.LESS,[tu]:s.LEQUAL,[ud]:s.EQUAL,[pd]:s.GEQUAL,[fd]:s.GREATER,[dd]:s.NOTEQUAL};function j(T,A,L){if(L?(s.texParameteri(T,s.TEXTURE_WRAP_S,J[A.wrapS]),s.texParameteri(T,s.TEXTURE_WRAP_T,J[A.wrapT]),(T===s.TEXTURE_3D||T===s.TEXTURE_2D_ARRAY)&&s.texParameteri(T,s.TEXTURE_WRAP_R,J[A.wrapR]),s.texParameteri(T,s.TEXTURE_MAG_FILTER,Q[A.magFilter]),s.texParameteri(T,s.TEXTURE_MIN_FILTER,Q[A.minFilter])):(s.texParameteri(T,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(T,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(T===s.TEXTURE_3D||T===s.TEXTURE_2D_ARRAY)&&s.texParameteri(T,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(A.wrapS!==qe||A.wrapT!==qe)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(T,s.TEXTURE_MAG_FILTER,S(A.magFilter)),s.texParameteri(T,s.TEXTURE_MIN_FILTER,S(A.minFilter)),A.minFilter!==re&&A.minFilter!==De&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),A.compareFunction&&(s.texParameteri(T,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(T,s.TEXTURE_COMPARE_FUNC,ut[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const k=t.get("EXT_texture_filter_anisotropic");if(A.magFilter===re||A.minFilter!==Ia&&A.minFilter!==Gi||A.type===ti&&t.has("OES_texture_float_linear")===!1||o===!1&&A.type===xi&&t.has("OES_texture_half_float_linear")===!1)return;(A.anisotropy>1||n.get(A).__currentAnisotropy)&&(s.texParameterf(T,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,i.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy)}}function tt(T,A){let L=!1;T.__webglInit===void 0&&(T.__webglInit=!0,A.addEventListener("dispose",E));const k=A.source;let $=d.get(k);$===void 0&&($={},d.set(k,$));const W=z(A);if(W!==T.__cacheKey){$[W]===void 0&&($[W]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,L=!0),$[W].usedTimes++;const ht=$[T.__cacheKey];ht!==void 0&&($[T.__cacheKey].usedTimes--,ht.usedTimes===0&&b(A)),T.__cacheKey=W,T.__webglTexture=$[W].texture}return L}function ft(T,A,L){let k=s.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(k=s.TEXTURE_2D_ARRAY),A.isData3DTexture&&(k=s.TEXTURE_3D);const $=tt(T,A),W=A.source;e.bindTexture(k,T.__webglTexture,s.TEXTURE0+L);const ht=n.get(W);if(W.version!==ht.__version||$===!0){e.activeTexture(s.TEXTURE0+L);const it=se.getPrimaries(se.workingColorSpace),dt=A.colorSpace===xn?null:se.getPrimaries(A.colorSpace),vt=A.colorSpace===xn||it===dt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const Ct=f(A)&&p(A.image)===!1;let nt=x(A.image,Ct,!1,i.maxTextureSize);nt=ot(A,nt);const Jt=p(nt)||o,Bt=r.convert(A.format,A.colorSpace);let It=r.convert(A.type),Lt=M(A.internalFormat,Bt,It,A.colorSpace,A.isVideoTexture);j(k,A,Jt);let _t;const kt=A.mipmaps,Kt=o&&A.isVideoTexture!==!0&&Lt!==Jh,jt=ht.__version===void 0||$===!0,Gt=w(A,nt,Jt);if(A.isDepthTexture)Lt=s.DEPTH_COMPONENT,o?A.type===ti?Lt=s.DEPTH_COMPONENT32F:A.type===Qn?Lt=s.DEPTH_COMPONENT24:A.type===ki?Lt=s.DEPTH24_STENCIL8:Lt=s.DEPTH_COMPONENT16:A.type===ti&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),A.format===Oi&&Lt===s.DEPTH_COMPONENT&&A.type!==Ko&&A.type!==Qn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),A.type=Qn,It=r.convert(A.type)),A.format===Es&&Lt===s.DEPTH_COMPONENT&&(Lt=s.DEPTH_STENCIL,A.type!==ki&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),A.type=ki,It=r.convert(A.type))),jt&&(Kt?e.texStorage2D(s.TEXTURE_2D,1,Lt,nt.width,nt.height):e.texImage2D(s.TEXTURE_2D,0,Lt,nt.width,nt.height,0,Bt,It,null));else if(A.isDataTexture)if(kt.length>0&&Jt){Kt&&jt&&e.texStorage2D(s.TEXTURE_2D,Gt,Lt,kt[0].width,kt[0].height);for(let et=0,U=kt.length;et<U;et++)_t=kt[et],Kt?e.texSubImage2D(s.TEXTURE_2D,et,0,0,_t.width,_t.height,Bt,It,_t.data):e.texImage2D(s.TEXTURE_2D,et,Lt,_t.width,_t.height,0,Bt,It,_t.data);A.generateMipmaps=!1}else Kt?(jt&&e.texStorage2D(s.TEXTURE_2D,Gt,Lt,nt.width,nt.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,nt.width,nt.height,Bt,It,nt.data)):e.texImage2D(s.TEXTURE_2D,0,Lt,nt.width,nt.height,0,Bt,It,nt.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Kt&&jt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Gt,Lt,kt[0].width,kt[0].height,nt.depth);for(let et=0,U=kt.length;et<U;et++)_t=kt[et],A.format!==Se?Bt!==null?Kt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,et,0,0,0,_t.width,_t.height,nt.depth,Bt,_t.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,et,Lt,_t.width,_t.height,nt.depth,0,_t.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Kt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,et,0,0,0,_t.width,_t.height,nt.depth,Bt,It,_t.data):e.texImage3D(s.TEXTURE_2D_ARRAY,et,Lt,_t.width,_t.height,nt.depth,0,Bt,It,_t.data)}else{Kt&&jt&&e.texStorage2D(s.TEXTURE_2D,Gt,Lt,kt[0].width,kt[0].height);for(let et=0,U=kt.length;et<U;et++)_t=kt[et],A.format!==Se?Bt!==null?Kt?e.compressedTexSubImage2D(s.TEXTURE_2D,et,0,0,_t.width,_t.height,Bt,_t.data):e.compressedTexImage2D(s.TEXTURE_2D,et,Lt,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Kt?e.texSubImage2D(s.TEXTURE_2D,et,0,0,_t.width,_t.height,Bt,It,_t.data):e.texImage2D(s.TEXTURE_2D,et,Lt,_t.width,_t.height,0,Bt,It,_t.data)}else if(A.isDataArrayTexture)Kt?(jt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Gt,Lt,nt.width,nt.height,nt.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,Bt,It,nt.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,Lt,nt.width,nt.height,nt.depth,0,Bt,It,nt.data);else if(A.isData3DTexture)Kt?(jt&&e.texStorage3D(s.TEXTURE_3D,Gt,Lt,nt.width,nt.height,nt.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,Bt,It,nt.data)):e.texImage3D(s.TEXTURE_3D,0,Lt,nt.width,nt.height,nt.depth,0,Bt,It,nt.data);else if(A.isFramebufferTexture){if(jt)if(Kt)e.texStorage2D(s.TEXTURE_2D,Gt,Lt,nt.width,nt.height);else{let et=nt.width,U=nt.height;for(let rt=0;rt<Gt;rt++)e.texImage2D(s.TEXTURE_2D,rt,Lt,et,U,0,Bt,It,null),et>>=1,U>>=1}}else if(kt.length>0&&Jt){Kt&&jt&&e.texStorage2D(s.TEXTURE_2D,Gt,Lt,kt[0].width,kt[0].height);for(let et=0,U=kt.length;et<U;et++)_t=kt[et],Kt?e.texSubImage2D(s.TEXTURE_2D,et,0,0,Bt,It,_t):e.texImage2D(s.TEXTURE_2D,et,Lt,Bt,It,_t);A.generateMipmaps=!1}else Kt?(jt&&e.texStorage2D(s.TEXTURE_2D,Gt,Lt,nt.width,nt.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Bt,It,nt)):e.texImage2D(s.TEXTURE_2D,0,Lt,Bt,It,nt);v(A,Jt)&&_(k),ht.__version=W.version,A.onUpdate&&A.onUpdate(A)}T.__version=A.version}function xt(T,A,L){if(A.image.length!==6)return;const k=tt(T,A),$=A.source;e.bindTexture(s.TEXTURE_CUBE_MAP,T.__webglTexture,s.TEXTURE0+L);const W=n.get($);if($.version!==W.__version||k===!0){e.activeTexture(s.TEXTURE0+L);const ht=se.getPrimaries(se.workingColorSpace),it=A.colorSpace===xn?null:se.getPrimaries(A.colorSpace),dt=A.colorSpace===xn||ht===it?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const vt=A.isCompressedTexture||A.image[0].isCompressedTexture,Ct=A.image[0]&&A.image[0].isDataTexture,nt=[];for(let et=0;et<6;et++)!vt&&!Ct?nt[et]=x(A.image[et],!1,!0,i.maxCubemapSize):nt[et]=Ct?A.image[et].image:A.image[et],nt[et]=ot(A,nt[et]);const Jt=nt[0],Bt=p(Jt)||o,It=r.convert(A.format,A.colorSpace),Lt=r.convert(A.type),_t=M(A.internalFormat,It,Lt,A.colorSpace),kt=o&&A.isVideoTexture!==!0,Kt=W.__version===void 0||k===!0;let jt=w(A,Jt,Bt);j(s.TEXTURE_CUBE_MAP,A,Bt);let Gt;if(vt){kt&&Kt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,jt,_t,Jt.width,Jt.height);for(let et=0;et<6;et++){Gt=nt[et].mipmaps;for(let U=0;U<Gt.length;U++){const rt=Gt[U];A.format!==Se?It!==null?kt?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,U,0,0,rt.width,rt.height,It,rt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,U,_t,rt.width,rt.height,0,rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,U,0,0,rt.width,rt.height,It,Lt,rt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,U,_t,rt.width,rt.height,0,It,Lt,rt.data)}}}else{Gt=A.mipmaps,kt&&Kt&&(Gt.length>0&&jt++,e.texStorage2D(s.TEXTURE_CUBE_MAP,jt,_t,nt[0].width,nt[0].height));for(let et=0;et<6;et++)if(Ct){kt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,nt[et].width,nt[et].height,It,Lt,nt[et].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,_t,nt[et].width,nt[et].height,0,It,Lt,nt[et].data);for(let U=0;U<Gt.length;U++){const at=Gt[U].image[et].image;kt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,U+1,0,0,at.width,at.height,It,Lt,at.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,U+1,_t,at.width,at.height,0,It,Lt,at.data)}}else{kt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,It,Lt,nt[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,_t,It,Lt,nt[et]);for(let U=0;U<Gt.length;U++){const rt=Gt[U];kt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,U+1,0,0,It,Lt,rt.image[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,U+1,_t,It,Lt,rt.image[et])}}}v(A,Bt)&&_(s.TEXTURE_CUBE_MAP),W.__version=$.version,A.onUpdate&&A.onUpdate(A)}T.__version=A.version}function yt(T,A,L,k,$,W){const ht=r.convert(L.format,L.colorSpace),it=r.convert(L.type),dt=M(L.internalFormat,ht,it,L.colorSpace);if(!n.get(A).__hasExternalTextures){const Ct=Math.max(1,A.width>>W),nt=Math.max(1,A.height>>W);$===s.TEXTURE_3D||$===s.TEXTURE_2D_ARRAY?e.texImage3D($,W,dt,Ct,nt,A.depth,0,ht,it,null):e.texImage2D($,W,dt,Ct,nt,0,ht,it,null)}e.bindFramebuffer(s.FRAMEBUFFER,T),X(A)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,k,$,n.get(L).__webglTexture,0,lt(A)):($===s.TEXTURE_2D||$>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,k,$,n.get(L).__webglTexture,W),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Et(T,A,L){if(s.bindRenderbuffer(s.RENDERBUFFER,T),A.depthBuffer&&!A.stencilBuffer){let k=o===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(L||X(A)){const $=A.depthTexture;$&&$.isDepthTexture&&($.type===ti?k=s.DEPTH_COMPONENT32F:$.type===Qn&&(k=s.DEPTH_COMPONENT24));const W=lt(A);X(A)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,W,k,A.width,A.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,W,k,A.width,A.height)}else s.renderbufferStorage(s.RENDERBUFFER,k,A.width,A.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,T)}else if(A.depthBuffer&&A.stencilBuffer){const k=lt(A);L&&X(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,k,s.DEPTH24_STENCIL8,A.width,A.height):X(A)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,k,s.DEPTH24_STENCIL8,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,T)}else{const k=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let $=0;$<k.length;$++){const W=k[$],ht=r.convert(W.format,W.colorSpace),it=r.convert(W.type),dt=M(W.internalFormat,ht,it,W.colorSpace),vt=lt(A);L&&X(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,vt,dt,A.width,A.height):X(A)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,vt,dt,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,dt,A.width,A.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Rt(T,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,T),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(A.depthTexture).__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),N(A.depthTexture,0);const k=n.get(A.depthTexture).__webglTexture,$=lt(A);if(A.depthTexture.format===Oi)X(A)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,k,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,k,0);else if(A.depthTexture.format===Es)X(A)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,k,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,k,0);else throw new Error("Unknown depthTexture format")}function bt(T){const A=n.get(T),L=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!A.__autoAllocateDepthBuffer){if(L)throw new Error("target.depthTexture not supported in Cube render targets");Rt(A.__webglFramebuffer,T)}else if(L){A.__webglDepthbuffer=[];for(let k=0;k<6;k++)e.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[k]),A.__webglDepthbuffer[k]=s.createRenderbuffer(),Et(A.__webglDepthbuffer[k],T,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer=s.createRenderbuffer(),Et(A.__webglDepthbuffer,T,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Dt(T,A,L){const k=n.get(T);A!==void 0&&yt(k.__webglFramebuffer,T,T.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),L!==void 0&&bt(T)}function G(T){const A=T.texture,L=n.get(T),k=n.get(A);T.addEventListener("dispose",C),T.isWebGLMultipleRenderTargets!==!0&&(k.__webglTexture===void 0&&(k.__webglTexture=s.createTexture()),k.__version=A.version,a.memory.textures++);const $=T.isWebGLCubeRenderTarget===!0,W=T.isWebGLMultipleRenderTargets===!0,ht=p(T)||o;if($){L.__webglFramebuffer=[];for(let it=0;it<6;it++)if(o&&A.mipmaps&&A.mipmaps.length>0){L.__webglFramebuffer[it]=[];for(let dt=0;dt<A.mipmaps.length;dt++)L.__webglFramebuffer[it][dt]=s.createFramebuffer()}else L.__webglFramebuffer[it]=s.createFramebuffer()}else{if(o&&A.mipmaps&&A.mipmaps.length>0){L.__webglFramebuffer=[];for(let it=0;it<A.mipmaps.length;it++)L.__webglFramebuffer[it]=s.createFramebuffer()}else L.__webglFramebuffer=s.createFramebuffer();if(W)if(i.drawBuffers){const it=T.texture;for(let dt=0,vt=it.length;dt<vt;dt++){const Ct=n.get(it[dt]);Ct.__webglTexture===void 0&&(Ct.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&T.samples>0&&X(T)===!1){const it=W?A:[A];L.__webglMultisampledFramebuffer=s.createFramebuffer(),L.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,L.__webglMultisampledFramebuffer);for(let dt=0;dt<it.length;dt++){const vt=it[dt];L.__webglColorRenderbuffer[dt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,L.__webglColorRenderbuffer[dt]);const Ct=r.convert(vt.format,vt.colorSpace),nt=r.convert(vt.type),Jt=M(vt.internalFormat,Ct,nt,vt.colorSpace,T.isXRRenderTarget===!0),Bt=lt(T);s.renderbufferStorageMultisample(s.RENDERBUFFER,Bt,Jt,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.RENDERBUFFER,L.__webglColorRenderbuffer[dt])}s.bindRenderbuffer(s.RENDERBUFFER,null),T.depthBuffer&&(L.__webglDepthRenderbuffer=s.createRenderbuffer(),Et(L.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if($){e.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture),j(s.TEXTURE_CUBE_MAP,A,ht);for(let it=0;it<6;it++)if(o&&A.mipmaps&&A.mipmaps.length>0)for(let dt=0;dt<A.mipmaps.length;dt++)yt(L.__webglFramebuffer[it][dt],T,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+it,dt);else yt(L.__webglFramebuffer[it],T,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);v(A,ht)&&_(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(W){const it=T.texture;for(let dt=0,vt=it.length;dt<vt;dt++){const Ct=it[dt],nt=n.get(Ct);e.bindTexture(s.TEXTURE_2D,nt.__webglTexture),j(s.TEXTURE_2D,Ct,ht),yt(L.__webglFramebuffer,T,Ct,s.COLOR_ATTACHMENT0+dt,s.TEXTURE_2D,0),v(Ct,ht)&&_(s.TEXTURE_2D)}e.unbindTexture()}else{let it=s.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(o?it=T.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(it,k.__webglTexture),j(it,A,ht),o&&A.mipmaps&&A.mipmaps.length>0)for(let dt=0;dt<A.mipmaps.length;dt++)yt(L.__webglFramebuffer[dt],T,A,s.COLOR_ATTACHMENT0,it,dt);else yt(L.__webglFramebuffer,T,A,s.COLOR_ATTACHMENT0,it,0);v(A,ht)&&_(it),e.unbindTexture()}T.depthBuffer&&bt(T)}function ae(T){const A=p(T)||o,L=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let k=0,$=L.length;k<$;k++){const W=L[k];if(v(W,A)){const ht=T.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,it=n.get(W).__webglTexture;e.bindTexture(ht,it),_(ht),e.unbindTexture()}}}function gt(T){if(o&&T.samples>0&&X(T)===!1){const A=T.isWebGLMultipleRenderTargets?T.texture:[T.texture],L=T.width,k=T.height;let $=s.COLOR_BUFFER_BIT;const W=[],ht=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,it=n.get(T),dt=T.isWebGLMultipleRenderTargets===!0;if(dt)for(let vt=0;vt<A.length;vt++)e.bindFramebuffer(s.FRAMEBUFFER,it.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,it.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,it.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,it.__webglFramebuffer);for(let vt=0;vt<A.length;vt++){W.push(s.COLOR_ATTACHMENT0+vt),T.depthBuffer&&W.push(ht);const Ct=it.__ignoreDepthValues!==void 0?it.__ignoreDepthValues:!1;if(Ct===!1&&(T.depthBuffer&&($|=s.DEPTH_BUFFER_BIT),T.stencilBuffer&&($|=s.STENCIL_BUFFER_BIT)),dt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,it.__webglColorRenderbuffer[vt]),Ct===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[ht]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[ht])),dt){const nt=n.get(A[vt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,nt,0)}s.blitFramebuffer(0,0,L,k,0,0,L,k,$,s.NEAREST),l&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,W)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),dt)for(let vt=0;vt<A.length;vt++){e.bindFramebuffer(s.FRAMEBUFFER,it.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.RENDERBUFFER,it.__webglColorRenderbuffer[vt]);const Ct=n.get(A[vt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,it.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.TEXTURE_2D,Ct,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,it.__webglMultisampledFramebuffer)}}function lt(T){return Math.min(i.maxSamples,T.samples)}function X(T){const A=n.get(T);return o&&T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function st(T){const A=a.render.frame;h.get(T)!==A&&(h.set(T,A),T.update())}function ot(T,A){const L=T.colorSpace,k=T.format,$=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||T.format===Uo||L!==ai&&L!==xn&&(se.getTransfer(L)===he?o===!1?t.has("EXT_sRGB")===!0&&k===Se?(T.format=Uo,T.minFilter=De,T.generateMipmaps=!1):A=nu.sRGBToLinear(A):(k!==Se||$!==ge)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",L)),A}this.allocateTextureUnit=I,this.resetTextureUnits=F,this.setTexture2D=N,this.setTexture2DArray=H,this.setTexture3D=B,this.setTextureCube=q,this.rebindTextures=Dt,this.setupRenderTarget=G,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=bt,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=X}function Cv(s,t,e){const n=e.isWebGL2;function i(r,a=xn){let o;const c=se.getTransfer(a);if(r===ge)return s.UNSIGNED_BYTE;if(r===Xh)return s.UNSIGNED_SHORT_4_4_4_4;if(r===qh)return s.UNSIGNED_SHORT_5_5_5_1;if(r===Qf)return s.BYTE;if(r===td)return s.SHORT;if(r===Ko)return s.UNSIGNED_SHORT;if(r===$h)return s.INT;if(r===Qn)return s.UNSIGNED_INT;if(r===ti)return s.FLOAT;if(r===xi)return n?s.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===ed)return s.ALPHA;if(r===Se)return s.RGBA;if(r===nd)return s.LUMINANCE;if(r===id)return s.LUMINANCE_ALPHA;if(r===Oi)return s.DEPTH_COMPONENT;if(r===Es)return s.DEPTH_STENCIL;if(r===Uo)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Vi)return s.RED;if(r===jh)return s.RED_INTEGER;if(r===Yh)return s.RG;if(r===Kh)return s.RG_INTEGER;if(r===Zh)return s.RGBA_INTEGER;if(r===Ua||r===Na||r===za||r===Fa)if(c===he)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Ua)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Na)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===za)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Fa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Ua)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Na)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===za)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Fa)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Tc||r===Rc||r===Cc||r===Lc)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Tc)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Rc)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Cc)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Lc)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Jh)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Pc||r===Dc)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===Pc)return c===he?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Dc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ic||r===Uc||r===Nc||r===zc||r===Fc||r===kc||r===Oc||r===Bc||r===Gc||r===Hc||r===Vc||r===Wc||r===$c||r===Xc)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Ic)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Uc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Nc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===zc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Fc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===kc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Oc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Bc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Gc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Hc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Vc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Wc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===$c)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Xc)return c===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ka||r===qc||r===jc)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===ka)return c===he?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===qc)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===jc)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===sd||r===Yc||r===Kc||r===Zc)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===ka)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Yc)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Kc)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Zc)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ki?n?s.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class Lv extends ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class je extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Pv={type:"move"};class oo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const x of t.hand.values()){const p=e.getJointPose(x,n),f=this._getHandJoint(l,x);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),g=.02,m=.005;l.inputState.pinching&&d>g+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=g-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Pv)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new je;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Dv extends Ts{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,g=null,m=null;const x=e.getContextAttributes();let p=null,f=null;const v=[],_=[],M=new zt;let w=null;const S=new ln;S.layers.enable(1),S.viewport=new Zt;const E=new ln;E.layers.enable(2),E.viewport=new Zt;const C=[S,E],y=new Lv;y.layers.enable(1),y.layers.enable(2);let b=null,R=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let tt=v[j];return tt===void 0&&(tt=new oo,v[j]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(j){let tt=v[j];return tt===void 0&&(tt=new oo,v[j]=tt),tt.getGripSpace()},this.getHand=function(j){let tt=v[j];return tt===void 0&&(tt=new oo,v[j]=tt),tt.getHandSpace()};function P(j){const tt=_.indexOf(j.inputSource);if(tt===-1)return;const ft=v[tt];ft!==void 0&&(ft.update(j.inputSource,j.frame,l||a),ft.dispatchEvent({type:j.type,data:j.inputSource}))}function F(){i.removeEventListener("select",P),i.removeEventListener("selectstart",P),i.removeEventListener("selectend",P),i.removeEventListener("squeeze",P),i.removeEventListener("squeezestart",P),i.removeEventListener("squeezeend",P),i.removeEventListener("end",F),i.removeEventListener("inputsourceschange",I);for(let j=0;j<v.length;j++){const tt=_[j];tt!==null&&(_[j]=null,v[j].disconnect(tt))}b=null,R=null,t.setRenderTarget(p),g=null,d=null,u=null,i=null,f=null,ut.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return d!==null?d:g},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(j){if(i=j,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",P),i.addEventListener("selectstart",P),i.addEventListener("selectend",P),i.addEventListener("squeeze",P),i.addEventListener("squeezestart",P),i.addEventListener("squeezeend",P),i.addEventListener("end",F),i.addEventListener("inputsourceschange",I),x.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(M),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const tt={antialias:i.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(i,e,tt),i.updateRenderState({baseLayer:g}),t.setPixelRatio(1),t.setSize(g.framebufferWidth,g.framebufferHeight,!1),f=new Gn(g.framebufferWidth,g.framebufferHeight,{format:Se,type:ge,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let tt=null,ft=null,xt=null;x.depth&&(xt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=x.stencil?Es:Oi,ft=x.stencil?ki:Qn);const yt={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:r};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(yt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),f=new Gn(d.textureWidth,d.textureHeight,{format:Se,type:ge,depthTexture:new ic(d.textureWidth,d.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});const Et=t.properties.get(f);Et.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),ut.setContext(i),ut.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function I(j){for(let tt=0;tt<j.removed.length;tt++){const ft=j.removed[tt],xt=_.indexOf(ft);xt>=0&&(_[xt]=null,v[xt].disconnect(ft))}for(let tt=0;tt<j.added.length;tt++){const ft=j.added[tt];let xt=_.indexOf(ft);if(xt===-1){for(let Et=0;Et<v.length;Et++)if(Et>=_.length){_.push(ft),xt=Et;break}else if(_[Et]===null){_[Et]=ft,xt=Et;break}if(xt===-1)break}const yt=v[xt];yt&&yt.connect(ft)}}const z=new O,N=new O;function H(j,tt,ft){z.setFromMatrixPosition(tt.matrixWorld),N.setFromMatrixPosition(ft.matrixWorld);const xt=z.distanceTo(N),yt=tt.projectionMatrix.elements,Et=ft.projectionMatrix.elements,Rt=yt[14]/(yt[10]-1),bt=yt[14]/(yt[10]+1),Dt=(yt[9]+1)/yt[5],G=(yt[9]-1)/yt[5],ae=(yt[8]-1)/yt[0],gt=(Et[8]+1)/Et[0],lt=Rt*ae,X=Rt*gt,st=xt/(-ae+gt),ot=st*-ae;tt.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(ot),j.translateZ(st),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert();const T=Rt+st,A=bt+st,L=lt-ot,k=X+(xt-ot),$=Dt*bt/A*T,W=G*bt/A*T;j.projectionMatrix.makePerspective(L,k,$,W,T,A),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}function B(j,tt){tt===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(tt.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(i===null)return;y.near=E.near=S.near=j.near,y.far=E.far=S.far=j.far,(b!==y.near||R!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),b=y.near,R=y.far);const tt=j.parent,ft=y.cameras;B(y,tt);for(let xt=0;xt<ft.length;xt++)B(ft[xt],tt);ft.length===2?H(y,S,E):y.projectionMatrix.copy(S.projectionMatrix),q(j,y,tt)};function q(j,tt,ft){ft===null?j.matrix.copy(tt.matrixWorld):(j.matrix.copy(ft.matrixWorld),j.matrix.invert(),j.matrix.multiply(tt.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(tt.projectionMatrix),j.projectionMatrixInverse.copy(tt.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=sr*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&g===null))return c},this.setFoveation=function(j){c=j,d!==null&&(d.fixedFoveation=j),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=j)};let J=null;function Q(j,tt){if(h=tt.getViewerPose(l||a),m=tt,h!==null){const ft=h.views;g!==null&&(t.setRenderTargetFramebuffer(f,g.framebuffer),t.setRenderTarget(f));let xt=!1;ft.length!==y.cameras.length&&(y.cameras.length=0,xt=!0);for(let yt=0;yt<ft.length;yt++){const Et=ft[yt];let Rt=null;if(g!==null)Rt=g.getViewport(Et);else{const Dt=u.getViewSubImage(d,Et);Rt=Dt.viewport,yt===0&&(t.setRenderTargetTextures(f,Dt.colorTexture,d.ignoreDepthValues?void 0:Dt.depthStencilTexture),t.setRenderTarget(f))}let bt=C[yt];bt===void 0&&(bt=new ln,bt.layers.enable(yt),bt.viewport=new Zt,C[yt]=bt),bt.matrix.fromArray(Et.transform.matrix),bt.matrix.decompose(bt.position,bt.quaternion,bt.scale),bt.projectionMatrix.fromArray(Et.projectionMatrix),bt.projectionMatrixInverse.copy(bt.projectionMatrix).invert(),bt.viewport.set(Rt.x,Rt.y,Rt.width,Rt.height),yt===0&&(y.matrix.copy(bt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),xt===!0&&y.cameras.push(bt)}}for(let ft=0;ft<v.length;ft++){const xt=_[ft],yt=v[ft];xt!==null&&yt!==void 0&&yt.update(xt,tt,l||a)}J&&J(j,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),m=null}const ut=new fu;ut.setAnimationLoop(Q),this.setAnimationLoop=function(j){J=j},this.dispose=function(){}}}function Iv(s,t){function e(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,lu(s)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function i(p,f,v,_,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),u(p,f)):f.isMeshPhongMaterial?(r(p,f),h(p,f)):f.isMeshStandardMaterial?(r(p,f),d(p,f),f.isMeshPhysicalMaterial&&g(p,f,M)):f.isMeshMatcapMaterial?(r(p,f),m(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),x(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(a(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?c(p,f,v,_):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,e(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Ye&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,e(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Ye&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,e(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,e(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const v=t.get(f).envMap;if(v&&(p.envMap.value=v,p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;const _=s._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*_,e(f.lightMap,p.lightMapTransform)}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,p.aoMapTransform))}function a(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,v,_){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*v,p.scale.value=_*.5,f.map&&(p.map.value=f.map,e(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,p.roughnessMapTransform)),t.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function g(p,f,v){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ye&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,f){f.matcap&&(p.matcap.value=f.matcap)}function x(p,f){const v=t.get(f).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Uv(s,t,e,n){let i={},r={},a=[];const o=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,_){const M=_.program;n.uniformBlockBinding(v,M)}function l(v,_){let M=i[v.id];M===void 0&&(m(v),M=h(v),i[v.id]=M,v.addEventListener("dispose",p));const w=_.program;n.updateUBOMapping(v,w);const S=t.render.frame;r[v.id]!==S&&(d(v),r[v.id]=S)}function h(v){const _=u();v.__bindingPointIndex=_;const M=s.createBuffer(),w=v.__size,S=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,w,S),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,M),M}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const _=i[v.id],M=v.uniforms,w=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let S=0,E=M.length;S<E;S++){const C=Array.isArray(M[S])?M[S]:[M[S]];for(let y=0,b=C.length;y<b;y++){const R=C[y];if(g(R,S,y,w)===!0){const P=R.__offset,F=Array.isArray(R.value)?R.value:[R.value];let I=0;for(let z=0;z<F.length;z++){const N=F[z],H=x(N);typeof N=="number"||typeof N=="boolean"?(R.__data[0]=N,s.bufferSubData(s.UNIFORM_BUFFER,P+I,R.__data)):N.isMatrix3?(R.__data[0]=N.elements[0],R.__data[1]=N.elements[1],R.__data[2]=N.elements[2],R.__data[3]=0,R.__data[4]=N.elements[3],R.__data[5]=N.elements[4],R.__data[6]=N.elements[5],R.__data[7]=0,R.__data[8]=N.elements[6],R.__data[9]=N.elements[7],R.__data[10]=N.elements[8],R.__data[11]=0):(N.toArray(R.__data,I),I+=H.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,P,R.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function g(v,_,M,w){const S=v.value,E=_+"_"+M;if(w[E]===void 0)return typeof S=="number"||typeof S=="boolean"?w[E]=S:w[E]=S.clone(),!0;{const C=w[E];if(typeof S=="number"||typeof S=="boolean"){if(C!==S)return w[E]=S,!0}else if(C.equals(S)===!1)return C.copy(S),!0}return!1}function m(v){const _=v.uniforms;let M=0;const w=16;for(let E=0,C=_.length;E<C;E++){const y=Array.isArray(_[E])?_[E]:[_[E]];for(let b=0,R=y.length;b<R;b++){const P=y[b],F=Array.isArray(P.value)?P.value:[P.value];for(let I=0,z=F.length;I<z;I++){const N=F[I],H=x(N),B=M%w;B!==0&&w-B<H.boundary&&(M+=w-B),P.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=M,M+=H.storage}}}const S=M%w;return S>0&&(M+=w-S),v.__size=M,v.__cache={},this}function x(v){const _={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(_.boundary=4,_.storage=4):v.isVector2?(_.boundary=8,_.storage=8):v.isVector3||v.isColor?(_.boundary=16,_.storage=12):v.isVector4?(_.boundary=16,_.storage=16):v.isMatrix3?(_.boundary=48,_.storage=48):v.isMatrix4?(_.boundary=64,_.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),_}function p(v){const _=v.target;_.removeEventListener("dispose",p);const M=a.indexOf(_.__bindingPointIndex);a.splice(M,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function f(){for(const v in i)s.deleteBuffer(i[v]);a=[],i={},r={}}return{bind:c,update:l,dispose:f}}class xu{constructor(t={}){const{canvas:e=Ld(),context:n=null,depth:i=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=a;const g=new Uint32Array(4),m=new Int32Array(4);let x=null,p=null;const f=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pe,this._useLegacyLights=!1,this.toneMapping=gi,this.toneMappingExposure=1;const _=this;let M=!1,w=0,S=0,E=null,C=-1,y=null;const b=new Zt,R=new Zt;let P=null;const F=new Nt(0);let I=0,z=e.width,N=e.height,H=1,B=null,q=null;const J=new Zt(0,0,z,N),Q=new Zt(0,0,z,N);let ut=!1;const j=new $i;let tt=!1,ft=!1,xt=null;const yt=new ee,Et=new zt,Rt=new O,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Dt(){return E===null?H:1}let G=n;function ae(D,V){for(let K=0;K<D.length;K++){const Z=D[K],Y=e.getContext(Z,V);if(Y!==null)return Y}return null}try{const D={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Yo}`),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",U,!1),e.addEventListener("webglcontextcreationerror",rt,!1),G===null){const V=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&V.shift(),G=ae(V,D),G===null)throw ae(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&G instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),G.getShaderPrecisionFormat===void 0&&(G.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}let gt,lt,X,st,ot,T,A,L,k,$,W,ht,it,dt,vt,Ct,nt,Jt,Bt,It,Lt,_t,kt,Kt;function jt(){gt=new Wm(G),lt=new km(G,gt,t),gt.init(lt),_t=new Cv(G,gt,lt),X=new Tv(G,gt,lt),st=new qm(G),ot=new dv,T=new Rv(G,gt,X,ot,lt,_t,st),A=new Bm(_),L=new Vm(_),k=new ep(G,lt),kt=new zm(G,gt,k,lt),$=new $m(G,k,st,kt),W=new Zm(G,$,k,st),Bt=new Km(G,lt,T),Ct=new Om(ot),ht=new fv(_,A,L,gt,lt,kt,Ct),it=new Iv(_,ot),dt=new mv,vt=new yv(gt,lt),Jt=new Nm(_,A,L,X,W,d,c),nt=new Av(_,W,lt),Kt=new Uv(G,st,lt,X),It=new Fm(G,gt,st,lt),Lt=new Xm(G,gt,st,lt),st.programs=ht.programs,_.capabilities=lt,_.extensions=gt,_.properties=ot,_.renderLists=dt,_.shadowMap=nt,_.state=X,_.info=st}jt();const Gt=new Dv(_,G);this.xr=Gt,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const D=gt.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=gt.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(D){D!==void 0&&(H=D,this.setSize(z,N,!1))},this.getSize=function(D){return D.set(z,N)},this.setSize=function(D,V,K=!0){if(Gt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=D,N=V,e.width=Math.floor(D*H),e.height=Math.floor(V*H),K===!0&&(e.style.width=D+"px",e.style.height=V+"px"),this.setViewport(0,0,D,V)},this.getDrawingBufferSize=function(D){return D.set(z*H,N*H).floor()},this.setDrawingBufferSize=function(D,V,K){z=D,N=V,H=K,e.width=Math.floor(D*K),e.height=Math.floor(V*K),this.setViewport(0,0,D,V)},this.getCurrentViewport=function(D){return D.copy(b)},this.getViewport=function(D){return D.copy(J)},this.setViewport=function(D,V,K,Z){D.isVector4?J.set(D.x,D.y,D.z,D.w):J.set(D,V,K,Z),X.viewport(b.copy(J).multiplyScalar(H).floor())},this.getScissor=function(D){return D.copy(Q)},this.setScissor=function(D,V,K,Z){D.isVector4?Q.set(D.x,D.y,D.z,D.w):Q.set(D,V,K,Z),X.scissor(R.copy(Q).multiplyScalar(H).floor())},this.getScissorTest=function(){return ut},this.setScissorTest=function(D){X.setScissorTest(ut=D)},this.setOpaqueSort=function(D){B=D},this.setTransparentSort=function(D){q=D},this.getClearColor=function(D){return D.copy(Jt.getClearColor())},this.setClearColor=function(){Jt.setClearColor.apply(Jt,arguments)},this.getClearAlpha=function(){return Jt.getClearAlpha()},this.setClearAlpha=function(){Jt.setClearAlpha.apply(Jt,arguments)},this.clear=function(D=!0,V=!0,K=!0){let Z=0;if(D){let Y=!1;if(E!==null){const wt=E.texture.format;Y=wt===Zh||wt===Kh||wt===jh}if(Y){const wt=E.texture.type,Pt=wt===ge||wt===Qn||wt===Ko||wt===ki||wt===Xh||wt===qh,Ut=Jt.getClearColor(),Ft=Jt.getClearAlpha(),Wt=Ut.r,Ot=Ut.g,Ht=Ut.b;Pt?(g[0]=Wt,g[1]=Ot,g[2]=Ht,g[3]=Ft,G.clearBufferuiv(G.COLOR,0,g)):(m[0]=Wt,m[1]=Ot,m[2]=Ht,m[3]=Ft,G.clearBufferiv(G.COLOR,0,m))}else Z|=G.COLOR_BUFFER_BIT}V&&(Z|=G.DEPTH_BUFFER_BIT),K&&(Z|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",U,!1),e.removeEventListener("webglcontextcreationerror",rt,!1),dt.dispose(),vt.dispose(),ot.dispose(),A.dispose(),L.dispose(),W.dispose(),kt.dispose(),Kt.dispose(),ht.dispose(),Gt.dispose(),Gt.removeEventListener("sessionstart",Ge),Gt.removeEventListener("sessionend",oe),xt&&(xt.dispose(),xt=null),He.stop()};function et(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const D=st.autoReset,V=nt.enabled,K=nt.autoUpdate,Z=nt.needsUpdate,Y=nt.type;jt(),st.autoReset=D,nt.enabled=V,nt.autoUpdate=K,nt.needsUpdate=Z,nt.type=Y}function rt(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function at(D){const V=D.target;V.removeEventListener("dispose",at),St(V)}function St(D){At(D),ot.remove(D)}function At(D){const V=ot.get(D).programs;V!==void 0&&(V.forEach(function(K){ht.releaseProgram(K)}),D.isShaderMaterial&&ht.releaseShaderCache(D))}this.renderBufferDirect=function(D,V,K,Z,Y,wt){V===null&&(V=bt);const Pt=Y.isMesh&&Y.matrixWorld.determinant()<0,Ut=Ku(D,V,K,Z,Y);X.setMaterial(Z,Pt);let Ft=K.index,Wt=1;if(Z.wireframe===!0){if(Ft=$.getWireframeAttribute(K),Ft===void 0)return;Wt=2}const Ot=K.drawRange,Ht=K.attributes.position;let ve=Ot.start*Wt,rn=(Ot.start+Ot.count)*Wt;wt!==null&&(ve=Math.max(ve,wt.start*Wt),rn=Math.min(rn,(wt.start+wt.count)*Wt)),Ft!==null?(ve=Math.max(ve,0),rn=Math.min(rn,Ft.count)):Ht!=null&&(ve=Math.max(ve,0),rn=Math.min(rn,Ht.count));const Re=rn-ve;if(Re<0||Re===1/0)return;kt.setup(Y,Z,Ut,K,Ft);let Vn,ue=It;if(Ft!==null&&(Vn=k.get(Ft),ue=Lt,ue.setIndex(Vn)),Y.isMesh)Z.wireframe===!0?(X.setLineWidth(Z.wireframeLinewidth*Dt()),ue.setMode(G.LINES)):ue.setMode(G.TRIANGLES);else if(Y.isLine){let Xt=Z.linewidth;Xt===void 0&&(Xt=1),X.setLineWidth(Xt*Dt()),Y.isLineSegments?ue.setMode(G.LINES):Y.isLineLoop?ue.setMode(G.LINE_LOOP):ue.setMode(G.LINE_STRIP)}else Y.isPoints?ue.setMode(G.POINTS):Y.isSprite&&ue.setMode(G.TRIANGLES);if(Y.isBatchedMesh)ue.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else if(Y.isInstancedMesh)ue.renderInstances(ve,Re,Y.count);else if(K.isInstancedBufferGeometry){const Xt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Ra=Math.min(K.instanceCount,Xt);ue.renderInstances(ve,Re,Ra)}else ue.render(ve,Re)};function ne(D,V,K){D.transparent===!0&&D.side===An&&D.forceSinglePass===!1?(D.side=Ye,D.needsUpdate=!0,dr(D,V,K),D.side=ri,D.needsUpdate=!0,dr(D,V,K),D.side=An):dr(D,V,K)}this.compile=function(D,V,K=null){K===null&&(K=D),p=vt.get(K),p.init(),v.push(p),K.traverseVisible(function(Y){Y.isLight&&Y.layers.test(V.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),D!==K&&D.traverseVisible(function(Y){Y.isLight&&Y.layers.test(V.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights(_._useLegacyLights);const Z=new Set;return D.traverse(function(Y){const wt=Y.material;if(wt)if(Array.isArray(wt))for(let Pt=0;Pt<wt.length;Pt++){const Ut=wt[Pt];ne(Ut,K,Y),Z.add(Ut)}else ne(wt,K,Y),Z.add(wt)}),v.pop(),p=null,Z},this.compileAsync=function(D,V,K=null){const Z=this.compile(D,V,K);return new Promise(Y=>{function wt(){if(Z.forEach(function(Pt){ot.get(Pt).currentProgram.isReady()&&Z.delete(Pt)}),Z.size===0){Y(D);return}setTimeout(wt,10)}gt.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let Qt=null;function xe(D){Qt&&Qt(D)}function Ge(){He.stop()}function oe(){He.start()}const He=new fu;He.setAnimationLoop(xe),typeof self<"u"&&He.setContext(self),this.setAnimationLoop=function(D){Qt=D,Gt.setAnimationLoop(D),D===null?He.stop():He.start()},Gt.addEventListener("sessionstart",Ge),Gt.addEventListener("sessionend",oe),this.render=function(D,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),Gt.enabled===!0&&Gt.isPresenting===!0&&(Gt.cameraAutoUpdate===!0&&Gt.updateCamera(V),V=Gt.getCamera()),D.isScene===!0&&D.onBeforeRender(_,D,V,E),p=vt.get(D,v.length),p.init(),v.push(p),yt.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),j.setFromProjectionMatrix(yt),ft=this.localClippingEnabled,tt=Ct.init(this.clippingPlanes,ft),x=dt.get(D,f.length),x.init(),f.push(x),Ln(D,V,0,_.sortObjects),x.finish(),_.sortObjects===!0&&x.sort(B,q),this.info.render.frame++,tt===!0&&Ct.beginShadows();const K=p.state.shadowsArray;if(nt.render(K,D,V),tt===!0&&Ct.endShadows(),this.info.autoReset===!0&&this.info.reset(),Jt.render(x,D),p.setupLights(_._useLegacyLights),V.isArrayCamera){const Z=V.cameras;for(let Y=0,wt=Z.length;Y<wt;Y++){const Pt=Z[Y];fc(x,D,Pt,Pt.viewport)}}else fc(x,D,V);E!==null&&(T.updateMultisampleRenderTarget(E),T.updateRenderTargetMipmap(E)),D.isScene===!0&&D.onAfterRender(_,D,V),kt.resetDefaultState(),C=-1,y=null,v.pop(),v.length>0?p=v[v.length-1]:p=null,f.pop(),f.length>0?x=f[f.length-1]:x=null};function Ln(D,V,K,Z){if(D.visible===!1)return;if(D.layers.test(V.layers)){if(D.isGroup)K=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(V);else if(D.isLight)p.pushLight(D),D.castShadow&&p.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||j.intersectsSprite(D)){Z&&Rt.setFromMatrixPosition(D.matrixWorld).applyMatrix4(yt);const Pt=W.update(D),Ut=D.material;Ut.visible&&x.push(D,Pt,Ut,K,Rt.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||j.intersectsObject(D))){const Pt=W.update(D),Ut=D.material;if(Z&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),Rt.copy(D.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),Rt.copy(Pt.boundingSphere.center)),Rt.applyMatrix4(D.matrixWorld).applyMatrix4(yt)),Array.isArray(Ut)){const Ft=Pt.groups;for(let Wt=0,Ot=Ft.length;Wt<Ot;Wt++){const Ht=Ft[Wt],ve=Ut[Ht.materialIndex];ve&&ve.visible&&x.push(D,Pt,ve,K,Rt.z,Ht)}}else Ut.visible&&x.push(D,Pt,Ut,K,Rt.z,null)}}const wt=D.children;for(let Pt=0,Ut=wt.length;Pt<Ut;Pt++)Ln(wt[Pt],V,K,Z)}function fc(D,V,K,Z){const Y=D.opaque,wt=D.transmissive,Pt=D.transparent;p.setupLightsView(K),tt===!0&&Ct.setGlobalState(_.clippingPlanes,K),wt.length>0&&Yu(Y,wt,V,K),Z&&X.viewport(b.copy(Z)),Y.length>0&&fr(Y,V,K),wt.length>0&&fr(wt,V,K),Pt.length>0&&fr(Pt,V,K),X.buffers.depth.setTest(!0),X.buffers.depth.setMask(!0),X.buffers.color.setMask(!0),X.setPolygonOffset(!1)}function Yu(D,V,K,Z){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;const wt=lt.isWebGL2;xt===null&&(xt=new Gn(1,1,{generateMipmaps:!0,type:gt.has("EXT_color_buffer_half_float")?xi:ge,minFilter:Gi,samples:wt?4:0})),_.getDrawingBufferSize(Et),wt?xt.setSize(Et.x,Et.y):xt.setSize(ha(Et.x),ha(Et.y));const Pt=_.getRenderTarget();_.setRenderTarget(xt),_.getClearColor(F),I=_.getClearAlpha(),I<1&&_.setClearColor(16777215,.5),_.clear();const Ut=_.toneMapping;_.toneMapping=gi,fr(D,K,Z),T.updateMultisampleRenderTarget(xt),T.updateRenderTargetMipmap(xt);let Ft=!1;for(let Wt=0,Ot=V.length;Wt<Ot;Wt++){const Ht=V[Wt],ve=Ht.object,rn=Ht.geometry,Re=Ht.material,Vn=Ht.group;if(Re.side===An&&ve.layers.test(Z.layers)){const ue=Re.side;Re.side=Ye,Re.needsUpdate=!0,dc(ve,K,Z,rn,Re,Vn),Re.side=ue,Re.needsUpdate=!0,Ft=!0}}Ft===!0&&(T.updateMultisampleRenderTarget(xt),T.updateRenderTargetMipmap(xt)),_.setRenderTarget(Pt),_.setClearColor(F,I),_.toneMapping=Ut}function fr(D,V,K){const Z=V.isScene===!0?V.overrideMaterial:null;for(let Y=0,wt=D.length;Y<wt;Y++){const Pt=D[Y],Ut=Pt.object,Ft=Pt.geometry,Wt=Z===null?Pt.material:Z,Ot=Pt.group;Ut.layers.test(K.layers)&&dc(Ut,V,K,Ft,Wt,Ot)}}function dc(D,V,K,Z,Y,wt){D.onBeforeRender(_,V,K,Z,Y,wt),D.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),Y.onBeforeRender(_,V,K,Z,D,wt),Y.transparent===!0&&Y.side===An&&Y.forceSinglePass===!1?(Y.side=Ye,Y.needsUpdate=!0,_.renderBufferDirect(K,V,Z,Y,D,wt),Y.side=ri,Y.needsUpdate=!0,_.renderBufferDirect(K,V,Z,Y,D,wt),Y.side=An):_.renderBufferDirect(K,V,Z,Y,D,wt),D.onAfterRender(_,V,K,Z,Y,wt)}function dr(D,V,K){V.isScene!==!0&&(V=bt);const Z=ot.get(D),Y=p.state.lights,wt=p.state.shadowsArray,Pt=Y.state.version,Ut=ht.getParameters(D,Y.state,wt,V,K),Ft=ht.getProgramCacheKey(Ut);let Wt=Z.programs;Z.environment=D.isMeshStandardMaterial?V.environment:null,Z.fog=V.fog,Z.envMap=(D.isMeshStandardMaterial?L:A).get(D.envMap||Z.environment),Wt===void 0&&(D.addEventListener("dispose",at),Wt=new Map,Z.programs=Wt);let Ot=Wt.get(Ft);if(Ot!==void 0){if(Z.currentProgram===Ot&&Z.lightsStateVersion===Pt)return mc(D,Ut),Ot}else Ut.uniforms=ht.getUniforms(D),D.onBuild(K,Ut,_),D.onBeforeCompile(Ut,_),Ot=ht.acquireProgram(Ut,Ft),Wt.set(Ft,Ot),Z.uniforms=Ut.uniforms;const Ht=Z.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(Ht.clippingPlanes=Ct.uniform),mc(D,Ut),Z.needsLights=Ju(D),Z.lightsStateVersion=Pt,Z.needsLights&&(Ht.ambientLightColor.value=Y.state.ambient,Ht.lightProbe.value=Y.state.probe,Ht.directionalLights.value=Y.state.directional,Ht.directionalLightShadows.value=Y.state.directionalShadow,Ht.spotLights.value=Y.state.spot,Ht.spotLightShadows.value=Y.state.spotShadow,Ht.rectAreaLights.value=Y.state.rectArea,Ht.ltc_1.value=Y.state.rectAreaLTC1,Ht.ltc_2.value=Y.state.rectAreaLTC2,Ht.pointLights.value=Y.state.point,Ht.pointLightShadows.value=Y.state.pointShadow,Ht.hemisphereLights.value=Y.state.hemi,Ht.directionalShadowMap.value=Y.state.directionalShadowMap,Ht.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Ht.spotShadowMap.value=Y.state.spotShadowMap,Ht.spotLightMatrix.value=Y.state.spotLightMatrix,Ht.spotLightMap.value=Y.state.spotLightMap,Ht.pointShadowMap.value=Y.state.pointShadowMap,Ht.pointShadowMatrix.value=Y.state.pointShadowMatrix),Z.currentProgram=Ot,Z.uniformsList=null,Ot}function pc(D){if(D.uniformsList===null){const V=D.currentProgram.getUniforms();D.uniformsList=ea.seqWithValue(V.seq,D.uniforms)}return D.uniformsList}function mc(D,V){const K=ot.get(D);K.outputColorSpace=V.outputColorSpace,K.batching=V.batching,K.instancing=V.instancing,K.instancingColor=V.instancingColor,K.skinning=V.skinning,K.morphTargets=V.morphTargets,K.morphNormals=V.morphNormals,K.morphColors=V.morphColors,K.morphTargetsCount=V.morphTargetsCount,K.numClippingPlanes=V.numClippingPlanes,K.numIntersection=V.numClipIntersection,K.vertexAlphas=V.vertexAlphas,K.vertexTangents=V.vertexTangents,K.toneMapping=V.toneMapping}function Ku(D,V,K,Z,Y){V.isScene!==!0&&(V=bt),T.resetTextureUnits();const wt=V.fog,Pt=Z.isMeshStandardMaterial?V.environment:null,Ut=E===null?_.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:ai,Ft=(Z.isMeshStandardMaterial?L:A).get(Z.envMap||Pt),Wt=Z.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,Ot=!!K.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Ht=!!K.morphAttributes.position,ve=!!K.morphAttributes.normal,rn=!!K.morphAttributes.color;let Re=gi;Z.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Re=_.toneMapping);const Vn=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,ue=Vn!==void 0?Vn.length:0,Xt=ot.get(Z),Ra=p.state.lights;if(tt===!0&&(ft===!0||D!==y)){const dn=D===y&&Z.id===C;Ct.setState(Z,D,dn)}let de=!1;Z.version===Xt.__version?(Xt.needsLights&&Xt.lightsStateVersion!==Ra.state.version||Xt.outputColorSpace!==Ut||Y.isBatchedMesh&&Xt.batching===!1||!Y.isBatchedMesh&&Xt.batching===!0||Y.isInstancedMesh&&Xt.instancing===!1||!Y.isInstancedMesh&&Xt.instancing===!0||Y.isSkinnedMesh&&Xt.skinning===!1||!Y.isSkinnedMesh&&Xt.skinning===!0||Y.isInstancedMesh&&Xt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Xt.instancingColor===!1&&Y.instanceColor!==null||Xt.envMap!==Ft||Z.fog===!0&&Xt.fog!==wt||Xt.numClippingPlanes!==void 0&&(Xt.numClippingPlanes!==Ct.numPlanes||Xt.numIntersection!==Ct.numIntersection)||Xt.vertexAlphas!==Wt||Xt.vertexTangents!==Ot||Xt.morphTargets!==Ht||Xt.morphNormals!==ve||Xt.morphColors!==rn||Xt.toneMapping!==Re||lt.isWebGL2===!0&&Xt.morphTargetsCount!==ue)&&(de=!0):(de=!0,Xt.__version=Z.version);let yi=Xt.currentProgram;de===!0&&(yi=dr(Z,V,Y));let gc=!1,Ps=!1,Ca=!1;const Ue=yi.getUniforms(),wi=Xt.uniforms;if(X.useProgram(yi.program)&&(gc=!0,Ps=!0,Ca=!0),Z.id!==C&&(C=Z.id,Ps=!0),gc||y!==D){Ue.setValue(G,"projectionMatrix",D.projectionMatrix),Ue.setValue(G,"viewMatrix",D.matrixWorldInverse);const dn=Ue.map.cameraPosition;dn!==void 0&&dn.setValue(G,Rt.setFromMatrixPosition(D.matrixWorld)),lt.logarithmicDepthBuffer&&Ue.setValue(G,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&Ue.setValue(G,"isOrthographic",D.isOrthographicCamera===!0),y!==D&&(y=D,Ps=!0,Ca=!0)}if(Y.isSkinnedMesh){Ue.setOptional(G,Y,"bindMatrix"),Ue.setOptional(G,Y,"bindMatrixInverse");const dn=Y.skeleton;dn&&(lt.floatVertexTextures?(dn.boneTexture===null&&dn.computeBoneTexture(),Ue.setValue(G,"boneTexture",dn.boneTexture,T)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Y.isBatchedMesh&&(Ue.setOptional(G,Y,"batchingTexture"),Ue.setValue(G,"batchingTexture",Y._matricesTexture,T));const La=K.morphAttributes;if((La.position!==void 0||La.normal!==void 0||La.color!==void 0&&lt.isWebGL2===!0)&&Bt.update(Y,K,yi),(Ps||Xt.receiveShadow!==Y.receiveShadow)&&(Xt.receiveShadow=Y.receiveShadow,Ue.setValue(G,"receiveShadow",Y.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(wi.envMap.value=Ft,wi.flipEnvMap.value=Ft.isCubeTexture&&Ft.isRenderTargetTexture===!1?-1:1),Ps&&(Ue.setValue(G,"toneMappingExposure",_.toneMappingExposure),Xt.needsLights&&Zu(wi,Ca),wt&&Z.fog===!0&&it.refreshFogUniforms(wi,wt),it.refreshMaterialUniforms(wi,Z,H,N,xt),ea.upload(G,pc(Xt),wi,T)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(ea.upload(G,pc(Xt),wi,T),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&Ue.setValue(G,"center",Y.center),Ue.setValue(G,"modelViewMatrix",Y.modelViewMatrix),Ue.setValue(G,"normalMatrix",Y.normalMatrix),Ue.setValue(G,"modelMatrix",Y.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const dn=Z.uniformsGroups;for(let Pa=0,Qu=dn.length;Pa<Qu;Pa++)if(lt.isWebGL2){const vc=dn[Pa];Kt.update(vc,yi),Kt.bind(vc,yi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return yi}function Zu(D,V){D.ambientLightColor.needsUpdate=V,D.lightProbe.needsUpdate=V,D.directionalLights.needsUpdate=V,D.directionalLightShadows.needsUpdate=V,D.pointLights.needsUpdate=V,D.pointLightShadows.needsUpdate=V,D.spotLights.needsUpdate=V,D.spotLightShadows.needsUpdate=V,D.rectAreaLights.needsUpdate=V,D.hemisphereLights.needsUpdate=V}function Ju(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(D,V,K){ot.get(D.texture).__webglTexture=V,ot.get(D.depthTexture).__webglTexture=K;const Z=ot.get(D);Z.__hasExternalTextures=!0,Z.__hasExternalTextures&&(Z.__autoAllocateDepthBuffer=K===void 0,Z.__autoAllocateDepthBuffer||gt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Z.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(D,V){const K=ot.get(D);K.__webglFramebuffer=V,K.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(D,V=0,K=0){E=D,w=V,S=K;let Z=!0,Y=null,wt=!1,Pt=!1;if(D){const Ft=ot.get(D);Ft.__useDefaultFramebuffer!==void 0?(X.bindFramebuffer(G.FRAMEBUFFER,null),Z=!1):Ft.__webglFramebuffer===void 0?T.setupRenderTarget(D):Ft.__hasExternalTextures&&T.rebindTextures(D,ot.get(D.texture).__webglTexture,ot.get(D.depthTexture).__webglTexture);const Wt=D.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(Pt=!0);const Ot=ot.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(Ot[V])?Y=Ot[V][K]:Y=Ot[V],wt=!0):lt.isWebGL2&&D.samples>0&&T.useMultisampledRTT(D)===!1?Y=ot.get(D).__webglMultisampledFramebuffer:Array.isArray(Ot)?Y=Ot[K]:Y=Ot,b.copy(D.viewport),R.copy(D.scissor),P=D.scissorTest}else b.copy(J).multiplyScalar(H).floor(),R.copy(Q).multiplyScalar(H).floor(),P=ut;if(X.bindFramebuffer(G.FRAMEBUFFER,Y)&&lt.drawBuffers&&Z&&X.drawBuffers(D,Y),X.viewport(b),X.scissor(R),X.setScissorTest(P),wt){const Ft=ot.get(D.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+V,Ft.__webglTexture,K)}else if(Pt){const Ft=ot.get(D.texture),Wt=V||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ft.__webglTexture,K||0,Wt)}C=-1},this.readRenderTargetPixels=function(D,V,K,Z,Y,wt,Pt){if(!(D&&D.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ut=ot.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Pt!==void 0&&(Ut=Ut[Pt]),Ut){X.bindFramebuffer(G.FRAMEBUFFER,Ut);try{const Ft=D.texture,Wt=Ft.format,Ot=Ft.type;if(Wt!==Se&&_t.convert(Wt)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ht=Ot===xi&&(gt.has("EXT_color_buffer_half_float")||lt.isWebGL2&&gt.has("EXT_color_buffer_float"));if(Ot!==ge&&_t.convert(Ot)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ot===ti&&(lt.isWebGL2||gt.has("OES_texture_float")||gt.has("WEBGL_color_buffer_float")))&&!Ht){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=D.width-Z&&K>=0&&K<=D.height-Y&&G.readPixels(V,K,Z,Y,_t.convert(Wt),_t.convert(Ot),wt)}finally{const Ft=E!==null?ot.get(E).__webglFramebuffer:null;X.bindFramebuffer(G.FRAMEBUFFER,Ft)}}},this.copyFramebufferToTexture=function(D,V,K=0){const Z=Math.pow(2,-K),Y=Math.floor(V.image.width*Z),wt=Math.floor(V.image.height*Z);T.setTexture2D(V,0),G.copyTexSubImage2D(G.TEXTURE_2D,K,0,0,D.x,D.y,Y,wt),X.unbindTexture()},this.copyTextureToTexture=function(D,V,K,Z=0){const Y=V.image.width,wt=V.image.height,Pt=_t.convert(K.format),Ut=_t.convert(K.type);T.setTexture2D(K,0),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,K.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,K.unpackAlignment),V.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,Z,D.x,D.y,Y,wt,Pt,Ut,V.image.data):V.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,Z,D.x,D.y,V.mipmaps[0].width,V.mipmaps[0].height,Pt,V.mipmaps[0].data):G.texSubImage2D(G.TEXTURE_2D,Z,D.x,D.y,Pt,Ut,V.image),Z===0&&K.generateMipmaps&&G.generateMipmap(G.TEXTURE_2D),X.unbindTexture()},this.copyTextureToTexture3D=function(D,V,K,Z,Y=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const wt=D.max.x-D.min.x+1,Pt=D.max.y-D.min.y+1,Ut=D.max.z-D.min.z+1,Ft=_t.convert(Z.format),Wt=_t.convert(Z.type);let Ot;if(Z.isData3DTexture)T.setTexture3D(Z,0),Ot=G.TEXTURE_3D;else if(Z.isDataArrayTexture||Z.isCompressedArrayTexture)T.setTexture2DArray(Z,0),Ot=G.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,Z.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,Z.unpackAlignment);const Ht=G.getParameter(G.UNPACK_ROW_LENGTH),ve=G.getParameter(G.UNPACK_IMAGE_HEIGHT),rn=G.getParameter(G.UNPACK_SKIP_PIXELS),Re=G.getParameter(G.UNPACK_SKIP_ROWS),Vn=G.getParameter(G.UNPACK_SKIP_IMAGES),ue=K.isCompressedTexture?K.mipmaps[Y]:K.image;G.pixelStorei(G.UNPACK_ROW_LENGTH,ue.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ue.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,D.min.x),G.pixelStorei(G.UNPACK_SKIP_ROWS,D.min.y),G.pixelStorei(G.UNPACK_SKIP_IMAGES,D.min.z),K.isDataTexture||K.isData3DTexture?G.texSubImage3D(Ot,Y,V.x,V.y,V.z,wt,Pt,Ut,Ft,Wt,ue.data):K.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),G.compressedTexSubImage3D(Ot,Y,V.x,V.y,V.z,wt,Pt,Ut,Ft,ue.data)):G.texSubImage3D(Ot,Y,V.x,V.y,V.z,wt,Pt,Ut,Ft,Wt,ue),G.pixelStorei(G.UNPACK_ROW_LENGTH,Ht),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ve),G.pixelStorei(G.UNPACK_SKIP_PIXELS,rn),G.pixelStorei(G.UNPACK_SKIP_ROWS,Re),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Vn),Y===0&&Z.generateMipmaps&&G.generateMipmap(Ot),X.unbindTexture()},this.initTexture=function(D){D.isCubeTexture?T.setTextureCube(D,0):D.isData3DTexture?T.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?T.setTexture2DArray(D,0):T.setTexture2D(D,0),X.unbindTexture()},this.resetState=function(){w=0,S=0,E=null,X.reset(),kt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Zo?"display-p3":"srgb",e.unpackColorSpace=se.workingColorSpace===Ma?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Pe?Bi:Qh}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Bi?Pe:ai}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Nv extends xu{}Nv.prototype.isWebGL1Renderer=!0;class Sa extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class sn extends en{constructor(t=null,e=1,n=1,i,r,a,o,c,l=re,h=re,u,d){super(null,a,o,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ke extends Ee{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ls=new ee,Bl=new ee,Fr=[],Gl=new _n,zv=new ee,zs=new me,Fs=new Mi;class _u extends me{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ke(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,zv)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new _n),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ls),Gl.copy(t.boundingBox).applyMatrix4(ls),this.boundingBox.union(Gl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Mi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ls),Fs.copy(t.boundingSphere).applyMatrix4(ls),this.boundingSphere.union(Fs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(zs.geometry=this.geometry,zs.material=this.material,zs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Fs.copy(this.boundingSphere),Fs.applyMatrix4(n),t.ray.intersectsSphere(Fs)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ls),Bl.multiplyMatrices(n,ls),zs.matrixWorld=Bl,zs.raycast(t,Fr);for(let a=0,o=Fr.length;a<o;a++){const c=Fr[a];c.instanceId=r,c.object=this,e.push(c)}Fr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ke(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Fv extends rr{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Nt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Hl=new ee,Fo=new Qo,kr=new Mi,Or=new O;class kv extends nn{constructor(t=new Ze,e=new Fv){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),kr.copy(n.boundingSphere),kr.applyMatrix4(i),kr.radius+=r,t.ray.intersectsSphere(kr)===!1)return;Hl.copy(i).invert(),Fo.copy(t.ray).applyMatrix4(Hl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),g=Math.min(l.count,a.start+a.count);for(let m=d,x=g;m<x;m++){const p=l.getX(m);Or.fromBufferAttribute(u,p),Vl(Or,p,c,i,t,e,this)}}else{const d=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let m=d,x=g;m<x;m++)Or.fromBufferAttribute(u,m),Vl(Or,m,c,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Vl(s,t,e,n,i,r,a){const o=Fo.distanceSqToPoint(s);if(o<e){const c=new O;Fo.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,object:a})}}class sc extends Ze{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],a=[];o(i),l(n),h(),this.setAttribute("position",new ye(r,3)),this.setAttribute("normal",new ye(r.slice(),3)),this.setAttribute("uv",new ye(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const _=new O,M=new O,w=new O;for(let S=0;S<e.length;S+=3)g(e[S+0],_),g(e[S+1],M),g(e[S+2],w),c(_,M,w,v)}function c(v,_,M,w){const S=w+1,E=[];for(let C=0;C<=S;C++){E[C]=[];const y=v.clone().lerp(M,C/S),b=_.clone().lerp(M,C/S),R=S-C;for(let P=0;P<=R;P++)P===0&&C===S?E[C][P]=y:E[C][P]=y.clone().lerp(b,P/R)}for(let C=0;C<S;C++)for(let y=0;y<2*(S-C)-1;y++){const b=Math.floor(y/2);y%2===0?(d(E[C][b+1]),d(E[C+1][b]),d(E[C][b])):(d(E[C][b+1]),d(E[C+1][b+1]),d(E[C+1][b]))}}function l(v){const _=new O;for(let M=0;M<r.length;M+=3)_.x=r[M+0],_.y=r[M+1],_.z=r[M+2],_.normalize().multiplyScalar(v),r[M+0]=_.x,r[M+1]=_.y,r[M+2]=_.z}function h(){const v=new O;for(let _=0;_<r.length;_+=3){v.x=r[_+0],v.y=r[_+1],v.z=r[_+2];const M=p(v)/2/Math.PI+.5,w=f(v)/Math.PI+.5;a.push(M,1-w)}m(),u()}function u(){for(let v=0;v<a.length;v+=6){const _=a[v+0],M=a[v+2],w=a[v+4],S=Math.max(_,M,w),E=Math.min(_,M,w);S>.9&&E<.1&&(_<.2&&(a[v+0]+=1),M<.2&&(a[v+2]+=1),w<.2&&(a[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function g(v,_){const M=v*3;_.x=t[M+0],_.y=t[M+1],_.z=t[M+2]}function m(){const v=new O,_=new O,M=new O,w=new O,S=new zt,E=new zt,C=new zt;for(let y=0,b=0;y<r.length;y+=9,b+=6){v.set(r[y+0],r[y+1],r[y+2]),_.set(r[y+3],r[y+4],r[y+5]),M.set(r[y+6],r[y+7],r[y+8]),S.set(a[b+0],a[b+1]),E.set(a[b+2],a[b+3]),C.set(a[b+4],a[b+5]),w.copy(v).add(_).add(M).divideScalar(3);const R=p(w);x(S,b+0,v,R),x(E,b+2,_,R),x(C,b+4,M,R)}}function x(v,_,M,w){w<0&&v.x===1&&(a[_]=v.x-1),M.x===0&&M.z===0&&(a[_]=w/2/Math.PI+.5)}function p(v){return Math.atan2(v.z,-v.x)}function f(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sc(t.vertices,t.indices,t.radius,t.details)}}class rc extends sc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new rc(t.radius,t.detail)}}class or extends Ze{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Ov{constructor(t,e,n=0,i=1/0){this.ray=new Qo(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new tc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ko(t,this,n,e),n.sort(Wl),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)ko(t[i],this,n,e);return n.sort(Wl),n}}function Wl(s,t){return s.distance-t.distance}function ko(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let r=0,a=i.length;r<a;r++)ko(i[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yo);const ks=s=>Number.isInteger(s)?s.toFixed(1):String(s),zn={loi:1,pond:24,other:48,max:63},Bv=.5,Mu=-.6,Gv=.5625,Ie=`
#define PI 3.14159265
#define NEAR_E ${ks(ir)}
#define NORMAL_E ${ks(zh)}
#define SLOTS ${Un}
#define PATCHES ${_s}
#define DIST_PATCHES ${Fn}
#define DIST_POND ${zn.pond}
#define DIST_OTHER ${zn.other}
#define DIST_FILL ${ks(Bv)}
#define DIST_POND_LEVEL ${ks(Mu)}
#define DIST_BASE ${ks(Gv)}
`,cr=`
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
`,Je=`
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
`,ac=`
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
`,$l=Array.from({length:Un},(s,t)=>t),Xi=`
${ac}
${$l.map(s=>`uniform sampler2D uSlotH${s};`).join(`
`)}
float slotMetres(int s, vec2 xz) {
  // (samplers can only be picked by a constant index; the patches are laid
  // on whichever it was once, so the loop is compiled once, not per slot)
  float h = -4000.0;
${$l.map(s=>`  ${s?"else ":""}if (s == ${s}) h = rectMetres(uSlotH${s}, uSlotRect[${s}], xz);`).join(`
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
`,Ls=`
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
`,Hv=`
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
`,Vv=`
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
`,yu=`
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
`,wu=`
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
`,Wv=`
${Ie}
${Je}
${ac}
${yu}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[12];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out float vMetres;

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
  vMetres = mt;
  // The sea is drawn from the heights; the seabed under it only needs to show
  // in the last few centimetres at the shoreline. Sink it below that so the
  // two surfaces never fight over depth.
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,$v=`
${Ie}
${cr}
${Je}
${ac}
${yu}
${Ls}
${Hv}
${Vv}
${wu}
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
in float vMetres;

void main() {
  vec2 xz = vWorld.xz;
  if (ownerAt(xz) != uSelf) discard;
  if (edgeDist(uArchRect, xz) < 0.0) discard;
  // (where the district is down, its own mesh draws the ground)
  if (distDraws(xz)) discard;
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
  float metres = vMetres;

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
`,Xv=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function oc(){const s=new Ze;return s.setAttribute("position",new Ee(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const qv=`
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
`;class jv{constructor(t){this.renderer=t,this.size=new zt;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?xi:ge,this.sceneRT=new Gn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new ic(1,1,Qn),this.quad=new me(oc(),new we({vertexShader:Xv,fragmentShader:qv,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new zt},uInvProj:{value:new ee},uCamWorld:{value:new ee},uCamPos:{value:new O},uSunDir:{value:new O(0,1,0)},uSunColor:{value:new Nt},uFogColor:{value:new Nt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Sa,this.quadScene.add(this.quad),this.quadCam=new wa(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const Yv=`
${Ie}
${Je}
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
`;class Kv{constructor(t,e=1024,n=Yv){const{W:i,H:r}=t,a=Math.min(1,e/Math.max(i,r)),o=Math.max(16,Math.round(i*a)),c=Math.max(16,Math.round(r*a));this.terrain=t,this.rt=new Gn(o,c,{type:ge,format:Vi,depthBuffer:!1,minFilter:De,magFilter:De});const l=t.pack.rect;this.uniforms={...t.uniforms,uSunDir:{value:new O(0,1,0)},uStep:{value:Math.max((l.x1-l.x0)/o,(l.z1-l.z0)/c)},uTop:{value:1}},this.material=new we({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:n,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new Sa;const h=new me(oc(),this.material);h.frustumCulled=!1,this.scene.add(h),this.cam=new wa(-1,1,1,-1,0,1),this.h=c,this.strips=4,this.strip=-1,this.drawn={sun:new O(0,-2,0),vert:-1,k:-1}}get texture(){return this.rt.texture}update(t,e,n,i,r){const a=this.uniforms,o=this.drawn;if(this.strip<0){if(!(e.angleTo(o.sun)>.004||Math.abs(n-o.vert)>o.vert*.015||Math.abs(i-o.k)>.03))return;if(a.uSunDir.value.copy(e),a.uTop.value=r,o.sun.copy(e),o.vert=n,o.k=i,!this.ever)return this.ever=!0,this.draw(t,-1);this.strip=0}this.draw(t,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e){const n=this.rt;if(e>=0){const r=Math.ceil(this.h/this.strips);n.scissor.set(0,e*r,n.width,r),n.scissorTest=!0}else n.scissorTest=!1;const i=t.getRenderTarget();t.setRenderTarget(n),t.render(this.scene,this.cam),t.setRenderTarget(i),n.scissorTest=!1}dispose(){this.rt.dispose(),this.material.dispose()}}const co=32,Xl=1600,ql=-.5;function bu(s,t,e){const n=new sn(s,t,e,Vi,ti);return n.minFilter=re,n.magFilter=re,n.wrapS=n.wrapT=qe,n.needsUpdate=!0,n}function jl(s,t,e,n=1){const i=new sn(s,t,e,Se,ge);return i.minFilter=Gi,i.magFilter=De,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=qe,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class Oo{constructor(t,e,n=null,i={}){this.pack=t,this.world=e;const r=t.data,{W:a,H:o}=t,{x0:c,z0:l,x1:h,z1:u}=t.rect;this.rect=new Zt(c,l,h,u),this.heights=r.metres,this.W=a,this.H=o;const d=e.app.renderer.capabilities.getMaxAnisotropy();this.heightTex=bu(r.metres,a,o),this.normalTex=jl(r.normals,a,o,Math.min(8,d)),this.landTex=jl(r.land,a,o,Math.min(4,d)),r.normals=null,r.land=null;const g=Math.max((h-c)/a,(u-l)/o);this.texel=g;const m=Math.max(h-c,u-l);this.levels=Math.max(1,Math.ceil(Math.log2(m/(co*g)))+1),this.leafSize=m/2**(this.levels-1),this.buildMinMax(Array.isArray(n)?n:n?[n]:[]),this.full=this.makeGrid(co),this.half=this.makeGrid(co/2),this.morph=[];for(let f=0;f<12;f++)this.morph.push(new zt);const x=e.uniforms,p=(Array.isArray(n)?null:n)||e.arch||this;this.uniforms={...x,uOwnH:{value:this.heightTex},uOwnRect:{value:this.rect},uOwnN:{value:this.normalTex},uOwnL:{value:this.landTex},uArchN:{value:p.normalTex},uArchL:{value:p.landTex},uOwnS:{value:null},uOwnLandA:{value:null},uOwnLandB:{value:null},uSelf:{value:-1},uOwnRain:{value:n&&!t.rainUrl?0:1},uMorph:{value:this.morph},uCamPos:{value:new O},uKau:{value:.5},uDebug:{value:0},...i.uniforms},this.group=new je;for(const f of[this.full,this.half])f.material=new we({vertexShader:i.vertexShader||Wv,fragmentShader:i.fragmentShader||$v,uniforms:{...this.uniforms,uGrid:{value:f.dim}}}),f.mesh=new me(f.geometry,f.material),f.mesh.frustumCulled=!1,f.mesh.matrixAutoUpdate=!1,this.group.add(f.mesh);this.shadow=new Kv(this,i.shadowSize,i.shadowFragment),this.uniforms.uOwnS.value=this.shadow.texture,this._frustum=new $i,this._m=new ee,this._box=new _n,this.rangeK=3.5,this.applyRange(this.rangeK)}makeGrid(t){const e=new or,n=new Float32Array((t+1)*(t+1)*3);for(let o=0;o<=t;o++)for(let c=0;c<=t;c++){const l=(o*(t+1)+c)*3;n[l]=c/t,n[l+2]=o/t}const i=[];for(let o=0;o<t;o++)for(let c=0;c<t;c++){const l=o*(t+1)+c,h=l+1,u=l+t+1,d=u+1;c+o&1?i.push(l,u,h,h,u,d):i.push(l,u,d,l,d,h)}e.setIndex(i),e.setAttribute("position",new Ee(n,3));const r=new Float32Array(Xl*4),a=new Ke(r,4);return a.setUsage(ei),e.setAttribute("aNode",a),e.instanceCount=0,{dim:t,geometry:e,data:r,attr:a,count:0}}buildMinMax(t){const{W:e,H:n,heights:i}=this,r=this.pack.rect,a=2**(this.levels-1),o=this.leafSize,c=e/(r.x1-r.x0),l=n/(r.z1-r.z0);let h=new Float32Array(a*a).fill(1/0),u=new Float32Array(a*a).fill(-1/0);for(let g=0;g<a;g++){const m=g*o;if(m>=r.z1-r.z0)continue;const x=Math.max(0,Math.floor(m*l)-1),p=Math.min(n-1,Math.ceil((m+o)*l)+1);for(let f=0;f<a;f++){const v=f*o;if(v>=r.x1-r.x0)continue;const _=Math.max(0,Math.floor(v*c)-1),M=Math.min(e-1,Math.ceil((v+o)*c)+1);let w=1/0,S=-1/0;for(let E=x;E<=p;E++)for(let C=_;C<=M;C++){const y=i[E*e+C];y<w&&(w=y),y>S&&(S=y)}if(t.length){const E=Math.max(2,Math.round((p-x)/16));for(const C of t)for(let y=x;y<=p;y+=E)for(let b=_;b<=M;b+=E){const R=C.metresAt(r.x0+(b+.5)/c,r.z0+(y+.5)/l);R<w&&(w=R),R>S&&(S=R)}w-=40,S+=40}h[g*a+f]=w,u[g*a+f]=S}}this.mm=[{lo:h,hi:u,n:a}];let d=a;for(;d>1;){const g=d/2,m=new Float32Array(g*g),x=new Float32Array(g*g);for(let p=0;p<g;p++)for(let f=0;f<g;f++){const v=2*p*d+2*f;m[p*g+f]=Math.min(h[v],h[v+1],h[v+d],h[v+d+1]),x[p*g+f]=Math.max(u[v],u[v+1],u[v+d],u[v+d+1])}h=m,u=x,d=g,this.mm.push({lo:h,hi:u,n:d})}}metresAt(t,e){const n=this.pack.rect,{W:i,H:r,heights:a}=this;let o=(t-n.x0)/(n.x1-n.x0)*i-.5,c=(e-n.z0)/(n.z1-n.z0)*r-.5;o<0?o=0:o>i-1.001&&(o=i-1.001),c<0?c=0:c>r-1.001&&(c=r-1.001);const l=o|0,h=c|0,u=o-l,d=c-h,g=h*i+l,m=a[g]+(a[g+1]-a[g])*u,x=a[g+i]+(a[g+i+1]-a[g+i])*u;return m+(x-m)*d}applyRange(t){this.rangeK=t;const e=t*this.leafSize;this.ranges=[];for(let n=0;n<this.levels;n++)this.ranges.push(e*2**n);this.ranges[this.levels-1]=1e9;for(let n=0;n<this.levels;n++){const i=this.ranges[n],r=n>0?this.ranges[n-1]:0;this.morph[n].set(r+(i-r)*.5,i*.97)}}setSelf(t){this.uniforms.uSelf.value=t;for(const e of[this.full,this.half])e.material.uniforms.uSelf.value=t}update(t,e){this.group.visible=e,this.full.count=0,this.half.count=0,e&&(this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.vert=this.world.uniforms.uVert.value,this.uniforms.uCamPos.value.copy(t.position),this.select(0,0,this.levels-1));for(const n of[this.full,this.half])n.geometry.instanceCount=n.count,n.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],r=this.leafSize*2**n,a=this.pack.rect.x0+t*r,o=this.pack.rect.z0+e*r,c=this.vert,l=Math.min(0,i.lo[e*i.n+t])*c-.3,h=Math.max(0,i.hi[e*i.n+t])*c+.1;return this._box.min.set(a,l,o),this._box.max.set(a+r,h,o+r),this._box}select(t,e,n){const i=this.mm[n];if(!(i.hi[e*i.n+t]>=ql))return!0;const a=this.nodeBox(t,e,n);if(a.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(a))return!0;const o=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,o,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,o,n),!0;for(let c=0;c<4;c++){const l=t*2+(c&1),h=e*2+(c>>1);if(!this.select(l,h,n-1)){const u=this.mm[n-1];if(!(u.hi[h*u.n+l]>=ql))continue;const d=this.nodeBox(l,h,n-1);if(!this._frustum.intersectsBox(d))continue;this.emit(this.half,l,h,o/2,n)}}return!0}emit(t,e,n,i,r){if(t.count>=Xl)return;const a=t.count*4;t.data[a]=this.pack.rect.x0+e*i,t.data[a+1]=this.pack.rect.z0+n*i,t.data[a+2]=i,t.data[a+3]=r,t.count++}dispose(){for(const t of[this.full,this.half])t.geometry.dispose(),t.material.dispose();this.shadow.dispose(),this.heightTex.dispose(),this.normalTex.dispose(),this.landTex.dispose()}}const Zv=["raise","lower"];async function Jv(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}function Su(s,t,e=console.warn,n=null){const i=(s==null?void 0:s.id)||(s==null?void 0:s.keyframe)||(s==null?void 0:s.file)||"?",r=(s==null?void 0:s.kind)??"lower";if(!Zv.includes(r))return e(`patch ${i}: kind "${r}" is neither raise nor lower; not drawn`),null;if(!Number.isFinite(s.until))return e(`patch ${i}: no until year; not drawn`),null;if(!s.file)return e(`patch ${i}: no mask file; not drawn`),null;const a=Array.isArray(s.size)&&s.size.length===2&&s.size.every(o=>Number.isInteger(o)&&o>0)?s.size:null;return{id:String(i),pack:s.pack??n,kind:r,depth:Number.isFinite(s.depth)?s.depth:-1,until:s.until,url:t(s.file),size:a,note:s.note||""}}async function Qv(s,t=console.warn){const e=new URL(s,location.href),n=a=>new URL(a,e).href;let i;try{i=await Jv(n("patches/manifest.json"))}catch{return[]}const r=[];for(const a of(i==null?void 0:i.patches)||[]){if(!(a!=null&&a.pack)){t(`patch ${(a==null?void 0:a.id)??"?"}: no pack; not drawn`);continue}const o=Su(a,n,t);o&&r.push(o)}return r}async function Eu(s){const{px:t,W:e,H:n}=await vi(s),i=new Uint8Array(e*n);for(let r=0,a=0;r<i.length;r++,a+=4)i[r]=t[a];return{grey:i,W:e,H:n}}function tx(s,t,e,n,i){if(t===n&&e===i)return s;const r=new Uint8Array(n*i);for(let a=0;a<i;a++){const o=Math.min(e-1,Math.max(0,(a+.5)/i*e-.5)),c=Math.floor(o),l=Math.min(e-1,c+1),h=o-c;for(let u=0;u<n;u++){const d=Math.min(t-1,Math.max(0,(u+.5)/n*t-.5)),g=Math.floor(d),m=Math.min(t-1,g+1),x=d-g,p=s[c*t+g]+(s[c*t+m]-s[c*t+g])*x,f=s[l*t+g]+(s[l*t+m]-s[l*t+g])*x;r[a*n+u]=Math.round(p+(f-p)*h)}}return r}function ex(s,t,e){let n=t,i=e,r=-1,a=-1;for(let h=0;h<e;h++){const u=h*t;for(let d=0;d<t;d++)s[u+d]&&(d<n&&(n=d),d>r&&(r=d),h<i&&(i=h),h>a&&(a=h))}if(r<0)return null;n=Math.max(0,n-1),i=Math.max(0,i-1),r=Math.min(t-1,r+1),a=Math.min(e-1,a+1);const o=r-n+1,c=a-i+1,l=new Uint8Array(o*c);for(let h=0;h<c;h++)l.set(s.subarray((i+h)*t+n,(i+h)*t+n+o),h*o);return{data:l,w:o,h:c,i0:n,j0:i}}async function nx(s,t=console.warn){const e=[];for(const n of s.masks||[])try{const i=await Eu(n.url),[r,a]=n.size||[s.W,s.H];(i.W!==r||i.H!==a)&&t(`${n.url} is ${i.W}×${i.H}, the manifest says ${r}×${a}; read at its own size`),e.push(tx(i.grey,i.W,i.H,s.W,s.H))}catch(i){t(`${n.url}: ${i.message} (that patch is not drawn)`),e.push(new Uint8Array(s.W*s.H))}return e}function Au(){const s=new sn(new Uint8Array(4),1,1,Vi,ge);return s.needsUpdate=!0,{uPatchMap:{value:s},uPatchBox:{value:Array.from({length:_s},()=>new Zt(0,0,1,1))},uPatchUv:{value:Array.from({length:_s},()=>new Zt(0,0,1,1))},uPatchInfo:{value:Array.from({length:_s},()=>new Zt(0,-1,-1,0))},uSlotPatch:{value:Array.from({length:Un},()=>new zt(0,0))},uSlotPatchBox:{value:Array.from({length:Un},()=>new Zt(0,0,-1,-1))}}}function ix(s){const e=s.reduce((c,l)=>c+(l.w+1)*(l.h+1),0),n=Math.max(...s.map(c=>c.w))+2*1,i=Math.min(4096,Math.max(n,64,Math.ceil(Math.sqrt(e*1.25))));let r=1,a=1,o=0;for(const c of[...s].sort((l,h)=>h.h-l.h))r+c.w+1>i&&(r=1,a+=o+1,o=0),c.ax=r,c.ay=a,r+=c.w+1,o=Math.max(o,c.h);return{W:i,H:a+o+1}}class sx{constructor(t){this.app=t,this.world=t.world,this.u=t.world.uniforms,this.all=[],this.recs=[],this.byPack=new Map,this.loaded=!1,this.atlas=null,this.warned=!1,this.ready=new Promise(e=>this.resolveReady=e),this.slotKey=""}async load(t=this.app.params.get("patches")||this.app.data.base){var o;const e=this.app.warn,n=await Qv(t,e),i=this.loaded;this.all=n,this.resolveReady(n),i&&((o=this.app.districts)==null||o.setPatches(n));const r=new Map(this.world.islandPacks.map(c=>[c.id,c])),a=[];for(const c of n){const l=r.get(c.pack);if(l)try{const h=await Eu(c.url),[u,d]=c.size||[l.W,l.H];(h.W!==u||h.H!==d)&&e(`patch ${c.id}: ${c.url} is ${h.W}×${h.H}, the manifest says ${u}×${d}; drawn at its own size`);const g=ex(h.grey,h.W,h.H);if(!g){e(`patch ${c.id}: its mask marks nothing`);continue}const m=l.rect,x=(m.x1-m.x0)/h.W,p=(m.z1-m.z0)/h.H;a.push({...c,crop:g,box:[m.x0+g.i0*x,m.z0+g.j0*p,m.x0+(g.i0+g.w)*x,m.z0+(g.j0+g.h)*p],k:this.want(c),depthM:c.depth})}catch(h){e(`patch ${c.id}: ${h.message}`)}}return this.setRecs(a),this.loaded=!0,n}forPack(t){return this.all.filter(e=>e.pack===t)}setRecs(t){var e;(e=this.atlas)==null||e.dispose(),this.atlas=null,this.recs=t,this.byPack=new Map;for(const n of t)this.byPack.has(n.pack)||this.byPack.set(n.pack,[]),this.byPack.get(n.pack).push(n);for(const n of this.byPack.values())n.sort((i,r)=>i.kind===r.kind?0:i.kind==="raise"?-1:1);if(t.length){const{W:n,H:i}=ix(t.map(o=>o.crop)),r=new Uint8Array(n*i);for(const{crop:o}of t)for(let c=0;c<o.h;c++)r.set(o.data.subarray(c*o.w,(c+1)*o.w),(o.ay+c)*n+o.ax);const a=new sn(r,n,i,Vi,ge);a.minFilter=a.magFilter=De,a.wrapS=a.wrapT=qe,a.generateMipmaps=!1,a.unpackAlignment=1,a.needsUpdate=!0,this.atlas=a,this.atlasSize=[n,i];for(const o of t){const c=o.crop;o.uv=[c.ax/n,c.ay/i,(c.ax+c.w)/n,(c.ay+c.h)/i]}}this.u.uPatchMap.value=this.atlas||Au().uPatchMap.value,this.slotKey="",this.write()}want(t,e=this.app.timeline.year){return e<t.until?1:0}update(t){if(!this.recs.length)return;const e=this.app.timeline.year,n=t>0?1-Math.exp(-t*Fh):1;for(const i of this.recs){const r=this.want(i,e);i.k+=(r-i.k)*n,Math.abs(r-i.k)<.002&&(i.k=r)}this.write()}settle(){this.update(0)}write(){const t=this.u,e=t.uPatchBox.value,n=t.uPatchUv.value,i=t.uPatchInfo.value,r=t.uSlotPatch.value,a=t.uSlotPatchBox.value;let o=0,c=0;this.world.slots.forEach((l,h)=>{const u=l&&this.byPack.get(l.pack.id)||[],d=o;let g=1/0,m=1/0,x=-1/0,p=-1/0;for(const f of u)if(!(f.k<=0)){if(o>=_s){c++;continue}e[o].set(...f.box),n[o].set(...f.uv),i[o].set(f.k,f.depthM,f.kind==="raise"?1:-1,0),o++,g=Math.min(g,f.box[0]),m=Math.min(m,f.box[1]),x=Math.max(x,f.box[2]),p=Math.max(p,f.box[3])}r[h].set(d,o-d),x>=g?a[h].set(g,m,x,p):a[h].set(0,0,-1,-1)}),c&&!this.warned&&(this.warned=!0,this.app.warn(`more than ${_s} patches on the islands in view; ${c} of them are not drawn`))}apply(t,e,n,i){const r=this.byPack.get(t);if(!r)return i;for(const a of r){if(a.k<=0)continue;const o=a.box,c=(e-o[0])/(o[2]-o[0]),l=(n-o[1])/(o[3]-o[1]);if(c<0||l<0||c>1||l>1)continue;const h=this.maskAt(a.crop,c,l)*a.k;h>0&&(i+=((a.kind==="raise"?Math.max(i,a.depthM):Math.min(i,a.depthM))-i)*h)}return i}maskAt(t,e,n){const i=e*t.w-.5,r=n*t.h-.5,a=Math.floor(i),o=Math.floor(r),c=i-a,l=r-o,h=(g,m)=>g<0||m<0||g>=t.w||m>=t.h?0:t.data[m*t.w+g],u=h(a,o)+(h(a+1,o)-h(a,o))*c,d=h(a,o+1)+(h(a+1,o+1)-h(a,o+1))*c;return(u+(d-u)*l)/255}stats(){return{loaded:this.loaded,listed:this.all.length,atlas:this.atlasSize||null,kB:this.atlasSize?Math.round(this.atlasSize[0]*this.atlasSize[1]/1024):0,islands:this.recs.map(t=>({id:t.id,pack:t.pack,kind:t.kind,depth:t.depthM,until:t.until,k:+t.k.toFixed(3),box:t.box.map(e=>+e.toFixed(3)),texels:t.crop.w*t.crop.h})),inSlots:this.u.uSlotPatch.value.map(t=>t.y)}}}const Yl=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};class rx{constructor(t,e){this.app=t,this.data=e,this.packs=e.packs,this.archPack=this.packs.find(a=>a.kind==="archipelago")||this.packs[0],this.islandPacks=this.packs.filter(a=>a!==this.archPack),this.group=new je,this.terrains=new Map,this.slots=new Array(Un).fill(null),this.exag=Mc(5e3),this.noIslands=!1,this.forceK=null;const n=bu(new Float32Array([-4e3]),1,1),i=new sn(new Uint8Array(4),1,1,Se,ge);i.needsUpdate=!0,this.dummyAux=i;const r=a=>Array.from({length:a},()=>new Zt(0,0,0,0));this.uniforms={uVert:{value:this.exag/100},uExag:{value:this.exag},uArchH:{value:n},uArchRect:{value:new Zt(0,0,1,1)},uSlotRect:{value:Array.from({length:Un},()=>new Zt(0,0,1,1))},uSlotInfo:{value:Array.from({length:Un},()=>new Zt(0,0,1,0))},uDistRect:{value:new Zt(0,0,1,1)},uDistInfo:{value:new Zt(0,0,1,0)},uDistH:{value:n},uDistAux:{value:i},uDistCarve:{value:n},uDistPatch:{value:i},uDistPatchBox:{value:new Zt(0,0,0,0)},uDistLower:{value:r(Fn)},uDistRaise:{value:r(Fn)},uDistRaiseTop:{value:-1e9},uFeatK:{value:r(16)},...Au()},this.district=null;for(let a=0;a<Un;a++)this.uniforms[`uSlotH${a}`]={value:n};this._frustum=new $i,this._m=new ee,this._box=new _n,this.dummy=n}setArchipelago(t){const e=new Oo(t,this);e.setSelf(-1),this.arch=e,this.terrains.set(t.id,e),this.group.add(e.group),this.uniforms.uArchH.value=e.heightTex,this.uniforms.uArchRect.value.copy(e.rect);const n=t.rect;this.bounds={x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1}}addIsland(t){const e=new Oo(t,this,this.arch);e.k=0,e.want=0,e.slot=-1;const n=t.rect;return e.margin=Math.min(15,.08*Math.min(n.x1-n.x0,n.z1-n.z0)),e.group.visible=!1,this.terrains.set(t.id,e),this.group.add(e.group),e}get islands(){return[...this.terrains.values()].filter(t=>t!==this.arch)}wantFor(t,e){const n=t.pack.rect,i=e.position,r=Math.max(n.x0-i.x,0,i.x-n.x1),a=Math.max(n.z0-i.z,0,i.z-n.z1),o=Math.hypot(r,a,Math.max(1,i.y)),c=(innerHeight||800)/(2*Math.tan(e.fov*Math.PI/360)),l=this.arch.texel*c/o;t.score=l;const h=Math.max(1,t.pack.data.hi*this.uniforms.uVert.value);return this._box.min.set(n.x0,0,n.z0),this._box.max.set(n.x1,h,n.z1),this._frustum.intersectsBox(this._box)?Yl(1,2.4,l):0}update(t,e,n){var g,m,x;this.exag=Mc(e),this.uniforms.uExag.value=this.exag,this.uniforms.uVert.value=this.exag/100;const i=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const p of i)p.want=this.noIslands?0:this.wantFor(p,t);const r=i.filter(p=>p.want>0).sort((p,f)=>f.score-p.score),a=new Set(r.slice(0,Un)),o=1-Math.exp(-n*2.5);for(const p of i){const f=a.has(p)?p.want:0;if(p.slot>=0)p.k+=(f-p.k)*o,Math.abs(f-p.k)<.004&&(p.k=f),p.k<=0&&f<=0&&this.release(p);else if(f>0){const v=this.slots.indexOf(null);v>=0&&this.assign(p,v)}}if(this.forceK!==null)for(const p of this.slots)p&&(p.k=this.forceK);if(this.noIslands)for(const p of this.slots)p&&this.release(p);const c=this.uniforms;for(let p=0;p<Un;p++){const f=this.slots[p];c.uSlotInfo.value[p].set(f?f.k:0,f?1:0,f?f.margin:1,0)}(g=this.app.patches)==null||g.update(n),this.arch.update(t,!0);for(const p of i)p.update(t,p.slot>=0);(m=this.district)==null||m.update(t,e,n);const l=this.app.renderer,h=this.app.light.sunDir,u=this.uniforms.uVert.value,d=this.maxY+.1;this.arch.shadow.update(l,h,u,0,d);for(const p of i)p.slot>=0&&p.shadow.update(l,h,u,p.k,d);(x=this.district)==null||x.updateShadow(l,h,u,d)}settle(t){var i;const e=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const r of e)r.want=this.wantFor(r,t);const n=e.filter(r=>r.want>0).sort((r,a)=>a.score-r.score).slice(0,this.slots.length);for(const r of e)r.slot>=0&&!n.includes(r)&&this.release(r);for(const r of n){if(r.slot<0){const a=this.slots.indexOf(null);if(a<0)continue;this.assign(r,a)}r.k=r.want}(i=this.app.patches)==null||i.settle()}stats(){var n,i,r;const t={};for(const[a,o]of this.terrains)o.group.visible&&(t[a]=o.full.count+o.half.count);const e=(n=this.district)==null?void 0:n.cur;return(i=e==null?void 0:e.terrain)!=null&&i.group.visible&&(t[e.d.id]=e.terrain.full.count+e.terrain.half.count),{exag:+this.exag.toFixed(2),nodes:t,slots:this.slots.map(a=>a?`${a.pack.id}:${a.k.toFixed(2)}`:null),district:((r=this.district)==null?void 0:r.stats())??null}}assign(t,e){this.slots[e]=t,t.slot=e,t.k=0,t.setSelf(e),t.shadow.ever=!1,t.shadow.strip=-1,t.shadow.drawn.vert=-1,this.uniforms.uSlotRect.value[e].copy(t.rect),this.uniforms[`uSlotH${e}`].value=t.heightTex}release(t){const e=t.slot;e<0||(this.slots[e]=null,t.slot=-1,t.k=0,this.uniforms[`uSlotH${e}`].value=this.dummy,this.uniforms.uSlotInfo.value[e].set(0,0,1,0))}metresAt(t,e){var c;const n=this.arch;if(!n)return-4e3;const i=n.pack.rect;let r=t<i.x0||e<i.z0||t>i.x1||e>i.z1?-4e3:n.metresAt(t,e),a=null,o=0;for(const l of this.slots){if(!l)continue;const h=l.pack.rect,u=Math.min(t-h.x0,h.x1-t,e-h.z0,h.z1-e);u>o&&(o=u,a=l)}if(a){const l=a.k*Yl(0,a.margin,o);l>0&&(r+=(this.ownMetres(a,t,e)-r)*l)}return(c=this.district)!=null&&c.on?this.district.blend(t,e,r):r}ownMetres(t,e,n){const i=t.metresAt(e,n);return this.app.patches?this.app.patches.apply(t.pack.id,e,n,i):i}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.uniforms.uVert.value}get maxY(){let t=0;for(const e of this.terrains.values())t=Math.max(t,e.pack.data.hi);return t*this.uniforms.uVert.value}chainShape(){if(this._chain)return this._chain;const t=this.arch,e=48,n=[];let i=null,r=null;for(const c of this.islandPacks){const l=c.rect,h=[];for(let d=0;d<=e;d++)for(let g=0;g<=e;g++){const m=l.x0+(l.x1-l.x0)*g/e,x=l.z0+(l.z1-l.z0)*d/e;t.metresAt(m,x)>0&&h.push([m,x])}if(!h.length)continue;n.push(...h);const u=(l.x0+l.x1)/2;(!i||u<i.cx)&&(i={cx:u,own:h}),(!r||u>r.cx)&&(r={cx:u,own:h})}if(!n.length){const c=this.bounds,l=[[c.x0,c.z0],[c.x1,c.z0],[c.x1,c.z1],[c.x0,c.z1]];return this._chain={hull:l,from:l[0],to:l[2]}}const a=i.own.reduce((c,[l,h])=>[c[0]+l/i.own.length,c[1]+h/i.own.length],[0,0]),o=r.own.reduce((c,l)=>l[0]+l[1]>c[0]+c[1]?l:c);return this._chain={hull:ax(n),from:a,to:o}}islandAt(t,e){let n=null,i=0;for(const r of this.islands){const a=r.pack.rect,o=Math.min(t-a.x0,a.x1-t,e-a.z0,a.z1-e);o>i&&(i=o,n=r)}return n}setRange(t){var e,n,i;for(const r of this.terrains.values())r.applyRange(t);(i=(n=(e=this.district)==null?void 0:e.cur)==null?void 0:n.terrain)==null||i.applyRange(t)}setDebug(t){var n,i;for(const r of this.terrains.values())r.uniforms.uDebug.value=t;const e=(i=(n=this.district)==null?void 0:n.cur)==null?void 0:i.terrain;if(e)for(const r of[e.full,e.half])r.material.uniforms.uDebug.value=t}}function ax(s){const t=[...s].sort((r,a)=>r[0]-a[0]||r[1]-a[1]);if(t.length<3)return t;const e=(r,a,o)=>(a[0]-r[0])*(o[1]-r[1])-(a[1]-r[1])*(o[0]-r[0]),n=[];for(const r of t){for(;n.length>=2&&e(n.at(-2),n.at(-1),r)<=0;)n.pop();n.push(r)}const i=[];for(let r=t.length-1;r>=0;r--){const a=t[r];for(;i.length>=2&&e(i.at(-2),i.at(-1),a)<=0;)i.pop();i.push(a)}return n.slice(0,-1).concat(i.slice(0,-1))}const ox=`
${Ie}
${Je}
${Xi}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[12];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out float vMetres;

float packMetres(vec2 xz) { return groundMetres(xz); }

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
  vMetres = mt;
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,cx=`
${Ie}
${cr}
${Je}
${Xi}
${Ls}
${wu}
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
`,lx=`
${Ie}
${Je}
${Xi}
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
`,fe=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};function hx(s,t,e){const n=t*e,i=new Uint8Array(n),r=new Int32Array(n).fill(-1),a=new Int32Array(n),o=new Float32Array(n);let c=0;const l=new Int32Array(n);let h=0;const u=v=>{let _=h++;const M=o[v];for(;_>0;){const w=_-1>>1;if(o[l[w]]<=M)break;l[_]=l[w],_=w}l[_]=v},d=()=>{const v=l[0],_=l[--h],M=o[_];let w=0;for(;;){let S=2*w+1;if(S>=h||(S+1<h&&o[l[S+1]]<o[l[S]]&&S++,o[l[S]]>=M))break;l[w]=l[S],w=S}return l[w]=_,v},g=new Int32Array(n);let m=0,x=0;for(let v=0;v<n;v++)s[v]<=0&&(i[v]=1);const p=[-1,1,0,0,-1,1,-1,1],f=[0,0,-1,1,-1,-1,1,1];for(let v=0;v<e;v++)for(let _=0;_<t;_++){const M=v*t+_;if(i[M])continue;let w=_===0||v===0||_===t-1||v===e-1,S=-1;for(let E=0;E<8&&!w;E++){const C=_+p[E],b=(v+f[E])*t+C;s[b]<=0&&(w=!0,S=b)}w&&(i[M]=1,r[M]=S,o[M]=s[M],u(M))}for(;h||m<x;){const v=m<x?g[m++]:d();a[c++]=v;const _=o[v],M=v%t,w=(v-M)/t;for(let S=0;S<8;S++){const E=M+p[S],C=w+f[S];if(E<0||C<0||E>=t||C>=e)continue;const y=C*t+E;i[y]||(i[y]=1,r[y]=v,s[y]<=_?(o[y]=_,g[x++]=y):(o[y]=s[y],u(y)))}m===x&&(m=x=0)}return{rec:r,order:a.subarray(0,c)}}function ux(s,t,e,n){const i=new Float32Array(t*e),{rec:r,order:a}=s;for(let o=0;o<a.length;o++)i[a[o]]=n;for(let o=a.length-1;o>=0;o--){const c=a[o],l=r[c];l>=0&&i[l]>0&&(i[l]+=i[c])}return i}function fx(s,t,e,n,i,r,a=.14){var p;const o=e*n,{rec:c}=s,l=new Uint8Array(o);for(let f=0;f<o;f++)t[f]>=i&&(l[f]=1);const h=new Uint8Array(o);for(let f=0;f<o;f++)l[f]&&c[f]>=0&&l[c[f]]&&(h[c[f]]=1);const u=new Uint8Array(o),d=[];for(let f=0;f<o;f++)l[f]&&!h[f]&&d.push(f);const g=new Float32Array(d.length);d.forEach((f,v)=>{let _=0;for(let M=f;M>=0&&l[M]&&_<1e6;M=c[M])_++;g[v]=_});const m=d.map((f,v)=>v).sort((f,v)=>g[v]-g[f]),x=[];for(const f of m){const v=[];let _=d[f];for(;_>=0&&l[_];){const w=_%e,S=(_-w)/e,[E,C]=r(w+.5,S+.5);if(v.push([E,C,t[_]]),u[_])break;u[_]=1,_=c[_]}if(_>=0&&!l[_]){const w=_%e,S=(_-w)/e,[E,C]=r(w+.5,S+.5);v.push([E,C,((p=v.at(-1))==null?void 0:p[2])??i])}if(v.length<3)continue;const M=px(dx(v,3),a);if(!(M.length<2)){x.push(M.length);for(const w of M)x.push(w[0],w[1],w[2])}}return new Float32Array(x)}function dx(s,t){const e=s.length,n=s.map(i=>i.slice());for(let i=1;i<e-1;i++){let r=0,a=0,o=0;const c=Math.min(t,i,e-1-i);for(let l=-c;l<=c;l++)r+=s[i+l][0],a+=s[i+l][1],o++;n[i][0]=r/o,n[i][1]=a/o}return n}function px(s,t){const e=[s[0]];let n=0;for(let r=0;r+1<s.length;r++){const a=s[r],o=s[r+1],c=Math.hypot(o[0]-a[0],o[1]-a[1]);let l=t-n;for(;l<c;){const h=l/c;e.push([a[0]+(o[0]-a[0])*h,a[1]+(o[1]-a[1])*h,a[2]+(o[2]-a[2])*h]),l+=t}n=c-(l-t)}const i=s[s.length-1];return Math.hypot(i[0]-e.at(-1)[0],i[1]-e.at(-1)[1])>t*.3&&e.push(i),e}function mx(s,t,e,n,i){const r=[];let a=1/0,o=-1/0;for(const h of n)for(let u=0;u+1<h.length;u++){const[d,g]=h[u],[m,x]=h[u+1];g!==x&&(r.push(g<x?[g,d,x,m]:[x,m,g,d]),a=Math.min(a,g,x),o=Math.max(o,g,x))}if(!r.length)return 0;const c=[];let l=0;for(let h=Math.max(0,Math.floor(a));h<=Math.min(e-1,Math.ceil(o));h++){const u=h+.5;c.length=0;for(const d of r)d[0]<=u&&d[2]>u&&c.push(d[1]+(u-d[0])/(d[2]-d[0])*(d[3]-d[1]));c.sort((d,g)=>d-g);for(let d=0;d+1<c.length;d+=2){const g=Math.max(0,Math.ceil(c[d]-.5)),m=Math.min(t-1,Math.floor(c[d+1]-.5));for(let x=g;x<=m;x++)s[h*t+x]=i,l++}}return l}function Br(s,t){let e=s*.1031%1,n=t*.1031%1;e<0&&(e+=1),n<0&&(n+=1);let i=e;const r=e*(n+33.33)+n*(i+33.33)+i*(e+33.33);e+=r,n+=r,i+=r;const a=(e+n)*i%1;return a<0?a+1:a}function Bo(s,t){const e=Math.floor(s),n=Math.floor(t),i=s-e,r=t-n,a=i*i*(3-2*i),o=r*r*(3-2*r),c=Br(e,n),l=Br(e+1,n),h=Br(e,n+1),u=Br(e+1,n+1);return c+(l-c)*a+(h-c+(c-l+u-h)*a)*o}function pe(s,t=0,e=0){let n=Math.imul(s|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e|0,2246822519);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const Tu=new Float32Array(1),gx=new Uint32Array(Tu.buffer);function qs(s){Tu[0]=s;const t=gx[0],e=t>>>16&32768;let n=(t>>>23&255)-127+15;const i=t&8388607;return n<=0?e:n>=31?e|31744:e|n<<10|i>>>13}function Ea(s){const t=s>>>10&31,e=s&1023,n=s&32768?-1:1;return t===0?n*e*5960464477539063e-23:t===31?e?NaN:n*(1/0):n*(1+e/1024)*2**(t-15)}const vx=28,cc=.5625,lo=[22,36],Kl=3.5,Zl=2.6,xx=32,_x=.45,ho=[7,16];function Mx({index:s,inside:t,box:e,m:n,hs:i,cls:r,chanDist:a,aux:o,carve:c,W:l,mx:h,mz:u}){const{x0:d,y0:g,x1:m,y1:x}=e,p=m-d+1,f=x-g+1,v=vn(p,f,M=>!t[(g+Math.floor(M/p))*l+d+M%p],h,u),_=new Set;for(let M=g;M<=x;M++)for(let w=d;w<=m;w++){const S=M*l+w;if(!t[S]||n[S]<=.3)continue;const E=w*h,C=M*u,y=(Bo(E/140+s*7.1,C/140)-.5)*24,b=fe(0,xx,v[(M-g)*p+(w-d)]+y),R=fe(ho[0],ho[1],a[S]);if(b*R<.02)continue;const P=r[S],F=cc*2**P,I=i[S]/F,z=qs(I-64*Math.floor(I/64)),N=Ru(n[S],Ea(z),P),H=Math.round(N/F-.5),B=N-n[S],q=B<0?fe(Kl+1,Kl,-B):fe(Zl+1,Zl,B),J=b*R*q;if(J<.02)continue;const Q=(a[S]-ho[0])/yx(H,P,s)+pe(s,H,P*7+2);_.add((P*4096+H)*4096+Math.floor(Q)),o[S*4+1]=Math.round(255*J),o[S*4+2]=P,o[S*4+3]=s,c[S*2]=z,c[S*2+1]=qs(Q)}return _.size}function yx(s,t,e){return lo[0]+(lo[1]-lo[0])*pe(e,s,t*7+1)}function wx(s,t,e,n){let i=1/0,r=1/0,a=-1/0,o=-1/0;for(const c of s)for(const[l,h]of c)i=Math.min(i,l),r=Math.min(r,h),a=Math.max(a,l),o=Math.max(o,h);return{x0:Math.max(0,Math.floor(i)-n),y0:Math.max(0,Math.floor(r)-n),x1:Math.min(t-1,Math.ceil(a)+n),y1:Math.min(e-1,Math.ceil(o)+n)}}function Ru(s,t,e){const n=cc*2**e,i=t+64*Math.floor((s/n-t)/64+.5);return(Math.floor(i)+.5)*n}const Jl=.346,Ql=.387,th=.436,eh=.575,nh=.702,xs=["ohia","ohiaKrumm","koa","kukui","ohiaai","hau","hala","wiliwili","lama","aalii","niu","milo"],$t=Object.fromEntries(xs.map((s,t)=>[s,t])),Os={ohiaDry:[1.48,1.41,1.8],ohiaWet:[.72,.75,.7],olapa:[1.32,1.46,1.17]},Gr=9;function bx(s,t){let e=0;for(let i=0;i<t.length;i++)t[i]>0&&(e+=t[i]);if(e<=0)return-1;s*=e;let n=-1;for(let i=0;i<t.length;i++)if(!(t[i]<=0)&&(n=i,(s-=t[i])<0))return i;return n}function Sx({W:s,H:t,mx:e,mz:n,m:i,m1795:r,rain:a,normals:o,rip:c,tpi:l,chanDist:h,clear:u,patch:d,shore:g,toWorld:m,step:x}){const p=xs.map(()=>[]),f=new Int32Array(xs.length),v=new Float32Array(xs.length),_=Math.floor(s*e/x),M=Math.floor(t*n/x);for(let w=0;w<M;w++)for(let S=0;S<_;S++){const E=(S+pe(S,w,11))*x,C=(w+pe(S,w,12))*x,y=Math.min(s-1,Math.floor(E/e)),b=Math.min(t-1,Math.floor(C/n)),R=b*s+y;if(d[R]>0||i[R]<1.2||r[R]<1.2||h[R]<9)continue;const P=i[R],F=a[R]/255+(pe(S,w,3)-.5)*.1,I=a[R]/255,z=o[R*4+1]/255*2-1,N=1-fe(.55,.75,z),H=P-fa(l,y,b,4),B=fa(c,y,b,4),q=Math.max(fe(.1,.3,B),fe(12,30,-H)),J=fe(10,30,H)*(1-fe(.05,.2,B)),Q=fe(.94,.97,z)*fe(.25,.5,B),ut=I-(.22+43e-5*P),j=fe(.5,.6,I),tt=1-fe(420-250*j,760-430*j,P+(pe(S,w,20)-.5)*120),ft=fe(.42,.6,Bo(E/210+13.1,C/210+7.7)),xt=fe(.6,.7,Bo(E/190+41.3,C/190+3.9)),yt=1-fe(14,40,h[R]),Et=P<670&&I>Jl?(1-fe(450,670,P))*(1-fe(nh-.04,nh+.02,I)):0,Rt=P<610?1:0,bt=P<550&&F>th?Q>.5?.8+4*xt:.1+6*xt:0,Dt=Math.max(fe(0,20,H),fe(300,420,P));v.fill(0);let G=0,ae=1,gt=null;if(g.a[(b>>1)*g.w+(y>>1)]<70&&P<8)G=.3,v[$t.niu]=50,v[$t.hala]=30,v[$t.milo]=15;else if(F<Ql&&ut<.04&&P<300)G=.04+.32*q+.22*N,v[$t.aalii]=35,v[$t.wiliwili]=I<Ql-.02?25:8,v[$t.lama]=25,v[$t.ohia]=12,gt=Os.ohiaDry;else if(tt>pe(S,w,22))if(Q>.5)G=.45,v[$t.ohiaai]=40*bt,v[$t.hau]=70*yt,v[$t.kukui]=20*Et*(1-.9*xt),v[$t.hala]=5*Rt;else if(q>.4||N>.4)G=.85,v[$t.kukui]=70*Et*(.25+.75*ft)*(1-.9*xt),v[$t.hala]=14*Rt*(1-.7*xt),v[$t.ohiaai]=10*bt,v[$t.hau]=60*yt*(P<450?1:0),v[$t.lama]=12*(F<th&&ut<0?1:0),v[$t.ohia]=(5+45*(1-Et)*(F>Jl?1:0))*(P>150?Dt:0),v[$t.ohiaKrumm]=10*(1-Et)*(F>=eh?1:0)*N;else{const L=fe(460,640,P);G=.25+.55*L,J>.5?(v[$t.ohia]=60*(P>150?1:0),v[$t.koa]=20*(P>250?1:0),v[$t.hala]=20*Rt*(1-L)):(v[$t.kukui]=45*Et*(.1+.9*ft)*(1-.9*xt),v[$t.hala]=35*Rt*(1-.7*xt)*(1-.85*L),v[$t.ohiaai]=10*bt,v[$t.hau]=60*yt*(P<450?1:0),v[$t.ohia]=(10+50*L)*(P>150?Dt:0),v[$t.koa]=(10+5*L)*(P>250?1:0))}else F<eh?(G=P<760?.55:.85,v[$t.ohia]=45,v[$t.koa]=30*(P>300?1:0),v[$t.lama]=15,v[$t.aalii]=5,v[$t.kukui]=10*Et*(q>.5?1:0)):J>.5||N>.5?(G=.6,v[$t.ohiaKrumm]=55,v[$t.ohia]=45,ae=.55+.3*pe(S,w,14)):(G=.92,v[$t.ohia]=80,v[$t.koa]=10*(z>.8?1:0),v[$t.ohiaKrumm]=10,gt=pe(S,w,15)<.12?Os.olapa:Os.ohiaWet);if(G<=pe(S,w,5))continue;const X=bx(pe(S,w,6),v);if(X<0)continue;const[st,ot]=m(E/e,C/n),T=.92+.16*pe(S,w,8),A=X===$t.ohia&&gt?gt:X===$t.ohiaKrumm&&gt===Os.olapa?Os.olapa:[T,T,T];p[X].push(st,ot,P-.6,pe(S,w,7)*Math.PI*2,ae*(.8+.4*pe(S,w,9)),A[0],A[1],A[2],u[R]),f[X]++}return{kinds:xs,lists:p.map(w=>new Float32Array(w)),counts:Array.from(f)}}const ds=-1,js=.5,Bs=16;function lc(s,t,e,n=js,i=ds){return t<128?s+(i-s)*(t/127)*e:s+(Math.max(js,n)-s)*((t-128)/127)*e}function Ex({W:s,H:t,lowerMasks:e,lowerOf:n,raises:i,patchMask:r,fill:a,log:o}){const c=s*t;let l=s,h=t,u=-1,d=-1;const g=y=>{const b=y%s,R=(y-b)/s;b<l&&(l=b),b>u&&(u=b),R<h&&(h=R),R>d&&(d=R)};for(let y=0;y<c;y++)if(r[y]||a[y])g(y);else for(const b of i)b[y]&&g(y);if(u<0)return null;l=Math.max(0,l-Bs),h=Math.max(0,h-Bs),u=Math.min(s-1,u+Bs),d=Math.min(t-1,d+Bs);const m=u-l+1,x=d-h+1,p=y=>(h+Math.floor(y/m))*s+l+y%m,f=65535,v=new Uint32Array(m*x),_=new Uint16Array(m*x).fill(f);let M=[];for(let y=0;y<m*x;y++){const b=p(y);let R=0;n.forEach((P,F)=>{e[P][b]>=128&&(R|=1<<F)}),R&&(v[y]=R,_[y]=0,M.push(y))}for(let y=1;y<f&&M.length;y++){const b=[];for(const R of M){const P=R%m;for(const F of[P>0?R-1:-1,P<m-1?R+1:-1,R-m,R+m])F<0||F>=m*x||_[F]!==f||y>Bs&&!r[p(F)]||(_[F]=y,v[F]=v[R],b.push(F))}M=b}const w=n.reduce((y,b,R)=>y|1<<R,0);for(let y=0;y<m*x;y++)a[p(y)]&&(v[y]=w);const S=[0],E=new Map,C=new Uint8Array(m*x*4);for(let y=0;y<m*x;y++){const b=v[y];if(b){let N=E.get(b);N===void 0&&(S.length<16?N=S.push(b)-1:(N=E.get(w)??S.length-1,o==null||o(`patch map: more than 15 sets of lower patches; ${b.toString(2)} goes with group ${N}`)),E.set(b,N)),C[y*4]=N}const R=p(y);let P=-1,F=0,I=-1,z=0;i.forEach((N,H)=>{const B=N[R];B>F?(I=P,z=F,P=H,F=B):B>z&&(I=H,z=B)}),P>=0&&(C[y*4+1]=F,C[y*4+2]=P&15|(Math.max(0,I)&15)<<4,C[y*4+3]=I>=0?z:0)}return{data:C,x0:l,y0:h,w:m,h:x,groups:S}}function ih(s,t,e){const n=new Uint8Array(t*e),i=new Int32Array(t*e);let r=0,a=0;const o=c=>{s[c]<=0&&!n[c]&&(n[c]=1,i[a++]=c)};for(let c=0;c<t;c++)o(c),o((e-1)*t+c);for(let c=0;c<e;c++)o(c*t),o(c*t+t-1);for(;r<a;){const c=i[r++],l=c%t,h=(c-l)/t;l>0&&o(c-1),l<t-1&&o(c+1),h>0&&o(c-t),h<e-1&&o(c+t)}return n}function Ax({heightPx:s,rainPx:t,masks:e=[],lower:n=[],raise:i=[],raiseDepth:r=[],W:a,H:o,scale:c,offset:l,mx:h,mz:u,rect:d,features:g,stride:m=4,log:x=()=>{}}){const p=Date.now(),f={};let v=p;const _=X=>{const st=Date.now();f[X]=st-v,v=st},M=a*o,w=kh(s,a,o,c,l,m),S=t?Oh(t,a,o,m):new Uint8Array(M).fill(82),E=new Uint8Array(M);{const X=ih(w,a,o);for(let st=0;st<M;st++)w[st]<=0&&!X[st]&&(w[st]=.3,E[st]=1)}const C=(d.x1-d.x0)/a,y=(d.z1-d.z0)/o,b=(X,st)=>[d.x0+X*C,d.z0+st*y];_("decode");const R=[...new Set(n)].map(X=>e[X]),P=i.map(X=>e[X]),F=new Uint8Array(M);for(const X of P)for(let st=0;st<M;st++)X[st]>F[st]&&(F[st]=X[st]);const I=new Uint8Array(M);for(const X of R)for(let st=0;st<M;st++)X[st]>=128&&(I[st]=1);if(R.length){const st=(A,L)=>{const k=A%a,$=(A-k)/a;for(let W=-3;W<=3;W++){const ht=$+W;if(!(ht<0||ht>=o))for(let it=-3;it<=3;it++){const dt=k+it;if(dt>=0&&dt<a&&L(ht*a+dt))return!0}}return!1},ot=[];for(let A=0;A<M;A++)I[A]||w[A]<=0||w[A]>5||st(A,L=>I[L])&&st(A,L=>w[L]<=0&&!I[L])&&ot.push(A);for(const A of ot)I[A]=1;const T=new Uint8Array(M);for(let A=0;A<M;A++){if(!E[A]||T[A])continue;const L=[A];T[A]=1;let k=!1;for(let $=0;$<L.length;$++){const W=L[$];!k&&st(W,it=>I[it]===1)&&(k=!0);const ht=W%a;for(const it of[ht>0?W-1:-1,ht<a-1?W+1:-1,W-a,W+a])it>=0&&it<M&&E[it]&&!T[it]&&(T[it]=1,L.push(it))}if(k)for(const $ of L)I[$]=1}}const z=new Uint8Array(M);if(R.length){const st=k=>w[k]<=0||I[k]===1,ot=vn(a,o,k=>!st(k),h,u),T=vn(a,o,k=>st(k)&&ot[k]>45,h,u),A=vn(a,o,k=>I[k]===1,h,u),L=45+1.5*Math.max(h,u);for(let k=0;k<M;k++)w[k]>0||I[k]||T[k]<=L||F[k]>=64||(A[k]<60?I[k]=2:z[k]=1);for(let k=0;k<M;k++)I[k]&&(I[k]=1)}const N=new Uint8Array(M*4),H=Float32Array.from(w);P.forEach((X,st)=>{const ot=r[st]??ds;for(let T=0;T<M;T++)X[T]&&(H[T]+=(Math.max(H[T],ot)-H[T])*(X[T]/255))});let B=null,q=null;{let X=a,st=o,ot=-1,T=-1;for(let A=0;A<M;A++){if(!I[A])continue;const L=A%a,k=(A-L)/a;X=Math.min(X,L),ot=Math.max(ot,L),st=Math.min(st,k),T=Math.max(T,k)}if(ot>=0){X=Math.max(0,X-12),st=Math.max(0,st-12),ot=Math.min(a-1,ot+12),T=Math.min(o-1,T+12),B={x0:X,y0:st,x1:ot,y1:T};const A=ot-X+1,L=T-st+1,k=W=>(st+Math.floor(W/A))*a+X+W%A,$=vn(A,L,W=>!I[k(W)]&&w[k(W)]>0,h,u);for(let W=0;W<A*L;W++){const ht=k(W);if(!I[ht])continue;const it=fe(0,45,$[W]);N[ht*4]=Math.round(127*it),H[ht]+=(ds-H[ht])*it}}}if(B){const X=Math.round(15e3/(h*u)),st=new Uint8Array(M),ot=[];for(let T=0;T<M;T++){const A=T%a,L=(T-A)/a;if(A<B.x0||A>B.x1||L<B.y0||L>B.y1||st[T]||H[T]<=0)continue;ot.length=0,ot.push(T),st[T]=1;let k=!1,$=!1;for(let W=0;W<ot.length;W++){const ht=ot[W],it=ht%a,dt=(ht-it)/a;if(it<=B.x0||dt<=B.y0||it>=B.x1||dt>=B.y1){$=!0;continue}for(const vt of[ht-1,ht+1,ht-a,ht+a])H[vt]>0?st[vt]||(st[vt]=1,ot.push(vt)):I[vt]&&(k=!0);ot.length>X&&($=!0)}if(!($||!k)){q||(q=[]);for(const W of ot)I[W]=1,N[W*4]=127,H[W]=ds,q.push(W)}}}const J=Float32Array.from(w);let Q=null;if(R.length){for(let k=0;k<M;k++)z[k]&&(H[k]=js);const X=ih(H,a,o);for(let k=0;k<M;k++)!z[k]&&H[k]<=0&&!X[k]&&(z[k]=1);const st=new Float32Array(M),ot=new Float32Array(M);for(let k=0;k<M;k++)z[k]||I[k]||w[k]<=0||(st[k]=Math.min(w[k],6),ot[k]=1);const T=Math.ceil(30/Math.max(h,u)),A=In(st,a,o,T,2),L=In(ot,a,o,T,2);Q=new Float32Array(M);for(let k=0;k<M;k++){if(!z[k])continue;const $=L[k]>.001?Math.max(js,Math.min(6,A[k]/L[k]-.2)):js;Q[k]=$,N[k*4]=255,H[k]=$,J[k]=$}}const ut=Ex({W:a,H:o,lowerMasks:e,lowerOf:n,raises:P,patchMask:I,fill:z,log:x});_("patches");let j=J;if(q){j=Float32Array.from(J);for(const X of q)j[X]=ds}const tt=Gh(j,a,o,h,u,Bh(j,a,o,h,u));_("normals");let ft,xt,yt;{const X=Hr(J,a,o,2,!0),st=hx(X.a,X.w,X.h),ot=ux(st,X.w,X.h,4*h*u/1e6);_("routing"),yt=fx(st,ot,X.w,X.h,_x,(L,k)=>b(L*2,k*2)),_("streams"),xt=vn(a,o,L=>{const k=L%a,$=(L-k)/a;return J[L]>0&&ot[($>>1)*X.w+(k>>1)]>=1},h,u);const T=new Float32Array(X.w*X.h);for(let L=0;L<T.length;L++)T[L]=X.a[L]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,ot[L])/.04)/1.6)):0;const A=Hr(T,X.w,X.h,2,!1);ft={a:In(A.a,A.w,A.h,1,2),w:A.w,h:A.h}}_("riparian");const Et=new Uint8Array(M*4);let Rt;{const X=(st,ot)=>{const T=Hr(st,a,o,2,!1),A=vn(T.w,T.h,$=>T.a[$]<=0,h*2,u*2),L=new Float32Array(T.w*T.h);for(let $=1;$<T.h-1;$++)for(let W=1;W<T.w-1;W++){const ht=$*T.w+W,it=T.a[ht];if(it<=0||it>9)continue;const dt=Math.hypot((T.a[ht+1]-T.a[ht-1])/(4*h),(T.a[ht+T.w]-T.a[ht-T.w])/(4*u));L[ht]=A[ht]<70&&dt<.12?1:0}const k={a:In(L,T.w,T.h,1,1),w:T.w,h:T.h};for(let $=0;$<o;$++)for(let W=0;W<a;W++)Et[($*a+W)*4+ot]=st[$*a+W]>0?Math.round(255*Math.min(1,fa(k,W,$,2)*1.5)):0;return{a:A,w:T.w,h:T.h}};X(J,1),Rt=X(H,3)}for(let X=0;X<o;X++)for(let st=0;st<a;st++){const ot=X*a+st;Et[ot*4]=t?S[ot]:w[ot]>0?82:0,Et[ot*4+2]=J[ot]>0?Math.round(255*Math.min(1,fa(ft,st,X,4)*1.6)):0}_("sand");const bt=new Uint16Array(M*2);if(Q)for(let X=0;X<M;X++)z[X]&&(bt[X*2]=qs(Q[X]),bt[X*2+1]=qs(Q[X]-w[X]));if(q)for(const X of q)bt[X*2+1]=qs(ds-w[X]);const Dt={},G=new Uint8Array(M);{const X=In(w,a,o,3,2),st=new Uint8Array(M);{const A=new Float32Array(M);for(let k=1;k<o-1;k++)for(let $=1;$<a-1;$++){const W=k*a+$;A[W]=Math.hypot((X[W+1]-X[W-1])/(2*h),(X[W+a]-X[W-a])/(2*u))}const L=In(A,a,o,6,2);for(let k=0;k<M;k++)st[k]=Math.max(0,Math.min(3,Math.round(Math.log2(Math.max(1e-6,L[k]*vx/cc)))))}const ot=new Uint8Array(M),T={village:0,loi:1,pond:2};for(const A of[...g].sort((L,k)=>T[L.kind]-T[k.kind])){const L=wx(A.rings,a,o,4);for(let $=L.y0;$<=L.y1;$++)ot.fill(0,$*a+L.x0,$*a+L.x1+1);const k=mx(ot,a,o,A.rings,1);if(k){if(A.kind==="loi")Dt[A.index]=Mx({index:A.index,inside:ot,box:L,m:w,hs:X,cls:st,chanDist:xt,aux:N,carve:bt,W:a,mx:h,mz:u});else{const $=L.x1-L.x0+1,W=L.y1-L.y0+1,ht=vn($,W,it=>!ot[(L.y0+Math.floor(it/$))*a+L.x0+it%$],h,u);for(let it=L.y0;it<=L.y1;it++)for(let dt=L.x0;dt<=L.x1;dt++){const vt=it*a+dt;ot[vt]&&(N[vt*4+1]=Math.round(255*fe(0,A.kind==="pond"?9:40,ht[(it-L.y0)*$+(dt-L.x0)])),N[vt*4+2]=0,N[vt*4+3]=A.index,bt[vt*2]=bt[vt*2+1]=0)}Dt[A.index]=k}for(let $=L.y0;$<=L.y1;$++)for(let W=L.x0;W<=L.x1;W++)ot[$*a+W]&&(G[$*a+W]=A.index)}}}_("features");let ae;{const X=Tx(G,a,o,5),st=Hr(w,a,o,4,!1),ot={a:In(st.a,st.w,st.h,2,2),w:st.w,h:st.h};ae=Sx({W:a,H:o,mx:h,mz:u,m:w,m1795:H,rain:S,normals:tt,rip:ft,tpi:ot,chanDist:xt,clear:X,patch:I,shore:Rt,toWorld:b,step:25})}_("trees");let gt=1/0,lt=-1/0;for(let X=0;X<M;X++)w[X]<gt&&(gt=w[X]),w[X]>lt&&(lt=w[X]);return x(`district decoded in ${Date.now()-p} ms: ${JSON.stringify(f)}`),{metres:w,normals:tt,land:Et,aux:N,carve:bt,streams:yt,trees:ae,counts:Dt,lo:gt,hi:lt,patchMap:ut,ms:Date.now()-p,times:f}}function Hr(s,t,e,n,i){const r=Math.ceil(t/n),a=Math.ceil(e/n),o=new Float32Array(r*a).fill(i?1/0:-1/0);for(let c=0;c<e;c++){const l=Math.floor(c/n)*r;for(let h=0;h<t;h++){const u=l+Math.floor(h/n),d=s[c*t+h];(i?d<o[u]:d>o[u])&&(o[u]=d)}}return{a:o,w:r,h:a}}function fa(s,t,e,n){const i=Math.min(s.w-1.001,Math.max(0,(t+.5)/n-.5)),r=Math.min(s.h-1.001,Math.max(0,(e+.5)/n-.5)),a=i|0,o=r|0,c=i-a,l=r-o,h=s.a,u=o*s.w+a,d=h[u]+(h[u+1]-h[u])*c,g=h[u+s.w]+(h[u+s.w+1]-h[u+s.w])*c;return d+(g-d)*l}function Tx(s,t,e,n){const i=Uint8Array.from(s);for(let a=0;a<e;a++)for(let o=0;o<t;o++){const c=a*t+o;if(!s[c])for(let l=1;l<=n;l++){const h=o-l>=0&&s[c-l]||o+l<t&&s[c+l];if(h){i[c]=h;break}}}const r=Uint8Array.from(i);for(let a=0;a<e;a++)for(let o=0;o<t;o++){const c=a*t+o;if(!i[c])for(let l=1;l<=n;l++){const h=a-l>=0&&i[c-l*t]||a+l<e&&i[c+l*t];if(h){r[c]=h;break}}}return r}const uo=24;async function sh(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}async function Rx(s,t=console.warn){let e;try{e=await sh(s.abs("districts/manifest.json"))}catch{return[]}const n=[];for(const i of e.districts||[])try{let r={type:"FeatureCollection",features:[]};if(i.features)try{r=await sh(s.abs(`districts/${i.features}`))}catch(a){t(`districts/${i.features}: ${a.message} (the district is drawn without its features)`)}n.push(Cx(i,r,s,t))}catch(r){t(`district ${i.id}: ${r.message}`)}return n}function hc(s){return[Number.isFinite(s==null?void 0:s.from)?s.from:-1/0,Number.isFinite(s==null?void 0:s.to)?s.to:1/0]}function Aa(s,t){const[e,n]=hc(s);return t>=e&&t<n+1}function Cx(s,t,e,n){var _;const r=e.proj.rect(s.bounds),[a,o]=s.size,[c,l,h,u]=s.bounds,d=M=>e.abs(`districts/${M}`),g=([M,w])=>[(M-c)/(h-c)*a,(u-w)/(u-l)*o],m={loi:zn.loi,pond:zn.pond,other:zn.other},x={loi:zn.pond-1,pond:zn.other-1,other:zn.max},p=[],f=new Map;for(const M of t.features||[]){const w=M.properties||{},S=w.kind==="loi"?"loi":w.kind==="fishpond"?"pond":w.kind==="village"?"other":null,E=M.geometry;if(!S||(E==null?void 0:E.type)!=="Polygon")continue;if(m[S]>x[S]){n(`district ${s.id}: more ${w.kind} features than the aux map has room for; ${w.name} is not drawn`);continue}const C=m[S]++;p.push({index:C,kind:S==="other"?w.kind:S,rings:E.coordinates.map(y=>y.map(g))}),f.set(C,M)}const v=(s.patches||[]).map(M=>Su(M,d,w=>n(`district ${s.id}: ${w}`),s.id)).filter(Boolean);return{id:s.id,name:s.name||s.id,parent:s.parent||s.island,desc:s,bounds:s.bounds,rect:r,W:a,H:o,mx:(r.x1-r.x0)*ws/a,mz:(r.z1-r.z0)*ws/o,heightUrl:d(s.height.file),rainUrl:(_=s.rain)!=null&&_.file?d(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,own:v,patches:v,features:t,raster:p,byIndex:f,sources:s.sources||[]}}function Lx(s,t=[],e=console.warn){const n=[...s.own,...t.filter(a=>a.pack===s.id)],i=n.filter(a=>a.kind==="lower"),r=n.filter(a=>a.kind==="raise");return i.length>uo&&e(`district ${s.id}: ${i.length} lower patches, ${uo} drawn`),r.length>Fn&&e(`district ${s.id}: ${r.length} raise patches, ${Fn} drawn`),[...r.slice(0,Fn),...i.slice(0,uo)]}class Px{constructor(t=console.warn){this.warn=t,this.jobs=new Map,this.n=0;try{this.worker=new Worker(new URL(""+new URL("district-worker-DsB0McXu.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=e=>this.message(e.data),this.worker.onerror=e=>{var n;(n=e.preventDefault)==null||n.call(e),this.fallback=!0;for(const[i,r]of this.jobs)this.mainThread(i,r)}}catch{this.fallback=!0}}job(t){const e=[],n=a=>{let o=e.findIndex(c=>c.url===a.url);return o<0&&(o=e.push({url:a.url,size:a.size})-1),o},i=t.patches.filter(a=>a.kind==="lower").map(n),r=t.patches.filter(a=>a.kind==="raise");return{heightUrl:t.heightUrl,rainUrl:t.rainUrl,masks:e,lower:i,raise:r.map(n),raiseDepth:r.map(a=>a.depth),W:t.W,H:t.H,scale:t.scale,offset:t.offset,mx:t.mx,mz:t.mz,rect:{x0:t.rect.x0,z0:t.rect.z0,x1:t.rect.x1,z1:t.rect.z1},features:t.raster.map(a=>({index:a.index,kind:a.kind,rings:a.rings}))}}decode(t){return new Promise((e,n)=>{const i=++this.n,r={d:t,resolve:e,reject:n};this.jobs.set(i,r),this.fallback?this.mainThread(i,r):this.worker.postMessage({id:i,...this.job(t)})})}message(t){const e=this.jobs.get(t.id);if(e){if(t.log)return this.warn(t.log);this.jobs.delete(t.id),t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,this.jobs.set(t.id,e),this.mainThread(t.id,e)):e.reject(new Error(t.message))}}async mainThread(t,e){try{const n=this.job(e.d),i=await vi(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);const r=n.rainUrl?await vi(n.rainUrl).then(c=>c.W===n.W&&c.H===n.H?c.px:null).catch(()=>null):null,a=await nx(n,this.warn),o=Ax({...n,heightPx:i.px,rainPx:r,masks:a});this.jobs.delete(t),e.resolve(o)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){var t;(t=this.worker)==null||t.terminate()}}const be=af,Ui=s=>s*ir/100,ct={plain:0,thatch:1,stone:2,leaf:3,water:4,kapa:5,wood:6,skin:7,sand:8,clap:9,windows:10,roof:11,masonry:12};class Le{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.feat=[],this.featNow=0,this.xf=null,this.stack=[]}at(t,e,n,i=0,r=be){this.stack.push(this.xf);const a=Math.cos(i),o=Math.sin(i);return this.xf=c=>[t+(c[0]*a-c[2]*o)*r,e+c[1]*r,n+(c[0]*o+c[2]*a)*r],this}done(){return this.xf=this.stack.pop()||null,this}feature(t){return this.featNow=t,this}tri(t,e,n,i,r=0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const a=e[0]-t[0],o=e[1]-t[1],c=e[2]-t[2],l=n[0]-t[0],h=n[1]-t[1],u=n[2]-t[2];let d=o*u-c*h,g=c*l-a*u,m=a*h-o*l;const x=Math.hypot(d,g,m)||1;d/=x,g/=x,m/=x;for(const p of[t,e,n])this.pos.push(p[0],p[1],p[2]),this.nor.push(d,g,m),this.col.push(i[0],i[1],i[2]),this.mat.push(r),this.feat.push(this.featNow)}quad(t,e,n,i,r,a=0){this.tri(t,e,n,r,a),this.tri(t,n,i,r,a)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let r=0;r<4;r++)this.quad(t[r],e[r],e[(r+1)%4],t[(r+1)%4],n,i)}box(t,e,n,i,r,a,o,c=0,l=0,h=1){const u=Math.cos(l),d=Math.sin(l),g=(M,w,S)=>[t+M*u-S*d,e+w,n+M*d+S*u],m=i/2,x=a/2,p=m*h,f=x*h,v=[g(-m,0,-x),g(m,0,-x),g(m,0,x),g(-m,0,x)],_=[g(-p,r,-f),g(p,r,-f),g(p,r,f),g(-p,r,f)];r<0?this.hexa(_,v,o,c):this.hexa(v,_,o,c)}cyl(t,e,n,i,r,a=0,o=6){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],l=Math.hypot(...c)||1,h=c.map(p=>p/l),u=Math.abs(h[1])<.9?[0,1,0]:[1,0,0];let d=[h[1]*u[2]-h[2]*u[1],h[2]*u[0]-h[0]*u[2],h[0]*u[1]-h[1]*u[0]];const g=Math.hypot(...d);d=d.map(p=>p/g);const m=[h[1]*d[2]-h[2]*d[1],h[2]*d[0]-h[0]*d[2],h[0]*d[1]-h[1]*d[0]],x=(p,f,v)=>{const _=v/o*Math.PI*2,M=Math.cos(_)*f,w=Math.sin(_)*f;return[p[0]+d[0]*M+m[0]*w,p[1]+d[1]*M+m[1]*w,p[2]+d[2]*M+m[2]*w]};for(let p=0;p<o;p++)this.quad(x(t,n,p),x(t,n,p+1),x(e,i,p+1),x(e,i,p),r,a)}blob(t,e,n,i,r,a,o,c=0,l=0,h=c===ct.leaf){const u=(1+Math.sqrt(5))/2,d=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],g=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],m=f=>.85+.3*Math.abs(Math.sin(f*12.9898+l*78.233)*43758.5453%1),x=d.map((f,v)=>{const _=Math.hypot(...f),M=m(v);return[t+f[0]/_*i*M,e+f[1]/_*r*M,n+f[2]/_*a*M]});if(!h){for(const f of g)this.tri(x[f[0]],x[f[1]],x[f[2]],o,c);return}const p=f=>{const v=[(f[0]-t)/(i*i),(f[1]-e)/(r*r),(f[2]-n)/(a*a)],_=Math.hypot(...v)||1;return[v[0]/_,v[1]/_,v[2]/_]};for(const f of g){const v=f.map(M=>x[M]),_=this.xf?v.map(M=>this.xf(M)):v;for(let M=0;M<3;M++)this.pos.push(..._[M]),this.nor.push(...p(v[M])),this.col.push(o[0],o[1],o[2]),this.mat.push(c),this.feat.push(this.featNow)}}wall(t,e,n,i,r=ct.stone,a=.7){const o=t.length;if(o<2)return;const c=o>2&&Math.hypot(t[0][0]-t[o-1][0],t[0][2]-t[o-1][2])<1e-9,l=[];for(let x=0;x<o-1;x++){const p=t[x+1][0]-t[x][0],f=t[x+1][2]-t[x][2],v=Math.hypot(p,f)||1;l.push([-f/v,p/v])}const h=t.map((x,p)=>{let f=l[p-1],v=l[p];if(c&&p===0&&(f=l[o-2]),c&&p===o-1&&(v=l[0]),!f)return v;if(!v)return f;const _=f[0]+v[0],M=f[1]+v[1],w=Math.hypot(_,M);if(w<1e-6)return v;const S=1/Math.max(.35,(_*v[0]+M*v[1])/w);return[_/w*S,M/w*S]}),u=e/2,d=e*a/2,g=(x,p,f,v)=>[x[0]+p[0]*f,x[1]+v,x[2]+p[1]*f],m=x=>[g(t[x],h[x],-u,-n*.3),g(t[x],h[x],u,-n*.3),g(t[x],h[x],d,n),g(t[x],h[x],-d,n)];for(let x=0;x<o-1;x++){const[p,f,v,_]=m(x),[M,w,S,E]=m(x+1);this.quad(_,v,S,E,i,r),this.quad(f,w,S,v,i,r),this.quad(M,p,_,E,i,r)}if(!c){const[x,p,f,v]=m(0),[_,M,w,S]=m(o-1);this.quad(x,p,f,v,i,r),this.quad(M,_,S,w,i,r)}}geometry(){const t=new Ze;return t.setAttribute("position",new ye(this.pos,3)),t.setAttribute("normal",new ye(this.nor,3)),t.setAttribute("color",new ye(this.col,3)),t.setAttribute("aMat",new ye(this.mat,1)),t.setAttribute("aFeat",new ye(this.feat,1)),t.computeBoundingSphere(),t}}function Go(s){const t=s.attributes.position.array,e=s.attributes.normal.array,n=s.attributes.color.array,i=s.attributes.aMat.array,r=new Map,a=[],o=[],c=[],l=[],h=[];for(let d=0;d<i.length;d++){const g=`${t[d*3]},${t[d*3+1]},${t[d*3+2]},${e[d*3]},${e[d*3+1]},${e[d*3+2]},${n[d*3]},${n[d*3+1]},${n[d*3+2]},${i[d]}`;let m=r.get(g);m===void 0&&(m=r.size,r.set(g,m),o.push(t[d*3],t[d*3+1],t[d*3+2]),c.push(e[d*3],e[d*3+1],e[d*3+2]),l.push(n[d*3],n[d*3+1],n[d*3+2]),h.push(i[d])),a.push(m)}const u=new Ze;return u.setAttribute("position",new ye(o,3)),u.setAttribute("normal",new ye(c,3)),u.setAttribute("color",new ye(l,3)),u.setAttribute("aMat",new ye(h,1)),u.setIndex(a),u.computeBoundingSphere(),u}function Mt(s,t=0,e=Math.random){const n=new Nt(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const Dx=`
${Ie}
${Je}
in float aMat;
in float aFeat;
#ifdef USE_GROW
in vec4 aSpan;               // the years a building stands: in from x to y, out from z to w
in float aStretch;           // its height over its model's (a tower's), for the storeys
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
  fade *= smoothstep(aSpan.x, aSpan.y, uYearNow) * (1.0 - smoothstep(aSpan.z, aSpan.w, uYearNow));
  #else
  int cl = int(aClear + 0.5);
  if (cl > 0) fade *= 1.0 - featV(uFeatSeen, cl);
  // (and a tree stands back from what the town has built round it by the year)
  fade *= 1.0 - smoothstep(0.3, 0.7, texture(uTownClear, rectUv(uDistRect, origin.xz)).r);
  #endif
  // and thinner toward the district's edge, as its ground eases into the
  // island's (one tree in so many left out, not every one dissolved)
  float edgeK = smoothstep(uDistInfo.w, uDistInfo.z, edgeDist(uDistRect, origin.xz));
  float pick = fract(sin(dot(origin.xz, vec2(12.9898, 78.233))) * 43758.5453);
  fade *= step(pick, edgeK);
  #endif
  vFade = fade;
  gl_Position = fade <= 0.001 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * viewMatrix * wp;
}
`,Ix=`
${Ie}
${cr}
${Je}
${Ls}
uniform sampler2D uDistS;   // the district's cast shadows
in vec3 vWorld;
in vec3 vNormal;
in vec3 vColor;
in float vMat;
in vec3 vLocal;
in float vFade;
void main() {
  if (vFade <= 0.0) discard;
  // dither in and out instead of popping
  if (hash12(gl_FragCoord.xy) >= vFade) discard;
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
  vec2 uv = rectUv(uDistRect, vWorld.xz);
  float vis = texture(uDistS, uv).r;
  vec3 lit = shade(a, n, vWorld, 1.0, vis);
  // a little wrap and translucency for leaves
  if (m == 3) lit += a * uSunColor * max(dot(-n, uSunDir), 0.0) * 0.25 * vis;
  if (m == 5) lit += a * uSkyColor * 0.15;
  gl_FragColor = vec4(lit, 1.0);
}
`;function da(s,t,e={}){const[n,i]=e.fade||[60,90];return new we({vertexShader:Dx,fragmentShader:Ix,vertexColors:!0,side:e.doubleSide?An:ri,defines:e.grow?{USE_GROW:""}:{},uniforms:{...s.uniforms,uYearNow:{value:0},uTownClear:{value:null},...t,uFadeNear:{value:n},uFadeFar:{value:i}}})}const Ys={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",koa:"#7a4a2a",pondStone:"#8a817a"};function pa(s,t,e=7,n=4.6,i=5.2,r=!0,a=.6){const o=Mt(Ys.thatch,.18,t),c=Mt(Ys.thatchDark,.15,t),l=Mt(Ys.stone,.15,t);s.box(0,-a,0,e+1.8,.45+a,n+1.8,l,ct.stone);const h=.45,u=h+1.05;s.box(0,h,0,e,u-h,n,o,ct.thatch);const d=e/2+.35,g=n/2+.45,m=h+i,x=[-d,u-.15,-g],p=[d,u-.15,-g],f=[-d,m,0],v=[d,m,0],_=[-d,u-.15,g],M=[d,u-.15,g];s.quad(x,f,v,p,o,ct.thatch),s.quad(M,v,f,_,o,ct.thatch),s.quad(p,v,f,x,c,ct.thatch),s.quad(_,f,v,M,c,ct.thatch);const w=e/2;if(s.tri([-w,u,-n/2],[-w,u,n/2],[-w,m-.2,0],o,ct.thatch),s.tri([w,u,n/2],[w,u,-n/2],[w,m-.2,0],o,ct.thatch),s.box(0,m-.12,0,e+.9,.35,.55,c,ct.thatch),r){const S=[.05,.035,.025];s.quad([w+.02,h,-.45],[w+.02,h+1.4,-.45],[w+.02,h+1.4,.45],[w+.02,h,.45],S,0)}}function Ux(s,t,e=8){const n=Mt(Ys.koa,.2,t),i=Mt("#4a2c18",.2,t),r=e/2;s.box(0,0,0,e*.8,.55,.62,n,ct.wood,0,.9),s.box(r*.85,.05,0,e*.2,.6,.4,i,ct.wood,0,.5),s.box(-r*.85,.05,0,e*.2,.55,.4,i,ct.wood,0,.5);const a=-2.4;for(const o of[-e*.15,e*.15])s.cyl([o,.55,0],[o,.5,a],.06,.06,i,ct.wood,4);s.box(0,.05,a,e*.5,.28,.24,i,ct.wood,0,.8)}function Nx(s,t){const e=Mt("#4d4642",.2,t);for(let n=0;n<5;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,ct.stone,n)}const na=Math.PI*2,Ks=[[0,1,0]];for(let s=0;s<10;s++){const t=s*Math.PI/5,e=s%2?-1:1;Ks.push([Math.cos(t)*.8944,e*.4472,Math.sin(t)*.8944])}Ks.push([0,-1,0]);const Cu=[];for(let s=0;s<5;s++){const t=1+2*s,e=t+1,n=1+(2*s+2)%10,i=1+(2*s+3)%10;Cu.push([0,t,n],[t,e,n],[n,e,i],[11,e,i])}function zx(s,t,e,n,i,r,a,o,c,l=0,h=.1,u=1){const d=(p,f,v)=>{const _=Math.max(0,Math.min(1,(v-p)/(f-p)));return _*_*(3-2*_)},g=Ks.map((p,f)=>{const v=f===0||f===11?1:1-h+2*h*Math.abs(Math.sin(f*12.9898+l*78.233)*43758.5453%1);return[t+p[0]*i*v,e+p[1]*r,n+p[2]*a*v]}),m=Ks.map(p=>{const f=[p[0]/i,p[1]/r,p[2]/a],v=Math.hypot(...f);return[f[0]/v,f[1]/v,f[2]/v]}),x=Ks.map(p=>{const f=u+(1-u)*d(-.8,.3,p[1]);return[o[0]*f,o[1]*f,o[2]*f]});for(const p of Cu){const[f,v,_]=p.map(C=>g[C]),M=(v[1]-f[1])*(_[2]-f[2])-(v[2]-f[2])*(_[1]-f[1]),w=(v[2]-f[2])*(_[0]-f[0])-(v[0]-f[0])*(_[2]-f[2]),S=(v[0]-f[0])*(_[1]-f[1])-(v[1]-f[1])*(_[0]-f[0]),E=M*(f[0]+v[0]+_[0]-3*t)+w*(f[1]+v[1]+_[1]-3*e)+S*(f[2]+v[2]+_[2]-3*n)>0;for(const C of E?p:[p[0],p[2],p[1]])s.pos.push(g[C][0],g[C][1],g[C][2]),s.nor.push(m[C][0],m[C][1],m[C][2]),s.col.push(x[C][0],x[C][1],x[C][2]),s.mat.push(c),s.feat.push(0)}}function bn(s,{stick:t,r0:e=.4,r1:n=.25,bark:i="#6a6058",limbs:r=[],crowns:a}){const o=new Le,c=Mt(i,.1,s);t&&o.cyl([0,0,0],t,e,n,c,ct.wood,3);for(const[l,h,u,d]of r)o.cyl(l,h,u,d,c,ct.wood,3);for(const[l,h,u,d,g,m,x=ct.leaf,p=1,f=1]of a)zx(o,l,h,u,d,g,d,typeof m=="string"?Mt(m,.1,s):m,x,p,.1,f);return o.geometry()}function Fx(s){const t=new Le,e=Mt("#8a7a62",.1,s),n=14;let i=[0,0,0];for(let c=1;c<=4;c++){const l=c/4*n,h=[.06*Math.pow(l,1.5),l,0];t.cyl(i,h,.3-c*.025,.28-c*.03,e,ct.wood,5),i=h}const r=i,a=Mt("#6E7A3E",.12,s),o=Mt("#8f9a43",.1,s);for(let c=0;c<9;c++){const l=c/9*na+s()*.3,h=5.2+s()*1.2,u=1.4+s()*.8,d=Math.cos(l),g=Math.sin(l);let m=r;for(let x=1;x<=4;x++){const p=x/4,f=[r[0]+d*h*p,r[1]+u*p-3.8*p*p,r[2]+g*h*p],v=1*Math.sin(Math.PI*Math.min(1,p*1.1))+.15,_=-g*v,M=d*v,w=x>2?o:a;t.quad(m,f,[f[0]+_,f[1]-.35*v,f[2]+M],[m[0]+_*.7,m[1]-.25*v,m[2]+M*.7],w,ct.leaf),t.quad([m[0]-_*.7,m[1]-.25*v,m[2]-M*.7],[f[0]-_,f[1]-.35*v,f[2]-M],f,m,w,ct.leaf),m=f}}return t.geometry()}function kx(s){const t=[];for(let c=0;c<4;c++){const l=c/4*na+.3;for(const h of[-1,1])t.push([Math.cos(l+h*.35)*6.2,10.2+(h>0?.4:0),Math.sin(l+h*.35)*6.2])}const e=[[2.6,6.1,.9],[2.1,6.4,-1.6],[-1.9,6.2,1.4],[-2.2,5.9,-1.1]],n=[0,1,2,3,4].map(c=>[Math.cos(c/5*na)*3.6,3.4,Math.sin(c/5*na)*3.6]),i="#56603D",r="#66704A",a="#77825A",o=Mt("#5C603F",0,s).map(c=>c*.95);return{ohia:bn(s,{stick:[.3,6.5,.1],bark:"#5A5354",crowns:[[.3,8.6,0,4.6,2.5,o],[2.2,7.7,1,3,1.8,o,ct.leaf,2]]}),ohiaKrumm:bn(s,{crowns:[[.6,2.4,.2,5,1.5,"#596537",ct.leaf,1,.75]]}),koa:bn(s,{stick:[.2,4,-.3],r0:.6,r1:.45,bark:"#5A504B",limbs:[0,2,4,6].map(c=>{const[l,h]=[t[c],t[c+1]];return[[.2,3.8,-.3],[(l[0]+h[0])/2*.9,(l[1]+h[1])/2-.6,(l[2]+h[2])/2*.9],.3,.14]}),crowns:[0,2,4,6].map((c,l)=>{const[h,u]=[t[c],t[c+1]];return[(h[0]+u[0])/2,(h[1]+u[1])/2+.3,(h[2]+u[2])/2,3,1.55,l===1?"#737B5A":"#5E6A3C",ct.leaf,l+1]})}),kukui:bn(s,{stick:[.3,4.2,.1],r0:.45,r1:.35,bark:"#5F5B54",crowns:[[.3,6.5,.1,5.8,3.2,r,ct.leaf,1,.62],[.5,8.6,.3,3.4,1.6,a,ct.leaf,5,.8],[-2.9,5.6,1.6,2.8,1.9,i,ct.leaf,2,.7]]}),ohiaai:bn(s,{stick:[0,2.4,0],r0:.35,r1:.3,bark:"#8A7458",crowns:[[0,6,0,2.4,3.6,"#3A5026"]]}),hau:bn(s,{crowns:[[0,2.2,0,5,2.2,"#6E8A3E"]]}),hala:bn(s,{stick:[.3,3.4,0],r0:.22,r1:.15,bark:"#8E8B82",limbs:[0,2].map(c=>{const[l,h]=e.slice(c,c+2);return[[.3,3.3,0],[(l[0]+h[0])/2,(l[1]+h[1])/2-.45,(l[2]+h[2])/2],.13,.09]}),crowns:e.map((c,l)=>[c[0],c[1]-.35,c[2],1.45,.75,"#55703D",ct.leaf,l+1])}),wiliwili:bn(s,{stick:[.1,2.8,.2],r0:.45,r1:.3,bark:"#9C6C44",limbs:n.map(c=>[[.05,2.5,.2],c,.2,.08]),crowns:[[0,3.9,.2,4.8,1.25,"#788C4A",ct.leaf,3,.75]]}),lama:bn(s,{stick:[.2,3.2,.1],r0:.25,r1:.18,bark:"#3E3A36",crowns:[[.2,5.4,.1,2.6,2,"#4C5E2E"]]}),aalii:bn(s,{crowns:[[0,1.2,0,1.5,1,"#6F8A4E"]]}),niu:Fx(s),milo:bn(s,{stick:[.2,2.2,0],r0:.35,r1:.28,bark:"#8A8070",crowns:[[.2,4.6,0,3.6,2.4,"#4A6426"]]})}}const mn=3,zi=[30,80],Ox=s=>Math.max(zi[0],Math.min(zi[1],s*2)),rh=24e3;function Bx(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}class Gx{constructor(t,e,n,i){const r=Bx(5150),a=kx(r);this.group=new je,this.rect=e,this.nx=Math.ceil((e.x1-e.x0)/mn),this.nz=Math.ceil((e.z1-e.z0)/mn),this.mat=da(n,i,{fade:[zi[0]-7,zi[0]]}),this.matDS=da(n,i,{fade:[zi[0]-7,zi[0]],doubleSide:!0}),this.species=[];const o=new ee,c=new Wi,l=new O(0,1,0),h=new O,u=new O;this.total=0,xs.forEach((d,g)=>{const m=t.lists[g],x=m.length/Gr,p=new Int32Array(x),f=new Int32Array(this.nx*this.nz);for(let P=0;P<x;P++){const F=Math.min(this.nx-1,Math.max(0,Math.floor((m[P*Gr]-e.x0)/mn))),I=Math.min(this.nz-1,Math.max(0,Math.floor((m[P*Gr+1]-e.z0)/mn)));p[P]=I*this.nx+F,f[p[P]]++}const v=new Int32Array(this.nx*this.nz+1);for(let P=0;P<f.length;P++)v[P+1]=v[P]+f[P];const _=v.slice(),M=new Int32Array(x);for(let P=0;P<x;P++)M[_[p[P]]++]=P;for(let P=0;P<f.length;P++)for(let F=v[P+1]-1;F>v[P];F--){const I=v[P]+Math.floor(r()*(F-v[P]+1)),z=M[F];M[F]=M[I],M[I]=z}const w=new Float32Array(x*16),S=new Float32Array(x*3),E=new Float32Array(x);for(let P=0;P<x;P++){const I=M[P]*Gr;c.setFromAxisAngle(l,m[I+3]);const z=be*m[I+4];h.set(m[I],Ui(m[I+2]),m[I+1]),u.set(z,z,z),o.compose(h,c,u),o.toArray(w,P*16),S[P*3]=m[I+5],S[P*3+1]=m[I+6],S[P*3+2]=m[I+7],E[P]=m[I+8]}const C=Math.min(x,rh),y=Go(a[d]),b=new _u(y,d==="niu"||d==="hala"?this.matDS:this.mat,Math.max(1,C));b.name=d,b.count=0,b.frustumCulled=!1,b.instanceMatrix.setUsage(ei),b.instanceColor=new Ke(new Float32Array(Math.max(1,C)*3),3),b.instanceColor.setUsage(ei);const R=new Ke(new Float32Array(Math.max(1,C)),1);R.setUsage(ei),y.setAttribute("aClear",R),this.group.add(b),this.species.push({kind:d,mesh:b,aClear:R,start:v,mats:w,cols:S,clear:E,cap:C,n:x}),this.total+=x}),this.frustum=new $i,this.pv=new ee,this.box=new _n,this.key="",this.drawn=0}update(t,e,n,i){if(this.group.visible=e>.001,!this.group.visible)return;const r=Ox(i),a=r*.42;for(const f of[this.mat,this.matDS])f.uniforms.uFadeNear.value=r*.7,f.uniforms.uFadeFar.value=r;const o=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const c=this.rect,l=[],h=Math.max(0,Math.floor((o.x-r-c.x0)/mn)),u=Math.min(this.nx-1,Math.floor((o.x+r-c.x0)/mn)),d=Math.max(0,Math.floor((o.z-r-c.z0)/mn)),g=Math.min(this.nz-1,Math.floor((o.z+r-c.z0)/mn));for(let f=d;f<=g;f++)for(let v=h;v<=u;v++){const _=c.x0+v*mn,M=c.z0+f*mn;this.box.min.set(_,-.5,M),this.box.max.set(_+mn,n,M+mn);const w=this.box.distanceToPoint(o);if(w>r||!this.frustum.intersectsBox(this.box))continue;const S=w<a?1:Math.pow(a/w,1.6);l.push(f*this.nx+v,Math.round(S*20))}const m=l.join(",");if(m===this.key)return;this.key=m;let x=0;for(const f of this.species)for(let v=0;v<l.length;v+=2)x+=Math.ceil((f.start[l[v]+1]-f.start[l[v]])*l[v+1]/20);const p=Math.min(1,rh/Math.max(1,x));this.drawn=0;for(const f of this.species){let v=0;for(let _=0;_<l.length;_+=2){const M=l[_],w=f.start[M],S=f.start[M+1]-w,E=Math.min(Math.ceil(S*l[_+1]*p/20),f.cap-v);E<=0||(f.mesh.instanceMatrix.array.set(f.mats.subarray(w*16,(w+E)*16),v*16),f.mesh.instanceColor.array.set(f.cols.subarray(w*3,(w+E)*3),v*3),f.aClear.array.set(f.clear.subarray(w,w+E),v),v+=E)}f.mesh.count=v,f.mesh.instanceMatrix.needsUpdate=!0,f.mesh.instanceColor.needsUpdate=!0,f.aClear.needsUpdate=!0,f.mesh.visible=v>0,this.drawn+=v}}dispose(){for(const t of this.species)t.mesh.geometry.dispose();this.mat.dispose(),this.matDS.dispose()}}const Hx=`
${Ie}
${Je}
${Xi}
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
`,Vx=`
${Ie}
${cr}
${Je}
${Ls}
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
`,Wx=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);class $x{constructor(t,e){this.shared=t,this.camera=e,this.group=new je,this.batches=[],this._res=new zt}add(t,{mode:e="earth",colour:n=[1,1,1],alpha:i=1,minPx:r=1,lift:a=.004,order:o=5,endFade:c=0}={}){const l=[],h=[],u=[];for(const{pts:f,width:v}of t){let _=0;for(let w=0;w+1<f.length;w++)_+=Math.hypot(f[w+1][0]-f[w][0],f[w+1][1]-f[w][1]);let M=0;for(let w=0;w+1<f.length;w++){const[S,E]=f[w],[C,y]=f[w+1],b=Math.hypot(C-S,y-E);if(b<1e-6)continue;const R=Array.isArray(v)?v[w]:v,P=Array.isArray(v)?v[w+1]:v;l.push(S,E,C,y),h.push(R,P,M,M+b),u.push(_),M+=b}}if(!l.length)return null;const d=new or;d.setAttribute("position",new Ee(Wx,3)),d.setIndex([0,2,1,1,2,3]),d.setAttribute("aSeg",new Ke(new Float32Array(l),4)),d.setAttribute("aInfo",new Ke(new Float32Array(h),4)),d.setAttribute("aEnd",new Ke(new Float32Array(u),1)),d.instanceCount=l.length/4;const g={...this.shared.uniforms,uCamPos:{value:new O},uPxK:{value:.001},uMinPx:{value:r},uLift:{value:a},uColor:{value:new Nt(...n)},uAlpha:{value:i},uMode:{value:e==="water"?0:e==="earth"?1:2},uEndFade:{value:c}},m=new we({vertexShader:Hx,fragmentShader:Vx,uniforms:g,transparent:!0,depthWrite:!1,side:An,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),x=new me(d,m);x.frustumCulled=!1,x.renderOrder=o,this.group.add(x);const p={mesh:x,uniforms:g,alpha:i,count:d.instanceCount};return this.batches.push(p),p}update(t){t.getDrawingBufferSize(this._res);const e=this.camera,n=2*Math.tan(e.fov*Math.PI/360)/Math.max(1,this._res.y/t.getPixelRatio());for(const i of this.batches)i.uniforms.uCamPos.value.copy(e.position),i.uniforms.uPxK.value=n,i.mesh.visible=i.uniforms.uAlpha.value>.003}dispose(){for(const t of this.batches)t.mesh.geometry.dispose(),t.mesh.material.dispose()}}const Zs=8,fn=16,Xx={walk:[0,4],run:[4,4],idle:[8,2],engage:[10,3]},qx=13,ia=["hawaii","oahu","maui"],jx=["bare","kihei","chief"],Lu=["spear","club","musket","rammer","linstock","gun"],Yx="hHsdetTkKCmn",Kx="gGwW",Vr={o:"#2a201b",h:"#30241e",s:"#a5704b",d:"#7b5035",e:"#2a201b",w:"#97734a",W:"#5b3d27",g:"#7d8186",G:"#4a4d52",f:"#fff4c4",F:"#f2a03c",S:"#ddd6ca",Z:"#b5ad9f"},Zx={hawaii:{m:"#b9791f",n:"#8a5717",kihei:"#d9a548",cloak:"#b03a2c",pattern:"#e3b23e",helmet:"#e3b23e",crest:"#b03a2c"},oahu:{m:"#76609e",n:"#544377",kihei:"#a58fcb",cloak:"#dcb03c",pattern:"#2e2824",helmet:"#2e2824",crest:"#dcb03c"},maui:{m:"#a84b22",n:"#7c3518",kihei:"#cf7f4c",cloak:"#a4342a",pattern:"#2e2824",helmet:"#a4342a",crest:"#2e2824"}};function Jx(s,t){const e=Zx[s],n={...Vr,m:e.m,n:e.n,t:Vr.s,T:Vr.d,k:Vr.s,K:null,C:null,H:null};return t==="kihei"?(n.k=e.kihei,n.K=e.kihei):t==="chief"&&(n.t=e.cloak,n.T=e.pattern,n.k=e.cloak,n.K=e.cloak,n.C=e.cloak,n.h=e.helmet,n.H=e.crest),n}const Qx=(s=Zs)=>Array.from({length:fn},()=>".".repeat(s));function Js(s,...t){const e=Qx(s).map(n=>n.split(""));for(const n of t)if(n)for(const[i,r]of Object.entries(n))for(let a=0;a<r.length;a++)r[a]!=="."&&(e[i][a]=r[a]);return e.map(n=>n.join(""))}function Cn(s,t=0,e=0){const n={};for(const[i,r]of Object.entries(s)){const a=Number(i)+e;a<0||a>=fn||(n[a]=t>=0?".".repeat(t)+r.slice(0,r.length-t):r.slice(-t)+".".repeat(-t))}return n}const Yt=(s,t=null,e=null)=>({body:Js(Zs,...s),over:t&&Js(Zs,t),under:e&&Js(Zs,e)}),ce={0:"..HHH...",1:"..hhh...",2:"..hse...",3:"..sss...",4:"...d...."},On=Cn(ce,1),le={5:".Kktt...",6:".Kktt...",7:".KktT...",8:".CkTt..."},Bn=Cn(le,1),tn={5:".....s..",6:".....s..",7:".....s.."},kn={5:".....s..",6:".....s.."},_i={5:"....ss..",6:"......s."},Pu={5:"....s...",6:"...ss..."},t1={1:"....s...",2:".....s..",3:".....s..",4:"....s..."},Fi={9:".Cmmn..."},Hn={...Fi,10:".Cdns...",11:"..d.s...",12:"..d.s...",13:"..d.s...",14:"..ddss.."},lr=[{...Fi,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".d...ss."},{...Fi,10:".C.dn...",11:"...ds...",12:"...ds...",13:"...dss..",14:"...dd..."},{...Fi,10:".Csnd...",11:"..s..d..",12:".s...d..",13:".s...d..",14:".s...dd."},{...Fi,10:".C.sn...",11:"...sd...",12:"...sd...",13:"...sdd..",14:"...ss..."}],Hs=Cn(Fi,1),hr=[{...Hs,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:"d.....s.",14:"......ss"},{...Hs,10:"..C.dn..",11:"...dss..",12:"...d..s.",13:"..dd....",14:"........"},{...Hs,10:"..Csnd..",11:"..s...d.",12:".s....d.",13:"s.....d.",14:"......dd"},{...Hs,10:"..C.sn..",11:"...sdd..",12:"...s..d.",13:"..ss....",14:"........"}],Rn={...Fi,10:".Cdns...",11:"..d..s..",12:".d...s..",13:".d...s..",14:".dd..ss."},Ta={...Hs,10:"..Cdns..",11:"..d...s.",12:".d....s.",13:".d.....s",14:"dd.....s"},Me=s=>s,fo=(s,t)=>{const e={};for(let n=s;n<=t;n++)e[n]="......w.";return e[s]="......W.",e},ah=(s,t,e)=>({[e]:".".repeat(s)+"w".repeat(t-s)+"W"+".".repeat(Math.max(0,7-t))}),e1=[...lr.map(s=>Yt([ce,le,tn,s],fo(0,10))),...hr.map(s=>Yt([On,Bn,Cn(tn,1),s],Me({8:"wwwwwwwW"}))),Yt([ce,le,tn,Hn],fo(0,14)),Yt([ce,le,kn,Hn],{...fo(1,14),0:".......W",1:"......w."}),Yt([ce,le,Pu,Rn],ah(0,4,6)),Yt([On,Bn,_i,Ta],ah(2,7,6)),Yt([ce,le,kn,Rn],Me({1:".......W",2:"......w.",3:"......w.",4:".....w..",5:".....w..",6:"....w...",7:"....w..."}))],n1=[...lr.map(s=>Yt([ce,le,kn,s],Me({5:"WWwwww.."}))),...hr.map(s=>Yt([On,Bn,Cn(kn,1),s],Me({1:"......WW",2:"......WW",3:"......w.",4:"......w.",5:"......w."}))),Yt([ce,le,tn,Hn],Me({7:"......w.",8:"......w.",9:"......WW",10:"......WW"})),Yt([ce,le,tn,Hn],Me({7:"......w.",8:"......w.",9:".....WW.",10:".....WW."})),Yt([ce,le,t1,Rn],null,{0:"WWwww...",1:"WW......"}),Yt([On,Bn,_i,Ta],Me({6:".......w",7:"......WW",8:"......WW"})),Yt([On,Bn,Cn(tn,1),Rn],Me({8:"......w.",9:"......w.",10:".....WW.",11:".....WW."}))],oh=s=>{const t={};for(let e=s;e<s+6;e++)t[e]="......G.";t[s]="......g.";for(let e=s+6;e<=14;e++)t[e]="......W.";return t},i1=[...lr.map(s=>Yt([ce,le,kn,s],Me({6:".....W..",7:".....WW."}),{0:".g......",1:".G......",2:".G......",3:"..G.....",4:"..G.....",5:"...G....",6:"....G..."})),...hr.map(s=>Yt([On,Bn,Cn(kn,1),s],Me({1:".......g",2:"......G.",3:"......G.",4:".....G..",5:".....W..",6:"....W...",7:"...W...."}))),Yt([ce,le,kn,Hn],oh(3)),Yt([ce,le,tn,Hn],oh(3)),Yt([ce,le,_i,Rn],Me({4:"..WWGGGg"})),Yt([ce,le,Cn(_i,-1),Rn],Me({3:".......F",4:".WWGGGgf",5:".......F"})),Yt([ce,le,kn,Rn],Me({0:"......SS",1:".....SSZ",2:"......Z.",5:".....W..",6:"......G.",7:"......G."}),{2:".......g"})],po=(s,t)=>{const e={};for(let n=s;n<=t;n++)e[n]="......w.";return e[s]=".....WW.",e},s1=[...lr.map(s=>Yt([ce,le,tn,s],po(0,10))),...hr.map(s=>Yt([On,Bn,Cn(tn,1),s],Me({7:"wwwwwwWW"}))),Yt([ce,le,tn,Hn],po(0,14)),Yt([ce,le,kn,Hn],po(1,14)),Yt([ce,le,_i,Rn],Me({6:"..wwwwWW"})),Yt([On,Bn,_i,Ta],Me({6:"...wwwwW"})),Yt([ce,le,Pu,Rn],Me({6:"wwwwwW.."}))],Wr=(s,t)=>{const e={};for(let n=s;n<=t;n++)e[n]="......w.";return e[s]="......F.",e},r1=[...lr.map(s=>Yt([ce,le,tn,s],Wr(0,10))),...hr.map(s=>Yt([On,Bn,Cn(tn,1),s],Me({4:".......F",5:"......w.",6:".....w..",7:"....w...",8:"...w...."}))),Yt([ce,le,tn,Hn],Wr(0,14)),Yt([ce,le,tn,Hn],{...Wr(1,14),0:"......f."}),Yt([ce,le,_i,Rn],Me({7:"......w.",8:"......w.",9:".......w",10:".......F"})),Yt([On,Bn,_i,Ta],Me({7:".......w",8:".......w",9:".......w",10:".......w",11:".......f"})),Yt([ce,le,kn,Rn],Wr(0,9))],Ho=16,a1={9:"....gggggggggg..",10:"..GGGGWWWGGGGG..",11:"...WWW.w.W...G..",12:"..WW.WwwwW......",13:".WW..W.w.W......",14:"WW....WWW......."},$r=(s=null,t=0)=>({body:Js(Ho,Cn(a1,t)),over:s&&Js(Ho,s),under:null}),o1=[...Array.from({length:10},()=>$r()),$r({8:"..............F.",9:"..............fF",10:"..............ff",11:"..............F."}),$r({6:"............SS..",7:"...........SSSS.",8:"..........SSSZS.",9:"...........ZSS..",10:"............Z..."},-1),$r({3:"...........SS...",4:"..........SZSS..",5:"...........ZS..."})],c1={spear:e1,club:n1,musket:i1,rammer:s1,linstock:r1,gun:o1},l1={gun:Ho};function h1(){const s=[];for(const t of ia){for(const e of["bare","kihei"])for(const n of["spear","club","musket"])s.push({kind:n,side:t,dress:e});s.push({kind:"spear",side:t,dress:"chief"})}return s.push({kind:"rammer",side:"hawaii",dress:"bare"},{kind:"linstock",side:"hawaii",dress:"kihei"},{kind:"gun",side:"hawaii",dress:"bare"}),s}const u1=200,f1=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];function d1(s,t,e,n){const i=(c,l,h)=>c&&h>=0&&h<fn&&l>=0&&l<t?c[h][l]:".",r=(c,l)=>{const h=i(s.body,c,l);return h!=="."&&n.includes(h)&&e[h]!==null},a=new Uint8Array(t*fn*4),o=(c,l,h)=>{const u=e[h];u&&a.set([...f1(u),h==="f"||h==="F"?u1:255],(l*t+c)*4)};for(let c=0;c<fn;c++)for(let l=0;l<t;l++){o(l,c,i(s.under,l,c)),!r(l,c)&&(r(l-1,c)||r(l+1,c)||r(l,c-1)||r(l,c+1))&&o(l,c,"o");const h=i(s.body,l,c);h!=="."&&e[h]!==null&&o(l,c,h),o(l,c,i(s.over,l,c))}return a}function p1(){const s=h1(),t=qx*16,e=s.length*fn,n=new Uint8Array(t*e*4),i=new Map;return s.forEach((a,o)=>{const c=l1[a.kind]||Zs,l=Jx(a.side,a.dress),h=a.kind==="gun"?Kx:Yx;c1[a.kind].forEach((u,d)=>{const g=d1(u,c,l,h);for(let m=0;m<fn;m++)n.set(g.subarray(m*c*4,(m+1)*c*4),((o*fn+m)*t+d*c)*4)}),i.set(`${a.kind}/${a.side}/${a.dress}`,{y:o*fn,w:c})}),{width:t,height:e,data:n,rows:s,cell:(a,o,c,l,h)=>{const u=i.get(`${a}/${o}/${c}`)||i.get(`${a}/${o}/bare`)||i.get(`${a}/hawaii/bare`)||i.get(`${a}/hawaii/kihei`),[d,g]=Xx[l];return[(d+h%g)*u.w,u.y,u.w,fn]},has:(a,o,c)=>i.has(`${a}/${o}/${c}`)}}const Du=`
in vec4 aFoot;   // x, the ground there (metres), z, a nudge toward the eye (world units)
in vec4 aCell;   // the frame in the sheet: x, y, w, h (sheet pixels, y down from the top)
in vec4 aDraw;   // k (screen pixels to a sprite pixel), facing times tint (+ right, - left), shown (0..1), dx (sprite pixels across the screen)
uniform vec2 uViewport;   // the target drawn into, in pixels
uniform float uPxW;       // world units a screen pixel spans, per unit of distance from the eye
// the foot projected and rounded to a pixel corner (x, y), and its depth drawn toward the eye by
// pull (as a fraction of the figure's height) and the figure's own nudge (z); w < 0 when not drawn
vec4 footPixel(vec3 foot, float pull) {
  vec4 clip = projectionMatrix * viewMatrix * vec4(foot, 1.0);
  if (aDraw.z <= 0.0 || clip.w <= 0.0) return vec4(0.0, 0.0, 0.0, -1.0);
  vec2 px = floor((clip.xy / clip.w * 0.5 + 0.5) * uViewport + 0.5);
  px.x += aDraw.w * aDraw.x;
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
`,Iu=`
float bayer4(ivec2 p) {
  int i = (p.x & 3) + 4 * (p.y & 3);
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(m[i]) + 0.5) / 16.0;
}
`,m1=`
${Ie}
${Je}
${Ls}
${Du}
uniform sampler2D uFigS;  // the district's cast shadows (its shadow map), when it is down
uniform float uHasS;
out vec2 vSp;
flat out vec4 vCell;
flat out vec3 vDraw;   // facing, tint, shown
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
`,g1=`
${Ie}
${Iu}
uniform sampler2D uSheet;
in vec2 vSp;
flat in vec4 vCell;
flat in vec3 vDraw;
flat in vec3 vLight;
void main() {
  ivec2 wh = ivec2(vCell.zw);
  ivec2 t = clamp(ivec2(floor(vSp)), ivec2(0), wh - 1);
  if (vDraw.x < 0.0) t.x = wh.x - 1 - t.x;
  vec4 c = texelFetch(uSheet, ivec2(vCell.xy) + t, 0);
  if (c.a < 0.25) discard;
  if (vDraw.z < 0.999 && bayer4(t) >= vDraw.z) discard;
  vec3 a = pow(c.rgb, vec3(2.2));
  // (a flash and a match's glow are their own light: the sheet marks them with a lower alpha)
  vec3 col = c.a < 0.9 ? a * 2.4 : a * vDraw.y * vLight;
  gl_FragColor = vec4(col, 1.0);
}
`,v1=`
${Ie}
${Je}
${Du}
out vec2 vSp;
flat out vec3 vInfo;   // w, h, shown
void main() {
  vec3 foot = footWorld();
  // (a little further than the figure, so its feet are drawn over it)
  vec4 fp = footPixel(foot, 0.42);
  if (fp.w < 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float k = aDraw.x;
  // four sprite pixels tall, centred on the line of the feet: the half under it shows below them
  vec2 corner = fp.xy + vec2((position.x - 0.5) * aCell.z * k, (position.y * 4.0 - 2.0) * k);
  gl_Position = vec4(corner / uViewport * 2.0 - 1.0, fp.z, 1.0);
  vSp = vec2(position.x * aCell.z, aCell.w + 2.0 - position.y * 4.0);
  vInfo = vec3(aCell.zw, aDraw.z);
}
`,x1=`
${Ie}
${Iu}
in vec2 vSp;
flat in vec3 vInfo;
void main() {
  // a pixel ellipse, the width of the figure less a pixel each side, on the line of its feet
  vec2 c = floor(vSp) + 0.5;
  vec2 q = (c - vec2(vInfo.x * 0.5, vInfo.y)) / vec2(vInfo.x * 0.5 - 0.5, 1.6);
  if (dot(q, q) > 1.0) discard;
  if (vInfo.z < 0.999 && bayer4(ivec2(floor(vSp))) >= vInfo.z) discard;
  gl_FragColor = vec4(vec3(0.55), 1.0);
}
`,_1=[{place:"nuuanu-pali",clear:3}],M1=6,ch=10,y1=2400,di={file:0,knot:1,pacer:2,rank:3,duel:4,piece:5,crew:6},mo=Object.fromEntries(Lu.map((s,t)=>[s,t])),go=0,w1=4,Gs=8,vo=10,b1=9,S1=20,E1=.35,lh=(8/85)**1.5;function Uu(s){return 1+3*((8/Math.max(s,.5))**1.5-lh)/(1-lh)}function hh(s,t){return Math.max(2,Math.min(Math.round(4*t),Math.round(Uu(s)*t)))}function A1(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const T1=/\bretreat|\bpursu|\bfalls? back|\bescap|\bflee(s|ing)?\b|\brout(ed|s)?\b|\bgot away|\bover the ridge|\bold path/i,R1=/\bposts?\b|ashore|encamp|in order/i;function C1(s){const t=`${s.name||""} ${s.note||""}`;return T1.test(t)?"run":R1.test(`${s.name||""}`)||/putting itself in order|encamped|organising/i.test(s.note||"")?"stand":"walk"}function Dn(s,t,e){const n=s.cum,i=s.pts;let r=1;for(;r<n.length-1&&n[r]<t;)r++;const a=i[r-1],o=i[r],c=n[r]-n[r-1]||1,l=Math.max(0,Math.min(1,(t-n[r-1])/c));return e[2]=(o[0]-a[0])/c,e[3]=(o[1]-a[1])/c,e[0]=a[0]+(o[0]-a[0])*l,e[1]=a[1]+(o[1]-a[1])*l,e}function L1(s,t,e){if(!t.length)return[0,s.total];const n=Math.max(2,Math.ceil(s.total/.05)),i=[0,0,0,0];let r=[0,0],a=-1;for(let o=0;o<=n;o++){const c=o/n*s.total;Dn(s,c,i);const l=t.every(h=>Math.hypot(i[0]-h.x,i[1]-h.z)>=e);if(l&&a<0&&(a=c),(!l||o===n)&&a>=0){const h=l?c:c-s.total/n;h-a>r[1]-r[0]&&(r=[a,h]),a=-1}}return r}function P1(s,t,e=5){const n=Array.from({length:e},()=>t());return Array.from({length:s},(i,r)=>{let a=(n[r%e]+(t()-.5)*(t()<.7?.14:1))%1;return a<0&&(a+=1),a})}class Vo{constructor(t,e,n){var v,_;this.app=t,this.recs=e,this.sheet=p1();const i=A1(1795);this.edges=[];for(const M of _1){const w=(v=t.data.places)==null?void 0:v.find(E=>E.id===M.place),S=((_=w==null?void 0:w.geometry)==null?void 0:_.type)==="Point"?w.geometry.coordinates:null;if(S){const[E,C]=t.data.proj.toWorld(S);this.edges.push({x:E,z:C,clear:M.clear,place:M.place,ux:0,uy:0,uz:0,cos:2})}}const r=e.map(()=>[]);this.fronts=[],this.pairs=[],this.guns=[];for(const M of e)M.enemy=this.enemyOf(M,e),M.stretch=L1(M,this.edges,M1);const a=e.filter(M=>M.line),o=new Set;for(const M of a)for(const w of a){if(M===w||o.has(M)||o.has(w)||M.event!==w.event||M.side===w.side||JSON.stringify(M.p.stop??M.step)!==JSON.stringify(w.p.stop??w.step))continue;const[S,E]=this.mid(M),[C,y]=this.mid(w);if(Math.hypot(S-C,E-y)>4)continue;const[b,R]=M.side==="oahu"?[w,M]:[M,w];o.add(b),o.add(R),this.planFront(b,R,r,e,i)}for(const M of e){const w=e.indexOf(M);M.line&&!o.has(M)?this.planRanks(M,null,r[w],i):M.line||this.planForce(M,r[w],i)}const c=r.reduce((M,w)=>M+w.length,0);this.count=c;const l=(M=1)=>new Float32Array(Math.max(1,c)*M),h=()=>new Uint8Array(Math.max(1,c));this.f={rec:new Uint16Array(Math.max(1,c)),mode:h(),kind:h(),side:h(),dress:h(),row:l(),cw:l(),s:l(),s0:l(),lat:l(),spd:l(),thr:l(),inAt:l(),outAt:l(),far:l(),ph:l(),tm:l(),tt:l(),st:h(),off:l(),offTo:l(),face:new Int8Array(Math.max(1,c)),grp:new Int16Array(Math.max(1,c)),role:h(),vis:l(),gm:l(),gx:l(),gz:l(),x:l(),z:l(),k:l(),tint:l(),wet:h(),fr:h(),dx:new Int8Array(Math.max(1,c)),dx0:new Int8Array(Math.max(1,c)),hid:h()};const u=this.f;let d=0;e.forEach((M,w)=>{M.o=d,M.n=r[w].length;for(const S of r[w]){const E=d++;u.rec[E]=w,u.mode[E]=di[S.mode],u.kind[E]=mo[S.kind],u.side[E]=ia.indexOf(S.side),u.dress[E]=jx.indexOf(S.dress);const C=this.sheet.cell(S.kind,S.side,S.dress,"idle",0);u.row[E]=C[1],u.cw[E]=C[2],u.s[E]=u.s0[E]=S.s??0,u.lat[E]=S.lat??0,u.spd[E]=S.spd??1,u.thr[E]=S.thr??i(),u.inAt[E]=S.inAt??-1e9,u.outAt[E]=S.outAt??1e9,u.far[E]=85+i()*25,u.ph[E]=i(),u.tm[E]=S.tm??1+i()*6,u.face[E]=S.face??1,u.grp[E]=S.grp??-1,u.dx0[E]=S.dx??0,u.role[E]=S.role??0,u.tint[E]=.9+i()*.18,u.gx[E]=1e9}}),this.marks=new Float32Array(Math.max(1,c)*4);const g=new sn(this.sheet.data,this.sheet.width,this.sheet.height,Se,ge);g.minFilter=g.magFilter=re,g.generateMipmaps=!1,g.needsUpdate=!0,this.texture=g;const m=Math.max(1,Math.min(c,y1));this.cap=m;const x=new or;x.setAttribute("position",new Ee(new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),3)),x.setIndex([0,1,2,0,2,3]);const p=M=>{const w=new Ke(new Float32Array(m*4),4);return w.setUsage(ei),x.setAttribute(M,w),w};this.aFoot=p("aFoot"),this.aCell=p("aCell"),this.aDraw=p("aDraw"),this.attrs=[this.aFoot,this.aCell,this.aDraw],x.instanceCount=0,this.geometry=x,this.range={start:0,count:0},this.own={uSheet:{value:g},uViewport:{value:new zt(1,1)},uPxW:{value:.001},uFigS:{value:null},uHasS:{value:0}};const f={...n.uniforms,...this.own};this.material=new we({vertexShader:m1,fragmentShader:g1,uniforms:f,transparent:!0,blending:ii,depthWrite:!0}),this.shadowMaterial=new we({vertexShader:v1,fragmentShader:x1,uniforms:f,transparent:!0,depthWrite:!1,blending:Ro}),this.mesh=new me(x,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=8,this.shadows=new me(x,this.shadowMaterial),this.shadows.frustumCulled=!1,this.shadows.renderOrder=7,this.group=new je,this.group.add(this.shadows,this.mesh),this.time=0,this.frame=0,this.thin=1,this.drawn=0,this._p=[0,0,0,0],this._right=new O,this._fwd=new O,this._v4=new Zt,this._size=new zt}enemyOf(t,e){let n=0,i=0,r=0;for(const a of e)if(!(a.event!==t.event||a.side===t.side))for(const[o,c]of a.pts)n+=o,i+=c,r++;return r?[n/r,i/r]:null}mid(t){return Dn(t,t.total/2,[0,0,0,0])}outfit(t,e,{chiefs:n=.03,noMusket:i=!1}={}){const r=Number.isFinite(t.p.from)?t.p.from:1795,a=ia.includes(t.side)?t.side:"oahu",o=i||r<1790?0:a==="hawaii"?.14:.06,c=e();return e()<n?{kind:"spear",dress:"chief",side:a}:{kind:c<o?"musket":c<o+.3?"club":"spear",dress:e()<.55?"kihei":"bare",side:a}}planForce(t,e,n){t.move=C1(t.p);const[i,r]=t.stretch,a=Math.max(0,r-i);if(a<.3)return;const o=/path/i.test(t.p.name||"")&&t.total<12;if(t.file=o,o&&(t.move="walk"),t.move==="stand"){const p=Math.max(3,Math.min(12,Math.round(a/2.4)));for(let f=0;f<p;f++){const v=i+(f+.5)/p*a+(n()-.5)*(a/p)*.4,_=6+Math.floor(n()*9),M=Math.max(i,Math.min(r,v));for(let w=0;w<_;w++){const S=Math.round((w-(_-1)/2)*5+(n()-.5)*4);e.push({mode:"knot",s:M,lat:(n()-.5)*.24,dx:S,...this.outfit(t,n)})}for(let w=0;w<2;w++)e.push({mode:"pacer",s:v+(n()-.5)*.8,lat:(n()-.5)*.4,spd:.4+n()*.3,...this.outfit(t,n,{chiefs:0})})}return}const c=o?2.5:t.move==="run"?4:5,l=Math.max(12,Math.min(300,Math.round(a*c))),h=o?1:3,u=o?.03:t.side==="hawaii"?.32:.26,d=P1(l,n),g=Math.min(a*.15,4),m=r<t.total-.01?Math.min(ch,a*.3):0,x=i>.01?Math.min(ch*.4,a*.2):0;for(let p=0;p<l;p++){const f=Math.floor(n()*h);e.push({mode:"file",s:i+d[p]*a,lat:h>1?((f-(h-1)/2)*.7+(n()-.5)*.5)*u:(n()-.5)*u,spd:t.move==="run"?.8+n()*.45:.85+n()*.3,inAt:i+n()*(x||g*.6),outAt:m?r-n()*m:r-g*.2-n()*g,...this.outfit(t,n)})}}planRanks(t,e,n,i,r=[]){const[a,o]=t.stretch,c=Math.max(0,o-a);if(c<.3)return;const l=this.mid(t);let h=0;e&&(h=(e[0]-l[0])*-l[3]+(e[1]-l[1])*l[2]>0?-1:1),t.back=h;const u=Math.max(24,Math.min(120,Math.round(c*11)));for(let d=0;d<u;d++){const g=a+(.04+.92*((d+i()*.9)/u))*c;if(r.some(x=>Math.abs(g-x)<.32))continue;const m=h?h*(.15+Math.pow(i(),1.2)*1.2):(i()+i()-1)*.5;n.push({mode:"rank",s:g,lat:m,...this.outfit(t,i,{chiefs:.04}),tm:1+i()*8})}n.some(d=>d.dress==="chief")||Object.assign(n[Math.floor(i()*n.length)],{kind:"spear",dress:"chief"})}planFront(t,e,n,i,r){const a=i.indexOf(t),o=i.indexOf(e),c=Number.isFinite(t.p.from)?t.p.from:1795,l=t.side==="hawaii"&&c>=1790?Math.max(1,Math.min(3,Math.round(t.total/2.5))):0,h=Array.from({length:l},(C,y)=>(y+1)/(l+1)*t.total);this.planRanks(t,this.mid(e),n[a],r,h),this.planRanks(e,this.mid(t),n[o],r);const u=24,d=[],g=[],m=[0,0,0,0];for(let C=0;C<=u;C++)Dn(t,C/u*t.total,m),d.push([m[0],m[1]]),Dn(e,C/u*e.total,m),g.push([m[0],m[1]]);Math.hypot(d[0][0]-g[0][0],d[0][1]-g[0][1])>Math.hypot(d[0][0]-g[u][0],d[0][1]-g[u][1])&&g.reverse();const x=d.map((C,y)=>[(C[0]+g[y][0])/2,(C[1]+g[y][1])/2]);let p=0,f=0;for(let C=0;C<=u;C++)p+=g[C][0]-d[C][0],f+=g[C][1]-d[C][1];const v=Math.hypot(p,f)||1,_={a:t,b:e,nx:p/v,nz:f/v,aLeft:!0,ia:a,ib:o},M=this.fronts.push(_)-1;t.front=M,e.front=M;const w=[0];for(let C=1;C<=u;C++)w.push(w[C-1]+Math.hypot(x[C][0]-x[C-1][0],x[C][1]-x[C-1][1]));const S={pts:x,cum:w,total:w[u]},E=Math.max(4,Math.min(16,Math.round(S.total*2)));for(let C=0;C<E;C++){Dn(S,(.08+.84*((C+.2+r()*.6)/E))*S.total,m);const y=(r()-.5)*.4,b=this.pairs.push({x:m[0]+_.nx*y,z:m[1]+_.nz*y,front:M,period:1.5+r()*.8,phase:r(),sway:r()*Math.PI*2,swayT:3+r()*3})-1,R=this.outfit(t,r,{noMusket:!0,chiefs:.08}),P=this.outfit(e,r,{noMusket:!0,chiefs:.08});n[a].push({mode:"duel",grp:b,role:0,...R,thr:r()*.9}),n[o].push({mode:"duel",grp:b,role:1,...P,thr:r()*.9})}for(let C=0;C<l;C++){Dn(t,h[C],m);const y=t.back||-1,b=this.guns.push({x:m[0]-m[3]*y*.05,z:m[1]+m[2]*y*.05,front:M,period:7+r()*2.5,phase:r()})-1,R=r()*.5;n[a].push({mode:"piece",kind:"gun",side:"hawaii",dress:"bare",grp:b,role:0,thr:R}),n[a].push({mode:"crew",kind:"linstock",side:"hawaii",dress:"kihei",grp:b,role:1,thr:R}),n[a].push({mode:"crew",kind:"rammer",side:"hawaii",dress:"bare",grp:b,role:2,thr:R})}}update(t,e,n){var tt,ft,xt,yt,Et,Rt,bt,Dt,G,ae;const i=this.app,r=i.camera,a=this.f,o=this.recs;this.hold&&(t=0),this.time+=t,this.frame++;const c=this.time;r.updateMatrixWorld();const l=r.matrixWorld.elements,h=this._right.set(l[0],0,l[2]).normalize(),u=this._fwd.set(-l[8],-l[9],-l[10]),d=r.position.x,g=r.position.y,m=r.position.z,x=((tt=i.pipeline)==null?void 0:tt.size)||i.renderer.getDrawingBufferSize(this._size),p=x.y/Math.max(1,innerHeight);this.dpr=p;const f=Math.tan(r.fov*Math.PI/360);this.own.uViewport.value.set(x.x,x.y),this.own.uPxW.value=2*f/Math.max(1,x.y);const v=(ft=i.districts)!=null&&ft.on?(Et=(yt=(xt=i.districts.cur)==null?void 0:xt.terrain)==null?void 0:yt.shadow)==null?void 0:Et.texture:null;this.own.uFigS.value=v||null,this.own.uHasS.value=v?1:0;const _=i.world.uniforms.uVert.value,M=i.districts,w=M!=null&&M.on?1+M.k:0,S=((bt=(Rt=M==null?void 0:M.cur)==null?void 0:Rt.parent)==null?void 0:bt.k)??0,E=((Dt=i.timeline)==null?void 0:Dt.year)??0,C=w!==this._g0||S!==this._g1||E!==this._g2;this._g0=w,this._g1=S,this._g2=E;const y=((ae=(G=i.rig)==null?void 0:G.state)==null?void 0:ae.distance)??16,b=Uu(y)*y*2*f/Math.max(1,innerHeight),R=n?.5:1,P=b1*b*R,F=S1*b*R,I=t>0?t/E1:1,z=Math.min(1,Math.max(.35,Math.pow(24/Math.max(1,y),.8)));for(const gt of this.fronts){const lt=gt.nx*h.x+gt.nz*h.z;lt>.2?gt.aLeft=!0:lt<-.2&&(gt.aLeft=!1)}for(let gt=0;gt<this.edges.length;gt++){const lt=this.edges[gt],X=Math.max(i.world.metresAt(lt.x,lt.z),0)*_,st=lt.x-d,ot=X-g,T=lt.z-m,A=Math.hypot(st,ot,T)||1;lt.ux=st/A,lt.uy=ot/A,lt.uz=T/A,lt.cos=Math.cos(Math.atan(lt.clear*1.3/A))}const N=this._p,H=this.marks,B=this.aFoot.array,q=this.aCell.array,J=this.aDraw.array;let Q=0,ut=0;const j=this.cap;for(let gt=0;gt<o.length;gt++){const lt=o[gt],X=lt.w*e;if(X<=.002&&!lt.drawnLast)continue;const st=C||!lt.drawnLast;lt.drawnLast=X>.002;const ot=lt.front!==void 0?this.fronts[lt.front]:null,T=ot?ot.a===lt:!1,A=X*this.thin*(lt.line?1:z);for(let L=lt.o;L<lt.o+lt.n;L++){const k=a.mode[L];let $=Gs,W=0,ht=0,it=0,dt=A>a.thr[L],vt=0,Ct=0,nt=a.face[L];if(k===di.file){const et=(lt.move==="run"?F:P)*a.spd[L];let U=a.s[L]+et*t;const rt=lt.stretch[0],at=lt.stretch[1];U>at&&(U=rt+(U-rt)%(at-rt)),a.s[L]=U,Dn(lt,U,N),vt=N[0]-N[3]*a.lat[L],Ct=N[1]+N[2]*a.lat[L],nt=this.faceToward(N[2],N[3],nt);const St=(lt.move==="run"?1.7:1.15)*a.spd[L]*R;a.ph[L]=(a.ph[L]+St*t)%1,$=lt.move==="run"?w1:go,W=Math.floor(a.ph[L]*4)%4,(U<a.inAt[L]||U>a.outAt[L])&&(dt=!1),a.wet[L]&&(a.lat[L]*=1-Math.min(1,t*.5))}else if(k===di.knot||k===di.pacer){let et=a.s0[L];if(k===di.pacer){a.tt[L]+=P*.6*a.spd[L]*t;const rt=a.tt[L]/(2*.7)+a.ph[L],at=2*Math.abs(rt-Math.floor(rt+.5));et=Math.max(lt.stretch[0],Math.min(lt.stretch[1],a.s0[L]+(at-.5)*2*.7));const St=rt-Math.floor(rt)<.5?1:-1;Dn(lt,et,N),nt=this.faceToward(N[2]*St,N[3]*St,nt),$=go,W=Math.floor((c*1.1*R+a.ph[L])%1*4)}else Dn(lt,et,N),lt.enemy&&(nt=this.faceToward(lt.enemy[0]-N[0],lt.enemy[1]-N[1],nt)),ht=a.dx0[L],$=Gs,W=Math.floor(c/(.9+a.tint[L])+a.ph[L]*2)&1;vt=N[0]-N[3]*a.lat[L],Ct=N[1]+N[2]*a.lat[L]}else if(k===di.rank){Dn(lt,a.s0[L],N),a.tm[L]-=t,n&&a.st[L]>=2&&(a.st[L]=0);const et=a.st[L];if(et===1){const U=P*.5*t,rt=a.offTo[L]-a.off[L];Math.abs(rt)<=U?(a.off[L]=a.offTo[L],a.st[L]=0):a.off[L]+=Math.sign(rt)*U,nt=this.faceToward(N[2]*Math.sign(rt),N[3]*Math.sign(rt),nt),$=go,W=Math.floor((c*1.15+a.ph[L])%1*4)}else if(et===2||et===3){a.tt[L]+=t;const U=a.tt[L];$=vo,et===2?W=U<.55?0:U<.67?1:2:W=2,U>(et===2?1.4:.8)&&(a.st[L]=0)}else $=Gs,W=Math.floor(c/(.9+a.tint[L])+a.ph[L]*2)&1;if(et!==1&&(ot?nt=(T?ot.aLeft:!ot.aLeft)?1:-1:lt.enemy&&(nt=this.faceToward(lt.enemy[0]-N[0],lt.enemy[1]-N[1],nt))),a.st[L]===0&&a.tm[L]<=0){const U=Math.random();a.tm[L]=3+Math.random()*7,a.kind[L]===mo.musket&&!n&&ot?(a.st[L]=2,a.tt[L]=0):U<.55?(a.st[L]=1,a.offTo[L]=(Math.random()-.5)*.5):!n&&U<.75&&(a.st[L]=3,a.tt[L]=0)}vt=N[0]-N[3]*a.lat[L]+N[2]*a.off[L],Ct=N[1]+N[2]*a.lat[L]+N[3]*a.off[L]}else if(k===di.duel){const et=this.pairs[a.grp[L]],U=this.fronts[et.front],rt=a.role[L]===0,at=.1*Math.sin(c*2*Math.PI/et.swayT+et.sway);vt=et.x+U.nx*at,Ct=et.z+U.nz*at;const St=rt===U.aLeft;nt=St?1:-1;const At=(c/et.period+et.phase)%1,ne=rt?At<.5:At>=.5,Qt=At%.5/.5,xe=Math.round(1.6*Math.sin(c*2*Math.PI/(et.swayT*1.7)+et.sway));ht=(St?-4:4)+xe,$=vo,n?(dt=!1,$=Gs,W=0):ne?W=Qt<.3?0:Qt<.55?1:2:(W=2,Qt>=.3&&Qt<.7&&(ht+=St?-1:1))}else{const et=this.guns[a.grp[L]],U=this.fronts[et.front];vt=et.x,Ct=et.z;const rt=U.aLeft?1:-1,at=n?99:(c/et.period+et.phase)%1*et.period,St=a.role[L];let At=-1;St===0?(nt=rt,At=at>=3.5&&at<3.65?0:at>=3.65&&at<4.4?1:at>=4.4&&at<5.2?2:-1):St===1?(nt=rt,ht=-11*rt,At=at>=2.6&&at<3.2?0:at>=3.2&&at<3.6?1:at>=3.6&&at<4.3?2:-1):(nt=-rt,ht=11*rt,it=.02,At=at<.9?Math.min(2,Math.floor(at/.3)):-1),At>=0?($=vo,W=At):($=Gs,W=St===0?0:Math.floor(c*(.6+.1*St)+a.ph[L])&1)}a.face[L]=nt,a.fr[L]=$+W,a.dx[L]=ht,a.x[L]=vt,a.z[L]=Ct,(st||Math.abs(vt-a.gx[L])+Math.abs(Ct-a.gz[L])>.01||(this.frame+L)%30===0)&&(a.gm[L]=i.world.metresAt(vt,Ct),a.gx[L]=vt,a.gz[L]=Ct,a.wet[L]=a.gm[L]<.15?1:0),a.wet[L]&&(dt=!1);const Jt=Math.max(a.gm[L],0)*_,Bt=(vt-d)*u.x+(Jt-g)*u.y+(Ct-m)*u.z;(Bt>a.far[L]||Bt<.05)&&(dt=!1);let It=!1,Lt=!1;for(let et=0;et<this.edges.length;et++){const U=this.edges[et];Math.abs(vt-U.x)<U.clear&&Math.abs(Ct-U.z)<U.clear&&Math.hypot(vt-U.x,Ct-U.z)<U.clear&&(It=!0);const rt=vt-d,at=Jt-g,St=Ct-m;(rt*U.ux+at*U.uy+St*U.uz)/(Math.hypot(rt,at,St)||1)>U.cos&&(Lt=!0)}a.hid[L]=It||Lt?1:0,(It||Lt)&&(dt=!1),dt&&ut++;let _t=a.vis[L];_t=dt?Math.min(1,_t+I):Math.max(0,_t-I),(It||X<=.002)&&(_t=0),a.vis[L]=_t;const kt=hh(Bt,p);a.k[L]=_t>0?kt:0;const Kt=L*4;if(H[Kt]=vt,H[Kt+1]=Ct,H[Kt+2]=_t,H[Kt+3]=a.k[L],_t<=0||Q>=j)continue;const jt=Q*4;B[jt]=vt,B[jt+1]=a.gm[L],B[jt+2]=Ct,B[jt+3]=it;const Gt=a.cw[L];q[jt]=($+W)*Gt,q[jt+1]=a.row[L],q[jt+2]=Gt,q[jt+3]=fn,J[jt]=kt,J[jt+1]=nt*a.tint[L],J[jt+2]=_t,J[jt+3]=ht,Q++}}if(ut>j?this.thin=Math.max(.1,this.thin*.92):ut<j*.85&&this.thin<1&&(this.thin=Math.min(1,this.thin*1.04)),this.drawn=Q,this.geometry.instanceCount=Q,this.group.visible=Q>0,Q>0){this.range.count=Q*4;for(let gt=0;gt<3;gt++){const lt=this.attrs[gt];lt.clearUpdateRanges(),lt.updateRanges.push(this.range),lt.needsUpdate=!0}}}faceToward(t,e,n){const i=this._right,r=Math.hypot(t,e)||1,a=(t*i.x+e*i.z)/r;return a>.15?1:a<-.15?-1:n||1}scaleAt(t){return hh(t,this.dpr||1)}screenRect(t){const e=this.f;if(e.vis[t]<=0||!e.k[t])return null;const n=this.app.camera,i=this._v4.set(e.x[t],Math.max(e.gm[t],0)*this.app.world.uniforms.uVert.value,e.z[t],1);if(i.applyMatrix4(n.matrixWorldInverse).applyMatrix4(n.projectionMatrix),i.w<=0)return null;const r=this.own.uViewport.value.x,a=this.own.uViewport.value.y,o=e.k[t],c=Math.floor((i.x/i.w*.5+.5)*r+.5)+e.dx[t]*o,l=Math.floor((i.y/i.w*.5+.5)*a+.5),h=e.cw[t]*o,u=fn*o;return{x:c-h/2,y:a-l-u,w:h,h:u,k:o,cell:[e.fr[t]*e.cw[t],e.row[t],e.cw[t],fn],facing:e.face[t],vis:e.vis[t]}}stats(){const t=this.f,e={figures:this.drawn,planned:this.count,fronts:this.fronts.length,pairs:this.pairs.length,guns:this.guns.length,sides:{},kinds:{},k:{}};for(let n=0;n<this.count;n++){if(t.vis[n]<=0)continue;const i=ia[t.side[n]],r=Lu[t.kind[n]];e.sides[i]=(e.sides[i]||0)+1,e.kinds[r]=(e.kinds[r]||0)+1,e.k[t.k[n]]=(e.k[t.k[n]]||0)+1}return e}dispose(){this.geometry.dispose(),this.material.dispose(),this.shadowMaterial.dispose(),this.texture.dispose()}}Da(Vo,"MODE",di),Da(Vo,"KIND",mo);const D1={hawaii:"#f0ae3c",oahu:"#a88fe6",maui:"#d9703f"};class I1{constructor(t,e,n,i){var r;this.app=t,this.forces=[],this.lines=[];for(const a of e){const o=a.properties||{};if(o.kind!=="force"&&o.kind!=="line"||((r=a.geometry)==null?void 0:r.type)!=="LineString")continue;const c=a.geometry.coordinates.map(d=>t.data.proj.toWorld(d)),l=[0];for(let d=1;d<c.length;d++)l.push(l[d-1]+Math.hypot(c[d][0]-c[d-1][0],c[d][1]-c[d-1][1]));const h=l.at(-1),u={p:o,pts:c,cum:l,total:h,event:o.event,step:Number.isFinite(o.step)?o.step:0,w:0,goal:0,stop:o.stop??null,line:o.kind==="line"};u.line?(u.side=o.side||(o.role==="advance"?"hawaii":"oahu"),u.batch=i.add([{pts:c,width:.75}],{mode:"band",colour:new Nt(D1[u.side]||"#ffffff").toArray(),alpha:0,minPx:6,lift:.01,order:6,endFade:1.2}),u.mid=un(a.geometry),u.stand=!0,this.lines.push(u)):u.side=o.role||"oahu",this.forces.push(u)}this.events=new Map;for(const a of this.forces){if(!a.event)continue;let o=this.events.get(a.event);o||this.events.set(a.event,o={id:a.event,from:1/0,to:-1/0,recs:[]}),o.recs.push(a),Number.isFinite(a.p.from)&&(o.from=Math.min(o.from,a.p.from)),Number.isFinite(a.p.to)&&(o.to=Math.max(o.to,a.p.to))}this.soldiers=new Vo(t,this.forces,n),this.count=this.soldiers.count,this.marks=this.soldiers.marks,this.group=this.soldiers.group,this.time=0,this.showing={event:null,steps:[],quiet:!1}}stepsAt(t,e){var h;const n=this.events.get(t.id),i=t.stops||[];if(!n||e<0||e>=i.length)return[];const r=(h=this.app.tour)==null?void 0:h.places,a=this.app.data.proj,o=[];for(const u of n.recs){if(u.p.kind!=="line"||!u.mid)continue;const[d,g]=a.toWorld(u.mid);let m=-1,x=6;i.forEach((p,f)=>{const v=r==null?void 0:r.get(p.place),_=v&&un(v.geometry);if(!_)return;const[M,w]=a.toWorld(_),S=Math.hypot(M-d,w-g);S<x&&(x=S,m=f)}),m>=0&&o.push(m-u.step)}o.sort((u,d)=>u-d);const c=o.length?o[Math.floor(o.length/2)]:0,l=new Set;for(const u of n.recs){const d=u.step+c;(d===e||e===i.length-1&&d>e)&&l.add(u.step)}return[...l].sort((u,d)=>u-d)}namedStops(t,e){if(t.stop===null||t.stop===void 0)return null;const n=[];for(const i of Array.isArray(t.stop)?t.stop:[t.stop])Number.isInteger(i)?n.push(i):typeof i=="string"&&(e.stops||[]).forEach((r,a)=>r.place===i&&n.push(a));return n}shownAt(t,e){const n=this.events.get(t.id),i=new Set;if(!n)return i;let r=null;for(const a of n.recs){const o=this.namedStops(a,t);if(o){o.includes(e)&&i.add(a);continue}r||(r=this.stepsAt(t,e)),r.includes(a.step)&&i.add(a)}return i}choose(){var i;const t=this.app.tour,e=t!=null&&t.active?t.event:null;if(e&&this.events.has(e.id)&&t.stop>=0){if(((i=this._at)==null?void 0:i.ev)!==e||this._at.stop!==t.stop){const r=this.shownAt(e,t.stop);this._at={ev:e,stop:t.stop,now:{event:e.id,recs:r,steps:[...new Set([...r].map(a=>a.step))].sort((a,o)=>a-o),quiet:!1}}}return this._at.now}this._at=null;const n=this.app.timeline.year;for(const r of this.events.values())if(n>=r.from&&n<r.to+1)return(this._quiet||(this._quiet=new Map)).get(r.id)||this._quiet.set(r.id,{event:r.id,recs:null,steps:null,quiet:!0}).get(r.id);return this._none||(this._none={event:null,recs:new Set,steps:[],quiet:!1})}update(t,e,n=0){e*=1-U1(75,140,n),this.time+=t;const i=this.choose();this.showing=i;const r=t>0?1-Math.exp(-t*2):1;for(const a of this.forces){const o=a.event===i.event&&(i.recs===null||i.recs.has(a));a.goal=o?i.quiet?.2:1:0,a.w+=(a.goal-a.w)*r,Math.abs(a.goal-a.w)<.003&&(a.w=a.goal)}for(const a of this.lines)a.batch&&(a.batch.uniforms.uAlpha.value=.26*a.w*e);this.soldiers.update(t,e,i.quiet),this.marksShown=this.soldiers.drawn}stats(){const t=this.choose(),e=n=>n.event===t.event&&(t.recs===null||t.recs.has(n));return{event:t.event,steps:t.steps,quiet:t.quiet,by:t.recs?[...new Set([...t.recs].map(n=>n.stop===null||n.stop===void 0?"inferred":"named"))].join("+")||"none":"year",forces:this.forces.filter(n=>e(n)&&!n.stand).map(n=>n.p.name),lines:this.lines.filter(e).map(n=>n.p.name),marks:this.count,marksShown:this.marksShown??0,...this.soldiers.stats()}}dispose(){this.soldiers.dispose()}}function U1(s,t,e){const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)}class N1{constructor(t,e){this.app=t;const n=document.getElementById("ui")||document.body;this.layer=document.createElement("div"),this.layer.className="dlabels",n.insertBefore(this.layer,n.querySelector(".pins")||n.firstChild),this.items=[];for(const i of e){const r=i.properties||{};if(r.kind!=="label"||!r.name)continue;const a=un(i.geometry);if(!a)continue;const[o,c]=t.data.proj.toWorld(a),l=document.createElement("div");l.className="dlabel",l.textContent=r.name,l.lang="haw",this.layer.appendChild(l),this.items.push({p:r,x:o,z:c,el:l,v:new O,shown:-1,tx:NaN,ty:NaN})}this.panels=[],this.frame=0}panelRects(){if(this.frame++%15===0){this.panels=[];for(const t of document.querySelectorAll(".card, .timeline, .legend, .tools, .brand, .inspector")){if(t.hidden||!t.offsetParent)continue;const e=t.getBoundingClientRect();e.width>0&&e.height>0&&this.panels.push(e)}}return this.panels}update(t){const e=this.app,n=e.camera,i=innerWidth,r=innerHeight,a=e.rig.state.distance,o=1-Math.max(0,Math.min(1,(a-32)/30)),c=[],l=this.panelRects(),h=e.timeline.year;for(const u of this.items){let d=t*o*(Aa(u.p,h)?1:0);if(d>.01){u.v.set(u.x,e.world.heightAt(u.x,u.z)+.05,u.z).project(n),(u.v.z>1||u.v.z<-1)&&(d=0);const m=(u.v.x+1)/2*i,x=(1-u.v.y)/2*r;(m<-80||m>i+80||x<60||x>r+20)&&(d=0);const p=u.el.offsetWidth||60;d>.01&&l.some(f=>m+p/2>f.left-4&&m-p/2<f.right+4&&x+10>f.top-4&&x-10<f.bottom+4)&&(d=0),d>.01&&c.some(f=>Math.abs(f[0]-m)<(f[2]+p)/2+6&&Math.abs(f[1]-x)<18)&&(d=0),d>.01&&c.push([m,x,p]),d>.01&&!(Math.abs(m-u.tx)<=.3&&Math.abs(x-u.ty)<=.3)&&(u.el.style.transform=`translate(${m.toFixed(1)}px, ${x.toFixed(1)}px)`,u.tx=m,u.ty=x)}const g=Math.round(d*20)/20;g!==u.shown&&(u.el.style.opacity=String(g),u.el.style.visibility=g>0?"visible":"hidden",u.shown=g)}}visible(){return this.items.filter(t=>t.shown>.5).map(t=>t.p.name)}dispose(){this.layer.remove()}}const hn=3,Nu={limewash:"#d6d0c0",cream:"#ccbf9f",paleGrey:"#b6b1a4",sage:"#959d86",ochre:"#b59967",duskRed:"#8f6152",paleBlue:"#98a5a4",shingle:"#6c665c",iron:"#6e706c",ironRed:"#7f5446",ironGreen:"#6f7a6a",coral:"#cbc1a8",adobe:"#b39b78",brick:"#97684f",stoneGrey:"#a19b90",concrete:"#c2bdb1",concreteWarm:"#c9bea6",glass:"#6a7f88",dark:"#4b4743",post:"#8a7b66",plinth:"#77706a",asphalt:"#6d6a66"},pt=Nu;function Be(s,t,e,n,i,r=0,a=0){s.box(r,-hn,a,t,n+hn,e,i,ct.stone)}function si(s,t,e,n,i,r,a,o,{alongZ:c=!1,wallMat:l=ct.plain,roofMat:h=ct.roof,x:u=0,z:d=0,oe:g=r*.6}={}){const m=c?I=>[u+I[2],I[1],d+I[0]]:I=>[u+I[0],I[1],d+I[2]],x=c?e:t,p=c?t:e,f=i/(p/2),v=n-f*r,_=x/2+g,M=p/2+r,w=m([-_,v,-M]),S=m([_,v,-M]),E=m([-_,n+i,0]),C=m([_,n+i,0]),y=m([-_,v,M]),b=m([_,v,M]),R=c?(I,z,N,H,B,q)=>s.quad(H,N,z,I,B,q):(I,z,N,H,B,q)=>s.quad(I,z,N,H,B,q),P=c?(I,z,N,H,B)=>s.tri(N,z,I,H,B):(I,z,N,H,B)=>s.tri(I,z,N,H,B);R(w,E,C,S,a,h),R(b,C,E,y,a.map(I=>I*.84),h);const F=x/2;P(m([-F,n,-p/2]),m([-F,n,p/2]),m([-F,n+i,0]),o,l),P(m([F,n,p/2]),m([F,n,-p/2]),m([F,n+i,0]),o,l)}function Hi(s,t,e,n,i,r,a,{roofMat:o=ct.roof,x:c=0,z:l=0}={}){const h=i/(e/2),u=n-h*r,d=t/2+r,g=e/2+r,m=Math.max(0,(t-e)/2),x=(v,_)=>[c+v*d,u,l+_*g],p=v=>[c+v*m,n+i,l],f=a.map(v=>v*.84);s.quad(x(-1,-1),p(-1),p(1),x(1,-1),a,o),s.quad(x(1,1),p(1),p(-1),x(-1,1),f,o),s.tri(x(-1,1),p(-1),x(-1,-1),a.map(v=>v*.92),o),s.tri(x(1,-1),p(1),x(1,1),a.map(v=>v*.92),o)}function zu(s,t,e,n,i,r=0,a=0,o=ct.roof){const c=t/2,l=[r,e+n,a],h=(u,d)=>[r+u*c,e,a+d*c];s.tri(h(-1,-1),l,h(1,-1),i,o),s.tri(h(1,1),l,h(-1,1),i.map(u=>u*.84),o),s.tri(h(-1,1),l,h(-1,-1),i.map(u=>u*.92),o),s.tri(h(1,-1),l,h(1,1),i.map(u=>u*.92),o)}function Tn(s,t,e,n,i,r,a,o,c,{posts:l=2,x:h=0}={}){const u=e/2,d=u+n;s.box(h,i-.35,(u+d)/2,t,.35,n,c,ct.wood);const g=[h-t/2-.2,r,u],m=[h+t/2+.2,r,u],x=[h+t/2+.2,a,d+.3],p=[h-t/2-.2,a,d+.3];s.quad(g,p,x,m,o,ct.roof);for(let f=0;f<l;f++){const v=h-t/2+.3+(t-.6)*f/Math.max(1,l-1);s.box(v,i,d-.2,.28,a-i,.28,c,ct.wood)}}function ur(s,t,e,n,i=0,r=0){const a=t/2+.03;s.quad([r-e/2,i,a],[r+e/2,i,a],[r+e/2,i+n,a],[r-e/2,i+n,a],Mt(pt.dark,0),ct.plain)}const z1=[[8.2,5,5.6],[7,4.6,5],[6,4.2,4.6],[5.2,4,4.4]];function F1(s,[t,e,n]){const i=new Le;return pa(i,s,t,e,n,!0,hn),i}const uh=[[[0,0,.3,0],[9.5,3.5,1.9,2],[-3.5,9,2.6,3]],[[0,0,1.2,0],[-9.5,-2.5,1,3]],[[0,0,0,1],[9,-4.5,1.6,2],[-8.5,4.5,.4,2],[3,10,1.4,3]],[[0,0,2.2,1],[.5,9.5,2,2],[9,5,.6,3]]];function k1(s,t){const e=new Le;return e.at(0,0,0,Math.PI/2,1),pa(e,s,7.2+t,4.8,5.2,!0,hn),e.done(),e.at(t?-4.5:4.5,0,-6.5,0,1),pa(e,s,4.4,3.4,3.6,!1,hn),e.done(),e}function O1(s,t){const e=new Le,n=Mt([pt.limewash,pt.cream,pt.paleGrey][t],.06,s),i=Mt(pt.shingle,.1,s),r=Mt(pt.post,.1,s);return t===0?(Be(e,9+.4,7+.4,.6,Mt(pt.plinth,.1,s)),e.box(0,.6,0,9,3,7,n,ct.clap),si(e,9,7,3.6,2.6,.5,i,n,{wallMat:ct.clap}),Tn(e,9,7,2.2,.6,3.3,2.7,i,r),ur(e,7,1.1,2.1,.6)):t===1?(Be(e,8+.4,6.5+.4,.5,Mt(pt.plinth,.1,s)),e.box(0,.5,0,8,5.8,6.5,n,ct.clap),si(e,8,6.5,6.3,2.4,.5,i,n,{wallMat:ct.clap}),Tn(e,8,6.5,2,3.4,6,5.6,i,r),Tn(e,8,6.5,2,.5,3.4,3.1,i,r)):(Be(e,10+.4,7+.4,.6,Mt(pt.plinth,.1,s)),e.box(0,.6,0,10,2.9,7,n,ct.clap),Hi(e,10,7,3.5,2.2,.6,i),Tn(e,10-1.5,7,2.3,.6,3.2,2.6,i,r,{posts:3})),e}function B1(s,t){const e=new Le;if(t===0){const r=Mt(pt.adobe,.08,s);Be(e,9+.6,6+.6,.3,Mt(pt.plinth,.1,s)),e.box(0,.3,0,9,2.8,6,r,ct.masonry),Hi(e,9,6,3.1,2.8,.7,Mt("#a58a5c",.12,s),{roofMat:ct.thatch}),ur(e,6,1.1,2,.3)}else{const r=Mt(pt.coral,.06,s);Be(e,11+.4,8+.4,.4,Mt(pt.plinth,.1,s)),e.box(0,.4,0,11,6.4,8,r,ct.masonry),Hi(e,11,8,6.8,2,.5,Mt(pt.shingle,.1,s)),Tn(e,11,8,2.2,3.6,6.4,6,Mt(pt.shingle,.1,s),Mt(pt.post,.1,s),{posts:3}),Tn(e,11,8,2.2,.4,3.6,3.2,Mt(pt.shingle,.1,s),Mt(pt.post,.1,s),{posts:3})}return e}function G1(s,t){const e=new Le,n=Mt([pt.limewash,pt.sage,pt.cream][t],.06,s),i=Mt([pt.iron,pt.ironRed,pt.ironGreen][t],.08,s),r=Mt(pt.limewash,.05,s);return Be(e,9.4,8.4,.9,Mt(pt.plinth,.1,s)),t===1?(e.box(-1.5,.9,-1,7,3.1,6,n,ct.clap),si(e,7,6,4,2.5,.5,i,n,{wallMat:ct.clap,x:-1.5,z:-1}),e.box(2.6,.9,1,4,3.1,7,n,ct.clap),si(e,4,7,4,2,.45,i,n,{wallMat:ct.clap,alongZ:!0,x:2.6,z:1}),Tn(e,4.5,4,2,.9,3.7,3.2,i,r,{x:-2.3})):(e.box(0,.9,0,9,3.1,7.5,n,ct.clap),t===0?si(e,9,7.5,4,2.7,.5,i,n,{wallMat:ct.clap}):Hi(e,9,7.5,4,2.4,.55,i),Tn(e,9,7.5,2.4,.9,3.8,3.2,i,r,{posts:3}),ur(e,7.5,1,2.2,.9)),e}function H1(s,t){const e=new Le,n=6,i=13,r=[pt.cream,pt.limewash,pt.ochre,pt.paleBlue,pt.sage,pt.duskRed],a=Mt(pt.iron,.1,s),o=Mt(pt.post,.1,s);Be(e,t*n+.4,i+.4,.3,Mt(pt.plinth,.1,s));for(let c=0;c<t;c++){const l=(c-(t-1)/2)*n,h=Mt(r[Math.floor(s()*r.length)],.08,s),u=4.2+s()*1.4;e.box(l,.3,0,n-.15,u,i,h,ct.clap);const d=[l-n/2,.3+u-.2,i/2-.6],g=[l+n/2,.3+u-.2,i/2-.6],m=[l+n/2,.3+u-1.3,-i/2-.4],x=[l-n/2,.3+u-1.3,-i/2-.4];e.quad(d,g,m,x,Mt(pt.iron,.1,s),ct.roof),e.box(l,.3+u-.2,i/2-.2,n-.15,1.6+s()*1,.35,h,ct.clap),ur(e,i,1.6,2.4,.3,l)}return Tn(e,t*n,i,2.6,.3,3.4,3.1,a,o,{posts:t+1}),e}function V1(s,t){const e=new Le,n=[2,3,3][t],i=[14,13,15][t],r=[13,14,12][t],a=.4+n*3.7,o=Mt([pt.brick,pt.stoneGrey,pt.concreteWarm][t],.07,s);return Be(e,i+.3,r+.3,.4,Mt(pt.plinth,.1,s)),e.box(0,.4,0,i,a-.4,r,o,ct.windows),e.box(0,a,0,i+.5,.45,r+.5,o.map(c=>c*.86),ct.masonry),e.box(0,a+.45,0,i,.6,r,o.map(c=>c*.95),ct.masonry),e.box(0,a+.2,0,i-1.2,.3,r-1.2,Mt(pt.asphalt,.1,s),ct.plain),t===2&&Tn(e,i,r,2.5,.4,4,3.8,Mt(pt.iron,.1,s),Mt(pt.dark,.1,s),{posts:4}),e}function W1(s,t){const e=new Le,n=Mt([pt.cream,pt.sage,pt.paleGrey][t],.07,s),i=Mt([pt.ironGreen,pt.iron,pt.ironRed][t],.1,s),r=[11,10,12][t],a=[9,9.5,8][t];return Be(e,r,a,.8,Mt(pt.plinth,.1,s)),e.box(0,.8,0,r,2.8,a,n,ct.clap),t===1?(si(e,r,a,3.6,2,.9,i,n,{wallMat:ct.clap}),Tn(e,6,a,2.6,.8,3.4,2.9,i,Mt(pt.limewash,.05,s),{x:-1.5})):(Hi(e,r+1.6,a+2.6,3.6,1.8,.9,i,{z:1.3}),e.box(0,.8,a/2+1.3,r-.4,.2,2.4,Mt(pt.post,.1,s),ct.wood)),e}function $1(s,t){const e=new Le,n=[6,8][t],i=[15,14][t],r=[14,15][t],a=n*3.6,o=Mt([pt.concreteWarm,pt.stoneGrey][t],.06,s);return Be(e,i+.3,r+.3,.3,Mt(pt.plinth,.1,s)),e.box(0,.3,0,i,4.4,r,o.map(c=>c*.9),ct.masonry),e.box(0,4.7,0,i,a-4.4,r,o,ct.windows),e.box(0,a+.3,0,i+.6,.6,r+.6,o.map(c=>c*.85),ct.masonry),e.box(-i/4,a+.9,-r/5,3.5,2.2,3.5,o.map(c=>c*.9),ct.plain),e}function X1(s,t){const e=new Le,n=Mt([pt.limewash,pt.concreteWarm,pt.paleBlue][t],.07,s),i=Mt([pt.iron,pt.shingle,pt.ironGreen][t],.1,s);if(t===2)return Be(e,9,8,.3,Mt(pt.plinth,.1,s)),e.box(0,.3,0,9,5.4,8,n,ct.plain),si(e,9,8,5.7,1.4,.6,i,n),e;const r=14,a=9;return Be(e,r,a,.3,Mt(pt.plinth,.1,s)),e.box(-1.5,.3,0,r-3,2.7,a,n,ct.plain),Hi(e,r-3,a,3,1.3,.8,i,{x:-1.5}),e.box(r/2-1.5,2.6,.5,3.2,.25,a-1,i.map(o=>o*.9),ct.plain),e.box(r/2-.1,.3,a/2-1,.25,2.3,.25,n,ct.plain),t===1&&e.box(-3.5,.3,-a/2-1.4,5,2.4,2.8,n.map(o=>o*.95),ct.plain),e}function q1(s,t){const e=new Le,n=[3,4][t],i=20,r=10,a=n*3.1,o=Mt([pt.concrete,pt.cream][t],.06,s);Be(e,i,r+2,.3,Mt(pt.plinth,.1,s)),e.box(0,.3,-.8,i,a,r-1.6,o,ct.windows);for(let c=1;c<=n;c++)e.box(0,.3+c*3.1-.3,r/2-.4,i,.3,1.6,o.map(l=>l*.9),ct.plain);return Hi(e,i,r-1.6,a+.3,1.2,.4,Mt(pt.iron,.1,s),{z:-.8}),e}const Li=60;function j1(s,t){const e=new Le,n=Mt([pt.concrete,pt.concreteWarm,pt.limewash][t],.06,s),i=n.map((r,a)=>r*.75+Mt(pt.glass,0,s)[a]*.25);return t===0?(e.box(0,-hn*3,0,32,hn*3+6,18,n.map(r=>r*.9),ct.masonry),e.box(0,6,0,30,Li-6,13,i,ct.windows),e.box(0,Li,0,30.6,1.2,13.6,n.map(r=>r*.85),ct.plain)):t===1?(e.box(0,-hn*3,0,22,hn*3+1,22,n.map(r=>r*.9),ct.masonry),e.box(0,1,0,20,Li-1,20,i,ct.windows),e.box(0,Li,0,8,3,8,n.map(r=>r*.8),ct.plain)):(e.box(0,-hn*3,0,28,hn*3+9,26,n.map(r=>r*.88),ct.windows),e.box(-2,9,-2,17,Li-9,16,i,ct.windows),e.box(-2,Li,-2,17.6,1,16.6,n.map(r=>r*.85),ct.plain)),e}function Y1(s){const t=new Le,e=Mt(pt.coral,.04,s),n=Mt(pt.shingle,.08,s),i=24,r=44;Be(t,i+1,r+1,.8,Mt(pt.plinth,.08,s)),t.box(0,.8,-2,i,9.2,r-4,e,ct.masonry),si(t,i,r-4,10,6.5,.6,n,e,{alongZ:!0,wallMat:ct.masonry,z:-2}),t.box(0,.8,r/2-4,9,22,8,e,ct.masonry),t.box(0,22.8,r/2-4,9.6,.8,8.6,e.map(a=>a*.88),ct.masonry);for(const[a,o]of[[-1,-1],[1,-1],[1,1],[-1,1]])t.box(a*4,23.6,r/2-4+o*3.5,1.2,1.4,1.2,e,ct.masonry);return ur(t,r,2.2,4,.8),t}function K1(s){const t=new Le,e=Mt(pt.limewash,.03,s),n=Mt(pt.iron,.08,s),i=13,r=24;return Be(t,i+.6,r+.6,.8,Mt(pt.plinth,.08,s)),t.box(0,.8,-1,i,6.4,r-2,e,ct.clap),si(t,i,r-2,7.2,4.6,.5,n,e,{alongZ:!0,wallMat:ct.clap,z:-1}),t.box(0,.8,r/2-1.5,4.5,14,4.5,e,ct.clap),zu(t,4.8,14.8,12,n,0,r/2-1.5),t}function Z1(s){const t=new Le,e=Mt(pt.concreteWarm,.03,s);return Be(t,14,14,.5,Mt(pt.plinth,.08,s)),t.box(0,.5,0,12,40,12,e,ct.windows),t.box(0,40.5,0,13,6,13,e.map(n=>n*.93),ct.masonry),zu(t,13,46.5,7,Mt(pt.ironGreen,.05,s)),t.cyl([0,53.5,0],[0,60,0],.25,.15,Mt(pt.dark,0),ct.plain,4),t}function J1(s,t={}){const e={},n=(i,r)=>{e[i]=r.map(a=>{const o=Go(a.geometry());o.computeBoundingBox();const c=o.boundingBox;o.dispose(),t[i]&&a.box(0,-hn,0,t[i][0],hn+.12,t[i][1],Mt(pt.concrete,.05,s).map(h=>h*.88),ct.plain);const l=Go(a.geometry());return{geometry:l,hx:Math.max(-c.min.x,c.max.x),hz:Math.max(-c.min.z,c.max.z),top:c.max.y,tris:l.index.count/3}})};return n("kauhale",z1.map(i=>F1(s,i))),n("hale",[0,1].map(i=>k1(s,i))),n("frame",[0,1,2].map(i=>O1(s,i))),n("adobe",[0,1].map(i=>B1(s,i))),n("cottage",[0,1,2].map(i=>G1(s,i))),n("store",[3,2].map(i=>H1(s,i))),n("block",[0,1,2].map(i=>V1(s,i))),n("bungalow",[0,1,2].map(i=>W1(s,i))),n("midrise",[0,1].map(i=>$1(s,i))),n("house",[0,1,2].map(i=>X1(s,i))),n("walkup",[0,1].map(i=>q1(s,i))),n("tower",[0,1,2].map(i=>j1(s,i))),n("church",[Y1(s)]),n("spire",[K1(s)]),n("clock",[Z1(s)]),e}function uc(s=2,t=5e4){const e=Math.log(1+t/s),n=new Float32Array(256);for(let i=0;i<256;i++)n[i]=s*(Math.exp(i/255*e)-1);return{lut:n,decode:i=>s*(Math.exp(i/255*e)-1),encode:i=>Math.max(0,Math.min(255,Math.round(255*Math.log(1+Math.max(0,i)/s)/e)))}}const Q1=s=>Math.max(1,Math.round(60/Math.max(1,s)));async function xo(s,t){const{arch:e}=s,n=uc(s.d0,s.dMax),i=e.W,r=e.H,a=e.rect,o=s.islands,c=new Int8Array(i*r).fill(-1),l=(a.x1-a.x0)/i,h=(a.z1-a.z0)/r;for(let x=0;x<r;x++){const p=a.z0+(x+.5)*h;for(let f=0;f<i;f++){const v=a.x0+(f+.5)*l;let _=0,M=-1;for(let w=0;w<o.length;w++){const S=o[w].rect,E=Math.min(v-S.x0,S.x1-v,p-S.z0,S.z1-p);E>_&&(_=E,M=w)}c[x*i+f]=M}}const u=new Float32Array(i*r*3),d=new Float32Array(i*r),g={kf:s.kf,arch:null,islands:[]};for(let x=0;x<o.length;x++){const p=o[x],{W:f,H:v}=p,[_,M,w]=await Promise.all(["cultivation","settlement","forest"].map(P=>t_(p.layers[P],f,v,t,`${p.id} ${P}`))),S=p.land&&p.land.length===f*v?p.land:null,E=p.rect,C=(E.x1-E.x0)/f,y=(E.z1-E.z0)/v,b=new Int32Array(f);for(let P=0;P<f;P++)b[P]=Math.floor((E.x0+(P+.5)*C-a.x0)/l);for(let P=0;P<v;P++){const F=Math.floor((E.z0+(P+.5)*y-a.z0)/h);if(F<0||F>=r)continue;const I=P*f;for(let z=0;z<f;z++){const N=b[z];if(N<0||N>=i)continue;const H=F*i+N;if(c[H]!==x)continue;const B=I+z;S&&!S[B]||(u[H*3]+=_[B],u[H*3+1]+=n.lut[M[B]],u[H*3+2]+=w[B],d[H]++)}}const R=Math.max(1,p.f||1);if(R===1){const P=new Uint8Array(f*v*4);for(let F=0;F<f*v;F++)P[F*4]=_[F],P[F*4+1]=M[F],P[F*4+2]=w[F],P[F*4+3]=255;S&&_o(P,f,v,S,2),g.islands.push({id:p.id,W:f,H:v,data:P})}else{const P=Math.max(1,Math.round(f/R)),F=Math.max(1,Math.round(v/R)),I=new Float32Array(P*F*3),z=new Float32Array(P*F),N=new Int32Array(f);for(let B=0;B<f;B++)N[B]=Math.min(P-1,Math.floor((B+.5)*P/f));for(let B=0;B<v;B++){const q=Math.min(F-1,Math.floor((B+.5)*F/v))*P;for(let J=0;J<f;J++){const Q=B*f+J;if(S&&!S[Q])continue;const ut=q+N[J];I[ut*3]+=_[Q],I[ut*3+1]+=n.lut[M[Q]],I[ut*3+2]+=w[Q],z[ut]++}}const H=fh(I,z,P*F,n);_o(H,P,F,z,2),g.islands.push({id:p.id,W:P,H:F,data:H})}}const m=fh(u,d,i*r,n);return _o(m,i,r,d,3),g.arch={W:i,H:r,data:m},g}function _o(s,t,e,n,i){let r=Uint8Array.from(n,a=>a?1:0);for(let a=0;a<i;a++){const o=r.slice();for(let c=0;c<e;c++)for(let l=0;l<t;l++){const h=c*t+l;if(r[h])continue;let u=0,d=0,g=0,m=0;const x=p=>{r[p]&&(u++,d+=s[p*4],g+=s[p*4+1],m+=s[p*4+2])};l>0&&x(h-1),l<t-1&&x(h+1),c>0&&x(h-t),c<e-1&&x(h+t),u&&(s[h*4]=Math.round(d/u),s[h*4+1]=Math.round(g/u),s[h*4+2]=Math.round(m/u),o[h]=1)}r=o}}function fh(s,t,e,n){const i=new Uint8Array(e*4);for(let r=0;r<e;r++){const a=t[r];i[r*4+3]=255,a&&(i[r*4]=Math.round(s[r*3]/a),i[r*4+1]=n.encode(s[r*3+1]/a),i[r*4+2]=Math.round(s[r*3+2]/a))}return i}async function t_(s,t,e,n,i){if(!s)return new Uint8Array(t*e);if(typeof s=="string")return Mo(await n(s),t,e,s);const[r,a]=await Promise.all([n(s.from),n(s.to)]),o=Mo(r,t,e,s.from),c=Mo(a,t,e,s.to),l=s.t,h=new Uint8Array(t*e);for(let u=0;u<t*e;u++)h[u]=Math.round(o[u]+(c[u]-o[u])*l);return h}function Mo(s,t,e,n){if(s.W!==t||s.H!==e)throw new Error(`${n} is ${s.W}×${s.H}, the pack is ${t}×${e}`);return s.px}async function Wo(s,t){const{px:e,W:n,H:i}=await s(t),r=new Uint8Array(n*i);for(let a=0,o=0;a<n*i;a++,o+=4)r[a]=e[o];return{px:r,W:n,H:i}}const dh=["cultivation","settlement","forest"],e_={cultivation:"Cultivation",settlement:"Settlement",forest:"Native forest"},Ni=[1100,1450],n_=3,Xr=.002,i_=10,ps=(s,t,e)=>Math.max(t,Math.min(e,s)),ph=(s,t,e)=>{const n=ps((e-s)/(t-s),0,1);return n*n*(3-2*n)};function s_(){const s=new sn(new Uint8Array([0,0,0,255]),1,1,Se,ge);return s.needsUpdate=!0,s}function r_(s){var n;const t=(n=s.data)==null?void 0:n.metres;if(!t)return null;const e=new Uint8Array(t.length);for(let i=0;i<t.length;i++)e[i]=t[i]>0?1:0;return e}function mh(s,t,e,n){const i=new sn(s,t,e,Se,ge);return i.minFilter=Gi,i.magFilter=De,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=qe,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class a_{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.blank=s_();const e=t.shared.uniforms;Object.assign(e,{uArchLandA:{value:this.blank},uArchLandB:{value:this.blank},uLandT:{value:0},uLandK:{value:0},uLandEarly:{value:1}}),this.uniforms=e,this.available=null,this.manifest=null,this.keyframes=[],this.resident=new Map,this.loading=new Map,this.bound=null,this.swapTo=null,this.kpShown=0,this.fade=0,this.fadeGoal=0,this.listeners=[],this.chain=Promise.resolve(),this.jobN=0,this.uploads=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){var a;const t=this.data.abs("layers/manifest.json");let e;try{const o=await fetch(t);if(!o.ok)throw new Error(`HTTP ${o.status}`);if(e=await o.json(),!Array.isArray(e==null?void 0:e.keyframes)||!e.keyframes.length||!e.islands)throw new Error("no keyframes or islands")}catch(o){this.available=!1,this.warn(`${t}: ${o.message} (no land layers)`),this.notify();return}this.manifest=e,this.keyframes=[...e.keyframes].filter(o=>Number.isFinite(o.year)).sort((o,c)=>o.year-c.year),this.kfIndex=new Map(this.keyframes.map((o,c)=>[o.id,c]));const n=((a=e.encoding)==null?void 0:a.settlement)||{};this.codec=uc(n.d0??2,n.dMax??5e4);const i=this.app.world;this.islands=i.islandPacks.filter(o=>e.islands[o.id]).map(o=>({pack:o,entry:e.islands[o.id]}));const r=i.archPack;this.arch={W:Math.max(1,Math.round(r.W/2)),H:Math.max(1,Math.round(r.H/2)),rect:r.rect},this.eraYears=this.app.timeline.eras.map(o=>this.eraYear(o)),this.available=!0,this.notify()}eraYear(t){var i,r;const e=(r=(i=this.manifest.eras)==null?void 0:i[t.id])==null?void 0:r.cultivation,n=a=>{var o;return(o=this.keyframes[this.kfIndex.get(a)])==null?void 0:o.year};return e!=null&&e.keyframe&&n(e.keyframe)!==void 0?n(e.keyframe):e!=null&&e.from&&n(e.from)!==void 0&&n(e.to)!==void 0?n(e.from)+(n(e.to)-n(e.from))*(e.t??0):t.year}kpAtYear(t){const e=this.keyframes;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}position(t=this.app.timeline.s){const e=this.eraYears;if(!(e!=null&&e.length))return 0;const n=ps(t,0,e.length-1),i=Math.min(e.length-2,Math.floor(n));return i<0?this.kpAtYear(e[0]):this.kpAtYear(e[i]+(e[i+1]-e[i])*(n-i))}bracket(t){const e=this.keyframes.length,n=o=>this.keyframes[o].id;if(e<2)return{a:n(0),b:n(0),t:0,need:[n(0)]};const i=ps(Math.floor(t),0,e-2),r=ps(t-i,0,1),a=r<Xr?[n(i)]:r>1-Xr?[n(i+1)]:[n(i),n(i+1)];return{a:n(i),b:n(i+1),t:r,need:a}}covers(t,e){return t?e>=this.kfIndex.get(t.a)-Xr&&e<=this.kfIndex.get(t.b)+Xr:!1}clampTo(t,e){return ps(e,this.kfIndex.get(t.a),this.kfIndex.get(t.b))}job(t){var o;const e=this.keyframes,n=this.kfIndex.get(t),i=c=>this.data.abs(`layers/${c}`),r=(c,l)=>{const h=g=>{var m,x,p;return(p=(x=(m=c.layers)==null?void 0:m[e[g].id])==null?void 0:x[l])==null?void 0:p.file};if(h(n))return i(h(n));let u=n-1;for(;u>=0&&!h(u);)u--;let d=n+1;for(;d<e.length&&!h(d);)d++;return u>=0&&d<e.length?{from:i(h(u)),to:i(h(d)),t:(e[n].year-e[u].year)/(e[d].year-e[u].year)}:u>=0?i(h(u)):d<e.length?i(h(d)):null},a=((o=this.manifest.encoding)==null?void 0:o.settlement)||{};return{kf:t,d0:a.d0??2,dMax:a.dMax??5e4,arch:this.arch,islands:this.islands.map(({pack:c,entry:l})=>({id:c.id,W:c.W,H:c.H,f:Q1(Math.max(c.mx,c.mz)),rect:c.rect,land:r_(c),layers:Object.fromEntries(dh.map(h=>[h,r(l,h)]))}))}}request(t){const e=this.chain=this.chain.catch(()=>{}).then(()=>{if(!this.wanted(t))return null;const n=performance.now();return this.run(this.job(t)).then(i=>{this.arrive(i),this.lastBakeMs=Math.round(performance.now()-n)})}).catch(n=>this.warn(`land layers ${t}: ${n.message}`)).finally(()=>{this.loading.delete(t)});return this.loading.set(t,e),e}wanted(t){var n,i;const e=this.bracket(this.position());return this.bound&&this.app.view!=="land"?!1:e.need.includes(t)||((n=this.swapTo)==null?void 0:n.a)===t||((i=this.swapTo)==null?void 0:i.b)===t}run(t){const e=n=>Wo(vi,n);if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("layers-worker-OijIdfIP.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=n=>this.reply(n.data),this.worker.onerror=n=>{var r;(r=n.preventDefault)==null||r.call(n),this.fallback=!0;const i=this.pending;this.pending=null,i&&xo(i.job,e).then(i.resolve,i.reject)}}catch{this.fallback=!0}return this.fallback?xo(t,e):new Promise((n,i)=>{const r=++this.jobN;this.pending={id:r,job:t,resolve:n,reject:i},this.worker.postMessage({...t,job:r})})}reply(t){const e=this.pending;!e||t.job!==e.id||(this.pending=null,t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,xo(e.job,n=>Wo(vi,n)).then(e.resolve,e.reject)):e.reject(new Error(t.message)))}arrive(t){const e=Math.min(4,this.app.renderer.capabilities.getMaxAnisotropy()),n={id:t.kf,arch:mh(t.arch.data,t.arch.W,t.arch.H,e),archData:t.arch.data,islands:new Map(t.islands.map(i=>[i.id,mh(i.data,i.W,i.H,e)])),texels:t.arch.W*t.arch.H+t.islands.reduce((i,r)=>i+r.W*r.H,0),used:performance.now()};this.resident.set(t.kf,n),this.uploads.push(n.arch,...n.islands.values())}dropUnused(){var n,i,r,a;const t=performance.now(),e=new Set([(n=this.bound)==null?void 0:n.a,(i=this.bound)==null?void 0:i.b,(r=this.swapTo)==null?void 0:r.a,(a=this.swapTo)==null?void 0:a.b,...this.bracket(this.position()).need]);for(const[o,c]of this.resident){if(e.has(o)){c.used=t;continue}if(this.resident.size>n_||t-c.used>i_*1e3){c.arch.dispose();for(const l of c.islands.values())l.dispose();this.resident.delete(o),this.uploads=this.uploads.filter(l=>l!==c.arch&&![...c.islands.values()].includes(l))}}}resolve(t){const e=this.resident.has(t.a)?t.a:t.b;return{a:e,b:this.resident.has(t.b)?t.b:e}}bind(t){const{a:e,b:n}=this.resolve(t);this.bound={a:e,b:n};const i=this.resident.get(e),r=this.resident.get(n),a=this.uniforms;a.uArchLandA.value=i.arch,a.uArchLandB.value=r.arch;for(const o of this.app.world.islands)this.attach(o);this.notify()}attach(t){const e=t.uniforms;if(!e.uOwnLandA)return;const n=this.bound&&this.resident.get(this.bound.a),i=this.bound&&this.resident.get(this.bound.b);e.uOwnLandA.value=(n==null?void 0:n.islands.get(t.pack.id))||this.blank,e.uOwnLandB.value=(i==null?void 0:i.islands.get(t.pack.id))||this.blank}update(t,e){const n=this.uniforms;if(n.uLandEarly.value=ph(Ni[0],Ni[1],this.app.timeline.year),!this.available){n.uLandK.value=0;return}const i=this.position(),r=this.bracket(i);if(this.app.view==="land"||e>.001||!this.bound)for(const l of r.need)!this.resident.has(l)&&!this.loading.has(l)&&this.request(l);const o=r.need.every(l=>this.resident.has(l));if(o&&!this.swapTo&&!this.covers(this.bound,i)&&(!this.bound||this.fade<.02?(this.bind(r),this.kpShown=this.clampTo(this.bound,i)):this.covers(this.resolve(r),this.kpShown)?this.bind(r):this.swapTo=r),this.swapTo?(this.fadeGoal=0,this.fade<.02&&(this.bind(o?r:this.swapTo),this.swapTo=null,this.kpShown=this.clampTo(this.bound,i))):this.fadeGoal=this.bound?1:0,this.bound){const l=this.clampTo(this.bound,i);this.kpShown+=(l-this.kpShown)*(1-Math.exp(-t*8)),Math.abs(l-this.kpShown)<1e-4&&(this.kpShown=l)}this.fade+=(this.fadeGoal-this.fade)*(1-Math.exp(-t*6)),Math.abs(this.fadeGoal-this.fade)<.003&&(this.fade=this.fadeGoal),this.apply(e),this.dropUnused();const c=this.uploads.shift();c!=null&&c.image.data&&this.app.renderer.initTexture(c)}apply(t){const e=this.uniforms;if(this.bound){const n=this.kfIndex.get(this.bound.a),i=this.kfIndex.get(this.bound.b);e.uLandT.value=i>n?ps((this.kpShown-n)/(i-n),0,1):0}e.uLandK.value=t*this.fade}settle(t){if(!this.available)return;const e=this.position(),n=this.bracket(e);n.need.every(i=>this.resident.has(i))&&!this.covers(this.bound,e)&&this.bind(n),this.swapTo=null,this.bound&&(this.kpShown=this.clampTo(this.bound,e)),this.fade=this.fadeGoal=this.bound?1:0,this.uniforms.uLandEarly.value=ph(Ni[0],Ni[1],this.app.timeline.year),this.apply(t)}get ready(){return!!this.available&&this.covers(this.bound,this.position())&&!this.swapTo&&this.fade>.99}describe(){if(!this.available)return null;const{a:t,b:e,need:n}=this.bracket(this.position()),i=this.keyframes,r=(l,h)=>{var m,x,p,f,v,_,M,w,S,E;const u=this.kfIndex.get(l),d=(p=(x=(m=this.manifest.methods)==null?void 0:m[l])==null?void 0:x[h])==null?void 0:p.method;if(d||(f=i[u].layers)!=null&&f.includes(h))return d?[d]:[];const g=[];for(let C=u-1;C>=0;C--){const y=(M=(_=(v=this.manifest.methods)==null?void 0:v[i[C].id])==null?void 0:_[h])==null?void 0:M.method;if(y){g.push(y);break}}for(let C=u+1;C<i.length;C++){const y=(E=(S=(w=this.manifest.methods)==null?void 0:w[i[C].id])==null?void 0:S[h])==null?void 0:E.method;if(y){g.push(y);break}}return g},a=dh.map(l=>{const h=n.flatMap(d=>r(d,l)),u=h.includes("modelled")?"modelled":h.includes("mixed")?"partly modelled":"";return{id:l,name:e_[l],note:u}}),o=l=>i[this.kfIndex.get(l)].year;return{years:n.length>1?[o(t),o(e)]:[o(n[0])],layers:a,early:this.app.timeline.year<Ni[1]}}valuesAt(t,e){if(!this.bound)return null;const n=this.resident.get(this.bound.a),i=this.resident.get(this.bound.b);if(!n||!i)return null;const{W:r,H:a,rect:o}=this.arch,c=Math.floor((t-o.x0)/(o.x1-o.x0)*r),l=Math.floor((e-o.z0)/(o.z1-o.z0)*a);if(c<0||l<0||c>=r||l>=a)return null;const h=(l*r+c)*4,u=this.uniforms.uLandT.value,d=g=>n.archData[h+g]+(i.archData[h+g]-n.archData[h+g])*u;return{cultivation:d(0)/255,people:this.codec.decode(d(1)),forest:d(2)/255}}stats(){let t=0,e=0;for(const n of this.resident.values())t+=n.texels,e+=n.archData.byteLength;return{available:this.available,resident:[...this.resident.keys()],bound:this.bound?`${this.bound.a}/${this.bound.b}`:null,t:+this.uniforms.uLandT.value.toFixed(3),k:+this.uniforms.uLandK.value.toFixed(3),gpuMB:+(t*4*4/3/1048576).toFixed(1),cpuMB:+(e/1048576).toFixed(1),bakeMs:this.lastBakeMs??null}}dispose(){var t;for(const e of this.resident.values()){e.arch.dispose();for(const n of e.islands.values())n.dispose()}this.resident.clear(),(t=this.worker)==null||t.terminate()}}const te=(s,t,e)=>Math.max(t,Math.min(e,s)),Pn=(s,t,e)=>{const n=te((e-s)/(t-s),0,1);return n*n*(3-2*n)},Qs=.36,tr=.4,Fu=.14,ku=.14,Kn=4*Qs+Fu,pi=2*tr+ku,Fe=5,gh=8/(Kn*pi)*100,qr=be*1.4,ke=be*1.25,Zn={kauhale:{sh:qr,sv:qr,relief:2.5,loose:!0},hale:{sh:qr,sv:qr,relief:3,jitter:.35},frame:{sh:ke,sv:ke,relief:3,jitter:.3},adobe:{sh:ke,sv:ke,relief:3,jitter:.3},cottage:{sh:ke,sv:ke,relief:3.5},store:{sh:ke,sv:ke,relief:3},block:{sh:ke,sv:ke,relief:3},bungalow:{sh:ke*.92,sv:ke*.92,relief:4},midrise:{sh:be,sv:be*.8,relief:4},house:{sh:ke*.9,sv:ke*.9,relief:6},walkup:{sh:be*.75,sv:be*.75,relief:5},tower:{sh:be*.48,sv:be*.58,relief:6},church:{sh:be*.85,sv:be*.85,relief:3},spire:{sh:ke*.9,sv:ke*.9,relief:3},clock:{sh:be*.7,sv:be*.7,relief:3}},mi=Object.keys(Zn),o_=Object.fromEntries(["walkup","tower"].map(s=>[s,[Qs*.96/Zn[s].sh,tr*.96/Zn[s].sh]])),ie=Object.fromEntries(mi.map((s,t)=>[s,t])),c_=8e3,vh=8e3,gn=3,l_=s=>te(s*2.6,40,110),h_=4,u_=[1100,1200,1300,1400,1450,1600,1700],jr=.6,xh=2.5,Yr=1e5,f_=232,d_=1936,p_=1800,m_=[1850,1875,1900,1930,1960,2e3],g_=.1,v_=1,x_=(()=>{let s=[[0]];for(let t=0;t<3;t++){const e=s.length,n=Array.from({length:2*e},()=>new Array(2*e));for(let i=0;i<e;i++)for(let r=0;r<e;r++){const a=4*s[i][r];n[i][r]=a,n[i][r+e]=a+2,n[i+e][r]=a+3,n[i+e][r+e]=a+1}s=n}return s})();function yo(s,t,e){const n=Math.floor(s),i=Math.floor(t),r=s-n,a=t-i,o=r*r*(3-2*r),c=a*a*(3-2*a),l=pe(n,i,e),h=pe(n+1,i,e),u=pe(n,i+1,e),d=pe(n+1,i+1,e);return l+(h-l)*o+(u-l+(l-h+d-u)*o)*c}function _h(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}class __{constructor(t,e,n,i,r){this.app=t,this.districts=e,this.rec=n,this.own=i,this.ribbons=r,this.group=new je,this.group.name="settlements",this.group.visible=!1,this.ready=!1,this.failed=null,this.yearNow=t.timeline.year,i.uYearNow.value=this.yearNow,this.drawn=0,this.streamLines=n.data.streams,this.load().catch(a=>{this.failed=a.message,t.warn(`settlements: ${a.message} (the scatter is not drawn)`)})}async load(){var E,C;const t=performance.now(),e=this.app.data,n=await fetch(e.abs("layers/manifest.json"));if(!n.ok)throw new Error(`layers/manifest.json: HTTP ${n.status}`);const i=await n.json(),r=this.rec.d,a=(E=i.islands)==null?void 0:E[r.parent],o=this.app.world.islandPacks.find(y=>y.id===r.parent);if(!a||!o)throw new Error(`no settlement layer for ${r.parent}`);const c=[...i.keyframes||[]].filter(y=>Number.isFinite(y.year)).sort((y,b)=>y.year-b.year),l=c.map(y=>{var b,R,P;return(P=(R=(b=a.layers)==null?void 0:b[y.id])==null?void 0:R.settlement)==null?void 0:P.file});if(c.length<2||l.some(y=>!y))throw new Error("the settlement layer lacks a keyframe");const h=((C=i.encoding)==null?void 0:C.settlement)||{};this.codec=uc(h.d0??2,h.dMax??5e4),this.L=Math.log(1+(h.dMax??5e4)/(h.d0??2)),this.d0=h.d0??2,this.keyframes=c,this.manifest=i;const u=await Promise.all(l.map(y=>Wo(vi,e.abs(`layers/${y}`))));for(const[y,b]of u.entries())if(b.W!==o.W||b.H!==o.H)throw new Error(`${l[y]} is ${b.W}×${b.H}, the pack ${o.W}×${o.H}`);const d=o.rect,g=r.rect,m=(d.x1-d.x0)/o.W,x=(d.z1-d.z0)/o.H,p=te(Math.floor((g.x0-d.x0)/m)-2,0,o.W-1),f=te(Math.ceil((g.x1-d.x0)/m)+2,0,o.W-1),v=te(Math.floor((g.z0-d.z0)/x)-2,0,o.H-1),_=te(Math.ceil((g.z1-d.z0)/x)+2,0,o.H-1),M=f-p+1,w=_-v+1;this.crop={x0:d.x0+p*m,z0:d.z0+v*x,sx:m,sz:x,w:M,h:w},this.bytes=u.map(y=>{const b=new Float32Array(M*w);for(let R=0;R<w;R++)for(let P=0;P<M;P++)b[R*M+P]=y.px[(v+R)*o.W+p+P];return b}),this.townTerm(),this.eraYears=this.app.timeline.eras.map(y=>this.eraYear(y)),this.manifest=null,this.loadMs=Math.round(performance.now()-t);const S=performance.now();await this.build()&&(this.buildMs=Math.round(performance.now()-S),this.ready=!0)}async breathe(t=!1){return(t||performance.now()-this.slice>24)&&(await new Promise(e=>setTimeout(e,0)),this.slice=performance.now()),!this.disposed}townTerm(){const t=this.manifest,e=this.keyframes,n=this.rec.d.parent,i=this.app.world.islandPacks.find(a=>a.id===n),r=this.app.data.proj;this.towns=[],e.forEach((a,o)=>{var p,f,v,_;const c=(f=(p=t.methods)==null?void 0:p[a.id])==null?void 0:f.settlement;if(a.year<p_||!c||(v=c.towns)!=null&&v.length)return;const l=e.slice(o+1).find(M=>{var w,S,E,C;return(C=(E=(S=(w=t.methods)==null?void 0:w[M.id])==null?void 0:S.settlement)==null?void 0:E.towns)==null?void 0:C.length}),h=(_=c.populations)==null?void 0:_[n];if(!l||!Number.isFinite(h))return;const u=t.methods[l.id].settlement.towns.filter(M=>{const[w,S]=r.toWorld([M.lon,M.lat]);return w>i.rect.x0&&w<i.rect.x1&&S>i.rect.z0&&S<i.rect.z1});if(!u.length)return;const d=Math.min(.9,u.reduce((M,w)=>M+(w.share||0),0)),{codec:g}=this,m=this.crop,x=this.bytes[o];for(let M=0;M<m.h;M++)for(let w=0;w<m.w;w++){const S=m.x0+(w+.5)*m.sx,E=m.z0+(M+.5)*m.sz;let C=g.decode(x[M*m.w+w])*(1-d);for(const y of u){const[b,R]=r.toWorld([y.lon,y.lat]),P=(y.sigma||1500)/1e3,F=((S-b)**2+(E-R)**2)/100;C+=h*(y.share||0)/(2*Math.PI*P*P)*Math.exp(-F/(2*P*P))}x[M*m.w+w]=255*Math.log(1+Math.max(0,C)/this.d0)/this.L}this.towns.push({keyframe:a.id,from:l.id,towns:u.map(M=>M.name),people:Math.round(h*d)})})}eraYear(t){var i,r;const e=(r=(i=this.manifest.eras)==null?void 0:i[t.id])==null?void 0:r.settlement,n=a=>{var o;return(o=this.keyframes.find(c=>c.id===a))==null?void 0:o.year};return e!=null&&e.keyframe&&n(e.keyframe)!==void 0?n(e.keyframe):e!=null&&e.from&&n(e.from)!==void 0&&n(e.to)!==void 0?n(e.from)+(n(e.to)-n(e.from))*(e.t??0):t.year}kpAt(t){const e=this.app.timeline,n=this.eraYears,i=this.keyframes;let r=t;if(n.length>1){const a=te(e.sAtYear(t),0,n.length-1),o=Math.min(n.length-2,Math.floor(a));r=n[o]+(n[o+1]-n[o])*(a-o)}if(r<=i[0].year)return 0;for(let a=0;a+1<i.length;a++)if(r<=i[a+1].year)return a+(r-i[a].year)/(i[a+1].year-i[a].year);return i.length-1}bytesAt(t,e,n){const i=this.crop,r=te((t-i.x0)/i.sx-.5,0,i.w-1.001),a=te((e-i.z0)/i.sz-.5,0,i.h-1.001),o=r|0,c=a|0,l=r-o,h=a-c,u=c*i.w+o,d=(yo(t/1.7,e/1.7,71)-.5)*26+(yo(t/.55,e/.55,72)-.5)*12;for(let g=0;g<this.bytes.length;g++){const m=this.bytes[g],x=m[u]+(m[u+1]-m[u])*l,p=m[u+i.w]+(m[u+i.w+1]-m[u+i.w])*l,f=x+(p-x)*h;n[g]=f>.5?f+d:0}return n}people(t){return t<=0?0:this.lut&&t<256?this.lut[Math.round(t*8)]:this.d0*(Math.exp(t/255*this.L)-1)}patchState(t){var o;const e=this.rec,n=e.raise.map(c=>({k:t<c.until?1:0,depth:c.depth})),i=((o=e.pmap)==null?void 0:o.groups)||[0],r=new Float32Array(16),a=new Float32Array(16).fill(-1);for(let c=0;c<i.length;c++){const l=i[c]||0;let h=-1;e.lower.forEach((u,d)=>{l&1<<d&&(h<0&&(h=d),t<u.until&&r[c]<1&&(r[c]=1,a[c]=u.depth))}),!r[c]&&h>=0&&(a[c]=e.lower[h].depth)}return{raise:n,gk:r,gd:a}}groundAt(t,e,n){const i=this.rec,r=i.d.W,a=e*r+t;let o=i.metres[a];const c=this.districts.patchAt(t,e);if(c&&c[1]+c[3]>0){const h=n.raise[c[2]&15],u=n.raise[c[2]>>4];h&&(o+=(Math.max(o,h.depth)-o)*(c[1]/255)*h.k),u&&(o+=(Math.max(o,u.depth)-o)*(c[3]/255)*u.k)}const l=i.aux[a*4];if(l){const h=c?c[0]:0;o=lc(o,l,n.gk[h],Ea(i.carve[a*2]),n.gd[h])}return o}texelOf(t,e){const n=this.rec.d,i=n.rect;return[te(Math.floor((t-i.x0)/(i.x1-i.x0)*n.W),0,n.W-1),te(Math.floor((e-i.z0)/(i.z1-i.z0)*n.H),0,n.H-1)]}allows(t,e,n,i,r,a,o){const c=this.epochs[o],l=this.rec,h=l.aux,u=l.d.W,d=Math.cos(r),g=-Math.sin(r),m=[d,g],x=[-g,d];let p=1/0,f=-1/0,v=-1/0;this.dep=!1;for(let _=0;_<13;_++){const M=_===0?0:_<5?[-1,1,1,-1][_-1]:_<9?[0,1,0,-1][_-5]:[-1,1,1,-1][_-9],w=_===0?0:_<5?[-1,-1,1,1][_-1]:_<9?[-1,0,1,0][_-5]:[-1,-1,1,1][_-9],S=_>=9?1.25:1,E=t+(m[0]*M*n+x[0]*w*i)*S,C=e+(m[1]*M*n+x[1]*w*i)*S,[y,b]=this.texelOf(E,C),R=b*u+y,P=h[R*4+3];if(P>0&&h[R*4+1]>0&&(this.dep=!0,c.features.has(P)))return null;if(_>=9)continue;if(this.streamNear(E,C))return null;(h[R*4]||this.districts.patchAt(y,b))&&(this.dep=!0);const F=this.groundAt(y,b,c.state);if(F<.6)return null;const I=l.metres[R];p=Math.min(p,I),f=Math.max(f,I),v=Math.max(v,F)}if(f-p>a)return null;for(const _ of this.landmarks)if(!(Math.hypot(t-_.x,e-_.z)>=_.r+Math.max(n,i))&&(this.dep=!0,c.year>=_.from))return null;return v}grounds(){const e=this.rec.d,n=e.rect,i=4,r=Math.ceil(e.W/i),a=Math.ceil(e.H/i),o=this.patchState(1800),c=new Uint8Array(r*a);for(let w=0;w<a;w++)for(let S=0;S<r;S++)c[w*r+S]=this.groundAt(Math.min(e.W-1,S*i+2),Math.min(e.H-1,w*i+2),o)<=0?1:0;const l=e.mx*i,h=e.mz*i,u=vn(r,a,w=>c[w]===1,l,h);this.sea={w:r,h:a,k:i,a:Float32Array.from(u)};const d=In(Float32Array.from(u,w=>Math.min(w,3e3)),r,a,12,3);this.broad={w:r,h:a,a:d};const g=2,m=Math.ceil(e.W/g),x=Math.ceil(e.H/g),p=new Uint8Array(m*x),f=this.streamLines,v=w=>te(Math.floor((w-n.x0)/(n.x1-n.x0)*m),0,m-1),_=w=>te(Math.floor((w-n.z0)/(n.z1-n.z0)*x),0,x-1);for(let w=0;f&&w<f.length;){const S=f[w++];for(let E=0;E<S;E++,w+=3){if(E+1>=S)continue;const[C,y,b,R]=[f[w],f[w+1],f[w+3],f[w+4]],P=Math.max(1,Math.ceil(Math.hypot(b-C,R-y)/.05));for(let F=0;F<=P;F++)p[_(y+(R-y)*F/P)*m+v(C+(b-C)*F/P)]=1}}const M=vn(m,x,w=>p[w]===1,e.mx*g,e.mz*g);this.stream={w:m,h:x,a:Float32Array.from(M)},this.streamLines=null}coarse(t,e,n){const i=this.rec.d.rect,r=te(Math.floor((e-i.x0)/(i.x1-i.x0)*t.w),0,t.w-1),a=te(Math.floor((n-i.z0)/(i.z1-i.z0)*t.h),0,t.h-1);return t.a[a*t.w+r]}streamNear(t,e){return this.coarse(this.stream,t,e)<9}mauka(t,e){const n=this.broad,i=this.rec.d.rect,r=(t-i.x0)/(i.x1-i.x0)*n.w,a=(e-i.z0)/(i.z1-i.z0)*n.h,o=(m,x)=>n.a[te(x,0,n.h-1)*n.w+te(m,0,n.w-1)],c=Math.round(r),l=Math.round(a),h=10,u=o(c+h,l)-o(c-h,l),d=o(c,l+h)-o(c,l-h);if(Math.hypot(u,d)<.001)return Math.PI/2;const g=Math.PI/60;return Math.round(Math.atan2(d,u)/g)*g}weight(t,e){const[n,i]=this.texelOf(t,e),r=this.rec.d,a=this.rec.metres,o=(h,u)=>a[te(u,0,r.H-1)*r.W+te(h,0,r.W-1)],c=Math.hypot((o(n+2,i)-o(n-2,i))/(4*r.mx),(o(n,i+2)-o(n,i-2))/(4*r.mz));return(.55+.8*Math.max(Math.exp(-this.coarse(this.sea,t,e)/700),Math.exp(-this.coarse(this.stream,t,e)/160)))*(1-.6*Pn(.08,.35,c))}years(){const t=this.rec,e=this.app.timeline,n=e.yearAt(0),i=e.yearAt(e.max),r=new Set;for(const h of[...t.raise,...t.lower])h.until>n&&h.until<=i&&r.add(h.until);for(const[,h]of t.d.byIndex){const[u,d]=hc(h.properties);Number.isFinite(u)&&u>n&&u<=i&&r.add(u),Number.isFinite(d)&&d+1>n&&d+1<=i&&r.add(d+1)}for(const h of this.landmarks)h.from>n&&h.from<=i&&r.add(h.from);const a=this.keyframes[0].year,o=new Set([n,...u_.filter(h=>h>n&&h<a),...r]);for(let h=a;h<=i;h+=h_)o.add(h);o.add(i),this.Ys=[...o].filter(h=>h>=n&&h<=i).sort((h,u)=>h-u),this.isBreak=this.Ys.map(h=>r.has(h));const c=[...r].sort((h,u)=>h-u);this.epochs=[];const l=h=>{let u=0;for(;u<c.length&&h>=c[u];)u++;return u};for(let h=0;h<=c.length;h++){const u=h===0?n:c[h-1],d=new Set;for(const[g,m]of t.d.byIndex)Aa(m.properties,u)&&d.add(g);this.epochs.push({year:u,state:this.patchState(u),features:d})}this.epochAt=this.Ys.map(l),this.epochOfYear=l,this.samples=this.Ys.map(h=>{const u=this.kpAt(h),d=Math.min(this.keyframes.length-2,Math.floor(u)),g=[1820,1860,1900,1960].map(x=>Pn(x-10,x+10,h)),m=[1-g[0],g[0]-g[1],g[1]-g[2],g[2]-g[3],g[3]];return{y:h,a:d,t:u-d,early:25.5*(1-Pn(Ni[0],Ni[1],h)),w:m}}),this.lut=new Float32Array(256*8+1);for(let h=0;h<=256*8;h++)this.lut[h]=this.d0*(Math.exp(h/8/255*this.L)-1)}fill(t,e){const n=Math.min(.08333333333333333,e/(8*gh)),i=t.w;let r=i[0]*n;return i[1]&&(r+=i[1]*Math.min(.8,.8*(e/700)**2)),i[2]&&(r+=i[2]*Math.min(.9,.9*(e/1300)**2.5)),i[3]&&(r+=i[3]*Math.min(.9,.9*(e/2500)**1.5)),i[4]&&(r+=i[4]*(e<6e3?Math.min(.85,.85*(e/6e3)**1.2):.85-.45*Pn(6e3,15e3,e))),[r,n]}fillMax(t){return Math.max(Math.min(1/12,t/(8*gh)),Math.min(.8,.8*(t/700)**2),Math.min(.9,.9*(t/1300)**2.5),Math.min(.9,.9*(t/2500)**1.5),Math.min(.85,.85*(t/6e3)**1.2))}kindAt(t,e,n,i){const r=te(Math.log10(Math.max(1,e)/300),-1,1),a=t-n.lag*(1-.6*Math.max(0,r));if(t<1818||a<1820)return i?ie.kauhale:ie.hale;const o=1-Pn(1820,1880,a+12*r);return a<1860?n.r2<o?ie.hale:n.r3<.3+.25*Math.max(0,r)?ie.adobe:ie.frame:a<1900?e>1150&&n.r3<.3?ie.block:e>700&&n.r3<.55?ie.store:n.r2<o?ie.hale:n.r4<.2?ie.frame:ie.cottage:a<1960?e>4e3&&n.r3<.5?ie.midrise:e>1800&&n.r3<.6?ie.block:e>900&&n.r3<.4&&a<1935?ie.store:ie.bungalow:n.core?ie.tower:e>2e4?n.r3<.85?ie.tower:ie.walkup:e>1e4?n.r3<.2+.5*Pn(1e4,2e4,e)?ie.tower:ie.walkup:e>4e3?n.r3<.45?ie.walkup:ie.house:e>2500&&n.r3<.2?ie.walkup:n.r4<.35&&a<1990?ie.bungalow:ie.house}towerHeight(t){return 35+115*Pn(4,4.7,Math.log10(Math.max(1,t)))}async build(){const n=this.rec.d.rect,i=_h(1820);this.times={},this.slice=performance.now();let r=performance.now(),a=0;const o=g=>{this.times[g]=Math.round(a+performance.now()-r),a=0,r=performance.now()},c=async()=>{const g=performance.now(),m=await this.breathe();return performance.now()-g>1&&(a+=g-r,r=performance.now()),m};if(this.kits=J1(i,o_),o("kits"),this.grounds(),o("grounds"),!await c())return!1;const l=[],h=Math.ceil((n.x1-n.x0)/Fe),u=Math.ceil((n.z1-n.z0)/Fe),d=new Float32Array(this.keyframes.length);for(let g=0;g<u;g++){if(!await c())return!1;for(let m=0;m<h;m++){const x=n.x0+m*Fe,p=n.z0+g*Fe,f=this.mauka(x+Fe/2,p+Fe/2),v=[Math.cos(f),Math.sin(f)],_=[-v[1],v[0]];let M=1/0,w=-1/0,S=1/0,E=-1/0;for(const[y,b]of[[x,p],[x+Fe,p],[x,p+Fe],[x+Fe,p+Fe]]){const R=y*_[0]+b*_[1],P=y*v[0]+b*v[1];M=Math.min(M,R),w=Math.max(w,R),S=Math.min(S,P),E=Math.max(E,P)}const C=.2;for(let y=Math.floor(S/pi)-1;y<=Math.ceil(E/pi);y++)for(let b=Math.floor(M/Kn)-1;b<=Math.ceil(w/Kn);b++)for(let R=0;R<2;R++)for(let P=0;P<4;P++){const F=b*Kn+Fu/2+(P+.5)*Qs,I=y*pi+ku/2+(R+.5)*tr,z=F*_[0]+I*v[0],N=F*_[1]+I*v[1];if(z<x+C||z>=x+Fe-C||N<p+C||N>=p+Fe-C||z<n.x0+.4||z>n.x1-.4||N<n.z0+.4||N>n.z1-.4)continue;const H=b*4+P,B=y*2+R,q=g*h+m,J=(x_[B&7][H&7]+pe(H,B,q*7+1))/64;this.bytesAt(z,N,d);let Q=0;for(const xt of d)Q=Math.max(Q,xt);const ut=this.fillMax(this.people(Q));if(J>=ut*1.5)continue;const j=this.weight(z,N)*(.85+.3*yo(z/2.3,N/2.3,73));if(J>=ut*j)continue;const tt=xt=>pe(H,B,q*7+xt),ft=R===0?[-v[0],-v[1]]:v;l.push({x:z,z:N,rank:J,w:j,b:Float32Array.from(d),face:Math.atan2(ft[0],ft[1]),tile:q,bu:b,bv:y,u:F,v:I,e:_,m:v,lag:25*tt(2),r2:tt(3),r3:tt(4),r4:tt(5),r5:tt(6),r6:tt(7),r7:tt(8)})}}}return this.lotCount=l.length,this.gridTiles={nx:h,nz:u},o("lots"),this.landmarks=[],this.years(),this.placeLandmarks(l),this.landmarks.length&&this.years(),o("landmarks"),!await this.scatter(l,c)||(o("scatter"),this.meshes(),o("meshes"),!await this.streets(c))?!1:(o("streets"),this.instances=null,this.clearing(),!0)}placeLandmarks(t){const e=new Map((this.app.data.places||[]).map(p=>[p.id,p])),n=this.app.data.proj,i=this.keyframes,r=p=>i.findIndex(f=>f.year>=p),a=(p,f,v,_,M,w)=>{const S=this.kits[p][0],E=Zn[p],C=this.epochOfYear(M),y=this.allows(f,v,S.hx*E.sh,S.hz*E.sh,_,E.relief+2,C);return y===null?!1:(this.landmarks.push({kind:p,name:w,x:f,z:v,face:_,from:M,r:Math.hypot(S.hx,S.hz)*E.sh,top:y}),!0)},o=(p,f)=>{let v=null,_=1/0;for(const M of t){const w=Math.hypot(M.x-p,M.z-f);w<_&&(_=w,v=M)}return v},c=(p,f)=>this.people(p.b[f]),l=Math.max(0,r(1853)),h=Math.max(0,r(1896)),u=e.get("kawaiahao");let d=!1;if(u){const[p,f]=n.toWorld(un(u.geometry)),v=o(p,f);d=a("church",p,f,v?v.face:0,1842,"Kawaiahaʻo")}if(!d){const p=this.crop,f=this.bytes[l];let v=-1,_=0,M=0;for(let S=0;S<p.h;S++)for(let E=0;E<p.w;E++)f[S*p.w+E]<=v||(v=f[S*p.w+E],_=p.x0+(E+.5)*p.sx,M=p.z0+(S+.5)*p.sz);const w=[...t].sort((S,E)=>Math.hypot(S.x-_,S.z-M)-Math.hypot(E.x-_,E.z-M));for(const S of w.slice(0,200))if(d=a("church",S.x,S.z,S.face,1842,"Kawaiahaʻo"))break}const g=[...t].sort((p,f)=>c(f,h)-c(p,h));let m=0;for(const p of g){if(m>=2)break;if(this.landmarks.some(v=>Math.hypot(v.x-p.x,v.z-p.z)<9))continue;let f=null;for(const v of this.samples){if(v.y<1840)continue;const _=p.b[v.a]+(p.b[v.a+1]-p.b[v.a])*v.t;if(this.people(_)>500){f=v.y;break}}f!==null&&a(f<1860?"church":"spire",p.x,p.z,p.face,f,null)&&m++}const x=e.get("aloha-tower");if(x){const[p,f]=n.toWorld(un(x.geometry)),v=o(p,f);a("clock",p,f,v?v.face:0,1926,x.name)}}async scatter(t,e){const n=this.Ys.length,i=this.samples,r=new Float64Array(n);for(let o=0;o<t.length;o++){if(o%512===0&&!await e())return!1;const c=t[o];for(let l=0;l<n;l++){const h=i[l],u=c.b[h.a]+(c.b[h.a+1]-c.b[h.a])*h.t-h.early;if(u<=0)continue;const[d]=this.fill(h,this.people(u));c.rank<d*c.w&&r[l]++}}this.cap=Array.from(r,o=>Math.min(1,c_/Math.max(1,o)));const a=[];for(let o=0;o<t.length;o++){if(o%256===0&&!await e())return!1;const c=t[o],l=new Map;let h=null;const u=d=>{const g=this.instance(c,h,d);Array.isArray(g)?a.push(...g):a.push(g),h=null};c.core=!1;for(let d=0;d<n;d++){const g=i[d];let m=null,x=c.b[g.a]+(c.b[g.a+1]-c.b[g.a])*g.t-g.early;const p=c.core&&g.y>=1960;if(p&&(x=Math.max(x,f_+14*c.r6)),x>0){const f=this.people(x),[v,_]=this.fill(g,f),M=this.cap[d];if(p||c.rank<v*c.w*M){const w=this.kindAt(g.y,f,c,c.rank<_*c.w*M),S=w===ie.kauhale?uh.length:this.kits[mi[w]].length,E=Math.min(S-1,Math.floor(pe(c.tile,w,Math.floor(c.rank*1e6))*S)),C=this.epochAt[d],y=w*16+E;let b=l.get(y*256+255);if(b===void 0&&(b=l.get(y*256+C)),b===void 0){const R=this.pose(c,w,E),P=Zn[mi[w]].relief;if(R.parts){b=[];let F=!1;for(const I of R.parts){const z=this.allows(I.x,I.z,I.ax,I.az,I.a,P,C);if(F||(F=this.dep),z===null){b=null;break}b.push(z)}this.dep=F}else b=this.allows(R.x,R.z,R.ax,R.az,R.a,P,C);l.set(y*256+(this.dep?C:255),b)}b!==null&&(m={key:y,kind:w,variant:E,top:b,d:f}),m&&w===ie.midrise&&g.y<=d_&&(c.core=!0)}}if(h&&m&&m.key===h.key){h.d=Math.max(h.d,m.d);continue}h&&u(d),m&&(h={...m,n0:d})}h&&u(n)}for(const o of this.landmarks){const c=this.Ys.findIndex(l=>l>=o.from);a.push(this.instance({x:o.x,z:o.z,face:o.face,landmark:!0,r5:.5,r6:.5,r7:.5},{kind:ie[o.kind],variant:0,top:o.top,d:0,n0:Math.max(0,c)},n))}return this.instances=a,!0}pose(t,e,n){const i=mi[e],r=Zn[i];let a=t.x,o=t.z,c=t.face;if(r.loose){a+=(t.r5-.5)*Qs*.9*t.e[0]+(t.r6-.5)*tr*.8*t.m[0],o+=(t.r5-.5)*Qs*.9*t.e[1]+(t.r6-.5)*tr*.8*t.m[1],c=t.r7*Math.PI*2;const h=Math.cos(c),u=Math.sin(c),d=uh[n].map(([g,m,x,p])=>{const f=this.kits[i][p];return{x:a+(g*h+m*u)*r.sh,z:o+(-g*u+m*h)*r.sh,a:c+x,size:p,ax:f.hx*r.sh,az:f.hz*r.sh}});return{x:a,z:o,a:c,parts:d}}const l=this.kits[i][n];return r.jitter&&(c+=(t.r5-.5)*r.jitter,a+=(t.r6-.5)*.06,o+=(t.r7-.5)*.06),{x:a,z:o,a:c,ax:l.hx*r.sh,az:l.hz*r.sh}}instance(t,e,n){const i=this.Ys,r=i.length,a=mi[e.kind],o=Zn[a],c=t.landmark?{x:t.x,z:t.z,a:t.face}:this.pose(t,e.kind,e.variant),l=new Float32Array(4),h=m=>i[m-1]+pe(t.tile??0,m,Math.floor((t.rank??0)*1e6))*(i[m]-i[m-1]);if(e.n0===0)l[0]=-Yr,l[1]=-Yr+1;else if(this.isBreak[e.n0]||t.landmark)l[0]=i[e.n0],l[1]=i[e.n0]+xh;else{const m=h(e.n0);l[0]=Math.max(m-jr,i[e.n0-1]),l[1]=m+jr}if(n>=r)l[2]=Yr,l[3]=Yr+1;else if(this.isBreak[n])l[2]=i[n]-xh,l[3]=i[n]-.01;else{const m=h(n);l[2]=m-jr,l[3]=Math.min(m+jr,i[n])}const u=a==="tower"?this.towerHeight(e.d)/Li:1,d=.94+.12*(t.r5??.5),g=(m,x,p)=>{const f=this.kits[a][x];return{kind:e.kind,variant:x,site:this.sites,x:m.x,z:m.z,a:m.a,y:Ui(p),sh:o.sh,sv:o.sv*u,stretch:u,span:l,colour:[d*(.98+.04*(t.r6??.5)),d,d*(.98+.04*(t.r7??.5))],rx:f.hx*o.sh*.95,rz:f.hz*o.sh*.95,landmark:!!t.landmark}};return this.sites=(this.sites||0)+1,c.parts?c.parts.map((m,x)=>g(m,m.size,e.top[x])):g(c,e.variant,e.top)}weightAt(t,e){const n=this.spans;return Pn(n[t*4],n[t*4+1],e)*(1-Pn(n[t*4+2],n[t*4+3],e))}meshes(){const t=this.rec.d.rect;this.material=da(this.app.shared,this.own,{fade:[50,70],grow:!0}),this.variants=[];const e=new Map;for(const m of mi)this.kits[m].forEach((x,p)=>{e.set(ie[m]*16+p,this.variants.length),this.variants.push({name:m,v:p,kit:x,n:0})});const n=this.instances.length;this.N=n,this.vOf=new Uint16Array(n),this.mats=new Float32Array(n*16),this.spans=new Float32Array(n*4),this.stretches=new Float32Array(n),this.cols=new Float32Array(n*3),this.ix=new Float32Array(n),this.iz=new Float32Array(n),this.ia=new Float32Array(n),this.iy=new Float32Array(n),this.irx=new Float32Array(n),this.irz=new Float32Array(n),this.isv=new Float32Array(n),this.ikind=new Uint8Array(n),this.ivar=new Uint8Array(n),this.isite=new Int32Array(n),this.iland=new Uint8Array(n);const i=new ee,r=new Wi,a=new O(0,1,0),o=new O,c=new O;this.instances.forEach((m,x)=>{const p=e.get(m.kind*16+m.variant);this.vOf[x]=p,this.variants[p].n++,r.setFromAxisAngle(a,m.a),o.set(m.x,m.y,m.z),c.set(m.sh,m.sv,m.sh),i.compose(o,r,c),i.toArray(this.mats,x*16),this.spans.set(m.span,x*4),this.stretches[x]=m.stretch,this.cols.set(m.colour,x*3),this.ix[x]=m.x,this.iz[x]=m.z,this.ia[x]=m.a,this.iy[x]=m.y,this.irx[x]=m.rx,this.irz[x]=m.rz,this.isv[x]=m.sv,this.ikind[x]=m.kind,this.ivar[x]=m.variant,this.isite[x]=m.site,this.iland[x]=m.landmark?1:0});for(const m of this.variants){const x=Math.max(1,Math.min(m.n,vh)),p=m.kit.geometry,f=new _u(p,this.material,x);f.name=`${m.name}-${m.v}`,f.count=0,f.visible=!1,f.frustumCulled=!1,f.instanceMatrix.setUsage(ei),f.instanceColor=new Ke(new Float32Array(x*3),3),f.instanceColor.setUsage(ei);const v=new Ke(new Float32Array(x*4),4);v.setUsage(ei);const _=new Ke(new Float32Array(x),1);_.setUsage(ei),p.setAttribute("aSpan",v),p.setAttribute("aStretch",_),Object.assign(m,{mesh:f,cap:x,aSpan:v,aStretch:_}),this.group.add(f)}const l=_h(1842);this.tnx=Math.ceil((t.x1-t.x0)/gn),this.tnz=Math.ceil((t.z1-t.z0)/gn);const h=this.tnx*this.tnz,u=new Int32Array(n),d=new Int32Array(h);this.instances.forEach((m,x)=>{const p=te(Math.floor((m.x-t.x0)/gn),0,this.tnx-1),f=te(Math.floor((m.z-t.z0)/gn),0,this.tnz-1);u[x]=f*this.tnx+p,d[u[x]]++}),this.tStart=new Int32Array(h+1);for(let m=0;m<h;m++)this.tStart[m+1]=this.tStart[m]+d[m];const g=this.tStart.slice();this.tOrder=new Int32Array(n);for(let m=0;m<n;m++)this.tOrder[g[u[m]]++]=m;for(let m=0;m<h;m++)for(let x=this.tStart[m+1]-1;x>this.tStart[m];x--){const p=this.tStart[m]+Math.floor(l()*(x-this.tStart[m]+1)),f=this.tOrder[x];this.tOrder[x]=this.tOrder[p],this.tOrder[p]=f}this.always=[];for(let m=0;m<n;m++)this.iland[m]&&this.always.push(m);this.frustum=new $i,this.pv=new ee,this.box=new _n,this.key="",this.yearDrawn=NaN}aliveNear(t,e){const n=this.spans;return n[t*4]<e+1&&n[t*4+3]>e-1}refresh(t,e,n){const i=this.yearNow,r=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const a=this.rec.d.rect,o=e*.7,c=[],l=Math.max(0,Math.floor((r.x-e-a.x0)/gn)),h=Math.min(this.tnx-1,Math.floor((r.x+e-a.x0)/gn)),u=Math.max(0,Math.floor((r.z-e-a.z0)/gn)),d=Math.min(this.tnz-1,Math.floor((r.z+e-a.z0)/gn));for(let v=u;v<=d;v++)for(let _=l;_<=h;_++){const M=v*this.tnx+_;if(this.tStart[M+1]===this.tStart[M])continue;const w=a.x0+_*gn,S=a.z0+v*gn;this.box.min.set(w,-.5,S),this.box.max.set(w+gn,n,S+gn);const E=this.box.distanceToPoint(r);if(E>e||!this.frustum.intersectsBox(this.box))continue;const C=E<o?1:o/E;c.push(M,Math.round(C*20))}const g=c.join(",");if(g===this.key&&Math.abs(i-this.yearDrawn)<.5)return;this.key=g,this.yearDrawn=i;let m=0;const x=[];for(let v=0;v<c.length;v+=2){const _=this.tStart[c[v]],M=this.tStart[c[v]+1];let w=0;for(let S=_;S<M;S++)this.aliveNear(this.tOrder[S],i)&&w++;x.push(w),m+=Math.ceil(w*c[v+1]/20)}const p=Math.min(1,(vh-this.always.length)/Math.max(1,m));for(const v of this.variants)v.c=0;const f=v=>{const _=this.variants[this.vOf[v]];if(_.c>=_.cap)return;const M=_.c++;_.mesh.instanceMatrix.array.set(this.mats.subarray(v*16,v*16+16),M*16),_.mesh.instanceColor.array.set(this.cols.subarray(v*3,v*3+3),M*3),_.aSpan.array.set(this.spans.subarray(v*4,v*4+4),M*4),_.aStretch.array[M]=this.stretches[v]};for(let v=0;v<c.length;v+=2){const _=Math.ceil(x[v/2]*c[v+1]*p/20);let M=0;for(let w=this.tStart[c[v]];w<this.tStart[c[v]+1]&&M<_;w++){const S=this.tOrder[w];this.iland[S]||!this.aliveNear(S,i)||(f(S),M++)}}for(const v of this.always)this.aliveNear(v,i)&&f(v);this.drawn=0;for(const v of this.variants)v.mesh.count=v.c,v.mesh.visible=v.c>0,v.mesh.instanceMatrix.needsUpdate=!0,v.mesh.instanceColor.needsUpdate=!0,v.aSpan.needsUpdate=!0,v.aStretch.needsUpdate=!0,this.drawn+=v.c}async streets(t){const e=this.app.timeline,n=e.yearAt(e.max);this.streetBatches=[];for(const i of m_){if(!await t())return!1;const r=Math.min(i,n),a=this.epochOfYear(r),o=this.epochs[a],c=new Map;for(let v=0;v<this.N;v++){if(Zn[mi[this.ikind[v]]].loose||this.iland[v]||this.weightAt(v,r)<.5)continue;const M={x:this.ix[v],z:this.iz[v]},w=te(Math.floor((M.x-this.rec.d.rect.x0)/Fe),0,this.gridTiles.nx-1),S=te(Math.floor((M.z-this.rec.d.rect.z0)/Fe),0,this.gridTiles.nz-1),E=this.mauka(this.rec.d.rect.x0+(w+.5)*Fe,this.rec.d.rect.z0+(S+.5)*Fe),C=[Math.cos(E),Math.sin(E)],y=[-C[1],C[0]],b=M.x*y[0]+M.z*y[1],R=M.x*C[0]+M.z*C[1],P=Math.floor(b/Kn),F=Math.floor(R/pi),I=`${S*this.gridTiles.nx+w}:${P}:${F}`,z=c.get(I)||{th:E,bu:P,bv:F,n:0};z.n++,c.set(I,z)}const l=new Map;for(const v of c.values()){if(v.n<2)continue;const _=[Math.cos(v.th),Math.sin(v.th)],M=[-_[1],_[0]],w=(b,R)=>[b*M[0]+R*_[0],b*M[1]+R*_[1]],S=v.bu*Kn,E=S+Kn,C=v.bv*pi,y=C+pi;for(const[b,R,P]of[[`${v.th}:v${v.bv}:${v.bu}`,w(S,C),w(E,C)],[`${v.th}:v${v.bv+1}:${v.bu}`,w(S,y),w(E,y)],[`${v.th}:u${v.bu}:${v.bv}`,w(S,C),w(S,y)],[`${v.th}:u${v.bu+1}:${v.bv}`,w(E,C),w(E,y)]])l.set(b,[R,P])}const h=(v,_,M)=>{const w=Math.max(1,Math.ceil(Math.hypot(_[0]-v[0],_[1]-v[1])/M)),S=[];for(let E=0;E<=w;E++){const C=v[0]+(_[0]-v[0])*E/w,y=v[1]+(_[1]-v[1])*E/w,[b,R]=this.texelOf(C,y),P=R*this.rec.d.W+b,F=this.rec.aux[P*4+3];if(this.groundAt(b,R,o.state)<.4||F>0&&this.rec.aux[P*4+1]>0&&o.features.has(F))return null;S.push([C,y])}return S},u=[];for(const[v,_]of l.values()){const M=h(v,_,.4);M&&u.push({pts:M,width:g_})}const d=[],g=i<1870?1/0:i<1950?5:4;for(const v of c.values()){if(v.n<g)continue;const _=[Math.cos(v.th),Math.sin(v.th)],M=[-_[1],_[0]],w=(v.bv+.5)*pi,S=C=>[C*M[0]+w*_[0],C*M[1]+w*_[1]],E=h(S(v.bu*Kn+.32),S((v.bu+1)*Kn-.32),.3);E&&d.push({pts:E,width:v_})}const m=new Nt(i<1910?"#9a8668":i<1950?"#8a8277":Nu.asphalt).toArray(),x=new Nt(i<1910?"#a38f6f":i<1950?"#a09888":"#a9a59c").toArray(),p=this.ribbons.add(u,{mode:"earth",colour:m,alpha:0,minPx:.7,lift:.004,order:4}),f=this.ribbons.add(d,{mode:"earth",colour:x,alpha:0,minPx:0,lift:.003,order:3});this.streetBatches.push({year:i,batch:p,padBatch:f,n:u.length,pads:d.length})}return!0}streetWeights(t){const e=this.streetBatches;return e.map((n,i)=>{const r=i>0?e[i-1].year:n.year-15,a=i+1<e.length?e[i+1].year:1/0;return t<=n.year?i===0?Pn(r,n.year,t):te((t-r)/(n.year-r),0,1):a===1/0?1:te((a-t)/(a-n.year),0,1)})}clearing(){this.clearN=512,this.clearData=new Uint8Array(512*512);const e=new sn(this.clearData,512,512,Vi,ge);e.minFilter=e.magFilter=re,e.needsUpdate=!0,this.clearTex=e,this.own.uTownClear.value=e,this.yearCleared=NaN}stampClearing(t){const e=this.clearN,n=this.clearData;n.fill(0);const i=this.rec.d.rect,r=e/(i.x1-i.x0),a=e/(i.z1-i.z0);for(let o=0;o<this.N;o++){const c=this.weightAt(o,t);if(c<.02)continue;const l=Math.round(255*c),h=this.ix[o],u=this.iz[o],d=Math.abs(Math.cos(this.ia[o])),g=Math.abs(Math.sin(this.ia[o])),m=this.irx[o]*d+this.irz[o]*g,x=this.irx[o]*g+this.irz[o]*d,p=te(Math.floor((h-m-i.x0)*r),0,e-1),f=te(Math.floor((h+m-i.x0)*r),0,e-1),v=te(Math.floor((u-x-i.z0)*a),0,e-1),_=te(Math.floor((u+x-i.z0)*a),0,e-1);for(let M=v;M<=_;M++)for(let w=p;w<=f;w++)n[M*e+w]<l&&(n[M*e+w]=l)}this.clearTex.needsUpdate=!0,this.yearCleared=t}update(t,e,n){var c;const i=this.app.timeline.year;if(t>0?(this.yearNow+=(i-this.yearNow)*(1-Math.exp(-t*2.2)),Math.abs(i-this.yearNow)<.05&&(this.yearNow=i)):this.yearNow=i,this.own.uYearNow.value=this.yearNow,!this.ready)return;this.hidden&&(e=0),this.group.visible=e>.001;const r=this.streetWeights(this.yearNow);if(this.streetBatches.forEach((l,h)=>{l.batch&&(l.batch.uniforms.uAlpha.value=.5*r[h]*e),l.padBatch&&(l.padBatch.uniforms.uAlpha.value=(l.year<1910?.3:l.year<1950?.45:.6)*r[h]*e)}),!this.group.visible)return;const a=l_(n);this.material.uniforms.uFadeNear.value=a*.75,this.material.uniforms.uFadeFar.value=a;const o=(((c=this.rec.data)==null?void 0:c.hi)??1e3)*this.app.world.uniforms.uVert.value+3;this.refresh(this.app.camera,a,o),Math.abs(this.yearNow-this.yearCleared)<.5||this.stampClearing(this.yearNow)}alive(t=this.yearNow){if(!this.ready)return[];const e=[];for(let n=0;n<this.N;n++){if(this.weightAt(n,t)<.999)continue;const i=mi[this.ikind[n]],r=this.kits[i][this.ivar[n]],a=Zn[i];e.push({i:n,site:this.isite[n],kind:i,x:this.ix[n],z:this.iz[n],a:this.ia[n],ax:r.hx*a.sh,az:r.hz*a.sh,y:this.iy[n],height:r.top*this.isv[n],landmark:!!this.iland[n]})}return e}census(t=this.yearNow,e=null,n=null,i=1/0){const r={},a=new Set;let o=0;for(const c of this.alive(t))e!==null&&Math.hypot(c.x-e,c.z-n)>i||(c.kind==="kauhale"&&o++,c.kind==="hale"&&(o+=2),!a.has(c.site)&&(a.add(c.site),r[c.kind]=(r[c.kind]||0)+1));return{by:r,total:Object.values(r).reduce((c,l)=>c+l,0),hale:o}}stats(){if(!this.ready)return{ready:!1,failed:this.failed};const t=this.Ys.findIndex(i=>i>=this.yearNow);let e=this.clearData.byteLength+this.bytes.reduce((i,r)=>i+r.byteLength,0)+this.sea.a.byteLength+this.stream.a.byteLength+this.broad.a.byteLength;for(const i of[this.mats,this.spans,this.cols,this.stretches,this.vOf,this.ix,this.iz,this.ia,this.iy,this.irx,this.irz,this.isv,this.ikind,this.ivar,this.isite,this.iland,this.tOrder,this.tStart])e+=i.byteLength;const n=this.census(this.yearNow);return{ready:!0,year:+this.yearNow.toFixed(1),lots:this.lotCount,instances:this.N,placed:n.total,drawn:this.drawn,by:n.by,hale:n.hale,landmarks:this.landmarks.map(i=>`${i.name||i.kind} ${i.from}`),towns:this.towns,cap:+(this.cap[Math.max(0,t)]??1).toFixed(2),streets:this.streetBatches.map(i=>{var r;return`${i.year}:${i.n}/${i.pads}:${(((r=i.batch)==null?void 0:r.uniforms.uAlpha.value)??0).toFixed(2)}`}),triangles:this.variants.reduce((i,r)=>i+r.mesh.count*r.kit.tris,0),loadMs:this.loadMs,buildMs:this.buildMs,times:this.times,cpuMB:+(e/1048576).toFixed(1)}}dispose(){var t,e;this.disposed=!0;for(const n of this.variants||[])n.mesh.dispose(),n.kit.geometry.dispose();(t=this.material)==null||t.dispose(),(e=this.clearTex)==null||e.dispose(),this.own.uTownClear.value=null}}const hs=be*1.4;function M_(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Mh(s,t,e){let n=!1;for(let i=0,r=s.length-1;i<s.length;r=i++){const a=s[i],o=s[r];a[1]>e!=o[1]>e&&t<(o[0]-a[0])*(e-a[1])/(o[1]-a[1])+a[0]&&(n=!n)}return n}function yh(s,t){const e=[s[0]];for(let n=0;n+1<s.length;n++){const[i,r]=s[n],[a,o]=s[n+1],c=Math.max(1,Math.ceil(Math.hypot(a-i,o-r)/t));for(let l=1;l<=c;l++)e.push([i+(a-i)*l/c,r+(o-r)*l/c])}return e}class y_{constructor(t,e,n){var u,d;this.app=t,this.districts=e,this.rec=n,this.group=new je,this.group.name="district features";const i=t.shared,r=t.data.proj,a=n.d.features.features||[];this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new Zt(0,0,0,0))},uDistS:{value:n.terrain.shadow.texture},uYearNow:{value:t.timeline.year},uTownClear:{value:null}};const o=M_(1795),c=new Le;this.counts={hale:0,waa:0,pondWalls:0};for(const[g,m]of n.d.byIndex){const x=(u=m.properties)==null?void 0:u.kind,p=m.geometry.coordinates[0].map(f=>r.toWorld(f));x==="village"?this.buildVillage(c,p,g,o):x==="fishpond"&&this.buildPond(c,p,g,o)}this.structMat=da(i,this.own,{fade:[70,110]}),this.structures=new me(c.geometry(),this.structMat),this.structures.frustumCulled=!1,this.group.add(this.structures),this.forest=new Gx(n.data.trees,n.d.rect,i,this.own),this.group.add(this.forest.group),this.ribbons=new $x(i,t.camera);const l=n.data.streams,h=[];for(let g=0;g<l.length;){const m=l[g++],x=[],p=[];for(let f=0;f<m;f++,g+=3)x.push([l[g],l[g+1]]),p.push(Math.min(7.5,1+1.3*Math.pow(l[g+2],.45))*be);h.push({pts:x,width:p})}this.streams=this.ribbons.add(h,{mode:"water",alpha:0,minPx:.9,lift:.004,order:5}),this.streamCount=h.length,this.trails=[];for(const g of a){const m=g.properties||{};if(m.kind!=="trail"||((d=g.geometry)==null?void 0:d.type)!=="LineString")continue;const x=yh(g.geometry.coordinates.map(f=>r.toWorld(f)),.12),p=this.ribbons.add([{pts:x,width:3.2*be}],{mode:"earth",colour:new Nt("#9c7f5c").toArray(),alpha:0,minPx:1.3,lift:.006,order:5});p&&this.trails.push({p:m,batch:p,w:0})}this.forces=new I1(t,a,i,this.ribbons),this.group.add(this.ribbons.group,this.forces.group),this.settlements=new __(t,e,n,this.own,this.ribbons),this.group.add(this.settlements.group),this.labels=new N1(t,a),this.show=0}groundAt(t,e,n=!0){const i=this.districts.rawAt(t,e);if(!n)return i;const{d:r}=this.rec,a=r.rect,o=Math.max(0,Math.min(r.W-1,Math.floor((t-a.x0)/(a.x1-a.x0)*r.W))),l=Math.max(0,Math.min(r.H-1,Math.floor((e-a.z0)/(a.z1-a.z0)*r.H)))*r.W+o;return lc(i,this.rec.aux[l*4],1,Ea(this.rec.carve[l*2]))}buildVillage(t,e,n,i){t.feature(n);let r=1/0,a=-1/0,o=1/0,c=-1/0;for(const[u,d]of e)r=Math.min(r,u),a=Math.max(a,u),o=Math.min(o,d),c=Math.max(c,d);const l=.85,h=[];for(let u=o+l/2;u<c;u+=l)for(let d=r+l/2;d<a;d+=l){const g=d+(i()-.5)*l*.7,m=u+(i()-.5)*l*.7;!Mh(e,g,m)||i()<.25||h.push([g,m])}for(const[u,d]of h){const g=i()*Math.PI*2,m=2+Math.floor(i()*3),x=[];for(let p=0;p<m;p++){const f=g+p/m*Math.PI*2+(i()-.5)*.6,v=p===0?0:.3+i()*.12,_=u+Math.cos(f)*v,M=d+Math.sin(f)*v;if(!Mh(e,_,M)||x.some(([b,R])=>Math.hypot(b-_,R-M)<.3))continue;x.push([_,M]);const w=6+i()*3,S=4+i()*1.4;let E=1/0,C=-1/0;for(const[b,R]of[[0,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const P=this.groundAt(_+b*w*.5*hs,M+R*S*.5*hs,!1);E=Math.min(E,P),C=Math.max(C,P)}if(E<.6||C-E>2.5)continue;const y=Ui(C);t.at(_,y,M,g+p%2*Math.PI*.5,hs),pa(t,i,w,S,4.6+i()*1.2,!0,.9+Ui(C-E)/hs),t.done(),this.counts.hale++}if(i()<.4){const p=u+.08,f=d-.06;t.at(p,Ui(this.groundAt(p,f,!1)),f,0,hs),Nx(t,i),t.done()}}this.buildCanoes(t,e,n,i),t.feature(0)}buildCanoes(t,e,n,i){let r=0,a=0;for(const[d,g]of e)r+=d/e.length,a+=g/e.length;const o=[],c=9,l=.06,h=Array.from({length:16},(d,g)=>[Math.cos(g/16*Math.PI*2),Math.sin(g/16*Math.PI*2)]);for(let d=a-c;d<a+c;d+=l)for(let g=r-c;g<r+c;g+=l){const m=this.groundAt(g,d);if(m<.3||m>2.2)continue;let x=null;for(const[p,f]of h)this.groundAt(g+p*.3,d+f*.3)<=0&&(x=x?[x[0]+p,x[1]+f]:[p,f]);x&&o.push([g,d,m,Math.atan2(x[1],x[0]),Math.hypot(g-r,d-a)])}o.sort((d,g)=>d[4]-g[4]);const u=[];for(const d of o){if(u.length>=14)break;u.some(g=>Math.hypot(g[0]-d[0],g[1]-d[1])<.22)||u.push(d)}for(const[d,g,m,x]of u)t.at(d,Ui(m)+.002,g,x,hs),Ux(t,i,7+i()*4),t.done(),this.counts.waa++}buildPond(t,e,n,i){t.feature(n);const r=Mt(Ys.pondStone,.12,i),a=yh(e,.05).map(([o,c])=>[o,Ui(Math.max(this.groundAt(o,c),-.8))-.004,c]);t.wall(a,3*be,1.6*be,r,ct.stone,.72),this.counts.pondWalls++,t.feature(0)}update(t,e,n){const i=e;this.show=i,this.own.uShow.value=i;const r=this.districts.featSeen,a=this.own.uFeatSeen.value;for(let l=0;l<64;l++)a[l>>2].setComponent(l&3,r[l]);this.group.visible=i>.001;const o=this.app.timeline.year,c=t>0?1-Math.exp(-t*1.6):1;this.streams&&(this.streams.uniforms.uAlpha.value=.8*i);for(const l of this.trails){const h=Aa(l.p,o)?1:0;l.w+=(h-l.w)*c,Math.abs(h-l.w)<.003&&(l.w=h),l.batch.uniforms.uAlpha.value=.75*l.w*i}this.forest.update(this.app.camera,i,this.rec.data.hi*this.app.world.uniforms.uVert.value+1,n),this.forces.update(t,i,n),this.settlements.update(t,i,n),this.ribbons.update(this.app.renderer),this.labels.update(i)}settle(t,e){this.update(0,t,e)}stats(){return{...this.counts,trees:this.forest.total,treesDrawn:this.forest.drawn,treeRadius:zi,streams:this.streamCount,trails:this.trails.filter(t=>t.w>.5).length,forces:this.forces.stats(),labels:this.labels.visible(),settlements:this.settlements.stats()}}dispose(){this.structures.geometry.dispose(),this.structMat.dispose(),this.forest.dispose(),this.ribbons.dispose(),this.forces.dispose(),this.settlements.dispose(),this.labels.dispose()}}const wo=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},$o=new Float32Array(65536);for(let s=0;s<65536;s++)$o[s]=Ea(s);class w_{constructor(t){this.app=t,this.world=t.world,this.list=[],this.loaded=!1,this.cur=null,this.k=0,this.want=0,this.patchW=new Float32Array(64).fill(1),this.groupK=new Float32Array(Fn),this.groupDepth=new Float32Array(Fn),this.featK=new Float32Array(64),this.featSeen=new Float32Array(64),this.u=this.world.uniforms,this._frustum=new $i,this._m=new ee,this._box=new _n,this.lastSeen=0,this.log=[]}patchWeights(){const t=this.cur;return t!=null&&t.lower?[...t.raise,...t.lower].map((e,n)=>({id:e.id,kind:e.kind,depth:e.depth,until:e.until,k:+this.patchW[n].toFixed(3)})):[]}async load(){var n;const t=await Rx(this.app.data,this.app.warn),e=await((n=this.app.patches)==null?void 0:n.ready)||[];this.list=t,this.setPatches(e),this.loaded=!0}setPatches(t){const e=this.app.warn;for(const i of this.list)i.patches=Lx(i,t,e);const n=new Set(this.world.islandPacks.map(i=>i.id));for(const i of t)!n.has(i.pack)&&!this.list.some(r=>r.id===i.pack)&&e(`patch ${i.id}: no pack or district ${i.pack} here; not drawn`);this.patchW.fill(1),this.cur&&this.drop()}districtAt(t,e,n=0){for(const i of this.list){const r=i.rect;if(t>r.x0-n&&t<r.x1+n&&e>r.z0-n&&e<r.z1+n)return i}return null}prefetch(t,e){const n=this.districtAt(t,e,20);return n&&(this.prefetchAt=performance.now(),this.stream(n)),n}readyAt(t,e){var i;const n=this.districtAt(t,e);return!!n&&((i=this.cur)==null?void 0:i.d)===n&&this.cur.state==="ready"}stream(t){var n;if(((n=this.cur)==null?void 0:n.d)===t)return;if(!this.world.terrains.get(t.parent)){this.pending=t;return}this.cur&&this.drop();const e={d:t,state:"loading",t0:performance.now()};this.cur=e,this.lastSeen=e.t0,this.decoder=this.decoder||new Px(this.app.warn),this.decoder.decode(t).then(i=>{this.cur===e&&this.arrive(e,i)}).catch(i=>{this.cur===e&&(this.app.warn(`district ${t.id}: ${i.message}`),e.state="failed")})}arrive(t,e){var l;const{d:n}=t;t.decodeMs=Math.round(performance.now()-t.t0),t.data=e,t.metres=e.metres,t.aux=e.aux,t.carve=e.carve;const i={id:n.id,name:n.name,rect:n.rect,W:n.W,H:n.H,rainUrl:n.rainUrl,data:{metres:e.metres,normals:e.normals,land:e.land,lo:e.lo,hi:e.hi}};t.pack=i;const r=this.world.terrains.get(n.parent);t.parUniforms={uParN:{value:(r==null?void 0:r.normalTex)??null},uParL:{value:(r==null?void 0:r.landTex)??null},uParS:{value:(r==null?void 0:r.shadow.texture)??null},uParRect:{value:r?r.rect:new Zt(0,0,1,1)},uParSlot:{value:-1},uParRain:{value:(r==null?void 0:r.uniforms.uOwnRain.value)??1}};const a=new Oo(i,this.world,[this.world.arch,r].filter(Boolean),{vertexShader:ox,fragmentShader:cx,shadowFragment:lx,shadowSize:512,uniforms:{...t.parUniforms,uDistN:{value:null},uDistL:{value:null},uDistS:{value:null}}});for(const h of[a.full,a.half]){const u=h.material.uniforms;u.uDistN.value=a.normalTex,u.uDistL.value=a.landTex,u.uDistS.value=a.shadow.texture}if(a.group.visible=!1,a.applyRange(((l=this.app.qset)==null?void 0:l.range)??4.6),this.app.params.get("debug"))for(const h of[a.full,a.half])h.material.uniforms.uDebug.value=Number(this.app.params.get("debug"));t.terrain=a,t.parent=r,this.world.group.add(a.group),t.heightTex=a.heightTex;const o=new sn(e.aux,n.W,n.H,Se,ge);o.minFilter=o.magFilter=re,o.needsUpdate=!0;const c=new sn(e.carve,n.W,n.H,Yh,xi);if(c.minFilter=c.magFilter=re,c.needsUpdate=!0,t.auxTex=o,t.carveTex=c,t.pmap=e.patchMap,t.pmap){const h=t.pmap,u=new sn(h.data,h.w,h.h,Se,ge);u.minFilter=u.magFilter=re,u.needsUpdate=!0,t.patchTex=u,t.patchBox=new Zt(h.x0,h.y0,h.x0+h.w,h.y0+h.h)}t.lower=n.patches.filter(h=>h.kind==="lower"),t.raise=n.patches.filter(h=>h.kind==="raise"),t.uploads=[a.heightTex,o,c,a.normalTex,a.landTex,...t.patchTex?[t.patchTex]:[]],t.state="uploading",t.features=new y_(this.app,this,t),this.app.scene.add(t.features.group),e.normals=e.land=null,e.trees={counts:e.trees.counts},e.streams=null,this.patchW.fill(1),this.yearWeights(1)}drop(){var e,n,i;const t=this.cur;t&&(this.off(),t.terrain&&(this.world.group.remove(t.terrain.group),t.terrain.dispose()),(e=t.auxTex)==null||e.dispose(),(n=t.carveTex)==null||n.dispose(),(i=t.patchTex)==null||i.dispose(),t.features&&(this.app.scene.remove(t.features.group),t.features.dispose()),this.cur=null,this.k=0)}off(){var e;const t=this.u;t.uDistInfo.value.set(0,0,Qe.margin,Qe.band),t.uDistH.value=this.world.dummy,t.uDistAux.value=this.world.dummyAux,t.uDistCarve.value=this.world.dummy,t.uDistPatch.value=this.world.dummyAux,t.uDistPatchBox.value.set(0,0,0,0),(e=this.cur)!=null&&e.terrain&&(this.cur.terrain.group.visible=!1),this.on=!1}yearWeights(t){var a,o;const e=this.cur,n=this.app.timeline.year,i=this.patchW;if(e!=null&&e.lower){[...e.raise,...e.lower].forEach((m,x)=>{const p=n<m.until?1:0;let f=i[x]+(p-i[x])*t;Math.abs(f-p)<.002&&(f=p),i[x]=f});const l=e.raise.length,h=this.u.uDistRaise.value;let u=-1e9;for(let m=0;m<Fn;m++)h[m].set(m<l?i[m]:0,m<l?e.raise[m].depth:0,0,0),m<l&&i[m]>0&&(u=Math.max(u,e.raise[m].depth));this.u.uDistRaiseTop.value=u;const d=this.u.uDistLower.value,g=((a=e.pmap)==null?void 0:a.groups)||[0];for(let m=0;m<Fn;m++){let x=0,p=-1;const f=g[m]||0;e.lower.forEach((v,_)=>{f&1<<_&&i[l+_]>x&&(x=i[l+_],p=v.depth)}),x===0&&f&&(p=((o=e.lower.find((v,_)=>f&1<<_))==null?void 0:o.depth)??-1),this.groupK[m]=x,this.groupDepth[m]=p,d[m].set(x,p,0,0)}}const r=this.u.uFeatK.value;if(e)for(const[c,l]of e.d.byIndex){const h=Aa(l.properties,n)?1:0;let u=this.featK[c]+(h-this.featK[c])*t;Math.abs(u-h)<.002&&(u=h),this.featK[c]=u;const d=n>=hc(l.properties)[0]?1:0;let g=this.featSeen[c]+(d-this.featSeen[c])*t;Math.abs(g-d)<.002&&(g=d),this.featSeen[c]=g,r[c>>2].setComponent(c&3,u)}}wantFor(t,e,n){var l,h;const i=t.rect,r=e.position,a=Math.max(i.x0-r.x,0,r.x-i.x1),o=Math.max(i.z0-r.z,0,r.z-i.z1),c=Math.hypot(a,o,Math.max(1,r.y));return this.dc=c,this._m.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this._box.min.set(i.x0,0,i.z0),this._box.max.set(i.x1,Math.max(1,(((h=(l=this.cur)==null?void 0:l.data)==null?void 0:h.hi)??1e3)*this.u.uVert.value),i.z1),this._frustum.intersectsBox(this._box)?wo(Qe.far,Qe.near,c)*(1-wo(Qe.rig[0],Qe.rig[1],n)):0}update(t,e,n){var m,x,p;if(!this.loaded||!this.list.length)return;if(this.pending&&this.world.terrains.get(this.pending.parent)){const f=this.pending;this.pending=null,this.stream(f)}const i=t.position;let r=null,a=1/0;for(const f of this.list){const v=f.rect,_=Math.hypot(Math.max(v.x0-i.x,0,i.x-v.x1),Math.max(v.z0-i.z,0,i.z-v.z1),Math.max(1,i.y));_<a&&(a=_,r=f)}r&&a<Qe.prefetch&&((m=this.cur)==null?void 0:m.d)!==r&&this.stream(r);const o=this.cur,c=1-Math.exp(-n*2.5);if(this.yearWeights(n>0?1-Math.exp(-n*Fh):1),!o)return;if(o.state==="uploading"){const f=o.uploads.shift();f&&this.app.renderer.initTexture(f),o.uploads.length||(o.state="ready",o.readyMs=Math.round(performance.now()-o.t0))}const l=o.parent,h=l&&l.slot>=0?l.k:0,u=o.state==="ready"?Math.min(this.wantFor(o.d,t,e),h):0;this.want=u,this.forceK!==null&&this.forceK!==void 0&&o.state==="ready"&&h>0?this.k=Math.min(this.forceK,h):(this.k+=(u-this.k)*c,Math.abs(u-this.k)<.004&&(this.k=u),this.k=Math.min(this.k,h));const d=o.state==="ready"&&h>0&&(this.k>0||u>0);d?this.switchOn(o):this.on&&this.off(),(d||this.k>0)&&(this.lastSeen=performance.now());const g=Math.max(this.lastSeen,(this.prefetchAt??-1e9)+Qe.hold*1e3);!d&&a>Qe.prefetch*1.2&&performance.now()-g>Qe.linger*1e3&&o.state!=="loading"&&this.drop(),this.cur&&((x=o.terrain)==null||x.update(t,this.on),(p=o.features)==null||p.update(n,this.on?this.k:0,e))}switchOn(t){const e=this.u,n=t.parent;e.uDistRect.value.copy(t.terrain.rect),e.uDistInfo.value.set(this.k,1,Qe.margin,Qe.band),e.uDistH.value=t.heightTex,e.uDistAux.value=t.auxTex,e.uDistCarve.value=t.carveTex,e.uDistPatch.value=t.patchTex||this.world.dummyAux,t.patchBox?e.uDistPatchBox.value.copy(t.patchBox):e.uDistPatchBox.value.set(0,0,0,0);const i=t.parUniforms;i.uParSlot.value=n.slot,i.uParN.value=n.normalTex,i.uParL.value=n.landTex,i.uParS.value=n.shadow.texture,this.on=!0}updateShadow(t,e,n,i){var r;this.on&&((r=this.cur)!=null&&r.terrain)&&this.cur.terrain.shadow.update(t,e,n,this.k,i)}settle(t,e){var a;this.yearWeights(1);const n=this.cur;if(!n||n.state!=="ready")return;const i=n.parent,r=i&&i.slot>=0?i.k:0;this.k=Math.min(this.wantFor(n.d,t,e),r),this.k>0?(this.switchOn(n),n.terrain.update(t,!0)):this.on&&this.off(),(a=n.features)==null||a.settle(this.k,e)}weightAt(t,e){if(!this.on)return 0;const n=this.cur.d.rect,i=Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e);return this.k*wo(Qe.band,Qe.margin,i)}patchAt(t,e){const n=this.cur.pmap;if(!n||t<n.x0||e<n.y0||t>=n.x0+n.w||e>=n.y0+n.h)return null;const i=((e-n.y0)*n.w+(t-n.x0))*4;return n.data.subarray(i,i+4)}texel(t,e){const n=this.cur,i=n.d.W,r=e*i+t;let a=n.metres[r];const o=n.aux,c=this.patchAt(t,e);if(c&&c[1]+c[3]>0){const u=this.u.uDistRaise.value,d=u[c[2]&15],g=u[c[2]>>4];a+=(Math.max(a,d.y)-a)*(c[1]/255)*d.x,a+=(Math.max(a,g.y)-a)*(c[3]/255)*g.x}const l=o[r*4];if(l){const u=c?c[0]:0;a=lc(a,l,this.groupK[u],$o[n.carve[r*2]],this.groupDepth[u])}const h=o[r*4+3];if(h>0){const u=this.featK[h];h<zn.pond?a+=(Ru(a,$o[n.carve[r*2]],o[r*4+2])-a)*(o[r*4+1]/255)*u:h<zn.other&&(a+=(Mu-a)*(o[r*4+1]/255)*u)}return a}metresAt(t,e){const{d:n}=this.cur,i=n.rect;let r=(t-i.x0)/(i.x1-i.x0)*n.W-.5,a=(e-i.z0)/(i.z1-i.z0)*n.H-.5;r=Math.max(0,Math.min(n.W-1.001,r)),a=Math.max(0,Math.min(n.H-1.001,a));const o=r|0,c=a|0,l=r-o,h=a-c,u=this.texel(o,c)+(this.texel(o+1,c)-this.texel(o,c))*l,d=this.texel(o,c+1)+(this.texel(o+1,c+1)-this.texel(o,c+1))*l;return u+(d-u)*h}blend(t,e,n){const i=this.weightAt(t,e);return i>0?n+(this.metresAt(t,e)-n)*i:n}rawAt(t,e){const{d:n}=this.cur,i=n.rect,r=Math.max(0,Math.min(n.W-1,Math.floor((t-i.x0)/(i.x1-i.x0)*n.W))),a=Math.max(0,Math.min(n.H-1,Math.floor((e-i.z0)/(i.z1-i.z0)*n.H)));return this.cur.metres[a*n.W+r]}stats(){var r,a;const t=this.cur;if(!t)return{district:null,loaded:this.loaded,count:this.list.length};const e=t.d.W*t.d.H,n=e*4+e*4+e*4+2*(e*4*4/3)+512*512+(t.pmap?t.pmap.w*t.pmap.h*4:0),i=t.metres?e*4+e*4+e*4:0;return{district:t.d.id,state:t.state,k:+this.k.toFixed(3),want:+this.want.toFixed(3),on:!!this.on,patches:this.patchWeights(),patchMap:t.pmap?{box:[t.pmap.x0,t.pmap.y0,t.pmap.w,t.pmap.h],groups:t.pmap.groups.length-1}:null,decodeMs:t.decodeMs??null,readyMs:t.readyMs??null,workerMs:((r=t.data)==null?void 0:r.ms)??null,gpuMB:+(n/1048576).toFixed(1),cpuMB:+(i/1048576).toFixed(1),nodes:t.terrain?t.terrain.full.count+t.terrain.half.count:0,features:((a=t.features)==null?void 0:a.stats())??null}}}const b_=`
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,S_=`
${Ie}
${cr}
${Je}
${Xi}
${Ls}
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
  if (depth < -0.05) discard; // land pokes through
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

  // soft meeting with the sand
  float alpha = smoothstep(-0.02, 0.35, depth);
  if (uDebug == 1) { col = vec3(depth / 100.0, fract(depth), 0.0); alpha = 1.0; }
  gl_FragColor = vec4(col, alpha);
}
`;function E_(s,t,e,n){const i=[0,0,0];for(let o=0;o<=n;o++){const c=s*Math.pow(t/s,o/n);for(let l=0;l<e;l++){const h=l/e*Math.PI*2;i.push(Math.cos(h)*c,0,Math.sin(h)*c)}}const r=[];for(let o=0;o<e;o++)r.push(0,1+(o+1)%e,1+o);for(let o=0;o<n;o++)for(let c=0;c<e;c++){const l=1+o*e+c,h=1+o*e+(c+1)%e,u=l+e,d=h+e;r.push(l,h,u,h,d,u)}const a=new Ze;return a.setAttribute("position",new ye(i,3)),a.setIndex(r),a}class A_{constructor(t,e){this.uniforms={...t.uniforms,...e,uCamPos:{value:new O},uWind:{value:new zt(-.8,.45)},uSwellDir:{value:new zt(-.6,.8)},uDebug:{value:0}},this.material=new we({vertexShader:b_,fragmentShader:S_,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new me(E_(1,25e4,96,120),this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const T_=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],R_={ra:12.857,dec:27.13};function C_(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}const Jn=Math.PI/180,Vs=21*Jn,Kr=29.530588,L_=224.1;function wh(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),r=Math.sin(s)*Math.cos(Vs)-n*Math.cos(t)*Math.sin(Vs),a=Math.sin(s)*Math.sin(Vs)+n*Math.cos(t)*Math.cos(Vs);return e.set(i,a,-r)}function P_(s,t,e={}){const n=23.44*Jn*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*Jn,a=((s-80)/365.25*24%24+24)%24+t-12;e.sun=wh(n,(t-12)*15*Jn,e.sun||new O);const o=s+t/24,c=((o-L_)%Kr+Kr)%Kr,l=c/Kr,h=i+l*2*Math.PI,u=Math.asin(Math.sin(23.44*Jn)*Math.sin(h)+Math.sin(5.1*Jn)*Math.sin(o*.23)),d=h/(2*Math.PI)*24;return e.moon=wh(u,(a-d)*15*Jn,e.moon||new O),e.phase=l,e.night=Math.min(29,Math.floor(c)),e.illum=.5-.5*Math.cos(l*2*Math.PI),e.lst=a,e.decl=n,e}const Ou=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],Bu=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],D_=1.6110731556870734,I_=1.5;function U_(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((D_-Math.acos(s))/I_)))}function bo(s,t,e,n=[0,0,0]){const i=U_(t.y),r=.2*e.turbidity*1e-17,a=Math.acos(Math.max(0,s.y)),o=1/(Math.cos(a)+.15*Math.pow(93.885-a*180/Math.PI,-1.253)),c=8400*o,l=1250*o,h=s.x*t.x+s.y*t.y+s.z*t.z,u=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),d=e.mieDirectionalG,g=d*d,m=1/(4*Math.PI)*((1-g)/Math.pow(1-2*d*h+g,1.5)),x=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let p=0;p<3;p++){const f=Ou[p]*e.rayleigh,v=.434*r*Bu[p]*e.mieCoefficient,_=Math.exp(-(f*c+v*l)),M=(f*u+v*m)/(f+v);let w=Math.pow(i*M*(1-_),1.5);w*=1+(Math.pow(i*M*_,.5)-1)*x;const S=.1*_,E=(w+S)*.04+[0,3e-4,75e-5][p];n[p]=Math.pow(E,1/2.4)}return n}function N_(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),r=.2*t.turbidity*1e-17;for(let a=0;a<3;a++){const o=Ou[a]*t.rayleigh,c=.434*r*Bu[a]*t.mieCoefficient;e[a]=Math.exp(-(o*8400*i+c*1250*i))}return e}const z_=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,Gu=`
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
`,F_=`
${Gu}
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
`,k_=`
${Gu}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,O_=`
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
`,B_=`
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
`;class G_{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=R_,e=(l,h)=>{const u=l/24*2*Math.PI,d=h*Jn;return new O(Math.cos(d)*Math.cos(u),Math.cos(d)*Math.sin(u),Math.sin(d))};this.uniforms={uSun:{value:new O(0,1,0)},uMoon:{value:new O(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:Vs},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new me(new rc(1,5),new we({vertexShader:z_,fragmentShader:F_,uniforms:this.uniforms,side:Ye,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=C_(4242),r=T_.map(([l,h,u])=>[l/24*2*Math.PI,h*Jn,u]);for(let l=0;l<2600;l++){const h=i()*2-1;r.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const a=new Float32Array(r.length*3);r.forEach((l,h)=>a.set(l,h*3));const o=new Ze;o.setAttribute("aStar",new Ee(a,3)),o.setAttribute("position",new Ee(new Float32Array(r.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new kv(o,new we({vertexShader:O_,fragmentShader:B_,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:To})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new je,this.group.add(n,this.stars),this.mapRT=new Gn(256,128,{type:xi,depthBuffer:!1}),this.mapRT.texture.wrapS=ra,this.mapScene=new Sa;const c=new me(oc(),new we({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:k_,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));c.frustumCulled=!1,this.mapScene.add(c),this.mapCam=new wa(-1,1,1,-1,0,1),this.astro={},this._v=new O}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const r=P_(t,e,this.astro),a=r.sun,o=this.uniforms;o.uSun.value.copy(a),o.uMoon.value.copy(r.moon),o.uPhase.value=r.phase,o.uIllum.value=r.illum,o.uLst.value=r.lst/24*2*Math.PI;const c=Oe.smoothstep(-a.y,-.02,.2);o.uNight.value=c,this.starUniforms.uNight.value=c,this.starUniforms.uTime.value=n;const l=this.params,h=this._v,u=bo(h.set(0,1,0),a,l),d=[0,0,0];for(let S=0;S<8;S++){const E=S/8*Math.PI*2,C=bo(h.set(Math.cos(E),.08,Math.sin(E)).normalize(),a,l);for(let y=0;y<3;y++)d[y]+=C[y]/8}const g=bo(h.set(a.x,.05,a.z).normalize(),a,l),m=N_(a,l),x=Oe.smoothstep(a.y,-.04,.06),p=3.2;i.sunColor.setRGB(m[0]*p*x,m[1]*p*x,m[2]*p*x);const f=[.0035,.005,.011],_=Oe.smoothstep(r.moon.y,-.02,.1)*r.illum*c;i.skyColor.setRGB(u[0]*.55+d[0]*.45+f[0]+.012*_,u[1]*.55+d[1]*.45+f[1]+.016*_,u[2]*.55+d[2]*.45+f[2]+.024*_);const M=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Nt(M,M,M),.35),i.zenith.setRGB(u[0],u[1],u[2]),i.horizon.setRGB(d[0]+f[0],d[1]+f[1],d[2]+f[2]),i.sunHorizon.setRGB(g[0],g[1],g[2]);const w=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,a.y)+i.skyColor.r)*w*1.1,(i.sunColor.g*Math.max(0,a.y)+i.skyColor.g)*w,(i.sunColor.b*Math.max(0,a.y)+i.skyColor.b)*w*.8),i.moonColor.setRGB(.05*_,.06*_,.085*_),i.moonDir.copy(r.moon),i.sunDir.copy(a),i.night=c,r}}const er=Math.PI*2,So=.4,H_=.18,bh=(s,t,e,n)=>e>0?s+(t-s)*(1-Math.exp(-e/n)):t,V_=(s,t,e)=>(s+t+Math.sqrt((s-t)*(s-t)+e*e))/2,W_=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,Zr=s=>((s+Math.PI)%er+er)%er-Math.PI,$_=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Hu=4e4;function Pi(s){return .6+.52*$_(Math.log(40),Math.log(4500),Math.log(Math.max(1,s)))}class X_{constructor(t,e,n){this.camera=t,this.dom=e,this.world=n,this.minDistance=nf,this.maxDistance=xc,this._ray=new Ov,this._v=new O,this.home=this.homeView(),this.reach(this.home.distance);const i=this.home;this.state={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.goal={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.flight=null,this.floor=0,this.groundM=0,this.pinned=!0,this._lastXZ=new zt(i.target.x,i.target.z),this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this.bind()}homeView(t={x0:16,y0:72,x1:innerWidth-16,y1:innerHeight-120}){const e=this.world.chainShape();return this.fit({points:e.hull,along:[e.from,e.to],yaw:0,box:t,reach:Hu})}reach(t){this.maxDistance=Math.max(xc,t*1.15)}bind(){const t=this.dom,e=new Map;let n=null,i=null,r=null;t.addEventListener("contextmenu",o=>o.preventDefault()),t.addEventListener("pointerdown",o=>{this.enabled&&(t.setPointerCapture(o.pointerId),e.set(o.pointerId,{x:o.clientX,y:o.clientY}),e.size===1?(n=o.button===2||o.shiftKey||o.ctrlKey||o.metaKey||o.altKey?"orbit":"pan",i={x:o.clientX,y:o.clientY}):e.size===2&&(n="pinch",r=this.pinchState(e)))}),t.addEventListener("pointermove",o=>{if(e.has(o.pointerId)){if(e.set(o.pointerId,{x:o.clientX,y:o.clientY}),n==="orbit"&&i){const c=o.clientX-i.x,l=o.clientY-i.y;this.goal.yaw-=c*.005,this.goal.pitch=Oe.clamp(this.goal.pitch+l*.004,.06,1.52),i={x:o.clientX,y:o.clientY},this.touch()}else if(n==="pan"&&i){const c=o.clientX-i.x,l=o.clientY-i.y;(c||l)&&(this.panBy(c,l),this.touch()),i={x:o.clientX,y:o.clientY}}else if(n==="pinch"&&e.size===2){const c=this.pinchState(e),l=r.dist/Math.max(20,c.dist);this.zoomAt(c.cx,c.cy,l),this.panBy(c.cx-r.cx,c.cy-r.cy),this.goal.yaw-=Zr(c.angle-r.angle),r=c,this.touch()}}});const a=o=>{if(e.delete(o.pointerId),e.size===0)n=null;else if(e.size===1){const[c]=e.values();n="pan",i={...c}}};t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a),t.addEventListener("wheel",o=>{if(!this.enabled)return;o.preventDefault();const c=o.deltaMode===1?o.deltaY*30:o.deltaY,l=Math.exp(Math.sign(c)*Math.min(Math.abs(c),150)*.0022);this.zoomAt(o.clientX,o.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",o=>{const c=this.pickGround(o.clientX,o.clientY);if(c){const l=Math.max(this.minDistance,this.goal.distance*.35);this.flyTo({target:c,distance:l,pitch:this.goal.pitch+Pi(l)-Pi(this.goal.distance)},1.8)}}),addEventListener("keydown",o=>{var d,g;if(!this.enabled||(g=(d=o.target).closest)!=null&&g.call(d,"input, textarea"))return;const c=this.goal.distance*.08,l={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[o.code];if(l&&!o.altKey){const m=Math.sin(this.goal.yaw),x=Math.cos(this.goal.yaw);this.goal.target.x+=(l[0]*x+l[1]*m)*c,this.goal.target.z+=(-l[0]*m+l[1]*x)*c,this.touch()}o.code==="KeyQ"&&(this.goal.yaw+=.12),o.code==="KeyE"&&(this.goal.yaw-=.12);const h=innerWidth/2,u=innerHeight/2;(o.code==="Equal"||o.code==="NumpadAdd")&&this.zoomAt(h,u,.8),(o.code==="Minus"||o.code==="NumpadSubtract")&&this.zoomAt(h,u,1.25)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,r=Math.sin(this.goal.yaw),a=Math.cos(this.goal.yaw),o=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*a-e*r*o)*i,this.goal.target.z+=(t*r-e*a*o)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),r=this.goal.distance,a=Oe.clamp(r*n,this.minDistance,this.maxDistance);if(i){const o=1-a/r;this.goal.target.x+=(i.x-this.goal.target.x)*o,this.goal.target.z+=(i.z-this.goal.target.z)*o}this.goal.pitch=Oe.clamp(this.goal.pitch+Pi(a)-Pi(r),.06,1.52),this.goal.distance=a}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new zt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e){const n=this.world,i=n.maxY+.05;if(e.y>=0&&t.y>i)return null;const r=e.y<0?t.y/-e.y:4e5;let a=t.y>i&&e.y<0?(t.y-i)/-e.y:0;const o=Math.min(r,4e5),c=this._v;let l=a;for(let h=0;h<700&&a<=o+.001;h++){c.copy(t).addScaledVector(e,a);const u=c.y-n.heightAt(c.x,c.z);if(u<0){let d=l,g=a;for(let m=0;m<24;m++){const x=(d+g)/2;c.copy(t).addScaledVector(e,x),c.y-n.heightAt(c.x,c.z)<0?g=x:d=x}return c.clone()}l=a,a+=Math.max(.02,u*.45,a*.0015)}return r<4e5?t.clone().addScaledVector(e,r).setY(0):null}fit({rect:t,points:e,along:n,distance:i,yaw:r=this.goal.yaw,tilt:a=0,pitch:o,box:c,pad:l=1.06,reach:h=this.maxDistance}){const u=this._fitCam||(this._fitCam=new ln),d=innerWidth,g=innerHeight;u.fov=this.camera.fov,u.aspect=d/Math.max(1,g),u.near=.1,u.far=1e6,u.updateProjectionMatrix();const m=c||{x0:0,y0:0,x1:d,y1:g},x=Math.max(60,m.x1-m.x0),p=Math.max(60,m.y1-m.y0),f=Math.tan(u.fov*Math.PI/360),v=e||[[t.x0,t.z0],[t.x1,t.z0],[t.x0,t.z1],[t.x1,t.z1]];let _=1/0,M=1/0,w=-1/0,S=-1/0;for(const[N,H]of v)_=Math.min(_,N),w=Math.max(w,N),M=Math.min(M,H),S=Math.max(S,H);let E=(_+w)/2,C=(M+S)/2;const y=i!==void 0;let b=y?i:Math.max(w-_,S-M)/(2*f)*(g/p),R=0;const P=Math.atan2(p,x),F=(N,H)=>Math.atan2(Math.sin(N)/Math.max(.35,Math.sin(H)),Math.cos(N));if(n){const[[N,H],[B,q]]=n;r=F(P,Pi(b)+a)-Math.atan2(q-H,B-N)}const I=this._v,z=(N,H,B)=>(I.set(N,H,B).project(u),[(I.x+1)/2*d,(1-I.y)/2*g]);for(let N=0,H=n?14:8;N<H;N++){b=Oe.clamp(b,this.minDistance,h),R=Oe.clamp(o??Pi(b)+a,.06,1.52);const B=Math.cos(R),q=Math.cos(r),J=Math.sin(r),Q=y?this.world.heightAt(E,C):0;u.position.set(E+b*B*J,Q+b*Math.sin(R),C+b*B*q),u.lookAt(E,Q,C),u.updateMatrixWorld();let ut=1/0,j=1/0,tt=-1/0,ft=-1/0;for(const[Rt,bt]of v){const[Dt,G]=z(Rt,Q,bt);ut=Math.min(ut,Dt),tt=Math.max(tt,Dt),j=Math.min(j,G),ft=Math.max(ft,G)}if(n){const[[Rt,bt],[Dt,G]]=n,[ae,gt]=z(Rt,Q,bt),[lt,X]=z(Dt,Q,G);r+=Zr(F(P,R)-F(Math.atan2(X-gt,lt-ae),R))}y||(b*=Oe.clamp(Math.max((tt-ut)*l/x,(ft-j)*l/p),.3,3));const xt=2*b*f/g,yt=((ut+tt)/2-(m.x0+m.x1)/2)*xt,Et=((j+ft)/2-(m.y0+m.y1)/2)*xt/Math.max(.35,Math.sin(R));E+=yt*q+Et*J,C+=-yt*J+Et*q}return b=Oe.clamp(b,this.minDistance,h),{target:new O(E,this.world.heightAt(E,C),C),distance:b,yaw:n?Zr(r):r,pitch:R}}groundAt(t,e){return Math.max(0,this.world.metresAt(t,e))}smoothGround(t,e,n){const i=H_*n;let r=2*this.groundAt(t,e),a=2;for(let o=0;o<6;o++){const c=o/6*er,l=c+er/12;r+=this.groundAt(t+Math.cos(c)*i*.5,e+Math.sin(c)*i*.5),r+=this.groundAt(t+Math.cos(l)*i,e+Math.sin(l)*i),a+=2}return r/a}pin(){const t=this.goal.target;this.groundM=this.groundAt(t.x,t.z),this.pinned=!0,this._lastXZ.set(t.x,t.z);const e=this.groundM*this.world.uniforms.uVert.value;t.y=e,this.state.target.y=e}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift,groundM:this.groundM},r={target:t.target?t.target.clone():i.target.clone(),distance:Oe.clamp(t.distance??i.distance,this.minDistance,this.maxDistance),yaw:t.yaw??i.yaw,pitch:Oe.clamp(t.pitch??i.pitch,.06,1.52),lift:t.lift??0};r.yaw=i.yaw+Zr(r.yaw-i.yaw);const a=Math.hypot(i.target.x-r.target.x,i.target.z-r.target.z),o=n.hop??Math.max(0,a*.9-Math.max(i.distance,r.distance)*.6);this.flight={from:i,dest:r,t:0,duration:e,hop:o,onDone:n.onDone,ready:n.ready,held:0}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,this.pin(),(e=t.onDone)==null||e.call(t),this.apply()}jump({x:t,z:e,distance:n,yaw:i,pitch:r}){this.flight=null;for(const a of[this.goal,this.state])t!==void 0&&a.target.set(t,this.world.heightAt(t,e),e),n!==void 0&&(a.distance=n),i!==void 0&&(a.yaw=i),r!==void 0&&(a.pitch=r),a.lift=0;this.pin(),this.apply()}update(t){var o;const e=this.goal;if(this.flight){const c=this.flight;let l=t/c.duration;c.ready&&c.t>.8&&c.held<6&&!c.ready()&&(c.held+=t,l*=.08),c.t=Math.min(1,c.t+l);const h=W_(c.t);e.target.lerpVectors(c.from.target,c.dest.target,h);const u=Math.log(c.from.distance)*(1-h)+Math.log(c.dest.distance)*h;e.distance=Math.exp(u)+c.hop*Math.sin(Math.PI*h),e.yaw=c.from.yaw+(c.dest.yaw-c.from.yaw)*h,e.pitch=c.from.pitch+(c.dest.pitch-c.from.pitch)*h+.2*Math.sin(Math.PI*h)*Math.min(1,c.hop/300),e.pitch=Math.min(1.52,e.pitch),e.lift=c.from.lift+(c.dest.lift-c.from.lift)*h,this.groundM=c.from.groundM+(this.groundAt(c.dest.target.x,c.dest.target.z)-c.from.groundM)*h,c.t>=1&&(this.flight=null,this.pin(),(o=c.onDone)==null||o.call(c))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);const n=this.world.bounds,i=150+e.distance*.3;e.target.x=Oe.clamp(e.target.x,n.x0-i,n.x1+i),e.target.z=Oe.clamp(e.target.z,n.z0-i,n.z1+i),this.flight||(Math.abs(e.target.x-this._lastXZ.x)+Math.abs(e.target.z-this._lastXZ.y)>1e-7&&(this.pinned=!1),this._lastXZ.set(e.target.x,e.target.z),this.pinned||(this.groundM=bh(this.groundM,this.smoothGround(e.target.x,e.target.z,e.distance),t,So))),e.target.y=this.groundM*this.world.uniforms.uVert.value;const r=this.state,a=this.flight?1:1-Math.exp(-t*7);r.target.lerp(e.target,a),r.distance=Math.exp(Math.log(r.distance)+(Math.log(e.distance)-Math.log(r.distance))*a),r.yaw+=(e.yaw-r.yaw)*a,r.pitch+=(e.pitch-r.pitch)*a,r.lift+=(e.lift-r.lift)*a,this.apply(t)}groundAhead(t,e,n){const i=this.world;let r=i.heightAt(t,e);const a=this._prevXZ;if(a&&n>0){const o=(t-a.x)/n,c=(e-a.y)/n,l=Math.hypot(o,c),h=Math.min(20,l*.3);h>.005&&(r=Math.max(r,i.heightAt(t+o/l*h,e+c/l*h)))}return this._prevXZ=(this._prevXZ||new zt).set(t,e),r}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const r=.12+e.distance*.03,a=this.groundAhead(n.position.x,n.position.z,t),o=Math.max(0,a+r-n.position.y);this.floor=bh(this.floor,o,t,o>this.floor?So/3:So*2),n.position.y+=this.floor;const c=this.world.heightAt(n.position.x,n.position.z),l=Math.min(.04,r*.3);n.position.y=V_(n.position.y,c+l,l),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const h=n.position.y-c;n.near=Oe.clamp(Math.min(h,e.distance)*.12,.02,300),n.far=Oe.clamp(e.distance*30+h*60,8e3,3e5),n.updateProjectionMatrix(),n.updateMatrixWorld()}}const q_=1.5,j_=`
${Ie}
${Je}
${Xi}
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
`,Y_=`
uniform vec3 uColor;
uniform float uOpacity;
in float vFade;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vFade);
}
`;function K_(s){return s?s.type==="Polygon"?s.coordinates:s.type==="MultiPolygon"?s.coordinates.flat():s.type==="LineString"?[s.coordinates]:s.type==="MultiLineString"?s.coordinates:[]:[]}function Z_(s,t){var r;const e=new Map,n=new Set,i=a=>Math.round(a*1e6);for(const a of(s==null?void 0:s.features)||[]){const o=ta((r=a.properties)==null?void 0:r.island)||"other";let c=e.get(o);c||e.set(o,c=[]);for(const l of K_(a.geometry))for(let h=0;h+1<l.length;h++){const u=l[h],d=l[h+1],g=`${i(u[0])},${i(u[1])}`,m=`${i(d[0])},${i(d[1])}`;if(g===m)continue;const x=g<m?`${g}|${m}`:`${m}|${g}`;if(n.has(x))continue;n.add(x);const[p,f]=t.toWorld(u),[v,_]=t.toWorld(d),M=Math.max(1,Math.ceil(Math.hypot(v-p,_-f)/q_));for(let w=0;w<M;w++){const S=w/M,E=(w+1)/M;c.push(p+(v-p)*S,f+(_-f)*S,p+(v-p)*E,f+(_-f)*E)}}}return e}class Sh{constructor(t,e,n,{color:i,width:r,order:a}){this.group=new je,this.uniforms={...n,uResolution:{value:new zt(1,1)},uWidth:{value:r},uCamPos:{value:new O},uColor:{value:new Nt(...i)},uOpacity:{value:1}},this.material=new we({vertexShader:j_,fragmentShader:Y_,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});const o=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);this.count=0;for(const[,c]of Z_(t,e)){if(!c.length)continue;const l=new or;l.setAttribute("position",new Ee(o,3)),l.setIndex([0,2,1,1,2,3]);const h=new Float32Array(c);l.setAttribute("aSeg",new Ke(h,4)),l.instanceCount=h.length/4,this.count+=l.instanceCount;let u=1/0,d=-1/0,g=1/0,m=-1/0;for(let f=0;f<h.length;f+=2)u=Math.min(u,h[f]),d=Math.max(d,h[f]),g=Math.min(g,h[f+1]),m=Math.max(m,h[f+1]);const x=new O((u+d)/2,60,(g+m)/2);l.boundingSphere=new Mi(x,Math.hypot(d-u,m-g,300)/2+10);const p=new me(l,this.material);p.renderOrder=a,this.group.add(p)}}update(t,e,n){this.uniforms.uResolution.value.copy(e),this.uniforms.uCamPos.value.copy(t.position),this.uniforms.uOpacity.value=n,this.group.visible=n>.01&&this.count>0}}class J_{constructor(t,e){this.group=new je,this.moku=new Sh(t.moku,t.proj,e,{color:[1.5,1.08,.52],width:2.2,order:3}),this.ahupuaa=new Sh(t.ahupuaa,t.proj,e,{color:[1.25,1.2,1.06],width:1.3,order:2}),this.group.add(this.ahupuaa.group,this.moku.group),this.visible=!0,this._res=new zt}update(t,e,n,i=1){e.getDrawingBufferSize(this._res);const r=e.getPixelRatio(),a=this.visible?1:0,o=(c,l,h)=>{const u=Math.max(0,Math.min(1,(h-c)/(l-c)));return u*u*(3-2*u)};this.moku.uniforms.uWidth.value=(1.3+1.1*(1-o(800,4e3,n)))*r,this.ahupuaa.uniforms.uWidth.value=1.25*r,this.moku.uniforms.uColor.value.setRGB(1.5*i,1.08*i,.52*i),this.ahupuaa.uniforms.uColor.value.setRGB(1.25*i,1.2*i,1.06*i),this.moku.update(t,this._res,a*(.55+.4*(1-o(1500,6e3,n)))),this.ahupuaa.update(t,this._res,a*.75*(1-o(220,650,n)))}}const Q_=4,Eh=[300,1e3],Ah=[.4,.7],tM=9,Th={voyage:[1.38,1.18,.86],fleet:[1.6,.9,.52],ship:[1,1.1,1.26],trade:[1.15,1.1,.96],schematic:[1.25,1.18,1.02]},Rh={journal:{width:2,opacity:.92,pulse:1},narrative:{width:1.7,opacity:.82,pulse:.9},schematic:{width:1.4,opacity:.62,pulse:.45}},eM={day:0,month:0,year:0,decade:5,generation:12,century:50},Eo=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},nM=`
${Ie}
${Je}
${Xi}
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
`,iM=`
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
`;function sM(s){const t=s.when||{},e=(a,o)=>{const c=String(a??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!c)return null;const l=Number(c[1]);return c[2]?l+(Number(c[2])-1+(o?1:0))/12:l+(o?1:0)};let n=e(t.from,!1),i=e(t.to??t.from,!0);if(n===null&&i===null)return null;n===null&&(n=i-1),i===null&&(i=n+1);const r=eM[t.precision]??0;return r&&i-n<=1.01&&(n-=r,i+=r),[n,i]}async function rM(s,t=console.warn){const e=s!=null&&s.abs?s.abs("routes.json"):new URL("routes.json",new URL((s==null?void 0:s.base)||"./data/",location.href)).href;try{const n=await fetch(e);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json();return Array.isArray(i)?i:Array.isArray(i==null?void 0:i.routes)?i.routes:[]}catch(n){return t(`${e}: ${n.message} (no routes)`),[]}}class aM{constructor(t,e,n){this.route=t,this.span=sM(t);const i=Rh[t.pointPrecision]?t.pointPrecision:"schematic";this.style=Rh[i],this.ret=t.direction==="return";const r=i==="schematic",a=new Set(t.schematicSegments||[]),o=(t.points||[]).map(_=>e.toWorld(_)),c=[],l=[];let h=0;for(let _=0;_+1<o.length;_++){const[M,w]=o[_],[S,E]=o[_+1],C=Math.hypot(S-M,E-w),y=Math.max(1,Math.ceil(C/Q_)),b=r||a.has(_)?1:0;for(let R=0;R<y;R++){const P=R/y,F=(R+1)/y;c.push(M+(S-M)*P,w+(E-w)*P,M+(S-M)*F,w+(E-w)*F),l.push(h+C*P,h+C*F,b,0)}h+=C}this.total=h;const u=(_,M,w)=>{c.push(_[0],_[1],M[0],M[1]),l.push(w,w,0,1)};o.length>=2&&(u(o.at(-2),o.at(-1),h),this.ret&&u(o[1],o[0],0));const d=new or;d.setAttribute("position",new Ee(new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),3)),d.setIndex([0,2,1,1,2,3]);const g=new Float32Array(c);d.setAttribute("aSeg",new Ke(g,4)),d.setAttribute("aInfo",new Ke(new Float32Array(l),4)),d.instanceCount=g.length/4;let m=1/0,x=-1/0,p=1/0,f=-1/0;for(const[_,M]of o)m=Math.min(m,_),x=Math.max(x,_),p=Math.min(p,M),f=Math.max(f,M);d.boundingSphere=new Mi(new O((m+x)/2,60,(p+f)/2),Math.hypot(x-m,f-p,300)/2+20),this.geometry=d;const v=Th[t.kind]||Th.schematic;this.colour=v,this.uniforms={...n,uResolution:{value:new zt(1,1)},uWidth:{value:this.style.width},uHead:{value:9},uCamPos:{value:new O},uColor:{value:new Nt(...v)},uOpacity:{value:0},uDashLen:{value:30},uMarch:{value:0},uPulse:{value:-1e6},uPulseLen:{value:60},uPulseK:{value:this.style.pulse}},this.material=new we({vertexShader:nM,fragmentShader:iM,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),this.mesh=new me(d,this.material),this.mesh.renderOrder=4,this.mesh.visible=!1,this.k=0,this.w=1,this.phase=oM(t.id||"")%1e3/1e3}dispose(){this.geometry.dispose(),this.material.dispose()}}function oM(s){let t=2166136261;for(let e=0;e<s.length;e++)t=Math.imul(t^s.charCodeAt(e),16777619);return t>>>0}class cM{constructor({routes:t=[],proj:e,uniforms:n,camera:i,renderer:r,eras:a=[]}){this.proj=e,this.shared=n,this.camera=i,this.renderer=r,this.eras=[...a].filter(o=>Number.isFinite(o.year)).sort((o,c)=>o.year-c.year),this.group=new je,this.group.name="routes",this.lines=[],this._res=new zt,this._last=null,this.setRoutes(t)}setRoutes(t){for(const e of this.lines)this.group.remove(e.mesh),e.dispose();this.lines=[];for(const e of t||[]){if(!Array.isArray(e.points)||e.points.length<2)continue;const n=new aM(e,this.proj,this.shared);n.span&&(this.lines.push(n),this.group.add(n.mesh))}}windowAt(t){const e=this.eras;if(e.length<2)return[t-10,t+10];const n=r=>{if(r<=0)return e[0].year+r*(e[1].year-e[0].year);const a=e.length-1;if(r>=a)return e[a].year+(r-a)*(e[a].year-e[a-1].year);const o=Math.floor(r);return e[o].year+(r-o)*(e[o+1].year-e[o].year)};let i=0;if(t>=e.at(-1).year)i=e.length-1;else if(t>e[0].year){for(let r=0;r+1<e.length;r++)if(t<=e[r+1].year){i=r+(t-e[r].year)/Math.max(1e-6,e[r+1].year-e[r].year);break}}return[n(i-.5),n(i+.5)]}visibleRoutes(){return this.lines.filter(t=>t.k>.5&&t.mesh.visible).map(t=>t.route)}update(t,e,{window:n,light:i=1,fill:r=0,section:a=null,all:o=!1}={}){const c=performance.now()/1e3,l=this._last===null?1:Math.max(0,Math.min(.1,c-this._last));this._last=c,this.apply(t,e,{win:n,light:i,fill:r,section:a,all:o},c,1-Math.exp(-l*4))}settle(t,e,{window:n,light:i=1,fill:r=0,section:a=null,all:o=!1}={}){this.apply(t,e,{win:n,light:i,fill:r,section:a,all:o},performance.now()/1e3,1)}apply(t,e,{win:n,light:i,fill:r,section:a,all:o},c,l){var p,f;const[h,u]=n||this.windowAt(t);this.renderer.getDrawingBufferSize(this._res);const d=this.renderer.getPixelRatio(),g=Eo(Eh[0],Eh[1],e),m=1-Eo(Ah[0],Ah[1],r),x=1-Eo(800,4e3,e);for(const v of this.lines){const[_,M]=v.span,w=!!a&&(((p=a.routes)==null?void 0:p.has(v.route.id))||((f=a.events)==null?void 0:f.has(v.route.event))),S=w||o&&M>=h&&_<=u?1:0;v.k+=(S-v.k)*l,Math.abs(S-v.k)<.003&&(v.k=S);const E=w&&!o?a.k??1:1;v.w+=(E-v.w)*l,Math.abs(E-v.w)<.003&&(v.w=E);const C=t>=_&&t<=M?1:.55,y=w&&!!a.focus,b=v.style.opacity*v.k*v.w*g*(y?1:m)*C;if(v.mesh.visible=b>.01,!v.mesh.visible)continue;const R=v.uniforms;R.uResolution.value.copy(this._res),R.uCamPos.value.copy(this.camera.position),R.uWidth.value=(v.style.width+.6*x)*d,R.uHead.value=(8+3*x)*d,R.uOpacity.value=b,R.uColor.value.setRGB(v.colour[0]*i,v.colour[1]*i,v.colour[2]*i),R.uPulseK.value=v.style.pulse*v.w,R.uDashLen.value=e*.016,R.uPulseLen.value=Math.min(v.total*.12,e*.035);const P=(c/tM+v.phase)%1;R.uPulse.value=v.ret?(P<.5?P*2:2-P*2)*v.total:P*v.total,R.uMarch.value=v.ret?0:c*e*.012%(e*.016)}}dispose(){for(const t of this.lines)t.dispose();this.lines=[],this.group.clear()}}const Jr=s=>String(s||"").normalize("NFD").replace(/[̀-ͯʻʼ'‘’]/g,"").toLowerCase();function lM(s,t,e,n,i,r){const a=t/(n.x1-n.x0),o=e/(n.z1-n.z0),c=[];let l=1/0,h=-1/0;for(const x of i)for(let p=0;p+1<x.length;p++){const f=(x[p][0]-n.x0)*a,v=(x[p][1]-n.z0)*o,_=(x[p+1][0]-n.x0)*a,M=(x[p+1][1]-n.z0)*o;v!==M&&(c.push(v<M?[v,f,M,_]:[M,_,v,f]),l=Math.min(l,v,M),h=Math.max(h,v,M))}if(!c.length)return;c.sort((x,p)=>x[0]-p[0]);const u=[],d=Math.max(0,Math.floor(l)),g=Math.min(e-1,Math.ceil(h));let m=0;for(let x=d;x<=g;x++){const p=x+.5;for(u.length=0;m<c.length&&c[m][2]<=p&&c[m][0]<=p;)m++;for(let v=m;v<c.length;v++){const _=c[v];if(_[0]>p)break;_[2]<=p||u.push(_[1]+(p-_[0])/(_[2]-_[0])*(_[3]-_[1]))}u.sort((v,_)=>v-_);const f=x*t;for(let v=0;v+1<u.length;v+=2){const _=Math.max(0,Math.ceil(u[v]-.5)),M=Math.min(t-1,Math.floor(u[v+1]-.5));for(let w=_;w<=M;w++)s[f+w]=r}}}class hM{constructor(t,e,n,i=console.warn){var u,d;this.data=t,this.rect=e,this.uniforms=n,this.polities=new Map((t.polities.polities||[]).map(g=>[g.id,g]));const r=(((u=t.moku)==null?void 0:u.features)||[]).slice(0,255);(((d=t.moku)==null?void 0:d.features)||[]).length>255&&i("more than 255 moku: the overlay shows the first 255");const a=e.x1-e.x0,o=e.z1-e.z0,c=Math.min(4096,Math.ceil(Math.max(a,o)/1.5));this.W=Math.round(a>=o?c:c*a/o),this.H=Math.round(a>=o?c*o/a:c),this.grid=new Uint8Array(this.W*this.H),this.mokus=[null],r.forEach((g,m)=>{const x=g.properties||{},p=x.name??x.moku??"",f=x.islandId||ta(x.island),v=g.geometry,_=(v==null?void 0:v.type)==="Polygon"?[v.coordinates]:(v==null?void 0:v.type)==="MultiPolygon"?v.coordinates:[];for(const M of _)lM(this.grid,this.W,this.H,e,M.map(w=>w.map(S=>t.proj.toWorld(S))),m+1);this.mokus.push({index:m+1,name:p,island:x.island,islandKey:f,key:x.mokuKey||`${f}:${p}`,props:x})}),this.loose=new Map(this.mokus.slice(1).map(g=>[`${g.islandKey}:${Jr(g.name)}`,g])),this.checkKeys(i);const l=new sn(this.grid,this.W,this.H,Vi,ge);l.minFilter=re,l.magFilter=re,l.unpackAlignment=1,l.needsUpdate=!0,this.idTex=l,this.palette=new Uint8Array(256*2*4);const h=new sn(this.palette,256,2,Se,ge);h.minFilter=re,h.magFilter=re,h.needsUpdate=!0,this.palTex=h,n.uMokuId.value=l,n.uMokuRect.value.set(e.x0,e.z0,e.x1,e.z1),n.uPalette.value=h,this.eraKeys=[null,null]}checkKeys(t){const e=new Set(this.mokus.slice(1).map(i=>i.key)),n=new Set;for(const[i,r]of Object.entries(this.data.polities.byEra||{}))for(const a of Object.keys(r)){if(e.has(a))continue;const[o,...c]=a.split(":"),l=this.loose.get(`${ta(o)}:${Jr(c.join(":"))}`);n.add(l?`${a} (${i}; the boundary file spells it "${l.name}")`:`${a} (${i})`)}n.size&&t(`polities.json names moku the boundary file doesn't have: ${[...n].slice(0,12).join(", ")}${n.size>12?", …":""}`)}holder(t,e){var r;const n=t?(r=this.data.polities.byEra)==null?void 0:r[t.id]:null;if(!n)return null;let i=n[e.key];if(i===void 0)for(const[a,o]of Object.entries(n)){const[c,...l]=a.split(":");if(ta(c)===e.islandKey&&Jr(l.join(":"))===Jr(e.name)){i=o;break}}return i?this.polities.get(i)||{id:i,name:i,colour:"#cccccc"}:null}setEras(t,e,n){const i=(t==null?void 0:t.id)??null,r=(e==null?void 0:e.id)??null;if(i!==this.eraKeys[0]||r!==this.eraKeys[1]){this.eraKeys=[i,r];const o=new Nt;this.palette.fill(0);for(const[c,l]of[[0,t],[1,e]])for(const h of this.mokus.slice(1)){const u=this.holder(l,h);if(!u)continue;o.set(u.colour||"#cccccc");const d=(c*256+h.index)*4;this.palette[d]=Math.round(o.r*255),this.palette[d+1]=Math.round(o.g*255),this.palette[d+2]=Math.round(o.b*255),this.palette[d+3]=255}this.palTex.needsUpdate=!0}const a=Math.max(0,Math.min(1,(n-.35)/.3));this.uniforms.uEraMix.value=t===e?0:a*a*(3-2*a)}mokuAt(t,e){const n=this.rect,i=Math.floor((t-n.x0)/(n.x1-n.x0)*this.W),r=Math.floor((e-n.z0)/(n.z1-n.z0)*this.H);return i<0||r<0||i>=this.W||r>=this.H?null:this.mokus[this.grid[r*this.W+i]]||null}politiesIn(t){const e=new Map;for(const n of this.mokus.slice(1)){const i=this.holder(t,n);i&&e.set(i.id,i)}return[...e.values()]}}function ma(s,t=!1){if(s==null)return null;if(typeof s=="number")return s+(t?1:0);const e=String(s).match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!e)return null;const n=Number(e[1]);if(e[2]){const i=Number(e[2])-1+(t?1:0);return n+i/12}return n+(t?1:0)}const uM={day:0,month:0,year:0,decade:5,generation:12,century:50};function Xo(s){const t=s.when||{};let e=ma(t.from),n=ma(t.to??t.from,!0);if(e===null&&n===null)return null;e===null&&(e=n-1),n===null&&(n=e+1);const i=uM[t.precision]??0;return i&&n-e<=1.01&&(e-=i,n+=i),[e,n]}function ga(s){const t=s.when||{};return ma(t.from)??ma(t.to)}const Vu=["generation","century","decade"];function Wu(s){var e;const t=ga(s);return t===null?"":nr(Math.floor(t),Vu.includes((e=s.when)==null?void 0:e.precision)?10:1)}function fM(s){const t=s.when||{},e=i=>{const r=String(i??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!r)return String(i??"");const a=["January","February","March","April","May","June","July","August","September","October","November","December"],o=Number(r[1]),c=o<0?`${-o} BCE`:String(o);return r[3]?`${Number(r[3])} ${a[Number(r[2])-1]} ${c}`:r[2]?`${a[Number(r[2])-1]} ${c}`:c},n=Vu.includes(t.precision)?"c. ":"";return!t.to||t.to===t.from?`${n}${e(t.from)}`:`${n}${e(t.from)} – ${e(t.to)}`}class dM{constructor(t){this.eras=[...t].filter(e=>Number.isFinite(e.year)).sort((e,n)=>e.year-n.year),this.s=0,this.listeners=[]}get n(){return this.eras.length}get max(){return Math.max(0,this.n-1)}yearAt(t){const e=this.eras;if(!e.length)return 1800;if(e.length===1)return e[0].year+t*50;if(t<=0)return e[0].year+t*(e[1].year-e[0].year);if(t>=e.length-1)return e[e.length-1].year+(t-e.length+1)*(e[e.length-1].year-e[e.length-2].year);const n=Math.floor(t);return e[n].year+(t-n)*(e[n+1].year-e[n].year)}sAtYear(t){const e=this.eras;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}get year(){return this.yearAt(this.s)}get era(){return this.eras[Math.round(Math.max(0,Math.min(this.max,this.s)))]||null}get pair(){const t=Math.max(0,Math.min(this.max,this.s)),e=Math.floor(t),n=Math.min(this.max,e+1);return{a:this.eras[e],b:this.eras[n],t:t-e}}get window(){return[this.yearAt(this.s-.5),this.yearAt(this.s+.5)]}set(t){const e=Math.max(0,Math.min(this.max,t));if(e!==this.s){this.s=e;for(const n of this.listeners)n(this)}}setYear(t){this.set(this.sAtYear(t))}onChange(t){this.listeners.push(t)}}function nr(s,t=1){const e=Math.round(s),n=e<0?`${-e} BCE`:String(e);return t>=10?`c. ${n}`:n}const $u=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},va=s=>$u(260,900,s),qo=s=>$u(90,300,s);class pM{constructor(t,e,{warn:n=console.warn}={}){this.canvas=t,this.data=e,this.warn=n,this.params=new URLSearchParams(location.search);const i=new xu({canvas:t,antialias:!1,powerPreference:"high-performance"});i.setClearColor(0,1),i.info.autoReset=!1,this.renderer=i,this.pipeline=new jv(i),this.scene=new Sa,this.camera=new ln(42,1,.1,9e3),this.light={sunDir:new O(0,1,0),sunColor:new Nt,skyColor:new Nt,groundColor:new Nt,moonDir:new O(0,-1,0),moonColor:new Nt,zenith:new Nt,horizon:new Nt,sunHorizon:new Nt,night:0},this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uSkyMap:{value:null},uMokuId:{value:null},uMokuRect:{value:new Zt(0,0,1,1)},uPalette:{value:null},uEraMix:{value:0},uPolityK:{value:0},uHoverMoku:{value:0}}},this.world=new rx(this,e),Object.assign(this.shared.uniforms,this.world.uniforms),this.world.uniforms=this.shared.uniforms,this.patches=new sx(this),this.timeline=new dM(e.eras),this.polity=new hM(e,this.world.archPack.rect,this.shared.uniforms,n),this.land=new a_(this),this.overlay={lines:!0,pins:!0,routes:!1};const r=this.params.get("view");this.view=r==="land"?"land":r==="none"?null:"chiefdoms",this.viewChosen=r==="land"||r==="chiefdoms"||r==="none",this.viewListeners=[],this.polityK=0,this.landK=0,this.sky=new G_,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??15.6)},this.time=0,this.frames=0,this.updaters=[]}start(){this.world.setArchipelago(this.world.archPack),this.scene.add(this.world.group),this.districts=new w_(this),this.world.district=this.districts,this.ocean=new A_(this.shared,this.shared.uniforms),this.scene.add(this.ocean.mesh),this.lines=new J_(this.data,this.shared.uniforms),this.scene.add(this.lines.group),this.routes=new cM({proj:this.data.proj,uniforms:this.shared.uniforms,camera:this.camera,renderer:this.renderer,eras:this.data.eras}),this.scene.add(this.routes.group),rM(this.data,this.warn).then(a=>this.routes.setRoutes(a)),this.rig=new X_(this.camera,this.canvas,this.world);const t=this.params.get("cam");if(t){const[a,o,c,l,h]=t.split(",").map(Number);this.rig.jump({x:a,z:o,distance:c,yaw:l,pitch:h})}const e=this.params.get("year");e?this.timeline.setYear(Number(e)):t?this.timeline.set(Math.round(this.timeline.sAtYear(1778))):this.timeline.set(0),this.timeline.onChange(()=>this.syncEras()),this.syncEras(),this.sky.update(this.clock.doy,this.clock.hour,0,this.light);const n=this.renderer.getContext(),i=n.getExtension("WEBGL_debug_renderer_info"),r=i?String(n.getParameter(i.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(r),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.params.get("debug")&&this.world.setDebug(Number(this.params.get("debug"))),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}setView(t,{user:e=!1}={}){e&&(this.viewChosen=!0);const n=t==="chiefdoms"||t==="land"?t:null;if(n!==this.view){this.view=n;for(const i of this.viewListeners)i(n)}}onView(t){this.viewListeners.push(t)}islandFill(){const t=this.rig.state,e=t.target;let n=null,i=0;for(const o of this.world.islandPacks){const c=o.rect,l=Math.min(e.x-c.x0,c.x1-e.x,e.z-c.z0,c.z1-e.z);l>i&&(i=l,n=o)}if(!n)return 0;const r=2*t.distance*Math.tan(this.camera.fov*Math.PI/360),a=n.rect;return Math.max((a.x1-a.x0)/(r*this.camera.aspect),(a.z1-a.z0)/r)}routeSection(){var r;const t=this.tour,e=(r=this.ui)==null?void 0:r.card;let n=null;t!=null&&t.active&&t.event?n=t.event:!(t!=null&&t.active)&&(e==null?void 0:e.mode)==="event"&&e.ev&&(n=e.ev);const i=n?`ev:${n.id}`:"";return i!==this._routeKey&&(this._routeKey=i,this._routeSection=n?{routes:new Set(n.routes||[]),events:new Set([n.id]),k:1,focus:!0}:null),this._routeSection}routeOptions(t){return{window:this.timeline.window,fill:this.islandFill(),section:this.routeSection(),all:this.overlay.routes===!0,...t}}addIsland(t){const e=this.world.addIsland(t);this.land.attach(e),e.applyRange(this.qset.range),this.params.get("debug")&&(e.uniforms.uDebug.value=Number(this.params.get("debug")))}settle(){var e,n,i;(e=this.ui)==null||e.timeline.finish(),this.rig.finishFlight();const t=this.rig.goal;for(const r of[this.rig.goal,this.rig.state])r.target.copy(t.target),r.distance=t.distance,r.yaw=t.yaw,r.pitch=t.pitch;this.world.update(this.camera,t.distance,0),this.world.settle(this.camera),(n=this.districts)==null||n.settle(this.camera,t.distance),this.rig.jump({x:t.target.x,z:t.target.z}),this.polityK=this.view==="chiefdoms"?va(t.distance):0,this.landK=this.view==="land"?qo(t.distance):0,this.shared.uniforms.uPolityK.value=this.polityK,this.land.settle(this.landK),(i=this.routes)==null||i.settle(this.timeline.year,t.distance,this.routeOptions())}stats(){const t=this.renderer.info;return{...this.world.stats(),view:this.view,frameMs:+(this.frameAvg??0).toFixed(1),calls:t.render.calls,triangles:t.render.triangles,textures:t.memory.textures,quality:this.quality.level}}syncEras(){const{a:t,b:e,t:n}=this.timeline.pair;this.polity.setEras(t,e,n)}applyQuality(){const t=[{range:3,dpr:1},{range:3.8,dpr:1.25},{range:4.6,dpr:1.5},{range:5.5,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.world.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.frameAvg=this.frameAvg===void 0?e*1e3:this.frameAvg+(e*1e3-this.frameAvg)*.1,this.renderer.info.reset(),this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.clock;this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t);const n=this.rig.state.distance;this.world.update(this.camera,n,t),this.ocean.update(this.camera);const i=1-Math.exp(-t*5),r=this.view==="chiefdoms"?va(n):0;this.polityK+=(r-this.polityK)*i,this.shared.uniforms.uPolityK.value=this.polityK;const a=this.view==="land"?qo(n):0;this.landK+=(a-this.landK)*i,this.land.update(t,this.landK),this.lines.visible=this.overlay.lines;const o=this.light,c=Math.min(1,.25+(o.sunColor.r+o.skyColor.r)*.35);this.lines.update(this.camera,this.renderer,n,c),this.routes.update(this.timeline.year,n,this.routeOptions({light:c}));for(const h of this.updaters)h(t,this.time);const l=this.pipeline.uniforms;l.uSunDir.value.copy(o.sunDir),l.uSunColor.value.copy(o.sunHorizon),l.uFogColor.value.copy(o.horizon),l.uFogDensity.value=.09/Math.max(30,n),l.uFogFalloff.value=2/Math.max(30,n),l.uExposure.value=.55*(1+2.2*Math.pow(o.night,1.5)),l.uNight.value=o.night,this.sky.group.position.copy(this.camera.position)}}const cn=(s,t=document)=>t.querySelector(s),$e=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,r]of Object.entries(t))i==="class"?n.className=r:i.startsWith("on")?n.addEventListener(i.slice(2),r):n.setAttribute(i,r);return e&&(n.innerHTML=e),n},mM={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Tt=s=>String(s??"").replace(/[&<>"']/g,t=>mM[t]),jo={arrival:'<path d="M2.5 15.5h19l-2.6 3.6H5.1z"/><path d="M11.5 15.5V4l6.5 9.2h-6.5"/><path d="M2 21.2c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',voyage:'<path d="M2.5 14.5h19l-2.6 3.6H5.1z"/><path d="M11.5 14.5V3.5l6.5 9h-6.5"/><path d="M6 21c3-1.4 9-1.4 12 0"/>',battle:'<path d="M4.5 19.5 19.5 4.5M4.5 4.5l15 15"/><path d="M16.5 4.5h3v3M7.5 4.5h-3v3"/>',founding:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',construction:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',eruption:'<path d="M2.5 20.5 9 11h6l6.5 9.5z"/><path d="M10.2 8.2c0-2 1-3.1 1.8-4.7.8 1.6 1.8 2.7 1.8 4.7"/><path d="M7 6.5l1.3 1.3M17 6.5l-1.3 1.3"/>',epidemic:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',law:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',treaty:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 15h3"/><path d="M13.5 18.5c1-1 1.8-1 2.8 0"/>',death:'<path d="M3.5 18.5h17"/><path d="M7 18.5a5 5 0 0 1 10 0"/><path d="M12 4.5v5M9.6 7.4 12 9.8l2.4-2.4"/>',protest:'<path d="M6 21V3.5"/><path d="M6 4h11.5l-2.6 4 2.6 4H6"/>',restoration:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',other:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',era:'<path d="M5 13.5h14l-2 2.6H7z"/><path d="M11.5 13.5V3.5l5.5 7.6h-5.5"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',routes:'<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',home:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'};function En(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${jo[s]||jo.other}</svg>`}const Xu=s=>s in jo;class gM{constructor(t,e,n){this.app=e,this.ui=n,this.tl=e.timeline,this.tween=null;const i=this.tl.n;this.el=$e("div",{class:"timeline",role:"group","aria-label":"Time"}),i<2&&this.el.classList.add("single"),i<1&&(this.el.hidden=!0),this.el.innerHTML=`
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${En("prev",16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${En("next",16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${Math.max(0,i-1)}" step="0.001" aria-label="Year" />
      </div>`,t.appendChild(this.el),this.input=cn(".tl-input",this.el),this.backBtn=cn(".tl-back",this.el),this.nextBtn=cn(".tl-next",this.el),this.tourEl=cn(".tl-tour",this.el);const r=cn(".tl-ticks",this.el),a=Math.max(1,Math.ceil(i*46/Math.min(620,innerWidth-60)));this.tl.eras.forEach((o,c)=>{const l=i>1?c/(i-1)*100:50,h=$e("button",{class:"tl-tick",style:`left:${l}%`,title:`${o.label} · ${nr(o.year,o.yearPrecision)}`,"aria-label":o.label,"data-i":c});h.innerHTML=`<i></i>${c%a===0||c===i-1?`<span>${Tt(nr(o.year,o.yearPrecision).replace("c. ",""))}</span>`:""}`,r.appendChild(h)}),this.input.addEventListener("input",()=>{this.tween=null,this.tl.set(Number(this.input.value)),this.ui.onScrub()}),r.addEventListener("click",o=>{const c=o.target.closest(".tl-tick");c&&(this.easeTo(Number(c.dataset.i),.9),this.ui.onScrub(Number(c.dataset.i)))}),this.nextBtn.addEventListener("click",()=>{this.el.classList.remove("invite"),this.ui.tour.next()}),this.backBtn.addEventListener("click",()=>this.ui.tour.back()),this.tl.onChange(()=>this.refresh()),this.refresh()}easeTo(t,e=1){const n=Math.max(0,Math.min(this.tl.max,t));this.tween={from:this.tl.s,to:n,t:0,dur:e}}easeToYear(t,e){this.easeTo(this.tl.sAtYear(t),e)}finish(){this.tween&&(this.tl.set(this.tween.to),this.tween=null)}update(t){const e=this.tween;if(!e)return;e.t=Math.min(1,e.t+t/e.dur);const n=e.t<.5?2*e.t*e.t:1-Math.pow(-2*e.t+2,2)/2;this.tl.set(e.from+(e.to-e.from)*n),e.t>=1&&(this.tween=null)}refresh(){const t=this.tl,e=t.era;cn(".tl-era",this.el).textContent=e?e.label:"",cn(".tl-year",this.el).textContent=e?nr(t.year,e.yearPrecision??1):"",document.activeElement!==this.input&&(this.input.value=String(t.s));const n=t.max>0?t.s/t.max:0;cn(".tl-rail span",this.el).style.width=`${n*100}%`;const i=Math.round(t.s);for(const r of this.el.querySelectorAll(".tl-tick"))r.classList.toggle("on",Number(r.dataset.i)===i)}refreshTour(t){const e=`${t.active}:${t.chapter}:${t.step}:${t.stop}:${t.active?"":t.nearestChapter()}:${t.atEnd}`;if(e===this.tourKey)return;this.tourKey=e;const n=t.describe();if(this.backBtn.disabled=!n||t.atStart,this.nextBtn.disabled=!n||t.atEnd,this.el.classList.toggle("off-tour",!!n&&!n.active),this.tourEl.classList.toggle("opening",!!(n!=null&&n.opening)),!n){this.tourEl.innerHTML="";return}this.tourEl.innerHTML=n.active?`<span class="tl-ch">Chapter <b>${n.number}</b> of ${n.of}</span><i>·</i><em>${Tt(n.name)}</em>${n.step?`<i>·</i><span>${Tt(n.step)}</span>`:""}`:`<span>Next resumes at ${Tt(n.chapter.toLowerCase())}</span><i>·</i><em>${Tt(n.name)}</em>`,this.nextBtn.title=n.active?"Next (→ or space)":`Back to the tour: ${n.chapter.toLowerCase()}, ${n.name}`}}const Ch={exact:0,ahupuaa:22,moku:90,island:260,sea:160},Lh=24;class vM{constructor(t,e,{onOpen:n,onCluster:i}={}){this.app=e,this.onOpen=n,this.onCluster=i,this.layer=$e("div",{class:"pins"}),t.appendChild(this.layer),this.tip=$e("div",{class:"cl-tip",role:"tooltip"}),t.appendChild(this.tip);const r=new Map(e.data.places.map(c=>[c.id,c]));this.places=r,this.items=[];const a=[];for(const c of e.data.events){const l=(c.where||[]).map(f=>r.get(f.place)).find(f=>f&&un(f.geometry)),h=Xo(c);if(!l||!h){a.push(c.id);continue}const[u,d]=e.data.proj.toWorld(un(l.geometry)),g=Xu(c.kind)?c.kind:"other",m=$e("button",{class:"pin",title:c.title,"aria-label":c.title},`<span class="pin-ic">${En(g,16)}</span><span class="pin-label">${Tt(c.title)}</span>`);m.addEventListener("click",f=>{var v;f.stopPropagation(),(v=this.onOpen)==null||v.call(this,c)});const x=Ch[l.placePrecision]??0,p=$e("div",{class:"halo"});this.layer.appendChild(p),this.layer.appendChild(m),this.items.push({ev:c,place:l,x:u,z:d,span:h,start:ga(c)??h[0],el:m,halo:p,soft:x,r:x,pos:new O(u,0,d),shown:!1,active:!1,near:!1,haloShown:!1,tx:NaN,ty:NaN,ts:NaN,hx:NaN,hy:NaN,hr:NaN,ha:NaN})}a.length&&e.warn(`events with no placeable \`where\` or no date, so no pin: ${a.join(", ")}`);const o=this.items.length;this.sx=new Float32Array(o),this.sy=new Float32Array(o),this.vis=new Uint8Array(o),this.root=new Int16Array(o),this.size=new Int16Array(o),this.slot=new Int16Array(o),this.members=new Int16Array(o),this.halos=new Int16Array(o),this.clusters=[],this.nClusters=0,this.hovered=null,this.activeEvent=null,this.stopXZ=null,this._v=new O,this._w=new O}setStopPlace(t){const e=t&&un(t.geometry);this.stopXZ=e?this.app.data.proj.toWorld(e):null,this.stopSoft=t?Ch[t.placePrecision]??0:0}visibleEvents(){const[t,e]=this.app.timeline.window;return this.items.filter(n=>n.span[1]>=t&&n.span[0]<=e).map(n=>n.ev)}marker(t){let e=this.clusters[t];if(e)return e;const n=$e("button",{class:"cluster"},'<span class="cl-n"></span>');return e={el:n,label:n.firstChild,start:0,count:0,x:0,y:0,key:0,shownCount:-1,tipKey:-1,domKey:-1,shown:!1,beside:!1,tx:NaN,ty:NaN,ts:NaN},n.addEventListener("click",i=>{var r;i.stopPropagation(),this.hideTip(),(r=this.onCluster)==null||r.call(this,this.eventsOf(e))}),n.addEventListener("pointerenter",i=>{i.pointerType!=="touch"&&(this.hovered=e,this.showTip(e))}),n.addEventListener("pointerleave",()=>{this.hovered===e&&this.hideTip()}),this.layer.appendChild(n),this.clusters[t]=e,e}eventsOf(t){const e=[];for(let n=0;n<t.count;n++)e.push(this.items[this.members[t.start+n]]);return e.sort((n,i)=>n.start-i.start).map(n=>n.ev)}groups(){return this.clusters.slice(0,this.nClusters).map(t=>({ids:this.eventsOf(t).map(e=>e.id),count:t.count,x:t.x,y:t.y,beside:t.beside}))}showTip(t){t.tipKey=t.key;const e=this.eventsOf(t).map(n=>`<div class="tip-row"><span class="tip-y">${Tt(Wu(n))}</span><b>${Tt(n.title)}</b></div>`).join("");this.tip.innerHTML=`<div class="tip-head">${t.count} events here</div>${e}<div class="tip-foot">click for the list</div>`,this.tip.classList.add("show"),this.tipX=this.tipY=NaN,this.placeTip(t)}placeTip(t){const e=this.tip.offsetWidth||220,n=this.tip.offsetHeight||120;let i=t.x+22;i+e>innerWidth-10&&(i=t.x-22-e);const r=Math.max(64,Math.min(innerHeight-n-10,t.y-44-n/2)),a=Math.round(i),o=Math.round(r);a===this.tipX&&o===this.tipY||(this.tipX=a,this.tipY=o,this.tip.style.transform=`translate(${a}px, ${o}px)`)}hideTip(){this.hovered=null,this.tip.classList.remove("show")}find(t){const e=this.root;for(;e[t]!==t;)e[t]=e[e[t]],t=e[t];return t}put(t,e,n,i){Math.abs(e-t.tx)<.05&&Math.abs(n-t.ty)<.05&&i===t.ts||(t.tx=e,t.ty=n,t.ts=i,t.el.style.transform=`translate(${e.toFixed(1)}px, ${n.toFixed(1)}px) scale(${i.toFixed(3)})`)}update(t){const e=this.app,n=e.camera,i=innerWidth,r=innerHeight,a=e.timeline,o=a.yearAt(a.s-.5),c=a.yearAt(a.s+.5),l=e.rig.state.distance,h=Math.round(Math.max(.62,Math.min(1,1.18-Math.log(Math.max(1,l)/120)*.13))*200)/200,u=this.items,d=u.length,{sx:g,sy:m,vis:x,root:p,size:f}=this,v=this.activeEvent,_=this._v;let M=-1;for(let y=0;y<d;y++){const b=u[y],R=b.ev===v,P=R&&this.stopXZ;b.pos.x=P?this.stopXZ[0]:b.x,b.pos.z=P?this.stopXZ[1]:b.z,b.pos.y=e.world.heightAt(b.pos.x,b.pos.z)+.02,b.r=P?this.stopSoft:b.soft;let F=t&&(R||b.span[1]>=o&&b.span[0]<=c);F&&(_.copy(b.pos).project(n),g[y]=(_.x+1)/2*i,m[y]=(1-_.y)/2*r,F=_.z<1&&g[y]>-60&&g[y]<i+60&&m[y]>84&&m[y]<r+40),x[y]=F?1:0,F&&R&&(M=y),p[y]=y,f[y]=0}const w=Lh*Lh;for(let y=0;y<d;y++)if(!(!x[y]||y===M))for(let b=y+1;b<d;b++){if(!x[b]||b===M)continue;const R=g[y]-g[b],P=m[y]-m[b];if(R*R+P*P<w){const F=this.find(y),I=this.find(b);F!==I&&(p[Math.max(F,I)]=Math.min(F,I))}}for(let y=0;y<d;y++)x[y]&&y!==M&&f[this.find(y)]++;let S=0,E=0;for(let y=0;y<d;y++){if(!x[y]||y===M||p[y]!==y||f[y]<2)continue;const b=this.marker(S);this.slot[y]=S++,b.start=E,b.count=0,b.x=0,b.y=0,b.key=0,E+=f[y]}for(let y=0;y<d;y++){if(!x[y]||y===M)continue;const b=this.find(y);if(f[b]<2)continue;const R=this.clusters[this.slot[b]];this.members[R.start+R.count++]=y,R.x+=g[y],R.y+=m[y],R.key=(R.key*61+y+1)%1000003}for(let y=0;y<d;y++){const b=u[y],R=x[y]===1&&(y===M||f[this.find(y)]<2);R!==b.shown&&(b.shown=R,b.el.classList.toggle("show",R));const P=b.ev===v;if(P!==b.active&&(b.active=P,b.el.classList.toggle("active",P)),!R)continue;const F=l<260||P;F!==b.near&&(b.near=F,b.el.classList.toggle("near",F)),this.put(b,g[y],m[y],h)}for(let y=0;y<S;y++){const b=this.clusters[y];b.x/=b.count,b.y/=b.count;const R=M>=0&&Math.abs(b.x-g[M])<30&&Math.abs(b.y-m[M])<30;if(R&&(b.x=g[M]-36*h,b.y=m[M]),R!==b.beside&&(b.beside=R,b.el.classList.toggle("beside",R)),b.count!==b.shownCount&&(b.shownCount=b.count,b.label.textContent=String(b.count),b.el.setAttribute("aria-label",`${b.count} events here`)),b.key!==b.domKey){b.domKey=b.key;let P="";for(let F=0;F<b.count;F++)P+=`${F?" ":""}${u[this.members[b.start+F]].ev.id}`;b.el.dataset.events=P}b.shown||(b.shown=!0,b.el.classList.add("show")),this.put(b,b.x,b.y,h),this.hovered===b&&(b.key!==b.tipKey?this.showTip(b):this.placeTip(b))}for(let y=S;y<this.clusters.length;y++){const b=this.clusters[y];this.hovered===b&&this.hideTip(),b.shown&&(b.shown=!1,b.count=0,b.el.classList.remove("show"))}this.nClusters=S;let C=0;for(let y=0;y<d;y++){const b=u[y];let R=x[y]===1&&b.r>0;for(let z=0;R&&z<C;z++){const N=u[this.halos[z]];Math.abs(N.pos.x-b.pos.x)<.5&&Math.abs(N.pos.z-b.pos.z)<.5&&N.r>=b.r&&(R=!1)}if(R!==b.haloShown&&(b.haloShown=R,b.halo.classList.toggle("show",R)),!R)continue;this.halos[C++]=y,this._w.copy(n.position).sub(b.pos).normalize();const P=this._w.cross(n.up).normalize().multiplyScalar(b.r).add(b.pos);P.project(n);const F=Math.max(6,Math.min(400,Math.hypot((P.x+1)/2*i-g[y],(1-P.y)/2*r-m[y])));Math.abs(g[y]-b.hx)<.05&&Math.abs(m[y]-b.hy)<.05&&Math.abs(F-b.hr)<.05||(b.hx=g[y],b.hy=m[y],b.hr=F,b.halo.style.transform=`translate(${g[y].toFixed(1)}px, ${m[y].toFixed(1)}px) scale(${F.toFixed(1)})`);const I=Math.round(Math.max(.3,Math.min(1,70/F))*100)/100;I!==b.ha&&(b.ha=I,b.halo.style.setProperty("--halo",I.toFixed(2)))}}}const xM={arrival:"arrival",battle:"battle",founding:"founding",construction:"construction",eruption:"eruption",epidemic:"epidemic",law:"law",treaty:"treaty",voyage:"voyage",death:"death",protest:"protest",restoration:"restoration",other:"event"},Ph=s=>Xu(s.kind)?s.kind:"other";function _M(s){const t=String(s).match(/^(in the time of)(\s+)(.+)$/i);return t?{lead:t[1],gap:t[2],name:t[3]}:{lead:"",gap:"",name:String(s)}}class MM{constructor(t,e,n){this.app=e,this.ui=n,this.el=$e("section",{class:"card","aria-live":"polite"}),t.appendChild(this.el),this.places=new Map(e.data.places.map(i=>[i.id,i])),this.sources=new Map(e.data.sources.map(i=>[i.id,i])),this.events=new Map(e.data.events.map(i=>[i.id,i])),this.mode=null,this.ev=null,this.stop=-1,this.chapter=null,this.list=null,this.el.addEventListener("click",i=>this.click(i))}get isOpen(){return this.el.classList.contains("show")}open(t){this.set("event",{ev:t})}setStop(t){this.stop=t,this.render()}openEra(t){this.set("era",{chapter:t})}openList(t){this.set("cluster",{list:t})}set(t,{ev:e=null,chapter:n=null,list:i=null}){this.mode=t,this.ev=e,this.chapter=n,this.list=i,this.stop=-1,this.render()}close(){var e,n;const t=this.ev;this.el.classList.remove("show"),this.mode=null,this.ev=null,this.chapter=null,this.list=null,(n=(e=this.ui).onCardClosed)==null||n.call(e,t)}click(t){const e=t.target.closest("button");if(!e||!this.el.contains(e))return;const n=this.ui.tour;if(e.classList.contains("card-close"))this.close();else if(e.classList.contains("prev"))n.back();else if(e.classList.contains("next"))n.next();else if(e.dataset.ev){const i=this.events.get(e.dataset.ev);i&&n.open(i,{gentle:this.mode==="cluster"})}}sourceLine(t){const e=typeof t=="string"?t:t.id,n=this.sources.get(e),i=typeof t=="object"&&t.where?`, ${Tt(t.where)}`:"";if(!n)return`<li><span class="src-title">${Tt(e)}</span>${i} <span class="flag missing" title="not in sources.json">missing</span></li>`;const r=n.url&&/^https?:/.test(n.url)?`<a href="${Tt(n.url)}" target="_blank" rel="noopener">${Tt(n.title)}</a>`:Tt(n.title),a=n.opened===!1?' <span class="flag" title="Not yet read at the source: check this before relying on it">verify</span>':"",o=n.author?`${Tt(n.author)}, `:"",c=n.year?` (${Tt(n.year)})`:"";return`<li>${o}<span class="src-title">${r}</span>${c}${i}${a}</li>`}sourcesSection(t){return`<div class="card-sec"><h2>Sources</h2><ul class="sources">${(t||[]).map(e=>this.sourceLine(e)).join("")||'<li class="none">none listed</li>'}</ul></div>`}eventRows(t,{gloss:e=!0}={}){return t.map(n=>`<li><button class="ev-row" data-ev="${Tt(n.id)}">
          <span class="ev-ic">${En(Ph(n),16)}</span>
          <span class="ev-y">${Tt(Wu(n))}</span>
          <span class="ev-t"><b>${Tt(n.title)}</b>${e&&n.gloss?`<em>${Tt(n.gloss)}</em>`:""}</span>
        </button></li>`).join("")}footer(){var r;const t=this.ui.tour;if(!(t!=null&&t.active))return"";const e=t.current;let n,i="Next";if(this.mode==="era"&&this.chapter===e&&t.step<0)n=`<span class="ch-count">Chapter <b>${e.index+1}</b> of ${t.chapters.length}</span>`;else if(this.mode==="event"&&this.ev&&this.ev===t.event){const a=((r=this.ev.stops)==null?void 0:r.length)||0;t.stop>=0?n=Tt(`stop ${t.stop+1} of ${a}`):(n=Tt(`${t.step+1} of ${e.events.length} in chapter ${e.index+1}`),a&&(i=`Walk ${a} stops`))}else return"";return`<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${t.atStart?"disabled":""}>${En("prev",18)}</button>
      <span class="count">${n}</span>
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${t.atEnd?"disabled":""}><span>${Tt(i)}</span>${En("next",18)}</button>
    </footer>`}render(){if(this.mode==="era")this.el.innerHTML=this.eraHTML();else if(this.mode==="cluster")this.el.innerHTML=this.clusterHTML();else if(this.mode==="event"&&this.ev)this.el.innerHTML=this.eventHTML();else return;this.el.dataset.mode=this.mode,this.el.classList.toggle("chapter",this.mode==="era"),this.el.classList.add("show"),this.el.scrollTop=0}header(t,e,n){return`<header>
        <div class="card-icon">${En(t,26)}</div>
        <div class="card-titles"><h1>${Tt(e)}</h1>${n?`<p class="gloss">${Tt(n)}</p>`:""}</div>
        <button class="card-close" aria-label="Close">${En("close",18)}</button>
      </header>`}eventHTML(){const t=this.ev,e=(t.where||[]).map(c=>{const l=this.places.get(c.place);return l?`${Tt(l.name)}${c.role?` <em>${Tt(c.role)}</em>`:""}`:null}).filter(Boolean),n=Object.entries(t.confidence||{}).map(([c,l])=>`<span class="conf ${Tt(l)}"><b>${Tt(c)}</b> ${Tt(l)}</span>`).join(""),i=(t.tellings||[]).map(c=>{var l;return`<li><span class="src-title">${Tt(((l=this.sources.get(c.source))==null?void 0:l.title)||c.source)}</span>: ${Tt(c.says)}</li>`}).join(""),r=t.stops||[],a=this.stop>=0?r[this.stop]:null,o=a?this.places.get(a.place):null;return`
      ${this.header(Ph(t),t.title,t.gloss)}
      <div class="card-meta"><span class="when">${Tt(fM(t))}</span><span class="kind">${Tt(xM[t.kind]||t.kind||"event")}</span></div>
      ${e.length?`<div class="card-where">${e.join("<i>·</i>")}</div>`:""}
      ${a?`<div class="stop"><div class="stop-n">${this.stop+1} / ${r.length}${o?` · ${Tt(o.name)}`:""}</div><p>${Tt(a.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${Tt(t.summary)}</p>`:""}</div>
      ${n?`<div class="card-conf">${n}</div>`:""}
      ${i?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${i}</ul></div>`:""}
      ${this.sourcesSection(t.sources)}
      ${this.footer()}`}eraHTML(){const t=this.chapter,e=t.era,n=_M(e.label||e.id),r=String(e.note||"").match(/^([ʻʼ'‘“"(]*.)([\s\S]*)$/u),a=r?`<p><span class="initial">${Tt(r[1])}</span>${Tt(r[2])}</p>`:"";return`
      <header class="ch-head">
        <div class="ch-mark"><span class="ch-word">Chapter</span><span class="ch-num">${t.index+1}</span></div>
        <h1 class="ch-title">${n.lead?`<span class="ch-lead">${Tt(n.lead)}</span>${Tt(n.gap)}`:""}<span class="ch-name">${Tt(n.name)}</span></h1>
        <div class="ch-year">${Tt(nr(e.year,Math.max(10,e.yearPrecision??10)))}</div>
        <button class="card-close" aria-label="Close">${En("close",18)}</button>
      </header>
      <div class="card-body ch-note">${a}</div>
      ${t.events.length?`<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(t.events,{gloss:!1})}</ul></div>`:""}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`}clusterHTML(){const t=this.list||[],e=[];for(const i of t){const r=(i.where||[]).map(a=>this.places.get(a.place)).find(Boolean);r&&!e.includes(r.name)&&e.push(r.name)}const n=e.length>4?`${e.slice(0,4).join(" · ")} · and ${e.length-4} more`:e.join(" · ");return`
      ${this.header("pins",`${t.length} events`,n)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(t)}</ul></div>`}}const Ti={far:2600,island:520,near:70},Ao={far:0,island:1,near:2},yM=1500,us=(s,t,e)=>Math.max(t,Math.min(e,s)),wM=new Set(["law","epidemic","restoration"]);function bM(s){return(s==null?void 0:s.view)==="land"||(s==null?void 0:s.view)==="chiefdoms"?s.view:s&&wM.has(s.kind)?"land":"chiefdoms"}function SM(s){return s.short?s.short:String(s.label||s.id).replace(/^in the time of\s+/i,"").split(/,| and the /)[0].trim()}function Dh(s){let t=null;for(const e of s||[])e in Ao&&(t===null||Ao[e]>Ao[t])&&(t=e);return t||"island"}class EM{constructor(t,e){this.app=t,this.ui=e,this.places=new Map(t.data.places.map(n=>[n.id,n])),this.islands=new Map(t.data.packs.filter(n=>n!==t.world.archPack).map(n=>[n.id,n])),this.chapters=this.build(),this.active=!1,this.chapter=0,this.step=-1,this.stop=-1,this.listeners=[]}build(){const t=this.app,e=t.timeline,n=new Map(e.eras.map((o,c)=>[o.id,c])),i=e.eras.map((o,c)=>({era:o,index:c,name:SM(o),events:[],island:null}));if(!i.length)return i;const r=[],a=i.map(()=>[]);return t.data.events.forEach((o,c)=>{const l=ga(o);if(l===null)return;let h=n.get(o.era);h===void 0&&(h=Math.round(e.sAtYear(l)),r.push(o.id)),a[h].push({ev:o,start:l,order:c})}),r.length&&t.warn(`events whose era is not in eras.json, placed in a chapter by date: ${r.join(", ")}`),i.forEach((o,c)=>{o.events=a[c].sort((l,h)=>l.start-h.start||l.order-h.order).map(l=>l.ev),o.island=this.gathering(o.events)}),i}gathering(t){const e=new Map;let n=0;for(const a of t){const o=this.placeOf(a);o&&(n++,o.island&&this.islands.has(o.island)&&e.set(o.island,(e.get(o.island)||0)+1))}let i=null,r=0;for(const[a,o]of e)o>r&&([i,r]=[a,o]);return i&&r>=2&&r>=n*.7?i:null}placeOf(t){for(const e of t.where||[]){const n=this.places.get(e.place);if(n&&un(n.geometry))return n}return null}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}get current(){return this.chapters[this.chapter]||null}get event(){var t;return this.step>=0&&((t=this.current)==null?void 0:t.events[this.step])||null}get state(){var t;return{active:this.active,chapter:this.chapter,step:this.step,stop:this.stop,event:((t=this.event)==null?void 0:t.id)??null}}get atStart(){return this.active&&this.chapter===0&&this.step<0}get atEnd(){var r;const t=this.chapters.length;if(!t)return!0;if(!this.active)return!1;const e=this.current,n=this.event,i=n?(((r=n.stops)==null?void 0:r.length)||0)-1:-1;return this.chapter===t-1&&this.step===e.events.length-1&&this.stop>=i}nearestChapter(){return us(Math.round(this.app.timeline.s),0,this.chapters.length-1)}begin(){this.goTo(0,-1,{jump:!0})}next(){var e;if(!this.chapters.length)return;if(!this.active)return this.goTo(this.nearestChapter(),-1);const t=this.event;if(t&&this.stop<(((e=t.stops)==null?void 0:e.length)||0)-1)return this.goStop(this.stop+1);if(this.step<this.current.events.length-1)return this.goTo(this.chapter,this.step+1);if(this.chapter<this.chapters.length-1)return this.goTo(this.chapter+1,-1)}back(){if(this.chapters.length){if(!this.active)return this.goTo(this.nearestChapter(),-1);if(this.event&&this.stop>0)return this.goStop(this.stop-1);if(this.event&&this.stop===0)return this.goTo(this.chapter,this.step);if(this.step>0)return this.goTo(this.chapter,this.step-1,{stop:"last"});if(this.step===0)return this.goTo(this.chapter,-1);if(this.chapter>0){const t=this.chapters[this.chapter-1];return this.goTo(this.chapter-1,t.events.length-1,{stop:"last"})}}}skip(t){if(!this.chapters.length)return;const e=this.active?this.chapter:this.nearestChapter(),n=t<0&&this.active&&this.step>=0?e:e+t;n>=0&&n<this.chapters.length&&this.goTo(n,-1)}leave(){this.active&&(this.active=!1,this.notify())}locate(t){for(let e=0;e<this.chapters.length;e++){const n=this.chapters[e].events.indexOf(t);if(n>=0)return[e,n]}return null}open(t,{gentle:e=!1}={}){const n=this.locate(t);if(n)return this.goTo(n[0],n[1],{gentle:e});this.ui.pins.activeEvent=t,this.ui.pins.setStopPlace(null),this.ui.card.open(t),this.fly(this.gentleView(t))}goTo(t,e=-1,{jump:n=!1,gentle:i=!1,stop:r=-1}={}){var o;const a=this.chapters[t];if(a){if(this.active=!0,this.chapter=t,this.step=us(e,-1,a.events.length-1),this.stop=-1,this.step<0)this.showEra(a,n);else{const c=a.events[this.step],l=((o=c.stops)==null?void 0:o.length)||0;if(r==="last"&&l)return this.goStop(l-1,{jump:n});this.showEvent(c,{jump:n,gentle:i})}this.notify()}}applyView(t){this.app.viewChosen||this.app.setView(bM(t))}showEra(t,e){const n=this.ui;this.applyView(null),n.pins.activeEvent=null,n.pins.setStopPlace(null),n.card.openEra(t);const i=t.island?this.islandView(t.island,this.homeYaw()):this.chainView();this.setS(t.index,this.fly(i,e),e)}showEvent(t,{jump:e,gentle:n}){const i=this.ui;this.applyView(t),this.prefetch(t),i.pins.activeEvent=t,i.pins.setStopPlace(null),i.card.open(t);const r=this.fly(n?this.gentleView(t):this.eventView(t),e),a=this.app.timeline,[o,c]=a.window,l=Xo(t);n&&l&&l[1]>=o&&l[0]<=c||this.setYear(this.stepYear(t,this.current),r,e)}goStop(t,{jump:e=!1}={}){const n=this.event,i=(n==null?void 0:n.stops)||[];if(!n||t<-1||t>=i.length)return;const r=this.ui;this.active=!0,this.stop=t,this.applyView(n),r.pins.activeEvent=n,r.card.ev!==n&&r.card.open(n),r.card.setStop(t);const a=i[t],o=a?this.places.get(a.place):null,c=o&&un(o.geometry);if(r.pins.setStopPlace(c?o:null),this.prefetch(n),a){const l=c?a.camera?this.cameraView(o,a.camera):this.pointView(o,Ti[a.zoom]??Ti.island):null,h=this.fly(l,e);Number.isFinite(a.year)&&this.setYear(a.year,h,e)}this.notify()}prefetch(t){const e=this.app.districts;if(e)for(const n of(t==null?void 0:t.stops)||[]){const i=this.places.get(n.place),r=i&&un(i.geometry);if(!r||n.zoom==="far")continue;const[a,o]=this.app.data.proj.toWorld(r);if(e.prefetch(a,o))return}}stepYear(t,e){const n=this.app.timeline,i=ga(t),r=Xo(t)||[i,i],a=n.yearAt(e.index-.5),o=n.yearAt(e.index+.5);return i>=a&&i<=o?i:r[1]>=a&&r[0]<=o?us(e.era.year,Math.max(r[0],a),Math.min(r[1],o)):i}setYear(t,e,n){this.setS(this.app.timeline.sAtYear(t),e,n)}setS(t,e,n){const i=this.ui.timeline;n?(i.tween=null,this.app.timeline.set(t)):i.easeTo(t,us(e*.8,.6,2.4))}homeYaw(t=this.ui.freeBox()){return this.chainView(t).yaw}tilt(){const t=this.app.rig.goal;return us(t.pitch-Pi(t.distance),-.3,.3)}chainView(t=this.ui.freeBox()){const e=this.app.rig,n=this.app.world.chainShape(),i=e.fit({points:n.hull,along:[n.from,n.to],box:t,reach:Hu});return e.reach(i.distance),i}islandView(t,e=this.app.rig.goal.yaw,n=0){const i=this.islands.get(t);return this.app.rig.fit({rect:i.rect,yaw:e,tilt:n,box:this.ui.freeBox()})}pointView(t,e,{towardChain:n=0}={}){let[i,r]=this.app.data.proj.toWorld(un(t.geometry));if(n){const c=this.app.world.bounds,l=(c.x0+c.x1)/2-i,h=(c.z0+c.z1)/2-r,u=Math.min(n,900/Math.max(1,Math.hypot(l,h)));i+=l*u,r+=h*u}const a=this.ui.freeBox(),o=n?this.homeYaw(a):this.app.rig.goal.yaw;return this.app.rig.fit({rect:{x0:i,x1:i,z0:r,z1:r},distance:e,yaw:o,tilt:this.tilt(),box:a})}cameraView(t,e){const[n,i]=this.app.data.proj.toWorld(un(t.geometry));return this.app.rig.fit({rect:{x0:n,x1:n,z0:i,z1:i},distance:e.distance,yaw:-e.bearing*Math.PI/180,pitch:e.pitch*Math.PI/2,box:this.ui.freeBox()})}eventView(t){const e=this.placeOf(t);if(!e)return null;const n=Dh(t.zoom);return n==="near"?this.pointView(e,Ti.near):n==="island"&&this.islands.has(e.island)?this.islandView(e.island,this.app.rig.goal.yaw,this.tilt()):n==="island"?this.pointView(e,Ti.island):!e.island&&e.placePrecision==="island"?this.chainView():this.pointView(e,this.farDistance(),{towardChain:.35})}farDistance(t=this.ui.freeBox()){const e=Math.tan(this.app.camera.fov*Math.PI/360),n=Math.max(60,Math.min(t.x1-t.x0,t.y1-t.y0));return Math.max(Ti.far,yM*innerHeight/(2*e*n))}gentleView(t){const e=this.placeOf(t);if(!e)return null;const n=Ti[Dh(t.zoom)];return this.pointView(e,Math.min(this.app.rig.goal.distance,Math.max(n,Ti.island)))}fly(t,e=!1){if(!t)return 1;const n=this.app.rig;if(e)return n.jump({x:t.target.x,z:t.target.z,distance:t.distance,yaw:t.yaw,pitch:t.pitch}),0;const i=n.goal,r=Math.hypot(i.target.x-t.target.x,i.target.z-t.target.z),a=Math.abs(Math.log(t.distance/Math.max(1,i.distance))),o=us(1.1+Math.sqrt(r)*.032+a*.28,1.1,3.4),c=this.app.districts,l=c&&t.distance<130?c.prefetch(t.target.x,t.target.z):null;return n.flyTo(t,o,l?{ready:()=>c.readyAt(t.target.x,t.target.z)}:{}),o}describe(){const t=this.chapters.length?this.chapters[this.active?this.chapter:this.nearestChapter()]:null;return t?{active:this.active,opening:this.active&&this.step<0,number:t.index+1,of:this.chapters.length,chapter:`Chapter ${t.index+1} of ${this.chapters.length}`,name:t.name,step:this.active&&this.step>=0?`${this.step+1} of ${t.events.length}`:""}:null}}const AM=.05,Ih=.25;class TM{constructor(t){if(this.app=t,t.ui=this,this.build(),this.bind(),t.updaters.push(e=>this.update(e)),!t.params.has("year")&&!t.params.has("cam")&&this.tour.chapters.length)this.tour.begin(),this.timeline.el.classList.add("invite");else if(!t.params.has("cam")){const e=this.tour.chainView();t.rig.jump({x:e.target.x,z:e.target.z,distance:e.distance,yaw:e.yaw,pitch:e.pitch})}}build(){const t=this.app,e=$e("div",{id:"ui"});document.body.appendChild(e),this.root=e;const n=t.world.archPack.name;this.brand=$e("div",{class:"brand"},`<div class="brand-name">Holo i ke Au</div><div class="brand-sub"><span class="where">${Tt(n)}</span><span class="loading"></span></div>`),e.appendChild(this.brand),this.tools=$e("div",{class:"tools"});const i=(a,o,c,l)=>$e("button",{class:`tool${l?" on":""}`,"data-tool":a,title:c,"aria-label":c,"aria-pressed":String(!!l)},En(o,20));this.tools.append(i("lines","lines","Moku and ahupuaʻa boundaries",t.overlay.lines),i("routes","routes","Every voyage, fleet and ship at sea in these years",t.overlay.routes),i("pins","pins","Events",t.overlay.pins),i("home","home","The whole chain"),i("help","help","About"),i("full","expand","Full screen")),e.appendChild(this.tools),this.legend=$e("div",{class:"legend"}),this.legend.innerHTML=`
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
      </div>
      <div class="lg-body"></div>`,this.legendBody=cn(".lg-body",this.legend),this.legend.inert=!0,e.appendChild(this.legend),this.inspector=$e("div",{class:"inspector"}),e.appendChild(this.inspector),this.timeline=new gM(e,t,this),this.pins=new vM(e,t,{onOpen:a=>this.openEvent(a),onCluster:a=>this.openCluster(a)}),this.card=new MM(e,t,this),this.tour=new EM(t,this),t.tour=this.tour,this.tour.onChange(a=>this.timeline.refreshTour(a)),t.timeline.onChange(()=>this.timeline.refreshTour(this.tour)),this.timeline.refreshTour(this.tour),this.help=$e("div",{class:"help hidden"});const r=this.credits();this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${En("close",18)}</button>
        <h2>Holo i ke Au</h2>
        <p><em>Holo i ke au</em>: sail on the current, into the era. <em>Au</em> is both a period of time and a current, and the title rides it.</p>
        <p>The Hawaiian Islands from real terrain, across the eras from the first canoes to 1898. Far out, each moku takes the colour of the chiefdom or kingdom that held it; close in, the boundaries of moku and ahupuaʻa lie on the land. Pins are events of the chosen era: open one for its story, how sure the record is, and its sources. A number stands for several events in one spot; open it for the list. A source marked <span class="flag">verify</span> has not yet been read at the source.</p>
        <p>The switch on the legend turns the far view from the <b>Chiefdoms</b> to the <b>Land</b>: where it was cultivated, where people lived and how many, and the native forest, in the chosen year, blended between layers made for 1778, 1853, 1896 and now. A layer marked <em>modelled</em> was drawn by a written rule where no map of its time exists.</p>
        <p><b>Next</b> walks the story an era at a time: each era opens with its card, then its events in order, the year and the camera moving to each. Look around as you like between steps; the timeline is free too, and Next picks the story up again from the nearest era.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> era by era</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span>
        </div>
        ${r?`<h3>Data</h3><ul class="credits">${r}</ul>`:""}
        <div class="land-credits"></div>
      </div>`,e.appendChild(this.help),this.refreshLegend()}credits(){var i,r;const t=this.app.data,e=new Map,n=a=>{a&&a.id&&!e.has(a.id)&&e.set(a.id,a)};for(const a of t.packs)for(const o of a.sources||[])n(o);for(const a of((i=t.moku)==null?void 0:i.sources)||[])n(a);for(const a of((r=t.ahupuaa)==null?void 0:r.sources)||[])n(a);return Nh([...e.values()])}landCredits(){const t=cn(".land-credits",this.help),e=this.app.land.manifest;if(!t||!e||t.childElementCount)return;const n=new Map;for(const i of Object.values(e.methods||{}))for(const r of Object.values(i||{}))for(const a of(r==null?void 0:r.sources)||[])a!=null&&a.id&&/^https?:/.test(a.url||"")&&!n.has(a.id)&&n.set(a.id,a);n.size&&(t.innerHTML=`<h3>Land layers</h3><ul class="credits">${Nh([...n.values()])}</ul>`)}bind(){const t=this.app;this.tools.addEventListener("click",i=>{var o,c,l;const r=i.target.closest("[data-tool]");if(!r)return;const a=r.dataset.tool;if(a==="help")this.help.classList.toggle("hidden");else if(a==="full")document.fullscreenElement?(o=document.exitFullscreen)==null||o.call(document):(l=(c=document.documentElement).requestFullscreen)==null||l.call(c).catch(()=>{});else if(a==="home"){const h=t.rig;h.home=this.tour.chainView(),h.flyTo({target:h.home.target,distance:h.home.distance,yaw:h.home.yaw,pitch:h.home.pitch},3)}else a in t.overlay&&(t.overlay[a]=!t.overlay[a],r.classList.toggle("on",t.overlay[a]),r.setAttribute("aria-pressed",String(t.overlay[a])))}),this.legend.addEventListener("click",i=>{const r=i.target.closest("[data-view]");if(!r||r.disabled)return;const a=r.dataset.view;t.setView(t.view===a?null:a,{user:!0})}),t.onView(()=>this.refreshLegend()),t.land.onChange(()=>{this.refreshLegend(),this.landCredits()}),this.help.addEventListener("click",i=>{(i.target===this.help||i.target.closest(".help-close"))&&this.help.classList.add("hidden")}),t.timeline.onChange(()=>{t.timeline.era!==this.legendEra&&this.refreshLegend()});const e=t.canvas;let n=0;e.addEventListener("pointermove",i=>{if(i.buttons||i.pointerType==="touch")return this.hover(null);const r=performance.now();r-n<70||(n=r,this.hover(i.clientX,i.clientY))}),e.addEventListener("pointerleave",()=>this.hover(null)),e.addEventListener("pointerdown",()=>this.hover(null)),addEventListener("keydown",i=>{var a,o,c,l;if(i.key==="Escape"){this.help.classList.contains("hidden")?this.card.close():this.help.classList.add("hidden");return}if((o=(a=i.target).closest)!=null&&o.call(a,"input, textarea, select")||i.altKey||i.ctrlKey||i.metaKey||!this.help.classList.contains("hidden"))return;const r=this.tour;i.key==="ArrowRight"||i.key===" "&&!((l=(c=i.target).closest)!=null&&l.call(c,"button, a"))?(i.preventDefault(),this.timeline.el.classList.remove("invite"),r.next()):i.key==="ArrowLeft"?(i.preventDefault(),r.back()):i.key===","||i.key==="<"?r.skip(-1):(i.key==="."||i.key===">")&&r.skip(1)})}openEvent(t){this.tour.open(t,{gentle:!0})}openCluster(t){const e=this.tour;this.pins.activeEvent=e.active?e.event:null,this.card.openList(t)}onCardClosed(){const t=this.tour;t.active&&t.event||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}onScrub(t=this.app.timeline.s){var i;this.tour.leave();const n=this.app.timeline;this.card.mode==="era"&&((i=this.card.chapter)==null?void 0:i.era)!==n.eras[Math.round(Math.max(0,Math.min(n.max,t)))]&&this.card.close(),this.card.ev||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}freeBox(){const t=innerWidth,e=innerHeight,n={x0:16,y0:72,x1:t-16,y1:e-16},i=this.timeline.el;!i.hidden&&i.offsetHeight&&(n.y1=Math.min(n.y1,i.offsetTop-14));const r=this.card.el;if(this.syncCarded(),this.card.isOpen&&r.offsetWidth)if(r.offsetLeft>t*.35)n.x1=Math.min(n.x1,r.offsetLeft-16);else{n.y1=Math.min(n.y1,r.offsetTop-12);const a=this.legend;a.offsetHeight&&a.offsetTop<e/3&&(n.y0=Math.max(n.y0,a.offsetTop+a.offsetHeight+6))}return n.y1-n.y0<120&&(n.y1=n.y0+120),n}syncCarded(){const t=this.card.isOpen;t!==this.root.classList.contains("carded")&&this.root.classList.toggle("carded",t)}farStrength(t=this.app.rig.state.distance){return this.app.view==="land"?qo(t):va(t)}inspectorAllowed(){var i,r;const t=this.app,e=this.farStrength();return!!((i=t.districts)!=null&&i.on||((r=t.districts)==null?void 0:r.k)>0)||e<AM?this.nearHeld=!0:e>Ih&&(this.nearHeld=!1),!this.nearHeld}hideInspector(){this.app.shared.uniforms.uHoverMoku.value=0,this.inspector.classList.remove("show"),this.inspectorKey=null}hover(t,e){var g;const n=this.app,i=n.shared.uniforms;if(t==null||!this.inspectorAllowed())return this.hideInspector();const r=n.rig.pickGround(t,e),a=r&&n.world.metresAt(r.x,r.z)>0?n.polity.mokuAt(r.x,r.z):null,o=n.view==="land"&&n.landK>.25,c=va(n.rig.state.distance)<.05;if(i.uHoverMoku.value=a&&!o&&!c?a.index:0,!a){this.inspector.classList.remove("show");return}const l=o?n.land.valuesAt(r.x,r.z):null,h=`${a.index}:${(g=n.timeline.era)==null?void 0:g.id}:${l?JSON.stringify(l):""}`;if(this.inspectorKey!==h){this.inspectorKey=h;const m=n.polity.holder(n.timeline.era,a),x=(p,f)=>`<div class="in-row"><span class="in-k">${p}</span>${f}</div>`;this.inspector.innerHTML=`
        <div class="in-head"><b>${Tt(a.name)}</b><span class="in-island">${Tt(a.island||"")}</span></div>
        ${x("moku",m?`<span class="in-pol"><i style="background:${Tt(m.colour)}"></i>${Tt(m.name)}</span>`:'<span class="in-none">no polity recorded</span>')}
        ${l?x("fields",Uh(l.cultivation))+x("people",RM(l.people))+x("forest",Uh(l.forest)):""}`}this.inspector.classList.add("show");const u=Math.min(innerWidth-250,t+18),d=Math.max(70,Math.min(innerHeight-120,e+18));this.inspector.style.transform=`translate(${u}px, ${d}px)`}refreshLegend(){const t=this.app,e=t.timeline.era;this.legendEra=e;for(const r of this.legend.querySelectorAll("[data-view]"))r.setAttribute("aria-pressed",String(t.view===r.dataset.view)),r.classList.toggle("on",t.view===r.dataset.view);const n=cn('[data-view="land"]',this.legend);n.disabled=t.land.available===!1,n.title=n.disabled?"No land layers in this data":"Cultivation, settlement and forest in the chosen year";let i="";if(t.view==="chiefdoms"){const r=t.polity.politiesIn(e);r.length&&(i=`<div class="lg-title">${Tt((e==null?void 0:e.label)||"")}</div>${r.map(a=>`<div class="lg"><i style="background:${Tt(a.colour)}"></i><b>${Tt(a.name)}</b></div>`).join("")}`)}else if(t.view==="land"){const r=t.land.describe();if(this.legendLand=JSON.stringify(r),r){const a=r.years.length>1?`between the ${r.years[0]} and ${r.years[1]} layers`:`the ${r.years[0]} layers`,o=t.land.bound?r.early?`${a}, thinned for the early centuries`:a:"the layers are on their way";i=`<div class="lg-title">${Tt((e==null?void 0:e.label)||"")}</div>${r.layers.map(c=>`<div class="lg lg-land"><i class="sw-${c.id}"></i><b>${Tt(c.name)}</b>${c.note?`<em>${Tt(c.note)}</em>`:""}</div>`).join("")}<div class="lg-note">${Tt(o)}</div>`}}this.legendBody.innerHTML=i}setLoading(t){cn(".loading",this.brand).textContent=t||""}update(t){const e=this.app,n=performance.now();this.timeline.update(t),this.pins.update(e.overlay.pins);const i=this.farStrength()>Ih;if(i!==this.legend.classList.contains("show")&&(this.legend.classList.toggle("show",i),this.legend.inert=!i),!this.inspectorAllowed()&&(this.inspector.classList.contains("show")||e.shared.uniforms.uHoverMoku.value)&&this.hideInspector(),this.syncCarded(),e.view==="land"&&n-(this.landAt||0)>250&&(this.landAt=n,(JSON.stringify(e.land.describe())!==this.legendLand||!e.land.bound!==this.legendWaiting)&&(this.legendWaiting=!e.land.bound,this.refreshLegend())),n-(this.whereAt||0)>300){this.whereAt=n;const r=e.rig.state.target,a=e.rig.state.distance<1400?e.world.islandAt(r.x,r.z):null;cn(".where",this.brand).textContent=a?a.pack.name:e.world.archPack.name}}}function Uh(s){const t=s*100;return t<.5?'<span class="in-none">none</span>':t<1?"under 1%":`${Math.round(t)}%`}function RM(s){return s<.5?'<span class="in-none">none</span>':`about ${(s<10?Math.round(s):Number(s.toPrecision(2))).toLocaleString("en-US")} a km²`}function Nh(s){return s.map(t=>`<li>${t.url&&/^https?:/.test(t.url)?`<a href="${Tt(t.url)}" target="_blank" rel="noopener">${Tt(t.title||t.id)}</a>`:Tt(t.title||t.id)}${t.licence?` <em>${Tt(t.licence)}</em>`:""}${t.fetched?` <em>fetched ${Tt(t.fetched)}</em>`:""}</li>`).join("")}const xa=document.getElementById("boot"),qu=xa.querySelector(".boot-bar span"),ju=xa.querySelector(".boot-stage"),Qr=(s,t)=>{ju.textContent=s,qu.style.width=`${Math.round(t*100)}%`},ms=s=>{console.warn(s)};async function CM(){const s=performance.now();Qr("reading the gazetteer",.05);const t=await mf(of(),ms);if(!t.packs.length)throw new Error("the manifest lists no packs");const e=new pM(document.getElementById("scene"),t,{warn:ms});window.__app=e;const n=new vf(2,ms);Qr("raising the islands",.25);const i=e.world.archPack;i.data=await n.decode(i),Qr("placing the boundaries",.8),await new Promise(c=>setTimeout(c,0)),e.start();const r=new TM(e);e.ui=r,console.log(`archipelago ready in ${((performance.now()-s)/1e3).toFixed(1)} s`),Qr("",1);let a=0;const o=()=>{if(++a<4)return requestAnimationFrame(o);xa.classList.add("gone"),setTimeout(()=>xa.remove(),1200),LM(e,r,n),e.patches.load().catch(c=>{ms(`patches: ${c.message}`),e.patches.resolveReady([])}),e.districts.load().catch(c=>ms(`districts: ${c.message}`))};requestAnimationFrame(o)}async function LM(s,t,e){const n=s.rig.state.target,i=o=>Math.hypot((o.rect.x0+o.rect.x1)/2-n.x,(o.rect.z0+o.rect.z1)/2-n.z),r=[...s.world.islandPacks].sort((o,c)=>i(o)-i(c));let a=0;t.setLoading(r.length?`· ${r.length} islands to come`:""),await Promise.all(r.map(async o=>{try{o.data=await e.decode(o),s.addIsland(o)}catch(c){ms(`${o.id}: ${c.message}`)}a++,t.setLoading(a<r.length?`· ${r.length-a} islands to come`:"")})),e.dispose(),s.islandsLoaded=!0,s.land.load()}CM().catch(s=>{console.error(s),ju.textContent="something went wrong — see the console",qu.style.background="#c0584a"});
