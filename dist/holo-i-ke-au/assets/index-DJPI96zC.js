(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const Ni=100,vh=8,to=9e3,ds=1.3,xh=5.5,eo=100,_h=6e3;function no(s){const t=Math.log(Math.max(1,s)/eo)/Math.log(_h/eo),e=Math.max(0,Math.min(1,t));return ds+(xh-ds)*e*e*(3-2*e)}const uc=2,Nn=5,Ne={far:115,near:75,rig:[95,135],margin:7,band:.5,prefetch:320,linger:25,hold:90},Mh=.024;function yh(){const t=new URLSearchParams(location.search).get("data")||"./data/";return t.endsWith("/")?t:`${t}/`}const wh=Math.PI/180;class Sh{constructor({lat0:t=20.5,lon0:e=-157.5}={}){this.lat0=t,this.lon0=e,this.kx=Math.cos(t*wh)*111320/Ni,this.kz=110574/Ni}x(t){return(t-this.lon0)*this.kx}z(t){return-(t-this.lat0)*this.kz}toWorld(t){return[this.x(t[0]),this.z(t[1])]}toLonLat(t,e){return[t/this.kx+this.lon0,-e/this.kz+this.lat0]}rect([t,e,n,i]){return{x0:this.x(t),z0:this.z(i),x1:this.x(n),z1:this.z(e)}}}function tr(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[ʻʼ‘’'`]/g,"").toLowerCase().replace(/[^a-z]/g,"")}function rn(s){if(!s)return null;if(s.type==="Point")return s.coordinates;if(s.type==="LineString")return s.coordinates[Math.floor(s.coordinates.length/2)];if(s.type==="MultiPoint")return s.coordinates[0];const t=s.type==="Polygon"?[s.coordinates[0]]:s.type==="MultiPolygon"?s.coordinates.map(r=>r[0]):null;if(!t)return null;let e=0,n=0,i=0;for(const r of t)for(let o=0,a=r.length-1;o<r.length;a=o++){const l=r[a][0]*r[o][1]-r[o][0]*r[a][1];e+=l,n+=(r[a][0]+r[o][0])*l,i+=(r[a][1]+r[o][1])*l}return Math.abs(e)<1e-12?t[0][0]:[n/(3*e),i/(3*e)]}async function ni(s){var c;const t=await fetch(s);if(!t.ok)throw new Error(`${s}: HTTP ${t.status}`);const e=await t.blob(),n=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),i=n.width,r=n.height;let o;typeof OffscreenCanvas<"u"?o=new OffscreenCanvas(i,r):(o=document.createElement("canvas"),o.width=i,o.height=r);const a=o.getContext("2d",{willReadFrequently:!0});a.imageSmoothingEnabled=!1,a.drawImage(n,0,0);const l=a.getImageData(0,0,i,r).data;return(c=n.close)==null||c.call(n),{px:l,W:i,H:r}}function fc(s,t,e,n,i,r=4){const o=new Float32Array(t*e);for(let a=0,l=0;a<t*e;a++,l+=r)o[a]=(s[l]*256+s[l+1])*n+i;return o}function dc(s,t,e,n=4){const i=new Uint8Array(t*e);for(let r=0,o=0;r<t*e;r++,o+=n)i[r]=s[o];return i}function bh(s){let t=0,e=0;for(let n=0;n<s.length;n+=7)s[n]>0||(t++,s[n]>-1.6&&e++);return t>100&&e>t*.95}function Eh(s,t,e,n,i){const r=cn(t,e,o=>s[o]>0,n,i);for(let o=0;o<s.length;o++){if(s[o]>0)continue;const a=r[o]/1e3;s[o]=-(1+30*a+3600*(1-Math.exp(-Math.max(0,a-.6)/6)))}}function yn(s,t,e,n,i=1){let r=Float32Array.from(s);const o=new Float32Array(t*e),a=1/(2*n+1);for(let l=0;l<i;l++){for(let c=0;c<e;c++){const h=c*t;let d=0;for(let f=-n;f<=n;f++)d+=r[h+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)o[h+f]=d*a,d+=r[h+Math.min(t-1,f+n+1)]-r[h+Math.max(0,f-n)]}for(let c=0;c<t;c++){let h=0;for(let d=-n;d<=n;d++)h+=o[Math.min(e-1,Math.max(0,d))*t+c];for(let d=0;d<e;d++)r[d*t+c]=h*a,h+=o[Math.min(e-1,d+n+1)*t+c]-o[Math.max(0,d-n)*t+c]}}return r}function io(s,t,e,n,i,r){const o=r*r;let a=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let l=1;l<t;l++){let c=(s[l]+l*l*o-(s[n[a]]+n[a]*n[a]*o))/(2*o*(l-n[a]));for(;c<=i[a];)a--,c=(s[l]+l*l*o-(s[n[a]]+n[a]*n[a]*o))/(2*o*(l-n[a]));a++,n[a]=l,i[a]=c,i[a+1]=1/0}a=0;for(let l=0;l<t;l++){for(;i[a+1]<l;)a++;const c=(l-n[a])*r;e[l]=c*c+s[n[a]]}}function cn(s,t,e,n=1,i=1){const o=new Float64Array(s*t);for(let m=0;m<s*t;m++)o[m]=e(m)?0:1e20;const a=Math.max(s,t),l=new Float64Array(a),c=new Float64Array(a),h=new Int32Array(a),d=new Float64Array(a+1);for(let m=0;m<s;m++){for(let x=0;x<t;x++)l[x]=o[x*s+m];io(l,t,c,h,d,i);for(let x=0;x<t;x++)o[x*s+m]=c[x]}const f=new Float32Array(s*t);for(let m=0;m<t;m++){const x=m*s;for(let g=0;g<s;g++)l[g]=o[x+g];io(l,s,c,h,d,n);for(let g=0;g<s;g++)f[x+g]=Math.sqrt(c[g])}return f}function pc(s,t,e,n,i){const r=Math.max(1,Math.round(Math.max(t,e)/512)),o=Math.ceil(t/r),a=Math.ceil(e/r),l=new Float32Array(o*a);for(let f=0;f<a;f++)for(let m=0;m<o;m++){let x=0,g=0;for(let p=f*r;p<Math.min(e,(f+1)*r);p++)for(let u=m*r;u<Math.min(t,(m+1)*r);u++)x+=Math.max(0,s[p*t+u]),g++;l[f*o+m]=x/g*ds}const c=new Float32Array(o*a),h=[1,2,3,5,7,10,14,19,26,34],d=[];for(let f=0;f<8;f++)d.push([Math.cos(f*Math.PI/4),Math.sin(f*Math.PI/4)]);for(let f=0;f<a;f++)for(let m=0;m<o;m++){const x=l[f*o+m];if(x<=0){c[f*o+m]=1;continue}let g=0;for(const[p,u]of d){let v=0;const _=Math.hypot(p*n,u*i)*r;for(const w of h){const b=Math.round(m+p*w),S=Math.round(f+u*w);if(b<0||S<0||b>=o||S>=a)break;const T=(l[S*o+b]-x)/(w*_);T>v&&(v=T)}g+=v/Math.sqrt(1+v*v)}c[f*o+m]=1-g/8*.95}return{data:c,w:o,h:a,f:r}}function mc(s,t,e,n,i,r){const o=new Uint8Array(t*e*4),a=uc;for(let l=0;l<e;l++){const c=Math.max(0,l-1),h=Math.min(e-1,l+1);for(let d=0;d<t;d++){const f=l*t+d,m=Math.max(0,d-1),x=Math.min(t-1,d+1),g=(s[l*t+x]-s[l*t+m])/((x-m)*n),p=(s[h*t+d]-s[c*t+d])/((h-c)*i),u=-g*a,v=-p*a,_=Math.hypot(u,1,v);o[f*4]=Math.round((u/_*.5+.5)*255),o[f*4+1]=Math.round((1/_*.5+.5)*255),o[f*4+2]=Math.round((v/_*.5+.5)*255);let w=1;if(r){const b=Math.min(r.w-1.001,Math.max(0,(d+.5)/r.f-.5)),S=Math.min(r.h-1.001,Math.max(0,(l+.5)/r.f-.5)),T=b|0,L=S|0,M=b-T,y=S-L,P=L*r.w+T,C=r.data,k=Math.min(r.w-1,T+1)-T,D=Math.min(r.h-1,L+1)-L,F=C[P]+(C[P+k]-C[P])*M,B=C[P+D*r.w]+(C[P+D*r.w+k]-C[P+D*r.w])*M;w=F+(B-F)*y}o[f*4+3]=Math.round(Math.max(0,Math.min(1,w))*255)}}return o}function Th(s,t,e,n,i){const r=t*e,o=n*i/1e6,a=new Float32Array(r);let l=0,c=0;for(let p=0;p<r;p++)s[p]>0&&(a[p]=o,s[p]>l&&(l=s[p]),c++);if(!c)return a;const h=Math.min(65536,Math.ceil(l)+2),d=p=>Math.min(h-1,Math.floor(p/l*(h-2))),f=new Uint32Array(h+1);for(let p=0;p<r;p++)s[p]>0&&f[d(s[p])+1]++;for(let p=0;p<h;p++)f[p+1]+=f[p];const m=new Uint32Array(c),x=f.slice();for(let p=0;p<r;p++)s[p]>0&&(m[x[d(s[p])]++]=p);const g=Math.hypot(n,i);for(let p=c-1;p>=0;p--){const u=m[p],v=u%t,_=(u-v)/t,w=s[u];let b=-1,S=0;for(let T=-1;T<=1;T++){const L=_+T;if(!(L<0||L>=e))for(let M=-1;M<=1;M++){if(!M&&!T)continue;const y=v+M;if(y<0||y>=t)continue;const P=L*t+y,C=(w-s[P])/(M&&T?g:M?n:i);C>S&&(S=C,b=P)}}b>=0&&s[b]>0&&(a[b]+=a[u])}return a}function Ah(s,t,e,n,i,r){const o=e*n,a=new Uint8Array(o*4),l=Th(s,e,n,i,r),c=i*r/1e6,h=Math.max(.04,4*c),d=new Float32Array(o);for(let u=0;u<o;u++)d[u]=s[u]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,l[u])/h)/1.6)):0;const f=yn(d,e,n,1,2),m=cn(e,n,u=>s[u]<=0,i,r),x=new Float32Array(o);for(let u=0;u<n;u++)for(let v=0;v<e;v++){const _=u*e+v;if(s[_]<=0||s[_]>9)continue;const w=Math.min(e-1,v+1),b=Math.max(0,v-1),S=Math.min(n-1,u+1),T=Math.max(0,u-1),L=Math.hypot((s[u*e+w]-s[u*e+b])/((w-b)*i),(s[S*e+v]-s[T*e+v])/((S-T)*r));x[_]=m[_]<260+Math.max(i,r)&&L<.12?1:0}const g=yn(x,e,n,1,1),p=1.5*Math.min(1,70/Math.max(i,r));for(let u=0;u<o;u++)a[u*4]=t?t[u]:s[u]>0?82:0,a[u*4+1]=Math.round(255*Math.min(1,g[u]*p)),a[u*4+2]=Math.round(255*Math.min(1,f[u]*1.6)),a[u*4+3]=0;return a}function Rh({heightPx:s,rainPx:t,W:e,H:n,scale:i,offset:r,mx:o,mz:a,stride:l=4}){const c=fc(s,e,n,i,r,l),h=bh(c);h&&Eh(c,e,n,o,a);const d=t?dc(t,e,n,l):null,f=pc(c,e,n,o,a),m=mc(c,e,n,o,a,f),x=Ah(c,d,e,n,o,a);let g=1/0,p=-1/0;for(let u=0;u<c.length;u++)c[u]<g&&(g=c[u]),c[u]>p&&(p=c[u]);return{metres:c,normals:m,land:x,flatSea:h,lo:g,hi:p}}async function Cn(s,t,e){try{const n=await fetch(s);if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}catch(n){if(t===void 0)throw new Error(`${s}: ${n.message}`);return e==null||e(`${s}: ${n.message} (carrying on without it)`),t}}const ys=(s,t)=>Array.isArray(s)?s:Array.isArray(s==null?void 0:s[t])?s[t]:[];async function Ch(s,t=console.warn){const e=m=>new URL(m,new URL(s,location.href)).href,n=await Cn(e("manifest.json")),[i,r,o,a,l,c,h]=await Promise.all([Cn(e("boundaries/moku.geojson"),null,t),Cn(e("boundaries/ahupuaa.geojson"),null,t),Cn(e("eras.json"),[],t),Cn(e("places.json"),[],t),Cn(e("events.json"),[],t),Cn(e("sources.json"),[],t),Cn(e("polities.json"),{polities:[],byEra:{}},t)]),d=new Sh(n.projection||{}),f=(n.packs||[]).map(m=>Lh(m,d,e));return{base:s,abs:e,manifest:n,proj:d,packs:f,moku:i,ahupuaa:r,eras:ys(o,"eras"),places:ys(a,"places"),events:ys(l,"events"),sources:ys(c,"sources"),polities:{polities:(h==null?void 0:h.polities)||[],byEra:(h==null?void 0:h.byEra)||{}}}}function Lh(s,t,e){var o;const n=t.rect(s.bounds),[i,r]=s.size;return{id:s.id,kind:s.kind,name:s.name||s.id,desc:s,rect:n,W:i,H:r,mx:(n.x1-n.x0)*Ni/i,mz:(n.z1-n.z0)*Ni/r,heightUrl:e(s.height.file),rainUrl:(o=s.rain)!=null&&o.file?e(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,sources:s.sources||[],data:null}}class Ph{constructor(t=2,e=console.warn){this.warn=e,this.jobs=new Map,this.next=1,this.workers=[],this.free=[],this.queue=[];try{for(let n=0;n<t;n++){const i=new Worker(new URL(""+new URL("worker-D-2AoFNa.js",import.meta.url).href,import.meta.url),{type:"module"});i.onmessage=r=>this.message(i,r.data),i.onerror=r=>{var o;(o=r.preventDefault)==null||o.call(r),this.fallback=!0;for(const[a,l]of this.jobs)l.worker===i&&this.mainThread(a,l)},this.workers.push(i),this.free.push(i)}}catch{this.fallback=!0}}decode(t){return new Promise((e,n)=>{const i=this.next++,r={pack:t,resolve:e,reject:n};this.jobs.set(i,r),this.fallback||!this.workers.length?this.mainThread(i,r):(this.queue.push(i),this.pump())})}pump(){for(;this.free.length&&this.queue.length;){const t=this.queue.shift(),e=this.jobs.get(t),n=this.free.pop();e.worker=n;const i=e.pack;n.postMessage({job:t,heightUrl:i.heightUrl,rainUrl:i.rainUrl,W:i.W,H:i.H,scale:i.scale,offset:i.offset,mx:i.mx,mz:i.mz})}}message(t,e){const n=this.jobs.get(e.job);if(n){if(e.warn)return this.warn(e.warn);this.jobs.delete(e.job),this.free.push(t),e.ok?n.resolve(e):/OffscreenCanvas|getContext|createImageBitmap/i.test(e.message)?(this.fallback=!0,this.jobs.set(e.job,n),this.mainThread(e.job,n)):n.reject(new Error(e.message)),this.pump()}}async mainThread(t,e){try{const n=e.pack,i=await ni(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);let r=null;n.rainUrl&&(r=await ni(n.rainUrl).then(a=>a.W===n.W&&a.H===n.H?a.px:null).catch(()=>null));const o=Rh({heightPx:i.px,rainPx:r,W:n.W,H:n.H,scale:n.scale,offset:n.offset,mx:n.mx,mz:n.mz});this.jobs.delete(t),e.resolve(o)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){for(const t of this.workers)t.terminate()}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Da="160",Dh=0,so=1,Uh=2,gc=1,Ih=2,Mn=3,Tn=0,De=1,an=2,zn=0,Ui=1,pa=2,ro=3,ao=4,Nh=5,Qn=100,Fh=101,zh=102,oo=103,lo=104,Oh=200,kh=201,Bh=202,Gh=203,ma=204,ga=205,Hh=206,Vh=207,Wh=208,Xh=209,$h=210,qh=211,jh=212,Yh=213,Kh=214,Zh=0,Jh=1,Qh=2,ir=3,tu=4,eu=5,nu=6,iu=7,vc=0,su=1,ru=2,On=0,au=1,ou=2,lu=3,cu=4,hu=5,uu=6,xc=300,Fi=301,zi=302,va=303,xa=304,gr=306,sr=1e3,ze=1001,_a=1002,ne=1003,co=1004,Ar=1005,be=1006,fu=1007,ai=1008,Me=1009,du=1010,pu=1011,Ua=1012,_c=1013,Sn=1014,bn=1015,kn=1016,Mc=1017,yc=1018,ii=1020,mu=1021,_e=1023,gu=1024,vu=1025,si=1026,Oi=1027,vr=1028,wc=1029,Sc=1030,bc=1031,Ec=1033,Rr=33776,Cr=33777,Lr=33778,Pr=33779,ho=35840,uo=35841,fo=35842,po=35843,Tc=36196,mo=37492,go=37496,vo=37808,xo=37809,_o=37810,Mo=37811,yo=37812,wo=37813,So=37814,bo=37815,Eo=37816,To=37817,Ao=37818,Ro=37819,Co=37820,Lo=37821,Dr=36492,Po=36494,Do=36495,xu=36283,Uo=36284,Io=36285,No=36286,Ac=3e3,ri=3001,_u=3200,Mu=3201,yu=0,wu=1,Je="",xe="srgb",An="srgb-linear",Ia="display-p3",xr="display-p3-linear",rr="linear",ee="srgb",ar="rec709",or="p3",oi=7680,Fo=519,Su=512,bu=513,Eu=514,Rc=515,Tu=516,Au=517,Ru=518,Cu=519,zo=35044,ss=35048,Oo="300 es",Ma=1035,En=2e3,lr=2001;class Bi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const we=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ko=1234567;const rs=Math.PI/180,ps=180/Math.PI;function Gi(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(we[s&255]+we[s>>8&255]+we[s>>16&255]+we[s>>24&255]+"-"+we[t&255]+we[t>>8&255]+"-"+we[t>>16&15|64]+we[t>>24&255]+"-"+we[e&63|128]+we[e>>8&255]+"-"+we[e>>16&255]+we[e>>24&255]+we[n&255]+we[n>>8&255]+we[n>>16&255]+we[n>>24&255]).toLowerCase()}function Pe(s,t,e){return Math.max(t,Math.min(e,s))}function Na(s,t){return(s%t+t)%t}function Lu(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Pu(s,t,e){return s!==t?(e-s)/(t-s):0}function as(s,t,e){return(1-e)*s+e*t}function Du(s,t,e,n){return as(s,t,1-Math.exp(-e*n))}function Uu(s,t=1){return t-Math.abs(Na(s,t*2)-t)}function Iu(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Nu(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Fu(s,t){return s+Math.floor(Math.random()*(t-s+1))}function zu(s,t){return s+Math.random()*(t-s)}function Ou(s){return s*(.5-Math.random())}function ku(s){s!==void 0&&(ko=s);let t=ko+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Bu(s){return s*rs}function Gu(s){return s*ps}function ya(s){return(s&s-1)===0&&s!==0}function Hu(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function cr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Vu(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),m=r((n-t)/2),x=o((n-t)/2);switch(i){case"XYX":s.set(a*h,l*d,l*f,a*c);break;case"YZY":s.set(l*f,a*h,l*d,a*c);break;case"ZXZ":s.set(l*d,l*f,a*h,a*c);break;case"XZX":s.set(a*h,l*x,l*m,a*c);break;case"YXY":s.set(l*m,a*h,l*x,a*c);break;case"ZYZ":s.set(l*x,l*m,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Ai(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ae(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Ce={DEG2RAD:rs,RAD2DEG:ps,generateUUID:Gi,clamp:Pe,euclideanModulo:Na,mapLinear:Lu,inverseLerp:Pu,lerp:as,damp:Du,pingpong:Uu,smoothstep:Iu,smootherstep:Nu,randInt:Fu,randFloat:zu,randFloatSpread:Ou,seededRandom:ku,degToRad:Bu,radToDeg:Gu,isPowerOfTwo:ya,ceilPowerOfTwo:Hu,floorPowerOfTwo:cr,setQuaternionFromProperEuler:Vu,normalize:Ae,denormalize:Ai};class It{constructor(t=0,e=0){It.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Wt{constructor(t,e,n,i,r,o,a,l,c){Wt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],m=n[5],x=n[8],g=i[0],p=i[3],u=i[6],v=i[1],_=i[4],w=i[7],b=i[2],S=i[5],T=i[8];return r[0]=o*g+a*v+l*b,r[3]=o*p+a*_+l*S,r[6]=o*u+a*w+l*T,r[1]=c*g+h*v+d*b,r[4]=c*p+h*_+d*S,r[7]=c*u+h*w+d*T,r[2]=f*g+m*v+x*b,r[5]=f*p+m*_+x*S,r[8]=f*u+m*w+x*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,f=a*l-h*r,m=c*r-o*l,x=e*d+n*f+i*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/x;return t[0]=d*g,t[1]=(i*c-h*n)*g,t[2]=(a*n-i*o)*g,t[3]=f*g,t[4]=(h*e-i*l)*g,t[5]=(i*r-a*e)*g,t[6]=m*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ur.makeScale(t,e)),this}rotate(t){return this.premultiply(Ur.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ur.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ur=new Wt;function Cc(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function hr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Wu(){const s=hr("canvas");return s.style.display="block",s}const Bo={};function os(s){s in Bo||(Bo[s]=!0,console.warn(s))}const Go=new Wt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ho=new Wt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ws={[An]:{transfer:rr,primaries:ar,toReference:s=>s,fromReference:s=>s},[xe]:{transfer:ee,primaries:ar,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[xr]:{transfer:rr,primaries:or,toReference:s=>s.applyMatrix3(Ho),fromReference:s=>s.applyMatrix3(Go)},[Ia]:{transfer:ee,primaries:or,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Ho),fromReference:s=>s.applyMatrix3(Go).convertLinearToSRGB()}},Xu=new Set([An,xr]),Yt={enabled:!0,_workingColorSpace:An,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Xu.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=ws[t].toReference,i=ws[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return ws[s].primaries},getTransfer:function(s){return s===Je?rr:ws[s].transfer}};function Ii(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ir(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let li;class Lc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{li===void 0&&(li=hr("canvas")),li.width=t.width,li.height=t.height;const n=li.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=li}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=hr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ii(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ii(e[n]/255)*255):e[n]=Ii(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let $u=0;class Pc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=Gi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Nr(i[o].image)):r.push(Nr(i[o]))}else r=Nr(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function Nr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Lc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let qu=0;class ke extends Bi{constructor(t=ke.DEFAULT_IMAGE,e=ke.DEFAULT_MAPPING,n=ze,i=ze,r=be,o=ai,a=_e,l=Me,c=ke.DEFAULT_ANISOTROPY,h=Je){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=Gi(),this.name="",this.source=new Pc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new It(0,0),this.repeat=new It(1,1),this.center=new It(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ri?xe:Je),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==xc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case sr:t.x=t.x-Math.floor(t.x);break;case ze:t.x=t.x<0?0:1;break;case _a:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case sr:t.y=t.y-Math.floor(t.y);break;case ze:t.y=t.y<0?0:1;break;case _a:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===xe?ri:Ac}set encoding(t){os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===ri?xe:Je}}ke.DEFAULT_IMAGE=null;ke.DEFAULT_MAPPING=xc;ke.DEFAULT_ANISOTROPY=1;class Zt{constructor(t=0,e=0,n=0,i=1){Zt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],d=l[8],f=l[1],m=l[5],x=l[9],g=l[2],p=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-g)<.01&&Math.abs(x-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+g)<.1&&Math.abs(x+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(c+1)/2,w=(m+1)/2,b=(u+1)/2,S=(h+f)/4,T=(d+g)/4,L=(x+p)/4;return _>w&&_>b?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=S/n,r=T/n):w>b?w<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(w),n=S/i,r=L/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=T/r,i=L/r),this.set(n,i,r,e),this}let v=Math.sqrt((p-x)*(p-x)+(d-g)*(d-g)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(p-x)/v,this.y=(d-g)/v,this.z=(f-h)/v,this.w=Math.acos((c+m+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ju extends Bi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Zt(0,0,t,e),this.scissorTest=!1,this.viewport=new Zt(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(os("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ri?xe:Je),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:be,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new ke(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Pc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class dn extends ju{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Dc extends ke{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ne,this.minFilter=ne,this.wrapR=ze,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yu extends ke{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ne,this.minFilter=ne,this.wrapR=ze,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hi{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const f=r[o+0],m=r[o+1],x=r[o+2],g=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=m,t[e+2]=x,t[e+3]=g;return}if(d!==g||l!==f||c!==m||h!==x){let p=1-a;const u=l*f+c*m+h*x+d*g,v=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){const b=Math.sqrt(_),S=Math.atan2(b,u*v);p=Math.sin(p*S)/b,a=Math.sin(a*S)/b}const w=a*v;if(l=l*p+f*w,c=c*p+m*w,h=h*p+x*w,d=d*p+g*w,p===1-a){const b=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=b,c*=b,h*=b,d*=b}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],f=r[o+1],m=r[o+2],x=r[o+3];return t[e]=a*x+h*d+l*m-c*f,t[e+1]=l*x+h*f+c*d-a*m,t[e+2]=c*x+h*m+a*f-l*d,t[e+3]=h*x-a*d-l*f-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),f=l(n/2),m=l(i/2),x=l(r/2);switch(o){case"XYZ":this._x=f*h*d+c*m*x,this._y=c*m*d-f*h*x,this._z=c*h*x+f*m*d,this._w=c*h*d-f*m*x;break;case"YXZ":this._x=f*h*d+c*m*x,this._y=c*m*d-f*h*x,this._z=c*h*x-f*m*d,this._w=c*h*d+f*m*x;break;case"ZXY":this._x=f*h*d-c*m*x,this._y=c*m*d+f*h*x,this._z=c*h*x+f*m*d,this._w=c*h*d-f*m*x;break;case"ZYX":this._x=f*h*d-c*m*x,this._y=c*m*d+f*h*x,this._z=c*h*x-f*m*d,this._w=c*h*d+f*m*x;break;case"YZX":this._x=f*h*d+c*m*x,this._y=c*m*d+f*h*x,this._z=c*h*x-f*m*d,this._w=c*h*d-f*m*x;break;case"XZY":this._x=f*h*d-c*m*x,this._y=c*m*d-f*h*x,this._z=c*h*x+f*m*d,this._w=c*h*d+f*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-i)*m}else if(n>a&&n>d){const m=2*Math.sqrt(1+n-a-d);this._w=(h-l)/m,this._x=.25*m,this._y=(i+o)/m,this._z=(r+c)/m}else if(a>d){const m=2*Math.sqrt(1+a-n-d);this._w=(r-c)/m,this._x=(i+o)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+d-n-a);this._w=(o-i)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Pe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*i+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=i*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(r),n*Math.cos(r),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,n=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Vo.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Vo.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Fr.copy(this).projectOnVector(t),this.sub(Fr)}reflect(t){return this.sub(Fr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Fr=new N,Vo=new Hi;class on{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Qe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Qe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Qe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Qe):Qe.fromBufferAttribute(r,o),Qe.applyMatrix4(t.matrixWorld),this.expandByPoint(Qe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ss.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ss.copy(n.boundingBox)),Ss.applyMatrix4(t.matrixWorld),this.union(Ss)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Qe),Qe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(qi),bs.subVectors(this.max,qi),ci.subVectors(t.a,qi),hi.subVectors(t.b,qi),ui.subVectors(t.c,qi),Ln.subVectors(hi,ci),Pn.subVectors(ui,hi),Wn.subVectors(ci,ui);let e=[0,-Ln.z,Ln.y,0,-Pn.z,Pn.y,0,-Wn.z,Wn.y,Ln.z,0,-Ln.x,Pn.z,0,-Pn.x,Wn.z,0,-Wn.x,-Ln.y,Ln.x,0,-Pn.y,Pn.x,0,-Wn.y,Wn.x,0];return!zr(e,ci,hi,ui,bs)||(e=[1,0,0,0,1,0,0,0,1],!zr(e,ci,hi,ui,bs))?!1:(Es.crossVectors(Ln,Pn),e=[Es.x,Es.y,Es.z],zr(e,ci,hi,ui,bs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Qe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Qe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const mn=[new N,new N,new N,new N,new N,new N,new N,new N],Qe=new N,Ss=new on,ci=new N,hi=new N,ui=new N,Ln=new N,Pn=new N,Wn=new N,qi=new N,bs=new N,Es=new N,Xn=new N;function zr(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Xn.fromArray(s,r);const a=i.x*Math.abs(Xn.x)+i.y*Math.abs(Xn.y)+i.z*Math.abs(Xn.z),l=t.dot(Xn),c=e.dot(Xn),h=n.dot(Xn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Ku=new on,ji=new N,Or=new N;class Bn{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Ku.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ji.subVectors(t,this.center);const e=ji.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(ji,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Or.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ji.copy(t.center).add(Or)),this.expandByPoint(ji.copy(t.center).sub(Or))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const gn=new N,kr=new N,Ts=new N,Dn=new N,Br=new N,As=new N,Gr=new N;class Fa{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,gn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=gn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(gn.copy(this.origin).addScaledVector(this.direction,e),gn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){kr.copy(t).add(e).multiplyScalar(.5),Ts.copy(e).sub(t).normalize(),Dn.copy(this.origin).sub(kr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Ts),a=Dn.dot(this.direction),l=-Dn.dot(Ts),c=Dn.lengthSq(),h=Math.abs(1-o*o);let d,f,m,x;if(h>0)if(d=o*l-a,f=o*a-l,x=r*h,d>=0)if(f>=-x)if(f<=x){const g=1/h;d*=g,f*=g,m=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f<=-x?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c):f<=x?(d=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(kr).addScaledVector(Ts,f),m}intersectSphere(t,e){gn.subVectors(t.center,this.origin);const n=gn.dot(this.direction),i=gn.dot(gn)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,i=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,i=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(t.min.z-f.z)*d,l=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,l=(t.min.z-f.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,gn)!==null}intersectTriangle(t,e,n,i,r){Br.subVectors(e,t),As.subVectors(n,t),Gr.crossVectors(Br,As);let o=this.direction.dot(Gr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Dn.subVectors(this.origin,t);const l=a*this.direction.dot(As.crossVectors(Dn,As));if(l<0)return null;const c=a*this.direction.dot(Br.cross(Dn));if(c<0||l+c>o)return null;const h=-a*Dn.dot(Gr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Kt{constructor(t,e,n,i,r,o,a,l,c,h,d,f,m,x,g,p){Kt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,d,f,m,x,g,p)}set(t,e,n,i,r,o,a,l,c,h,d,f,m,x,g,p){const u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=i,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=m,u[7]=x,u[11]=g,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Kt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/fi.setFromMatrixColumn(t,0).length(),r=1/fi.setFromMatrixColumn(t,1).length(),o=1/fi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const f=o*h,m=o*d,x=a*h,g=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=m+x*c,e[5]=f-g*c,e[9]=-a*l,e[2]=g-f*c,e[6]=x+m*c,e[10]=o*l}else if(t.order==="YXZ"){const f=l*h,m=l*d,x=c*h,g=c*d;e[0]=f+g*a,e[4]=x*a-m,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=m*a-x,e[6]=g+f*a,e[10]=o*l}else if(t.order==="ZXY"){const f=l*h,m=l*d,x=c*h,g=c*d;e[0]=f-g*a,e[4]=-o*d,e[8]=x+m*a,e[1]=m+x*a,e[5]=o*h,e[9]=g-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const f=o*h,m=o*d,x=a*h,g=a*d;e[0]=l*h,e[4]=x*c-m,e[8]=f*c+g,e[1]=l*d,e[5]=g*c+f,e[9]=m*c-x,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const f=o*l,m=o*c,x=a*l,g=a*c;e[0]=l*h,e[4]=g-f*d,e[8]=x*d+m,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=m*d+x,e[10]=f-g*d}else if(t.order==="XZY"){const f=o*l,m=o*c,x=a*l,g=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=f*d+g,e[5]=o*h,e[9]=m*d-x,e[2]=x*d-m,e[6]=a*h,e[10]=g*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Zu,t,Ju)}lookAt(t,e,n){const i=this.elements;return Ve.subVectors(t,e),Ve.lengthSq()===0&&(Ve.z=1),Ve.normalize(),Un.crossVectors(n,Ve),Un.lengthSq()===0&&(Math.abs(n.z)===1?Ve.x+=1e-4:Ve.z+=1e-4,Ve.normalize(),Un.crossVectors(n,Ve)),Un.normalize(),Rs.crossVectors(Ve,Un),i[0]=Un.x,i[4]=Rs.x,i[8]=Ve.x,i[1]=Un.y,i[5]=Rs.y,i[9]=Ve.y,i[2]=Un.z,i[6]=Rs.z,i[10]=Ve.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],m=n[13],x=n[2],g=n[6],p=n[10],u=n[14],v=n[3],_=n[7],w=n[11],b=n[15],S=i[0],T=i[4],L=i[8],M=i[12],y=i[1],P=i[5],C=i[9],k=i[13],D=i[2],F=i[6],B=i[10],j=i[14],W=i[3],q=i[7],Q=i[11],tt=i[15];return r[0]=o*S+a*y+l*D+c*W,r[4]=o*T+a*P+l*F+c*q,r[8]=o*L+a*C+l*B+c*Q,r[12]=o*M+a*k+l*j+c*tt,r[1]=h*S+d*y+f*D+m*W,r[5]=h*T+d*P+f*F+m*q,r[9]=h*L+d*C+f*B+m*Q,r[13]=h*M+d*k+f*j+m*tt,r[2]=x*S+g*y+p*D+u*W,r[6]=x*T+g*P+p*F+u*q,r[10]=x*L+g*C+p*B+u*Q,r[14]=x*M+g*k+p*j+u*tt,r[3]=v*S+_*y+w*D+b*W,r[7]=v*T+_*P+w*F+b*q,r[11]=v*L+_*C+w*B+b*Q,r[15]=v*M+_*k+w*j+b*tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],f=t[10],m=t[14],x=t[3],g=t[7],p=t[11],u=t[15];return x*(+r*l*d-i*c*d-r*a*f+n*c*f+i*a*m-n*l*m)+g*(+e*l*m-e*c*f+r*o*f-i*o*m+i*c*h-r*l*h)+p*(+e*c*d-e*a*m-r*o*d+n*o*m+r*a*h-n*c*h)+u*(-i*a*h-e*l*d+e*a*f+i*o*d-n*o*f+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],f=t[10],m=t[11],x=t[12],g=t[13],p=t[14],u=t[15],v=d*p*c-g*f*c+g*l*m-a*p*m-d*l*u+a*f*u,_=x*f*c-h*p*c-x*l*m+o*p*m+h*l*u-o*f*u,w=h*g*c-x*d*c+x*a*m-o*g*m-h*a*u+o*d*u,b=x*d*l-h*g*l-x*a*f+o*g*f+h*a*p-o*d*p,S=e*v+n*_+i*w+r*b;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/S;return t[0]=v*T,t[1]=(g*f*r-d*p*r-g*i*m+n*p*m+d*i*u-n*f*u)*T,t[2]=(a*p*r-g*l*r+g*i*c-n*p*c-a*i*u+n*l*u)*T,t[3]=(d*l*r-a*f*r-d*i*c+n*f*c+a*i*m-n*l*m)*T,t[4]=_*T,t[5]=(h*p*r-x*f*r+x*i*m-e*p*m-h*i*u+e*f*u)*T,t[6]=(x*l*r-o*p*r-x*i*c+e*p*c+o*i*u-e*l*u)*T,t[7]=(o*f*r-h*l*r+h*i*c-e*f*c-o*i*m+e*l*m)*T,t[8]=w*T,t[9]=(x*d*r-h*g*r-x*n*m+e*g*m+h*n*u-e*d*u)*T,t[10]=(o*g*r-x*a*r+x*n*c-e*g*c-o*n*u+e*a*u)*T,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*m-e*a*m)*T,t[12]=b*T,t[13]=(h*g*i-x*d*i+x*n*f-e*g*f-h*n*p+e*d*p)*T,t[14]=(x*a*i-o*g*i-x*n*l+e*g*l+o*n*p-e*a*p)*T,t[15]=(o*d*i-h*a*i+h*n*l-e*d*l-o*n*f+e*a*f)*T,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,f=r*c,m=r*h,x=r*d,g=o*h,p=o*d,u=a*d,v=l*c,_=l*h,w=l*d,b=n.x,S=n.y,T=n.z;return i[0]=(1-(g+u))*b,i[1]=(m+w)*b,i[2]=(x-_)*b,i[3]=0,i[4]=(m-w)*S,i[5]=(1-(f+u))*S,i[6]=(p+v)*S,i[7]=0,i[8]=(x+_)*T,i[9]=(p-v)*T,i[10]=(1-(f+g))*T,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=fi.set(i[0],i[1],i[2]).length();const o=fi.set(i[4],i[5],i[6]).length(),a=fi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],tn.copy(this);const c=1/r,h=1/o,d=1/a;return tn.elements[0]*=c,tn.elements[1]*=c,tn.elements[2]*=c,tn.elements[4]*=h,tn.elements[5]*=h,tn.elements[6]*=h,tn.elements[8]*=d,tn.elements[9]*=d,tn.elements[10]*=d,e.setFromRotationMatrix(tn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=En){const l=this.elements,c=2*r/(e-t),h=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i);let m,x;if(a===En)m=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===lr)m=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=En){const l=this.elements,c=1/(e-t),h=1/(n-i),d=1/(o-r),f=(e+t)*c,m=(n+i)*h;let x,g;if(a===En)x=(o+r)*d,g=-2*d;else if(a===lr)x=r*d,g=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=g,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const fi=new N,tn=new Kt,Zu=new N(0,0,0),Ju=new N(1,1,1),Un=new N,Rs=new N,Ve=new N,Wo=new Kt,Xo=new Hi;class _r{constructor(t=0,e=0,n=0,i=_r.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],f=i[6],m=i[10];switch(e){case"XYZ":this._y=Math.asin(Pe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Pe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Pe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Pe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Pe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Pe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Wo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Wo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Xo.setFromEuler(this),this.setFromQuaternion(Xo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_r.DEFAULT_ORDER="XYZ";class za{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Qu=0;const $o=new N,di=new Hi,vn=new Kt,Cs=new N,Yi=new N,tf=new N,ef=new Hi,qo=new N(1,0,0),jo=new N(0,1,0),Yo=new N(0,0,1),nf={type:"added"},sf={type:"removed"};class Be extends Bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=Gi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Be.DEFAULT_UP.clone();const t=new N,e=new _r,n=new Hi,i=new N(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Kt},normalMatrix:{value:new Wt}}),this.matrix=new Kt,this.matrixWorld=new Kt,this.matrixAutoUpdate=Be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new za,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return di.setFromAxisAngle(t,e),this.quaternion.multiply(di),this}rotateOnWorldAxis(t,e){return di.setFromAxisAngle(t,e),this.quaternion.premultiply(di),this}rotateX(t){return this.rotateOnAxis(qo,t)}rotateY(t){return this.rotateOnAxis(jo,t)}rotateZ(t){return this.rotateOnAxis(Yo,t)}translateOnAxis(t,e){return $o.copy(t).applyQuaternion(this.quaternion),this.position.add($o.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(qo,t)}translateY(t){return this.translateOnAxis(jo,t)}translateZ(t){return this.translateOnAxis(Yo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(vn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Cs.copy(t):Cs.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Yi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vn.lookAt(Yi,Cs,this.up):vn.lookAt(Cs,Yi,this.up),this.quaternion.setFromRotationMatrix(vn),i&&(vn.extractRotation(i.matrixWorld),di.setFromRotationMatrix(vn),this.quaternion.premultiply(di.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(nf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(sf)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),vn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),vn.multiply(t.parent.matrixWorld)),t.applyMatrix4(vn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,t,tf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,ef,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),m=o(t.animations),x=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),x.length>0&&(n.nodes=x)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Be.DEFAULT_UP=new N(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const en=new N,xn=new N,Hr=new N,_n=new N,pi=new N,mi=new N,Ko=new N,Vr=new N,Wr=new N,Xr=new N;let Ls=!1;class sn{constructor(t=new N,e=new N,n=new N){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),en.subVectors(t,e),i.cross(en);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){en.subVectors(i,e),xn.subVectors(n,e),Hr.subVectors(t,e);const o=en.dot(en),a=en.dot(xn),l=en.dot(Hr),c=xn.dot(xn),h=xn.dot(Hr),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const f=1/d,m=(c*l-a*h)*f,x=(o*h-a*l)*f;return r.set(1-m-x,x,m)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,_n)===null?!1:_n.x>=0&&_n.y>=0&&_n.x+_n.y<=1}static getUV(t,e,n,i,r,o,a,l){return Ls===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ls=!0),this.getInterpolation(t,e,n,i,r,o,a,l)}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,_n)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,_n.x),l.addScaledVector(o,_n.y),l.addScaledVector(a,_n.z),l)}static isFrontFacing(t,e,n,i){return en.subVectors(n,e),xn.subVectors(t,e),en.cross(xn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return en.subVectors(this.c,this.b),xn.subVectors(this.a,this.b),en.cross(xn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return sn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return sn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,r){return Ls===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ls=!0),sn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}getInterpolation(t,e,n,i,r){return sn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return sn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return sn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;pi.subVectors(i,n),mi.subVectors(r,n),Vr.subVectors(t,n);const l=pi.dot(Vr),c=mi.dot(Vr);if(l<=0&&c<=0)return e.copy(n);Wr.subVectors(t,i);const h=pi.dot(Wr),d=mi.dot(Wr);if(h>=0&&d<=h)return e.copy(i);const f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(pi,o);Xr.subVectors(t,r);const m=pi.dot(Xr),x=mi.dot(Xr);if(x>=0&&m<=x)return e.copy(r);const g=m*c-l*x;if(g<=0&&c>=0&&x<=0)return a=c/(c-x),e.copy(n).addScaledVector(mi,a);const p=h*x-m*d;if(p<=0&&d-h>=0&&m-x>=0)return Ko.subVectors(r,i),a=(d-h)/(d-h+(m-x)),e.copy(i).addScaledVector(Ko,a);const u=1/(p+g+f);return o=g*u,a=f*u,e.copy(n).addScaledVector(pi,o).addScaledVector(mi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Uc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},In={h:0,s:0,l:0},Ps={h:0,s:0,l:0};function $r(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Ct{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=xe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Yt.workingColorSpace){if(t=Na(t,1),e=Pe(e,0,1),n=Pe(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=$r(o,r,t+1/3),this.g=$r(o,r,t),this.b=$r(o,r,t-1/3)}return Yt.toWorkingColorSpace(this,i),this}setStyle(t,e=xe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=xe){const n=Uc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ii(t.r),this.g=Ii(t.g),this.b=Ii(t.b),this}copyLinearToSRGB(t){return this.r=Ir(t.r),this.g=Ir(t.g),this.b=Ir(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=xe){return Yt.fromWorkingColorSpace(Se.copy(this),t),Math.round(Pe(Se.r*255,0,255))*65536+Math.round(Pe(Se.g*255,0,255))*256+Math.round(Pe(Se.b*255,0,255))}getHexString(t=xe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(Se.copy(this),e);const n=Se.r,i=Se.g,r=Se.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(Se.copy(this),e),t.r=Se.r,t.g=Se.g,t.b=Se.b,t}getStyle(t=xe){Yt.fromWorkingColorSpace(Se.copy(this),t);const e=Se.r,n=Se.g,i=Se.b;return t!==xe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(In),this.setHSL(In.h+t,In.s+e,In.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(In),t.getHSL(Ps);const n=as(In.h,Ps.h,e),i=as(In.s,Ps.s,e),r=as(In.l,Ps.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Se=new Ct;Ct.NAMES=Uc;let rf=0;class ms extends Bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=Gi(),this.name="",this.type="Material",this.blending=Ui,this.side=Tn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ma,this.blendDst=ga,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ct(0,0,0),this.blendAlpha=0,this.depthFunc=ir,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=oi,this.stencilZFail=oi,this.stencilZPass=oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ui&&(n.blending=this.blending),this.side!==Tn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ma&&(n.blendSrc=this.blendSrc),this.blendDst!==ga&&(n.blendDst=this.blendDst),this.blendEquation!==Qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ir&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==oi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==oi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==oi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ic extends ms{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=vc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ce=new N,Ds=new It;class ue{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=zo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=bn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ds.fromBufferAttribute(this,e),Ds.applyMatrix3(t),this.setXY(e,Ds.x,Ds.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyMatrix3(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyMatrix4(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyNormalMatrix(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.transformDirection(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ai(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ae(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ai(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ai(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ai(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ai(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),n=Ae(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),n=Ae(n,this.array),i=Ae(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),n=Ae(n,this.array),i=Ae(i,this.array),r=Ae(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==zo&&(t.usage=this.usage),t}}class Nc extends ue{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Fc extends ue{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends ue{constructor(t,e,n){super(new Float32Array(t),e,n)}}let af=0;const Ke=new Kt,qr=new Be,gi=new N,We=new on,Ki=new on,ve=new N;class Ue extends Bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=Gi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Cc(t)?Fc:Nc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Wt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,n){return Ke.makeTranslation(t,e,n),this.applyMatrix4(Ke),this}scale(t,e,n){return Ke.makeScale(t,e,n),this.applyMatrix4(Ke),this}lookAt(t){return qr.lookAt(t),qr.updateMatrix(),this.applyMatrix4(qr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gi).negate(),this.translate(gi.x,gi.y,gi.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new he(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new on);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];We.setFromBufferAttribute(r),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new N,1/0);return}if(t){const n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Ki.setFromBufferAttribute(a),this.morphTargetsRelative?(ve.addVectors(We.min,Ki.min),We.expandByPoint(ve),ve.addVectors(We.max,Ki.max),We.expandByPoint(ve)):(We.expandByPoint(Ki.min),We.expandByPoint(Ki.max))}We.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)ve.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(ve));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ve.fromBufferAttribute(a,c),l&&(gi.fromBufferAttribute(t,c),ve.add(gi)),i=Math.max(i,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,r=e.normal.array,o=e.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ue(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let y=0;y<a;y++)c[y]=new N,h[y]=new N;const d=new N,f=new N,m=new N,x=new It,g=new It,p=new It,u=new N,v=new N;function _(y,P,C){d.fromArray(i,y*3),f.fromArray(i,P*3),m.fromArray(i,C*3),x.fromArray(o,y*2),g.fromArray(o,P*2),p.fromArray(o,C*2),f.sub(d),m.sub(d),g.sub(x),p.sub(x);const k=1/(g.x*p.y-p.x*g.y);isFinite(k)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(m,-g.y).multiplyScalar(k),v.copy(m).multiplyScalar(g.x).addScaledVector(f,-p.x).multiplyScalar(k),c[y].add(u),c[P].add(u),c[C].add(u),h[y].add(v),h[P].add(v),h[C].add(v))}let w=this.groups;w.length===0&&(w=[{start:0,count:n.length}]);for(let y=0,P=w.length;y<P;++y){const C=w[y],k=C.start,D=C.count;for(let F=k,B=k+D;F<B;F+=3)_(n[F+0],n[F+1],n[F+2])}const b=new N,S=new N,T=new N,L=new N;function M(y){T.fromArray(r,y*3),L.copy(T);const P=c[y];b.copy(P),b.sub(T.multiplyScalar(T.dot(P))).normalize(),S.crossVectors(L,P);const k=S.dot(h[y])<0?-1:1;l[y*4]=b.x,l[y*4+1]=b.y,l[y*4+2]=b.z,l[y*4+3]=k}for(let y=0,P=w.length;y<P;++y){const C=w[y],k=C.start,D=C.count;for(let F=k,B=k+D;F<B;F+=3)M(n[F+0]),M(n[F+1]),M(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ue(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const i=new N,r=new N,o=new N,a=new N,l=new N,c=new N,h=new N,d=new N;if(t)for(let f=0,m=t.count;f<m;f+=3){const x=t.getX(f+0),g=t.getX(f+1),p=t.getX(f+2);i.fromBufferAttribute(e,x),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=e.count;f<m;f+=3)i.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,f=new c.constructor(l.length*h);let m=0,x=0;for(let g=0,p=l.length;g<p;g++){a.isInterleavedBufferAttribute?m=l[g]*a.data.stride+a.offset:m=l[g]*h;for(let u=0;u<h;u++)f[x++]=c[m++]}return new ue(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ue,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const f=c[h],m=t(f,n);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){const m=c[d];h.push(m.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let f=0,m=d.length;f<m;f++)h.push(d[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zo=new Kt,$n=new Fa,Us=new Bn,Jo=new N,vi=new N,xi=new N,_i=new N,jr=new N,Is=new N,Ns=new It,Fs=new It,zs=new It,Qo=new N,tl=new N,el=new N,Os=new N,ks=new N;class le extends Be{constructor(t=new Ue,e=new Ic){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){Is.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(jr.fromBufferAttribute(d,t),o?Is.addScaledVector(jr,h):Is.addScaledVector(jr.sub(e),h))}e.add(Is)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Us.copy(n.boundingSphere),Us.applyMatrix4(r),$n.copy(t.ray).recast(t.near),!(Us.containsPoint($n.origin)===!1&&($n.intersectSphere(Us,Jo)===null||$n.origin.distanceToSquared(Jo)>(t.far-t.near)**2))&&(Zo.copy(r).invert(),$n.copy(t.ray).applyMatrix4(Zo),!(n.boundingBox!==null&&$n.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,$n)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,g=f.length;x<g;x++){const p=f[x],u=o[p.materialIndex],v=Math.max(p.start,m.start),_=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let w=v,b=_;w<b;w+=3){const S=a.getX(w),T=a.getX(w+1),L=a.getX(w+2);i=Bs(this,u,t,n,c,h,d,S,T,L),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const x=Math.max(0,m.start),g=Math.min(a.count,m.start+m.count);for(let p=x,u=g;p<u;p+=3){const v=a.getX(p),_=a.getX(p+1),w=a.getX(p+2);i=Bs(this,o,t,n,c,h,d,v,_,w),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let x=0,g=f.length;x<g;x++){const p=f[x],u=o[p.materialIndex],v=Math.max(p.start,m.start),_=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let w=v,b=_;w<b;w+=3){const S=w,T=w+1,L=w+2;i=Bs(this,u,t,n,c,h,d,S,T,L),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const x=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let p=x,u=g;p<u;p+=3){const v=p,_=p+1,w=p+2;i=Bs(this,o,t,n,c,h,d,v,_,w),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function of(s,t,e,n,i,r,o,a){let l;if(t.side===De?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===Tn,a),l===null)return null;ks.copy(a),ks.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(ks);return c<e.near||c>e.far?null:{distance:c,point:ks.clone(),object:s}}function Bs(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,vi),s.getVertexPosition(l,xi),s.getVertexPosition(c,_i);const h=of(s,t,e,n,vi,xi,_i,Os);if(h){i&&(Ns.fromBufferAttribute(i,a),Fs.fromBufferAttribute(i,l),zs.fromBufferAttribute(i,c),h.uv=sn.getInterpolation(Os,vi,xi,_i,Ns,Fs,zs,new It)),r&&(Ns.fromBufferAttribute(r,a),Fs.fromBufferAttribute(r,l),zs.fromBufferAttribute(r,c),h.uv1=sn.getInterpolation(Os,vi,xi,_i,Ns,Fs,zs,new It),h.uv2=h.uv1),o&&(Qo.fromBufferAttribute(o,a),tl.fromBufferAttribute(o,l),el.fromBufferAttribute(o,c),h.normal=sn.getInterpolation(Os,vi,xi,_i,Qo,tl,el,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new N,materialIndex:0};sn.getNormal(vi,xi,_i,d.normal),h.face=d}return h}class gs extends Ue{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let f=0,m=0;x("z","y","x",-1,-1,n,e,t,o,r,0),x("z","y","x",1,-1,n,e,-t,o,r,1),x("x","z","y",1,1,t,n,e,i,o,2),x("x","z","y",1,-1,t,n,-e,i,o,3),x("x","y","z",1,-1,t,e,n,i,r,4),x("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new he(c,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(d,2));function x(g,p,u,v,_,w,b,S,T,L,M){const y=w/T,P=b/L,C=w/2,k=b/2,D=S/2,F=T+1,B=L+1;let j=0,W=0;const q=new N;for(let Q=0;Q<B;Q++){const tt=Q*P-k;for(let ut=0;ut<F;ut++){const X=ut*y-C;q[g]=X*v,q[p]=tt*_,q[u]=D,c.push(q.x,q.y,q.z),q[g]=0,q[p]=0,q[u]=S>0?1:-1,h.push(q.x,q.y,q.z),d.push(ut/T),d.push(1-Q/L),j+=1}}for(let Q=0;Q<L;Q++)for(let tt=0;tt<T;tt++){const ut=f+tt+F*Q,X=f+tt+F*(Q+1),et=f+(tt+1)+F*(Q+1),ft=f+(tt+1)+F*Q;l.push(ut,X,ft),l.push(X,et,ft),W+=6}a.addGroup(m,W,M),m+=W,f+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ki(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Re(s){const t={};for(let e=0;e<s.length;e++){const n=ki(s[e]);for(const i in n)t[i]=n[i]}return t}function lf(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function zc(s){return s.getRenderTarget()===null?s.outputColorSpace:Yt.workingColorSpace}const cf={clone:ki,merge:Re};var hf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,uf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class fe extends ms{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hf,this.fragmentShader=uf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ki(t.uniforms),this.uniformsGroups=lf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Oc extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Kt,this.projectionMatrix=new Kt,this.projectionMatrixInverse=new Kt,this.coordinateSystem=En}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class $e extends Oc{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ps*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(rs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ps*2*Math.atan(Math.tan(rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(rs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Mi=-90,yi=1;class ff extends Be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new $e(Mi,yi,t,e);i.layers=this.layers,this.add(i);const r=new $e(Mi,yi,t,e);r.layers=this.layers,this.add(r);const o=new $e(Mi,yi,t,e);o.layers=this.layers,this.add(o);const a=new $e(Mi,yi,t,e);a.layers=this.layers,this.add(a);const l=new $e(Mi,yi,t,e);l.layers=this.layers,this.add(l);const c=new $e(Mi,yi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===En)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===lr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),f=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(d,f,m),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class kc extends ke{constructor(t,e,n,i,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Fi,super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class df extends dn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(os("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===ri?xe:Je),this.texture=new kc(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:be}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new gs(5,5,5),r=new fe({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:De,blending:zn});r.uniforms.tEquirect.value=e;const o=new le(i,r),a=e.minFilter;return e.minFilter===ai&&(e.minFilter=be),new ff(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}const Yr=new N,pf=new N,mf=new Wt;class Kn{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Yr.subVectors(n,e).cross(pf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Yr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||mf.getNormalMatrix(t),i=this.coplanarPoint(Yr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qn=new Bn,Gs=new N;class Vi{constructor(t=new Kn,e=new Kn,n=new Kn,i=new Kn,r=new Kn,o=new Kn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=En){const n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],d=i[6],f=i[7],m=i[8],x=i[9],g=i[10],p=i[11],u=i[12],v=i[13],_=i[14],w=i[15];if(n[0].setComponents(l-r,f-c,p-m,w-u).normalize(),n[1].setComponents(l+r,f+c,p+m,w+u).normalize(),n[2].setComponents(l+o,f+h,p+x,w+v).normalize(),n[3].setComponents(l-o,f-h,p-x,w-v).normalize(),n[4].setComponents(l-a,f-d,p-g,w-_).normalize(),e===En)n[5].setComponents(l+a,f+d,p+g,w+_).normalize();else if(e===lr)n[5].setComponents(a,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qn)}intersectsSprite(t){return qn.center.set(0,0,0),qn.radius=.7071067811865476,qn.applyMatrix4(t.matrixWorld),this.intersectsSphere(qn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Gs.x=i.normal.x>0?t.max.x:t.min.x,Gs.y=i.normal.y>0?t.max.y:t.min.y,Gs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Gs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Bc(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function gf(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,h){const d=c.array,f=c.usage,m=d.byteLength,x=s.createBuffer();s.bindBuffer(h,x),s.bufferData(h,d,f),c.onUploadCallback();let g;if(d instanceof Float32Array)g=s.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=s.UNSIGNED_SHORT;else if(d instanceof Int16Array)g=s.SHORT;else if(d instanceof Uint32Array)g=s.UNSIGNED_INT;else if(d instanceof Int32Array)g=s.INT;else if(d instanceof Int8Array)g=s.BYTE;else if(d instanceof Uint8Array)g=s.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)g=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:x,type:g,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version,size:m}}function r(c,h,d){const f=h.array,m=h._updateRange,x=h.updateRanges;if(s.bindBuffer(d,c),m.count===-1&&x.length===0&&s.bufferSubData(d,0,f),x.length!==0){for(let g=0,p=x.length;g<p;g++){const u=x[g];e?s.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f,u.start,u.count):s.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}m.count!==-1&&(e?s.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):s.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const d=n.get(c);if(d===void 0)n.set(c,i(c,h));else if(d.version<c.version){if(d.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,c,h),d.version=c.version}}return{get:o,remove:a,update:l}}class Oa extends Ue{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=t/a,f=e/l,m=[],x=[],g=[],p=[];for(let u=0;u<h;u++){const v=u*f-o;for(let _=0;_<c;_++){const w=_*d-r;x.push(w,-v,0),g.push(0,0,1),p.push(_/a),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let v=0;v<a;v++){const _=v+c*u,w=v+c*(u+1),b=v+1+c*(u+1),S=v+1+c*u;m.push(_,w,S),m.push(w,b,S)}this.setIndex(m),this.setAttribute("position",new he(x,3)),this.setAttribute("normal",new he(g,3)),this.setAttribute("uv",new he(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oa(t.width,t.height,t.widthSegments,t.heightSegments)}}var vf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,xf=`#ifdef USE_ALPHAHASH
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
#endif`,_f=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,wf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Sf=`#ifdef USE_AOMAP
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
#endif`,bf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ef=`#ifdef USE_BATCHING
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
#endif`,Tf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Af=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Rf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Lf=`#ifdef USE_IRIDESCENCE
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
#endif`,Pf=`#ifdef USE_BUMPMAP
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
#endif`,Df=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Uf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,If=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ff=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Of=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,kf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Bf=`#define PI 3.141592653589793
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
} // validated`,Gf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Hf=`vec3 transformedNormal = objectNormal;
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
#endif`,Vf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$f=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qf="gl_FragColor = linearToOutputTexel( gl_FragColor );",jf=`
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
}`,Yf=`#ifdef USE_ENVMAP
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
#endif`,Kf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zf=`#ifdef USE_ENVMAP
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
#endif`,Jf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qf=`#ifdef USE_ENVMAP
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
#endif`,td=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ed=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,nd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,id=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sd=`#ifdef USE_GRADIENTMAP
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
}`,rd=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,ad=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,od=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ld=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,cd=`uniform bool receiveShadow;
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
#endif`,hd=`#ifdef USE_ENVMAP
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
#endif`,ud=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,md=`PhysicalMaterial material;
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
#endif`,gd=`struct PhysicalMaterial {
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
}`,vd=`
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
#endif`,xd=`#if defined( RE_IndirectDiffuse )
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
#endif`,_d=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Md=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Sd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,bd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ed=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Td=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ad=`#if defined( USE_POINTS_UV )
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
#endif`,Rd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ld=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Pd=`#ifdef USE_MORPHNORMALS
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
#endif`,Dd=`#ifdef USE_MORPHTARGETS
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
#endif`,Ud=`#ifdef USE_MORPHTARGETS
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
#endif`,Id=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Nd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Fd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Od=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,kd=`#ifdef USE_NORMALMAP
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
#endif`,Bd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Hd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,$d=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Kd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Jd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ep=`float getShadowMask() {
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
}`,np=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ip=`#ifdef USE_SKINNING
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
#endif`,sp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rp=`#ifdef USE_SKINNING
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
#endif`,ap=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,op=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,hp=`#ifdef USE_TRANSMISSION
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
#endif`,up=`#ifdef USE_TRANSMISSION
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
#endif`,fp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const gp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,vp=`uniform sampler2D t2D;
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
}`,xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_p=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wp=`#include <common>
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
}`,Sp=`#if DEPTH_PACKING == 3200
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
}`,bp=`#define DISTANCE
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
}`,Ep=`#define DISTANCE
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
}`,Tp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ap=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rp=`uniform float scale;
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
}`,Cp=`uniform vec3 diffuse;
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
}`,Lp=`#include <common>
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
}`,Pp=`uniform vec3 diffuse;
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
}`,Dp=`#define LAMBERT
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
}`,Up=`#define LAMBERT
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
}`,Ip=`#define MATCAP
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
}`,Np=`#define MATCAP
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
}`,Fp=`#define NORMAL
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
}`,zp=`#define NORMAL
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
}`,Op=`#define PHONG
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
}`,kp=`#define PHONG
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
}`,Bp=`#define STANDARD
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
}`,Gp=`#define STANDARD
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
}`,Hp=`#define TOON
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
}`,Vp=`#define TOON
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
}`,Wp=`uniform float size;
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
}`,Xp=`uniform vec3 diffuse;
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
}`,$p=`#include <common>
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
}`,qp=`uniform vec3 color;
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
}`,jp=`uniform float rotation;
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
}`,Yp=`uniform vec3 diffuse;
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
}`,Ot={alphahash_fragment:vf,alphahash_pars_fragment:xf,alphamap_fragment:_f,alphamap_pars_fragment:Mf,alphatest_fragment:yf,alphatest_pars_fragment:wf,aomap_fragment:Sf,aomap_pars_fragment:bf,batching_pars_vertex:Ef,batching_vertex:Tf,begin_vertex:Af,beginnormal_vertex:Rf,bsdfs:Cf,iridescence_fragment:Lf,bumpmap_pars_fragment:Pf,clipping_planes_fragment:Df,clipping_planes_pars_fragment:Uf,clipping_planes_pars_vertex:If,clipping_planes_vertex:Nf,color_fragment:Ff,color_pars_fragment:zf,color_pars_vertex:Of,color_vertex:kf,common:Bf,cube_uv_reflection_fragment:Gf,defaultnormal_vertex:Hf,displacementmap_pars_vertex:Vf,displacementmap_vertex:Wf,emissivemap_fragment:Xf,emissivemap_pars_fragment:$f,colorspace_fragment:qf,colorspace_pars_fragment:jf,envmap_fragment:Yf,envmap_common_pars_fragment:Kf,envmap_pars_fragment:Zf,envmap_pars_vertex:Jf,envmap_physical_pars_fragment:hd,envmap_vertex:Qf,fog_vertex:td,fog_pars_vertex:ed,fog_fragment:nd,fog_pars_fragment:id,gradientmap_pars_fragment:sd,lightmap_fragment:rd,lightmap_pars_fragment:ad,lights_lambert_fragment:od,lights_lambert_pars_fragment:ld,lights_pars_begin:cd,lights_toon_fragment:ud,lights_toon_pars_fragment:fd,lights_phong_fragment:dd,lights_phong_pars_fragment:pd,lights_physical_fragment:md,lights_physical_pars_fragment:gd,lights_fragment_begin:vd,lights_fragment_maps:xd,lights_fragment_end:_d,logdepthbuf_fragment:Md,logdepthbuf_pars_fragment:yd,logdepthbuf_pars_vertex:wd,logdepthbuf_vertex:Sd,map_fragment:bd,map_pars_fragment:Ed,map_particle_fragment:Td,map_particle_pars_fragment:Ad,metalnessmap_fragment:Rd,metalnessmap_pars_fragment:Cd,morphcolor_vertex:Ld,morphnormal_vertex:Pd,morphtarget_pars_vertex:Dd,morphtarget_vertex:Ud,normal_fragment_begin:Id,normal_fragment_maps:Nd,normal_pars_fragment:Fd,normal_pars_vertex:zd,normal_vertex:Od,normalmap_pars_fragment:kd,clearcoat_normal_fragment_begin:Bd,clearcoat_normal_fragment_maps:Gd,clearcoat_pars_fragment:Hd,iridescence_pars_fragment:Vd,opaque_fragment:Wd,packing:Xd,premultiplied_alpha_fragment:$d,project_vertex:qd,dithering_fragment:jd,dithering_pars_fragment:Yd,roughnessmap_fragment:Kd,roughnessmap_pars_fragment:Zd,shadowmap_pars_fragment:Jd,shadowmap_pars_vertex:Qd,shadowmap_vertex:tp,shadowmask_pars_fragment:ep,skinbase_vertex:np,skinning_pars_vertex:ip,skinning_vertex:sp,skinnormal_vertex:rp,specularmap_fragment:ap,specularmap_pars_fragment:op,tonemapping_fragment:lp,tonemapping_pars_fragment:cp,transmission_fragment:hp,transmission_pars_fragment:up,uv_pars_fragment:fp,uv_pars_vertex:dp,uv_vertex:pp,worldpos_vertex:mp,background_vert:gp,background_frag:vp,backgroundCube_vert:xp,backgroundCube_frag:_p,cube_vert:Mp,cube_frag:yp,depth_vert:wp,depth_frag:Sp,distanceRGBA_vert:bp,distanceRGBA_frag:Ep,equirect_vert:Tp,equirect_frag:Ap,linedashed_vert:Rp,linedashed_frag:Cp,meshbasic_vert:Lp,meshbasic_frag:Pp,meshlambert_vert:Dp,meshlambert_frag:Up,meshmatcap_vert:Ip,meshmatcap_frag:Np,meshnormal_vert:Fp,meshnormal_frag:zp,meshphong_vert:Op,meshphong_frag:kp,meshphysical_vert:Bp,meshphysical_frag:Gp,meshtoon_vert:Hp,meshtoon_frag:Vp,points_vert:Wp,points_frag:Xp,shadow_vert:$p,shadow_frag:qp,sprite_vert:jp,sprite_frag:Yp},ht={common:{diffuse:{value:new Ct(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new It(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ct(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ct(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new Ct(16777215)},opacity:{value:1},center:{value:new It(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},hn={basic:{uniforms:Re([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:Ot.meshbasic_vert,fragmentShader:Ot.meshbasic_frag},lambert:{uniforms:Re([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Ct(0)}}]),vertexShader:Ot.meshlambert_vert,fragmentShader:Ot.meshlambert_frag},phong:{uniforms:Re([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Ct(0)},specular:{value:new Ct(1118481)},shininess:{value:30}}]),vertexShader:Ot.meshphong_vert,fragmentShader:Ot.meshphong_frag},standard:{uniforms:Re([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new Ct(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag},toon:{uniforms:Re([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new Ct(0)}}]),vertexShader:Ot.meshtoon_vert,fragmentShader:Ot.meshtoon_frag},matcap:{uniforms:Re([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:Ot.meshmatcap_vert,fragmentShader:Ot.meshmatcap_frag},points:{uniforms:Re([ht.points,ht.fog]),vertexShader:Ot.points_vert,fragmentShader:Ot.points_frag},dashed:{uniforms:Re([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ot.linedashed_vert,fragmentShader:Ot.linedashed_frag},depth:{uniforms:Re([ht.common,ht.displacementmap]),vertexShader:Ot.depth_vert,fragmentShader:Ot.depth_frag},normal:{uniforms:Re([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:Ot.meshnormal_vert,fragmentShader:Ot.meshnormal_frag},sprite:{uniforms:Re([ht.sprite,ht.fog]),vertexShader:Ot.sprite_vert,fragmentShader:Ot.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ot.background_vert,fragmentShader:Ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ot.backgroundCube_vert,fragmentShader:Ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ot.cube_vert,fragmentShader:Ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ot.equirect_vert,fragmentShader:Ot.equirect_frag},distanceRGBA:{uniforms:Re([ht.common,ht.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ot.distanceRGBA_vert,fragmentShader:Ot.distanceRGBA_frag},shadow:{uniforms:Re([ht.lights,ht.fog,{color:{value:new Ct(0)},opacity:{value:1}}]),vertexShader:Ot.shadow_vert,fragmentShader:Ot.shadow_frag}};hn.physical={uniforms:Re([hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new It(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new Ct(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new It},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new Ct(0)},specularColor:{value:new Ct(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new It},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag};const Hs={r:0,b:0,g:0};function Kp(s,t,e,n,i,r,o){const a=new Ct(0);let l=r===!0?0:1,c,h,d=null,f=0,m=null;function x(p,u){let v=!1,_=u.isScene===!0?u.background:null;_&&_.isTexture&&(_=(u.backgroundBlurriness>0?e:t).get(_)),_===null?g(a,l):_&&_.isColor&&(g(_,1),v=!0);const w=s.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||v)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),_&&(_.isCubeTexture||_.mapping===gr)?(h===void 0&&(h=new le(new gs(1,1,1),new fe({name:"BackgroundCubeMaterial",uniforms:ki(hn.backgroundCube.uniforms),vertexShader:hn.backgroundCube.vertexShader,fragmentShader:hn.backgroundCube.fragmentShader,side:De,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=Yt.getTransfer(_.colorSpace)!==ee,(d!==_||f!==_.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,d=_,f=_.version,m=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new le(new Oa(2,2),new fe({name:"BackgroundMaterial",uniforms:ki(hn.background.uniforms),vertexShader:hn.background.vertexShader,fragmentShader:hn.background.fragmentShader,side:Tn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(_.colorSpace)!==ee,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||m!==s.toneMapping)&&(c.material.needsUpdate=!0,d=_,f=_.version,m=s.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function g(p,u){p.getRGB(Hs,zc(s)),n.buffers.color.setClear(Hs.r,Hs.g,Hs.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),l=u,g(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,g(a,l)},render:x}}function Zp(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null);let c=l,h=!1;function d(D,F,B,j,W){let q=!1;if(o){const Q=g(j,B,F);c!==Q&&(c=Q,m(c.object)),q=u(D,j,B,W),q&&v(D,j,B,W)}else{const Q=F.wireframe===!0;(c.geometry!==j.id||c.program!==B.id||c.wireframe!==Q)&&(c.geometry=j.id,c.program=B.id,c.wireframe=Q,q=!0)}W!==null&&e.update(W,s.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,L(D,F,B,j),W!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function f(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function m(D){return n.isWebGL2?s.bindVertexArray(D):r.bindVertexArrayOES(D)}function x(D){return n.isWebGL2?s.deleteVertexArray(D):r.deleteVertexArrayOES(D)}function g(D,F,B){const j=B.wireframe===!0;let W=a[D.id];W===void 0&&(W={},a[D.id]=W);let q=W[F.id];q===void 0&&(q={},W[F.id]=q);let Q=q[j];return Q===void 0&&(Q=p(f()),q[j]=Q),Q}function p(D){const F=[],B=[],j=[];for(let W=0;W<i;W++)F[W]=0,B[W]=0,j[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:B,attributeDivisors:j,object:D,attributes:{},index:null}}function u(D,F,B,j){const W=c.attributes,q=F.attributes;let Q=0;const tt=B.getAttributes();for(const ut in tt)if(tt[ut].location>=0){const et=W[ut];let ft=q[ut];if(ft===void 0&&(ut==="instanceMatrix"&&D.instanceMatrix&&(ft=D.instanceMatrix),ut==="instanceColor"&&D.instanceColor&&(ft=D.instanceColor)),et===void 0||et.attribute!==ft||ft&&et.data!==ft.data)return!0;Q++}return c.attributesNum!==Q||c.index!==j}function v(D,F,B,j){const W={},q=F.attributes;let Q=0;const tt=B.getAttributes();for(const ut in tt)if(tt[ut].location>=0){let et=q[ut];et===void 0&&(ut==="instanceMatrix"&&D.instanceMatrix&&(et=D.instanceMatrix),ut==="instanceColor"&&D.instanceColor&&(et=D.instanceColor));const ft={};ft.attribute=et,et&&et.data&&(ft.data=et.data),W[ut]=ft,Q++}c.attributes=W,c.attributesNum=Q,c.index=j}function _(){const D=c.newAttributes;for(let F=0,B=D.length;F<B;F++)D[F]=0}function w(D){b(D,0)}function b(D,F){const B=c.newAttributes,j=c.enabledAttributes,W=c.attributeDivisors;B[D]=1,j[D]===0&&(s.enableVertexAttribArray(D),j[D]=1),W[D]!==F&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,F),W[D]=F)}function S(){const D=c.newAttributes,F=c.enabledAttributes;for(let B=0,j=F.length;B<j;B++)F[B]!==D[B]&&(s.disableVertexAttribArray(B),F[B]=0)}function T(D,F,B,j,W,q,Q){Q===!0?s.vertexAttribIPointer(D,F,B,W,q):s.vertexAttribPointer(D,F,B,j,W,q)}function L(D,F,B,j){if(n.isWebGL2===!1&&(D.isInstancedMesh||j.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();const W=j.attributes,q=B.getAttributes(),Q=F.defaultAttributeValues;for(const tt in q){const ut=q[tt];if(ut.location>=0){let X=W[tt];if(X===void 0&&(tt==="instanceMatrix"&&D.instanceMatrix&&(X=D.instanceMatrix),tt==="instanceColor"&&D.instanceColor&&(X=D.instanceColor)),X!==void 0){const et=X.normalized,ft=X.itemSize,xt=e.get(X);if(xt===void 0)continue;const _t=xt.buffer,Et=xt.type,K=xt.bytesPerElement,J=n.isWebGL2===!0&&(Et===s.INT||Et===s.UNSIGNED_INT||X.gpuType===_c);if(X.isInterleavedBufferAttribute){const at=X.data,U=at.stride,ot=X.offset;if(at.isInstancedInterleavedBuffer){for(let Y=0;Y<ut.locationSize;Y++)b(ut.location+Y,at.meshPerAttribute);D.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Y=0;Y<ut.locationSize;Y++)w(ut.location+Y);s.bindBuffer(s.ARRAY_BUFFER,_t);for(let Y=0;Y<ut.locationSize;Y++)T(ut.location+Y,ft/ut.locationSize,Et,et,U*K,(ot+ft/ut.locationSize*Y)*K,J)}else{if(X.isInstancedBufferAttribute){for(let at=0;at<ut.locationSize;at++)b(ut.location+at,X.meshPerAttribute);D.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let at=0;at<ut.locationSize;at++)w(ut.location+at);s.bindBuffer(s.ARRAY_BUFFER,_t);for(let at=0;at<ut.locationSize;at++)T(ut.location+at,ft/ut.locationSize,Et,et,ft*K,ft/ut.locationSize*at*K,J)}}else if(Q!==void 0){const et=Q[tt];if(et!==void 0)switch(et.length){case 2:s.vertexAttrib2fv(ut.location,et);break;case 3:s.vertexAttrib3fv(ut.location,et);break;case 4:s.vertexAttrib4fv(ut.location,et);break;default:s.vertexAttrib1fv(ut.location,et)}}}}S()}function M(){C();for(const D in a){const F=a[D];for(const B in F){const j=F[B];for(const W in j)x(j[W].object),delete j[W];delete F[B]}delete a[D]}}function y(D){if(a[D.id]===void 0)return;const F=a[D.id];for(const B in F){const j=F[B];for(const W in j)x(j[W].object),delete j[W];delete F[B]}delete a[D.id]}function P(D){for(const F in a){const B=a[F];if(B[D.id]===void 0)continue;const j=B[D.id];for(const W in j)x(j[W].object),delete j[W];delete B[D.id]}}function C(){k(),h=!0,c!==l&&(c=l,m(c.object))}function k(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:C,resetDefaultState:k,dispose:M,releaseStatesOfGeometry:y,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:w,disableUnusedAttributes:S}}function Jp(s,t,e,n){const i=n.isWebGL2;let r;function o(h){r=h}function a(h,d){s.drawArrays(r,h,d),e.update(d,r,1)}function l(h,d,f){if(f===0)return;let m,x;if(i)m=s,x="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),x="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[x](r,h,d,f),e.update(d,r,f)}function c(h,d,f){if(f===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<f;x++)this.render(h[x],d[x]);else{m.multiDrawArraysWEBGL(r,h,0,d,0,f);let x=0;for(let g=0;g<f;g++)x+=d[g];e.update(x,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function Qp(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_TEXTURE_SIZE),x=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),u=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,w=o||t.has("OES_texture_float"),b=_&&w,S=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:x,maxAttributes:g,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:v,vertexTextures:_,floatFragmentTextures:w,floatVertexTextures:b,maxSamples:S}}function tm(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new Kn,a=new Wt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const m=d.length!==0||f||n!==0||i;return i=f,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,m){const x=d.clippingPlanes,g=d.clipIntersection,p=d.clipShadows,u=s.get(d);if(!i||x===null||x.length===0||r&&!p)r?h(null):c();else{const v=r?0:n,_=v*4;let w=u.clippingState||null;l.value=w,w=h(x,f,_,m);for(let b=0;b!==_;++b)w[b]=e[b];u.clippingState=w,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,m,x){const g=d!==null?d.length:0;let p=null;if(g!==0){if(p=l.value,x!==!0||p===null){const u=m+g*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(p===null||p.length<u)&&(p=new Float32Array(u));for(let _=0,w=m;_!==g;++_,w+=4)o.copy(d[_]).applyMatrix4(v,a),o.normal.toArray(p,w),p[w+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}function em(s){let t=new WeakMap;function e(o,a){return a===va?o.mapping=Fi:a===xa&&(o.mapping=zi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===va||a===xa)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new df(l.height/2);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Mr extends Oc{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Li=4,nl=[.125,.215,.35,.446,.526,.582],ti=20,Kr=new Mr,il=new Ct;let Zr=null,Jr=0,Qr=0;const Zn=(1+Math.sqrt(5))/2,wi=1/Zn,sl=[new N(1,1,1),new N(-1,1,1),new N(1,1,-1),new N(-1,1,-1),new N(0,Zn,wi),new N(0,Zn,-wi),new N(wi,0,Zn),new N(-wi,0,Zn),new N(Zn,wi,0),new N(-Zn,wi,0)];class rl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Zr=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),Qr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ll(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ol(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Zr,Jr,Qr),t.scissorTest=!1,Vs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Fi||t.mapping===zi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Zr=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),Qr=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:be,minFilter:be,generateMipmaps:!1,type:kn,format:_e,colorSpace:An,depthBuffer:!1},i=al(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=al(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=nm(r)),this._blurMaterial=im(r,t,e)}return i}_compileMaterial(t){const e=new le(this._lodPlanes[0],t);this._renderer.compile(e,Kr)}_sceneToCubeUV(t,e,n,i){const a=new $e(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(il),h.toneMapping=On,h.autoClear=!1;const m=new Ic({name:"PMREM.Background",side:De,depthWrite:!1,depthTest:!1}),x=new le(new gs,m);let g=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,g=!0):(m.color.copy(il),g=!0);for(let u=0;u<6;u++){const v=u%3;v===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):v===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));const _=this._cubeSize;Vs(i,v*_,u>2?_:0,_,_),h.setRenderTarget(i),g&&h.render(x,a),h.render(t,a)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Fi||t.mapping===zi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=ll()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ol());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new le(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Vs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Kr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=sl[(i-1)%sl.length];this._blur(t,i-1,i,r,o)}e.autoClear=n}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new le(this._lodPlanes[i],c),f=c.uniforms,m=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ti-1),g=r/x,p=isFinite(r)?1+Math.floor(h*g):ti;p>ti&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ti}`);const u=[];let v=0;for(let T=0;T<ti;++T){const L=T/g,M=Math.exp(-L*L/2);u.push(M),T===0?v+=M:T<p&&(v+=2*M)}for(let T=0;T<u.length;T++)u[T]=u[T]/v;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:_}=this;f.dTheta.value=x,f.mipInt.value=_-n;const w=this._sizeLods[i],b=3*w*(i>_-Li?i-_+Li:0),S=4*(this._cubeSize-w);Vs(e,b,S,3*w,2*w),l.setRenderTarget(e),l.render(d,Kr)}}function nm(s){const t=[],e=[],n=[];let i=s;const r=s-Li+1+nl.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>s-Li?l=nl[o-s+Li-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,x=6,g=3,p=2,u=1,v=new Float32Array(g*x*m),_=new Float32Array(p*x*m),w=new Float32Array(u*x*m);for(let S=0;S<m;S++){const T=S%3*2/3-1,L=S>2?0:-1,M=[T,L,0,T+2/3,L,0,T+2/3,L+1,0,T,L,0,T+2/3,L+1,0,T,L+1,0];v.set(M,g*x*S),_.set(f,p*x*S);const y=[S,S,S,S,S,S];w.set(y,u*x*S)}const b=new Ue;b.setAttribute("position",new ue(v,g)),b.setAttribute("uv",new ue(_,p)),b.setAttribute("faceIndex",new ue(w,u)),t.push(b),i>Li&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function al(s,t,e){const n=new dn(s,t,e);return n.texture.mapping=gr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Vs(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function im(s,t,e){const n=new Float32Array(ti),i=new N(0,1,0);return new fe({name:"SphericalGaussianBlur",defines:{n:ti,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ka(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function ol(){return new fe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ka(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function ll(){return new fe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ka(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function ka(){return`

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
	`}function sm(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===va||l===xa,h=l===Fi||l===zi;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=t.get(a);return e===null&&(e=new rl(s)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),t.set(a,d),d.texture}else{if(t.has(a))return t.get(a).texture;{const d=a.image;if(c&&d&&d.height>0||h&&d&&i(d)){e===null&&(e=new rl(s));const f=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function rm(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function am(s,t,e,n){const i={},r=new WeakMap;function o(d){const f=d.target;f.index!==null&&t.remove(f.index);for(const x in f.attributes)t.remove(f.attributes[x]);for(const x in f.morphAttributes){const g=f.morphAttributes[x];for(let p=0,u=g.length;p<u;p++)t.remove(g[p])}f.removeEventListener("dispose",o),delete i[f.id];const m=r.get(f);m&&(t.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,e.memory.geometries++),f}function l(d){const f=d.attributes;for(const x in f)t.update(f[x],s.ARRAY_BUFFER);const m=d.morphAttributes;for(const x in m){const g=m[x];for(let p=0,u=g.length;p<u;p++)t.update(g[p],s.ARRAY_BUFFER)}}function c(d){const f=[],m=d.index,x=d.attributes.position;let g=0;if(m!==null){const v=m.array;g=m.version;for(let _=0,w=v.length;_<w;_+=3){const b=v[_+0],S=v[_+1],T=v[_+2];f.push(b,S,S,T,T,b)}}else if(x!==void 0){const v=x.array;g=x.version;for(let _=0,w=v.length/3-1;_<w;_+=3){const b=_+0,S=_+1,T=_+2;f.push(b,S,S,T,T,b)}}else return;const p=new(Cc(f)?Fc:Nc)(f,1);p.version=g;const u=r.get(d);u&&t.remove(u),r.set(d,p)}function h(d){const f=r.get(d);if(f){const m=d.index;m!==null&&f.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function om(s,t,e,n){const i=n.isWebGL2;let r;function o(m){r=m}let a,l;function c(m){a=m.type,l=m.bytesPerElement}function h(m,x){s.drawElements(r,x,a,m*l),e.update(x,r,1)}function d(m,x,g){if(g===0)return;let p,u;if(i)p=s,u="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[u](r,x,a,m*l,g),e.update(x,r,g)}function f(m,x,g){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<g;u++)this.render(m[u]/l,x[u]);else{p.multiDrawElementsWEBGL(r,x,0,a,m,0,g);let u=0;for(let v=0;v<g;v++)u+=x[v];e.update(u,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=d,this.renderMultiDraw=f}function lm(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function cm(s,t){return s[0]-t[0]}function hm(s,t){return Math.abs(t[1])-Math.abs(s[1])}function um(s,t,e){const n={},i=new Float32Array(8),r=new WeakMap,o=new Zt,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,d){const f=c.morphTargetInfluences;if(t.isWebGL2===!0){const m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,x=m!==void 0?m.length:0;let g=r.get(h);if(g===void 0||g.count!==x){let D=function(){C.dispose(),r.delete(h),h.removeEventListener("dispose",D)};g!==void 0&&g.texture.dispose();const v=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,w=h.morphAttributes.color!==void 0,b=h.morphAttributes.position||[],S=h.morphAttributes.normal||[],T=h.morphAttributes.color||[];let L=0;v===!0&&(L=1),_===!0&&(L=2),w===!0&&(L=3);let M=h.attributes.position.count*L,y=1;M>t.maxTextureSize&&(y=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const P=new Float32Array(M*y*4*x),C=new Dc(P,M,y,x);C.type=bn,C.needsUpdate=!0;const k=L*4;for(let F=0;F<x;F++){const B=b[F],j=S[F],W=T[F],q=M*y*4*F;for(let Q=0;Q<B.count;Q++){const tt=Q*k;v===!0&&(o.fromBufferAttribute(B,Q),P[q+tt+0]=o.x,P[q+tt+1]=o.y,P[q+tt+2]=o.z,P[q+tt+3]=0),_===!0&&(o.fromBufferAttribute(j,Q),P[q+tt+4]=o.x,P[q+tt+5]=o.y,P[q+tt+6]=o.z,P[q+tt+7]=0),w===!0&&(o.fromBufferAttribute(W,Q),P[q+tt+8]=o.x,P[q+tt+9]=o.y,P[q+tt+10]=o.z,P[q+tt+11]=W.itemSize===4?o.w:1)}}g={count:x,texture:C,size:new It(M,y)},r.set(h,g),h.addEventListener("dispose",D)}let p=0;for(let v=0;v<f.length;v++)p+=f[v];const u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(s,"morphTargetBaseInfluence",u),d.getUniforms().setValue(s,"morphTargetInfluences",f),d.getUniforms().setValue(s,"morphTargetsTexture",g.texture,e),d.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}else{const m=f===void 0?0:f.length;let x=n[h.id];if(x===void 0||x.length!==m){x=[];for(let _=0;_<m;_++)x[_]=[_,0];n[h.id]=x}for(let _=0;_<m;_++){const w=x[_];w[0]=_,w[1]=f[_]}x.sort(hm);for(let _=0;_<8;_++)_<m&&x[_][1]?(a[_][0]=x[_][0],a[_][1]=x[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(cm);const g=h.morphAttributes.position,p=h.morphAttributes.normal;let u=0;for(let _=0;_<8;_++){const w=a[_],b=w[0],S=w[1];b!==Number.MAX_SAFE_INTEGER&&S?(g&&h.getAttribute("morphTarget"+_)!==g[b]&&h.setAttribute("morphTarget"+_,g[b]),p&&h.getAttribute("morphNormal"+_)!==p[b]&&h.setAttribute("morphNormal"+_,p[b]),i[_]=S,u+=S):(g&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),i[_]=0)}const v=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(s,"morphTargetBaseInfluence",v),d.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function fm(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(i.get(d)!==c&&(t.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return d}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Ba extends ke{constructor(t,e,n,i,r,o,a,l,c,h){if(h=h!==void 0?h:si,h!==si&&h!==Oi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===si&&(n=Sn),n===void 0&&h===Oi&&(n=ii),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:ne,this.minFilter=l!==void 0?l:ne,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Gc=new ke,Hc=new Ba(1,1);Hc.compareFunction=Rc;const Vc=new Dc,Wc=new Yu,Xc=new kc,cl=[],hl=[],ul=new Float32Array(16),fl=new Float32Array(9),dl=new Float32Array(4);function Wi(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=cl[i];if(r===void 0&&(r=new Float32Array(i),cl[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function de(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function pe(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function yr(s,t){let e=hl[t];e===void 0&&(e=new Int32Array(t),hl[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function dm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function pm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(de(e,t))return;s.uniform2fv(this.addr,t),pe(e,t)}}function mm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(de(e,t))return;s.uniform3fv(this.addr,t),pe(e,t)}}function gm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(de(e,t))return;s.uniform4fv(this.addr,t),pe(e,t)}}function vm(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(de(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),pe(e,t)}else{if(de(e,n))return;dl.set(n),s.uniformMatrix2fv(this.addr,!1,dl),pe(e,n)}}function xm(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(de(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),pe(e,t)}else{if(de(e,n))return;fl.set(n),s.uniformMatrix3fv(this.addr,!1,fl),pe(e,n)}}function _m(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(de(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),pe(e,t)}else{if(de(e,n))return;ul.set(n),s.uniformMatrix4fv(this.addr,!1,ul),pe(e,n)}}function Mm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function ym(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(de(e,t))return;s.uniform2iv(this.addr,t),pe(e,t)}}function wm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(de(e,t))return;s.uniform3iv(this.addr,t),pe(e,t)}}function Sm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(de(e,t))return;s.uniform4iv(this.addr,t),pe(e,t)}}function bm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Em(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(de(e,t))return;s.uniform2uiv(this.addr,t),pe(e,t)}}function Tm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(de(e,t))return;s.uniform3uiv(this.addr,t),pe(e,t)}}function Am(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(de(e,t))return;s.uniform4uiv(this.addr,t),pe(e,t)}}function Rm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?Hc:Gc;e.setTexture2D(t||r,i)}function Cm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Wc,i)}function Lm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Xc,i)}function Pm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Vc,i)}function Dm(s){switch(s){case 5126:return dm;case 35664:return pm;case 35665:return mm;case 35666:return gm;case 35674:return vm;case 35675:return xm;case 35676:return _m;case 5124:case 35670:return Mm;case 35667:case 35671:return ym;case 35668:case 35672:return wm;case 35669:case 35673:return Sm;case 5125:return bm;case 36294:return Em;case 36295:return Tm;case 36296:return Am;case 35678:case 36198:case 36298:case 36306:case 35682:return Rm;case 35679:case 36299:case 36307:return Cm;case 35680:case 36300:case 36308:case 36293:return Lm;case 36289:case 36303:case 36311:case 36292:return Pm}}function Um(s,t){s.uniform1fv(this.addr,t)}function Im(s,t){const e=Wi(t,this.size,2);s.uniform2fv(this.addr,e)}function Nm(s,t){const e=Wi(t,this.size,3);s.uniform3fv(this.addr,e)}function Fm(s,t){const e=Wi(t,this.size,4);s.uniform4fv(this.addr,e)}function zm(s,t){const e=Wi(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Om(s,t){const e=Wi(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function km(s,t){const e=Wi(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Bm(s,t){s.uniform1iv(this.addr,t)}function Gm(s,t){s.uniform2iv(this.addr,t)}function Hm(s,t){s.uniform3iv(this.addr,t)}function Vm(s,t){s.uniform4iv(this.addr,t)}function Wm(s,t){s.uniform1uiv(this.addr,t)}function Xm(s,t){s.uniform2uiv(this.addr,t)}function $m(s,t){s.uniform3uiv(this.addr,t)}function qm(s,t){s.uniform4uiv(this.addr,t)}function jm(s,t,e){const n=this.cache,i=t.length,r=yr(e,i);de(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Gc,r[o])}function Ym(s,t,e){const n=this.cache,i=t.length,r=yr(e,i);de(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Wc,r[o])}function Km(s,t,e){const n=this.cache,i=t.length,r=yr(e,i);de(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Xc,r[o])}function Zm(s,t,e){const n=this.cache,i=t.length,r=yr(e,i);de(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Vc,r[o])}function Jm(s){switch(s){case 5126:return Um;case 35664:return Im;case 35665:return Nm;case 35666:return Fm;case 35674:return zm;case 35675:return Om;case 35676:return km;case 5124:case 35670:return Bm;case 35667:case 35671:return Gm;case 35668:case 35672:return Hm;case 35669:case 35673:return Vm;case 5125:return Wm;case 36294:return Xm;case 36295:return $m;case 36296:return qm;case 35678:case 36198:case 36298:case 36306:case 35682:return jm;case 35679:case 36299:case 36307:return Ym;case 35680:case 36300:case 36308:case 36293:return Km;case 36289:case 36303:case 36311:case 36292:return Zm}}class Qm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Dm(e.type)}}class t0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Jm(e.type)}}class e0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const ta=/(\w+)(\])?(\[|\.)?/g;function pl(s,t){s.seq.push(t),s.map[t.id]=t}function n0(s,t,e){const n=s.name,i=n.length;for(ta.lastIndex=0;;){const r=ta.exec(n),o=ta.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){pl(e,c===void 0?new Qm(a,s,t):new t0(a,s,t));break}else{let d=e.map[a];d===void 0&&(d=new e0(a),pl(e,d)),e=d}}}class er{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);n0(r,o,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function ml(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const i0=37297;let s0=0;function r0(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function a0(s){const t=Yt.getPrimaries(Yt.workingColorSpace),e=Yt.getPrimaries(s);let n;switch(t===e?n="":t===or&&e===ar?n="LinearDisplayP3ToLinearSRGB":t===ar&&e===or&&(n="LinearSRGBToLinearDisplayP3"),s){case An:case xr:return[n,"LinearTransferOETF"];case xe:case Ia:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function gl(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+r0(s.getShaderSource(t),o)}else return i}function o0(s,t){const e=a0(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function l0(s,t){let e;switch(t){case au:e="Linear";break;case ou:e="Reinhard";break;case lu:e="OptimizedCineon";break;case cu:e="ACESFilmic";break;case uu:e="AgX";break;case hu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function c0(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Pi).join(`
`)}function h0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Pi).join(`
`)}function u0(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function f0(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function Pi(s){return s!==""}function vl(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function xl(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const d0=/^[ \t]*#include +<([\w\d./]+)>/gm;function wa(s){return s.replace(d0,m0)}const p0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function m0(s,t){let e=Ot[t];if(e===void 0){const n=p0.get(t);if(n!==void 0)e=Ot[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return wa(e)}const g0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _l(s){return s.replace(g0,v0)}function v0(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ml(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function x0(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===gc?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Ih?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Mn&&(t="SHADOWMAP_TYPE_VSM"),t}function _0(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Fi:case zi:t="ENVMAP_TYPE_CUBE";break;case gr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function M0(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case zi:t="ENVMAP_MODE_REFRACTION";break}return t}function y0(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case vc:t="ENVMAP_BLENDING_MULTIPLY";break;case su:t="ENVMAP_BLENDING_MIX";break;case ru:t="ENVMAP_BLENDING_ADD";break}return t}function w0(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function S0(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=x0(e),c=_0(e),h=M0(e),d=y0(e),f=w0(e),m=e.isWebGL2?"":c0(e),x=h0(e),g=u0(r),p=i.createProgram();let u,v,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Pi).join(`
`),u.length>0&&(u+=`
`),v=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Pi).join(`
`),v.length>0&&(v+=`
`)):(u=[Ml(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Pi).join(`
`),v=[m,Ml(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==On?"#define TONE_MAPPING":"",e.toneMapping!==On?Ot.tonemapping_pars_fragment:"",e.toneMapping!==On?l0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ot.colorspace_pars_fragment,o0("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Pi).join(`
`)),o=wa(o),o=vl(o,e),o=xl(o,e),a=wa(a),a=vl(a,e),a=xl(a,e),o=_l(o),a=_l(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,u=[x,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Oo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Oo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const w=_+u+o,b=_+v+a,S=ml(i,i.VERTEX_SHADER,w),T=ml(i,i.FRAGMENT_SHADER,b);i.attachShader(p,S),i.attachShader(p,T),e.index0AttributeName!==void 0?i.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function L(C){if(s.debug.checkShaderErrors){const k=i.getProgramInfoLog(p).trim(),D=i.getShaderInfoLog(S).trim(),F=i.getShaderInfoLog(T).trim();let B=!0,j=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(B=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,p,S,T);else{const W=gl(i,S,"vertex"),q=gl(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+k+`
`+W+`
`+q)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(D===""||F==="")&&(j=!1);j&&(C.diagnostics={runnable:B,programLog:k,vertexShader:{log:D,prefix:u},fragmentShader:{log:F,prefix:v}})}i.deleteShader(S),i.deleteShader(T),M=new er(i,p),y=f0(i,p)}let M;this.getUniforms=function(){return M===void 0&&L(this),M};let y;this.getAttributes=function(){return y===void 0&&L(this),y};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=i.getProgramParameter(p,i0)),P},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=s0++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=S,this.fragmentShader=T,this}let b0=0;class E0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new T0(t),e.set(t,n)),n}}class T0{constructor(t){this.id=b0++,this.code=t,this.usedTimes=0}}function A0(s,t,e,n,i,r,o){const a=new za,l=new E0,c=[],h=i.isWebGL2,d=i.logarithmicDepthBuffer,f=i.vertexTextures;let m=i.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(M){return M===0?"uv":`uv${M}`}function p(M,y,P,C,k){const D=C.fog,F=k.geometry,B=M.isMeshStandardMaterial?C.environment:null,j=(M.isMeshStandardMaterial?e:t).get(M.envMap||B),W=j&&j.mapping===gr?j.image.height:null,q=x[M.type];M.precision!==null&&(m=i.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const Q=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,tt=Q!==void 0?Q.length:0;let ut=0;F.morphAttributes.position!==void 0&&(ut=1),F.morphAttributes.normal!==void 0&&(ut=2),F.morphAttributes.color!==void 0&&(ut=3);let X,et,ft,xt;if(q){const Ee=hn[q];X=Ee.vertexShader,et=Ee.fragmentShader}else X=M.vertexShader,et=M.fragmentShader,l.update(M),ft=l.getVertexShaderID(M),xt=l.getFragmentShaderID(M);const _t=s.getRenderTarget(),Et=k.isInstancedMesh===!0,K=k.isBatchedMesh===!0,J=!!M.map,at=!!M.matcap,U=!!j,ot=!!M.aoMap,Y=!!M.lightMap,V=!!M.bumpMap,Z=!!M.normalMap,lt=!!M.displacementMap,mt=!!M.emissiveMap,A=!!M.metalnessMap,E=!!M.roughnessMap,O=M.anisotropy>0,st=M.clearcoat>0,it=M.iridescence>0,rt=M.sheen>0,wt=M.transmission>0,gt=O&&!!M.anisotropyMap,Mt=st&&!!M.clearcoatMap,Lt=st&&!!M.clearcoatNormalMap,kt=st&&!!M.clearcoatRoughnessMap,nt=it&&!!M.iridescenceMap,jt=it&&!!M.iridescenceThicknessMap,Xt=rt&&!!M.sheenColorMap,Ut=rt&&!!M.sheenRoughnessMap,Tt=!!M.specularMap,yt=!!M.specularColorMap,zt=!!M.specularIntensityMap,qt=wt&&!!M.transmissionMap,re=wt&&!!M.thicknessMap,Ht=!!M.gradientMap,ct=!!M.alphaMap,I=M.alphaTest>0,dt=!!M.alphaHash,pt=!!M.extensions,Pt=!!F.attributes.uv1,At=!!F.attributes.uv2,Jt=!!F.attributes.uv3;let Qt=On;return M.toneMapped&&(_t===null||_t.isXRRenderTarget===!0)&&(Qt=s.toneMapping),{isWebGL2:h,shaderID:q,shaderType:M.type,shaderName:M.name,vertexShader:X,fragmentShader:et,defines:M.defines,customVertexShaderID:ft,customFragmentShaderID:xt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:K,instancing:Et,instancingColor:Et&&k.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:_t===null?s.outputColorSpace:_t.isXRRenderTarget===!0?_t.texture.colorSpace:An,map:J,matcap:at,envMap:U,envMapMode:U&&j.mapping,envMapCubeUVHeight:W,aoMap:ot,lightMap:Y,bumpMap:V,normalMap:Z,displacementMap:f&&lt,emissiveMap:mt,normalMapObjectSpace:Z&&M.normalMapType===wu,normalMapTangentSpace:Z&&M.normalMapType===yu,metalnessMap:A,roughnessMap:E,anisotropy:O,anisotropyMap:gt,clearcoat:st,clearcoatMap:Mt,clearcoatNormalMap:Lt,clearcoatRoughnessMap:kt,iridescence:it,iridescenceMap:nt,iridescenceThicknessMap:jt,sheen:rt,sheenColorMap:Xt,sheenRoughnessMap:Ut,specularMap:Tt,specularColorMap:yt,specularIntensityMap:zt,transmission:wt,transmissionMap:qt,thicknessMap:re,gradientMap:Ht,opaque:M.transparent===!1&&M.blending===Ui,alphaMap:ct,alphaTest:I,alphaHash:dt,combine:M.combine,mapUv:J&&g(M.map.channel),aoMapUv:ot&&g(M.aoMap.channel),lightMapUv:Y&&g(M.lightMap.channel),bumpMapUv:V&&g(M.bumpMap.channel),normalMapUv:Z&&g(M.normalMap.channel),displacementMapUv:lt&&g(M.displacementMap.channel),emissiveMapUv:mt&&g(M.emissiveMap.channel),metalnessMapUv:A&&g(M.metalnessMap.channel),roughnessMapUv:E&&g(M.roughnessMap.channel),anisotropyMapUv:gt&&g(M.anisotropyMap.channel),clearcoatMapUv:Mt&&g(M.clearcoatMap.channel),clearcoatNormalMapUv:Lt&&g(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:kt&&g(M.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&g(M.iridescenceMap.channel),iridescenceThicknessMapUv:jt&&g(M.iridescenceThicknessMap.channel),sheenColorMapUv:Xt&&g(M.sheenColorMap.channel),sheenRoughnessMapUv:Ut&&g(M.sheenRoughnessMap.channel),specularMapUv:Tt&&g(M.specularMap.channel),specularColorMapUv:yt&&g(M.specularColorMap.channel),specularIntensityMapUv:zt&&g(M.specularIntensityMap.channel),transmissionMapUv:qt&&g(M.transmissionMap.channel),thicknessMapUv:re&&g(M.thicknessMap.channel),alphaMapUv:ct&&g(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Z||O),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Pt,vertexUv2s:At,vertexUv3s:Jt,pointsUvs:k.isPoints===!0&&!!F.attributes.uv&&(J||ct),fog:!!D,useFog:M.fog===!0,fogExp2:D&&D.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:k.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:ut,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:Qt,useLegacyLights:s._useLegacyLights,decodeVideoTexture:J&&M.map.isVideoTexture===!0&&Yt.getTransfer(M.map.colorSpace)===ee,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===an,flipSided:M.side===De,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:pt&&M.extensions.derivatives===!0,extensionFragDepth:pt&&M.extensions.fragDepth===!0,extensionDrawBuffers:pt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:pt&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:pt&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function u(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)y.push(P),y.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(v(y,M),_(y,M),y.push(s.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function v(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function _(M,y){a.disableAll(),y.isWebGL2&&a.enable(0),y.supportsVertexTextures&&a.enable(1),y.instancing&&a.enable(2),y.instancingColor&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),M.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.useLegacyLights&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function w(M){const y=x[M.type];let P;if(y){const C=hn[y];P=cf.clone(C.uniforms)}else P=M.uniforms;return P}function b(M,y){let P;for(let C=0,k=c.length;C<k;C++){const D=c[C];if(D.cacheKey===y){P=D,++P.usedTimes;break}}return P===void 0&&(P=new S0(s,y,M,r),c.push(P)),P}function S(M){if(--M.usedTimes===0){const y=c.indexOf(M);c[y]=c[c.length-1],c.pop(),M.destroy()}}function T(M){l.remove(M)}function L(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:w,acquireProgram:b,releaseProgram:S,releaseShaderCache:T,programs:c,dispose:L}}function R0(){let s=new WeakMap;function t(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function e(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function C0(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function yl(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function wl(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(d,f,m,x,g,p){let u=s[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:m,groupOrder:x,renderOrder:d.renderOrder,z:g,group:p},s[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=m,u.groupOrder=x,u.renderOrder=d.renderOrder,u.z=g,u.group=p),t++,u}function a(d,f,m,x,g,p){const u=o(d,f,m,x,g,p);m.transmission>0?n.push(u):m.transparent===!0?i.push(u):e.push(u)}function l(d,f,m,x,g,p){const u=o(d,f,m,x,g,p);m.transmission>0?n.unshift(u):m.transparent===!0?i.unshift(u):e.unshift(u)}function c(d,f){e.length>1&&e.sort(d||C0),n.length>1&&n.sort(f||yl),i.length>1&&i.sort(f||yl)}function h(){for(let d=t,f=s.length;d<f;d++){const m=s[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function L0(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new wl,s.set(n,[o])):i>=r.length?(o=new wl,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function P0(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new Ct};break;case"SpotLight":e={position:new N,direction:new N,color:new Ct,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new Ct,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new Ct,groundColor:new Ct};break;case"RectAreaLight":e={color:new Ct,position:new N,halfWidth:new N,halfHeight:new N};break}return s[t.id]=e,e}}}function D0(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new It};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new It};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new It,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let U0=0;function I0(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function N0(s,t){const e=new P0,n=D0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new N);const r=new N,o=new Kt,a=new Kt;function l(h,d){let f=0,m=0,x=0;for(let C=0;C<9;C++)i.probe[C].set(0,0,0);let g=0,p=0,u=0,v=0,_=0,w=0,b=0,S=0,T=0,L=0,M=0;h.sort(I0);const y=d===!0?Math.PI:1;for(let C=0,k=h.length;C<k;C++){const D=h[C],F=D.color,B=D.intensity,j=D.distance,W=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)f+=F.r*B*y,m+=F.g*B*y,x+=F.b*B*y;else if(D.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(D.sh.coefficients[q],B);M++}else if(D.isDirectionalLight){const q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity*y),D.castShadow){const Q=D.shadow,tt=n.get(D);tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,i.directionalShadow[g]=tt,i.directionalShadowMap[g]=W,i.directionalShadowMatrix[g]=D.shadow.matrix,w++}i.directional[g]=q,g++}else if(D.isSpotLight){const q=e.get(D);q.position.setFromMatrixPosition(D.matrixWorld),q.color.copy(F).multiplyScalar(B*y),q.distance=j,q.coneCos=Math.cos(D.angle),q.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),q.decay=D.decay,i.spot[u]=q;const Q=D.shadow;if(D.map&&(i.spotLightMap[T]=D.map,T++,Q.updateMatrices(D),D.castShadow&&L++),i.spotLightMatrix[u]=Q.matrix,D.castShadow){const tt=n.get(D);tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,i.spotShadow[u]=tt,i.spotShadowMap[u]=W,S++}u++}else if(D.isRectAreaLight){const q=e.get(D);q.color.copy(F).multiplyScalar(B),q.halfWidth.set(D.width*.5,0,0),q.halfHeight.set(0,D.height*.5,0),i.rectArea[v]=q,v++}else if(D.isPointLight){const q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity*y),q.distance=D.distance,q.decay=D.decay,D.castShadow){const Q=D.shadow,tt=n.get(D);tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,tt.shadowCameraNear=Q.camera.near,tt.shadowCameraFar=Q.camera.far,i.pointShadow[p]=tt,i.pointShadowMap[p]=W,i.pointShadowMatrix[p]=D.shadow.matrix,b++}i.point[p]=q,p++}else if(D.isHemisphereLight){const q=e.get(D);q.skyColor.copy(D.color).multiplyScalar(B*y),q.groundColor.copy(D.groundColor).multiplyScalar(B*y),i.hemi[_]=q,_++}}v>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ht.LTC_FLOAT_1,i.rectAreaLTC2=ht.LTC_FLOAT_2):(i.rectAreaLTC1=ht.LTC_HALF_1,i.rectAreaLTC2=ht.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ht.LTC_FLOAT_1,i.rectAreaLTC2=ht.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ht.LTC_HALF_1,i.rectAreaLTC2=ht.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=m,i.ambient[2]=x;const P=i.hash;(P.directionalLength!==g||P.pointLength!==p||P.spotLength!==u||P.rectAreaLength!==v||P.hemiLength!==_||P.numDirectionalShadows!==w||P.numPointShadows!==b||P.numSpotShadows!==S||P.numSpotMaps!==T||P.numLightProbes!==M)&&(i.directional.length=g,i.spot.length=u,i.rectArea.length=v,i.point.length=p,i.hemi.length=_,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=S+T-L,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=L,i.numLightProbes=M,P.directionalLength=g,P.pointLength=p,P.spotLength=u,P.rectAreaLength=v,P.hemiLength=_,P.numDirectionalShadows=w,P.numPointShadows=b,P.numSpotShadows=S,P.numSpotMaps=T,P.numLightProbes=M,i.version=U0++)}function c(h,d){let f=0,m=0,x=0,g=0,p=0;const u=d.matrixWorldInverse;for(let v=0,_=h.length;v<_;v++){const w=h[v];if(w.isDirectionalLight){const b=i.directional[f];b.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(u),f++}else if(w.isSpotLight){const b=i.spot[x];b.position.setFromMatrixPosition(w.matrixWorld),b.position.applyMatrix4(u),b.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(u),x++}else if(w.isRectAreaLight){const b=i.rectArea[g];b.position.setFromMatrixPosition(w.matrixWorld),b.position.applyMatrix4(u),a.identity(),o.copy(w.matrixWorld),o.premultiply(u),a.extractRotation(o),b.halfWidth.set(w.width*.5,0,0),b.halfHeight.set(0,w.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),g++}else if(w.isPointLight){const b=i.point[m];b.position.setFromMatrixPosition(w.matrixWorld),b.position.applyMatrix4(u),m++}else if(w.isHemisphereLight){const b=i.hemi[p];b.direction.setFromMatrixPosition(w.matrixWorld),b.direction.transformDirection(u),p++}}}return{setup:l,setupView:c,state:i}}function Sl(s,t){const e=new N0(s,t),n=[],i=[];function r(){n.length=0,i.length=0}function o(d){n.push(d)}function a(d){i.push(d)}function l(d){e.setup(n,d)}function c(d){e.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function F0(s,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let l;return a===void 0?(l=new Sl(s,t),e.set(r,[l])):o>=a.length?(l=new Sl(s,t),a.push(l)):l=a[o],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class z0 extends ms{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_u,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class O0 extends ms{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const k0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,B0=`uniform sampler2D shadow_pass;
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
}`;function G0(s,t,e){let n=new Vi;const i=new It,r=new It,o=new Zt,a=new z0({depthPacking:Mu}),l=new O0,c={},h=e.maxTextureSize,d={[Tn]:De,[De]:Tn,[an]:an},f=new fe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new It},radius:{value:4}},vertexShader:k0,fragmentShader:B0}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const x=new Ue;x.setAttribute("position",new ue(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new le(x,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gc;let u=this.type;this.render=function(S,T,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;const M=s.getRenderTarget(),y=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),C=s.state;C.setBlending(zn),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const k=u!==Mn&&this.type===Mn,D=u===Mn&&this.type!==Mn;for(let F=0,B=S.length;F<B;F++){const j=S[F],W=j.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);const q=W.getFrameExtents();if(i.multiply(q),r.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/q.x),i.x=r.x*q.x,W.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/q.y),i.y=r.y*q.y,W.mapSize.y=r.y)),W.map===null||k===!0||D===!0){const tt=this.type!==Mn?{minFilter:ne,magFilter:ne}:{};W.map!==null&&W.map.dispose(),W.map=new dn(i.x,i.y,tt),W.map.texture.name=j.name+".shadowMap",W.camera.updateProjectionMatrix()}s.setRenderTarget(W.map),s.clear();const Q=W.getViewportCount();for(let tt=0;tt<Q;tt++){const ut=W.getViewport(tt);o.set(r.x*ut.x,r.y*ut.y,r.x*ut.z,r.y*ut.w),C.viewport(o),W.updateMatrices(j,tt),n=W.getFrustum(),w(T,L,W.camera,j,this.type)}W.isPointLightShadow!==!0&&this.type===Mn&&v(W,L),W.needsUpdate=!1}u=this.type,p.needsUpdate=!1,s.setRenderTarget(M,y,P)};function v(S,T){const L=t.update(g);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,m.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new dn(i.x,i.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(T,null,L,f,g,null),m.uniforms.shadow_pass.value=S.mapPass.texture,m.uniforms.resolution.value=S.mapSize,m.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(T,null,L,m,g,null)}function _(S,T,L,M){let y=null;const P=L.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)y=P;else if(y=L.isPointLight===!0?l:a,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const C=y.uuid,k=T.uuid;let D=c[C];D===void 0&&(D={},c[C]=D);let F=D[k];F===void 0&&(F=y.clone(),D[k]=F,T.addEventListener("dispose",b)),y=F}if(y.visible=T.visible,y.wireframe=T.wireframe,M===Mn?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:d[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const C=s.properties.get(y);C.light=L}return y}function w(S,T,L,M,y){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&y===Mn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,S.matrixWorld);const k=t.update(S),D=S.material;if(Array.isArray(D)){const F=k.groups;for(let B=0,j=F.length;B<j;B++){const W=F[B],q=D[W.materialIndex];if(q&&q.visible){const Q=_(S,q,M,y);S.onBeforeShadow(s,S,T,L,k,Q,W),s.renderBufferDirect(L,null,k,Q,S,W),S.onAfterShadow(s,S,T,L,k,Q,W)}}}else if(D.visible){const F=_(S,D,M,y);S.onBeforeShadow(s,S,T,L,k,F,null),s.renderBufferDirect(L,null,k,F,S,null),S.onAfterShadow(s,S,T,L,k,F,null)}}const C=S.children;for(let k=0,D=C.length;k<D;k++)w(C[k],T,L,M,y)}function b(S){S.target.removeEventListener("dispose",b);for(const L in c){const M=c[L],y=S.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}function H0(s,t,e){const n=e.isWebGL2;function i(){let I=!1;const dt=new Zt;let pt=null;const Pt=new Zt(0,0,0,0);return{setMask:function(At){pt!==At&&!I&&(s.colorMask(At,At,At,At),pt=At)},setLocked:function(At){I=At},setClear:function(At,Jt,Qt,me,Ee){Ee===!0&&(At*=me,Jt*=me,Qt*=me),dt.set(At,Jt,Qt,me),Pt.equals(dt)===!1&&(s.clearColor(At,Jt,Qt,me),Pt.copy(dt))},reset:function(){I=!1,pt=null,Pt.set(-1,0,0,0)}}}function r(){let I=!1,dt=null,pt=null,Pt=null;return{setTest:function(At){At?K(s.DEPTH_TEST):J(s.DEPTH_TEST)},setMask:function(At){dt!==At&&!I&&(s.depthMask(At),dt=At)},setFunc:function(At){if(pt!==At){switch(At){case Zh:s.depthFunc(s.NEVER);break;case Jh:s.depthFunc(s.ALWAYS);break;case Qh:s.depthFunc(s.LESS);break;case ir:s.depthFunc(s.LEQUAL);break;case tu:s.depthFunc(s.EQUAL);break;case eu:s.depthFunc(s.GEQUAL);break;case nu:s.depthFunc(s.GREATER);break;case iu:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}pt=At}},setLocked:function(At){I=At},setClear:function(At){Pt!==At&&(s.clearDepth(At),Pt=At)},reset:function(){I=!1,dt=null,pt=null,Pt=null}}}function o(){let I=!1,dt=null,pt=null,Pt=null,At=null,Jt=null,Qt=null,me=null,Ee=null;return{setTest:function(te){I||(te?K(s.STENCIL_TEST):J(s.STENCIL_TEST))},setMask:function(te){dt!==te&&!I&&(s.stencilMask(te),dt=te)},setFunc:function(te,Te,ln){(pt!==te||Pt!==Te||At!==ln)&&(s.stencilFunc(te,Te,ln),pt=te,Pt=Te,At=ln)},setOp:function(te,Te,ln){(Jt!==te||Qt!==Te||me!==ln)&&(s.stencilOp(te,Te,ln),Jt=te,Qt=Te,me=ln)},setLocked:function(te){I=te},setClear:function(te){Ee!==te&&(s.clearStencil(te),Ee=te)},reset:function(){I=!1,dt=null,pt=null,Pt=null,At=null,Jt=null,Qt=null,me=null,Ee=null}}}const a=new i,l=new r,c=new o,h=new WeakMap,d=new WeakMap;let f={},m={},x=new WeakMap,g=[],p=null,u=!1,v=null,_=null,w=null,b=null,S=null,T=null,L=null,M=new Ct(0,0,0),y=0,P=!1,C=null,k=null,D=null,F=null,B=null;const j=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,q=0;const Q=s.getParameter(s.VERSION);Q.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(Q)[1]),W=q>=1):Q.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),W=q>=2);let tt=null,ut={};const X=s.getParameter(s.SCISSOR_BOX),et=s.getParameter(s.VIEWPORT),ft=new Zt().fromArray(X),xt=new Zt().fromArray(et);function _t(I,dt,pt,Pt){const At=new Uint8Array(4),Jt=s.createTexture();s.bindTexture(I,Jt),s.texParameteri(I,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(I,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Qt=0;Qt<pt;Qt++)n&&(I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY)?s.texImage3D(dt,0,s.RGBA,1,1,Pt,0,s.RGBA,s.UNSIGNED_BYTE,At):s.texImage2D(dt+Qt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,At);return Jt}const Et={};Et[s.TEXTURE_2D]=_t(s.TEXTURE_2D,s.TEXTURE_2D,1),Et[s.TEXTURE_CUBE_MAP]=_t(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Et[s.TEXTURE_2D_ARRAY]=_t(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Et[s.TEXTURE_3D]=_t(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),K(s.DEPTH_TEST),l.setFunc(ir),mt(!1),A(so),K(s.CULL_FACE),Z(zn);function K(I){f[I]!==!0&&(s.enable(I),f[I]=!0)}function J(I){f[I]!==!1&&(s.disable(I),f[I]=!1)}function at(I,dt){return m[I]!==dt?(s.bindFramebuffer(I,dt),m[I]=dt,n&&(I===s.DRAW_FRAMEBUFFER&&(m[s.FRAMEBUFFER]=dt),I===s.FRAMEBUFFER&&(m[s.DRAW_FRAMEBUFFER]=dt)),!0):!1}function U(I,dt){let pt=g,Pt=!1;if(I)if(pt=x.get(dt),pt===void 0&&(pt=[],x.set(dt,pt)),I.isWebGLMultipleRenderTargets){const At=I.texture;if(pt.length!==At.length||pt[0]!==s.COLOR_ATTACHMENT0){for(let Jt=0,Qt=At.length;Jt<Qt;Jt++)pt[Jt]=s.COLOR_ATTACHMENT0+Jt;pt.length=At.length,Pt=!0}}else pt[0]!==s.COLOR_ATTACHMENT0&&(pt[0]=s.COLOR_ATTACHMENT0,Pt=!0);else pt[0]!==s.BACK&&(pt[0]=s.BACK,Pt=!0);Pt&&(e.isWebGL2?s.drawBuffers(pt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(pt))}function ot(I){return p!==I?(s.useProgram(I),p=I,!0):!1}const Y={[Qn]:s.FUNC_ADD,[Fh]:s.FUNC_SUBTRACT,[zh]:s.FUNC_REVERSE_SUBTRACT};if(n)Y[oo]=s.MIN,Y[lo]=s.MAX;else{const I=t.get("EXT_blend_minmax");I!==null&&(Y[oo]=I.MIN_EXT,Y[lo]=I.MAX_EXT)}const V={[Oh]:s.ZERO,[kh]:s.ONE,[Bh]:s.SRC_COLOR,[ma]:s.SRC_ALPHA,[$h]:s.SRC_ALPHA_SATURATE,[Wh]:s.DST_COLOR,[Hh]:s.DST_ALPHA,[Gh]:s.ONE_MINUS_SRC_COLOR,[ga]:s.ONE_MINUS_SRC_ALPHA,[Xh]:s.ONE_MINUS_DST_COLOR,[Vh]:s.ONE_MINUS_DST_ALPHA,[qh]:s.CONSTANT_COLOR,[jh]:s.ONE_MINUS_CONSTANT_COLOR,[Yh]:s.CONSTANT_ALPHA,[Kh]:s.ONE_MINUS_CONSTANT_ALPHA};function Z(I,dt,pt,Pt,At,Jt,Qt,me,Ee,te){if(I===zn){u===!0&&(J(s.BLEND),u=!1);return}if(u===!1&&(K(s.BLEND),u=!0),I!==Nh){if(I!==v||te!==P){if((_!==Qn||S!==Qn)&&(s.blendEquation(s.FUNC_ADD),_=Qn,S=Qn),te)switch(I){case Ui:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case pa:s.blendFunc(s.ONE,s.ONE);break;case ro:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ao:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ui:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case pa:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case ro:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ao:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}w=null,b=null,T=null,L=null,M.set(0,0,0),y=0,v=I,P=te}return}At=At||dt,Jt=Jt||pt,Qt=Qt||Pt,(dt!==_||At!==S)&&(s.blendEquationSeparate(Y[dt],Y[At]),_=dt,S=At),(pt!==w||Pt!==b||Jt!==T||Qt!==L)&&(s.blendFuncSeparate(V[pt],V[Pt],V[Jt],V[Qt]),w=pt,b=Pt,T=Jt,L=Qt),(me.equals(M)===!1||Ee!==y)&&(s.blendColor(me.r,me.g,me.b,Ee),M.copy(me),y=Ee),v=I,P=!1}function lt(I,dt){I.side===an?J(s.CULL_FACE):K(s.CULL_FACE);let pt=I.side===De;dt&&(pt=!pt),mt(pt),I.blending===Ui&&I.transparent===!1?Z(zn):Z(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),a.setMask(I.colorWrite);const Pt=I.stencilWrite;c.setTest(Pt),Pt&&(c.setMask(I.stencilWriteMask),c.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),c.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),O(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?K(s.SAMPLE_ALPHA_TO_COVERAGE):J(s.SAMPLE_ALPHA_TO_COVERAGE)}function mt(I){C!==I&&(I?s.frontFace(s.CW):s.frontFace(s.CCW),C=I)}function A(I){I!==Dh?(K(s.CULL_FACE),I!==k&&(I===so?s.cullFace(s.BACK):I===Uh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):J(s.CULL_FACE),k=I}function E(I){I!==D&&(W&&s.lineWidth(I),D=I)}function O(I,dt,pt){I?(K(s.POLYGON_OFFSET_FILL),(F!==dt||B!==pt)&&(s.polygonOffset(dt,pt),F=dt,B=pt)):J(s.POLYGON_OFFSET_FILL)}function st(I){I?K(s.SCISSOR_TEST):J(s.SCISSOR_TEST)}function it(I){I===void 0&&(I=s.TEXTURE0+j-1),tt!==I&&(s.activeTexture(I),tt=I)}function rt(I,dt,pt){pt===void 0&&(tt===null?pt=s.TEXTURE0+j-1:pt=tt);let Pt=ut[pt];Pt===void 0&&(Pt={type:void 0,texture:void 0},ut[pt]=Pt),(Pt.type!==I||Pt.texture!==dt)&&(tt!==pt&&(s.activeTexture(pt),tt=pt),s.bindTexture(I,dt||Et[I]),Pt.type=I,Pt.texture=dt)}function wt(){const I=ut[tt];I!==void 0&&I.type!==void 0&&(s.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function gt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Mt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Lt(){try{s.texSubImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function kt(){try{s.texSubImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function nt(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function jt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Xt(){try{s.texStorage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ut(){try{s.texStorage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Tt(){try{s.texImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function yt(){try{s.texImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function zt(I){ft.equals(I)===!1&&(s.scissor(I.x,I.y,I.z,I.w),ft.copy(I))}function qt(I){xt.equals(I)===!1&&(s.viewport(I.x,I.y,I.z,I.w),xt.copy(I))}function re(I,dt){let pt=d.get(dt);pt===void 0&&(pt=new WeakMap,d.set(dt,pt));let Pt=pt.get(I);Pt===void 0&&(Pt=s.getUniformBlockIndex(dt,I.name),pt.set(I,Pt))}function Ht(I,dt){const Pt=d.get(dt).get(I);h.get(dt)!==Pt&&(s.uniformBlockBinding(dt,Pt,I.__bindingPointIndex),h.set(dt,Pt))}function ct(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),f={},tt=null,ut={},m={},x=new WeakMap,g=[],p=null,u=!1,v=null,_=null,w=null,b=null,S=null,T=null,L=null,M=new Ct(0,0,0),y=0,P=!1,C=null,k=null,D=null,F=null,B=null,ft.set(0,0,s.canvas.width,s.canvas.height),xt.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:K,disable:J,bindFramebuffer:at,drawBuffers:U,useProgram:ot,setBlending:Z,setMaterial:lt,setFlipSided:mt,setCullFace:A,setLineWidth:E,setPolygonOffset:O,setScissorTest:st,activeTexture:it,bindTexture:rt,unbindTexture:wt,compressedTexImage2D:gt,compressedTexImage3D:Mt,texImage2D:Tt,texImage3D:yt,updateUBOMapping:re,uniformBlockBinding:Ht,texStorage2D:Xt,texStorage3D:Ut,texSubImage2D:Lt,texSubImage3D:kt,compressedTexSubImage2D:nt,compressedTexSubImage3D:jt,scissor:zt,viewport:qt,reset:ct}}function V0(s,t,e,n,i,r,o){const a=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let d;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,E){return m?new OffscreenCanvas(A,E):hr("canvas")}function g(A,E,O,st){let it=1;if((A.width>st||A.height>st)&&(it=st/Math.max(A.width,A.height)),it<1||E===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const rt=E?cr:Math.floor,wt=rt(it*A.width),gt=rt(it*A.height);d===void 0&&(d=x(wt,gt));const Mt=O?x(wt,gt):d;return Mt.width=wt,Mt.height=gt,Mt.getContext("2d").drawImage(A,0,0,wt,gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+wt+"x"+gt+")."),Mt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function p(A){return ya(A.width)&&ya(A.height)}function u(A){return a?!1:A.wrapS!==ze||A.wrapT!==ze||A.minFilter!==ne&&A.minFilter!==be}function v(A,E){return A.generateMipmaps&&E&&A.minFilter!==ne&&A.minFilter!==be}function _(A){s.generateMipmap(A)}function w(A,E,O,st,it=!1){if(a===!1)return E;if(A!==null){if(s[A]!==void 0)return s[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let rt=E;if(E===s.RED&&(O===s.FLOAT&&(rt=s.R32F),O===s.HALF_FLOAT&&(rt=s.R16F),O===s.UNSIGNED_BYTE&&(rt=s.R8)),E===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(rt=s.R8UI),O===s.UNSIGNED_SHORT&&(rt=s.R16UI),O===s.UNSIGNED_INT&&(rt=s.R32UI),O===s.BYTE&&(rt=s.R8I),O===s.SHORT&&(rt=s.R16I),O===s.INT&&(rt=s.R32I)),E===s.RG&&(O===s.FLOAT&&(rt=s.RG32F),O===s.HALF_FLOAT&&(rt=s.RG16F),O===s.UNSIGNED_BYTE&&(rt=s.RG8)),E===s.RGBA){const wt=it?rr:Yt.getTransfer(st);O===s.FLOAT&&(rt=s.RGBA32F),O===s.HALF_FLOAT&&(rt=s.RGBA16F),O===s.UNSIGNED_BYTE&&(rt=wt===ee?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT_4_4_4_4&&(rt=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(rt=s.RGB5_A1)}return(rt===s.R16F||rt===s.R32F||rt===s.RG16F||rt===s.RG32F||rt===s.RGBA16F||rt===s.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function b(A,E,O){return v(A,O)===!0||A.isFramebufferTexture&&A.minFilter!==ne&&A.minFilter!==be?Math.log2(Math.max(E.width,E.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?E.mipmaps.length:1}function S(A){return A===ne||A===co||A===Ar?s.NEAREST:s.LINEAR}function T(A){const E=A.target;E.removeEventListener("dispose",T),M(E),E.isVideoTexture&&h.delete(E)}function L(A){const E=A.target;E.removeEventListener("dispose",L),P(E)}function M(A){const E=n.get(A);if(E.__webglInit===void 0)return;const O=A.source,st=f.get(O);if(st){const it=st[E.__cacheKey];it.usedTimes--,it.usedTimes===0&&y(A),Object.keys(st).length===0&&f.delete(O)}n.remove(A)}function y(A){const E=n.get(A);s.deleteTexture(E.__webglTexture);const O=A.source,st=f.get(O);delete st[E.__cacheKey],o.memory.textures--}function P(A){const E=A.texture,O=n.get(A),st=n.get(E);if(st.__webglTexture!==void 0&&(s.deleteTexture(st.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let it=0;it<6;it++){if(Array.isArray(O.__webglFramebuffer[it]))for(let rt=0;rt<O.__webglFramebuffer[it].length;rt++)s.deleteFramebuffer(O.__webglFramebuffer[it][rt]);else s.deleteFramebuffer(O.__webglFramebuffer[it]);O.__webglDepthbuffer&&s.deleteRenderbuffer(O.__webglDepthbuffer[it])}else{if(Array.isArray(O.__webglFramebuffer))for(let it=0;it<O.__webglFramebuffer.length;it++)s.deleteFramebuffer(O.__webglFramebuffer[it]);else s.deleteFramebuffer(O.__webglFramebuffer);if(O.__webglDepthbuffer&&s.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&s.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer)for(let it=0;it<O.__webglColorRenderbuffer.length;it++)O.__webglColorRenderbuffer[it]&&s.deleteRenderbuffer(O.__webglColorRenderbuffer[it]);O.__webglDepthRenderbuffer&&s.deleteRenderbuffer(O.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let it=0,rt=E.length;it<rt;it++){const wt=n.get(E[it]);wt.__webglTexture&&(s.deleteTexture(wt.__webglTexture),o.memory.textures--),n.remove(E[it])}n.remove(E),n.remove(A)}let C=0;function k(){C=0}function D(){const A=C;return A>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),C+=1,A}function F(A){const E=[];return E.push(A.wrapS),E.push(A.wrapT),E.push(A.wrapR||0),E.push(A.magFilter),E.push(A.minFilter),E.push(A.anisotropy),E.push(A.internalFormat),E.push(A.format),E.push(A.type),E.push(A.generateMipmaps),E.push(A.premultiplyAlpha),E.push(A.flipY),E.push(A.unpackAlignment),E.push(A.colorSpace),E.join()}function B(A,E){const O=n.get(A);if(A.isVideoTexture&&lt(A),A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){const st=A.image;if(st===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(st.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ft(O,A,E);return}}e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+E)}function j(A,E){const O=n.get(A);if(A.version>0&&O.__version!==A.version){ft(O,A,E);return}e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+E)}function W(A,E){const O=n.get(A);if(A.version>0&&O.__version!==A.version){ft(O,A,E);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+E)}function q(A,E){const O=n.get(A);if(A.version>0&&O.__version!==A.version){xt(O,A,E);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+E)}const Q={[sr]:s.REPEAT,[ze]:s.CLAMP_TO_EDGE,[_a]:s.MIRRORED_REPEAT},tt={[ne]:s.NEAREST,[co]:s.NEAREST_MIPMAP_NEAREST,[Ar]:s.NEAREST_MIPMAP_LINEAR,[be]:s.LINEAR,[fu]:s.LINEAR_MIPMAP_NEAREST,[ai]:s.LINEAR_MIPMAP_LINEAR},ut={[Su]:s.NEVER,[Cu]:s.ALWAYS,[bu]:s.LESS,[Rc]:s.LEQUAL,[Eu]:s.EQUAL,[Ru]:s.GEQUAL,[Tu]:s.GREATER,[Au]:s.NOTEQUAL};function X(A,E,O){if(O?(s.texParameteri(A,s.TEXTURE_WRAP_S,Q[E.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,Q[E.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,Q[E.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,tt[E.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,tt[E.minFilter])):(s.texParameteri(A,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(A,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(E.wrapS!==ze||E.wrapT!==ze)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(A,s.TEXTURE_MAG_FILTER,S(E.magFilter)),s.texParameteri(A,s.TEXTURE_MIN_FILTER,S(E.minFilter)),E.minFilter!==ne&&E.minFilter!==be&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,ut[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const st=t.get("EXT_texture_filter_anisotropic");if(E.magFilter===ne||E.minFilter!==Ar&&E.minFilter!==ai||E.type===bn&&t.has("OES_texture_float_linear")===!1||a===!1&&E.type===kn&&t.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||n.get(E).__currentAnisotropy)&&(s.texParameterf(A,st.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,i.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy)}}function et(A,E){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,E.addEventListener("dispose",T));const st=E.source;let it=f.get(st);it===void 0&&(it={},f.set(st,it));const rt=F(E);if(rt!==A.__cacheKey){it[rt]===void 0&&(it[rt]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,O=!0),it[rt].usedTimes++;const wt=it[A.__cacheKey];wt!==void 0&&(it[A.__cacheKey].usedTimes--,wt.usedTimes===0&&y(E)),A.__cacheKey=rt,A.__webglTexture=it[rt].texture}return O}function ft(A,E,O){let st=s.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(st=s.TEXTURE_2D_ARRAY),E.isData3DTexture&&(st=s.TEXTURE_3D);const it=et(A,E),rt=E.source;e.bindTexture(st,A.__webglTexture,s.TEXTURE0+O);const wt=n.get(rt);if(rt.version!==wt.__version||it===!0){e.activeTexture(s.TEXTURE0+O);const gt=Yt.getPrimaries(Yt.workingColorSpace),Mt=E.colorSpace===Je?null:Yt.getPrimaries(E.colorSpace),Lt=E.colorSpace===Je||gt===Mt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);const kt=u(E)&&p(E.image)===!1;let nt=g(E.image,kt,!1,i.maxTextureSize);nt=mt(E,nt);const jt=p(nt)||a,Xt=r.convert(E.format,E.colorSpace);let Ut=r.convert(E.type),Tt=w(E.internalFormat,Xt,Ut,E.colorSpace,E.isVideoTexture);X(st,E,jt);let yt;const zt=E.mipmaps,qt=a&&E.isVideoTexture!==!0&&Tt!==Tc,re=wt.__version===void 0||it===!0,Ht=b(E,nt,jt);if(E.isDepthTexture)Tt=s.DEPTH_COMPONENT,a?E.type===bn?Tt=s.DEPTH_COMPONENT32F:E.type===Sn?Tt=s.DEPTH_COMPONENT24:E.type===ii?Tt=s.DEPTH24_STENCIL8:Tt=s.DEPTH_COMPONENT16:E.type===bn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===si&&Tt===s.DEPTH_COMPONENT&&E.type!==Ua&&E.type!==Sn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=Sn,Ut=r.convert(E.type)),E.format===Oi&&Tt===s.DEPTH_COMPONENT&&(Tt=s.DEPTH_STENCIL,E.type!==ii&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=ii,Ut=r.convert(E.type))),re&&(qt?e.texStorage2D(s.TEXTURE_2D,1,Tt,nt.width,nt.height):e.texImage2D(s.TEXTURE_2D,0,Tt,nt.width,nt.height,0,Xt,Ut,null));else if(E.isDataTexture)if(zt.length>0&&jt){qt&&re&&e.texStorage2D(s.TEXTURE_2D,Ht,Tt,zt[0].width,zt[0].height);for(let ct=0,I=zt.length;ct<I;ct++)yt=zt[ct],qt?e.texSubImage2D(s.TEXTURE_2D,ct,0,0,yt.width,yt.height,Xt,Ut,yt.data):e.texImage2D(s.TEXTURE_2D,ct,Tt,yt.width,yt.height,0,Xt,Ut,yt.data);E.generateMipmaps=!1}else qt?(re&&e.texStorage2D(s.TEXTURE_2D,Ht,Tt,nt.width,nt.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,nt.width,nt.height,Xt,Ut,nt.data)):e.texImage2D(s.TEXTURE_2D,0,Tt,nt.width,nt.height,0,Xt,Ut,nt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){qt&&re&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,Tt,zt[0].width,zt[0].height,nt.depth);for(let ct=0,I=zt.length;ct<I;ct++)yt=zt[ct],E.format!==_e?Xt!==null?qt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ct,0,0,0,yt.width,yt.height,nt.depth,Xt,yt.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ct,Tt,yt.width,yt.height,nt.depth,0,yt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,ct,0,0,0,yt.width,yt.height,nt.depth,Xt,Ut,yt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,ct,Tt,yt.width,yt.height,nt.depth,0,Xt,Ut,yt.data)}else{qt&&re&&e.texStorage2D(s.TEXTURE_2D,Ht,Tt,zt[0].width,zt[0].height);for(let ct=0,I=zt.length;ct<I;ct++)yt=zt[ct],E.format!==_e?Xt!==null?qt?e.compressedTexSubImage2D(s.TEXTURE_2D,ct,0,0,yt.width,yt.height,Xt,yt.data):e.compressedTexImage2D(s.TEXTURE_2D,ct,Tt,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?e.texSubImage2D(s.TEXTURE_2D,ct,0,0,yt.width,yt.height,Xt,Ut,yt.data):e.texImage2D(s.TEXTURE_2D,ct,Tt,yt.width,yt.height,0,Xt,Ut,yt.data)}else if(E.isDataArrayTexture)qt?(re&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,Tt,nt.width,nt.height,nt.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,Xt,Ut,nt.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,Tt,nt.width,nt.height,nt.depth,0,Xt,Ut,nt.data);else if(E.isData3DTexture)qt?(re&&e.texStorage3D(s.TEXTURE_3D,Ht,Tt,nt.width,nt.height,nt.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,Xt,Ut,nt.data)):e.texImage3D(s.TEXTURE_3D,0,Tt,nt.width,nt.height,nt.depth,0,Xt,Ut,nt.data);else if(E.isFramebufferTexture){if(re)if(qt)e.texStorage2D(s.TEXTURE_2D,Ht,Tt,nt.width,nt.height);else{let ct=nt.width,I=nt.height;for(let dt=0;dt<Ht;dt++)e.texImage2D(s.TEXTURE_2D,dt,Tt,ct,I,0,Xt,Ut,null),ct>>=1,I>>=1}}else if(zt.length>0&&jt){qt&&re&&e.texStorage2D(s.TEXTURE_2D,Ht,Tt,zt[0].width,zt[0].height);for(let ct=0,I=zt.length;ct<I;ct++)yt=zt[ct],qt?e.texSubImage2D(s.TEXTURE_2D,ct,0,0,Xt,Ut,yt):e.texImage2D(s.TEXTURE_2D,ct,Tt,Xt,Ut,yt);E.generateMipmaps=!1}else qt?(re&&e.texStorage2D(s.TEXTURE_2D,Ht,Tt,nt.width,nt.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Xt,Ut,nt)):e.texImage2D(s.TEXTURE_2D,0,Tt,Xt,Ut,nt);v(E,jt)&&_(st),wt.__version=rt.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function xt(A,E,O){if(E.image.length!==6)return;const st=et(A,E),it=E.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+O);const rt=n.get(it);if(it.version!==rt.__version||st===!0){e.activeTexture(s.TEXTURE0+O);const wt=Yt.getPrimaries(Yt.workingColorSpace),gt=E.colorSpace===Je?null:Yt.getPrimaries(E.colorSpace),Mt=E.colorSpace===Je||wt===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);const Lt=E.isCompressedTexture||E.image[0].isCompressedTexture,kt=E.image[0]&&E.image[0].isDataTexture,nt=[];for(let ct=0;ct<6;ct++)!Lt&&!kt?nt[ct]=g(E.image[ct],!1,!0,i.maxCubemapSize):nt[ct]=kt?E.image[ct].image:E.image[ct],nt[ct]=mt(E,nt[ct]);const jt=nt[0],Xt=p(jt)||a,Ut=r.convert(E.format,E.colorSpace),Tt=r.convert(E.type),yt=w(E.internalFormat,Ut,Tt,E.colorSpace),zt=a&&E.isVideoTexture!==!0,qt=rt.__version===void 0||st===!0;let re=b(E,jt,Xt);X(s.TEXTURE_CUBE_MAP,E,Xt);let Ht;if(Lt){zt&&qt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,re,yt,jt.width,jt.height);for(let ct=0;ct<6;ct++){Ht=nt[ct].mipmaps;for(let I=0;I<Ht.length;I++){const dt=Ht[I];E.format!==_e?Ut!==null?zt?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,I,0,0,dt.width,dt.height,Ut,dt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,I,yt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):zt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,I,0,0,dt.width,dt.height,Ut,Tt,dt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,I,yt,dt.width,dt.height,0,Ut,Tt,dt.data)}}}else{Ht=E.mipmaps,zt&&qt&&(Ht.length>0&&re++,e.texStorage2D(s.TEXTURE_CUBE_MAP,re,yt,nt[0].width,nt[0].height));for(let ct=0;ct<6;ct++)if(kt){zt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,nt[ct].width,nt[ct].height,Ut,Tt,nt[ct].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,yt,nt[ct].width,nt[ct].height,0,Ut,Tt,nt[ct].data);for(let I=0;I<Ht.length;I++){const pt=Ht[I].image[ct].image;zt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,I+1,0,0,pt.width,pt.height,Ut,Tt,pt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,I+1,yt,pt.width,pt.height,0,Ut,Tt,pt.data)}}else{zt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,Ut,Tt,nt[ct]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,yt,Ut,Tt,nt[ct]);for(let I=0;I<Ht.length;I++){const dt=Ht[I];zt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,I+1,0,0,Ut,Tt,dt.image[ct]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,I+1,yt,Ut,Tt,dt.image[ct])}}}v(E,Xt)&&_(s.TEXTURE_CUBE_MAP),rt.__version=it.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function _t(A,E,O,st,it,rt){const wt=r.convert(O.format,O.colorSpace),gt=r.convert(O.type),Mt=w(O.internalFormat,wt,gt,O.colorSpace);if(!n.get(E).__hasExternalTextures){const kt=Math.max(1,E.width>>rt),nt=Math.max(1,E.height>>rt);it===s.TEXTURE_3D||it===s.TEXTURE_2D_ARRAY?e.texImage3D(it,rt,Mt,kt,nt,E.depth,0,wt,gt,null):e.texImage2D(it,rt,Mt,kt,nt,0,wt,gt,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),Z(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,st,it,n.get(O).__webglTexture,0,V(E)):(it===s.TEXTURE_2D||it>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,st,it,n.get(O).__webglTexture,rt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Et(A,E,O){if(s.bindRenderbuffer(s.RENDERBUFFER,A),E.depthBuffer&&!E.stencilBuffer){let st=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(O||Z(E)){const it=E.depthTexture;it&&it.isDepthTexture&&(it.type===bn?st=s.DEPTH_COMPONENT32F:it.type===Sn&&(st=s.DEPTH_COMPONENT24));const rt=V(E);Z(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,rt,st,E.width,E.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,rt,st,E.width,E.height)}else s.renderbufferStorage(s.RENDERBUFFER,st,E.width,E.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,A)}else if(E.depthBuffer&&E.stencilBuffer){const st=V(E);O&&Z(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,st,s.DEPTH24_STENCIL8,E.width,E.height):Z(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,st,s.DEPTH24_STENCIL8,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,A)}else{const st=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let it=0;it<st.length;it++){const rt=st[it],wt=r.convert(rt.format,rt.colorSpace),gt=r.convert(rt.type),Mt=w(rt.internalFormat,wt,gt,rt.colorSpace),Lt=V(E);O&&Z(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Lt,Mt,E.width,E.height):Z(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Lt,Mt,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,Mt,E.width,E.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function K(A,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),B(E.depthTexture,0);const st=n.get(E.depthTexture).__webglTexture,it=V(E);if(E.depthTexture.format===si)Z(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,st,0,it):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,st,0);else if(E.depthTexture.format===Oi)Z(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,st,0,it):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function J(A){const E=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!E.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");K(E.__webglFramebuffer,A)}else if(O){E.__webglDepthbuffer=[];for(let st=0;st<6;st++)e.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[st]),E.__webglDepthbuffer[st]=s.createRenderbuffer(),Et(E.__webglDepthbuffer[st],A,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=s.createRenderbuffer(),Et(E.__webglDepthbuffer,A,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function at(A,E,O){const st=n.get(A);E!==void 0&&_t(st.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&J(A)}function U(A){const E=A.texture,O=n.get(A),st=n.get(E);A.addEventListener("dispose",L),A.isWebGLMultipleRenderTargets!==!0&&(st.__webglTexture===void 0&&(st.__webglTexture=s.createTexture()),st.__version=E.version,o.memory.textures++);const it=A.isWebGLCubeRenderTarget===!0,rt=A.isWebGLMultipleRenderTargets===!0,wt=p(A)||a;if(it){O.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(a&&E.mipmaps&&E.mipmaps.length>0){O.__webglFramebuffer[gt]=[];for(let Mt=0;Mt<E.mipmaps.length;Mt++)O.__webglFramebuffer[gt][Mt]=s.createFramebuffer()}else O.__webglFramebuffer[gt]=s.createFramebuffer()}else{if(a&&E.mipmaps&&E.mipmaps.length>0){O.__webglFramebuffer=[];for(let gt=0;gt<E.mipmaps.length;gt++)O.__webglFramebuffer[gt]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(rt)if(i.drawBuffers){const gt=A.texture;for(let Mt=0,Lt=gt.length;Mt<Lt;Mt++){const kt=n.get(gt[Mt]);kt.__webglTexture===void 0&&(kt.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&Z(A)===!1){const gt=rt?E:[E];O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Mt=0;Mt<gt.length;Mt++){const Lt=gt[Mt];O.__webglColorRenderbuffer[Mt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[Mt]);const kt=r.convert(Lt.format,Lt.colorSpace),nt=r.convert(Lt.type),jt=w(Lt.internalFormat,kt,nt,Lt.colorSpace,A.isXRRenderTarget===!0),Xt=V(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,Xt,jt,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Mt,s.RENDERBUFFER,O.__webglColorRenderbuffer[Mt])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),Et(O.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(it){e.bindTexture(s.TEXTURE_CUBE_MAP,st.__webglTexture),X(s.TEXTURE_CUBE_MAP,E,wt);for(let gt=0;gt<6;gt++)if(a&&E.mipmaps&&E.mipmaps.length>0)for(let Mt=0;Mt<E.mipmaps.length;Mt++)_t(O.__webglFramebuffer[gt][Mt],A,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Mt);else _t(O.__webglFramebuffer[gt],A,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);v(E,wt)&&_(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){const gt=A.texture;for(let Mt=0,Lt=gt.length;Mt<Lt;Mt++){const kt=gt[Mt],nt=n.get(kt);e.bindTexture(s.TEXTURE_2D,nt.__webglTexture),X(s.TEXTURE_2D,kt,wt),_t(O.__webglFramebuffer,A,kt,s.COLOR_ATTACHMENT0+Mt,s.TEXTURE_2D,0),v(kt,wt)&&_(s.TEXTURE_2D)}e.unbindTexture()}else{let gt=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?gt=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(gt,st.__webglTexture),X(gt,E,wt),a&&E.mipmaps&&E.mipmaps.length>0)for(let Mt=0;Mt<E.mipmaps.length;Mt++)_t(O.__webglFramebuffer[Mt],A,E,s.COLOR_ATTACHMENT0,gt,Mt);else _t(O.__webglFramebuffer,A,E,s.COLOR_ATTACHMENT0,gt,0);v(E,wt)&&_(gt),e.unbindTexture()}A.depthBuffer&&J(A)}function ot(A){const E=p(A)||a,O=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let st=0,it=O.length;st<it;st++){const rt=O[st];if(v(rt,E)){const wt=A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,gt=n.get(rt).__webglTexture;e.bindTexture(wt,gt),_(wt),e.unbindTexture()}}}function Y(A){if(a&&A.samples>0&&Z(A)===!1){const E=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],O=A.width,st=A.height;let it=s.COLOR_BUFFER_BIT;const rt=[],wt=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,gt=n.get(A),Mt=A.isWebGLMultipleRenderTargets===!0;if(Mt)for(let Lt=0;Lt<E.length;Lt++)e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let Lt=0;Lt<E.length;Lt++){rt.push(s.COLOR_ATTACHMENT0+Lt),A.depthBuffer&&rt.push(wt);const kt=gt.__ignoreDepthValues!==void 0?gt.__ignoreDepthValues:!1;if(kt===!1&&(A.depthBuffer&&(it|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&(it|=s.STENCIL_BUFFER_BIT)),Mt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,gt.__webglColorRenderbuffer[Lt]),kt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[wt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[wt])),Mt){const nt=n.get(E[Lt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,nt,0)}s.blitFramebuffer(0,0,O,st,0,0,O,st,it,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,rt)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Mt)for(let Lt=0;Lt<E.length;Lt++){e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.RENDERBUFFER,gt.__webglColorRenderbuffer[Lt]);const kt=n.get(E[Lt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.TEXTURE_2D,kt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}}function V(A){return Math.min(i.maxSamples,A.samples)}function Z(A){const E=n.get(A);return a&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function lt(A){const E=o.render.frame;h.get(A)!==E&&(h.set(A,E),A.update())}function mt(A,E){const O=A.colorSpace,st=A.format,it=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===Ma||O!==An&&O!==Je&&(Yt.getTransfer(O)===ee?a===!1?t.has("EXT_sRGB")===!0&&st===_e?(A.format=Ma,A.minFilter=be,A.generateMipmaps=!1):E=Lc.sRGBToLinear(E):(st!==_e||it!==Me)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),E}this.allocateTextureUnit=D,this.resetTextureUnits=k,this.setTexture2D=B,this.setTexture2DArray=j,this.setTexture3D=W,this.setTextureCube=q,this.rebindTextures=at,this.setupRenderTarget=U,this.updateRenderTargetMipmap=ot,this.updateMultisampleRenderTarget=Y,this.setupDepthRenderbuffer=J,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=Z}function W0(s,t,e){const n=e.isWebGL2;function i(r,o=Je){let a;const l=Yt.getTransfer(o);if(r===Me)return s.UNSIGNED_BYTE;if(r===Mc)return s.UNSIGNED_SHORT_4_4_4_4;if(r===yc)return s.UNSIGNED_SHORT_5_5_5_1;if(r===du)return s.BYTE;if(r===pu)return s.SHORT;if(r===Ua)return s.UNSIGNED_SHORT;if(r===_c)return s.INT;if(r===Sn)return s.UNSIGNED_INT;if(r===bn)return s.FLOAT;if(r===kn)return n?s.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===mu)return s.ALPHA;if(r===_e)return s.RGBA;if(r===gu)return s.LUMINANCE;if(r===vu)return s.LUMINANCE_ALPHA;if(r===si)return s.DEPTH_COMPONENT;if(r===Oi)return s.DEPTH_STENCIL;if(r===Ma)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===vr)return s.RED;if(r===wc)return s.RED_INTEGER;if(r===Sc)return s.RG;if(r===bc)return s.RG_INTEGER;if(r===Ec)return s.RGBA_INTEGER;if(r===Rr||r===Cr||r===Lr||r===Pr)if(l===ee)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Rr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Cr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Lr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Pr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Rr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Cr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Lr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Pr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ho||r===uo||r===fo||r===po)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===ho)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===uo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===fo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===po)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Tc)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===mo||r===go)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===mo)return l===ee?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===go)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===vo||r===xo||r===_o||r===Mo||r===yo||r===wo||r===So||r===bo||r===Eo||r===To||r===Ao||r===Ro||r===Co||r===Lo)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===vo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===xo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===_o)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Mo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===yo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===wo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===So)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===bo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Eo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===To)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ao)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ro)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Co)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Lo)return l===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Dr||r===Po||r===Do)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Dr)return l===ee?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Po)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Do)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===xu||r===Uo||r===Io||r===No)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Dr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Uo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Io)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===No)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ii?n?s.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class X0 extends $e{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Oe extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $0={type:"move"};class ea{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,n),u=this._getHandJoint(c,g);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),m=.02,x=.005;c.inputState.pinching&&f>m+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=m-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent($0)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Oe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class q0 extends Bi{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,f=null,m=null,x=null;const g=e.getContextAttributes();let p=null,u=null;const v=[],_=[],w=new It;let b=null;const S=new $e;S.layers.enable(1),S.viewport=new Zt;const T=new $e;T.layers.enable(2),T.viewport=new Zt;const L=[S,T],M=new X0;M.layers.enable(1),M.layers.enable(2);let y=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let et=v[X];return et===void 0&&(et=new ea,v[X]=et),et.getTargetRaySpace()},this.getControllerGrip=function(X){let et=v[X];return et===void 0&&(et=new ea,v[X]=et),et.getGripSpace()},this.getHand=function(X){let et=v[X];return et===void 0&&(et=new ea,v[X]=et),et.getHandSpace()};function C(X){const et=_.indexOf(X.inputSource);if(et===-1)return;const ft=v[et];ft!==void 0&&(ft.update(X.inputSource,X.frame,c||o),ft.dispatchEvent({type:X.type,data:X.inputSource}))}function k(){i.removeEventListener("select",C),i.removeEventListener("selectstart",C),i.removeEventListener("selectend",C),i.removeEventListener("squeeze",C),i.removeEventListener("squeezestart",C),i.removeEventListener("squeezeend",C),i.removeEventListener("end",k),i.removeEventListener("inputsourceschange",D);for(let X=0;X<v.length;X++){const et=_[X];et!==null&&(_[X]=null,v[X].disconnect(et))}y=null,P=null,t.setRenderTarget(p),m=null,f=null,d=null,i=null,u=null,ut.stop(),n.isPresenting=!1,t.setPixelRatio(b),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d},this.getFrame=function(){return x},this.getSession=function(){return i},this.setSession=async function(X){if(i=X,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",C),i.addEventListener("selectstart",C),i.addEventListener("selectend",C),i.addEventListener("squeeze",C),i.addEventListener("squeezestart",C),i.addEventListener("squeezeend",C),i.addEventListener("end",k),i.addEventListener("inputsourceschange",D),g.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(w),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const et={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(i,e,et),i.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),u=new dn(m.framebufferWidth,m.framebufferHeight,{format:_e,type:Me,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let et=null,ft=null,xt=null;g.depth&&(xt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=g.stencil?Oi:si,ft=g.stencil?ii:Sn);const _t={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:r};d=new XRWebGLBinding(i,e),f=d.createProjectionLayer(_t),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),u=new dn(f.textureWidth,f.textureHeight,{format:_e,type:Me,depthTexture:new Ba(f.textureWidth,f.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const Et=t.properties.get(u);Et.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ut.setContext(i),ut.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function D(X){for(let et=0;et<X.removed.length;et++){const ft=X.removed[et],xt=_.indexOf(ft);xt>=0&&(_[xt]=null,v[xt].disconnect(ft))}for(let et=0;et<X.added.length;et++){const ft=X.added[et];let xt=_.indexOf(ft);if(xt===-1){for(let Et=0;Et<v.length;Et++)if(Et>=_.length){_.push(ft),xt=Et;break}else if(_[Et]===null){_[Et]=ft,xt=Et;break}if(xt===-1)break}const _t=v[xt];_t&&_t.connect(ft)}}const F=new N,B=new N;function j(X,et,ft){F.setFromMatrixPosition(et.matrixWorld),B.setFromMatrixPosition(ft.matrixWorld);const xt=F.distanceTo(B),_t=et.projectionMatrix.elements,Et=ft.projectionMatrix.elements,K=_t[14]/(_t[10]-1),J=_t[14]/(_t[10]+1),at=(_t[9]+1)/_t[5],U=(_t[9]-1)/_t[5],ot=(_t[8]-1)/_t[0],Y=(Et[8]+1)/Et[0],V=K*ot,Z=K*Y,lt=xt/(-ot+Y),mt=lt*-ot;et.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(mt),X.translateZ(lt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const A=K+lt,E=J+lt,O=V-mt,st=Z+(xt-mt),it=at*J/E*A,rt=U*J/E*A;X.projectionMatrix.makePerspective(O,st,it,rt,A,E),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function W(X,et){et===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(et.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(i===null)return;M.near=T.near=S.near=X.near,M.far=T.far=S.far=X.far,(y!==M.near||P!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),y=M.near,P=M.far);const et=X.parent,ft=M.cameras;W(M,et);for(let xt=0;xt<ft.length;xt++)W(ft[xt],et);ft.length===2?j(M,S,T):M.projectionMatrix.copy(S.projectionMatrix),q(X,M,et)};function q(X,et,ft){ft===null?X.matrix.copy(et.matrixWorld):(X.matrix.copy(ft.matrixWorld),X.matrix.invert(),X.matrix.multiply(et.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(et.projectionMatrix),X.projectionMatrixInverse.copy(et.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=ps*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(X){l=X,f!==null&&(f.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)};let Q=null;function tt(X,et){if(h=et.getViewerPose(c||o),x=et,h!==null){const ft=h.views;m!==null&&(t.setRenderTargetFramebuffer(u,m.framebuffer),t.setRenderTarget(u));let xt=!1;ft.length!==M.cameras.length&&(M.cameras.length=0,xt=!0);for(let _t=0;_t<ft.length;_t++){const Et=ft[_t];let K=null;if(m!==null)K=m.getViewport(Et);else{const at=d.getViewSubImage(f,Et);K=at.viewport,_t===0&&(t.setRenderTargetTextures(u,at.colorTexture,f.ignoreDepthValues?void 0:at.depthStencilTexture),t.setRenderTarget(u))}let J=L[_t];J===void 0&&(J=new $e,J.layers.enable(_t),J.viewport=new Zt,L[_t]=J),J.matrix.fromArray(Et.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(Et.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(K.x,K.y,K.width,K.height),_t===0&&(M.matrix.copy(J.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),xt===!0&&M.cameras.push(J)}}for(let ft=0;ft<v.length;ft++){const xt=_[ft],_t=v[ft];xt!==null&&_t!==void 0&&_t.update(xt,et,c||o)}Q&&Q(X,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),x=null}const ut=new Bc;ut.setAnimationLoop(tt),this.setAnimationLoop=function(X){Q=X},this.dispose=function(){}}}function j0(s,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,zc(s)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function i(p,u,v,_,w){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&m(p,u,w)):u.isMeshMatcapMaterial?(r(p,u),x(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),g(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?l(p,u,v,_):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===De&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===De&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);const v=t.get(u).envMap;if(v&&(p.envMap.value=v,p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;const _=s._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*_,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,v,_){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*v,p.scale.value=_*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,v){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===De&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,u){u.matcap&&(p.matcap.value=u.matcap)}function g(p,u){const v=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Y0(s,t,e,n){let i={},r={},o=[];const a=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(v,_){const w=_.program;n.uniformBlockBinding(v,w)}function c(v,_){let w=i[v.id];w===void 0&&(x(v),w=h(v),i[v.id]=w,v.addEventListener("dispose",p));const b=_.program;n.updateUBOMapping(v,b);const S=t.render.frame;r[v.id]!==S&&(f(v),r[v.id]=S)}function h(v){const _=d();v.__bindingPointIndex=_;const w=s.createBuffer(),b=v.__size,S=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,w),s.bufferData(s.UNIFORM_BUFFER,b,S),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,w),w}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const _=i[v.id],w=v.uniforms,b=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let S=0,T=w.length;S<T;S++){const L=Array.isArray(w[S])?w[S]:[w[S]];for(let M=0,y=L.length;M<y;M++){const P=L[M];if(m(P,S,M,b)===!0){const C=P.__offset,k=Array.isArray(P.value)?P.value:[P.value];let D=0;for(let F=0;F<k.length;F++){const B=k[F],j=g(B);typeof B=="number"||typeof B=="boolean"?(P.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,C+D,P.__data)):B.isMatrix3?(P.__data[0]=B.elements[0],P.__data[1]=B.elements[1],P.__data[2]=B.elements[2],P.__data[3]=0,P.__data[4]=B.elements[3],P.__data[5]=B.elements[4],P.__data[6]=B.elements[5],P.__data[7]=0,P.__data[8]=B.elements[6],P.__data[9]=B.elements[7],P.__data[10]=B.elements[8],P.__data[11]=0):(B.toArray(P.__data,D),D+=j.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,C,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(v,_,w,b){const S=v.value,T=_+"_"+w;if(b[T]===void 0)return typeof S=="number"||typeof S=="boolean"?b[T]=S:b[T]=S.clone(),!0;{const L=b[T];if(typeof S=="number"||typeof S=="boolean"){if(L!==S)return b[T]=S,!0}else if(L.equals(S)===!1)return L.copy(S),!0}return!1}function x(v){const _=v.uniforms;let w=0;const b=16;for(let T=0,L=_.length;T<L;T++){const M=Array.isArray(_[T])?_[T]:[_[T]];for(let y=0,P=M.length;y<P;y++){const C=M[y],k=Array.isArray(C.value)?C.value:[C.value];for(let D=0,F=k.length;D<F;D++){const B=k[D],j=g(B),W=w%b;W!==0&&b-W<j.boundary&&(w+=b-W),C.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=w,w+=j.storage}}}const S=w%b;return S>0&&(w+=b-S),v.__size=w,v.__cache={},this}function g(v){const _={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(_.boundary=4,_.storage=4):v.isVector2?(_.boundary=8,_.storage=8):v.isVector3||v.isColor?(_.boundary=16,_.storage=12):v.isVector4?(_.boundary=16,_.storage=16):v.isMatrix3?(_.boundary=48,_.storage=48):v.isMatrix4?(_.boundary=64,_.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),_}function p(v){const _=v.target;_.removeEventListener("dispose",p);const w=o.indexOf(_.__bindingPointIndex);o.splice(w,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function u(){for(const v in i)s.deleteBuffer(i[v]);o=[],i={},r={}}return{bind:l,update:c,dispose:u}}class $c{constructor(t={}){const{canvas:e=Wu(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;const m=new Uint32Array(4),x=new Int32Array(4);let g=null,p=null;const u=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=xe,this._useLegacyLights=!1,this.toneMapping=On,this.toneMappingExposure=1;const _=this;let w=!1,b=0,S=0,T=null,L=-1,M=null;const y=new Zt,P=new Zt;let C=null;const k=new Ct(0);let D=0,F=e.width,B=e.height,j=1,W=null,q=null;const Q=new Zt(0,0,F,B),tt=new Zt(0,0,F,B);let ut=!1;const X=new Vi;let et=!1,ft=!1,xt=null;const _t=new Kt,Et=new It,K=new N,J={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function at(){return T===null?j:1}let U=n;function ot(R,z){for(let H=0;H<R.length;H++){const $=R[H],G=e.getContext($,z);if(G!==null)return G}return null}try{const R={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Da}`),e.addEventListener("webglcontextlost",ct,!1),e.addEventListener("webglcontextrestored",I,!1),e.addEventListener("webglcontextcreationerror",dt,!1),U===null){const z=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&z.shift(),U=ot(z,R),U===null)throw ot(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&U instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),U.getShaderPrecisionFormat===void 0&&(U.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let Y,V,Z,lt,mt,A,E,O,st,it,rt,wt,gt,Mt,Lt,kt,nt,jt,Xt,Ut,Tt,yt,zt,qt;function re(){Y=new rm(U),V=new Qp(U,Y,t),Y.init(V),yt=new W0(U,Y,V),Z=new H0(U,Y,V),lt=new lm(U),mt=new R0,A=new V0(U,Y,Z,mt,V,yt,lt),E=new em(_),O=new sm(_),st=new gf(U,V),zt=new Zp(U,Y,st,V),it=new am(U,st,lt,zt),rt=new fm(U,it,st,lt),Xt=new um(U,V,A),kt=new tm(mt),wt=new A0(_,E,O,Y,V,zt,kt),gt=new j0(_,mt),Mt=new L0,Lt=new F0(Y,V),jt=new Kp(_,E,O,Z,rt,f,l),nt=new G0(_,rt,V),qt=new Y0(U,lt,V,Z),Ut=new Jp(U,Y,lt,V),Tt=new om(U,Y,lt,V),lt.programs=wt.programs,_.capabilities=V,_.extensions=Y,_.properties=mt,_.renderLists=Mt,_.shadowMap=nt,_.state=Z,_.info=lt}re();const Ht=new q0(_,U);this.xr=Ht,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const R=Y.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Y.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(R){R!==void 0&&(j=R,this.setSize(F,B,!1))},this.getSize=function(R){return R.set(F,B)},this.setSize=function(R,z,H=!0){if(Ht.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=R,B=z,e.width=Math.floor(R*j),e.height=Math.floor(z*j),H===!0&&(e.style.width=R+"px",e.style.height=z+"px"),this.setViewport(0,0,R,z)},this.getDrawingBufferSize=function(R){return R.set(F*j,B*j).floor()},this.setDrawingBufferSize=function(R,z,H){F=R,B=z,j=H,e.width=Math.floor(R*H),e.height=Math.floor(z*H),this.setViewport(0,0,R,z)},this.getCurrentViewport=function(R){return R.copy(y)},this.getViewport=function(R){return R.copy(Q)},this.setViewport=function(R,z,H,$){R.isVector4?Q.set(R.x,R.y,R.z,R.w):Q.set(R,z,H,$),Z.viewport(y.copy(Q).multiplyScalar(j).floor())},this.getScissor=function(R){return R.copy(tt)},this.setScissor=function(R,z,H,$){R.isVector4?tt.set(R.x,R.y,R.z,R.w):tt.set(R,z,H,$),Z.scissor(P.copy(tt).multiplyScalar(j).floor())},this.getScissorTest=function(){return ut},this.setScissorTest=function(R){Z.setScissorTest(ut=R)},this.setOpaqueSort=function(R){W=R},this.setTransparentSort=function(R){q=R},this.getClearColor=function(R){return R.copy(jt.getClearColor())},this.setClearColor=function(){jt.setClearColor.apply(jt,arguments)},this.getClearAlpha=function(){return jt.getClearAlpha()},this.setClearAlpha=function(){jt.setClearAlpha.apply(jt,arguments)},this.clear=function(R=!0,z=!0,H=!0){let $=0;if(R){let G=!1;if(T!==null){const vt=T.texture.format;G=vt===Ec||vt===bc||vt===wc}if(G){const vt=T.texture.type,St=vt===Me||vt===Sn||vt===Ua||vt===ii||vt===Mc||vt===yc,Rt=jt.getClearColor(),Dt=jt.getClearAlpha(),Bt=Rt.r,Nt=Rt.g,Ft=Rt.b;St?(m[0]=Bt,m[1]=Nt,m[2]=Ft,m[3]=Dt,U.clearBufferuiv(U.COLOR,0,m)):(x[0]=Bt,x[1]=Nt,x[2]=Ft,x[3]=Dt,U.clearBufferiv(U.COLOR,0,x))}else $|=U.COLOR_BUFFER_BIT}z&&($|=U.DEPTH_BUFFER_BIT),H&&($|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ct,!1),e.removeEventListener("webglcontextrestored",I,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),Mt.dispose(),Lt.dispose(),mt.dispose(),E.dispose(),O.dispose(),rt.dispose(),zt.dispose(),qt.dispose(),wt.dispose(),Ht.dispose(),Ht.removeEventListener("sessionstart",Ee),Ht.removeEventListener("sessionend",te),xt&&(xt.dispose(),xt=null),Te.stop()};function ct(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function I(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const R=lt.autoReset,z=nt.enabled,H=nt.autoUpdate,$=nt.needsUpdate,G=nt.type;re(),lt.autoReset=R,nt.enabled=z,nt.autoUpdate=H,nt.needsUpdate=$,nt.type=G}function dt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function pt(R){const z=R.target;z.removeEventListener("dispose",pt),Pt(z)}function Pt(R){At(R),mt.remove(R)}function At(R){const z=mt.get(R).programs;z!==void 0&&(z.forEach(function(H){wt.releaseProgram(H)}),R.isShaderMaterial&&wt.releaseShaderCache(R))}this.renderBufferDirect=function(R,z,H,$,G,vt){z===null&&(z=J);const St=G.isMesh&&G.matrixWorld.determinant()<0,Rt=dh(R,z,H,$,G);Z.setMaterial($,St);let Dt=H.index,Bt=1;if($.wireframe===!0){if(Dt=it.getWireframeAttribute(H),Dt===void 0)return;Bt=2}const Nt=H.drawRange,Ft=H.attributes.position;let oe=Nt.start*Bt,He=(Nt.start+Nt.count)*Bt;vt!==null&&(oe=Math.max(oe,vt.start*Bt),He=Math.min(He,(vt.start+vt.count)*Bt)),Dt!==null?(oe=Math.max(oe,0),He=Math.min(He,Dt.count)):Ft!=null&&(oe=Math.max(oe,0),He=Math.min(He,Ft.count));const ge=He-oe;if(ge<0||ge===1/0)return;zt.setup(G,$,Rt,H,Dt);let pn,ie=Ut;if(Dt!==null&&(pn=st.get(Dt),ie=Tt,ie.setIndex(pn)),G.isMesh)$.wireframe===!0?(Z.setLineWidth($.wireframeLinewidth*at()),ie.setMode(U.LINES)):ie.setMode(U.TRIANGLES);else if(G.isLine){let Vt=$.linewidth;Vt===void 0&&(Vt=1),Z.setLineWidth(Vt*at()),G.isLineSegments?ie.setMode(U.LINES):G.isLineLoop?ie.setMode(U.LINE_LOOP):ie.setMode(U.LINE_STRIP)}else G.isPoints?ie.setMode(U.POINTS):G.isSprite&&ie.setMode(U.TRIANGLES);if(G.isBatchedMesh)ie.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else if(G.isInstancedMesh)ie.renderInstances(oe,ge,G.count);else if(H.isInstancedBufferGeometry){const Vt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,Sr=Math.min(H.instanceCount,Vt);ie.renderInstances(oe,ge,Sr)}else ie.render(oe,ge)};function Jt(R,z,H){R.transparent===!0&&R.side===an&&R.forceSinglePass===!1?(R.side=De,R.needsUpdate=!0,Ms(R,z,H),R.side=Tn,R.needsUpdate=!0,Ms(R,z,H),R.side=an):Ms(R,z,H)}this.compile=function(R,z,H=null){H===null&&(H=R),p=Lt.get(H),p.init(),v.push(p),H.traverseVisible(function(G){G.isLight&&G.layers.test(z.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),R!==H&&R.traverseVisible(function(G){G.isLight&&G.layers.test(z.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),p.setupLights(_._useLegacyLights);const $=new Set;return R.traverse(function(G){const vt=G.material;if(vt)if(Array.isArray(vt))for(let St=0;St<vt.length;St++){const Rt=vt[St];Jt(Rt,H,G),$.add(Rt)}else Jt(vt,H,G),$.add(vt)}),v.pop(),p=null,$},this.compileAsync=function(R,z,H=null){const $=this.compile(R,z,H);return new Promise(G=>{function vt(){if($.forEach(function(St){mt.get(St).currentProgram.isReady()&&$.delete(St)}),$.size===0){G(R);return}setTimeout(vt,10)}Y.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let Qt=null;function me(R){Qt&&Qt(R)}function Ee(){Te.stop()}function te(){Te.start()}const Te=new Bc;Te.setAnimationLoop(me),typeof self<"u"&&Te.setContext(self),this.setAnimationLoop=function(R){Qt=R,Ht.setAnimationLoop(R),R===null?Te.stop():Te.start()},Ht.addEventListener("sessionstart",Ee),Ht.addEventListener("sessionend",te),this.render=function(R,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Ht.enabled===!0&&Ht.isPresenting===!0&&(Ht.cameraAutoUpdate===!0&&Ht.updateCamera(z),z=Ht.getCamera()),R.isScene===!0&&R.onBeforeRender(_,R,z,T),p=Lt.get(R,v.length),p.init(),v.push(p),_t.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),X.setFromProjectionMatrix(_t),ft=this.localClippingEnabled,et=kt.init(this.clippingPlanes,ft),g=Mt.get(R,u.length),g.init(),u.push(g),ln(R,z,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(W,q),this.info.render.frame++,et===!0&&kt.beginShadows();const H=p.state.shadowsArray;if(nt.render(H,R,z),et===!0&&kt.endShadows(),this.info.autoReset===!0&&this.info.reset(),jt.render(g,R),p.setupLights(_._useLegacyLights),z.isArrayCamera){const $=z.cameras;for(let G=0,vt=$.length;G<vt;G++){const St=$[G];ja(g,R,St,St.viewport)}}else ja(g,R,z);T!==null&&(A.updateMultisampleRenderTarget(T),A.updateRenderTargetMipmap(T)),R.isScene===!0&&R.onAfterRender(_,R,z),zt.resetDefaultState(),L=-1,M=null,v.pop(),v.length>0?p=v[v.length-1]:p=null,u.pop(),u.length>0?g=u[u.length-1]:g=null};function ln(R,z,H,$){if(R.visible===!1)return;if(R.layers.test(z.layers)){if(R.isGroup)H=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(z);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||X.intersectsSprite(R)){$&&K.setFromMatrixPosition(R.matrixWorld).applyMatrix4(_t);const St=rt.update(R),Rt=R.material;Rt.visible&&g.push(R,St,Rt,H,K.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||X.intersectsObject(R))){const St=rt.update(R),Rt=R.material;if($&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),K.copy(R.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),K.copy(St.boundingSphere.center)),K.applyMatrix4(R.matrixWorld).applyMatrix4(_t)),Array.isArray(Rt)){const Dt=St.groups;for(let Bt=0,Nt=Dt.length;Bt<Nt;Bt++){const Ft=Dt[Bt],oe=Rt[Ft.materialIndex];oe&&oe.visible&&g.push(R,St,oe,H,K.z,Ft)}}else Rt.visible&&g.push(R,St,Rt,H,K.z,null)}}const vt=R.children;for(let St=0,Rt=vt.length;St<Rt;St++)ln(vt[St],z,H,$)}function ja(R,z,H,$){const G=R.opaque,vt=R.transmissive,St=R.transparent;p.setupLightsView(H),et===!0&&kt.setGlobalState(_.clippingPlanes,H),vt.length>0&&fh(G,vt,z,H),$&&Z.viewport(y.copy($)),G.length>0&&_s(G,z,H),vt.length>0&&_s(vt,z,H),St.length>0&&_s(St,z,H),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function fh(R,z,H,$){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;const vt=V.isWebGL2;xt===null&&(xt=new dn(1,1,{generateMipmaps:!0,type:Y.has("EXT_color_buffer_half_float")?kn:Me,minFilter:ai,samples:vt?4:0})),_.getDrawingBufferSize(Et),vt?xt.setSize(Et.x,Et.y):xt.setSize(cr(Et.x),cr(Et.y));const St=_.getRenderTarget();_.setRenderTarget(xt),_.getClearColor(k),D=_.getClearAlpha(),D<1&&_.setClearColor(16777215,.5),_.clear();const Rt=_.toneMapping;_.toneMapping=On,_s(R,H,$),A.updateMultisampleRenderTarget(xt),A.updateRenderTargetMipmap(xt);let Dt=!1;for(let Bt=0,Nt=z.length;Bt<Nt;Bt++){const Ft=z[Bt],oe=Ft.object,He=Ft.geometry,ge=Ft.material,pn=Ft.group;if(ge.side===an&&oe.layers.test($.layers)){const ie=ge.side;ge.side=De,ge.needsUpdate=!0,Ya(oe,H,$,He,ge,pn),ge.side=ie,ge.needsUpdate=!0,Dt=!0}}Dt===!0&&(A.updateMultisampleRenderTarget(xt),A.updateRenderTargetMipmap(xt)),_.setRenderTarget(St),_.setClearColor(k,D),_.toneMapping=Rt}function _s(R,z,H){const $=z.isScene===!0?z.overrideMaterial:null;for(let G=0,vt=R.length;G<vt;G++){const St=R[G],Rt=St.object,Dt=St.geometry,Bt=$===null?St.material:$,Nt=St.group;Rt.layers.test(H.layers)&&Ya(Rt,z,H,Dt,Bt,Nt)}}function Ya(R,z,H,$,G,vt){R.onBeforeRender(_,z,H,$,G,vt),R.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),G.onBeforeRender(_,z,H,$,R,vt),G.transparent===!0&&G.side===an&&G.forceSinglePass===!1?(G.side=De,G.needsUpdate=!0,_.renderBufferDirect(H,z,$,G,R,vt),G.side=Tn,G.needsUpdate=!0,_.renderBufferDirect(H,z,$,G,R,vt),G.side=an):_.renderBufferDirect(H,z,$,G,R,vt),R.onAfterRender(_,z,H,$,G,vt)}function Ms(R,z,H){z.isScene!==!0&&(z=J);const $=mt.get(R),G=p.state.lights,vt=p.state.shadowsArray,St=G.state.version,Rt=wt.getParameters(R,G.state,vt,z,H),Dt=wt.getProgramCacheKey(Rt);let Bt=$.programs;$.environment=R.isMeshStandardMaterial?z.environment:null,$.fog=z.fog,$.envMap=(R.isMeshStandardMaterial?O:E).get(R.envMap||$.environment),Bt===void 0&&(R.addEventListener("dispose",pt),Bt=new Map,$.programs=Bt);let Nt=Bt.get(Dt);if(Nt!==void 0){if($.currentProgram===Nt&&$.lightsStateVersion===St)return Za(R,Rt),Nt}else Rt.uniforms=wt.getUniforms(R),R.onBuild(H,Rt,_),R.onBeforeCompile(Rt,_),Nt=wt.acquireProgram(Rt,Dt),Bt.set(Dt,Nt),$.uniforms=Rt.uniforms;const Ft=$.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ft.clippingPlanes=kt.uniform),Za(R,Rt),$.needsLights=mh(R),$.lightsStateVersion=St,$.needsLights&&(Ft.ambientLightColor.value=G.state.ambient,Ft.lightProbe.value=G.state.probe,Ft.directionalLights.value=G.state.directional,Ft.directionalLightShadows.value=G.state.directionalShadow,Ft.spotLights.value=G.state.spot,Ft.spotLightShadows.value=G.state.spotShadow,Ft.rectAreaLights.value=G.state.rectArea,Ft.ltc_1.value=G.state.rectAreaLTC1,Ft.ltc_2.value=G.state.rectAreaLTC2,Ft.pointLights.value=G.state.point,Ft.pointLightShadows.value=G.state.pointShadow,Ft.hemisphereLights.value=G.state.hemi,Ft.directionalShadowMap.value=G.state.directionalShadowMap,Ft.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ft.spotShadowMap.value=G.state.spotShadowMap,Ft.spotLightMatrix.value=G.state.spotLightMatrix,Ft.spotLightMap.value=G.state.spotLightMap,Ft.pointShadowMap.value=G.state.pointShadowMap,Ft.pointShadowMatrix.value=G.state.pointShadowMatrix),$.currentProgram=Nt,$.uniformsList=null,Nt}function Ka(R){if(R.uniformsList===null){const z=R.currentProgram.getUniforms();R.uniformsList=er.seqWithValue(z.seq,R.uniforms)}return R.uniformsList}function Za(R,z){const H=mt.get(R);H.outputColorSpace=z.outputColorSpace,H.batching=z.batching,H.instancing=z.instancing,H.instancingColor=z.instancingColor,H.skinning=z.skinning,H.morphTargets=z.morphTargets,H.morphNormals=z.morphNormals,H.morphColors=z.morphColors,H.morphTargetsCount=z.morphTargetsCount,H.numClippingPlanes=z.numClippingPlanes,H.numIntersection=z.numClipIntersection,H.vertexAlphas=z.vertexAlphas,H.vertexTangents=z.vertexTangents,H.toneMapping=z.toneMapping}function dh(R,z,H,$,G){z.isScene!==!0&&(z=J),A.resetTextureUnits();const vt=z.fog,St=$.isMeshStandardMaterial?z.environment:null,Rt=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:An,Dt=($.isMeshStandardMaterial?O:E).get($.envMap||St),Bt=$.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Nt=!!H.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Ft=!!H.morphAttributes.position,oe=!!H.morphAttributes.normal,He=!!H.morphAttributes.color;let ge=On;$.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ge=_.toneMapping);const pn=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ie=pn!==void 0?pn.length:0,Vt=mt.get($),Sr=p.state.lights;if(et===!0&&(ft===!0||R!==M)){const Ye=R===M&&$.id===L;kt.setState($,R,Ye)}let ae=!1;$.version===Vt.__version?(Vt.needsLights&&Vt.lightsStateVersion!==Sr.state.version||Vt.outputColorSpace!==Rt||G.isBatchedMesh&&Vt.batching===!1||!G.isBatchedMesh&&Vt.batching===!0||G.isInstancedMesh&&Vt.instancing===!1||!G.isInstancedMesh&&Vt.instancing===!0||G.isSkinnedMesh&&Vt.skinning===!1||!G.isSkinnedMesh&&Vt.skinning===!0||G.isInstancedMesh&&Vt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Vt.instancingColor===!1&&G.instanceColor!==null||Vt.envMap!==Dt||$.fog===!0&&Vt.fog!==vt||Vt.numClippingPlanes!==void 0&&(Vt.numClippingPlanes!==kt.numPlanes||Vt.numIntersection!==kt.numIntersection)||Vt.vertexAlphas!==Bt||Vt.vertexTangents!==Nt||Vt.morphTargets!==Ft||Vt.morphNormals!==oe||Vt.morphColors!==He||Vt.toneMapping!==ge||V.isWebGL2===!0&&Vt.morphTargetsCount!==ie)&&(ae=!0):(ae=!0,Vt.__version=$.version);let Hn=Vt.currentProgram;ae===!0&&(Hn=Ms($,z,G));let Ja=!1,$i=!1,br=!1;const ye=Hn.getUniforms(),Vn=Vt.uniforms;if(Z.useProgram(Hn.program)&&(Ja=!0,$i=!0,br=!0),$.id!==L&&(L=$.id,$i=!0),Ja||M!==R){ye.setValue(U,"projectionMatrix",R.projectionMatrix),ye.setValue(U,"viewMatrix",R.matrixWorldInverse);const Ye=ye.map.cameraPosition;Ye!==void 0&&Ye.setValue(U,K.setFromMatrixPosition(R.matrixWorld)),V.logarithmicDepthBuffer&&ye.setValue(U,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&ye.setValue(U,"isOrthographic",R.isOrthographicCamera===!0),M!==R&&(M=R,$i=!0,br=!0)}if(G.isSkinnedMesh){ye.setOptional(U,G,"bindMatrix"),ye.setOptional(U,G,"bindMatrixInverse");const Ye=G.skeleton;Ye&&(V.floatVertexTextures?(Ye.boneTexture===null&&Ye.computeBoneTexture(),ye.setValue(U,"boneTexture",Ye.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}G.isBatchedMesh&&(ye.setOptional(U,G,"batchingTexture"),ye.setValue(U,"batchingTexture",G._matricesTexture,A));const Er=H.morphAttributes;if((Er.position!==void 0||Er.normal!==void 0||Er.color!==void 0&&V.isWebGL2===!0)&&Xt.update(G,H,Hn),($i||Vt.receiveShadow!==G.receiveShadow)&&(Vt.receiveShadow=G.receiveShadow,ye.setValue(U,"receiveShadow",G.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(Vn.envMap.value=Dt,Vn.flipEnvMap.value=Dt.isCubeTexture&&Dt.isRenderTargetTexture===!1?-1:1),$i&&(ye.setValue(U,"toneMappingExposure",_.toneMappingExposure),Vt.needsLights&&ph(Vn,br),vt&&$.fog===!0&&gt.refreshFogUniforms(Vn,vt),gt.refreshMaterialUniforms(Vn,$,j,B,xt),er.upload(U,Ka(Vt),Vn,A)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(er.upload(U,Ka(Vt),Vn,A),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&ye.setValue(U,"center",G.center),ye.setValue(U,"modelViewMatrix",G.modelViewMatrix),ye.setValue(U,"normalMatrix",G.normalMatrix),ye.setValue(U,"modelMatrix",G.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const Ye=$.uniformsGroups;for(let Tr=0,gh=Ye.length;Tr<gh;Tr++)if(V.isWebGL2){const Qa=Ye[Tr];qt.update(Qa,Hn),qt.bind(Qa,Hn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Hn}function ph(R,z){R.ambientLightColor.needsUpdate=z,R.lightProbe.needsUpdate=z,R.directionalLights.needsUpdate=z,R.directionalLightShadows.needsUpdate=z,R.pointLights.needsUpdate=z,R.pointLightShadows.needsUpdate=z,R.spotLights.needsUpdate=z,R.spotLightShadows.needsUpdate=z,R.rectAreaLights.needsUpdate=z,R.hemisphereLights.needsUpdate=z}function mh(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(R,z,H){mt.get(R.texture).__webglTexture=z,mt.get(R.depthTexture).__webglTexture=H;const $=mt.get(R);$.__hasExternalTextures=!0,$.__hasExternalTextures&&($.__autoAllocateDepthBuffer=H===void 0,$.__autoAllocateDepthBuffer||Y.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(R,z){const H=mt.get(R);H.__webglFramebuffer=z,H.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(R,z=0,H=0){T=R,b=z,S=H;let $=!0,G=null,vt=!1,St=!1;if(R){const Dt=mt.get(R);Dt.__useDefaultFramebuffer!==void 0?(Z.bindFramebuffer(U.FRAMEBUFFER,null),$=!1):Dt.__webglFramebuffer===void 0?A.setupRenderTarget(R):Dt.__hasExternalTextures&&A.rebindTextures(R,mt.get(R.texture).__webglTexture,mt.get(R.depthTexture).__webglTexture);const Bt=R.texture;(Bt.isData3DTexture||Bt.isDataArrayTexture||Bt.isCompressedArrayTexture)&&(St=!0);const Nt=mt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Nt[z])?G=Nt[z][H]:G=Nt[z],vt=!0):V.isWebGL2&&R.samples>0&&A.useMultisampledRTT(R)===!1?G=mt.get(R).__webglMultisampledFramebuffer:Array.isArray(Nt)?G=Nt[H]:G=Nt,y.copy(R.viewport),P.copy(R.scissor),C=R.scissorTest}else y.copy(Q).multiplyScalar(j).floor(),P.copy(tt).multiplyScalar(j).floor(),C=ut;if(Z.bindFramebuffer(U.FRAMEBUFFER,G)&&V.drawBuffers&&$&&Z.drawBuffers(R,G),Z.viewport(y),Z.scissor(P),Z.setScissorTest(C),vt){const Dt=mt.get(R.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+z,Dt.__webglTexture,H)}else if(St){const Dt=mt.get(R.texture),Bt=z||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Dt.__webglTexture,H||0,Bt)}L=-1},this.readRenderTargetPixels=function(R,z,H,$,G,vt,St){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Rt=mt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&St!==void 0&&(Rt=Rt[St]),Rt){Z.bindFramebuffer(U.FRAMEBUFFER,Rt);try{const Dt=R.texture,Bt=Dt.format,Nt=Dt.type;if(Bt!==_e&&yt.convert(Bt)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ft=Nt===kn&&(Y.has("EXT_color_buffer_half_float")||V.isWebGL2&&Y.has("EXT_color_buffer_float"));if(Nt!==Me&&yt.convert(Nt)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Nt===bn&&(V.isWebGL2||Y.has("OES_texture_float")||Y.has("WEBGL_color_buffer_float")))&&!Ft){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=R.width-$&&H>=0&&H<=R.height-G&&U.readPixels(z,H,$,G,yt.convert(Bt),yt.convert(Nt),vt)}finally{const Dt=T!==null?mt.get(T).__webglFramebuffer:null;Z.bindFramebuffer(U.FRAMEBUFFER,Dt)}}},this.copyFramebufferToTexture=function(R,z,H=0){const $=Math.pow(2,-H),G=Math.floor(z.image.width*$),vt=Math.floor(z.image.height*$);A.setTexture2D(z,0),U.copyTexSubImage2D(U.TEXTURE_2D,H,0,0,R.x,R.y,G,vt),Z.unbindTexture()},this.copyTextureToTexture=function(R,z,H,$=0){const G=z.image.width,vt=z.image.height,St=yt.convert(H.format),Rt=yt.convert(H.type);A.setTexture2D(H,0),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,H.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,H.unpackAlignment),z.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,$,R.x,R.y,G,vt,St,Rt,z.image.data):z.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,$,R.x,R.y,z.mipmaps[0].width,z.mipmaps[0].height,St,z.mipmaps[0].data):U.texSubImage2D(U.TEXTURE_2D,$,R.x,R.y,St,Rt,z.image),$===0&&H.generateMipmaps&&U.generateMipmap(U.TEXTURE_2D),Z.unbindTexture()},this.copyTextureToTexture3D=function(R,z,H,$,G=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const vt=R.max.x-R.min.x+1,St=R.max.y-R.min.y+1,Rt=R.max.z-R.min.z+1,Dt=yt.convert($.format),Bt=yt.convert($.type);let Nt;if($.isData3DTexture)A.setTexture3D($,0),Nt=U.TEXTURE_3D;else if($.isDataArrayTexture||$.isCompressedArrayTexture)A.setTexture2DArray($,0),Nt=U.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,$.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,$.unpackAlignment);const Ft=U.getParameter(U.UNPACK_ROW_LENGTH),oe=U.getParameter(U.UNPACK_IMAGE_HEIGHT),He=U.getParameter(U.UNPACK_SKIP_PIXELS),ge=U.getParameter(U.UNPACK_SKIP_ROWS),pn=U.getParameter(U.UNPACK_SKIP_IMAGES),ie=H.isCompressedTexture?H.mipmaps[G]:H.image;U.pixelStorei(U.UNPACK_ROW_LENGTH,ie.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ie.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,R.min.x),U.pixelStorei(U.UNPACK_SKIP_ROWS,R.min.y),U.pixelStorei(U.UNPACK_SKIP_IMAGES,R.min.z),H.isDataTexture||H.isData3DTexture?U.texSubImage3D(Nt,G,z.x,z.y,z.z,vt,St,Rt,Dt,Bt,ie.data):H.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),U.compressedTexSubImage3D(Nt,G,z.x,z.y,z.z,vt,St,Rt,Dt,ie.data)):U.texSubImage3D(Nt,G,z.x,z.y,z.z,vt,St,Rt,Dt,Bt,ie),U.pixelStorei(U.UNPACK_ROW_LENGTH,Ft),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,oe),U.pixelStorei(U.UNPACK_SKIP_PIXELS,He),U.pixelStorei(U.UNPACK_SKIP_ROWS,ge),U.pixelStorei(U.UNPACK_SKIP_IMAGES,pn),G===0&&$.generateMipmaps&&U.generateMipmap(Nt),Z.unbindTexture()},this.initTexture=function(R){R.isCubeTexture?A.setTextureCube(R,0):R.isData3DTexture?A.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?A.setTexture2DArray(R,0):A.setTexture2D(R,0),Z.unbindTexture()},this.resetState=function(){b=0,S=0,T=null,Z.reset(),zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ia?"display-p3":"srgb",e.unpackColorSpace=Yt.workingColorSpace===xr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===xe?ri:Ac}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===ri?xe:An}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class K0 extends $c{}K0.prototype.isWebGL1Renderer=!0;class wr extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Rn extends ke{constructor(t=null,e=1,n=1,i,r,o,a,l,c=ne,h=ne,d,f){super(null,o,a,l,c,h,i,r,d,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qe extends ue{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Si=new Kt,bl=new Kt,Ws=[],El=new on,Z0=new Kt,Zi=new le,Ji=new Bn;class J0 extends le{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new qe(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Z0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new on),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Si),El.copy(t.boundingBox).applyMatrix4(Si),this.boundingBox.union(El)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Bn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Si),Ji.copy(t.boundingSphere).applyMatrix4(Si),this.boundingSphere.union(Ji)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(Zi.geometry=this.geometry,Zi.material=this.material,Zi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ji.copy(this.boundingSphere),Ji.applyMatrix4(n),t.ray.intersectsSphere(Ji)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Si),bl.multiplyMatrices(n,Si),Zi.matrixWorld=bl,Zi.raycast(t,Ws);for(let o=0,a=Ws.length;o<a;o++){const l=Ws[o];l.instanceId=r,l.object=this,e.push(l)}Ws.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new qe(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Q0 extends ms{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ct(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Tl=new Kt,Sa=new Fa,Xs=new Bn,$s=new N;class tg extends Be{constructor(t=new Ue,e=new Q0){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Xs.copy(n.boundingSphere),Xs.applyMatrix4(i),Xs.radius+=r,t.ray.intersectsSphere(Xs)===!1)return;Tl.copy(i).invert(),Sa.copy(t.ray).applyMatrix4(Tl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){const f=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let x=f,g=m;x<g;x++){const p=c.getX(x);$s.fromBufferAttribute(d,p),Al($s,p,l,i,t,e,this)}}else{const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let x=f,g=m;x<g;x++)$s.fromBufferAttribute(d,x),Al($s,x,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Al(s,t,e,n,i,r,o){const a=Sa.distanceSqToPoint(s);if(a<e){const l=new N;Sa.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:o})}}class Ga extends Ue{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(r.slice(),3)),this.setAttribute("uv",new he(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(v){const _=new N,w=new N,b=new N;for(let S=0;S<e.length;S+=3)m(e[S+0],_),m(e[S+1],w),m(e[S+2],b),l(_,w,b,v)}function l(v,_,w,b){const S=b+1,T=[];for(let L=0;L<=S;L++){T[L]=[];const M=v.clone().lerp(w,L/S),y=_.clone().lerp(w,L/S),P=S-L;for(let C=0;C<=P;C++)C===0&&L===S?T[L][C]=M:T[L][C]=M.clone().lerp(y,C/P)}for(let L=0;L<S;L++)for(let M=0;M<2*(S-L)-1;M++){const y=Math.floor(M/2);M%2===0?(f(T[L][y+1]),f(T[L+1][y]),f(T[L][y])):(f(T[L][y+1]),f(T[L+1][y+1]),f(T[L+1][y]))}}function c(v){const _=new N;for(let w=0;w<r.length;w+=3)_.x=r[w+0],_.y=r[w+1],_.z=r[w+2],_.normalize().multiplyScalar(v),r[w+0]=_.x,r[w+1]=_.y,r[w+2]=_.z}function h(){const v=new N;for(let _=0;_<r.length;_+=3){v.x=r[_+0],v.y=r[_+1],v.z=r[_+2];const w=p(v)/2/Math.PI+.5,b=u(v)/Math.PI+.5;o.push(w,1-b)}x(),d()}function d(){for(let v=0;v<o.length;v+=6){const _=o[v+0],w=o[v+2],b=o[v+4],S=Math.max(_,w,b),T=Math.min(_,w,b);S>.9&&T<.1&&(_<.2&&(o[v+0]+=1),w<.2&&(o[v+2]+=1),b<.2&&(o[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function m(v,_){const w=v*3;_.x=t[w+0],_.y=t[w+1],_.z=t[w+2]}function x(){const v=new N,_=new N,w=new N,b=new N,S=new It,T=new It,L=new It;for(let M=0,y=0;M<r.length;M+=9,y+=6){v.set(r[M+0],r[M+1],r[M+2]),_.set(r[M+3],r[M+4],r[M+5]),w.set(r[M+6],r[M+7],r[M+8]),S.set(o[y+0],o[y+1]),T.set(o[y+2],o[y+3]),L.set(o[y+4],o[y+5]),b.copy(v).add(_).add(w).divideScalar(3);const P=p(b);g(S,y+0,v,P),g(T,y+2,_,P),g(L,y+4,w,P)}}function g(v,_,w,b){b<0&&v.x===1&&(o[_]=v.x-1),w.x===0&&w.z===0&&(o[_]=b/2/Math.PI+.5)}function p(v){return Math.atan2(v.z,-v.x)}function u(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ga(t.vertices,t.indices,t.radius,t.details)}}class Ha extends Ga{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ha(t.radius,t.detail)}}class vs extends Ue{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class eg{constructor(t,e,n=0,i=1/0){this.ray=new Fa(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new za,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ba(t,this,n,e),n.sort(Rl),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)ba(t[i],this,n,e);return n.sort(Rl),n}}function Rl(s,t){return s.distance-t.distance}function ba(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let r=0,o=i.length;r<o;r++)ba(i[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Da}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Da);const bi=s=>Number.isInteger(s)?s.toFixed(1):String(s),un={loi:1,pond:24,other:48,max:63},ng=-1,ig=.5,qc=-.6,sg=.5625,Ie=`
#define PI 3.14159265
#define NEAR_E ${bi(ds)}
#define NORMAL_E ${bi(uc)}
#define SLOTS ${Nn}
#define DIST_POND ${un.pond}
#define DIST_OTHER ${un.other}
#define DIST_REEF ${bi(ng)}
#define DIST_FILL ${bi(ig)}
#define DIST_POND_LEVEL ${bi(qc)}
#define DIST_BASE ${bi(sg)}
`,xs=`
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
`,Ge=`
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
`,Cl=Array.from({length:Nn},(s,t)=>t),Gn=`
${Cl.map(s=>`uniform sampler2D uSlotH${s};`).join(`
`)}
float slotMetres(int s, vec2 xz) {
  // (samplers can only be picked by a constant index)
${Cl.map(s=>`  if (s == ${s}) return rectMetres(uSlotH${s}, uSlotRect[${s}], xz);`).join(`
`)}
  return -4000.0;
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
uniform sampler2D uDistAux;   // r the patch's weight, g a feature's mask, b its paddy (hash, and the bank in the top bit), a its index
uniform sampler2D uDistCarve; // a loʻi's r terraces down the valley (modulo 64), g paddies across it (RG16F); off the loʻi, a filled channel's level in r, the normals' offset in g
uniform float uPatchK;        // the patch's weight in the year: 1 before its until, 0 after
uniform vec4 uFeatK[16];      // each rastered feature's weight in the year, by index (loʻi DIST_LOI, ponds DIST_POND, the rest after)
float featK(int i) { return uFeatK[i >> 2][i & 3]; }
float distTexel(ivec2 p) {
  float h = texelFetch(uDistH, p, 0).r;
  vec4 a = texelFetch(uDistAux, p, 0);
  // (the patch byte: under 128 toward the reef, from 128 toward the fill at
  // the level the carve keeps there; district-decode.js patchLevel)
  float r = a.r * 255.0;
  if (r < 127.5) h = mix(h, DIST_REEF, r / 127.0 * uPatchK);
  else h = mix(h, max(DIST_FILL, texelFetch(uDistCarve, p, 0).r), (r - 128.0) / 127.0 * uPatchK);
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
  return mix(mix(distTexel(i), distTexel(i + ivec2(1, 0)), fr.x), mix(distTexel(i + ivec2(0, 1)), distTexel(i + ivec2(1, 1)), fr.x), fr.y);
}
float groundMetres(vec2 xz) {
  float w = distWeight(xz);
  if (w >= 1.0) return distMetres(xz);
  float m = islandMetres(xz);
  return w > 0.0 ? mix(m, distMetres(xz), w) : m;
}
// a fishpond's water at xz (0..1), for the sea to lie calm in it
float distPond(vec2 xz) {
  if (distWeight(xz) <= 0.0) return 0.0;
  ivec2 i = ivec2(distGrid(xz) + 0.5);
  vec4 a = texelFetch(uDistAux, i, 0);
  int f = int(a.a * 255.0 + 0.5);
  return f >= DIST_POND && f < DIST_OTHER ? a.g * featK(f) : 0.0;
}
`,Xi=`
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
`,rg=`
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
`,ag=`
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
`,jc=`
uniform sampler2D uOwnH;
uniform vec4 uOwnRect;
uniform int uSelf;
float packMetres(vec2 xz) {
  float a = archMetres(xz);
  if (uSelf < 0) return a;
  float w = slotWeight(uSelf, xz);
  return w > 0.0 ? mix(a, rectMetres(uOwnH, uOwnRect, xz), w) : a;
}
`,Yc=`
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
`,og=`
${Ie}
${Ge}
${jc}
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
`,lg=`
${Ie}
${xs}
${Ge}
${jc}
${Xi}
${rg}
${ag}
${Yc}
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
`,cg=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Va(){const s=new Ue;return s.setAttribute("position",new ue(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const hg=`
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
`;class ug{constructor(t){this.renderer=t,this.size=new It;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?kn:Me,this.sceneRT=new dn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new Ba(1,1,Sn),this.quad=new le(Va(),new fe({vertexShader:cg,fragmentShader:hg,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new It},uInvProj:{value:new Kt},uCamWorld:{value:new Kt},uCamPos:{value:new N},uSunDir:{value:new N(0,1,0)},uSunColor:{value:new Ct},uFogColor:{value:new Ct(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new wr,this.quadScene.add(this.quad),this.quadCam=new Mr(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const fg=`
${Ie}
${Ge}
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
`;class dg{constructor(t,e=1024,n=fg){const{W:i,H:r}=t,o=Math.min(1,e/Math.max(i,r)),a=Math.max(16,Math.round(i*o)),l=Math.max(16,Math.round(r*o));this.terrain=t,this.rt=new dn(a,l,{type:Me,format:vr,depthBuffer:!1,minFilter:be,magFilter:be});const c=t.pack.rect;this.uniforms={...t.uniforms,uSunDir:{value:new N(0,1,0)},uStep:{value:Math.max((c.x1-c.x0)/a,(c.z1-c.z0)/l)},uTop:{value:1}},this.material=new fe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:n,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new wr;const h=new le(Va(),this.material);h.frustumCulled=!1,this.scene.add(h),this.cam=new Mr(-1,1,1,-1,0,1),this.h=l,this.strips=4,this.strip=-1,this.drawn={sun:new N(0,-2,0),vert:-1,k:-1}}get texture(){return this.rt.texture}update(t,e,n,i,r){const o=this.uniforms,a=this.drawn;if(this.strip<0){if(!(e.angleTo(a.sun)>.004||Math.abs(n-a.vert)>a.vert*.015||Math.abs(i-a.k)>.03))return;if(o.uSunDir.value.copy(e),o.uTop.value=r,a.sun.copy(e),a.vert=n,a.k=i,!this.ever)return this.ever=!0,this.draw(t,-1);this.strip=0}this.draw(t,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e){const n=this.rt;if(e>=0){const r=Math.ceil(this.h/this.strips);n.scissor.set(0,e*r,n.width,r),n.scissorTest=!0}else n.scissorTest=!1;const i=t.getRenderTarget();t.setRenderTarget(n),t.render(this.scene,this.cam),t.setRenderTarget(i),n.scissorTest=!1}dispose(){this.rt.dispose(),this.material.dispose()}}const na=32,Ll=1600,Pl=-.5;function Kc(s,t,e){const n=new Rn(s,t,e,vr,bn);return n.minFilter=ne,n.magFilter=ne,n.wrapS=n.wrapT=ze,n.needsUpdate=!0,n}function Dl(s,t,e,n=1){const i=new Rn(s,t,e,_e,Me);return i.minFilter=ai,i.magFilter=be,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=ze,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class Ea{constructor(t,e,n=null,i={}){this.pack=t,this.world=e;const r=t.data,{W:o,H:a}=t,{x0:l,z0:c,x1:h,z1:d}=t.rect;this.rect=new Zt(l,c,h,d),this.heights=r.metres,this.W=o,this.H=a;const f=e.app.renderer.capabilities.getMaxAnisotropy();this.heightTex=Kc(r.metres,o,a),this.normalTex=Dl(r.normals,o,a,Math.min(8,f)),this.landTex=Dl(r.land,o,a,Math.min(4,f)),r.normals=null,r.land=null;const m=Math.max((h-l)/o,(d-c)/a);this.texel=m;const x=Math.max(h-l,d-c);this.levels=Math.max(1,Math.ceil(Math.log2(x/(na*m)))+1),this.leafSize=x/2**(this.levels-1),this.buildMinMax(Array.isArray(n)?n:n?[n]:[]),this.full=this.makeGrid(na),this.half=this.makeGrid(na/2),this.morph=[];for(let u=0;u<12;u++)this.morph.push(new It);const g=e.uniforms,p=(Array.isArray(n)?null:n)||e.arch||this;this.uniforms={...g,uOwnH:{value:this.heightTex},uOwnRect:{value:this.rect},uOwnN:{value:this.normalTex},uOwnL:{value:this.landTex},uArchN:{value:p.normalTex},uArchL:{value:p.landTex},uOwnS:{value:null},uOwnLandA:{value:null},uOwnLandB:{value:null},uSelf:{value:-1},uOwnRain:{value:n&&!t.rainUrl?0:1},uMorph:{value:this.morph},uCamPos:{value:new N},uKau:{value:.5},uDebug:{value:0},...i.uniforms},this.group=new Oe;for(const u of[this.full,this.half])u.material=new fe({vertexShader:i.vertexShader||og,fragmentShader:i.fragmentShader||lg,uniforms:{...this.uniforms,uGrid:{value:u.dim}}}),u.mesh=new le(u.geometry,u.material),u.mesh.frustumCulled=!1,u.mesh.matrixAutoUpdate=!1,this.group.add(u.mesh);this.shadow=new dg(this,i.shadowSize,i.shadowFragment),this.uniforms.uOwnS.value=this.shadow.texture,this._frustum=new Vi,this._m=new Kt,this._box=new on,this.rangeK=3.5,this.applyRange(this.rangeK)}makeGrid(t){const e=new vs,n=new Float32Array((t+1)*(t+1)*3);for(let a=0;a<=t;a++)for(let l=0;l<=t;l++){const c=(a*(t+1)+l)*3;n[c]=l/t,n[c+2]=a/t}const i=[];for(let a=0;a<t;a++)for(let l=0;l<t;l++){const c=a*(t+1)+l,h=c+1,d=c+t+1,f=d+1;l+a&1?i.push(c,d,h,h,d,f):i.push(c,d,f,c,f,h)}e.setIndex(i),e.setAttribute("position",new ue(n,3));const r=new Float32Array(Ll*4),o=new qe(r,4);return o.setUsage(ss),e.setAttribute("aNode",o),e.instanceCount=0,{dim:t,geometry:e,data:r,attr:o,count:0}}buildMinMax(t){const{W:e,H:n,heights:i}=this,r=this.pack.rect,o=2**(this.levels-1),a=this.leafSize,l=e/(r.x1-r.x0),c=n/(r.z1-r.z0);let h=new Float32Array(o*o).fill(1/0),d=new Float32Array(o*o).fill(-1/0);for(let m=0;m<o;m++){const x=m*a;if(x>=r.z1-r.z0)continue;const g=Math.max(0,Math.floor(x*c)-1),p=Math.min(n-1,Math.ceil((x+a)*c)+1);for(let u=0;u<o;u++){const v=u*a;if(v>=r.x1-r.x0)continue;const _=Math.max(0,Math.floor(v*l)-1),w=Math.min(e-1,Math.ceil((v+a)*l)+1);let b=1/0,S=-1/0;for(let T=g;T<=p;T++)for(let L=_;L<=w;L++){const M=i[T*e+L];M<b&&(b=M),M>S&&(S=M)}if(t.length){const T=Math.max(2,Math.round((p-g)/16));for(const L of t)for(let M=g;M<=p;M+=T)for(let y=_;y<=w;y+=T){const P=L.metresAt(r.x0+(y+.5)/l,r.z0+(M+.5)/c);P<b&&(b=P),P>S&&(S=P)}b-=40,S+=40}h[m*o+u]=b,d[m*o+u]=S}}this.mm=[{lo:h,hi:d,n:o}];let f=o;for(;f>1;){const m=f/2,x=new Float32Array(m*m),g=new Float32Array(m*m);for(let p=0;p<m;p++)for(let u=0;u<m;u++){const v=2*p*f+2*u;x[p*m+u]=Math.min(h[v],h[v+1],h[v+f],h[v+f+1]),g[p*m+u]=Math.max(d[v],d[v+1],d[v+f],d[v+f+1])}h=x,d=g,f=m,this.mm.push({lo:h,hi:d,n:f})}}metresAt(t,e){const n=this.pack.rect,{W:i,H:r,heights:o}=this;let a=(t-n.x0)/(n.x1-n.x0)*i-.5,l=(e-n.z0)/(n.z1-n.z0)*r-.5;a<0?a=0:a>i-1.001&&(a=i-1.001),l<0?l=0:l>r-1.001&&(l=r-1.001);const c=a|0,h=l|0,d=a-c,f=l-h,m=h*i+c,x=o[m]+(o[m+1]-o[m])*d,g=o[m+i]+(o[m+i+1]-o[m+i])*d;return x+(g-x)*f}applyRange(t){this.rangeK=t;const e=t*this.leafSize;this.ranges=[];for(let n=0;n<this.levels;n++)this.ranges.push(e*2**n);this.ranges[this.levels-1]=1e9;for(let n=0;n<this.levels;n++){const i=this.ranges[n],r=n>0?this.ranges[n-1]:0;this.morph[n].set(r+(i-r)*.5,i*.97)}}setSelf(t){this.uniforms.uSelf.value=t;for(const e of[this.full,this.half])e.material.uniforms.uSelf.value=t}update(t,e){this.group.visible=e,this.full.count=0,this.half.count=0,e&&(this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.vert=this.world.uniforms.uVert.value,this.uniforms.uCamPos.value.copy(t.position),this.select(0,0,this.levels-1));for(const n of[this.full,this.half])n.geometry.instanceCount=n.count,n.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],r=this.leafSize*2**n,o=this.pack.rect.x0+t*r,a=this.pack.rect.z0+e*r,l=this.vert,c=Math.min(0,i.lo[e*i.n+t])*l-.3,h=Math.max(0,i.hi[e*i.n+t])*l+.1;return this._box.min.set(o,c,a),this._box.max.set(o+r,h,a+r),this._box}select(t,e,n){const i=this.mm[n];if(!(i.hi[e*i.n+t]>=Pl))return!0;const o=this.nodeBox(t,e,n);if(o.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(o))return!0;const a=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,a,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,a,n),!0;for(let l=0;l<4;l++){const c=t*2+(l&1),h=e*2+(l>>1);if(!this.select(c,h,n-1)){const d=this.mm[n-1];if(!(d.hi[h*d.n+c]>=Pl))continue;const f=this.nodeBox(c,h,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,c,h,a/2,n)}}return!0}emit(t,e,n,i,r){if(t.count>=Ll)return;const o=t.count*4;t.data[o]=this.pack.rect.x0+e*i,t.data[o+1]=this.pack.rect.z0+n*i,t.data[o+2]=i,t.data[o+3]=r,t.count++}dispose(){for(const t of[this.full,this.half])t.geometry.dispose(),t.material.dispose();this.shadow.dispose(),this.heightTex.dispose(),this.normalTex.dispose(),this.landTex.dispose()}}const Ul=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};class pg{constructor(t,e){this.app=t,this.data=e,this.packs=e.packs,this.archPack=this.packs.find(r=>r.kind==="archipelago")||this.packs[0],this.islandPacks=this.packs.filter(r=>r!==this.archPack),this.group=new Oe,this.terrains=new Map,this.slots=new Array(Nn).fill(null),this.exag=no(5e3),this.noIslands=!1,this.forceK=null;const n=Kc(new Float32Array([-4e3]),1,1),i=new Rn(new Uint8Array(4),1,1,_e,Me);i.needsUpdate=!0,this.dummyAux=i,this.uniforms={uVert:{value:this.exag/100},uExag:{value:this.exag},uArchH:{value:n},uArchRect:{value:new Zt(0,0,1,1)},uSlotRect:{value:Array.from({length:Nn},()=>new Zt(0,0,1,1))},uSlotInfo:{value:Array.from({length:Nn},()=>new Zt(0,0,1,0))},uDistRect:{value:new Zt(0,0,1,1)},uDistInfo:{value:new Zt(0,0,1,0)},uDistH:{value:n},uDistAux:{value:i},uDistCarve:{value:n},uPatchK:{value:0},uFeatK:{value:Array.from({length:16},()=>new Zt(0,0,0,0))}},this.district=null;for(let r=0;r<Nn;r++)this.uniforms[`uSlotH${r}`]={value:n};this._frustum=new Vi,this._m=new Kt,this._box=new on,this.dummy=n}setArchipelago(t){const e=new Ea(t,this);e.setSelf(-1),this.arch=e,this.terrains.set(t.id,e),this.group.add(e.group),this.uniforms.uArchH.value=e.heightTex,this.uniforms.uArchRect.value.copy(e.rect);const n=t.rect;this.bounds={x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1}}addIsland(t){const e=new Ea(t,this,this.arch);e.k=0,e.want=0,e.slot=-1;const n=t.rect;return e.margin=Math.min(15,.08*Math.min(n.x1-n.x0,n.z1-n.z0)),e.group.visible=!1,this.terrains.set(t.id,e),this.group.add(e.group),e}get islands(){return[...this.terrains.values()].filter(t=>t!==this.arch)}wantFor(t,e){const n=t.pack.rect,i=e.position,r=Math.max(n.x0-i.x,0,i.x-n.x1),o=Math.max(n.z0-i.z,0,i.z-n.z1),a=Math.hypot(r,o,Math.max(1,i.y)),l=(innerHeight||800)/(2*Math.tan(e.fov*Math.PI/360)),c=this.arch.texel*l/a;t.score=c;const h=Math.max(1,t.pack.data.hi*this.uniforms.uVert.value);return this._box.min.set(n.x0,0,n.z0),this._box.max.set(n.x1,h,n.z1),this._frustum.intersectsBox(this._box)?Ul(1,2.4,c):0}update(t,e,n){var m,x;this.exag=no(e),this.uniforms.uExag.value=this.exag,this.uniforms.uVert.value=this.exag/100;const i=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const g of i)g.want=this.noIslands?0:this.wantFor(g,t);const r=i.filter(g=>g.want>0).sort((g,p)=>p.score-g.score),o=new Set(r.slice(0,Nn)),a=1-Math.exp(-n*2.5);for(const g of i){const p=o.has(g)?g.want:0;if(g.slot>=0)g.k+=(p-g.k)*a,Math.abs(p-g.k)<.004&&(g.k=p),g.k<=0&&p<=0&&this.release(g);else if(p>0){const u=this.slots.indexOf(null);u>=0&&this.assign(g,u)}}if(this.forceK!==null)for(const g of this.slots)g&&(g.k=this.forceK);if(this.noIslands)for(const g of this.slots)g&&this.release(g);const l=this.uniforms;for(let g=0;g<Nn;g++){const p=this.slots[g];l.uSlotInfo.value[g].set(p?p.k:0,p?1:0,p?p.margin:1,0)}this.arch.update(t,!0);for(const g of i)g.update(t,g.slot>=0);(m=this.district)==null||m.update(t,e,n);const c=this.app.renderer,h=this.app.light.sunDir,d=this.uniforms.uVert.value,f=this.maxY+.1;this.arch.shadow.update(c,h,d,0,f);for(const g of i)g.slot>=0&&g.shadow.update(c,h,d,g.k,f);(x=this.district)==null||x.updateShadow(c,h,d,f)}settle(t){const e=this.islands;this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m);for(const i of e)i.want=this.wantFor(i,t);const n=e.filter(i=>i.want>0).sort((i,r)=>r.score-i.score).slice(0,this.slots.length);for(const i of e)i.slot>=0&&!n.includes(i)&&this.release(i);for(const i of n){if(i.slot<0){const r=this.slots.indexOf(null);if(r<0)continue;this.assign(i,r)}i.k=i.want}}stats(){var n,i,r;const t={};for(const[o,a]of this.terrains)a.group.visible&&(t[o]=a.full.count+a.half.count);const e=(n=this.district)==null?void 0:n.cur;return(i=e==null?void 0:e.terrain)!=null&&i.group.visible&&(t[e.d.id]=e.terrain.full.count+e.terrain.half.count),{exag:+this.exag.toFixed(2),nodes:t,slots:this.slots.map(o=>o?`${o.pack.id}:${o.k.toFixed(2)}`:null),district:((r=this.district)==null?void 0:r.stats())??null}}assign(t,e){this.slots[e]=t,t.slot=e,t.k=0,t.setSelf(e),t.shadow.ever=!1,t.shadow.strip=-1,t.shadow.drawn.vert=-1,this.uniforms.uSlotRect.value[e].copy(t.rect),this.uniforms[`uSlotH${e}`].value=t.heightTex}release(t){const e=t.slot;e<0||(this.slots[e]=null,t.slot=-1,t.k=0,this.uniforms[`uSlotH${e}`].value=this.dummy,this.uniforms.uSlotInfo.value[e].set(0,0,1,0))}metresAt(t,e){var l;const n=this.arch;if(!n)return-4e3;const i=n.pack.rect;let r=t<i.x0||e<i.z0||t>i.x1||e>i.z1?-4e3:n.metresAt(t,e),o=null,a=0;for(const c of this.slots){if(!c)continue;const h=c.pack.rect,d=Math.min(t-h.x0,h.x1-t,e-h.z0,h.z1-e);d>a&&(a=d,o=c)}if(o){const c=o.k*Ul(0,o.margin,a);c>0&&(r+=(o.metresAt(t,e)-r)*c)}return(l=this.district)!=null&&l.on?this.district.blend(t,e,r):r}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.uniforms.uVert.value}get maxY(){let t=0;for(const e of this.terrains.values())t=Math.max(t,e.pack.data.hi);return t*this.uniforms.uVert.value}islandAt(t,e){let n=null,i=0;for(const r of this.islands){const o=r.pack.rect,a=Math.min(t-o.x0,o.x1-t,e-o.z0,o.z1-e);a>i&&(i=a,n=r)}return n}setRange(t){var e,n,i;for(const r of this.terrains.values())r.applyRange(t);(i=(n=(e=this.district)==null?void 0:e.cur)==null?void 0:n.terrain)==null||i.applyRange(t)}setDebug(t){var n,i;for(const r of this.terrains.values())r.uniforms.uDebug.value=t;const e=(i=(n=this.district)==null?void 0:n.cur)==null?void 0:i.terrain;if(e)for(const r of[e.full,e.half])r.material.uniforms.uDebug.value=t}}const mg=`
${Ie}
${Ge}
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
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,gg=`
${Ie}
${xs}
${Ge}
${Gn}
${Xi}
${Yc}
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
  // (most of the ground is neither patched nor a feature's: nothing to lay on it)
  vec4 a0 = texelFetch(uDistAux, i0, 0);
  vec4 a1 = texelFetch(uDistAux, i0 + ivec2(1, 0), 0);
  vec4 a2 = texelFetch(uDistAux, i0 + ivec2(0, 1), 0);
  vec4 a3 = texelFetch(uDistAux, i0 + ivec2(1, 1), 0);
  if (max(max(a0.r + a0.a, a1.r + a1.a), max(a2.r + a2.a, a3.r + a3.a)) <= 0.0) return y;
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
  lD.g = mix(lD.g, lD.a, uPatchK); // (the beach of the year)
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
`,vg=`
${Ie}
${Ge}
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
`,se=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};function xg(s,t,e){const n=t*e,i=new Uint8Array(n),r=new Int32Array(n).fill(-1),o=new Int32Array(n),a=new Float32Array(n);let l=0;const c=new Int32Array(n);let h=0;const d=v=>{let _=h++;const w=a[v];for(;_>0;){const b=_-1>>1;if(a[c[b]]<=w)break;c[_]=c[b],_=b}c[_]=v},f=()=>{const v=c[0],_=c[--h],w=a[_];let b=0;for(;;){let S=2*b+1;if(S>=h||(S+1<h&&a[c[S+1]]<a[c[S]]&&S++,a[c[S]]>=w))break;c[b]=c[S],b=S}return c[b]=_,v},m=new Int32Array(n);let x=0,g=0;for(let v=0;v<n;v++)s[v]<=0&&(i[v]=1);const p=[-1,1,0,0,-1,1,-1,1],u=[0,0,-1,1,-1,-1,1,1];for(let v=0;v<e;v++)for(let _=0;_<t;_++){const w=v*t+_;if(i[w])continue;let b=_===0||v===0||_===t-1||v===e-1,S=-1;for(let T=0;T<8&&!b;T++){const L=_+p[T],y=(v+u[T])*t+L;s[y]<=0&&(b=!0,S=y)}b&&(i[w]=1,r[w]=S,a[w]=s[w],d(w))}for(;h||x<g;){const v=x<g?m[x++]:f();o[l++]=v;const _=a[v],w=v%t,b=(v-w)/t;for(let S=0;S<8;S++){const T=w+p[S],L=b+u[S];if(T<0||L<0||T>=t||L>=e)continue;const M=L*t+T;i[M]||(i[M]=1,r[M]=v,s[M]<=_?(a[M]=_,m[g++]=M):(a[M]=s[M],d(M)))}x===g&&(x=g=0)}return{rec:r,order:o.subarray(0,l)}}function _g(s,t,e,n){const i=new Float32Array(t*e),{rec:r,order:o}=s;for(let a=0;a<o.length;a++)i[o[a]]=n;for(let a=o.length-1;a>=0;a--){const l=o[a],c=r[l];c>=0&&i[c]>0&&(i[c]+=i[l])}return i}function Mg(s,t,e,n,i,r,o=.14){var p;const a=e*n,{rec:l}=s,c=new Uint8Array(a);for(let u=0;u<a;u++)t[u]>=i&&(c[u]=1);const h=new Uint8Array(a);for(let u=0;u<a;u++)c[u]&&l[u]>=0&&c[l[u]]&&(h[l[u]]=1);const d=new Uint8Array(a),f=[];for(let u=0;u<a;u++)c[u]&&!h[u]&&f.push(u);const m=new Float32Array(f.length);f.forEach((u,v)=>{let _=0;for(let w=u;w>=0&&c[w]&&_<1e6;w=l[w])_++;m[v]=_});const x=f.map((u,v)=>v).sort((u,v)=>m[v]-m[u]),g=[];for(const u of x){const v=[];let _=f[u];for(;_>=0&&c[_];){const b=_%e,S=(_-b)/e,[T,L]=r(b+.5,S+.5);if(v.push([T,L,t[_]]),d[_])break;d[_]=1,_=l[_]}if(_>=0&&!c[_]){const b=_%e,S=(_-b)/e,[T,L]=r(b+.5,S+.5);v.push([T,L,((p=v.at(-1))==null?void 0:p[2])??i])}if(v.length<3)continue;const w=wg(yg(v,3),o);if(!(w.length<2)){g.push(w.length);for(const b of w)g.push(b[0],b[1],b[2])}}return new Float32Array(g)}function yg(s,t){const e=s.length,n=s.map(i=>i.slice());for(let i=1;i<e-1;i++){let r=0,o=0,a=0;const l=Math.min(t,i,e-1-i);for(let c=-l;c<=l;c++)r+=s[i+c][0],o+=s[i+c][1],a++;n[i][0]=r/a,n[i][1]=o/a}return n}function wg(s,t){const e=[s[0]];let n=0;for(let r=0;r+1<s.length;r++){const o=s[r],a=s[r+1],l=Math.hypot(a[0]-o[0],a[1]-o[1]);let c=t-n;for(;c<l;){const h=c/l;e.push([o[0]+(a[0]-o[0])*h,o[1]+(a[1]-o[1])*h,o[2]+(a[2]-o[2])*h]),c+=t}n=l-(c-t)}const i=s[s.length-1];return Math.hypot(i[0]-e.at(-1)[0],i[1]-e.at(-1)[1])>t*.3&&e.push(i),e}function Sg(s,t,e,n,i){const r=[];let o=1/0,a=-1/0;for(const h of n)for(let d=0;d+1<h.length;d++){const[f,m]=h[d],[x,g]=h[d+1];m!==g&&(r.push(m<g?[m,f,g,x]:[g,x,m,f]),o=Math.min(o,m,g),a=Math.max(a,m,g))}if(!r.length)return 0;const l=[];let c=0;for(let h=Math.max(0,Math.floor(o));h<=Math.min(e-1,Math.ceil(a));h++){const d=h+.5;l.length=0;for(const f of r)f[0]<=d&&f[2]>d&&l.push(f[1]+(d-f[0])/(f[2]-f[0])*(f[3]-f[1]));l.sort((f,m)=>f-m);for(let f=0;f+1<l.length;f+=2){const m=Math.max(0,Math.ceil(l[f]-.5)),x=Math.min(t-1,Math.floor(l[f+1]-.5));for(let g=m;g<=x;g++)s[h*t+g]=i,c++}}return c}function qs(s,t){let e=s*.1031%1,n=t*.1031%1;e<0&&(e+=1),n<0&&(n+=1);let i=e;const r=e*(n+33.33)+n*(i+33.33)+i*(e+33.33);e+=r,n+=r,i+=r;const o=(e+n)*i%1;return o<0?o+1:o}function Ta(s,t){const e=Math.floor(s),n=Math.floor(t),i=s-e,r=t-n,o=i*i*(3-2*i),a=r*r*(3-2*r),l=qs(e,n),c=qs(e+1,n),h=qs(e,n+1),d=qs(e+1,n+1);return l+(c-l)*o+(h-l+(l-c+d-h)*o)*a}function Fe(s,t=0,e=0){let n=Math.imul(s|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e|0,2246822519);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const Zc=new Float32Array(1),bg=new Uint32Array(Zc.buffer);function ls(s){Zc[0]=s;const t=bg[0],e=t>>>16&32768;let n=(t>>>23&255)-127+15;const i=t&8388607;return n<=0?e:n>=31?e|31744:e|n<<10|i>>>13}function Wa(s){const t=s>>>10&31,e=s&1023,n=s&32768?-1:1;return t===0?n*e*5960464477539063e-23:t===31?e?NaN:n*(1/0):n*(1+e/1024)*2**(t-15)}const Eg=28,Xa=.5625,ia=[22,36],Il=3.5,Nl=2.6,Tg=32,Ag=.45,sa=[7,16];function Rg({index:s,inside:t,box:e,m:n,hs:i,cls:r,chanDist:o,aux:a,carve:l,W:c,mx:h,mz:d}){const{x0:f,y0:m,x1:x,y1:g}=e,p=x-f+1,u=g-m+1,v=cn(p,u,w=>!t[(m+Math.floor(w/p))*c+f+w%p],h,d),_=new Set;for(let w=m;w<=g;w++)for(let b=f;b<=x;b++){const S=w*c+b;if(!t[S]||n[S]<=.3)continue;const T=b*h,L=w*d,M=(Ta(T/140+s*7.1,L/140)-.5)*24,y=se(0,Tg,v[(w-m)*p+(b-f)]+M),P=se(sa[0],sa[1],o[S]);if(y*P<.02)continue;const C=r[S],k=Xa*2**C,D=i[S]/k,F=ls(D-64*Math.floor(D/64)),B=Jc(n[S],Wa(F),C),j=Math.round(B/k-.5),W=B-n[S],q=W<0?se(Il+1,Il,-W):se(Nl+1,Nl,W),Q=y*P*q;if(Q<.02)continue;const tt=(o[S]-sa[0])/Cg(j,C,s)+Fe(s,j,C*7+2);_.add((C*4096+j)*4096+Math.floor(tt)),a[S*4+1]=Math.round(255*Q),a[S*4+2]=C,a[S*4+3]=s,l[S*2]=F,l[S*2+1]=ls(tt)}return _.size}function Cg(s,t,e){return ia[0]+(ia[1]-ia[0])*Fe(e,s,t*7+1)}function Lg(s,t,e,n){let i=1/0,r=1/0,o=-1/0,a=-1/0;for(const l of s)for(const[c,h]of l)i=Math.min(i,c),r=Math.min(r,h),o=Math.max(o,c),a=Math.max(a,h);return{x0:Math.max(0,Math.floor(i)-n),y0:Math.max(0,Math.floor(r)-n),x1:Math.min(t-1,Math.ceil(o)+n),y1:Math.min(e-1,Math.ceil(a)+n)}}function Jc(s,t,e){const n=Xa*2**e,i=t+64*Math.floor((s/n-t)/64+.5);return(Math.floor(i)+.5)*n}const Fl=.346,zl=.387,Ol=.436,kl=.575,Bl=.702,Di=["ohia","ohiaKrumm","koa","kukui","ohiaai","hau","hala","wiliwili","lama","aalii","niu","milo"],Gt=Object.fromEntries(Di.map((s,t)=>[s,t])),Qi={ohiaDry:[1.48,1.41,1.8],ohiaWet:[.72,.75,.7],olapa:[1.32,1.46,1.17]},js=9;function Pg(s,t){let e=0;for(let i=0;i<t.length;i++)t[i]>0&&(e+=t[i]);if(e<=0)return-1;s*=e;let n=-1;for(let i=0;i<t.length;i++)if(!(t[i]<=0)&&(n=i,(s-=t[i])<0))return i;return n}function Dg({W:s,H:t,mx:e,mz:n,m:i,m1795:r,rain:o,normals:a,rip:l,tpi:c,chanDist:h,clear:d,patch:f,shore:m,toWorld:x,step:g}){const p=Di.map(()=>[]),u=new Int32Array(Di.length),v=new Float32Array(Di.length),_=Math.floor(s*e/g),w=Math.floor(t*n/g);for(let b=0;b<w;b++)for(let S=0;S<_;S++){const T=(S+Fe(S,b,11))*g,L=(b+Fe(S,b,12))*g,M=Math.min(s-1,Math.floor(T/e)),y=Math.min(t-1,Math.floor(L/n)),P=y*s+M;if(f[P]>0||i[P]<1.2||r[P]<1.2||h[P]<9)continue;const C=i[P],k=o[P]/255+(Fe(S,b,3)-.5)*.1,D=o[P]/255,F=a[P*4+1]/255*2-1,B=1-se(.55,.75,F),j=C-ur(c,M,y,4),W=ur(l,M,y,4),q=Math.max(se(.1,.3,W),se(12,30,-j)),Q=se(10,30,j)*(1-se(.05,.2,W)),tt=se(.94,.97,F)*se(.25,.5,W),ut=D-(.22+43e-5*C),X=se(.5,.6,D),et=1-se(420-250*X,760-430*X,C+(Fe(S,b,20)-.5)*120),ft=se(.42,.6,Ta(T/210+13.1,L/210+7.7)),xt=se(.6,.7,Ta(T/190+41.3,L/190+3.9)),_t=1-se(14,40,h[P]),Et=C<670&&D>Fl?(1-se(450,670,C))*(1-se(Bl-.04,Bl+.02,D)):0,K=C<610?1:0,J=C<550&&k>Ol?tt>.5?.8+4*xt:.1+6*xt:0,at=Math.max(se(0,20,j),se(300,420,C));v.fill(0);let U=0,ot=1,Y=null;if(m.a[(y>>1)*m.w+(M>>1)]<70&&C<8)U=.3,v[Gt.niu]=50,v[Gt.hala]=30,v[Gt.milo]=15;else if(k<zl&&ut<.04&&C<300)U=.04+.32*q+.22*B,v[Gt.aalii]=35,v[Gt.wiliwili]=D<zl-.02?25:8,v[Gt.lama]=25,v[Gt.ohia]=12,Y=Qi.ohiaDry;else if(et>Fe(S,b,22))if(tt>.5)U=.45,v[Gt.ohiaai]=40*J,v[Gt.hau]=70*_t,v[Gt.kukui]=20*Et*(1-.9*xt),v[Gt.hala]=5*K;else if(q>.4||B>.4)U=.85,v[Gt.kukui]=70*Et*(.25+.75*ft)*(1-.9*xt),v[Gt.hala]=14*K*(1-.7*xt),v[Gt.ohiaai]=10*J,v[Gt.hau]=60*_t*(C<450?1:0),v[Gt.lama]=12*(k<Ol&&ut<0?1:0),v[Gt.ohia]=(5+45*(1-Et)*(k>Fl?1:0))*(C>150?at:0),v[Gt.ohiaKrumm]=10*(1-Et)*(k>=kl?1:0)*B;else{const O=se(460,640,C);U=.25+.55*O,Q>.5?(v[Gt.ohia]=60*(C>150?1:0),v[Gt.koa]=20*(C>250?1:0),v[Gt.hala]=20*K*(1-O)):(v[Gt.kukui]=45*Et*(.1+.9*ft)*(1-.9*xt),v[Gt.hala]=35*K*(1-.7*xt)*(1-.85*O),v[Gt.ohiaai]=10*J,v[Gt.hau]=60*_t*(C<450?1:0),v[Gt.ohia]=(10+50*O)*(C>150?at:0),v[Gt.koa]=(10+5*O)*(C>250?1:0))}else k<kl?(U=C<760?.55:.85,v[Gt.ohia]=45,v[Gt.koa]=30*(C>300?1:0),v[Gt.lama]=15,v[Gt.aalii]=5,v[Gt.kukui]=10*Et*(q>.5?1:0)):Q>.5||B>.5?(U=.6,v[Gt.ohiaKrumm]=55,v[Gt.ohia]=45,ot=.55+.3*Fe(S,b,14)):(U=.92,v[Gt.ohia]=80,v[Gt.koa]=10*(F>.8?1:0),v[Gt.ohiaKrumm]=10,Y=Fe(S,b,15)<.12?Qi.olapa:Qi.ohiaWet);if(U<=Fe(S,b,5))continue;const Z=Pg(Fe(S,b,6),v);if(Z<0)continue;const[lt,mt]=x(T/e,L/n),A=.92+.16*Fe(S,b,8),E=Z===Gt.ohia&&Y?Y:Z===Gt.ohiaKrumm&&Y===Qi.olapa?Qi.olapa:[A,A,A];p[Z].push(lt,mt,C-.6,Fe(S,b,7)*Math.PI*2,ot*(.8+.4*Fe(S,b,9)),E[0],E[1],E[2],d[P]),u[Z]++}return{kinds:Di,lists:p.map(b=>new Float32Array(b)),counts:Array.from(u)}}const es=-1,cs=.5;function Qc(s,t,e,n=cs){return t<128?s+(es-s)*(t/127)*e:s+(Math.max(cs,n)-s)*((t-128)/127)*e}function Gl(s,t,e){const n=new Uint8Array(t*e),i=new Int32Array(t*e);let r=0,o=0;const a=l=>{s[l]<=0&&!n[l]&&(n[l]=1,i[o++]=l)};for(let l=0;l<t;l++)a(l),a((e-1)*t+l);for(let l=0;l<e;l++)a(l*t),a(l*t+t-1);for(;r<o;){const l=i[r++],c=l%t,h=(l-c)/t;c>0&&a(l-1),c<t-1&&a(l+1),h>0&&a(l-t),h<e-1&&a(l+t)}return n}function Ug({heightPx:s,rainPx:t,patchPx:e,W:n,H:i,scale:r,offset:o,mx:a,mz:l,rect:c,features:h,stride:d=4,log:f=()=>{}}){const m=Date.now(),x={};let g=m;const p=K=>{const J=Date.now();x[K]=J-g,g=J},u=n*i,v=fc(s,n,i,r,o,d),_=t?dc(t,n,i,d):new Uint8Array(u).fill(82),w=new Uint8Array(u);{const K=Gl(v,n,i);for(let J=0;J<u;J++)v[J]<=0&&!K[J]&&(v[J]=.3,w[J]=1)}const b=(c.x1-c.x0)/n,S=(c.z1-c.z0)/i,T=(K,J)=>[c.x0+K*b,c.z0+J*S];p("decode");const L=new Uint8Array(u);for(const K of e)for(let J=0;J<u;J++)K[J*d]>=128&&(L[J]=1);if(e.length){const J=(ot,Y)=>{const V=ot%n,Z=(ot-V)/n;for(let lt=-3;lt<=3;lt++){const mt=Z+lt;if(!(mt<0||mt>=i))for(let A=-3;A<=3;A++){const E=V+A;if(E>=0&&E<n&&Y(mt*n+E))return!0}}return!1},at=[];for(let ot=0;ot<u;ot++)L[ot]||v[ot]<=0||v[ot]>5||J(ot,Y=>L[Y])&&J(ot,Y=>v[Y]<=0&&!L[Y])&&at.push(ot);for(const ot of at)L[ot]=1;const U=new Uint8Array(u);for(let ot=0;ot<u;ot++){if(!w[ot]||U[ot])continue;const Y=[ot];U[ot]=1;let V=!1;for(let Z=0;Z<Y.length;Z++){const lt=Y[Z];!V&&J(lt,A=>L[A]===1)&&(V=!0);const mt=lt%n;for(const A of[mt>0?lt-1:-1,mt<n-1?lt+1:-1,lt-n,lt+n])A>=0&&A<u&&w[A]&&!U[A]&&(U[A]=1,Y.push(A))}if(V)for(const Z of Y)L[Z]=1}}const M=new Uint8Array(u);if(e.length){const J=V=>v[V]<=0||L[V]===1,at=cn(n,i,V=>!J(V),a,l),U=cn(n,i,V=>J(V)&&at[V]>45,a,l),ot=cn(n,i,V=>L[V]===1,a,l),Y=45+1.5*Math.max(a,l);for(let V=0;V<u;V++)v[V]>0||L[V]||U[V]<=Y||(ot[V]<60?L[V]=2:M[V]=1);for(let V=0;V<u;V++)L[V]&&(L[V]=1)}const y=new Uint8Array(u*4),P=Float32Array.from(v);let C=null,k=null;{let K=n,J=i,at=-1,U=-1;for(let ot=0;ot<u;ot++){if(!L[ot])continue;const Y=ot%n,V=(ot-Y)/n;K=Math.min(K,Y),at=Math.max(at,Y),J=Math.min(J,V),U=Math.max(U,V)}if(at>=0){K=Math.max(0,K-12),J=Math.max(0,J-12),at=Math.min(n-1,at+12),U=Math.min(i-1,U+12),C={x0:K,y0:J,x1:at,y1:U};const ot=at-K+1,Y=U-J+1,V=lt=>(J+Math.floor(lt/ot))*n+K+lt%ot,Z=cn(ot,Y,lt=>!L[V(lt)]&&v[V(lt)]>0,a,l);for(let lt=0;lt<ot*Y;lt++){const mt=V(lt);if(!L[mt])continue;const A=se(0,45,Z[lt]);y[mt*4]=Math.round(127*A),P[mt]=v[mt]+(es-v[mt])*A}}}if(C){const K=Math.round(15e3/(a*l)),J=new Uint8Array(u),at=[];for(let U=0;U<u;U++){const ot=U%n,Y=(U-ot)/n;if(ot<C.x0||ot>C.x1||Y<C.y0||Y>C.y1||J[U]||P[U]<=0)continue;at.length=0,at.push(U),J[U]=1;let V=!1,Z=!1;for(let lt=0;lt<at.length;lt++){const mt=at[lt],A=mt%n,E=(mt-A)/n;if(A<=C.x0||E<=C.y0||A>=C.x1||E>=C.y1){Z=!0;continue}for(const O of[mt-1,mt+1,mt-n,mt+n])P[O]>0?J[O]||(J[O]=1,at.push(O)):L[O]&&(V=!0);at.length>K&&(Z=!0)}if(!(Z||!V)){k||(k=[]);for(const lt of at)L[lt]=1,y[lt*4]=127,P[lt]=es,k.push(lt)}}}const D=Float32Array.from(v);let F=null;if(e.length){for(let V=0;V<u;V++)M[V]&&(P[V]=cs);const K=Gl(P,n,i);for(let V=0;V<u;V++)!M[V]&&P[V]<=0&&!K[V]&&(M[V]=1);const J=new Float32Array(u),at=new Float32Array(u);for(let V=0;V<u;V++)M[V]||L[V]||v[V]<=0||(J[V]=Math.min(v[V],6),at[V]=1);const U=Math.ceil(30/Math.max(a,l)),ot=yn(J,n,i,U,2),Y=yn(at,n,i,U,2);F=new Float32Array(u);for(let V=0;V<u;V++){if(!M[V])continue;const Z=Y[V]>.001?Math.max(cs,Math.min(6,ot[V]/Y[V]-.2)):cs;F[V]=Z,y[V*4]=255,P[V]=Z,D[V]=Z}}p("patches");let B=D;if(k){B=Float32Array.from(D);for(const K of k)B[K]=es}const j=mc(B,n,i,a,l,pc(B,n,i,a,l));p("normals");let W,q,Q;{const K=Ys(D,n,i,2,!0),J=xg(K.a,K.w,K.h),at=_g(J,K.w,K.h,4*a*l/1e6);p("routing"),Q=Mg(J,at,K.w,K.h,Ag,(Y,V)=>T(Y*2,V*2)),p("streams"),q=cn(n,i,Y=>{const V=Y%n,Z=(Y-V)/n;return D[Y]>0&&at[(Z>>1)*K.w+(V>>1)]>=1},a,l);const U=new Float32Array(K.w*K.h);for(let Y=0;Y<U.length;Y++)U[Y]=K.a[Y]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,at[Y])/.04)/1.6)):0;const ot=Ys(U,K.w,K.h,2,!1);W={a:yn(ot.a,ot.w,ot.h,1,2),w:ot.w,h:ot.h}}p("riparian");const tt=new Uint8Array(u*4);let ut;{const K=(J,at)=>{const U=Ys(J,n,i,2,!1),ot=cn(U.w,U.h,Z=>U.a[Z]<=0,a*2,l*2),Y=new Float32Array(U.w*U.h);for(let Z=1;Z<U.h-1;Z++)for(let lt=1;lt<U.w-1;lt++){const mt=Z*U.w+lt,A=U.a[mt];if(A<=0||A>9)continue;const E=Math.hypot((U.a[mt+1]-U.a[mt-1])/(4*a),(U.a[mt+U.w]-U.a[mt-U.w])/(4*l));Y[mt]=ot[mt]<70&&E<.12?1:0}const V={a:yn(Y,U.w,U.h,1,1),w:U.w,h:U.h};for(let Z=0;Z<i;Z++)for(let lt=0;lt<n;lt++)tt[(Z*n+lt)*4+at]=J[Z*n+lt]>0?Math.round(255*Math.min(1,ur(V,lt,Z,2)*1.5)):0;return{a:ot,w:U.w,h:U.h}};K(D,1),ut=K(P,3)}for(let K=0;K<i;K++)for(let J=0;J<n;J++){const at=K*n+J;tt[at*4]=t?_[at]:v[at]>0?82:0,tt[at*4+2]=D[at]>0?Math.round(255*Math.min(1,ur(W,J,K,4)*1.6)):0}p("sand");const X=new Uint16Array(u*2);if(F)for(let K=0;K<u;K++)M[K]&&(X[K*2]=ls(F[K]),X[K*2+1]=ls(F[K]-v[K]));if(k)for(const K of k)X[K*2+1]=ls(es-v[K]);const et={},ft=new Uint8Array(u);{const K=yn(v,n,i,3,2),J=new Uint8Array(u);{const ot=new Float32Array(u);for(let V=1;V<i-1;V++)for(let Z=1;Z<n-1;Z++){const lt=V*n+Z;ot[lt]=Math.hypot((K[lt+1]-K[lt-1])/(2*a),(K[lt+n]-K[lt-n])/(2*l))}const Y=yn(ot,n,i,6,2);for(let V=0;V<u;V++)J[V]=Math.max(0,Math.min(3,Math.round(Math.log2(Math.max(1e-6,Y[V]*Eg/Xa)))))}const at=new Uint8Array(u),U={village:0,loi:1,pond:2};for(const ot of[...h].sort((Y,V)=>U[Y.kind]-U[V.kind])){const Y=Lg(ot.rings,n,i,4);for(let Z=Y.y0;Z<=Y.y1;Z++)at.fill(0,Z*n+Y.x0,Z*n+Y.x1+1);const V=Sg(at,n,i,ot.rings,1);if(V){if(ot.kind==="loi")et[ot.index]=Rg({index:ot.index,inside:at,box:Y,m:v,hs:K,cls:J,chanDist:q,aux:y,carve:X,W:n,mx:a,mz:l});else{const Z=Y.x1-Y.x0+1,lt=Y.y1-Y.y0+1,mt=cn(Z,lt,A=>!at[(Y.y0+Math.floor(A/Z))*n+Y.x0+A%Z],a,l);for(let A=Y.y0;A<=Y.y1;A++)for(let E=Y.x0;E<=Y.x1;E++){const O=A*n+E;at[O]&&(y[O*4+1]=Math.round(255*se(0,ot.kind==="pond"?9:40,mt[(A-Y.y0)*Z+(E-Y.x0)])),y[O*4+2]=0,y[O*4+3]=ot.index,X[O*2]=X[O*2+1]=0)}et[ot.index]=V}for(let Z=Y.y0;Z<=Y.y1;Z++)for(let lt=Y.x0;lt<=Y.x1;lt++)at[Z*n+lt]&&(ft[Z*n+lt]=ot.index)}}}p("features");let xt;{const K=Ig(ft,n,i,5),J=Ys(v,n,i,4,!1),at={a:yn(J.a,J.w,J.h,2,2),w:J.w,h:J.h};xt=Dg({W:n,H:i,mx:a,mz:l,m:v,m1795:P,rain:_,normals:j,rip:W,tpi:at,chanDist:q,clear:K,patch:L,shore:ut,toWorld:T,step:25})}p("trees");let _t=1/0,Et=-1/0;for(let K=0;K<u;K++)v[K]<_t&&(_t=v[K]),v[K]>Et&&(Et=v[K]);return f(`district decoded in ${Date.now()-m} ms: ${JSON.stringify(x)}`),{metres:v,normals:j,land:tt,aux:y,carve:X,streams:Q,trees:xt,counts:et,lo:_t,hi:Et,ms:Date.now()-m,times:x}}function Ys(s,t,e,n,i){const r=Math.ceil(t/n),o=Math.ceil(e/n),a=new Float32Array(r*o).fill(i?1/0:-1/0);for(let l=0;l<e;l++){const c=Math.floor(l/n)*r;for(let h=0;h<t;h++){const d=c+Math.floor(h/n),f=s[l*t+h];(i?f<a[d]:f>a[d])&&(a[d]=f)}}return{a,w:r,h:o}}function ur(s,t,e,n){const i=Math.min(s.w-1.001,Math.max(0,(t+.5)/n-.5)),r=Math.min(s.h-1.001,Math.max(0,(e+.5)/n-.5)),o=i|0,a=r|0,l=i-o,c=r-a,h=s.a,d=a*s.w+o,f=h[d]+(h[d+1]-h[d])*l,m=h[d+s.w]+(h[d+s.w+1]-h[d+s.w])*l;return f+(m-f)*c}function Ig(s,t,e,n){const i=Uint8Array.from(s);for(let o=0;o<e;o++)for(let a=0;a<t;a++){const l=o*t+a;if(!s[l])for(let c=1;c<=n;c++){const h=a-c>=0&&s[l-c]||a+c<t&&s[l+c];if(h){i[l]=h;break}}}const r=Uint8Array.from(i);for(let o=0;o<e;o++)for(let a=0;a<t;a++){const l=o*t+a;if(!i[l])for(let c=1;c<=n;c++){const h=o-c>=0&&i[l-c*t]||o+c<e&&i[l+c*t];if(h){r[l]=h;break}}}return r}async function Hl(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}async function Ng(s,t=console.warn){let e;try{e=await Hl(s.abs("districts/manifest.json"))}catch{return[]}const n=[];for(const i of e.districts||[])try{let r={type:"FeatureCollection",features:[]};if(i.features)try{r=await Hl(s.abs(`districts/${i.features}`))}catch(o){t(`districts/${i.features}: ${o.message} (the district is drawn without its features)`)}n.push(Fg(i,r,s,t))}catch(r){t(`district ${i.id}: ${r.message}`)}return n}function th(s){return[Number.isFinite(s==null?void 0:s.from)?s.from:-1/0,Number.isFinite(s==null?void 0:s.to)?s.to:1/0]}function $a(s,t){const[e,n]=th(s);return t>=e&&t<n+1}function Fg(s,t,e,n){var _;const r=e.proj.rect(s.bounds),[o,a]=s.size,[l,c,h,d]=s.bounds,f=w=>e.abs(`districts/${w}`),m=([w,b])=>[(w-l)/(h-l)*o,(d-b)/(d-c)*a],x={loi:un.loi,pond:un.pond,other:un.other},g={loi:un.pond-1,pond:un.other-1,other:un.max},p=[],u=new Map;for(const w of t.features||[]){const b=w.properties||{},S=b.kind==="loi"?"loi":b.kind==="fishpond"?"pond":b.kind==="village"?"other":null,T=w.geometry;if(!S||(T==null?void 0:T.type)!=="Polygon")continue;if(x[S]>g[S]){n(`district ${s.id}: more ${b.kind} features than the aux map has room for; ${b.name} is not drawn`);continue}const L=x[S]++;p.push({index:L,kind:S==="other"?b.kind:S,rings:T.coordinates.map(M=>M.map(m))}),u.set(L,w)}const v=(s.patches||[]).filter(w=>w.file).map(w=>({...w,url:f(w.file)}));return{id:s.id,name:s.name||s.id,parent:s.parent||s.island,desc:s,bounds:s.bounds,rect:r,W:o,H:a,mx:(r.x1-r.x0)*Ni/o,mz:(r.z1-r.z0)*Ni/a,heightUrl:f(s.height.file),rainUrl:(_=s.rain)!=null&&_.file?f(s.rain.file):null,scale:s.height.scale??.25,offset:s.height.offset??-6e3,patches:v,patchUntil:v.length?Math.max(...v.map(w=>Number.isFinite(w.until)?w.until:-1/0)):-1/0,features:t,raster:p,byIndex:u,sources:s.sources||[]}}class zg{constructor(t=console.warn){this.warn=t,this.jobs=new Map,this.n=0;try{this.worker=new Worker(new URL(""+new URL("district-worker-BiORe0QA.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=e=>this.message(e.data),this.worker.onerror=e=>{var n;(n=e.preventDefault)==null||n.call(e),this.fallback=!0;for(const[i,r]of this.jobs)this.mainThread(i,r)}}catch{this.fallback=!0}}job(t){return{heightUrl:t.heightUrl,rainUrl:t.rainUrl,patchUrls:[...new Set(t.patches.map(e=>e.url))],W:t.W,H:t.H,scale:t.scale,offset:t.offset,mx:t.mx,mz:t.mz,rect:{x0:t.rect.x0,z0:t.rect.z0,x1:t.rect.x1,z1:t.rect.z1},features:t.raster.map(e=>({index:e.index,kind:e.kind,rings:e.rings}))}}decode(t){return new Promise((e,n)=>{const i=++this.n,r={d:t,resolve:e,reject:n};this.jobs.set(i,r),this.fallback?this.mainThread(i,r):this.worker.postMessage({id:i,...this.job(t)})})}message(t){const e=this.jobs.get(t.id);e&&(t.log||(this.jobs.delete(t.id),t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,this.jobs.set(t.id,e),this.mainThread(t.id,e)):e.reject(new Error(t.message))))}async mainThread(t,e){try{const n=this.job(e.d),i=await ni(n.heightUrl);if(i.W!==n.W||i.H!==n.H)throw new Error(`${n.heightUrl} is ${i.W}×${i.H}, the manifest says ${n.W}×${n.H}`);const r=n.rainUrl?await ni(n.rainUrl).then(l=>l.W===n.W&&l.H===n.H?l.px:null).catch(()=>null):null,o=[];for(const l of n.patchUrls){const c=await ni(l).catch(()=>null);c&&c.W===n.W&&c.H===n.H&&o.push(c.px)}const a=Ug({...n,heightPx:i.px,rainPx:r,patchPx:o});this.jobs.delete(t),e.resolve(a)}catch(n){this.jobs.delete(t),e.reject(n)}}dispose(){var t;(t=this.worker)==null||t.terminate()}}const Fn=Mh,Ri=s=>s*ds/100,$t={plain:0,thatch:1,stone:2,leaf:3,water:4,kapa:5,wood:6,skin:7,sand:8};class qa{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.feat=[],this.featNow=0,this.xf=null,this.stack=[]}at(t,e,n,i=0,r=Fn){this.stack.push(this.xf);const o=Math.cos(i),a=Math.sin(i);return this.xf=l=>[t+(l[0]*o-l[2]*a)*r,e+l[1]*r,n+(l[0]*a+l[2]*o)*r],this}done(){return this.xf=this.stack.pop()||null,this}feature(t){return this.featNow=t,this}tri(t,e,n,i,r=0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const o=e[0]-t[0],a=e[1]-t[1],l=e[2]-t[2],c=n[0]-t[0],h=n[1]-t[1],d=n[2]-t[2];let f=a*d-l*h,m=l*c-o*d,x=o*h-a*c;const g=Math.hypot(f,m,x)||1;f/=g,m/=g,x/=g;for(const p of[t,e,n])this.pos.push(p[0],p[1],p[2]),this.nor.push(f,m,x),this.col.push(i[0],i[1],i[2]),this.mat.push(r),this.feat.push(this.featNow)}quad(t,e,n,i,r,o=0){this.tri(t,e,n,r,o),this.tri(t,n,i,r,o)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let r=0;r<4;r++)this.quad(t[r],e[r],e[(r+1)%4],t[(r+1)%4],n,i)}box(t,e,n,i,r,o,a,l=0,c=0,h=1){const d=Math.cos(c),f=Math.sin(c),m=(w,b,S)=>[t+w*d-S*f,e+b,n+w*f+S*d],x=i/2,g=o/2,p=x*h,u=g*h,v=[m(-x,0,-g),m(x,0,-g),m(x,0,g),m(-x,0,g)],_=[m(-p,r,-u),m(p,r,-u),m(p,r,u),m(-p,r,u)];r<0?this.hexa(_,v,a,l):this.hexa(v,_,a,l)}cyl(t,e,n,i,r,o=0,a=6){const l=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],c=Math.hypot(...l)||1,h=l.map(p=>p/c),d=Math.abs(h[1])<.9?[0,1,0]:[1,0,0];let f=[h[1]*d[2]-h[2]*d[1],h[2]*d[0]-h[0]*d[2],h[0]*d[1]-h[1]*d[0]];const m=Math.hypot(...f);f=f.map(p=>p/m);const x=[h[1]*f[2]-h[2]*f[1],h[2]*f[0]-h[0]*f[2],h[0]*f[1]-h[1]*f[0]],g=(p,u,v)=>{const _=v/a*Math.PI*2,w=Math.cos(_)*u,b=Math.sin(_)*u;return[p[0]+f[0]*w+x[0]*b,p[1]+f[1]*w+x[1]*b,p[2]+f[2]*w+x[2]*b]};for(let p=0;p<a;p++)this.quad(g(t,n,p),g(t,n,p+1),g(e,i,p+1),g(e,i,p),r,o)}blob(t,e,n,i,r,o,a,l=0,c=0,h=l===$t.leaf){const d=(1+Math.sqrt(5))/2,f=[[-1,d,0],[1,d,0],[-1,-d,0],[1,-d,0],[0,-1,d],[0,1,d],[0,-1,-d],[0,1,-d],[d,0,-1],[d,0,1],[-d,0,-1],[-d,0,1]],m=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],x=u=>.85+.3*Math.abs(Math.sin(u*12.9898+c*78.233)*43758.5453%1),g=f.map((u,v)=>{const _=Math.hypot(...u),w=x(v);return[t+u[0]/_*i*w,e+u[1]/_*r*w,n+u[2]/_*o*w]});if(!h){for(const u of m)this.tri(g[u[0]],g[u[1]],g[u[2]],a,l);return}const p=u=>{const v=[(u[0]-t)/(i*i),(u[1]-e)/(r*r),(u[2]-n)/(o*o)],_=Math.hypot(...v)||1;return[v[0]/_,v[1]/_,v[2]/_]};for(const u of m){const v=u.map(w=>g[w]),_=this.xf?v.map(w=>this.xf(w)):v;for(let w=0;w<3;w++)this.pos.push(..._[w]),this.nor.push(...p(v[w])),this.col.push(a[0],a[1],a[2]),this.mat.push(l),this.feat.push(this.featNow)}}wall(t,e,n,i,r=$t.stone,o=.7){const a=t.length;if(a<2)return;const l=a>2&&Math.hypot(t[0][0]-t[a-1][0],t[0][2]-t[a-1][2])<1e-9,c=[];for(let g=0;g<a-1;g++){const p=t[g+1][0]-t[g][0],u=t[g+1][2]-t[g][2],v=Math.hypot(p,u)||1;c.push([-u/v,p/v])}const h=t.map((g,p)=>{let u=c[p-1],v=c[p];if(l&&p===0&&(u=c[a-2]),l&&p===a-1&&(v=c[0]),!u)return v;if(!v)return u;const _=u[0]+v[0],w=u[1]+v[1],b=Math.hypot(_,w);if(b<1e-6)return v;const S=1/Math.max(.35,(_*v[0]+w*v[1])/b);return[_/b*S,w/b*S]}),d=e/2,f=e*o/2,m=(g,p,u,v)=>[g[0]+p[0]*u,g[1]+v,g[2]+p[1]*u],x=g=>[m(t[g],h[g],-d,-n*.3),m(t[g],h[g],d,-n*.3),m(t[g],h[g],f,n),m(t[g],h[g],-f,n)];for(let g=0;g<a-1;g++){const[p,u,v,_]=x(g),[w,b,S,T]=x(g+1);this.quad(_,v,S,T,i,r),this.quad(u,b,S,v,i,r),this.quad(w,p,_,T,i,r)}if(!l){const[g,p,u,v]=x(0),[_,w,b,S]=x(a-1);this.quad(g,p,u,v,i,r),this.quad(w,_,S,b,i,r)}}geometry(){const t=new Ue;return t.setAttribute("position",new he(this.pos,3)),t.setAttribute("normal",new he(this.nor,3)),t.setAttribute("color",new he(this.col,3)),t.setAttribute("aMat",new he(this.mat,1)),t.setAttribute("aFeat",new he(this.feat,1)),t.computeBoundingSphere(),t}}function Og(s){const t=s.attributes.position.array,e=s.attributes.normal.array,n=s.attributes.color.array,i=s.attributes.aMat.array,r=new Map,o=[],a=[],l=[],c=[],h=[];for(let f=0;f<i.length;f++){const m=`${t[f*3]},${t[f*3+1]},${t[f*3+2]},${e[f*3]},${e[f*3+1]},${e[f*3+2]},${n[f*3]},${n[f*3+1]},${n[f*3+2]},${i[f]}`;let x=r.get(m);x===void 0&&(x=r.size,r.set(m,x),a.push(t[f*3],t[f*3+1],t[f*3+2]),l.push(e[f*3],e[f*3+1],e[f*3+2]),c.push(n[f*3],n[f*3+1],n[f*3+2]),h.push(i[f])),o.push(x)}const d=new Ue;return d.setAttribute("position",new he(a,3)),d.setAttribute("normal",new he(l,3)),d.setAttribute("color",new he(c,3)),d.setAttribute("aMat",new he(h,1)),d.setIndex(o),d.computeBoundingSphere(),d}function je(s,t=0,e=Math.random){const n=new Ct(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const kg=`
${Ie}
${Ge}
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
`,Bg=`
${Ie}
${xs}
${Ge}
${Xi}
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
`;function Aa(s,t,e={}){const[n,i]=e.fade||[60,90];return new fe({vertexShader:kg,fragmentShader:Bg,vertexColors:!0,side:e.doubleSide?an:Tn,uniforms:{...s.uniforms,...t,uFadeNear:{value:n},uFadeFar:{value:i}}})}const hs={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",koa:"#7a4a2a",pondStone:"#8a817a"};function Gg(s,t,e=7,n=4.6,i=5.2,r=!0,o=.6){const a=je(hs.thatch,.18,t),l=je(hs.thatchDark,.15,t),c=je(hs.stone,.15,t);s.box(0,-o,0,e+1.8,.45+o,n+1.8,c,$t.stone);const h=.45,d=h+1.05;s.box(0,h,0,e,d-h,n,a,$t.thatch);const f=e/2+.35,m=n/2+.45,x=h+i,g=[-f,d-.15,-m],p=[f,d-.15,-m],u=[-f,x,0],v=[f,x,0],_=[-f,d-.15,m],w=[f,d-.15,m];s.quad(g,u,v,p,a,$t.thatch),s.quad(w,v,u,_,a,$t.thatch),s.quad(p,v,u,g,l,$t.thatch),s.quad(_,u,v,w,l,$t.thatch);const b=e/2;if(s.tri([-b,d,-n/2],[-b,d,n/2],[-b,x-.2,0],a,$t.thatch),s.tri([b,d,n/2],[b,d,-n/2],[b,x-.2,0],a,$t.thatch),s.box(0,x-.12,0,e+.9,.35,.55,l,$t.thatch),r){const S=[.05,.035,.025];s.quad([b+.02,h,-.45],[b+.02,h+1.4,-.45],[b+.02,h+1.4,.45],[b+.02,h,.45],S,0)}}function Hg(s,t,e=8){const n=je(hs.koa,.2,t),i=je("#4a2c18",.2,t),r=e/2;s.box(0,0,0,e*.8,.55,.62,n,$t.wood,0,.9),s.box(r*.85,.05,0,e*.2,.6,.4,i,$t.wood,0,.5),s.box(-r*.85,.05,0,e*.2,.55,.4,i,$t.wood,0,.5);const o=-2.4;for(const a of[-e*.15,e*.15])s.cyl([a,.55,0],[a,.5,o],.06,.06,i,$t.wood,4);s.box(0,.05,o,e*.5,.28,.24,i,$t.wood,0,.8)}function Vg(s,t){const e=je("#4d4642",.2,t);for(let n=0;n<5;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,$t.stone,n)}const nr=Math.PI*2,us=[[0,1,0]];for(let s=0;s<10;s++){const t=s*Math.PI/5,e=s%2?-1:1;us.push([Math.cos(t)*.8944,e*.4472,Math.sin(t)*.8944])}us.push([0,-1,0]);const eh=[];for(let s=0;s<5;s++){const t=1+2*s,e=t+1,n=1+(2*s+2)%10,i=1+(2*s+3)%10;eh.push([0,t,n],[t,e,n],[n,e,i],[11,e,i])}function Wg(s,t,e,n,i,r,o,a,l,c=0,h=.1,d=1){const f=(p,u,v)=>{const _=Math.max(0,Math.min(1,(v-p)/(u-p)));return _*_*(3-2*_)},m=us.map((p,u)=>{const v=u===0||u===11?1:1-h+2*h*Math.abs(Math.sin(u*12.9898+c*78.233)*43758.5453%1);return[t+p[0]*i*v,e+p[1]*r,n+p[2]*o*v]}),x=us.map(p=>{const u=[p[0]/i,p[1]/r,p[2]/o],v=Math.hypot(...u);return[u[0]/v,u[1]/v,u[2]/v]}),g=us.map(p=>{const u=d+(1-d)*f(-.8,.3,p[1]);return[a[0]*u,a[1]*u,a[2]*u]});for(const p of eh){const[u,v,_]=p.map(L=>m[L]),w=(v[1]-u[1])*(_[2]-u[2])-(v[2]-u[2])*(_[1]-u[1]),b=(v[2]-u[2])*(_[0]-u[0])-(v[0]-u[0])*(_[2]-u[2]),S=(v[0]-u[0])*(_[1]-u[1])-(v[1]-u[1])*(_[0]-u[0]),T=w*(u[0]+v[0]+_[0]-3*t)+b*(u[1]+v[1]+_[1]-3*e)+S*(u[2]+v[2]+_[2]-3*n)>0;for(const L of T?p:[p[0],p[2],p[1]])s.pos.push(m[L][0],m[L][1],m[L][2]),s.nor.push(x[L][0],x[L][1],x[L][2]),s.col.push(g[L][0],g[L][1],g[L][2]),s.mat.push(l),s.feat.push(0)}}function nn(s,{stick:t,r0:e=.4,r1:n=.25,bark:i="#6a6058",limbs:r=[],crowns:o}){const a=new qa,l=je(i,.1,s);t&&a.cyl([0,0,0],t,e,n,l,$t.wood,3);for(const[c,h,d,f]of r)a.cyl(c,h,d,f,l,$t.wood,3);for(const[c,h,d,f,m,x,g=$t.leaf,p=1,u=1]of o)Wg(a,c,h,d,f,m,f,typeof x=="string"?je(x,.1,s):x,g,p,.1,u);return a.geometry()}function Xg(s){const t=new qa,e=je("#8a7a62",.1,s),n=14;let i=[0,0,0];for(let l=1;l<=4;l++){const c=l/4*n,h=[.06*Math.pow(c,1.5),c,0];t.cyl(i,h,.3-l*.025,.28-l*.03,e,$t.wood,5),i=h}const r=i,o=je("#6E7A3E",.12,s),a=je("#8f9a43",.1,s);for(let l=0;l<9;l++){const c=l/9*nr+s()*.3,h=5.2+s()*1.2,d=1.4+s()*.8,f=Math.cos(c),m=Math.sin(c);let x=r;for(let g=1;g<=4;g++){const p=g/4,u=[r[0]+f*h*p,r[1]+d*p-3.8*p*p,r[2]+m*h*p],v=1*Math.sin(Math.PI*Math.min(1,p*1.1))+.15,_=-m*v,w=f*v,b=g>2?a:o;t.quad(x,u,[u[0]+_,u[1]-.35*v,u[2]+w],[x[0]+_*.7,x[1]-.25*v,x[2]+w*.7],b,$t.leaf),t.quad([x[0]-_*.7,x[1]-.25*v,x[2]-w*.7],[u[0]-_,u[1]-.35*v,u[2]-w],u,x,b,$t.leaf),x=u}}return t.geometry()}function $g(s){const t=[];for(let l=0;l<4;l++){const c=l/4*nr+.3;for(const h of[-1,1])t.push([Math.cos(c+h*.35)*6.2,10.2+(h>0?.4:0),Math.sin(c+h*.35)*6.2])}const e=[[2.6,6.1,.9],[2.1,6.4,-1.6],[-1.9,6.2,1.4],[-2.2,5.9,-1.1]],n=[0,1,2,3,4].map(l=>[Math.cos(l/5*nr)*3.6,3.4,Math.sin(l/5*nr)*3.6]),i="#56603D",r="#66704A",o="#77825A",a=je("#5C603F",0,s).map(l=>l*.95);return{ohia:nn(s,{stick:[.3,6.5,.1],bark:"#5A5354",crowns:[[.3,8.6,0,4.6,2.5,a],[2.2,7.7,1,3,1.8,a,$t.leaf,2]]}),ohiaKrumm:nn(s,{crowns:[[.6,2.4,.2,5,1.5,"#596537",$t.leaf,1,.75]]}),koa:nn(s,{stick:[.2,4,-.3],r0:.6,r1:.45,bark:"#5A504B",limbs:[0,2,4,6].map(l=>{const[c,h]=[t[l],t[l+1]];return[[.2,3.8,-.3],[(c[0]+h[0])/2*.9,(c[1]+h[1])/2-.6,(c[2]+h[2])/2*.9],.3,.14]}),crowns:[0,2,4,6].map((l,c)=>{const[h,d]=[t[l],t[l+1]];return[(h[0]+d[0])/2,(h[1]+d[1])/2+.3,(h[2]+d[2])/2,3,1.55,c===1?"#737B5A":"#5E6A3C",$t.leaf,c+1]})}),kukui:nn(s,{stick:[.3,4.2,.1],r0:.45,r1:.35,bark:"#5F5B54",crowns:[[.3,6.5,.1,5.8,3.2,r,$t.leaf,1,.62],[.5,8.6,.3,3.4,1.6,o,$t.leaf,5,.8],[-2.9,5.6,1.6,2.8,1.9,i,$t.leaf,2,.7]]}),ohiaai:nn(s,{stick:[0,2.4,0],r0:.35,r1:.3,bark:"#8A7458",crowns:[[0,6,0,2.4,3.6,"#3A5026"]]}),hau:nn(s,{crowns:[[0,2.2,0,5,2.2,"#6E8A3E"]]}),hala:nn(s,{stick:[.3,3.4,0],r0:.22,r1:.15,bark:"#8E8B82",limbs:[0,2].map(l=>{const[c,h]=e.slice(l,l+2);return[[.3,3.3,0],[(c[0]+h[0])/2,(c[1]+h[1])/2-.45,(c[2]+h[2])/2],.13,.09]}),crowns:e.map((l,c)=>[l[0],l[1]-.35,l[2],1.45,.75,"#55703D",$t.leaf,c+1])}),wiliwili:nn(s,{stick:[.1,2.8,.2],r0:.45,r1:.3,bark:"#9C6C44",limbs:n.map(l=>[[.05,2.5,.2],l,.2,.08]),crowns:[[0,3.9,.2,4.8,1.25,"#788C4A",$t.leaf,3,.75]]}),lama:nn(s,{stick:[.2,3.2,.1],r0:.25,r1:.18,bark:"#3E3A36",crowns:[[.2,5.4,.1,2.6,2,"#4C5E2E"]]}),aalii:nn(s,{crowns:[[0,1.2,0,1.5,1,"#6F8A4E"]]}),niu:Xg(s),milo:nn(s,{stick:[.2,2.2,0],r0:.35,r1:.28,bark:"#8A8070",crowns:[[.2,4.6,0,3.6,2.4,"#4A6426"]]})}}const Ze=3,ei=[30,80],qg=s=>Math.max(ei[0],Math.min(ei[1],s*2)),Vl=24e3;function jg(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}class Yg{constructor(t,e,n,i){const r=jg(5150),o=$g(r);this.group=new Oe,this.rect=e,this.nx=Math.ceil((e.x1-e.x0)/Ze),this.nz=Math.ceil((e.z1-e.z0)/Ze),this.mat=Aa(n,i,{fade:[ei[0]-7,ei[0]]}),this.matDS=Aa(n,i,{fade:[ei[0]-7,ei[0]],doubleSide:!0}),this.species=[];const a=new Kt,l=new Hi,c=new N(0,1,0),h=new N,d=new N;this.total=0,Di.forEach((f,m)=>{const x=t.lists[m],g=x.length/js,p=new Int32Array(g),u=new Int32Array(this.nx*this.nz);for(let C=0;C<g;C++){const k=Math.min(this.nx-1,Math.max(0,Math.floor((x[C*js]-e.x0)/Ze))),D=Math.min(this.nz-1,Math.max(0,Math.floor((x[C*js+1]-e.z0)/Ze)));p[C]=D*this.nx+k,u[p[C]]++}const v=new Int32Array(this.nx*this.nz+1);for(let C=0;C<u.length;C++)v[C+1]=v[C]+u[C];const _=v.slice(),w=new Int32Array(g);for(let C=0;C<g;C++)w[_[p[C]]++]=C;for(let C=0;C<u.length;C++)for(let k=v[C+1]-1;k>v[C];k--){const D=v[C]+Math.floor(r()*(k-v[C]+1)),F=w[k];w[k]=w[D],w[D]=F}const b=new Float32Array(g*16),S=new Float32Array(g*3),T=new Float32Array(g);for(let C=0;C<g;C++){const D=w[C]*js;l.setFromAxisAngle(c,x[D+3]);const F=Fn*x[D+4];h.set(x[D],Ri(x[D+2]),x[D+1]),d.set(F,F,F),a.compose(h,l,d),a.toArray(b,C*16),S[C*3]=x[D+5],S[C*3+1]=x[D+6],S[C*3+2]=x[D+7],T[C]=x[D+8]}const L=Math.min(g,Vl),M=Og(o[f]),y=new J0(M,f==="niu"||f==="hala"?this.matDS:this.mat,Math.max(1,L));y.name=f,y.count=0,y.frustumCulled=!1,y.instanceMatrix.setUsage(ss),y.instanceColor=new qe(new Float32Array(Math.max(1,L)*3),3),y.instanceColor.setUsage(ss);const P=new qe(new Float32Array(Math.max(1,L)),1);P.setUsage(ss),M.setAttribute("aClear",P),this.group.add(y),this.species.push({kind:f,mesh:y,aClear:P,start:v,mats:b,cols:S,clear:T,cap:L,n:g}),this.total+=g}),this.frustum=new Vi,this.pv=new Kt,this.box=new on,this.key="",this.drawn=0}update(t,e,n,i){if(this.group.visible=e>.001,!this.group.visible)return;const r=qg(i),o=r*.42;for(const u of[this.mat,this.matDS])u.uniforms.uFadeNear.value=r*.7,u.uniforms.uFadeFar.value=r;const a=t.position;this.pv.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.pv);const l=this.rect,c=[],h=Math.max(0,Math.floor((a.x-r-l.x0)/Ze)),d=Math.min(this.nx-1,Math.floor((a.x+r-l.x0)/Ze)),f=Math.max(0,Math.floor((a.z-r-l.z0)/Ze)),m=Math.min(this.nz-1,Math.floor((a.z+r-l.z0)/Ze));for(let u=f;u<=m;u++)for(let v=h;v<=d;v++){const _=l.x0+v*Ze,w=l.z0+u*Ze;this.box.min.set(_,-.5,w),this.box.max.set(_+Ze,n,w+Ze);const b=this.box.distanceToPoint(a);if(b>r||!this.frustum.intersectsBox(this.box))continue;const S=b<o?1:Math.pow(o/b,1.6);c.push(u*this.nx+v,Math.round(S*20))}const x=c.join(",");if(x===this.key)return;this.key=x;let g=0;for(const u of this.species)for(let v=0;v<c.length;v+=2)g+=Math.ceil((u.start[c[v]+1]-u.start[c[v]])*c[v+1]/20);const p=Math.min(1,Vl/Math.max(1,g));this.drawn=0;for(const u of this.species){let v=0;for(let _=0;_<c.length;_+=2){const w=c[_],b=u.start[w],S=u.start[w+1]-b,T=Math.min(Math.ceil(S*c[_+1]*p/20),u.cap-v);T<=0||(u.mesh.instanceMatrix.array.set(u.mats.subarray(b*16,(b+T)*16),v*16),u.mesh.instanceColor.array.set(u.cols.subarray(b*3,(b+T)*3),v*3),u.aClear.array.set(u.clear.subarray(b,b+T),v),v+=T)}u.mesh.count=v,u.mesh.instanceMatrix.needsUpdate=!0,u.mesh.instanceColor.needsUpdate=!0,u.aClear.needsUpdate=!0,u.mesh.visible=v>0,this.drawn+=v}}dispose(){for(const t of this.species)t.mesh.geometry.dispose();this.mat.dispose(),this.matDS.dispose()}}const Kg=`
${Ie}
${Ge}
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
`,Zg=`
${Ie}
${xs}
${Ge}
${Xi}
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
`,Jg=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);class Qg{constructor(t,e){this.shared=t,this.camera=e,this.group=new Oe,this.batches=[],this._res=new It}add(t,{mode:e="earth",colour:n=[1,1,1],alpha:i=1,minPx:r=1,lift:o=.004,order:a=5,endFade:l=0}={}){const c=[],h=[],d=[];for(const{pts:u,width:v}of t){let _=0;for(let b=0;b+1<u.length;b++)_+=Math.hypot(u[b+1][0]-u[b][0],u[b+1][1]-u[b][1]);let w=0;for(let b=0;b+1<u.length;b++){const[S,T]=u[b],[L,M]=u[b+1],y=Math.hypot(L-S,M-T);if(y<1e-6)continue;const P=Array.isArray(v)?v[b]:v,C=Array.isArray(v)?v[b+1]:v;c.push(S,T,L,M),h.push(P,C,w,w+y),d.push(_),w+=y}}if(!c.length)return null;const f=new vs;f.setAttribute("position",new ue(Jg,3)),f.setIndex([0,2,1,1,2,3]),f.setAttribute("aSeg",new qe(new Float32Array(c),4)),f.setAttribute("aInfo",new qe(new Float32Array(h),4)),f.setAttribute("aEnd",new qe(new Float32Array(d),1)),f.instanceCount=c.length/4;const m={...this.shared.uniforms,uCamPos:{value:new N},uPxK:{value:.001},uMinPx:{value:r},uLift:{value:o},uColor:{value:new Ct(...n)},uAlpha:{value:i},uMode:{value:e==="water"?0:e==="earth"?1:2},uEndFade:{value:l}},x=new fe({vertexShader:Kg,fragmentShader:Zg,uniforms:m,transparent:!0,depthWrite:!1,side:an,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),g=new le(f,x);g.frustumCulled=!1,g.renderOrder=a,this.group.add(g);const p={mesh:g,uniforms:m,alpha:i,count:f.instanceCount};return this.batches.push(p),p}update(t){t.getDrawingBufferSize(this._res);const e=this.camera,n=2*Math.tan(e.fov*Math.PI/360)/Math.max(1,this._res.y/t.getPixelRatio());for(const i of this.batches)i.uniforms.uCamPos.value.copy(e.position),i.uniforms.uPxK.value=n,i.mesh.visible=i.uniforms.uAlpha.value>.003}dispose(){for(const t of this.batches)t.mesh.geometry.dispose(),t.mesh.material.dispose()}}const ra={hawaii:"#f0ae3c",oahu:"#a88fe6",maui:"#d9703f"},tv=26,Wl=3.4*Fn,ev=`
${Ie}
${Ge}
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
`,nv=`
${Ie}
${Xi}
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
`;function iv(s,t){const e=new Float32Array(s),n=Array.from({length:5},()=>t());for(let i=0;i<s;i++){const r=n[i%n.length];e[i]=(r+(t()-.5)*(t()<.7?.16:1))%1,e[i]<0&&(e[i]+=1)}return e}class sv{constructor(t,e,n,i){var d;this.app=t;let r=2026;const o=()=>(r=r*16807%2147483647,r/2147483647);this.forces=[],this.lines=[];for(const f of e){const m=f.properties||{};if(m.kind!=="force"&&m.kind!=="line"||((d=f.geometry)==null?void 0:d.type)!=="LineString")continue;const x=f.geometry.coordinates.map(v=>t.data.proj.toWorld(v)),g=[0];for(let v=1;v<x.length;v++)g.push(g[v-1]+Math.hypot(x[v][0]-x[v-1][0],x[v][1]-x[v-1][1]));const p=g.at(-1),u={p:m,pts:x,cum:g,total:p,event:m.event,step:Number.isFinite(m.step)?m.step:0,w:0,goal:0};if(m.kind==="line"){const v=m.side||(m.role==="advance"?"hawaii":"oahu");u.batch=i.add([{pts:x,width:.75}],{mode:"band",colour:new Ct(ra[v]||"#ffffff").toArray(),alpha:0,minPx:6,lift:.01,order:6,endFade:1.2}),u.mid=rn(f.geometry),this.lines.push(u),u.stand=!0,u.n=Math.round(Math.max(60,Math.min(220,p*45))),u.half=.2,u.u0=Float32Array.from({length:u.n},()=>o()),u.lat=Float32Array.from({length:u.n},()=>(o()+o()+o())/1.5-1),u.size=Float32Array.from({length:u.n},()=>Wl*(.7+.6*o())),u.colour=new Ct(ra[v]||"#ffffff"),this.forces.push(u)}else{const v=/path/i.test(m.name||"")&&p<12;u.file=v,u.n=Math.round(Math.max(90,Math.min(1400,p*(v?12:40)))),u.half=v?.04:m.role==="hawaii"?.36:.28,u.u0=iv(u.n,o),u.lat=Float32Array.from({length:u.n},()=>(o()+o()+o())/1.5-1),u.size=Float32Array.from({length:u.n},()=>Wl*(.7+.6*o())),u.colour=new Ct(ra[m.role]||"#ffffff"),this.forces.push(u)}}this.events=new Map;for(const f of new Set([...this.forces,...this.lines])){if(!f.event)continue;let m=this.events.get(f.event);m||this.events.set(f.event,m={id:f.event,from:1/0,to:-1/0,recs:[]}),m.recs.push(f),Number.isFinite(f.p.from)&&(m.from=Math.min(m.from,f.p.from)),Number.isFinite(f.p.to)&&(m.to=Math.max(m.to,f.p.to))}const a=this.forces.reduce((f,m)=>f+m.n,0);this.count=a;const l=new vs;l.setAttribute("position",new ue(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),l.setIndex([0,1,2,0,2,3]),this.marks=new Float32Array(Math.max(1,a)*4),this.markAttr=new qe(this.marks,4),this.markAttr.setUsage(ss),l.setAttribute("aMark",this.markAttr);const c=new Float32Array(Math.max(1,a)*3);let h=0;for(const f of this.forces){f.o=h;for(let m=0;m<f.n;m++)f.colour.toArray(c,(h+m)*3);h+=f.n}l.setAttribute("aColour",new qe(c,3)),l.instanceCount=a,this.material=new fe({vertexShader:ev,fragmentShader:nv,uniforms:{...n.uniforms,uPxK:{value:.001}},transparent:!0,depthWrite:!1}),this.mesh=new le(l,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=7,this.group=new Oe,this.group.add(this.mesh),this.time=0,this.showing={event:null,steps:[],quiet:!1}}stepsAt(t,e){var h;const n=this.events.get(t.id),i=t.stops||[];if(!n||e<0||e>=i.length)return[];const r=(h=this.app.tour)==null?void 0:h.places,o=this.app.data.proj,a=[];for(const d of n.recs){if(d.p.kind!=="line"||!d.mid)continue;const[f,m]=o.toWorld(d.mid);let x=-1,g=6;i.forEach((p,u)=>{const v=r==null?void 0:r.get(p.place),_=v&&rn(v.geometry);if(!_)return;const[w,b]=o.toWorld(_),S=Math.hypot(w-f,b-m);S<g&&(g=S,x=u)}),x>=0&&a.push(x-d.step)}a.sort((d,f)=>d-f);const l=a.length?a[Math.floor(a.length/2)]:0,c=new Set;for(const d of n.recs){const f=d.step+l;(f===e||e===i.length-1&&f>e)&&c.add(d.step)}return[...c].sort((d,f)=>d-f)}choose(){const t=this.app.tour,e=t!=null&&t.active?t.event:null;if(e&&this.events.has(e.id)&&t.stop>=0)return{event:e.id,steps:this.stepsAt(e,t.stop),quiet:!1};const n=this.app.timeline.year;for(const i of this.events.values())if(n>=i.from&&n<i.to+1)return{event:i.id,steps:null,quiet:!0};return{event:null,steps:[],quiet:!1}}update(t,e,n=0){e*=1-jn(75,140,n),this.time+=t;const i=this.app.camera;this.material.uniforms.uPxK.value=2*Math.tan(i.fov*Math.PI/360)/Math.max(1,innerHeight);const r=this.choose();this.showing=r;const o=t>0?1-Math.exp(-t*2):1;for(const h of new Set([...this.forces,...this.lines])){const d=h.event===r.event&&(r.steps===null||r.steps.includes(h.step));h.goal=d?r.quiet?.2:1:0,h.w+=(h.goal-h.w)*o,Math.abs(h.goal-h.w)<.003&&(h.w=h.goal)}for(const h of this.lines)h.batch&&(h.batch.uniforms.uAlpha.value=.34*h.w*e);const a=r.quiet?.5:1,l=this.marks,c=e>.002&&this.forces.some(h=>h.w>.002);if(!c&&!this.wasShowing){this.mesh.visible=!1,this.marksShown=0;return}this.wasShowing=c;for(const h of this.forces){const d=h.w*e*(h.file?.5:h.stand?.7:.85);for(let f=0;f<h.n;f++){const m=(h.o+f)*4;if(d<=.002){l[m+2]=0;continue}const x=h.stand?Math.min(.999,Math.max(0,h.u0[f]+Math.sin(this.time*.6+f*2.3)*.015)):(h.u0[f]+this.time*a/tv)%1,g=h.stand?jn(0,.12,x)*(1-jn(.88,1,x)):h.file?jn(.3,.45,x)*(1-jn(.8,.97,x)):jn(0,.12,x)*(1-jn(.72,.95,x)),p=x*h.total;let u=1;for(;u<h.cum.length-1&&h.cum[u]<p;)u++;const v=h.pts[u-1],_=h.pts[u],w=h.cum[u]-h.cum[u-1]||1,b=(p-h.cum[u-1])/w,S=(_[0]-v[0])/w,T=(_[1]-v[1])/w,L=h.stand?h.half:h.half*(.45+.55*Math.sin(Math.PI*Math.min(1,x*1.15))),M=Math.sin(this.time*.7+f*1.7)*.15,y=(h.lat[f]+M)*L;l[m]=v[0]+(_[0]-v[0])*b-T*y,l[m+1]=v[1]+(_[1]-v[1])*b+S*y,l[m+2]=d*g,l[m+3]=h.size[f]}}this.markAttr.needsUpdate=!0,this.mesh.visible=e>.002&&this.forces.some(h=>h.w>.002),this.marksShown=0;for(const h of this.forces)h.w>.002&&(this.marksShown+=h.n)}stats(){const t=this.choose(),e=n=>n.event===t.event&&(t.steps===null||t.steps.includes(n.step));return{event:t.event,steps:t.steps,quiet:t.quiet,forces:this.forces.filter(n=>e(n)&&!n.stand).map(n=>n.p.name),lines:this.lines.filter(e).map(n=>n.p.name),marks:this.count,marksShown:this.marksShown??0}}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}function jn(s,t,e){const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)}class rv{constructor(t,e){this.app=t;const n=document.getElementById("ui")||document.body;this.layer=document.createElement("div"),this.layer.className="dlabels",n.insertBefore(this.layer,n.querySelector(".pins")||n.firstChild),this.items=[];for(const i of e){const r=i.properties||{};if(r.kind!=="label"||!r.name)continue;const o=rn(i.geometry);if(!o)continue;const[a,l]=t.data.proj.toWorld(o),c=document.createElement("div");c.className="dlabel",c.textContent=r.name,c.lang="haw",this.layer.appendChild(c),this.items.push({p:r,x:a,z:l,el:c,v:new N,shown:-1,tx:NaN,ty:NaN})}this.panels=[],this.frame=0}panelRects(){if(this.frame++%15===0){this.panels=[];for(const t of document.querySelectorAll(".card, .timeline, .legend, .tools, .brand, .inspector")){if(t.hidden||!t.offsetParent)continue;const e=t.getBoundingClientRect();e.width>0&&e.height>0&&this.panels.push(e)}}return this.panels}update(t){const e=this.app,n=e.camera,i=innerWidth,r=innerHeight,o=e.rig.state.distance,a=1-Math.max(0,Math.min(1,(o-32)/30)),l=[],c=this.panelRects(),h=e.timeline.year;for(const d of this.items){let f=t*a*($a(d.p,h)?1:0);if(f>.01){d.v.set(d.x,e.world.heightAt(d.x,d.z)+.05,d.z).project(n),(d.v.z>1||d.v.z<-1)&&(f=0);const x=(d.v.x+1)/2*i,g=(1-d.v.y)/2*r;(x<-80||x>i+80||g<60||g>r+20)&&(f=0);const p=d.el.offsetWidth||60;f>.01&&c.some(u=>x+p/2>u.left-4&&x-p/2<u.right+4&&g+10>u.top-4&&g-10<u.bottom+4)&&(f=0),f>.01&&l.some(u=>Math.abs(u[0]-x)<(u[2]+p)/2+6&&Math.abs(u[1]-g)<18)&&(f=0),f>.01&&l.push([x,g,p]),f>.01&&!(Math.abs(x-d.tx)<=.3&&Math.abs(g-d.ty)<=.3)&&(d.el.style.transform=`translate(${x.toFixed(1)}px, ${g.toFixed(1)}px)`,d.tx=x,d.ty=g)}const m=Math.round(f*20)/20;m!==d.shown&&(d.el.style.opacity=String(m),d.el.style.visibility=m>0?"visible":"hidden",d.shown=m)}}visible(){return this.items.filter(t=>t.shown>.5).map(t=>t.p.name)}dispose(){this.layer.remove()}}const Ei=Fn*1.4;function av(s){let t=s>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Xl(s,t,e){let n=!1;for(let i=0,r=s.length-1;i<s.length;r=i++){const o=s[i],a=s[r];o[1]>e!=a[1]>e&&t<(a[0]-o[0])*(e-o[1])/(a[1]-o[1])+o[0]&&(n=!n)}return n}function $l(s,t){const e=[s[0]];for(let n=0;n+1<s.length;n++){const[i,r]=s[n],[o,a]=s[n+1],l=Math.max(1,Math.ceil(Math.hypot(o-i,a-r)/t));for(let c=1;c<=l;c++)e.push([i+(o-i)*c/l,r+(a-r)*c/l])}return e}class ov{constructor(t,e,n){var d,f;this.app=t,this.districts=e,this.rec=n,this.group=new Oe,this.group.name="district features";const i=t.shared,r=t.data.proj,o=n.d.features.features||[];this.own={uShow:{value:0},uFeatSeen:{value:Array.from({length:16},()=>new Zt(0,0,0,0))},uDistS:{value:n.terrain.shadow.texture}};const a=av(1795),l=new qa;this.counts={hale:0,waa:0,pondWalls:0};for(const[m,x]of n.d.byIndex){const g=(d=x.properties)==null?void 0:d.kind,p=x.geometry.coordinates[0].map(u=>r.toWorld(u));g==="village"?this.buildVillage(l,p,m,a):g==="fishpond"&&this.buildPond(l,p,m,a)}this.structMat=Aa(i,this.own,{fade:[70,110]}),this.structures=new le(l.geometry(),this.structMat),this.structures.frustumCulled=!1,this.group.add(this.structures),this.forest=new Yg(n.data.trees,n.d.rect,i,this.own),this.group.add(this.forest.group),this.ribbons=new Qg(i,t.camera);const c=n.data.streams,h=[];for(let m=0;m<c.length;){const x=c[m++],g=[],p=[];for(let u=0;u<x;u++,m+=3)g.push([c[m],c[m+1]]),p.push(Math.min(7.5,1+1.3*Math.pow(c[m+2],.45))*Fn);h.push({pts:g,width:p})}this.streams=this.ribbons.add(h,{mode:"water",alpha:0,minPx:.9,lift:.004,order:5}),this.streamCount=h.length,this.trails=[];for(const m of o){const x=m.properties||{};if(x.kind!=="trail"||((f=m.geometry)==null?void 0:f.type)!=="LineString")continue;const g=$l(m.geometry.coordinates.map(u=>r.toWorld(u)),.12),p=this.ribbons.add([{pts:g,width:3.2*Fn}],{mode:"earth",colour:new Ct("#9c7f5c").toArray(),alpha:0,minPx:1.3,lift:.006,order:5});p&&this.trails.push({p:x,batch:p,w:0})}this.forces=new sv(t,o,i,this.ribbons),this.group.add(this.ribbons.group,this.forces.group),this.labels=new rv(t,o),this.show=0}groundAt(t,e,n=!0){const i=this.districts.rawAt(t,e);if(!n)return i;const{d:r}=this.rec,o=r.rect,a=Math.max(0,Math.min(r.W-1,Math.floor((t-o.x0)/(o.x1-o.x0)*r.W))),c=Math.max(0,Math.min(r.H-1,Math.floor((e-o.z0)/(o.z1-o.z0)*r.H)))*r.W+a;return Qc(i,this.rec.aux[c*4],1,Wa(this.rec.carve[c*2]))}buildVillage(t,e,n,i){t.feature(n);let r=1/0,o=-1/0,a=1/0,l=-1/0;for(const[d,f]of e)r=Math.min(r,d),o=Math.max(o,d),a=Math.min(a,f),l=Math.max(l,f);const c=.85,h=[];for(let d=a+c/2;d<l;d+=c)for(let f=r+c/2;f<o;f+=c){const m=f+(i()-.5)*c*.7,x=d+(i()-.5)*c*.7;!Xl(e,m,x)||i()<.25||h.push([m,x])}for(const[d,f]of h){const m=i()*Math.PI*2,x=2+Math.floor(i()*3),g=[];for(let p=0;p<x;p++){const u=m+p/x*Math.PI*2+(i()-.5)*.6,v=p===0?0:.3+i()*.12,_=d+Math.cos(u)*v,w=f+Math.sin(u)*v;if(!Xl(e,_,w)||g.some(([y,P])=>Math.hypot(y-_,P-w)<.3))continue;g.push([_,w]);const b=6+i()*3,S=4+i()*1.4;let T=1/0,L=-1/0;for(const[y,P]of[[0,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const C=this.groundAt(_+y*b*.5*Ei,w+P*S*.5*Ei,!1);T=Math.min(T,C),L=Math.max(L,C)}if(T<.6||L-T>2.5)continue;const M=Ri(L);t.at(_,M,w,m+p%2*Math.PI*.5,Ei),Gg(t,i,b,S,4.6+i()*1.2,!0,.9+Ri(L-T)/Ei),t.done(),this.counts.hale++}if(i()<.4){const p=d+.08,u=f-.06;t.at(p,Ri(this.groundAt(p,u,!1)),u,0,Ei),Vg(t,i),t.done()}}this.buildCanoes(t,e,n,i),t.feature(0)}buildCanoes(t,e,n,i){let r=0,o=0;for(const[f,m]of e)r+=f/e.length,o+=m/e.length;const a=[],l=9,c=.06,h=Array.from({length:16},(f,m)=>[Math.cos(m/16*Math.PI*2),Math.sin(m/16*Math.PI*2)]);for(let f=o-l;f<o+l;f+=c)for(let m=r-l;m<r+l;m+=c){const x=this.groundAt(m,f);if(x<.3||x>2.2)continue;let g=null;for(const[p,u]of h)this.groundAt(m+p*.3,f+u*.3)<=0&&(g=g?[g[0]+p,g[1]+u]:[p,u]);g&&a.push([m,f,x,Math.atan2(g[1],g[0]),Math.hypot(m-r,f-o)])}a.sort((f,m)=>f[4]-m[4]);const d=[];for(const f of a){if(d.length>=14)break;d.some(m=>Math.hypot(m[0]-f[0],m[1]-f[1])<.22)||d.push(f)}for(const[f,m,x,g]of d)t.at(f,Ri(x)+.002,m,g,Ei),Hg(t,i,7+i()*4),t.done(),this.counts.waa++}buildPond(t,e,n,i){t.feature(n);const r=je(hs.pondStone,.12,i),o=$l(e,.05).map(([a,l])=>[a,Ri(Math.max(this.groundAt(a,l),-.8))-.004,l]);t.wall(o,3*Fn,1.6*Fn,r,$t.stone,.72),this.counts.pondWalls++,t.feature(0)}update(t,e,n){const i=e;this.show=i,this.own.uShow.value=i;const r=this.districts.featSeen,o=this.own.uFeatSeen.value;for(let c=0;c<64;c++)o[c>>2].setComponent(c&3,r[c]);this.group.visible=i>.001;const a=this.app.timeline.year,l=t>0?1-Math.exp(-t*1.6):1;this.streams&&(this.streams.uniforms.uAlpha.value=.8*i);for(const c of this.trails){const h=$a(c.p,a)?1:0;c.w+=(h-c.w)*l,Math.abs(h-c.w)<.003&&(c.w=h),c.batch.uniforms.uAlpha.value=.75*c.w*i}this.forest.update(this.app.camera,i,this.rec.data.hi*this.app.world.uniforms.uVert.value+1,n),this.forces.update(t,i,n),this.ribbons.update(this.app.renderer),this.labels.update(i)}settle(t,e){this.update(0,t,e)}stats(){return{...this.counts,trees:this.forest.total,treesDrawn:this.forest.drawn,treeRadius:ei,streams:this.streamCount,trails:this.trails.filter(t=>t.w>.5).length,forces:this.forces.stats(),labels:this.labels.visible()}}dispose(){this.structures.geometry.dispose(),this.structMat.dispose(),this.forest.dispose(),this.ribbons.dispose(),this.forces.dispose(),this.labels.dispose()}}const aa=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Ra=new Float32Array(65536);for(let s=0;s<65536;s++)Ra[s]=Wa(s);class lv{constructor(t){this.app=t,this.world=t.world,this.list=[],this.loaded=!1,this.cur=null,this.k=0,this.want=0,this.patchK=1,this.featK=new Float32Array(64),this.featSeen=new Float32Array(64),this.u=this.world.uniforms,this._frustum=new Vi,this._m=new Kt,this._box=new on,this.lastSeen=0,this.log=[]}async load(){this.list=await Ng(this.app.data,this.app.warn),this.loaded=!0}districtAt(t,e,n=0){for(const i of this.list){const r=i.rect;if(t>r.x0-n&&t<r.x1+n&&e>r.z0-n&&e<r.z1+n)return i}return null}prefetch(t,e){const n=this.districtAt(t,e,20);return n&&(this.prefetchAt=performance.now(),this.stream(n)),n}readyAt(t,e){var i;const n=this.districtAt(t,e);return!!n&&((i=this.cur)==null?void 0:i.d)===n&&this.cur.state==="ready"}stream(t){var n;if(((n=this.cur)==null?void 0:n.d)===t)return;if(!this.world.terrains.get(t.parent)){this.pending=t;return}this.cur&&this.drop();const e={d:t,state:"loading",t0:performance.now()};this.cur=e,this.lastSeen=e.t0,this.decoder=this.decoder||new zg(this.app.warn),this.decoder.decode(t).then(i=>{this.cur===e&&this.arrive(e,i)}).catch(i=>{this.cur===e&&(this.app.warn(`district ${t.id}: ${i.message}`),e.state="failed")})}arrive(t,e){var c;const{d:n}=t;t.decodeMs=Math.round(performance.now()-t.t0),t.data=e,t.metres=e.metres,t.aux=e.aux,t.carve=e.carve;const i={id:n.id,name:n.name,rect:n.rect,W:n.W,H:n.H,rainUrl:n.rainUrl,data:{metres:e.metres,normals:e.normals,land:e.land,lo:e.lo,hi:e.hi}};t.pack=i;const r=this.world.terrains.get(n.parent);t.parUniforms={uParN:{value:(r==null?void 0:r.normalTex)??null},uParL:{value:(r==null?void 0:r.landTex)??null},uParS:{value:(r==null?void 0:r.shadow.texture)??null},uParRect:{value:r?r.rect:new Zt(0,0,1,1)},uParSlot:{value:-1},uParRain:{value:(r==null?void 0:r.uniforms.uOwnRain.value)??1}};const o=new Ea(i,this.world,[this.world.arch,r].filter(Boolean),{vertexShader:mg,fragmentShader:gg,shadowFragment:vg,shadowSize:512,uniforms:{...t.parUniforms,uDistN:{value:null},uDistL:{value:null},uDistS:{value:null}}});for(const h of[o.full,o.half]){const d=h.material.uniforms;d.uDistN.value=o.normalTex,d.uDistL.value=o.landTex,d.uDistS.value=o.shadow.texture}if(o.group.visible=!1,o.applyRange(((c=this.app.qset)==null?void 0:c.range)??4.6),this.app.params.get("debug"))for(const h of[o.full,o.half])h.material.uniforms.uDebug.value=Number(this.app.params.get("debug"));t.terrain=o,t.parent=r,this.world.group.add(o.group),t.heightTex=o.heightTex;const a=new Rn(e.aux,n.W,n.H,_e,Me);a.minFilter=a.magFilter=ne,a.needsUpdate=!0;const l=new Rn(e.carve,n.W,n.H,Sc,kn);l.minFilter=l.magFilter=ne,l.needsUpdate=!0,t.auxTex=a,t.carveTex=l,t.uploads=[o.heightTex,a,l,o.normalTex,o.landTex],t.state="uploading",t.features=new ov(this.app,this,t),this.app.scene.add(t.features.group),e.normals=e.land=null,e.trees={counts:e.trees.counts},e.streams=null}drop(){var e,n;const t=this.cur;t&&(this.off(),t.terrain&&(this.world.group.remove(t.terrain.group),t.terrain.dispose()),(e=t.auxTex)==null||e.dispose(),(n=t.carveTex)==null||n.dispose(),t.features&&(this.app.scene.remove(t.features.group),t.features.dispose()),this.cur=null,this.k=0)}off(){var e;const t=this.u;t.uDistInfo.value.set(0,0,Ne.margin,Ne.band),t.uDistH.value=this.world.dummy,t.uDistAux.value=this.world.dummyAux,t.uDistCarve.value=this.world.dummy,(e=this.cur)!=null&&e.terrain&&(this.cur.terrain.group.visible=!1),this.on=!1}yearWeights(t){const e=this.cur,n=this.app.timeline.year;this.patchK+=((e&&n<e.d.patchUntil?1:0)-this.patchK)*t,Math.abs(this.patchK-Math.round(this.patchK))<.002&&(this.patchK=Math.round(this.patchK)),this.u.uPatchK.value=this.patchK;const i=this.u.uFeatK.value;if(e)for(const[r,o]of e.d.byIndex){const a=$a(o.properties,n)?1:0;let l=this.featK[r]+(a-this.featK[r])*t;Math.abs(l-a)<.002&&(l=a),this.featK[r]=l;const c=n>=th(o.properties)[0]?1:0;let h=this.featSeen[r]+(c-this.featSeen[r])*t;Math.abs(h-c)<.002&&(h=c),this.featSeen[r]=h,i[r>>2].setComponent(r&3,l)}}wantFor(t,e,n){var c,h;const i=t.rect,r=e.position,o=Math.max(i.x0-r.x,0,r.x-i.x1),a=Math.max(i.z0-r.z,0,r.z-i.z1),l=Math.hypot(o,a,Math.max(1,r.y));return this.dc=l,this._m.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this._box.min.set(i.x0,0,i.z0),this._box.max.set(i.x1,Math.max(1,(((h=(c=this.cur)==null?void 0:c.data)==null?void 0:h.hi)??1e3)*this.u.uVert.value),i.z1),this._frustum.intersectsBox(this._box)?aa(Ne.far,Ne.near,l)*(1-aa(Ne.rig[0],Ne.rig[1],n)):0}update(t,e,n){var x,g,p;if(!this.loaded||!this.list.length)return;if(this.pending&&this.world.terrains.get(this.pending.parent)){const u=this.pending;this.pending=null,this.stream(u)}const i=t.position;let r=null,o=1/0;for(const u of this.list){const v=u.rect,_=Math.hypot(Math.max(v.x0-i.x,0,i.x-v.x1),Math.max(v.z0-i.z,0,i.z-v.z1),Math.max(1,i.y));_<o&&(o=_,r=u)}r&&o<Ne.prefetch&&((x=this.cur)==null?void 0:x.d)!==r&&this.stream(r);const a=this.cur,l=1-Math.exp(-n*2.5);if(this.yearWeights(n>0?1-Math.exp(-n*1.6):1),!a)return;if(a.state==="uploading"){const u=a.uploads.shift();u&&this.app.renderer.initTexture(u),a.uploads.length||(a.state="ready",a.readyMs=Math.round(performance.now()-a.t0))}const c=a.parent,h=c&&c.slot>=0?c.k:0,d=a.state==="ready"?Math.min(this.wantFor(a.d,t,e),h):0;this.want=d,this.forceK!==null&&this.forceK!==void 0&&a.state==="ready"&&h>0?this.k=Math.min(this.forceK,h):(this.k+=(d-this.k)*l,Math.abs(d-this.k)<.004&&(this.k=d),this.k=Math.min(this.k,h));const f=a.state==="ready"&&h>0&&(this.k>0||d>0);f?this.switchOn(a):this.on&&this.off(),(f||this.k>0)&&(this.lastSeen=performance.now());const m=Math.max(this.lastSeen,(this.prefetchAt??-1e9)+Ne.hold*1e3);!f&&o>Ne.prefetch*1.2&&performance.now()-m>Ne.linger*1e3&&a.state!=="loading"&&this.drop(),this.cur&&((g=a.terrain)==null||g.update(t,this.on),(p=a.features)==null||p.update(n,this.on?this.k:0,e))}switchOn(t){const e=this.u,n=t.parent;e.uDistRect.value.copy(t.terrain.rect),e.uDistInfo.value.set(this.k,1,Ne.margin,Ne.band),e.uDistH.value=t.heightTex,e.uDistAux.value=t.auxTex,e.uDistCarve.value=t.carveTex;const i=t.parUniforms;i.uParSlot.value=n.slot,i.uParN.value=n.normalTex,i.uParL.value=n.landTex,i.uParS.value=n.shadow.texture,this.on=!0}updateShadow(t,e,n,i){var r;this.on&&((r=this.cur)!=null&&r.terrain)&&this.cur.terrain.shadow.update(t,e,n,this.k,i)}settle(t,e){var o;this.yearWeights(1);const n=this.cur;if(!n||n.state!=="ready")return;const i=n.parent,r=i&&i.slot>=0?i.k:0;this.k=Math.min(this.wantFor(n.d,t,e),r),this.k>0?(this.switchOn(n),n.terrain.update(t,!0)):this.on&&this.off(),(o=n.features)==null||o.settle(this.k,e)}weightAt(t,e){if(!this.on)return 0;const n=this.cur.d.rect,i=Math.min(t-n.x0,n.x1-t,e-n.z0,n.z1-e);return this.k*aa(Ne.band,Ne.margin,i)}texel(t,e){const n=this.cur,i=n.d.W,r=e*i+t;let o=n.metres[r];const a=n.aux;o=Qc(o,a[r*4],this.patchK,Ra[n.carve[r*2]]);const l=a[r*4+3];if(l>0){const c=this.featK[l];l<un.pond?o+=(Jc(o,Ra[n.carve[r*2]],a[r*4+2])-o)*(a[r*4+1]/255)*c:l<un.other&&(o+=(qc-o)*(a[r*4+1]/255)*c)}return o}metresAt(t,e){const{d:n}=this.cur,i=n.rect;let r=(t-i.x0)/(i.x1-i.x0)*n.W-.5,o=(e-i.z0)/(i.z1-i.z0)*n.H-.5;r=Math.max(0,Math.min(n.W-1.001,r)),o=Math.max(0,Math.min(n.H-1.001,o));const a=r|0,l=o|0,c=r-a,h=o-l,d=this.texel(a,l)+(this.texel(a+1,l)-this.texel(a,l))*c,f=this.texel(a,l+1)+(this.texel(a+1,l+1)-this.texel(a,l+1))*c;return d+(f-d)*h}blend(t,e,n){const i=this.weightAt(t,e);return i>0?n+(this.metresAt(t,e)-n)*i:n}rawAt(t,e){const{d:n}=this.cur,i=n.rect,r=Math.max(0,Math.min(n.W-1,Math.floor((t-i.x0)/(i.x1-i.x0)*n.W))),o=Math.max(0,Math.min(n.H-1,Math.floor((e-i.z0)/(i.z1-i.z0)*n.H)));return this.cur.metres[o*n.W+r]}stats(){var r,o;const t=this.cur;if(!t)return{district:null,loaded:this.loaded,count:this.list.length};const e=t.d.W*t.d.H,n=e*4+e*4+e*4+2*(e*4*4/3)+512*512,i=t.metres?e*4+e*4+e*4:0;return{district:t.d.id,state:t.state,k:+this.k.toFixed(3),want:+this.want.toFixed(3),on:!!this.on,patchK:+this.patchK.toFixed(3),decodeMs:t.decodeMs??null,readyMs:t.readyMs??null,workerMs:((r=t.data)==null?void 0:r.ms)??null,gpuMB:+(n/1048576).toFixed(1),cpuMB:+(i/1048576).toFixed(1),nodes:t.terrain?t.terrain.full.count+t.terrain.half.count:0,features:((o=t.features)==null?void 0:o.stats())??null}}}const cv=`
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,hv=`
${Ie}
${xs}
${Ge}
${Gn}
${Xi}
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
  float shore = (1.0 - smoothstep(0.1, 1.4, depth)) * (1.0 - pond);
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
`;function uv(s,t,e,n){const i=[0,0,0];for(let a=0;a<=n;a++){const l=s*Math.pow(t/s,a/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;i.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const r=[];for(let a=0;a<e;a++)r.push(0,1+(a+1)%e,1+a);for(let a=0;a<n;a++)for(let l=0;l<e;l++){const c=1+a*e+l,h=1+a*e+(l+1)%e,d=c+e,f=h+e;r.push(c,h,d,h,f,d)}const o=new Ue;return o.setAttribute("position",new he(i,3)),o.setIndex(r),o}class fv{constructor(t,e){this.uniforms={...t.uniforms,...e,uCamPos:{value:new N},uWind:{value:new It(-.8,.45)},uSwellDir:{value:new It(-.6,.8)},uDebug:{value:0}},this.material=new fe({vertexShader:cv,fragmentShader:hv,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new le(uv(1,25e4,96,120),this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const dv=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],pv={ra:12.857,dec:27.13};function mv(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}const wn=Math.PI/180,ns=21*wn,Ks=29.530588,gv=224.1;function ql(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),r=Math.sin(s)*Math.cos(ns)-n*Math.cos(t)*Math.sin(ns),o=Math.sin(s)*Math.sin(ns)+n*Math.cos(t)*Math.cos(ns);return e.set(i,o,-r)}function vv(s,t,e={}){const n=23.44*wn*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*wn,o=((s-80)/365.25*24%24+24)%24+t-12;e.sun=ql(n,(t-12)*15*wn,e.sun||new N);const a=s+t/24,l=((a-gv)%Ks+Ks)%Ks,c=l/Ks,h=i+c*2*Math.PI,d=Math.asin(Math.sin(23.44*wn)*Math.sin(h)+Math.sin(5.1*wn)*Math.sin(a*.23)),f=h/(2*Math.PI)*24;return e.moon=ql(d,(o-f)*15*wn,e.moon||new N),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=o,e.decl=n,e}const nh=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],ih=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],xv=1.6110731556870734,_v=1.5;function Mv(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((xv-Math.acos(s))/_v)))}function oa(s,t,e,n=[0,0,0]){const i=Mv(t.y),r=.2*e.turbidity*1e-17,o=Math.acos(Math.max(0,s.y)),a=1/(Math.cos(o)+.15*Math.pow(93.885-o*180/Math.PI,-1.253)),l=8400*a,c=1250*a,h=s.x*t.x+s.y*t.y+s.z*t.z,d=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),f=e.mieDirectionalG,m=f*f,x=1/(4*Math.PI)*((1-m)/Math.pow(1-2*f*h+m,1.5)),g=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let p=0;p<3;p++){const u=nh[p]*e.rayleigh,v=.434*r*ih[p]*e.mieCoefficient,_=Math.exp(-(u*l+v*c)),w=(u*d+v*x)/(u+v);let b=Math.pow(i*w*(1-_),1.5);b*=1+(Math.pow(i*w*_,.5)-1)*g;const S=.1*_,T=(b+S)*.04+[0,3e-4,75e-5][p];n[p]=Math.pow(T,1/2.4)}return n}function yv(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),r=.2*t.turbidity*1e-17;for(let o=0;o<3;o++){const a=nh[o]*t.rayleigh,l=.434*r*ih[o]*t.mieCoefficient;e[o]=Math.exp(-(a*8400*i+l*1250*i))}return e}const wv=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,sh=`
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
`,Sv=`
${sh}
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
`,bv=`
${sh}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,Ev=`
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
`,Tv=`
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
`;class Av{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=pv,e=(c,h)=>{const d=c/24*2*Math.PI,f=h*wn;return new N(Math.cos(f)*Math.cos(d),Math.cos(f)*Math.sin(d),Math.sin(f))};this.uniforms={uSun:{value:new N(0,1,0)},uMoon:{value:new N(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:ns},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new le(new Ha(1,5),new fe({vertexShader:wv,fragmentShader:Sv,uniforms:this.uniforms,side:De,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=mv(4242),r=dv.map(([c,h,d])=>[c/24*2*Math.PI,h*wn,d]);for(let c=0;c<2600;c++){const h=i()*2-1;r.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const o=new Float32Array(r.length*3);r.forEach((c,h)=>o.set(c,h*3));const a=new Ue;a.setAttribute("aStar",new ue(o,3)),a.setAttribute("position",new ue(new Float32Array(r.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new tg(a,new fe({vertexShader:Ev,fragmentShader:Tv,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:pa})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new Oe,this.group.add(n,this.stars),this.mapRT=new dn(256,128,{type:kn,depthBuffer:!1}),this.mapRT.texture.wrapS=sr,this.mapScene=new wr;const l=new le(Va(),new fe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:bv,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new Mr(-1,1,1,-1,0,1),this.astro={},this._v=new N}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const r=vv(t,e,this.astro),o=r.sun,a=this.uniforms;a.uSun.value.copy(o),a.uMoon.value.copy(r.moon),a.uPhase.value=r.phase,a.uIllum.value=r.illum,a.uLst.value=r.lst/24*2*Math.PI;const l=Ce.smoothstep(-o.y,-.02,.2);a.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,d=oa(h.set(0,1,0),o,c),f=[0,0,0];for(let S=0;S<8;S++){const T=S/8*Math.PI*2,L=oa(h.set(Math.cos(T),.08,Math.sin(T)).normalize(),o,c);for(let M=0;M<3;M++)f[M]+=L[M]/8}const m=oa(h.set(o.x,.05,o.z).normalize(),o,c),x=yv(o,c),g=Ce.smoothstep(o.y,-.04,.06),p=3.2;i.sunColor.setRGB(x[0]*p*g,x[1]*p*g,x[2]*p*g);const u=[.0035,.005,.011],_=Ce.smoothstep(r.moon.y,-.02,.1)*r.illum*l;i.skyColor.setRGB(d[0]*.55+f[0]*.45+u[0]+.012*_,d[1]*.55+f[1]*.45+u[1]+.016*_,d[2]*.55+f[2]*.45+u[2]+.024*_);const w=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Ct(w,w,w),.35),i.zenith.setRGB(d[0],d[1],d[2]),i.horizon.setRGB(f[0]+u[0],f[1]+u[1],f[2]+u[2]),i.sunHorizon.setRGB(m[0],m[1],m[2]);const b=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,o.y)+i.skyColor.r)*b*1.1,(i.sunColor.g*Math.max(0,o.y)+i.skyColor.g)*b,(i.sunColor.b*Math.max(0,o.y)+i.skyColor.b)*b*.8),i.moonColor.setRGB(.05*_,.06*_,.085*_),i.moonDir.copy(r.moon),i.sunDir.copy(o),i.night=l,r}}const la=Math.PI*2,Rv=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,jl=s=>((s+Math.PI)%la+la)%la-Math.PI,Cv=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)};function Jn(s){return .6+.52*Cv(Math.log(40),Math.log(4500),Math.log(Math.max(1,s)))}class Lv{constructor(t,e,n){this.camera=t,this.dom=e,this.world=n,this.home=this.homeView();const i=this.home;this.state={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.goal={target:i.target.clone(),distance:i.distance,yaw:i.yaw,pitch:i.pitch,lift:0},this.flight=null,this.floor=0,this.minDistance=vh,this.maxDistance=to,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new eg,this._v=new N,this.bind()}homeView(t=innerWidth/Math.max(1,innerHeight)){const e=this.world.bounds,n=e.x1-e.x0,i=Math.tan(this.camera.fov*Math.PI/360),r=t<.85,o=r?1.2*Math.hypot(n,e.z1-e.z0)*.92/(2*i):1.2*n/(2*i*Math.max(1,t)),a=Math.min(to,o);return{target:new N((e.x0+e.x1)/2,0,(e.z0+e.z1)/2+(r?0:(e.z1-e.z0)*.04)),distance:a,yaw:r?1.1:0,pitch:Jn(a)}}bind(){const t=this.dom,e=new Map;let n=null,i=null,r=null;t.addEventListener("contextmenu",a=>a.preventDefault()),t.addEventListener("pointerdown",a=>{this.enabled&&(t.setPointerCapture(a.pointerId),e.set(a.pointerId,{x:a.clientX,y:a.clientY}),e.size===1?(n=a.button===2||a.shiftKey||a.ctrlKey||a.metaKey||a.altKey?"orbit":"pan",i={x:a.clientX,y:a.clientY}):e.size===2&&(n="pinch",r=this.pinchState(e)))}),t.addEventListener("pointermove",a=>{if(e.has(a.pointerId)){if(e.set(a.pointerId,{x:a.clientX,y:a.clientY}),n==="orbit"&&i){const l=a.clientX-i.x,c=a.clientY-i.y;this.goal.yaw-=l*.005,this.goal.pitch=Ce.clamp(this.goal.pitch+c*.004,.06,1.52),i={x:a.clientX,y:a.clientY},this.touch()}else if(n==="pan"&&i){const l=a.clientX-i.x,c=a.clientY-i.y;(l||c)&&(this.panBy(l,c),this.touch()),i={x:a.clientX,y:a.clientY}}else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=r.dist/Math.max(20,l.dist);this.zoomAt(l.cx,l.cy,c),this.panBy(l.cx-r.cx,l.cy-r.cy),this.goal.yaw-=jl(l.angle-r.angle),r=l,this.touch()}}});const o=a=>{if(e.delete(a.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="pan",i={...l}}};t.addEventListener("pointerup",o),t.addEventListener("pointercancel",o),t.addEventListener("wheel",a=>{if(!this.enabled)return;a.preventDefault();const l=a.deltaMode===1?a.deltaY*30:a.deltaY,c=Math.exp(Math.sign(l)*Math.min(Math.abs(l),150)*.0022);this.zoomAt(a.clientX,a.clientY,c),this.touch()},{passive:!1}),t.addEventListener("dblclick",a=>{const l=this.pickGround(a.clientX,a.clientY);if(l){const c=Math.max(this.minDistance,this.goal.distance*.35);this.flyTo({target:l,distance:c,pitch:this.goal.pitch+Jn(c)-Jn(this.goal.distance)},1.8)}}),addEventListener("keydown",a=>{var f,m;if(!this.enabled||(m=(f=a.target).closest)!=null&&m.call(f,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[a.code];if(c&&!a.altKey){const x=Math.sin(this.goal.yaw),g=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*g+c[1]*x)*l,this.goal.target.z+=(-c[0]*x+c[1]*g)*l,this.touch()}a.code==="KeyQ"&&(this.goal.yaw+=.12),a.code==="KeyE"&&(this.goal.yaw-=.12);const h=innerWidth/2,d=innerHeight/2;(a.code==="Equal"||a.code==="NumpadAdd")&&this.zoomAt(h,d,.8),(a.code==="Minus"||a.code==="NumpadSubtract")&&this.zoomAt(h,d,1.25)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,r=Math.sin(this.goal.yaw),o=Math.cos(this.goal.yaw),a=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*o-e*r*a)*i,this.goal.target.z+=(t*r-e*o*a)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),r=this.goal.distance,o=Ce.clamp(r*n,this.minDistance,this.maxDistance);if(i){const a=1-o/r;this.goal.target.x+=(i.x-this.goal.target.x)*a,this.goal.target.z+=(i.z-this.goal.target.z)*a}this.goal.pitch=Ce.clamp(this.goal.pitch+Jn(o)-Jn(r),.06,1.52),this.goal.distance=o}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new It((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e){const n=this.world,i=n.maxY+.05;if(e.y>=0&&t.y>i)return null;const r=e.y<0?t.y/-e.y:4e5;let o=t.y>i&&e.y<0?(t.y-i)/-e.y:0;const a=Math.min(r,4e5),l=this._v;let c=o;for(let h=0;h<700&&o<=a+.001;h++){l.copy(t).addScaledVector(e,o);const d=l.y-n.heightAt(l.x,l.z);if(d<0){let f=c,m=o;for(let x=0;x<24;x++){const g=(f+m)/2;l.copy(t).addScaledVector(e,g),l.y-n.heightAt(l.x,l.z)<0?m=g:f=g}return l.clone()}c=o,o+=Math.max(.02,d*.45,o*.0015)}return r<4e5?t.clone().addScaledVector(e,r).setY(0):null}fit({rect:t,distance:e,yaw:n=this.goal.yaw,tilt:i=0,pitch:r,box:o,pad:a=1.06}){const l=this._fitCam||(this._fitCam=new $e);l.fov=this.camera.fov,l.aspect=this.camera.aspect,l.near=.1,l.far=1e6,l.updateProjectionMatrix();const c=innerWidth,h=innerHeight,d=o||{x0:0,y0:0,x1:c,y1:h},f=Math.max(60,d.x1-d.x0),m=Math.max(60,d.y1-d.y0),x=Math.tan(l.fov*Math.PI/360),g=Math.cos(n),p=Math.sin(n);let u=(t.x0+t.x1)/2,v=(t.z0+t.z1)/2;const _=e!==void 0;let w=_?e:Math.max(t.x1-t.x0,t.z1-t.z0)/(2*x)*(h/m),b=0;const S=this._v;for(let T=0;T<8;T++){w=Ce.clamp(w,this.minDistance,this.maxDistance),b=Ce.clamp(r??Jn(w)+i,.06,1.52);const L=Math.cos(b),M=_?this.world.heightAt(u,v):0;l.position.set(u+w*L*p,M+w*Math.sin(b),v+w*L*g),l.lookAt(u,M,v),l.updateMatrixWorld();let y=1/0,P=1/0,C=-1/0,k=-1/0;for(let j=0;j<4;j++){S.set(j&1?t.x1:t.x0,M,j&2?t.z1:t.z0).project(l);const W=(S.x+1)/2*c,q=(1-S.y)/2*h;y=Math.min(y,W),C=Math.max(C,W),P=Math.min(P,q),k=Math.max(k,q)}_||(w*=Ce.clamp(Math.max((C-y)*a/f,(k-P)*a/m),.3,3));const D=2*w*x/h,F=((y+C)/2-(d.x0+d.x1)/2)*D,B=((P+k)/2-(d.y0+d.y1)/2)*D/Math.max(.35,Math.sin(b));u+=F*g+B*p,v+=-F*p+B*g}return{target:new N(u,this.world.heightAt(u,v),v),distance:w,yaw:n,pitch:b}}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift},r={target:t.target?t.target.clone():i.target.clone(),distance:Ce.clamp(t.distance??i.distance,this.minDistance,this.maxDistance),yaw:t.yaw??i.yaw,pitch:Ce.clamp(t.pitch??i.pitch,.06,1.52),lift:t.lift??0};r.yaw=i.yaw+jl(r.yaw-i.yaw);const o=Math.hypot(i.target.x-r.target.x,i.target.z-r.target.z),a=n.hop??Math.max(0,o*.9-Math.max(i.distance,r.distance)*.6);this.flight={from:i,dest:r,t:0,duration:e,hop:a,onDone:n.onDone,ready:n.ready,held:0}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,(e=t.onDone)==null||e.call(t),this.apply()}jump({x:t,z:e,distance:n,yaw:i,pitch:r}){this.flight=null;for(const o of[this.goal,this.state])t!==void 0&&o.target.set(t,this.world.heightAt(t,e),e),n!==void 0&&(o.distance=n),i!==void 0&&(o.yaw=i),r!==void 0&&(o.pitch=r),o.lift=0;this.apply()}update(t){var a;const e=this.goal;if(this.flight){const l=this.flight;let c=t/l.duration;l.ready&&l.t>.8&&l.held<6&&!l.ready()&&(l.held+=t,c*=.08),l.t=Math.min(1,l.t+c);const h=Rv(l.t);e.target.lerpVectors(l.from.target,l.dest.target,h);const d=Math.log(l.from.distance)*(1-h)+Math.log(l.dest.distance)*h;e.distance=Math.exp(d)+l.hop*Math.sin(Math.PI*h),e.yaw=l.from.yaw+(l.dest.yaw-l.from.yaw)*h,e.pitch=l.from.pitch+(l.dest.pitch-l.from.pitch)*h+.2*Math.sin(Math.PI*h)*Math.min(1,l.hop/300),e.pitch=Math.min(1.52,e.pitch),e.lift=l.from.lift+(l.dest.lift-l.from.lift)*h,l.t>=1&&(this.flight=null,(a=l.onDone)==null||a.call(l))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);const n=this.world.bounds,i=150;if(e.target.x=Ce.clamp(e.target.x,n.x0-i,n.x1+i),e.target.z=Ce.clamp(e.target.z,n.z0-i,n.z1+i),this.flight)e.target.y=Math.max(e.target.y,this.world.heightAt(e.target.x,e.target.z));else{const l=this.world.heightAt(e.target.x,e.target.z);e.target.y+=(l-e.target.y)*(1-Math.exp(-t*6))}const r=this.state,o=this.flight?1:1-Math.exp(-t*7);r.target.lerp(e.target,o),r.distance=Math.exp(Math.log(r.distance)+(Math.log(e.distance)-Math.log(r.distance))*o),r.yaw+=(e.yaw-r.yaw)*o,r.pitch+=(e.pitch-r.pitch)*o,r.lift+=(e.lift-r.lift)*o,this.apply(t)}groundAhead(t,e,n){const i=this.world;let r=i.heightAt(t,e);const o=this._prevXZ;if(o&&n>0){const a=(t-o.x)/n,l=(e-o.y)/n,c=Math.hypot(a,l),h=Math.min(20,c*.3);h>.005&&(r=Math.max(r,i.heightAt(t+a/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new It).set(t,e),r}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const r=.12+e.distance*.03,o=this.groundAhead(n.position.x,n.position.z,t),a=Math.max(0,o+r-n.position.y);t<=0?this.floor=a:this.floor+=(a-this.floor)*(1-Math.exp(-t*(a>this.floor?9:2.5))),n.position.y+=this.floor;const l=this.world.heightAt(n.position.x,n.position.z);n.position.y=Math.max(n.position.y,l+Math.min(.04,r*.3)),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const c=n.position.y-l;n.near=Ce.clamp(Math.min(c,e.distance)*.12,.02,300),n.far=Ce.clamp(e.distance*30+c*60,8e3,3e5),n.updateProjectionMatrix(),n.updateMatrixWorld()}}const Pv=1.5,Dv=`
${Ie}
${Ge}
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
`,Uv=`
uniform vec3 uColor;
uniform float uOpacity;
in float vFade;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vFade);
}
`;function Iv(s){return s?s.type==="Polygon"?s.coordinates:s.type==="MultiPolygon"?s.coordinates.flat():s.type==="LineString"?[s.coordinates]:s.type==="MultiLineString"?s.coordinates:[]:[]}function Nv(s,t){var r;const e=new Map,n=new Set,i=o=>Math.round(o*1e6);for(const o of(s==null?void 0:s.features)||[]){const a=tr((r=o.properties)==null?void 0:r.island)||"other";let l=e.get(a);l||e.set(a,l=[]);for(const c of Iv(o.geometry))for(let h=0;h+1<c.length;h++){const d=c[h],f=c[h+1],m=`${i(d[0])},${i(d[1])}`,x=`${i(f[0])},${i(f[1])}`;if(m===x)continue;const g=m<x?`${m}|${x}`:`${x}|${m}`;if(n.has(g))continue;n.add(g);const[p,u]=t.toWorld(d),[v,_]=t.toWorld(f),w=Math.max(1,Math.ceil(Math.hypot(v-p,_-u)/Pv));for(let b=0;b<w;b++){const S=b/w,T=(b+1)/w;l.push(p+(v-p)*S,u+(_-u)*S,p+(v-p)*T,u+(_-u)*T)}}}return e}class Yl{constructor(t,e,n,{color:i,width:r,order:o}){this.group=new Oe,this.uniforms={...n,uResolution:{value:new It(1,1)},uWidth:{value:r},uCamPos:{value:new N},uColor:{value:new Ct(...i)},uOpacity:{value:1}},this.material=new fe({vertexShader:Dv,fragmentShader:Uv,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});const a=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);this.count=0;for(const[,l]of Nv(t,e)){if(!l.length)continue;const c=new vs;c.setAttribute("position",new ue(a,3)),c.setIndex([0,2,1,1,2,3]);const h=new Float32Array(l);c.setAttribute("aSeg",new qe(h,4)),c.instanceCount=h.length/4,this.count+=c.instanceCount;let d=1/0,f=-1/0,m=1/0,x=-1/0;for(let u=0;u<h.length;u+=2)d=Math.min(d,h[u]),f=Math.max(f,h[u]),m=Math.min(m,h[u+1]),x=Math.max(x,h[u+1]);const g=new N((d+f)/2,60,(m+x)/2);c.boundingSphere=new Bn(g,Math.hypot(f-d,x-m,300)/2+10);const p=new le(c,this.material);p.renderOrder=o,this.group.add(p)}}update(t,e,n){this.uniforms.uResolution.value.copy(e),this.uniforms.uCamPos.value.copy(t.position),this.uniforms.uOpacity.value=n,this.group.visible=n>.01&&this.count>0}}class Fv{constructor(t,e){this.group=new Oe,this.moku=new Yl(t.moku,t.proj,e,{color:[1.5,1.08,.52],width:2.2,order:3}),this.ahupuaa=new Yl(t.ahupuaa,t.proj,e,{color:[1.25,1.2,1.06],width:1.3,order:2}),this.group.add(this.ahupuaa.group,this.moku.group),this.visible=!0,this._res=new It}update(t,e,n,i=1){e.getDrawingBufferSize(this._res);const r=e.getPixelRatio(),o=this.visible?1:0,a=(l,c,h)=>{const d=Math.max(0,Math.min(1,(h-l)/(c-l)));return d*d*(3-2*d)};this.moku.uniforms.uWidth.value=(1.3+1.1*(1-a(800,4e3,n)))*r,this.ahupuaa.uniforms.uWidth.value=1.25*r,this.moku.uniforms.uColor.value.setRGB(1.5*i,1.08*i,.52*i),this.ahupuaa.uniforms.uColor.value.setRGB(1.25*i,1.2*i,1.06*i),this.moku.update(t,this._res,o*(.55+.4*(1-a(1500,6e3,n)))),this.ahupuaa.update(t,this._res,o*.75*(1-a(220,650,n)))}}const zv=4,Kl=[300,1e3],Zl=[.4,.7],Ov=9,Jl={voyage:[1.38,1.18,.86],fleet:[1.6,.9,.52],ship:[1,1.1,1.26],trade:[1.15,1.1,.96],schematic:[1.25,1.18,1.02]},Ql={journal:{width:2,opacity:.92,pulse:1},narrative:{width:1.7,opacity:.82,pulse:.9},schematic:{width:1.4,opacity:.62,pulse:.45}},kv={day:0,month:0,year:0,decade:5,generation:12,century:50},ca=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Bv=`
${Ie}
${Ge}
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
`,Gv=`
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
`;function Hv(s){const t=s.when||{},e=(o,a)=>{const l=String(o??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!l)return null;const c=Number(l[1]);return l[2]?c+(Number(l[2])-1+(a?1:0))/12:c+(a?1:0)};let n=e(t.from,!1),i=e(t.to??t.from,!0);if(n===null&&i===null)return null;n===null&&(n=i-1),i===null&&(i=n+1);const r=kv[t.precision]??0;return r&&i-n<=1.01&&(n-=r,i+=r),[n,i]}async function Vv(s,t=console.warn){const e=s!=null&&s.abs?s.abs("routes.json"):new URL("routes.json",new URL((s==null?void 0:s.base)||"./data/",location.href)).href;try{const n=await fetch(e);if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.json();return Array.isArray(i)?i:Array.isArray(i==null?void 0:i.routes)?i.routes:[]}catch(n){return t(`${e}: ${n.message} (no routes)`),[]}}class Wv{constructor(t,e,n){this.route=t,this.span=Hv(t);const i=Ql[t.pointPrecision]?t.pointPrecision:"schematic";this.style=Ql[i],this.ret=t.direction==="return";const r=i==="schematic",o=new Set(t.schematicSegments||[]),a=(t.points||[]).map(_=>e.toWorld(_)),l=[],c=[];let h=0;for(let _=0;_+1<a.length;_++){const[w,b]=a[_],[S,T]=a[_+1],L=Math.hypot(S-w,T-b),M=Math.max(1,Math.ceil(L/zv)),y=r||o.has(_)?1:0;for(let P=0;P<M;P++){const C=P/M,k=(P+1)/M;l.push(w+(S-w)*C,b+(T-b)*C,w+(S-w)*k,b+(T-b)*k),c.push(h+L*C,h+L*k,y,0)}h+=L}this.total=h;const d=(_,w,b)=>{l.push(_[0],_[1],w[0],w[1]),c.push(b,b,0,1)};a.length>=2&&(d(a.at(-2),a.at(-1),h),this.ret&&d(a[1],a[0],0));const f=new vs;f.setAttribute("position",new ue(new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),3)),f.setIndex([0,2,1,1,2,3]);const m=new Float32Array(l);f.setAttribute("aSeg",new qe(m,4)),f.setAttribute("aInfo",new qe(new Float32Array(c),4)),f.instanceCount=m.length/4;let x=1/0,g=-1/0,p=1/0,u=-1/0;for(const[_,w]of a)x=Math.min(x,_),g=Math.max(g,_),p=Math.min(p,w),u=Math.max(u,w);f.boundingSphere=new Bn(new N((x+g)/2,60,(p+u)/2),Math.hypot(g-x,u-p,300)/2+20),this.geometry=f;const v=Jl[t.kind]||Jl.schematic;this.colour=v,this.uniforms={...n,uResolution:{value:new It(1,1)},uWidth:{value:this.style.width},uHead:{value:9},uCamPos:{value:new N},uColor:{value:new Ct(...v)},uOpacity:{value:0},uDashLen:{value:30},uMarch:{value:0},uPulse:{value:-1e6},uPulseLen:{value:60},uPulseK:{value:this.style.pulse}},this.material=new fe({vertexShader:Bv,fragmentShader:Gv,uniforms:this.uniforms,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),this.mesh=new le(f,this.material),this.mesh.renderOrder=4,this.mesh.visible=!1,this.k=0,this.phase=Xv(t.id||"")%1e3/1e3}dispose(){this.geometry.dispose(),this.material.dispose()}}function Xv(s){let t=2166136261;for(let e=0;e<s.length;e++)t=Math.imul(t^s.charCodeAt(e),16777619);return t>>>0}class $v{constructor({routes:t=[],proj:e,uniforms:n,camera:i,renderer:r,eras:o=[]}){this.proj=e,this.shared=n,this.camera=i,this.renderer=r,this.eras=[...o].filter(a=>Number.isFinite(a.year)).sort((a,l)=>a.year-l.year),this.group=new Oe,this.group.name="routes",this.lines=[],this.visible=!0,this._res=new It,this._last=null,this.setRoutes(t)}setRoutes(t){for(const e of this.lines)this.group.remove(e.mesh),e.dispose();this.lines=[];for(const e of t||[]){if(!Array.isArray(e.points)||e.points.length<2)continue;const n=new Wv(e,this.proj,this.shared);n.span&&(this.lines.push(n),this.group.add(n.mesh))}}windowAt(t){const e=this.eras;if(e.length<2)return[t-10,t+10];const n=r=>{if(r<=0)return e[0].year+r*(e[1].year-e[0].year);const o=e.length-1;if(r>=o)return e[o].year+(r-o)*(e[o].year-e[o-1].year);const a=Math.floor(r);return e[a].year+(r-a)*(e[a+1].year-e[a].year)};let i=0;if(t>=e.at(-1).year)i=e.length-1;else if(t>e[0].year){for(let r=0;r+1<e.length;r++)if(t<=e[r+1].year){i=r+(t-e[r].year)/Math.max(1e-6,e[r+1].year-e[r].year);break}}return[n(i-.5),n(i+.5)]}visibleRoutes(){return this.lines.filter(t=>t.k>.5&&t.mesh.visible).map(t=>t.route)}update(t,e,{window:n,light:i=1,fill:r=0,focus:o=null}={}){const a=performance.now()/1e3,l=this._last===null?1:Math.max(0,Math.min(.1,a-this._last));this._last=a,this.apply(t,e,{win:n,light:i,fill:r,focus:o},a,1-Math.exp(-l*4))}settle(t,e,{window:n,light:i=1,fill:r=0,focus:o=null}={}){this.apply(t,e,{win:n,light:i,fill:r,focus:o},performance.now()/1e3,1)}apply(t,e,{win:n,light:i,fill:r,focus:o},a,l){const[c,h]=n||this.windowAt(t);this.renderer.getDrawingBufferSize(this._res);const d=this.renderer.getPixelRatio(),f=this.visible?ca(Kl[0],Kl[1],e):0,m=1-ca(Zl[0],Zl[1],r),x=1-ca(800,4e3,e);for(const g of this.lines){const[p,u]=g.span,v=u>=c&&p<=h?1:0;g.k+=(v-g.k)*l,Math.abs(v-g.k)<.003&&(g.k=v);const _=t>=p&&t<=u?1:.55,w=o!==null&&g.route.event===o,b=g.style.opacity*g.k*f*(w?1:m)*_;if(g.mesh.visible=b>.01,!g.mesh.visible)continue;const S=g.uniforms;S.uResolution.value.copy(this._res),S.uCamPos.value.copy(this.camera.position),S.uWidth.value=(g.style.width+.6*x)*d,S.uHead.value=(8+3*x)*d,S.uOpacity.value=b,S.uColor.value.setRGB(g.colour[0]*i,g.colour[1]*i,g.colour[2]*i),S.uDashLen.value=e*.016,S.uPulseLen.value=Math.min(g.total*.12,e*.035);const T=(a/Ov+g.phase)%1;S.uPulse.value=g.ret?(T<.5?T*2:2-T*2)*g.total:T*g.total,S.uMarch.value=g.ret?0:a*e*.012%(e*.016)}}dispose(){for(const t of this.lines)t.dispose();this.lines=[],this.group.clear()}}const Zs=s=>String(s||"").normalize("NFD").replace(/[̀-ͯʻʼ'‘’]/g,"").toLowerCase();function qv(s,t,e,n,i,r){const o=t/(n.x1-n.x0),a=e/(n.z1-n.z0),l=[];let c=1/0,h=-1/0;for(const g of i)for(let p=0;p+1<g.length;p++){const u=(g[p][0]-n.x0)*o,v=(g[p][1]-n.z0)*a,_=(g[p+1][0]-n.x0)*o,w=(g[p+1][1]-n.z0)*a;v!==w&&(l.push(v<w?[v,u,w,_]:[w,_,v,u]),c=Math.min(c,v,w),h=Math.max(h,v,w))}if(!l.length)return;l.sort((g,p)=>g[0]-p[0]);const d=[],f=Math.max(0,Math.floor(c)),m=Math.min(e-1,Math.ceil(h));let x=0;for(let g=f;g<=m;g++){const p=g+.5;for(d.length=0;x<l.length&&l[x][2]<=p&&l[x][0]<=p;)x++;for(let v=x;v<l.length;v++){const _=l[v];if(_[0]>p)break;_[2]<=p||d.push(_[1]+(p-_[0])/(_[2]-_[0])*(_[3]-_[1]))}d.sort((v,_)=>v-_);const u=g*t;for(let v=0;v+1<d.length;v+=2){const _=Math.max(0,Math.ceil(d[v]-.5)),w=Math.min(t-1,Math.floor(d[v+1]-.5));for(let b=_;b<=w;b++)s[u+b]=r}}}class jv{constructor(t,e,n,i=console.warn){var d,f;this.data=t,this.rect=e,this.uniforms=n,this.polities=new Map((t.polities.polities||[]).map(m=>[m.id,m]));const r=(((d=t.moku)==null?void 0:d.features)||[]).slice(0,255);(((f=t.moku)==null?void 0:f.features)||[]).length>255&&i("more than 255 moku: the overlay shows the first 255");const o=e.x1-e.x0,a=e.z1-e.z0,l=Math.min(4096,Math.ceil(Math.max(o,a)/1.5));this.W=Math.round(o>=a?l:l*o/a),this.H=Math.round(o>=a?l*a/o:l),this.grid=new Uint8Array(this.W*this.H),this.mokus=[null],r.forEach((m,x)=>{const g=m.properties||{},p=g.name??g.moku??"",u=g.islandId||tr(g.island),v=m.geometry,_=(v==null?void 0:v.type)==="Polygon"?[v.coordinates]:(v==null?void 0:v.type)==="MultiPolygon"?v.coordinates:[];for(const w of _)qv(this.grid,this.W,this.H,e,w.map(b=>b.map(S=>t.proj.toWorld(S))),x+1);this.mokus.push({index:x+1,name:p,island:g.island,islandKey:u,key:g.mokuKey||`${u}:${p}`,props:g})}),this.loose=new Map(this.mokus.slice(1).map(m=>[`${m.islandKey}:${Zs(m.name)}`,m])),this.checkKeys(i);const c=new Rn(this.grid,this.W,this.H,vr,Me);c.minFilter=ne,c.magFilter=ne,c.unpackAlignment=1,c.needsUpdate=!0,this.idTex=c,this.palette=new Uint8Array(256*2*4);const h=new Rn(this.palette,256,2,_e,Me);h.minFilter=ne,h.magFilter=ne,h.needsUpdate=!0,this.palTex=h,n.uMokuId.value=c,n.uMokuRect.value.set(e.x0,e.z0,e.x1,e.z1),n.uPalette.value=h,this.eraKeys=[null,null]}checkKeys(t){const e=new Set(this.mokus.slice(1).map(i=>i.key)),n=new Set;for(const[i,r]of Object.entries(this.data.polities.byEra||{}))for(const o of Object.keys(r)){if(e.has(o))continue;const[a,...l]=o.split(":"),c=this.loose.get(`${tr(a)}:${Zs(l.join(":"))}`);n.add(c?`${o} (${i}; the boundary file spells it "${c.name}")`:`${o} (${i})`)}n.size&&t(`polities.json names moku the boundary file doesn't have: ${[...n].slice(0,12).join(", ")}${n.size>12?", …":""}`)}holder(t,e){var r;const n=t?(r=this.data.polities.byEra)==null?void 0:r[t.id]:null;if(!n)return null;let i=n[e.key];if(i===void 0)for(const[o,a]of Object.entries(n)){const[l,...c]=o.split(":");if(tr(l)===e.islandKey&&Zs(c.join(":"))===Zs(e.name)){i=a;break}}return i?this.polities.get(i)||{id:i,name:i,colour:"#cccccc"}:null}setEras(t,e,n){const i=(t==null?void 0:t.id)??null,r=(e==null?void 0:e.id)??null;if(i!==this.eraKeys[0]||r!==this.eraKeys[1]){this.eraKeys=[i,r];const a=new Ct;this.palette.fill(0);for(const[l,c]of[[0,t],[1,e]])for(const h of this.mokus.slice(1)){const d=this.holder(c,h);if(!d)continue;a.set(d.colour||"#cccccc");const f=(l*256+h.index)*4;this.palette[f]=Math.round(a.r*255),this.palette[f+1]=Math.round(a.g*255),this.palette[f+2]=Math.round(a.b*255),this.palette[f+3]=255}this.palTex.needsUpdate=!0}const o=Math.max(0,Math.min(1,(n-.35)/.3));this.uniforms.uEraMix.value=t===e?0:o*o*(3-2*o)}mokuAt(t,e){const n=this.rect,i=Math.floor((t-n.x0)/(n.x1-n.x0)*this.W),r=Math.floor((e-n.z0)/(n.z1-n.z0)*this.H);return i<0||r<0||i>=this.W||r>=this.H?null:this.mokus[this.grid[r*this.W+i]]||null}politiesIn(t){const e=new Map;for(const n of this.mokus.slice(1)){const i=this.holder(t,n);i&&e.set(i.id,i)}return[...e.values()]}}function rh(s=2,t=5e4){const e=Math.log(1+t/s),n=new Float32Array(256);for(let i=0;i<256;i++)n[i]=s*(Math.exp(i/255*e)-1);return{lut:n,decode:i=>s*(Math.exp(i/255*e)-1),encode:i=>Math.max(0,Math.min(255,Math.round(255*Math.log(1+Math.max(0,i)/s)/e)))}}const Yv=s=>Math.max(1,Math.round(60/Math.max(1,s)));async function ha(s,t){const{arch:e}=s,n=rh(s.d0,s.dMax),i=e.W,r=e.H,o=e.rect,a=s.islands,l=new Int8Array(i*r).fill(-1),c=(o.x1-o.x0)/i,h=(o.z1-o.z0)/r;for(let g=0;g<r;g++){const p=o.z0+(g+.5)*h;for(let u=0;u<i;u++){const v=o.x0+(u+.5)*c;let _=0,w=-1;for(let b=0;b<a.length;b++){const S=a[b].rect,T=Math.min(v-S.x0,S.x1-v,p-S.z0,S.z1-p);T>_&&(_=T,w=b)}l[g*i+u]=w}}const d=new Float32Array(i*r*3),f=new Float32Array(i*r),m={kf:s.kf,arch:null,islands:[]};for(let g=0;g<a.length;g++){const p=a[g],{W:u,H:v}=p,[_,w,b]=await Promise.all(["cultivation","settlement","forest"].map(C=>Kv(p.layers[C],u,v,t,`${p.id} ${C}`))),S=p.land&&p.land.length===u*v?p.land:null,T=p.rect,L=(T.x1-T.x0)/u,M=(T.z1-T.z0)/v,y=new Int32Array(u);for(let C=0;C<u;C++)y[C]=Math.floor((T.x0+(C+.5)*L-o.x0)/c);for(let C=0;C<v;C++){const k=Math.floor((T.z0+(C+.5)*M-o.z0)/h);if(k<0||k>=r)continue;const D=C*u;for(let F=0;F<u;F++){const B=y[F];if(B<0||B>=i)continue;const j=k*i+B;if(l[j]!==g)continue;const W=D+F;S&&!S[W]||(d[j*3]+=_[W],d[j*3+1]+=n.lut[w[W]],d[j*3+2]+=b[W],f[j]++)}}const P=Math.max(1,p.f||1);if(P===1){const C=new Uint8Array(u*v*4);for(let k=0;k<u*v;k++)C[k*4]=_[k],C[k*4+1]=w[k],C[k*4+2]=b[k],C[k*4+3]=255;S&&ua(C,u,v,S,2),m.islands.push({id:p.id,W:u,H:v,data:C})}else{const C=Math.max(1,Math.round(u/P)),k=Math.max(1,Math.round(v/P)),D=new Float32Array(C*k*3),F=new Float32Array(C*k),B=new Int32Array(u);for(let W=0;W<u;W++)B[W]=Math.min(C-1,Math.floor((W+.5)*C/u));for(let W=0;W<v;W++){const q=Math.min(k-1,Math.floor((W+.5)*k/v))*C;for(let Q=0;Q<u;Q++){const tt=W*u+Q;if(S&&!S[tt])continue;const ut=q+B[Q];D[ut*3]+=_[tt],D[ut*3+1]+=n.lut[w[tt]],D[ut*3+2]+=b[tt],F[ut]++}}const j=tc(D,F,C*k,n);ua(j,C,k,F,2),m.islands.push({id:p.id,W:C,H:k,data:j})}}const x=tc(d,f,i*r,n);return ua(x,i,r,f,3),m.arch={W:i,H:r,data:x},m}function ua(s,t,e,n,i){let r=Uint8Array.from(n,o=>o?1:0);for(let o=0;o<i;o++){const a=r.slice();for(let l=0;l<e;l++)for(let c=0;c<t;c++){const h=l*t+c;if(r[h])continue;let d=0,f=0,m=0,x=0;const g=p=>{r[p]&&(d++,f+=s[p*4],m+=s[p*4+1],x+=s[p*4+2])};c>0&&g(h-1),c<t-1&&g(h+1),l>0&&g(h-t),l<e-1&&g(h+t),d&&(s[h*4]=Math.round(f/d),s[h*4+1]=Math.round(m/d),s[h*4+2]=Math.round(x/d),a[h]=1)}r=a}}function tc(s,t,e,n){const i=new Uint8Array(e*4);for(let r=0;r<e;r++){const o=t[r];i[r*4+3]=255,o&&(i[r*4]=Math.round(s[r*3]/o),i[r*4+1]=n.encode(s[r*3+1]/o),i[r*4+2]=Math.round(s[r*3+2]/o))}return i}async function Kv(s,t,e,n,i){if(!s)return new Uint8Array(t*e);if(typeof s=="string")return fa(await n(s),t,e,s);const[r,o]=await Promise.all([n(s.from),n(s.to)]),a=fa(r,t,e,s.from),l=fa(o,t,e,s.to),c=s.t,h=new Uint8Array(t*e);for(let d=0;d<t*e;d++)h[d]=Math.round(a[d]+(l[d]-a[d])*c);return h}function fa(s,t,e,n){if(s.W!==t||s.H!==e)throw new Error(`${n} is ${s.W}×${s.H}, the pack is ${t}×${e}`);return s.px}async function ec(s,t){const{px:e,W:n,H:i}=await s(t),r=new Uint8Array(n*i);for(let o=0,a=0;o<n*i;o++,a+=4)r[o]=e[a];return{px:r,W:n,H:i}}const nc=["cultivation","settlement","forest"],Zv={cultivation:"Cultivation",settlement:"Settlement",forest:"Native forest"},ts=[1100,1450],Jv=3,Js=.002,Qv=10,Ci=(s,t,e)=>Math.max(t,Math.min(e,s)),ic=(s,t,e)=>{const n=Ci((e-s)/(t-s),0,1);return n*n*(3-2*n)};function tx(){const s=new Rn(new Uint8Array([0,0,0,255]),1,1,_e,Me);return s.needsUpdate=!0,s}function ex(s){var n;const t=(n=s.data)==null?void 0:n.metres;if(!t)return null;const e=new Uint8Array(t.length);for(let i=0;i<t.length;i++)e[i]=t[i]>0?1:0;return e}function sc(s,t,e,n){const i=new Rn(s,t,e,_e,Me);return i.minFilter=ai,i.magFilter=be,i.generateMipmaps=!0,i.anisotropy=n,i.wrapS=i.wrapT=ze,i.needsUpdate=!0,i.onUpdate=()=>{i.image.data=null,i.onUpdate=null},i}class nx{constructor(t){this.app=t,this.data=t.data,this.warn=t.warn,this.blank=tx();const e=t.shared.uniforms;Object.assign(e,{uArchLandA:{value:this.blank},uArchLandB:{value:this.blank},uLandT:{value:0},uLandK:{value:0},uLandEarly:{value:1}}),this.uniforms=e,this.available=null,this.manifest=null,this.keyframes=[],this.resident=new Map,this.loading=new Map,this.bound=null,this.swapTo=null,this.kpShown=0,this.fade=0,this.fadeGoal=0,this.listeners=[],this.chain=Promise.resolve(),this.jobN=0,this.uploads=[]}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}async load(){var o;const t=this.data.abs("layers/manifest.json");let e;try{const a=await fetch(t);if(!a.ok)throw new Error(`HTTP ${a.status}`);if(e=await a.json(),!Array.isArray(e==null?void 0:e.keyframes)||!e.keyframes.length||!e.islands)throw new Error("no keyframes or islands")}catch(a){this.available=!1,this.warn(`${t}: ${a.message} (no land layers)`),this.notify();return}this.manifest=e,this.keyframes=[...e.keyframes].filter(a=>Number.isFinite(a.year)).sort((a,l)=>a.year-l.year),this.kfIndex=new Map(this.keyframes.map((a,l)=>[a.id,l]));const n=((o=e.encoding)==null?void 0:o.settlement)||{};this.codec=rh(n.d0??2,n.dMax??5e4);const i=this.app.world;this.islands=i.islandPacks.filter(a=>e.islands[a.id]).map(a=>({pack:a,entry:e.islands[a.id]}));const r=i.archPack;this.arch={W:Math.max(1,Math.round(r.W/2)),H:Math.max(1,Math.round(r.H/2)),rect:r.rect},this.eraYears=this.app.timeline.eras.map(a=>this.eraYear(a)),this.available=!0,this.notify()}eraYear(t){var i,r;const e=(r=(i=this.manifest.eras)==null?void 0:i[t.id])==null?void 0:r.cultivation,n=o=>{var a;return(a=this.keyframes[this.kfIndex.get(o)])==null?void 0:a.year};return e!=null&&e.keyframe&&n(e.keyframe)!==void 0?n(e.keyframe):e!=null&&e.from&&n(e.from)!==void 0&&n(e.to)!==void 0?n(e.from)+(n(e.to)-n(e.from))*(e.t??0):t.year}kpAtYear(t){const e=this.keyframes;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}position(t=this.app.timeline.s){const e=this.eraYears;if(!(e!=null&&e.length))return 0;const n=Ci(t,0,e.length-1),i=Math.min(e.length-2,Math.floor(n));return i<0?this.kpAtYear(e[0]):this.kpAtYear(e[i]+(e[i+1]-e[i])*(n-i))}bracket(t){const e=this.keyframes.length,n=a=>this.keyframes[a].id;if(e<2)return{a:n(0),b:n(0),t:0,need:[n(0)]};const i=Ci(Math.floor(t),0,e-2),r=Ci(t-i,0,1),o=r<Js?[n(i)]:r>1-Js?[n(i+1)]:[n(i),n(i+1)];return{a:n(i),b:n(i+1),t:r,need:o}}covers(t,e){return t?e>=this.kfIndex.get(t.a)-Js&&e<=this.kfIndex.get(t.b)+Js:!1}clampTo(t,e){return Ci(e,this.kfIndex.get(t.a),this.kfIndex.get(t.b))}job(t){var a;const e=this.keyframes,n=this.kfIndex.get(t),i=l=>this.data.abs(`layers/${l}`),r=(l,c)=>{const h=m=>{var x,g,p;return(p=(g=(x=l.layers)==null?void 0:x[e[m].id])==null?void 0:g[c])==null?void 0:p.file};if(h(n))return i(h(n));let d=n-1;for(;d>=0&&!h(d);)d--;let f=n+1;for(;f<e.length&&!h(f);)f++;return d>=0&&f<e.length?{from:i(h(d)),to:i(h(f)),t:(e[n].year-e[d].year)/(e[f].year-e[d].year)}:d>=0?i(h(d)):f<e.length?i(h(f)):null},o=((a=this.manifest.encoding)==null?void 0:a.settlement)||{};return{kf:t,d0:o.d0??2,dMax:o.dMax??5e4,arch:this.arch,islands:this.islands.map(({pack:l,entry:c})=>({id:l.id,W:l.W,H:l.H,f:Yv(Math.max(l.mx,l.mz)),rect:l.rect,land:ex(l),layers:Object.fromEntries(nc.map(h=>[h,r(c,h)]))}))}}request(t){const e=this.chain=this.chain.catch(()=>{}).then(()=>{if(!this.wanted(t))return null;const n=performance.now();return this.run(this.job(t)).then(i=>{this.arrive(i),this.lastBakeMs=Math.round(performance.now()-n)})}).catch(n=>this.warn(`land layers ${t}: ${n.message}`)).finally(()=>{this.loading.delete(t)});return this.loading.set(t,e),e}wanted(t){var n,i;const e=this.bracket(this.position());return this.bound&&this.app.view!=="land"?!1:e.need.includes(t)||((n=this.swapTo)==null?void 0:n.a)===t||((i=this.swapTo)==null?void 0:i.b)===t}run(t){const e=n=>ec(ni,n);if(!this.fallback&&!this.worker)try{this.worker=new Worker(new URL(""+new URL("layers-worker-OijIdfIP.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.onmessage=n=>this.reply(n.data),this.worker.onerror=n=>{var r;(r=n.preventDefault)==null||r.call(n),this.fallback=!0;const i=this.pending;this.pending=null,i&&ha(i.job,e).then(i.resolve,i.reject)}}catch{this.fallback=!0}return this.fallback?ha(t,e):new Promise((n,i)=>{const r=++this.jobN;this.pending={id:r,job:t,resolve:n,reject:i},this.worker.postMessage({...t,job:r})})}reply(t){const e=this.pending;!e||t.job!==e.id||(this.pending=null,t.ok?e.resolve(t.out):/OffscreenCanvas|getContext|createImageBitmap/i.test(t.message)?(this.fallback=!0,ha(e.job,n=>ec(ni,n)).then(e.resolve,e.reject)):e.reject(new Error(t.message)))}arrive(t){const e=Math.min(4,this.app.renderer.capabilities.getMaxAnisotropy()),n={id:t.kf,arch:sc(t.arch.data,t.arch.W,t.arch.H,e),archData:t.arch.data,islands:new Map(t.islands.map(i=>[i.id,sc(i.data,i.W,i.H,e)])),texels:t.arch.W*t.arch.H+t.islands.reduce((i,r)=>i+r.W*r.H,0),used:performance.now()};this.resident.set(t.kf,n),this.uploads.push(n.arch,...n.islands.values())}dropUnused(){var n,i,r,o;const t=performance.now(),e=new Set([(n=this.bound)==null?void 0:n.a,(i=this.bound)==null?void 0:i.b,(r=this.swapTo)==null?void 0:r.a,(o=this.swapTo)==null?void 0:o.b,...this.bracket(this.position()).need]);for(const[a,l]of this.resident){if(e.has(a)){l.used=t;continue}if(this.resident.size>Jv||t-l.used>Qv*1e3){l.arch.dispose();for(const c of l.islands.values())c.dispose();this.resident.delete(a),this.uploads=this.uploads.filter(c=>c!==l.arch&&![...l.islands.values()].includes(c))}}}resolve(t){const e=this.resident.has(t.a)?t.a:t.b;return{a:e,b:this.resident.has(t.b)?t.b:e}}bind(t){const{a:e,b:n}=this.resolve(t);this.bound={a:e,b:n};const i=this.resident.get(e),r=this.resident.get(n),o=this.uniforms;o.uArchLandA.value=i.arch,o.uArchLandB.value=r.arch;for(const a of this.app.world.islands)this.attach(a);this.notify()}attach(t){const e=t.uniforms;if(!e.uOwnLandA)return;const n=this.bound&&this.resident.get(this.bound.a),i=this.bound&&this.resident.get(this.bound.b);e.uOwnLandA.value=(n==null?void 0:n.islands.get(t.pack.id))||this.blank,e.uOwnLandB.value=(i==null?void 0:i.islands.get(t.pack.id))||this.blank}update(t,e){const n=this.uniforms;if(n.uLandEarly.value=ic(ts[0],ts[1],this.app.timeline.year),!this.available){n.uLandK.value=0;return}const i=this.position(),r=this.bracket(i);if(this.app.view==="land"||e>.001||!this.bound)for(const c of r.need)!this.resident.has(c)&&!this.loading.has(c)&&this.request(c);const a=r.need.every(c=>this.resident.has(c));if(a&&!this.swapTo&&!this.covers(this.bound,i)&&(!this.bound||this.fade<.02?(this.bind(r),this.kpShown=this.clampTo(this.bound,i)):this.covers(this.resolve(r),this.kpShown)?this.bind(r):this.swapTo=r),this.swapTo?(this.fadeGoal=0,this.fade<.02&&(this.bind(a?r:this.swapTo),this.swapTo=null,this.kpShown=this.clampTo(this.bound,i))):this.fadeGoal=this.bound?1:0,this.bound){const c=this.clampTo(this.bound,i);this.kpShown+=(c-this.kpShown)*(1-Math.exp(-t*8)),Math.abs(c-this.kpShown)<1e-4&&(this.kpShown=c)}this.fade+=(this.fadeGoal-this.fade)*(1-Math.exp(-t*6)),Math.abs(this.fadeGoal-this.fade)<.003&&(this.fade=this.fadeGoal),this.apply(e),this.dropUnused();const l=this.uploads.shift();l!=null&&l.image.data&&this.app.renderer.initTexture(l)}apply(t){const e=this.uniforms;if(this.bound){const n=this.kfIndex.get(this.bound.a),i=this.kfIndex.get(this.bound.b);e.uLandT.value=i>n?Ci((this.kpShown-n)/(i-n),0,1):0}e.uLandK.value=t*this.fade}settle(t){if(!this.available)return;const e=this.position(),n=this.bracket(e);n.need.every(i=>this.resident.has(i))&&!this.covers(this.bound,e)&&this.bind(n),this.swapTo=null,this.bound&&(this.kpShown=this.clampTo(this.bound,e)),this.fade=this.fadeGoal=this.bound?1:0,this.uniforms.uLandEarly.value=ic(ts[0],ts[1],this.app.timeline.year),this.apply(t)}get ready(){return!!this.available&&this.covers(this.bound,this.position())&&!this.swapTo&&this.fade>.99}describe(){if(!this.available)return null;const{a:t,b:e,need:n}=this.bracket(this.position()),i=this.keyframes,r=(c,h)=>{var x,g,p,u,v,_,w,b,S,T;const d=this.kfIndex.get(c),f=(p=(g=(x=this.manifest.methods)==null?void 0:x[c])==null?void 0:g[h])==null?void 0:p.method;if(f||(u=i[d].layers)!=null&&u.includes(h))return f?[f]:[];const m=[];for(let L=d-1;L>=0;L--){const M=(w=(_=(v=this.manifest.methods)==null?void 0:v[i[L].id])==null?void 0:_[h])==null?void 0:w.method;if(M){m.push(M);break}}for(let L=d+1;L<i.length;L++){const M=(T=(S=(b=this.manifest.methods)==null?void 0:b[i[L].id])==null?void 0:S[h])==null?void 0:T.method;if(M){m.push(M);break}}return m},o=nc.map(c=>{const h=n.flatMap(f=>r(f,c)),d=h.includes("modelled")?"modelled":h.includes("mixed")?"partly modelled":"";return{id:c,name:Zv[c],note:d}}),a=c=>i[this.kfIndex.get(c)].year;return{years:n.length>1?[a(t),a(e)]:[a(n[0])],layers:o,early:this.app.timeline.year<ts[1]}}valuesAt(t,e){if(!this.bound)return null;const n=this.resident.get(this.bound.a),i=this.resident.get(this.bound.b);if(!n||!i)return null;const{W:r,H:o,rect:a}=this.arch,l=Math.floor((t-a.x0)/(a.x1-a.x0)*r),c=Math.floor((e-a.z0)/(a.z1-a.z0)*o);if(l<0||c<0||l>=r||c>=o)return null;const h=(c*r+l)*4,d=this.uniforms.uLandT.value,f=m=>n.archData[h+m]+(i.archData[h+m]-n.archData[h+m])*d;return{cultivation:f(0)/255,people:this.codec.decode(f(1)),forest:f(2)/255}}stats(){let t=0,e=0;for(const n of this.resident.values())t+=n.texels,e+=n.archData.byteLength;return{available:this.available,resident:[...this.resident.keys()],bound:this.bound?`${this.bound.a}/${this.bound.b}`:null,t:+this.uniforms.uLandT.value.toFixed(3),k:+this.uniforms.uLandK.value.toFixed(3),gpuMB:+(t*4*4/3/1048576).toFixed(1),cpuMB:+(e/1048576).toFixed(1),bakeMs:this.lastBakeMs??null}}dispose(){var t;for(const e of this.resident.values()){e.arch.dispose();for(const n of e.islands.values())n.dispose()}this.resident.clear(),(t=this.worker)==null||t.terminate()}}function fr(s,t=!1){if(s==null)return null;if(typeof s=="number")return s+(t?1:0);const e=String(s).match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!e)return null;const n=Number(e[1]);if(e[2]){const i=Number(e[2])-1+(t?1:0);return n+i/12}return n+(t?1:0)}const ix={day:0,month:0,year:0,decade:5,generation:12,century:50};function Ca(s){const t=s.when||{};let e=fr(t.from),n=fr(t.to??t.from,!0);if(e===null&&n===null)return null;e===null&&(e=n-1),n===null&&(n=e+1);const i=ix[t.precision]??0;return i&&n-e<=1.01&&(e-=i,n+=i),[e,n]}function dr(s){const t=s.when||{};return fr(t.from)??fr(t.to)}const ah=["generation","century","decade"];function oh(s){var e;const t=dr(s);return t===null?"":fs(Math.floor(t),ah.includes((e=s.when)==null?void 0:e.precision)?10:1)}function sx(s){const t=s.when||{},e=i=>{const r=String(i??"").match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);if(!r)return String(i??"");const o=["January","February","March","April","May","June","July","August","September","October","November","December"],a=Number(r[1]),l=a<0?`${-a} BCE`:String(a);return r[3]?`${Number(r[3])} ${o[Number(r[2])-1]} ${l}`:r[2]?`${o[Number(r[2])-1]} ${l}`:l},n=ah.includes(t.precision)?"c. ":"";return!t.to||t.to===t.from?`${n}${e(t.from)}`:`${n}${e(t.from)} – ${e(t.to)}`}class rx{constructor(t){this.eras=[...t].filter(e=>Number.isFinite(e.year)).sort((e,n)=>e.year-n.year),this.s=0,this.listeners=[]}get n(){return this.eras.length}get max(){return Math.max(0,this.n-1)}yearAt(t){const e=this.eras;if(!e.length)return 1800;if(e.length===1)return e[0].year+t*50;if(t<=0)return e[0].year+t*(e[1].year-e[0].year);if(t>=e.length-1)return e[e.length-1].year+(t-e.length+1)*(e[e.length-1].year-e[e.length-2].year);const n=Math.floor(t);return e[n].year+(t-n)*(e[n+1].year-e[n].year)}sAtYear(t){const e=this.eras;if(e.length<2||t<=e[0].year)return 0;for(let n=0;n+1<e.length;n++)if(t<=e[n+1].year)return n+(t-e[n].year)/Math.max(1e-6,e[n+1].year-e[n].year);return e.length-1}get year(){return this.yearAt(this.s)}get era(){return this.eras[Math.round(Math.max(0,Math.min(this.max,this.s)))]||null}get pair(){const t=Math.max(0,Math.min(this.max,this.s)),e=Math.floor(t),n=Math.min(this.max,e+1);return{a:this.eras[e],b:this.eras[n],t:t-e}}get window(){return[this.yearAt(this.s-.5),this.yearAt(this.s+.5)]}set(t){const e=Math.max(0,Math.min(this.max,t));if(e!==this.s){this.s=e;for(const n of this.listeners)n(this)}}setYear(t){this.set(this.sAtYear(t))}onChange(t){this.listeners.push(t)}}function fs(s,t=1){const e=Math.round(s),n=e<0?`${-e} BCE`:String(e);return t>=10?`c. ${n}`:n}const lh=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},pr=s=>lh(260,900,s),La=s=>lh(90,300,s);class ax{constructor(t,e,{warn:n=console.warn}={}){this.canvas=t,this.data=e,this.warn=n,this.params=new URLSearchParams(location.search);const i=new $c({canvas:t,antialias:!1,powerPreference:"high-performance"});i.setClearColor(0,1),i.info.autoReset=!1,this.renderer=i,this.pipeline=new ug(i),this.scene=new wr,this.camera=new $e(42,1,.1,9e3),this.light={sunDir:new N(0,1,0),sunColor:new Ct,skyColor:new Ct,groundColor:new Ct,moonDir:new N(0,-1,0),moonColor:new Ct,zenith:new Ct,horizon:new Ct,sunHorizon:new Ct,night:0},this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uSkyMap:{value:null},uMokuId:{value:null},uMokuRect:{value:new Zt(0,0,1,1)},uPalette:{value:null},uEraMix:{value:0},uPolityK:{value:0},uHoverMoku:{value:0}}},this.world=new pg(this,e),Object.assign(this.shared.uniforms,this.world.uniforms),this.world.uniforms=this.shared.uniforms,this.timeline=new rx(e.eras),this.polity=new jv(e,this.world.archPack.rect,this.shared.uniforms,n),this.land=new nx(this),this.overlay={lines:!0,pins:!0,routes:!0};const r=this.params.get("view");this.view=r==="land"?"land":r==="none"?null:"chiefdoms",this.viewChosen=r==="land"||r==="chiefdoms"||r==="none",this.viewListeners=[],this.polityK=0,this.landK=0,this.sky=new Av,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??15.6)},this.time=0,this.frames=0,this.updaters=[]}start(){this.world.setArchipelago(this.world.archPack),this.scene.add(this.world.group),this.districts=new lv(this),this.world.district=this.districts,this.ocean=new fv(this.shared,this.shared.uniforms),this.scene.add(this.ocean.mesh),this.lines=new Fv(this.data,this.shared.uniforms),this.scene.add(this.lines.group),this.routes=new $v({proj:this.data.proj,uniforms:this.shared.uniforms,camera:this.camera,renderer:this.renderer,eras:this.data.eras}),this.scene.add(this.routes.group),Vv(this.data,this.warn).then(o=>this.routes.setRoutes(o)),this.rig=new Lv(this.camera,this.canvas,this.world);const t=this.params.get("cam");if(t){const[o,a,l,c,h]=t.split(",").map(Number);this.rig.jump({x:o,z:a,distance:l,yaw:c,pitch:h})}const e=this.params.get("year");e?this.timeline.setYear(Number(e)):t?this.timeline.set(Math.round(this.timeline.sAtYear(1778))):this.timeline.set(0),this.timeline.onChange(()=>this.syncEras()),this.syncEras(),this.sky.update(this.clock.doy,this.clock.hour,0,this.light);const n=this.renderer.getContext(),i=n.getExtension("WEBGL_debug_renderer_info"),r=i?String(n.getParameter(i.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(r),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.params.get("debug")&&this.world.setDebug(Number(this.params.get("debug"))),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}setView(t,{user:e=!1}={}){e&&(this.viewChosen=!0);const n=t==="chiefdoms"||t==="land"?t:null;if(n!==this.view){this.view=n;for(const i of this.viewListeners)i(n)}}onView(t){this.viewListeners.push(t)}islandFill(){const t=this.rig.state,e=t.target;let n=null,i=0;for(const a of this.world.islandPacks){const l=a.rect,c=Math.min(e.x-l.x0,l.x1-e.x,e.z-l.z0,l.z1-e.z);c>i&&(i=c,n=a)}if(!n)return 0;const r=2*t.distance*Math.tan(this.camera.fov*Math.PI/360),o=n.rect;return Math.max((o.x1-o.x0)/(r*this.camera.aspect),(o.z1-o.z0)/r)}routeOptions(t){var n;const e=this.tour;return{window:this.timeline.window,fill:this.islandFill(),focus:e!=null&&e.active?((n=e.event)==null?void 0:n.id)??null:null,...t}}addIsland(t){const e=this.world.addIsland(t);this.land.attach(e),e.applyRange(this.qset.range),this.params.get("debug")&&(e.uniforms.uDebug.value=Number(this.params.get("debug")))}settle(){var e,n,i;(e=this.ui)==null||e.timeline.finish(),this.rig.finishFlight();const t=this.rig.goal;for(const r of[this.rig.goal,this.rig.state])r.target.copy(t.target),r.distance=t.distance,r.yaw=t.yaw,r.pitch=t.pitch;this.world.update(this.camera,t.distance,0),this.world.settle(this.camera),(n=this.districts)==null||n.settle(this.camera,t.distance),this.rig.jump({x:t.target.x,z:t.target.z}),this.polityK=this.view==="chiefdoms"?pr(t.distance):0,this.landK=this.view==="land"?La(t.distance):0,this.shared.uniforms.uPolityK.value=this.polityK,this.land.settle(this.landK),(i=this.routes)==null||i.settle(this.timeline.year,t.distance,this.routeOptions())}stats(){const t=this.renderer.info;return{...this.world.stats(),view:this.view,frameMs:+(this.frameAvg??0).toFixed(1),calls:t.render.calls,triangles:t.render.triangles,textures:t.memory.textures,quality:this.quality.level}}syncEras(){const{a:t,b:e,t:n}=this.timeline.pair;this.polity.setEras(t,e,n)}applyQuality(){const t=[{range:3,dpr:1},{range:3.8,dpr:1.25},{range:4.6,dpr:1.5},{range:5.5,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.world.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.frameAvg=this.frameAvg===void 0?e*1e3:this.frameAvg+(e*1e3-this.frameAvg)*.1,this.renderer.info.reset(),this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.clock;this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t);const n=this.rig.state.distance;this.world.update(this.camera,n,t),this.ocean.update(this.camera);const i=1-Math.exp(-t*5),r=this.view==="chiefdoms"?pr(n):0;this.polityK+=(r-this.polityK)*i,this.shared.uniforms.uPolityK.value=this.polityK;const o=this.view==="land"?La(n):0;this.landK+=(o-this.landK)*i,this.land.update(t,this.landK),this.lines.visible=this.overlay.lines;const a=this.light,l=Math.min(1,.25+(a.sunColor.r+a.skyColor.r)*.35);this.lines.update(this.camera,this.renderer,n,l),this.routes.visible=this.overlay.routes!==!1,this.routes.update(this.timeline.year,n,this.routeOptions({light:l}));for(const h of this.updaters)h(t,this.time);const c=this.pipeline.uniforms;c.uSunDir.value.copy(a.sunDir),c.uSunColor.value.copy(a.sunHorizon),c.uFogColor.value.copy(a.horizon),c.uFogDensity.value=.09/Math.max(30,n),c.uFogFalloff.value=2/Math.max(30,n),c.uExposure.value=.55*(1+2.2*Math.pow(a.night,1.5)),c.uNight.value=a.night,this.sky.group.position.copy(this.camera.position)}}const Xe=(s,t=document)=>t.querySelector(s),Le=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,r]of Object.entries(t))i==="class"?n.className=r:i.startsWith("on")?n.addEventListener(i.slice(2),r):n.setAttribute(i,r);return e&&(n.innerHTML=e),n},ox={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},bt=s=>String(s??"").replace(/[&<>"']/g,t=>ox[t]),Pa={arrival:'<path d="M2.5 15.5h19l-2.6 3.6H5.1z"/><path d="M11.5 15.5V4l6.5 9.2h-6.5"/><path d="M2 21.2c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',voyage:'<path d="M2.5 14.5h19l-2.6 3.6H5.1z"/><path d="M11.5 14.5V3.5l6.5 9h-6.5"/><path d="M6 21c3-1.4 9-1.4 12 0"/>',battle:'<path d="M4.5 19.5 19.5 4.5M4.5 4.5l15 15"/><path d="M16.5 4.5h3v3M7.5 4.5h-3v3"/>',founding:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',construction:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',eruption:'<path d="M2.5 20.5 9 11h6l6.5 9.5z"/><path d="M10.2 8.2c0-2 1-3.1 1.8-4.7.8 1.6 1.8 2.7 1.8 4.7"/><path d="M7 6.5l1.3 1.3M17 6.5l-1.3 1.3"/>',epidemic:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',law:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',treaty:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 15h3"/><path d="M13.5 18.5c1-1 1.8-1 2.8 0"/>',death:'<path d="M3.5 18.5h17"/><path d="M7 18.5a5 5 0 0 1 10 0"/><path d="M12 4.5v5M9.6 7.4 12 9.8l2.4-2.4"/>',protest:'<path d="M6 21V3.5"/><path d="M6 4h11.5l-2.6 4 2.6 4H6"/>',restoration:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',other:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',era:'<path d="M5 13.5h14l-2 2.6H7z"/><path d="M11.5 13.5V3.5l5.5 7.6h-5.5"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',routes:'<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',home:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'};function fn(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Pa[s]||Pa.other}</svg>`}const ch=s=>s in Pa;class lx{constructor(t,e,n){this.app=e,this.ui=n,this.tl=e.timeline,this.tween=null;const i=this.tl.n;this.el=Le("div",{class:"timeline",role:"group","aria-label":"Time"}),i<2&&this.el.classList.add("single"),i<1&&(this.el.hidden=!0),this.el.innerHTML=`
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${fn("prev",16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${fn("next",16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${Math.max(0,i-1)}" step="0.001" aria-label="Year" />
      </div>`,t.appendChild(this.el),this.input=Xe(".tl-input",this.el),this.backBtn=Xe(".tl-back",this.el),this.nextBtn=Xe(".tl-next",this.el),this.tourEl=Xe(".tl-tour",this.el);const r=Xe(".tl-ticks",this.el),o=Math.max(1,Math.ceil(i*46/Math.min(620,innerWidth-60)));this.tl.eras.forEach((a,l)=>{const c=i>1?l/(i-1)*100:50,h=Le("button",{class:"tl-tick",style:`left:${c}%`,title:`${a.label} · ${fs(a.year,a.yearPrecision)}`,"aria-label":a.label,"data-i":l});h.innerHTML=`<i></i>${l%o===0||l===i-1?`<span>${bt(fs(a.year,a.yearPrecision).replace("c. ",""))}</span>`:""}`,r.appendChild(h)}),this.input.addEventListener("input",()=>{this.tween=null,this.tl.set(Number(this.input.value)),this.ui.onScrub()}),r.addEventListener("click",a=>{const l=a.target.closest(".tl-tick");l&&(this.easeTo(Number(l.dataset.i),.9),this.ui.onScrub(Number(l.dataset.i)))}),this.nextBtn.addEventListener("click",()=>{this.el.classList.remove("invite"),this.ui.tour.next()}),this.backBtn.addEventListener("click",()=>this.ui.tour.back()),this.tl.onChange(()=>this.refresh()),this.refresh()}easeTo(t,e=1){const n=Math.max(0,Math.min(this.tl.max,t));this.tween={from:this.tl.s,to:n,t:0,dur:e}}easeToYear(t,e){this.easeTo(this.tl.sAtYear(t),e)}finish(){this.tween&&(this.tl.set(this.tween.to),this.tween=null)}update(t){const e=this.tween;if(!e)return;e.t=Math.min(1,e.t+t/e.dur);const n=e.t<.5?2*e.t*e.t:1-Math.pow(-2*e.t+2,2)/2;this.tl.set(e.from+(e.to-e.from)*n),e.t>=1&&(this.tween=null)}refresh(){const t=this.tl,e=t.era;Xe(".tl-era",this.el).textContent=e?e.label:"",Xe(".tl-year",this.el).textContent=e?fs(t.year,e.yearPrecision??1):"",document.activeElement!==this.input&&(this.input.value=String(t.s));const n=t.max>0?t.s/t.max:0;Xe(".tl-rail span",this.el).style.width=`${n*100}%`;const i=Math.round(t.s);for(const r of this.el.querySelectorAll(".tl-tick"))r.classList.toggle("on",Number(r.dataset.i)===i)}refreshTour(t){const e=`${t.active}:${t.chapter}:${t.step}:${t.stop}:${t.active?"":t.nearestChapter()}:${t.atEnd}`;if(e===this.tourKey)return;this.tourKey=e;const n=t.describe();if(this.backBtn.disabled=!n||t.atStart,this.nextBtn.disabled=!n||t.atEnd,this.el.classList.toggle("off-tour",!!n&&!n.active),!n){this.tourEl.innerHTML="";return}this.tourEl.innerHTML=n.active?`<span>${bt(n.chapter)}</span><i>·</i><em>${bt(n.name)}</em>${n.step?`<i>·</i><span>${bt(n.step)}</span>`:""}`:`<span>Next resumes at ${bt(n.chapter.toLowerCase())}</span><i>·</i><em>${bt(n.name)}</em>`,this.nextBtn.title=n.active?"Next (→ or space)":`Back to the tour: ${n.chapter.toLowerCase()}, ${n.name}`}}const rc={exact:0,ahupuaa:22,moku:90,island:260,sea:160},ac=24;class cx{constructor(t,e,{onOpen:n,onCluster:i}={}){this.app=e,this.onOpen=n,this.onCluster=i,this.layer=Le("div",{class:"pins"}),t.appendChild(this.layer),this.tip=Le("div",{class:"cl-tip",role:"tooltip"}),t.appendChild(this.tip);const r=new Map(e.data.places.map(l=>[l.id,l]));this.places=r,this.items=[];const o=[];for(const l of e.data.events){const c=(l.where||[]).map(u=>r.get(u.place)).find(u=>u&&rn(u.geometry)),h=Ca(l);if(!c||!h){o.push(l.id);continue}const[d,f]=e.data.proj.toWorld(rn(c.geometry)),m=ch(l.kind)?l.kind:"other",x=Le("button",{class:"pin",title:l.title,"aria-label":l.title},`<span class="pin-ic">${fn(m,16)}</span><span class="pin-label">${bt(l.title)}</span>`);x.addEventListener("click",u=>{var v;u.stopPropagation(),(v=this.onOpen)==null||v.call(this,l)});const g=rc[c.placePrecision]??0,p=Le("div",{class:"halo"});this.layer.appendChild(p),this.layer.appendChild(x),this.items.push({ev:l,place:c,x:d,z:f,span:h,start:dr(l)??h[0],el:x,halo:p,soft:g,r:g,pos:new N(d,0,f),shown:!1,active:!1,near:!1,haloShown:!1,tx:NaN,ty:NaN,ts:NaN,hx:NaN,hy:NaN,hr:NaN,ha:NaN})}o.length&&e.warn(`events with no placeable \`where\` or no date, so no pin: ${o.join(", ")}`);const a=this.items.length;this.sx=new Float32Array(a),this.sy=new Float32Array(a),this.vis=new Uint8Array(a),this.root=new Int16Array(a),this.size=new Int16Array(a),this.slot=new Int16Array(a),this.members=new Int16Array(a),this.halos=new Int16Array(a),this.clusters=[],this.nClusters=0,this.hovered=null,this.activeEvent=null,this.stopXZ=null,this._v=new N,this._w=new N}setStopPlace(t){const e=t&&rn(t.geometry);this.stopXZ=e?this.app.data.proj.toWorld(e):null,this.stopSoft=t?rc[t.placePrecision]??0:0}visibleEvents(){const[t,e]=this.app.timeline.window;return this.items.filter(n=>n.span[1]>=t&&n.span[0]<=e).map(n=>n.ev)}marker(t){let e=this.clusters[t];if(e)return e;const n=Le("button",{class:"cluster"},'<span class="cl-n"></span>');return e={el:n,label:n.firstChild,start:0,count:0,x:0,y:0,key:0,shownCount:-1,tipKey:-1,domKey:-1,shown:!1,beside:!1,tx:NaN,ty:NaN,ts:NaN},n.addEventListener("click",i=>{var r;i.stopPropagation(),this.hideTip(),(r=this.onCluster)==null||r.call(this,this.eventsOf(e))}),n.addEventListener("pointerenter",i=>{i.pointerType!=="touch"&&(this.hovered=e,this.showTip(e))}),n.addEventListener("pointerleave",()=>{this.hovered===e&&this.hideTip()}),this.layer.appendChild(n),this.clusters[t]=e,e}eventsOf(t){const e=[];for(let n=0;n<t.count;n++)e.push(this.items[this.members[t.start+n]]);return e.sort((n,i)=>n.start-i.start).map(n=>n.ev)}groups(){return this.clusters.slice(0,this.nClusters).map(t=>({ids:this.eventsOf(t).map(e=>e.id),count:t.count,x:t.x,y:t.y,beside:t.beside}))}showTip(t){t.tipKey=t.key;const e=this.eventsOf(t).map(n=>`<div class="tip-row"><span class="tip-y">${bt(oh(n))}</span><b>${bt(n.title)}</b></div>`).join("");this.tip.innerHTML=`<div class="tip-head">${t.count} events here</div>${e}<div class="tip-foot">click for the list</div>`,this.tip.classList.add("show"),this.tipX=this.tipY=NaN,this.placeTip(t)}placeTip(t){const e=this.tip.offsetWidth||220,n=this.tip.offsetHeight||120;let i=t.x+22;i+e>innerWidth-10&&(i=t.x-22-e);const r=Math.max(64,Math.min(innerHeight-n-10,t.y-44-n/2)),o=Math.round(i),a=Math.round(r);o===this.tipX&&a===this.tipY||(this.tipX=o,this.tipY=a,this.tip.style.transform=`translate(${o}px, ${a}px)`)}hideTip(){this.hovered=null,this.tip.classList.remove("show")}find(t){const e=this.root;for(;e[t]!==t;)e[t]=e[e[t]],t=e[t];return t}put(t,e,n,i){Math.abs(e-t.tx)<.05&&Math.abs(n-t.ty)<.05&&i===t.ts||(t.tx=e,t.ty=n,t.ts=i,t.el.style.transform=`translate(${e.toFixed(1)}px, ${n.toFixed(1)}px) scale(${i.toFixed(3)})`)}update(t){const e=this.app,n=e.camera,i=innerWidth,r=innerHeight,o=e.timeline,a=o.yearAt(o.s-.5),l=o.yearAt(o.s+.5),c=e.rig.state.distance,h=Math.round(Math.max(.62,Math.min(1,1.18-Math.log(Math.max(1,c)/120)*.13))*200)/200,d=this.items,f=d.length,{sx:m,sy:x,vis:g,root:p,size:u}=this,v=this.activeEvent,_=this._v;let w=-1;for(let M=0;M<f;M++){const y=d[M],P=y.ev===v,C=P&&this.stopXZ;y.pos.x=C?this.stopXZ[0]:y.x,y.pos.z=C?this.stopXZ[1]:y.z,y.pos.y=e.world.heightAt(y.pos.x,y.pos.z)+.02,y.r=C?this.stopSoft:y.soft;let k=t&&(P||y.span[1]>=a&&y.span[0]<=l);k&&(_.copy(y.pos).project(n),m[M]=(_.x+1)/2*i,x[M]=(1-_.y)/2*r,k=_.z<1&&m[M]>-60&&m[M]<i+60&&x[M]>84&&x[M]<r+40),g[M]=k?1:0,k&&P&&(w=M),p[M]=M,u[M]=0}const b=ac*ac;for(let M=0;M<f;M++)if(!(!g[M]||M===w))for(let y=M+1;y<f;y++){if(!g[y]||y===w)continue;const P=m[M]-m[y],C=x[M]-x[y];if(P*P+C*C<b){const k=this.find(M),D=this.find(y);k!==D&&(p[Math.max(k,D)]=Math.min(k,D))}}for(let M=0;M<f;M++)g[M]&&M!==w&&u[this.find(M)]++;let S=0,T=0;for(let M=0;M<f;M++){if(!g[M]||M===w||p[M]!==M||u[M]<2)continue;const y=this.marker(S);this.slot[M]=S++,y.start=T,y.count=0,y.x=0,y.y=0,y.key=0,T+=u[M]}for(let M=0;M<f;M++){if(!g[M]||M===w)continue;const y=this.find(M);if(u[y]<2)continue;const P=this.clusters[this.slot[y]];this.members[P.start+P.count++]=M,P.x+=m[M],P.y+=x[M],P.key=(P.key*61+M+1)%1000003}for(let M=0;M<f;M++){const y=d[M],P=g[M]===1&&(M===w||u[this.find(M)]<2);P!==y.shown&&(y.shown=P,y.el.classList.toggle("show",P));const C=y.ev===v;if(C!==y.active&&(y.active=C,y.el.classList.toggle("active",C)),!P)continue;const k=c<260||C;k!==y.near&&(y.near=k,y.el.classList.toggle("near",k)),this.put(y,m[M],x[M],h)}for(let M=0;M<S;M++){const y=this.clusters[M];y.x/=y.count,y.y/=y.count;const P=w>=0&&Math.abs(y.x-m[w])<30&&Math.abs(y.y-x[w])<30;if(P&&(y.x=m[w]-36*h,y.y=x[w]),P!==y.beside&&(y.beside=P,y.el.classList.toggle("beside",P)),y.count!==y.shownCount&&(y.shownCount=y.count,y.label.textContent=String(y.count),y.el.setAttribute("aria-label",`${y.count} events here`)),y.key!==y.domKey){y.domKey=y.key;let C="";for(let k=0;k<y.count;k++)C+=`${k?" ":""}${d[this.members[y.start+k]].ev.id}`;y.el.dataset.events=C}y.shown||(y.shown=!0,y.el.classList.add("show")),this.put(y,y.x,y.y,h),this.hovered===y&&(y.key!==y.tipKey?this.showTip(y):this.placeTip(y))}for(let M=S;M<this.clusters.length;M++){const y=this.clusters[M];this.hovered===y&&this.hideTip(),y.shown&&(y.shown=!1,y.count=0,y.el.classList.remove("show"))}this.nClusters=S;let L=0;for(let M=0;M<f;M++){const y=d[M];let P=g[M]===1&&y.r>0;for(let F=0;P&&F<L;F++){const B=d[this.halos[F]];Math.abs(B.pos.x-y.pos.x)<.5&&Math.abs(B.pos.z-y.pos.z)<.5&&B.r>=y.r&&(P=!1)}if(P!==y.haloShown&&(y.haloShown=P,y.halo.classList.toggle("show",P)),!P)continue;this.halos[L++]=M,this._w.copy(n.position).sub(y.pos).normalize();const C=this._w.cross(n.up).normalize().multiplyScalar(y.r).add(y.pos);C.project(n);const k=Math.max(6,Math.min(400,Math.hypot((C.x+1)/2*i-m[M],(1-C.y)/2*r-x[M])));Math.abs(m[M]-y.hx)<.05&&Math.abs(x[M]-y.hy)<.05&&Math.abs(k-y.hr)<.05||(y.hx=m[M],y.hy=x[M],y.hr=k,y.halo.style.transform=`translate(${m[M].toFixed(1)}px, ${x[M].toFixed(1)}px) scale(${k.toFixed(1)})`);const D=Math.round(Math.max(.3,Math.min(1,70/k))*100)/100;D!==y.ha&&(y.ha=D,y.halo.style.setProperty("--halo",D.toFixed(2)))}}}const hx={arrival:"arrival",battle:"battle",founding:"founding",construction:"construction",eruption:"eruption",epidemic:"epidemic",law:"law",treaty:"treaty",voyage:"voyage",death:"death",protest:"protest",restoration:"restoration",other:"event"},oc=s=>ch(s.kind)?s.kind:"other";class ux{constructor(t,e,n){this.app=e,this.ui=n,this.el=Le("section",{class:"card","aria-live":"polite"}),t.appendChild(this.el),this.places=new Map(e.data.places.map(i=>[i.id,i])),this.sources=new Map(e.data.sources.map(i=>[i.id,i])),this.events=new Map(e.data.events.map(i=>[i.id,i])),this.mode=null,this.ev=null,this.stop=-1,this.chapter=null,this.list=null,this.el.addEventListener("click",i=>this.click(i))}get isOpen(){return this.el.classList.contains("show")}open(t){this.set("event",{ev:t})}setStop(t){this.stop=t,this.render()}openEra(t){this.set("era",{chapter:t})}openList(t){this.set("cluster",{list:t})}set(t,{ev:e=null,chapter:n=null,list:i=null}){this.mode=t,this.ev=e,this.chapter=n,this.list=i,this.stop=-1,this.render()}close(){var e,n;const t=this.ev;this.el.classList.remove("show"),this.mode=null,this.ev=null,this.chapter=null,this.list=null,(n=(e=this.ui).onCardClosed)==null||n.call(e,t)}click(t){const e=t.target.closest("button");if(!e||!this.el.contains(e))return;const n=this.ui.tour;if(e.classList.contains("card-close"))this.close();else if(e.classList.contains("prev"))n.back();else if(e.classList.contains("next"))n.next();else if(e.dataset.ev){const i=this.events.get(e.dataset.ev);i&&n.open(i,{gentle:this.mode==="cluster"})}}sourceLine(t){const e=typeof t=="string"?t:t.id,n=this.sources.get(e),i=typeof t=="object"&&t.where?`, ${bt(t.where)}`:"";if(!n)return`<li><span class="src-title">${bt(e)}</span>${i} <span class="flag missing" title="not in sources.json">missing</span></li>`;const r=n.url&&/^https?:/.test(n.url)?`<a href="${bt(n.url)}" target="_blank" rel="noopener">${bt(n.title)}</a>`:bt(n.title),o=n.opened===!1?' <span class="flag" title="Not yet read at the source: check this before relying on it">verify</span>':"",a=n.author?`${bt(n.author)}, `:"",l=n.year?` (${bt(n.year)})`:"";return`<li>${a}<span class="src-title">${r}</span>${l}${i}${o}</li>`}sourcesSection(t){return`<div class="card-sec"><h2>Sources</h2><ul class="sources">${(t||[]).map(e=>this.sourceLine(e)).join("")||'<li class="none">none listed</li>'}</ul></div>`}eventRows(t,{gloss:e=!0}={}){return t.map(n=>`<li><button class="ev-row" data-ev="${bt(n.id)}">
          <span class="ev-ic">${fn(oc(n),16)}</span>
          <span class="ev-y">${bt(oh(n))}</span>
          <span class="ev-t"><b>${bt(n.title)}</b>${e&&n.gloss?`<em>${bt(n.gloss)}</em>`:""}</span>
        </button></li>`).join("")}footer(){var r;const t=this.ui.tour;if(!(t!=null&&t.active))return"";const e=t.current;let n,i="Next";if(this.mode==="era"&&this.chapter===e&&t.step<0)n=`chapter ${e.index+1} of ${t.chapters.length}`;else if(this.mode==="event"&&this.ev&&this.ev===t.event){const o=((r=this.ev.stops)==null?void 0:r.length)||0;t.stop>=0?n=`stop ${t.stop+1} of ${o}`:(n=`${t.step+1} of ${e.events.length} in this chapter`,o&&(i=`Walk ${o} stops`))}else return"";return`<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${t.atStart?"disabled":""}>${fn("prev",18)}</button>
      <span class="count">${bt(n)}</span>
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${t.atEnd?"disabled":""}><span>${bt(i)}</span>${fn("next",18)}</button>
    </footer>`}render(){if(this.mode==="era")this.el.innerHTML=this.eraHTML();else if(this.mode==="cluster")this.el.innerHTML=this.clusterHTML();else if(this.mode==="event"&&this.ev)this.el.innerHTML=this.eventHTML();else return;this.el.dataset.mode=this.mode,this.el.classList.add("show"),this.el.scrollTop=0}header(t,e,n){return`<header>
        <div class="card-icon">${fn(t,26)}</div>
        <div class="card-titles"><h1>${bt(e)}</h1>${n?`<p class="gloss">${bt(n)}</p>`:""}</div>
        <button class="card-close" aria-label="Close">${fn("close",18)}</button>
      </header>`}eventHTML(){const t=this.ev,e=(t.where||[]).map(l=>{const c=this.places.get(l.place);return c?`${bt(c.name)}${l.role?` <em>${bt(l.role)}</em>`:""}`:null}).filter(Boolean),n=Object.entries(t.confidence||{}).map(([l,c])=>`<span class="conf ${bt(c)}"><b>${bt(l)}</b> ${bt(c)}</span>`).join(""),i=(t.tellings||[]).map(l=>{var c;return`<li><span class="src-title">${bt(((c=this.sources.get(l.source))==null?void 0:c.title)||l.source)}</span>: ${bt(l.says)}</li>`}).join(""),r=t.stops||[],o=this.stop>=0?r[this.stop]:null,a=o?this.places.get(o.place):null;return`
      ${this.header(oc(t),t.title,t.gloss)}
      <div class="card-meta"><span class="when">${bt(sx(t))}</span><span class="kind">${bt(hx[t.kind]||t.kind||"event")}</span></div>
      ${e.length?`<div class="card-where">${e.join("<i>·</i>")}</div>`:""}
      ${o?`<div class="stop"><div class="stop-n">${this.stop+1} / ${r.length}${a?` · ${bt(a.name)}`:""}</div><p>${bt(o.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${bt(t.summary)}</p>`:""}</div>
      ${n?`<div class="card-conf">${n}</div>`:""}
      ${i?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${i}</ul></div>`:""}
      ${this.sourcesSection(t.sources)}
      ${this.footer()}`}eraHTML(){const t=this.chapter,e=t.era,n=this.ui.tour;return`
      ${this.header("era",e.label||e.id)}
      <div class="card-meta"><span class="when">${bt(fs(e.year,Math.max(10,e.yearPrecision??10)))}</span><span class="kind">chapter ${t.index+1} of ${n.chapters.length}</span></div>
      <div class="card-body">${e.note?`<p>${bt(e.note)}</p>`:""}</div>
      ${t.events.length?`<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(t.events,{gloss:!1})}</ul></div>`:""}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`}clusterHTML(){const t=this.list||[],e=[];for(const i of t){const r=(i.where||[]).map(o=>this.places.get(o.place)).find(Boolean);r&&!e.includes(r.name)&&e.push(r.name)}const n=e.length>4?`${e.slice(0,4).join(" · ")} · and ${e.length-4} more`:e.join(" · ");return`
      ${this.header("pins",`${t.length} events`,n)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(t)}</ul></div>`}}const Yn={far:2600,island:520,near:70},da={far:0,island:1,near:2},Ti=(s,t,e)=>Math.max(t,Math.min(e,s)),fx=new Set(["law","epidemic","restoration"]);function dx(s){return(s==null?void 0:s.view)==="land"||(s==null?void 0:s.view)==="chiefdoms"?s.view:s&&fx.has(s.kind)?"land":"chiefdoms"}function px(s){return s.short?s.short:String(s.label||s.id).replace(/^in the time of\s+/i,"").split(/,| and the /)[0].trim()}function lc(s){let t=null;for(const e of s||[])e in da&&(t===null||da[e]>da[t])&&(t=e);return t||"island"}class mx{constructor(t,e){this.app=t,this.ui=e,this.places=new Map(t.data.places.map(n=>[n.id,n])),this.islands=new Map(t.data.packs.filter(n=>n!==t.world.archPack).map(n=>[n.id,n])),this.chapters=this.build(),this.active=!1,this.chapter=0,this.step=-1,this.stop=-1,this.listeners=[]}build(){const t=this.app,e=t.timeline,n=new Map(e.eras.map((a,l)=>[a.id,l])),i=e.eras.map((a,l)=>({era:a,index:l,name:px(a),events:[],island:null}));if(!i.length)return i;const r=[],o=i.map(()=>[]);return t.data.events.forEach((a,l)=>{const c=dr(a);if(c===null)return;let h=n.get(a.era);h===void 0&&(h=Math.round(e.sAtYear(c)),r.push(a.id)),o[h].push({ev:a,start:c,order:l})}),r.length&&t.warn(`events whose era is not in eras.json, placed in a chapter by date: ${r.join(", ")}`),i.forEach((a,l)=>{a.events=o[l].sort((c,h)=>c.start-h.start||c.order-h.order).map(c=>c.ev),a.island=this.gathering(a.events)}),i}gathering(t){const e=new Map;let n=0;for(const o of t){const a=this.placeOf(o);a&&(n++,a.island&&this.islands.has(a.island)&&e.set(a.island,(e.get(a.island)||0)+1))}let i=null,r=0;for(const[o,a]of e)a>r&&([i,r]=[o,a]);return i&&r>=2&&r>=n*.7?i:null}placeOf(t){for(const e of t.where||[]){const n=this.places.get(e.place);if(n&&rn(n.geometry))return n}return null}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}get current(){return this.chapters[this.chapter]||null}get event(){var t;return this.step>=0&&((t=this.current)==null?void 0:t.events[this.step])||null}get state(){var t;return{active:this.active,chapter:this.chapter,step:this.step,stop:this.stop,event:((t=this.event)==null?void 0:t.id)??null}}get atStart(){return this.active&&this.chapter===0&&this.step<0}get atEnd(){var r;const t=this.chapters.length;if(!t)return!0;if(!this.active)return!1;const e=this.current,n=this.event,i=n?(((r=n.stops)==null?void 0:r.length)||0)-1:-1;return this.chapter===t-1&&this.step===e.events.length-1&&this.stop>=i}nearestChapter(){return Ti(Math.round(this.app.timeline.s),0,this.chapters.length-1)}begin(){this.goTo(0,-1,{jump:!0})}next(){var e;if(!this.chapters.length)return;if(!this.active)return this.goTo(this.nearestChapter(),-1);const t=this.event;if(t&&this.stop<(((e=t.stops)==null?void 0:e.length)||0)-1)return this.goStop(this.stop+1);if(this.step<this.current.events.length-1)return this.goTo(this.chapter,this.step+1);if(this.chapter<this.chapters.length-1)return this.goTo(this.chapter+1,-1)}back(){if(this.chapters.length){if(!this.active)return this.goTo(this.nearestChapter(),-1);if(this.event&&this.stop>0)return this.goStop(this.stop-1);if(this.event&&this.stop===0)return this.goTo(this.chapter,this.step);if(this.step>0)return this.goTo(this.chapter,this.step-1,{stop:"last"});if(this.step===0)return this.goTo(this.chapter,-1);if(this.chapter>0){const t=this.chapters[this.chapter-1];return this.goTo(this.chapter-1,t.events.length-1,{stop:"last"})}}}skip(t){if(!this.chapters.length)return;const e=this.active?this.chapter:this.nearestChapter(),n=t<0&&this.active&&this.step>=0?e:e+t;n>=0&&n<this.chapters.length&&this.goTo(n,-1)}leave(){this.active&&(this.active=!1,this.notify())}locate(t){for(let e=0;e<this.chapters.length;e++){const n=this.chapters[e].events.indexOf(t);if(n>=0)return[e,n]}return null}open(t,{gentle:e=!1}={}){const n=this.locate(t);if(n)return this.goTo(n[0],n[1],{gentle:e});this.ui.pins.activeEvent=t,this.ui.pins.setStopPlace(null),this.ui.card.open(t),this.fly(this.gentleView(t))}goTo(t,e=-1,{jump:n=!1,gentle:i=!1,stop:r=-1}={}){var a;const o=this.chapters[t];if(o){if(this.active=!0,this.chapter=t,this.step=Ti(e,-1,o.events.length-1),this.stop=-1,this.step<0)this.showEra(o,n);else{const l=o.events[this.step],c=((a=l.stops)==null?void 0:a.length)||0;if(r==="last"&&c)return this.goStop(c-1,{jump:n});this.showEvent(l,{jump:n,gentle:i})}this.notify()}}applyView(t){this.app.viewChosen||this.app.setView(dx(t))}showEra(t,e){const n=this.ui;this.applyView(null),n.pins.activeEvent=null,n.pins.setStopPlace(null),n.card.openEra(t);const i=t.island?this.islandView(t.island,this.homeYaw()):this.chainView();this.setS(t.index,this.fly(i,e),e)}showEvent(t,{jump:e,gentle:n}){const i=this.ui;this.applyView(t),this.prefetch(t),i.pins.activeEvent=t,i.pins.setStopPlace(null),i.card.open(t);const r=this.fly(n?this.gentleView(t):this.eventView(t),e),o=this.app.timeline,[a,l]=o.window,c=Ca(t);n&&c&&c[1]>=a&&c[0]<=l||this.setYear(this.stepYear(t,this.current),r,e)}goStop(t,{jump:e=!1}={}){const n=this.event,i=(n==null?void 0:n.stops)||[];if(!n||t<-1||t>=i.length)return;const r=this.ui;this.active=!0,this.stop=t,this.applyView(n),r.pins.activeEvent=n,r.card.ev!==n&&r.card.open(n),r.card.setStop(t);const o=i[t],a=o?this.places.get(o.place):null,l=a&&rn(a.geometry);if(r.pins.setStopPlace(l?a:null),this.prefetch(n),o){const c=l?o.camera?this.cameraView(a,o.camera):this.pointView(a,Yn[o.zoom]??Yn.island):null,h=this.fly(c,e);Number.isFinite(o.year)&&this.setYear(o.year,h,e)}this.notify()}prefetch(t){const e=this.app.districts;if(e)for(const n of(t==null?void 0:t.stops)||[]){const i=this.places.get(n.place),r=i&&rn(i.geometry);if(!r||n.zoom==="far")continue;const[o,a]=this.app.data.proj.toWorld(r);if(e.prefetch(o,a))return}}stepYear(t,e){const n=this.app.timeline,i=dr(t),r=Ca(t)||[i,i],o=n.yearAt(e.index-.5),a=n.yearAt(e.index+.5);return i>=o&&i<=a?i:r[1]>=o&&r[0]<=a?Ti(e.era.year,Math.max(r[0],o),Math.min(r[1],a)):i}setYear(t,e,n){this.setS(this.app.timeline.sAtYear(t),e,n)}setS(t,e,n){const i=this.ui.timeline;n?(i.tween=null,this.app.timeline.set(t)):i.easeTo(t,Ti(e*.8,.6,2.4))}homeYaw(t=this.ui.freeBox()){return(t.x1-t.x0)/Math.max(1,t.y1-t.y0)<.85?1.1:0}tilt(){const t=this.app.rig.goal;return Ti(t.pitch-Jn(t.distance),-.3,.3)}chainView(){const t=this.ui.freeBox();let e=null;for(const n of this.islands.values()){const i=n.rect;e=e?{x0:Math.min(e.x0,i.x0),z0:Math.min(e.z0,i.z0),x1:Math.max(e.x1,i.x1),z1:Math.max(e.z1,i.z1)}:{...i}}return this.app.rig.fit({rect:e||this.app.world.bounds,yaw:this.homeYaw(t),box:t})}islandView(t,e=this.app.rig.goal.yaw,n=0){const i=this.islands.get(t);return this.app.rig.fit({rect:i.rect,yaw:e,tilt:n,box:this.ui.freeBox()})}pointView(t,e,{towardChain:n=0}={}){let[i,r]=this.app.data.proj.toWorld(rn(t.geometry));if(n){const o=this.app.world.bounds,a=(o.x0+o.x1)/2-i,l=(o.z0+o.z1)/2-r,c=Math.min(n,900/Math.max(1,Math.hypot(a,l)));i+=a*c,r+=l*c}return this.app.rig.fit({rect:{x0:i,x1:i,z0:r,z1:r},distance:e,tilt:this.tilt(),box:this.ui.freeBox()})}cameraView(t,e){const[n,i]=this.app.data.proj.toWorld(rn(t.geometry));return this.app.rig.fit({rect:{x0:n,x1:n,z0:i,z1:i},distance:e.distance,yaw:-e.bearing*Math.PI/180,pitch:e.pitch*Math.PI/2,box:this.ui.freeBox()})}eventView(t){const e=this.placeOf(t);if(!e)return null;const n=lc(t.zoom);return n==="near"?this.pointView(e,Yn.near):n==="island"&&this.islands.has(e.island)?this.islandView(e.island,this.app.rig.goal.yaw,this.tilt()):n==="island"?this.pointView(e,Yn.island):!e.island&&e.placePrecision==="island"?this.chainView():this.pointView(e,Yn.far,{towardChain:.35})}gentleView(t){const e=this.placeOf(t);if(!e)return null;const n=Yn[lc(t.zoom)];return this.pointView(e,Math.min(this.app.rig.goal.distance,Math.max(n,Yn.island)))}fly(t,e=!1){if(!t)return 1;const n=this.app.rig;if(e)return n.jump({x:t.target.x,z:t.target.z,distance:t.distance,yaw:t.yaw,pitch:t.pitch}),0;const i=n.goal,r=Math.hypot(i.target.x-t.target.x,i.target.z-t.target.z),o=Math.abs(Math.log(t.distance/Math.max(1,i.distance))),a=Ti(1.1+Math.sqrt(r)*.032+o*.28,1.1,3.4),l=this.app.districts,c=l&&t.distance<130?l.prefetch(t.target.x,t.target.z):null;return n.flyTo(t,a,c?{ready:()=>l.readyAt(t.target.x,t.target.z)}:{}),a}describe(){const t=this.chapters.length?this.chapters[this.active?this.chapter:this.nearestChapter()]:null;return t?{active:this.active,chapter:`Chapter ${t.index+1} of ${this.chapters.length}`,name:t.name,step:this.active&&this.step>=0?`${this.step+1} of ${t.events.length}`:""}:null}}class gx{constructor(t){this.app=t,t.ui=this,this.build(),this.bind(),t.updaters.push(e=>this.update(e)),!t.params.has("year")&&!t.params.has("cam")&&this.tour.chapters.length&&(this.tour.begin(),this.timeline.el.classList.add("invite"))}build(){const t=this.app,e=Le("div",{id:"ui"});document.body.appendChild(e),this.root=e;const n=t.world.archPack.name;this.brand=Le("div",{class:"brand"},`<div class="brand-name">Holo i ke Au</div><div class="brand-sub"><span class="where">${bt(n)}</span><span class="loading"></span></div>`),e.appendChild(this.brand),this.tools=Le("div",{class:"tools"});const i=(o,a,l,c)=>Le("button",{class:`tool${c?" on":""}`,"data-tool":o,title:l,"aria-label":l,"aria-pressed":String(!!c)},fn(a,20));this.tools.append(i("lines","lines","Moku and ahupuaʻa boundaries",t.overlay.lines),i("routes","routes","Voyages, fleets and ships at sea",t.overlay.routes),i("pins","pins","Events",t.overlay.pins),i("home","home","The whole chain"),i("help","help","About"),i("full","expand","Full screen")),e.appendChild(this.tools),this.legend=Le("div",{class:"legend"}),this.legend.innerHTML=`
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
      </div>
      <div class="lg-body"></div>`,this.legendBody=Xe(".lg-body",this.legend),this.legend.inert=!0,e.appendChild(this.legend),this.inspector=Le("div",{class:"inspector"}),e.appendChild(this.inspector),this.timeline=new lx(e,t,this),this.pins=new cx(e,t,{onOpen:o=>this.openEvent(o),onCluster:o=>this.openCluster(o)}),this.card=new ux(e,t,this),this.tour=new mx(t,this),t.tour=this.tour,this.tour.onChange(o=>this.timeline.refreshTour(o)),t.timeline.onChange(()=>this.timeline.refreshTour(this.tour)),this.timeline.refreshTour(this.tour),this.help=Le("div",{class:"help hidden"});const r=this.credits();this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${fn("close",18)}</button>
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
      </div>`,e.appendChild(this.help),this.refreshLegend()}credits(){var i,r;const t=this.app.data,e=new Map,n=o=>{o&&o.id&&!e.has(o.id)&&e.set(o.id,o)};for(const o of t.packs)for(const a of o.sources||[])n(a);for(const o of((i=t.moku)==null?void 0:i.sources)||[])n(o);for(const o of((r=t.ahupuaa)==null?void 0:r.sources)||[])n(o);return hc([...e.values()])}landCredits(){const t=Xe(".land-credits",this.help),e=this.app.land.manifest;if(!t||!e||t.childElementCount)return;const n=new Map;for(const i of Object.values(e.methods||{}))for(const r of Object.values(i||{}))for(const o of(r==null?void 0:r.sources)||[])o!=null&&o.id&&/^https?:/.test(o.url||"")&&!n.has(o.id)&&n.set(o.id,o);n.size&&(t.innerHTML=`<h3>Land layers</h3><ul class="credits">${hc([...n.values()])}</ul>`)}bind(){const t=this.app;this.tools.addEventListener("click",i=>{var a,l,c;const r=i.target.closest("[data-tool]");if(!r)return;const o=r.dataset.tool;if(o==="help")this.help.classList.toggle("hidden");else if(o==="full")document.fullscreenElement?(a=document.exitFullscreen)==null||a.call(document):(c=(l=document.documentElement).requestFullscreen)==null||c.call(l).catch(()=>{});else if(o==="home"){const h=t.rig;h.home=this.tour.chainView(),h.flyTo({target:h.home.target,distance:h.home.distance,yaw:h.home.yaw,pitch:h.home.pitch},3)}else o in t.overlay&&(t.overlay[o]=!t.overlay[o],r.classList.toggle("on",t.overlay[o]),r.setAttribute("aria-pressed",String(t.overlay[o])))}),this.legend.addEventListener("click",i=>{const r=i.target.closest("[data-view]");if(!r||r.disabled)return;const o=r.dataset.view;t.setView(t.view===o?null:o,{user:!0})}),t.onView(()=>this.refreshLegend()),t.land.onChange(()=>{this.refreshLegend(),this.landCredits()}),this.help.addEventListener("click",i=>{(i.target===this.help||i.target.closest(".help-close"))&&this.help.classList.add("hidden")}),t.timeline.onChange(()=>{t.timeline.era!==this.legendEra&&this.refreshLegend()});const e=t.canvas;let n=0;e.addEventListener("pointermove",i=>{if(i.buttons||i.pointerType==="touch")return this.hover(null);const r=performance.now();r-n<70||(n=r,this.hover(i.clientX,i.clientY))}),e.addEventListener("pointerleave",()=>this.hover(null)),e.addEventListener("pointerdown",()=>this.hover(null)),addEventListener("keydown",i=>{var o,a,l,c;if(i.key==="Escape"){this.help.classList.contains("hidden")?this.card.close():this.help.classList.add("hidden");return}if((a=(o=i.target).closest)!=null&&a.call(o,"input, textarea, select")||i.altKey||i.ctrlKey||i.metaKey||!this.help.classList.contains("hidden"))return;const r=this.tour;i.key==="ArrowRight"||i.key===" "&&!((c=(l=i.target).closest)!=null&&c.call(l,"button, a"))?(i.preventDefault(),this.timeline.el.classList.remove("invite"),r.next()):i.key==="ArrowLeft"?(i.preventDefault(),r.back()):i.key===","||i.key==="<"?r.skip(-1):(i.key==="."||i.key===">")&&r.skip(1)})}openEvent(t){this.tour.open(t,{gentle:!0})}openCluster(t){const e=this.tour;this.pins.activeEvent=e.active?e.event:null,this.card.openList(t)}onCardClosed(){const t=this.tour;t.active&&t.event||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}onScrub(t=this.app.timeline.s){var i;this.tour.leave();const n=this.app.timeline;this.card.mode==="era"&&((i=this.card.chapter)==null?void 0:i.era)!==n.eras[Math.round(Math.max(0,Math.min(n.max,t)))]&&this.card.close(),this.card.ev||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}freeBox(){const t=innerWidth,e=innerHeight,n={x0:16,y0:72,x1:t-16,y1:e-16},i=this.timeline.el;!i.hidden&&i.offsetHeight&&(n.y1=Math.min(n.y1,i.offsetTop-14));const r=this.card.el;return this.card.isOpen&&r.offsetWidth&&(r.offsetLeft>t*.35?n.x1=Math.min(n.x1,r.offsetLeft-16):n.y1=Math.min(n.y1,r.offsetTop-12)),n.y1-n.y0<120&&(n.y1=n.y0+120),n}hover(t,e){var m;const n=this.app,i=n.shared.uniforms;if(t==null){i.uHoverMoku.value=0,this.inspector.classList.remove("show");return}const r=n.rig.pickGround(t,e),o=r&&n.world.metresAt(r.x,r.z)>0?n.polity.mokuAt(r.x,r.z):null,a=n.view==="land"&&n.landK>.25,l=pr(n.rig.state.distance)<.05;if(i.uHoverMoku.value=o&&!a&&!l?o.index:0,!o){this.inspector.classList.remove("show");return}const c=a?n.land.valuesAt(r.x,r.z):null,h=`${o.index}:${(m=n.timeline.era)==null?void 0:m.id}:${c?JSON.stringify(c):""}`;if(this.inspectorKey!==h){this.inspectorKey=h;const x=n.polity.holder(n.timeline.era,o),g=(p,u)=>`<div class="in-row"><span class="in-k">${p}</span>${u}</div>`;this.inspector.innerHTML=`
        <div class="in-head"><b>${bt(o.name)}</b><span class="in-island">${bt(o.island||"")}</span></div>
        ${g("moku",x?`<span class="in-pol"><i style="background:${bt(x.colour)}"></i>${bt(x.name)}</span>`:'<span class="in-none">no polity recorded</span>')}
        ${c?g("fields",cc(c.cultivation))+g("people",vx(c.people))+g("forest",cc(c.forest)):""}`}this.inspector.classList.add("show");const d=Math.min(innerWidth-250,t+18),f=Math.max(70,Math.min(innerHeight-120,e+18));this.inspector.style.transform=`translate(${d}px, ${f}px)`}refreshLegend(){const t=this.app,e=t.timeline.era;this.legendEra=e;for(const r of this.legend.querySelectorAll("[data-view]"))r.setAttribute("aria-pressed",String(t.view===r.dataset.view)),r.classList.toggle("on",t.view===r.dataset.view);const n=Xe('[data-view="land"]',this.legend);n.disabled=t.land.available===!1,n.title=n.disabled?"No land layers in this data":"Cultivation, settlement and forest in the chosen year";let i="";if(t.view==="chiefdoms"){const r=t.polity.politiesIn(e);r.length&&(i=`<div class="lg-title">${bt((e==null?void 0:e.label)||"")}</div>${r.map(o=>`<div class="lg"><i style="background:${bt(o.colour)}"></i><b>${bt(o.name)}</b></div>`).join("")}`)}else if(t.view==="land"){const r=t.land.describe();if(this.legendLand=JSON.stringify(r),r){const o=r.years.length>1?`between the ${r.years[0]} and ${r.years[1]} layers`:`the ${r.years[0]} layers`,a=t.land.bound?r.early?`${o}, thinned for the early centuries`:o:"the layers are on their way";i=`<div class="lg-title">${bt((e==null?void 0:e.label)||"")}</div>${r.layers.map(l=>`<div class="lg lg-land"><i class="sw-${l.id}"></i><b>${bt(l.name)}</b>${l.note?`<em>${bt(l.note)}</em>`:""}</div>`).join("")}<div class="lg-note">${bt(a)}</div>`}}this.legendBody.innerHTML=i}setLoading(t){Xe(".loading",this.brand).textContent=t||""}update(t){const e=this.app,n=performance.now();this.timeline.update(t),this.pins.update(e.overlay.pins);const i=e.rig.state.distance,r=(e.view==="land"?La(i):pr(i))>.25;if(r!==this.legend.classList.contains("show")&&(this.legend.classList.toggle("show",r),this.legend.inert=!r),e.view==="land"&&n-(this.landAt||0)>250&&(this.landAt=n,(JSON.stringify(e.land.describe())!==this.legendLand||!e.land.bound!==this.legendWaiting)&&(this.legendWaiting=!e.land.bound,this.refreshLegend())),n-(this.whereAt||0)>300){this.whereAt=n;const o=e.rig.state.target,a=e.rig.state.distance<1400?e.world.islandAt(o.x,o.z):null;Xe(".where",this.brand).textContent=a?a.pack.name:e.world.archPack.name}}}function cc(s){const t=s*100;return t<.5?'<span class="in-none">none</span>':t<1?"under 1%":`${Math.round(t)}%`}function vx(s){return s<.5?'<span class="in-none">none</span>':`about ${(s<10?Math.round(s):Number(s.toPrecision(2))).toLocaleString("en-US")} a km²`}function hc(s){return s.map(t=>`<li>${t.url&&/^https?:/.test(t.url)?`<a href="${bt(t.url)}" target="_blank" rel="noopener">${bt(t.title||t.id)}</a>`:bt(t.title||t.id)}${t.licence?` <em>${bt(t.licence)}</em>`:""}${t.fetched?` <em>fetched ${bt(t.fetched)}</em>`:""}</li>`).join("")}const mr=document.getElementById("boot"),hh=mr.querySelector(".boot-bar span"),uh=mr.querySelector(".boot-stage"),Qs=(s,t)=>{uh.textContent=s,hh.style.width=`${Math.round(t*100)}%`},is=s=>{console.warn(s)};async function xx(){const s=performance.now();Qs("reading the gazetteer",.05);const t=await Ch(yh(),is);if(!t.packs.length)throw new Error("the manifest lists no packs");const e=new ax(document.getElementById("scene"),t,{warn:is});window.__app=e;const n=new Ph(2,is);Qs("raising the islands",.25);const i=e.world.archPack;i.data=await n.decode(i),Qs("placing the boundaries",.8),await new Promise(l=>setTimeout(l,0)),e.start();const r=new gx(e);e.ui=r,console.log(`archipelago ready in ${((performance.now()-s)/1e3).toFixed(1)} s`),Qs("",1);let o=0;const a=()=>{if(++o<4)return requestAnimationFrame(a);mr.classList.add("gone"),setTimeout(()=>mr.remove(),1200),_x(e,r,n),e.districts.load().catch(l=>is(`districts: ${l.message}`))};requestAnimationFrame(a)}async function _x(s,t,e){const n=s.rig.state.target,i=a=>Math.hypot((a.rect.x0+a.rect.x1)/2-n.x,(a.rect.z0+a.rect.z1)/2-n.z),r=[...s.world.islandPacks].sort((a,l)=>i(a)-i(l));let o=0;t.setLoading(r.length?`· ${r.length} islands to come`:""),await Promise.all(r.map(async a=>{try{a.data=await e.decode(a),s.addIsland(a)}catch(l){is(`${a.id}: ${l.message}`)}o++,t.setLoading(o<r.length?`· ${r.length-o} islands to come`:"")})),e.dispose(),s.islandsLoaded=!0,s.land.load()}xx().catch(s=>{console.error(s),uh.textContent="something went wrong — see the console",hh.style.background="#c0584a"});
