(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const ms=100,nc=8,aa=9e3,gs=1.3,ic=5.5,oa=100,sc=6e3;function la(s){const t=Math.log(Math.max(1,s)/oa)/Math.log(sc/oa),e=Math.max(0,Math.min(1,t));return gs+(ic-gs)*e*e*(3-2*e)}const rl=2,vn=5;function rc(){const t=new URLSearchParams(location.search).get("data")||"./data/";return t.endsWith("/")?t:`${t}/`}const ac=Math.PI/180;class oc{constructor({lat0:t=20.5,lon0:e=-157.5}={}){this.lat0=t,this.lon0=e,this.kx=Math.cos(t*ac)*111320/ms,this.kz=110574/ms}x(t){return(t-this.lon0)*this.kx}z(t){return-(t-this.lat0)*this.kz}toWorld(t){return[this.x(t[0]),this.z(t[1])]}toLonLat(t,e){return[t/this.kx+this.lon0,-e/this.kz+this.lat0]}rect([t,e,n,i]){return{x0:this.x(t),z0:this.z(i),x1:this.x(n),z1:this.z(e)}}}function ds(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[ʻʼ‘’'`]/g,"").toLowerCase().replace(/[^a-z]/g,"")}function Un(s){if(!s)return null;if(s.type==="Point")return s.coordinates;if(s.type==="LineString")return s.coordinates[Math.floor(s.coordinates.length/2)];if(s.type==="MultiPoint")return s.coordinates[0];const t=s.type==="Polygon"?[s.coordinates[0]]:s.type==="MultiPolygon"?s.coordinates.map(r=>r[0]):null;if(!t)return null;let e=0,n=0,i=0;for(const r of t)for(let o=0,a=r.length-1;o<r.length;a=o++){const l=r[a][0]*r[o][1]-r[o][0]*r[a][1];e+=l,n+=(r[a][0]+r[o][0])*l,i+=(r[a][1]+r[o][1])*l}return Math.abs(e)<1e-12?t[0][0]:[n/(3*e),i/(3*e)]}async function vs(s){var c;const t=await fetch(s);if(!t.ok)throw new Error(`${s}: HTTP ${t.status}`);const e=await t.blob(),n=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),i=n.width,r=n.height;let o;typeof OffscreenCanvas<"u"?o=new OffscreenCanvas(i,r):(o=document.createElement("canvas"),o.width=i,o.height=r);const a=o.getContext("2d",{willReadFrequently:!0});a.imageSmoothingEnabled=!1,a.drawImage(n,0,0);const l=a.getImageData(0,0,i,r).data;return(c=n.close)==null||c.call(n),{px:l,W:i,H:r}}function lc(s,t,e,n,i,r=4){const o=new Float32Array(t*e);for(let a=0,l=0;a<t*e;a++,l+=r)o[a]=(s[l]*256+s[l+1])*n+i;return o}function cc(s,t,e,n=4){const i=new Uint8Array(t*e);for(let r=0,o=0;r<t*e;r++,o+=n)i[r]=s[o];return i}function hc(s){let t=0,e=0;for(let n=0;n<s.length;n+=7)s[n]>0||(t++,s[n]>-1.6&&e++);return t>100&&e>t*.95}function uc(s,t,e,n,i){const r=al(t,e,o=>s[o]>0,n,i);for(let o=0;o<s.length;o++){if(s[o]>0)continue;const a=r[o]/1e3;s[o]=-(1+30*a+3600*(1-Math.exp(-Math.max(0,a-.6)/6)))}}function ca(s,t,e,n,i=1){let r=Float32Array.from(s);const o=new Float32Array(t*e),a=1/(2*n+1);for(let l=0;l<i;l++){for(let c=0;c<e;c++){const h=c*t;let d=0;for(let f=-n;f<=n;f++)d+=r[h+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)o[h+f]=d*a,d+=r[h+Math.min(t-1,f+n+1)]-r[h+Math.max(0,f-n)]}for(let c=0;c<t;c++){let h=0;for(let d=-n;d<=n;d++)h+=o[Math.min(e-1,Math.max(0,d))*t+c];for(let d=0;d<e;d++)r[d*t+c]=h*a,h+=o[Math.min(e-1,d+n+1)*t+c]-o[Math.max(0,d-n)*t+c]}}return r}function ha(s,t,e,n,i,r){const o=r*r;let a=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let l=1;l<t;l++){let c=(s[l]+l*l*o-(s[n[a]]+n[a]*n[a]*o))/(2*o*(l-n[a]));for(;c<=i[a];)a--,c=(s[l]+l*l*o-(s[n[a]]+n[a]*n[a]*o))/(2*o*(l-n[a]));a++,n[a]=l,i[a]=c,i[a+1]=1/0}a=0;for(let l=0;l<t;l++){for(;i[a+1]<l;)a++;const c=(l-n[a])*r;e[l]=c*c+s[n[a]]}}function al(s,t,e,n=1,i=1){const o=new Float64Array(s*t);for(let m=0;m<s*t;m++)o[m]=e(m)?0:1e20;const a=Math.max(s,t),l=new Float64Array(a),c=new Float64Array(a),h=new Int32Array(a),d=new Float64Array(a+1);for(let m=0;m<s;m++){for(let v=0;v<t;v++)l[v]=o[v*s+m];ha(l,t,c,h,d,i);for(let v=0;v<t;v++)o[v*s+m]=c[v]}const f=new Float32Array(s*t);for(let m=0;m<t;m++){const v=m*s;for(let g=0;g<s;g++)l[g]=o[v+g];ha(l,s,c,h,d,n);for(let g=0;g<s;g++)f[v+g]=Math.sqrt(c[g])}return f}function dc(s,t,e,n,i){const r=Math.max(1,Math.round(Math.max(t,e)/512)),o=Math.ceil(t/r),a=Math.ceil(e/r),l=new Float32Array(o*a);for(let f=0;f<a;f++)for(let m=0;m<o;m++){let v=0,g=0;for(let p=f*r;p<Math.min(e,(f+1)*r);p++)for(let u=m*r;u<Math.min(t,(m+1)*r);u++)v+=Math.max(0,s[p*t+u]),g++;l[f*o+m]=v/g*gs}const c=new Float32Array(o*a),h=[1,2,3,5,7,10,14,19,26,34],d=[];for(let f=0;f<8;f++)d.push([Math.cos(f*Math.PI/4),Math.sin(f*Math.PI/4)]);for(let f=0;f<a;f++)for(let m=0;m<o;m++){const v=l[f*o+m];if(v<=0){c[f*o+m]=1;continue}let g=0;for(const[p,u]of d){let y=0;const x=Math.hypot(p*n,u*i)*r;for(const E of h){const R=Math.round(m+p*E),T=Math.round(f+u*E);if(R<0||T<0||R>=o||T>=a)break;const A=(l[T*o+R]-v)/(E*x);A>y&&(y=A)}g+=y/Math.sqrt(1+y*y)}c[f*o+m]=1-g/8*.95}return{data:c,w:o,h:a,f:r}}function fc(s,t,e,n,i,r){const o=new Uint8Array(t*e*4),a=rl;for(let l=0;l<e;l++){const c=Math.max(0,l-1),h=Math.min(e-1,l+1);for(let d=0;d<t;d++){const f=l*t+d,m=Math.max(0,d-1),v=Math.min(t-1,d+1),g=(s[l*t+v]-s[l*t+m])/((v-m)*n),p=(s[h*t+d]-s[c*t+d])/((h-c)*i),u=-g*a,y=-p*a,x=Math.hypot(u,1,y);o[f*4]=Math.round((u/x*.5+.5)*255),o[f*4+1]=Math.round((1/x*.5+.5)*255),o[f*4+2]=Math.round((y/x*.5+.5)*255);let E=1;if(r){const R=Math.min(r.w-1.001,Math.max(0,(d+.5)/r.f-.5)),T=Math.min(r.h-1.001,Math.max(0,(l+.5)/r.f-.5)),A=R|0,N=T|0,_=R-A,M=T-N,P=N*r.w+A,U=r.data,V=Math.min(r.w-1,A+1)-A,L=Math.min(r.h-1,N+1)-N,F=U[P]+(U[P+V]-U[P])*_,G=U[P+L*r.w]+(U[P+L*r.w+V]-U[P+L*r.w])*_;E=F+(G-F)*M}o[f*4+3]=Math.round(Math.max(0,Math.min(1,E))*255)}}return o}function pc(s,t,e,n,i){const r=t*e,o=n*i/1e6,a=new Float32Array(r);let l=0,c=0;for(let p=0;p<r;p++)s[p]>0&&(a[p]=o,s[p]>l&&(l=s[p]),c++);if(!c)return a;const h=Math.min(65536,Math.ceil(l)+2),d=p=>Math.min(h-1,Math.floor(p/l*(h-2))),f=new Uint32Array(h+1);for(let p=0;p<r;p++)s[p]>0&&f[d(s[p])+1]++;for(let p=0;p<h;p++)f[p+1]+=f[p];const m=new Uint32Array(c),v=f.slice();for(let p=0;p<r;p++)s[p]>0&&(m[v[d(s[p])]++]=p);const g=Math.hypot(n,i);for(let p=c-1;p>=0;p--){const u=m[p],y=u%t,x=(u-y)/t,E=s[u];let R=-1,T=0;for(let A=-1;A<=1;A++){const N=x+A;if(!(N<0||N>=e))for(let _=-1;_<=1;_++){if(!_&&!A)continue;const M=y+_;if(M<0||M>=t)continue;const P=N*t+M,U=(E-s[P])/(_&&A?g:_?n:i);U>T&&(T=U,R=P)}}R>=0&&s[R]>0&&(a[R]+=a[u])}return a}function mc(s,t,e,n,i,r){const o=e*n,a=new Uint8Array(o*4),l=pc(s,e,n,i,r),c=i*r/1e6,h=Math.max(.04,4*c),d=new Float32Array(o);for(let u=0;u<o;u++)d[u]=s[u]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,l[u])/h)/1.6)):0;const f=ca(d,e,n,1,2),m=al(e,n,u=>s[u]<=0,i,r),v=new Float32Array(o);for(let u=0;u<n;u++)for(let y=0;y<e;y++){const x=u*e+y;if(s[x]<=0||s[x]>9)continue;const E=Math.min(e-1,y+1),R=Math.max(0,y-1),T=Math.min(n-1,u+1),A=Math.max(0,u-1),N=Math.hypot((s[u*e+E]-s[u*e+R])/((E-R)*i),(s[T*e+y]-s[A*e+y])/((T-A)*r));v[x]=m[x]<260+Math.max(i,r)&&N<.12?1:0}const g=ca(v,e,n,1,1),p=1.5*Math.min(1,70/Math.max(i,r));for(let u=0;u<o;u++)a[u*4]=t?t[u]:s[u]>0?82:0,a[u*4+1]=Math.round(255*Math.min(1,g[u]*p)),a[u*4+2]=Math.round(255*Math.min(1,f[u]*1.6)),a[u*4+3]=0;return a}function gc({heightPx:s,rainPx:t,W:e,H:n,scale:i,offset:r,mx:o,mz:a,stride:l=4}){const c=lc(s,e,n,i,r,l),h=hc(c);h&&uc(c,e,n,o,a);const d=t?cc(t,e,n,l):null,f=dc(c,e,n,o,a),m=fc(c,e,n,o,a,f),v=mc(c,d,e,n,o,a);let g=1/0,p=-1/0;for(let u=0;u<c.length;u++)c[u]<g&&(g=c[u]),c[u]>p&&(p=c[u]);return{metres:c,normals:m,land:v,flatSea:h,lo:g,hi:p}}async function un(s,t,e){try{const n=await fetch(s);if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}catch(n){if(t===void 0)throw new Error(`${s}: ${n.message}`);return e==null||e(`${s}: ${n.message} (carrying on without it)`),t}}const Oi=(s,t)=>Array.isArray(s)?s:Array.isArray(s==null?void 0:s[t])?s[t]:[];async function vc(s,t=console.warn){const e=m=>new URL(m,new URL(s,location.href)).href,n=await un(e("manifest.json")),[i,r,o,a,l,c,h]=await Promise.all([un(e("boundaries/moku.geojson"),null,t),un(e("boundaries/ahupuaa.geojson"),null,t),un(e("eras.json"),[],t),un(e("places.json"),[],t),un(e("events.json"),[],t),un(e("sources.json"),[],t),un(e("polities.json"),{polities:[],byEra:{}},t)]),d=new oc(n.projection||{}),f=(n.packs||[]).map(m=>_c(m,d,e));return{base:s,abs:e,manifest:n,proj:d,packs:f,moku:i,ahupuaa:r,eras:Oi(o,"eras"),places:Oi(a,"places"),events:Oi(l,"events"),sources:Oi(c,"sources"),polities:{polities:(h==null?void 0:h.polities)||[],byEra:(h==null?void 0:h.byEra)||{}}}}function _c(s,t,e){var o;const n=t.rect(s.bounds),[i,r]=s.size;return{id:s.id,kind:s.kind,name:s.name||s.id,desc:s,rect:n,W:i,H:r,mx:(n.x1-n.x0)*ms/i,mz:(n.z1-n.z0)*ms/r,heightUrl:e(s.height.file),rainUrl:(o=s.rain)!=null&&o.file?e(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,sources:s.sources||[],data:null}}class xc{constructor(t=2,e=console.warn){this.warn=e,this.jobs=new Map,this.next=1,this.workers=[],this.free=[],this.queue=[];try{for(let n=0;n<t;n++){const i=new Worker(new URL(""+new URL("worker-D-2AoFNa.js",import.meta.url).href,import.meta.url),{type:"module"});i.onmessage=r=>this.message(i,r.data),i.onerror=r=>{var o;(o=r.preventDefault)==null||o.call(r),this.fallback=!0;for(const[a,l]of this.jobs)l.worker===i&&this.mainThread(a,l)},this.workers.push(i),this.free.push(i)}}catch{this.fallback=!0}}decode(t){return new Promise((e,n)=>{const i=this.next++,r={pack:t,resolve:e,reject:n};this.jobs.set(i,r),this.fallback||!this.workers.length?this.mainThread(i,r):(this.queue.push(i),this.pump())})}pump(){for(;this.free.length&&this.queue.length;){const t=this.queue.shift(),e=this.jobs.get(t),n=this.free.pop();e.worker=n;const i=e.pack;n.postMessage({job:t,heightUrl:i.heightUrl,rainUrl:i.rainUrl,W:i.W,H:i.H,scale:i.scale,offset:i.offset,mx:i.mx,mz:i.mz})}}message(t,e){const n=this.jobs.get(e.job);if(n){if(e.warn)return this.warn(e.warn);this.jobs.delete(e.job),this.free.push(t),e.ok?n.resolve(e):/OffscreenCanvas|getContext|createImageBitmap/i.test(e.message)?(this.fallback=!0,this.jobs.set(e.job,n),this.mainThread(e.job,n)):n.reject(new Error(e.message)),this.pump()}}async mainThread(t,e){try{const n=e.pack,i=await vs(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);let r=null;n.rainUrl&&(r=await vs(n.rainUrl).then(a=>a.W===n.W&&a.H===n.H?a.px:null).catch(()=>null));const o=gc({heightPx:i.px,rainPx:r,W:n.W,H:n.H,scale:n.scale,offset:n.offset,mx:n.mx,mz:n.mz});this.jobs.delete(t),e.resolve(o)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){for(const t of this.workers)t.terminate()}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const kr="160",Mc=0,ua=1,yc=2,ol=1,Sc=2,sn=3,Mn=0,Ae=1,an=2,_n=0,oi=1,wr=2,da=3,fa=4,Ec=5,Pn=100,bc=101,wc=102,pa=103,ma=104,Tc=200,Ac=201,Rc=202,Cc=203,Tr=204,Ar=205,Lc=206,Pc=207,Dc=208,Uc=209,Ic=210,Nc=211,Fc=212,Oc=213,zc=214,Bc=0,kc=1,Hc=2,_s=3,Gc=4,Vc=5,Wc=6,Xc=7,ll=0,$c=1,qc=2,xn=0,Yc=1,jc=2,Kc=3,Zc=4,Jc=5,Qc=6,cl=300,ci=301,hi=302,Rr=303,Cr=304,Ls=306,xs=1e3,Ce=1001,Lr=1002,Jt=1003,ga=1004,Gs=1005,me=1006,th=1007,On=1008,Re=1009,eh=1010,nh=1011,Hr=1012,hl=1013,on=1014,ln=1015,zn=1016,ul=1017,dl=1018,In=1020,ih=1021,Te=1023,sh=1024,rh=1025,Nn=1026,ui=1027,Ps=1028,fl=1029,ah=1030,pl=1031,ml=1033,Vs=33776,Ws=33777,Xs=33778,$s=33779,va=35840,_a=35841,xa=35842,Ma=35843,gl=36196,ya=37492,Sa=37496,Ea=37808,ba=37809,wa=37810,Ta=37811,Aa=37812,Ra=37813,Ca=37814,La=37815,Pa=37816,Da=37817,Ua=37818,Ia=37819,Na=37820,Fa=37821,qs=36492,Oa=36494,za=36495,oh=36283,Ba=36284,ka=36285,Ha=36286,vl=3e3,Fn=3001,lh=3200,ch=3201,hh=0,uh=1,ke="",he="srgb",hn="srgb-linear",Gr="display-p3",Ds="display-p3-linear",Ms="linear",jt="srgb",ys="rec709",Ss="p3",kn=7680,Ga=519,dh=512,fh=513,ph=514,_l=515,mh=516,gh=517,vh=518,_h=519,Va=35044,xh=35048,Wa="300 es",Pr=1035,cn=2e3,Es=2001;class pi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Xa=1234567;const Ai=Math.PI/180,Pi=180/Math.PI;function mi(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(fe[s&255]+fe[s>>8&255]+fe[s>>16&255]+fe[s>>24&255]+"-"+fe[t&255]+fe[t>>8&255]+"-"+fe[t>>16&15|64]+fe[t>>24&255]+"-"+fe[e&63|128]+fe[e>>8&255]+"-"+fe[e>>16&255]+fe[e>>24&255]+fe[n&255]+fe[n>>8&255]+fe[n>>16&255]+fe[n>>24&255]).toLowerCase()}function we(s,t,e){return Math.max(t,Math.min(e,s))}function Vr(s,t){return(s%t+t)%t}function Mh(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function yh(s,t,e){return s!==t?(e-s)/(t-s):0}function Ri(s,t,e){return(1-e)*s+e*t}function Sh(s,t,e,n){return Ri(s,t,1-Math.exp(-e*n))}function Eh(s,t=1){return t-Math.abs(Vr(s,t*2)-t)}function bh(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function wh(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Th(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Ah(s,t){return s+Math.random()*(t-s)}function Rh(s){return s*(.5-Math.random())}function Ch(s){s!==void 0&&(Xa=s);let t=Xa+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lh(s){return s*Ai}function Ph(s){return s*Pi}function Dr(s){return(s&s-1)===0&&s!==0}function Dh(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function bs(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Uh(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),m=r((n-t)/2),v=o((n-t)/2);switch(i){case"XYX":s.set(a*h,l*d,l*f,a*c);break;case"YZY":s.set(l*f,a*h,l*d,a*c);break;case"ZXZ":s.set(l*d,l*f,a*h,a*c);break;case"XZX":s.set(a*h,l*v,l*m,a*c);break;case"YXY":s.set(l*m,a*h,l*v,a*c);break;case"ZYZ":s.set(l*v,l*m,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function ii(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ye(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Ee={DEG2RAD:Ai,RAD2DEG:Pi,generateUUID:mi,clamp:we,euclideanModulo:Vr,mapLinear:Mh,inverseLerp:yh,lerp:Ri,damp:Sh,pingpong:Eh,smoothstep:bh,smootherstep:wh,randInt:Th,randFloat:Ah,randFloatSpread:Rh,seededRandom:Ch,degToRad:Lh,radToDeg:Ph,isPowerOfTwo:Dr,ceilPowerOfTwo:Dh,floorPowerOfTwo:bs,setQuaternionFromProperEuler:Uh,normalize:ye,denormalize:ii};class Ct{constructor(t=0,e=0){Ct.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(we(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class kt{constructor(t,e,n,i,r,o,a,l,c){kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],m=n[5],v=n[8],g=i[0],p=i[3],u=i[6],y=i[1],x=i[4],E=i[7],R=i[2],T=i[5],A=i[8];return r[0]=o*g+a*y+l*R,r[3]=o*p+a*x+l*T,r[6]=o*u+a*E+l*A,r[1]=c*g+h*y+d*R,r[4]=c*p+h*x+d*T,r[7]=c*u+h*E+d*A,r[2]=f*g+m*y+v*R,r[5]=f*p+m*x+v*T,r[8]=f*u+m*E+v*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,f=a*l-h*r,m=c*r-o*l,v=e*d+n*f+i*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/v;return t[0]=d*g,t[1]=(i*c-h*n)*g,t[2]=(a*n-i*o)*g,t[3]=f*g,t[4]=(h*e-i*l)*g,t[5]=(i*r-a*e)*g,t[6]=m*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ys.makeScale(t,e)),this}rotate(t){return this.premultiply(Ys.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ys.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ys=new kt;function xl(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function ws(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Ih(){const s=ws("canvas");return s.style.display="block",s}const $a={};function Ci(s){s in $a||($a[s]=!0,console.warn(s))}const qa=new kt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ya=new kt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),zi={[hn]:{transfer:Ms,primaries:ys,toReference:s=>s,fromReference:s=>s},[he]:{transfer:jt,primaries:ys,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Ds]:{transfer:Ms,primaries:Ss,toReference:s=>s.applyMatrix3(Ya),fromReference:s=>s.applyMatrix3(qa)},[Gr]:{transfer:jt,primaries:Ss,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Ya),fromReference:s=>s.applyMatrix3(qa).convertLinearToSRGB()}},Nh=new Set([hn,Ds]),Xt={enabled:!0,_workingColorSpace:hn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Nh.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=zi[t].toReference,i=zi[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return zi[s].primaries},getTransfer:function(s){return s===ke?Ms:zi[s].transfer}};function li(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function js(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Hn;class Ml{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Hn===void 0&&(Hn=ws("canvas")),Hn.width=t.width,Hn.height=t.height;const n=Hn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Hn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ws("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=li(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(li(e[n]/255)*255):e[n]=li(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Fh=0;class yl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Fh++}),this.uuid=mi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Ks(i[o].image)):r.push(Ks(i[o]))}else r=Ks(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function Ks(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Ml.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Oh=0;class Le extends pi{constructor(t=Le.DEFAULT_IMAGE,e=Le.DEFAULT_MAPPING,n=Ce,i=Ce,r=me,o=On,a=Te,l=Re,c=Le.DEFAULT_ANISOTROPY,h=ke){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Oh++}),this.uuid=mi(),this.name="",this.source=new yl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ct(0,0),this.repeat=new Ct(1,1),this.center=new Ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Ci("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Fn?he:ke),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==cl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case xs:t.x=t.x-Math.floor(t.x);break;case Ce:t.x=t.x<0?0:1;break;case Lr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case xs:t.y=t.y-Math.floor(t.y);break;case Ce:t.y=t.y<0?0:1;break;case Lr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ci("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===he?Fn:vl}set encoding(t){Ci("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Fn?he:ke}}Le.DEFAULT_IMAGE=null;Le.DEFAULT_MAPPING=cl;Le.DEFAULT_ANISOTROPY=1;class ee{constructor(t=0,e=0,n=0,i=1){ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],d=l[8],f=l[1],m=l[5],v=l[9],g=l[2],p=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-g)<.01&&Math.abs(v-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+g)<.1&&Math.abs(v+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,E=(m+1)/2,R=(u+1)/2,T=(h+f)/4,A=(d+g)/4,N=(v+p)/4;return x>E&&x>R?x<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(x),i=T/n,r=A/n):E>R?E<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(E),n=T/i,r=N/i):R<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(R),n=A/r,i=N/r),this.set(n,i,r,e),this}let y=Math.sqrt((p-v)*(p-v)+(d-g)*(d-g)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(p-v)/y,this.y=(d-g)/y,this.z=(f-h)/y,this.w=Math.acos((c+m+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class zh extends pi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ee(0,0,t,e),this.scissorTest=!1,this.viewport=new ee(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(Ci("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Fn?he:ke),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:me,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Le(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new yl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ke extends zh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Sl extends Le{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=Ce,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Bh extends Le{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=Ce,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Di{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const f=r[o+0],m=r[o+1],v=r[o+2],g=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=m,t[e+2]=v,t[e+3]=g;return}if(d!==g||l!==f||c!==m||h!==v){let p=1-a;const u=l*f+c*m+h*v+d*g,y=u>=0?1:-1,x=1-u*u;if(x>Number.EPSILON){const R=Math.sqrt(x),T=Math.atan2(R,u*y);p=Math.sin(p*T)/R,a=Math.sin(a*T)/R}const E=a*y;if(l=l*p+f*E,c=c*p+m*E,h=h*p+v*E,d=d*p+g*E,p===1-a){const R=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=R,c*=R,h*=R,d*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],f=r[o+1],m=r[o+2],v=r[o+3];return t[e]=a*v+h*d+l*m-c*f,t[e+1]=l*v+h*f+c*d-a*m,t[e+2]=c*v+h*m+a*f-l*d,t[e+3]=h*v-a*d-l*f-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),f=l(n/2),m=l(i/2),v=l(r/2);switch(o){case"XYZ":this._x=f*h*d+c*m*v,this._y=c*m*d-f*h*v,this._z=c*h*v+f*m*d,this._w=c*h*d-f*m*v;break;case"YXZ":this._x=f*h*d+c*m*v,this._y=c*m*d-f*h*v,this._z=c*h*v-f*m*d,this._w=c*h*d+f*m*v;break;case"ZXY":this._x=f*h*d-c*m*v,this._y=c*m*d+f*h*v,this._z=c*h*v+f*m*d,this._w=c*h*d-f*m*v;break;case"ZYX":this._x=f*h*d-c*m*v,this._y=c*m*d+f*h*v,this._z=c*h*v-f*m*d,this._w=c*h*d+f*m*v;break;case"YZX":this._x=f*h*d+c*m*v,this._y=c*m*d+f*h*v,this._z=c*h*v-f*m*d,this._w=c*h*d-f*m*v;break;case"XZY":this._x=f*h*d-c*m*v,this._y=c*m*d-f*h*v,this._z=c*h*v+f*m*d,this._w=c*h*d+f*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-i)*m}else if(n>a&&n>d){const m=2*Math.sqrt(1+n-a-d);this._w=(h-l)/m,this._x=.25*m,this._y=(i+o)/m,this._z=(r+c)/m}else if(a>d){const m=2*Math.sqrt(1+a-n-d);this._w=(r-c)/m,this._x=(i+o)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+d-n-a);this._w=(o-i)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(we(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*i+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=i*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(r),n*Math.cos(r),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ja.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ja.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Zs.copy(this).projectOnVector(t),this.sub(Zs)}reflect(t){return this.sub(Zs.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(we(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Zs=new D,ja=new Di;class Bn{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(He.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(He.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=He.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,He):He.fromBufferAttribute(r,o),He.applyMatrix4(t.matrixWorld),this.expandByPoint(He);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Bi.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Bi.copy(n.boundingBox)),Bi.applyMatrix4(t.matrixWorld),this.union(Bi)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,He),He.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(yi),ki.subVectors(this.max,yi),Gn.subVectors(t.a,yi),Vn.subVectors(t.b,yi),Wn.subVectors(t.c,yi),dn.subVectors(Vn,Gn),fn.subVectors(Wn,Vn),En.subVectors(Gn,Wn);let e=[0,-dn.z,dn.y,0,-fn.z,fn.y,0,-En.z,En.y,dn.z,0,-dn.x,fn.z,0,-fn.x,En.z,0,-En.x,-dn.y,dn.x,0,-fn.y,fn.x,0,-En.y,En.x,0];return!Js(e,Gn,Vn,Wn,ki)||(e=[1,0,0,0,1,0,0,0,1],!Js(e,Gn,Vn,Wn,ki))?!1:(Hi.crossVectors(dn,fn),e=[Hi.x,Hi.y,Hi.z],Js(e,Gn,Vn,Wn,ki))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,He).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(He).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Je[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Je[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Je[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Je[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Je[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Je[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Je[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Je[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Je),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Je=[new D,new D,new D,new D,new D,new D,new D,new D],He=new D,Bi=new Bn,Gn=new D,Vn=new D,Wn=new D,dn=new D,fn=new D,En=new D,yi=new D,ki=new D,Hi=new D,bn=new D;function Js(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){bn.fromArray(s,r);const a=i.x*Math.abs(bn.x)+i.y*Math.abs(bn.y)+i.z*Math.abs(bn.z),l=t.dot(bn),c=e.dot(bn),h=n.dot(bn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const kh=new Bn,Si=new D,Qs=new D;class gi{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):kh.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Si.subVectors(t,this.center);const e=Si.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Si,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Qs.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Si.copy(t.center).add(Qs)),this.expandByPoint(Si.copy(t.center).sub(Qs))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Qe=new D,tr=new D,Gi=new D,pn=new D,er=new D,Vi=new D,nr=new D;class Wr{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Qe)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Qe.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Qe.copy(this.origin).addScaledVector(this.direction,e),Qe.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){tr.copy(t).add(e).multiplyScalar(.5),Gi.copy(e).sub(t).normalize(),pn.copy(this.origin).sub(tr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Gi),a=pn.dot(this.direction),l=-pn.dot(Gi),c=pn.lengthSq(),h=Math.abs(1-o*o);let d,f,m,v;if(h>0)if(d=o*l-a,f=o*a-l,v=r*h,d>=0)if(f>=-v)if(f<=v){const g=1/h;d*=g,f*=g,m=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f<=-v?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c):f<=v?(d=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(tr).addScaledVector(Gi,f),m}intersectSphere(t,e){Qe.subVectors(t.center,this.origin);const n=Qe.dot(this.direction),i=Qe.dot(Qe)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,i=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,i=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(t.min.z-f.z)*d,l=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,l=(t.min.z-f.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Qe)!==null}intersectTriangle(t,e,n,i,r){er.subVectors(e,t),Vi.subVectors(n,t),nr.crossVectors(er,Vi);let o=this.direction.dot(nr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;pn.subVectors(this.origin,t);const l=a*this.direction.dot(Vi.crossVectors(pn,Vi));if(l<0)return null;const c=a*this.direction.dot(er.cross(pn));if(c<0||l+c>o)return null;const h=-a*pn.dot(nr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ne{constructor(t,e,n,i,r,o,a,l,c,h,d,f,m,v,g,p){ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,d,f,m,v,g,p)}set(t,e,n,i,r,o,a,l,c,h,d,f,m,v,g,p){const u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=i,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=m,u[7]=v,u[11]=g,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ne().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/Xn.setFromMatrixColumn(t,0).length(),r=1/Xn.setFromMatrixColumn(t,1).length(),o=1/Xn.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const f=o*h,m=o*d,v=a*h,g=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=m+v*c,e[5]=f-g*c,e[9]=-a*l,e[2]=g-f*c,e[6]=v+m*c,e[10]=o*l}else if(t.order==="YXZ"){const f=l*h,m=l*d,v=c*h,g=c*d;e[0]=f+g*a,e[4]=v*a-m,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=m*a-v,e[6]=g+f*a,e[10]=o*l}else if(t.order==="ZXY"){const f=l*h,m=l*d,v=c*h,g=c*d;e[0]=f-g*a,e[4]=-o*d,e[8]=v+m*a,e[1]=m+v*a,e[5]=o*h,e[9]=g-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const f=o*h,m=o*d,v=a*h,g=a*d;e[0]=l*h,e[4]=v*c-m,e[8]=f*c+g,e[1]=l*d,e[5]=g*c+f,e[9]=m*c-v,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const f=o*l,m=o*c,v=a*l,g=a*c;e[0]=l*h,e[4]=g-f*d,e[8]=v*d+m,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=m*d+v,e[10]=f-g*d}else if(t.order==="XZY"){const f=o*l,m=o*c,v=a*l,g=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=f*d+g,e[5]=o*h,e[9]=m*d-v,e[2]=v*d-m,e[6]=a*h,e[10]=g*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Hh,t,Gh)}lookAt(t,e,n){const i=this.elements;return Ue.subVectors(t,e),Ue.lengthSq()===0&&(Ue.z=1),Ue.normalize(),mn.crossVectors(n,Ue),mn.lengthSq()===0&&(Math.abs(n.z)===1?Ue.x+=1e-4:Ue.z+=1e-4,Ue.normalize(),mn.crossVectors(n,Ue)),mn.normalize(),Wi.crossVectors(Ue,mn),i[0]=mn.x,i[4]=Wi.x,i[8]=Ue.x,i[1]=mn.y,i[5]=Wi.y,i[9]=Ue.y,i[2]=mn.z,i[6]=Wi.z,i[10]=Ue.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],m=n[13],v=n[2],g=n[6],p=n[10],u=n[14],y=n[3],x=n[7],E=n[11],R=n[15],T=i[0],A=i[4],N=i[8],_=i[12],M=i[1],P=i[5],U=i[9],V=i[13],L=i[2],F=i[6],G=i[10],q=i[14],W=i[3],$=i[7],Y=i[11],J=i[15];return r[0]=o*T+a*M+l*L+c*W,r[4]=o*A+a*P+l*F+c*$,r[8]=o*N+a*U+l*G+c*Y,r[12]=o*_+a*V+l*q+c*J,r[1]=h*T+d*M+f*L+m*W,r[5]=h*A+d*P+f*F+m*$,r[9]=h*N+d*U+f*G+m*Y,r[13]=h*_+d*V+f*q+m*J,r[2]=v*T+g*M+p*L+u*W,r[6]=v*A+g*P+p*F+u*$,r[10]=v*N+g*U+p*G+u*Y,r[14]=v*_+g*V+p*q+u*J,r[3]=y*T+x*M+E*L+R*W,r[7]=y*A+x*P+E*F+R*$,r[11]=y*N+x*U+E*G+R*Y,r[15]=y*_+x*V+E*q+R*J,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],f=t[10],m=t[14],v=t[3],g=t[7],p=t[11],u=t[15];return v*(+r*l*d-i*c*d-r*a*f+n*c*f+i*a*m-n*l*m)+g*(+e*l*m-e*c*f+r*o*f-i*o*m+i*c*h-r*l*h)+p*(+e*c*d-e*a*m-r*o*d+n*o*m+r*a*h-n*c*h)+u*(-i*a*h-e*l*d+e*a*f+i*o*d-n*o*f+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],f=t[10],m=t[11],v=t[12],g=t[13],p=t[14],u=t[15],y=d*p*c-g*f*c+g*l*m-a*p*m-d*l*u+a*f*u,x=v*f*c-h*p*c-v*l*m+o*p*m+h*l*u-o*f*u,E=h*g*c-v*d*c+v*a*m-o*g*m-h*a*u+o*d*u,R=v*d*l-h*g*l-v*a*f+o*g*f+h*a*p-o*d*p,T=e*y+n*x+i*E+r*R;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return t[0]=y*A,t[1]=(g*f*r-d*p*r-g*i*m+n*p*m+d*i*u-n*f*u)*A,t[2]=(a*p*r-g*l*r+g*i*c-n*p*c-a*i*u+n*l*u)*A,t[3]=(d*l*r-a*f*r-d*i*c+n*f*c+a*i*m-n*l*m)*A,t[4]=x*A,t[5]=(h*p*r-v*f*r+v*i*m-e*p*m-h*i*u+e*f*u)*A,t[6]=(v*l*r-o*p*r-v*i*c+e*p*c+o*i*u-e*l*u)*A,t[7]=(o*f*r-h*l*r+h*i*c-e*f*c-o*i*m+e*l*m)*A,t[8]=E*A,t[9]=(v*d*r-h*g*r-v*n*m+e*g*m+h*n*u-e*d*u)*A,t[10]=(o*g*r-v*a*r+v*n*c-e*g*c-o*n*u+e*a*u)*A,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*m-e*a*m)*A,t[12]=R*A,t[13]=(h*g*i-v*d*i+v*n*f-e*g*f-h*n*p+e*d*p)*A,t[14]=(v*a*i-o*g*i-v*n*l+e*g*l+o*n*p-e*a*p)*A,t[15]=(o*d*i-h*a*i+h*n*l-e*d*l-o*n*f+e*a*f)*A,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,f=r*c,m=r*h,v=r*d,g=o*h,p=o*d,u=a*d,y=l*c,x=l*h,E=l*d,R=n.x,T=n.y,A=n.z;return i[0]=(1-(g+u))*R,i[1]=(m+E)*R,i[2]=(v-x)*R,i[3]=0,i[4]=(m-E)*T,i[5]=(1-(f+u))*T,i[6]=(p+y)*T,i[7]=0,i[8]=(v+x)*A,i[9]=(p-y)*A,i[10]=(1-(f+g))*A,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=Xn.set(i[0],i[1],i[2]).length();const o=Xn.set(i[4],i[5],i[6]).length(),a=Xn.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Ge.copy(this);const c=1/r,h=1/o,d=1/a;return Ge.elements[0]*=c,Ge.elements[1]*=c,Ge.elements[2]*=c,Ge.elements[4]*=h,Ge.elements[5]*=h,Ge.elements[6]*=h,Ge.elements[8]*=d,Ge.elements[9]*=d,Ge.elements[10]*=d,e.setFromRotationMatrix(Ge),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=cn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i);let m,v;if(a===cn)m=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Es)m=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=cn){const l=this.elements,c=1/(e-t),h=1/(n-i),d=1/(o-r),f=(e+t)*c,m=(n+i)*h;let v,g;if(a===cn)v=(o+r)*d,g=-2*d;else if(a===Es)v=r*d,g=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=g,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Xn=new D,Ge=new ne,Hh=new D(0,0,0),Gh=new D(1,1,1),mn=new D,Wi=new D,Ue=new D,Ka=new ne,Za=new Di;class Us{constructor(t=0,e=0,n=0,i=Us.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],f=i[6],m=i[10];switch(e){case"XYZ":this._y=Math.asin(we(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-we(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(we(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-we(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(we(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-we(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ka.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ka,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Za.setFromEuler(this),this.setFromQuaternion(Za,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Us.DEFAULT_ORDER="XYZ";class Xr{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Vh=0;const Ja=new D,$n=new Di,tn=new ne,Xi=new D,Ei=new D,Wh=new D,Xh=new Di,Qa=new D(1,0,0),to=new D(0,1,0),eo=new D(0,0,1),$h={type:"added"},qh={type:"removed"};class Pe extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vh++}),this.uuid=mi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Pe.DEFAULT_UP.clone();const t=new D,e=new Us,n=new Di,i=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ne},normalMatrix:{value:new kt}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=Pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return $n.setFromAxisAngle(t,e),this.quaternion.multiply($n),this}rotateOnWorldAxis(t,e){return $n.setFromAxisAngle(t,e),this.quaternion.premultiply($n),this}rotateX(t){return this.rotateOnAxis(Qa,t)}rotateY(t){return this.rotateOnAxis(to,t)}rotateZ(t){return this.rotateOnAxis(eo,t)}translateOnAxis(t,e){return Ja.copy(t).applyQuaternion(this.quaternion),this.position.add(Ja.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qa,t)}translateY(t){return this.translateOnAxis(to,t)}translateZ(t){return this.translateOnAxis(eo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(tn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Xi.copy(t):Xi.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ei.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?tn.lookAt(Ei,Xi,this.up):tn.lookAt(Xi,Ei,this.up),this.quaternion.setFromRotationMatrix(tn),i&&(tn.extractRotation(i.matrixWorld),$n.setFromRotationMatrix(tn),this.quaternion.premultiply($n.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent($h)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(qh)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),tn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),tn.multiply(t.parent.matrixWorld)),t.applyMatrix4(tn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ei,t,Wh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ei,Xh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),m=o(t.animations),v=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Pe.DEFAULT_UP=new D(0,1,0);Pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ve=new D,en=new D,ir=new D,nn=new D,qn=new D,Yn=new D,no=new D,sr=new D,rr=new D,ar=new D;let $i=!1;class We{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Ve.subVectors(t,e),i.cross(Ve);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Ve.subVectors(i,e),en.subVectors(n,e),ir.subVectors(t,e);const o=Ve.dot(Ve),a=Ve.dot(en),l=Ve.dot(ir),c=en.dot(en),h=en.dot(ir),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const f=1/d,m=(c*l-a*h)*f,v=(o*h-a*l)*f;return r.set(1-m-v,v,m)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,nn)===null?!1:nn.x>=0&&nn.y>=0&&nn.x+nn.y<=1}static getUV(t,e,n,i,r,o,a,l){return $i===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$i=!0),this.getInterpolation(t,e,n,i,r,o,a,l)}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,nn.x),l.addScaledVector(o,nn.y),l.addScaledVector(a,nn.z),l)}static isFrontFacing(t,e,n,i){return Ve.subVectors(n,e),en.subVectors(t,e),Ve.cross(en).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ve.subVectors(this.c,this.b),en.subVectors(this.a,this.b),Ve.cross(en).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return We.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return We.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,r){return $i===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$i=!0),We.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}getInterpolation(t,e,n,i,r){return We.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return We.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return We.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;qn.subVectors(i,n),Yn.subVectors(r,n),sr.subVectors(t,n);const l=qn.dot(sr),c=Yn.dot(sr);if(l<=0&&c<=0)return e.copy(n);rr.subVectors(t,i);const h=qn.dot(rr),d=Yn.dot(rr);if(h>=0&&d<=h)return e.copy(i);const f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(qn,o);ar.subVectors(t,r);const m=qn.dot(ar),v=Yn.dot(ar);if(v>=0&&m<=v)return e.copy(r);const g=m*c-l*v;if(g<=0&&c>=0&&v<=0)return a=c/(c-v),e.copy(n).addScaledVector(Yn,a);const p=h*v-m*d;if(p<=0&&d-h>=0&&m-v>=0)return no.subVectors(r,i),a=(d-h)/(d-h+(m-v)),e.copy(i).addScaledVector(no,a);const u=1/(p+g+f);return o=g*u,a=f*u,e.copy(n).addScaledVector(qn,o).addScaledVector(Yn,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const El={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gn={h:0,s:0,l:0},qi={h:0,s:0,l:0};function or(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Rt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=he){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Xt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Xt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Xt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Xt.workingColorSpace){if(t=Vr(t,1),e=we(e,0,1),n=we(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=or(o,r,t+1/3),this.g=or(o,r,t),this.b=or(o,r,t-1/3)}return Xt.toWorkingColorSpace(this,i),this}setStyle(t,e=he){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=he){const n=El[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=li(t.r),this.g=li(t.g),this.b=li(t.b),this}copyLinearToSRGB(t){return this.r=js(t.r),this.g=js(t.g),this.b=js(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=he){return Xt.fromWorkingColorSpace(pe.copy(this),t),Math.round(we(pe.r*255,0,255))*65536+Math.round(we(pe.g*255,0,255))*256+Math.round(we(pe.b*255,0,255))}getHexString(t=he){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Xt.workingColorSpace){Xt.fromWorkingColorSpace(pe.copy(this),e);const n=pe.r,i=pe.g,r=pe.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Xt.workingColorSpace){return Xt.fromWorkingColorSpace(pe.copy(this),e),t.r=pe.r,t.g=pe.g,t.b=pe.b,t}getStyle(t=he){Xt.fromWorkingColorSpace(pe.copy(this),t);const e=pe.r,n=pe.g,i=pe.b;return t!==he?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(gn),this.setHSL(gn.h+t,gn.s+e,gn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(gn),t.getHSL(qi);const n=Ri(gn.h,qi.h,e),i=Ri(gn.s,qi.s,e),r=Ri(gn.l,qi.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const pe=new Rt;Rt.NAMES=El;let Yh=0;class Ui extends pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yh++}),this.uuid=mi(),this.name="",this.type="Material",this.blending=oi,this.side=Mn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Tr,this.blendDst=Ar,this.blendEquation=Pn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Rt(0,0,0),this.blendAlpha=0,this.depthFunc=_s,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ga,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=kn,this.stencilZFail=kn,this.stencilZPass=kn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==oi&&(n.blending=this.blending),this.side!==Mn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Tr&&(n.blendSrc=this.blendSrc),this.blendDst!==Ar&&(n.blendDst=this.blendDst),this.blendEquation!==Pn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_s&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ga&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==kn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==kn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==kn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class bl extends Ui{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ll,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const se=new D,Yi=new Ct;class ue{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Va,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Yi.fromBufferAttribute(this,e),Yi.applyMatrix3(t),this.setXY(e,Yi.x,Yi.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)se.fromBufferAttribute(this,e),se.applyMatrix3(t),this.setXYZ(e,se.x,se.y,se.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)se.fromBufferAttribute(this,e),se.applyMatrix4(t),this.setXYZ(e,se.x,se.y,se.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)se.fromBufferAttribute(this,e),se.applyNormalMatrix(t),this.setXYZ(e,se.x,se.y,se.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)se.fromBufferAttribute(this,e),se.transformDirection(t),this.setXYZ(e,se.x,se.y,se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ii(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ye(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ii(e,this.array)),e}setX(t,e){return this.normalized&&(e=ye(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ii(e,this.array)),e}setY(t,e){return this.normalized&&(e=ye(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ii(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ye(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ii(e,this.array)),e}setW(t,e){return this.normalized&&(e=ye(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ye(e,this.array),n=ye(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=ye(e,this.array),n=ye(n,this.array),i=ye(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=ye(e,this.array),n=ye(n,this.array),i=ye(i,this.array),r=ye(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Va&&(t.usage=this.usage),t}}class wl extends ue{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Tl extends ue{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Xe extends ue{constructor(t,e,n){super(new Float32Array(t),e,n)}}let jh=0;const Be=new ne,lr=new Pe,jn=new D,Ie=new Bn,bi=new Bn,ce=new D;class Oe extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jh++}),this.uuid=mi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(xl(t)?Tl:wl)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Be.makeRotationFromQuaternion(t),this.applyMatrix4(Be),this}rotateX(t){return Be.makeRotationX(t),this.applyMatrix4(Be),this}rotateY(t){return Be.makeRotationY(t),this.applyMatrix4(Be),this}rotateZ(t){return Be.makeRotationZ(t),this.applyMatrix4(Be),this}translate(t,e,n){return Be.makeTranslation(t,e,n),this.applyMatrix4(Be),this}scale(t,e,n){return Be.makeScale(t,e,n),this.applyMatrix4(Be),this}lookAt(t){return lr.lookAt(t),lr.updateMatrix(),this.applyMatrix4(lr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(jn).negate(),this.translate(jn.x,jn.y,jn.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Xe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Bn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];Ie.setFromBufferAttribute(r),this.morphTargetsRelative?(ce.addVectors(this.boundingBox.min,Ie.min),this.boundingBox.expandByPoint(ce),ce.addVectors(this.boundingBox.max,Ie.max),this.boundingBox.expandByPoint(ce)):(this.boundingBox.expandByPoint(Ie.min),this.boundingBox.expandByPoint(Ie.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(Ie.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];bi.setFromBufferAttribute(a),this.morphTargetsRelative?(ce.addVectors(Ie.min,bi.min),Ie.expandByPoint(ce),ce.addVectors(Ie.max,bi.max),Ie.expandByPoint(ce)):(Ie.expandByPoint(bi.min),Ie.expandByPoint(bi.max))}Ie.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)ce.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(ce));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ce.fromBufferAttribute(a,c),l&&(jn.fromBufferAttribute(t,c),ce.add(jn)),i=Math.max(i,n.distanceToSquared(ce))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,r=e.normal.array,o=e.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ue(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let M=0;M<a;M++)c[M]=new D,h[M]=new D;const d=new D,f=new D,m=new D,v=new Ct,g=new Ct,p=new Ct,u=new D,y=new D;function x(M,P,U){d.fromArray(i,M*3),f.fromArray(i,P*3),m.fromArray(i,U*3),v.fromArray(o,M*2),g.fromArray(o,P*2),p.fromArray(o,U*2),f.sub(d),m.sub(d),g.sub(v),p.sub(v);const V=1/(g.x*p.y-p.x*g.y);isFinite(V)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(m,-g.y).multiplyScalar(V),y.copy(m).multiplyScalar(g.x).addScaledVector(f,-p.x).multiplyScalar(V),c[M].add(u),c[P].add(u),c[U].add(u),h[M].add(y),h[P].add(y),h[U].add(y))}let E=this.groups;E.length===0&&(E=[{start:0,count:n.length}]);for(let M=0,P=E.length;M<P;++M){const U=E[M],V=U.start,L=U.count;for(let F=V,G=V+L;F<G;F+=3)x(n[F+0],n[F+1],n[F+2])}const R=new D,T=new D,A=new D,N=new D;function _(M){A.fromArray(r,M*3),N.copy(A);const P=c[M];R.copy(P),R.sub(A.multiplyScalar(A.dot(P))).normalize(),T.crossVectors(N,P);const V=T.dot(h[M])<0?-1:1;l[M*4]=R.x,l[M*4+1]=R.y,l[M*4+2]=R.z,l[M*4+3]=V}for(let M=0,P=E.length;M<P;++M){const U=E[M],V=U.start,L=U.count;for(let F=V,G=V+L;F<G;F+=3)_(n[F+0]),_(n[F+1]),_(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ue(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const i=new D,r=new D,o=new D,a=new D,l=new D,c=new D,h=new D,d=new D;if(t)for(let f=0,m=t.count;f<m;f+=3){const v=t.getX(f+0),g=t.getX(f+1),p=t.getX(f+2);i.fromBufferAttribute(e,v),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(v,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=e.count;f<m;f+=3)i.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ce.fromBufferAttribute(t,e),ce.normalize(),t.setXYZ(e,ce.x,ce.y,ce.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,f=new c.constructor(l.length*h);let m=0,v=0;for(let g=0,p=l.length;g<p;g++){a.isInterleavedBufferAttribute?m=l[g]*a.data.stride+a.offset:m=l[g]*h;for(let u=0;u<h;u++)f[v++]=c[m++]}return new ue(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Oe,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const f=c[h],m=t(f,n);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){const m=c[d];h.push(m.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let f=0,m=d.length;f<m;f++)h.push(d[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const io=new ne,wn=new Wr,ji=new gi,so=new D,Kn=new D,Zn=new D,Jn=new D,cr=new D,Ki=new D,Zi=new Ct,Ji=new Ct,Qi=new Ct,ro=new D,ao=new D,oo=new D,ts=new D,es=new D;class ge extends Pe{constructor(t=new Oe,e=new bl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){Ki.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(cr.fromBufferAttribute(d,t),o?Ki.addScaledVector(cr,h):Ki.addScaledVector(cr.sub(e),h))}e.add(Ki)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ji.copy(n.boundingSphere),ji.applyMatrix4(r),wn.copy(t.ray).recast(t.near),!(ji.containsPoint(wn.origin)===!1&&(wn.intersectSphere(ji,so)===null||wn.origin.distanceToSquared(so)>(t.far-t.near)**2))&&(io.copy(r).invert(),wn.copy(t.ray).applyMatrix4(io),!(n.boundingBox!==null&&wn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,wn)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,g=f.length;v<g;v++){const p=f[v],u=o[p.materialIndex],y=Math.max(p.start,m.start),x=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let E=y,R=x;E<R;E+=3){const T=a.getX(E),A=a.getX(E+1),N=a.getX(E+2);i=ns(this,u,t,n,c,h,d,T,A,N),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const v=Math.max(0,m.start),g=Math.min(a.count,m.start+m.count);for(let p=v,u=g;p<u;p+=3){const y=a.getX(p),x=a.getX(p+1),E=a.getX(p+2);i=ns(this,o,t,n,c,h,d,y,x,E),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,g=f.length;v<g;v++){const p=f[v],u=o[p.materialIndex],y=Math.max(p.start,m.start),x=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let E=y,R=x;E<R;E+=3){const T=E,A=E+1,N=E+2;i=ns(this,u,t,n,c,h,d,T,A,N),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const v=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let p=v,u=g;p<u;p+=3){const y=p,x=p+1,E=p+2;i=ns(this,o,t,n,c,h,d,y,x,E),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function Kh(s,t,e,n,i,r,o,a){let l;if(t.side===Ae?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===Mn,a),l===null)return null;es.copy(a),es.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(es);return c<e.near||c>e.far?null:{distance:c,point:es.clone(),object:s}}function ns(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,Kn),s.getVertexPosition(l,Zn),s.getVertexPosition(c,Jn);const h=Kh(s,t,e,n,Kn,Zn,Jn,ts);if(h){i&&(Zi.fromBufferAttribute(i,a),Ji.fromBufferAttribute(i,l),Qi.fromBufferAttribute(i,c),h.uv=We.getInterpolation(ts,Kn,Zn,Jn,Zi,Ji,Qi,new Ct)),r&&(Zi.fromBufferAttribute(r,a),Ji.fromBufferAttribute(r,l),Qi.fromBufferAttribute(r,c),h.uv1=We.getInterpolation(ts,Kn,Zn,Jn,Zi,Ji,Qi,new Ct),h.uv2=h.uv1),o&&(ro.fromBufferAttribute(o,a),ao.fromBufferAttribute(o,l),oo.fromBufferAttribute(o,c),h.normal=We.getInterpolation(ts,Kn,Zn,Jn,ro,ao,oo,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new D,materialIndex:0};We.getNormal(Kn,Zn,Jn,d.normal),h.face=d}return h}class Ii extends Oe{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let f=0,m=0;v("z","y","x",-1,-1,n,e,t,o,r,0),v("z","y","x",1,-1,n,e,-t,o,r,1),v("x","z","y",1,1,t,n,e,i,o,2),v("x","z","y",1,-1,t,n,-e,i,o,3),v("x","y","z",1,-1,t,e,n,i,r,4),v("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Xe(c,3)),this.setAttribute("normal",new Xe(h,3)),this.setAttribute("uv",new Xe(d,2));function v(g,p,u,y,x,E,R,T,A,N,_){const M=E/A,P=R/N,U=E/2,V=R/2,L=T/2,F=A+1,G=N+1;let q=0,W=0;const $=new D;for(let Y=0;Y<G;Y++){const J=Y*P-V;for(let rt=0;rt<F;rt++){const X=rt*M-U;$[g]=X*y,$[p]=J*x,$[u]=L,c.push($.x,$.y,$.z),$[g]=0,$[p]=0,$[u]=T>0?1:-1,h.push($.x,$.y,$.z),d.push(rt/A),d.push(1-Y/N),q+=1}}for(let Y=0;Y<N;Y++)for(let J=0;J<A;J++){const rt=f+J+F*Y,X=f+J+F*(Y+1),j=f+(J+1)+F*(Y+1),ot=f+(J+1)+F*Y;l.push(rt,X,ot),l.push(X,j,ot),W+=6}a.addGroup(m,W,_),m+=W,f+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ii(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function di(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Se(s){const t={};for(let e=0;e<s.length;e++){const n=di(s[e]);for(const i in n)t[i]=n[i]}return t}function Zh(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Al(s){return s.getRenderTarget()===null?s.outputColorSpace:Xt.workingColorSpace}const Jh={clone:di,merge:Se};var Qh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ve extends Ui{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Qh,this.fragmentShader=tu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=di(t.uniforms),this.uniformsGroups=Zh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Rl extends Pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=cn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Fe extends Rl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Pi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ai*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Pi*2*Math.atan(Math.tan(Ai*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ai*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Qn=-90,ti=1;class eu extends Pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Fe(Qn,ti,t,e);i.layers=this.layers,this.add(i);const r=new Fe(Qn,ti,t,e);r.layers=this.layers,this.add(r);const o=new Fe(Qn,ti,t,e);o.layers=this.layers,this.add(o);const a=new Fe(Qn,ti,t,e);a.layers=this.layers,this.add(a);const l=new Fe(Qn,ti,t,e);l.layers=this.layers,this.add(l);const c=new Fe(Qn,ti,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===cn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Es)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),f=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(d,f,m),t.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class Cl extends Le{constructor(t,e,n,i,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ci,super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class nu extends Ke{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(Ci("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Fn?he:ke),this.texture=new Cl(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:me}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Ii(5,5,5),r=new ve({name:"CubemapFromEquirect",uniforms:di(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ae,blending:_n});r.uniforms.tEquirect.value=e;const o=new ge(i,r),a=e.minFilter;return e.minFilter===On&&(e.minFilter=me),new eu(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}const hr=new D,iu=new D,su=new kt;class Rn{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=hr.subVectors(n,e).cross(iu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(hr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||su.getNormalMatrix(t),i=this.coplanarPoint(hr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Tn=new gi,is=new D;class Is{constructor(t=new Rn,e=new Rn,n=new Rn,i=new Rn,r=new Rn,o=new Rn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=cn){const n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],d=i[6],f=i[7],m=i[8],v=i[9],g=i[10],p=i[11],u=i[12],y=i[13],x=i[14],E=i[15];if(n[0].setComponents(l-r,f-c,p-m,E-u).normalize(),n[1].setComponents(l+r,f+c,p+m,E+u).normalize(),n[2].setComponents(l+o,f+h,p+v,E+y).normalize(),n[3].setComponents(l-o,f-h,p-v,E-y).normalize(),n[4].setComponents(l-a,f-d,p-g,E-x).normalize(),e===cn)n[5].setComponents(l+a,f+d,p+g,E+x).normalize();else if(e===Es)n[5].setComponents(a,d,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Tn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Tn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Tn)}intersectsSprite(t){return Tn.center.set(0,0,0),Tn.radius=.7071067811865476,Tn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Tn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(is.x=i.normal.x>0?t.max.x:t.min.x,is.y=i.normal.y>0?t.max.y:t.min.y,is.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(is)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ll(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function ru(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,h){const d=c.array,f=c.usage,m=d.byteLength,v=s.createBuffer();s.bindBuffer(h,v),s.bufferData(h,d,f),c.onUploadCallback();let g;if(d instanceof Float32Array)g=s.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=s.UNSIGNED_SHORT;else if(d instanceof Int16Array)g=s.SHORT;else if(d instanceof Uint32Array)g=s.UNSIGNED_INT;else if(d instanceof Int32Array)g=s.INT;else if(d instanceof Int8Array)g=s.BYTE;else if(d instanceof Uint8Array)g=s.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)g=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:v,type:g,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version,size:m}}function r(c,h,d){const f=h.array,m=h._updateRange,v=h.updateRanges;if(s.bindBuffer(d,c),m.count===-1&&v.length===0&&s.bufferSubData(d,0,f),v.length!==0){for(let g=0,p=v.length;g<p;g++){const u=v[g];e?s.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f,u.start,u.count):s.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}m.count!==-1&&(e?s.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):s.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const d=n.get(c);if(d===void 0)n.set(c,i(c,h));else if(d.version<c.version){if(d.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,c,h),d.version=c.version}}return{get:o,remove:a,update:l}}class $r extends Oe{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=t/a,f=e/l,m=[],v=[],g=[],p=[];for(let u=0;u<h;u++){const y=u*f-o;for(let x=0;x<c;x++){const E=x*d-r;v.push(E,-y,0),g.push(0,0,1),p.push(x/a),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let y=0;y<a;y++){const x=y+c*u,E=y+c*(u+1),R=y+1+c*(u+1),T=y+1+c*u;m.push(x,E,T),m.push(E,R,T)}this.setIndex(m),this.setAttribute("position",new Xe(v,3)),this.setAttribute("normal",new Xe(g,3)),this.setAttribute("uv",new Xe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $r(t.width,t.height,t.widthSegments,t.heightSegments)}}var au=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ou=`#ifdef USE_ALPHAHASH
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
#endif`,lu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,uu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,du=`#ifdef USE_AOMAP
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
#endif`,fu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pu=`#ifdef USE_BATCHING
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
#endif`,mu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,gu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_u=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,xu=`#ifdef USE_IRIDESCENCE
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
#endif`,Mu=`#ifdef USE_BUMPMAP
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
#endif`,yu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Su=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Eu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,wu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Tu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Au=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Ru=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Cu=`#define PI 3.141592653589793
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
} // validated`,Lu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Pu=`vec3 transformedNormal = objectNormal;
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
#endif`,Du=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Uu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Iu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Nu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ou=`
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
}`,zu=`#ifdef USE_ENVMAP
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
#endif`,Bu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ku=`#ifdef USE_ENVMAP
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
#endif`,Hu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gu=`#ifdef USE_ENVMAP
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
#endif`,Vu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$u=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qu=`#ifdef USE_GRADIENTMAP
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
}`,Yu=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,ju=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ku=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ju=`uniform bool receiveShadow;
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
#endif`,Qu=`#ifdef USE_ENVMAP
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
#endif`,td=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ed=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,nd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,id=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sd=`PhysicalMaterial material;
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
#endif`,rd=`struct PhysicalMaterial {
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
}`,ad=`
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
#endif`,od=`#if defined( RE_IndirectDiffuse )
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
#endif`,ld=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ud=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,dd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,fd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,md=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gd=`#if defined( USE_POINTS_UV )
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
#endif`,vd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_d=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Md=`#ifdef USE_MORPHNORMALS
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
#endif`,yd=`#ifdef USE_MORPHTARGETS
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
#endif`,Sd=`#ifdef USE_MORPHTARGETS
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
#endif`,Ed=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,bd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,wd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Td=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ad=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rd=`#ifdef USE_NORMALMAP
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
#endif`,Cd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ld=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Pd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ud=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Id=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Nd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Od=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Gd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Wd=`float getShadowMask() {
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
}`,Xd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$d=`#ifdef USE_SKINNING
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
#endif`,qd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Yd=`#ifdef USE_SKINNING
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
#endif`,jd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Kd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Zd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jd=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qd=`#ifdef USE_TRANSMISSION
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
#endif`,tf=`#ifdef USE_TRANSMISSION
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
#endif`,ef=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const af=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,of=`uniform sampler2D t2D;
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
}`,lf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,df=`#include <common>
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
}`,ff=`#if DEPTH_PACKING == 3200
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
}`,pf=`#define DISTANCE
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
}`,mf=`#define DISTANCE
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
}`,gf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_f=`uniform float scale;
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
}`,xf=`uniform vec3 diffuse;
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
}`,Mf=`#include <common>
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
}`,yf=`uniform vec3 diffuse;
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
}`,Sf=`#define LAMBERT
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
}`,Ef=`#define LAMBERT
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
}`,bf=`#define MATCAP
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
}`,wf=`#define MATCAP
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
}`,Tf=`#define NORMAL
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
}`,Af=`#define NORMAL
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
}`,Rf=`#define PHONG
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
}`,Cf=`#define PHONG
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
}`,Lf=`#define STANDARD
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
}`,Pf=`#define STANDARD
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
}`,Df=`#define TOON
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
}`,Uf=`#define TOON
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
}`,If=`uniform float size;
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
}`,Nf=`uniform vec3 diffuse;
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
}`,Ff=`#include <common>
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
}`,Of=`uniform vec3 color;
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
}`,zf=`uniform float rotation;
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
}`,Bf=`uniform vec3 diffuse;
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
}`,It={alphahash_fragment:au,alphahash_pars_fragment:ou,alphamap_fragment:lu,alphamap_pars_fragment:cu,alphatest_fragment:hu,alphatest_pars_fragment:uu,aomap_fragment:du,aomap_pars_fragment:fu,batching_pars_vertex:pu,batching_vertex:mu,begin_vertex:gu,beginnormal_vertex:vu,bsdfs:_u,iridescence_fragment:xu,bumpmap_pars_fragment:Mu,clipping_planes_fragment:yu,clipping_planes_pars_fragment:Su,clipping_planes_pars_vertex:Eu,clipping_planes_vertex:bu,color_fragment:wu,color_pars_fragment:Tu,color_pars_vertex:Au,color_vertex:Ru,common:Cu,cube_uv_reflection_fragment:Lu,defaultnormal_vertex:Pu,displacementmap_pars_vertex:Du,displacementmap_vertex:Uu,emissivemap_fragment:Iu,emissivemap_pars_fragment:Nu,colorspace_fragment:Fu,colorspace_pars_fragment:Ou,envmap_fragment:zu,envmap_common_pars_fragment:Bu,envmap_pars_fragment:ku,envmap_pars_vertex:Hu,envmap_physical_pars_fragment:Qu,envmap_vertex:Gu,fog_vertex:Vu,fog_pars_vertex:Wu,fog_fragment:Xu,fog_pars_fragment:$u,gradientmap_pars_fragment:qu,lightmap_fragment:Yu,lightmap_pars_fragment:ju,lights_lambert_fragment:Ku,lights_lambert_pars_fragment:Zu,lights_pars_begin:Ju,lights_toon_fragment:td,lights_toon_pars_fragment:ed,lights_phong_fragment:nd,lights_phong_pars_fragment:id,lights_physical_fragment:sd,lights_physical_pars_fragment:rd,lights_fragment_begin:ad,lights_fragment_maps:od,lights_fragment_end:ld,logdepthbuf_fragment:cd,logdepthbuf_pars_fragment:hd,logdepthbuf_pars_vertex:ud,logdepthbuf_vertex:dd,map_fragment:fd,map_pars_fragment:pd,map_particle_fragment:md,map_particle_pars_fragment:gd,metalnessmap_fragment:vd,metalnessmap_pars_fragment:_d,morphcolor_vertex:xd,morphnormal_vertex:Md,morphtarget_pars_vertex:yd,morphtarget_vertex:Sd,normal_fragment_begin:Ed,normal_fragment_maps:bd,normal_pars_fragment:wd,normal_pars_vertex:Td,normal_vertex:Ad,normalmap_pars_fragment:Rd,clearcoat_normal_fragment_begin:Cd,clearcoat_normal_fragment_maps:Ld,clearcoat_pars_fragment:Pd,iridescence_pars_fragment:Dd,opaque_fragment:Ud,packing:Id,premultiplied_alpha_fragment:Nd,project_vertex:Fd,dithering_fragment:Od,dithering_pars_fragment:zd,roughnessmap_fragment:Bd,roughnessmap_pars_fragment:kd,shadowmap_pars_fragment:Hd,shadowmap_pars_vertex:Gd,shadowmap_vertex:Vd,shadowmask_pars_fragment:Wd,skinbase_vertex:Xd,skinning_pars_vertex:$d,skinning_vertex:qd,skinnormal_vertex:Yd,specularmap_fragment:jd,specularmap_pars_fragment:Kd,tonemapping_fragment:Zd,tonemapping_pars_fragment:Jd,transmission_fragment:Qd,transmission_pars_fragment:tf,uv_pars_fragment:ef,uv_pars_vertex:nf,uv_vertex:sf,worldpos_vertex:rf,background_vert:af,background_frag:of,backgroundCube_vert:lf,backgroundCube_frag:cf,cube_vert:hf,cube_frag:uf,depth_vert:df,depth_frag:ff,distanceRGBA_vert:pf,distanceRGBA_frag:mf,equirect_vert:gf,equirect_frag:vf,linedashed_vert:_f,linedashed_frag:xf,meshbasic_vert:Mf,meshbasic_frag:yf,meshlambert_vert:Sf,meshlambert_frag:Ef,meshmatcap_vert:bf,meshmatcap_frag:wf,meshnormal_vert:Tf,meshnormal_frag:Af,meshphong_vert:Rf,meshphong_frag:Cf,meshphysical_vert:Lf,meshphysical_frag:Pf,meshtoon_vert:Df,meshtoon_frag:Uf,points_vert:If,points_frag:Nf,shadow_vert:Ff,shadow_frag:Of,sprite_vert:zf,sprite_frag:Bf},nt={common:{diffuse:{value:new Rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new kt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new kt},normalScale:{value:new Ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0},uvTransform:{value:new kt}},sprite:{diffuse:{value:new Rt(16777215)},opacity:{value:1},center:{value:new Ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}}},qe={basic:{uniforms:Se([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.fog]),vertexShader:It.meshbasic_vert,fragmentShader:It.meshbasic_frag},lambert:{uniforms:Se([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Rt(0)}}]),vertexShader:It.meshlambert_vert,fragmentShader:It.meshlambert_frag},phong:{uniforms:Se([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Rt(0)},specular:{value:new Rt(1118481)},shininess:{value:30}}]),vertexShader:It.meshphong_vert,fragmentShader:It.meshphong_frag},standard:{uniforms:Se([nt.common,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.roughnessmap,nt.metalnessmap,nt.fog,nt.lights,{emissive:{value:new Rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:It.meshphysical_vert,fragmentShader:It.meshphysical_frag},toon:{uniforms:Se([nt.common,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.gradientmap,nt.fog,nt.lights,{emissive:{value:new Rt(0)}}]),vertexShader:It.meshtoon_vert,fragmentShader:It.meshtoon_frag},matcap:{uniforms:Se([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,{matcap:{value:null}}]),vertexShader:It.meshmatcap_vert,fragmentShader:It.meshmatcap_frag},points:{uniforms:Se([nt.points,nt.fog]),vertexShader:It.points_vert,fragmentShader:It.points_frag},dashed:{uniforms:Se([nt.common,nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:It.linedashed_vert,fragmentShader:It.linedashed_frag},depth:{uniforms:Se([nt.common,nt.displacementmap]),vertexShader:It.depth_vert,fragmentShader:It.depth_frag},normal:{uniforms:Se([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,{opacity:{value:1}}]),vertexShader:It.meshnormal_vert,fragmentShader:It.meshnormal_frag},sprite:{uniforms:Se([nt.sprite,nt.fog]),vertexShader:It.sprite_vert,fragmentShader:It.sprite_frag},background:{uniforms:{uvTransform:{value:new kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:It.background_vert,fragmentShader:It.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:It.backgroundCube_vert,fragmentShader:It.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:It.cube_vert,fragmentShader:It.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:It.equirect_vert,fragmentShader:It.equirect_frag},distanceRGBA:{uniforms:Se([nt.common,nt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:It.distanceRGBA_vert,fragmentShader:It.distanceRGBA_frag},shadow:{uniforms:Se([nt.lights,nt.fog,{color:{value:new Rt(0)},opacity:{value:1}}]),vertexShader:It.shadow_vert,fragmentShader:It.shadow_frag}};qe.physical={uniforms:Se([qe.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new kt},clearcoatNormalScale:{value:new Ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new kt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new kt},sheen:{value:0},sheenColor:{value:new Rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new kt},transmissionSamplerSize:{value:new Ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new kt},attenuationDistance:{value:0},attenuationColor:{value:new Rt(0)},specularColor:{value:new Rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new kt},anisotropyVector:{value:new Ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new kt}}]),vertexShader:It.meshphysical_vert,fragmentShader:It.meshphysical_frag};const ss={r:0,b:0,g:0};function kf(s,t,e,n,i,r,o){const a=new Rt(0);let l=r===!0?0:1,c,h,d=null,f=0,m=null;function v(p,u){let y=!1,x=u.isScene===!0?u.background:null;x&&x.isTexture&&(x=(u.backgroundBlurriness>0?e:t).get(x)),x===null?g(a,l):x&&x.isColor&&(g(x,1),y=!0);const E=s.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||y)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Ls)?(h===void 0&&(h=new ge(new Ii(1,1,1),new ve({name:"BackgroundCubeMaterial",uniforms:di(qe.backgroundCube.uniforms),vertexShader:qe.backgroundCube.vertexShader,fragmentShader:qe.backgroundCube.fragmentShader,side:Ae,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=Xt.getTransfer(x.colorSpace)!==jt,(d!==x||f!==x.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,d=x,f=x.version,m=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new ge(new $r(2,2),new ve({name:"BackgroundMaterial",uniforms:di(qe.background.uniforms),vertexShader:qe.background.vertexShader,fragmentShader:qe.background.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=Xt.getTransfer(x.colorSpace)!==jt,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||f!==x.version||m!==s.toneMapping)&&(c.material.needsUpdate=!0,d=x,f=x.version,m=s.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function g(p,u){p.getRGB(ss,Al(s)),n.buffers.color.setClear(ss.r,ss.g,ss.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),l=u,g(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,g(a,l)},render:v}}function Hf(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null);let c=l,h=!1;function d(L,F,G,q,W){let $=!1;if(o){const Y=g(q,G,F);c!==Y&&(c=Y,m(c.object)),$=u(L,q,G,W),$&&y(L,q,G,W)}else{const Y=F.wireframe===!0;(c.geometry!==q.id||c.program!==G.id||c.wireframe!==Y)&&(c.geometry=q.id,c.program=G.id,c.wireframe=Y,$=!0)}W!==null&&e.update(W,s.ELEMENT_ARRAY_BUFFER),($||h)&&(h=!1,N(L,F,G,q),W!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function f(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function m(L){return n.isWebGL2?s.bindVertexArray(L):r.bindVertexArrayOES(L)}function v(L){return n.isWebGL2?s.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function g(L,F,G){const q=G.wireframe===!0;let W=a[L.id];W===void 0&&(W={},a[L.id]=W);let $=W[F.id];$===void 0&&($={},W[F.id]=$);let Y=$[q];return Y===void 0&&(Y=p(f()),$[q]=Y),Y}function p(L){const F=[],G=[],q=[];for(let W=0;W<i;W++)F[W]=0,G[W]=0,q[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:G,attributeDivisors:q,object:L,attributes:{},index:null}}function u(L,F,G,q){const W=c.attributes,$=F.attributes;let Y=0;const J=G.getAttributes();for(const rt in J)if(J[rt].location>=0){const j=W[rt];let ot=$[rt];if(ot===void 0&&(rt==="instanceMatrix"&&L.instanceMatrix&&(ot=L.instanceMatrix),rt==="instanceColor"&&L.instanceColor&&(ot=L.instanceColor)),j===void 0||j.attribute!==ot||ot&&j.data!==ot.data)return!0;Y++}return c.attributesNum!==Y||c.index!==q}function y(L,F,G,q){const W={},$=F.attributes;let Y=0;const J=G.getAttributes();for(const rt in J)if(J[rt].location>=0){let j=$[rt];j===void 0&&(rt==="instanceMatrix"&&L.instanceMatrix&&(j=L.instanceMatrix),rt==="instanceColor"&&L.instanceColor&&(j=L.instanceColor));const ot={};ot.attribute=j,j&&j.data&&(ot.data=j.data),W[rt]=ot,Y++}c.attributes=W,c.attributesNum=Y,c.index=q}function x(){const L=c.newAttributes;for(let F=0,G=L.length;F<G;F++)L[F]=0}function E(L){R(L,0)}function R(L,F){const G=c.newAttributes,q=c.enabledAttributes,W=c.attributeDivisors;G[L]=1,q[L]===0&&(s.enableVertexAttribArray(L),q[L]=1),W[L]!==F&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,F),W[L]=F)}function T(){const L=c.newAttributes,F=c.enabledAttributes;for(let G=0,q=F.length;G<q;G++)F[G]!==L[G]&&(s.disableVertexAttribArray(G),F[G]=0)}function A(L,F,G,q,W,$,Y){Y===!0?s.vertexAttribIPointer(L,F,G,W,$):s.vertexAttribPointer(L,F,G,q,W,$)}function N(L,F,G,q){if(n.isWebGL2===!1&&(L.isInstancedMesh||q.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const W=q.attributes,$=G.getAttributes(),Y=F.defaultAttributeValues;for(const J in $){const rt=$[J];if(rt.location>=0){let X=W[J];if(X===void 0&&(J==="instanceMatrix"&&L.instanceMatrix&&(X=L.instanceMatrix),J==="instanceColor"&&L.instanceColor&&(X=L.instanceColor)),X!==void 0){const j=X.normalized,ot=X.itemSize,gt=e.get(X);if(gt===void 0)continue;const mt=gt.buffer,Lt=gt.type,Dt=gt.bytesPerElement,St=n.isWebGL2===!0&&(Lt===s.INT||Lt===s.UNSIGNED_INT||X.gpuType===hl);if(X.isInterleavedBufferAttribute){const Gt=X.data,O=Gt.stride,_e=X.offset;if(Gt.isInstancedInterleavedBuffer){for(let _t=0;_t<rt.locationSize;_t++)R(rt.location+_t,Gt.meshPerAttribute);L.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=Gt.meshPerAttribute*Gt.count)}else for(let _t=0;_t<rt.locationSize;_t++)E(rt.location+_t);s.bindBuffer(s.ARRAY_BUFFER,mt);for(let _t=0;_t<rt.locationSize;_t++)A(rt.location+_t,ot/rt.locationSize,Lt,j,O*Dt,(_e+ot/rt.locationSize*_t)*Dt,St)}else{if(X.isInstancedBufferAttribute){for(let Gt=0;Gt<rt.locationSize;Gt++)R(rt.location+Gt,X.meshPerAttribute);L.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Gt=0;Gt<rt.locationSize;Gt++)E(rt.location+Gt);s.bindBuffer(s.ARRAY_BUFFER,mt);for(let Gt=0;Gt<rt.locationSize;Gt++)A(rt.location+Gt,ot/rt.locationSize,Lt,j,ot*Dt,ot/rt.locationSize*Gt*Dt,St)}}else if(Y!==void 0){const j=Y[J];if(j!==void 0)switch(j.length){case 2:s.vertexAttrib2fv(rt.location,j);break;case 3:s.vertexAttrib3fv(rt.location,j);break;case 4:s.vertexAttrib4fv(rt.location,j);break;default:s.vertexAttrib1fv(rt.location,j)}}}}T()}function _(){U();for(const L in a){const F=a[L];for(const G in F){const q=F[G];for(const W in q)v(q[W].object),delete q[W];delete F[G]}delete a[L]}}function M(L){if(a[L.id]===void 0)return;const F=a[L.id];for(const G in F){const q=F[G];for(const W in q)v(q[W].object),delete q[W];delete F[G]}delete a[L.id]}function P(L){for(const F in a){const G=a[F];if(G[L.id]===void 0)continue;const q=G[L.id];for(const W in q)v(q[W].object),delete q[W];delete G[L.id]}}function U(){V(),h=!0,c!==l&&(c=l,m(c.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:U,resetDefaultState:V,dispose:_,releaseStatesOfGeometry:M,releaseStatesOfProgram:P,initAttributes:x,enableAttribute:E,disableUnusedAttributes:T}}function Gf(s,t,e,n){const i=n.isWebGL2;let r;function o(h){r=h}function a(h,d){s.drawArrays(r,h,d),e.update(d,r,1)}function l(h,d,f){if(f===0)return;let m,v;if(i)m=s,v="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[v](r,h,d,f),e.update(d,r,f)}function c(h,d,f){if(f===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<f;v++)this.render(h[v],d[v]);else{m.multiDrawArraysWEBGL(r,h,0,d,0,f);let v=0;for(let g=0;g<f;g++)v+=d[g];e.update(v,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function Vf(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),u=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),x=f>0,E=o||t.has("OES_texture_float"),R=x&&E,T=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:v,maxAttributes:g,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:y,vertexTextures:x,floatFragmentTextures:E,floatVertexTextures:R,maxSamples:T}}function Wf(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new Rn,a=new kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const m=d.length!==0||f||n!==0||i;return i=f,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,m){const v=d.clippingPlanes,g=d.clipIntersection,p=d.clipShadows,u=s.get(d);if(!i||v===null||v.length===0||r&&!p)r?h(null):c();else{const y=r?0:n,x=y*4;let E=u.clippingState||null;l.value=E,E=h(v,f,x,m);for(let R=0;R!==x;++R)E[R]=e[R];u.clippingState=E,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,m,v){const g=d!==null?d.length:0;let p=null;if(g!==0){if(p=l.value,v!==!0||p===null){const u=m+g*4,y=f.matrixWorldInverse;a.getNormalMatrix(y),(p===null||p.length<u)&&(p=new Float32Array(u));for(let x=0,E=m;x!==g;++x,E+=4)o.copy(d[x]).applyMatrix4(y,a),o.normal.toArray(p,E),p[E+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}function Xf(s){let t=new WeakMap;function e(o,a){return a===Rr?o.mapping=ci:a===Cr&&(o.mapping=hi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Rr||a===Cr)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new nu(l.height/2);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Ns extends Rl{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ri=4,lo=[.125,.215,.35,.446,.526,.582],Dn=20,ur=new Ns,co=new Rt;let dr=null,fr=0,pr=0;const Cn=(1+Math.sqrt(5))/2,ei=1/Cn,ho=[new D(1,1,1),new D(-1,1,1),new D(1,1,-1),new D(-1,1,-1),new D(0,Cn,ei),new D(0,Cn,-ei),new D(ei,0,Cn),new D(-ei,0,Cn),new D(Cn,ei,0),new D(-Cn,ei,0)];class uo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){dr=this._renderer.getRenderTarget(),fr=this._renderer.getActiveCubeFace(),pr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=po(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(dr,fr,pr),t.scissorTest=!1,rs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ci||t.mapping===hi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),dr=this._renderer.getRenderTarget(),fr=this._renderer.getActiveCubeFace(),pr=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:me,minFilter:me,generateMipmaps:!1,type:zn,format:Te,colorSpace:hn,depthBuffer:!1},i=fo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fo(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$f(r)),this._blurMaterial=qf(r,t,e)}return i}_compileMaterial(t){const e=new ge(this._lodPlanes[0],t);this._renderer.compile(e,ur)}_sceneToCubeUV(t,e,n,i){const a=new Fe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(co),h.toneMapping=xn,h.autoClear=!1;const m=new bl({name:"PMREM.Background",side:Ae,depthWrite:!1,depthTest:!1}),v=new ge(new Ii,m);let g=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,g=!0):(m.color.copy(co),g=!0);for(let u=0;u<6;u++){const y=u%3;y===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):y===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));const x=this._cubeSize;rs(i,y*x,u>2?x:0,x,x),h.setRenderTarget(i),g&&h.render(v,a),h.render(t,a)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===ci||t.mapping===hi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=mo()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=po());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new ge(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;rs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,ur)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=ho[(i-1)%ho.length];this._blur(t,i-1,i,r,o)}e.autoClear=n}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new ge(this._lodPlanes[i],c),f=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Dn-1),g=r/v,p=isFinite(r)?1+Math.floor(h*g):Dn;p>Dn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Dn}`);const u=[];let y=0;for(let A=0;A<Dn;++A){const N=A/g,_=Math.exp(-N*N/2);u.push(_),A===0?y+=_:A<p&&(y+=2*_)}for(let A=0;A<u.length;A++)u[A]=u[A]/y;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:x}=this;f.dTheta.value=v,f.mipInt.value=x-n;const E=this._sizeLods[i],R=3*E*(i>x-ri?i-x+ri:0),T=4*(this._cubeSize-E);rs(e,R,T,3*E,2*E),l.setRenderTarget(e),l.render(d,ur)}}function $f(s){const t=[],e=[],n=[];let i=s;const r=s-ri+1+lo.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>s-ri?l=lo[o-s+ri-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,v=6,g=3,p=2,u=1,y=new Float32Array(g*v*m),x=new Float32Array(p*v*m),E=new Float32Array(u*v*m);for(let T=0;T<m;T++){const A=T%3*2/3-1,N=T>2?0:-1,_=[A,N,0,A+2/3,N,0,A+2/3,N+1,0,A,N,0,A+2/3,N+1,0,A,N+1,0];y.set(_,g*v*T),x.set(f,p*v*T);const M=[T,T,T,T,T,T];E.set(M,u*v*T)}const R=new Oe;R.setAttribute("position",new ue(y,g)),R.setAttribute("uv",new ue(x,p)),R.setAttribute("faceIndex",new ue(E,u)),t.push(R),i>ri&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function fo(s,t,e){const n=new Ke(s,t,e);return n.texture.mapping=Ls,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function rs(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function qf(s,t,e){const n=new Float32Array(Dn),i=new D(0,1,0);return new ve({name:"SphericalGaussianBlur",defines:{n:Dn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:qr(),fragmentShader:`

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
		`,blending:_n,depthTest:!1,depthWrite:!1})}function po(){return new ve({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qr(),fragmentShader:`

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
		`,blending:_n,depthTest:!1,depthWrite:!1})}function mo(){return new ve({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:_n,depthTest:!1,depthWrite:!1})}function qr(){return`

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
	`}function Yf(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Rr||l===Cr,h=l===ci||l===hi;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=t.get(a);return e===null&&(e=new uo(s)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),t.set(a,d),d.texture}else{if(t.has(a))return t.get(a).texture;{const d=a.image;if(c&&d&&d.height>0||h&&d&&i(d)){e===null&&(e=new uo(s));const f=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function jf(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Kf(s,t,e,n){const i={},r=new WeakMap;function o(d){const f=d.target;f.index!==null&&t.remove(f.index);for(const v in f.attributes)t.remove(f.attributes[v]);for(const v in f.morphAttributes){const g=f.morphAttributes[v];for(let p=0,u=g.length;p<u;p++)t.remove(g[p])}f.removeEventListener("dispose",o),delete i[f.id];const m=r.get(f);m&&(t.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,e.memory.geometries++),f}function l(d){const f=d.attributes;for(const v in f)t.update(f[v],s.ARRAY_BUFFER);const m=d.morphAttributes;for(const v in m){const g=m[v];for(let p=0,u=g.length;p<u;p++)t.update(g[p],s.ARRAY_BUFFER)}}function c(d){const f=[],m=d.index,v=d.attributes.position;let g=0;if(m!==null){const y=m.array;g=m.version;for(let x=0,E=y.length;x<E;x+=3){const R=y[x+0],T=y[x+1],A=y[x+2];f.push(R,T,T,A,A,R)}}else if(v!==void 0){const y=v.array;g=v.version;for(let x=0,E=y.length/3-1;x<E;x+=3){const R=x+0,T=x+1,A=x+2;f.push(R,T,T,A,A,R)}}else return;const p=new(xl(f)?Tl:wl)(f,1);p.version=g;const u=r.get(d);u&&t.remove(u),r.set(d,p)}function h(d){const f=r.get(d);if(f){const m=d.index;m!==null&&f.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Zf(s,t,e,n){const i=n.isWebGL2;let r;function o(m){r=m}let a,l;function c(m){a=m.type,l=m.bytesPerElement}function h(m,v){s.drawElements(r,v,a,m*l),e.update(v,r,1)}function d(m,v,g){if(g===0)return;let p,u;if(i)p=s,u="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[u](r,v,a,m*l,g),e.update(v,r,g)}function f(m,v,g){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<g;u++)this.render(m[u]/l,v[u]);else{p.multiDrawElementsWEBGL(r,v,0,a,m,0,g);let u=0;for(let y=0;y<g;y++)u+=v[y];e.update(u,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=d,this.renderMultiDraw=f}function Jf(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Qf(s,t){return s[0]-t[0]}function tp(s,t){return Math.abs(t[1])-Math.abs(s[1])}function ep(s,t,e){const n={},i=new Float32Array(8),r=new WeakMap,o=new ee,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,d){const f=c.morphTargetInfluences;if(t.isWebGL2===!0){const m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=m!==void 0?m.length:0;let g=r.get(h);if(g===void 0||g.count!==v){let L=function(){U.dispose(),r.delete(h),h.removeEventListener("dispose",L)};g!==void 0&&g.texture.dispose();const y=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,E=h.morphAttributes.color!==void 0,R=h.morphAttributes.position||[],T=h.morphAttributes.normal||[],A=h.morphAttributes.color||[];let N=0;y===!0&&(N=1),x===!0&&(N=2),E===!0&&(N=3);let _=h.attributes.position.count*N,M=1;_>t.maxTextureSize&&(M=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const P=new Float32Array(_*M*4*v),U=new Sl(P,_,M,v);U.type=ln,U.needsUpdate=!0;const V=N*4;for(let F=0;F<v;F++){const G=R[F],q=T[F],W=A[F],$=_*M*4*F;for(let Y=0;Y<G.count;Y++){const J=Y*V;y===!0&&(o.fromBufferAttribute(G,Y),P[$+J+0]=o.x,P[$+J+1]=o.y,P[$+J+2]=o.z,P[$+J+3]=0),x===!0&&(o.fromBufferAttribute(q,Y),P[$+J+4]=o.x,P[$+J+5]=o.y,P[$+J+6]=o.z,P[$+J+7]=0),E===!0&&(o.fromBufferAttribute(W,Y),P[$+J+8]=o.x,P[$+J+9]=o.y,P[$+J+10]=o.z,P[$+J+11]=W.itemSize===4?o.w:1)}}g={count:v,texture:U,size:new Ct(_,M)},r.set(h,g),h.addEventListener("dispose",L)}let p=0;for(let y=0;y<f.length;y++)p+=f[y];const u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(s,"morphTargetBaseInfluence",u),d.getUniforms().setValue(s,"morphTargetInfluences",f),d.getUniforms().setValue(s,"morphTargetsTexture",g.texture,e),d.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}else{const m=f===void 0?0:f.length;let v=n[h.id];if(v===void 0||v.length!==m){v=[];for(let x=0;x<m;x++)v[x]=[x,0];n[h.id]=v}for(let x=0;x<m;x++){const E=v[x];E[0]=x,E[1]=f[x]}v.sort(tp);for(let x=0;x<8;x++)x<m&&v[x][1]?(a[x][0]=v[x][0],a[x][1]=v[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(Qf);const g=h.morphAttributes.position,p=h.morphAttributes.normal;let u=0;for(let x=0;x<8;x++){const E=a[x],R=E[0],T=E[1];R!==Number.MAX_SAFE_INTEGER&&T?(g&&h.getAttribute("morphTarget"+x)!==g[R]&&h.setAttribute("morphTarget"+x,g[R]),p&&h.getAttribute("morphNormal"+x)!==p[R]&&h.setAttribute("morphNormal"+x,p[R]),i[x]=T,u+=T):(g&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),p&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),i[x]=0)}const y=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(s,"morphTargetBaseInfluence",y),d.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function np(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(i.get(d)!==c&&(t.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return d}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Yr extends Le{constructor(t,e,n,i,r,o,a,l,c,h){if(h=h!==void 0?h:Nn,h!==Nn&&h!==ui)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Nn&&(n=on),n===void 0&&h===ui&&(n=In),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Jt,this.minFilter=l!==void 0?l:Jt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Pl=new Le,Dl=new Yr(1,1);Dl.compareFunction=_l;const Ul=new Sl,Il=new Bh,Nl=new Cl,go=[],vo=[],_o=new Float32Array(16),xo=new Float32Array(9),Mo=new Float32Array(4);function vi(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=go[i];if(r===void 0&&(r=new Float32Array(i),go[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function re(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function ae(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Fs(s,t){let e=vo[t];e===void 0&&(e=new Int32Array(t),vo[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function ip(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function sp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(re(e,t))return;s.uniform2fv(this.addr,t),ae(e,t)}}function rp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(re(e,t))return;s.uniform3fv(this.addr,t),ae(e,t)}}function ap(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(re(e,t))return;s.uniform4fv(this.addr,t),ae(e,t)}}function op(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(re(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),ae(e,t)}else{if(re(e,n))return;Mo.set(n),s.uniformMatrix2fv(this.addr,!1,Mo),ae(e,n)}}function lp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(re(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),ae(e,t)}else{if(re(e,n))return;xo.set(n),s.uniformMatrix3fv(this.addr,!1,xo),ae(e,n)}}function cp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(re(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),ae(e,t)}else{if(re(e,n))return;_o.set(n),s.uniformMatrix4fv(this.addr,!1,_o),ae(e,n)}}function hp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function up(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(re(e,t))return;s.uniform2iv(this.addr,t),ae(e,t)}}function dp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(re(e,t))return;s.uniform3iv(this.addr,t),ae(e,t)}}function fp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(re(e,t))return;s.uniform4iv(this.addr,t),ae(e,t)}}function pp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function mp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(re(e,t))return;s.uniform2uiv(this.addr,t),ae(e,t)}}function gp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(re(e,t))return;s.uniform3uiv(this.addr,t),ae(e,t)}}function vp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(re(e,t))return;s.uniform4uiv(this.addr,t),ae(e,t)}}function _p(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?Dl:Pl;e.setTexture2D(t||r,i)}function xp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Il,i)}function Mp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Nl,i)}function yp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Ul,i)}function Sp(s){switch(s){case 5126:return ip;case 35664:return sp;case 35665:return rp;case 35666:return ap;case 35674:return op;case 35675:return lp;case 35676:return cp;case 5124:case 35670:return hp;case 35667:case 35671:return up;case 35668:case 35672:return dp;case 35669:case 35673:return fp;case 5125:return pp;case 36294:return mp;case 36295:return gp;case 36296:return vp;case 35678:case 36198:case 36298:case 36306:case 35682:return _p;case 35679:case 36299:case 36307:return xp;case 35680:case 36300:case 36308:case 36293:return Mp;case 36289:case 36303:case 36311:case 36292:return yp}}function Ep(s,t){s.uniform1fv(this.addr,t)}function bp(s,t){const e=vi(t,this.size,2);s.uniform2fv(this.addr,e)}function wp(s,t){const e=vi(t,this.size,3);s.uniform3fv(this.addr,e)}function Tp(s,t){const e=vi(t,this.size,4);s.uniform4fv(this.addr,e)}function Ap(s,t){const e=vi(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Rp(s,t){const e=vi(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Cp(s,t){const e=vi(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Lp(s,t){s.uniform1iv(this.addr,t)}function Pp(s,t){s.uniform2iv(this.addr,t)}function Dp(s,t){s.uniform3iv(this.addr,t)}function Up(s,t){s.uniform4iv(this.addr,t)}function Ip(s,t){s.uniform1uiv(this.addr,t)}function Np(s,t){s.uniform2uiv(this.addr,t)}function Fp(s,t){s.uniform3uiv(this.addr,t)}function Op(s,t){s.uniform4uiv(this.addr,t)}function zp(s,t,e){const n=this.cache,i=t.length,r=Fs(e,i);re(n,r)||(s.uniform1iv(this.addr,r),ae(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Pl,r[o])}function Bp(s,t,e){const n=this.cache,i=t.length,r=Fs(e,i);re(n,r)||(s.uniform1iv(this.addr,r),ae(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Il,r[o])}function kp(s,t,e){const n=this.cache,i=t.length,r=Fs(e,i);re(n,r)||(s.uniform1iv(this.addr,r),ae(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Nl,r[o])}function Hp(s,t,e){const n=this.cache,i=t.length,r=Fs(e,i);re(n,r)||(s.uniform1iv(this.addr,r),ae(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Ul,r[o])}function Gp(s){switch(s){case 5126:return Ep;case 35664:return bp;case 35665:return wp;case 35666:return Tp;case 35674:return Ap;case 35675:return Rp;case 35676:return Cp;case 5124:case 35670:return Lp;case 35667:case 35671:return Pp;case 35668:case 35672:return Dp;case 35669:case 35673:return Up;case 5125:return Ip;case 36294:return Np;case 36295:return Fp;case 36296:return Op;case 35678:case 36198:case 36298:case 36306:case 35682:return zp;case 35679:case 36299:case 36307:return Bp;case 35680:case 36300:case 36308:case 36293:return kp;case 36289:case 36303:case 36311:case 36292:return Hp}}class Vp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Sp(e.type)}}class Wp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Gp(e.type)}}class Xp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const mr=/(\w+)(\])?(\[|\.)?/g;function yo(s,t){s.seq.push(t),s.map[t.id]=t}function $p(s,t,e){const n=s.name,i=n.length;for(mr.lastIndex=0;;){const r=mr.exec(n),o=mr.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){yo(e,c===void 0?new Vp(a,s,t):new Wp(a,s,t));break}else{let d=e.map[a];d===void 0&&(d=new Xp(a),yo(e,d)),e=d}}}class fs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);$p(r,o,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function So(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const qp=37297;let Yp=0;function jp(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Kp(s){const t=Xt.getPrimaries(Xt.workingColorSpace),e=Xt.getPrimaries(s);let n;switch(t===e?n="":t===Ss&&e===ys?n="LinearDisplayP3ToLinearSRGB":t===ys&&e===Ss&&(n="LinearSRGBToLinearDisplayP3"),s){case hn:case Ds:return[n,"LinearTransferOETF"];case he:case Gr:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Eo(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+jp(s.getShaderSource(t),o)}else return i}function Zp(s,t){const e=Kp(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Jp(s,t){let e;switch(t){case Yc:e="Linear";break;case jc:e="Reinhard";break;case Kc:e="OptimizedCineon";break;case Zc:e="ACESFilmic";break;case Qc:e="AgX";break;case Jc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Qp(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ai).join(`
`)}function tm(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(ai).join(`
`)}function em(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function nm(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function ai(s){return s!==""}function bo(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function wo(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const im=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ur(s){return s.replace(im,rm)}const sm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function rm(s,t){let e=It[t];if(e===void 0){const n=sm.get(t);if(n!==void 0)e=It[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ur(e)}const am=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function To(s){return s.replace(am,om)}function om(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ao(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function lm(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===ol?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Sc?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===sn&&(t="SHADOWMAP_TYPE_VSM"),t}function cm(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case ci:case hi:t="ENVMAP_TYPE_CUBE";break;case Ls:t="ENVMAP_TYPE_CUBE_UV";break}return t}function hm(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case hi:t="ENVMAP_MODE_REFRACTION";break}return t}function um(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case ll:t="ENVMAP_BLENDING_MULTIPLY";break;case $c:t="ENVMAP_BLENDING_MIX";break;case qc:t="ENVMAP_BLENDING_ADD";break}return t}function dm(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function fm(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=lm(e),c=cm(e),h=hm(e),d=um(e),f=dm(e),m=e.isWebGL2?"":Qp(e),v=tm(e),g=em(r),p=i.createProgram();let u,y,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ai).join(`
`),u.length>0&&(u+=`
`),y=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ai).join(`
`),y.length>0&&(y+=`
`)):(u=[Ao(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ai).join(`
`),y=[m,Ao(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==xn?"#define TONE_MAPPING":"",e.toneMapping!==xn?It.tonemapping_pars_fragment:"",e.toneMapping!==xn?Jp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",It.colorspace_pars_fragment,Zp("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ai).join(`
`)),o=Ur(o),o=bo(o,e),o=wo(o,e),a=Ur(a),a=bo(a,e),a=wo(a,e),o=To(o),a=To(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,u=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,y=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Wa?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const E=x+u+o,R=x+y+a,T=So(i,i.VERTEX_SHADER,E),A=So(i,i.FRAGMENT_SHADER,R);i.attachShader(p,T),i.attachShader(p,A),e.index0AttributeName!==void 0?i.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function N(U){if(s.debug.checkShaderErrors){const V=i.getProgramInfoLog(p).trim(),L=i.getShaderInfoLog(T).trim(),F=i.getShaderInfoLog(A).trim();let G=!0,q=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(G=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,p,T,A);else{const W=Eo(i,T,"vertex"),$=Eo(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+V+`
`+W+`
`+$)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(L===""||F==="")&&(q=!1);q&&(U.diagnostics={runnable:G,programLog:V,vertexShader:{log:L,prefix:u},fragmentShader:{log:F,prefix:y}})}i.deleteShader(T),i.deleteShader(A),_=new fs(i,p),M=nm(i,p)}let _;this.getUniforms=function(){return _===void 0&&N(this),_};let M;this.getAttributes=function(){return M===void 0&&N(this),M};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=i.getProgramParameter(p,qp)),P},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Yp++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=T,this.fragmentShader=A,this}let pm=0;class mm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new gm(t),e.set(t,n)),n}}class gm{constructor(t){this.id=pm++,this.code=t,this.usedTimes=0}}function vm(s,t,e,n,i,r,o){const a=new Xr,l=new mm,c=[],h=i.isWebGL2,d=i.logarithmicDepthBuffer,f=i.vertexTextures;let m=i.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return _===0?"uv":`uv${_}`}function p(_,M,P,U,V){const L=U.fog,F=V.geometry,G=_.isMeshStandardMaterial?U.environment:null,q=(_.isMeshStandardMaterial?e:t).get(_.envMap||G),W=q&&q.mapping===Ls?q.image.height:null,$=v[_.type];_.precision!==null&&(m=i.getMaxPrecision(_.precision),m!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",m,"instead."));const Y=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,J=Y!==void 0?Y.length:0;let rt=0;F.morphAttributes.position!==void 0&&(rt=1),F.morphAttributes.normal!==void 0&&(rt=2),F.morphAttributes.color!==void 0&&(rt=3);let X,j,ot,gt;if($){const xe=qe[$];X=xe.vertexShader,j=xe.fragmentShader}else X=_.vertexShader,j=_.fragmentShader,l.update(_),ot=l.getVertexShaderID(_),gt=l.getFragmentShaderID(_);const mt=s.getRenderTarget(),Lt=V.isInstancedMesh===!0,Dt=V.isBatchedMesh===!0,St=!!_.map,Gt=!!_.matcap,O=!!q,_e=!!_.aoMap,_t=!!_.lightMap,Tt=!!_.bumpMap,ut=!!_.normalMap,Kt=!!_.displacementMap,Nt=!!_.emissiveMap,w=!!_.metalnessMap,S=!!_.roughnessMap,B=_.anisotropy>0,Q=_.clearcoat>0,Z=_.iridescence>0,tt=_.sheen>0,dt=_.transmission>0,at=B&&!!_.anisotropyMap,ct=Q&&!!_.clearcoatMap,yt=Q&&!!_.clearcoatNormalMap,Ft=Q&&!!_.clearcoatRoughnessMap,K=Z&&!!_.iridescenceMap,Wt=Z&&!!_.iridescenceThicknessMap,Ht=tt&&!!_.sheenColorMap,wt=tt&&!!_.sheenRoughnessMap,vt=!!_.specularMap,ht=!!_.specularColorMap,Ut=!!_.specularIntensityMap,Vt=dt&&!!_.transmissionMap,Qt=dt&&!!_.thicknessMap,zt=!!_.gradientMap,et=!!_.alphaMap,C=_.alphaTest>0,it=!!_.alphaHash,st=!!_.extensions,Et=!!F.attributes.uv1,xt=!!F.attributes.uv2,$t=!!F.attributes.uv3;let qt=xn;return _.toneMapped&&(mt===null||mt.isXRRenderTarget===!0)&&(qt=s.toneMapping),{isWebGL2:h,shaderID:$,shaderType:_.type,shaderName:_.name,vertexShader:X,fragmentShader:j,defines:_.defines,customVertexShaderID:ot,customFragmentShaderID:gt,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:m,batching:Dt,instancing:Lt,instancingColor:Lt&&V.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:mt===null?s.outputColorSpace:mt.isXRRenderTarget===!0?mt.texture.colorSpace:hn,map:St,matcap:Gt,envMap:O,envMapMode:O&&q.mapping,envMapCubeUVHeight:W,aoMap:_e,lightMap:_t,bumpMap:Tt,normalMap:ut,displacementMap:f&&Kt,emissiveMap:Nt,normalMapObjectSpace:ut&&_.normalMapType===uh,normalMapTangentSpace:ut&&_.normalMapType===hh,metalnessMap:w,roughnessMap:S,anisotropy:B,anisotropyMap:at,clearcoat:Q,clearcoatMap:ct,clearcoatNormalMap:yt,clearcoatRoughnessMap:Ft,iridescence:Z,iridescenceMap:K,iridescenceThicknessMap:Wt,sheen:tt,sheenColorMap:Ht,sheenRoughnessMap:wt,specularMap:vt,specularColorMap:ht,specularIntensityMap:Ut,transmission:dt,transmissionMap:Vt,thicknessMap:Qt,gradientMap:zt,opaque:_.transparent===!1&&_.blending===oi,alphaMap:et,alphaTest:C,alphaHash:it,combine:_.combine,mapUv:St&&g(_.map.channel),aoMapUv:_e&&g(_.aoMap.channel),lightMapUv:_t&&g(_.lightMap.channel),bumpMapUv:Tt&&g(_.bumpMap.channel),normalMapUv:ut&&g(_.normalMap.channel),displacementMapUv:Kt&&g(_.displacementMap.channel),emissiveMapUv:Nt&&g(_.emissiveMap.channel),metalnessMapUv:w&&g(_.metalnessMap.channel),roughnessMapUv:S&&g(_.roughnessMap.channel),anisotropyMapUv:at&&g(_.anisotropyMap.channel),clearcoatMapUv:ct&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:yt&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ft&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:Wt&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ht&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:wt&&g(_.sheenRoughnessMap.channel),specularMapUv:vt&&g(_.specularMap.channel),specularColorMapUv:ht&&g(_.specularColorMap.channel),specularIntensityMapUv:Ut&&g(_.specularIntensityMap.channel),transmissionMapUv:Vt&&g(_.transmissionMap.channel),thicknessMapUv:Qt&&g(_.thicknessMap.channel),alphaMapUv:et&&g(_.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ut||B),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Et,vertexUv2s:xt,vertexUv3s:$t,pointsUvs:V.isPoints===!0&&!!F.attributes.uv&&(St||et),fog:!!L,useFog:_.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:V.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:rt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:qt,useLegacyLights:s._useLegacyLights,decodeVideoTexture:St&&_.map.isVideoTexture===!0&&Xt.getTransfer(_.map.colorSpace)===jt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===an,flipSided:_.side===Ae,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:st&&_.extensions.derivatives===!0,extensionFragDepth:st&&_.extensions.fragDepth===!0,extensionDrawBuffers:st&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:st&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:st&&_.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()}}function u(_){const M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(const P in _.defines)M.push(P),M.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(y(M,_),x(M,_),M.push(s.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function y(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapCubeUVHeight),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.morphAttributeCount),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function x(_,M){a.disableAll(),M.isWebGL2&&a.enable(0),M.supportsVertexTextures&&a.enable(1),M.instancing&&a.enable(2),M.instancingColor&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),_.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.skinning&&a.enable(4),M.morphTargets&&a.enable(5),M.morphNormals&&a.enable(6),M.morphColors&&a.enable(7),M.premultipliedAlpha&&a.enable(8),M.shadowMapEnabled&&a.enable(9),M.useLegacyLights&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),_.push(a.mask)}function E(_){const M=v[_.type];let P;if(M){const U=qe[M];P=Jh.clone(U.uniforms)}else P=_.uniforms;return P}function R(_,M){let P;for(let U=0,V=c.length;U<V;U++){const L=c[U];if(L.cacheKey===M){P=L,++P.usedTimes;break}}return P===void 0&&(P=new fm(s,M,_,r),c.push(P)),P}function T(_){if(--_.usedTimes===0){const M=c.indexOf(_);c[M]=c[c.length-1],c.pop(),_.destroy()}}function A(_){l.remove(_)}function N(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:E,acquireProgram:R,releaseProgram:T,releaseShaderCache:A,programs:c,dispose:N}}function _m(){let s=new WeakMap;function t(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function e(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function xm(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Ro(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Co(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(d,f,m,v,g,p){let u=s[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:m,groupOrder:v,renderOrder:d.renderOrder,z:g,group:p},s[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=m,u.groupOrder=v,u.renderOrder=d.renderOrder,u.z=g,u.group=p),t++,u}function a(d,f,m,v,g,p){const u=o(d,f,m,v,g,p);m.transmission>0?n.push(u):m.transparent===!0?i.push(u):e.push(u)}function l(d,f,m,v,g,p){const u=o(d,f,m,v,g,p);m.transmission>0?n.unshift(u):m.transparent===!0?i.unshift(u):e.unshift(u)}function c(d,f){e.length>1&&e.sort(d||xm),n.length>1&&n.sort(f||Ro),i.length>1&&i.sort(f||Ro)}function h(){for(let d=t,f=s.length;d<f;d++){const m=s[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Mm(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new Co,s.set(n,[o])):i>=r.length?(o=new Co,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function ym(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Rt};break;case"SpotLight":e={position:new D,direction:new D,color:new Rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Rt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Rt,groundColor:new Rt};break;case"RectAreaLight":e={color:new Rt,position:new D,halfWidth:new D,halfHeight:new D};break}return s[t.id]=e,e}}}function Sm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Em=0;function bm(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function wm(s,t){const e=new ym,n=Sm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new D);const r=new D,o=new ne,a=new ne;function l(h,d){let f=0,m=0,v=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let g=0,p=0,u=0,y=0,x=0,E=0,R=0,T=0,A=0,N=0,_=0;h.sort(bm);const M=d===!0?Math.PI:1;for(let U=0,V=h.length;U<V;U++){const L=h[U],F=L.color,G=L.intensity,q=L.distance,W=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)f+=F.r*G*M,m+=F.g*G*M,v+=F.b*G*M;else if(L.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(L.sh.coefficients[$],G);_++}else if(L.isDirectionalLight){const $=e.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity*M),L.castShadow){const Y=L.shadow,J=n.get(L);J.shadowBias=Y.bias,J.shadowNormalBias=Y.normalBias,J.shadowRadius=Y.radius,J.shadowMapSize=Y.mapSize,i.directionalShadow[g]=J,i.directionalShadowMap[g]=W,i.directionalShadowMatrix[g]=L.shadow.matrix,E++}i.directional[g]=$,g++}else if(L.isSpotLight){const $=e.get(L);$.position.setFromMatrixPosition(L.matrixWorld),$.color.copy(F).multiplyScalar(G*M),$.distance=q,$.coneCos=Math.cos(L.angle),$.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),$.decay=L.decay,i.spot[u]=$;const Y=L.shadow;if(L.map&&(i.spotLightMap[A]=L.map,A++,Y.updateMatrices(L),L.castShadow&&N++),i.spotLightMatrix[u]=Y.matrix,L.castShadow){const J=n.get(L);J.shadowBias=Y.bias,J.shadowNormalBias=Y.normalBias,J.shadowRadius=Y.radius,J.shadowMapSize=Y.mapSize,i.spotShadow[u]=J,i.spotShadowMap[u]=W,T++}u++}else if(L.isRectAreaLight){const $=e.get(L);$.color.copy(F).multiplyScalar(G),$.halfWidth.set(L.width*.5,0,0),$.halfHeight.set(0,L.height*.5,0),i.rectArea[y]=$,y++}else if(L.isPointLight){const $=e.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity*M),$.distance=L.distance,$.decay=L.decay,L.castShadow){const Y=L.shadow,J=n.get(L);J.shadowBias=Y.bias,J.shadowNormalBias=Y.normalBias,J.shadowRadius=Y.radius,J.shadowMapSize=Y.mapSize,J.shadowCameraNear=Y.camera.near,J.shadowCameraFar=Y.camera.far,i.pointShadow[p]=J,i.pointShadowMap[p]=W,i.pointShadowMatrix[p]=L.shadow.matrix,R++}i.point[p]=$,p++}else if(L.isHemisphereLight){const $=e.get(L);$.skyColor.copy(L.color).multiplyScalar(G*M),$.groundColor.copy(L.groundColor).multiplyScalar(G*M),i.hemi[x]=$,x++}}y>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=nt.LTC_FLOAT_1,i.rectAreaLTC2=nt.LTC_FLOAT_2):(i.rectAreaLTC1=nt.LTC_HALF_1,i.rectAreaLTC2=nt.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=nt.LTC_FLOAT_1,i.rectAreaLTC2=nt.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=nt.LTC_HALF_1,i.rectAreaLTC2=nt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=m,i.ambient[2]=v;const P=i.hash;(P.directionalLength!==g||P.pointLength!==p||P.spotLength!==u||P.rectAreaLength!==y||P.hemiLength!==x||P.numDirectionalShadows!==E||P.numPointShadows!==R||P.numSpotShadows!==T||P.numSpotMaps!==A||P.numLightProbes!==_)&&(i.directional.length=g,i.spot.length=u,i.rectArea.length=y,i.point.length=p,i.hemi.length=x,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.pointShadow.length=R,i.pointShadowMap.length=R,i.spotShadow.length=T,i.spotShadowMap.length=T,i.directionalShadowMatrix.length=E,i.pointShadowMatrix.length=R,i.spotLightMatrix.length=T+A-N,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=N,i.numLightProbes=_,P.directionalLength=g,P.pointLength=p,P.spotLength=u,P.rectAreaLength=y,P.hemiLength=x,P.numDirectionalShadows=E,P.numPointShadows=R,P.numSpotShadows=T,P.numSpotMaps=A,P.numLightProbes=_,i.version=Em++)}function c(h,d){let f=0,m=0,v=0,g=0,p=0;const u=d.matrixWorldInverse;for(let y=0,x=h.length;y<x;y++){const E=h[y];if(E.isDirectionalLight){const R=i.directional[f];R.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(u),f++}else if(E.isSpotLight){const R=i.spot[v];R.position.setFromMatrixPosition(E.matrixWorld),R.position.applyMatrix4(u),R.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(u),v++}else if(E.isRectAreaLight){const R=i.rectArea[g];R.position.setFromMatrixPosition(E.matrixWorld),R.position.applyMatrix4(u),a.identity(),o.copy(E.matrixWorld),o.premultiply(u),a.extractRotation(o),R.halfWidth.set(E.width*.5,0,0),R.halfHeight.set(0,E.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),g++}else if(E.isPointLight){const R=i.point[m];R.position.setFromMatrixPosition(E.matrixWorld),R.position.applyMatrix4(u),m++}else if(E.isHemisphereLight){const R=i.hemi[p];R.direction.setFromMatrixPosition(E.matrixWorld),R.direction.transformDirection(u),p++}}}return{setup:l,setupView:c,state:i}}function Lo(s,t){const e=new wm(s,t),n=[],i=[];function r(){n.length=0,i.length=0}function o(d){n.push(d)}function a(d){i.push(d)}function l(d){e.setup(n,d)}function c(d){e.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function Tm(s,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let l;return a===void 0?(l=new Lo(s,t),e.set(r,[l])):o>=a.length?(l=new Lo(s,t),a.push(l)):l=a[o],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class Am extends Ui{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Rm extends Ui{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Cm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Lm=`uniform sampler2D shadow_pass;
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
}`;function Pm(s,t,e){let n=new Is;const i=new Ct,r=new Ct,o=new ee,a=new Am({depthPacking:ch}),l=new Rm,c={},h=e.maxTextureSize,d={[Mn]:Ae,[Ae]:Mn,[an]:an},f=new ve({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ct},radius:{value:4}},vertexShader:Cm,fragmentShader:Lm}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const v=new Oe;v.setAttribute("position",new ue(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ge(v,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ol;let u=this.type;this.render=function(T,A,N){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const _=s.getRenderTarget(),M=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),U=s.state;U.setBlending(_n),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const V=u!==sn&&this.type===sn,L=u===sn&&this.type!==sn;for(let F=0,G=T.length;F<G;F++){const q=T[F],W=q.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);const $=W.getFrameExtents();if(i.multiply($),r.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/$.x),i.x=r.x*$.x,W.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/$.y),i.y=r.y*$.y,W.mapSize.y=r.y)),W.map===null||V===!0||L===!0){const J=this.type!==sn?{minFilter:Jt,magFilter:Jt}:{};W.map!==null&&W.map.dispose(),W.map=new Ke(i.x,i.y,J),W.map.texture.name=q.name+".shadowMap",W.camera.updateProjectionMatrix()}s.setRenderTarget(W.map),s.clear();const Y=W.getViewportCount();for(let J=0;J<Y;J++){const rt=W.getViewport(J);o.set(r.x*rt.x,r.y*rt.y,r.x*rt.z,r.y*rt.w),U.viewport(o),W.updateMatrices(q,J),n=W.getFrustum(),E(A,N,W.camera,q,this.type)}W.isPointLightShadow!==!0&&this.type===sn&&y(W,N),W.needsUpdate=!1}u=this.type,p.needsUpdate=!1,s.setRenderTarget(_,M,P)};function y(T,A){const N=t.update(g);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Ke(i.x,i.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(A,null,N,f,g,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(A,null,N,m,g,null)}function x(T,A,N,_){let M=null;const P=N.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)M=P;else if(M=N.isPointLight===!0?l:a,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const U=M.uuid,V=A.uuid;let L=c[U];L===void 0&&(L={},c[U]=L);let F=L[V];F===void 0&&(F=M.clone(),L[V]=F,A.addEventListener("dispose",R)),M=F}if(M.visible=A.visible,M.wireframe=A.wireframe,_===sn?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:d[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,N.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const U=s.properties.get(M);U.light=N}return M}function E(T,A,N,_,M){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===sn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,T.matrixWorld);const V=t.update(T),L=T.material;if(Array.isArray(L)){const F=V.groups;for(let G=0,q=F.length;G<q;G++){const W=F[G],$=L[W.materialIndex];if($&&$.visible){const Y=x(T,$,_,M);T.onBeforeShadow(s,T,A,N,V,Y,W),s.renderBufferDirect(N,null,V,Y,T,W),T.onAfterShadow(s,T,A,N,V,Y,W)}}}else if(L.visible){const F=x(T,L,_,M);T.onBeforeShadow(s,T,A,N,V,F,null),s.renderBufferDirect(N,null,V,F,T,null),T.onAfterShadow(s,T,A,N,V,F,null)}}const U=T.children;for(let V=0,L=U.length;V<L;V++)E(U[V],A,N,_,M)}function R(T){T.target.removeEventListener("dispose",R);for(const N in c){const _=c[N],M=T.target.uuid;M in _&&(_[M].dispose(),delete _[M])}}}function Dm(s,t,e){const n=e.isWebGL2;function i(){let C=!1;const it=new ee;let st=null;const Et=new ee(0,0,0,0);return{setMask:function(xt){st!==xt&&!C&&(s.colorMask(xt,xt,xt,xt),st=xt)},setLocked:function(xt){C=xt},setClear:function(xt,$t,qt,oe,xe){xe===!0&&(xt*=oe,$t*=oe,qt*=oe),it.set(xt,$t,qt,oe),Et.equals(it)===!1&&(s.clearColor(xt,$t,qt,oe),Et.copy(it))},reset:function(){C=!1,st=null,Et.set(-1,0,0,0)}}}function r(){let C=!1,it=null,st=null,Et=null;return{setTest:function(xt){xt?Dt(s.DEPTH_TEST):St(s.DEPTH_TEST)},setMask:function(xt){it!==xt&&!C&&(s.depthMask(xt),it=xt)},setFunc:function(xt){if(st!==xt){switch(xt){case Bc:s.depthFunc(s.NEVER);break;case kc:s.depthFunc(s.ALWAYS);break;case Hc:s.depthFunc(s.LESS);break;case _s:s.depthFunc(s.LEQUAL);break;case Gc:s.depthFunc(s.EQUAL);break;case Vc:s.depthFunc(s.GEQUAL);break;case Wc:s.depthFunc(s.GREATER);break;case Xc:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}st=xt}},setLocked:function(xt){C=xt},setClear:function(xt){Et!==xt&&(s.clearDepth(xt),Et=xt)},reset:function(){C=!1,it=null,st=null,Et=null}}}function o(){let C=!1,it=null,st=null,Et=null,xt=null,$t=null,qt=null,oe=null,xe=null;return{setTest:function(Yt){C||(Yt?Dt(s.STENCIL_TEST):St(s.STENCIL_TEST))},setMask:function(Yt){it!==Yt&&!C&&(s.stencilMask(Yt),it=Yt)},setFunc:function(Yt,Me,$e){(st!==Yt||Et!==Me||xt!==$e)&&(s.stencilFunc(Yt,Me,$e),st=Yt,Et=Me,xt=$e)},setOp:function(Yt,Me,$e){($t!==Yt||qt!==Me||oe!==$e)&&(s.stencilOp(Yt,Me,$e),$t=Yt,qt=Me,oe=$e)},setLocked:function(Yt){C=Yt},setClear:function(Yt){xe!==Yt&&(s.clearStencil(Yt),xe=Yt)},reset:function(){C=!1,it=null,st=null,Et=null,xt=null,$t=null,qt=null,oe=null,xe=null}}}const a=new i,l=new r,c=new o,h=new WeakMap,d=new WeakMap;let f={},m={},v=new WeakMap,g=[],p=null,u=!1,y=null,x=null,E=null,R=null,T=null,A=null,N=null,_=new Rt(0,0,0),M=0,P=!1,U=null,V=null,L=null,F=null,G=null;const q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,$=0;const Y=s.getParameter(s.VERSION);Y.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(Y)[1]),W=$>=1):Y.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),W=$>=2);let J=null,rt={};const X=s.getParameter(s.SCISSOR_BOX),j=s.getParameter(s.VIEWPORT),ot=new ee().fromArray(X),gt=new ee().fromArray(j);function mt(C,it,st,Et){const xt=new Uint8Array(4),$t=s.createTexture();s.bindTexture(C,$t),s.texParameteri(C,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(C,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let qt=0;qt<st;qt++)n&&(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)?s.texImage3D(it,0,s.RGBA,1,1,Et,0,s.RGBA,s.UNSIGNED_BYTE,xt):s.texImage2D(it+qt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,xt);return $t}const Lt={};Lt[s.TEXTURE_2D]=mt(s.TEXTURE_2D,s.TEXTURE_2D,1),Lt[s.TEXTURE_CUBE_MAP]=mt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Lt[s.TEXTURE_2D_ARRAY]=mt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Lt[s.TEXTURE_3D]=mt(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Dt(s.DEPTH_TEST),l.setFunc(_s),Nt(!1),w(ua),Dt(s.CULL_FACE),ut(_n);function Dt(C){f[C]!==!0&&(s.enable(C),f[C]=!0)}function St(C){f[C]!==!1&&(s.disable(C),f[C]=!1)}function Gt(C,it){return m[C]!==it?(s.bindFramebuffer(C,it),m[C]=it,n&&(C===s.DRAW_FRAMEBUFFER&&(m[s.FRAMEBUFFER]=it),C===s.FRAMEBUFFER&&(m[s.DRAW_FRAMEBUFFER]=it)),!0):!1}function O(C,it){let st=g,Et=!1;if(C)if(st=v.get(it),st===void 0&&(st=[],v.set(it,st)),C.isWebGLMultipleRenderTargets){const xt=C.texture;if(st.length!==xt.length||st[0]!==s.COLOR_ATTACHMENT0){for(let $t=0,qt=xt.length;$t<qt;$t++)st[$t]=s.COLOR_ATTACHMENT0+$t;st.length=xt.length,Et=!0}}else st[0]!==s.COLOR_ATTACHMENT0&&(st[0]=s.COLOR_ATTACHMENT0,Et=!0);else st[0]!==s.BACK&&(st[0]=s.BACK,Et=!0);Et&&(e.isWebGL2?s.drawBuffers(st):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(st))}function _e(C){return p!==C?(s.useProgram(C),p=C,!0):!1}const _t={[Pn]:s.FUNC_ADD,[bc]:s.FUNC_SUBTRACT,[wc]:s.FUNC_REVERSE_SUBTRACT};if(n)_t[pa]=s.MIN,_t[ma]=s.MAX;else{const C=t.get("EXT_blend_minmax");C!==null&&(_t[pa]=C.MIN_EXT,_t[ma]=C.MAX_EXT)}const Tt={[Tc]:s.ZERO,[Ac]:s.ONE,[Rc]:s.SRC_COLOR,[Tr]:s.SRC_ALPHA,[Ic]:s.SRC_ALPHA_SATURATE,[Dc]:s.DST_COLOR,[Lc]:s.DST_ALPHA,[Cc]:s.ONE_MINUS_SRC_COLOR,[Ar]:s.ONE_MINUS_SRC_ALPHA,[Uc]:s.ONE_MINUS_DST_COLOR,[Pc]:s.ONE_MINUS_DST_ALPHA,[Nc]:s.CONSTANT_COLOR,[Fc]:s.ONE_MINUS_CONSTANT_COLOR,[Oc]:s.CONSTANT_ALPHA,[zc]:s.ONE_MINUS_CONSTANT_ALPHA};function ut(C,it,st,Et,xt,$t,qt,oe,xe,Yt){if(C===_n){u===!0&&(St(s.BLEND),u=!1);return}if(u===!1&&(Dt(s.BLEND),u=!0),C!==Ec){if(C!==y||Yt!==P){if((x!==Pn||T!==Pn)&&(s.blendEquation(s.FUNC_ADD),x=Pn,T=Pn),Yt)switch(C){case oi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case wr:s.blendFunc(s.ONE,s.ONE);break;case da:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case fa:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case oi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case wr:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case da:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case fa:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}E=null,R=null,A=null,N=null,_.set(0,0,0),M=0,y=C,P=Yt}return}xt=xt||it,$t=$t||st,qt=qt||Et,(it!==x||xt!==T)&&(s.blendEquationSeparate(_t[it],_t[xt]),x=it,T=xt),(st!==E||Et!==R||$t!==A||qt!==N)&&(s.blendFuncSeparate(Tt[st],Tt[Et],Tt[$t],Tt[qt]),E=st,R=Et,A=$t,N=qt),(oe.equals(_)===!1||xe!==M)&&(s.blendColor(oe.r,oe.g,oe.b,xe),_.copy(oe),M=xe),y=C,P=!1}function Kt(C,it){C.side===an?St(s.CULL_FACE):Dt(s.CULL_FACE);let st=C.side===Ae;it&&(st=!st),Nt(st),C.blending===oi&&C.transparent===!1?ut(_n):ut(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),l.setFunc(C.depthFunc),l.setTest(C.depthTest),l.setMask(C.depthWrite),a.setMask(C.colorWrite);const Et=C.stencilWrite;c.setTest(Et),Et&&(c.setMask(C.stencilWriteMask),c.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),c.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),B(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?Dt(s.SAMPLE_ALPHA_TO_COVERAGE):St(s.SAMPLE_ALPHA_TO_COVERAGE)}function Nt(C){U!==C&&(C?s.frontFace(s.CW):s.frontFace(s.CCW),U=C)}function w(C){C!==Mc?(Dt(s.CULL_FACE),C!==V&&(C===ua?s.cullFace(s.BACK):C===yc?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):St(s.CULL_FACE),V=C}function S(C){C!==L&&(W&&s.lineWidth(C),L=C)}function B(C,it,st){C?(Dt(s.POLYGON_OFFSET_FILL),(F!==it||G!==st)&&(s.polygonOffset(it,st),F=it,G=st)):St(s.POLYGON_OFFSET_FILL)}function Q(C){C?Dt(s.SCISSOR_TEST):St(s.SCISSOR_TEST)}function Z(C){C===void 0&&(C=s.TEXTURE0+q-1),J!==C&&(s.activeTexture(C),J=C)}function tt(C,it,st){st===void 0&&(J===null?st=s.TEXTURE0+q-1:st=J);let Et=rt[st];Et===void 0&&(Et={type:void 0,texture:void 0},rt[st]=Et),(Et.type!==C||Et.texture!==it)&&(J!==st&&(s.activeTexture(st),J=st),s.bindTexture(C,it||Lt[C]),Et.type=C,Et.texture=it)}function dt(){const C=rt[J];C!==void 0&&C.type!==void 0&&(s.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function at(){try{s.compressedTexImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ct(){try{s.compressedTexImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function yt(){try{s.texSubImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ft(){try{s.texSubImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function K(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Wt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ht(){try{s.texStorage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function wt(){try{s.texStorage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function vt(){try{s.texImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ht(){try{s.texImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ut(C){ot.equals(C)===!1&&(s.scissor(C.x,C.y,C.z,C.w),ot.copy(C))}function Vt(C){gt.equals(C)===!1&&(s.viewport(C.x,C.y,C.z,C.w),gt.copy(C))}function Qt(C,it){let st=d.get(it);st===void 0&&(st=new WeakMap,d.set(it,st));let Et=st.get(C);Et===void 0&&(Et=s.getUniformBlockIndex(it,C.name),st.set(C,Et))}function zt(C,it){const Et=d.get(it).get(C);h.get(it)!==Et&&(s.uniformBlockBinding(it,Et,C.__bindingPointIndex),h.set(it,Et))}function et(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),f={},J=null,rt={},m={},v=new WeakMap,g=[],p=null,u=!1,y=null,x=null,E=null,R=null,T=null,A=null,N=null,_=new Rt(0,0,0),M=0,P=!1,U=null,V=null,L=null,F=null,G=null,ot.set(0,0,s.canvas.width,s.canvas.height),gt.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Dt,disable:St,bindFramebuffer:Gt,drawBuffers:O,useProgram:_e,setBlending:ut,setMaterial:Kt,setFlipSided:Nt,setCullFace:w,setLineWidth:S,setPolygonOffset:B,setScissorTest:Q,activeTexture:Z,bindTexture:tt,unbindTexture:dt,compressedTexImage2D:at,compressedTexImage3D:ct,texImage2D:vt,texImage3D:ht,updateUBOMapping:Qt,uniformBlockBinding:zt,texStorage2D:Ht,texStorage3D:wt,texSubImage2D:yt,texSubImage3D:Ft,compressedTexSubImage2D:K,compressedTexSubImage3D:Wt,scissor:Ut,viewport:Vt,reset:et}}function Um(s,t,e,n,i,r,o){const a=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let d;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(w,S){return m?new OffscreenCanvas(w,S):ws("canvas")}function g(w,S,B,Q){let Z=1;if((w.width>Q||w.height>Q)&&(Z=Q/Math.max(w.width,w.height)),Z<1||S===!0)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap){const tt=S?bs:Math.floor,dt=tt(Z*w.width),at=tt(Z*w.height);d===void 0&&(d=v(dt,at));const ct=B?v(dt,at):d;return ct.width=dt,ct.height=at,ct.getContext("2d").drawImage(w,0,0,dt,at),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+w.width+"x"+w.height+") to ("+dt+"x"+at+")."),ct}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+w.width+"x"+w.height+")."),w;return w}function p(w){return Dr(w.width)&&Dr(w.height)}function u(w){return a?!1:w.wrapS!==Ce||w.wrapT!==Ce||w.minFilter!==Jt&&w.minFilter!==me}function y(w,S){return w.generateMipmaps&&S&&w.minFilter!==Jt&&w.minFilter!==me}function x(w){s.generateMipmap(w)}function E(w,S,B,Q,Z=!1){if(a===!1)return S;if(w!==null){if(s[w]!==void 0)return s[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let tt=S;if(S===s.RED&&(B===s.FLOAT&&(tt=s.R32F),B===s.HALF_FLOAT&&(tt=s.R16F),B===s.UNSIGNED_BYTE&&(tt=s.R8)),S===s.RED_INTEGER&&(B===s.UNSIGNED_BYTE&&(tt=s.R8UI),B===s.UNSIGNED_SHORT&&(tt=s.R16UI),B===s.UNSIGNED_INT&&(tt=s.R32UI),B===s.BYTE&&(tt=s.R8I),B===s.SHORT&&(tt=s.R16I),B===s.INT&&(tt=s.R32I)),S===s.RG&&(B===s.FLOAT&&(tt=s.RG32F),B===s.HALF_FLOAT&&(tt=s.RG16F),B===s.UNSIGNED_BYTE&&(tt=s.RG8)),S===s.RGBA){const dt=Z?Ms:Xt.getTransfer(Q);B===s.FLOAT&&(tt=s.RGBA32F),B===s.HALF_FLOAT&&(tt=s.RGBA16F),B===s.UNSIGNED_BYTE&&(tt=dt===jt?s.SRGB8_ALPHA8:s.RGBA8),B===s.UNSIGNED_SHORT_4_4_4_4&&(tt=s.RGBA4),B===s.UNSIGNED_SHORT_5_5_5_1&&(tt=s.RGB5_A1)}return(tt===s.R16F||tt===s.R32F||tt===s.RG16F||tt===s.RG32F||tt===s.RGBA16F||tt===s.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function R(w,S,B){return y(w,B)===!0||w.isFramebufferTexture&&w.minFilter!==Jt&&w.minFilter!==me?Math.log2(Math.max(S.width,S.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?S.mipmaps.length:1}function T(w){return w===Jt||w===ga||w===Gs?s.NEAREST:s.LINEAR}function A(w){const S=w.target;S.removeEventListener("dispose",A),_(S),S.isVideoTexture&&h.delete(S)}function N(w){const S=w.target;S.removeEventListener("dispose",N),P(S)}function _(w){const S=n.get(w);if(S.__webglInit===void 0)return;const B=w.source,Q=f.get(B);if(Q){const Z=Q[S.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&M(w),Object.keys(Q).length===0&&f.delete(B)}n.remove(w)}function M(w){const S=n.get(w);s.deleteTexture(S.__webglTexture);const B=w.source,Q=f.get(B);delete Q[S.__cacheKey],o.memory.textures--}function P(w){const S=w.texture,B=n.get(w),Q=n.get(S);if(Q.__webglTexture!==void 0&&(s.deleteTexture(Q.__webglTexture),o.memory.textures--),w.depthTexture&&w.depthTexture.dispose(),w.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(B.__webglFramebuffer[Z]))for(let tt=0;tt<B.__webglFramebuffer[Z].length;tt++)s.deleteFramebuffer(B.__webglFramebuffer[Z][tt]);else s.deleteFramebuffer(B.__webglFramebuffer[Z]);B.__webglDepthbuffer&&s.deleteRenderbuffer(B.__webglDepthbuffer[Z])}else{if(Array.isArray(B.__webglFramebuffer))for(let Z=0;Z<B.__webglFramebuffer.length;Z++)s.deleteFramebuffer(B.__webglFramebuffer[Z]);else s.deleteFramebuffer(B.__webglFramebuffer);if(B.__webglDepthbuffer&&s.deleteRenderbuffer(B.__webglDepthbuffer),B.__webglMultisampledFramebuffer&&s.deleteFramebuffer(B.__webglMultisampledFramebuffer),B.__webglColorRenderbuffer)for(let Z=0;Z<B.__webglColorRenderbuffer.length;Z++)B.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(B.__webglColorRenderbuffer[Z]);B.__webglDepthRenderbuffer&&s.deleteRenderbuffer(B.__webglDepthRenderbuffer)}if(w.isWebGLMultipleRenderTargets)for(let Z=0,tt=S.length;Z<tt;Z++){const dt=n.get(S[Z]);dt.__webglTexture&&(s.deleteTexture(dt.__webglTexture),o.memory.textures--),n.remove(S[Z])}n.remove(S),n.remove(w)}let U=0;function V(){U=0}function L(){const w=U;return w>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+i.maxTextures),U+=1,w}function F(w){const S=[];return S.push(w.wrapS),S.push(w.wrapT),S.push(w.wrapR||0),S.push(w.magFilter),S.push(w.minFilter),S.push(w.anisotropy),S.push(w.internalFormat),S.push(w.format),S.push(w.type),S.push(w.generateMipmaps),S.push(w.premultiplyAlpha),S.push(w.flipY),S.push(w.unpackAlignment),S.push(w.colorSpace),S.join()}function G(w,S){const B=n.get(w);if(w.isVideoTexture&&Kt(w),w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){const Q=w.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ot(B,w,S);return}}e.bindTexture(s.TEXTURE_2D,B.__webglTexture,s.TEXTURE0+S)}function q(w,S){const B=n.get(w);if(w.version>0&&B.__version!==w.version){ot(B,w,S);return}e.bindTexture(s.TEXTURE_2D_ARRAY,B.__webglTexture,s.TEXTURE0+S)}function W(w,S){const B=n.get(w);if(w.version>0&&B.__version!==w.version){ot(B,w,S);return}e.bindTexture(s.TEXTURE_3D,B.__webglTexture,s.TEXTURE0+S)}function $(w,S){const B=n.get(w);if(w.version>0&&B.__version!==w.version){gt(B,w,S);return}e.bindTexture(s.TEXTURE_CUBE_MAP,B.__webglTexture,s.TEXTURE0+S)}const Y={[xs]:s.REPEAT,[Ce]:s.CLAMP_TO_EDGE,[Lr]:s.MIRRORED_REPEAT},J={[Jt]:s.NEAREST,[ga]:s.NEAREST_MIPMAP_NEAREST,[Gs]:s.NEAREST_MIPMAP_LINEAR,[me]:s.LINEAR,[th]:s.LINEAR_MIPMAP_NEAREST,[On]:s.LINEAR_MIPMAP_LINEAR},rt={[dh]:s.NEVER,[_h]:s.ALWAYS,[fh]:s.LESS,[_l]:s.LEQUAL,[ph]:s.EQUAL,[vh]:s.GEQUAL,[mh]:s.GREATER,[gh]:s.NOTEQUAL};function X(w,S,B){if(B?(s.texParameteri(w,s.TEXTURE_WRAP_S,Y[S.wrapS]),s.texParameteri(w,s.TEXTURE_WRAP_T,Y[S.wrapT]),(w===s.TEXTURE_3D||w===s.TEXTURE_2D_ARRAY)&&s.texParameteri(w,s.TEXTURE_WRAP_R,Y[S.wrapR]),s.texParameteri(w,s.TEXTURE_MAG_FILTER,J[S.magFilter]),s.texParameteri(w,s.TEXTURE_MIN_FILTER,J[S.minFilter])):(s.texParameteri(w,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(w,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(w===s.TEXTURE_3D||w===s.TEXTURE_2D_ARRAY)&&s.texParameteri(w,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(S.wrapS!==Ce||S.wrapT!==Ce)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(w,s.TEXTURE_MAG_FILTER,T(S.magFilter)),s.texParameteri(w,s.TEXTURE_MIN_FILTER,T(S.minFilter)),S.minFilter!==Jt&&S.minFilter!==me&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(s.texParameteri(w,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(w,s.TEXTURE_COMPARE_FUNC,rt[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const Q=t.get("EXT_texture_filter_anisotropic");if(S.magFilter===Jt||S.minFilter!==Gs&&S.minFilter!==On||S.type===ln&&t.has("OES_texture_float_linear")===!1||a===!1&&S.type===zn&&t.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||n.get(S).__currentAnisotropy)&&(s.texParameterf(w,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy)}}function j(w,S){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,S.addEventListener("dispose",A));const Q=S.source;let Z=f.get(Q);Z===void 0&&(Z={},f.set(Q,Z));const tt=F(S);if(tt!==w.__cacheKey){Z[tt]===void 0&&(Z[tt]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,B=!0),Z[tt].usedTimes++;const dt=Z[w.__cacheKey];dt!==void 0&&(Z[w.__cacheKey].usedTimes--,dt.usedTimes===0&&M(S)),w.__cacheKey=tt,w.__webglTexture=Z[tt].texture}return B}function ot(w,S,B){let Q=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Q=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Q=s.TEXTURE_3D);const Z=j(w,S),tt=S.source;e.bindTexture(Q,w.__webglTexture,s.TEXTURE0+B);const dt=n.get(tt);if(tt.version!==dt.__version||Z===!0){e.activeTexture(s.TEXTURE0+B);const at=Xt.getPrimaries(Xt.workingColorSpace),ct=S.colorSpace===ke?null:Xt.getPrimaries(S.colorSpace),yt=S.colorSpace===ke||at===ct?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const Ft=u(S)&&p(S.image)===!1;let K=g(S.image,Ft,!1,i.maxTextureSize);K=Nt(S,K);const Wt=p(K)||a,Ht=r.convert(S.format,S.colorSpace);let wt=r.convert(S.type),vt=E(S.internalFormat,Ht,wt,S.colorSpace,S.isVideoTexture);X(Q,S,Wt);let ht;const Ut=S.mipmaps,Vt=a&&S.isVideoTexture!==!0&&vt!==gl,Qt=dt.__version===void 0||Z===!0,zt=R(S,K,Wt);if(S.isDepthTexture)vt=s.DEPTH_COMPONENT,a?S.type===ln?vt=s.DEPTH_COMPONENT32F:S.type===on?vt=s.DEPTH_COMPONENT24:S.type===In?vt=s.DEPTH24_STENCIL8:vt=s.DEPTH_COMPONENT16:S.type===ln&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===Nn&&vt===s.DEPTH_COMPONENT&&S.type!==Hr&&S.type!==on&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=on,wt=r.convert(S.type)),S.format===ui&&vt===s.DEPTH_COMPONENT&&(vt=s.DEPTH_STENCIL,S.type!==In&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=In,wt=r.convert(S.type))),Qt&&(Vt?e.texStorage2D(s.TEXTURE_2D,1,vt,K.width,K.height):e.texImage2D(s.TEXTURE_2D,0,vt,K.width,K.height,0,Ht,wt,null));else if(S.isDataTexture)if(Ut.length>0&&Wt){Vt&&Qt&&e.texStorage2D(s.TEXTURE_2D,zt,vt,Ut[0].width,Ut[0].height);for(let et=0,C=Ut.length;et<C;et++)ht=Ut[et],Vt?e.texSubImage2D(s.TEXTURE_2D,et,0,0,ht.width,ht.height,Ht,wt,ht.data):e.texImage2D(s.TEXTURE_2D,et,vt,ht.width,ht.height,0,Ht,wt,ht.data);S.generateMipmaps=!1}else Vt?(Qt&&e.texStorage2D(s.TEXTURE_2D,zt,vt,K.width,K.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,K.width,K.height,Ht,wt,K.data)):e.texImage2D(s.TEXTURE_2D,0,vt,K.width,K.height,0,Ht,wt,K.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Vt&&Qt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,zt,vt,Ut[0].width,Ut[0].height,K.depth);for(let et=0,C=Ut.length;et<C;et++)ht=Ut[et],S.format!==Te?Ht!==null?Vt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,et,0,0,0,ht.width,ht.height,K.depth,Ht,ht.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,et,vt,ht.width,ht.height,K.depth,0,ht.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,et,0,0,0,ht.width,ht.height,K.depth,Ht,wt,ht.data):e.texImage3D(s.TEXTURE_2D_ARRAY,et,vt,ht.width,ht.height,K.depth,0,Ht,wt,ht.data)}else{Vt&&Qt&&e.texStorage2D(s.TEXTURE_2D,zt,vt,Ut[0].width,Ut[0].height);for(let et=0,C=Ut.length;et<C;et++)ht=Ut[et],S.format!==Te?Ht!==null?Vt?e.compressedTexSubImage2D(s.TEXTURE_2D,et,0,0,ht.width,ht.height,Ht,ht.data):e.compressedTexImage2D(s.TEXTURE_2D,et,vt,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?e.texSubImage2D(s.TEXTURE_2D,et,0,0,ht.width,ht.height,Ht,wt,ht.data):e.texImage2D(s.TEXTURE_2D,et,vt,ht.width,ht.height,0,Ht,wt,ht.data)}else if(S.isDataArrayTexture)Vt?(Qt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,zt,vt,K.width,K.height,K.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,Ht,wt,K.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,vt,K.width,K.height,K.depth,0,Ht,wt,K.data);else if(S.isData3DTexture)Vt?(Qt&&e.texStorage3D(s.TEXTURE_3D,zt,vt,K.width,K.height,K.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,Ht,wt,K.data)):e.texImage3D(s.TEXTURE_3D,0,vt,K.width,K.height,K.depth,0,Ht,wt,K.data);else if(S.isFramebufferTexture){if(Qt)if(Vt)e.texStorage2D(s.TEXTURE_2D,zt,vt,K.width,K.height);else{let et=K.width,C=K.height;for(let it=0;it<zt;it++)e.texImage2D(s.TEXTURE_2D,it,vt,et,C,0,Ht,wt,null),et>>=1,C>>=1}}else if(Ut.length>0&&Wt){Vt&&Qt&&e.texStorage2D(s.TEXTURE_2D,zt,vt,Ut[0].width,Ut[0].height);for(let et=0,C=Ut.length;et<C;et++)ht=Ut[et],Vt?e.texSubImage2D(s.TEXTURE_2D,et,0,0,Ht,wt,ht):e.texImage2D(s.TEXTURE_2D,et,vt,Ht,wt,ht);S.generateMipmaps=!1}else Vt?(Qt&&e.texStorage2D(s.TEXTURE_2D,zt,vt,K.width,K.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Ht,wt,K)):e.texImage2D(s.TEXTURE_2D,0,vt,Ht,wt,K);y(S,Wt)&&x(Q),dt.__version=tt.version,S.onUpdate&&S.onUpdate(S)}w.__version=S.version}function gt(w,S,B){if(S.image.length!==6)return;const Q=j(w,S),Z=S.source;e.bindTexture(s.TEXTURE_CUBE_MAP,w.__webglTexture,s.TEXTURE0+B);const tt=n.get(Z);if(Z.version!==tt.__version||Q===!0){e.activeTexture(s.TEXTURE0+B);const dt=Xt.getPrimaries(Xt.workingColorSpace),at=S.colorSpace===ke?null:Xt.getPrimaries(S.colorSpace),ct=S.colorSpace===ke||dt===at?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ct);const yt=S.isCompressedTexture||S.image[0].isCompressedTexture,Ft=S.image[0]&&S.image[0].isDataTexture,K=[];for(let et=0;et<6;et++)!yt&&!Ft?K[et]=g(S.image[et],!1,!0,i.maxCubemapSize):K[et]=Ft?S.image[et].image:S.image[et],K[et]=Nt(S,K[et]);const Wt=K[0],Ht=p(Wt)||a,wt=r.convert(S.format,S.colorSpace),vt=r.convert(S.type),ht=E(S.internalFormat,wt,vt,S.colorSpace),Ut=a&&S.isVideoTexture!==!0,Vt=tt.__version===void 0||Q===!0;let Qt=R(S,Wt,Ht);X(s.TEXTURE_CUBE_MAP,S,Ht);let zt;if(yt){Ut&&Vt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Qt,ht,Wt.width,Wt.height);for(let et=0;et<6;et++){zt=K[et].mipmaps;for(let C=0;C<zt.length;C++){const it=zt[C];S.format!==Te?wt!==null?Ut?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,C,0,0,it.width,it.height,wt,it.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,C,ht,it.width,it.height,0,it.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,C,0,0,it.width,it.height,wt,vt,it.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,C,ht,it.width,it.height,0,wt,vt,it.data)}}}else{zt=S.mipmaps,Ut&&Vt&&(zt.length>0&&Qt++,e.texStorage2D(s.TEXTURE_CUBE_MAP,Qt,ht,K[0].width,K[0].height));for(let et=0;et<6;et++)if(Ft){Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,K[et].width,K[et].height,wt,vt,K[et].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,ht,K[et].width,K[et].height,0,wt,vt,K[et].data);for(let C=0;C<zt.length;C++){const st=zt[C].image[et].image;Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,C+1,0,0,st.width,st.height,wt,vt,st.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,C+1,ht,st.width,st.height,0,wt,vt,st.data)}}else{Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,wt,vt,K[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,ht,wt,vt,K[et]);for(let C=0;C<zt.length;C++){const it=zt[C];Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,C+1,0,0,wt,vt,it.image[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,C+1,ht,wt,vt,it.image[et])}}}y(S,Ht)&&x(s.TEXTURE_CUBE_MAP),tt.__version=Z.version,S.onUpdate&&S.onUpdate(S)}w.__version=S.version}function mt(w,S,B,Q,Z,tt){const dt=r.convert(B.format,B.colorSpace),at=r.convert(B.type),ct=E(B.internalFormat,dt,at,B.colorSpace);if(!n.get(S).__hasExternalTextures){const Ft=Math.max(1,S.width>>tt),K=Math.max(1,S.height>>tt);Z===s.TEXTURE_3D||Z===s.TEXTURE_2D_ARRAY?e.texImage3D(Z,tt,ct,Ft,K,S.depth,0,dt,at,null):e.texImage2D(Z,tt,ct,Ft,K,0,dt,at,null)}e.bindFramebuffer(s.FRAMEBUFFER,w),ut(S)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Q,Z,n.get(B).__webglTexture,0,Tt(S)):(Z===s.TEXTURE_2D||Z>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Q,Z,n.get(B).__webglTexture,tt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Lt(w,S,B){if(s.bindRenderbuffer(s.RENDERBUFFER,w),S.depthBuffer&&!S.stencilBuffer){let Q=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(B||ut(S)){const Z=S.depthTexture;Z&&Z.isDepthTexture&&(Z.type===ln?Q=s.DEPTH_COMPONENT32F:Z.type===on&&(Q=s.DEPTH_COMPONENT24));const tt=Tt(S);ut(S)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,tt,Q,S.width,S.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,tt,Q,S.width,S.height)}else s.renderbufferStorage(s.RENDERBUFFER,Q,S.width,S.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,w)}else if(S.depthBuffer&&S.stencilBuffer){const Q=Tt(S);B&&ut(S)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Q,s.DEPTH24_STENCIL8,S.width,S.height):ut(S)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Q,s.DEPTH24_STENCIL8,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,w)}else{const Q=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let Z=0;Z<Q.length;Z++){const tt=Q[Z],dt=r.convert(tt.format,tt.colorSpace),at=r.convert(tt.type),ct=E(tt.internalFormat,dt,at,tt.colorSpace),yt=Tt(S);B&&ut(S)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,yt,ct,S.width,S.height):ut(S)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,yt,ct,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,ct,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Dt(w,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,w),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),G(S.depthTexture,0);const Q=n.get(S.depthTexture).__webglTexture,Z=Tt(S);if(S.depthTexture.format===Nn)ut(S)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0);else if(S.depthTexture.format===ui)ut(S)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function St(w){const S=n.get(w),B=w.isWebGLCubeRenderTarget===!0;if(w.depthTexture&&!S.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Dt(S.__webglFramebuffer,w)}else if(B){S.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)e.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[Q]),S.__webglDepthbuffer[Q]=s.createRenderbuffer(),Lt(S.__webglDepthbuffer[Q],w,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=s.createRenderbuffer(),Lt(S.__webglDepthbuffer,w,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Gt(w,S,B){const Q=n.get(w);S!==void 0&&mt(Q.__webglFramebuffer,w,w.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),B!==void 0&&St(w)}function O(w){const S=w.texture,B=n.get(w),Q=n.get(S);w.addEventListener("dispose",N),w.isWebGLMultipleRenderTargets!==!0&&(Q.__webglTexture===void 0&&(Q.__webglTexture=s.createTexture()),Q.__version=S.version,o.memory.textures++);const Z=w.isWebGLCubeRenderTarget===!0,tt=w.isWebGLMultipleRenderTargets===!0,dt=p(w)||a;if(Z){B.__webglFramebuffer=[];for(let at=0;at<6;at++)if(a&&S.mipmaps&&S.mipmaps.length>0){B.__webglFramebuffer[at]=[];for(let ct=0;ct<S.mipmaps.length;ct++)B.__webglFramebuffer[at][ct]=s.createFramebuffer()}else B.__webglFramebuffer[at]=s.createFramebuffer()}else{if(a&&S.mipmaps&&S.mipmaps.length>0){B.__webglFramebuffer=[];for(let at=0;at<S.mipmaps.length;at++)B.__webglFramebuffer[at]=s.createFramebuffer()}else B.__webglFramebuffer=s.createFramebuffer();if(tt)if(i.drawBuffers){const at=w.texture;for(let ct=0,yt=at.length;ct<yt;ct++){const Ft=n.get(at[ct]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&w.samples>0&&ut(w)===!1){const at=tt?S:[S];B.__webglMultisampledFramebuffer=s.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ct=0;ct<at.length;ct++){const yt=at[ct];B.__webglColorRenderbuffer[ct]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,B.__webglColorRenderbuffer[ct]);const Ft=r.convert(yt.format,yt.colorSpace),K=r.convert(yt.type),Wt=E(yt.internalFormat,Ft,K,yt.colorSpace,w.isXRRenderTarget===!0),Ht=Tt(w);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ht,Wt,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.RENDERBUFFER,B.__webglColorRenderbuffer[ct])}s.bindRenderbuffer(s.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=s.createRenderbuffer(),Lt(B.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Z){e.bindTexture(s.TEXTURE_CUBE_MAP,Q.__webglTexture),X(s.TEXTURE_CUBE_MAP,S,dt);for(let at=0;at<6;at++)if(a&&S.mipmaps&&S.mipmaps.length>0)for(let ct=0;ct<S.mipmaps.length;ct++)mt(B.__webglFramebuffer[at][ct],w,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+at,ct);else mt(B.__webglFramebuffer[at],w,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);y(S,dt)&&x(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(tt){const at=w.texture;for(let ct=0,yt=at.length;ct<yt;ct++){const Ft=at[ct],K=n.get(Ft);e.bindTexture(s.TEXTURE_2D,K.__webglTexture),X(s.TEXTURE_2D,Ft,dt),mt(B.__webglFramebuffer,w,Ft,s.COLOR_ATTACHMENT0+ct,s.TEXTURE_2D,0),y(Ft,dt)&&x(s.TEXTURE_2D)}e.unbindTexture()}else{let at=s.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(a?at=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(at,Q.__webglTexture),X(at,S,dt),a&&S.mipmaps&&S.mipmaps.length>0)for(let ct=0;ct<S.mipmaps.length;ct++)mt(B.__webglFramebuffer[ct],w,S,s.COLOR_ATTACHMENT0,at,ct);else mt(B.__webglFramebuffer,w,S,s.COLOR_ATTACHMENT0,at,0);y(S,dt)&&x(at),e.unbindTexture()}w.depthBuffer&&St(w)}function _e(w){const S=p(w)||a,B=w.isWebGLMultipleRenderTargets===!0?w.texture:[w.texture];for(let Q=0,Z=B.length;Q<Z;Q++){const tt=B[Q];if(y(tt,S)){const dt=w.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,at=n.get(tt).__webglTexture;e.bindTexture(dt,at),x(dt),e.unbindTexture()}}}function _t(w){if(a&&w.samples>0&&ut(w)===!1){const S=w.isWebGLMultipleRenderTargets?w.texture:[w.texture],B=w.width,Q=w.height;let Z=s.COLOR_BUFFER_BIT;const tt=[],dt=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,at=n.get(w),ct=w.isWebGLMultipleRenderTargets===!0;if(ct)for(let yt=0;yt<S.length;yt++)e.bindFramebuffer(s.FRAMEBUFFER,at.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+yt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,at.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+yt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,at.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,at.__webglFramebuffer);for(let yt=0;yt<S.length;yt++){tt.push(s.COLOR_ATTACHMENT0+yt),w.depthBuffer&&tt.push(dt);const Ft=at.__ignoreDepthValues!==void 0?at.__ignoreDepthValues:!1;if(Ft===!1&&(w.depthBuffer&&(Z|=s.DEPTH_BUFFER_BIT),w.stencilBuffer&&(Z|=s.STENCIL_BUFFER_BIT)),ct&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,at.__webglColorRenderbuffer[yt]),Ft===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[dt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[dt])),ct){const K=n.get(S[yt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,K,0)}s.blitFramebuffer(0,0,B,Q,0,0,B,Q,Z,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,tt)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ct)for(let yt=0;yt<S.length;yt++){e.bindFramebuffer(s.FRAMEBUFFER,at.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+yt,s.RENDERBUFFER,at.__webglColorRenderbuffer[yt]);const Ft=n.get(S[yt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,at.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+yt,s.TEXTURE_2D,Ft,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,at.__webglMultisampledFramebuffer)}}function Tt(w){return Math.min(i.maxSamples,w.samples)}function ut(w){const S=n.get(w);return a&&w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Kt(w){const S=o.render.frame;h.get(w)!==S&&(h.set(w,S),w.update())}function Nt(w,S){const B=w.colorSpace,Q=w.format,Z=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||w.format===Pr||B!==hn&&B!==ke&&(Xt.getTransfer(B)===jt?a===!1?t.has("EXT_sRGB")===!0&&Q===Te?(w.format=Pr,w.minFilter=me,w.generateMipmaps=!1):S=Ml.sRGBToLinear(S):(Q!==Te||Z!==Re)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),S}this.allocateTextureUnit=L,this.resetTextureUnits=V,this.setTexture2D=G,this.setTexture2DArray=q,this.setTexture3D=W,this.setTextureCube=$,this.rebindTextures=Gt,this.setupRenderTarget=O,this.updateRenderTargetMipmap=_e,this.updateMultisampleRenderTarget=_t,this.setupDepthRenderbuffer=St,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=ut}function Im(s,t,e){const n=e.isWebGL2;function i(r,o=ke){let a;const l=Xt.getTransfer(o);if(r===Re)return s.UNSIGNED_BYTE;if(r===ul)return s.UNSIGNED_SHORT_4_4_4_4;if(r===dl)return s.UNSIGNED_SHORT_5_5_5_1;if(r===eh)return s.BYTE;if(r===nh)return s.SHORT;if(r===Hr)return s.UNSIGNED_SHORT;if(r===hl)return s.INT;if(r===on)return s.UNSIGNED_INT;if(r===ln)return s.FLOAT;if(r===zn)return n?s.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===ih)return s.ALPHA;if(r===Te)return s.RGBA;if(r===sh)return s.LUMINANCE;if(r===rh)return s.LUMINANCE_ALPHA;if(r===Nn)return s.DEPTH_COMPONENT;if(r===ui)return s.DEPTH_STENCIL;if(r===Pr)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Ps)return s.RED;if(r===fl)return s.RED_INTEGER;if(r===ah)return s.RG;if(r===pl)return s.RG_INTEGER;if(r===ml)return s.RGBA_INTEGER;if(r===Vs||r===Ws||r===Xs||r===$s)if(l===jt)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Vs)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Ws)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Xs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===$s)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Vs)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Ws)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Xs)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===$s)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===va||r===_a||r===xa||r===Ma)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===va)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===_a)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===xa)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ma)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===gl)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===ya||r===Sa)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===ya)return l===jt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Sa)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ea||r===ba||r===wa||r===Ta||r===Aa||r===Ra||r===Ca||r===La||r===Pa||r===Da||r===Ua||r===Ia||r===Na||r===Fa)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Ea)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===ba)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===wa)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ta)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Aa)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Ra)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ca)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===La)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Pa)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Da)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ua)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ia)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Na)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Fa)return l===jt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===qs||r===Oa||r===za)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===qs)return l===jt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Oa)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===za)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===oh||r===Ba||r===ka||r===Ha)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===qs)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Ba)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ka)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Ha)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===In?n?s.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class Nm extends Fe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class je extends Pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Fm={type:"move"};class gr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,n),u=this._getHandJoint(c,g);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),m=.02,v=.005;c.inputState.pinching&&f>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Fm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new je;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Om extends pi{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,f=null,m=null,v=null;const g=e.getContextAttributes();let p=null,u=null;const y=[],x=[],E=new Ct;let R=null;const T=new Fe;T.layers.enable(1),T.viewport=new ee;const A=new Fe;A.layers.enable(2),A.viewport=new ee;const N=[T,A],_=new Nm;_.layers.enable(1),_.layers.enable(2);let M=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let j=y[X];return j===void 0&&(j=new gr,y[X]=j),j.getTargetRaySpace()},this.getControllerGrip=function(X){let j=y[X];return j===void 0&&(j=new gr,y[X]=j),j.getGripSpace()},this.getHand=function(X){let j=y[X];return j===void 0&&(j=new gr,y[X]=j),j.getHandSpace()};function U(X){const j=x.indexOf(X.inputSource);if(j===-1)return;const ot=y[j];ot!==void 0&&(ot.update(X.inputSource,X.frame,c||o),ot.dispatchEvent({type:X.type,data:X.inputSource}))}function V(){i.removeEventListener("select",U),i.removeEventListener("selectstart",U),i.removeEventListener("selectend",U),i.removeEventListener("squeeze",U),i.removeEventListener("squeezestart",U),i.removeEventListener("squeezeend",U),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",L);for(let X=0;X<y.length;X++){const j=x[X];j!==null&&(x[X]=null,y[X].disconnect(j))}M=null,P=null,t.setRenderTarget(p),m=null,f=null,d=null,i=null,u=null,rt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d},this.getFrame=function(){return v},this.getSession=function(){return i},this.setSession=async function(X){if(i=X,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",U),i.addEventListener("selectstart",U),i.addEventListener("selectend",U),i.addEventListener("squeeze",U),i.addEventListener("squeezestart",U),i.addEventListener("squeezeend",U),i.addEventListener("end",V),i.addEventListener("inputsourceschange",L),g.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(E),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const j={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(i,e,j),i.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),u=new Ke(m.framebufferWidth,m.framebufferHeight,{format:Te,type:Re,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let j=null,ot=null,gt=null;g.depth&&(gt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=g.stencil?ui:Nn,ot=g.stencil?In:on);const mt={colorFormat:e.RGBA8,depthFormat:gt,scaleFactor:r};d=new XRWebGLBinding(i,e),f=d.createProjectionLayer(mt),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),u=new Ke(f.textureWidth,f.textureHeight,{format:Te,type:Re,depthTexture:new Yr(f.textureWidth,f.textureHeight,ot,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const Lt=t.properties.get(u);Lt.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),rt.setContext(i),rt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function L(X){for(let j=0;j<X.removed.length;j++){const ot=X.removed[j],gt=x.indexOf(ot);gt>=0&&(x[gt]=null,y[gt].disconnect(ot))}for(let j=0;j<X.added.length;j++){const ot=X.added[j];let gt=x.indexOf(ot);if(gt===-1){for(let Lt=0;Lt<y.length;Lt++)if(Lt>=x.length){x.push(ot),gt=Lt;break}else if(x[Lt]===null){x[Lt]=ot,gt=Lt;break}if(gt===-1)break}const mt=y[gt];mt&&mt.connect(ot)}}const F=new D,G=new D;function q(X,j,ot){F.setFromMatrixPosition(j.matrixWorld),G.setFromMatrixPosition(ot.matrixWorld);const gt=F.distanceTo(G),mt=j.projectionMatrix.elements,Lt=ot.projectionMatrix.elements,Dt=mt[14]/(mt[10]-1),St=mt[14]/(mt[10]+1),Gt=(mt[9]+1)/mt[5],O=(mt[9]-1)/mt[5],_e=(mt[8]-1)/mt[0],_t=(Lt[8]+1)/Lt[0],Tt=Dt*_e,ut=Dt*_t,Kt=gt/(-_e+_t),Nt=Kt*-_e;j.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Nt),X.translateZ(Kt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const w=Dt+Kt,S=St+Kt,B=Tt-Nt,Q=ut+(gt-Nt),Z=Gt*St/S*w,tt=O*St/S*w;X.projectionMatrix.makePerspective(B,Q,Z,tt,w,S),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function W(X,j){j===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(j.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(i===null)return;_.near=A.near=T.near=X.near,_.far=A.far=T.far=X.far,(M!==_.near||P!==_.far)&&(i.updateRenderState({depthNear:_.near,depthFar:_.far}),M=_.near,P=_.far);const j=X.parent,ot=_.cameras;W(_,j);for(let gt=0;gt<ot.length;gt++)W(ot[gt],j);ot.length===2?q(_,T,A):_.projectionMatrix.copy(T.projectionMatrix),$(X,_,j)};function $(X,j,ot){ot===null?X.matrix.copy(j.matrixWorld):(X.matrix.copy(ot.matrixWorld),X.matrix.invert(),X.matrix.multiply(j.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(j.projectionMatrix),X.projectionMatrixInverse.copy(j.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Pi*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(X){l=X,f!==null&&(f.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)};let Y=null;function J(X,j){if(h=j.getViewerPose(c||o),v=j,h!==null){const ot=h.views;m!==null&&(t.setRenderTargetFramebuffer(u,m.framebuffer),t.setRenderTarget(u));let gt=!1;ot.length!==_.cameras.length&&(_.cameras.length=0,gt=!0);for(let mt=0;mt<ot.length;mt++){const Lt=ot[mt];let Dt=null;if(m!==null)Dt=m.getViewport(Lt);else{const Gt=d.getViewSubImage(f,Lt);Dt=Gt.viewport,mt===0&&(t.setRenderTargetTextures(u,Gt.colorTexture,f.ignoreDepthValues?void 0:Gt.depthStencilTexture),t.setRenderTarget(u))}let St=N[mt];St===void 0&&(St=new Fe,St.layers.enable(mt),St.viewport=new ee,N[mt]=St),St.matrix.fromArray(Lt.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(Lt.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(Dt.x,Dt.y,Dt.width,Dt.height),mt===0&&(_.matrix.copy(St.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),gt===!0&&_.cameras.push(St)}}for(let ot=0;ot<y.length;ot++){const gt=x[ot],mt=y[ot];gt!==null&&mt!==void 0&&mt.update(gt,j,c||o)}Y&&Y(X,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),v=null}const rt=new Ll;rt.setAnimationLoop(J),this.setAnimationLoop=function(X){Y=X},this.dispose=function(){}}}function zm(s,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Al(s)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function i(p,u,y,x,E){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&m(p,u,E)):u.isMeshMatcapMaterial?(r(p,u),v(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),g(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?l(p,u,y,x):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===Ae&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===Ae&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);const y=t.get(u).envMap;if(y&&(p.envMap.value=y,p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;const x=s._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*x,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,y,x){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*y,p.scale.value=x*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,y){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Ae&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,u){u.matcap&&(p.matcap.value=u.matcap)}function g(p,u){const y=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Bm(s,t,e,n){let i={},r={},o=[];const a=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,x){const E=x.program;n.uniformBlockBinding(y,E)}function c(y,x){let E=i[y.id];E===void 0&&(v(y),E=h(y),i[y.id]=E,y.addEventListener("dispose",p));const R=x.program;n.updateUBOMapping(y,R);const T=t.render.frame;r[y.id]!==T&&(f(y),r[y.id]=T)}function h(y){const x=d();y.__bindingPointIndex=x;const E=s.createBuffer(),R=y.__size,T=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,R,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,x,E),E}function d(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const x=i[y.id],E=y.uniforms,R=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,x);for(let T=0,A=E.length;T<A;T++){const N=Array.isArray(E[T])?E[T]:[E[T]];for(let _=0,M=N.length;_<M;_++){const P=N[_];if(m(P,T,_,R)===!0){const U=P.__offset,V=Array.isArray(P.value)?P.value:[P.value];let L=0;for(let F=0;F<V.length;F++){const G=V[F],q=g(G);typeof G=="number"||typeof G=="boolean"?(P.__data[0]=G,s.bufferSubData(s.UNIFORM_BUFFER,U+L,P.__data)):G.isMatrix3?(P.__data[0]=G.elements[0],P.__data[1]=G.elements[1],P.__data[2]=G.elements[2],P.__data[3]=0,P.__data[4]=G.elements[3],P.__data[5]=G.elements[4],P.__data[6]=G.elements[5],P.__data[7]=0,P.__data[8]=G.elements[6],P.__data[9]=G.elements[7],P.__data[10]=G.elements[8],P.__data[11]=0):(G.toArray(P.__data,L),L+=q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,U,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(y,x,E,R){const T=y.value,A=x+"_"+E;if(R[A]===void 0)return typeof T=="number"||typeof T=="boolean"?R[A]=T:R[A]=T.clone(),!0;{const N=R[A];if(typeof T=="number"||typeof T=="boolean"){if(N!==T)return R[A]=T,!0}else if(N.equals(T)===!1)return N.copy(T),!0}return!1}function v(y){const x=y.uniforms;let E=0;const R=16;for(let A=0,N=x.length;A<N;A++){const _=Array.isArray(x[A])?x[A]:[x[A]];for(let M=0,P=_.length;M<P;M++){const U=_[M],V=Array.isArray(U.value)?U.value:[U.value];for(let L=0,F=V.length;L<F;L++){const G=V[L],q=g(G),W=E%R;W!==0&&R-W<q.boundary&&(E+=R-W),U.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=E,E+=q.storage}}}const T=E%R;return T>0&&(E+=R-T),y.__size=E,y.__cache={},this}function g(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function p(y){const x=y.target;x.removeEventListener("dispose",p);const E=o.indexOf(x.__bindingPointIndex);o.splice(E,1),s.deleteBuffer(i[x.id]),delete i[x.id],delete r[x.id]}function u(){for(const y in i)s.deleteBuffer(i[y]);o=[],i={},r={}}return{bind:l,update:c,dispose:u}}class Fl{constructor(t={}){const{canvas:e=Ih(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const u=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=he,this._useLegacyLights=!1,this.toneMapping=xn,this.toneMappingExposure=1;const x=this;let E=!1,R=0,T=0,A=null,N=-1,_=null;const M=new ee,P=new ee;let U=null;const V=new Rt(0);let L=0,F=e.width,G=e.height,q=1,W=null,$=null;const Y=new ee(0,0,F,G),J=new ee(0,0,F,G);let rt=!1;const X=new Is;let j=!1,ot=!1,gt=null;const mt=new ne,Lt=new Ct,Dt=new D,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Gt(){return A===null?q:1}let O=n;function _e(b,I){for(let k=0;k<b.length;k++){const H=b[k],z=e.getContext(H,I);if(z!==null)return z}return null}try{const b={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${kr}`),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",C,!1),e.addEventListener("webglcontextcreationerror",it,!1),O===null){const I=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&I.shift(),O=_e(I,b),O===null)throw _e(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let _t,Tt,ut,Kt,Nt,w,S,B,Q,Z,tt,dt,at,ct,yt,Ft,K,Wt,Ht,wt,vt,ht,Ut,Vt;function Qt(){_t=new jf(O),Tt=new Vf(O,_t,t),_t.init(Tt),ht=new Im(O,_t,Tt),ut=new Dm(O,_t,Tt),Kt=new Jf(O),Nt=new _m,w=new Um(O,_t,ut,Nt,Tt,ht,Kt),S=new Xf(x),B=new Yf(x),Q=new ru(O,Tt),Ut=new Hf(O,_t,Q,Tt),Z=new Kf(O,Q,Kt,Ut),tt=new np(O,Z,Q,Kt),Ht=new ep(O,Tt,w),Ft=new Wf(Nt),dt=new vm(x,S,B,_t,Tt,Ut,Ft),at=new zm(x,Nt),ct=new Mm,yt=new Tm(_t,Tt),Wt=new kf(x,S,B,ut,tt,f,l),K=new Pm(x,tt,Tt),Vt=new Bm(O,Kt,Tt,ut),wt=new Gf(O,_t,Kt,Tt),vt=new Zf(O,_t,Kt,Tt),Kt.programs=dt.programs,x.capabilities=Tt,x.extensions=_t,x.properties=Nt,x.renderLists=ct,x.shadowMap=K,x.state=ut,x.info=Kt}Qt();const zt=new Om(x,O);this.xr=zt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const b=_t.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=_t.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(b){b!==void 0&&(q=b,this.setSize(F,G,!1))},this.getSize=function(b){return b.set(F,G)},this.setSize=function(b,I,k=!0){if(zt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=b,G=I,e.width=Math.floor(b*q),e.height=Math.floor(I*q),k===!0&&(e.style.width=b+"px",e.style.height=I+"px"),this.setViewport(0,0,b,I)},this.getDrawingBufferSize=function(b){return b.set(F*q,G*q).floor()},this.setDrawingBufferSize=function(b,I,k){F=b,G=I,q=k,e.width=Math.floor(b*k),e.height=Math.floor(I*k),this.setViewport(0,0,b,I)},this.getCurrentViewport=function(b){return b.copy(M)},this.getViewport=function(b){return b.copy(Y)},this.setViewport=function(b,I,k,H){b.isVector4?Y.set(b.x,b.y,b.z,b.w):Y.set(b,I,k,H),ut.viewport(M.copy(Y).multiplyScalar(q).floor())},this.getScissor=function(b){return b.copy(J)},this.setScissor=function(b,I,k,H){b.isVector4?J.set(b.x,b.y,b.z,b.w):J.set(b,I,k,H),ut.scissor(P.copy(J).multiplyScalar(q).floor())},this.getScissorTest=function(){return rt},this.setScissorTest=function(b){ut.setScissorTest(rt=b)},this.setOpaqueSort=function(b){W=b},this.setTransparentSort=function(b){$=b},this.getClearColor=function(b){return b.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor.apply(Wt,arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha.apply(Wt,arguments)},this.clear=function(b=!0,I=!0,k=!0){let H=0;if(b){let z=!1;if(A!==null){const lt=A.texture.format;z=lt===ml||lt===pl||lt===fl}if(z){const lt=A.texture.type,ft=lt===Re||lt===on||lt===Hr||lt===In||lt===ul||lt===dl,Mt=Wt.getClearColor(),bt=Wt.getClearAlpha(),Ot=Mt.r,At=Mt.g,Pt=Mt.b;ft?(m[0]=Ot,m[1]=At,m[2]=Pt,m[3]=bt,O.clearBufferuiv(O.COLOR,0,m)):(v[0]=Ot,v[1]=At,v[2]=Pt,v[3]=bt,O.clearBufferiv(O.COLOR,0,v))}else H|=O.COLOR_BUFFER_BIT}I&&(H|=O.DEPTH_BUFFER_BIT),k&&(H|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",C,!1),e.removeEventListener("webglcontextcreationerror",it,!1),ct.dispose(),yt.dispose(),Nt.dispose(),S.dispose(),B.dispose(),tt.dispose(),Ut.dispose(),Vt.dispose(),dt.dispose(),zt.dispose(),zt.removeEventListener("sessionstart",xe),zt.removeEventListener("sessionend",Yt),gt&&(gt.dispose(),gt=null),Me.stop()};function et(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function C(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const b=Kt.autoReset,I=K.enabled,k=K.autoUpdate,H=K.needsUpdate,z=K.type;Qt(),Kt.autoReset=b,K.enabled=I,K.autoUpdate=k,K.needsUpdate=H,K.type=z}function it(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function st(b){const I=b.target;I.removeEventListener("dispose",st),Et(I)}function Et(b){xt(b),Nt.remove(b)}function xt(b){const I=Nt.get(b).programs;I!==void 0&&(I.forEach(function(k){dt.releaseProgram(k)}),b.isShaderMaterial&&dt.releaseShaderCache(b))}this.renderBufferDirect=function(b,I,k,H,z,lt){I===null&&(I=St);const ft=z.isMesh&&z.matrixWorld.determinant()<0,Mt=Jl(b,I,k,H,z);ut.setMaterial(H,ft);let bt=k.index,Ot=1;if(H.wireframe===!0){if(bt=Z.getWireframeAttribute(k),bt===void 0)return;Ot=2}const At=k.drawRange,Pt=k.attributes.position;let ie=At.start*Ot,De=(At.start+At.count)*Ot;lt!==null&&(ie=Math.max(ie,lt.start*Ot),De=Math.min(De,(lt.start+lt.count)*Ot)),bt!==null?(ie=Math.max(ie,0),De=Math.min(De,bt.count)):Pt!=null&&(ie=Math.max(ie,0),De=Math.min(De,Pt.count));const le=De-ie;if(le<0||le===1/0)return;Ut.setup(z,H,Mt,k,bt);let Ze,Zt=wt;if(bt!==null&&(Ze=Q.get(bt),Zt=vt,Zt.setIndex(Ze)),z.isMesh)H.wireframe===!0?(ut.setLineWidth(H.wireframeLinewidth*Gt()),Zt.setMode(O.LINES)):Zt.setMode(O.TRIANGLES);else if(z.isLine){let Bt=H.linewidth;Bt===void 0&&(Bt=1),ut.setLineWidth(Bt*Gt()),z.isLineSegments?Zt.setMode(O.LINES):z.isLineLoop?Zt.setMode(O.LINE_LOOP):Zt.setMode(O.LINE_STRIP)}else z.isPoints?Zt.setMode(O.POINTS):z.isSprite&&Zt.setMode(O.TRIANGLES);if(z.isBatchedMesh)Zt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else if(z.isInstancedMesh)Zt.renderInstances(ie,le,z.count);else if(k.isInstancedBufferGeometry){const Bt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,zs=Math.min(k.instanceCount,Bt);Zt.renderInstances(ie,le,zs)}else Zt.render(ie,le)};function $t(b,I,k){b.transparent===!0&&b.side===an&&b.forceSinglePass===!1?(b.side=Ae,b.needsUpdate=!0,Fi(b,I,k),b.side=Mn,b.needsUpdate=!0,Fi(b,I,k),b.side=an):Fi(b,I,k)}this.compile=function(b,I,k=null){k===null&&(k=b),p=yt.get(k),p.init(),y.push(p),k.traverseVisible(function(z){z.isLight&&z.layers.test(I.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),b!==k&&b.traverseVisible(function(z){z.isLight&&z.layers.test(I.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights(x._useLegacyLights);const H=new Set;return b.traverse(function(z){const lt=z.material;if(lt)if(Array.isArray(lt))for(let ft=0;ft<lt.length;ft++){const Mt=lt[ft];$t(Mt,k,z),H.add(Mt)}else $t(lt,k,z),H.add(lt)}),y.pop(),p=null,H},this.compileAsync=function(b,I,k=null){const H=this.compile(b,I,k);return new Promise(z=>{function lt(){if(H.forEach(function(ft){Nt.get(ft).currentProgram.isReady()&&H.delete(ft)}),H.size===0){z(b);return}setTimeout(lt,10)}_t.get("KHR_parallel_shader_compile")!==null?lt():setTimeout(lt,10)})};let qt=null;function oe(b){qt&&qt(b)}function xe(){Me.stop()}function Yt(){Me.start()}const Me=new Ll;Me.setAnimationLoop(oe),typeof self<"u"&&Me.setContext(self),this.setAnimationLoop=function(b){qt=b,zt.setAnimationLoop(b),b===null?Me.stop():Me.start()},zt.addEventListener("sessionstart",xe),zt.addEventListener("sessionend",Yt),this.render=function(b,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),zt.enabled===!0&&zt.isPresenting===!0&&(zt.cameraAutoUpdate===!0&&zt.updateCamera(I),I=zt.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,I,A),p=yt.get(b,y.length),p.init(),y.push(p),mt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),X.setFromProjectionMatrix(mt),ot=this.localClippingEnabled,j=Ft.init(this.clippingPlanes,ot),g=ct.get(b,u.length),g.init(),u.push(g),$e(b,I,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(W,$),this.info.render.frame++,j===!0&&Ft.beginShadows();const k=p.state.shadowsArray;if(K.render(k,b,I),j===!0&&Ft.endShadows(),this.info.autoReset===!0&&this.info.reset(),Wt.render(g,b),p.setupLights(x._useLegacyLights),I.isArrayCamera){const H=I.cameras;for(let z=0,lt=H.length;z<lt;z++){const ft=H[z];ta(g,b,ft,ft.viewport)}}else ta(g,b,I);A!==null&&(w.updateMultisampleRenderTarget(A),w.updateRenderTargetMipmap(A)),b.isScene===!0&&b.onAfterRender(x,b,I),Ut.resetDefaultState(),N=-1,_=null,y.pop(),y.length>0?p=y[y.length-1]:p=null,u.pop(),u.length>0?g=u[u.length-1]:g=null};function $e(b,I,k,H){if(b.visible===!1)return;if(b.layers.test(I.layers)){if(b.isGroup)k=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(I);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||X.intersectsSprite(b)){H&&Dt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(mt);const ft=tt.update(b),Mt=b.material;Mt.visible&&g.push(b,ft,Mt,k,Dt.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||X.intersectsObject(b))){const ft=tt.update(b),Mt=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Dt.copy(b.boundingSphere.center)):(ft.boundingSphere===null&&ft.computeBoundingSphere(),Dt.copy(ft.boundingSphere.center)),Dt.applyMatrix4(b.matrixWorld).applyMatrix4(mt)),Array.isArray(Mt)){const bt=ft.groups;for(let Ot=0,At=bt.length;Ot<At;Ot++){const Pt=bt[Ot],ie=Mt[Pt.materialIndex];ie&&ie.visible&&g.push(b,ft,ie,k,Dt.z,Pt)}}else Mt.visible&&g.push(b,ft,Mt,k,Dt.z,null)}}const lt=b.children;for(let ft=0,Mt=lt.length;ft<Mt;ft++)$e(lt[ft],I,k,H)}function ta(b,I,k,H){const z=b.opaque,lt=b.transmissive,ft=b.transparent;p.setupLightsView(k),j===!0&&Ft.setGlobalState(x.clippingPlanes,k),lt.length>0&&Zl(z,lt,I,k),H&&ut.viewport(M.copy(H)),z.length>0&&Ni(z,I,k),lt.length>0&&Ni(lt,I,k),ft.length>0&&Ni(ft,I,k),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function Zl(b,I,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;const lt=Tt.isWebGL2;gt===null&&(gt=new Ke(1,1,{generateMipmaps:!0,type:_t.has("EXT_color_buffer_half_float")?zn:Re,minFilter:On,samples:lt?4:0})),x.getDrawingBufferSize(Lt),lt?gt.setSize(Lt.x,Lt.y):gt.setSize(bs(Lt.x),bs(Lt.y));const ft=x.getRenderTarget();x.setRenderTarget(gt),x.getClearColor(V),L=x.getClearAlpha(),L<1&&x.setClearColor(16777215,.5),x.clear();const Mt=x.toneMapping;x.toneMapping=xn,Ni(b,k,H),w.updateMultisampleRenderTarget(gt),w.updateRenderTargetMipmap(gt);let bt=!1;for(let Ot=0,At=I.length;Ot<At;Ot++){const Pt=I[Ot],ie=Pt.object,De=Pt.geometry,le=Pt.material,Ze=Pt.group;if(le.side===an&&ie.layers.test(H.layers)){const Zt=le.side;le.side=Ae,le.needsUpdate=!0,ea(ie,k,H,De,le,Ze),le.side=Zt,le.needsUpdate=!0,bt=!0}}bt===!0&&(w.updateMultisampleRenderTarget(gt),w.updateRenderTargetMipmap(gt)),x.setRenderTarget(ft),x.setClearColor(V,L),x.toneMapping=Mt}function Ni(b,I,k){const H=I.isScene===!0?I.overrideMaterial:null;for(let z=0,lt=b.length;z<lt;z++){const ft=b[z],Mt=ft.object,bt=ft.geometry,Ot=H===null?ft.material:H,At=ft.group;Mt.layers.test(k.layers)&&ea(Mt,I,k,bt,Ot,At)}}function ea(b,I,k,H,z,lt){b.onBeforeRender(x,I,k,H,z,lt),b.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),z.onBeforeRender(x,I,k,H,b,lt),z.transparent===!0&&z.side===an&&z.forceSinglePass===!1?(z.side=Ae,z.needsUpdate=!0,x.renderBufferDirect(k,I,H,z,b,lt),z.side=Mn,z.needsUpdate=!0,x.renderBufferDirect(k,I,H,z,b,lt),z.side=an):x.renderBufferDirect(k,I,H,z,b,lt),b.onAfterRender(x,I,k,H,z,lt)}function Fi(b,I,k){I.isScene!==!0&&(I=St);const H=Nt.get(b),z=p.state.lights,lt=p.state.shadowsArray,ft=z.state.version,Mt=dt.getParameters(b,z.state,lt,I,k),bt=dt.getProgramCacheKey(Mt);let Ot=H.programs;H.environment=b.isMeshStandardMaterial?I.environment:null,H.fog=I.fog,H.envMap=(b.isMeshStandardMaterial?B:S).get(b.envMap||H.environment),Ot===void 0&&(b.addEventListener("dispose",st),Ot=new Map,H.programs=Ot);let At=Ot.get(bt);if(At!==void 0){if(H.currentProgram===At&&H.lightsStateVersion===ft)return ia(b,Mt),At}else Mt.uniforms=dt.getUniforms(b),b.onBuild(k,Mt,x),b.onBeforeCompile(Mt,x),At=dt.acquireProgram(Mt,bt),Ot.set(bt,At),H.uniforms=Mt.uniforms;const Pt=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Pt.clippingPlanes=Ft.uniform),ia(b,Mt),H.needsLights=tc(b),H.lightsStateVersion=ft,H.needsLights&&(Pt.ambientLightColor.value=z.state.ambient,Pt.lightProbe.value=z.state.probe,Pt.directionalLights.value=z.state.directional,Pt.directionalLightShadows.value=z.state.directionalShadow,Pt.spotLights.value=z.state.spot,Pt.spotLightShadows.value=z.state.spotShadow,Pt.rectAreaLights.value=z.state.rectArea,Pt.ltc_1.value=z.state.rectAreaLTC1,Pt.ltc_2.value=z.state.rectAreaLTC2,Pt.pointLights.value=z.state.point,Pt.pointLightShadows.value=z.state.pointShadow,Pt.hemisphereLights.value=z.state.hemi,Pt.directionalShadowMap.value=z.state.directionalShadowMap,Pt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Pt.spotShadowMap.value=z.state.spotShadowMap,Pt.spotLightMatrix.value=z.state.spotLightMatrix,Pt.spotLightMap.value=z.state.spotLightMap,Pt.pointShadowMap.value=z.state.pointShadowMap,Pt.pointShadowMatrix.value=z.state.pointShadowMatrix),H.currentProgram=At,H.uniformsList=null,At}function na(b){if(b.uniformsList===null){const I=b.currentProgram.getUniforms();b.uniformsList=fs.seqWithValue(I.seq,b.uniforms)}return b.uniformsList}function ia(b,I){const k=Nt.get(b);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function Jl(b,I,k,H,z){I.isScene!==!0&&(I=St),w.resetTextureUnits();const lt=I.fog,ft=H.isMeshStandardMaterial?I.environment:null,Mt=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:hn,bt=(H.isMeshStandardMaterial?B:S).get(H.envMap||ft),Ot=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,At=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Pt=!!k.morphAttributes.position,ie=!!k.morphAttributes.normal,De=!!k.morphAttributes.color;let le=xn;H.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(le=x.toneMapping);const Ze=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Zt=Ze!==void 0?Ze.length:0,Bt=Nt.get(H),zs=p.state.lights;if(j===!0&&(ot===!0||b!==_)){const ze=b===_&&H.id===N;Ft.setState(H,b,ze)}let te=!1;H.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==zs.state.version||Bt.outputColorSpace!==Mt||z.isBatchedMesh&&Bt.batching===!1||!z.isBatchedMesh&&Bt.batching===!0||z.isInstancedMesh&&Bt.instancing===!1||!z.isInstancedMesh&&Bt.instancing===!0||z.isSkinnedMesh&&Bt.skinning===!1||!z.isSkinnedMesh&&Bt.skinning===!0||z.isInstancedMesh&&Bt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Bt.instancingColor===!1&&z.instanceColor!==null||Bt.envMap!==bt||H.fog===!0&&Bt.fog!==lt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==Ft.numPlanes||Bt.numIntersection!==Ft.numIntersection)||Bt.vertexAlphas!==Ot||Bt.vertexTangents!==At||Bt.morphTargets!==Pt||Bt.morphNormals!==ie||Bt.morphColors!==De||Bt.toneMapping!==le||Tt.isWebGL2===!0&&Bt.morphTargetsCount!==Zt)&&(te=!0):(te=!0,Bt.__version=H.version);let yn=Bt.currentProgram;te===!0&&(yn=Fi(H,I,z));let sa=!1,Mi=!1,Bs=!1;const de=yn.getUniforms(),Sn=Bt.uniforms;if(ut.useProgram(yn.program)&&(sa=!0,Mi=!0,Bs=!0),H.id!==N&&(N=H.id,Mi=!0),sa||_!==b){de.setValue(O,"projectionMatrix",b.projectionMatrix),de.setValue(O,"viewMatrix",b.matrixWorldInverse);const ze=de.map.cameraPosition;ze!==void 0&&ze.setValue(O,Dt.setFromMatrixPosition(b.matrixWorld)),Tt.logarithmicDepthBuffer&&de.setValue(O,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&de.setValue(O,"isOrthographic",b.isOrthographicCamera===!0),_!==b&&(_=b,Mi=!0,Bs=!0)}if(z.isSkinnedMesh){de.setOptional(O,z,"bindMatrix"),de.setOptional(O,z,"bindMatrixInverse");const ze=z.skeleton;ze&&(Tt.floatVertexTextures?(ze.boneTexture===null&&ze.computeBoneTexture(),de.setValue(O,"boneTexture",ze.boneTexture,w)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}z.isBatchedMesh&&(de.setOptional(O,z,"batchingTexture"),de.setValue(O,"batchingTexture",z._matricesTexture,w));const ks=k.morphAttributes;if((ks.position!==void 0||ks.normal!==void 0||ks.color!==void 0&&Tt.isWebGL2===!0)&&Ht.update(z,k,yn),(Mi||Bt.receiveShadow!==z.receiveShadow)&&(Bt.receiveShadow=z.receiveShadow,de.setValue(O,"receiveShadow",z.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Sn.envMap.value=bt,Sn.flipEnvMap.value=bt.isCubeTexture&&bt.isRenderTargetTexture===!1?-1:1),Mi&&(de.setValue(O,"toneMappingExposure",x.toneMappingExposure),Bt.needsLights&&Ql(Sn,Bs),lt&&H.fog===!0&&at.refreshFogUniforms(Sn,lt),at.refreshMaterialUniforms(Sn,H,q,G,gt),fs.upload(O,na(Bt),Sn,w)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(fs.upload(O,na(Bt),Sn,w),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&de.setValue(O,"center",z.center),de.setValue(O,"modelViewMatrix",z.modelViewMatrix),de.setValue(O,"normalMatrix",z.normalMatrix),de.setValue(O,"modelMatrix",z.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const ze=H.uniformsGroups;for(let Hs=0,ec=ze.length;Hs<ec;Hs++)if(Tt.isWebGL2){const ra=ze[Hs];Vt.update(ra,yn),Vt.bind(ra,yn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return yn}function Ql(b,I){b.ambientLightColor.needsUpdate=I,b.lightProbe.needsUpdate=I,b.directionalLights.needsUpdate=I,b.directionalLightShadows.needsUpdate=I,b.pointLights.needsUpdate=I,b.pointLightShadows.needsUpdate=I,b.spotLights.needsUpdate=I,b.spotLightShadows.needsUpdate=I,b.rectAreaLights.needsUpdate=I,b.hemisphereLights.needsUpdate=I}function tc(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(b,I,k){Nt.get(b.texture).__webglTexture=I,Nt.get(b.depthTexture).__webglTexture=k;const H=Nt.get(b);H.__hasExternalTextures=!0,H.__hasExternalTextures&&(H.__autoAllocateDepthBuffer=k===void 0,H.__autoAllocateDepthBuffer||_t.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,I){const k=Nt.get(b);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(b,I=0,k=0){A=b,R=I,T=k;let H=!0,z=null,lt=!1,ft=!1;if(b){const bt=Nt.get(b);bt.__useDefaultFramebuffer!==void 0?(ut.bindFramebuffer(O.FRAMEBUFFER,null),H=!1):bt.__webglFramebuffer===void 0?w.setupRenderTarget(b):bt.__hasExternalTextures&&w.rebindTextures(b,Nt.get(b.texture).__webglTexture,Nt.get(b.depthTexture).__webglTexture);const Ot=b.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(ft=!0);const At=Nt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(At[I])?z=At[I][k]:z=At[I],lt=!0):Tt.isWebGL2&&b.samples>0&&w.useMultisampledRTT(b)===!1?z=Nt.get(b).__webglMultisampledFramebuffer:Array.isArray(At)?z=At[k]:z=At,M.copy(b.viewport),P.copy(b.scissor),U=b.scissorTest}else M.copy(Y).multiplyScalar(q).floor(),P.copy(J).multiplyScalar(q).floor(),U=rt;if(ut.bindFramebuffer(O.FRAMEBUFFER,z)&&Tt.drawBuffers&&H&&ut.drawBuffers(b,z),ut.viewport(M),ut.scissor(P),ut.setScissorTest(U),lt){const bt=Nt.get(b.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+I,bt.__webglTexture,k)}else if(ft){const bt=Nt.get(b.texture),Ot=I||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,bt.__webglTexture,k||0,Ot)}N=-1},this.readRenderTargetPixels=function(b,I,k,H,z,lt,ft){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Mt=Nt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ft!==void 0&&(Mt=Mt[ft]),Mt){ut.bindFramebuffer(O.FRAMEBUFFER,Mt);try{const bt=b.texture,Ot=bt.format,At=bt.type;if(Ot!==Te&&ht.convert(Ot)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Pt=At===zn&&(_t.has("EXT_color_buffer_half_float")||Tt.isWebGL2&&_t.has("EXT_color_buffer_float"));if(At!==Re&&ht.convert(At)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(At===ln&&(Tt.isWebGL2||_t.has("OES_texture_float")||_t.has("WEBGL_color_buffer_float")))&&!Pt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=b.width-H&&k>=0&&k<=b.height-z&&O.readPixels(I,k,H,z,ht.convert(Ot),ht.convert(At),lt)}finally{const bt=A!==null?Nt.get(A).__webglFramebuffer:null;ut.bindFramebuffer(O.FRAMEBUFFER,bt)}}},this.copyFramebufferToTexture=function(b,I,k=0){const H=Math.pow(2,-k),z=Math.floor(I.image.width*H),lt=Math.floor(I.image.height*H);w.setTexture2D(I,0),O.copyTexSubImage2D(O.TEXTURE_2D,k,0,0,b.x,b.y,z,lt),ut.unbindTexture()},this.copyTextureToTexture=function(b,I,k,H=0){const z=I.image.width,lt=I.image.height,ft=ht.convert(k.format),Mt=ht.convert(k.type);w.setTexture2D(k,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,k.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,k.unpackAlignment),I.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,H,b.x,b.y,z,lt,ft,Mt,I.image.data):I.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,H,b.x,b.y,I.mipmaps[0].width,I.mipmaps[0].height,ft,I.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,H,b.x,b.y,ft,Mt,I.image),H===0&&k.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),ut.unbindTexture()},this.copyTextureToTexture3D=function(b,I,k,H,z=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const lt=b.max.x-b.min.x+1,ft=b.max.y-b.min.y+1,Mt=b.max.z-b.min.z+1,bt=ht.convert(H.format),Ot=ht.convert(H.type);let At;if(H.isData3DTexture)w.setTexture3D(H,0),At=O.TEXTURE_3D;else if(H.isDataArrayTexture||H.isCompressedArrayTexture)w.setTexture2DArray(H,0),At=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,H.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,H.unpackAlignment);const Pt=O.getParameter(O.UNPACK_ROW_LENGTH),ie=O.getParameter(O.UNPACK_IMAGE_HEIGHT),De=O.getParameter(O.UNPACK_SKIP_PIXELS),le=O.getParameter(O.UNPACK_SKIP_ROWS),Ze=O.getParameter(O.UNPACK_SKIP_IMAGES),Zt=k.isCompressedTexture?k.mipmaps[z]:k.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,Zt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Zt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,b.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,b.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,b.min.z),k.isDataTexture||k.isData3DTexture?O.texSubImage3D(At,z,I.x,I.y,I.z,lt,ft,Mt,bt,Ot,Zt.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),O.compressedTexSubImage3D(At,z,I.x,I.y,I.z,lt,ft,Mt,bt,Zt.data)):O.texSubImage3D(At,z,I.x,I.y,I.z,lt,ft,Mt,bt,Ot,Zt),O.pixelStorei(O.UNPACK_ROW_LENGTH,Pt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ie),O.pixelStorei(O.UNPACK_SKIP_PIXELS,De),O.pixelStorei(O.UNPACK_SKIP_ROWS,le),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ze),z===0&&H.generateMipmaps&&O.generateMipmap(At),ut.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?w.setTextureCube(b,0):b.isData3DTexture?w.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?w.setTexture2DArray(b,0):w.setTexture2D(b,0),ut.unbindTexture()},this.resetState=function(){R=0,T=0,A=null,ut.reset(),Ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Gr?"display-p3":"srgb",e.unpackColorSpace=Xt.workingColorSpace===Ds?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===he?Fn:vl}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Fn?he:hn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class km extends Fl{}km.prototype.isWebGL1Renderer=!0;class Os extends Pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class fi extends Le{constructor(t=null,e=1,n=1,i,r,o,a,l,c=Jt,h=Jt,d,f){super(null,o,a,l,c,h,i,r,d,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ts extends ue{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}class Hm extends Ui{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Rt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Po=new ne,Ir=new Wr,as=new gi,os=new D;class Gm extends Pe{constructor(t=new Oe,e=new Hm){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),as.copy(n.boundingSphere),as.applyMatrix4(i),as.radius+=r,t.ray.intersectsSphere(as)===!1)return;Po.copy(i).invert(),Ir.copy(t.ray).applyMatrix4(Po);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){const f=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let v=f,g=m;v<g;v++){const p=c.getX(v);os.fromBufferAttribute(d,p),Do(os,p,l,i,t,e,this)}}else{const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m;v<g;v++)os.fromBufferAttribute(d,v),Do(os,v,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Do(s,t,e,n,i,r,o){const a=Ir.distanceSqToPoint(s);if(a<e){const l=new D;Ir.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:o})}}class jr extends Oe{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new Xe(r,3)),this.setAttribute("normal",new Xe(r.slice(),3)),this.setAttribute("uv",new Xe(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(y){const x=new D,E=new D,R=new D;for(let T=0;T<e.length;T+=3)m(e[T+0],x),m(e[T+1],E),m(e[T+2],R),l(x,E,R,y)}function l(y,x,E,R){const T=R+1,A=[];for(let N=0;N<=T;N++){A[N]=[];const _=y.clone().lerp(E,N/T),M=x.clone().lerp(E,N/T),P=T-N;for(let U=0;U<=P;U++)U===0&&N===T?A[N][U]=_:A[N][U]=_.clone().lerp(M,U/P)}for(let N=0;N<T;N++)for(let _=0;_<2*(T-N)-1;_++){const M=Math.floor(_/2);_%2===0?(f(A[N][M+1]),f(A[N+1][M]),f(A[N][M])):(f(A[N][M+1]),f(A[N+1][M+1]),f(A[N+1][M]))}}function c(y){const x=new D;for(let E=0;E<r.length;E+=3)x.x=r[E+0],x.y=r[E+1],x.z=r[E+2],x.normalize().multiplyScalar(y),r[E+0]=x.x,r[E+1]=x.y,r[E+2]=x.z}function h(){const y=new D;for(let x=0;x<r.length;x+=3){y.x=r[x+0],y.y=r[x+1],y.z=r[x+2];const E=p(y)/2/Math.PI+.5,R=u(y)/Math.PI+.5;o.push(E,1-R)}v(),d()}function d(){for(let y=0;y<o.length;y+=6){const x=o[y+0],E=o[y+2],R=o[y+4],T=Math.max(x,E,R),A=Math.min(x,E,R);T>.9&&A<.1&&(x<.2&&(o[y+0]+=1),E<.2&&(o[y+2]+=1),R<.2&&(o[y+4]+=1))}}function f(y){r.push(y.x,y.y,y.z)}function m(y,x){const E=y*3;x.x=t[E+0],x.y=t[E+1],x.z=t[E+2]}function v(){const y=new D,x=new D,E=new D,R=new D,T=new Ct,A=new Ct,N=new Ct;for(let _=0,M=0;_<r.length;_+=9,M+=6){y.set(r[_+0],r[_+1],r[_+2]),x.set(r[_+3],r[_+4],r[_+5]),E.set(r[_+6],r[_+7],r[_+8]),T.set(o[M+0],o[M+1]),A.set(o[M+2],o[M+3]),N.set(o[M+4],o[M+5]),R.copy(y).add(x).add(E).divideScalar(3);const P=p(R);g(T,M+0,y,P),g(A,M+2,x,P),g(N,M+4,E,P)}}function g(y,x,E,R){R<0&&y.x===1&&(o[x]=y.x-1),E.x===0&&E.z===0&&(o[x]=R/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function u(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jr(t.vertices,t.indices,t.radius,t.details)}}class Kr extends jr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Kr(t.radius,t.detail)}}class Zr extends Oe{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Vm{constructor(t,e,n=0,i=1/0){this.ray=new Wr(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Xr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Nr(t,this,n,e),n.sort(Uo),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Nr(t[i],this,n,e);return n.sort(Uo),n}}function Uo(s,t){return s.distance-t.distance}function Nr(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let r=0,o=i.length;r<o;r++)Nr(i[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:kr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=kr);const Io=s=>Number.isInteger(s)?s.toFixed(1):String(s),_i=`
#define PI 3.14159265
#define NEAR_E ${Io(gs)}
#define NORMAL_E ${Io(rl)}
#define SLOTS ${vn}
`,Ol=`
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
`,xi=`
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
`,No=Array.from({length:vn},(s,t)=>t),Jr=`
${No.map(s=>`uniform sampler2D uSlotH${s};`).join(`
`)}
float slotMetres(int s, vec2 xz) {
  // (samplers can only be picked by a constant index)
${No.map(s=>`  if (s == ${s}) return rectMetres(uSlotH${s}, uSlotRect[${s}], xz);`).join(`
`)}
  return -4000.0;
}
float groundMetres(vec2 xz) {
  float m = archMetres(xz);
  int o = ownerAt(xz);
  if (o >= 0) {
    float w = slotWeight(o, xz);
    if (w > 0.0) m = mix(m, slotMetres(o, xz), w);
  }
  return m;
}
`,zl=`
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
`,Wm=`
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
`,Xm=`
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
  vec3 red = pow(vec3(0.80, 0.19, 0.13), vec3(2.2));
  float far = smoothstep(1.0, 5.0, px);
  float wash = mix(0.2, 0.28, far) * smoothstep(0.15, 0.40, sv);
  float cover = clamp((sv - 0.28) / 0.56, 0.0, 1.0);
  float speck = landSpecks(xz, px, pow(cover, 1.5 - 0.6 * far));
  c = mix(c, red, max(wash, speck * 0.95));
  return mix(col, c, k);
}
`,Bl=`
uniform sampler2D uOwnH;
uniform vec4 uOwnRect;
uniform int uSelf;
float packMetres(vec2 xz) {
  float a = archMetres(xz);
  if (uSelf < 0) return a;
  float w = slotWeight(uSelf, xz);
  return w > 0.0 ? mix(a, rectMetres(uOwnH, uOwnRect, xz), w) : a;
}
`,$m=`
${_i}
${xi}
${Bl}
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
    vec2 base = aNode.xy + (g - odd) * cell;
    float hc;
    if (odd.x > 0.5 && odd.y > 0.5) {
      vec2 pc = (g - odd) * 0.5;
      if (mod(pc.x + pc.y, 2.0) > 0.5) hc = 0.5 * (packMetres(base + vec2(2.0, 0.0) * cell) + packMetres(base + vec2(0.0, 2.0) * cell));
      else hc = 0.5 * (packMetres(base) + packMetres(base + vec2(2.0) * cell));
    } else {
      hc = 0.5 * (packMetres(base) + packMetres(base + odd * 2.0 * cell));
    }
    mt = mix(mt, hc, k);
  }
  vMetres = mt;
  // The sea is drawn from the heights; the seabed under it only needs to show
  // in the last few centimetres at the shoreline. Sink it below that so the
  // two surfaces never fight over depth.
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,qm=`
${_i}
${Ol}
${xi}
${Bl}
${zl}
${Wm}
${Xm}
uniform sampler2D uArchN;  // normals at NORMAL_E (rgb), ambient occlusion (a)
uniform sampler2D uArchL;  // r rain (log), g sand, b riparian, a reserved
uniform sampler2D uOwnN;
uniform sampler2D uOwnL;
uniform sampler2D uOwnS;   // this pack's cast shadows (shadow.js), over its rect
uniform sampler2D uOwnLandA; // this island's era layers, the keyframe before and after (overlay/land.js)
uniform sampler2D uOwnLandB;
uniform float uOwnRain;    // 0: this pack has no rain image, so the archipelago's stands
uniform float uKau;        // the season, 0 hoʻoilo .. 1 kau
uniform int uDebug;
in vec3 vWorld;
in float vMetres;

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

void main() {
  vec2 xz = vWorld.xz;
  if (ownerAt(xz) != uSelf) discard;
  if (edgeDist(uArchRect, xz) < 0.0) discard;
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
    float cult = 1.0 - smoothstep(420.0, 760.0, metres + (nBig - 0.5) * 120.0);
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
`,Ym=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Qr(){const s=new Oe;return s.setAttribute("position",new ue(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const jm=`
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
`;class Km{constructor(t){this.renderer=t,this.size=new Ct;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?zn:Re,this.sceneRT=new Ke(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new Yr(1,1,on),this.quad=new ge(Qr(),new ve({vertexShader:Ym,fragmentShader:jm,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Ct},uInvProj:{value:new ne},uCamWorld:{value:new ne},uCamPos:{value:new D},uSunDir:{value:new D(0,1,0)},uSunColor:{value:new Rt},uFogColor:{value:new Rt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Os,this.quadScene.add(this.quad),this.quadCam=new Ns(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const Zm=`
${_i}
${xi}
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
`;class Jm{constructor(t,e=1024){const{W:n,H:i}=t,r=Math.min(1,e/Math.max(n,i)),o=Math.max(16,Math.round(n*r)),a=Math.max(16,Math.round(i*r));this.terrain=t,this.rt=new Ke(o,a,{type:Re,format:Ps,depthBuffer:!1,minFilter:me,magFilter:me});const l=t.pack.rect;this.uniforms={...t.uniforms,uSunDir:{value:new D(0,1,0)},uStep:{value:Math.max((l.x1-l.x0)/o,(l.z1-l.z0)/a)},uTop:{value:1}},this.material=new ve({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Zm,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new Os;const c=new ge(Qr(),this.material);c.frustumCulled=!1,this.scene.add(c),this.cam=new Ns(-1,1,1,-1,0,1),this.h=a,this.strips=4,this.strip=-1,this.drawn={sun:new D(0,-2,0),vert:-1,k:-1}}get texture(){return this.rt.texture}update(t,e,n,i,r){const o=this.uniforms,a=this.drawn;if(this.strip<0){if(!(e.angleTo(a.sun)>.004||Math.abs(n-a.vert)>a.vert*.015||Math.abs(i-a.k)>.03))return;if(o.uSunDir.value.copy(e),o.uTop.value=r,a.sun.copy(e),a.vert=n,a.k=i,!this.ever)return this.ever=!0,this.draw(t,-1);this.strip=0}this.draw(t,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e){const n=this.rt;if(e>=0){const r=Math.ceil(this.h/this.strips);n.scissor.set(0,e*r,n.width,r),n.scissorTest=!0}else n.scissorTest=!1;const i=t.getRenderTarget();t.setRenderTarget(n),t.render(this.scene,this.cam),t.setRenderTarget(i),n.scissorTest=!1}dispose(){this.rt.dispose(),this.material.dispose()}}const vr=32,Fo=1600,Oo=-.5;function kl(s,t,e){const n=new fi(s,t,e,Ps,ln);return n.minFilter=Jt,n.magFilter=Jt,n.wrapS=n.wrapT=Ce,n.needsUpdate=!0,n}function zo(s,t,e,n=1){const i=new fi(s,t,e,Te,Re);return i.minFilter=On,i.magFilter=me,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=Ce,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class Bo{constructor(t,e,n=null){this.pack=t,this.world=e;const i=t.data,{W:r,H:o}=t,{x0:a,z0:l,x1:c,z1:h}=t.rect;this.rect=new ee(a,l,c,h),this.heights=i.metres,this.W=r,this.H=o;const d=e.app.renderer.capabilities.getMaxAnisotropy();this.heightTex=kl(i.metres,r,o),this.normalTex=zo(i.normals,r,o,Math.min(8,d)),this.landTex=zo(i.land,r,o,Math.min(4,d)),i.normals=null,i.land=null;const f=Math.max((c-a)/r,(h-l)/o);this.texel=f;const m=Math.max(c-a,h-l);this.levels=Math.max(1,Math.ceil(Math.log2(m/(vr*f)))+1),this.leafSize=m/2**(this.levels-1),this.buildMinMax(n),this.full=this.makeGrid(vr),this.half=this.makeGrid(vr/2),this.morph=[];for(let p=0;p<12;p++)this.morph.push(new Ct);const v=e.uniforms,g=n||this;this.uniforms={...v,uOwnH:{value:this.heightTex},uOwnRect:{value:this.rect},uOwnN:{value:this.normalTex},uOwnL:{value:this.landTex},uArchN:{value:g.normalTex},uArchL:{value:g.landTex},uOwnS:{value:null},uOwnLandA:{value:null},uOwnLandB:{value:null},uSelf:{value:-1},uOwnRain:{value:n&&!t.rainUrl?0:1},uMorph:{value:this.morph},uCamPos:{value:new D},uKau:{value:.5},uDebug:{value:0}},this.group=new je;for(const p of[this.full,this.half])p.material=new ve({vertexShader:$m,fragmentShader:qm,uniforms:{...this.uniforms,uGrid:{value:p.dim}}}),p.mesh=new ge(p.geometry,p.material),p.mesh.frustumCulled=!1,p.mesh.matrixAutoUpdate=!1,this.group.add(p.mesh);this.shadow=new Jm(this),this.uniforms.uOwnS.value=this.shadow.texture,this._frustum=new Is,this._m=new ne,this._box=new Bn,this.rangeK=3.5,this.applyRange(this.rangeK)}makeGrid(t){const e=new Zr,n=new Float32Array((t+1)*(t+1)*3);for(let a=0;a<=t;a++)for(let l=0;l<=t;l++){const c=(a*(t+1)+l)*3;n[c]=l/t,n[c+2]=a/t}const i=[];for(let a=0;a<t;a++)for(let l=0;l<t;l++){const c=a*(t+1)+l,h=c+1,d=c+t+1,f=d+1;l+a&1?i.push(c,d,h,h,d,f):i.push(c,d,f,c,f,h)}e.setIndex(i),e.setAttribute("position",new ue(n,3));const r=new Float32Array(Fo*4),o=new Ts(r,4);return o.setUsage(xh),e.setAttribute("aNode",o),e.instanceCount=0,{dim:t,geometry:e,data:r,attr:o,count:0}}buildMinMax(t){const{W:e,H:n,heights:i}=this,r=this.pack.rect,o=2**(this.levels-1),a=this.leafSize,l=e/(r.x1-r.x0),c=n/(r.z1-r.z0);let h=new Float32Array(o*o).fill(1/0),d=new Float32Array(o*o).fill(-1/0);for(let m=0;m<o;m++){const v=m*a;if(v>=r.z1-r.z0)continue;const g=Math.max(0,Math.floor(v*c)-1),p=Math.min(n-1,Math.ceil((v+a)*c)+1);for(let u=0;u<o;u++){const y=u*a;if(y>=r.x1-r.x0)continue;const x=Math.max(0,Math.floor(y*l)-1),E=Math.min(e-1,Math.ceil((y+a)*l)+1);let R=1/0,T=-1/0;for(let A=g;A<=p;A++)for(let N=x;N<=E;N++){const _=i[A*e+N];_<R&&(R=_),_>T&&(T=_)}if(t){for(let A=g;A<=p;A+=2)for(let N=x;N<=E;N+=2){const _=t.metresAt(r.x0+(N+.5)/l,r.z0+(A+.5)/c);_<R&&(R=_),_>T&&(T=_)}R-=40,T+=40}h[m*o+u]=R,d[m*o+u]=T}}this.mm=[{lo:h,hi:d,n:o}];let f=o;for(;f>1;){const m=f/2,v=new Float32Array(m*m),g=new Float32Array(m*m);for(let p=0;p<m;p++)for(let u=0;u<m;u++){const y=2*p*f+2*u;v[p*m+u]=Math.min(h[y],h[y+1],h[y+f],h[y+f+1]),g[p*m+u]=Math.max(d[y],d[y+1],d[y+f],d[y+f+1])}h=v,d=g,f=m,this.mm.push({lo:h,hi:d,n:f})}}metresAt(t,e){const n=this.pack.rect,{W:i,H:r,heights:o}=this;let a=(t-n.x0)/(n.x1-n.x0)*i-.5,l=(e-n.z0)/(n.z1-n.z0)*r-.5;a<0?a=0:a>i-1.001&&(a=i-1.001),l<0?l=0:l>r-1.001&&(l=r-1.001);const c=a|0,h=l|0,d=a-c,f=l-h,m=h*i+c,v=o[m]+(o[m+1]-o[m])*d,g=o[m+i]+(o[m+i+1]-o[m+i])*d;return v+(g-v)*f}applyRange(t){this.rangeK=t;const e=t*this.leafSize;this.ranges=[];for(let n=0;n<this.levels;n++)this.ranges.push(e*2**n);this.ranges[this.levels-1]=1e9;for(let n=0;n<this.levels;n++){const i=this.ranges[n],r=n>0?this.ranges[n-1]:0;this.morph[n].set(r+(i-r)*.5,i*.97)}}setSelf(t){this.uniforms.uSelf.value=t;for(const e of[this.full,this.half])e.material.uniforms.uSelf.value=t}update(t,e){this.group.visible=e,this.full.count=0,this.half.count=0,e&&(this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.vert=this.world.uniforms.uVert.value,this.uniforms.uCamPos.value.copy(t.position),this.select(0,0,this.levels-1));for(const n of[this.full,this.half])n.geometry.instanceCount=n.count,n.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],r=this.leafSize*2**n,o=this.pack.rect.x0+t*r,a=this.pack.rect.z0+e*r,l=this.vert,c=Math.min(0,i.lo[e*i.n+t])*l-.3,h=Math.max(0,i.hi[e*i.n+t])*l+.1;return this._box.min.set(o,c,a),this._box.max.set(o+r,h,a+r),this._box}select(t,e,n){const i=this.mm[n];if(!(i.hi[e*i.n+t]>=Oo))return!0;const o=this.nodeBox(t,e,n);if(o.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(o))return!0;const a=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,a,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,a,n),!0;for(let l=0;l<4;l++){const c=t*2+(l&1),h=e*2+(l>>1);if(!this.select(c,h,n-1)){const d=this.mm[n-1];if(!(d.hi[h*d.n+c]>=Oo))continue;const f=this.nodeBox(c,h,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,c,h,a/2,n)}}return!0}emit(t,e,n,i,r){if(t.count>=Fo)return;const o=t.count*4;t.data[o]=this.pack.rect.x0+e*i,t.data[o+1]=this.pack.rect.z0+n*i,t.data[o+2]=i,t.data[o+3]=r,t.count++}dispose(){for(const t of[this.full,this.half])t.geometry.dispose(),t.material.dispose();this.shadow.dispose(),this.heightTex.dispose(),this.normalTex.dispose(),this.landTex.dispose()}}const ko=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};class Qm{constructor(t,e){this.app=t,this.data=e,this.packs=e.packs,this.archPack=this.packs.find(i=>i.kind==="archipelago")||this.packs[0],this.islandPacks=this.packs.filter(i=>i!==this.archPack),this.group=new je,this.terrains=new Map,this.slots=new Array(vn).fill(null),this.exag=la(5e3),this.noIslands=!1,this.forceK=null;const n=kl(new Float32Array([-4e3]),1,1);this.uniforms={uVert:{value:this.exag/100},uExag:{value:this.exag},uArchH:{value:n},uArchRect:{value:new ee(0,0,1,1)},uSlotRect:{value:Array.from({length:vn},()=>new ee(0,0,1,1))},uSlotInfo:{value:Array.from({length:vn},()=>new ee(0,0,1,0))}};for(let i=0;i<vn;i++)this.uniforms[`uSlotH${i}`]={value:n};this._frustum=new Is,this._m=new ne,this._box=new Bn,this.dummy=n}setArchipelago(t){const e=new Bo(t,this);e.setSelf(-1),this.arch=e,this.terrains.set(t.id,e),this.group.add(e.group),this.uniforms.uArchH.value=e.heightTex,this.uniforms.uArchRect.value.copy(e.rect);const n=t.rect;this.bounds={x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1}}addIsland(t){const e=new Bo(t,this,this.arch);e.k=0,e.want=0,e.slot=-1;const n=t.rect;return e.margin=Math.min(15,.08*Math.min(n.x1-n.x0,n.z1-n.z0)),e.group.visible=!1,this.terrains.set(t.id,e),this.group.add(e.group),e}get islands(){return[...this.terrains.values()].filter(t=>t!==this.arch)}wantFor(t,e){const n=t.pack.rect,i=e.position,r=Math.max(n.x0-i.x,0,i.x-n.x1),o=Math.max(n.z0-i.z,0,i.z-n.z1),a=Math.hypot(r,o,Math.max(1,i.y)),l=(innerHeight||800)/(2*Math.tan(e.fov*Math.PI/360)),c=this.arch.texel*l/a;t.score=c;const h=Math.max(1,t.pack.data.hi*this.uniforms.uVert.value);return this._box.min.set(n.x0,0,n.z0),this._box.max.set(n.x1,h,n.z1),this._frustum.intersectsBox(this._box)?ko(1,2.4,c):0}update(t,e,n){this.exag=la(e),this.uniforms.uExag.value=this.exag,this.uniforms.uVert.value=this.exag/100;const i=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const m of i)m.want=this.noIslands?0:this.wantFor(m,t);const r=i.filter(m=>m.want>0).sort((m,v)=>v.score-m.score),o=new Set(r.slice(0,vn)),a=1-Math.exp(-n*2.5);for(const m of i){const v=o.has(m)?m.want:0;if(m.slot>=0)m.k+=(v-m.k)*a,Math.abs(v-m.k)<.004&&(m.k=v),m.k<=0&&v<=0&&this.release(m);else if(v>0){const g=this.slots.indexOf(null);g>=0&&this.assign(m,g)}}if(this.forceK!==null)for(const m of this.slots)m&&(m.k=this.forceK);if(this.noIslands)for(const m of this.slots)m&&this.release(m);const l=this.uniforms;for(let m=0;m<vn;m++){const v=this.slots[m];l.uSlotInfo.value[m].set(v?v.k:0,v?1:0,v?v.margin:1,0)}this.arch.update(t,!0);for(const m of i)m.update(t,m.slot>=0);const c=this.app.renderer,h=this.app.light.sunDir,d=this.uniforms.uVert.value,f=this.maxY+.1;this.arch.shadow.update(c,h,d,0,f);for(const m of i)m.slot>=0&&m.shadow.update(c,h,d,m.k,f)}settle(t){const e=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const i of e)i.want=this.wantFor(i,t);const n=e.filter(i=>i.want>0).sort((i,r)=>r.score-i.score).slice(0,this.slots.length);for(const i of e)i.slot>=0&&!n.includes(i)&&this.release(i);for(const i of n){if(i.slot<0){const r=this.slots.indexOf(null);if(r<0)continue;this.assign(i,r)}i.k=i.want}}stats(){const t={};for(const[e,n]of this.terrains)n.group.visible&&(t[e]=n.full.count+n.half.count);return{exag:+this.exag.toFixed(2),nodes:t,slots:this.slots.map(e=>e?`${e.pack.id}:${e.k.toFixed(2)}`:null)}}assign(t,e){this.slots[e]=t,t.slot=e,t.k=0,t.setSelf(e),t.shadow.ever=!1,t.shadow.strip=-1,t.shadow.drawn.vert=-1,this.uniforms.uSlotRect.value[e].copy(t.rect),this.uniforms[`uSlotH${e}`].value=t.heightTex}release(t){const e=t.slot;e<0||(this.slots[e]=null,t.slot=-1,t.k=0,this.uniforms[`uSlotH${e}`].value=this.dummy,this.uniforms.uSlotInfo.value[e].set(0,0,1,0))}metresAt(t,e){const n=this.arch;if(!n)return-4e3;const i=n.pack.rect;let r=t<i.x0||e<i.z0||t>i.x1||e>i.z1?-4e3:n.metresAt(t,e),o=null,a=0;for(const l of this.slots){if(!l)continue;const c=l.pack.rect,h=Math.min(t-c.x0,c.x1-t,e-c.z0,c.z1-e);h>a&&(a=h,o=l)}if(o){const l=o.k*ko(0,o.margin,a);l>0&&(r+=(o.metresAt(t,e)-r)*l)}return r}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.uniforms.uVert.value}get maxY(){let t=0;for(const e of this.terrains.values())t=Math.max(t,e.pack.data.hi);return t*this.uniforms.uVert.value}islandAt(t,e){let n=null,i=0;for(const r of this.islands){const o=r.pack.rect,a=Math.min(t-o.x0,o.x1-t,e-o.z0,o.z1-e);a>i&&(i=a,n=r)}return n}setRange(t){for(const e of this.terrains.values())e.applyRange(t)}setDebug(t){for(const e of this.terrains.values())e.uniforms.uDebug.value=t}}const t0=`
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,e0=`
${_i}
${Ol}
${xi}
${Jr}
${zl}
uniform vec3 uCamPos;
uniform vec2 uWind;        // direction the wind blows toward, scaled by strength (0..1+)
uniform vec2 uSwellDir;    // direction the swell travels
uniform int uDebug;
in vec3 vWorld;

float seaDepth(vec2 xz) { return -groundMetres(xz); }

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

  vec2 g = waveSlope(xz, uTime, px) * (0.55 + 0.6 * length(uWind));
  g *= 1.0 + 0.6 * (1.0 - smoothstep(0.5, 6.0, depth));
  vec3 N = normalize(vec3(-g.x, 1.0, -g.y));

  // --- what's under the surface ------------------------------------------
  float fb = fbm2F(xz * 1.7, px * 1.7);
  vec3 sandC = vec3(0.80, 0.72, 0.55);
  vec3 reefC = mix(vec3(0.30, 0.27, 0.20), vec3(0.42, 0.30, 0.34), fbm2F(xz * 4.0 + 7.0, px * 4.0));
  float reef = smoothstep(0.45, 0.62, fb) * (1.0 - smoothstep(4.0, 14.0, depth));
  vec3 bed = mix(sandC, reefC, clamp(reef, 0.0, 1.0));
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
  vec3 under = bed * light * (1.0 + caust * vis) * exp(-absorb * depth * 2.0);
  vec3 amb = uSkyColor * 1.6 + uSunColor * max(uSunDir.y, 0.0) * vis;
  vec3 deepC = vec3(0.004, 0.030, 0.075) * amb;
  vec3 turq = vec3(0.03, 0.20, 0.21) * amb;
  // (and in the channels, a kilometre and more down, the deepest blue)
  vec3 abyss = vec3(0.002, 0.018, 0.060) * amb;
  float scatter = 1.0 - exp(-depth * 0.3);
  vec3 body = mix(turq, deepC, smoothstep(5.0, 45.0, depth));
  body = mix(body, abyss, smoothstep(200.0, 1500.0, depth));
  vec3 water = under + body * scatter;

  // --- the surface ---------------------------------------------------------
  float cosT = max(dot(N, V), 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y);
  vec3 refl = skyMap(R);
  vec3 H = normalize(uSunDir + V);
  float spec = pow(max(dot(N, H), 0.0), 900.0) * 60.0 + pow(max(dot(N, H), 0.0), 90.0) * 0.6;
  vec3 col = mix(water, refl, F) + uSunColor * spec * vis * step(0.0, uSunDir.y);

  // --- foam --------------------------------------------------------------------
  // swash at the shore, where the water is shallowest (depth stands in for the
  // distance to land), and whitecaps in the trades out in deeper water
  float shore = 1.0 - smoothstep(0.1, 1.4, depth);
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
`;function n0(s,t,e,n){const i=[0,0,0];for(let a=0;a<=n;a++){const l=s*Math.pow(t/s,a/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;i.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const r=[];for(let a=0;a<e;a++)r.push(0,1+(a+1)%e,1+a);for(let a=0;a<n;a++)for(let l=0;l<e;l++){const c=1+a*e+l,h=1+a*e+(l+1)%e,d=c+e,f=h+e;r.push(c,h,d,h,f,d)}const o=new Oe;return o.setAttribute("position",new Xe(i,3)),o.setIndex(r),o}class i0{constructor(t,e){this.uniforms={...t.uniforms,...e,uCamPos:{value:new D},uWind:{value:new Ct(-.8,.45)},uSwellDir:{value:new Ct(-.6,.8)},uDebug:{value:0}},this.material=new ve({vertexShader:t0,fragmentShader:e0,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new ge(n0(1,25e4,96,120),this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const s0=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],r0={ra:12.857,dec:27.13};function a0(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}const rn=Math.PI/180,Ti=21*rn,ls=29.530588,o0=224.1;function Ho(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),r=Math.sin(s)*Math.cos(Ti)-n*Math.cos(t)*Math.sin(Ti),o=Math.sin(s)*Math.sin(Ti)+n*Math.cos(t)*Math.cos(Ti);return e.set(i,o,-r)}function l0(s,t,e={}){const n=23.44*rn*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*rn,o=((s-80)/365.25*24%24+24)%24+t-12;e.sun=Ho(n,(t-12)*15*rn,e.sun||new D);const a=s+t/24,l=((a-o0)%ls+ls)%ls,c=l/ls,h=i+c*2*Math.PI,d=Math.asin(Math.sin(23.44*rn)*Math.sin(h)+Math.sin(5.1*rn)*Math.sin(a*.23)),f=h/(2*Math.PI)*24;return e.moon=Ho(d,(o-f)*15*rn,e.moon||new D),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=o,e.decl=n,e}const Hl=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],Gl=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],c0=1.6110731556870734,h0=1.5;function u0(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((c0-Math.acos(s))/h0)))}function _r(s,t,e,n=[0,0,0]){const i=u0(t.y),r=.2*e.turbidity*1e-17,o=Math.acos(Math.max(0,s.y)),a=1/(Math.cos(o)+.15*Math.pow(93.885-o*180/Math.PI,-1.253)),l=8400*a,c=1250*a,h=s.x*t.x+s.y*t.y+s.z*t.z,d=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),f=e.mieDirectionalG,m=f*f,v=1/(4*Math.PI)*((1-m)/Math.pow(1-2*f*h+m,1.5)),g=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let p=0;p<3;p++){const u=Hl[p]*e.rayleigh,y=.434*r*Gl[p]*e.mieCoefficient,x=Math.exp(-(u*l+y*c)),E=(u*d+y*v)/(u+y);let R=Math.pow(i*E*(1-x),1.5);R*=1+(Math.pow(i*E*x,.5)-1)*g;const T=.1*x,A=(R+T)*.04+[0,3e-4,75e-5][p];n[p]=Math.pow(A,1/2.4)}return n}function d0(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),r=.2*t.turbidity*1e-17;for(let o=0;o<3;o++){const a=Hl[o]*t.rayleigh,l=.434*r*Gl[o]*t.mieCoefficient;e[o]=Math.exp(-(a*8400*i+l*1250*i))}return e}const f0=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,Vl=`
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
`,p0=`
${Vl}
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
`,m0=`
${Vl}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,g0=`
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
`,v0=`
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
`;class _0{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=r0,e=(c,h)=>{const d=c/24*2*Math.PI,f=h*rn;return new D(Math.cos(f)*Math.cos(d),Math.cos(f)*Math.sin(d),Math.sin(f))};this.uniforms={uSun:{value:new D(0,1,0)},uMoon:{value:new D(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:Ti},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new ge(new Kr(1,5),new ve({vertexShader:f0,fragmentShader:p0,uniforms:this.uniforms,side:Ae,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=a0(4242),r=s0.map(([c,h,d])=>[c/24*2*Math.PI,h*rn,d]);for(let c=0;c<2600;c++){const h=i()*2-1;r.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const o=new Float32Array(r.length*3);r.forEach((c,h)=>o.set(c,h*3));const a=new Oe;a.setAttribute("aStar",new ue(o,3)),a.setAttribute("position",new ue(new Float32Array(r.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new Gm(a,new ve({vertexShader:g0,fragmentShader:v0,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:wr})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new je,this.group.add(n,this.stars),this.mapRT=new Ke(256,128,{type:zn,depthBuffer:!1}),this.mapRT.texture.wrapS=xs,this.mapScene=new Os;const l=new ge(Qr(),new ve({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:m0,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new Ns(-1,1,1,-1,0,1),this.astro={},this._v=new D}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const r=l0(t,e,this.astro),o=r.sun,a=this.uniforms;a.uSun.value.copy(o),a.uMoon.value.copy(r.moon),a.uPhase.value=r.phase,a.uIllum.value=r.illum,a.uLst.value=r.lst/24*2*Math.PI;const l=Ee.smoothstep(-o.y,-.02,.2);a.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,d=_r(h.set(0,1,0),o,c),f=[0,0,0];for(let T=0;T<8;T++){const A=T/8*Math.PI*2,N=_r(h.set(Math.cos(A),.08,Math.sin(A)).normalize(),o,c);for(let _=0;_<3;_++)f[_]+=N[_]/8}const m=_r(h.set(o.x,.05,o.z).normalize(),o,c),v=d0(o,c),g=Ee.smoothstep(o.y,-.04,.06),p=3.2;i.sunColor.setRGB(v[0]*p*g,v[1]*p*g,v[2]*p*g);const u=[.0035,.005,.011],x=Ee.smoothstep(r.moon.y,-.02,.1)*r.illum*l;i.skyColor.setRGB(d[0]*.55+f[0]*.45+u[0]+.012*x,d[1]*.55+f[1]*.45+u[1]+.016*x,d[2]*.55+f[2]*.45+u[2]+.024*x);const E=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Rt(E,E,E),.35),i.zenith.setRGB(d[0],d[1],d[2]),i.horizon.setRGB(f[0]+u[0],f[1]+u[1],f[2]+u[2]),i.sunHorizon.setRGB(m[0],m[1],m[2]);const R=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,o.y)+i.skyColor.r)*R*1.1,(i.sunColor.g*Math.max(0,o.y)+i.skyColor.g)*R,(i.sunColor.b*Math.max(0,o.y)+i.skyColor.b)*R*.8),i.moonColor.setRGB(.05*x,.06*x,.085*x),i.moonDir.copy(r.moon),i.sunDir.copy(o),i.night=l,r}}const xr=Math.PI*2,x0=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,Go=s=>((s+Math.PI)%xr+xr)%xr-Math.PI,M0=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};function Ln(s){return .6+.52*M0(Math.log(40),Math.log(4500),Math.log(Math.max(1,s)))}class y0{constructor(t,e,n){this.camera=t,this.dom=e,this.world=n,this.home=this.homeView();const i=this.home;this.state={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.goal={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.flight=null,this.floor=0,this.minDistance=nc,this.maxDistance=aa,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new Vm,this._v=new D,this.bind()}homeView(t=innerWidth/Math.max(1,innerHeight)){const e=this.world.bounds,n=e.x1-e.x0,i=Math.tan(this.camera.fov*Math.PI/360),r=t<.85,o=r?1.2*Math.hypot(n,e.z1-e.z0)*.92/(2*i):1.2*n/(2*i*Math.max(1,t)),a=Math.min(aa,o);return{target:new D((e.x0+e.x1)/2,0,(e.z0+e.z1)/2+(r?0:(e.z1-e.z0)*.04)),distance:a,yaw:r?1.1:0,pitch:Ln(a)}}bind(){const t=this.dom,e=new Map;let n=null,i=null,r=null;t.addEventListener("contextmenu",a=>a.preventDefault()),t.addEventListener("pointerdown",a=>{this.enabled&&(t.setPointerCapture(a.pointerId),e.set(a.pointerId,{x:a.clientX,y:a.clientY}),e.size===1?(n=a.button===2||a.shiftKey||a.ctrlKey||a.metaKey||a.altKey?"orbit":"pan",i={x:a.clientX,y:a.clientY}):e.size===2&&(n="pinch",r=this.pinchState(e)))}),t.addEventListener("pointermove",a=>{if(e.has(a.pointerId)){if(e.set(a.pointerId,{x:a.clientX,y:a.clientY}),n==="orbit"&&i){const l=a.clientX-i.x,c=a.clientY-i.y;this.goal.yaw-=l*.005,this.goal.pitch=Ee.clamp(this.goal.pitch+c*.004,.06,1.52),i={x:a.clientX,y:a.clientY},this.touch()}else if(n==="pan"&&i){const l=a.clientX-i.x,c=a.clientY-i.y;(l||c)&&(this.panBy(l,c),this.touch()),i={x:a.clientX,y:a.clientY}}else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=r.dist/Math.max(20,l.dist);this.zoomAt(l.cx,l.cy,c),this.panBy(l.cx-r.cx,l.cy-r.cy),this.goal.yaw-=Go(l.angle-r.angle),r=l,this.touch()}}});const o=a=>{if(e.delete(a.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="pan",i={...l}}};t.addEventListener("pointerup",o),t.addEventListener("pointercancel",o),t.addEventListener("wheel",a=>{if(!this.enabled)return;a.preventDefault();const l=a.deltaMode===1?a.deltaY*30:a.deltaY,c=Math.exp(Math.sign(l)*Math.min(Math.abs(l),150)*.0022);this.zoomAt(a.clientX,a.clientY,c),this.touch()},{passive:!1}),t.addEventListener("dblclick",a=>{const l=this.pickGround(a.clientX,a.clientY);if(l){const c=Math.max(this.minDistance,this.goal.distance*.35);this.flyTo({target:l,distance:c,pitch:this.goal.pitch+Ln(c)-Ln(this.goal.distance)},1.8)}}),addEventListener("keydown",a=>{var f,m;if(!this.enabled||(m=(f=a.target).closest)!=null&&m.call(f,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[a.code];if(c&&!a.altKey){const v=Math.sin(this.goal.yaw),g=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*g+c[1]*v)*l,this.goal.target.z+=(-c[0]*v+c[1]*g)*l,this.touch()}a.code==="KeyQ"&&(this.goal.yaw+=.12),a.code==="KeyE"&&(this.goal.yaw-=.12);const h=innerWidth/2,d=innerHeight/2;(a.code==="Equal"||a.code==="NumpadAdd")&&this.zoomAt(h,d,.8),(a.code==="Minus"||a.code==="NumpadSubtract")&&this.zoomAt(h,d,1.25)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,r=Math.sin(this.goal.yaw),o=Math.cos(this.goal.yaw),a=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*o-e*r*a)*i,this.goal.target.z+=(t*r-e*o*a)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),r=this.goal.distance,o=Ee.clamp(r*n,this.minDistance,this.maxDistance);if(i){const a=1-o/r;this.goal.target.x+=(i.x-this.goal.target.x)*a,this.goal.target.z+=(i.z-this.goal.target.z)*a}this.goal.pitch=Ee.clamp(this.goal.pitch+Ln(o)-Ln(r),.06,1.52),this.goal.distance=o}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Ct((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e){const n=this.world,i=n.maxY+.05;if(e.y>=0&&t.y>i)return null;const r=e.y<0?t.y/-e.y:4e5;let o=t.y>i&&e.y<0?(t.y-i)/-e.y:0;const a=Math.min(r,4e5),l=this._v;let c=o;for(let h=0;h<700&&o<=a+.001;h++){l.copy(t).addScaledVector(e,o);const d=l.y-n.heightAt(l.x,l.z);if(d<0){let f=c,m=o;for(let v=0;v<24;v++){const g=(f+m)/2;l.copy(t).addScaledVector(e,g),l.y-n.heightAt(l.x,l.z)<0?m=g:f=g}return l.clone()}c=o,o+=Math.max(.02,d*.45,o*.0015)}return r<4e5?t.clone().addScaledVector(e,r).setY(0):null}fit({rect:t,distance:e,yaw:n=this.goal.yaw,tilt:i=0,box:r,pad:o=1.06}){const a=this._fitCam||(this._fitCam=new Fe);a.fov=this.camera.fov,a.aspect=this.camera.aspect,a.near=.1,a.far=1e6,a.updateProjectionMatrix();const l=innerWidth,c=innerHeight,h=r||{x0:0,y0:0,x1:l,y1:c},d=Math.max(60,h.x1-h.x0),f=Math.max(60,h.y1-h.y0),m=Math.tan(a.fov*Math.PI/360),v=Math.cos(n),g=Math.sin(n);let p=(t.x0+t.x1)/2,u=(t.z0+t.z1)/2;const y=e!==void 0;let x=y?e:Math.max(t.x1-t.x0,t.z1-t.z0)/(2*m)*(c/f),E=0;const R=this._v;for(let T=0;T<8;T++){x=Ee.clamp(x,this.minDistance,this.maxDistance),E=Ee.clamp(Ln(x)+i,.06,1.52);const A=Math.cos(E),N=y?this.world.heightAt(p,u):0;a.position.set(p+x*A*g,N+x*Math.sin(E),u+x*A*v),a.lookAt(p,N,u),a.updateMatrixWorld();let _=1/0,M=1/0,P=-1/0,U=-1/0;for(let G=0;G<4;G++){R.set(G&1?t.x1:t.x0,N,G&2?t.z1:t.z0).project(a);const q=(R.x+1)/2*l,W=(1-R.y)/2*c;_=Math.min(_,q),P=Math.max(P,q),M=Math.min(M,W),U=Math.max(U,W)}y||(x*=Ee.clamp(Math.max((P-_)*o/d,(U-M)*o/f),.3,3));const V=2*x*m/c,L=((_+P)/2-(h.x0+h.x1)/2)*V,F=((M+U)/2-(h.y0+h.y1)/2)*V/Math.max(.35,Math.sin(E));p+=L*v+F*g,u+=-L*g+F*v}return{target:new D(p,this.world.heightAt(p,u),u),distance:x,yaw:n,pitch:E}}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift},r={target:t.target?t.target.clone():i.target.clone(),distance:Ee.clamp(t.distance??i.distance,this.minDistance,this.maxDistance),yaw:t.yaw??i.yaw,pitch:Ee.clamp(t.pitch??i.pitch,.06,1.52),lift:t.lift??0};r.yaw=i.yaw+Go(r.yaw-i.yaw);const o=Math.hypot(i.target.x-r.target.x,i.target.z-r.target.z),a=n.hop??Math.max(0,o*.9-Math.max(i.distance,r.distance)*.6);this.flight={from:i,dest:r,t:0,duration:e,hop:a,onDone:n.onDone}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,(e=t.onDone)==null||e.call(t),this.apply()}jump({x:t,z:e,distance:n,yaw:i,pitch:r}){this.flight=null;for(const o of[this.goal,this.state])t!==void 0&&o.target.set(t,this.world.heightAt(t,e),e),n!==void 0&&(o.distance=n),i!==void 0&&(o.yaw=i),r!==void 0&&(o.pitch=r),o.lift=0;this.apply()}update(t){var a;const e=this.goal;if(this.flight){const l=this.flight;l.t=Math.min(1,l.t+t/l.duration);const c=x0(l.t);e.target.lerpVectors(l.from.target,l.dest.target,c);const h=Math.log(l.from.distance)*(1-c)+Math.log(l.dest.distance)*c;e.distance=Math.exp(h)+l.hop*Math.sin(Math.PI*c),e.yaw=l.from.yaw+(l.dest.yaw-l.from.yaw)*c,e.pitch=l.from.pitch+(l.dest.pitch-l.from.pitch)*c+.2*Math.sin(Math.PI*c)*Math.min(1,l.hop/300),e.pitch=Math.min(1.52,e.pitch),e.lift=l.from.lift+(l.dest.lift-l.from.lift)*c,l.t>=1&&(this.flight=null,(a=l.onDone)==null||a.call(l))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);const n=this.world.bounds,i=150;if(e.target.x=Ee.clamp(e.target.x,n.x0-i,n.x1+i),e.target.z=Ee.clamp(e.target.z,n.z0-i,n.z1+i),this.flight)e.target.y=Math.max(e.target.y,this.world.heightAt(e.target.x,e.target.z));else{const l=this.world.heightAt(e.target.x,e.target.z);e.target.y+=(l-e.target.y)*(1-Math.exp(-t*6))}const r=this.state,o=this.flight?1:1-Math.exp(-t*7);r.target.lerp(e.target,o),r.distance=Math.exp(Math.log(r.distance)+(Math.log(e.distance)-Math.log(r.distance))*o),r.yaw+=(e.yaw-r.yaw)*o,r.pitch+=(e.pitch-r.pitch)*o,r.lift+=(e.lift-r.lift)*o,this.apply(t)}groundAhead(t,e,n){const i=this.world;let r=i.heightAt(t,e);const o=this._prevXZ;if(o&&n>0){const a=(t-o.x)/n,l=(e-o.y)/n,c=Math.hypot(a,l),h=Math.min(20,c*.3);h>.005&&(r=Math.max(r,i.heightAt(t+a/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new Ct).set(t,e),r}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const r=.12+e.distance*.03,o=this.groundAhead(n.position.x,n.position.z,t),a=Math.max(0,o+r-n.position.y);t<=0?this.floor=a:this.floor+=(a-this.floor)*(1-Math.exp(-t*(a>this.floor?9:2.5))),n.position.y+=this.floor;const l=this.world.heightAt(n.position.x,n.position.z);n.position.y=Math.max(n.position.y,l+Math.min(.04,r*.3)),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const c=n.position.y-l;n.near=Ee.clamp(Math.min(c,e.distance)*.12,.02,300),n.far=Ee.clamp(e.distance*30+c*60,8e3,3e5),n.updateProjectionMatrix(),n.updateMatrixWorld()}}const S0=1.5,E0=`
${_i}
${xi}
${Jr}
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
`,b0=`
uniform vec3 uColor;
uniform float uOpacity;
in float vFade;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vFade);
}
`;function w0(s){return s?s.type==="Polygon"?s.coordinates:s.type==="MultiPolygon"?s.coordinates.flat():s.type==="LineString"?[s.coordinates]:s.type==="MultiLineString"?s.coordinates:[]:[]}function T0(s,t){var r;const e=new Map,n=new Set,i=o=>Math.round(o*1e6);for(const o of(s==null?void 0:s.features)||[]){const a=ds((r=o.properties)==null?void 0:r.island)||"other";let l=e.get(a);l||e.set(a,l=[]);for(const c of w0(o.geometry))for(let h=0;h+1<c.length;h++){const d=c[h],f=c[h+1],m=`${i(d[0])},${i(d[1])}`,v=`${i(f[0])},${i(f[1])}`;if(m===v)continue;const g=m<v?`${m}|${v}`:`${v}|${m}`;if(n.has(g))continue;n.add(g);const[p,u]=t.toWorld(d),[y,x]=t.toWorld(f),E=Math.max(1,Math.ceil(Math.hypot(y-p,x-u)/S0));for(let R=0;R<E;R++){const T=R/E,A=(R+1)/E;l.push(p+(y-p)*T,u+(x-u)*T,p+(y-p)*A,u+(x-u)*A)}}}return e}class Vo{constructor(t,e,n,{color:i,width:r,order:o}){this.group=new je,this.uniforms={...n,uResolution:{value:new Ct(1,1)},uWidth:{value:r},uCamPos:{value:new D},uColor:{value:new Rt(...i)},uOpacity:{value:1}},this.material=new ve({vertexShader:E0,fragmentShader:b0,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});const a=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);this.count=0;for(const[,l]of T0(t,e)){if(!l.length)continue;const c=new Zr;c.setAttribute("position",new ue(a,3)),c.setIndex([0,2,1,1,2,3]);const h=new Float32Array(l);c.setAttribute("aSeg",new Ts(h,4)),c.instanceCount=h.length/4,this.count+=c.instanceCount;let d=1/0,f=-1/0,m=1/0,v=-1/0;for(let u=0;u<h.length;u+=2)d=Math.min(d,h[u]),f=Math.max(f,h[u]),m=Math.min(m,h[u+1]),v=Math.max(v,h[u+1]);const g=new D((d+f)/2,60,(m+v)/2);c.boundingSphere=new gi(g,Math.hypot(f-d,v-m,300)/2+10);const p=new ge(c,this.material);p.renderOrder=o,this.group.add(p)}}update(t,e,n){this.uniforms.uResolution.value.copy(e),this.uniforms.uCamPos.value.copy(t.position),this.uniforms.uOpacity.value=n,this.group.visible=n>.01&&this.count>0}}class A0{constructor(t,e){this.group=new je,this.moku=new Vo(t.moku,t.proj,e,{color:[1.5,1.08,.52],width:2.2,order:3}),this.ahupuaa=new Vo(t.ahupuaa,t.proj,e,{color:[1.25,1.2,1.06],width:1.3,order:2}),this.group.add(this.ahupuaa.group,this.moku.group),this.visible=!0,this._res=new Ct}update(t,e,n,i=1){e.getDrawingBufferSize(this._res);const r=e.getPixelRatio(),o=this.visible?1:0,a=(l,c,h)=>{const d=Math.max(0,Math.min(1,(h-l)/(c-l)));return d*d*(3-2*d)};this.moku.uniforms.uWidth.value=(1.3+1.1*(1-a(800,4e3,n)))*r,this.ahupuaa.uniforms.uWidth.value=1.25*r,this.moku.uniforms.uColor.value.setRGB(1.5*i,1.08*i,.52*i),this.ahupuaa.uniforms.uColor.value.setRGB(1.25*i,1.2*i,1.06*i),this.moku.update(t,this._res,o*(.55+.4*(1-a(1500,6e3,n)))),this.ahupuaa.update(t,this._res,o*.75*(1-a(220,650,n)))}}const R0=4,Wo=[300,1e3],Xo=[.4,.7],C0=9,$o={voyage:[1.38,1.18,.86],fleet:[1.6,.9,.52],ship:[1,1.1,1.26],trade:[1.15,1.1,.96],schematic:[1.25,1.18,1.02]},qo={journal:{width:2,opacity:.92,pulse:1},narrative:{width:1.7,opacity:.82,pulse:.9},schematic:{width:1.4,opacity:.62,pulse:.45}},L0={day:0,month:0,year:0,decade:5,generation:12,century:50},Mr=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},P0=`
${_i}
${xi}
${Jr}
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
`,D0=`
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
`;function U0(s){const t=s.when||{},e=(o,a)=>{const l=String(o??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!l)return null;const c=Number(l[1]);return l[2]?c+(Number(l[2])-1+(a?1:0))/12:c+(a?1:0)};let n=e(t.from,!1),i=e(t.to??t.from,!0);if(n===null&&i===null)return null;n===null&&(n=i-1),i===null&&(i=n+1);const r=L0[t.precision]??0;return r&&i-n<=1.01&&(n-=r,i+=r),[n,i]}async function I0(s,t=console.warn){const e=s!=null&&s.abs?s.abs("routes.json"):new URL("routes.json",new URL((s==null?void 0:s.base)||"./data/",location.href)).href;try{const n=await fetch(e);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json();return Array.isArray(i)?i:Array.isArray(i==null?void 0:i.routes)?i.routes:[]}catch(n){return t(`${e}: ${n.message} (no routes)`),[]}}class N0{constructor(t,e,n){this.route=t,this.span=U0(t);const i=qo[t.pointPrecision]?t.pointPrecision:"schematic";this.style=qo[i],this.ret=t.direction==="return";const r=i==="schematic",o=new Set(t.schematicSegments||[]),a=(t.points||[]).map(x=>e.toWorld(x)),l=[],c=[];let h=0;for(let x=0;x+1<a.length;x++){const[E,R]=a[x],[T,A]=a[x+1],N=Math.hypot(T-E,A-R),_=Math.max(1,Math.ceil(N/R0)),M=r||o.has(x)?1:0;for(let P=0;P<_;P++){const U=P/_,V=(P+1)/_;l.push(E+(T-E)*U,R+(A-R)*U,E+(T-E)*V,R+(A-R)*V),c.push(h+N*U,h+N*V,M,0)}h+=N}this.total=h;const d=(x,E,R)=>{l.push(x[0],x[1],E[0],E[1]),c.push(R,R,0,1)};a.length>=2&&(d(a.at(-2),a.at(-1),h),this.ret&&d(a[1],a[0],0));const f=new Zr;f.setAttribute("position",new ue(new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),3)),f.setIndex([0,2,1,1,2,3]);const m=new Float32Array(l);f.setAttribute("aSeg",new Ts(m,4)),f.setAttribute("aInfo",new Ts(new Float32Array(c),4)),f.instanceCount=m.length/4;let v=1/0,g=-1/0,p=1/0,u=-1/0;for(const[x,E]of a)v=Math.min(v,x),g=Math.max(g,x),p=Math.min(p,E),u=Math.max(u,E);f.boundingSphere=new gi(new D((v+g)/2,60,(p+u)/2),Math.hypot(g-v,u-p,300)/2+20),this.geometry=f;const y=$o[t.kind]||$o.schematic;this.colour=y,this.uniforms={...n,uResolution:{value:new Ct(1,1)},uWidth:{value:this.style.width},uHead:{value:9},uCamPos:{value:new D},uColor:{value:new Rt(...y)},uOpacity:{value:0},uDashLen:{value:30},uMarch:{value:0},uPulse:{value:-1e6},uPulseLen:{value:60},uPulseK:{value:this.style.pulse}},this.material=new ve({vertexShader:P0,fragmentShader:D0,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),this.mesh=new ge(f,this.material),this.mesh.renderOrder=4,this.mesh.visible=!1,this.k=0,this.phase=F0(t.id||"")%1e3/1e3}dispose(){this.geometry.dispose(),this.material.dispose()}}function F0(s){let t=2166136261;for(let e=0;e<s.length;e++)t=Math.imul(t^s.charCodeAt(e),16777619);return t>>>0}class O0{constructor({routes:t=[],proj:e,uniforms:n,camera:i,renderer:r,eras:o=[]}){this.proj=e,this.shared=n,this.camera=i,this.renderer=r,this.eras=[...o].filter(a=>Number.isFinite(a.year)).sort((a,l)=>a.year-l.year),this.group=new je,this.group.name="routes",this.lines=[],this.visible=!0,this._res=new Ct,this._last=null,this.setRoutes(t)}setRoutes(t){for(const e of this.lines)this.group.remove(e.mesh),e.dispose();this.lines=[];for(const e of t||[]){if(!Array.isArray(e.points)||e.points.length<2)continue;const n=new N0(e,this.proj,this.shared);n.span&&(this.lines.push(n),this.group.add(n.mesh))}}windowAt(t){const e=this.eras;if(e.length<2)return[t-10,t+10];const n=r=>{if(r<=0)return e[0].year+r*(e[1].year-e[0].year);const o=e.length-1;if(r>=o)return e[o].year+(r-o)*(e[o].year-e[o-1].year);const a=Math.floor(r);return e[a].year+(r-a)*(e[a+1].year-e[a].year)};let i=0;if(t>=e.at(-1).year)i=e.length-1;else if(t>e[0].year){for(let r=0;r+1<e.length;r++)if(t<=e[r+1].year){i=r+(t-e[r].year)/Math.max(1e-6,e[r+1].year-e[r].year);break}}return[n(i-.5),n(i+.5)]}visibleRoutes(){return this.lines.filter(t=>t.k>.5&&t.mesh.visible).map(t=>t.route)}update(t,e,{window:n,light:i=1,fill:r=0,focus:o=null}={}){const a=performance.now()/1e3,l=this._last===null?1:Math.max(0,Math.min(.1,a-this._last));this._last=a,this.apply(t,e,{win:n,light:i,fill:r,focus:o},a,1-Math.exp(-l*4))}settle(t,e,{window:n,light:i=1,fill:r=0,focus:o=null}={}){this.apply(t,e,{win:n,light:i,fill:r,focus:o},performance.now()/1e3,1)}apply(t,e,{win:n,light:i,fill:r,focus:o},a,l){const[c,h]=n||this.windowAt(t);this.renderer.getDrawingBufferSize(this._res);const d=this.renderer.getPixelRatio(),f=this.visible?Mr(Wo[0],Wo[1],e):0,m=1-Mr(Xo[0],Xo[1],r),v=1-Mr(800,4e3,e);for(const g of this.lines){const[p,u]=g.span,y=u>=c&&p<=h?1:0;g.k+=(y-g.k)*l,Math.abs(y-g.k)<.003&&(g.k=y);const x=t>=p&&t<=u?1:.55,E=o!==null&&g.route.event===o,R=g.style.opacity*g.k*f*(E?1:m)*x;if(g.mesh.visible=R>.01,!g.mesh.visible)continue;const T=g.uniforms;T.uResolution.value.copy(this._res),T.uCamPos.value.copy(this.camera.position),T.uWidth.value=(g.style.width+.6*v)*d,T.uHead.value=(8+3*v)*d,T.uOpacity.value=R,T.uColor.value.setRGB(g.colour[0]*i,g.colour[1]*i,g.colour[2]*i),T.uDashLen.value=e*.016,T.uPulseLen.value=Math.min(g.total*.12,e*.035);const A=(a/C0+g.phase)%1;T.uPulse.value=g.ret?(A<.5?A*2:2-A*2)*g.total:A*g.total,T.uMarch.value=g.ret?0:a*e*.012%(e*.016)}}dispose(){for(const t of this.lines)t.dispose();this.lines=[],this.group.clear()}}const cs=s=>String(s||"").normalize("NFD").replace(/[̀-ͯʻʼ'‘’]/g,"").toLowerCase();function z0(s,t,e,n,i,r){const o=t/(n.x1-n.x0),a=e/(n.z1-n.z0),l=[];let c=1/0,h=-1/0;for(const g of i)for(let p=0;p+1<g.length;p++){const u=(g[p][0]-n.x0)*o,y=(g[p][1]-n.z0)*a,x=(g[p+1][0]-n.x0)*o,E=(g[p+1][1]-n.z0)*a;y!==E&&(l.push(y<E?[y,u,E,x]:[E,x,y,u]),c=Math.min(c,y,E),h=Math.max(h,y,E))}if(!l.length)return;l.sort((g,p)=>g[0]-p[0]);const d=[],f=Math.max(0,Math.floor(c)),m=Math.min(e-1,Math.ceil(h));let v=0;for(let g=f;g<=m;g++){const p=g+.5;for(d.length=0;v<l.length&&l[v][2]<=p&&l[v][0]<=p;)v++;for(let y=v;y<l.length;y++){const x=l[y];if(x[0]>p)break;x[2]<=p||d.push(x[1]+(p-x[0])/(x[2]-x[0])*(x[3]-x[1]))}d.sort((y,x)=>y-x);const u=g*t;for(let y=0;y+1<d.length;y+=2){const x=Math.max(0,Math.ceil(d[y]-.5)),E=Math.min(t-1,Math.floor(d[y+1]-.5));for(let R=x;R<=E;R++)s[u+R]=r}}}class B0{constructor(t,e,n,i=console.warn){var d,f;this.data=t,this.rect=e,this.uniforms=n,this.polities=new Map((t.polities.polities||[]).map(m=>[m.id,m]));const r=(((d=t.moku)==null?void 0:d.features)||[]).slice(0,255);(((f=t.moku)==null?void 0:f.features)||[]).length>255&&i("more than 255 moku: the overlay shows the first 255");const o=e.x1-e.x0,a=e.z1-e.z0,l=Math.min(4096,Math.ceil(Math.max(o,a)/1.5));this.W=Math.round(o>=a?l:l*o/a),this.H=Math.round(o>=a?l*a/o:l),this.grid=new Uint8Array(this.W*this.H),this.mokus=[null],r.forEach((m,v)=>{const g=m.properties||{},p=g.name??g.moku??"",u=g.islandId||ds(g.island),y=m.geometry,x=(y==null?void 0:y.type)==="Polygon"?[y.coordinates]:(y==null?void 0:y.type)==="MultiPolygon"?y.coordinates:[];for(const E of x)z0(this.grid,this.W,this.H,e,E.map(R=>R.map(T=>t.proj.toWorld(T))),v+1);this.mokus.push({index:v+1,name:p,island:g.island,islandKey:u,key:g.mokuKey||`${u}:${p}`,props:g})}),this.loose=new Map(this.mokus.slice(1).map(m=>[`${m.islandKey}:${cs(m.name)}`,m])),this.checkKeys(i);const c=new fi(this.grid,this.W,this.H,Ps,Re);c.minFilter=Jt,c.magFilter=Jt,c.unpackAlignment=1,c.needsUpdate=!0,this.idTex=c,this.palette=new Uint8Array(256*2*4);const h=new fi(this.palette,256,2,Te,Re);h.minFilter=Jt,h.magFilter=Jt,h.needsUpdate=!0,this.palTex=h,n.uMokuId.value=c,n.uMokuRect.value.set(e.x0,e.z0,e.x1,e.z1),n.uPalette.value=h,this.eraKeys=[null,null]}checkKeys(t){const e=new Set(this.mokus.slice(1).map(i=>i.key)),n=new Set;for(const[i,r]of Object.entries(this.data.polities.byEra||{}))for(const o of Object.keys(r)){if(e.has(o))continue;const[a,...l]=o.split(":"),c=this.loose.get(`${ds(a)}:${cs(l.join(":"))}`);n.add(c?`${o} (${i}; the boundary file spells it "${c.name}")`:`${o} (${i})`)}n.size&&t(`polities.json names moku the boundary file doesn't have: ${[...n].slice(0,12).join(", ")}${n.size>12?", …":""}`)}holder(t,e){var r;const n=t?(r=this.data.polities.byEra)==null?void 0:r[t.id]:null;if(!n)return null;let i=n[e.key];if(i===void 0)for(const[o,a]of Object.entries(n)){const[l,...c]=o.split(":");if(ds(l)===e.islandKey&&cs(c.join(":"))===cs(e.name)){i=a;break}}return i?this.polities.get(i)||{id:i,name:i,colour:"#cccccc"}:null}setEras(t,e,n){const i=(t==null?void 0:t.id)??null,r=(e==null?void 0:e.id)??null;if(i!==this.eraKeys[0]||r!==this.eraKeys[1]){this.eraKeys=[i,r];const a=new Rt;this.palette.fill(0);for(const[l,c]of[[0,t],[1,e]])for(const h of this.mokus.slice(1)){const d=this.holder(c,h);if(!d)continue;a.set(d.colour||"#cccccc");const f=(l*256+h.index)*4;this.palette[f]=Math.round(a.r*255),this.palette[f+1]=Math.round(a.g*255),this.palette[f+2]=Math.round(a.b*255),this.palette[f+3]=255}this.palTex.needsUpdate=!0}const o=Math.max(0,Math.min(1,(n-.35)/.3));this.uniforms.uEraMix.value=t===e?0:o*o*(3-2*o)}mokuAt(t,e){const n=this.rect,i=Math.floor((t-n.x0)/(n.x1-n.x0)*this.W),r=Math.floor((e-n.z0)/(n.z1-n.z0)*this.H);return i<0||r<0||i>=this.W||r>=this.H?null:this.mokus[this.grid[r*this.W+i]]||null}politiesIn(t){const e=new Map;for(const n of this.mokus.slice(1)){const i=this.holder(t,n);i&&e.set(i.id,i)}return[...e.values()]}}function Wl(s=2,t=5e4){const e=Math.log(1+t/s),n=new Float32Array(256);for(let i=0;i<256;i++)n[i]=s*(Math.exp(i/255*e)-1);return{lut:n,decode:i=>s*(Math.exp(i/255*e)-1),encode:i=>Math.max(0,Math.min(255,Math.round(255*Math.log(1+Math.max(0,i)/s)/e)))}}const k0=s=>Math.max(1,Math.round(60/Math.max(1,s)));async function yr(s,t){const{arch:e}=s,n=Wl(s.d0,s.dMax),i=e.W,r=e.H,o=e.rect,a=s.islands,l=new Int8Array(i*r).fill(-1),c=(o.x1-o.x0)/i,h=(o.z1-o.z0)/r;for(let g=0;g<r;g++){const p=o.z0+(g+.5)*h;for(let u=0;u<i;u++){const y=o.x0+(u+.5)*c;let x=0,E=-1;for(let R=0;R<a.length;R++){const T=a[R].rect,A=Math.min(y-T.x0,T.x1-y,p-T.z0,T.z1-p);A>x&&(x=A,E=R)}l[g*i+u]=E}}const d=new Float32Array(i*r*3),f=new Float32Array(i*r),m={kf:s.kf,arch:null,islands:[]};for(let g=0;g<a.length;g++){const p=a[g],{W:u,H:y}=p,[x,E,R]=await Promise.all(["cultivation","settlement","forest"].map(U=>H0(p.layers[U],u,y,t,`${p.id} ${U}`))),T=p.land&&p.land.length===u*y?p.land:null,A=p.rect,N=(A.x1-A.x0)/u,_=(A.z1-A.z0)/y,M=new Int32Array(u);for(let U=0;U<u;U++)M[U]=Math.floor((A.x0+(U+.5)*N-o.x0)/c);for(let U=0;U<y;U++){const V=Math.floor((A.z0+(U+.5)*_-o.z0)/h);if(V<0||V>=r)continue;const L=U*u;for(let F=0;F<u;F++){const G=M[F];if(G<0||G>=i)continue;const q=V*i+G;if(l[q]!==g)continue;const W=L+F;T&&!T[W]||(d[q*3]+=x[W],d[q*3+1]+=n.lut[E[W]],d[q*3+2]+=R[W],f[q]++)}}const P=Math.max(1,p.f||1);if(P===1){const U=new Uint8Array(u*y*4);for(let V=0;V<u*y;V++)U[V*4]=x[V],U[V*4+1]=E[V],U[V*4+2]=R[V],U[V*4+3]=255;T&&Sr(U,u,y,T,2),m.islands.push({id:p.id,W:u,H:y,data:U})}else{const U=Math.max(1,Math.round(u/P)),V=Math.max(1,Math.round(y/P)),L=new Float32Array(U*V*3),F=new Float32Array(U*V),G=new Int32Array(u);for(let W=0;W<u;W++)G[W]=Math.min(U-1,Math.floor((W+.5)*U/u));for(let W=0;W<y;W++){const $=Math.min(V-1,Math.floor((W+.5)*V/y))*U;for(let Y=0;Y<u;Y++){const J=W*u+Y;if(T&&!T[J])continue;const rt=$+G[Y];L[rt*3]+=x[J],L[rt*3+1]+=n.lut[E[J]],L[rt*3+2]+=R[J],F[rt]++}}const q=Yo(L,F,U*V,n);Sr(q,U,V,F,2),m.islands.push({id:p.id,W:U,H:V,data:q})}}const v=Yo(d,f,i*r,n);return Sr(v,i,r,f,3),m.arch={W:i,H:r,data:v},m}function Sr(s,t,e,n,i){let r=Uint8Array.from(n,o=>o?1:0);for(let o=0;o<i;o++){const a=r.slice();for(let l=0;l<e;l++)for(let c=0;c<t;c++){const h=l*t+c;if(r[h])continue;let d=0,f=0,m=0,v=0;const g=p=>{r[p]&&(d++,f+=s[p*4],m+=s[p*4+1],v+=s[p*4+2])};c>0&&g(h-1),c<t-1&&g(h+1),l>0&&g(h-t),l<e-1&&g(h+t),d&&(s[h*4]=Math.round(f/d),s[h*4+1]=Math.round(m/d),s[h*4+2]=Math.round(v/d),a[h]=1)}r=a}}function Yo(s,t,e,n){const i=new Uint8Array(e*4);for(let r=0;r<e;r++){const o=t[r];i[r*4+3]=255,o&&(i[r*4]=Math.round(s[r*3]/o),i[r*4+1]=n.encode(s[r*3+1]/o),i[r*4+2]=Math.round(s[r*3+2]/o))}return i}async function H0(s,t,e,n,i){if(!s)return new Uint8Array(t*e);if(typeof s=="string")return Er(await n(s),t,e,s);const[r,o]=await Promise.all([n(s.from),n(s.to)]),a=Er(r,t,e,s.from),l=Er(o,t,e,s.to),c=s.t,h=new Uint8Array(t*e);for(let d=0;d<t*e;d++)h[d]=Math.round(a[d]+(l[d]-a[d])*c);return h}function Er(s,t,e,n){if(s.W!==t||s.H!==e)throw new Error(`${n} is ${s.W}×${s.H}, the pack is ${t}×${e}`);return s.px}async function jo(s,t){const{px:e,W:n,H:i}=await s(t),r=new Uint8Array(n*i);for(let o=0,a=0;o<n*i;o++,a+=4)r[o]=e[a];return{px:r,W:n,H:i}}const Ko=["cultivation","settlement","forest"],G0={cultivation:"Cultivation",settlement:"Settlement",forest:"Native forest"},wi=[1100,1450],V0=3,hs=.002,W0=10,si=(s,t,e)=>Math.max(t,Math.min(e,s)),Zo=(s,t,e)=>{const n=si((e-s)/(t-s),0,1);return n*n*(3-2*n)};function X0(){const s=new fi(new Uint8Array([0,0,0,255]),1,1,Te,Re);return s.needsUpdate=!0,s}function $0(s){var n;const t=(n=s.data)==null?void 0:n.metres;if(!t)return null;const e=new Uint8Array(t.length);for(let i=0;i<t.length;i++)e[i]=t[i]>0?1:0;return e}function Jo(s,t,e,n){const i=new fi(s,t,e,Te,Re);return i.minFilter=On,i.magFilter=me,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=Ce,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class q0{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.blank=X0();const e=t.shared.uniforms;Object.assign(e,{uArchLandA:{value:this.blank},uArchLandB:{value:this.blank},uLandT:{value:0},uLandK:{value:0},uLandEarly:{value:1}}),this.uniforms=e,this.available=null,this.manifest=null,this.keyframes=[],this.resident=new Map,this.loading=new Map,this.bound=null,this.swapTo=null,this.kpShown=0,this.fade=0,this.fadeGoal=0,this.listeners=[],this.chain=Promise.resolve(),this.jobN=0,this.uploads=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){var o;const t=this.data.abs("layers/manifest.json");let e;try{const a=await fetch(t);if(!a.ok)throw new Error(`HTTP ${a.status}`);if(e=await a.json(),!Array.isArray(e==null?void 0:e.keyframes)||!e.keyframes.length||!e.islands)throw new Error("no keyframes or islands")}catch(a){this.available=!1,this.warn(`${t}: ${a.message} (no land layers)`),this.notify();return}this.manifest=e,this.keyframes=[...e.keyframes].filter(a=>Number.isFinite(a.year)).sort((a,l)=>a.year-l.year),this.kfIndex=new Map(this.keyframes.map((a,l)=>[a.id,l]));const n=((o=e.encoding)==null?void 0:o.settlement)||{};this.codec=Wl(n.d0??2,n.dMax??5e4);const i=this.app.world;this.islands=i.islandPacks.filter(a=>e.islands[a.id]).map(a=>({pack:a,entry:e.islands[a.id]}));const r=i.archPack;this.arch={W:Math.max(1,Math.round(r.W/2)),H:Math.max(1,Math.round(r.H/2)),rect:r.rect},this.eraYears=this.app.timeline.eras.map(a=>this.eraYear(a)),this.available=!0,this.notify()}eraYear(t){var i,r;const e=(r=(i=this.manifest.eras)==null?void 0:i[t.id])==null?void 0:r.cultivation,n=o=>{var a;return(a=this.keyframes[this.kfIndex.get(o)])==null?void 0:a.year};return e!=null&&e.keyframe&&n(e.keyframe)!==void 0?n(e.keyframe):e!=null&&e.from&&n(e.from)!==void 0&&n(e.to)!==void 0?n(e.from)+(n(e.to)-n(e.from))*(e.t??0):t.year}kpAtYear(t){const e=this.keyframes;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}position(t=this.app.timeline.s){const e=this.eraYears;if(!(e!=null&&e.length))return 0;const n=si(t,0,e.length-1),i=Math.min(e.length-2,Math.floor(n));return i<0?this.kpAtYear(e[0]):this.kpAtYear(e[i]+(e[i+1]-e[i])*(n-i))}bracket(t){const e=this.keyframes.length,n=a=>this.keyframes[a].id;if(e<2)return{a:n(0),b:n(0),t:0,need:[n(0)]};const i=si(Math.floor(t),0,e-2),r=si(t-i,0,1),o=r<hs?[n(i)]:r>1-hs?[n(i+1)]:[n(i),n(i+1)];return{a:n(i),b:n(i+1),t:r,need:o}}covers(t,e){return t?e>=this.kfIndex.get(t.a)-hs&&e<=this.kfIndex.get(t.b)+hs:!1}clampTo(t,e){return si(e,this.kfIndex.get(t.a),this.kfIndex.get(t.b))}job(t){var a;const e=this.keyframes,n=this.kfIndex.get(t),i=l=>this.data.abs(`layers/${l}`),r=(l,c)=>{const h=m=>{var v,g,p;return(p=(g=(v=l.layers)==null?void 0:v[e[m].id])==null?void 0:g[c])==null?void 0:p.file};if(h(n))return i(h(n));let d=n-1;for(;d>=0&&!h(d);)d--;let f=n+1;for(;f<e.length&&!h(f);)f++;return d>=0&&f<e.length?{from:i(h(d)),to:i(h(f)),t:(e[n].year-e[d].year)/(e[f].year-e[d].year)}:d>=0?i(h(d)):f<e.length?i(h(f)):null},o=((a=this.manifest.encoding)==null?void 0:a.settlement)||{};return{kf:t,d0:o.d0??2,dMax:o.dMax??5e4,arch:this.arch,islands:this.islands.map(({pack:l,entry:c})=>({id:l.id,W:l.W,H:l.H,f:k0(Math.max(l.mx,l.mz)),rect:l.rect,land:$0(l),layers:Object.fromEntries(Ko.map(h=>[h,r(c,h)]))}))}}request(t){const e=this.chain=this.chain.catch(()=>{}).then(()=>{if(!this.wanted(t))return null;const n=performance.now();return this.run(this.job(t)).then(i=>{this.arrive(i),this.lastBakeMs=Math.round(performance.now()-n)})}).catch(n=>this.warn(`land layers ${t}: ${n.message}`)).finally(()=>{this.loading.delete(t)});return this.loading.set(t,e),e}wanted(t){var n,i;const e=this.bracket(this.position());return this.bound&&this.app.view!=="land"?!1:e.need.includes(t)||((n=this.swapTo)==null?void 0:n.a)===t||((i=this.swapTo)==null?void 0:i.b)===t}run(t){const e=n=>jo(vs,n);if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("layers-worker-OijIdfIP.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=n=>this.reply(n.data),this.worker.onerror=n=>{var r;(r=n.preventDefault)==null||r.call(n),this.fallback=!0;const i=this.pending;this.pending=null,i&&yr(i.job,e).then(i.resolve,i.reject)}}catch{this.fallback=!0}return this.fallback?yr(t,e):new Promise((n,i)=>{const r=++this.jobN;this.pending={id:r,job:t,resolve:n,reject:i},this.worker.postMessage({...t,job:r})})}reply(t){const e=this.pending;!e||t.job!==e.id||(this.pending=null,t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,yr(e.job,n=>jo(vs,n)).then(e.resolve,e.reject)):e.reject(new Error(t.message)))}arrive(t){const e=Math.min(4,this.app.renderer.capabilities.getMaxAnisotropy()),n={id:t.kf,arch:Jo(t.arch.data,t.arch.W,t.arch.H,e),archData:t.arch.data,islands:new Map(t.islands.map(i=>[i.id,Jo(i.data,i.W,i.H,e)])),texels:t.arch.W*t.arch.H+t.islands.reduce((i,r)=>i+r.W*r.H,0),used:performance.now()};this.resident.set(t.kf,n),this.uploads.push(n.arch,...n.islands.values())}dropUnused(){var n,i,r,o;const t=performance.now(),e=new Set([(n=this.bound)==null?void 0:n.a,(i=this.bound)==null?void 0:i.b,(r=this.swapTo)==null?void 0:r.a,(o=this.swapTo)==null?void 0:o.b,...this.bracket(this.position()).need]);for(const[a,l]of this.resident){if(e.has(a)){l.used=t;continue}if(this.resident.size>V0||t-l.used>W0*1e3){l.arch.dispose();for(const c of l.islands.values())c.dispose();this.resident.delete(a),this.uploads=this.uploads.filter(c=>c!==l.arch&&![...l.islands.values()].includes(c))}}}resolve(t){const e=this.resident.has(t.a)?t.a:t.b;return{a:e,b:this.resident.has(t.b)?t.b:e}}bind(t){const{a:e,b:n}=this.resolve(t);this.bound={a:e,b:n};const i=this.resident.get(e),r=this.resident.get(n),o=this.uniforms;o.uArchLandA.value=i.arch,o.uArchLandB.value=r.arch;for(const a of this.app.world.islands)this.attach(a);this.notify()}attach(t){const e=t.uniforms;if(!e.uOwnLandA)return;const n=this.bound&&this.resident.get(this.bound.a),i=this.bound&&this.resident.get(this.bound.b);e.uOwnLandA.value=(n==null?void 0:n.islands.get(t.pack.id))||this.blank,e.uOwnLandB.value=(i==null?void 0:i.islands.get(t.pack.id))||this.blank}update(t,e){const n=this.uniforms;if(n.uLandEarly.value=Zo(wi[0],wi[1],this.app.timeline.year),!this.available){n.uLandK.value=0;return}const i=this.position(),r=this.bracket(i);if(this.app.view==="land"||e>.001||!this.bound)for(const c of r.need)!this.resident.has(c)&&!this.loading.has(c)&&this.request(c);const a=r.need.every(c=>this.resident.has(c));if(a&&!this.swapTo&&!this.covers(this.bound,i)&&(!this.bound||this.fade<.02?(this.bind(r),this.kpShown=this.clampTo(this.bound,i)):this.covers(this.resolve(r),this.kpShown)?this.bind(r):this.swapTo=r),this.swapTo?(this.fadeGoal=0,this.fade<.02&&(this.bind(a?r:this.swapTo),this.swapTo=null,this.kpShown=this.clampTo(this.bound,i))):this.fadeGoal=this.bound?1:0,this.bound){const c=this.clampTo(this.bound,i);this.kpShown+=(c-this.kpShown)*(1-Math.exp(-t*8)),Math.abs(c-this.kpShown)<1e-4&&(this.kpShown=c)}this.fade+=(this.fadeGoal-this.fade)*(1-Math.exp(-t*6)),Math.abs(this.fadeGoal-this.fade)<.003&&(this.fade=this.fadeGoal),this.apply(e),this.dropUnused();const l=this.uploads.shift();l!=null&&l.image.data&&this.app.renderer.initTexture(l)}apply(t){const e=this.uniforms;if(this.bound){const n=this.kfIndex.get(this.bound.a),i=this.kfIndex.get(this.bound.b);e.uLandT.value=i>n?si((this.kpShown-n)/(i-n),0,1):0}e.uLandK.value=t*this.fade}settle(t){if(!this.available)return;const e=this.position(),n=this.bracket(e);n.need.every(i=>this.resident.has(i))&&!this.covers(this.bound,e)&&this.bind(n),this.swapTo=null,this.bound&&(this.kpShown=this.clampTo(this.bound,e)),this.fade=this.fadeGoal=this.bound?1:0,this.uniforms.uLandEarly.value=Zo(wi[0],wi[1],this.app.timeline.year),this.apply(t)}get ready(){return!!this.available&&this.covers(this.bound,this.position())&&!this.swapTo&&this.fade>.99}describe(){if(!this.available)return null;const{a:t,b:e,need:n}=this.bracket(this.position()),i=this.keyframes,r=(c,h)=>{var v,g,p,u,y,x,E,R,T,A;const d=this.kfIndex.get(c),f=(p=(g=(v=this.manifest.methods)==null?void 0:v[c])==null?void 0:g[h])==null?void 0:p.method;if(f||(u=i[d].layers)!=null&&u.includes(h))return f?[f]:[];const m=[];for(let N=d-1;N>=0;N--){const _=(E=(x=(y=this.manifest.methods)==null?void 0:y[i[N].id])==null?void 0:x[h])==null?void 0:E.method;if(_){m.push(_);break}}for(let N=d+1;N<i.length;N++){const _=(A=(T=(R=this.manifest.methods)==null?void 0:R[i[N].id])==null?void 0:T[h])==null?void 0:A.method;if(_){m.push(_);break}}return m},o=Ko.map(c=>{const h=n.flatMap(f=>r(f,c)),d=h.includes("modelled")?"modelled":h.includes("mixed")?"partly modelled":"";return{id:c,name:G0[c],note:d}}),a=c=>i[this.kfIndex.get(c)].year;return{years:n.length>1?[a(t),a(e)]:[a(n[0])],layers:o,early:this.app.timeline.year<wi[1]}}valuesAt(t,e){if(!this.bound)return null;const n=this.resident.get(this.bound.a),i=this.resident.get(this.bound.b);if(!n||!i)return null;const{W:r,H:o,rect:a}=this.arch,l=Math.floor((t-a.x0)/(a.x1-a.x0)*r),c=Math.floor((e-a.z0)/(a.z1-a.z0)*o);if(l<0||c<0||l>=r||c>=o)return null;const h=(c*r+l)*4,d=this.uniforms.uLandT.value,f=m=>n.archData[h+m]+(i.archData[h+m]-n.archData[h+m])*d;return{cultivation:f(0)/255,people:this.codec.decode(f(1)),forest:f(2)/255}}stats(){let t=0,e=0;for(const n of this.resident.values())t+=n.texels,e+=n.archData.byteLength;return{available:this.available,resident:[...this.resident.keys()],bound:this.bound?`${this.bound.a}/${this.bound.b}`:null,t:+this.uniforms.uLandT.value.toFixed(3),k:+this.uniforms.uLandK.value.toFixed(3),gpuMB:+(t*4*4/3/1048576).toFixed(1),cpuMB:+(e/1048576).toFixed(1),bakeMs:this.lastBakeMs??null}}dispose(){var t;for(const e of this.resident.values()){e.arch.dispose();for(const n of e.islands.values())n.dispose()}this.resident.clear(),(t=this.worker)==null||t.terminate()}}function As(s,t=!1){if(s==null)return null;if(typeof s=="number")return s+(t?1:0);const e=String(s).match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!e)return null;const n=Number(e[1]);if(e[2]){const i=Number(e[2])-1+(t?1:0);return n+i/12}return n+(t?1:0)}const Y0={day:0,month:0,year:0,decade:5,generation:12,century:50};function Fr(s){const t=s.when||{};let e=As(t.from),n=As(t.to??t.from,!0);if(e===null&&n===null)return null;e===null&&(e=n-1),n===null&&(n=e+1);const i=Y0[t.precision]??0;return i&&n-e<=1.01&&(e-=i,n+=i),[e,n]}function Rs(s){const t=s.when||{};return As(t.from)??As(t.to)}const Xl=["generation","century","decade"];function $l(s){var e;const t=Rs(s);return t===null?"":Li(Math.floor(t),Xl.includes((e=s.when)==null?void 0:e.precision)?10:1)}function j0(s){const t=s.when||{},e=i=>{const r=String(i??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!r)return String(i??"");const o=["January","February","March","April","May","June","July","August","September","October","November","December"],a=Number(r[1]),l=a<0?`${-a} BCE`:String(a);return r[3]?`${Number(r[3])} ${o[Number(r[2])-1]} ${l}`:r[2]?`${o[Number(r[2])-1]} ${l}`:l},n=Xl.includes(t.precision)?"c. ":"";return!t.to||t.to===t.from?`${n}${e(t.from)}`:`${n}${e(t.from)} – ${e(t.to)}`}class K0{constructor(t){this.eras=[...t].filter(e=>Number.isFinite(e.year)).sort((e,n)=>e.year-n.year),this.s=0,this.listeners=[]}get n(){return this.eras.length}get max(){return Math.max(0,this.n-1)}yearAt(t){const e=this.eras;if(!e.length)return 1800;if(e.length===1)return e[0].year+t*50;if(t<=0)return e[0].year+t*(e[1].year-e[0].year);if(t>=e.length-1)return e[e.length-1].year+(t-e.length+1)*(e[e.length-1].year-e[e.length-2].year);const n=Math.floor(t);return e[n].year+(t-n)*(e[n+1].year-e[n].year)}sAtYear(t){const e=this.eras;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}get year(){return this.yearAt(this.s)}get era(){return this.eras[Math.round(Math.max(0,Math.min(this.max,this.s)))]||null}get pair(){const t=Math.max(0,Math.min(this.max,this.s)),e=Math.floor(t),n=Math.min(this.max,e+1);return{a:this.eras[e],b:this.eras[n],t:t-e}}get window(){return[this.yearAt(this.s-.5),this.yearAt(this.s+.5)]}set(t){const e=Math.max(0,Math.min(this.max,t));if(e!==this.s){this.s=e;for(const n of this.listeners)n(this)}}setYear(t){this.set(this.sAtYear(t))}onChange(t){this.listeners.push(t)}}function Li(s,t=1){const e=Math.round(s),n=e<0?`${-e} BCE`:String(e);return t>=10?`c. ${n}`:n}const ql=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Or=s=>ql(260,900,s),zr=s=>ql(90,300,s);class Z0{constructor(t,e,{warn:n=console.warn}={}){this.canvas=t,this.data=e,this.warn=n,this.params=new URLSearchParams(location.search);const i=new Fl({canvas:t,antialias:!1,powerPreference:"high-performance"});i.setClearColor(0,1),i.info.autoReset=!1,this.renderer=i,this.pipeline=new Km(i),this.scene=new Os,this.camera=new Fe(42,1,.1,9e3),this.light={sunDir:new D(0,1,0),sunColor:new Rt,skyColor:new Rt,groundColor:new Rt,moonDir:new D(0,-1,0),moonColor:new Rt,zenith:new Rt,horizon:new Rt,sunHorizon:new Rt,night:0},this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uSkyMap:{value:null},uMokuId:{value:null},uMokuRect:{value:new ee(0,0,1,1)},uPalette:{value:null},uEraMix:{value:0},uPolityK:{value:0},uHoverMoku:{value:0}}},this.world=new Qm(this,e),Object.assign(this.shared.uniforms,this.world.uniforms),this.world.uniforms=this.shared.uniforms,this.timeline=new K0(e.eras),this.polity=new B0(e,this.world.archPack.rect,this.shared.uniforms,n),this.land=new q0(this),this.overlay={lines:!0,pins:!0,routes:!0};const r=this.params.get("view");this.view=r==="land"?"land":r==="none"?null:"chiefdoms",this.viewChosen=r==="land"||r==="chiefdoms"||r==="none",this.viewListeners=[],this.polityK=0,this.landK=0,this.sky=new _0,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??15.6)},this.time=0,this.frames=0,this.updaters=[]}start(){this.world.setArchipelago(this.world.archPack),this.scene.add(this.world.group),this.ocean=new i0(this.shared,this.shared.uniforms),this.scene.add(this.ocean.mesh),this.lines=new A0(this.data,this.shared.uniforms),this.scene.add(this.lines.group),this.routes=new O0({proj:this.data.proj,uniforms:this.shared.uniforms,camera:this.camera,renderer:this.renderer,eras:this.data.eras}),this.scene.add(this.routes.group),I0(this.data,this.warn).then(o=>this.routes.setRoutes(o)),this.rig=new y0(this.camera,this.canvas,this.world);const t=this.params.get("cam");if(t){const[o,a,l,c,h]=t.split(",").map(Number);this.rig.jump({x:o,z:a,distance:l,yaw:c,pitch:h})}const e=this.params.get("year");e?this.timeline.setYear(Number(e)):t?this.timeline.set(Math.round(this.timeline.sAtYear(1778))):this.timeline.set(0),this.timeline.onChange(()=>this.syncEras()),this.syncEras(),this.sky.update(this.clock.doy,this.clock.hour,0,this.light);const n=this.renderer.getContext(),i=n.getExtension("WEBGL_debug_renderer_info"),r=i?String(n.getParameter(i.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(r),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.params.get("debug")&&this.world.setDebug(Number(this.params.get("debug"))),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}setView(t,{user:e=!1}={}){e&&(this.viewChosen=!0);const n=t==="chiefdoms"||t==="land"?t:null;if(n!==this.view){this.view=n;for(const i of this.viewListeners)i(n)}}onView(t){this.viewListeners.push(t)}islandFill(){const t=this.rig.state,e=t.target;let n=null,i=0;for(const a of this.world.islandPacks){const l=a.rect,c=Math.min(e.x-l.x0,l.x1-e.x,e.z-l.z0,l.z1-e.z);c>i&&(i=c,n=a)}if(!n)return 0;const r=2*t.distance*Math.tan(this.camera.fov*Math.PI/360),o=n.rect;return Math.max((o.x1-o.x0)/(r*this.camera.aspect),(o.z1-o.z0)/r)}routeOptions(t){var n;const e=this.tour;return{window:this.timeline.window,fill:this.islandFill(),focus:e!=null&&e.active?((n=e.event)==null?void 0:n.id)??null:null,...t}}addIsland(t){const e=this.world.addIsland(t);this.land.attach(e),e.applyRange(this.qset.range),this.params.get("debug")&&(e.uniforms.uDebug.value=Number(this.params.get("debug")))}settle(){var e,n;(e=this.ui)==null||e.timeline.finish(),this.rig.finishFlight();const t=this.rig.goal;for(const i of[this.rig.goal,this.rig.state])i.target.copy(t.target),i.distance=t.distance,i.yaw=t.yaw,i.pitch=t.pitch;this.world.update(this.camera,t.distance,0),this.world.settle(this.camera),this.rig.jump({x:t.target.x,z:t.target.z}),this.polityK=this.view==="chiefdoms"?Or(t.distance):0,this.landK=this.view==="land"?zr(t.distance):0,this.shared.uniforms.uPolityK.value=this.polityK,this.land.settle(this.landK),(n=this.routes)==null||n.settle(this.timeline.year,t.distance,this.routeOptions())}stats(){const t=this.renderer.info;return{...this.world.stats(),view:this.view,frameMs:+(this.frameAvg??0).toFixed(1),calls:t.render.calls,triangles:t.render.triangles,textures:t.memory.textures,quality:this.quality.level}}syncEras(){const{a:t,b:e,t:n}=this.timeline.pair;this.polity.setEras(t,e,n)}applyQuality(){const t=[{range:3,dpr:1},{range:3.8,dpr:1.25},{range:4.6,dpr:1.5},{range:5.5,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.world.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.frameAvg=this.frameAvg===void 0?e*1e3:this.frameAvg+(e*1e3-this.frameAvg)*.1,this.renderer.info.reset(),this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.clock;this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t);const n=this.rig.state.distance;this.world.update(this.camera,n,t),this.ocean.update(this.camera);const i=1-Math.exp(-t*5),r=this.view==="chiefdoms"?Or(n):0;this.polityK+=(r-this.polityK)*i,this.shared.uniforms.uPolityK.value=this.polityK;const o=this.view==="land"?zr(n):0;this.landK+=(o-this.landK)*i,this.land.update(t,this.landK),this.lines.visible=this.overlay.lines;const a=this.light,l=Math.min(1,.25+(a.sunColor.r+a.skyColor.r)*.35);this.lines.update(this.camera,this.renderer,n,l),this.routes.visible=this.overlay.routes!==!1,this.routes.update(this.timeline.year,n,this.routeOptions({light:l}));for(const h of this.updaters)h(t,this.time);const c=this.pipeline.uniforms;c.uSunDir.value.copy(a.sunDir),c.uSunColor.value.copy(a.sunHorizon),c.uFogColor.value.copy(a.horizon),c.uFogDensity.value=.09/Math.max(30,n),c.uFogFalloff.value=2/Math.max(30,n),c.uExposure.value=.55*(1+2.2*Math.pow(a.night,1.5)),c.uNight.value=a.night,this.sky.group.position.copy(this.camera.position)}}const Ne=(s,t=document)=>t.querySelector(s),be=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,r]of Object.entries(t))i==="class"?n.className=r:i.startsWith("on")?n.addEventListener(i.slice(2),r):n.setAttribute(i,r);return e&&(n.innerHTML=e),n},J0={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},pt=s=>String(s??"").replace(/[&<>"']/g,t=>J0[t]),Br={arrival:'<path d="M2.5 15.5h19l-2.6 3.6H5.1z"/><path d="M11.5 15.5V4l6.5 9.2h-6.5"/><path d="M2 21.2c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',voyage:'<path d="M2.5 14.5h19l-2.6 3.6H5.1z"/><path d="M11.5 14.5V3.5l6.5 9h-6.5"/><path d="M6 21c3-1.4 9-1.4 12 0"/>',battle:'<path d="M4.5 19.5 19.5 4.5M4.5 4.5l15 15"/><path d="M16.5 4.5h3v3M7.5 4.5h-3v3"/>',founding:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',construction:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',eruption:'<path d="M2.5 20.5 9 11h6l6.5 9.5z"/><path d="M10.2 8.2c0-2 1-3.1 1.8-4.7.8 1.6 1.8 2.7 1.8 4.7"/><path d="M7 6.5l1.3 1.3M17 6.5l-1.3 1.3"/>',epidemic:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',law:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',treaty:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 15h3"/><path d="M13.5 18.5c1-1 1.8-1 2.8 0"/>',death:'<path d="M3.5 18.5h17"/><path d="M7 18.5a5 5 0 0 1 10 0"/><path d="M12 4.5v5M9.6 7.4 12 9.8l2.4-2.4"/>',protest:'<path d="M6 21V3.5"/><path d="M6 4h11.5l-2.6 4 2.6 4H6"/>',restoration:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',other:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',era:'<path d="M5 13.5h14l-2 2.6H7z"/><path d="M11.5 13.5V3.5l5.5 7.6h-5.5"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',routes:'<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',home:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'};function Ye(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Br[s]||Br.other}</svg>`}const Yl=s=>s in Br;class Q0{constructor(t,e,n){this.app=e,this.ui=n,this.tl=e.timeline,this.tween=null;const i=this.tl.n;this.el=be("div",{class:"timeline",role:"group","aria-label":"Time"}),i<2&&this.el.classList.add("single"),i<1&&(this.el.hidden=!0),this.el.innerHTML=`
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${Ye("prev",16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${Ye("next",16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${Math.max(0,i-1)}" step="0.001" aria-label="Year" />
      </div>`,t.appendChild(this.el),this.input=Ne(".tl-input",this.el),this.backBtn=Ne(".tl-back",this.el),this.nextBtn=Ne(".tl-next",this.el),this.tourEl=Ne(".tl-tour",this.el);const r=Ne(".tl-ticks",this.el),o=Math.max(1,Math.ceil(i*46/Math.min(620,innerWidth-60)));this.tl.eras.forEach((a,l)=>{const c=i>1?l/(i-1)*100:50,h=be("button",{class:"tl-tick",style:`left:${c}%`,title:`${a.label} · ${Li(a.year,a.yearPrecision)}`,"aria-label":a.label,"data-i":l});h.innerHTML=`<i></i>${l%o===0||l===i-1?`<span>${pt(Li(a.year,a.yearPrecision).replace("c. ",""))}</span>`:""}`,r.appendChild(h)}),this.input.addEventListener("input",()=>{this.tween=null,this.tl.set(Number(this.input.value)),this.ui.onScrub()}),r.addEventListener("click",a=>{const l=a.target.closest(".tl-tick");l&&(this.easeTo(Number(l.dataset.i),.9),this.ui.onScrub(Number(l.dataset.i)))}),this.nextBtn.addEventListener("click",()=>{this.el.classList.remove("invite"),this.ui.tour.next()}),this.backBtn.addEventListener("click",()=>this.ui.tour.back()),this.tl.onChange(()=>this.refresh()),this.refresh()}easeTo(t,e=1){const n=Math.max(0,Math.min(this.tl.max,t));this.tween={from:this.tl.s,to:n,t:0,dur:e}}easeToYear(t,e){this.easeTo(this.tl.sAtYear(t),e)}finish(){this.tween&&(this.tl.set(this.tween.to),this.tween=null)}update(t){const e=this.tween;if(!e)return;e.t=Math.min(1,e.t+t/e.dur);const n=e.t<.5?2*e.t*e.t:1-Math.pow(-2*e.t+2,2)/2;this.tl.set(e.from+(e.to-e.from)*n),e.t>=1&&(this.tween=null)}refresh(){const t=this.tl,e=t.era;Ne(".tl-era",this.el).textContent=e?e.label:"",Ne(".tl-year",this.el).textContent=e?Li(t.year,e.yearPrecision??1):"",document.activeElement!==this.input&&(this.input.value=String(t.s));const n=t.max>0?t.s/t.max:0;Ne(".tl-rail span",this.el).style.width=`${n*100}%`;const i=Math.round(t.s);for(const r of this.el.querySelectorAll(".tl-tick"))r.classList.toggle("on",Number(r.dataset.i)===i)}refreshTour(t){const e=`${t.active}:${t.chapter}:${t.step}:${t.stop}:${t.active?"":t.nearestChapter()}:${t.atEnd}`;if(e===this.tourKey)return;this.tourKey=e;const n=t.describe();if(this.backBtn.disabled=!n||t.atStart,this.nextBtn.disabled=!n||t.atEnd,this.el.classList.toggle("off-tour",!!n&&!n.active),!n){this.tourEl.innerHTML="";return}this.tourEl.innerHTML=n.active?`<span>${pt(n.chapter)}</span><i>·</i><em>${pt(n.name)}</em>${n.step?`<i>·</i><span>${pt(n.step)}</span>`:""}`:`<span>Next resumes at ${pt(n.chapter.toLowerCase())}</span><i>·</i><em>${pt(n.name)}</em>`,this.nextBtn.title=n.active?"Next (→ or space)":`Back to the tour: ${n.chapter.toLowerCase()}, ${n.name}`}}const Qo={exact:0,ahupuaa:22,moku:90,island:260,sea:160},tl=24;class tg{constructor(t,e,{onOpen:n,onCluster:i}={}){this.app=e,this.onOpen=n,this.onCluster=i,this.layer=be("div",{class:"pins"}),t.appendChild(this.layer),this.tip=be("div",{class:"cl-tip",role:"tooltip"}),t.appendChild(this.tip);const r=new Map(e.data.places.map(l=>[l.id,l]));this.places=r,this.items=[];const o=[];for(const l of e.data.events){const c=(l.where||[]).map(u=>r.get(u.place)).find(u=>u&&Un(u.geometry)),h=Fr(l);if(!c||!h){o.push(l.id);continue}const[d,f]=e.data.proj.toWorld(Un(c.geometry)),m=Yl(l.kind)?l.kind:"other",v=be("button",{class:"pin",title:l.title,"aria-label":l.title},`<span class="pin-ic">${Ye(m,16)}</span><span class="pin-label">${pt(l.title)}</span>`);v.addEventListener("click",u=>{var y;u.stopPropagation(),(y=this.onOpen)==null||y.call(this,l)});const g=Qo[c.placePrecision]??0,p=be("div",{class:"halo"});this.layer.appendChild(p),this.layer.appendChild(v),this.items.push({ev:l,place:c,x:d,z:f,span:h,start:Rs(l)??h[0],el:v,halo:p,soft:g,r:g,pos:new D(d,0,f),shown:!1,active:!1,near:!1,haloShown:!1,tx:NaN,ty:NaN,ts:NaN,hx:NaN,hy:NaN,hr:NaN,ha:NaN})}o.length&&e.warn(`events with no placeable \`where\` or no date, so no pin: ${o.join(", ")}`);const a=this.items.length;this.sx=new Float32Array(a),this.sy=new Float32Array(a),this.vis=new Uint8Array(a),this.root=new Int16Array(a),this.size=new Int16Array(a),this.slot=new Int16Array(a),this.members=new Int16Array(a),this.halos=new Int16Array(a),this.clusters=[],this.nClusters=0,this.hovered=null,this.activeEvent=null,this.stopXZ=null,this._v=new D,this._w=new D}setStopPlace(t){const e=t&&Un(t.geometry);this.stopXZ=e?this.app.data.proj.toWorld(e):null,this.stopSoft=t?Qo[t.placePrecision]??0:0}visibleEvents(){const[t,e]=this.app.timeline.window;return this.items.filter(n=>n.span[1]>=t&&n.span[0]<=e).map(n=>n.ev)}marker(t){let e=this.clusters[t];if(e)return e;const n=be("button",{class:"cluster"},'<span class="cl-n"></span>');return e={el:n,label:n.firstChild,start:0,count:0,x:0,y:0,key:0,shownCount:-1,tipKey:-1,domKey:-1,shown:!1,beside:!1,tx:NaN,ty:NaN,ts:NaN},n.addEventListener("click",i=>{var r;i.stopPropagation(),this.hideTip(),(r=this.onCluster)==null||r.call(this,this.eventsOf(e))}),n.addEventListener("pointerenter",i=>{i.pointerType!=="touch"&&(this.hovered=e,this.showTip(e))}),n.addEventListener("pointerleave",()=>{this.hovered===e&&this.hideTip()}),this.layer.appendChild(n),this.clusters[t]=e,e}eventsOf(t){const e=[];for(let n=0;n<t.count;n++)e.push(this.items[this.members[t.start+n]]);return e.sort((n,i)=>n.start-i.start).map(n=>n.ev)}groups(){return this.clusters.slice(0,this.nClusters).map(t=>({ids:this.eventsOf(t).map(e=>e.id),count:t.count,x:t.x,y:t.y,beside:t.beside}))}showTip(t){t.tipKey=t.key;const e=this.eventsOf(t).map(n=>`<div class="tip-row"><span class="tip-y">${pt($l(n))}</span><b>${pt(n.title)}</b></div>`).join("");this.tip.innerHTML=`<div class="tip-head">${t.count} events here</div>${e}<div class="tip-foot">click for the list</div>`,this.tip.classList.add("show"),this.tipX=this.tipY=NaN,this.placeTip(t)}placeTip(t){const e=this.tip.offsetWidth||220,n=this.tip.offsetHeight||120;let i=t.x+22;i+e>innerWidth-10&&(i=t.x-22-e);const r=Math.max(64,Math.min(innerHeight-n-10,t.y-44-n/2)),o=Math.round(i),a=Math.round(r);o===this.tipX&&a===this.tipY||(this.tipX=o,this.tipY=a,this.tip.style.transform=`translate(${o}px, ${a}px)`)}hideTip(){this.hovered=null,this.tip.classList.remove("show")}find(t){const e=this.root;for(;e[t]!==t;)e[t]=e[e[t]],t=e[t];return t}put(t,e,n,i){Math.abs(e-t.tx)<.05&&Math.abs(n-t.ty)<.05&&i===t.ts||(t.tx=e,t.ty=n,t.ts=i,t.el.style.transform=`translate(${e.toFixed(1)}px, ${n.toFixed(1)}px) scale(${i.toFixed(3)})`)}update(t){const e=this.app,n=e.camera,i=innerWidth,r=innerHeight,o=e.timeline,a=o.yearAt(o.s-.5),l=o.yearAt(o.s+.5),c=e.rig.state.distance,h=Math.round(Math.max(.62,Math.min(1,1.18-Math.log(Math.max(1,c)/120)*.13))*200)/200,d=this.items,f=d.length,{sx:m,sy:v,vis:g,root:p,size:u}=this,y=this.activeEvent,x=this._v;let E=-1;for(let _=0;_<f;_++){const M=d[_],P=M.ev===y,U=P&&this.stopXZ;M.pos.x=U?this.stopXZ[0]:M.x,M.pos.z=U?this.stopXZ[1]:M.z,M.pos.y=e.world.heightAt(M.pos.x,M.pos.z)+.02,M.r=U?this.stopSoft:M.soft;let V=t&&(P||M.span[1]>=a&&M.span[0]<=l);V&&(x.copy(M.pos).project(n),m[_]=(x.x+1)/2*i,v[_]=(1-x.y)/2*r,V=x.z<1&&m[_]>-60&&m[_]<i+60&&v[_]>84&&v[_]<r+40),g[_]=V?1:0,V&&P&&(E=_),p[_]=_,u[_]=0}const R=tl*tl;for(let _=0;_<f;_++)if(!(!g[_]||_===E))for(let M=_+1;M<f;M++){if(!g[M]||M===E)continue;const P=m[_]-m[M],U=v[_]-v[M];if(P*P+U*U<R){const V=this.find(_),L=this.find(M);V!==L&&(p[Math.max(V,L)]=Math.min(V,L))}}for(let _=0;_<f;_++)g[_]&&_!==E&&u[this.find(_)]++;let T=0,A=0;for(let _=0;_<f;_++){if(!g[_]||_===E||p[_]!==_||u[_]<2)continue;const M=this.marker(T);this.slot[_]=T++,M.start=A,M.count=0,M.x=0,M.y=0,M.key=0,A+=u[_]}for(let _=0;_<f;_++){if(!g[_]||_===E)continue;const M=this.find(_);if(u[M]<2)continue;const P=this.clusters[this.slot[M]];this.members[P.start+P.count++]=_,P.x+=m[_],P.y+=v[_],P.key=(P.key*61+_+1)%1000003}for(let _=0;_<f;_++){const M=d[_],P=g[_]===1&&(_===E||u[this.find(_)]<2);P!==M.shown&&(M.shown=P,M.el.classList.toggle("show",P));const U=M.ev===y;if(U!==M.active&&(M.active=U,M.el.classList.toggle("active",U)),!P)continue;const V=c<260||U;V!==M.near&&(M.near=V,M.el.classList.toggle("near",V)),this.put(M,m[_],v[_],h)}for(let _=0;_<T;_++){const M=this.clusters[_];M.x/=M.count,M.y/=M.count;const P=E>=0&&Math.abs(M.x-m[E])<30&&Math.abs(M.y-v[E])<30;if(P&&(M.x=m[E]-36*h,M.y=v[E]),P!==M.beside&&(M.beside=P,M.el.classList.toggle("beside",P)),M.count!==M.shownCount&&(M.shownCount=M.count,M.label.textContent=String(M.count),M.el.setAttribute("aria-label",`${M.count} events here`)),M.key!==M.domKey){M.domKey=M.key;let U="";for(let V=0;V<M.count;V++)U+=`${V?" ":""}${d[this.members[M.start+V]].ev.id}`;M.el.dataset.events=U}M.shown||(M.shown=!0,M.el.classList.add("show")),this.put(M,M.x,M.y,h),this.hovered===M&&(M.key!==M.tipKey?this.showTip(M):this.placeTip(M))}for(let _=T;_<this.clusters.length;_++){const M=this.clusters[_];this.hovered===M&&this.hideTip(),M.shown&&(M.shown=!1,M.count=0,M.el.classList.remove("show"))}this.nClusters=T;let N=0;for(let _=0;_<f;_++){const M=d[_];let P=g[_]===1&&M.r>0;for(let F=0;P&&F<N;F++){const G=d[this.halos[F]];Math.abs(G.pos.x-M.pos.x)<.5&&Math.abs(G.pos.z-M.pos.z)<.5&&G.r>=M.r&&(P=!1)}if(P!==M.haloShown&&(M.haloShown=P,M.halo.classList.toggle("show",P)),!P)continue;this.halos[N++]=_,this._w.copy(n.position).sub(M.pos).normalize();const U=this._w.cross(n.up).normalize().multiplyScalar(M.r).add(M.pos);U.project(n);const V=Math.max(6,Math.min(400,Math.hypot((U.x+1)/2*i-m[_],(1-U.y)/2*r-v[_])));Math.abs(m[_]-M.hx)<.05&&Math.abs(v[_]-M.hy)<.05&&Math.abs(V-M.hr)<.05||(M.hx=m[_],M.hy=v[_],M.hr=V,M.halo.style.transform=`translate(${m[_].toFixed(1)}px, ${v[_].toFixed(1)}px) scale(${V.toFixed(1)})`);const L=Math.round(Math.max(.3,Math.min(1,70/V))*100)/100;L!==M.ha&&(M.ha=L,M.halo.style.setProperty("--halo",L.toFixed(2)))}}}const eg={arrival:"arrival",battle:"battle",founding:"founding",construction:"construction",eruption:"eruption",epidemic:"epidemic",law:"law",treaty:"treaty",voyage:"voyage",death:"death",protest:"protest",restoration:"restoration",other:"event"},el=s=>Yl(s.kind)?s.kind:"other";class ng{constructor(t,e,n){this.app=e,this.ui=n,this.el=be("section",{class:"card","aria-live":"polite"}),t.appendChild(this.el),this.places=new Map(e.data.places.map(i=>[i.id,i])),this.sources=new Map(e.data.sources.map(i=>[i.id,i])),this.events=new Map(e.data.events.map(i=>[i.id,i])),this.mode=null,this.ev=null,this.stop=-1,this.chapter=null,this.list=null,this.el.addEventListener("click",i=>this.click(i))}get isOpen(){return this.el.classList.contains("show")}open(t){this.set("event",{ev:t})}setStop(t){this.stop=t,this.render()}openEra(t){this.set("era",{chapter:t})}openList(t){this.set("cluster",{list:t})}set(t,{ev:e=null,chapter:n=null,list:i=null}){this.mode=t,this.ev=e,this.chapter=n,this.list=i,this.stop=-1,this.render()}close(){var e,n;const t=this.ev;this.el.classList.remove("show"),this.mode=null,this.ev=null,this.chapter=null,this.list=null,(n=(e=this.ui).onCardClosed)==null||n.call(e,t)}click(t){const e=t.target.closest("button");if(!e||!this.el.contains(e))return;const n=this.ui.tour;if(e.classList.contains("card-close"))this.close();else if(e.classList.contains("prev"))n.back();else if(e.classList.contains("next"))n.next();else if(e.dataset.ev){const i=this.events.get(e.dataset.ev);i&&n.open(i,{gentle:this.mode==="cluster"})}}sourceLine(t){const e=typeof t=="string"?t:t.id,n=this.sources.get(e),i=typeof t=="object"&&t.where?`, ${pt(t.where)}`:"";if(!n)return`<li><span class="src-title">${pt(e)}</span>${i} <span class="flag missing" title="not in sources.json">missing</span></li>`;const r=n.url&&/^https?:/.test(n.url)?`<a href="${pt(n.url)}" target="_blank" rel="noopener">${pt(n.title)}</a>`:pt(n.title),o=n.opened===!1?' <span class="flag" title="Not yet read at the source: check this before relying on it">verify</span>':"",a=n.author?`${pt(n.author)}, `:"",l=n.year?` (${pt(n.year)})`:"";return`<li>${a}<span class="src-title">${r}</span>${l}${i}${o}</li>`}sourcesSection(t){return`<div class="card-sec"><h2>Sources</h2><ul class="sources">${(t||[]).map(e=>this.sourceLine(e)).join("")||'<li class="none">none listed</li>'}</ul></div>`}eventRows(t,{gloss:e=!0}={}){return t.map(n=>`<li><button class="ev-row" data-ev="${pt(n.id)}">
          <span class="ev-ic">${Ye(el(n),16)}</span>
          <span class="ev-y">${pt($l(n))}</span>
          <span class="ev-t"><b>${pt(n.title)}</b>${e&&n.gloss?`<em>${pt(n.gloss)}</em>`:""}</span>
        </button></li>`).join("")}footer(){var r;const t=this.ui.tour;if(!(t!=null&&t.active))return"";const e=t.current;let n,i="Next";if(this.mode==="era"&&this.chapter===e&&t.step<0)n=`chapter ${e.index+1} of ${t.chapters.length}`;else if(this.mode==="event"&&this.ev&&this.ev===t.event){const o=((r=this.ev.stops)==null?void 0:r.length)||0;t.stop>=0?n=`stop ${t.stop+1} of ${o}`:(n=`${t.step+1} of ${e.events.length} in this chapter`,o&&(i=`Walk ${o} stops`))}else return"";return`<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${t.atStart?"disabled":""}>${Ye("prev",18)}</button>
      <span class="count">${pt(n)}</span>
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${t.atEnd?"disabled":""}><span>${pt(i)}</span>${Ye("next",18)}</button>
    </footer>`}render(){if(this.mode==="era")this.el.innerHTML=this.eraHTML();else if(this.mode==="cluster")this.el.innerHTML=this.clusterHTML();else if(this.mode==="event"&&this.ev)this.el.innerHTML=this.eventHTML();else return;this.el.dataset.mode=this.mode,this.el.classList.add("show"),this.el.scrollTop=0}header(t,e,n){return`<header>
        <div class="card-icon">${Ye(t,26)}</div>
        <div class="card-titles"><h1>${pt(e)}</h1>${n?`<p class="gloss">${pt(n)}</p>`:""}</div>
        <button class="card-close" aria-label="Close">${Ye("close",18)}</button>
      </header>`}eventHTML(){const t=this.ev,e=(t.where||[]).map(l=>{const c=this.places.get(l.place);return c?`${pt(c.name)}${l.role?` <em>${pt(l.role)}</em>`:""}`:null}).filter(Boolean),n=Object.entries(t.confidence||{}).map(([l,c])=>`<span class="conf ${pt(c)}"><b>${pt(l)}</b> ${pt(c)}</span>`).join(""),i=(t.tellings||[]).map(l=>{var c;return`<li><span class="src-title">${pt(((c=this.sources.get(l.source))==null?void 0:c.title)||l.source)}</span>: ${pt(l.says)}</li>`}).join(""),r=t.stops||[],o=this.stop>=0?r[this.stop]:null,a=o?this.places.get(o.place):null;return`
      ${this.header(el(t),t.title,t.gloss)}
      <div class="card-meta"><span class="when">${pt(j0(t))}</span><span class="kind">${pt(eg[t.kind]||t.kind||"event")}</span></div>
      ${e.length?`<div class="card-where">${e.join("<i>·</i>")}</div>`:""}
      ${o?`<div class="stop"><div class="stop-n">${this.stop+1} / ${r.length}${a?` · ${pt(a.name)}`:""}</div><p>${pt(o.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${pt(t.summary)}</p>`:""}</div>
      ${n?`<div class="card-conf">${n}</div>`:""}
      ${i?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${i}</ul></div>`:""}
      ${this.sourcesSection(t.sources)}
      ${this.footer()}`}eraHTML(){const t=this.chapter,e=t.era,n=this.ui.tour;return`
      ${this.header("era",e.label||e.id)}
      <div class="card-meta"><span class="when">${pt(Li(e.year,Math.max(10,e.yearPrecision??10)))}</span><span class="kind">chapter ${t.index+1} of ${n.chapters.length}</span></div>
      <div class="card-body">${e.note?`<p>${pt(e.note)}</p>`:""}</div>
      ${t.events.length?`<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(t.events,{gloss:!1})}</ul></div>`:""}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`}clusterHTML(){const t=this.list||[],e=[];for(const i of t){const r=(i.where||[]).map(o=>this.places.get(o.place)).find(Boolean);r&&!e.includes(r.name)&&e.push(r.name)}const n=e.length>4?`${e.slice(0,4).join(" · ")} · and ${e.length-4} more`:e.join(" · ");return`
      ${this.header("pins",`${t.length} events`,n)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(t)}</ul></div>`}}const An={far:2600,island:520,near:70},br={far:0,island:1,near:2},ni=(s,t,e)=>Math.max(t,Math.min(e,s)),ig=new Set(["law","epidemic","restoration"]);function sg(s){return(s==null?void 0:s.view)==="land"||(s==null?void 0:s.view)==="chiefdoms"?s.view:s&&ig.has(s.kind)?"land":"chiefdoms"}function rg(s){return s.short?s.short:String(s.label||s.id).replace(/^in the time of\s+/i,"").split(/,| and the /)[0].trim()}function nl(s){let t=null;for(const e of s||[])e in br&&(t===null||br[e]>br[t])&&(t=e);return t||"island"}class ag{constructor(t,e){this.app=t,this.ui=e,this.places=new Map(t.data.places.map(n=>[n.id,n])),this.islands=new Map(t.data.packs.filter(n=>n!==t.world.archPack).map(n=>[n.id,n])),this.chapters=this.build(),this.active=!1,this.chapter=0,this.step=-1,this.stop=-1,this.listeners=[]}build(){const t=this.app,e=t.timeline,n=new Map(e.eras.map((a,l)=>[a.id,l])),i=e.eras.map((a,l)=>({era:a,index:l,name:rg(a),events:[],island:null}));if(!i.length)return i;const r=[],o=i.map(()=>[]);return t.data.events.forEach((a,l)=>{const c=Rs(a);if(c===null)return;let h=n.get(a.era);h===void 0&&(h=Math.round(e.sAtYear(c)),r.push(a.id)),o[h].push({ev:a,start:c,order:l})}),r.length&&t.warn(`events whose era is not in eras.json, placed in a chapter by date: ${r.join(", ")}`),i.forEach((a,l)=>{a.events=o[l].sort((c,h)=>c.start-h.start||c.order-h.order).map(c=>c.ev),a.island=this.gathering(a.events)}),i}gathering(t){const e=new Map;let n=0;for(const o of t){const a=this.placeOf(o);a&&(n++,a.island&&this.islands.has(a.island)&&e.set(a.island,(e.get(a.island)||0)+1))}let i=null,r=0;for(const[o,a]of e)a>r&&([i,r]=[o,a]);return i&&r>=2&&r>=n*.7?i:null}placeOf(t){for(const e of t.where||[]){const n=this.places.get(e.place);if(n&&Un(n.geometry))return n}return null}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}get current(){return this.chapters[this.chapter]||null}get event(){var t;return this.step>=0&&((t=this.current)==null?void 0:t.events[this.step])||null}get state(){var t;return{active:this.active,chapter:this.chapter,step:this.step,stop:this.stop,event:((t=this.event)==null?void 0:t.id)??null}}get atStart(){return this.active&&this.chapter===0&&this.step<0}get atEnd(){var r;const t=this.chapters.length;if(!t)return!0;if(!this.active)return!1;const e=this.current,n=this.event,i=n?(((r=n.stops)==null?void 0:r.length)||0)-1:-1;return this.chapter===t-1&&this.step===e.events.length-1&&this.stop>=i}nearestChapter(){return ni(Math.round(this.app.timeline.s),0,this.chapters.length-1)}begin(){this.goTo(0,-1,{jump:!0})}next(){var e;if(!this.chapters.length)return;if(!this.active)return this.goTo(this.nearestChapter(),-1);const t=this.event;if(t&&this.stop<(((e=t.stops)==null?void 0:e.length)||0)-1)return this.goStop(this.stop+1);if(this.step<this.current.events.length-1)return this.goTo(this.chapter,this.step+1);if(this.chapter<this.chapters.length-1)return this.goTo(this.chapter+1,-1)}back(){if(this.chapters.length){if(!this.active)return this.goTo(this.nearestChapter(),-1);if(this.event&&this.stop>0)return this.goStop(this.stop-1);if(this.event&&this.stop===0)return this.goTo(this.chapter,this.step);if(this.step>0)return this.goTo(this.chapter,this.step-1,{stop:"last"});if(this.step===0)return this.goTo(this.chapter,-1);if(this.chapter>0){const t=this.chapters[this.chapter-1];return this.goTo(this.chapter-1,t.events.length-1,{stop:"last"})}}}skip(t){if(!this.chapters.length)return;const e=this.active?this.chapter:this.nearestChapter(),n=t<0&&this.active&&this.step>=0?e:e+t;n>=0&&n<this.chapters.length&&this.goTo(n,-1)}leave(){this.active&&(this.active=!1,this.notify())}locate(t){for(let e=0;e<this.chapters.length;e++){const n=this.chapters[e].events.indexOf(t);if(n>=0)return[e,n]}return null}open(t,{gentle:e=!1}={}){const n=this.locate(t);if(n)return this.goTo(n[0],n[1],{gentle:e});this.ui.pins.activeEvent=t,this.ui.pins.setStopPlace(null),this.ui.card.open(t),this.fly(this.gentleView(t))}goTo(t,e=-1,{jump:n=!1,gentle:i=!1,stop:r=-1}={}){var a;const o=this.chapters[t];if(o){if(this.active=!0,this.chapter=t,this.step=ni(e,-1,o.events.length-1),this.stop=-1,this.step<0)this.showEra(o,n);else{const l=o.events[this.step],c=((a=l.stops)==null?void 0:a.length)||0;if(r==="last"&&c)return this.goStop(c-1,{jump:n});this.showEvent(l,{jump:n,gentle:i})}this.notify()}}applyView(t){this.app.viewChosen||this.app.setView(sg(t))}showEra(t,e){const n=this.ui;this.applyView(null),n.pins.activeEvent=null,n.pins.setStopPlace(null),n.card.openEra(t);const i=t.island?this.islandView(t.island,this.homeYaw()):this.chainView();this.setS(t.index,this.fly(i,e),e)}showEvent(t,{jump:e,gentle:n}){const i=this.ui;this.applyView(t),i.pins.activeEvent=t,i.pins.setStopPlace(null),i.card.open(t);const r=this.fly(n?this.gentleView(t):this.eventView(t),e),o=this.app.timeline,[a,l]=o.window,c=Fr(t);n&&c&&c[1]>=a&&c[0]<=l||this.setYear(this.stepYear(t,this.current),r,e)}goStop(t,{jump:e=!1}={}){const n=this.event,i=(n==null?void 0:n.stops)||[];if(!n||t<-1||t>=i.length)return;const r=this.ui;this.active=!0,this.stop=t,this.applyView(n),r.pins.activeEvent=n,r.card.ev!==n&&r.card.open(n),r.card.setStop(t);const o=i[t],a=o?this.places.get(o.place):null;if(r.pins.setStopPlace(a&&Un(a.geometry)?a:null),o){const l=this.fly(a&&Un(a.geometry)?this.pointView(a,An[o.zoom]??An.island):null,e);Number.isFinite(o.year)&&this.setYear(o.year,l,e)}this.notify()}stepYear(t,e){const n=this.app.timeline,i=Rs(t),r=Fr(t)||[i,i],o=n.yearAt(e.index-.5),a=n.yearAt(e.index+.5);return i>=o&&i<=a?i:r[1]>=o&&r[0]<=a?ni(e.era.year,Math.max(r[0],o),Math.min(r[1],a)):i}setYear(t,e,n){this.setS(this.app.timeline.sAtYear(t),e,n)}setS(t,e,n){const i=this.ui.timeline;n?(i.tween=null,this.app.timeline.set(t)):i.easeTo(t,ni(e*.8,.6,2.4))}homeYaw(t=this.ui.freeBox()){return(t.x1-t.x0)/Math.max(1,t.y1-t.y0)<.85?1.1:0}tilt(){const t=this.app.rig.goal;return ni(t.pitch-Ln(t.distance),-.3,.3)}chainView(){const t=this.ui.freeBox();let e=null;for(const n of this.islands.values()){const i=n.rect;e=e?{x0:Math.min(e.x0,i.x0),z0:Math.min(e.z0,i.z0),x1:Math.max(e.x1,i.x1),z1:Math.max(e.z1,i.z1)}:{...i}}return this.app.rig.fit({rect:e||this.app.world.bounds,yaw:this.homeYaw(t),box:t})}islandView(t,e=this.app.rig.goal.yaw,n=0){const i=this.islands.get(t);return this.app.rig.fit({rect:i.rect,yaw:e,tilt:n,box:this.ui.freeBox()})}pointView(t,e,{towardChain:n=0}={}){let[i,r]=this.app.data.proj.toWorld(Un(t.geometry));if(n){const o=this.app.world.bounds,a=(o.x0+o.x1)/2-i,l=(o.z0+o.z1)/2-r,c=Math.min(n,900/Math.max(1,Math.hypot(a,l)));i+=a*c,r+=l*c}return this.app.rig.fit({rect:{x0:i,x1:i,z0:r,z1:r},distance:e,tilt:this.tilt(),box:this.ui.freeBox()})}eventView(t){const e=this.placeOf(t);if(!e)return null;const n=nl(t.zoom);return n==="near"?this.pointView(e,An.near):n==="island"&&this.islands.has(e.island)?this.islandView(e.island,this.app.rig.goal.yaw,this.tilt()):n==="island"?this.pointView(e,An.island):!e.island&&e.placePrecision==="island"?this.chainView():this.pointView(e,An.far,{towardChain:.35})}gentleView(t){const e=this.placeOf(t);if(!e)return null;const n=An[nl(t.zoom)];return this.pointView(e,Math.min(this.app.rig.goal.distance,Math.max(n,An.island)))}fly(t,e=!1){if(!t)return 1;const n=this.app.rig;if(e)return n.jump({x:t.target.x,z:t.target.z,distance:t.distance,yaw:t.yaw,pitch:t.pitch}),0;const i=n.goal,r=Math.hypot(i.target.x-t.target.x,i.target.z-t.target.z),o=Math.abs(Math.log(t.distance/Math.max(1,i.distance))),a=ni(1.1+Math.sqrt(r)*.032+o*.28,1.1,3.4);return n.flyTo(t,a),a}describe(){const t=this.chapters.length?this.chapters[this.active?this.chapter:this.nearestChapter()]:null;return t?{active:this.active,chapter:`Chapter ${t.index+1} of ${this.chapters.length}`,name:t.name,step:this.active&&this.step>=0?`${this.step+1} of ${t.events.length}`:""}:null}}class og{constructor(t){this.app=t,t.ui=this,this.build(),this.bind(),t.updaters.push(e=>this.update(e)),!t.params.has("year")&&!t.params.has("cam")&&this.tour.chapters.length&&(this.tour.begin(),this.timeline.el.classList.add("invite"))}build(){const t=this.app,e=be("div",{id:"ui"});document.body.appendChild(e),this.root=e;const n=t.world.archPack.name;this.brand=be("div",{class:"brand"},`<div class="brand-name">Holo i ke Au</div><div class="brand-sub"><span class="where">${pt(n)}</span><span class="loading"></span></div>`),e.appendChild(this.brand),this.tools=be("div",{class:"tools"});const i=(o,a,l,c)=>be("button",{class:`tool${c?" on":""}`,"data-tool":o,title:l,"aria-label":l,"aria-pressed":String(!!c)},Ye(a,20));this.tools.append(i("lines","lines","Moku and ahupuaʻa boundaries",t.overlay.lines),i("routes","routes","Voyages, fleets and ships at sea",t.overlay.routes),i("pins","pins","Events",t.overlay.pins),i("home","home","The whole chain"),i("help","help","About"),i("full","expand","Full screen")),e.appendChild(this.tools),this.legend=be("div",{class:"legend"}),this.legend.innerHTML=`
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
      </div>
      <div class="lg-body"></div>`,this.legendBody=Ne(".lg-body",this.legend),this.legend.inert=!0,e.appendChild(this.legend),this.inspector=be("div",{class:"inspector"}),e.appendChild(this.inspector),this.timeline=new Q0(e,t,this),this.pins=new tg(e,t,{onOpen:o=>this.openEvent(o),onCluster:o=>this.openCluster(o)}),this.card=new ng(e,t,this),this.tour=new ag(t,this),t.tour=this.tour,this.tour.onChange(o=>this.timeline.refreshTour(o)),t.timeline.onChange(()=>this.timeline.refreshTour(this.tour)),this.timeline.refreshTour(this.tour),this.help=be("div",{class:"help hidden"});const r=this.credits();this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${Ye("close",18)}</button>
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
      </div>`,e.appendChild(this.help),this.refreshLegend()}credits(){var i,r;const t=this.app.data,e=new Map,n=o=>{o&&o.id&&!e.has(o.id)&&e.set(o.id,o)};for(const o of t.packs)for(const a of o.sources||[])n(a);for(const o of((i=t.moku)==null?void 0:i.sources)||[])n(o);for(const o of((r=t.ahupuaa)==null?void 0:r.sources)||[])n(o);return sl([...e.values()])}landCredits(){const t=Ne(".land-credits",this.help),e=this.app.land.manifest;if(!t||!e||t.childElementCount)return;const n=new Map;for(const i of Object.values(e.methods||{}))for(const r of Object.values(i||{}))for(const o of(r==null?void 0:r.sources)||[])o!=null&&o.id&&/^https?:/.test(o.url||"")&&!n.has(o.id)&&n.set(o.id,o);n.size&&(t.innerHTML=`<h3>Land layers</h3><ul class="credits">${sl([...n.values()])}</ul>`)}bind(){const t=this.app;this.tools.addEventListener("click",i=>{var a,l,c;const r=i.target.closest("[data-tool]");if(!r)return;const o=r.dataset.tool;if(o==="help")this.help.classList.toggle("hidden");else if(o==="full")document.fullscreenElement?(a=document.exitFullscreen)==null||a.call(document):(c=(l=document.documentElement).requestFullscreen)==null||c.call(l).catch(()=>{});else if(o==="home"){const h=t.rig;h.home=this.tour.chainView(),h.flyTo({target:h.home.target,distance:h.home.distance,yaw:h.home.yaw,pitch:h.home.pitch},3)}else o in t.overlay&&(t.overlay[o]=!t.overlay[o],r.classList.toggle("on",t.overlay[o]),r.setAttribute("aria-pressed",String(t.overlay[o])))}),this.legend.addEventListener("click",i=>{const r=i.target.closest("[data-view]");if(!r||r.disabled)return;const o=r.dataset.view;t.setView(t.view===o?null:o,{user:!0})}),t.onView(()=>this.refreshLegend()),t.land.onChange(()=>{this.refreshLegend(),this.landCredits()}),this.help.addEventListener("click",i=>{(i.target===this.help||i.target.closest(".help-close"))&&this.help.classList.add("hidden")}),t.timeline.onChange(()=>{t.timeline.era!==this.legendEra&&this.refreshLegend()});const e=t.canvas;let n=0;e.addEventListener("pointermove",i=>{if(i.buttons||i.pointerType==="touch")return this.hover(null);const r=performance.now();r-n<70||(n=r,this.hover(i.clientX,i.clientY))}),e.addEventListener("pointerleave",()=>this.hover(null)),e.addEventListener("pointerdown",()=>this.hover(null)),addEventListener("keydown",i=>{var o,a,l,c;if(i.key==="Escape"){this.help.classList.contains("hidden")?this.card.close():this.help.classList.add("hidden");return}if((a=(o=i.target).closest)!=null&&a.call(o,"input, textarea, select")||i.altKey||i.ctrlKey||i.metaKey||!this.help.classList.contains("hidden"))return;const r=this.tour;i.key==="ArrowRight"||i.key===" "&&!((c=(l=i.target).closest)!=null&&c.call(l,"button, a"))?(i.preventDefault(),this.timeline.el.classList.remove("invite"),r.next()):i.key==="ArrowLeft"?(i.preventDefault(),r.back()):i.key===","||i.key==="<"?r.skip(-1):(i.key==="."||i.key===">")&&r.skip(1)})}openEvent(t){this.tour.open(t,{gentle:!0})}openCluster(t){const e=this.tour;this.pins.activeEvent=e.active?e.event:null,this.card.openList(t)}onCardClosed(){const t=this.tour;t.active&&t.event||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}onScrub(t=this.app.timeline.s){var i;this.tour.leave();const n=this.app.timeline;this.card.mode==="era"&&((i=this.card.chapter)==null?void 0:i.era)!==n.eras[Math.round(Math.max(0,Math.min(n.max,t)))]&&this.card.close(),this.card.ev||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}freeBox(){const t=innerWidth,e=innerHeight,n={x0:16,y0:72,x1:t-16,y1:e-16},i=this.timeline.el;!i.hidden&&i.offsetHeight&&(n.y1=Math.min(n.y1,i.offsetTop-14));const r=this.card.el;return this.card.isOpen&&r.offsetWidth&&(r.offsetLeft>t*.35?n.x1=Math.min(n.x1,r.offsetLeft-16):n.y1=Math.min(n.y1,r.offsetTop-12)),n.y1-n.y0<120&&(n.y1=n.y0+120),n}hover(t,e){var f;const n=this.app,i=n.shared.uniforms;if(t==null){i.uHoverMoku.value=0,this.inspector.classList.remove("show");return}const r=n.rig.pickGround(t,e),o=r&&n.world.metresAt(r.x,r.z)>0?n.polity.mokuAt(r.x,r.z):null,a=n.view==="land"&&n.landK>.25;if(i.uHoverMoku.value=o&&!a?o.index:0,!o){this.inspector.classList.remove("show");return}const l=a?n.land.valuesAt(r.x,r.z):null,c=`${o.index}:${(f=n.timeline.era)==null?void 0:f.id}:${l?JSON.stringify(l):""}`;if(this.inspectorKey!==c){this.inspectorKey=c;const m=n.polity.holder(n.timeline.era,o),v=(g,p)=>`<div class="in-row"><span class="in-k">${g}</span>${p}</div>`;this.inspector.innerHTML=`
        <div class="in-head"><b>${pt(o.name)}</b><span class="in-island">${pt(o.island||"")}</span></div>
        ${v("moku",m?`<span class="in-pol"><i style="background:${pt(m.colour)}"></i>${pt(m.name)}</span>`:'<span class="in-none">no polity recorded</span>')}
        ${l?v("fields",il(l.cultivation))+v("people",lg(l.people))+v("forest",il(l.forest)):""}`}this.inspector.classList.add("show");const h=Math.min(innerWidth-250,t+18),d=Math.max(70,Math.min(innerHeight-120,e+18));this.inspector.style.transform=`translate(${h}px, ${d}px)`}refreshLegend(){const t=this.app,e=t.timeline.era;this.legendEra=e;for(const r of this.legend.querySelectorAll("[data-view]"))r.setAttribute("aria-pressed",String(t.view===r.dataset.view)),r.classList.toggle("on",t.view===r.dataset.view);const n=Ne('[data-view="land"]',this.legend);n.disabled=t.land.available===!1,n.title=n.disabled?"No land layers in this data":"Cultivation, settlement and forest in the chosen year";let i="";if(t.view==="chiefdoms"){const r=t.polity.politiesIn(e);r.length&&(i=`<div class="lg-title">${pt((e==null?void 0:e.label)||"")}</div>${r.map(o=>`<div class="lg"><i style="background:${pt(o.colour)}"></i><b>${pt(o.name)}</b></div>`).join("")}`)}else if(t.view==="land"){const r=t.land.describe();if(this.legendLand=JSON.stringify(r),r){const o=r.years.length>1?`between the ${r.years[0]} and ${r.years[1]} layers`:`the ${r.years[0]} layers`,a=t.land.bound?r.early?`${o}, thinned for the early centuries`:o:"the layers are on their way";i=`<div class="lg-title">${pt((e==null?void 0:e.label)||"")}</div>${r.layers.map(l=>`<div class="lg lg-land"><i class="sw-${l.id}"></i><b>${pt(l.name)}</b>${l.note?`<em>${pt(l.note)}</em>`:""}</div>`).join("")}<div class="lg-note">${pt(a)}</div>`}}this.legendBody.innerHTML=i}setLoading(t){Ne(".loading",this.brand).textContent=t||""}update(t){const e=this.app,n=performance.now();this.timeline.update(t),this.pins.update(e.overlay.pins);const i=e.rig.state.distance,r=(e.view==="land"?zr(i):Or(i))>.25;if(r!==this.legend.classList.contains("show")&&(this.legend.classList.toggle("show",r),this.legend.inert=!r),e.view==="land"&&n-(this.landAt||0)>250&&(this.landAt=n,(JSON.stringify(e.land.describe())!==this.legendLand||!e.land.bound!==this.legendWaiting)&&(this.legendWaiting=!e.land.bound,this.refreshLegend())),n-(this.whereAt||0)>300){this.whereAt=n;const o=e.rig.state.target,a=e.rig.state.distance<1400?e.world.islandAt(o.x,o.z):null;Ne(".where",this.brand).textContent=a?a.pack.name:e.world.archPack.name}}}function il(s){const t=s*100;return t<.5?'<span class="in-none">none</span>':t<1?"under 1%":`${Math.round(t)}%`}function lg(s){return s<.5?'<span class="in-none">none</span>':`about ${(s<10?Math.round(s):Number(s.toPrecision(2))).toLocaleString("en-US")} a km²`}function sl(s){return s.map(t=>`<li>${t.url&&/^https?:/.test(t.url)?`<a href="${pt(t.url)}" target="_blank" rel="noopener">${pt(t.title||t.id)}</a>`:pt(t.title||t.id)}${t.licence?` <em>${pt(t.licence)}</em>`:""}${t.fetched?` <em>fetched ${pt(t.fetched)}</em>`:""}</li>`).join("")}const Cs=document.getElementById("boot"),jl=Cs.querySelector(".boot-bar span"),Kl=Cs.querySelector(".boot-stage"),us=(s,t)=>{Kl.textContent=s,jl.style.width=`${Math.round(t*100)}%`},ps=s=>{console.warn(s)};async function cg(){const s=performance.now();us("reading the gazetteer",.05);const t=await vc(rc(),ps);if(!t.packs.length)throw new Error("the manifest lists no packs");const e=new Z0(document.getElementById("scene"),t,{warn:ps});window.__app=e;const n=new xc(2,ps);us("raising the islands",.25);const i=e.world.archPack;i.data=await n.decode(i),us("placing the boundaries",.8),await new Promise(l=>setTimeout(l,0)),e.start();const r=new og(e);e.ui=r,console.log(`archipelago ready in ${((performance.now()-s)/1e3).toFixed(1)} s`),us("",1);let o=0;const a=()=>{if(++o<4)return requestAnimationFrame(a);Cs.classList.add("gone"),setTimeout(()=>Cs.remove(),1200),hg(e,r,n)};requestAnimationFrame(a)}async function hg(s,t,e){const n=s.rig.state.target,i=a=>Math.hypot((a.rect.x0+a.rect.x1)/2-n.x,(a.rect.z0+a.rect.z1)/2-n.z),r=[...s.world.islandPacks].sort((a,l)=>i(a)-i(l));let o=0;t.setLoading(r.length?`· ${r.length} islands to come`:""),await Promise.all(r.map(async a=>{try{a.data=await e.decode(a),s.addIsland(a)}catch(l){ps(`${a.id}: ${l.message}`)}o++,t.setLoading(o<r.length?`· ${r.length-o} islands to come`:"")})),e.dispose(),s.islandsLoaded=!0,s.land.load()}cg().catch(s=>{console.error(s),Kl.textContent="something went wrong — see the console",jl.style.background="#c0584a"});
