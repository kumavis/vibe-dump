(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const _f=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t)};function bf(n,t,e,i,s){const o=Math.log(Math.max(1e-9,n)/i)/Math.log(s/i);return t+(e-t)*_f(o)}const Re={unit:1e3,minDistance:60,maxDistance:2e4,pitchRange:[40,4500],near:.1,nearMax:30,far:5e4,targetMargin:500,clearance:[.05,.03],floorGap:.01,aheadMax:50,marchLimit:1e5,marchStep:.05,hopScale:300,exag:{near:1,far:30,dNear:400,dFar:12e3},exaggeration(n,t=Re.exag.near){const e=Re.exag;return bf(n,t,e.far,e.dNear,e.dFar)},normalExag:18,aoExag:18,outside:-4e3,handoverK:.8,drawBudget:200},nn={unit:1,minDistance:15,maxDistance:6e5,pitchRange:[100,4e4],near:.5,nearMax:300,far:45e4,targetMargin:5e3,clearance:[3,.03],floorGap:4,aheadMax:2e3,marchLimit:1e6,marchStep:.5,hopScale:3e4,exaggeration:1,normalExag:2,aoExag:1.3,slopeExag:1.3,outside:-4e3,drawBudget:500},hr={prologueShare:.1,windowMinDays:7,windowMaxDays:21},ur=[{range:3,dpr:1},{range:3.8,dpr:1.25},{range:4.6,dpr:1.5},{range:5.5,dpr:2}];function wf(){const t=new URLSearchParams(location.search).get("data")||"./data/";return t.endsWith("/")?t:`${t}/`}const qe=Math.PI/180,Sf=63710088e-1;function ii(n,t=0){return t+((n-t+180)%360+360)%360-180}class Fs{constructor({lon0:t,lat0:e,unit:i=1}={}){if(!Number.isFinite(t)||!Number.isFinite(e))throw new Error("TangentProjection needs lon0 and lat0");this.kind="tangent",this.lon0=t,this.lat0=e,this.unit=i,this.kx=Math.cos(e*qe)*111320/i,this.kz=110574/i}x(t){return(ii(t,this.lon0)-this.lon0)*this.kx}z(t){return-(t-this.lat0)*this.kz}toWorld(t){return[this.x(t[0]),this.z(t[1])]}toLonLat(t,e){return[ii(t/this.kx+this.lon0,this.lon0),-e/this.kz+this.lat0]}scaleAt(){return 1}convergenceAt(){return 0}jacobianAt(){return[[1/this.unit,0],[0,1/this.unit]]}rect([t,e,i,s]){return{x0:this.x(t),z0:this.z(s),x1:this.x(i),z1:this.z(e)}}}class Ef{constructor({kind:t="aeqd",lon0:e,lat0:i,lat1:s,unit:o=1e3}={}){if(!["aeqd","laea","equirect"].includes(t))throw new Error(`unknown table projection “${t}”`);if(!Number.isFinite(e)||!Number.isFinite(i))throw new Error("TableProjection needs lon0 and lat0");this.kind=t,this.lon0=e,this.lat0=i,this.lat1=Number.isFinite(s)?s:i,this.unit=o,this.R=Sf,this.sin0=Math.sin(i*qe),this.cos0=Math.cos(i*qe),this.cos1=Math.cos(this.lat1*qe)}toWorld(t){const e=this.R,i=(ii(t[0],this.lon0)-this.lon0)*qe,s=t[1]*qe;if(this.kind==="equirect")return[e*this.cos1*i/this.unit,-(e*(s-this.lat0*qe))/this.unit];const o=Math.sin(s),r=Math.cos(s),a=Math.cos(i),l=r*Math.sin(i),c=this.cos0*o-this.sin0*r*a,h=this.sin0*o+this.cos0*r*a;let u;if(this.kind==="aeqd"){const f=Math.hypot(l,c),d=Math.atan2(f,h);u=f<1e-15?1:d/f}else u=Math.sqrt(2/Math.max(1e-300,1+h));return[e*u*l/this.unit,-(e*u*c)/this.unit]}toLonLat(t,e){const i=this.R,s=t*this.unit,o=-e*this.unit;if(this.kind==="equirect")return[ii(this.lon0+s/(i*this.cos1)/qe,this.lon0),this.lat0+o/i/qe];const r=Math.hypot(s,o);if(r<1e-9)return[this.lon0,this.lat0];const a=this.kind==="aeqd"?r/i:2*Math.asin(Math.min(1,r/(2*i))),l=Math.sin(a),c=Math.cos(a),h=Math.asin(Math.max(-1,Math.min(1,c*this.sin0+o*l*this.cos0/r))),u=Math.atan2(s*l,r*this.cos0*c-o*this.sin0*l);return[ii(this.lon0+u/qe,this.lon0),h/qe]}jacobianAt(t){const i=t[1],s=25/(this.R*Math.max(1e-9,Math.cos(i*qe)))/qe,o=25/this.R/qe,r=this.toWorld([t[0]+s,i]),a=this.toWorld([t[0]-s,i]),l=this.toWorld([t[0],i-o]),c=this.toWorld([t[0],i+o]);return[[(r[0]-a[0])/(2*25),(l[0]-c[0])/(2*25)],[(r[1]-a[1])/(2*25),(l[1]-c[1])/(2*25)]]}scaleAt(t){const e=this.jacobianAt(t);return Math.sqrt(Math.abs(e[0][0]*e[1][1]-e[0][1]*e[1][0]))*this.unit}convergenceAt(t){const e=this.jacobianAt(t);return Math.atan2(-e[0][1],e[1][1])/qe}}function Tf(n){if(!n)throw new Error("projectionFor: no projection given");return n.kind==="tangent"?new Fs(n):new Ef(n)}function Af(n,t){const e=n.proj instanceof Fs?n.proj:new Fs(n.projection||n),i=t.toWorld([e.lon0,e.lat0]),s=25/e.unit,o=(y,v)=>t.toWorld(e.toLonLat(y,v)),r=o(s,0),a=o(-s,0),l=o(0,s),c=o(0,-s),h=[[(r[0]-a[0])/(2*s),(l[0]-c[0])/(2*s)],[(r[1]-a[1])/(2*s),(l[1]-c[1])/(2*s)]],u=h[0][0]*h[1][1]-h[0][1]*h[1][0],f=[[h[1][1]/u,-h[0][1]/u],[-h[1][0]/u,h[0][0]/u]],d=Math.sqrt(Math.abs(u)),g=Math.atan2(-h[0][1],h[1][1]),[x,m]=i,p=new Float64Array([h[0][0],0,h[1][0],0,0,d,0,0,h[0][1],0,h[1][1],0,x,0,m,1]);return{id:n.id,lon0:e.lon0,lat0:e.lat0,centre:i,J:h,Jinv:f,scale:d,alpha:g,convergenceDeg:g/qe,toTable:([y,v])=>[x+h[0][0]*y+h[0][1]*v,m+h[1][0]*y+h[1][1]*v],toBox:([y,v])=>{const M=y-x,S=v-m;return[f[0][0]*M+f[0][1]*S,f[1][0]*M+f[1][1]*S]},matrix:p}}function Cf(n,t){const[e,i]=t.toTable([n.target.x,n.target.z]);return{target:{x:e,y:(n.target.y??0)*t.scale,z:i},distance:n.distance*t.scale,yaw:n.yaw-t.alpha,pitch:n.pitch}}function sc(n,t){const[e,i]=t.toBox([n.target.x,n.target.z]);return{target:{x:e,y:(n.target.y??0)/t.scale,z:i},distance:n.distance/t.scale,yaw:n.yaw+t.alpha,pitch:n.pitch}}function wo(n,t=50){if(!n||n.length<2)return n;const e=[n[0]];for(let i=1;i<n.length;i++){const s=n[i-1],o=n[i],r=111.32*Math.cos((s[1]+o[1])/2*Math.PI/180),a=Math.hypot((o[0]-s[0])*r,(o[1]-s[1])*110.574),l=Math.max(1,Math.ceil(a/t));for(let c=1;c<l;c++)e.push([s[0]+(o[0]-s[0])*c/l,s[1]+(o[1]-s[1])*c/l]);e.push(o)}return e}function bi(n){if(!n)return null;if(n.type==="Point")return n.coordinates;if(n.type==="LineString")return n.coordinates[Math.floor(n.coordinates.length/2)];if(n.type==="MultiPoint")return n.coordinates[0];const t=n.type==="Polygon"?[n.coordinates[0]]:n.type==="MultiPolygon"?n.coordinates.map(o=>o[0]):null;if(!t)return null;let e=0,i=0,s=0;for(const o of t)for(let r=0,a=o.length-1;r<o.length;a=r++){const l=o[a][0]*o[r][1]-o[r][0]*o[a][1];e+=l,i+=(o[a][0]+o[r][0])*l,s+=(o[a][1]+o[r][1])*l}return Math.abs(e)<1e-12?t[0][0]:[i/(3*e),s/(3*e)]}async function oc(n){var c;const t=await fetch(n);if(!t.ok)throw new Error(`${n}: HTTP ${t.status}`);const e=await t.blob(),i=await createImageBitmap(e,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),s=i.width,o=i.height;let r;typeof OffscreenCanvas<"u"?r=new OffscreenCanvas(s,o):(r=document.createElement("canvas"),r.width=s,r.height=o);const a=r.getContext("2d",{willReadFrequently:!0});a.imageSmoothingEnabled=!1,a.drawImage(i,0,0);const l=a.getImageData(0,0,s,o).data;return(c=i.close)==null||c.call(i),{px:l,W:s,H:o}}function Rf(n,t,e,i,s,o=4){const r=new Float32Array(t*e);for(let a=0,l=0;a<t*e;a++,l+=o)r[a]=(n[l]*256+n[l+1])*i+s;return r}function Lf(n,t,e,i=4){const s=new Uint8Array(t*e);for(let o=0,r=0;o<t*e;o++,r+=i)s[o]=n[r];return s}function kf(n){let t=0,e=0;for(let i=0;i<n.length;i+=7)n[i]>0||(t++,n[i]>-1.6&&e++);return t>100&&e>t*.95}function Pf(n,t,e,i,s){const o=$u(t,e,r=>n[r]>0,i,s);for(let r=0;r<n.length;r++){if(n[r]>0)continue;const a=o[r]/1e3;n[r]=-(1+30*a+3600*(1-Math.exp(-Math.max(0,a-.6)/6)))}}function ac(n,t,e,i,s=1){let o=Float32Array.from(n);const r=new Float32Array(t*e),a=1/(2*i+1);for(let l=0;l<s;l++){for(let c=0;c<e;c++){const h=c*t;let u=0;for(let f=-i;f<=i;f++)u+=o[h+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)r[h+f]=u*a,u+=o[h+Math.min(t-1,f+i+1)]-o[h+Math.max(0,f-i)]}for(let c=0;c<t;c++){let h=0;for(let u=-i;u<=i;u++)h+=r[Math.min(e-1,Math.max(0,u))*t+c];for(let u=0;u<e;u++)o[u*t+c]=h*a,h+=r[Math.min(e-1,u+i+1)*t+c]-r[Math.max(0,u-i)*t+c]}}return o}function rc(n,t,e,i,s,o){const r=o*o;let a=0;i[0]=0,s[0]=-1/0,s[1]=1/0;for(let l=1;l<t;l++){let c=(n[l]+l*l*r-(n[i[a]]+i[a]*i[a]*r))/(2*r*(l-i[a]));for(;c<=s[a];)a--,c=(n[l]+l*l*r-(n[i[a]]+i[a]*i[a]*r))/(2*r*(l-i[a]));a++,i[a]=l,s[a]=c,s[a+1]=1/0}a=0;for(let l=0;l<t;l++){for(;s[a+1]<l;)a++;const c=(l-i[a])*o;e[l]=c*c+n[i[a]]}}function $u(n,t,e,i=1,s=1){const r=new Float64Array(n*t);for(let d=0;d<n*t;d++)r[d]=e(d)?0:1e20;const a=Math.max(n,t),l=new Float64Array(a),c=new Float64Array(a),h=new Int32Array(a),u=new Float64Array(a+1);for(let d=0;d<n;d++){for(let g=0;g<t;g++)l[g]=r[g*n+d];rc(l,t,c,h,u,s);for(let g=0;g<t;g++)r[g*n+d]=c[g]}const f=new Float32Array(n*t);for(let d=0;d<t;d++){const g=d*n;for(let x=0;x<n;x++)l[x]=r[g+x];rc(l,n,c,h,u,i);for(let x=0;x<n;x++)f[g+x]=Math.sqrt(c[x])}return f}function zf(n,t,e,i,s,o=1.3){const r=Math.max(1,Math.round(Math.max(t,e)/512)),a=Math.ceil(t/r),l=Math.ceil(e/r),c=new Float32Array(a*l);for(let d=0;d<l;d++)for(let g=0;g<a;g++){let x=0,m=0;for(let p=d*r;p<Math.min(e,(d+1)*r);p++)for(let y=g*r;y<Math.min(t,(g+1)*r);y++)x+=Math.max(0,n[p*t+y]),m++;c[d*a+g]=x/m*o}const h=new Float32Array(a*l),u=[1,2,3,5,7,10,14,19,26,34],f=[];for(let d=0;d<8;d++)f.push([Math.cos(d*Math.PI/4),Math.sin(d*Math.PI/4)]);for(let d=0;d<l;d++)for(let g=0;g<a;g++){const x=c[d*a+g];if(x<=0){h[d*a+g]=1;continue}let m=0;for(const[p,y]of f){let v=0;const M=Math.hypot(p*i,y*s)*r;for(const S of u){const T=Math.round(g+p*S),A=Math.round(d+y*S);if(T<0||A<0||T>=a||A>=l)break;const k=(c[A*a+T]-x)/(S*M);k>v&&(v=k)}m+=v/Math.sqrt(1+v*v)}h[d*a+g]=1-m/8*.95}return{data:h,w:a,h:l,f:r}}function Df(n,t,e,i,s,o,r=2){const a=new Uint8Array(t*e*4);for(let l=0;l<e;l++){const c=Math.max(0,l-1),h=Math.min(e-1,l+1);for(let u=0;u<t;u++){const f=l*t+u,d=Math.max(0,u-1),g=Math.min(t-1,u+1),x=(n[l*t+g]-n[l*t+d])/((g-d)*i),m=(n[h*t+u]-n[c*t+u])/((h-c)*s),p=-x*r,y=-m*r,v=Math.hypot(p,1,y);a[f*4]=Math.round((p/v*.5+.5)*255),a[f*4+1]=Math.round((1/v*.5+.5)*255),a[f*4+2]=Math.round((y/v*.5+.5)*255);let M=1;if(o){const S=Math.min(o.w-1.001,Math.max(0,(u+.5)/o.f-.5)),T=Math.min(o.h-1.001,Math.max(0,(l+.5)/o.f-.5)),A=S|0,k=T|0,_=S-A,w=T-k,C=k*o.w+A,F=o.data,z=Math.min(o.w-1,A+1)-A,P=Math.min(o.h-1,k+1)-k,B=F[C]+(F[C+z]-F[C])*_,X=F[C+P*o.w]+(F[C+P*o.w+z]-F[C+P*o.w])*_;M=B+(X-B)*w}a[f*4+3]=Math.round(Math.max(0,Math.min(1,M))*255)}}return a}function If(n,t,e,i,s){const o=t*e,r=i*s/1e6,a=new Float32Array(o);let l=0,c=0;for(let m=0;m<o;m++)n[m]>0&&(a[m]=r,n[m]>l&&(l=n[m]),c++);if(!c)return a;const h=Math.min(65536,Math.ceil(l)+2),u=m=>Math.min(h-1,Math.floor(m/l*(h-2))),f=new Uint32Array(h+1);for(let m=0;m<o;m++)n[m]>0&&f[u(n[m])+1]++;for(let m=0;m<h;m++)f[m+1]+=f[m];const d=new Uint32Array(c),g=f.slice();for(let m=0;m<o;m++)n[m]>0&&(d[g[u(n[m])]++]=m);const x=Math.hypot(i,s);for(let m=c-1;m>=0;m--){const p=d[m],y=p%t,v=(p-y)/t,M=n[p];let S=-1,T=0;for(let A=-1;A<=1;A++){const k=v+A;if(!(k<0||k>=e))for(let _=-1;_<=1;_++){if(!_&&!A)continue;const w=y+_;if(w<0||w>=t)continue;const C=k*t+w,F=(M-n[C])/(_&&A?x:_?i:s);F>T&&(T=F,S=C)}}S>=0&&n[S]>0&&(a[S]+=a[p])}return a}function Uf(n,t,e,i,s,o){const r=e*i,a=new Uint8Array(r*4),l=If(n,e,i,s,o),c=s*o/1e6,h=Math.max(.04,4*c),u=new Float32Array(r);for(let p=0;p<r;p++)u[p]=n[p]>0?Math.max(0,Math.min(1,Math.log10(Math.max(1e-9,l[p])/h)/1.6)):0;const f=ac(u,e,i,1,2),d=$u(e,i,p=>n[p]<=0,s,o),g=new Float32Array(r);for(let p=0;p<i;p++)for(let y=0;y<e;y++){const v=p*e+y;if(n[v]<=0||n[v]>9)continue;const M=Math.min(e-1,y+1),S=Math.max(0,y-1),T=Math.min(i-1,p+1),A=Math.max(0,p-1),k=Math.hypot((n[p*e+M]-n[p*e+S])/((M-S)*s),(n[T*e+y]-n[A*e+y])/((T-A)*o));g[v]=d[v]<260+Math.max(s,o)&&k<.12?1:0}const x=ac(g,e,i,1,1),m=1.5*Math.min(1,70/Math.max(s,o));for(let p=0;p<r;p++)a[p*4]=t?t[p]:n[p]>0?82:0,a[p*4+1]=Math.round(255*Math.min(1,x[p]*m)),a[p*4+2]=Math.round(255*Math.min(1,f[p]*1.6)),a[p*4+3]=0;return a}function Ff({heightPx:n,rainPx:t,W:e,H:i,scale:s,offset:o,mx:r,mz:a,normalExag:l=2,aoExag:c=1.3,land:h=!0,stride:u=4}){if(!Number.isFinite(s)||!Number.isFinite(o))throw new Error("a pack needs its height scale and offset (DATA.md §2 makes both mandatory)");const f=Rf(n,e,i,s,o,u),d=kf(f);d&&Pf(f,e,i,r,a);const g=t?Lf(t,e,i,u):null,x=zf(f,e,i,r,a,c),m=Df(f,e,i,r,a,x,l),p=h?Uf(f,g,e,i,r,a):null;let y=1/0,v=-1/0;for(let M=0;M<f.length;M++)f[M]<y&&(y=f[M]),f[M]>v&&(v=f[M]);return{metres:f,normals:m,land:p,flatSea:d,lo:y,hi:v,normalExag:l}}async function Ke(n,t,e){try{const i=await fetch(n);if(!i.ok)throw new Error(`HTTP ${i.status}`);return await i.json()}catch(i){if(t===void 0)throw new Error(`${n}: ${i.message}`);return e==null||e(`${n}: ${i.message} (carrying on without it)`),t}}const zn=(n,t)=>Array.isArray(n)?n:Array.isArray(n==null?void 0:n[t])?n[t]:[],Nf=n=>Array.isArray(n)&&n.length>=2&&typeof n[0]=="number"&&typeof n[1]=="number";function Xa(n,t){if(Array.isArray(n)){if(Nf(n)){n[0]=ii(n[0],t);return}for(const e of n)Xa(e,t)}}function xi(n,t){if(n)if(n.type==="FeatureCollection")for(const e of n.features||[])xi(e,t);else if(n.type==="Feature")xi(n.geometry,t);else if(n.type==="GeometryCollection")for(const e of n.geometries||[])xi(e,t);else n.coordinates&&Xa(n.coordinates,t)}const Of=new Set(["coordinates","lonlat","points","polygon","target","centre"]);function So(n,t){if(Array.isArray(n)){for(const e of n)e&&typeof e=="object"&&So(e,t);return}if(!(!n||typeof n!="object"))for(const[e,i]of Object.entries(n))Of.has(e)&&Array.isArray(i)?Xa(i,t):i&&typeof i=="object"&&So(i,t)}function Bf(n,t){const e=ii(n[0],t);return[e,n[1],e+(n[2]-n[0]),n[3]]}function lc(n,t,e,{normalExag:i=2,aoExag:s=1.3,land:o=!0}={}){var c;const r=n.extent?{x0:n.extent[0],z0:n.extent[1],x1:n.extent[2],z1:n.extent[3]}:t.rect(n.bounds),[a,l]=n.size;if(!n.height||!Number.isFinite(n.height.scale)||!Number.isFinite(n.height.offset))throw new Error(`pack ${n.id}: height.scale and height.offset are mandatory (DATA.md §2)`);return{id:n.id,kind:n.kind??(n.extent?"table":"box"),name:n.name||n.id,desc:n,rect:r,W:a,H:l,mx:(r.x1-r.x0)*t.unit/a,mz:(r.z1-r.z0)*t.unit/l,heightUrl:e(n.height.file),rainUrl:(c=n.rain)!=null&&c.file?e(n.rain.file):null,scale:n.height.scale,offset:n.height.offset,normalExag:i,aoExag:s,land:o,sources:n.sources||[],data:null}}function cc(n,t){if(!(!n||typeof n!="object")){!n.zone&&n.clock&&t.has(n.clock)&&(n.zone=t.get(n.clock).offset);for(const e of n.alt||[])!e.zone&&e.clock&&t.has(e.clock)&&(e.zone=t.get(e.clock).offset)}}async function Hf(n,t=console.warn){const e=z=>new URL(z,new URL(n,location.href)).href,i=await Ke(e("manifest.json"));if(!i.projection||!i.table)throw new Error("manifest.json needs a projection and a table (DATA.md §2)");const s=Tf(i.projection),o=s.lon0,r=i.table,[a,l,c,h,u,f,d,g,x,m]=await Promise.all([Ke(e("chapters.json"),[],t),Ke(e("clocks.json"),[],t),Ke(e("places.json"),[],t),Ke(e("events.json"),[],t),Ke(e("sources.json"),[],t),Ke(e("routes.json"),[],t),Ke(e("fronts/manifest.json"),{keyframes:[],lines:null},t),Ke(e(r.labels||"table/labels.json"),[],t),Ke(e(r.coast||"table/coast.json"),null,t),Ke(e("boxes/manifest.json"),{boxes:[]},t)]),p=zn(d,"keyframes"),[y,v]=await Promise.all([Promise.all(p.map(z=>Ke(e(z.file),null,t))),d!=null&&d.lines?Ke(e(d.lines),null,t):null]),M=zn(c,"places"),S=zn(h,"events"),T=zn(f,"routes"),A=zn(g,"labels");for(const z of M)xi(z.geometry,o);for(const z of S)So(z,o);for(const z of T)So(z,o);for(const z of A)Xa(z.lonlat,o);xi(x,o),xi(x==null?void 0:x.strokes,o);for(const z of y)xi(z,o);xi(v,o);const k=zn(l,"clocks"),_=new Map(k.map(z=>[z.id,z]));for(const z of S)cc(z.when,_);for(const z of T)cc(z.when,_);const w=lc(r,s,e,{normalExag:Re.normalExag,aoExag:Re.aoExag,land:!1}),C=zn(m,"boxes").map(z=>{var J;const P={...z.projection,kind:"tangent",unit:((J=z.projection)==null?void 0:J.unit)??nn.unit};P.lon0=ii(P.lon0,o);const B={...z,bounds:Bf(z.bounds,o),projection:P},X=new Fs(P);return{...B,proj:X,exaggeration:z.exaggeration??nn.exaggeration,placement:Af({...B,proj:X},s),pack:lc(B,X,e,{normalExag:nn.normalExag,aoExag:nn.aoExag,land:!0})}}),F={base:n,abs:e,manifest:i,proj:s,table:w,packs:[w],chapters:zn(a,"chapters"),clocks:k,clockById:_,places:M,events:S,sources:zn(u,"sources"),routes:T,fronts:{manifest:d,keyframes:new Map(p.map((z,P)=>[z.id,{...z,geojson:y[P]}])),lines:v},labels:A,coast:x,boxes:C,boxById:new Map(C.map(z=>[z.id,z])),kits:null};return F.loadBox=(z,P)=>Gf(F,z,P),F}async function Gf(n,t,{decoder:e=null,warn:i=console.warn}={}){const s=n.boxById.get(t);if(!s)throw new Error(`no box “${t}” in boxes/manifest.json`);const o=!e,r=e||new Vu(1,i);try{const[a,l,c,h]=await Promise.all([r.decode(s.pack),s.battle?Ke(n.abs(s.battle),null,i):null,n.kits?n.kits.ships:Ke(n.abs("kits/ships.json"),[],i),n.kits?n.kits.aircraft:Ke(n.abs("kits/aircraft.json"),[],i)]);return n.kits||(n.kits={ships:zn(c,"ships"),aircraft:zn(h,"aircraft")}),l&&So(l,s.proj.lon0),{box:s,pack:{...s.pack,data:a},battle:l,kits:n.kits}}finally{o&&r.dispose()}}class Vu{constructor(t=2,e=console.warn){this.warn=e,this.jobs=new Map,this.next=1,this.workers=[],this.free=[],this.queue=[];try{for(let i=0;i<t;i++){const s=new Worker(new URL(""+new URL("worker-Do_qXMW9.js",import.meta.url).href,import.meta.url),{type:"module"});s.onmessage=o=>this.message(s,o.data),s.onerror=o=>{var r;(r=o.preventDefault)==null||r.call(o),this.fallback=!0;for(const[a,l]of this.jobs)l.worker===s&&this.mainThread(a,l)},this.workers.push(s),this.free.push(s)}}catch{this.fallback=!0}}decode(t){return new Promise((e,i)=>{const s=this.next++,o={pack:t,resolve:e,reject:i};this.jobs.set(s,o),this.fallback||!this.workers.length?this.mainThread(s,o):(this.queue.push(s),this.pump())})}pump(){for(;this.free.length&&this.queue.length;){const t=this.queue.shift(),e=this.jobs.get(t),i=this.free.pop();e.worker=i;const s=e.pack;i.postMessage({job:t,heightUrl:s.heightUrl,rainUrl:s.rainUrl,W:s.W,H:s.H,scale:s.scale,offset:s.offset,mx:s.mx,mz:s.mz,normalExag:s.normalExag,aoExag:s.aoExag,land:s.land})}}message(t,e){const i=this.jobs.get(e.job);if(i){if(e.warn)return this.warn(e.warn);this.jobs.delete(e.job),this.free.push(t),e.ok?i.resolve(e):/OffscreenCanvas|getContext|createImageBitmap/i.test(e.message)?(this.fallback=!0,this.jobs.set(e.job,i),this.mainThread(e.job,i)):i.reject(new Error(e.message)),this.pump()}}async mainThread(t,e){try{const i=e.pack,s=await oc(i.heightUrl);if(s.W!==i.W||s.H!==i.H)throw new Error(`${i.heightUrl} is ${s.W}×${s.H}, the manifest says ${i.W}×${i.H}`);let o=null;i.rainUrl&&(o=await oc(i.rainUrl).then(a=>a.W===i.W&&a.H===i.H?a.px:null).catch(()=>null));const r=Ff({heightPx:s.px,rainPx:o,W:i.W,H:i.H,scale:i.scale,offset:i.offset,mx:i.mx,mz:i.mz,normalExag:i.normalExag,aoExag:i.aoExag,land:i.land});this.jobs.delete(t),e.resolve(r)}catch(i){this.jobs.delete(t),e.reject(i)}}dispose(){for(const t of this.workers)t.terminate();this.workers=[],this.free=[]}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ul="160",$f=0,hc=1,Vf=2,Wu=1,Wf=2,Zn=3,Ai=0,an=1,fn=2,wi=0,Hi=1,Eo=2,uc=3,dc=4,jf=5,Oi=100,Xf=101,qf=102,fc=103,pc=104,Kf=200,Yf=201,Zf=202,Jf=203,hl=204,ul=205,Qf=206,tp=207,ep=208,np=209,ip=210,sp=211,op=212,ap=213,rp=214,lp=0,cp=1,hp=2,Pa=3,up=4,dp=5,fp=6,pp=7,ju=0,mp=1,gp=2,Si=0,vp=1,xp=2,yp=3,Mp=4,_p=5,bp=6,Xu=300,Ns=301,Os=302,dl=303,fl=304,qa=306,za=1e3,pn=1001,pl=1002,Le=1003,mc=1004,dr=1005,$e=1006,wp=1007,Ki=1008,An=1009,Sp=1010,Ep=1011,Fl=1012,qu=1013,Qn=1014,ti=1015,Yi=1016,Ku=1017,Yu=1018,Gi=1020,Tp=1021,Mn=1023,Ap=1024,Cp=1025,$i=1026,Bs=1027,Nl=1028,Zu=1029,Rp=1030,Ju=1031,Qu=1033,fr=33776,pr=33777,mr=33778,gr=33779,gc=35840,vc=35841,xc=35842,yc=35843,td=36196,Mc=37492,_c=37496,bc=37808,wc=37809,Sc=37810,Ec=37811,Tc=37812,Ac=37813,Cc=37814,Rc=37815,Lc=37816,kc=37817,Pc=37818,zc=37819,Dc=37820,Ic=37821,vr=36492,Uc=36494,Fc=36495,Lp=36283,Nc=36284,Oc=36285,Bc=36286,ed=3e3,Vi=3001,kp=3200,Pp=3201,zp=0,Dp=1,Tn="",Fe="srgb",si="srgb-linear",Ol="display-p3",Ka="display-p3-linear",Da="linear",me="srgb",Ia="rec709",Ua="p3",ss=7680,Hc=519,Ip=512,Up=513,Fp=514,nd=515,Np=516,Op=517,Bp=518,Hp=519,Gc=35044,Un=35048,$c="300 es",ml=1035,ei=2e3,Fa=2001;class Ws{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let o=0,r=s.length;o<r;o++)s[o].call(this,t);t.target=null}}}const We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Vc=1234567;const go=Math.PI/180,To=180/Math.PI;function js(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]).toLowerCase()}function en(n,t,e){return Math.max(t,Math.min(e,n))}function Bl(n,t){return(n%t+t)%t}function Gp(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function $p(n,t,e){return n!==t?(e-n)/(t-n):0}function vo(n,t,e){return(1-e)*n+e*t}function Vp(n,t,e,i){return vo(n,t,1-Math.exp(-e*i))}function Wp(n,t=1){return t-Math.abs(Bl(n,t*2)-t)}function jp(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Xp(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function qp(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Kp(n,t){return n+Math.random()*(t-n)}function Yp(n){return n*(.5-Math.random())}function Zp(n){n!==void 0&&(Vc=n);let t=Vc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Jp(n){return n*go}function Qp(n){return n*To}function gl(n){return(n&n-1)===0&&n!==0}function t0(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Na(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function e0(n,t,e,i,s){const o=Math.cos,r=Math.sin,a=o(e/2),l=r(e/2),c=o((t+i)/2),h=r((t+i)/2),u=o((t-i)/2),f=r((t-i)/2),d=o((i-t)/2),g=r((i-t)/2);switch(s){case"XYX":n.set(a*h,l*u,l*f,a*c);break;case"YZY":n.set(l*f,a*h,l*u,a*c);break;case"ZXZ":n.set(l*u,l*f,a*h,a*c);break;case"XZX":n.set(a*h,l*g,l*d,a*c);break;case"YXY":n.set(l*d,a*h,l*g,a*c);break;case"ZYZ":n.set(l*g,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ss(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Je(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const tn={DEG2RAD:go,RAD2DEG:To,generateUUID:js,clamp:en,euclideanModulo:Bl,mapLinear:Gp,inverseLerp:$p,lerp:vo,damp:Vp,pingpong:Wp,smoothstep:jp,smootherstep:Xp,randInt:qp,randFloat:Kp,randFloatSpread:Yp,seededRandom:Zp,degToRad:Jp,radToDeg:Qp,isPowerOfTwo:gl,ceilPowerOfTwo:t0,floorPowerOfTwo:Na,setQuaternionFromProperEuler:e0,normalize:Je,denormalize:Ss};class qt{constructor(t=0,e=0){qt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(en(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*i-r*s+t.x,this.y=o*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ie{constructor(t,e,i,s,o,r,a,l,c){ie.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,r,a,l,c)}set(t,e,i,s,o,r,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=o,h[5]=l,h[6]=i,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,r=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],d=i[5],g=i[8],x=s[0],m=s[3],p=s[6],y=s[1],v=s[4],M=s[7],S=s[2],T=s[5],A=s[8];return o[0]=r*x+a*y+l*S,o[3]=r*m+a*v+l*T,o[6]=r*p+a*M+l*A,o[1]=c*x+h*y+u*S,o[4]=c*m+h*v+u*T,o[7]=c*p+h*M+u*A,o[2]=f*x+d*y+g*S,o[5]=f*m+d*v+g*T,o[8]=f*p+d*M+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*r*h-e*a*c-i*o*h+i*a*l+s*o*c-s*r*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*r-a*c,f=a*l-h*o,d=c*o-r*l,g=e*u+i*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=u*x,t[1]=(s*c-h*i)*x,t[2]=(a*i-s*r)*x,t[3]=f*x,t[4]=(h*e-s*l)*x,t[5]=(s*o-a*e)*x,t[6]=d*x,t[7]=(i*l-c*e)*x,t[8]=(r*e-i*o)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,o,r,a){const l=Math.cos(o),c=Math.sin(o);return this.set(i*l,i*c,-i*(l*r+c*a)+r+t,-s*c,s*l,-s*(-c*r+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(xr.makeScale(t,e)),this}rotate(t){return this.premultiply(xr.makeRotation(-t)),this}translate(t,e){return this.premultiply(xr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const xr=new ie;function id(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Oa(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function n0(){const n=Oa("canvas");return n.style.display="block",n}const Wc={};function xo(n){n in Wc||(Wc[n]=!0,console.warn(n))}const jc=new ie().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Xc=new ie().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),$o={[si]:{transfer:Da,primaries:Ia,toReference:n=>n,fromReference:n=>n},[Fe]:{transfer:me,primaries:Ia,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Ka]:{transfer:Da,primaries:Ua,toReference:n=>n.applyMatrix3(Xc),fromReference:n=>n.applyMatrix3(jc)},[Ol]:{transfer:me,primaries:Ua,toReference:n=>n.convertSRGBToLinear().applyMatrix3(Xc),fromReference:n=>n.applyMatrix3(jc).convertLinearToSRGB()}},i0=new Set([si,Ka]),de={enabled:!0,_workingColorSpace:si,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!i0.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=$o[t].toReference,s=$o[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return $o[n].primaries},getTransfer:function(n){return n===Tn?Da:$o[n].transfer}};function Rs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function yr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let os;class sd{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{os===void 0&&(os=Oa("canvas")),os.width=t.width,os.height=t.height;const i=os.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=os}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Oa("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),o=s.data;for(let r=0;r<o.length;r++)o[r]=Rs(o[r]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Rs(e[i]/255)*255):e[i]=Rs(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let s0=0;class od{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:s0++}),this.uuid=js(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let r=0,a=s.length;r<a;r++)s[r].isDataTexture?o.push(Mr(s[r].image)):o.push(Mr(s[r]))}else o=Mr(s);i.url=o}return e||(t.images[this.uuid]=i),i}}function Mr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?sd.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let o0=0;class rn extends Ws{constructor(t=rn.DEFAULT_IMAGE,e=rn.DEFAULT_MAPPING,i=pn,s=pn,o=$e,r=Ki,a=Mn,l=An,c=rn.DEFAULT_ANISOTROPY,h=Tn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:o0++}),this.uuid=js(),this.name="",this.source=new od(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=o,this.minFilter=r,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new qt(0,0),this.repeat=new qt(1,1),this.center=new qt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(xo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Vi?Fe:Tn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Xu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case za:t.x=t.x-Math.floor(t.x);break;case pn:t.x=t.x<0?0:1;break;case pl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case za:t.y=t.y-Math.floor(t.y);break;case pn:t.y=t.y<0?0:1;break;case pl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return xo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Fe?Vi:ed}set encoding(t){xo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Vi?Fe:Tn}}rn.DEFAULT_IMAGE=null;rn.DEFAULT_MAPPING=Xu;rn.DEFAULT_ANISOTROPY=1;class Se{constructor(t=0,e=0,i=0,s=1){Se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s+r[12]*o,this.y=r[1]*e+r[5]*i+r[9]*s+r[13]*o,this.z=r[2]*e+r[6]*i+r[10]*s+r[14]*o,this.w=r[3]*e+r[7]*i+r[11]*s+r[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,o;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,M=(d+1)/2,S=(p+1)/2,T=(h+f)/4,A=(u+x)/4,k=(g+m)/4;return v>M&&v>S?v<.01?(i=0,s=.707106781,o=.707106781):(i=Math.sqrt(v),s=T/i,o=A/i):M>S?M<.01?(i=.707106781,s=0,o=.707106781):(s=Math.sqrt(M),i=T/s,o=k/s):S<.01?(i=.707106781,s=.707106781,o=0):(o=Math.sqrt(S),i=A/o,s=k/o),this.set(i,s,o,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-x)/y,this.z=(f-h)/y,this.w=Math.acos((c+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class a0 extends Ws{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Se(0,0,t,e),this.scissorTest=!1,this.viewport=new Se(0,0,t,e);const s={width:t,height:e,depth:1};i.encoding!==void 0&&(xo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Vi?Fe:Tn),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$e,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new rn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new od(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Vn extends a0{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class ad extends rn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Le,this.minFilter=Le,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class r0 extends rn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Le,this.minFilter=Le,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ts{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,o,r,a){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3];const f=o[r+0],d=o[r+1],g=o[r+2],x=o[r+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=x;return}if(u!==x||l!==f||c!==d||h!==g){let m=1-a;const p=l*f+c*d+h*g+u*x,y=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const S=Math.sqrt(v),T=Math.atan2(S,p*y);m=Math.sin(m*T)/S,a=Math.sin(a*T)/S}const M=a*y;if(l=l*m+f*M,c=c*m+d*M,h=h*m+g*M,u=u*m+x*M,m===1-a){const S=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=S,c*=S,h*=S,u*=S}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,o,r){const a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=o[r],f=o[r+1],d=o[r+2],g=o[r+3];return t[e]=a*g+h*u+l*d-c*f,t[e+1]=l*g+h*f+c*u-a*d,t[e+2]=c*g+h*d+a*f-l*u,t[e+3]=h*g-a*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,o=t._z,r=t._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),u=a(o/2),f=l(i/2),d=l(s/2),g=l(o/2);switch(r){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],o=e[8],r=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=i+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(o-c)*d,this._z=(r-s)*d}else if(i>a&&i>u){const d=2*Math.sqrt(1+i-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(o+c)/d}else if(a>u){const d=2*Math.sqrt(1+a-i-u);this._w=(o-c)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-i-a);this._w=(r-s)/d,this._x=(o+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(en(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,o=t._z,r=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+r*a+s*c-o*l,this._y=s*h+r*l+o*a-i*c,this._z=o*h+r*c+i*l-s*a,this._w=r*h-i*a-s*l-o*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,o=this._z,r=this._w;let a=r*t._w+i*t._x+s*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=i,this._y=s,this._z=o,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*i+e*this._x,this._y=d*s+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=r*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(o),i*Math.cos(o),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class j{constructor(t=0,e=0,i=0){j.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6]*s,this.y=o[1]*e+o[4]*i+o[7]*s,this.z=o[2]*e+o[5]*i+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=t.elements,r=1/(o[3]*e+o[7]*i+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*i+o[8]*s+o[12])*r,this.y=(o[1]*e+o[5]*i+o[9]*s+o[13])*r,this.z=(o[2]*e+o[6]*i+o[10]*s+o[14])*r,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,o=t.x,r=t.y,a=t.z,l=t.w,c=2*(r*s-a*i),h=2*(a*e-o*s),u=2*(o*i-r*e);return this.x=e+l*c+r*u-a*h,this.y=i+l*h+a*c-o*u,this.z=s+l*u+o*h-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s,this.y=o[1]*e+o[5]*i+o[9]*s,this.z=o[2]*e+o[6]*i+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,o=t.z,r=e.x,a=e.y,l=e.z;return this.x=s*l-o*a,this.y=o*r-i*l,this.z=i*a-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return _r.copy(this).projectOnVector(t),this.sub(_r)}reflect(t){return this.sub(_r.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(en(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _r=new j,qc=new ts;class Li{constructor(t=new j(1/0,1/0,1/0),e=new j(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Rn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Rn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Rn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const o=i.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,Rn):Rn.fromBufferAttribute(o,r),Rn.applyMatrix4(t.matrixWorld),this.expandByPoint(Rn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Vo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Vo.copy(i.boundingBox)),Vo.applyMatrix4(t.matrixWorld),this.union(Vo)}const s=t.children;for(let o=0,r=s.length;o<r;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Rn),Rn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Js),Wo.subVectors(this.max,Js),as.subVectors(t.a,Js),rs.subVectors(t.b,Js),ls.subVectors(t.c,Js),li.subVectors(rs,as),ci.subVectors(ls,rs),Pi.subVectors(as,ls);let e=[0,-li.z,li.y,0,-ci.z,ci.y,0,-Pi.z,Pi.y,li.z,0,-li.x,ci.z,0,-ci.x,Pi.z,0,-Pi.x,-li.y,li.x,0,-ci.y,ci.x,0,-Pi.y,Pi.x,0];return!br(e,as,rs,ls,Wo)||(e=[1,0,0,0,1,0,0,0,1],!br(e,as,rs,ls,Wo))?!1:(jo.crossVectors(li,ci),e=[jo.x,jo.y,jo.z],br(e,as,rs,ls,Wo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Rn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Rn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(jn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const jn=[new j,new j,new j,new j,new j,new j,new j,new j],Rn=new j,Vo=new Li,as=new j,rs=new j,ls=new j,li=new j,ci=new j,Pi=new j,Js=new j,Wo=new j,jo=new j,zi=new j;function br(n,t,e,i,s){for(let o=0,r=n.length-3;o<=r;o+=3){zi.fromArray(n,o);const a=s.x*Math.abs(zi.x)+s.y*Math.abs(zi.y)+s.z*Math.abs(zi.z),l=t.dot(zi),c=e.dot(zi),h=i.dot(zi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const l0=new Li,Qs=new j,wr=new j;class ai{constructor(t=new j,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):l0.setFromPoints(t).getCenter(i);let s=0;for(let o=0,r=t.length;o<r;o++)s=Math.max(s,i.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Qs.subVectors(t,this.center);const e=Qs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Qs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(wr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Qs.copy(t.center).add(wr)),this.expandByPoint(Qs.copy(t.center).sub(wr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Xn=new j,Sr=new j,Xo=new j,hi=new j,Er=new j,qo=new j,Tr=new j;class Hl{constructor(t=new j,e=new j(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Xn.copy(this.origin).addScaledVector(this.direction,e),Xn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Sr.copy(t).add(e).multiplyScalar(.5),Xo.copy(e).sub(t).normalize(),hi.copy(this.origin).sub(Sr);const o=t.distanceTo(e)*.5,r=-this.direction.dot(Xo),a=hi.dot(this.direction),l=-hi.dot(Xo),c=hi.lengthSq(),h=Math.abs(1-r*r);let u,f,d,g;if(h>0)if(u=r*l-a,f=r*a-l,g=o*h,u>=0)if(f>=-g)if(f<=g){const x=1/h;u*=x,f*=x,d=u*(u+r*f+2*a)+f*(r*u+f+2*l)+c}else f=o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*l)+c;else f=-o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-r*o+a)),f=u>0?-o:Math.min(Math.max(-o,-l),o),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-o,-l),o),d=f*(f+2*l)+c):(u=Math.max(0,-(r*o+a)),f=u>0?o:Math.min(Math.max(-o,-l),o),d=-u*u+f*(f+2*l)+c);else f=r>0?-o:o,u=Math.max(0,-(r*f+a)),d=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Sr).addScaledVector(Xo,f),d}intersectSphere(t,e){Xn.subVectors(t.center,this.origin);const i=Xn.dot(this.direction),s=Xn.dot(Xn)-i*i,o=t.radius*t.radius;if(s>o)return null;const r=Math.sqrt(o-s),a=i-r,l=i+r;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,o,r,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(i=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(o=(t.min.y-f.y)*h,r=(t.max.y-f.y)*h):(o=(t.max.y-f.y)*h,r=(t.min.y-f.y)*h),i>r||o>s||((o>i||isNaN(i))&&(i=o),(r<s||isNaN(s))&&(s=r),u>=0?(a=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Xn)!==null}intersectTriangle(t,e,i,s,o){Er.subVectors(e,t),qo.subVectors(i,t),Tr.crossVectors(Er,qo);let r=this.direction.dot(Tr),a;if(r>0){if(s)return null;a=1}else if(r<0)a=-1,r=-r;else return null;hi.subVectors(this.origin,t);const l=a*this.direction.dot(qo.crossVectors(hi,qo));if(l<0)return null;const c=a*this.direction.dot(Er.cross(hi));if(c<0||l+c>r)return null;const h=-a*hi.dot(Tr);return h<0?null:this.at(h/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pe{constructor(t,e,i,s,o,r,a,l,c,h,u,f,d,g,x,m){pe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,r,a,l,c,h,u,f,d,g,x,m)}set(t,e,i,s,o,r,a,l,c,h,u,f,d,g,x,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=o,p[5]=r,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/cs.setFromMatrixColumn(t,0).length(),o=1/cs.setFromMatrixColumn(t,1).length(),r=1/cs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*o,e[5]=i[5]*o,e[6]=i[6]*o,e[7]=0,e[8]=i[8]*r,e[9]=i[9]*r,e[10]=i[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,o=t.z,r=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const f=r*h,d=r*u,g=a*h,x=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+g*c,e[5]=f-x*c,e[9]=-a*l,e[2]=x-f*c,e[6]=g+d*c,e[10]=r*l}else if(t.order==="YXZ"){const f=l*h,d=l*u,g=c*h,x=c*u;e[0]=f+x*a,e[4]=g*a-d,e[8]=r*c,e[1]=r*u,e[5]=r*h,e[9]=-a,e[2]=d*a-g,e[6]=x+f*a,e[10]=r*l}else if(t.order==="ZXY"){const f=l*h,d=l*u,g=c*h,x=c*u;e[0]=f-x*a,e[4]=-r*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=r*h,e[9]=x-f*a,e[2]=-r*c,e[6]=a,e[10]=r*l}else if(t.order==="ZYX"){const f=r*h,d=r*u,g=a*h,x=a*u;e[0]=l*h,e[4]=g*c-d,e[8]=f*c+x,e[1]=l*u,e[5]=x*c+f,e[9]=d*c-g,e[2]=-c,e[6]=a*l,e[10]=r*l}else if(t.order==="YZX"){const f=r*l,d=r*c,g=a*l,x=a*c;e[0]=l*h,e[4]=x-f*u,e[8]=g*u+d,e[1]=u,e[5]=r*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*u+g,e[10]=f-x*u}else if(t.order==="XZY"){const f=r*l,d=r*c,g=a*l,x=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+x,e[5]=r*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*h,e[10]=x*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(c0,t,h0)}lookAt(t,e,i){const s=this.elements;return vn.subVectors(t,e),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),ui.crossVectors(i,vn),ui.lengthSq()===0&&(Math.abs(i.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),ui.crossVectors(i,vn)),ui.normalize(),Ko.crossVectors(vn,ui),s[0]=ui.x,s[4]=Ko.x,s[8]=vn.x,s[1]=ui.y,s[5]=Ko.y,s[9]=vn.y,s[2]=ui.z,s[6]=Ko.z,s[10]=vn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,r=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],d=i[13],g=i[2],x=i[6],m=i[10],p=i[14],y=i[3],v=i[7],M=i[11],S=i[15],T=s[0],A=s[4],k=s[8],_=s[12],w=s[1],C=s[5],F=s[9],z=s[13],P=s[2],B=s[6],X=s[10],J=s[14],Z=s[3],Y=s[7],st=s[11],tt=s[15];return o[0]=r*T+a*w+l*P+c*Z,o[4]=r*A+a*C+l*B+c*Y,o[8]=r*k+a*F+l*X+c*st,o[12]=r*_+a*z+l*J+c*tt,o[1]=h*T+u*w+f*P+d*Z,o[5]=h*A+u*C+f*B+d*Y,o[9]=h*k+u*F+f*X+d*st,o[13]=h*_+u*z+f*J+d*tt,o[2]=g*T+x*w+m*P+p*Z,o[6]=g*A+x*C+m*B+p*Y,o[10]=g*k+x*F+m*X+p*st,o[14]=g*_+x*z+m*J+p*tt,o[3]=y*T+v*w+M*P+S*Z,o[7]=y*A+v*C+M*B+S*Y,o[11]=y*k+v*F+M*X+S*st,o[15]=y*_+v*z+M*J+S*tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],o=t[12],r=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],x=t[7],m=t[11],p=t[15];return g*(+o*l*u-s*c*u-o*a*f+i*c*f+s*a*d-i*l*d)+x*(+e*l*d-e*c*f+o*r*f-s*r*d+s*c*h-o*l*h)+m*(+e*c*u-e*a*d-o*r*u+i*r*d+o*a*h-i*c*h)+p*(-s*a*h-e*l*u+e*a*f+s*r*u-i*r*f+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],x=t[13],m=t[14],p=t[15],y=u*m*c-x*f*c+x*l*d-a*m*d-u*l*p+a*f*p,v=g*f*c-h*m*c-g*l*d+r*m*d+h*l*p-r*f*p,M=h*x*c-g*u*c+g*a*d-r*x*d-h*a*p+r*u*p,S=g*u*l-h*x*l-g*a*f+r*x*f+h*a*m-r*u*m,T=e*y+i*v+s*M+o*S;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return t[0]=y*A,t[1]=(x*f*o-u*m*o-x*s*d+i*m*d+u*s*p-i*f*p)*A,t[2]=(a*m*o-x*l*o+x*s*c-i*m*c-a*s*p+i*l*p)*A,t[3]=(u*l*o-a*f*o-u*s*c+i*f*c+a*s*d-i*l*d)*A,t[4]=v*A,t[5]=(h*m*o-g*f*o+g*s*d-e*m*d-h*s*p+e*f*p)*A,t[6]=(g*l*o-r*m*o-g*s*c+e*m*c+r*s*p-e*l*p)*A,t[7]=(r*f*o-h*l*o+h*s*c-e*f*c-r*s*d+e*l*d)*A,t[8]=M*A,t[9]=(g*u*o-h*x*o-g*i*d+e*x*d+h*i*p-e*u*p)*A,t[10]=(r*x*o-g*a*o+g*i*c-e*x*c-r*i*p+e*a*p)*A,t[11]=(h*a*o-r*u*o-h*i*c+e*u*c+r*i*d-e*a*d)*A,t[12]=S*A,t[13]=(h*x*s-g*u*s+g*i*f-e*x*f-h*i*m+e*u*m)*A,t[14]=(g*a*s-r*x*s-g*i*l+e*x*l+r*i*m-e*a*m)*A,t[15]=(r*u*s-h*a*s+h*i*l-e*u*l-r*i*f+e*a*f)*A,this}scale(t){const e=this.elements,i=t.x,s=t.y,o=t.z;return e[0]*=i,e[4]*=s,e[8]*=o,e[1]*=i,e[5]*=s,e[9]*=o,e[2]*=i,e[6]*=s,e[10]*=o,e[3]*=i,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),o=1-i,r=t.x,a=t.y,l=t.z,c=o*r,h=o*a;return this.set(c*r+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*r,0,c*l-s*a,h*l+s*r,o*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,o,r){return this.set(1,i,o,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,o=e._x,r=e._y,a=e._z,l=e._w,c=o+o,h=r+r,u=a+a,f=o*c,d=o*h,g=o*u,x=r*h,m=r*u,p=a*u,y=l*c,v=l*h,M=l*u,S=i.x,T=i.y,A=i.z;return s[0]=(1-(x+p))*S,s[1]=(d+M)*S,s[2]=(g-v)*S,s[3]=0,s[4]=(d-M)*T,s[5]=(1-(f+p))*T,s[6]=(m+y)*T,s[7]=0,s[8]=(g+v)*A,s[9]=(m-y)*A,s[10]=(1-(f+x))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let o=cs.set(s[0],s[1],s[2]).length();const r=cs.set(s[4],s[5],s[6]).length(),a=cs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],Ln.copy(this);const c=1/o,h=1/r,u=1/a;return Ln.elements[0]*=c,Ln.elements[1]*=c,Ln.elements[2]*=c,Ln.elements[4]*=h,Ln.elements[5]*=h,Ln.elements[6]*=h,Ln.elements[8]*=u,Ln.elements[9]*=u,Ln.elements[10]*=u,e.setFromRotationMatrix(Ln),i.x=o,i.y=r,i.z=a,this}makePerspective(t,e,i,s,o,r,a=ei){const l=this.elements,c=2*o/(e-t),h=2*o/(i-s),u=(e+t)/(e-t),f=(i+s)/(i-s);let d,g;if(a===ei)d=-(r+o)/(r-o),g=-2*r*o/(r-o);else if(a===Fa)d=-r/(r-o),g=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,o,r,a=ei){const l=this.elements,c=1/(e-t),h=1/(i-s),u=1/(r-o),f=(e+t)*c,d=(i+s)*h;let g,x;if(a===ei)g=(r+o)*u,x=-2*u;else if(a===Fa)g=o*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const cs=new j,Ln=new pe,c0=new j(0,0,0),h0=new j(1,1,1),ui=new j,Ko=new j,vn=new j,Kc=new pe,Yc=new ts;class Ya{constructor(t=0,e=0,i=0,s=Ya.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,o=s[0],r=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(en(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-en(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(en(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-en(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(en(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-en(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Kc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Kc,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Yc.setFromEuler(this),this.setFromQuaternion(Yc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ya.DEFAULT_ORDER="XYZ";class Gl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let u0=0;const Zc=new j,hs=new ts,qn=new pe,Yo=new j,to=new j,d0=new j,f0=new ts,Jc=new j(1,0,0),Qc=new j(0,1,0),th=new j(0,0,1),p0={type:"added"},m0={type:"removed"};class mn extends Ws{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:u0++}),this.uuid=js(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=mn.DEFAULT_UP.clone();const t=new j,e=new Ya,i=new ts,s=new j(1,1,1);function o(){i.setFromEuler(e,!1)}function r(){e.setFromQuaternion(i,void 0,!1)}e._onChange(o),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pe},normalMatrix:{value:new ie}}),this.matrix=new pe,this.matrixWorld=new pe,this.matrixAutoUpdate=mn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=mn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return hs.setFromAxisAngle(t,e),this.quaternion.multiply(hs),this}rotateOnWorldAxis(t,e){return hs.setFromAxisAngle(t,e),this.quaternion.premultiply(hs),this}rotateX(t){return this.rotateOnAxis(Jc,t)}rotateY(t){return this.rotateOnAxis(Qc,t)}rotateZ(t){return this.rotateOnAxis(th,t)}translateOnAxis(t,e){return Zc.copy(t).applyQuaternion(this.quaternion),this.position.add(Zc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Jc,t)}translateY(t){return this.translateOnAxis(Qc,t)}translateZ(t){return this.translateOnAxis(th,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Yo.copy(t):Yo.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),to.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt(to,Yo,this.up):qn.lookAt(Yo,to,this.up),this.quaternion.setFromRotationMatrix(qn),s&&(qn.extractRotation(s.matrixWorld),hs.setFromRotationMatrix(qn),this.quaternion.premultiply(hs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(p0)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(m0)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),qn.multiply(t.parent.matrixWorld)),t.applyMatrix4(qn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(to,t,d0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(to,f0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++){const o=e[i];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let o=0,r=s.length;o<r;o++){const a=s[o];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];o(t.shapes,u)}else o(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(o(t.materials,this.material[l]));s.material=a}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(o(t.animations,l))}}if(e){const a=r(t.geometries),l=r(t.materials),c=r(t.textures),h=r(t.images),u=r(t.shapes),f=r(t.skeletons),d=r(t.animations),g=r(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=s,i;function r(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}mn.DEFAULT_UP=new j(0,1,0);mn.DEFAULT_MATRIX_AUTO_UPDATE=!0;mn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new j,Kn=new j,Ar=new j,Yn=new j,us=new j,ds=new j,eh=new j,Cr=new j,Rr=new j,Lr=new j;let Zo=!1;class Dn{constructor(t=new j,e=new j,i=new j){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),kn.subVectors(t,e),s.cross(kn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,i,s,o){kn.subVectors(s,e),Kn.subVectors(i,e),Ar.subVectors(t,e);const r=kn.dot(kn),a=kn.dot(Kn),l=kn.dot(Ar),c=Kn.dot(Kn),h=Kn.dot(Ar),u=r*c-a*a;if(u===0)return o.set(0,0,0),null;const f=1/u,d=(c*l-a*h)*f,g=(r*h-a*l)*f;return o.set(1-d-g,g,d)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getUV(t,e,i,s,o,r,a,l){return Zo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Zo=!0),this.getInterpolation(t,e,i,s,o,r,a,l)}static getInterpolation(t,e,i,s,o,r,a,l){return this.getBarycoord(t,e,i,s,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,Yn.x),l.addScaledVector(r,Yn.y),l.addScaledVector(a,Yn.z),l)}static isFrontFacing(t,e,i,s){return kn.subVectors(i,e),Kn.subVectors(t,e),kn.cross(Kn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return kn.subVectors(this.c,this.b),Kn.subVectors(this.a,this.b),kn.cross(Kn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Dn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Dn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,o){return Zo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Zo=!0),Dn.getInterpolation(t,this.a,this.b,this.c,e,i,s,o)}getInterpolation(t,e,i,s,o){return Dn.getInterpolation(t,this.a,this.b,this.c,e,i,s,o)}containsPoint(t){return Dn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Dn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,o=this.c;let r,a;us.subVectors(s,i),ds.subVectors(o,i),Cr.subVectors(t,i);const l=us.dot(Cr),c=ds.dot(Cr);if(l<=0&&c<=0)return e.copy(i);Rr.subVectors(t,s);const h=us.dot(Rr),u=ds.dot(Rr);if(h>=0&&u<=h)return e.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return r=l/(l-h),e.copy(i).addScaledVector(us,r);Lr.subVectors(t,o);const d=us.dot(Lr),g=ds.dot(Lr);if(g>=0&&d<=g)return e.copy(o);const x=d*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(i).addScaledVector(ds,a);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return eh.subVectors(o,s),a=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(eh,a);const p=1/(m+x+f);return r=x*p,a=f*p,e.copy(i).addScaledVector(us,r).addScaledVector(ds,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const rd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},Jo={h:0,s:0,l:0};function kr(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Zt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Fe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=i,de.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=de.workingColorSpace){if(t=Bl(t,1),e=en(e,0,1),i=en(i,0,1),e===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+e):i+e-i*e,r=2*i-o;this.r=kr(r,o,t+1/3),this.g=kr(r,o,t),this.b=kr(r,o,t-1/3)}return de.toWorkingColorSpace(this,s),this}setStyle(t,e=Fe){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=s[1],a=s[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Fe){const i=rd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Rs(t.r),this.g=Rs(t.g),this.b=Rs(t.b),this}copyLinearToSRGB(t){return this.r=yr(t.r),this.g=yr(t.g),this.b=yr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Fe){return de.fromWorkingColorSpace(je.copy(this),t),Math.round(en(je.r*255,0,255))*65536+Math.round(en(je.g*255,0,255))*256+Math.round(en(je.b*255,0,255))}getHexString(t=Fe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.fromWorkingColorSpace(je.copy(this),e);const i=je.r,s=je.g,o=je.b,r=Math.max(i,s,o),a=Math.min(i,s,o);let l,c;const h=(a+r)/2;if(a===r)l=0,c=0;else{const u=r-a;switch(c=h<=.5?u/(r+a):u/(2-r-a),r){case i:l=(s-o)/u+(s<o?6:0);break;case s:l=(o-i)/u+2;break;case o:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.fromWorkingColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=Fe){de.fromWorkingColorSpace(je.copy(this),t);const e=je.r,i=je.g,s=je.b;return t!==Fe?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(di),this.setHSL(di.h+t,di.s+e,di.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(di),t.getHSL(Jo);const i=vo(di.h,Jo.h,e),s=vo(di.s,Jo.s,e),o=vo(di.l,Jo.l,e);return this.setHSL(i,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*i+o[6]*s,this.g=o[1]*e+o[4]*i+o[7]*s,this.b=o[2]*e+o[5]*i+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const je=new Zt;Zt.NAMES=rd;let g0=0;class Do extends Ws{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:g0++}),this.uuid=js(),this.name="",this.type="Material",this.blending=Hi,this.side=Ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=hl,this.blendDst=ul,this.blendEquation=Oi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=Pa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ss,this.stencilZFail=ss,this.stencilZPass=ss,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Hi&&(i.blending=this.blending),this.side!==Ai&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==hl&&(i.blendSrc=this.blendSrc),this.blendDst!==ul&&(i.blendDst=this.blendDst),this.blendEquation!==Oi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Pa&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Hc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ss&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ss&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ss&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(o){const r=[];for(const a in o){const l=o[a];delete l.metadata,r.push(l)}return r}if(e){const o=s(t.textures),r=s(t.images);o.length>0&&(i.textures=o),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let o=0;o!==s;++o)i[o]=e[o].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ld extends Do{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ju,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ce=new j,Qo=new qt;class ke{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Gc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=ti,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Qo.fromBufferAttribute(this,e),Qo.applyMatrix3(t),this.setXY(e,Qo.x,Qo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix3(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix4(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyNormalMatrix(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.transformDirection(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ss(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Je(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ss(e,this.array)),e}setX(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ss(e,this.array)),e}setY(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ss(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ss(e,this.array)),e}setW(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),i=Je(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),i=Je(i,this.array),s=Je(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,o){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),i=Je(i,this.array),s=Je(s,this.array),o=Je(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Gc&&(t.usage=this.usage),t}}class cd extends ke{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class hd extends ke{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class we extends ke{constructor(t,e,i){super(new Float32Array(t),e,i)}}let v0=0;const Sn=new pe,Pr=new mn,fs=new j,xn=new Li,eo=new Li,Ue=new j;class Oe extends Ws{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:v0++}),this.uuid=js(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(id(t)?hd:cd)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new ie().getNormalMatrix(t);i.applyNormalMatrix(o),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Sn.makeRotationFromQuaternion(t),this.applyMatrix4(Sn),this}rotateX(t){return Sn.makeRotationX(t),this.applyMatrix4(Sn),this}rotateY(t){return Sn.makeRotationY(t),this.applyMatrix4(Sn),this}rotateZ(t){return Sn.makeRotationZ(t),this.applyMatrix4(Sn),this}translate(t,e,i){return Sn.makeTranslation(t,e,i),this.applyMatrix4(Sn),this}scale(t,e,i){return Sn.makeScale(t,e,i),this.applyMatrix4(Sn),this}lookAt(t){return Pr.lookAt(t),Pr.updateMatrix(),this.applyMatrix4(Pr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fs).negate(),this.translate(fs.x,fs.y,fs.z),this}setFromPoints(t){const e=[];for(let i=0,s=t.length;i<s;i++){const o=t[i];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new we(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Li);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new j(-1/0,-1/0,-1/0),new j(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const o=e[i];xn.setFromBufferAttribute(o),this.morphTargetsRelative?(Ue.addVectors(this.boundingBox.min,xn.min),this.boundingBox.expandByPoint(Ue),Ue.addVectors(this.boundingBox.max,xn.max),this.boundingBox.expandByPoint(Ue)):(this.boundingBox.expandByPoint(xn.min),this.boundingBox.expandByPoint(xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ai);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new j,1/0);return}if(t){const i=this.boundingSphere.center;if(xn.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];eo.setFromBufferAttribute(a),this.morphTargetsRelative?(Ue.addVectors(xn.min,eo.min),xn.expandByPoint(Ue),Ue.addVectors(xn.max,eo.max),xn.expandByPoint(Ue)):(xn.expandByPoint(eo.min),xn.expandByPoint(eo.max))}xn.getCenter(i);let s=0;for(let o=0,r=t.count;o<r;o++)Ue.fromBufferAttribute(t,o),s=Math.max(s,i.distanceToSquared(Ue));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ue.fromBufferAttribute(a,c),l&&(fs.fromBufferAttribute(t,c),Ue.add(fs)),s=Math.max(s,i.distanceToSquared(Ue))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.array,s=e.position.array,o=e.normal.array,r=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ke(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let w=0;w<a;w++)c[w]=new j,h[w]=new j;const u=new j,f=new j,d=new j,g=new qt,x=new qt,m=new qt,p=new j,y=new j;function v(w,C,F){u.fromArray(s,w*3),f.fromArray(s,C*3),d.fromArray(s,F*3),g.fromArray(r,w*2),x.fromArray(r,C*2),m.fromArray(r,F*2),f.sub(u),d.sub(u),x.sub(g),m.sub(g);const z=1/(x.x*m.y-m.x*x.y);isFinite(z)&&(p.copy(f).multiplyScalar(m.y).addScaledVector(d,-x.y).multiplyScalar(z),y.copy(d).multiplyScalar(x.x).addScaledVector(f,-m.x).multiplyScalar(z),c[w].add(p),c[C].add(p),c[F].add(p),h[w].add(y),h[C].add(y),h[F].add(y))}let M=this.groups;M.length===0&&(M=[{start:0,count:i.length}]);for(let w=0,C=M.length;w<C;++w){const F=M[w],z=F.start,P=F.count;for(let B=z,X=z+P;B<X;B+=3)v(i[B+0],i[B+1],i[B+2])}const S=new j,T=new j,A=new j,k=new j;function _(w){A.fromArray(o,w*3),k.copy(A);const C=c[w];S.copy(C),S.sub(A.multiplyScalar(A.dot(C))).normalize(),T.crossVectors(k,C);const z=T.dot(h[w])<0?-1:1;l[w*4]=S.x,l[w*4+1]=S.y,l[w*4+2]=S.z,l[w*4+3]=z}for(let w=0,C=M.length;w<C;++w){const F=M[w],z=F.start,P=F.count;for(let B=z,X=z+P;B<X;B+=3)_(i[B+0]),_(i[B+1]),_(i[B+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ke(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const s=new j,o=new j,r=new j,a=new j,l=new j,c=new j,h=new j,u=new j;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),x=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,x),r.fromBufferAttribute(e,m),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),a.add(h),l.add(h),c.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),o.fromBufferAttribute(e,f+1),r.fromBufferAttribute(e,f+2),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ue.fromBufferAttribute(t,e),Ue.normalize(),t.setXYZ(e,Ue.x,Ue.y,Ue.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h);let d=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?d=l[x]*a.data.stride+a.offset:d=l[x]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new ke(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Oe,i=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,i);e.setAttribute(a,c)}const o=this.morphAttributes;for(const a in o){const l=[],c=o[a];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=t(f,i);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,l=r.length;a<l;a++){const c=r[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const o=t.morphAttributes;for(const c in o){const h=[],u=o[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let c=0,h=r.length;c<h;c++){const u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const nh=new pe,Di=new Hl,ta=new ai,ih=new j,ps=new j,ms=new j,gs=new j,zr=new j,ea=new j,na=new qt,ia=new qt,sa=new qt,sh=new j,oh=new j,ah=new j,oa=new j,aa=new j;class ge extends mn{constructor(t=new Oe,e=new ld){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,o=i.morphAttributes.position,r=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(o&&a){ea.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const h=a[l],u=o[l];h!==0&&(zr.fromBufferAttribute(u,t),r?ea.addScaledVector(zr,h):ea.addScaledVector(zr.sub(e),h))}e.add(ea)}return e}raycast(t,e){const i=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ta.copy(i.boundingSphere),ta.applyMatrix4(o),Di.copy(t.ray).recast(t.near),!(ta.containsPoint(Di.origin)===!1&&(Di.intersectSphere(ta,ih)===null||Di.origin.distanceToSquared(ih)>(t.far-t.near)**2))&&(nh.copy(o).invert(),Di.copy(t.ray).applyMatrix4(nh),!(i.boundingBox!==null&&Di.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Di)))}_computeIntersections(t,e,i){let s;const o=this.geometry,r=this.material,a=o.index,l=o.attributes.position,c=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,d=o.drawRange;if(a!==null)if(Array.isArray(r))for(let g=0,x=f.length;g<x;g++){const m=f[g],p=r[m.materialIndex],y=Math.max(m.start,d.start),v=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let M=y,S=v;M<S;M+=3){const T=a.getX(M),A=a.getX(M+1),k=a.getX(M+2);s=ra(this,p,t,i,c,h,u,T,A,k),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){const y=a.getX(m),v=a.getX(m+1),M=a.getX(m+2);s=ra(this,r,t,i,c,h,u,y,v,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,x=f.length;g<x;g++){const m=f[g],p=r[m.materialIndex],y=Math.max(m.start,d.start),v=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let M=y,S=v;M<S;M+=3){const T=M,A=M+1,k=M+2;s=ra(this,p,t,i,c,h,u,T,A,k),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){const y=m,v=m+1,M=m+2;s=ra(this,r,t,i,c,h,u,y,v,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function x0(n,t,e,i,s,o,r,a){let l;if(t.side===an?l=i.intersectTriangle(r,o,s,!0,a):l=i.intersectTriangle(s,o,r,t.side===Ai,a),l===null)return null;aa.copy(a),aa.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(aa);return c<e.near||c>e.far?null:{distance:c,point:aa.clone(),object:n}}function ra(n,t,e,i,s,o,r,a,l,c){n.getVertexPosition(a,ps),n.getVertexPosition(l,ms),n.getVertexPosition(c,gs);const h=x0(n,t,e,i,ps,ms,gs,oa);if(h){s&&(na.fromBufferAttribute(s,a),ia.fromBufferAttribute(s,l),sa.fromBufferAttribute(s,c),h.uv=Dn.getInterpolation(oa,ps,ms,gs,na,ia,sa,new qt)),o&&(na.fromBufferAttribute(o,a),ia.fromBufferAttribute(o,l),sa.fromBufferAttribute(o,c),h.uv1=Dn.getInterpolation(oa,ps,ms,gs,na,ia,sa,new qt),h.uv2=h.uv1),r&&(sh.fromBufferAttribute(r,a),oh.fromBufferAttribute(r,l),ah.fromBufferAttribute(r,c),h.normal=Dn.getInterpolation(oa,ps,ms,gs,sh,oh,ah,new j),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new j,materialIndex:0};Dn.getNormal(ps,ms,gs,u.normal),h.face=u}return h}class Io extends Oe{constructor(t=1,e=1,i=1,s=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:o,depthSegments:r};const a=this;s=Math.floor(s),o=Math.floor(o),r=Math.floor(r);const l=[],c=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,i,e,t,r,o,0),g("z","y","x",1,-1,i,e,-t,r,o,1),g("x","z","y",1,1,t,i,e,s,r,2),g("x","z","y",1,-1,t,i,-e,s,r,3),g("x","y","z",1,-1,t,e,i,s,o,4),g("x","y","z",-1,-1,t,e,-i,s,o,5),this.setIndex(l),this.setAttribute("position",new we(c,3)),this.setAttribute("normal",new we(h,3)),this.setAttribute("uv",new we(u,2));function g(x,m,p,y,v,M,S,T,A,k,_){const w=M/A,C=S/k,F=M/2,z=S/2,P=T/2,B=A+1,X=k+1;let J=0,Z=0;const Y=new j;for(let st=0;st<X;st++){const tt=st*C-z;for(let N=0;N<B;N++){const K=N*w-F;Y[x]=K*y,Y[m]=tt*v,Y[p]=P,c.push(Y.x,Y.y,Y.z),Y[x]=0,Y[m]=0,Y[p]=T>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(N/A),u.push(1-st/k),J+=1}}for(let st=0;st<k;st++)for(let tt=0;tt<A;tt++){const N=f+tt+B*st,K=f+tt+B*(st+1),lt=f+(tt+1)+B*(st+1),_t=f+(tt+1)+B*st;l.push(N,K,_t),l.push(K,lt,_t),Z+=6}a.addGroup(d,Z,_),d+=Z,f+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Io(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Hs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Qe(n){const t={};for(let e=0;e<n.length;e++){const i=Hs(n[e]);for(const s in i)t[s]=i[s]}return t}function y0(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function ud(n){return n.getRenderTarget()===null?n.outputColorSpace:de.workingColorSpace}const M0={clone:Hs,merge:Qe};var _0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,b0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xe extends Do{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_0,this.fragmentShader=b0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Hs(t.uniforms),this.uniformsGroups=y0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class dd extends mn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pe,this.projectionMatrix=new pe,this.projectionMatrixInverse=new pe,this.coordinateSystem=ei}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class dn extends dd{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=To*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(go*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return To*2*Math.atan(Math.tan(go*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(go*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,o=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;o+=r.offsetX*s/l,e-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const vs=-90,xs=1;class w0 extends mn{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new dn(vs,xs,t,e);s.layers=this.layers,this.add(s);const o=new dn(vs,xs,t,e);o.layers=this.layers,this.add(o);const r=new dn(vs,xs,t,e);r.layers=this.layers,this.add(r);const a=new dn(vs,xs,t,e);a.layers=this.layers,this.add(a);const l=new dn(vs,xs,t,e);l.layers=this.layers,this.add(l);const c=new dn(vs,xs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,o,r,a,l]=e;for(const c of e)this.remove(c);if(t===ei)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Fa)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,o),t.setRenderTarget(i,1,s),t.render(e,r),t.setRenderTarget(i,2,s),t.render(e,a),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class fd extends rn{constructor(t,e,i,s,o,r,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ns,super(t,e,i,s,o,r,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class S0 extends Vn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(xo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Vi?Fe:Tn),this.texture=new fd(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:$e}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Io(5,5,5),o=new xe({name:"CubemapFromEquirect",uniforms:Hs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:an,blending:wi});o.uniforms.tEquirect.value=e;const r=new ge(s,o),a=e.minFilter;return e.minFilter===Ki&&(e.minFilter=$e),new w0(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,i,s){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,i,s);t.setRenderTarget(o)}}const Dr=new j,E0=new j,T0=new ie;class Ui{constructor(t=new j(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Dr.subVectors(i,e).cross(E0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Dr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||T0.getNormalMatrix(t),s=this.coplanarPoint(Dr).applyMatrix4(t),o=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ii=new ai,la=new j;class $l{constructor(t=new Ui,e=new Ui,i=new Ui,s=new Ui,o=new Ui,r=new Ui){this.planes=[t,e,i,s,o,r]}set(t,e,i,s,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ei){const i=this.planes,s=t.elements,o=s[0],r=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],f=s[7],d=s[8],g=s[9],x=s[10],m=s[11],p=s[12],y=s[13],v=s[14],M=s[15];if(i[0].setComponents(l-o,f-c,m-d,M-p).normalize(),i[1].setComponents(l+o,f+c,m+d,M+p).normalize(),i[2].setComponents(l+r,f+h,m+g,M+y).normalize(),i[3].setComponents(l-r,f-h,m-g,M-y).normalize(),i[4].setComponents(l-a,f-u,m-x,M-v).normalize(),e===ei)i[5].setComponents(l+a,f+u,m+x,M+v).normalize();else if(e===Fa)i[5].setComponents(a,u,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ii)}intersectsSprite(t){return Ii.center.set(0,0,0),Ii.radius=.7071067811865476,Ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ii)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(la.x=s.normal.x>0?t.max.x:t.min.x,la.y=s.normal.y>0?t.max.y:t.min.y,la.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(la)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function pd(){let n=null,t=!1,e=null,i=null;function s(o,r){e(o,r),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){n=o}}}function A0(n,t){const e=t.isWebGL2,i=new WeakMap;function s(c,h){const u=c.array,f=c.usage,d=u.byteLength,g=n.createBuffer();n.bindBuffer(h,g),n.bufferData(h,u,f),c.onUploadCallback();let x;if(u instanceof Float32Array)x=n.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)x=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)x=n.SHORT;else if(u instanceof Uint32Array)x=n.UNSIGNED_INT;else if(u instanceof Int32Array)x=n.INT;else if(u instanceof Int8Array)x=n.BYTE;else if(u instanceof Uint8Array)x=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)x=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:d}}function o(c,h,u){const f=h.array,d=h._updateRange,g=h.updateRanges;if(n.bindBuffer(u,c),d.count===-1&&g.length===0&&n.bufferSubData(u,0,f),g.length!==0){for(let x=0,m=g.length;x<m;x++){const p=g[x];e?n.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f,p.start,p.count):n.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}d.count!==-1&&(e?n.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):n.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function r(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);h&&(n.deleteBuffer(h.buffer),i.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const f=i.get(c);(!f||f.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);if(u===void 0)i.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(u.buffer,c,h),u.version=c.version}}return{get:r,remove:a,update:l}}class Xs extends Oe{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const o=t/2,r=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,u=t/a,f=e/l,d=[],g=[],x=[],m=[];for(let p=0;p<h;p++){const y=p*f-r;for(let v=0;v<c;v++){const M=v*u-o;g.push(M,-y,0),x.push(0,0,1),m.push(v/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<a;y++){const v=y+c*p,M=y+c*(p+1),S=y+1+c*(p+1),T=y+1+c*p;d.push(v,M,T),d.push(M,S,T)}this.setIndex(d),this.setAttribute("position",new we(g,3)),this.setAttribute("normal",new we(x,3)),this.setAttribute("uv",new we(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xs(t.width,t.height,t.widthSegments,t.heightSegments)}}var C0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,R0=`#ifdef USE_ALPHAHASH
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
#endif`,L0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,k0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,P0=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,z0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,D0=`#ifdef USE_AOMAP
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
#endif`,I0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,U0=`#ifdef USE_BATCHING
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
#endif`,F0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,N0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,O0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,B0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,H0=`#ifdef USE_IRIDESCENCE
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
#endif`,G0=`#ifdef USE_BUMPMAP
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
#endif`,$0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,V0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,W0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,j0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,X0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,q0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,K0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Y0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Z0=`#define PI 3.141592653589793
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
} // validated`,J0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Q0=`vec3 transformedNormal = objectNormal;
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
#endif`,tm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,em=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,nm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,im=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sm="gl_FragColor = linearToOutputTexel( gl_FragColor );",om=`
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
}`,am=`#ifdef USE_ENVMAP
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
#endif`,rm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,lm=`#ifdef USE_ENVMAP
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
#endif`,cm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hm=`#ifdef USE_ENVMAP
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
#endif`,um=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,dm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,pm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mm=`#ifdef USE_GRADIENTMAP
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
}`,gm=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,vm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ym=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mm=`uniform bool receiveShadow;
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
#endif`,_m=`#ifdef USE_ENVMAP
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
#endif`,bm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Em=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Tm=`PhysicalMaterial material;
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
#endif`,Am=`struct PhysicalMaterial {
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
}`,Cm=`
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
#endif`,Rm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Lm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,km=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Dm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Im=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Um=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Nm=`#if defined( USE_POINTS_UV )
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
#endif`,Om=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gm=`#ifdef USE_MORPHNORMALS
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
#endif`,$m=`#ifdef USE_MORPHTARGETS
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
#endif`,Vm=`#ifdef USE_MORPHTARGETS
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
#endif`,Wm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,jm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Xm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Km=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ym=`#ifdef USE_NORMALMAP
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
#endif`,Zm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Jm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,tg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,eg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ng=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ig=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,og=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ag=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,lg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ug=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,dg=`float getShadowMask() {
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
}`,fg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pg=`#ifdef USE_SKINNING
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
#endif`,mg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gg=`#ifdef USE_SKINNING
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
#endif`,vg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,xg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Mg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,_g=`#ifdef USE_TRANSMISSION
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
#endif`,bg=`#ifdef USE_TRANSMISSION
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
#endif`,wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ag=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Cg=`uniform sampler2D t2D;
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
}`,Rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,kg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zg=`#include <common>
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
}`,Dg=`#if DEPTH_PACKING == 3200
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
}`,Ig=`#define DISTANCE
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
}`,Ug=`#define DISTANCE
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
}`,Fg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ng=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Og=`uniform float scale;
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
}`,Bg=`uniform vec3 diffuse;
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
}`,Hg=`#include <common>
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
}`,Gg=`uniform vec3 diffuse;
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
}`,$g=`#define LAMBERT
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
}`,Vg=`#define LAMBERT
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
}`,Wg=`#define MATCAP
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
}`,jg=`#define MATCAP
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
}`,Xg=`#define NORMAL
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
}`,qg=`#define NORMAL
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
}`,Kg=`#define PHONG
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
}`,Yg=`#define PHONG
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
}`,Zg=`#define STANDARD
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
}`,Jg=`#define STANDARD
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
}`,Qg=`#define TOON
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
}`,tv=`#define TOON
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
}`,ev=`uniform float size;
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
}`,nv=`uniform vec3 diffuse;
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
}`,iv=`#include <common>
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
}`,sv=`uniform vec3 color;
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
}`,ov=`uniform float rotation;
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
}`,av=`uniform vec3 diffuse;
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
}`,ee={alphahash_fragment:C0,alphahash_pars_fragment:R0,alphamap_fragment:L0,alphamap_pars_fragment:k0,alphatest_fragment:P0,alphatest_pars_fragment:z0,aomap_fragment:D0,aomap_pars_fragment:I0,batching_pars_vertex:U0,batching_vertex:F0,begin_vertex:N0,beginnormal_vertex:O0,bsdfs:B0,iridescence_fragment:H0,bumpmap_pars_fragment:G0,clipping_planes_fragment:$0,clipping_planes_pars_fragment:V0,clipping_planes_pars_vertex:W0,clipping_planes_vertex:j0,color_fragment:X0,color_pars_fragment:q0,color_pars_vertex:K0,color_vertex:Y0,common:Z0,cube_uv_reflection_fragment:J0,defaultnormal_vertex:Q0,displacementmap_pars_vertex:tm,displacementmap_vertex:em,emissivemap_fragment:nm,emissivemap_pars_fragment:im,colorspace_fragment:sm,colorspace_pars_fragment:om,envmap_fragment:am,envmap_common_pars_fragment:rm,envmap_pars_fragment:lm,envmap_pars_vertex:cm,envmap_physical_pars_fragment:_m,envmap_vertex:hm,fog_vertex:um,fog_pars_vertex:dm,fog_fragment:fm,fog_pars_fragment:pm,gradientmap_pars_fragment:mm,lightmap_fragment:gm,lightmap_pars_fragment:vm,lights_lambert_fragment:xm,lights_lambert_pars_fragment:ym,lights_pars_begin:Mm,lights_toon_fragment:bm,lights_toon_pars_fragment:wm,lights_phong_fragment:Sm,lights_phong_pars_fragment:Em,lights_physical_fragment:Tm,lights_physical_pars_fragment:Am,lights_fragment_begin:Cm,lights_fragment_maps:Rm,lights_fragment_end:Lm,logdepthbuf_fragment:km,logdepthbuf_pars_fragment:Pm,logdepthbuf_pars_vertex:zm,logdepthbuf_vertex:Dm,map_fragment:Im,map_pars_fragment:Um,map_particle_fragment:Fm,map_particle_pars_fragment:Nm,metalnessmap_fragment:Om,metalnessmap_pars_fragment:Bm,morphcolor_vertex:Hm,morphnormal_vertex:Gm,morphtarget_pars_vertex:$m,morphtarget_vertex:Vm,normal_fragment_begin:Wm,normal_fragment_maps:jm,normal_pars_fragment:Xm,normal_pars_vertex:qm,normal_vertex:Km,normalmap_pars_fragment:Ym,clearcoat_normal_fragment_begin:Zm,clearcoat_normal_fragment_maps:Jm,clearcoat_pars_fragment:Qm,iridescence_pars_fragment:tg,opaque_fragment:eg,packing:ng,premultiplied_alpha_fragment:ig,project_vertex:sg,dithering_fragment:og,dithering_pars_fragment:ag,roughnessmap_fragment:rg,roughnessmap_pars_fragment:lg,shadowmap_pars_fragment:cg,shadowmap_pars_vertex:hg,shadowmap_vertex:ug,shadowmask_pars_fragment:dg,skinbase_vertex:fg,skinning_pars_vertex:pg,skinning_vertex:mg,skinnormal_vertex:gg,specularmap_fragment:vg,specularmap_pars_fragment:xg,tonemapping_fragment:yg,tonemapping_pars_fragment:Mg,transmission_fragment:_g,transmission_pars_fragment:bg,uv_pars_fragment:wg,uv_pars_vertex:Sg,uv_vertex:Eg,worldpos_vertex:Tg,background_vert:Ag,background_frag:Cg,backgroundCube_vert:Rg,backgroundCube_frag:Lg,cube_vert:kg,cube_frag:Pg,depth_vert:zg,depth_frag:Dg,distanceRGBA_vert:Ig,distanceRGBA_frag:Ug,equirect_vert:Fg,equirect_frag:Ng,linedashed_vert:Og,linedashed_frag:Bg,meshbasic_vert:Hg,meshbasic_frag:Gg,meshlambert_vert:$g,meshlambert_frag:Vg,meshmatcap_vert:Wg,meshmatcap_frag:jg,meshnormal_vert:Xg,meshnormal_frag:qg,meshphong_vert:Kg,meshphong_frag:Yg,meshphysical_vert:Zg,meshphysical_frag:Jg,meshtoon_vert:Qg,meshtoon_frag:tv,points_vert:ev,points_frag:nv,shadow_vert:iv,shadow_frag:sv,sprite_vert:ov,sprite_frag:av},Rt={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ie}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ie},normalScale:{value:new qt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0},uvTransform:{value:new ie}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new qt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}}},Gn={basic:{uniforms:Qe([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:Qe([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:Qe([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:Qe([Rt.common,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.roughnessmap,Rt.metalnessmap,Rt.fog,Rt.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:Qe([Rt.common,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.gradientmap,Rt.fog,Rt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:Qe([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:Qe([Rt.points,Rt.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:Qe([Rt.common,Rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:Qe([Rt.common,Rt.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:Qe([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:Qe([Rt.sprite,Rt.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:Qe([Rt.common,Rt.displacementmap,{referencePosition:{value:new j},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:Qe([Rt.lights,Rt.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};Gn.physical={uniforms:Qe([Gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ie},clearcoatNormalScale:{value:new qt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ie},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ie},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ie},transmissionSamplerSize:{value:new qt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ie},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ie},anisotropyVector:{value:new qt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ie}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};const ca={r:0,b:0,g:0};function rv(n,t,e,i,s,o,r){const a=new Zt(0);let l=o===!0?0:1,c,h,u=null,f=0,d=null;function g(m,p){let y=!1,v=p.isScene===!0?p.background:null;v&&v.isTexture&&(v=(p.backgroundBlurriness>0?e:t).get(v)),v===null?x(a,l):v&&v.isColor&&(x(v,1),y=!0);const M=n.xr.getEnvironmentBlendMode();M==="additive"?i.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||y)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),v&&(v.isCubeTexture||v.mapping===qa)?(h===void 0&&(h=new ge(new Io(1,1,1),new xe({name:"BackgroundCubeMaterial",uniforms:Hs(Gn.backgroundCube.uniforms),vertexShader:Gn.backgroundCube.vertexShader,fragmentShader:Gn.backgroundCube.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=de.getTransfer(v.colorSpace)!==me,(u!==v||f!==v.version||d!==n.toneMapping)&&(h.material.needsUpdate=!0,u=v,f=v.version,d=n.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new ge(new Xs(2,2),new xe({name:"BackgroundMaterial",uniforms:Hs(Gn.background.uniforms),vertexShader:Gn.background.vertexShader,fragmentShader:Gn.background.fragmentShader,side:Ai,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=de.getTransfer(v.colorSpace)!==me,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,d=n.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function x(m,p){m.getRGB(ca,ud(n)),i.buffers.color.setClear(ca.r,ca.g,ca.b,p,r)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),l=p,x(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,x(a,l)},render:g}}function lv(n,t,e,i){const s=n.getParameter(n.MAX_VERTEX_ATTRIBS),o=i.isWebGL2?null:t.get("OES_vertex_array_object"),r=i.isWebGL2||o!==null,a={},l=m(null);let c=l,h=!1;function u(P,B,X,J,Z){let Y=!1;if(r){const st=x(J,X,B);c!==st&&(c=st,d(c.object)),Y=p(P,J,X,Z),Y&&y(P,J,X,Z)}else{const st=B.wireframe===!0;(c.geometry!==J.id||c.program!==X.id||c.wireframe!==st)&&(c.geometry=J.id,c.program=X.id,c.wireframe=st,Y=!0)}Z!==null&&e.update(Z,n.ELEMENT_ARRAY_BUFFER),(Y||h)&&(h=!1,k(P,B,X,J),Z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function f(){return i.isWebGL2?n.createVertexArray():o.createVertexArrayOES()}function d(P){return i.isWebGL2?n.bindVertexArray(P):o.bindVertexArrayOES(P)}function g(P){return i.isWebGL2?n.deleteVertexArray(P):o.deleteVertexArrayOES(P)}function x(P,B,X){const J=X.wireframe===!0;let Z=a[P.id];Z===void 0&&(Z={},a[P.id]=Z);let Y=Z[B.id];Y===void 0&&(Y={},Z[B.id]=Y);let st=Y[J];return st===void 0&&(st=m(f()),Y[J]=st),st}function m(P){const B=[],X=[],J=[];for(let Z=0;Z<s;Z++)B[Z]=0,X[Z]=0,J[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:X,attributeDivisors:J,object:P,attributes:{},index:null}}function p(P,B,X,J){const Z=c.attributes,Y=B.attributes;let st=0;const tt=X.getAttributes();for(const N in tt)if(tt[N].location>=0){const lt=Z[N];let _t=Y[N];if(_t===void 0&&(N==="instanceMatrix"&&P.instanceMatrix&&(_t=P.instanceMatrix),N==="instanceColor"&&P.instanceColor&&(_t=P.instanceColor)),lt===void 0||lt.attribute!==_t||_t&&lt.data!==_t.data)return!0;st++}return c.attributesNum!==st||c.index!==J}function y(P,B,X,J){const Z={},Y=B.attributes;let st=0;const tt=X.getAttributes();for(const N in tt)if(tt[N].location>=0){let lt=Y[N];lt===void 0&&(N==="instanceMatrix"&&P.instanceMatrix&&(lt=P.instanceMatrix),N==="instanceColor"&&P.instanceColor&&(lt=P.instanceColor));const _t={};_t.attribute=lt,lt&&lt.data&&(_t.data=lt.data),Z[N]=_t,st++}c.attributes=Z,c.attributesNum=st,c.index=J}function v(){const P=c.newAttributes;for(let B=0,X=P.length;B<X;B++)P[B]=0}function M(P){S(P,0)}function S(P,B){const X=c.newAttributes,J=c.enabledAttributes,Z=c.attributeDivisors;X[P]=1,J[P]===0&&(n.enableVertexAttribArray(P),J[P]=1),Z[P]!==B&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,B),Z[P]=B)}function T(){const P=c.newAttributes,B=c.enabledAttributes;for(let X=0,J=B.length;X<J;X++)B[X]!==P[X]&&(n.disableVertexAttribArray(X),B[X]=0)}function A(P,B,X,J,Z,Y,st){st===!0?n.vertexAttribIPointer(P,B,X,Z,Y):n.vertexAttribPointer(P,B,X,J,Z,Y)}function k(P,B,X,J){if(i.isWebGL2===!1&&(P.isInstancedMesh||J.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();const Z=J.attributes,Y=X.getAttributes(),st=B.defaultAttributeValues;for(const tt in Y){const N=Y[tt];if(N.location>=0){let K=Z[tt];if(K===void 0&&(tt==="instanceMatrix"&&P.instanceMatrix&&(K=P.instanceMatrix),tt==="instanceColor"&&P.instanceColor&&(K=P.instanceColor)),K!==void 0){const lt=K.normalized,_t=K.itemSize,bt=e.get(K);if(bt===void 0)continue;const Dt=bt.buffer,O=bt.type,Wt=bt.bytesPerElement,wt=i.isWebGL2===!0&&(O===n.INT||O===n.UNSIGNED_INT||K.gpuType===qu);if(K.isInterleavedBufferAttribute){const Xt=K.data,G=Xt.stride,vt=K.offset;if(Xt.isInstancedInterleavedBuffer){for(let Lt=0;Lt<N.locationSize;Lt++)S(N.location+Lt,Xt.meshPerAttribute);P.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=Xt.meshPerAttribute*Xt.count)}else for(let Lt=0;Lt<N.locationSize;Lt++)M(N.location+Lt);n.bindBuffer(n.ARRAY_BUFFER,Dt);for(let Lt=0;Lt<N.locationSize;Lt++)A(N.location+Lt,_t/N.locationSize,O,lt,G*Wt,(vt+_t/N.locationSize*Lt)*Wt,wt)}else{if(K.isInstancedBufferAttribute){for(let Xt=0;Xt<N.locationSize;Xt++)S(N.location+Xt,K.meshPerAttribute);P.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Xt=0;Xt<N.locationSize;Xt++)M(N.location+Xt);n.bindBuffer(n.ARRAY_BUFFER,Dt);for(let Xt=0;Xt<N.locationSize;Xt++)A(N.location+Xt,_t/N.locationSize,O,lt,_t*Wt,_t/N.locationSize*Xt*Wt,wt)}}else if(st!==void 0){const lt=st[tt];if(lt!==void 0)switch(lt.length){case 2:n.vertexAttrib2fv(N.location,lt);break;case 3:n.vertexAttrib3fv(N.location,lt);break;case 4:n.vertexAttrib4fv(N.location,lt);break;default:n.vertexAttrib1fv(N.location,lt)}}}}T()}function _(){F();for(const P in a){const B=a[P];for(const X in B){const J=B[X];for(const Z in J)g(J[Z].object),delete J[Z];delete B[X]}delete a[P]}}function w(P){if(a[P.id]===void 0)return;const B=a[P.id];for(const X in B){const J=B[X];for(const Z in J)g(J[Z].object),delete J[Z];delete B[X]}delete a[P.id]}function C(P){for(const B in a){const X=a[B];if(X[P.id]===void 0)continue;const J=X[P.id];for(const Z in J)g(J[Z].object),delete J[Z];delete X[P.id]}}function F(){z(),h=!0,c!==l&&(c=l,d(c.object))}function z(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:F,resetDefaultState:z,dispose:_,releaseStatesOfGeometry:w,releaseStatesOfProgram:C,initAttributes:v,enableAttribute:M,disableUnusedAttributes:T}}function cv(n,t,e,i){const s=i.isWebGL2;let o;function r(h){o=h}function a(h,u){n.drawArrays(o,h,u),e.update(u,o,1)}function l(h,u,f){if(f===0)return;let d,g;if(s)d=n,g="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[g](o,h,u,f),e.update(u,o,f)}function c(h,u,f){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{d.multiDrawArraysWEBGL(o,h,0,u,0,f);let g=0;for(let x=0;x<f;x++)g+=u[x];e.update(g,o,1)}}this.setMode=r,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function hv(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const r=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=o(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=r||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),x=n.getParameter(n.MAX_VERTEX_ATTRIBS),m=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),p=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),v=f>0,M=r||t.has("OES_texture_float"),S=v&&M,T=r?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:r,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:o,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:y,vertexTextures:v,floatFragmentTextures:M,floatVertexTextures:S,maxSamples:T}}function uv(n){const t=this;let e=null,i=0,s=!1,o=!1;const r=new Ui,a=new ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||i!==0||s;return s=f,i=u.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||g===null||g.length===0||o&&!m)o?h(null):c();else{const y=o?0:i,v=y*4;let M=p.clippingState||null;l.value=M,M=h(g,f,v,d);for(let S=0;S!==v;++S)M[S]=e[S];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,d,g){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const p=d+x*4,y=f.matrixWorldInverse;a.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,M=d;v!==x;++v,M+=4)r.copy(u[v]).applyMatrix4(y,a),r.normal.toArray(m,M),m[M+3]=r.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function dv(n){let t=new WeakMap;function e(r,a){return a===dl?r.mapping=Ns:a===fl&&(r.mapping=Os),r}function i(r){if(r&&r.isTexture){const a=r.mapping;if(a===dl||a===fl)if(t.has(r)){const l=t.get(r).texture;return e(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new S0(l.height/2);return c.fromEquirectangularTexture(n,r),t.set(r,c),r.addEventListener("dispose",s),e(c.texture,r.mapping)}else return null}}return r}function s(r){const a=r.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function o(){t=new WeakMap}return{get:i,dispose:o}}class Za extends dd{constructor(t=-1,e=1,i=1,s=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=i-t,r=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,r=o+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Es=4,rh=[.125,.215,.35,.446,.526,.582],Bi=20,Ir=new Za,lh=new Zt;let Ur=null,Fr=0,Nr=0;const Fi=(1+Math.sqrt(5))/2,ys=1/Fi,ch=[new j(1,1,1),new j(-1,1,1),new j(1,1,-1),new j(-1,1,-1),new j(0,Fi,ys),new j(0,Fi,-ys),new j(ys,0,Fi),new j(-ys,0,Fi),new j(Fi,ys,0),new j(-Fi,ys,0)];class hh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Ur=this._renderer.getRenderTarget(),Fr=this._renderer.getActiveCubeFace(),Nr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,i,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ur,Fr,Nr),t.scissorTest=!1,ha(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ns||t.mapping===Os?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ur=this._renderer.getRenderTarget(),Fr=this._renderer.getActiveCubeFace(),Nr=this._renderer.getActiveMipmapLevel();const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:$e,minFilter:$e,generateMipmaps:!1,type:Yi,format:Mn,colorSpace:si,depthBuffer:!1},s=uh(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=uh(t,e,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=fv(o)),this._blurMaterial=pv(o,t,e)}return s}_compileMaterial(t){const e=new ge(this._lodPlanes[0],t);this._renderer.compile(e,Ir)}_sceneToCubeUV(t,e,i,s){const a=new dn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(lh),h.toneMapping=Si,h.autoClear=!1;const d=new ld({name:"PMREM.Background",side:an,depthWrite:!1,depthTest:!1}),g=new ge(new Io,d);let x=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,x=!0):(d.color.copy(lh),x=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):y===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const v=this._cubeSize;ha(s,y*v,p>2?v:0,v,v),h.setRenderTarget(s),x&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===Ns||t.mapping===Os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=fh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dh());const o=s?this._cubemapMaterial:this._equirectMaterial,r=new ge(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const l=this._cubeSize;ha(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(r,Ir)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=ch[(s-1)%ch.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,s,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,i,s,"latitudinal",o),this._halfBlur(r,t,i,i,s,"longitudinal",o)}_halfBlur(t,e,i,s,o,r,a){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ge(this._lodPlanes[s],c),f=c.uniforms,d=this._sizeLods[i]-1,g=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*Bi-1),x=o/g,m=isFinite(o)?1+Math.floor(h*x):Bi;m>Bi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Bi}`);const p=[];let y=0;for(let A=0;A<Bi;++A){const k=A/x,_=Math.exp(-k*k/2);p.push(_),A===0?y+=_:A<m&&(y+=2*_)}for(let A=0;A<p.length;A++)p[A]=p[A]/y;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=r==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-i;const M=this._sizeLods[s],S=3*M*(s>v-Es?s-v+Es:0),T=4*(this._cubeSize-M);ha(e,S,T,3*M,2*M),l.setRenderTarget(e),l.render(u,Ir)}}function fv(n){const t=[],e=[],i=[];let s=n;const o=n-Es+1+rh.length;for(let r=0;r<o;r++){const a=Math.pow(2,s);e.push(a);let l=1/a;r>n-Es?l=rh[r-n+Es-1]:r===0&&(l=0),i.push(l);const c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,x=3,m=2,p=1,y=new Float32Array(x*g*d),v=new Float32Array(m*g*d),M=new Float32Array(p*g*d);for(let T=0;T<d;T++){const A=T%3*2/3-1,k=T>2?0:-1,_=[A,k,0,A+2/3,k,0,A+2/3,k+1,0,A,k,0,A+2/3,k+1,0,A,k+1,0];y.set(_,x*g*T),v.set(f,m*g*T);const w=[T,T,T,T,T,T];M.set(w,p*g*T)}const S=new Oe;S.setAttribute("position",new ke(y,x)),S.setAttribute("uv",new ke(v,m)),S.setAttribute("faceIndex",new ke(M,p)),t.push(S),s>Es&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function uh(n,t,e){const i=new Vn(n,t,e);return i.texture.mapping=qa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ha(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function pv(n,t,e){const i=new Float32Array(Bi),s=new j(0,1,0);return new xe({name:"SphericalGaussianBlur",defines:{n:Bi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vl(),fragmentShader:`

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
		`,blending:wi,depthTest:!1,depthWrite:!1})}function dh(){return new xe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vl(),fragmentShader:`

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
		`,blending:wi,depthTest:!1,depthWrite:!1})}function fh(){return new xe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wi,depthTest:!1,depthWrite:!1})}function Vl(){return`

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
	`}function mv(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===dl||l===fl,h=l===Ns||l===Os;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new hh(n)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(c&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new hh(n));const f=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",o),f.texture}else return null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function o(a){const l=a.target;l.removeEventListener("dispose",o);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:r}}function gv(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){const s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function vv(n,t,e,i){const s={},o=new WeakMap;function r(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const x=f.morphAttributes[g];for(let m=0,p=x.length;m<p;m++)t.remove(x[m])}f.removeEventListener("dispose",r),delete s[f.id];const d=o.get(f);d&&(t.remove(d),o.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",r),s[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)t.update(f[g],n.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const x=d[g];for(let m=0,p=x.length;m<p;m++)t.update(x[m],n.ARRAY_BUFFER)}}function c(u){const f=[],d=u.index,g=u.attributes.position;let x=0;if(d!==null){const y=d.array;x=d.version;for(let v=0,M=y.length;v<M;v+=3){const S=y[v+0],T=y[v+1],A=y[v+2];f.push(S,T,T,A,A,S)}}else if(g!==void 0){const y=g.array;x=g.version;for(let v=0,M=y.length/3-1;v<M;v+=3){const S=v+0,T=v+1,A=v+2;f.push(S,T,T,A,A,S)}}else return;const m=new(id(f)?hd:cd)(f,1);m.version=x;const p=o.get(u);p&&t.remove(p),o.set(u,m)}function h(u){const f=o.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return o.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function xv(n,t,e,i){const s=i.isWebGL2;let o;function r(d){o=d}let a,l;function c(d){a=d.type,l=d.bytesPerElement}function h(d,g){n.drawElements(o,g,a,d*l),e.update(g,o,1)}function u(d,g,x){if(x===0)return;let m,p;if(s)m=n,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](o,g,a,d*l,x),e.update(g,o,x)}function f(d,g,x){if(x===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<x;p++)this.render(d[p]/l,g[p]);else{m.multiDrawElementsWEBGL(o,g,0,a,d,0,x);let p=0;for(let y=0;y<x;y++)p+=g[y];e.update(p,o,1)}}this.setMode=r,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function yv(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,r,a){switch(e.calls++,r){case n.TRIANGLES:e.triangles+=a*(o/3);break;case n.LINES:e.lines+=a*(o/2);break;case n.LINE_STRIP:e.lines+=a*(o-1);break;case n.LINE_LOOP:e.lines+=a*o;break;case n.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Mv(n,t){return n[0]-t[0]}function _v(n,t){return Math.abs(t[1])-Math.abs(n[1])}function bv(n,t,e){const i={},s=new Float32Array(8),o=new WeakMap,r=new Se,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,u){const f=c.morphTargetInfluences;if(t.isWebGL2===!0){const d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=d!==void 0?d.length:0;let x=o.get(h);if(x===void 0||x.count!==g){let P=function(){F.dispose(),o.delete(h),h.removeEventListener("dispose",P)};x!==void 0&&x.texture.dispose();const y=h.morphAttributes.position!==void 0,v=h.morphAttributes.normal!==void 0,M=h.morphAttributes.color!==void 0,S=h.morphAttributes.position||[],T=h.morphAttributes.normal||[],A=h.morphAttributes.color||[];let k=0;y===!0&&(k=1),v===!0&&(k=2),M===!0&&(k=3);let _=h.attributes.position.count*k,w=1;_>t.maxTextureSize&&(w=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const C=new Float32Array(_*w*4*g),F=new ad(C,_,w,g);F.type=ti,F.needsUpdate=!0;const z=k*4;for(let B=0;B<g;B++){const X=S[B],J=T[B],Z=A[B],Y=_*w*4*B;for(let st=0;st<X.count;st++){const tt=st*z;y===!0&&(r.fromBufferAttribute(X,st),C[Y+tt+0]=r.x,C[Y+tt+1]=r.y,C[Y+tt+2]=r.z,C[Y+tt+3]=0),v===!0&&(r.fromBufferAttribute(J,st),C[Y+tt+4]=r.x,C[Y+tt+5]=r.y,C[Y+tt+6]=r.z,C[Y+tt+7]=0),M===!0&&(r.fromBufferAttribute(Z,st),C[Y+tt+8]=r.x,C[Y+tt+9]=r.y,C[Y+tt+10]=r.z,C[Y+tt+11]=Z.itemSize===4?r.w:1)}}x={count:g,texture:F,size:new qt(_,w)},o.set(h,x),h.addEventListener("dispose",P)}let m=0;for(let y=0;y<f.length;y++)m+=f[y];const p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(n,"morphTargetBaseInfluence",p),u.getUniforms().setValue(n,"morphTargetInfluences",f),u.getUniforms().setValue(n,"morphTargetsTexture",x.texture,e),u.getUniforms().setValue(n,"morphTargetsTextureSize",x.size)}else{const d=f===void 0?0:f.length;let g=i[h.id];if(g===void 0||g.length!==d){g=[];for(let v=0;v<d;v++)g[v]=[v,0];i[h.id]=g}for(let v=0;v<d;v++){const M=g[v];M[0]=v,M[1]=f[v]}g.sort(_v);for(let v=0;v<8;v++)v<d&&g[v][1]?(a[v][0]=g[v][0],a[v][1]=g[v][1]):(a[v][0]=Number.MAX_SAFE_INTEGER,a[v][1]=0);a.sort(Mv);const x=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let v=0;v<8;v++){const M=a[v],S=M[0],T=M[1];S!==Number.MAX_SAFE_INTEGER&&T?(x&&h.getAttribute("morphTarget"+v)!==x[S]&&h.setAttribute("morphTarget"+v,x[S]),m&&h.getAttribute("morphNormal"+v)!==m[S]&&h.setAttribute("morphNormal"+v,m[S]),s[v]=T,p+=T):(x&&h.hasAttribute("morphTarget"+v)===!0&&h.deleteAttribute("morphTarget"+v),m&&h.hasAttribute("morphNormal"+v)===!0&&h.deleteAttribute("morphNormal"+v),s[v]=0)}const y=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(n,"morphTargetBaseInfluence",y),u.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:l}}function wv(n,t,e,i){let s=new WeakMap;function o(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function r(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:o,dispose:r}}class Wl extends rn{constructor(t,e,i,s,o,r,a,l,c,h){if(h=h!==void 0?h:$i,h!==$i&&h!==Bs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===$i&&(i=Qn),i===void 0&&h===Bs&&(i=Gi),super(null,s,o,r,a,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Le,this.minFilter=l!==void 0?l:Le,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const md=new rn,gd=new Wl(1,1);gd.compareFunction=nd;const vd=new ad,xd=new r0,yd=new fd,ph=[],mh=[],gh=new Float32Array(16),vh=new Float32Array(9),xh=new Float32Array(4);function qs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let o=ph[s];if(o===void 0&&(o=new Float32Array(s),ph[s]=o),t!==0){i.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,n[r].toArray(o,a)}return o}function Pe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function ze(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Ja(n,t){let e=mh[t];e===void 0&&(e=new Int32Array(t),mh[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Sv(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Ev(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2fv(this.addr,t),ze(e,t)}}function Tv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;n.uniform3fv(this.addr,t),ze(e,t)}}function Av(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4fv(this.addr,t),ze(e,t)}}function Cv(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),ze(e,t)}else{if(Pe(e,i))return;xh.set(i),n.uniformMatrix2fv(this.addr,!1,xh),ze(e,i)}}function Rv(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),ze(e,t)}else{if(Pe(e,i))return;vh.set(i),n.uniformMatrix3fv(this.addr,!1,vh),ze(e,i)}}function Lv(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),ze(e,t)}else{if(Pe(e,i))return;gh.set(i),n.uniformMatrix4fv(this.addr,!1,gh),ze(e,i)}}function kv(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Pv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2iv(this.addr,t),ze(e,t)}}function zv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;n.uniform3iv(this.addr,t),ze(e,t)}}function Dv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4iv(this.addr,t),ze(e,t)}}function Iv(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Uv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2uiv(this.addr,t),ze(e,t)}}function Fv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;n.uniform3uiv(this.addr,t),ze(e,t)}}function Nv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4uiv(this.addr,t),ze(e,t)}}function Ov(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);const o=this.type===n.SAMPLER_2D_SHADOW?gd:md;e.setTexture2D(t||o,s)}function Bv(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||xd,s)}function Hv(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||yd,s)}function Gv(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||vd,s)}function $v(n){switch(n){case 5126:return Sv;case 35664:return Ev;case 35665:return Tv;case 35666:return Av;case 35674:return Cv;case 35675:return Rv;case 35676:return Lv;case 5124:case 35670:return kv;case 35667:case 35671:return Pv;case 35668:case 35672:return zv;case 35669:case 35673:return Dv;case 5125:return Iv;case 36294:return Uv;case 36295:return Fv;case 36296:return Nv;case 35678:case 36198:case 36298:case 36306:case 35682:return Ov;case 35679:case 36299:case 36307:return Bv;case 35680:case 36300:case 36308:case 36293:return Hv;case 36289:case 36303:case 36311:case 36292:return Gv}}function Vv(n,t){n.uniform1fv(this.addr,t)}function Wv(n,t){const e=qs(t,this.size,2);n.uniform2fv(this.addr,e)}function jv(n,t){const e=qs(t,this.size,3);n.uniform3fv(this.addr,e)}function Xv(n,t){const e=qs(t,this.size,4);n.uniform4fv(this.addr,e)}function qv(n,t){const e=qs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Kv(n,t){const e=qs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Yv(n,t){const e=qs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Zv(n,t){n.uniform1iv(this.addr,t)}function Jv(n,t){n.uniform2iv(this.addr,t)}function Qv(n,t){n.uniform3iv(this.addr,t)}function tx(n,t){n.uniform4iv(this.addr,t)}function ex(n,t){n.uniform1uiv(this.addr,t)}function nx(n,t){n.uniform2uiv(this.addr,t)}function ix(n,t){n.uniform3uiv(this.addr,t)}function sx(n,t){n.uniform4uiv(this.addr,t)}function ox(n,t,e){const i=this.cache,s=t.length,o=Ja(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),ze(i,o));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||md,o[r])}function ax(n,t,e){const i=this.cache,s=t.length,o=Ja(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),ze(i,o));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||xd,o[r])}function rx(n,t,e){const i=this.cache,s=t.length,o=Ja(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),ze(i,o));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||yd,o[r])}function lx(n,t,e){const i=this.cache,s=t.length,o=Ja(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),ze(i,o));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||vd,o[r])}function cx(n){switch(n){case 5126:return Vv;case 35664:return Wv;case 35665:return jv;case 35666:return Xv;case 35674:return qv;case 35675:return Kv;case 35676:return Yv;case 5124:case 35670:return Zv;case 35667:case 35671:return Jv;case 35668:case 35672:return Qv;case 35669:case 35673:return tx;case 5125:return ex;case 36294:return nx;case 36295:return ix;case 36296:return sx;case 35678:case 36198:case 36298:case 36306:case 35682:return ox;case 35679:case 36299:case 36307:return ax;case 35680:case 36300:case 36308:case 36293:return rx;case 36289:case 36303:case 36311:case 36292:return lx}}class hx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=$v(e.type)}}class ux{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=cx(e.type)}}class dx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let o=0,r=s.length;o!==r;++o){const a=s[o];a.setValue(t,e[a.id],i)}}}const Or=/(\w+)(\])?(\[|\.)?/g;function yh(n,t){n.seq.push(t),n.map[t.id]=t}function fx(n,t,e){const i=n.name,s=i.length;for(Or.lastIndex=0;;){const o=Or.exec(i),r=Or.lastIndex;let a=o[1];const l=o[2]==="]",c=o[3];if(l&&(a=a|0),c===void 0||c==="["&&r+2===s){yh(e,c===void 0?new hx(a,n,t):new ux(a,n,t));break}else{let u=e.map[a];u===void 0&&(u=new dx(a),yh(e,u)),e=u}}}class Ea{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const o=t.getActiveUniform(e,s),r=t.getUniformLocation(e,o.name);fx(o,r,this)}}setValue(t,e,i,s){const o=this.map[e];o!==void 0&&o.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let o=0,r=e.length;o!==r;++o){const a=e[o],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,o=t.length;s!==o;++s){const r=t[s];r.id in e&&i.push(r)}return i}}function Mh(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const px=37297;let mx=0;function gx(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=s;r<o;r++){const a=r+1;i.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return i.join(`
`)}function vx(n){const t=de.getPrimaries(de.workingColorSpace),e=de.getPrimaries(n);let i;switch(t===e?i="":t===Ua&&e===Ia?i="LinearDisplayP3ToLinearSRGB":t===Ia&&e===Ua&&(i="LinearSRGBToLinearDisplayP3"),n){case si:case Ka:return[i,"LinearTransferOETF"];case Fe:case Ol:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function _h(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const r=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+gx(n.getShaderSource(t),r)}else return s}function xx(n,t){const e=vx(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function yx(n,t){let e;switch(t){case vp:e="Linear";break;case xp:e="Reinhard";break;case yp:e="OptimizedCineon";break;case Mp:e="ACESFilmic";break;case bp:e="AgX";break;case _p:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Mx(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ts).join(`
`)}function _x(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ts).join(`
`)}function bx(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function wx(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const o=n.getActiveAttrib(t,s),r=o.name;let a=1;o.type===n.FLOAT_MAT2&&(a=2),o.type===n.FLOAT_MAT3&&(a=3),o.type===n.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:n.getAttribLocation(t,r),locationSize:a}}return e}function Ts(n){return n!==""}function bh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function wh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Sx=/^[ \t]*#include +<([\w\d./]+)>/gm;function vl(n){return n.replace(Sx,Tx)}const Ex=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Tx(n,t){let e=ee[t];if(e===void 0){const i=Ex.get(t);if(i!==void 0)e=ee[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return vl(e)}const Ax=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sh(n){return n.replace(Ax,Cx)}function Cx(n,t,e,i){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function Eh(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Rx(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Wu?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Wf?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Zn&&(t="SHADOWMAP_TYPE_VSM"),t}function Lx(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ns:case Os:t="ENVMAP_TYPE_CUBE";break;case qa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function kx(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Os:t="ENVMAP_MODE_REFRACTION";break}return t}function Px(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ju:t="ENVMAP_BLENDING_MULTIPLY";break;case mp:t="ENVMAP_BLENDING_MIX";break;case gp:t="ENVMAP_BLENDING_ADD";break}return t}function zx(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Dx(n,t,e,i){const s=n.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const l=Rx(e),c=Lx(e),h=kx(e),u=Px(e),f=zx(e),d=e.isWebGL2?"":Mx(e),g=_x(e),x=bx(o),m=s.createProgram();let p,y,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Ts).join(`
`),p.length>0&&(p+=`
`),y=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Ts).join(`
`),y.length>0&&(y+=`
`)):(p=[Eh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ts).join(`
`),y=[d,Eh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Si?"#define TONE_MAPPING":"",e.toneMapping!==Si?ee.tonemapping_pars_fragment:"",e.toneMapping!==Si?yx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,xx("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ts).join(`
`)),r=vl(r),r=bh(r,e),r=wh(r,e),a=vl(a),a=bh(a,e),a=wh(a,e),r=Sh(r),a=Sh(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,y=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===$c?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===$c?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const M=v+p+r,S=v+y+a,T=Mh(s,s.VERTEX_SHADER,M),A=Mh(s,s.FRAGMENT_SHADER,S);s.attachShader(m,T),s.attachShader(m,A),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function k(F){if(n.debug.checkShaderErrors){const z=s.getProgramInfoLog(m).trim(),P=s.getShaderInfoLog(T).trim(),B=s.getShaderInfoLog(A).trim();let X=!0,J=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,m,T,A);else{const Z=_h(s,T,"vertex"),Y=_h(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+z+`
`+Z+`
`+Y)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(P===""||B==="")&&(J=!1);J&&(F.diagnostics={runnable:X,programLog:z,vertexShader:{log:P,prefix:p},fragmentShader:{log:B,prefix:y}})}s.deleteShader(T),s.deleteShader(A),_=new Ea(s,m),w=wx(s,m)}let _;this.getUniforms=function(){return _===void 0&&k(this),_};let w;this.getAttributes=function(){return w===void 0&&k(this),w};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(m,px)),C},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=mx++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=T,this.fragmentShader=A,this}let Ix=0;class Ux{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(i),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Fx(t),e.set(t,i)),i}}class Fx{constructor(t){this.id=Ix++,this.code=t,this.usedTimes=0}}function Nx(n,t,e,i,s,o,r){const a=new Gl,l=new Ux,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return _===0?"uv":`uv${_}`}function m(_,w,C,F,z){const P=F.fog,B=z.geometry,X=_.isMeshStandardMaterial?F.environment:null,J=(_.isMeshStandardMaterial?e:t).get(_.envMap||X),Z=J&&J.mapping===qa?J.image.height:null,Y=g[_.type];_.precision!==null&&(d=s.getMaxPrecision(_.precision),d!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const st=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,tt=st!==void 0?st.length:0;let N=0;B.morphAttributes.position!==void 0&&(N=1),B.morphAttributes.normal!==void 0&&(N=2),B.morphAttributes.color!==void 0&&(N=3);let K,lt,_t,bt;if(Y){const Be=Gn[Y];K=Be.vertexShader,lt=Be.fragmentShader}else K=_.vertexShader,lt=_.fragmentShader,l.update(_),_t=l.getVertexShaderID(_),bt=l.getFragmentShaderID(_);const Dt=n.getRenderTarget(),O=z.isInstancedMesh===!0,Wt=z.isBatchedMesh===!0,wt=!!_.map,Xt=!!_.matcap,G=!!J,vt=!!_.aoMap,Lt=!!_.lightMap,kt=!!_.bumpMap,gt=!!_.normalMap,Ut=!!_.displacementMap,It=!!_.emissiveMap,I=!!_.metalnessMap,D=!!_.roughnessMap,q=_.anisotropy>0,rt=_.clearcoat>0,ht=_.iridescence>0,ct=_.sheen>0,Q=_.transmission>0,it=q&&!!_.anisotropyMap,at=rt&&!!_.clearcoatMap,pt=rt&&!!_.clearcoatNormalMap,mt=rt&&!!_.clearcoatRoughnessMap,nt=ht&&!!_.iridescenceMap,yt=ht&&!!_.iridescenceThicknessMap,St=ct&&!!_.sheenColorMap,Pt=ct&&!!_.sheenRoughnessMap,Ft=!!_.specularMap,Et=!!_.specularColorMap,Gt=!!_.specularIntensityMap,Jt=Q&&!!_.transmissionMap,oe=Q&&!!_.thicknessMap,$t=!!_.gradientMap,ot=!!_.alphaMap,$=_.alphaTest>0,At=!!_.alphaHash,Tt=!!_.extensions,Vt=!!B.attributes.uv1,Nt=!!B.attributes.uv2,ae=!!B.attributes.uv3;let se=Si;return _.toneMapped&&(Dt===null||Dt.isXRRenderTarget===!0)&&(se=n.toneMapping),{isWebGL2:h,shaderID:Y,shaderType:_.type,shaderName:_.name,vertexShader:K,fragmentShader:lt,defines:_.defines,customVertexShaderID:_t,customFragmentShaderID:bt,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Wt,instancing:O,instancingColor:O&&z.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:Dt===null?n.outputColorSpace:Dt.isXRRenderTarget===!0?Dt.texture.colorSpace:si,map:wt,matcap:Xt,envMap:G,envMapMode:G&&J.mapping,envMapCubeUVHeight:Z,aoMap:vt,lightMap:Lt,bumpMap:kt,normalMap:gt,displacementMap:f&&Ut,emissiveMap:It,normalMapObjectSpace:gt&&_.normalMapType===Dp,normalMapTangentSpace:gt&&_.normalMapType===zp,metalnessMap:I,roughnessMap:D,anisotropy:q,anisotropyMap:it,clearcoat:rt,clearcoatMap:at,clearcoatNormalMap:pt,clearcoatRoughnessMap:mt,iridescence:ht,iridescenceMap:nt,iridescenceThicknessMap:yt,sheen:ct,sheenColorMap:St,sheenRoughnessMap:Pt,specularMap:Ft,specularColorMap:Et,specularIntensityMap:Gt,transmission:Q,transmissionMap:Jt,thicknessMap:oe,gradientMap:$t,opaque:_.transparent===!1&&_.blending===Hi,alphaMap:ot,alphaTest:$,alphaHash:At,combine:_.combine,mapUv:wt&&x(_.map.channel),aoMapUv:vt&&x(_.aoMap.channel),lightMapUv:Lt&&x(_.lightMap.channel),bumpMapUv:kt&&x(_.bumpMap.channel),normalMapUv:gt&&x(_.normalMap.channel),displacementMapUv:Ut&&x(_.displacementMap.channel),emissiveMapUv:It&&x(_.emissiveMap.channel),metalnessMapUv:I&&x(_.metalnessMap.channel),roughnessMapUv:D&&x(_.roughnessMap.channel),anisotropyMapUv:it&&x(_.anisotropyMap.channel),clearcoatMapUv:at&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:pt&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:mt&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:yt&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:St&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&x(_.sheenRoughnessMap.channel),specularMapUv:Ft&&x(_.specularMap.channel),specularColorMapUv:Et&&x(_.specularColorMap.channel),specularIntensityMapUv:Gt&&x(_.specularIntensityMap.channel),transmissionMapUv:Jt&&x(_.transmissionMap.channel),thicknessMapUv:oe&&x(_.thicknessMap.channel),alphaMapUv:ot&&x(_.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(gt||q),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,vertexUv1s:Vt,vertexUv2s:Nt,vertexUv3s:ae,pointsUvs:z.isPoints===!0&&!!B.attributes.uv&&(wt||ot),fog:!!P,useFog:_.fog===!0,fogExp2:P&&P.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:z.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:N,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:se,useLegacyLights:n._useLegacyLights,decodeVideoTexture:wt&&_.map.isVideoTexture===!0&&de.getTransfer(_.map.colorSpace)===me,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===fn,flipSided:_.side===an,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:Tt&&_.extensions.derivatives===!0,extensionFragDepth:Tt&&_.extensions.fragDepth===!0,extensionDrawBuffers:Tt&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:Tt&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Tt&&_.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()}}function p(_){const w=[];if(_.shaderID?w.push(_.shaderID):(w.push(_.customVertexShaderID),w.push(_.customFragmentShaderID)),_.defines!==void 0)for(const C in _.defines)w.push(C),w.push(_.defines[C]);return _.isRawShaderMaterial===!1&&(y(w,_),v(w,_),w.push(n.outputColorSpace)),w.push(_.customProgramCacheKey),w.join()}function y(_,w){_.push(w.precision),_.push(w.outputColorSpace),_.push(w.envMapMode),_.push(w.envMapCubeUVHeight),_.push(w.mapUv),_.push(w.alphaMapUv),_.push(w.lightMapUv),_.push(w.aoMapUv),_.push(w.bumpMapUv),_.push(w.normalMapUv),_.push(w.displacementMapUv),_.push(w.emissiveMapUv),_.push(w.metalnessMapUv),_.push(w.roughnessMapUv),_.push(w.anisotropyMapUv),_.push(w.clearcoatMapUv),_.push(w.clearcoatNormalMapUv),_.push(w.clearcoatRoughnessMapUv),_.push(w.iridescenceMapUv),_.push(w.iridescenceThicknessMapUv),_.push(w.sheenColorMapUv),_.push(w.sheenRoughnessMapUv),_.push(w.specularMapUv),_.push(w.specularColorMapUv),_.push(w.specularIntensityMapUv),_.push(w.transmissionMapUv),_.push(w.thicknessMapUv),_.push(w.combine),_.push(w.fogExp2),_.push(w.sizeAttenuation),_.push(w.morphTargetsCount),_.push(w.morphAttributeCount),_.push(w.numDirLights),_.push(w.numPointLights),_.push(w.numSpotLights),_.push(w.numSpotLightMaps),_.push(w.numHemiLights),_.push(w.numRectAreaLights),_.push(w.numDirLightShadows),_.push(w.numPointLightShadows),_.push(w.numSpotLightShadows),_.push(w.numSpotLightShadowsWithMaps),_.push(w.numLightProbes),_.push(w.shadowMapType),_.push(w.toneMapping),_.push(w.numClippingPlanes),_.push(w.numClipIntersection),_.push(w.depthPacking)}function v(_,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),_.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),_.push(a.mask)}function M(_){const w=g[_.type];let C;if(w){const F=Gn[w];C=M0.clone(F.uniforms)}else C=_.uniforms;return C}function S(_,w){let C;for(let F=0,z=c.length;F<z;F++){const P=c[F];if(P.cacheKey===w){C=P,++C.usedTimes;break}}return C===void 0&&(C=new Dx(n,w,_,o),c.push(C)),C}function T(_){if(--_.usedTimes===0){const w=c.indexOf(_);c[w]=c[c.length-1],c.pop(),_.destroy()}}function A(_){l.remove(_)}function k(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:S,releaseProgram:T,releaseShaderCache:A,programs:c,dispose:k}}function Ox(){let n=new WeakMap;function t(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function e(o){n.delete(o)}function i(o,r,a){n.get(o)[r]=a}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function Bx(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Th(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Ah(){const n=[];let t=0;const e=[],i=[],s=[];function o(){t=0,e.length=0,i.length=0,s.length=0}function r(u,f,d,g,x,m){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},n[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),t++,p}function a(u,f,d,g,x,m){const p=r(u,f,d,g,x,m);d.transmission>0?i.push(p):d.transparent===!0?s.push(p):e.push(p)}function l(u,f,d,g,x,m){const p=r(u,f,d,g,x,m);d.transmission>0?i.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,f){e.length>1&&e.sort(u||Bx),i.length>1&&i.sort(f||Th),s.length>1&&s.sort(f||Th)}function h(){for(let u=t,f=n.length;u<f;u++){const d=n[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:i,transparent:s,init:o,push:a,unshift:l,finish:h,sort:c}}function Hx(){let n=new WeakMap;function t(i,s){const o=n.get(i);let r;return o===void 0?(r=new Ah,n.set(i,[r])):s>=o.length?(r=new Ah,o.push(r)):r=o[s],r}function e(){n=new WeakMap}return{get:t,dispose:e}}function Gx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new j,color:new Zt};break;case"SpotLight":e={position:new j,direction:new j,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new j,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new j,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new j,halfWidth:new j,halfHeight:new j};break}return n[t.id]=e,e}}}function $x(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Vx=0;function Wx(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function jx(n,t){const e=new Gx,i=$x(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new j);const o=new j,r=new pe,a=new pe;function l(h,u){let f=0,d=0,g=0;for(let F=0;F<9;F++)s.probe[F].set(0,0,0);let x=0,m=0,p=0,y=0,v=0,M=0,S=0,T=0,A=0,k=0,_=0;h.sort(Wx);const w=u===!0?Math.PI:1;for(let F=0,z=h.length;F<z;F++){const P=h[F],B=P.color,X=P.intensity,J=P.distance,Z=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)f+=B.r*X*w,d+=B.g*X*w,g+=B.b*X*w;else if(P.isLightProbe){for(let Y=0;Y<9;Y++)s.probe[Y].addScaledVector(P.sh.coefficients[Y],X);_++}else if(P.isDirectionalLight){const Y=e.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity*w),P.castShadow){const st=P.shadow,tt=i.get(P);tt.shadowBias=st.bias,tt.shadowNormalBias=st.normalBias,tt.shadowRadius=st.radius,tt.shadowMapSize=st.mapSize,s.directionalShadow[x]=tt,s.directionalShadowMap[x]=Z,s.directionalShadowMatrix[x]=P.shadow.matrix,M++}s.directional[x]=Y,x++}else if(P.isSpotLight){const Y=e.get(P);Y.position.setFromMatrixPosition(P.matrixWorld),Y.color.copy(B).multiplyScalar(X*w),Y.distance=J,Y.coneCos=Math.cos(P.angle),Y.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Y.decay=P.decay,s.spot[p]=Y;const st=P.shadow;if(P.map&&(s.spotLightMap[A]=P.map,A++,st.updateMatrices(P),P.castShadow&&k++),s.spotLightMatrix[p]=st.matrix,P.castShadow){const tt=i.get(P);tt.shadowBias=st.bias,tt.shadowNormalBias=st.normalBias,tt.shadowRadius=st.radius,tt.shadowMapSize=st.mapSize,s.spotShadow[p]=tt,s.spotShadowMap[p]=Z,T++}p++}else if(P.isRectAreaLight){const Y=e.get(P);Y.color.copy(B).multiplyScalar(X),Y.halfWidth.set(P.width*.5,0,0),Y.halfHeight.set(0,P.height*.5,0),s.rectArea[y]=Y,y++}else if(P.isPointLight){const Y=e.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity*w),Y.distance=P.distance,Y.decay=P.decay,P.castShadow){const st=P.shadow,tt=i.get(P);tt.shadowBias=st.bias,tt.shadowNormalBias=st.normalBias,tt.shadowRadius=st.radius,tt.shadowMapSize=st.mapSize,tt.shadowCameraNear=st.camera.near,tt.shadowCameraFar=st.camera.far,s.pointShadow[m]=tt,s.pointShadowMap[m]=Z,s.pointShadowMatrix[m]=P.shadow.matrix,S++}s.point[m]=Y,m++}else if(P.isHemisphereLight){const Y=e.get(P);Y.skyColor.copy(P.color).multiplyScalar(X*w),Y.groundColor.copy(P.groundColor).multiplyScalar(X*w),s.hemi[v]=Y,v++}}y>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Rt.LTC_FLOAT_1,s.rectAreaLTC2=Rt.LTC_FLOAT_2):(s.rectAreaLTC1=Rt.LTC_HALF_1,s.rectAreaLTC2=Rt.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Rt.LTC_FLOAT_1,s.rectAreaLTC2=Rt.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Rt.LTC_HALF_1,s.rectAreaLTC2=Rt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=d,s.ambient[2]=g;const C=s.hash;(C.directionalLength!==x||C.pointLength!==m||C.spotLength!==p||C.rectAreaLength!==y||C.hemiLength!==v||C.numDirectionalShadows!==M||C.numPointShadows!==S||C.numSpotShadows!==T||C.numSpotMaps!==A||C.numLightProbes!==_)&&(s.directional.length=x,s.spot.length=p,s.rectArea.length=y,s.point.length=m,s.hemi.length=v,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=S,s.pointShadowMap.length=S,s.spotShadow.length=T,s.spotShadowMap.length=T,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=S,s.spotLightMatrix.length=T+A-k,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=k,s.numLightProbes=_,C.directionalLength=x,C.pointLength=m,C.spotLength=p,C.rectAreaLength=y,C.hemiLength=v,C.numDirectionalShadows=M,C.numPointShadows=S,C.numSpotShadows=T,C.numSpotMaps=A,C.numLightProbes=_,s.version=Vx++)}function c(h,u){let f=0,d=0,g=0,x=0,m=0;const p=u.matrixWorldInverse;for(let y=0,v=h.length;y<v;y++){const M=h[y];if(M.isDirectionalLight){const S=s.directional[f];S.direction.setFromMatrixPosition(M.matrixWorld),o.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(o),S.direction.transformDirection(p),f++}else if(M.isSpotLight){const S=s.spot[g];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(M.matrixWorld),o.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(o),S.direction.transformDirection(p),g++}else if(M.isRectAreaLight){const S=s.rectArea[x];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(p),a.identity(),r.copy(M.matrixWorld),r.premultiply(p),a.extractRotation(r),S.halfWidth.set(M.width*.5,0,0),S.halfHeight.set(0,M.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),x++}else if(M.isPointLight){const S=s.point[d];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(p),d++}else if(M.isHemisphereLight){const S=s.hemi[m];S.direction.setFromMatrixPosition(M.matrixWorld),S.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:s}}function Ch(n,t){const e=new jx(n,t),i=[],s=[];function o(){i.length=0,s.length=0}function r(u){i.push(u)}function a(u){s.push(u)}function l(u){e.setup(i,u)}function c(u){e.setupView(i,u)}return{init:o,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:r,pushShadow:a}}function Xx(n,t){let e=new WeakMap;function i(o,r=0){const a=e.get(o);let l;return a===void 0?(l=new Ch(n,t),e.set(o,[l])):r>=a.length?(l=new Ch(n,t),a.push(l)):l=a[r],l}function s(){e=new WeakMap}return{get:i,dispose:s}}class qx extends Do{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=kp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Kx extends Do{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Yx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Zx=`uniform sampler2D shadow_pass;
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
}`;function Jx(n,t,e){let i=new $l;const s=new qt,o=new qt,r=new Se,a=new qx({depthPacking:Pp}),l=new Kx,c={},h=e.maxTextureSize,u={[Ai]:an,[an]:Ai,[fn]:fn},f=new xe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new qt},radius:{value:4}},vertexShader:Yx,fragmentShader:Zx}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Oe;g.setAttribute("position",new ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ge(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wu;let p=this.type;this.render=function(T,A,k){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const _=n.getRenderTarget(),w=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),F=n.state;F.setBlending(wi),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=p!==Zn&&this.type===Zn,P=p===Zn&&this.type!==Zn;for(let B=0,X=T.length;B<X;B++){const J=T[B],Z=J.shadow;if(Z===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;s.copy(Z.mapSize);const Y=Z.getFrameExtents();if(s.multiply(Y),o.copy(Z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/Y.x),s.x=o.x*Y.x,Z.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/Y.y),s.y=o.y*Y.y,Z.mapSize.y=o.y)),Z.map===null||z===!0||P===!0){const tt=this.type!==Zn?{minFilter:Le,magFilter:Le}:{};Z.map!==null&&Z.map.dispose(),Z.map=new Vn(s.x,s.y,tt),Z.map.texture.name=J.name+".shadowMap",Z.camera.updateProjectionMatrix()}n.setRenderTarget(Z.map),n.clear();const st=Z.getViewportCount();for(let tt=0;tt<st;tt++){const N=Z.getViewport(tt);r.set(o.x*N.x,o.y*N.y,o.x*N.z,o.y*N.w),F.viewport(r),Z.updateMatrices(J,tt),i=Z.getFrustum(),M(A,k,Z.camera,J,this.type)}Z.isPointLightShadow!==!0&&this.type===Zn&&y(Z,k),Z.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(_,w,C)};function y(T,A){const k=t.update(x);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Vn(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,k,f,x,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,k,d,x,null)}function v(T,A,k,_){let w=null;const C=k.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(C!==void 0)w=C;else if(w=k.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const F=w.uuid,z=A.uuid;let P=c[F];P===void 0&&(P={},c[F]=P);let B=P[z];B===void 0&&(B=w.clone(),P[z]=B,A.addEventListener("dispose",S)),w=B}if(w.visible=A.visible,w.wireframe=A.wireframe,_===Zn?w.side=A.shadowSide!==null?A.shadowSide:A.side:w.side=A.shadowSide!==null?A.shadowSide:u[A.side],w.alphaMap=A.alphaMap,w.alphaTest=A.alphaTest,w.map=A.map,w.clipShadows=A.clipShadows,w.clippingPlanes=A.clippingPlanes,w.clipIntersection=A.clipIntersection,w.displacementMap=A.displacementMap,w.displacementScale=A.displacementScale,w.displacementBias=A.displacementBias,w.wireframeLinewidth=A.wireframeLinewidth,w.linewidth=A.linewidth,k.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const F=n.properties.get(w);F.light=k}return w}function M(T,A,k,_,w){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&w===Zn)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,T.matrixWorld);const z=t.update(T),P=T.material;if(Array.isArray(P)){const B=z.groups;for(let X=0,J=B.length;X<J;X++){const Z=B[X],Y=P[Z.materialIndex];if(Y&&Y.visible){const st=v(T,Y,_,w);T.onBeforeShadow(n,T,A,k,z,st,Z),n.renderBufferDirect(k,null,z,st,T,Z),T.onAfterShadow(n,T,A,k,z,st,Z)}}}else if(P.visible){const B=v(T,P,_,w);T.onBeforeShadow(n,T,A,k,z,B,null),n.renderBufferDirect(k,null,z,B,T,null),T.onAfterShadow(n,T,A,k,z,B,null)}}const F=T.children;for(let z=0,P=F.length;z<P;z++)M(F[z],A,k,_,w)}function S(T){T.target.removeEventListener("dispose",S);for(const k in c){const _=c[k],w=T.target.uuid;w in _&&(_[w].dispose(),delete _[w])}}}function Qx(n,t,e){const i=e.isWebGL2;function s(){let $=!1;const At=new Se;let Tt=null;const Vt=new Se(0,0,0,0);return{setMask:function(Nt){Tt!==Nt&&!$&&(n.colorMask(Nt,Nt,Nt,Nt),Tt=Nt)},setLocked:function(Nt){$=Nt},setClear:function(Nt,ae,se,ye,Be){Be===!0&&(Nt*=ye,ae*=ye,se*=ye),At.set(Nt,ae,se,ye),Vt.equals(At)===!1&&(n.clearColor(Nt,ae,se,ye),Vt.copy(At))},reset:function(){$=!1,Tt=null,Vt.set(-1,0,0,0)}}}function o(){let $=!1,At=null,Tt=null,Vt=null;return{setTest:function(Nt){Nt?Wt(n.DEPTH_TEST):wt(n.DEPTH_TEST)},setMask:function(Nt){At!==Nt&&!$&&(n.depthMask(Nt),At=Nt)},setFunc:function(Nt){if(Tt!==Nt){switch(Nt){case lp:n.depthFunc(n.NEVER);break;case cp:n.depthFunc(n.ALWAYS);break;case hp:n.depthFunc(n.LESS);break;case Pa:n.depthFunc(n.LEQUAL);break;case up:n.depthFunc(n.EQUAL);break;case dp:n.depthFunc(n.GEQUAL);break;case fp:n.depthFunc(n.GREATER);break;case pp:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Tt=Nt}},setLocked:function(Nt){$=Nt},setClear:function(Nt){Vt!==Nt&&(n.clearDepth(Nt),Vt=Nt)},reset:function(){$=!1,At=null,Tt=null,Vt=null}}}function r(){let $=!1,At=null,Tt=null,Vt=null,Nt=null,ae=null,se=null,ye=null,Be=null;return{setTest:function(le){$||(le?Wt(n.STENCIL_TEST):wt(n.STENCIL_TEST))},setMask:function(le){At!==le&&!$&&(n.stencilMask(le),At=le)},setFunc:function(le,De,bn){(Tt!==le||Vt!==De||Nt!==bn)&&(n.stencilFunc(le,De,bn),Tt=le,Vt=De,Nt=bn)},setOp:function(le,De,bn){(ae!==le||se!==De||ye!==bn)&&(n.stencilOp(le,De,bn),ae=le,se=De,ye=bn)},setLocked:function(le){$=le},setClear:function(le){Be!==le&&(n.clearStencil(le),Be=le)},reset:function(){$=!1,At=null,Tt=null,Vt=null,Nt=null,ae=null,se=null,ye=null,Be=null}}}const a=new s,l=new o,c=new r,h=new WeakMap,u=new WeakMap;let f={},d={},g=new WeakMap,x=[],m=null,p=!1,y=null,v=null,M=null,S=null,T=null,A=null,k=null,_=new Zt(0,0,0),w=0,C=!1,F=null,z=null,P=null,B=null,X=null;const J=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,Y=0;const st=n.getParameter(n.VERSION);st.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(st)[1]),Z=Y>=1):st.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(st)[1]),Z=Y>=2);let tt=null,N={};const K=n.getParameter(n.SCISSOR_BOX),lt=n.getParameter(n.VIEWPORT),_t=new Se().fromArray(K),bt=new Se().fromArray(lt);function Dt($,At,Tt,Vt){const Nt=new Uint8Array(4),ae=n.createTexture();n.bindTexture($,ae),n.texParameteri($,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri($,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let se=0;se<Tt;se++)i&&($===n.TEXTURE_3D||$===n.TEXTURE_2D_ARRAY)?n.texImage3D(At,0,n.RGBA,1,1,Vt,0,n.RGBA,n.UNSIGNED_BYTE,Nt):n.texImage2D(At+se,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Nt);return ae}const O={};O[n.TEXTURE_2D]=Dt(n.TEXTURE_2D,n.TEXTURE_2D,1),O[n.TEXTURE_CUBE_MAP]=Dt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(O[n.TEXTURE_2D_ARRAY]=Dt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),O[n.TEXTURE_3D]=Dt(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Wt(n.DEPTH_TEST),l.setFunc(Pa),It(!1),I(hc),Wt(n.CULL_FACE),gt(wi);function Wt($){f[$]!==!0&&(n.enable($),f[$]=!0)}function wt($){f[$]!==!1&&(n.disable($),f[$]=!1)}function Xt($,At){return d[$]!==At?(n.bindFramebuffer($,At),d[$]=At,i&&($===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=At),$===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=At)),!0):!1}function G($,At){let Tt=x,Vt=!1;if($)if(Tt=g.get(At),Tt===void 0&&(Tt=[],g.set(At,Tt)),$.isWebGLMultipleRenderTargets){const Nt=$.texture;if(Tt.length!==Nt.length||Tt[0]!==n.COLOR_ATTACHMENT0){for(let ae=0,se=Nt.length;ae<se;ae++)Tt[ae]=n.COLOR_ATTACHMENT0+ae;Tt.length=Nt.length,Vt=!0}}else Tt[0]!==n.COLOR_ATTACHMENT0&&(Tt[0]=n.COLOR_ATTACHMENT0,Vt=!0);else Tt[0]!==n.BACK&&(Tt[0]=n.BACK,Vt=!0);Vt&&(e.isWebGL2?n.drawBuffers(Tt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Tt))}function vt($){return m!==$?(n.useProgram($),m=$,!0):!1}const Lt={[Oi]:n.FUNC_ADD,[Xf]:n.FUNC_SUBTRACT,[qf]:n.FUNC_REVERSE_SUBTRACT};if(i)Lt[fc]=n.MIN,Lt[pc]=n.MAX;else{const $=t.get("EXT_blend_minmax");$!==null&&(Lt[fc]=$.MIN_EXT,Lt[pc]=$.MAX_EXT)}const kt={[Kf]:n.ZERO,[Yf]:n.ONE,[Zf]:n.SRC_COLOR,[hl]:n.SRC_ALPHA,[ip]:n.SRC_ALPHA_SATURATE,[ep]:n.DST_COLOR,[Qf]:n.DST_ALPHA,[Jf]:n.ONE_MINUS_SRC_COLOR,[ul]:n.ONE_MINUS_SRC_ALPHA,[np]:n.ONE_MINUS_DST_COLOR,[tp]:n.ONE_MINUS_DST_ALPHA,[sp]:n.CONSTANT_COLOR,[op]:n.ONE_MINUS_CONSTANT_COLOR,[ap]:n.CONSTANT_ALPHA,[rp]:n.ONE_MINUS_CONSTANT_ALPHA};function gt($,At,Tt,Vt,Nt,ae,se,ye,Be,le){if($===wi){p===!0&&(wt(n.BLEND),p=!1);return}if(p===!1&&(Wt(n.BLEND),p=!0),$!==jf){if($!==y||le!==C){if((v!==Oi||T!==Oi)&&(n.blendEquation(n.FUNC_ADD),v=Oi,T=Oi),le)switch($){case Hi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Eo:n.blendFunc(n.ONE,n.ONE);break;case uc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case dc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",$);break}else switch($){case Hi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Eo:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case uc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case dc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",$);break}M=null,S=null,A=null,k=null,_.set(0,0,0),w=0,y=$,C=le}return}Nt=Nt||At,ae=ae||Tt,se=se||Vt,(At!==v||Nt!==T)&&(n.blendEquationSeparate(Lt[At],Lt[Nt]),v=At,T=Nt),(Tt!==M||Vt!==S||ae!==A||se!==k)&&(n.blendFuncSeparate(kt[Tt],kt[Vt],kt[ae],kt[se]),M=Tt,S=Vt,A=ae,k=se),(ye.equals(_)===!1||Be!==w)&&(n.blendColor(ye.r,ye.g,ye.b,Be),_.copy(ye),w=Be),y=$,C=!1}function Ut($,At){$.side===fn?wt(n.CULL_FACE):Wt(n.CULL_FACE);let Tt=$.side===an;At&&(Tt=!Tt),It(Tt),$.blending===Hi&&$.transparent===!1?gt(wi):gt($.blending,$.blendEquation,$.blendSrc,$.blendDst,$.blendEquationAlpha,$.blendSrcAlpha,$.blendDstAlpha,$.blendColor,$.blendAlpha,$.premultipliedAlpha),l.setFunc($.depthFunc),l.setTest($.depthTest),l.setMask($.depthWrite),a.setMask($.colorWrite);const Vt=$.stencilWrite;c.setTest(Vt),Vt&&(c.setMask($.stencilWriteMask),c.setFunc($.stencilFunc,$.stencilRef,$.stencilFuncMask),c.setOp($.stencilFail,$.stencilZFail,$.stencilZPass)),q($.polygonOffset,$.polygonOffsetFactor,$.polygonOffsetUnits),$.alphaToCoverage===!0?Wt(n.SAMPLE_ALPHA_TO_COVERAGE):wt(n.SAMPLE_ALPHA_TO_COVERAGE)}function It($){F!==$&&($?n.frontFace(n.CW):n.frontFace(n.CCW),F=$)}function I($){$!==$f?(Wt(n.CULL_FACE),$!==z&&($===hc?n.cullFace(n.BACK):$===Vf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):wt(n.CULL_FACE),z=$}function D($){$!==P&&(Z&&n.lineWidth($),P=$)}function q($,At,Tt){$?(Wt(n.POLYGON_OFFSET_FILL),(B!==At||X!==Tt)&&(n.polygonOffset(At,Tt),B=At,X=Tt)):wt(n.POLYGON_OFFSET_FILL)}function rt($){$?Wt(n.SCISSOR_TEST):wt(n.SCISSOR_TEST)}function ht($){$===void 0&&($=n.TEXTURE0+J-1),tt!==$&&(n.activeTexture($),tt=$)}function ct($,At,Tt){Tt===void 0&&(tt===null?Tt=n.TEXTURE0+J-1:Tt=tt);let Vt=N[Tt];Vt===void 0&&(Vt={type:void 0,texture:void 0},N[Tt]=Vt),(Vt.type!==$||Vt.texture!==At)&&(tt!==Tt&&(n.activeTexture(Tt),tt=Tt),n.bindTexture($,At||O[$]),Vt.type=$,Vt.texture=At)}function Q(){const $=N[tt];$!==void 0&&$.type!==void 0&&(n.bindTexture($.type,null),$.type=void 0,$.texture=void 0)}function it(){try{n.compressedTexImage2D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function at(){try{n.compressedTexImage3D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function pt(){try{n.texSubImage2D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function mt(){try{n.texSubImage3D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function nt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function yt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function St(){try{n.texStorage2D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function Pt(){try{n.texStorage3D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function Ft(){try{n.texImage2D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function Et(){try{n.texImage3D.apply(n,arguments)}catch($){console.error("THREE.WebGLState:",$)}}function Gt($){_t.equals($)===!1&&(n.scissor($.x,$.y,$.z,$.w),_t.copy($))}function Jt($){bt.equals($)===!1&&(n.viewport($.x,$.y,$.z,$.w),bt.copy($))}function oe($,At){let Tt=u.get(At);Tt===void 0&&(Tt=new WeakMap,u.set(At,Tt));let Vt=Tt.get($);Vt===void 0&&(Vt=n.getUniformBlockIndex(At,$.name),Tt.set($,Vt))}function $t($,At){const Vt=u.get(At).get($);h.get(At)!==Vt&&(n.uniformBlockBinding(At,Vt,$.__bindingPointIndex),h.set(At,Vt))}function ot(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),f={},tt=null,N={},d={},g=new WeakMap,x=[],m=null,p=!1,y=null,v=null,M=null,S=null,T=null,A=null,k=null,_=new Zt(0,0,0),w=0,C=!1,F=null,z=null,P=null,B=null,X=null,_t.set(0,0,n.canvas.width,n.canvas.height),bt.set(0,0,n.canvas.width,n.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Wt,disable:wt,bindFramebuffer:Xt,drawBuffers:G,useProgram:vt,setBlending:gt,setMaterial:Ut,setFlipSided:It,setCullFace:I,setLineWidth:D,setPolygonOffset:q,setScissorTest:rt,activeTexture:ht,bindTexture:ct,unbindTexture:Q,compressedTexImage2D:it,compressedTexImage3D:at,texImage2D:Ft,texImage3D:Et,updateUBOMapping:oe,uniformBlockBinding:$t,texStorage2D:St,texStorage3D:Pt,texSubImage2D:pt,texSubImage3D:mt,compressedTexSubImage2D:nt,compressedTexSubImage3D:yt,scissor:Gt,viewport:Jt,reset:ot}}function t1(n,t,e,i,s,o,r){const a=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,D){return d?new OffscreenCanvas(I,D):Oa("canvas")}function x(I,D,q,rt){let ht=1;if((I.width>rt||I.height>rt)&&(ht=rt/Math.max(I.width,I.height)),ht<1||D===!0)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap){const ct=D?Na:Math.floor,Q=ct(ht*I.width),it=ct(ht*I.height);u===void 0&&(u=g(Q,it));const at=q?g(Q,it):u;return at.width=Q,at.height=it,at.getContext("2d").drawImage(I,0,0,Q,it),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+I.width+"x"+I.height+") to ("+Q+"x"+it+")."),at}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+I.width+"x"+I.height+")."),I;return I}function m(I){return gl(I.width)&&gl(I.height)}function p(I){return a?!1:I.wrapS!==pn||I.wrapT!==pn||I.minFilter!==Le&&I.minFilter!==$e}function y(I,D){return I.generateMipmaps&&D&&I.minFilter!==Le&&I.minFilter!==$e}function v(I){n.generateMipmap(I)}function M(I,D,q,rt,ht=!1){if(a===!1)return D;if(I!==null){if(n[I]!==void 0)return n[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let ct=D;if(D===n.RED&&(q===n.FLOAT&&(ct=n.R32F),q===n.HALF_FLOAT&&(ct=n.R16F),q===n.UNSIGNED_BYTE&&(ct=n.R8)),D===n.RED_INTEGER&&(q===n.UNSIGNED_BYTE&&(ct=n.R8UI),q===n.UNSIGNED_SHORT&&(ct=n.R16UI),q===n.UNSIGNED_INT&&(ct=n.R32UI),q===n.BYTE&&(ct=n.R8I),q===n.SHORT&&(ct=n.R16I),q===n.INT&&(ct=n.R32I)),D===n.RG&&(q===n.FLOAT&&(ct=n.RG32F),q===n.HALF_FLOAT&&(ct=n.RG16F),q===n.UNSIGNED_BYTE&&(ct=n.RG8)),D===n.RGBA){const Q=ht?Da:de.getTransfer(rt);q===n.FLOAT&&(ct=n.RGBA32F),q===n.HALF_FLOAT&&(ct=n.RGBA16F),q===n.UNSIGNED_BYTE&&(ct=Q===me?n.SRGB8_ALPHA8:n.RGBA8),q===n.UNSIGNED_SHORT_4_4_4_4&&(ct=n.RGBA4),q===n.UNSIGNED_SHORT_5_5_5_1&&(ct=n.RGB5_A1)}return(ct===n.R16F||ct===n.R32F||ct===n.RG16F||ct===n.RG32F||ct===n.RGBA16F||ct===n.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function S(I,D,q){return y(I,q)===!0||I.isFramebufferTexture&&I.minFilter!==Le&&I.minFilter!==$e?Math.log2(Math.max(D.width,D.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?D.mipmaps.length:1}function T(I){return I===Le||I===mc||I===dr?n.NEAREST:n.LINEAR}function A(I){const D=I.target;D.removeEventListener("dispose",A),_(D),D.isVideoTexture&&h.delete(D)}function k(I){const D=I.target;D.removeEventListener("dispose",k),C(D)}function _(I){const D=i.get(I);if(D.__webglInit===void 0)return;const q=I.source,rt=f.get(q);if(rt){const ht=rt[D.__cacheKey];ht.usedTimes--,ht.usedTimes===0&&w(I),Object.keys(rt).length===0&&f.delete(q)}i.remove(I)}function w(I){const D=i.get(I);n.deleteTexture(D.__webglTexture);const q=I.source,rt=f.get(q);delete rt[D.__cacheKey],r.memory.textures--}function C(I){const D=I.texture,q=i.get(I),rt=i.get(D);if(rt.__webglTexture!==void 0&&(n.deleteTexture(rt.__webglTexture),r.memory.textures--),I.depthTexture&&I.depthTexture.dispose(),I.isWebGLCubeRenderTarget)for(let ht=0;ht<6;ht++){if(Array.isArray(q.__webglFramebuffer[ht]))for(let ct=0;ct<q.__webglFramebuffer[ht].length;ct++)n.deleteFramebuffer(q.__webglFramebuffer[ht][ct]);else n.deleteFramebuffer(q.__webglFramebuffer[ht]);q.__webglDepthbuffer&&n.deleteRenderbuffer(q.__webglDepthbuffer[ht])}else{if(Array.isArray(q.__webglFramebuffer))for(let ht=0;ht<q.__webglFramebuffer.length;ht++)n.deleteFramebuffer(q.__webglFramebuffer[ht]);else n.deleteFramebuffer(q.__webglFramebuffer);if(q.__webglDepthbuffer&&n.deleteRenderbuffer(q.__webglDepthbuffer),q.__webglMultisampledFramebuffer&&n.deleteFramebuffer(q.__webglMultisampledFramebuffer),q.__webglColorRenderbuffer)for(let ht=0;ht<q.__webglColorRenderbuffer.length;ht++)q.__webglColorRenderbuffer[ht]&&n.deleteRenderbuffer(q.__webglColorRenderbuffer[ht]);q.__webglDepthRenderbuffer&&n.deleteRenderbuffer(q.__webglDepthRenderbuffer)}if(I.isWebGLMultipleRenderTargets)for(let ht=0,ct=D.length;ht<ct;ht++){const Q=i.get(D[ht]);Q.__webglTexture&&(n.deleteTexture(Q.__webglTexture),r.memory.textures--),i.remove(D[ht])}i.remove(D),i.remove(I)}let F=0;function z(){F=0}function P(){const I=F;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),F+=1,I}function B(I){const D=[];return D.push(I.wrapS),D.push(I.wrapT),D.push(I.wrapR||0),D.push(I.magFilter),D.push(I.minFilter),D.push(I.anisotropy),D.push(I.internalFormat),D.push(I.format),D.push(I.type),D.push(I.generateMipmaps),D.push(I.premultiplyAlpha),D.push(I.flipY),D.push(I.unpackAlignment),D.push(I.colorSpace),D.join()}function X(I,D){const q=i.get(I);if(I.isVideoTexture&&Ut(I),I.isRenderTargetTexture===!1&&I.version>0&&q.__version!==I.version){const rt=I.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{_t(q,I,D);return}}e.bindTexture(n.TEXTURE_2D,q.__webglTexture,n.TEXTURE0+D)}function J(I,D){const q=i.get(I);if(I.version>0&&q.__version!==I.version){_t(q,I,D);return}e.bindTexture(n.TEXTURE_2D_ARRAY,q.__webglTexture,n.TEXTURE0+D)}function Z(I,D){const q=i.get(I);if(I.version>0&&q.__version!==I.version){_t(q,I,D);return}e.bindTexture(n.TEXTURE_3D,q.__webglTexture,n.TEXTURE0+D)}function Y(I,D){const q=i.get(I);if(I.version>0&&q.__version!==I.version){bt(q,I,D);return}e.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture,n.TEXTURE0+D)}const st={[za]:n.REPEAT,[pn]:n.CLAMP_TO_EDGE,[pl]:n.MIRRORED_REPEAT},tt={[Le]:n.NEAREST,[mc]:n.NEAREST_MIPMAP_NEAREST,[dr]:n.NEAREST_MIPMAP_LINEAR,[$e]:n.LINEAR,[wp]:n.LINEAR_MIPMAP_NEAREST,[Ki]:n.LINEAR_MIPMAP_LINEAR},N={[Ip]:n.NEVER,[Hp]:n.ALWAYS,[Up]:n.LESS,[nd]:n.LEQUAL,[Fp]:n.EQUAL,[Bp]:n.GEQUAL,[Np]:n.GREATER,[Op]:n.NOTEQUAL};function K(I,D,q){if(q?(n.texParameteri(I,n.TEXTURE_WRAP_S,st[D.wrapS]),n.texParameteri(I,n.TEXTURE_WRAP_T,st[D.wrapT]),(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)&&n.texParameteri(I,n.TEXTURE_WRAP_R,st[D.wrapR]),n.texParameteri(I,n.TEXTURE_MAG_FILTER,tt[D.magFilter]),n.texParameteri(I,n.TEXTURE_MIN_FILTER,tt[D.minFilter])):(n.texParameteri(I,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(I,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)&&n.texParameteri(I,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(D.wrapS!==pn||D.wrapT!==pn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(I,n.TEXTURE_MAG_FILTER,T(D.magFilter)),n.texParameteri(I,n.TEXTURE_MIN_FILTER,T(D.minFilter)),D.minFilter!==Le&&D.minFilter!==$e&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),D.compareFunction&&(n.texParameteri(I,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(I,n.TEXTURE_COMPARE_FUNC,N[D.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const rt=t.get("EXT_texture_filter_anisotropic");if(D.magFilter===Le||D.minFilter!==dr&&D.minFilter!==Ki||D.type===ti&&t.has("OES_texture_float_linear")===!1||a===!1&&D.type===Yi&&t.has("OES_texture_half_float_linear")===!1)return;(D.anisotropy>1||i.get(D).__currentAnisotropy)&&(n.texParameterf(I,rt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(D.anisotropy,s.getMaxAnisotropy())),i.get(D).__currentAnisotropy=D.anisotropy)}}function lt(I,D){let q=!1;I.__webglInit===void 0&&(I.__webglInit=!0,D.addEventListener("dispose",A));const rt=D.source;let ht=f.get(rt);ht===void 0&&(ht={},f.set(rt,ht));const ct=B(D);if(ct!==I.__cacheKey){ht[ct]===void 0&&(ht[ct]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,q=!0),ht[ct].usedTimes++;const Q=ht[I.__cacheKey];Q!==void 0&&(ht[I.__cacheKey].usedTimes--,Q.usedTimes===0&&w(D)),I.__cacheKey=ct,I.__webglTexture=ht[ct].texture}return q}function _t(I,D,q){let rt=n.TEXTURE_2D;(D.isDataArrayTexture||D.isCompressedArrayTexture)&&(rt=n.TEXTURE_2D_ARRAY),D.isData3DTexture&&(rt=n.TEXTURE_3D);const ht=lt(I,D),ct=D.source;e.bindTexture(rt,I.__webglTexture,n.TEXTURE0+q);const Q=i.get(ct);if(ct.version!==Q.__version||ht===!0){e.activeTexture(n.TEXTURE0+q);const it=de.getPrimaries(de.workingColorSpace),at=D.colorSpace===Tn?null:de.getPrimaries(D.colorSpace),pt=D.colorSpace===Tn||it===at?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,D.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,D.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const mt=p(D)&&m(D.image)===!1;let nt=x(D.image,mt,!1,s.maxTextureSize);nt=It(D,nt);const yt=m(nt)||a,St=o.convert(D.format,D.colorSpace);let Pt=o.convert(D.type),Ft=M(D.internalFormat,St,Pt,D.colorSpace,D.isVideoTexture);K(rt,D,yt);let Et;const Gt=D.mipmaps,Jt=a&&D.isVideoTexture!==!0&&Ft!==td,oe=Q.__version===void 0||ht===!0,$t=S(D,nt,yt);if(D.isDepthTexture)Ft=n.DEPTH_COMPONENT,a?D.type===ti?Ft=n.DEPTH_COMPONENT32F:D.type===Qn?Ft=n.DEPTH_COMPONENT24:D.type===Gi?Ft=n.DEPTH24_STENCIL8:Ft=n.DEPTH_COMPONENT16:D.type===ti&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),D.format===$i&&Ft===n.DEPTH_COMPONENT&&D.type!==Fl&&D.type!==Qn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),D.type=Qn,Pt=o.convert(D.type)),D.format===Bs&&Ft===n.DEPTH_COMPONENT&&(Ft=n.DEPTH_STENCIL,D.type!==Gi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),D.type=Gi,Pt=o.convert(D.type))),oe&&(Jt?e.texStorage2D(n.TEXTURE_2D,1,Ft,nt.width,nt.height):e.texImage2D(n.TEXTURE_2D,0,Ft,nt.width,nt.height,0,St,Pt,null));else if(D.isDataTexture)if(Gt.length>0&&yt){Jt&&oe&&e.texStorage2D(n.TEXTURE_2D,$t,Ft,Gt[0].width,Gt[0].height);for(let ot=0,$=Gt.length;ot<$;ot++)Et=Gt[ot],Jt?e.texSubImage2D(n.TEXTURE_2D,ot,0,0,Et.width,Et.height,St,Pt,Et.data):e.texImage2D(n.TEXTURE_2D,ot,Ft,Et.width,Et.height,0,St,Pt,Et.data);D.generateMipmaps=!1}else Jt?(oe&&e.texStorage2D(n.TEXTURE_2D,$t,Ft,nt.width,nt.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,nt.width,nt.height,St,Pt,nt.data)):e.texImage2D(n.TEXTURE_2D,0,Ft,nt.width,nt.height,0,St,Pt,nt.data);else if(D.isCompressedTexture)if(D.isCompressedArrayTexture){Jt&&oe&&e.texStorage3D(n.TEXTURE_2D_ARRAY,$t,Ft,Gt[0].width,Gt[0].height,nt.depth);for(let ot=0,$=Gt.length;ot<$;ot++)Et=Gt[ot],D.format!==Mn?St!==null?Jt?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ot,0,0,0,Et.width,Et.height,nt.depth,St,Et.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ot,Ft,Et.width,Et.height,nt.depth,0,Et.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage3D(n.TEXTURE_2D_ARRAY,ot,0,0,0,Et.width,Et.height,nt.depth,St,Pt,Et.data):e.texImage3D(n.TEXTURE_2D_ARRAY,ot,Ft,Et.width,Et.height,nt.depth,0,St,Pt,Et.data)}else{Jt&&oe&&e.texStorage2D(n.TEXTURE_2D,$t,Ft,Gt[0].width,Gt[0].height);for(let ot=0,$=Gt.length;ot<$;ot++)Et=Gt[ot],D.format!==Mn?St!==null?Jt?e.compressedTexSubImage2D(n.TEXTURE_2D,ot,0,0,Et.width,Et.height,St,Et.data):e.compressedTexImage2D(n.TEXTURE_2D,ot,Ft,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage2D(n.TEXTURE_2D,ot,0,0,Et.width,Et.height,St,Pt,Et.data):e.texImage2D(n.TEXTURE_2D,ot,Ft,Et.width,Et.height,0,St,Pt,Et.data)}else if(D.isDataArrayTexture)Jt?(oe&&e.texStorage3D(n.TEXTURE_2D_ARRAY,$t,Ft,nt.width,nt.height,nt.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,St,Pt,nt.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,Ft,nt.width,nt.height,nt.depth,0,St,Pt,nt.data);else if(D.isData3DTexture)Jt?(oe&&e.texStorage3D(n.TEXTURE_3D,$t,Ft,nt.width,nt.height,nt.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,St,Pt,nt.data)):e.texImage3D(n.TEXTURE_3D,0,Ft,nt.width,nt.height,nt.depth,0,St,Pt,nt.data);else if(D.isFramebufferTexture){if(oe)if(Jt)e.texStorage2D(n.TEXTURE_2D,$t,Ft,nt.width,nt.height);else{let ot=nt.width,$=nt.height;for(let At=0;At<$t;At++)e.texImage2D(n.TEXTURE_2D,At,Ft,ot,$,0,St,Pt,null),ot>>=1,$>>=1}}else if(Gt.length>0&&yt){Jt&&oe&&e.texStorage2D(n.TEXTURE_2D,$t,Ft,Gt[0].width,Gt[0].height);for(let ot=0,$=Gt.length;ot<$;ot++)Et=Gt[ot],Jt?e.texSubImage2D(n.TEXTURE_2D,ot,0,0,St,Pt,Et):e.texImage2D(n.TEXTURE_2D,ot,Ft,St,Pt,Et);D.generateMipmaps=!1}else Jt?(oe&&e.texStorage2D(n.TEXTURE_2D,$t,Ft,nt.width,nt.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,St,Pt,nt)):e.texImage2D(n.TEXTURE_2D,0,Ft,St,Pt,nt);y(D,yt)&&v(rt),Q.__version=ct.version,D.onUpdate&&D.onUpdate(D)}I.__version=D.version}function bt(I,D,q){if(D.image.length!==6)return;const rt=lt(I,D),ht=D.source;e.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+q);const ct=i.get(ht);if(ht.version!==ct.__version||rt===!0){e.activeTexture(n.TEXTURE0+q);const Q=de.getPrimaries(de.workingColorSpace),it=D.colorSpace===Tn?null:de.getPrimaries(D.colorSpace),at=D.colorSpace===Tn||Q===it?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,D.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,D.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,at);const pt=D.isCompressedTexture||D.image[0].isCompressedTexture,mt=D.image[0]&&D.image[0].isDataTexture,nt=[];for(let ot=0;ot<6;ot++)!pt&&!mt?nt[ot]=x(D.image[ot],!1,!0,s.maxCubemapSize):nt[ot]=mt?D.image[ot].image:D.image[ot],nt[ot]=It(D,nt[ot]);const yt=nt[0],St=m(yt)||a,Pt=o.convert(D.format,D.colorSpace),Ft=o.convert(D.type),Et=M(D.internalFormat,Pt,Ft,D.colorSpace),Gt=a&&D.isVideoTexture!==!0,Jt=ct.__version===void 0||rt===!0;let oe=S(D,yt,St);K(n.TEXTURE_CUBE_MAP,D,St);let $t;if(pt){Gt&&Jt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,oe,Et,yt.width,yt.height);for(let ot=0;ot<6;ot++){$t=nt[ot].mipmaps;for(let $=0;$<$t.length;$++){const At=$t[$];D.format!==Mn?Pt!==null?Gt?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,$,0,0,At.width,At.height,Pt,At.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,$,Et,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,$,0,0,At.width,At.height,Pt,Ft,At.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,$,Et,At.width,At.height,0,Pt,Ft,At.data)}}}else{$t=D.mipmaps,Gt&&Jt&&($t.length>0&&oe++,e.texStorage2D(n.TEXTURE_CUBE_MAP,oe,Et,nt[0].width,nt[0].height));for(let ot=0;ot<6;ot++)if(mt){Gt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,nt[ot].width,nt[ot].height,Pt,Ft,nt[ot].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Et,nt[ot].width,nt[ot].height,0,Pt,Ft,nt[ot].data);for(let $=0;$<$t.length;$++){const Tt=$t[$].image[ot].image;Gt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,$+1,0,0,Tt.width,Tt.height,Pt,Ft,Tt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,$+1,Et,Tt.width,Tt.height,0,Pt,Ft,Tt.data)}}else{Gt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Pt,Ft,nt[ot]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Et,Pt,Ft,nt[ot]);for(let $=0;$<$t.length;$++){const At=$t[$];Gt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,$+1,0,0,Pt,Ft,At.image[ot]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,$+1,Et,Pt,Ft,At.image[ot])}}}y(D,St)&&v(n.TEXTURE_CUBE_MAP),ct.__version=ht.version,D.onUpdate&&D.onUpdate(D)}I.__version=D.version}function Dt(I,D,q,rt,ht,ct){const Q=o.convert(q.format,q.colorSpace),it=o.convert(q.type),at=M(q.internalFormat,Q,it,q.colorSpace);if(!i.get(D).__hasExternalTextures){const mt=Math.max(1,D.width>>ct),nt=Math.max(1,D.height>>ct);ht===n.TEXTURE_3D||ht===n.TEXTURE_2D_ARRAY?e.texImage3D(ht,ct,at,mt,nt,D.depth,0,Q,it,null):e.texImage2D(ht,ct,at,mt,nt,0,Q,it,null)}e.bindFramebuffer(n.FRAMEBUFFER,I),gt(D)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,rt,ht,i.get(q).__webglTexture,0,kt(D)):(ht===n.TEXTURE_2D||ht>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ht<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,rt,ht,i.get(q).__webglTexture,ct),e.bindFramebuffer(n.FRAMEBUFFER,null)}function O(I,D,q){if(n.bindRenderbuffer(n.RENDERBUFFER,I),D.depthBuffer&&!D.stencilBuffer){let rt=a===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(q||gt(D)){const ht=D.depthTexture;ht&&ht.isDepthTexture&&(ht.type===ti?rt=n.DEPTH_COMPONENT32F:ht.type===Qn&&(rt=n.DEPTH_COMPONENT24));const ct=kt(D);gt(D)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ct,rt,D.width,D.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,ct,rt,D.width,D.height)}else n.renderbufferStorage(n.RENDERBUFFER,rt,D.width,D.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,I)}else if(D.depthBuffer&&D.stencilBuffer){const rt=kt(D);q&&gt(D)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,rt,n.DEPTH24_STENCIL8,D.width,D.height):gt(D)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,rt,n.DEPTH24_STENCIL8,D.width,D.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,I)}else{const rt=D.isWebGLMultipleRenderTargets===!0?D.texture:[D.texture];for(let ht=0;ht<rt.length;ht++){const ct=rt[ht],Q=o.convert(ct.format,ct.colorSpace),it=o.convert(ct.type),at=M(ct.internalFormat,Q,it,ct.colorSpace),pt=kt(D);q&&gt(D)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,pt,at,D.width,D.height):gt(D)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,pt,at,D.width,D.height):n.renderbufferStorage(n.RENDERBUFFER,at,D.width,D.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Wt(I,D){if(D&&D.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,I),!(D.depthTexture&&D.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(D.depthTexture).__webglTexture||D.depthTexture.image.width!==D.width||D.depthTexture.image.height!==D.height)&&(D.depthTexture.image.width=D.width,D.depthTexture.image.height=D.height,D.depthTexture.needsUpdate=!0),X(D.depthTexture,0);const rt=i.get(D.depthTexture).__webglTexture,ht=kt(D);if(D.depthTexture.format===$i)gt(D)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,rt,0,ht):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,rt,0);else if(D.depthTexture.format===Bs)gt(D)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,rt,0,ht):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function wt(I){const D=i.get(I),q=I.isWebGLCubeRenderTarget===!0;if(I.depthTexture&&!D.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");Wt(D.__webglFramebuffer,I)}else if(q){D.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)e.bindFramebuffer(n.FRAMEBUFFER,D.__webglFramebuffer[rt]),D.__webglDepthbuffer[rt]=n.createRenderbuffer(),O(D.__webglDepthbuffer[rt],I,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,D.__webglFramebuffer),D.__webglDepthbuffer=n.createRenderbuffer(),O(D.__webglDepthbuffer,I,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function Xt(I,D,q){const rt=i.get(I);D!==void 0&&Dt(rt.__webglFramebuffer,I,I.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),q!==void 0&&wt(I)}function G(I){const D=I.texture,q=i.get(I),rt=i.get(D);I.addEventListener("dispose",k),I.isWebGLMultipleRenderTargets!==!0&&(rt.__webglTexture===void 0&&(rt.__webglTexture=n.createTexture()),rt.__version=D.version,r.memory.textures++);const ht=I.isWebGLCubeRenderTarget===!0,ct=I.isWebGLMultipleRenderTargets===!0,Q=m(I)||a;if(ht){q.__webglFramebuffer=[];for(let it=0;it<6;it++)if(a&&D.mipmaps&&D.mipmaps.length>0){q.__webglFramebuffer[it]=[];for(let at=0;at<D.mipmaps.length;at++)q.__webglFramebuffer[it][at]=n.createFramebuffer()}else q.__webglFramebuffer[it]=n.createFramebuffer()}else{if(a&&D.mipmaps&&D.mipmaps.length>0){q.__webglFramebuffer=[];for(let it=0;it<D.mipmaps.length;it++)q.__webglFramebuffer[it]=n.createFramebuffer()}else q.__webglFramebuffer=n.createFramebuffer();if(ct)if(s.drawBuffers){const it=I.texture;for(let at=0,pt=it.length;at<pt;at++){const mt=i.get(it[at]);mt.__webglTexture===void 0&&(mt.__webglTexture=n.createTexture(),r.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&I.samples>0&&gt(I)===!1){const it=ct?D:[D];q.__webglMultisampledFramebuffer=n.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let at=0;at<it.length;at++){const pt=it[at];q.__webglColorRenderbuffer[at]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,q.__webglColorRenderbuffer[at]);const mt=o.convert(pt.format,pt.colorSpace),nt=o.convert(pt.type),yt=M(pt.internalFormat,mt,nt,pt.colorSpace,I.isXRRenderTarget===!0),St=kt(I);n.renderbufferStorageMultisample(n.RENDERBUFFER,St,yt,I.width,I.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,q.__webglColorRenderbuffer[at])}n.bindRenderbuffer(n.RENDERBUFFER,null),I.depthBuffer&&(q.__webglDepthRenderbuffer=n.createRenderbuffer(),O(q.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ht){e.bindTexture(n.TEXTURE_CUBE_MAP,rt.__webglTexture),K(n.TEXTURE_CUBE_MAP,D,Q);for(let it=0;it<6;it++)if(a&&D.mipmaps&&D.mipmaps.length>0)for(let at=0;at<D.mipmaps.length;at++)Dt(q.__webglFramebuffer[it][at],I,D,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+it,at);else Dt(q.__webglFramebuffer[it],I,D,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);y(D,Q)&&v(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ct){const it=I.texture;for(let at=0,pt=it.length;at<pt;at++){const mt=it[at],nt=i.get(mt);e.bindTexture(n.TEXTURE_2D,nt.__webglTexture),K(n.TEXTURE_2D,mt,Q),Dt(q.__webglFramebuffer,I,mt,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,0),y(mt,Q)&&v(n.TEXTURE_2D)}e.unbindTexture()}else{let it=n.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(a?it=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(it,rt.__webglTexture),K(it,D,Q),a&&D.mipmaps&&D.mipmaps.length>0)for(let at=0;at<D.mipmaps.length;at++)Dt(q.__webglFramebuffer[at],I,D,n.COLOR_ATTACHMENT0,it,at);else Dt(q.__webglFramebuffer,I,D,n.COLOR_ATTACHMENT0,it,0);y(D,Q)&&v(it),e.unbindTexture()}I.depthBuffer&&wt(I)}function vt(I){const D=m(I)||a,q=I.isWebGLMultipleRenderTargets===!0?I.texture:[I.texture];for(let rt=0,ht=q.length;rt<ht;rt++){const ct=q[rt];if(y(ct,D)){const Q=I.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,it=i.get(ct).__webglTexture;e.bindTexture(Q,it),v(Q),e.unbindTexture()}}}function Lt(I){if(a&&I.samples>0&&gt(I)===!1){const D=I.isWebGLMultipleRenderTargets?I.texture:[I.texture],q=I.width,rt=I.height;let ht=n.COLOR_BUFFER_BIT;const ct=[],Q=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=i.get(I),at=I.isWebGLMultipleRenderTargets===!0;if(at)for(let pt=0;pt<D.length;pt++)e.bindFramebuffer(n.FRAMEBUFFER,it.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,it.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,it.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,it.__webglFramebuffer);for(let pt=0;pt<D.length;pt++){ct.push(n.COLOR_ATTACHMENT0+pt),I.depthBuffer&&ct.push(Q);const mt=it.__ignoreDepthValues!==void 0?it.__ignoreDepthValues:!1;if(mt===!1&&(I.depthBuffer&&(ht|=n.DEPTH_BUFFER_BIT),I.stencilBuffer&&(ht|=n.STENCIL_BUFFER_BIT)),at&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,it.__webglColorRenderbuffer[pt]),mt===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[Q]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[Q])),at){const nt=i.get(D[pt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,nt,0)}n.blitFramebuffer(0,0,q,rt,0,0,q,rt,ht,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ct)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),at)for(let pt=0;pt<D.length;pt++){e.bindFramebuffer(n.FRAMEBUFFER,it.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,it.__webglColorRenderbuffer[pt]);const mt=i.get(D[pt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,it.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,mt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,it.__webglMultisampledFramebuffer)}}function kt(I){return Math.min(s.maxSamples,I.samples)}function gt(I){const D=i.get(I);return a&&I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&D.__useRenderToTexture!==!1}function Ut(I){const D=r.render.frame;h.get(I)!==D&&(h.set(I,D),I.update())}function It(I,D){const q=I.colorSpace,rt=I.format,ht=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||I.format===ml||q!==si&&q!==Tn&&(de.getTransfer(q)===me?a===!1?t.has("EXT_sRGB")===!0&&rt===Mn?(I.format=ml,I.minFilter=$e,I.generateMipmaps=!1):D=sd.sRGBToLinear(D):(rt!==Mn||ht!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),D}this.allocateTextureUnit=P,this.resetTextureUnits=z,this.setTexture2D=X,this.setTexture2DArray=J,this.setTexture3D=Z,this.setTextureCube=Y,this.rebindTextures=Xt,this.setupRenderTarget=G,this.updateRenderTargetMipmap=vt,this.updateMultisampleRenderTarget=Lt,this.setupDepthRenderbuffer=wt,this.setupFrameBufferTexture=Dt,this.useMultisampledRTT=gt}function e1(n,t,e){const i=e.isWebGL2;function s(o,r=Tn){let a;const l=de.getTransfer(r);if(o===An)return n.UNSIGNED_BYTE;if(o===Ku)return n.UNSIGNED_SHORT_4_4_4_4;if(o===Yu)return n.UNSIGNED_SHORT_5_5_5_1;if(o===Sp)return n.BYTE;if(o===Ep)return n.SHORT;if(o===Fl)return n.UNSIGNED_SHORT;if(o===qu)return n.INT;if(o===Qn)return n.UNSIGNED_INT;if(o===ti)return n.FLOAT;if(o===Yi)return i?n.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(o===Tp)return n.ALPHA;if(o===Mn)return n.RGBA;if(o===Ap)return n.LUMINANCE;if(o===Cp)return n.LUMINANCE_ALPHA;if(o===$i)return n.DEPTH_COMPONENT;if(o===Bs)return n.DEPTH_STENCIL;if(o===ml)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(o===Nl)return n.RED;if(o===Zu)return n.RED_INTEGER;if(o===Rp)return n.RG;if(o===Ju)return n.RG_INTEGER;if(o===Qu)return n.RGBA_INTEGER;if(o===fr||o===pr||o===mr||o===gr)if(l===me)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(o===fr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===pr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===mr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===gr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(o===fr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===pr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===mr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===gr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===gc||o===vc||o===xc||o===yc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(o===gc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===vc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===xc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===yc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===td)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===Mc||o===_c)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(o===Mc)return l===me?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(o===_c)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===bc||o===wc||o===Sc||o===Ec||o===Tc||o===Ac||o===Cc||o===Rc||o===Lc||o===kc||o===Pc||o===zc||o===Dc||o===Ic)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(o===bc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===wc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===Sc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===Ec)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===Tc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===Ac)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===Cc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===Rc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===Lc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===kc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===Pc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===zc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===Dc)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===Ic)return l===me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===vr||o===Uc||o===Fc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(o===vr)return l===me?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===Uc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===Fc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===Lp||o===Nc||o===Oc||o===Bc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(o===vr)return a.COMPRESSED_RED_RGTC1_EXT;if(o===Nc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===Oc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===Bc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===Gi?i?n.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):n[o]!==void 0?n[o]:null}return{convert:s}}class n1 extends dn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class sn extends mn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const i1={type:"move"};class Br{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new sn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new sn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new j,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new j),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new sn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new j,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new j),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,o=null,r=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,i),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,i),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(i1)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new sn;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class s1 extends Ws{constructor(t,e){super();const i=this;let s=null,o=1,r=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null;const x=e.getContextAttributes();let m=null,p=null;const y=[],v=[],M=new qt;let S=null;const T=new dn;T.layers.enable(1),T.viewport=new Se;const A=new dn;A.layers.enable(2),A.viewport=new Se;const k=[T,A],_=new n1;_.layers.enable(1),_.layers.enable(2);let w=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let lt=y[K];return lt===void 0&&(lt=new Br,y[K]=lt),lt.getTargetRaySpace()},this.getControllerGrip=function(K){let lt=y[K];return lt===void 0&&(lt=new Br,y[K]=lt),lt.getGripSpace()},this.getHand=function(K){let lt=y[K];return lt===void 0&&(lt=new Br,y[K]=lt),lt.getHandSpace()};function F(K){const lt=v.indexOf(K.inputSource);if(lt===-1)return;const _t=y[lt];_t!==void 0&&(_t.update(K.inputSource,K.frame,c||r),_t.dispatchEvent({type:K.type,data:K.inputSource}))}function z(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",P);for(let K=0;K<y.length;K++){const lt=v[K];lt!==null&&(v[K]=null,y[K].disconnect(lt))}w=null,C=null,t.setRenderTarget(m),d=null,f=null,u=null,s=null,p=null,N.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(M.width,M.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){o=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",z),s.addEventListener("inputsourceschange",P),x.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const lt={antialias:s.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(s,e,lt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new Vn(d.framebufferWidth,d.framebufferHeight,{format:Mn,type:An,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let lt=null,_t=null,bt=null;x.depth&&(bt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,lt=x.stencil?Bs:$i,_t=x.stencil?Gi:Qn);const Dt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:o};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(Dt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),p=new Vn(f.textureWidth,f.textureHeight,{format:Mn,type:An,depthTexture:new Wl(f.textureWidth,f.textureHeight,_t,void 0,void 0,void 0,void 0,void 0,void 0,lt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});const O=t.properties.get(p);O.__ignoreDepthValues=f.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(a),N.setContext(s),N.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function P(K){for(let lt=0;lt<K.removed.length;lt++){const _t=K.removed[lt],bt=v.indexOf(_t);bt>=0&&(v[bt]=null,y[bt].disconnect(_t))}for(let lt=0;lt<K.added.length;lt++){const _t=K.added[lt];let bt=v.indexOf(_t);if(bt===-1){for(let O=0;O<y.length;O++)if(O>=v.length){v.push(_t),bt=O;break}else if(v[O]===null){v[O]=_t,bt=O;break}if(bt===-1)break}const Dt=y[bt];Dt&&Dt.connect(_t)}}const B=new j,X=new j;function J(K,lt,_t){B.setFromMatrixPosition(lt.matrixWorld),X.setFromMatrixPosition(_t.matrixWorld);const bt=B.distanceTo(X),Dt=lt.projectionMatrix.elements,O=_t.projectionMatrix.elements,Wt=Dt[14]/(Dt[10]-1),wt=Dt[14]/(Dt[10]+1),Xt=(Dt[9]+1)/Dt[5],G=(Dt[9]-1)/Dt[5],vt=(Dt[8]-1)/Dt[0],Lt=(O[8]+1)/O[0],kt=Wt*vt,gt=Wt*Lt,Ut=bt/(-vt+Lt),It=Ut*-vt;lt.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(It),K.translateZ(Ut),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert();const I=Wt+Ut,D=wt+Ut,q=kt-It,rt=gt+(bt-It),ht=Xt*wt/D*I,ct=G*wt/D*I;K.projectionMatrix.makePerspective(q,rt,ht,ct,I,D),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}function Z(K,lt){lt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(lt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;_.near=A.near=T.near=K.near,_.far=A.far=T.far=K.far,(w!==_.near||C!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),w=_.near,C=_.far);const lt=K.parent,_t=_.cameras;Z(_,lt);for(let bt=0;bt<_t.length;bt++)Z(_t[bt],lt);_t.length===2?J(_,T,A):_.projectionMatrix.copy(T.projectionMatrix),Y(K,_,lt)};function Y(K,lt,_t){_t===null?K.matrix.copy(lt.matrixWorld):(K.matrix.copy(_t.matrixWorld),K.matrix.invert(),K.matrix.multiply(lt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(lt.projectionMatrix),K.projectionMatrixInverse.copy(lt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=To*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(K){l=K,f!==null&&(f.fixedFoveation=K),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=K)};let st=null;function tt(K,lt){if(h=lt.getViewerPose(c||r),g=lt,h!==null){const _t=h.views;d!==null&&(t.setRenderTargetFramebuffer(p,d.framebuffer),t.setRenderTarget(p));let bt=!1;_t.length!==_.cameras.length&&(_.cameras.length=0,bt=!0);for(let Dt=0;Dt<_t.length;Dt++){const O=_t[Dt];let Wt=null;if(d!==null)Wt=d.getViewport(O);else{const Xt=u.getViewSubImage(f,O);Wt=Xt.viewport,Dt===0&&(t.setRenderTargetTextures(p,Xt.colorTexture,f.ignoreDepthValues?void 0:Xt.depthStencilTexture),t.setRenderTarget(p))}let wt=k[Dt];wt===void 0&&(wt=new dn,wt.layers.enable(Dt),wt.viewport=new Se,k[Dt]=wt),wt.matrix.fromArray(O.transform.matrix),wt.matrix.decompose(wt.position,wt.quaternion,wt.scale),wt.projectionMatrix.fromArray(O.projectionMatrix),wt.projectionMatrixInverse.copy(wt.projectionMatrix).invert(),wt.viewport.set(Wt.x,Wt.y,Wt.width,Wt.height),Dt===0&&(_.matrix.copy(wt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),bt===!0&&_.cameras.push(wt)}}for(let _t=0;_t<y.length;_t++){const bt=v[_t],Dt=y[_t];bt!==null&&Dt!==void 0&&Dt.update(bt,lt,c||r)}st&&st(K,lt),lt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:lt}),g=null}const N=new pd;N.setAnimationLoop(tt),this.setAnimationLoop=function(K){st=K},this.dispose=function(){}}}function o1(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,ud(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,y,v,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),u(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,M)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),x(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,y,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===an&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===an&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=t.get(p).envMap;if(y&&(m.envMap.value=y,m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const v=n._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*v,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===an&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function a1(n,t,e,i){let s={},o={},r=[];const a=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,v){const M=v.program;i.uniformBlockBinding(y,M)}function c(y,v){let M=s[y.id];M===void 0&&(g(y),M=h(y),s[y.id]=M,y.addEventListener("dispose",m));const S=v.program;i.updateUBOMapping(y,S);const T=t.render.frame;o[y.id]!==T&&(f(y),o[y.id]=T)}function h(y){const v=u();y.__bindingPointIndex=v;const M=n.createBuffer(),S=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,S,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,M),M}function u(){for(let y=0;y<a;y++)if(r.indexOf(y)===-1)return r.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const v=s[y.id],M=y.uniforms,S=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,A=M.length;T<A;T++){const k=Array.isArray(M[T])?M[T]:[M[T]];for(let _=0,w=k.length;_<w;_++){const C=k[_];if(d(C,T,_,S)===!0){const F=C.__offset,z=Array.isArray(C.value)?C.value:[C.value];let P=0;for(let B=0;B<z.length;B++){const X=z[B],J=x(X);typeof X=="number"||typeof X=="boolean"?(C.__data[0]=X,n.bufferSubData(n.UNIFORM_BUFFER,F+P,C.__data)):X.isMatrix3?(C.__data[0]=X.elements[0],C.__data[1]=X.elements[1],C.__data[2]=X.elements[2],C.__data[3]=0,C.__data[4]=X.elements[3],C.__data[5]=X.elements[4],C.__data[6]=X.elements[5],C.__data[7]=0,C.__data[8]=X.elements[6],C.__data[9]=X.elements[7],C.__data[10]=X.elements[8],C.__data[11]=0):(X.toArray(C.__data,P),P+=J.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(y,v,M,S){const T=y.value,A=v+"_"+M;if(S[A]===void 0)return typeof T=="number"||typeof T=="boolean"?S[A]=T:S[A]=T.clone(),!0;{const k=S[A];if(typeof T=="number"||typeof T=="boolean"){if(k!==T)return S[A]=T,!0}else if(k.equals(T)===!1)return k.copy(T),!0}return!1}function g(y){const v=y.uniforms;let M=0;const S=16;for(let A=0,k=v.length;A<k;A++){const _=Array.isArray(v[A])?v[A]:[v[A]];for(let w=0,C=_.length;w<C;w++){const F=_[w],z=Array.isArray(F.value)?F.value:[F.value];for(let P=0,B=z.length;P<B;P++){const X=z[P],J=x(X),Z=M%S;Z!==0&&S-Z<J.boundary&&(M+=S-Z),F.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=J.storage}}}const T=M%S;return T>0&&(M+=S-T),y.__size=M,y.__cache={},this}function x(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function m(y){const v=y.target;v.removeEventListener("dispose",m);const M=r.indexOf(v.__bindingPointIndex);r.splice(M,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete o[v.id]}function p(){for(const y in s)n.deleteBuffer(s[y]);r=[],s={},o={}}return{bind:l,update:c,dispose:p}}class Md{constructor(t={}){const{canvas:e=n0(),context:i=null,depth:s=!0,stencil:o=!0,alpha:r=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;i!==null?f=i.getContextAttributes().alpha:f=r;const d=new Uint32Array(4),g=new Int32Array(4);let x=null,m=null;const p=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Fe,this._useLegacyLights=!1,this.toneMapping=Si,this.toneMappingExposure=1;const v=this;let M=!1,S=0,T=0,A=null,k=-1,_=null;const w=new Se,C=new Se;let F=null;const z=new Zt(0);let P=0,B=e.width,X=e.height,J=1,Z=null,Y=null;const st=new Se(0,0,B,X),tt=new Se(0,0,B,X);let N=!1;const K=new $l;let lt=!1,_t=!1,bt=null;const Dt=new pe,O=new qt,Wt=new j,wt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Xt(){return A===null?J:1}let G=i;function vt(b,E){for(let R=0;R<b.length;R++){const L=b[R],U=e.getContext(L,E);if(U!==null)return U}return null}try{const b={alpha:!0,depth:s,stencil:o,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ul}`),e.addEventListener("webglcontextlost",ot,!1),e.addEventListener("webglcontextrestored",$,!1),e.addEventListener("webglcontextcreationerror",At,!1),G===null){const E=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&E.shift(),G=vt(E,b),G===null)throw vt(E)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&G instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),G.getShaderPrecisionFormat===void 0&&(G.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Lt,kt,gt,Ut,It,I,D,q,rt,ht,ct,Q,it,at,pt,mt,nt,yt,St,Pt,Ft,Et,Gt,Jt;function oe(){Lt=new gv(G),kt=new hv(G,Lt,t),Lt.init(kt),Et=new e1(G,Lt,kt),gt=new Qx(G,Lt,kt),Ut=new yv(G),It=new Ox,I=new t1(G,Lt,gt,It,kt,Et,Ut),D=new dv(v),q=new mv(v),rt=new A0(G,kt),Gt=new lv(G,Lt,rt,kt),ht=new vv(G,rt,Ut,Gt),ct=new wv(G,ht,rt,Ut),St=new bv(G,kt,I),mt=new uv(It),Q=new Nx(v,D,q,Lt,kt,Gt,mt),it=new o1(v,It),at=new Hx,pt=new Xx(Lt,kt),yt=new rv(v,D,q,gt,ct,f,l),nt=new Jx(v,ct,kt),Jt=new a1(G,Ut,kt,gt),Pt=new cv(G,Lt,Ut,kt),Ft=new xv(G,Lt,Ut,kt),Ut.programs=Q.programs,v.capabilities=kt,v.extensions=Lt,v.properties=It,v.renderLists=at,v.shadowMap=nt,v.state=gt,v.info=Ut}oe();const $t=new s1(v,G);this.xr=$t,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const b=Lt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Lt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(b){b!==void 0&&(J=b,this.setSize(B,X,!1))},this.getSize=function(b){return b.set(B,X)},this.setSize=function(b,E,R=!0){if($t.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=b,X=E,e.width=Math.floor(b*J),e.height=Math.floor(E*J),R===!0&&(e.style.width=b+"px",e.style.height=E+"px"),this.setViewport(0,0,b,E)},this.getDrawingBufferSize=function(b){return b.set(B*J,X*J).floor()},this.setDrawingBufferSize=function(b,E,R){B=b,X=E,J=R,e.width=Math.floor(b*R),e.height=Math.floor(E*R),this.setViewport(0,0,b,E)},this.getCurrentViewport=function(b){return b.copy(w)},this.getViewport=function(b){return b.copy(st)},this.setViewport=function(b,E,R,L){b.isVector4?st.set(b.x,b.y,b.z,b.w):st.set(b,E,R,L),gt.viewport(w.copy(st).multiplyScalar(J).floor())},this.getScissor=function(b){return b.copy(tt)},this.setScissor=function(b,E,R,L){b.isVector4?tt.set(b.x,b.y,b.z,b.w):tt.set(b,E,R,L),gt.scissor(C.copy(tt).multiplyScalar(J).floor())},this.getScissorTest=function(){return N},this.setScissorTest=function(b){gt.setScissorTest(N=b)},this.setOpaqueSort=function(b){Z=b},this.setTransparentSort=function(b){Y=b},this.getClearColor=function(b){return b.copy(yt.getClearColor())},this.setClearColor=function(){yt.setClearColor.apply(yt,arguments)},this.getClearAlpha=function(){return yt.getClearAlpha()},this.setClearAlpha=function(){yt.setClearAlpha.apply(yt,arguments)},this.clear=function(b=!0,E=!0,R=!0){let L=0;if(b){let U=!1;if(A!==null){const H=A.texture.format;U=H===Qu||H===Ju||H===Zu}if(U){const H=A.texture.type,V=H===An||H===Qn||H===Fl||H===Gi||H===Ku||H===Yu,W=yt.getClearColor(),et=yt.getClearAlpha(),dt=W.r,ft=W.g,Mt=W.b;V?(d[0]=dt,d[1]=ft,d[2]=Mt,d[3]=et,G.clearBufferuiv(G.COLOR,0,d)):(g[0]=dt,g[1]=ft,g[2]=Mt,g[3]=et,G.clearBufferiv(G.COLOR,0,g))}else L|=G.COLOR_BUFFER_BIT}E&&(L|=G.DEPTH_BUFFER_BIT),R&&(L|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(L)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ot,!1),e.removeEventListener("webglcontextrestored",$,!1),e.removeEventListener("webglcontextcreationerror",At,!1),at.dispose(),pt.dispose(),It.dispose(),D.dispose(),q.dispose(),ct.dispose(),Gt.dispose(),Jt.dispose(),Q.dispose(),$t.dispose(),$t.removeEventListener("sessionstart",Be),$t.removeEventListener("sessionend",le),bt&&(bt.dispose(),bt=null),De.stop()};function ot(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function $(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const b=Ut.autoReset,E=nt.enabled,R=nt.autoUpdate,L=nt.needsUpdate,U=nt.type;oe(),Ut.autoReset=b,nt.enabled=E,nt.autoUpdate=R,nt.needsUpdate=L,nt.type=U}function At(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Tt(b){const E=b.target;E.removeEventListener("dispose",Tt),Vt(E)}function Vt(b){Nt(b),It.remove(b)}function Nt(b){const E=It.get(b).programs;E!==void 0&&(E.forEach(function(R){Q.releaseProgram(R)}),b.isShaderMaterial&&Q.releaseShaderCache(b))}this.renderBufferDirect=function(b,E,R,L,U,H){E===null&&(E=wt);const V=U.isMesh&&U.matrixWorld.determinant()<0,W=Bo(b,E,R,L,U);gt.setMaterial(L,V);let et=R.index,dt=1;if(L.wireframe===!0){if(et=ht.getWireframeAttribute(R),et===void 0)return;dt=2}const ft=R.drawRange,Mt=R.attributes.position;let Ot=ft.start*dt,Kt=(ft.start+ft.count)*dt;H!==null&&(Ot=Math.max(Ot,H.start*dt),Kt=Math.min(Kt,(H.start+H.count)*dt)),et!==null?(Ot=Math.max(Ot,0),Kt=Math.min(Kt,et.count)):Mt!=null&&(Ot=Math.max(Ot,0),Kt=Math.min(Kt,Mt.count));const Qt=Kt-Ot;if(Qt<0||Qt===1/0)return;Gt.setup(U,L,W,R,et);let re,Bt=Pt;if(et!==null&&(re=rt.get(et),Bt=Ft,Bt.setIndex(re)),U.isMesh)L.wireframe===!0?(gt.setLineWidth(L.wireframeLinewidth*Xt()),Bt.setMode(G.LINES)):Bt.setMode(G.TRIANGLES);else if(U.isLine){let Ct=L.linewidth;Ct===void 0&&(Ct=1),gt.setLineWidth(Ct*Xt()),U.isLineSegments?Bt.setMode(G.LINES):U.isLineLoop?Bt.setMode(G.LINE_LOOP):Bt.setMode(G.LINE_STRIP)}else U.isPoints?Bt.setMode(G.POINTS):U.isSprite&&Bt.setMode(G.TRIANGLES);if(U.isBatchedMesh)Bt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else if(U.isInstancedMesh)Bt.renderInstances(Ot,Qt,U.count);else if(R.isInstancedBufferGeometry){const Ct=R._maxInstanceCount!==void 0?R._maxInstanceCount:1/0,fe=Math.min(R.instanceCount,Ct);Bt.renderInstances(Ot,Qt,fe)}else Bt.render(Ot,Qt)};function ae(b,E,R){b.transparent===!0&&b.side===fn&&b.forceSinglePass===!1?(b.side=an,b.needsUpdate=!0,ki(b,E,R),b.side=Ai,b.needsUpdate=!0,ki(b,E,R),b.side=fn):ki(b,E,R)}this.compile=function(b,E,R=null){R===null&&(R=b),m=pt.get(R),m.init(),y.push(m),R.traverseVisible(function(U){U.isLight&&U.layers.test(E.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),b!==R&&b.traverseVisible(function(U){U.isLight&&U.layers.test(E.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),m.setupLights(v._useLegacyLights);const L=new Set;return b.traverse(function(U){const H=U.material;if(H)if(Array.isArray(H))for(let V=0;V<H.length;V++){const W=H[V];ae(W,R,U),L.add(W)}else ae(H,R,U),L.add(H)}),y.pop(),m=null,L},this.compileAsync=function(b,E,R=null){const L=this.compile(b,E,R);return new Promise(U=>{function H(){if(L.forEach(function(V){It.get(V).currentProgram.isReady()&&L.delete(V)}),L.size===0){U(b);return}setTimeout(H,10)}Lt.get("KHR_parallel_shader_compile")!==null?H():setTimeout(H,10)})};let se=null;function ye(b){se&&se(b)}function Be(){De.stop()}function le(){De.start()}const De=new pd;De.setAnimationLoop(ye),typeof self<"u"&&De.setContext(self),this.setAnimationLoop=function(b){se=b,$t.setAnimationLoop(b),b===null?De.stop():De.start()},$t.addEventListener("sessionstart",Be),$t.addEventListener("sessionend",le),this.render=function(b,E){if(E!==void 0&&E.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),E.parent===null&&E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),$t.enabled===!0&&$t.isPresenting===!0&&($t.cameraAutoUpdate===!0&&$t.updateCamera(E),E=$t.getCamera()),b.isScene===!0&&b.onBeforeRender(v,b,E,A),m=pt.get(b,y.length),m.init(),y.push(m),Dt.multiplyMatrices(E.projectionMatrix,E.matrixWorldInverse),K.setFromProjectionMatrix(Dt),_t=this.localClippingEnabled,lt=mt.init(this.clippingPlanes,_t),x=at.get(b,p.length),x.init(),p.push(x),bn(b,E,0,v.sortObjects),x.finish(),v.sortObjects===!0&&x.sort(Z,Y),this.info.render.frame++,lt===!0&&mt.beginShadows();const R=m.state.shadowsArray;if(nt.render(R,b,E),lt===!0&&mt.endShadows(),this.info.autoReset===!0&&this.info.reset(),yt.render(x,b),m.setupLights(v._useLegacyLights),E.isArrayCamera){const L=E.cameras;for(let U=0,H=L.length;U<H;U++){const V=L[U];Oo(x,b,V,V.viewport)}}else Oo(x,b,E);A!==null&&(I.updateMultisampleRenderTarget(A),I.updateRenderTargetMipmap(A)),b.isScene===!0&&b.onAfterRender(v,b,E),Gt.resetDefaultState(),k=-1,_=null,y.pop(),y.length>0?m=y[y.length-1]:m=null,p.pop(),p.length>0?x=p[p.length-1]:x=null};function bn(b,E,R,L){if(b.visible===!1)return;if(b.layers.test(E.layers)){if(b.isGroup)R=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(E);else if(b.isLight)m.pushLight(b),b.castShadow&&m.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||K.intersectsSprite(b)){L&&Wt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Dt);const V=ct.update(b),W=b.material;W.visible&&x.push(b,V,W,R,Wt.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||K.intersectsObject(b))){const V=ct.update(b),W=b.material;if(L&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Wt.copy(b.boundingSphere.center)):(V.boundingSphere===null&&V.computeBoundingSphere(),Wt.copy(V.boundingSphere.center)),Wt.applyMatrix4(b.matrixWorld).applyMatrix4(Dt)),Array.isArray(W)){const et=V.groups;for(let dt=0,ft=et.length;dt<ft;dt++){const Mt=et[dt],Ot=W[Mt.materialIndex];Ot&&Ot.visible&&x.push(b,V,Ot,R,Wt.z,Mt)}}else W.visible&&x.push(b,V,W,R,Wt.z,null)}}const H=b.children;for(let V=0,W=H.length;V<W;V++)bn(H[V],E,R,L)}function Oo(b,E,R,L){const U=b.opaque,H=b.transmissive,V=b.transparent;m.setupLightsView(R),lt===!0&&mt.setGlobalState(v.clippingPlanes,R),H.length>0&&rr(U,H,E,R),L&&gt.viewport(w.copy(L)),U.length>0&&is(U,E,R),H.length>0&&is(H,E,R),V.length>0&&is(V,E,R),gt.buffers.depth.setTest(!0),gt.buffers.depth.setMask(!0),gt.buffers.color.setMask(!0),gt.setPolygonOffset(!1)}function rr(b,E,R,L){if((R.isScene===!0?R.overrideMaterial:null)!==null)return;const H=kt.isWebGL2;bt===null&&(bt=new Vn(1,1,{generateMipmaps:!0,type:Lt.has("EXT_color_buffer_half_float")?Yi:An,minFilter:Ki,samples:H?4:0})),v.getDrawingBufferSize(O),H?bt.setSize(O.x,O.y):bt.setSize(Na(O.x),Na(O.y));const V=v.getRenderTarget();v.setRenderTarget(bt),v.getClearColor(z),P=v.getClearAlpha(),P<1&&v.setClearColor(16777215,.5),v.clear();const W=v.toneMapping;v.toneMapping=Si,is(b,R,L),I.updateMultisampleRenderTarget(bt),I.updateRenderTargetMipmap(bt);let et=!1;for(let dt=0,ft=E.length;dt<ft;dt++){const Mt=E[dt],Ot=Mt.object,Kt=Mt.geometry,Qt=Mt.material,re=Mt.group;if(Qt.side===fn&&Ot.layers.test(L.layers)){const Bt=Qt.side;Qt.side=an,Qt.needsUpdate=!0,Ks(Ot,R,L,Kt,Qt,re),Qt.side=Bt,Qt.needsUpdate=!0,et=!0}}et===!0&&(I.updateMultisampleRenderTarget(bt),I.updateRenderTargetMipmap(bt)),v.setRenderTarget(V),v.setClearColor(z,P),v.toneMapping=W}function is(b,E,R){const L=E.isScene===!0?E.overrideMaterial:null;for(let U=0,H=b.length;U<H;U++){const V=b[U],W=V.object,et=V.geometry,dt=L===null?V.material:L,ft=V.group;W.layers.test(R.layers)&&Ks(W,E,R,et,dt,ft)}}function Ks(b,E,R,L,U,H){b.onBeforeRender(v,E,R,L,U,H),b.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),U.onBeforeRender(v,E,R,L,b,H),U.transparent===!0&&U.side===fn&&U.forceSinglePass===!1?(U.side=an,U.needsUpdate=!0,v.renderBufferDirect(R,E,L,U,b,H),U.side=Ai,U.needsUpdate=!0,v.renderBufferDirect(R,E,L,U,b,H),U.side=fn):v.renderBufferDirect(R,E,L,U,b,H),b.onAfterRender(v,E,R,L,U,H)}function ki(b,E,R){E.isScene!==!0&&(E=wt);const L=It.get(b),U=m.state.lights,H=m.state.shadowsArray,V=U.state.version,W=Q.getParameters(b,U.state,H,E,R),et=Q.getProgramCacheKey(W);let dt=L.programs;L.environment=b.isMeshStandardMaterial?E.environment:null,L.fog=E.fog,L.envMap=(b.isMeshStandardMaterial?q:D).get(b.envMap||L.environment),dt===void 0&&(b.addEventListener("dispose",Tt),dt=new Map,L.programs=dt);let ft=dt.get(et);if(ft!==void 0){if(L.currentProgram===ft&&L.lightsStateVersion===V)return Zs(b,W),ft}else W.uniforms=Q.getUniforms(b),b.onBuild(R,W,v),b.onBeforeCompile(W,v),ft=Q.acquireProgram(W,et),dt.set(et,ft),L.uniforms=W.uniforms;const Mt=L.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Mt.clippingPlanes=mt.uniform),Zs(b,W),L.needsLights=Go(b),L.lightsStateVersion=V,L.needsLights&&(Mt.ambientLightColor.value=U.state.ambient,Mt.lightProbe.value=U.state.probe,Mt.directionalLights.value=U.state.directional,Mt.directionalLightShadows.value=U.state.directionalShadow,Mt.spotLights.value=U.state.spot,Mt.spotLightShadows.value=U.state.spotShadow,Mt.rectAreaLights.value=U.state.rectArea,Mt.ltc_1.value=U.state.rectAreaLTC1,Mt.ltc_2.value=U.state.rectAreaLTC2,Mt.pointLights.value=U.state.point,Mt.pointLightShadows.value=U.state.pointShadow,Mt.hemisphereLights.value=U.state.hemi,Mt.directionalShadowMap.value=U.state.directionalShadowMap,Mt.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Mt.spotShadowMap.value=U.state.spotShadowMap,Mt.spotLightMatrix.value=U.state.spotLightMatrix,Mt.spotLightMap.value=U.state.spotLightMap,Mt.pointShadowMap.value=U.state.pointShadowMap,Mt.pointShadowMatrix.value=U.state.pointShadowMatrix),L.currentProgram=ft,L.uniformsList=null,ft}function Ys(b){if(b.uniformsList===null){const E=b.currentProgram.getUniforms();b.uniformsList=Ea.seqWithValue(E.seq,b.uniforms)}return b.uniformsList}function Zs(b,E){const R=It.get(b);R.outputColorSpace=E.outputColorSpace,R.batching=E.batching,R.instancing=E.instancing,R.instancingColor=E.instancingColor,R.skinning=E.skinning,R.morphTargets=E.morphTargets,R.morphNormals=E.morphNormals,R.morphColors=E.morphColors,R.morphTargetsCount=E.morphTargetsCount,R.numClippingPlanes=E.numClippingPlanes,R.numIntersection=E.numClipIntersection,R.vertexAlphas=E.vertexAlphas,R.vertexTangents=E.vertexTangents,R.toneMapping=E.toneMapping}function Bo(b,E,R,L,U){E.isScene!==!0&&(E=wt),I.resetTextureUnits();const H=E.fog,V=L.isMeshStandardMaterial?E.environment:null,W=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:si,et=(L.isMeshStandardMaterial?q:D).get(L.envMap||V),dt=L.vertexColors===!0&&!!R.attributes.color&&R.attributes.color.itemSize===4,ft=!!R.attributes.tangent&&(!!L.normalMap||L.anisotropy>0),Mt=!!R.morphAttributes.position,Ot=!!R.morphAttributes.normal,Kt=!!R.morphAttributes.color;let Qt=Si;L.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Qt=v.toneMapping);const re=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,Bt=re!==void 0?re.length:0,Ct=It.get(L),fe=m.state.lights;if(lt===!0&&(_t===!0||b!==_)){const wn=b===_&&L.id===k;mt.setState(L,b,wn)}let Yt=!1;L.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==fe.state.version||Ct.outputColorSpace!==W||U.isBatchedMesh&&Ct.batching===!1||!U.isBatchedMesh&&Ct.batching===!0||U.isInstancedMesh&&Ct.instancing===!1||!U.isInstancedMesh&&Ct.instancing===!0||U.isSkinnedMesh&&Ct.skinning===!1||!U.isSkinnedMesh&&Ct.skinning===!0||U.isInstancedMesh&&Ct.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ct.instancingColor===!1&&U.instanceColor!==null||Ct.envMap!==et||L.fog===!0&&Ct.fog!==H||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==mt.numPlanes||Ct.numIntersection!==mt.numIntersection)||Ct.vertexAlphas!==dt||Ct.vertexTangents!==ft||Ct.morphTargets!==Mt||Ct.morphNormals!==Ot||Ct.morphColors!==Kt||Ct.toneMapping!==Qt||kt.isWebGL2===!0&&Ct.morphTargetsCount!==Bt)&&(Yt=!0):(Yt=!0,Ct.__version=L.version);let Ee=Ct.currentProgram;Yt===!0&&(Ee=ki(L,E,U));let He=!1,Ie=!1,Cn=!1;const ce=Ee.getUniforms(),gn=Ct.uniforms;if(gt.useProgram(Ee.program)&&(He=!0,Ie=!0,Cn=!0),L.id!==k&&(k=L.id,Ie=!0),He||_!==b){ce.setValue(G,"projectionMatrix",b.projectionMatrix),ce.setValue(G,"viewMatrix",b.matrixWorldInverse);const wn=ce.map.cameraPosition;wn!==void 0&&wn.setValue(G,Wt.setFromMatrixPosition(b.matrixWorld)),kt.logarithmicDepthBuffer&&ce.setValue(G,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(L.isMeshPhongMaterial||L.isMeshToonMaterial||L.isMeshLambertMaterial||L.isMeshBasicMaterial||L.isMeshStandardMaterial||L.isShaderMaterial)&&ce.setValue(G,"isOrthographic",b.isOrthographicCamera===!0),_!==b&&(_=b,Ie=!0,Cn=!0)}if(U.isSkinnedMesh){ce.setOptional(G,U,"bindMatrix"),ce.setOptional(G,U,"bindMatrixInverse");const wn=U.skeleton;wn&&(kt.floatVertexTextures?(wn.boneTexture===null&&wn.computeBoneTexture(),ce.setValue(G,"boneTexture",wn.boneTexture,I)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}U.isBatchedMesh&&(ce.setOptional(G,U,"batchingTexture"),ce.setValue(G,"batchingTexture",U._matricesTexture,I));const lr=R.morphAttributes;if((lr.position!==void 0||lr.normal!==void 0||lr.color!==void 0&&kt.isWebGL2===!0)&&St.update(U,R,Ee),(Ie||Ct.receiveShadow!==U.receiveShadow)&&(Ct.receiveShadow=U.receiveShadow,ce.setValue(G,"receiveShadow",U.receiveShadow)),L.isMeshGouraudMaterial&&L.envMap!==null&&(gn.envMap.value=et,gn.flipEnvMap.value=et.isCubeTexture&&et.isRenderTargetTexture===!1?-1:1),Ie&&(ce.setValue(G,"toneMappingExposure",v.toneMappingExposure),Ct.needsLights&&Ho(gn,Cn),H&&L.fog===!0&&it.refreshFogUniforms(gn,H),it.refreshMaterialUniforms(gn,L,J,X,bt),Ea.upload(G,Ys(Ct),gn,I)),L.isShaderMaterial&&L.uniformsNeedUpdate===!0&&(Ea.upload(G,Ys(Ct),gn,I),L.uniformsNeedUpdate=!1),L.isSpriteMaterial&&ce.setValue(G,"center",U.center),ce.setValue(G,"modelViewMatrix",U.modelViewMatrix),ce.setValue(G,"normalMatrix",U.normalMatrix),ce.setValue(G,"modelMatrix",U.matrixWorld),L.isShaderMaterial||L.isRawShaderMaterial){const wn=L.uniformsGroups;for(let cr=0,Mf=wn.length;cr<Mf;cr++)if(kt.isWebGL2){const ic=wn[cr];Jt.update(ic,Ee),Jt.bind(ic,Ee)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ee}function Ho(b,E){b.ambientLightColor.needsUpdate=E,b.lightProbe.needsUpdate=E,b.directionalLights.needsUpdate=E,b.directionalLightShadows.needsUpdate=E,b.pointLights.needsUpdate=E,b.pointLightShadows.needsUpdate=E,b.spotLights.needsUpdate=E,b.spotLightShadows.needsUpdate=E,b.rectAreaLights.needsUpdate=E,b.hemisphereLights.needsUpdate=E}function Go(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(b,E,R){It.get(b.texture).__webglTexture=E,It.get(b.depthTexture).__webglTexture=R;const L=It.get(b);L.__hasExternalTextures=!0,L.__hasExternalTextures&&(L.__autoAllocateDepthBuffer=R===void 0,L.__autoAllocateDepthBuffer||Lt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),L.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,E){const R=It.get(b);R.__webglFramebuffer=E,R.__useDefaultFramebuffer=E===void 0},this.setRenderTarget=function(b,E=0,R=0){A=b,S=E,T=R;let L=!0,U=null,H=!1,V=!1;if(b){const et=It.get(b);et.__useDefaultFramebuffer!==void 0?(gt.bindFramebuffer(G.FRAMEBUFFER,null),L=!1):et.__webglFramebuffer===void 0?I.setupRenderTarget(b):et.__hasExternalTextures&&I.rebindTextures(b,It.get(b.texture).__webglTexture,It.get(b.depthTexture).__webglTexture);const dt=b.texture;(dt.isData3DTexture||dt.isDataArrayTexture||dt.isCompressedArrayTexture)&&(V=!0);const ft=It.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ft[E])?U=ft[E][R]:U=ft[E],H=!0):kt.isWebGL2&&b.samples>0&&I.useMultisampledRTT(b)===!1?U=It.get(b).__webglMultisampledFramebuffer:Array.isArray(ft)?U=ft[R]:U=ft,w.copy(b.viewport),C.copy(b.scissor),F=b.scissorTest}else w.copy(st).multiplyScalar(J).floor(),C.copy(tt).multiplyScalar(J).floor(),F=N;if(gt.bindFramebuffer(G.FRAMEBUFFER,U)&&kt.drawBuffers&&L&&gt.drawBuffers(b,U),gt.viewport(w),gt.scissor(C),gt.setScissorTest(F),H){const et=It.get(b.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+E,et.__webglTexture,R)}else if(V){const et=It.get(b.texture),dt=E||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,et.__webglTexture,R||0,dt)}k=-1},this.readRenderTargetPixels=function(b,E,R,L,U,H,V){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let W=It.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&V!==void 0&&(W=W[V]),W){gt.bindFramebuffer(G.FRAMEBUFFER,W);try{const et=b.texture,dt=et.format,ft=et.type;if(dt!==Mn&&Et.convert(dt)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Mt=ft===Yi&&(Lt.has("EXT_color_buffer_half_float")||kt.isWebGL2&&Lt.has("EXT_color_buffer_float"));if(ft!==An&&Et.convert(ft)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_TYPE)&&!(ft===ti&&(kt.isWebGL2||Lt.has("OES_texture_float")||Lt.has("WEBGL_color_buffer_float")))&&!Mt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}E>=0&&E<=b.width-L&&R>=0&&R<=b.height-U&&G.readPixels(E,R,L,U,Et.convert(dt),Et.convert(ft),H)}finally{const et=A!==null?It.get(A).__webglFramebuffer:null;gt.bindFramebuffer(G.FRAMEBUFFER,et)}}},this.copyFramebufferToTexture=function(b,E,R=0){const L=Math.pow(2,-R),U=Math.floor(E.image.width*L),H=Math.floor(E.image.height*L);I.setTexture2D(E,0),G.copyTexSubImage2D(G.TEXTURE_2D,R,0,0,b.x,b.y,U,H),gt.unbindTexture()},this.copyTextureToTexture=function(b,E,R,L=0){const U=E.image.width,H=E.image.height,V=Et.convert(R.format),W=Et.convert(R.type);I.setTexture2D(R,0),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,R.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,R.unpackAlignment),E.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,L,b.x,b.y,U,H,V,W,E.image.data):E.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,L,b.x,b.y,E.mipmaps[0].width,E.mipmaps[0].height,V,E.mipmaps[0].data):G.texSubImage2D(G.TEXTURE_2D,L,b.x,b.y,V,W,E.image),L===0&&R.generateMipmaps&&G.generateMipmap(G.TEXTURE_2D),gt.unbindTexture()},this.copyTextureToTexture3D=function(b,E,R,L,U=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const H=b.max.x-b.min.x+1,V=b.max.y-b.min.y+1,W=b.max.z-b.min.z+1,et=Et.convert(L.format),dt=Et.convert(L.type);let ft;if(L.isData3DTexture)I.setTexture3D(L,0),ft=G.TEXTURE_3D;else if(L.isDataArrayTexture||L.isCompressedArrayTexture)I.setTexture2DArray(L,0),ft=G.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,L.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,L.unpackAlignment);const Mt=G.getParameter(G.UNPACK_ROW_LENGTH),Ot=G.getParameter(G.UNPACK_IMAGE_HEIGHT),Kt=G.getParameter(G.UNPACK_SKIP_PIXELS),Qt=G.getParameter(G.UNPACK_SKIP_ROWS),re=G.getParameter(G.UNPACK_SKIP_IMAGES),Bt=R.isCompressedTexture?R.mipmaps[U]:R.image;G.pixelStorei(G.UNPACK_ROW_LENGTH,Bt.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Bt.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,b.min.x),G.pixelStorei(G.UNPACK_SKIP_ROWS,b.min.y),G.pixelStorei(G.UNPACK_SKIP_IMAGES,b.min.z),R.isDataTexture||R.isData3DTexture?G.texSubImage3D(ft,U,E.x,E.y,E.z,H,V,W,et,dt,Bt.data):R.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),G.compressedTexSubImage3D(ft,U,E.x,E.y,E.z,H,V,W,et,Bt.data)):G.texSubImage3D(ft,U,E.x,E.y,E.z,H,V,W,et,dt,Bt),G.pixelStorei(G.UNPACK_ROW_LENGTH,Mt),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Ot),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Kt),G.pixelStorei(G.UNPACK_SKIP_ROWS,Qt),G.pixelStorei(G.UNPACK_SKIP_IMAGES,re),U===0&&L.generateMipmaps&&G.generateMipmap(ft),gt.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?I.setTextureCube(b,0):b.isData3DTexture?I.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?I.setTexture2DArray(b,0):I.setTexture2D(b,0),gt.unbindTexture()},this.resetState=function(){S=0,T=0,A=null,gt.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ol?"display-p3":"srgb",e.unpackColorSpace=de.workingColorSpace===Ka?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Fe?Vi:ed}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Vi?Fe:si}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class r1 extends Md{}r1.prototype.isWebGL1Renderer=!0;class Uo extends mn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class jl extends rn{constructor(t=null,e=1,i=1,s,o,r,a,l,c=Le,h=Le,u,f){super(null,r,a,l,c,h,s,o,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ae extends ke{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ms=new pe,Rh=new pe,ua=[],Lh=new Li,l1=new pe,no=new ge,io=new ai;class c1 extends ge{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ae(new Float32Array(i*16),16),this.instanceColor=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,l1)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Li),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ms),Lh.copy(t.boundingBox).applyMatrix4(Ms),this.boundingBox.union(Lh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ai),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ms),io.copy(t.boundingSphere).applyMatrix4(Ms),this.boundingSphere.union(io)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const i=this.matrixWorld,s=this.count;if(no.geometry=this.geometry,no.material=this.material,no.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),io.copy(this.boundingSphere),io.applyMatrix4(i),t.ray.intersectsSphere(io)!==!1))for(let o=0;o<s;o++){this.getMatrixAt(o,Ms),Rh.multiplyMatrices(i,Ms),no.matrixWorld=Rh,no.raycast(t,ua);for(let r=0,a=ua.length;r<a;r++){const l=ua[r];l.instanceId=o,l.object=this,e.push(l)}ua.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ae(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class h1 extends Do{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Zt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const kh=new pe,xl=new Hl,da=new ai,fa=new j;class u1 extends mn{constructor(t=new Oe,e=new h1){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,o=t.params.Points.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),da.copy(i.boundingSphere),da.applyMatrix4(s),da.radius+=o,t.ray.intersectsSphere(da)===!1)return;kh.copy(s).invert(),xl.copy(t.ray).applyMatrix4(kh);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,u=i.attributes.position;if(c!==null){const f=Math.max(0,r.start),d=Math.min(c.count,r.start+r.count);for(let g=f,x=d;g<x;g++){const m=c.getX(g);fa.fromBufferAttribute(u,m),Ph(fa,m,l,s,t,e,this)}}else{const f=Math.max(0,r.start),d=Math.min(u.count,r.start+r.count);for(let g=f,x=d;g<x;g++)fa.fromBufferAttribute(u,g),Ph(fa,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function Ph(n,t,e,i,s,o,r){const a=xl.distanceSqToPoint(n);if(a<e){const l=new j;xl.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;o.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:r})}}class _d extends rn{constructor(t,e,i,s,o,r,a,l,c){super(t,e,i,s,o,r,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Xl extends Oe{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const o=[],r=[];a(s),c(i),h(),this.setAttribute("position",new we(o,3)),this.setAttribute("normal",new we(o.slice(),3)),this.setAttribute("uv",new we(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){const v=new j,M=new j,S=new j;for(let T=0;T<e.length;T+=3)d(e[T+0],v),d(e[T+1],M),d(e[T+2],S),l(v,M,S,y)}function l(y,v,M,S){const T=S+1,A=[];for(let k=0;k<=T;k++){A[k]=[];const _=y.clone().lerp(M,k/T),w=v.clone().lerp(M,k/T),C=T-k;for(let F=0;F<=C;F++)F===0&&k===T?A[k][F]=_:A[k][F]=_.clone().lerp(w,F/C)}for(let k=0;k<T;k++)for(let _=0;_<2*(T-k)-1;_++){const w=Math.floor(_/2);_%2===0?(f(A[k][w+1]),f(A[k+1][w]),f(A[k][w])):(f(A[k][w+1]),f(A[k+1][w+1]),f(A[k+1][w]))}}function c(y){const v=new j;for(let M=0;M<o.length;M+=3)v.x=o[M+0],v.y=o[M+1],v.z=o[M+2],v.normalize().multiplyScalar(y),o[M+0]=v.x,o[M+1]=v.y,o[M+2]=v.z}function h(){const y=new j;for(let v=0;v<o.length;v+=3){y.x=o[v+0],y.y=o[v+1],y.z=o[v+2];const M=m(y)/2/Math.PI+.5,S=p(y)/Math.PI+.5;r.push(M,1-S)}g(),u()}function u(){for(let y=0;y<r.length;y+=6){const v=r[y+0],M=r[y+2],S=r[y+4],T=Math.max(v,M,S),A=Math.min(v,M,S);T>.9&&A<.1&&(v<.2&&(r[y+0]+=1),M<.2&&(r[y+2]+=1),S<.2&&(r[y+4]+=1))}}function f(y){o.push(y.x,y.y,y.z)}function d(y,v){const M=y*3;v.x=t[M+0],v.y=t[M+1],v.z=t[M+2]}function g(){const y=new j,v=new j,M=new j,S=new j,T=new qt,A=new qt,k=new qt;for(let _=0,w=0;_<o.length;_+=9,w+=6){y.set(o[_+0],o[_+1],o[_+2]),v.set(o[_+3],o[_+4],o[_+5]),M.set(o[_+6],o[_+7],o[_+8]),T.set(r[w+0],r[w+1]),A.set(r[w+2],r[w+3]),k.set(r[w+4],r[w+5]),S.copy(y).add(v).add(M).divideScalar(3);const C=m(S);x(T,w+0,y,C),x(A,w+2,v,C),x(k,w+4,M,C)}}function x(y,v,M,S){S<0&&y.x===1&&(r[v]=y.x-1),M.x===0&&M.z===0&&(r[v]=S/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xl(t.vertices,t.indices,t.radius,t.details)}}const d1={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let o=bd(n,0,s,e,!0);const r=[];if(!o||o.next===o.prev)return r;let a,l,c,h,u,f,d;if(i&&(o=v1(n,t,o,e)),n.length>80*e){a=c=n[0],l=h=n[1];for(let g=e;g<s;g+=e)u=n[g],f=n[g+1],u<a&&(a=u),f<l&&(l=f),u>c&&(c=u),f>h&&(h=f);d=Math.max(c-a,h-l),d=d!==0?32767/d:0}return Ao(o,r,e,a,l,d,0),r}};function bd(n,t,e,i,s){let o,r;if(s===C1(n,t,e,i)>0)for(o=t;o<e;o+=i)r=zh(o,n[o],n[o+1],r);else for(o=e-i;o>=t;o-=i)r=zh(o,n[o],n[o+1],r);return r&&Qa(r,r.next)&&(Ro(r),r=r.next),r}function Zi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Qa(e,e.next)||Me(e.prev,e,e.next)===0)){if(Ro(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Ao(n,t,e,i,s,o,r){if(!n)return;!r&&o&&b1(n,i,s,o);let a=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,o?p1(n,i,s,o):f1(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),Ro(n),n=c.next,a=c.next;continue}if(n=c,n===a){r?r===1?(n=m1(Zi(n),t,e),Ao(n,t,e,i,s,o,2)):r===2&&g1(n,t,e,i,s,o):Ao(Zi(n),t,e,i,s,o,1);break}}}function f1(n){const t=n.prev,e=n,i=n.next;if(Me(t,e,i)>=0)return!1;const s=t.x,o=e.x,r=i.x,a=t.y,l=e.y,c=i.y,h=s<o?s<r?s:r:o<r?o:r,u=a<l?a<c?a:c:l<c?l:c,f=s>o?s>r?s:r:o>r?o:r,d=a>l?a>c?a:c:l>c?l:c;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&As(s,a,o,l,r,c,g.x,g.y)&&Me(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function p1(n,t,e,i){const s=n.prev,o=n,r=n.next;if(Me(s,o,r)>=0)return!1;const a=s.x,l=o.x,c=r.x,h=s.y,u=o.y,f=r.y,d=a<l?a<c?a:c:l<c?l:c,g=h<u?h<f?h:f:u<f?u:f,x=a>l?a>c?a:c:l>c?l:c,m=h>u?h>f?h:f:u>f?u:f,p=yl(d,g,t,e,i),y=yl(x,m,t,e,i);let v=n.prevZ,M=n.nextZ;for(;v&&v.z>=p&&M&&M.z<=y;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==r&&As(a,h,l,u,c,f,v.x,v.y)&&Me(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=d&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==r&&As(a,h,l,u,c,f,M.x,M.y)&&Me(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=p;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==r&&As(a,h,l,u,c,f,v.x,v.y)&&Me(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=y;){if(M.x>=d&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==r&&As(a,h,l,u,c,f,M.x,M.y)&&Me(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function m1(n,t,e){let i=n;do{const s=i.prev,o=i.next.next;!Qa(s,o)&&wd(s,i,i.next,o)&&Co(s,o)&&Co(o,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(o.i/e|0),Ro(i),Ro(i.next),i=n=o),i=i.next}while(i!==n);return Zi(i)}function g1(n,t,e,i,s,o){let r=n;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&E1(r,a)){let l=Sd(r,a);r=Zi(r,r.next),l=Zi(l,l.next),Ao(r,t,e,i,s,o,0),Ao(l,t,e,i,s,o,0);return}a=a.next}r=r.next}while(r!==n)}function v1(n,t,e,i){const s=[];let o,r,a,l,c;for(o=0,r=t.length;o<r;o++)a=t[o]*i,l=o<r-1?t[o+1]*i:n.length,c=bd(n,a,l,i,!1),c===c.next&&(c.steiner=!0),s.push(S1(c));for(s.sort(x1),o=0;o<s.length;o++)e=y1(s[o],e);return e}function x1(n,t){return n.x-t.x}function y1(n,t){const e=M1(n,t);if(!e)return t;const i=Sd(e,n);return Zi(i,i.next),Zi(e,e.next)}function M1(n,t){let e=t,i=-1/0,s;const o=n.x,r=n.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const f=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=o&&f>i&&(i=f,s=e.x<e.next.x?e:e.next,f===o))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,l=s.x,c=s.y;let h=1/0,u;e=s;do o>=e.x&&e.x>=l&&o!==e.x&&As(r<c?o:i,r,l,c,r<c?i:o,r,e.x,e.y)&&(u=Math.abs(r-e.y)/(o-e.x),Co(e,n)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&_1(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function _1(n,t){return Me(n.prev,n,t.prev)<0&&Me(t.next,n,n.next)<0}function b1(n,t,e,i){let s=n;do s.z===0&&(s.z=yl(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,w1(s)}function w1(n){let t,e,i,s,o,r,a,l,c=1;do{for(e=n,n=null,o=null,r=0;e;){for(r++,i=e,a=0,t=0;t<c&&(a++,i=i.nextZ,!!i);t++);for(l=c;a>0||l>0&&i;)a!==0&&(l===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,a--):(s=i,i=i.nextZ,l--),o?o.nextZ=s:n=s,s.prevZ=o,o=s;e=i}o.nextZ=null,c*=2}while(r>1);return n}function yl(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function S1(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function As(n,t,e,i,s,o,r,a){return(s-r)*(t-a)>=(n-r)*(o-a)&&(n-r)*(i-a)>=(e-r)*(t-a)&&(e-r)*(o-a)>=(s-r)*(i-a)}function E1(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!T1(n,t)&&(Co(n,t)&&Co(t,n)&&A1(n,t)&&(Me(n.prev,n,t.prev)||Me(n,t.prev,t))||Qa(n,t)&&Me(n.prev,n,n.next)>0&&Me(t.prev,t,t.next)>0)}function Me(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Qa(n,t){return n.x===t.x&&n.y===t.y}function wd(n,t,e,i){const s=ma(Me(n,t,e)),o=ma(Me(n,t,i)),r=ma(Me(e,i,n)),a=ma(Me(e,i,t));return!!(s!==o&&r!==a||s===0&&pa(n,e,t)||o===0&&pa(n,i,t)||r===0&&pa(e,n,i)||a===0&&pa(e,t,i))}function pa(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function ma(n){return n>0?1:n<0?-1:0}function T1(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&wd(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Co(n,t){return Me(n.prev,n,n.next)<0?Me(n,t,n.next)>=0&&Me(n,n.prev,t)>=0:Me(n,t,n.prev)<0||Me(n,n.next,t)<0}function A1(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,o=(n.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Sd(n,t){const e=new Ml(n.i,n.x,n.y),i=new Ml(t.i,t.x,t.y),s=n.next,o=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,o.next=i,i.prev=o,i}function zh(n,t,e,i){const s=new Ml(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ro(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ml(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function C1(n,t,e,i){let s=0;for(let o=t,r=e-i;o<e;o+=i)s+=(n[r]-n[o])*(n[o+1]+n[r+1]),r=o;return s}class ql{static area(t){const e=t.length;let i=0;for(let s=e-1,o=0;o<e;s=o++)i+=t[s].x*t[o].y-t[o].x*t[s].y;return i*.5}static isClockWise(t){return ql.area(t)<0}static triangulateShape(t,e){const i=[],s=[],o=[];Dh(t),Ih(i,t);let r=t.length;e.forEach(Dh);for(let l=0;l<e.length;l++)s.push(r),r+=e[l].length,Ih(i,e[l]);const a=d1.triangulate(i,s);for(let l=0;l<a.length;l+=3)o.push(a.slice(l,l+3));return o}}function Dh(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Ih(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Kl extends Xl{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Kl(t.radius,t.detail)}}class es extends Oe{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Ed{constructor(t,e,i=0,s=1/0){this.ray=new Hl(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Gl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,i=[]){return _l(t,this,i,e),i.sort(Uh),i}intersectObjects(t,e=!0,i=[]){for(let s=0,o=t.length;s<o;s++)_l(t[s],this,i,e);return i.sort(Uh),i}}function Uh(n,t){return n.distance-t.distance}function _l(n,t,e,i){if(n.layers.test(t.layers)&&n.raycast(t,e),i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)_l(s[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ul}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ul);const bl=864e5,R1=36e5,Gs=6e4,Ni=["January","February","March","April","May","June","July","August","September","October","November","December"],L1=/^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?(Z|[+-]\d{2}:\d{2})?)?)?)?$/,k1=/^(\d{1,2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?$/;function $s(n){if(n==="Z")return 0;const t=/^([+-])(\d{2}):(\d{2})$/.exec(String(n));if(!t||+t[2]>14||+t[3]>59)throw new Error(`zone “${n}”: write it as an ISO offset, e.g. -12:00 for the navy's zone +12`);return(t[1]==="-"?-1:1)*(Number(t[2])*60+Number(t[3]))}function Td(n){const t=L1.exec(String(n));if(!t)throw new Error(`“${n}” is not an ISO date (YYYY, YYYY-MM, YYYY-MM-DD) or instant (YYYY-MM-DDTHH:MM[:SS]±HH:MM)`);const[,e,i,s,o,r,a,l]=t;if(o!==void 0&&l===void 0)throw new Error(`“${n}” has a time but no offset: write the zone (Z or ±HH:MM)`);const c=+e,h=i===void 0?1:+i,u=s===void 0?1:+s;if(h<1||h>12)throw new Error(`“${n}”: month ${h}`);const f=new Date(Date.UTC(c,h,0)).getUTCDate();if(u<1||u>f)throw new Error(`“${n}”: day ${u}`);if(o!==void 0&&(+o>23||+r>59||a!==void 0&&+a>=60))throw new Error(`“${n}”: time out of range`);const d=o!==void 0?"minute":s!==void 0?"day":i!==void 0?"month":"year";return{y:c,mo:h,d:u,h:o===void 0?0:+o,mi:r===void 0?0:+r,se:a===void 0?0:+a,z:l,res:d}}function Ve(n,{zone:t=null}={}){const e=Td(n),i=e.z!==void 0?$s(e.z):t?$s(t):0;return Date.UTC(e.y,e.mo-1,e.d,e.h,e.mi,0)+Math.round(e.se*1e3)-i*Gs}function Ad(n){return Td(n).res}const Ls=["minute","hour","day","month","year"];function ks(n,t){const e=new Date(n+$s(t??"Z")*Gs);return{y:e.getUTCFullYear(),mo:e.getUTCMonth(),d:e.getUTCDate(),h:e.getUTCHours(),mi:e.getUTCMinutes(),se:e.getUTCSeconds()}}function Fh(n,t,e){const i=$s(e??"Z")*Gs,s=ks(n,e);let o,r;return t==="minute"?(o=Date.UTC(s.y,s.mo,s.d,s.h,s.mi)-i,r=o+Gs):t==="hour"?(o=Date.UTC(s.y,s.mo,s.d,s.h)-i,r=o+R1):t==="day"?(o=Date.UTC(s.y,s.mo,s.d)-i,r=o+bl):t==="month"?(o=Date.UTC(s.y,s.mo,1)-i,r=Date.UTC(s.y,s.mo+1,1)-i):(o=Date.UTC(s.y,0,1)-i,r=Date.UTC(s.y+1,0,1)-i),[o,r]}function tr(n){if(!(n!=null&&n.from))throw new Error("a when needs a from");const t=n.zone??null,e=r=>{const a=Ad(r),l=Ls.includes(n.precision)?n.precision:a;return Ls.indexOf(l)>Ls.indexOf(a)?l:a},i=Fh(Ve(n.from,{zone:t}),e(n.from),t)[0],s=n.to??n.from,o=Fh(Ve(s,{zone:t}),e(s),t)[1];return[i,Math.max(o,i+Gs)]}function Cd(n){const t=$s(n??"Z");if(!t)return"UTC";const e=Math.abs(t);return`UTC${t<0?"−":"+"}${Math.floor(e/60)}${e%60?`:${String(e%60).padStart(2,"0")}`:""}`}const Jn=n=>String(n).padStart(2,"0"),Ta=n=>`${n.d} ${Ni[n.mo]} ${n.y}`;function Rd(n,{zone:t,name:e}={}){typeof n=="number"&&(n={at:n,precision:"minute"});const i=t??n.zone??"Z",s=x=>{const m=Ad(x),p=Ls.includes(n.precision)?n.precision:m;return Ls.indexOf(p)>Ls.indexOf(m)?p:m},o=n.at??Ve(n.from,{zone:i}),r=n.at!==void 0?n.precision||"minute":s(n.from),a=n.to&&n.to!==n.from,l=a?Ve(n.to,{zone:i}):null,c=a?s(n.to):null,h=ks(o,i),u=x=>x==="minute"||x==="hour",f=u(r)||a&&u(c)?` (${e||Cd(i)})`:"",d=(x,m)=>m==="year"?String(x.y):m==="month"?`${Ni[x.mo]} ${x.y}`:m==="day"?Ta(x):`${Ta(x)}, ${Jn(x.h)}:${Jn(m==="hour"?0:x.mi)}`;if(!a)return d(h,r)+f;const g=ks(l,i);if(u(r)&&u(c)&&h.y===g.y&&h.mo===g.mo&&h.d===g.d)return`${Ta(h)}, ${Jn(h.h)}:${Jn(h.mi)}–${Jn(g.h)}:${Jn(g.mi)}${f}`;if(r==="day"&&c==="day"){if(h.y===g.y&&h.mo===g.mo)return`${h.d}–${g.d} ${Ni[h.mo]} ${h.y}`;if(h.y===g.y)return`${h.d} ${Ni[h.mo]} – ${g.d} ${Ni[g.mo]} ${h.y}`}return r==="month"&&c==="month"&&h.y===g.y?`${Ni[h.mo]} – ${Ni[g.mo]} ${h.y}`:`${d(h,r)} – ${d(g,c)}${f}`}class P1{constructor(t,{prologueShare:e=.1,keyframes:i=null,windowMinDays:s=7,windowMaxDays:o=21}={}){if(!(t!=null&&t.length))throw new Error("WarClock needs chapters");this.chapters=t.map(h=>({...h,fromMs:Ve(h.from),toMs:Ve(h.to)})).sort((h,u)=>h.fromMs-u.fromMs);const r=this.chapters,a=r[0],l=r[r.length-1];this.prologue=a.id==="prologue"&&r.length>1?a:null,this.knots=this.prologue?[[0,a.fromMs],[e,a.toMs],[1,l.toMs]]:[[0,a.fromMs],[1,l.toMs]],this.windowMin=s*bl,this.windowMax=o*bl;const c=i||[...new Set(r.map(h=>h.keyframe).filter(Boolean))].map(h=>({id:h,date:h}));this.keyframes=c.map(h=>({...h,ms:Ve(h.date??h.id)})).sort((h,u)=>h.ms-u.ms),this.s=0,this.listeners=[]}get start(){return this.knots[0][1]}get end(){return this.knots[this.knots.length-1][1]}dateAt(t){const e=this.knots,i=Math.max(0,Math.min(1,t));for(let s=0;s+1<e.length;s++){const[o,r]=e[s],[a,l]=e[s+1];if(i<=a||s+2===e.length)return r+(i-o)/Math.max(1e-12,a-o)*(l-r)}return e[e.length-1][1]}sAt(t){const e=this.knots;if(t<=e[0][1])return 0;for(let i=0;i+1<e.length;i++){const[s,o]=e[i],[r,a]=e[i+1];if(t<=a)return s+(t-o)/Math.max(1,a-o)*(r-s)}return 1}get date(){return this.dateAt(this.s)}setS(t){const e=Math.max(0,Math.min(1,t));if(e!==this.s){this.s=e;for(const i of this.listeners)i(this)}}setDate(t){this.setS(this.sAt(t))}onChange(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(e=>e!==t)}}chapterAt(t=this.date){const e=this.chapters;for(const i of e)if(t>=i.fromMs&&t<i.toMs)return i;return t<e[0].fromMs?e[0]:e[e.length-1]}windowAt(t=this.date){const e=this.chapterAt(t);if(e===this.prologue)return[e.fromMs,e.toMs];const i=Math.min(this.windowMax,Math.max(this.windowMin,(e.toMs-e.fromMs)/8));return[t-i,t+i]}frontPair(t=this.date){const e=this.keyframes;if(!e.length)return{a:null,b:null,t:0};if(t<=e[0].ms)return{a:e[0],b:e[0],t:0};for(let s=0;s+1<e.length;s++)if(t<e[s+1].ms)return{a:e[s],b:e[s+1],t:(t-e[s].ms)/(e[s+1].ms-e[s].ms)};const i=e[e.length-1];return{a:i,b:i,t:0}}}class Ld{constructor({zone:t,from:e,to:i}){if(this.zone=t,this.off=$s(t)*Gs,this.fromMs=Ve(e,{zone:t}),this.toMs=Ve(i,{zone:t}),!(this.toMs>this.fromMs))throw new Error(`clock: to (${i}) is not after from (${e})`);const s=ks(this.fromMs,t);this.day0=Date.UTC(s.y,s.mo,s.d)-this.off,this.t=0}get duration(){return(this.toMs-this.fromMs)/1e3}parse(t){if(typeof t=="number")return t;const e=k1.exec(String(t).trim());if(e){const[,i,s,o="0"]=e;if(+s>59||+o>=60)throw new Error(`battle time “${t}” out of range`);return(this.day0+((+i*60+ +s)*60+ +o)*1e3-this.fromMs)/1e3}return(Ve(t,{zone:this.zone})-this.fromMs)/1e3}utc(t=this.t){return this.fromMs+t*1e3}label(t=this.t,{seconds:e=!1}={}){const i=ks(this.utc(t),this.zone);return`${Jn(i.h)}:${Jn(i.mi)}${e?`:${Jn(i.se)}`:""}`}dateLabel(t=this.t){return Ta(ks(this.utc(t),this.zone))}clamp(t){return Math.max(0,Math.min(this.duration,t))}}const z1=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Yl(){const n=new Oe;return n.setAttribute("position",new ke(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),n}const D1=`
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
uniform float uLogFar;   // log2(camera.far + 1), set each frame by render()
uniform float uFade;     // 0 the frame, 1 the haze colour (the hand-over's cut)
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
  // distance from a logarithmic depth buffer: a view-space point on this
  // pixel's ray, scaled to the depth along -z the buffer holds
  vec4 farPt = uInvProj * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec3 dirV = farPt.xyz / farPt.w;
  float w = exp2(depth * uLogFar) - 1.0;
  vec3 view = dirV * (w / max(-dirV.z, 1e-6));
  vec3 world = (uCamWorld * vec4(view, 1.0)).xyz;
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
  // the hand-over's cut: to the scene's haze, as the eye would see it
  col = mix(col, aces(uFogColor * uExposure), uFade);
  gl_FragColor = vec4(toSRGB(col), 1.0);
}
`;class I1{constructor(t){this.renderer=t,this.size=new qt;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?Yi:An,this.sceneRT=new Vn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new Wl(1,1,Qn),this.quad=new ge(Yl(),new xe({vertexShader:z1,fragmentShader:D1,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new qt},uInvProj:{value:new pe},uCamWorld:{value:new pe},uCamPos:{value:new j},uSunDir:{value:new j(0,1,0)},uSunColor:{value:new Zt},uFogColor:{value:new Zt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null},uLogFar:{value:Math.log2(1e5)},uFade:{value:0}}})),this.quad.frustumCulled=!1,this.quadScene=new Uo,this.quadScene.add(this.quad),this.quadCam=new Za(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSamples(t){this.sceneRT.samples!==t&&(this.sceneRT.samples=t,this.sceneRT.dispose())}setFog(t,e){this.uniforms.uFogDensity.value=t,this.uniforms.uFogFalloff.value=e}setSize(t,e,i){var s;this.size.set(Math.floor(t*i),Math.floor(e*i)),this.sceneRT.setSize(this.size.x,this.size.y),(s=this.atmosphere)==null||s.setSize(this.size.x,this.size.y)}render(t,e){const i=this.renderer;i.setRenderTarget(this.sceneRT),i.render(t,e);const s=this.uniforms;s.uInvProj.value.copy(e.projectionMatrixInverse),s.uCamWorld.value.copy(e.matrixWorld),s.uCamPos.value.copy(e.position),s.uLogFar.value=Math.log2(e.far+1),this.atmosphere?(this.atmosphere.render(i,e,this.sceneRT.depthTexture),s.uClouds.value=this.atmosphere.texture,s.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),s.uHasClouds.value=1):s.uHasClouds.value=0,i.setRenderTarget(null),i.render(this.quadScene,this.quadCam)}}const U1=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],F1={ra:12.857,dec:27.13},ln=`
#ifdef USE_LOGDEPTHBUF
out float vFragDepth;
out float vIsPerspective;
#endif
`,Ze=`
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
  vIsPerspective = projectionMatrix[2][3] == -1.0 ? 1.0 : 0.0;
#endif
`,kd=`
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
  vIsPerspective = 0.0;
#endif
`,cn=`
#ifdef USE_LOGDEPTHBUF
uniform float logDepthBufFC;
in float vFragDepth;
in float vIsPerspective;
#endif
`,hn=`
#ifdef USE_LOGDEPTHBUF
  // (an orthographic camera keeps the ordinary depth, as three's own chunk does)
  gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
`;function N1(n){let t=n>>>0;return function(){t=t+1831565813|0;let i=Math.imul(t^t>>>15,1|t);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296}}const ne=Math.PI/180,O1=29.530588853,Ps={utc:Date.UTC(1942,9,4,15,25),lat:21,lon:0},Ei=n=>(n%360+360)%360;function Nh(n,t,e,i){const s=Math.cos(n),o=-s*Math.sin(t),r=Math.sin(n)*Math.cos(e)-s*Math.cos(t)*Math.sin(e),a=Math.sin(n)*Math.sin(e)+s*Math.cos(t)*Math.cos(e);return i.set(o,a,-r)}const B1=[[0,0,1,0,6288774,-20905355],[2,0,-1,0,1274027,-3699111],[2,0,0,0,658314,-2955968],[0,0,2,0,213618,-569925],[0,1,0,0,-185116,48888],[0,0,0,2,-114332,-3149],[2,0,-2,0,58793,246158],[2,-1,-1,0,57066,-152138],[2,0,1,0,53322,-170733],[2,-1,0,0,45758,-204586],[0,1,-1,0,-40923,-129620],[1,0,0,0,-34720,108743],[0,1,1,0,-30383,104755],[2,0,0,-2,15327,10321],[0,0,1,2,-12528,0],[0,0,1,-2,10980,79661],[4,0,-1,0,10675,-34782],[0,0,3,0,10034,-23210],[4,0,-2,0,8548,-21636],[2,1,-1,0,-7888,24208],[2,1,0,0,-6766,30824],[1,0,-1,0,-5163,-8379],[1,1,0,0,4987,-16675],[2,-1,1,0,4036,-12831],[2,0,2,0,3994,-10445],[4,0,0,0,3861,-11650],[2,0,-3,0,3665,14403],[0,1,-2,0,-2689,-7003]],H1=[[0,0,0,1,5128122],[0,0,1,1,280602],[0,0,1,-1,277693],[2,0,0,-1,173237],[2,0,-1,1,55413],[2,0,-1,-1,46271],[2,0,0,1,32573],[0,0,2,1,17198],[2,0,1,-1,9266],[0,0,2,-1,8822],[2,-1,0,-1,8216],[2,0,-2,-1,4324],[2,0,1,1,4200],[2,1,0,-1,-3359],[2,-1,-1,1,2463],[2,-1,0,1,2211],[2,-1,-1,-1,2065]];function G1(n){const t=Ei(280.46646+n*(36000.76983+3032e-7*n)),e=357.52911+n*(35999.05029-1537e-7*n),i=Math.sin(e*ne)*(1.914602-n*(.004817+14e-6*n))+Math.sin(2*e*ne)*(.019993-101e-6*n)+Math.sin(3*e*ne)*289e-6,s=125.04-1934.136*n,o=t+i-.00569-.00478*Math.sin(s*ne),a=23+(26+(21.448-n*(46.815+n*(59e-5-n*.001813)))/60)/60+.00256*Math.cos(s*ne),l=Math.atan2(Math.cos(a*ne)*Math.sin(o*ne),Math.cos(o*ne))/ne,c=Math.asin(Math.sin(a*ne)*Math.sin(o*ne))/ne;return{lambda:Ei(o),ra:Ei(l),dec:c,eps:a}}function $1(n,t){const e=218.3164477+481267.88123421*n-.0015786*n*n,i=297.8501921+445267.1114034*n-.0018819*n*n,s=357.5291092+35999.0502909*n-1536e-7*n*n,o=134.9633964+477198.8675055*n+.0087414*n*n,r=93.272095+483202.0175233*n-.0036539*n*n,a=1-.002516*n-74e-7*n*n,l=119.75+131.849*n,c=53.09+479264.29*n,h=313.45+481266.484*n;let u=0,f=0,d=0;for(const[T,A,k,_,w,C]of B1){const F=Math.abs(A)===1?a:Math.abs(A)===2?a*a:1,z=(T*i+A*s+k*o+_*r)*ne;u+=w*F*Math.sin(z),f+=C*F*Math.cos(z)}for(const[T,A,k,_,w]of H1){const C=Math.abs(A)===1?a:Math.abs(A)===2?a*a:1;d+=w*C*Math.sin((T*i+A*s+k*o+_*r)*ne)}u+=3958*Math.sin(l*ne)+1962*Math.sin((e-r)*ne)+318*Math.sin(c*ne),d+=-2235*Math.sin(e*ne)+382*Math.sin(h*ne)+175*Math.sin((l-r)*ne)+175*Math.sin((l+r)*ne)+127*Math.sin((e-o)*ne)-115*Math.sin((e+o)*ne);const g=Ei(e+u/1e6),x=d/1e6,m=385000.56+f/1e3,p=g*ne,y=x*ne,v=t*ne,M=Math.atan2(Math.sin(p)*Math.cos(v)-Math.tan(y)*Math.sin(v),Math.cos(p))/ne,S=Math.asin(Math.sin(y)*Math.cos(v)+Math.cos(y)*Math.sin(v)*Math.sin(p))/ne;return{lambda:g,beta:x,dist:m,ra:Ei(M),dec:S}}function V1(n){const t=(n-2451545)/36525;return Ei(280.46061837+360.98564736629*(n-2451545)+387933e-9*t*t-t*t*t/3871e4)}function W1(n,t,e,i={}){const s=n/864e5+24405875e-1,o=(s-2451545)/36525,r=G1(o),a=$1(o,r.eps),l=Ei(V1(s)+e),c=t*ne;i.sun=Nh(r.dec*ne,(l-r.ra)*ne,c,i.sun||new j),i.moon=Nh(a.dec*ne,(l-a.ra)*ne,c,i.moon||new j);const h=Math.asin(6378.14/a.dist),u=Math.asin(Math.max(-1,Math.min(1,i.moon.y))),f=u-h*Math.cos(u),d=Math.hypot(i.moon.x,i.moon.z)||1e-9,g=Math.cos(f)/d;i.moon.set(i.moon.x*g,Math.sin(f),i.moon.z*g);const x=Math.acos(Math.cos(a.beta*ne)*Math.cos((a.lambda-r.lambda)*ne));return i.phase=Ei(a.lambda-r.lambda)/360,i.illum=(1-Math.cos(x))/2,i.age=i.phase*O1,i.lst=l/15,i.decl=r.dec*ne,i.sunRaDec=[r.ra,r.dec],i.moonRaDec=[a.ra,a.dec],i}const Pd=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],zd=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],j1=1.6110731556870734,X1=1.5;function q1(n){return n=Math.max(-1,Math.min(1,n)),1e3*Math.max(0,1-Math.exp(-((j1-Math.acos(n))/X1)))}function Hr(n,t,e,i=[0,0,0]){const s=q1(t.y),o=.2*e.turbidity*1e-17,r=Math.acos(Math.max(0,n.y)),a=1/(Math.cos(r)+.15*Math.pow(93.885-r*180/Math.PI,-1.253)),l=8400*a,c=1250*a,h=n.x*t.x+n.y*t.y+n.z*t.z,u=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),f=e.mieDirectionalG,d=f*f,g=1/(4*Math.PI)*((1-d)/Math.pow(1-2*f*h+d,1.5)),x=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let m=0;m<3;m++){const p=Pd[m]*e.rayleigh,y=.434*o*zd[m]*e.mieCoefficient,v=Math.exp(-(p*l+y*c)),M=(p*u+y*g)/(p+y);let S=Math.pow(s*M*(1-v),1.5);S*=1+(Math.pow(s*M*v,.5)-1)*x;const T=.1*v,A=(S+T)*.04+[0,3e-4,75e-5][m];i[m]=Math.pow(A,1/2.4)}return i}function K1(n,t,e=[0,0,0]){const i=Math.acos(Math.max(0,n.y)),s=1/(Math.cos(i)+.15*Math.pow(Math.max(.01,93.885-i*180/Math.PI),-1.253)),o=.2*t.turbidity*1e-17;for(let r=0;r<3;r++){const a=Pd[r]*t.rayleigh,l=.434*o*zd[r]*t.mieCoefficient;e[r]=Math.exp(-(a*8400*s+l*1250*s))}return e}const Y1=`
${ln}
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
  ${kd}
}
`,Dd=`
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
`,Z1=`
${Dd}
${cn}
in vec3 vDir;
void main() {
  ${hn}
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
`,J1=`
${Dd}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,Q1=`
${ln}
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
  ${kd}
}
`,ty=`
${cn}
uniform float uNight;
uniform float uTime;
in float vBright;
in float vTw;
void main() {
  ${hn}
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  float tw = 0.75 + 0.25 * sin(uTime * 3.1 + vTw) * sin(uTime * 1.7 + vTw * 0.37);
  float a = exp(-d * 4.0) * vBright * uNight * tw;
  gl_FragColor = vec4(vec3(0.9, 0.94, 1.0) * a * 1.8, 1.0);
}
`;class ey{constructor({lat:t=Ps.lat,lon:e=Ps.lon}={}){this.lat=t,this.lon=e,this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const i=F1,s=(u,f)=>{const d=u/24*2*Math.PI,g=f*ne;return new j(Math.cos(g)*Math.cos(d),Math.cos(g)*Math.sin(d),Math.sin(g))};this.uniforms={uSun:{value:new j(0,1,0)},uMoon:{value:new j(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:t*ne},uGalPole:{value:s(i.ra,i.dec)},uGalCentre:{value:s(17.761,-28.94)},uExposureHint:{value:1}};const o=new ge(new Kl(1,5),new xe({vertexShader:Y1,fragmentShader:Z1,uniforms:this.uniforms,side:an,depthWrite:!1}));o.frustumCulled=!1,o.renderOrder=-2,this.dome=o;const r=N1(4242),a=U1.map(([u,f,d])=>[u/24*2*Math.PI,f*ne,d]);for(let u=0;u<2600;u++){const f=r()*2-1;a.push([r()*2*Math.PI,Math.asin(f),3.4+Math.pow(r(),.55)*2.8])}const l=new Float32Array(a.length*3);a.forEach((u,f)=>l.set(u,f*3));const c=new Oe;c.setAttribute("aStar",new ke(l,3)),c.setAttribute("position",new ke(new Float32Array(a.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new u1(c,new xe({vertexShader:Q1,fragmentShader:ty,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:Eo})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new sn,this.group.add(o,this.stars),this.mapRT=new Vn(256,128,{type:Yi,depthBuffer:!1}),this.mapRT.texture.wrapS=za,this.mapScene=new Uo;const h=new ge(Yl(),new xe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:J1,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));h.frustumCulled=!1,this.mapScene.add(h),this.mapCam=new Za(-1,1,1,-1,0,1),this.astro={},this._v=new j}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}setPlace(t,e){this.lat=t,this.lon=e,this.uniforms.uLat.value=t*ne}update(t,e,i){const s=W1(t,this.lat,this.lon,this.astro),o=s.sun,r=this.uniforms;r.uSun.value.copy(o),r.uMoon.value.copy(s.moon),r.uPhase.value=s.phase,r.uIllum.value=s.illum,r.uLst.value=s.lst/24*2*Math.PI;const a=tn.smoothstep(-o.y,-.02,.2);r.uNight.value=a,this.starUniforms.uNight.value=a,this.starUniforms.uTime.value=e;const l=this.params,c=this._v,h=Hr(c.set(0,1,0),o,l),u=[0,0,0];for(let S=0;S<8;S++){const T=S/8*Math.PI*2,A=Hr(c.set(Math.cos(T),.08,Math.sin(T)).normalize(),o,l);for(let k=0;k<3;k++)u[k]+=A[k]/8}const f=Hr(c.set(o.x,.05,o.z).normalize(),o,l),d=K1(o,l),g=tn.smoothstep(o.y,-.04,.06),x=3.2;i.sunColor.setRGB(d[0]*x*g,d[1]*x*g,d[2]*x*g);const m=[.0035,.005,.011],y=tn.smoothstep(s.moon.y,-.02,.1)*s.illum*a;i.skyColor.setRGB(h[0]*.55+u[0]*.45+m[0]+.012*y,h[1]*.55+u[1]*.45+m[1]+.016*y,h[2]*.55+u[2]*.45+m[2]+.024*y);const v=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Zt(v,v,v),.35),i.zenith.setRGB(h[0],h[1],h[2]),i.horizon.setRGB(u[0]+m[0],u[1]+m[1],u[2]+m[2]),i.sunHorizon.setRGB(f[0],f[1],f[2]);const M=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,o.y)+i.skyColor.r)*M*1.1,(i.sunColor.g*Math.max(0,o.y)+i.skyColor.g)*M,(i.sunColor.b*Math.max(0,o.y)+i.skyColor.b)*M*.8),i.moonColor.setRGB(.05*y,.06*y,.085*y),i.moonDir.copy(s.moon),i.sunDir.copy(o),i.night=a,s}}const wl=8,un=`
#define PI 3.14159265
#define MAX_POINT_LIGHTS ${wl}
`,ns=`
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
`,Fo=`
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uMoonDir;
uniform vec3 uMoonColor;
uniform float uTime;
uniform sampler2D uSkyMap;      // equirect sky radiance, elevation squashed to the horizon
uniform vec4 uPointPos[MAX_POINT_LIGHTS]; // xyz world position, w radius (world units)
uniform vec3 uPointCol[MAX_POINT_LIGHTS]; // colour × intensity
uniform int uPointCount;

vec2 dirToSkyUv(vec3 d) {
  float y = clamp(d.y, -1.0, 1.0);
  return vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, sign(y) * sqrt(abs(y)) * 0.5 + 0.5);
}
vec3 skyMap(vec3 d) { return texture(uSkyMap, dirToSkyUv(d)).rgb; }

float sunVisibility(vec3 p) { return 1.0; }

vec3 ambientLight(vec3 n) {
  return mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
}

// how much of point light i reaches p, before the facing term
float pointFalloff(int i, vec3 p, out vec3 L) {
  vec3 d = uPointPos[i].xyz - p;
  float r = max(uPointPos[i].w, 1e-6);
  float dist = length(d);
  L = d / max(dist, 1e-6);
  float soft = 0.2 * r;
  return (soft * soft) / (soft * soft + dist * dist) * (1.0 - smoothstep(0.75 * r, r, dist));
}

// the point lights' diffuse light on a surface at p facing n
vec3 pointLights(vec3 n, vec3 p) {
  vec3 sum = vec3(0.0);
  for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
    if (i >= uPointCount) break;
    vec3 L;
    float k = pointFalloff(i, p, L);
    sum += uPointCol[i] * k * max(dot(n, L), 0.0);
  }
  return sum;
}

// their glint on a mirror-like surface (the sea): view direction V, normal N, shininess
vec3 pointGlints(vec3 N, vec3 V, vec3 p, float shine) {
  vec3 sum = vec3(0.0);
  for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
    if (i >= uPointCount) break;
    vec3 L;
    float k = pointFalloff(i, p, L);
    vec3 H = normalize(L + V);
    sum += uPointCol[i] * k * pow(max(dot(N, H), 0.0), shine);
  }
  return sum;
}

vec3 shade(vec3 albedo, vec3 n, vec3 p, float ao, float vis) {
  float ndl = max(dot(n, uSunDir), 0.0);
  float ndm = max(dot(n, uMoonDir), 0.0);
  vec3 direct = uSunColor * ndl * vis + uMoonColor * ndm + pointLights(n, p);
  return albedo * (direct + ambientLight(n) * ao);
}
`,yo=Math.PI*2,Gr=.4,ny=.18,Oh=(n,t,e,i)=>e>0?n+(t-n)*(1-Math.exp(-e/i)):t,iy=(n,t,e)=>(n+t+Math.sqrt((n-t)*(n-t)+e*e))/2,sy=n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2,Bh=n=>((n+Math.PI)%yo+yo)%yo-Math.PI,oy=(n,t,e)=>{const i=Math.max(0,Math.min(1,(e-n)/(t-n)));return i*i*(3-2*i)};function Id(n,t=[40,4500]){return .6+.52*oy(Math.log(t[0]),Math.log(t[1]),Math.log(Math.max(1e-6,n)))}const Hh={minDistance:8,maxDistance:9e3,pitchRange:[40,4500],near:.02,nearMax:300,far:3e5,targetMargin:150,clearance:[.12,.03],floorGap:.04,aheadMax:20,marchLimit:4e5,marchStep:.02,hopScale:300};class Ud{constructor(t,e,i,s={}){this.camera=t,this.dom=e,this.ground=i;const o={...Hh};for(const a of Object.keys(Hh))s[a]!==void 0&&(o[a]=s[a]);this.opts=o,this.keys=s.keys!==!1,this.minDistance=o.minDistance,this.maxDistance=o.maxDistance,this.home=this.homeView();const r=this.home;this.state={target:r.target.clone(),distance:r.distance,yaw:r.yaw,pitch:r.pitch,lift:0},this.goal={target:r.target.clone(),distance:r.distance,yaw:r.yaw,pitch:r.pitch,lift:0},this.flight=null,this.floor=0,this.groundM=0,this.pinned=!0,this._lastXZ=new qt(r.target.x,r.target.z),this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new Ed,this._v=new j,this._abort=new AbortController,this.bind()}pitchFor(t){return Id(t,this.opts.pitchRange)}dispose(){this._abort.abort(),this.flight=null}pose(){const t=this.state;return{target:{x:t.target.x,y:t.target.y,z:t.target.z},distance:t.distance,yaw:t.yaw,pitch:t.pitch}}homeView(t=innerWidth/Math.max(1,innerHeight)){const e=this.ground.bounds,i=e.x1-e.x0,s=Math.tan(this.camera.fov*Math.PI/360),o=t<.85,r=o?1.2*Math.hypot(i,e.z1-e.z0)*.92/(2*s):1.2*i/(2*s*Math.max(1,t)),a=Math.min(this.maxDistance,r);return{target:new j((e.x0+e.x1)/2,0,(e.z0+e.z1)/2+(o?0:(e.z1-e.z0)*.04)),distance:a,yaw:o?1.1:0,pitch:this.pitchFor(a)}}bind(){const t=this.dom,e={signal:this._abort.signal},i=new Map;let s=null,o=null,r=null;t.addEventListener("contextmenu",l=>l.preventDefault(),e),t.addEventListener("pointerdown",l=>{this.enabled&&(t.setPointerCapture(l.pointerId),i.set(l.pointerId,{x:l.clientX,y:l.clientY}),i.size===1?(s=l.button===2||l.shiftKey||l.ctrlKey||l.metaKey||l.altKey?"orbit":"pan",o={x:l.clientX,y:l.clientY}):i.size===2&&(s="pinch",r=this.pinchState(i)))},e),t.addEventListener("pointermove",l=>{if(i.has(l.pointerId)){if(!this.enabled){i.clear(),s=null;return}if(i.set(l.pointerId,{x:l.clientX,y:l.clientY}),s==="orbit"&&o){const c=l.clientX-o.x,h=l.clientY-o.y;this.goal.yaw-=c*.005,this.goal.pitch=tn.clamp(this.goal.pitch+h*.004,.06,1.52),o={x:l.clientX,y:l.clientY},this.touch()}else if(s==="pan"&&o){const c=l.clientX-o.x,h=l.clientY-o.y;(c||h)&&(this.panBy(c,h),this.touch()),o={x:l.clientX,y:l.clientY}}else if(s==="pinch"&&i.size===2){const c=this.pinchState(i),h=r.dist/Math.max(20,c.dist);this.zoomAt(c.cx,c.cy,h),this.panBy(c.cx-r.cx,c.cy-r.cy),this.goal.yaw-=Bh(c.angle-r.angle),r=c,this.touch()}}},e);const a=l=>{if(i.delete(l.pointerId),i.size===0)s=null;else if(i.size===1){const[c]=i.values();s="pan",o={...c}}};t.addEventListener("pointerup",a,e),t.addEventListener("pointercancel",a,e),t.addEventListener("wheel",l=>{if(!this.enabled)return;l.preventDefault();const c=l.deltaMode===1?l.deltaY*30:l.deltaY,h=Math.exp(Math.sign(c)*Math.min(Math.abs(c),150)*.0022);this.zoomAt(l.clientX,l.clientY,h),this.touch()},{passive:!1,signal:this._abort.signal}),t.addEventListener("dblclick",l=>{if(!this.enabled)return;const c=this.pickGround(l.clientX,l.clientY);if(c){const h=Math.max(this.minDistance,this.goal.distance*.35);this.flyTo({target:c,distance:h,pitch:this.goal.pitch+this.pitchFor(h)-this.pitchFor(this.goal.distance)},1.8)}},e),addEventListener("keydown",l=>{var d,g;if(!this.enabled||!this.keys||(g=(d=l.target).closest)!=null&&g.call(d,"input, textarea"))return;const c=this.goal.distance*.08,h={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[l.code];if(h&&!l.altKey){const x=Math.sin(this.goal.yaw),m=Math.cos(this.goal.yaw);this.goal.target.x+=(h[0]*m+h[1]*x)*c,this.goal.target.z+=(-h[0]*x+h[1]*m)*c,this.touch()}l.code==="KeyQ"&&(this.goal.yaw+=.12),l.code==="KeyE"&&(this.goal.yaw-=.12);const u=innerWidth/2,f=innerHeight/2;(l.code==="Equal"||l.code==="NumpadAdd")&&this.zoomAt(u,f,.8),(l.code==="Minus"||l.code==="NumpadSubtract")&&this.zoomAt(u,f,1.25)},e)}pinchState(t){const[e,i]=[...t.values()];return{dist:Math.hypot(e.x-i.x,e.y-i.y),cx:(e.x+i.x)/2,cy:(e.y+i.y)/2,angle:Math.atan2(i.y-e.y,i.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const i=this.dom.clientHeight||1,s=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/i,o=Math.sin(this.goal.yaw),r=Math.cos(this.goal.yaw),a=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*r-e*o*a)*s,this.goal.target.z+=(t*o-e*r*a)*s}zoomAt(t,e,i){const s=this.pickGround(t,e),o=this.goal.distance,r=tn.clamp(o*i,this.minDistance,this.maxDistance);if(s){const a=1-r/o;this.goal.target.x+=(s.x-this.goal.target.x)*a,this.goal.target.z+=(s.z-this.goal.target.z)*a}this.goal.pitch=tn.clamp(this.goal.pitch+this.pitchFor(r)-this.pitchFor(o),.06,1.52),this.goal.distance=r}pickGround(t,e){const i=this.dom.getBoundingClientRect(),s=new qt((t-i.left)/i.width*2-1,-((e-i.top)/i.height)*2+1);return this._ray.setFromCamera(s,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e){const i=this.ground,s=this.opts.marchLimit,o=i.maxY+this.opts.marchStep*2.5;if(e.y>=0&&t.y>o)return null;const r=e.y<0?t.y/-e.y:s;let a=t.y>o&&e.y<0?(t.y-o)/-e.y:0;const l=Math.min(r,s),c=this._v;let h=a;for(let u=0;u<700&&a<=l+.001;u++){c.copy(t).addScaledVector(e,a);const f=c.y-i.heightAt(c.x,c.z);if(f<0){let d=h,g=a;for(let x=0;x<24;x++){const m=(d+g)/2;c.copy(t).addScaledVector(e,m),c.y-i.heightAt(c.x,c.z)<0?g=m:d=m}return c.clone()}h=a,a+=Math.max(this.opts.marchStep,f*.45,a*.0015)}return r<s?t.clone().addScaledVector(e,r).setY(0):null}fit({rect:t,distance:e,yaw:i=this.goal.yaw,tilt:s=0,pitch:o,box:r,pad:a=1.06}){const l=this._fitCam||(this._fitCam=new dn);l.fov=this.camera.fov,l.aspect=this.camera.aspect,l.near=this.opts.near,l.far=this.opts.far*4,l.updateProjectionMatrix();const c=innerWidth,h=innerHeight,u=r||{x0:0,y0:0,x1:c,y1:h},f=Math.max(60,u.x1-u.x0),d=Math.max(60,u.y1-u.y0),g=Math.tan(l.fov*Math.PI/360),x=Math.cos(i),m=Math.sin(i);let p=(t.x0+t.x1)/2,y=(t.z0+t.z1)/2;const v=e!==void 0;let M=v?e:Math.max(t.x1-t.x0,t.z1-t.z0)/(2*g)*(h/d),S=0;const T=this._v;for(let A=0;A<8;A++){M=tn.clamp(M,this.minDistance,this.maxDistance),S=tn.clamp(o??this.pitchFor(M)+s,.06,1.52);const k=Math.cos(S),_=v?this.ground.heightAt(p,y):0;l.position.set(p+M*k*m,_+M*Math.sin(S),y+M*k*x),l.lookAt(p,_,y),l.updateMatrixWorld();let w=1/0,C=1/0,F=-1/0,z=-1/0;for(let J=0;J<4;J++){T.set(J&1?t.x1:t.x0,_,J&2?t.z1:t.z0).project(l);const Z=(T.x+1)/2*c,Y=(1-T.y)/2*h;w=Math.min(w,Z),F=Math.max(F,Z),C=Math.min(C,Y),z=Math.max(z,Y)}v||(M*=tn.clamp(Math.max((F-w)*a/f,(z-C)*a/d),.3,3));const P=2*M*g/h,B=((w+F)/2-(u.x0+u.x1)/2)*P,X=((C+z)/2-(u.y0+u.y1)/2)*P/Math.max(.35,Math.sin(S));p+=B*x+X*m,y+=-B*m+X*x}return{target:new j(p,this.ground.heightAt(p,y),y),distance:M,yaw:i,pitch:S}}groundAt(t,e){return Math.max(0,this.ground.metresAt(t,e))}smoothGround(t,e,i){const s=ny*i;let o=2*this.groundAt(t,e),r=2;for(let a=0;a<6;a++){const l=a/6*yo,c=l+yo/12;o+=this.groundAt(t+Math.cos(l)*s*.5,e+Math.sin(l)*s*.5),o+=this.groundAt(t+Math.cos(c)*s,e+Math.sin(c)*s),r+=2}return o/r}pin(){const t=this.goal.target;this.groundM=this.groundAt(t.x,t.z),this.pinned=!0,this._lastXZ.set(t.x,t.z);const e=this.groundM*this.ground.vert;t.y=e,this.state.target.y=e}flyTo(t,e=3,i={}){const s={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift,groundM:this.groundM},o={target:t.target?new j(t.target.x,t.target.y??0,t.target.z):s.target.clone(),distance:tn.clamp(t.distance??s.distance,this.minDistance,this.maxDistance),yaw:t.yaw??s.yaw,pitch:tn.clamp(t.pitch??s.pitch,.06,1.52),lift:t.lift??0};o.yaw=s.yaw+Bh(o.yaw-s.yaw);const r=Math.hypot(s.target.x-o.target.x,s.target.z-o.target.z),a=i.hop??Math.max(0,r*.9-Math.max(s.distance,o.distance)*.6);this.flight={from:s,dest:o,t:0,duration:e,hop:a,onDone:i.onDone,ready:i.ready,held:0}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,this.pin(),(e=t.onDone)==null||e.call(t),this.apply()}jump(t){const{distance:e,yaw:i,pitch:s}=t,o=t.target?t.target.x:t.x,r=t.target?t.target.z:t.z;this.flight=null;for(const a of[this.goal,this.state])o!==void 0&&a.target.set(o,this.ground.heightAt(o,r),r),e!==void 0&&(a.distance=tn.clamp(e,this.minDistance,this.maxDistance)),i!==void 0&&(a.yaw=i),s!==void 0&&(a.pitch=s),a.lift=0;this.pin(),this.apply()}update(t){var a;const e=this.goal;if(this.flight){const l=this.flight;let c=t/l.duration;l.ready&&l.t>.8&&l.held<6&&!l.ready()&&(l.held+=t,c*=.08),l.t=Math.min(1,l.t+c);const h=sy(l.t);e.target.lerpVectors(l.from.target,l.dest.target,h);const u=Math.log(l.from.distance)*(1-h)+Math.log(l.dest.distance)*h;e.distance=Math.exp(u)+l.hop*Math.sin(Math.PI*h),e.yaw=l.from.yaw+(l.dest.yaw-l.from.yaw)*h,e.pitch=l.from.pitch+(l.dest.pitch-l.from.pitch)*h+.2*Math.sin(Math.PI*h)*Math.min(1,l.hop/this.opts.hopScale),e.pitch=Math.min(1.52,e.pitch),e.lift=l.from.lift+(l.dest.lift-l.from.lift)*h,this.groundM=l.from.groundM+(this.groundAt(l.dest.target.x,l.dest.target.z)-l.from.groundM)*h,l.t>=1&&(this.flight=null,this.pin(),(a=l.onDone)==null||a.call(l))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);const i=this.ground.bounds,s=this.opts.targetMargin;e.target.x=tn.clamp(e.target.x,i.x0-s,i.x1+s),e.target.z=tn.clamp(e.target.z,i.z0-s,i.z1+s),this.flight||(Math.abs(e.target.x-this._lastXZ.x)+Math.abs(e.target.z-this._lastXZ.y)>1e-7&&(this.pinned=!1),this._lastXZ.set(e.target.x,e.target.z),this.pinned||(this.groundM=Oh(this.groundM,this.smoothGround(e.target.x,e.target.z,e.distance),t,Gr))),e.target.y=this.groundM*this.ground.vert;const o=this.state,r=this.flight?1:1-Math.exp(-t*7);o.target.lerp(e.target,r),o.distance=Math.exp(Math.log(o.distance)+(Math.log(e.distance)-Math.log(o.distance))*r),o.yaw+=(e.yaw-o.yaw)*r,o.pitch+=(e.pitch-o.pitch)*r,o.lift+=(e.lift-o.lift)*r,this.apply(t)}groundAhead(t,e,i){const s=this.ground;let o=s.heightAt(t,e);const r=this._prevXZ;if(r&&i>0){const a=(t-r.x)/i,l=(e-r.y)/i,c=Math.hypot(a,l),h=Math.min(this.opts.aheadMax,c*.3);h>this.opts.aheadMax*25e-5&&(o=Math.max(o,s.heightAt(t+a/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new qt).set(t,e),o}apply(t=0){const e=this.state,i=this.camera,s=Math.cos(e.pitch);i.position.set(e.target.x+e.distance*s*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*s*Math.cos(e.yaw));const o=this.opts.clearance[0]+e.distance*this.opts.clearance[1],r=this.groundAhead(i.position.x,i.position.z,t),a=Math.max(0,r+o-i.position.y);this.floor=Oh(this.floor,a,t,a>this.floor?Gr/3:Gr*2),i.position.y+=this.floor;const l=this.ground.heightAt(i.position.x,i.position.z),c=Math.min(this.opts.floorGap,o*.3);i.position.y=iy(i.position.y,l+c,c),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,i.lookAt(this._v);const h=i.position.y-l;i.near=tn.clamp(Math.min(h,e.distance)*.12,this.opts.near,this.opts.nearMax),i.far=this.opts.far,i.updateProjectionMatrix(),i.updateMatrixWorld()}}const Wn=`
uniform float uVert;        // world y per metre: exaggeration / unit
uniform float uExag;        // the exaggeration itself
uniform float uNormalE;     // the exaggeration the pack's normals were baked at
uniform sampler2D uArchH;   // the scene's pack, metres (R32F, nearest)
uniform vec4 uArchRect;     // its world rect: x0, z0, x1, z1
uniform float uOutside;     // metres beyond the pack's edge

vec2 rectUv(vec4 r, vec2 xz) { return (xz - r.xy) / (r.zw - r.xy); }
float edgeDist(vec4 r, vec2 xz) {
  vec2 a = min(xz - r.xy, r.zw - xz);
  return min(a.x, a.y);
}
// A manual bilinear fetch of a float height texture over a world rect,
// clamped at its edges.
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
float archMetres(vec2 xz) {
  return edgeDist(uArchRect, xz) < 0.0 ? uOutside : rectMetres(uArchH, uArchRect, xz);
}
// (the Hawaiian slots and district, as an empty archipelago answers)
int ownerAt(vec2 xz) { return -1; }
float slotWeight(int s, vec2 xz) { return 0.0; }
float distWeight(vec2 xz) { return 0.0; }
bool distDraws(vec2 xz) { return false; }
// A gradient (metres per metre) from a packed normal baked at uNormalE.
vec2 normalGrad(vec3 packed) {
  vec3 n0 = packed * 2.0 - 1.0;
  return -n0.xz / (max(n0.y, 0.03) * uNormalE);
}
`,No=`
float gPatchReef = 0.0;
float patchedMetres(int s, vec2 xz, float h) { return h; }
float groundMetres(vec2 xz) { return archMetres(xz); }
float distPond(vec2 xz) { return 0.0; }
float patchReef(vec2 xz) { return 0.0; }
`,ay=9,Gh={fleet:[1.45,.62,.42],strike:[1.55,1.05,.45],air:[1.1,1.05,1.15],convoy:[1,1.15,1.25],lane:[.95,1.05,1.1],campaign:[.75,1.05,1.45],schematic:[1.05,1.08,1.12]},$h={report:{width:2,opacity:.92,pulse:1},chart:{width:2,opacity:.9,pulse:1},orders:{width:1.6,opacity:.8,pulse:.8},narrative:{width:1.7,opacity:.82,pulse:.9},schematic:{width:1.4,opacity:.62,pulse:.45}},ry=`
${un}
${Wn}
${No}
${ln}
in vec4 aSeg;    // the segment's ends: ax, az, bx, bz
in vec4 aInfo;   // distance along the route at A and at B (world units), dashed (0/1), arrowhead at B (0/1)
uniform vec2 uResolution;  // drawing buffer, px
uniform float uWidth;      // px
uniform float uHead;       // arrowhead length, px
uniform vec2 uLift;        // world units off the ground: x + y × the distance to the camera
uniform vec3 uCamPos;
out float vS;
out float vDash;
out float vHead;

vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += uLift.x + distance(uCamPos, p) * uLift.y;
  return p;
}

void main() {
  vec3 A = draped(aSeg.xy);
  vec3 B = draped(aSeg.zw);
  mat4 pv = projectionMatrix * viewMatrix;
  vec4 ca = pv * vec4(A, 1.0);
  vec4 cb = pv * vec4(B, 1.0);
  vDash = aInfo.z;
  const float W0 = 1e-3;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vS = 0.0; vHead = -1.0; ${Ze} return; }
  if (ca.w < W0) ca = mix(ca, cb, (W0 - ca.w) / (cb.w - ca.w));
  if (cb.w < W0) cb = mix(cb, ca, (W0 - cb.w) / (ca.w - cb.w));
  vec2 sa = ca.xy / ca.w;
  vec2 sb = cb.xy / cb.w;
  vec2 d = (sb - sa) * uResolution;
  float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  if (aInfo.w > 0.5) {
    // a soft arrowhead at B, pointing along A -> B: the tip a little past B,
    // the base corners behind it (the quad's two B corners meet at the tip)
    vec4 c = cb;
    vec2 px = atB ? dir * uHead * 0.3 : -dir * uHead * 0.7 + nrm * position.y * uHead * 0.42;
    c.xy += px * 2.0 / uResolution * c.w;
    gl_Position = c;
    vS = aInfo.y;
    vHead = atB ? 1.0 : 0.0;
  } else {
    vec4 c = atB ? cb : ca;
    // half the width either side, and as far again past each end so the joins close
    vec2 off = (nrm * position.y + dir * (atB ? 0.5 : -0.5)) * uWidth / uResolution;
    c.xy += off * c.w;
    gl_Position = c;
    vS = atB ? aInfo.y : aInfo.x;
    vHead = -1.0;
  }
  ${Ze}
}
`,ly=`
${cn}
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
  ${hn}
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
`;function cy(n){var t;try{return(t=n.when)!=null&&t.from?tr(n.when):null}catch{return null}}class hy{constructor(t,e,i,{maxSeg:s=4,lift:o=[.02,.0024],height:r=60,densifyKm:a=50,world:l=!1}={}){this.route=t,this.span=cy(t);const c=$h[t.pointPrecision]?t.pointPrecision:"schematic";this.style=$h[c],this.ret=t.direction==="return";const h=c==="schematic"||t.kind==="schematic",u=new Set(t.schematicSegments||[]),f=[],d=[],g=t.points||[];for(let w=0;w+1<g.length;w++){const C=l?[g[w],g[w+1]]:wo([g[w],g[w+1]],a);for(let F=w===0?0:1;F<C.length;F++)f.push(l?C[F]:e.toWorld(C[F])),d.push(w)}const x=[],m=[];let p=0;for(let w=0;w+1<f.length;w++){const[C,F]=f[w],[z,P]=f[w+1],B=Math.hypot(z-C,P-F),X=Math.max(1,Math.ceil(B/s)),J=h||u.has(d[w+1])?1:0;for(let Z=0;Z<X;Z++){const Y=Z/X,st=(Z+1)/X;x.push(C+(z-C)*Y,F+(P-F)*Y,C+(z-C)*st,F+(P-F)*st),m.push(p+B*Y,p+B*st,J,0)}p+=B}this.total=p;const y=(w,C,F)=>{x.push(w[0],w[1],C[0],C[1]),m.push(F,F,0,1)};f.length>=2&&(y(f.at(-2),f.at(-1),p),this.ret&&y(f[1],f[0],0));const v=new es;v.setAttribute("position",new ke(new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]),3)),v.setIndex([0,2,1,1,2,3]);const M=new Float32Array(x);v.setAttribute("aSeg",new Ae(M,4)),v.setAttribute("aInfo",new Ae(new Float32Array(m),4)),v.instanceCount=M.length/4;let S=1/0,T=-1/0,A=1/0,k=-1/0;for(const[w,C]of f)S=Math.min(S,w),T=Math.max(T,w),A=Math.min(A,C),k=Math.max(k,C);v.boundingSphere=new ai(new j((S+T)/2,r/2,(A+k)/2),Math.hypot(T-S,k-A,r)/2+s),this.geometry=v;const _=Gh[t.kind]||Gh.schematic;this.colour=_,this.uniforms={...i,uResolution:{value:new qt(1,1)},uWidth:{value:this.style.width},uHead:{value:9},uLift:{value:new qt(o[0],o[1])},uCamPos:{value:new j},uColor:{value:new Zt(..._)},uOpacity:{value:0},uDashLen:{value:30},uMarch:{value:0},uPulse:{value:-1e6},uPulseLen:{value:60},uPulseK:{value:this.style.pulse}},this.material=new xe({vertexShader:ry,fragmentShader:ly,uniforms:this.uniforms,transparent:!0,depthWrite:!1}),this.mesh=new ge(v,this.material),this.mesh.renderOrder=4,this.mesh.visible=!1,this.k=0,this.phase=dy(t.id||"")%1e3/1e3}dispose(){this.geometry.dispose(),this.material.dispose()}}function uy(n,t){return t?typeof t=="string"?n.event===t:t.id&&n.event===t.id||Array.isArray(t.routes)&&t.routes.includes(n.id):!1}function dy(n){let t=2166136261;for(let e=0;e<n.length;e++)t=Math.imul(t^n.charCodeAt(e),16777619);return t>>>0}class fy{constructor({routes:t=[],proj:e,uniforms:i,camera:s,renderer:o,maxSeg:r=15,lift:a=[.02,.0024],height:l=300}){this.proj=e,this.shared=i,this.camera=s,this.renderer=o,this.lineOpts={maxSeg:r,lift:a,height:l},this.group=new sn,this.group.name="routes",this.lines=[],this.visible=!0,this._res=new qt,this._last=null,this.setRoutes(t)}setRoutes(t){for(const e of this.lines)this.group.remove(e.mesh),e.dispose();this.lines=[];for(const e of t||[]){if(!Array.isArray(e.points)||e.points.length<2)continue;const i=new hy(e,this.proj,this.shared,this.lineOpts);if(!i.span){i.dispose();continue}this.lines.push(i),this.group.add(i.mesh)}}visibleRoutes(){return this.lines.filter(t=>t.k>.5&&t.mesh.visible).map(t=>t.route)}update(t,e,{window:i,light:s=1,fade:o=1,focus:r=null}={}){const a=performance.now()/1e3,l=this._last===null?1:Math.max(0,Math.min(.1,a-this._last));this._last=a,this.apply(t,e,{win:i,light:s,fade:o,focus:r},a,1-Math.exp(-l*4))}settle(t,e,{window:i,light:s=1,fade:o=1,focus:r=null}={}){this.apply(t,e,{win:i,light:s,fade:o,focus:r},performance.now()/1e3,1)}apply(t,e,{win:i,light:s,fade:o,focus:r},a,l){const[c,h]=i||[t-12096e5,t+12096e5];this.renderer.getDrawingBufferSize(this._res);const u=this.renderer.getPixelRatio(),f=this.visible?o:0;for(const d of this.lines){const[g,x]=d.span,m=uy(d.route,r),p=m||x>=c&&g<=h?1:0;d.k+=(p-d.k)*l,Math.abs(p-d.k)<.003&&(d.k=p);const y=m||t>=g&&t<=x?1:.55,v=d.style.opacity*d.k*f*y;if(d.mesh.visible=v>.01,!d.mesh.visible)continue;const M=d.uniforms;M.uResolution.value.copy(this._res),M.uCamPos.value.copy(this.camera.position),M.uWidth.value=d.style.width*u,M.uHead.value=9*u,M.uOpacity.value=v,M.uColor.value.setRGB(d.colour[0]*s,d.colour[1]*s,d.colour[2]*s),M.uDashLen.value=e*.016,M.uPulseLen.value=Math.min(d.total*.12,e*.035);const S=(a/ay+d.phase)%1;M.uPulse.value=d.ret?(S<.5?S*2:2-S*2)*d.total:S*d.total,M.uMarch.value=d.ret?0:a*e*.012%(e*.016)}}dispose(){for(const t of this.lines)t.dispose();this.lines=[],this.group.clear()}}const py=`
${un}
${Wn}
${No}
${ln}
in vec4 aSeg;            // the segment's ends: ax, az, bx, bz
in vec2 aDist;           // distance along its line at A and at B, world units
uniform vec2 uResolution;  // drawing buffer, px
uniform float uWidth;      // px
uniform vec2 uLift;        // world units off the ground: x + y × the distance to the camera
uniform vec3 uCamPos;
out float vFade;
out float vS;

vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += uLift.x + distance(uCamPos, p) * uLift.y;
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
  vS = position.x > 0.5 ? aDist.y : aDist.x;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vFade = 0.0; ${Ze} return; }
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
  ${Ze}
}
`,my=`
${cn}
uniform vec3 uColor;
uniform float uOpacity;
uniform vec2 uDash;        // dash and gap, world units (0: solid); the inked share
in float vFade;
in float vS;
void main() {
  ${hn}
  float a = uOpacity * vFade;
  if (uDash.x > 0.0) {
    float u = vS / uDash.x;
    float ph = fract(u);
    float w = max(fwidth(u) * 1.2, 1e-3);
    a *= smoothstep(0.0, w, ph) * (1.0 - smoothstep(uDash.y - w, uDash.y, ph));
  }
  gl_FragColor = vec4(uColor, a);
}
`;function Zl(n){return n?n.type==="Polygon"?n.coordinates:n.type==="MultiPolygon"?n.coordinates.flat():n.type==="LineString"?[n.coordinates]:n.type==="MultiLineString"?n.coordinates:n.type==="GeometryCollection"?n.geometries.flatMap(Zl):[]:[]}function gy(n,t,{maxSeg:e,batch:i,world:s,densifyKm:o}){const r=new Map,a=new Set,l=h=>Math.round(h*1e6),c=(h,u,f)=>{let d=r.get(h);d||r.set(h,d={seg:[],dist:[]});let g=0;for(let x=0;x+1<u.length;x++){const m=u[x],p=u[x+1],y=`${l(m[0])},${l(m[1])}`,v=`${l(p[0])},${l(p[1])}`;if(y===v)continue;const[M,S]=f(m),[T,A]=f(p),k=Math.hypot(T-M,A-S),_=y<v?`${y}|${v}`:`${v}|${y}`;if(a.has(_)){g+=k;continue}a.add(_);const w=Math.max(1,Math.ceil(k/e));for(let C=0;C<w;C++){const F=C/w,z=(C+1)/w;d.seg.push(M+(T-M)*F,S+(A-S)*F,M+(T-M)*z,S+(A-S)*z),d.dist.push(g+k*F,g+k*z)}g+=k}};if(s)for(const h of n||[])c("all",h,u=>u);else for(const h of(n==null?void 0:n.features)||[]){const u=i?i(h):"all";for(const f of Zl(h.geometry))c(u,o?wo(f,o):f,d=>t.toWorld(d))}return r}class Wi{constructor(t,e,i,s={}){const{color:o=[1,1,1],width:r=1.5,order:a=3,maxSeg:l=1.5,lift:c=[.015,.0022],height:h=60,batch:u=null,densifyKm:f=50,world:d=!1,dash:g=null}=s;this.group=new sn,this.uniforms={...i,uResolution:{value:new qt(1,1)},uWidth:{value:r},uLift:{value:new qt(c[0],c[1])},uCamPos:{value:new j},uColor:{value:new Zt(...o)},uOpacity:{value:1},uDash:{value:new qt(g?g[0]:0,g?g[1]:.55)}},this.dashed=!!g,this.material=new xe({vertexShader:py,fragmentShader:my,uniforms:this.uniforms,transparent:!0,depthWrite:!1});const x=new Float32Array([0,-1,0,0,1,0,1,-1,0,1,1,0]);this.count=0,this.geometries=[];for(const[,{seg:m,dist:p}]of gy(t,e,{maxSeg:l,batch:u,world:d,densifyKm:f})){if(!m.length)continue;const y=new es;y.setAttribute("position",new ke(x,3)),y.setIndex([0,2,1,1,2,3]);const v=new Float32Array(m);y.setAttribute("aSeg",new Ae(v,4)),y.setAttribute("aDist",new Ae(new Float32Array(p),2)),y.instanceCount=v.length/4,this.count+=y.instanceCount;let M=1/0,S=-1/0,T=1/0,A=-1/0;for(let w=0;w<v.length;w+=2)M=Math.min(M,v[w]),S=Math.max(S,v[w]),T=Math.min(T,v[w+1]),A=Math.max(A,v[w+1]);const k=new j((M+S)/2,h/2,(T+A)/2);y.boundingSphere=new ai(k,Math.hypot(S-M,A-T,h)/2+l);const _=new ge(y,this.material);_.renderOrder=a,this.group.add(_),this.geometries.push(y)}}setDash(t,e=this.uniforms.uDash.value.y){this.dashed&&this.uniforms.uDash.value.set(t,e)}update(t,e,i=1){this.uniforms.uResolution.value.copy(e),this.uniforms.uCamPos.value.copy(t.position),this.uniforms.uOpacity.value=i,this.group.visible=i>.01&&this.count>0}dispose(){for(const t of this.geometries)t.dispose();this.material.dispose(),this.group.clear()}}const $r=32,Vh=1600;function vy(n,t,e){const i=new jl(n,t,e,Nl,ti);return i.minFilter=Le,i.magFilter=Le,i.wrapS=i.wrapT=pn,i.needsUpdate=!0,i}function Wh(n,t,e,i=1){const s=new jl(n,t,e,Mn,An);return s.minFilter=Ki,s.magFilter=$e,s.generateMipmaps=!0,s.anisotropy=i,s.wrapS=s.wrapT=pn,s.needsUpdate=!0,s.onUpdate=()=>{s.image.data=null,s.onUpdate=null},s}function Sl(n=255,t=255,e=255,i=255){const s=new jl(new Uint8Array([n,t,e,i]),1,1,Mn,An);return s.needsUpdate=!0,s}class Fd{constructor(t,e,i,s={}){if(!s.vertexShader||!s.fragmentShader)throw new Error("PackTerrain needs its shaders");this.pack=t,this.shared=i;const o=t.data,{W:r,H:a}=t,{x0:l,z0:c,x1:h,z1:u}=t.rect;this.rect=new Se(l,c,h,u),this.heights=o.metres,this.W=r,this.H=a,this.seaCull=s.seaCull??-.5;const f=s.unit??1;this.margin=s.margin??[30/f,10/f];const d=e.capabilities.getMaxAnisotropy();this.heightTex=vy(o.metres,r,a),this.normalTex=Wh(o.normals,r,a,Math.min(8,d)),this.landTex=o.land?Wh(o.land,r,a,Math.min(4,d)):Sl(0,0,0,0),this.shadowTex=Sl(),o.normals=null,o.land=null;const g=Math.max((h-l)/r,(u-c)/a);this.texel=g;const x=Math.max(h-l,u-c);this.levels=Math.max(1,Math.ceil(Math.log2(x/($r*g)))+1),this.leafSize=x/2**(this.levels-1),this.buildMinMax(),this.full=this.makeGrid($r),this.half=this.makeGrid($r/2),this.morph=[];for(let m=0;m<12;m++)this.morph.push(new qt);this.uniforms={...i,uOwnH:{value:this.heightTex},uOwnRect:{value:this.rect},uOwnN:{value:this.normalTex},uOwnL:{value:this.landTex},uOwnS:{value:this.shadowTex},uMorph:{value:this.morph},uCamPos:{value:new j},uDebug:{value:0},...s.uniforms},this.group=new sn;for(const m of[this.full,this.half])m.material=new xe({vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,uniforms:{...this.uniforms,uGrid:{value:m.dim}}}),m.mesh=new ge(m.geometry,m.material),m.mesh.frustumCulled=!1,m.mesh.matrixAutoUpdate=!1,this.group.add(m.mesh);this._frustum=new $l,this._m=new pe,this._box=new Li,this.rangeK=3.5,this.applyRange(this.rangeK)}setShadow(t){const e=t||this.shadowTex;this.uniforms.uOwnS.value=e;for(const i of[this.full,this.half])i.material.uniforms.uOwnS.value=e}makeGrid(t){const e=new es,i=new Float32Array((t+1)*(t+1)*3);for(let a=0;a<=t;a++)for(let l=0;l<=t;l++){const c=(a*(t+1)+l)*3;i[c]=l/t,i[c+2]=a/t}const s=[];for(let a=0;a<t;a++)for(let l=0;l<t;l++){const c=a*(t+1)+l,h=c+1,u=c+t+1,f=u+1;l+a&1?s.push(c,u,h,h,u,f):s.push(c,u,f,c,f,h)}e.setIndex(s),e.setAttribute("position",new ke(i,3));const o=new Float32Array(Vh*4),r=new Ae(o,4);return r.setUsage(Un),e.setAttribute("aNode",r),e.instanceCount=0,{dim:t,geometry:e,data:o,attr:r,count:0}}buildMinMax(){const{W:t,H:e,heights:i}=this,s=this.pack.rect,o=2**(this.levels-1),r=this.leafSize,a=t/(s.x1-s.x0),l=e/(s.z1-s.z0);let c=new Float32Array(o*o).fill(1/0),h=new Float32Array(o*o).fill(-1/0);for(let f=0;f<o;f++){const d=f*r;if(d>=s.z1-s.z0)continue;const g=Math.max(0,Math.floor(d*l)-1),x=Math.min(e-1,Math.ceil((d+r)*l)+1);for(let m=0;m<o;m++){const p=m*r;if(p>=s.x1-s.x0)continue;const y=Math.max(0,Math.floor(p*a)-1),v=Math.min(t-1,Math.ceil((p+r)*a)+1);let M=1/0,S=-1/0;for(let T=g;T<=x;T++)for(let A=y;A<=v;A++){const k=i[T*t+A];k<M&&(M=k),k>S&&(S=k)}c[f*o+m]=M,h[f*o+m]=S}}this.mm=[{lo:c,hi:h,n:o}];let u=o;for(;u>1;){const f=u/2,d=new Float32Array(f*f),g=new Float32Array(f*f);for(let x=0;x<f;x++)for(let m=0;m<f;m++){const p=2*x*u+2*m;d[x*f+m]=Math.min(c[p],c[p+1],c[p+u],c[p+u+1]),g[x*f+m]=Math.max(h[p],h[p+1],h[p+u],h[p+u+1])}c=d,h=g,u=f,this.mm.push({lo:c,hi:h,n:u})}}metresAt(t,e){const i=this.pack.rect,{W:s,H:o,heights:r}=this;let a=(t-i.x0)/(i.x1-i.x0)*s-.5,l=(e-i.z0)/(i.z1-i.z0)*o-.5;a<0?a=0:a>s-1.001&&(a=s-1.001),l<0?l=0:l>o-1.001&&(l=o-1.001);const c=a|0,h=l|0,u=a-c,f=l-h,d=h*s+c,g=r[d]+(r[d+1]-r[d])*u,x=r[d+s]+(r[d+s+1]-r[d+s])*u;return g+(x-g)*f}applyRange(t){this.rangeK=t;const e=t*this.leafSize;this.ranges=[];for(let i=0;i<this.levels;i++)this.ranges.push(e*2**i);this.ranges[this.levels-1]=1e12;for(let i=0;i<this.levels;i++){const s=this.ranges[i],o=i>0?this.ranges[i-1]:0;this.morph[i].set(o+(s-o)*.5,s*.97)}}setDebug(t){this.uniforms.uDebug.value=t;for(const e of[this.full,this.half])e.material.uniforms.uDebug.value=t}update(t,e=!0){this.group.visible=e,this.full.count=0,this.half.count=0,e&&(this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.vert=this.shared.uVert.value,this.uniforms.uCamPos.value.copy(t.position),this.select(0,0,this.levels-1));for(const i of[this.full,this.half])i.geometry.instanceCount=i.count,i.attr.needsUpdate=!0}nodeBox(t,e,i){const s=this.mm[i],o=this.leafSize*2**i,r=this.pack.rect.x0+t*o,a=this.pack.rect.z0+e*o,l=this.vert,c=Math.min(0,s.lo[e*s.n+t])*l-this.margin[0],h=Math.max(0,s.hi[e*s.n+t])*l+this.margin[1];return this._box.min.set(r,c,a),this._box.max.set(r+o,h,a+o),this._box}select(t,e,i){const s=this.mm[i];if(!(s.hi[e*s.n+t]>=this.seaCull))return!0;const r=this.nodeBox(t,e,i);if(r.distanceToPoint(this.cam)>this.ranges[i])return!1;if(!this._frustum.intersectsBox(r))return!0;const a=this.leafSize*2**i;if(i===0)return this.emit(this.full,t,e,a,0),!0;if(this.nodeBox(t,e,i).distanceToPoint(this.cam)>this.ranges[i-1])return this.emit(this.full,t,e,a,i),!0;for(let l=0;l<4;l++){const c=t*2+(l&1),h=e*2+(l>>1);if(!this.select(c,h,i-1)){const u=this.mm[i-1];if(!(u.hi[h*u.n+c]>=this.seaCull))continue;const f=this.nodeBox(c,h,i-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,c,h,a/2,i)}}return!0}emit(t,e,i,s,o){if(t.count>=Vh)return;const r=t.count*4;t.data[r]=this.pack.rect.x0+e*s,t.data[r+1]=this.pack.rect.z0+i*s,t.data[r+2]=s,t.data[r+3]=o,t.count++}stats(){return{nodes:this.full.count+this.half.count,levels:this.levels}}dispose(){for(const t of[this.full,this.half])t.geometry.dispose(),t.material.dispose();this.heightTex.dispose(),this.normalTex.dispose(),this.landTex.dispose(),this.shadowTex.dispose()}}const Nd=`
  vec2 g = floor(position.xz * uGrid + 0.5); // this vertex's grid index in its node
  float cell = aNode.z / uGrid;
  vec2 xz = aNode.xy + g * cell;
  float mt = packMetres(xz);
  float dist = distance(uCamPos, vec3(xz.x, mt * uVert, xz.y));
  vec2 m = uMorph[int(aNode.w)];
  float k = clamp((dist - m.x) / (m.y - m.x), 0.0, 1.0);
  vec2 odd = g - 2.0 * floor(g * 0.5);
  if (k > 0.0 && odd.x + odd.y > 0.5) {
    // (the two coarser vertices first, and the ground read at them in one
    // place: packMetres is inlined wherever it is called)
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
`,Vr={held:{colour:[170,58,46],strength:.62,jp:1,label:"held by Japan"},garrisoned:{colour:[190,104,70],strength:.42,jp:1,label:"garrisoned by Japan by treaty"},"allied-with-japan":{colour:[200,146,72],strength:.4,jp:1,label:"allied with Japan"},contested:{colour:[196,120,88],strength:.2,jp:0,hatch:1,label:"contested"},allied:{colour:[84,124,178],strength:.5,jp:0,label:"held by the Allies"},neutral:{colour:[150,150,146],strength:.3,jp:0,label:"neutral"},soviet:{colour:[150,84,118],strength:.42,jp:0,label:"the Soviet Union"},"zone-cks":{colour:[176,150,84],strength:.4,jp:0,label:"surrender to Chiang Kai-shek"},"zone-soviet":{colour:[150,84,118],strength:.42,jp:0,label:"surrender to the Soviet forces"},"zone-seac":{colour:[104,146,108],strength:.4,jp:0,label:"surrender to South East Asia Command"},"zone-cincpac":{colour:[104,150,190],strength:.4,jp:0,label:"surrender to the US Pacific Fleet"},"zone-swpa":{colour:[86,110,160],strength:.4,jp:0,label:"surrender to the South West Pacific Area"}},Wr={colour:[150,150,150],strength:.25,jp:0,label:"other"},xy=.22,yy=[.62,.13,.08],My=[.66,.8,.95],_y=[1.25,.42,.3],by=[1.55,.98,.42],wy=4,jh=1024;function Sy(n){const t=Sl(0,0,0,0);return{uFrontFillA:{value:t},uFrontFillB:{value:t},uFrontMarkA:{value:t},uFrontMarkB:{value:t},uFrontT:{value:0},uFrontK:{value:0},uFrontRect:{value:new Se(n.x0,n.z0,n.x1,n.z1)},uFrontInk:{value:new Zt(.2,.035,.02)}}}const Ey=`
uniform sampler2D uFrontFillA;
uniform sampler2D uFrontFillB;
uniform sampler2D uFrontMarkA;
uniform sampler2D uFrontMarkB;
uniform float uFrontT;
uniform float uFrontK;
uniform vec4 uFrontRect;
uniform vec3 uFrontInk;

// one family of diagonal hairlines, \`s\` world units apart
float hatchLines(vec2 xz, float s) {
  float u = (xz.x - xz.y) / s;
  float fw = max(fwidth(u), 1e-4);
  float d = abs(fract(u + 0.5) - 0.5);
  return 1.0 - smoothstep(0.45 * fw, 1.25 * fw, d);
}
// the hatch at about 7 px on the screen, its spacing a power of two of world
// units so it holds still as the camera moves, the finer lines fading out as
// the next coarser spacing takes over
float hatch(vec2 xz) {
  float px = max(length(fwidth(xz)), 1e-6);
  float l = log2(px * 7.0);
  float fl = floor(l);
  float s = exp2(fl);
  return mix(hatchLines(xz, s), hatchLines(xz, s * 2.0), smoothstep(0.0, 1.0, l - fl));
}
// where a keyframe's Japanese side ends, as a line a pixel and a half wide
float frontEdge(float jp) {
  float fw = fwidth(jp);
  return fw < 1e-5 ? 0.0 : 1.0 - smoothstep(0.55 * fw, 1.5 * fw, abs(jp - 0.5));
}

vec3 applyFront(vec3 col, vec2 xz, float metres, float landK) {
  if (uFrontK <= 0.001) return col;
  vec2 uv = rectUv(uFrontRect, xz);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return col;
  vec4 fA = texture(uFrontFillA, uv);
  vec4 fB = texture(uFrontFillB, uv);
  vec4 mA = texture(uFrontMarkA, uv);
  vec4 mB = texture(uFrontMarkB, uv);
  float t = uFrontT;
  vec4 f = mix(fA, fB, t);
  vec4 mk = mix(mA, mB, t);
  float k = landK * uFrontK;
  vec3 state = pow(f.rgb / max(f.a, 1e-4), vec3(2.2));
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  // a tint that keeps the hillshade: the state's colour at the relief's brightness
  vec3 tinted = state * (0.35 + 2.1 * lum);
  col = mix(col, tinted, clamp(mk.g, 0.0, 1.0) * k);
  // the hatch, in the state's colour, darker
  col = mix(col, state * (0.12 + 0.9 * lum), clamp(mk.r, 0.0, 1.0) * hatch(xz) * 0.85 * k);
  // the line where Japan's side ends, each keyframe's own, cross-faded
  float edge = mix(frontEdge(mA.b), frontEdge(mB.b), t);
  col = mix(col, uFrontInk, edge * 0.8 * k);
  return col;
}
`,Ty=`
${un}
${Wn}
${No}
${ln}
in vec2 aXZ;
in vec4 aMark;           // rgb colour (linear), w: 1 for a cut-off garrison
uniform vec2 uResolution;
uniform float uSize;     // the dot's radius, px
uniform vec3 uCamPos;
out vec2 vP;
out vec4 vMark;
void main() {
  vMark = aMark;
  vP = vec2(0.0);
  if (aMark.w < -0.5) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); ${Ze} return; }
  vec3 p = vec3(aXZ.x, max(groundMetres(aXZ), 0.0) * uVert, aXZ.y);
  p.y += 0.05 + distance(uCamPos, p) * 0.003;
  vec4 c = projectionMatrix * viewMatrix * vec4(p, 1.0);
  float r = uSize * (aMark.w > 0.5 ? 2.5 : 1.15);
  vP = position.xy * r / uSize;
  c.xy += position.xy * r * 2.0 / uResolution * c.w;
  gl_Position = c;
  ${Ze}
}
`,Ay=`
${cn}
uniform float uOpacity;
uniform float uSize;
in vec2 vP;
in vec4 vMark;
void main() {
  ${hn}
  float r = length(vP) * uSize;            // px from the centre
  float core = 1.0 - smoothstep(uSize - 0.8, uSize + 0.4, r);
  float rim = 1.0 - smoothstep(uSize + 0.4, uSize + 1.6, r);
  vec3 col = mix(vec3(0.02, 0.03, 0.05), vMark.rgb, core);
  float a = max(core, rim * 0.85);
  if (vMark.w > 0.5) {
    // the cut-off garrison's ring: dashed ink on a pale rim, so it reads on
    // a pale shelf and on the deep alike
    float R = uSize * 1.8;
    float d = abs(r - R);
    float halo = (1.0 - smoothstep(1.2, 2.2, d)) * (1.0 - core);
    float dash = step(0.5, fract(atan(vP.y, vP.x) / 6.2831853 * 8.0 + 0.25));
    float ring = (1.0 - smoothstep(0.35, 1.0, d)) * dash;
    col = mix(col, vec3(0.85, 0.83, 0.78), halo);
    col = mix(col, vec3(0.02, 0.025, 0.035), ring);
    a = max(a, max(halo * 0.9, ring));
  }
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a * uOpacity);
}
`,Cy=n=>n*n*(3-2*n);function Ry(n){try{const t=Ve(n.from),e=n.to?tr({from:n.to,precision:"day"})[1]:1/0,i=n.cutOff?Ve(n.cutOff):null;return{by:n.by,a:t,b:e,c:i}}catch{return null}}class Ly{constructor(t,e,i,s){var a,l,c,h,u;this.table=t,this.data=e,this.proj=e.proj,this.uniforms=i,this.labels=s,this.keyframes=((a=e.fronts)==null?void 0:a.keyframes)||new Map,this.cache=new Map,this.group=new sn,this.group.name="front",this.on=!0,this.k=1;const o=e.table.rect;this.rect=o,this.W=jh,this.H=Math.max(2,Math.round(jh*(o.z1-o.z0)/(o.x1-o.x0))),this.statesSeen=new Set;const r=t.uniforms;this.perimeters=new Map;for(const[f,d]of this.keyframes){const g=(((l=d.geojson)==null?void 0:l.features)||[]).filter(p=>{var y,v;return((y=p.properties)==null?void 0:y.kind)==="perimeter"&&/LineString/.test(((v=p.geometry)==null?void 0:v.type)||"")});if(!g.length)continue;const x=new Wi({type:"FeatureCollection",features:g},this.proj,r,{color:_y,width:1.6,order:4,maxSeg:30,lift:[.03,.0023],height:300,densifyKm:40,dash:[60,.58]});this.group.add(x.group);const m=g.map(p=>this.lineLabel(p,3)).filter(Boolean);this.perimeters.set(f,{lines:x,labels:m,k:0})}this.declared=[];for(const f of((h=(c=e.fronts)==null?void 0:c.lines)==null?void 0:h.features)||[]){if(!/LineString/.test(((u=f.geometry)==null?void 0:u.type)||""))continue;const d=f.properties||{};let g=null;try{g=[Ve(d.from),d.to?tr({from:d.to,precision:"day"})[1]:1/0]}catch{g=null}if(!g)continue;const x=new Wi({type:"FeatureCollection",features:[f]},this.proj,r,{color:by,width:1.8,order:4,maxSeg:30,lift:[.03,.0024],height:300,densifyKm:40,dash:[100,.7]});this.group.add(x.group),this.declared.push({f,span:g,lines:x,label:this.lineLabel(f,2),k:0})}this.buildIslands(e.places||[]),this.pairKey=null,this.date=null,this._last=null}lineLabel(t,e){var d;const i=t.properties||{};if(!i.name)return null;const s=t.geometry.type==="MultiLineString"?t.geometry.coordinates.reduce((g,x)=>x.length>g.length?x:g,[]):t.geometry.coordinates;if(!s||s.length<2)return null;const o=wo(s,50),r=o.map(g=>this.proj.toWorld(g));let a=0;const l=[0];for(let g=1;g<r.length;g++)l.push(a+=Math.hypot(r[g][0]-r[g-1][0],r[g][1]-r[g-1][1]));let c=l.findIndex(g=>g>=a/2);c=Math.max(1,Math.min(r.length-1,c));const h=o[c-1],u=o[c],f=this.labels.add({text:i.name,ja:typeof i.ja=="string"?i.ja:((d=i.ja)==null?void 0:d.kanji)||null,kind:"front",rank:e,lonlat:[(h[0]+u[0])/2,(h[1]+u[1])/2],along:[h,u]});return f.k=0,f}buildIslands(t){const e=[];for(const h of t){if(!Array.isArray(h.held)||!h.held.length)continue;const u=bi(h.geometry);if(!u)continue;const f=h.held.map(Ry).filter(Boolean);if(!f.length)continue;const[d,g]=this.proj.toWorld(u);e.push({place:h,x:d,z:g,iv:f})}if(this.isles=e,!e.length)return;const i=e.length,s=new es;s.setAttribute("position",new ke(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),3)),s.setIndex([0,1,2,2,1,3]);const o=new Float32Array(i*2);e.forEach((h,u)=>o.set([h.x,h.z],u*2)),s.setAttribute("aXZ",new Ae(o,2)),this.isleMark=new Ae(new Float32Array(i*4),4),this.isleMark.setUsage(Un),s.setAttribute("aMark",this.isleMark),s.instanceCount=i;let r=1/0,a=-1/0,l=1/0,c=-1/0;for(const h of e)r=Math.min(r,h.x),a=Math.max(a,h.x),l=Math.min(l,h.z),c=Math.max(c,h.z);s.boundingSphere=new ai(new j((r+a)/2,0,(l+c)/2),Math.hypot(a-r,c-l)/2+500),this.isleUniforms={...this.table.uniforms,uResolution:{value:new qt(1,1)},uSize:{value:3.5},uCamPos:{value:new j},uOpacity:{value:1}},this.isleMaterial=new xe({vertexShader:Ty,fragmentShader:Ay,uniforms:this.isleUniforms,transparent:!0,depthWrite:!1}),this.isleMesh=new ge(s,this.isleMaterial),this.isleMesh.name="front-islands",this.isleMesh.renderOrder=6,this.group.add(this.isleMesh),this.isleDay=null}setIslands(t){if(!this.isleMesh)return;const e=Math.floor(t/864e5);if(e===this.isleDay)return;this.isleDay=e;const i=this.isleMark.array;let s=0;this.isles.forEach((o,r)=>{const a=o.iv.find(h=>t>=h.a&&t<h.b);if(o.now=a||null,!a){i.set([0,0,0,-1],r*4);return}s++;const l=a.by==="jp"?yy:My,c=a.c!==null&&t>=a.c?1:0;i.set([l[0],l[1],l[2],c],r*4)}),this.isleShown=s,this.isleMark.needsUpdate=!0}textures(t){let e=this.cache.get(t);if(e)return e.used=performance.now(),e;const i=this.keyframes.get(t);for(e=this.rasterise(i==null?void 0:i.geojson),e.used=performance.now(),this.cache.set(t,e);this.cache.size>wy;){let s=null;for(const[o,r]of this.cache)(!s||r.used<s[1].used)&&(s=[o,r]);if(!s)break;s[1].fill.dispose(),s[1].mark.dispose(),this.cache.delete(s[0])}return e}rasterise(t){const{W:e,H:i,rect:s}=this,o=()=>{const x=document.createElement("canvas");return x.width=e,x.height=i,x},r=o(),a=o(),l=r.getContext("2d"),c=a.getContext("2d"),h=e/(s.x1-s.x0),u=i/(s.z1-s.z0),f=(x,m)=>{x.beginPath();for(const p of m)wo(p,25).forEach((v,M)=>{const[S,T]=this.proj.toWorld(v),A=(S-s.x0)*h,k=(T-s.z0)*u;M?x.lineTo(A,k):x.moveTo(A,k)}),x.closePath()};let d=0;for(const x of(t==null?void 0:t.features)||[]){const m=x.properties||{};if(m.kind==="perimeter")continue;const p=x.geometry,y=(p==null?void 0:p.type)==="Polygon"?[p.coordinates]:(p==null?void 0:p.type)==="MultiPolygon"?p.coordinates:[];if(!y.length)continue;const v=Vr[m.state]||Wr;this.statesSeen.add(m.state);const M=v.hatch||m.pointsAndLines?1:0,S=m.pointsAndLines?xy:v.strength;l.fillStyle=`rgb(${v.colour.join(",")})`,c.fillStyle=`rgb(${M*255}, ${Math.round(S*255)}, ${v.jp*255})`;for(const T of y)f(l,T),l.fill("evenodd"),f(c,T),c.fill("evenodd"),d++}const g=x=>{const m=new _d(x);return m.flipY=!1,m.premultiplyAlpha=!0,m.minFilter=$e,m.magFilter=$e,m.generateMipmaps=!1,m.wrapS=m.wrapT=pn,m};return{fill:g(r),mark:g(a),polygons:d}}update(t,e,{camera:i,resolution:s,dpr:o=1,fade:r=1,ease:a}={}){const l=performance.now()/1e3,c=this._last===null?1:Math.max(0,Math.min(.1,l-this._last));this._last=l;const h=a??1-Math.exp(-c*5);this.k+=((this.on?1:0)-this.k)*h,Math.abs((this.on?1:0)-this.k)<.002&&(this.k=this.on?1:0);const u=this.k*r,f=this.uniforms,d=this.table.app.clock.frontPair(t),g=d.a&&this.keyframes.has(d.a.id)?d.a.id:null,x=d.b&&this.keyframes.has(d.b.id)?d.b.id:g;if(this.pair={a:g,b:x,t:d.t},g){const p=`${g}|${x}`;if(p!==this.pairKey){this.pairKey=p;const y=this.textures(g),v=x===g?y:this.textures(x);f.uFrontFillA.value=y.fill,f.uFrontMarkA.value=y.mark,f.uFrontFillB.value=v.fill,f.uFrontMarkB.value=v.mark}f.uFrontT.value=Cy(Math.max(0,Math.min(1,d.t))),f.uFrontK.value=u}else f.uFrontK.value=0;const m=g?f.uFrontT.value:0;for(const[p,y]of this.perimeters){const v=p===g&&p===x?1:p===g?1-m:p===x?m:0;y.k+=(v-y.k)*h,Math.abs(v-y.k)<.003&&(y.k=v),y.lines.uniforms.uWidth.value=1.6*o,y.lines.setDash(e*.016),y.lines.update(i,s,.9*y.k*u);for(const M of y.labels)M.k=y.k*u}for(const p of this.declared){const y=t>=p.span[0]&&t<p.span[1]?1:0;p.k+=(y-p.k)*h,Math.abs(y-p.k)<.003&&(p.k=y),p.lines.uniforms.uWidth.value=1.8*o,p.lines.setDash(e*.028),p.lines.update(i,s,.9*p.k*u),p.label&&(p.label.k=p.k*u)}if(this.setIslands(t),this.isleMesh){const p=this.isleUniforms;p.uResolution.value.copy(s),p.uCamPos.value.copy(i.position),p.uSize.value=(e<2500?4:3.2)*o,p.uOpacity.value=u,this.isleMesh.visible=u>.01&&this.isleShown>0}this.date=t}legend(){var a,l,c,h,u;if(!((a=this.pair)!=null&&a.a))return null;const t=[...new Set([this.pair.a,this.pair.b])],e=new Set;let i=!1;for(const f of t)for(const d of((c=(l=this.keyframes.get(f))==null?void 0:l.geojson)==null?void 0:c.features)||[]){const g=d.properties||{};g.kind!=="perimeter"&&(g.state&&e.add(g.state),g.pointsAndLines&&(i=!0))}const s=this.pair.t<.5?this.pair.a:this.pair.b,o=this.keyframes.get(s),r={jp:!1,allied:!1,cut:!1};for(const f of this.isles||[])f.now&&(f.now.by==="jp"?r.jp=!0:r.allied=!0,f.now.c!==null&&this.date>=f.now.c&&(r.cut=!0));return{keyframe:s,date:(o==null?void 0:o.date)??s,between:this.pair.a!==this.pair.b&&this.pair.t>.02&&this.pair.t<.98?[(h=this.keyframes.get(this.pair.a))==null?void 0:h.date,(u=this.keyframes.get(this.pair.b))==null?void 0:u.date]:null,states:[...e].map(f=>({id:f,...Vr[f]||Wr})),pointsAndLines:i,perimeter:t.some(f=>this.perimeters.has(f)),declared:this.declared.filter(f=>f.k>.5).map(f=>({name:f.f.properties.name,ja:f.f.properties.ja})),isles:r,sources:(o==null?void 0:o.sources)||[],note:(o==null?void 0:o.note)||null}}at(t,e){var a,l,c;if(!((a=this.pair)!=null&&a.a))return null;const i=this.pair.t<.5?this.pair.a:this.pair.b,[s,o]=this.proj.toLonLat(t,e);let r=null;for(const h of((c=(l=this.keyframes.get(i))==null?void 0:l.geojson)==null?void 0:c.features)||[]){const u=h.properties||{};if(u.kind==="perimeter")continue;const f=h.geometry,d=(f==null?void 0:f.type)==="Polygon"?[f.coordinates]:(f==null?void 0:f.type)==="MultiPolygon"?f.coordinates:[];for(const g of d)ky(g,s,o)&&(r={state:u.state,name:u.name,pointsAndLines:!!u.pointsAndLines,...Vr[u.state]||Wr})}return r}stats(){var t;return{keyframes:this.keyframes.size,cached:this.cache.size,pair:this.pair,perimeters:this.perimeters.size,declared:this.declared.length,islands:((t=this.isles)==null?void 0:t.length)||0,islandsShown:this.isleShown||0}}dispose(){for(const t of this.cache.values())t.fill.dispose(),t.mark.dispose();for(const t of this.perimeters.values())t.lines.dispose();for(const t of this.declared)t.lines.dispose();this.isleMesh&&(this.isleMesh.geometry.dispose(),this.isleMaterial.dispose())}}function ky(n,t,e){let i=!1;for(const s of n)for(let o=0,r=s.length-1;o<s.length;r=o++){const[a,l]=s[o],[c,h]=s[r];l>e!=h>e&&t<(c-a)*(e-l)/(h-l)+a&&(i=!i)}return i}const Py=`
${un}
${Wn}
${ln}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[12];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out float vMetres;
float packMetres(vec2 xz) { return archMetres(xz); }

void main() {
${Nd}
  vMetres = mt;
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  ${Ze}
}
`,zy=`
vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

// The land's tint by height, a relief map's: a sage lowland, the olive and
// sand of the hills, the browns of the ranges, grey rock, snow.
vec3 hypsometric(float m) {
  vec3 c = srgb(vec3(0.56, 0.63, 0.47));
  c = mix(c, srgb(vec3(0.66, 0.67, 0.48)), smoothstep(30.0, 300.0, m));
  c = mix(c, srgb(vec3(0.77, 0.71, 0.53)), smoothstep(300.0, 900.0, m));
  c = mix(c, srgb(vec3(0.70, 0.57, 0.42)), smoothstep(900.0, 2000.0, m));
  c = mix(c, srgb(vec3(0.57, 0.50, 0.44)), smoothstep(2000.0, 3600.0, m));
  c = mix(c, srgb(vec3(0.80, 0.79, 0.78)), smoothstep(3800.0, 5200.0, m));
  c = mix(c, srgb(vec3(0.96, 0.96, 0.97)), smoothstep(5200.0, 6500.0, m));
  return c;
}

// The water's tint by depth, on a log scale of depth: a pale sea-glass over
// the shelf, a clear mid blue down the slope, a quiet slate blue on the
// abyssal plain, the trenches near ink.
vec3 bathymetric(float depth) {
  float t = log(1.0 + max(depth, 0.0) / 40.0) / log(1.0 + 11000.0 / 40.0);
  vec3 c = srgb(vec3(0.80, 0.90, 0.89));
  c = mix(c, srgb(vec3(0.56, 0.75, 0.82)), smoothstep(0.06, 0.34, t));
  c = mix(c, srgb(vec3(0.27, 0.46, 0.63)), smoothstep(0.34, 0.66, t));
  c = mix(c, srgb(vec3(0.14, 0.26, 0.40)), smoothstep(0.66, 0.86, t));
  c = mix(c, srgb(vec3(0.105, 0.20, 0.33)), smoothstep(0.86, 0.92, t));
  c = mix(c, srgb(vec3(0.03, 0.06, 0.14)), smoothstep(0.925, 0.985, t));
  return c;
}

// An isobath at \`level\` metres as a hairline (fw: the depth's change per
// pixel), gone where lines that far apart would crowd closer than a few
// pixels (gap: the spacing to its neighbours, metres).
float isobath(float d, float level, float fw, float gap) {
  float line = 1.0 - smoothstep(0.35 * fw, 1.25 * fw, abs(d - level));
  return line * (1.0 - smoothstep(0.06 * gap, 0.22 * gap, fw));
}
float isobaths(float d, float fw) {
  float a = isobath(d, 200.0, fw, 800.0) * 1.35;
  a = max(a, isobath(d, 1000.0, fw, 800.0));
  a = max(a, isobath(d, 2000.0, fw, 1000.0));
  a = max(a, isobath(d, 4000.0, fw, 2000.0));
  a = max(a, isobath(d, 6000.0, fw, 2000.0));
  a = max(a, isobath(d, 8000.0, fw, 2000.0));
  return a;
}
`,Dy=`
${un}
${ns}
${Wn}
${Fo}
${cn}
uniform sampler2D uOwnN;   // normals at uNormalE (rgb), ambient occlusion (a)
uniform vec4 uOwnRect;
uniform int uDebug;
uniform float uIso;        // the isobaths' strength (0 hides them)
in vec3 vWorld;
in float vMetres;

${zy}

// the front's held land, hatched where contested, and its line (front.js)
${Ey}

void main() {
  ${hn}
  vec2 xz = vWorld.xz;
  vec2 uv = rectUv(uOwnRect, xz);
  vec4 nt = texture(uOwnN, uv);
  vec2 grad = normalGrad(nt.xyz);
  vec3 n = normalize(vec3(-grad.x * uExag, 1.0, -grad.y * uExag));
  float ao = mix(1.0, nt.a, 0.6);
  float m = vMetres;
  // the hillshade: 1 on flat ground, brighter facing the light, darker away
  float level = max(uSunDir.y, 0.15);
  float hs = clamp(dot(n, uSunDir) / level, 0.0, 2.2);

  // --- land ------------------------------------------------------------------
  vec3 land = shade(hypsometric(m), n, vWorld, ao, 1.0);

  // --- sea: the floor through depth-tinted water ------------------------------
  float depth = -m;
  vec3 tint = bathymetric(depth);
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * 0.55 + uSkyColor * 1.5;
  // the floor's relief reads through the water, less in the deeps
  float relief = mix(1.0, hs, 0.62 - 0.27 * smoothstep(1000.0, 8000.0, depth));
  vec3 sea = tint * light * relief * mix(1.0, ao, 0.5);
  // a sandy floor shows through the first few tens of metres
  vec3 sand = shade(srgb(vec3(0.84, 0.80, 0.66)), n, vWorld, ao, 1.0);
  sea = mix(sand, sea, smoothstep(0.0, 60.0, depth) * 0.72 + 0.28);
  // the chart's isobaths: a little darker than the water they cross
  float fw = max(fwidth(depth), 1e-3);
  sea *= 1.0 - 0.2 * uIso * isobaths(depth, fw);

  float w = max(fwidth(m), 1e-3);
  float landK = smoothstep(-w, w, m);
  vec3 col = mix(sea, land, landK);
  col = applyFront(col, xz, m, landK);
  if (uDebug == 2) col = n * 0.5 + 0.5;
  if (uDebug == 3) col = vec3(ao);
  if (uDebug == 4) col = vec3(hs * 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`;class Iy{constructor(t,e,i,s={}){this.pack=e,this.unit=i.unit,this.exag=Re.exaggeration(Re.maxDistance),this.uniforms={uVert:{value:this.exag/this.unit},uExag:{value:this.exag},uNormalE:{value:e.data.normalExag??e.normalExag??Re.normalExag},uArchH:{value:null},uArchRect:{value:new Se},uOutside:{value:Re.outside}},this.lo=e.data.lo,this.hi=e.data.hi,this.terrain=new Fd(e,t.renderer,{...t.light.uniforms,...this.uniforms},{vertexShader:Py,fragmentShader:Dy,seaCull:-1/0,unit:this.unit,uniforms:{uIso:{value:1},...s}}),this.uniforms.uArchH.value=this.terrain.heightTex,this.uniforms.uArchRect.value.copy(this.terrain.rect);const o=e.rect;this.bounds={x0:o.x0,z0:o.z0,x1:o.x1,z1:o.z1},this.group=this.terrain.group}get vert(){return this.uniforms.uVert.value}get maxY(){return Math.max(0,this.hi)*this.vert}metresAt(t,e){const i=this.bounds;return t<i.x0||e<i.z0||t>i.x1||e>i.z1?Re.outside:this.terrain.metresAt(t,e)}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.vert}setExaggeration(t){this.exag=t,this.uniforms.uExag.value=t,this.uniforms.uVert.value=t/this.unit}update(t,e,{exag:i}={}){this.setExaggeration(i??Re.exaggeration(e)),this.terrain.update(t,!0)}setRange(t){this.terrain.applyRange(t)}stats(){return{exag:+this.exag.toFixed(2),...this.terrain.stats()}}dispose(){this.terrain.dispose()}}const Uy=3e3,Fy=60,Ny=120,Oy=15,Xh=[17e3,11e3],qh=[6500,3500],By=.2,Hy=[.032,.037,.043],jr=(n,t,e)=>{const i=Math.max(0,Math.min(1,(e-n)/(t-n)));return i*i*(3-2*i)},Gy=`
${ln}
in vec3 aColour;
out vec3 vColour;
out vec3 vWorld;
void main() {
  vColour = aColour;
  vWorld = position;
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
  ${Ze}
}
`,$y=`
${un}
${Fo}
${cn}
uniform float uOpacity;
in vec3 vColour;
in vec3 vWorld;
void main() {
  ${hn}
  vec3 col = shade(vColour, vec3(0.0, 1.0, 0.0), vWorld, 1.0, 1.0);
  gl_FragColor = vec4(col, uOpacity);
}
`;function Vy(n){let t=1/0,e=-1/0,i=1/0,s=-1/0;for(const[o,r]of n)o<t&&(t=o),o>e&&(e=o),r<i&&(i=r),r>s&&(s=r);return Math.max(e-t,s-i)}const Kh=n=>n.map(t=>Math.pow(t,2.2));class Wy{constructor(t,e,i,s=null){var h,u,f;this.group=new sn,this.group.name="coast";const o=(t==null?void 0:t.features)||[],r=(u=(h=t==null?void 0:t.strokes)==null?void 0:h.features)!=null&&u.length?t.strokes.features:o,a=new Map;for(const d of o)((f=d.properties)==null?void 0:f.ne)!=null&&Number.isFinite(d.properties.area)&&a.set(String(d.properties.ne),d.properties.area);const l={big:[],mid:[],small:[]};for(const d of r){const g=d.properties||{},x=g.ne!=null&&a.has(String(g.ne))?a.get(String(g.ne)):Number.isFinite(g.area)?g.area:null;let m;if(x!==null)m=x>=Uy?"big":x>=Fy?"mid":"small";else{const p=Math.max(0,...Zl(d.geometry).map(y=>Vy(y.map(v=>e.toWorld(v)))));m=p>=Ny?"big":p>=Oy?"mid":"small"}l[m].push(d)}this.counts={big:l.big.length,mid:l.mid.length,small:l.small.length};const c=(d,g)=>new Wi({type:"FeatureCollection",features:d},e,i,{color:Hy,width:1.2,order:g,maxSeg:25,lift:[.02,.0022],height:300,densifyKm:0});this.sets={big:c(l.big,3),mid:c(l.mid,3),small:c(l.small,3)};for(const d of Object.values(this.sets))this.group.add(d.group);this.lines=this.sets.big,this.fills=s?this.buildFills(o,e,i,s):null,this.fills&&this.group.add(this.fills)}buildFills(t,e,i,s){var f;const o=Kh([.6,.66,.5]),r=Kh([.86,.85,.74]),a=[],l=[];let c=0;for(const d of t){const g=(f=d.properties)==null?void 0:f.kind,x=d.geometry,m=(x==null?void 0:x.type)==="Polygon"?[x.coordinates]:(x==null?void 0:x.type)==="MultiPolygon"?x.coordinates:[];for(const p of m){if(!(p!=null&&p.length)||p[0].length<4)continue;const y=p.map(k=>wo(k,20).map(_=>e.toWorld(_)));if(this.landInPack(y[0],s))continue;const v=y[0].map(([k,_])=>new qt(k,_)),M=y.slice(1).map(k=>k.map(([_,w])=>new qt(_,w)));let S;try{S=ql.triangulateShape(v,M)}catch{continue}const T=v.concat(...M),A=g==="reef"?r:o;for(const k of S)for(const _ of k){const w=T[_];a.push(w.x,By,w.y),l.push(A[0],A[1],A[2])}c++}}if(this.fillCount=c,!a.length)return null;const h=new Oe;h.setAttribute("position",new we(a,3)),h.setAttribute("aColour",new we(l,3)),h.computeBoundingSphere(),this.fillUniforms={...i,uOpacity:{value:1}},this.fillMaterial=new xe({vertexShader:Gy,fragmentShader:$y,uniforms:this.fillUniforms,transparent:!0,depthWrite:!1,side:fn});const u=new ge(h,this.fillMaterial);return u.name="coast-fills",u.renderOrder=2,u}landInPack(t,e){let i=0,s=0;for(const[r,a]of t){if(e.metresAt(r,a)>0)return!0;i+=r,s+=a}if(i/=t.length,s/=t.length,e.metresAt(i,s)>0)return!0;const o=Math.max(1,Math.floor(t.length/8));for(let r=0;r<t.length;r+=o){const[a,l]=t[r];if(e.metresAt((a+i)/2,(l+s)/2)>0)return!0}return!1}update(t,e,i,s=1,o=1e3){const a=(.75+.75*jr(Math.log(2e4),Math.log(150),Math.log(Math.max(1,o))))*i,l={big:1,mid:jr(Xh[0],Xh[1],o),small:jr(qh[0],qh[1],o)};for(const[c,h]of Object.entries(this.sets))h.uniforms.uWidth.value=c==="big"?a:a*.85,h.update(t,e,s*l[c]);this.fills&&(this.fills.visible=!0)}dispose(){for(const t of Object.values(this.sets))t.dispose();this.fills&&(this.fills.geometry.dispose(),this.fillMaterial.dispose())}}const _s=10;function Xr(n,t,e){const i=[],s=([o,r])=>o>=e.x0&&o<=e.x1&&r>=e.z0&&r<=e.z1;for(const o of n){let r=[];for(const a of o){const l=t.toWorld(a);s(l)?r.push(l):(r.length>1&&i.push(r),r=[])}r.length>1&&i.push(r)}return i}const Yh=(n,t,e,i=1)=>Array.from({length:Math.round((e-t)/i)+1},(s,o)=>[n,t+o*i]),Zh=(n,t,e,i=1)=>Array.from({length:Math.round((e-t)/i)+1},(s,o)=>[t+o*i,n]);class jy{constructor(t,e,i){const s=Math.round((t.lon0-110)/_s)*_s,o=Math.round((t.lon0+110)/_s)*_s,r=[];for(let l=s;l<=o;l+=_s)Math.abs(l-180)>1e-6&&r.push(Yh(l,-80,80));for(let l=-70;l<=70;l+=_s)l!==0&&r.push(Zh(l,s-20,o+20));const a={world:!0,maxSeg:120,lift:[.02,.0022],height:300};this.grid=new Wi(Xr(r,t,e),null,i,{...a,color:[.62,.72,.82],width:1,order:2}),this.equator=new Wi(Xr([Zh(0,s-20,o+20)],t,e),null,i,{...a,color:[.82,.88,.94],width:1.2,order:2}),this.dateLine=new Wi(Xr([Yh(180,-80,80)],t,e),null,i,{...a,color:[1.25,1.08,.82],width:1.3,order:2,dash:[60,.55]}),this.sets=[this.grid,this.equator,this.dateLine],this.group=new sn,this.group.name="graticule";for(const l of this.sets)this.group.add(l.group)}update(t,e,i,s=1,o=1e3){this.grid.uniforms.uWidth.value=1*i,this.equator.uniforms.uWidth.value=1.2*i,this.dateLine.uniforms.uWidth.value=1.3*i,this.dateLine.setDash(o*.014);const r=Math.max(0,Math.min(1,Math.log(14e3/Math.max(1,o))/Math.log(7)));this.grid.update(t,e,(.065+.075*r*r*(3-2*r))*s),this.equator.update(t,e,.3*s),this.dateLine.update(t,e,.5*s)}dispose(){for(const t of this.sets)t.dispose()}}const Nn=(n,t=document)=>t.querySelector(n),Ge=(n,t={},e="")=>{const i=document.createElement(n);for(const[s,o]of Object.entries(t))s==="class"?i.className=o:s.startsWith("on")?i.addEventListener(s.slice(2),o):i.setAttribute(s,o);return e&&(i.innerHTML=e),i},Xy={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ut=n=>String(n??"").replace(/[&<>"']/g,t=>Xy[t]),qy={1:1/0,2:9e3,3:3200,4:1e3},Ky=90,ga=3;class Yy{constructor(t,e=[],i=document.body){var s,o;this.table=t,this.proj=t.data.proj,this.layer=document.createElement("div"),this.layer.className="labels",this.layer.setAttribute("aria-hidden","true"),i.appendChild(this.layer),this.items=[];for(const r of e)!Array.isArray(r.lonlat)||!r.text||this.add({...r,along:r.kind==="line"?Zy(r.lonlat,this.proj.lon0):null});this._v=new j,this._w=new j,this.shown=0,this.opacity=1,this.driven=!1,(o=(s=document.fonts)==null?void 0:s.ready)==null||o.then(()=>this.measure())}add(t){const e=document.createElement("div");e.className=`label k-${t.kind||"island"} r-${t.rank||3}`,e.innerHTML=`<span class="lb-t">${ut(t.text)}</span>${t.ja?`<span class="lb-ja" lang="ja">${ut(t.ja)}</span>`:""}`,this.layer.appendChild(e);const i=t.xz||this.proj.toWorld(t.lonlat),s={l:t,el:e,x:i[0],z:i[1],rank:t.rank||3,kind:t.kind||"island",k:1,w:0,h:0,shown:!1,tx:NaN,ty:NaN,ta:NaN,along:t.along?t.along.map(o=>this.proj.toWorld(o)):null};return s.dot=s.kind==="base"||s.kind==="city",s.above=s.kind==="island",this.items.push(s),this.items.sort((o,r)=>o.rank-r.rank),s.measured=!1,s}remove(t){t.el.remove(),this.items=this.items.filter(e=>e!==t)}measure(){for(const t of this.items)t.w=t.el.offsetWidth,t.h=t.el.offsetHeight,t.measured=!0}update(t=[],e=1){const i=this.table,s=i.camera,o=i.rig.state.distance,r=innerWidth,a=innerHeight;e!==this.opacity&&(this.opacity=e,this.layer.style.opacity=e.toFixed(3));const l=t.slice(),c=this._v;let h=0;for(const u of this.items){u.measured||(u.w=u.el.offsetWidth,u.h=u.el.offsetHeight,u.measured=!0);let f=e>.02&&u.k>.02&&o<qy[u.rank]&&h<Ky,d=0,g=0,x=0;if(f){const S=u.kind==="sea"||u.kind==="strait"||u.kind==="line"?0:i.ground.heightAt(u.x,u.z);c.set(u.x,S,u.z).project(s),d=(c.x+1)/2*r,g=(1-c.y)/2*a,f=c.z<1&&d>-40&&d<r+40&&g>60&&g<a+20}if(f&&u.along){const[S,T]=u.along,A=this._w.set(S[0],0,S[1]).project(s),k=A.x,_=A.y,w=this._w.set(T[0],0,T[1]).project(s);x=Math.atan2(-(w.y-_)*a,(w.x-k)*r),x>Math.PI/2&&(x-=Math.PI),x<-Math.PI/2&&(x+=Math.PI)}let m=null;if(f){const S=Math.abs(Math.cos(x)),T=Math.abs(Math.sin(x)),A=u.w*S+u.h*T,k=u.w*T+u.h*S,_=u.dot?d+u.w/2-4:d,w=u.above?g-k/2-6:g;m=[_-A/2-ga,w-k/2-ga,_+A/2+ga,w+k/2+ga];for(const C of l)if(m[0]<C[2]&&m[2]>C[0]&&m[1]<C[3]&&m[3]>C[1]){f=!1;break}}if(f!==u.shown&&(u.shown=f,u.el.classList.toggle("show",f)),!f)continue;l.push(m),h++;const p=Math.round(d),y=Math.round(g),v=Math.round(x*180/Math.PI);(p!==u.tx||y!==u.ty||v!==u.ta)&&(u.tx=p,u.ty=y,u.ta=v,u.el.style.transform=u.dot?`translate(${p-4}px, ${y}px) translateY(-50%)`:u.above?`translate(${p}px, ${y-6}px) translate(-50%, -100%)`:`translate(${p}px, ${y}px)${v?` rotate(${v}deg)`:""} translate(-50%, -50%)`);const M=u.k.toFixed(2);M!==u.o&&(u.o=M,u.el.style.setProperty("--k",M))}return this.shown=h,l}visible(){return this.items.filter(t=>t.shown).map(t=>t.l.text)}dispose(){this.layer.remove()}}function Zy([n,t],e){return Math.abs(t)<.01?[[n-1,0],[n+1,0]]:Math.abs(ii(n,180)-180)<.01?[[n,t-1],[n,t+1]]:null}const Jy=`
${un}
${Wn}
${No}
${ln}
in vec3 aSample;   // xz: where to read the ground (just inside the pack); z of the attribute: 1 on the wall's foot
out float vWall;
void main() {
  vec3 p = position;
  if (aSample.z > 0.5) p.y = min(groundMetres(aSample.xy), 0.0) * uVert;
  vWall = aSample.z > -0.5 ? 1.0 : 0.0;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  ${Ze}
}
`,Qy=`
${cn}
uniform vec3 uFrame;
uniform vec3 uWall;
uniform vec3 uSkyColor;
uniform vec3 uSunColor;
in float vWall;
void main() {
  ${hn}
  vec3 light = uSkyColor * 1.2 + uSunColor * 0.25;
  gl_FragColor = vec4(mix(uFrame, uWall, vWall) * light, 1.0);
}
`;function tM(n,t,e=64){const i=[],s=[],o=[],r=(x,m,p,y)=>o.push(x,m,p,x,p,y),a=n.x0-t,l=n.x1+t,c=n.z0-t,h=n.z1+t,u=[[a,c,n.x0,n.z0],[l,c,n.x1,n.z0],[l,h,n.x1,n.z1],[a,h,n.x0,n.z1]];for(let x=0;x<4;x++){const[m,p,y,v]=u[x],[M,S,T,A]=u[(x+1)%4],k=i.length/3;i.push(m,0,p,M,0,S,T,0,A,y,0,v);for(let _=0;_<4;_++)s.push(0,0,-1);r(k,k+1,k+2,k+3)}const f=Math.min(n.x1-n.x0,n.z1-n.z0)*.001,d=[[n.x0,n.z0,n.x1,n.z0,0,f],[n.x1,n.z0,n.x1,n.z1,-f,0],[n.x1,n.z1,n.x0,n.z1,0,-f],[n.x0,n.z1,n.x0,n.z0,f,0]];for(const[x,m,p,y,v,M]of d){const S=i.length/3;for(let T=0;T<=e;T++){const A=T/e,k=x+(p-x)*A,_=m+(y-m)*A;i.push(k,0,_,k,0,_),s.push(k+v,_+M,0,k+v,_+M,1)}for(let T=0;T<e;T++)r(S+2*T,S+2*T+2,S+2*T+3,S+2*T+1)}const g=new Oe;return g.setAttribute("position",new we(i,3)),g.setAttribute("aSample",new we(s,3)),g.setIndex(o),g}class eM{constructor(t,e){this.app=t,this.data=e,this.name="table",this.scene=new Uo,this.group=new sn,this.scene.add(this.group),this.camera=new dn(42,1,Re.near,Re.far),this.frontUniforms=Sy(e.table.rect),this.ground=new Iy(t,e.table,e.proj,this.frontUniforms),this.group.add(this.ground.group),this.uniforms={...t.light.uniforms,...this.ground.uniforms};const i=this.ground.bounds;this.trayMaterial=new xe({vertexShader:Jy,fragmentShader:Qy,uniforms:{...this.uniforms,uFrame:{value:new Zt(.016,.026,.038)},uWall:{value:new Zt(.05,.075,.1)}},side:fn}),this.tray=new ge(tM(i,Math.max(i.x1-i.x0,i.z1-i.z0)*1.5),this.trayMaterial),this.tray.frustumCulled=!1,this.group.add(this.tray),this.coast=e.coast?new Wy(e.coast,e.proj,this.uniforms,this.ground):null,this.coast&&this.group.add(this.coast.group),this.graticule=new jy(e.proj,i,this.uniforms),this.group.add(this.graticule.group),this.labels=new Yy(this,e.labels),this.front=new Ly(this,e,this.frontUniforms,this.labels),this.group.add(this.front.group),this.routes=new fy({routes:e.routes,proj:e.proj,uniforms:this.uniforms,camera:this.camera,renderer:t.renderer,maxSeg:15,lift:[.03,.0024],height:300}),this.group.add(this.routes.group),this.rig=new Ud(this.camera,t.canvas,this.ground,Re),this.outlines=new Map,this.fade=1,this.fadeOverride=null,this.focus=null,this._res=new qt}get skyPlace(){return{lat:Ps.lat,lon:Ps.lon}}skyInstant(){return Ps.utc}fog(){const t=this.rig.state.distance;return{density:.09/Math.max(3,t),falloff:2/Math.max(3,t)}}handover(t){var s;let e=1,i=Re.exag.near;for(const[o,r]of this.outlines){if(!r.on)continue;r.handover===void 0&&(r.handover=this.outlineView(o).distance,r.exaggeration=((s=this.data.boxById.get(o))==null?void 0:s.exaggeration)??Re.exag.near);const a=r.handover,l=Math.max(0,Math.min(1,Math.log(t/(a*1.12))/Math.log(3.2/1.12)));e=Math.min(e,l*l*(3-2*l)),i=r.exaggeration}return{fade:e,near:i}}update(t){var c;const e=performance.now(),i=this._wall===void 0?t:Math.min(1,(e-this._wall)/1e3);this._wall=e,this.app.software&&(t=Math.max(t,i)),this.rig.update(t);const s=this.rig.state.distance,o=this.handover(s);this.fade=typeof this.fadeOverride=="number"?this.fadeOverride:o.fade,this.ground.update(this.camera,s,{exag:Re.exaggeration(s,o.near)});const r=this.app.renderer;r.getDrawingBufferSize(this._res);const a=r.getPixelRatio();(c=this.coast)==null||c.update(this.camera,this._res,a,Math.max(this.fade,.6),s),this.graticule.update(this.camera,this._res,a,this.fade,s);const l=this.app.clock;this.front.update(l.date,s,{camera:this.camera,resolution:this._res,dpr:a,fade:this.fade}),this.labels.driven||this.labels.update([],this.fade),this.routes.update(l.date,s,{window:l.windowAt(),fade:this.fade,focus:this.focus});for(const h of this.outlines.values())h.lines.uniforms.uWidth.value=2.2*a,h.lines.update(this.camera,this._res,h.on?.95:0)}settle(){const t=this.rig;t.finishFlight();const e=t.goal;for(const a of[t.goal,t.state])a.target.copy(e.target),a.distance=e.distance,a.yaw=e.yaw,a.pitch=e.pitch;const i=this.handover(e.distance);this.fade=typeof this.fadeOverride=="number"?this.fadeOverride:i.fade;const s=Re.exaggeration(e.distance,i.near);this.ground.update(this.camera,e.distance,{exag:s}),t.jump({x:e.target.x,z:e.target.z}),this.ground.update(this.camera,e.distance,{exag:s});const o=this.app.clock,r=this.app.renderer;r.getDrawingBufferSize(this._res),this.front.update(o.date,e.distance,{camera:this.camera,resolution:this._res,dpr:r.getPixelRatio(),fade:this.fade,ease:1}),this.routes.settle(o.date,e.distance,{window:o.windowAt(),fade:this.fade,focus:this.focus})}flyTo(t,{duration:e=2.5,ready:i}={}){return new Promise(s=>this.rig.flyTo(t,e,{ready:i,onDone:s}))}outlineView(t){const e=this.data.boxById.get(t);if(!e)throw new Error(`no box “${t}”`);const i=e.placement,s=e.pack.rect,o=Math.hypot(s.x1-s.x0,s.z1-s.z0)*i.scale,r=Re.handoverK*o,[a,l]=i.centre;return{target:{x:a,y:0,z:l},distance:r,yaw:-i.alpha,pitch:this.rig.pitchFor(r)}}outline(t,e=!0){let i=this.outlines.get(t);if(!i&&e){const s=this.data.boxById.get(t);if(!s)throw new Error(`no box “${t}”`);const o=s.pack.rect,r=s.placement,a=[[o.x0,o.z0],[o.x1,o.z0],[o.x1,o.z1],[o.x0,o.z1],[o.x0,o.z0]].map(c=>r.toTable(c)),l=new Wi([a],null,this.uniforms,{world:!0,color:[1.6,1.25,.7],width:2.2,order:5,maxSeg:10,lift:[.05,.003],height:300});i={lines:l,on:e},this.outlines.set(t,i),this.group.add(l.group)}return i&&(i.on=e),i}setFocus(t){this.focus=t?{id:t.id,routes:t.routes||[]}:null}setRange(t){this.ground.setRange(t)}stats(){return{scene:"table",...this.ground.stats(),distance:+this.rig.state.distance.toFixed(1),fade:+this.fade.toFixed(3),labels:this.labels.shown,front:this.front.stats()}}dispose(){var t;this.rig.dispose(),this.ground.dispose(),(t=this.coast)==null||t.dispose(),this.graticule.dispose(),this.front.dispose(),this.labels.dispose(),this.routes.dispose();for(const e of this.outlines.values())e.lines.dispose();this.tray.geometry.dispose(),this.trayMaterial.dispose()}}const xt={step:1/60,maxSteps:8,threat:{aircraftM:8e3,salvoNearM:1e3,torpedoNearM:3e3,ownSalvoLastS:5,shipNearM:5e3},ship:{effPower:.6,addedMass:1.05,rudderMaxDeg:35,nomotoTK:3,radiusK:.45,turnSpeedLoss:.32,telegraphSteps:[-.6,0,1/3,2/3,.85,1,1.05]},air:{eta:.8,stallNoseDeg:-20,stallNoseRateDegS:30,stallRollAuthority:.3,stallRecover:1.15,rollLagS:.12,breakAfterS:3,blackout:{narrowG:4.5,narrowS:2,darkG:6,darkS:3,backG:3,backS:3},gunConvergenceM:250,instructorGain:6,maxCLFrac:.9,fuelFlowK:1},aa:{era:{"us-1941":.5,"us-1942":.85,"us-1943":.95,"us-1944":1,"jp-1941":.6,"jp-1942":.6,"jp-1943":.6,"jp-1944":.65},fullWithin:.3,aspect:{dive:.8,headOn:.8,crossing:1,torpedo:1.1},alertRampS:60,hitsPerKill:2.5,burstDamage:{light:.3,medium:.6,heavy:.8},directS:5,bearingShare:.5},group:{baseRate:{dive:{cv:.3,cvl:.3,cve:.3,bb:.25,ca:.2,cl:.2,dd:.15,de:.15,default:.2},torpedo:.15,level:.02,strafe:0,default:.1},minShare:.25},aiGun:{startRangePct:2.5,startMils:3,improve:.3,floorRangePct:1,floorMils:1.5,resetTurnDeg:20,resetSpeedKn:5,resetShare:.5,spotNightRadar:!1,leadLagS:60,turretShare:.87,blindFactor:2.2,turnPenalty:4},aiEvade:{maxTurnDeg:30,maxSpeedKn:5,returnS:180,towardShare:.5},aiDive:{cepVeteranM:25},aiTorpedo:{leadErrDeg:3},cap:{reactionS:[.6,1],leadMils:[2,4],maxG:[5,6],burstS:[1,2],fireRangeM:300,leadTolDeg:1,engageRadiusM:12e3},torpedo:{failDefault:.1,spreadNarrowDeg:1,spreadWideDeg:3},damage:{fireFight:5e-4,fireZoneCap:.06,fireSpread:{carrier:1/120,other:1/1800},fireOut:{"us-1942":1/600,"jp-1942":1/900,"us-1944":1/400,"jp-1944":1/900,"us-1941":1/700,default:1/800},holeFlood:2e-5,holePatch:{us:1/1200,jp:1/2400},progressiveFlood:1.5,holeList:.0025,counterflood:{us:1/60,jp:.5/60},dcFloor:.15,capsizeListDeg:35,abandonListDeg:20,founderS:[180,600],doomedFires:3,doomedH:.4,sinkAfterDoomedS:{carrier:[4*3600,9*3600],other:[1800,4*3600]},magazineChance:.01,crippledSpeed:.5,bowLostKn:12,engineRepairS:[3e3,5400],systemRepairS:[300,1200],aircraftFireChance:{none:.15,"self-sealing":.03},aircraftFireBurnS:[8,25]},sight:{dayM:4e4,nightUnlitBigM:8e3,nightUnlitSmallM:4500,nightLitM:16e3,radar:{sg:17e3,sc:25e3,fc:18e3,type22:12e3},flashRevealS:8,smokeRadiusM:400,squallVisM:2500},spares:64,projectileCap:4096,effectsCap:2048},nM=(n,t)=>`${n==="jp"?"jp":"us"}-${Math.max(1941,Math.min(1944,t))}`;function Jh(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619)>>>0;return t^=t>>>16,t=Math.imul(t,2246822507)>>>0,t^=t>>>13,t>>>0}function iM(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Od(n){const t=typeof n=="number"?n>>>0:Jh(String(n)),e=iM(t);let i=null;return{seed:t,next:e,gauss(){if(i!==null){const l=i;return i=null,l}let o=0;for(;o===0;)o=e();const r=e(),a=Math.sqrt(-2*Math.log(o));return i=a*Math.sin(2*Math.PI*r),a*Math.cos(2*Math.PI*r)},uniform(o,r){return o+(r-o)*e()},range(o){if(Array.isArray(o)){const r=Math.min(o[0],o[1]??o[0]),a=Math.max(o[0],o[1]??o[0]);return r+Math.floor(e()*(a-r+1))}return Number.isFinite(o)?o:0},chance(o){return e()<o},pick(o){return o[Math.floor(e()*o.length)]},fork(o){return Od(Jh(`${t}:${o}`))},poisson(o){if(o<=0)return 0;const r=Math.exp(-o);let a=0,l=1;do a++,l*=e();while(l>r&&a<50);return a-1}}}const Qh=-4e3;function sM(n){if(!n||!n.metres)return{metresAt:()=>Qh,heightAt:()=>0,exaggeration:1,lineOfSight:()=>!0,rect:null};const{metres:t,W:e,H:i,rect:s}=n,o=n.exaggeration??1,r=e/(s.x1-s.x0),a=i/(s.z1-s.z0);function l(u,f){if(u<s.x0||f<s.z0||u>s.x1||f>s.z1)return Qh;let d=(u-s.x0)*r-.5,g=(f-s.z0)*a-.5;d<0?d=0:d>e-1.001&&(d=e-1.001),g<0?g=0:g>i-1.001&&(g=i-1.001);const x=d|0,m=g|0,p=d-x,y=g-m,v=m*e+x,M=t[v]+(t[v+1]-t[v])*p,S=t[v+e]+(t[v+e+1]-t[v+e])*p;return M+(S-M)*y}const c=(u,f)=>Math.max(0,l(u,f))*o;function h(u,f,d=150){const g=Math.hypot(f.x-u.x,f.z-u.z),x=Math.max(2,Math.min(200,Math.ceil(g/d)));for(let m=1;m<x;m++){const p=m/x,y=u.x+(f.x-u.x)*p,v=u.z+(f.z-u.z)*p,M=u.y+(f.y-u.y)*p;if(c(y,v)>M)return!1}return!0}return{metresAt:l,heightAt:c,exaggeration:o,lineOfSight:h,rect:s}}const Jl=1/60;function oM(n){let t,e;return n<11e3?(t=288.15-.0065*n,e=101325*Math.pow(t/288.15,5.2559)):(t=216.65,e=22632*Math.exp(-(n-11e3)/6341.6)),[e/(287.05*t),Math.sqrt(1.4*287.05*t)]}const so=[[0,.12],[.7,.12],[.85,.128],[.95,.17],[1,.25],[1.05,.3],[1.1,.315],[1.2,.31],[1.5,.285],[2,.25],[2.5,.225],[3,.205],[4,.185]];function aM(n){for(let t=0;t+1<so.length;t++){const[e,i]=so[t],[s,o]=so[t+1];if(n<=s)return i+(o-i)*(n-e)/(s-e)}return so[so.length-1][1]}function tu(n,t,e){const[i,s]=oM(Math.max(0,t));return .5*i*aM(n/s)*e.area*e.i/e.mass}function Ql(n,t=n.formFactor??1.3){const e=n.calibreMm/1e3;return{mass:n.shellKg,area:Math.PI*(e/2)*(e/2),i:t,mv:n.mvMs}}function Bd(n,t,e=Jl){const i=Math.hypot(n.vx,n.vy,n.vz)||1e-9,s=tu(i,n.y,t),o=-s*i*n.vx,r=-9.80665-s*i*n.vy,a=-s*i*n.vz,l=n.vx+o*e*.5,c=n.vy+r*e*.5,h=n.vz+a*e*.5,u=n.y+n.vy*e*.5,f=Math.hypot(l,c,h)||1e-9,d=tu(f,u,t);n.x+=l*e,n.y+=c*e,n.z+=h*e,n.vx+=-d*f*l*e,n.vy+=(-9.80665-d*f*c)*e,n.vz+=-d*f*h*e}function Hd(n,t,{h0:e=0,dt:i=Jl,maxT:s=200}={}){const o=t*Math.PI/180,r={x:0,y:e,z:0,vx:n.mv*Math.cos(o),vy:n.mv*Math.sin(o),vz:0};let a=0;for(;;){const l=r.x,c=r.y;if(Bd(r,n,i),a+=i,r.y<0&&r.vy<0){const h=c/(c-r.y);return{range:l+(r.x-l)*h,tof:a-i+h*i,strike:Math.hypot(r.vx,r.vy),fall:Math.atan2(-r.vy,r.vx)*180/Math.PI}}if(a>s)return{range:r.x,tof:a,strike:Math.hypot(r.vx,r.vy),fall:0}}}function rM(n,{dt:t=.02}={}){let e=.2,i=3;for(let s=0;s<40;s++){const o=(e+i)/2;Hd(Ql(n,o),n.maxRangeElevDeg??45,{dt:t}).range>n.maxRangeM?e=o:i=o}return(e+i)/2}function lM(n,{maxElevDeg:t=45,h0:e=10,stepDeg:i=.25,formFactor:s,dt:o=Jl}={}){const r=Ql(n,s),a=[];let l=-1;for(let c=0;c<=t+1e-9;c+=i){const h=Hd(r,c,{h0:e,dt:o});if(h.range<=l)break;l=h.range,a.push({elev:c,range:h.range,tof:h.tof,strike:h.strike,fall:h.fall})}return{weapon:n.id,h0:e,rows:a,maxRange:l,shell:r}}function _i(n,t){const e=n.rows;if(!e.length||t>n.maxRange)return null;if(t<=e[0].range){const l=e[0],c=e[1]||l,h=(c.range-l.range)/Math.max(1e-6,c.elev-l.elev);return{elev:l.elev+(t-l.range)/Math.max(1e-6,h),tof:l.tof*t/Math.max(1,l.range),fall:l.fall,strike:l.strike,dRdE:h}}let i=0,s=e.length-1;for(;s-i>1;){const l=i+s>>1;e[l].range<t?i=l:s=l}const o=e[i],r=e[s],a=(t-o.range)/Math.max(1e-9,r.range-o.range);return{elev:o.elev+(r.elev-o.elev)*a,tof:o.tof+(r.tof-o.tof)*a,fall:o.fall+(r.fall-o.fall)*a,strike:o.strike+(r.strike-o.strike)*a,dRdE:(r.range-o.range)/Math.max(1e-6,r.elev-o.elev)}}const cM=["hull-extension","flight-deck","island","bridge","pagoda","tower","cage-mast","tripod-mast","pole-mast","funnel","turret","casemate","hangar","deckhouse","crane","catapult","boat-deck","director"],hM={funnel:["round","trunked","downturned","raked"],turret:["twin","triple","single"],pagoda:["tall","short"]},eu=["straight","clipper","raked"],nu=["cruiser","transom","round"],uM=["port","starboard","both","centre"],ji=(n,t,e)=>Math.max(t,Math.min(e,n));function dM(n){const t=n.hull||{};if(!eu.includes(t.bow))throw new Error(`kit ${n.id}: hull.bow “${t.bow}” is not one of ${eu.join(", ")}`);if(!nu.includes(t.stern))throw new Error(`kit ${n.id}: hull.stern “${t.stern}” is not one of ${nu.join(", ")}`);for(const[e,i]of(n.blocks||[]).entries()){if(!cM.includes(i.kind))throw new Error(`kit ${n.id}: block ${e} kind “${i.kind}” is not in the vocabulary`);const s=hM[i.kind];if(i.shape!=null&&(!s||!s.includes(i.shape)))throw new Error(`kit ${n.id}: block ${e} (${i.kind}) shape “${i.shape}” is not one of ${s?s.join(", "):"none"}`);if(i.side!=null&&!uM.includes(i.side))throw new Error(`kit ${n.id}: block ${e} side “${i.side}”`);if(!(Array.isArray(i.at)?i.at:[i.at]).every(r=>Number.isFinite(r)&&r>=-.05&&r<=1.05))throw new Error(`kit ${n.id}: block ${e} at ${JSON.stringify(i.at)}`)}}const oi=n=>Array.isArray(n.at)?[Math.min(n.at[0],n.at[1]),Math.max(n.at[0],n.at[1])]:[n.at,n.at],Xi=n=>{const[t,e]=oi(n);return(t+e)/2},qi=(n,t)=>(t-.5)*n.loa,fM=n=>{var i;const t=(i=n.hull)==null?void 0:i.freeboard;if(Array.isArray(t)&&t.length===2)return t;const e=n.draught||5;return[e*.9,e*.6]};function Lo(n,t){var r;const[e,i]=fM(n),s=1+3*ji(((r=n.hull)==null?void 0:r.sheer)??.3,0,1),o=1-ji(t,0,1);return i+(e-i)*Math.pow(o,s)}function _n(n,t){let e=Lo(n,t);for(const i of n.blocks||[]){if(i.kind!=="hull-extension")continue;const[s,o]=oi(i);t>=s-1e-6&&t<=o+1e-6&&(e=Math.max(e,Lo(n,t)+(i.h??2.4)))}return e}function $n(n,t){var a;const e=n.beam/2;if(n.type==="ss-midget"||n.type==="ss"){const l=ji(t,0,1);return e*Math.sqrt(Math.max(0,1-Math.pow(2*l-1,2)))*1.05}const i=n.type==="dd"||n.type==="de"?.24:n.type==="bb"?.2:.22;let s=1;t<i&&(s=Math.pow(Math.sin(Math.PI/2*ji(t/i,0,1)),.75));const o=((a=n.hull)==null?void 0:a.stern)||"cruiser",r=.78;if(t>r){const l=ji((t-r)/(1-r),0,1);s*=o==="transom"?1-.28*l*l:o==="round"?1-.85*Math.pow(l,1.6):1-.62*Math.pow(l,1.8)}return e*Math.max(.02,s)}function pM(n,t){for(const e of n.blocks||[]){if(e.kind!=="flight-deck")continue;const[i,s]=oi(e);if(t>=i-.02&&t<=s+.02)return{top:(e.y??0)+(e.h??1.2),w:e.w,from:i,to:s,block:e}}return null}function mM(n){const t=n.type;return t==="bb"?{bridge:18,tower:22,tripod:30,cage:34,pole:24,funnel:16,crane:9,house:3}:t==="cv"||t==="cvl"||t==="cve"?{bridge:10,tower:10,tripod:14,cage:14,pole:12,funnel:7,crane:7,house:3}:t==="ca"||t==="cl"?{bridge:14,tower:14,tripod:24,cage:24,pole:22,funnel:12,crane:8,house:2.6}:t==="dd"||t==="de"?{bridge:7,tower:6,tripod:14,cage:14,pole:14,funnel:6,crane:5,house:2.4}:t==="ss-midget"||t==="ss"?{bridge:1.2,tower:1.2,tripod:3,cage:3,pole:3,funnel:1,crane:1,house:.8}:{bridge:9,tower:9,tripod:18,cage:18,pole:18,funnel:10,crane:7,house:3}}function Gd(n,t){const e=t>=3?1.35:t===2?1.05:.75,i=2+n*.02*e;return{w:i,l:i*1.25,h:Math.max(1.8,i*.3)}}function ko(n,t,e=null){const i=mM(n),s=n.beam,o=n.loa,[r,a]=oi(t),l=Math.max(0,a-r)*o,c={w:t.w,l:t.l,h:t.h},h=(u,f,d)=>{c.w==null&&(c.w=u),c.l==null&&(c.l=f),c.h==null&&(c.h=d)};switch(t.kind){case"turret":{const u=e||{calibreMm:n.type==="bb"?356:n.type==="dd"?127:152,barrels:t.shape==="triple"?3:t.shape==="single"?1:2},f=Gd(u.calibreMm,u.barrels);h(f.w,f.l,f.h);break}case"bridge":h(s*.6,l||o*.05,i.bridge);break;case"pagoda":h(s*.36,l||o*.05,t.shape==="tall"?i.tower*1.9:i.tower*1.5);break;case"tower":h(s*.3,l||o*.05,i.tower);break;case"tripod-mast":h(s*.18,l||s*.18,i.tripod);break;case"cage-mast":h(s*.24,l||s*.24,i.cage);break;case"pole-mast":h(.6,.6,i.pole);break;case"funnel":Po(n)!=null&&t.side&&t.side!=="centre"&&t.shape!=="downturned"&&!(n.blocks||[]).some(u=>u.kind==="island"&&u.side===t.side&&Math.abs(Xi(u)-Xi(t))<.08)&&h(s*.12,s*.12,Math.max(4,Po(n)-_n(n,Xi(t))+1.5)),t.shape==="downturned"?h(s*.14,l||o*.03,i.funnel):h(s*(t.shape==="trunked"?.27:.22),l||s*(t.shape==="trunked"?.34:.26),i.funnel);break;case"island":h(Math.max(4,s*.2),l||o*.06,10);break;case"flight-deck":h(s,l||o*.95,1.2);break;case"hangar":h(s*.85,l||o*.8,6);break;case"casemate":h(1.6,l||o*.3,2.6);break;case"deckhouse":h(s*.45,l||o*.05,i.house);break;case"crane":h(1.2,1.2,i.crane);break;case"catapult":h(1.4,l||19,1.2);break;case"boat-deck":h(s*.7,l||o*.1,1.2);break;case"director":h(n.type==="bb"?4:2.6,n.type==="bb"?4:2.6,n.type==="bb"?3:2.2);break;case"hull-extension":h(s,l||o*.3,2.4);break;default:throw new Error(`kit ${n.id}: block kind “${t.kind}” has no default size`)}return c}const gM=new Set(["bridge","pagoda","tower","island","tripod-mast","cage-mast","deckhouse","hangar"]);function er(n,t,e=null){const i=Xi(t),s=_n(n,i);if(t.y!=null)return t.y;const r=pM(n,i)?Po(n):null;switch(t.kind){case"flight-deck":return s+6-(t.h??1.2);case"island":case"tower":case"tripod-mast":case"pole-mast":case"cage-mast":case"crane":return r??s;case"funnel":return t.shape==="downturned"?s+.5:r==null?s:(n.blocks||[]).find(l=>l.kind==="island"&&(l.side===t.side||!t.side)&&Math.abs(Xi(l)-i)<.08)?r:s;case"casemate":return s-((e==null?void 0:e.h)??t.h??2.6)-.6;case"turret":return t.sf?s+Math.max(2.2,((e==null?void 0:e.h)??t.h??3)+.8):s;case"director":{let a=s;for(const l of n.blocks||[]){if(l===t||!gM.has(l.kind))continue;const[c,h]=oi(l);if(i<c-.025||i>h+.025||l.kind==="tripod-mast"||l.kind==="cage-mast")continue;const u=ko(n,l);a=Math.max(a,er(n,l,u)+u.h)}return a}case"catapult":return s+1.5;default:return s}}function Po(n){const t=(n.blocks||[]).find(e=>e.kind==="flight-deck");return t&&t.y!=null?t.y+(t.h??1.2):null}function vM(n){let t=Math.max(...[.02,.5,.98].map(e=>_n(n,e)));for(const e of n.blocks||[]){const i=ko(n,e);t=Math.max(t,er(n,e,i)+i.h)}return t}const Ne=.514444,Aa=1/3.6,Ht=Math.PI/180,Ye=9.80665,Ji=n=>{const t=288.15-.0065*Math.min(11e3,Math.max(-500,n));return 101325*Math.pow(t/288.15,5.2559)/(287.05*t)},xM=Ji(0),zs=(n,t)=>{const e=((n[1]-n[0])%360+360)%360;return((t-n[0])%360+360)%360<=e},Ba=n=>n==null?null:typeof n=="number"?n:Date.parse(String(n).length<=7?`${n}-01T00:00Z`:String(n).length<=10?`${n}T00:00Z`:n),$d=(n,t,e)=>n>=Ba(t)&&n<Ba(e),iu=new Map,su=new Map;function yM(n,t=10,e=45){const i=`${n.id}:${Math.round(t)}:${Math.round(e)}`;let s=iu.get(i);return s||(s=lM(n,{h0:t,maxElevDeg:Math.min(e,n.maxRangeElevDeg??45),stepDeg:.5,dt:1/30}),iu.set(i,s)),s}function MM(n,t,e,i){if(n.weapon&&t.has(n.weapon))return t.get(n.weapon);n.weapon&&(e==null||e(`kit ${i}: weapon ${n.weapon} is not in weapons.json; using the kit's own numbers`));const s=n.calibreMm??127,o=`inline:${s}:${n.shellKg}:${n.mvMs}:${n.rangeM}`;let r=su.get(o);return r||(r={id:o,kind:"gun",calibreMm:s,shellKg:n.shellKg??Math.max(1,(s/10)**3/40),mvMs:n.mvMs??800,maxRangeM:n.rangeM??s*120,maxRangeElevDeg:45,rofRpm:n.rofRpm??4,dispersion:{rangePct:1.3,mils:2.5},shell:s>=200?"ap":"he"},r.formFactor=rM(r,{dt:.05}),su.set(o,r)),r}const _M={"127mm":["jp-127-t89","us-5-38-mk12"],"25mm":["jp-25-t96"],"28mm":["us-28-1-1in"],"20mm":["us-20-oerlikon"],"40mm":["us-40-bofors"],"50cal":["us-50cal-m2"]};function ou(n,t,e,i){let s=n.weapon&&t.get(n.weapon);if(!s&&n.kind&&(s=(_M[n.kind]||[]).map(a=>t.get(a)).find(Boolean),!s)){const a=parseFloat(n.kind),l=a>=100?24e-5:a>=35?6e-4:a>=20?35e-5:25e-5;s={id:`inline-aa:${n.kind}`,kind:"aa",calibreMm:a,aa:{lambdaBarrel:l,rangeM:a>=100?6500:a>=35?3e3:1800,roundsPerS:1}}}if(!(s!=null&&s.aa))return null;const o=s.aa.vt&&i!=null&&i>=Ba(s.aa.vt.from);return{weapon:s,lambda:o?s.aa.vt.lambdaBarrel:s.aa.lambdaBarrel,rangeM:s.aa.rangeM,heavy:s.calibreMm>=75,cls:s.calibreMm>=75?"heavy":s.calibreMm>=30?"medium":"light"}}function bM(n,t,e,i){var y,v,M,S,T,A,k,_;const s=(n.speedKn||25)*Ne,o=n.displacementFullT??((y=n.displacement)==null?void 0:y.full)??((v=n.displacement)==null?void 0:v.standard)??2e3,r=xt.ship.addedMass*o*1e3;let a=n.shp;if(!a){const w={bb:180,cv:150,cve:270,ca:80,cl:70,dd:38,de:50}[n.type]??120;a=r*s*s/w/(xt.ship.effPower*745.7),i==null||i(`kit ${n.id}: no shp; ${Math.round(a)} assumed from a time constant of ${w} s`)}const l=xt.ship.effPower*a*745.7,c=((M=n.turn)==null?void 0:M.tacticalDiameterM)??(n.type==="bb"?3.15:n.type==="dd"||n.type==="de"?4:3.5)*n.loa,h=((S=n.turn)==null?void 0:S.rudderS)??(["bb","cv","cvl","cve"].includes(n.type)?30:["ca","cl"].includes(n.type)?20:15),u=Po(n),f=vM(n),d=[];for(const[w,C]of(n.guns||[]).entries()){const F=MM(C,t,i,n.id),z=C.side==="both"?["port","starboard"]:[C.side||"centre"],P=C.mounts??C.turrets??C.at.length,B=[];for(const Z of C.at)for(const Y of z){if(B.length>=P)break;const st=$n(n,Z),tt=Y==="starboard"?st*.7:Y==="port"?-st*.7:0;let N=_n(n,Z)+2.5;u!=null&&Y!=="centre"&&(N=Math.max(N,u-2));let K=C.arcDeg?[...C.arcDeg]:Y==="centre"?[210,150]:[20,160];Y==="centre"&&Z>=.5&&zs(K,0)&&!zs(K,180)&&(K=[(K[0]+180)%360,(K[1]+180)%360]),Y==="port"&&(K=[(360-K[1])%360,(360-K[0])%360]),B.push({f:Z,side:Y,x:tt,y:N,z:(Z-.5)*n.loa,arc:K,rest:Z<.5?0:180})}const X=B.length?B.reduce((Z,Y)=>Z+Y.y,0)/B.length:10,J=Math.min(((T=C.elevationDeg)==null?void 0:T[1])??45,F.maxRangeElevDeg??45);d.push({index:w,role:C.role,weapon:F,barrels:C.barrels??1,turrets:C.turrets??0,mounts:B,traverseDegS:C.traverseDegS??(F.calibreMm>=300?3:F.calibreMm>=150?5:15),elevationDeg:C.elevationDeg??[-5,45],reloadS:60/(F.rofRpm||C.rofRpm||2),h0:X,maxElevDeg:J,get table(){return yM(F,X,J)}})}let g=n.aa||[];for(const w of n.aaFits||[])e!=null&&$d(e,w.from,w.to)&&(g=w.aa);const x=[];for(const w of g){const C=ou(w,t,n.side,e);if(!C)continue;const F=(w.mounts??1)*(w.barrels??1);x.push({...C,barrels:F})}for(const w of d){if(!w.weapon.aa||x.some(F=>F.weapon.id===w.weapon.id))continue;const C=ou({weapon:w.weapon.id},t,n.side,e);C&&x.push({...C,barrels:w.mounts.length*w.barrels,dualPurpose:!0})}const m=n.torpedoes?{...n.torpedoes,weapon:t.get(n.torpedoes.weapon)||EM(n.torpedoes)}:null,p=(n.sensors||[]).filter(w=>e==null||e>=Ba(w.from)).map(w=>w.kind);return{kind:"ship",id:n.id,kit:n,type:n.type,side:n.side,L:n.loa,B:n.beam,T:n.draught,top:f,deck:_n(n,.5),fdTop:u,vmax:s,mass:r,shp:a,peff:l,tmax:l/s,tau:r*s*s/l,td:c,radius:xt.ship.radiusK*c,rudderS:h,batteries:d,aa:x,torp:m,belt:((A=n.armour)==null?void 0:A.beltMm)??0,deckMm:((k=n.armour)==null?void 0:k.deckMm)??0,crippledAt:n.crippledAt??.5,fatal:n.fatal??1,systems:n.systems||["rudder","engines","bow"],sensors:p,carrier:["cv","cvl","cve"].includes(n.type),unarmoured:(((_=n.armour)==null?void 0:_.beltMm)??0)<25,dyes:n.dyes||{},hospital:!!n.hospital,tokko:!!n.tokko,half:{x:n.beam/2,z:n.loa/2*.97,yLo:-n.draught,yHi:(u??_n(n,.5))+1},sup:SM(n,u??_n(n,.5),f)}}const wM=new Set(["bridge","pagoda","tower","funnel","island","deckhouse","hangar","cage-mast","tripod-mast","director","boat-deck"]);function SM(n,t,e){let i=1/0,s=-1/0,o=0;for(const a of n.blocks||[]){if(!wM.has(a.kind))continue;const[l,c]=Array.isArray(a.at)?[Math.min(...a.at),Math.max(...a.at)]:[a.at,a.at],h=(a.l??a.w??8)/2;i=Math.min(i,(l-.5)*n.loa-h),s=Math.max(s,(c-.5)*n.loa+h),a.kind==="island"&&(o=a.side==="port"?-1:1)}return Number.isFinite(i)||(i=-.15*n.loa,s=.1*n.loa),{x:o?n.beam*.12:n.beam*.3,z0:i,z1:s,xc:o*n.beam*.38,yLo:t,yHi:t+Math.max(4,(e-t)*.75)}}function EM(n){return/mark|mk/i.test(n.type||"")?{id:"inline-mk15",kind:"torpedo",calibreMm:533,warheadKg:224,settings:[{speedKn:45,rangeM:5500},{speedKn:33.5,rangeM:9150},{speedKn:26.5,rangeM:13700}],armRunM:400,failRate:[]}:{id:"inline-t93",kind:"torpedo",calibreMm:610,warheadKg:490,settings:[{speedKn:49,rangeM:2e4},{speedKn:41,rangeM:32e3}],armRunM:300,failRate:[]}}function TM(n){var d,g,x,m,p;const t=n.wingM2||n.span*n.span/6,e=((d=n.weightKg)==null?void 0:d.loaded)??3e3,i=e*Ye,s=n.span*n.span/t,o=1/(Math.PI*.75*s),a=(((g=n.engine)==null?void 0:g.hp)??1e3)*(((x=n.engine)==null?void 0:x.count)??(n.type==="bomber"||n.type==="patrol"?2:1))*745.7*xt.air.eta,l=(((m=n.speedKmh)==null?void 0:m.max)??450)*Aa,c=((p=n.speedKmh)==null?void 0:p.atAltM)??4e3,h=.5*Ji(c)*l*l,u=i/(h*t),f=Math.max(.012,a/l/(h*t)-o*u*u);return{S:t,m:e,k:o,cd0:f}}function AM(n,t,e,i){var y,v,M,S,T,A,k,_,w,C,F;const s=n.aero||{};let o=n.wingM2,r=s.massKg??((y=n.weightKg)==null?void 0:y.loaded),a=s.cd0,l=s.k;if(a==null||l==null||o==null){const z=TM(n);o=o??z.S,r=r??z.m,a=a??z.cd0,l=l??z.k,n.aero||i==null||i(`kit ${n.id}: no aero block; the polar derived from its top speed`)}const c={fighter:7,dive:6.5,torpedo:4.5,level:3.5,patrol:3,bomber:3}[n.type]??5,h=(((v=n.speedKmh)==null?void 0:v.diveLimit)??600)*Aa;let u=s.rollTable;if(!u){const z=((M=n.handling)==null?void 0:M.rollDegS)??{fighter:70,dive:50,torpedo:40}[n.type]??25;u=[[50,z*.7],[100,z],[160,z*.8]]}const f=((S=n.engine)==null?void 0:S.count)??(n.type==="bomber"||n.type==="patrol"?2:1),d=(((T=n.engine)==null?void 0:T.hp)??1e3)*f*745.7*(s.eta??xt.air.eta);let g=((A=n.torpedo)==null?void 0:A.weapon)??null;for(const z of n.torpedoes||[])e!=null&&$d(e,z.from,z.to)&&(g=z.weapon);const x=g?t.get(g)||null:n.torpedo?{id:"inline-air-torpedo",kind:"torpedo",air:!0,warheadKg:200,speedKn:n.torpedo.type==="mark-13"?30:42,rangeM:2e3,dropSpeedKn:n.torpedo.dropSpeedKn??110,dropAltM:n.torpedo.dropAltM??30,armRunM:n.torpedo.armRunM??200,failRate:[]}:null,m=(n.guns||[]).map(z=>({weapon:z.weapon&&t.get(z.weapon)||{id:`inline-mg:${z.calibreMm}`,kind:z.calibreMm>=20?"cannon":"mg",calibreMm:z.calibreMm??12.7,mvMs:z.calibreMm>=20?650:850,rofRpm:z.calibreMm>=20?500:800,vsAircraft:z.calibreMm>=20?{protected:.25,unprotected:.4}:z.calibreMm>=12?{protected:.06,unprotected:.12}:{protected:.015,unprotected:.03}},count:z.count??1,position:z.position??"nose",rounds:z.rounds??300,fixed:["nose","wing","cowl"].includes(z.position??"nose")})),p=(n.payload||[]).map(z=>({weapon:z.weapon&&t.get(z.weapon)||{id:`inline-bomb:${z.massKg}`,kind:"bomb",massKg:z.massKg??250,class:(z.massKg??250)>=400?"bomb-1000":(z.massKg??250)>=200?"bomb-500":"bomb-100"},count:z.count??1}));return{kind:"aircraft",id:n.id,kit:n,type:n.type,side:n.side,span:n.span,length:n.length,S:o,mass:r,massEmpty:((k=n.weightKg)==null?void 0:k.empty)??r*.7,cd0:a,k:l,clMax:s.clMax??1.45,gLimit:s.gLimit??c,vShake:s.vShakeMs??h*.9,vBreak:s.vBreakMs??h,diveDrag:s.diveDrag??(n.type==="dive"?.12:0),rollTable:u,turnLimit:s.turnLimitDegS?s.turnLimitDegS*Ht:null,P0:d,ratedAlt:((_=n.engine)==null?void 0:_.ratedAltM)??((w=n.speedKmh)==null?void 0:w.atAltM)??4e3,ceiling:n.ceilingM??9e3,vCruise:(((C=n.speedKmh)==null?void 0:C.cruise)??300)*Aa,vMax:(((F=n.speedKmh)==null?void 0:F.max)??450)*Aa,enduranceS:n.enduranceS??1800,protection:n.protection??(n.side==="jp"?"none":"self-sealing"),fatal:n.fatal??1,guns:m,payload:p,torpedo:x,tokko:!!n.tokko,half:{x:n.span/2,y:Math.max(1,(n.height??3)/2),z:n.length/2}}}const Ci=Math.PI/180,Te=n=>[Math.sin(n*Ci),-Math.cos(n*Ci)],_e=(n,t)=>(Math.atan2(n,-t)/Ci+360)%360,Vs=n=>((n+180)%360+360)%360-180,qr=3600;function CM(n,t,e){const i=n.length,s=n[0],o=n[i-1];if(t<=s.t||t>=o.t||i===1){const k=t<=s.t?s:o,_=t-k.t,w=Math.max(-qr,Math.min(qr,_)),C=Math.abs(_)<qr;return e.x=k.x+k.ux*k.speed*w,e.z=k.z+k.uz*k.speed*w,e.vx=C?k.ux*k.speed:0,e.vz=C?k.uz*k.speed:0,e.course=k.course,e}let r=0,a=i-1;for(;a-r>1;){const k=r+a>>1;n[k].t<=t?r=k:a=k}const l=n[r],c=n[a],h=c.t-l.t,u=(t-l.t)/h,f=l.chord,d=u*u,g=d*u,x=2*g-3*d+1,m=g-2*d+u,p=-2*g+3*d,y=g-d;e.x=x*l.x+m*l.ux*f+p*c.x+y*c.ux*f,e.z=x*l.z+m*l.uz*f+p*c.z+y*c.uz*f;const v=6*d-6*u,M=3*d-4*u+1,S=-6*d+6*u,T=3*d-2*u;e.vx=(v*l.x+M*l.ux*f+S*c.x+T*c.ux*f)/h,e.vz=(v*l.z+M*l.uz*f+S*c.z+T*c.uz*f)/h;const A=Vs(c.course-l.course);return e.course=(l.course+A*u+360)%360,e}function RM(n){n.sort((t,e)=>t.t-e.t);for(const t of n){const[e,i]=Te(t.course);t.ux=e,t.uz=i}for(let t=0;t<n.length;t++){const e=n[t+1];n[t].chord=e?Math.hypot(e.x-n[t].x,e.z-n[t].z):0}return n}function LM(n,t,e){const i=n.length;if(t<=n[0].t){const y=n[0];return e.x=y.x,e.y=y.y,e.z=y.z,e}if(t>=n[i-1].t){const y=n[i-1];return e.x=y.x,e.y=y.y,e.z=y.z,e}let s=0,o=i-1;for(;o-s>1;){const y=s+o>>1;n[y].t<=t?s=y:o=y}const r=n[s],a=n[o],l=n[s-1]||null,c=n[o+1]||null,h=a.t-r.t,u=(t-r.t)/h,f=u*u,d=f*u,g=2*d-3*f+1,x=d-2*f+u,m=-2*d+3*f,p=d-f;for(let y=0;y<3;y++){const v=y===0?"x":y===1?"y":"z",M=l&&!r.corner?(a[v]-l[v])/(a.t-l.t):(a[v]-r[v])/h,S=c&&!a.corner?(c[v]-r[v])/(c.t-r.t):(a[v]-r[v])/h;e[v]=g*r[v]+x*M*h+m*a[v]+p*S*h}return e}const fi={x:0,y:0,z:0,vx:0,vz:0,heading:0};function yi(n,t,e,i){if(n.type==="keys")return LM(n.keys,t,e);if(n.type==="orbit"){i(n.centre,t,fi);const s=n.phase+(t-n.t0)*n.w;return e.x=fi.x+Math.cos(s)*n.r,e.z=fi.z+Math.sin(s)*n.r,e.y=n.alt+Math.sin(s*.5+n.phase)*40,e}if(n.type==="follow"){i(n.leader,t,fi);const s=fi.heading*Ci,o=Math.sin(s),r=-Math.cos(s),a=n.off,l=n.weave?Math.sin((t-n.t0)*n.weave+n.phase)*250:0;return e.x=fi.x-r*(a.right+l)-o*a.back,e.z=fi.z+o*(a.right+l)-r*a.back,e.y=Math.max(60,fi.y+a.up),e}throw new Error(`leg type ${n.type}`)}function oo(n){const t=Math.floor(n/3),e=n%3,i=(e===0?0:e===1?-45:45)+(t%2?60:0),s=(e===0?0:35)+t*140,o=t*25*(t%2?-1:1);return{right:i,back:s,up:o}}function ao(n,t,e,i){const s=e*Ci,o=Math.sin(s),r=-Math.cos(s);return[n-r*i.right-o*i.back,t+o*i.right-r*i.back]}function au(n,t,e,i,s,o,r=()=>0){const h=(d,g)=>{const x=1-Math.exp(-d/8),m=1-Math.exp(-d/6);return g.x=n+i*8*x,g.z=e+o*8*x,g.y=t+6*(s+45)*m-45*d,g.vx=i*Math.exp(-d/8),g.vz=o*Math.exp(-d/8),g.vy=(s+45)*Math.exp(-d/6)-45,g},u={};let f=0;for(;f<300&&(h(f,u),!(u.y<=r(u.x,u.z)));f+=.25);return{at:h,tImpact:f}}const Kr=n=>/^(jp|japan|ijn|ija)$/i.test(String(n))?"jp":/^(us|usa|usn|usaaf|usmc|usa?f)$/i.test(String(n))?"us":n||"us",bs=(n,t,e)=>Math.max(t,Math.min(e,n)),kM=new Set(["sunk","scuttled","capsized","exploded","lost","wrecked"]);function PM(n,t){var S,T,A,k;const{proj:e,clock:i,rng:s,warn:o}=t,r=_=>i.parse(_),a=[],l=new Map,c=(n.sites||[]).map((_,w)=>{const[C,F]=_.lonlat?e.toWorld(_.lonlat):[0,0];return{index:w,id:_.id,kind:_.kind,name:_.name||_.id,x:C,z:F,side:Kr(_.side),target:_.target!==!1&&_.kind!=="building",damage:_.damage||0}}),h=new Map(c.map(_=>[_.id,_]));for(const _ of n.units||[]){const w={index:a.length,id:_.id,name:_.name||_.id,ja:_.ja||null,kitId:_.kit,side:Kr(_.side),formation:_.group||null,fixed:!!_.fixed,hospital:!!_.hospital,tokko:!!_.tokko,target:_.target!==!1&&!_.hospital,colour:_.colour||null,dye:_.dye||null,track:null,station:null,events:[],fate:null,hh:[],ready:_.ready||null,sinkT:null,raw:_};if((S=_.track)!=null&&S.length){const C=_.track.map(F=>{const[z,P]=e.toWorld(F.lonlat);return{t:r(F.t),x:z,z:P,course:F.courseDeg,speed:(F.speedKn??0)*Ne,precision:F.precision}});C.sort((F,z)=>F.t-z.t);for(let F=0;F<C.length;F++){const z=C[F];if(z.course==null){const P=C[F+1]||z,B=C[F-1]||z;z.course=P!==z?_e(P.x-z.x,P.z-z.z):B!==z?_e(z.x-B.x,z.z-B.z):0}}w.track=RM(C)}if(_.station){const C=_.station;if(w.station={guideId:C.guide??null,guide:-1,bearingDeg:C.bearingDeg??0,rangeM:C.rangeM??0,relative:!!C.relative,parked:C.parked??null,site:C.site??(typeof C.parked=="string"?C.parked:null),headingDeg:C.headingDeg??0,lonlat:C.lonlat||null},w.station.site||w.station.lonlat||w.station.parked){const F=h.get(w.station.site),[z,P]=w.station.lonlat?e.toWorld(w.station.lonlat):F?[F.x,F.z]:[0,0];w.fixedPos={x:z,z:P}}}if(!w.track&&!w.station&&(o==null||o(`battle: unit ${_.id} has neither a track nor a station; it stays at the box's centre`)),w.events=(_.events||[]).map((C,F)=>{const z={...C,i:F,unit:w.index,t:r(C.t)};return z.count=Array.isArray(C.count)?C.count:C.count!=null?[C.count,C.count]:null,z.rc=z.count?s.fork(`count:${_.id}:${F}`).range(z.count):0,z}),w.events.sort((C,F)=>C.t-F.t),w.events.forEach((C,F)=>C.k=F),_.fate&&(w.fate={kind:_.fate.kind,t:_.fate.t!=null?r(_.fate.t):null}),w.fate&&kM.has(w.fate.kind)&&w.fate.t!=null)w.sinkT=w.fate.t;else{const C=w.events.find(F=>F.kind==="sinks"||F.kind==="scuttled");C&&(w.sinkT=C.t)}w.hh=(_.hangarHazard||[]).map(C=>({t:r(C.t),h:C.h})).sort((C,F)=>C.t-F.t),l.set(_.id,w),a.push(w)}for(const _ of a)if((T=_.station)!=null&&T.guideId){const w=l.get(_.station.guideId);w?_.station.guide=w.index:o==null||o(`battle: ${_.id}'s station guide ${_.station.guideId} is not a unit`)}const u=new zM(a),f=[],d=new Map;for(const _ of n.groups||[]){const w={index:f.length,id:_.id,name:_.name||_.id,kitId:_.kit,side:Kr(_.side),count:Math.max(1,_.count|0),fromId:_.from??null,from:((A=l.get(_.from))==null?void 0:A.index)??-1,fromSite:h.get(_.from)||null,launch:_.launch!=null?r(_.launch):null,offBox:!!_.offBox,enter:_.enter?{t:r(_.enter.t),..._.enter.lonlat?ru(e,_.enter.lonlat):{x:0,z:0},heading:_.enter.headingDeg??180,alt:_.enter.altM??_.altM??2e3}:null,alt:_.altM??null,route:(_.route||[]).map(C=>({t:r(C.t),...ru(e,C.lonlat),alt:C.altM??_.altM??1500})).sort((C,F)=>C.t-F.t),attack:_.attack?{..._.attack,t:_.attack.t!=null?r(_.attack.t):null}:null,losses:_.losses||[],recover:_.recover?{t:r(_.recover.t),to:((k=l.get(_.recover.to))==null?void 0:k.index)??-1,toId:_.recover.to}:null,sources:_.sources||[],aircraft:[],raw:_};f.push(w),d.set(_.id,w)}for(const _ of f){const w=_.attack;if(!w)continue;const C=Array.isArray(w.target)?w.target:w.target!=null?[w.target]:[];w.targets=C.map(z=>{var P,B;return{id:z,unit:((P=l.get(z))==null?void 0:P.index)??-1,group:((B=d.get(z))==null?void 0:B.index)??-1,site:h.get(z)||null}});for(const z of w.targets)z.unit<0&&z.group<0&&!z.site&&(o==null||o(`battle: group ${_.id}'s attack target ${z.id} is not a unit, group or site`));w.targets=w.targets.filter(z=>z.unit>=0||z.group>=0||z.site);const F=w.targets[0]||null;w.targetUnit=(F==null?void 0:F.unit)??-1,w.targetGroup=(F==null?void 0:F.group)??-1,w.targetSite=(F==null?void 0:F.site)??null}const g={...t,ships:a,groups:f,motion:u,sites:c,shipById:l,groupById:d};for(const _ of f){_.recordHits=0;for(const w of a)for(const C of w.events)C.by===_.id&&(C.kind==="hit"||C.kind==="torpedo-hit")&&(_.recordHits+=C.rc)}const x=new Set,m=(_,w=0)=>{var F;if(x.has(_.index))return;const C=((F=_.attack)==null?void 0:F.targetGroup)??-1;C>=0&&C!==_.index&&w<4&&m(f[C],w+1),IM(_,g),x.add(_.index)};for(const _ of f)m(_);const p=n.weather||{},y=(p.squalls||[]).map(_=>({t0:_.from!=null?r(_.from):-1/0,t1:_.to!=null?r(_.to):1/0,poly:(_.polygon||[]).map(w=>e.toWorld(w)),vx:_.velocity?(_.velocity.kn??0)*Ne*Math.sin((_.velocity.towardDeg??0)*Ci):0,vz:_.velocity?-(_.velocity.kn??0)*Ne*Math.cos((_.velocity.towardDeg??0)*Ci):0})),v=new Map((n.moments||[]).map(_=>[_.id,{..._,t:r(_.t),beats:(_.beats||[]).map(w=>({...w,t:r(w.t)}))}])),M=(n.stops||[]).map(_=>({..._,t:r(_.t)}));return{ships:a,groups:f,sites:c,squalls:y,moments:v,stops:M,motion:u,shipById:l,groupById:d,siteById:h,weather:p}}const ru=(n,t)=>{const[e,i]=n.toWorld(t);return{x:e,z:i}};class zM{constructor(t){this.ships=t,this.tmp={x:0,z:0,vx:0,vz:0,course:0}}pose(t,e,i,s=0){const o=this.ships[t];o.sinkT!=null&&e>o.sinkT&&(e=o.sinkT);const r=o.track,a=o.station;if(r&&(!a||a.guide<0||e>=r[0].t)){if(CM(r,e,this.tmp),this.copy(i,this.tmp),a&&a.guide>=0&&e<r[0].t+120&&s<8){const l={x:0,z:0,vx:0,vz:0,heading:0,speed:0};this.station(o,r[0].t,l,s);const c=(e-r[0].t)/120;i.x=l.x+(i.x-l.x)*c,i.z=l.z+(i.z-l.z)*c}return i}return a&&a.guide>=0&&s<8?this.station(o,e,i,s):o.fixedPos?(i.x=o.fixedPos.x,i.z=o.fixedPos.z,i.vx=0,i.vz=0,i.heading=(a==null?void 0:a.headingDeg)??0,i.speed=0,i):(i.x=0,i.z=0,i.vx=0,i.vz=0,i.heading=0,i.speed=0,i)}station(t,e,i,s){const o=t.station;this.pose(o.guide,e,i,s+1);const r=o.bearingDeg+(o.relative?i.heading:0),[a,l]=Te(r);return i.x+=a*o.rangeM,i.z+=l*o.rangeM,i}copy(t,e){t.x=e.x,t.z=e.z,t.vx=e.vx,t.vz=e.vz;const i=Math.hypot(e.vx,e.vz);return t.speed=i,t.heading=i>.3?_e(e.vx,e.vz):e.course,t}}function DM(n,t){let e=n.hh.length?0:null;for(const i of n.hh)i.t<=t&&(e=i.h);return e}function IM(n,t){var K,lt,_t,bt,Dt,O,Wt,wt,Xt;const{motion:e,ships:i,groups:s,rng:o,warn:r}=t,a=t.aircraftModel(n.kitId);if(!a){r==null||r(`battle: group ${n.id}'s kit ${n.kitId} is not an aircraft kit`),n.aircraft=[];return}n.model=a;const l=o.fork(`group:${n.id}`),c=bs(a.vCruise||80,45,160),h=n.attack,u=(h==null?void 0:h.profile)||"search",f={x:0,z:0,vx:0,vz:0,heading:0,speed:0},d=(G,vt)=>e.pose(G,vt,{...f}),g=t.heightAt||(()=>0),x=n.losses.reduce((G,vt)=>G+l.range(vt),0),m=s.find(G=>{var vt;return((vt=G.attack)==null?void 0:vt.profile)==="cap"&&G.attack.targetGroup===n.index})||null;let p;(h==null?void 0:h.reached)!=null?p=bs(l.fork("reached").range(h.reached),0,n.count):u==="torpedo"||m?p=n.count-Math.min(n.count,x):p=n.count;const y=n.count-p,v=Math.min(y,x),M=y-v,S=Math.max(0,x-v);n.Srec=p,n.preLoss=v,n.turnedBack=M,n.lossTotal=x;const T=n.from>=0?n.from:-1,A=T>=0?t.shipModel(i[T].kitId):null,k=18,_=[];for(let G=0;G<n.count;G++){const vt=[],Lt=oo(G);if(n.enter){const Ut=n.enter.t,[It,I]=ao(n.enter.x,n.enter.z,n.enter.heading,Lt);vt.push({t:Ut,x:It,y:n.enter.alt+Lt.up,z:I});const[D,q]=Te(n.enter.heading);vt.push({t:Ut+60,x:It+D*c*60,y:n.enter.alt+Lt.up,z:I+q*c*60}),_.push({keys:vt,spawnT:Ut});continue}const gt=(n.launch??(n.route[0]?n.route[0].t-600:(h==null?void 0:h.t)!=null?h.t-1800:0))+G*k;if(T>=0){const Ut=d(T,gt),[It,I]=Te(Ut.heading),D=((A==null?void 0:A.fdTop)??(A==null?void 0:A.deck)??15)+1.5,q=((A==null?void 0:A.L)??200)*.3;vt.push({t:gt,x:Ut.x-It*q,y:D,z:Ut.z-I*q}),vt.push({t:gt+7,x:Ut.x+It*(Ut.speed*7+120),y:D+25,z:Ut.z+I*(Ut.speed*7+120)}),vt.push({t:gt+45,x:Ut.x+It*2600,y:350,z:Ut.z+I*2600})}else{const Ut=n.fromSite||{x:0,z:0},It=g(Ut.x,Ut.z)+2,I=n.route[0]?_e(n.route[0].x-Ut.x,n.route[0].z-Ut.z):0,[D,q]=Te(I),rt=G%3*40-40;vt.push({t:gt,x:Ut.x-q*rt,y:It,z:Ut.z+D*rt}),vt.push({t:gt+25,x:Ut.x+D*900-q*rt,y:It+30,z:Ut.z+q*900+D*rt}),vt.push({t:gt+70,x:Ut.x+D*4e3,y:It+400,z:Ut.z+q*4e3})}_.push({keys:vt,spawnT:gt})}const w=n.route,C=G=>{const vt=[],Lt=oo(G);for(let kt=0;kt<w.length;kt++){const gt=w[kt],Ut=w[kt+1]||null,It=w[kt-1]||null,I=Ut?_e(Ut.x-gt.x,Ut.z-gt.z):It?_e(gt.x-It.x,gt.z-It.z):0,[D,q]=ao(gt.x,gt.z,I,Lt);vt.push({t:gt.t,x:D,y:gt.alt+Lt.up,z:q})}return vt},F=(K=h==null?void 0:h.targets)!=null&&K.length?h.targets:[{unit:(h==null?void 0:h.targetUnit)??-1,site:(h==null?void 0:h.targetSite)??null}];let z=F[0];const P=G=>F[Math.min(F.length-1,Math.floor(G*F.length/n.count))],B=G=>{var vt;return(G.unit>=0?(vt=t.shipModel(i[G.unit].kitId))==null?void 0:vt.L:null)??60},X=G=>z.unit>=0?d(z.unit,G):z.site?{x:z.site.x,z:z.site.z,heading:0,speed:0,vx:0,vz:0}:null,J=(h==null?void 0:h.t)??null;let Z=B(z);const Y=w[w.length-1]||null,st=G=>{if((h==null?void 0:h.fromDeg)!=null)return h.fromDeg;const vt=X(G);if(vt&&Y)return _e(Y.x-vt.x,Y.z-vt.z);if(vt&&T>=0){const Lt=d(T,G);return _e(Lt.x-vt.x,Lt.z-vt.z)}return 0},tt=Math.min(n.recordHits,p),N=[];for(let G=0;G<n.count;G++){const vt=[..._[G].keys],Lt=I=>{for(const D of I)D.t>vt[vt.length-1].t+.5&&vt.push(D)};Lt(C(G));const kt={k:G,plan:{legs:[]},spawnT:_[G].spawnT,endT:1/0,endHow:"exit",lossT:null,lossHow:null,lossCause:null,releaseT:null,actions:[],hit:!1},gt=G;z=P(G),Z=B(z),kt.target=z.unit;const Ut=J!=null?X(J):null;let It=vt[vt.length-1].t;if(h&&J!=null&&(Ut||u==="cap"||u==="escort"))if(u==="dive"&&Ut){const I=bs(((lt=a.kit.aero)==null?void 0:lt.diveMs)??a.vShake*.8,85,160),D=70*Ci,q=h.pushOverM??n.alt??4e3,rt=Math.min(h.releaseM??600,q-200),ht=J+gt*7,ct=(q-rt)/(I*Math.sin(D)),Q=ht+ct,it=I*Math.sin(D),at=(-it+Math.sqrt(it*it+2*9.81*rt))/9.81,pt=I*Math.cos(D)*at,mt=X(Q+at),nt=st(ht)+(gt%3-1)*8,[yt,St]=Te(nt),Pt=Yr(gt,p,tt);kt.hit=Pt;const[Ft,Et]=Te(mt.heading),Gt=Pt?(l.next()-.5)*.5*Z:0,Jt=Pt?[0,0]:[l.gauss()*45+Math.sign(l.next()-.5)*30,l.gauss()*45],oe={x:mt.x+Ft*Gt+Jt[0],z:mt.z+Et*Gt+Jt[1]},$t={x:oe.x+yt*pt,z:oe.z+St*pt},ot={x:$t.x+yt*(q-rt)/Math.tan(D),z:$t.z+St*(q-rt)/Math.tan(D)},$={x:ot.x+yt*c*25,z:ot.z+St*c*25},At={x:ot.x+yt*6e3,z:ot.z+St*6e3},Tt=oo(G),[Vt,Nt]=ao(At.x,At.z,nt+180,Tt),ae=Math.max(120,rt-230);Lt([{t:J-120,x:Vt,y:q+Tt.up,z:Nt},{t:ht-25,x:$.x,y:q,z:$.z},{t:ht,x:ot.x,y:q,z:ot.z,corner:!0},{t:Q,x:$t.x,y:rt,z:$t.z},{t:Q+5,x:$t.x-yt*(I*.34*5+120),y:ae,z:$t.z-St*(I*.34*5+120)},{t:Q+35,x:$t.x-yt*3200,y:180,z:$t.z-St*3200},{t:Q+200,x:$t.x-yt*15e3,y:900,z:$t.z-St*15e3}]),kt.releaseT=Q,kt.actions.push({t:Q,kind:"release",g:n.index,k:G,hit:Pt,aim:oe,target:z.unit,weapon:((bt=(_t=a.payload[0])==null?void 0:_t.weapon)==null?void 0:bt.id)??null}),It=Q+200}else if(u==="torpedo"&&Ut){const I=a.torpedo,D=bs(Math.min(c*1.05,(((I==null?void 0:I.dropSpeedKn)??110)+10)*Ne),45,110),q=bs(Math.min(30,(I==null?void 0:I.dropAltM)??30),12,60),rt=(((I==null?void 0:I.speedKn)??((O=(Dt=I==null?void 0:I.settings)==null?void 0:Dt[0])==null?void 0:O.speedKn)??33)||33)*Ne,ht=900,ct=J+gt*5,Q=ht/rt,it=(gt%2?1:-1)*Math.ceil(gt/2)*7,at=st(ct)+bs(it,-40,40),[pt,mt]=Te(at),nt=X(ct+Q),yt=Yr(gt,p,tt);kt.hit=yt;const[St,Pt]=Te(nt.heading),Ft=yt?0:(l.next()<.5?-1:1)*(.7+l.next()*.6)*Z,Et={x:nt.x+St*Ft,z:nt.z+Pt*Ft},Gt={x:Et.x+pt*ht,z:Et.z+mt*ht},Jt=8e3,oe=ct-(Jt-ht)/D,$t=oe-70,ot=oo(G),[$,At]=ao(Et.x+pt*16e3,Et.z+mt*16e3,at+180,ot),[Tt,Vt]=[-mt,pt],Nt=gt%2?1:-1;Lt([{t:$t,x:$,y:Math.max(500,(n.alt??1200)*.6),z:At},{t:oe,x:Et.x+pt*Jt,y:60,z:Et.z+mt*Jt},{t:ct,x:Gt.x,y:q,z:Gt.z},{t:ct+9,x:Gt.x-pt*D*9+Tt*Nt*150,y:25,z:Gt.z-mt*D*9+Vt*Nt*150},{t:ct+35,x:Et.x-pt*1200+Tt*Nt*1800,y:60,z:Et.z-mt*1200+Vt*Nt*1800},{t:ct+200,x:Et.x-pt*9e3+Tt*Nt*6e3,y:700,z:Et.z-mt*9e3+Vt*Nt*6e3}]),kt.releaseT=ct;const ae=(at+180)%360;kt.actions.push({t:ct,kind:"drop",g:n.index,k:G,hit:yt,aim:Et,heading:ae,target:z.unit,weapon:(I==null?void 0:I.id)??null}),It=ct+200}else if((u==="level"||u==="strafe"||u==="search")&&Ut){const I=u==="strafe",D=I?45:h.altM??n.alt??3e3,q=I?Math.min(c*1.2,a.vMax*.9):c,rt=J+(I?gt*6:0),ht=st(rt),[ct,Q]=Te(ht),it=Math.sqrt(2*D/9.81),at=X(rt+(I?0:it)),pt=oo(G),[mt,nt]=ao(at.x,at.z,ht+180,I?{right:pt.right*.5,back:0}:pt),yt=I?0:q*it,St={x:mt+ct*yt,z:nt+Q*yt};if(Lt([{t:rt-14e3/q,x:St.x+ct*14e3,y:D+(I?300:pt.up),z:St.z+Q*14e3},{t:rt-4e3/q,x:St.x+ct*4e3,y:D+(I?0:pt.up),z:St.z+Q*4e3},{t:rt,x:St.x,y:D+(I?0:pt.up),z:St.z},{t:rt+6e3/q,x:St.x-ct*6e3,y:D+(I?250:pt.up),z:St.z-Q*6e3},{t:rt+12e3/q,x:St.x-ct*12e3+Q*4e3,y:Math.max(800,D),z:St.z-Q*12e3-ct*4e3}]),kt.releaseT=rt,u==="level"){const Pt=Yr(gt,p,tt);kt.hit=Pt;const Ft={x:mt+(Pt?0:l.gauss()*120),z:nt+(Pt?0:l.gauss()*120)};kt.actions.push({t:rt,kind:"release",g:n.index,k:G,hit:Pt,aim:Ft,target:z.unit,weapon:((wt=(Wt=a.payload[0])==null?void 0:Wt.weapon)==null?void 0:wt.id)??null,level:!0})}else u==="strafe"&&kt.actions.push({t:rt-3,kind:"strafe",g:n.index,k:G,dur:3,target:z.unit,site:((Xt=z.site)==null?void 0:Xt.id)??null});It=rt+12e3/q}else u==="cap"?It=UM(kt,vt,n,G,t,{vC:c,R:l,ta:J,fromShip:T}):u==="escort"&&(It=FM(kt,vt,n,G,t,{vC:c,R:l,ta:J}));kt.plan.legs.length||kt.plan.legs.push({type:"keys",t0:vt[0].t,t1:vt[vt.length-1].t,keys:vt}),NM(kt,n,G,t,{vC:c,tEnd:It,fromShip:T,fromModel:A,shipPose:d}),N.push(kt)}OM(n,N,t,{R:l,preLoss:v,postLoss:S,turnedBack:M,capOn:m,profile:u,ta:J});for(const G of N){if(G.lossT==null)continue;const vt={x:0,y:0,z:0},Lt={x:0,y:0,z:0};Qi(G,G.lossT,vt,t),Qi(G,G.lossT-.5,Lt,t);const kt=(vt.x-Lt.x)*2,gt=(vt.y-Lt.y)*2,Ut=(vt.z-Lt.z)*2;G.lossHow==="ditch"?(G.fall=au(vt.x,vt.y,vt.z,kt*.6,Math.min(gt,-3),Ut*.6,g),G.fall.tImpact=Math.min(G.fall.tImpact,120)):G.fall=au(vt.x,vt.y,vt.z,kt,gt,Ut,g),G.goneT=G.lossT+G.fall.tImpact,G.actions=G.actions.filter(It=>It.t<G.lossT)}n.aircraft=N}function Yr(n,t,e){return e<=0||n>=t?!1:e>=t?!0:Math.floor((n+1)*e/t)>Math.floor(n*e/t)}function UM(n,t,e,i,s,{vC:o,R:r,ta:a,fromShip:l}){var F;const{groups:c,motion:h}=s,u=e.attack,f=u.altM??e.alt??1500,d=3500+i%4*600,g=o/d*(i%2?1:-1),x=l>=0?{unit:l}:e.fromSite?{point:e.fromSite}:{point:{x:t[0].x,z:t[0].z}},m=t[t.length-1].t+60,p=n.plan.legs,y=(z,P,B)=>({type:"orbit",t0:z,t1:P,centre:x,r:d,w:g,alt:f+i%3*120,phase:B}),v=nr(s),M=r.next()*Math.PI*2,S=y(m,1/0,M),T=u.targetGroup>=0?c[u.targetGroup]:null;let A=a,k=a;T&&((F=T.attack)==null?void 0:F.t)!=null&&(k=Math.max(a+120,T.attack.t+60+Math.min(T.count,12)*6));const _=(t[0].t??0)+(e.model.enduranceS||3600),w=(z,P)=>{const B=yi(P,P.t0,{x:0,y:0,z:0},v);return{t:P.t0,x:B.x,y:B.y,z:B.z}};if(T&&k>A&&T.aircraft.length){const z=Math.min(i%Math.max(1,T.count),T.aircraft.length-1);S.t1=A;const P={type:"follow",t0:A+45,t1:k,leader:{group:T.index,k:z},off:{right:(i%2?1:-1)*(150+60*i),back:350+80*(i%3),up:80},weave:.35,phase:r.next()*6},B=y(k+90,Math.max(_,k+600),M+1),X=[...t,w(m,S)];p.push({type:"keys",t0:X[0].t,t1:m,keys:X}),p.push(S);const J=yi(S,S.t1,{x:0,y:0,z:0},v),Z=yi(P,P.t0,{x:0,y:0,z:0},v);p.push({type:"keys",t0:S.t1,t1:P.t0,keys:[{t:S.t1,...J},{t:P.t0,...Z}]}),p.push(P);const Y=yi(P,P.t1,{x:0,y:0,z:0},v),st=yi(B,B.t0,{x:0,y:0,z:0},v);return p.push({type:"keys",t0:P.t1,t1:B.t0,keys:[{t:P.t1,...Y},{t:B.t0,...st}]}),p.push(B),B.t1}S.t1=Math.max(_,m+600);const C=[...t,w(m,S)];return p.push({type:"keys",t0:C[0].t,t1:m,keys:C}),p.push(S),S.t1}function FM(n,t,e,i,s,{vC:o,R:r,ta:a}){var v;const{groups:l}=s,c=e.attack,h=c.targetGroup>=0?l[c.targetGroup]:null,u=n.plan.legs,f=nr(s),d=t[t.length-1].t;if(!h||!h.aircraft.length)return u.push({type:"keys",t0:t[0].t,t1:d,keys:t}),d;const g=h.aircraft[0],x=Math.max(d+30,(g.spawnT??0)+120),m=Math.max(x+60,(((v=h.attack)==null?void 0:v.t)??a)+90),p={type:"follow",t0:x,t1:m,leader:{group:h.index,k:0},off:{right:(i%2?1:-1)*(250+40*i),back:250,up:500+i%3*60},weave:.25,phase:r.next()*6},y=yi(p,x,{x:0,y:0,z:0},f);return u.push({type:"keys",t0:t[0].t,t1:x,keys:[...t,{t:x,...y}]}),u.push(p),m}function NM(n,t,e,i,{vC:s,tEnd:o,fromShip:r,fromModel:a,shipPose:l}){const c=n.plan.legs,h=nr(i),u=c[c.length-1];if(!Number.isFinite(u.t1)){n.endT=1/0;return}const f=yi(u,u.t1,{x:0,y:0,z:0},h),d=t.recover,g=(d==null?void 0:d.to)>=0?d.to:t.offBox?-1:r,x=[{t:u.t1,...f}];if(g>=0){const v=i.shipModel(i.ships[g].kitId);let M=(d==null?void 0:d.t)!=null?d.t+e*30:u.t1+600;const S=l(g,M),T=Math.hypot(S.x-f.x,S.z-f.z);M=Math.max(M,u.t1+T/(s*.95)+60);const A=l(g,M),[k,_]=Te(A.heading),w=((v==null?void 0:v.fdTop)??(v==null?void 0:v.deck)??15)+1.5,C=(v==null?void 0:v.L)??200;x.push({t:M-120,x:A.x-k*6e3,y:300,z:A.z-_*6e3}),x.push({t:M-30,x:A.x-k*(1500+A.speed*30),y:80,z:A.z-_*(1500+A.speed*30)}),x.push({t:M,x:A.x+k*C*.1,y:w,z:A.z+_*C*.1}),x[1].t<=u.t1+1&&x.splice(1,1),x[1]&&x[1].t<=u.t1+1&&x.splice(1,1),c.push({type:"keys",t0:u.t1,t1:M,keys:x}),n.endT=M,n.endHow="land",n.landOn=g,n.actions.push({t:M,kind:"land",g:t.index,k:e,unit:g});return}if(t.fromSite&&!t.offBox){const v=t.fromSite,M=(i.heightAt?i.heightAt(v.x,v.z):0)+2,S=Math.hypot(v.x-f.x,v.z-f.z),T=u.t1+S/s+90+e*20;x.push({t:T-60,x:v.x+3e3,y:200,z:v.z}),x.push({t:T,x:v.x,y:M,z:v.z}),c.push({type:"keys",t0:u.t1,t1:T,keys:x}),n.endT=T,n.endHow="land",n.actions.push({t:T,kind:"land",g:t.index,k:e,unit:-1});return}const m=t.enter?{x:t.enter.x,z:t.enter.z}:{x:f.x*3,z:f.z*3},p=Math.hypot(m.x-f.x,m.z-f.z),y=u.t1+Math.max(120,p/s);x.push({t:y,x:m.x,y:Math.max(800,f.y),z:m.z}),c.push({type:"keys",t0:u.t1,t1:y,keys:x}),n.endT=y,n.endHow="exit"}function OM(n,t,e,{R:i,preLoss:s,postLoss:o,turnedBack:r=0,capOn:a,profile:l,ta:c}){var x;const h=t.length,u=m=>m.releaseT??c??m.spawnT+1800;if(s>0){let m,p;a&&((x=a.attack)==null?void 0:x.t)!=null?(m=a.attack.t+60,p=Math.max(m+30,(c??m+300)-8)):c!=null?(m=c-(l==="torpedo"?150:90),p=c-5):(m=t[0].spawnT+600,p=m+600);for(let y=0;y<s;y++){const v=t[h-1-y],M=m+(p-m)*(y+.5)/s;v.lossT=Math.min(M,(v.releaseT??1/0)-1),v.lossHow="shot",v.lossCause=a?a.index:"aa"}}for(let m=0;m<r;m++){const p=t[h-1-s-m];if(!p)break;p.noReach=!0,p.hit=!1,p.actions=p.actions.filter(y=>y.kind!=="release"&&y.kind!=="drop")}const d=t.slice(0,Math.max(0,h-s-r)).filter(m=>m.endT>u(m)+60),g=[];for(let m=0;m<o&&d.length;m++)g.push(d.splice(Math.floor(i.next()*d.length),1)[0]);g.forEach((m,p)=>{const y=u(m);if(p%2===0&&l!=="cap"&&l!=="escort"&&l!=="search")m.lossT=y+4+i.next()*20,m.lossHow="shot",m.lossCause="aa";else{const v=Number.isFinite(m.endT)?m.endT:y+3600;m.lossT=y+600+i.next()*Math.max(60,v-y-900),m.lossHow="ditch",m.lossCause="fuel"}})}function nr(n){const{motion:t,groups:e}=n,i={x:0,z:0,vx:0,vz:0,heading:0,speed:0},s={x:0,y:0,z:0},o={x:0,y:0,z:0};return function(a,l,c){if(a.unit!=null)return t.pose(a.unit,l,i),c.x=i.x,c.z=i.z,c.y=0,c.heading=i.heading,c;if(a.point)return c.x=a.point.x,c.z=a.point.z,c.y=0,c.heading=0,c;if(a.group!=null){const h=e[a.group].aircraft[a.k];return h?(Qi(h,l,s,n),Qi(h,l-1,o,n),c.x=s.x,c.y=s.y,c.z=s.z,c.heading=_e(s.x-o.x,s.z-o.z),c):(c.x=0,c.z=0,c.y=1e3,c.heading=0,c)}return c.x=0,c.z=0,c.y=0,c.heading=0,c}}function Qi(n,t,e,i){if(n.lossT!=null&&t>n.lossT&&n.fall)return n.fall.at(Math.min(t-n.lossT,n.fall.tImpact),e),e;const s=n.plan.legs;if(!s.length)return e;const o=Math.max(s[0].t0,Math.min(t,s[s.length-1].t1));let r=s[0];for(let a=0;a<s.length&&o>=s[a].t0;a++)r=s[a];return i._resolve||(i._resolve=nr(i)),yi(r,Math.min(o,r.t1),e,i._resolve)}const he=xt.damage,BM={bb:"bb",cv:"cv",cvl:"cv",cve:"cve",ca:"ca",cl:"ca",dd:"dd",de:"dd",ss:"dd","ss-midget":"dd",ar:"cve",ao:"cve",cm:"cve",av:"cve",ah:"cve",ap:"cve",ak:"cve"},HM=n=>BM[n]||"ca",Zr=(n,t,e)=>n+(t-n)*Math.max(0,Math.min(1,e)),GM={hull:{bb:[.07,.02],cv:[.1,.03],ca:[.15,.05],dd:[.06,.03,{sys:.4}],cve:[.05,.03]},waterline:{bb:[.07,.06,{hole:1}],cv:[.1,.08,{hole:1}],ca:[.15,.1,{hole:1}],dd:[.08,.08,{hole:1}],cve:[.06,.08,{hole:1}]},super:{bb:[.03,0,{sys:.6}],cv:[.03,0,{sys:.6}],ca:[.03,0,{sys:.6}],dd:[.03,0,{sys:.6}],cve:[.03,0,{sys:.6}]}},$M={bb:[.015,0],cv:[.05,.02],ca:[.06,.03],dd:[.1,.05],cve:[.06,.02]},lu={dd:[.05,.03],cve:[.04,.02]},VM={bb:[[.003,0],[.008,0]],cv:[[.01,0],[.02,0]],ca:[[.012,.005],[.03,.005]],dd:[[.035,.02],[.07,.02]],cve:[[.02,.01],[.04,.01]]},WM={"bomb-1000":{bb:[.02,0,.3],cv:[.06,0,.9],ca:[.15,.03,.6],dd:[.4,.3,.5],cve:[.15,.05,.7]},"bomb-500":{bb:[.01,0,.25],cv:[.03,0,.8],ca:[.08,.02,.5],dd:[.25,.15,.4],cve:[.08,.03,.6]},"bomb-100":{bb:[.004,0,.1],cv:[.012,0,.4],ca:[.03,.008,.25],dd:[.1,.05,.2],cve:[.03,.01,.3]}},jM={air:{bb:[.03,.08,3],cv:[.06,.18,10],ca:[.08,.22,8],dd:[.4,.6,10],cve:[.15,.3,8]},t93:{bb:[.05,.12,4],cv:[.1,.35,12],ca:[.12,.35,10],dd:[.5,.9,12],cve:[.2,.5,10]},mk15:{bb:[.04,.1,3],cv:[.08,.25,10],ca:[.1,.25,8],dd:[.45,.8,10],cve:[.18,.4,9]}};function va(n){if(!n)return"light";if(n.kind==="torpedo")return n.air?"torpedo-air":/mk|mark/i.test(n.id)?"torpedo-mk15":"torpedo-t93";if(n.kind==="bomb")return n.class==="bomb-1000"||(n.massKg??0)>=400?"bomb-1000":n.class==="bomb-500"||(n.massKg??0)>=180?"bomb-500":"bomb-100";const t=n.calibreMm??127;return t>=300?"heavy":t>=180?"medium":t>=100?"light":"small"}function XM(n="",t){const e=String(n).toLowerCase();let i=/bow|stem|forecastle/.test(e)?0:/forward|fore|turret 1|no\. 1|bridge|island/.test(e)?1:/stern|quarterdeck|rudder/.test(e)?3:/aft|after|turret 3|turret 4/.test(e)?2:/amidships|midships|centre|center|funnel|uptake/.test(e)?t.next()<.5?1:2:Math.floor(t.next()*4);i=Math.max(0,Math.min(3,i));const s=/waterline|below|underwater|hull bottom/.test(e)?"waterline":/superstructure|bridge|director|mast|funnel|radar|tower|island|pagoda/.test(e)?"super":/turret/.test(e)?"turret":/flight deck|hangar|deck/.test(e)?"deck":null,o=/port/.test(e)?-1:/starboard/.test(e)?1:0;return{zone:i,part:s,side:o,uptake:/uptake|boiler|engine|machinery/.test(e),magazine:/magazine/.test(e)}}function qM(n,t,e){const i=`${t}-${Math.max(1941,Math.min(1944,e))}`;return{regime:"record",fight:0,float:0,list:0,fires:[0,0,0,0],fireDmg:[0,0,0,0],H:0,holes:[],doomed:!1,doomedAt:null,doomedWhy:null,out:!1,crippled:!1,sinking:!1,sinkAt:null,sinkHow:null,goneAt:null,rudderJam:null,engineStopUntil:0,engineCap:1,bowLost:!1,systemsOut:new Set,repairs:[],navy:t,year:e,fireOut:he.fireOut[i]??he.fireOut.default,patch:he.holePatch[t]??he.holePatch.us,counter:he.counterflood[t]??he.counterflood.us,hits:0,lastHitT:-1e9,log:[]}}const KM=n=>Math.max(he.dcFloor,1-.6*Math.min(1,n.fight)),YM=n=>Math.max(he.dcFloor,1-.85*Math.min(1,n.fight));function Ds(n,t,e,i){var x,m;const s=HM(t.type),o=[];let r=0,a=0,l=0,c=.2,h=0,u=0;const f=e.zone??Math.floor(i.next()*4),d=e.side||(i.next()<.5?-1:1),g=e.cls;if(g==="heavy"){const p=e.part==="waterline"?"waterline":e.part==="super"?"super":"hull",y=GM[p][s];if(r=y[0],a=y[1],h=((x=y[2])==null?void 0:x.hole)??0,c=((m=y[2])==null?void 0:m.sys)??.15,l=.12,e.ap!==!1&&e.rangeM!=null&&e.rangeM<1e4&&(f===0||f===1||f===3)&&p!=="super"&&s!=="dd"&&i.next()<he.magazineChance)return n.float=1,n.fight=Math.max(n.fight,1),o.push("magazine explosion"),Ca(n,t,e.t,"explodes",45),o.join(", ")}else if(g==="medium"){const p=e.ap&&lu[s]?lu[s]:$M[s];r=p[0],a=e.part==="waterline"?p[1]*1.5:p[1],h=e.part==="waterline"&&s!=="bb"?.5:0,l=.1,c=e.part==="super"?.4:.15}else if(g==="light"||g==="small"){const p=((e.calibreMm??127)-127)/28,[y,v]=VM[s];r=Zr(y[0],v[0],p),a=e.part==="waterline"?Zr(y[1],v[1],p):Zr(y[1],v[1],p)*.3,g==="small"&&(r*=.3,a*=.2),l=g==="small"?.01:.04,c=e.part==="super"?.25:.08}else if(g.startsWith("bomb")){const p=WM[g][s];r=p[0],a=p[1],l=p[2],c=g==="bomb-100"?.12:.3}else if(g.startsWith("torpedo")){const p=jM[g==="torpedo-air"?"air":g==="torpedo-mk15"?"mk15":"t93"][s];r=p[0],a=p[1],u=p[2],h=g==="torpedo-air"?1.5:2,c=.35,l=.1,g==="torpedo-mk15"&&f===0&&(s==="ca"||s==="cve")&&(n.bowLost=!0,o.push("bow blown off"))}if(n.fight+=r,n.float+=a,n.hits++,n.lastHitT=e.t??n.lastHitT,h>0&&(n.holes.push({zone:f,side:d,size:h,patched:!1,work:0,need:.6+.8*i.next()}),g.startsWith("torpedo")&&o.push("flooding")),u&&(n.list+=d*u*(.6+.8*i.next())),l>0&&i.next()<l&&(n.fires[f]||o.push(t.carrier?"fire on the hangar deck":"on fire"),n.fires[f]=1),i.next()<c){const p=ZM(n,t,e,i);p&&o.push(p)}return e.uptake&&t.carrier&&g.startsWith("bomb")&&(Vd(n,e.t,i),o.push("boilers out")),Wd(n,t,e.t??0),o.join(", ")}function ZM(n,t,e,i){var u,f;const s=e.t??0,o=t.systems.filter(d=>!["searchlights"].includes(d));if(!o.length)return null;const r=((u=e.cls)==null?void 0:u.startsWith("bomb"))||((f=e.cls)==null?void 0:f.startsWith("torpedo")),a=o.map(d=>{var g,x;return d==="engines"?r?2.5:1:d==="rudder"?e.zone===3?3:.6:d==="bow"?e.zone===0&&((g=e.cls)!=null&&g.startsWith("torpedo"))?3:.1:d==="flight-deck"?(x=e.cls)!=null&&x.startsWith("bomb")?3:.5:e.part==="super"&&/director|radar|bridge/.test(d)?3:1});let l=a.reduce((d,g)=>d+g,0),c=i.next()*l,h=o[0];for(let d=0;d<o.length;d++)if(c-=a[d],c<=0){h=o[d];break}if(h==="engines"){const d=r?.7:.1;return i.next()<d?(Vd(n,s,i),"engines stopped"):(n.engineCap=Math.min(n.engineCap,.47),"speed reduced")}return h==="rudder"?(n.rudderJam=(i.next()<.5?-1:1)*(10+i.next()*25),n.repairs.push({sys:"rudder",at:s+Is(i,he.systemRepairS)*3}),"steering jammed"):h==="bow"?(n.bowLost=!0,"bow damaged"):(n.systemsOut.add(h),n.repairs.push({sys:h,at:s+Is(i,he.systemRepairS)}),`${h.replace(/-/g," ")} out`)}function Vd(n,t,e){n.engineStopUntil=Math.max(n.engineStopUntil,t+Is(e,he.engineRepairS))}const Is=(n,[t,e])=>t+(e-t)*n.next();function Ca(n,t,e,i,s){n.doomed=!0,n.doomedAt??(n.doomedAt=e),n.doomedWhy??(n.doomedWhy=i),n.sinking=!0,n.sinkHow=i,n.sinkAt=e,n.goneAt=e+s}function Wd(n,t,e){n.crippled=n.fight>=t.crippledAt,n.out=n.fight>=1}function JM(n,t,e,i){const s=[];if(n.sinking)return i.t>=n.goneAt&&!n.gone&&(n.gone=!0,s.push({kind:"gone"})),s;const o=i.rng,r=t.carrier?i.H??n.H??0:0;n.H=r;const a=KM(n);let l=0;for(let f=0;f<4;f++){if(!n.fires[f])continue;l++;const d=he.fireZoneCap+(t.carrier?r:0);if(n.fireDmg[f]<d){const x=Math.min(he.fireFight*(1+6*r)*e,d-n.fireDmg[f]);n.fireDmg[f]+=x,n.fight+=x}const g=t.carrier?he.fireSpread.carrier*r:he.fireSpread.other;for(const x of[f-1,f+1])x>=0&&x<4&&!n.fires[x]&&o.next()<g*e&&(n.fires[x]=1);o.next()<n.fireOut*a*e&&(n.fires[f]=0)}let c=0;const h=YM(n),u=1+he.progressiveFlood*n.float;for(const f of n.holes)f.patched||(n.float+=he.holeFlood*f.size*u*e,c+=f.side*he.holeList*f.size,f.work+=n.patch*h*e,f.work>=f.need&&(f.patched=!0));if(n.list+=c*e,Math.abs(n.list)>.5&&!n.out){const f=Math.min(Math.abs(n.list),n.counter*h*e);n.list-=Math.sign(n.list)*f,n.float+=f*2e-4}for(const f of n.repairs)f.done||i.t<f.at||(f.done=!0,f.sys==="rudder"?n.rudderJam=null:n.systemsOut.delete(f.sys));if(Wd(n,t),!n.doomed&&(t.carrier&&l>=he.doomedFires&&r>=he.doomedH?(n.doomed=!0,n.doomedWhy="fires"):(n.float>=.92||Math.abs(n.list)>=he.abandonListDeg&&c*Math.sign(n.list)>0)&&(n.doomed=!0,n.doomedWhy="flooding"),n.doomed)){n.doomedAt=i.t,s.push({kind:"doomed",text:n.doomedWhy==="fires"?"fires out of control":"flooding out of control"});const f=t.carrier?he.sinkAfterDoomedS.carrier:he.sinkAfterDoomedS.other;n.sinkDue=i.recordSinkT!=null&&i.recordSinkT>i.t?i.recordSinkT:i.t+Is(o,f)}return Math.abs(n.list)>=he.capsizeListDeg?(Ca(n,t,i.t,"capsizes",150),s.push({kind:"sink",text:"capsizes"})):n.float>=1?(Ca(n,t,i.t,"founders",Is(o,he.founderS)),s.push({kind:"sink",text:"sinks"})):n.doomed&&n.sinkDue!=null&&i.t>=n.sinkDue&&(Ca(n,t,i.t,"sinks",Is(o,he.founderS)),s.push({kind:"sink",text:"sinks"})),s}function jd(n,t,e){if(n.sinking||n.out||e<n.engineStopUntil)return 0;let i=n.engineCap;return n.crippled&&(i=Math.min(i,he.crippledSpeed)),n.bowLost&&(i=Math.min(i,he.bowLostKn*.514444/t.vmax)),n.float>.6&&(i=Math.min(i,1-n.float)),Math.max(0,i)}function QM(n){return Math.max(0,Math.min(1,Math.max(n.fight*.75,n.float)))}function t_(n){return(n.fires[0]+n.fires[1]+n.fires[2]+n.fires[3])/4}const Hn=xt.air,En=(n,t,e)=>Math.max(t,Math.min(e,n));function Xd(n,t){if(!(n!=null&&n.length))return 0;if(t<=n[0][0])return n[0][1];for(let e=0;e+1<n.length;e++){const[i,s]=n[e],[o,r]=n[e+1];if(t<=o)return s+(r-s)*(t-i)/(o-i)}return n[n.length-1][1]}function El(n,{x:t=0,y:e=1e3,z:i=0,V:s=null,heading:o=0,gamma:r=0,phi:a=0,throttle:l=.8}={}){return{x:t,y:e,z:i,V:s??n.vCruise,psi:o*Ht,gamma:r,phi:a,p:0,n:1,alpha:0,throttle:l,mass:n.mass,stalled:!1,shake:0,overS:0,broken:!1,brakes:!1,gHold:0,blackout:0,fuelS:n.enduranceS,damage:0,burning:0,engineOut:!1,crashed:!1,ias:0}}const Ha=(n,t,e=n.y)=>Math.sqrt(2*n.mass*Ye/(Ji(e)*t.S*t.clMax));function e_(n,t){const i=.5*Ji(n.y)*n.V*n.V*t.S*t.clMax/(n.mass*Ye);let s=Math.min(t.gLimit,i);return t.turnLimit&&(s=Math.min(s,Math.sqrt(1+(t.turnLimit*n.V/Ye)**2))),Math.max(1,s)}function qd(n,t,e,i,s=null){if(n.crashed)return;const o=Math.max(0,n.y),r=Ji(o),a=Math.max(1,n.V),l=.5*r*a*a;n.ias=a*Math.sqrt(r/xM);const c=n.mass*Ye;(e==null?void 0:e.throttle)!=null&&(n.throttle=En(e.throttle,0,1));const h=Ha(n,t,o);a<h?n.stalled=!0:n.stalled&&a>Hn.stallRecover*h&&(n.stalled=!1);const u=e_(n,t),f=Xd(t.rollTable,a)*Ht*(n.broken||n.ias>t.vBreak?.3:1);let d,g;if(s)d=En(s.n,-1,u),g=En(s.p,-f,f);else{const w=En((e==null?void 0:e.pitch)??0,-1,1);d=w>=0?1+w*(u-1):1+w*2,g=En((e==null?void 0:e.roll)??0,-1,1)*f}n.stalled&&(g*=Hn.stallRollAuthority),n.p+=(g-n.p)*Math.min(1,i/Hn.rollLagS),n.phi+=n.p*i,n.phi>Math.PI?n.phi-=2*Math.PI:n.phi<-Math.PI&&(n.phi+=2*Math.PI);const x=l*t.S*t.clMax/c;let m=En(d,-x*.6,x);n.n=m;const p=m*c/(l*t.S);n.alpha=p/4.6;const y=Ji(t.ratedAlt),M=t.P0*(o<=t.ratedAlt?1:r/y)*(o>t.ceiling?.3:1)*(n.engineOut?0:1)*n.throttle/Math.max(a,30);n.brakes=t.diveDrag>0&&((e==null?void 0:e.brakes)??n.gamma<-40*Ht);const S=l*t.S*(t.cd0+t.k*p*p+(n.brakes?t.diveDrag:0))*(1+n.damage*.5),T=Math.sin(n.gamma),A=Math.cos(n.gamma);if(n.V=Math.max(5,a+((M-S)/n.mass-Ye*T)*i),n.stalled){const w=Hn.stallNoseDeg*Ht;n.gamma+=En(w-n.gamma,-30*Ht*i,Hn.stallNoseRateDegS*Ht*i)}else n.gamma+=Ye/a*(m*Math.cos(n.phi)-A)*i;n.gamma=En(n.gamma,-Math.PI/2+.01,Math.PI/2-.01),n.psi+=Ye/a*m*Math.sin(n.phi)/Math.max(.1,Math.cos(n.gamma))*i,e!=null&&e.yaw&&(n.psi+=e.yaw*3*Ht*i),n.psi=(n.psi%(2*Math.PI)+2*Math.PI)%(2*Math.PI);const k=Math.cos(n.gamma)*n.V;n.x+=k*Math.sin(n.psi)*i,n.z-=k*Math.cos(n.psi)*i,n.y+=n.V*Math.sin(n.gamma)*i,n.shake=n.ias>t.vShake?Math.min(1,(n.ias-t.vShake)/Math.max(1,t.vBreak-t.vShake)):0,n.ias>t.vBreak?(n.overS+=i,n.overS>Hn.breakAfterS&&(n.broken=!0)):n.overS=Math.max(0,n.overS-i);const _=Hn.blackout;m>_.narrowG?n.gHold+=i:m<_.backG&&(n.gHold=Math.max(0,n.gHold-i/_.backS*_.darkS)),n.blackout=m>_.darkG&&n.gHold>_.darkS?1:n.gHold>_.narrowS?.5:Math.max(0,n.blackout-i/_.backS),n.fuelS-=i*Hn.fuelFlowK*(.6+n.throttle*.7),n.fuelS<=0&&(n.fuelS=0,n.engineOut=!0)}function ir(n,t={f:[0,0,0],r:[0,0,0],u:[0,0,0]}){const e=Math.sin(n.psi),i=Math.cos(n.psi),s=Math.sin(n.gamma),o=Math.cos(n.gamma),r=t.f;r[0]=e*o,r[1]=s,r[2]=-i*o;const a=[i,0,e],l=[a[1]*r[2]-a[2]*r[1],a[2]*r[0]-a[0]*r[2],a[0]*r[1]-a[1]*r[0]],c=Math.cos(n.phi),h=Math.sin(n.phi);for(let u=0;u<3;u++)t.r[u]=a[u]*c-l[u]*h,t.u[u]=l[u]*c+a[u]*h;return t}function n_(n,t,e=0){return Ga(-n.psi,n.gamma+n.alpha*.6,-n.phi,t,e)}function Ga(n,t,e,i,s=0){const o=Math.cos(n/2),r=Math.sin(n/2),a=Math.cos(t/2),l=Math.sin(t/2),c=Math.cos(e/2),h=Math.sin(e/2),u=o*l,f=r*a,d=-r*l,g=o*a;return i[s]=u*c+f*h,i[s+1]=f*c-u*h,i[s+2]=g*h+d*c,i[s+3]=g*c-d*h,i}const i_={f:[0,0,0],r:[0,0,0],u:[0,0,0]};function Kd(n,t,e,{maxG:i=1/0,gain:s=Hn.instructorGain}={}){const o=ir(n,i_),r=Math.hypot(e[0],e[1],e[2])||1,a=[e[0]/r,e[1]/r,e[2]/r],l=a[0]*o.f[0]+a[1]*o.f[1]+a[2]*o.f[2],c=Math.acos(En(l,-1,1));let h=a[0]-l*o.f[0],u=a[1]-l*o.f[1],f=a[2]-l*o.f[2],d=Math.hypot(h,u,f);const g=En(c/(6*Ht),0,1),x=-o.f[1]*o.f[0],m=1-o.f[1]*o.f[1],p=-o.f[1]*o.f[2],y=Math.hypot(x,m,p)||1;d<1e-6&&(h=x,u=m,f=p,d=y);const v=h/d*g+x/y*(1-g),M=u/d*g+m/y*(1-g),S=f/d*g+p/y*(1-g),T=Math.atan2(v*o.r[0]+M*o.r[1]+S*o.r[2],v*o.u[0]+M*o.u[1]+S*o.u[2]),A=Xd(t.rollTable,n.V)*Ht,k=En(T*3,-1,1)*A,_=.5*Ji(n.y)*n.V*n.V,w=Math.min(i,Hn.maxCLFrac*_*t.S*t.clMax/(n.mass*Ye),t.gLimit),C=Math.cos(n.gamma)*Math.cos(n.phi);return{n:En(C+s*c*Math.max(0,Math.cos(T))*g+(1-g)*s*c*.5,-1,Math.max(1,w)),p:k}}const yn=xt.ship,Mi=(n,t,e)=>Math.max(t,Math.min(e,n)),s_=1/((1-yn.turnSpeedLoss)*(1-yn.turnSpeedLoss))-1;function cu(n,{x:t=0,z:e=0,heading:i=0,V:s=0}={}){return{x:t,z:e,heading:i,V:s,r:0,rudder:0,helm:0,telegraph:s/n.vmax,ordered:s/n.vmax,aground:!1}}const Yd=n=>n>=0?n*yn.telegraphSteps[yn.telegraphSteps.length-1]:n*.6,tc=(n,t)=>{const e=t/n.vmax;return e>=0?Mi(e/yn.telegraphSteps[yn.telegraphSteps.length-1],0,1):Mi(e/.6,-1,0)};function Zd(n,t,e,i,s,o=1,r=null){n.helm=Mi(e,-1,1),n.telegraph=Mi(i,-1,1);const a=r??n.helm*yn.rudderMaxDeg,l=2*yn.rudderMaxDeg/t.rudderS;n.rudder+=Mi(a-n.rudder,-l*s,l*s);let c=Yd(n.telegraph);n.ordered=c,c=Mi(c,-o*.6,o*yn.telegraphSteps[yn.telegraphSteps.length-1]);const h=c>=0?c*c:-.6*(c/.6)*(c/.6),u=n.V/t.vmax,f=t.vmax/t.radius/Ht,d=1+s_*Mi(Math.abs(n.r)/f,0,1.2)**2,g=u*Math.abs(u)*d;n.V+=t.tmax*(h-g)/t.mass*s,n.aground&&(n.V*=Math.max(0,1-s*.5));const x=Math.abs(n.V),m=yn.nomotoTK*t.L/Math.max(x,1),p=n.V/t.radius*(n.rudder/yn.rudderMaxDeg)/Ht;n.r+=(p-n.r)/m*s,n.heading=((n.heading+n.r*s)%360+360)%360;const y=n.heading*Ht;n.x+=n.V*Math.sin(y)*s,n.z-=n.V*Math.cos(y)*s}function o_(n,t,e,i){const s=((e-n.heading)%360+540)%360-180,o=n.r*(yn.nomotoTK*t.L/Math.max(Math.abs(n.V),1))*1.2;return{helm:Mi((s-o)/20,-1,1),telegraph:tc(t,i)}}const on={shell:0,bullet:1,bomb:2,torpedo:3},te={visual:1,player:2,armed:4,dud:8,hit:16,star:32};class a_{constructor(t){this.capacity=t,this.pos=new Float64Array(3*t),this.vel=new Float32Array(3*t),this.kind=new Uint8Array(t),this.calibreMm=new Float32Array(t),this.alive=new Uint8Array(t),this.owner=new Int16Array(t).fill(-1),this.weapon=new Int16Array(t).fill(-1),this.born=new Float64Array(t),this.salvo=new Int32Array(t),this.target=new Int16Array(t).fill(-1),this.flags=new Uint8Array(t),this.life=new Float32Array(t),this.aux=new Float32Array(t),this.free=[];for(let e=t-1;e>=0;e--)this.free.push(e);this.count=0,this.dropped=0}spawn(t,e,i,s,o,r,a,{calibreMm:l=0,owner:c=-1,weapon:h=-1,t:u=0,salvo:f=0,target:d=-1,flags:g=0,life:x=0,aux:m=0}={}){const p=this.free.pop();return p===void 0?(this.dropped++,-1):(this.pos[3*p]=e,this.pos[3*p+1]=i,this.pos[3*p+2]=s,this.vel[3*p]=o,this.vel[3*p+1]=r,this.vel[3*p+2]=a,this.kind[p]=t,this.calibreMm[p]=l,this.alive[p]=1,this.owner[p]=c,this.weapon[p]=h,this.born[p]=u,this.salvo[p]=f,this.target[p]=d,this.flags[p]=g,this.life[p]=x,this.aux[p]=m,this.count++,p)}kill(t){this.alive[t]&&(this.alive[t]=0,this.owner[t]=-1,this.free.push(t),this.count--)}clear(){for(let t=0;t<this.capacity;t++)this.alive[t]&&this.kill(t)}}const Xe={x:0,y:0,z:0,vx:0,vy:0,vz:0};function r_(n,t,e,i,s){const o=3*t;Xe.x=n.pos[o],Xe.y=n.pos[o+1],Xe.z=n.pos[o+2],Xe.vx=n.vel[o],Xe.vy=n.vel[o+1],Xe.vz=n.vel[o+2],s[0]=Xe.x,s[1]=Xe.y,s[2]=Xe.z,Bd(Xe,e,i),n.pos[o]=Xe.x,n.pos[o+1]=Xe.y,n.pos[o+2]=Xe.z,n.vel[o]=Xe.vx,n.vel[o+1]=Xe.vy,n.vel[o+2]=Xe.vz}function hu(n,t,e,i,s){const o=3*t;s[0]=n.pos[o],s[1]=n.pos[o+1],s[2]=n.pos[o+2];const r=n.vel[o],a=n.vel[o+1],l=n.vel[o+2],c=Math.hypot(r,a,l),h=e*c*i;n.vel[o]=r-r*h,n.vel[o+1]=a-a*h-9.80665*i,n.vel[o+2]=l-l*h,n.pos[o]+=(r+n.vel[o])*.5*i,n.pos[o+1]+=(a+n.vel[o+1])*.5*i,n.pos[o+2]+=(l+n.vel[o+2])*.5*i}function l_(n,t,e,i){const s=3*t;i[0]=n.pos[s],i[1]=n.pos[s+1],i[2]=n.pos[s+2];const o=n.vel[s],r=n.vel[s+2];n.pos[s]+=o*e,n.pos[s+2]+=r*e;const a=Math.hypot(o,r)*e;n.aux[t]+=a,n.life[t]-=a}const c_=n=>n>=20?6e-4:n>=12?4e-4:6e-4,h_=n=>n>=400?3e-5:n>=200?4e-5:6e-5;function u_(n,t,e,i=0,s=0){const o=t*Ht,r=e*Ht,a=Math.cos(r)*n;return[Math.sin(o)*a+i,Math.sin(r)*n,-Math.cos(o)*a+s]}function Tl(n,t,e,i,s){const o=i-t,r=s-e,a=Math.hypot(o,r),l=_i(n,a);return l?{az:(Math.atan2(o,-r)/Ht+360)%360,el:l.elev,tof:l.tof,range:a,dRdE:l.dRdE,fall:l.fall}:null}function d_(n){return{rangePct:n.startRangePct,mils:n.startMils,vx:0,vz:0,init:!1,lastHeading:null,lastSpeed:null,salvos:0,corrected:0}}function f_(n,t,e,i,s){if(!n.init){n.vx=t,n.vz=e,n.init=!0;return}const o=Math.min(1,i/s);n.vx+=(t-n.vx)*o,n.vz+=(e-n.vz)*o}function p_(n,t,e,i,s){if(n.refHeading==null){n.refHeading=e,n.refSpeed=i;return}const o=Math.abs((e-n.refHeading+540)%360-180),r=Math.abs(i-n.refSpeed);(o>t.resetTurnDeg||r>t.resetSpeedKn)&&(n.rangePct+=(t.startRangePct-n.rangePct)*t.resetShare,n.mils+=(t.startMils-n.mils)*t.resetShare,n.turnT=s,n.refHeading=e,n.refSpeed=i)}function m_(n,t,e,i){let s=!i&&n.corrected===0?t.blindFactor:1;return n.turnT!=null&&(s*=1+t.turnPenalty*Math.exp(-(e-n.turnT)/t.leadLagS)),s}function g_(n,t){n.rangePct=Math.max(t.floorRangePct,n.rangePct*(1-t.improve)),n.mils=Math.max(t.floorMils,n.mils*(1-t.improve)),n.corrected++}function Ra(n,t,e,i,s,o,r,a,l,c,h,u,f,d){const g=l*Ht,x=Math.cos(g),m=Math.sin(g),p=Math.sin(g),y=-Math.cos(g),v=(n-r)*x+(e-a)*m,M=-((n-r)*p+(e-a)*y),S=(i-r)*x+(o-a)*m,T=-((i-r)*p+(o-a)*y);let A=0,k=1;const _=(w,C,F,z)=>{const P=C-w;if(Math.abs(P)<1e-12)return w>=F&&w<=z;let B=(F-w)/P,X=(z-w)/P;return B>X&&([B,X]=[X,B]),B>A&&(A=B),X<k&&(k=X),A<=k};return!_(v,S,-c,c)||!_(M,T,-h,h)||!_(t,s,u,f)?-1:(d&&(d.s=A,d.lx=v+(S-v)*A,d.ly=t+(s-t)*A,d.lz=M+(T-M)*A),A)}function v_(n,t,e,i,s,o,r,a,l,c,h,u,f,d=1e6){const g=Ra(n,t,e,n+i*d,t+s*d,e+o*d,r,a,l,c,h,u,f,null);return g<0?-1:g*d}function x_(n,t,e,i,s,o,r,a,l,c){const h=i-n,u=s-t,f=o-e,d=h*h+u*u+f*f;let g=d>0?((r-n)*h+(a-t)*u+(l-e)*f)/d:0;g=Math.max(0,Math.min(1,g));const x=n+h*g-r,m=t+u*g-a,p=e+f*g-l;return c&&(c.s=g),x*x+m*m+p*p}function sr(n,t,e,i,s,o,r){const a=s*Ht,l=(n-e)*Math.cos(a)+(t-i)*Math.sin(a),c=-((n-e)*Math.sin(a)+(t-i)*-Math.cos(a)),h=Math.max(0,Math.abs(l)-o),u=Math.max(0,Math.abs(c)-r);return{d:Math.hypot(h,u),lx:l,lz:c}}const pi=xt.sight;function y_(n,t,e){const i=n/864e5+24405875e-1-2451545,s=(357.529+.98560028*i)*Ht,r=(280.459+.98564736*i+1.915*Math.sin(s)+.02*Math.sin(2*s))*Ht,a=(23.439-36e-8*i)*Ht,l=Math.atan2(Math.cos(a)*Math.sin(r),Math.cos(r)),c=Math.asin(Math.sin(a)*Math.sin(r)),u=(18.697374558+24.06570982441908*i)%24*15*Ht+e*Ht-l;return Math.asin(Math.sin(t*Ht)*Math.sin(c)+Math.cos(t*Ht)*Math.cos(c)*Math.cos(u))/Ht}const M_=n=>n>-.8?"day":n>-12?"twilight":"night";function uu(n,t,e){let i=!1;for(let s=0,o=e.length-1;s<e.length;o=s++){const[r,a]=e[s],[l,c]=e[o];a>t!=c>t&&n<(l-r)*(t-a)/(c-a)+r&&(i=!i)}return i}function du(n,t,e,i,s,o,r,a){const l=(e-n)*(a-o)-(i-t)*(r-s);if(Math.abs(l)<1e-9)return!1;const c=((s-n)*(a-o)-(o-t)*(r-s))/l,h=((s-n)*(i-t)-(o-t)*(e-n))/l;return c>=0&&c<=1&&h>=0&&h<=1}function fu(n,t,e,i,s,o){const r=s-e,a=o-i,l=r*r+a*a,c=l>0?Math.max(0,Math.min(1,((n-e)*r+(t-i)*a)/l)):0;return Math.hypot(e+r*c-n,i+a*c-t)}class __{constructor(t){var e;this.env=t,this.vis=Math.min(pi.dayM,((e=t.weather)==null?void 0:e.visibilityM)??pi.dayM),this.light="day",this.alt=90,this.smokes=[],this.lights=[],this.t=0}update(t){this.t=t,this.alt=y_(this.env.clock.utc(t),this.env.lat,this.env.lon),this.light=M_(this.alt),this.lights=this.lights.filter(e=>e.until>t)}addLight(t,e,i,s,o,r){this.lights.push({x:t,y:e,z:i,r:s,until:o,kind:r})}addSmoke(t,e,i,s,o,r,a,l){this.smokes.push({ax:t,az:e,bx:i,bz:s,t0:o,t1:r,vx:a,vz:l,r:pi.smokeRadiusM})}lit(t,e,i,s=!1){if(this.light==="day"||s)return!0;for(const o of this.lights)if(Math.hypot(o.x-t,o.z-i)<o.r)return!0;return!1}visualRange(t,e,i,s,o=!1){if(this.light==="day")return this.vis;if(this.lit(t,e,i,o))return Math.min(this.vis,pi.nightLitM);const a=s?pi.nightUnlitBigM:pi.nightUnlitSmallM;return this.light==="twilight"?Math.min(this.vis,a*1.8):a}weatherLimit(t,e,i,s,o,r){let a=1/0;const l=this.t;for(const c of this.env.squalls||[]){if(l<c.t0||l>c.t1||!c.poly.length)continue;const h=Number.isFinite(c.t0)?l-c.t0:0,u=c.vx*h,f=c.vz*h,d=uu(t-u,i-f,c.poly),g=uu(s-u,r-f,c.poly);let x=d||g;for(let m=0;!x&&m+1<c.poly.length;m++){const[p,y]=c.poly[m],[v,M]=c.poly[m+1];du(t-u,i-f,s-u,r-f,p,y,v,M)&&(x=!0)}x&&(a=Math.min(a,pi.squallVisM))}if(e<300||o<300)for(const c of this.smokes){if(l<c.t0||l>c.t1)continue;const h=l-c.t0,u=c.vx*h,f=c.vz*h,d=c.ax+u,g=c.az+f,x=c.bx+u,m=c.bz+f;(du(t,i,s,r,d,g,x,m)||fu(t,i,d,g,x,m)<c.r||fu(s,r,d,g,x,m)<c.r)&&(a=Math.min(a,c.r))}return a}sees(t,e){const i=Math.hypot(e.x-t.x,e.z-t.z);let s=0;for(const l of t.sensors||[]){const c=pi.radar[l]??0;(e.aircraft?l==="sc"||l==="sg":l!=="sc")&&(s=Math.max(s,c))}const o=this.env.world;if(!(!o||o.lineOfSight({x:t.x,y:Math.max(t.y,20),z:t.z},{x:e.x,y:Math.max(e.y,10),z:e.z})))return null;const a=Math.min(this.visualRange(e.x,e.y,e.z,e.big,e.lit),this.weatherLimit(t.x,t.y,t.z,e.x,e.y,e.z));return i<=a?{range:i,how:"visual"}:i<=s?{range:i,how:"radar"}:null}}const Jd=["flash","splash","hit","fire","smoke","explode","sink","fall","gone","wake","starshell","searchlight","tracer","launch","spawn","despawn"],zt=Object.fromEntries(Jd.map((n,t)=>[n,t])),Qd=["white","red","black","blue","yellow","green","orange"],b_=n=>Math.max(0,Qd.indexOf(String(n||"white").toLowerCase()));class w_{constructor(t){this.capacity=t,this.kindArr=new Uint8Array(t),this.t=new Float64Array(t),this.unit=new Int16Array(t),this.p=new Float64Array(3*t),this.d=new Float32Array(3*t),this.size=new Float32Array(t),this.data=new Float32Array(t),this.head=0,this.count=0,this.total=0,this.dropped=0,this.e={kind:"",k:0,t:0,unit:-1,x:0,y:0,z:0,dx:0,dy:0,dz:0,size:0,data:0}}push(t,e,i,s,o,{unit:r=-1,dx:a=0,dy:l=0,dz:c=0,size:h=0,data:u=0}={}){const f=this.head;this.count===this.capacity?this.dropped++:this.count++,this.kindArr[f]=typeof t=="number"?t:zt[t],this.t[f]=e,this.unit[f]=r,this.p[3*f]=i,this.p[3*f+1]=s,this.p[3*f+2]=o,this.d[3*f]=a,this.d[3*f+1]=l,this.d[3*f+2]=c,this.size[f]=h,this.data[f]=u,this.head=(f+1)%this.capacity,this.total++}drain(t){const e=this.count;let i=(this.head-e+this.capacity)%this.capacity;const s=this.e;for(let o=0;o<e;o++)s.k=this.kindArr[i],s.kind=Jd[s.k],s.t=this.t[i],s.unit=this.unit[i],s.x=this.p[3*i],s.y=this.p[3*i+1],s.z=this.p[3*i+2],s.dx=this.d[3*i],s.dy=this.d[3*i+1],s.dz=this.d[3*i+2],s.size=this.size[i],s.data=this.data[i],t(s),i=(i+1)%this.capacity;this.count=0}clear(){this.count=0}}const S_={hit:"hit","torpedo-hit":"torpedo hit","near-miss":"near miss",fire:"on fire",flood:"flooding",list:"listing","dead-in-water":"dead in the water",explodes:"explosion",sinks:"sinks",scuttled:"scuttled",abandoned:"abandon ship",launches:"launching",recovers:"recovering aircraft",turns:"turns","opens-fire":"opens fire","ceases-fire":"ceases fire","torpedoes-fired":"torpedoes in the water","smoke-screen":"making smoke",searchlight:"searchlight on",illuminated:"illuminated",starshell:"star shell","steering-jammed":"steering jammed","power-failure":"power lost","radar-lost":"radar out",collision:"collision",signal:"signal",sighted:"sighted",withdraws:"withdraws",aground:"aground"};function Pn(n,t,e=""){if(t.text)return t.text;let i=S_[t.kind]||t.kind;return(t.kind==="hit"||t.kind==="torpedo-hit"||t.kind==="near-miss")&&t.where&&(i=`${i} ${t.where}`),e&&(i=`${i}${e}`),`${n}: ${i}`}function E_(n,t){if(n>=t)return 0;const e=xt.aa.fullWithin*t;return n<=e?1:(t-n)/(t-e)}function T_(n,t,{bearing:e=xt.aa.bearingShare,scale:i=1}={}){let s=0;for(const o of n.aa)t<o.rangeM&&(s+=o.lambda*o.barrels*e*E_(t,o.rangeM));return s*i}const A_=n=>n.aa.reduce((t,e)=>Math.max(t,e.rangeM),0);function C_(n,t,{peacetime:e=!1}={}){return e?xt.aa.era["us-1941"]:xt.aa.era[nM(n,t)]??.8}const R_=n=>xt.aa.aspect[n]??xt.aa.aspect.crossing,L_=(n,t)=>t==null?0:Math.max(0,Math.min(1,(n-t)/xt.aa.alertRampS));function k_(n,t,e){if(n<=0)return null;const i=1/xt.aa.hitsPerKill;return e.next()<n/i*t?e.next()<i?"kill":"hit":null}function P_(n,t,e){let i="light";for(const s of n.aa)t<s.rangeM&&(s.cls==="heavy"||s.cls==="medium"&&i==="light")&&(i=s.cls);return Math.min(.75,xt.aa.burstDamage[i]*(.4+.4*e.next()))}const Fn=(n,t,e)=>Math.max(t,Math.min(e,n)),pu=n=>Date.parse(String(n).length<=7?`${n}-01T00:00Z`:String(n).length<=10?`${n}T00:00Z`:n);function z_(n,t,e,i){var o;const s={pitch:0,roll:0,yaw:0,throttle:.8,helm:0,telegraph:0,aimAz:e.heading[i],aimEl:0,aimRange:null,aa:!1,aaDir:null,aaTarget:-1,fireHeld:!1,fireCount:0,bombCount:0,torpedoCount:0,salvoCount:0,starshellCount:0,look:[0,0],view:null,aimDir:null,mode:"aim",brakes:null,spread:"narrow",battery:0};return n==="ship"?(s.telegraph=tc(t.model,e.speed[i]),s.aimAz=e.heading[i]+90):s.throttle=((o=t.body)==null?void 0:o.throttle)??.8,s}function ec(n,t){return n._X[t].model.batteries.map(i=>({battery:i,wi:n.weaponIdx(i.weapon),mounts:i.mounts.map(s=>({...s,bearing:s.rest,elev:0,readyAt:n.t+Math.random()*0+i.reloadS*.3}))}))}function Al(n){var t;return{guns:n.guns.map(e=>({...e,left:e.rounds*e.count})),bombs:n.payload.reduce((e,i)=>e+i.count,0),bomb:((t=n.payload[0])==null?void 0:t.weapon)??null,torpedoes:n.torpedo?1:0,nextShot:0}}function D_(n,t){const e=n.player;if(!e||e.kind!=="aircraft"||!t.start)return;const i=t.start,o=n._X[e.unitIndex].body;let r=0,a=0;const l=i.from?n.record.shipById.get(i.from):null;if(l)r=n.state.pos[3*l.slot],a=n.state.pos[3*l.slot+2];else if(i.from&&n.record.siteById.get(i.from)){const u=n.record.siteById.get(i.from);r=u.x,a=u.z}else i.lonlat&&([r,a]=n.proj.toWorld(i.lonlat));const[c,h]=Te(i.bearingDeg??0);o.x=r+c*(i.rangeM??0),o.z=a+h*(i.rangeM??0),o.y=i.altM??o.y,o.V=i.speedMs??o.V,o.psi=(i.headingDeg??n.state.heading[e.unitIndex])*Ht,o.gamma=0,o.phi=0,o.p=0,or(n,e.unitIndex),n._setAlive(e.unitIndex,1)}function or(n,t){const i=n._X[t].body,s=n.state,o=3*t;s.pos[o]=i.x,s.pos[o+1]=i.y,s.pos[o+2]=i.z;const r=Math.cos(i.gamma)*i.V;s.vel[o]=r*Math.sin(i.psi),s.vel[o+1]=Math.sin(i.gamma)*i.V,s.vel[o+2]=-r*Math.cos(i.psi),s.speed[t]=i.V,s.heading[t]=(i.psi/Ht+360)%360,n_(i,s.quat,4*t),s.damage[t]=Math.min(1,i.damage),s.fire[t]=i.burning>0?1:0}function tf(n,t){var u;const e=n._X[t],i=e.body,s=n.state,o=3*t;s.pos[o]=i.x,s.pos[o+2]=i.z;const r=(u=e.dmg)==null?void 0:u.sinking;let a=0,l=0,c=e.dmg?e.dmg.list:0;if(r){const f=Fn((n.t-e.dmg.sinkAt)/Math.max(1,e.dmg.goneAt-e.dmg.sinkAt),0,1);a=-(e.model.top+e.model.T+4)*f*f,l=e.dmg.sinkHow==="capsizes"?.05*f:.15*f,c+=e.dmg.sinkHow==="capsizes"?120*f*Math.sign(c||1):6*f}s.pos[o+1]=a;const h=i.heading*Ht;s.vel[o]=i.V*Math.sin(h),s.vel[o+1]=0,s.vel[o+2]=-i.V*Math.cos(h),s.speed[t]=Math.abs(i.V),s.heading[t]=i.heading,s.list[t]=e.dmg?e.dmg.list:0,Ga(-h,l,-c*Ht,s.quat,4*t)}function I_(n,t,e){const i=n.state,s=i.heading[t]*Ht,o=Math.sin(s),r=-Math.cos(s);return[i.pos[3*t]+Math.cos(s)*e.x-o*e.z,e.y,i.pos[3*t+2]+Math.sin(s)*e.x-r*e.z]}function U_(n){const t=n.state,e=n._air||(n._air=[]);e.length=0;for(let i=0;i<n.capacity;i++)t.alive[i]===1&&n.units[i].kind==="aircraft"&&!n.units[i].parked&&e.push(i);return e}function F_(n,t,e,i,s){const o=n.state,r=[],a=s*s;for(const l of n._air||[]){const c=o.pos[3*l]-t,h=o.pos[3*l+1]-e,u=o.pos[3*l+2]-i;c*c+h*h+u*u<a&&r.push(l)}return r}function N_(n,t){U_(n);const e=n.state,i=n.player,s=n._X;n._thinkT=(n._thinkT??0)-t,n._thinkT<=0&&(n._thinkT=1,i&&e.alive[i.unitIndex]===1&&O_(n),G_(n),B_(n));for(let o=0;o<n.capacity;o++){const r=n.units[o];if(r.authority!=="ai"||!e.alive[o])continue;const a=s[o];r.kind==="ship"?$_(n,o,a,t):e.alive[o]===1&&W_(n,o,a)}}function O_(n){var c,h,u,f,d;const t=n.player,e=n.state,i=n._X,s=t.unitIndex,o=n.units[s],r=e.pos[3*s],a=e.pos[3*s+1],l=e.pos[3*s+2];if(t.kind==="aircraft"){let g=0;for(const x of n._air)n.units[x].authority==="ai"&&((c=i[x].ai)==null?void 0:c.mode)==="fight"&&i[x].ai.target===s&&g++;if(g<4){const x=[];for(const m of n._air){const p=n.units[m];if(p.authority!=="record"||p.side===o.side)continue;const y=i[m].g,v=(h=y==null?void 0:y.attack)==null?void 0:h.profile;if(v!=="cap"&&v!=="escort"&&i[m].model.type!=="fighter")continue;const M=Math.hypot(e.pos[3*m]-r,e.pos[3*m+1]-a,e.pos[3*m+2]-l);M>xt.cap.engageRadiusM||n.sight.sees({x:e.pos[3*m],y:e.pos[3*m+1],z:e.pos[3*m+2],sensors:[]},{x:r,y:a,z:l,big:!1,aircraft:!0})&&x.push([M,m])}x.sort((m,p)=>m[0]-p[0]);for(const[,m]of x.slice(0,4-g))n._toAI(m),i[m].ai.mode="fight",i[m].ai.target=s}if(o.groupIndex>=0&&i[s].model.type==="fighter"){const x=n._air.find(m=>{var p;return n.units[m].authority==="ai"&&((p=i[m].ai)==null?void 0:p.mode)==="fight"&&i[m].ai.target===s&&Math.hypot(e.pos[3*m]-r,e.pos[3*m+2]-l)<1200});if(x!=null){const m=n._air.find(p=>{var y;return p!==s&&n.units[p].groupIndex===o.groupIndex&&(n.units[p].authority==="record"||((y=i[p].ai)==null?void 0:y.mode)==="rejoin")});m!=null&&!n._air.some(p=>{var y;return((y=i[p].ai)==null?void 0:y.mode)==="fight"&&i[p].ai.target===x&&n.units[p].side===o.side})&&(n._toAI(m),i[m].ai.mode="fight",i[m].ai.target=x)}}}else if(ri(n,s)){for(const g of n.record.groups)if((f=(u=g.attack)==null?void 0:u.targets)!=null&&f.some(x=>{var m;return x.unit>=0&&((m=n.record.ships[x.unit])==null?void 0:m.slot)===s}))for(const x of g.aircraft){if(((d=n.record.ships[x.target??g.attack.targetUnit])==null?void 0:d.slot)!==s)continue;const m=x.slot;m==null||n.units[m].authority!=="record"||e.alive[m]!==1||x.releaseT==null||n.t<x.releaseT-150||n.t>x.releaseT+30||(n._toAI(m),i[m].ai.mode=g.attack.profile==="torpedo"?"torpedo":g.attack.profile==="level"?"level":"dive",i[m].ai.target=s,i[m].ai.from=g.attack.fromDeg??_e(e.pos[3*m]-e.pos[3*s],e.pos[3*m+2]-e.pos[3*s+2]),i[m].ai.pushOver=g.attack.pushOverM??Math.max(1500,e.pos[3*m+1]),i[m].ai.releaseM=g.attack.releaseM??600)}}}function B_(n){var e,i;const t=n.state;for(const s of n.record.ships){if(!((e=s.ready)!=null&&e.length)||s.sinkT==null)continue;const o=s.slot,r=n._X[o],a=r.dmg;if(!(!r.touched||a.regime!=="sim"||a.doomed||a.sinking||a.out||t.alive[o]!==1)){r.launched||(r.launched=new Set);for(const[l,c]of s.ready.entries()){const h=(typeof c.t=="number"?c.t:n.clock.parse(c.t))+1800;if(r.launched.has(l)||n.t<h)continue;r.launched.add(l);let u=-1,f=1/0;for(const x of n.record.ships){const m=x.slot;if(x.side===s.side||!ri(n,m)||!((i=n._X[m].model)!=null&&i.carrier))continue;const p=Math.hypot(t.pos[3*m]-t.pos[3*o],t.pos[3*m+2]-t.pos[3*o+2]);p<f&&(f=p,u=m)}if(u<0)continue;const d=r.model;let g=0;for(let x=0;x<(c.count??6);x++){const m=n._allocSpare(c.kit,"aircraft");if(m<0)break;const p=n._X[m],y=t.heading[o]*Ht;p.body=H_(p.model,t.pos[3*o]+Math.sin(y)*(x*30-d.L*.3),(d.fdTop??20)+30+x*15,t.pos[3*o+2]-Math.cos(y)*(x*30-d.L*.3),t.heading[o]),p.ai=Cl(n,m);const v=p.model.torpedo?"torpedo":"dive";Object.assign(p.ai,{mode:v,target:u,from:_e(t.pos[3*o]-t.pos[3*u],t.pos[3*o+2]-t.pos[3*u+2]),pushOver:4e3,releaseM:600,phase:"approach"}),p.ammo=Al(p.model),n.units[m].side=s.side,n._setAlive(m,1),g++}g&&(n._guess||(n._guess=[]),n._guess.push({unit:s.id,t:n.t,text:`${s.name}: ${g} aircraft launched against ${n.units[u].name}: the sim's guess; the record has no such strike`}),n.beat(o,"launches",`${s.name}: launching (the sim's guess; the record has no such strike)`))}}}}function H_(n,t,e,i,s){return{...El(n),x:t,y:e,z:i,psi:s*Ht}}function G_(n){var i;const t=n.state,e=n._X;n._signalled||(n._signalled=new Set);for(const s of n.record.ships){const o=s.slot;if(!(s.side!=="jp"||t.alive[o]!==1||n.units[o].kind!=="ship"))for(const r of n.record.groups){if(r.side==="jp"||n._signalled.has(`${o}:${r.index}`))continue;const a=r.aircraft.find(u=>u.slot!=null&&t.alive[u.slot]===1);if(!a)continue;const l=a.slot,c=Math.hypot(t.pos[3*l]-t.pos[3*o],t.pos[3*l+2]-t.pos[3*o+2]);if(c>15e3||!n.sight.sees({x:t.pos[3*o],y:30,z:t.pos[3*o+2],sensors:[]},{x:t.pos[3*l],y:t.pos[3*l+1],z:t.pos[3*l+2],big:!0,aircraft:!0}))continue;n._signalled.add(`${o}:${r.index}`);const h=2500/c;for(let u=0;u<2;u++)n.fx(zt.flash,t.pos[3*o]+(t.pos[3*l]-t.pos[3*o])*h+u*60,Math.min(3e3,t.pos[3*l+1]*.6),t.pos[3*o+2]+(t.pos[3*l+2]-t.pos[3*o+2])*h,{unit:o,size:2,data:1});(i=e[o]).sighted??(i.sighted={}),e[o].sighted[r.index]=n.t}}}function mu(n,t){return{engaged:!1,evadeUntil:-1,evadeTurn:0,evadeDv:0,sol:d_(xt.aiGun),guns:ec(n,t),target:-1,salvos:new Map,lastSeenT:-1e9}}function $_(n,t,e,i){var p,y;const s=n.state,o=e.ai,r=e.rec,a={x:0,z:0,vx:0,vz:0,heading:0,speed:0};let l=s.heading[t],c=s.speed[t];if(r&&(r.track||r.station)){n.record.motion.pose(r.index,n.t+60,a);const v=a.x-e.body.x,M=a.z-e.body.z;l=Math.hypot(v,M)>50?_e(v,M):a.heading,n.record.motion.pose(r.index,n.t,a),c=Math.max(a.speed,0);const S=Math.hypot(a.x-e.body.x,a.z-e.body.z);S>300&&(c=Math.min(e.model.vmax,c+Math.min(5*Ne,S/300)))}n.t<o.evadeUntil&&(l=(a.heading+o.evadeTurn+360)%360,c=Fn(c+o.evadeDv,0,e.model.vmax));const h=o_(e.body,e.model,l,c);o.helm=h.helm,o.telegraph=h.telegraph;const u=n.player;if(!u||u.kind!=="ship"||!o.engaged||(p=e.dmg)!=null&&p.out||(y=e.dmg)!=null&&y.sinking)return;const f=u.unitIndex;if(!ri(n,f)||n.units[f].side===n.units[t].side)return;const d=s.pos[3*f],g=s.pos[3*f+2],x={x:s.pos[3*t],y:e.model.top*.8,z:s.pos[3*t+2],sensors:e.model.sensors},m=n.sight.sees(x,{x:d,y:10,z:g,big:!0,lit:n._X[f].litUntil>n.t});if(m){o.lastSeenT=n.t,f_(o.sol,s.vel[3*f],s.vel[3*f+2],i,xt.aiGun.leadLagS),p_(o.sol,xt.aiGun,s.heading[f],s.speed[f]/Ne,n.t);for(const v of o.guns){const M=v.battery,S=Math.hypot(d-s.pos[3*t],g-s.pos[3*t+2]);if(S>M.table.maxRange*.98||M.role!=="main"&&o.guns[0].battery.table.maxRange>S&&o.guns[0].mounts.some(A=>A.readyAt>n.t))continue;const T=v.mounts.filter(A=>A.readyAt<=n.t&&ef(n,t,A,d,g));if(!(!T.length||T.length<Math.ceil(v.mounts.length*.3))){V_(n,t,e,v,T,f,m);break}}}}function ef(n,t,e,i,s){const o=n.state,r=_e(i-o.pos[3*t],s-o.pos[3*t+2]);return zs(e.arc,(r-o.heading[t]+360)%360)}function V_(n,t,e,i,s,o,r){const a=n.state,l=e.ai,c=i.battery;c.weapon;const h=c.table,u=l.sol;let f=a.pos[3*o],d=a.pos[3*o+2];for(let B=0;B<2;B++){const X=Tl(h,a.pos[3*t],a.pos[3*t+2],f,d);if(!X)return;f=a.pos[3*o]+u.vx*X.tof,d=a.pos[3*o+2]+u.vz*X.tof}const g=n.rngs.gun,x=Math.hypot(f-a.pos[3*t],d-a.pos[3*t+2]),m=n.aid==="guided"?2:1,p=n.sight.light==="day"||n._X[o].litUntil>n.t||n.sight.lit(f,0,d)||r.how==="radar"&&xt.aiGun.spotNightRadar,y=m_(u,xt.aiGun,n.t,p)*m,v=u.rangePct*y*x/100,M=u.mils*y*x/1e3,S=xt.aiGun.turretShare,T=Math.sqrt(Math.max(0,1-S*S)),A=g.gauss()*v*T,k=g.gauss()*M*T,_=_e(f-a.pos[3*t],d-a.pos[3*t+2]),[w,C]=Te(_),F=f+w*A+C*-k,z=d+C*A-w*-k,P=n._salvo++;l.salvos.set(P,{seenAtFire:r.how,t:n.t,x:F,z}),$a(n,t,i,s,F,z,{salvo:P,target:o,player:!1,mountError:()=>[g.gauss()*v*S,g.gauss()*M*S],ux:w,uz:C}),u.salvos++}function $a(n,t,e,i,s,o,{salvo:r,target:a,player:l,star:c=!1,fuze:h=0,mountError:u=null,ux:f=0,uz:d=0}){const g=n.state,x=e.battery,m=x.weapon,p=x.table,y=m.dispersion||{rangePct:1.2,mils:2.5},v=n.rngs.gun,M=g.vel[3*t],S=g.vel[3*t+2];let T=0;for(const A of i){const[k,_,w]=I_(n,t,A);let C=s,F=o;if(u){const[B,X]=u();C+=f*B+d*-X,F+=d*B-f*-X}let z=Tl(p,k,w,C,F);if(!z)continue;const P=z.range/Math.max(1,m.mvMs*Math.cos(z.el*Ht)*z.tof);z=Tl(p,k,w,C-M*z.tof*P,F-S*z.tof*P)||z,A.bearing=(z.az-g.heading[t]+360)%360,A.elev=z.el,A.readyAt=n.t+x.reloadS;for(let B=0;B<x.barrels;B++){const X=y.rangePct/100*z.range/3.5,J=v.gauss()*X/Math.max(1,z.dRdE),Z=v.gauss()*y.mils/3.5/1e3/Ht,[Y,st,tt]=u_(m.mvMs,z.az+Z,z.el+J,M,S);n.projectiles.spawn(on.shell,k,_,w,Y,st,tt,{calibreMm:m.calibreMm,owner:t,weapon:e.wi,t:n.t,salvo:r,target:a,flags:(l?te.player:0)|(c?te.star:0),life:h})>=0&&T++}n.fx(zt.flash,k,_+2,w,{unit:t,dx:Math.sin(z.az*Ht),dz:-Math.cos(z.az*Ht),size:m.calibreMm/100})}return n._X[t].litUntil=n.t+xt.sight.flashRevealS,n.sight.light!=="day"&&n.sight.addLight(g.pos[3*t],30,g.pos[3*t+2],400,n.t+xt.sight.flashRevealS,"flash"),T}function Cl(n,t,{rejoin:e=!1}={}){const i=n.units[t].side==="jp"&&n.year<=1942,s=n.rngs.ai;return{mode:e?"rejoin":"fight",target:-1,reaction:i?xt.cap.reactionS[0]:xt.cap.reactionS[0]+s.next()*(xt.cap.reactionS[1]-xt.cap.reactionS[0]),leadMils:i?xt.cap.leadMils[0]:xt.cap.leadMils[0]+s.next()*(xt.cap.leadMils[1]-xt.cap.leadMils[0]),maxG:i?xt.cap.maxG[1]:xt.cap.maxG[0],aimAt:0,aim:[0,0,-1],leadErr:[0,0],burstUntil:-1,nextBurst:0,breakUntil:-1,phase:"approach",released:!1}}function W_(n,t,e,i){var l,c,h;const s=n.state,o=e.ai,r=e.body,a=n.t;if(r.x,r.y,r.z,o.mode==="fight"){const u=o.target;if(u<0||s.alive[u]!==1||!e.ammo||e.ammo.guns.every(x=>x.left<=0)||r.damage>.5){o.mode="rejoin";return}if(a>=o.aimAt){o.aimAt=a+o.reaction;const x=s.pos[3*u],m=s.pos[3*u+1],p=s.pos[3*u+2],y=Math.hypot(x-r.x,m-r.y,p-r.z),v=((c=(l=e.model.guns[0])==null?void 0:l.weapon)==null?void 0:c.mvMs)??800,M=y/(v+r.V),S=n.rngs.ai;o.leadErr=[S.gauss()*o.leadMils*.001*y,S.gauss()*o.leadMils*.001*y],o.tgt=[x+s.vel[3*u]*M+o.leadErr[0],m+s.vel[3*u+1]*M+o.leadErr[1],p+s.vel[3*u+2]*M],o.dist=y}if(a<o.breakUntil){o.aim=[Math.sin(r.psi)*.6,.8,-Math.cos(r.psi)*.6];return}o.aim=[o.tgt[0]-r.x,o.tgt[1]-r.y,o.tgt[2]-r.z];const f=ir(r).f,d=Math.hypot(...o.aim)||1,g=Math.acos(Fn((o.aim[0]*f[0]+o.aim[1]*f[1]+o.aim[2]*f[2])/d,-1,1))/Ht;o.dist<xt.cap.fireRangeM&&g<xt.cap.leadTolDeg*3&&a>=o.nextBurst&&(o.burstUntil=a+xt.cap.burstS[0]+n.rngs.ai.next()*(xt.cap.burstS[1]-xt.cap.burstS[0]),o.nextBurst=o.burstUntil+1.5),o.dist<120&&(o.breakUntil=a+4);return}if(o.mode==="dive"||o.mode==="torpedo"||o.mode==="level")return j_(n,t,e);if(e.ac&&e.ac.plan){const u={x:0,y:0,z:0};Qi(e.ac,a+20,u,{motion:n.record.motion,groups:n.record.groups}),o.aim=[u.x-r.x,u.y-r.y,u.z-r.z],Math.hypot(...o.aim)<300&&!e.lostAt&&n.units[t].authority==="ai"&&a<e.ac.endT&&(n.units[t].authority="record",e.prev=null,e.body=null,e.ai=null)}else o.aim=[Math.sin(r.psi),.05,-Math.cos(r.psi)],o.homeT??(o.homeT=a+900),a>o.homeT&&((h=n.player)==null?void 0:h.unitIndex)!==t&&n._setAlive(t,0)}function j_(n,t,e,i){const s=n.state,o=e.ai,r=e.body,a=o.target;if(a<0||s.alive[a]!==1){o.mode="rejoin";return}const l=s.pos[3*a],c=s.pos[3*a+2],h=s.vel[3*a],u=s.vel[3*a+2],[f,d]=Te(o.from),g=n.rngs.ai;if(o.mode==="dive"){const x=o.pushOver,m=o.releaseM,p=70*Ht,y=m/Math.tan(p)+150,v=[l+f*(y+(x-m)/Math.tan(p)),x,c+d*(y+(x-m)/Math.tan(p))];if(o.phase==="approach")o.aim=[v[0]-r.x,(v[1]-r.y)*.5,v[2]-r.z],Math.hypot(v[0]-r.x,v[2]-r.z)<400&&(o.phase="dive");else if(o.phase==="dive"){o.cep??(o.cep=[g.gauss()*xt.aiDive.cepVeteranM,g.gauss()*xt.aiDive.cepVeteranM]);const M=Math.sqrt(2*Math.max(50,r.y)/Ye)*.8,S=[l+h*M+o.cep[0],0,c+u*M+o.cep[1]];o.aim=[S[0]-r.x,S[1]-r.y,S[2]-r.z],r.y<=m+20&&!o.released&&(Ll(n,t,e,!1),o.released=!0,o.phase="pullout",o.until=n.t+6)}else o.phase==="pullout"&&(o.aim=[-f,.5,-d],n.t>o.until&&(o.phase="egress",o.mode="rejoin"))}else if(o.mode==="torpedo"){const x=e.model.torpedo,m=(((x==null?void 0:x.speedKn)??33)||33)*Ne,p=900,y=p/m*(1+g.gauss()*xt.aiTorpedo.leadErrDeg/30),v=[l+h*y,c+u*y],M=[v[0]+f*p,v[1]+d*p],S=Math.hypot(M[0]-r.x,M[1]-r.z);if(o.phase==="approach"){const A=S>6e3?Math.max(300,r.y-200):40;o.aim=[M[0]+f*3e3-r.x,(A-r.y)*.3,M[1]+d*3e3-r.z],Math.hypot(M[0]+f*3e3-r.x,M[1]+d*3e3-r.z)<700&&(o.phase="run")}else o.phase==="run"?(o.aim=[v[0]-r.x,(Math.min(30,(x==null?void 0:x.dropAltM)??30)-r.y)*.2,v[1]-r.z],r.throttle=.6,(S<150||Math.hypot(v[0]-r.x,v[1]-r.z)<p)&&(of(n,t,e,!1),o.phase="egress",o.until=n.t+20)):(o.aim=[-d,.15,f],n.t>o.until&&(o.mode="rejoin"))}else{const x=Math.max(1500,r.y),m=Math.sqrt(2*x/Ye),p=[l-f*r.V*m*-1,c-d*r.V*m*-1];o.aim=[p[0]-r.x,0,p[1]-r.z],Math.hypot(p[0]-r.x,p[1]-r.z)<120&&!o.released&&(Ll(n,t,e,!1),o.released=!0,o.mode="rejoin")}}function X_(n,t){const e=n.player;if(!e)return;const i=e.unitIndex;if(!n.state.alive[i])return;const o=n._X[i];return e.kind==="ship"?q_(n,e,i,o,t):eb(n,e,i,o,t)}function q_(n,t,e,i,s){var f;const o=n.state,r=t.input,a=i.dmg;if(o.alive[e]===1&&(Zd(i.body,i.model,r.helm,r.telegraph,s,jd(a,i.model,n.t),a.rudderJam),nf(n,e,i)),tf(n,e),o.alive[e]!==1||a.out)return;const l=r.aimAz??o.heading[e];for(const d of i.guns){const g=d.battery;for(const x of d.mounts){const m=(l-o.heading[e]+360)%360;if(zs(x.arc,m)){const y=Vs(m-x.bearing);x.bearing=(x.bearing+Fn(y,-g.traverseDegS*s,g.traverseDegS*s)+360)%360}let p=r.aimEl??0;if(r.aimRange!=null){const y=_i(g.table,r.aimRange);p=y?y.elev:g.maxElevDeg}x.elev+=Fn(p-x.elev,-8*s,8*s)}}const c=t._seen,h=Fn(r.battery|0,0,i.guns.length-1),u=r.salvoCount>c.salvoCount||r.fireHeld;if(c.salvoCount=r.salvoCount,u&&i.guns.length){const d=i.guns[h],g=d.mounts.filter(x=>x.readyAt<=n.t&&zs(x.arc,(l-o.heading[e]+360)%360)&&Math.abs(Vs(l-o.heading[e]-x.bearing))<1.5);if(g.length&&(!r.fireHeld||r.salvoCount>0||!0)){const x=a.crippled?Math.ceil(g.length/2):g.length,m=r.aimRange??(_i(d.battery.table,1e4)?1e4:d.battery.table.maxRange*.5),[p,y]=Te(l),v=o.pos[3*e]+p*m,M=o.pos[3*e+2]+y*m,S=n._salvo++,T=$a(n,e,d,g.slice(0,x),v,M,{salvo:S,target:-1,player:!0});if(T){const A=n._score;A.salvos++,A.shells+=T;const k=((f=_i(d.battery.table,m))==null?void 0:f.tof)??0;t.lastSalvo={id:S,t:n.t,tof:k,landsAt:n.t+k,tags:[],range:m}}}}if(r.starshellCount>c.starshellCount){c.starshellCount=r.starshellCount;const d=i.guns.find(g=>g.battery.role!=="main"&&g.battery.weapon.calibreMm>=100)||i.guns[0];if(d){const g=d.mounts.find(x=>x.readyAt<=n.t&&zs(x.arc,(l-o.heading[e]+360)%360));if(g){const x=Math.min((r.aimRange??8e3)+500,d.battery.table.maxRange*.95),[m,p]=Te(l),y=_i(d.battery.table,x);$a(n,e,d,[g],o.pos[3*e]+m*x,o.pos[3*e+2]+p*x,{salvo:n._salvo++,target:-1,player:!0,star:!0,fuze:((y==null?void 0:y.tof)??20)*.93})}}}if(r.torpedoCount>c.torpedoCount&&(c.torpedoCount=r.torpedoCount,Y_(n,e,i,l,r.aimRange,r.spread)),r.aa){let d=r.aaTarget??-1;d<0&&r.aaDir&&(d=K_(n,e,r.aaDir)),d>=0&&(t.aaTarget=d,t.aaUntil=n.t+xt.aa.directS)}}function K_(n,t,e){const i=n.state,s=i.pos[3*t],o=20,r=i.pos[3*t+2],a=Math.hypot(e[0],e[1],e[2])||1;let l=-1,c=15*Ht;for(const h of n._air||[]){if(n.units[h].side===n.units[t].side)continue;const u=i.pos[3*h]-s,f=i.pos[3*h+1]-o,d=i.pos[3*h+2]-r,g=Math.hypot(u,f,d);if(g>8e3)continue;const x=Math.acos(Fn((u*e[0]+f*e[1]+d*e[2])/(g*a),-1,1));x<c&&(c=x,l=h)}return l}function Y_(n,t,e,i,s,o){var M;const r=n.state,a=e.model.torp;if(!a||!e.torpedoes||e.torpedoes.ready<=0||!a.weapon)return;const l=(i-r.heading[t]+360)%360;if(!((a.side??"centre")==="centre"?l>=30&&l<=150||l>=210&&l<=330:a.side==="starboard"?l>=30&&l<=150:a.side==="port"?l>=210&&l<=330:!0)){n.player&&(n.player.notice="the tubes do not bear");return}const u=a.weapon,f=(M=u.settings)!=null&&M.length?u.settings:[{speedKn:u.speedKn??40,rangeM:u.rangeM??8e3}],d=s??6e3,g=[...f].sort((S,T)=>T.speedKn-S.speedKn).find(S=>S.rangeM>=d*1.05)||f.reduce((S,T)=>T.rangeM>S.rangeM?T:S),x=a.barrels??4,m=o==="wide"?xt.torpedo.spreadWideDeg:xt.torpedo.spreadNarrowDeg,p=n.weaponIdx(u),y=nc(u,n.date),v=r.heading[t]*Ht;for(let S=0;S<x;S++){const T=(i+(S-(x-1)/2)*m)*Ht,A=g.speedKn*Ne;n.projectiles.spawn(on.torpedo,r.pos[3*t]+Math.cos(v)*4,-4,r.pos[3*t+2]+Math.sin(v)*4,Math.sin(T)*A,0,-Math.cos(T)*A,{calibreMm:u.calibreMm??533,owner:t,weapon:p,t:n.t,flags:te.player|(n.rngs.dmg.chance(y)?te.dud:0),life:g.rangeM})>=0&&n._score.torpedoes++}e.torpedoes.ready--,n.fx(zt.launch,r.pos[3*t],3,r.pos[3*t+2],{unit:t,data:3})}function nc(n,t){var e;for(const i of n.failRate||[])if(t>=pu(i.from)&&t<pu(i.to))return i.rate??xt.torpedo.failDefault;return(e=n.failRate)!=null&&e.length?0:xt.torpedo.failDefault}const Z_={a6m2:"Zero",a6m5:"Zero",d3a1:"Type 99 carrier bomber",b5n2:"Type 97 carrier attack plane",d4y1:"Suisei",b6n2:"Tenzan",e13a1:"Type 0 reconnaissance seaplane",f1m2:"Type 0 observation seaplane","f4f-3":"Wildcat","f4f-4":"Wildcat","fm-2":"Wildcat","f6f-3":"Hellcat","f2a-3":"Buffalo","sbd-3":"Dauntless","sb2u-3":"Vindicator","tbd-1":"Devastator","tbf-1":"Avenger","tbm-1c":"Avenger","p-40b":"P-40B","p-36a":"P-36A","pby-5":"Catalina","b-17e":"B-17","b-26":"B-26","b-18":"B-18","a-20":"A-20"},J_=/^(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+\S+\s+of\s+/i,Q_=n=>n.charAt(0).toUpperCase()+n.slice(1);function tb(n,t){var r,a;const e=n.units[t],i=Z_[e.kit]??String(((r=n._X[t].model)==null?void 0:r.name)??e.kit??"aircraft").split(/\s+/).pop(),s=`${/^[AEIOU]/.test(i)?"an":"a"} ${i}`;let o=e.groupIndex>=0?(a=n.record.groups[e.groupIndex])==null?void 0:a.name:null;return o?(o=o.replace(J_,"").replace(/^The\b/,"the"),/^[a-z0-9]/.test(o)&&!/^the\b/.test(o)&&(o=`the ${o}`),`${s} of ${o}`):s}function Ri(n,t){var i;const e=n.player;return Q_(e&&e.unitIndex===t&&((i=e.role)!=null&&i.name)?e.role.name:tb(n,t))}function nf(n,t,e){const i=e.body,s=e.model,[o,r]=Te(i.heading);n.world.metresAt(i.x+o*s.L*.45,i.z+r*s.L*.45)>-s.T*.8&&!i.aground&&(i.aground=!0,n.beat(t,"aground",`${n.units[t].name}: aground`))}function eb(n,t,e,i,s){const o=n.state,r=t.input,a=i.body;if(o.alive[e]===2)return;let l=null;r.aimDir&&r.mode!=="direct"&&!a.broken&&(l=Kd(a,i.model,r.aimDir),r.pitch&&(l.n+=r.pitch*2)),n.aid==="guided"&&a.V<Ha(a,i.model)*1.2&&(l&&(l.n=Math.min(l.n,1)),a.throttle=1),qd(a,i.model,r,s,l),n.aid==="guided"&&(a.blackout=0),or(n,e);const c=n.world.heightAt(a.x,a.z),h=nb(n,e,a);if(h&&a.y<=h.y+1.5)return a.V<Ha(a,i.model)*1.6&&a.gamma>-8*Ht?ib(n,e,h.unit):Rl(n,e,"struck the deck");if(a.y<=c+.5){const d=n.world.metresAt(a.x,a.z)<=0;return d&&a.V<60&&a.gamma>-10*Ht?sb(n,e):Rl(n,e,d?"went into the sea":"struck the ground")}a.broken&&!i.brokenSaid&&(i.brokenSaid=!0,n.beat(e,"damage",`${Ri(n,e)}: a control surface failed`));const u=t._seen,f=r.fireHeld||r.fireCount>u.fireCount;u.fireCount=r.fireCount,f&&sf(n,e,i,!0),r.bombCount>u.bombCount&&(u.bombCount=r.bombCount,Ll(n,e,i,!0)),r.torpedoCount>u.torpedoCount&&(u.torpedoCount=r.torpedoCount,of(n,e,i,!0))}function nb(n,t,e){const i=n.state;for(const s of n._shipsNear(e.x,e.z,50)){const o=n._X[s].model;if(o.fdTop==null)continue;if(sr(e.x,e.z,i.pos[3*s],i.pos[3*s+2],i.heading[s],o.B/2,o.L/2).d<=0)return{y:o.fdTop+i.pos[3*s+1],unit:s}}return null}function ib(n,t,e){const i=n._X[t];n.beat(t,"landed",`${Ri(n,t)}: aboard ${n.units[e].name}`),n._setAlive(t,0),i.how="landed",n._score.how="landed",n._endMoment("landed")}function sb(n,t){var i;const e=n._X[t];n.fx(zt.splash,e.body.x,0,e.body.z,{unit:t,size:15}),n.beat(t,"ditched",`${Ri(n,t)}: ditched`),e.how="ditched",e.lostAt=n.t,n._setAlive(t,0),n._score.how="ditched",((i=n.player)==null?void 0:i.unitIndex)===t&&n._endMoment("ditched")}function Rl(n,t,e){var o;const i=n._X[t],s=i.body;s.crashed=!0,n.fx(n.world.metresAt(s.x,s.z)>0?zt.explode:zt.splash,s.x,Math.max(0,n.world.heightAt(s.x,s.z)),s.z,{unit:t,size:12}),i.how="lost",i.lostAt??(i.lostAt=n.t),n._setAlive(t,0),((o=n.player)==null?void 0:o.unitIndex)===t&&(n.beat(t,"lost",`${Ri(n,t)}: ${e}; did not return`),n._score.how="lost",n._endMoment("lost"))}function sf(n,t,e,i){const s=e.body,o=e.ammo;if(!o||n.t<o.nextShot)return;o.nextShot=n.t+1/12;const r=ir(s),a=xt.air.gunConvergenceM,l=[s.x+r.f[0]*a,s.y+r.f[1]*a,s.z+r.f[2]*a],c=Math.sin(s.psi)*Math.cos(s.gamma)*s.V,h=Math.sin(s.gamma)*s.V,u=-Math.cos(s.psi)*Math.cos(s.gamma)*s.V;let f=!1;for(const d of o.guns){if(!d.fixed||d.left<=0)continue;const g=Math.min(d.left,d.count*(d.weapon.rofRpm??700)/60/12);d.left-=g;const x=d.position==="wing"?e.model.span*.28:.6;for(const m of d.position==="wing"?[-1,1]:[0]){const p=s.x+r.r[0]*x*m,y=s.y+r.r[1]*x*m,v=s.z+r.r[2]*x*m,M=l[0]-p,S=l[1]-y,T=l[2]-v,A=Math.hypot(M,S,T),k=d.weapon.mvMs??800,_=n.weaponIdx(d.weapon);n.projectiles.spawn(on.bullet,p,y,v,c+M/A*k,h+S/A*k,u+T/A*k,{calibreMm:d.weapon.calibreMm??12.7,owner:t,weapon:_,t:n.t,flags:i?te.player:0,life:2.5,aux:g/(m?2:1)})}f=!0}f&&n.fx(zt.tracer,s.x,s.y,s.z,{unit:t,dx:r.f[0],dy:r.f[1],dz:r.f[2],size:.5})}function Ll(n,t,e,i){const s=e.body,o=e.ammo;if(!o||o.bombs<=0)return;o.bombs--;const r=o.bomb||{id:"bomb",kind:"bomb",massKg:250,class:"bomb-500"},a=n.weaponIdx(r),l=Math.sin(s.psi)*Math.cos(s.gamma)*s.V,c=Math.sin(s.gamma)*s.V,h=-Math.cos(s.psi)*Math.cos(s.gamma)*s.V;if(n.projectiles.spawn(on.bomb,s.x,s.y-2,s.z,l,c,h,{calibreMm:0,owner:t,weapon:a,t:n.t,flags:i?te.player:0}),s.mass=Math.max(e.model.massEmpty,s.mass-(r.massKg??250)),i){const u=n._score;u.bombs++,u.releaseM=s.y}n.fx(zt.launch,s.x,s.y,s.z,{unit:t,data:2})}function of(n,t,e,i){var m,p;const s=e.body,o=e.ammo,r=e.model.torpedo;if(!o||o.torpedoes<=0||!r)return;o.torpedoes--;const a=af(e.model,s);i&&n._score.envelope.push(a);const l=n.weaponIdx(r),c=((r.speedKn??((p=(m=r.settings)==null?void 0:m[0])==null?void 0:p.speedKn)??33)||33)*Ne,h=Math.sin(s.psi),u=-Math.cos(s.psi),f=s.V*Math.sqrt(2*Math.max(1,s.y)/Ye),d=s.x+h*f,g=s.z+u*f;if(n.fx(zt.splash,d,0,g,{unit:t,size:10}),s.mass=Math.max(e.model.massEmpty,s.mass-(r.massKg??900)),!a.ok){i&&n.beat(t,"torpedo",`torpedo broke on the water: ${a.why}`);return}const x=nc(r,n.date);n.projectiles.spawn(on.torpedo,d,-4,g,h*c,0,u*c,{calibreMm:r.calibreMm??450,owner:t,weapon:l,t:n.t,flags:(i?te.player:0)|(n.rngs.dmg.chance(x)?te.dud:0),life:r.rangeM??2e3}),i&&n._score.torpedoes++}function af(n,t){const e=n.torpedo;if(!e)return{ok:!1,why:"no torpedo"};const i=(e.dropSpeedKn??110)*Ne*1.15,s=(e.dropAltM??30)*1.5;return t.V>i?{ok:!1,why:"too fast"}:t.y>s?{ok:!1,why:"too high"}:Math.abs(t.phi)>10*Ht?{ok:!1,why:"wings not level"}:t.gamma<-5*Ht||t.gamma>3*Ht?{ok:!1,why:t.gamma<0?"nose too low":"nose too high"}:{ok:!0,why:""}}function ob(n,t){var i,s,o,r;const e=n.state;for(let a=0;a<n.capacity;a++){const l=n.units[a];if(l.authority!=="ai"||!e.alive[a])continue;const c=n._X[a];if(c.body){if(l.kind==="ship")e.alive[a]===1&&(Zd(c.body,c.model,((i=c.ai)==null?void 0:i.helm)??0,((s=c.ai)==null?void 0:s.telegraph)??tc(c.model,e.speed[a]),t,jd(c.dmg,c.model,n.t),c.dmg.rudderJam),nf(n,a,c)),tf(n,a);else if(e.alive[a]===1){const h=c.body,u=c.ai,f=Kd(h,c.model,(u==null?void 0:u.aim)||[Math.sin(h.psi),0,-Math.cos(h.psi)],{maxG:(u==null?void 0:u.maxG)??4});qd(h,c.model,{throttle:(u==null?void 0:u.mode)==="fight"?1:h.throttle},t,f),or(n,a),(u==null?void 0:u.mode)==="fight"&&n.t<u.burstUntil&&sf(n,a,c,!1);const d=n.world.heightAt(h.x,h.z);h.y<=d+.5&&Rl(n,a,"went in"),(u==null?void 0:u.mode)==="rejoin"&&c.ac&&n.t>c.ac.endT&&n._setAlive(a,0),((o=c.ac)==null?void 0:o.lossT)!=null&&!c.spared&&n.t>=c.ac.lossT&&e.alive[a]===1&&((r=n.player)==null?void 0:r.unitIndex)!==a&&Va(n,a,"shot")}}}}function ab(n,t,e){var d,g;const i=n.projectiles,s=i.owner[t],o=(d=n.weaponList[i.weapon[t]])==null?void 0:d.w,r=n._X[e],a=!!(i.flags[t]&te.player);n.units[e].authority==="record"&&n._toAI(e);const l=r.body;if(!l)return;const c=r.model.protection==="self-sealing"?"protected":"unprotected",h=((g=o==null?void 0:o.vsAircraft)==null?void 0:g[c])??((o==null?void 0:o.calibreMm)>=20?.3:.06),u=i.aux[t]||1,f=h*u*.35;l.damage+=f/(r.model.fatal||1),l.burning<=0&&n.rngs.dmg.chance((xt.damage.aircraftFireChance[r.model.protection]??.1)*Math.min(1,u*.35))&&(l.burning=xt.damage.aircraftFireBurnS[0]+n.rngs.dmg.next()*(xt.damage.aircraftFireBurnS[1]-xt.damage.aircraftFireBurnS[0]),n.fx(zt.fire,l.x,l.y,l.z,{unit:e,size:.5})),n.fx(zt.hit,l.x,l.y,l.z,{unit:e,size:.2}),l.damage>=1&&Va(n,e,"shot",a?"player":s),a&&r.ai&&r.ai.mode!=="fight"&&(r.ai.mode="rejoin")}function ri(n,t){var r,a;if(t==null||t<0)return!1;const e=n.units[t];if(!(e!=null&&e.target)||n.state.alive[t]!==1)return!1;if(e.kind!=="ship")return!0;const i=n._X[t],s=((r=i.model)==null?void 0:r.fatal)??1,o=i.dmg;return(o==null?void 0:o.regime)==="sim"?o.sinking||o.float>=1||o.fight>=1?!1:!o.doomed||o.doomedWhy==="record"&&rb(i.rec,n.t)<s:(((a=i.rd)==null?void 0:a.damage)??0)<s}function rb(n,t){let e=0;for(const i of(n==null?void 0:n.events)||[]){if(i.t>t)break;(i.kind==="hit"||i.kind==="torpedo-hit")&&(e+=i.damage??.08*Math.max(1,i.rc))}return e}function Va(n,t,e,i=null){var r;const s=n._X[t],o=n.state;o.alive[t]===1&&(s.lostAt=n.t,s.lostHow=e,i==="player"&&(s.lostByPlayer=!0,n._score.downed++,n.beat(t,"downed",`${Ri(n,t)}: shot down`)),n._setAlive(t,2),n.fx(zt.fall,o.pos[3*t],o.pos[3*t+1],o.pos[3*t+2],{unit:t}),s.fallT0=n.t,((r=n.player)==null?void 0:r.unitIndex)===t&&(n.beat(t,"lost",`${Ri(n,t)}: did not return`),n._score.how="lost",n._endMoment("lost")))}function lb(n,t,e,i,s){var d;const o=n._X[e],r=n.units[e],l=!!(n.projectiles.flags[t]&te.player);if(!ri(n,e)||l&&((d=o.rec)!=null&&d.fixed))return;n._touch(e,l?"player":"ai");const c=o.model,h=Fn(Math.floor((i.lz/c.L+.5)*4),0,3),u=Ds(o.dmg,c,{cls:(s==null?void 0:s.cls)??"bomb-500",part:"deck",zone:h,side:i.lx>=0?1:-1,t:n.t},n.rngs.dmg),f=h===0?"forward":h===3?"aft":"amidships";n.beat(e,"hit",`${r.name}: bomb hit ${f}${u?`, ${u}`:""}`),l&&(ar(n,e,"bomb",f),n._engage(e))}function cb(n,t,e,i,s){const o=n.state,r=n.projectiles;for(const a of n._shipsNear(e,i,40)){const l=n._X[a].model;if(sr(e,i,o.pos[3*a],o.pos[3*a+2],o.heading[a],l.B/2,l.L/2).d<15&&ri(n,a)){const h=n._X[a];n._touch(a,"near miss"),(l.type==="dd"||l.type==="de")&&Ds(h.dmg,l,{cls:"small",part:"waterline",zone:1,t:n.t},n.rngs.dmg),r.flags[t]&te.player&&(n.beat(a,"near-miss",`${n.units[a].name}: near miss`),ar(n,a,"near-miss"));return}}}function hb(n,t,e,i){var f;const s=n._X[e],o=n.units[e],r=n.projectiles,a=!!(r.flags[t]&te.player);if(!ri(n,e)||a&&((f=s.rec)!=null&&f.fixed))return;n._touch(e,a?"player":"ai");const l=n.weaponList[r.weapon[t]],c=s.model,h=Fn(Math.floor((i.lz/c.L+.5)*4),0,3),u=Ds(s.dmg,c,{cls:(l==null?void 0:l.cls)??"torpedo-t93",part:"waterline",zone:h,side:i.lx>=0?1:-1,t:n.t},n.rngs.dmg);n.beat(e,"torpedo-hit",`${o.name}: torpedo hit${u?`, ${u}`:""}`),a&&(ar(n,e,"torpedo"),n._score.torpedoesHit++,n._engage(e))}function ub(n,t,e,i){var d,g;const s=n.projectiles,o=n.state,r=s.owner[t],a=s.salvo[t];if(s.flags[t]&te.player){let x=-1,m=1e3;for(const p of n._shipsNear(e,i,1e3)){if(n.units[p].side===((d=n.units[r])==null?void 0:d.side))continue;const y=Math.hypot(o.pos[3*p]-e,o.pos[3*p+2]-i);y<m&&(m=y,x=p)}if(x>=0){rf(n,x,e,i);const p=n.player;if(((g=p==null?void 0:p.lastSalvo)==null?void 0:g.id)===a){const y=n._X[x].model,v=sr(e,i,o.pos[3*x],o.pos[3*x+2],o.heading[x],y.B/2,y.L/2),M=r>=0?o.pos[3*r]:e,S=r>=0?o.pos[3*r+2]:i,T=Math.hypot(e-M,i-S)>Math.hypot(o.pos[3*x]-M,o.pos[3*x+2]-S);p.lastSalvo.tags.push(v.d<1?"hit":T?"over":"short"),p.lastSalvo.target=x;const A=p.lastSalvo.tags;!p.lastSalvo.straddle&&A.includes("over")&&A.includes("short")&&(p.lastSalvo.straddle=!0,n._score.straddles++)}}return}const l=r>=0?n._X[r]:null,c=l==null?void 0:l.ai;if(!(c!=null&&c.salvos))return;const h=c.salvos.get(a);if(!h||h.done)return;h.done=!0;const u=s.target[t];(n.sight.light==="day"||u>=0&&n._X[u].litUntil>n.t||n.sight.lit(e,0,i)||h.seenAtFire==="radar"&&xt.aiGun.spotNightRadar)&&g_(c.sol,xt.aiGun),c.salvos.delete(a),n.player&&u===n.player.unitIndex&&(n._lastNearSalvo=n.t)}function rf(n,t,e,i){var f;const s=n._X[t],o=n.units[t];if(o.kind!=="ship"||o.authority==="player"||(f=s.rec)!=null&&f.fixed)return;n._engage(t);const r=s.ai;if(!r)return;const a=n.state,l=n.rngs.ai,c=_e(e-a.pos[3*t],i-a.pos[3*t+2]),h=Vs(c-a.heading[t]),u=l.next()<xt.aiEvade.towardShare;r.evadeTurn=Fn((u?Math.sign(h):-Math.sign(h))*(15+l.next()*15),-30,xt.aiEvade.maxTurnDeg),r.evadeDv=(l.next()*2-1)*xt.aiEvade.maxSpeedKn*Ne,r.evadeUntil=n.t+xt.aiEvade.returnS}function ar(n,t,e,i=null){var a;const s=n._score;if(!s)return;let o=s.hits.find(l=>l.unit===n.units[t].id&&l.kind===e);o||s.hits.push(o={unit:n.units[t].id,name:n.units[t].name,kind:e,count:0,where:[]}),o.count++,i&&o.where.push(i);const r=(a=n._moment)==null?void 0:a.objective;r!=null&&r.target&&r.target===n.units[t].id&&e!=="near-miss"&&(s.objective=!0)}function db(n,t){var o,r;const e=n.state,i=n._X,s=n.player;n._aaOnPlayer=0;for(const a of n._air||[]){const l=n.units[a];if(l.authority==="record"||e.alive[a]!==1)continue;const c=i[a],h=c.body;if(!h)continue;if(h.burning>0){h.burning-=t,h.burning<=0&&Va(n,a,"fire",c.lastHitBy??null);continue}let u=0,f=null;const d=h.gamma<-30*Ht?"dive":h.y<120&&Math.abs(h.gamma)<.1?"torpedo":"crossing";for(const x of n.record.ships){const m=x.slot;if(e.alive[m]!==1||n.units[m].side===l.side||n.units[m].kind!=="ship")continue;const p=i[m].model,y=A_(p),v=Math.hypot(e.pos[3*m]-h.x,e.pos[3*m+2]-h.z,h.y-20);if(v>y)continue;const M=i[m].dmg;if(M&&M.regime==="sim"&&(M.out||M.sinking)||!n.sight.sees({x:e.pos[3*m],y:25,z:e.pos[3*m+2],sensors:[]},{x:h.x,y:h.y,z:h.z,big:!1,aircraft:!0,lit:n.sight.light==="day"}))continue;(o=i[m]).sighted??(o.sighted={});const S=l.groupIndex>=0?l.groupIndex:`u${a}`;(r=i[m].sighted)[S]??(r[S]=n.t);const T=L_(n.t,i[m].sighted[S]);let A=0;for(const w of n._air)n.units[w].side===l.side&&Math.hypot(e.pos[3*w]-e.pos[3*m],e.pos[3*w+2]-e.pos[3*m+2])<y&&A++;A=Math.max(1,Math.min(A,4)),s&&s.kind==="ship"&&s.unitIndex===m&&s.aaTarget===a&&n.t<(s.aaUntil??0)&&(A=1);const k=C_(n.units[m].side,n.year,{peacetime:n.year===1941&&n.units[m].side==="us"}),_=M&&M.regime==="sim"&&M.crippled?.5:1;u+=T_(p,v)*k*T*R_(d)*_/A,(!f||v<f.d)&&(f={j:m,d:v,m:p})}if(s&&s.unitIndex===a&&n.aid==="guided"&&(u*=.5),s&&s.unitIndex===a&&(n._aaOnPlayer=u),u<=0)continue;n.rngs.fx.chance(Math.min(.5,u*600*t))&&n.fx(zt.flash,h.x+n.rngs.fx.gauss()*60,h.y+n.rngs.fx.gauss()*40,h.z+n.rngs.fx.gauss()*60,{unit:f.j,size:1,data:1});const g=k_(u,t,n.rngs.aa);g==="kill"?(Va(n,a,"aa"),s&&s.unitIndex!==a&&n.units[f.j].authority==="player"&&n._score.downed++):g==="hit"&&(h.damage=Math.min(.95,h.damage+P_(f.m,f.d,n.rngs.aa)),n.fx(zt.smoke,h.x,h.y,h.z,{unit:a,size:.4}),(s==null?void 0:s.unitIndex)===a&&n.beat(a,"damage",`${Ri(n,a)}: hit by AA`))}}function fb(n,t){var r;const e=t.slot,i=n.state,s=n._X[e],o=3*e;if(t.kind==="release"){const a=((r=s.model.payload[0])==null?void 0:r.weapon)||{id:"bomb",kind:"bomb",massKg:450,class:"bomb-1000"},l=n.weaponIdx(a);i.vel[o];const c=i.vel[o+1];i.vel[o+2];const h=i.pos[o+1],u=(c+Math.sqrt(Math.max(0,c*c+2*Ye*h)))/Ye;let f=t.aim.x,d=t.aim.z;if(t.hit&&t.target>=0){const m=n.record.ships[t.target].slot;f=i.pos[3*m]+i.vel[3*m]*u,d=i.pos[3*m+2]+i.vel[3*m+2]*u}const g=(f-i.pos[o])/Math.max(.5,u),x=(d-i.pos[o+2])/Math.max(.5,u);n.projectiles.spawn(on.bomb,i.pos[o],h-2,i.pos[o+2],g,c,x,{owner:e,weapon:l,t:n.t,flags:te.visual|(t.hit?te.hit:0)}),n.fx(zt.launch,i.pos[o],h,i.pos[o+2],{unit:e,data:2})}else if(t.kind==="drop"){const a=s.model.torpedo||{id:"torpedo",kind:"torpedo",air:!0,speedKn:33,rangeM:2e3},l=n.weaponIdx(a),c=((a.speedKn??33)||33)*Ne;let h=t.heading;if(t.target>=0){const d=n.record.ships[t.target].slot;if(h=_e(t.aim.x-i.pos[o],t.aim.z-i.pos[o+2]),t.hit){const x=Math.hypot(i.pos[3*d]-i.pos[o],i.pos[3*d+2]-i.pos[o+2])/c;h=_e(i.pos[3*d]+i.vel[3*d]*x-i.pos[o],i.pos[3*d+2]+i.vel[3*d+2]*x-i.pos[o+2])}}const[u,f]=Te(h);n.fx(zt.splash,i.pos[o],0,i.pos[o+2],{unit:e,size:8}),n.projectiles.spawn(on.torpedo,i.pos[o],-4,i.pos[o+2],u*c,0,f*c,{owner:e,weapon:l,t:n.t,flags:te.visual|te.armed|(t.hit?te.hit:0),life:a.rangeM??2500})}else if(t.kind==="strafe"){let a=i.pos[o],l=i.pos[o+2];if(t.target>=0){const c=n.record.ships[t.target].slot;a=i.pos[3*c],l=i.pos[3*c+2]}else if(t.site){const c=n.record.siteById.get(t.site);c&&(a=c.x,l=c.z)}n.fx(zt.tracer,i.pos[o],i.pos[o+1],i.pos[o+2],{unit:e,dx:a-i.pos[o],dy:-i.pos[o+1],dz:l-i.pos[o+2],size:t.dur??3,data:1})}}function pb(n,t,e){var p,y,v,M,S;const i=n.state,s=e.target?n.record.shipById.get(e.target):null;if(!s)return;const o=s.slot,a=((p=n._X[t].model.torp)==null?void 0:p.weapon)||{id:"torpedo",kind:"torpedo",speedKn:e.speedKn??36,rangeM:15e3},l=n.weaponIdx(a),c=(e.speedKn??((v=(y=a.settings)==null?void 0:y[0])==null?void 0:v.speedKn)??36)*Ne,h=n.player&&n.player.unitIndex===o,u=Math.hypot(i.pos[3*o]-i.pos[3*t],i.pos[3*o+2]-i.pos[3*t+2]),f=u/c,d=_e(i.pos[3*o]+i.vel[3*o]*f-i.pos[3*t],i.pos[3*o+2]+i.vel[3*o+2]*f-i.pos[3*t+2]),g=Math.min(24,e.rc||(Array.isArray(e.count)?e.count[0]:e.count)||4),x=(((S=(M=a.settings)==null?void 0:M.find(T=>Math.abs(T.speedKn-c/Ne)<3))==null?void 0:S.rangeM)??a.rangeM??u*1.3)+200,m=nc(a,n.date);for(let T=0;T<g;T++){const A=(d+(T-(g-1)/2)*xt.torpedo.spreadNarrowDeg*1.5)*Ht;n.projectiles.spawn(on.torpedo,i.pos[3*t],-4,i.pos[3*t+2],Math.sin(A)*c,0,-Math.cos(A)*c,{owner:t,weapon:l,t:n.t,flags:h?n.rngs.dmg.chance(m)?te.dud:0:te.visual,life:x,target:o})}}function mb(n,t,e){var h;const i=n.state,s=n.units[t].side,o=i.pos[3*t],r=i.pos[3*t+1],a=i.pos[3*t+2];let l=-1,c=3e3;for(const u of n._air||[]){if(n.units[u].side===s||((h=n._X[u].model)==null?void 0:h.type)!=="fighter")continue;const f=Math.hypot(i.pos[3*u]-o,i.pos[3*u+1]-r,i.pos[3*u+2]-a);f<c&&(c=f,l=u)}if(l>=0){for(let u=0;u<3;u++)n.fx(zt.tracer,i.pos[3*l],i.pos[3*l+1],i.pos[3*l+2],{unit:l,dx:o-i.pos[3*l],dy:r-i.pos[3*l+1],dz:a-i.pos[3*l+2],size:1.5+u,data:0});return}for(let u=0;u<4;u++)n.fx(zt.flash,o+n.rngs.fx.gauss()*50,r+n.rngs.fx.gauss()*30,a+n.rngs.fx.gauss()*50,{unit:t,size:1,data:1})}function gb(n){var e,i;const t=n.state;if(!(n.projectiles.count>n.projectiles.capacity*.6))for(const[s,o]of n._visualFire){if(n.t>o.until){n._visualFire.delete(s);continue}if(n.t<o.next)continue;const r=n._X[s],a=n.units[s];if(t.alive[s]!==1||a.authority==="ai"&&((e=r.ai)!=null&&e.engaged)||a.authority==="player"){n._visualFire.delete(s);continue}const l=o.target,c=r.model.batteries[0];if(l==null||t.alive[l]!==1||!c){o.next=n.t+30;continue}o.next=n.t+c.reloadS*(1+n.rngs.fx.next()*.3);const h=t.pos[3*l],u=t.pos[3*l+2],f=Math.hypot(h-t.pos[3*s],u-t.pos[3*s+2]);if(f>c.table.maxRange*.97)continue;r.vguns||(r.vguns=ec(n,s));const d=r.vguns[0],g=d.mounts.filter(S=>ef(n,s,S,h,u));if(!g.length)continue;const x=n.rngs.fx,m=((i=_i(c.table,f))==null?void 0:i.tof)??10,p=h+t.vel[3*l]*m+x.gauss()*f*.015,y=u+t.vel[3*l+2]*m+x.gauss()*f*.015,v=n._salvo++;for(const S of g)S.readyAt=0;const M=n.projectiles.count;$a(n,s,d,g,p,y,{salvo:v,target:l,player:!1});for(let S=0;S<n.projectiles.capacity&&n.projectiles.count>M;S++)n.projectiles.alive[S]&&n.projectiles.salvo[S]===v&&(n.projectiles.flags[S]|=te.visual)}}function vb(n,t){var s;const e=n.state;for(let o=0;o<n.capacity;o++){const r=n.units[o];if(r.authority==="record"||r.authority==="free"||e.alive[o]!==2||r.kind!=="aircraft")continue;const l=n._X[o].body;if(!l){n._setAlive(o,0);continue}l.gamma=Math.max(-1.3,l.gamma-.6*t),l.phi+=1.5*t,l.V=Math.min(l.V+6*t,160);const c=Math.cos(l.gamma)*l.V;l.x+=c*Math.sin(l.psi)*t,l.z-=c*Math.cos(l.psi)*t,l.y+=Math.sin(l.gamma)*l.V*t,or(n,o),e.fire[o]=1,l.y<=n.world.heightAt(l.x,l.z)&&(n.fx(n.world.metresAt(l.x,l.z)>0?zt.explode:zt.splash,l.x,Math.max(0,n.world.heightAt(l.x,l.z)),l.z,{unit:o,size:10}),n._setAlive(o,0))}const i=n.player;if(i&&i.kind==="aircraft"&&n.momentState&&!n.momentState.done){const o=n._X[i.unitIndex];(s=o.body)!=null&&s.engineOut&&o.body.fuelS<=0&&!o.fuelSaid&&(o.fuelSaid=!0,n.beat(i.unitIndex,"fuel",`${Ri(n,i.unitIndex)}: out of fuel`))}}function gu(n){var r,a;const t=n.player;if(!t)return;const e=t.unitIndex,i=n.state,s=n._X[e],o=t.state;if(o.t=n.t,o.alive=i.alive[e],o.side=n.units[e].side,o.units=o.side==="jp"?"metric":"imperial",o.x=i.pos[3*e],o.y=i.pos[3*e+1],o.z=i.pos[3*e+2],o.heading=i.heading[e],o.speed=i.speed[e],o.damage=i.damage[e],t.kind==="aircraft"){const l=s.body;o.alt=l.y,o.ias=l.ias,o.pitch=l.gamma/Ht,o.roll=l.phi/Ht,o.g=l.n,o.stall=l.stalled,o.stallSpeed=Ha(l,s.model),o.shake=l.shake,o.blackout=l.blackout,o.endurance=l.fuelS,o.throttle=l.throttle,o.brakes=l.brakes,o.broken=l.broken,o.ammo=s.ammo.guns.map(u=>({weapon:u.weapon.id,calibreMm:u.weapon.calibreMm,left:Math.round(u.left),position:u.position})),o.bombs=s.ammo.bombs,o.torpedoes=s.ammo.torpedoes,o.aa=n._aaOnPlayer||0,o.target=xb(n,e,s),o.ccip=s.ammo.bombs>0?yb(n,e,s):null,o.release=!!(o.ccip&&o.ccip.onTarget&&l.gamma<-30*Ht&&l.y>vu(l)),o.safeAlt=vu(l),o.envelope=s.ammo.torpedoes>0?af(s.model,l):null;const c=n.record.groupById.get(n.units[e].group||""),h=((r=c==null?void 0:c.recover)==null?void 0:r.to)>=0?c.recover.to:(c==null?void 0:c.from)??-1;if(h>=0){const u=n.record.ships[h].slot;o.home={index:u,range:Math.hypot(i.pos[3*u]-l.x,i.pos[3*u+2]-l.z),bearing:_e(i.pos[3*u]-l.x,i.pos[3*u+2]-l.z)}}else o.home=null}else{const l=s.body,c=s.dmg;o.alt=0,o.helm=l.helm,o.rudder=l.rudder,o.telegraph=l.telegraph,o.ordered=Yd(l.telegraph)*s.model.vmax,o.fight=c.fight,o.float=c.float,o.list=c.list,o.fires=[...c.fires],o.systemsOut=[...c.systemsOut,...c.rudderJam!=null?["rudder"]:[],...n.t<c.engineStopUntil?["engines"]:[],...c.bowLost?["bow"]:[]],o.doomed=c.doomed,o.turrets=s.guns.flatMap((f,d)=>f.mounts.map(g=>({battery:d,role:f.battery.role,bearing:(g.bearing+i.heading[e])%360,elevation:g.elev,ready:g.readyAt<=n.t,readyIn:Math.max(0,g.readyAt-n.t),reloadS:f.battery.reloadS})));const h=t.input,u=s.guns[Fn(h.battery|0,0,Math.max(0,s.guns.length-1))];if(u&&h.aimRange!=null){const f=_i(u.battery.table,h.aimRange);o.aimTof=(f==null?void 0:f.tof)??null,o.maxRange=u.battery.table.maxRange}else o.aimTof=null;o.target=Mb(n,e,s,h.aimAz),o.lastSalvo=t.lastSalvo||null,o.torpedoesReady=((a=s.torpedoes)==null?void 0:a.ready)??0,o.aaTarget=n.t<(t.aaUntil??0)?t.aaTarget:-1}o.contacts=_b(n,e)}function vu(n){const t=Math.max(0,-n.gamma);return n.V*n.V/(Ye*Math.max(.5,5-Math.cos(t)))*(1-Math.cos(t))+100}function xb(n,t,e){var a,l;const i=n.state,s=e.body,o=ir(s).f;let r=null;for(const c of n._air||[]){if(n.units[c].side===n.units[t].side)continue;const h=i.pos[3*c]-s.x,u=i.pos[3*c+1]-s.y,f=i.pos[3*c+2]-s.z,d=Math.hypot(h,u,f);d>1500||(h*o[0]+u*o[1]+f*o[2])/d<.7||(!r||d<r.range)&&(r={index:c,range:d,bearing:_e(h,f)})}if(r){const c=r.index,h=((l=(a=e.model.guns[0])==null?void 0:a.weapon)==null?void 0:l.mvMs)??800;let u=r.range/(h+s.V),f,d,g;for(let x=0;x<2;x++)f=i.pos[3*c]+i.vel[3*c]*u,d=i.pos[3*c+1]+i.vel[3*c+1]*u,g=i.pos[3*c+2]+i.vel[3*c+2]*u,u=Math.hypot(f-s.x,d-s.y,g-s.z)/(h+s.V);r.tof=u,r.lead=[f,d,g]}return r}function yb(n,t,e){const i=n.state,s=e.body;let o=s.x,r=s.y,a=s.z,l=Math.sin(s.psi)*Math.cos(s.gamma)*s.V,c=Math.sin(s.gamma)*s.V,h=-Math.cos(s.psi)*Math.cos(s.gamma)*s.V;const u=4e-5;let f=0;const d=.1;for(;r>0&&f<60;){const m=Math.hypot(l,c,h);l-=u*m*l*d,c-=(u*m*c+Ye)*d,h-=u*m*h*d,o+=l*d,r+=c*d,a+=h*d,f+=d}let g=!1,x=-1;for(const m of n._shipsNear(o,a,300)){if(n.units[m].side===n.units[t].side||!ri(n,m))continue;const p=n._X[m].model;if(sr(o,a,i.pos[3*m]+i.vel[3*m]*f,i.pos[3*m+2]+i.vel[3*m+2]*f,i.heading[m],p.B/2,p.L/2).d<=0){g=!0,x=m;break}}return{x:o,y:0,z:a,tof:f,onTarget:g,target:x}}function Mb(n,t,e,i){var r;const s=n.state;let o=null;for(const a of n.record.ships){const l=a.slot;if(!ri(n,l)||n.units[l].side===n.units[t].side||n.units[l].kind!=="ship")continue;const c=s.pos[3*l]-s.pos[3*t],h=s.pos[3*l+2]-s.pos[3*t+2],u=_e(c,h),f=Math.abs(Vs(u-i));if(f>3)continue;const d=Math.hypot(c,h),g=n.sight.sees({x:s.pos[3*t],y:e.model.top*.8,z:s.pos[3*t+2],sensors:e.model.sensors},{x:s.pos[3*l],y:10,z:s.pos[3*l+2],big:!0,lit:n._X[l].litUntil>n.t});if(g&&(!o||f<o.off)){const x=g.how==="radar"?.3:d<1e4?.5:d>15e3?1:.75,m=n.rngs.fx,p=d*(1+m.gauss()*x/100),y=(r=e.guns[0])==null?void 0:r.battery.table,v=y?_i(y,p):null;o={index:l,range:p,bearing:u,tof:(v==null?void 0:v.tof)??null,how:g.how,off:f,course:s.heading[l],speed:s.speed[l]}}}return o}function _b(n,t){var r;const e=n.state,i=n._X[t],s=[],o={x:e.pos[3*t],y:Math.max(20,e.pos[3*t+1]),z:e.pos[3*t+2],sensors:i.model.sensors||[]};for(let a=0;a<n.capacity;a++){if(a===t||e.alive[a]!==1||n.units[a].parked)continue;const l=n.units[a],c=e.pos[3*a]-o.x,h=e.pos[3*a+2]-o.z,u=Math.hypot(c,h);if(u>4e4)continue;const f=n.sight.sees(o,{x:e.pos[3*a],y:e.pos[3*a+1],z:e.pos[3*a+2],big:l.kind==="ship"&&(((r=n._X[a].model)==null?void 0:r.L)??0)>150,aircraft:l.kind==="aircraft",lit:n._X[a].litUntil>n.t});if(f&&(s.push({index:a,kind:l.kind,friendly:l.side===n.units[t].side,range:u,bearing:_e(c,h),how:f.how}),s.length>120))break}return s}function bb(n){var c;const t=n.player;if(n.threat=!1,n.threatWhy=null,!t||n.state.alive[t.unitIndex]!==1)return;const e=n.state,i=t.unitIndex,s=e.pos[3*i],o=e.pos[3*i+1],r=e.pos[3*i+2],a=xt.threat,l=h=>{n.threat=!0,n.threatWhy=h};if(t.kind==="aircraft"){const h=n._X[i].body;if(h.gamma<-40*Ht)return l("dive");if(h.y<100&&((c=n._X[i].ammo)==null?void 0:c.torpedoes)>0)return l("torpedo run");if((n._aaOnPlayer||0)>0)return l("AA")}for(const h of n._air||[])if(n.units[h].side!==n.units[i].side&&Math.hypot(e.pos[3*h]-s,e.pos[3*h+1]-o,e.pos[3*h+2]-r)<a.aircraftM)return l("enemy aircraft");if(t.kind==="ship"){if(n._lastNearSalvo!=null&&n.t-n._lastNearSalvo<3)return l("salvo");const h=n.projectiles;for(let u=0;u<h.capacity;u++){if(!h.alive[u])continue;const f=h.kind[u],d=3*u;if(f===on.torpedo&&!(h.flags[u]&te.player)&&Math.hypot(h.pos[d]-s,h.pos[d+2]-r)<a.torpedoNearM)return l("torpedo");if(f===on.shell&&h.flags[u]&te.player&&t.lastSalvo&&h.salvo[u]===t.lastSalvo.id&&t.lastSalvo.landsAt-n.t<a.ownSalvoLastS)return l("own salvo");if(f===on.shell&&!(h.flags[u]&(te.player|te.visual))&&h.target[u]===i&&h.vel[d+1]<0&&Math.hypot(h.pos[d]-s,h.pos[d+2]-r)<a.salvoNearM*3)return l("salvo")}for(const u of n.record.ships){const f=u.slot;if(!(e.alive[f]!==1||n.units[f].side===n.units[i].side)&&Math.hypot(e.pos[3*f]-s,e.pos[3*f+2]-r)<a.shipNearM)return l("enemy ship")}}}function wb(n){const t=n._score;if(!t)return{hits:[],downed:0,torpedoesHit:0,survived:null,timeS:0};const e=n.player,i=n.momentState,s=e?e.unitIndex:-1,o=s>=0?n.state.alive[s]===1:null;return{hits:t.hits.map(r=>({unit:r.unit,name:r.name,kind:r.kind,count:r.count,where:r.where})),downed:t.downed,torpedoesHit:t.torpedoesHit,survived:t.how==="landed"?!0:t.how==="lost"||t.how==="ditched"?!1:o,how:t.how,timeS:Math.max(0,((i==null?void 0:i.endT)??n.t)-t.start),salvos:t.salvos,straddles:t.straddles,shells:t.shells,bombs:t.bombs,torpedoes:t.torpedoes,releaseM:t.releaseM,envelope:t.envelope,objective:t.objective}}function lf(n,t){if(n.sinkT!=null&&n.sinkT<=t)return{kind:"sunk",t:n.sinkT};const e=n.events.some(i=>(i.kind==="hit"||i.kind==="torpedo-hit")&&i.t<=t);return e&&n.sinkT!=null?{kind:"doomed",t:n.sinkT}:e||n.events.some(i=>i.kind==="fire"&&i.t<=t)?{kind:"damaged"}:{kind:"afloat"}}function Sb(n,t,e){const i=n._X[t],s=i.rec,o=i.dmg;return!o||o.regime!=="sim"||s.fixed?lf(s,e):o.sinking||n.state.alive[t]===0?{kind:"sunk",t:o.sinkAt??i.sunkAt??e}:o.doomed?{kind:"doomed",t:o.sinkDue??null}:o.hits>0||o.fires.some(Boolean)||o.fight>.02?{kind:"damaged"}:{kind:"afloat"}}function xu(n,t,e,{record:i=!1}={}){const s=o=>n.clock.label(o);return t.kind==="sunk"?`sank at ${s(t.t??e)}`:t.kind==="doomed"?i&&t.t!=null?`sank at ${s(t.t)}`:`sinking at ${s(e)}`:t.kind==="damaged"?`damaged, afloat at ${s(e)}`:`afloat at ${s(e)}`}function Eb(n,{at:t=null}={}){const e=t??n.t,i={},s={},o=(l,c)=>l[c]||(l[c]={sunk:[],doomed:[],damaged:[],aircraftLost:0}),r=[];for(const l of n.record.ships){const c=l.slot;if(n.units[c].kind!=="ship")continue;const h=Sb(n,c,e),u=lf(l,e),f=o(i,l.side),d=o(s,l.side);h.kind!=="afloat"&&f[h.kind].push(l.id),u.kind!=="afloat"&&d[u.kind].push(l.id);const g=h.kind===u.kind,x=!(h.kind==="sunk"&&u.kind==="sunk")||Math.abs((h.t??0)-(u.t??0))<=600;(!g||!x)&&r.push({unit:l.id,name:l.name,sim:xu(n,h,e),record:u.kind==="afloat"?"survived":xu(n,u,e,{record:!0})})}for(const l of n.record.groups){let c=0,h=0;for(const u of l.aircraft){u.lossT!=null&&u.lossT<=e&&c++;const f=u.slot;if(f==null)continue;const d=n._X[f];(d.lostAt!=null&&d.lostAt<=e||n.units[f].authority==="record"&&!d.spared&&u.lossT!=null&&u.lossT<=e&&!n._cancelled.has(l.index))&&h++}o(s,l.side).aircraftLost+=c,o(i,l.side).aircraftLost+=h,c!==h&&r.push({group:l.id,name:l.name,sim:`${h} lost`,record:`${c} lost`}),n._cancelled.has(l.index)&&r.push({group:l.id,name:l.name,sim:"not launched",record:"launched"})}const a=n.player;return a&&a.kind==="aircraft"&&n._X[a.unitIndex].wasSpare&&n._X[a.unitIndex].lostAt!=null&&o(i,n.units[a.unitIndex].side).aircraftLost++,{at:e,label:n.clock.label(e),bySide:i,record:s,diverged:r,guess:n._guess||[]}}const Jr=n=>Array.isArray(n)?n:n instanceof Map?[...n.values()]:n&&typeof n=="object"?Object.values(n):[],Qr=(n,t,e)=>Math.max(t,Math.min(e,n)),tl=new Set(["hit","torpedo-hit","near-miss"]),yu={capsized:150,exploded:40,explodes:40,default:300};function Mu(n,t,e={}){var Ks,ki,Ys,Zs,Bo,Ho,Go;const i=e.warn||(b=>console.warn(b)),s=new Ld(n.clock),o=(Ks=e.proj)!=null&&Ks.toWorld?e.proj:e.proj?new Fs(e.proj):Tb(n,i),r=s.utc(0),a=new Date(r).getUTCFullYear(),l=`${n.id}:${e.seed??""}`,c=Od(l),h={dmg:c.fork("damage"),ai:c.fork("ai"),aa:c.fork("aa"),fx:c.fork("fx"),gun:c.fork("gunnery"),rule:c.fork("rule")},u=new Map(Jr(t==null?void 0:t.ships).map(b=>[b.id,b])),f=new Map(Jr(t==null?void 0:t.aircraft).map(b=>[b.id,b])),d=new Map(Jr(t==null?void 0:t.weapons).map(b=>[b.id,b])),g=new Map,x=new Map,m=b=>{if(!g.has(b)){let E=u.get(b);E||(i(`sim: no ship kit “${b}”; a stand-in is used`),E=u.values().next().value),g.set(b,E?bM(E,d,r,i):null)}return g.get(b)},p=b=>{if(!x.has(b)){let E=f.get(b);E||(i(`sim: no aircraft kit “${b}”; a stand-in is used`),E=f.values().next().value),x.set(b,E?AM(E,d,r,i):null)}return x.get(b)},y=e.ground,v=sM(y&&(y.metres?y:y.data?{metres:y.data.metres,W:y.W,H:y.H,rect:y.rect,exaggeration:e.exaggeration??1}:null)),M=PM(n,{proj:o,clock:s,rng:c,warn:i,shipModel:m,aircraftModel:p,heightAt:v.heightAt}),S=o.lat0??0,T=o.lon0??0,A=new __({lat:S,lon:T,clock:s,weather:n.weather,squalls:M.squalls,world:y?v:null}),k=((Ys=(ki=n.weather)==null?void 0:ki.wind)==null?void 0:Ys.fromDeg)??90,_=((Bo=(Zs=n.weather)==null?void 0:Zs.wind)==null?void 0:Bo.kn)??8,[w,C]=Te((k+180)%360),F={x:w*_*Ne,z:C*_*Ne},z=[],P=[],B=[],X=new Map,J=(b,E)=>{const R=`${E}:${b}`;return X.has(R)||(X.set(R,B.length),B.push({id:b,kind:E,kit:E==="ship"?u.get(b):f.get(b),model:E==="ship"?m(b):p(b)})),X.get(R)},Z={},Y=(b,E=1)=>Z[b]=(Z[b]||0)+E;for(const b of M.ships){const E=f.has(b.kitId)&&!u.has(b.kitId)?"aircraft":"ship",R=E==="ship"?m(b.kitId):p(b.kitId),L=z.length;z.push({index:L,id:b.id,name:b.name,ja:b.ja,kind:E,side:b.side,kit:b.kitId,kitIndex:J(b.kitId,E),group:b.formation,groupIndex:-1,k:-1,fixed:b.fixed,hospital:b.hospital,tokko:b.tokko,target:b.target,authority:"record",parked:E==="aircraft"}),P.push({rec:b,g:null,ac:null,model:R,dmg:E==="ship"?qM(R,b.side,a):null,rd:{damage:0,fires:0,list:0,hits:0},body:null,ai:null,touched:!1,prev:null,bank:0,adamage:0}),b.slot=L,b.sinkDur=yu[(Ho=b.fate)==null?void 0:Ho.kind]??yu.default,Y(b.kitId)}for(const b of M.groups)if(b.model)for(const E of b.aircraft){const R=z.length;z.push({index:R,id:`${b.id}#${E.k+1}`,name:b.name,ja:null,kind:"aircraft",side:b.side,kit:b.kitId,kitIndex:J(b.kitId,"aircraft"),group:b.id,groupIndex:b.index,k:E.k,fixed:!1,hospital:!1,tokko:!!b.raw.tokko,target:!0,authority:"record",parked:!1}),P.push({rec:null,g:b,ac:E,model:b.model,dmg:null,rd:null,body:null,ai:null,touched:!1,prev:null,bank:0,adamage:0}),E.slot=R,Y(b.kitId)}const st=z.length;for(let b=0;b<xt.spares;b++){const E=z.length;z.push({index:E,id:null,name:null,ja:null,kind:null,side:null,kit:null,kitIndex:0,group:null,groupIndex:-1,k:-1,fixed:!1,hospital:!1,tokko:!1,target:!0,authority:"free",parked:!1}),P.push({rec:null,g:null,ac:null,model:null,dmg:null,rd:null,body:null,ai:null,touched:!1,prev:null,bank:0,adamage:0,spare:!0})}for(const b of M.moments.values())((Go=b.role)==null?void 0:Go.kind)==="aircraft"&&b.role.kit&&(J(b.role.kit,"aircraft"),Y(b.role.kit));for(const b of M.ships)for(const E of b.ready||[])E.kit&&(J(E.kit,"aircraft"),Y(E.kit,Math.min(xt.spares,E.count||6)));const tt=z.length,N={pos:new Float64Array(3*tt),quat:new Float32Array(4*tt),vel:new Float32Array(3*tt),speed:new Float32Array(tt),heading:new Float32Array(tt),damage:new Float32Array(tt),fire:new Float32Array(tt),list:new Float32Array(tt),alive:new Uint8Array(tt),kitIndex:new Uint16Array(tt),version:new Uint32Array(tt)};for(let b=0;b<tt;b++)N.kitIndex[b]=z[b].kitIndex,N.quat[4*b+3]=1;const K=new a_(xt.projectileCap),lt=new w_(xt.effectsCap),_t=[],bt=[];for(const b of M.ships){for(const E of b.events)bt.push({t:E.t,kind:"event",slot:b.slot,ev:E});b.sinkT!=null&&(bt.push({t:b.sinkT-b.sinkDur,kind:"sinkstart",slot:b.slot}),bt.push({t:b.sinkT,kind:"sunk",slot:b.slot}))}for(const b of M.groups)for(const E of b.aircraft)if(E.slot!=null){bt.push({t:E.spawnT,kind:"spawn",slot:E.slot});for(const R of E.actions)bt.push({...R,slot:E.slot});E.lossT!=null?(bt.push({t:E.lossT-5,kind:"choreo",slot:E.slot}),bt.push({t:E.lossT,kind:"lose",slot:E.slot}),bt.push({t:E.goneT,kind:"gone",slot:E.slot})):Number.isFinite(E.endT)&&E.endHow!=="land"&&bt.push({t:E.endT,kind:"exit",slot:E.slot})}const Dt={spawn:0,sinkstart:1,event:2,release:3,drop:3,strafe:3,choreo:4,lose:5,land:6,exit:6,gone:7,sunk:8,beat:9};bt.forEach((b,E)=>b.n=E),bt.sort((b,E)=>b.t-E.t||(Dt[b.kind]??5)-(Dt[E.kind]??5)||b.n-E.n);const O={battle:n,clock:s,proj:o,record:M,world:v,sight:A,units:z,groups:M.groups.map(b=>{var E;return{id:b.id,name:b.name,kit:b.kitId,side:b.side,count:b.count,profile:((E=b.attack)==null?void 0:E.profile)??null,units:b.aircraft.map(R=>R.slot),reached:b.Srec}}),state:N,projectiles:K,effects:lt,beats:_t,kits:B,capacity:tt,capacityByKit:Z,weaponList:[],weaponIndex:new Map,t:0,lag:0,player:null,diverged:!1,momentState:null,threat:!1,threatWhy:null,visualFire:!0,aid:e.aid||"standard",year:a,date:r,wind:F,rngs:h,_X:P,_queue:bt,_cursor:0,_cancelled:new Set,_salvo:1,_score:null,_visualFire:new Map,_engaged:new Set,_momentQueue:[],_momentCursor:0,warn:i},Wt=b=>{if(!b)return-1;let E=O.weaponIndex.get(b.id);return E==null&&(E=O.weaponList.length,O.weaponList.push({w:b,shell:b.kind==="gun"||b.kind==="aa"?Ql(b):null,cls:va(b)}),O.weaponIndex.set(b.id,E)),E};O.weaponIdx=Wt;const wt=(b,E,R,L,U)=>lt.push(b,O.t,E,R,L,U);O.fx=wt;const Xt=(b,E,R,L=null)=>_t.push({t:O.t,unit:b,kind:E,text:R,sources:L});O.beat=Xt;const G={x:0,z:0,vx:0,vz:0,heading:0,speed:0},vt={x:0,y:0,z:0},Lt={x:0,y:0,z:0},kt={motion:M.motion,groups:M.groups};function gt(b,E){var dt,ft;const R=P[b],L=R.rec;M.motion.pose(L.index,E,G);const U=3*b,H=L.sinkT!=null?L.sinkT-L.sinkDur:1/0;let V=0,W=0,et=R.rd.list;if(z[b].kind==="aircraft"&&(V=v.heightAt(G.x,G.z)+1.2),E>=H&&L.sinkT!=null){const Mt=Qr((E-H)/L.sinkDur,0,1),Ot=R.model;V=-(Ot.top+Ot.T+4)*Mt*Mt,W=(((dt=L.fate)==null?void 0:dt.kind)==="capsized"?.05:.18)*Mt,et+=(((ft=L.fate)==null?void 0:ft.kind)==="capsized"?120:8)*Mt}N.pos[U]=G.x,N.pos[U+1]=V,N.pos[U+2]=G.z,N.vel[U]=G.vx,N.vel[U+1]=0,N.vel[U+2]=G.vz,N.speed[b]=G.speed,N.heading[b]=G.heading,N.list[b]=R.rd.list,N.damage[b]=Math.min(1,R.rd.damage),N.fire[b]=E>=(L.sinkT??1/0)?0:Math.min(1,R.rd.fires*.4),Ga(-G.heading*Ht,W,-et*Ht,N.quat,4*b)}function Ut(b,E,R){const L=P[b],U=L.ac;Qi(U,E,vt,kt);const H=3*b;let V,W,et;R>0&&L.prev?(V=(vt.x-L.prev[0])/R,W=(vt.y-L.prev[1])/R,et=(vt.z-L.prev[2])/R):(Qi(U,E-.25,Lt,kt),V=(vt.x-Lt.x)*4,W=(vt.y-Lt.y)*4,et=(vt.z-Lt.z)*4),L.prev||(L.prev=[0,0,0]),L.prev[0]=vt.x,L.prev[1]=vt.y,L.prev[2]=vt.z,N.pos[H]=vt.x,N.pos[H+1]=vt.y,N.pos[H+2]=vt.z,N.vel[H]=V,N.vel[H+1]=W,N.vel[H+2]=et;const dt=Math.hypot(V,et),ft=Math.hypot(dt,W),Mt=dt>.5?_e(V,et):N.heading[b];if(R>0){const Qt=Vs(Mt-N.heading[b])*Ht/R,re=Qr(Math.atan(Qt*ft/9.81),-1.2,1.2);L.bank+=(re-L.bank)*Math.min(1,R*3)}N.speed[b]=ft,N.heading[b]=Mt;const Ot=Math.atan2(W,Math.max(.001,dt)),Kt=U.lossT!=null&&E>=U.lossT;Ga(-Mt*Ht,Kt?Ot:Ot*.9,-(Kt?L.bank+(E-U.lossT)*.9:L.bank),N.quat,4*b),N.damage[b]=Kt?1:0,N.fire[b]=Kt&&U.lossHow==="shot"?1:0}function It(b,E){const R=b.ac;if(O._cancelled.has(b.g.index)||E<R.spawnT)return 0;if(R.lossT!=null){if(E>=R.goneT)return 0;if(E>=R.lossT)return 2}return E>=R.endT?0:1}function I(b,E){const R=N.alive[b];if(R===E)return;N.alive[b]=E;const L=3*b;R===0&&E>0?(N.version[b]++,wt(zt.spawn,N.pos[L],N.pos[L+1],N.pos[L+2],{unit:b})):E===0&&wt(R===2?zt.gone:zt.despawn,N.pos[L],N.pos[L+1],N.pos[L+2],{unit:b})}O._setAlive=I;function D(b,E){const R=P[b],L=R.rec,U=R.rd;U.damage=0,U.fires=0,U.list=0,U.hits=0,U.applied=0;for(const H of L.events){if(H.t>E)break;U.applied=H.k+1,tl.has(H.kind)&&H.kind!=="near-miss"?(U.damage+=H.damage??.08*Math.max(1,H.rc),U.hits+=H.rc):H.kind==="fire"?U.fires++:H.kind==="list"?U.list+=H.deg??H.listDeg??8:H.kind==="explodes"&&(U.fires+=2)}return L.sinkT!=null&&E>=L.sinkT?0:L.sinkT!=null&&E>=L.sinkT-L.sinkDur?2:1}function q(b,{effectsOn:E=!0}={}){for(let R=0;R<tt;R++){const L=P[R];if(L.spare)continue;const U=z[R];if(L.rec){if(U.authority==="record"){const H=D(R,b);gt(R,b),E?I(R,H):N.alive[R]=H}}else if(L.ac&&U.authority==="record"){const H=It(L,b);L.prev=null,H&&Ut(R,b,0),E?I(R,H):N.alive[R]=H}}}O.setTime=function(E){if(E=s.clamp(s.parse(E)),O.diverged){if(E<=O.t){i("sim.setTime: the sim has diverged from the record; it plays forward only (Battle rebuilds it from the record to go back)");return}for(;O.t<E-1e-9;)O.advance(Math.min(E-O.t,xt.step*xt.maxSteps));return}O.t=E,O.lag=0,K.clear(),O._visualFire.clear(),A.update(E),q(E);let R=0,L=bt.length;for(;R<L;){const U=R+L>>1;bt[U].t<=E?R=U+1:L=U}O._cursor=R;for(const U of M.ships){let H=null;for(const V of U.events){if(V.t>E)break;V.kind==="opens-fire"&&(H=V),V.kind==="ceases-fire"&&(H=null)}H&&Gt(U.slot,H)}O.momentState&&(O._momentCursor=O._momentQueue.findIndex(U=>U.t>E)>>>0)};function rt(b,E=""){const R=P[b];if(R.touched||!R.rec||(R.touched=!0,R.touchedAt=O.t,R.touchedWhy=E,z[b].kind!=="ship"))return;const L=R.dmg;L.regime="sim";const U=R.rec,H=h.dmg.fork(`init:${U.id}`);let V=!1;for(const W of U.events){if(W.k>=(R.rd.applied??0))break;if(W.kind==="hit"||W.kind==="torpedo-hit"){V=!0;const et=ct(W);for(let dt=0;dt<Math.max(1,W.rc);dt++)Ds(L,R.model,{cls:et,...Q(W,H),t:W.t},H)}else if(W.kind==="fire"){const et=L.fires.indexOf(0);et>=0&&(L.fires[et]=1)}}V&&U.sinkT!=null&&(L.doomed=!0,L.doomedAt??(L.doomedAt=O.t),L.doomedWhy??(L.doomedWhy="record"),L.sinkDue=U.sinkT),E&&(R.touchedWhy=E)}O._touch=rt;function ht(b){const E=P[b],R=z[b];if(R.authority==="record")if(rt(b),R.authority="ai",R.kind==="ship"){const L=3*b;E.body=cu(E.model,{x:N.pos[L],z:N.pos[L+2],heading:N.heading[b],V:N.speed[b]}),E.ai=mu(O,b)}else{const L=3*b,U=N.vel[L],H=N.vel[L+1],V=N.vel[L+2],W=Math.hypot(U,V);E.body=El(E.model,{x:N.pos[L],y:N.pos[L+1],z:N.pos[L+2],V:Math.max(40,Math.hypot(W,H)),heading:N.heading[b],gamma:Math.atan2(H,W),throttle:.8}),E.body.phi=E.bank,E.ai=Cl(O,b),E.ammo=Al(E.model)}}O._toAI=ht;const ct=b=>{var L,U,H;const E=M.groupById.get(b.by);if(E!=null&&E.model){if(b.kind==="torpedo-hit")return"torpedo-air";const V=(L=E.model.payload[0])==null?void 0:L.weapon;return V?va(V):"bomb-500"}const R=M.shipById.get(b.by);if(R){const V=m(R.kitId);if(b.kind==="torpedo-hit")return(U=V==null?void 0:V.torp)!=null&&U.weapon?va(V.torp.weapon):"torpedo-t93";const W=(H=V==null?void 0:V.batteries[0])==null?void 0:H.weapon;return W?va(W):"medium"}return b.kind==="torpedo-hit"?"torpedo-air":"bomb-500"},Q=(b,E)=>{const R=XM(b.where||"",E);return{zone:R.zone,part:R.part==="turret"?"hull":R.part??(b.kind==="torpedo-hit"?"waterline":"hull"),side:R.side,uptake:R.uptake}};function it(b){if(O._cancelled.has(b.index))return 0;let E=0;for(const R of b.aircraft){const L=R.slot;if(L==null||O.player&&O.player.unitIndex===L||R.noReach)continue;const U=P[L],H=R.releaseT??1/0;if(U.lostAt!=null){if(U.lostAt<H)continue}else if(z[L].authority==="record"&&R.lossT!=null&&R.lossT<H&&!U.spared)continue;E++}return E}O._survivors=it;function at(b,E,R){if(!R&&O._cancelled.has(b.index))return 0;let L=0;for(const U of b.aircraft){if(E<U.spawnT)continue;const H=U.lossT!=null&&U.lossT<=E;if(R){H||L++;continue}const V=U.slot,W=V==null?null:P[V];W&&W.lostAt!=null&&W.lostAt<=E||H&&(!W||z[V].authority==="record"&&!W.spared)||L++}return L}function pt(b,E,R){var Mt;const L=it(b),U=Math.max(0,b.Srec-(R?1:0)),H=Math.max(0,E.rc-(R?1:0));if(U<=0)return{count:H,changed:!1};if(L<xt.group.minShare*U)return{count:0,changed:!0,S:L,Srec:U};const V=P[E.unit].model,W=((Mt=b.attack)==null?void 0:Mt.profile)||"default",et=W==="dive"?xt.group.baseRate.dive[V==null?void 0:V.type]??xt.group.baseRate.dive.default:xt.group.baseRate[W]??xt.group.baseRate.default,dt=H*Math.min(1,L/U)+et*Math.max(0,L-U);return{count:Math.floor(dt)+(h.rule.chance(dt-Math.floor(dt))?1:0),changed:L!==U||R,S:L,Srec:U}}function mt(b){var U,H;const E=b.slot,R=z[E],L=P[E];switch(b.kind){case"spawn":{if(R.authority!=="record")return;const V=L.g;if(!O._cancelled.has(V.index)&&V.from>=0&&b===St(V)){const W=M.ships[V.from].slot,et=P[W].dmg;if(N.alive[W]!==1||et.regime==="sim"&&(et.out||et.sinking||et.doomed||et.fires.reduce((dt,ft)=>dt+ft,0)>=2)){O._cancelled.add(V.index),V.cancelledAt=O.t,Xt(W,"launches",`${z[W].name}: ${V.name} not launched`);return}}if(O._cancelled.has(V.index))return;L.prev=null,Ut(E,O.t,0),I(E,1),b===St(V)&&wt(zt.launch,N.pos[3*E],N.pos[3*E+1],N.pos[3*E+2],{unit:E});return}case"event":return Pt(b);case"sinkstart":if(R.authority!=="record"&&!((U=L.rec)!=null&&U.fixed)||L.dmg.regime==="sim"&&!L.rec.fixed)return;I(E,2),wt(zt.sink,N.pos[3*E],0,N.pos[3*E+2],{unit:E,size:L.model.L}),(H=L.rec)!=null&&H.fixed||Xt(E,"sinks",`${R.name}: sinking`);return;case"sunk":if(L.dmg.regime==="sim"&&!L.rec.fixed)return;I(E,0);return;case"release":case"drop":case"strafe":return R.authority!=="record"||N.alive[E]!==1?void 0:fb(O,b);case"choreo":return R.authority!=="record"||N.alive[E]!==1?void 0:mb(O,E);case"lose":{if(R.authority!=="record"||N.alive[E]!==1)return;const V=L.ac.lossCause;if(typeof V=="number"){const W=M.groups[V],et=at(W,O.t,!0),dt=at(W,O.t,!1),ft=et>0?Math.min(1,dt/et):1;if(ft<1&&!h.rule.chance(ft)){L.spared=!0,L.sparedAt=O.t,L.ac={...L.ac,lossT:null,goneT:null},Number.isFinite(L.ac.endT)&&nt({t:L.ac.endT,kind:"exit",slot:E,n:bt.length});return}}I(E,2),wt(zt.fall,N.pos[3*E],N.pos[3*E+1],N.pos[3*E+2],{unit:E,data:L.ac.lossHow==="ditch"?1:0});return}case"gone":if(R.authority!=="record"||!N.alive[E]||L.spared)return;wt(zt.splash,N.pos[3*E],0,N.pos[3*E+2],{unit:E,size:12}),I(E,0);return;case"land":case"exit":if(R.authority!=="record"||N.alive[E]!==1)return;I(E,0);return}}function nt(b){let E=O._cursor,R=bt.length;for(;E<R;){const L=E+R>>1;bt[L].t<=b.t?E=L+1:R=L}bt.splice(E,0,b)}O._insertAction=nt;const yt=new Map,St=b=>{if(!yt.has(b.index)){const E=b.aircraft.length?Math.min(...b.aircraft.map(R=>R.spawnT)):1/0;yt.set(b.index,bt.find(R=>R.kind==="spawn"&&P[R.slot].g===b&&R.t===E))}return yt.get(b.index)};function Pt(b){const E=P[b.slot];try{return Ft(b)}finally{E.rd.applied=Math.max(E.rd.applied??0,b.ev.k+1)}}function Ft(b){var re,Bt;const E=b.slot,R=b.ev,L=R.hud===!1?()=>{}:O.beat,U=z[E],H=P[E],V=O.player,W=V?V.unitIndex:-1,et=E===W,dt=R.by?M.groupById.get(R.by):null,ft=R.by?M.shipById.get(R.by):null,Mt=ft&&ft.slot===W,Ot=dt&&V&&((re=z[W])==null?void 0:re.groupIndex)===dt.index,Kt=!!H.rec.fixed;if(tl.has(R.kind)){if(!Kt&&(et||Mt)){ft&&et&&Jt(ft.slot);return}if(!U.target||((Bt=H.model)==null?void 0:Bt.fatal)==null)return;let Ct=R.rc,fe=!1,Yt="group rule";if(!Kt&&dt){const ce=pt(dt,R,Ot);Yt=`group rule: ${dt.id} ${ce.S??"?"} flying of ${ce.Srec??"?"} reached, ${ce.count} of ${R.rc} hits`,Ct=ce.count,fe=ce.changed&&Ct!==R.rc,ce.changed&&Ot&&(fe=!0)}else if(!Kt&&ft){const ce=ft.slot,gn=P[ce].dmg;N.alive[ce]!==1||gn.regime==="sim"&&(gn.out||gn.sinking)?(Ct=0,fe=!0):gn.regime==="sim"&&gn.crippled&&(Ct=Math.round(Ct*.5),fe=Ct!==R.rc)}if(!fe&&!H.touched){R.kind!=="near-miss"&&(H.rd.damage+=R.damage??.08*Math.max(1,R.rc),H.rd.hits+=R.rc),Et(E,R,Ct),(R.kind!=="near-miss"||R.text)&&L(E,R.kind,Pn(U.name,R),R.sources);return}if(rt(E,Yt),Ct<=0)return;const Ee=ct(R),He=h.dmg,Ie=[];if(R.kind!=="near-miss")for(let ce=0;ce<Ct;ce++)Ie.push(Ds(H.dmg,H.model,{cls:Ee,...Q(R,He),t:O.t},He));Et(E,R,Ct),L(E,R.kind,Pn(U.name,R,Ct!==R.rc?` (${Ct})`:""),R.sources);const Cn=Ie.filter(Boolean);Cn.length&&L(E,"damage",`${U.name}: ${[...new Set(Cn.join(", ").split(", "))].join(", ")}`);return}const Qt=H.dmg&&H.dmg.regime==="sim"&&!Kt;switch(R.kind){case"fire":case"flood":case"list":case"explodes":case"dead-in-water":case"steering-jammed":case"power-failure":case"radar-lost":if(Qt)return;R.kind==="fire"?(H.rd.fires++,wt(zt.fire,N.pos[3*E],8,N.pos[3*E+2],{unit:E,size:1})):R.kind==="list"?H.rd.list+=R.deg??R.listDeg??8:R.kind==="explodes"&&(H.rd.fires+=2,wt(zt.explode,N.pos[3*E],10,N.pos[3*E+2],{unit:E,size:3})),L(E,R.kind,Pn(U.name,R),R.sources);return;case"sinks":case"abandoned":if(Qt)return;L(E,R.kind,Pn(U.name,R),R.sources);return;case"scuttled":if(Qt&&!H.dmg.doomed)return;Qt&&(H.dmg.sinkDue=O.t),L(E,R.kind,Pn(U.name,R),R.sources);return;case"opens-fire":(U.authority==="record"||U.authority==="ai")&&Gt(E,R),L(E,R.kind,Pn(U.name,R),R.sources);return;case"ceases-fire":O._visualFire.delete(E),L(E,R.kind,Pn(U.name,R),R.sources);return;case"torpedoes-fired":pb(O,E,R),L(E,R.kind,Pn(U.name,R),R.sources);return;case"smoke-screen":{const Ct=3*E,fe=R.lengthM??3e3,Yt=R.durationS??1200,[Ee,He]=Te(N.heading[E]);let Ie=N.pos[Ct],Cn=N.pos[Ct+2];R.lonlat&&([Ie,Cn]=o.toWorld(R.lonlat)),A.addSmoke(Ie,Cn,Ie-Ee*fe,Cn-He*fe,O.t,O.t+Yt,F.x,F.z),wt(zt.smoke,Ie,20,Cn,{unit:E,dx:-Ee*fe,dz:-He*fe,size:Yt,data:1}),L(E,R.kind,Pn(U.name,R),R.sources);return}case"searchlight":case"illuminated":case"starshell":{const Ct=3*E,fe=R.target?M.shipById.get(R.target):null,Yt=fe?fe.slot:E,Ee=N.pos[3*Yt],He=N.pos[3*Yt+2],Ie=R.kind==="starshell"?45:180;A.addLight(Ee,0,He,1500,O.t+Ie,R.kind),R.kind==="starshell"?wt(zt.starshell,Ee,500,He,{unit:E,size:Ie}):wt(zt.searchlight,N.pos[Ct],25,N.pos[Ct+2],{unit:E,dx:Ee-N.pos[Ct],dz:He-N.pos[Ct+2],size:Ie}),L(E,R.kind,Pn(U.name,R),R.sources);return}default:L(E,R.kind,Pn(U.name,R),R.sources)}}function Et(b,E,R){const L=3*b,U=P[b].model,[H,V]=Te(N.heading[b]),W=h.fx,et=Math.min(8,Math.max(1,R));for(let dt=0;dt<et;dt++){const ft=(W.next()-.5)*U.L*.7,Mt=N.pos[L]+H*ft,Ot=N.pos[L+2]+V*ft;E.kind==="near-miss"?wt(zt.splash,Mt+(W.next()-.5)*U.B*3,0,Ot+(W.next()-.5)*U.B*3,{unit:b,size:30}):E.kind==="torpedo-hit"?wt(zt.splash,Mt,0,Ot,{unit:b,size:60,data:0}):wt(zt.explode,Mt,U.deck+2,Ot,{unit:b,size:1}),E.kind!=="near-miss"&&wt(zt.hit,Mt,U.deck,Ot,{unit:b,size:1})}}function Gt(b,E){var H;const R=P[b].rec;let L=E.target?(H=M.shipById.get(E.target))==null?void 0:H.slot:null;if(L==null){let V=null;for(const W of M.ships)for(const et of W.events)et.by===(R==null?void 0:R.id)&&et.t>=E.t&&(!V||et.t<V.t)&&(V={t:et.t,slot:W.slot});L=(V==null?void 0:V.slot)??null}let U=E.t+1200;for(const V of M.ships)for(const W of V.events)W.by===(R==null?void 0:R.id)&&W.t>=E.t&&tl.has(W.kind)&&(U=Math.max(U,W.t+600));O._visualFire.set(b,{target:L,next:O.t+2+h.fx.next()*4,until:U})}function Jt(b){b==null||b<0||(z[b].authority==="record"&&ht(b),O._engaged.add(b),P[b].ai&&(P[b].ai.engaged=!0))}O._engage=Jt,O.takeControl=function(E){var H;if(!E)throw new Error("takeControl: no role");O.player&&O.releaseControl();const R=E.kind;let L=-1;if(R==="ship"){const V=M.shipById.get(E.unit);if(!V)throw new Error(`takeControl: no unit “${E.unit}”`);if(V.tokko)throw new Error("takeControl: a tokkō unit is never a player role");if(L=V.slot,N.alive[L]!==1)throw new Error(`takeControl: ${V.name} is not afloat at this time`);rt(L,"player");const W=P[L],et=3*L;W.body=cu(W.model,{x:N.pos[et],z:N.pos[et+2],heading:N.heading[L],V:N.speed[L]}),W.guns=ec(O,L),W.torpedoes=W.model.torp?{ready:W.model.torp.tubes??2,reloadAt:0}:null,z[L].authority="player"}else{const V=E.group?M.groupById.get(E.group):null,W=E.kit||(V==null?void 0:V.kitId);if(V){const Qt=(H=V.raw)!=null&&H.namedCrews?[]:V.aircraft.filter(Bt=>Bt.k!==0&&Bt.slot!=null&&z[Bt.slot].authority==="record"&&N.alive[Bt.slot]===1);Qt.sort((Bt,Ct)=>(Bt.releaseT??1e9)-(Ct.releaseT??1e9));const re=Qt.find(Bt=>(Bt.releaseT??1/0)>O.t+15)||Qt[0];re&&(L=re.slot)}if(L<0&&(L=oe(W,"aircraft",V)),L<0)throw new Error("takeControl: no slot free");const et=P[L],dt=3*L,ft=N.vel[dt],Mt=N.vel[dt+1],Ot=N.vel[dt+2],Kt=Math.hypot(ft,Ot);et.body=El(et.model,{x:N.pos[dt],y:N.pos[dt+1],z:N.pos[dt+2],V:Math.max(et.model.vCruise*.8,Math.hypot(Kt,Mt)),heading:N.heading[L],gamma:Math.atan2(Mt,Math.max(1,Kt)),throttle:.8}),et.ammo=Al(et.model),z[L].authority="player",et.touched=!0}z[L];const U={kind:R,unitIndex:L,scripted:!1,input:z_(R,P[L],N,L),state:{},_seen:{fireCount:0,bombCount:0,torpedoCount:0,salvoCount:0,starshellCount:0},role:E};return O.player=U,O.diverged=!0,O._score={hits:[],downed:0,torpedoesHit:0,salvos:0,straddles:0,shells:0,bombs:0,torpedoes:0,releaseM:null,envelope:[],objective:!1,start:O.t,lost:null,how:null},gu(O),U};function oe(b,E,R=null){var L,U;for(let H=st;H<tt;H++){if(z[H].authority!=="free")continue;const V=z[H];return V.kind=E,V.kit=b,V.kitIndex=J(b,E),N.kitIndex[H]=V.kitIndex,V.side=(R==null?void 0:R.side)??((L=f.get(b))==null?void 0:L.side)??"us",V.id=`spare-${H-st}`,V.name=(R==null?void 0:R.name)??((U=f.get(b))==null?void 0:U.name)??b,V.group=(R==null?void 0:R.id)??null,V.groupIndex=(R==null?void 0:R.index)??-1,V.authority="ai",P[H].model=p(b),P[H].spare=!1,P[H].wasSpare=!0,N.alive[H]=0,H}return-1}O._allocSpare=oe,O.releaseControl=function(){const E=O.player;if(!E)return;const R=E.unitIndex,L=z[R];L.authority==="player"&&(L.authority="ai",P[R].ai=L.kind==="ship"?mu(O,R):Cl(O,R,{rejoin:!0})),O.momentState&&!O.momentState.done&&$t("released"),O.player=null},O.startMoment=function(E,{atCheckpoint:R=!1}={}){const L=M.moments.get(E);if(!L)throw new Error(`no moment “${E}”`);!O.diverged&&!R&&Math.abs(O.t-L.t)>1e-6&&O.setTime(L.t);const U=O.player||O.takeControl(L.role);if(!R||N.alive[U.unitIndex]!==1)D_(O,L);else if(U.kind==="aircraft"){const W=P[U.unitIndex].body,et=Math.max(0,v.heightAt(W.x,W.z))+30;W.y<et&&(W.y=et,W.gamma=Math.max(0,W.gamma),N.pos[3*U.unitIndex+1]=et)}const H=L.timeScale??(L.role.kind==="aircraft"?1:2),V=L.t+(L.durationS??180)*H;return O.momentState={id:E,t0:L.t,t1:V,elapsed:O.t-L.t,checkpoint:R,done:!1,reason:null,timeScale:H,maxTimeScale:L.maxTimeScale??(L.role.kind==="aircraft",4),restart:[L.t,V]},O._momentQueue=(L.beats||[]).map(W=>({...W})).sort((W,et)=>W.t-et.t),O._momentCursor=R?O._momentQueue.findIndex(W=>W.t>O.t)>>>0:0,O._score.start=O.t,O._moment=L,U};function $t(b){const E=O.momentState;!E||E.done||(E.done=!0,E.reason=b,E.endT=O.t)}O._endMoment=$t;const ot=[0,0,0],$={s:0,lx:0,ly:0,lz:0};function At(b,{recordAircraft:E=!0}={}){var U,H,V;const L=O.t+b;O.t=L,A.update(L);for(let W=0;W<tt;W++){const et=P[W];et.spare||z[W].authority!=="record"||(et.rec?N.alive[W]&&gt(W,L):et.ac&&E&&N.alive[W]&&Ut(W,L,b))}N_(O,b),X_(O,b),ob(O,b),Vt(b);for(let W=0;W<tt;W++){const et=P[W];if(!et.dmg||et.dmg.regime!=="sim"||!N.alive[W])continue;const dt=et.model.carrier?DM(et.rec,L)??0:0,ft=JM(et.dmg,et.model,b,{t:L,rng:h.dmg,H:dt,recordSinkT:((U=et.rec)==null?void 0:U.sinkT)??null});for(const Mt of ft)Tt(W,Mt);N.damage[W]=QM(et.dmg),N.fire[W]=t_(et.dmg),N.list[W]=et.dmg.list}for(db(O,b);O._cursor<bt.length&&bt[O._cursor].t<=L;)mt(bt[O._cursor++]);if(O.momentState&&!O.momentState.done){const W=O._momentQueue;for(;O._momentCursor<W.length&&W[O._momentCursor].t<=L;){const et=W[O._momentCursor++];Xt(((H=O.player)==null?void 0:H.unitIndex)??-1,"moment",et.text,et.sources||null)}}if(O.visualFire&&gb(O),vb(O,b),O.momentState&&!O.momentState.done){const W=O.momentState;W.elapsed=L-W.t0,!W.checkpoint&&L>=W.t1&&(W.checkpoint=!0,Xt(((V=O.player)==null?void 0:V.unitIndex)??-1,"checkpoint","Checkpoint")),L>=s.duration&&$t("clock")}gu(O),bb(O)}function Tt(b,E){const R=z[b],L=3*b;E.kind==="doomed"?Xt(b,"damage",`${R.name}: ${E.text}`):E.kind==="sink"?(I(b,2),wt(zt.sink,N.pos[L],0,N.pos[L+2],{unit:b,size:P[b].model.L}),Xt(b,"sinks",`${R.name}: ${E.text}`),P[b].sunkAt=O.t):E.kind==="gone"&&I(b,0)}O._shipFate=Tt;function Vt(b){var R,L;const E=K;if(E.count)for(let U=0;U<E.capacity;U++){if(!E.alive[U])continue;const H=E.kind[U],V=3*U;if(H===on.shell){const W=E.weapon[U];if(r_(E,U,O.weaponList[W].shell,b,ot),E.flags[U]&te.star){(E.life[U]>0?O.t-E.born[U]>=E.life[U]||E.vel[V+1]<0&&E.pos[V+1]<250:E.vel[V+1]<0)&&(wt(zt.starshell,E.pos[V],E.pos[V+1],E.pos[V+2],{unit:E.owner[U],size:45}),A.addLight(E.pos[V],0,E.pos[V+2],1800,O.t+45,"starshell"),E.kill(U));continue}Be(U)}else if(H===on.bullet)hu(E,U,c_(E.calibreMm[U]),b,ot),E.life[U]-=b,bn(U),E.alive[U]&&(E.life[U]<=0||E.pos[V+1]<v.heightAt(E.pos[V],E.pos[V+2]))&&(E.pos[V+1]<1&&E.flags[U]&te.player&&wt(zt.splash,E.pos[V],0,E.pos[V+2],{size:2}),E.kill(U));else if(H===on.bomb){const W=(R=O.weaponList[E.weapon[U]])==null?void 0:R.w;hu(E,U,h_((W==null?void 0:W.massKg)??250),b,ot),Oo(U)}else if(H===on.torpedo){l_(E,U,b,ot),E.aux[U]>(E.flags[U]&te.armed?0:1e9);const W=(L=O.weaponList[E.weapon[U]])==null?void 0:L.w;!(E.flags[U]&te.armed)&&E.aux[U]>=((W==null?void 0:W.armRunM)??300)&&(E.flags[U]|=te.armed),rr(U),E.alive[U]&&(E.life[U]<=0||v.metresAt(E.pos[V],E.pos[V+2])>-2)&&(v.metresAt(E.pos[V],E.pos[V+2])>-2&&wt(zt.splash,E.pos[V],0,E.pos[V+2],{size:8}),E.kill(U))}}}function Nt(b,E,R){const L=[];for(let U=0;U<tt;U++){if(z[U].kind!=="ship"||N.alive[U]!==1)continue;const H=N.pos[3*U]-b,V=N.pos[3*U+2]-E,W=P[U].model.L;H*H+V*V<(R+W)*(R+W)&&L.push(U)}return L}O._shipsNear=Nt;function ae(b){return P[b].model.half}const se={s:0,lx:0,ly:0,lz:0};function ye(b,E,R,L,U,H,V,W,et=null){const dt=P[b].model,ft=dt.half,Mt=N.pos[3*b],Ot=N.pos[3*b+2],Kt=N.heading[b],Qt=N.pos[3*b+1],re=Ra(E,R-Qt,L,U,H-Qt,V,Mt,Ot,Kt,ft.x,ft.z,et??ft.yLo,ft.yHi,W),Bt=dt.sup;let Ct=-1;if(Bt){const fe=(Bt.z0+Bt.z1)/2,Yt=Kt*Ht,Ee=-Math.sin(Yt)*fe+Math.cos(Yt)*Bt.xc,He=Math.cos(Yt)*fe+Math.sin(Yt)*Bt.xc;Ct=Ra(E,R-Qt,L,U,H-Qt,V,Mt+Ee,Ot+He,Kt,Bt.x,(Bt.z1-Bt.z0)/2,Bt.yLo,Bt.yHi,se),Ct>=0&&(se.lz+=fe,se.lx+=Bt.xc)}return re<0&&Ct<0?-1:re>=0&&(Ct<0||re<=Ct)?(W.part=W.ly<1?"waterline":"hull",re):(W.s=se.s,W.lx=se.lx,W.ly=se.ly,W.lz=se.lz,W.part="super",Ct)}O._shipHit=ye;function Be(b,E){const R=K,L=3*b,U=R.pos[L],H=R.pos[L+1],V=R.pos[L+2],W=R.flags[b]&te.visual;if(H<80)for(const et of Nt(U,V,400)){if(et===R.owner[b])continue;const dt=ye(et,ot[0],ot[1],ot[2],U,H,V,$,P[et].model.half.yLo*.5);if(dt>=0){const ft=ot[0]+(U-ot[0])*dt,Mt=ot[1]+(H-ot[1])*dt,Ot=ot[2]+(V-ot[2])*dt;W?R.flags[b]&te.hit||h.fx.next()<.3?wt(zt.hit,ft,Math.max(Mt,2),Ot,{unit:et,size:R.calibreMm[b]/100}):wt(zt.splash,ft,0,Ot,{size:R.calibreMm[b]/6,data:le(b)}):De(b,et,ft,Mt,Ot,$),R.kill(b);return}}if(H<0){const et=ot[1]/(ot[1]-H),dt=ot[0]+(U-ot[0])*et,ft=ot[2]+(V-ot[2])*et;v.metresAt(dt,ft)>0?wt(zt.explode,dt,v.heightAt(dt,ft),ft,{size:R.calibreMm[b]/200}):wt(zt.splash,dt,0,ft,{size:R.calibreMm[b]/6,data:le(b)}),W||ub(O,b,dt,ft),R.kill(b)}}const le=b=>{var H,V;if(A.light!=="day")return 0;const E=K.owner[b];if(E<0)return 0;const R=P[E],L=((H=R.model)==null?void 0:H.dyes)||{},U=((V=R.rec)==null?void 0:V.dye)??L[z[E].name]??null;return b_(U)};function De(b,E,R,L,U,H){var Yt;const V=K,W=P[E],et=z[E],dt=W.model,ft=V.weapon[b],Mt=O.weaponList[ft];if(wt(zt.hit,R,Math.max(2,L),U,{unit:E,size:V.calibreMm[b]/100}),!ri(O,E))return;const Ot=V.owner[b],Kt=!!(V.flags[b]&te.player);if(Kt&&((Yt=W.rec)!=null&&Yt.fixed))return;rt(E,Kt?"player":"ai");const Qt=Qr(Math.floor((H.lz/dt.L+.5)*4),0,3),re=H.part??(H.ly<1?"waterline":"hull"),Bt=Ot>=0?Math.hypot(N.pos[3*Ot]-R,N.pos[3*Ot+2]-U):1e4,Ct=Ds(W.dmg,dt,{cls:Mt.cls,part:re,zone:Qt,side:H.lx>=0?1:-1,calibreMm:V.calibreMm[b],ap:Mt.w.shell==="ap"||V.calibreMm[b]>=200,rangeM:Bt,t:O.t},h.dmg),fe=Qt===0?"forward":Qt===3?"aft":"amidships";(Kt||Ct)&&Xt(E,"hit",`${et.name}: hit ${re==="super"?"in the superstructure":re==="waterline"?"at the waterline":fe}${Ct?`, ${Ct}`:""}`),Kt&&(ar(O,E,"shell"),Jt(E),rf(O,E,R,U))}O._shellStrike=De;function bn(b){const E=K,R=3*b,L=E.pos[R],U=E.pos[R+1],H=E.pos[R+2],V=E.owner[b],W=V>=0?z[V].side:null,et=E.target[b],dt=et>=0?[et]:F_(O,L,U,H,400);for(const ft of dt){if(ft===V||N.alive[ft]!==1||z[ft].kind!=="aircraft"||z[ft].side===W)continue;const Mt=P[ft].model,Ot=Math.max(Mt.span,Mt.length)*.42;if(x_(ot[0],ot[1],ot[2],L,U,H,N.pos[3*ft],N.pos[3*ft+1],N.pos[3*ft+2],$)<Ot*Ot){ab(O,b,ft),E.kill(b);return}}if(U<40&&E.flags[b]&te.player){for(const ft of Nt(L,H,50))if(ye(ft,ot[0],ot[1],ot[2],L,U,H,$,0)>=0){wt(zt.hit,L,Math.max(2,U),H,{unit:ft,size:.1}),E.kill(b);return}}}function Oo(b){const E=K,R=3*b,L=E.pos[R],U=E.pos[R+1],H=E.pos[R+2],V=O.weaponList[E.weapon[b]];if(U<60)for(const et of Nt(L,H,200)){const dt=ye(et,ot[0],ot[1],ot[2],L,U,H,$,0);if(dt>=0){const ft=ot[0]+(L-ot[0])*dt,Mt=ot[1]+(U-ot[1])*dt,Ot=ot[2]+(H-ot[2])*dt;wt(zt.explode,ft,Math.max(Mt,2),Ot,{unit:et,size:1.5}),wt(zt.hit,ft,Math.max(Mt,2),Ot,{unit:et,size:1}),E.flags[b]&te.visual||lb(O,b,et,$,V),E.kill(b);return}}const W=v.heightAt(L,H);U<=W&&(v.metresAt(L,H)>0?wt(zt.explode,L,W,H,{size:1.2}):wt(zt.splash,L,0,H,{size:25,data:0}),E.flags[b]&te.visual||cb(O,b,L,H),E.kill(b))}function rr(b){const E=K,R=3*b,L=E.pos[R],U=E.pos[R+2];for(const H of Nt(L,U,150)){if(H===E.owner[b])continue;const V=ae(H),W=Ra(ot[0],-2,ot[2],L,-2,U,N.pos[3*H],N.pos[3*H+2],N.heading[H],V.x,V.z,-P[H].model.T,2,$);if(W<0)continue;const et=ot[0]+(L-ot[0])*W,dt=ot[2]+(U-ot[2])*W,ft=E.flags[b]&te.armed,Mt=E.flags[b]&te.dud;if(E.flags[b]&te.visual){E.flags[b]&te.hit&&ft&&wt(zt.splash,et,0,dt,{unit:H,size:70}),E.kill(b);return}if(!ft||Mt){wt(zt.hit,et,0,dt,{unit:H,size:.2}),Xt(H,"torpedo",`${z[H].name}: a torpedo struck and did not explode`),E.kill(b);return}wt(zt.splash,et,0,dt,{unit:H,size:70}),hb(O,b,H,$),E.kill(b);return}}function is(){if(O.player||O.diverged)return!1;for(let b=0;b<K.capacity;b++)if(K.alive[b]&&!(K.flags[b]&te.visual))return!1;return!0}return O.advance=function(E){if(!(E>0))return 0;const R=s.duration;if(O.t>=R)return 0;if(is()&&E>xt.step*xt.maxSteps){const H=Math.min(E,R-O.t),V=Math.max(1,Math.ceil(H/(xt.step*4))),W=H>2;for(let et=0;et<V;et++)At(H/V,{recordAircraft:et===V-1||!W});return O.lag=0,V}O.lag+=E;let L=Math.floor(O.lag/xt.step+1e-9);L>xt.maxSteps&&(L=xt.maxSteps);const U=!!O.player||K.count>0;for(let H=0;H<L&&O.t<R;H++)At(xt.step,{recordAircraft:U||H===L-1});return O.lag-=L*xt.step,O.lag>xt.step*xt.maxSteps&&(O.lag=xt.step*xt.maxSteps),L},O.pick=function(E,R,{slack:L=1}={}){const U=E.x??E[0],H=E.y??E[1],V=E.z??E[2];let W=R.x??R[0],et=R.y??R[1],dt=R.z??R[2];const ft=Math.hypot(W,et,dt)||1;W/=ft,et/=ft,dt/=ft;let Mt=-1,Ot=1/0;for(let Kt=0;Kt<tt;Kt++){if(!N.alive[Kt])continue;const Qt=z[Kt],re=3*Kt;if(Qt.kind==="ship"){const Bt=P[Kt].model.half,Ct=v_(U,H,V,W,et,dt,N.pos[re],N.pos[re+2],N.heading[Kt],Bt.x*L,Bt.z*L,Bt.yLo,Bt.yHi*L+5);Ct>=0&&Ct<Ot&&(Ot=Ct,Mt=Kt)}else if(Qt.kind==="aircraft"){const Bt=N.pos[re]-U,Ct=N.pos[re+1]-H,fe=N.pos[re+2]-V,Yt=Bt*W+Ct*et+fe*dt;if(Yt<=0)continue;const Ee=P[Kt].model,He=Math.max(Ee.span,Ee.length)*.75*L+Yt*.004*L;Bt*Bt+Ct*Ct+fe*fe-Yt*Yt<He*He&&Yt<Ot&&(Ot=Yt,Mt=Kt)}}return Mt},Object.defineProperty(O,"score",{get:()=>wb(O)}),Object.defineProperty(O,"outcome",{get:()=>Eb(O)}),O.setTime(0),O}function Tb(n,t){var o,r;let e=0,i=0,s=0;for(const a of n.units||[]){const l=(r=(o=a.track)==null?void 0:o[0])==null?void 0:r.lonlat;l&&(i+=l[0],s+=l[1],e++)}return t("sim: no box projection given; the tangent plane at the units’ centre is used"),new Fs({lon0:e?i/e:0,lat0:e?s/e:0})}const Ab=`
${ln}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
  ${Ze}
}
`,Cb=`
${un}
${ns}
${Wn}
${No}
${Fo}
${cn}
uniform vec3 uCamPos;
uniform float uUnitM;      // metres per world unit (1 in a box): the Hawaiian tuning is in 100 m units
uniform vec2 uWind;        // direction the wind blows toward, scaled by strength (0..1+)
uniform vec2 uSwellDir;    // direction the swell travels
uniform float uSeaK;       // the record's sea state as a scale on the chop and the whitecaps (1 near sea 2–3)
uniform float uSwellK;     // the record's swell as a scale on the long waves
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
  float amp = 0.006 * uSwellK;
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
  ${hn}
  float depth = seaDepth(vWorld.xz);
  if (depth < -0.05) discard; // land pokes through
  // (the rest in the Hawaiian 100 m units the tuning was done in)
  vec2 xz = vWorld.xz * uUnitM / 100.0;
  vec3 V = normalize(uCamPos - vWorld);
  float px = length(fwidth(xz));

  // (in a fishpond, behind its wall, the water lies still and green)
  float pond = distPond(vWorld.xz);
  vec2 g = waveSlope(xz, uTime, px) * (0.55 + 0.6 * length(uWind)) * uSeaK;
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
  if (depth < 12.0) rf = patchReef(vWorld.xz);
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
  // the point lights' glints: a star shell's path across the water
  col += pointGlints(N, V, vWorld, 300.0) * 1.5 + pointGlints(N, V, vWorld, 40.0) * 0.08;

  // --- foam --------------------------------------------------------------------
  // swash at the shore, where the water is shallowest (depth stands in for the
  // distance to land), and whitecaps in the trades out in deeper water
  // (over a patch's reef flat, which is a metre or two down throughout, the
  // swash would cover all of it: there it stays at the real shore's edge)
  float shore = (1.0 - smoothstep(0.1, 1.4, depth)) * (1.0 - pond) * (1.0 - 0.75 * rf);
  float swash = 0.5 + 0.5 * sin(depth * 9.0 - uTime * 1.6 + fbm2F(xz * 3.0, px * 3.0) * 4.0);
  float foamTex = smoothstep(0.35, 0.75, fbm2F(xz * 9.0 + vec2(uTime * 0.3, 0.0), px * 9.0));
  float caps = smoothstep(0.78, 0.92, fbm2F(xz * 0.9 + uWind * uTime * 0.06, px * 0.9)) * smoothstep(0.55, 1.1, length(uWind) * uSeaK) * smoothstep(20.0, 60.0, depth);
  caps *= 1.0 - smoothstep(0.3, 1.2, px);
  float foam = max(shore * swash * 0.9 * (1.0 - smoothstep(0.4, 2.5, px)), caps * 0.5) * mix(1.0, foamTex, 0.5);
  vec3 foamC = vec3(0.92) * (uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor * 1.4);
  col = mix(col, foamC, clamp(foam, 0.0, 1.0));

  // soft meeting with the sand
  float alpha = smoothstep(-0.02, 0.35, depth);
  if (uDebug == 1) { col = vec3(depth / 100.0, fract(depth), 0.0); alpha = 1.0; }
  gl_FragColor = vec4(col, alpha);
}
`;function Rb(n,t,e,i){const s=[0,0,0];for(let a=0;a<=i;a++){const l=n*Math.pow(t/n,a/i);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;s.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const o=[];for(let a=0;a<e;a++)o.push(0,1+(a+1)%e,1+a);for(let a=0;a<i;a++)for(let l=0;l<e;l++){const c=1+a*e+l,h=1+a*e+(l+1)%e,u=c+e,f=h+e;o.push(c,h,u,h,f,u)}const r=new Oe;return r.setAttribute("position",new we(s,3)),r.setIndex(o),r}const _u=n=>[Math.sin(n*Math.PI/180),-Math.cos(n*Math.PI/180)];class Lb{constructor(t,{unit:e=1,radius:i=1e6/e}={}){this.uniforms={...t,uCamPos:{value:new j},uUnitM:{value:e},uWind:{value:new qt(-.8,.45)},uSwellDir:{value:new qt(-.6,.8)},uSeaK:{value:1},uSwellK:{value:1},uDebug:{value:0}},this.material=new xe({vertexShader:Ab,fragmentShader:Cb,uniforms:this.uniforms,transparent:!0});const s=1/e;this.mesh=new ge(Rb(s,i,96,140),this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}setWeather(t={}){const e=t.wind||{},i=Number.isFinite(e.kn)?e.kn:8,s=Number.isFinite(e.fromDeg)?e.fromDeg:90,[o,r]=_u(s+180),a=i/16;this.uniforms.uWind.value.set(o*a,r*a);const[l,c]=_u((Number.isFinite(t.swellFromDeg)?t.swellFromDeg:s)+180);this.uniforms.uSwellDir.value.set(l,c);const h=Number.isFinite(t.sea)?t.sea:3;this.uniforms.uSeaK.value=.35+.22*h,this.uniforms.uSwellK.value=.4+.6*Math.min(4,Number.isFinite(t.swellM)?t.swellM:1)}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const kb=`
${un}
${Wn}
uniform vec4 uOwnRect;
uniform vec3 uSunDir;
uniform float uStep;   // world units: about one texel of the map
uniform float uTop;    // world Y of the highest ground; a ray above it is clear
in vec2 vUv;
float packMetres(vec2 xz) { return archMetres(xz); }
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
`;class Pb{constructor(t,e=1024,i=kb){const{W:s,H:o}=t,r=Math.min(1,e/Math.max(s,o)),a=Math.max(16,Math.round(s*r)),l=Math.max(16,Math.round(o*r));this.terrain=t,this.rt=new Vn(a,l,{type:An,format:Nl,depthBuffer:!1,minFilter:$e,magFilter:$e});const c=t.pack.rect;this.uniforms={...t.uniforms,uSunDir:{value:new j(0,1,0)},uStep:{value:Math.max((c.x1-c.x0)/a,(c.z1-c.z0)/l)},uTop:{value:1}},this.material=new xe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:i,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new Uo;const h=new ge(Yl(),this.material);h.frustumCulled=!1,this.scene.add(h),this.cam=new Za(-1,1,1,-1,0,1),this.h=l,this.strips=4,this.strip=-1,this.drawn={sun:new j(0,-2,0),vert:-1,k:-1}}get texture(){return this.rt.texture}update(t,e,i,s=1,o){const r=this.uniforms,a=this.drawn;if(this.strip<0){if(!(e.angleTo(a.sun)>.004||Math.abs(i-a.vert)>a.vert*.015||Math.abs(s-a.k)>.03))return;if(r.uSunDir.value.copy(e),r.uTop.value=o,a.sun.copy(e),a.vert=i,a.k=s,!this.ever)return this.ever=!0,this.draw(t,-1);this.strip=0}this.draw(t,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e){const i=this.rt;if(e>=0){const o=Math.ceil(this.h/this.strips);i.scissor.set(0,e*o,i.width,o),i.scissorTest=!0}else i.scissorTest=!1;const s=t.getRenderTarget();t.setRenderTarget(i),t.render(this.scene,this.cam),t.setRenderTarget(s),i.scissorTest=!1}dispose(){this.rt.dispose(),this.material.dispose()}}const zb=n=>Number.isInteger(n)?n.toFixed(1):String(n),Db=`
#define NEAR_E ${zb(nn.slopeExag)}
`,Ib=`
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
`,Ub=`
${un}
${Wn}
${ln}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[12];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out float vMetres;
float packMetres(vec2 xz) { return archMetres(xz); }

void main() {
${Nd}
  vMetres = mt;
  // The sea is drawn from the heights; the sea bed under it only needs to
  // show in the last few decimetres at the shoreline. Sink it below that so
  // the two surfaces never fight over depth.
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  ${Ze}
}
`,Fb=`
${un}
${Db}
${ns}
${Wn}
${Fo}
${Ib}
${cn}
uniform sampler2D uOwnN;   // normals at uNormalE (rgb), ambient occlusion (a)
uniform sampler2D uOwnL;   // r rain (unused: uRain), g sand, b riparian, a reserved
uniform sampler2D uOwnS;   // cast shadows (render/shadow.js), over the pack's rect
uniform vec4 uOwnRect;
uniform float uRain;       // the box's rain, ln(mm / 300) / ln 40
uniform float uUnitM;      // metres per world unit
uniform int uDebug;
in vec3 vWorld;
in float vMetres;

void main() {
  ${hn}
  vec2 xz = vWorld.xz;
  vec2 uv = rectUv(uOwnRect, xz);
  vec4 nt = texture(uOwnN, uv);
  vec4 land = texture(uOwnL, uv);
  // The normal map holds the ground's slope at uNormalE; turn it back into a
  // gradient (metres per metre) and stand it up at the box's exaggeration for
  // the light, and at the valley's for what grows where.
  vec2 grad = normalGrad(nt.xyz);
  vec3 n = normalize(vec3(-grad.x * uExag, 1.0, -grad.y * uExag));
  vec3 nC = normalize(vec3(-grad.x * NEAR_E, 1.0, -grad.y * NEAR_E));
  float ao = mix(1.0, nt.a, 0.85);
  float metres = vMetres;
  // (the albedo's noise in the Hawaiian 100 m units it was tuned in)
  vec2 hx = xz * uUnitM / 100.0;
  vec2 dX = dFdx(hx);
  vec2 dY = dFdy(hx);
  float px = length(abs(dX) + abs(dY)); // Hawaiian units per pixel
  float fwM = fwidth(metres);
  vec3 col = groundAlbedo(hx, metres, uRain, land.g, land.b, nC, px, fwM, 0.0);
  float vis = texture(uOwnS, uv).r;
  vec3 lit = shade(col, n, vWorld, ao, vis);
  if (uDebug == 1) lit = col * 2.0;
  if (uDebug == 2) lit = n * 0.5 + 0.5;
  if (uDebug == 3) lit = vec3(ao);
  if (uDebug == 4) lit = vec3(uRain, land.g, land.b);
  gl_FragColor = vec4(lit, 1.0);
}
`;class Nb{constructor(t,e,{exaggeration:i=nn.exaggeration,unit:s=nn.unit,rain:o=.45}={}){this.app=t,this.pack=e,this.unit=s,this.exag=i,this.uniforms={uVert:{value:i/s},uExag:{value:i},uNormalE:{value:e.data.normalExag??e.normalExag??nn.normalExag},uArchH:{value:null},uArchRect:{value:new Se},uOutside:{value:nn.outside}},this.lo=e.data.lo,this.hi=e.data.hi,this.terrain=new Fd(e,t.renderer,{...t.light.uniforms,...this.uniforms},{vertexShader:Ub,fragmentShader:Fb,unit:s,uniforms:{uRain:{value:o},uUnitM:{value:s},uKau:{value:.5}}}),this.uniforms.uArchH.value=this.terrain.heightTex,this.uniforms.uArchRect.value.copy(this.terrain.rect),this.shadow=new Pb(this.terrain,1024),this.terrain.setShadow(this.shadow.texture);const r=e.rect;this.bounds={x0:r.x0,z0:r.z0,x1:r.x1,z1:r.z1},this.group=this.terrain.group}get vert(){return this.uniforms.uVert.value}get maxY(){return Math.max(0,this.hi)*this.vert}metresAt(t,e){const i=this.bounds;return t<i.x0||e<i.z0||t>i.x1||e>i.z1?nn.outside:this.terrain.metresAt(t,e)}heightAt(t,e){return Math.max(0,this.metresAt(t,e))*this.vert}update(t){this.terrain.update(t,!0),this.shadow.update(this.app.renderer,this.app.light.sunDir,this.vert,1,this.maxY+50/this.unit)}setRange(t){this.terrain.applyRange(t)}stats(){return{exag:this.exag,...this.terrain.stats()}}dispose(){this.shadow.dispose(),this.terrain.dispose()}}const jt={plain:0,deck:1,glass:2,decal:3,prop:4,dark:5,metal:7};class zo{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.uv=[],this.xf=null,this.stack=[]}at(t,e,i,s=0,o=0){this.stack.push(this.xf);const r=Math.cos(s),a=Math.sin(s),l=Math.cos(o),c=Math.sin(o),h=this.xf;return this.xf=u=>{const f=u[1]*l+u[2]*c,d=-u[1]*c+u[2]*l,g=[t+u[0]*r-d*a,e+f,i+u[0]*a+d*r];return h?h(g):g},this}done(){return this.xf=this.stack.pop()||null,this}tri(t,e,i,s,o=0,r=null){this.xf&&(t=this.xf(t),e=this.xf(e),i=this.xf(i));const a=e[0]-t[0],l=e[1]-t[1],c=e[2]-t[2],h=i[0]-t[0],u=i[1]-t[1],f=i[2]-t[2];let d=l*f-c*u,g=c*h-a*f,x=a*u-l*h;const m=Math.hypot(d,g,x);if(m<1e-12)return;d/=m,g/=m,x/=m;const p=typeof s=="function"?s((t[0]+e[0]+i[0])/3,(t[1]+e[1]+i[1])/3,(t[2]+e[2]+i[2])/3,g):s,y=[t,e,i];for(let v=0;v<3;v++){const M=y[v];this.pos.push(M[0],M[1],M[2]),this.nor.push(d,g,x),this.col.push(p[0],p[1],p[2]),this.mat.push(o),r?this.uv.push(r[v][0],r[v][1]):this.uv.push(0,0)}}quad(t,e,i,s,o,r=0,a=null){this.tri(t,e,i,o,r,a&&[a[0],a[1],a[2]]),this.tri(t,i,s,o,r,a&&[a[0],a[2],a[3]])}hexa(t,e,i,s=0){this.quad(e[0],e[3],e[2],e[1],i,s),this.quad(t[0],t[1],t[2],t[3],i,s);for(let o=0;o<4;o++)this.quad(t[o],e[o],e[(o+1)%4],t[(o+1)%4],i,s)}box(t,e,i,s,o,r,a,l=0,c=0,h=1){const u=Math.cos(c),f=Math.sin(c),d=(M,S,T)=>[t+M*u-T*f,e+S,i+M*f+T*u],g=s/2,x=r/2,m=g*h,p=x*h,y=[d(-g,0,-x),d(g,0,-x),d(g,0,x),d(-g,0,x)],v=[d(-m,o,-p),d(m,o,-p),d(m,o,p),d(-m,o,p)];o<0?this.hexa(v,y,a,l):this.hexa(y,v,a,l)}cyl(t,e,i,s,o,r=0,a=6,l=!1){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],h=Math.hypot(...c)||1,u=c.map(p=>p/h),f=Math.abs(u[1])<.9?[0,1,0]:[1,0,0];let d=[u[1]*f[2]-u[2]*f[1],u[2]*f[0]-u[0]*f[2],u[0]*f[1]-u[1]*f[0]];const g=Math.hypot(...d);d=d.map(p=>p/g);const x=[u[1]*d[2]-u[2]*d[1],u[2]*d[0]-u[0]*d[2],u[0]*d[1]-u[1]*d[0]],m=(p,y,v)=>{const M=v/a*Math.PI*2,S=Math.cos(M)*y,T=Math.sin(M)*y;return[p[0]+d[0]*S+x[0]*T,p[1]+d[1]*S+x[1]*T,p[2]+d[2]*S+x[2]*T]};for(let p=0;p<a;p++)this.quad(m(t,i,p),m(t,i,p+1),m(e,s,p+1),m(e,s,p),o,r);if(l)for(let p=0;p<a;p++)i>0&&this.tri(t,m(t,i,p+1),m(t,i,p),o,r),s>0&&this.tri(e,m(e,s,p),m(e,s,p+1),o,r)}blob(t,e,i,s,o,r,a,l=0,c=0){const h=(1+Math.sqrt(5))/2,u=[[-1,h,0],[1,h,0],[-1,-h,0],[1,-h,0],[0,-1,h],[0,1,h],[0,-1,-h],[0,1,-h],[h,0,-1],[h,0,1],[-h,0,-1],[-h,0,1]],f=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],d=x=>.85+.3*Math.abs(Math.sin(x*12.9898+c*78.233)*43758.5453%1),g=u.map((x,m)=>{const p=Math.hypot(...x),y=d(m);return[t+x[0]/p*s*y,e+x[1]/p*o*y,i+x[2]/p*r*y]});for(const x of f)this.tri(g[x[0]],g[x[1]],g[x[2]],a,l)}loft(t,e,{closed:i=!0,capStart:s=!1,capEnd:o=!1,mat:r=0}={}){const a=t[0].length;for(let c=0;c+1<t.length;c++){const h=t[c],u=t[c+1],f=i?a:a-1;for(let d=0;d<f;d++){const g=(d+1)%a;this.quad(h[d],u[d],u[g],h[g],e,r)}}const l=(c,h)=>{const u=c.reduce((f,d)=>[f[0]+d[0]/c.length,f[1]+d[1]/c.length,f[2]+d[2]/c.length],[0,0,0]);for(let f=0;f<c.length;f++){const d=(f+1)%c.length;h?this.tri(u,c[d],c[f],e,r):this.tri(u,c[f],c[d],e,r)}};s&&l(t[0],!1),o&&l(t[t.length-1],!0)}decal(t,e,i,s,o=[1,1,1]){this.quad(t,e,i,s,o,jt.decal,[[0,0],[1,0],[1,1],[0,1]])}disc(t,e,i,s,o,r=0,a=16){for(let l=0;l<a;l++){const c=l/a*Math.PI*2,h=(l+1)/a*Math.PI*2;this.tri([t,e,i],[t+Math.cos(h)*s,e,i+Math.sin(h)*s],[t+Math.cos(c)*s,e,i+Math.sin(c)*s],o,r)}}get count(){return this.pos.length/3}geometry(){const t=new Oe;return t.setAttribute("position",new we(this.pos,3)),t.setAttribute("normal",new we(this.nor,3)),t.setAttribute("color",new we(this.col,3)),t.setAttribute("aMat",new we(this.mat,1)),t.setAttribute("uv",new we(this.uv,2)),t.computeBoundingBox(),t.computeBoundingSphere(),t}}function Ob(n){const t=new Oe;for(const e of["position","normal","color","aMat","uv"]){const i=n.map(l=>l.attributes[e]),s=i[0].itemSize,o=i.reduce((l,c)=>l+c.array.length,0),r=new Float32Array(o);let a=0;for(const l of i)r.set(l.array,a),a+=l.array.length;t.setAttribute(e,new ke(r,s))}return t.computeBoundingBox(),t.computeBoundingSphere(),t}const Bb=n=>{const t=parseInt(n.replace("#",""),16);return[t>>16&255,t>>8&255,t&255].map(i=>i/255).map(i=>i<=.04045?i/12.92:Math.pow((i+.055)/1.055,2.4))},Hb={"ijn-kure-grey":"#6a6e70","ijn-sasebo-grey":"#767b7b","ijn-maizuru-grey":"#7c8180","ijn-yokosuka-grey":"#80868a","ijn-black":"#222527","dark-grey-5d":"#4c5257","light-grey-5l":"#9ea3a4","sea-blue-5s":"#38495c","navy-blue-5n":"#2d3846","ocean-grey-5o":"#5d676f","haze-grey-5h":"#8b939a","pale-grey-5p":"#b9bebf","dull-black-bk":"#1b1e21","hospital-white":"#e6e7e1","hospital-green":"#3e7a4c",wood:"#9b7d57",linoleum:"#6a4934","deck-grey":"#5b6066","deck-blue":"#2f3b4a","blue-stain":"#2f3b4a","flight-deck-line":"#e8e6dc","ijn-ameiro":"#a9ab90","ijn-green":"#3a4733","ijn-grey":"#9b9f9b","ijn-cowl":"#1d2124","blue-grey":"#5f7381","light-grey":"#b3b8b9","sea-blue":"#2e3e56","intermediate-blue":"#4c6584","insignia-white":"#e8eae6","glossy-sea-blue":"#1e293b","olive-drab":"#4e4b33","neutral-grey":"#878b89",white:"#ececE6","natural-metal":"#b1b5b9",canopy:"#3a4a58",prop:"#202326","smoke-black":"#202020"},Wa=Object.fromEntries(Object.entries(Hb).map(([n,t])=>[n,Bb(t)]));function In(n){const t=Wa[n]??(kl[n]?Wa[kl[n].bands[0]]:null);if(!t)throw new Error(`palette: no colour “${n}”`);return t}const kl={"ijn-kure-grey":{bands:["ijn-kure-grey"]},"ijn-sasebo-grey":{bands:["ijn-sasebo-grey"]},"ijn-maizuru-grey":{bands:["ijn-maizuru-grey"]},"ijn-yokosuka-grey":{bands:["ijn-yokosuka-grey"]},"ijn-black":{bands:["ijn-black"]},"ms-1":{bands:["dark-grey-5d","light-grey-5l"],splits:[.85]},"ms-11":{bands:["sea-blue-5s"]},"ms-12":{bands:["navy-blue-5n","ocean-grey-5o","haze-grey-5h"],splits:[.25,.75]},"ms-21":{bands:["navy-blue-5n"]},"ms-22":{bands:["navy-blue-5n","haze-grey-5h"],splits:[.22]},"ms-32":{bands:["dull-black-bk","ocean-grey-5o","pale-grey-5p"],dazzle:!0},"hospital-white":{bands:["hospital-white"],stripe:"hospital-green"},"ms-21-navy-blue":{bands:["navy-blue-5n"]},"blue-grey":{bands:["blue-grey"]}};function Gb(n){const t=kl[n];if(!t)throw new Error(`palette: no hull scheme “${n}”`);return{...t,colours:t.bands.map(e=>Wa[e]),stripeColour:t.stripe?Wa[t.stripe]:null}}const mi=(n,t,e)=>{const i=ji((e-n)/(t-n),0,1);return i*i*(3-2*i)},Pl=(n,t)=>{const e=Math.sin(n*127.1+t*311.7)*43758.5453;return e-Math.floor(e)},el=n=>n==null?null:typeof n=="number"?n:Date.parse(String(n).length<=7?`${n}-01T00:00Z`:String(n).length<=10?`${n}T00:00Z`:n);function $b(n,t){const e=el(t);if(e!=null&&Array.isArray(n.colours)){for(const i of n.colours)if(e>=el(i.from)&&e<el(i.to))return i}return n.colour||{hull:"ijn-kure-grey",deck:"wood",measure:null,deckMarking:null}}const Vb=[.11,.024,.016],Wb=[.012,.013,.014];function jb(n,t,e){const i=Gb(t.hull),s=In((t.deck==="wood"||t.deck==="linoleum",t.deck)),o=/^ms-/.test(t.hull)?In(t.hull==="ms-1"?"deck-grey":"deck-blue"):null,r=.55+Pl(n.loa,n.beam)*.6,a=(l,c,h)=>{if(c<-.25)return Vb;if(c<.45)return Wb;if(i.dazzle){const g=(h*Math.cos(r)+c*2.2*Math.sin(r))/(n.loa*.09)+Pl(Math.floor(h/(n.loa*.12)),Math.sign(l))*1.7;return i.colours[Math.abs(Math.floor(g))%i.colours.length]}const u=i.colours;if(u.length===1)return u[0];const f=c/Math.max(1,e);let d=0;for(;d<i.splits.length&&f>i.splits[d];)d++;return u[Math.min(d,u.length-1)]};return{side:a,stripe:i.stripeColour,stripeAt:[e*.16,e*.24],deck:s,top:(l,c,h)=>o||a(l,c,h).map(u=>u*1.12),fn:(l,c,h,u)=>u>.8&&c>1?o||a(l,c,h).map(f=>f*1.1):a(l,c,h)}}const bu=[0,.004,.012,.025,.045,.07,.1,.14,.19,.25,.32,.4,.5,.6,.68,.75,.8,.85,.89,.925,.955,.978,.993,1];function Xb(n,t){const e=new zo,i=n.loa,s=n.draught,o=n.hull.bow,r=n.hull.stern,a=o==="clipper"?.032:o==="raked"?.026:.007,l=[],c=[];for(const u of bu){const f=Lo(n,u),d=$n(n,u),g=mi(.02,.28,u)*(1-mi(.72,.99,u));let x=s;x*=o==="straight"?.55+.45*mi(0,.04,u):.3+.7*mi(0,.07,u),x*=r==="transom"?1-.75*mi(.9,1,u):r==="round"?1-.65*mi(.85,1,u):1-.6*mi(.86,1,u),(n.type==="ss-midget"||n.type==="ss")&&(x=Math.max(.1,d*1));const m=1-mi(0,.14,u),p=qi(n,u),y=S=>p+a*i*Math.pow(ji((f-S)/(f+x),0,1),o==="clipper"?1.7:1)*m,v=[[0,-x],[d*(.12+.62*g),-x],[d*(.5+.42*g),-x*(.78-.45*g)],[d*(.86+.1*g),-x*.28],[d*.965,0],[d,f]],M=[];for(let S=v.length-1;S>=1;S--)M.push([-v[S][0],v[S][1],y(v[S][1])]);for(let S=0;S<v.length;S++)M.push([v[S][0],v[S][1],y(v[S][1])]);l.push(M),c.push({f:u,D:f,hb:d,z:p})}if(e.loft(l,t.side,{closed:!1}),t.stripe){const[u,f]=t.stripeAt;for(let d=0;d+1<c.length;d++){const g=c[d],x=c[d+1];if(!(g.f<.04||x.f>.97))for(const m of[1,-1]){const p=(g.hb*.985+.05)*m,y=(x.hb*.985+.05)*m;e.quad([p,Math.min(u,g.D-.3),g.z],[y,Math.min(u,x.D-.3),x.z],[y,Math.min(f,x.D-.1),x.z],[p,Math.min(f,g.D-.1),g.z],t.stripe)}}}for(let u=0;u+1<c.length;u++){const f=c[u],d=c[u+1];e.quad([-f.hb,f.D,f.z],[f.hb,f.D,f.z],[d.hb,d.D,d.z],[-d.hb,d.D,d.z],t.deck,jt.deck)}const h=l[l.length-1];if($n(n,1)>.05){const u=h.reduce((d,g)=>d+g[2],0)/h.length,f=h.reduce((d,g)=>d+g[1],0)/h.length;for(let d=0;d+1<h.length;d++)e.tri([0,f,u],h[d+1],h[d],t.side);e.tri([0,f,u],h[0],h[h.length-1],t.side)}for(const u of n.blocks){if(u.kind!=="hull-extension")continue;const[f,d]=oi(u),g=u.h??2.4,x=bu.filter(v=>v>f+1e-6&&v<d-1e-6),p=[f,...x,d].map(v=>({f:v,D:Lo(n,v),hb:$n(n,v)*.995,z:qi(n,v)}));for(let v=0;v+1<p.length;v++){const M=p[v],S=p[v+1];for(const T of[1,-1])e.quad([T*M.hb,M.D,M.z],[T*S.hb,S.D,S.z],[T*S.hb,S.D+g,S.z],[T*M.hb,M.D+g,M.z],t.side);e.quad([-M.hb,M.D+g,M.z],[M.hb,M.D+g,M.z],[S.hb,S.D+g,S.z],[-S.hb,S.D+g,S.z],t.deck,jt.deck)}const y=p[p.length-1];e.quad([-y.hb,y.D,y.z],[y.hb,y.D,y.z],[y.hb,y.D+g,y.z],[-y.hb,y.D+g,y.z],t.side)}return e.geometry()}function qb(n,t,e,i){const s=$n(n,i);return t.side==="starboard"?Math.max(0,s-e/2-.4):t.side==="port"?-Math.max(0,s-e/2-.4):0}function Kb(n,t,e,i){const s=new zo,o=n.loa,r=n.beam,a=t.fn,l=In("ijn-cowl");for(const c of n.blocks){if(c.kind==="hull-extension"||c.kind==="turret")continue;const h=c.side==="both"?["port","starboard"]:[c.side];for(const u of h){const f=u===c.side?c:{...c,side:u},d=ko(n,f),[g,x]=oi(f),m=Xi(f),p=er(n,f,d),y=qi(n,m),v=Math.max(d.l,(x-g)*o),M=qb(n,f,d.w,m);switch(f.kind){case"flight-deck":{const S=p+d.h;s.box(0,p,y,d.w,d.h,v,t.deck,jt.deck);const T=In("flight-deck-line");s.quad([-.25,S+.02,y-v/2],[.25,S+.02,y-v/2],[.25,S+.02,y+v/2],[-.25,S+.02,y+v/2],T);for(const A of[-1,1]){const k=A*(d.w/2-.6);s.quad([k-.15,S+.02,y-v/2],[k+.15,S+.02,y-v/2],[k+.15,S+.02,y+v/2],[k-.15,S+.02,y+v/2],T)}if(e.deckMarking==="hinomaru-forward"){const A=y-v*.4;s.disc(0,S+.04,A,d.w*.3,In("insignia-white"),jt.plain,20),s.disc(0,S+.06,A,d.w*.24,[.6,.02,.02],jt.plain,20)}for(const A of[g+.015,x-.015]){const k=qi(n,A),_=_n(n,A);for(const w of[-.3,.3])s.cyl([w*d.w,_,k],[w*d.w,p,k],.35,.35,a,jt.metal,4)}break}case"hangar":s.box(0,p,y,Math.min(d.w,2*$n(n,m)*.95),d.h,v,a);break;case"island":{s.box(M,p,y,d.w,d.h*.6,v,a),s.box(M,p+d.h*.6,y-v*.15,d.w*.8,d.h*.4,v*.45,a,jt.plain,0,.9),s.box(M,p+d.h*.85,y-v*.15,d.w*.82,d.h*.06,v*.47,l,jt.glass);break}case"bridge":{const S=Math.max(2,Math.min(4,Math.round(d.h/3.5)));let T=p;for(let A=0;A<S;A++){const k=1-A*.14,_=d.h/S;s.box(M,T,y+v*.05*A,d.w*k,_,v*(1-A*.12),a),T+=_}s.box(M,p+d.h-Math.min(1.4,d.h*.12),y-v*.02,d.w*(1-(S-1)*.14)*1.02,Math.min(1.1,d.h*.1),v*.6,l,jt.glass);break}case"pagoda":{const S=f.shape==="tall"?8:6;let T=p;for(let A=0;A<S;A++){const k=d.h/S,_=1-A*(f.shape==="tall"?.08:.1),w=(Pl(n.loa,A)-.5)*v*.12;s.box(M,T,y+w,d.w*_*(A%2?.92:1.05),k*.92,v*_*(A%3===1?1.15:.9),a),A%2===1&&s.box(M,T+k*.92,y+w,d.w*_*1.18,k*.08,v*_*1.1,a),T+=k}s.box(M,p+d.h,y,d.w*.45,d.h*.06,v*.5,a),s.cyl([M,p,y+v*.25],[M,p+d.h*.9,y+v*.1],r*.03,r*.025,a,jt.metal,5);break}case"tower":s.box(M,p,y,d.w,d.h,v,a,jt.plain,0,.82),s.box(M,p+d.h,y,d.w*.9,d.h*.06,v*.9,a),s.box(M,p+d.h*.86,y-v*.05,d.w*.84,d.h*.05,v*.86,l,jt.glass);break;case"tripod-mast":{const S=[M,p+d.h*.78,y],T=Math.max(.25,r*.012);s.cyl([M,p,y-d.w*.4],S,T,T*.8,a,jt.metal,5),s.cyl([M-d.w*.45,p,y+d.w*.35],S,T*.8,T*.7,a,jt.metal,5),s.cyl([M+d.w*.45,p,y+d.w*.35],S,T*.8,T*.7,a,jt.metal,5),s.box(M,S[1],y,d.w*.9,d.h*.06,d.w*.9,a),(n.type==="bb"||n.type==="ca")&&s.box(M,S[1]+d.h*.06,y,d.w*.8,d.h*.08,d.w*.8,a),s.cyl(S,[M,p+d.h,y],T*.6,T*.3,a,jt.metal,4);break}case"cage-mast":{const T=d.w*.5,A=d.w*.28;for(let k=0;k<8;k++){const _=k/8*Math.PI*2,w=_+Math.PI*.45;s.cyl([M+Math.cos(_)*T,p,y+Math.sin(_)*T],[M+Math.cos(w)*A,p+d.h*.85,y+Math.sin(w)*A],.16,.14,a,jt.metal,3),s.cyl([M+Math.cos(w+.8)*T,p,y+Math.sin(w+.8)*T],[M+Math.cos(_+.8)*A,p+d.h*.85,y+Math.sin(_+.8)*A],.16,.14,a,jt.metal,3)}s.box(M,p+d.h*.85,y,d.w*1.1,d.h*.12,d.w*1.1,a),s.cyl([M,p+d.h*.97,y],[M,p+d.h*1.08,y],.2,.1,a,jt.metal,4);break}case"pole-mast":s.cyl([M,p,y],[M,p+d.h,y],Math.max(.18,d.w*.4),Math.max(.08,d.w*.15),a,jt.metal,5),s.cyl([M-r*.12,p+d.h*.75,y],[M+r*.12,p+d.h*.75,y],.08,.08,a,jt.metal,3);break;case"funnel":{const S=In("dull-black-bk");if(f.shape==="downturned"){const T=Math.sign(M||1),A=$n(n,m),k=d.w*.5,_=[T*(A-k),p+d.h*.4,y],w=[T*(A+k*1.2),p+d.h*.55,y],C=[T*(A+k*2.2),p+d.h*.15,y];s.cyl(_,w,k,k,a,jt.plain,8),s.cyl(w,C,k,k*.95,a,jt.plain,8),s.cyl(C,[C[0],C[1]-.6,C[2]],k*.95,k*.95,S,jt.dark,8),v>d.w*2.5&&s.box(T*(A+k*.2),p+d.h*.25,y,k*1.6,d.h*.4,v,a)}else{const T=f.shape==="raked"?.22:f.shape==="trunked"?.12:.04,A=[M,p+d.h,y+d.h*T],k=d.w/2;Math.max(k,v/2)>k*1.3?(s.box(M,p,y,d.w,d.h,v-d.w,a),s.cyl([M,p,y-(v-d.w)/2],[A[0],A[1],A[2]-(v-d.w)/2],k,k*.95,a,jt.plain,8),s.cyl([M,p,y+(v-d.w)/2],[A[0],A[1],A[2]+(v-d.w)/2],k,k*.95,a,jt.plain,8),s.box(A[0],A[1]-.8,A[2],d.w*1.02,.8,v-d.w,S,jt.dark)):(s.cyl([M,p,y],A,k,k*.93,a,jt.plain,10,!1),s.cyl([A[0],A[1]-.9,A[2]],A,k*.95,k*.95,S,jt.dark,10))}break}case"casemate":s.box(M+Math.sign(M||1)*.4,p,y,d.w,d.h,v,a);break;case"deckhouse":s.box(M,p,y,Math.min(d.w,2*$n(n,m)*.9),d.h,v,a);break;case"crane":{s.cyl([M,p,y],[M,p+d.h,y],.4,.3,a,jt.metal,5),s.cyl([M,p+d.h*.3,y],[M+Math.sign(M||1)*d.h*.25,p+d.h*.95,y+d.h*.55],.22,.12,a,jt.metal,4);break}case"catapult":{const S=f.side==="starboard"?.5:f.side==="port"?-.5:0;s.cyl([M,_n(n,m),y],[M,p,y],.9,.9,a,jt.metal,6),s.box(M,p,y,d.w,d.h,v,a,jt.metal,S);break}case"boat-deck":s.box(0,p,y,Math.min(d.w,2*$n(n,m)*.95),d.h,v,t.deck,jt.deck);break;case"director":s.box(M,p,y,d.w,d.h,d.l,a),s.box(M,p+d.h*.5,y,d.w*2.4,d.h*.25,d.l*.3,a);break;default:throw new Error(`kit ${n.id}: block kind “${f.kind}” has no builder`)}}}return s}function Yb(n,t){var e;return n.weapon&&((e=t==null?void 0:t.get)!=null&&e.call(t,n.weapon))?t.get(n.weapon):{calibreMm:n.calibreMm??127,mvMs:n.mvMs??800}}const nl=new WeakMap;function Zb(n,t,e,i,s){const o=new zo,r=s.fn,a=t/1e3,l=a*(t>=300?45:t>=140?50:45),c=e===3?i.w*.28:e===2?i.w*.2:0;n==="turret"?(o.box(0,0,0,i.w,i.h,i.l,r,jt.plain,0,.88),o.box(0,i.h,i.l*.18,i.w*.5,i.h*.18,i.l*.3,r)):n==="mount"&&(o.cyl([0,0,0],[0,a*7,0],a*3.2,a*2.6,r,jt.metal,6,!0),o.box(0,a*4,-a*2,a*9,a*6,a*1.2,r));const h=n==="casemate"?0:n==="mount"?a*6.5:i.h*.45,u=n==="turret"?-i.l*.38:-a*2,f=.03;for(let d=0;d<e;d++){const g=(d-(e-1)/2)*c;o.cyl([g,h,u],[g,h+l*f,u-l],a*.95,a*.6,r,jt.metal,6)}return o.geometry()}function Jb(n,{colourDate:t=null,weapons:e=null}={}){var g;if(dM(n),!(n.loa>0&&n.beam>0&&n.draught>0))throw new Error(`kit ${n.id}: loa, beam and draught are needed`);const i=$b(n,t);let s=0;for(const x of n.blocks){if(x.kind!=="funnel"&&x.kind!=="bridge"&&x.kind!=="island")continue;const m=ko(n,x);s=Math.max(s,er(n,x,m)+m.h)}s||(s=Lo(n,.5)*2.5);const o=jb(n,i,s),r=Xb(n,o),a=Kb(n,o,i),l=[],c=n.blocks,h=x=>c.find(m=>m.kind==="turret"&&Math.abs(Xi(m)-x)<.016),u=(x,m)=>c.find(p=>p.kind==="casemate"&&(p.side===m||p.side==="both")&&x>=oi(p)[0]-.02&&x<=oi(p)[1]+.02);for(const[x,m]of(n.guns||[]).entries()){const p=Yb(m,e),y=m.barrels??1,v=m.side==="both"?["port","starboard"]:[m.side||"centre"];let M=0;const S=m.mounts??m.turrets??m.at.length;for(const T of m.at)for(const A of v){if(M>=S)break;M++;const k=h(T),_=(m.turrets??0)>0,w=!_&&A!=="centre"?u(T,A):null,C=_?"turret":w?"casemate":"mount",F=k?ko(n,k):Gd(p.calibreMm,y),z=`${x}:${C}:${i.hull}`;let P=(g=nl.get(n))==null?void 0:g[z];if(!P){P=Zb(C,p.calibreMm,y,F,o);const st=nl.get(n)||{};st[z]=P,nl.set(n,st)}const B=$n(n,T),X=A==="starboard"?B-Math.max(1,F.w*.7):A==="port"?-(B-Math.max(1,F.w*.7)):0;let J=C==="casemate"?_n(n,T)-1.8:_n(n,T);const Z=Po(n);if(C==="mount"&&Z!=null&&A!=="centre"&&(J=Math.max(J,Z-2.5)),k!=null&&k.sf){const st=Math.max(2.2,F.h+.8);a.cyl([X,_n(n,T),qi(n,T)],[X,_n(n,T)+st,qi(n,T)],F.w*.42,F.w*.42,o.fn,jt.plain,10),J+=st}let Y=m.arcDeg||(A==="centre"?T<.5?[210,150]:[30,330]:[20,160]);A==="port"&&(Y=[(360-Y[1])%360,(360-Y[0])%360]),l.push({geometry:P,at:[X,J,qi(n,T)],calibreMm:p.calibreMm,arc:Y,barrels:y,kind:C,battery:x,weapon:m.weapon??null,role:m.role,side:A,rest:T<.5?0:180})}}const f=a.geometry();r.computeBoundingBox(),f.computeBoundingBox();const d=r.boundingBox.clone().union(f.boundingBox);return{hull:r,turrets:l,parts:f,bounds:{length:n.loa,beam:n.beam,height:d.max.y,draught:n.draught,box:{min:d.min.toArray(),max:d.max.toArray()}},colours:{hull:i.hull,deck:i.deck,measure:i.measure??null,deckMarking:i.deckMarking??null}}}const Qb=["low","mid","high","parasol"],t2=["single","twin"],e2=["long-frame","short-frame","bubble","cockpit"],n2=["retract","fixed"],i2=["radial","inline"],s2=["single","twin","boat"],o2=["hinomaru","hinomaru-white-surround","star-red-centre","star-no-red","star-bar-red-outline","star-bar-blue","roundel-raaf","roundel-rnzaf"],xa=n=>n==null?null:typeof n=="number"?n:Date.parse(String(n).length<=7?`${n}-01T00:00Z`:String(n).length<=10?`${n}T00:00Z`:n);function a2(n,t){const e=n.colours||[];if(!e.length)return{upper:"neutral-grey",lower:"neutral-grey",insignia:n.side==="jp"?"hinomaru":"star-no-red"};const i=xa(t);if(i==null)return e[0];for(const s of e)if(i>=xa(s.from)&&i<xa(s.to))return s;return i<xa(e[0].from)?e[0]:e[e.length-1]}function r2(n){var i;const t=n.shape||{},e=(s,o,r)=>{if(!r.includes(o))throw new Error(`kit ${n.id}: shape.${s} “${o}” is not one of ${r.join(", ")}`)};e("wing",t.wing,Qb),e("tail",t.tail,t2),e("canopy",t.canopy,e2),e("gear",t.gear,n2),e("cowl",t.cowl??((i=n.engine)==null?void 0:i.kind),i2),t.floats!=null&&e("floats",t.floats,s2)}function l2(n,{colourDate:t=null}={}){var ct;r2(n);const e=n.shape,i=a2(n,t);if(!o2.includes(i.insignia))throw new Error(`kit ${n.id}: insignia “${i.insignia}”`);const s=In(i.upper),o=In(i.lower),r=In("canopy"),a=n.side==="jp"&&e.cowl==="radial"?In("ijn-cowl"):s,l=new zo,c=n.length,h=n.span,u=n.wingM2||h*h/6,f=((ct=n.engine)==null?void 0:ct.count)||1,d=f>1||n.type==="bomber"||n.type==="patrol"&&f>1,g=e.floats==="boat",x=c*(d?g?.075:.052:e.cowl==="inline"?.053:n.type==="fighter"?.07:.066),m=-.3*c,p=.7*c,y=Q=>m+(p-m)*Q,v=Q=>e.cowl==="inline"&&!d?Q<.22?.2+.8*Math.sin(Math.PI/2*(Q/.22)):1-.83*Math.pow((Q-.22)/.78,1.3):d?Q<.12?.35+.65*Math.sin(Math.PI/2*(Q/.12)):Q<.55?1:1-.85*Math.pow((Q-.55)/.45,1.2):Q<.03?.82+.18*(Q/.03):Q<.36?1:1-.84*Math.pow((Q-.36)/.64,1.25),M=Q=>Q>.55?(Q-.55)*x*.9:0,S=10,T=[],A=[0,.015,.04,.08,.13,.2,.28,.36,.45,.55,.65,.75,.85,.93,1];for(const Q of A){const it=x*v(Q),at=it*(g?1.35:1.12),pt=M(Q)-(g?it*.35:0),mt=[];for(let nt=0;nt<S;nt++){const yt=nt/S*Math.PI*2;let St=Math.sin(yt)*at;g&&St<0&&(St*=1.25-.25*Math.abs(Math.cos(yt))),mt.push([Math.cos(yt)*it,pt+St,y(Q)])}T.push(mt)}const k=(Q,it,at)=>{const pt=(at-m)/(p-m);return pt<.11&&!d?a:it>M(pt)-x*.15?s:o};l.loft(T,k,{closed:!0,capStart:!0,capEnd:!0});const _=d?.45:.5,w=2*u/(h*(1+_)),C=w*_,F=x*(g?1.35:1.12),z=e.wing==="low"?-.6*F:e.wing==="mid"?-.05*F:e.wing==="high"?.75*F:1.9*F,P=-.32*w,B=(e.dihedral??5)*Math.PI/180,X=(Q,it,at,pt,mt)=>[[Q,at,pt],[Q,at+mt*.6,pt+it*.3],[Q,at+mt*.15,pt+it],[Q,at-mt*.35,pt+it*.3]],J=(Q,it,at,pt)=>pt>=0?s:o,Z=h/2;for(const Q of[1,-1]){const it=Q*x*.6,at=Q*Z,pt=z+Math.tan(B)*(Z-Math.abs(it)),mt=w*.08,nt=X(it,w,z,P,w*.13),yt=X(at,C,pt,P+(w-C)*.3+mt,C*.09);l.loft([nt,yt],J,{closed:!0,capEnd:!0})}if(e.wing==="parasol"){l.box(0,F*.6,P+w*.45,x*.6,z-F*.6,w*.7,s);for(const Q of[1,-1])l.cyl([Q*x*.9,-F*.2,P+w*.4],[Q*Z*.45,z,P+w*.4],.07,.07,o,jt.metal,4)}if(n.id==="f1m2"||e.wing==="high"&&e.floats==="single")for(const Q of[1,-1]){const it=X(Q*x*.6,w*.85,-.7*F,P+w*.1,w*.1),at=X(Q*Z*.85,C*.85,-.7*F+Math.tan(B)*Z*.85,P+w*.25,C*.08);l.loft([it,at],J,{closed:!0,capEnd:!0}),l.cyl([Q*Z*.6,-.7*F+Math.tan(B)*Z*.6,P+w*.4],[Q*Z*.6,z+Math.tan(B)*Z*.6,P+w*.4],.06,.06,o,jt.metal,4)}const Y=y(.88),st=M(.9),tt=h*(d?.33:.36)*.5,N=w*.42;for(const Q of[1,-1]){const it=X(Q*x*.2,N,st,Y-N*.3,N*.1),at=X(Q*tt,N*.6,st,Y-N*.1,N*.07);l.loft([it,at],J,{closed:!0,capEnd:!0})}const K=h*(d?.16:.13)*(e.tail==="twin"?.7:1),lt=e.tail==="twin"?[tt,-tt]:[0];for(const Q of lt){const it=N*1.1,at=[[Q,st,Y-it*.5],[Q+.08,st,Y+it*.5],[Q-.08,st,Y+it*.5]],pt=[[Q,st+K,Y+it*.05],[Q+.05,st+K,Y+it*.5],[Q-.05,st+K,Y+it*.5]];l.loft([at,pt],s,{closed:!0,capEnd:!0})}const _t=(Q,it,at,pt=.62)=>{const mt=y(Q),nt=y(it),yt=x*v((Q+it)/2)*1.05,St=(Pt,Ft)=>{const Et=[];for(let Gt=0;Gt<=6;Gt++){const Jt=Gt/6*Math.PI;Et.push([Math.cos(Jt)*x*pt*Ft,yt*.7+Math.sin(Jt)*at*Ft,Pt])}return Et};l.loft([St(mt,.4),St(mt+(nt-mt)*.25,1),St(nt-(nt-mt)*.15,.95),St(nt,.5)],r,{closed:!1,mat:jt.glass})};e.canopy==="long-frame"?_t(n.crew>=3?.16:.18,n.crew>=3?.52:.46,x*.62):e.canopy==="short-frame"?_t(.24,.38,x*.58):e.canopy==="bubble"?(_t(.2,.36,x*.62),l.blob(0,x*v(.5)*1.1,y(.5),x*.5,x*.5,x*.5,r,jt.glass,3)):e.canopy==="cockpit"&&(l.blob(0,0,y(.02),x*.75,x*.75,x*.9,r,jt.glass,1),_t(.1,.2,x*.45,.8));const bt=new zo,Dt=d?Math.min(2,h*.06):Math.min(1.7,Math.max(1.3,h*.12)),O=(Q,it,at)=>{for(let mt=0;mt<16;mt++){const nt=mt/16*Math.PI*2,yt=(mt+1)/16*Math.PI*2;bt.tri([Q,it,at],[Q+Math.cos(nt)*Dt,it+Math.sin(nt)*Dt,at],[Q+Math.cos(yt)*Dt,it+Math.sin(yt)*Dt,at],In("prop"),jt.prop)}};if((!d||f===1)&&(O(0,0,m-.25),l.cyl([0,0,m-.05],[0,0,m-.45],x*.25,.05,e.cowl==="inline"?s:a,jt.metal,6)),f>1){const Q=f===2?[.2]:[.17,.34];for(const it of Q)for(const at of[1,-1]){const pt=at*it*h,mt=z+Math.tan(B)*(Math.abs(pt)-x*.6)-(e.wing==="parasol"?-.1:.05),nt=Math.max(.45,x*.42),yt=P-w*.35;l.cyl([pt,mt,yt],[pt,mt,P+w*.9],nt,nt*.5,s,jt.plain,8,!0),l.cyl([pt,mt,yt-.05],[pt,mt,yt-.35],nt*.4,.05,s,jt.metal,6),O(pt,mt,yt-.2)}}if(e.floats==="twin"||e.floats==="single"){const Q=e.floats==="twin"?[h*.17,-h*.17]:[0],it=c*.78,at=e.floats==="twin"?x*.42:x*.55,pt=z-(e.floats==="twin"?1.6:1.9);for(const mt of Q){const nt=[0,.15,.4,.75,1].map(yt=>{const St=at*(yt<.15?.4+4*yt:yt>.75?1-(yt-.75)*3:1),Pt=[];for(let Ft=0;Ft<6;Ft++){const Et=Ft/6*Math.PI*2;Pt.push([mt+Math.cos(Et)*St,pt+Math.sin(Et)*St*.9,P-it*.35+it*yt])}return Pt});l.loft(nt,o,{closed:!0,capStart:!0,capEnd:!0}),l.cyl([mt,pt+at,P],[mt*.7,z,P+w*.2],.08,.08,o,jt.metal,4),l.cyl([mt,pt+at,P+w*.8],[mt*.7,z,P+w*.8],.08,.08,o,jt.metal,4)}if(e.floats==="single")for(const mt of[1,-1])l.box(mt*Z*.85,z-1,P+w*.3,.35,.5,1.4,o)}else if(g)for(const Q of[1,-1])l.box(Q*Z*.9,z-1.2,P+w*.4,.5,.6,1.8,o);else if(e.gear==="fixed")for(const Q of[1,-1]){const it=Q*h*.12,at=z+Math.tan(B)*(Math.abs(it)-x*.6);l.cyl([it,at,P+w*.15],[it*1.05,at-x*1.6,P+w*.1],.12,.1,o,jt.metal,4),l.blob(it*1.05,at-x*1.7,P+w*.1,.22,.45,.6,o,jt.plain,7)}const Wt=i.insignia,wt=Wt==="star-bar-red-outline"||Wt==="star-bar-blue",Xt=(Q,it,at,pt,mt)=>{const nt=wt?pt*2:pt,yt=pt;if(mt==="up"||mt==="down"){const St=it+(mt==="up"?.03:-.03);mt==="up"?l.decal([Q-nt/2,St,at+yt/2],[Q+nt/2,St,at+yt/2],[Q+nt/2,St,at-yt/2],[Q-nt/2,St,at-yt/2]):l.decal([Q-nt/2,St,at-yt/2],[Q+nt/2,St,at-yt/2],[Q+nt/2,St,at+yt/2],[Q-nt/2,St,at+yt/2])}else{const St=mt==="right"?1:-1,Pt=Q+St*.03;St>0?l.decal([Pt,it-yt/2,at+nt/2],[Pt,it-yt/2,at-nt/2],[Pt,it+yt/2,at-nt/2],[Pt,it+yt/2,at+nt/2]):l.decal([Pt,it-yt/2,at-nt/2],[Pt,it-yt/2,at+nt/2],[Pt,it+yt/2,at+nt/2],[Pt,it+yt/2,at-nt/2])}},G=Z*.62,vt=w+(C-w)*((G-x*.6)/(Z-x*.6)),Lt=z+Math.tan(B)*(G-x*.6),kt=P+(w-vt)*.3+vt*.45,gt=vt*.62,Ut=w*.13+(C*.09-w*.13)*((G-x*.6)/(Z-x*.6));for(const Q of[1,-1])Xt(Q*G,Lt+Ut*.62+.02,kt,gt,"up"),Xt(Q*G,Lt-Ut*.37-.02,kt,gt,"down");const It=y(.62),I=x*v(.62),D=I*1.25;Xt(I,M(.62),It,D,"right"),Xt(-I,M(.62),It,D,"left");const q=l.geometry(),rt=bt.geometry();q.computeBoundingBox();const ht=q.boundingBox;return q.userData={span:h,length:c},{body:q,prop:rt,bounds:{span:h,length:c,height:n.height??ht.max.y-ht.min.y,box:{min:ht.min.toArray(),max:ht.max.toArray()}},colours:{upper:i.upper,lower:i.lower},insignia:Wt}}const ro="#b3141f",lo="#f2f2ee",co="#1b2d5c",cf=[["hinomaru",0,0,1],["hinomaru-white-surround",1,0,1],["star-red-centre",2,0,1],["star-no-red",3,0,1],["roundel-raaf",4,0,1],["roundel-rnzaf",5,0,1],["star-bar-red-outline",0,1,2],["star-bar-blue",2,1,2]],ni=128,Mo=1024,_o=256;function wu(n,t,e,i){n.beginPath();for(let s=0;s<10;s++){const o=-Math.PI/2+s*Math.PI/5,r=s%2?i*.382:i,a=t+Math.cos(o)*r,l=e+Math.sin(o)*r;s?n.lineTo(a,l):n.moveTo(a,l)}n.closePath(),n.fill()}function On(n,t,e,i,s){n.fillStyle=s,n.beginPath(),n.arc(t,e,i,0,Math.PI*2),n.fill()}function c2(n,t,e,i,s){const o=e+s/2,r=i+ni/2,a=ni*.46;switch(t){case"hinomaru":On(n,o,r,a*.96,ro);break;case"hinomaru-white-surround":On(n,o,r,a,lo),On(n,o,r,a*.78,ro);break;case"star-red-centre":case"star-no-red":On(n,o,r,a,co),n.fillStyle=lo,wu(n,o,r,a*.97),t==="star-red-centre"&&On(n,o,r,a*.34,ro);break;case"star-bar-red-outline":case"star-bar-blue":{const l=a*.82,c=l*.5,h=t==="star-bar-red-outline"?ro:co;n.fillStyle=h,n.fillRect(e+6,r-c/2-5,s-12,c+10),On(n,o,r,l+5,h),n.fillStyle=lo,n.fillRect(e+11,r-c/2,s-22,c),On(n,o,r,l,co),n.fillStyle=lo,wu(n,o,r,l*.97);break}case"roundel-raaf":case"roundel-rnzaf":On(n,o,r,a,co),On(n,o,r,a*.62,lo),On(n,o,r,a*.3,t==="roundel-raaf"?ro:co);break;default:throw new Error(`insignia: no drawing for “${t}”`)}}function hf(){const n={};for(const[t,e,i,s]of cf){const o=e*ni,r=i*ni,a=s*ni;n[t]=[o/Mo,1-(r+ni)/_o,(o+a)/Mo,1-r/_o]}return n}let ya=null;function h2(){if(ya)return ya;const n=typeof OffscreenCanvas<"u"?new OffscreenCanvas(Mo,_o):Object.assign(document.createElement("canvas"),{width:Mo,height:_o}),t=n.getContext("2d");t.clearRect(0,0,Mo,_o);for(const[i,s,o,r]of cf)c2(t,i,s*ni,o*ni,r*ni);const e=new _d(n);return e.colorSpace=Fe,e.generateMipmaps=!0,e.minFilter=Ki,e.anisotropy=4,ya={texture:e,rects:hf(),canvas:n},ya}const ja=new Map,uf=n=>{if(n==null)return"any";const t=typeof n=="number"?n:Date.parse(n);return new Date(t).toISOString().slice(0,10)};function u2(n,{colourDate:t=null,weapons:e=null,colour:i=null}={}){const s=i?{...n,colour:i,colours:null}:n,o=`ship:${n.id}:${uf(t)}:${i?JSON.stringify(i):""}`;let r=ja.get(o);return r||(r=Jb(s,{colourDate:t,weapons:e}),ja.set(o,r)),r}function d2(n,{colourDate:t=null}={}){const e=`air:${n.id}:${uf(t)}`;let i=ja.get(e);return i||(i=l2(n,{colourDate:t}),ja.set(e,i)),i}const f2=`
${ln}
in float aMat;
#ifdef AIRCRAFT
in vec4 aInsignia;
out vec4 vInsignia;
#endif
#ifdef USE_INSTANCING
in vec4 aState;              // x: fire (0..1), y: alive (1 alive, 2 sinking/falling), z: listing roll already in the matrix, w: spare
#endif
uniform float uMinPx;        // the smallest the unit may be drawn, pixels across its length or span
uniform float uSize;         // its length or span, metres
uniform float uPxPerRad;     // the viewport's height in pixels over its field of view in radians
out vec3 vWorld;
out vec3 vNormal;
out vec3 vColor;
out float vMat;
out vec2 vUv;
out float vFire;
void main() {
  mat4 im = mat4(1.0);
  vFire = 0.0;
  #ifdef USE_INSTANCING
  im = instanceMatrix;
  vFire = aState.x;
  #endif
  mat4 mm = modelMatrix * im;
  vec3 origin = (mm * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float dist = max(1.0, distance(cameraPosition, origin));
  float px = uSize / dist * uPxPerRad;
  float k = max(1.0, uMinPx / max(px, 1e-4));
  vec4 wp = mm * vec4(position * k, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(mm) * normal);
  vColor = color;
  vMat = aMat;
  vUv = uv;
  #ifdef AIRCRAFT
  vInsignia = aInsignia;
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
  ${Ze}
}
`,p2=`
${un}
${ns}
${Fo}
${cn}
uniform float uSeaY;         // world y of the sea surface (0 in a box)
#ifdef AIRCRAFT
uniform sampler2D uInsignia;
in vec4 vInsignia;
#endif
in vec3 vWorld;
in vec3 vNormal;
in vec3 vColor;
in float vMat;
in vec2 vUv;
in float vFire;
void main() {
  ${hn}
  if (vWorld.y < uSeaY - 0.05) discard;
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 a = vColor;
  int m = int(vMat + 0.5);
  if (m == 1) {
    // planking: fine courses along the length, faded once finer than a pixel
    float px = length(fwidth(vWorld.xz));
    float f = 1.0 - smoothstep(0.1, 0.4, px);
    a *= 1.0 - f * 0.08 * step(0.5, fract(vWorld.x * 3.0 + hash12(floor(vWorld.xz * vec2(3.0, 0.08))) * 0.7));
  } else if (m == 2) {
    // glass: dark, with the sky in it
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 R = reflect(-V, n);
    a = mix(a * 0.6, skyMap(R) * 0.6, 0.45);
  } else if (m == 3) {
    #ifdef AIRCRAFT
    vec4 t = texture(uInsignia, mix(vInsignia.xy, vInsignia.zw, vUv));
    if (t.a < 0.5) discard;
    a = t.rgb;
    #else
    discard;
    #endif
  } else if (m == 4) {
    // a propeller's blur: a thin, dithered disc
    if (hash12(gl_FragCoord.xy) > 0.28) discard;
  }
  vec3 col = shade(a, n, vWorld, 1.0, 1.0);
  // a burning unit glows where it burns, flickering
  if (vFire > 0.01) {
    float fl = 0.6 + 0.4 * vnoise(vWorld.xz * 0.3 + uTime * 3.0);
    col += vec3(1.0, 0.42, 0.12) * vFire * fl * 0.35 * smoothstep(0.0, 3.0, vWorld.y);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;function df(n,{aircraft:t=!1,minPx:e,size:i=100,atlas:s=null}={}){const o={...n,uMinPx:{value:e},uSize:{value:i},uPxPerRad:{value:800/(50*Math.PI/180)},uSeaY:{value:0}};return t&&(o.uInsignia={value:(s==null?void 0:s.texture)??null}),new xe({name:t?"aircraft":"ship",vertexShader:f2,fragmentShader:p2,uniforms:o,defines:t?{AIRCRAFT:1}:{},vertexColors:!0,side:fn})}function m2(n,t){return df(n,{minPx:5,size:t})}function g2(n,t,e){return df(n,{aircraft:!0,minPx:3,size:t,atlas:e})}function v2(n,t,e){const i=e/(t.fov*Math.PI/180);for(const s of n)s.uniforms.uPxPerRad.value=i}const ho=new pe,il=new pe,Su=new ts,Eu=new j,x2=new j(1,1,1);function Ma(n,t,e,i={}){const s=new c1(n,t,Math.max(1,e));s.count=0,s.frustumCulled=!1,s.instanceMatrix.setUsage(Un);const o=new Ae(new Float32Array(Math.max(1,e)*4),4);o.setUsage(Un),n.setAttribute("aState",o);for(const[r,a]of Object.entries(i))n.setAttribute(r,a);return s.userData.state=o,s}class y2{constructor(t,e,{colourDate:i,weapons:s,atlas:o}){this.sim=e,this.group=new sn,this.group.name="units",this.materials=[],this.kits=[],this.atlas=o,this.rects=hf(),this.colourDate=i,this.weapons=s,this.light=t,this.pending=e.kits.map((r,a)=>a),this.origin=new j}buildSome(t=2){for(;t-- >0&&this.pending.length;)this.buildKit(this.pending.shift());return this.pending.length===0}get ready(){return this.pending.length===0}buildKit(t){const e=this.sim.kits[t],i=Math.max(1,this.sim.capacityByKit[e.id]||1);if(!e.kit){this.kits[t]=null;return}if(e.kind==="ship"){const s=u2(e.kit,{colourDate:this.colourDate,weapons:this.weapons}),o=m2(this.light,e.kit.loa);this.materials.push(o);const r=Ma(Ob([s.hull,s.parts]),o,i);this.group.add(r);const a={},l=s.turrets.map(c=>{const h=a[c.battery]=(a[c.battery]??-1)+1,u=Ma(c.geometry.clone(),o,i);return this.group.add(u),{mesh:u,at:c.at,rest:c.rest,battery:c.battery,j:h}});this.kits[t]={kind:"ship",hull:r,turrets:l,size:e.kit.loa}}else{const s=d2(e.kit,{colourDate:this.colourDate}),o=Math.max(e.kit.span,e.kit.length),r=g2(this.light,o,this.atlas);this.materials.push(r);const a=this.rects[s.insignia]||[0,0,0,0],l=new Ae(new Float32Array(i*4),4);for(let f=0;f<i;f++)l.array.set(a,f*4);const c=Ma(s.body.clone(),r,i,{aInsignia:l}),h=new Ae(l.array.slice(),4),u=Ma(s.prop.clone(),r,i,{aInsignia:h});this.group.add(c,u),this.kits[t]={kind:"aircraft",body:c,prop:u,size:o}}}update(t,e,i){var l,c,h,u,f;const s=this.sim,o=s.state;this.origin.set(Math.round(t.position.x/1024)*1024,0,Math.round(t.position.z/1024)*1024),this.group.position.copy(this.origin),v2(this.materials,t,e);const r=new Int32Array(this.kits.length),a=s._X;for(let d=0;d<s.capacity;d++){const g=o.alive[d];if(!g)continue;const x=o.kitIndex[d],m=this.kits[x];if(!m)continue;const p=r[x]++;Eu.set(o.pos[3*d]-this.origin.x,o.pos[3*d+1],o.pos[3*d+2]-this.origin.z),Su.set(o.quat[4*d],o.quat[4*d+1],o.quat[4*d+2],o.quat[4*d+3]),ho.compose(Eu,Su,x2);const y=o.fire[d];if(m.kind==="ship"){if(p>=m.hull.instanceMatrix.count)continue;m.hull.setMatrixAt(p,ho);const v=m.hull.userData.state;v.array[4*p]=y,v.array[4*p+1]=g;const M=((l=a[d])==null?void 0:l.guns)||((h=(c=a[d])==null?void 0:c.ai)==null?void 0:h.guns)||null;for(const S of m.turrets){let T=S.rest;const A=(f=(u=M==null?void 0:M[S.battery])==null?void 0:u.mounts)==null?void 0:f[S.j];A&&(T=A.bearing),il.makeRotationY(-T*Math.PI/180),il.setPosition(S.at[0],S.at[1],S.at[2]),S.mesh.setMatrixAt(p,il.premultiply(ho));const k=S.mesh.userData.state;k.array[4*p]=y,k.array[4*p+1]=g}}else{if(p>=m.body.instanceMatrix.count)continue;m.body.setMatrixAt(p,ho),m.prop.setMatrixAt(p,ho);const v=m.body.userData.state;v.array[4*p]=y,v.array[4*p+1]=g}}for(let d=0;d<this.kits.length;d++){const g=this.kits[d];if(!g)continue;const x=r[d],m=g.kind==="ship"?[g.hull,...g.turrets.map(p=>p.mesh)]:[g.body,g.prop];for(const p of m)p.count=Math.min(x,p.instanceMatrix.count),p.instanceMatrix.needsUpdate=!0,p.userData.state.needsUpdate=!0}}materialsAll(){return this.materials}dispose(){var t;for(const e of this.kits){if(!e)continue;const i=e.kind==="ship"?[e.hull,...e.turrets.map(s=>s.mesh)]:[e.body,e.prop];for(const s of i)s.geometry.dispose(),(t=s.dispose)==null||t.call(s)}for(const e of this.materials)e.dispose();this.group.clear()}}const be={smoke:0,fire:1,splash:2,flash:3,fireball:4,flak:5,star:6,foam:7,spark:8,steam:9},Tu={white:[.95,.97,1],red:[.95,.35,.3],black:[.25,.27,.3],blue:[.4,.6,1],yellow:[1,.9,.4],green:[.45,.9,.5],orange:[1,.6,.25]},M2=`
${ln}
in vec3 iPos;      // relative to the origin
in vec4 iData;     // x size (m), y age 0..1, z kind, w seed
in vec4 iColor;    // rgb, a opacity
out vec2 vUv;
out vec4 vData;
out vec4 vColor;
out vec3 vWorld;
uniform float uMinPx;
uniform float uPxPerRad;
void main() {
  vUv = uv;
  vData = iData;
  vColor = iColor;
  float kind = iData.z;
  vec3 c = (modelMatrix * vec4(iPos, 1.0)).xyz;
  float size = iData.x;
  // never smaller than a pixel or two, so a distant splash still reads
  float dist = max(1.0, distance(cameraPosition, c));
  size = max(size, uMinPx * dist / uPxPerRad);
  vec3 right;
  vec3 up;
  if (kind > 6.5 && kind < 7.5) {
    // foam lies on the water
    right = vec3(1.0, 0.0, 0.0);
    up = vec3(0.0, 0.0, 1.0);
    c.y = 0.15;
  } else if (kind > 1.5 && kind < 2.5) {
    // a splash: a column standing up, facing the camera about the vertical
    vec3 toCam = normalize(vec3(cameraPosition.x - c.x, 0.0, cameraPosition.z - c.z));
    right = normalize(cross(vec3(0.0, 1.0, 0.0), toCam));
    up = vec3(0.0, 1.0, 0.0);
  } else {
    right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  }
  vec2 q = position.xy;
  float h = 1.0;
  if (kind > 1.5 && kind < 2.5) {
    // the column rises and falls: tall and narrow
    float a = iData.y;
    h = 2.6 * sin(min(1.0, a * 1.6) * 3.14159);
    q.y = (q.y + 0.5) * h;
    q.x *= 0.55 + a * 0.6;
  }
  vec3 w = c + right * q.x * size + up * q.y * size;
  vWorld = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  ${Ze}
}
`,_2=`
${un}
${ns}
${cn}
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uSunDir;
uniform float uTime;
uniform float uAdditive;
in vec2 vUv;
in vec4 vData;
in vec4 vColor;
in vec3 vWorld;
void main() {
  ${hn}
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float age = vData.y;
  float kind = vData.z;
  float seed = vData.w;
  float n = vnoise(p * 2.5 + seed * 17.0 + uTime * 0.2);
  float a;
  vec3 col = vColor.rgb;
  vec3 lit = uSunColor * max(uSunDir.y, 0.0) * 0.8 + uSkyColor * 1.2 + vec3(0.02);
  if (kind < 0.5) {
    // smoke: a soft lumpy puff, darkening the dye it was given, fading with age
    a = smoothstep(1.0, 0.35, r + (n - 0.5) * 0.5) * (1.0 - age) * vColor.a;
    col = col * lit;
  } else if (kind < 1.5) {
    // fire: a flickering orange core
    a = smoothstep(1.0, 0.0, r + (n - 0.5) * 0.6) * (1.0 - age);
    col = mix(vec3(1.0, 0.85, 0.4), vec3(1.0, 0.3, 0.05), r) * 3.0;
  } else if (kind < 2.5) {
    // a splash column: white water (or dyed), denser at its foot
    float x = abs(p.x);
    float yy = vUv.y;
    a = smoothstep(1.0, 0.3, x + (n - 0.5) * 0.5) * (1.0 - smoothstep(0.5, 1.0, yy)) * (1.0 - age * age) * vColor.a;
    col = col * (lit + vec3(0.05));
  } else if (kind < 3.5) {
    // a gun flash: brief and blinding
    a = smoothstep(1.0, 0.0, r) * (1.0 - age);
    col = vec3(1.0, 0.75, 0.4) * 6.0;
  } else if (kind < 4.5) {
    // a fireball turning to smoke
    a = smoothstep(1.0, 0.2, r + (n - 0.5) * 0.4) * (1.0 - age);
    col = mix(vec3(1.0, 0.55, 0.15) * 4.0, vec3(0.08) * lit, smoothstep(0.1, 0.5, age));
  } else if (kind < 5.5) {
    // flak: a small dark burst
    a = smoothstep(1.0, 0.4, r + (n - 0.5) * 0.6) * (1.0 - age) * 0.85;
    col = vec3(0.07) * lit + vec3(1.0, 0.6, 0.2) * 4.0 * smoothstep(0.08, 0.0, age) * smoothstep(0.6, 0.0, r);
  } else if (kind < 6.5) {
    // a star shell: a hard white light with a halo
    a = smoothstep(1.0, 0.0, r) * (0.3 + 0.7 * smoothstep(0.25, 0.0, r));
    col = vec3(1.0, 0.97, 0.9) * 8.0;
  } else if (kind < 7.5) {
    // foam on the water: a ragged pale patch
    a = smoothstep(1.0, 0.2, r + (n - 0.5) * 0.7) * (1.0 - age) * vColor.a;
    col = vec3(0.85) * lit;
  } else if (kind < 8.5) {
    // a spark (tracer, a hit)
    a = smoothstep(1.0, 0.0, r) * (1.0 - age);
    col = vColor.rgb * 5.0;
  } else {
    // steam over a sinking ship
    a = smoothstep(1.0, 0.3, r + (n - 0.5) * 0.5) * (1.0 - age) * 0.5;
    col = vec3(0.9) * lit;
  }
  if (a < 0.01) discard;
  gl_FragColor = uAdditive > 0.5 ? vec4(col * a, a) : vec4(col, a);
}
`;class Au{constructor(t,e,i){this.cap=e,this.n=0,this.list=[];const s=new Xs(1,1),o=new es;o.index=s.index,o.setAttribute("position",s.attributes.position),o.setAttribute("uv",s.attributes.uv),this.iPos=new Ae(new Float32Array(e*3),3).setUsage(Un),this.iData=new Ae(new Float32Array(e*4),4).setUsage(Un),this.iColor=new Ae(new Float32Array(e*4),4).setUsage(Un),o.setAttribute("iPos",this.iPos),o.setAttribute("iData",this.iData),o.setAttribute("iColor",this.iColor),o.instanceCount=0,this.material=new xe({name:i?"effects-additive":"effects-alpha",vertexShader:M2,fragmentShader:_2,uniforms:{uSunColor:t.uSunColor,uSkyColor:t.uSkyColor,uSunDir:t.uSunDir,uTime:t.uTime,uAdditive:{value:i?1:0},uMinPx:{value:1.5},uPxPerRad:{value:900}},transparent:!0,depthWrite:!1,blending:i?Eo:Hi}),this.mesh=new ge(o,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=i?4:3,this.geometry=o}add(t){this.list.length>=this.cap&&this.list.shift(),this.list.push(t)}update(t,e,i){const s=this.list;let o=0;for(let h=0;h<s.length;h++){const u=s[h],f=(t-u.born)/u.life;if(f>=1||f<-.01)continue;s[o++]=u;const d=u.drag??0;u.vx*=1-d*e,u.vz*=1-d*e,u.vy=u.vy*(1-d*e)+(u.rise??0)*e,u.x+=u.vx*e,u.y+=u.vy*e,u.z+=u.vz*e}s.length=o;const r=Math.min(this.cap,s.length),a=this.iPos.array,l=this.iData.array,c=this.iColor.array;for(let h=0;h<r;h++){const u=s[h],f=Math.max(0,(t-u.born)/u.life);a[3*h]=u.x-i.x,a[3*h+1]=u.y,a[3*h+2]=u.z-i.z,l[4*h]=u.s0+(u.s1-u.s0)*Math.sqrt(f),l[4*h+1]=f,l[4*h+2]=u.kind,l[4*h+3]=u.seed??h*.137%1,c[4*h]=u.r??1,c[4*h+1]=u.g??1,c[4*h+2]=u.b??1,c[4*h+3]=u.a??1}this.geometry.instanceCount=r,this.iPos.needsUpdate=!0,this.iData.needsUpdate=!0,this.iColor.needsUpdate=!0,this.mesh.position.copy(i)}dispose(){this.geometry.dispose(),this.material.dispose()}}const b2=`
${ln}
in vec3 iPos;
in vec3 iVel;     // the streak's direction and length (m)
in vec4 iColor;
out vec4 vColor;
out float vT;
uniform float uMinPx;
uniform float uPxPerRad;
void main() {
  vColor = iColor;
  vec3 c = (modelMatrix * vec4(iPos, 1.0)).xyz;
  float dist = max(1.0, distance(cameraPosition, c));
  float wpx = max(0.25, uMinPx * dist / uPxPerRad);
  vec3 dir = iVel;
  float len = length(dir);
  vec3 d = len > 1e-4 ? dir / len : vec3(0.0, 1.0, 0.0);
  vec3 toCam = normalize(cameraPosition - c);
  vec3 side = normalize(cross(d, toCam) + vec3(1e-5));
  vT = position.y + 0.5;
  vec3 w = c - d * len * (position.y + 0.5) + side * position.x * wpx;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  ${Ze}
}
`,w2=`
${cn}
in vec4 vColor;
in float vT;
void main() {
  ${hn}
  float a = vColor.a * (1.0 - vT);
  gl_FragColor = vec4(vColor.rgb * a, a);
}
`;class S2{constructor(t){this.cap=t;const e=new Xs(1,1),i=new es;i.index=e.index,i.setAttribute("position",e.attributes.position),this.iPos=new Ae(new Float32Array(t*3),3).setUsage(Un),this.iVel=new Ae(new Float32Array(t*3),3).setUsage(Un),this.iColor=new Ae(new Float32Array(t*4),4).setUsage(Un),i.setAttribute("iPos",this.iPos),i.setAttribute("iVel",this.iVel),i.setAttribute("iColor",this.iColor),i.instanceCount=0,this.material=new xe({name:"streaks",vertexShader:b2,fragmentShader:w2,uniforms:{uMinPx:{value:1.2},uPxPerRad:{value:900}},transparent:!0,depthWrite:!1,blending:Eo,side:fn}),this.mesh=new ge(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=5,this.geometry=i}dispose(){this.geometry.dispose(),this.material.dispose()}}class E2{constructor(t,e,{lowQuality:i=!1}={}){this.light=t,this.sim=e,this.group=new sn,this.group.name="effects",this.alpha=new Au(t,i?900:2400,!1),this.add=new Au(t,i?300:900,!0),this.streaks=new S2(1024),this.group.add(this.alpha.mesh,this.add.mesh,this.streaks.mesh),this.lights=[],this.trails=new Map,this.wakeT=new Float64Array(e.capacity),this.smokeT=new Float64Array(e.capacity),this.foamT=new Float64Array(e.projectiles.capacity),this.beams=[],this.rng=1,this.t=0,this.night=0,this.origin=new j}rand(){return this.rng=this.rng*16807%2147483647,this.rng/2147483647}drain(t,e){t.effects.drain(i=>this.effect(i,e))}effect(t,e){const i=()=>this.rand();switch(this.sim.state,t.k){case zt.flash:{if(t.data===1)this.alpha.add({x:t.x,y:t.y,z:t.z,vx:0,vy:0,vz:0,born:e,life:5+i()*3,s0:6,s1:18,kind:be.flak,seed:i()}),this.lights.push({x:t.x,y:t.y,z:t.z,r:250,col:[2,1.2,.5],until:e+.15});else{const s=8+t.size*18;this.add.add({x:t.x+t.dx*s*.5,y:t.y,z:t.z+t.dz*s*.5,vx:0,vy:0,vz:0,born:e,life:.25,s0:s,s1:s*1.4,kind:be.flash}),this.alpha.add({x:t.x+t.dx*s,y:t.y,z:t.z+t.dz*s,vx:t.dx*4,vy:1.5,vz:t.dz*4,born:e,life:12,s0:s*.6,s1:s*2.5,kind:be.smoke,r:.55,g:.55,b:.55,a:.55,drag:.3,seed:i()}),this.lights.push({x:t.x,y:t.y+10,z:t.z,r:300+t.size*300,col:[6,3.6,1.6],until:e+.2})}return}case zt.splash:{const s=Math.max(2,t.size),o=this.night>.5?"white":Qd[t.data|0]||"white",r=Tu[o]||Tu.white;this.alpha.add({x:t.x,y:0,z:t.z,vx:0,vy:0,vz:0,born:e,life:3+s*.05,s0:s*.5,s1:s*.7,kind:be.splash,r:r[0],g:r[1],b:r[2],a:.9,seed:i()}),this.alpha.add({x:t.x,y:0,z:t.z,vx:0,vy:0,vz:0,born:e,life:25,s0:s*.6,s1:s*1.8,kind:be.foam,a:.7,seed:i()});return}case zt.hit:{for(let s=0;s<3;s++)this.add.add({x:t.x,y:t.y,z:t.z,vx:(i()-.5)*30,vy:10+i()*20,vz:(i()-.5)*30,born:e,life:.6+i()*.5,s0:2+t.size*4,s1:1,kind:be.spark,r:1,g:.7,b:.3,rise:-9.8});this.add.add({x:t.x,y:t.y,z:t.z,vx:0,vy:0,vz:0,born:e,life:.3,s0:6+t.size*10,s1:10+t.size*14,kind:be.flash}),this.lights.push({x:t.x,y:t.y+5,z:t.z,r:200,col:[4,2.4,1],until:e+.25});return}case zt.explode:{const s=12+t.size*20;this.add.add({x:t.x,y:t.y+s*.3,z:t.z,vx:0,vy:2,vz:0,born:e,life:2.5,s0:s,s1:s*2.2,kind:be.fireball,seed:i()});for(let o=0;o<3;o++)this.alpha.add({x:t.x+(i()-.5)*s,y:t.y+s*.5,z:t.z+(i()-.5)*s,vx:(i()-.5)*4,vy:4+i()*4,vz:(i()-.5)*4,born:e+.4,life:40,s0:s,s1:s*4,kind:be.smoke,r:.12,g:.11,b:.1,a:.8,drag:.1,seed:i()});this.lights.push({x:t.x,y:t.y+s,z:t.z,r:700,col:[8,4,1.5],until:e+1.2});return}case zt.fire:return;case zt.smoke:{if(t.data===1)for(let o=0;o<=24;o++)this.alpha.add({x:t.x+t.dx*o/24,y:25+i()*20,z:t.z+t.dz*o/24,vx:this.sim.wind.x,vy:.2,vz:this.sim.wind.z,born:e,life:Math.min(900,t.size||600),s0:150,s1:420,kind:be.smoke,r:.85,g:.85,b:.85,a:.85,seed:i()});else this.trails.set(t.unit,{next:e,until:e+20,dark:.45});return}case zt.sink:for(let s=0;s<6;s++)this.alpha.add({x:t.x+(i()-.5)*t.size*.6,y:2,z:t.z+(i()-.5)*t.size*.6,vx:0,vy:1,vz:0,born:e+s*3,life:60,s0:30,s1:90,kind:be.steam,seed:i()});this.alpha.add({x:t.x,y:0,z:t.z,vx:0,vy:0,vz:0,born:e,life:240,s0:t.size*.6,s1:t.size*1.6,kind:be.foam,a:.8,seed:i()});return;case zt.fall:this.trails.set(t.unit,{next:e,until:e+120,dark:t.data===1?.7:.15});return;case zt.gone:return;case zt.starshell:this.lights.push({x:t.x,y:t.y,z:t.z,r:1800,col:[14,13,12],until:e+Math.min(t.size||45,60),star:!0,vy:-4,born:e});return;case zt.searchlight:this.beams.push({unit:t.unit,dx:t.dx,dz:t.dz,until:e+(t.size||120)});return;case zt.tracer:{const s=Math.hypot(t.dx,t.dy,t.dz)||1,o=s>2,r=o?t.dx/s:t.dx,a=o?t.dy/s:t.dy,l=o?t.dz/s:t.dz,c=800,h=t.data===1?6:3;for(let u=0;u<h;u++)this.add.add({x:t.x+r*u*30,y:t.y+a*u*30,z:t.z+l*u*30,vx:r*c,vy:a*c,vz:l*c,born:e+u*.05,life:Math.min(1.5,(o?s:600)/c),s0:1.6,s1:1.2,kind:be.spark,r:1,g:.85,b:.5});return}case zt.launch:case zt.spawn:case zt.despawn:case zt.wake:}}update(t,e,i,s,o){this.t=i,this.night=o.night??0;const r=this.sim,a=r.state,l=()=>this.rand();this.origin.set(Math.round(t.position.x/1024)*1024,0,Math.round(t.position.z/1024)*1024);const c=t.position.x,h=t.position.z;for(let v=0;v<r.capacity;v++){const M=a.alive[v];if(!M)continue;const S=r.units[v],T=a.pos[3*v],A=a.pos[3*v+2],k=Math.hypot(T-c,A-h);if(S.kind==="ship"){const _=r._X[v].model,w=a.fire[v];if(w>0&&i>=this.smokeT[v]){this.smokeT[v]=i+(k>3e4?3:.8)/Math.max(.3,w);const[C,F]=[Math.sin(a.heading[v]*Math.PI/180),-Math.cos(a.heading[v]*Math.PI/180)],z=(l()-.5)*_.L*.6,P=T+C*z,B=A+F*z;this.alpha.add({x:P,y:_.deck+4,z:B,vx:r.wind.x*.6,vy:6+l()*4,vz:r.wind.z*.6,born:i,life:70,s0:12+_.B*.4,s1:90+_.B*2,kind:be.smoke,r:.09,g:.085,b:.08,a:.85,drag:.02,seed:l()}),this.add.add({x:P,y:_.deck+3,z:B,vx:0,vy:3,vz:0,born:i,life:1.4,s0:6+_.B*.3,s1:3,kind:be.fire,seed:l()}),this.night>.3&&this.lights.push({x:P,y:_.deck+10,z:B,r:180+_.B*3,col:[3,1.5,.5],until:i+1})}if(M===1&&a.speed[v]>1&&i>=this.wakeT[v]&&k<4e4){this.wakeT[v]=i+(k>15e3?4:1.5);const C=a.heading[v]*Math.PI/180,F=-Math.sin(C),z=Math.cos(C),P=a.speed[v]/15;this.alpha.add({x:T+F*_.L*.5,y:0,z:A+z*_.L*.5,vx:0,vy:0,vz:0,born:i,life:40+30*P,s0:_.B*.9,s1:_.B*(2.5+2*P),kind:be.foam,a:Math.min(.75,.3+.4*P),seed:l()}),this.alpha.add({x:T-F*_.L*.45,y:0,z:A-z*_.L*.45,vx:0,vy:0,vz:0,born:i,life:8,s0:_.B*.6,s1:_.B*1.6,kind:be.foam,a:Math.min(.6,.25*P),seed:l()})}}}for(const[v,M]of this.trails){if(i>M.until||!a.alive[v]){this.trails.delete(v);continue}if(i<M.next)continue;M.next=i+.25;const S=a.pos[3*v],T=a.pos[3*v+1],A=a.pos[3*v+2];this.alpha.add({x:S,y:T,z:A,vx:0,vy:.5,vz:0,born:i,life:18,s0:4,s1:22,kind:be.smoke,r:M.dark,g:M.dark,b:M.dark,a:.75,seed:l()}),a.alive[v]===2&&M.dark<.5&&this.add.add({x:S,y:T,z:A,vx:0,vy:0,vz:0,born:i,life:.5,s0:5,s1:2,kind:be.fire})}const u=r.projectiles,f=this.streaks;let d=0;const g=f.iPos.array,x=f.iVel.array,m=f.iColor.array;for(let v=0;v<u.capacity&&d<f.cap;v++){if(!u.alive[v])continue;const M=3*v,S=u.kind[v],T=u.pos[M],A=u.pos[M+1],k=u.pos[M+2];if(S===3){i>=this.foamT[v]&&(this.foamT[v]=i+.6,this.alpha.add({x:T,y:0,z:k,vx:0,vy:0,vz:0,born:i,life:50,s0:3,s1:9,kind:be.foam,a:.55,seed:l()}));continue}const _=u.vel[M],w=u.vel[M+1],C=u.vel[M+2],F=Math.hypot(_,w,C)||1,z=S===1?25:S===0?Math.min(60,F*.04):3;g[3*d]=T-this.origin.x,g[3*d+1]=A,g[3*d+2]=k-this.origin.z,x[3*d]=_/F*z,x[3*d+1]=w/F*z,x[3*d+2]=C/F*z;const P=S===1?1:S===0?.25+this.night*.6:.05;m[4*d]=1,m[4*d+1]=S===1?.8:.7,m[4*d+2]=S===1?.45:.5,m[4*d+3]=P,d++}f.geometry.instanceCount=d,f.iPos.needsUpdate=!0,f.iVel.needsUpdate=!0,f.iColor.needsUpdate=!0,f.mesh.position.copy(this.origin),this.lights=this.lights.filter(v=>v.until>i);for(const v of this.lights)v.star&&(v.y=Math.max(50,v.y+v.vy*s),(!v.sprite||v.spriteT<i)&&(v.spriteT=i+.5,this.add.add({x:v.x,y:v.y,z:v.z,vx:0,vy:v.vy,vz:0,born:i,life:.55,s0:36,s1:36,kind:be.star})));this.beams=this.beams.filter(v=>v.until>i&&a.alive[v.unit]);for(const v of this.beams){const M=v.unit;if(Math.hypot(v.dx,v.dz),this.lights.push({x:a.pos[3*M]+v.dx,y:20,z:a.pos[3*M+2]+v.dz,r:450,col:[9,9,8.5],until:i+.05}),l()<.5)for(let S=1;S<8;S++)this.add.add({x:a.pos[3*M]+v.dx*S/8,y:25-S,z:a.pos[3*M+2]+v.dz*S/8,vx:0,vy:0,vz:0,born:i,life:.12,s0:10+S*8,s1:10+S*8,kind:be.flash})}this.alpha.update(i,s,this.origin),this.add.update(i,s,this.origin);for(const v of[this.alpha.material,this.add.material,f.material])v.uniforms.uPxPerRad.value=e/(t.fov*Math.PI/180);const p=o.uniforms,y=this.lights.map(v=>({l:v,d:Math.max(0,Math.hypot(v.x-c,v.y-t.position.y,v.z-h)-v.r)})).sort((v,M)=>v.d-M.d).slice(0,p.uPointPos.value.length);for(let v=0;v<p.uPointPos.value.length;v++){const M=y[v];M?(p.uPointPos.value[v].set(M.l.x,M.l.y,M.l.z,M.l.r),p.uPointCol.value[v].set(M.l.col[0],M.l.col[1],M.l.col[2])):p.uPointPos.value[v].set(0,-1e9,0,1)}p.uPointCount.value=y.length}materials(){return[this.alpha.material,this.add.material,this.streaks.material]}dispose(){this.alpha.dispose(),this.add.dispose(),this.streaks.dispose(),this.light.uPointCount.value=0}}const T2=`
${ln}
in vec3 iPos;
in vec2 iSize;   // x width, y height (m)
in float iSeed;
out vec2 vUv;
out float vSeed;
out vec3 vWorld;
void main() {
  vUv = uv;
  vSeed = iSeed;
  vec3 c = (modelMatrix * vec4(iPos, 1.0)).xyz;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 w = c + right * position.x * iSize.x + up * position.y * iSize.y;
  vWorld = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  ${Ze}
}
`,A2=`
${un}
${ns}
${cn}
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uSunDir;
uniform vec3 uMoonColor;
uniform float uOpacity;
in vec2 vUv;
in float vSeed;
in vec3 vWorld;
void main() {
  ${hn}
  vec2 p = vUv * 2.0 - 1.0;
  float n = fbm2(p * 1.6 + vSeed * 31.0);
  float d = length(p * vec2(1.0, 1.6)) + (n - 0.5) * 0.7;
  float a = smoothstep(1.0, 0.45, d) * uOpacity;
  if (a < 0.01) discard;
  // lit from above, shaded below; the sun's colour on the top
  float top = smoothstep(-0.6, 0.8, p.y);
  vec3 col = uSkyColor * (1.1 + 0.4 * top) + uSunColor * max(uSunDir.y, 0.0) * (0.35 + 0.65 * top) + uMoonColor * 0.4 * top;
  gl_FragColor = vec4(col, a);
}
`,C2=`
${un}
${ns}
${cn}
uniform vec3 uSkyColor;
uniform vec3 uSunColor;
uniform vec3 uSunDir;
uniform float uTime;
in vec3 vWorld;
in float vH;
void main() {
  ${hn}
  // rain: streaks falling through a ragged curtain, densest low down, thin and broken overall
  float along = (vWorld.x + vWorld.z) * 0.02;
  float streak = vnoise(vec2(along * 3.0, vWorld.y * 0.01 + uTime * 0.8));
  float body = fbm2(vec2(along * 0.05, vWorld.y * 0.002 - uTime * 0.01));
  float a = (0.05 + 0.16 * smoothstep(0.35, 0.8, body) + 0.06 * smoothstep(0.55, 0.9, streak));
  a *= (1.0 - smoothstep(0.6, 1.0, vH)) * (0.6 + 0.4 * (1.0 - vH));
  vec3 col = (uSkyColor * 0.9 + uSunColor * max(uSunDir.y, 0.0) * 0.2) * 0.5;
  gl_FragColor = vec4(col, a);
}
`,R2=`
${ln}
in float aH;
out vec3 vWorld;
out float vH;
void main() {
  vH = aH;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
  ${Ze}
}
`;function L2(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}class k2{constructor(t,e={},i,s=[],{lowQuality:o=!1}={}){this.weather=e,this.group=new sn,this.group.name="weather",this.origin=new j;const r=e.cloud||{},a=Math.max(0,Math.min(1,r.cover??.25)),l=r.baseM??1200,c=Math.max(l+200,r.topsM??l+800),h=L2(24301+Math.round(l)),u=i.x1-i.x0,f=i.z1-i.z0,d=Math.round(Math.min(o?300:900,a*1100)),g=new Xs(1,1),x=new es;x.index=g.index,x.setAttribute("position",g.attributes.position),x.setAttribute("uv",g.attributes.uv);const m=new Float32Array(Math.max(1,d)*3),p=new Float32Array(Math.max(1,d)*2),y=new Float32Array(Math.max(1,d));this.puffs=[];for(let T=0;T<d;T++){const A=i.x0-u*.25+h()*u*1.5,k=i.z0-f*.25+h()*f*1.5,_=1500+h()*2500,w=Math.min(c-l,400+h()*900);this.puffs.push([A,l+w*.5+h()*(c-l-w)*.5,k]),p.set([_,w],T*2),y[T]=h()}this.pos=new Ae(m,3).setUsage(Un),x.setAttribute("iPos",this.pos),x.setAttribute("iSize",new Ae(p,2)),x.setAttribute("iSeed",new Ae(y,1)),x.instanceCount=d,this.cloudMat=new xe({name:"clouds",vertexShader:T2,fragmentShader:A2,uniforms:{uSunColor:t.uSunColor,uSkyColor:t.uSkyColor,uSunDir:t.uSunDir,uMoonColor:t.uMoonColor,uOpacity:{value:.85}},transparent:!0,depthWrite:!1}),this.clouds=new ge(x,this.cloudMat),this.clouds.frustumCulled=!1,this.clouds.renderOrder=2,this.group.add(this.clouds);const v=e.wind||{},M=((v.fromDeg??90)+180)*(Math.PI/180),S=v.kn??8;this.drift=[Math.sin(M)*S*.514444,-Math.cos(M)*S*.514444],this.squalls=s,this.curtainMat=new xe({name:"squalls",vertexShader:R2,fragmentShader:C2,uniforms:{uSkyColor:t.uSkyColor,uSunColor:t.uSunColor,uSunDir:t.uSunDir,uTime:t.uTime},transparent:!0,depthWrite:!1,side:fn}),this.curtains=s.map(T=>{const A=[],k=[],_=[],w=T.poly;for(let z=0;z+1<w.length;z++){const[P,B]=w[z],[X,J]=w[z+1],Z=A.length/3;A.push(P,0,B,X,0,J,X,l,J,P,l,B),k.push(0,0,1,1),_.push(Z,Z+1,Z+2,Z,Z+2,Z+3)}const C=new Oe;C.setAttribute("position",new we(A,3)),C.setAttribute("aH",new we(k,1)),C.setIndex(_);const F=new ge(C,this.curtainMat);return F.frustumCulled=!1,F.renderOrder=2,this.group.add(F),{mesh:F,sq:T}})}update(t,e){this.origin.set(Math.round(t.position.x/1024)*1024,0,Math.round(t.position.z/1024)*1024);const i=this.pos.array,s=this.drift[0]*e*.3,o=this.drift[1]*e*.3;for(let r=0;r<this.puffs.length;r++){const a=this.puffs[r];i[3*r]=a[0]+s-this.origin.x,i[3*r+1]=a[1],i[3*r+2]=a[2]+o-this.origin.z}this.pos.needsUpdate=!0,this.clouds.position.copy(this.origin);for(const r of this.curtains){const a=r.sq;r.mesh.visible=e>=a.t0&&e<=a.t1;const l=Number.isFinite(a.t0)?e-a.t0:0;r.mesh.position.set(a.vx*l,0,a.vz*l)}}materials(){return[this.cloudMat,this.curtainMat]}dispose(){this.clouds.geometry.dispose(),this.cloudMat.dispose();for(const t of this.curtains)t.mesh.geometry.dispose();this.curtainMat.dispose()}}const sl=new j,uo=new j,ol=new ts,Bn=new j,al=new j,gi=Math.PI/180,Cu=["free","orbit","chase","bridge","director","sight"],rl=[1,4,8,16];class P2{constructor(t){this.box=t,this.camera=t.camera,this.mode="free",this.unit=-1,this.zoom=1,this.look={yaw:0,pitch:0},this.pos=new j,this.has=!1,this.baseFov=42}set(t,e={}){var o;if(!Cu.includes(t))throw new Error(`camera mode “${t}”: one of ${Cu.join(", ")}`);const i=this.mode;this.mode=t,e.unitIndex!=null&&(this.unit=e.unitIndex),e.zoom!=null&&(this.zoom=e.zoom),this.has=!1,this.look.yaw=0,this.look.pitch=0;const s=this.box.rig;if(t==="free"||t==="orbit"){const r=(o=this.box.sim)==null?void 0:o.state,a=this.unit;if(t==="orbit"&&r&&a>=0){const l={target:{x:r.pos[3*a],z:r.pos[3*a+2]},distance:e.distance??(i==="free"||i==="orbit"?s.goal.distance:1500),yaw:e.bearing!=null?Math.PI-e.bearing*gi:s.goal.yaw,pitch:e.pitch??s.goal.pitch};s.jump(l)}else e.target&&s.flyTo({target:{x:e.target.x,y:0,z:e.target.z},distance:e.distance,yaw:e.bearing!=null?Math.PI-e.bearing*gi:void 0,pitch:e.pitch},e.duration??2);this.camera.fov=this.baseFov,this.camera.updateProjectionMatrix()}}get rigDriven(){return this.mode==="free"||this.mode==="orbit"}addLook(t,e){this.look.yaw+=t,this.look.pitch=Math.max(-.6,Math.min(.6,this.look.pitch+e))}cycleZoom(){const t=rl.indexOf(this.zoom);return this.zoom=rl[(t+1)%rl.length],this.zoom}update(t){var x;const e=this.box,i=this.camera,s=e.sim;if(this.rigDriven||!s){if(this.mode==="orbit"&&s&&this.unit>=0&&s.state.alive[this.unit]){const m=s.state,p=this.unit;e.rig.goal.target.x=m.pos[3*p],e.rig.goal.target.z=m.pos[3*p+2]}e.rig.update(t);return}const o=s.state,r=this.unit;if(r<0||!o.alive[r]){this.set("free");return}const a=o.pos[3*r],l=o.pos[3*r+1],c=o.pos[3*r+2];ol.set(o.quat[4*r],o.quat[4*r+1],o.quat[4*r+2],o.quat[4*r+3]);const h=s.units[r],f=s._X[r].model;let d=this.baseFov;if(this.mode==="chase"){const m=h.kind==="aircraft",p=m&&f.type!=="fighter",y=m?p?25:18:300,v=m?p?5:4:100,M=o.vel[3*r],S=o.vel[3*r+1],T=o.vel[3*r+2],A=Math.hypot(M,S,T);A>1?Bn.set(M/A,S/A,T/A):Bn.set(Math.sin(o.heading[r]*gi),0,-Math.cos(o.heading[r]*gi)),m||Bn.set(Bn.x,0,Bn.z).normalize(),sl.set(a,l,c).addScaledVector(Bn,-y),sl.y+=v;const k=this.has?1-Math.exp(-t/.15):1;this.pos.lerp(sl,k),this.has=!0,i.position.copy(this.pos),uo.set(a,l,c).addScaledVector(Bn,m?60:400),i.up.set(0,1,0),i.lookAt(uo),d=m?65:55}else if(this.mode==="sight")Bn.set(0,0,-1).applyQuaternion(ol),al.set(0,1,0).applyQuaternion(ol),i.position.set(a,l,c).addScaledVector(al,1.2).addScaledVector(Bn,1.5),i.up.copy(al),i.lookAt(uo.copy(i.position).add(Bn)),d=25;else{const m=f.sup||{yHi:f.top*.6,z0:-f.L*.15},p=o.heading[r]*gi,y=Math.sin(p),v=-Math.cos(p),M=this.mode==="director"?m.yHi*1.05:m.yHi*.8,S=-(m.z0??0)+3;i.position.set(a+y*S,l+M,c+v*S);let T=o.heading[r]+this.look.yaw/gi,A=this.look.pitch;if(this.mode==="director"){const _=((x=s.player)==null?void 0:x.unitIndex)===r?s.player.input:null;_&&_.aimAz!=null&&(T=_.aimAz+this.look.yaw/gi);const w=(_==null?void 0:_.aimRange)??8e3;A=-Math.atan2(M,w)+this.look.pitch,d=60/Math.max(1,this.zoom)}else d=60;const k=T*gi;uo.set(i.position.x+Math.sin(k)*Math.cos(A)*1e3,i.position.y+Math.sin(A)*1e3,i.position.z-Math.cos(k)*Math.cos(A)*1e3),i.up.set(0,1,0),i.lookAt(uo)}const g=e.ground.heightAt(i.position.x,i.position.z);i.position.y<g+1.5&&(i.position.y=g+1.5),Math.abs(i.fov-d)>.01&&(i.fov=d),i.near=.5,i.far=45e4,i.updateProjectionMatrix(),i.updateMatrixWorld()}}const z2=`
.pt-hud { position: fixed; inset: 0; pointer-events: none; font: 12px/1.35 Inter, system-ui, sans-serif; color: #e9e4d6; text-shadow: 0 1px 2px rgba(0,0,0,.85); z-index: 20; }
.pt-hud .clock { position: absolute; left: 14px; top: 12px; }
.pt-hud .clock b { font-size: 18px; font-weight: 600; letter-spacing: .02em; font-variant-numeric: tabular-nums; }
.pt-hud .clock .sub { opacity: .75; }
.pt-hud .subs { position: absolute; left: 50%; bottom: 64px; transform: translateX(-50%); text-align: center; max-width: min(720px, 90vw); }
.pt-hud .subs div { margin: 2px 0; padding: 2px 10px; background: rgba(8,10,12,.45); border-radius: 3px; transition: opacity .6s; }
.pt-hud .plot { position: absolute; right: 14px; top: 12px; width: 168px; height: 168px; border-radius: 50%; background: rgba(6,12,10,.55); border: 1px solid rgba(200,220,200,.25); }
.pt-hud .plot-label { position: absolute; right: 14px; top: 184px; width: 168px; text-align: center; opacity: .7; font-size: 11px; }
.pt-hud .inst { position: absolute; left: 14px; bottom: 14px; min-width: 210px; padding: 8px 10px; background: rgba(8,10,12,.45); border-radius: 4px; font-variant-numeric: tabular-nums; white-space: pre; }
.pt-hud .inst .warn { color: #f0b860; }
.pt-hud .msg { position: absolute; left: 50%; top: 26%; transform: translateX(-50%); text-align: center; font-size: 15px; padding: 6px 14px; background: rgba(8,10,12,.5); border-radius: 4px; }
.pt-hud .msg:empty, .pt-hud .subs:empty, .pt-hud .keys:empty { display: none; }
.pt-hud .keys { position: absolute; right: 14px; bottom: 14px; max-width: 300px; padding: 8px 10px; background: rgba(8,10,12,.45); border-radius: 4px; font-size: 11px; white-space: pre-line; }
.pt-hud .mark { position: absolute; transform: translate(-50%, -50%); white-space: nowrap; font-size: 11px; }
.pt-hud .bracket { width: 34px; height: 34px; border: 1px solid rgba(240,230,200,.85); border-radius: 2px; }
.pt-hud .bracket span { position: absolute; left: 40px; top: 4px; }
.pt-hud .reticle { width: 22px; height: 22px; border: 1px solid rgba(255,255,255,.9); border-radius: 50%; }
.pt-hud .reticle span { position: absolute; left: 28px; top: 2px; }
.pt-hud .pip { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #f6e3a0; }
.pt-hud .ccip { width: 14px; height: 14px; border: 1px solid #f6e3a0; transform: translate(-50%, -50%) rotate(45deg); }
.pt-hud .ccip.on { background: rgba(246,227,160,.6); }
.pt-hud .cue { position: absolute; left: 50%; top: 62%; transform: translateX(-50%); padding: 3px 10px; border: 1px solid #f6e3a0; border-radius: 3px; }
.pt-hud .cue:empty { display: none; }
.pt-hud .vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.95) 75%); opacity: 0; transition: opacity .3s; }
`,D2=.514444,ll=Math.PI/180,I2=[[-.75,"back full"],[-.3,"back one third"],[-.02,"stop"],[.4,"ahead one third"],[.7,"ahead two thirds"],[.86,"ahead standard"],[.97,"ahead full"],[2,"ahead flank"]],U2=n=>{var t;return((t=I2.find(([e])=>n<=e))==null?void 0:t[1])??"ahead flank"};class F2{constructor(t,{container:e=document.body}={}){if(this.box=t,!document.getElementById("pt-hud-style")){const s=document.createElement("style");s.id="pt-hud-style",s.textContent=z2,document.head.appendChild(s)}const i=document.createElement("div");i.className="pt-hud",i.innerHTML=`
      <div class="vignette"></div>
      <div class="clock"><b></b><div class="sub"></div></div>
      <canvas class="plot" width="168" height="168"></canvas><div class="plot-label"></div>
      <div class="subs"></div>
      <div class="msg"></div>
      <div class="cue"></div>
      <div class="inst"></div>
      <div class="keys"></div>
      <div class="mark bracket" style="display:none"><span></span></div>
      <div class="mark reticle" style="display:none"><span></span></div>
      <div class="mark pip" style="display:none"></div>
      <div class="mark ccip" style="display:none"></div>`,e.appendChild(i),this.el=i,this.$=s=>i.querySelector(s),this.clockB=this.$(".clock b"),this.clockS=this.$(".clock .sub"),this.plot=this.$(".plot"),this.plotLabel=this.$(".plot-label"),this.subs=this.$(".subs"),this.msg=this.$(".msg"),this.cue=this.$(".cue"),this.inst=this.$(".inst"),this.keys=this.$(".keys"),this.bracket=this.$(".bracket"),this.reticle=this.$(".reticle"),this.pip=this.$(".pip"),this.ccip=this.$(".ccip"),this.vignette=this.$(".vignette"),this.beatIndex=0,this.lines=[],this.units=null,this.textT=0,this.message="",this.messageUntil=0,this.keysUntil=0,this.visible=!0,this.v=new j}toggleUnits(){var i,s,o;const t=((o=(s=(i=this.box.sim)==null?void 0:i.player)==null?void 0:s.state)==null?void 0:o.units)??"imperial",e=this.units??t;this.units=e==="imperial"?"metric":"imperial"}say(t,e=4){this.message=t,this.messageUntil=performance.now()/1e3+e}showKeys(t,e=3){this.keys.textContent=t,this.keysUntil=performance.now()/1e3+e}setVisible(t){this.visible=t,this.el.style.display=t?"":"none"}project(t,e,i){const s=this.box.camera;return this.v.set(t,e,i).project(s),this.v.z>1||this.v.z<-1?null:[(this.v.x+1)/2*innerWidth,(1-this.v.y)/2*innerHeight]}place(t,e){if(!e){t.style.display="none";return}t.style.display="",t.style.left=`${e[0]}px`,t.style.top=`${e[1]}px`}update(t){var x,m,p;if(!this.visible)return;const e=this.box,i=e.sim;if(!i)return;const s=performance.now()/1e3,o=i.clock;for(;this.beatIndex<i.beats.length;){const y=i.beats[this.beatIndex++];y.kind!=="checkpoint"&&this.lines.push({text:y.text,until:s+6})}this.lines=this.lines.filter(y=>y.until>s).slice(-3),this.textT-=t;const r=this.textT<=0;if(r){this.textT=.1;const y=((m=(x=e.battleData)==null?void 0:x.clock)==null?void 0:m.name)??o.zone;this.clockB.textContent=o.label(i.t,{seconds:!0});const v=((p=e.battle)==null?void 0:p.timeScale)??1;this.clockS.textContent=`${y} · ${o.dateLabel(i.t)}${v!==1?` · ×${v}`:""}${e.battle&&!e.battle.running?" · paused":""}`,this.subs.innerHTML="";for(const M of this.lines){const S=document.createElement("div");S.textContent=M.text,this.subs.appendChild(S)}this.msg.textContent=s<this.messageUntil?this.message:"",s>this.keysUntil&&(this.keys.textContent="")}const a=i.player;if(this.drawPlot(a),!a||!i.state.alive[a.unitIndex]){this.inst.style.display="none";for(const y of[this.bracket,this.reticle,this.pip,this.ccip])y.style.display="none";this.cue.textContent="",this.vignette.style.opacity=0;return}this.inst.style.display="";const l=a.state,h=(this.units??l.units)==="imperial",u=y=>h?`${(y/D2).toFixed(0)} kn`:`${(y*3.6).toFixed(0)} km/h`,f=y=>h?`${Math.round(y*3.28084).toLocaleString("en")} ft`:`${Math.round(y).toLocaleString("en")} m`,d=y=>h?`${Math.round(y*1.09361).toLocaleString("en")} yd`:`${Math.round(y).toLocaleString("en")} m`,g=y=>`${String(Math.round((y%360+360)%360)).padStart(3,"0")}°`;if(a.kind==="aircraft"){if(r){const T=[`${u(l.ias)} IAS   ${f(l.alt)}`,`heading ${g(l.heading)}   throttle ${Math.round(l.throttle*100)} %`,`${l.g.toFixed(1)} g${l.stall?'   <span class="warn">stall</span>':""}${l.shake>0?'   <span class="warn">overspeed</span>':""}${l.broken?'   <span class="warn">controls damaged</span>':""}`,l.ammo.filter(A=>A.left>0||A.position!=="rear").map(A=>`${A.calibreMm} mm ${A.left}`).join("  "),`${l.bombs?`bombs ${l.bombs}   `:""}${l.torpedoes?`torpedo ${l.torpedoes}   `:""}fuel ${Math.floor(l.endurance/60)} min`,l.home?`home ${g(l.home.bearing)} ${h?`${(l.home.range/1852).toFixed(0)} nm`:`${(l.home.range/1e3).toFixed(0)} km`}`:"",l.aa>0?'<span class="warn">AA</span>':""];this.inst.innerHTML=T.filter(Boolean).join(`
`)}const y=l.target;if(y){const T=i.state;this.place(this.bracket,this.project(T.pos[3*y.index],T.pos[3*y.index+1],T.pos[3*y.index+2])),this.bracket.querySelector("span").textContent=d(y.range);const A=e.aid!=="record"&&(e.aid==="guided"||y.range<400);this.place(this.pip,A&&y.lead?this.project(y.lead[0],y.lead[1],y.lead[2]):null)}else this.bracket.style.display="none",this.pip.style.display="none";const v=l.ccip,M=v&&e.aid!=="record"&&(e.aid==="guided"||l.alt<1500)&&l.pitch<-20;this.place(this.ccip,M?this.project(v.x,0,v.z):null),this.ccip.classList.toggle("on",!!(v!=null&&v.onTarget));let S="";l.release&&l.pitch<-20?S="release":l.envelope&&l.alt<120&&(S=l.envelope.ok?"in the envelope":l.envelope.why),S!==this.cue.textContent&&(this.cue.textContent=S),this.vignette.style.opacity=l.blackout>.9?.9:l.blackout>.4?.45:0,this.reticle.style.display="none"}else{if(r){const T=l.fires.reduce((C,F)=>C+F,0),A=l.lastSalvo,k=A&&i.t<A.landsAt?`salvo in the air ${(A.landsAt-i.t).toFixed(1)} s`:A&&A.tags.length?`last salvo: ${[...new Set(A.tags)].join(", ")}${A.straddle?" (straddle)":""}`:"",_=l.turrets.filter(C=>C.role==="main"||C.battery===0),w=[`${u(l.speed)}   ordered ${U2((l.telegraph>=0,l.telegraph))}`,`heading ${g(l.heading)}   rudder ${Math.abs(l.rudder).toFixed(0)}° ${l.rudder>.5?"starboard":l.rudder<-.5?"port":""}`,`main battery ${_.filter(C=>C.ready).length}/${_.length} ready${l.aimTof!=null?`   time of flight ${l.aimTof.toFixed(1)} s`:""}`,k,`damage: fighting ${Math.round(Math.max(0,1-l.fight)*100)} %  afloat ${Math.round(Math.max(0,1-l.float)*100)} %${Math.abs(l.list)>1?`  list ${Math.abs(l.list).toFixed(0)}°`:""}${T?`  fires ${T}`:""}`,l.systemsOut.length?`<span class="warn">${l.systemsOut.join(", ")}</span>`:"",l.torpedoesReady?`torpedoes ready: ${l.torpedoesReady}`:""];this.inst.innerHTML=w.filter(Boolean).join(`
`)}const y=i.state,v=a.unitIndex,M=a.input;if(M.aimRange!=null&&M.aimAz!=null){const T=M.aimAz*ll,A=y.pos[3*v]+Math.sin(T)*M.aimRange,k=y.pos[3*v+2]-Math.cos(T)*M.aimRange;this.place(this.reticle,this.project(A,0,k)),this.reticle.querySelector("span").textContent=`${d(M.aimRange)}${l.aimTof!=null?` · ${l.aimTof.toFixed(1)} s`:""}`}else this.reticle.style.display="none";const S=l.target;S&&e.aid!=="record"?(this.place(this.bracket,this.project(y.pos[3*S.index],12,y.pos[3*S.index+2])),this.bracket.querySelector("span").textContent=`${i.units[S.index].name} · ${d(S.range)}${S.tof?` · ${S.tof.toFixed(1)} s`:""}${S.how==="radar"?" · radar":""}`):this.bracket.style.display="none",this.pip.style.display="none",this.ccip.style.display="none",this.cue.textContent="",this.vignette.style.opacity=0}}drawPlot(t){const e=this.plot,i=e.getContext("2d"),s=e.width,o=s/2;i.clearRect(0,0,s,s);const r=this.box.sim;if(!t){e.style.display="none",this.plotLabel.textContent="";return}e.style.display="";const a=t.state,l=t.kind==="aircraft"?2e4:3e4;i.strokeStyle="rgba(200,230,200,.22)";for(const u of[1/3,2/3])i.beginPath(),i.arc(o,o,o*u,0,Math.PI*2),i.stroke();const c=(r._X[t.unitIndex].model.sensors||[]).length>0;this.plotLabel.textContent=`${c?"radar plot":"lookouts"} · ${t.kind==="aircraft"?"20 km":"30 km"}`;for(const u of a.contacts||[]){if(u.range>l)continue;const f=u.bearing*ll,d=o+Math.sin(f)*u.range*o/l,g=o-Math.cos(f)*u.range*o/l;i.fillStyle=u.friendly?"rgba(150,200,255,.9)":"rgba(255,170,140,.95)",i.beginPath(),i.arc(d,g,u.kind==="ship"?2.6:1.4,0,Math.PI*2),i.fill()}i.strokeStyle="rgba(240,235,210,.95)",i.beginPath();const h=a.heading*ll;i.moveTo(o,o),i.lineTo(o+Math.sin(h)*10,o-Math.cos(h)*10),i.stroke()}dispose(){this.el.remove()}}const Ru=()=>new Promise(n=>setTimeout(n,0));class N2{constructor(t){var e;this.app=t,this.name="box",this.scene=new Uo,this.camera=new dn(42,innerWidth/Math.max(1,innerHeight),nn.near,nn.far),this.ready=!1,this.sim=null,this.battle=null,this.ground=null,this.rig=null,this.hud=null,this.aid="standard",this.time=0,this.lowQuality=!!t.software||((e=matchMedia==null?void 0:matchMedia("(pointer: coarse)"))==null?void 0:e.matches)}async load(t,e,i,{pack:s=null}={}){var a;const o=this.app;this.box=t,this.battleData=e,this.kits=i,this.clock=e!=null&&e.clock?new Ld(e.clock):null,s||(s={...t.pack,data:await o.decoder.decode(t.pack)});const r=((a=t.proj)==null?void 0:a.unit)??nn.unit;return this.ground=new Nb(o,s,{exaggeration:t.exaggeration??nn.exaggeration,unit:r}),this.scene.add(this.ground.group),this.ocean=new Lb({...o.light.uniforms,...this.ground.uniforms},{unit:r}),this.ocean.setWeather(e==null?void 0:e.weather),this.scene.add(this.ocean.mesh),this.rig=new Ud(this.camera,o.canvas,this.ground,nn),this.cameras=new P2(this),this.atlas=h2(),this.hud=new F2(this),await Ru(),this}async setSim(t){var o,r;this.sim=t;const e=this.app,i=t.clock.utc(0),s=new Map((Array.isArray((o=this.kits)==null?void 0:o.weapons)?this.kits.weapons:[]).map(a=>[a.id,a]));for(this.units&&(this.scene.remove(this.units.group),this.units.dispose()),this.effects&&(this.scene.remove(this.effects.group),this.effects.dispose()),this.weather&&(this.scene.remove(this.weather.group),this.weather.dispose()),this.units=new y2(e.light.uniforms,t,{colourDate:i,weapons:s,atlas:this.atlas}),this.effects=new E2(e.light.uniforms,t,{lowQuality:this.lowQuality}),this.weather=new k2(e.light.uniforms,((r=this.battleData)==null?void 0:r.weather)||{},this.ground.bounds,t.record.squalls,{lowQuality:this.lowQuality}),this.scene.add(this.units.group,this.effects.group,this.weather.group);!this.units.buildSome(2);)await Ru();return this.ready=!0,this}get skyPlace(){var t,e,i,s;return{lat:((t=this.box.proj)==null?void 0:t.lat0)??((e=this.box.projection)==null?void 0:e.lat0)??0,lon:((i=this.box.proj)==null?void 0:i.lon0)??((s=this.box.projection)==null?void 0:s.lon0)??0}}skyInstant(){return this.sim?this.sim.clock.utc(this.sim.t):this.clock?this.clock.utc(0):Date.UTC(1942,5,4,22)}fog(){var s,o;const t=((s=this.battleData)==null?void 0:s.weather)||{},e=t.visibilityM||4e4,i=((o=t.cloud)==null?void 0:o.baseM)||1500;return{density:.6*3.912/e,falloff:1/i}}setCamera(t,e={}){this.cameras.set(t,e)}get cameraMode(){var t;return((t=this.cameras)==null?void 0:t.mode)??"free"}update(t){var r,a,l;const e=this.app;this.time+=t;const i=this.battle??e.battle;i!=null&&i.tick&&i.tick(t);const s=this.sim;if((r=this.cameras)==null||r.update(t),this.ground.update(this.camera),this.ocean.update(this.camera),!s||!this.ready)return;const o=((l=(a=e.renderer)==null?void 0:a.domElement)==null?void 0:l.clientHeight)||innerHeight;this.effects.drain(s,s.t),this.units.update(this.camera,o,this.time),this.effects.update(this.camera,o,s.t,t*(i!=null&&i.running?i.timeScale:0),e.light),this.weather.update(this.camera,s.t),this.hud.update(t)}settle(){this.rig.finishFlight(),this.ground.update(this.camera)}setRange(t){var e;(e=this.ground)==null||e.setRange(t)}materials(){const t=new Set;return this.scene.traverse(e=>{if(e.material)for(const i of[].concat(e.material))t.add(i)}),[...t]}stats(){var i;const t=this.sim;let e=0;if(t)for(let s=0;s<t.capacity;s++)t.state.alive[s]&&e++;return{scene:"box",box:(i=this.box)==null?void 0:i.id,...this.ground?this.ground.stats():{},t:t?t.clock.label(t.t,{seconds:!0}):null,units:e,projectiles:(t==null?void 0:t.projectiles.count)??0,particles:this.effects?this.effects.alpha.list.length+this.effects.add.list.length:0,camera:this.cameraMode,distance:this.rig?+this.rig.state.distance.toFixed(1):null}}dispose(){var t,e,i,s,o,r,a,l,c;(t=this.rig)==null||t.dispose(),(e=this.ground)==null||e.dispose(),(i=this.ocean)==null||i.dispose(),(s=this.units)==null||s.dispose(),(o=this.effects)==null||o.dispose(),(r=this.weather)==null||r.dispose(),(a=this.hud)==null||a.dispose(),(c=(l=this.atlas)==null?void 0:l.texture)==null||c.dispose(),this.scene.clear(),this.ready=!1}}const Lu={pitchUp:["KeyS","ArrowDown"],pitchDown:["KeyW","ArrowUp"],rollLeft:["KeyA","ArrowLeft"],rollRight:["KeyD","ArrowRight"],yawLeft:["KeyQ"],yawRight:["KeyE"],throttleUp:["KeyR","PageUp"],throttleDown:["KeyF","PageDown"],guns:["Space"],bomb:["KeyB"],torpedo:["KeyT"],camera:["KeyC"],sight:["KeyV"],time:["KeyZ"],direct:["KeyM"],units:["KeyU"],release:["Backspace"]},O2={helmPort:["KeyA","ArrowLeft"],helmStarboard:["KeyD","ArrowRight"],telegraphUp:["KeyW","ArrowUp"],telegraphDown:["KeyS","ArrowDown"],torpedo:["KeyT"],spread:["KeyG"],aa:["Space"],starshell:["KeyL"],battery:["KeyX"],camera:["KeyC"],zoom:["KeyZ"],faster:["Equal","NumpadAdd"],slower:["Minus","NumpadSubtract"],units:["KeyU"],release:["Backspace"]},B2=`Mouse: the nose follows the pointer (M or right button: direct control)
W/S pitch · A/D roll · Q/E rudder · R/F throttle
Space or left button: guns · B bomb · T torpedo
C camera · V sight · Z time · U units · Backspace: release the controls`,H2=`A/D helm (it stays until countered) · W/S telegraph
Mouse lays the main battery; wheel ±100 m (Shift ±400 m); click: salvo, hold: fire when ready
T torpedoes · G narrow/wide spread · Space: the AA at the pointer's aircraft · L star shell
X battery · C camera · Z zoom · +/− time · U units · Backspace: release the controls`,G2="Left: the stick (or the helm and telegraph) · right: fire and ordnance · the buttons: camera and time · release, twice: the controls back",po=[-1,-.5,0,.5,1],mo=[-1,0,1/3/1.05,2/3/1.05,.85/1.05,1/1.05,1],ve=(n,t,e)=>(n[t]||[]).includes(e),$2=`
.pt-touch { position: fixed; inset: 0; pointer-events: none; z-index: 30; font: 12px Inter, system-ui, sans-serif; color: #eee; }
.pt-touch .pad { position: absolute; pointer-events: auto; touch-action: none; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.25); }
.pt-touch .knob { position: absolute; width: 48px; height: 48px; margin: -24px 0 0 -24px; border-radius: 50%; background: rgba(255,255,255,.35); left: 50%; top: 50%; }
.pt-touch .btn { position: absolute; pointer-events: auto; touch-action: none; min-width: 56px; min-height: 56px; border-radius: 28px; background: rgba(20,24,28,.55); border: 1px solid rgba(255,255,255,.3); display: flex; align-items: center; justify-content: center; user-select: none; }
.pt-touch .btn.on { background: rgba(240,200,120,.45); }
.pt-touch .slider { position: absolute; pointer-events: auto; touch-action: none; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.25); border-radius: 24px; }
.pt-touch .slider .knob { left: 50%; top: 50%; }
`;class V2{constructor(t){if(this.input=t,this.active=!1,this.stick={x:0,y:0,id:null},!document.getElementById("pt-touch-style")){const s=document.createElement("style");s.id="pt-touch-style",s.textContent=$2,document.head.appendChild(s)}const e=document.createElement("div");e.className="pt-touch",document.body.appendChild(e),this.el=e,this.ac=new AbortController;const i=t.player;(i==null?void 0:i.kind)==="aircraft"?this.buildAircraft():this.buildShip()}btn(t,e,i,s=null){const o=document.createElement("div");o.className="btn",o.textContent=t,Object.assign(o.style,e);const r={signal:this.ac.signal};return o.addEventListener("pointerdown",a=>{a.preventDefault();try{o.setPointerCapture(a.pointerId)}catch{}o.classList.add("on"),i()},r),o.addEventListener("pointerup",()=>{o.classList.remove("on"),s==null||s()},r),this.el.appendChild(o),o}slider(t,e,i,s,o){const r=document.createElement("div");r.className="slider",Object.assign(r.style,t);const a=document.createElement("div");a.className="knob",r.appendChild(a),this.el.appendChild(r);const l={signal:this.ac.signal},c=()=>{const u=s(),f=i.reduce((g,x,m)=>Math.abs(x-u)<Math.abs(i[g]-u)?m:g,0),d=i.length>1?f/(i.length-1):.5;e?a.style.top=`${(1-d)*100}%`:a.style.left=`${d*100}%`},h=u=>{const f=r.getBoundingClientRect(),d=e?1-(u.clientY-f.top)/f.height:(u.clientX-f.left)/f.width,g=Math.round(Math.max(0,Math.min(1,d))*(i.length-1));o(i[g]),c()};return r.addEventListener("pointerdown",u=>{u.preventDefault();try{r.setPointerCapture(u.pointerId)}catch{}h(u)},l),r.addEventListener("pointermove",u=>{u.buttons&&h(u)},l),c(),{el:r,place:c}}buildAircraft(){const t=()=>{var r;return(r=this.input.player)==null?void 0:r.input},e=document.createElement("div");e.className="pad",Object.assign(e.style,{left:"24px",bottom:"24px",width:"150px",height:"150px"});const i=document.createElement("div");i.className="knob",e.appendChild(i),this.el.appendChild(e);const s={signal:this.ac.signal},o=r=>{const a=e.getBoundingClientRect(),l=Math.max(-1,Math.min(1,(r.clientX-a.left)/a.width*2-1)),c=Math.max(-1,Math.min(1,(r.clientY-a.top)/a.height*2-1));this.stick.x=l,this.stick.y=c,i.style.left=`${50+l*50}%`,i.style.top=`${50+c*50}%`};e.addEventListener("pointerdown",r=>{r.preventDefault();try{e.setPointerCapture(r.pointerId)}catch{}this.stick.id=r.pointerId,this.active=!0,o(r)},s),e.addEventListener("pointermove",r=>{this.stick.id===r.pointerId&&o(r)},s),e.addEventListener("pointerup",()=>{this.stick.id=null,this.stick.x=0,this.stick.y=0,i.style.left="50%",i.style.top="50%"},s),this.slider({left:"190px",bottom:"24px",width:"48px",height:"150px"},!0,[0,.25,.5,.75,1],()=>{var r;return((r=t())==null?void 0:r.throttle)??.8},r=>t()&&(t().throttle=r)),this.btn("fire",{right:"24px",bottom:"96px"},()=>t()&&(t().fireHeld=!0),()=>t()&&(t().fireHeld=!1)),this.btn("bomb",{right:"96px",bottom:"24px"},()=>t()&&t().bombCount++),this.btn("torp",{right:"24px",bottom:"24px"},()=>t()&&t().torpedoCount++),this.btn("cam",{right:"24px",top:"210px"},()=>{var r,a;return(a=(r=this.input.battle).cycleCamera)==null?void 0:a.call(r)}),this.btn("time",{right:"96px",top:"210px"},()=>{var r,a;return(a=(r=this.input.battle).cycleTime)==null?void 0:a.call(r)}),this.releaseButton()}releaseButton(){this.btn("release",{left:"14px",top:"64px",padding:"0 12px"},()=>this.input.askRelease("Tap release"))}buildShip(){const t=()=>{var e;return(e=this.input.player)==null?void 0:e.input};this.helm=this.slider({left:"24px",bottom:"24px",width:"220px",height:"48px"},!1,po,()=>{var e;return((e=t())==null?void 0:e.helm)??0},e=>t()&&(t().helm=e)),this.tel=this.slider({left:"24px",bottom:"90px",width:"48px",height:"200px"},!0,mo,()=>{var e;return((e=t())==null?void 0:e.telegraph)??0},e=>t()&&(t().telegraph=e)),this.btn("salvo",{right:"24px",bottom:"24px",minWidth:"72px",minHeight:"72px"},()=>t()&&t().salvoCount++),this.btn("torp",{right:"110px",bottom:"24px"},()=>t()&&t().torpedoCount++),this.btn("AA",{right:"24px",bottom:"110px"},()=>{const e=t();e&&(e.aa=!0,e.aaTarget=-1,e.aaDir=null,setTimeout(()=>e.aa=!1,150))}),this.btn("cam",{right:"24px",top:"210px"},()=>{var e,i;return(i=(e=this.input.battle).cycleCamera)==null?void 0:i.call(e)}),this.btn("time",{right:"96px",top:"210px"},()=>{var e,i;return(i=(e=this.input.battle).cycleTime)==null?void 0:i.call(e)}),this.releaseButton(),this.active=!0}update(){const t=this.input.player;if(!t||t.kind!=="aircraft")return;const e=t.state,i=t.input,o=this.stick.x*60-(e.roll??0);i.roll=Math.max(-1,Math.min(1,o/25));const r=Math.abs((e.roll??0)*(Math.PI/180)),a=1/Math.max(.5,Math.cos(r))-1;i.pitch=Math.max(-1,Math.min(1,a*.4-this.stick.y*.8-(e.pitch??0)*.01)),i.mode="direct",i.aimDir=null}dispose(){this.ac.abort(),this.el.remove()}}const _a=Math.PI/180;class W2{constructor(t,e){this.app=t,this.battle=e,this.held=new Set,this.ac=new AbortController,this.pointer={x:innerWidth/2,y:innerHeight/2,inside:!1},this.lock=!1,this.aim={yaw:0,pitch:0,init:!1},this.direct=!1,this.rightHeld=!1,this.leftDownAt=0,this.leftHeld=!1,this.ladder=0,this.confirmRelease=0,this.ray=new Ed,this.v=new qt,this.touch=null,this.bind()}get player(){var t;return((t=this.battle.sim)==null?void 0:t.player)??null}get live(){const t=this.player;return this.app.mode==="moment"&&t&&!t.scripted}bind(){var i;const t={signal:this.ac.signal},e=this.app.canvas;addEventListener("keydown",s=>this.key(s,!0),{...t,capture:!0}),addEventListener("keyup",s=>this.key(s,!1),{...t,capture:!0}),addEventListener("blur",()=>this.held.clear(),t),e.addEventListener("pointermove",s=>this.move(s),t),e.addEventListener("pointerdown",s=>this.down(s),t),addEventListener("pointerup",s=>this.up(s),t),e.addEventListener("wheel",s=>this.wheel(s),{...t,passive:!1}),e.addEventListener("contextmenu",s=>{this.live&&s.preventDefault()},t),document.addEventListener("pointerlockchange",()=>{var o,r;const s=this.lock;this.lock=document.pointerLockElement===e,s&&!this.lock&&this.live&&this.battle.running&&((r=(o=this.battle).pauseForRelease)==null||r.call(o))},t),e.addEventListener("touchstart",()=>this.ensureTouch(),{...t,passive:!0}),(i=matchMedia==null?void 0:matchMedia("(pointer: coarse)"))!=null&&i.matches&&this.ensureTouch()}ensureTouch(){this.touch||!this.live||(this.touch=new V2(this))}requestLock(){var t,e,i,s;if(!((t=matchMedia==null?void 0:matchMedia("(pointer: coarse)"))!=null&&t.matches))try{const o=(i=(e=this.app.canvas).requestPointerLock)==null?void 0:i.call(e);(s=o==null?void 0:o.then)==null||s.call(o,()=>{var r;this.ac.signal.aborted&&document.pointerLockElement===this.app.canvas&&((r=document.exitPointerLock)==null||r.call(document))},()=>{})}catch{}}key(t,e){var c,h,u,f,d,g,x,m,p,y,v,M,S,T,A,k;if(this.app.mode==="moment"&&(t.code==="Enter"||t.code==="NumpadEnter")&&t.preventDefault(),!this.live)return;const i=this.player,s=t.code,o=i.kind==="aircraft"?Lu:O2;if(!Object.values(o).some(_=>_.includes(s))||(t.preventDefault(),t.stopPropagation(),e&&t.repeat&&!["KeyR","KeyF","PageUp","PageDown"].includes(s)))return;if(e?this.held.add(s):this.held.delete(s),!e){i.kind==="aircraft"&&ve(o,"guns",s)&&(i.input.fireHeld=this.leftHeld);return}const a=i.input,l=(c=this.battle.scene)==null?void 0:c.hud;if(ve(o,"release",s))return this.askRelease("Backspace");if(ve(o,"units",s))return l==null?void 0:l.toggleUnits();if(ve(o,"camera",s))return(u=(h=this.battle).cycleCamera)==null?void 0:u.call(h);if(i.kind==="aircraft")ve(o,"guns",s)?a.fireHeld=!0:ve(o,"bomb",s)?a.bombCount++:ve(o,"torpedo",s)?a.torpedoCount++:ve(o,"sight",s)?(d=(f=this.battle).toggleSight)==null||d.call(f):ve(o,"time",s)?(x=(g=this.battle).cycleTime)==null||x.call(g):ve(o,"direct",s)&&(this.direct=!this.direct,l==null||l.say(this.direct?"Direct control":"Mouse aim",1.5));else if(ve(o,"helmPort",s)||ve(o,"helmStarboard",s)){const _=ve(o,"helmPort",s)?-1:1,w=po.reduce((C,F,z)=>Math.abs(F-a.helm)<Math.abs(po[C]-a.helm)?z:C,0);a.helm=po[Math.max(0,Math.min(po.length-1,w+_))]}else if(ve(o,"telegraphUp",s)||ve(o,"telegraphDown",s)){const _=ve(o,"telegraphUp",s)?1:-1,w=mo.reduce((C,F,z)=>Math.abs(F-a.telegraph)<Math.abs(mo[C]-a.telegraph)?z:C,0);a.telegraph=mo[Math.max(0,Math.min(mo.length-1,w+_))]}else if(ve(o,"torpedo",s))a.torpedoCount++;else if(ve(o,"spread",s))a.spread=a.spread==="wide"?"narrow":"wide",l==null||l.say(`${a.spread} spread`,1.5);else if(ve(o,"aa",s))a.aa=!0,a.aaDir=this.pointerRay(),setTimeout(()=>a.aa=!1,120);else if(ve(o,"starshell",s))a.starshellCount++;else if(ve(o,"battery",s)){const _=((y=(p=(m=this.battle.sim)==null?void 0:m._X[i.unitIndex])==null?void 0:p.guns)==null?void 0:y.length)??1;a.battery=((a.battery|0)+1)%Math.max(1,_),l==null||l.say(`battery ${a.battery+1}`,1.5)}else if(ve(o,"zoom",s)){const _=(M=(v=this.battle.scene)==null?void 0:v.cameras)==null?void 0:M.cycleZoom();l==null||l.say(`${_}×`,1)}else ve(o,"faster",s)?(T=(S=this.battle).cycleTime)==null||T.call(S,1):ve(o,"slower",s)&&((k=(A=this.battle).cycleTime)==null||k.call(A,-1))}askRelease(t){var i,s;const e=performance.now();e-this.confirmRelease<3e3?(this.confirmRelease=0,this.battle.release()):(this.confirmRelease=e,(s=(i=this.battle.scene)==null?void 0:i.hud)==null||s.say(`${t} again to release the controls`,3))}move(t){var i;if(this.pointer.x=t.clientX,this.pointer.y=t.clientY,this.pointer.inside=!0,!this.live)return;const e=this.player;this.lock&&e.kind==="aircraft"&&(this.aim.yaw+=t.movementX*.0025,this.aim.pitch=Math.max(-1.5,Math.min(1.5,this.aim.pitch-t.movementY*.0025))),this.lock&&e.kind==="ship"&&((i=this.battle.scene)!=null&&i.cameras)&&this.battle.scene.cameras.addLook(t.movementX*.002,-t.movementY*.002)}down(t){if(!this.live)return;const e=this.player;if(t.button===2){this.rightHeld=!0;return}t.button===0&&(this.leftHeld=!0,this.leftDownAt=performance.now(),e.kind==="aircraft"?e.input.fireHeld=!0:(e.input.salvoCount++,this.ladder=0))}up(t){if(t.button===2&&(this.rightHeld=!1),t.button!==0)return;this.leftHeld=!1;const e=this.player;e&&(e.kind==="aircraft"?e.input.fireHeld=this.held.has("Space"):e.input.fireHeld=!1)}wheel(t){if(!this.live||this.player.kind!=="ship")return;t.preventDefault();const i=t.shiftKey?400:100;this.ladder+=t.deltaY<0?i:-i}pointerRay(){var o;const t=(o=this.battle.scene)==null?void 0:o.camera;if(!t)return[0,0,-1];const e=this.lock?0:this.pointer.x/innerWidth*2-1,i=this.lock?0:-(this.pointer.y/innerHeight)*2+1;this.v.set(e,i),this.ray.setFromCamera(this.v,t);const s=this.ray.ray.direction;return[s.x,s.y,s.z]}update(t){var o,r,a;if(!this.live)return;const e=this.player,i=e.input,s=l=>l.some(c=>this.held.has(c));if(this.touch&&this.touch.update(t),e.kind==="aircraft"){const l=Lu,c=e.state,h=(s(l.pitchUp)?1:0)-(s(l.pitchDown)?1:0),u=(s(l.rollRight)?1:0)-(s(l.rollLeft)?1:0),f=this.direct||this.rightHeld||h!==0||u!==0||((o=this.touch)==null?void 0:o.active);if((r=this.touch)!=null&&r.active||(i.pitch=h,i.roll=u),i.yaw=(s(l.yawRight)?1:0)-(s(l.yawLeft)?1:0),s(l.throttleUp)&&(i.throttle=Math.min(1,i.throttle+t*.5)),s(l.throttleDown)&&(i.throttle=Math.max(0,i.throttle-t*.5)),f)i.mode="direct",i.aimDir=null,this.aim.init=!1;else if(i.mode="aim",this.lock){this.aim.init||(this.aim.yaw=(c.heading??0)*_a,this.aim.pitch=(c.pitch??0)*_a,this.aim.init=!0);const d=Math.cos(this.aim.pitch);i.aimDir=[Math.sin(this.aim.yaw)*d,Math.sin(this.aim.pitch),-Math.cos(this.aim.yaw)*d]}else this.pointer.inside&&(i.aimDir=this.pointerRay())}else{const l=(a=this.battle.scene)==null?void 0:a.camera;if(l&&(this.pointer.inside||this.lock)){const c=this.pointerRay(),h=this.battle.sim.state,u=e.unitIndex;if(c[1]<-1e-4){const f=-l.position.y/c[1],d=l.position.x+c[0]*f,g=l.position.z+c[2]*f,x=d-h.pos[3*u],m=g-h.pos[3*u+2];i.aimAz=(Math.atan2(x,-m)/_a+360)%360,i.aimRange=Math.max(500,Math.hypot(x,m)+this.ladder)}else i.aimAz=(Math.atan2(c[0],-c[2])/_a+360)%360,i.aimRange=Math.max(500,i.aimRange??1e4)}i.fireHeld=this.leftHeld&&performance.now()-this.leftDownAt>400}}dispose(){var t,e;this.ac.abort(),(t=this.touch)==null||t.dispose(),document.pointerLockElement===this.app.canvas&&((e=document.exitPointerLock)==null||e.call(document))}}const fo=(...n)=>console.info("[battle]",...n),j2=[1,2,4,8,15,30,60];class X2{constructor(t){this.app=t,this.ready=!1,this.scene=null,this.sim=null,this.running=!1,this.timeScale=1,this.loaded=null,this.input=null,this.momentId=null,this.aid="standard",this._state=null,this._moment=null,this._question=null,this._keys=new AbortController}get state(){return this._state?{...this._state,t:this.sim?this.sim.t:this._state.t,mode:this.input?"moment":"watch",momentId:this.momentId??this._state.momentId}:null}async enter(t,{t:e=null,momentId:i=null,from:s="table"}={}){var g,x,m;const o=this.app,r=o.data.boxById.get(t);if(!r)throw new Error(`no box “${t}” in boxes/manifest.json`);this.scene&&await this.leave(),fo("enter",t,{t:e,momentId:i,from:s}),this.ready=!1,this.momentId=i;const a=o.table&&typeof o.table.flyTo=="function"?o.table:null,l=a?a.rig.pose():null;let c;const h=new Promise(p=>c=p);this._abort=()=>c("aborted");const u=(async()=>{var k,_,w,C;const p=await(((k=o.takePrefetch)==null?void 0:k.call(o,t))??o.data.loadBox(t,{decoder:o.decoder,warn:o.warn}));if(!o.data.kits.weapons)try{const F=await fetch(o.data.abs("kits/weapons.json"));o.data.kits.weapons=F.ok?await F.json():[],F.ok||(_=o.warn)==null||_.call(o,`kits/weapons.json: HTTP ${F.status}; guns fly on the kits' own numbers`)}catch(F){o.data.kits.weapons=[],(w=o.warn)==null||w.call(o,`kits/weapons.json: ${F.message}`)}this.loaded=p;const{battle:y,kits:v,pack:M}=p;if(!y)throw new Error(`box ${t} has no battle.json`);const S=Mu(y,v,{seed:i??"",warn:o.warn,ground:M,proj:r.proj,exaggeration:r.exaggeration}),T=e!=null?S.clock.clamp(S.clock.parse(e)):(C=y.stops)!=null&&C.length?S.clock.clamp(S.clock.parse(y.stops[0].t)):0;S.setTime(T),this.sim=S;const A=new N2(o);return A.battle=this,A.aid=this.aid,await A.load(r,y,v,{pack:M}),await A.setSim(S),this.scene=A,this.ready=!0,p})();if(a&&s==="table"){o.setMode("flying"),(g=a.outline)==null||g.call(a,t,!0);const p=(x=a.outlineView)==null?void 0:x.call(a,t);if(p&&await Promise.race([a.flyTo(p,{duration:2.5,ready:()=>this.ready}),h])==="aborted")return this.abandon(t,u,l)}else o.setMode("flying");if(await Promise.race([u,h])==="aborted")return this.abandon(t,u,l);this._abort=null;const f=this.scene,d=this.sim;return await o.cut(()=>{var p;o.setActive(f),a&&s==="table"?f.rig.jump(sc(a.rig.pose(),r.placement)):this.lookAtStop(this.stopAt(d.t),{jump:!0}),(p=o.resize)==null||p.call(o)}),o.setMode("watch"),this.running=!0,this.timeScale=1,this._state={boxId:t,t:d.t,momentId:i,mode:"watch"},this.bindWatchKeys(),(m=o.events)==null||m.dispatchEvent(new CustomEvent("battle",{detail:{kind:"enter",boxId:t}})),fo("in",t,`${d.clock.dateLabel(d.t)} ${d.clock.label(d.t)}`,`${d.capacity} slots`,f.stats()),this.state}abort(){var t;(t=this._abort)==null||t.call(this)}async abandon(t,e,i){var o,r,a;const s=this.app;return this._abort=null,fo("abort",t),(r=(o=s.table)==null?void 0:o.outline)==null||r.call(o,t,!1),i&&s.table&&s.table.rig.flyTo({target:i.target,distance:i.distance,yaw:i.yaw,pitch:i.pitch},1.4),s.setMode("table"),e.then(()=>{this.scene&&s.active!==this.scene&&(this.scene.dispose(),this.scene=null,this.sim=null,this.loaded=null,this.ready=!1)},()=>{}),(a=s.events)==null||a.dispatchEvent(new CustomEvent("battle",{detail:{kind:"abort",boxId:t}})),null}stopAt(t){var s;const e=((s=this.sim)==null?void 0:s.record.stops)||[];let i=e[0]||null;for(const o of e)o.t<=t+1e-6&&(i=o);return i}async preview(){if(!this.scene)throw new Error("preview() comes after enter()");return this.app.active!==this.scene&&await this.app.cut(()=>this.app.setActive(this.scene)),this.app.setMode(this.input?"moment":"watch"),this.scene}lookAtStop(t,{jump:e=!1}={}){const i=this.scene,s=this.sim;if(!i)return;let o=null,r=-1;const a=t==null?void 0:t.camera;if((a==null?void 0:a.target)!=null){if(typeof a.target=="string"){const c=s.record.shipById.get(a.target);c&&(r=c.slot,o={x:s.state.pos[3*c.slot],z:s.state.pos[3*c.slot+2]})}else if(Array.isArray(a.target)){const[c,h]=s.proj.toWorld(a.target);o={x:c,z:h}}}if(!o){let c=0,h=0,u=0;for(let f=0;f<s.capacity;f++)s.state.alive[f]!==1||s.units[f].kind!=="ship"||(h+=s.state.pos[3*f],u+=s.state.pos[3*f+2],c++);o=c?{x:h/c,z:u/c}:{x:0,z:0}}const l={target:o,distance:(a==null?void 0:a.distanceM)??9e3,yaw:Math.PI-((a==null?void 0:a.bearingDeg)??200)*Math.PI/180,pitch:(a==null?void 0:a.pitch)??.45};e?(i.cameras.set("free"),i.rig.jump(l)):r>=0?i.setCamera("orbit",{unitIndex:r,bearing:a==null?void 0:a.bearingDeg,pitch:a==null?void 0:a.pitch,distance:a==null?void 0:a.distanceM}):i.setCamera("free",{target:o,bearing:a==null?void 0:a.bearingDeg,pitch:a==null?void 0:a.pitch,distance:a==null?void 0:a.distanceM})}tick(t){var s,o,r,a;const e=this.sim;if(!e||((s=this.input)==null||s.update(t),!this.running))return;const i=e.momentState;i&&!i.done&&this.input&&e.threat&&this.timeScale>i.timeScale&&(this.timeScale=i.timeScale,(o=this.scene)==null||o.hud.say(`${e.threatWhy}: back to ×${i.timeScale}`,2)),e.advance(Math.min(.1,t)*this.timeScale),i&&this.input&&(i.checkpoint&&!this._checkpointSeen&&(this._checkpointSeen=!0,this.running=!1,(r=this.scene)==null||r.hud.say("Checkpoint · Enter: keep going · Backspace twice: the card",30),(a=this.app.events)==null||a.dispatchEvent(new CustomEvent("battle",{detail:{kind:"checkpoint",momentId:i.id}}))),i.done&&this.finish(i.reason)),e.t>=e.clock.duration&&(this.running=!1)}watch(){var t;this.input&&this.release(),this.app.setMode("watch"),(t=this.scene)==null||t.setCamera("free")}scrub(t,{answer:e=null,stop:i=null}={}){var r;const s=this.sim;if(!s)return;const o=s.clock.clamp(s.clock.parse(t));return s.diverged?e==="yes"?(this.rebuild(o),!0):e==="no"?(o>s.t&&s.setTime(o),!1):(this._question={t:o,stop:i},(r=this.scene)==null||r.hud.say("Return to the record at that time? Y: yes · N: play on",20),null):(s.setTime(o),!0)}rebuild(t,e=this.momentId??""){const i=this.app,{battle:s,kits:o,pack:r,box:a}=this.loaded;this.input&&this.release();const l=Mu(s,o,{seed:e,warn:i.warn,ground:r,proj:a.proj,exaggeration:a.exaggeration});return l.setTime(t),this.sim=l,this.scene.setSim(l),this.scene.hud.beatIndex=l.beats.length,l}play(t=this.timeScale){var s;const e=(s=this.sim)==null?void 0:s.momentState,i=this.input&&e&&!e.done?this.maxScale():60;this.timeScale=Math.max(1,Math.min(i,t)),this.running=!0}pause(){this.running=!1}maxScale(){var i,s;const t=(i=this.sim)==null?void 0:i.momentState;return t?((s=this.sim.player)==null?void 0:s.kind)==="aircraft"&&t.checkpoint?32:t.maxTimeScale:60}cycleTime(t=1){var r,a;const e=(r=this.sim)==null?void 0:r.momentState,i=this.input&&e?[e.timeScale,e.timeScale*2,4,8,16,32].filter((l,c,h)=>l>=e.timeScale&&l<=this.maxScale()&&h.indexOf(l)===c).sort((l,c)=>l-c):j2,s=i.findIndex(l=>l>=this.timeScale),o=t>0?(s+1)%i.length:(s-1+i.length)%i.length;return this.timeScale=i[Math.max(0,o)],(a=this.scene)==null||a.hud.say(`×${this.timeScale}`,1),this.timeScale}cycleCamera(){var r;const t=this.scene,e=(r=this.sim)==null?void 0:r.player;if(!t)return;const i=(e==null?void 0:e.unitIndex)??t.cameras.unit,s=(e==null?void 0:e.kind)==="ship"?["bridge","director","chase","orbit"]:["chase","sight","orbit"],o=s.indexOf(t.cameraMode);t.setCamera(s[(o+1)%s.length],{unitIndex:i,distance:(e==null?void 0:e.kind)==="ship"?1500:300})}toggleSight(){var i;const t=this.scene,e=(i=this.sim)==null?void 0:i.player;!t||!e||t.setCamera(t.cameraMode==="sight"?"chase":"sight",{unitIndex:e.unitIndex})}setAid(t){this.aid=t,this.sim&&(this.sim.aid=t),this.scene&&(this.scene.aid=t)}takeMoment(t,{scripted:e=!1,atCheckpoint:i=!1}={}){var f,d,g,x;const s=this.app;let o=this.sim;if(!o)throw new Error("takeMoment() comes after enter()");const r=o.record.moments.get(t);if(!r)throw new Error(`no moment “${t}” in this box`);this.input&&this.release(),this.momentId=t,o.diverged?o=this.rebuild(r.t,t):!i&&o.t!==r.t&&o.setTime(r.t);const a=o.startMoment(t,{atCheckpoint:i});a.scripted=e,this._checkpointSeen=i;const l=this.scene,c=(f=r.objective)==null?void 0:f.kind,h=a.kind==="aircraft"?"chase":c==="gunnery"?"director":"bridge";l.setCamera(h,{unitIndex:a.unitIndex,zoom:c==="gunnery"?4:1}),s.setMode("moment"),this.input=new W2(s,this),!e&&a.kind==="aircraft"&&this.input.requestLock(),this.timeScale=o.momentState.timeScale,this.running=!0;const u=(d=matchMedia==null?void 0:matchMedia("(pointer: coarse)"))==null?void 0:d.matches;return l.hud.showKeys(u?G2:a.kind==="aircraft"?B2:H2,3),(g=r.objective)!=null&&g.text&&l.hud.say(r.objective.text,5),u&&this.aid==="standard"&&this.setAid("guided"),(x=this.app.events)==null||x.dispatchEvent(new CustomEvent("battle",{detail:{kind:"moment",momentId:t}})),fo("moment",t,a.kind,o.units[a.unitIndex].name,o.clock.label(o.t)),new Promise(m=>{this._moment={id:t,resolve:m}})}keepGoing(){var t,e;(t=this.sim)!=null&&t.momentState&&(this.running=!0,(e=this.scene)==null||e.hud.say("",0))}finish(t="card"){var r,a,l,c,h,u;const e=this.sim,i=this._moment;if(!e||!i)return null;this._moment=null;const s={score:e.score,outcome:e.outcome,reason:t,momentId:i.id,restart:((r=e.momentState)==null?void 0:r.restart)??null},o=((a=e.player)==null?void 0:a.kind)??((c=(l=e.record.moments.get(i.id))==null?void 0:l.role)==null?void 0:c.kind);return this.input&&this.releaseControls(),(h=this.scene)==null||h.hud.say(q2(e,t,o),6),(u=this.app.events)==null||u.dispatchEvent(new CustomEvent("battle",{detail:{kind:"after",...s}})),i.resolve(s),s}release(){if(this._moment)return this.finish("released");this.releaseControls()}releaseControls(){var i,s;const t=this.sim,e=((i=t==null?void 0:t.player)==null?void 0:i.unitIndex)??-1;(s=this.input)==null||s.dispose(),this.input=null,t==null||t.releaseControl(),this.app.setMode("watch"),this.scene&&e>=0&&this.scene.setCamera("orbit",{unitIndex:e,distance:1500}),this.timeScale<1&&(this.timeScale=1),this.running=!0}pauseForRelease(){var i,s;this.running=!1,(i=this.scene)==null||i.hud.say("Paused. Click to go on · Backspace twice releases the controls",30);const t=this.app.canvas,e=()=>{var o,r,a,l;this.running=!0,(o=this.scene)==null||o.hud.say("",0),((a=(r=this.sim)==null?void 0:r.player)==null?void 0:a.kind)==="aircraft"&&((l=this.input)==null||l.requestLock())};t.addEventListener("pointerdown",e,{once:!0,signal:(s=this.input)==null?void 0:s.ac.signal})}restart(t="start"){var s,o;const e=(s=this.sim)==null?void 0:s.record.moments.get(this.momentId);if(!e)return null;this.input&&this.releaseControls(),this._moment=null;const i=this.rebuild(e.t,this.momentId);if(t==="checkpoint"){const r=e.timeScale??(((o=e.role)==null?void 0:o.kind)==="aircraft"?1:2);return i.setTime(e.t+(e.durationS??180)*r),this.takeMoment(this.momentId,{atCheckpoint:!0})}return this.takeMoment(this.momentId)}bindWatchKeys(){this._keys.abort(),this._keys=new AbortController,addEventListener("keydown",t=>{var e,i,s,o,r;if(this.app.mode==="moment"&&t.code==="Enter"&&((i=(e=this.sim)==null?void 0:e.momentState)!=null&&i.checkpoint)&&!this.running){t.preventDefault(),this.keepGoing();return}if(!(this.app.mode!=="watch"||!this._question))if(t.code==="KeyY"||t.code==="Enter"){const a=this._question;this._question=null,this.scrub(a.t,{answer:"yes"}),(s=this.scene)==null||s.hud.say("",0),(o=this.app.events)==null||o.dispatchEvent(new CustomEvent("battle",{detail:{kind:"rebuilt",stop:a.stop}}))}else(t.code==="KeyN"||t.code==="Escape")&&(this._question=null,(r=this.scene)==null||r.hud.say("",0))},{signal:this._keys.signal})}async leave(){var o,r,a,l,c,h,u;const t=this.app,e=((o=this._state)==null?void 0:o.boxId)??((r=this.loaded)==null?void 0:r.box.id);fo("leave",e),this._moment&&this.finish("left"),this.input&&this.releaseControls();const i=this.scene,s=t.table&&t.table.rig?t.table:null;if(i){const f=(a=this.loaded)==null?void 0:a.box.placement;if(t.setMode("flying"),s&&f&&e&&s.outlineView){i.setCamera("free");const d=sc(s.outlineView(e),f);await Promise.race([new Promise(g=>i.rig.flyTo(d,2.2,{onDone:g})),new Promise(g=>setTimeout(g,3500))]),(c=(l=i.rig).finishFlight)==null||c.call(l)}await t.cut(()=>{s?(f&&t.table.rig.jump(Cf(i.rig.pose(),f)),t.setActive(t.table)):t.idle&&t.setActive(t.idle)}),t.active===i&&i.scene.remove(t.sky.group),i.dispose(),this.scene=null}e&&((h=s==null?void 0:s.outline)==null||h.call(s,e,!1)),this._keys.abort(),this.sim=null,this._state=null,this.loaded=null,this.ready=!1,this.running=!1,this.momentId=null,t.setMode("table"),(u=t.events)==null||u.dispatchEvent(new CustomEvent("battle",{detail:{kind:"leave",boxId:e}}))}}function q2(n,t,e){const s=n.score.hits.filter(r=>r.kind!=="near-miss").map(r=>`${r.name}: ${r.count} ${r.kind} hit${r.count>1?"s":""}`);return[{lost:e==="ship"?"The ship was lost.":"Did not return.",landed:"Landed.",ditched:"Ditched.",clock:"The battle clock has run out.",released:"",left:"",card:""}[t]??"",s.join(" · ")].filter(Boolean).join(" ")||"The sortie is over."}const ku=["table","flying","watch","moment"],bo=n=>String(n).padStart(2,"0");function K2(n,t){const[e,i,s]=n.label(0,{seconds:!0}).split(":").map(Number),o=Math.round(e*3600+i*60+s+t),r=Math.floor(o/3600),a=Math.floor(o%3600/60),l=o%60;return`${bo(r)}:${bo(a)}${l?`:${bo(l)}`:""}`}class Y2{constructor(t,e,{warn:i=console.warn}={}){var l,c;this.canvas=t,this.data=e,this.warn=i,this.params=new URLSearchParams(location.search);const s=new Md({canvas:t,antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!0});s.setClearColor(0,1),s.info.autoReset=!1,this.renderer=s,this.pipeline=new I1(s),this.events=new EventTarget;const o={sunDir:new j(0,1,0),sunColor:new Zt,skyColor:new Zt,groundColor:new Zt,moonDir:new j(0,-1,0),moonColor:new Zt,zenith:new Zt,horizon:new Zt,sunHorizon:new Zt,night:0};o.uniforms={uSunDir:{value:o.sunDir},uSunColor:{value:o.sunColor},uSkyColor:{value:o.skyColor},uGroundColor:{value:o.groundColor},uMoonDir:{value:o.moonDir},uMoonColor:{value:o.moonColor},uTime:{value:0},uSkyMap:{value:null},uPointPos:{value:Array.from({length:wl},()=>new Se(0,-1e9,0,1))},uPointCol:{value:Array.from({length:wl},()=>new j)},uPointCount:{value:0}},this.light=o,this.sky=new ey(Ps),o.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture;const r=e.chapters.length?e.chapters:[{id:"war",from:"1941-12-07",to:"1945-09-03"}];e.chapters.length||i("chapters.json: none; the clock runs over the war alone");const a=(c=(l=e.fronts)==null?void 0:l.manifest)==null?void 0:c.keyframes;this.clock=new P1(r,{prologueShare:hr.prologueShare,windowMinDays:hr.windowMinDays,windowMaxDays:hr.windowMaxDays,keyframes:a!=null&&a.length?a.map(h=>({id:h.id,date:h.date})):null}),this.decoder=new Vu(2,i),this.mode="table",this.ready=!1,this.table=null,this.battle=new X2(this),this.tour=null,this.ui=null,this.active=null,this.time=0,this.frames=0,this.updaters=[],this.url={kept:{},written:null,timer:0,battle:null,t:null,moment:null}}start(){this.table=new eM(this,this.data),this.setActive(this.table),this.setMode("table");const t=this.renderer.getContext(),e=t.getExtension("WEBGL_debug_renderer_info"),i=e?String(t.getParameter(e.UNMASKED_RENDERER_WEBGL)):"";this.gpu=i,this.software=/swiftshader|llvmpipe|software/i.test(i),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.software&&!this.params.has("msaa")&&this.pipeline.setSamples(0),this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.params.get("debug")&&this.table.ground.terrain.setDebug(Number(this.params.get("debug"))),this.resize(),addEventListener("resize",()=>this.resize()),addEventListener("hashchange",()=>{location.hash!==this.url.written&&this.fromUrl()}),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}setActive(t){var i,s,o;if(this.active===t)return;(i=this.active)==null||i.scene.remove(this.sky.group),this.active=t,t.scene.add(this.sky.group);const e=t.skyPlace;this.sky.setPlace(e.lat,e.lon),(o=t.setRange)==null||o.call(t,((s=this.qset)==null?void 0:s.range)??ur[2].range),this.sized&&this.resize()}setMode(t){var i;if(!ku.includes(t))throw new Error(`app.mode “${t}”: one of ${ku.join(", ")}`);this.mode=t,this.table&&(this.table.rig.enabled=t==="table");const e=(i=this.battle)==null?void 0:i.scene;e!=null&&e.rig&&(e.rig.enabled=t==="watch")}cut(t,{out:e=.25,back:i=.25}={}){return new Promise((s,o)=>{this._cut={phase:"out",t:0,out:e,back:i,fn:t,resolve:s,reject:o}})}stepCut(t){const e=this._cut;if(!e)return;e.t+=t;const i=this.pipeline.uniforms.uFade;if(e.phase==="out"){if(i.value=Math.min(1,e.t/e.out),e.t>=e.out){try{e.fn()}catch(s){return this._cut=null,i.value=0,e.reject(s)}e.phase="back",e.t=0}}else i.value=Math.max(0,1-e.t/e.back),e.t>=e.back&&(i.value=0,this._cut=null,e.resolve())}fromUrl(){var r;const t=new URLSearchParams(location.hash.replace(/^#/,"")),e={};for(const[a,l]of t)["date","cam","battle","t","moment"].includes(a)||(e[a]=l);this.url.kept=e;const i=t.get("date");if(i)try{this.clock.setDate(Ve(i))}catch(a){this.warn(`#date=${i}: ${a.message}`)}const s=t.get("cam"),o=t.get("battle")&&this.active===this.table;if(s&&!o){const a=s.split(",").map(Number);if(a.length===5&&a.every(Number.isFinite)){const[l,c,h,u,f]=a;this.active.rig.jump({x:l,z:c,distance:h,yaw:u,pitch:f})}else this.warn(`#cam=${s}: want x,z,distance,yaw,pitch`)}for(const a of["battle","t","moment"])this.url[a]=t.get(a);(r=this.urlBattle)==null||r.call(this,t)}pushUrl(){const t=this.hashNow();this.url.written=t,this.url.timer=.25,t!==location.hash&&history.pushState(history.state,"",`${location.pathname}${location.search}${t}`)}replaceUrl(){const t=this.hashNow();this.url.written=t,this.url.timer=.25,t!==location.hash&&history.replaceState(history.state,"",`${location.pathname}${location.search}${t}`)}prefetch(t){var i,s,o;if(!t||(i=this.battle)!=null&&i.scene||!((s=this.data.boxById)!=null&&s.has(t))||((o=this._prefetch)==null?void 0:o.id)===t)return;const e=this.data.loadBox(t,{decoder:this.decoder,warn:this.warn});e.catch(()=>{}),this._prefetch={id:t,p:e}}takePrefetch(t){const e=this._prefetch;return!e||e.id!==t?null:(this._prefetch=null,e.p)}hashNow(){var r;const t=new URLSearchParams,e=(r=this.battle)==null?void 0:r.sim,i=!!(e&&this.active===this.battle.scene);i&&(this.url.t=K2(e.clock,e.t));const s=new Date(this.clock.date);t.set("date",`${s.getUTCFullYear()}-${bo(s.getUTCMonth()+1)}-${bo(s.getUTCDate())}`);const o=this.active.rig.goal;t.set("cam",[o.target.x,o.target.z,o.distance,o.yaw,o.pitch].map(a=>(+a.toFixed(4)).toString()).join(","));for(const a of["battle","t","moment"])this.url[a]&&(a!=="t"||i)&&t.set(a,this.url[a]);for(const[a,l]of Object.entries(this.url.kept))t.set(a,l);return`#${t.toString().replace(/%2C/g,",").replace(/%3A/g,":")}`}syncUrl(t){if(!this.ready||this.mode==="flying"||(this.url.timer-=t,this.url.timer>0))return;this.url.timer=.25;const e=this.hashNow();if(e===this.url.written||e===location.hash){this.url.written=e;return}this.url.written=e,history.replaceState(history.state,"",`${location.pathname}${location.search}${e}`)}settle(){var t;if((t=this.ui)==null||t.settle(),this._cut){const e=this._cut;e.phase==="out"&&e.fn(),this._cut=null,this.pipeline.uniforms.uFade.value=0,e.resolve()}this.active.settle()}stats(){var e;const t=this.renderer.info;return{mode:this.mode,...this.active.stats(),frameMs:+(this.frameAvg??0).toFixed(1),calls:t.render.calls,triangles:t.render.triangles,textures:t.memory.textures,geometries:t.memory.geometries,programs:((e=t.programs)==null?void 0:e.length)??0,quality:this.quality.level,gpu:this.gpu}}applyQuality(){var e,i;const t=ur[Math.max(0,Math.min(ur.length-1,this.quality.level))];this.qset=t,(i=(e=this.active)==null?void 0:e.setRange)==null||i.call(e,t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}resize(){var s;this.sized=!0;const t=innerWidth,e=innerHeight,i=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(i),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,i);for(const o of[this.table,(s=this.battle)==null?void 0:s.scene])o&&(o.camera.aspect=t/e,o.camera.updateProjectionMatrix());this.sky.starUniforms.uPixel.value=i}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.frameAvg=this.frameAvg===void 0?e*1e3:this.frameAvg+(e*1e3-this.frameAvg)*.1,this.renderer.info.reset(),this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.stepCut(e),this.update(e),this.sky.renderMap(this.renderer),this.pipeline.render(this.active.scene,this.active.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.active,i=this.light;this.sky.update(e.skyInstant(),this.time,i),i.uniforms.uTime.value=this.time,e.update(this.camDt??t);for(const r of this.updaters)r(t,this.time);const s=this.pipeline.uniforms;s.uSunDir.value.copy(i.sunDir),s.uSunColor.value.copy(i.sunHorizon),s.uFogColor.value.copy(i.horizon);const o=e.fog();this.pipeline.setFog(o.density,o.falloff),s.uExposure.value=.55*(1+2.2*Math.pow(i.night,1.5)),s.uNight.value=i.night,this.sky.group.position.copy(e.camera.position),this.syncUrl(t)}}const zl={battle:'<path d="M3 17c4-1.5 7-5.5 9-10M21 17c-4-1.5-7-5.5-9-10"/><path d="M2 20.5c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',campaign:'<path d="M3 16c3-4 6-6 10-6.5 2.5-.3 4.5.4 6.5 1.5"/><path d="M17 8.6l3 2.4-3.2 2"/><path d="M4 20h16" stroke-dasharray="1.5 2.2"/>',landing:'<path d="M2 18.5c2 0 2-.8 4-.8s2 .8 4 .8"/><path d="M13 20.5l2.5-5h6.5"/><path d="M3 9.5h8.5M9 6.5l3 3-3 3"/>',raid:'<circle cx="17" cy="7" r="2.2"/><path d="M4 19c3-6 7-9.5 11-11"/><path d="M6.5 20c3.5-5.5 7.5-9 10-10.6" stroke-dasharray="2 2"/>',siege:'<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r="7.5" stroke-dasharray="2.4 2.2"/>',sinking:'<path d="M6.5 9.5l9 4.5-1.6 2.6-8.8-4.4z"/><path d="M10.5 11.5l1.4-3"/><path d="M2 17.5c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',occupation:'<path d="M3 18.5c3-2.5 6-3.5 9-3.5s6 1 9 3.5"/><path d="M12 15V4.5"/><path d="M12 5h6l-2 2.2 2 2.3h-6"/>',surrender:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h4"/><path d="M10 18c1.2-1.4 2.4-1.4 3.6 0 .8.9 1.6.9 2.4 0"/>',political:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',bombing:'<path d="M3 20.5h18"/><path d="M5 20.5V12h4v8.5M10 20.5V8h4v12.5M15 20.5v-6h4v6"/>',atrocity:'<path d="M8 20.5V8.5a4 4 0 0 1 8 0v12"/><path d="M5.5 20.5h13"/><path d="M10.5 11.5h3"/>',captivity:'<path d="M3 8h18M3 13h18M3 18h18"/><path d="M6 5v15M12 5v15M18 5v15"/>',people:'<path d="M5 13.5 12 8l7 5.5"/><path d="M7 12.5v6h10v-6"/><path d="M2 21c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',other:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',chapter:'<circle cx="12" cy="12" r="8"/><path d="M12 3.5v17M3.5 12h17"/><path d="M12 7l1.3 3.7L17 12l-3.7 1.3L12 17l-1.3-3.7L7 12l3.7-1.3z"/>',box:'<rect x="4" y="5" width="16" height="12" rx="1.5"/><path d="M2 20.5c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',enter:'<path d="M12 3v12M7 10l5 5 5-5"/><rect x="4" y="17" width="16" height="4" rx="1"/>',take:'<circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',watch:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',front:'<path d="M4 15c2-4 5-7 9-7.5 3-.4 5.5 1 7 3" stroke-dasharray="2.3 2"/><path d="M4 15c3 3 8 4.5 12 3.5 2.5-.6 4-2.4 4-4.5" /><path d="M8 14.5l3-3M11 16l4-4M14.5 16.5l3-3"/>',routes:'<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',labels:'<path d="M4 7h10M9 7v11"/><path d="M14.5 12h5.5M17.2 12v6"/>',home:'<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M6 15c2-3 4-4.5 6-4.5s3.5 1 6 3"/>',sources:'<path d="M5 4.5h10.5L19 8v11.5H5z"/><path d="M8 9h7M8 12h8M8 15h6"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',arrow:'<path d="M5 12h13M13 7l5 5-5 5"/>'};function ue(n,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${zl[n]||zl.other}</svg>`}const ff=n=>n in zl,Z2=["January","February","March","April","May","June","July","August","September","October","November","December"];function Us(n,t=null){const e=t?/^([+-])(\d{2}):(\d{2})$/.exec(t):null,i=e?(e[1]==="-"?-1:1)*(Number(e[2])*60+Number(e[3]))*6e4:0,s=new Date(n+i);return`${s.getUTCDate()} ${Z2[s.getUTCMonth()]} ${s.getUTCFullYear()}`}const Dl=n=>n.short||String(n.label||n.id).replace(/^the /,"").replace(/^./,t=>t.toUpperCase());class J2{constructor(t,e,i){this.app=e,this.ui=i,this.clock=e.clock,this.tween=null,this.zone=null;const s=this.clock.chapters;this.el=Ge("div",{class:"timeline",role:"group","aria-label":"The date"}),this.el.innerHTML=`
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${ue("prev",16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${ue("next",16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><i class="tl-pro"></i><span></span></div>
        <div class="tl-years"></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="1" step="0.0001" aria-label="Date" />
      </div>`,t.appendChild(this.el),this.input=Nn(".tl-input",this.el),this.backBtn=Nn(".tl-back",this.el),this.nextBtn=Nn(".tl-next",this.el),this.tourEl=Nn(".tl-tour",this.el);const o=this.clock.prologue,r=Nn(".tl-pro",this.el);o?r.style.width=`${this.clock.sAt(o.toMs)*100}%`:r.remove();const a=Nn(".tl-ticks",this.el),l=Math.min(620,innerWidth-60);let c=-1/0;s.forEach((x,m)=>{const p=this.clock.sAt(x.fromMs),y=Dl(x),v=Ge("button",{class:"tl-tick",style:`left:${(p*100).toFixed(3)}%`,title:`${y} · from ${Us(x.fromMs)}`,"aria-label":y,"data-i":m,"data-chapter":x.id}),M=p*l,S=y.length*6.2+10,T=M-S/2>c;T&&(c=M+S/2),v.innerHTML=`<i></i>${T?`<span>${ut(y)}</span>`:""}`,a.appendChild(v)});const h=Nn(".tl-years",this.el),u=new Date(s[0].fromMs).getUTCFullYear(),f=new Date(s[s.length-1].toMs).getUTCFullYear(),d=o?new Date(o.toMs).getUTCFullYear()+1:u+1,g=o?[u]:[];for(let x=d;x<=f;x++)g.push(x);for(const x of g){const m=this.clock.sAt(Date.UTC(x,0,1));m<=0&&x!==u||h.appendChild(Ge("span",{style:`left:${(m*100).toFixed(3)}%`},String(x)))}this.input.addEventListener("input",()=>{this.tween=null,this.clock.setS(Number(this.input.value)),this.ui.onScrub()}),a.addEventListener("click",x=>{const m=x.target.closest(".tl-tick");m&&(this.el.classList.remove("invite"),this.ui.tour.goTo(Number(m.dataset.i),-1))}),this.nextBtn.addEventListener("click",()=>{this.el.classList.remove("invite"),this.ui.tour.next()}),this.backBtn.addEventListener("click",()=>this.ui.tour.back()),this.clock.onChange(()=>this.refresh()),this.refresh()}easeTo(t,e=1){const i=Math.max(0,Math.min(1,t));this.tween={from:this.clock.s,to:i,t:0,dur:e}}easeToDate(t,e){this.easeTo(this.clock.sAt(t),e)}finish(){this.tween&&(this.clock.setS(this.tween.to),this.tween=null)}update(t){const e=this.tween;if(!e)return;e.t=Math.min(1,e.t+t/e.dur);const i=e.t<.5?2*e.t*e.t:1-Math.pow(-2*e.t+2,2)/2;this.clock.setS(e.from+(e.to-e.from)*i),e.t>=1&&(this.tween=null)}refresh(){const t=this.clock,e=t.date,i=t.chapterAt(e);Nn(".tl-era",this.el).textContent=i?Dl(i):"",Nn(".tl-year",this.el).textContent=Us(e,this.zone),document.activeElement!==this.input&&(this.input.value=String(t.s)),Nn(".tl-rail span",this.el).style.width=`${t.s*100}%`;const s=i?t.chapters.indexOf(i):-1;for(const o of this.el.querySelectorAll(".tl-tick"))o.classList.toggle("on",Number(o.dataset.i)===s)}refreshTour(t){const e=`${t.active}:${t.chapter}:${t.step}:${t.stop}:${t.active?"":t.nearestChapter()}:${t.atEnd}:${t.atStart}`;if(e===this.tourKey)return;this.tourKey=e;const i=t.describe();if(this.backBtn.disabled=!i||t.atStart,this.nextBtn.disabled=!i||t.atEnd,this.el.classList.toggle("off-tour",!!i&&!i.active),this.tourEl.classList.toggle("opening",!!(i!=null&&i.opening)),!i){this.tourEl.innerHTML="";return}this.tourEl.innerHTML=i.active?`<span class="tl-ch">${i.numbered?`Chapter <b>${i.number}</b> of ${i.of}`:`<b>${ut(i.chapter)}</b>`}</span>${i.name!==i.chapter?`<i>·</i><em>${ut(i.name)}</em>`:""}${i.step?`<i>·</i><span>${ut(i.step)}</span>`:""}`:`<span>Next resumes at ${ut(i.chapter.toLowerCase())}</span>${i.name!==i.chapter?`<i>·</i><em>${ut(i.name)}</em>`:""}`,this.nextBtn.title=i.active?"Next (→ or space)":`Back to the tour: ${i.chapter.toLowerCase()}, ${i.name}`}}const Pu={ex:0,loc:25,isl:30,reg:300,sea:250,off:0},zu=26;function La(n){var t;try{return(t=n==null?void 0:n.when)!=null&&t.from?tr(n.when):null}catch{return null}}function ka(n,t){for(const e of(n==null?void 0:n.where)||[]){const i=t.get(e.place);if(i&&bi(i.geometry))return i}return null}function pf(n){try{return Rd(n.when,{zone:n.when.zone}).replace(/, \d\d:\d\d.*$/,"").replace(/ \(UTC.*\)$/,"").replace(/(January|February|March|April|May|June|July|August|September|October|November|December)/g,e=>e.slice(0,3))}catch{return""}}function Du(n,t){const e=n.geometry,i=(e==null?void 0:e.type)==="Polygon"?[e.coordinates[0]]:(e==null?void 0:e.type)==="MultiPolygon"?e.coordinates.map(o=>o[0]):null;if(!i)return null;let s=0;for(const o of i){const r=o.map(a=>t.toWorld(a));for(let a=0,l=r.length-1;a<r.length;l=a++)s+=r[l][0]*r[a][1]-r[a][0]*r[l][1]}return Math.sqrt(Math.abs(s/2)/Math.PI)}class Q2{constructor(t,e,{onOpen:i,onCluster:s}={}){this.app=e,this.onOpen=i,this.onCluster=s,this.layer=Ge("div",{class:"pins"}),t.appendChild(this.layer),this.tip=Ge("div",{class:"cl-tip",role:"tooltip"}),t.appendChild(this.tip);const o=e.data.proj,r=new Map(e.data.places.map(h=>[h.id,h]));this.places=r;const a=e.table.ground.bounds;this.bounds=a,this.centre=[(a.x0+a.x1)/2,(a.z0+a.z1)/2],this.items=[];const l=[];for(const h of e.data.events){const u=ka(h,r),f=La(h);if(!u||!f){l.push(h.id);continue}const[d,g]=o.toWorld(bi(u.geometry)),x=u.placePrecision==="off"||d<a.x0||d>a.x1||g<a.z0||g>a.z1,m=ff(h.kind)?h.kind:"other",p=!!h.box,y=Ge("button",{class:`pin${p?" boxed":""}${x?" off":""}`,title:h.title,"aria-label":h.title,"data-ev":h.id},`<span class="pin-ic">${ue(m,16)}</span><span class="pin-label">${ut(h.title)}</span>${x?`<span class="pin-arrow">${ue("arrow",14)}</span>`:""}`);y.addEventListener("click",T=>{var A;T.stopPropagation(),(A=this.onOpen)==null||A.call(this,h)});const v=x?0:Du(u,o)??Pu[u.placePrecision]??0,M=Ge("div",{class:"halo"});this.layer.appendChild(M),this.layer.appendChild(y);const S=x?this.toEdge(d,g):null;this.items.push({ev:h,place:u,x:S?S[0]:d,z:S?S[1]:g,tx0:d,tz0:g,off:x,boxed:p,span:f,start:f[0],el:y,halo:M,soft:v,r:v,arrow:x?y.querySelector(".pin-arrow"):null,angle:NaN,pos:new j(d,0,g),shown:!1,active:!1,near:!1,haloShown:!1,tx:NaN,ty:NaN,ts:NaN,hx:NaN,hy:NaN,hr:NaN,ha:NaN})}l.length&&e.warn(`events with no placeable \`where\` or no date, so no pin: ${l.join(", ")}`);const c=this.items.length;this.sx=new Float32Array(c),this.sy=new Float32Array(c),this.vis=new Uint8Array(c),this.root=new Int16Array(c),this.size=new Int16Array(c),this.slot=new Int16Array(c),this.members=new Int16Array(c),this.halos=new Int16Array(c),this.clusters=[],this.nClusters=0,this.hovered=null,this.activeEvent=null,this.stopXZ=null,this.rects=[],this._v=new j,this._w=new j}toEdge(t,e){const i=this.bounds,[s,o]=this.centre,r=t-s,a=e-o,l=.97,c=r?(r>0?i.x1-s:i.x0-s)*l/r:1/0,h=a?(a>0?i.z1-o:i.z0-o)*l/a:1/0,u=Math.min(1,c,h);return[s+r*u,o+a*u]}setStopPlace(t){const e=t&&bi(t.geometry);this.stopXZ=e?this.app.data.proj.toWorld(e):null,this.stopSoft=t?Du(t,this.app.data.proj)??Pu[t.placePrecision]??0:0}visibleEvents(){const[t,e]=this.app.clock.windowAt();return this.items.filter(i=>i.span[1]>=t&&i.span[0]<=e).map(i=>i.ev)}marker(t){let e=this.clusters[t];if(e)return e;const i=Ge("button",{class:"cluster"},'<span class="cl-n"></span>');return e={el:i,label:i.firstChild,start:0,count:0,x:0,y:0,key:0,shownCount:-1,tipKey:-1,domKey:-1,shown:!1,beside:!1,boxed:!1,tx:NaN,ty:NaN,ts:NaN},i.addEventListener("click",s=>{var o;s.stopPropagation(),this.hideTip(),(o=this.onCluster)==null||o.call(this,this.eventsOf(e))}),i.addEventListener("pointerenter",s=>{s.pointerType!=="touch"&&(this.hovered=e,this.showTip(e))}),i.addEventListener("pointerleave",()=>{this.hovered===e&&this.hideTip()}),this.layer.appendChild(i),this.clusters[t]=e,e}eventsOf(t){const e=[];for(let i=0;i<t.count;i++)e.push(this.items[this.members[t.start+i]]);return e.sort((i,s)=>i.start-s.start).map(i=>i.ev)}groups(){return this.clusters.slice(0,this.nClusters).map(t=>({ids:this.eventsOf(t).map(e=>e.id),count:t.count,x:t.x,y:t.y,beside:t.beside}))}showTip(t){t.tipKey=t.key;const e=this.eventsOf(t).map(i=>`<div class="tip-row"><span class="tip-y">${ut(pf(i))}</span><b>${ut(i.title)}</b></div>`).join("");this.tip.innerHTML=`<div class="tip-head">${t.count} events here</div>${e}<div class="tip-foot">click for the list</div>`,this.tip.classList.add("show"),this.tipX=this.tipY=NaN,this.placeTip(t)}placeTip(t){const e=this.tip.offsetWidth||220,i=this.tip.offsetHeight||120;let s=t.x+22;s+e>innerWidth-10&&(s=t.x-22-e);const o=Math.max(64,Math.min(innerHeight-i-10,t.y-44-i/2)),r=Math.round(s),a=Math.round(o);r===this.tipX&&a===this.tipY||(this.tipX=r,this.tipY=a,this.tip.style.transform=`translate(${r}px, ${a}px)`)}hideTip(){this.hovered=null,this.tip.classList.remove("show")}find(t){const e=this.root;for(;e[t]!==t;)e[t]=e[e[t]],t=e[t];return t}put(t,e,i,s){Math.abs(e-t.tx)<.05&&Math.abs(i-t.ty)<.05&&s===t.ts||(t.tx=e,t.ty=i,t.ts=s,t.el.style.transform=`translate(${e.toFixed(1)}px, ${i.toFixed(1)}px) scale(${s.toFixed(3)})`)}update(t){const e=this.app,i=e.table,s=i.camera,o=innerWidth,r=innerHeight,[a,l]=e.clock.windowAt(),c=i.rig.state.distance,h=Math.round(Math.max(.62,Math.min(1,1.12-Math.log(Math.max(1,c)/300)*.11))*200)/200,u=this.items,f=u.length,{sx:d,sy:g,vis:x,root:m,size:p}=this,y=this.activeEvent,v=this._v,M=this.rects;M.length=0;let S=-1;for(let w=0;w<f;w++){const C=u[w],F=C.ev===y,z=F&&this.stopXZ;C.pos.x=z?this.stopXZ[0]:C.x,C.pos.z=z?this.stopXZ[1]:C.z,C.pos.y=i.ground.heightAt(C.pos.x,C.pos.z)+.05,C.r=z?this.stopSoft:C.soft;let P=t&&(F||C.span[1]>=a&&C.span[0]<=l);P&&(v.copy(C.pos).project(s),d[w]=(v.x+1)/2*o,g[w]=(1-v.y)/2*r,P=v.z<1&&d[w]>-60&&d[w]<o+60&&g[w]>84&&g[w]<r+40),x[w]=P?1:0,P&&F&&(S=w),m[w]=w,p[w]=0}const T=zu*zu*h*h;for(let w=0;w<f;w++)if(!(!x[w]||w===S))for(let C=w+1;C<f;C++){if(!x[C]||C===S)continue;const F=d[w]-d[C],z=g[w]-g[C];if(F*F+z*z<T){const P=this.find(w),B=this.find(C);P!==B&&(m[Math.max(P,B)]=Math.min(P,B))}}for(let w=0;w<f;w++)x[w]&&w!==S&&p[this.find(w)]++;let A=0,k=0;for(let w=0;w<f;w++){if(!x[w]||w===S||m[w]!==w||p[w]<2)continue;const C=this.marker(A);this.slot[w]=A++,C.start=k,C.count=0,C.x=0,C.y=0,C.key=0,C.hasBox=!1,k+=p[w]}for(let w=0;w<f;w++){if(!x[w]||w===S)continue;const C=this.find(w);if(p[C]<2)continue;const F=this.clusters[this.slot[C]];this.members[F.start+F.count++]=w,F.x+=d[w],F.y+=g[w],F.key=(F.key*61+w+1)%1000003,u[w].boxed&&(F.hasBox=!0)}for(let w=0;w<f;w++){const C=u[w],F=x[w]===1&&(w===S||p[this.find(w)]<2);F!==C.shown&&(C.shown=F,C.el.classList.toggle("show",F));const z=C.ev===y;if(z!==C.active&&(C.active=z,C.el.classList.toggle("active",z)),!F)continue;const P=c<900||z;P!==C.near&&(C.near=P,C.el.classList.toggle("near",P)),this.put(C,d[w],g[w],h),C.off&&this.pointArrow(C,d[w],g[w]);const B=P?Math.min(240,9*C.ev.title.length)+30:16;M.push([d[w]-18*h,g[w]-42*h,d[w]+B*h,g[w]+2])}for(let w=0;w<A;w++){const C=this.clusters[w];C.x/=C.count,C.y/=C.count;const F=S>=0&&Math.abs(C.x-d[S])<30&&Math.abs(C.y-g[S])<30;if(F&&(C.x=d[S]-36*h,C.y=g[S]),F!==C.beside&&(C.beside=F,C.el.classList.toggle("beside",F)),C.hasBox!==C.boxed&&(C.boxed=C.hasBox,C.el.classList.toggle("boxed",C.boxed)),C.count!==C.shownCount&&(C.shownCount=C.count,C.label.textContent=String(C.count),C.el.setAttribute("aria-label",`${C.count} events here`)),C.key!==C.domKey){C.domKey=C.key;let z="";for(let P=0;P<C.count;P++)z+=`${P?" ":""}${u[this.members[C.start+P]].ev.id}`;C.el.dataset.events=z}C.shown||(C.shown=!0,C.el.classList.add("show")),this.put(C,C.x,C.y,h),M.push([C.x-18*h,C.y-42*h,C.x+22*h,C.y+2]),this.hovered===C&&(C.key!==C.tipKey?this.showTip(C):this.placeTip(C))}for(let w=A;w<this.clusters.length;w++){const C=this.clusters[w];this.hovered===C&&this.hideTip(),C.shown&&(C.shown=!1,C.count=0,C.el.classList.remove("show"))}this.nClusters=A;let _=0;for(let w=0;w<f;w++){const C=u[w];let F=x[w]===1&&C.r>0;for(let X=0;F&&X<_;X++){const J=u[this.halos[X]];Math.abs(J.pos.x-C.pos.x)<.5&&Math.abs(J.pos.z-C.pos.z)<.5&&J.r>=C.r&&(F=!1)}if(F!==C.haloShown&&(C.haloShown=F,C.halo.classList.toggle("show",F)),!F)continue;this.halos[_++]=w,this._w.copy(s.position).sub(C.pos).normalize();const z=this._w.cross(s.up).normalize().multiplyScalar(C.r).add(C.pos);z.project(s);const P=Math.max(6,Math.min(400,Math.hypot((z.x+1)/2*o-d[w],(1-z.y)/2*r-g[w])));Math.abs(d[w]-C.hx)<.05&&Math.abs(g[w]-C.hy)<.05&&Math.abs(P-C.hr)<.05||(C.hx=d[w],C.hy=g[w],C.hr=P,C.halo.style.transform=`translate(${d[w].toFixed(1)}px, ${g[w].toFixed(1)}px) scale(${P.toFixed(1)})`);const B=Math.round(Math.max(.3,Math.min(1,70/P))*100)/100;B!==C.ha&&(C.ha=B,C.halo.style.setProperty("--halo",B.toFixed(2)))}return M}pointArrow(t,e,i){const s=this._w.set(t.tx0,0,t.tz0).project(this.app.table.camera),o=innerWidth,r=innerHeight,a=(s.x+1)/2*o,l=(1-s.y)/2*r,c=s.z<1?1:-1,h=Math.round(Math.atan2((l-i)*c,(a-e)*c)*180/Math.PI);h!==t.angle&&(t.angle=h,t.arrow.style.transform=`rotate(${h}deg)`)}}const tw={jp:"Japan",us:"United States",uk:"British Commonwealth",in:"India",au:"Australia",nz:"New Zealand",ca:"Canada",nl:"Netherlands",cn:"China",ph:"Philippines",th:"Thailand",fr:"French Indochina",su:"Soviet Union",mn:"Mongolia",ina:"Indian National Army",mk:"Manchukuo",chamorro:"Chamorro",refaluwasch:"Carolinian",nauruan:"Nauruan",banaban:"Banaban","i-kiribati":"I-Kiribati",marshallese:"Marshallese",chuukese:"Chuukese",palauan:"Palauan","solomon-islanders":"Solomon Islanders",papuan:"Papuan",bougainvillean:"Bougainvillean",okinawan:"Okinawan",unangax:"Unangax̂",korean:"Korean","chinese-civ":"Chinese civilians","filipino-civ":"Filipino civilians","japanese-civ":"Japanese civilians","japanese-am":"Japanese Americans","japanese-ca":"Japanese Canadians",romusha:"rōmusha"},ew={battle:"battle",campaign:"campaign",landing:"landing",raid:"raid",siege:"siege",sinking:"sinking",occupation:"occupation",surrender:"surrender",political:"politics",bombing:"bombing",atrocity:"atrocity",captivity:"captivity",people:"the peoples",other:"event"},mf={"pd-us-gov":"public domain (US government)",pdm:"public domain","cc-by":"CC BY","cc-by-4.0":"CC BY 4.0","cc-by-nc":"CC BY-NC","cc-by-sa":"CC BY-SA",odbl:"ODbL","nids-permission":"NIDS, cited by reference","copyright-cite-only":"in copyright, cited",unknown:""},nw={open:"",lending:"lending library",print:"in print",paywalled:"paywalled"},Il=n=>tw[n]||n,iw=n=>ew[n]||n||"event",ba={ex:650,loc:800,isl:900,reg:2600,sea:2400,off:9e3},sw=2600,ws=(n,t,e)=>Math.max(t,Math.min(e,n)),Cs=n=>((n==null?void 0:n.stops)||[]).filter(t=>!t.zoom||t.zoom==="table");class ow{constructor(t,e){this.app=t,this.ui=e,this.places=new Map(t.data.places.map(i=>[i.id,i])),this.chapters=this.build(),this.active=!1,this.chapter=0,this.step=-1,this.stop=-1,this.listeners=[]}get rig(){return this.app.table.rig}build(){const t=this.app,e=t.clock,i=e.chapters,s=new Map(i.map((c,h)=>[c.id,h])),o=i.filter(c=>c!==e.prologue),r=i.map((c,h)=>({chapter:c,index:h,number:c===e.prologue?0:o.indexOf(c)+1,prologue:c===e.prologue,name:Dl(c),events:[]}));if(!r.length)return r;const a=[],l=r.map(()=>[]);return t.data.events.forEach((c,h)=>{const u=La(c);if(!u)return;let f=s.get(c.chapter);f===void 0&&(f=i.indexOf(e.chapterAt(u[0])),a.push(c.id)),l[f].push({ev:c,start:u[0],order:h})}),a.length&&t.warn(`events whose chapter is not in chapters.json, placed by date: ${a.join(", ")}`),r.forEach((c,h)=>{c.events=l[h].sort((u,f)=>u.start-f.start||u.order-f.order).map(u=>u.ev)}),this.numbered=o.length,r}onChange(t){this.listeners.push(t)}notify(){for(const t of this.listeners)t(this)}get current(){return this.chapters[this.chapter]||null}get event(){var t;return this.step>=0&&((t=this.current)==null?void 0:t.events[this.step])||null}get state(){var t;return{active:this.active,chapter:this.chapter,step:this.step,stop:this.stop,event:((t=this.event)==null?void 0:t.id)??null}}get atStart(){return this.active&&this.chapter===0&&this.step<0}get atEnd(){const t=this.chapters.length;if(!t)return!0;if(!this.active)return!1;const e=this.current,i=this.event,s=i?Cs(i).length-1:-1;return this.chapter===t-1&&this.step===e.events.length-1&&this.stop>=s}nearestChapter(){const t=this.app.clock;return ws(t.chapters.indexOf(t.chapterAt(t.date)),0,this.chapters.length-1)}begin(){this.goTo(0,-1,{jump:!0})}next(){if(!this.chapters.length)return;if(!this.active)return this.goTo(this.nearestChapter(),-1);const t=this.event;if(t&&this.stop<Cs(t).length-1)return this.goStop(this.stop+1);if(this.step<this.current.events.length-1)return this.goTo(this.chapter,this.step+1);if(this.chapter<this.chapters.length-1)return this.goTo(this.chapter+1,-1)}back(){if(this.chapters.length){if(!this.active)return this.goTo(this.nearestChapter(),-1);if(this.event&&this.stop>0)return this.goStop(this.stop-1);if(this.event&&this.stop===0)return this.goTo(this.chapter,this.step);if(this.step>0)return this.goTo(this.chapter,this.step-1,{stop:"last"});if(this.step===0)return this.goTo(this.chapter,-1);if(this.chapter>0){const t=this.chapters[this.chapter-1];return this.goTo(this.chapter-1,t.events.length-1,{stop:"last"})}}}skip(t){if(!this.chapters.length)return;const e=this.active?this.chapter:this.nearestChapter(),i=t<0&&this.active&&this.step>=0?e:e+t;i>=0&&i<this.chapters.length&&this.goTo(i,-1)}leave(){this.active&&(this.active=!1,this.ui.timeline.zone=null,this.app.table.setFocus(null),this.notify())}locate(t){for(let e=0;e<this.chapters.length;e++){const i=this.chapters[e].events.indexOf(t);if(i>=0)return[e,i]}return null}open(t,{gentle:e=!1}={}){var s;const i=this.locate(t);if(i)return this.goTo(i[0],i[1],{gentle:e});this.ui.pins.activeEvent=t,this.ui.pins.setStopPlace(null),this.ui.timeline.zone=((s=t.when)==null?void 0:s.zone)??null,this.app.table.setFocus(t),this.ui.card.open(t),this.fly(this.gentleView(t))}goTo(t,e=-1,{jump:i=!1,gentle:s=!1,stop:o=-1}={}){const r=this.chapters[t];if(r){if(this.active=!0,this.chapter=t,this.step=ws(e,-1,r.events.length-1),this.stop=-1,this.step<0)this.showChapter(r,i);else{const a=r.events[this.step],l=Cs(a).length;if(o==="last"&&l)return this.goStop(l-1,{jump:i});this.showEvent(a,{jump:i,gentle:s})}this.notify()}}showChapter(t,e){const i=this.ui;i.timeline.zone=null,i.pins.activeEvent=null,i.pins.setStopPlace(null),this.app.table.setFocus(null),i.card.openChapter(t);const s=this.fly(this.chapterView(t),e);this.setDate(this.chapterDate(t),s,e)}showEvent(t,{jump:e,gentle:i}){var c,h;const s=this.ui;s.timeline.zone=((c=t.when)==null?void 0:c.zone)??null,t.box&&((h=s.onPrefetch)==null||h.call(s,t)),s.pins.activeEvent=t,s.pins.setStopPlace(null),this.app.table.setFocus(t),s.card.open(t);const o=this.fly(i?this.gentleView(t):this.eventView(t),e),[r,a]=this.app.clock.windowAt(),l=La(t);i&&l&&l[1]>=r&&l[0]<=a||this.setDate(this.stepDate(t,this.current),o,e)}goStop(t,{jump:e=!1}={}){var c,h;const i=this.event,s=Cs(i);if(!i||t<-1||t>=s.length)return;const o=this.ui;this.active=!0,this.stop=t,o.pins.activeEvent=i,this.app.table.setFocus(i),o.card.ev!==i&&o.card.open(i),o.card.setStop(t);const r=s[t],a=r?this.places.get(r.place):null,l=a&&bi(a.geometry);if(o.pins.setStopPlace(l?a:null),r){const u=l?this.placeView(a):null,f=this.fly(u,e);if(r.when||r.date)try{this.setDate(Ve(((c=r.when)==null?void 0:c.from)??r.date,{zone:(h=i.when)==null?void 0:h.zone}),f,e)}catch{}}this.notify()}chapterDate(t){const e=t.chapter;try{const i=e.keyframe?Ve(e.keyframe):null;if(i!==null&&i>=e.fromMs&&i<e.toMs)return i}catch{}return e.fromMs}stepDate(t,e){const i=La(t);if(!i)return this.app.clock.date;const{fromMs:s,toMs:o}=e.chapter;return i[0]>=s&&i[0]<o?i[0]:i[1]>=s&&i[0]<o?ws(i[0],s,o-1):i[0]}setDate(t,e,i){const s=this.ui.timeline;i?(s.tween=null,this.setting=!0,this.app.clock.setDate(t),this.setting=!1):s.easeToDate(t,ws(e*.8,.6,2.4))}tilt(){const t=this.rig.goal;return ws(t.pitch-Id(t.distance,Re.pitchRange),-.3,.3)}theatreView(){const t=this.app.table.ground.bounds;return this.rig.fit({rect:t,yaw:0,box:this.ui.freeBox(),pad:1})}chapterView(t){const e=[];for(const l of t.events){const c=ka(l,this.places);!c||c.placePrecision==="off"||e.push(this.app.data.proj.toWorld(bi(c.geometry)))}const i=this.app.table.ground.bounds;if(e.length<2)return this.theatreView();let s={x0:1/0,z0:1/0,x1:-1/0,z1:-1/0};for(const[l,c]of e)s={x0:Math.min(s.x0,l),z0:Math.min(s.z0,c),x1:Math.max(s.x1,l),z1:Math.max(s.z1,c)};const o=(s.x0+s.x1)/2,r=(s.z0+s.z1)/2,a=Math.max(s.x1-s.x0,s.z1-s.z0,sw)/2;return s={x0:Math.max(i.x0,o-a),x1:Math.min(i.x1,o+a),z0:Math.max(i.z0,r-a),z1:Math.min(i.z1,r+a)},this.rig.fit({rect:s,yaw:0,box:this.ui.freeBox(),pad:1.25})}placeView(t,{distance:e}={}){const i=this.app.data.proj,s=t.geometry,o=this.ui.freeBox();if(t.placePrecision==="off")return this.theatreView();if(!e&&((s==null?void 0:s.type)==="Polygon"||(s==null?void 0:s.type)==="MultiPolygon")){const c=s.type==="Polygon"?[s.coordinates[0]]:s.coordinates.map(u=>u[0]);let h={x0:1/0,z0:1/0,x1:-1/0,z1:-1/0};for(const u of c)for(const f of u){const[d,g]=i.toWorld(f);h={x0:Math.min(h.x0,d),z0:Math.min(h.z0,g),x1:Math.max(h.x1,d),z1:Math.max(h.z1,g)}}return this.rig.fit({rect:h,yaw:this.rig.goal.yaw,tilt:this.tilt(),box:o,pad:1.6})}const[r,a]=i.toWorld(bi(s)),l=e??ba[t.placePrecision]??ba.loc;return this.rig.fit({rect:{x0:r,x1:r,z0:a,z1:a},distance:l,tilt:this.tilt(),box:o})}eventView(t){const e=this.app.table;if(t.box&&this.app.data.boxById.has(t.box)){const s=this.app.data.boxById.get(t.box),o=s.pack.rect,r=[[o.x0,o.z0],[o.x1,o.z0],[o.x1,o.z1],[o.x0,o.z1]].map(u=>s.placement.toTable(u)),a={x0:Math.min(...r.map(u=>u[0])),x1:Math.max(...r.map(u=>u[0])),z0:Math.min(...r.map(u=>u[1])),z1:Math.max(...r.map(u=>u[1]))},l=(a.x0+a.x1)/2,c=(a.z0+a.z1)/2,h=Math.max(a.x1-a.x0,a.z1-a.z0)*2.2;return this.rig.fit({rect:{x0:l-h,x1:l+h,z0:c-h,z1:c+h},yaw:e.rig.goal.yaw,tilt:this.tilt(),box:this.ui.freeBox()})}const i=ka(t,this.places);return i?this.placeView(i):null}gentleView(t){const e=ka(t,this.places);if(!e||e.placePrecision==="off")return null;const i=ba[e.placePrecision]??ba.loc;return this.placeView(e,{distance:Math.min(this.rig.goal.distance,Math.max(i,600))})}fly(t,e=!1){if(!t)return 1;const i=this.rig;if(e)return i.jump({x:t.target.x,z:t.target.z,distance:t.distance,yaw:t.yaw,pitch:t.pitch}),0;const s=i.goal,o=Math.hypot(s.target.x-t.target.x,s.target.z-t.target.z),r=Math.abs(Math.log(t.distance/Math.max(1,s.distance))),a=ws(1.1+Math.sqrt(o)*.02+r*.28,1.1,3.5);return i.flyTo(t,a),a}describe(){const t=this.chapters.length?this.chapters[this.active?this.chapter:this.nearestChapter()]:null;return t?{active:this.active,opening:this.active&&this.step<0,numbered:!t.prologue,number:t.number,of:this.numbered,chapter:t.prologue?"Prologue":`Chapter ${t.number} of ${this.numbered}`,name:t.name,step:this.active&&this.step>=0?`${this.step+1} of ${t.events.length}`:""}:null}}function aw(n,{sourceLine:t}){var r;const e=(r=n.ja)!=null&&r.kanji?`<p class="card-ja"><span lang="ja">${ut(n.ja.kanji)}</span>${n.ja.romaji?` <em>${ut(n.ja.romaji)}</em>`:""}</p>`:"",i=(n.forces||[]).map(a=>{var l;return`<div class="bf-side">
        <h3>${ut(a.name||a.side)}${a.ja?` <span lang="ja">${ut(a.ja)}</span>`:""}</h3>
        ${(l=a.units)!=null&&l.length?`<p>${a.units.map(c=>ut(c)).join("<i>·</i>")}</p>`:""}
      </div>`}).join("");let s=null;const o=(n.moments||[]).map(a=>`${a.sideName&&a.sideName!==s?`<li class="bm-side">${ut(s=a.sideName)}</li>`:""}<li class="bm">
        <div class="bm-head"><span class="bm-t">${ut(a.t||"")}</span><b>${ut(a.title)}</b></div>
        ${a.ja?`<div class="bm-ja" lang="ja">${ut(a.ja)}</div>`:""}
        ${a.role?`<div class="bm-role">${ut(a.role)}</div>`:""}
        ${a.objective?`<p>${ut(a.objective)}</p>`:""}
        <button class="nav take${a.focus?" focus":""}" data-take="${ut(a.id)}">${ue("take",16)}<span>Take the controls</span></button>
      </li>`).join("");return`
    <header>
      <div class="card-icon">${ue("box",26)}</div>
      <div class="card-titles"><h1>${ut(n.title||"")}</h1>${n.when?`<p class="gloss">${ut(n.when)}</p>`:""}${e}</div>
      <button class="card-close" aria-label="Close">${ue("close",18)}</button>
    </header>
    ${n.clock?`<div class="card-clock">${ut(n.clock)}${n.clockNote?`<span>${ut(n.clockNote)}</span>`:""}</div>`:""}
    ${n.situation?`<div class="card-body"><p>${ut(n.situation)}</p></div>`:""}
    ${i?`<div class="card-sec"><h2>The forces</h2><div class="bf">${i}</div></div>`:""}
    ${o?`<div class="card-sec"><h2>Moments</h2><ul class="bms">${o}</ul></div>`:""}
    <div class="card-sec"><h2>Sources</h2><ul class="sources">${(n.sources||[]).map(a=>t(a)).join("")||'<li class="none">none listed</li>'}</ul></div>
    <footer class="card-foot">
      <button class="nav watch">${ue("watch",16)}<span>Watch</span></button>
      <button class="nav credits-link">${ue("sources",16)}<span>Sources and credits</span></button>
    </footer>
    ${n.credit?`<p class="card-credit">${ut(n.credit)}</p>`:""}`}const rw=/\d[\d,.]*\s*(?:men|crew|lives|dead|killed|died|people|人|名|命)|(?:men|crew|lives|dead|killed|died|people)\s*[:：]?\s*\d/i,lw=[/\bsaved\b/i,/\bwhat if\b/i,/\bvictor(?:y|ies)\b/i],Iu={sortie:{en:"Your sortie",ja:"あなたの出撃"},battle:{en:"Your battle",ja:"あなたの戦い"},record:{en:"The record",ja:"記録"},next:{en:"What came next",ja:"その後"}};function cw(n,t,e=console.warn){const i=String(n??"");return t!=="record"&&rw.test(i)?(e(`after-card: a count of people outside The record, left out: “${i}”`),!1):lw.some(s=>s.test(i))?(e(`after-card: a word the after-card never uses, left out: “${i}”`),!1):!0}const wa=n=>`<h2>${Iu[n].en} <span lang="ja">${Iu[n].ja}</span></h2>`;function hw(n,{sourceLine:t,sourceTitle:e=s=>s,warn:i=console.warn}){var f,d,g,x,m,p,y,v,M;const s=(S,T)=>cw(S,T,i),o=(n.sortie||[]).filter(S=>s(`${S.label??""} ${S.value??S}`,"sortie")),r=(((f=n.battle)==null?void 0:f.rows)||[]).map(S=>`${S.what}: ${S.yours}.`).filter(S=>s(S,"battle")),a=(((d=n.battle)==null?void 0:d.guesses)||[]).filter(S=>s(S,"battle")),l=(g=n.record)!=null&&g.text&&s(n.record.text,"record")?n.record.text:"",c=(((x=n.record)==null?void 0:x.tellings)||[]).filter(S=>s(S.says,"record")),h=(m=n.next)!=null&&m.text&&s(n.next.text,"next")?n.next.text:"",u=n.ja?`<p class="card-ja"><span lang="ja">${ut(typeof n.ja=="string"?n.ja:n.ja.kanji)}</span></p>`:"";return`
    <header>
      <div class="card-icon">${ue("take",26)}</div>
      <div class="card-titles"><h1>${ut(n.title||"")}</h1>${u}</div>
      <button class="card-close" aria-label="Close">${ue("close",18)}</button>
    </header>
    <section class="card-sec after-part" data-part="sortie">${wa("sortie")}
      ${o.length?`<dl class="af-sortie">${o.map(S=>typeof S=="string"?`<dd>${ut(S)}</dd>`:`<dt>${ut(S.label)}</dt><dd>${ut(S.value)}</dd>`).join("")}</dl>`:'<p class="none">—</p>'}
    </section>
    <section class="card-sec after-part" data-part="battle">${wa("battle")}
      ${r.length?`<ul class="af-battle">${r.map(S=>`<li>${ut(S)}</li>`).join("")}</ul>`:""}
      ${a.length?`<ul class="af-guess">${a.map(S=>`<li>${ut(S)}</li>`).join("")}</ul>`:""}
      ${r.length||a.length?"":'<p class="none">—</p>'}
    </section>
    <section class="card-sec after-part" data-part="record">${wa("record")}
      ${l?`<div class="card-body"><p>${ut(l)}</p></div>`:""}
      ${c.length?`<ul class="tellings">${c.map(S=>`<li>${S.source?`<span class="src-title">${ut(S.sourceTitle||e(S.source))}</span>: `:""}${ut(S.says)}</li>`).join("")}</ul>`:""}
      ${(((p=n.record)==null?void 0:p.sources)||[]).length?`<ul class="sources">${n.record.sources.map(S=>t(S)).join("")}</ul>`:""}
    </section>
    <section class="card-sec after-part" data-part="next">${wa("next")}
      ${h?`<div class="card-body"><p>${ut(h)}</p></div>`:""}
      ${(((y=n.next)==null?void 0:y.sources)||[]).length?`<ul class="sources">${n.next.sources.map(S=>t(S)).join("")}</ul>`:""}
    </section>
    <footer class="card-foot">
      <button class="nav watch-on">${ue("watch",16)}<span>Watch on</span></button>
      ${(v=n.retry)!=null&&v.start?'<button class="nav retry" data-from="start">From the start</button>':""}
      ${(M=n.retry)!=null&&M.checkpoint?'<button class="nav retry" data-from="checkpoint">From the checkpoint</button>':""}
      <button class="nav finish to-table">Back to the table</button>
    </footer>`}const uw=`# Pacific Theatre: notices and credits

The data under \`public/data/\` was produced from the sources below, each used
under the terms stated. The same text is shown in the app's Sources and
credits panel and, for a battle box, in its briefing card's footer; every
box's \`manifest.json\` carries its own notice so that it travels with a fork
or a download of the data.

## Terrain in the battle boxes: Copernicus WorldDEM-30 (GLO-30)

Produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus
Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European
Union and ESA; all rights reserved.

The organisations in charge of the Copernicus programme by law or by
delegation do not incur any liability for any use of the Copernicus
WorldDEM-30.

The data was resampled to each box's grid, land was decided by a half-land
rule and sea texels were clamped; nothing here implies official endorsement
by the European Union, ESA, DLR or Airbus.

## Sea floor in the battle boxes: GMRT

Global Multi-Resolution Topography (GMRT) synthesis, Ryan, W. B. F., et al.
(2009), *Geochemistry, Geophysics, Geosystems* 10, Q03014,
doi:10.1029/2008GC002332. Licensed under CC BY 4.0
(<https://creativecommons.org/licenses/by/4.0/>). Resampled and clamped for
this app.

## The table's relief, and the boxes' sea floor where GMRT was not used: ETOPO 2022

NOAA National Centers for Environmental Information (2022), *ETOPO 2022
Global Relief Model* (the 60 arc-second grid for the table, the 15
arc-second tiles in the boxes), doi:10.25921/fd45-gt74. Public domain (US
government work).

## Pearl Harbor's harbour and south shore: NOAA CUDEM

NOAA National Centers for Environmental Information, *Continuously Updated
Digital Elevation Model (CUDEM), 1/9 arc-second resolution bathymetric-
topographic tiles* (Hawaiʻi), public domain (US government work); resampled
and set back to the shore of 1941 on the dated record of the harbour's
works. The rest of the Pearl Harbor box is Copernicus WorldDEM-30 as above.

The berths F-6 to F-8 and the wrecks of Arizona and Utah were positioned
from OpenStreetMap: © OpenStreetMap contributors, Open Database License
(ODbL).

The shore of 7 December 1941 was recovered by undoing the harbour's and the
airport's later works at the box's 50 m texel, on the dated record in
*Building the Navy's Bases in World War II*, vol. II, ch. XXII (Bureau of
Yards and Docks, 1947; public domain, HyperWar transcription); the Hawaiʻi
Department of Transportation's Honolulu International Airport histories
(State of Hawaiʻi publications, quoted for their dates); *Images of Old
Hawaiʻi*'s Ala Wai posts (quoted for their dates; text © its author); the
1881 Government Survey and the 1938 USGS sheets of Oʻahu as georeferenced
by the State of Hawaiʻi GIS Program (open data; the maps themselves are
public-domain surveys); and the Hawaiian diorama's own dated works list.
Each work, with its sources, is listed under \`shore.works\` in the box's
\`manifest.json\`.

## Coastlines and positions on the table: Natural Earth

Natural Earth, version 5 (10 m physical and cultural vectors),
<https://www.naturalearthdata.com/>. Public domain; credited as a courtesy.
No Natural Earth name string is shown in the app.

## Fonts

Fraunces and Inter, and the Noto Sans JP subset, under the SIL Open Font
License 1.1 (see \`FONTS.md\`).

## The record

The historical record on the cards is cited source by source in
\`public/data/sources.json\` and on each card. Public-domain US government
works (the official histories, action reports and recognition manuals on
HyperWar and the Internet Archive) are quoted where a quotation is marked;
works in copyright are cited and never reproduced; images held by the
Japanese National Institute for Defense Studies are cited by reference and
never shown.
`;function dw(n){const t=i=>ut(i).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/&lt;(https?:[^&\s]+)&gt;/g,'<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>").replace(/\*([^*]+)\*/g,"<em>$1</em>"),e=[];for(const i of String(n).split(/\n\s*\n/)){const s=i.trim();if(!s)continue;const o=/^(#{1,3})\s+(.*)$/.exec(s);if(o){if(o[1].length===1)continue;e.push(`<h3>${t(o[2])}</h3>`)}else e.push(`<p>${t(s.replace(/\s*\n\s*/g," "))}</p>`)}return e.join("")}function gf(n=null){var s;let t=dw(uw);const e=(n==null?void 0:n.boxes)||[];e.length&&(t+=`<h3>The battle boxes</h3><ul class="credits">${e.map(o=>`<li><b>${ut(o.name||o.id)}</b>${o.credit?`: ${ut(o.credit)}`:""}</li>`).join("")}</ul>`);const i=((s=n==null?void 0:n.table)==null?void 0:s.sources)||[];return i.length&&(t+=`<h3>The table's relief</h3><ul class="credits">${i.map(o=>{const r=o.url&&/^https?:/.test(o.url)?`<a href="${ut(o.url)}" target="_blank" rel="noopener">${ut(o.title||o.id)}</a>`:ut(o.title||o.id),a=mf[o.licence]??o.licence;return`<li>${r}${o.doi?` <em>doi:${ut(o.doi)}</em>`:""}${a?` <em>${ut(a)}</em>`:""}${o.fetched?` <em>fetched ${ut(o.fetched)}</em>`:""}</li>`}).join("")}</ul>`),t}const fw=["January","February","March","April","May","June","July","August","September","October","November","December"],Uu=n=>ff(n.kind)?n.kind:"other",Fu={from:"from",to:"to",via:"by way of",along:"along",over:"over",landing:"landing"},Nu=n=>{const t=new Date(n);return`${fw[t.getUTCMonth()]} ${t.getUTCFullYear()}`};class pw{constructor(t,e,i){this.app=e,this.ui=i,this.el=Ge("section",{class:"card","aria-live":"polite"}),this.el.inert=!0,t.appendChild(this.el),this.places=new Map(e.data.places.map(s=>[s.id,s])),this.sources=new Map(e.data.sources.map(s=>[s.id,s])),this.events=new Map(e.data.events.map(s=>[s.id,s])),this.routes=new Map(e.data.routes.map(s=>[s.id,s])),this.clocks=e.data.clockById||new Map,this.mode=null,this.ev=null,this.stop=-1,this.chapter=null,this.list=null,this.payload=null,this.el.addEventListener("click",s=>this.click(s))}get isOpen(){return this.el.classList.contains("show")}open(t){this.set("event",{ev:t})}setStop(t){this.stop=t,this.render()}openChapter(t){this.set("chapter",{chapter:t})}openList(t){this.set("cluster",{list:t})}openBriefing(t){var e;this.set("briefing",{payload:t}),(e=this.el.querySelector(".take.focus"))==null||e.focus({preventScroll:!0})}openAfter(t){this.set("after",{payload:t})}openStop(t){this.set("stop",{payload:t})}openCredits(){this.mode!=="credits"&&(this.before=this.mode?{mode:this.mode,ev:this.ev,chapter:this.chapter,list:this.list,payload:this.payload,stop:this.stop}:null),this.set("credits",{})}set(t,{ev:e=null,chapter:i=null,list:s=null,payload:o=null}){this.letGoFocus(),this.mode=t,this.ev=e,this.chapter=i,this.list=s,this.payload=o,this.stop=-1,this.render()}close(){var i,s;if(this.mode==="credits"&&this.before){const o=this.before;this.before=null,this.set(o.mode,o),o.stop>=0&&this.setStop(o.stop);return}const t=this.ev,e=this.mode;this.letGoFocus(),this.el.classList.remove("show"),this.el.inert=!0,this.mode=null,this.ev=null,this.chapter=null,this.list=null,this.payload=null,this.before=null,(s=(i=this.ui).onCardClosed)==null||s.call(i,t,e)}letGoFocus(){this.el.contains(document.activeElement)&&document.activeElement.blur()}click(t){var o;const e=t.target.closest("button");if(!e||!this.el.contains(e))return;const i=this.ui,s=i.tour;if(e.classList.contains("card-close"))this.close();else if(e.classList.contains("bstop-prev"))i.onStep(-1);else if(e.classList.contains("bstop-next"))i.onStep(1);else if(e.classList.contains("prev"))s.back();else if(e.classList.contains("next"))s.next();else if(e.classList.contains("enter")){const r=this.events.get(e.dataset.enter);r&&i.onEnter(r)}else if(e.dataset.take)i.onTake(e.dataset.take);else if(e.classList.contains("watch"))this.close(),i.onWatch();else if(e.classList.contains("watch-on"))this.close(),i.onWatchOn();else if(e.classList.contains("to-table"))this.close(),i.onLeave();else if(e.classList.contains("retry"))i.onRetry(((o=this.payload)==null?void 0:o.momentId)??null,e.dataset.from);else if(e.classList.contains("credits-link"))this.openCredits();else if(e.dataset.ev){const r=this.events.get(e.dataset.ev);r&&s.open(r,{gentle:this.mode==="cluster"})}}sourceLine(t){const e=typeof t=="string"?t:t==null?void 0:t.id,i=e&&this.sources.get(e)||(typeof t=="object"&&(t!=null&&t.title)?t:null),s=typeof t=="object"&&(t!=null&&t.where)?`, ${ut(t.where)}`:"";if(!i)return`<li><span class="src-title">${ut(e)}</span>${s} <span class="flag missing" title="not in sources.json">missing</span></li>`;const o=i.url&&/^https?:/.test(i.url)?`<a href="${ut(i.url)}" target="_blank" rel="noopener">${ut(i.title)}</a>`:ut(i.title),r=i.opened===!1?' <span class="flag" title="Not yet read at the source: check this before relying on it">verify</span>':"",a=i.author?`${ut(i.author)}, `:"",l=i.year?` (${ut(i.year)})`:"",c=[nw[i.access],mf[i.licence]??"",i.ref?i.ref:""].filter(Boolean);return`<li>${a}<span class="src-title">${o}</span>${l}${s}${r}${c.length?` <span class="src-note">${ut(c.join(" · "))}</span>`:""}</li>`}sourcesSection(t){return`<div class="card-sec"><h2>Sources</h2><ul class="sources">${(t||[]).map(e=>this.sourceLine(e)).join("")||'<li class="none">none listed</li>'}</ul></div>`}eventRows(t,{gloss:e=!0}={}){return t.map(i=>`<li><button class="ev-row${i.box?" boxed":""}" data-ev="${ut(i.id)}">
          <span class="ev-ic">${ue(Uu(i),16)}</span>
          <span class="ev-y">${ut(pf(i))}</span>
          <span class="ev-t"><b>${ut(i.title)}</b>${e&&i.gloss?`<em>${ut(i.gloss)}</em>`:""}</span>
        </button></li>`).join("")}footer(){var r;const t=this.ui.tour,e=this.mode==="event"&&((r=this.ev)!=null&&r.box)?`<button class="nav enter" data-enter="${ut(this.ev.id)}">${ue("enter",16)}<span>Enter the battle</span></button>`:"";if(!(t!=null&&t.active))return e?`<footer>${e}</footer>`:"";const i=t.current;let s,o="Next";if(this.mode==="chapter"&&this.chapter===i&&t.step<0)s=i.prologue?'<span class="ch-count">Prologue</span>':`<span class="ch-count">Chapter <b>${i.number}</b> of ${t.numbered}</span>`;else if(this.mode==="event"&&this.ev&&this.ev===t.event){const a=Cs(this.ev).length;t.stop>=0?s=ut(`stop ${t.stop+1} of ${a}`):(s=ut(`${t.step+1} of ${i.events.length}`),a&&(o=a===1?"Its stop":`Walk ${a} stops`))}else return e?`<footer>${e}</footer>`:"";return`<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${t.atStart?"disabled":""}>${ue("prev",18)}</button>
      <span class="count">${s}</span>
      ${e}
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${t.atEnd?"disabled":""}><span>${ut(o)}</span>${ue("next",18)}</button>
    </footer>`}render(){const t={sourceLine:e=>this.sourceLine(e),sourceTitle:e=>{var i;return((i=this.sources.get(e))==null?void 0:i.title)||e},warn:e=>this.app.warn(e)};if(this.mode==="chapter")this.el.innerHTML=this.chapterHTML();else if(this.mode==="cluster")this.el.innerHTML=this.clusterHTML();else if(this.mode==="event"&&this.ev)this.el.innerHTML=this.eventHTML();else if(this.mode==="briefing")this.el.innerHTML=aw(this.payload||{},t);else if(this.mode==="after")this.el.innerHTML=hw(this.payload||{},t);else if(this.mode==="credits")this.el.innerHTML=this.creditsHTML();else if(this.mode==="stop")this.el.innerHTML=this.stopHTML(this.payload||{});else return;this.el.dataset.mode=this.mode,this.el.classList.toggle("chapter",this.mode==="chapter"),this.el.inert=!1,this.el.classList.add("show"),this.el.scrollTop=0}header(t,e,i,s=null){const o=s!=null&&s.kanji?`<p class="card-ja"><span lang="ja">${ut(s.kanji)}</span>${s.romaji?` <em>${ut(s.romaji)}</em>`:""}</p>`:"";return`<header>
        <div class="card-icon">${ue(t,26)}</div>
        <div class="card-titles"><h1>${ut(e)}</h1>${i?`<p class="gloss">${ut(i)}</p>`:""}${o}</div>
        <button class="card-close" aria-label="Close">${ue("close",18)}</button>
      </header>`}whenHTML(t){const e=t.when||{};let i="";try{i=Rd(e,{zone:e.zone})}catch{i=String(e.from||"")}const s=e.clock?this.clocks.get(e.clock):null,o=[];s!=null&&s.name&&o.push(`${s.name}${e.zone?` (${Cd(e.zone)})`:""}`);for(const r of e.alt||[]){const a=r.clock?this.clocks.get(r.clock):null;let l=r.from;try{const c=r.zone||(a==null?void 0:a.offset)||null;l=Us(Ve(r.from,{zone:c})+(c?mw(c):0))}catch{}o.push(`${l} on ${(a==null?void 0:a.name)||r.clock||"another clock"}`)}return e.zoneNote&&o.push(e.zoneNote),`<span class="when">${ut(i)}</span>${o.length?`<div class="when-note">${o.map(r=>`<span>${ut(r)}</span>`).join("")}</div>`:""}`}eventHTML(){const t=this.ev,e=(t.where||[]).map(h=>{var g;const u=this.places.get(h.place);if(!u)return null;const f=u.today&&u.today!==u.name?` <em>today ${ut(u.today)}</em>`:"",d=(g=u.ja)!=null&&g.kanji?` <span lang="ja" class="pl-ja">${ut(u.ja.kanji)}</span>`:"";return`${ut(u.name)}${d}${f}${Fu[h.role]?` <em>${Fu[h.role]}</em>`:""}`}).filter(Boolean),i=Object.entries(t.confidence||{}).map(([h,u])=>`<span class="conf ${ut(u)}"><b>${ut(h)}</b> ${ut(u)}</span>`).join(""),s=(t.tellings||[]).map(h=>{var u;return`<li><span class="src-title">${ut(((u=this.sources.get(h.source))==null?void 0:u.title)||h.source)}</span>: ${ut(h.says)}</li>`}).join(""),o=(t.routes||[]).map(h=>this.routes.get(h)).filter(Boolean).map(h=>`<li><b>${ut(h.title||h.id)}</b>${h.gloss?`, ${ut(h.gloss)}`:""}</li>`).join(""),r=Cs(t),a=this.stop>=0?r[this.stop]:null,l=a?this.places.get(a.place):null,c=[...t.sides||[],...t.alsoSides||[]].map(h=>ut(Il(h))).join("<i>·</i>");return`
      ${this.header(Uu(t),t.title,t.gloss,t.ja)}
      <div class="card-meta">${this.whenHTML(t)}<span class="kind">${ut(iw(t.kind))}</span></div>
      ${e.length?`<div class="card-where">${e.join("<i>·</i>")}</div>`:""}
      ${c?`<div class="card-sides">${c}</div>`:""}
      ${a?`<div class="stop"><div class="stop-n">${this.stop+1} / ${r.length}${l?` · ${ut(l.name)}`:""}</div><p>${ut(a.text)}</p></div>`:""}
      <div class="card-body">${t.summary?`<p>${ut(t.summary)}</p>`:""}</div>
      ${i?`<div class="card-conf">${i}</div>`:""}
      ${s?`<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${s}</ul></div>`:""}
      ${o?`<div class="card-sec"><h2>On the table</h2><ul class="routes">${o}</ul></div>`:""}
      ${this.sourcesSection(t.sources)}
      ${this.footer()}`}chapterHTML(){const t=this.chapter,e=t.chapter,s=String(e.label||e.id).replace(/^./,c=>c.toUpperCase()),o=`${Nu(e.fromMs)} – ${Nu(e.toMs-864e5)}`,a=String(e.note||"").match(/^([‘“"(]*.)([\s\S]*)$/u),l=a?`<p><span class="initial">${ut(a[1])}</span>${ut(a[2])}</p>`:"";return`
      <header class="ch-head">
        <div class="ch-mark">${t.prologue?'<span class="ch-word">Prologue</span><span class="ch-num ch-orn">❧</span>':`<span class="ch-word">Chapter</span><span class="ch-num">${t.number}</span>`}</div>
        <h1 class="ch-title"><span class="ch-name">${ut(s)}</span></h1>
        <div class="ch-year">${ut(o)}</div>
        <button class="card-close" aria-label="Close">${ue("close",18)}</button>
      </header>
      <div class="card-body ch-note">${l}</div>
      ${t.events.length?`<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(t.events,{gloss:!1})}</ul></div>`:""}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`}clusterHTML(){const t=this.list||[],e=[];for(const s of t){const o=(s.where||[]).map(r=>this.places.get(r.place)).find(Boolean);o&&!e.includes(o.name)&&e.push(o.name)}const i=e.length>4?`${e.slice(0,4).join(" · ")} · and ${e.length-4} more`:e.join(" · ");return`
      ${this.header("pins",`${t.length} events`,i)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(t)}</ul></div>`}stopHTML(t){const e=(t.moments||[]).map(i=>`<li class="bm"><div class="bm-head"><span class="bm-t">${ut(i.t||"")}</span><b>${ut(i.title)}</b></div>${i.role?`<div class="bm-role">${ut(i.role)}${i.sideName?` · ${ut(i.sideName)}`:""}</div>`:""}<button class="nav take" data-take="${ut(i.id)}">${ue("take",16)}<span>Take the controls</span></button></li>`).join("");return`
      ${this.header("box",t.title||"",t.when||"",t.ja||null)}
      ${t.clock?`<div class="card-clock">${ut(t.clock)}</div>`:""}
      <div class="card-body"><p>${ut(t.text||"")}</p></div>
      ${e?`<div class="card-sec"><h2>Moments</h2><ul class="bms">${e}</ul></div>`:""}
      ${(t.sources||[]).length?this.sourcesSection(t.sources):""}
      <footer>
        <button class="nav bstop-prev" aria-label="The stop before" title="The stop before (←)" ${t.index>0?"":"disabled"}>${ue("prev",18)}</button>
        <span class="count">${ut(`stop ${t.index+1} of ${t.count}`)}</span>
        <button class="nav next bstop-next" aria-label="The next stop" title="The next stop (→ or space)" ${t.index<t.count-1?"":"disabled"}><span>Next</span>${ue("next",18)}</button>
      </footer>`}creditsHTML(){return`
      ${this.header("sources","Sources and credits","what the table and the boxes are made from")}
      <div class="card-body credits-body">${gf(this.app.data)}</div>`}}function mw(n){const t=/^([+-])(\d{2}):(\d{2})$/.exec(n);return t?(t[1]==="-"?-1:1)*(Number(t[2])*60+Number(t[3]))*6e4:0}const vi=()=>{};class gw{constructor(t){this.app=t,t.ui=this,this.onEnter=vi,this.onTake=vi,this.onWatch=vi,this.onWatchOn=vi,this.onLeave=vi,this.onRetry=vi,this.onPrefetch=vi,this.onStep=vi,this.overlay={front:!0,routes:!0,pins:!0,labels:!0},this.build(),this.bind(),t.table.labels.driven=!0,t.updaters.push(i=>this.update(i));const e=new URLSearchParams(location.hash.replace(/^#/,""));!e.has("date")&&!e.has("cam")&&!e.has("battle")&&this.tour.chapters.length&&(this.tour.begin(),this.timeline.el.classList.add("invite"))}build(){const t=this.app,e=Ge("div",{id:"ui"});document.body.appendChild(e),this.root=e,this.brand=Ge("div",{class:"brand"},'<div class="brand-name">Pacific Theatre</div><div class="brand-sub"><span class="where">A sand table of the record</span></div>'),e.appendChild(this.brand),this.tools=Ge("div",{class:"tools"});const i=(s,o,r,a)=>Ge("button",{class:`tool${a?" on":""}`,"data-tool":s,title:r,"aria-label":r,"aria-pressed":String(!!a)},ue(o,20));this.tools.append(i("front","front","The front",this.overlay.front),i("routes","routes","Fleets, strikes and lanes",this.overlay.routes),i("pins","pins","Events",this.overlay.pins),i("labels","labels","Names",this.overlay.labels),i("home","home","The whole theatre"),i("sources","sources","Sources and credits"),i("help","help","About"),i("full","expand","Full screen")),e.appendChild(this.tools),this.legend=Ge("div",{class:"legend","aria-live":"polite"}),e.appendChild(this.legend),this.inspector=Ge("div",{class:"inspector"}),e.appendChild(this.inspector),this.timeline=new J2(e,t,this),this.pins=new Q2(e,t,{onOpen:s=>this.openEvent(s),onCluster:s=>this.openCluster(s)}),this.card=new pw(e,t,this),this.tour=new ow(t,this),t.tour=this.tour,this.tour.onChange(s=>this.timeline.refreshTour(s)),t.clock.onChange(()=>{this.tour.active&&!this.tour.setting&&!this.timeline.tween&&!this.timeline.dragging&&this.onScrub(),this.timeline.refreshTour(this.tour)}),this.timeline.refreshTour(this.tour),this.help=Ge("div",{class:"help hidden"}),this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${ue("close",18)}</button>
        <h2>Pacific Theatre</h2>
        <p class="help-sub">The Pacific War, 7 December 1941 – 2 September 1945 <span lang="ja">太平洋戦争</span></p>
        <p>The table is the theatre in relief, from Ceylon to Hawaiʻi and from the Aleutians to Australia, the sea floor tinted by its depth. Move the date and the war moves on it: land held is coloured by who held it, hatched where it was contested or where Japan held only the cities and the railways between them; a dashed line rings the island groups Japan held; the declared lines of the war appear on their own dates. Each island carries a mark of who held it that day, and a dashed ring marks a garrison cut off behind the advance.</p>
        <p>Pins are the events of the weeks around the date; a number stands for several in one spot. Open one for its story, its time on its own clock, how sure the record is, where the tellings differ, and its sources. A source marked <span class="flag">verify</span> has not yet been read at the source.</p>
        <p><b>Next</b> walks the war a chapter at a time: each chapter opens with its card, then its events in order, the date and the camera moving to each. Look around as you like between steps; the clock is free too, and Next picks the walk up again from the chapter you are in. A battle with a box offers <b>Enter the battle</b>.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> chapter by chapter</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span><span><b>Esc</b> close the card</span>
        </div>
      </div>`,e.appendChild(this.help)}bind(){const t=this.app;this.tools.addEventListener("click",s=>{var a,l,c;const o=s.target.closest("[data-tool]");if(!o)return;const r=o.dataset.tool;if(r==="help")this.help.classList.toggle("hidden");else if(r==="sources")this.card.mode==="credits"?this.card.close():this.openCredits();else if(r==="full")document.fullscreenElement?(a=document.exitFullscreen)==null||a.call(document):(c=(l=document.documentElement).requestFullscreen)==null||c.call(l).catch(()=>{});else if(r==="home"){const h=this.tour.theatreView();t.table.rig.flyTo(h,2.6)}else r in this.overlay&&(this.overlay[r]=!this.overlay[r],o.classList.toggle("on",this.overlay[r]),o.setAttribute("aria-pressed",String(this.overlay[r])),r==="front"&&(t.table.front.on=this.overlay.front),r==="routes"&&(t.table.routes.visible=this.overlay.routes))}),this.help.addEventListener("click",s=>{(s.target===this.help||s.target.closest(".help-close"))&&this.help.classList.add("hidden")});const e=t.canvas;let i=0;e.addEventListener("pointermove",s=>{if(s.buttons||s.pointerType==="touch")return this.hover(null);const o=performance.now();o-i<70||(i=o,this.hover(s.clientX,s.clientY))}),e.addEventListener("pointerleave",()=>this.hover(null)),e.addEventListener("pointerdown",()=>this.hover(null)),addEventListener("keydown",s=>this.key(s))}key(t){var r,a,l,c;const i=this.app.mode;if(i==="moment")return;if(t.key==="Escape"){if(!this.help.classList.contains("hidden"))return this.help.classList.add("hidden");if(this.card.isOpen)return this.card.close();(i==="watch"||i==="flying")&&this.onLeave();return}if(i==="flying"||(a=(r=t.target).closest)!=null&&a.call(r,"input, textarea, select")||t.altKey||t.ctrlKey||t.metaKey||!this.help.classList.contains("hidden"))return;const s=t.key==="ArrowRight"||t.key===" "&&!((c=(l=t.target).closest)!=null&&c.call(l,"button, a"));if(i==="watch"){(s||t.key==="ArrowLeft")&&(t.preventDefault(),this.onStep(s?1:-1));return}const o=this.tour;s?(t.preventDefault(),this.timeline.el.classList.remove("invite"),o.next()):t.key==="ArrowLeft"?(t.preventDefault(),o.back()):t.key===","||t.key==="<"?o.skip(-1):(t.key==="."||t.key===">")&&o.skip(1)}openEvent(t){this.tour.open(t,{gentle:!0})}openCluster(t){const e=this.tour;this.pins.activeEvent=e.active?e.event:null,this.card.openList(t)}openBriefing(t){this.card.openBriefing(t)}openAfter(t){this.card.openAfter(t)}openCredits(){this.card.openCredits()}onCardClosed(){const t=this.tour;t.active&&t.event||(this.pins.activeEvent=null,this.pins.setStopPlace(null),this.timeline.zone=null,this.timeline.refresh(),this.app.table.setFocus(null))}onScrub(){var i;this.tour.leave();const e=this.app.clock;this.card.mode==="chapter"&&((i=this.card.chapter)==null?void 0:i.chapter)!==e.chapterAt(e.date)&&this.card.close(),this.card.ev||(this.pins.activeEvent=null,this.pins.setStopPlace(null))}freeBox(){const t=innerWidth,e=innerHeight,i={x0:16,y0:72,x1:t-16,y1:e-16},s=this.timeline.el;!s.hidden&&s.offsetHeight&&(i.y1=Math.min(i.y1,s.offsetTop-30));const o=this.card.el;return this.card.isOpen&&o.offsetWidth&&(o.offsetLeft>t*.35?i.x1=Math.min(i.x1,o.offsetLeft-16):i.y1=Math.min(i.y1,o.offsetTop-12)),i.y1-i.y0<120&&(i.y1=i.y0+120),i}hideInspector(){this.inspector.classList.remove("show"),this.inspectorKey=null}hover(t,e){var y,v,M;const i=this.app,s=i.table;if(t==null||i.active!==s||i.mode!=="table")return this.hideInspector();const o=s.rig.pickGround(t,e),r=s.ground.bounds;if(!o||o.x<r.x0||o.x>r.x1||o.z<r.z0||o.z>r.z1)return this.hideInspector();const a=s.ground.metresAt(o.x,o.z);let l=null,c=30*30;const h=this._hv||(this._hv=o.clone());for(const S of i.data.places){const T=bi(S.geometry);if(!T||S.placePrecision==="off")continue;const[A,k]=i.data.proj.toWorld(T);if(h.set(A,s.ground.heightAt(A,k),k).project(s.camera),h.z>1)continue;const _=(h.x+1)/2*innerWidth-t,w=(1-h.y)/2*innerHeight-e,C=_*_+w*w;C<c&&([l,c]=[S,C])}const u=a>0&&this.overlay.front?s.front.at(o.x,o.z):null,f=l?(y=s.front.isles)==null?void 0:y.find(S=>S.place===l):null,[d,g]=i.data.proj.toLonLat(o.x,o.z),x=`${l==null?void 0:l.id}|${u==null?void 0:u.name}|${u==null?void 0:u.state}|${(v=f==null?void 0:f.now)==null?void 0:v.by}|${Math.round(a/10)}`;if(this.inspectorKey!==x){this.inspectorKey=x;const S=(_,w)=>`<div class="in-row"><span class="in-k">${_}</span>${w}</div>`,T=a>0?`${Math.round(a).toLocaleString("en-GB")} m`:`${Math.round(-a).toLocaleString("en-GB")} m deep`,A=`${Math.abs(g).toFixed(1)}°${g>=0?"N":"S"} ${Math.abs((d+540)%360-180).toFixed(1)}°${(d+540)%360-180>=0?"E":"W"}`,k=f!=null&&f.now?`${f.now.by==="jp"?"held by Japan":"held by the Allies"}${f.now.c!==null&&i.clock.date>=f.now.c?", cut off":""}`:null;this.inspector.innerHTML=`
        ${l?`<div class="in-head"><b>${ut(l.name)}</b>${(M=l.ja)!=null&&M.kanji?`<span class="in-ja" lang="ja">${ut(l.ja.kanji)}</span>`:""}${l.today&&l.today!==l.name?`<span class="in-today">today ${ut(l.today)}</span>`:""}</div>`:""}
        ${k?S("on the date",ut(k)):""}
        ${u?S("the front",`<span class="in-pol"><i style="background:rgb(${u.colour.join(",")})"></i>${ut(u.pointsAndLines?"cities and railways held by Japan":u.label)}</span>`):""}
        ${S(a>0?"height":"depth",ut(T))}
        ${S("at",ut(A))}`}this.inspector.classList.add("show");const m=Math.min(innerWidth-250,t+18),p=Math.max(70,Math.min(innerHeight-140,e+18));this.inspector.style.transform=`translate(${m}px, ${p}px)`}settle(){this.timeline.finish(),this.snap=2,document.body.classList.add("snap")}refreshLegend(){const t=this.overlay.front?this.app.table.front.legend():null,e=JSON.stringify(t&&{k:t.keyframe,b:t.between,s:t.states.map(c=>c.id),d:t.declared,i:t.isles});if(e===this.legendKey)return;if(this.legendKey=e,this.legend.classList.toggle("show",!!t),!t){this.legend.innerHTML="";return}const i=t.between?`between ${ut(Us(Date.parse(t.between[0])))} and ${ut(Us(Date.parse(t.between[1])))}`:`as of ${ut(Us(Date.parse(t.date)))}`,s=t.states.map(c=>`<div class="lg"><i class="${c.hatch?"hatch":""}" style="--c:rgb(${c.colour.join(",")})"></i><b>${ut(c.label)}</b></div>`).join(""),o=t.pointsAndLines?'<div class="lg"><i class="hatch" style="--c:rgb(170,58,46)"></i><b>cities and railways held by Japan</b></div>':"",r=t.perimeter?'<div class="lg"><i class="dash"></i><b>the island area Japan held</b></div>':"",a=t.declared.map(c=>`<div class="lg"><i class="dash long"></i><b>${ut(c.name)}</b>${c.ja?` <span lang="ja">${ut(typeof c.ja=="string"?c.ja:c.ja.kanji)}</span>`:""}</div>`).join(""),l=[t.isles.jp&&'<span class="lg-isle jp"></span>held by Japan',t.isles.allied&&'<span class="lg-isle al"></span>held by the Allies',t.isles.cut&&'<span class="lg-isle cut"></span>cut off'].filter(Boolean);this.legend.innerHTML=`
      <div class="lg-title">The front <span>${i}</span></div>
      ${s}${o}${r}${a}
      ${l.length?`<div class="lg-isles">${l.map(c=>`<span>${c}</span>`).join("")}</div>`:""}`}update(t){const e=this.app,i=performance.now();e.software&&this._wall!==void 0&&(t=Math.max(t,Math.min(1,(i-this._wall)/1e3))),this._wall=i;const s=e.active===e.table;this.snap&&--this.snap===0&&document.body.classList.remove("snap"),this.timeline.el.hidden===s&&(this.timeline.el.hidden=!s),this.tools.classList.toggle("in-box",!s),this.brand.classList.toggle("in-box",!s),this.tools.classList.toggle("in-moment",e.mode==="moment"),this.timeline.update(t);const o=e.table.fade,r=this.pins.update(s&&this.overlay.pins&&o>.3);e.table.labels.update(r,s&&this.overlay.labels?o:0),s?performance.now()-(this.legendAt||0)>250&&(this.legendAt=performance.now(),this.refreshLegend(),this.legend.style.opacity=o.toFixed(2)):this.legend.classList.remove("show")}}const vw='<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',xw='<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5.5" width="4" height="13" rx="1"/><rect x="13.5" y="5.5" width="4" height="13" rx="1"/></svg>';class yw{constructor(t,e){this.on=e,this.el=Ge("div",{class:"boxbar",hidden:""}),this.el.innerHTML=`
      <div class="bb-watch">
        <button class="nav bb-leave" title="Back to the table (Esc)">${ue("prev",16)}<span>The table</span></button>
        <span class="bb-sep"></span>
        <button class="nav bb-prev" aria-label="The stop before" title="The stop before (←)">${ue("prev",16)}</button>
        <span class="bb-stop"><b class="bb-clock"></b><em class="bb-where"></em></span>
        <button class="nav bb-next" aria-label="The next stop" title="The next stop (→)">${ue("next",16)}</button>
        <span class="bb-sep"></span>
        <button class="nav bb-play" aria-label="Play or pause"></button>
        <button class="nav bb-speed" title="Watch speed"></button>
        <span class="bb-sep"></span>
        <button class="nav bb-brief" title="The briefing and its moments">${ue("take",16)}<span>Moments</span></button>
        <button class="nav bb-credits" aria-label="Sources and credits" title="Sources and credits">${ue("sources",16)}</button>
      </div>
      <div class="bb-check">
        <span class="bb-check-t">Checkpoint</span>
        <button class="nav finish bb-go">Keep going</button>
        <button class="nav bb-card">The card</button>
      </div>`,t.appendChild(this.el),this.$=i=>this.el.querySelector(i),this.el.addEventListener("click",i=>{var r;const s=i.target.closest("button");if(!s)return;const o=s.classList;o.contains("bb-leave")?e.leave():o.contains("bb-prev")?e.step(-1):o.contains("bb-next")?e.step(1):o.contains("bb-play")?((r=this.state)!=null&&r.running?e.pause:e.play)():o.contains("bb-speed")?e.speed(i.shiftKey?-1:1):o.contains("bb-brief")?e.briefing():o.contains("bb-credits")?e.credits():o.contains("bb-go")?e.keepGoing():o.contains("bb-card")&&e.card()}),this.key=""}set(t){this.state=t;const e=JSON.stringify(t);if(e===this.key||(this.key=e,this.el.hidden=!t||t.mode==="moment",!t))return;this.el.dataset.mode=t.mode,this.$(".bb-clock").textContent=t.clock||"",this.$(".bb-where").textContent=t.where||"";const[i,s]=t.stop||[-1,0];this.$(".bb-prev").disabled=!(s&&i>0),this.$(".bb-next").disabled=!(s&&i<s-1),this.$(".bb-play").innerHTML=t.running?xw:vw,this.$(".bb-play").title=t.running?"Pause":"Play",this.$(".bb-speed").innerHTML=`<span>×${ut(t.scale??1)}</span>`}}const Ou={sunk:"sank",scuttled:"was scuttled",capsized:"capsized",lost:"was lost",exploded:"blew up",beached:"was beached",wrecked:"was wrecked"},cl={jp:0,us:1};function Mw(n,t){const e=n.battle,i={stop:-1,offered:null,busy:!1};n.link=i;const s=new yw(t.root,{leave:()=>r(),step:y=>l(y),play:()=>e.play(Math.max(1,e.timeScale)),pause:()=>e.pause(),speed:y=>e.cycleTime(y),briefing:()=>f(),credits:()=>t.openCredits(),keepGoing:()=>{var y,v,M;e.keepGoing(),((v=(y=e.sim)==null?void 0:y.player)==null?void 0:v.kind)==="aircraft"&&!e.sim.player.scripted&&((M=e.input)==null||M.requestLock())},card:()=>e.finish("card")});i.bar=s,n.updaters.push(()=>{var T,A;const y=e.sim;if(!y||n.active!==e.scene||n.mode==="flying")return s.set(null);const v=y.momentState,M=e.input?v!=null&&v.checkpoint&&!e.running?"checkpoint":"moment":"watch",S=y.record.stops;s.set({mode:M,clock:y.clock.label(y.t),where:i.stop>=0?`stop ${i.stop+1} of ${S.length}`:((A=(T=e.loaded)==null?void 0:T.battle.title)==null?void 0:A.split(",")[0])??"",stop:[i.stop,S.length],running:e.running,scale:e.timeScale})}),t.onEnter=y=>o(y.box,{from:"table"}),t.onPrefetch=y=>n.prefetch(y.box),t.onTake=y=>d(y),t.onWatch=()=>e.play(Math.max(1,e.timeScale)),t.onWatchOn=()=>{e.play(1),n.url.moment=null},t.onLeave=()=>{if(n.mode==="flying")return e.abort();e.scene&&r()},t.onRetry=(y,v)=>{t.card.close();const M=e.restart(v==="checkpoint"?"checkpoint":"start");M&&M.then(g)},t.onStep=y=>l(y),addEventListener("keydown",y=>{y.key!=="Escape"||n.mode!=="moment"||document.pointerLockElement||(y.preventDefault(),e.release())}),n.events.addEventListener("battle",y=>{var S,T;const v=y.detail;v.kind==="checkpoint"&&document.pointerLockElement&&((S=document.exitPointerLock)==null||S.call(document));const M=v.kind==="rebuilt"&&v.stop!=null?(T=e.sim)==null?void 0:T.record.stops[v.stop]:null;M&&(i.stop=v.stop,e.lookAtStop(M),t.card.openStop(h(v.stop)))});async function o(y,{from:v="table",t:M=null,momentId:S=null}={}){if(!(i.busy||!n.data.boxById.has(y))){i.busy=!0;try{if(t.card.close(),t.help.classList.add("hidden"),!await e.enter(y,{from:v,t:M,momentId:S}))return;t.tour.setting=!0,n.clock.setDate(e.sim.clock.utc(0)),t.tour.setting=!1,i.stop=a(e.sim.t),i.offered=S,n.url.battle=y,n.url.moment=S,v!=="url"&&n.pushUrl(),f({focus:S})}finally{i.busy=!1}}}async function r({fromUrl:y=!1}={}){var v;if(!(i.busy||!e.scene)){i.busy=!0;try{t.card.close();const M=((v=e.loaded)==null?void 0:v.battle.event)??null;await e.leave(),n.url.battle=null,n.url.t=null,n.url.moment=null,i.stop=-1;const S=M?n.data.events.find(T=>T.id===M):null;S&&t.tour.open(S),y?n.replaceUrl():n.pushUrl()}finally{i.busy=!1}}}n.enterBox=o,n.leaveBox=r;function a(y){var S;const v=((S=e.sim)==null?void 0:S.record.stops)||[];let M=-1;return v.forEach((T,A)=>{T.t<=y+1e-6&&(M=A)}),M}function l(y){const v=e.sim;if(!v||e.input)return;const M=v.record.stops;if(!M.length)return;const S=i.stop<0?a(v.t):i.stop,T=Math.max(0,Math.min(M.length-1,S+y));c(T)}function c(y){const M=e.sim.record.stops[y];M&&e.scrub(M.t,{stop:y})===!0&&(i.stop=y,e.lookAtStop(M),t.card.openStop(h(y)))}n.goStop=c;function h(y){var k;const v=e.sim,M=e.loaded.battle,S=v.record.stops,T=S[y],A=[...v.record.moments.values()].filter(_=>Math.abs(_.t-T.t)<=300).map(_=>u(_));return{title:M.title,ja:M.ja,when:`${v.clock.dateLabel(T.t)}, ${v.clock.label(T.t,{seconds:T.t%60!==0})}`,clock:(k=M.clock)==null?void 0:k.name,text:T.text,sources:T.sources||[],index:y,count:S.length,moments:A}}function u(y,v=null){var w,C,F,z,P,B;const M=e.sim,S=e.loaded.battle,T=y.role||{},A=Object.keys(S.sides||{}).find(X=>{var J;return X===T.side||((J=S.sides[X])==null?void 0:J.side)===T.side})??T.side??null,k=((C=(w=S.sides)==null?void 0:w[A])==null?void 0:C.side)??A,_=T.unit?M.record.shipById.get(T.unit):null;return{id:y.id,title:y.title,ja:((F=y.ja)==null?void 0:F.kanji)??(typeof y.ja=="string"?y.ja:null),role:T.name||(_==null?void 0:_.name)||null,t:M.clock.label(y.t,{seconds:y.t%60!==0}),objective:((z=y.objective)==null?void 0:z.text)??null,focus:v===y.id,side:k==="japan"?"jp":k==="usa"?"us":k,sideName:((B=(P=S.sides)==null?void 0:P[A])==null?void 0:B.name)??Il(k)}}function f({focus:y=i.offered}={}){var C,F;const v=e.sim;if(!v)return;const M=e.loaded.battle,S=e.loaded.box,T=v.t,A=e.stopAt(T),k=n.data.events.find(z=>z.id===M.event),_=Object.entries(M.sides||{}).map(([z,P])=>{const B=P.side??z,J=(M.units||[]).filter(Y=>{var st;return(Y.side===z||Y.side===B)&&!((st=Y.station)!=null&&st.parked)&&!(Y.lonlat&&!Y.track)}).map(Y=>Y.ja?`${Y.name} ${Y.ja}`:Y.name),Z=J.length>16?[...J.slice(0,14),`and ${J.length-14} more ships`]:J;return{side:B,order:cl[B]??2,name:P.name||Il(B),ja:P.ja||null,units:Z}}).sort((z,P)=>z.order-P.order),w=[...v.record.moments.values()].sort((z,P)=>(cl[u(z).side]??2)-(cl[u(P).side]??2)||z.t-P.t).map(z=>u(z,y));t.openBriefing({title:M.title,ja:M.ja,when:`${v.clock.dateLabel(T)}, ${v.clock.label(T)}`,clock:(C=M.clock)==null?void 0:C.name,clockNote:(F=M.clock)==null?void 0:F.note,situation:(A==null?void 0:A.text)||(k==null?void 0:k.summary)||"",forces:_,moments:w,sources:M.sources||[],credit:S.credit||null})}i.openBriefing=f;function d(y){if(!e.sim||!e.sim.record.moments.has(y))return;t.card.close(),n.url.moment=y;const v=e.takeMoment(y);return i.stop=-1,v.then(g),v}n.take=d;function g(y){!y||!e.sim||t.openAfter(x(y))}function x(y){var st,tt,N,K,lt,_t,bt,Dt;const v=e.sim,M=e.loaded.battle,S=v.record.moments.get(y.momentId)||{},T=y.score||{},A=y.outcome||{diverged:[],guess:[]},k=O=>v.clock.label(O),_=[],w=(T.hits||[]).filter(O=>O.kind!=="near-miss"),C=(T.hits||[]).filter(O=>O.kind==="near-miss").reduce((O,Wt)=>O+Wt.count,0),F=O=>String(O).replace(/-hit$/,"").replace("-"," "),z=O=>[...new Set([].concat(O.where??[]).map(Wt=>String(Wt).trim()).filter(Boolean))].join(", ");_.push({label:"Hits",value:w.length?w.map(O=>`${O.name}: ${O.count} ${F(O.kind)} hit${O.count>1?"s":""}${z(O)?`, ${z(O)}`:""}`).join("; "):"none"}),C&&_.push({label:"Near misses",value:String(C)}),T.bombs&&_.push({label:"Bombs dropped",value:String(T.bombs)}),T.releaseM!=null&&_.push({label:"Release height",value:`${Math.round(T.releaseM)} m`}),T.torpedoes&&_.push({label:"Torpedoes",value:`${T.torpedoes} fired, ${T.torpedoesHit||0} hit`}),T.salvos&&_.push({label:"Salvos",value:`${T.salvos} (${T.shells||0} shells, ${T.straddles||0} straddling)`}),T.downed&&_.push({label:"Aircraft downed",value:String(T.downed)});const P=(((tt=v.units[(st=v.player)==null?void 0:st.unitIndex])==null?void 0:tt.kind)??(((N=S.role)==null?void 0:N.kind)==="ship"?"ship":"aircraft"))==="ship"||((K=S.role)==null?void 0:K.kind)==="ship",B=P?{lost:"lost",clock:"afloat when the battle clock ran out",released:"afloat, the controls given back",left:"afloat",card:"afloat"}[T.how??y.reason]:{landed:"landed",ditched:"ditched",lost:"did not return",clock:"still flying when the battle clock ran out",released:"still flying, the controls given back",left:"still flying",card:"still flying"}[T.how??y.reason];B&&_.push({label:P?"The ship":"Came back",value:T.survived===!1?P?"lost":"did not return":B}),T.timeS&&_.push({label:"Time",value:`${Math.floor(T.timeS/60)} min ${String(Math.round(T.timeS%60)).padStart(2,"0")} s`});const X=(A.diverged||[]).map(O=>({what:O.name||O.unit||O.group,yours:O.group?m(O.sim):O.sim})),J=(A.guess||[]).map(O=>typeof O=="string"?O:`${k(O.t)}: ${O.text}`),Z={text:((lt=S.after)==null?void 0:lt.text)||"",tellings:[...((_t=S.after)==null?void 0:_t.tellings)||[],...M.tellings||[]],sources:((bt=S.after)==null?void 0:bt.sources)||[]},Y=p(v,M);return{momentId:y.momentId,title:S.title,ja:((Dt=S.ja)==null?void 0:Dt.kanji)??(typeof S.ja=="string"?S.ja:null),sortie:_,battle:{rows:X,guesses:J},record:Z,next:Y,retry:{start:!0,checkpoint:!0}}}function m(y){return String(y).replace(/^(\d+) lost$/,(v,M)=>`${M} aircraft lost`)}function p(y,v){var F,z,P,B,X,J,Z,Y,st;const M=y.clock.duration,S=[],T=[],A=(F=v.clock)!=null&&F.name?`, ${v.clock.name}`:"",k=tt=>y.clock.dateLabel(tt)===y.clock.dateLabel(0)?`at ${y.clock.label(tt)}`:`on ${y.clock.dateLabel(tt)}, at ${y.clock.label(tt)}`,_=[];for(const tt of y.record.groups){const N=((z=tt.attack)==null?void 0:z.t)??((P=tt.enter)==null?void 0:P.t)??tt.launch;if(N==null||N<=M||!((B=tt.raw)!=null&&B.tokko))continue;const K=(((X=tt.attack)==null?void 0:X.targets)||[]).map(lt=>{var _t;return lt.unit>=0?(_t=y.record.ships[lt.unit])==null?void 0:_t.name:null}).filter(Boolean);_.push({t:N,text:`${k(N).replace(/^at /,"At ").replace(/^on /,"On ")}${A}, aircraft of ${tt.name.replace(/^The /,"the ")}, a tokkō (special attack) unit, dived on ${K.length?K.join(" and "):"the ships"}.`,sources:((J=tt.attack)==null?void 0:J.sources)||tt.sources})}for(const tt of y.record.ships){const N=tt.fate;(N==null?void 0:N.t)!=null&&N.t>M&&Ou[N.kind]&&_.push({t:N.t,text:`${tt.name} ${Ou[N.kind]} ${k(N.t)}${A}.`,sources:(Z=tt.raw.fate)==null?void 0:Z.sources})}_.sort((tt,N)=>tt.t-N.t);for(const[tt,N]of _.slice(0,5).entries()){S.push(tt&&A?N.text.replace(A,""):N.text);for(const K of N.sources||[])T.some(lt=>(lt.id??lt)===(K.id??K))||T.push(K)}const w=n.data.events,C=w.find(tt=>tt.id===v.event);if(C){const tt=Date.parse(((Y=C.when)==null?void 0:Y.to)??((st=C.when)==null?void 0:st.from)??"")||null,N=w.filter(K=>{var lt;return K!==C&&K.kind==="battle"&&((lt=K.when)==null?void 0:lt.from)&&(Date.parse(K.when.from)||0)>(tt??0)}).sort((K,lt)=>Date.parse(K.when.from)-Date.parse(lt.when.from))[0];N&&S.push(`Next on the table: ${N.title}${N.gloss?`, ${N.gloss}`:""}.`)}return{text:S.join(" "),sources:T.slice(0,6)}}n.urlBattle=async y=>{var A,k;if(i.busy||n.mode==="flying")return;const v=y.get("battle"),M=y.get("t"),S=y.get("moment"),T=((A=e.state)==null?void 0:A.boxId)??null;if(v&&!n.data.boxById.has(v)){n.warn(`#battle=${v}: no such box`);return}if(!v&&T)return r({fromUrl:!0});if(v&&v!==T){await o(v,{from:"url",t:M,momentId:S});const _=(k=y.get("cam"))==null?void 0:k.split(",").map(Number);(_==null?void 0:_.length)===5&&_.every(Number.isFinite)&&e.scene&&e.scene.rig.jump({x:_[0],z:_[1],distance:_[2],yaw:_[3],pitch:_[4]});return}if(v&&M&&e.sim)try{const _=e.sim.clock.parse(M);Math.abs(_-e.sim.t)>1&&e.scrub(M)}catch(_){n.warn(`#t=${M}: ${_.message}`)}v&&S&&S!==i.offered&&!e.input&&(i.offered=S,f({focus:S}))}}const Ti=document.getElementById("boot"),vf=Ti.querySelector(".boot-bar span"),xf=Ti.querySelector(".boot-stage"),Sa=(n,t)=>{xf.textContent=n,vf.style.width=`${Math.round(t*100)}%`},yf=[],Bu=n=>{yf.push(n),console.warn(n)},Hu=Ti.querySelector(".boot-credits");var Gu;(Gu=Ti.querySelector(".boot-credits-link"))==null||Gu.addEventListener("click",()=>{Hu.childElementCount||(Hu.innerHTML=`<div class="boot-credits-card"><h2>Sources and credits</h2>${gf(null)}</div>`),Ti.classList.toggle("reading")});async function _w(){const n=performance.now();Sa("reading the record",.05);const t=await Hf(wf(),Bu),e=new Y2(document.getElementById("scene"),t,{warn:Bu});e.warnings=yf,window.__app=e,Sa("laying out the table",.25),t.table.data=await e.decoder.decode(t.table),Sa("inking the coasts",.85),await new Promise(o=>setTimeout(o,0)),e.start(),Mw(e,new gw(e)),console.log(`table ready in ${((performance.now()-n)/1e3).toFixed(1)} s`),Sa("",1);let i=0;const s=()=>{if(++i<4)return requestAnimationFrame(s);e.ready=!0,e.fromUrl(),Ti.classList.contains("reading")&&e.ui.openCredits(),Ti.classList.add("gone"),setTimeout(()=>Ti.remove(),1200)};requestAnimationFrame(s)}_w().catch(n=>{console.error(n),xf.textContent="something went wrong — see the console",vf.style.background="#c0584a"});
