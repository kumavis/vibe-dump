(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const ki=100,Ch=8,ao=9e3,xs=1.3,Ph=5.5,oo=100,Lh=6e3;function lo(s){const t=Math.log(Math.max(1,s)/oo)/Math.log(Lh/oo),e=Math.max(0,Math.min(1,t));return xs+(Ph-xs)*e*e*(3-2*e)}const _c=2,fn=5,Ni=32,mn=16,Mc=1.6,Fe={far:115,near:75,rig:[95,135],margin:7,band:.5,prefetch:320,linger:25,hold:90},Dh=.024;function Uh(){const t=new URLSearchParams(location.search).get("data")||"./data/";return t.endsWith("/")?t:`${t}/`}const Ih=Math.PI/180;class Nh{constructor({lat0:t=20.5,lon0:e=-157.5}={}){this.lat0=t,this.lon0=e,this.kx=Math.cos(t*Ih)*111320/ki,this.kz=110574/ki}x(t){return(t-this.lon0)*this.kx}z(t){return-(t-this.lat0)*this.kz}toWorld(t){return[this.x(t[0]),this.z(t[1])]}toLonLat(t,e){return[t/this.kx+this.lon0,-e/this.kz+this.lat0]}rect([t,e,n,i]){return{x0:this.x(t),z0:this.z(i),x1:this.x(n),z1:this.z(e)}}}function rr(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[ʻʼ‘’'`]/g,"").toLowerCase().replace(/[^a-z]/g,"")}function on(s){if(!s)return null;if(s.type==="Point")return s.coordinates;if(s.type==="LineString")return s.coordinates[Math.floor(s.coordinates.length/2)];if(s.type==="MultiPoint")return s.coordinates[0];const t=s.type==="Polygon"?[s.coordinates[0]]:s.type==="MultiPolygon"?s.coordinates.map(r=>r[0]):null;if(!t)return null;let e=0,n=0,i=0;for(const r of t)for(let o=0,a=r.length-1;o<r.length;a=o++){const l=r[a][0]*r[o][1]-r[o][0]*r[a][1];e+=l,n+=(r[a][0]+r[o][0])*l,i+=(r[a][1]+r[o][1])*l}return Math.abs(e)<1e-12?t[0][0]:[n/(3*e),i/(3*e)]}async function ai(s){var c;const t=await fetch(s);if(!t.ok)throw new Error(`${s}: HTTP ${t.status}`);const e=await t.blob(),n=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),i=n.width,r=n.height;let o;typeof OffscreenCanvas<"u"?o=new OffscreenCanvas(i,r):(o=document.createElement("canvas"),o.width=i,o.height=r);const a=o.getContext("2d",{willReadFrequently:!0});a.imageSmoothingEnabled=!1,a.drawImage(n,0,0);const l=a.getImageData(0,0,i,r).data;return(c=n.close)==null||c.call(n),{px:l,W:i,H:r}}function yc(s,t,e,n,i,r=4){const o=new Float32Array(t*e);for(let a=0,l=0;a<t*e;a++,l+=r)o[a]=(s[l]*256+s[l+1])*n+i;return o}function wc(s,t,e,n=4){const i=new Uint8Array(t*e);for(let r=0,o=0;r<t*e;r++,o+=n)i[r]=s[o];return i}function Fh(s){let t=0,e=0;for(let n=0;n<s.length;n+=7)s[n]>0||(t++,s[n]>-1.6&&e++);return t>100&&e>t*.95}function zh(s,t,e,n,i){const r=un(t,e,o=>s[o]>0,n,i);for(let o=0;o<s.length;o++){if(s[o]>0)continue;const a=r[o]/1e3;s[o]=-(1+30*a+3600*(1-Math.exp(-Math.max(0,a-.6)/6)))}}function bn(s,t,e,n,i=1){let r=Float32Array.from(s);const o=new Float32Array(t*e),a=1/(2*n+1);for(let l=0;l<i;l++){for(let c=0;c<e;c++){const h=c*t;let f=0;for(let d=-n;d<=n;d++)f+=r[h+Math.min(t-1,Math.max(0,d))];for(let d=0;d<t;d++)o[h+d]=f*a,f+=r[h+Math.min(t-1,d+n+1)]-r[h+Math.max(0,d-n)]}for(let c=0;c<t;c++){let h=0;for(let f=-n;f<=n;f++)h+=o[Math.min(e-1,Math.max(0,f))*t+c];for(let f=0;f<e;f++)r[f*t+c]=h*a,h+=o[Math.min(e-1,f+n+1)*t+c]-o[Math.max(0,f-n)*t+c]}}return r}function co(s,t,e,n,i,r){const o=r*r;let a=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let l=1;l<t;l++){let c=(s[l]+l*l*o-(s[n[a]]+n[a]*n[a]*o))/(2*o*(l-n[a]));for(;c<=i[a];)a--,c=(s[l]+l*l*o-(s[n[a]]+n[a]*n[a]*o))/(2*o*(l-n[a]));a++,n[a]=l,i[a]=c,i[a+1]=1/0}a=0;for(let l=0;l<t;l++){for(;i[a+1]<l;)a++;const c=(l-n[a])*r;e[l]=c*c+s[n[a]]}}function un(s,t,e,n=1,i=1){const o=new Float64Array(s*t);for(let m=0;m<s*t;m++)o[m]=e(m)?0:1e20;const a=Math.max(s,t),l=new Float64Array(a),c=new Float64Array(a),h=new Int32Array(a),f=new Float64Array(a+1);for(let m=0;m<s;m++){for(let v=0;v<t;v++)l[v]=o[v*s+m];co(l,t,c,h,f,i);for(let v=0;v<t;v++)o[v*s+m]=c[v]}const d=new Float32Array(s*t);for(let m=0;m<t;m++){const v=m*s;for(let g=0;g<s;g++)l[g]=o[v+g];co(l,s,c,h,f,n);for(let g=0;g<s;g++)d[v+g]=Math.sqrt(c[g])}return d}function Sc(s,t,e,n,i){const r=Math.max(1,Math.round(Math.max(t,e)/512)),o=Math.ceil(t/r),a=Math.ceil(e/r),l=new Float32Array(o*a);for(let d=0;d<a;d++)for(let m=0;m<o;m++){let v=0,g=0;for(let p=d*r;p<Math.min(e,(d+1)*r);p++)for(let u=m*r;u<Math.min(t,(m+1)*r);u++)v+=Math.max(0,s[p*t+u]),g++;l[d*o+m]=v/g*xs}const c=new Float32Array(o*a),h=[1,2,3,5,7,10,14,19,26,34],f=[];for(let d=0;d<8;d++)f.push([Math.cos(d*Math.PI/4),Math.sin(d*Math.PI/4)]);for(let d=0;d<a;d++)for(let m=0;m<o;m++){const v=l[d*o+m];if(v<=0){c[d*o+m]=1;continue}let g=0;for(const[p,u]of f){let x=0;const _=Math.hypot(p*n,u*i)*r;for(const y of h){const S=Math.round(m+p*y),E=Math.round(d+u*y);if(S<0||E<0||S>=o||E>=a)break;const T=(l[E*o+S]-v)/(y*_);T>x&&(x=T)}g+=x/Math.sqrt(1+x*x)}c[d*o+m]=1-g/8*.95}return{data:c,w:o,h:a,f:r}}function bc(s,t,e,n,i,r){const o=new Uint8Array(t*e*4),a=_c;for(let l=0;l<e;l++){const c=Math.max(0,l-1),h=Math.min(e-1,l+1);for(let f=0;f<t;f++){const d=l*t+f,m=Math.max(0,f-1),v=Math.min(t-1,f+1),g=(s[l*t+v]-s[l*t+m])/((v-m)*n),p=(s[h*t+f]-s[c*t+f])/((h-c)*i),u=-g*a,x=-p*a,_=Math.hypot(u,1,x);o[d*4]=Math.round((u/_*.5+.5)*255),o[d*4+1]=Math.round((1/_*.5+.5)*255),o[d*4+2]=Math.round((x/_*.5+.5)*255);let y=1;if(r){const S=Math.min(r.w-1.001,Math.max(0,(f+.5)/r.f-.5)),E=Math.min(r.h-1.001,Math.max(0,(l+.5)/r.f-.5)),T=S|0,U=E|0,M=S-T,w=E-U,L=U*r.w+T,C=r.data,k=Math.min(r.w-1,T+1)-T,P=Math.min(r.h-1,U+1)-U,F=C[L]+(C[L+k]-C[L])*M,B=C[L+P*r.w]+(C[L+P*r.w+k]-C[L+P*r.w])*M;y=F+(B-F)*w}o[d*4+3]=Math.round(Math.max(0,Math.min(1,y))*255)}}return o}function kh(s,t,e,n,i){const r=t*e,o=n*i/1e6,a=new Float32Array(r);let l=0,c=0;for(let p=0;p<r;p++)s[p]>0&&(a[p]=o,s[p]>l&&(l=s[p]),c++);if(!c)return a;const h=Math.min(65536,Math.ceil(l)+2),f=p=>Math.min(h-1,Math.floor(p/l*(h-2))),d=new Uint32Array(h+1);for(let p=0;p<r;p++)s[p]>0&&d[f(s[p])+1]++;for(let p=0;p<h;p++)d[p+1]+=d[p];const m=new Uint32Array(c),v=d.slice();for(let p=0;p<r;p++)s[p]>0&&(m[v[f(s[p])]++]=p);const g=Math.hypot(n,i);for(let p=c-1;p>=0;p--){const u=m[p],x=u%t,_=(u-x)/t,y=s[u];let S=-1,E=0;for(let T=-1;T<=1;T++){const U=_+T;if(!(U<0||U>=e))for(let M=-1;M<=1;M++){if(!M&&!T)continue;const w=x+M;if(w<0||w>=t)continue;const L=U*t+w,C=(y-s[L])/(M&&T?g:M?n:i);C>E&&(E=C,S=L)}}S>=0&&s[S]>0&&(a[S]+=a[u])}return a}function Oh(s,t,e,n,i,r){const o=e*n,a=new Uint8Array(o*4),l=kh(s,e,n,i,r),c=i*r/1e6,h=Math.max(.04,4*c),f=new Float32Array(o);for(let u=0;u<o;u++)f[u]=s[u]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,l[u])/h)/1.6)):0;const d=bn(f,e,n,1,2),m=un(e,n,u=>s[u]<=0,i,r),v=new Float32Array(o);for(let u=0;u<n;u++)for(let x=0;x<e;x++){const _=u*e+x;if(s[_]<=0||s[_]>9)continue;const y=Math.min(e-1,x+1),S=Math.max(0,x-1),E=Math.min(n-1,u+1),T=Math.max(0,u-1),U=Math.hypot((s[u*e+y]-s[u*e+S])/((y-S)*i),(s[E*e+x]-s[T*e+x])/((E-T)*r));v[_]=m[_]<260+Math.max(i,r)&&U<.12?1:0}const g=bn(v,e,n,1,1),p=1.5*Math.min(1,70/Math.max(i,r));for(let u=0;u<o;u++)a[u*4]=t?t[u]:s[u]>0?82:0,a[u*4+1]=Math.round(255*Math.min(1,g[u]*p)),a[u*4+2]=Math.round(255*Math.min(1,d[u]*1.6)),a[u*4+3]=0;return a}function Bh({heightPx:s,rainPx:t,W:e,H:n,scale:i,offset:r,mx:o,mz:a,stride:l=4}){const c=yc(s,e,n,i,r,l),h=Fh(c);h&&zh(c,e,n,o,a);const f=t?wc(t,e,n,l):null,d=Sc(c,e,n,o,a),m=bc(c,e,n,o,a,d),v=Oh(c,f,e,n,o,a);let g=1/0,p=-1/0;for(let u=0;u<c.length;u++)c[u]<g&&(g=c[u]),c[u]>p&&(p=c[u]);return{metres:c,normals:m,land:v,flatSea:h,lo:g,hi:p}}async function Ln(s,t,e){try{const n=await fetch(s);if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}catch(n){if(t===void 0)throw new Error(`${s}: ${n.message}`);return e==null||e(`${s}: ${n.message} (carrying on without it)`),t}}const As=(s,t)=>Array.isArray(s)?s:Array.isArray(s==null?void 0:s[t])?s[t]:[];async function Hh(s,t=console.warn){const e=m=>new URL(m,new URL(s,location.href)).href,n=await Ln(e("manifest.json")),[i,r,o,a,l,c,h]=await Promise.all([Ln(e("boundaries/moku.geojson"),null,t),Ln(e("boundaries/ahupuaa.geojson"),null,t),Ln(e("eras.json"),[],t),Ln(e("places.json"),[],t),Ln(e("events.json"),[],t),Ln(e("sources.json"),[],t),Ln(e("polities.json"),{polities:[],byEra:{}},t)]),f=new Nh(n.projection||{}),d=(n.packs||[]).map(m=>Gh(m,f,e));return{base:s,abs:e,manifest:n,proj:f,packs:d,moku:i,ahupuaa:r,eras:As(o,"eras"),places:As(a,"places"),events:As(l,"events"),sources:As(c,"sources"),polities:{polities:(h==null?void 0:h.polities)||[],byEra:(h==null?void 0:h.byEra)||{}}}}function Gh(s,t,e){var o;const n=t.rect(s.bounds),[i,r]=s.size;return{id:s.id,kind:s.kind,name:s.name||s.id,desc:s,rect:n,W:i,H:r,mx:(n.x1-n.x0)*ki/i,mz:(n.z1-n.z0)*ki/r,heightUrl:e(s.height.file),rainUrl:(o=s.rain)!=null&&o.file?e(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,sources:s.sources||[],data:null}}class Vh{constructor(t=2,e=console.warn){this.warn=e,this.jobs=new Map,this.next=1,this.workers=[],this.free=[],this.queue=[];try{for(let n=0;n<t;n++){const i=new Worker(new URL(""+new URL("worker-D-2AoFNa.js",import.meta.url).href,import.meta.url),{type:"module"});i.onmessage=r=>this.message(i,r.data),i.onerror=r=>{var o;(o=r.preventDefault)==null||o.call(r),this.fallback=!0;for(const[a,l]of this.jobs)l.worker===i&&this.mainThread(a,l)},this.workers.push(i),this.free.push(i)}}catch{this.fallback=!0}}decode(t){return new Promise((e,n)=>{const i=this.next++,r={pack:t,resolve:e,reject:n};this.jobs.set(i,r),this.fallback||!this.workers.length?this.mainThread(i,r):(this.queue.push(i),this.pump())})}pump(){for(;this.free.length&&this.queue.length;){const t=this.queue.shift(),e=this.jobs.get(t),n=this.free.pop();e.worker=n;const i=e.pack;n.postMessage({job:t,heightUrl:i.heightUrl,rainUrl:i.rainUrl,W:i.W,H:i.H,scale:i.scale,offset:i.offset,mx:i.mx,mz:i.mz})}}message(t,e){const n=this.jobs.get(e.job);if(n){if(e.warn)return this.warn(e.warn);this.jobs.delete(e.job),this.free.push(t),e.ok?n.resolve(e):/OffscreenCanvas|getContext|createImageBitmap/i.test(e.message)?(this.fallback=!0,this.jobs.set(e.job,n),this.mainThread(e.job,n)):n.reject(new Error(e.message)),this.pump()}}async mainThread(t,e){try{const n=e.pack,i=await ai(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);let r=null;n.rainUrl&&(r=await ai(n.rainUrl).then(a=>a.W===n.W&&a.H===n.H?a.px:null).catch(()=>null));const o=Bh({heightPx:i.px,rainPx:r,W:n.W,H:n.H,scale:n.scale,offset:n.offset,mx:n.mx,mz:n.mz});this.jobs.delete(t),e.resolve(o)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){for(const t of this.workers)t.terminate()}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const za="160",Wh=0,ho=1,$h=2,Ec=1,Xh=2,Sn=3,Cn=0,Ue=1,ln=2,kn=0,Fi=1,_a=2,uo=3,fo=4,qh=5,ti=100,jh=101,Yh=102,po=103,mo=104,Kh=200,Zh=201,Jh=202,Qh=203,Ma=204,ya=205,tu=206,eu=207,nu=208,iu=209,su=210,ru=211,au=212,ou=213,lu=214,cu=0,hu=1,uu=2,lr=3,fu=4,du=5,pu=6,mu=7,Ac=0,gu=1,vu=2,On=0,xu=1,_u=2,Mu=3,yu=4,wu=5,Su=6,Tc=300,Oi=301,Bi=302,wa=303,Sa=304,yr=306,cr=1e3,De=1001,ba=1002,te=1003,go=1004,Lr=1005,ye=1006,bu=1007,oi=1008,ue=1009,Eu=1010,Au=1011,ka=1012,Rc=1013,An=1014,Tn=1015,Bn=1016,Cc=1017,Pc=1018,ii=1020,Tu=1021,_e=1023,Ru=1024,Cu=1025,si=1026,Hi=1027,Vi=1028,Lc=1029,Dc=1030,Uc=1031,Ic=1033,Dr=33776,Ur=33777,Ir=33778,Nr=33779,vo=35840,xo=35841,_o=35842,Mo=35843,Nc=36196,yo=37492,wo=37496,So=37808,bo=37809,Eo=37810,Ao=37811,To=37812,Ro=37813,Co=37814,Po=37815,Lo=37816,Do=37817,Uo=37818,Io=37819,No=37820,Fo=37821,Fr=36492,zo=36494,ko=36495,Pu=36283,Oo=36284,Bo=36285,Ho=36286,Fc=3e3,ri=3001,Lu=3200,Du=3201,Uu=0,Iu=1,Je="",Me="srgb",Pn="srgb-linear",Oa="display-p3",wr="display-p3-linear",hr="linear",ee="srgb",ur="rec709",fr="p3",li=7680,Go=519,Nu=512,Fu=513,zu=514,zc=515,ku=516,Ou=517,Bu=518,Hu=519,Vo=35044,ls=35048,Wo="300 es",Ea=1035,Rn=2e3,dr=2001;class Wi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const Se=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let $o=1234567;const cs=Math.PI/180,_s=180/Math.PI;function $i(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Se[s&255]+Se[s>>8&255]+Se[s>>16&255]+Se[s>>24&255]+"-"+Se[t&255]+Se[t>>8&255]+"-"+Se[t>>16&15|64]+Se[t>>24&255]+"-"+Se[e&63|128]+Se[e>>8&255]+"-"+Se[e>>16&255]+Se[e>>24&255]+Se[n&255]+Se[n>>8&255]+Se[n>>16&255]+Se[n>>24&255]).toLowerCase()}function Le(s,t,e){return Math.max(t,Math.min(e,s))}function Ba(s,t){return(s%t+t)%t}function Gu(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Vu(s,t,e){return s!==t?(e-s)/(t-s):0}function hs(s,t,e){return(1-e)*s+e*t}function Wu(s,t,e,n){return hs(s,t,1-Math.exp(-e*n))}function $u(s,t=1){return t-Math.abs(Ba(s,t*2)-t)}function Xu(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function qu(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function ju(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Yu(s,t){return s+Math.random()*(t-s)}function Ku(s){return s*(.5-Math.random())}function Zu(s){s!==void 0&&($o=s);let t=$o+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ju(s){return s*cs}function Qu(s){return s*_s}function Aa(s){return(s&s-1)===0&&s!==0}function tf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function pr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function ef(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),f=r((t-n)/2),d=o((t-n)/2),m=r((n-t)/2),v=o((n-t)/2);switch(i){case"XYX":s.set(a*h,l*f,l*d,a*c);break;case"YZY":s.set(l*d,a*h,l*f,a*c);break;case"ZXZ":s.set(l*f,l*d,a*h,a*c);break;case"XZX":s.set(a*h,l*v,l*m,a*c);break;case"YXY":s.set(l*m,a*h,l*v,a*c);break;case"ZYZ":s.set(l*v,l*m,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Ti(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Te(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Ce={DEG2RAD:cs,RAD2DEG:_s,generateUUID:$i,clamp:Le,euclideanModulo:Ba,mapLinear:Gu,inverseLerp:Vu,lerp:hs,damp:Wu,pingpong:$u,smoothstep:Xu,smootherstep:qu,randInt:ju,randFloat:Yu,randFloatSpread:Ku,seededRandom:Zu,degToRad:Ju,radToDeg:Qu,isPowerOfTwo:Aa,ceilPowerOfTwo:tf,floorPowerOfTwo:pr,setQuaternionFromProperEuler:ef,normalize:Te,denormalize:Ti};class Lt{constructor(t=0,e=0){Lt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Vt{constructor(t,e,n,i,r,o,a,l,c){Vt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],d=n[2],m=n[5],v=n[8],g=i[0],p=i[3],u=i[6],x=i[1],_=i[4],y=i[7],S=i[2],E=i[5],T=i[8];return r[0]=o*g+a*x+l*S,r[3]=o*p+a*_+l*E,r[6]=o*u+a*y+l*T,r[1]=c*g+h*x+f*S,r[4]=c*p+h*_+f*E,r[7]=c*u+h*y+f*T,r[2]=d*g+m*x+v*S,r[5]=d*p+m*_+v*E,r[8]=d*u+m*y+v*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*o-a*c,d=a*l-h*r,m=c*r-o*l,v=e*f+n*d+i*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/v;return t[0]=f*g,t[1]=(i*c-h*n)*g,t[2]=(a*n-i*o)*g,t[3]=d*g,t[4]=(h*e-i*l)*g,t[5]=(i*r-a*e)*g,t[6]=m*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(zr.makeScale(t,e)),this}rotate(t){return this.premultiply(zr.makeRotation(-t)),this}translate(t,e){return this.premultiply(zr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const zr=new Vt;function kc(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function mr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function nf(){const s=mr("canvas");return s.style.display="block",s}const Xo={};function us(s){s in Xo||(Xo[s]=!0,console.warn(s))}const qo=new Vt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),jo=new Vt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ts={[Pn]:{transfer:hr,primaries:ur,toReference:s=>s,fromReference:s=>s},[Me]:{transfer:ee,primaries:ur,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[wr]:{transfer:hr,primaries:fr,toReference:s=>s.applyMatrix3(jo),fromReference:s=>s.applyMatrix3(qo)},[Oa]:{transfer:ee,primaries:fr,toReference:s=>s.convertSRGBToLinear().applyMatrix3(jo),fromReference:s=>s.applyMatrix3(qo).convertLinearToSRGB()}},sf=new Set([Pn,wr]),Yt={enabled:!0,_workingColorSpace:Pn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!sf.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=Ts[t].toReference,i=Ts[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Ts[s].primaries},getTransfer:function(s){return s===Je?hr:Ts[s].transfer}};function zi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function kr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ci;class Oc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ci===void 0&&(ci=mr("canvas")),ci.width=t.width,ci.height=t.height;const n=ci.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ci}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=mr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=zi(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zi(e[n]/255)*255):e[n]=zi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let rf=0;class Bc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=$i(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Or(i[o].image)):r.push(Or(i[o]))}else r=Or(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function Or(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Oc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let af=0;class Oe extends Wi{constructor(t=Oe.DEFAULT_IMAGE,e=Oe.DEFAULT_MAPPING,n=De,i=De,r=ye,o=oi,a=_e,l=ue,c=Oe.DEFAULT_ANISOTROPY,h=Je){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=$i(),this.name="",this.source=new Bc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(us("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ri?Me:Je),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Tc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case cr:t.x=t.x-Math.floor(t.x);break;case De:t.x=t.x<0?0:1;break;case ba:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case cr:t.y=t.y-Math.floor(t.y);break;case De:t.y=t.y<0?0:1;break;case ba:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return us("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Me?ri:Fc}set encoding(t){us("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===ri?Me:Je}}Oe.DEFAULT_IMAGE=null;Oe.DEFAULT_MAPPING=Tc;Oe.DEFAULT_ANISOTROPY=1;class $t{constructor(t=0,e=0,n=0,i=1){$t.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],m=l[5],v=l[9],g=l[2],p=l[6],u=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-g)<.01&&Math.abs(v-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+g)<.1&&Math.abs(v+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(c+1)/2,y=(m+1)/2,S=(u+1)/2,E=(h+d)/4,T=(f+g)/4,U=(v+p)/4;return _>y&&_>S?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=E/n,r=T/n):y>S?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=E/i,r=U/i):S<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(S),n=T/r,i=U/r),this.set(n,i,r,e),this}let x=Math.sqrt((p-v)*(p-v)+(f-g)*(f-g)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(p-v)/x,this.y=(f-g)/x,this.z=(d-h)/x,this.w=Math.acos((c+m+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class of extends Wi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new $t(0,0,t,e),this.scissorTest=!1,this.viewport=new $t(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(us("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ri?Me:Je),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ye,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Oe(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Bc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gn extends of{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Hc extends Oe{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=te,this.minFilter=te,this.wrapR=De,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class lf extends Oe{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=te,this.minFilter=te,this.wrapR=De,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xi{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],f=n[i+3];const d=r[o+0],m=r[o+1],v=r[o+2],g=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(a===1){t[e+0]=d,t[e+1]=m,t[e+2]=v,t[e+3]=g;return}if(f!==g||l!==d||c!==m||h!==v){let p=1-a;const u=l*d+c*m+h*v+f*g,x=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){const S=Math.sqrt(_),E=Math.atan2(S,u*x);p=Math.sin(p*E)/S,a=Math.sin(a*E)/S}const y=a*x;if(l=l*p+d*y,c=c*p+m*y,h=h*p+v*y,f=f*p+g*y,p===1-a){const S=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=S,c*=S,h*=S,f*=S}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],f=r[o],d=r[o+1],m=r[o+2],v=r[o+3];return t[e]=a*v+h*f+l*m-c*d,t[e+1]=l*v+h*d+c*f-a*m,t[e+2]=c*v+h*m+a*d-l*f,t[e+3]=h*v-a*f-l*d-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),f=a(r/2),d=l(n/2),m=l(i/2),v=l(r/2);switch(o){case"XYZ":this._x=d*h*f+c*m*v,this._y=c*m*f-d*h*v,this._z=c*h*v+d*m*f,this._w=c*h*f-d*m*v;break;case"YXZ":this._x=d*h*f+c*m*v,this._y=c*m*f-d*h*v,this._z=c*h*v-d*m*f,this._w=c*h*f+d*m*v;break;case"ZXY":this._x=d*h*f-c*m*v,this._y=c*m*f+d*h*v,this._z=c*h*v+d*m*f,this._w=c*h*f-d*m*v;break;case"ZYX":this._x=d*h*f-c*m*v,this._y=c*m*f+d*h*v,this._z=c*h*v-d*m*f,this._w=c*h*f+d*m*v;break;case"YZX":this._x=d*h*f+c*m*v,this._y=c*m*f+d*h*v,this._z=c*h*v-d*m*f,this._w=c*h*f-d*m*v;break;case"XZY":this._x=d*h*f-c*m*v,this._y=c*m*f-d*h*v,this._z=c*h*v+d*m*f,this._w=c*h*f+d*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=n+a+f;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-i)*m}else if(n>a&&n>f){const m=2*Math.sqrt(1+n-a-f);this._w=(h-l)/m,this._x=.25*m,this._y=(i+o)/m,this._z=(r+c)/m}else if(a>f){const m=2*Math.sqrt(1+a-n-f);this._w=(r-c)/m,this._x=(i+o)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+f-n-a);this._w=(o-i)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Le(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*i+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=n*f+this._x*d,this._y=i*f+this._y*d,this._z=r*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(r),n*Math.cos(r),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{constructor(t=0,e=0,n=0){z.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Yo.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Yo.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),f=2*(r*n-o*e);return this.x=e+l*c+o*f-a*h,this.y=n+l*h+a*c-r*f,this.z=i+l*f+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Br.copy(this).projectOnVector(t),this.sub(Br)}reflect(t){return this.sub(Br.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Br=new z,Yo=new Xi;class cn{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(tn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(tn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=tn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,tn):tn.fromBufferAttribute(r,o),tn.applyMatrix4(t.matrixWorld),this.expandByPoint(tn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Rs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rs.copy(n.boundingBox)),Rs.applyMatrix4(t.matrixWorld),this.union(Rs)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,tn),tn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Zi),Cs.subVectors(this.max,Zi),hi.subVectors(t.a,Zi),ui.subVectors(t.b,Zi),fi.subVectors(t.c,Zi),Dn.subVectors(ui,hi),Un.subVectors(fi,ui),$n.subVectors(hi,fi);let e=[0,-Dn.z,Dn.y,0,-Un.z,Un.y,0,-$n.z,$n.y,Dn.z,0,-Dn.x,Un.z,0,-Un.x,$n.z,0,-$n.x,-Dn.y,Dn.x,0,-Un.y,Un.x,0,-$n.y,$n.x,0];return!Hr(e,hi,ui,fi,Cs)||(e=[1,0,0,0,1,0,0,0,1],!Hr(e,hi,ui,fi,Cs))?!1:(Ps.crossVectors(Dn,Un),e=[Ps.x,Ps.y,Ps.z],Hr(e,hi,ui,fi,Cs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,tn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(tn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(xn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const xn=[new z,new z,new z,new z,new z,new z,new z,new z],tn=new z,Rs=new cn,hi=new z,ui=new z,fi=new z,Dn=new z,Un=new z,$n=new z,Zi=new z,Cs=new z,Ps=new z,Xn=new z;function Hr(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Xn.fromArray(s,r);const a=i.x*Math.abs(Xn.x)+i.y*Math.abs(Xn.y)+i.z*Math.abs(Xn.z),l=t.dot(Xn),c=e.dot(Xn),h=n.dot(Xn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const cf=new cn,Ji=new z,Gr=new z;class Hn{constructor(t=new z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):cf.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ji.subVectors(t,this.center);const e=Ji.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ji,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Gr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ji.copy(t.center).add(Gr)),this.expandByPoint(Ji.copy(t.center).sub(Gr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const _n=new z,Vr=new z,Ls=new z,In=new z,Wr=new z,Ds=new z,$r=new z;class Ha{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,_n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=_n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(_n.copy(this.origin).addScaledVector(this.direction,e),_n.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Vr.copy(t).add(e).multiplyScalar(.5),Ls.copy(e).sub(t).normalize(),In.copy(this.origin).sub(Vr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Ls),a=In.dot(this.direction),l=-In.dot(Ls),c=In.lengthSq(),h=Math.abs(1-o*o);let f,d,m,v;if(h>0)if(f=o*l-a,d=o*a-l,v=r*h,f>=0)if(d>=-v)if(d<=v){const g=1/h;f*=g,d*=g,m=f*(f+o*d+2*a)+d*(o*f+d+2*l)+c}else d=r,f=Math.max(0,-(o*d+a)),m=-f*f+d*(d+2*l)+c;else d=-r,f=Math.max(0,-(o*d+a)),m=-f*f+d*(d+2*l)+c;else d<=-v?(f=Math.max(0,-(-o*r+a)),d=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c):d<=v?(f=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(f=Math.max(0,-(o*r+a)),d=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c);else d=o>0?-r:r,f=Math.max(0,-(o*d+a)),m=-f*f+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),i&&i.copy(Vr).addScaledVector(Ls,d),m}intersectSphere(t,e){_n.subVectors(t.center,this.origin);const n=_n.dot(this.direction),i=_n.dot(_n)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),f>=0?(a=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(a=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,_n)!==null}intersectTriangle(t,e,n,i,r){Wr.subVectors(e,t),Ds.subVectors(n,t),$r.crossVectors(Wr,Ds);let o=this.direction.dot($r),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;In.subVectors(this.origin,t);const l=a*this.direction.dot(Ds.crossVectors(In,Ds));if(l<0)return null;const c=a*this.direction.dot(Wr.cross(In));if(c<0||l+c>o)return null;const h=-a*In.dot($r);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Kt{constructor(t,e,n,i,r,o,a,l,c,h,f,d,m,v,g,p){Kt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,f,d,m,v,g,p)}set(t,e,n,i,r,o,a,l,c,h,f,d,m,v,g,p){const u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=i,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=f,u[14]=d,u[3]=m,u[7]=v,u[11]=g,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Kt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/di.setFromMatrixColumn(t,0).length(),r=1/di.setFromMatrixColumn(t,1).length(),o=1/di.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const d=o*h,m=o*f,v=a*h,g=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=m+v*c,e[5]=d-g*c,e[9]=-a*l,e[2]=g-d*c,e[6]=v+m*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,m=l*f,v=c*h,g=c*f;e[0]=d+g*a,e[4]=v*a-m,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=m*a-v,e[6]=g+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,m=l*f,v=c*h,g=c*f;e[0]=d-g*a,e[4]=-o*f,e[8]=v+m*a,e[1]=m+v*a,e[5]=o*h,e[9]=g-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,m=o*f,v=a*h,g=a*f;e[0]=l*h,e[4]=v*c-m,e[8]=d*c+g,e[1]=l*f,e[5]=g*c+d,e[9]=m*c-v,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,m=o*c,v=a*l,g=a*c;e[0]=l*h,e[4]=g-d*f,e[8]=v*f+m,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=m*f+v,e[10]=d-g*f}else if(t.order==="XZY"){const d=o*l,m=o*c,v=a*l,g=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+g,e[5]=o*h,e[9]=m*f-v,e[2]=v*f-m,e[6]=a*h,e[10]=g*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hf,t,uf)}lookAt(t,e,n){const i=this.elements;return Ve.subVectors(t,e),Ve.lengthSq()===0&&(Ve.z=1),Ve.normalize(),Nn.crossVectors(n,Ve),Nn.lengthSq()===0&&(Math.abs(n.z)===1?Ve.x+=1e-4:Ve.z+=1e-4,Ve.normalize(),Nn.crossVectors(n,Ve)),Nn.normalize(),Us.crossVectors(Ve,Nn),i[0]=Nn.x,i[4]=Us.x,i[8]=Ve.x,i[1]=Nn.y,i[5]=Us.y,i[9]=Ve.y,i[2]=Nn.z,i[6]=Us.z,i[10]=Ve.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],d=n[9],m=n[13],v=n[2],g=n[6],p=n[10],u=n[14],x=n[3],_=n[7],y=n[11],S=n[15],E=i[0],T=i[4],U=i[8],M=i[12],w=i[1],L=i[5],C=i[9],k=i[13],P=i[2],F=i[6],B=i[10],j=i[14],G=i[3],Z=i[7],J=i[11],Q=i[15];return r[0]=o*E+a*w+l*P+c*G,r[4]=o*T+a*L+l*F+c*Z,r[8]=o*U+a*C+l*B+c*J,r[12]=o*M+a*k+l*j+c*Q,r[1]=h*E+f*w+d*P+m*G,r[5]=h*T+f*L+d*F+m*Z,r[9]=h*U+f*C+d*B+m*J,r[13]=h*M+f*k+d*j+m*Q,r[2]=v*E+g*w+p*P+u*G,r[6]=v*T+g*L+p*F+u*Z,r[10]=v*U+g*C+p*B+u*J,r[14]=v*M+g*k+p*j+u*Q,r[3]=x*E+_*w+y*P+S*G,r[7]=x*T+_*L+y*F+S*Z,r[11]=x*U+_*C+y*B+S*J,r[15]=x*M+_*k+y*j+S*Q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],m=t[14],v=t[3],g=t[7],p=t[11],u=t[15];return v*(+r*l*f-i*c*f-r*a*d+n*c*d+i*a*m-n*l*m)+g*(+e*l*m-e*c*d+r*o*d-i*o*m+i*c*h-r*l*h)+p*(+e*c*f-e*a*m-r*o*f+n*o*m+r*a*h-n*c*h)+u*(-i*a*h-e*l*f+e*a*d+i*o*f-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],m=t[11],v=t[12],g=t[13],p=t[14],u=t[15],x=f*p*c-g*d*c+g*l*m-a*p*m-f*l*u+a*d*u,_=v*d*c-h*p*c-v*l*m+o*p*m+h*l*u-o*d*u,y=h*g*c-v*f*c+v*a*m-o*g*m-h*a*u+o*f*u,S=v*f*l-h*g*l-v*a*d+o*g*d+h*a*p-o*f*p,E=e*x+n*_+i*y+r*S;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/E;return t[0]=x*T,t[1]=(g*d*r-f*p*r-g*i*m+n*p*m+f*i*u-n*d*u)*T,t[2]=(a*p*r-g*l*r+g*i*c-n*p*c-a*i*u+n*l*u)*T,t[3]=(f*l*r-a*d*r-f*i*c+n*d*c+a*i*m-n*l*m)*T,t[4]=_*T,t[5]=(h*p*r-v*d*r+v*i*m-e*p*m-h*i*u+e*d*u)*T,t[6]=(v*l*r-o*p*r-v*i*c+e*p*c+o*i*u-e*l*u)*T,t[7]=(o*d*r-h*l*r+h*i*c-e*d*c-o*i*m+e*l*m)*T,t[8]=y*T,t[9]=(v*f*r-h*g*r-v*n*m+e*g*m+h*n*u-e*f*u)*T,t[10]=(o*g*r-v*a*r+v*n*c-e*g*c-o*n*u+e*a*u)*T,t[11]=(h*a*r-o*f*r-h*n*c+e*f*c+o*n*m-e*a*m)*T,t[12]=S*T,t[13]=(h*g*i-v*f*i+v*n*d-e*g*d-h*n*p+e*f*p)*T,t[14]=(v*a*i-o*g*i-v*n*l+e*g*l+o*n*p-e*a*p)*T,t[15]=(o*f*i-h*a*i+h*n*l-e*f*l-o*n*d+e*a*d)*T,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,f=a+a,d=r*c,m=r*h,v=r*f,g=o*h,p=o*f,u=a*f,x=l*c,_=l*h,y=l*f,S=n.x,E=n.y,T=n.z;return i[0]=(1-(g+u))*S,i[1]=(m+y)*S,i[2]=(v-_)*S,i[3]=0,i[4]=(m-y)*E,i[5]=(1-(d+u))*E,i[6]=(p+x)*E,i[7]=0,i[8]=(v+_)*T,i[9]=(p-x)*T,i[10]=(1-(d+g))*T,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=di.set(i[0],i[1],i[2]).length();const o=di.set(i[4],i[5],i[6]).length(),a=di.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],en.copy(this);const c=1/r,h=1/o,f=1/a;return en.elements[0]*=c,en.elements[1]*=c,en.elements[2]*=c,en.elements[4]*=h,en.elements[5]*=h,en.elements[6]*=h,en.elements[8]*=f,en.elements[9]*=f,en.elements[10]*=f,e.setFromRotationMatrix(en),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=Rn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-i),f=(e+t)/(e-t),d=(n+i)/(n-i);let m,v;if(a===Rn)m=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===dr)m=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Rn){const l=this.elements,c=1/(e-t),h=1/(n-i),f=1/(o-r),d=(e+t)*c,m=(n+i)*h;let v,g;if(a===Rn)v=(o+r)*f,g=-2*f;else if(a===dr)v=r*f,g=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=g,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const di=new z,en=new Kt,hf=new z(0,0,0),uf=new z(1,1,1),Nn=new z,Us=new z,Ve=new z,Ko=new Kt,Zo=new Xi;class Sr{constructor(t=0,e=0,n=0,i=Sr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],f=i[2],d=i[6],m=i[10];switch(e){case"XYZ":this._y=Math.asin(Le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Le(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Le(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Le(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ko.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ko,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Zo.setFromEuler(this),this.setFromQuaternion(Zo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Sr.DEFAULT_ORDER="XYZ";class Ga{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ff=0;const Jo=new z,pi=new Xi,Mn=new Kt,Is=new z,Qi=new z,df=new z,pf=new Xi,Qo=new z(1,0,0),tl=new z(0,1,0),el=new z(0,0,1),mf={type:"added"},gf={type:"removed"};class Be extends Wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ff++}),this.uuid=$i(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Be.DEFAULT_UP.clone();const t=new z,e=new Sr,n=new Xi,i=new z(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Kt},normalMatrix:{value:new Vt}}),this.matrix=new Kt,this.matrixWorld=new Kt,this.matrixAutoUpdate=Be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ga,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return pi.setFromAxisAngle(t,e),this.quaternion.multiply(pi),this}rotateOnWorldAxis(t,e){return pi.setFromAxisAngle(t,e),this.quaternion.premultiply(pi),this}rotateX(t){return this.rotateOnAxis(Qo,t)}rotateY(t){return this.rotateOnAxis(tl,t)}rotateZ(t){return this.rotateOnAxis(el,t)}translateOnAxis(t,e){return Jo.copy(t).applyQuaternion(this.quaternion),this.position.add(Jo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qo,t)}translateY(t){return this.translateOnAxis(tl,t)}translateZ(t){return this.translateOnAxis(el,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Is.copy(t):Is.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(Qi,Is,this.up):Mn.lookAt(Is,Qi,this.up),this.quaternion.setFromRotationMatrix(Mn),i&&(Mn.extractRotation(i.matrixWorld),pi.setFromRotationMatrix(Mn),this.quaternion.premultiply(pi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(mf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(gf)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Mn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Mn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qi,t,df),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qi,pf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),m=o(t.animations),v=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Be.DEFAULT_UP=new z(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const nn=new z,yn=new z,Xr=new z,wn=new z,mi=new z,gi=new z,nl=new z,qr=new z,jr=new z,Yr=new z;let Ns=!1;class rn{constructor(t=new z,e=new z,n=new z){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),nn.subVectors(t,e),i.cross(nn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){nn.subVectors(i,e),yn.subVectors(n,e),Xr.subVectors(t,e);const o=nn.dot(nn),a=nn.dot(yn),l=nn.dot(Xr),c=yn.dot(yn),h=yn.dot(Xr),f=o*c-a*a;if(f===0)return r.set(0,0,0),null;const d=1/f,m=(c*l-a*h)*d,v=(o*h-a*l)*d;return r.set(1-m-v,v,m)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getUV(t,e,n,i,r,o,a,l){return Ns===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ns=!0),this.getInterpolation(t,e,n,i,r,o,a,l)}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wn.x),l.addScaledVector(o,wn.y),l.addScaledVector(a,wn.z),l)}static isFrontFacing(t,e,n,i){return nn.subVectors(n,e),yn.subVectors(t,e),nn.cross(yn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return nn.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),nn.cross(yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return rn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,r){return Ns===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ns=!0),rn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}getInterpolation(t,e,n,i,r){return rn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;mi.subVectors(i,n),gi.subVectors(r,n),qr.subVectors(t,n);const l=mi.dot(qr),c=gi.dot(qr);if(l<=0&&c<=0)return e.copy(n);jr.subVectors(t,i);const h=mi.dot(jr),f=gi.dot(jr);if(h>=0&&f<=h)return e.copy(i);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(mi,o);Yr.subVectors(t,r);const m=mi.dot(Yr),v=gi.dot(Yr);if(v>=0&&m<=v)return e.copy(r);const g=m*c-l*v;if(g<=0&&c>=0&&v<=0)return a=c/(c-v),e.copy(n).addScaledVector(gi,a);const p=h*v-m*f;if(p<=0&&f-h>=0&&m-v>=0)return nl.subVectors(r,i),a=(f-h)/(f-h+(m-v)),e.copy(i).addScaledVector(nl,a);const u=1/(p+g+d);return o=g*u,a=d*u,e.copy(n).addScaledVector(mi,o).addScaledVector(gi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Gc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},Fs={h:0,s:0,l:0};function Kr(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Tt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Yt.workingColorSpace){if(t=Ba(t,1),e=Le(e,0,1),n=Le(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Kr(o,r,t+1/3),this.g=Kr(o,r,t),this.b=Kr(o,r,t-1/3)}return Yt.toWorkingColorSpace(this,i),this}setStyle(t,e=Me){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Me){const n=Gc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zi(t.r),this.g=zi(t.g),this.b=zi(t.b),this}copyLinearToSRGB(t){return this.r=kr(t.r),this.g=kr(t.g),this.b=kr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Me){return Yt.fromWorkingColorSpace(be.copy(this),t),Math.round(Le(be.r*255,0,255))*65536+Math.round(Le(be.g*255,0,255))*256+Math.round(Le(be.b*255,0,255))}getHexString(t=Me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(be.copy(this),e);const n=be.r,i=be.g,r=be.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=h<=.5?f/(o+a):f/(2-o-a),o){case n:l=(i-r)/f+(i<r?6:0);break;case i:l=(r-n)/f+2;break;case r:l=(n-i)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(be.copy(this),e),t.r=be.r,t.g=be.g,t.b=be.b,t}getStyle(t=Me){Yt.fromWorkingColorSpace(be.copy(this),t);const e=be.r,n=be.g,i=be.b;return t!==Me?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Fn),this.setHSL(Fn.h+t,Fn.s+e,Fn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Fn),t.getHSL(Fs);const n=hs(Fn.h,Fs.h,e),i=hs(Fn.s,Fs.s,e),r=hs(Fn.l,Fs.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const be=new Tt;Tt.NAMES=Gc;let vf=0;class Ms extends Wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vf++}),this.uuid=$i(),this.name="",this.type="Material",this.blending=Fi,this.side=Cn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ma,this.blendDst=ya,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Tt(0,0,0),this.blendAlpha=0,this.depthFunc=lr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Go,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=li,this.stencilZFail=li,this.stencilZPass=li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Fi&&(n.blending=this.blending),this.side!==Cn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ma&&(n.blendSrc=this.blendSrc),this.blendDst!==ya&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==lr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Go&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Vc extends Ms{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ac,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ce=new z,zs=new Lt;class fe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Vo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Tn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)zs.fromBufferAttribute(this,e),zs.applyMatrix3(t),this.setXY(e,zs.x,zs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyMatrix3(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyMatrix4(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyNormalMatrix(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.transformDirection(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ti(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Te(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ti(e,this.array)),e}setX(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ti(e,this.array)),e}setY(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ti(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ti(e,this.array)),e}setW(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array),i=Te(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array),i=Te(i,this.array),r=Te(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Vo&&(t.usage=this.usage),t}}class Wc extends fe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class $c extends fe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends fe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let xf=0;const Ke=new Kt,Zr=new Be,vi=new z,We=new cn,ts=new cn,xe=new z;class Ie extends Wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=$i(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(kc(t)?$c:Wc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Vt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,n){return Ke.makeTranslation(t,e,n),this.applyMatrix4(Ke),this}scale(t,e,n){return Ke.makeScale(t,e,n),this.applyMatrix4(Ke),this}lookAt(t){return Zr.lookAt(t),Zr.updateMatrix(),this.applyMatrix4(Zr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vi).negate(),this.translate(vi.x,vi.y,vi.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new he(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];We.setFromBufferAttribute(r),this.morphTargetsRelative?(xe.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(xe),xe.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(xe)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new z,1/0);return}if(t){const n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];ts.setFromBufferAttribute(a),this.morphTargetsRelative?(xe.addVectors(We.min,ts.min),We.expandByPoint(xe),xe.addVectors(We.max,ts.max),We.expandByPoint(xe)):(We.expandByPoint(ts.min),We.expandByPoint(ts.max))}We.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)xe.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(xe));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)xe.fromBufferAttribute(a,c),l&&(vi.fromBufferAttribute(t,c),xe.add(vi)),i=Math.max(i,n.distanceToSquared(xe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,r=e.normal.array,o=e.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fe(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let w=0;w<a;w++)c[w]=new z,h[w]=new z;const f=new z,d=new z,m=new z,v=new Lt,g=new Lt,p=new Lt,u=new z,x=new z;function _(w,L,C){f.fromArray(i,w*3),d.fromArray(i,L*3),m.fromArray(i,C*3),v.fromArray(o,w*2),g.fromArray(o,L*2),p.fromArray(o,C*2),d.sub(f),m.sub(f),g.sub(v),p.sub(v);const k=1/(g.x*p.y-p.x*g.y);isFinite(k)&&(u.copy(d).multiplyScalar(p.y).addScaledVector(m,-g.y).multiplyScalar(k),x.copy(m).multiplyScalar(g.x).addScaledVector(d,-p.x).multiplyScalar(k),c[w].add(u),c[L].add(u),c[C].add(u),h[w].add(x),h[L].add(x),h[C].add(x))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let w=0,L=y.length;w<L;++w){const C=y[w],k=C.start,P=C.count;for(let F=k,B=k+P;F<B;F+=3)_(n[F+0],n[F+1],n[F+2])}const S=new z,E=new z,T=new z,U=new z;function M(w){T.fromArray(r,w*3),U.copy(T);const L=c[w];S.copy(L),S.sub(T.multiplyScalar(T.dot(L))).normalize(),E.crossVectors(U,L);const k=E.dot(h[w])<0?-1:1;l[w*4]=S.x,l[w*4+1]=S.y,l[w*4+2]=S.z,l[w*4+3]=k}for(let w=0,L=y.length;w<L;++w){const C=y[w],k=C.start,P=C.count;for(let F=k,B=k+P;F<B;F+=3)M(n[F+0]),M(n[F+1]),M(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new fe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const i=new z,r=new z,o=new z,a=new z,l=new z,c=new z,h=new z,f=new z;if(t)for(let d=0,m=t.count;d<m;d+=3){const v=t.getX(d+0),g=t.getX(d+1),p=t.getX(d+2);i.fromBufferAttribute(e,v),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,p),h.subVectors(o,r),f.subVectors(i,r),h.cross(f),a.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(v,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=e.count;d<m;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),f.subVectors(i,r),h.cross(f),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)xe.fromBufferAttribute(t,e),xe.normalize(),t.setXYZ(e,xe.x,xe.y,xe.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,f=a.normalized,d=new c.constructor(l.length*h);let m=0,v=0;for(let g=0,p=l.length;g<p;g++){a.isInterleavedBufferAttribute?m=l[g]*a.data.stride+a.offset:m=l[g]*h;for(let u=0;u<h;u++)d[v++]=c[m++]}return new fe(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,f=c.length;h<f;h++){const d=c[h],m=t(d,n);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const m=c[f];h.push(m.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let d=0,m=f.length;d<m;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const il=new Kt,qn=new Ha,ks=new Hn,sl=new z,xi=new z,_i=new z,Mi=new z,Jr=new z,Os=new z,Bs=new Lt,Hs=new Lt,Gs=new Lt,rl=new z,al=new z,ol=new z,Vs=new z,Ws=new z;class le extends Be{constructor(t=new Ie,e=new Vc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){Os.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],f=r[l];h!==0&&(Jr.fromBufferAttribute(f,t),o?Os.addScaledVector(Jr,h):Os.addScaledVector(Jr.sub(e),h))}e.add(Os)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ks.copy(n.boundingSphere),ks.applyMatrix4(r),qn.copy(t.ray).recast(t.near),!(ks.containsPoint(qn.origin)===!1&&(qn.intersectSphere(ks,sl)===null||qn.origin.distanceToSquared(sl)>(t.far-t.near)**2))&&(il.copy(r).invert(),qn.copy(t.ray).applyMatrix4(il),!(n.boundingBox!==null&&qn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,qn)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,d=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,g=d.length;v<g;v++){const p=d[v],u=o[p.materialIndex],x=Math.max(p.start,m.start),_=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let y=x,S=_;y<S;y+=3){const E=a.getX(y),T=a.getX(y+1),U=a.getX(y+2);i=$s(this,u,t,n,c,h,f,E,T,U),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const v=Math.max(0,m.start),g=Math.min(a.count,m.start+m.count);for(let p=v,u=g;p<u;p+=3){const x=a.getX(p),_=a.getX(p+1),y=a.getX(p+2);i=$s(this,o,t,n,c,h,f,x,_,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,g=d.length;v<g;v++){const p=d[v],u=o[p.materialIndex],x=Math.max(p.start,m.start),_=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let y=x,S=_;y<S;y+=3){const E=y,T=y+1,U=y+2;i=$s(this,u,t,n,c,h,f,E,T,U),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const v=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let p=v,u=g;p<u;p+=3){const x=p,_=p+1,y=p+2;i=$s(this,o,t,n,c,h,f,x,_,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function _f(s,t,e,n,i,r,o,a){let l;if(t.side===Ue?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===Cn,a),l===null)return null;Ws.copy(a),Ws.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Ws);return c<e.near||c>e.far?null:{distance:c,point:Ws.clone(),object:s}}function $s(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,xi),s.getVertexPosition(l,_i),s.getVertexPosition(c,Mi);const h=_f(s,t,e,n,xi,_i,Mi,Vs);if(h){i&&(Bs.fromBufferAttribute(i,a),Hs.fromBufferAttribute(i,l),Gs.fromBufferAttribute(i,c),h.uv=rn.getInterpolation(Vs,xi,_i,Mi,Bs,Hs,Gs,new Lt)),r&&(Bs.fromBufferAttribute(r,a),Hs.fromBufferAttribute(r,l),Gs.fromBufferAttribute(r,c),h.uv1=rn.getInterpolation(Vs,xi,_i,Mi,Bs,Hs,Gs,new Lt),h.uv2=h.uv1),o&&(rl.fromBufferAttribute(o,a),al.fromBufferAttribute(o,l),ol.fromBufferAttribute(o,c),h.normal=rn.getInterpolation(Vs,xi,_i,Mi,rl,al,ol,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new z,materialIndex:0};rn.getNormal(xi,_i,Mi,f.normal),h.face=f}return h}class ys extends Ie{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,m=0;v("z","y","x",-1,-1,n,e,t,o,r,0),v("z","y","x",1,-1,n,e,-t,o,r,1),v("x","z","y",1,1,t,n,e,i,o,2),v("x","z","y",1,-1,t,n,-e,i,o,3),v("x","y","z",1,-1,t,e,n,i,r,4),v("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new he(c,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(f,2));function v(g,p,u,x,_,y,S,E,T,U,M){const w=y/T,L=S/U,C=y/2,k=S/2,P=E/2,F=T+1,B=U+1;let j=0,G=0;const Z=new z;for(let J=0;J<B;J++){const Q=J*L-k;for(let lt=0;lt<F;lt++){const K=lt*w-C;Z[g]=K*x,Z[p]=Q*_,Z[u]=P,c.push(Z.x,Z.y,Z.z),Z[g]=0,Z[p]=0,Z[u]=E>0?1:-1,h.push(Z.x,Z.y,Z.z),f.push(lt/T),f.push(1-J/U),j+=1}}for(let J=0;J<U;J++)for(let Q=0;Q<T;Q++){const lt=d+Q+F*J,K=d+Q+F*(J+1),et=d+(Q+1)+F*(J+1),ct=d+(Q+1)+F*J;l.push(lt,K,ct),l.push(K,et,ct),G+=6}a.addGroup(m,G,M),m+=G,d+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ys(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Gi(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Re(s){const t={};for(let e=0;e<s.length;e++){const n=Gi(s[e]);for(const i in n)t[i]=n[i]}return t}function Mf(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Xc(s){return s.getRenderTarget()===null?s.outputColorSpace:Yt.workingColorSpace}const yf={clone:Gi,merge:Re};var wf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class de extends Ms{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wf,this.fragmentShader=Sf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Gi(t.uniforms),this.uniformsGroups=Mf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class qc extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Kt,this.projectionMatrix=new Kt,this.projectionMatrixInverse=new Kt,this.coordinateSystem=Rn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Xe extends qc{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=_s*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(cs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return _s*2*Math.atan(Math.tan(cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(cs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const yi=-90,wi=1;class bf extends Be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Xe(yi,wi,t,e);i.layers=this.layers,this.add(i);const r=new Xe(yi,wi,t,e);r.layers=this.layers,this.add(r);const o=new Xe(yi,wi,t,e);o.layers=this.layers,this.add(o);const a=new Xe(yi,wi,t,e);a.layers=this.layers,this.add(a);const l=new Xe(yi,wi,t,e);l.layers=this.layers,this.add(l);const c=new Xe(yi,wi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Rn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===dr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(f,d,m),t.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class jc extends Oe{constructor(t,e,n,i,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Oi,super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ef extends gn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(us("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===ri?Me:Je),this.texture=new jc(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ye}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ys(5,5,5),r=new de({name:"CubemapFromEquirect",uniforms:Gi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ue,blending:kn});r.uniforms.tEquirect.value=e;const o=new le(i,r),a=e.minFilter;return e.minFilter===oi&&(e.minFilter=ye),new bf(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}const Qr=new z,Af=new z,Tf=new Vt;class Zn{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Qr.subVectors(n,e).cross(Af.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Qr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Tf.getNormalMatrix(t),i=this.coplanarPoint(Qr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const jn=new Hn,Xs=new z;class qi{constructor(t=new Zn,e=new Zn,n=new Zn,i=new Zn,r=new Zn,o=new Zn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Rn){const n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],f=i[6],d=i[7],m=i[8],v=i[9],g=i[10],p=i[11],u=i[12],x=i[13],_=i[14],y=i[15];if(n[0].setComponents(l-r,d-c,p-m,y-u).normalize(),n[1].setComponents(l+r,d+c,p+m,y+u).normalize(),n[2].setComponents(l+o,d+h,p+v,y+x).normalize(),n[3].setComponents(l-o,d-h,p-v,y-x).normalize(),n[4].setComponents(l-a,d-f,p-g,y-_).normalize(),e===Rn)n[5].setComponents(l+a,d+f,p+g,y+_).normalize();else if(e===dr)n[5].setComponents(a,f,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),jn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),jn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(jn)}intersectsSprite(t){return jn.center.set(0,0,0),jn.radius=.7071067811865476,jn.applyMatrix4(t.matrixWorld),this.intersectsSphere(jn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Xs.x=i.normal.x>0?t.max.x:t.min.x,Xs.y=i.normal.y>0?t.max.y:t.min.y,Xs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Xs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Yc(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Rf(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,h){const f=c.array,d=c.usage,m=f.byteLength,v=s.createBuffer();s.bindBuffer(h,v),s.bufferData(h,f,d),c.onUploadCallback();let g;if(f instanceof Float32Array)g=s.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=s.UNSIGNED_SHORT;else if(f instanceof Int16Array)g=s.SHORT;else if(f instanceof Uint32Array)g=s.UNSIGNED_INT;else if(f instanceof Int32Array)g=s.INT;else if(f instanceof Int8Array)g=s.BYTE;else if(f instanceof Uint8Array)g=s.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)g=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:v,type:g,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:m}}function r(c,h,f){const d=h.array,m=h._updateRange,v=h.updateRanges;if(s.bindBuffer(f,c),m.count===-1&&v.length===0&&s.bufferSubData(f,0,d),v.length!==0){for(let g=0,p=v.length;g<p;g++){const u=v[g];e?s.bufferSubData(f,u.start*d.BYTES_PER_ELEMENT,d,u.start,u.count):s.bufferSubData(f,u.start*d.BYTES_PER_ELEMENT,d.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}m.count!==-1&&(e?s.bufferSubData(f,m.offset*d.BYTES_PER_ELEMENT,d,m.offset,m.count):s.bufferSubData(f,m.offset*d.BYTES_PER_ELEMENT,d.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=n.get(c);if(f===void 0)n.set(c,i(c,h));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(f.buffer,c,h),f.version=c.version}}return{get:o,remove:a,update:l}}class Va extends Ie{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,f=t/a,d=e/l,m=[],v=[],g=[],p=[];for(let u=0;u<h;u++){const x=u*d-o;for(let _=0;_<c;_++){const y=_*f-r;v.push(y,-x,0),g.push(0,0,1),p.push(_/a),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let x=0;x<a;x++){const _=x+c*u,y=x+c*(u+1),S=x+1+c*(u+1),E=x+1+c*u;m.push(_,y,E),m.push(y,S,E)}this.setIndex(m),this.setAttribute("position",new he(v,3)),this.setAttribute("normal",new he(g,3)),this.setAttribute("uv",new he(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Va(t.width,t.height,t.widthSegments,t.heightSegments)}}var Cf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Pf=`#ifdef USE_ALPHAHASH
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
#endif`,Lf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Df=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Uf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,If=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Nf=`#ifdef USE_AOMAP
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
#endif`,Ff=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,zf=`#ifdef USE_BATCHING
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
#endif`,kf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Of=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gf=`#ifdef USE_IRIDESCENCE
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
#endif`,Vf=`#ifdef USE_BUMPMAP
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
#endif`,Wf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$f=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Xf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Yf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Zf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Jf=`#define PI 3.141592653589793
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
} // validated`,Qf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,td=`vec3 transformedNormal = objectNormal;
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
#endif`,ed=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,nd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,id=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rd="gl_FragColor = linearToOutputTexel( gl_FragColor );",ad=`
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
}`,od=`#ifdef USE_ENVMAP
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
#endif`,ld=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,cd=`#ifdef USE_ENVMAP
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
#endif`,hd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ud=`#ifdef USE_ENVMAP
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
#endif`,fd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,dd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,md=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gd=`#ifdef USE_GRADIENTMAP
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
}`,vd=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,xd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_d=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Md=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yd=`uniform bool receiveShadow;
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
#endif`,wd=`#ifdef USE_ENVMAP
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
#endif`,Sd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,bd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ed=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ad=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Td=`PhysicalMaterial material;
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
#endif`,Rd=`struct PhysicalMaterial {
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
}`,Cd=`
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
#endif`,Pd=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ld=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Dd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ud=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Id=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Nd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Fd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Od=`#if defined( USE_POINTS_UV )
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
#endif`,Bd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vd=`#ifdef USE_MORPHNORMALS
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
#endif`,Wd=`#ifdef USE_MORPHTARGETS
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
#endif`,$d=`#ifdef USE_MORPHTARGETS
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
#endif`,Xd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,jd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Zd=`#ifdef USE_NORMALMAP
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
#endif`,Jd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ep=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,np=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ip=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,rp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ap=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,op=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,lp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,hp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,up=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,dp=`float getShadowMask() {
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
}`,pp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,mp=`#ifdef USE_SKINNING
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
#endif`,gp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vp=`#ifdef USE_SKINNING
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
#endif`,xp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_p=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Mp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,wp=`#ifdef USE_TRANSMISSION
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
#endif`,Sp=`#ifdef USE_TRANSMISSION
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
#endif`,bp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ep=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Rp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Cp=`uniform sampler2D t2D;
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
}`,Pp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Up=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ip=`#include <common>
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
}`,Np=`#if DEPTH_PACKING == 3200
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
}`,Fp=`#define DISTANCE
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
}`,zp=`#define DISTANCE
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
}`,kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Op=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bp=`uniform float scale;
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
}`,Hp=`uniform vec3 diffuse;
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
}`,Gp=`#include <common>
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
}`,Vp=`uniform vec3 diffuse;
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
}`,Wp=`#define LAMBERT
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
}`,$p=`#define LAMBERT
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
}`,Xp=`#define MATCAP
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
}`,qp=`#define MATCAP
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
}`,jp=`#define NORMAL
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
}`,Yp=`#define NORMAL
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
}`,Kp=`#define PHONG
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
}`,Zp=`#define PHONG
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
}`,Jp=`#define STANDARD
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
}`,Qp=`#define STANDARD
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
}`,tm=`#define TOON
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
}`,em=`#define TOON
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
}`,nm=`uniform float size;
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
}`,im=`uniform vec3 diffuse;
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
}`,sm=`#include <common>
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
}`,rm=`uniform vec3 color;
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
}`,am=`uniform float rotation;
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
}`,om=`uniform vec3 diffuse;
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
}`,zt={alphahash_fragment:Cf,alphahash_pars_fragment:Pf,alphamap_fragment:Lf,alphamap_pars_fragment:Df,alphatest_fragment:Uf,alphatest_pars_fragment:If,aomap_fragment:Nf,aomap_pars_fragment:Ff,batching_pars_vertex:zf,batching_vertex:kf,begin_vertex:Of,beginnormal_vertex:Bf,bsdfs:Hf,iridescence_fragment:Gf,bumpmap_pars_fragment:Vf,clipping_planes_fragment:Wf,clipping_planes_pars_fragment:$f,clipping_planes_pars_vertex:Xf,clipping_planes_vertex:qf,color_fragment:jf,color_pars_fragment:Yf,color_pars_vertex:Kf,color_vertex:Zf,common:Jf,cube_uv_reflection_fragment:Qf,defaultnormal_vertex:td,displacementmap_pars_vertex:ed,displacementmap_vertex:nd,emissivemap_fragment:id,emissivemap_pars_fragment:sd,colorspace_fragment:rd,colorspace_pars_fragment:ad,envmap_fragment:od,envmap_common_pars_fragment:ld,envmap_pars_fragment:cd,envmap_pars_vertex:hd,envmap_physical_pars_fragment:wd,envmap_vertex:ud,fog_vertex:fd,fog_pars_vertex:dd,fog_fragment:pd,fog_pars_fragment:md,gradientmap_pars_fragment:gd,lightmap_fragment:vd,lightmap_pars_fragment:xd,lights_lambert_fragment:_d,lights_lambert_pars_fragment:Md,lights_pars_begin:yd,lights_toon_fragment:Sd,lights_toon_pars_fragment:bd,lights_phong_fragment:Ed,lights_phong_pars_fragment:Ad,lights_physical_fragment:Td,lights_physical_pars_fragment:Rd,lights_fragment_begin:Cd,lights_fragment_maps:Pd,lights_fragment_end:Ld,logdepthbuf_fragment:Dd,logdepthbuf_pars_fragment:Ud,logdepthbuf_pars_vertex:Id,logdepthbuf_vertex:Nd,map_fragment:Fd,map_pars_fragment:zd,map_particle_fragment:kd,map_particle_pars_fragment:Od,metalnessmap_fragment:Bd,metalnessmap_pars_fragment:Hd,morphcolor_vertex:Gd,morphnormal_vertex:Vd,morphtarget_pars_vertex:Wd,morphtarget_vertex:$d,normal_fragment_begin:Xd,normal_fragment_maps:qd,normal_pars_fragment:jd,normal_pars_vertex:Yd,normal_vertex:Kd,normalmap_pars_fragment:Zd,clearcoat_normal_fragment_begin:Jd,clearcoat_normal_fragment_maps:Qd,clearcoat_pars_fragment:tp,iridescence_pars_fragment:ep,opaque_fragment:np,packing:ip,premultiplied_alpha_fragment:sp,project_vertex:rp,dithering_fragment:ap,dithering_pars_fragment:op,roughnessmap_fragment:lp,roughnessmap_pars_fragment:cp,shadowmap_pars_fragment:hp,shadowmap_pars_vertex:up,shadowmap_vertex:fp,shadowmask_pars_fragment:dp,skinbase_vertex:pp,skinning_pars_vertex:mp,skinning_vertex:gp,skinnormal_vertex:vp,specularmap_fragment:xp,specularmap_pars_fragment:_p,tonemapping_fragment:Mp,tonemapping_pars_fragment:yp,transmission_fragment:wp,transmission_pars_fragment:Sp,uv_pars_fragment:bp,uv_pars_vertex:Ep,uv_vertex:Ap,worldpos_vertex:Tp,background_vert:Rp,background_frag:Cp,backgroundCube_vert:Pp,backgroundCube_frag:Lp,cube_vert:Dp,cube_frag:Up,depth_vert:Ip,depth_frag:Np,distanceRGBA_vert:Fp,distanceRGBA_frag:zp,equirect_vert:kp,equirect_frag:Op,linedashed_vert:Bp,linedashed_frag:Hp,meshbasic_vert:Gp,meshbasic_frag:Vp,meshlambert_vert:Wp,meshlambert_frag:$p,meshmatcap_vert:Xp,meshmatcap_frag:qp,meshnormal_vert:jp,meshnormal_frag:Yp,meshphong_vert:Kp,meshphong_frag:Zp,meshphysical_vert:Jp,meshphysical_frag:Qp,meshtoon_vert:tm,meshtoon_frag:em,points_vert:nm,points_frag:im,shadow_vert:sm,shadow_frag:rm,sprite_vert:am,sprite_frag:om},ot={common:{diffuse:{value:new Tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new Tt(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},dn={basic:{uniforms:Re([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.fog]),vertexShader:zt.meshbasic_vert,fragmentShader:zt.meshbasic_frag},lambert:{uniforms:Re([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new Tt(0)}}]),vertexShader:zt.meshlambert_vert,fragmentShader:zt.meshlambert_frag},phong:{uniforms:Re([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new Tt(0)},specular:{value:new Tt(1118481)},shininess:{value:30}}]),vertexShader:zt.meshphong_vert,fragmentShader:zt.meshphong_frag},standard:{uniforms:Re([ot.common,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.roughnessmap,ot.metalnessmap,ot.fog,ot.lights,{emissive:{value:new Tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag},toon:{uniforms:Re([ot.common,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.gradientmap,ot.fog,ot.lights,{emissive:{value:new Tt(0)}}]),vertexShader:zt.meshtoon_vert,fragmentShader:zt.meshtoon_frag},matcap:{uniforms:Re([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,{matcap:{value:null}}]),vertexShader:zt.meshmatcap_vert,fragmentShader:zt.meshmatcap_frag},points:{uniforms:Re([ot.points,ot.fog]),vertexShader:zt.points_vert,fragmentShader:zt.points_frag},dashed:{uniforms:Re([ot.common,ot.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:zt.linedashed_vert,fragmentShader:zt.linedashed_frag},depth:{uniforms:Re([ot.common,ot.displacementmap]),vertexShader:zt.depth_vert,fragmentShader:zt.depth_frag},normal:{uniforms:Re([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,{opacity:{value:1}}]),vertexShader:zt.meshnormal_vert,fragmentShader:zt.meshnormal_frag},sprite:{uniforms:Re([ot.sprite,ot.fog]),vertexShader:zt.sprite_vert,fragmentShader:zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:zt.background_vert,fragmentShader:zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:zt.backgroundCube_vert,fragmentShader:zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:zt.cube_vert,fragmentShader:zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:zt.equirect_vert,fragmentShader:zt.equirect_frag},distanceRGBA:{uniforms:Re([ot.common,ot.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:zt.distanceRGBA_vert,fragmentShader:zt.distanceRGBA_frag},shadow:{uniforms:Re([ot.lights,ot.fog,{color:{value:new Tt(0)},opacity:{value:1}}]),vertexShader:zt.shadow_vert,fragmentShader:zt.shadow_frag}};dn.physical={uniforms:Re([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new Tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new Tt(0)},specularColor:{value:new Tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag};const qs={r:0,b:0,g:0};function lm(s,t,e,n,i,r,o){const a=new Tt(0);let l=r===!0?0:1,c,h,f=null,d=0,m=null;function v(p,u){let x=!1,_=u.isScene===!0?u.background:null;_&&_.isTexture&&(_=(u.backgroundBlurriness>0?e:t).get(_)),_===null?g(a,l):_&&_.isColor&&(g(_,1),x=!0);const y=s.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||x)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),_&&(_.isCubeTexture||_.mapping===yr)?(h===void 0&&(h=new le(new ys(1,1,1),new de({name:"BackgroundCubeMaterial",uniforms:Gi(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Ue,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,E,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=Yt.getTransfer(_.colorSpace)!==ee,(f!==_||d!==_.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,f=_,d=_.version,m=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new le(new Va(2,2),new de({name:"BackgroundMaterial",uniforms:Gi(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Cn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(_.colorSpace)!==ee,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(f!==_||d!==_.version||m!==s.toneMapping)&&(c.material.needsUpdate=!0,f=_,d=_.version,m=s.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function g(p,u){p.getRGB(qs,Xc(s)),n.buffers.color.setClear(qs.r,qs.g,qs.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),l=u,g(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,g(a,l)},render:v}}function cm(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null);let c=l,h=!1;function f(P,F,B,j,G){let Z=!1;if(o){const J=g(j,B,F);c!==J&&(c=J,m(c.object)),Z=u(P,j,B,G),Z&&x(P,j,B,G)}else{const J=F.wireframe===!0;(c.geometry!==j.id||c.program!==B.id||c.wireframe!==J)&&(c.geometry=j.id,c.program=B.id,c.wireframe=J,Z=!0)}G!==null&&e.update(G,s.ELEMENT_ARRAY_BUFFER),(Z||h)&&(h=!1,U(P,F,B,j),G!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function d(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function m(P){return n.isWebGL2?s.bindVertexArray(P):r.bindVertexArrayOES(P)}function v(P){return n.isWebGL2?s.deleteVertexArray(P):r.deleteVertexArrayOES(P)}function g(P,F,B){const j=B.wireframe===!0;let G=a[P.id];G===void 0&&(G={},a[P.id]=G);let Z=G[F.id];Z===void 0&&(Z={},G[F.id]=Z);let J=Z[j];return J===void 0&&(J=p(d()),Z[j]=J),J}function p(P){const F=[],B=[],j=[];for(let G=0;G<i;G++)F[G]=0,B[G]=0,j[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:B,attributeDivisors:j,object:P,attributes:{},index:null}}function u(P,F,B,j){const G=c.attributes,Z=F.attributes;let J=0;const Q=B.getAttributes();for(const lt in Q)if(Q[lt].location>=0){const et=G[lt];let ct=Z[lt];if(ct===void 0&&(lt==="instanceMatrix"&&P.instanceMatrix&&(ct=P.instanceMatrix),lt==="instanceColor"&&P.instanceColor&&(ct=P.instanceColor)),et===void 0||et.attribute!==ct||ct&&et.data!==ct.data)return!0;J++}return c.attributesNum!==J||c.index!==j}function x(P,F,B,j){const G={},Z=F.attributes;let J=0;const Q=B.getAttributes();for(const lt in Q)if(Q[lt].location>=0){let et=Z[lt];et===void 0&&(lt==="instanceMatrix"&&P.instanceMatrix&&(et=P.instanceMatrix),lt==="instanceColor"&&P.instanceColor&&(et=P.instanceColor));const ct={};ct.attribute=et,et&&et.data&&(ct.data=et.data),G[lt]=ct,J++}c.attributes=G,c.attributesNum=J,c.index=j}function _(){const P=c.newAttributes;for(let F=0,B=P.length;F<B;F++)P[F]=0}function y(P){S(P,0)}function S(P,F){const B=c.newAttributes,j=c.enabledAttributes,G=c.attributeDivisors;B[P]=1,j[P]===0&&(s.enableVertexAttribArray(P),j[P]=1),G[P]!==F&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,F),G[P]=F)}function E(){const P=c.newAttributes,F=c.enabledAttributes;for(let B=0,j=F.length;B<j;B++)F[B]!==P[B]&&(s.disableVertexAttribArray(B),F[B]=0)}function T(P,F,B,j,G,Z,J){J===!0?s.vertexAttribIPointer(P,F,B,G,Z):s.vertexAttribPointer(P,F,B,j,G,Z)}function U(P,F,B,j){if(n.isWebGL2===!1&&(P.isInstancedMesh||j.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();const G=j.attributes,Z=B.getAttributes(),J=F.defaultAttributeValues;for(const Q in Z){const lt=Z[Q];if(lt.location>=0){let K=G[Q];if(K===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(K=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(K=P.instanceColor)),K!==void 0){const et=K.normalized,ct=K.itemSize,pt=e.get(K);if(pt===void 0)continue;const mt=pt.buffer,wt=pt.type,Et=pt.bytesPerElement,Mt=n.isWebGL2===!0&&(wt===s.INT||wt===s.UNSIGNED_INT||K.gpuType===Rc);if(K.isInterleavedBufferAttribute){const Nt=K.data,H=Nt.stride,ae=K.offset;if(Nt.isInstancedInterleavedBuffer){for(let xt=0;xt<lt.locationSize;xt++)S(lt.location+xt,Nt.meshPerAttribute);P.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=Nt.meshPerAttribute*Nt.count)}else for(let xt=0;xt<lt.locationSize;xt++)y(lt.location+xt);s.bindBuffer(s.ARRAY_BUFFER,mt);for(let xt=0;xt<lt.locationSize;xt++)T(lt.location+xt,ct/lt.locationSize,wt,et,H*Et,(ae+ct/lt.locationSize*xt)*Et,Mt)}else{if(K.isInstancedBufferAttribute){for(let Nt=0;Nt<lt.locationSize;Nt++)S(lt.location+Nt,K.meshPerAttribute);P.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Nt=0;Nt<lt.locationSize;Nt++)y(lt.location+Nt);s.bindBuffer(s.ARRAY_BUFFER,mt);for(let Nt=0;Nt<lt.locationSize;Nt++)T(lt.location+Nt,ct/lt.locationSize,wt,et,ct*Et,ct/lt.locationSize*Nt*Et,Mt)}}else if(J!==void 0){const et=J[Q];if(et!==void 0)switch(et.length){case 2:s.vertexAttrib2fv(lt.location,et);break;case 3:s.vertexAttrib3fv(lt.location,et);break;case 4:s.vertexAttrib4fv(lt.location,et);break;default:s.vertexAttrib1fv(lt.location,et)}}}}E()}function M(){C();for(const P in a){const F=a[P];for(const B in F){const j=F[B];for(const G in j)v(j[G].object),delete j[G];delete F[B]}delete a[P]}}function w(P){if(a[P.id]===void 0)return;const F=a[P.id];for(const B in F){const j=F[B];for(const G in j)v(j[G].object),delete j[G];delete F[B]}delete a[P.id]}function L(P){for(const F in a){const B=a[F];if(B[P.id]===void 0)continue;const j=B[P.id];for(const G in j)v(j[G].object),delete j[G];delete B[P.id]}}function C(){k(),h=!0,c!==l&&(c=l,m(c.object))}function k(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:C,resetDefaultState:k,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfProgram:L,initAttributes:_,enableAttribute:y,disableUnusedAttributes:E}}function hm(s,t,e,n){const i=n.isWebGL2;let r;function o(h){r=h}function a(h,f){s.drawArrays(r,h,f),e.update(f,r,1)}function l(h,f,d){if(d===0)return;let m,v;if(i)m=s,v="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[v](r,h,f,d),e.update(f,r,d)}function c(h,f,d){if(d===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<d;v++)this.render(h[v],f[v]);else{m.multiDrawArraysWEBGL(r,h,0,f,0,d);let v=0;for(let g=0;g<d;g++)v+=f[g];e.update(v,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function um(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),u=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),_=d>0,y=o||t.has("OES_texture_float"),S=_&&y,E=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:d,maxTextureSize:m,maxCubemapSize:v,maxAttributes:g,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:x,vertexTextures:_,floatFragmentTextures:y,floatVertexTextures:S,maxSamples:E}}function fm(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new Zn,a=new Vt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const m=f.length!==0||d||n!==0||i;return i=d,n=f.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,m){const v=f.clippingPlanes,g=f.clipIntersection,p=f.clipShadows,u=s.get(f);if(!i||v===null||v.length===0||r&&!p)r?h(null):c();else{const x=r?0:n,_=x*4;let y=u.clippingState||null;l.value=y,y=h(v,d,_,m);for(let S=0;S!==_;++S)y[S]=e[S];u.clippingState=y,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,d,m,v){const g=f!==null?f.length:0;let p=null;if(g!==0){if(p=l.value,v!==!0||p===null){const u=m+g*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(p===null||p.length<u)&&(p=new Float32Array(u));for(let _=0,y=m;_!==g;++_,y+=4)o.copy(f[_]).applyMatrix4(x,a),o.normal.toArray(p,y),p[y+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}function dm(s){let t=new WeakMap;function e(o,a){return a===wa?o.mapping=Oi:a===Sa&&(o.mapping=Bi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===wa||a===Sa)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Ef(l.height/2);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class br extends qc{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Di=4,ll=[.125,.215,.35,.446,.526,.582],ei=20,ta=new br,cl=new Tt;let ea=null,na=0,ia=0;const Jn=(1+Math.sqrt(5))/2,Si=1/Jn,hl=[new z(1,1,1),new z(-1,1,1),new z(1,1,-1),new z(-1,1,-1),new z(0,Jn,Si),new z(0,Jn,-Si),new z(Si,0,Jn),new z(-Si,0,Jn),new z(Jn,Si,0),new z(-Jn,Si,0)];class ul{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){ea=this._renderer.getRenderTarget(),na=this._renderer.getActiveCubeFace(),ia=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ea,na,ia),t.scissorTest=!1,js(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Oi||t.mapping===Bi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ea=this._renderer.getRenderTarget(),na=this._renderer.getActiveCubeFace(),ia=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ye,minFilter:ye,generateMipmaps:!1,type:Bn,format:_e,colorSpace:Pn,depthBuffer:!1},i=fl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=pm(r)),this._blurMaterial=mm(r,t,e)}return i}_compileMaterial(t){const e=new le(this._lodPlanes[0],t);this._renderer.compile(e,ta)}_sceneToCubeUV(t,e,n,i){const a=new Xe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(cl),h.toneMapping=On,h.autoClear=!1;const m=new Vc({name:"PMREM.Background",side:Ue,depthWrite:!1,depthTest:!1}),v=new le(new ys,m);let g=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,g=!0):(m.color.copy(cl),g=!0);for(let u=0;u<6;u++){const x=u%3;x===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):x===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));const _=this._cubeSize;js(i,x*_,u>2?_:0,_,_),h.setRenderTarget(i),g&&h.render(v,a),h.render(t,a)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Oi||t.mapping===Bi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=pl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dl());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new le(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;js(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,ta)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=hl[(i-1)%hl.length];this._blur(t,i-1,i,r,o)}e.autoClear=n}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new le(this._lodPlanes[i],c),d=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ei-1),g=r/v,p=isFinite(r)?1+Math.floor(h*g):ei;p>ei&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ei}`);const u=[];let x=0;for(let T=0;T<ei;++T){const U=T/g,M=Math.exp(-U*U/2);u.push(M),T===0?x+=M:T<p&&(x+=2*M)}for(let T=0;T<u.length;T++)u[T]=u[T]/x;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=u,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:_}=this;d.dTheta.value=v,d.mipInt.value=_-n;const y=this._sizeLods[i],S=3*y*(i>_-Di?i-_+Di:0),E=4*(this._cubeSize-y);js(e,S,E,3*y,2*y),l.setRenderTarget(e),l.render(f,ta)}}function pm(s){const t=[],e=[],n=[];let i=s;const r=s-Di+1+ll.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>s-Di?l=ll[o-s+Di-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,v=6,g=3,p=2,u=1,x=new Float32Array(g*v*m),_=new Float32Array(p*v*m),y=new Float32Array(u*v*m);for(let E=0;E<m;E++){const T=E%3*2/3-1,U=E>2?0:-1,M=[T,U,0,T+2/3,U,0,T+2/3,U+1,0,T,U,0,T+2/3,U+1,0,T,U+1,0];x.set(M,g*v*E),_.set(d,p*v*E);const w=[E,E,E,E,E,E];y.set(w,u*v*E)}const S=new Ie;S.setAttribute("position",new fe(x,g)),S.setAttribute("uv",new fe(_,p)),S.setAttribute("faceIndex",new fe(y,u)),t.push(S),i>Di&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function fl(s,t,e){const n=new gn(s,t,e);return n.texture.mapping=yr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function js(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function mm(s,t,e){const n=new Float32Array(ei),i=new z(0,1,0);return new de({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Wa(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function dl(){return new de({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wa(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function pl(){return new de({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Wa(){return`

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
	`}function gm(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===wa||l===Sa,h=l===Oi||l===Bi;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let f=t.get(a);return e===null&&(e=new ul(s)),f=c?e.fromEquirectangular(a,f):e.fromCubemap(a,f),t.set(a,f),f.texture}else{if(t.has(a))return t.get(a).texture;{const f=a.image;if(c&&f&&f.height>0||h&&f&&i(f)){e===null&&(e=new ul(s));const d=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function vm(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function xm(s,t,e,n){const i={},r=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const v in d.attributes)t.remove(d.attributes[v]);for(const v in d.morphAttributes){const g=d.morphAttributes[v];for(let p=0,u=g.length;p<u;p++)t.remove(g[p])}d.removeEventListener("dispose",o),delete i[d.id];const m=r.get(d);m&&(t.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(f,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const v in d)t.update(d[v],s.ARRAY_BUFFER);const m=f.morphAttributes;for(const v in m){const g=m[v];for(let p=0,u=g.length;p<u;p++)t.update(g[p],s.ARRAY_BUFFER)}}function c(f){const d=[],m=f.index,v=f.attributes.position;let g=0;if(m!==null){const x=m.array;g=m.version;for(let _=0,y=x.length;_<y;_+=3){const S=x[_+0],E=x[_+1],T=x[_+2];d.push(S,E,E,T,T,S)}}else if(v!==void 0){const x=v.array;g=v.version;for(let _=0,y=x.length/3-1;_<y;_+=3){const S=_+0,E=_+1,T=_+2;d.push(S,E,E,T,T,S)}}else return;const p=new(kc(d)?$c:Wc)(d,1);p.version=g;const u=r.get(f);u&&t.remove(u),r.set(f,p)}function h(f){const d=r.get(f);if(d){const m=f.index;m!==null&&d.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function _m(s,t,e,n){const i=n.isWebGL2;let r;function o(m){r=m}let a,l;function c(m){a=m.type,l=m.bytesPerElement}function h(m,v){s.drawElements(r,v,a,m*l),e.update(v,r,1)}function f(m,v,g){if(g===0)return;let p,u;if(i)p=s,u="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[u](r,v,a,m*l,g),e.update(v,r,g)}function d(m,v,g){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<g;u++)this.render(m[u]/l,v[u]);else{p.multiDrawElementsWEBGL(r,v,0,a,m,0,g);let u=0;for(let x=0;x<g;x++)u+=v[x];e.update(u,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=f,this.renderMultiDraw=d}function Mm(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function ym(s,t){return s[0]-t[0]}function wm(s,t){return Math.abs(t[1])-Math.abs(s[1])}function Sm(s,t,e){const n={},i=new Float32Array(8),r=new WeakMap,o=new $t,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,f){const d=c.morphTargetInfluences;if(t.isWebGL2===!0){const m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=m!==void 0?m.length:0;let g=r.get(h);if(g===void 0||g.count!==v){let P=function(){C.dispose(),r.delete(h),h.removeEventListener("dispose",P)};g!==void 0&&g.texture.dispose();const x=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,S=h.morphAttributes.position||[],E=h.morphAttributes.normal||[],T=h.morphAttributes.color||[];let U=0;x===!0&&(U=1),_===!0&&(U=2),y===!0&&(U=3);let M=h.attributes.position.count*U,w=1;M>t.maxTextureSize&&(w=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const L=new Float32Array(M*w*4*v),C=new Hc(L,M,w,v);C.type=Tn,C.needsUpdate=!0;const k=U*4;for(let F=0;F<v;F++){const B=S[F],j=E[F],G=T[F],Z=M*w*4*F;for(let J=0;J<B.count;J++){const Q=J*k;x===!0&&(o.fromBufferAttribute(B,J),L[Z+Q+0]=o.x,L[Z+Q+1]=o.y,L[Z+Q+2]=o.z,L[Z+Q+3]=0),_===!0&&(o.fromBufferAttribute(j,J),L[Z+Q+4]=o.x,L[Z+Q+5]=o.y,L[Z+Q+6]=o.z,L[Z+Q+7]=0),y===!0&&(o.fromBufferAttribute(G,J),L[Z+Q+8]=o.x,L[Z+Q+9]=o.y,L[Z+Q+10]=o.z,L[Z+Q+11]=G.itemSize===4?o.w:1)}}g={count:v,texture:C,size:new Lt(M,w)},r.set(h,g),h.addEventListener("dispose",P)}let p=0;for(let x=0;x<d.length;x++)p+=d[x];const u=h.morphTargetsRelative?1:1-p;f.getUniforms().setValue(s,"morphTargetBaseInfluence",u),f.getUniforms().setValue(s,"morphTargetInfluences",d),f.getUniforms().setValue(s,"morphTargetsTexture",g.texture,e),f.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}else{const m=d===void 0?0:d.length;let v=n[h.id];if(v===void 0||v.length!==m){v=[];for(let _=0;_<m;_++)v[_]=[_,0];n[h.id]=v}for(let _=0;_<m;_++){const y=v[_];y[0]=_,y[1]=d[_]}v.sort(wm);for(let _=0;_<8;_++)_<m&&v[_][1]?(a[_][0]=v[_][0],a[_][1]=v[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(ym);const g=h.morphAttributes.position,p=h.morphAttributes.normal;let u=0;for(let _=0;_<8;_++){const y=a[_],S=y[0],E=y[1];S!==Number.MAX_SAFE_INTEGER&&E?(g&&h.getAttribute("morphTarget"+_)!==g[S]&&h.setAttribute("morphTarget"+_,g[S]),p&&h.getAttribute("morphNormal"+_)!==p[S]&&h.setAttribute("morphNormal"+_,p[S]),i[_]=E,u+=E):(g&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),i[_]=0)}const x=h.morphTargetsRelative?1:1-u;f.getUniforms().setValue(s,"morphTargetBaseInfluence",x),f.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function bm(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,f=t.get(l,h);if(i.get(f)!==c&&(t.update(f),i.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return f}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class $a extends Oe{constructor(t,e,n,i,r,o,a,l,c,h){if(h=h!==void 0?h:si,h!==si&&h!==Hi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===si&&(n=An),n===void 0&&h===Hi&&(n=ii),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:te,this.minFilter=l!==void 0?l:te,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Kc=new Oe,Zc=new $a(1,1);Zc.compareFunction=zc;const Jc=new Hc,Qc=new lf,th=new jc,ml=[],gl=[],vl=new Float32Array(16),xl=new Float32Array(9),_l=new Float32Array(4);function ji(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=ml[i];if(r===void 0&&(r=new Float32Array(i),ml[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function pe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function me(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Er(s,t){let e=gl[t];e===void 0&&(e=new Int32Array(t),gl[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Em(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Am(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2fv(this.addr,t),me(e,t)}}function Tm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(pe(e,t))return;s.uniform3fv(this.addr,t),me(e,t)}}function Rm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4fv(this.addr,t),me(e,t)}}function Cm(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;_l.set(n),s.uniformMatrix2fv(this.addr,!1,_l),me(e,n)}}function Pm(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;xl.set(n),s.uniformMatrix3fv(this.addr,!1,xl),me(e,n)}}function Lm(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;vl.set(n),s.uniformMatrix4fv(this.addr,!1,vl),me(e,n)}}function Dm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Um(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2iv(this.addr,t),me(e,t)}}function Im(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pe(e,t))return;s.uniform3iv(this.addr,t),me(e,t)}}function Nm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4iv(this.addr,t),me(e,t)}}function Fm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function zm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2uiv(this.addr,t),me(e,t)}}function km(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pe(e,t))return;s.uniform3uiv(this.addr,t),me(e,t)}}function Om(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4uiv(this.addr,t),me(e,t)}}function Bm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?Zc:Kc;e.setTexture2D(t||r,i)}function Hm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Qc,i)}function Gm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||th,i)}function Vm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Jc,i)}function Wm(s){switch(s){case 5126:return Em;case 35664:return Am;case 35665:return Tm;case 35666:return Rm;case 35674:return Cm;case 35675:return Pm;case 35676:return Lm;case 5124:case 35670:return Dm;case 35667:case 35671:return Um;case 35668:case 35672:return Im;case 35669:case 35673:return Nm;case 5125:return Fm;case 36294:return zm;case 36295:return km;case 36296:return Om;case 35678:case 36198:case 36298:case 36306:case 35682:return Bm;case 35679:case 36299:case 36307:return Hm;case 35680:case 36300:case 36308:case 36293:return Gm;case 36289:case 36303:case 36311:case 36292:return Vm}}function $m(s,t){s.uniform1fv(this.addr,t)}function Xm(s,t){const e=ji(t,this.size,2);s.uniform2fv(this.addr,e)}function qm(s,t){const e=ji(t,this.size,3);s.uniform3fv(this.addr,e)}function jm(s,t){const e=ji(t,this.size,4);s.uniform4fv(this.addr,e)}function Ym(s,t){const e=ji(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Km(s,t){const e=ji(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Zm(s,t){const e=ji(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Jm(s,t){s.uniform1iv(this.addr,t)}function Qm(s,t){s.uniform2iv(this.addr,t)}function t0(s,t){s.uniform3iv(this.addr,t)}function e0(s,t){s.uniform4iv(this.addr,t)}function n0(s,t){s.uniform1uiv(this.addr,t)}function i0(s,t){s.uniform2uiv(this.addr,t)}function s0(s,t){s.uniform3uiv(this.addr,t)}function r0(s,t){s.uniform4uiv(this.addr,t)}function a0(s,t,e){const n=this.cache,i=t.length,r=Er(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Kc,r[o])}function o0(s,t,e){const n=this.cache,i=t.length,r=Er(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Qc,r[o])}function l0(s,t,e){const n=this.cache,i=t.length,r=Er(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||th,r[o])}function c0(s,t,e){const n=this.cache,i=t.length,r=Er(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Jc,r[o])}function h0(s){switch(s){case 5126:return $m;case 35664:return Xm;case 35665:return qm;case 35666:return jm;case 35674:return Ym;case 35675:return Km;case 35676:return Zm;case 5124:case 35670:return Jm;case 35667:case 35671:return Qm;case 35668:case 35672:return t0;case 35669:case 35673:return e0;case 5125:return n0;case 36294:return i0;case 36295:return s0;case 36296:return r0;case 35678:case 36198:case 36298:case 36306:case 35682:return a0;case 35679:case 36299:case 36307:return o0;case 35680:case 36300:case 36308:case 36293:return l0;case 36289:case 36303:case 36311:case 36292:return c0}}class u0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Wm(e.type)}}class f0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=h0(e.type)}}class d0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const sa=/(\w+)(\])?(\[|\.)?/g;function Ml(s,t){s.seq.push(t),s.map[t.id]=t}function p0(s,t,e){const n=s.name,i=n.length;for(sa.lastIndex=0;;){const r=sa.exec(n),o=sa.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Ml(e,c===void 0?new u0(a,s,t):new f0(a,s,t));break}else{let f=e.map[a];f===void 0&&(f=new d0(a),Ml(e,f)),e=f}}}class ar{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);p0(r,o,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function yl(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const m0=37297;let g0=0;function v0(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function x0(s){const t=Yt.getPrimaries(Yt.workingColorSpace),e=Yt.getPrimaries(s);let n;switch(t===e?n="":t===fr&&e===ur?n="LinearDisplayP3ToLinearSRGB":t===ur&&e===fr&&(n="LinearSRGBToLinearDisplayP3"),s){case Pn:case wr:return[n,"LinearTransferOETF"];case Me:case Oa:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function wl(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+v0(s.getShaderSource(t),o)}else return i}function _0(s,t){const e=x0(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function M0(s,t){let e;switch(t){case xu:e="Linear";break;case _u:e="Reinhard";break;case Mu:e="OptimizedCineon";break;case yu:e="ACESFilmic";break;case Su:e="AgX";break;case wu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function y0(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ui).join(`
`)}function w0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ui).join(`
`)}function S0(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function b0(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function Ui(s){return s!==""}function Sl(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function bl(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const E0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ta(s){return s.replace(E0,T0)}const A0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function T0(s,t){let e=zt[t];if(e===void 0){const n=A0.get(t);if(n!==void 0)e=zt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ta(e)}const R0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function El(s){return s.replace(R0,C0)}function C0(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Al(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function P0(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Ec?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Xh?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Sn&&(t="SHADOWMAP_TYPE_VSM"),t}function L0(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Oi:case Bi:t="ENVMAP_TYPE_CUBE";break;case yr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function D0(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Bi:t="ENVMAP_MODE_REFRACTION";break}return t}function U0(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Ac:t="ENVMAP_BLENDING_MULTIPLY";break;case gu:t="ENVMAP_BLENDING_MIX";break;case vu:t="ENVMAP_BLENDING_ADD";break}return t}function I0(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function N0(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=P0(e),c=L0(e),h=D0(e),f=U0(e),d=I0(e),m=e.isWebGL2?"":y0(e),v=w0(e),g=S0(r),p=i.createProgram();let u,x,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ui).join(`
`),u.length>0&&(u+=`
`),x=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ui).join(`
`),x.length>0&&(x+=`
`)):(u=[Al(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ui).join(`
`),x=[m,Al(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==On?"#define TONE_MAPPING":"",e.toneMapping!==On?zt.tonemapping_pars_fragment:"",e.toneMapping!==On?M0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",zt.colorspace_pars_fragment,_0("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ui).join(`
`)),o=Ta(o),o=Sl(o,e),o=bl(o,e),a=Ta(a),a=Sl(a,e),a=bl(a,e),o=El(o),a=El(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,u=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,x=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Wo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const y=_+u+o,S=_+x+a,E=yl(i,i.VERTEX_SHADER,y),T=yl(i,i.FRAGMENT_SHADER,S);i.attachShader(p,E),i.attachShader(p,T),e.index0AttributeName!==void 0?i.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function U(C){if(s.debug.checkShaderErrors){const k=i.getProgramInfoLog(p).trim(),P=i.getShaderInfoLog(E).trim(),F=i.getShaderInfoLog(T).trim();let B=!0,j=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(B=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,p,E,T);else{const G=wl(i,E,"vertex"),Z=wl(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+k+`
`+G+`
`+Z)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(P===""||F==="")&&(j=!1);j&&(C.diagnostics={runnable:B,programLog:k,vertexShader:{log:P,prefix:u},fragmentShader:{log:F,prefix:x}})}i.deleteShader(E),i.deleteShader(T),M=new ar(i,p),w=b0(i,p)}let M;this.getUniforms=function(){return M===void 0&&U(this),M};let w;this.getAttributes=function(){return w===void 0&&U(this),w};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(p,m0)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=g0++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=E,this.fragmentShader=T,this}let F0=0;class z0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new k0(t),e.set(t,n)),n}}class k0{constructor(t){this.id=F0++,this.code=t,this.usedTimes=0}}function O0(s,t,e,n,i,r,o){const a=new Ga,l=new z0,c=[],h=i.isWebGL2,f=i.logarithmicDepthBuffer,d=i.vertexTextures;let m=i.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(M){return M===0?"uv":`uv${M}`}function p(M,w,L,C,k){const P=C.fog,F=k.geometry,B=M.isMeshStandardMaterial?C.environment:null,j=(M.isMeshStandardMaterial?e:t).get(M.envMap||B),G=j&&j.mapping===yr?j.image.height:null,Z=v[M.type];M.precision!==null&&(m=i.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const J=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Q=J!==void 0?J.length:0;let lt=0;F.morphAttributes.position!==void 0&&(lt=1),F.morphAttributes.normal!==void 0&&(lt=2),F.morphAttributes.color!==void 0&&(lt=3);let K,et,ct,pt;if(Z){const Ee=dn[Z];K=Ee.vertexShader,et=Ee.fragmentShader}else K=M.vertexShader,et=M.fragmentShader,l.update(M),ct=l.getVertexShaderID(M),pt=l.getFragmentShaderID(M);const mt=s.getRenderTarget(),wt=k.isInstancedMesh===!0,Et=k.isBatchedMesh===!0,Mt=!!M.map,Nt=!!M.matcap,H=!!j,ae=!!M.aoMap,xt=!!M.lightMap,Rt=!!M.bumpMap,V=!!M.normalMap,nt=!!M.displacementMap,st=!!M.emissiveMap,A=!!M.metalnessMap,b=!!M.roughnessMap,D=M.anisotropy>0,N=M.clearcoat>0,W=M.iridescence>0,$=M.sheen>0,rt=M.transmission>0,tt=D&&!!M.anisotropyMap,ht=N&&!!M.clearcoatMap,vt=N&&!!M.clearcoatNormalMap,kt=N&&!!M.clearcoatRoughnessMap,it=W&&!!M.iridescenceMap,jt=W&&!!M.iridescenceThicknessMap,Wt=$&&!!M.sheenColorMap,Dt=$&&!!M.sheenRoughnessMap,St=!!M.specularMap,gt=!!M.specularColorMap,Ft=!!M.specularIntensityMap,qt=rt&&!!M.transmissionMap,se=rt&&!!M.thicknessMap,Ht=!!M.gradientMap,at=!!M.alphaMap,I=M.alphaTest>0,ut=!!M.alphaHash,ft=!!M.extensions,Ct=!!F.attributes.uv1,bt=!!F.attributes.uv2,Zt=!!F.attributes.uv3;let Jt=On;return M.toneMapped&&(mt===null||mt.isXRRenderTarget===!0)&&(Jt=s.toneMapping),{isWebGL2:h,shaderID:Z,shaderType:M.type,shaderName:M.name,vertexShader:K,fragmentShader:et,defines:M.defines,customVertexShaderID:ct,customFragmentShaderID:pt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:Et,instancing:wt,instancingColor:wt&&k.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:mt===null?s.outputColorSpace:mt.isXRRenderTarget===!0?mt.texture.colorSpace:Pn,map:Mt,matcap:Nt,envMap:H,envMapMode:H&&j.mapping,envMapCubeUVHeight:G,aoMap:ae,lightMap:xt,bumpMap:Rt,normalMap:V,displacementMap:d&&nt,emissiveMap:st,normalMapObjectSpace:V&&M.normalMapType===Iu,normalMapTangentSpace:V&&M.normalMapType===Uu,metalnessMap:A,roughnessMap:b,anisotropy:D,anisotropyMap:tt,clearcoat:N,clearcoatMap:ht,clearcoatNormalMap:vt,clearcoatRoughnessMap:kt,iridescence:W,iridescenceMap:it,iridescenceThicknessMap:jt,sheen:$,sheenColorMap:Wt,sheenRoughnessMap:Dt,specularMap:St,specularColorMap:gt,specularIntensityMap:Ft,transmission:rt,transmissionMap:qt,thicknessMap:se,gradientMap:Ht,opaque:M.transparent===!1&&M.blending===Fi,alphaMap:at,alphaTest:I,alphaHash:ut,combine:M.combine,mapUv:Mt&&g(M.map.channel),aoMapUv:ae&&g(M.aoMap.channel),lightMapUv:xt&&g(M.lightMap.channel),bumpMapUv:Rt&&g(M.bumpMap.channel),normalMapUv:V&&g(M.normalMap.channel),displacementMapUv:nt&&g(M.displacementMap.channel),emissiveMapUv:st&&g(M.emissiveMap.channel),metalnessMapUv:A&&g(M.metalnessMap.channel),roughnessMapUv:b&&g(M.roughnessMap.channel),anisotropyMapUv:tt&&g(M.anisotropyMap.channel),clearcoatMapUv:ht&&g(M.clearcoatMap.channel),clearcoatNormalMapUv:vt&&g(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:kt&&g(M.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&g(M.iridescenceMap.channel),iridescenceThicknessMapUv:jt&&g(M.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&g(M.sheenColorMap.channel),sheenRoughnessMapUv:Dt&&g(M.sheenRoughnessMap.channel),specularMapUv:St&&g(M.specularMap.channel),specularColorMapUv:gt&&g(M.specularColorMap.channel),specularIntensityMapUv:Ft&&g(M.specularIntensityMap.channel),transmissionMapUv:qt&&g(M.transmissionMap.channel),thicknessMapUv:se&&g(M.thicknessMap.channel),alphaMapUv:at&&g(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(V||D),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Ct,vertexUv2s:bt,vertexUv3s:Zt,pointsUvs:k.isPoints===!0&&!!F.attributes.uv&&(Mt||at),fog:!!P,useFog:M.fog===!0,fogExp2:P&&P.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:k.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:lt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:Jt,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Mt&&M.map.isVideoTexture===!0&&Yt.getTransfer(M.map.colorSpace)===ee,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===ln,flipSided:M.side===Ue,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:ft&&M.extensions.derivatives===!0,extensionFragDepth:ft&&M.extensions.fragDepth===!0,extensionDrawBuffers:ft&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:ft&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ft&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function u(M){const w=[];if(M.shaderID?w.push(M.shaderID):(w.push(M.customVertexShaderID),w.push(M.customFragmentShaderID)),M.defines!==void 0)for(const L in M.defines)w.push(L),w.push(M.defines[L]);return M.isRawShaderMaterial===!1&&(x(w,M),_(w,M),w.push(s.outputColorSpace)),w.push(M.customProgramCacheKey),w.join()}function x(M,w){M.push(w.precision),M.push(w.outputColorSpace),M.push(w.envMapMode),M.push(w.envMapCubeUVHeight),M.push(w.mapUv),M.push(w.alphaMapUv),M.push(w.lightMapUv),M.push(w.aoMapUv),M.push(w.bumpMapUv),M.push(w.normalMapUv),M.push(w.displacementMapUv),M.push(w.emissiveMapUv),M.push(w.metalnessMapUv),M.push(w.roughnessMapUv),M.push(w.anisotropyMapUv),M.push(w.clearcoatMapUv),M.push(w.clearcoatNormalMapUv),M.push(w.clearcoatRoughnessMapUv),M.push(w.iridescenceMapUv),M.push(w.iridescenceThicknessMapUv),M.push(w.sheenColorMapUv),M.push(w.sheenRoughnessMapUv),M.push(w.specularMapUv),M.push(w.specularColorMapUv),M.push(w.specularIntensityMapUv),M.push(w.transmissionMapUv),M.push(w.thicknessMapUv),M.push(w.combine),M.push(w.fogExp2),M.push(w.sizeAttenuation),M.push(w.morphTargetsCount),M.push(w.morphAttributeCount),M.push(w.numDirLights),M.push(w.numPointLights),M.push(w.numSpotLights),M.push(w.numSpotLightMaps),M.push(w.numHemiLights),M.push(w.numRectAreaLights),M.push(w.numDirLightShadows),M.push(w.numPointLightShadows),M.push(w.numSpotLightShadows),M.push(w.numSpotLightShadowsWithMaps),M.push(w.numLightProbes),M.push(w.shadowMapType),M.push(w.toneMapping),M.push(w.numClippingPlanes),M.push(w.numClipIntersection),M.push(w.depthPacking)}function _(M,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),M.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function y(M){const w=v[M.type];let L;if(w){const C=dn[w];L=yf.clone(C.uniforms)}else L=M.uniforms;return L}function S(M,w){let L;for(let C=0,k=c.length;C<k;C++){const P=c[C];if(P.cacheKey===w){L=P,++L.usedTimes;break}}return L===void 0&&(L=new N0(s,w,M,r),c.push(L)),L}function E(M){if(--M.usedTimes===0){const w=c.indexOf(M);c[w]=c[c.length-1],c.pop(),M.destroy()}}function T(M){l.remove(M)}function U(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:y,acquireProgram:S,releaseProgram:E,releaseShaderCache:T,programs:c,dispose:U}}function B0(){let s=new WeakMap;function t(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function e(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function H0(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Tl(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Rl(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(f,d,m,v,g,p){let u=s[t];return u===void 0?(u={id:f.id,object:f,geometry:d,material:m,groupOrder:v,renderOrder:f.renderOrder,z:g,group:p},s[t]=u):(u.id=f.id,u.object=f,u.geometry=d,u.material=m,u.groupOrder=v,u.renderOrder=f.renderOrder,u.z=g,u.group=p),t++,u}function a(f,d,m,v,g,p){const u=o(f,d,m,v,g,p);m.transmission>0?n.push(u):m.transparent===!0?i.push(u):e.push(u)}function l(f,d,m,v,g,p){const u=o(f,d,m,v,g,p);m.transmission>0?n.unshift(u):m.transparent===!0?i.unshift(u):e.unshift(u)}function c(f,d){e.length>1&&e.sort(f||H0),n.length>1&&n.sort(d||Tl),i.length>1&&i.sort(d||Tl)}function h(){for(let f=t,d=s.length;f<d;f++){const m=s[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function G0(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new Rl,s.set(n,[o])):i>=r.length?(o=new Rl,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function V0(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new z,color:new Tt};break;case"SpotLight":e={position:new z,direction:new z,color:new Tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new Tt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new Tt,groundColor:new Tt};break;case"RectAreaLight":e={color:new Tt,position:new z,halfWidth:new z,halfHeight:new z};break}return s[t.id]=e,e}}}function W0(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let $0=0;function X0(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function q0(s,t){const e=new V0,n=W0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new z);const r=new z,o=new Kt,a=new Kt;function l(h,f){let d=0,m=0,v=0;for(let C=0;C<9;C++)i.probe[C].set(0,0,0);let g=0,p=0,u=0,x=0,_=0,y=0,S=0,E=0,T=0,U=0,M=0;h.sort(X0);const w=f===!0?Math.PI:1;for(let C=0,k=h.length;C<k;C++){const P=h[C],F=P.color,B=P.intensity,j=P.distance,G=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=F.r*B*w,m+=F.g*B*w,v+=F.b*B*w;else if(P.isLightProbe){for(let Z=0;Z<9;Z++)i.probe[Z].addScaledVector(P.sh.coefficients[Z],B);M++}else if(P.isDirectionalLight){const Z=e.get(P);if(Z.color.copy(P.color).multiplyScalar(P.intensity*w),P.castShadow){const J=P.shadow,Q=n.get(P);Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize=J.mapSize,i.directionalShadow[g]=Q,i.directionalShadowMap[g]=G,i.directionalShadowMatrix[g]=P.shadow.matrix,y++}i.directional[g]=Z,g++}else if(P.isSpotLight){const Z=e.get(P);Z.position.setFromMatrixPosition(P.matrixWorld),Z.color.copy(F).multiplyScalar(B*w),Z.distance=j,Z.coneCos=Math.cos(P.angle),Z.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Z.decay=P.decay,i.spot[u]=Z;const J=P.shadow;if(P.map&&(i.spotLightMap[T]=P.map,T++,J.updateMatrices(P),P.castShadow&&U++),i.spotLightMatrix[u]=J.matrix,P.castShadow){const Q=n.get(P);Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize=J.mapSize,i.spotShadow[u]=Q,i.spotShadowMap[u]=G,E++}u++}else if(P.isRectAreaLight){const Z=e.get(P);Z.color.copy(F).multiplyScalar(B),Z.halfWidth.set(P.width*.5,0,0),Z.halfHeight.set(0,P.height*.5,0),i.rectArea[x]=Z,x++}else if(P.isPointLight){const Z=e.get(P);if(Z.color.copy(P.color).multiplyScalar(P.intensity*w),Z.distance=P.distance,Z.decay=P.decay,P.castShadow){const J=P.shadow,Q=n.get(P);Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize=J.mapSize,Q.shadowCameraNear=J.camera.near,Q.shadowCameraFar=J.camera.far,i.pointShadow[p]=Q,i.pointShadowMap[p]=G,i.pointShadowMatrix[p]=P.shadow.matrix,S++}i.point[p]=Z,p++}else if(P.isHemisphereLight){const Z=e.get(P);Z.skyColor.copy(P.color).multiplyScalar(B*w),Z.groundColor.copy(P.groundColor).multiplyScalar(B*w),i.hemi[_]=Z,_++}}x>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ot.LTC_FLOAT_1,i.rectAreaLTC2=ot.LTC_FLOAT_2):(i.rectAreaLTC1=ot.LTC_HALF_1,i.rectAreaLTC2=ot.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ot.LTC_FLOAT_1,i.rectAreaLTC2=ot.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ot.LTC_HALF_1,i.rectAreaLTC2=ot.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=m,i.ambient[2]=v;const L=i.hash;(L.directionalLength!==g||L.pointLength!==p||L.spotLength!==u||L.rectAreaLength!==x||L.hemiLength!==_||L.numDirectionalShadows!==y||L.numPointShadows!==S||L.numSpotShadows!==E||L.numSpotMaps!==T||L.numLightProbes!==M)&&(i.directional.length=g,i.spot.length=u,i.rectArea.length=x,i.point.length=p,i.hemi.length=_,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=E+T-U,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=U,i.numLightProbes=M,L.directionalLength=g,L.pointLength=p,L.spotLength=u,L.rectAreaLength=x,L.hemiLength=_,L.numDirectionalShadows=y,L.numPointShadows=S,L.numSpotShadows=E,L.numSpotMaps=T,L.numLightProbes=M,i.version=$0++)}function c(h,f){let d=0,m=0,v=0,g=0,p=0;const u=f.matrixWorldInverse;for(let x=0,_=h.length;x<_;x++){const y=h[x];if(y.isDirectionalLight){const S=i.directional[d];S.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(u),d++}else if(y.isSpotLight){const S=i.spot[v];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(u),S.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(u),v++}else if(y.isRectAreaLight){const S=i.rectArea[g];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(u),a.identity(),o.copy(y.matrixWorld),o.premultiply(u),a.extractRotation(o),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const S=i.point[m];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(u),m++}else if(y.isHemisphereLight){const S=i.hemi[p];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(u),p++}}}return{setup:l,setupView:c,state:i}}function Cl(s,t){const e=new q0(s,t),n=[],i=[];function r(){n.length=0,i.length=0}function o(f){n.push(f)}function a(f){i.push(f)}function l(f){e.setup(n,f)}function c(f){e.setupView(n,f)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function j0(s,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let l;return a===void 0?(l=new Cl(s,t),e.set(r,[l])):o>=a.length?(l=new Cl(s,t),a.push(l)):l=a[o],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class Y0 extends Ms{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Lu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class K0 extends Ms{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Z0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,J0=`uniform sampler2D shadow_pass;
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
}`;function Q0(s,t,e){let n=new qi;const i=new Lt,r=new Lt,o=new $t,a=new Y0({depthPacking:Du}),l=new K0,c={},h=e.maxTextureSize,f={[Cn]:Ue,[Ue]:Cn,[ln]:ln},d=new de({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:Z0,fragmentShader:J0}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const v=new Ie;v.setAttribute("position",new fe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new le(v,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ec;let u=this.type;this.render=function(E,T,U){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;const M=s.getRenderTarget(),w=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),C=s.state;C.setBlending(kn),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const k=u!==Sn&&this.type===Sn,P=u===Sn&&this.type!==Sn;for(let F=0,B=E.length;F<B;F++){const j=E[F],G=j.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);const Z=G.getFrameExtents();if(i.multiply(Z),r.copy(G.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Z.x),i.x=r.x*Z.x,G.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Z.y),i.y=r.y*Z.y,G.mapSize.y=r.y)),G.map===null||k===!0||P===!0){const Q=this.type!==Sn?{minFilter:te,magFilter:te}:{};G.map!==null&&G.map.dispose(),G.map=new gn(i.x,i.y,Q),G.map.texture.name=j.name+".shadowMap",G.camera.updateProjectionMatrix()}s.setRenderTarget(G.map),s.clear();const J=G.getViewportCount();for(let Q=0;Q<J;Q++){const lt=G.getViewport(Q);o.set(r.x*lt.x,r.y*lt.y,r.x*lt.z,r.y*lt.w),C.viewport(o),G.updateMatrices(j,Q),n=G.getFrustum(),y(T,U,G.camera,j,this.type)}G.isPointLightShadow!==!0&&this.type===Sn&&x(G,U),G.needsUpdate=!1}u=this.type,p.needsUpdate=!1,s.setRenderTarget(M,w,L)};function x(E,T){const U=t.update(g);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,m.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new gn(i.x,i.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(T,null,U,d,g,null),m.uniforms.shadow_pass.value=E.mapPass.texture,m.uniforms.resolution.value=E.mapSize,m.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(T,null,U,m,g,null)}function _(E,T,U,M){let w=null;const L=U.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)w=L;else if(w=U.isPointLight===!0?l:a,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const C=w.uuid,k=T.uuid;let P=c[C];P===void 0&&(P={},c[C]=P);let F=P[k];F===void 0&&(F=w.clone(),P[k]=F,T.addEventListener("dispose",S)),w=F}if(w.visible=T.visible,w.wireframe=T.wireframe,M===Sn?w.side=T.shadowSide!==null?T.shadowSide:T.side:w.side=T.shadowSide!==null?T.shadowSide:f[T.side],w.alphaMap=T.alphaMap,w.alphaTest=T.alphaTest,w.map=T.map,w.clipShadows=T.clipShadows,w.clippingPlanes=T.clippingPlanes,w.clipIntersection=T.clipIntersection,w.displacementMap=T.displacementMap,w.displacementScale=T.displacementScale,w.displacementBias=T.displacementBias,w.wireframeLinewidth=T.wireframeLinewidth,w.linewidth=T.linewidth,U.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const C=s.properties.get(w);C.light=U}return w}function y(E,T,U,M,w){if(E.visible===!1)return;if(E.layers.test(T.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&w===Sn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,E.matrixWorld);const k=t.update(E),P=E.material;if(Array.isArray(P)){const F=k.groups;for(let B=0,j=F.length;B<j;B++){const G=F[B],Z=P[G.materialIndex];if(Z&&Z.visible){const J=_(E,Z,M,w);E.onBeforeShadow(s,E,T,U,k,J,G),s.renderBufferDirect(U,null,k,J,E,G),E.onAfterShadow(s,E,T,U,k,J,G)}}}else if(P.visible){const F=_(E,P,M,w);E.onBeforeShadow(s,E,T,U,k,F,null),s.renderBufferDirect(U,null,k,F,E,null),E.onAfterShadow(s,E,T,U,k,F,null)}}const C=E.children;for(let k=0,P=C.length;k<P;k++)y(C[k],T,U,M,w)}function S(E){E.target.removeEventListener("dispose",S);for(const U in c){const M=c[U],w=E.target.uuid;w in M&&(M[w].dispose(),delete M[w])}}}function tg(s,t,e){const n=e.isWebGL2;function i(){let I=!1;const ut=new $t;let ft=null;const Ct=new $t(0,0,0,0);return{setMask:function(bt){ft!==bt&&!I&&(s.colorMask(bt,bt,bt,bt),ft=bt)},setLocked:function(bt){I=bt},setClear:function(bt,Zt,Jt,ge,Ee){Ee===!0&&(bt*=ge,Zt*=ge,Jt*=ge),ut.set(bt,Zt,Jt,ge),Ct.equals(ut)===!1&&(s.clearColor(bt,Zt,Jt,ge),Ct.copy(ut))},reset:function(){I=!1,ft=null,Ct.set(-1,0,0,0)}}}function r(){let I=!1,ut=null,ft=null,Ct=null;return{setTest:function(bt){bt?Et(s.DEPTH_TEST):Mt(s.DEPTH_TEST)},setMask:function(bt){ut!==bt&&!I&&(s.depthMask(bt),ut=bt)},setFunc:function(bt){if(ft!==bt){switch(bt){case cu:s.depthFunc(s.NEVER);break;case hu:s.depthFunc(s.ALWAYS);break;case uu:s.depthFunc(s.LESS);break;case lr:s.depthFunc(s.LEQUAL);break;case fu:s.depthFunc(s.EQUAL);break;case du:s.depthFunc(s.GEQUAL);break;case pu:s.depthFunc(s.GREATER);break;case mu:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ft=bt}},setLocked:function(bt){I=bt},setClear:function(bt){Ct!==bt&&(s.clearDepth(bt),Ct=bt)},reset:function(){I=!1,ut=null,ft=null,Ct=null}}}function o(){let I=!1,ut=null,ft=null,Ct=null,bt=null,Zt=null,Jt=null,ge=null,Ee=null;return{setTest:function(Qt){I||(Qt?Et(s.STENCIL_TEST):Mt(s.STENCIL_TEST))},setMask:function(Qt){ut!==Qt&&!I&&(s.stencilMask(Qt),ut=Qt)},setFunc:function(Qt,Ae,hn){(ft!==Qt||Ct!==Ae||bt!==hn)&&(s.stencilFunc(Qt,Ae,hn),ft=Qt,Ct=Ae,bt=hn)},setOp:function(Qt,Ae,hn){(Zt!==Qt||Jt!==Ae||ge!==hn)&&(s.stencilOp(Qt,Ae,hn),Zt=Qt,Jt=Ae,ge=hn)},setLocked:function(Qt){I=Qt},setClear:function(Qt){Ee!==Qt&&(s.clearStencil(Qt),Ee=Qt)},reset:function(){I=!1,ut=null,ft=null,Ct=null,bt=null,Zt=null,Jt=null,ge=null,Ee=null}}}const a=new i,l=new r,c=new o,h=new WeakMap,f=new WeakMap;let d={},m={},v=new WeakMap,g=[],p=null,u=!1,x=null,_=null,y=null,S=null,E=null,T=null,U=null,M=new Tt(0,0,0),w=0,L=!1,C=null,k=null,P=null,F=null,B=null;const j=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,Z=0;const J=s.getParameter(s.VERSION);J.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(J)[1]),G=Z>=1):J.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),G=Z>=2);let Q=null,lt={};const K=s.getParameter(s.SCISSOR_BOX),et=s.getParameter(s.VIEWPORT),ct=new $t().fromArray(K),pt=new $t().fromArray(et);function mt(I,ut,ft,Ct){const bt=new Uint8Array(4),Zt=s.createTexture();s.bindTexture(I,Zt),s.texParameteri(I,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(I,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Jt=0;Jt<ft;Jt++)n&&(I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY)?s.texImage3D(ut,0,s.RGBA,1,1,Ct,0,s.RGBA,s.UNSIGNED_BYTE,bt):s.texImage2D(ut+Jt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,bt);return Zt}const wt={};wt[s.TEXTURE_2D]=mt(s.TEXTURE_2D,s.TEXTURE_2D,1),wt[s.TEXTURE_CUBE_MAP]=mt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(wt[s.TEXTURE_2D_ARRAY]=mt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),wt[s.TEXTURE_3D]=mt(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Et(s.DEPTH_TEST),l.setFunc(lr),st(!1),A(ho),Et(s.CULL_FACE),V(kn);function Et(I){d[I]!==!0&&(s.enable(I),d[I]=!0)}function Mt(I){d[I]!==!1&&(s.disable(I),d[I]=!1)}function Nt(I,ut){return m[I]!==ut?(s.bindFramebuffer(I,ut),m[I]=ut,n&&(I===s.DRAW_FRAMEBUFFER&&(m[s.FRAMEBUFFER]=ut),I===s.FRAMEBUFFER&&(m[s.DRAW_FRAMEBUFFER]=ut)),!0):!1}function H(I,ut){let ft=g,Ct=!1;if(I)if(ft=v.get(ut),ft===void 0&&(ft=[],v.set(ut,ft)),I.isWebGLMultipleRenderTargets){const bt=I.texture;if(ft.length!==bt.length||ft[0]!==s.COLOR_ATTACHMENT0){for(let Zt=0,Jt=bt.length;Zt<Jt;Zt++)ft[Zt]=s.COLOR_ATTACHMENT0+Zt;ft.length=bt.length,Ct=!0}}else ft[0]!==s.COLOR_ATTACHMENT0&&(ft[0]=s.COLOR_ATTACHMENT0,Ct=!0);else ft[0]!==s.BACK&&(ft[0]=s.BACK,Ct=!0);Ct&&(e.isWebGL2?s.drawBuffers(ft):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ft))}function ae(I){return p!==I?(s.useProgram(I),p=I,!0):!1}const xt={[ti]:s.FUNC_ADD,[jh]:s.FUNC_SUBTRACT,[Yh]:s.FUNC_REVERSE_SUBTRACT};if(n)xt[po]=s.MIN,xt[mo]=s.MAX;else{const I=t.get("EXT_blend_minmax");I!==null&&(xt[po]=I.MIN_EXT,xt[mo]=I.MAX_EXT)}const Rt={[Kh]:s.ZERO,[Zh]:s.ONE,[Jh]:s.SRC_COLOR,[Ma]:s.SRC_ALPHA,[su]:s.SRC_ALPHA_SATURATE,[nu]:s.DST_COLOR,[tu]:s.DST_ALPHA,[Qh]:s.ONE_MINUS_SRC_COLOR,[ya]:s.ONE_MINUS_SRC_ALPHA,[iu]:s.ONE_MINUS_DST_COLOR,[eu]:s.ONE_MINUS_DST_ALPHA,[ru]:s.CONSTANT_COLOR,[au]:s.ONE_MINUS_CONSTANT_COLOR,[ou]:s.CONSTANT_ALPHA,[lu]:s.ONE_MINUS_CONSTANT_ALPHA};function V(I,ut,ft,Ct,bt,Zt,Jt,ge,Ee,Qt){if(I===kn){u===!0&&(Mt(s.BLEND),u=!1);return}if(u===!1&&(Et(s.BLEND),u=!0),I!==qh){if(I!==x||Qt!==L){if((_!==ti||E!==ti)&&(s.blendEquation(s.FUNC_ADD),_=ti,E=ti),Qt)switch(I){case Fi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _a:s.blendFunc(s.ONE,s.ONE);break;case uo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case fo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Fi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _a:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case uo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case fo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}y=null,S=null,T=null,U=null,M.set(0,0,0),w=0,x=I,L=Qt}return}bt=bt||ut,Zt=Zt||ft,Jt=Jt||Ct,(ut!==_||bt!==E)&&(s.blendEquationSeparate(xt[ut],xt[bt]),_=ut,E=bt),(ft!==y||Ct!==S||Zt!==T||Jt!==U)&&(s.blendFuncSeparate(Rt[ft],Rt[Ct],Rt[Zt],Rt[Jt]),y=ft,S=Ct,T=Zt,U=Jt),(ge.equals(M)===!1||Ee!==w)&&(s.blendColor(ge.r,ge.g,ge.b,Ee),M.copy(ge),w=Ee),x=I,L=!1}function nt(I,ut){I.side===ln?Mt(s.CULL_FACE):Et(s.CULL_FACE);let ft=I.side===Ue;ut&&(ft=!ft),st(ft),I.blending===Fi&&I.transparent===!1?V(kn):V(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),a.setMask(I.colorWrite);const Ct=I.stencilWrite;c.setTest(Ct),Ct&&(c.setMask(I.stencilWriteMask),c.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),c.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),D(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?Et(s.SAMPLE_ALPHA_TO_COVERAGE):Mt(s.SAMPLE_ALPHA_TO_COVERAGE)}function st(I){C!==I&&(I?s.frontFace(s.CW):s.frontFace(s.CCW),C=I)}function A(I){I!==Wh?(Et(s.CULL_FACE),I!==k&&(I===ho?s.cullFace(s.BACK):I===$h?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Mt(s.CULL_FACE),k=I}function b(I){I!==P&&(G&&s.lineWidth(I),P=I)}function D(I,ut,ft){I?(Et(s.POLYGON_OFFSET_FILL),(F!==ut||B!==ft)&&(s.polygonOffset(ut,ft),F=ut,B=ft)):Mt(s.POLYGON_OFFSET_FILL)}function N(I){I?Et(s.SCISSOR_TEST):Mt(s.SCISSOR_TEST)}function W(I){I===void 0&&(I=s.TEXTURE0+j-1),Q!==I&&(s.activeTexture(I),Q=I)}function $(I,ut,ft){ft===void 0&&(Q===null?ft=s.TEXTURE0+j-1:ft=Q);let Ct=lt[ft];Ct===void 0&&(Ct={type:void 0,texture:void 0},lt[ft]=Ct),(Ct.type!==I||Ct.texture!==ut)&&(Q!==ft&&(s.activeTexture(ft),Q=ft),s.bindTexture(I,ut||wt[I]),Ct.type=I,Ct.texture=ut)}function rt(){const I=lt[Q];I!==void 0&&I.type!==void 0&&(s.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function tt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ht(){try{s.compressedTexImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function vt(){try{s.texSubImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function kt(){try{s.texSubImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function it(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function jt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Wt(){try{s.texStorage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Dt(){try{s.texStorage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function St(){try{s.texImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function gt(){try{s.texImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ft(I){ct.equals(I)===!1&&(s.scissor(I.x,I.y,I.z,I.w),ct.copy(I))}function qt(I){pt.equals(I)===!1&&(s.viewport(I.x,I.y,I.z,I.w),pt.copy(I))}function se(I,ut){let ft=f.get(ut);ft===void 0&&(ft=new WeakMap,f.set(ut,ft));let Ct=ft.get(I);Ct===void 0&&(Ct=s.getUniformBlockIndex(ut,I.name),ft.set(I,Ct))}function Ht(I,ut){const Ct=f.get(ut).get(I);h.get(ut)!==Ct&&(s.uniformBlockBinding(ut,Ct,I.__bindingPointIndex),h.set(ut,Ct))}function at(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},Q=null,lt={},m={},v=new WeakMap,g=[],p=null,u=!1,x=null,_=null,y=null,S=null,E=null,T=null,U=null,M=new Tt(0,0,0),w=0,L=!1,C=null,k=null,P=null,F=null,B=null,ct.set(0,0,s.canvas.width,s.canvas.height),pt.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Et,disable:Mt,bindFramebuffer:Nt,drawBuffers:H,useProgram:ae,setBlending:V,setMaterial:nt,setFlipSided:st,setCullFace:A,setLineWidth:b,setPolygonOffset:D,setScissorTest:N,activeTexture:W,bindTexture:$,unbindTexture:rt,compressedTexImage2D:tt,compressedTexImage3D:ht,texImage2D:St,texImage3D:gt,updateUBOMapping:se,uniformBlockBinding:Ht,texStorage2D:Wt,texStorage3D:Dt,texSubImage2D:vt,texSubImage3D:kt,compressedTexSubImage2D:it,compressedTexSubImage3D:jt,scissor:Ft,viewport:qt,reset:at}}function eg(s,t,e,n,i,r,o){const a=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let f;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(A,b){return m?new OffscreenCanvas(A,b):mr("canvas")}function g(A,b,D,N){let W=1;if((A.width>N||A.height>N)&&(W=N/Math.max(A.width,A.height)),W<1||b===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const $=b?pr:Math.floor,rt=$(W*A.width),tt=$(W*A.height);f===void 0&&(f=v(rt,tt));const ht=D?v(rt,tt):f;return ht.width=rt,ht.height=tt,ht.getContext("2d").drawImage(A,0,0,rt,tt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+rt+"x"+tt+")."),ht}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function p(A){return Aa(A.width)&&Aa(A.height)}function u(A){return a?!1:A.wrapS!==De||A.wrapT!==De||A.minFilter!==te&&A.minFilter!==ye}function x(A,b){return A.generateMipmaps&&b&&A.minFilter!==te&&A.minFilter!==ye}function _(A){s.generateMipmap(A)}function y(A,b,D,N,W=!1){if(a===!1)return b;if(A!==null){if(s[A]!==void 0)return s[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let $=b;if(b===s.RED&&(D===s.FLOAT&&($=s.R32F),D===s.HALF_FLOAT&&($=s.R16F),D===s.UNSIGNED_BYTE&&($=s.R8)),b===s.RED_INTEGER&&(D===s.UNSIGNED_BYTE&&($=s.R8UI),D===s.UNSIGNED_SHORT&&($=s.R16UI),D===s.UNSIGNED_INT&&($=s.R32UI),D===s.BYTE&&($=s.R8I),D===s.SHORT&&($=s.R16I),D===s.INT&&($=s.R32I)),b===s.RG&&(D===s.FLOAT&&($=s.RG32F),D===s.HALF_FLOAT&&($=s.RG16F),D===s.UNSIGNED_BYTE&&($=s.RG8)),b===s.RGBA){const rt=W?hr:Yt.getTransfer(N);D===s.FLOAT&&($=s.RGBA32F),D===s.HALF_FLOAT&&($=s.RGBA16F),D===s.UNSIGNED_BYTE&&($=rt===ee?s.SRGB8_ALPHA8:s.RGBA8),D===s.UNSIGNED_SHORT_4_4_4_4&&($=s.RGBA4),D===s.UNSIGNED_SHORT_5_5_5_1&&($=s.RGB5_A1)}return($===s.R16F||$===s.R32F||$===s.RG16F||$===s.RG32F||$===s.RGBA16F||$===s.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function S(A,b,D){return x(A,D)===!0||A.isFramebufferTexture&&A.minFilter!==te&&A.minFilter!==ye?Math.log2(Math.max(b.width,b.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?b.mipmaps.length:1}function E(A){return A===te||A===go||A===Lr?s.NEAREST:s.LINEAR}function T(A){const b=A.target;b.removeEventListener("dispose",T),M(b),b.isVideoTexture&&h.delete(b)}function U(A){const b=A.target;b.removeEventListener("dispose",U),L(b)}function M(A){const b=n.get(A);if(b.__webglInit===void 0)return;const D=A.source,N=d.get(D);if(N){const W=N[b.__cacheKey];W.usedTimes--,W.usedTimes===0&&w(A),Object.keys(N).length===0&&d.delete(D)}n.remove(A)}function w(A){const b=n.get(A);s.deleteTexture(b.__webglTexture);const D=A.source,N=d.get(D);delete N[b.__cacheKey],o.memory.textures--}function L(A){const b=A.texture,D=n.get(A),N=n.get(b);if(N.__webglTexture!==void 0&&(s.deleteTexture(N.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(D.__webglFramebuffer[W]))for(let $=0;$<D.__webglFramebuffer[W].length;$++)s.deleteFramebuffer(D.__webglFramebuffer[W][$]);else s.deleteFramebuffer(D.__webglFramebuffer[W]);D.__webglDepthbuffer&&s.deleteRenderbuffer(D.__webglDepthbuffer[W])}else{if(Array.isArray(D.__webglFramebuffer))for(let W=0;W<D.__webglFramebuffer.length;W++)s.deleteFramebuffer(D.__webglFramebuffer[W]);else s.deleteFramebuffer(D.__webglFramebuffer);if(D.__webglDepthbuffer&&s.deleteRenderbuffer(D.__webglDepthbuffer),D.__webglMultisampledFramebuffer&&s.deleteFramebuffer(D.__webglMultisampledFramebuffer),D.__webglColorRenderbuffer)for(let W=0;W<D.__webglColorRenderbuffer.length;W++)D.__webglColorRenderbuffer[W]&&s.deleteRenderbuffer(D.__webglColorRenderbuffer[W]);D.__webglDepthRenderbuffer&&s.deleteRenderbuffer(D.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let W=0,$=b.length;W<$;W++){const rt=n.get(b[W]);rt.__webglTexture&&(s.deleteTexture(rt.__webglTexture),o.memory.textures--),n.remove(b[W])}n.remove(b),n.remove(A)}let C=0;function k(){C=0}function P(){const A=C;return A>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),C+=1,A}function F(A){const b=[];return b.push(A.wrapS),b.push(A.wrapT),b.push(A.wrapR||0),b.push(A.magFilter),b.push(A.minFilter),b.push(A.anisotropy),b.push(A.internalFormat),b.push(A.format),b.push(A.type),b.push(A.generateMipmaps),b.push(A.premultiplyAlpha),b.push(A.flipY),b.push(A.unpackAlignment),b.push(A.colorSpace),b.join()}function B(A,b){const D=n.get(A);if(A.isVideoTexture&&nt(A),A.isRenderTargetTexture===!1&&A.version>0&&D.__version!==A.version){const N=A.image;if(N===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(N.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ct(D,A,b);return}}e.bindTexture(s.TEXTURE_2D,D.__webglTexture,s.TEXTURE0+b)}function j(A,b){const D=n.get(A);if(A.version>0&&D.__version!==A.version){ct(D,A,b);return}e.bindTexture(s.TEXTURE_2D_ARRAY,D.__webglTexture,s.TEXTURE0+b)}function G(A,b){const D=n.get(A);if(A.version>0&&D.__version!==A.version){ct(D,A,b);return}e.bindTexture(s.TEXTURE_3D,D.__webglTexture,s.TEXTURE0+b)}function Z(A,b){const D=n.get(A);if(A.version>0&&D.__version!==A.version){pt(D,A,b);return}e.bindTexture(s.TEXTURE_CUBE_MAP,D.__webglTexture,s.TEXTURE0+b)}const J={[cr]:s.REPEAT,[De]:s.CLAMP_TO_EDGE,[ba]:s.MIRRORED_REPEAT},Q={[te]:s.NEAREST,[go]:s.NEAREST_MIPMAP_NEAREST,[Lr]:s.NEAREST_MIPMAP_LINEAR,[ye]:s.LINEAR,[bu]:s.LINEAR_MIPMAP_NEAREST,[oi]:s.LINEAR_MIPMAP_LINEAR},lt={[Nu]:s.NEVER,[Hu]:s.ALWAYS,[Fu]:s.LESS,[zc]:s.LEQUAL,[zu]:s.EQUAL,[Bu]:s.GEQUAL,[ku]:s.GREATER,[Ou]:s.NOTEQUAL};function K(A,b,D){if(D?(s.texParameteri(A,s.TEXTURE_WRAP_S,J[b.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,J[b.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,J[b.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,Q[b.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,Q[b.minFilter])):(s.texParameteri(A,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(A,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(b.wrapS!==De||b.wrapT!==De)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(A,s.TEXTURE_MAG_FILTER,E(b.magFilter)),s.texParameteri(A,s.TEXTURE_MIN_FILTER,E(b.minFilter)),b.minFilter!==te&&b.minFilter!==ye&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,lt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const N=t.get("EXT_texture_filter_anisotropic");if(b.magFilter===te||b.minFilter!==Lr&&b.minFilter!==oi||b.type===Tn&&t.has("OES_texture_float_linear")===!1||a===!1&&b.type===Bn&&t.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||n.get(b).__currentAnisotropy)&&(s.texParameterf(A,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy)}}function et(A,b){let D=!1;A.__webglInit===void 0&&(A.__webglInit=!0,b.addEventListener("dispose",T));const N=b.source;let W=d.get(N);W===void 0&&(W={},d.set(N,W));const $=F(b);if($!==A.__cacheKey){W[$]===void 0&&(W[$]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,D=!0),W[$].usedTimes++;const rt=W[A.__cacheKey];rt!==void 0&&(W[A.__cacheKey].usedTimes--,rt.usedTimes===0&&w(b)),A.__cacheKey=$,A.__webglTexture=W[$].texture}return D}function ct(A,b,D){let N=s.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(N=s.TEXTURE_2D_ARRAY),b.isData3DTexture&&(N=s.TEXTURE_3D);const W=et(A,b),$=b.source;e.bindTexture(N,A.__webglTexture,s.TEXTURE0+D);const rt=n.get($);if($.version!==rt.__version||W===!0){e.activeTexture(s.TEXTURE0+D);const tt=Yt.getPrimaries(Yt.workingColorSpace),ht=b.colorSpace===Je?null:Yt.getPrimaries(b.colorSpace),vt=b.colorSpace===Je||tt===ht?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const kt=u(b)&&p(b.image)===!1;let it=g(b.image,kt,!1,i.maxTextureSize);it=st(b,it);const jt=p(it)||a,Wt=r.convert(b.format,b.colorSpace);let Dt=r.convert(b.type),St=y(b.internalFormat,Wt,Dt,b.colorSpace,b.isVideoTexture);K(N,b,jt);let gt;const Ft=b.mipmaps,qt=a&&b.isVideoTexture!==!0&&St!==Nc,se=rt.__version===void 0||W===!0,Ht=S(b,it,jt);if(b.isDepthTexture)St=s.DEPTH_COMPONENT,a?b.type===Tn?St=s.DEPTH_COMPONENT32F:b.type===An?St=s.DEPTH_COMPONENT24:b.type===ii?St=s.DEPTH24_STENCIL8:St=s.DEPTH_COMPONENT16:b.type===Tn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===si&&St===s.DEPTH_COMPONENT&&b.type!==ka&&b.type!==An&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=An,Dt=r.convert(b.type)),b.format===Hi&&St===s.DEPTH_COMPONENT&&(St=s.DEPTH_STENCIL,b.type!==ii&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=ii,Dt=r.convert(b.type))),se&&(qt?e.texStorage2D(s.TEXTURE_2D,1,St,it.width,it.height):e.texImage2D(s.TEXTURE_2D,0,St,it.width,it.height,0,Wt,Dt,null));else if(b.isDataTexture)if(Ft.length>0&&jt){qt&&se&&e.texStorage2D(s.TEXTURE_2D,Ht,St,Ft[0].width,Ft[0].height);for(let at=0,I=Ft.length;at<I;at++)gt=Ft[at],qt?e.texSubImage2D(s.TEXTURE_2D,at,0,0,gt.width,gt.height,Wt,Dt,gt.data):e.texImage2D(s.TEXTURE_2D,at,St,gt.width,gt.height,0,Wt,Dt,gt.data);b.generateMipmaps=!1}else qt?(se&&e.texStorage2D(s.TEXTURE_2D,Ht,St,it.width,it.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,it.width,it.height,Wt,Dt,it.data)):e.texImage2D(s.TEXTURE_2D,0,St,it.width,it.height,0,Wt,Dt,it.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){qt&&se&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,St,Ft[0].width,Ft[0].height,it.depth);for(let at=0,I=Ft.length;at<I;at++)gt=Ft[at],b.format!==_e?Wt!==null?qt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,at,0,0,0,gt.width,gt.height,it.depth,Wt,gt.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,at,St,gt.width,gt.height,it.depth,0,gt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,at,0,0,0,gt.width,gt.height,it.depth,Wt,Dt,gt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,at,St,gt.width,gt.height,it.depth,0,Wt,Dt,gt.data)}else{qt&&se&&e.texStorage2D(s.TEXTURE_2D,Ht,St,Ft[0].width,Ft[0].height);for(let at=0,I=Ft.length;at<I;at++)gt=Ft[at],b.format!==_e?Wt!==null?qt?e.compressedTexSubImage2D(s.TEXTURE_2D,at,0,0,gt.width,gt.height,Wt,gt.data):e.compressedTexImage2D(s.TEXTURE_2D,at,St,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?e.texSubImage2D(s.TEXTURE_2D,at,0,0,gt.width,gt.height,Wt,Dt,gt.data):e.texImage2D(s.TEXTURE_2D,at,St,gt.width,gt.height,0,Wt,Dt,gt.data)}else if(b.isDataArrayTexture)qt?(se&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,St,it.width,it.height,it.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,Wt,Dt,it.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,St,it.width,it.height,it.depth,0,Wt,Dt,it.data);else if(b.isData3DTexture)qt?(se&&e.texStorage3D(s.TEXTURE_3D,Ht,St,it.width,it.height,it.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,Wt,Dt,it.data)):e.texImage3D(s.TEXTURE_3D,0,St,it.width,it.height,it.depth,0,Wt,Dt,it.data);else if(b.isFramebufferTexture){if(se)if(qt)e.texStorage2D(s.TEXTURE_2D,Ht,St,it.width,it.height);else{let at=it.width,I=it.height;for(let ut=0;ut<Ht;ut++)e.texImage2D(s.TEXTURE_2D,ut,St,at,I,0,Wt,Dt,null),at>>=1,I>>=1}}else if(Ft.length>0&&jt){qt&&se&&e.texStorage2D(s.TEXTURE_2D,Ht,St,Ft[0].width,Ft[0].height);for(let at=0,I=Ft.length;at<I;at++)gt=Ft[at],qt?e.texSubImage2D(s.TEXTURE_2D,at,0,0,Wt,Dt,gt):e.texImage2D(s.TEXTURE_2D,at,St,Wt,Dt,gt);b.generateMipmaps=!1}else qt?(se&&e.texStorage2D(s.TEXTURE_2D,Ht,St,it.width,it.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Wt,Dt,it)):e.texImage2D(s.TEXTURE_2D,0,St,Wt,Dt,it);x(b,jt)&&_(N),rt.__version=$.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function pt(A,b,D){if(b.image.length!==6)return;const N=et(A,b),W=b.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+D);const $=n.get(W);if(W.version!==$.__version||N===!0){e.activeTexture(s.TEXTURE0+D);const rt=Yt.getPrimaries(Yt.workingColorSpace),tt=b.colorSpace===Je?null:Yt.getPrimaries(b.colorSpace),ht=b.colorSpace===Je||rt===tt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ht);const vt=b.isCompressedTexture||b.image[0].isCompressedTexture,kt=b.image[0]&&b.image[0].isDataTexture,it=[];for(let at=0;at<6;at++)!vt&&!kt?it[at]=g(b.image[at],!1,!0,i.maxCubemapSize):it[at]=kt?b.image[at].image:b.image[at],it[at]=st(b,it[at]);const jt=it[0],Wt=p(jt)||a,Dt=r.convert(b.format,b.colorSpace),St=r.convert(b.type),gt=y(b.internalFormat,Dt,St,b.colorSpace),Ft=a&&b.isVideoTexture!==!0,qt=$.__version===void 0||N===!0;let se=S(b,jt,Wt);K(s.TEXTURE_CUBE_MAP,b,Wt);let Ht;if(vt){Ft&&qt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,se,gt,jt.width,jt.height);for(let at=0;at<6;at++){Ht=it[at].mipmaps;for(let I=0;I<Ht.length;I++){const ut=Ht[I];b.format!==_e?Dt!==null?Ft?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,I,0,0,ut.width,ut.height,Dt,ut.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,I,gt,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,I,0,0,ut.width,ut.height,Dt,St,ut.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,I,gt,ut.width,ut.height,0,Dt,St,ut.data)}}}else{Ht=b.mipmaps,Ft&&qt&&(Ht.length>0&&se++,e.texStorage2D(s.TEXTURE_CUBE_MAP,se,gt,it[0].width,it[0].height));for(let at=0;at<6;at++)if(kt){Ft?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,it[at].width,it[at].height,Dt,St,it[at].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,gt,it[at].width,it[at].height,0,Dt,St,it[at].data);for(let I=0;I<Ht.length;I++){const ft=Ht[I].image[at].image;Ft?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,I+1,0,0,ft.width,ft.height,Dt,St,ft.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,I+1,gt,ft.width,ft.height,0,Dt,St,ft.data)}}else{Ft?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Dt,St,it[at]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,gt,Dt,St,it[at]);for(let I=0;I<Ht.length;I++){const ut=Ht[I];Ft?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,I+1,0,0,Dt,St,ut.image[at]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,I+1,gt,Dt,St,ut.image[at])}}}x(b,Wt)&&_(s.TEXTURE_CUBE_MAP),$.__version=W.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function mt(A,b,D,N,W,$){const rt=r.convert(D.format,D.colorSpace),tt=r.convert(D.type),ht=y(D.internalFormat,rt,tt,D.colorSpace);if(!n.get(b).__hasExternalTextures){const kt=Math.max(1,b.width>>$),it=Math.max(1,b.height>>$);W===s.TEXTURE_3D||W===s.TEXTURE_2D_ARRAY?e.texImage3D(W,$,ht,kt,it,b.depth,0,rt,tt,null):e.texImage2D(W,$,ht,kt,it,0,rt,tt,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),V(b)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,N,W,n.get(D).__webglTexture,0,Rt(b)):(W===s.TEXTURE_2D||W>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&W<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,N,W,n.get(D).__webglTexture,$),e.bindFramebuffer(s.FRAMEBUFFER,null)}function wt(A,b,D){if(s.bindRenderbuffer(s.RENDERBUFFER,A),b.depthBuffer&&!b.stencilBuffer){let N=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(D||V(b)){const W=b.depthTexture;W&&W.isDepthTexture&&(W.type===Tn?N=s.DEPTH_COMPONENT32F:W.type===An&&(N=s.DEPTH_COMPONENT24));const $=Rt(b);V(b)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,$,N,b.width,b.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,$,N,b.width,b.height)}else s.renderbufferStorage(s.RENDERBUFFER,N,b.width,b.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,A)}else if(b.depthBuffer&&b.stencilBuffer){const N=Rt(b);D&&V(b)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,N,s.DEPTH24_STENCIL8,b.width,b.height):V(b)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,N,s.DEPTH24_STENCIL8,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,b.width,b.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,A)}else{const N=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let W=0;W<N.length;W++){const $=N[W],rt=r.convert($.format,$.colorSpace),tt=r.convert($.type),ht=y($.internalFormat,rt,tt,$.colorSpace),vt=Rt(b);D&&V(b)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,vt,ht,b.width,b.height):V(b)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,vt,ht,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,ht,b.width,b.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Et(A,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),B(b.depthTexture,0);const N=n.get(b.depthTexture).__webglTexture,W=Rt(b);if(b.depthTexture.format===si)V(b)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,N,0,W):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,N,0);else if(b.depthTexture.format===Hi)V(b)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,N,0,W):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,N,0);else throw new Error("Unknown depthTexture format")}function Mt(A){const b=n.get(A),D=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!b.__autoAllocateDepthBuffer){if(D)throw new Error("target.depthTexture not supported in Cube render targets");Et(b.__webglFramebuffer,A)}else if(D){b.__webglDepthbuffer=[];for(let N=0;N<6;N++)e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[N]),b.__webglDepthbuffer[N]=s.createRenderbuffer(),wt(b.__webglDepthbuffer[N],A,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=s.createRenderbuffer(),wt(b.__webglDepthbuffer,A,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Nt(A,b,D){const N=n.get(A);b!==void 0&&mt(N.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),D!==void 0&&Mt(A)}function H(A){const b=A.texture,D=n.get(A),N=n.get(b);A.addEventListener("dispose",U),A.isWebGLMultipleRenderTargets!==!0&&(N.__webglTexture===void 0&&(N.__webglTexture=s.createTexture()),N.__version=b.version,o.memory.textures++);const W=A.isWebGLCubeRenderTarget===!0,$=A.isWebGLMultipleRenderTargets===!0,rt=p(A)||a;if(W){D.__webglFramebuffer=[];for(let tt=0;tt<6;tt++)if(a&&b.mipmaps&&b.mipmaps.length>0){D.__webglFramebuffer[tt]=[];for(let ht=0;ht<b.mipmaps.length;ht++)D.__webglFramebuffer[tt][ht]=s.createFramebuffer()}else D.__webglFramebuffer[tt]=s.createFramebuffer()}else{if(a&&b.mipmaps&&b.mipmaps.length>0){D.__webglFramebuffer=[];for(let tt=0;tt<b.mipmaps.length;tt++)D.__webglFramebuffer[tt]=s.createFramebuffer()}else D.__webglFramebuffer=s.createFramebuffer();if($)if(i.drawBuffers){const tt=A.texture;for(let ht=0,vt=tt.length;ht<vt;ht++){const kt=n.get(tt[ht]);kt.__webglTexture===void 0&&(kt.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&V(A)===!1){const tt=$?b:[b];D.__webglMultisampledFramebuffer=s.createFramebuffer(),D.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let ht=0;ht<tt.length;ht++){const vt=tt[ht];D.__webglColorRenderbuffer[ht]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,D.__webglColorRenderbuffer[ht]);const kt=r.convert(vt.format,vt.colorSpace),it=r.convert(vt.type),jt=y(vt.internalFormat,kt,it,vt.colorSpace,A.isXRRenderTarget===!0),Wt=Rt(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,Wt,jt,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ht,s.RENDERBUFFER,D.__webglColorRenderbuffer[ht])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(D.__webglDepthRenderbuffer=s.createRenderbuffer(),wt(D.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(W){e.bindTexture(s.TEXTURE_CUBE_MAP,N.__webglTexture),K(s.TEXTURE_CUBE_MAP,b,rt);for(let tt=0;tt<6;tt++)if(a&&b.mipmaps&&b.mipmaps.length>0)for(let ht=0;ht<b.mipmaps.length;ht++)mt(D.__webglFramebuffer[tt][ht],A,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,ht);else mt(D.__webglFramebuffer[tt],A,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0);x(b,rt)&&_(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if($){const tt=A.texture;for(let ht=0,vt=tt.length;ht<vt;ht++){const kt=tt[ht],it=n.get(kt);e.bindTexture(s.TEXTURE_2D,it.__webglTexture),K(s.TEXTURE_2D,kt,rt),mt(D.__webglFramebuffer,A,kt,s.COLOR_ATTACHMENT0+ht,s.TEXTURE_2D,0),x(kt,rt)&&_(s.TEXTURE_2D)}e.unbindTexture()}else{let tt=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?tt=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(tt,N.__webglTexture),K(tt,b,rt),a&&b.mipmaps&&b.mipmaps.length>0)for(let ht=0;ht<b.mipmaps.length;ht++)mt(D.__webglFramebuffer[ht],A,b,s.COLOR_ATTACHMENT0,tt,ht);else mt(D.__webglFramebuffer,A,b,s.COLOR_ATTACHMENT0,tt,0);x(b,rt)&&_(tt),e.unbindTexture()}A.depthBuffer&&Mt(A)}function ae(A){const b=p(A)||a,D=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let N=0,W=D.length;N<W;N++){const $=D[N];if(x($,b)){const rt=A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,tt=n.get($).__webglTexture;e.bindTexture(rt,tt),_(rt),e.unbindTexture()}}}function xt(A){if(a&&A.samples>0&&V(A)===!1){const b=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],D=A.width,N=A.height;let W=s.COLOR_BUFFER_BIT;const $=[],rt=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,tt=n.get(A),ht=A.isWebGLMultipleRenderTargets===!0;if(ht)for(let vt=0;vt<b.length;vt++)e.bindFramebuffer(s.FRAMEBUFFER,tt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,tt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,tt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,tt.__webglFramebuffer);for(let vt=0;vt<b.length;vt++){$.push(s.COLOR_ATTACHMENT0+vt),A.depthBuffer&&$.push(rt);const kt=tt.__ignoreDepthValues!==void 0?tt.__ignoreDepthValues:!1;if(kt===!1&&(A.depthBuffer&&(W|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&(W|=s.STENCIL_BUFFER_BIT)),ht&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,tt.__webglColorRenderbuffer[vt]),kt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[rt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[rt])),ht){const it=n.get(b[vt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,it,0)}s.blitFramebuffer(0,0,D,N,0,0,D,N,W,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,$)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ht)for(let vt=0;vt<b.length;vt++){e.bindFramebuffer(s.FRAMEBUFFER,tt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.RENDERBUFFER,tt.__webglColorRenderbuffer[vt]);const kt=n.get(b[vt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,tt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+vt,s.TEXTURE_2D,kt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,tt.__webglMultisampledFramebuffer)}}function Rt(A){return Math.min(i.maxSamples,A.samples)}function V(A){const b=n.get(A);return a&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function nt(A){const b=o.render.frame;h.get(A)!==b&&(h.set(A,b),A.update())}function st(A,b){const D=A.colorSpace,N=A.format,W=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===Ea||D!==Pn&&D!==Je&&(Yt.getTransfer(D)===ee?a===!1?t.has("EXT_sRGB")===!0&&N===_e?(A.format=Ea,A.minFilter=ye,A.generateMipmaps=!1):b=Oc.sRGBToLinear(b):(N!==_e||W!==ue)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",D)),b}this.allocateTextureUnit=P,this.resetTextureUnits=k,this.setTexture2D=B,this.setTexture2DArray=j,this.setTexture3D=G,this.setTextureCube=Z,this.rebindTextures=Nt,this.setupRenderTarget=H,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=xt,this.setupDepthRenderbuffer=Mt,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=V}function ng(s,t,e){const n=e.isWebGL2;function i(r,o=Je){let a;const l=Yt.getTransfer(o);if(r===ue)return s.UNSIGNED_BYTE;if(r===Cc)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Pc)return s.UNSIGNED_SHORT_5_5_5_1;if(r===Eu)return s.BYTE;if(r===Au)return s.SHORT;if(r===ka)return s.UNSIGNED_SHORT;if(r===Rc)return s.INT;if(r===An)return s.UNSIGNED_INT;if(r===Tn)return s.FLOAT;if(r===Bn)return n?s.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Tu)return s.ALPHA;if(r===_e)return s.RGBA;if(r===Ru)return s.LUMINANCE;if(r===Cu)return s.LUMINANCE_ALPHA;if(r===si)return s.DEPTH_COMPONENT;if(r===Hi)return s.DEPTH_STENCIL;if(r===Ea)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Vi)return s.RED;if(r===Lc)return s.RED_INTEGER;if(r===Dc)return s.RG;if(r===Uc)return s.RG_INTEGER;if(r===Ic)return s.RGBA_INTEGER;if(r===Dr||r===Ur||r===Ir||r===Nr)if(l===ee)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Dr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Ur)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Ir)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Nr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Dr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Ur)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Ir)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Nr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===vo||r===xo||r===_o||r===Mo)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===vo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===xo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===_o)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Mo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Nc)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===yo||r===wo)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===yo)return l===ee?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===wo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===So||r===bo||r===Eo||r===Ao||r===To||r===Ro||r===Co||r===Po||r===Lo||r===Do||r===Uo||r===Io||r===No||r===Fo)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===So)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===bo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Eo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ao)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===To)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Ro)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Co)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Po)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Lo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Do)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Uo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Io)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===No)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Fo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Fr||r===zo||r===ko)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Fr)return l===ee?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===zo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===ko)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Pu||r===Oo||r===Bo||r===Ho)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Fr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Oo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Bo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Ho)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ii?n?s.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class ig extends Xe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ke extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sg={type:"move"};class ra{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ke,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ke,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ke,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,n),u=this._getHandJoint(c,g);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),m=.02,v=.005;c.inputState.pinching&&d>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(sg)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ke;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class rg extends Wi{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,f=null,d=null,m=null,v=null;const g=e.getContextAttributes();let p=null,u=null;const x=[],_=[],y=new Lt;let S=null;const E=new Xe;E.layers.enable(1),E.viewport=new $t;const T=new Xe;T.layers.enable(2),T.viewport=new $t;const U=[E,T],M=new ig;M.layers.enable(1),M.layers.enable(2);let w=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let et=x[K];return et===void 0&&(et=new ra,x[K]=et),et.getTargetRaySpace()},this.getControllerGrip=function(K){let et=x[K];return et===void 0&&(et=new ra,x[K]=et),et.getGripSpace()},this.getHand=function(K){let et=x[K];return et===void 0&&(et=new ra,x[K]=et),et.getHandSpace()};function C(K){const et=_.indexOf(K.inputSource);if(et===-1)return;const ct=x[et];ct!==void 0&&(ct.update(K.inputSource,K.frame,c||o),ct.dispatchEvent({type:K.type,data:K.inputSource}))}function k(){i.removeEventListener("select",C),i.removeEventListener("selectstart",C),i.removeEventListener("selectend",C),i.removeEventListener("squeeze",C),i.removeEventListener("squeezestart",C),i.removeEventListener("squeezeend",C),i.removeEventListener("end",k),i.removeEventListener("inputsourceschange",P);for(let K=0;K<x.length;K++){const et=_[K];et!==null&&(_[K]=null,x[K].disconnect(et))}w=null,L=null,t.setRenderTarget(p),m=null,d=null,f=null,i=null,u=null,lt.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(y.width,y.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return f},this.getFrame=function(){return v},this.getSession=function(){return i},this.setSession=async function(K){if(i=K,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",C),i.addEventListener("selectstart",C),i.addEventListener("selectend",C),i.addEventListener("squeeze",C),i.addEventListener("squeezestart",C),i.addEventListener("squeezeend",C),i.addEventListener("end",k),i.addEventListener("inputsourceschange",P),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(y),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const et={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(i,e,et),i.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),u=new gn(m.framebufferWidth,m.framebufferHeight,{format:_e,type:ue,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let et=null,ct=null,pt=null;g.depth&&(pt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=g.stencil?Hi:si,ct=g.stencil?ii:An);const mt={colorFormat:e.RGBA8,depthFormat:pt,scaleFactor:r};f=new XRWebGLBinding(i,e),d=f.createProjectionLayer(mt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),u=new gn(d.textureWidth,d.textureHeight,{format:_e,type:ue,depthTexture:new $a(d.textureWidth,d.textureHeight,ct,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const wt=t.properties.get(u);wt.__ignoreDepthValues=d.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),lt.setContext(i),lt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function P(K){for(let et=0;et<K.removed.length;et++){const ct=K.removed[et],pt=_.indexOf(ct);pt>=0&&(_[pt]=null,x[pt].disconnect(ct))}for(let et=0;et<K.added.length;et++){const ct=K.added[et];let pt=_.indexOf(ct);if(pt===-1){for(let wt=0;wt<x.length;wt++)if(wt>=_.length){_.push(ct),pt=wt;break}else if(_[wt]===null){_[wt]=ct,pt=wt;break}if(pt===-1)break}const mt=x[pt];mt&&mt.connect(ct)}}const F=new z,B=new z;function j(K,et,ct){F.setFromMatrixPosition(et.matrixWorld),B.setFromMatrixPosition(ct.matrixWorld);const pt=F.distanceTo(B),mt=et.projectionMatrix.elements,wt=ct.projectionMatrix.elements,Et=mt[14]/(mt[10]-1),Mt=mt[14]/(mt[10]+1),Nt=(mt[9]+1)/mt[5],H=(mt[9]-1)/mt[5],ae=(mt[8]-1)/mt[0],xt=(wt[8]+1)/wt[0],Rt=Et*ae,V=Et*xt,nt=pt/(-ae+xt),st=nt*-ae;et.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(st),K.translateZ(nt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert();const A=Et+nt,b=Mt+nt,D=Rt-st,N=V+(pt-st),W=Nt*Mt/b*A,$=H*Mt/b*A;K.projectionMatrix.makePerspective(D,N,W,$,A,b),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}function G(K,et){et===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(et.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(i===null)return;M.near=T.near=E.near=K.near,M.far=T.far=E.far=K.far,(w!==M.near||L!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),w=M.near,L=M.far);const et=K.parent,ct=M.cameras;G(M,et);for(let pt=0;pt<ct.length;pt++)G(ct[pt],et);ct.length===2?j(M,E,T):M.projectionMatrix.copy(E.projectionMatrix),Z(K,M,et)};function Z(K,et,ct){ct===null?K.matrix.copy(et.matrixWorld):(K.matrix.copy(ct.matrixWorld),K.matrix.invert(),K.matrix.multiply(et.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(et.projectionMatrix),K.projectionMatrixInverse.copy(et.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=_s*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=K)};let J=null;function Q(K,et){if(h=et.getViewerPose(c||o),v=et,h!==null){const ct=h.views;m!==null&&(t.setRenderTargetFramebuffer(u,m.framebuffer),t.setRenderTarget(u));let pt=!1;ct.length!==M.cameras.length&&(M.cameras.length=0,pt=!0);for(let mt=0;mt<ct.length;mt++){const wt=ct[mt];let Et=null;if(m!==null)Et=m.getViewport(wt);else{const Nt=f.getViewSubImage(d,wt);Et=Nt.viewport,mt===0&&(t.setRenderTargetTextures(u,Nt.colorTexture,d.ignoreDepthValues?void 0:Nt.depthStencilTexture),t.setRenderTarget(u))}let Mt=U[mt];Mt===void 0&&(Mt=new Xe,Mt.layers.enable(mt),Mt.viewport=new $t,U[mt]=Mt),Mt.matrix.fromArray(wt.transform.matrix),Mt.matrix.decompose(Mt.position,Mt.quaternion,Mt.scale),Mt.projectionMatrix.fromArray(wt.projectionMatrix),Mt.projectionMatrixInverse.copy(Mt.projectionMatrix).invert(),Mt.viewport.set(Et.x,Et.y,Et.width,Et.height),mt===0&&(M.matrix.copy(Mt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),pt===!0&&M.cameras.push(Mt)}}for(let ct=0;ct<x.length;ct++){const pt=_[ct],mt=x[ct];pt!==null&&mt!==void 0&&mt.update(pt,et,c||o)}J&&J(K,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),v=null}const lt=new Yc;lt.setAnimationLoop(Q),this.setAnimationLoop=function(K){J=K},this.dispose=function(){}}}function ag(s,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Xc(s)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function i(p,u,x,_,y){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),f(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),d(p,u),u.isMeshPhysicalMaterial&&m(p,u,y)):u.isMeshMatcapMaterial?(r(p,u),v(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),g(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?l(p,u,x,_):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===Ue&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===Ue&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);const x=t.get(u).envMap;if(x&&(p.envMap.value=x,p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;const _=s._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*_,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,x,_){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*x,p.scale.value=_*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function f(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function d(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,x){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Ue&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,u){u.matcap&&(p.matcap.value=u.matcap)}function g(p,u){const x=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function og(s,t,e,n){let i={},r={},o=[];const a=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(x,_){const y=_.program;n.uniformBlockBinding(x,y)}function c(x,_){let y=i[x.id];y===void 0&&(v(x),y=h(x),i[x.id]=y,x.addEventListener("dispose",p));const S=_.program;n.updateUBOMapping(x,S);const E=t.render.frame;r[x.id]!==E&&(d(x),r[x.id]=E)}function h(x){const _=f();x.__bindingPointIndex=_;const y=s.createBuffer(),S=x.__size,E=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,S,E),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,y),y}function f(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const _=i[x.id],y=x.uniforms,S=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let E=0,T=y.length;E<T;E++){const U=Array.isArray(y[E])?y[E]:[y[E]];for(let M=0,w=U.length;M<w;M++){const L=U[M];if(m(L,E,M,S)===!0){const C=L.__offset,k=Array.isArray(L.value)?L.value:[L.value];let P=0;for(let F=0;F<k.length;F++){const B=k[F],j=g(B);typeof B=="number"||typeof B=="boolean"?(L.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,C+P,L.__data)):B.isMatrix3?(L.__data[0]=B.elements[0],L.__data[1]=B.elements[1],L.__data[2]=B.elements[2],L.__data[3]=0,L.__data[4]=B.elements[3],L.__data[5]=B.elements[4],L.__data[6]=B.elements[5],L.__data[7]=0,L.__data[8]=B.elements[6],L.__data[9]=B.elements[7],L.__data[10]=B.elements[8],L.__data[11]=0):(B.toArray(L.__data,P),P+=j.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,C,L.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(x,_,y,S){const E=x.value,T=_+"_"+y;if(S[T]===void 0)return typeof E=="number"||typeof E=="boolean"?S[T]=E:S[T]=E.clone(),!0;{const U=S[T];if(typeof E=="number"||typeof E=="boolean"){if(U!==E)return S[T]=E,!0}else if(U.equals(E)===!1)return U.copy(E),!0}return!1}function v(x){const _=x.uniforms;let y=0;const S=16;for(let T=0,U=_.length;T<U;T++){const M=Array.isArray(_[T])?_[T]:[_[T]];for(let w=0,L=M.length;w<L;w++){const C=M[w],k=Array.isArray(C.value)?C.value:[C.value];for(let P=0,F=k.length;P<F;P++){const B=k[P],j=g(B),G=y%S;G!==0&&S-G<j.boundary&&(y+=S-G),C.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=y,y+=j.storage}}}const E=y%S;return E>0&&(y+=S-E),x.__size=y,x.__cache={},this}function g(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function p(x){const _=x.target;_.removeEventListener("dispose",p);const y=o.indexOf(_.__bindingPointIndex);o.splice(y,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function u(){for(const x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:l,update:c,dispose:u}}class eh{constructor(t={}){const{canvas:e=nf(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const u=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Me,this._useLegacyLights=!1,this.toneMapping=On,this.toneMappingExposure=1;const _=this;let y=!1,S=0,E=0,T=null,U=-1,M=null;const w=new $t,L=new $t;let C=null;const k=new Tt(0);let P=0,F=e.width,B=e.height,j=1,G=null,Z=null;const J=new $t(0,0,F,B),Q=new $t(0,0,F,B);let lt=!1;const K=new qi;let et=!1,ct=!1,pt=null;const mt=new Kt,wt=new Lt,Et=new z,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Nt(){return T===null?j:1}let H=n;function ae(R,O){for(let q=0;q<R.length;q++){const Y=R[q],X=e.getContext(Y,O);if(X!==null)return X}return null}try{const R={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${za}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",I,!1),e.addEventListener("webglcontextcreationerror",ut,!1),H===null){const O=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&O.shift(),H=ae(O,R),H===null)throw ae(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&H instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),H.getShaderPrecisionFormat===void 0&&(H.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let xt,Rt,V,nt,st,A,b,D,N,W,$,rt,tt,ht,vt,kt,it,jt,Wt,Dt,St,gt,Ft,qt;function se(){xt=new vm(H),Rt=new um(H,xt,t),xt.init(Rt),gt=new ng(H,xt,Rt),V=new tg(H,xt,Rt),nt=new Mm(H),st=new B0,A=new eg(H,xt,V,st,Rt,gt,nt),b=new dm(_),D=new gm(_),N=new Rf(H,Rt),Ft=new cm(H,xt,N,Rt),W=new xm(H,N,nt,Ft),$=new bm(H,W,N,nt),Wt=new Sm(H,Rt,A),kt=new fm(st),rt=new O0(_,b,D,xt,Rt,Ft,kt),tt=new ag(_,st),ht=new G0,vt=new j0(xt,Rt),jt=new lm(_,b,D,V,$,d,l),it=new Q0(_,$,Rt),qt=new og(H,nt,Rt,V),Dt=new hm(H,xt,nt,Rt),St=new _m(H,xt,nt,Rt),nt.programs=rt.programs,_.capabilities=Rt,_.extensions=xt,_.properties=st,_.renderLists=ht,_.shadowMap=it,_.state=V,_.info=nt}se();const Ht=new rg(_,H);this.xr=Ht,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const R=xt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=xt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(R){R!==void 0&&(j=R,this.setSize(F,B,!1))},this.getSize=function(R){return R.set(F,B)},this.setSize=function(R,O,q=!0){if(Ht.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=R,B=O,e.width=Math.floor(R*j),e.height=Math.floor(O*j),q===!0&&(e.style.width=R+"px",e.style.height=O+"px"),this.setViewport(0,0,R,O)},this.getDrawingBufferSize=function(R){return R.set(F*j,B*j).floor()},this.setDrawingBufferSize=function(R,O,q){F=R,B=O,j=q,e.width=Math.floor(R*q),e.height=Math.floor(O*q),this.setViewport(0,0,R,O)},this.getCurrentViewport=function(R){return R.copy(w)},this.getViewport=function(R){return R.copy(J)},this.setViewport=function(R,O,q,Y){R.isVector4?J.set(R.x,R.y,R.z,R.w):J.set(R,O,q,Y),V.viewport(w.copy(J).multiplyScalar(j).floor())},this.getScissor=function(R){return R.copy(Q)},this.setScissor=function(R,O,q,Y){R.isVector4?Q.set(R.x,R.y,R.z,R.w):Q.set(R,O,q,Y),V.scissor(L.copy(Q).multiplyScalar(j).floor())},this.getScissorTest=function(){return lt},this.setScissorTest=function(R){V.setScissorTest(lt=R)},this.setOpaqueSort=function(R){G=R},this.setTransparentSort=function(R){Z=R},this.getClearColor=function(R){return R.copy(jt.getClearColor())},this.setClearColor=function(){jt.setClearColor.apply(jt,arguments)},this.getClearAlpha=function(){return jt.getClearAlpha()},this.setClearAlpha=function(){jt.setClearAlpha.apply(jt,arguments)},this.clear=function(R=!0,O=!0,q=!0){let Y=0;if(R){let X=!1;if(T!==null){const dt=T.texture.format;X=dt===Ic||dt===Uc||dt===Lc}if(X){const dt=T.texture.type,yt=dt===ue||dt===An||dt===ka||dt===ii||dt===Cc||dt===Pc,At=jt.getClearColor(),Pt=jt.getClearAlpha(),Ot=At.r,Ut=At.g,It=At.b;yt?(m[0]=Ot,m[1]=Ut,m[2]=It,m[3]=Pt,H.clearBufferuiv(H.COLOR,0,m)):(v[0]=Ot,v[1]=Ut,v[2]=It,v[3]=Pt,H.clearBufferiv(H.COLOR,0,v))}else Y|=H.COLOR_BUFFER_BIT}O&&(Y|=H.DEPTH_BUFFER_BIT),q&&(Y|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",I,!1),e.removeEventListener("webglcontextcreationerror",ut,!1),ht.dispose(),vt.dispose(),st.dispose(),b.dispose(),D.dispose(),$.dispose(),Ft.dispose(),qt.dispose(),rt.dispose(),Ht.dispose(),Ht.removeEventListener("sessionstart",Ee),Ht.removeEventListener("sessionend",Qt),pt&&(pt.dispose(),pt=null),Ae.stop()};function at(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function I(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const R=nt.autoReset,O=it.enabled,q=it.autoUpdate,Y=it.needsUpdate,X=it.type;se(),nt.autoReset=R,it.enabled=O,it.autoUpdate=q,it.needsUpdate=Y,it.type=X}function ut(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ft(R){const O=R.target;O.removeEventListener("dispose",ft),Ct(O)}function Ct(R){bt(R),st.remove(R)}function bt(R){const O=st.get(R).programs;O!==void 0&&(O.forEach(function(q){rt.releaseProgram(q)}),R.isShaderMaterial&&rt.releaseShaderCache(R))}this.renderBufferDirect=function(R,O,q,Y,X,dt){O===null&&(O=Mt);const yt=X.isMesh&&X.matrixWorld.determinant()<0,At=Eh(R,O,q,Y,X);V.setMaterial(Y,yt);let Pt=q.index,Ot=1;if(Y.wireframe===!0){if(Pt=W.getWireframeAttribute(q),Pt===void 0)return;Ot=2}const Ut=q.drawRange,It=q.attributes.position;let oe=Ut.start*Ot,Ge=(Ut.start+Ut.count)*Ot;dt!==null&&(oe=Math.max(oe,dt.start*Ot),Ge=Math.min(Ge,(dt.start+dt.count)*Ot)),Pt!==null?(oe=Math.max(oe,0),Ge=Math.min(Ge,Pt.count)):It!=null&&(oe=Math.max(oe,0),Ge=Math.min(Ge,It.count));const ve=Ge-oe;if(ve<0||ve===1/0)return;Ft.setup(X,Y,At,q,Pt);let vn,ne=Dt;if(Pt!==null&&(vn=N.get(Pt),ne=St,ne.setIndex(vn)),X.isMesh)Y.wireframe===!0?(V.setLineWidth(Y.wireframeLinewidth*Nt()),ne.setMode(H.LINES)):ne.setMode(H.TRIANGLES);else if(X.isLine){let Gt=Y.linewidth;Gt===void 0&&(Gt=1),V.setLineWidth(Gt*Nt()),X.isLineSegments?ne.setMode(H.LINES):X.isLineLoop?ne.setMode(H.LINE_LOOP):ne.setMode(H.LINE_STRIP)}else X.isPoints?ne.setMode(H.POINTS):X.isSprite&&ne.setMode(H.TRIANGLES);if(X.isBatchedMesh)ne.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else if(X.isInstancedMesh)ne.renderInstances(oe,ve,X.count);else if(q.isInstancedBufferGeometry){const Gt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Tr=Math.min(q.instanceCount,Gt);ne.renderInstances(oe,ve,Tr)}else ne.render(oe,ve)};function Zt(R,O,q){R.transparent===!0&&R.side===ln&&R.forceSinglePass===!1?(R.side=Ue,R.needsUpdate=!0,Es(R,O,q),R.side=Cn,R.needsUpdate=!0,Es(R,O,q),R.side=ln):Es(R,O,q)}this.compile=function(R,O,q=null){q===null&&(q=R),p=vt.get(q),p.init(),x.push(p),q.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),R!==q&&R.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),p.setupLights(_._useLegacyLights);const Y=new Set;return R.traverse(function(X){const dt=X.material;if(dt)if(Array.isArray(dt))for(let yt=0;yt<dt.length;yt++){const At=dt[yt];Zt(At,q,X),Y.add(At)}else Zt(dt,q,X),Y.add(dt)}),x.pop(),p=null,Y},this.compileAsync=function(R,O,q=null){const Y=this.compile(R,O,q);return new Promise(X=>{function dt(){if(Y.forEach(function(yt){st.get(yt).currentProgram.isReady()&&Y.delete(yt)}),Y.size===0){X(R);return}setTimeout(dt,10)}xt.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let Jt=null;function ge(R){Jt&&Jt(R)}function Ee(){Ae.stop()}function Qt(){Ae.start()}const Ae=new Yc;Ae.setAnimationLoop(ge),typeof self<"u"&&Ae.setContext(self),this.setAnimationLoop=function(R){Jt=R,Ht.setAnimationLoop(R),R===null?Ae.stop():Ae.start()},Ht.addEventListener("sessionstart",Ee),Ht.addEventListener("sessionend",Qt),this.render=function(R,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Ht.enabled===!0&&Ht.isPresenting===!0&&(Ht.cameraAutoUpdate===!0&&Ht.updateCamera(O),O=Ht.getCamera()),R.isScene===!0&&R.onBeforeRender(_,R,O,T),p=vt.get(R,x.length),p.init(),x.push(p),mt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),K.setFromProjectionMatrix(mt),ct=this.localClippingEnabled,et=kt.init(this.clippingPlanes,ct),g=ht.get(R,u.length),g.init(),u.push(g),hn(R,O,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(G,Z),this.info.render.frame++,et===!0&&kt.beginShadows();const q=p.state.shadowsArray;if(it.render(q,R,O),et===!0&&kt.endShadows(),this.info.autoReset===!0&&this.info.reset(),jt.render(g,R),p.setupLights(_._useLegacyLights),O.isArrayCamera){const Y=O.cameras;for(let X=0,dt=Y.length;X<dt;X++){const yt=Y[X];to(g,R,yt,yt.viewport)}}else to(g,R,O);T!==null&&(A.updateMultisampleRenderTarget(T),A.updateRenderTargetMipmap(T)),R.isScene===!0&&R.onAfterRender(_,R,O),Ft.resetDefaultState(),U=-1,M=null,x.pop(),x.length>0?p=x[x.length-1]:p=null,u.pop(),u.length>0?g=u[u.length-1]:g=null};function hn(R,O,q,Y){if(R.visible===!1)return;if(R.layers.test(O.layers)){if(R.isGroup)q=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(O);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||K.intersectsSprite(R)){Y&&Et.setFromMatrixPosition(R.matrixWorld).applyMatrix4(mt);const yt=$.update(R),At=R.material;At.visible&&g.push(R,yt,At,q,Et.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||K.intersectsObject(R))){const yt=$.update(R),At=R.material;if(Y&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Et.copy(R.boundingSphere.center)):(yt.boundingSphere===null&&yt.computeBoundingSphere(),Et.copy(yt.boundingSphere.center)),Et.applyMatrix4(R.matrixWorld).applyMatrix4(mt)),Array.isArray(At)){const Pt=yt.groups;for(let Ot=0,Ut=Pt.length;Ot<Ut;Ot++){const It=Pt[Ot],oe=At[It.materialIndex];oe&&oe.visible&&g.push(R,yt,oe,q,Et.z,It)}}else At.visible&&g.push(R,yt,At,q,Et.z,null)}}const dt=R.children;for(let yt=0,At=dt.length;yt<At;yt++)hn(dt[yt],O,q,Y)}function to(R,O,q,Y){const X=R.opaque,dt=R.transmissive,yt=R.transparent;p.setupLightsView(q),et===!0&&kt.setGlobalState(_.clippingPlanes,q),dt.length>0&&bh(X,dt,O,q),Y&&V.viewport(w.copy(Y)),X.length>0&&bs(X,O,q),dt.length>0&&bs(dt,O,q),yt.length>0&&bs(yt,O,q),V.buffers.depth.setTest(!0),V.buffers.depth.setMask(!0),V.buffers.color.setMask(!0),V.setPolygonOffset(!1)}function bh(R,O,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;const dt=Rt.isWebGL2;pt===null&&(pt=new gn(1,1,{generateMipmaps:!0,type:xt.has("EXT_color_buffer_half_float")?Bn:ue,minFilter:oi,samples:dt?4:0})),_.getDrawingBufferSize(wt),dt?pt.setSize(wt.x,wt.y):pt.setSize(pr(wt.x),pr(wt.y));const yt=_.getRenderTarget();_.setRenderTarget(pt),_.getClearColor(k),P=_.getClearAlpha(),P<1&&_.setClearColor(16777215,.5),_.clear();const At=_.toneMapping;_.toneMapping=On,bs(R,q,Y),A.updateMultisampleRenderTarget(pt),A.updateRenderTargetMipmap(pt);let Pt=!1;for(let Ot=0,Ut=O.length;Ot<Ut;Ot++){const It=O[Ot],oe=It.object,Ge=It.geometry,ve=It.material,vn=It.group;if(ve.side===ln&&oe.layers.test(Y.layers)){const ne=ve.side;ve.side=Ue,ve.needsUpdate=!0,eo(oe,q,Y,Ge,ve,vn),ve.side=ne,ve.needsUpdate=!0,Pt=!0}}Pt===!0&&(A.updateMultisampleRenderTarget(pt),A.updateRenderTargetMipmap(pt)),_.setRenderTarget(yt),_.setClearColor(k,P),_.toneMapping=At}function bs(R,O,q){const Y=O.isScene===!0?O.overrideMaterial:null;for(let X=0,dt=R.length;X<dt;X++){const yt=R[X],At=yt.object,Pt=yt.geometry,Ot=Y===null?yt.material:Y,Ut=yt.group;At.layers.test(q.layers)&&eo(At,O,q,Pt,Ot,Ut)}}function eo(R,O,q,Y,X,dt){R.onBeforeRender(_,O,q,Y,X,dt),R.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),X.onBeforeRender(_,O,q,Y,R,dt),X.transparent===!0&&X.side===ln&&X.forceSinglePass===!1?(X.side=Ue,X.needsUpdate=!0,_.renderBufferDirect(q,O,Y,X,R,dt),X.side=Cn,X.needsUpdate=!0,_.renderBufferDirect(q,O,Y,X,R,dt),X.side=ln):_.renderBufferDirect(q,O,Y,X,R,dt),R.onAfterRender(_,O,q,Y,X,dt)}function Es(R,O,q){O.isScene!==!0&&(O=Mt);const Y=st.get(R),X=p.state.lights,dt=p.state.shadowsArray,yt=X.state.version,At=rt.getParameters(R,X.state,dt,O,q),Pt=rt.getProgramCacheKey(At);let Ot=Y.programs;Y.environment=R.isMeshStandardMaterial?O.environment:null,Y.fog=O.fog,Y.envMap=(R.isMeshStandardMaterial?D:b).get(R.envMap||Y.environment),Ot===void 0&&(R.addEventListener("dispose",ft),Ot=new Map,Y.programs=Ot);let Ut=Ot.get(Pt);if(Ut!==void 0){if(Y.currentProgram===Ut&&Y.lightsStateVersion===yt)return io(R,At),Ut}else At.uniforms=rt.getUniforms(R),R.onBuild(q,At,_),R.onBeforeCompile(At,_),Ut=rt.acquireProgram(At,Pt),Ot.set(Pt,Ut),Y.uniforms=At.uniforms;const It=Y.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(It.clippingPlanes=kt.uniform),io(R,At),Y.needsLights=Th(R),Y.lightsStateVersion=yt,Y.needsLights&&(It.ambientLightColor.value=X.state.ambient,It.lightProbe.value=X.state.probe,It.directionalLights.value=X.state.directional,It.directionalLightShadows.value=X.state.directionalShadow,It.spotLights.value=X.state.spot,It.spotLightShadows.value=X.state.spotShadow,It.rectAreaLights.value=X.state.rectArea,It.ltc_1.value=X.state.rectAreaLTC1,It.ltc_2.value=X.state.rectAreaLTC2,It.pointLights.value=X.state.point,It.pointLightShadows.value=X.state.pointShadow,It.hemisphereLights.value=X.state.hemi,It.directionalShadowMap.value=X.state.directionalShadowMap,It.directionalShadowMatrix.value=X.state.directionalShadowMatrix,It.spotShadowMap.value=X.state.spotShadowMap,It.spotLightMatrix.value=X.state.spotLightMatrix,It.spotLightMap.value=X.state.spotLightMap,It.pointShadowMap.value=X.state.pointShadowMap,It.pointShadowMatrix.value=X.state.pointShadowMatrix),Y.currentProgram=Ut,Y.uniformsList=null,Ut}function no(R){if(R.uniformsList===null){const O=R.currentProgram.getUniforms();R.uniformsList=ar.seqWithValue(O.seq,R.uniforms)}return R.uniformsList}function io(R,O){const q=st.get(R);q.outputColorSpace=O.outputColorSpace,q.batching=O.batching,q.instancing=O.instancing,q.instancingColor=O.instancingColor,q.skinning=O.skinning,q.morphTargets=O.morphTargets,q.morphNormals=O.morphNormals,q.morphColors=O.morphColors,q.morphTargetsCount=O.morphTargetsCount,q.numClippingPlanes=O.numClippingPlanes,q.numIntersection=O.numClipIntersection,q.vertexAlphas=O.vertexAlphas,q.vertexTangents=O.vertexTangents,q.toneMapping=O.toneMapping}function Eh(R,O,q,Y,X){O.isScene!==!0&&(O=Mt),A.resetTextureUnits();const dt=O.fog,yt=Y.isMeshStandardMaterial?O.environment:null,At=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Pn,Pt=(Y.isMeshStandardMaterial?D:b).get(Y.envMap||yt),Ot=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ut=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),It=!!q.morphAttributes.position,oe=!!q.morphAttributes.normal,Ge=!!q.morphAttributes.color;let ve=On;Y.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ve=_.toneMapping);const vn=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ne=vn!==void 0?vn.length:0,Gt=st.get(Y),Tr=p.state.lights;if(et===!0&&(ct===!0||R!==M)){const Ye=R===M&&Y.id===U;kt.setState(Y,R,Ye)}let re=!1;Y.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==Tr.state.version||Gt.outputColorSpace!==At||X.isBatchedMesh&&Gt.batching===!1||!X.isBatchedMesh&&Gt.batching===!0||X.isInstancedMesh&&Gt.instancing===!1||!X.isInstancedMesh&&Gt.instancing===!0||X.isSkinnedMesh&&Gt.skinning===!1||!X.isSkinnedMesh&&Gt.skinning===!0||X.isInstancedMesh&&Gt.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Gt.instancingColor===!1&&X.instanceColor!==null||Gt.envMap!==Pt||Y.fog===!0&&Gt.fog!==dt||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==kt.numPlanes||Gt.numIntersection!==kt.numIntersection)||Gt.vertexAlphas!==Ot||Gt.vertexTangents!==Ut||Gt.morphTargets!==It||Gt.morphNormals!==oe||Gt.morphColors!==Ge||Gt.toneMapping!==ve||Rt.isWebGL2===!0&&Gt.morphTargetsCount!==ne)&&(re=!0):(re=!0,Gt.__version=Y.version);let Vn=Gt.currentProgram;re===!0&&(Vn=Es(Y,O,X));let so=!1,Ki=!1,Rr=!1;const we=Vn.getUniforms(),Wn=Gt.uniforms;if(V.useProgram(Vn.program)&&(so=!0,Ki=!0,Rr=!0),Y.id!==U&&(U=Y.id,Ki=!0),so||M!==R){we.setValue(H,"projectionMatrix",R.projectionMatrix),we.setValue(H,"viewMatrix",R.matrixWorldInverse);const Ye=we.map.cameraPosition;Ye!==void 0&&Ye.setValue(H,Et.setFromMatrixPosition(R.matrixWorld)),Rt.logarithmicDepthBuffer&&we.setValue(H,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&we.setValue(H,"isOrthographic",R.isOrthographicCamera===!0),M!==R&&(M=R,Ki=!0,Rr=!0)}if(X.isSkinnedMesh){we.setOptional(H,X,"bindMatrix"),we.setOptional(H,X,"bindMatrixInverse");const Ye=X.skeleton;Ye&&(Rt.floatVertexTextures?(Ye.boneTexture===null&&Ye.computeBoneTexture(),we.setValue(H,"boneTexture",Ye.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}X.isBatchedMesh&&(we.setOptional(H,X,"batchingTexture"),we.setValue(H,"batchingTexture",X._matricesTexture,A));const Cr=q.morphAttributes;if((Cr.position!==void 0||Cr.normal!==void 0||Cr.color!==void 0&&Rt.isWebGL2===!0)&&Wt.update(X,q,Vn),(Ki||Gt.receiveShadow!==X.receiveShadow)&&(Gt.receiveShadow=X.receiveShadow,we.setValue(H,"receiveShadow",X.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Wn.envMap.value=Pt,Wn.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),Ki&&(we.setValue(H,"toneMappingExposure",_.toneMappingExposure),Gt.needsLights&&Ah(Wn,Rr),dt&&Y.fog===!0&&tt.refreshFogUniforms(Wn,dt),tt.refreshMaterialUniforms(Wn,Y,j,B,pt),ar.upload(H,no(Gt),Wn,A)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(ar.upload(H,no(Gt),Wn,A),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&we.setValue(H,"center",X.center),we.setValue(H,"modelViewMatrix",X.modelViewMatrix),we.setValue(H,"normalMatrix",X.normalMatrix),we.setValue(H,"modelMatrix",X.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const Ye=Y.uniformsGroups;for(let Pr=0,Rh=Ye.length;Pr<Rh;Pr++)if(Rt.isWebGL2){const ro=Ye[Pr];qt.update(ro,Vn),qt.bind(ro,Vn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Vn}function Ah(R,O){R.ambientLightColor.needsUpdate=O,R.lightProbe.needsUpdate=O,R.directionalLights.needsUpdate=O,R.directionalLightShadows.needsUpdate=O,R.pointLights.needsUpdate=O,R.pointLightShadows.needsUpdate=O,R.spotLights.needsUpdate=O,R.spotLightShadows.needsUpdate=O,R.rectAreaLights.needsUpdate=O,R.hemisphereLights.needsUpdate=O}function Th(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(R,O,q){st.get(R.texture).__webglTexture=O,st.get(R.depthTexture).__webglTexture=q;const Y=st.get(R);Y.__hasExternalTextures=!0,Y.__hasExternalTextures&&(Y.__autoAllocateDepthBuffer=q===void 0,Y.__autoAllocateDepthBuffer||xt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(R,O){const q=st.get(R);q.__webglFramebuffer=O,q.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(R,O=0,q=0){T=R,S=O,E=q;let Y=!0,X=null,dt=!1,yt=!1;if(R){const Pt=st.get(R);Pt.__useDefaultFramebuffer!==void 0?(V.bindFramebuffer(H.FRAMEBUFFER,null),Y=!1):Pt.__webglFramebuffer===void 0?A.setupRenderTarget(R):Pt.__hasExternalTextures&&A.rebindTextures(R,st.get(R.texture).__webglTexture,st.get(R.depthTexture).__webglTexture);const Ot=R.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(yt=!0);const Ut=st.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Ut[O])?X=Ut[O][q]:X=Ut[O],dt=!0):Rt.isWebGL2&&R.samples>0&&A.useMultisampledRTT(R)===!1?X=st.get(R).__webglMultisampledFramebuffer:Array.isArray(Ut)?X=Ut[q]:X=Ut,w.copy(R.viewport),L.copy(R.scissor),C=R.scissorTest}else w.copy(J).multiplyScalar(j).floor(),L.copy(Q).multiplyScalar(j).floor(),C=lt;if(V.bindFramebuffer(H.FRAMEBUFFER,X)&&Rt.drawBuffers&&Y&&V.drawBuffers(R,X),V.viewport(w),V.scissor(L),V.setScissorTest(C),dt){const Pt=st.get(R.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+O,Pt.__webglTexture,q)}else if(yt){const Pt=st.get(R.texture),Ot=O||0;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,Pt.__webglTexture,q||0,Ot)}U=-1},this.readRenderTargetPixels=function(R,O,q,Y,X,dt,yt){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let At=st.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&yt!==void 0&&(At=At[yt]),At){V.bindFramebuffer(H.FRAMEBUFFER,At);try{const Pt=R.texture,Ot=Pt.format,Ut=Pt.type;if(Ot!==_e&&gt.convert(Ot)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const It=Ut===Bn&&(xt.has("EXT_color_buffer_half_float")||Rt.isWebGL2&&xt.has("EXT_color_buffer_float"));if(Ut!==ue&&gt.convert(Ut)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ut===Tn&&(Rt.isWebGL2||xt.has("OES_texture_float")||xt.has("WEBGL_color_buffer_float")))&&!It){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=R.width-Y&&q>=0&&q<=R.height-X&&H.readPixels(O,q,Y,X,gt.convert(Ot),gt.convert(Ut),dt)}finally{const Pt=T!==null?st.get(T).__webglFramebuffer:null;V.bindFramebuffer(H.FRAMEBUFFER,Pt)}}},this.copyFramebufferToTexture=function(R,O,q=0){const Y=Math.pow(2,-q),X=Math.floor(O.image.width*Y),dt=Math.floor(O.image.height*Y);A.setTexture2D(O,0),H.copyTexSubImage2D(H.TEXTURE_2D,q,0,0,R.x,R.y,X,dt),V.unbindTexture()},this.copyTextureToTexture=function(R,O,q,Y=0){const X=O.image.width,dt=O.image.height,yt=gt.convert(q.format),At=gt.convert(q.type);A.setTexture2D(q,0),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,q.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,q.unpackAlignment),O.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,Y,R.x,R.y,X,dt,yt,At,O.image.data):O.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,Y,R.x,R.y,O.mipmaps[0].width,O.mipmaps[0].height,yt,O.mipmaps[0].data):H.texSubImage2D(H.TEXTURE_2D,Y,R.x,R.y,yt,At,O.image),Y===0&&q.generateMipmaps&&H.generateMipmap(H.TEXTURE_2D),V.unbindTexture()},this.copyTextureToTexture3D=function(R,O,q,Y,X=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const dt=R.max.x-R.min.x+1,yt=R.max.y-R.min.y+1,At=R.max.z-R.min.z+1,Pt=gt.convert(Y.format),Ot=gt.convert(Y.type);let Ut;if(Y.isData3DTexture)A.setTexture3D(Y,0),Ut=H.TEXTURE_3D;else if(Y.isDataArrayTexture||Y.isCompressedArrayTexture)A.setTexture2DArray(Y,0),Ut=H.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,Y.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,Y.unpackAlignment);const It=H.getParameter(H.UNPACK_ROW_LENGTH),oe=H.getParameter(H.UNPACK_IMAGE_HEIGHT),Ge=H.getParameter(H.UNPACK_SKIP_PIXELS),ve=H.getParameter(H.UNPACK_SKIP_ROWS),vn=H.getParameter(H.UNPACK_SKIP_IMAGES),ne=q.isCompressedTexture?q.mipmaps[X]:q.image;H.pixelStorei(H.UNPACK_ROW_LENGTH,ne.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,ne.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,R.min.x),H.pixelStorei(H.UNPACK_SKIP_ROWS,R.min.y),H.pixelStorei(H.UNPACK_SKIP_IMAGES,R.min.z),q.isDataTexture||q.isData3DTexture?H.texSubImage3D(Ut,X,O.x,O.y,O.z,dt,yt,At,Pt,Ot,ne.data):q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),H.compressedTexSubImage3D(Ut,X,O.x,O.y,O.z,dt,yt,At,Pt,ne.data)):H.texSubImage3D(Ut,X,O.x,O.y,O.z,dt,yt,At,Pt,Ot,ne),H.pixelStorei(H.UNPACK_ROW_LENGTH,It),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,oe),H.pixelStorei(H.UNPACK_SKIP_PIXELS,Ge),H.pixelStorei(H.UNPACK_SKIP_ROWS,ve),H.pixelStorei(H.UNPACK_SKIP_IMAGES,vn),X===0&&Y.generateMipmaps&&H.generateMipmap(Ut),V.unbindTexture()},this.initTexture=function(R){R.isCubeTexture?A.setTextureCube(R,0):R.isData3DTexture?A.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?A.setTexture2DArray(R,0):A.setTexture2D(R,0),V.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,V.reset(),Ft.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Oa?"display-p3":"srgb",e.unpackColorSpace=Yt.workingColorSpace===wr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Me?ri:Fc}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===ri?Me:Pn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class lg extends eh{}lg.prototype.isWebGL1Renderer=!0;class Ar extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Qe extends Oe{constructor(t=null,e=1,n=1,i,r,o,a,l,c=te,h=te,f,d){super(null,o,a,l,c,h,i,r,f,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qe extends fe{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const bi=new Kt,Pl=new Kt,Ys=[],Ll=new cn,cg=new Kt,es=new le,ns=new Hn;class hg extends le{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new qe(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,cg)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new cn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bi),Ll.copy(t.boundingBox).applyMatrix4(bi),this.boundingBox.union(Ll)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Hn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bi),ns.copy(t.boundingSphere).applyMatrix4(bi),this.boundingSphere.union(ns)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(es.geometry=this.geometry,es.material=this.material,es.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ns.copy(this.boundingSphere),ns.applyMatrix4(n),t.ray.intersectsSphere(ns)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,bi),Pl.multiplyMatrices(n,bi),es.matrixWorld=Pl,es.raycast(t,Ys);for(let o=0,a=Ys.length;o<a;o++){const l=Ys[o];l.instanceId=r,l.object=this,e.push(l)}Ys.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new qe(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class ug extends Ms{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Tt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Dl=new Kt,Ra=new Ha,Ks=new Hn,Zs=new z;class fg extends Be{constructor(t=new Ie,e=new ug){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ks.copy(n.boundingSphere),Ks.applyMatrix4(i),Ks.radius+=r,t.ray.intersectsSphere(Ks)===!1)return;Dl.copy(i).invert(),Ra.copy(t.ray).applyMatrix4(Dl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,f=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let v=d,g=m;v<g;v++){const p=c.getX(v);Zs.fromBufferAttribute(f,p),Ul(Zs,p,l,i,t,e,this)}}else{const d=Math.max(0,o.start),m=Math.min(f.count,o.start+o.count);for(let v=d,g=m;v<g;v++)Zs.fromBufferAttribute(f,v),Ul(Zs,v,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Ul(s,t,e,n,i,r,o){const a=Ra.distanceSqToPoint(s);if(a<e){const l=new z;Ra.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:o})}}class Xa extends Ie{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(r.slice(),3)),this.setAttribute("uv",new he(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const _=new z,y=new z,S=new z;for(let E=0;E<e.length;E+=3)m(e[E+0],_),m(e[E+1],y),m(e[E+2],S),l(_,y,S,x)}function l(x,_,y,S){const E=S+1,T=[];for(let U=0;U<=E;U++){T[U]=[];const M=x.clone().lerp(y,U/E),w=_.clone().lerp(y,U/E),L=E-U;for(let C=0;C<=L;C++)C===0&&U===E?T[U][C]=M:T[U][C]=M.clone().lerp(w,C/L)}for(let U=0;U<E;U++)for(let M=0;M<2*(E-U)-1;M++){const w=Math.floor(M/2);M%2===0?(d(T[U][w+1]),d(T[U+1][w]),d(T[U][w])):(d(T[U][w+1]),d(T[U+1][w+1]),d(T[U+1][w]))}}function c(x){const _=new z;for(let y=0;y<r.length;y+=3)_.x=r[y+0],_.y=r[y+1],_.z=r[y+2],_.normalize().multiplyScalar(x),r[y+0]=_.x,r[y+1]=_.y,r[y+2]=_.z}function h(){const x=new z;for(let _=0;_<r.length;_+=3){x.x=r[_+0],x.y=r[_+1],x.z=r[_+2];const y=p(x)/2/Math.PI+.5,S=u(x)/Math.PI+.5;o.push(y,1-S)}v(),f()}function f(){for(let x=0;x<o.length;x+=6){const _=o[x+0],y=o[x+2],S=o[x+4],E=Math.max(_,y,S),T=Math.min(_,y,S);E>.9&&T<.1&&(_<.2&&(o[x+0]+=1),y<.2&&(o[x+2]+=1),S<.2&&(o[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function m(x,_){const y=x*3;_.x=t[y+0],_.y=t[y+1],_.z=t[y+2]}function v(){const x=new z,_=new z,y=new z,S=new z,E=new Lt,T=new Lt,U=new Lt;for(let M=0,w=0;M<r.length;M+=9,w+=6){x.set(r[M+0],r[M+1],r[M+2]),_.set(r[M+3],r[M+4],r[M+5]),y.set(r[M+6],r[M+7],r[M+8]),E.set(o[w+0],o[w+1]),T.set(o[w+2],o[w+3]),U.set(o[w+4],o[w+5]),S.copy(x).add(_).add(y).divideScalar(3);const L=p(S);g(E,w+0,x,L),g(T,w+2,_,L),g(U,w+4,y,L)}}function g(x,_,y,S){S<0&&x.x===1&&(o[_]=x.x-1),y.x===0&&y.z===0&&(o[_]=S/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function u(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xa(t.vertices,t.indices,t.radius,t.details)}}class qa extends Xa{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new qa(t.radius,t.detail)}}class ws extends Ie{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class dg{constructor(t,e,n=0,i=1/0){this.ray=new Ha(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Ga,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Ca(t,this,n,e),n.sort(Il),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Ca(t[i],this,n,e);return n.sort(Il),n}}function Il(s,t){return s.distance-t.distance}function Ca(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let r=0,o=i.length;r<o;r++)Ca(i[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:za}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=za);const is=s=>Number.isInteger(s)?s.toFixed(1):String(s),pn={loi:1,pond:24,other:48,max:63},pg=.5,nh=-.6,mg=.5625,Ne=`
#define PI 3.14159265
#define NEAR_E ${is(xs)}
#define NORMAL_E ${is(_c)}
#define SLOTS ${fn}
#define PATCHES ${Ni}
#define DIST_PATCHES ${mn}
#define DIST_POND ${pn.pond}
#define DIST_OTHER ${pn.other}
#define DIST_FILL ${is(pg)}
#define DIST_POND_LEVEL ${is(nh)}
#define DIST_BASE ${is(mg)}
`,Ss=`
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
`,He=`
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
`,ja=`
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
`,Nl=Array.from({length:fn},(s,t)=>t),Gn=`
${ja}
${Nl.map(s=>`uniform sampler2D uSlotH${s};`).join(`
`)}
float slotMetres(int s, vec2 xz) {
  // (samplers can only be picked by a constant index; the patches are laid
  // on whichever it was once, so the loop is compiled once, not per slot)
  float h = -4000.0;
${Nl.map(s=>`  ${s?"else ":""}if (s == ${s}) h = rectMetres(uSlotH${s}, uSlotRect[${s}], xz);`).join(`
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
`,Yi=`
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
`,gg=`
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
`,vg=`
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
`,ih=`
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
`,sh=`
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
`,xg=`
${Ne}
${He}
${ja}
${ih}
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
`,_g=`
${Ne}
${Ss}
${He}
${ja}
${ih}
${Yi}
${gg}
${vg}
${sh}
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
`,Mg=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Ya(){const s=new Ie;return s.setAttribute("position",new fe(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const yg=`
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
`;class wg{constructor(t){this.renderer=t,this.size=new Lt;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?Bn:ue,this.sceneRT=new gn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new $a(1,1,An),this.quad=new le(Ya(),new de({vertexShader:Mg,fragmentShader:yg,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Lt},uInvProj:{value:new Kt},uCamWorld:{value:new Kt},uCamPos:{value:new z},uSunDir:{value:new z(0,1,0)},uSunColor:{value:new Tt},uFogColor:{value:new Tt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Ar,this.quadScene.add(this.quad),this.quadCam=new br(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const Sg=`
${Ne}
${He}
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
`;class bg{constructor(t,e=1024,n=Sg){const{W:i,H:r}=t,o=Math.min(1,e/Math.max(i,r)),a=Math.max(16,Math.round(i*o)),l=Math.max(16,Math.round(r*o));this.terrain=t,this.rt=new gn(a,l,{type:ue,format:Vi,depthBuffer:!1,minFilter:ye,magFilter:ye});const c=t.pack.rect;this.uniforms={...t.uniforms,uSunDir:{value:new z(0,1,0)},uStep:{value:Math.max((c.x1-c.x0)/a,(c.z1-c.z0)/l)},uTop:{value:1}},this.material=new de({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:n,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new Ar;const h=new le(Ya(),this.material);h.frustumCulled=!1,this.scene.add(h),this.cam=new br(-1,1,1,-1,0,1),this.h=l,this.strips=4,this.strip=-1,this.drawn={sun:new z(0,-2,0),vert:-1,k:-1}}get texture(){return this.rt.texture}update(t,e,n,i,r){const o=this.uniforms,a=this.drawn;if(this.strip<0){if(!(e.angleTo(a.sun)>.004||Math.abs(n-a.vert)>a.vert*.015||Math.abs(i-a.k)>.03))return;if(o.uSunDir.value.copy(e),o.uTop.value=r,a.sun.copy(e),a.vert=n,a.k=i,!this.ever)return this.ever=!0,this.draw(t,-1);this.strip=0}this.draw(t,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e){const n=this.rt;if(e>=0){const r=Math.ceil(this.h/this.strips);n.scissor.set(0,e*r,n.width,r),n.scissorTest=!0}else n.scissorTest=!1;const i=t.getRenderTarget();t.setRenderTarget(n),t.render(this.scene,this.cam),t.setRenderTarget(i),n.scissorTest=!1}dispose(){this.rt.dispose(),this.material.dispose()}}const aa=32,Fl=1600,zl=-.5;function rh(s,t,e){const n=new Qe(s,t,e,Vi,Tn);return n.minFilter=te,n.magFilter=te,n.wrapS=n.wrapT=De,n.needsUpdate=!0,n}function kl(s,t,e,n=1){const i=new Qe(s,t,e,_e,ue);return i.minFilter=oi,i.magFilter=ye,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=De,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class Pa{constructor(t,e,n=null,i={}){this.pack=t,this.world=e;const r=t.data,{W:o,H:a}=t,{x0:l,z0:c,x1:h,z1:f}=t.rect;this.rect=new $t(l,c,h,f),this.heights=r.metres,this.W=o,this.H=a;const d=e.app.renderer.capabilities.getMaxAnisotropy();this.heightTex=rh(r.metres,o,a),this.normalTex=kl(r.normals,o,a,Math.min(8,d)),this.landTex=kl(r.land,o,a,Math.min(4,d)),r.normals=null,r.land=null;const m=Math.max((h-l)/o,(f-c)/a);this.texel=m;const v=Math.max(h-l,f-c);this.levels=Math.max(1,Math.ceil(Math.log2(v/(aa*m)))+1),this.leafSize=v/2**(this.levels-1),this.buildMinMax(Array.isArray(n)?n:n?[n]:[]),this.full=this.makeGrid(aa),this.half=this.makeGrid(aa/2),this.morph=[];for(let u=0;u<12;u++)this.morph.push(new Lt);const g=e.uniforms,p=(Array.isArray(n)?null:n)||e.arch||this;this.uniforms={...g,uOwnH:{value:this.heightTex},uOwnRect:{value:this.rect},uOwnN:{value:this.normalTex},uOwnL:{value:this.landTex},uArchN:{value:p.normalTex},uArchL:{value:p.landTex},uOwnS:{value:null},uOwnLandA:{value:null},uOwnLandB:{value:null},uSelf:{value:-1},uOwnRain:{value:n&&!t.rainUrl?0:1},uMorph:{value:this.morph},uCamPos:{value:new z},uKau:{value:.5},uDebug:{value:0},...i.uniforms},this.group=new ke;for(const u of[this.full,this.half])u.material=new de({vertexShader:i.vertexShader||xg,fragmentShader:i.fragmentShader||_g,uniforms:{...this.uniforms,uGrid:{value:u.dim}}}),u.mesh=new le(u.geometry,u.material),u.mesh.frustumCulled=!1,u.mesh.matrixAutoUpdate=!1,this.group.add(u.mesh);this.shadow=new bg(this,i.shadowSize,i.shadowFragment),this.uniforms.uOwnS.value=this.shadow.texture,this._frustum=new qi,this._m=new Kt,this._box=new cn,this.rangeK=3.5,this.applyRange(this.rangeK)}makeGrid(t){const e=new ws,n=new Float32Array((t+1)*(t+1)*3);for(let a=0;a<=t;a++)for(let l=0;l<=t;l++){const c=(a*(t+1)+l)*3;n[c]=l/t,n[c+2]=a/t}const i=[];for(let a=0;a<t;a++)for(let l=0;l<t;l++){const c=a*(t+1)+l,h=c+1,f=c+t+1,d=f+1;l+a&1?i.push(c,f,h,h,f,d):i.push(c,f,d,c,d,h)}e.setIndex(i),e.setAttribute("position",new fe(n,3));const r=new Float32Array(Fl*4),o=new qe(r,4);return o.setUsage(ls),e.setAttribute("aNode",o),e.instanceCount=0,{dim:t,geometry:e,data:r,attr:o,count:0}}buildMinMax(t){const{W:e,H:n,heights:i}=this,r=this.pack.rect,o=2**(this.levels-1),a=this.leafSize,l=e/(r.x1-r.x0),c=n/(r.z1-r.z0);let h=new Float32Array(o*o).fill(1/0),f=new Float32Array(o*o).fill(-1/0);for(let m=0;m<o;m++){const v=m*a;if(v>=r.z1-r.z0)continue;const g=Math.max(0,Math.floor(v*c)-1),p=Math.min(n-1,Math.ceil((v+a)*c)+1);for(let u=0;u<o;u++){const x=u*a;if(x>=r.x1-r.x0)continue;const _=Math.max(0,Math.floor(x*l)-1),y=Math.min(e-1,Math.ceil((x+a)*l)+1);let S=1/0,E=-1/0;for(let T=g;T<=p;T++)for(let U=_;U<=y;U++){const M=i[T*e+U];M<S&&(S=M),M>E&&(E=M)}if(t.length){const T=Math.max(2,Math.round((p-g)/16));for(const U of t)for(let M=g;M<=p;M+=T)for(let w=_;w<=y;w+=T){const L=U.metresAt(r.x0+(w+.5)/l,r.z0+(M+.5)/c);L<S&&(S=L),L>E&&(E=L)}S-=40,E+=40}h[m*o+u]=S,f[m*o+u]=E}}this.mm=[{lo:h,hi:f,n:o}];let d=o;for(;d>1;){const m=d/2,v=new Float32Array(m*m),g=new Float32Array(m*m);for(let p=0;p<m;p++)for(let u=0;u<m;u++){const x=2*p*d+2*u;v[p*m+u]=Math.min(h[x],h[x+1],h[x+d],h[x+d+1]),g[p*m+u]=Math.max(f[x],f[x+1],f[x+d],f[x+d+1])}h=v,f=g,d=m,this.mm.push({lo:h,hi:f,n:d})}}metresAt(t,e){const n=this.pack.rect,{W:i,H:r,heights:o}=this;let a=(t-n.x0)/(n.x1-n.x0)*i-.5,l=(e-n.z0)/(n.z1-n.z0)*r-.5;a<0?a=0:a>i-1.001&&(a=i-1.001),l<0?l=0:l>r-1.001&&(l=r-1.001);const c=a|0,h=l|0,f=a-c,d=l-h,m=h*i+c,v=o[m]+(o[m+1]-o[m])*f,g=o[m+i]+(o[m+i+1]-o[m+i])*f;return v+(g-v)*d}applyRange(t){this.rangeK=t;const e=t*this.leafSize;this.ranges=[];for(let n=0;n<this.levels;n++)this.ranges.push(e*2**n);this.ranges[this.levels-1]=1e9;for(let n=0;n<this.levels;n++){const i=this.ranges[n],r=n>0?this.ranges[n-1]:0;this.morph[n].set(r+(i-r)*.5,i*.97)}}setSelf(t){this.uniforms.uSelf.value=t;for(const e of[this.full,this.half])e.material.uniforms.uSelf.value=t}update(t,e){this.group.visible=e,this.full.count=0,this.half.count=0,e&&(this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.vert=this.world.uniforms.uVert.value,this.uniforms.uCamPos.value.copy(t.position),this.select(0,0,this.levels-1));for(const n of[this.full,this.half])n.geometry.instanceCount=n.count,n.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],r=this.leafSize*2**n,o=this.pack.rect.x0+t*r,a=this.pack.rect.z0+e*r,l=this.vert,c=Math.min(0,i.lo[e*i.n+t])*l-.3,h=Math.max(0,i.hi[e*i.n+t])*l+.1;return this._box.min.set(o,c,a),this._box.max.set(o+r,h,a+r),this._box}select(t,e,n){const i=this.mm[n];if(!(i.hi[e*i.n+t]>=zl))return!0;const o=this.nodeBox(t,e,n);if(o.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(o))return!0;const a=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,a,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,a,n),!0;for(let l=0;l<4;l++){const c=t*2+(l&1),h=e*2+(l>>1);if(!this.select(c,h,n-1)){const f=this.mm[n-1];if(!(f.hi[h*f.n+c]>=zl))continue;const d=this.nodeBox(c,h,n-1);if(!this._frustum.intersectsBox(d))continue;this.emit(this.half,c,h,a/2,n)}}return!0}emit(t,e,n,i,r){if(t.count>=Fl)return;const o=t.count*4;t.data[o]=this.pack.rect.x0+e*i,t.data[o+1]=this.pack.rect.z0+n*i,t.data[o+2]=i,t.data[o+3]=r,t.count++}dispose(){for(const t of[this.full,this.half])t.geometry.dispose(),t.material.dispose();this.shadow.dispose(),this.heightTex.dispose(),this.normalTex.dispose(),this.landTex.dispose()}}const Eg=["raise","lower"];async function Ag(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}function ah(s,t,e=console.warn,n=null){const i=(s==null?void 0:s.id)||(s==null?void 0:s.keyframe)||(s==null?void 0:s.file)||"?",r=(s==null?void 0:s.kind)??"lower";if(!Eg.includes(r))return e(`patch ${i}: kind "${r}" is neither raise nor lower; not drawn`),null;if(!Number.isFinite(s.until))return e(`patch ${i}: no until year; not drawn`),null;if(!s.file)return e(`patch ${i}: no mask file; not drawn`),null;const o=Array.isArray(s.size)&&s.size.length===2&&s.size.every(a=>Number.isInteger(a)&&a>0)?s.size:null;return{id:String(i),pack:s.pack??n,kind:r,depth:Number.isFinite(s.depth)?s.depth:-1,until:s.until,url:t(s.file),size:o,note:s.note||""}}async function Tg(s,t=console.warn){const e=new URL(s,location.href),n=o=>new URL(o,e).href;let i;try{i=await Ag(n("patches/manifest.json"))}catch{return[]}const r=[];for(const o of(i==null?void 0:i.patches)||[]){if(!(o!=null&&o.pack)){t(`patch ${(o==null?void 0:o.id)??"?"}: no pack; not drawn`);continue}const a=ah(o,n,t);a&&r.push(a)}return r}async function oh(s){const{px:t,W:e,H:n}=await ai(s),i=new Uint8Array(e*n);for(let r=0,o=0;r<i.length;r++,o+=4)i[r]=t[o];return{grey:i,W:e,H:n}}function Rg(s,t,e,n,i){if(t===n&&e===i)return s;const r=new Uint8Array(n*i);for(let o=0;o<i;o++){const a=Math.min(e-1,Math.max(0,(o+.5)/i*e-.5)),l=Math.floor(a),c=Math.min(e-1,l+1),h=a-l;for(let f=0;f<n;f++){const d=Math.min(t-1,Math.max(0,(f+.5)/n*t-.5)),m=Math.floor(d),v=Math.min(t-1,m+1),g=d-m,p=s[l*t+m]+(s[l*t+v]-s[l*t+m])*g,u=s[c*t+m]+(s[c*t+v]-s[c*t+m])*g;r[o*n+f]=Math.round(p+(u-p)*h)}}return r}function Cg(s,t,e){let n=t,i=e,r=-1,o=-1;for(let h=0;h<e;h++){const f=h*t;for(let d=0;d<t;d++)s[f+d]&&(d<n&&(n=d),d>r&&(r=d),h<i&&(i=h),h>o&&(o=h))}if(r<0)return null;n=Math.max(0,n-1),i=Math.max(0,i-1),r=Math.min(t-1,r+1),o=Math.min(e-1,o+1);const a=r-n+1,l=o-i+1,c=new Uint8Array(a*l);for(let h=0;h<l;h++)c.set(s.subarray((i+h)*t+n,(i+h)*t+n+a),h*a);return{data:c,w:a,h:l,i0:n,j0:i}}async function Pg(s,t=console.warn){const e=[];for(const n of s.masks||[])try{const i=await oh(n.url),[r,o]=n.size||[s.W,s.H];(i.W!==r||i.H!==o)&&t(`${n.url} is ${i.W}×${i.H}, the manifest says ${r}×${o}; read at its own size`),e.push(Rg(i.grey,i.W,i.H,s.W,s.H))}catch(i){t(`${n.url}: ${i.message} (that patch is not drawn)`),e.push(new Uint8Array(s.W*s.H))}return e}function lh(){const s=new Qe(new Uint8Array(4),1,1,Vi,ue);return s.needsUpdate=!0,{uPatchMap:{value:s},uPatchBox:{value:Array.from({length:Ni},()=>new $t(0,0,1,1))},uPatchUv:{value:Array.from({length:Ni},()=>new $t(0,0,1,1))},uPatchInfo:{value:Array.from({length:Ni},()=>new $t(0,-1,-1,0))},uSlotPatch:{value:Array.from({length:fn},()=>new Lt(0,0))},uSlotPatchBox:{value:Array.from({length:fn},()=>new $t(0,0,-1,-1))}}}function Lg(s){const e=s.reduce((l,c)=>l+(c.w+1)*(c.h+1),0),n=Math.max(...s.map(l=>l.w))+2*1,i=Math.min(4096,Math.max(n,64,Math.ceil(Math.sqrt(e*1.25))));let r=1,o=1,a=0;for(const l of[...s].sort((c,h)=>h.h-c.h))r+l.w+1>i&&(r=1,o+=a+1,a=0),l.ax=r,l.ay=o,r+=l.w+1,a=Math.max(a,l.h);return{W:i,H:o+a+1}}class Dg{constructor(t){this.app=t,this.world=t.world,this.u=t.world.uniforms,this.all=[],this.recs=[],this.byPack=new Map,this.loaded=!1,this.atlas=null,this.warned=!1,this.ready=new Promise(e=>this.resolveReady=e),this.slotKey=""}async load(t=this.app.params.get("patches")||this.app.data.base){var a;const e=this.app.warn,n=await Tg(t,e),i=this.loaded;this.all=n,this.resolveReady(n),i&&((a=this.app.districts)==null||a.setPatches(n));const r=new Map(this.world.islandPacks.map(l=>[l.id,l])),o=[];for(const l of n){const c=r.get(l.pack);if(c)try{const h=await oh(l.url),[f,d]=l.size||[c.W,c.H];(h.W!==f||h.H!==d)&&e(`patch ${l.id}: ${l.url} is ${h.W}×${h.H}, the manifest says ${f}×${d}; drawn at its own size`);const m=Cg(h.grey,h.W,h.H);if(!m){e(`patch ${l.id}: its mask marks nothing`);continue}const v=c.rect,g=(v.x1-v.x0)/h.W,p=(v.z1-v.z0)/h.H;o.push({...l,crop:m,box:[v.x0+m.i0*g,v.z0+m.j0*p,v.x0+(m.i0+m.w)*g,v.z0+(m.j0+m.h)*p],k:this.want(l),depthM:l.depth})}catch(h){e(`patch ${l.id}: ${h.message}`)}}return this.setRecs(o),this.loaded=!0,n}forPack(t){return this.all.filter(e=>e.pack===t)}setRecs(t){var e;(e=this.atlas)==null||e.dispose(),this.atlas=null,this.recs=t,this.byPack=new Map;for(const n of t)this.byPack.has(n.pack)||this.byPack.set(n.pack,[]),this.byPack.get(n.pack).push(n);for(const n of this.byPack.values())n.sort((i,r)=>i.kind===r.kind?0:i.kind==="raise"?-1:1);if(t.length){const{W:n,H:i}=Lg(t.map(a=>a.crop)),r=new Uint8Array(n*i);for(const{crop:a}of t)for(let l=0;l<a.h;l++)r.set(a.data.subarray(l*a.w,(l+1)*a.w),(a.ay+l)*n+a.ax);const o=new Qe(r,n,i,Vi,ue);o.minFilter=o.magFilter=ye,o.wrapS=o.wrapT=De,o.generateMipmaps=!1,o.unpackAlignment=1,o.needsUpdate=!0,this.atlas=o,this.atlasSize=[n,i];for(const a of t){const l=a.crop;a.uv=[l.ax/n,l.ay/i,(l.ax+l.w)/n,(l.ay+l.h)/i]}}this.u.uPatchMap.value=this.atlas||lh().uPatchMap.value,this.slotKey="",this.write()}want(t,e=this.app.timeline.year){return e<t.until?1:0}update(t){if(!this.recs.length)return;const e=this.app.timeline.year,n=t>0?1-Math.exp(-t*Mc):1;for(const i of this.recs){const r=this.want(i,e);i.k+=(r-i.k)*n,Math.abs(r-i.k)<.002&&(i.k=r)}this.write()}settle(){this.update(0)}write(){const t=this.u,e=t.uPatchBox.value,n=t.uPatchUv.value,i=t.uPatchInfo.value,r=t.uSlotPatch.value,o=t.uSlotPatchBox.value;let a=0,l=0;this.world.slots.forEach((c,h)=>{const f=c&&this.byPack.get(c.pack.id)||[],d=a;let m=1/0,v=1/0,g=-1/0,p=-1/0;for(const u of f)if(!(u.k<=0)){if(a>=Ni){l++;continue}e[a].set(...u.box),n[a].set(...u.uv),i[a].set(u.k,u.depthM,u.kind==="raise"?1:-1,0),a++,m=Math.min(m,u.box[0]),v=Math.min(v,u.box[1]),g=Math.max(g,u.box[2]),p=Math.max(p,u.box[3])}r[h].set(d,a-d),g>=m?o[h].set(m,v,g,p):o[h].set(0,0,-1,-1)}),l&&!this.warned&&(this.warned=!0,this.app.warn(`more than ${Ni} patches on the islands in view; ${l} of them are not drawn`))}apply(t,e,n,i){const r=this.byPack.get(t);if(!r)return i;for(const o of r){if(o.k<=0)continue;const a=o.box,l=(e-a[0])/(a[2]-a[0]),c=(n-a[1])/(a[3]-a[1]);if(l<0||c<0||l>1||c>1)continue;const h=this.maskAt(o.crop,l,c)*o.k;h>0&&(i+=((o.kind==="raise"?Math.max(i,o.depthM):Math.min(i,o.depthM))-i)*h)}return i}maskAt(t,e,n){const i=e*t.w-.5,r=n*t.h-.5,o=Math.floor(i),a=Math.floor(r),l=i-o,c=r-a,h=(m,v)=>m<0||v<0||m>=t.w||v>=t.h?0:t.data[v*t.w+m],f=h(o,a)+(h(o+1,a)-h(o,a))*l,d=h(o,a+1)+(h(o+1,a+1)-h(o,a+1))*l;return(f+(d-f)*c)/255}stats(){return{loaded:this.loaded,listed:this.all.length,atlas:this.atlasSize||null,kB:this.atlasSize?Math.round(this.atlasSize[0]*this.atlasSize[1]/1024):0,islands:this.recs.map(t=>({id:t.id,pack:t.pack,kind:t.kind,depth:t.depthM,until:t.until,k:+t.k.toFixed(3),box:t.box.map(e=>+e.toFixed(3)),texels:t.crop.w*t.crop.h})),inSlots:this.u.uSlotPatch.value.map(t=>t.y)}}}const Ol=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};class Ug{constructor(t,e){this.app=t,this.data=e,this.packs=e.packs,this.archPack=this.packs.find(o=>o.kind==="archipelago")||this.packs[0],this.islandPacks=this.packs.filter(o=>o!==this.archPack),this.group=new ke,this.terrains=new Map,this.slots=new Array(fn).fill(null),this.exag=lo(5e3),this.noIslands=!1,this.forceK=null;const n=rh(new Float32Array([-4e3]),1,1),i=new Qe(new Uint8Array(4),1,1,_e,ue);i.needsUpdate=!0,this.dummyAux=i;const r=o=>Array.from({length:o},()=>new $t(0,0,0,0));this.uniforms={uVert:{value:this.exag/100},uExag:{value:this.exag},uArchH:{value:n},uArchRect:{value:new $t(0,0,1,1)},uSlotRect:{value:Array.from({length:fn},()=>new $t(0,0,1,1))},uSlotInfo:{value:Array.from({length:fn},()=>new $t(0,0,1,0))},uDistRect:{value:new $t(0,0,1,1)},uDistInfo:{value:new $t(0,0,1,0)},uDistH:{value:n},uDistAux:{value:i},uDistCarve:{value:n},uDistPatch:{value:i},uDistPatchBox:{value:new $t(0,0,0,0)},uDistLower:{value:r(mn)},uDistRaise:{value:r(mn)},uDistRaiseTop:{value:-1e9},uFeatK:{value:r(16)},...lh()},this.district=null;for(let o=0;o<fn;o++)this.uniforms[`uSlotH${o}`]={value:n};this._frustum=new qi,this._m=new Kt,this._box=new cn,this.dummy=n}setArchipelago(t){const e=new Pa(t,this);e.setSelf(-1),this.arch=e,this.terrains.set(t.id,e),this.group.add(e.group),this.uniforms.uArchH.value=e.heightTex,this.uniforms.uArchRect.value.copy(e.rect);const n=t.rect;this.bounds={x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1}}addIsland(t){const e=new Pa(t,this,this.arch);e.k=0,e.want=0,e.slot=-1;const n=t.rect;return e.margin=Math.min(15,.08*Math.min(n.x1-n.x0,n.z1-n.z0)),e.group.visible=!1,this.terrains.set(t.id,e),this.group.add(e.group),e}get islands(){return[...this.terrains.values()].filter(t=>t!==this.arch)}wantFor(t,e){const n=t.pack.rect,i=e.position,r=Math.max(n.x0-i.x,0,i.x-n.x1),o=Math.max(n.z0-i.z,0,i.z-n.z1),a=Math.hypot(r,o,Math.max(1,i.y)),l=(innerHeight||800)/(2*Math.tan(e.fov*Math.PI/360)),c=this.arch.texel*l/a;t.score=c;const h=Math.max(1,t.pack.data.hi*this.uniforms.uVert.value);return this._box.min.set(n.x0,0,n.z0),this._box.max.set(n.x1,h,n.z1),this._frustum.intersectsBox(this._box)?Ol(1,2.4,c):0}update(t,e,n){var m,v,g;this.exag=lo(e),this.uniforms.uExag.value=this.exag,this.uniforms.uVert.value=this.exag/100;const i=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const p of i)p.want=this.noIslands?0:this.wantFor(p,t);const r=i.filter(p=>p.want>0).sort((p,u)=>u.score-p.score),o=new Set(r.slice(0,fn)),a=1-Math.exp(-n*2.5);for(const p of i){const u=o.has(p)?p.want:0;if(p.slot>=0)p.k+=(u-p.k)*a,Math.abs(u-p.k)<.004&&(p.k=u),p.k<=0&&u<=0&&this.release(p);else if(u>0){const x=this.slots.indexOf(null);x>=0&&this.assign(p,x)}}if(this.forceK!==null)for(const p of this.slots)p&&(p.k=this.forceK);if(this.noIslands)for(const p of this.slots)p&&this.release(p);const l=this.uniforms;for(let p=0;p<fn;p++){const u=this.slots[p];l.uSlotInfo.value[p].set(u?u.k:0,u?1:0,u?u.margin:1,0)}(m=this.app.patches)==null||m.update(n),this.arch.update(t,!0);for(const p of i)p.update(t,p.slot>=0);(v=this.district)==null||v.update(t,e,n);const c=this.app.renderer,h=this.app.light.sunDir,f=this.uniforms.uVert.value,d=this.maxY+.1;this.arch.shadow.update(c,h,f,0,d);for(const p of i)p.slot>=0&&p.shadow.update(c,h,f,p.k,d);(g=this.district)==null||g.updateShadow(c,h,f,d)}settle(t){var i;const e=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const r of e)r.want=this.wantFor(r,t);const n=e.filter(r=>r.want>0).sort((r,o)=>o.score-r.score).slice(0,this.slots.length);for(const r of e)r.slot>=0&&!n.includes(r)&&this.release(r);for(const r of n){if(r.slot<0){const o=this.slots.indexOf(null);if(o<0)continue;this.assign(r,o)}r.k=r.want}(i=this.app.patches)==null||i.settle()}stats(){var n,i,r;const t={};for(const[o,a]of this.terrains)a.group.visible&&(t[o]=a.full.count+a.half.count);const e=(n=this.district)==null?void 0:n.cur;return(i=e==null?void 0:e.terrain)!=null&&i.group.visible&&(t[e.d.id]=e.terrain.full.count+e.terrain.half.count),{exag:+this.exag.toFixed(2),nodes:t,slots:this.slots.map(o=>o?`${o.pack.id}:${o.k.toFixed(2)}`:null),district:((r=this.district)==null?void 0:r.stats())??null}}assign(t,e){this.slots[e]=t,t.slot=e,t.k=0,t.setSelf(e),t.shadow.ever=!1,t.shadow.strip=-1,t.shadow.drawn.vert=-1,this.uniforms.uSlotRect.value[e].copy(t.rect),this.uniforms[`uSlotH${e}`].value=t.heightTex}release(t){const e=t.slot;e<0||(this.slots[e]=null,t.slot=-1,t.k=0,this.uniforms[`uSlotH${e}`].value=this.dummy,this.uniforms.uSlotInfo.value[e].set(0,0,1,0))}metresAt(t,e){var l;const n=this.arch;if(!n)return-4e3;const i=n.pack.rect;let r=t<i.x0||e<i.z0||t>i.x1||e>i.z1?-4e3:n.metresAt(t,e),o=null,a=0;for(const c of this.slots){if(!c)continue;const h=c.pack.rect,f=Math.min(t-h.x0,h.x1-t,e-h.z0,h.z1-e);f>a&&(a=f,o=c)}if(o){const c=o.k*Ol(0,o.margin,a);c>0&&(r+=(this.ownMetres(o,t,e)-r)*c)}return(l=this.district)!=null&&l.on?this.district.blend(t,e,r):r}ownMetres(t,e,n){const i=t.metresAt(e,n);return this.app.patches?this.app.patches.apply(t.pack.id,e,n,i):i}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.uniforms.uVert.value}get maxY(){let t=0;for(const e of this.terrains.values())t=Math.max(t,e.pack.data.hi);return t*this.uniforms.uVert.value}islandAt(t,e){let n=null,i=0;for(const r of this.islands){const o=r.pack.rect,a=Math.min(t-o.x0,o.x1-t,e-o.z0,o.z1-e);a>i&&(i=a,n=r)}return n}setRange(t){var e,n,i;for(const r of this.terrains.values())r.applyRange(t);(i=(n=(e=this.district)==null?void 0:e.cur)==null?void 0:n.terrain)==null||i.applyRange(t)}setDebug(t){var n,i;for(const r of this.terrains.values())r.uniforms.uDebug.value=t;const e=(i=(n=this.district)==null?void 0:n.cur)==null?void 0:i.terrain;if(e)for(const r of[e.full,e.half])r.material.uniforms.uDebug.value=t}}const Ig=`
${Ne}
${He}
${Gn}
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
`,Ng=`
${Ne}
${Ss}
${He}
${Gn}
${Yi}
${sh}
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
`,Fg=`
${Ne}
${He}
${Gn}
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
`,ie=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};function zg(s,t,e){const n=t*e,i=new Uint8Array(n),r=new Int32Array(n).fill(-1),o=new Int32Array(n),a=new Float32Array(n);let l=0;const c=new Int32Array(n);let h=0;const f=x=>{let _=h++;const y=a[x];for(;_>0;){const S=_-1>>1;if(a[c[S]]<=y)break;c[_]=c[S],_=S}c[_]=x},d=()=>{const x=c[0],_=c[--h],y=a[_];let S=0;for(;;){let E=2*S+1;if(E>=h||(E+1<h&&a[c[E+1]]<a[c[E]]&&E++,a[c[E]]>=y))break;c[S]=c[E],S=E}return c[S]=_,x},m=new Int32Array(n);let v=0,g=0;for(let x=0;x<n;x++)s[x]<=0&&(i[x]=1);const p=[-1,1,0,0,-1,1,-1,1],u=[0,0,-1,1,-1,-1,1,1];for(let x=0;x<e;x++)for(let _=0;_<t;_++){const y=x*t+_;if(i[y])continue;let S=_===0||x===0||_===t-1||x===e-1,E=-1;for(let T=0;T<8&&!S;T++){const U=_+p[T],w=(x+u[T])*t+U;s[w]<=0&&(S=!0,E=w)}S&&(i[y]=1,r[y]=E,a[y]=s[y],f(y))}for(;h||v<g;){const x=v<g?m[v++]:d();o[l++]=x;const _=a[x],y=x%t,S=(x-y)/t;for(let E=0;E<8;E++){const T=y+p[E],U=S+u[E];if(T<0||U<0||T>=t||U>=e)continue;const M=U*t+T;i[M]||(i[M]=1,r[M]=x,s[M]<=_?(a[M]=_,m[g++]=M):(a[M]=s[M],f(M)))}v===g&&(v=g=0)}return{rec:r,order:o.subarray(0,l)}}function kg(s,t,e,n){const i=new Float32Array(t*e),{rec:r,order:o}=s;for(let a=0;a<o.length;a++)i[o[a]]=n;for(let a=o.length-1;a>=0;a--){const l=o[a],c=r[l];c>=0&&i[c]>0&&(i[c]+=i[l])}return i}function Og(s,t,e,n,i,r,o=.14){var p;const a=e*n,{rec:l}=s,c=new Uint8Array(a);for(let u=0;u<a;u++)t[u]>=i&&(c[u]=1);const h=new Uint8Array(a);for(let u=0;u<a;u++)c[u]&&l[u]>=0&&c[l[u]]&&(h[l[u]]=1);const f=new Uint8Array(a),d=[];for(let u=0;u<a;u++)c[u]&&!h[u]&&d.push(u);const m=new Float32Array(d.length);d.forEach((u,x)=>{let _=0;for(let y=u;y>=0&&c[y]&&_<1e6;y=l[y])_++;m[x]=_});const v=d.map((u,x)=>x).sort((u,x)=>m[x]-m[u]),g=[];for(const u of v){const x=[];let _=d[u];for(;_>=0&&c[_];){const S=_%e,E=(_-S)/e,[T,U]=r(S+.5,E+.5);if(x.push([T,U,t[_]]),f[_])break;f[_]=1,_=l[_]}if(_>=0&&!c[_]){const S=_%e,E=(_-S)/e,[T,U]=r(S+.5,E+.5);x.push([T,U,((p=x.at(-1))==null?void 0:p[2])??i])}if(x.length<3)continue;const y=Hg(Bg(x,3),o);if(!(y.length<2)){g.push(y.length);for(const S of y)g.push(S[0],S[1],S[2])}}return new Float32Array(g)}function Bg(s,t){const e=s.length,n=s.map(i=>i.slice());for(let i=1;i<e-1;i++){let r=0,o=0,a=0;const l=Math.min(t,i,e-1-i);for(let c=-l;c<=l;c++)r+=s[i+c][0],o+=s[i+c][1],a++;n[i][0]=r/a,n[i][1]=o/a}return n}function Hg(s,t){const e=[s[0]];let n=0;for(let r=0;r+1<s.length;r++){const o=s[r],a=s[r+1],l=Math.hypot(a[0]-o[0],a[1]-o[1]);let c=t-n;for(;c<l;){const h=c/l;e.push([o[0]+(a[0]-o[0])*h,o[1]+(a[1]-o[1])*h,o[2]+(a[2]-o[2])*h]),c+=t}n=l-(c-t)}const i=s[s.length-1];return Math.hypot(i[0]-e.at(-1)[0],i[1]-e.at(-1)[1])>t*.3&&e.push(i),e}function Gg(s,t,e,n,i){const r=[];let o=1/0,a=-1/0;for(const h of n)for(let f=0;f+1<h.length;f++){const[d,m]=h[f],[v,g]=h[f+1];m!==g&&(r.push(m<g?[m,d,g,v]:[g,v,m,d]),o=Math.min(o,m,g),a=Math.max(a,m,g))}if(!r.length)return 0;const l=[];let c=0;for(let h=Math.max(0,Math.floor(o));h<=Math.min(e-1,Math.ceil(a));h++){const f=h+.5;l.length=0;for(const d of r)d[0]<=f&&d[2]>f&&l.push(d[1]+(f-d[0])/(d[2]-d[0])*(d[3]-d[1]));l.sort((d,m)=>d-m);for(let d=0;d+1<l.length;d+=2){const m=Math.max(0,Math.ceil(l[d]-.5)),v=Math.min(t-1,Math.floor(l[d+1]-.5));for(let g=m;g<=v;g++)s[h*t+g]=i,c++}}return c}function Js(s,t){let e=s*.1031%1,n=t*.1031%1;e<0&&(e+=1),n<0&&(n+=1);let i=e;const r=e*(n+33.33)+n*(i+33.33)+i*(e+33.33);e+=r,n+=r,i+=r;const o=(e+n)*i%1;return o<0?o+1:o}function La(s,t){const e=Math.floor(s),n=Math.floor(t),i=s-e,r=t-n,o=i*i*(3-2*i),a=r*r*(3-2*r),l=Js(e,n),c=Js(e+1,n),h=Js(e,n+1),f=Js(e+1,n+1);return l+(c-l)*o+(h-l+(l-c+f-h)*o)*a}function ze(s,t=0,e=0){let n=Math.imul(s|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e|0,2246822519);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const ch=new Float32Array(1),Vg=new Uint32Array(ch.buffer);function fs(s){ch[0]=s;const t=Vg[0],e=t>>>16&32768;let n=(t>>>23&255)-127+15;const i=t&8388607;return n<=0?e:n>=31?e|31744:e|n<<10|i>>>13}function Ka(s){const t=s>>>10&31,e=s&1023,n=s&32768?-1:1;return t===0?n*e*5960464477539063e-23:t===31?e?NaN:n*(1/0):n*(1+e/1024)*2**(t-15)}const Wg=28,Za=.5625,oa=[22,36],Bl=3.5,Hl=2.6,$g=32,Xg=.45,la=[7,16];function qg({index:s,inside:t,box:e,m:n,hs:i,cls:r,chanDist:o,aux:a,carve:l,W:c,mx:h,mz:f}){const{x0:d,y0:m,x1:v,y1:g}=e,p=v-d+1,u=g-m+1,x=un(p,u,y=>!t[(m+Math.floor(y/p))*c+d+y%p],h,f),_=new Set;for(let y=m;y<=g;y++)for(let S=d;S<=v;S++){const E=y*c+S;if(!t[E]||n[E]<=.3)continue;const T=S*h,U=y*f,M=(La(T/140+s*7.1,U/140)-.5)*24,w=ie(0,$g,x[(y-m)*p+(S-d)]+M),L=ie(la[0],la[1],o[E]);if(w*L<.02)continue;const C=r[E],k=Za*2**C,P=i[E]/k,F=fs(P-64*Math.floor(P/64)),B=hh(n[E],Ka(F),C),j=Math.round(B/k-.5),G=B-n[E],Z=G<0?ie(Bl+1,Bl,-G):ie(Hl+1,Hl,G),J=w*L*Z;if(J<.02)continue;const Q=(o[E]-la[0])/jg(j,C,s)+ze(s,j,C*7+2);_.add((C*4096+j)*4096+Math.floor(Q)),a[E*4+1]=Math.round(255*J),a[E*4+2]=C,a[E*4+3]=s,l[E*2]=F,l[E*2+1]=fs(Q)}return _.size}function jg(s,t,e){return oa[0]+(oa[1]-oa[0])*ze(e,s,t*7+1)}function Yg(s,t,e,n){let i=1/0,r=1/0,o=-1/0,a=-1/0;for(const l of s)for(const[c,h]of l)i=Math.min(i,c),r=Math.min(r,h),o=Math.max(o,c),a=Math.max(a,h);return{x0:Math.max(0,Math.floor(i)-n),y0:Math.max(0,Math.floor(r)-n),x1:Math.min(t-1,Math.ceil(o)+n),y1:Math.min(e-1,Math.ceil(a)+n)}}function hh(s,t,e){const n=Za*2**e,i=t+64*Math.floor((s/n-t)/64+.5);return(Math.floor(i)+.5)*n}const Gl=.346,Vl=.387,Wl=.436,$l=.575,Xl=.702,Ii=["ohia","ohiaKrumm","koa","kukui","ohiaai","hau","hala","wiliwili","lama","aalii","niu","milo"],Bt=Object.fromEntries(Ii.map((s,t)=>[s,t])),ss={ohiaDry:[1.48,1.41,1.8],ohiaWet:[.72,.75,.7],olapa:[1.32,1.46,1.17]},Qs=9;function Kg(s,t){let e=0;for(let i=0;i<t.length;i++)t[i]>0&&(e+=t[i]);if(e<=0)return-1;s*=e;let n=-1;for(let i=0;i<t.length;i++)if(!(t[i]<=0)&&(n=i,(s-=t[i])<0))return i;return n}function Zg({W:s,H:t,mx:e,mz:n,m:i,m1795:r,rain:o,normals:a,rip:l,tpi:c,chanDist:h,clear:f,patch:d,shore:m,toWorld:v,step:g}){const p=Ii.map(()=>[]),u=new Int32Array(Ii.length),x=new Float32Array(Ii.length),_=Math.floor(s*e/g),y=Math.floor(t*n/g);for(let S=0;S<y;S++)for(let E=0;E<_;E++){const T=(E+ze(E,S,11))*g,U=(S+ze(E,S,12))*g,M=Math.min(s-1,Math.floor(T/e)),w=Math.min(t-1,Math.floor(U/n)),L=w*s+M;if(d[L]>0||i[L]<1.2||r[L]<1.2||h[L]<9)continue;const C=i[L],k=o[L]/255+(ze(E,S,3)-.5)*.1,P=o[L]/255,F=a[L*4+1]/255*2-1,B=1-ie(.55,.75,F),j=C-gr(c,M,w,4),G=gr(l,M,w,4),Z=Math.max(ie(.1,.3,G),ie(12,30,-j)),J=ie(10,30,j)*(1-ie(.05,.2,G)),Q=ie(.94,.97,F)*ie(.25,.5,G),lt=P-(.22+43e-5*C),K=ie(.5,.6,P),et=1-ie(420-250*K,760-430*K,C+(ze(E,S,20)-.5)*120),ct=ie(.42,.6,La(T/210+13.1,U/210+7.7)),pt=ie(.6,.7,La(T/190+41.3,U/190+3.9)),mt=1-ie(14,40,h[L]),wt=C<670&&P>Gl?(1-ie(450,670,C))*(1-ie(Xl-.04,Xl+.02,P)):0,Et=C<610?1:0,Mt=C<550&&k>Wl?Q>.5?.8+4*pt:.1+6*pt:0,Nt=Math.max(ie(0,20,j),ie(300,420,C));x.fill(0);let H=0,ae=1,xt=null;if(m.a[(w>>1)*m.w+(M>>1)]<70&&C<8)H=.3,x[Bt.niu]=50,x[Bt.hala]=30,x[Bt.milo]=15;else if(k<Vl&&lt<.04&&C<300)H=.04+.32*Z+.22*B,x[Bt.aalii]=35,x[Bt.wiliwili]=P<Vl-.02?25:8,x[Bt.lama]=25,x[Bt.ohia]=12,xt=ss.ohiaDry;else if(et>ze(E,S,22))if(Q>.5)H=.45,x[Bt.ohiaai]=40*Mt,x[Bt.hau]=70*mt,x[Bt.kukui]=20*wt*(1-.9*pt),x[Bt.hala]=5*Et;else if(Z>.4||B>.4)H=.85,x[Bt.kukui]=70*wt*(.25+.75*ct)*(1-.9*pt),x[Bt.hala]=14*Et*(1-.7*pt),x[Bt.ohiaai]=10*Mt,x[Bt.hau]=60*mt*(C<450?1:0),x[Bt.lama]=12*(k<Wl&&lt<0?1:0),x[Bt.ohia]=(5+45*(1-wt)*(k>Gl?1:0))*(C>150?Nt:0),x[Bt.ohiaKrumm]=10*(1-wt)*(k>=$l?1:0)*B;else{const D=ie(460,640,C);H=.25+.55*D,J>.5?(x[Bt.ohia]=60*(C>150?1:0),x[Bt.koa]=20*(C>250?1:0),x[Bt.hala]=20*Et*(1-D)):(x[Bt.kukui]=45*wt*(.1+.9*ct)*(1-.9*pt),x[Bt.hala]=35*Et*(1-.7*pt)*(1-.85*D),x[Bt.ohiaai]=10*Mt,x[Bt.hau]=60*mt*(C<450?1:0),x[Bt.ohia]=(10+50*D)*(C>150?Nt:0),x[Bt.koa]=(10+5*D)*(C>250?1:0))}else k<$l?(H=C<760?.55:.85,x[Bt.ohia]=45,x[Bt.koa]=30*(C>300?1:0),x[Bt.lama]=15,x[Bt.aalii]=5,x[Bt.kukui]=10*wt*(Z>.5?1:0)):J>.5||B>.5?(H=.6,x[Bt.ohiaKrumm]=55,x[Bt.ohia]=45,ae=.55+.3*ze(E,S,14)):(H=.92,x[Bt.ohia]=80,x[Bt.koa]=10*(F>.8?1:0),x[Bt.ohiaKrumm]=10,xt=ze(E,S,15)<.12?ss.olapa:ss.ohiaWet);if(H<=ze(E,S,5))continue;const V=Kg(ze(E,S,6),x);if(V<0)continue;const[nt,st]=v(T/e,U/n),A=.92+.16*ze(E,S,8),b=V===Bt.ohia&&xt?xt:V===Bt.ohiaKrumm&&xt===ss.olapa?ss.olapa:[A,A,A];p[V].push(nt,st,C-.6,ze(E,S,7)*Math.PI*2,ae*(.8+.4*ze(E,S,9)),b[0],b[1],b[2],f[L]),u[V]++}return{kinds:Ii,lists:p.map(S=>new Float32Array(S)),counts:Array.from(u)}}const Ri=-1,ds=.5,rs=16;function uh(s,t,e,n=ds,i=Ri){return t<128?s+(i-s)*(t/127)*e:s+(Math.max(ds,n)-s)*((t-128)/127)*e}function Jg({W:s,H:t,lowerMasks:e,lowerOf:n,raises:i,patchMask:r,fill:o,log:a}){const l=s*t;let c=s,h=t,f=-1,d=-1;const m=M=>{const w=M%s,L=(M-w)/s;w<c&&(c=w),w>f&&(f=w),L<h&&(h=L),L>d&&(d=L)};for(let M=0;M<l;M++)if(r[M]||o[M])m(M);else for(const w of i)w[M]&&m(M);if(f<0)return null;c=Math.max(0,c-rs),h=Math.max(0,h-rs),f=Math.min(s-1,f+rs),d=Math.min(t-1,d+rs);const v=f-c+1,g=d-h+1,p=M=>(h+Math.floor(M/v))*s+c+M%v,u=65535,x=new Uint32Array(v*g),_=new Uint16Array(v*g).fill(u);let y=[];for(let M=0;M<v*g;M++){const w=p(M);let L=0;n.forEach((C,k)=>{e[C][w]>=128&&(L|=1<<k)}),L&&(x[M]=L,_[M]=0,y.push(M))}for(let M=1;M<u&&y.length;M++){const w=[];for(const L of y){const C=L%v;for(const k of[C>0?L-1:-1,C<v-1?L+1:-1,L-v,L+v])k<0||k>=v*g||_[k]!==u||M>rs&&!r[p(k)]||(_[k]=M,x[k]=x[L],w.push(k))}y=w}const S=n.reduce((M,w,L)=>M|1<<L,0);for(let M=0;M<v*g;M++)o[p(M)]&&(x[M]=S);const E=[0],T=new Map,U=new Uint8Array(v*g*4);for(let M=0;M<v*g;M++){const w=x[M];if(w){let B=T.get(w);B===void 0&&(E.length<16?B=E.push(w)-1:(B=T.get(S)??E.length-1,a==null||a(`patch map: more than 15 sets of lower patches; ${w.toString(2)} goes with group ${B}`)),T.set(w,B)),U[M*4]=B}const L=p(M);let C=-1,k=0,P=-1,F=0;i.forEach((B,j)=>{const G=B[L];G>k?(P=C,F=k,C=j,k=G):G>F&&(P=j,F=G)}),C>=0&&(U[M*4+1]=k,U[M*4+2]=C&15|(Math.max(0,P)&15)<<4,U[M*4+3]=P>=0?F:0)}return{data:U,x0:c,y0:h,w:v,h:g,groups:E}}function ql(s,t,e){const n=new Uint8Array(t*e),i=new Int32Array(t*e);let r=0,o=0;const a=l=>{s[l]<=0&&!n[l]&&(n[l]=1,i[o++]=l)};for(let l=0;l<t;l++)a(l),a((e-1)*t+l);for(let l=0;l<e;l++)a(l*t),a(l*t+t-1);for(;r<o;){const l=i[r++],c=l%t,h=(l-c)/t;c>0&&a(l-1),c<t-1&&a(l+1),h>0&&a(l-t),h<e-1&&a(l+t)}return n}function Qg({heightPx:s,rainPx:t,masks:e=[],lower:n=[],raise:i=[],raiseDepth:r=[],W:o,H:a,scale:l,offset:c,mx:h,mz:f,rect:d,features:m,stride:v=4,log:g=()=>{}}){const p=Date.now(),u={};let x=p;const _=V=>{const nt=Date.now();u[V]=nt-x,x=nt},y=o*a,S=yc(s,o,a,l,c,v),E=t?wc(t,o,a,v):new Uint8Array(y).fill(82),T=new Uint8Array(y);{const V=ql(S,o,a);for(let nt=0;nt<y;nt++)S[nt]<=0&&!V[nt]&&(S[nt]=.3,T[nt]=1)}const U=(d.x1-d.x0)/o,M=(d.z1-d.z0)/a,w=(V,nt)=>[d.x0+V*U,d.z0+nt*M];_("decode");const L=[...new Set(n)].map(V=>e[V]),C=i.map(V=>e[V]),k=new Uint8Array(y);for(const V of C)for(let nt=0;nt<y;nt++)V[nt]>k[nt]&&(k[nt]=V[nt]);const P=new Uint8Array(y);for(const V of L)for(let nt=0;nt<y;nt++)V[nt]>=128&&(P[nt]=1);if(L.length){const nt=(b,D)=>{const N=b%o,W=(b-N)/o;for(let $=-3;$<=3;$++){const rt=W+$;if(!(rt<0||rt>=a))for(let tt=-3;tt<=3;tt++){const ht=N+tt;if(ht>=0&&ht<o&&D(rt*o+ht))return!0}}return!1},st=[];for(let b=0;b<y;b++)P[b]||S[b]<=0||S[b]>5||nt(b,D=>P[D])&&nt(b,D=>S[D]<=0&&!P[D])&&st.push(b);for(const b of st)P[b]=1;const A=new Uint8Array(y);for(let b=0;b<y;b++){if(!T[b]||A[b])continue;const D=[b];A[b]=1;let N=!1;for(let W=0;W<D.length;W++){const $=D[W];!N&&nt($,tt=>P[tt]===1)&&(N=!0);const rt=$%o;for(const tt of[rt>0?$-1:-1,rt<o-1?$+1:-1,$-o,$+o])tt>=0&&tt<y&&T[tt]&&!A[tt]&&(A[tt]=1,D.push(tt))}if(N)for(const W of D)P[W]=1}}const F=new Uint8Array(y);if(L.length){const nt=N=>S[N]<=0||P[N]===1,st=un(o,a,N=>!nt(N),h,f),A=un(o,a,N=>nt(N)&&st[N]>45,h,f),b=un(o,a,N=>P[N]===1,h,f),D=45+1.5*Math.max(h,f);for(let N=0;N<y;N++)S[N]>0||P[N]||A[N]<=D||k[N]>=64||(b[N]<60?P[N]=2:F[N]=1);for(let N=0;N<y;N++)P[N]&&(P[N]=1)}const B=new Uint8Array(y*4),j=Float32Array.from(S);C.forEach((V,nt)=>{const st=r[nt]??Ri;for(let A=0;A<y;A++)V[A]&&(j[A]+=(Math.max(j[A],st)-j[A])*(V[A]/255))});let G=null,Z=null;{let V=o,nt=a,st=-1,A=-1;for(let b=0;b<y;b++){if(!P[b])continue;const D=b%o,N=(b-D)/o;V=Math.min(V,D),st=Math.max(st,D),nt=Math.min(nt,N),A=Math.max(A,N)}if(st>=0){V=Math.max(0,V-12),nt=Math.max(0,nt-12),st=Math.min(o-1,st+12),A=Math.min(a-1,A+12),G={x0:V,y0:nt,x1:st,y1:A};const b=st-V+1,D=A-nt+1,N=$=>(nt+Math.floor($/b))*o+V+$%b,W=un(b,D,$=>!P[N($)]&&S[N($)]>0,h,f);for(let $=0;$<b*D;$++){const rt=N($);if(!P[rt])continue;const tt=ie(0,45,W[$]);B[rt*4]=Math.round(127*tt),j[rt]+=(Ri-j[rt])*tt}}}if(G){const V=Math.round(15e3/(h*f)),nt=new Uint8Array(y),st=[];for(let A=0;A<y;A++){const b=A%o,D=(A-b)/o;if(b<G.x0||b>G.x1||D<G.y0||D>G.y1||nt[A]||j[A]<=0)continue;st.length=0,st.push(A),nt[A]=1;let N=!1,W=!1;for(let $=0;$<st.length;$++){const rt=st[$],tt=rt%o,ht=(rt-tt)/o;if(tt<=G.x0||ht<=G.y0||tt>=G.x1||ht>=G.y1){W=!0;continue}for(const vt of[rt-1,rt+1,rt-o,rt+o])j[vt]>0?nt[vt]||(nt[vt]=1,st.push(vt)):P[vt]&&(N=!0);st.length>V&&(W=!0)}if(!(W||!N)){Z||(Z=[]);for(const $ of st)P[$]=1,B[$*4]=127,j[$]=Ri,Z.push($)}}}const J=Float32Array.from(S);let Q=null;if(L.length){for(let N=0;N<y;N++)F[N]&&(j[N]=ds);const V=ql(j,o,a);for(let N=0;N<y;N++)!F[N]&&j[N]<=0&&!V[N]&&(F[N]=1);const nt=new Float32Array(y),st=new Float32Array(y);for(let N=0;N<y;N++)F[N]||P[N]||S[N]<=0||(nt[N]=Math.min(S[N],6),st[N]=1);const A=Math.ceil(30/Math.max(h,f)),b=bn(nt,o,a,A,2),D=bn(st,o,a,A,2);Q=new Float32Array(y);for(let N=0;N<y;N++){if(!F[N])continue;const W=D[N]>.001?Math.max(ds,Math.min(6,b[N]/D[N]-.2)):ds;Q[N]=W,B[N*4]=255,j[N]=W,J[N]=W}}const lt=Jg({W:o,H:a,lowerMasks:e,lowerOf:n,raises:C,patchMask:P,fill:F,log:g});_("patches");let K=J;if(Z){K=Float32Array.from(J);for(const V of Z)K[V]=Ri}const et=bc(K,o,a,h,f,Sc(K,o,a,h,f));_("normals");let ct,pt,mt;{const V=tr(J,o,a,2,!0),nt=zg(V.a,V.w,V.h),st=kg(nt,V.w,V.h,4*h*f/1e6);_("routing"),mt=Og(nt,st,V.w,V.h,Xg,(D,N)=>w(D*2,N*2)),_("streams"),pt=un(o,a,D=>{const N=D%o,W=(D-N)/o;return J[D]>0&&st[(W>>1)*V.w+(N>>1)]>=1},h,f);const A=new Float32Array(V.w*V.h);for(let D=0;D<A.length;D++)A[D]=V.a[D]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,st[D])/.04)/1.6)):0;const b=tr(A,V.w,V.h,2,!1);ct={a:bn(b.a,b.w,b.h,1,2),w:b.w,h:b.h}}_("riparian");const wt=new Uint8Array(y*4);let Et;{const V=(nt,st)=>{const A=tr(nt,o,a,2,!1),b=un(A.w,A.h,W=>A.a[W]<=0,h*2,f*2),D=new Float32Array(A.w*A.h);for(let W=1;W<A.h-1;W++)for(let $=1;$<A.w-1;$++){const rt=W*A.w+$,tt=A.a[rt];if(tt<=0||tt>9)continue;const ht=Math.hypot((A.a[rt+1]-A.a[rt-1])/(4*h),(A.a[rt+A.w]-A.a[rt-A.w])/(4*f));D[rt]=b[rt]<70&&ht<.12?1:0}const N={a:bn(D,A.w,A.h,1,1),w:A.w,h:A.h};for(let W=0;W<a;W++)for(let $=0;$<o;$++)wt[(W*o+$)*4+st]=nt[W*o+$]>0?Math.round(255*Math.min(1,gr(N,$,W,2)*1.5)):0;return{a:b,w:A.w,h:A.h}};V(J,1),Et=V(j,3)}for(let V=0;V<a;V++)for(let nt=0;nt<o;nt++){const st=V*o+nt;wt[st*4]=t?E[st]:S[st]>0?82:0,wt[st*4+2]=J[st]>0?Math.round(255*Math.min(1,gr(ct,nt,V,4)*1.6)):0}_("sand");const Mt=new Uint16Array(y*2);if(Q)for(let V=0;V<y;V++)F[V]&&(Mt[V*2]=fs(Q[V]),Mt[V*2+1]=fs(Q[V]-S[V]));if(Z)for(const V of Z)Mt[V*2+1]=fs(Ri-S[V]);const Nt={},H=new Uint8Array(y);{const V=bn(S,o,a,3,2),nt=new Uint8Array(y);{const b=new Float32Array(y);for(let N=1;N<a-1;N++)for(let W=1;W<o-1;W++){const $=N*o+W;b[$]=Math.hypot((V[$+1]-V[$-1])/(2*h),(V[$+o]-V[$-o])/(2*f))}const D=bn(b,o,a,6,2);for(let N=0;N<y;N++)nt[N]=Math.max(0,Math.min(3,Math.round(Math.log2(Math.max(1e-6,D[N]*Wg/Za)))))}const st=new Uint8Array(y),A={village:0,loi:1,pond:2};for(const b of[...m].sort((D,N)=>A[D.kind]-A[N.kind])){const D=Yg(b.rings,o,a,4);for(let W=D.y0;W<=D.y1;W++)st.fill(0,W*o+D.x0,W*o+D.x1+1);const N=Gg(st,o,a,b.rings,1);if(N){if(b.kind==="loi")Nt[b.index]=qg({index:b.index,inside:st,box:D,m:S,hs:V,cls:nt,chanDist:pt,aux:B,carve:Mt,W:o,mx:h,mz:f});else{const W=D.x1-D.x0+1,$=D.y1-D.y0+1,rt=un(W,$,tt=>!st[(D.y0+Math.floor(tt/W))*o+D.x0+tt%W],h,f);for(let tt=D.y0;tt<=D.y1;tt++)for(let ht=D.x0;ht<=D.x1;ht++){const vt=tt*o+ht;st[vt]&&(B[vt*4+1]=Math.round(255*ie(0,b.kind==="pond"?9:40,rt[(tt-D.y0)*W+(ht-D.x0)])),B[vt*4+2]=0,B[vt*4+3]=b.index,Mt[vt*2]=Mt[vt*2+1]=0)}Nt[b.index]=N}for(let W=D.y0;W<=D.y1;W++)for(let $=D.x0;$<=D.x1;$++)st[W*o+$]&&(H[W*o+$]=b.index)}}}_("features");let ae;{const V=tv(H,o,a,5),nt=tr(S,o,a,4,!1),st={a:bn(nt.a,nt.w,nt.h,2,2),w:nt.w,h:nt.h};ae=Zg({W:o,H:a,mx:h,mz:f,m:S,m1795:j,rain:E,normals:et,rip:ct,tpi:st,chanDist:pt,clear:V,patch:P,shore:Et,toWorld:w,step:25})}_("trees");let xt=1/0,Rt=-1/0;for(let V=0;V<y;V++)S[V]<xt&&(xt=S[V]),S[V]>Rt&&(Rt=S[V]);return g(`district decoded in ${Date.now()-p} ms: ${JSON.stringify(u)}`),{metres:S,normals:et,land:wt,aux:B,carve:Mt,streams:mt,trees:ae,counts:Nt,lo:xt,hi:Rt,patchMap:lt,ms:Date.now()-p,times:u}}function tr(s,t,e,n,i){const r=Math.ceil(t/n),o=Math.ceil(e/n),a=new Float32Array(r*o).fill(i?1/0:-1/0);for(let l=0;l<e;l++){const c=Math.floor(l/n)*r;for(let h=0;h<t;h++){const f=c+Math.floor(h/n),d=s[l*t+h];(i?d<a[f]:d>a[f])&&(a[f]=d)}}return{a,w:r,h:o}}function gr(s,t,e,n){const i=Math.min(s.w-1.001,Math.max(0,(t+.5)/n-.5)),r=Math.min(s.h-1.001,Math.max(0,(e+.5)/n-.5)),o=i|0,a=r|0,l=i-o,c=r-a,h=s.a,f=a*s.w+o,d=h[f]+(h[f+1]-h[f])*l,m=h[f+s.w]+(h[f+s.w+1]-h[f+s.w])*l;return d+(m-d)*c}function tv(s,t,e,n){const i=Uint8Array.from(s);for(let o=0;o<e;o++)for(let a=0;a<t;a++){const l=o*t+a;if(!s[l])for(let c=1;c<=n;c++){const h=a-c>=0&&s[l-c]||a+c<t&&s[l+c];if(h){i[l]=h;break}}}const r=Uint8Array.from(i);for(let o=0;o<e;o++)for(let a=0;a<t;a++){const l=o*t+a;if(!i[l])for(let c=1;c<=n;c++){const h=o-c>=0&&i[l-c*t]||o+c<e&&i[l+c*t];if(h){r[l]=h;break}}}return r}const ca=24;async function jl(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}async function ev(s,t=console.warn){let e;try{e=await jl(s.abs("districts/manifest.json"))}catch{return[]}const n=[];for(const i of e.districts||[])try{let r={type:"FeatureCollection",features:[]};if(i.features)try{r=await jl(s.abs(`districts/${i.features}`))}catch(o){t(`districts/${i.features}: ${o.message} (the district is drawn without its features)`)}n.push(nv(i,r,s,t))}catch(r){t(`district ${i.id}: ${r.message}`)}return n}function fh(s){return[Number.isFinite(s==null?void 0:s.from)?s.from:-1/0,Number.isFinite(s==null?void 0:s.to)?s.to:1/0]}function Ja(s,t){const[e,n]=fh(s);return t>=e&&t<n+1}function nv(s,t,e,n){var _;const r=e.proj.rect(s.bounds),[o,a]=s.size,[l,c,h,f]=s.bounds,d=y=>e.abs(`districts/${y}`),m=([y,S])=>[(y-l)/(h-l)*o,(f-S)/(f-c)*a],v={loi:pn.loi,pond:pn.pond,other:pn.other},g={loi:pn.pond-1,pond:pn.other-1,other:pn.max},p=[],u=new Map;for(const y of t.features||[]){const S=y.properties||{},E=S.kind==="loi"?"loi":S.kind==="fishpond"?"pond":S.kind==="village"?"other":null,T=y.geometry;if(!E||(T==null?void 0:T.type)!=="Polygon")continue;if(v[E]>g[E]){n(`district ${s.id}: more ${S.kind} features than the aux map has room for; ${S.name} is not drawn`);continue}const U=v[E]++;p.push({index:U,kind:E==="other"?S.kind:E,rings:T.coordinates.map(M=>M.map(m))}),u.set(U,y)}const x=(s.patches||[]).map(y=>ah(y,d,S=>n(`district ${s.id}: ${S}`),s.id)).filter(Boolean);return{id:s.id,name:s.name||s.id,parent:s.parent||s.island,desc:s,bounds:s.bounds,rect:r,W:o,H:a,mx:(r.x1-r.x0)*ki/o,mz:(r.z1-r.z0)*ki/a,heightUrl:d(s.height.file),rainUrl:(_=s.rain)!=null&&_.file?d(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,own:x,patches:x,features:t,raster:p,byIndex:u,sources:s.sources||[]}}function iv(s,t=[],e=console.warn){const n=[...s.own,...t.filter(o=>o.pack===s.id)],i=n.filter(o=>o.kind==="lower"),r=n.filter(o=>o.kind==="raise");return i.length>ca&&e(`district ${s.id}: ${i.length} lower patches, ${ca} drawn`),r.length>mn&&e(`district ${s.id}: ${r.length} raise patches, ${mn} drawn`),[...r.slice(0,mn),...i.slice(0,ca)]}class sv{constructor(t=console.warn){this.warn=t,this.jobs=new Map,this.n=0;try{this.worker=new Worker(new URL(""+new URL("district-worker-DsB0McXu.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=e=>this.message(e.data),this.worker.onerror=e=>{var n;(n=e.preventDefault)==null||n.call(e),this.fallback=!0;for(const[i,r]of this.jobs)this.mainThread(i,r)}}catch{this.fallback=!0}}job(t){const e=[],n=o=>{let a=e.findIndex(l=>l.url===o.url);return a<0&&(a=e.push({url:o.url,size:o.size})-1),a},i=t.patches.filter(o=>o.kind==="lower").map(n),r=t.patches.filter(o=>o.kind==="raise");return{heightUrl:t.heightUrl,rainUrl:t.rainUrl,masks:e,lower:i,raise:r.map(n),raiseDepth:r.map(o=>o.depth),W:t.W,H:t.H,scale:t.scale,offset:t.offset,mx:t.mx,mz:t.mz,rect:{x0:t.rect.x0,z0:t.rect.z0,x1:t.rect.x1,z1:t.rect.z1},features:t.raster.map(o=>({index:o.index,kind:o.kind,rings:o.rings}))}}decode(t){return new Promise((e,n)=>{const i=++this.n,r={d:t,resolve:e,reject:n};this.jobs.set(i,r),this.fallback?this.mainThread(i,r):this.worker.postMessage({id:i,...this.job(t)})})}message(t){const e=this.jobs.get(t.id);if(e){if(t.log)return this.warn(t.log);this.jobs.delete(t.id),t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,this.jobs.set(t.id,e),this.mainThread(t.id,e)):e.reject(new Error(t.message))}}async mainThread(t,e){try{const n=this.job(e.d),i=await ai(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);const r=n.rainUrl?await ai(n.rainUrl).then(l=>l.W===n.W&&l.H===n.H?l.px:null).catch(()=>null):null,o=await Pg(n,this.warn),a=Qg({...n,heightPx:i.px,rainPx:r,masks:o});this.jobs.delete(t),e.resolve(a)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){var t;(t=this.worker)==null||t.terminate()}}const zn=Dh,Ci=s=>s*xs/100,Xt={plain:0,thatch:1,stone:2,leaf:3,water:4,kapa:5,wood:6,skin:7,sand:8};class Qa{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.feat=[],this.featNow=0,this.xf=null,this.stack=[]}at(t,e,n,i=0,r=zn){this.stack.push(this.xf);const o=Math.cos(i),a=Math.sin(i);return this.xf=l=>[t+(l[0]*o-l[2]*a)*r,e+l[1]*r,n+(l[0]*a+l[2]*o)*r],this}done(){return this.xf=this.stack.pop()||null,this}feature(t){return this.featNow=t,this}tri(t,e,n,i,r=0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const o=e[0]-t[0],a=e[1]-t[1],l=e[2]-t[2],c=n[0]-t[0],h=n[1]-t[1],f=n[2]-t[2];let d=a*f-l*h,m=l*c-o*f,v=o*h-a*c;const g=Math.hypot(d,m,v)||1;d/=g,m/=g,v/=g;for(const p of[t,e,n])this.pos.push(p[0],p[1],p[2]),this.nor.push(d,m,v),this.col.push(i[0],i[1],i[2]),this.mat.push(r),this.feat.push(this.featNow)}quad(t,e,n,i,r,o=0){this.tri(t,e,n,r,o),this.tri(t,n,i,r,o)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let r=0;r<4;r++)this.quad(t[r],e[r],e[(r+1)%4],t[(r+1)%4],n,i)}box(t,e,n,i,r,o,a,l=0,c=0,h=1){const f=Math.cos(c),d=Math.sin(c),m=(y,S,E)=>[t+y*f-E*d,e+S,n+y*d+E*f],v=i/2,g=o/2,p=v*h,u=g*h,x=[m(-v,0,-g),m(v,0,-g),m(v,0,g),m(-v,0,g)],_=[m(-p,r,-u),m(p,r,-u),m(p,r,u),m(-p,r,u)];r<0?this.hexa(_,x,a,l):this.hexa(x,_,a,l)}cyl(t,e,n,i,r,o=0,a=6){const l=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],c=Math.hypot(...l)||1,h=l.map(p=>p/c),f=Math.abs(h[1])<.9?[0,1,0]:[1,0,0];let d=[h[1]*f[2]-h[2]*f[1],h[2]*f[0]-h[0]*f[2],h[0]*f[1]-h[1]*f[0]];const m=Math.hypot(...d);d=d.map(p=>p/m);const v=[h[1]*d[2]-h[2]*d[1],h[2]*d[0]-h[0]*d[2],h[0]*d[1]-h[1]*d[0]],g=(p,u,x)=>{const _=x/a*Math.PI*2,y=Math.cos(_)*u,S=Math.sin(_)*u;return[p[0]+d[0]*y+v[0]*S,p[1]+d[1]*y+v[1]*S,p[2]+d[2]*y+v[2]*S]};for(let p=0;p<a;p++)this.quad(g(t,n,p),g(t,n,p+1),g(e,i,p+1),g(e,i,p),r,o)}blob(t,e,n,i,r,o,a,l=0,c=0,h=l===Xt.leaf){const f=(1+Math.sqrt(5))/2,d=[[-1,f,0],[1,f,0],[-1,-f,0],[1,-f,0],[0,-1,f],[0,1,f],[0,-1,-f],[0,1,-f],[f,0,-1],[f,0,1],[-f,0,-1],[-f,0,1]],m=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],v=u=>.85+.3*Math.abs(Math.sin(u*12.9898+c*78.233)*43758.5453%1),g=d.map((u,x)=>{const _=Math.hypot(...u),y=v(x);return[t+u[0]/_*i*y,e+u[1]/_*r*y,n+u[2]/_*o*y]});if(!h){for(const u of m)this.tri(g[u[0]],g[u[1]],g[u[2]],a,l);return}const p=u=>{const x=[(u[0]-t)/(i*i),(u[1]-e)/(r*r),(u[2]-n)/(o*o)],_=Math.hypot(...x)||1;return[x[0]/_,x[1]/_,x[2]/_]};for(const u of m){const x=u.map(y=>g[y]),_=this.xf?x.map(y=>this.xf(y)):x;for(let y=0;y<3;y++)this.pos.push(..._[y]),this.nor.push(...p(x[y])),this.col.push(a[0],a[1],a[2]),this.mat.push(l),this.feat.push(this.featNow)}}wall(t,e,n,i,r=Xt.stone,o=.7){const a=t.length;if(a<2)return;const l=a>2&&Math.hypot(t[0][0]-t[a-1][0],t[0][2]-t[a-1][2])<1e-9,c=[];for(let g=0;g<a-1;g++){const p=t[g+1][0]-t[g][0],u=t[g+1][2]-t[g][2],x=Math.hypot(p,u)||1;c.push([-u/x,p/x])}const h=t.map((g,p)=>{let u=c[p-1],x=c[p];if(l&&p===0&&(u=c[a-2]),l&&p===a-1&&(x=c[0]),!u)return x;if(!x)return u;const _=u[0]+x[0],y=u[1]+x[1],S=Math.hypot(_,y);if(S<1e-6)return x;const E=1/Math.max(.35,(_*x[0]+y*x[1])/S);return[_/S*E,y/S*E]}),f=e/2,d=e*o/2,m=(g,p,u,x)=>[g[0]+p[0]*u,g[1]+x,g[2]+p[1]*u],v=g=>[m(t[g],h[g],-f,-n*.3),m(t[g],h[g],f,-n*.3),m(t[g],h[g],d,n),m(t[g],h[g],-d,n)];for(let g=0;g<a-1;g++){const[p,u,x,_]=v(g),[y,S,E,T]=v(g+1);this.quad(_,x,E,T,i,r),this.quad(u,S,E,x,i,r),this.quad(y,p,_,T,i,r)}if(!l){const[g,p,u,x]=v(0),[_,y,S,E]=v(a-1);this.quad(g,p,u,x,i,r),this.quad(y,_,E,S,i,r)}}geometry(){const t=new Ie;return t.setAttribute("position",new he(this.pos,3)),t.setAttribute("normal",new he(this.nor,3)),t.setAttribute("color",new he(this.col,3)),t.setAttribute("aMat",new he(this.mat,1)),t.setAttribute("aFeat",new he(this.feat,1)),t.computeBoundingSphere(),t}}function rv(s){const t=s.attributes.position.array,e=s.attributes.normal.array,n=s.attributes.color.array,i=s.attributes.aMat.array,r=new Map,o=[],a=[],l=[],c=[],h=[];for(let d=0;d<i.length;d++){const m=`${t[d*3]},${t[d*3+1]},${t[d*3+2]},${e[d*3]},${e[d*3+1]},${e[d*3+2]},${n[d*3]},${n[d*3+1]},${n[d*3+2]},${i[d]}`;let v=r.get(m);v===void 0&&(v=r.size,r.set(m,v),a.push(t[d*3],t[d*3+1],t[d*3+2]),l.push(e[d*3],e[d*3+1],e[d*3+2]),c.push(n[d*3],n[d*3+1],n[d*3+2]),h.push(i[d])),o.push(v)}const f=new Ie;return f.setAttribute("position",new he(a,3)),f.setAttribute("normal",new he(l,3)),f.setAttribute("color",new he(c,3)),f.setAttribute("aMat",new he(h,1)),f.setIndex(o),f.computeBoundingSphere(),f}function je(s,t=0,e=Math.random){const n=new Tt(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const av=`
${Ne}
${He}
in float aMat;
in float aFeat;
#ifdef USE_INSTANCING
in float aClear;
#endif
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
  int cl = int(aClear + 0.5);
  if (cl > 0) fade *= 1.0 - featV(uFeatSeen, cl);
  // and thinner toward the district's edge, as its ground eases into the
  // island's (one tree in so many left out, not every one dissolved)
  float edgeK = smoothstep(uDistInfo.w, uDistInfo.z, edgeDist(uDistRect, origin.xz));
  float pick = fract(sin(dot(origin.xz, vec2(12.9898, 78.233))) * 43758.5453);
  fade *= step(pick, edgeK);
  #endif
  vFade = fade;
  gl_Position = fade <= 0.001 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * viewMatrix * wp;
}
`,ov=`
${Ne}
${Ss}
${He}
${Yi}
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
  }
  vec2 uv = rectUv(uDistRect, vWorld.xz);
  float vis = texture(uDistS, uv).r;
  vec3 lit = shade(a, n, vWorld, 1.0, vis);
  // a little wrap and translucency for leaves
  if (m == 3) lit += a * uSunColor * max(dot(-n, uSunDir), 0.0) * 0.25 * vis;
  if (m == 5) lit += a * uSkyColor * 0.15;
  gl_FragColor = vec4(lit, 1.0);
}
`;function Da(s,t,e={}){const[n,i]=e.fade||[60,90];return new de({vertexShader:av,fragmentShader:ov,vertexColors:!0,side:e.doubleSide?ln:Cn,uniforms:{...s.uniforms,...t,uFadeNear:{value:n},uFadeFar:{value:i}}})}const ps={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",koa:"#7a4a2a",pondStone:"#8a817a"};function lv(s,t,e=7,n=4.6,i=5.2,r=!0,o=.6){const a=je(ps.thatch,.18,t),l=je(ps.thatchDark,.15,t),c=je(ps.stone,.15,t);s.box(0,-o,0,e+1.8,.45+o,n+1.8,c,Xt.stone);const h=.45,f=h+1.05;s.box(0,h,0,e,f-h,n,a,Xt.thatch);const d=e/2+.35,m=n/2+.45,v=h+i,g=[-d,f-.15,-m],p=[d,f-.15,-m],u=[-d,v,0],x=[d,v,0],_=[-d,f-.15,m],y=[d,f-.15,m];s.quad(g,u,x,p,a,Xt.thatch),s.quad(y,x,u,_,a,Xt.thatch),s.quad(p,x,u,g,l,Xt.thatch),s.quad(_,u,x,y,l,Xt.thatch);const S=e/2;if(s.tri([-S,f,-n/2],[-S,f,n/2],[-S,v-.2,0],a,Xt.thatch),s.tri([S,f,n/2],[S,f,-n/2],[S,v-.2,0],a,Xt.thatch),s.box(0,v-.12,0,e+.9,.35,.55,l,Xt.thatch),r){const E=[.05,.035,.025];s.quad([S+.02,h,-.45],[S+.02,h+1.4,-.45],[S+.02,h+1.4,.45],[S+.02,h,.45],E,0)}}function cv(s,t,e=8){const n=je(ps.koa,.2,t),i=je("#4a2c18",.2,t),r=e/2;s.box(0,0,0,e*.8,.55,.62,n,Xt.wood,0,.9),s.box(r*.85,.05,0,e*.2,.6,.4,i,Xt.wood,0,.5),s.box(-r*.85,.05,0,e*.2,.55,.4,i,Xt.wood,0,.5);const o=-2.4;for(const a of[-e*.15,e*.15])s.cyl([a,.55,0],[a,.5,o],.06,.06,i,Xt.wood,4);s.box(0,.05,o,e*.5,.28,.24,i,Xt.wood,0,.8)}function hv(s,t){const e=je("#4d4642",.2,t);for(let n=0;n<5;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,Xt.stone,n)}const or=Math.PI*2,ms=[[0,1,0]];for(let s=0;s<10;s++){const t=s*Math.PI/5,e=s%2?-1:1;ms.push([Math.cos(t)*.8944,e*.4472,Math.sin(t)*.8944])}ms.push([0,-1,0]);const dh=[];for(let s=0;s<5;s++){const t=1+2*s,e=t+1,n=1+(2*s+2)%10,i=1+(2*s+3)%10;dh.push([0,t,n],[t,e,n],[n,e,i],[11,e,i])}function uv(s,t,e,n,i,r,o,a,l,c=0,h=.1,f=1){const d=(p,u,x)=>{const _=Math.max(0,Math.min(1,(x-p)/(u-p)));return _*_*(3-2*_)},m=ms.map((p,u)=>{const x=u===0||u===11?1:1-h+2*h*Math.abs(Math.sin(u*12.9898+c*78.233)*43758.5453%1);return[t+p[0]*i*x,e+p[1]*r,n+p[2]*o*x]}),v=ms.map(p=>{const u=[p[0]/i,p[1]/r,p[2]/o],x=Math.hypot(...u);return[u[0]/x,u[1]/x,u[2]/x]}),g=ms.map(p=>{const u=f+(1-f)*d(-.8,.3,p[1]);return[a[0]*u,a[1]*u,a[2]*u]});for(const p of dh){const[u,x,_]=p.map(U=>m[U]),y=(x[1]-u[1])*(_[2]-u[2])-(x[2]-u[2])*(_[1]-u[1]),S=(x[2]-u[2])*(_[0]-u[0])-(x[0]-u[0])*(_[2]-u[2]),E=(x[0]-u[0])*(_[1]-u[1])-(x[1]-u[1])*(_[0]-u[0]),T=y*(u[0]+x[0]+_[0]-3*t)+S*(u[1]+x[1]+_[1]-3*e)+E*(u[2]+x[2]+_[2]-3*n)>0;for(const U of T?p:[p[0],p[2],p[1]])s.pos.push(m[U][0],m[U][1],m[U][2]),s.nor.push(v[U][0],v[U][1],v[U][2]),s.col.push(g[U][0],g[U][1],g[U][2]),s.mat.push(l),s.feat.push(0)}}function sn(s,{stick:t,r0:e=.4,r1:n=.25,bark:i="#6a6058",limbs:r=[],crowns:o}){const a=new Qa,l=je(i,.1,s);t&&a.cyl([0,0,0],t,e,n,l,Xt.wood,3);for(const[c,h,f,d]of r)a.cyl(c,h,f,d,l,Xt.wood,3);for(const[c,h,f,d,m,v,g=Xt.leaf,p=1,u=1]of o)uv(a,c,h,f,d,m,d,typeof v=="string"?je(v,.1,s):v,g,p,.1,u);return a.geometry()}function fv(s){const t=new Qa,e=je("#8a7a62",.1,s),n=14;let i=[0,0,0];for(let l=1;l<=4;l++){const c=l/4*n,h=[.06*Math.pow(c,1.5),c,0];t.cyl(i,h,.3-l*.025,.28-l*.03,e,Xt.wood,5),i=h}const r=i,o=je("#6E7A3E",.12,s),a=je("#8f9a43",.1,s);for(let l=0;l<9;l++){const c=l/9*or+s()*.3,h=5.2+s()*1.2,f=1.4+s()*.8,d=Math.cos(c),m=Math.sin(c);let v=r;for(let g=1;g<=4;g++){const p=g/4,u=[r[0]+d*h*p,r[1]+f*p-3.8*p*p,r[2]+m*h*p],x=1*Math.sin(Math.PI*Math.min(1,p*1.1))+.15,_=-m*x,y=d*x,S=g>2?a:o;t.quad(v,u,[u[0]+_,u[1]-.35*x,u[2]+y],[v[0]+_*.7,v[1]-.25*x,v[2]+y*.7],S,Xt.leaf),t.quad([v[0]-_*.7,v[1]-.25*x,v[2]-y*.7],[u[0]-_,u[1]-.35*x,u[2]-y],u,v,S,Xt.leaf),v=u}}return t.geometry()}function dv(s){const t=[];for(let l=0;l<4;l++){const c=l/4*or+.3;for(const h of[-1,1])t.push([Math.cos(c+h*.35)*6.2,10.2+(h>0?.4:0),Math.sin(c+h*.35)*6.2])}const e=[[2.6,6.1,.9],[2.1,6.4,-1.6],[-1.9,6.2,1.4],[-2.2,5.9,-1.1]],n=[0,1,2,3,4].map(l=>[Math.cos(l/5*or)*3.6,3.4,Math.sin(l/5*or)*3.6]),i="#56603D",r="#66704A",o="#77825A",a=je("#5C603F",0,s).map(l=>l*.95);return{ohia:sn(s,{stick:[.3,6.5,.1],bark:"#5A5354",crowns:[[.3,8.6,0,4.6,2.5,a],[2.2,7.7,1,3,1.8,a,Xt.leaf,2]]}),ohiaKrumm:sn(s,{crowns:[[.6,2.4,.2,5,1.5,"#596537",Xt.leaf,1,.75]]}),koa:sn(s,{stick:[.2,4,-.3],r0:.6,r1:.45,bark:"#5A504B",limbs:[0,2,4,6].map(l=>{const[c,h]=[t[l],t[l+1]];return[[.2,3.8,-.3],[(c[0]+h[0])/2*.9,(c[1]+h[1])/2-.6,(c[2]+h[2])/2*.9],.3,.14]}),crowns:[0,2,4,6].map((l,c)=>{const[h,f]=[t[l],t[l+1]];return[(h[0]+f[0])/2,(h[1]+f[1])/2+.3,(h[2]+f[2])/2,3,1.55,c===1?"#737B5A":"#5E6A3C",Xt.leaf,c+1]})}),kukui:sn(s,{stick:[.3,4.2,.1],r0:.45,r1:.35,bark:"#5F5B54",crowns:[[.3,6.5,.1,5.8,3.2,r,Xt.leaf,1,.62],[.5,8.6,.3,3.4,1.6,o,Xt.leaf,5,.8],[-2.9,5.6,1.6,2.8,1.9,i,Xt.leaf,2,.7]]}),ohiaai:sn(s,{stick:[0,2.4,0],r0:.35,r1:.3,bark:"#8A7458",crowns:[[0,6,0,2.4,3.6,"#3A5026"]]}),hau:sn(s,{crowns:[[0,2.2,0,5,2.2,"#6E8A3E"]]}),hala:sn(s,{stick:[.3,3.4,0],r0:.22,r1:.15,bark:"#8E8B82",limbs:[0,2].map(l=>{const[c,h]=e.slice(l,l+2);return[[.3,3.3,0],[(c[0]+h[0])/2,(c[1]+h[1])/2-.45,(c[2]+h[2])/2],.13,.09]}),crowns:e.map((l,c)=>[l[0],l[1]-.35,l[2],1.45,.75,"#55703D",Xt.leaf,c+1])}),wiliwili:sn(s,{stick:[.1,2.8,.2],r0:.45,r1:.3,bark:"#9C6C44",limbs:n.map(l=>[[.05,2.5,.2],l,.2,.08]),crowns:[[0,3.9,.2,4.8,1.25,"#788C4A",Xt.leaf,3,.75]]}),lama:sn(s,{stick:[.2,3.2,.1],r0:.25,r1:.18,bark:"#3E3A36",crowns:[[.2,5.4,.1,2.6,2,"#4C5E2E"]]}),aalii:sn(s,{crowns:[[0,1.2,0,1.5,1,"#6F8A4E"]]}),niu:fv(s),milo:sn(s,{stick:[.2,2.2,0],r0:.35,r1:.28,bark:"#8A8070",crowns:[[.2,4.6,0,3.6,2.4,"#4A6426"]]})}}const Ze=3,ni=[30,80],pv=s=>Math.max(ni[0],Math.min(ni[1],s*2)),Yl=24e3;function mv(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}class gv{constructor(t,e,n,i){const r=mv(5150),o=dv(r);this.group=new ke,this.rect=e,this.nx=Math.ceil((e.x1-e.x0)/Ze),this.nz=Math.ceil((e.z1-e.z0)/Ze),this.mat=Da(n,i,{fade:[ni[0]-7,ni[0]]}),this.matDS=Da(n,i,{fade:[ni[0]-7,ni[0]],doubleSide:!0}),this.species=[];const a=new Kt,l=new Xi,c=new z(0,1,0),h=new z,f=new z;this.total=0,Ii.forEach((d,m)=>{const v=t.lists[m],g=v.length/Qs,p=new Int32Array(g),u=new Int32Array(this.nx*this.nz);for(let C=0;C<g;C++){const k=Math.min(this.nx-1,Math.max(0,Math.floor((v[C*Qs]-e.x0)/Ze))),P=Math.min(this.nz-1,Math.max(0,Math.floor((v[C*Qs+1]-e.z0)/Ze)));p[C]=P*this.nx+k,u[p[C]]++}const x=new Int32Array(this.nx*this.nz+1);for(let C=0;C<u.length;C++)x[C+1]=x[C]+u[C];const _=x.slice(),y=new Int32Array(g);for(let C=0;C<g;C++)y[_[p[C]]++]=C;for(let C=0;C<u.length;C++)for(let k=x[C+1]-1;k>x[C];k--){const P=x[C]+Math.floor(r()*(k-x[C]+1)),F=y[k];y[k]=y[P],y[P]=F}const S=new Float32Array(g*16),E=new Float32Array(g*3),T=new Float32Array(g);for(let C=0;C<g;C++){const P=y[C]*Qs;l.setFromAxisAngle(c,v[P+3]);const F=zn*v[P+4];h.set(v[P],Ci(v[P+2]),v[P+1]),f.set(F,F,F),a.compose(h,l,f),a.toArray(S,C*16),E[C*3]=v[P+5],E[C*3+1]=v[P+6],E[C*3+2]=v[P+7],T[C]=v[P+8]}const U=Math.min(g,Yl),M=rv(o[d]),w=new hg(M,d==="niu"||d==="hala"?this.matDS:this.mat,Math.max(1,U));w.name=d,w.count=0,w.frustumCulled=!1,w.instanceMatrix.setUsage(ls),w.instanceColor=new qe(new Float32Array(Math.max(1,U)*3),3),w.instanceColor.setUsage(ls);const L=new qe(new Float32Array(Math.max(1,U)),1);L.setUsage(ls),M.setAttribute("aClear",L),this.group.add(w),this.species.push({kind:d,mesh:w,aClear:L,start:x,mats:S,cols:E,clear:T,cap:U,n:g}),this.total+=g}),this.frustum=new qi,this.pv=new Kt,this.box=new cn,this.key="",this.drawn=0}update(t,e,n,i){if(this.group.visible=e>.001,!this.group.visible)return;const r=pv(i),o=r*.42;for(const u of[this.mat,this.matDS])u.uniforms.uFadeNear.value=r*.7,u.uniforms.uFadeFar.value=r;const a=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const l=this.rect,c=[],h=Math.max(0,Math.floor((a.x-r-l.x0)/Ze)),f=Math.min(this.nx-1,Math.floor((a.x+r-l.x0)/Ze)),d=Math.max(0,Math.floor((a.z-r-l.z0)/Ze)),m=Math.min(this.nz-1,Math.floor((a.z+r-l.z0)/Ze));for(let u=d;u<=m;u++)for(let x=h;x<=f;x++){const _=l.x0+x*Ze,y=l.z0+u*Ze;this.box.min.set(_,-.5,y),this.box.max.set(_+Ze,n,y+Ze);const S=this.box.distanceToPoint(a);if(S>r||!this.frustum.intersectsBox(this.box))continue;const E=S<o?1:Math.pow(o/S,1.6);c.push(u*this.nx+x,Math.round(E*20))}const v=c.join(",");if(v===this.key)return;this.key=v;let g=0;for(const u of this.species)for(let x=0;x<c.length;x+=2)g+=Math.ceil((u.start[c[x]+1]-u.start[c[x]])*c[x+1]/20);const p=Math.min(1,Yl/Math.max(1,g));this.drawn=0;for(const u of this.species){let x=0;for(let _=0;_<c.length;_+=2){const y=c[_],S=u.start[y],E=u.start[y+1]-S,T=Math.min(Math.ceil(E*c[_+1]*p/20),u.cap-x);T<=0||(u.mesh.instanceMatrix.array.set(u.mats.subarray(S*16,(S+T)*16),x*16),u.mesh.instanceColor.array.set(u.cols.subarray(S*3,(S+T)*3),x*3),u.aClear.array.set(u.clear.subarray(S,S+T),x),x+=T)}u.mesh.count=x,u.mesh.instanceMatrix.needsUpdate=!0,u.mesh.instanceColor.needsUpdate=!0,u.aClear.needsUpdate=!0,u.mesh.visible=x>0,this.drawn+=x}}dispose(){for(const t of this.species)t.mesh.geometry.dispose();this.mat.dispose(),this.matDS.dispose()}}const vv=`
${Ne}
${He}
${Gn}
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
`,xv=`
${Ne}
${Ss}
${He}
${Yi}
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
`,_v=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);class Mv{constructor(t,e){this.shared=t,this.camera=e,this.group=new ke,this.batches=[],this._res=new Lt}add(t,{mode:e="earth",colour:n=[1,1,1],alpha:i=1,minPx:r=1,lift:o=.004,order:a=5,endFade:l=0}={}){const c=[],h=[],f=[];for(const{pts:u,width:x}of t){let _=0;for(let S=0;S+1<u.length;S++)_+=Math.hypot(u[S+1][0]-u[S][0],u[S+1][1]-u[S][1]);let y=0;for(let S=0;S+1<u.length;S++){const[E,T]=u[S],[U,M]=u[S+1],w=Math.hypot(U-E,M-T);if(w<1e-6)continue;const L=Array.isArray(x)?x[S]:x,C=Array.isArray(x)?x[S+1]:x;c.push(E,T,U,M),h.push(L,C,y,y+w),f.push(_),y+=w}}if(!c.length)return null;const d=new ws;d.setAttribute("position",new fe(_v,3)),d.setIndex([0,2,1,1,2,3]),d.setAttribute("aSeg",new qe(new Float32Array(c),4)),d.setAttribute("aInfo",new qe(new Float32Array(h),4)),d.setAttribute("aEnd",new qe(new Float32Array(f),1)),d.instanceCount=c.length/4;const m={...this.shared.uniforms,uCamPos:{value:new z},uPxK:{value:.001},uMinPx:{value:r},uLift:{value:o},uColor:{value:new Tt(...n)},uAlpha:{value:i},uMode:{value:e==="water"?0:e==="earth"?1:2},uEndFade:{value:l}},v=new de({vertexShader:vv,fragmentShader:xv,uniforms:m,transparent:!0,depthWrite:!1,side:ln,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),g=new le(d,v);g.frustumCulled=!1,g.renderOrder=a,this.group.add(g);const p={mesh:g,uniforms:m,alpha:i,count:d.instanceCount};return this.batches.push(p),p}update(t){t.getDrawingBufferSize(this._res);const e=this.camera,n=2*Math.tan(e.fov*Math.PI/360)/Math.max(1,this._res.y/t.getPixelRatio());for(const i of this.batches)i.uniforms.uCamPos.value.copy(e.position),i.uniforms.uPxK.value=n,i.mesh.visible=i.uniforms.uAlpha.value>.003}dispose(){for(const t of this.batches)t.mesh.geometry.dispose(),t.mesh.material.dispose()}}const ha={hawaii:"#f0ae3c",oahu:"#a88fe6",maui:"#d9703f"},yv=26,Kl=3.4*zn,wv=`
${Ne}
${He}
${Gn}
in vec4 aMark;   // x, z, alpha, radius
in vec3 aColour;
uniform float uPxK;    // world units per pixel per unit of distance from the camera
out vec2 vQ;
out float vA;
out vec3 vC;
void main() {
  vQ = position.xy;
  vA = aMark.z;
  vC = aColour;
  if (aMark.z <= 0.002) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec3 c = vec3(aMark.x, max(groundMetres(aMark.xy), 0.0) * uVert, aMark.y);
  // (never under a pixel and a half across, however far off)
  float r = max(aMark.w, 1.6 * uPxK * distance(cameraPosition, c));
  // (stood a little off the ground, and facing the camera)
  c.y += r * 0.5;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 p = c + (right * position.x + up * position.y) * r;
  // (a little toward the eye, so the coarser ground mesh away from the camera doesn't swallow it)
  vec3 toCam = cameraPosition - p;
  float dc = length(toCam);
  p += toCam / max(dc, 1e-3) * min(dc * 0.01, 1.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`,Sv=`
${Ne}
${Yi}
in vec2 vQ;
in float vA;
in vec3 vC;
void main() {
  float r = length(vQ);
  float a = vA * (1.0 - smoothstep(0.35, 1.0, r));
  if (a <= 0.004) discard;
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * 0.7 + uSkyColor * 1.3;
  gl_FragColor = vec4(vC * light * (1.15 - 0.3 * r), a);
}
`;function bv(s,t){const e=new Float32Array(s),n=Array.from({length:5},()=>t());for(let i=0;i<s;i++){const r=n[i%n.length];e[i]=(r+(t()-.5)*(t()<.7?.16:1))%1,e[i]<0&&(e[i]+=1)}return e}class Ev{constructor(t,e,n,i){var f;this.app=t;let r=2026;const o=()=>(r=r*16807%2147483647,r/2147483647);this.forces=[],this.lines=[];for(const d of e){const m=d.properties||{};if(m.kind!=="force"&&m.kind!=="line"||((f=d.geometry)==null?void 0:f.type)!=="LineString")continue;const v=d.geometry.coordinates.map(x=>t.data.proj.toWorld(x)),g=[0];for(let x=1;x<v.length;x++)g.push(g[x-1]+Math.hypot(v[x][0]-v[x-1][0],v[x][1]-v[x-1][1]));const p=g.at(-1),u={p:m,pts:v,cum:g,total:p,event:m.event,step:Number.isFinite(m.step)?m.step:0,w:0,goal:0,stop:m.stop??null};if(m.kind==="line"){const x=m.side||(m.role==="advance"?"hawaii":"oahu");u.batch=i.add([{pts:v,width:.75}],{mode:"band",colour:new Tt(ha[x]||"#ffffff").toArray(),alpha:0,minPx:6,lift:.01,order:6,endFade:1.2}),u.mid=on(d.geometry),this.lines.push(u),u.stand=!0,u.n=Math.round(Math.max(60,Math.min(220,p*45))),u.half=.2,u.u0=Float32Array.from({length:u.n},()=>o()),u.lat=Float32Array.from({length:u.n},()=>(o()+o()+o())/1.5-1),u.size=Float32Array.from({length:u.n},()=>Kl*(.7+.6*o())),u.colour=new Tt(ha[x]||"#ffffff"),this.forces.push(u)}else{const x=/path/i.test(m.name||"")&&p<12;u.file=x,u.n=Math.round(Math.max(90,Math.min(1400,p*(x?12:40)))),u.half=x?.04:m.role==="hawaii"?.36:.28,u.u0=bv(u.n,o),u.lat=Float32Array.from({length:u.n},()=>(o()+o()+o())/1.5-1),u.size=Float32Array.from({length:u.n},()=>Kl*(.7+.6*o())),u.colour=new Tt(ha[m.role]||"#ffffff"),this.forces.push(u)}}this.events=new Map;for(const d of new Set([...this.forces,...this.lines])){if(!d.event)continue;let m=this.events.get(d.event);m||this.events.set(d.event,m={id:d.event,from:1/0,to:-1/0,recs:[]}),m.recs.push(d),Number.isFinite(d.p.from)&&(m.from=Math.min(m.from,d.p.from)),Number.isFinite(d.p.to)&&(m.to=Math.max(m.to,d.p.to))}const a=this.forces.reduce((d,m)=>d+m.n,0);this.count=a;const l=new ws;l.setAttribute("position",new fe(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),l.setIndex([0,1,2,0,2,3]),this.marks=new Float32Array(Math.max(1,a)*4),this.markAttr=new qe(this.marks,4),this.markAttr.setUsage(ls),l.setAttribute("aMark",this.markAttr);const c=new Float32Array(Math.max(1,a)*3);let h=0;for(const d of this.forces){d.o=h;for(let m=0;m<d.n;m++)d.colour.toArray(c,(h+m)*3);h+=d.n}l.setAttribute("aColour",new qe(c,3)),l.instanceCount=a,this.material=new de({vertexShader:wv,fragmentShader:Sv,uniforms:{...n.uniforms,uPxK:{value:.001}},transparent:!0,depthWrite:!1}),this.mesh=new le(l,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=7,this.group=new ke,this.group.add(this.mesh),this.time=0,this.showing={event:null,steps:[],quiet:!1}}stepsAt(t,e){var h;const n=this.events.get(t.id),i=t.stops||[];if(!n||e<0||e>=i.length)return[];const r=(h=this.app.tour)==null?void 0:h.places,o=this.app.data.proj,a=[];for(const f of n.recs){if(f.p.kind!=="line"||!f.mid)continue;const[d,m]=o.toWorld(f.mid);let v=-1,g=6;i.forEach((p,u)=>{const x=r==null?void 0:r.get(p.place),_=x&&on(x.geometry);if(!_)return;const[y,S]=o.toWorld(_),E=Math.hypot(y-d,S-m);E<g&&(g=E,v=u)}),v>=0&&a.push(v-f.step)}a.sort((f,d)=>f-d);const l=a.length?a[Math.floor(a.length/2)]:0,c=new Set;for(const f of n.recs){const d=f.step+l;(d===e||e===i.length-1&&d>e)&&c.add(f.step)}return[...c].sort((f,d)=>f-d)}namedStops(t,e){if(t.stop===null||t.stop===void 0)return null;const n=[];for(const i of Array.isArray(t.stop)?t.stop:[t.stop])Number.isInteger(i)?n.push(i):typeof i=="string"&&(e.stops||[]).forEach((r,o)=>r.place===i&&n.push(o));return n}shownAt(t,e){const n=this.events.get(t.id),i=new Set;if(!n)return i;let r=null;for(const o of n.recs){const a=this.namedStops(o,t);if(a){a.includes(e)&&i.add(o);continue}r||(r=this.stepsAt(t,e)),r.includes(o.step)&&i.add(o)}return i}choose(){const t=this.app.tour,e=t!=null&&t.active?t.event:null;if(e&&this.events.has(e.id)&&t.stop>=0){const i=this.shownAt(e,t.stop);return{event:e.id,recs:i,steps:[...new Set([...i].map(r=>r.step))].sort((r,o)=>r-o),quiet:!1}}const n=this.app.timeline.year;for(const i of this.events.values())if(n>=i.from&&n<i.to+1)return{event:i.id,recs:null,steps:null,quiet:!0};return{event:null,recs:new Set,steps:[],quiet:!1}}update(t,e,n=0){e*=1-Yn(75,140,n),this.time+=t;const i=this.app.camera;this.material.uniforms.uPxK.value=2*Math.tan(i.fov*Math.PI/360)/Math.max(1,innerHeight);const r=this.choose();this.showing=r;const o=t>0?1-Math.exp(-t*2):1;for(const h of new Set([...this.forces,...this.lines])){const f=h.event===r.event&&(r.recs===null||r.recs.has(h));h.goal=f?r.quiet?.2:1:0,h.w+=(h.goal-h.w)*o,Math.abs(h.goal-h.w)<.003&&(h.w=h.goal)}for(const h of this.lines)h.batch&&(h.batch.uniforms.uAlpha.value=.34*h.w*e);const a=r.quiet?.5:1,l=this.marks,c=e>.002&&this.forces.some(h=>h.w>.002);if(!c&&!this.wasShowing){this.mesh.visible=!1,this.marksShown=0;return}this.wasShowing=c;for(const h of this.forces){const f=h.w*e*(h.file?.5:h.stand?.7:.85);for(let d=0;d<h.n;d++){const m=(h.o+d)*4;if(f<=.002){l[m+2]=0;continue}const v=h.stand?Math.min(.999,Math.max(0,h.u0[d]+Math.sin(this.time*.6+d*2.3)*.015)):(h.u0[d]+this.time*a/yv)%1,g=h.stand?Yn(0,.12,v)*(1-Yn(.88,1,v)):h.file?Yn(.3,.45,v)*(1-Yn(.8,.97,v)):Yn(0,.12,v)*(1-Yn(.72,.95,v)),p=v*h.total;let u=1;for(;u<h.cum.length-1&&h.cum[u]<p;)u++;const x=h.pts[u-1],_=h.pts[u],y=h.cum[u]-h.cum[u-1]||1,S=(p-h.cum[u-1])/y,E=(_[0]-x[0])/y,T=(_[1]-x[1])/y,U=h.stand?h.half:h.half*(.45+.55*Math.sin(Math.PI*Math.min(1,v*1.15))),M=Math.sin(this.time*.7+d*1.7)*.15,w=(h.lat[d]+M)*U;l[m]=x[0]+(_[0]-x[0])*S-T*w,l[m+1]=x[1]+(_[1]-x[1])*S+E*w,l[m+2]=f*g,l[m+3]=h.size[d]}}this.markAttr.needsUpdate=!0,this.mesh.visible=e>.002&&this.forces.some(h=>h.w>.002),this.marksShown=0;for(const h of this.forces)h.w>.002&&(this.marksShown+=h.n)}stats(){const t=this.choose(),e=n=>n.event===t.event&&(t.recs===null||t.recs.has(n));return{event:t.event,steps:t.steps,quiet:t.quiet,by:t.recs?[...new Set([...t.recs].map(n=>n.stop===null||n.stop===void 0?"inferred":"named"))].join("+")||"none":"year",forces:this.forces.filter(n=>e(n)&&!n.stand).map(n=>n.p.name),lines:this.lines.filter(e).map(n=>n.p.name),marks:this.count,marksShown:this.marksShown??0}}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}function Yn(s,t,e){const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)}class Av{constructor(t,e){this.app=t;const n=document.getElementById("ui")||document.body;this.layer=document.createElement("div"),this.layer.className="dlabels",n.insertBefore(this.layer,n.querySelector(".pins")||n.firstChild),this.items=[];for(const i of e){const r=i.properties||{};if(r.kind!=="label"||!r.name)continue;const o=on(i.geometry);if(!o)continue;const[a,l]=t.data.proj.toWorld(o),c=document.createElement("div");c.className="dlabel",c.textContent=r.name,c.lang="haw",this.layer.appendChild(c),this.items.push({p:r,x:a,z:l,el:c,v:new z,shown:-1,tx:NaN,ty:NaN})}this.panels=[],this.frame=0}panelRects(){if(this.frame++%15===0){this.panels=[];for(const t of document.querySelectorAll(".card, .timeline, .legend, .tools, .brand, .inspector")){if(t.hidden||!t.offsetParent)continue;const e=t.getBoundingClientRect();e.width>0&&e.height>0&&this.panels.push(e)}}return this.panels}update(t){const e=this.app,n=e.camera,i=innerWidth,r=innerHeight,o=e.rig.state.distance,a=1-Math.max(0,Math.min(1,(o-32)/30)),l=[],c=this.panelRects(),h=e.timeline.year;for(const f of this.items){let d=t*a*(Ja(f.p,h)?1:0);if(d>.01){f.v.set(f.x,e.world.heightAt(f.x,f.z)+.05,f.z).project(n),(f.v.z>1||f.v.z<-1)&&(d=0);const v=(f.v.x+1)/2*i,g=(1-f.v.y)/2*r;(v<-80||v>i+80||g<60||g>r+20)&&(d=0);const p=f.el.offsetWidth||60;d>.01&&c.some(u=>v+p/2>u.left-4&&v-p/2<u.right+4&&g+10>u.top-4&&g-10<u.bottom+4)&&(d=0),d>.01&&l.some(u=>Math.abs(u[0]-v)<(u[2]+p)/2+6&&Math.abs(u[1]-g)<18)&&(d=0),d>.01&&l.push([v,g,p]),d>.01&&!(Math.abs(v-f.tx)<=.3&&Math.abs(g-f.ty)<=.3)&&(f.el.style.transform=`translate(${v.toFixed(1)}px, ${g.toFixed(1)}px)`,f.tx=v,f.ty=g)}const m=Math.round(d*20)/20;m!==f.shown&&(f.el.style.opacity=String(m),f.el.style.visibility=m>0?"visible":"hidden",f.shown=m)}}visible(){return this.items.filter(t=>t.shown>.5).map(t=>t.p.name)}dispose(){this.layer.remove()}}const Ei=zn*1.4;function Tv(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Zl(s,t,e){let n=!1;for(let i=0,r=s.length-1;i<s.length;r=i++){const o=s[i],a=s[r];o[1]>e!=a[1]>e&&t<(a[0]-o[0])*(e-o[1])/(a[1]-o[1])+o[0]&&(n=!n)}return n}function Jl(s,t){const e=[s[0]];for(let n=0;n+1<s.length;n++){const[i,r]=s[n],[o,a]=s[n+1],l=Math.max(1,Math.ceil(Math.hypot(o-i,a-r)/t));for(let c=1;c<=l;c++)e.push([i+(o-i)*c/l,r+(a-r)*c/l])}return e}class Rv{constructor(t,e,n){var f,d;this.app=t,this.districts=e,this.rec=n,this.group=new ke,this.group.name="district features";const i=t.shared,r=t.data.proj,o=n.d.features.features||[];this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new $t(0,0,0,0))},uDistS:{value:n.terrain.shadow.texture}};const a=Tv(1795),l=new Qa;this.counts={hale:0,waa:0,pondWalls:0};for(const[m,v]of n.d.byIndex){const g=(f=v.properties)==null?void 0:f.kind,p=v.geometry.coordinates[0].map(u=>r.toWorld(u));g==="village"?this.buildVillage(l,p,m,a):g==="fishpond"&&this.buildPond(l,p,m,a)}this.structMat=Da(i,this.own,{fade:[70,110]}),this.structures=new le(l.geometry(),this.structMat),this.structures.frustumCulled=!1,this.group.add(this.structures),this.forest=new gv(n.data.trees,n.d.rect,i,this.own),this.group.add(this.forest.group),this.ribbons=new Mv(i,t.camera);const c=n.data.streams,h=[];for(let m=0;m<c.length;){const v=c[m++],g=[],p=[];for(let u=0;u<v;u++,m+=3)g.push([c[m],c[m+1]]),p.push(Math.min(7.5,1+1.3*Math.pow(c[m+2],.45))*zn);h.push({pts:g,width:p})}this.streams=this.ribbons.add(h,{mode:"water",alpha:0,minPx:.9,lift:.004,order:5}),this.streamCount=h.length,this.trails=[];for(const m of o){const v=m.properties||{};if(v.kind!=="trail"||((d=m.geometry)==null?void 0:d.type)!=="LineString")continue;const g=Jl(m.geometry.coordinates.map(u=>r.toWorld(u)),.12),p=this.ribbons.add([{pts:g,width:3.2*zn}],{mode:"earth",colour:new Tt("#9c7f5c").toArray(),alpha:0,minPx:1.3,lift:.006,order:5});p&&this.trails.push({p:v,batch:p,w:0})}this.forces=new Ev(t,o,i,this.ribbons),this.group.add(this.ribbons.group,this.forces.group),this.labels=new Av(t,o),this.show=0}groundAt(t,e,n=!0){const i=this.districts.rawAt(t,e);if(!n)return i;const{d:r}=this.rec,o=r.rect,a=Math.max(0,Math.min(r.W-1,Math.floor((t-o.x0)/(o.x1-o.x0)*r.W))),c=Math.max(0,Math.min(r.H-1,Math.floor((e-o.z0)/(o.z1-o.z0)*r.H)))*r.W+a;return uh(i,this.rec.aux[c*4],1,Ka(this.rec.carve[c*2]))}buildVillage(t,e,n,i){t.feature(n);let r=1/0,o=-1/0,a=1/0,l=-1/0;for(const[f,d]of e)r=Math.min(r,f),o=Math.max(o,f),a=Math.min(a,d),l=Math.max(l,d);const c=.85,h=[];for(let f=a+c/2;f<l;f+=c)for(let d=r+c/2;d<o;d+=c){const m=d+(i()-.5)*c*.7,v=f+(i()-.5)*c*.7;!Zl(e,m,v)||i()<.25||h.push([m,v])}for(const[f,d]of h){const m=i()*Math.PI*2,v=2+Math.floor(i()*3),g=[];for(let p=0;p<v;p++){const u=m+p/v*Math.PI*2+(i()-.5)*.6,x=p===0?0:.3+i()*.12,_=f+Math.cos(u)*x,y=d+Math.sin(u)*x;if(!Zl(e,_,y)||g.some(([w,L])=>Math.hypot(w-_,L-y)<.3))continue;g.push([_,y]);const S=6+i()*3,E=4+i()*1.4;let T=1/0,U=-1/0;for(const[w,L]of[[0,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const C=this.groundAt(_+w*S*.5*Ei,y+L*E*.5*Ei,!1);T=Math.min(T,C),U=Math.max(U,C)}if(T<.6||U-T>2.5)continue;const M=Ci(U);t.at(_,M,y,m+p%2*Math.PI*.5,Ei),lv(t,i,S,E,4.6+i()*1.2,!0,.9+Ci(U-T)/Ei),t.done(),this.counts.hale++}if(i()<.4){const p=f+.08,u=d-.06;t.at(p,Ci(this.groundAt(p,u,!1)),u,0,Ei),hv(t,i),t.done()}}this.buildCanoes(t,e,n,i),t.feature(0)}buildCanoes(t,e,n,i){let r=0,o=0;for(const[d,m]of e)r+=d/e.length,o+=m/e.length;const a=[],l=9,c=.06,h=Array.from({length:16},(d,m)=>[Math.cos(m/16*Math.PI*2),Math.sin(m/16*Math.PI*2)]);for(let d=o-l;d<o+l;d+=c)for(let m=r-l;m<r+l;m+=c){const v=this.groundAt(m,d);if(v<.3||v>2.2)continue;let g=null;for(const[p,u]of h)this.groundAt(m+p*.3,d+u*.3)<=0&&(g=g?[g[0]+p,g[1]+u]:[p,u]);g&&a.push([m,d,v,Math.atan2(g[1],g[0]),Math.hypot(m-r,d-o)])}a.sort((d,m)=>d[4]-m[4]);const f=[];for(const d of a){if(f.length>=14)break;f.some(m=>Math.hypot(m[0]-d[0],m[1]-d[1])<.22)||f.push(d)}for(const[d,m,v,g]of f)t.at(d,Ci(v)+.002,m,g,Ei),cv(t,i,7+i()*4),t.done(),this.counts.waa++}buildPond(t,e,n,i){t.feature(n);const r=je(ps.pondStone,.12,i),o=Jl(e,.05).map(([a,l])=>[a,Ci(Math.max(this.groundAt(a,l),-.8))-.004,l]);t.wall(o,3*zn,1.6*zn,r,Xt.stone,.72),this.counts.pondWalls++,t.feature(0)}update(t,e,n){const i=e;this.show=i,this.own.uShow.value=i;const r=this.districts.featSeen,o=this.own.uFeatSeen.value;for(let c=0;c<64;c++)o[c>>2].setComponent(c&3,r[c]);this.group.visible=i>.001;const a=this.app.timeline.year,l=t>0?1-Math.exp(-t*1.6):1;this.streams&&(this.streams.uniforms.uAlpha.value=.8*i);for(const c of this.trails){const h=Ja(c.p,a)?1:0;c.w+=(h-c.w)*l,Math.abs(h-c.w)<.003&&(c.w=h),c.batch.uniforms.uAlpha.value=.75*c.w*i}this.forest.update(this.app.camera,i,this.rec.data.hi*this.app.world.uniforms.uVert.value+1,n),this.forces.update(t,i,n),this.ribbons.update(this.app.renderer),this.labels.update(i)}settle(t,e){this.update(0,t,e)}stats(){return{...this.counts,trees:this.forest.total,treesDrawn:this.forest.drawn,treeRadius:ni,streams:this.streamCount,trails:this.trails.filter(t=>t.w>.5).length,forces:this.forces.stats(),labels:this.labels.visible()}}dispose(){this.structures.geometry.dispose(),this.structMat.dispose(),this.forest.dispose(),this.ribbons.dispose(),this.forces.dispose(),this.labels.dispose()}}const ua=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Ua=new Float32Array(65536);for(let s=0;s<65536;s++)Ua[s]=Ka(s);class Cv{constructor(t){this.app=t,this.world=t.world,this.list=[],this.loaded=!1,this.cur=null,this.k=0,this.want=0,this.patchW=new Float32Array(64).fill(1),this.groupK=new Float32Array(mn),this.groupDepth=new Float32Array(mn),this.featK=new Float32Array(64),this.featSeen=new Float32Array(64),this.u=this.world.uniforms,this._frustum=new qi,this._m=new Kt,this._box=new cn,this.lastSeen=0,this.log=[]}patchWeights(){const t=this.cur;return t!=null&&t.lower?[...t.raise,...t.lower].map((e,n)=>({id:e.id,kind:e.kind,depth:e.depth,until:e.until,k:+this.patchW[n].toFixed(3)})):[]}async load(){var n;const t=await ev(this.app.data,this.app.warn),e=await((n=this.app.patches)==null?void 0:n.ready)||[];this.list=t,this.setPatches(e),this.loaded=!0}setPatches(t){const e=this.app.warn;for(const i of this.list)i.patches=iv(i,t,e);const n=new Set(this.world.islandPacks.map(i=>i.id));for(const i of t)!n.has(i.pack)&&!this.list.some(r=>r.id===i.pack)&&e(`patch ${i.id}: no pack or district ${i.pack} here; not drawn`);this.patchW.fill(1),this.cur&&this.drop()}districtAt(t,e,n=0){for(const i of this.list){const r=i.rect;if(t>r.x0-n&&t<r.x1+n&&e>r.z0-n&&e<r.z1+n)return i}return null}prefetch(t,e){const n=this.districtAt(t,e,20);return n&&(this.prefetchAt=performance.now(),this.stream(n)),n}readyAt(t,e){var i;const n=this.districtAt(t,e);return!!n&&((i=this.cur)==null?void 0:i.d)===n&&this.cur.state==="ready"}stream(t){var n;if(((n=this.cur)==null?void 0:n.d)===t)return;if(!this.world.terrains.get(t.parent)){this.pending=t;return}this.cur&&this.drop();const e={d:t,state:"loading",t0:performance.now()};this.cur=e,this.lastSeen=e.t0,this.decoder=this.decoder||new sv(this.app.warn),this.decoder.decode(t).then(i=>{this.cur===e&&this.arrive(e,i)}).catch(i=>{this.cur===e&&(this.app.warn(`district ${t.id}: ${i.message}`),e.state="failed")})}arrive(t,e){var c;const{d:n}=t;t.decodeMs=Math.round(performance.now()-t.t0),t.data=e,t.metres=e.metres,t.aux=e.aux,t.carve=e.carve;const i={id:n.id,name:n.name,rect:n.rect,W:n.W,H:n.H,rainUrl:n.rainUrl,data:{metres:e.metres,normals:e.normals,land:e.land,lo:e.lo,hi:e.hi}};t.pack=i;const r=this.world.terrains.get(n.parent);t.parUniforms={uParN:{value:(r==null?void 0:r.normalTex)??null},uParL:{value:(r==null?void 0:r.landTex)??null},uParS:{value:(r==null?void 0:r.shadow.texture)??null},uParRect:{value:r?r.rect:new $t(0,0,1,1)},uParSlot:{value:-1},uParRain:{value:(r==null?void 0:r.uniforms.uOwnRain.value)??1}};const o=new Pa(i,this.world,[this.world.arch,r].filter(Boolean),{vertexShader:Ig,fragmentShader:Ng,shadowFragment:Fg,shadowSize:512,uniforms:{...t.parUniforms,uDistN:{value:null},uDistL:{value:null},uDistS:{value:null}}});for(const h of[o.full,o.half]){const f=h.material.uniforms;f.uDistN.value=o.normalTex,f.uDistL.value=o.landTex,f.uDistS.value=o.shadow.texture}if(o.group.visible=!1,o.applyRange(((c=this.app.qset)==null?void 0:c.range)??4.6),this.app.params.get("debug"))for(const h of[o.full,o.half])h.material.uniforms.uDebug.value=Number(this.app.params.get("debug"));t.terrain=o,t.parent=r,this.world.group.add(o.group),t.heightTex=o.heightTex;const a=new Qe(e.aux,n.W,n.H,_e,ue);a.minFilter=a.magFilter=te,a.needsUpdate=!0;const l=new Qe(e.carve,n.W,n.H,Dc,Bn);if(l.minFilter=l.magFilter=te,l.needsUpdate=!0,t.auxTex=a,t.carveTex=l,t.pmap=e.patchMap,t.pmap){const h=t.pmap,f=new Qe(h.data,h.w,h.h,_e,ue);f.minFilter=f.magFilter=te,f.needsUpdate=!0,t.patchTex=f,t.patchBox=new $t(h.x0,h.y0,h.x0+h.w,h.y0+h.h)}t.lower=n.patches.filter(h=>h.kind==="lower"),t.raise=n.patches.filter(h=>h.kind==="raise"),t.uploads=[o.heightTex,a,l,o.normalTex,o.landTex,...t.patchTex?[t.patchTex]:[]],t.state="uploading",t.features=new Rv(this.app,this,t),this.app.scene.add(t.features.group),e.normals=e.land=null,e.trees={counts:e.trees.counts},e.streams=null,this.patchW.fill(1),this.yearWeights(1)}drop(){var e,n,i;const t=this.cur;t&&(this.off(),t.terrain&&(this.world.group.remove(t.terrain.group),t.terrain.dispose()),(e=t.auxTex)==null||e.dispose(),(n=t.carveTex)==null||n.dispose(),(i=t.patchTex)==null||i.dispose(),t.features&&(this.app.scene.remove(t.features.group),t.features.dispose()),this.cur=null,this.k=0)}off(){var e;const t=this.u;t.uDistInfo.value.set(0,0,Fe.margin,Fe.band),t.uDistH.value=this.world.dummy,t.uDistAux.value=this.world.dummyAux,t.uDistCarve.value=this.world.dummy,t.uDistPatch.value=this.world.dummyAux,t.uDistPatchBox.value.set(0,0,0,0),(e=this.cur)!=null&&e.terrain&&(this.cur.terrain.group.visible=!1),this.on=!1}yearWeights(t){var o,a;const e=this.cur,n=this.app.timeline.year,i=this.patchW;if(e!=null&&e.lower){[...e.raise,...e.lower].forEach((v,g)=>{const p=n<v.until?1:0;let u=i[g]+(p-i[g])*t;Math.abs(u-p)<.002&&(u=p),i[g]=u});const c=e.raise.length,h=this.u.uDistRaise.value;let f=-1e9;for(let v=0;v<mn;v++)h[v].set(v<c?i[v]:0,v<c?e.raise[v].depth:0,0,0),v<c&&i[v]>0&&(f=Math.max(f,e.raise[v].depth));this.u.uDistRaiseTop.value=f;const d=this.u.uDistLower.value,m=((o=e.pmap)==null?void 0:o.groups)||[0];for(let v=0;v<mn;v++){let g=0,p=-1;const u=m[v]||0;e.lower.forEach((x,_)=>{u&1<<_&&i[c+_]>g&&(g=i[c+_],p=x.depth)}),g===0&&u&&(p=((a=e.lower.find((x,_)=>u&1<<_))==null?void 0:a.depth)??-1),this.groupK[v]=g,this.groupDepth[v]=p,d[v].set(g,p,0,0)}}const r=this.u.uFeatK.value;if(e)for(const[l,c]of e.d.byIndex){const h=Ja(c.properties,n)?1:0;let f=this.featK[l]+(h-this.featK[l])*t;Math.abs(f-h)<.002&&(f=h),this.featK[l]=f;const d=n>=fh(c.properties)[0]?1:0;let m=this.featSeen[l]+(d-this.featSeen[l])*t;Math.abs(m-d)<.002&&(m=d),this.featSeen[l]=m,r[l>>2].setComponent(l&3,f)}}wantFor(t,e,n){var c,h;const i=t.rect,r=e.position,o=Math.max(i.x0-r.x,0,r.x-i.x1),a=Math.max(i.z0-r.z,0,r.z-i.z1),l=Math.hypot(o,a,Math.max(1,r.y));return this.dc=l,this._m.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this._box.min.set(i.x0,0,i.z0),this._box.max.set(i.x1,Math.max(1,(((h=(c=this.cur)==null?void 0:c.data)==null?void 0:h.hi)??1e3)*this.u.uVert.value),i.z1),this._frustum.intersectsBox(this._box)?ua(Fe.far,Fe.near,l)*(1-ua(Fe.rig[0],Fe.rig[1],n)):0}update(t,e,n){var v,g,p;if(!this.loaded||!this.list.length)return;if(this.pending&&this.world.terrains.get(this.pending.parent)){const u=this.pending;this.pending=null,this.stream(u)}const i=t.position;let r=null,o=1/0;for(const u of this.list){const x=u.rect,_=Math.hypot(Math.max(x.x0-i.x,0,i.x-x.x1),Math.max(x.z0-i.z,0,i.z-x.z1),Math.max(1,i.y));_<o&&(o=_,r=u)}r&&o<Fe.prefetch&&((v=this.cur)==null?void 0:v.d)!==r&&this.stream(r);const a=this.cur,l=1-Math.exp(-n*2.5);if(this.yearWeights(n>0?1-Math.exp(-n*Mc):1),!a)return;if(a.state==="uploading"){const u=a.uploads.shift();u&&this.app.renderer.initTexture(u),a.uploads.length||(a.state="ready",a.readyMs=Math.round(performance.now()-a.t0))}const c=a.parent,h=c&&c.slot>=0?c.k:0,f=a.state==="ready"?Math.min(this.wantFor(a.d,t,e),h):0;this.want=f,this.forceK!==null&&this.forceK!==void 0&&a.state==="ready"&&h>0?this.k=Math.min(this.forceK,h):(this.k+=(f-this.k)*l,Math.abs(f-this.k)<.004&&(this.k=f),this.k=Math.min(this.k,h));const d=a.state==="ready"&&h>0&&(this.k>0||f>0);d?this.switchOn(a):this.on&&this.off(),(d||this.k>0)&&(this.lastSeen=performance.now());const m=Math.max(this.lastSeen,(this.prefetchAt??-1e9)+Fe.hold*1e3);!d&&o>Fe.prefetch*1.2&&performance.now()-m>Fe.linger*1e3&&a.state!=="loading"&&this.drop(),this.cur&&((g=a.terrain)==null||g.update(t,this.on),(p=a.features)==null||p.update(n,this.on?this.k:0,e))}switchOn(t){const e=this.u,n=t.parent;e.uDistRect.value.copy(t.terrain.rect),e.uDistInfo.value.set(this.k,1,Fe.margin,Fe.band),e.uDistH.value=t.heightTex,e.uDistAux.value=t.auxTex,e.uDistCarve.value=t.carveTex,e.uDistPatch.value=t.patchTex||this.world.dummyAux,t.patchBox?e.uDistPatchBox.value.copy(t.patchBox):e.uDistPatchBox.value.set(0,0,0,0);const i=t.parUniforms;i.uParSlot.value=n.slot,i.uParN.value=n.normalTex,i.uParL.value=n.landTex,i.uParS.value=n.shadow.texture,this.on=!0}updateShadow(t,e,n,i){var r;this.on&&((r=this.cur)!=null&&r.terrain)&&this.cur.terrain.shadow.update(t,e,n,this.k,i)}settle(t,e){var o;this.yearWeights(1);const n=this.cur;if(!n||n.state!=="ready")return;const i=n.parent,r=i&&i.slot>=0?i.k:0;this.k=Math.min(this.wantFor(n.d,t,e),r),this.k>0?(this.switchOn(n),n.terrain.update(t,!0)):this.on&&this.off(),(o=n.features)==null||o.settle(this.k,e)}weightAt(t,e){if(!this.on)return 0;const n=this.cur.d.rect,i=Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e);return this.k*ua(Fe.band,Fe.margin,i)}patchAt(t,e){const n=this.cur.pmap;if(!n||t<n.x0||e<n.y0||t>=n.x0+n.w||e>=n.y0+n.h)return null;const i=((e-n.y0)*n.w+(t-n.x0))*4;return n.data.subarray(i,i+4)}texel(t,e){const n=this.cur,i=n.d.W,r=e*i+t;let o=n.metres[r];const a=n.aux,l=this.patchAt(t,e);if(l&&l[1]+l[3]>0){const f=this.u.uDistRaise.value,d=f[l[2]&15],m=f[l[2]>>4];o+=(Math.max(o,d.y)-o)*(l[1]/255)*d.x,o+=(Math.max(o,m.y)-o)*(l[3]/255)*m.x}const c=a[r*4];if(c){const f=l?l[0]:0;o=uh(o,c,this.groupK[f],Ua[n.carve[r*2]],this.groupDepth[f])}const h=a[r*4+3];if(h>0){const f=this.featK[h];h<pn.pond?o+=(hh(o,Ua[n.carve[r*2]],a[r*4+2])-o)*(a[r*4+1]/255)*f:h<pn.other&&(o+=(nh-o)*(a[r*4+1]/255)*f)}return o}metresAt(t,e){const{d:n}=this.cur,i=n.rect;let r=(t-i.x0)/(i.x1-i.x0)*n.W-.5,o=(e-i.z0)/(i.z1-i.z0)*n.H-.5;r=Math.max(0,Math.min(n.W-1.001,r)),o=Math.max(0,Math.min(n.H-1.001,o));const a=r|0,l=o|0,c=r-a,h=o-l,f=this.texel(a,l)+(this.texel(a+1,l)-this.texel(a,l))*c,d=this.texel(a,l+1)+(this.texel(a+1,l+1)-this.texel(a,l+1))*c;return f+(d-f)*h}blend(t,e,n){const i=this.weightAt(t,e);return i>0?n+(this.metresAt(t,e)-n)*i:n}rawAt(t,e){const{d:n}=this.cur,i=n.rect,r=Math.max(0,Math.min(n.W-1,Math.floor((t-i.x0)/(i.x1-i.x0)*n.W))),o=Math.max(0,Math.min(n.H-1,Math.floor((e-i.z0)/(i.z1-i.z0)*n.H)));return this.cur.metres[o*n.W+r]}stats(){var r,o;const t=this.cur;if(!t)return{district:null,loaded:this.loaded,count:this.list.length};const e=t.d.W*t.d.H,n=e*4+e*4+e*4+2*(e*4*4/3)+512*512+(t.pmap?t.pmap.w*t.pmap.h*4:0),i=t.metres?e*4+e*4+e*4:0;return{district:t.d.id,state:t.state,k:+this.k.toFixed(3),want:+this.want.toFixed(3),on:!!this.on,patches:this.patchWeights(),patchMap:t.pmap?{box:[t.pmap.x0,t.pmap.y0,t.pmap.w,t.pmap.h],groups:t.pmap.groups.length-1}:null,decodeMs:t.decodeMs??null,readyMs:t.readyMs??null,workerMs:((r=t.data)==null?void 0:r.ms)??null,gpuMB:+(n/1048576).toFixed(1),cpuMB:+(i/1048576).toFixed(1),nodes:t.terrain?t.terrain.full.count+t.terrain.half.count:0,features:((o=t.features)==null?void 0:o.stats())??null}}}const Pv=`
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,Lv=`
${Ne}
${Ss}
${He}
${Gn}
${Yi}
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
`;function Dv(s,t,e,n){const i=[0,0,0];for(let a=0;a<=n;a++){const l=s*Math.pow(t/s,a/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;i.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const r=[];for(let a=0;a<e;a++)r.push(0,1+(a+1)%e,1+a);for(let a=0;a<n;a++)for(let l=0;l<e;l++){const c=1+a*e+l,h=1+a*e+(l+1)%e,f=c+e,d=h+e;r.push(c,h,f,h,d,f)}const o=new Ie;return o.setAttribute("position",new he(i,3)),o.setIndex(r),o}class Uv{constructor(t,e){this.uniforms={...t.uniforms,...e,uCamPos:{value:new z},uWind:{value:new Lt(-.8,.45)},uSwellDir:{value:new Lt(-.6,.8)},uDebug:{value:0}},this.material=new de({vertexShader:Pv,fragmentShader:Lv,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new le(Dv(1,25e4,96,120),this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const Iv=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],Nv={ra:12.857,dec:27.13};function Fv(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}const En=Math.PI/180,os=21*En,er=29.530588,zv=224.1;function Ql(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),r=Math.sin(s)*Math.cos(os)-n*Math.cos(t)*Math.sin(os),o=Math.sin(s)*Math.sin(os)+n*Math.cos(t)*Math.cos(os);return e.set(i,o,-r)}function kv(s,t,e={}){const n=23.44*En*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*En,o=((s-80)/365.25*24%24+24)%24+t-12;e.sun=Ql(n,(t-12)*15*En,e.sun||new z);const a=s+t/24,l=((a-zv)%er+er)%er,c=l/er,h=i+c*2*Math.PI,f=Math.asin(Math.sin(23.44*En)*Math.sin(h)+Math.sin(5.1*En)*Math.sin(a*.23)),d=h/(2*Math.PI)*24;return e.moon=Ql(f,(o-d)*15*En,e.moon||new z),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=o,e.decl=n,e}const ph=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],mh=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],Ov=1.6110731556870734,Bv=1.5;function Hv(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((Ov-Math.acos(s))/Bv)))}function fa(s,t,e,n=[0,0,0]){const i=Hv(t.y),r=.2*e.turbidity*1e-17,o=Math.acos(Math.max(0,s.y)),a=1/(Math.cos(o)+.15*Math.pow(93.885-o*180/Math.PI,-1.253)),l=8400*a,c=1250*a,h=s.x*t.x+s.y*t.y+s.z*t.z,f=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),d=e.mieDirectionalG,m=d*d,v=1/(4*Math.PI)*((1-m)/Math.pow(1-2*d*h+m,1.5)),g=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let p=0;p<3;p++){const u=ph[p]*e.rayleigh,x=.434*r*mh[p]*e.mieCoefficient,_=Math.exp(-(u*l+x*c)),y=(u*f+x*v)/(u+x);let S=Math.pow(i*y*(1-_),1.5);S*=1+(Math.pow(i*y*_,.5)-1)*g;const E=.1*_,T=(S+E)*.04+[0,3e-4,75e-5][p];n[p]=Math.pow(T,1/2.4)}return n}function Gv(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),r=.2*t.turbidity*1e-17;for(let o=0;o<3;o++){const a=ph[o]*t.rayleigh,l=.434*r*mh[o]*t.mieCoefficient;e[o]=Math.exp(-(a*8400*i+l*1250*i))}return e}const Vv=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,gh=`
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
`,Wv=`
${gh}
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
`,$v=`
${gh}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,Xv=`
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
`,qv=`
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
`;class jv{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=Nv,e=(c,h)=>{const f=c/24*2*Math.PI,d=h*En;return new z(Math.cos(d)*Math.cos(f),Math.cos(d)*Math.sin(f),Math.sin(d))};this.uniforms={uSun:{value:new z(0,1,0)},uMoon:{value:new z(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:os},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new le(new qa(1,5),new de({vertexShader:Vv,fragmentShader:Wv,uniforms:this.uniforms,side:Ue,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=Fv(4242),r=Iv.map(([c,h,f])=>[c/24*2*Math.PI,h*En,f]);for(let c=0;c<2600;c++){const h=i()*2-1;r.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const o=new Float32Array(r.length*3);r.forEach((c,h)=>o.set(c,h*3));const a=new Ie;a.setAttribute("aStar",new fe(o,3)),a.setAttribute("position",new fe(new Float32Array(r.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new fg(a,new de({vertexShader:Xv,fragmentShader:qv,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:_a})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new ke,this.group.add(n,this.stars),this.mapRT=new gn(256,128,{type:Bn,depthBuffer:!1}),this.mapRT.texture.wrapS=cr,this.mapScene=new Ar;const l=new le(Ya(),new de({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:$v,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new br(-1,1,1,-1,0,1),this.astro={},this._v=new z}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const r=kv(t,e,this.astro),o=r.sun,a=this.uniforms;a.uSun.value.copy(o),a.uMoon.value.copy(r.moon),a.uPhase.value=r.phase,a.uIllum.value=r.illum,a.uLst.value=r.lst/24*2*Math.PI;const l=Ce.smoothstep(-o.y,-.02,.2);a.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,f=fa(h.set(0,1,0),o,c),d=[0,0,0];for(let E=0;E<8;E++){const T=E/8*Math.PI*2,U=fa(h.set(Math.cos(T),.08,Math.sin(T)).normalize(),o,c);for(let M=0;M<3;M++)d[M]+=U[M]/8}const m=fa(h.set(o.x,.05,o.z).normalize(),o,c),v=Gv(o,c),g=Ce.smoothstep(o.y,-.04,.06),p=3.2;i.sunColor.setRGB(v[0]*p*g,v[1]*p*g,v[2]*p*g);const u=[.0035,.005,.011],_=Ce.smoothstep(r.moon.y,-.02,.1)*r.illum*l;i.skyColor.setRGB(f[0]*.55+d[0]*.45+u[0]+.012*_,f[1]*.55+d[1]*.45+u[1]+.016*_,f[2]*.55+d[2]*.45+u[2]+.024*_);const y=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Tt(y,y,y),.35),i.zenith.setRGB(f[0],f[1],f[2]),i.horizon.setRGB(d[0]+u[0],d[1]+u[1],d[2]+u[2]),i.sunHorizon.setRGB(m[0],m[1],m[2]);const S=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,o.y)+i.skyColor.r)*S*1.1,(i.sunColor.g*Math.max(0,o.y)+i.skyColor.g)*S,(i.sunColor.b*Math.max(0,o.y)+i.skyColor.b)*S*.8),i.moonColor.setRGB(.05*_,.06*_,.085*_),i.moonDir.copy(r.moon),i.sunDir.copy(o),i.night=l,r}}const gs=Math.PI*2,da=.4,Yv=.18,tc=(s,t,e,n)=>e>0?s+(t-s)*(1-Math.exp(-e/n)):t,Kv=(s,t,e)=>(s+t+Math.sqrt((s-t)*(s-t)+e*e))/2,Zv=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,ec=s=>((s+Math.PI)%gs+gs)%gs-Math.PI,Jv=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};function Qn(s){return .6+.52*Jv(Math.log(40),Math.log(4500),Math.log(Math.max(1,s)))}class Qv{constructor(t,e,n){this.camera=t,this.dom=e,this.world=n,this.home=this.homeView();const i=this.home;this.state={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.goal={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.flight=null,this.floor=0,this.groundM=0,this.pinned=!0,this._lastXZ=new Lt(i.target.x,i.target.z),this.minDistance=Ch,this.maxDistance=ao,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new dg,this._v=new z,this.bind()}homeView(t=innerWidth/Math.max(1,innerHeight)){const e=this.world.bounds,n=e.x1-e.x0,i=Math.tan(this.camera.fov*Math.PI/360),r=t<.85,o=r?1.2*Math.hypot(n,e.z1-e.z0)*.92/(2*i):1.2*n/(2*i*Math.max(1,t)),a=Math.min(ao,o);return{target:new z((e.x0+e.x1)/2,0,(e.z0+e.z1)/2+(r?0:(e.z1-e.z0)*.04)),distance:a,yaw:r?1.1:0,pitch:Qn(a)}}bind(){const t=this.dom,e=new Map;let n=null,i=null,r=null;t.addEventListener("contextmenu",a=>a.preventDefault()),t.addEventListener("pointerdown",a=>{this.enabled&&(t.setPointerCapture(a.pointerId),e.set(a.pointerId,{x:a.clientX,y:a.clientY}),e.size===1?(n=a.button===2||a.shiftKey||a.ctrlKey||a.metaKey||a.altKey?"orbit":"pan",i={x:a.clientX,y:a.clientY}):e.size===2&&(n="pinch",r=this.pinchState(e)))}),t.addEventListener("pointermove",a=>{if(e.has(a.pointerId)){if(e.set(a.pointerId,{x:a.clientX,y:a.clientY}),n==="orbit"&&i){const l=a.clientX-i.x,c=a.clientY-i.y;this.goal.yaw-=l*.005,this.goal.pitch=Ce.clamp(this.goal.pitch+c*.004,.06,1.52),i={x:a.clientX,y:a.clientY},this.touch()}else if(n==="pan"&&i){const l=a.clientX-i.x,c=a.clientY-i.y;(l||c)&&(this.panBy(l,c),this.touch()),i={x:a.clientX,y:a.clientY}}else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=r.dist/Math.max(20,l.dist);this.zoomAt(l.cx,l.cy,c),this.panBy(l.cx-r.cx,l.cy-r.cy),this.goal.yaw-=ec(l.angle-r.angle),r=l,this.touch()}}});const o=a=>{if(e.delete(a.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="pan",i={...l}}};t.addEventListener("pointerup",o),t.addEventListener("pointercancel",o),t.addEventListener("wheel",a=>{if(!this.enabled)return;a.preventDefault();const l=a.deltaMode===1?a.deltaY*30:a.deltaY,c=Math.exp(Math.sign(l)*Math.min(Math.abs(l),150)*.0022);this.zoomAt(a.clientX,a.clientY,c),this.touch()},{passive:!1}),t.addEventListener("dblclick",a=>{const l=this.pickGround(a.clientX,a.clientY);if(l){const c=Math.max(this.minDistance,this.goal.distance*.35);this.flyTo({target:l,distance:c,pitch:this.goal.pitch+Qn(c)-Qn(this.goal.distance)},1.8)}}),addEventListener("keydown",a=>{var d,m;if(!this.enabled||(m=(d=a.target).closest)!=null&&m.call(d,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[a.code];if(c&&!a.altKey){const v=Math.sin(this.goal.yaw),g=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*g+c[1]*v)*l,this.goal.target.z+=(-c[0]*v+c[1]*g)*l,this.touch()}a.code==="KeyQ"&&(this.goal.yaw+=.12),a.code==="KeyE"&&(this.goal.yaw-=.12);const h=innerWidth/2,f=innerHeight/2;(a.code==="Equal"||a.code==="NumpadAdd")&&this.zoomAt(h,f,.8),(a.code==="Minus"||a.code==="NumpadSubtract")&&this.zoomAt(h,f,1.25)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,r=Math.sin(this.goal.yaw),o=Math.cos(this.goal.yaw),a=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*o-e*r*a)*i,this.goal.target.z+=(t*r-e*o*a)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),r=this.goal.distance,o=Ce.clamp(r*n,this.minDistance,this.maxDistance);if(i){const a=1-o/r;this.goal.target.x+=(i.x-this.goal.target.x)*a,this.goal.target.z+=(i.z-this.goal.target.z)*a}this.goal.pitch=Ce.clamp(this.goal.pitch+Qn(o)-Qn(r),.06,1.52),this.goal.distance=o}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Lt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e){const n=this.world,i=n.maxY+.05;if(e.y>=0&&t.y>i)return null;const r=e.y<0?t.y/-e.y:4e5;let o=t.y>i&&e.y<0?(t.y-i)/-e.y:0;const a=Math.min(r,4e5),l=this._v;let c=o;for(let h=0;h<700&&o<=a+.001;h++){l.copy(t).addScaledVector(e,o);const f=l.y-n.heightAt(l.x,l.z);if(f<0){let d=c,m=o;for(let v=0;v<24;v++){const g=(d+m)/2;l.copy(t).addScaledVector(e,g),l.y-n.heightAt(l.x,l.z)<0?m=g:d=g}return l.clone()}c=o,o+=Math.max(.02,f*.45,o*.0015)}return r<4e5?t.clone().addScaledVector(e,r).setY(0):null}fit({rect:t,distance:e,yaw:n=this.goal.yaw,tilt:i=0,pitch:r,box:o,pad:a=1.06}){const l=this._fitCam||(this._fitCam=new Xe);l.fov=this.camera.fov,l.aspect=this.camera.aspect,l.near=.1,l.far=1e6,l.updateProjectionMatrix();const c=innerWidth,h=innerHeight,f=o||{x0:0,y0:0,x1:c,y1:h},d=Math.max(60,f.x1-f.x0),m=Math.max(60,f.y1-f.y0),v=Math.tan(l.fov*Math.PI/360),g=Math.cos(n),p=Math.sin(n);let u=(t.x0+t.x1)/2,x=(t.z0+t.z1)/2;const _=e!==void 0;let y=_?e:Math.max(t.x1-t.x0,t.z1-t.z0)/(2*v)*(h/m),S=0;const E=this._v;for(let T=0;T<8;T++){y=Ce.clamp(y,this.minDistance,this.maxDistance),S=Ce.clamp(r??Qn(y)+i,.06,1.52);const U=Math.cos(S),M=_?this.world.heightAt(u,x):0;l.position.set(u+y*U*p,M+y*Math.sin(S),x+y*U*g),l.lookAt(u,M,x),l.updateMatrixWorld();let w=1/0,L=1/0,C=-1/0,k=-1/0;for(let j=0;j<4;j++){E.set(j&1?t.x1:t.x0,M,j&2?t.z1:t.z0).project(l);const G=(E.x+1)/2*c,Z=(1-E.y)/2*h;w=Math.min(w,G),C=Math.max(C,G),L=Math.min(L,Z),k=Math.max(k,Z)}_||(y*=Ce.clamp(Math.max((C-w)*a/d,(k-L)*a/m),.3,3));const P=2*y*v/h,F=((w+C)/2-(f.x0+f.x1)/2)*P,B=((L+k)/2-(f.y0+f.y1)/2)*P/Math.max(.35,Math.sin(S));u+=F*g+B*p,x+=-F*p+B*g}return{target:new z(u,this.world.heightAt(u,x),x),distance:y,yaw:n,pitch:S}}groundAt(t,e){return Math.max(0,this.world.metresAt(t,e))}smoothGround(t,e,n){const i=Yv*n;let r=2*this.groundAt(t,e),o=2;for(let a=0;a<6;a++){const l=a/6*gs,c=l+gs/12;r+=this.groundAt(t+Math.cos(l)*i*.5,e+Math.sin(l)*i*.5),r+=this.groundAt(t+Math.cos(c)*i,e+Math.sin(c)*i),o+=2}return r/o}pin(){const t=this.goal.target;this.groundM=this.groundAt(t.x,t.z),this.pinned=!0,this._lastXZ.set(t.x,t.z);const e=this.groundM*this.world.uniforms.uVert.value;t.y=e,this.state.target.y=e}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift,groundM:this.groundM},r={target:t.target?t.target.clone():i.target.clone(),distance:Ce.clamp(t.distance??i.distance,this.minDistance,this.maxDistance),yaw:t.yaw??i.yaw,pitch:Ce.clamp(t.pitch??i.pitch,.06,1.52),lift:t.lift??0};r.yaw=i.yaw+ec(r.yaw-i.yaw);const o=Math.hypot(i.target.x-r.target.x,i.target.z-r.target.z),a=n.hop??Math.max(0,o*.9-Math.max(i.distance,r.distance)*.6);this.flight={from:i,dest:r,t:0,duration:e,hop:a,onDone:n.onDone,ready:n.ready,held:0}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,this.pin(),(e=t.onDone)==null||e.call(t),this.apply()}jump({x:t,z:e,distance:n,yaw:i,pitch:r}){this.flight=null;for(const o of[this.goal,this.state])t!==void 0&&o.target.set(t,this.world.heightAt(t,e),e),n!==void 0&&(o.distance=n),i!==void 0&&(o.yaw=i),r!==void 0&&(o.pitch=r),o.lift=0;this.pin(),this.apply()}update(t){var a;const e=this.goal;if(this.flight){const l=this.flight;let c=t/l.duration;l.ready&&l.t>.8&&l.held<6&&!l.ready()&&(l.held+=t,c*=.08),l.t=Math.min(1,l.t+c);const h=Zv(l.t);e.target.lerpVectors(l.from.target,l.dest.target,h);const f=Math.log(l.from.distance)*(1-h)+Math.log(l.dest.distance)*h;e.distance=Math.exp(f)+l.hop*Math.sin(Math.PI*h),e.yaw=l.from.yaw+(l.dest.yaw-l.from.yaw)*h,e.pitch=l.from.pitch+(l.dest.pitch-l.from.pitch)*h+.2*Math.sin(Math.PI*h)*Math.min(1,l.hop/300),e.pitch=Math.min(1.52,e.pitch),e.lift=l.from.lift+(l.dest.lift-l.from.lift)*h,this.groundM=l.from.groundM+(this.groundAt(l.dest.target.x,l.dest.target.z)-l.from.groundM)*h,l.t>=1&&(this.flight=null,this.pin(),(a=l.onDone)==null||a.call(l))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);const n=this.world.bounds,i=150;e.target.x=Ce.clamp(e.target.x,n.x0-i,n.x1+i),e.target.z=Ce.clamp(e.target.z,n.z0-i,n.z1+i),this.flight||(Math.abs(e.target.x-this._lastXZ.x)+Math.abs(e.target.z-this._lastXZ.y)>1e-7&&(this.pinned=!1),this._lastXZ.set(e.target.x,e.target.z),this.pinned||(this.groundM=tc(this.groundM,this.smoothGround(e.target.x,e.target.z,e.distance),t,da))),e.target.y=this.groundM*this.world.uniforms.uVert.value;const r=this.state,o=this.flight?1:1-Math.exp(-t*7);r.target.lerp(e.target,o),r.distance=Math.exp(Math.log(r.distance)+(Math.log(e.distance)-Math.log(r.distance))*o),r.yaw+=(e.yaw-r.yaw)*o,r.pitch+=(e.pitch-r.pitch)*o,r.lift+=(e.lift-r.lift)*o,this.apply(t)}groundAhead(t,e,n){const i=this.world;let r=i.heightAt(t,e);const o=this._prevXZ;if(o&&n>0){const a=(t-o.x)/n,l=(e-o.y)/n,c=Math.hypot(a,l),h=Math.min(20,c*.3);h>.005&&(r=Math.max(r,i.heightAt(t+a/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new Lt).set(t,e),r}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const r=.12+e.distance*.03,o=this.groundAhead(n.position.x,n.position.z,t),a=Math.max(0,o+r-n.position.y);this.floor=tc(this.floor,a,t,a>this.floor?da/3:da*2),n.position.y+=this.floor;const l=this.world.heightAt(n.position.x,n.position.z),c=Math.min(.04,r*.3);n.position.y=Kv(n.position.y,l+c,c),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const h=n.position.y-l;n.near=Ce.clamp(Math.min(h,e.distance)*.12,.02,300),n.far=Ce.clamp(e.distance*30+h*60,8e3,3e5),n.updateProjectionMatrix(),n.updateMatrixWorld()}}const tx=1.5,ex=`
${Ne}
${He}
${Gn}
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
`,nx=`
uniform vec3 uColor;
uniform float uOpacity;
in float vFade;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vFade);
}
`;function ix(s){return s?s.type==="Polygon"?s.coordinates:s.type==="MultiPolygon"?s.coordinates.flat():s.type==="LineString"?[s.coordinates]:s.type==="MultiLineString"?s.coordinates:[]:[]}function sx(s,t){var r;const e=new Map,n=new Set,i=o=>Math.round(o*1e6);for(const o of(s==null?void 0:s.features)||[]){const a=rr((r=o.properties)==null?void 0:r.island)||"other";let l=e.get(a);l||e.set(a,l=[]);for(const c of ix(o.geometry))for(let h=0;h+1<c.length;h++){const f=c[h],d=c[h+1],m=`${i(f[0])},${i(f[1])}`,v=`${i(d[0])},${i(d[1])}`;if(m===v)continue;const g=m<v?`${m}|${v}`:`${v}|${m}`;if(n.has(g))continue;n.add(g);const[p,u]=t.toWorld(f),[x,_]=t.toWorld(d),y=Math.max(1,Math.ceil(Math.hypot(x-p,_-u)/tx));for(let S=0;S<y;S++){const E=S/y,T=(S+1)/y;l.push(p+(x-p)*E,u+(_-u)*E,p+(x-p)*T,u+(_-u)*T)}}}return e}class nc{constructor(t,e,n,{color:i,width:r,order:o}){this.group=new ke,this.uniforms={...n,uResolution:{value:new Lt(1,1)},uWidth:{value:r},uCamPos:{value:new z},uColor:{value:new Tt(...i)},uOpacity:{value:1}},this.material=new de({vertexShader:ex,fragmentShader:nx,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});const a=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);this.count=0;for(const[,l]of sx(t,e)){if(!l.length)continue;const c=new ws;c.setAttribute("position",new fe(a,3)),c.setIndex([0,2,1,1,2,3]);const h=new Float32Array(l);c.setAttribute("aSeg",new qe(h,4)),c.instanceCount=h.length/4,this.count+=c.instanceCount;let f=1/0,d=-1/0,m=1/0,v=-1/0;for(let u=0;u<h.length;u+=2)f=Math.min(f,h[u]),d=Math.max(d,h[u]),m=Math.min(m,h[u+1]),v=Math.max(v,h[u+1]);const g=new z((f+d)/2,60,(m+v)/2);c.boundingSphere=new Hn(g,Math.hypot(d-f,v-m,300)/2+10);const p=new le(c,this.material);p.renderOrder=o,this.group.add(p)}}update(t,e,n){this.uniforms.uResolution.value.copy(e),this.uniforms.uCamPos.value.copy(t.position),this.uniforms.uOpacity.value=n,this.group.visible=n>.01&&this.count>0}}class rx{constructor(t,e){this.group=new ke,this.moku=new nc(t.moku,t.proj,e,{color:[1.5,1.08,.52],width:2.2,order:3}),this.ahupuaa=new nc(t.ahupuaa,t.proj,e,{color:[1.25,1.2,1.06],width:1.3,order:2}),this.group.add(this.ahupuaa.group,this.moku.group),this.visible=!0,this._res=new Lt}update(t,e,n,i=1){e.getDrawingBufferSize(this._res);const r=e.getPixelRatio(),o=this.visible?1:0,a=(l,c,h)=>{const f=Math.max(0,Math.min(1,(h-l)/(c-l)));return f*f*(3-2*f)};this.moku.uniforms.uWidth.value=(1.3+1.1*(1-a(800,4e3,n)))*r,this.ahupuaa.uniforms.uWidth.value=1.25*r,this.moku.uniforms.uColor.value.setRGB(1.5*i,1.08*i,.52*i),this.ahupuaa.uniforms.uColor.value.setRGB(1.25*i,1.2*i,1.06*i),this.moku.update(t,this._res,o*(.55+.4*(1-a(1500,6e3,n)))),this.ahupuaa.update(t,this._res,o*.75*(1-a(220,650,n)))}}const ax=4,ic=[300,1e3],sc=[.4,.7],ox=9,rc={voyage:[1.38,1.18,.86],fleet:[1.6,.9,.52],ship:[1,1.1,1.26],trade:[1.15,1.1,.96],schematic:[1.25,1.18,1.02]},ac={journal:{width:2,opacity:.92,pulse:1},narrative:{width:1.7,opacity:.82,pulse:.9},schematic:{width:1.4,opacity:.62,pulse:.45}},lx={day:0,month:0,year:0,decade:5,generation:12,century:50},pa=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},cx=`
${Ne}
${He}
${Gn}
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
`,hx=`
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
`;function ux(s){const t=s.when||{},e=(o,a)=>{const l=String(o??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!l)return null;const c=Number(l[1]);return l[2]?c+(Number(l[2])-1+(a?1:0))/12:c+(a?1:0)};let n=e(t.from,!1),i=e(t.to??t.from,!0);if(n===null&&i===null)return null;n===null&&(n=i-1),i===null&&(i=n+1);const r=lx[t.precision]??0;return r&&i-n<=1.01&&(n-=r,i+=r),[n,i]}async function fx(s,t=console.warn){const e=s!=null&&s.abs?s.abs("routes.json"):new URL("routes.json",new URL((s==null?void 0:s.base)||"./data/",location.href)).href;try{const n=await fetch(e);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json();return Array.isArray(i)?i:Array.isArray(i==null?void 0:i.routes)?i.routes:[]}catch(n){return t(`${e}: ${n.message} (no routes)`),[]}}class dx{constructor(t,e,n){this.route=t,this.span=ux(t);const i=ac[t.pointPrecision]?t.pointPrecision:"schematic";this.style=ac[i],this.ret=t.direction==="return";const r=i==="schematic",o=new Set(t.schematicSegments||[]),a=(t.points||[]).map(_=>e.toWorld(_)),l=[],c=[];let h=0;for(let _=0;_+1<a.length;_++){const[y,S]=a[_],[E,T]=a[_+1],U=Math.hypot(E-y,T-S),M=Math.max(1,Math.ceil(U/ax)),w=r||o.has(_)?1:0;for(let L=0;L<M;L++){const C=L/M,k=(L+1)/M;l.push(y+(E-y)*C,S+(T-S)*C,y+(E-y)*k,S+(T-S)*k),c.push(h+U*C,h+U*k,w,0)}h+=U}this.total=h;const f=(_,y,S)=>{l.push(_[0],_[1],y[0],y[1]),c.push(S,S,0,1)};a.length>=2&&(f(a.at(-2),a.at(-1),h),this.ret&&f(a[1],a[0],0));const d=new ws;d.setAttribute("position",new fe(new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),3)),d.setIndex([0,2,1,1,2,3]);const m=new Float32Array(l);d.setAttribute("aSeg",new qe(m,4)),d.setAttribute("aInfo",new qe(new Float32Array(c),4)),d.instanceCount=m.length/4;let v=1/0,g=-1/0,p=1/0,u=-1/0;for(const[_,y]of a)v=Math.min(v,_),g=Math.max(g,_),p=Math.min(p,y),u=Math.max(u,y);d.boundingSphere=new Hn(new z((v+g)/2,60,(p+u)/2),Math.hypot(g-v,u-p,300)/2+20),this.geometry=d;const x=rc[t.kind]||rc.schematic;this.colour=x,this.uniforms={...n,uResolution:{value:new Lt(1,1)},uWidth:{value:this.style.width},uHead:{value:9},uCamPos:{value:new z},uColor:{value:new Tt(...x)},uOpacity:{value:0},uDashLen:{value:30},uMarch:{value:0},uPulse:{value:-1e6},uPulseLen:{value:60},uPulseK:{value:this.style.pulse}},this.material=new de({vertexShader:cx,fragmentShader:hx,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),this.mesh=new le(d,this.material),this.mesh.renderOrder=4,this.mesh.visible=!1,this.k=0,this.phase=px(t.id||"")%1e3/1e3}dispose(){this.geometry.dispose(),this.material.dispose()}}function px(s){let t=2166136261;for(let e=0;e<s.length;e++)t=Math.imul(t^s.charCodeAt(e),16777619);return t>>>0}class mx{constructor({routes:t=[],proj:e,uniforms:n,camera:i,renderer:r,eras:o=[]}){this.proj=e,this.shared=n,this.camera=i,this.renderer=r,this.eras=[...o].filter(a=>Number.isFinite(a.year)).sort((a,l)=>a.year-l.year),this.group=new ke,this.group.name="routes",this.lines=[],this.visible=!0,this._res=new Lt,this._last=null,this.setRoutes(t)}setRoutes(t){for(const e of this.lines)this.group.remove(e.mesh),e.dispose();this.lines=[];for(const e of t||[]){if(!Array.isArray(e.points)||e.points.length<2)continue;const n=new dx(e,this.proj,this.shared);n.span&&(this.lines.push(n),this.group.add(n.mesh))}}windowAt(t){const e=this.eras;if(e.length<2)return[t-10,t+10];const n=r=>{if(r<=0)return e[0].year+r*(e[1].year-e[0].year);const o=e.length-1;if(r>=o)return e[o].year+(r-o)*(e[o].year-e[o-1].year);const a=Math.floor(r);return e[a].year+(r-a)*(e[a+1].year-e[a].year)};let i=0;if(t>=e.at(-1).year)i=e.length-1;else if(t>e[0].year){for(let r=0;r+1<e.length;r++)if(t<=e[r+1].year){i=r+(t-e[r].year)/Math.max(1e-6,e[r+1].year-e[r].year);break}}return[n(i-.5),n(i+.5)]}visibleRoutes(){return this.lines.filter(t=>t.k>.5&&t.mesh.visible).map(t=>t.route)}update(t,e,{window:n,light:i=1,fill:r=0,focus:o=null}={}){const a=performance.now()/1e3,l=this._last===null?1:Math.max(0,Math.min(.1,a-this._last));this._last=a,this.apply(t,e,{win:n,light:i,fill:r,focus:o},a,1-Math.exp(-l*4))}settle(t,e,{window:n,light:i=1,fill:r=0,focus:o=null}={}){this.apply(t,e,{win:n,light:i,fill:r,focus:o},performance.now()/1e3,1)}apply(t,e,{win:n,light:i,fill:r,focus:o},a,l){const[c,h]=n||this.windowAt(t);this.renderer.getDrawingBufferSize(this._res);const f=this.renderer.getPixelRatio(),d=this.visible?pa(ic[0],ic[1],e):0,m=1-pa(sc[0],sc[1],r),v=1-pa(800,4e3,e);for(const g of this.lines){const[p,u]=g.span,x=u>=c&&p<=h?1:0;g.k+=(x-g.k)*l,Math.abs(x-g.k)<.003&&(g.k=x);const _=t>=p&&t<=u?1:.55,y=o!==null&&g.route.event===o,S=g.style.opacity*g.k*d*(y?1:m)*_;if(g.mesh.visible=S>.01,!g.mesh.visible)continue;const E=g.uniforms;E.uResolution.value.copy(this._res),E.uCamPos.value.copy(this.camera.position),E.uWidth.value=(g.style.width+.6*v)*f,E.uHead.value=(8+3*v)*f,E.uOpacity.value=S,E.uColor.value.setRGB(g.colour[0]*i,g.colour[1]*i,g.colour[2]*i),E.uDashLen.value=e*.016,E.uPulseLen.value=Math.min(g.total*.12,e*.035);const T=(a/ox+g.phase)%1;E.uPulse.value=g.ret?(T<.5?T*2:2-T*2)*g.total:T*g.total,E.uMarch.value=g.ret?0:a*e*.012%(e*.016)}}dispose(){for(const t of this.lines)t.dispose();this.lines=[],this.group.clear()}}const nr=s=>String(s||"").normalize("NFD").replace(/[̀-ͯʻʼ'‘’]/g,"").toLowerCase();function gx(s,t,e,n,i,r){const o=t/(n.x1-n.x0),a=e/(n.z1-n.z0),l=[];let c=1/0,h=-1/0;for(const g of i)for(let p=0;p+1<g.length;p++){const u=(g[p][0]-n.x0)*o,x=(g[p][1]-n.z0)*a,_=(g[p+1][0]-n.x0)*o,y=(g[p+1][1]-n.z0)*a;x!==y&&(l.push(x<y?[x,u,y,_]:[y,_,x,u]),c=Math.min(c,x,y),h=Math.max(h,x,y))}if(!l.length)return;l.sort((g,p)=>g[0]-p[0]);const f=[],d=Math.max(0,Math.floor(c)),m=Math.min(e-1,Math.ceil(h));let v=0;for(let g=d;g<=m;g++){const p=g+.5;for(f.length=0;v<l.length&&l[v][2]<=p&&l[v][0]<=p;)v++;for(let x=v;x<l.length;x++){const _=l[x];if(_[0]>p)break;_[2]<=p||f.push(_[1]+(p-_[0])/(_[2]-_[0])*(_[3]-_[1]))}f.sort((x,_)=>x-_);const u=g*t;for(let x=0;x+1<f.length;x+=2){const _=Math.max(0,Math.ceil(f[x]-.5)),y=Math.min(t-1,Math.floor(f[x+1]-.5));for(let S=_;S<=y;S++)s[u+S]=r}}}class vx{constructor(t,e,n,i=console.warn){var f,d;this.data=t,this.rect=e,this.uniforms=n,this.polities=new Map((t.polities.polities||[]).map(m=>[m.id,m]));const r=(((f=t.moku)==null?void 0:f.features)||[]).slice(0,255);(((d=t.moku)==null?void 0:d.features)||[]).length>255&&i("more than 255 moku: the overlay shows the first 255");const o=e.x1-e.x0,a=e.z1-e.z0,l=Math.min(4096,Math.ceil(Math.max(o,a)/1.5));this.W=Math.round(o>=a?l:l*o/a),this.H=Math.round(o>=a?l*a/o:l),this.grid=new Uint8Array(this.W*this.H),this.mokus=[null],r.forEach((m,v)=>{const g=m.properties||{},p=g.name??g.moku??"",u=g.islandId||rr(g.island),x=m.geometry,_=(x==null?void 0:x.type)==="Polygon"?[x.coordinates]:(x==null?void 0:x.type)==="MultiPolygon"?x.coordinates:[];for(const y of _)gx(this.grid,this.W,this.H,e,y.map(S=>S.map(E=>t.proj.toWorld(E))),v+1);this.mokus.push({index:v+1,name:p,island:g.island,islandKey:u,key:g.mokuKey||`${u}:${p}`,props:g})}),this.loose=new Map(this.mokus.slice(1).map(m=>[`${m.islandKey}:${nr(m.name)}`,m])),this.checkKeys(i);const c=new Qe(this.grid,this.W,this.H,Vi,ue);c.minFilter=te,c.magFilter=te,c.unpackAlignment=1,c.needsUpdate=!0,this.idTex=c,this.palette=new Uint8Array(256*2*4);const h=new Qe(this.palette,256,2,_e,ue);h.minFilter=te,h.magFilter=te,h.needsUpdate=!0,this.palTex=h,n.uMokuId.value=c,n.uMokuRect.value.set(e.x0,e.z0,e.x1,e.z1),n.uPalette.value=h,this.eraKeys=[null,null]}checkKeys(t){const e=new Set(this.mokus.slice(1).map(i=>i.key)),n=new Set;for(const[i,r]of Object.entries(this.data.polities.byEra||{}))for(const o of Object.keys(r)){if(e.has(o))continue;const[a,...l]=o.split(":"),c=this.loose.get(`${rr(a)}:${nr(l.join(":"))}`);n.add(c?`${o} (${i}; the boundary file spells it "${c.name}")`:`${o} (${i})`)}n.size&&t(`polities.json names moku the boundary file doesn't have: ${[...n].slice(0,12).join(", ")}${n.size>12?", …":""}`)}holder(t,e){var r;const n=t?(r=this.data.polities.byEra)==null?void 0:r[t.id]:null;if(!n)return null;let i=n[e.key];if(i===void 0)for(const[o,a]of Object.entries(n)){const[l,...c]=o.split(":");if(rr(l)===e.islandKey&&nr(c.join(":"))===nr(e.name)){i=a;break}}return i?this.polities.get(i)||{id:i,name:i,colour:"#cccccc"}:null}setEras(t,e,n){const i=(t==null?void 0:t.id)??null,r=(e==null?void 0:e.id)??null;if(i!==this.eraKeys[0]||r!==this.eraKeys[1]){this.eraKeys=[i,r];const a=new Tt;this.palette.fill(0);for(const[l,c]of[[0,t],[1,e]])for(const h of this.mokus.slice(1)){const f=this.holder(c,h);if(!f)continue;a.set(f.colour||"#cccccc");const d=(l*256+h.index)*4;this.palette[d]=Math.round(a.r*255),this.palette[d+1]=Math.round(a.g*255),this.palette[d+2]=Math.round(a.b*255),this.palette[d+3]=255}this.palTex.needsUpdate=!0}const o=Math.max(0,Math.min(1,(n-.35)/.3));this.uniforms.uEraMix.value=t===e?0:o*o*(3-2*o)}mokuAt(t,e){const n=this.rect,i=Math.floor((t-n.x0)/(n.x1-n.x0)*this.W),r=Math.floor((e-n.z0)/(n.z1-n.z0)*this.H);return i<0||r<0||i>=this.W||r>=this.H?null:this.mokus[this.grid[r*this.W+i]]||null}politiesIn(t){const e=new Map;for(const n of this.mokus.slice(1)){const i=this.holder(t,n);i&&e.set(i.id,i)}return[...e.values()]}}function vh(s=2,t=5e4){const e=Math.log(1+t/s),n=new Float32Array(256);for(let i=0;i<256;i++)n[i]=s*(Math.exp(i/255*e)-1);return{lut:n,decode:i=>s*(Math.exp(i/255*e)-1),encode:i=>Math.max(0,Math.min(255,Math.round(255*Math.log(1+Math.max(0,i)/s)/e)))}}const xx=s=>Math.max(1,Math.round(60/Math.max(1,s)));async function ma(s,t){const{arch:e}=s,n=vh(s.d0,s.dMax),i=e.W,r=e.H,o=e.rect,a=s.islands,l=new Int8Array(i*r).fill(-1),c=(o.x1-o.x0)/i,h=(o.z1-o.z0)/r;for(let g=0;g<r;g++){const p=o.z0+(g+.5)*h;for(let u=0;u<i;u++){const x=o.x0+(u+.5)*c;let _=0,y=-1;for(let S=0;S<a.length;S++){const E=a[S].rect,T=Math.min(x-E.x0,E.x1-x,p-E.z0,E.z1-p);T>_&&(_=T,y=S)}l[g*i+u]=y}}const f=new Float32Array(i*r*3),d=new Float32Array(i*r),m={kf:s.kf,arch:null,islands:[]};for(let g=0;g<a.length;g++){const p=a[g],{W:u,H:x}=p,[_,y,S]=await Promise.all(["cultivation","settlement","forest"].map(C=>_x(p.layers[C],u,x,t,`${p.id} ${C}`))),E=p.land&&p.land.length===u*x?p.land:null,T=p.rect,U=(T.x1-T.x0)/u,M=(T.z1-T.z0)/x,w=new Int32Array(u);for(let C=0;C<u;C++)w[C]=Math.floor((T.x0+(C+.5)*U-o.x0)/c);for(let C=0;C<x;C++){const k=Math.floor((T.z0+(C+.5)*M-o.z0)/h);if(k<0||k>=r)continue;const P=C*u;for(let F=0;F<u;F++){const B=w[F];if(B<0||B>=i)continue;const j=k*i+B;if(l[j]!==g)continue;const G=P+F;E&&!E[G]||(f[j*3]+=_[G],f[j*3+1]+=n.lut[y[G]],f[j*3+2]+=S[G],d[j]++)}}const L=Math.max(1,p.f||1);if(L===1){const C=new Uint8Array(u*x*4);for(let k=0;k<u*x;k++)C[k*4]=_[k],C[k*4+1]=y[k],C[k*4+2]=S[k],C[k*4+3]=255;E&&ga(C,u,x,E,2),m.islands.push({id:p.id,W:u,H:x,data:C})}else{const C=Math.max(1,Math.round(u/L)),k=Math.max(1,Math.round(x/L)),P=new Float32Array(C*k*3),F=new Float32Array(C*k),B=new Int32Array(u);for(let G=0;G<u;G++)B[G]=Math.min(C-1,Math.floor((G+.5)*C/u));for(let G=0;G<x;G++){const Z=Math.min(k-1,Math.floor((G+.5)*k/x))*C;for(let J=0;J<u;J++){const Q=G*u+J;if(E&&!E[Q])continue;const lt=Z+B[J];P[lt*3]+=_[Q],P[lt*3+1]+=n.lut[y[Q]],P[lt*3+2]+=S[Q],F[lt]++}}const j=oc(P,F,C*k,n);ga(j,C,k,F,2),m.islands.push({id:p.id,W:C,H:k,data:j})}}const v=oc(f,d,i*r,n);return ga(v,i,r,d,3),m.arch={W:i,H:r,data:v},m}function ga(s,t,e,n,i){let r=Uint8Array.from(n,o=>o?1:0);for(let o=0;o<i;o++){const a=r.slice();for(let l=0;l<e;l++)for(let c=0;c<t;c++){const h=l*t+c;if(r[h])continue;let f=0,d=0,m=0,v=0;const g=p=>{r[p]&&(f++,d+=s[p*4],m+=s[p*4+1],v+=s[p*4+2])};c>0&&g(h-1),c<t-1&&g(h+1),l>0&&g(h-t),l<e-1&&g(h+t),f&&(s[h*4]=Math.round(d/f),s[h*4+1]=Math.round(m/f),s[h*4+2]=Math.round(v/f),a[h]=1)}r=a}}function oc(s,t,e,n){const i=new Uint8Array(e*4);for(let r=0;r<e;r++){const o=t[r];i[r*4+3]=255,o&&(i[r*4]=Math.round(s[r*3]/o),i[r*4+1]=n.encode(s[r*3+1]/o),i[r*4+2]=Math.round(s[r*3+2]/o))}return i}async function _x(s,t,e,n,i){if(!s)return new Uint8Array(t*e);if(typeof s=="string")return va(await n(s),t,e,s);const[r,o]=await Promise.all([n(s.from),n(s.to)]),a=va(r,t,e,s.from),l=va(o,t,e,s.to),c=s.t,h=new Uint8Array(t*e);for(let f=0;f<t*e;f++)h[f]=Math.round(a[f]+(l[f]-a[f])*c);return h}function va(s,t,e,n){if(s.W!==t||s.H!==e)throw new Error(`${n} is ${s.W}×${s.H}, the pack is ${t}×${e}`);return s.px}async function lc(s,t){const{px:e,W:n,H:i}=await s(t),r=new Uint8Array(n*i);for(let o=0,a=0;o<n*i;o++,a+=4)r[o]=e[a];return{px:r,W:n,H:i}}const cc=["cultivation","settlement","forest"],Mx={cultivation:"Cultivation",settlement:"Settlement",forest:"Native forest"},as=[1100,1450],yx=3,ir=.002,wx=10,Pi=(s,t,e)=>Math.max(t,Math.min(e,s)),hc=(s,t,e)=>{const n=Pi((e-s)/(t-s),0,1);return n*n*(3-2*n)};function Sx(){const s=new Qe(new Uint8Array([0,0,0,255]),1,1,_e,ue);return s.needsUpdate=!0,s}function bx(s){var n;const t=(n=s.data)==null?void 0:n.metres;if(!t)return null;const e=new Uint8Array(t.length);for(let i=0;i<t.length;i++)e[i]=t[i]>0?1:0;return e}function uc(s,t,e,n){const i=new Qe(s,t,e,_e,ue);return i.minFilter=oi,i.magFilter=ye,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=De,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class Ex{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.blank=Sx();const e=t.shared.uniforms;Object.assign(e,{uArchLandA:{value:this.blank},uArchLandB:{value:this.blank},uLandT:{value:0},uLandK:{value:0},uLandEarly:{value:1}}),this.uniforms=e,this.available=null,this.manifest=null,this.keyframes=[],this.resident=new Map,this.loading=new Map,this.bound=null,this.swapTo=null,this.kpShown=0,this.fade=0,this.fadeGoal=0,this.listeners=[],this.chain=Promise.resolve(),this.jobN=0,this.uploads=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){var o;const t=this.data.abs("layers/manifest.json");let e;try{const a=await fetch(t);if(!a.ok)throw new Error(`HTTP ${a.status}`);if(e=await a.json(),!Array.isArray(e==null?void 0:e.keyframes)||!e.keyframes.length||!e.islands)throw new Error("no keyframes or islands")}catch(a){this.available=!1,this.warn(`${t}: ${a.message} (no land layers)`),this.notify();return}this.manifest=e,this.keyframes=[...e.keyframes].filter(a=>Number.isFinite(a.year)).sort((a,l)=>a.year-l.year),this.kfIndex=new Map(this.keyframes.map((a,l)=>[a.id,l]));const n=((o=e.encoding)==null?void 0:o.settlement)||{};this.codec=vh(n.d0??2,n.dMax??5e4);const i=this.app.world;this.islands=i.islandPacks.filter(a=>e.islands[a.id]).map(a=>({pack:a,entry:e.islands[a.id]}));const r=i.archPack;this.arch={W:Math.max(1,Math.round(r.W/2)),H:Math.max(1,Math.round(r.H/2)),rect:r.rect},this.eraYears=this.app.timeline.eras.map(a=>this.eraYear(a)),this.available=!0,this.notify()}eraYear(t){var i,r;const e=(r=(i=this.manifest.eras)==null?void 0:i[t.id])==null?void 0:r.cultivation,n=o=>{var a;return(a=this.keyframes[this.kfIndex.get(o)])==null?void 0:a.year};return e!=null&&e.keyframe&&n(e.keyframe)!==void 0?n(e.keyframe):e!=null&&e.from&&n(e.from)!==void 0&&n(e.to)!==void 0?n(e.from)+(n(e.to)-n(e.from))*(e.t??0):t.year}kpAtYear(t){const e=this.keyframes;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}position(t=this.app.timeline.s){const e=this.eraYears;if(!(e!=null&&e.length))return 0;const n=Pi(t,0,e.length-1),i=Math.min(e.length-2,Math.floor(n));return i<0?this.kpAtYear(e[0]):this.kpAtYear(e[i]+(e[i+1]-e[i])*(n-i))}bracket(t){const e=this.keyframes.length,n=a=>this.keyframes[a].id;if(e<2)return{a:n(0),b:n(0),t:0,need:[n(0)]};const i=Pi(Math.floor(t),0,e-2),r=Pi(t-i,0,1),o=r<ir?[n(i)]:r>1-ir?[n(i+1)]:[n(i),n(i+1)];return{a:n(i),b:n(i+1),t:r,need:o}}covers(t,e){return t?e>=this.kfIndex.get(t.a)-ir&&e<=this.kfIndex.get(t.b)+ir:!1}clampTo(t,e){return Pi(e,this.kfIndex.get(t.a),this.kfIndex.get(t.b))}job(t){var a;const e=this.keyframes,n=this.kfIndex.get(t),i=l=>this.data.abs(`layers/${l}`),r=(l,c)=>{const h=m=>{var v,g,p;return(p=(g=(v=l.layers)==null?void 0:v[e[m].id])==null?void 0:g[c])==null?void 0:p.file};if(h(n))return i(h(n));let f=n-1;for(;f>=0&&!h(f);)f--;let d=n+1;for(;d<e.length&&!h(d);)d++;return f>=0&&d<e.length?{from:i(h(f)),to:i(h(d)),t:(e[n].year-e[f].year)/(e[d].year-e[f].year)}:f>=0?i(h(f)):d<e.length?i(h(d)):null},o=((a=this.manifest.encoding)==null?void 0:a.settlement)||{};return{kf:t,d0:o.d0??2,dMax:o.dMax??5e4,arch:this.arch,islands:this.islands.map(({pack:l,entry:c})=>({id:l.id,W:l.W,H:l.H,f:xx(Math.max(l.mx,l.mz)),rect:l.rect,land:bx(l),layers:Object.fromEntries(cc.map(h=>[h,r(c,h)]))}))}}request(t){const e=this.chain=this.chain.catch(()=>{}).then(()=>{if(!this.wanted(t))return null;const n=performance.now();return this.run(this.job(t)).then(i=>{this.arrive(i),this.lastBakeMs=Math.round(performance.now()-n)})}).catch(n=>this.warn(`land layers ${t}: ${n.message}`)).finally(()=>{this.loading.delete(t)});return this.loading.set(t,e),e}wanted(t){var n,i;const e=this.bracket(this.position());return this.bound&&this.app.view!=="land"?!1:e.need.includes(t)||((n=this.swapTo)==null?void 0:n.a)===t||((i=this.swapTo)==null?void 0:i.b)===t}run(t){const e=n=>lc(ai,n);if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("layers-worker-OijIdfIP.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=n=>this.reply(n.data),this.worker.onerror=n=>{var r;(r=n.preventDefault)==null||r.call(n),this.fallback=!0;const i=this.pending;this.pending=null,i&&ma(i.job,e).then(i.resolve,i.reject)}}catch{this.fallback=!0}return this.fallback?ma(t,e):new Promise((n,i)=>{const r=++this.jobN;this.pending={id:r,job:t,resolve:n,reject:i},this.worker.postMessage({...t,job:r})})}reply(t){const e=this.pending;!e||t.job!==e.id||(this.pending=null,t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,ma(e.job,n=>lc(ai,n)).then(e.resolve,e.reject)):e.reject(new Error(t.message)))}arrive(t){const e=Math.min(4,this.app.renderer.capabilities.getMaxAnisotropy()),n={id:t.kf,arch:uc(t.arch.data,t.arch.W,t.arch.H,e),archData:t.arch.data,islands:new Map(t.islands.map(i=>[i.id,uc(i.data,i.W,i.H,e)])),texels:t.arch.W*t.arch.H+t.islands.reduce((i,r)=>i+r.W*r.H,0),used:performance.now()};this.resident.set(t.kf,n),this.uploads.push(n.arch,...n.islands.values())}dropUnused(){var n,i,r,o;const t=performance.now(),e=new Set([(n=this.bound)==null?void 0:n.a,(i=this.bound)==null?void 0:i.b,(r=this.swapTo)==null?void 0:r.a,(o=this.swapTo)==null?void 0:o.b,...this.bracket(this.position()).need]);for(const[a,l]of this.resident){if(e.has(a)){l.used=t;continue}if(this.resident.size>yx||t-l.used>wx*1e3){l.arch.dispose();for(const c of l.islands.values())c.dispose();this.resident.delete(a),this.uploads=this.uploads.filter(c=>c!==l.arch&&![...l.islands.values()].includes(c))}}}resolve(t){const e=this.resident.has(t.a)?t.a:t.b;return{a:e,b:this.resident.has(t.b)?t.b:e}}bind(t){const{a:e,b:n}=this.resolve(t);this.bound={a:e,b:n};const i=this.resident.get(e),r=this.resident.get(n),o=this.uniforms;o.uArchLandA.value=i.arch,o.uArchLandB.value=r.arch;for(const a of this.app.world.islands)this.attach(a);this.notify()}attach(t){const e=t.uniforms;if(!e.uOwnLandA)return;const n=this.bound&&this.resident.get(this.bound.a),i=this.bound&&this.resident.get(this.bound.b);e.uOwnLandA.value=(n==null?void 0:n.islands.get(t.pack.id))||this.blank,e.uOwnLandB.value=(i==null?void 0:i.islands.get(t.pack.id))||this.blank}update(t,e){const n=this.uniforms;if(n.uLandEarly.value=hc(as[0],as[1],this.app.timeline.year),!this.available){n.uLandK.value=0;return}const i=this.position(),r=this.bracket(i);if(this.app.view==="land"||e>.001||!this.bound)for(const c of r.need)!this.resident.has(c)&&!this.loading.has(c)&&this.request(c);const a=r.need.every(c=>this.resident.has(c));if(a&&!this.swapTo&&!this.covers(this.bound,i)&&(!this.bound||this.fade<.02?(this.bind(r),this.kpShown=this.clampTo(this.bound,i)):this.covers(this.resolve(r),this.kpShown)?this.bind(r):this.swapTo=r),this.swapTo?(this.fadeGoal=0,this.fade<.02&&(this.bind(a?r:this.swapTo),this.swapTo=null,this.kpShown=this.clampTo(this.bound,i))):this.fadeGoal=this.bound?1:0,this.bound){const c=this.clampTo(this.bound,i);this.kpShown+=(c-this.kpShown)*(1-Math.exp(-t*8)),Math.abs(c-this.kpShown)<1e-4&&(this.kpShown=c)}this.fade+=(this.fadeGoal-this.fade)*(1-Math.exp(-t*6)),Math.abs(this.fadeGoal-this.fade)<.003&&(this.fade=this.fadeGoal),this.apply(e),this.dropUnused();const l=this.uploads.shift();l!=null&&l.image.data&&this.app.renderer.initTexture(l)}apply(t){const e=this.uniforms;if(this.bound){const n=this.kfIndex.get(this.bound.a),i=this.kfIndex.get(this.bound.b);e.uLandT.value=i>n?Pi((this.kpShown-n)/(i-n),0,1):0}e.uLandK.value=t*this.fade}settle(t){if(!this.available)return;const e=this.position(),n=this.bracket(e);n.need.every(i=>this.resident.has(i))&&!this.covers(this.bound,e)&&this.bind(n),this.swapTo=null,this.bound&&(this.kpShown=this.clampTo(this.bound,e)),this.fade=this.fadeGoal=this.bound?1:0,this.uniforms.uLandEarly.value=hc(as[0],as[1],this.app.timeline.year),this.apply(t)}get ready(){return!!this.available&&this.covers(this.bound,this.position())&&!this.swapTo&&this.fade>.99}describe(){if(!this.available)return null;const{a:t,b:e,need:n}=this.bracket(this.position()),i=this.keyframes,r=(c,h)=>{var v,g,p,u,x,_,y,S,E,T;const f=this.kfIndex.get(c),d=(p=(g=(v=this.manifest.methods)==null?void 0:v[c])==null?void 0:g[h])==null?void 0:p.method;if(d||(u=i[f].layers)!=null&&u.includes(h))return d?[d]:[];const m=[];for(let U=f-1;U>=0;U--){const M=(y=(_=(x=this.manifest.methods)==null?void 0:x[i[U].id])==null?void 0:_[h])==null?void 0:y.method;if(M){m.push(M);break}}for(let U=f+1;U<i.length;U++){const M=(T=(E=(S=this.manifest.methods)==null?void 0:S[i[U].id])==null?void 0:E[h])==null?void 0:T.method;if(M){m.push(M);break}}return m},o=cc.map(c=>{const h=n.flatMap(d=>r(d,c)),f=h.includes("modelled")?"modelled":h.includes("mixed")?"partly modelled":"";return{id:c,name:Mx[c],note:f}}),a=c=>i[this.kfIndex.get(c)].year;return{years:n.length>1?[a(t),a(e)]:[a(n[0])],layers:o,early:this.app.timeline.year<as[1]}}valuesAt(t,e){if(!this.bound)return null;const n=this.resident.get(this.bound.a),i=this.resident.get(this.bound.b);if(!n||!i)return null;const{W:r,H:o,rect:a}=this.arch,l=Math.floor((t-a.x0)/(a.x1-a.x0)*r),c=Math.floor((e-a.z0)/(a.z1-a.z0)*o);if(l<0||c<0||l>=r||c>=o)return null;const h=(c*r+l)*4,f=this.uniforms.uLandT.value,d=m=>n.archData[h+m]+(i.archData[h+m]-n.archData[h+m])*f;return{cultivation:d(0)/255,people:this.codec.decode(d(1)),forest:d(2)/255}}stats(){let t=0,e=0;for(const n of this.resident.values())t+=n.texels,e+=n.archData.byteLength;return{available:this.available,resident:[...this.resident.keys()],bound:this.bound?`${this.bound.a}/${this.bound.b}`:null,t:+this.uniforms.uLandT.value.toFixed(3),k:+this.uniforms.uLandK.value.toFixed(3),gpuMB:+(t*4*4/3/1048576).toFixed(1),cpuMB:+(e/1048576).toFixed(1),bakeMs:this.lastBakeMs??null}}dispose(){var t;for(const e of this.resident.values()){e.arch.dispose();for(const n of e.islands.values())n.dispose()}this.resident.clear(),(t=this.worker)==null||t.terminate()}}function vr(s,t=!1){if(s==null)return null;if(typeof s=="number")return s+(t?1:0);const e=String(s).match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!e)return null;const n=Number(e[1]);if(e[2]){const i=Number(e[2])-1+(t?1:0);return n+i/12}return n+(t?1:0)}const Ax={day:0,month:0,year:0,decade:5,generation:12,century:50};function Ia(s){const t=s.when||{};let e=vr(t.from),n=vr(t.to??t.from,!0);if(e===null&&n===null)return null;e===null&&(e=n-1),n===null&&(n=e+1);const i=Ax[t.precision]??0;return i&&n-e<=1.01&&(e-=i,n+=i),[e,n]}function xr(s){const t=s.when||{};return vr(t.from)??vr(t.to)}const xh=["generation","century","decade"];function _h(s){var e;const t=xr(s);return t===null?"":vs(Math.floor(t),xh.includes((e=s.when)==null?void 0:e.precision)?10:1)}function Tx(s){const t=s.when||{},e=i=>{const r=String(i??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!r)return String(i??"");const o=["January","February","March","April","May","June","July","August","September","October","November","December"],a=Number(r[1]),l=a<0?`${-a} BCE`:String(a);return r[3]?`${Number(r[3])} ${o[Number(r[2])-1]} ${l}`:r[2]?`${o[Number(r[2])-1]} ${l}`:l},n=xh.includes(t.precision)?"c. ":"";return!t.to||t.to===t.from?`${n}${e(t.from)}`:`${n}${e(t.from)} – ${e(t.to)}`}class Rx{constructor(t){this.eras=[...t].filter(e=>Number.isFinite(e.year)).sort((e,n)=>e.year-n.year),this.s=0,this.listeners=[]}get n(){return this.eras.length}get max(){return Math.max(0,this.n-1)}yearAt(t){const e=this.eras;if(!e.length)return 1800;if(e.length===1)return e[0].year+t*50;if(t<=0)return e[0].year+t*(e[1].year-e[0].year);if(t>=e.length-1)return e[e.length-1].year+(t-e.length+1)*(e[e.length-1].year-e[e.length-2].year);const n=Math.floor(t);return e[n].year+(t-n)*(e[n+1].year-e[n].year)}sAtYear(t){const e=this.eras;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}get year(){return this.yearAt(this.s)}get era(){return this.eras[Math.round(Math.max(0,Math.min(this.max,this.s)))]||null}get pair(){const t=Math.max(0,Math.min(this.max,this.s)),e=Math.floor(t),n=Math.min(this.max,e+1);return{a:this.eras[e],b:this.eras[n],t:t-e}}get window(){return[this.yearAt(this.s-.5),this.yearAt(this.s+.5)]}set(t){const e=Math.max(0,Math.min(this.max,t));if(e!==this.s){this.s=e;for(const n of this.listeners)n(this)}}setYear(t){this.set(this.sAtYear(t))}onChange(t){this.listeners.push(t)}}function vs(s,t=1){const e=Math.round(s),n=e<0?`${-e} BCE`:String(e);return t>=10?`c. ${n}`:n}const Mh=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},_r=s=>Mh(260,900,s),Na=s=>Mh(90,300,s);class Cx{constructor(t,e,{warn:n=console.warn}={}){this.canvas=t,this.data=e,this.warn=n,this.params=new URLSearchParams(location.search);const i=new eh({canvas:t,antialias:!1,powerPreference:"high-performance"});i.setClearColor(0,1),i.info.autoReset=!1,this.renderer=i,this.pipeline=new wg(i),this.scene=new Ar,this.camera=new Xe(42,1,.1,9e3),this.light={sunDir:new z(0,1,0),sunColor:new Tt,skyColor:new Tt,groundColor:new Tt,moonDir:new z(0,-1,0),moonColor:new Tt,zenith:new Tt,horizon:new Tt,sunHorizon:new Tt,night:0},this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uSkyMap:{value:null},uMokuId:{value:null},uMokuRect:{value:new $t(0,0,1,1)},uPalette:{value:null},uEraMix:{value:0},uPolityK:{value:0},uHoverMoku:{value:0}}},this.world=new Ug(this,e),Object.assign(this.shared.uniforms,this.world.uniforms),this.world.uniforms=this.shared.uniforms,this.patches=new Dg(this),this.timeline=new Rx(e.eras),this.polity=new vx(e,this.world.archPack.rect,this.shared.uniforms,n),this.land=new Ex(this),this.overlay={lines:!0,pins:!0,routes:!0};const r=this.params.get("view");this.view=r==="land"?"land":r==="none"?null:"chiefdoms",this.viewChosen=r==="land"||r==="chiefdoms"||r==="none",this.viewListeners=[],this.polityK=0,this.landK=0,this.sky=new jv,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??15.6)},this.time=0,this.frames=0,this.updaters=[]}start(){this.world.setArchipelago(this.world.archPack),this.scene.add(this.world.group),this.districts=new Cv(this),this.world.district=this.districts,this.ocean=new Uv(this.shared,this.shared.uniforms),this.scene.add(this.ocean.mesh),this.lines=new rx(this.data,this.shared.uniforms),this.scene.add(this.lines.group),this.routes=new mx({proj:this.data.proj,uniforms:this.shared.uniforms,camera:this.camera,renderer:this.renderer,eras:this.data.eras}),this.scene.add(this.routes.group),fx(this.data,this.warn).then(o=>this.routes.setRoutes(o)),this.rig=new Qv(this.camera,this.canvas,this.world);const t=this.params.get("cam");if(t){const[o,a,l,c,h]=t.split(",").map(Number);this.rig.jump({x:o,z:a,distance:l,yaw:c,pitch:h})}const e=this.params.get("year");e?this.timeline.setYear(Number(e)):t?this.timeline.set(Math.round(this.timeline.sAtYear(1778))):this.timeline.set(0),this.timeline.onChange(()=>this.syncEras()),this.syncEras(),this.sky.update(this.clock.doy,this.clock.hour,0,this.light);const n=this.renderer.getContext(),i=n.getExtension("WEBGL_debug_renderer_info"),r=i?String(n.getParameter(i.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(r),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.params.get("debug")&&this.world.setDebug(Number(this.params.get("debug"))),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}setView(t,{user:e=!1}={}){e&&(this.viewChosen=!0);const n=t==="chiefdoms"||t==="land"?t:null;if(n!==this.view){this.view=n;for(const i of this.viewListeners)i(n)}}onView(t){this.viewListeners.push(t)}islandFill(){const t=this.rig.state,e=t.target;let n=null,i=0;for(const a of this.world.islandPacks){const l=a.rect,c=Math.min(e.x-l.x0,l.x1-e.x,e.z-l.z0,l.z1-e.z);c>i&&(i=c,n=a)}if(!n)return 0;const r=2*t.distance*Math.tan(this.camera.fov*Math.PI/360),o=n.rect;return Math.max((o.x1-o.x0)/(r*this.camera.aspect),(o.z1-o.z0)/r)}routeOptions(t){var n;const e=this.tour;return{window:this.timeline.window,fill:this.islandFill(),focus:e!=null&&e.active?((n=e.event)==null?void 0:n.id)??null:null,...t}}addIsland(t){const e=this.world.addIsland(t);this.land.attach(e),e.applyRange(this.qset.range),this.params.get("debug")&&(e.uniforms.uDebug.value=Number(this.params.get("debug")))}settle(){var e,n,i;(e=this.ui)==null||e.timeline.finish(),this.rig.finishFlight();const t=this.rig.goal;for(const r of[this.rig.goal,this.rig.state])r.target.copy(t.target),r.distance=t.distance,r.yaw=t.yaw,r.pitch=t.pitch;this.world.update(this.camera,t.distance,0),this.world.settle(this.camera),(n=this.districts)==null||n.settle(this.camera,t.distance),this.rig.jump({x:t.target.x,z:t.target.z}),this.polityK=this.view==="chiefdoms"?_r(t.distance):0,this.landK=this.view==="land"?Na(t.distance):0,this.shared.uniforms.uPolityK.value=this.polityK,this.land.settle(this.landK),(i=this.routes)==null||i.settle(this.timeline.year,t.distance,this.routeOptions())}stats(){const t=this.renderer.info;return{...this.world.stats(),view:this.view,frameMs:+(this.frameAvg??0).toFixed(1),calls:t.render.calls,triangles:t.render.triangles,textures:t.memory.textures,quality:this.quality.level}}syncEras(){const{a:t,b:e,t:n}=this.timeline.pair;this.polity.setEras(t,e,n)}applyQuality(){const t=[{range:3,dpr:1},{range:3.8,dpr:1.25},{range:4.6,dpr:1.5},{range:5.5,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.world.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.frameAvg=this.frameAvg===void 0?e*1e3:this.frameAvg+(e*1e3-this.frameAvg)*.1,this.renderer.info.reset(),this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.clock;this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t);const n=this.rig.state.distance;this.world.update(this.camera,n,t),this.ocean.update(this.camera);const i=1-Math.exp(-t*5),r=this.view==="chiefdoms"?_r(n):0;this.polityK+=(r-this.polityK)*i,this.shared.uniforms.uPolityK.value=this.polityK;const o=this.view==="land"?Na(n):0;this.landK+=(o-this.landK)*i,this.land.update(t,this.landK),this.lines.visible=this.overlay.lines;const a=this.light,l=Math.min(1,.25+(a.sunColor.r+a.skyColor.r)*.35);this.lines.update(this.camera,this.renderer,n,l),this.routes.visible=this.overlay.routes!==!1,this.routes.update(this.timeline.year,n,this.routeOptions({light:l}));for(const h of this.updaters)h(t,this.time);const c=this.pipeline.uniforms;c.uSunDir.value.copy(a.sunDir),c.uSunColor.value.copy(a.sunHorizon),c.uFogColor.value.copy(a.horizon),c.uFogDensity.value=.09/Math.max(30,n),c.uFogFalloff.value=2/Math.max(30,n),c.uExposure.value=.55*(1+2.2*Math.pow(a.night,1.5)),c.uNight.value=a.night,this.sky.group.position.copy(this.camera.position)}}const $e=(s,t=document)=>t.querySelector(s),Pe=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,r]of Object.entries(t))i==="class"?n.className=r:i.startsWith("on")?n.addEventListener(i.slice(2),r):n.setAttribute(i,r);return e&&(n.innerHTML=e),n},Px={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},_t=s=>String(s??"").replace(/[&<>"']/g,t=>Px[t]),Fa={arrival:'<path d="M2.5 15.5h19l-2.6 3.6H5.1z"/><path d="M11.5 15.5V4l6.5 9.2h-6.5"/><path d="M2 21.2c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',voyage:'<path d="M2.5 14.5h19l-2.6 3.6H5.1z"/><path d="M11.5 14.5V3.5l6.5 9h-6.5"/><path d="M6 21c3-1.4 9-1.4 12 0"/>',battle:'<path d="M4.5 19.5 19.5 4.5M4.5 4.5l15 15"/><path d="M16.5 4.5h3v3M7.5 4.5h-3v3"/>',founding:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',construction:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',eruption:'<path d="M2.5 20.5 9 11h6l6.5 9.5z"/><path d="M10.2 8.2c0-2 1-3.1 1.8-4.7.8 1.6 1.8 2.7 1.8 4.7"/><path d="M7 6.5l1.3 1.3M17 6.5l-1.3 1.3"/>',epidemic:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',law:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',treaty:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 15h3"/><path d="M13.5 18.5c1-1 1.8-1 2.8 0"/>',death:'<path d="M3.5 18.5h17"/><path d="M7 18.5a5 5 0 0 1 10 0"/><path d="M12 4.5v5M9.6 7.4 12 9.8l2.4-2.4"/>',protest:'<path d="M6 21V3.5"/><path d="M6 4h11.5l-2.6 4 2.6 4H6"/>',restoration:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',other:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',era:'<path d="M5 13.5h14l-2 2.6H7z"/><path d="M11.5 13.5V3.5l5.5 7.6h-5.5"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',routes:'<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',home:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'};function an(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Fa[s]||Fa.other}</svg>`}const yh=s=>s in Fa;class Lx{constructor(t,e,n){this.app=e,this.ui=n,this.tl=e.timeline,this.tween=null;const i=this.tl.n;this.el=Pe("div",{class:"timeline",role:"group","aria-label":"Time"}),i<2&&this.el.classList.add("single"),i<1&&(this.el.hidden=!0),this.el.innerHTML=`
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${an("prev",16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${an("next",16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${Math.max(0,i-1)}" step="0.001" aria-label="Year" />
      </div>`,t.appendChild(this.el),this.input=$e(".tl-input",this.el),this.backBtn=$e(".tl-back",this.el),this.nextBtn=$e(".tl-next",this.el),this.tourEl=$e(".tl-tour",this.el);const r=$e(".tl-ticks",this.el),o=Math.max(1,Math.ceil(i*46/Math.min(620,innerWidth-60)));this.tl.eras.forEach((a,l)=>{const c=i>1?l/(i-1)*100:50,h=Pe("button",{class:"tl-tick",style:`left:${c}%`,title:`${a.label} · ${vs(a.year,a.yearPrecision)}`,"aria-label":a.label,"data-i":l});h.innerHTML=`<i></i>${l%o===0||l===i-1?`<span>${_t(vs(a.year,a.yearPrecision).replace("c. ",""))}</span>`:""}`,r.appendChild(h)}),this.input.addEventListener("input",()=>{this.tween=null,this.tl.set(Number(this.input.value)),this.ui.onScrub()}),r.addEventListener("click",a=>{const l=a.target.closest(".tl-tick");l&&(this.easeTo(Number(l.dataset.i),.9),this.ui.onScrub(Number(l.dataset.i)))}),this.nextBtn.addEventListener("click",()=>{this.el.classList.remove("invite"),this.ui.tour.next()}),this.backBtn.addEventListener("click",()=>this.ui.tour.back()),this.tl.onChange(()=>this.refresh()),this.refresh()}easeTo(t,e=1){const n=Math.max(0,Math.min(this.tl.max,t));this.tween={from:this.tl.s,to:n,t:0,dur:e}}easeToYear(t,e){this.easeTo(this.tl.sAtYear(t),e)}finish(){this.tween&&(this.tl.set(this.tween.to),this.tween=null)}update(t){const e=this.tween;if(!e)return;e.t=Math.min(1,e.t+t/e.dur);const n=e.t<.5?2*e.t*e.t:1-Math.pow(-2*e.t+2,2)/2;this.tl.set(e.from+(e.to-e.from)*n),e.t>=1&&(this.tween=null)}refresh(){const t=this.tl,e=t.era;$e(".tl-era",this.el).textContent=e?e.label:"",$e(".tl-year",this.el).textContent=e?vs(t.year,e.yearPrecision??1):"",document.activeElement!==this.input&&(this.input.value=String(t.s));const n=t.max>0?t.s/t.max:0;$e(".tl-rail span",this.el).style.width=`${n*100}%`;const i=Math.round(t.s);for(const r of this.el.querySelectorAll(".tl-tick"))r.classList.toggle("on",Number(r.dataset.i)===i)}refreshTour(t){const e=`${t.active}:${t.chapter}:${t.step}:${t.stop}:${t.active?"":t.nearestChapter()}:${t.atEnd}`;if(e===this.tourKey)return;this.tourKey=e;const n=t.describe();if(this.backBtn.disabled=!n||t.atStart,this.nextBtn.disabled=!n||t.atEnd,this.el.classList.toggle("off-tour",!!n&&!n.active),this.tourEl.classList.toggle("opening",!!(n!=null&&n.opening)),!n){this.tourEl.innerHTML="";return}this.tourEl.innerHTML=n.active?`<span class="tl-ch">Chapter <b>${n.number}</b> of ${n.of}</span><i>·</i><em>${_t(n.name)}</em>${n.step?`<i>·</i><span>${_t(n.step)}</span>`:""}`:`<span>Next resumes at ${_t(n.chapter.toLowerCase())}</span><i>·</i><em>${_t(n.name)}</em>`,this.nextBtn.title=n.active?"Next (→ or space)":`Back to the tour: ${n.chapter.toLowerCase()}, ${n.name}`}}const fc={exact:0,ahupuaa:22,moku:90,island:260,sea:160},dc=24;class Dx{constructor(t,e,{onOpen:n,onCluster:i}={}){this.app=e,this.onOpen=n,this.onCluster=i,this.layer=Pe("div",{class:"pins"}),t.appendChild(this.layer),this.tip=Pe("div",{class:"cl-tip",role:"tooltip"}),t.appendChild(this.tip);const r=new Map(e.data.places.map(l=>[l.id,l]));this.places=r,this.items=[];const o=[];for(const l of e.data.events){const c=(l.where||[]).map(u=>r.get(u.place)).find(u=>u&&on(u.geometry)),h=Ia(l);if(!c||!h){o.push(l.id);continue}const[f,d]=e.data.proj.toWorld(on(c.geometry)),m=yh(l.kind)?l.kind:"other",v=Pe("button",{class:"pin",title:l.title,"aria-label":l.title},`<span class="pin-ic">${an(m,16)}</span><span class="pin-label">${_t(l.title)}</span>`);v.addEventListener("click",u=>{var x;u.stopPropagation(),(x=this.onOpen)==null||x.call(this,l)});const g=fc[c.placePrecision]??0,p=Pe("div",{class:"halo"});this.layer.appendChild(p),this.layer.appendChild(v),this.items.push({ev:l,place:c,x:f,z:d,span:h,start:xr(l)??h[0],el:v,halo:p,soft:g,r:g,pos:new z(f,0,d),shown:!1,active:!1,near:!1,haloShown:!1,tx:NaN,ty:NaN,ts:NaN,hx:NaN,hy:NaN,hr:NaN,ha:NaN})}o.length&&e.warn(`events with no placeable \`where\` or no date, so no pin: ${o.join(", ")}`);const a=this.items.length;this.sx=new Float32Array(a),this.sy=new Float32Array(a),this.vis=new Uint8Array(a),this.root=new Int16Array(a),this.size=new Int16Array(a),this.slot=new Int16Array(a),this.members=new Int16Array(a),this.halos=new Int16Array(a),this.clusters=[],this.nClusters=0,this.hovered=null,this.activeEvent=null,this.stopXZ=null,this._v=new z,this._w=new z}setStopPlace(t){const e=t&&on(t.geometry);this.stopXZ=e?this.app.data.proj.toWorld(e):null,this.stopSoft=t?fc[t.placePrecision]??0:0}visibleEvents(){const[t,e]=this.app.timeline.window;return this.items.filter(n=>n.span[1]>=t&&n.span[0]<=e).map(n=>n.ev)}marker(t){let e=this.clusters[t];if(e)return e;const n=Pe("button",{class:"cluster"},'<span class="cl-n"></span>');return e={el:n,label:n.firstChild,start:0,count:0,x:0,y:0,key:0,shownCount:-1,tipKey:-1,domKey:-1,shown:!1,beside:!1,tx:NaN,ty:NaN,ts:NaN},n.addEventListener("click",i=>{var r;i.stopPropagation(),this.hideTip(),(r=this.onCluster)==null||r.call(this,this.eventsOf(e))}),n.addEventListener("pointerenter",i=>{i.pointerType!=="touch"&&(this.hovered=e,this.showTip(e))}),n.addEventListener("pointerleave",()=>{this.hovered===e&&this.hideTip()}),this.layer.appendChild(n),this.clusters[t]=e,e}eventsOf(t){const e=[];for(let n=0;n<t.count;n++)e.push(this.items[this.members[t.start+n]]);return e.sort((n,i)=>n.start-i.start).map(n=>n.ev)}groups(){return this.clusters.slice(0,this.nClusters).map(t=>({ids:this.eventsOf(t).map(e=>e.id),count:t.count,x:t.x,y:t.y,beside:t.beside}))}showTip(t){t.tipKey=t.key;const e=this.eventsOf(t).map(n=>`<div class="tip-row"><span class="tip-y">${_t(_h(n))}</span><b>${_t(n.title)}</b></div>`).join("");this.tip.innerHTML=`<div class="tip-head">${t.count} events here</div>${e}<div class="tip-foot">click for the list</div>`,this.tip.classList.add("show"),this.tipX=this.tipY=NaN,this.placeTip(t)}placeTip(t){const e=this.tip.offsetWidth||220,n=this.tip.offsetHeight||120;let i=t.x+22;i+e>innerWidth-10&&(i=t.x-22-e);const r=Math.max(64,Math.min(innerHeight-n-10,t.y-44-n/2)),o=Math.round(i),a=Math.round(r);o===this.tipX&&a===this.tipY||(this.tipX=o,this.tipY=a,this.tip.style.transform=`translate(${o}px, ${a}px)`)}hideTip(){this.hovered=null,this.tip.classList.remove("show")}find(t){const e=this.root;for(;e[t]!==t;)e[t]=e[e[t]],t=e[t];return t}put(t,e,n,i){Math.abs(e-t.tx)<.05&&Math.abs(n-t.ty)<.05&&i===t.ts||(t.tx=e,t.ty=n,t.ts=i,t.el.style.transform=`translate(${e.toFixed(1)}px, ${n.toFixed(1)}px) scale(${i.toFixed(3)})`)}update(t){const e=this.app,n=e.camera,i=innerWidth,r=innerHeight,o=e.timeline,a=o.yearAt(o.s-.5),l=o.yearAt(o.s+.5),c=e.rig.state.distance,h=Math.round(Math.max(.62,Math.min(1,1.18-Math.log(Math.max(1,c)/120)*.13))*200)/200,f=this.items,d=f.length,{sx:m,sy:v,vis:g,root:p,size:u}=this,x=this.activeEvent,_=this._v;let y=-1;for(let M=0;M<d;M++){const w=f[M],L=w.ev===x,C=L&&this.stopXZ;w.pos.x=C?this.stopXZ[0]:w.x,w.pos.z=C?this.stopXZ[1]:w.z,w.pos.y=e.world.heightAt(w.pos.x,w.pos.z)+.02,w.r=C?this.stopSoft:w.soft;let k=t&&(L||w.span[1]>=a&&w.span[0]<=l);k&&(_.copy(w.pos).project(n),m[M]=(_.x+1)/2*i,v[M]=(1-_.y)/2*r,k=_.z<1&&m[M]>-60&&m[M]<i+60&&v[M]>84&&v[M]<r+40),g[M]=k?1:0,k&&L&&(y=M),p[M]=M,u[M]=0}const S=dc*dc;for(let M=0;M<d;M++)if(!(!g[M]||M===y))for(let w=M+1;w<d;w++){if(!g[w]||w===y)continue;const L=m[M]-m[w],C=v[M]-v[w];if(L*L+C*C<S){const k=this.find(M),P=this.find(w);k!==P&&(p[Math.max(k,P)]=Math.min(k,P))}}for(let M=0;M<d;M++)g[M]&&M!==y&&u[this.find(M)]++;let E=0,T=0;for(let M=0;M<d;M++){if(!g[M]||M===y||p[M]!==M||u[M]<2)continue;const w=this.marker(E);this.slot[M]=E++,w.start=T,w.count=0,w.x=0,w.y=0,w.key=0,T+=u[M]}for(let M=0;M<d;M++){if(!g[M]||M===y)continue;const w=this.find(M);if(u[w]<2)continue;const L=this.clusters[this.slot[w]];this.members[L.start+L.count++]=M,L.x+=m[M],L.y+=v[M],L.key=(L.key*61+M+1)%1000003}for(let M=0;M<d;M++){const w=f[M],L=g[M]===1&&(M===y||u[this.find(M)]<2);L!==w.shown&&(w.shown=L,w.el.classList.toggle("show",L));const C=w.ev===x;if(C!==w.active&&(w.active=C,w.el.classList.toggle("active",C)),!L)continue;const k=c<260||C;k!==w.near&&(w.near=k,w.el.classList.toggle("near",k)),this.put(w,m[M],v[M],h)}for(let M=0;M<E;M++){const w=this.clusters[M];w.x/=w.count,w.y/=w.count;const L=y>=0&&Math.abs(w.x-m[y])<30&&Math.abs(w.y-v[y])<30;if(L&&(w.x=m[y]-36*h,w.y=v[y]),L!==w.beside&&(w.beside=L,w.el.classList.toggle("beside",L)),w.count!==w.shownCount&&(w.shownCount=w.count,w.label.textContent=String(w.count),w.el.setAttribute("aria-label",`${w.count} events here`)),w.key!==w.domKey){w.domKey=w.key;let C="";for(let k=0;k<w.count;k++)C+=`${k?" ":""}${f[this.members[w.start+k]].ev.id}`;w.el.dataset.events=C}w.shown||(w.shown=!0,w.el.classList.add("show")),this.put(w,w.x,w.y,h),this.hovered===w&&(w.key!==w.tipKey?this.showTip(w):this.placeTip(w))}for(let M=E;M<this.clusters.length;M++){const w=this.clusters[M];this.hovered===w&&this.hideTip(),w.shown&&(w.shown=!1,w.count=0,w.el.classList.remove("show"))}this.nClusters=E;let U=0;for(let M=0;M<d;M++){const w=f[M];let L=g[M]===1&&w.r>0;for(let F=0;L&&F<U;F++){const B=f[this.halos[F]];Math.abs(B.pos.x-w.pos.x)<.5&&Math.abs(B.pos.z-w.pos.z)<.5&&B.r>=w.r&&(L=!1)}if(L!==w.haloShown&&(w.haloShown=L,w.halo.classList.toggle("show",L)),!L)continue;this.halos[U++]=M,this._w.copy(n.position).sub(w.pos).normalize();const C=this._w.cross(n.up).normalize().multiplyScalar(w.r).add(w.pos);C.project(n);const k=Math.max(6,Math.min(400,Math.hypot((C.x+1)/2*i-m[M],(1-C.y)/2*r-v[M])));Math.abs(m[M]-w.hx)<.05&&Math.abs(v[M]-w.hy)<.05&&Math.abs(k-w.hr)<.05||(w.hx=m[M],w.hy=v[M],w.hr=k,w.halo.style.transform=`translate(${m[M].toFixed(1)}px, ${v[M].toFixed(1)}px) scale(${k.toFixed(1)})`);const P=Math.round(Math.max(.3,Math.min(1,70/k))*100)/100;P!==w.ha&&(w.ha=P,w.halo.style.setProperty("--halo",P.toFixed(2)))}}}const Ux={arrival:"arrival",battle:"battle",founding:"founding",construction:"construction",eruption:"eruption",epidemic:"epidemic",law:"law",treaty:"treaty",voyage:"voyage",death:"death",protest:"protest",restoration:"restoration",other:"event"},pc=s=>yh(s.kind)?s.kind:"other";function Ix(s){const t=String(s).match(/^(in the time of)(\s+)(.+)$/i);return t?{lead:t[1],gap:t[2],name:t[3]}:{lead:"",gap:"",name:String(s)}}class Nx{constructor(t,e,n){this.app=e,this.ui=n,this.el=Pe("section",{class:"card","aria-live":"polite"}),t.appendChild(this.el),this.places=new Map(e.data.places.map(i=>[i.id,i])),this.sources=new Map(e.data.sources.map(i=>[i.id,i])),this.events=new Map(e.data.events.map(i=>[i.id,i])),this.mode=null,this.ev=null,this.stop=-1,this.chapter=null,this.list=null,this.el.addEventListener("click",i=>this.click(i))}get isOpen(){return this.el.classList.contains("show")}open(t){this.set("event",{ev:t})}setStop(t){this.stop=t,this.render()}openEra(t){this.set("era",{chapter:t})}openList(t){this.set("cluster",{list:t})}set(t,{ev:e=null,chapter:n=null,list:i=null}){this.mode=t,this.ev=e,this.chapter=n,this.list=i,this.stop=-1,this.render()}close(){var e,n;const t=this.ev;this.el.classList.remove("show"),this.mode=null,this.ev=null,this.chapter=null,this.list=null,(n=(e=this.ui).onCardClosed)==null||n.call(e,t)}click(t){const e=t.target.closest("button");if(!e||!this.el.contains(e))return;const n=this.ui.tour;if(e.classList.contains("card-close"))this.close();else if(e.classList.contains("prev"))n.back();else if(e.classList.contains("next"))n.next();else if(e.dataset.ev){const i=this.events.get(e.dataset.ev);i&&n.open(i,{gentle:this.mode==="cluster"})}}sourceLine(t){const e=typeof t=="string"?t:t.id,n=this.sources.get(e),i=typeof t=="object"&&t.where?`, ${_t(t.where)}`:"";if(!n)return`<li><span class="src-title">${_t(e)}</span>${i} <span class="flag missing" title="not in sources.json">missing</span></li>`;const r=n.url&&/^https?:/.test(n.url)?`<a href="${_t(n.url)}" target="_blank" rel="noopener">${_t(n.title)}</a>`:_t(n.title),o=n.opened===!1?' <span class="flag" title="Not yet read at the source: check this before relying on it">verify</span>':"",a=n.author?`${_t(n.author)}, `:"",l=n.year?` (${_t(n.year)})`:"";return`<li>${a}<span class="src-title">${r}</span>${l}${i}${o}</li>`}sourcesSection(t){return`<div class="card-sec"><h2>Sources</h2><ul class="sources">${(t||[]).map(e=>this.sourceLine(e)).join("")||'<li class="none">none listed</li>'}</ul></div>`}eventRows(t,{gloss:e=!0}={}){return t.map(n=>`<li><button class="ev-row" data-ev="${_t(n.id)}">
          <span class="ev-ic">${an(pc(n),16)}</span>
          <span class="ev-y">${_t(_h(n))}</span>
          <span class="ev-t"><b>${_t(n.title)}</b>${e&&n.gloss?`<em>${_t(n.gloss)}</em>`:""}</span>
        </button></li>`).join("")}footer(){var r;const t=this.ui.tour;if(!(t!=null&&t.active))return"";const e=t.current;let n,i="Next";if(this.mode==="era"&&this.chapter===e&&t.step<0)n=`<span class="ch-count">Chapter <b>${e.index+1}</b> of ${t.chapters.length}</span>`;else if(this.mode==="event"&&this.ev&&this.ev===t.event){const o=((r=this.ev.stops)==null?void 0:r.length)||0;t.stop>=0?n=_t(`stop ${t.stop+1} of ${o}`):(n=_t(`${t.step+1} of ${e.events.length} in chapter ${e.index+1}`),o&&(i=`Walk ${o} stops`))}else return"";return`<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${t.atStart?"disabled":""}>${an("prev",18)}</button>
      <span class="count">${n}</span>
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${t.atEnd?"disabled":""}><span>${_t(i)}</span>${an("next",18)}</button>
    </footer>`}render(){if(this.mode==="era")this.el.innerHTML=this.eraHTML();else if(this.mode==="cluster")this.el.innerHTML=this.clusterHTML();else if(this.mode==="event"&&this.ev)this.el.innerHTML=this.eventHTML();else return;this.el.dataset.mode=this.mode,this.el.classList.toggle("chapter",this.mode==="era"),this.el.classList.add("show"),this.el.scrollTop=0}header(t,e,n){return`<header>
        <div class="card-icon">${an(t,26)}</div>
        <div class="card-titles"><h1>${_t(e)}</h1>${n?`<p class="gloss">${_t(n)}</p>`:""}</div>
        <button class="card-close" aria-label="Close">${an("close",18)}</button>
      </header>`}eventHTML(){const t=this.ev,e=(t.where||[]).map(l=>{const c=this.places.get(l.place);return c?`${_t(c.name)}${l.role?` <em>${_t(l.role)}</em>`:""}`:null}).filter(Boolean),n=Object.entries(t.confidence||{}).map(([l,c])=>`<span class="conf ${_t(c)}"><b>${_t(l)}</b> ${_t(c)}</span>`).join(""),i=(t.tellings||[]).map(l=>{var c;return`<li><span class="src-title">${_t(((c=this.sources.get(l.source))==null?void 0:c.title)||l.source)}</span>: ${_t(l.says)}</li>`}).join(""),r=t.stops||[],o=this.stop>=0?r[this.stop]:null,a=o?this.places.get(o.place):null;return`
      ${this.header(pc(t),t.title,t.gloss)}
      <div class="card-meta"><span class="when">${_t(Tx(t))}</span><span class="kind">${_t(Ux[t.kind]||t.kind||"event")}</span></div>
      ${e.length?`<div class="card-where">${e.join("<i>·</i>")}</div>`:""}
      ${o?`<div class="stop"><div class="stop-n">${this.stop+1} / ${r.length}${a?` · ${_t(a.name)}`:""}</div><p>${_t(o.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${_t(t.summary)}</p>`:""}</div>
      ${n?`<div class="card-conf">${n}</div>`:""}
      ${i?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${i}</ul></div>`:""}
      ${this.sourcesSection(t.sources)}
      ${this.footer()}`}eraHTML(){const t=this.chapter,e=t.era,n=Ix(e.label||e.id),r=String(e.note||"").match(/^([ʻʼ'‘“"(]*.)([\s\S]*)$/u),o=r?`<p><span class="initial">${_t(r[1])}</span>${_t(r[2])}</p>`:"";return`
      <header class="ch-head">
        <div class="ch-mark"><span class="ch-word">Chapter</span><span class="ch-num">${t.index+1}</span></div>
        <h1 class="ch-title">${n.lead?`<span class="ch-lead">${_t(n.lead)}</span>${_t(n.gap)}`:""}<span class="ch-name">${_t(n.name)}</span></h1>
        <div class="ch-year">${_t(vs(e.year,Math.max(10,e.yearPrecision??10)))}</div>
        <button class="card-close" aria-label="Close">${an("close",18)}</button>
      </header>
      <div class="card-body ch-note">${o}</div>
      ${t.events.length?`<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(t.events,{gloss:!1})}</ul></div>`:""}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`}clusterHTML(){const t=this.list||[],e=[];for(const i of t){const r=(i.where||[]).map(o=>this.places.get(o.place)).find(Boolean);r&&!e.includes(r.name)&&e.push(r.name)}const n=e.length>4?`${e.slice(0,4).join(" · ")} · and ${e.length-4} more`:e.join(" · ");return`
      ${this.header("pins",`${t.length} events`,n)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(t)}</ul></div>`}}const Kn={far:2600,island:520,near:70},xa={far:0,island:1,near:2},Ai=(s,t,e)=>Math.max(t,Math.min(e,s)),Fx=new Set(["law","epidemic","restoration"]);function zx(s){return(s==null?void 0:s.view)==="land"||(s==null?void 0:s.view)==="chiefdoms"?s.view:s&&Fx.has(s.kind)?"land":"chiefdoms"}function kx(s){return s.short?s.short:String(s.label||s.id).replace(/^in the time of\s+/i,"").split(/,| and the /)[0].trim()}function mc(s){let t=null;for(const e of s||[])e in xa&&(t===null||xa[e]>xa[t])&&(t=e);return t||"island"}class Ox{constructor(t,e){this.app=t,this.ui=e,this.places=new Map(t.data.places.map(n=>[n.id,n])),this.islands=new Map(t.data.packs.filter(n=>n!==t.world.archPack).map(n=>[n.id,n])),this.chapters=this.build(),this.active=!1,this.chapter=0,this.step=-1,this.stop=-1,this.listeners=[]}build(){const t=this.app,e=t.timeline,n=new Map(e.eras.map((a,l)=>[a.id,l])),i=e.eras.map((a,l)=>({era:a,index:l,name:kx(a),events:[],island:null}));if(!i.length)return i;const r=[],o=i.map(()=>[]);return t.data.events.forEach((a,l)=>{const c=xr(a);if(c===null)return;let h=n.get(a.era);h===void 0&&(h=Math.round(e.sAtYear(c)),r.push(a.id)),o[h].push({ev:a,start:c,order:l})}),r.length&&t.warn(`events whose era is not in eras.json, placed in a chapter by date: ${r.join(", ")}`),i.forEach((a,l)=>{a.events=o[l].sort((c,h)=>c.start-h.start||c.order-h.order).map(c=>c.ev),a.island=this.gathering(a.events)}),i}gathering(t){const e=new Map;let n=0;for(const o of t){const a=this.placeOf(o);a&&(n++,a.island&&this.islands.has(a.island)&&e.set(a.island,(e.get(a.island)||0)+1))}let i=null,r=0;for(const[o,a]of e)a>r&&([i,r]=[o,a]);return i&&r>=2&&r>=n*.7?i:null}placeOf(t){for(const e of t.where||[]){const n=this.places.get(e.place);if(n&&on(n.geometry))return n}return null}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}get current(){return this.chapters[this.chapter]||null}get event(){var t;return this.step>=0&&((t=this.current)==null?void 0:t.events[this.step])||null}get state(){var t;return{active:this.active,chapter:this.chapter,step:this.step,stop:this.stop,event:((t=this.event)==null?void 0:t.id)??null}}get atStart(){return this.active&&this.chapter===0&&this.step<0}get atEnd(){var r;const t=this.chapters.length;if(!t)return!0;if(!this.active)return!1;const e=this.current,n=this.event,i=n?(((r=n.stops)==null?void 0:r.length)||0)-1:-1;return this.chapter===t-1&&this.step===e.events.length-1&&this.stop>=i}nearestChapter(){return Ai(Math.round(this.app.timeline.s),0,this.chapters.length-1)}begin(){this.goTo(0,-1,{jump:!0})}next(){var e;if(!this.chapters.length)return;if(!this.active)return this.goTo(this.nearestChapter(),-1);const t=this.event;if(t&&this.stop<(((e=t.stops)==null?void 0:e.length)||0)-1)return this.goStop(this.stop+1);if(this.step<this.current.events.length-1)return this.goTo(this.chapter,this.step+1);if(this.chapter<this.chapters.length-1)return this.goTo(this.chapter+1,-1)}back(){if(this.chapters.length){if(!this.active)return this.goTo(this.nearestChapter(),-1);if(this.event&&this.stop>0)return this.goStop(this.stop-1);if(this.event&&this.stop===0)return this.goTo(this.chapter,this.step);if(this.step>0)return this.goTo(this.chapter,this.step-1,{stop:"last"});if(this.step===0)return this.goTo(this.chapter,-1);if(this.chapter>0){const t=this.chapters[this.chapter-1];return this.goTo(this.chapter-1,t.events.length-1,{stop:"last"})}}}skip(t){if(!this.chapters.length)return;const e=this.active?this.chapter:this.nearestChapter(),n=t<0&&this.active&&this.step>=0?e:e+t;n>=0&&n<this.chapters.length&&this.goTo(n,-1)}leave(){this.active&&(this.active=!1,this.notify())}locate(t){for(let e=0;e<this.chapters.length;e++){const n=this.chapters[e].events.indexOf(t);if(n>=0)return[e,n]}return null}open(t,{gentle:e=!1}={}){const n=this.locate(t);if(n)return this.goTo(n[0],n[1],{gentle:e});this.ui.pins.activeEvent=t,this.ui.pins.setStopPlace(null),this.ui.card.open(t),this.fly(this.gentleView(t))}goTo(t,e=-1,{jump:n=!1,gentle:i=!1,stop:r=-1}={}){var a;const o=this.chapters[t];if(o){if(this.active=!0,this.chapter=t,this.step=Ai(e,-1,o.events.length-1),this.stop=-1,this.step<0)this.showEra(o,n);else{const l=o.events[this.step],c=((a=l.stops)==null?void 0:a.length)||0;if(r==="last"&&c)return this.goStop(c-1,{jump:n});this.showEvent(l,{jump:n,gentle:i})}this.notify()}}applyView(t){this.app.viewChosen||this.app.setView(zx(t))}showEra(t,e){const n=this.ui;this.applyView(null),n.pins.activeEvent=null,n.pins.setStopPlace(null),n.card.openEra(t);const i=t.island?this.islandView(t.island,this.homeYaw()):this.chainView();this.setS(t.index,this.fly(i,e),e)}showEvent(t,{jump:e,gentle:n}){const i=this.ui;this.applyView(t),this.prefetch(t),i.pins.activeEvent=t,i.pins.setStopPlace(null),i.card.open(t);const r=this.fly(n?this.gentleView(t):this.eventView(t),e),o=this.app.timeline,[a,l]=o.window,c=Ia(t);n&&c&&c[1]>=a&&c[0]<=l||this.setYear(this.stepYear(t,this.current),r,e)}goStop(t,{jump:e=!1}={}){const n=this.event,i=(n==null?void 0:n.stops)||[];if(!n||t<-1||t>=i.length)return;const r=this.ui;this.active=!0,this.stop=t,this.applyView(n),r.pins.activeEvent=n,r.card.ev!==n&&r.card.open(n),r.card.setStop(t);const o=i[t],a=o?this.places.get(o.place):null,l=a&&on(a.geometry);if(r.pins.setStopPlace(l?a:null),this.prefetch(n),o){const c=l?o.camera?this.cameraView(a,o.camera):this.pointView(a,Kn[o.zoom]??Kn.island):null,h=this.fly(c,e);Number.isFinite(o.year)&&this.setYear(o.year,h,e)}this.notify()}prefetch(t){const e=this.app.districts;if(e)for(const n of(t==null?void 0:t.stops)||[]){const i=this.places.get(n.place),r=i&&on(i.geometry);if(!r||n.zoom==="far")continue;const[o,a]=this.app.data.proj.toWorld(r);if(e.prefetch(o,a))return}}stepYear(t,e){const n=this.app.timeline,i=xr(t),r=Ia(t)||[i,i],o=n.yearAt(e.index-.5),a=n.yearAt(e.index+.5);return i>=o&&i<=a?i:r[1]>=o&&r[0]<=a?Ai(e.era.year,Math.max(r[0],o),Math.min(r[1],a)):i}setYear(t,e,n){this.setS(this.app.timeline.sAtYear(t),e,n)}setS(t,e,n){const i=this.ui.timeline;n?(i.tween=null,this.app.timeline.set(t)):i.easeTo(t,Ai(e*.8,.6,2.4))}homeYaw(t=this.ui.freeBox()){return(t.x1-t.x0)/Math.max(1,t.y1-t.y0)<.85?1.1:0}tilt(){const t=this.app.rig.goal;return Ai(t.pitch-Qn(t.distance),-.3,.3)}chainView(){const t=this.ui.freeBox();let e=null;for(const n of this.islands.values()){const i=n.rect;e=e?{x0:Math.min(e.x0,i.x0),z0:Math.min(e.z0,i.z0),x1:Math.max(e.x1,i.x1),z1:Math.max(e.z1,i.z1)}:{...i}}return this.app.rig.fit({rect:e||this.app.world.bounds,yaw:this.homeYaw(t),box:t})}islandView(t,e=this.app.rig.goal.yaw,n=0){const i=this.islands.get(t);return this.app.rig.fit({rect:i.rect,yaw:e,tilt:n,box:this.ui.freeBox()})}pointView(t,e,{towardChain:n=0}={}){let[i,r]=this.app.data.proj.toWorld(on(t.geometry));if(n){const o=this.app.world.bounds,a=(o.x0+o.x1)/2-i,l=(o.z0+o.z1)/2-r,c=Math.min(n,900/Math.max(1,Math.hypot(a,l)));i+=a*c,r+=l*c}return this.app.rig.fit({rect:{x0:i,x1:i,z0:r,z1:r},distance:e,tilt:this.tilt(),box:this.ui.freeBox()})}cameraView(t,e){const[n,i]=this.app.data.proj.toWorld(on(t.geometry));return this.app.rig.fit({rect:{x0:n,x1:n,z0:i,z1:i},distance:e.distance,yaw:-e.bearing*Math.PI/180,pitch:e.pitch*Math.PI/2,box:this.ui.freeBox()})}eventView(t){const e=this.placeOf(t);if(!e)return null;const n=mc(t.zoom);return n==="near"?this.pointView(e,Kn.near):n==="island"&&this.islands.has(e.island)?this.islandView(e.island,this.app.rig.goal.yaw,this.tilt()):n==="island"?this.pointView(e,Kn.island):!e.island&&e.placePrecision==="island"?this.chainView():this.pointView(e,Kn.far,{towardChain:.35})}gentleView(t){const e=this.placeOf(t);if(!e)return null;const n=Kn[mc(t.zoom)];return this.pointView(e,Math.min(this.app.rig.goal.distance,Math.max(n,Kn.island)))}fly(t,e=!1){if(!t)return 1;const n=this.app.rig;if(e)return n.jump({x:t.target.x,z:t.target.z,distance:t.distance,yaw:t.yaw,pitch:t.pitch}),0;const i=n.goal,r=Math.hypot(i.target.x-t.target.x,i.target.z-t.target.z),o=Math.abs(Math.log(t.distance/Math.max(1,i.distance))),a=Ai(1.1+Math.sqrt(r)*.032+o*.28,1.1,3.4),l=this.app.districts,c=l&&t.distance<130?l.prefetch(t.target.x,t.target.z):null;return n.flyTo(t,a,c?{ready:()=>l.readyAt(t.target.x,t.target.z)}:{}),a}describe(){const t=this.chapters.length?this.chapters[this.active?this.chapter:this.nearestChapter()]:null;return t?{active:this.active,opening:this.active&&this.step<0,number:t.index+1,of:this.chapters.length,chapter:`Chapter ${t.index+1} of ${this.chapters.length}`,name:t.name,step:this.active&&this.step>=0?`${this.step+1} of ${t.events.length}`:""}:null}}const Bx=.05,gc=.25;class Hx{constructor(t){this.app=t,t.ui=this,this.build(),this.bind(),t.updaters.push(e=>this.update(e)),!t.params.has("year")&&!t.params.has("cam")&&this.tour.chapters.length&&(this.tour.begin(),this.timeline.el.classList.add("invite"))}build(){const t=this.app,e=Pe("div",{id:"ui"});document.body.appendChild(e),this.root=e;const n=t.world.archPack.name;this.brand=Pe("div",{class:"brand"},`<div class="brand-name">Holo i ke Au</div><div class="brand-sub"><span class="where">${_t(n)}</span><span class="loading"></span></div>`),e.appendChild(this.brand),this.tools=Pe("div",{class:"tools"});const i=(o,a,l,c)=>Pe("button",{class:`tool${c?" on":""}`,"data-tool":o,title:l,"aria-label":l,"aria-pressed":String(!!c)},an(a,20));this.tools.append(i("lines","lines","Moku and ahupuaʻa boundaries",t.overlay.lines),i("routes","routes","Voyages, fleets and ships at sea",t.overlay.routes),i("pins","pins","Events",t.overlay.pins),i("home","home","The whole chain"),i("help","help","About"),i("full","expand","Full screen")),e.appendChild(this.tools),this.legend=Pe("div",{class:"legend"}),this.legend.innerHTML=`
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
      </div>
      <div class="lg-body"></div>`,this.legendBody=$e(".lg-body",this.legend),this.legend.inert=!0,e.appendChild(this.legend),this.inspector=Pe("div",{class:"inspector"}),e.appendChild(this.inspector),this.timeline=new Lx(e,t,this),this.pins=new Dx(e,t,{onOpen:o=>this.openEvent(o),onCluster:o=>this.openCluster(o)}),this.card=new Nx(e,t,this),this.tour=new Ox(t,this),t.tour=this.tour,this.tour.onChange(o=>this.timeline.refreshTour(o)),t.timeline.onChange(()=>this.timeline.refreshTour(this.tour)),this.timeline.refreshTour(this.tour),this.help=Pe("div",{class:"help hidden"});const r=this.credits();this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${an("close",18)}</button>
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
      </div>`,e.appendChild(this.help),this.refreshLegend()}credits(){var i,r;const t=this.app.data,e=new Map,n=o=>{o&&o.id&&!e.has(o.id)&&e.set(o.id,o)};for(const o of t.packs)for(const a of o.sources||[])n(a);for(const o of((i=t.moku)==null?void 0:i.sources)||[])n(o);for(const o of((r=t.ahupuaa)==null?void 0:r.sources)||[])n(o);return xc([...e.values()])}landCredits(){const t=$e(".land-credits",this.help),e=this.app.land.manifest;if(!t||!e||t.childElementCount)return;const n=new Map;for(const i of Object.values(e.methods||{}))for(const r of Object.values(i||{}))for(const o of(r==null?void 0:r.sources)||[])o!=null&&o.id&&/^https?:/.test(o.url||"")&&!n.has(o.id)&&n.set(o.id,o);n.size&&(t.innerHTML=`<h3>Land layers</h3><ul class="credits">${xc([...n.values()])}</ul>`)}bind(){const t=this.app;this.tools.addEventListener("click",i=>{var a,l,c;const r=i.target.closest("[data-tool]");if(!r)return;const o=r.dataset.tool;if(o==="help")this.help.classList.toggle("hidden");else if(o==="full")document.fullscreenElement?(a=document.exitFullscreen)==null||a.call(document):(c=(l=document.documentElement).requestFullscreen)==null||c.call(l).catch(()=>{});else if(o==="home"){const h=t.rig;h.home=this.tour.chainView(),h.flyTo({target:h.home.target,distance:h.home.distance,yaw:h.home.yaw,pitch:h.home.pitch},3)}else o in t.overlay&&(t.overlay[o]=!t.overlay[o],r.classList.toggle("on",t.overlay[o]),r.setAttribute("aria-pressed",String(t.overlay[o])))}),this.legend.addEventListener("click",i=>{const r=i.target.closest("[data-view]");if(!r||r.disabled)return;const o=r.dataset.view;t.setView(t.view===o?null:o,{user:!0})}),t.onView(()=>this.refreshLegend()),t.land.onChange(()=>{this.refreshLegend(),this.landCredits()}),this.help.addEventListener("click",i=>{(i.target===this.help||i.target.closest(".help-close"))&&this.help.classList.add("hidden")}),t.timeline.onChange(()=>{t.timeline.era!==this.legendEra&&this.refreshLegend()});const e=t.canvas;let n=0;e.addEventListener("pointermove",i=>{if(i.buttons||i.pointerType==="touch")return this.hover(null);const r=performance.now();r-n<70||(n=r,this.hover(i.clientX,i.clientY))}),e.addEventListener("pointerleave",()=>this.hover(null)),e.addEventListener("pointerdown",()=>this.hover(null)),addEventListener("keydown",i=>{var o,a,l,c;if(i.key==="Escape"){this.help.classList.contains("hidden")?this.card.close():this.help.classList.add("hidden");return}if((a=(o=i.target).closest)!=null&&a.call(o,"input, textarea, select")||i.altKey||i.ctrlKey||i.metaKey||!this.help.classList.contains("hidden"))return;const r=this.tour;i.key==="ArrowRight"||i.key===" "&&!((c=(l=i.target).closest)!=null&&c.call(l,"button, a"))?(i.preventDefault(),this.timeline.el.classList.remove("invite"),r.next()):i.key==="ArrowLeft"?(i.preventDefault(),r.back()):i.key===","||i.key==="<"?r.skip(-1):(i.key==="."||i.key===">")&&r.skip(1)})}openEvent(t){this.tour.open(t,{gentle:!0})}openCluster(t){const e=this.tour;this.pins.activeEvent=e.active?e.event:null,this.card.openList(t)}onCardClosed(){const t=this.tour;t.active&&t.event||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}onScrub(t=this.app.timeline.s){var i;this.tour.leave();const n=this.app.timeline;this.card.mode==="era"&&((i=this.card.chapter)==null?void 0:i.era)!==n.eras[Math.round(Math.max(0,Math.min(n.max,t)))]&&this.card.close(),this.card.ev||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}freeBox(){const t=innerWidth,e=innerHeight,n={x0:16,y0:72,x1:t-16,y1:e-16},i=this.timeline.el;!i.hidden&&i.offsetHeight&&(n.y1=Math.min(n.y1,i.offsetTop-14));const r=this.card.el;return this.card.isOpen&&r.offsetWidth&&(r.offsetLeft>t*.35?n.x1=Math.min(n.x1,r.offsetLeft-16):n.y1=Math.min(n.y1,r.offsetTop-12)),n.y1-n.y0<120&&(n.y1=n.y0+120),n}farStrength(t=this.app.rig.state.distance){return this.app.view==="land"?Na(t):_r(t)}inspectorAllowed(){var i,r;const t=this.app,e=this.farStrength();return!!((i=t.districts)!=null&&i.on||((r=t.districts)==null?void 0:r.k)>0)||e<Bx?this.nearHeld=!0:e>gc&&(this.nearHeld=!1),!this.nearHeld}hideInspector(){this.app.shared.uniforms.uHoverMoku.value=0,this.inspector.classList.remove("show"),this.inspectorKey=null}hover(t,e){var m;const n=this.app,i=n.shared.uniforms;if(t==null||!this.inspectorAllowed())return this.hideInspector();const r=n.rig.pickGround(t,e),o=r&&n.world.metresAt(r.x,r.z)>0?n.polity.mokuAt(r.x,r.z):null,a=n.view==="land"&&n.landK>.25,l=_r(n.rig.state.distance)<.05;if(i.uHoverMoku.value=o&&!a&&!l?o.index:0,!o){this.inspector.classList.remove("show");return}const c=a?n.land.valuesAt(r.x,r.z):null,h=`${o.index}:${(m=n.timeline.era)==null?void 0:m.id}:${c?JSON.stringify(c):""}`;if(this.inspectorKey!==h){this.inspectorKey=h;const v=n.polity.holder(n.timeline.era,o),g=(p,u)=>`<div class="in-row"><span class="in-k">${p}</span>${u}</div>`;this.inspector.innerHTML=`
        <div class="in-head"><b>${_t(o.name)}</b><span class="in-island">${_t(o.island||"")}</span></div>
        ${g("moku",v?`<span class="in-pol"><i style="background:${_t(v.colour)}"></i>${_t(v.name)}</span>`:'<span class="in-none">no polity recorded</span>')}
        ${c?g("fields",vc(c.cultivation))+g("people",Gx(c.people))+g("forest",vc(c.forest)):""}`}this.inspector.classList.add("show");const f=Math.min(innerWidth-250,t+18),d=Math.max(70,Math.min(innerHeight-120,e+18));this.inspector.style.transform=`translate(${f}px, ${d}px)`}refreshLegend(){const t=this.app,e=t.timeline.era;this.legendEra=e;for(const r of this.legend.querySelectorAll("[data-view]"))r.setAttribute("aria-pressed",String(t.view===r.dataset.view)),r.classList.toggle("on",t.view===r.dataset.view);const n=$e('[data-view="land"]',this.legend);n.disabled=t.land.available===!1,n.title=n.disabled?"No land layers in this data":"Cultivation, settlement and forest in the chosen year";let i="";if(t.view==="chiefdoms"){const r=t.polity.politiesIn(e);r.length&&(i=`<div class="lg-title">${_t((e==null?void 0:e.label)||"")}</div>${r.map(o=>`<div class="lg"><i style="background:${_t(o.colour)}"></i><b>${_t(o.name)}</b></div>`).join("")}`)}else if(t.view==="land"){const r=t.land.describe();if(this.legendLand=JSON.stringify(r),r){const o=r.years.length>1?`between the ${r.years[0]} and ${r.years[1]} layers`:`the ${r.years[0]} layers`,a=t.land.bound?r.early?`${o}, thinned for the early centuries`:o:"the layers are on their way";i=`<div class="lg-title">${_t((e==null?void 0:e.label)||"")}</div>${r.layers.map(l=>`<div class="lg lg-land"><i class="sw-${l.id}"></i><b>${_t(l.name)}</b>${l.note?`<em>${_t(l.note)}</em>`:""}</div>`).join("")}<div class="lg-note">${_t(a)}</div>`}}this.legendBody.innerHTML=i}setLoading(t){$e(".loading",this.brand).textContent=t||""}update(t){const e=this.app,n=performance.now();this.timeline.update(t),this.pins.update(e.overlay.pins);const i=this.farStrength()>gc;if(i!==this.legend.classList.contains("show")&&(this.legend.classList.toggle("show",i),this.legend.inert=!i),!this.inspectorAllowed()&&(this.inspector.classList.contains("show")||e.shared.uniforms.uHoverMoku.value)&&this.hideInspector(),e.view==="land"&&n-(this.landAt||0)>250&&(this.landAt=n,(JSON.stringify(e.land.describe())!==this.legendLand||!e.land.bound!==this.legendWaiting)&&(this.legendWaiting=!e.land.bound,this.refreshLegend())),n-(this.whereAt||0)>300){this.whereAt=n;const r=e.rig.state.target,o=e.rig.state.distance<1400?e.world.islandAt(r.x,r.z):null;$e(".where",this.brand).textContent=o?o.pack.name:e.world.archPack.name}}}function vc(s){const t=s*100;return t<.5?'<span class="in-none">none</span>':t<1?"under 1%":`${Math.round(t)}%`}function Gx(s){return s<.5?'<span class="in-none">none</span>':`about ${(s<10?Math.round(s):Number(s.toPrecision(2))).toLocaleString("en-US")} a km²`}function xc(s){return s.map(t=>`<li>${t.url&&/^https?:/.test(t.url)?`<a href="${_t(t.url)}" target="_blank" rel="noopener">${_t(t.title||t.id)}</a>`:_t(t.title||t.id)}${t.licence?` <em>${_t(t.licence)}</em>`:""}${t.fetched?` <em>fetched ${_t(t.fetched)}</em>`:""}</li>`).join("")}const Mr=document.getElementById("boot"),wh=Mr.querySelector(".boot-bar span"),Sh=Mr.querySelector(".boot-stage"),sr=(s,t)=>{Sh.textContent=s,wh.style.width=`${Math.round(t*100)}%`},Li=s=>{console.warn(s)};async function Vx(){const s=performance.now();sr("reading the gazetteer",.05);const t=await Hh(Uh(),Li);if(!t.packs.length)throw new Error("the manifest lists no packs");const e=new Cx(document.getElementById("scene"),t,{warn:Li});window.__app=e;const n=new Vh(2,Li);sr("raising the islands",.25);const i=e.world.archPack;i.data=await n.decode(i),sr("placing the boundaries",.8),await new Promise(l=>setTimeout(l,0)),e.start();const r=new Hx(e);e.ui=r,console.log(`archipelago ready in ${((performance.now()-s)/1e3).toFixed(1)} s`),sr("",1);let o=0;const a=()=>{if(++o<4)return requestAnimationFrame(a);Mr.classList.add("gone"),setTimeout(()=>Mr.remove(),1200),Wx(e,r,n),e.patches.load().catch(l=>{Li(`patches: ${l.message}`),e.patches.resolveReady([])}),e.districts.load().catch(l=>Li(`districts: ${l.message}`))};requestAnimationFrame(a)}async function Wx(s,t,e){const n=s.rig.state.target,i=a=>Math.hypot((a.rect.x0+a.rect.x1)/2-n.x,(a.rect.z0+a.rect.z1)/2-n.z),r=[...s.world.islandPacks].sort((a,l)=>i(a)-i(l));let o=0;t.setLoading(r.length?`· ${r.length} islands to come`:""),await Promise.all(r.map(async a=>{try{a.data=await e.decode(a),s.addIsland(a)}catch(l){Li(`${a.id}: ${l.message}`)}o++,t.setLoading(o<r.length?`· ${r.length-o} islands to come`:"")})),e.dispose(),s.islandsLoaded=!0,s.land.load()}Vx().catch(s=>{console.error(s),Sh.textContent="something went wrong — see the console",wh.style.background="#c0584a"});
