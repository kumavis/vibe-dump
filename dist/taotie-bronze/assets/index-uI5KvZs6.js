var td=Object.defineProperty;var ed=(n,t,e)=>t in n?td(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var mr=(n,t,e)=>ed(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const nd="modulepreload",id=function(n,t){return new URL(n,t).href},Hc={},Ti=function(t,e,i){let s=Promise.resolve();if(e&&e.length>0){const a=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(e.map(l=>{if(l=id(l,i),l in Hc)return;Hc[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!i)for(let g=a.length-1;g>=0;g--){const _=a[g];if(_.href===l&&(!h||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":nd,h||(d.as="script"),d.crossOrigin="",d.href=l,c&&d.setAttribute("nonce",c),document.head.appendChild(d),h)return new Promise((g,_)=>{d.addEventListener("load",g),d.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})};function Qh(n){let t=n>>>0;return function(){t=t+1831565813>>>0;let i=t;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function ka(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function tu(n,t){let e=n>>>0^Math.imul((t>>>0)+2654435769,2246822507);return e^=e>>>16,e=Math.imul(e,2146121005),e^=e>>>15,e=Math.imul(e,2221713035),e^=e>>>16,e>>>0}class $e{constructor(t=1){this.seed=typeof t=="string"?ka(t):t>>>0,this._next=Qh(this.seed)}next(){return this._next()}range(t,e){return t+(e-t)*this._next()}int(t,e){return t+Math.floor((e-t+1)*this._next())}jitter(t){return(this._next()*2-1)*t}gauss(){return this._next()+this._next()+this._next()+this._next()-2}chance(t){return this._next()<t}pick(t){return t[Math.floor(this._next()*t.length)]}fork(t){return new $e(tu(this.seed,typeof t=="string"?ka(t):t>>>0))}}function sd(n){return n instanceof $e?n:new $e(n)}let eu=(n,t)=>{if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(n,t);if(typeof document<"u"){const e=document.createElement("canvas");return e.width=n,e.height=t,e}throw new Error("taotie kit: no Canvas2D available — call setCanvasFactory()")};function Fa(n,t){return eu(Math.max(1,n|0),Math.max(1,t|0))}function rd(n){eu=n}function Vc(n){return n.getContext("2d",{willReadFrequently:!0})}const Zs=1e20;function Wc(n,t,e,i,s,r){let a=-1;for(let c=0;c<t;c++){const l=n[c];if(l>=Zs*.5)continue;if(a<0){a=0,s[0]=c,r[0]=-1/0,r[1]=1/0;continue}let h;for(;;){const u=s[a];if(h=(l+c*c-(n[u]+u*u))/(2*c-2*u),h<=r[a]&&a>0)a--;else break}if(h<=r[a]){s[0]=c,r[0]=-1/0,r[1]=1/0;continue}a++,s[a]=c,r[a]=h,r[a+1]=1/0}if(a<0){for(let c=0;c<t;c++)e[c]=Zs,i[c]=-1;return}let o=0;for(let c=0;c<t;c++){for(;r[o+1]<c;)o++;const l=s[o];e[c]=(c-l)*(c-l)+n[l],i[c]=l}}function mi(n,t,e){const i=Math.max(t,e),s=new Float64Array(i),r=new Float64Array(i),a=new Int32Array(i),o=new Int32Array(i),c=new Float64Array(i+1),l=new Float32Array(t*e),h=new Int32Array(t*e);for(let d=0;d<t;d++){for(let g=0;g<e;g++)s[g]=n[g*t+d]?0:Zs;Wc(s,e,r,a,o,c);for(let g=0;g<e;g++)l[g*t+d]=r[g],h[g*t+d]=a[g]}const u=new Float32Array(t*e),f=new Int32Array(t*e);for(let d=0;d<e;d++){const g=d*t;for(let _=0;_<t;_++)s[_]=l[g+_];Wc(s,t,r,a,o,c);for(let _=0;_<t;_++){const p=a[_];p<0||r[_]>=Zs*.5?(u[g+_]=Zs,f[g+_]=-1):(u[g+_]=r[_],f[g+_]=h[g+p]*t+p)}}return{dist2:u,nearest:f}}function od(n,t,e){return mi(n,t,e).dist2}function ad(n,t,e){if(n===0||t===0)return .5-e;if(n=Math.abs(n),t=Math.abs(t),n<t){const s=n;n=t,t=s}const i=.5*t/n;return e<i?.5*(n+t)-Math.sqrt(2*n*t*e):e<1-i?(.5-e)*n:-.5*(n+t)+Math.sqrt(2*n*t*(1-e))}function nu(n,t,e){const i=t*e,s=new Uint8Array(i),r=new Float32Array(i),a=new Float32Array(i),o=(f,d)=>f<0||d<0||f>=t||d>=e?0:n[d*t+f],c=Math.SQRT2;let l=!1;for(let f=0;f<e;f++)for(let d=0;d<t;d++){const g=f*t+d,_=n[g],p=_>=.5;let m=_>0&&_<1;if(m||(m=o(d-1,f)>=.5!==p||o(d+1,f)>=.5!==p||o(d,f-1)>=.5!==p||o(d,f+1)>=.5!==p),!m)continue;l=!0,s[g]=1;let x=-o(d-1,f-1)-c*o(d-1,f)-o(d-1,f+1)+o(d+1,f-1)+c*o(d+1,f)+o(d+1,f+1),v=-o(d-1,f-1)-c*o(d,f-1)-o(d+1,f-1)+o(d-1,f+1)+c*o(d,f+1)+o(d+1,f+1);const M=Math.hypot(x,v);M>1e-6?(x/=M,v/=M):(x=0,v=0);const E=M>1e-6?ad(x,v,_):.5-_;r[g]=d+x*E,a[g]=f+v*E}const h=new Float32Array(i);if(!l){const f=i&&n[0]>=.5?1:-1;return h.fill(f*Math.hypot(t,e)),h}const{nearest:u}=mi(s,t,e);for(let f=0;f<e;f++)for(let d=0;d<t;d++){const g=f*t+d,_=u[g],p=Math.hypot(d-r[_],f-a[_]);h[g]=n[g]>=.5?p:-p}return h}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const mc="160",Hi={ROTATE:0,DOLLY:1,PAN:2},Vi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},cd=0,qc=1,ld=2,iu=1,su=2,Wn=3,gi=0,Xe=1,Pn=2,di=0,ps=1,Xc=2,jc=3,Yc=4,hd=5,Ri=100,ud=101,fd=102,$c=103,Kc=104,dd=200,pd=201,md=202,gd=203,Oa=204,za=205,_d=206,vd=207,xd=208,Md=209,yd=210,bd=211,Sd=212,wd=213,Ed=214,Td=0,Ad=1,Rd=2,so=3,Pd=4,Ld=5,Cd=6,Dd=7,ru=0,Id=1,Ud=2,jn=0,Nd=1,kd=2,Fd=3,ou=4,Od=5,zd=6,au=300,ys=301,bs=302,Ba=303,Ga=304,wo=306,Ha=1e3,pn=1001,Va=1002,Oe=1003,Zc=1004,Oo=1005,sn=1006,Bd=1007,Ss=1008,Yn=1009,Gd=1010,Hd=1011,gc=1012,cu=1013,li=1014,hi=1015,nr=1016,lu=1017,hu=1018,Di=1020,Vd=1021,mn=1023,Wd=1024,qd=1025,Ii=1026,ws=1027,Xd=1028,uu=1029,jd=1030,fu=1031,du=1033,zo=33776,Bo=33777,Go=33778,Ho=33779,Jc=35840,Qc=35841,tl=35842,el=35843,pu=36196,nl=37492,il=37496,sl=37808,rl=37809,ol=37810,al=37811,cl=37812,ll=37813,hl=37814,ul=37815,fl=37816,dl=37817,pl=37818,ml=37819,gl=37820,_l=37821,Vo=36492,vl=36494,xl=36495,Yd=36283,Ml=36284,yl=36285,bl=36286,mu=3e3,Ui=3001,$d=3200,Kd=3201,gu=0,Zd=1,on="",Te="srgb",Kn="srgb-linear",_c="display-p3",Eo="display-p3-linear",ro="linear",ce="srgb",oo="rec709",ao="p3",Wi=7680,Sl=519,Jd=512,Qd=513,t0=514,_u=515,e0=516,n0=517,i0=518,s0=519,wl=35044,El="300 es",Wa=1035,Xn=2e3,co=2001;class Gi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const He=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Jr=Math.PI/180,lo=180/Math.PI;function Cs(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(He[n&255]+He[n>>8&255]+He[n>>16&255]+He[n>>24&255]+"-"+He[t&255]+He[t>>8&255]+"-"+He[t>>16&15|64]+He[t>>24&255]+"-"+He[e&63|128]+He[e>>8&255]+"-"+He[e>>16&255]+He[e>>24&255]+He[i&255]+He[i>>8&255]+He[i>>16&255]+He[i>>24&255]).toLowerCase()}function ze(n,t,e){return Math.max(t,Math.min(e,n))}function r0(n,t){return(n%t+t)%t}function Wo(n,t,e){return(1-e)*n+e*t}function Tl(n){return(n&n-1)===0&&n!==0}function qa(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Os(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ze(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const o0={DEG2RAD:Jr};class Lt{constructor(t=0,e=0){Lt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ze(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,i,s,r,a,o,c,l){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l)}set(t,e,i,s,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],u=i[7],f=i[2],d=i[5],g=i[8],_=s[0],p=s[3],m=s[6],x=s[1],v=s[4],M=s[7],E=s[2],w=s[5],b=s[8];return r[0]=a*_+o*x+c*E,r[3]=a*p+o*v+c*w,r[6]=a*m+o*M+c*b,r[1]=l*_+h*x+u*E,r[4]=l*p+h*v+u*w,r[7]=l*m+h*M+u*b,r[2]=f*_+d*x+g*E,r[5]=f*p+d*v+g*w,r[8]=f*m+d*M+g*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-i*r*h+i*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,f=o*c-h*r,d=l*r-a*c,g=e*u+i*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-h*i)*_,t[2]=(o*i-s*a)*_,t[3]=f*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-o*e)*_,t[6]=d*_,t[7]=(i*c-l*e)*_,t[8]=(a*e-i*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(qo.makeScale(t,e)),this}rotate(t){return this.premultiply(qo.makeRotation(-t)),this}translate(t,e){return this.premultiply(qo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const qo=new Jt;function vu(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function ho(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function a0(){const n=ho("canvas");return n.style.display="block",n}const Al={};function Js(n){n in Al||(Al[n]=!0,console.warn(n))}const Rl=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Pl=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),gr={[Kn]:{transfer:ro,primaries:oo,toReference:n=>n,fromReference:n=>n},[Te]:{transfer:ce,primaries:oo,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Eo]:{transfer:ro,primaries:ao,toReference:n=>n.applyMatrix3(Pl),fromReference:n=>n.applyMatrix3(Rl)},[_c]:{transfer:ce,primaries:ao,toReference:n=>n.convertSRGBToLinear().applyMatrix3(Pl),fromReference:n=>n.applyMatrix3(Rl).convertLinearToSRGB()}},c0=new Set([Kn,Eo]),ie={enabled:!0,_workingColorSpace:Kn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!c0.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=gr[t].toReference,s=gr[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return gr[n].primaries},getTransfer:function(n){return n===on?ro:gr[n].transfer}};function ms(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Xo(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let qi;class xu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{qi===void 0&&(qi=ho("canvas")),qi.width=t.width,qi.height=t.height;const i=qi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=qi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ho("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ms(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ms(e[i]/255)*255):e[i]=ms(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let l0=0;class Mu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:l0++}),this.uuid=Cs(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(jo(s[a].image)):r.push(jo(s[a]))}else r=jo(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function jo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?xu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let h0=0;class Ye extends Gi{constructor(t=Ye.DEFAULT_IMAGE,e=Ye.DEFAULT_MAPPING,i=pn,s=pn,r=sn,a=Ss,o=mn,c=Yn,l=Ye.DEFAULT_ANISOTROPY,h=on){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:h0++}),this.uuid=Cs(),this.name="",this.source=new Mu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Js("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Ui?Te:on),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==au)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ha:t.x=t.x-Math.floor(t.x);break;case pn:t.x=t.x<0?0:1;break;case Va:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ha:t.y=t.y-Math.floor(t.y);break;case pn:t.y=t.y<0?0:1;break;case Va:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Js("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Te?Ui:mu}set encoding(t){Js("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Ui?Te:on}}Ye.DEFAULT_IMAGE=null;Ye.DEFAULT_MAPPING=au;Ye.DEFAULT_ANISOTROPY=1;class Ie{constructor(t=0,e=0,i=0,s=1){Ie.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],_=c[2],p=c[6],m=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+p)<.1&&Math.abs(l+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,M=(d+1)/2,E=(m+1)/2,w=(h+f)/4,b=(u+_)/4,C=(g+p)/4;return v>M&&v>E?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=w/i,r=b/i):M>E?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=w/s,r=C/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=b/r,s=C/r),this.set(i,s,r,e),this}let x=Math.sqrt((p-g)*(p-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(u-_)/x,this.z=(f-h)/x,this.w=Math.acos((l+d+m-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class u0 extends Gi{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ie(0,0,t,e),this.scissorTest=!1,this.viewport=new Ie(0,0,t,e);const s={width:t,height:e,depth:1};i.encoding!==void 0&&(Js("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Ui?Te:on),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new Ye(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Mu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ki extends u0{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class yu extends Ye{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class f0 extends Ye{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fi{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const f=r[a+0],d=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==f||l!==d||h!==g){let p=1-o;const m=c*f+l*d+h*g+u*_,x=m>=0?1:-1,v=1-m*m;if(v>Number.EPSILON){const E=Math.sqrt(v),w=Math.atan2(E,m*x);p=Math.sin(p*w)/E,o=Math.sin(o*w)/E}const M=o*x;if(c=c*p+f*M,l=l*p+d*M,h=h*p+g*M,u=u*p+_*M,p===1-o){const E=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=E,l*=E,h*=E,u*=E}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[a],f=r[a+1],d=r[a+2],g=r[a+3];return t[e]=o*g+h*u+c*d-l*f,t[e+1]=c*g+h*f+l*u-o*d,t[e+2]=l*g+h*d+o*f-c*u,t[e+3]=h*g-o*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),u=o(r/2),f=c(i/2),d=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=i+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(a-s)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+l)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(r-l)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ze(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-i*l,this._z=r*h+a*l+i*c-s*o,this._w=a*h-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*i+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=a*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(r),i*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class q{constructor(t=0,e=0,i=0){q.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ll.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ll.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+c*l+a*u-o*h,this.y=i+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Yo.copy(this).projectOnVector(t),this.sub(Yo)}reflect(t){return this.sub(Yo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ze(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Yo=new q,Ll=new Fi;class En{constructor(t=new q(1/0,1/0,1/0),e=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Mn):Mn.fromBufferAttribute(r,a),Mn.applyMatrix4(t.matrixWorld),this.expandByPoint(Mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),_r.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),_r.copy(i.boundingBox)),_r.applyMatrix4(t.matrixWorld),this.union(_r)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Mn),Mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(zs),vr.subVectors(this.max,zs),Xi.subVectors(t.a,zs),ji.subVectors(t.b,zs),Yi.subVectors(t.c,zs),ei.subVectors(ji,Xi),ni.subVectors(Yi,ji),Mi.subVectors(Xi,Yi);let e=[0,-ei.z,ei.y,0,-ni.z,ni.y,0,-Mi.z,Mi.y,ei.z,0,-ei.x,ni.z,0,-ni.x,Mi.z,0,-Mi.x,-ei.y,ei.x,0,-ni.y,ni.x,0,-Mi.y,Mi.x,0];return!$o(e,Xi,ji,Yi,vr)||(e=[1,0,0,0,1,0,0,0,1],!$o(e,Xi,ji,Yi,vr))?!1:(xr.crossVectors(ei,ni),e=[xr.x,xr.y,xr.z],$o(e,Xi,ji,Yi,vr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(zn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const zn=[new q,new q,new q,new q,new q,new q,new q,new q],Mn=new q,_r=new En,Xi=new q,ji=new q,Yi=new q,ei=new q,ni=new q,Mi=new q,zs=new q,vr=new q,xr=new q,yi=new q;function $o(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){yi.fromArray(n,r);const o=s.x*Math.abs(yi.x)+s.y*Math.abs(yi.y)+s.z*Math.abs(yi.z),c=t.dot(yi),l=e.dot(yi),h=i.dot(yi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const d0=new En,Bs=new q,Ko=new q;class vc{constructor(t=new q,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):d0.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Bs.subVectors(t,this.center);const e=Bs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Bs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ko.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Bs.copy(t.center).add(Ko)),this.expandByPoint(Bs.copy(t.center).sub(Ko))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Bn=new q,Zo=new q,Mr=new q,ii=new q,Jo=new q,yr=new q,Qo=new q;class bu{constructor(t=new q,e=new q(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Bn.copy(this.origin).addScaledVector(this.direction,e),Bn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Zo.copy(t).add(e).multiplyScalar(.5),Mr.copy(e).sub(t).normalize(),ii.copy(this.origin).sub(Zo);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Mr),o=ii.dot(this.direction),c=-ii.dot(Mr),l=ii.lengthSq(),h=Math.abs(1-a*a);let u,f,d,g;if(h>0)if(u=a*c-o,f=a*o-c,g=r*h,u>=0)if(f>=-g)if(f<=g){const _=1/h;u*=_,f*=_,d=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Zo).addScaledVector(Mr,f),d}intersectSphere(t,e){Bn.subVectors(t.center,this.origin);const i=Bn.dot(this.direction),s=Bn.dot(Bn)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(i=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(i=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Bn)!==null}intersectTriangle(t,e,i,s,r){Jo.subVectors(e,t),yr.subVectors(i,t),Qo.crossVectors(Jo,yr);let a=this.direction.dot(Qo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ii.subVectors(this.origin,t);const c=o*this.direction.dot(yr.crossVectors(ii,yr));if(c<0)return null;const l=o*this.direction.dot(Jo.cross(ii));if(l<0||c+l>a)return null;const h=-o*ii.dot(Qo);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ae{constructor(t,e,i,s,r,a,o,c,l,h,u,f,d,g,_,p){ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l,h,u,f,d,g,_,p)}set(t,e,i,s,r,a,o,c,l,h,u,f,d,g,_,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=f,m[3]=d,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ae().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/$i.setFromMatrixColumn(t,0).length(),r=1/$i.setFromMatrixColumn(t,1).length(),a=1/$i.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*h,d=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+g*l,e[5]=f-_*l,e[9]=-o*c,e[2]=_-f*l,e[6]=g+d*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,g=l*h,_=l*u;e[0]=f+_*o,e[4]=g*o-d,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=d*o-g,e[6]=_+f*o,e[10]=a*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,g=l*h,_=l*u;e[0]=f-_*o,e[4]=-a*u,e[8]=g+d*o,e[1]=d+g*o,e[5]=a*h,e[9]=_-f*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const f=a*h,d=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=g*l-d,e[8]=f*l+_,e[1]=c*u,e[5]=_*l+f,e[9]=d*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,d=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-f*u,e[8]=g*u+d,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=d*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=a*c,d=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+_,e[5]=a*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=o*h,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(p0,t,m0)}lookAt(t,e,i){const s=this.elements;return en.subVectors(t,e),en.lengthSq()===0&&(en.z=1),en.normalize(),si.crossVectors(i,en),si.lengthSq()===0&&(Math.abs(i.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),si.crossVectors(i,en)),si.normalize(),br.crossVectors(en,si),s[0]=si.x,s[4]=br.x,s[8]=en.x,s[1]=si.y,s[5]=br.y,s[9]=en.y,s[2]=si.z,s[6]=br.z,s[10]=en.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],u=i[5],f=i[9],d=i[13],g=i[2],_=i[6],p=i[10],m=i[14],x=i[3],v=i[7],M=i[11],E=i[15],w=s[0],b=s[4],C=s[8],S=s[12],T=s[1],L=s[5],P=s[9],W=s[13],R=s[2],I=s[6],D=s[10],z=s[14],B=s[3],F=s[7],X=s[11],tt=s[15];return r[0]=a*w+o*T+c*R+l*B,r[4]=a*b+o*L+c*I+l*F,r[8]=a*C+o*P+c*D+l*X,r[12]=a*S+o*W+c*z+l*tt,r[1]=h*w+u*T+f*R+d*B,r[5]=h*b+u*L+f*I+d*F,r[9]=h*C+u*P+f*D+d*X,r[13]=h*S+u*W+f*z+d*tt,r[2]=g*w+_*T+p*R+m*B,r[6]=g*b+_*L+p*I+m*F,r[10]=g*C+_*P+p*D+m*X,r[14]=g*S+_*W+p*z+m*tt,r[3]=x*w+v*T+M*R+E*B,r[7]=x*b+v*L+M*I+E*F,r[11]=x*C+v*P+M*D+E*X,r[15]=x*S+v*W+M*z+E*tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],_=t[7],p=t[11],m=t[15];return g*(+r*c*u-s*l*u-r*o*f+i*l*f+s*o*d-i*c*d)+_*(+e*c*d-e*l*f+r*a*f-s*a*d+s*l*h-r*c*h)+p*(+e*l*u-e*o*d-r*a*u+i*a*d+r*o*h-i*l*h)+m*(-s*o*h-e*c*u+e*o*f+s*a*u-i*a*f+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],_=t[13],p=t[14],m=t[15],x=u*p*l-_*f*l+_*c*d-o*p*d-u*c*m+o*f*m,v=g*f*l-h*p*l-g*c*d+a*p*d+h*c*m-a*f*m,M=h*_*l-g*u*l+g*o*d-a*_*d-h*o*m+a*u*m,E=g*u*c-h*_*c-g*o*f+a*_*f+h*o*p-a*u*p,w=e*x+i*v+s*M+r*E;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/w;return t[0]=x*b,t[1]=(_*f*r-u*p*r-_*s*d+i*p*d+u*s*m-i*f*m)*b,t[2]=(o*p*r-_*c*r+_*s*l-i*p*l-o*s*m+i*c*m)*b,t[3]=(u*c*r-o*f*r-u*s*l+i*f*l+o*s*d-i*c*d)*b,t[4]=v*b,t[5]=(h*p*r-g*f*r+g*s*d-e*p*d-h*s*m+e*f*m)*b,t[6]=(g*c*r-a*p*r-g*s*l+e*p*l+a*s*m-e*c*m)*b,t[7]=(a*f*r-h*c*r+h*s*l-e*f*l-a*s*d+e*c*d)*b,t[8]=M*b,t[9]=(g*u*r-h*_*r-g*i*d+e*_*d+h*i*m-e*u*m)*b,t[10]=(a*_*r-g*o*r+g*i*l-e*_*l-a*i*m+e*o*m)*b,t[11]=(h*o*r-a*u*r-h*i*l+e*u*l+a*i*d-e*o*d)*b,t[12]=E*b,t[13]=(h*_*s-g*u*s+g*i*f-e*_*f-h*i*p+e*u*p)*b,t[14]=(g*o*s-a*_*s-g*i*c+e*_*c+a*i*p-e*o*p)*b,t[15]=(a*u*s-h*o*s+h*i*c-e*u*c-a*i*f+e*o*f)*b,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,f=r*l,d=r*h,g=r*u,_=a*h,p=a*u,m=o*u,x=c*l,v=c*h,M=c*u,E=i.x,w=i.y,b=i.z;return s[0]=(1-(_+m))*E,s[1]=(d+M)*E,s[2]=(g-v)*E,s[3]=0,s[4]=(d-M)*w,s[5]=(1-(f+m))*w,s[6]=(p+x)*w,s[7]=0,s[8]=(g+v)*b,s[9]=(p-x)*b,s[10]=(1-(f+_))*b,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=$i.set(s[0],s[1],s[2]).length();const a=$i.set(s[4],s[5],s[6]).length(),o=$i.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],yn.copy(this);const l=1/r,h=1/a,u=1/o;return yn.elements[0]*=l,yn.elements[1]*=l,yn.elements[2]*=l,yn.elements[4]*=h,yn.elements[5]*=h,yn.elements[6]*=h,yn.elements[8]*=u,yn.elements[9]*=u,yn.elements[10]*=u,e.setFromRotationMatrix(yn),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=Xn){const c=this.elements,l=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),f=(i+s)/(i-s);let d,g;if(o===Xn)d=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===co)d=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=Xn){const c=this.elements,l=1/(e-t),h=1/(i-s),u=1/(a-r),f=(e+t)*l,d=(i+s)*h;let g,_;if(o===Xn)g=(a+r)*u,_=-2*u;else if(o===co)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const $i=new q,yn=new ae,p0=new q(0,0,0),m0=new q(1,1,1),si=new q,br=new q,en=new q,Cl=new ae,Dl=new Fi;class To{constructor(t=0,e=0,i=0,s=To.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Cl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Cl,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Dl.setFromEuler(this),this.setFromQuaternion(Dl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}To.DEFAULT_ORDER="XYZ";class Su{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let g0=0;const Il=new q,Ki=new Fi,Gn=new ae,Sr=new q,Gs=new q,_0=new q,v0=new Fi,Ul=new q(1,0,0),Nl=new q(0,1,0),kl=new q(0,0,1),x0={type:"added"},M0={type:"removed"};class Re extends Gi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:g0++}),this.uuid=Cs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Re.DEFAULT_UP.clone();const t=new q,e=new To,i=new Fi,s=new q(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Jt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=Re.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Su,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.multiply(Ki),this}rotateOnWorldAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.premultiply(Ki),this}rotateX(t){return this.rotateOnAxis(Ul,t)}rotateY(t){return this.rotateOnAxis(Nl,t)}rotateZ(t){return this.rotateOnAxis(kl,t)}translateOnAxis(t,e){return Il.copy(t).applyQuaternion(this.quaternion),this.position.add(Il.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ul,t)}translateY(t){return this.translateOnAxis(Nl,t)}translateZ(t){return this.translateOnAxis(kl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Gn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Sr.copy(t):Sr.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gn.lookAt(Gs,Sr,this.up):Gn.lookAt(Sr,Gs,this.up),this.quaternion.setFromRotationMatrix(Gn),s&&(Gn.extractRotation(s.matrixWorld),Ki.setFromRotationMatrix(Gn),this.quaternion.premultiply(Ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(x0)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(M0)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Gn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Gn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Gn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,t,_0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,v0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++){const r=e[i];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Re.DEFAULT_UP=new q(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bn=new q,Hn=new q,ta=new q,Vn=new q,Zi=new q,Ji=new q,Fl=new q,ea=new q,na=new q,ia=new q;let wr=!1;class wn{constructor(t=new q,e=new q,i=new q){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),bn.subVectors(t,e),s.cross(bn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){bn.subVectors(s,e),Hn.subVectors(i,e),ta.subVectors(t,e);const a=bn.dot(bn),o=bn.dot(Hn),c=bn.dot(ta),l=Hn.dot(Hn),h=Hn.dot(ta),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*c-o*h)*f,g=(a*h-o*c)*f;return r.set(1-d-g,g,d)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getUV(t,e,i,s,r,a,o,c){return wr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),wr=!0),this.getInterpolation(t,e,i,s,r,a,o,c)}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,Vn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Vn.x),c.addScaledVector(a,Vn.y),c.addScaledVector(o,Vn.z),c)}static isFrontFacing(t,e,i,s){return bn.subVectors(i,e),Hn.subVectors(t,e),bn.cross(Hn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return bn.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),bn.cross(Hn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return wn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,r){return wr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),wr=!0),wn.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}getInterpolation(t,e,i,s,r){return wn.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;Zi.subVectors(s,i),Ji.subVectors(r,i),ea.subVectors(t,i);const c=Zi.dot(ea),l=Ji.dot(ea);if(c<=0&&l<=0)return e.copy(i);na.subVectors(t,s);const h=Zi.dot(na),u=Ji.dot(na);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(Zi,a);ia.subVectors(t,r);const d=Zi.dot(ia),g=Ji.dot(ia);if(g>=0&&d<=g)return e.copy(r);const _=d*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(i).addScaledVector(Ji,o);const p=h*g-d*u;if(p<=0&&u-h>=0&&d-g>=0)return Fl.subVectors(r,s),o=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(Fl,o);const m=1/(p+_+f);return a=_*m,o=f*m,e.copy(i).addScaledVector(Zi,a).addScaledVector(Ji,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const wu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ri={h:0,s:0,l:0},Er={h:0,s:0,l:0};function sa(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Xt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Te){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ie.workingColorSpace){return this.r=t,this.g=e,this.b=i,ie.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ie.workingColorSpace){if(t=r0(t,1),e=ze(e,0,1),i=ze(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=sa(a,r,t+1/3),this.g=sa(a,r,t),this.b=sa(a,r,t-1/3)}return ie.toWorkingColorSpace(this,s),this}setStyle(t,e=Te){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Te){const i=wu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ms(t.r),this.g=ms(t.g),this.b=ms(t.b),this}copyLinearToSRGB(t){return this.r=Xo(t.r),this.g=Xo(t.g),this.b=Xo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Te){return ie.fromWorkingColorSpace(Ve.copy(this),t),Math.round(ze(Ve.r*255,0,255))*65536+Math.round(ze(Ve.g*255,0,255))*256+Math.round(ze(Ve.b*255,0,255))}getHexString(t=Te){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.fromWorkingColorSpace(Ve.copy(this),e);const i=Ve.r,s=Ve.g,r=Ve.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.fromWorkingColorSpace(Ve.copy(this),e),t.r=Ve.r,t.g=Ve.g,t.b=Ve.b,t}getStyle(t=Te){ie.fromWorkingColorSpace(Ve.copy(this),t);const e=Ve.r,i=Ve.g,s=Ve.b;return t!==Te?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(ri),this.setHSL(ri.h+t,ri.s+e,ri.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ri),t.getHSL(Er);const i=Wo(ri.h,Er.h,e),s=Wo(ri.s,Er.s,e),r=Wo(ri.l,Er.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ve=new Xt;Xt.NAMES=wu;let y0=0;class dr extends Gi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:y0++}),this.uuid=Cs(),this.name="",this.type="Material",this.blending=ps,this.side=gi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Oa,this.blendDst=za,this.blendEquation=Ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xt(0,0,0),this.blendAlpha=0,this.depthFunc=so,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wi,this.stencilZFail=Wi,this.stencilZPass=Wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ps&&(i.blending=this.blending),this.side!==gi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Oa&&(i.blendSrc=this.blendSrc),this.blendDst!==za&&(i.blendDst=this.blendDst),this.blendEquation!==Ri&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==so&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Sl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Wi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Wi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Pi extends dr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ru,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const we=new q,Tr=new Lt;class Ae{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=wl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=hi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Tr.fromBufferAttribute(this,e),Tr.applyMatrix3(t),this.setXY(e,Tr.x,Tr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Os(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ze(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Os(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Os(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Os(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Os(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),i=Ze(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),i=Ze(i,this.array),s=Ze(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),i=Ze(i,this.array),s=Ze(s,this.array),r=Ze(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==wl&&(t.usage=this.usage),t}}class Ao extends Ae{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Ro extends Ae{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Me extends Ae{constructor(t,e,i){super(new Float32Array(t),e,i)}}let b0=0;const dn=new ae,ra=new Re,Qi=new q,nn=new En,Hs=new En,De=new q;class Ke extends Gi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:b0++}),this.uuid=Cs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vu(t)?Ro:Ao)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Jt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return dn.makeRotationFromQuaternion(t),this.applyMatrix4(dn),this}rotateX(t){return dn.makeRotationX(t),this.applyMatrix4(dn),this}rotateY(t){return dn.makeRotationY(t),this.applyMatrix4(dn),this}rotateZ(t){return dn.makeRotationZ(t),this.applyMatrix4(dn),this}translate(t,e,i){return dn.makeTranslation(t,e,i),this.applyMatrix4(dn),this}scale(t,e,i){return dn.makeScale(t,e,i),this.applyMatrix4(dn),this}lookAt(t){return ra.lookAt(t),ra.updateMatrix(),this.applyMatrix4(ra.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qi).negate(),this.translate(Qi.x,Qi.y,Qi.z),this}setFromPoints(t){const e=[];for(let i=0,s=t.length;i<s;i++){const r=t[i];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Me(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new En);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vc);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new q,1/0);return}if(t){const i=this.boundingSphere.center;if(nn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Hs.setFromBufferAttribute(o),this.morphTargetsRelative?(De.addVectors(nn.min,Hs.min),nn.expandByPoint(De),De.addVectors(nn.max,Hs.max),nn.expandByPoint(De)):(nn.expandByPoint(Hs.min),nn.expandByPoint(Hs.max))}nn.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)De.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(De));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)De.fromBufferAttribute(o,l),c&&(Qi.fromBufferAttribute(t,l),De.add(Qi)),s=Math.max(s,i.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ae(new Float32Array(4*o),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let T=0;T<o;T++)l[T]=new q,h[T]=new q;const u=new q,f=new q,d=new q,g=new Lt,_=new Lt,p=new Lt,m=new q,x=new q;function v(T,L,P){u.fromArray(s,T*3),f.fromArray(s,L*3),d.fromArray(s,P*3),g.fromArray(a,T*2),_.fromArray(a,L*2),p.fromArray(a,P*2),f.sub(u),d.sub(u),_.sub(g),p.sub(g);const W=1/(_.x*p.y-p.x*_.y);isFinite(W)&&(m.copy(f).multiplyScalar(p.y).addScaledVector(d,-_.y).multiplyScalar(W),x.copy(d).multiplyScalar(_.x).addScaledVector(f,-p.x).multiplyScalar(W),l[T].add(m),l[L].add(m),l[P].add(m),h[T].add(x),h[L].add(x),h[P].add(x))}let M=this.groups;M.length===0&&(M=[{start:0,count:i.length}]);for(let T=0,L=M.length;T<L;++T){const P=M[T],W=P.start,R=P.count;for(let I=W,D=W+R;I<D;I+=3)v(i[I+0],i[I+1],i[I+2])}const E=new q,w=new q,b=new q,C=new q;function S(T){b.fromArray(r,T*3),C.copy(b);const L=l[T];E.copy(L),E.sub(b.multiplyScalar(b.dot(L))).normalize(),w.crossVectors(C,L);const W=w.dot(h[T])<0?-1:1;c[T*4]=E.x,c[T*4+1]=E.y,c[T*4+2]=E.z,c[T*4+3]=W}for(let T=0,L=M.length;T<L;++T){const P=M[T],W=P.start,R=P.count;for(let I=W,D=W+R;I<D;I+=3)S(i[I+0]),S(i[I+1]),S(i[I+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ae(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const s=new q,r=new q,a=new q,o=new q,c=new q,l=new q,h=new q,u=new q;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),_=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,p),o.add(h),c.add(h),l.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,f=new l.constructor(c.length*h);let d=0,g=0;for(let _=0,p=c.length;_<p;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*h;for(let m=0;m<h;m++)f[g++]=l[d++]}return new Ae(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ke,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,i);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ol=new ae,bi=new bu,Ar=new vc,zl=new q,ts=new q,es=new q,ns=new q,oa=new q,Rr=new q,Pr=new Lt,Lr=new Lt,Cr=new Lt,Bl=new q,Gl=new q,Hl=new q,Dr=new q,Ir=new q;class ue extends Re{constructor(t=new Ke,e=new Pi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Rr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(oa.fromBufferAttribute(u,t),a?Rr.addScaledVector(oa,h):Rr.addScaledVector(oa.sub(e),h))}e.add(Rr)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ar.copy(i.boundingSphere),Ar.applyMatrix4(r),bi.copy(t.ray).recast(t.near),!(Ar.containsPoint(bi.origin)===!1&&(bi.intersectSphere(Ar,zl)===null||bi.origin.distanceToSquared(zl)>(t.far-t.near)**2))&&(Ol.copy(r).invert(),bi.copy(t.ray).applyMatrix4(Ol),!(i.boundingBox!==null&&bi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,bi)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],x=Math.max(p.start,d.start),v=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let M=x,E=v;M<E;M+=3){const w=o.getX(M),b=o.getX(M+1),C=o.getX(M+2);s=Ur(this,m,t,i,l,h,u,w,b,C),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let p=g,m=_;p<m;p+=3){const x=o.getX(p),v=o.getX(p+1),M=o.getX(p+2);s=Ur(this,a,t,i,l,h,u,x,v,M),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],x=Math.max(p.start,d.start),v=Math.min(c.count,Math.min(p.start+p.count,d.start+d.count));for(let M=x,E=v;M<E;M+=3){const w=M,b=M+1,C=M+2;s=Ur(this,m,t,i,l,h,u,w,b,C),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let p=g,m=_;p<m;p+=3){const x=p,v=p+1,M=p+2;s=Ur(this,a,t,i,l,h,u,x,v,M),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function S0(n,t,e,i,s,r,a,o){let c;if(t.side===Xe?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===gi,o),c===null)return null;Ir.copy(o),Ir.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Ir);return l<e.near||l>e.far?null:{distance:l,point:Ir.clone(),object:n}}function Ur(n,t,e,i,s,r,a,o,c,l){n.getVertexPosition(o,ts),n.getVertexPosition(c,es),n.getVertexPosition(l,ns);const h=S0(n,t,e,i,ts,es,ns,Dr);if(h){s&&(Pr.fromBufferAttribute(s,o),Lr.fromBufferAttribute(s,c),Cr.fromBufferAttribute(s,l),h.uv=wn.getInterpolation(Dr,ts,es,ns,Pr,Lr,Cr,new Lt)),r&&(Pr.fromBufferAttribute(r,o),Lr.fromBufferAttribute(r,c),Cr.fromBufferAttribute(r,l),h.uv1=wn.getInterpolation(Dr,ts,es,ns,Pr,Lr,Cr,new Lt),h.uv2=h.uv1),a&&(Bl.fromBufferAttribute(a,o),Gl.fromBufferAttribute(a,c),Hl.fromBufferAttribute(a,l),h.normal=wn.getInterpolation(Dr,ts,es,ns,Bl,Gl,Hl,new q),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new q,materialIndex:0};wn.getNormal(ts,es,ns,u.normal),h.face=u}return h}class Ds extends Ke{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Me(l,3)),this.setAttribute("normal",new Me(h,3)),this.setAttribute("uv",new Me(u,2));function g(_,p,m,x,v,M,E,w,b,C,S){const T=M/b,L=E/C,P=M/2,W=E/2,R=w/2,I=b+1,D=C+1;let z=0,B=0;const F=new q;for(let X=0;X<D;X++){const tt=X*L-W;for(let J=0;J<I;J++){const U=J*T-P;F[_]=U*x,F[p]=tt*v,F[m]=R,l.push(F.x,F.y,F.z),F[_]=0,F[p]=0,F[m]=w>0?1:-1,h.push(F.x,F.y,F.z),u.push(J/b),u.push(1-X/C),z+=1}}for(let X=0;X<C;X++)for(let tt=0;tt<b;tt++){const J=f+tt+I*X,U=f+tt+I*(X+1),Y=f+(tt+1)+I*(X+1),G=f+(tt+1)+I*X;c.push(J,U,G),c.push(U,Y,G),B+=6}o.addGroup(d,B,S),d+=B,f+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ds(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Es(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function je(n){const t={};for(let e=0;e<n.length;e++){const i=Es(n[e]);for(const s in i)t[s]=i[s]}return t}function w0(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Eu(n){return n.getRenderTarget()===null?n.outputColorSpace:ie.workingColorSpace}const E0={clone:Es,merge:je};var T0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,A0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Oi extends dr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=T0,this.fragmentShader=A0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Es(t.uniforms),this.uniformsGroups=w0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Tu extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Xn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class rn extends Tu{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=lo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Jr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return lo*2*Math.atan(Math.tan(Jr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Jr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const is=-90,ss=1;class R0 extends Re{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new rn(is,ss,t,e);s.layers=this.layers,this.add(s);const r=new rn(is,ss,t,e);r.layers=this.layers,this.add(r);const a=new rn(is,ss,t,e);a.layers=this.layers,this.add(a);const o=new rn(is,ss,t,e);o.layers=this.layers,this.add(o);const c=new rn(is,ss,t,e);c.layers=this.layers,this.add(c);const l=new rn(is,ss,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Xn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===co)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Au extends Ye{constructor(t,e,i,s,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:ys,super(t,e,i,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class P0 extends ki{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(Js("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Ui?Te:on),this.texture=new Au(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ds(5,5,5),r=new Oi({name:"CubemapFromEquirect",uniforms:Es(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Xe,blending:di});r.uniforms.tEquirect.value=e;const a=new ue(s,r),o=e.minFilter;return e.minFilter===Ss&&(e.minFilter=sn),new R0(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}const aa=new q,L0=new q,C0=new Jt;class ci{constructor(t=new q(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=aa.subVectors(i,e).cross(L0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(aa),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||C0.getNormalMatrix(t),s=this.coplanarPoint(aa).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Si=new vc,Nr=new q;class xc{constructor(t=new ci,e=new ci,i=new ci,s=new ci,r=new ci,a=new ci){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Xn){const i=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],d=s[8],g=s[9],_=s[10],p=s[11],m=s[12],x=s[13],v=s[14],M=s[15];if(i[0].setComponents(c-r,f-l,p-d,M-m).normalize(),i[1].setComponents(c+r,f+l,p+d,M+m).normalize(),i[2].setComponents(c+a,f+h,p+g,M+x).normalize(),i[3].setComponents(c-a,f-h,p-g,M-x).normalize(),i[4].setComponents(c-o,f-u,p-_,M-v).normalize(),e===Xn)i[5].setComponents(c+o,f+u,p+_,M+v).normalize();else if(e===co)i[5].setComponents(o,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Si.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Si.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Si)}intersectsSprite(t){return Si.center.set(0,0,0),Si.radius=.7071067811865476,Si.applyMatrix4(t.matrixWorld),this.intersectsSphere(Si)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Nr.x=s.normal.x>0?t.max.x:t.min.x,Nr.y=s.normal.y>0?t.max.y:t.min.y,Nr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Nr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ru(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function D0(n,t){const e=t.isWebGL2,i=new WeakMap;function s(l,h){const u=l.array,f=l.usage,d=u.byteLength,g=n.createBuffer();n.bindBuffer(h,g),n.bufferData(h,u,f),l.onUploadCallback();let _;if(u instanceof Float32Array)_=n.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)_=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=n.SHORT;else if(u instanceof Uint32Array)_=n.UNSIGNED_INT;else if(u instanceof Int32Array)_=n.INT;else if(u instanceof Int8Array)_=n.BYTE;else if(u instanceof Uint8Array)_=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:d}}function r(l,h,u){const f=h.array,d=h._updateRange,g=h.updateRanges;if(n.bindBuffer(u,l),d.count===-1&&g.length===0&&n.bufferSubData(u,0,f),g.length!==0){for(let _=0,p=g.length;_<p;_++){const m=g[_];e?n.bufferSubData(u,m.start*f.BYTES_PER_ELEMENT,f,m.start,m.count):n.bufferSubData(u,m.start*f.BYTES_PER_ELEMENT,f.subarray(m.start,m.start+m.count))}h.clearUpdateRanges()}d.count!==-1&&(e?n.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):n.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),i.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=i.get(l);h&&(n.deleteBuffer(h.buffer),i.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const f=i.get(l);(!f||f.version<l.version)&&i.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=i.get(l);if(u===void 0)i.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:a,remove:o,update:c}}class gs extends Ke{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,u=t/o,f=e/c,d=[],g=[],_=[],p=[];for(let m=0;m<h;m++){const x=m*f-a;for(let v=0;v<l;v++){const M=v*u-r;g.push(M,-x,0),_.push(0,0,1),p.push(v/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let x=0;x<o;x++){const v=x+l*m,M=x+l*(m+1),E=x+1+l*(m+1),w=x+1+l*m;d.push(v,M,w),d.push(M,E,w)}this.setIndex(d),this.setAttribute("position",new Me(g,3)),this.setAttribute("normal",new Me(_,3)),this.setAttribute("uv",new Me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gs(t.width,t.height,t.widthSegments,t.heightSegments)}}var I0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,U0=`#ifdef USE_ALPHAHASH
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
#endif`,N0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,k0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,F0=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,O0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,z0=`#ifdef USE_AOMAP
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
#endif`,B0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,G0=`#ifdef USE_BATCHING
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
#endif`,H0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,V0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,W0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,q0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,X0=`#ifdef USE_IRIDESCENCE
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
#endif`,j0=`#ifdef USE_BUMPMAP
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
#endif`,Y0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,K0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Z0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,J0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Q0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,tp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,ep=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,np=`#define PI 3.141592653589793
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
} // validated`,ip=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,sp=`vec3 transformedNormal = objectNormal;
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
#endif`,rp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,op=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ap=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lp="gl_FragColor = linearToOutputTexel( gl_FragColor );",hp=`
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
}`,up=`#ifdef USE_ENVMAP
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
#endif`,fp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,dp=`#ifdef USE_ENVMAP
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
#endif`,pp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mp=`#ifdef USE_ENVMAP
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
#endif`,gp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,_p=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Mp=`#ifdef USE_GRADIENTMAP
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
}`,yp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,bp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Sp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ep=`uniform bool receiveShadow;
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
#endif`,Tp=`#ifdef USE_ENVMAP
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
#endif`,Ap=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Rp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Lp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cp=`PhysicalMaterial material;
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
#endif`,Dp=`struct PhysicalMaterial {
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
}`,Ip=`
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
#endif`,Up=`#if defined( RE_IndirectDiffuse )
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
#endif`,Np=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,kp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Op=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,zp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Bp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Hp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Vp=`#if defined( USE_POINTS_UV )
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
#endif`,Wp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,qp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jp=`#ifdef USE_MORPHNORMALS
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
#endif`,Yp=`#ifdef USE_MORPHTARGETS
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
#endif`,$p=`#ifdef USE_MORPHTARGETS
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
#endif`,Kp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Zp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Jp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,em=`#ifdef USE_NORMALMAP
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
#endif`,nm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,im=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,sm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,rm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,om=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,am=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,cm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,hm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,um=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,pm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,mm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,_m=`float getShadowMask() {
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
}`,vm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xm=`#ifdef USE_SKINNING
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
#endif`,Mm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ym=`#ifdef USE_SKINNING
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
#endif`,bm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Em=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Tm=`#ifdef USE_TRANSMISSION
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
#endif`,Am=`#ifdef USE_TRANSMISSION
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
#endif`,Rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Im=`uniform sampler2D t2D;
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
}`,Um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Om=`#include <common>
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
}`,zm=`#if DEPTH_PACKING == 3200
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
}`,Bm=`#define DISTANCE
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
}`,Gm=`#define DISTANCE
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
}`,Hm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wm=`uniform float scale;
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
}`,qm=`uniform vec3 diffuse;
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
}`,Xm=`#include <common>
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
}`,jm=`uniform vec3 diffuse;
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
}`,Ym=`#define LAMBERT
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
}`,$m=`#define LAMBERT
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
}`,Km=`#define MATCAP
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
}`,Zm=`#define MATCAP
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
}`,Jm=`#define NORMAL
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
}`,Qm=`#define NORMAL
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
}`,tg=`#define PHONG
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
}`,eg=`#define PHONG
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
}`,ng=`#define STANDARD
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
}`,ig=`#define STANDARD
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
}`,sg=`#define TOON
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
}`,rg=`#define TOON
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
}`,og=`uniform float size;
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
}`,ag=`uniform vec3 diffuse;
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
}`,cg=`#include <common>
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
}`,lg=`uniform vec3 color;
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
}`,hg=`uniform float rotation;
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
}`,ug=`uniform vec3 diffuse;
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
}`,$t={alphahash_fragment:I0,alphahash_pars_fragment:U0,alphamap_fragment:N0,alphamap_pars_fragment:k0,alphatest_fragment:F0,alphatest_pars_fragment:O0,aomap_fragment:z0,aomap_pars_fragment:B0,batching_pars_vertex:G0,batching_vertex:H0,begin_vertex:V0,beginnormal_vertex:W0,bsdfs:q0,iridescence_fragment:X0,bumpmap_pars_fragment:j0,clipping_planes_fragment:Y0,clipping_planes_pars_fragment:$0,clipping_planes_pars_vertex:K0,clipping_planes_vertex:Z0,color_fragment:J0,color_pars_fragment:Q0,color_pars_vertex:tp,color_vertex:ep,common:np,cube_uv_reflection_fragment:ip,defaultnormal_vertex:sp,displacementmap_pars_vertex:rp,displacementmap_vertex:op,emissivemap_fragment:ap,emissivemap_pars_fragment:cp,colorspace_fragment:lp,colorspace_pars_fragment:hp,envmap_fragment:up,envmap_common_pars_fragment:fp,envmap_pars_fragment:dp,envmap_pars_vertex:pp,envmap_physical_pars_fragment:Tp,envmap_vertex:mp,fog_vertex:gp,fog_pars_vertex:_p,fog_fragment:vp,fog_pars_fragment:xp,gradientmap_pars_fragment:Mp,lightmap_fragment:yp,lightmap_pars_fragment:bp,lights_lambert_fragment:Sp,lights_lambert_pars_fragment:wp,lights_pars_begin:Ep,lights_toon_fragment:Ap,lights_toon_pars_fragment:Rp,lights_phong_fragment:Pp,lights_phong_pars_fragment:Lp,lights_physical_fragment:Cp,lights_physical_pars_fragment:Dp,lights_fragment_begin:Ip,lights_fragment_maps:Up,lights_fragment_end:Np,logdepthbuf_fragment:kp,logdepthbuf_pars_fragment:Fp,logdepthbuf_pars_vertex:Op,logdepthbuf_vertex:zp,map_fragment:Bp,map_pars_fragment:Gp,map_particle_fragment:Hp,map_particle_pars_fragment:Vp,metalnessmap_fragment:Wp,metalnessmap_pars_fragment:qp,morphcolor_vertex:Xp,morphnormal_vertex:jp,morphtarget_pars_vertex:Yp,morphtarget_vertex:$p,normal_fragment_begin:Kp,normal_fragment_maps:Zp,normal_pars_fragment:Jp,normal_pars_vertex:Qp,normal_vertex:tm,normalmap_pars_fragment:em,clearcoat_normal_fragment_begin:nm,clearcoat_normal_fragment_maps:im,clearcoat_pars_fragment:sm,iridescence_pars_fragment:rm,opaque_fragment:om,packing:am,premultiplied_alpha_fragment:cm,project_vertex:lm,dithering_fragment:hm,dithering_pars_fragment:um,roughnessmap_fragment:fm,roughnessmap_pars_fragment:dm,shadowmap_pars_fragment:pm,shadowmap_pars_vertex:mm,shadowmap_vertex:gm,shadowmask_pars_fragment:_m,skinbase_vertex:vm,skinning_pars_vertex:xm,skinning_vertex:Mm,skinnormal_vertex:ym,specularmap_fragment:bm,specularmap_pars_fragment:Sm,tonemapping_fragment:wm,tonemapping_pars_fragment:Em,transmission_fragment:Tm,transmission_pars_fragment:Am,uv_pars_fragment:Rm,uv_pars_vertex:Pm,uv_vertex:Lm,worldpos_vertex:Cm,background_vert:Dm,background_frag:Im,backgroundCube_vert:Um,backgroundCube_frag:Nm,cube_vert:km,cube_frag:Fm,depth_vert:Om,depth_frag:zm,distanceRGBA_vert:Bm,distanceRGBA_frag:Gm,equirect_vert:Hm,equirect_frag:Vm,linedashed_vert:Wm,linedashed_frag:qm,meshbasic_vert:Xm,meshbasic_frag:jm,meshlambert_vert:Ym,meshlambert_frag:$m,meshmatcap_vert:Km,meshmatcap_frag:Zm,meshnormal_vert:Jm,meshnormal_frag:Qm,meshphong_vert:tg,meshphong_frag:eg,meshphysical_vert:ng,meshphysical_frag:ig,meshtoon_vert:sg,meshtoon_frag:rg,points_vert:og,points_frag:ag,shadow_vert:cg,shadow_frag:lg,sprite_vert:hg,sprite_frag:ug},It={common:{diffuse:{value:new Xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new Xt(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Rn={basic:{uniforms:je([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:je([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.fog,It.lights,{emissive:{value:new Xt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:je([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.fog,It.lights,{emissive:{value:new Xt(0)},specular:{value:new Xt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:je([It.common,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.roughnessmap,It.metalnessmap,It.fog,It.lights,{emissive:{value:new Xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:je([It.common,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.gradientmap,It.fog,It.lights,{emissive:{value:new Xt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:je([It.common,It.bumpmap,It.normalmap,It.displacementmap,It.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:je([It.points,It.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:je([It.common,It.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:je([It.common,It.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:je([It.common,It.bumpmap,It.normalmap,It.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:je([It.sprite,It.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:je([It.common,It.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:je([It.lights,It.fog,{color:{value:new Xt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};Rn.physical={uniforms:je([Rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new Xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new Xt(0)},specularColor:{value:new Xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const kr={r:0,b:0,g:0};function fg(n,t,e,i,s,r,a){const o=new Xt(0);let c=r===!0?0:1,l,h,u=null,f=0,d=null;function g(p,m){let x=!1,v=m.isScene===!0?m.background:null;v&&v.isTexture&&(v=(m.backgroundBlurriness>0?e:t).get(v)),v===null?_(o,c):v&&v.isColor&&(_(v,1),x=!0);const M=n.xr.getEnvironmentBlendMode();M==="additive"?i.buffers.color.setClear(0,0,0,1,a):M==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||x)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),v&&(v.isCubeTexture||v.mapping===wo)?(h===void 0&&(h=new ue(new Ds(1,1,1),new Oi({name:"BackgroundCubeMaterial",uniforms:Es(Rn.backgroundCube.uniforms),vertexShader:Rn.backgroundCube.vertexShader,fragmentShader:Rn.backgroundCube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,w,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,h.material.toneMapped=ie.getTransfer(v.colorSpace)!==ce,(u!==v||f!==v.version||d!==n.toneMapping)&&(h.material.needsUpdate=!0,u=v,f=v.version,d=n.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ue(new gs(2,2),new Oi({name:"BackgroundMaterial",uniforms:Es(Rn.background.uniforms),vertexShader:Rn.background.vertexShader,fragmentShader:Rn.background.fragmentShader,side:gi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,l.material.toneMapped=ie.getTransfer(v.colorSpace)!==ce,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,d=n.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function _(p,m){p.getRGB(kr,Eu(n)),i.buffers.color.setClear(kr.r,kr.g,kr.b,m,a)}return{getClearColor:function(){return o},setClearColor:function(p,m=1){o.set(p),c=m,_(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,_(o,c)},render:g}}function dg(n,t,e,i){const s=n.getParameter(n.MAX_VERTEX_ATTRIBS),r=i.isWebGL2?null:t.get("OES_vertex_array_object"),a=i.isWebGL2||r!==null,o={},c=p(null);let l=c,h=!1;function u(R,I,D,z,B){let F=!1;if(a){const X=_(z,D,I);l!==X&&(l=X,d(l.object)),F=m(R,z,D,B),F&&x(R,z,D,B)}else{const X=I.wireframe===!0;(l.geometry!==z.id||l.program!==D.id||l.wireframe!==X)&&(l.geometry=z.id,l.program=D.id,l.wireframe=X,F=!0)}B!==null&&e.update(B,n.ELEMENT_ARRAY_BUFFER),(F||h)&&(h=!1,C(R,I,D,z),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function f(){return i.isWebGL2?n.createVertexArray():r.createVertexArrayOES()}function d(R){return i.isWebGL2?n.bindVertexArray(R):r.bindVertexArrayOES(R)}function g(R){return i.isWebGL2?n.deleteVertexArray(R):r.deleteVertexArrayOES(R)}function _(R,I,D){const z=D.wireframe===!0;let B=o[R.id];B===void 0&&(B={},o[R.id]=B);let F=B[I.id];F===void 0&&(F={},B[I.id]=F);let X=F[z];return X===void 0&&(X=p(f()),F[z]=X),X}function p(R){const I=[],D=[],z=[];for(let B=0;B<s;B++)I[B]=0,D[B]=0,z[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:D,attributeDivisors:z,object:R,attributes:{},index:null}}function m(R,I,D,z){const B=l.attributes,F=I.attributes;let X=0;const tt=D.getAttributes();for(const J in tt)if(tt[J].location>=0){const Y=B[J];let G=F[J];if(G===void 0&&(J==="instanceMatrix"&&R.instanceMatrix&&(G=R.instanceMatrix),J==="instanceColor"&&R.instanceColor&&(G=R.instanceColor)),Y===void 0||Y.attribute!==G||G&&Y.data!==G.data)return!0;X++}return l.attributesNum!==X||l.index!==z}function x(R,I,D,z){const B={},F=I.attributes;let X=0;const tt=D.getAttributes();for(const J in tt)if(tt[J].location>=0){let Y=F[J];Y===void 0&&(J==="instanceMatrix"&&R.instanceMatrix&&(Y=R.instanceMatrix),J==="instanceColor"&&R.instanceColor&&(Y=R.instanceColor));const G={};G.attribute=Y,Y&&Y.data&&(G.data=Y.data),B[J]=G,X++}l.attributes=B,l.attributesNum=X,l.index=z}function v(){const R=l.newAttributes;for(let I=0,D=R.length;I<D;I++)R[I]=0}function M(R){E(R,0)}function E(R,I){const D=l.newAttributes,z=l.enabledAttributes,B=l.attributeDivisors;D[R]=1,z[R]===0&&(n.enableVertexAttribArray(R),z[R]=1),B[R]!==I&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,I),B[R]=I)}function w(){const R=l.newAttributes,I=l.enabledAttributes;for(let D=0,z=I.length;D<z;D++)I[D]!==R[D]&&(n.disableVertexAttribArray(D),I[D]=0)}function b(R,I,D,z,B,F,X){X===!0?n.vertexAttribIPointer(R,I,D,B,F):n.vertexAttribPointer(R,I,D,z,B,F)}function C(R,I,D,z){if(i.isWebGL2===!1&&(R.isInstancedMesh||z.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();const B=z.attributes,F=D.getAttributes(),X=I.defaultAttributeValues;for(const tt in F){const J=F[tt];if(J.location>=0){let U=B[tt];if(U===void 0&&(tt==="instanceMatrix"&&R.instanceMatrix&&(U=R.instanceMatrix),tt==="instanceColor"&&R.instanceColor&&(U=R.instanceColor)),U!==void 0){const Y=U.normalized,G=U.itemSize,K=e.get(U);if(K===void 0)continue;const Q=K.buffer,nt=K.type,rt=K.bytesPerElement,ct=i.isWebGL2===!0&&(nt===n.INT||nt===n.UNSIGNED_INT||U.gpuType===cu);if(U.isInterleavedBufferAttribute){const _t=U.data,H=_t.stride,V=U.offset;if(_t.isInstancedInterleavedBuffer){for(let j=0;j<J.locationSize;j++)E(J.location+j,_t.meshPerAttribute);R.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=_t.meshPerAttribute*_t.count)}else for(let j=0;j<J.locationSize;j++)M(J.location+j);n.bindBuffer(n.ARRAY_BUFFER,Q);for(let j=0;j<J.locationSize;j++)b(J.location+j,G/J.locationSize,nt,Y,H*rt,(V+G/J.locationSize*j)*rt,ct)}else{if(U.isInstancedBufferAttribute){for(let _t=0;_t<J.locationSize;_t++)E(J.location+_t,U.meshPerAttribute);R.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=U.meshPerAttribute*U.count)}else for(let _t=0;_t<J.locationSize;_t++)M(J.location+_t);n.bindBuffer(n.ARRAY_BUFFER,Q);for(let _t=0;_t<J.locationSize;_t++)b(J.location+_t,G/J.locationSize,nt,Y,G*rt,G/J.locationSize*_t*rt,ct)}}else if(X!==void 0){const Y=X[tt];if(Y!==void 0)switch(Y.length){case 2:n.vertexAttrib2fv(J.location,Y);break;case 3:n.vertexAttrib3fv(J.location,Y);break;case 4:n.vertexAttrib4fv(J.location,Y);break;default:n.vertexAttrib1fv(J.location,Y)}}}}w()}function S(){P();for(const R in o){const I=o[R];for(const D in I){const z=I[D];for(const B in z)g(z[B].object),delete z[B];delete I[D]}delete o[R]}}function T(R){if(o[R.id]===void 0)return;const I=o[R.id];for(const D in I){const z=I[D];for(const B in z)g(z[B].object),delete z[B];delete I[D]}delete o[R.id]}function L(R){for(const I in o){const D=o[I];if(D[R.id]===void 0)continue;const z=D[R.id];for(const B in z)g(z[B].object),delete z[B];delete D[R.id]}}function P(){W(),h=!0,l!==c&&(l=c,d(l.object))}function W(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:P,resetDefaultState:W,dispose:S,releaseStatesOfGeometry:T,releaseStatesOfProgram:L,initAttributes:v,enableAttribute:M,disableUnusedAttributes:w}}function pg(n,t,e,i){const s=i.isWebGL2;let r;function a(h){r=h}function o(h,u){n.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,f){if(f===0)return;let d,g;if(s)d=n,g="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[g](r,h,u,f),e.update(u,r,f)}function l(h,u,f){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{d.multiDrawArraysWEBGL(r,h,0,u,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_];e.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l}function mg(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(b){if(b==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);const l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),_=n.getParameter(n.MAX_VERTEX_ATTRIBS),p=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),m=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),v=f>0,M=a||t.has("OES_texture_float"),E=v&&M,w=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:p,maxVaryings:m,maxFragmentUniforms:x,vertexTextures:v,floatFragmentTextures:M,floatVertexTextures:E,maxSamples:w}}function gg(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new ci,o=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||i!==0||s;return s=f,i=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,m=n.get(u);if(!s||g===null||g.length===0||r&&!p)r?h(null):l();else{const x=r?0:i,v=x*4;let M=m.clippingState||null;c.value=M,M=h(g,f,v,d);for(let E=0;E!==v;++E)M[E]=e[E];m.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,d,g){const _=u!==null?u.length:0;let p=null;if(_!==0){if(p=c.value,g!==!0||p===null){const m=d+_*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(p===null||p.length<m)&&(p=new Float32Array(m));for(let v=0,M=d;v!==_;++v,M+=4)a.copy(u[v]).applyMatrix4(x,o),a.normal.toArray(p,M),p[M+3]=a.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,p}}function _g(n){let t=new WeakMap;function e(a,o){return o===Ba?a.mapping=ys:o===Ga&&(a.mapping=bs),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ba||o===Ga)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new P0(c.height/2);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}class Pu extends Tu{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const hs=4,Vl=[.125,.215,.35,.446,.526,.582],Li=20,ca=new Pu,Wl=new Xt;let la=null,ha=0,ua=0;const Ai=(1+Math.sqrt(5))/2,rs=1/Ai,ql=[new q(1,1,1),new q(-1,1,1),new q(1,1,-1),new q(-1,1,-1),new q(0,Ai,rs),new q(0,Ai,-rs),new q(rs,0,Ai),new q(-rs,0,Ai),new q(Ai,rs,0),new q(-Ai,rs,0)];class Xa{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){la=this._renderer.getRenderTarget(),ha=this._renderer.getActiveCubeFace(),ua=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(la,ha,ua),t.scissorTest=!1,Fr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ys||t.mapping===bs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),la=this._renderer.getRenderTarget(),ha=this._renderer.getActiveCubeFace(),ua=this._renderer.getActiveMipmapLevel();const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:nr,format:mn,colorSpace:Kn,depthBuffer:!1},s=Xl(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xl(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=vg(r)),this._blurMaterial=xg(r,t,e)}return s}_compileMaterial(t){const e=new ue(this._lodPlanes[0],t);this._renderer.compile(e,ca)}_sceneToCubeUV(t,e,i,s){const o=new rn(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Wl),h.toneMapping=jn,h.autoClear=!1;const d=new Pi({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1}),g=new ue(new Ds,d);let _=!1;const p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,_=!0):(d.color.copy(Wl),_=!0);for(let m=0;m<6;m++){const x=m%3;x===0?(o.up.set(0,c[m],0),o.lookAt(l[m],0,0)):x===1?(o.up.set(0,0,c[m]),o.lookAt(0,l[m],0)):(o.up.set(0,c[m],0),o.lookAt(0,0,l[m]));const v=this._cubeSize;Fr(s,x*v,m>2?v:0,v,v),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===ys||t.mapping===bs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ue(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;Fr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,ca)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=ql[(s-1)%ql.length];this._blur(t,s-1,s,r,a)}e.autoClear=i}_blur(t,e,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ue(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Li-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):Li;p>Li&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Li}`);const m=[];let x=0;for(let b=0;b<Li;++b){const C=b/_,S=Math.exp(-C*C/2);m.push(S),b===0?x+=S:b<p&&(x+=2*S)}for(let b=0;b<m.length;b++)m[b]=m[b]/x;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-i;const M=this._sizeLods[s],E=3*M*(s>v-hs?s-v+hs:0),w=4*(this._cubeSize-M);Fr(e,E,w,3*M,2*M),c.setRenderTarget(e),c.render(u,ca)}}function vg(n){const t=[],e=[],i=[];let s=n;const r=n-hs+1+Vl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>n-hs?c=Vl[a-n+hs-1]:a===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,_=3,p=2,m=1,x=new Float32Array(_*g*d),v=new Float32Array(p*g*d),M=new Float32Array(m*g*d);for(let w=0;w<d;w++){const b=w%3*2/3-1,C=w>2?0:-1,S=[b,C,0,b+2/3,C,0,b+2/3,C+1,0,b,C,0,b+2/3,C+1,0,b,C+1,0];x.set(S,_*g*w),v.set(f,p*g*w);const T=[w,w,w,w,w,w];M.set(T,m*g*w)}const E=new Ke;E.setAttribute("position",new Ae(x,_)),E.setAttribute("uv",new Ae(v,p)),E.setAttribute("faceIndex",new Ae(M,m)),t.push(E),s>hs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Xl(n,t,e){const i=new ki(n,t,e);return i.texture.mapping=wo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Fr(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function xg(n,t,e){const i=new Float32Array(Li),s=new q(0,1,0);return new Oi({name:"SphericalGaussianBlur",defines:{n:Li,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Mc(),fragmentShader:`

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
		`,blending:di,depthTest:!1,depthWrite:!1})}function jl(){return new Oi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Mc(),fragmentShader:`

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
		`,blending:di,depthTest:!1,depthWrite:!1})}function Yl(){return new Oi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:di,depthTest:!1,depthWrite:!1})}function Mc(){return`

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
	`}function Mg(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===Ba||c===Ga,h=c===ys||c===bs;if(l||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new Xa(n)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{const u=o.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new Xa(n));const f=l?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,f),o.addEventListener("dispose",r),f.texture}else return null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function yg(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){const s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function bg(n,t,e,i){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let p=0,m=_.length;p<m;p++)t.remove(_[p])}f.removeEventListener("dispose",a),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],n.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const _=d[g];for(let p=0,m=_.length;p<m;p++)t.update(_[p],n.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,g=u.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let v=0,M=x.length;v<M;v+=3){const E=x[v+0],w=x[v+1],b=x[v+2];f.push(E,w,w,b,b,E)}}else if(g!==void 0){const x=g.array;_=g.version;for(let v=0,M=x.length/3-1;v<M;v+=3){const E=v+0,w=v+1,b=v+2;f.push(E,w,w,b,b,E)}}else return;const p=new(vu(f)?Ro:Ao)(f,1);p.version=_;const m=r.get(u);m&&t.remove(m),r.set(u,p)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Sg(n,t,e,i){const s=i.isWebGL2;let r;function a(d){r=d}let o,c;function l(d){o=d.type,c=d.bytesPerElement}function h(d,g){n.drawElements(r,g,o,d*c),e.update(g,r,1)}function u(d,g,_){if(_===0)return;let p,m;if(s)p=n,m="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),m="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[m](r,g,o,d*c,_),e.update(g,r,_)}function f(d,g,_){if(_===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<_;m++)this.render(d[m]/c,g[m]);else{p.multiDrawElementsWEBGL(r,g,0,o,d,0,_);let m=0;for(let x=0;x<_;x++)m+=g[x];e.update(m,r,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function wg(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Eg(n,t){return n[0]-t[0]}function Tg(n,t){return Math.abs(t[1])-Math.abs(n[1])}function Ag(n,t,e){const i={},s=new Float32Array(8),r=new WeakMap,a=new Ie,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,h,u){const f=l.morphTargetInfluences;if(t.isWebGL2===!0){const d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=d!==void 0?d.length:0;let _=r.get(h);if(_===void 0||_.count!==g){let R=function(){P.dispose(),r.delete(h),h.removeEventListener("dispose",R)};_!==void 0&&_.texture.dispose();const x=h.morphAttributes.position!==void 0,v=h.morphAttributes.normal!==void 0,M=h.morphAttributes.color!==void 0,E=h.morphAttributes.position||[],w=h.morphAttributes.normal||[],b=h.morphAttributes.color||[];let C=0;x===!0&&(C=1),v===!0&&(C=2),M===!0&&(C=3);let S=h.attributes.position.count*C,T=1;S>t.maxTextureSize&&(T=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const L=new Float32Array(S*T*4*g),P=new yu(L,S,T,g);P.type=hi,P.needsUpdate=!0;const W=C*4;for(let I=0;I<g;I++){const D=E[I],z=w[I],B=b[I],F=S*T*4*I;for(let X=0;X<D.count;X++){const tt=X*W;x===!0&&(a.fromBufferAttribute(D,X),L[F+tt+0]=a.x,L[F+tt+1]=a.y,L[F+tt+2]=a.z,L[F+tt+3]=0),v===!0&&(a.fromBufferAttribute(z,X),L[F+tt+4]=a.x,L[F+tt+5]=a.y,L[F+tt+6]=a.z,L[F+tt+7]=0),M===!0&&(a.fromBufferAttribute(B,X),L[F+tt+8]=a.x,L[F+tt+9]=a.y,L[F+tt+10]=a.z,L[F+tt+11]=B.itemSize===4?a.w:1)}}_={count:g,texture:P,size:new Lt(S,T)},r.set(h,_),h.addEventListener("dispose",R)}let p=0;for(let x=0;x<f.length;x++)p+=f[x];const m=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(n,"morphTargetBaseInfluence",m),u.getUniforms().setValue(n,"morphTargetInfluences",f),u.getUniforms().setValue(n,"morphTargetsTexture",_.texture,e),u.getUniforms().setValue(n,"morphTargetsTextureSize",_.size)}else{const d=f===void 0?0:f.length;let g=i[h.id];if(g===void 0||g.length!==d){g=[];for(let v=0;v<d;v++)g[v]=[v,0];i[h.id]=g}for(let v=0;v<d;v++){const M=g[v];M[0]=v,M[1]=f[v]}g.sort(Tg);for(let v=0;v<8;v++)v<d&&g[v][1]?(o[v][0]=g[v][0],o[v][1]=g[v][1]):(o[v][0]=Number.MAX_SAFE_INTEGER,o[v][1]=0);o.sort(Eg);const _=h.morphAttributes.position,p=h.morphAttributes.normal;let m=0;for(let v=0;v<8;v++){const M=o[v],E=M[0],w=M[1];E!==Number.MAX_SAFE_INTEGER&&w?(_&&h.getAttribute("morphTarget"+v)!==_[E]&&h.setAttribute("morphTarget"+v,_[E]),p&&h.getAttribute("morphNormal"+v)!==p[E]&&h.setAttribute("morphNormal"+v,p[E]),s[v]=w,m+=w):(_&&h.hasAttribute("morphTarget"+v)===!0&&h.deleteAttribute("morphTarget"+v),p&&h.hasAttribute("morphNormal"+v)===!0&&h.deleteAttribute("morphNormal"+v),s[v]=0)}const x=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(n,"morphTargetBaseInfluence",x),u.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:c}}function Rg(n,t,e,i){let s=new WeakMap;function r(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}class Lu extends Ye{constructor(t,e,i,s,r,a,o,c,l,h){if(h=h!==void 0?h:Ii,h!==Ii&&h!==ws)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ii&&(i=li),i===void 0&&h===ws&&(i=Di),super(null,s,r,a,o,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Oe,this.minFilter=c!==void 0?c:Oe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Cu=new Ye,Du=new Lu(1,1);Du.compareFunction=_u;const Iu=new yu,Uu=new f0,Nu=new Au,$l=[],Kl=[],Zl=new Float32Array(16),Jl=new Float32Array(9),Ql=new Float32Array(4);function Is(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=$l[s];if(r===void 0&&(r=new Float32Array(s),$l[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function Pe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Le(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Po(n,t){let e=Kl[t];e===void 0&&(e=new Int32Array(t),Kl[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Pg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Lg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2fv(this.addr,t),Le(e,t)}}function Cg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;n.uniform3fv(this.addr,t),Le(e,t)}}function Dg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4fv(this.addr,t),Le(e,t)}}function Ig(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,i))return;Ql.set(i),n.uniformMatrix2fv(this.addr,!1,Ql),Le(e,i)}}function Ug(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,i))return;Jl.set(i),n.uniformMatrix3fv(this.addr,!1,Jl),Le(e,i)}}function Ng(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,i))return;Zl.set(i),n.uniformMatrix4fv(this.addr,!1,Zl),Le(e,i)}}function kg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Fg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2iv(this.addr,t),Le(e,t)}}function Og(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;n.uniform3iv(this.addr,t),Le(e,t)}}function zg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4iv(this.addr,t),Le(e,t)}}function Bg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Gg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2uiv(this.addr,t),Le(e,t)}}function Hg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;n.uniform3uiv(this.addr,t),Le(e,t)}}function Vg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4uiv(this.addr,t),Le(e,t)}}function Wg(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);const r=this.type===n.SAMPLER_2D_SHADOW?Du:Cu;e.setTexture2D(t||r,s)}function qg(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Uu,s)}function Xg(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Nu,s)}function jg(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Iu,s)}function Yg(n){switch(n){case 5126:return Pg;case 35664:return Lg;case 35665:return Cg;case 35666:return Dg;case 35674:return Ig;case 35675:return Ug;case 35676:return Ng;case 5124:case 35670:return kg;case 35667:case 35671:return Fg;case 35668:case 35672:return Og;case 35669:case 35673:return zg;case 5125:return Bg;case 36294:return Gg;case 36295:return Hg;case 36296:return Vg;case 35678:case 36198:case 36298:case 36306:case 35682:return Wg;case 35679:case 36299:case 36307:return qg;case 35680:case 36300:case 36308:case 36293:return Xg;case 36289:case 36303:case 36311:case 36292:return jg}}function $g(n,t){n.uniform1fv(this.addr,t)}function Kg(n,t){const e=Is(t,this.size,2);n.uniform2fv(this.addr,e)}function Zg(n,t){const e=Is(t,this.size,3);n.uniform3fv(this.addr,e)}function Jg(n,t){const e=Is(t,this.size,4);n.uniform4fv(this.addr,e)}function Qg(n,t){const e=Is(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function t1(n,t){const e=Is(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function e1(n,t){const e=Is(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function n1(n,t){n.uniform1iv(this.addr,t)}function i1(n,t){n.uniform2iv(this.addr,t)}function s1(n,t){n.uniform3iv(this.addr,t)}function r1(n,t){n.uniform4iv(this.addr,t)}function o1(n,t){n.uniform1uiv(this.addr,t)}function a1(n,t){n.uniform2uiv(this.addr,t)}function c1(n,t){n.uniform3uiv(this.addr,t)}function l1(n,t){n.uniform4uiv(this.addr,t)}function h1(n,t,e){const i=this.cache,s=t.length,r=Po(e,s);Pe(i,r)||(n.uniform1iv(this.addr,r),Le(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Cu,r[a])}function u1(n,t,e){const i=this.cache,s=t.length,r=Po(e,s);Pe(i,r)||(n.uniform1iv(this.addr,r),Le(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Uu,r[a])}function f1(n,t,e){const i=this.cache,s=t.length,r=Po(e,s);Pe(i,r)||(n.uniform1iv(this.addr,r),Le(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Nu,r[a])}function d1(n,t,e){const i=this.cache,s=t.length,r=Po(e,s);Pe(i,r)||(n.uniform1iv(this.addr,r),Le(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Iu,r[a])}function p1(n){switch(n){case 5126:return $g;case 35664:return Kg;case 35665:return Zg;case 35666:return Jg;case 35674:return Qg;case 35675:return t1;case 35676:return e1;case 5124:case 35670:return n1;case 35667:case 35671:return i1;case 35668:case 35672:return s1;case 35669:case 35673:return r1;case 5125:return o1;case 36294:return a1;case 36295:return c1;case 36296:return l1;case 35678:case 36198:case 36298:case 36306:case 35682:return h1;case 35679:case 36299:case 36307:return u1;case 35680:case 36300:case 36308:case 36293:return f1;case 36289:case 36303:case 36311:case 36292:return d1}}class m1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Yg(e.type)}}class g1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=p1(e.type)}}class _1{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const fa=/(\w+)(\])?(\[|\.)?/g;function th(n,t){n.seq.push(t),n.map[t.id]=t}function v1(n,t,e){const i=n.name,s=i.length;for(fa.lastIndex=0;;){const r=fa.exec(i),a=fa.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){th(e,l===void 0?new m1(o,n,t):new g1(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new _1(o),th(e,u)),e=u}}}class Qr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);v1(r,a,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function eh(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const x1=37297;let M1=0;function y1(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}function b1(n){const t=ie.getPrimaries(ie.workingColorSpace),e=ie.getPrimaries(n);let i;switch(t===e?i="":t===ao&&e===oo?i="LinearDisplayP3ToLinearSRGB":t===oo&&e===ao&&(i="LinearSRGBToLinearDisplayP3"),n){case Kn:case Eo:return[i,"LinearTransferOETF"];case Te:case _c:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function nh(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+y1(n.getShaderSource(t),a)}else return s}function S1(n,t){const e=b1(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function w1(n,t){let e;switch(t){case Nd:e="Linear";break;case kd:e="Reinhard";break;case Fd:e="OptimizedCineon";break;case ou:e="ACESFilmic";break;case zd:e="AgX";break;case Od:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function E1(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(us).join(`
`)}function T1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(us).join(`
`)}function A1(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function R1(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function us(n){return n!==""}function ih(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function sh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const P1=/^[ \t]*#include +<([\w\d./]+)>/gm;function ja(n){return n.replace(P1,C1)}const L1=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function C1(n,t){let e=$t[t];if(e===void 0){const i=L1.get(t);if(i!==void 0)e=$t[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return ja(e)}const D1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rh(n){return n.replace(D1,I1)}function I1(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function oh(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function U1(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===iu?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===su?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Wn&&(t="SHADOWMAP_TYPE_VSM"),t}function N1(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ys:case bs:t="ENVMAP_TYPE_CUBE";break;case wo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function k1(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case bs:t="ENVMAP_MODE_REFRACTION";break}return t}function F1(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ru:t="ENVMAP_BLENDING_MULTIPLY";break;case Id:t="ENVMAP_BLENDING_MIX";break;case Ud:t="ENVMAP_BLENDING_ADD";break}return t}function O1(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function z1(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=U1(e),l=N1(e),h=k1(e),u=F1(e),f=O1(e),d=e.isWebGL2?"":E1(e),g=T1(e),_=A1(r),p=s.createProgram();let m,x,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(us).join(`
`),m.length>0&&(m+=`
`),x=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(us).join(`
`),x.length>0&&(x+=`
`)):(m=[oh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(us).join(`
`),x=[d,oh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==jn?"#define TONE_MAPPING":"",e.toneMapping!==jn?$t.tonemapping_pars_fragment:"",e.toneMapping!==jn?w1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,S1("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(us).join(`
`)),a=ja(a),a=ih(a,e),a=sh(a,e),o=ja(o),o=ih(o,e),o=sh(o,e),a=rh(a),o=rh(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,x=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===El?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===El?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const M=v+m+a,E=v+x+o,w=eh(s,s.VERTEX_SHADER,M),b=eh(s,s.FRAGMENT_SHADER,E);s.attachShader(p,w),s.attachShader(p,b),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function C(P){if(n.debug.checkShaderErrors){const W=s.getProgramInfoLog(p).trim(),R=s.getShaderInfoLog(w).trim(),I=s.getShaderInfoLog(b).trim();let D=!0,z=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(D=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,p,w,b);else{const B=nh(s,w,"vertex"),F=nh(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+W+`
`+B+`
`+F)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(R===""||I==="")&&(z=!1);z&&(P.diagnostics={runnable:D,programLog:W,vertexShader:{log:R,prefix:m},fragmentShader:{log:I,prefix:x}})}s.deleteShader(w),s.deleteShader(b),S=new Qr(s,p),T=R1(s,p)}let S;this.getUniforms=function(){return S===void 0&&C(this),S};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(p,x1)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=M1++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=b,this}let B1=0;class G1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new H1(t),e.set(t,i)),i}}class H1{constructor(t){this.id=B1++,this.code=t,this.usedTimes=0}}function V1(n,t,e,i,s,r,a){const o=new Su,c=new G1,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return S===0?"uv":`uv${S}`}function p(S,T,L,P,W){const R=P.fog,I=W.geometry,D=S.isMeshStandardMaterial?P.environment:null,z=(S.isMeshStandardMaterial?e:t).get(S.envMap||D),B=z&&z.mapping===wo?z.image.height:null,F=g[S.type];S.precision!==null&&(d=s.getMaxPrecision(S.precision),d!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));const X=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,tt=X!==void 0?X.length:0;let J=0;I.morphAttributes.position!==void 0&&(J=1),I.morphAttributes.normal!==void 0&&(J=2),I.morphAttributes.color!==void 0&&(J=3);let U,Y,G,K;if(F){const te=Rn[F];U=te.vertexShader,Y=te.fragmentShader}else U=S.vertexShader,Y=S.fragmentShader,c.update(S),G=c.getVertexShaderID(S),K=c.getFragmentShaderID(S);const Q=n.getRenderTarget(),nt=W.isInstancedMesh===!0,rt=W.isBatchedMesh===!0,ct=!!S.map,_t=!!S.matcap,H=!!z,V=!!S.aoMap,j=!!S.lightMap,it=!!S.bumpMap,st=!!S.normalMap,St=!!S.displacementMap,ut=!!S.emissiveMap,y=!!S.metalnessMap,A=!!S.roughnessMap,$=S.anisotropy>0,ft=S.clearcoat>0,ot=S.iridescence>0,dt=S.sheen>0,vt=S.transmission>0,bt=$&&!!S.anisotropyMap,Mt=ft&&!!S.clearcoatMap,yt=ft&&!!S.clearcoatNormalMap,wt=ft&&!!S.clearcoatRoughnessMap,ht=ot&&!!S.iridescenceMap,At=ot&&!!S.iridescenceThicknessMap,Ut=dt&&!!S.sheenColorMap,Ct=dt&&!!S.sheenRoughnessMap,Dt=!!S.specularMap,Rt=!!S.specularColorMap,k=!!S.specularIntensityMap,Tt=vt&&!!S.transmissionMap,Nt=vt&&!!S.thicknessMap,Z=!!S.gradientMap,et=!!S.alphaMap,N=S.alphaTest>0,at=!!S.alphaHash,xt=!!S.extensions,Et=!!I.attributes.uv1,Pt=!!I.attributes.uv2,Ot=!!I.attributes.uv3;let Bt=jn;return S.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Bt=n.toneMapping),{isWebGL2:h,shaderID:F,shaderType:S.type,shaderName:S.name,vertexShader:U,fragmentShader:Y,defines:S.defines,customVertexShaderID:G,customFragmentShaderID:K,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:rt,instancing:nt,instancingColor:nt&&W.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Kn,map:ct,matcap:_t,envMap:H,envMapMode:H&&z.mapping,envMapCubeUVHeight:B,aoMap:V,lightMap:j,bumpMap:it,normalMap:st,displacementMap:f&&St,emissiveMap:ut,normalMapObjectSpace:st&&S.normalMapType===Zd,normalMapTangentSpace:st&&S.normalMapType===gu,metalnessMap:y,roughnessMap:A,anisotropy:$,anisotropyMap:bt,clearcoat:ft,clearcoatMap:Mt,clearcoatNormalMap:yt,clearcoatRoughnessMap:wt,iridescence:ot,iridescenceMap:ht,iridescenceThicknessMap:At,sheen:dt,sheenColorMap:Ut,sheenRoughnessMap:Ct,specularMap:Dt,specularColorMap:Rt,specularIntensityMap:k,transmission:vt,transmissionMap:Tt,thicknessMap:Nt,gradientMap:Z,opaque:S.transparent===!1&&S.blending===ps,alphaMap:et,alphaTest:N,alphaHash:at,combine:S.combine,mapUv:ct&&_(S.map.channel),aoMapUv:V&&_(S.aoMap.channel),lightMapUv:j&&_(S.lightMap.channel),bumpMapUv:it&&_(S.bumpMap.channel),normalMapUv:st&&_(S.normalMap.channel),displacementMapUv:St&&_(S.displacementMap.channel),emissiveMapUv:ut&&_(S.emissiveMap.channel),metalnessMapUv:y&&_(S.metalnessMap.channel),roughnessMapUv:A&&_(S.roughnessMap.channel),anisotropyMapUv:bt&&_(S.anisotropyMap.channel),clearcoatMapUv:Mt&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:yt&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:wt&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ht&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:At&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&_(S.sheenRoughnessMap.channel),specularMapUv:Dt&&_(S.specularMap.channel),specularColorMapUv:Rt&&_(S.specularColorMap.channel),specularIntensityMapUv:k&&_(S.specularIntensityMap.channel),transmissionMapUv:Tt&&_(S.transmissionMap.channel),thicknessMapUv:Nt&&_(S.thicknessMap.channel),alphaMapUv:et&&_(S.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(st||$),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,vertexUv1s:Et,vertexUv2s:Pt,vertexUv3s:Ot,pointsUvs:W.isPoints===!0&&!!I.attributes.uv&&(ct||et),fog:!!R,useFog:S.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:W.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:J,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Bt,useLegacyLights:n._useLegacyLights,decodeVideoTexture:ct&&S.map.isVideoTexture===!0&&ie.getTransfer(S.map.colorSpace)===ce,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Pn,flipSided:S.side===Xe,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:xt&&S.extensions.derivatives===!0,extensionFragDepth:xt&&S.extensions.fragDepth===!0,extensionDrawBuffers:xt&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:xt&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:xt&&S.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function m(S){const T=[];if(S.shaderID?T.push(S.shaderID):(T.push(S.customVertexShaderID),T.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)T.push(L),T.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(x(T,S),v(T,S),T.push(n.outputColorSpace)),T.push(S.customProgramCacheKey),T.join()}function x(S,T){S.push(T.precision),S.push(T.outputColorSpace),S.push(T.envMapMode),S.push(T.envMapCubeUVHeight),S.push(T.mapUv),S.push(T.alphaMapUv),S.push(T.lightMapUv),S.push(T.aoMapUv),S.push(T.bumpMapUv),S.push(T.normalMapUv),S.push(T.displacementMapUv),S.push(T.emissiveMapUv),S.push(T.metalnessMapUv),S.push(T.roughnessMapUv),S.push(T.anisotropyMapUv),S.push(T.clearcoatMapUv),S.push(T.clearcoatNormalMapUv),S.push(T.clearcoatRoughnessMapUv),S.push(T.iridescenceMapUv),S.push(T.iridescenceThicknessMapUv),S.push(T.sheenColorMapUv),S.push(T.sheenRoughnessMapUv),S.push(T.specularMapUv),S.push(T.specularColorMapUv),S.push(T.specularIntensityMapUv),S.push(T.transmissionMapUv),S.push(T.thicknessMapUv),S.push(T.combine),S.push(T.fogExp2),S.push(T.sizeAttenuation),S.push(T.morphTargetsCount),S.push(T.morphAttributeCount),S.push(T.numDirLights),S.push(T.numPointLights),S.push(T.numSpotLights),S.push(T.numSpotLightMaps),S.push(T.numHemiLights),S.push(T.numRectAreaLights),S.push(T.numDirLightShadows),S.push(T.numPointLightShadows),S.push(T.numSpotLightShadows),S.push(T.numSpotLightShadowsWithMaps),S.push(T.numLightProbes),S.push(T.shadowMapType),S.push(T.toneMapping),S.push(T.numClippingPlanes),S.push(T.numClipIntersection),S.push(T.depthPacking)}function v(S,T){o.disableAll(),T.isWebGL2&&o.enable(0),T.supportsVertexTextures&&o.enable(1),T.instancing&&o.enable(2),T.instancingColor&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),T.batching&&o.enable(19),S.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.skinning&&o.enable(4),T.morphTargets&&o.enable(5),T.morphNormals&&o.enable(6),T.morphColors&&o.enable(7),T.premultipliedAlpha&&o.enable(8),T.shadowMapEnabled&&o.enable(9),T.useLegacyLights&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),S.push(o.mask)}function M(S){const T=g[S.type];let L;if(T){const P=Rn[T];L=E0.clone(P.uniforms)}else L=S.uniforms;return L}function E(S,T){let L;for(let P=0,W=l.length;P<W;P++){const R=l[P];if(R.cacheKey===T){L=R,++L.usedTimes;break}}return L===void 0&&(L=new z1(n,T,S,r),l.push(L)),L}function w(S){if(--S.usedTimes===0){const T=l.indexOf(S);l[T]=l[l.length-1],l.pop(),S.destroy()}}function b(S){c.remove(S)}function C(){c.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:M,acquireProgram:E,releaseProgram:w,releaseShaderCache:b,programs:l,dispose:C}}function W1(){let n=new WeakMap;function t(r){let a=n.get(r);return a===void 0&&(a={},n.set(r,a)),a}function e(r){n.delete(r)}function i(r,a,o){n.get(r)[a]=o}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function q1(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function ah(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function ch(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,f,d,g,_,p){let m=n[t];return m===void 0?(m={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:_,group:p},n[t]=m):(m.id=u.id,m.object=u,m.geometry=f,m.material=d,m.groupOrder=g,m.renderOrder=u.renderOrder,m.z=_,m.group=p),t++,m}function o(u,f,d,g,_,p){const m=a(u,f,d,g,_,p);d.transmission>0?i.push(m):d.transparent===!0?s.push(m):e.push(m)}function c(u,f,d,g,_,p){const m=a(u,f,d,g,_,p);d.transmission>0?i.unshift(m):d.transparent===!0?s.unshift(m):e.unshift(m)}function l(u,f){e.length>1&&e.sort(u||q1),i.length>1&&i.sort(f||ah),s.length>1&&s.sort(f||ah)}function h(){for(let u=t,f=n.length;u<f;u++){const d=n[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function X1(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new ch,n.set(i,[a])):s>=r.length?(a=new ch,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function j1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new q,color:new Xt};break;case"SpotLight":e={position:new q,direction:new q,color:new Xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new q,color:new Xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new q,skyColor:new Xt,groundColor:new Xt};break;case"RectAreaLight":e={color:new Xt,position:new q,halfWidth:new q,halfHeight:new q};break}return n[t.id]=e,e}}}function Y1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let $1=0;function K1(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Z1(n,t){const e=new j1,i=Y1(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new q);const r=new q,a=new ae,o=new ae;function c(h,u){let f=0,d=0,g=0;for(let P=0;P<9;P++)s.probe[P].set(0,0,0);let _=0,p=0,m=0,x=0,v=0,M=0,E=0,w=0,b=0,C=0,S=0;h.sort(K1);const T=u===!0?Math.PI:1;for(let P=0,W=h.length;P<W;P++){const R=h[P],I=R.color,D=R.intensity,z=R.distance,B=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)f+=I.r*D*T,d+=I.g*D*T,g+=I.b*D*T;else if(R.isLightProbe){for(let F=0;F<9;F++)s.probe[F].addScaledVector(R.sh.coefficients[F],D);S++}else if(R.isDirectionalLight){const F=e.get(R);if(F.color.copy(R.color).multiplyScalar(R.intensity*T),R.castShadow){const X=R.shadow,tt=i.get(R);tt.shadowBias=X.bias,tt.shadowNormalBias=X.normalBias,tt.shadowRadius=X.radius,tt.shadowMapSize=X.mapSize,s.directionalShadow[_]=tt,s.directionalShadowMap[_]=B,s.directionalShadowMatrix[_]=R.shadow.matrix,M++}s.directional[_]=F,_++}else if(R.isSpotLight){const F=e.get(R);F.position.setFromMatrixPosition(R.matrixWorld),F.color.copy(I).multiplyScalar(D*T),F.distance=z,F.coneCos=Math.cos(R.angle),F.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),F.decay=R.decay,s.spot[m]=F;const X=R.shadow;if(R.map&&(s.spotLightMap[b]=R.map,b++,X.updateMatrices(R),R.castShadow&&C++),s.spotLightMatrix[m]=X.matrix,R.castShadow){const tt=i.get(R);tt.shadowBias=X.bias,tt.shadowNormalBias=X.normalBias,tt.shadowRadius=X.radius,tt.shadowMapSize=X.mapSize,s.spotShadow[m]=tt,s.spotShadowMap[m]=B,w++}m++}else if(R.isRectAreaLight){const F=e.get(R);F.color.copy(I).multiplyScalar(D),F.halfWidth.set(R.width*.5,0,0),F.halfHeight.set(0,R.height*.5,0),s.rectArea[x]=F,x++}else if(R.isPointLight){const F=e.get(R);if(F.color.copy(R.color).multiplyScalar(R.intensity*T),F.distance=R.distance,F.decay=R.decay,R.castShadow){const X=R.shadow,tt=i.get(R);tt.shadowBias=X.bias,tt.shadowNormalBias=X.normalBias,tt.shadowRadius=X.radius,tt.shadowMapSize=X.mapSize,tt.shadowCameraNear=X.camera.near,tt.shadowCameraFar=X.camera.far,s.pointShadow[p]=tt,s.pointShadowMap[p]=B,s.pointShadowMatrix[p]=R.shadow.matrix,E++}s.point[p]=F,p++}else if(R.isHemisphereLight){const F=e.get(R);F.skyColor.copy(R.color).multiplyScalar(D*T),F.groundColor.copy(R.groundColor).multiplyScalar(D*T),s.hemi[v]=F,v++}}x>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=It.LTC_FLOAT_1,s.rectAreaLTC2=It.LTC_FLOAT_2):(s.rectAreaLTC1=It.LTC_HALF_1,s.rectAreaLTC2=It.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=It.LTC_FLOAT_1,s.rectAreaLTC2=It.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=It.LTC_HALF_1,s.rectAreaLTC2=It.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=d,s.ambient[2]=g;const L=s.hash;(L.directionalLength!==_||L.pointLength!==p||L.spotLength!==m||L.rectAreaLength!==x||L.hemiLength!==v||L.numDirectionalShadows!==M||L.numPointShadows!==E||L.numSpotShadows!==w||L.numSpotMaps!==b||L.numLightProbes!==S)&&(s.directional.length=_,s.spot.length=m,s.rectArea.length=x,s.point.length=p,s.hemi.length=v,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=E,s.pointShadowMap.length=E,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=E,s.spotLightMatrix.length=w+b-C,s.spotLightMap.length=b,s.numSpotLightShadowsWithMaps=C,s.numLightProbes=S,L.directionalLength=_,L.pointLength=p,L.spotLength=m,L.rectAreaLength=x,L.hemiLength=v,L.numDirectionalShadows=M,L.numPointShadows=E,L.numSpotShadows=w,L.numSpotMaps=b,L.numLightProbes=S,s.version=$1++)}function l(h,u){let f=0,d=0,g=0,_=0,p=0;const m=u.matrixWorldInverse;for(let x=0,v=h.length;x<v;x++){const M=h[x];if(M.isDirectionalLight){const E=s.directional[f];E.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),f++}else if(M.isSpotLight){const E=s.spot[g];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),g++}else if(M.isRectAreaLight){const E=s.rectArea[_];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(m),o.identity(),a.copy(M.matrixWorld),a.premultiply(m),o.extractRotation(a),E.halfWidth.set(M.width*.5,0,0),E.halfHeight.set(0,M.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),_++}else if(M.isPointLight){const E=s.point[d];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const E=s.hemi[p];E.direction.setFromMatrixPosition(M.matrixWorld),E.direction.transformDirection(m),p++}}}return{setup:c,setupView:l,state:s}}function lh(n,t){const e=new Z1(n,t),i=[],s=[];function r(){i.length=0,s.length=0}function a(u){i.push(u)}function o(u){s.push(u)}function c(u){e.setup(i,u)}function l(u){e.setupView(i,u)}return{init:r,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function J1(n,t){let e=new WeakMap;function i(r,a=0){const o=e.get(r);let c;return o===void 0?(c=new lh(n,t),e.set(r,[c])):a>=o.length?(c=new lh(n,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:i,dispose:s}}class Q1 extends dr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$d,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class t_ extends dr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const e_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,n_=`uniform sampler2D shadow_pass;
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
}`;function i_(n,t,e){let i=new xc;const s=new Lt,r=new Lt,a=new Ie,o=new Q1({depthPacking:Kd}),c=new t_,l={},h=e.maxTextureSize,u={[gi]:Xe,[Xe]:gi,[Pn]:Pn},f=new Oi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:e_,fragmentShader:n_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ke;g.setAttribute("position",new Ae(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ue(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=iu;let m=this.type;this.render=function(w,b,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const S=n.getRenderTarget(),T=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),P=n.state;P.setBlending(di),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const W=m!==Wn&&this.type===Wn,R=m===Wn&&this.type!==Wn;for(let I=0,D=w.length;I<D;I++){const z=w[I],B=z.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",z,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const F=B.getFrameExtents();if(s.multiply(F),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/F.x),s.x=r.x*F.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/F.y),s.y=r.y*F.y,B.mapSize.y=r.y)),B.map===null||W===!0||R===!0){const tt=this.type!==Wn?{minFilter:Oe,magFilter:Oe}:{};B.map!==null&&B.map.dispose(),B.map=new ki(s.x,s.y,tt),B.map.texture.name=z.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const X=B.getViewportCount();for(let tt=0;tt<X;tt++){const J=B.getViewport(tt);a.set(r.x*J.x,r.y*J.y,r.x*J.z,r.y*J.w),P.viewport(a),B.updateMatrices(z,tt),i=B.getFrustum(),M(b,C,B.camera,z,this.type)}B.isPointLightShadow!==!0&&this.type===Wn&&x(B,C),B.needsUpdate=!1}m=this.type,p.needsUpdate=!1,n.setRenderTarget(S,T,L)};function x(w,b){const C=t.update(_);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ki(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(b,null,C,f,_,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(b,null,C,d,_,null)}function v(w,b,C,S){let T=null;const L=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)T=L;else if(T=C.isPointLight===!0?c:o,n.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const P=T.uuid,W=b.uuid;let R=l[P];R===void 0&&(R={},l[P]=R);let I=R[W];I===void 0&&(I=T.clone(),R[W]=I,b.addEventListener("dispose",E)),T=I}if(T.visible=b.visible,T.wireframe=b.wireframe,S===Wn?T.side=b.shadowSide!==null?b.shadowSide:b.side:T.side=b.shadowSide!==null?b.shadowSide:u[b.side],T.alphaMap=b.alphaMap,T.alphaTest=b.alphaTest,T.map=b.map,T.clipShadows=b.clipShadows,T.clippingPlanes=b.clippingPlanes,T.clipIntersection=b.clipIntersection,T.displacementMap=b.displacementMap,T.displacementScale=b.displacementScale,T.displacementBias=b.displacementBias,T.wireframeLinewidth=b.wireframeLinewidth,T.linewidth=b.linewidth,C.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const P=n.properties.get(T);P.light=C}return T}function M(w,b,C,S,T){if(w.visible===!1)return;if(w.layers.test(b.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&T===Wn)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);const W=t.update(w),R=w.material;if(Array.isArray(R)){const I=W.groups;for(let D=0,z=I.length;D<z;D++){const B=I[D],F=R[B.materialIndex];if(F&&F.visible){const X=v(w,F,S,T);w.onBeforeShadow(n,w,b,C,W,X,B),n.renderBufferDirect(C,null,W,X,w,B),w.onAfterShadow(n,w,b,C,W,X,B)}}}else if(R.visible){const I=v(w,R,S,T);w.onBeforeShadow(n,w,b,C,W,I,null),n.renderBufferDirect(C,null,W,I,w,null),w.onAfterShadow(n,w,b,C,W,I,null)}}const P=w.children;for(let W=0,R=P.length;W<R;W++)M(P[W],b,C,S,T)}function E(w){w.target.removeEventListener("dispose",E);for(const C in l){const S=l[C],T=w.target.uuid;T in S&&(S[T].dispose(),delete S[T])}}}function s_(n,t,e){const i=e.isWebGL2;function s(){let N=!1;const at=new Ie;let xt=null;const Et=new Ie(0,0,0,0);return{setMask:function(Pt){xt!==Pt&&!N&&(n.colorMask(Pt,Pt,Pt,Pt),xt=Pt)},setLocked:function(Pt){N=Pt},setClear:function(Pt,Ot,Bt,Qt,te){te===!0&&(Pt*=Qt,Ot*=Qt,Bt*=Qt),at.set(Pt,Ot,Bt,Qt),Et.equals(at)===!1&&(n.clearColor(Pt,Ot,Bt,Qt),Et.copy(at))},reset:function(){N=!1,xt=null,Et.set(-1,0,0,0)}}}function r(){let N=!1,at=null,xt=null,Et=null;return{setTest:function(Pt){Pt?rt(n.DEPTH_TEST):ct(n.DEPTH_TEST)},setMask:function(Pt){at!==Pt&&!N&&(n.depthMask(Pt),at=Pt)},setFunc:function(Pt){if(xt!==Pt){switch(Pt){case Td:n.depthFunc(n.NEVER);break;case Ad:n.depthFunc(n.ALWAYS);break;case Rd:n.depthFunc(n.LESS);break;case so:n.depthFunc(n.LEQUAL);break;case Pd:n.depthFunc(n.EQUAL);break;case Ld:n.depthFunc(n.GEQUAL);break;case Cd:n.depthFunc(n.GREATER);break;case Dd:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}xt=Pt}},setLocked:function(Pt){N=Pt},setClear:function(Pt){Et!==Pt&&(n.clearDepth(Pt),Et=Pt)},reset:function(){N=!1,at=null,xt=null,Et=null}}}function a(){let N=!1,at=null,xt=null,Et=null,Pt=null,Ot=null,Bt=null,Qt=null,te=null;return{setTest:function(Wt){N||(Wt?rt(n.STENCIL_TEST):ct(n.STENCIL_TEST))},setMask:function(Wt){at!==Wt&&!N&&(n.stencilMask(Wt),at=Wt)},setFunc:function(Wt,ee,fe){(xt!==Wt||Et!==ee||Pt!==fe)&&(n.stencilFunc(Wt,ee,fe),xt=Wt,Et=ee,Pt=fe)},setOp:function(Wt,ee,fe){(Ot!==Wt||Bt!==ee||Qt!==fe)&&(n.stencilOp(Wt,ee,fe),Ot=Wt,Bt=ee,Qt=fe)},setLocked:function(Wt){N=Wt},setClear:function(Wt){te!==Wt&&(n.clearStencil(Wt),te=Wt)},reset:function(){N=!1,at=null,xt=null,Et=null,Pt=null,Ot=null,Bt=null,Qt=null,te=null}}}const o=new s,c=new r,l=new a,h=new WeakMap,u=new WeakMap;let f={},d={},g=new WeakMap,_=[],p=null,m=!1,x=null,v=null,M=null,E=null,w=null,b=null,C=null,S=new Xt(0,0,0),T=0,L=!1,P=null,W=null,R=null,I=null,D=null;const z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,F=0;const X=n.getParameter(n.VERSION);X.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(X)[1]),B=F>=1):X.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),B=F>=2);let tt=null,J={};const U=n.getParameter(n.SCISSOR_BOX),Y=n.getParameter(n.VIEWPORT),G=new Ie().fromArray(U),K=new Ie().fromArray(Y);function Q(N,at,xt,Et){const Pt=new Uint8Array(4),Ot=n.createTexture();n.bindTexture(N,Ot),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Bt=0;Bt<xt;Bt++)i&&(N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY)?n.texImage3D(at,0,n.RGBA,1,1,Et,0,n.RGBA,n.UNSIGNED_BYTE,Pt):n.texImage2D(at+Bt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Pt);return Ot}const nt={};nt[n.TEXTURE_2D]=Q(n.TEXTURE_2D,n.TEXTURE_2D,1),nt[n.TEXTURE_CUBE_MAP]=Q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(nt[n.TEXTURE_2D_ARRAY]=Q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),nt[n.TEXTURE_3D]=Q(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),rt(n.DEPTH_TEST),c.setFunc(so),ut(!1),y(qc),rt(n.CULL_FACE),st(di);function rt(N){f[N]!==!0&&(n.enable(N),f[N]=!0)}function ct(N){f[N]!==!1&&(n.disable(N),f[N]=!1)}function _t(N,at){return d[N]!==at?(n.bindFramebuffer(N,at),d[N]=at,i&&(N===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=at),N===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=at)),!0):!1}function H(N,at){let xt=_,Et=!1;if(N)if(xt=g.get(at),xt===void 0&&(xt=[],g.set(at,xt)),N.isWebGLMultipleRenderTargets){const Pt=N.texture;if(xt.length!==Pt.length||xt[0]!==n.COLOR_ATTACHMENT0){for(let Ot=0,Bt=Pt.length;Ot<Bt;Ot++)xt[Ot]=n.COLOR_ATTACHMENT0+Ot;xt.length=Pt.length,Et=!0}}else xt[0]!==n.COLOR_ATTACHMENT0&&(xt[0]=n.COLOR_ATTACHMENT0,Et=!0);else xt[0]!==n.BACK&&(xt[0]=n.BACK,Et=!0);Et&&(e.isWebGL2?n.drawBuffers(xt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(xt))}function V(N){return p!==N?(n.useProgram(N),p=N,!0):!1}const j={[Ri]:n.FUNC_ADD,[ud]:n.FUNC_SUBTRACT,[fd]:n.FUNC_REVERSE_SUBTRACT};if(i)j[$c]=n.MIN,j[Kc]=n.MAX;else{const N=t.get("EXT_blend_minmax");N!==null&&(j[$c]=N.MIN_EXT,j[Kc]=N.MAX_EXT)}const it={[dd]:n.ZERO,[pd]:n.ONE,[md]:n.SRC_COLOR,[Oa]:n.SRC_ALPHA,[yd]:n.SRC_ALPHA_SATURATE,[xd]:n.DST_COLOR,[_d]:n.DST_ALPHA,[gd]:n.ONE_MINUS_SRC_COLOR,[za]:n.ONE_MINUS_SRC_ALPHA,[Md]:n.ONE_MINUS_DST_COLOR,[vd]:n.ONE_MINUS_DST_ALPHA,[bd]:n.CONSTANT_COLOR,[Sd]:n.ONE_MINUS_CONSTANT_COLOR,[wd]:n.CONSTANT_ALPHA,[Ed]:n.ONE_MINUS_CONSTANT_ALPHA};function st(N,at,xt,Et,Pt,Ot,Bt,Qt,te,Wt){if(N===di){m===!0&&(ct(n.BLEND),m=!1);return}if(m===!1&&(rt(n.BLEND),m=!0),N!==hd){if(N!==x||Wt!==L){if((v!==Ri||w!==Ri)&&(n.blendEquation(n.FUNC_ADD),v=Ri,w=Ri),Wt)switch(N){case ps:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xc:n.blendFunc(n.ONE,n.ONE);break;case jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Yc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case ps:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xc:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Yc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}M=null,E=null,b=null,C=null,S.set(0,0,0),T=0,x=N,L=Wt}return}Pt=Pt||at,Ot=Ot||xt,Bt=Bt||Et,(at!==v||Pt!==w)&&(n.blendEquationSeparate(j[at],j[Pt]),v=at,w=Pt),(xt!==M||Et!==E||Ot!==b||Bt!==C)&&(n.blendFuncSeparate(it[xt],it[Et],it[Ot],it[Bt]),M=xt,E=Et,b=Ot,C=Bt),(Qt.equals(S)===!1||te!==T)&&(n.blendColor(Qt.r,Qt.g,Qt.b,te),S.copy(Qt),T=te),x=N,L=!1}function St(N,at){N.side===Pn?ct(n.CULL_FACE):rt(n.CULL_FACE);let xt=N.side===Xe;at&&(xt=!xt),ut(xt),N.blending===ps&&N.transparent===!1?st(di):st(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),c.setFunc(N.depthFunc),c.setTest(N.depthTest),c.setMask(N.depthWrite),o.setMask(N.colorWrite);const Et=N.stencilWrite;l.setTest(Et),Et&&(l.setMask(N.stencilWriteMask),l.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),l.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),$(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?rt(n.SAMPLE_ALPHA_TO_COVERAGE):ct(n.SAMPLE_ALPHA_TO_COVERAGE)}function ut(N){P!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),P=N)}function y(N){N!==cd?(rt(n.CULL_FACE),N!==W&&(N===qc?n.cullFace(n.BACK):N===ld?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ct(n.CULL_FACE),W=N}function A(N){N!==R&&(B&&n.lineWidth(N),R=N)}function $(N,at,xt){N?(rt(n.POLYGON_OFFSET_FILL),(I!==at||D!==xt)&&(n.polygonOffset(at,xt),I=at,D=xt)):ct(n.POLYGON_OFFSET_FILL)}function ft(N){N?rt(n.SCISSOR_TEST):ct(n.SCISSOR_TEST)}function ot(N){N===void 0&&(N=n.TEXTURE0+z-1),tt!==N&&(n.activeTexture(N),tt=N)}function dt(N,at,xt){xt===void 0&&(tt===null?xt=n.TEXTURE0+z-1:xt=tt);let Et=J[xt];Et===void 0&&(Et={type:void 0,texture:void 0},J[xt]=Et),(Et.type!==N||Et.texture!==at)&&(tt!==xt&&(n.activeTexture(xt),tt=xt),n.bindTexture(N,at||nt[N]),Et.type=N,Et.texture=at)}function vt(){const N=J[tt];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function bt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Mt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function yt(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function wt(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ht(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function At(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ut(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ct(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Dt(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Rt(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function k(N){G.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),G.copy(N))}function Tt(N){K.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),K.copy(N))}function Nt(N,at){let xt=u.get(at);xt===void 0&&(xt=new WeakMap,u.set(at,xt));let Et=xt.get(N);Et===void 0&&(Et=n.getUniformBlockIndex(at,N.name),xt.set(N,Et))}function Z(N,at){const Et=u.get(at).get(N);h.get(at)!==Et&&(n.uniformBlockBinding(at,Et,N.__bindingPointIndex),h.set(at,Et))}function et(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),f={},tt=null,J={},d={},g=new WeakMap,_=[],p=null,m=!1,x=null,v=null,M=null,E=null,w=null,b=null,C=null,S=new Xt(0,0,0),T=0,L=!1,P=null,W=null,R=null,I=null,D=null,G.set(0,0,n.canvas.width,n.canvas.height),K.set(0,0,n.canvas.width,n.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:rt,disable:ct,bindFramebuffer:_t,drawBuffers:H,useProgram:V,setBlending:st,setMaterial:St,setFlipSided:ut,setCullFace:y,setLineWidth:A,setPolygonOffset:$,setScissorTest:ft,activeTexture:ot,bindTexture:dt,unbindTexture:vt,compressedTexImage2D:bt,compressedTexImage3D:Mt,texImage2D:Dt,texImage3D:Rt,updateUBOMapping:Nt,uniformBlockBinding:Z,texStorage2D:Ut,texStorage3D:Ct,texSubImage2D:yt,texSubImage3D:wt,compressedTexSubImage2D:ht,compressedTexSubImage3D:At,scissor:k,viewport:Tt,reset:et}}function r_(n,t,e,i,s,r,a){const o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(y,A){return d?new OffscreenCanvas(y,A):ho("canvas")}function _(y,A,$,ft){let ot=1;if((y.width>ft||y.height>ft)&&(ot=ft/Math.max(y.width,y.height)),ot<1||A===!0)if(typeof HTMLImageElement<"u"&&y instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&y instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&y instanceof ImageBitmap){const dt=A?qa:Math.floor,vt=dt(ot*y.width),bt=dt(ot*y.height);u===void 0&&(u=g(vt,bt));const Mt=$?g(vt,bt):u;return Mt.width=vt,Mt.height=bt,Mt.getContext("2d").drawImage(y,0,0,vt,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+y.width+"x"+y.height+") to ("+vt+"x"+bt+")."),Mt}else return"data"in y&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+y.width+"x"+y.height+")."),y;return y}function p(y){return Tl(y.width)&&Tl(y.height)}function m(y){return o?!1:y.wrapS!==pn||y.wrapT!==pn||y.minFilter!==Oe&&y.minFilter!==sn}function x(y,A){return y.generateMipmaps&&A&&y.minFilter!==Oe&&y.minFilter!==sn}function v(y){n.generateMipmap(y)}function M(y,A,$,ft,ot=!1){if(o===!1)return A;if(y!==null){if(n[y]!==void 0)return n[y];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+y+"'")}let dt=A;if(A===n.RED&&($===n.FLOAT&&(dt=n.R32F),$===n.HALF_FLOAT&&(dt=n.R16F),$===n.UNSIGNED_BYTE&&(dt=n.R8)),A===n.RED_INTEGER&&($===n.UNSIGNED_BYTE&&(dt=n.R8UI),$===n.UNSIGNED_SHORT&&(dt=n.R16UI),$===n.UNSIGNED_INT&&(dt=n.R32UI),$===n.BYTE&&(dt=n.R8I),$===n.SHORT&&(dt=n.R16I),$===n.INT&&(dt=n.R32I)),A===n.RG&&($===n.FLOAT&&(dt=n.RG32F),$===n.HALF_FLOAT&&(dt=n.RG16F),$===n.UNSIGNED_BYTE&&(dt=n.RG8)),A===n.RGBA){const vt=ot?ro:ie.getTransfer(ft);$===n.FLOAT&&(dt=n.RGBA32F),$===n.HALF_FLOAT&&(dt=n.RGBA16F),$===n.UNSIGNED_BYTE&&(dt=vt===ce?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT_4_4_4_4&&(dt=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(dt=n.RGB5_A1)}return(dt===n.R16F||dt===n.R32F||dt===n.RG16F||dt===n.RG32F||dt===n.RGBA16F||dt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),dt}function E(y,A,$){return x(y,$)===!0||y.isFramebufferTexture&&y.minFilter!==Oe&&y.minFilter!==sn?Math.log2(Math.max(A.width,A.height))+1:y.mipmaps!==void 0&&y.mipmaps.length>0?y.mipmaps.length:y.isCompressedTexture&&Array.isArray(y.image)?A.mipmaps.length:1}function w(y){return y===Oe||y===Zc||y===Oo?n.NEAREST:n.LINEAR}function b(y){const A=y.target;A.removeEventListener("dispose",b),S(A),A.isVideoTexture&&h.delete(A)}function C(y){const A=y.target;A.removeEventListener("dispose",C),L(A)}function S(y){const A=i.get(y);if(A.__webglInit===void 0)return;const $=y.source,ft=f.get($);if(ft){const ot=ft[A.__cacheKey];ot.usedTimes--,ot.usedTimes===0&&T(y),Object.keys(ft).length===0&&f.delete($)}i.remove(y)}function T(y){const A=i.get(y);n.deleteTexture(A.__webglTexture);const $=y.source,ft=f.get($);delete ft[A.__cacheKey],a.memory.textures--}function L(y){const A=y.texture,$=i.get(y),ft=i.get(A);if(ft.__webglTexture!==void 0&&(n.deleteTexture(ft.__webglTexture),a.memory.textures--),y.depthTexture&&y.depthTexture.dispose(),y.isWebGLCubeRenderTarget)for(let ot=0;ot<6;ot++){if(Array.isArray($.__webglFramebuffer[ot]))for(let dt=0;dt<$.__webglFramebuffer[ot].length;dt++)n.deleteFramebuffer($.__webglFramebuffer[ot][dt]);else n.deleteFramebuffer($.__webglFramebuffer[ot]);$.__webglDepthbuffer&&n.deleteRenderbuffer($.__webglDepthbuffer[ot])}else{if(Array.isArray($.__webglFramebuffer))for(let ot=0;ot<$.__webglFramebuffer.length;ot++)n.deleteFramebuffer($.__webglFramebuffer[ot]);else n.deleteFramebuffer($.__webglFramebuffer);if($.__webglDepthbuffer&&n.deleteRenderbuffer($.__webglDepthbuffer),$.__webglMultisampledFramebuffer&&n.deleteFramebuffer($.__webglMultisampledFramebuffer),$.__webglColorRenderbuffer)for(let ot=0;ot<$.__webglColorRenderbuffer.length;ot++)$.__webglColorRenderbuffer[ot]&&n.deleteRenderbuffer($.__webglColorRenderbuffer[ot]);$.__webglDepthRenderbuffer&&n.deleteRenderbuffer($.__webglDepthRenderbuffer)}if(y.isWebGLMultipleRenderTargets)for(let ot=0,dt=A.length;ot<dt;ot++){const vt=i.get(A[ot]);vt.__webglTexture&&(n.deleteTexture(vt.__webglTexture),a.memory.textures--),i.remove(A[ot])}i.remove(A),i.remove(y)}let P=0;function W(){P=0}function R(){const y=P;return y>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+y+" texture units while this GPU supports only "+s.maxTextures),P+=1,y}function I(y){const A=[];return A.push(y.wrapS),A.push(y.wrapT),A.push(y.wrapR||0),A.push(y.magFilter),A.push(y.minFilter),A.push(y.anisotropy),A.push(y.internalFormat),A.push(y.format),A.push(y.type),A.push(y.generateMipmaps),A.push(y.premultiplyAlpha),A.push(y.flipY),A.push(y.unpackAlignment),A.push(y.colorSpace),A.join()}function D(y,A){const $=i.get(y);if(y.isVideoTexture&&St(y),y.isRenderTargetTexture===!1&&y.version>0&&$.__version!==y.version){const ft=y.image;if(ft===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ft.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{G($,y,A);return}}e.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+A)}function z(y,A){const $=i.get(y);if(y.version>0&&$.__version!==y.version){G($,y,A);return}e.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+A)}function B(y,A){const $=i.get(y);if(y.version>0&&$.__version!==y.version){G($,y,A);return}e.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+A)}function F(y,A){const $=i.get(y);if(y.version>0&&$.__version!==y.version){K($,y,A);return}e.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+A)}const X={[Ha]:n.REPEAT,[pn]:n.CLAMP_TO_EDGE,[Va]:n.MIRRORED_REPEAT},tt={[Oe]:n.NEAREST,[Zc]:n.NEAREST_MIPMAP_NEAREST,[Oo]:n.NEAREST_MIPMAP_LINEAR,[sn]:n.LINEAR,[Bd]:n.LINEAR_MIPMAP_NEAREST,[Ss]:n.LINEAR_MIPMAP_LINEAR},J={[Jd]:n.NEVER,[s0]:n.ALWAYS,[Qd]:n.LESS,[_u]:n.LEQUAL,[t0]:n.EQUAL,[i0]:n.GEQUAL,[e0]:n.GREATER,[n0]:n.NOTEQUAL};function U(y,A,$){if($?(n.texParameteri(y,n.TEXTURE_WRAP_S,X[A.wrapS]),n.texParameteri(y,n.TEXTURE_WRAP_T,X[A.wrapT]),(y===n.TEXTURE_3D||y===n.TEXTURE_2D_ARRAY)&&n.texParameteri(y,n.TEXTURE_WRAP_R,X[A.wrapR]),n.texParameteri(y,n.TEXTURE_MAG_FILTER,tt[A.magFilter]),n.texParameteri(y,n.TEXTURE_MIN_FILTER,tt[A.minFilter])):(n.texParameteri(y,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(y,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(y===n.TEXTURE_3D||y===n.TEXTURE_2D_ARRAY)&&n.texParameteri(y,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(A.wrapS!==pn||A.wrapT!==pn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(y,n.TEXTURE_MAG_FILTER,w(A.magFilter)),n.texParameteri(y,n.TEXTURE_MIN_FILTER,w(A.minFilter)),A.minFilter!==Oe&&A.minFilter!==sn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),A.compareFunction&&(n.texParameteri(y,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(y,n.TEXTURE_COMPARE_FUNC,J[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const ft=t.get("EXT_texture_filter_anisotropic");if(A.magFilter===Oe||A.minFilter!==Oo&&A.minFilter!==Ss||A.type===hi&&t.has("OES_texture_float_linear")===!1||o===!1&&A.type===nr&&t.has("OES_texture_half_float_linear")===!1)return;(A.anisotropy>1||i.get(A).__currentAnisotropy)&&(n.texParameterf(y,ft.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy)}}function Y(y,A){let $=!1;y.__webglInit===void 0&&(y.__webglInit=!0,A.addEventListener("dispose",b));const ft=A.source;let ot=f.get(ft);ot===void 0&&(ot={},f.set(ft,ot));const dt=I(A);if(dt!==y.__cacheKey){ot[dt]===void 0&&(ot[dt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,$=!0),ot[dt].usedTimes++;const vt=ot[y.__cacheKey];vt!==void 0&&(ot[y.__cacheKey].usedTimes--,vt.usedTimes===0&&T(A)),y.__cacheKey=dt,y.__webglTexture=ot[dt].texture}return $}function G(y,A,$){let ft=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ft=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ft=n.TEXTURE_3D);const ot=Y(y,A),dt=A.source;e.bindTexture(ft,y.__webglTexture,n.TEXTURE0+$);const vt=i.get(dt);if(dt.version!==vt.__version||ot===!0){e.activeTexture(n.TEXTURE0+$);const bt=ie.getPrimaries(ie.workingColorSpace),Mt=A.colorSpace===on?null:ie.getPrimaries(A.colorSpace),yt=A.colorSpace===on||bt===Mt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const wt=m(A)&&p(A.image)===!1;let ht=_(A.image,wt,!1,s.maxTextureSize);ht=ut(A,ht);const At=p(ht)||o,Ut=r.convert(A.format,A.colorSpace);let Ct=r.convert(A.type),Dt=M(A.internalFormat,Ut,Ct,A.colorSpace,A.isVideoTexture);U(ft,A,At);let Rt;const k=A.mipmaps,Tt=o&&A.isVideoTexture!==!0&&Dt!==pu,Nt=vt.__version===void 0||ot===!0,Z=E(A,ht,At);if(A.isDepthTexture)Dt=n.DEPTH_COMPONENT,o?A.type===hi?Dt=n.DEPTH_COMPONENT32F:A.type===li?Dt=n.DEPTH_COMPONENT24:A.type===Di?Dt=n.DEPTH24_STENCIL8:Dt=n.DEPTH_COMPONENT16:A.type===hi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),A.format===Ii&&Dt===n.DEPTH_COMPONENT&&A.type!==gc&&A.type!==li&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),A.type=li,Ct=r.convert(A.type)),A.format===ws&&Dt===n.DEPTH_COMPONENT&&(Dt=n.DEPTH_STENCIL,A.type!==Di&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),A.type=Di,Ct=r.convert(A.type))),Nt&&(Tt?e.texStorage2D(n.TEXTURE_2D,1,Dt,ht.width,ht.height):e.texImage2D(n.TEXTURE_2D,0,Dt,ht.width,ht.height,0,Ut,Ct,null));else if(A.isDataTexture)if(k.length>0&&At){Tt&&Nt&&e.texStorage2D(n.TEXTURE_2D,Z,Dt,k[0].width,k[0].height);for(let et=0,N=k.length;et<N;et++)Rt=k[et],Tt?e.texSubImage2D(n.TEXTURE_2D,et,0,0,Rt.width,Rt.height,Ut,Ct,Rt.data):e.texImage2D(n.TEXTURE_2D,et,Dt,Rt.width,Rt.height,0,Ut,Ct,Rt.data);A.generateMipmaps=!1}else Tt?(Nt&&e.texStorage2D(n.TEXTURE_2D,Z,Dt,ht.width,ht.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,ht.width,ht.height,Ut,Ct,ht.data)):e.texImage2D(n.TEXTURE_2D,0,Dt,ht.width,ht.height,0,Ut,Ct,ht.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Tt&&Nt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Z,Dt,k[0].width,k[0].height,ht.depth);for(let et=0,N=k.length;et<N;et++)Rt=k[et],A.format!==mn?Ut!==null?Tt?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,et,0,0,0,Rt.width,Rt.height,ht.depth,Ut,Rt.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,et,Dt,Rt.width,Rt.height,ht.depth,0,Rt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Tt?e.texSubImage3D(n.TEXTURE_2D_ARRAY,et,0,0,0,Rt.width,Rt.height,ht.depth,Ut,Ct,Rt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,et,Dt,Rt.width,Rt.height,ht.depth,0,Ut,Ct,Rt.data)}else{Tt&&Nt&&e.texStorage2D(n.TEXTURE_2D,Z,Dt,k[0].width,k[0].height);for(let et=0,N=k.length;et<N;et++)Rt=k[et],A.format!==mn?Ut!==null?Tt?e.compressedTexSubImage2D(n.TEXTURE_2D,et,0,0,Rt.width,Rt.height,Ut,Rt.data):e.compressedTexImage2D(n.TEXTURE_2D,et,Dt,Rt.width,Rt.height,0,Rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Tt?e.texSubImage2D(n.TEXTURE_2D,et,0,0,Rt.width,Rt.height,Ut,Ct,Rt.data):e.texImage2D(n.TEXTURE_2D,et,Dt,Rt.width,Rt.height,0,Ut,Ct,Rt.data)}else if(A.isDataArrayTexture)Tt?(Nt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Z,Dt,ht.width,ht.height,ht.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ht.width,ht.height,ht.depth,Ut,Ct,ht.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,Dt,ht.width,ht.height,ht.depth,0,Ut,Ct,ht.data);else if(A.isData3DTexture)Tt?(Nt&&e.texStorage3D(n.TEXTURE_3D,Z,Dt,ht.width,ht.height,ht.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ht.width,ht.height,ht.depth,Ut,Ct,ht.data)):e.texImage3D(n.TEXTURE_3D,0,Dt,ht.width,ht.height,ht.depth,0,Ut,Ct,ht.data);else if(A.isFramebufferTexture){if(Nt)if(Tt)e.texStorage2D(n.TEXTURE_2D,Z,Dt,ht.width,ht.height);else{let et=ht.width,N=ht.height;for(let at=0;at<Z;at++)e.texImage2D(n.TEXTURE_2D,at,Dt,et,N,0,Ut,Ct,null),et>>=1,N>>=1}}else if(k.length>0&&At){Tt&&Nt&&e.texStorage2D(n.TEXTURE_2D,Z,Dt,k[0].width,k[0].height);for(let et=0,N=k.length;et<N;et++)Rt=k[et],Tt?e.texSubImage2D(n.TEXTURE_2D,et,0,0,Ut,Ct,Rt):e.texImage2D(n.TEXTURE_2D,et,Dt,Ut,Ct,Rt);A.generateMipmaps=!1}else Tt?(Nt&&e.texStorage2D(n.TEXTURE_2D,Z,Dt,ht.width,ht.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,Ut,Ct,ht)):e.texImage2D(n.TEXTURE_2D,0,Dt,Ut,Ct,ht);x(A,At)&&v(ft),vt.__version=dt.version,A.onUpdate&&A.onUpdate(A)}y.__version=A.version}function K(y,A,$){if(A.image.length!==6)return;const ft=Y(y,A),ot=A.source;e.bindTexture(n.TEXTURE_CUBE_MAP,y.__webglTexture,n.TEXTURE0+$);const dt=i.get(ot);if(ot.version!==dt.__version||ft===!0){e.activeTexture(n.TEXTURE0+$);const vt=ie.getPrimaries(ie.workingColorSpace),bt=A.colorSpace===on?null:ie.getPrimaries(A.colorSpace),Mt=A.colorSpace===on||vt===bt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);const yt=A.isCompressedTexture||A.image[0].isCompressedTexture,wt=A.image[0]&&A.image[0].isDataTexture,ht=[];for(let et=0;et<6;et++)!yt&&!wt?ht[et]=_(A.image[et],!1,!0,s.maxCubemapSize):ht[et]=wt?A.image[et].image:A.image[et],ht[et]=ut(A,ht[et]);const At=ht[0],Ut=p(At)||o,Ct=r.convert(A.format,A.colorSpace),Dt=r.convert(A.type),Rt=M(A.internalFormat,Ct,Dt,A.colorSpace),k=o&&A.isVideoTexture!==!0,Tt=dt.__version===void 0||ft===!0;let Nt=E(A,At,Ut);U(n.TEXTURE_CUBE_MAP,A,Ut);let Z;if(yt){k&&Tt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Nt,Rt,At.width,At.height);for(let et=0;et<6;et++){Z=ht[et].mipmaps;for(let N=0;N<Z.length;N++){const at=Z[N];A.format!==mn?Ct!==null?k?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,N,0,0,at.width,at.height,Ct,at.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,N,Rt,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,N,0,0,at.width,at.height,Ct,Dt,at.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,N,Rt,at.width,at.height,0,Ct,Dt,at.data)}}}else{Z=A.mipmaps,k&&Tt&&(Z.length>0&&Nt++,e.texStorage2D(n.TEXTURE_CUBE_MAP,Nt,Rt,ht[0].width,ht[0].height));for(let et=0;et<6;et++)if(wt){k?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,ht[et].width,ht[et].height,Ct,Dt,ht[et].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Rt,ht[et].width,ht[et].height,0,Ct,Dt,ht[et].data);for(let N=0;N<Z.length;N++){const xt=Z[N].image[et].image;k?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,N+1,0,0,xt.width,xt.height,Ct,Dt,xt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,N+1,Rt,xt.width,xt.height,0,Ct,Dt,xt.data)}}else{k?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Ct,Dt,ht[et]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Rt,Ct,Dt,ht[et]);for(let N=0;N<Z.length;N++){const at=Z[N];k?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,N+1,0,0,Ct,Dt,at.image[et]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,N+1,Rt,Ct,Dt,at.image[et])}}}x(A,Ut)&&v(n.TEXTURE_CUBE_MAP),dt.__version=ot.version,A.onUpdate&&A.onUpdate(A)}y.__version=A.version}function Q(y,A,$,ft,ot,dt){const vt=r.convert($.format,$.colorSpace),bt=r.convert($.type),Mt=M($.internalFormat,vt,bt,$.colorSpace);if(!i.get(A).__hasExternalTextures){const wt=Math.max(1,A.width>>dt),ht=Math.max(1,A.height>>dt);ot===n.TEXTURE_3D||ot===n.TEXTURE_2D_ARRAY?e.texImage3D(ot,dt,Mt,wt,ht,A.depth,0,vt,bt,null):e.texImage2D(ot,dt,Mt,wt,ht,0,vt,bt,null)}e.bindFramebuffer(n.FRAMEBUFFER,y),st(A)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ft,ot,i.get($).__webglTexture,0,it(A)):(ot===n.TEXTURE_2D||ot>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ot<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ft,ot,i.get($).__webglTexture,dt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function nt(y,A,$){if(n.bindRenderbuffer(n.RENDERBUFFER,y),A.depthBuffer&&!A.stencilBuffer){let ft=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if($||st(A)){const ot=A.depthTexture;ot&&ot.isDepthTexture&&(ot.type===hi?ft=n.DEPTH_COMPONENT32F:ot.type===li&&(ft=n.DEPTH_COMPONENT24));const dt=it(A);st(A)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,dt,ft,A.width,A.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,dt,ft,A.width,A.height)}else n.renderbufferStorage(n.RENDERBUFFER,ft,A.width,A.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,y)}else if(A.depthBuffer&&A.stencilBuffer){const ft=it(A);$&&st(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ft,n.DEPTH24_STENCIL8,A.width,A.height):st(A)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ft,n.DEPTH24_STENCIL8,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,y)}else{const ft=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let ot=0;ot<ft.length;ot++){const dt=ft[ot],vt=r.convert(dt.format,dt.colorSpace),bt=r.convert(dt.type),Mt=M(dt.internalFormat,vt,bt,dt.colorSpace),yt=it(A);$&&st(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,yt,Mt,A.width,A.height):st(A)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,yt,Mt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,Mt,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function rt(y,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,y),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(A.depthTexture).__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),D(A.depthTexture,0);const ft=i.get(A.depthTexture).__webglTexture,ot=it(A);if(A.depthTexture.format===Ii)st(A)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ft,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ft,0);else if(A.depthTexture.format===ws)st(A)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ft,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ft,0);else throw new Error("Unknown depthTexture format")}function ct(y){const A=i.get(y),$=y.isWebGLCubeRenderTarget===!0;if(y.depthTexture&&!A.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");rt(A.__webglFramebuffer,y)}else if($){A.__webglDepthbuffer=[];for(let ft=0;ft<6;ft++)e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ft]),A.__webglDepthbuffer[ft]=n.createRenderbuffer(),nt(A.__webglDepthbuffer[ft],y,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer=n.createRenderbuffer(),nt(A.__webglDepthbuffer,y,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function _t(y,A,$){const ft=i.get(y);A!==void 0&&Q(ft.__webglFramebuffer,y,y.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),$!==void 0&&ct(y)}function H(y){const A=y.texture,$=i.get(y),ft=i.get(A);y.addEventListener("dispose",C),y.isWebGLMultipleRenderTargets!==!0&&(ft.__webglTexture===void 0&&(ft.__webglTexture=n.createTexture()),ft.__version=A.version,a.memory.textures++);const ot=y.isWebGLCubeRenderTarget===!0,dt=y.isWebGLMultipleRenderTargets===!0,vt=p(y)||o;if(ot){$.__webglFramebuffer=[];for(let bt=0;bt<6;bt++)if(o&&A.mipmaps&&A.mipmaps.length>0){$.__webglFramebuffer[bt]=[];for(let Mt=0;Mt<A.mipmaps.length;Mt++)$.__webglFramebuffer[bt][Mt]=n.createFramebuffer()}else $.__webglFramebuffer[bt]=n.createFramebuffer()}else{if(o&&A.mipmaps&&A.mipmaps.length>0){$.__webglFramebuffer=[];for(let bt=0;bt<A.mipmaps.length;bt++)$.__webglFramebuffer[bt]=n.createFramebuffer()}else $.__webglFramebuffer=n.createFramebuffer();if(dt)if(s.drawBuffers){const bt=y.texture;for(let Mt=0,yt=bt.length;Mt<yt;Mt++){const wt=i.get(bt[Mt]);wt.__webglTexture===void 0&&(wt.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&y.samples>0&&st(y)===!1){const bt=dt?A:[A];$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let Mt=0;Mt<bt.length;Mt++){const yt=bt[Mt];$.__webglColorRenderbuffer[Mt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[Mt]);const wt=r.convert(yt.format,yt.colorSpace),ht=r.convert(yt.type),At=M(yt.internalFormat,wt,ht,yt.colorSpace,y.isXRRenderTarget===!0),Ut=it(y);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ut,At,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.RENDERBUFFER,$.__webglColorRenderbuffer[Mt])}n.bindRenderbuffer(n.RENDERBUFFER,null),y.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),nt($.__webglDepthRenderbuffer,y,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ot){e.bindTexture(n.TEXTURE_CUBE_MAP,ft.__webglTexture),U(n.TEXTURE_CUBE_MAP,A,vt);for(let bt=0;bt<6;bt++)if(o&&A.mipmaps&&A.mipmaps.length>0)for(let Mt=0;Mt<A.mipmaps.length;Mt++)Q($.__webglFramebuffer[bt][Mt],y,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+bt,Mt);else Q($.__webglFramebuffer[bt],y,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0);x(A,vt)&&v(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(dt){const bt=y.texture;for(let Mt=0,yt=bt.length;Mt<yt;Mt++){const wt=bt[Mt],ht=i.get(wt);e.bindTexture(n.TEXTURE_2D,ht.__webglTexture),U(n.TEXTURE_2D,wt,vt),Q($.__webglFramebuffer,y,wt,n.COLOR_ATTACHMENT0+Mt,n.TEXTURE_2D,0),x(wt,vt)&&v(n.TEXTURE_2D)}e.unbindTexture()}else{let bt=n.TEXTURE_2D;if((y.isWebGL3DRenderTarget||y.isWebGLArrayRenderTarget)&&(o?bt=y.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(bt,ft.__webglTexture),U(bt,A,vt),o&&A.mipmaps&&A.mipmaps.length>0)for(let Mt=0;Mt<A.mipmaps.length;Mt++)Q($.__webglFramebuffer[Mt],y,A,n.COLOR_ATTACHMENT0,bt,Mt);else Q($.__webglFramebuffer,y,A,n.COLOR_ATTACHMENT0,bt,0);x(A,vt)&&v(bt),e.unbindTexture()}y.depthBuffer&&ct(y)}function V(y){const A=p(y)||o,$=y.isWebGLMultipleRenderTargets===!0?y.texture:[y.texture];for(let ft=0,ot=$.length;ft<ot;ft++){const dt=$[ft];if(x(dt,A)){const vt=y.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,bt=i.get(dt).__webglTexture;e.bindTexture(vt,bt),v(vt),e.unbindTexture()}}}function j(y){if(o&&y.samples>0&&st(y)===!1){const A=y.isWebGLMultipleRenderTargets?y.texture:[y.texture],$=y.width,ft=y.height;let ot=n.COLOR_BUFFER_BIT;const dt=[],vt=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,bt=i.get(y),Mt=y.isWebGLMultipleRenderTargets===!0;if(Mt)for(let yt=0;yt<A.length;yt++)e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let yt=0;yt<A.length;yt++){dt.push(n.COLOR_ATTACHMENT0+yt),y.depthBuffer&&dt.push(vt);const wt=bt.__ignoreDepthValues!==void 0?bt.__ignoreDepthValues:!1;if(wt===!1&&(y.depthBuffer&&(ot|=n.DEPTH_BUFFER_BIT),y.stencilBuffer&&(ot|=n.STENCIL_BUFFER_BIT)),Mt&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,bt.__webglColorRenderbuffer[yt]),wt===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[vt]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[vt])),Mt){const ht=i.get(A[yt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ht,0)}n.blitFramebuffer(0,0,$,ft,0,0,$,ft,ot,n.NEAREST),l&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,dt)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Mt)for(let yt=0;yt<A.length;yt++){e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.RENDERBUFFER,bt.__webglColorRenderbuffer[yt]);const wt=i.get(A[yt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.TEXTURE_2D,wt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}}function it(y){return Math.min(s.maxSamples,y.samples)}function st(y){const A=i.get(y);return o&&y.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function St(y){const A=a.render.frame;h.get(y)!==A&&(h.set(y,A),y.update())}function ut(y,A){const $=y.colorSpace,ft=y.format,ot=y.type;return y.isCompressedTexture===!0||y.isVideoTexture===!0||y.format===Wa||$!==Kn&&$!==on&&(ie.getTransfer($)===ce?o===!1?t.has("EXT_sRGB")===!0&&ft===mn?(y.format=Wa,y.minFilter=sn,y.generateMipmaps=!1):A=xu.sRGBToLinear(A):(ft!==mn||ot!==Yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),A}this.allocateTextureUnit=R,this.resetTextureUnits=W,this.setTexture2D=D,this.setTexture2DArray=z,this.setTexture3D=B,this.setTextureCube=F,this.rebindTextures=_t,this.setupRenderTarget=H,this.updateRenderTargetMipmap=V,this.updateMultisampleRenderTarget=j,this.setupDepthRenderbuffer=ct,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=st}function o_(n,t,e){const i=e.isWebGL2;function s(r,a=on){let o;const c=ie.getTransfer(a);if(r===Yn)return n.UNSIGNED_BYTE;if(r===lu)return n.UNSIGNED_SHORT_4_4_4_4;if(r===hu)return n.UNSIGNED_SHORT_5_5_5_1;if(r===Gd)return n.BYTE;if(r===Hd)return n.SHORT;if(r===gc)return n.UNSIGNED_SHORT;if(r===cu)return n.INT;if(r===li)return n.UNSIGNED_INT;if(r===hi)return n.FLOAT;if(r===nr)return i?n.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===Vd)return n.ALPHA;if(r===mn)return n.RGBA;if(r===Wd)return n.LUMINANCE;if(r===qd)return n.LUMINANCE_ALPHA;if(r===Ii)return n.DEPTH_COMPONENT;if(r===ws)return n.DEPTH_STENCIL;if(r===Wa)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Xd)return n.RED;if(r===uu)return n.RED_INTEGER;if(r===jd)return n.RG;if(r===fu)return n.RG_INTEGER;if(r===du)return n.RGBA_INTEGER;if(r===zo||r===Bo||r===Go||r===Ho)if(c===ce)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===zo)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Bo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Go)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Ho)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===zo)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Bo)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Go)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Ho)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Jc||r===Qc||r===tl||r===el)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Jc)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Qc)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===tl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===el)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===pu)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===nl||r===il)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===nl)return c===ce?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===il)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===sl||r===rl||r===ol||r===al||r===cl||r===ll||r===hl||r===ul||r===fl||r===dl||r===pl||r===ml||r===gl||r===_l)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===sl)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===rl)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===ol)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===al)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===cl)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ll)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===hl)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===ul)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===fl)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===dl)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===pl)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===ml)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===gl)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===_l)return c===ce?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Vo||r===vl||r===xl)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===Vo)return c===ce?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===vl)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===xl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Yd||r===Ml||r===yl||r===bl)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===Vo)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Ml)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===yl)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===bl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Di?i?n.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):n[r]!==void 0?n[r]:null}return{convert:s}}class a_ extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class gn extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}}const c_={type:"move"};class da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new gn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new gn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new gn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const _ of t.hand.values()){const p=e.getJointPose(_,i),m=this._getHandJoint(l,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(c_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new gn;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class l_ extends Gi{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null;const _=e.getContextAttributes();let p=null,m=null;const x=[],v=[],M=new Lt;let E=null;const w=new rn;w.layers.enable(1),w.viewport=new Ie;const b=new rn;b.layers.enable(2),b.viewport=new Ie;const C=[w,b],S=new a_;S.layers.enable(1),S.layers.enable(2);let T=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let Y=x[U];return Y===void 0&&(Y=new da,x[U]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(U){let Y=x[U];return Y===void 0&&(Y=new da,x[U]=Y),Y.getGripSpace()},this.getHand=function(U){let Y=x[U];return Y===void 0&&(Y=new da,x[U]=Y),Y.getHandSpace()};function P(U){const Y=v.indexOf(U.inputSource);if(Y===-1)return;const G=x[Y];G!==void 0&&(G.update(U.inputSource,U.frame,l||a),G.dispatchEvent({type:U.type,data:U.inputSource}))}function W(){s.removeEventListener("select",P),s.removeEventListener("selectstart",P),s.removeEventListener("selectend",P),s.removeEventListener("squeeze",P),s.removeEventListener("squeezestart",P),s.removeEventListener("squeezeend",P),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",R);for(let U=0;U<x.length;U++){const Y=v[U];Y!==null&&(v[U]=null,x[U].disconnect(Y))}T=null,L=null,t.setRenderTarget(p),d=null,f=null,u=null,s=null,m=null,J.stop(),i.isPresenting=!1,t.setPixelRatio(E),t.setSize(M.width,M.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){r=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){o=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(U){l=U},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(U){if(s=U,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",P),s.addEventListener("selectstart",P),s.addEventListener("selectend",P),s.addEventListener("squeeze",P),s.addEventListener("squeezestart",P),s.addEventListener("squeezeend",P),s.addEventListener("end",W),s.addEventListener("inputsourceschange",R),_.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const Y={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,Y),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),m=new ki(d.framebufferWidth,d.framebufferHeight,{format:mn,type:Yn,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let Y=null,G=null,K=null;_.depth&&(K=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Y=_.stencil?ws:Ii,G=_.stencil?Di:li);const Q={colorFormat:e.RGBA8,depthFormat:K,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(Q),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),m=new ki(f.textureWidth,f.textureHeight,{format:mn,type:Yn,depthTexture:new Lu(f.textureWidth,f.textureHeight,G,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const nt=t.properties.get(m);nt.__ignoreDepthValues=f.ignoreDepthValues}m.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),J.setContext(s),J.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function R(U){for(let Y=0;Y<U.removed.length;Y++){const G=U.removed[Y],K=v.indexOf(G);K>=0&&(v[K]=null,x[K].disconnect(G))}for(let Y=0;Y<U.added.length;Y++){const G=U.added[Y];let K=v.indexOf(G);if(K===-1){for(let nt=0;nt<x.length;nt++)if(nt>=v.length){v.push(G),K=nt;break}else if(v[nt]===null){v[nt]=G,K=nt;break}if(K===-1)break}const Q=x[K];Q&&Q.connect(G)}}const I=new q,D=new q;function z(U,Y,G){I.setFromMatrixPosition(Y.matrixWorld),D.setFromMatrixPosition(G.matrixWorld);const K=I.distanceTo(D),Q=Y.projectionMatrix.elements,nt=G.projectionMatrix.elements,rt=Q[14]/(Q[10]-1),ct=Q[14]/(Q[10]+1),_t=(Q[9]+1)/Q[5],H=(Q[9]-1)/Q[5],V=(Q[8]-1)/Q[0],j=(nt[8]+1)/nt[0],it=rt*V,st=rt*j,St=K/(-V+j),ut=St*-V;Y.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(ut),U.translateZ(St),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert();const y=rt+St,A=ct+St,$=it-ut,ft=st+(K-ut),ot=_t*ct/A*y,dt=H*ct/A*y;U.projectionMatrix.makePerspective($,ft,ot,dt,y,A),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}function B(U,Y){Y===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(Y.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(s===null)return;S.near=b.near=w.near=U.near,S.far=b.far=w.far=U.far,(T!==S.near||L!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),T=S.near,L=S.far);const Y=U.parent,G=S.cameras;B(S,Y);for(let K=0;K<G.length;K++)B(G[K],Y);G.length===2?z(S,w,b):S.projectionMatrix.copy(w.projectionMatrix),F(U,S,Y)};function F(U,Y,G){G===null?U.matrix.copy(Y.matrixWorld):(U.matrix.copy(G.matrixWorld),U.matrix.invert(),U.matrix.multiply(Y.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(Y.projectionMatrix),U.projectionMatrixInverse.copy(Y.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=lo*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(U){c=U,f!==null&&(f.fixedFoveation=U),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=U)};let X=null;function tt(U,Y){if(h=Y.getViewerPose(l||a),g=Y,h!==null){const G=h.views;d!==null&&(t.setRenderTargetFramebuffer(m,d.framebuffer),t.setRenderTarget(m));let K=!1;G.length!==S.cameras.length&&(S.cameras.length=0,K=!0);for(let Q=0;Q<G.length;Q++){const nt=G[Q];let rt=null;if(d!==null)rt=d.getViewport(nt);else{const _t=u.getViewSubImage(f,nt);rt=_t.viewport,Q===0&&(t.setRenderTargetTextures(m,_t.colorTexture,f.ignoreDepthValues?void 0:_t.depthStencilTexture),t.setRenderTarget(m))}let ct=C[Q];ct===void 0&&(ct=new rn,ct.layers.enable(Q),ct.viewport=new Ie,C[Q]=ct),ct.matrix.fromArray(nt.transform.matrix),ct.matrix.decompose(ct.position,ct.quaternion,ct.scale),ct.projectionMatrix.fromArray(nt.projectionMatrix),ct.projectionMatrixInverse.copy(ct.projectionMatrix).invert(),ct.viewport.set(rt.x,rt.y,rt.width,rt.height),Q===0&&(S.matrix.copy(ct.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),K===!0&&S.cameras.push(ct)}}for(let G=0;G<x.length;G++){const K=v[G],Q=x[G];K!==null&&Q!==void 0&&Q.update(K,Y,l||a)}X&&X(U,Y),Y.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Y}),g=null}const J=new Ru;J.setAnimationLoop(tt),this.setAnimationLoop=function(U){X=U},this.dispose=function(){}}}function h_(n,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,Eu(n)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,x,v,M){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),f(p,m),m.isMeshPhysicalMaterial&&d(p,m,M)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),_(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,x,v):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Xe&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Xe&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const x=t.get(m).envMap;if(x&&(p.envMap.value=x,p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap){p.lightMap.value=m.lightMap;const v=n._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=m.lightMapIntensity*v,e(m.lightMap,p.lightMapTransform)}m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,x,v){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*x,p.scale.value=v*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),t.get(m).envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,x){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Xe&&p.clearcoatNormalScale.value.negate())),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const x=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function u_(n,t,e,i){let s={},r={},a=[];const o=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(x,v){const M=v.program;i.uniformBlockBinding(x,M)}function l(x,v){let M=s[x.id];M===void 0&&(g(x),M=h(x),s[x.id]=M,x.addEventListener("dispose",p));const E=v.program;i.updateUBOMapping(x,E);const w=t.render.frame;r[x.id]!==w&&(f(x),r[x.id]=w)}function h(x){const v=u();x.__bindingPointIndex=v;const M=n.createBuffer(),E=x.__size,w=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,E,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,M),M}function u(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const v=s[x.id],M=x.uniforms,E=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let w=0,b=M.length;w<b;w++){const C=Array.isArray(M[w])?M[w]:[M[w]];for(let S=0,T=C.length;S<T;S++){const L=C[S];if(d(L,w,S,E)===!0){const P=L.__offset,W=Array.isArray(L.value)?L.value:[L.value];let R=0;for(let I=0;I<W.length;I++){const D=W[I],z=_(D);typeof D=="number"||typeof D=="boolean"?(L.__data[0]=D,n.bufferSubData(n.UNIFORM_BUFFER,P+R,L.__data)):D.isMatrix3?(L.__data[0]=D.elements[0],L.__data[1]=D.elements[1],L.__data[2]=D.elements[2],L.__data[3]=0,L.__data[4]=D.elements[3],L.__data[5]=D.elements[4],L.__data[6]=D.elements[5],L.__data[7]=0,L.__data[8]=D.elements[6],L.__data[9]=D.elements[7],L.__data[10]=D.elements[8],L.__data[11]=0):(D.toArray(L.__data,R),R+=z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,P,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(x,v,M,E){const w=x.value,b=v+"_"+M;if(E[b]===void 0)return typeof w=="number"||typeof w=="boolean"?E[b]=w:E[b]=w.clone(),!0;{const C=E[b];if(typeof w=="number"||typeof w=="boolean"){if(C!==w)return E[b]=w,!0}else if(C.equals(w)===!1)return C.copy(w),!0}return!1}function g(x){const v=x.uniforms;let M=0;const E=16;for(let b=0,C=v.length;b<C;b++){const S=Array.isArray(v[b])?v[b]:[v[b]];for(let T=0,L=S.length;T<L;T++){const P=S[T],W=Array.isArray(P.value)?P.value:[P.value];for(let R=0,I=W.length;R<I;R++){const D=W[R],z=_(D),B=M%E;B!==0&&E-B<z.boundary&&(M+=E-B),P.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=M,M+=z.storage}}}const w=M%E;return w>0&&(M+=E-w),x.__size=M,x.__cache={},this}function _(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function p(x){const v=x.target;v.removeEventListener("dispose",p);const M=a.indexOf(v.__bindingPointIndex);a.splice(M,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function m(){for(const x in s)n.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:c,update:l,dispose:m}}class ku{constructor(t={}){const{canvas:e=a0(),context:i=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;i!==null?f=i.getContextAttributes().alpha:f=a;const d=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const m=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Te,this._useLegacyLights=!1,this.toneMapping=jn,this.toneMappingExposure=1;const v=this;let M=!1,E=0,w=0,b=null,C=-1,S=null;const T=new Ie,L=new Ie;let P=null;const W=new Xt(0);let R=0,I=e.width,D=e.height,z=1,B=null,F=null;const X=new Ie(0,0,I,D),tt=new Ie(0,0,I,D);let J=!1;const U=new xc;let Y=!1,G=!1,K=null;const Q=new ae,nt=new Lt,rt=new q,ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function _t(){return b===null?z:1}let H=i;function V(O,lt){for(let pt=0;pt<O.length;pt++){const gt=O[pt],mt=e.getContext(gt,lt);if(mt!==null)return mt}return null}try{const O={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${mc}`),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",N,!1),e.addEventListener("webglcontextcreationerror",at,!1),H===null){const lt=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&lt.shift(),H=V(lt,O),H===null)throw V(lt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&H instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),H.getShaderPrecisionFormat===void 0&&(H.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(O){throw console.error("THREE.WebGLRenderer: "+O.message),O}let j,it,st,St,ut,y,A,$,ft,ot,dt,vt,bt,Mt,yt,wt,ht,At,Ut,Ct,Dt,Rt,k,Tt;function Nt(){j=new yg(H),it=new mg(H,j,t),j.init(it),Rt=new o_(H,j,it),st=new s_(H,j,it),St=new wg(H),ut=new W1,y=new r_(H,j,st,ut,it,Rt,St),A=new _g(v),$=new Mg(v),ft=new D0(H,it),k=new dg(H,j,ft,it),ot=new bg(H,ft,St,k),dt=new Rg(H,ot,ft,St),Ut=new Ag(H,it,y),wt=new gg(ut),vt=new V1(v,A,$,j,it,k,wt),bt=new h_(v,ut),Mt=new X1,yt=new J1(j,it),At=new fg(v,A,$,st,dt,f,c),ht=new i_(v,dt,it),Tt=new u_(H,St,it,st),Ct=new pg(H,j,St,it),Dt=new Sg(H,j,St,it),St.programs=vt.programs,v.capabilities=it,v.extensions=j,v.properties=ut,v.renderLists=Mt,v.shadowMap=ht,v.state=st,v.info=St}Nt();const Z=new l_(v,H);this.xr=Z,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const O=j.get("WEBGL_lose_context");O&&O.loseContext()},this.forceContextRestore=function(){const O=j.get("WEBGL_lose_context");O&&O.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(O){O!==void 0&&(z=O,this.setSize(I,D,!1))},this.getSize=function(O){return O.set(I,D)},this.setSize=function(O,lt,pt=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=O,D=lt,e.width=Math.floor(O*z),e.height=Math.floor(lt*z),pt===!0&&(e.style.width=O+"px",e.style.height=lt+"px"),this.setViewport(0,0,O,lt)},this.getDrawingBufferSize=function(O){return O.set(I*z,D*z).floor()},this.setDrawingBufferSize=function(O,lt,pt){I=O,D=lt,z=pt,e.width=Math.floor(O*pt),e.height=Math.floor(lt*pt),this.setViewport(0,0,O,lt)},this.getCurrentViewport=function(O){return O.copy(T)},this.getViewport=function(O){return O.copy(X)},this.setViewport=function(O,lt,pt,gt){O.isVector4?X.set(O.x,O.y,O.z,O.w):X.set(O,lt,pt,gt),st.viewport(T.copy(X).multiplyScalar(z).floor())},this.getScissor=function(O){return O.copy(tt)},this.setScissor=function(O,lt,pt,gt){O.isVector4?tt.set(O.x,O.y,O.z,O.w):tt.set(O,lt,pt,gt),st.scissor(L.copy(tt).multiplyScalar(z).floor())},this.getScissorTest=function(){return J},this.setScissorTest=function(O){st.setScissorTest(J=O)},this.setOpaqueSort=function(O){B=O},this.setTransparentSort=function(O){F=O},this.getClearColor=function(O){return O.copy(At.getClearColor())},this.setClearColor=function(){At.setClearColor.apply(At,arguments)},this.getClearAlpha=function(){return At.getClearAlpha()},this.setClearAlpha=function(){At.setClearAlpha.apply(At,arguments)},this.clear=function(O=!0,lt=!0,pt=!0){let gt=0;if(O){let mt=!1;if(b!==null){const Ft=b.texture.format;mt=Ft===du||Ft===fu||Ft===uu}if(mt){const Ft=b.texture.type,zt=Ft===Yn||Ft===li||Ft===gc||Ft===Di||Ft===lu||Ft===hu,Ht=At.getClearColor(),Vt=At.getClearAlpha(),Kt=Ht.r,qt=Ht.g,jt=Ht.b;zt?(d[0]=Kt,d[1]=qt,d[2]=jt,d[3]=Vt,H.clearBufferuiv(H.COLOR,0,d)):(g[0]=Kt,g[1]=qt,g[2]=jt,g[3]=Vt,H.clearBufferiv(H.COLOR,0,g))}else gt|=H.COLOR_BUFFER_BIT}lt&&(gt|=H.DEPTH_BUFFER_BIT),pt&&(gt|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(gt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",N,!1),e.removeEventListener("webglcontextcreationerror",at,!1),Mt.dispose(),yt.dispose(),ut.dispose(),A.dispose(),$.dispose(),dt.dispose(),k.dispose(),Tt.dispose(),vt.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",te),Z.removeEventListener("sessionend",Wt),K&&(K.dispose(),K=null),ee.stop()};function et(O){O.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function N(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const O=St.autoReset,lt=ht.enabled,pt=ht.autoUpdate,gt=ht.needsUpdate,mt=ht.type;Nt(),St.autoReset=O,ht.enabled=lt,ht.autoUpdate=pt,ht.needsUpdate=gt,ht.type=mt}function at(O){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",O.statusMessage)}function xt(O){const lt=O.target;lt.removeEventListener("dispose",xt),Et(lt)}function Et(O){Pt(O),ut.remove(O)}function Pt(O){const lt=ut.get(O).programs;lt!==void 0&&(lt.forEach(function(pt){vt.releaseProgram(pt)}),O.isShaderMaterial&&vt.releaseShaderCache(O))}this.renderBufferDirect=function(O,lt,pt,gt,mt,Ft){lt===null&&(lt=ct);const zt=mt.isMesh&&mt.matrixWorld.determinant()<0,Ht=Be(O,lt,pt,gt,mt);st.setMaterial(gt,zt);let Vt=pt.index,Kt=1;if(gt.wireframe===!0){if(Vt=ot.getWireframeAttribute(pt),Vt===void 0)return;Kt=2}const qt=pt.drawRange,jt=pt.attributes.position;let ye=qt.start*Kt,tn=(qt.start+qt.count)*Kt;Ft!==null&&(ye=Math.max(ye,Ft.start*Kt),tn=Math.min(tn,(Ft.start+Ft.count)*Kt)),Vt!==null?(ye=Math.max(ye,0),tn=Math.min(tn,Vt.count)):jt!=null&&(ye=Math.max(ye,0),tn=Math.min(tn,jt.count));const Ce=tn-ye;if(Ce<0||Ce===1/0)return;k.setup(mt,gt,Ht,pt,Vt);let On,de=Ct;if(Vt!==null&&(On=ft.get(Vt),de=Dt,de.setIndex(On)),mt.isMesh)gt.wireframe===!0?(st.setLineWidth(gt.wireframeLinewidth*_t()),de.setMode(H.LINES)):de.setMode(H.TRIANGLES);else if(mt.isLine){let Zt=gt.linewidth;Zt===void 0&&(Zt=1),st.setLineWidth(Zt*_t()),mt.isLineSegments?de.setMode(H.LINES):mt.isLineLoop?de.setMode(H.LINE_LOOP):de.setMode(H.LINE_STRIP)}else mt.isPoints?de.setMode(H.POINTS):mt.isSprite&&de.setMode(H.TRIANGLES);if(mt.isBatchedMesh)de.renderMultiDraw(mt._multiDrawStarts,mt._multiDrawCounts,mt._multiDrawCount);else if(mt.isInstancedMesh)de.renderInstances(ye,Ce,mt.count);else if(pt.isInstancedBufferGeometry){const Zt=pt._maxInstanceCount!==void 0?pt._maxInstanceCount:1/0,Uo=Math.min(pt.instanceCount,Zt);de.renderInstances(ye,Ce,Uo)}else de.render(ye,Ce)};function Ot(O,lt,pt){O.transparent===!0&&O.side===Pn&&O.forceSinglePass===!1?(O.side=Xe,O.needsUpdate=!0,ti(O,lt,pt),O.side=gi,O.needsUpdate=!0,ti(O,lt,pt),O.side=Pn):ti(O,lt,pt)}this.compile=function(O,lt,pt=null){pt===null&&(pt=O),p=yt.get(pt),p.init(),x.push(p),pt.traverseVisible(function(mt){mt.isLight&&mt.layers.test(lt.layers)&&(p.pushLight(mt),mt.castShadow&&p.pushShadow(mt))}),O!==pt&&O.traverseVisible(function(mt){mt.isLight&&mt.layers.test(lt.layers)&&(p.pushLight(mt),mt.castShadow&&p.pushShadow(mt))}),p.setupLights(v._useLegacyLights);const gt=new Set;return O.traverse(function(mt){const Ft=mt.material;if(Ft)if(Array.isArray(Ft))for(let zt=0;zt<Ft.length;zt++){const Ht=Ft[zt];Ot(Ht,pt,mt),gt.add(Ht)}else Ot(Ft,pt,mt),gt.add(Ft)}),x.pop(),p=null,gt},this.compileAsync=function(O,lt,pt=null){const gt=this.compile(O,lt,pt);return new Promise(mt=>{function Ft(){if(gt.forEach(function(zt){ut.get(zt).currentProgram.isReady()&&gt.delete(zt)}),gt.size===0){mt(O);return}setTimeout(Ft,10)}j.get("KHR_parallel_shader_compile")!==null?Ft():setTimeout(Ft,10)})};let Bt=null;function Qt(O){Bt&&Bt(O)}function te(){ee.stop()}function Wt(){ee.start()}const ee=new Ru;ee.setAnimationLoop(Qt),typeof self<"u"&&ee.setContext(self),this.setAnimationLoop=function(O){Bt=O,Z.setAnimationLoop(O),O===null?ee.stop():ee.start()},Z.addEventListener("sessionstart",te),Z.addEventListener("sessionend",Wt),this.render=function(O,lt){if(lt!==void 0&&lt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),lt.parent===null&&lt.matrixWorldAutoUpdate===!0&&lt.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(lt),lt=Z.getCamera()),O.isScene===!0&&O.onBeforeRender(v,O,lt,b),p=yt.get(O,x.length),p.init(),x.push(p),Q.multiplyMatrices(lt.projectionMatrix,lt.matrixWorldInverse),U.setFromProjectionMatrix(Q),G=this.localClippingEnabled,Y=wt.init(this.clippingPlanes,G),_=Mt.get(O,m.length),_.init(),m.push(_),fe(O,lt,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(B,F),this.info.render.frame++,Y===!0&&wt.beginShadows();const pt=p.state.shadowsArray;if(ht.render(pt,O,lt),Y===!0&&wt.endShadows(),this.info.autoReset===!0&&this.info.reset(),At.render(_,O),p.setupLights(v._useLegacyLights),lt.isArrayCamera){const gt=lt.cameras;for(let mt=0,Ft=gt.length;mt<Ft;mt++){const zt=gt[mt];Fn(_,O,zt,zt.viewport)}}else Fn(_,O,lt);b!==null&&(y.updateMultisampleRenderTarget(b),y.updateRenderTargetMipmap(b)),O.isScene===!0&&O.onAfterRender(v,O,lt),k.resetDefaultState(),C=-1,S=null,x.pop(),x.length>0?p=x[x.length-1]:p=null,m.pop(),m.length>0?_=m[m.length-1]:_=null};function fe(O,lt,pt,gt){if(O.visible===!1)return;if(O.layers.test(lt.layers)){if(O.isGroup)pt=O.renderOrder;else if(O.isLOD)O.autoUpdate===!0&&O.update(lt);else if(O.isLight)p.pushLight(O),O.castShadow&&p.pushShadow(O);else if(O.isSprite){if(!O.frustumCulled||U.intersectsSprite(O)){gt&&rt.setFromMatrixPosition(O.matrixWorld).applyMatrix4(Q);const zt=dt.update(O),Ht=O.material;Ht.visible&&_.push(O,zt,Ht,pt,rt.z,null)}}else if((O.isMesh||O.isLine||O.isPoints)&&(!O.frustumCulled||U.intersectsObject(O))){const zt=dt.update(O),Ht=O.material;if(gt&&(O.boundingSphere!==void 0?(O.boundingSphere===null&&O.computeBoundingSphere(),rt.copy(O.boundingSphere.center)):(zt.boundingSphere===null&&zt.computeBoundingSphere(),rt.copy(zt.boundingSphere.center)),rt.applyMatrix4(O.matrixWorld).applyMatrix4(Q)),Array.isArray(Ht)){const Vt=zt.groups;for(let Kt=0,qt=Vt.length;Kt<qt;Kt++){const jt=Vt[Kt],ye=Ht[jt.materialIndex];ye&&ye.visible&&_.push(O,zt,ye,pt,rt.z,jt)}}else Ht.visible&&_.push(O,zt,Ht,pt,rt.z,null)}}const Ft=O.children;for(let zt=0,Ht=Ft.length;zt<Ht;zt++)fe(Ft[zt],lt,pt,gt)}function Fn(O,lt,pt,gt){const mt=O.opaque,Ft=O.transmissive,zt=O.transparent;p.setupLightsView(pt),Y===!0&&wt.setGlobalState(v.clippingPlanes,pt),Ft.length>0&&Ne(mt,Ft,lt,pt),gt&&st.viewport(T.copy(gt)),mt.length>0&&An(mt,lt,pt),Ft.length>0&&An(Ft,lt,pt),zt.length>0&&An(zt,lt,pt),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function Ne(O,lt,pt,gt){if((pt.isScene===!0?pt.overrideMaterial:null)!==null)return;const Ft=it.isWebGL2;K===null&&(K=new ki(1,1,{generateMipmaps:!0,type:j.has("EXT_color_buffer_half_float")?nr:Yn,minFilter:Ss,samples:Ft?4:0})),v.getDrawingBufferSize(nt),Ft?K.setSize(nt.x,nt.y):K.setSize(qa(nt.x),qa(nt.y));const zt=v.getRenderTarget();v.setRenderTarget(K),v.getClearColor(W),R=v.getClearAlpha(),R<1&&v.setClearColor(16777215,.5),v.clear();const Ht=v.toneMapping;v.toneMapping=jn,An(O,pt,gt),y.updateMultisampleRenderTarget(K),y.updateRenderTargetMipmap(K);let Vt=!1;for(let Kt=0,qt=lt.length;Kt<qt;Kt++){const jt=lt[Kt],ye=jt.object,tn=jt.geometry,Ce=jt.material,On=jt.group;if(Ce.side===Pn&&ye.layers.test(gt.layers)){const de=Ce.side;Ce.side=Xe,Ce.needsUpdate=!0,Qn(ye,pt,gt,tn,Ce,On),Ce.side=de,Ce.needsUpdate=!0,Vt=!0}}Vt===!0&&(y.updateMultisampleRenderTarget(K),y.updateRenderTargetMipmap(K)),v.setRenderTarget(zt),v.setClearColor(W,R),v.toneMapping=Ht}function An(O,lt,pt){const gt=lt.isScene===!0?lt.overrideMaterial:null;for(let mt=0,Ft=O.length;mt<Ft;mt++){const zt=O[mt],Ht=zt.object,Vt=zt.geometry,Kt=gt===null?zt.material:gt,qt=zt.group;Ht.layers.test(pt.layers)&&Qn(Ht,lt,pt,Vt,Kt,qt)}}function Qn(O,lt,pt,gt,mt,Ft){O.onBeforeRender(v,lt,pt,gt,mt,Ft),O.modelViewMatrix.multiplyMatrices(pt.matrixWorldInverse,O.matrixWorld),O.normalMatrix.getNormalMatrix(O.modelViewMatrix),mt.onBeforeRender(v,lt,pt,gt,O,Ft),mt.transparent===!0&&mt.side===Pn&&mt.forceSinglePass===!1?(mt.side=Xe,mt.needsUpdate=!0,v.renderBufferDirect(pt,lt,gt,mt,O,Ft),mt.side=gi,mt.needsUpdate=!0,v.renderBufferDirect(pt,lt,gt,mt,O,Ft),mt.side=Pn):v.renderBufferDirect(pt,lt,gt,mt,O,Ft),O.onAfterRender(v,lt,pt,gt,mt,Ft)}function ti(O,lt,pt){lt.isScene!==!0&&(lt=ct);const gt=ut.get(O),mt=p.state.lights,Ft=p.state.shadowsArray,zt=mt.state.version,Ht=vt.getParameters(O,mt.state,Ft,lt,pt),Vt=vt.getProgramCacheKey(Ht);let Kt=gt.programs;gt.environment=O.isMeshStandardMaterial?lt.environment:null,gt.fog=lt.fog,gt.envMap=(O.isMeshStandardMaterial?$:A).get(O.envMap||gt.environment),Kt===void 0&&(O.addEventListener("dispose",xt),Kt=new Map,gt.programs=Kt);let qt=Kt.get(Vt);if(qt!==void 0){if(gt.currentProgram===qt&&gt.lightsStateVersion===zt)return ke(O,Ht),qt}else Ht.uniforms=vt.getUniforms(O),O.onBuild(pt,Ht,v),O.onBeforeCompile(Ht,v),qt=vt.acquireProgram(Ht,Vt),Kt.set(Vt,qt),gt.uniforms=Ht.uniforms;const jt=gt.uniforms;return(!O.isShaderMaterial&&!O.isRawShaderMaterial||O.clipping===!0)&&(jt.clippingPlanes=wt.uniform),ke(O,Ht),gt.needsLights=un(O),gt.lightsStateVersion=zt,gt.needsLights&&(jt.ambientLightColor.value=mt.state.ambient,jt.lightProbe.value=mt.state.probe,jt.directionalLights.value=mt.state.directional,jt.directionalLightShadows.value=mt.state.directionalShadow,jt.spotLights.value=mt.state.spot,jt.spotLightShadows.value=mt.state.spotShadow,jt.rectAreaLights.value=mt.state.rectArea,jt.ltc_1.value=mt.state.rectAreaLTC1,jt.ltc_2.value=mt.state.rectAreaLTC2,jt.pointLights.value=mt.state.point,jt.pointLightShadows.value=mt.state.pointShadow,jt.hemisphereLights.value=mt.state.hemi,jt.directionalShadowMap.value=mt.state.directionalShadowMap,jt.directionalShadowMatrix.value=mt.state.directionalShadowMatrix,jt.spotShadowMap.value=mt.state.spotShadowMap,jt.spotLightMatrix.value=mt.state.spotLightMatrix,jt.spotLightMap.value=mt.state.spotLightMap,jt.pointShadowMap.value=mt.state.pointShadowMap,jt.pointShadowMatrix.value=mt.state.pointShadowMatrix),gt.currentProgram=qt,gt.uniformsList=null,qt}function ks(O){if(O.uniformsList===null){const lt=O.currentProgram.getUniforms();O.uniformsList=Qr.seqWithValue(lt.seq,O.uniforms)}return O.uniformsList}function ke(O,lt){const pt=ut.get(O);pt.outputColorSpace=lt.outputColorSpace,pt.batching=lt.batching,pt.instancing=lt.instancing,pt.instancingColor=lt.instancingColor,pt.skinning=lt.skinning,pt.morphTargets=lt.morphTargets,pt.morphNormals=lt.morphNormals,pt.morphColors=lt.morphColors,pt.morphTargetsCount=lt.morphTargetsCount,pt.numClippingPlanes=lt.numClippingPlanes,pt.numIntersection=lt.numClipIntersection,pt.vertexAlphas=lt.vertexAlphas,pt.vertexTangents=lt.vertexTangents,pt.toneMapping=lt.toneMapping}function Be(O,lt,pt,gt,mt){lt.isScene!==!0&&(lt=ct),y.resetTextureUnits();const Ft=lt.fog,zt=gt.isMeshStandardMaterial?lt.environment:null,Ht=b===null?v.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Kn,Vt=(gt.isMeshStandardMaterial?$:A).get(gt.envMap||zt),Kt=gt.vertexColors===!0&&!!pt.attributes.color&&pt.attributes.color.itemSize===4,qt=!!pt.attributes.tangent&&(!!gt.normalMap||gt.anisotropy>0),jt=!!pt.morphAttributes.position,ye=!!pt.morphAttributes.normal,tn=!!pt.morphAttributes.color;let Ce=jn;gt.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(Ce=v.toneMapping);const On=pt.morphAttributes.position||pt.morphAttributes.normal||pt.morphAttributes.color,de=On!==void 0?On.length:0,Zt=ut.get(gt),Uo=p.state.lights;if(Y===!0&&(G===!0||O!==S)){const fn=O===S&&gt.id===C;wt.setState(gt,O,fn)}let ge=!1;gt.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==Uo.state.version||Zt.outputColorSpace!==Ht||mt.isBatchedMesh&&Zt.batching===!1||!mt.isBatchedMesh&&Zt.batching===!0||mt.isInstancedMesh&&Zt.instancing===!1||!mt.isInstancedMesh&&Zt.instancing===!0||mt.isSkinnedMesh&&Zt.skinning===!1||!mt.isSkinnedMesh&&Zt.skinning===!0||mt.isInstancedMesh&&Zt.instancingColor===!0&&mt.instanceColor===null||mt.isInstancedMesh&&Zt.instancingColor===!1&&mt.instanceColor!==null||Zt.envMap!==Vt||gt.fog===!0&&Zt.fog!==Ft||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==wt.numPlanes||Zt.numIntersection!==wt.numIntersection)||Zt.vertexAlphas!==Kt||Zt.vertexTangents!==qt||Zt.morphTargets!==jt||Zt.morphNormals!==ye||Zt.morphColors!==tn||Zt.toneMapping!==Ce||it.isWebGL2===!0&&Zt.morphTargetsCount!==de)&&(ge=!0):(ge=!0,Zt.__version=gt.version);let vi=Zt.currentProgram;ge===!0&&(vi=ti(gt,lt,mt));let Bc=!1,Fs=!1,No=!1;const Ge=vi.getUniforms(),xi=Zt.uniforms;if(st.useProgram(vi.program)&&(Bc=!0,Fs=!0,No=!0),gt.id!==C&&(C=gt.id,Fs=!0),Bc||S!==O){Ge.setValue(H,"projectionMatrix",O.projectionMatrix),Ge.setValue(H,"viewMatrix",O.matrixWorldInverse);const fn=Ge.map.cameraPosition;fn!==void 0&&fn.setValue(H,rt.setFromMatrixPosition(O.matrixWorld)),it.logarithmicDepthBuffer&&Ge.setValue(H,"logDepthBufFC",2/(Math.log(O.far+1)/Math.LN2)),(gt.isMeshPhongMaterial||gt.isMeshToonMaterial||gt.isMeshLambertMaterial||gt.isMeshBasicMaterial||gt.isMeshStandardMaterial||gt.isShaderMaterial)&&Ge.setValue(H,"isOrthographic",O.isOrthographicCamera===!0),S!==O&&(S=O,Fs=!0,No=!0)}if(mt.isSkinnedMesh){Ge.setOptional(H,mt,"bindMatrix"),Ge.setOptional(H,mt,"bindMatrixInverse");const fn=mt.skeleton;fn&&(it.floatVertexTextures?(fn.boneTexture===null&&fn.computeBoneTexture(),Ge.setValue(H,"boneTexture",fn.boneTexture,y)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}mt.isBatchedMesh&&(Ge.setOptional(H,mt,"batchingTexture"),Ge.setValue(H,"batchingTexture",mt._matricesTexture,y));const ko=pt.morphAttributes;if((ko.position!==void 0||ko.normal!==void 0||ko.color!==void 0&&it.isWebGL2===!0)&&Ut.update(mt,pt,vi),(Fs||Zt.receiveShadow!==mt.receiveShadow)&&(Zt.receiveShadow=mt.receiveShadow,Ge.setValue(H,"receiveShadow",mt.receiveShadow)),gt.isMeshGouraudMaterial&&gt.envMap!==null&&(xi.envMap.value=Vt,xi.flipEnvMap.value=Vt.isCubeTexture&&Vt.isRenderTargetTexture===!1?-1:1),Fs&&(Ge.setValue(H,"toneMappingExposure",v.toneMappingExposure),Zt.needsLights&&hn(xi,No),Ft&&gt.fog===!0&&bt.refreshFogUniforms(xi,Ft),bt.refreshMaterialUniforms(xi,gt,z,D,K),Qr.upload(H,ks(Zt),xi,y)),gt.isShaderMaterial&&gt.uniformsNeedUpdate===!0&&(Qr.upload(H,ks(Zt),xi,y),gt.uniformsNeedUpdate=!1),gt.isSpriteMaterial&&Ge.setValue(H,"center",mt.center),Ge.setValue(H,"modelViewMatrix",mt.modelViewMatrix),Ge.setValue(H,"normalMatrix",mt.normalMatrix),Ge.setValue(H,"modelMatrix",mt.matrixWorld),gt.isShaderMaterial||gt.isRawShaderMaterial){const fn=gt.uniformsGroups;for(let Fo=0,Qf=fn.length;Fo<Qf;Fo++)if(it.isWebGL2){const Gc=fn[Fo];Tt.update(Gc,vi),Tt.bind(Gc,vi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return vi}function hn(O,lt){O.ambientLightColor.needsUpdate=lt,O.lightProbe.needsUpdate=lt,O.directionalLights.needsUpdate=lt,O.directionalLightShadows.needsUpdate=lt,O.pointLights.needsUpdate=lt,O.pointLightShadows.needsUpdate=lt,O.spotLights.needsUpdate=lt,O.spotLightShadows.needsUpdate=lt,O.rectAreaLights.needsUpdate=lt,O.hemisphereLights.needsUpdate=lt}function un(O){return O.isMeshLambertMaterial||O.isMeshToonMaterial||O.isMeshPhongMaterial||O.isMeshStandardMaterial||O.isShadowMaterial||O.isShaderMaterial&&O.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(O,lt,pt){ut.get(O.texture).__webglTexture=lt,ut.get(O.depthTexture).__webglTexture=pt;const gt=ut.get(O);gt.__hasExternalTextures=!0,gt.__hasExternalTextures&&(gt.__autoAllocateDepthBuffer=pt===void 0,gt.__autoAllocateDepthBuffer||j.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),gt.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(O,lt){const pt=ut.get(O);pt.__webglFramebuffer=lt,pt.__useDefaultFramebuffer=lt===void 0},this.setRenderTarget=function(O,lt=0,pt=0){b=O,E=lt,w=pt;let gt=!0,mt=null,Ft=!1,zt=!1;if(O){const Vt=ut.get(O);Vt.__useDefaultFramebuffer!==void 0?(st.bindFramebuffer(H.FRAMEBUFFER,null),gt=!1):Vt.__webglFramebuffer===void 0?y.setupRenderTarget(O):Vt.__hasExternalTextures&&y.rebindTextures(O,ut.get(O.texture).__webglTexture,ut.get(O.depthTexture).__webglTexture);const Kt=O.texture;(Kt.isData3DTexture||Kt.isDataArrayTexture||Kt.isCompressedArrayTexture)&&(zt=!0);const qt=ut.get(O).__webglFramebuffer;O.isWebGLCubeRenderTarget?(Array.isArray(qt[lt])?mt=qt[lt][pt]:mt=qt[lt],Ft=!0):it.isWebGL2&&O.samples>0&&y.useMultisampledRTT(O)===!1?mt=ut.get(O).__webglMultisampledFramebuffer:Array.isArray(qt)?mt=qt[pt]:mt=qt,T.copy(O.viewport),L.copy(O.scissor),P=O.scissorTest}else T.copy(X).multiplyScalar(z).floor(),L.copy(tt).multiplyScalar(z).floor(),P=J;if(st.bindFramebuffer(H.FRAMEBUFFER,mt)&&it.drawBuffers&&gt&&st.drawBuffers(O,mt),st.viewport(T),st.scissor(L),st.setScissorTest(P),Ft){const Vt=ut.get(O.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Vt.__webglTexture,pt)}else if(zt){const Vt=ut.get(O.texture),Kt=lt||0;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,Vt.__webglTexture,pt||0,Kt)}C=-1},this.readRenderTargetPixels=function(O,lt,pt,gt,mt,Ft,zt){if(!(O&&O.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ht=ut.get(O).__webglFramebuffer;if(O.isWebGLCubeRenderTarget&&zt!==void 0&&(Ht=Ht[zt]),Ht){st.bindFramebuffer(H.FRAMEBUFFER,Ht);try{const Vt=O.texture,Kt=Vt.format,qt=Vt.type;if(Kt!==mn&&Rt.convert(Kt)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const jt=qt===nr&&(j.has("EXT_color_buffer_half_float")||it.isWebGL2&&j.has("EXT_color_buffer_float"));if(qt!==Yn&&Rt.convert(qt)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_TYPE)&&!(qt===hi&&(it.isWebGL2||j.has("OES_texture_float")||j.has("WEBGL_color_buffer_float")))&&!jt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}lt>=0&&lt<=O.width-gt&&pt>=0&&pt<=O.height-mt&&H.readPixels(lt,pt,gt,mt,Rt.convert(Kt),Rt.convert(qt),Ft)}finally{const Vt=b!==null?ut.get(b).__webglFramebuffer:null;st.bindFramebuffer(H.FRAMEBUFFER,Vt)}}},this.copyFramebufferToTexture=function(O,lt,pt=0){const gt=Math.pow(2,-pt),mt=Math.floor(lt.image.width*gt),Ft=Math.floor(lt.image.height*gt);y.setTexture2D(lt,0),H.copyTexSubImage2D(H.TEXTURE_2D,pt,0,0,O.x,O.y,mt,Ft),st.unbindTexture()},this.copyTextureToTexture=function(O,lt,pt,gt=0){const mt=lt.image.width,Ft=lt.image.height,zt=Rt.convert(pt.format),Ht=Rt.convert(pt.type);y.setTexture2D(pt,0),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,pt.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,pt.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,pt.unpackAlignment),lt.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,gt,O.x,O.y,mt,Ft,zt,Ht,lt.image.data):lt.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,gt,O.x,O.y,lt.mipmaps[0].width,lt.mipmaps[0].height,zt,lt.mipmaps[0].data):H.texSubImage2D(H.TEXTURE_2D,gt,O.x,O.y,zt,Ht,lt.image),gt===0&&pt.generateMipmaps&&H.generateMipmap(H.TEXTURE_2D),st.unbindTexture()},this.copyTextureToTexture3D=function(O,lt,pt,gt,mt=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ft=O.max.x-O.min.x+1,zt=O.max.y-O.min.y+1,Ht=O.max.z-O.min.z+1,Vt=Rt.convert(gt.format),Kt=Rt.convert(gt.type);let qt;if(gt.isData3DTexture)y.setTexture3D(gt,0),qt=H.TEXTURE_3D;else if(gt.isDataArrayTexture||gt.isCompressedArrayTexture)y.setTexture2DArray(gt,0),qt=H.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,gt.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,gt.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,gt.unpackAlignment);const jt=H.getParameter(H.UNPACK_ROW_LENGTH),ye=H.getParameter(H.UNPACK_IMAGE_HEIGHT),tn=H.getParameter(H.UNPACK_SKIP_PIXELS),Ce=H.getParameter(H.UNPACK_SKIP_ROWS),On=H.getParameter(H.UNPACK_SKIP_IMAGES),de=pt.isCompressedTexture?pt.mipmaps[mt]:pt.image;H.pixelStorei(H.UNPACK_ROW_LENGTH,de.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,de.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,O.min.x),H.pixelStorei(H.UNPACK_SKIP_ROWS,O.min.y),H.pixelStorei(H.UNPACK_SKIP_IMAGES,O.min.z),pt.isDataTexture||pt.isData3DTexture?H.texSubImage3D(qt,mt,lt.x,lt.y,lt.z,Ft,zt,Ht,Vt,Kt,de.data):pt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),H.compressedTexSubImage3D(qt,mt,lt.x,lt.y,lt.z,Ft,zt,Ht,Vt,de.data)):H.texSubImage3D(qt,mt,lt.x,lt.y,lt.z,Ft,zt,Ht,Vt,Kt,de),H.pixelStorei(H.UNPACK_ROW_LENGTH,jt),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,ye),H.pixelStorei(H.UNPACK_SKIP_PIXELS,tn),H.pixelStorei(H.UNPACK_SKIP_ROWS,Ce),H.pixelStorei(H.UNPACK_SKIP_IMAGES,On),mt===0&&gt.generateMipmaps&&H.generateMipmap(qt),st.unbindTexture()},this.initTexture=function(O){O.isCubeTexture?y.setTextureCube(O,0):O.isData3DTexture?y.setTexture3D(O,0):O.isDataArrayTexture||O.isCompressedArrayTexture?y.setTexture2DArray(O,0):y.setTexture2D(O,0),st.unbindTexture()},this.resetState=function(){E=0,w=0,b=null,st.reset(),k.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===_c?"display-p3":"srgb",e.unpackColorSpace=ie.workingColorSpace===Eo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Te?Ui:mu}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Ui?Te:Kn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class f_ extends ku{}f_.prototype.isWebGL1Renderer=!0;class yc{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new Xt(t),this.near=e,this.far=i}clone(){return new yc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class hh extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class d_ extends Ye{constructor(t=null,e=1,i=1,s,r,a,o,c,l=Oe,h=Oe,u,f){super(null,a,o,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class p_ extends Ye{constructor(t,e,i,s,r,a,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Nn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=i[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);const h=i[s],f=i[s+1]-h,d=(a-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new Lt:new q);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new q,s=[],r=[],a=[],o=new q,c=new ae;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new q)}r[0]=new q,a[0]=new q;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),f<=l&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ze(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(o,g))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(ze(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class bc extends Nn{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e){const i=e||new Lt,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class m_ extends bc{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Sc(){let n=0,t=0,e=0,i=0;function s(r,a,o,c){n=r,t=o,e=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let f=(a-r)/l-(o-r)/(l+h)+(o-a)/h,d=(o-a)/h-(c-a)/(h+u)+(c-o)/u;f*=h,d*=h,s(a,o,f,d)},calc:function(r){const a=r*r,o=a*r;return n+t*r+e*a+i*o}}}const Or=new q,pa=new Sc,ma=new Sc,ga=new Sc;class g_ extends Nn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new q){const i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(Or.subVectors(s[0],s[1]).add(s[0]),l=Or);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Or.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Or),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(f),d),p=Math.pow(f.distanceToSquared(h),d);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),pa.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,g,_,p),ma.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,g,_,p),ga.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,g,_,p)}else this.curveType==="catmullrom"&&(pa.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),ma.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),ga.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return i.set(pa.calc(c),ma.calc(c),ga.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new q().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function uh(n,t,e,i,s){const r=(i-t)*.5,a=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+r+a)*c+(-3*e+3*i-2*r-a)*o+r*n+e}function __(n,t){const e=1-n;return e*e*t}function v_(n,t){return 2*(1-n)*n*t}function x_(n,t){return n*n*t}function Qs(n,t,e,i){return __(n,t)+v_(n,e)+x_(n,i)}function M_(n,t){const e=1-n;return e*e*e*t}function y_(n,t){const e=1-n;return 3*e*e*n*t}function b_(n,t){return 3*(1-n)*n*n*t}function S_(n,t){return n*n*n*t}function tr(n,t,e,i,s){return M_(n,t)+y_(n,e)+b_(n,i)+S_(n,s)}class Fu extends Nn{constructor(t=new Lt,e=new Lt,i=new Lt,s=new Lt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Lt){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(tr(t,s.x,r.x,a.x,o.x),tr(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class w_ extends Nn{constructor(t=new q,e=new q,i=new q,s=new q){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new q){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(tr(t,s.x,r.x,a.x,o.x),tr(t,s.y,r.y,a.y,o.y),tr(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ou extends Nn{constructor(t=new Lt,e=new Lt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Lt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Lt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class E_ extends Nn{constructor(t=new q,e=new q){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new q){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new q){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zu extends Nn{constructor(t=new Lt,e=new Lt,i=new Lt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Lt){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(Qs(t,s.x,r.x,a.x),Qs(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class T_ extends Nn{constructor(t=new q,e=new q,i=new q){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new q){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(Qs(t,s.x,r.x,a.x),Qs(t,s.y,r.y,a.y),Qs(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bu extends Nn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Lt){const i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(uh(o,c.x,l.x,h.x,u.x),uh(o,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Lt().fromArray(s))}return this}}var Ya=Object.freeze({__proto__:null,ArcCurve:m_,CatmullRomCurve3:g_,CubicBezierCurve:Fu,CubicBezierCurve3:w_,EllipseCurve:bc,LineCurve:Ou,LineCurve3:E_,QuadraticBezierCurve:zu,QuadraticBezierCurve3:T_,SplineCurve:Bu});class A_ extends Nn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ya[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new Ya[s.type]().fromJSON(s))}return this}}class fh extends A_{constructor(t){super(),this.type="Path",this.currentPoint=new Lt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Ou(this.currentPoint.clone(),new Lt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const r=new zu(this.currentPoint.clone(),new Lt(t,e),new Lt(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,a){const o=new Fu(this.currentPoint.clone(),new Lt(t,e),new Lt(i,s),new Lt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Bu(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,i,s,r,a),this}absarc(t,e,i,s,r,a){return this.absellipse(t,e,i,i,s,r,a),this}ellipse(t,e,i,s,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,r,a,o,c),this}absellipse(t,e,i,s,r,a,o,c){const l=new bc(t,e,i,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Gu extends fh{constructor(t){super(t),this.uuid=Cs(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new fh().fromJSON(s))}return this}}const R_={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let r=Hu(n,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l,h,u,f,d;if(i&&(r=I_(n,t,r,e)),n.length>80*e){o=l=n[0],c=h=n[1];for(let g=e;g<s;g+=e)u=n[g],f=n[g+1],u<o&&(o=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-o,h-c),d=d!==0?32767/d:0}return ir(r,a,e,o,c,d,0),a}};function Hu(n,t,e,i,s){let r,a;if(s===W_(n,t,e,i)>0)for(r=t;r<e;r+=i)a=dh(r,n[r],n[r+1],a);else for(r=e-i;r>=t;r-=i)a=dh(r,n[r],n[r+1],a);return a&&Lo(a,a.next)&&(rr(a),a=a.next),a}function zi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Lo(e,e.next)||pe(e.prev,e,e.next)===0)){if(rr(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ir(n,t,e,i,s,r,a){if(!n)return;!a&&r&&O_(n,i,s,r);let o=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,r?L_(n,i,s,r):P_(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),rr(n),n=l.next,o=l.next;continue}if(n=l,n===o){a?a===1?(n=C_(zi(n),t,e),ir(n,t,e,i,s,r,2)):a===2&&D_(n,t,e,i,s,r):ir(zi(n),t,e,i,s,r,1);break}}}function P_(n){const t=n.prev,e=n,i=n.next;if(pe(t,e,i)>=0)return!1;const s=t.x,r=e.x,a=i.x,o=t.y,c=e.y,l=i.y,h=s<r?s<a?s:a:r<a?r:a,u=o<c?o<l?o:l:c<l?c:l,f=s>r?s>a?s:a:r>a?r:a,d=o>c?o>l?o:l:c>l?c:l;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&fs(s,o,r,c,a,l,g.x,g.y)&&pe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function L_(n,t,e,i){const s=n.prev,r=n,a=n.next;if(pe(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,f=a.y,d=o<c?o<l?o:l:c<l?c:l,g=h<u?h<f?h:f:u<f?u:f,_=o>c?o>l?o:l:c>l?c:l,p=h>u?h>f?h:f:u>f?u:f,m=$a(d,g,t,e,i),x=$a(_,p,t,e,i);let v=n.prevZ,M=n.nextZ;for(;v&&v.z>=m&&M&&M.z<=x;){if(v.x>=d&&v.x<=_&&v.y>=g&&v.y<=p&&v!==s&&v!==a&&fs(o,h,c,u,l,f,v.x,v.y)&&pe(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=d&&M.x<=_&&M.y>=g&&M.y<=p&&M!==s&&M!==a&&fs(o,h,c,u,l,f,M.x,M.y)&&pe(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=m;){if(v.x>=d&&v.x<=_&&v.y>=g&&v.y<=p&&v!==s&&v!==a&&fs(o,h,c,u,l,f,v.x,v.y)&&pe(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=x;){if(M.x>=d&&M.x<=_&&M.y>=g&&M.y<=p&&M!==s&&M!==a&&fs(o,h,c,u,l,f,M.x,M.y)&&pe(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function C_(n,t,e){let i=n;do{const s=i.prev,r=i.next.next;!Lo(s,r)&&Vu(s,i,i.next,r)&&sr(s,r)&&sr(r,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(r.i/e|0),rr(i),rr(i.next),i=n=r),i=i.next}while(i!==n);return zi(i)}function D_(n,t,e,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&G_(a,o)){let c=Wu(a,o);a=zi(a,a.next),c=zi(c,c.next),ir(a,t,e,i,s,r,0),ir(c,t,e,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function I_(n,t,e,i){const s=[];let r,a,o,c,l;for(r=0,a=t.length;r<a;r++)o=t[r]*i,c=r<a-1?t[r+1]*i:n.length,l=Hu(n,o,c,i,!1),l===l.next&&(l.steiner=!0),s.push(B_(l));for(s.sort(U_),r=0;r<s.length;r++)e=N_(s[r],e);return e}function U_(n,t){return n.x-t.x}function N_(n,t){const e=k_(n,t);if(!e)return t;const i=Wu(e,n);return zi(i,i.next),zi(e,e.next)}function k_(n,t){let e=t,i=-1/0,s;const r=n.x,a=n.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const f=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=r&&f>i&&(i=f,s=e.x<e.next.x?e:e.next,f===r))return s}e=e.next}while(e!==t);if(!s)return null;const o=s,c=s.x,l=s.y;let h=1/0,u;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&fs(a<l?r:i,a,c,l,a<l?i:r,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(r-e.x),sr(e,n)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&F_(s,e)))&&(s=e,h=u)),e=e.next;while(e!==o);return s}function F_(n,t){return pe(n.prev,n,t.prev)<0&&pe(t.next,n,n.next)<0}function O_(n,t,e,i){let s=n;do s.z===0&&(s.z=$a(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,z_(s)}function z_(n){let t,e,i,s,r,a,o,c,l=1;do{for(e=n,n=null,r=null,a=0;e;){for(a++,i=e,o=0,t=0;t<l&&(o++,i=i.nextZ,!!i);t++);for(c=l;o>0||c>0&&i;)o!==0&&(c===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,o--):(s=i,i=i.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;e=i}r.nextZ=null,l*=2}while(a>1);return n}function $a(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function B_(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function fs(n,t,e,i,s,r,a,o){return(s-a)*(t-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(i-o)}function G_(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!H_(n,t)&&(sr(n,t)&&sr(t,n)&&V_(n,t)&&(pe(n.prev,n,t.prev)||pe(n,t.prev,t))||Lo(n,t)&&pe(n.prev,n,n.next)>0&&pe(t.prev,t,t.next)>0)}function pe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Lo(n,t){return n.x===t.x&&n.y===t.y}function Vu(n,t,e,i){const s=Br(pe(n,t,e)),r=Br(pe(n,t,i)),a=Br(pe(e,i,n)),o=Br(pe(e,i,t));return!!(s!==r&&a!==o||s===0&&zr(n,e,t)||r===0&&zr(n,i,t)||a===0&&zr(e,n,i)||o===0&&zr(e,t,i))}function zr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Br(n){return n>0?1:n<0?-1:0}function H_(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Vu(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function sr(n,t){return pe(n.prev,n,n.next)<0?pe(n,t,n.next)>=0&&pe(n,n.prev,t)>=0:pe(n,t,n.prev)<0||pe(n,n.next,t)<0}function V_(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Wu(n,t){const e=new Ka(n.i,n.x,n.y),i=new Ka(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function dh(n,t,e,i){const s=new Ka(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function rr(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ka(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function W_(n,t,e,i){let s=0;for(let r=t,a=e-i;r<e;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class _s{static area(t){const e=t.length;let i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return _s.area(t)<0}static triangulateShape(t,e){const i=[],s=[],r=[];ph(t),mh(i,t);let a=t.length;e.forEach(ph);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,mh(i,e[c]);const o=R_.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function ph(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function mh(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class wc extends Ke{constructor(t=new Gu([new Lt(.5,.5),new Lt(-.5,.5),new Lt(-.5,-.5),new Lt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],r=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new Me(s,3)),this.setAttribute("uv",new Me(r,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:q_;let v,M=!1,E,w,b,C;m&&(v=m.getSpacedPoints(h),M=!0,f=!1,E=m.computeFrenetFrames(h,!1),w=new q,b=new q,C=new q),f||(p=0,d=0,g=0,_=0);const S=o.extractPoints(l);let T=S.shape;const L=S.holes;if(!_s.isClockWise(T)){T=T.reverse();for(let H=0,V=L.length;H<V;H++){const j=L[H];_s.isClockWise(j)&&(L[H]=j.reverse())}}const W=_s.triangulateShape(T,L),R=T;for(let H=0,V=L.length;H<V;H++){const j=L[H];T=T.concat(j)}function I(H,V,j){return V||console.error("THREE.ExtrudeGeometry: vec does not exist"),H.clone().addScaledVector(V,j)}const D=T.length,z=W.length;function B(H,V,j){let it,st,St;const ut=H.x-V.x,y=H.y-V.y,A=j.x-H.x,$=j.y-H.y,ft=ut*ut+y*y,ot=ut*$-y*A;if(Math.abs(ot)>Number.EPSILON){const dt=Math.sqrt(ft),vt=Math.sqrt(A*A+$*$),bt=V.x-y/dt,Mt=V.y+ut/dt,yt=j.x-$/vt,wt=j.y+A/vt,ht=((yt-bt)*$-(wt-Mt)*A)/(ut*$-y*A);it=bt+ut*ht-H.x,st=Mt+y*ht-H.y;const At=it*it+st*st;if(At<=2)return new Lt(it,st);St=Math.sqrt(At/2)}else{let dt=!1;ut>Number.EPSILON?A>Number.EPSILON&&(dt=!0):ut<-Number.EPSILON?A<-Number.EPSILON&&(dt=!0):Math.sign(y)===Math.sign($)&&(dt=!0),dt?(it=-y,st=ut,St=Math.sqrt(ft)):(it=ut,st=y,St=Math.sqrt(ft/2))}return new Lt(it/St,st/St)}const F=[];for(let H=0,V=R.length,j=V-1,it=H+1;H<V;H++,j++,it++)j===V&&(j=0),it===V&&(it=0),F[H]=B(R[H],R[j],R[it]);const X=[];let tt,J=F.concat();for(let H=0,V=L.length;H<V;H++){const j=L[H];tt=[];for(let it=0,st=j.length,St=st-1,ut=it+1;it<st;it++,St++,ut++)St===st&&(St=0),ut===st&&(ut=0),tt[it]=B(j[it],j[St],j[ut]);X.push(tt),J=J.concat(tt)}for(let H=0;H<p;H++){const V=H/p,j=d*Math.cos(V*Math.PI/2),it=g*Math.sin(V*Math.PI/2)+_;for(let st=0,St=R.length;st<St;st++){const ut=I(R[st],F[st],it);Q(ut.x,ut.y,-j)}for(let st=0,St=L.length;st<St;st++){const ut=L[st];tt=X[st];for(let y=0,A=ut.length;y<A;y++){const $=I(ut[y],tt[y],it);Q($.x,$.y,-j)}}}const U=g+_;for(let H=0;H<D;H++){const V=f?I(T[H],J[H],U):T[H];M?(b.copy(E.normals[0]).multiplyScalar(V.x),w.copy(E.binormals[0]).multiplyScalar(V.y),C.copy(v[0]).add(b).add(w),Q(C.x,C.y,C.z)):Q(V.x,V.y,0)}for(let H=1;H<=h;H++)for(let V=0;V<D;V++){const j=f?I(T[V],J[V],U):T[V];M?(b.copy(E.normals[H]).multiplyScalar(j.x),w.copy(E.binormals[H]).multiplyScalar(j.y),C.copy(v[H]).add(b).add(w),Q(C.x,C.y,C.z)):Q(j.x,j.y,u/h*H)}for(let H=p-1;H>=0;H--){const V=H/p,j=d*Math.cos(V*Math.PI/2),it=g*Math.sin(V*Math.PI/2)+_;for(let st=0,St=R.length;st<St;st++){const ut=I(R[st],F[st],it);Q(ut.x,ut.y,u+j)}for(let st=0,St=L.length;st<St;st++){const ut=L[st];tt=X[st];for(let y=0,A=ut.length;y<A;y++){const $=I(ut[y],tt[y],it);M?Q($.x,$.y+v[h-1].y,v[h-1].x+j):Q($.x,$.y,u+j)}}}Y(),G();function Y(){const H=s.length/3;if(f){let V=0,j=D*V;for(let it=0;it<z;it++){const st=W[it];nt(st[2]+j,st[1]+j,st[0]+j)}V=h+p*2,j=D*V;for(let it=0;it<z;it++){const st=W[it];nt(st[0]+j,st[1]+j,st[2]+j)}}else{for(let V=0;V<z;V++){const j=W[V];nt(j[2],j[1],j[0])}for(let V=0;V<z;V++){const j=W[V];nt(j[0]+D*h,j[1]+D*h,j[2]+D*h)}}i.addGroup(H,s.length/3-H,0)}function G(){const H=s.length/3;let V=0;K(R,V),V+=R.length;for(let j=0,it=L.length;j<it;j++){const st=L[j];K(st,V),V+=st.length}i.addGroup(H,s.length/3-H,1)}function K(H,V){let j=H.length;for(;--j>=0;){const it=j;let st=j-1;st<0&&(st=H.length-1);for(let St=0,ut=h+p*2;St<ut;St++){const y=D*St,A=D*(St+1),$=V+it+y,ft=V+st+y,ot=V+st+A,dt=V+it+A;rt($,ft,ot,dt)}}}function Q(H,V,j){c.push(H),c.push(V),c.push(j)}function nt(H,V,j){ct(H),ct(V),ct(j);const it=s.length/3,st=x.generateTopUV(i,s,it-3,it-2,it-1);_t(st[0]),_t(st[1]),_t(st[2])}function rt(H,V,j,it){ct(H),ct(V),ct(it),ct(V),ct(j),ct(it);const st=s.length/3,St=x.generateSideWallUV(i,s,st-6,st-3,st-2,st-1);_t(St[0]),_t(St[1]),_t(St[3]),_t(St[1]),_t(St[2]),_t(St[3])}function ct(H){s.push(c[H*3+0]),s.push(c[H*3+1]),s.push(c[H*3+2])}function _t(H){r.push(H.x),r.push(H.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return X_(e,i,t)}static fromJSON(t,e){const i=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];i.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ya[s.type]().fromJSON(s)),new wc(i,t.options)}}const q_={generateTopUV:function(n,t,e,i,s){const r=t[e*3],a=t[e*3+1],o=t[i*3],c=t[i*3+1],l=t[s*3],h=t[s*3+1];return[new Lt(r,a),new Lt(o,c),new Lt(l,h)]},generateSideWallUV:function(n,t,e,i,s,r){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],u=t[i*3+2],f=t[s*3],d=t[s*3+1],g=t[s*3+2],_=t[r*3],p=t[r*3+1],m=t[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new Lt(a,1-c),new Lt(l,1-u),new Lt(f,1-g),new Lt(_,1-m)]:[new Lt(o,1-c),new Lt(h,1-u),new Lt(d,1-g),new Lt(p,1-m)]}};function X_(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class uo extends Ke{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new q,f=new q,d=[],g=[],_=[],p=[];for(let m=0;m<=i;m++){const x=[],v=m/i;let M=0;m===0&&a===0?M=.5/e:m===i&&c===Math.PI&&(M=-.5/e);for(let E=0;E<=e;E++){const w=E/e;u.x=-t*Math.cos(s+w*r)*Math.sin(a+v*o),u.y=t*Math.cos(a+v*o),u.z=t*Math.sin(s+w*r)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),p.push(w+M,1-v),x.push(l++)}h.push(x)}for(let m=0;m<i;m++)for(let x=0;x<e;x++){const v=h[m][x+1],M=h[m][x],E=h[m+1][x],w=h[m+1][x+1];(m!==0||a>0)&&d.push(v,M,w),(m!==i-1||c<Math.PI)&&d.push(M,E,w)}this.setIndex(d),this.setAttribute("position",new Me(g,3)),this.setAttribute("normal",new Me(_,3)),this.setAttribute("uv",new Me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uo(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class to extends dr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=gu,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ec extends Re{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Xt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class j_ extends Ec{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const _a=new ae,gh=new q,_h=new q;class qu{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Lt(512,512),this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xc,this._frameExtents=new Lt(1,1),this._viewportCount=1,this._viewports=[new Ie(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;gh.setFromMatrixPosition(t.matrixWorld),e.position.copy(gh),_h.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(_h),e.updateMatrixWorld(),_a.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_a),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(_a)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Y_ extends qu{constructor(){super(new rn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,i=lo*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(i!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=i,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class vh extends Ec{constructor(t,e,i=0,s=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Y_}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class $_ extends qu{constructor(){super(new Pu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class K_ extends Ec{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new $_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class xh{constructor(t=1,e=0,i=0){return this.radius=t,this.phi=e,this.theta=i,this}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(ze(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:mc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=mc);const So=class So{constructor({cols:t,rows:e,widthMM:i,heightMM:s,ppmm:r,data:a,groove:o,cavity:c}){this.width=t,this.height=e,this.widthMM=i,this.heightMM=s,this.ppmm=r,this.data=a,this.groove=o||null,this.cavityOpts={small:.8,large:4,kSmall:.3,kLarge:.9,kEdge:.12,...c};let l=1/0,h=-1/0;for(let u=0;u<a.length;u++){const f=a[u];f<l&&(l=f),f>h&&(h=f)}h-l<1e-6&&(h=l+1e-6),this.min=l,this.max=h,this._tex={},this._macro=new Map,this._channels=null}sample(t,e){return yh(this.data,this.width,this.height,t,e)}get heightTexture(){if(!this._tex.height){const{data:t,min:e,max:i}=this,s=t.length,r=new Uint8Array(s*4),a=255/(i-e);for(let o=0;o<s;o++){const c=(t[o]-e)*a;r[o*4]=r[o*4+1]=r[o*4+2]=c,r[o*4+3]=255}this._tex.height=this._texture(r)}return this._tex.height}get normalTexture(){if(!this._tex.normal){const{data:t,width:e,height:i,ppmm:s}=this,r=new Uint8Array(e*i*4),a=s/8;for(let o=0;o<i;o++){const c=o>0?o-1:0,l=o<i-1?o+1:i-1;for(let h=0;h<e;h++){const u=h>0?h-1:0,f=h<e-1?h+1:e-1,d=t[c*e+u],g=t[c*e+h],_=t[c*e+f],p=t[o*e+u],m=t[o*e+f],x=t[l*e+u],v=t[l*e+h],M=t[l*e+f],E=(_+2*m+M-d-2*p-x)*a,w=(x+2*v+M-d-2*g-_)*a,b=1/Math.sqrt(E*E+w*w+1),C=(o*e+h)*4;r[C]=(.5-.5*E*b)*255+.5,r[C+1]=(.5-.5*w*b)*255+.5,r[C+2]=(.5+.5*b)*255+.5,r[C+3]=255}}this._tex.normal=this._texture(r)}return this._tex.normal}get dataTexture(){if(!this._tex.data){const{height01:t,cavity:e,edge:i,groove:s}=this.channels(),r=t.length,a=new Uint8Array(r*4);for(let o=0;o<r;o++)a[o*4]=t[o]*255+.5,a[o*4+1]=e[o]*255+.5,a[o*4+2]=i[o]*255+.5,a[o*4+3]=s[o]*255+.5;this._tex.data=this._texture(a)}return this._tex.data}channels(){if(this._channels)return this._channels;const{data:t,width:e,height:i,ppmm:s,min:r,max:a}=this,o=this.cavityOpts,c=e*i,l=eo(t,e,i,Math.max(1,Math.round(o.small*s))),h=eo(t,e,i,Math.max(1,Math.round(o.large*s))),u=new Float32Array(c),f=new Float32Array(c),d=new Float32Array(c),g=new Float32Array(c),_=1/(a-r);for(let p=0;p<c;p++){const m=t[p];u[p]=(m-r)*_;const x=m-l[p],v=m-h[p];f[p]=Mh(1-Math.max(0,-x)/o.kSmall-Math.max(0,-v)/o.kLarge),d[p]=Mh(x/o.kEdge),g[p]=this.groove?this.groove[p]:0}return this._channels={height01:u,cavity:f,edge:d,groove:g},this._channels}macro(t){const e=t.toFixed(3);let i=this._macro.get(e);if(i)return i;const{data:s,width:r,height:a,ppmm:o}=this,c=Math.max(1,Math.round(t*o)),l=Math.max(2,Math.ceil(r/c)),h=Math.max(2,Math.ceil(a/c));let u=new Float32Array(l*h);for(let f=0;f<h;f++)for(let d=0;d<l;d++){let g=0,_=0;const p=Math.min(a,(f+1)*c),m=Math.min(r,(d+1)*c);for(let x=f*c;x<p;x++)for(let v=d*c;v<m;v++)g+=s[x*r+v],_++;u[f*l+d]=g/_}return c>1&&(u=eo(u,l,h,1,1)),i={cols:l,rows:h,sizeMM:t,data:u,sample:(f,d)=>yh(u,l,h,f,d)},this._macro.set(e,i),i}setAnisotropy(t){for(const e of Object.values(this._tex))e.anisotropy=t,e.needsUpdate=!0}dispose(){for(const t of Object.values(this._tex))t.dispose();this._tex={}}_texture(t){const e=new d_(t,this.width,this.height,mn,Yn);return e.colorSpace=on,e.wrapS=e.wrapT=pn,e.magFilter=sn,e.minFilter=Ss,e.generateMipmaps=!0,e.anisotropy=So.anisotropy,e.needsUpdate=!0,e}};mr(So,"anisotropy",4);let or=So;function Xu(n,t={}){return new or({cols:n.cols,rows:n.rows,widthMM:n.width,heightMM:n.height,ppmm:n.ppmm,data:Float32Array.from(n.field),groove:Float32Array.from(n.groove),cavity:t.cavity})}function Mh(n){return n<0?0:n>1?1:n}function yh(n,t,e,i,s){const r=Math.min(Math.max(i*t-.5,0),t-1),a=Math.min(Math.max(s*e-.5,0),e-1),o=Math.floor(r),c=Math.floor(a),l=Math.min(o+1,t-1),h=Math.min(c+1,e-1),u=r-o,f=a-c,d=n[c*t+o]+(n[c*t+l]-n[c*t+o])*u,g=n[h*t+o]+(n[h*t+l]-n[h*t+o])*u;return d+(g-d)*f}function eo(n,t,e,i,s=3){let r=Float32Array.from(n),a=new Float32Array(n.length);const o=new Float32Array(Math.max(t,e));for(let c=0;c<s;c++)Z_(r,a,t,e,i,o),J_(a,r,t,e,i,o);return r}function Z_(n,t,e,i,s,r){const a=1/(2*s+1);for(let o=0;o<i;o++){const c=o*e;let l=n[c]*(s+1);for(let h=1;h<=s;h++)l+=n[c+Math.min(h,e-1)];for(let h=0;h<e;h++)r[h]=l*a,l+=n[c+Math.min(h+s+1,e-1)]-n[c+Math.max(h-s,0)];t.set(r.subarray(0,e),c)}}function J_(n,t,e,i,s,r){const a=1/(2*s+1);for(let o=0;o<e;o++){let c=n[o]*(s+1);for(let l=1;l<=s;l++)c+=n[Math.min(l,i-1)*e+o];for(let l=0;l<i;l++)r[l]=c*a,c+=n[Math.min(l+s+1,i-1)*e+o]-n[Math.max(l-s,0)*e+o];for(let l=0;l<i;l++)t[l*e+o]=r[l]}}const Tc={pitch:1.3,line:.5,cell:"auto",turns:"auto",roundness:.15,jitter:.08,mode:"sunk",depth:.4,fillers:!0,pairs:.75,hand:"alternate",eyes:0,echo:0,follow:1,seed:0};function ju(n={}){const t={...Tc,...n},e=t.pitch;let[i,s]=t.cell==="auto"||!t.cell?[4.2*e,7.8*e]:t.cell;return typeof t.turns=="number"&&(s=Math.min(s,(2*t.turns+1.2)*e)),i=Math.max(i,3*e),s=Math.max(s,i),t.cell=[i,s],t}function Co(n,t={},e={}){const i=Hr(),s=ju(e),r=t.rect??{x:0,y:0,w:n.width,h:n.height},a=n.rng.fork(`leiwen:${s.seed}:${Gr(r.x)},${Gr(r.y)},${Gr(r.w)},${Gr(r.h)}`),o=tv(n,r,t,s);s.debugOut&&(s.debugOut.gridMs=Hr()-i);const c=[];o&&s.echo>0&&nv(o,s,c),o&&s.fillers&&iv(o,s,c);const l=o?ev(o,s,a):[];if(s.debugOut)for(const f of l)s.debugOut.push(f);const h={cells:l.length,spirals:0,pairs:0,fillers:0,ms:0,planMs:0};for(const f of l){if(s.debugCells){const d=(g,_)=>[f.ax+g*f.ux+_*f.vx,f.ay+g*f.uy+_*f.vy];c.push({pts:[d(f.u0,f.v0),d(f.u1,f.v0),d(f.u1,f.v1),d(f.u0,f.v1),d(f.u0,f.v0)],radius:0})}s.debugCells!==!0&&rv(f,s,a,c,h)}const u=Hr();return c.length&&cv(n,c,s),h.planMs=Math.round(u-i),h.ms=Math.round(Hr()-i),h}function Ac(n,t,e={},{rect:i,margin:s=.5,level:r,avoid:a=null}={}){const o=typeof t=="function"?n.mask(t):t;let c=r;c===void 0&&(o!=null&&o.data)&&(c=lv(n,o.data));const l=e.pitch??Tc.pitch,h=i??(o!=null&&o.data?Q_(n,o.data,s+2*l):void 0);return h===null?{cells:0,spirals:0,pairs:0,fillers:0,ms:0,planMs:0}:Co(n,{rect:h,include:o,level:c,avoid:a,margin:s},e)}function Q_(n,t,e){const{cols:i,rows:s,ppmm:r}=n;let a=i,o=-1,c=s,l=-1;for(let g=0;g<s;g++){const _=g*i;for(let p=0;p<i;p++)t[_+p]<.5||(p<a&&(a=p),p>o&&(o=p),g<c&&(c=g),g>l&&(l=g))}if(o<0)return null;const h=Math.max(0,a/r-e),u=Math.max(0,c/r-e),f=Math.min(n.width,(o+1)/r+e),d=Math.min(n.height,(l+1)/r+e);return{x:h,y:u,w:f-h,h:d-u}}function tv(n,t,e,i){const s=i.pitch;let r=Math.max(s/3,1/n.ppmm);const a=32e5;t.w/r*(t.h/r)>a&&(r=Math.sqrt(t.w*t.h/a));const o=Math.ceil(t.w/r)+2,c=Math.ceil(t.h/r)+2,l=t.x-r,h=t.y-r,u=o*c,f=new Uint8Array(u);for(let F=0;F<c;F++)for(let X=0;X<o;X++)(X===0||F===0||X===o-1||F===c-1)&&(f[F*o+X]=1);const{cols:d,rows:g,ppmm:_,field:p}=n,m=F=>typeof F=="function"?n.mask(F).data:F&&F.data?F.data:null,x=e.avoid===void 0?e.level!=null?null:"raised":e.avoid,v=x==="raised"?null:m(x),M=x==="raised",E=m(e.include),w=e.level,b=w==null?0:.04+.03*Math.abs(w),C=Math.max(0,Math.floor(t.x*_)),S=Math.min(d,Math.ceil((t.x+t.w)*_)),T=Math.max(0,Math.floor(t.y*_)),L=Math.min(g,Math.ceil((t.y+t.h)*_)),P=new Int32Array(S-C);for(let F=C;F<S;F++)P[F-C]=Math.min(o-2,Math.max(1,Math.floor(((F+.5)/_-l)/r)));let W=0;for(let F=T;F<L;F++){const tt=Math.min(c-2,Math.max(1,Math.floor(((F+.5)/_-h)/r)))*o,J=F*d;for(let U=C;U<S;U++){const Y=J+U;let G=!1;M?G=p[Y]>.05:v&&(G=v[Y]>.5),!G&&E&&(G=E[Y]<.5),!G&&w!=null&&(G=Math.abs(p[Y]-w)>b),G&&(f[tt+P[U-C]]=1)}}const R=new Uint8Array(f);for(let F=0;F<c;F++)for(let X=0;X<o;X++)(X===0||F===0||X===o-1||F===c-1)&&(R[F*o+X]=0);const I=mi(f,o,c),D=s*(.5-i.line/2),z=Math.max(0,(e.margin??.6)-D)/r+.3,B=z*z;for(let F=0;F<u;F++)I.dist2[F]<=B&&(f[F]=1);for(let F=0;F<u;F++)f[F]||W++;return W<9?null:{gw:o,gh:c,h:r,ox:l,oy:h,blocked:f,hit:R,m:z,nf:I}}function ev(n,t,e){const{gw:i,gh:s,h:r,ox:a,oy:o,blocked:c}=n,l=i*s,h=t.pitch,[u,f]=t.cell;let d;if(n.dirty)d=mi(c,i,s);else{const V=new Float32Array(l);for(let j=0;j<l;j++){const it=Math.sqrt(n.nf.dist2[j])-n.m;V[j]=it>0?it*it:0}d={dist2:V,nearest:n.nf.nearest}}const g=new Float32Array(l),_=new Float32Array(l),p=new Float32Array(l),m=new Float32Array(l),x=new Float32Array(l);for(let V=0;V<l;V++)x[V]=Math.sqrt(d.dist2[V]);for(let V=0;V<l;V++){if(c[V])continue;const j=d.nearest[V];if(j<0)continue;const it=V%i,st=V/i|0;let St=it-j%i,ut=st-(j/i|0);const y=Math.hypot(St,ut)||1;if(it>1&&st>1&&it<i-2&&st<s-2){const ot=x[V+2]-x[V-2],dt=x[V+2*i]-x[V-2*i];Math.hypot(ot,dt)>1.2&&(St=ot,ut=dt)}const A=Math.hypot(St,ut)||1;p[V]=St/A,m[V]=ut/A;const $=4*Math.atan2(ut,St),ft=Math.exp(-y*r/(3*h));g[V]=Math.cos($)*ft,_[V]=Math.sin($)*ft}const v=new Float32Array(l);for(let V=0;V<l;V++)c[V]||(v[V]=Math.hypot(g[V],_[V]));const M=g,E=_,w=Math.max(2,Math.round(u*.5/r));va(M,i,s,w,c),va(E,i,s,w,c),va(v,i,s,w,c);const b=Math.max(0,Math.min(1,t.follow)),C=V=>{const j=v[V]>1e-6?Math.hypot(M[V],E[V])/v[V]:1,it=Math.max(0,Math.min(1,(j-.8)/.13));return b*it*Math.atan2(E[V],M[V])/4},S=new Uint8Array(c),T=new Int32Array(l).fill(-1),L=new Uint8Array(l),P=[],W=(V,j)=>{const it=Math.floor((V-a)/r),st=Math.floor((j-o)/r);return it<0||st<0||it>=i||st>=s?-1:st*i+it},R=(V,j)=>{const it=W(V,j);return it>=0&&S[it]===0},I=r*.7,D=(V,j,it,st)=>{const St=Math.hypot(it-V,st-j),ut=Math.max(1,Math.ceil(St/I));for(let y=0;y<=ut;y++){const A=y/ut;if(!R(V+(it-V)*A,j+(st-j)*A))return!1}return!0},z=(V,j,it,st,St,[ut,y],A,$=0)=>{let ft=Math.cos(it),ot=Math.sin(it),dt=-2,vt=[ft,ot];for(let N=0;N<4;N++){const at=-ot,xt=ft,Et=at*st+xt*St;Et>dt&&(dt=Et,vt=[ft,ot]);const Pt=ft;ft=-ot,ot=Pt}[ft,ot]=vt;const bt=-ot,Mt=ft,yt=(N,at)=>[V+N*ft+at*bt,j+N*ot+at*Mt];let wt=-r*.5,ht=r*.5,At=-r*.5,Ut=r*.5;{const N=yt(wt,At),at=yt(ht,Ut),xt=yt(wt,Ut),Et=yt(ht,At);if(!R(N[0],N[1])||!R(at[0],at[1])||!R(xt[0],xt[1])||!R(Et[0],Et[1]))return null}const Ct=r,Dt=N=>{const at=N>0?ht+Ct:wt-Ct,xt=yt(at,At),Et=yt(at,Ut);return D(xt[0],xt[1],Et[0],Et[1])?(N>0?ht=at:wt=at,!0):!1},Rt=N=>{const at=N>0?Ut+Ct:At-Ct,xt=yt(wt,at),Et=yt(ht,at);return D(xt[0],xt[1],Et[0],Et[1])?(N>0?Ut=at:At=at,!0):!1},k=[!1,!1,!1,!1];for(let N=0;N<4e3;N++){let at=!1;if(!k[0]&&Ut-At<y&&(Rt(1)?at=!0:k[0]=!0),!k[1]&&ht-wt<ut&&(Dt(1)?at=!0:k[1]=!0),!k[2]&&ht-wt<ut&&(Dt(-1)?at=!0:k[2]=!0),!k[3]&&Ut-At<y&&(Rt(-1)?at=!0:k[3]=!0),!at)break}let Tt=ht-wt,Nt=Ut-At;const Z=Math.min(ut,y);if(Math.min(Tt,Nt)<Z*.85){const N=Tt>=Nt;for(let at=0;at<4e3;at++){let xt=!1;if(N){if(ht-wt>=A)break;k[1]||(Dt(1)?xt=!0:k[1]=!0),!k[2]&&ht-wt<A&&(Dt(-1)?xt=!0:k[2]=!0)}else{if(Ut-At>=A)break;k[0]||(Rt(1)?xt=!0:k[0]=!0),!k[3]&&Ut-At<A&&(Rt(-1)?xt=!0:k[3]=!0)}if(!xt)break}Tt=ht-wt,Nt=Ut-At}const et=$;if(et>0){const N=at=>{let xt=0;for(;xt<et;){if(!(at===0?Rt(1):at===1?Dt(1):at===2?Dt(-1):Rt(-1)))return xt;xt+=Ct}return-xt};for(const at of[0,1,2,3]){const xt=[wt,ht,At,Ut];N(at)<0&&([wt,ht,At,Ut]=xt)}}return wt-=r*.5,ht+=r*.5,At-=r*.5,Ut+=r*.5,{ax:V,ay:j,ux:ft,uy:ot,vx:bt,vy:Mt,u0:wt,u1:ht,v0:At,v1:Ut,w:ht-wt,h:Ut-At,theta:Math.atan2(ot,ft)}},B=(V,j)=>{const st=[[V.u0,V.v0],[V.u1,V.v0],[V.u0,V.v1],[V.u1,V.v1]].map(([vt,bt])=>[V.ax+vt*V.ux+bt*V.vx,V.ay+vt*V.uy+bt*V.vy]);let St=1/0,ut=-1/0,y=1/0,A=-1/0;for(const[vt,bt]of st)St=Math.min(St,vt),ut=Math.max(ut,vt),y=Math.min(y,bt),A=Math.max(A,bt);const $=Math.max(0,Math.floor((St-a)/r)-1),ft=Math.min(i-1,Math.ceil((ut-a)/r)+1),ot=Math.max(0,Math.floor((y-o)/r)-1),dt=Math.min(s-1,Math.ceil((A-o)/r)+1);for(let vt=ot;vt<=dt;vt++)for(let bt=$;bt<=ft;bt++){const Mt=vt*i+bt;if(S[Mt])continue;const yt=a+(bt+.5)*r-V.ax,wt=o+(vt+.5)*r-V.ay,ht=yt*V.ux+wt*V.uy,At=yt*V.vx+wt*V.vy;ht>=V.u0-0&&ht<=V.u1+0&&At>=V.v0-0&&At<=V.v1+0&&(S[Mt]=2,T[Mt]=j)}},F=3*h*.97,X=1.25*h,tt=F*.9,J=t.cellTypical??(u+f)/2,U=V=>Math.min(f,Math.max(u,V)),Y=()=>{let V=U(J*(1+e.jitter(.22))),j=U(J*(1+e.jitter(.22)));const it=e.next();return t.maxAspect?[V,j]:(it<.22?V=J*e.range(1.6,2.5):it<.34&&(j=J*e.range(1.6,2.5)),[V,j])},G=V=>t.hand==="left"?1:t.hand==="right"?-1:t.hand==="random"||V==null?e.chance(.5)?1:-1:-V,K=()=>e.jitter(t.jitter/.08*1.5*Math.PI/180),Q=[];for(let V=0;V<l;V++)c[V]||d.dist2[V]>2.3||Q.push({k:V,x:a+(V%i+.5)*r,y:o+((V/i|0)+.5)*r,contour:!0,hand:null});const nt=Math.max(4,Math.round(f/r)),rt=new Map,ct=V=>{const j=Math.floor(V.k%i/nt)+Math.floor(V.k/i/nt)*100003;return rt.has(j)||rt.set(j,e.next()),rt.get(j)};Q.sort((V,j)=>ct(V)-ct(j)||V.k-j.k);const _t=(V,j,it)=>{if(!V||Math.min(V.w,V.h)<it)return null;const st=P.length;return V.hand=j,P.push(V),B(V,st),V},H=V=>{const j=[],it=(St,ut)=>[V.ax+St*V.ux+ut*V.vx,V.ay+St*V.uy+ut*V.vy],st=r*1.2;for(const[St,ut,y,A]of[[V.u1+st,V.v0+r,V.vx,V.vy],[V.u0-st,V.v0+r,V.vx,V.vy],[V.u0+r,V.v1+st,V.vx,V.vy],[V.u1-r,V.v1+st,V.vx,V.vy]]){const[$,ft]=it(St,ut),ot=W($,ft);ot>=0&&S[ot]===0&&j.push({k:ot,x:$,y:ft,theta:V.theta,nx:y,ny:A,hand:-V.hand,contour:!1})}return j};for(let V=0;V<Q.length;V++){const j=Q[V];if(S[j.k]||L[j.k])continue;L[j.k]=1;let it,st,St;const ut=Math.sqrt(d.dist2[j.k])*r<u*.6;j.contour||ut&&b>0?(it=C(j.k),st=p[j.k],St=m[j.k]):(it=0,st=j.nx,St=j.ny);const y=z(j.x,j.y,it+K(),st,St,Y(),f*4,tt),A=_t(y,G(j.hand),F);if(A)for(const $ of H(A))Q.push($)}for(let V=0;V<2;V++){const j=new Uint8Array(l);for(let ut=0;ut<l;ut++)j[ut]=S[ut]?1:0;const it=mi(j,i,s),st=[],St=V===0?(F/2/r)**2:(X/2/r)**2*.8;for(let ut=0;ut<l;ut++)!S[ut]&&it.dist2[ut]>=St&&st.push(ut);st.sort((ut,y)=>it.dist2[y]-it.dist2[ut]),L.fill(0);for(const ut of st){if(S[ut]||L[ut])continue;L[ut]=1;const y=it.nearest[ut],A=a+(ut%i+.5)*r,$=o+((ut/i|0)+.5)*r;let ft=ut%i-y%i,ot=(ut/i|0)-(y/i|0);const dt=Math.hypot(ft,ot)||1;ft/=dt,ot/=dt;const vt=y>=0?T[y]:-1,bt=Math.sqrt(d.dist2[ut])*r<u*.6?C(ut):vt>=0?P[vt].theta:0,Mt=vt>=0?P[vt].hand:null,yt=z(A,$,bt+K(),ft,ot,V===0?Y():[u,u],f*4,tt);_t(yt,G(Mt),V===0?F:t.fillers?X:F)}}return P}function nv(n,t,e){const{gw:i,gh:s,h:r,ox:a,oy:o,blocked:c,hit:l,m:h}=n,u=i*s,f=t.pitch,d=mi(l,i,s).dist2,g=new Float32Array(u);for(let m=0;m<u;m++)g[m]=Math.sqrt(d[m]);const _=(m,x)=>Math.min(m,x,i-1-m,s-1-x)>=h+.5;for(let m=0;m<t.echo;m++){const x=h+(f/2+m*f)/r;for(const v of Ku(g,i,s,x)){let M=v;for(let b=0;b<3;b++)M=$u(M,v.closed);let E=[];const w=()=>{E.length>1&&Yu(E)*r>=2.5*f&&e.push({pts:E.map(([b,C])=>[a+(b+.5)*r,o+(C+.5)*r]),radius:0}),E=[]};for(const b of M)_(b[0],b[1])?E.push(b):w();w()}}const p=h+t.echo*f/r;for(let m=0;m<u;m++)g[m]<p&&(c[m]=1);n.dirty=!0}function iv(n,t,e){const{gw:i,gh:s,h:r,ox:a,oy:o,blocked:c}=n,l=i*s,h=t.pitch,u=mi(c,i,s),f=new Float32Array(l);for(let M=0;M<l;M++)f[M]=c[M]?0:Math.sqrt(u.dist2[M]);const d=Math.max(2,Math.round(1.8*h/r)),g=sv(f,i,s,d),_=1.35*h/r,p=new Uint8Array(l);let m=!1;for(let M=0;M<l;M++)!c[M]&&g[M]<_&&(p[M]=1,m=!0);if(!m)return;const x=(M,E)=>[a+(M+.5)*r,o+(E+.5)*r],v=(M,E,w)=>M[Math.min(s-1,Math.max(0,Math.round(w)))*i+Math.min(i-1,Math.max(0,Math.round(E)))];for(let M=0;M<3;M++){const E=(h/2+M*h)/r;for(const w of Ku(f,i,s,E)){let b=w;for(let T=0;T<3;T++)b=$u(b,w.closed);let C=[];const S=()=>{C.length>1&&Yu(C)*r>=2.2*h&&e.push({pts:C.map(([T,L])=>x(T,L)),radius:0}),C=[]};for(const T of b)v(p,T[0],T[1])&&E<=v(g,T[0],T[1])-.45*h/r?C.push(T):S();S()}}for(let M=0;M<l;M++)p[M]&&(c[M]=1);n.dirty=!0}function sv(n,t,e,i){const s=new Float32Array(t*e),r=new Float32Array(t*e);for(let a=0;a<e;a++){const o=a*t;for(let c=0;c<t;c++){let l=0;const h=Math.max(0,c-i),u=Math.min(t-1,c+i);for(let f=h;f<=u;f++)n[o+f]>l&&(l=n[o+f]);s[o+c]=l}}for(let a=0;a<t;a++)for(let o=0;o<e;o++){let c=0;const l=Math.max(0,o-i),h=Math.min(e-1,o+i);for(let u=l;u<=h;u++)s[u*t+a]>c&&(c=s[u*t+a]);r[o*t+a]=c}return r}function Yu(n){let t=0;for(let e=1;e<n.length;e++)t+=Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]);return t}function $u(n,t){const e=n.length;if(e<3)return n;const i=new Array(e);for(let s=0;s<e;s++){if(!t&&(s===0||s===e-1)){i[s]=n[s];continue}const r=n[(s-1+e)%e],a=n[s],o=n[(s+1)%e];i[s]=[(r[0]+2*a[0]+o[0])/4,(r[1]+2*a[1]+o[1])/4]}return i}function Ku(n,t,e,i){const s=[],r=new Map,a=(u,f,d)=>{const g=2*(f*t+u)+(d?0:1);if(!r.has(g)){const _=n[f*t+u],p=d?n[f*t+u+1]:n[(f+1)*t+u],m=Math.min(1,Math.max(0,(i-_)/(p-_)));r.set(g,d?[u+m,f]:[u,f+m])}return g};for(let u=0;u<e-1;u++)for(let f=0;f<t-1;f++){const d=n[u*t+f]>=i,g=n[u*t+f+1]>=i,_=n[(u+1)*t+f+1]>=i,p=n[(u+1)*t+f]>=i,m=(d?1:0)|(g?2:0)|(_?4:0)|(p?8:0);if(m===0||m===15)continue;const x=()=>a(f,u,!0),v=()=>a(f,u+1,!0),M=()=>a(f,u,!1),E=()=>a(f+1,u,!1);switch(m){case 1:case 14:s.push([M(),x()]);break;case 2:case 13:s.push([x(),E()]);break;case 3:case 12:s.push([M(),E()]);break;case 4:case 11:s.push([E(),v()]);break;case 6:case 9:s.push([x(),v()]);break;case 7:case 8:s.push([M(),v()]);break;case 5:s.push([M(),v()],[x(),E()]);break;case 10:s.push([M(),x()],[E(),v()]);break}}const o=new Map;s.forEach(([u,f],d)=>{o.has(u)||o.set(u,[]),o.has(f)||o.set(f,[]),o.get(u).push(d),o.get(f).push(d)});const c=new Uint8Array(s.length),l=[],h=(u,f)=>{const d=[u];let g=u,_=f;for(;_>=0&&!c[_];){c[_]=1;const[p,m]=s[_];g=p===g?m:p,d.push(g),_=-1;for(const x of o.get(g))if(!c[x]){_=x;break}}return d};for(const[u,f]of o)f.length!==1||c[f[0]]||l.push(h(u,f[0]));for(let u=0;u<s.length;u++){if(c[u])continue;const f=h(s[u][0],u);f.closed=!0,l.push(f)}return l.map(u=>{const f=u.map(d=>r.get(d));return(u.closed||u[0]===u[u.length-1])&&(f.closed=!0),f})}function va(n,t,e,i,s){const r=new Float32Array(Math.max(t,e));for(let a=0;a<2;a++){for(let o=0;o<e;o++){const c=o*t;let l=0;for(let h=-i;h<=i;h++)h>=0&&h<t&&(l+=n[c+h]);for(let h=0;h<t;h++){r[h]=l;const u=h-i,f=h+i+1;u>=0&&(l-=n[c+u]),f<t&&(l+=n[c+f])}for(let h=0;h<t;h++)n[c+h]=s[c+h]?0:r[h]}for(let o=0;o<t;o++){let c=0;for(let l=-i;l<=i;l++)l>=0&&l<e&&(c+=n[l*t+o]);for(let l=0;l<e;l++){r[l]=c;const h=l-i,u=l+i+1;h>=0&&(c-=n[h*t+o]),u<e&&(c+=n[u*t+o])}for(let l=0;l<e;l++)n[l*t+o]=s[l*t+o]?0:r[l]}}}function rv(n,t,e,i,s){let r=[n.ux,n.uy],a=[n.vx,n.vy],o=n.w,c=n.h,l=[n.ax+n.u0*n.ux+n.v0*n.vx,n.ay+n.u0*n.uy+n.v0*n.vy];if(c>o){l=[l[0]+o*r[0],l[1]+o*r[1]];const p=a,m=[-r[0],-r[1]];r=p,a=m,[o,c]=[c,o]}const h=t.pitch,u=e.chance(.5),f=n.hand??1,d={fu:u,fv:u};Za({p:h,o:t,rng:e,strokes:i,toPanel:(p,m)=>(d.fu&&(p=o-p),d.fv&&(m=c-m),[l[0]+p*r[0]+m*a[0],l[1]+p*r[1]+m*a[1]]),stats:s},0,0,o,c,f,0)}function Za(n,t,e,i,s,r,a){const{p:o,o:c,rng:l}=n,h=Math.min(i,s),u=Math.max(i,s);if(h<2.6*o){c.fillers&&ov(n,t,e,i,s);return}const f=u/h;if(c.maxAspect&&f>c.maxAspect){const p=Math.round(f);if(p<=1||u/p<2.6*o){Vs(n,t,e,i,s,r);return}for(let m=0;m<p;m++){const x=u*m/p,v=u*(m+1)/p;i>=s?Vs(n,t+x,e,v-x,s,m%2?-r:r):Vs(n,t,e+x,i,v-x,m%2?-r:r)}return}if(f<1.6||a>2){Vs(n,t,e,i,s,r);return}if(f<3.2){l.chance(c.pairs)?Ju(n,t,e,i,s,r):Vs(n,t,e,i,s,r);return}const d=h*l.range(1.15,2.1),g=Math.max(2,Math.round(u/d)),_=[0];for(let p=1;p<g;p++)_.push(u*(p+l.jitter(.18))/g);_.push(u);for(let p=0;p<g;p++){const m=_[p],x=_[p+1];i>=s?Za(n,t+m,e,x-m,s,p%2?-r:r,a+1):Za(n,t,e+m,i,x-m,p%2?-r:r,a+1)}}function Zu(n,t){const e=Math.max(1,Math.round(n/t));return Math.min(t*1.15,Math.max(t*.87,n/e))}function Vs(n,t,e,i,s,r){const{p:a,o,rng:c}=n,l=Math.min(i,s),h=Zu(l-a,a),u=t+a/2,f=e+a/2,d=t+i-a/2,g=e+s-a/2,_=o.eyes>0&&l>=6*a&&c.chance(o.eyes),p=_?2.6*h:0,m=[[u,f,[1,0],[0,1]],[d,f,[0,1],[-1,0]],[d,g,[-1,0],[0,-1]],[u,g,[0,-1],[1,0]]],[x,v,M,E]=m[c.int(0,3)],w=Math.abs(M[0])*(d-u)+Math.abs(M[1])*(g-f),b=Math.abs(E[0])*(d-u)+Math.abs(E[1])*(g-f),C=no(w,b,h,p).map(([S,T])=>[x+S*M[0]+T*E[0],v+S*M[1]+T*E[1]]);if(r<0)for(const S of C)S[0]=u+d-S[0];fo(n,C,h),n.stats.spirals++,_&&av(n,(u+d)/2,(f+g)/2,h*.7)}function no(n,t,e,i=0){let s=0,r=n,a=0,o=t,c=0,l=0;const h=[[0,0]],u=e*.5;for(let f=0;f<200&&!(r-c<u||(c=r,h.push([c,l]),a+=e,o-l<u)||(l=o,h.push([c,l]),r-=e,c-s<u)||(c=s,h.push([c,l]),o-=e,l-a<u)||(l=a,h.push([c,l]),s+=e,i&&(r-s<i||o-a<i)));f++);return h}function Ju(n,t,e,i,s,r){const{p:a,rng:o}=n;if(s>i){const x=n.toPanel,v={...n,toPanel:(M,E)=>x(t+(E-e),e+(M-t))};Ju(v,t,e,s,i,-r);return}const c=Zu(s-a,a),l=t+a/2,h=e+a/2,u=t+i-a/2,f=e+s-a/2,d=l+(u-l-c)/2*o.range(.9,1.1),g=no(f-h,d-l,c).map(([x,v])=>[d-v,h+x]);let _;o.chance(.5)?_=no(u-(d+c),f-h,c).map(([x,v])=>[d+c+x,h+v]):_=no(f-h,u-(d+c),c).map(([x,v])=>[d+c+v,h+x]);const m=g.reverse().concat(_);if(r<0)for(const x of m)x[1]=e+s-(x[1]-e);fo(n,m,c),n.stats.pairs++}function ov(n,t,e,i,s){const{p:r,rng:a}=n,o=Math.min(i,s),c=Math.max(i,s),l=i>=s,h=(f,d)=>l?[t+f,e+d]:[t+d,e+f],u=o-r;if(u>=.6*r&&c>=2.2*r){const f=u,d=r/2,g=c-r/2,_=r/2,p=o-r/2,m=Math.min(f,(g-d)*.3),x=a.chance(.5)?[h(g-m,p),h(d,p),h(d,_),h(g,_)]:[h(d+m,p),h(g,p),h(g,_),h(d,_)];fo(n,x,f)}else if(c-r>=.9*r){const f=o/2;fo(n,[h(r/2,f),h(c-r/2,f)],r)}else return;n.stats.fillers++}function av(n,t,e,i){const r=[];for(let a=0;a<=12;a++){const o=a/12*Math.PI*2;r.push([t+i*Math.cos(o),e+i*Math.sin(o)])}n.strokes.push({pts:r.map(([a,o])=>n.toPanel(a,o)),radius:0,closed:!0})}function fo(n,t,e){const{o:i,rng:s}=n,r=i.jitter*e,a=t.map(([c,l])=>n.toPanel(c+s.jitter(r),l+s.jitter(r))),o=e*(.12+.88*Math.max(0,Math.min(1,i.roundness)));n.strokes.push({pts:a,radius:o})}function cv(n,t,e){const i=e.debugCells===!0?.2:e.pitch*e.line,s=r=>{r.lineWidth=i,r.lineCap="round",r.lineJoin="round",r.beginPath();for(const a of t){const o=a.pts;if(o.length<2)continue;if(r.moveTo(o[0][0],o[0][1]),a.closed){for(let l=1;l<o.length;l++)r.lineTo(o[l][0],o[l][1]);r.closePath(),r.moveTo(o[0][0],o[0][1]);continue}for(let l=1;l<o.length-1;l++){const h=o[l-1],u=o[l],f=o[l+1],d=Math.hypot(u[0]-h[0],u[1]-h[1]),g=Math.hypot(f[0]-u[0],f[1]-u[1]),_=Math.min(a.radius,l===1?d:d/2,l===o.length-2?g:g/2);_>.001?r.arcTo(u[0],u[1],f[0],f[1],_):r.lineTo(u[0],u[1])}const c=o[o.length-1];r.lineTo(c[0],c[1])}r.stroke()};e.mode==="thread"?n.add(s,{height:e.depth,profile:"ridge"}):n.sink(s,{depth:e.depth,shoulder:i*.4,profile:"u"})}function lv(n,t){const e=new Map,i=n.field;for(let a=0;a<i.length;a+=3){if(t[a]<.5)continue;const o=Math.round(i[a]/.02);e.set(o,(e.get(o)||0)+1)}let s=0,r=-1;for(const[a,o]of e)o>r&&(r=o,s=a);return s*.02}const Gr=n=>Math.round(n*1e3)/1e3,Hr=()=>typeof performance<"u"?performance.now():Date.now(),hv=1024,oi=4,Ts={plateau(n,t){if(n<=0)return 0;if(n>=t)return 1;const e=1-n/t;return 1-e*e*Math.sqrt(e)},dome(n,t){if(n<=0)return 0;const e=Math.min(n/t,1);return Math.sqrt(1-(1-e)*(1-e))},ridge(n,t){if(n<=0)return 0;const e=Math.min(n/t,1);return 1-(1-e)*(1-e)},u(n,t){if(n<=0)return 0;const e=Math.min(n/t,1);return Math.sqrt(1-(1-e)*(1-e))},v(n,t){return n<=0?0:Math.min(n/t,1)}},uv=new Set(["dome","ridge","v"]),ds=class ds{constructor({width:t,height:e,ppmm:i=8,maxSize:s=ds.maxSize,seed:r=1}={}){if(!(t>0&&e>0))throw new Error("ReliefPanel: width and height (mm) required");this.width=t,this.height=e,s=Math.min(s,ds.maxSizeCap),this.ppmm=Math.min(i,s/t,s/e),this.cols=Math.max(2,Math.round(t*this.ppmm)),this.rows=Math.max(2,Math.round(e*this.ppmm)),this.ppmm=this.cols/t,this.field=new Float32Array(this.cols*this.rows),this.groove=new Float32Array(this.cols*this.rows),this.seed=r,this.rng=new $e(r),this.stats={ops:0,ms:0},this._canvas=null,this._probeCanvas=null}raise(t,{height:e=1.2,shoulder:i,profile:s="plateau"}={}){const r=this._profile(s);return this._apply(t,s,i,.5,(a,o)=>{const c=e*o;c>this.field[a]&&(this.field[a]=c)},r),this}sink(t,{depth:e=.5,shoulder:i,profile:s="u"}={}){const r=this._profile(s);return this._apply(t,s,i,.25,(a,o)=>{this.field[a]-=e*o,o>this.groove[a]&&(this.groove[a]=o)},r),this}add(t,{height:e=.3,shoulder:i,profile:s="ridge"}={}){const r=this._profile(s);return this._apply(t,s,i,.25,(a,o)=>{this.field[a]+=e*o},r),this}mask(t){const e=new Float32Array(this.cols*this.rows),i=this._rasterize(t);if(i){const{cov:s,x0:r,y0:a,bw:o,bh:c}=i;for(let l=0;l<c;l++){const h=a+l;if(!(h<0||h>=this.rows))for(let u=0;u<o;u++){const f=r+u;f<0||f>=this.cols||(e[h*this.cols+f]=s[l*o+u])}}}return{data:e,cols:this.cols,rows:this.rows,ppmm:this.ppmm}}fillGround(t={},{avoid:e="raised",margin:i=.6,rect:s}={}){return Co(this,{rect:s??{x:0,y:0,w:this.width,h:this.height},avoid:e,margin:i},t)}mirrorX(t){const{cols:e,field:i,groove:s}=this,r=t??{x:0,y:0,w:this.width,h:this.height},a=Math.max(0,Math.round(r.x*this.ppmm)),o=Math.min(e,Math.round((r.x+r.w)*this.ppmm)),c=Math.max(0,Math.round(r.y*this.ppmm)),l=Math.min(this.rows,Math.round((r.y+r.h)*this.ppmm)),h=o-a>>1;for(let u=c;u<l;u++){const f=u*e;for(let d=0;d<h;d++)i[f+o-1-d]=i[f+a+d],s[f+o-1-d]=s[f+a+d]}return this}heightAt(t,e){const i=Math.min(this.cols-1,Math.max(0,Math.floor(t*this.ppmm))),s=Math.min(this.rows-1,Math.max(0,Math.floor(e*this.ppmm)));return this.field[s*this.cols+i]}bake(t={}){return Xu(this,t)}_profile(t){if(typeof t=="function")return t;const e=Ts[t];if(!e)throw new Error(`ReliefPanel: unknown profile "${t}"`);return e}_apply(t,e,i,s,r,a){const o=performance.now(),c=this._rasterize(t);if(!c)return;const{cov:l,x0:h,y0:u,bw:f,bh:d}=c,g=nu(l,f,d),_=1/this.ppmm;let p=i??(uv.has(e)?null:s);if(p==null){let v=0;for(let M=0;M<g.length;M++)g[M]>v&&(v=g[M]);p=Math.max(v*_,.001)}const{cols:m,rows:x}=this;for(let v=0;v<d;v++){const M=u+v;if(!(M<0||M>=x))for(let E=0;E<f;E++){const w=h+E;if(w<0||w>=m)continue;const b=g[v*f+E];b<=0||r(M*m+w,a(b*_,p))}}this.stats.ops++,this.stats.ms+=performance.now()-o}_rasterize(t){const{cols:e,rows:i,ppmm:s}=this,r=Math.max(1,Math.ceil(Math.max(e,i)/hv)),a=Math.ceil(e/r),o=Math.ceil(i/r);this._probeCanvas||(this._probeCanvas=Fa(a,o));const c=this._probeCanvas;c.width=a,c.height=o;const l=Vc(c);bh(l),l.setTransform(s/r,0,0,-s/r,0,i/r);const h=[];if(t(fv(l,h)),!h.length)return null;const u=l.getImageData(0,0,a,o).data;let f=a,d=o,g=-1,_=-1;for(let P=0;P<o;P++){const W=P*a*4;for(let R=0;R<a;R++)u[W+R*4+3]!==0&&(R<f&&(f=R),R>g&&(g=R),P<d&&(d=P),P>_&&(_=P))}if(g<0)return null;const p=Math.max(-oi,f*r-oi-r),m=Math.min(e+oi,(g+1)*r+oi+r),x=d*r-oi-r,v=(_+1)*r+oi+r,M=Math.max(-oi,i-v),E=Math.min(i+oi,i-x),w=m-p,b=E-M;this._canvas||(this._canvas=Fa(w,b));const C=this._canvas;C.width=w,C.height=b;const S=Vc(C);bh(S),S.setTransform(s,0,0,-s,-p,E),dv(S,h);const T=S.getImageData(0,0,w,b).data,L=new Float32Array(w*b);for(let P=0;P<b;P++){const W=P*w*4,R=(b-1-P)*w;for(let I=0;I<w;I++)L[R+I]=T[W+I*4+3]/255}return{cov:L,x0:p,y0:M,bw:w,bh:b}}};mr(ds,"maxSize",4096),mr(ds,"maxSizeCap",1/0);let ar=ds;function bh(n){n.setTransform(1,0,0,1,0,0),n.globalCompositeOperation="source-over",n.globalAlpha=1,n.fillStyle="#fff",n.strokeStyle="#fff",n.lineCap="round",n.lineJoin="round",n.miterLimit=4,n.lineWidth=1}function fv(n,t){return new Proxy(n,{get(e,i){const s=e[i];return typeof s=="function"?(...r)=>(t.push([i,r]),s.apply(e,r)):s},set(e,i,s){return t.push([i,s,!0]),e[i]=s,!0}})}function dv(n,t){for(const e of t)e[2]?n[e[0]]=e[1]:n[e[0]](...e[1])}const me=Math.PI/180;function Qu(n,t,e=!1,i=.5){const s=t.length;if(n.beginPath(),s===0)return;if(s<3){n.moveTo(t[0][0],t[0][1]);for(let c=1;c<s;c++)n.lineTo(t[c][0],t[c][1]);e&&n.closePath();return}const r=c=>e?t[(c+s)%s]:t[Math.max(0,Math.min(s-1,c))],a=i/3;n.moveTo(t[0][0],t[0][1]);const o=e?s:s-1;for(let c=0;c<o;c++){const l=r(c-1),h=r(c),u=r(c+1),f=r(c+2);n.bezierCurveTo(h[0]+(u[0]-l[0])*a,h[1]+(u[1]-l[1])*a,u[0]-(f[0]-h[0])*a,u[1]-(f[1]-h[1])*a,u[0],u[1])}e&&n.closePath()}function As(n,t,e=!1){n.beginPath(),t.forEach((i,s)=>s?n.lineTo(i[0],i[1]):n.moveTo(i[0],i[1])),e&&n.closePath()}function Zn(n){let t=0;for(let e=1;e<n.length;e++)t+=Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]);return t}function Bi(n,t=.5){if(n.length<2)return n.slice();const e=Zn(n),i=Math.max(1,Math.ceil(e/t)),s=[n[0].slice()];let r=1,a=0,o=Math.hypot(n[1][0]-n[0][0],n[1][1]-n[0][1]);for(let c=1;c<i;c++){const l=c/i*e;for(;a+o<l&&r<n.length-1;)a+=o,r++,o=Math.hypot(n[r][0]-n[r-1][0],n[r][1]-n[r-1][1]);const h=o>0?(l-a)/o:0,u=n[r-1],f=n[r];s.push([u[0]+(f[0]-u[0])*h,u[1]+(f[1]-u[1])*h])}return s.push(n[n.length-1].slice()),s}function tf(n,t=0,e=0){const i=Zn(n);return t+e>=i?[]:Do(n,t,i-e)}function Do(n,t,e){const i=[];let s=0;for(let r=1;r<n.length;r++){const a=n[r-1],o=n[r],c=Math.hypot(o[0]-a[0],o[1]-a[1]),l=s,h=s+c;if(h>=t&&l<=e&&c>0){const u=Math.max(0,(t-l)/c),f=Math.min(1,(e-l)/c);i.length||i.push([a[0]+(o[0]-a[0])*u,a[1]+(o[1]-a[1])*u]),i.push([a[0]+(o[0]-a[0])*f,a[1]+(o[1]-a[1])*f])}s=h}return i}function Ja(n,t=.4,e=.5){const i=n.length;if(i<3)return Bi(n,t);const s=o=>n[Math.max(0,Math.min(i-1,o))],r=e/3,a=[n[0].slice()];for(let o=0;o<i-1;o++){const c=s(o-1),l=s(o),h=s(o+1),u=s(o+2),f=[l[0]+(h[0]-c[0])*r,l[1]+(h[1]-c[1])*r],d=[h[0]-(u[0]-l[0])*r,h[1]-(u[1]-l[1])*r],g=Math.max(4,Math.ceil(Math.hypot(h[0]-l[0],h[1]-l[1])/(t*.5)));for(let _=1;_<=g;_++){const p=_/g,m=1-p;a.push([m*m*m*l[0]+3*m*m*p*f[0]+3*m*p*p*d[0]+p*p*p*h[0],m*m*m*l[1]+3*m*m*p*f[1]+3*m*p*p*d[1]+p*p*p*h[1]])}}return Bi(a,t)}function ef(n){const t=n.length,e=new Array(t);for(let i=0;i<t;i++){const s=n[Math.max(0,i-1)],r=n[Math.min(t-1,i+1)];let a=r[0]-s[0],o=r[1]-s[1];const c=Math.hypot(a,o)||1;a/=c,o/=c,e[i]=[-o,a]}return e}function nf(n,t=!1){const e=n.length,[i,s]=t?[n[0],n[Math.min(1,e-1)]]:[n[Math.max(0,e-2)],n[e-1]];return Math.atan2(s[1]-i[1],s[0]-i[0])/me}function pi(n,t,{closed:e=!1,step:i=.35}={}){const s=n.length;if(s<3)return n.map(c=>c.slice());const r=[],a=c=>Array.isArray(t)?t[c]??0:t,o=e?[...Array(s).keys()]:[...Array(s).keys()].slice(1,s-1);e||r.push(n[0].slice());for(const c of o){const l=n[c],h=n[(c-1+s)%s],u=n[(c+1)%s],f=Math.hypot(h[0]-l[0],h[1]-l[1]),d=Math.hypot(u[0]-l[0],u[1]-l[1]),g=a(c);if(!(g>0)||f<1e-6||d<1e-6){r.push(l.slice());continue}const _=[(h[0]-l[0])/f,(h[1]-l[1])/f],p=[(u[0]-l[0])/d,(u[1]-l[1])/d],m=Math.max(-1,Math.min(1,_[0]*p[0]+_[1]*p[1])),x=Math.acos(m);if(x>Math.PI-.001){r.push(l.slice());continue}const v=Math.tan(x/2);let M=g/v;const E=e||c-1>0?.5:1,w=e||c+1<s-1?.5:1;M=Math.min(M,f*E,d*w);const b=M*v,C=[l[0]+_[0]*M,l[1]+_[1]*M],S=[l[0]+p[0]*M,l[1]+p[1]*M],T=[_[0]+p[0],_[1]+p[1]],L=Math.hypot(T[0],T[1])||1,P=b/Math.sin(x/2),W=[l[0]+T[0]/L*P,l[1]+T[1]/L*P];let R=Math.atan2(C[1]-W[1],C[0]-W[0]),D=Math.atan2(S[1]-W[1],S[0]-W[0])-R;for(;D>Math.PI;)D-=2*Math.PI;for(;D<-Math.PI;)D+=2*Math.PI;const z=Math.max(2,Math.ceil(Math.abs(D)*b/i));for(let B=0;B<=z;B++){const F=R+D*B/z;r.push([W[0]+Math.cos(F)*b,W[1]+Math.sin(F)*b])}}return e||r.push(n[s-1].slice()),r}function sf(n,t,e=.08,i=14){if(!t||!(e>0)||n.length<3)return n;const s=t.range(0,6.283),r=t.range(0,6.283),a=6.283/i,o=6.283/(i*.43),c=ef(n);let l=0;return n.map((h,u)=>{u&&(l+=Math.hypot(h[0]-n[u-1][0],h[1]-n[u-1][1]));const f=e*(.7*Math.sin(l*a+s)+.3*Math.sin(l*o+r));return[h[0]+c[u][0]*f,h[1]+c[u][1]*f]})}class oe{constructor(t,e=0){this.v=[[t[0],t[1]]],this.r=[0],this.h=e,this.marks={}}get pos(){return this.v[this.v.length-1]}fwd(t){const[e,i]=this.pos;return this.v.push([e+Math.cos(this.h*me)*t,i+Math.sin(this.h*me)*t]),this.r.push(0),this}turn(t,e=0){return this.h+=t,this.r[this.r.length-1]=e,this}head(t,e=0){return this.h=t,this.r[this.r.length-1]=e,this}to(t,e){e!==void 0&&(this.r[this.r.length-1]=e);const[i,s]=this.pos;return this.h=Math.atan2(t[1]-s,t[0]-i)/me,this.v.push([t[0],t[1]]),this.r.push(0),this}mark(t){return this.marks[t]=this.v.length-1,this}curl({dir:t=1,size:e=10,pitch:i=4,turns:s=1,r=2,shrink:a=1}={}){const[o,c]=Array.isArray(e)?e:[e,e],l=Math.max(1,Math.round(s*4));let h=o,u=c;for(let f=0;f<l;f++){const d=f%2===0?h:u;if(d<i*.35)break;this.turn(90*t,r),this.fwd(d),f%2===1&&(h=(h-i)*a,u=(u-i)*a),r=Math.min(r,Math.max(.2,Math.min(h,u)*.5))}return this}spine(t=.4){return Bi(pi(this.v,this.r),t)}}function cr(n,t,e,i,s=.4){const r=(i-e)*me,a=Math.max(2,Math.ceil(Math.abs(r)*t/s)),o=[];for(let c=0;c<=a;c++){const l=e*me+r*c/a;o.push([n[0]+Math.cos(l)*t,n[1]+Math.sin(l)*t])}return o}function po(n,t,{start:e=0,sweep:i=270,dir:s=1,shrink:r=.15,step:a=.4}={}){const o=[],c=Math.abs(i)*me,l=Math.max(4,Math.ceil(c*t/a));for(let h=0;h<=l;h++){const u=h/l,f=e*me+s*c*u,d=t*Math.pow(1-r,c*u/(Math.PI/2));o.push([n[0]+Math.cos(f)*d,n[1]+Math.sin(f)*d])}return o}function pv(n,{pitch:t=2,turns:e=2,dir:i=1,rCorner:s=.3,startHeading:r=0,step:a=.3}={}){const o=Math.max(2,Math.round(e*4)),c=[];for(let d=0;d<o;d++)c.push(t*Math.ceil((d+1)/2));let l=r+180+i*90*(o-1);const h=[[n[0],n[1]]];let u=n[0],f=n[1];for(let d=0;d<o;d++)u+=Math.cos(l*me)*c[d],f+=Math.sin(l*me)*c[d],h.push([u,f]),l-=i*90;return h.reverse(),Bi(pi(h,s*t),a)}function Ue(n,t,e,{curl:i=90,radius:s=2,dir:r=1,step:a=.3}={}){const o=new oe(n,t).fwd(e),c=o.spine(a),l=o.h,h=o.pos[0]+Math.cos((l+90*r)*me)*s,u=o.pos[1]+Math.sin((l+90*r)*me)*s,f=l-90*r,d=cr([h,u],s,f,f+i*r,a);return c.concat(d.slice(1))}function mv(n,t,e,{sweep:i=240,shrink:s=.15,step:r=.4}={}){const a=Math.atan2(t[1]-n[1],t[0]-n[0])/me,o=[n[0]+Math.cos((a+90)*me)*e,n[1]+Math.sin((a+90)*me)*e],c=[t[0]+Math.cos((a-90)*me)*e,t[1]+Math.sin((a-90)*me)*e],l=po(o,e,{start:a-90,sweep:i,dir:-1,shrink:s,step:r}).reverse(),h=po(c,e,{start:a+90,sweep:i,dir:-1,shrink:s,step:r});return l.concat(Bi([n,t],r).slice(1,-1),h)}const ln=(n,t,e=0)=>i=>i<e?n:n+(t-n)*((i-e)/(1-e)),vs=(n,t=.4,e=.35)=>i=>i<1-t?n:n*(1-(1-e)*((i-(1-t))/t)),Rc=(n,t,e="round",i="round",s={})=>({kind:"band",pts:n,w:t,capA:e,capB:i,...s}),Ln=(n,t={})=>({kind:"poly",pts:n,...t}),Dn=(n,t,e={})=>({kind:"circle",c:n,r:t,...e}),mo=(n,t,e,i=0,s={})=>({kind:"ellipse",c:n,rx:t,ry:e,rot:i,...s}),Ci=(n,t,e,i,s=0,r={})=>({kind:"rrect",c:n,w:t,h:e,r:i,rot:s,...r});function Pc(n,t,e,i=0,s=.3){const r=t/2,a=e/2,o=(r*r+a*a)/(2*a),c=Math.asin(Math.min(1,r/o))/me,l=cr([0,a-o],o,90+c,90-c,s),h=cr([0,o-a],o,-90+c,-90-c,s),u=Math.cos(i*me),f=Math.sin(i*me);return l.concat(h.slice(1,-1)).map(([d,g])=>[n[0]+d*u-g*f,n[1]+d*f+g*u])}function rf(n,t){const e={...n};return e.pts&&(e.pts=e.pts.map(t)),e.c&&(e.c=t(e.c)),e}function xs(n,t,e=0){switch(t.kind){case"band":return gv(n,t,e);case"poly":if(t.pts.length<3)return;As(n,t.pts,!0),n.fill(),e>0&&(n.lineWidth=e*2,n.lineJoin="round",n.stroke());return;case"circle":n.beginPath(),n.arc(t.c[0],t.c[1],t.r+e,0,Math.PI*2),n.fill();return;case"ellipse":n.beginPath(),n.ellipse(t.c[0],t.c[1],t.rx+e,t.ry+e,(t.rot||0)*me,0,Math.PI*2),n.fill();return;case"rrect":{const i=t.w+e*2,s=t.h+e*2,r=Math.min(t.r+e,i/2,s/2);n.save(),n.translate(t.c[0],t.c[1]),t.rot&&n.rotate(t.rot*me),n.beginPath(),n.moveTo(-i/2+r,-s/2),n.arcTo(i/2,-s/2,i/2,s/2,r),n.arcTo(i/2,s/2,-i/2,s/2,r),n.arcTo(-i/2,s/2,-i/2,-s/2,r),n.arcTo(-i/2,-s/2,i/2,-s/2,r),n.closePath(),n.fill(),n.restore();return}}}function Sh(n,t,e){if(e<=0||n.length<2)return n;const i=nf(n,t)*me;if(t){const r=n[0];return[[r[0]-Math.cos(i)*e,r[1]-Math.sin(i)*e],...n]}const s=n[n.length-1];return[...n,[s[0]+Math.cos(i)*e,s[1]+Math.sin(i)*e]]}function gv(n,t,e){let i=t.pts;if(!i||i.length<2)return;const s=typeof t.w=="number",r=s?()=>t.w:t.w;t.capA==="square"&&(i=Sh(i,!0,r(0)*.18)),t.capB==="square"&&(i=Sh(i,!1,r(1)*.18));const a=t.capA==="round",o=t.capB==="round";if(s&&t.capA!=="point"&&t.capB!=="point")n.lineWidth=t.w+e*2,n.lineJoin="round",n.lineCap="butt",As(n,i,!1),n.stroke();else{const l=Zn(i);let h=1/0;for(let g=0;g<=8;g++)h=Math.min(h,Math.max(.3,r(g/8)));const u=Bi(i,Math.max(.08,Math.min(.35,h*.12))),f=Zn(u);let d=0;n.beginPath();for(let g=0;g<u.length;g++){g&&(d+=Math.hypot(u[g][0]-u[g-1][0],u[g][1]-u[g-1][1]));const _=f>0?d/f:0;let p=r(_);t.capA==="point"&&(p*=Math.min(1,_*l/Math.max(.5,r(0)*1.2))),t.capB==="point"&&(p*=Math.min(1,(1-_)*l/Math.max(.5,r(1)*1.2)));const m=p/2+e;m<=.02||(n.moveTo(u[g][0]+m,u[g][1]),n.arc(u[g][0],u[g][1],m,0,Math.PI*2))}n.fill();for(const[g,_]of[[!0,t.capA],[!1,t.capB]]){if(_==="round"||_==="point")continue;const p=r(g?0:1)+e*2,m=g?u.slice(0,3):u.slice(-3);n.lineWidth=p,n.lineCap="butt",As(n,m,!1),n.stroke()}}const c=(l,h)=>{n.beginPath(),n.arc(i[l][0],i[l][1],h/2+e,0,Math.PI*2),n.fill()};a&&c(0,r(0)),o&&c(i.length-1,r(1)),e>0&&!a&&c(0,0),e>0&&!o&&c(i.length-1,0)}function Qa(n,t,e,i="round"){!t||t.length<2||(n.lineWidth=e,n.lineCap=i,n.lineJoin="round",As(n,t,!1),n.stroke())}function of(n,{faceW:t=.66,spread:e=1,reserve:i=0,invert:s=!1,taper:r=0}={}){const a=n.h,o=n.w/2,c=Math.min(a,o/(t*e+i)),l={rect:n,H:a,hw:o,s:c,spread:e,invert:s,taper:r,cx:n.x+o,X:h=>h*c*e,Y:h=>h*a,P:(h,u)=>[h*c*e,u*a],u:h=>h*c,taperAt:h=>{const u=Math.max(0,Math.min(1,h/a));return r>=0?1-r*u:1+r*(1-u)},widthAt:h=>o*l.taperAt(h),warp:h=>r?[h[0]*l.taperAt(h[1]),h[1]]:h,toPanel:h=>{const u=l.warp(h);return[l.cx-u[0],n.y+(s?a-u[1]:u[1])]},apply(h){h.translate(l.cx,n.y),h.scale(-1,1),s&&(h.translate(0,a),h.scale(1,-1))}};return l}const _v=Object.freeze(Object.defineProperty({__proto__:null,Turtle:oe,arcPts:cr,band:Rc,cScroll:po,circle:Dn,drawShape:xs,ellipse:mo,fillet:pi,halfMaskFrame:of,headingAt:nf,hookSpine:Ue,lens:Pc,mapShape:rf,normals:ef,poly:Ln,polyLength:Zn,polyPath:As,resample:Bi,rrect:Ci,sScroll:mv,smoothPath:Qu,spline:Ja,sqSpiral:pv,strokeLine:Qa,subPath:Do,tail:vs,taper:ln,trim:tf,wobble:sf},Symbol.toStringTag,{value:"Module"}));let vv=class{constructor(){this.islands=[],this.bosses=[],this.tips=[],this.grooves=[],this.cuts=[],this.centres=[]}island(t){let e=this.islands.find(i=>i.id===t);return e||this.islands.push(e={id:t,shapes:[]}),e}add(t,e){return this.island(t).shapes.push(e),e}};const Lc=(n,t,e)=>Math.max(t,Math.min(e,n)),xe=(n,t,e)=>n+(t-n)*e;function af(n,t,e){const i=e.edge&&e.edge!=="none"?.2:0,s=of(t,{faceW:.66,spread:e.spread??1,reserve:i,invert:!!e.invert,taper:e.taper||0}),r=`taotie:${e.seed??0}:${t.x.toFixed(1)},${t.y.toFixed(1)}`,a=n.rng.fork(r),o=e.irregularity??1,c=e.lineWeight,l=Math.max(3.2*c,2.2),h={f:s,p:e,rng:a,panel:n,rect:t,sheet:new vv,s:s.s,H:s.H,lw:c,irr:o,edgeW:i*s.s,marks:{},dissolved:e.body==="dissolved",sq:Lc(e.square??.5,0,1),u:u=>u*s.s,bw:Math.max(Math.sqrt(s.s*Math.min(s.H,1.6*s.s))*.082*(e.bandWidth??1)*(e.body==="kui"?1.4:1),l),A(u,f,d=.008){return[s.X(u+a.jitter(d*o)),s.Y(f+a.jitter(d*o*.8))]},rc(u,f=2.6){return xe(u*f,u*.12,h.sq)},rcurl(u){return h.sq>.85?u*.2:xe(u*9,u*.2,h.sq*h.sq)},wob(u,f=.08){return sf(u,a,f*o,Math.max(6,s.s*.12))},wj(u){return u*(1+a.jitter(.03*o))},band(u,f,d,g="square",_="square",{centre:p=!0}={}){const m=h.wob(f),x=typeof d=="number"?h.wj(d):d;return h.sheet.add(u,Rc(m,x,g,_)),p&&h.sheet.centres.push({pts:m,w:typeof x=="number"?x:x(.3)}),m},xmax(){return s.hw}};return h.ext=Math.max(h.u(.06),(e.echoInset??1.4)+2*c+1),h}function xv(n,t,e,i=0){const s=[];for(let l=0;l<72;l++){const h=l/72*Math.PI*2,u=Math.cos(h),f=Math.sin(h),d=f>=0?1:.85,g=f*d*Math.pow(Math.max(0,1-u*u),.15)*(.92+.08*Math.abs(f));s.push([u*t*.5,g*e*.5])}const a=i*Math.PI/180,o=Math.cos(a),c=Math.sin(a);return s.map(([l,h])=>[n[0]+l*o-h*c,n[1]+l*c+h*o])}function Us(n){const t=n.p,e=t.jaw==="split";return{lip:e?Math.max(.21,t.lipY??0):t.lipY??.15,nostril:(e?Math.max(.21,t.lipY??0):t.lipY??.15)+.13,eye:t.eyeY??.5,hornRoot:.735,top:.955}}const cn=(n,t,e)=>n&&n[t]!==void 0?n[t]:e.p[t];function Mv(n,t={}){const e=cn(t,"nose",n);if(e==="none")return;const i=Us(n),s=e==="flange",r=s?Math.max((t.width??.42)*n.bw,3.2):(t.width??.8)*n.bw,a=n.f.Y(t.from??(s?i.lip:i.nostril-.035)),o=n.marks.crestBottom??n.f.Y(t.to??(s?.92:.8));if(n.marks.noseHalf=r,e==="stack"){const l=n.u(.12),h=Math.max(2,Math.round((o-a)/l)),u=(o-a)/h;for(let f=0;f<h;f++){const d=a+f*u+u*.12,g=a+(f+1)*u-u*.12,_=new oe([-n.ext,g-n.bw*.4],0).to([r*1.1,g-n.bw*.4]).turn(-90,n.rc(n.bw*.6)).fwd(Math.max(1,g-d-n.bw*.8));n.band("nose"+(n.dissolved?f:""),_.spine(),n.bw*.6,"flat","square",{centre:!1})}return}const c=pi([[-n.ext,a],[r*1.12,a],[r,a+(o-a)*.25],[r*.96,o],[-n.ext,o]],[0,n.rc(r*.6),n.rc(r),0,0],{closed:!0});if(n.sheet.add("nose",Ln(n.wob(c,.05))),e==="ridge"&&n.p.carving==="dense"){const l=Math.max(n.lw*4.5,n.u(.045)),h=r-(n.p.echoInset??1.4)-n.lw*1.2;if(h>n.lw*2)for(let u=a+l;u<o-l*.6;u+=l)n.sheet.grooves.push({pts:[[-n.lw,u],[h,u]]})}}function yv(n,t={}){let e=cn(t,"crest",n);if(e===!0&&(e="lozenge"),!e||e==="none")return;const i=n.f.Y(t.y??.83),s=n.u(.075)*(t.size??1),r=n.u(.085)*(t.size??1);if(e==="lozenge"){const a=pi([[0,i-r],[s,i],[0,i+r],[-s,i]],n.rc(n.bw*.5,1),{closed:!0});n.sheet.add("crest",Ln(n.wob(a,.04)));const o=.42;n.p.carving!=="none"&&n.sheet.grooves.push({pts:[[-n.lw,i-r*o],[s*o,i],[-n.lw,i+r*o]]}),n.marks.crestBottom=i-r*.55}else if(e==="shield"){const a=pi([[-n.ext,i+r],[s*1.15,i+r],[s*.55,i-r],[-n.ext,i-r]],[0,n.rc(n.bw*.5),n.rc(n.bw*.6),0],{closed:!0});n.sheet.add("crest",Ln(n.wob(a,.04))),n.p.carving!=="none"&&n.sheet.grooves.push({pts:[[0,i-r*.4],[0,i+r*.5]]}),n.marks.crestBottom=i-r*.8}else if(e==="cicada"){const a=pi([[-n.ext,i+r],[s*1.1,i+r],[s*.35,i-r*1.3],[-n.ext,i-r*1.3]],[0,n.rc(n.bw*.4),n.rc(n.bw*.3),0],{closed:!0});n.sheet.add("crest",Ln(a)),n.sheet.bosses.push({shape:Dn([s*.6,i+r*.45],s*.26),base:"plateau"});for(let o=1;o<=3;o++){const c=i+r*.2-o*r*.42;n.sheet.grooves.push({pts:[[-n.lw,c-r*.18],[s*(.75-o*.12),c]]})}n.marks.crestBottom=i-r}else if(e==="hooks"){const a=n.f.Y(.74),o=n.f.Y(.985);n.sheet.add("crest",Ln([[-n.ext,a],[n.bw*.45,a],[n.bw*.45,o],[-n.ext,o]]));const c=Math.max(2,Math.round((o-a)/n.u(.08)));for(let l=0;l<c;l++){const h=a+(l+.6)/c*(o-a);n.band("crest",Ue([n.bw*.3,h],0,n.bw*.6,{curl:120,radius:n.bw*.45,dir:-1}),n.bw*.55,"flat","round",{centre:!1})}n.marks.crestBottom=a}}function bv(n,t={}){const e=cn(t,"nostril",n);if(e==="none")return;const i=Us(n),s=n.f.Y(t.y??i.nostril),r=n.bw*(t.width??1),a=n.dissolved?(n.marks.noseHalf??n.bw)+n.u(.035):0;if(e==="bulb"){n.sheet.add("nostril",mo([n.u(.04),s+n.u(.01)],n.u(.085),n.u(.05))),n.band("nostril",Ue([n.u(.11),s],-90,n.u(.02),{curl:140,radius:n.u(.03),dir:-1}),r*.8,"square","round",{centre:!1});return}const o=n.f.X(t.reach??.16),c=Lc(n.u(.085),r*1.4,n.f.Y(.42)-s),l=new oe([a,s],0).to([o,s]).curl({dir:1,size:[Math.max(r*2,Math.min(c,n.u(.075))),Math.max(r*2,Math.min(n.u(.08),o-a-r*.9))],pitch:r*1.4,turns:t.turns??.6,r:n.rcurl(r)});n.band("nostril",l.spine(),r,"flat","square")}function Sv(n,t={}){const e=cn(t,"jaw",n);if(e==="none")return;const i=Us(n),s=n.f.Y(t.y??i.lip),r=n.bw*(t.width??1.05),a=Math.min(n.f.X(t.corner??n.p.mouthCorner??.38),n.f.hw-n.edgeW-r),o=n.dissolved?(n.marks.noseHalf??n.bw)+n.u(.03):0,c=Lc(Math.max(n.u(.1),(s-r*.6)*.85),r*1.2,s-r*.55),l=new oe([o,s],0).to([a,s]).curl({dir:-1,size:[c,Math.max(r*1.5,Math.min(n.u(.17),(a-o)*.6))],pitch:r*1.5,turns:t.turns??n.p.jawTurns??.85,r:n.rcurl(r)});if(n.band("lip",l.spine(),r,"flat","square"),n.marks.mouthCorner=[a,s],e==="double"){const h=[a-n.u(.05),s+r*.4];n.band("lip2",Ue(h,90,n.u(.035),{curl:200,radius:n.u(.032),dir:-1}),r*.8,"flat","round",{centre:!1})}e==="split"&&lf(n,t),e==="fanged"&&cf(n,t)}function cf(n,t={}){const e=Us(n),i=n.f.Y(t.y??e.lip)-n.bw*.45,s=t.count??2,r=n.bw*1,a=Ue([n.f.X(.14),i],-90,Math.max(1,n.u(.06)),{curl:45,radius:n.u(.04),dir:-1});if(n.band("lip",a,ln(r,r*.18),"flat","point",{centre:!1}),s>1){const o=Ue([n.f.X(.3),i],-98,Math.max(1,n.u(.08)),{curl:35,radius:n.u(.06),dir:1});n.band("lip",o,ln(r*1.15,r*.18),"flat","point",{centre:!1})}}function lf(n,t={}){const e=n.bw*.9,i=Math.max(e*.6,n.f.Y(t.lowerY??.055)),s=n.dissolved?n.u(.06):-n.ext,r=new oe([s,i],0).to([n.f.X(.3),i]).curl({dir:1,size:[n.u(.07),n.u(.08)],pitch:e*1.5,turns:.6,r:n.rcurl(e)});n.band("jaw",r.spine(),e,"flat","square"),n.band("jaw",Ue([n.f.X(.15),i+e*.4],90,n.u(.035),{curl:30,radius:n.u(.05),dir:-1}),ln(e,e*.2),"flat","point",{centre:!1})}function hf(n,t={}){const e=cn(t,"eye",n),i=Us(n),s=t.size??n.p.eyeSize,[r,a]=t.at??[n.p.eyeX??.27,i.eye],o=n.A(r,a,.004),c=cn(t,"pupil",n),l=n.bw*.95;let h;if(e==="chen"){const u=n.u(.32)*s,f=n.u(.17)*s,d=t.tilt??8,g=xv(o,u,f,d);n.sheet.add("eye",Ln(g));const _=d*Math.PI/180,p=[o[0]-Math.cos(_)*u*.47,o[1]-Math.sin(_)*u*.47],m=[o[0]+Math.cos(_)*u*.47,o[1]+Math.sin(_)*u*.47],x=Math.max(n.f.X(.085),(n.marks.noseHalf??0)+l*.8+(n.dissolved?n.u(.035):0)),v=Math.max(l*1.2,Math.min(n.u(.11),p[1]-n.f.Y(.37))),M=new oe(p,180).to([x,p[1]-Math.tan(_)*(p[0]-x)*.3]).turn(105,n.rc(l)).fwd(v).turn(40,n.rc(l*.6)).fwd(l*.5);n.band("eye",M.spine(),l,"flat","square");const E=new oe(m,d*.6).fwd(n.u(.08)*s).turn(-95,n.rc(l*.8)).fwd(l*.7);n.band("eye",E.spine(),l*.88,"flat","square"),h=n.u(.07)*s,n.sheet.bosses.push({shape:Dn(o,h),base:"plateau",r:h}),n.marks.eyeTop=o[1]+f*.5,n.marks.eyeOuter=m[0]+n.u(.08)*s}else if(e==="square"){const u=n.u(.2)*s,f=n.u(.155)*s,d=Math.min(u,f)*.32;n.sheet.bosses.push({shape:Ci(o,u,f,d,0),base:"ground",r:Math.min(u,f)*.5});const g=t.socket?l*.45:0;return t.socket&&n.sheet.add("eye",Ci(o,u+l*.9,f+l*.9,d+l*.45,0)),h=f*.42,n.marks.eyeTop=o[1]+f*.5+g,n.marks.eyeOuter=o[0]+u*.5,c==="slit"?n.sheet.cuts.push(Ci(o,u*.42,Math.max(n.lw*1.3,f*.1),n.lw*.6)):c==="dot"&&n.sheet.cuts.push(Dn(o,Math.max(n.lw,f*.12))),o}else{const u=e==="oval",f=n.u(u?.125:.105)*s,d=n.u(u?.09:.105)*s;n.sheet.add("eye",mo(o,f,d,u?6:0));const g=f-l*.75,_=d-l*.75;if(n.sheet.bosses.push({shape:mo(o,Math.max(g,f*.55),Math.max(_,d*.55),u?6:0),base:"plateau",r:Math.max(_,d*.55)}),h=Math.min(Math.max(g,f*.55),Math.max(_,d*.55)),t.canthus??n.p.eye!=="round"){const p=[o[0]-f*.92,o[1]-d*.2],m=new oe(p,190).fwd(Math.max(l*.6,p[0]-Math.max(n.f.X(.1),(n.marks.noseHalf??0)+l))).turn(100,n.rc(l)).fwd(Math.max(l,n.u(.06)));n.band("eye",m.spine(),l*.9,"flat","square")}n.marks.eyeTop=o[1]+d,n.marks.eyeOuter=o[0]+f}return c==="slit"?n.sheet.cuts.push(Ci(o,h*2.3,Math.max(n.lw*1.25,h*.18),n.lw*.6)):c==="dot"?n.sheet.cuts.push(Dn(o,Math.max(n.lw*.9,h*.3))):c==="ring"&&n.sheet.grooves.push({pts:cr(o,h*.6,0,360),boss:!0}),n.marks.eye=o,o}function wv(n,t={}){const e=cn(t,"brow",n);if(!e||e==="none")return;const i=n.bw*.78,s=Math.max(n.f.Y(t.y??.685),(n.marks.eyeTop??0)+i*1.15+(n.dissolved?n.u(.02):0)),r=Math.max(n.f.X(.09),(n.marks.noseHalf??0)+(n.dissolved?n.u(.04):i*.2)),a=n.f.X(t.reach??.42);if(e==="L"){const o=n.marks.eye??n.A(.27,.5),c=(n.marks.eyeTop??o[1])+i*.9,l=Math.max((n.marks.noseHalf??0)+i*.9,n.f.X(.07)),h=new oe([xe(l,o[0],.75),c],180).to([l,c]).turn(90,n.rc(i)).fwd(Math.max(i,c-o[1]+n.u(.02)));n.band("brow",h.spine(),i,"square","square"),n.marks.browTop=c+i*.5;return}else{const o=new oe([r,s],8).to([xe(r,a,.55),s+n.u(.02)],0).to([a,s+n.u(.012)],n.rc(i));e==="hooked"?o.curl({dir:1,size:[n.u(.05),n.u(.05)],pitch:i*1.5,turns:.6,r:n.rcurl(i)}):o.turn(-90,n.rc(i)).fwd(n.u(.04)),n.band("brow",o.spine(),i,"square","square"),e==="kui"&&(n.sheet.bosses.push({shape:Dn([r+i*1.4,s],i*.42),base:"plateau",r:i*.42}),n.band("brow",Ue([r,s-i*.2],200,i*.4,{curl:90,radius:i*.5,dir:1}),i*.6,"flat","round",{centre:!1}))}n.marks.browTop=s+i*.6}function Ev(n,t={}){const e=cn(t,"horn",n);if(!e||e==="none")return;const i=tc[e]||tc.c,s=t.size??n.p.hornSize??1,r=Math.max(n.f.Y(Us(n).hornRoot),(n.marks.browTop??0)+n.bw*.25+(n.dissolved?n.u(.03):0),(n.marks.eyeTop??0)+n.bw*.9),a=t.rootX??(e==="bottle"||e==="knob"||e==="t"?.17:.11),o=t.root?n.A(t.root[0],t.root[1],.004):[Math.max(n.f.X(a),n.dissolved?(n.marks.noseHalf??0)+n.u(.05):0),r],c=Math.min(n.f.Y(.985),n.H-n.bw*.15),l=n.bw*(t.width??1.3);n.marks.hornRoot=o[1];const h=i(n,{root:o,top:c,w:l,hs:s,o:t});h&&n.p.hornTip>0&&n.sheet.tips.push({shape:Rc(Do(h,Zn(h)*.7,Zn(h)),l*.62,"round","round"),lift:n.p.hornTip})}const tc={c(n,{root:t,top:e,w:i,hs:s}){const r=e-i/2,a=Math.min(Math.max(n.u(.1),i*2.3),(n.xmax(r)-t[0])*.38),o=Math.max(t[0]+i*2,Math.min(n.f.X(.46*s),n.xmax(r)-a-i*.6)),c=new oe(t,72).to([n.f.X(.17),r]).to([o,r],n.rc(i,3)).turn(-90,n.rc(i));return c.fwd(Math.max(i*.4,r-n.f.Y(.84)-i)).curl({dir:1,size:[a,a*.95],pitch:i*1.3,turns:1.1,r:n.rcurl(i)}),n.band("horn",c.spine(),vs(i,.25,.75),"flat","square")},ram(n,{root:t,top:e,w:i,hs:s,o:r}){const a=e-i/2,o=Math.min(n.f.X(.5*s),n.xmax(a)-i*.7),c=Math.max(t[1]-i*.2,n.f.Y(.73)),l=new oe(t,85).to([t[0]+i*.1,a]).to([o,a],n.rc(i,2)).turn(-90,n.rc(i));return l.fwd(Math.max(i,a-c)).curl({dir:-1,size:[Math.max(i*2.2,(o-t[0])*.58),Math.max(i*1.8,(a-c)*.62)],pitch:i*1.38,turns:r.turns??1.25,r:n.rcurl(i)}),n.band("horn",l.spine(),vs(i,.3,.8),"flat","square")},buffalo(n,{root:t,top:e,w:i,hs:s}){const r=Ja([[t[0]-i*.4,t[1]],n.A(.3,.775),n.A(.5*s,.84),[Math.min(n.f.X(.64*s),n.xmax(e)-i),e-i*.6],[Math.min(n.f.X(.58*s),n.xmax(e)-i*1.6),e-i*.15]]);return n.band("horn",r,o=>i*(1.6-1.45*Math.pow(o,1.6)),"flat","point")},bottle(n,{root:t,top:e,w:i,hs:s}){const r=t[0],a=t[1]-i*.2,o=e,c=o-a,l=Math.max(n.u(.04),i*.4)*s,h=Math.max(n.u(.1),i)*s,u=n.u(.015),f=[[0,l],[.22,l],[.45,h*.95],[.7,h],[.88,h*.75],[1,h*.35]],d=f.map(([p,m])=>[r+m+u*p,a+p*c]),g=f.map(([p,m])=>[r-m+u*p,a+p*c]).reverse(),_=pi([...d,...g],n.rc(i*.5,2),{closed:!0});return n.sheet.add("horn",Ln(n.wob(_,.05))),n.p.carving!=="none"&&n.sheet.centres.push({pts:[[r,a+c*.25],[r+u*.8,a+c*.85]],w:h*2,force:!0}),[[r,a],[r+u,o]]},t(n,{root:t,top:e,w:i,hs:s}){const r=t[0],a=n.u(.22)*s,o=Math.max(n.bw*.85,n.u(.06)),c=e-o/2;n.band("horn",[[r,t[1]],[r,c]],n.bw*.75,"flat","flat",{centre:!1});for(const l of[-1,1]){const h=new oe([r,c],l>0?0:180).fwd(a/2-o*.4).turn(l>0?-90:90,n.rc(o,1.4)).fwd(o*.9).turn(l>0?-90:90,n.rc(o*.6,1)).fwd(o*.35);n.band("horn",h.spine(),o,"flat","square",{centre:l>0})}return null},kui(n,{root:t,top:e,w:i,hs:s}){const r=e-i*.55,a=t[0]+i*.3,o=Math.min(n.f.X(.72*s),n.xmax(r)-i*1.2),c=i,l=new oe([a,r],0).to([o,r]).curl({dir:-1,size:[i*2.2,i*2.4],pitch:c*1.4,turns:.75,r:n.rcurl(c)});return n.band("horn",l.spine(),c,"square","square"),n.sheet.add("horn",Ci([a+i*.2,r-i*.15],i*1.6,i*1.3,i*.35)),n.sheet.bosses.push({shape:Dn([a+i*.35,r],i*.32),base:"plateau",r:i*.32}),n.band("horn",Ue([a-i*.5,r-i*.5],180,i*.4,{curl:140,radius:i*.45,dir:-1}),c*.8,"flat","round",{centre:!1}),n.band("horn",[t,[a+i*.2,r-i*.5]],c,"flat","flat",{centre:!1}),null},coiled(n,{root:t,top:e,w:i,hs:s}){const r=Math.min(n.u(.17)*s,(e-t[1])*.75),a=new oe(t,80).fwd(Math.max(i,e-t[1]-r*1.1-i*.5)).turn(-80,n.rc(i)).curl({dir:-1,size:[r*1.7,r*1.4],pitch:i*1.45,turns:1.9,r:n.rcurl(i)});return n.band("horn",a.spine(),vs(i*.9,.4,.6),"flat","round")},knob(n,{root:t,top:e,w:i,hs:s}){const r=n.u(.048)*s,a=e-r;return n.band("horn",[[t[0],t[1]],[t[0]+n.u(.01),a]],n.u(.05),"flat","flat",{centre:!1}),n.sheet.add("horn",Dn([t[0]+n.u(.01),a],r)),n.sheet.bosses.push({shape:Dn([t[0]+n.u(.01),a],r*.7),base:"plateau",r:r*.7}),null},antler(n,{root:t,top:e,w:i,hs:s}){const r=[Math.min(n.f.X(.4*s),n.xmax(e)-i),e-i*.4],a=Ja([t,[xe(t[0],r[0],.35),xe(t[1],r[1],.6)],r]);n.band("horn",a,ln(i,i*.5),"flat","round");const o=Zn(a);for(const c of[.38,.68]){const l=Do(a,0,o*c),h=l[l.length-1];n.band("horn",Ue(h,125,n.u(.06)*s,{curl:50,radius:n.u(.04),dir:-1}),ln(i*.7,i*.25),"flat","point",{centre:!1})}return a},crook(n,{root:t,top:e,w:i,hs:s}){const r=e-i/2,a=n.marks.eye??n.A(.27,.5),o=Math.min((n.marks.eyeOuter??a[0]+n.u(.1))+i*.1,n.f.hw-n.edgeW-i*.8),c=(n.marks.eyeTop??a[1])+i*(n.dissolved?1.2:.4),l=Math.max((n.marks.noseHalf??0)+i*1.2,n.f.X(.07)),h=new oe([o,c],90).to([o,r]).turn(90,n.rc(i)).to([l,r]);return h.curl({dir:1,size:[Math.max(i*1.6,(r-c)*.7*s),Math.max(i*1.6,(o-l)*.55)],pitch:i*1.5,turns:1.2,r:n.rcurl(i)}),n.band("horn",h.spine(),i,"square","square")},zigzag(n,{root:t,top:e,w:i,hs:s}){const r=e-i/2,a=n.f.X(.28*s),o=Math.min(n.f.X(.5*s),n.xmax(r)-i),c=new oe(t,0).to([a,t[1]]).to([a,r],n.rc(i)).to([o,r],n.rc(i)).turn(-90,n.rc(i)).fwd(n.u(.06));return n.band("horn",c.spine(),i,"flat","square")},leaf(n,{root:t,top:e,w:i,hs:s}){const r=[Math.min(n.f.X(.4*s),n.xmax(e)-i*.5),e-i*.2],a=Math.hypot(r[0]-t[0],r[1]-t[1]),o=Math.atan2(r[1]-t[1],r[0]-t[0])*180/Math.PI,c=[(t[0]+r[0])/2,(t[1]+r[1])/2];return n.sheet.add("horn",Ln(Pc(c,a,Math.max(i*1.4,a*.32),o))),n.sheet.centres.push({pts:[[xe(t[0],r[0],.15),xe(t[1],r[1],.15)],[xe(t[0],r[0],.8),xe(t[1],r[1],.8)]],w:i*1.4,force:!0}),null}},Tv=Object.keys(tc);function Av(n,t={}){let e=cn(t,"ear",n);if(e===!0&&(e="leaf"),!e||e==="none")return;const i=Math.max(n.f.X(.44),(n.marks.eyeOuter??0)+n.bw*(n.dissolved?1.2:.3)),s=n.f.Y(.56);if(i>n.xmax(s)-n.bw*1.2)return;if(e==="c"){const l=n.u(.05),h=[i+l,n.f.Y(.64)];n.band("ear",po(h,l,{start:200,sweep:250,dir:-1,shrink:.18}),n.bw*.8,"square","round");return}const r=[Math.min(i+n.u(.09),n.xmax(n.f.Y(.74))-n.bw*.4),n.f.Y(.735)],a=[i,s],o=Math.hypot(r[0]-a[0],r[1]-a[1]),c=Math.atan2(r[1]-a[1],r[0]-a[0])*180/Math.PI;n.sheet.add("ear",Ln(Pc([(a[0]+r[0])/2,(a[1]+r[1])/2],o,Math.max(n.bw*1.2,n.u(.075)),c))),n.sheet.centres.push({pts:[[xe(a[0],r[0],.2),xe(a[1],r[1],.2)],[xe(a[0],r[0],.75),xe(a[1],r[1],.75)]],w:n.u(.075),force:!0}),n.marks.earOuter=Math.max(a[0],r[0])}function Rv(n,t){const e=Math.max(n.f.X(n.p.body==="kui"?.34:.5),(n.marks.eyeOuter??0)+n.bw*.6),i=n.xmax(t)-n.edgeW-n.u(.02);return[e,i]}function Pv(n,t={}){const e=cn(t,"body",n);if(e==="none")return!1;const i=n.f.Y(t.y??(e==="kui"?.6:.62)),[s,r]=Rv(n,i),a=n.bw*(t.width??1.55);if(r-s<n.u(.26))return!1;const o=cn(t,"tail",n),c=Math.min(n.u(.17),n.H-i-a*.6),l=r-a*.5,h=[];if(e==="dissolved"){const _=xe(s,l,.48),p=n.u(.035),m=new oe([s,i],0).to([_-p,i]).turn(-90,n.rc(a)).fwd(a*.8);n.band("body0",m.spine(),a,"square","square"),h.push(["body1",_+p])}else h.push(["body",s]);const[u,f]=h[0],d=new oe([f,i],0).to([l,i]);if(o==="up"||o==="spiral"){const _=o==="spiral";d.curl({dir:1,size:[c,Math.min(n.u(.13),(r-s)*.3)],pitch:a*1.4,turns:_?1.5:.8,r:_?a*6:n.rcurl(a)})}else o==="down"?d.curl({dir:-1,size:[Math.min(n.u(.17),i-a),Math.min(n.u(.13),(r-s)*.3)],pitch:a*1.4,turns:.8,r:n.rcurl(a)}):d.fwd(Math.max(0,r-l-a*1.4));const g=n.band(u,d.spine(),vs(a,.3,.75),"square","square");if(o==="forked"){const _=g[g.length-1];n.band(u,Ue([_[0]-a*.2,_[1]+a*.3],70,n.u(.08),{curl:150,radius:n.u(.04),dir:1}),ln(a*.8,a*.4),"flat","square",{centre:!1}),n.band(u,Ue([_[0]-a*.2,_[1]-a*.3],-70,n.u(.08),{curl:150,radius:n.u(.04),dir:-1}),ln(a*.8,a*.4),"flat","square",{centre:!1})}return n.marks.body={x0:s,x1:r,xt:l,yc:i,wB:a},(t.quills??!0)&&uf(n,t),cn(t,"leg",n)&&ff(n,t),!0}function uf(n,t={}){const e=n.marks.body;if(!e)return;let i=t.count??n.p.quills;if(i===!0&&(i=3),!i)return;const s=e.yc+e.wB*.45,r=n.H-s-n.bw*.4;if(r<n.u(.04))return;const a=Math.min(n.u(.085),r*.8),o=e.x0+n.u(.08),c=e.xt-n.u(.05);if(c<=o)return;i=Math.min(i,Math.max(1,Math.floor((c-o)/n.u(.075))));const l=n.bw*.82;for(let h=0;h<i;h++){const f=[(i===1?(o+c)/2:xe(o,c,h/(i-1)))+n.rng.jitter(n.u(.008)),n.dissolved?s+n.u(.035):s-l*.3],d=Ue(f,100,a*.55,{curl:105,radius:a*.35,dir:-1});n.band(n.dissolved?"quill"+h:n.marks.body&&n.p.body==="dissolved"?"body1":"body",d,ln(l,l*.45),"flat","round",{centre:!1})}}function ff(n,t={}){const e=n.marks.body;if(!e)return;const i=n.bw*1.15,s=xe(e.x0,e.xt,t.legAt??.3),r=Math.max(n.f.Y(.1),i*1.4),a=e.yc-(n.dissolved?e.wB*.5+n.u(.035):0);if(a-r<n.u(.12))return;const o=new oe([s,a],-90).to([s-n.u(.025),xe(a,r,.5)],0).to([s,r],n.rc(i,2)),c=n.dissolved?"leg":n.p.body==="dissolved"?"body1":"body";n.band(c,o.spine(),i,"flat","square");const l=t.claw??n.p.claw??3,h=i*.75;for(let u=0;u<l;u++){const f=[s-i*.2,r+i*.25-u*h*1.05];if(f[1]<h*.6)break;n.band(c,Ue(f,180,n.u(.045+.015*(l-u)),{curl:100,radius:n.u(.026),dir:1}),ln(h,h*.3),"flat","point",{centre:!1})}n.band(c,Ue([s+i*.3,r-i*.2],-20,n.u(.025),{curl:80,radius:n.u(.02),dir:-1}),ln(h*.8,h*.3),"flat","point",{centre:!1})}function Lv(n,t={}){const e=n.bw,i=t.eyeY??.56;hf(n,{at:[.25,i],eye:n.p.eye,size:(t.eyeSize??n.p.eyeSize)*1.2});const s=n.marks.eye,r=Math.min(s[1]-n.u(.09),n.f.Y(.42)),a=n.dissolved?n.u(.06):n.u(.035),o=new oe([s[0]+n.u(.08),r],180).to([a+e,r]).curl({dir:-1,size:[Math.min(n.u(.09),s[1]-r),e*1.3],pitch:e*1.5,turns:.55,r:n.rcurl(e)});n.band("jaw",o.spine(),e,"square","square");const c=Math.max(e*.8,r-n.u(.15)),l=new oe([s[0]+n.u(.04),c],180).to([a+e*1.4,c]).curl({dir:1,size:[Math.min(n.u(.07),c-e*.6),e*1.3],pitch:e*1.5,turns:.5,r:n.rcurl(e)});n.band("jaw2",l.spine(),e*.9,"square","square"),n.marks.eyeOuter=s[0]+n.u(.06)}function Cv(n,t={}){const e=cn(t,"edge",n);if(!e||e==="none")return;const i=n.bw*.9;if(e==="scrolls"){const s=n.f.Y(.05),r=Math.min(n.f.Y(.97),(n.marks.hornRoot??n.H)-n.u(.02)),a=Math.max(n.u(.15),i*3.4),o=Math.max(2,Math.floor((r-s)/a)),c=(r-s)/o;for(let l=0;l<o;l++){const h=s+(l+.5)*c,u=n.xmax(h)-i*.7,f=Math.min(n.edgeW||n.u(.18),u-n.f.X(.4)),d=u-f,g="edge"+l,_=h+c*.5-i*.75,p=h-c*.5+i*.75,m=l%2===0,x=m?d+i*.5:u-i*.5,v=m?u-i*.5:d+i*.5,M=new oe([x,_],m?0:180).to([v,_]).turn(m?-90:90,n.rc(i)).to([v,p]).turn(m?-90:90,n.rc(i)).fwd(Math.max(i,Math.abs(v-x)*.62)).turn(m?-90:90,n.rc(i)).fwd(Math.max(i*.6,(_-p)*.42));n.band(g,M.spine(),i,"square","square")}return}if(e==="kui"){const s=Math.max((n.marks.earOuter??n.marks.eyeOuter??n.f.X(.5))+n.bw*1.2,n.f.X(.6)),r=n.f.Y(.94);n.f.Y(.2);const a=n.xmax(r)-i*.7;if(a-s<n.u(.16))return;const o=a-s,c=xe(s,a,.5),l=Math.min(i*1.25,o*.32),h=Math.max(l*2.6,n.u(.16)),u=Math.max(l*.7,n.f.Y(.06)),f=new oe([c,u+h*.8],90).to([c,r-l*.5]).curl({dir:1,size:[Math.max(l*2.2,o*.55),Math.max(l*2,n.u(.1))],pitch:l*1.4,turns:.85,r:n.rcurl(l)});n.band("sidekui",f.spine(),vs(l,.3,.75),"square","square");const d=[c,u+h*.5];n.sheet.add("sidekui",Ci(d,Math.min(o,l*2.6),h,l*.6)),n.sheet.bosses.push({shape:Dn([d[0],d[1]+h*.08],l*.55),base:"plateau",r:l*.55}),n.band("sidekui",Ue([d[0]-l*.6,u+l*.3],200,Math.max(l*.8,o*.25),{curl:110,radius:l*.8,dir:1}),l*.85,"flat","square",{centre:!1});const g=xe(u+h,r,.45);n.band("sidekui",Ue([c-l*.3,g],180,Math.max(l,o*.35),{curl:100,radius:l*.7,dir:1}),ln(l*.9,l*.35),"flat","point",{centre:!1});for(let _=0;_<2;_++)n.band("sidekui",Ue([c+l*.4,xe(g,r,.25+_*.3)],15,l*.9,{curl:100,radius:l*.5,dir:1}),ln(l*.75,l*.3),"flat","point",{centre:!1});n.marks.sideKui=s}}function Dv(n,t={}){const e=n.marks.body;if(!e)return;const i=t.count??2,s=n.bw*.75,r=n.f.Y(.3),a=e.x0+e.wB*2.6,o=e.xt;for(let c=0;c<i;c++){const l=xe(a,o,(c+.5)/i);if(l>n.xmax(r)-s*2)continue;const h=new oe([l-n.u(.04),r],0).fwd(n.u(.06)).curl({dir:c%2?1:-1,size:[n.u(.05),n.u(.05)],pitch:s*1.5,turns:.7,r:n.rcurl(s)});n.band("frag"+c,h.spine(),s,"square","square")}}const Iv=.12;function Uv(n,t){const e=n.f,i=n.dissolved?Math.max(n.u(.03),n.lw*2.2):0;return s=>{s.save(),e.apply(s),ec(s,n);for(const r of t){if(i){s.globalCompositeOperation="destination-out";for(const a of r.shapes)xs(s,a,i);s.globalCompositeOperation="source-over"}for(const a of r.shapes)xs(s,a,0)}s.restore()}}function ec(n,t){const e=t.f,i=e.H;n.beginPath(),n.moveTo(-t.ext,0),n.lineTo(e.widthAt(0),0),n.lineTo(e.widthAt(i),i),n.lineTo(-t.ext,i),n.closePath(),n.clip()}const Vr=(n,t)=>Math.abs(n)>=t?0:Math.sqrt(1-n/t*(n/t));function df(n,t){const e=t.p,i=t.f,s=t.sheet,r=e.style==="flush",a=e.relief,o=e.lineWeight,c=r?Iv:a.motif,l=e.carving||"dense",h=i.taper?L=>i.warp(L):null,u=L=>h?rf(L,h):L,f=s.islands.map(L=>({id:L.id,shapes:L.shapes.map(u)})),d=s.bosses.map(L=>({...L,shape:u(L.shape)})),g=s.tips.map(L=>({...L,shape:u(L.shape)})),_=s.cuts.map(u),p=s.grooves.map(L=>({...L,pts:h?L.pts.map(h):L.pts})),m=s.centres.map(L=>({...L,pts:h?L.pts.map(h):L.pts})),x=r?.08:Math.max(.22,Math.min(.55,c*.42)),v=r?0:e.crown||0,M=Math.max(1.5,t.bw*.45),E=v?(L,P)=>Ts.plateau(L,P)*(1-v+v*Math.min(1,L/M)):"plateau",w=Uv(t,f);if(n.raise(w,{height:c,shoulder:x,profile:E}),!r&&g.length)for(const L of g){const P=c+L.lift*Math.max(0,a.boss-c)*.7;n.raise(W=>{W.save(),i.apply(W),ec(W,t),xs(W,L.shape),W.restore()},{height:P,shoulder:Math.max(.6,t.bw*.35),profile:"plateau"})}const b=e.echoInset??1.4,C=o/2;if(r)n.sink(w,{depth:a.groove,profile:L=>Vr(L-C*1.1,C)});else if(l==="dense"){const L=b+Math.max(o*2.6,1.6);n.sink(w,{depth:a.groove,profile:P=>Math.max(Vr(P-b,C),Vr(P-L,C))})}else l==="sparse"&&n.sink(w,{depth:a.groove*.8,profile:L=>Vr(L-b,C)});const S=[];for(const L of p)L.boss||S.push(L.pts);if(l!=="none")for(const L of m){const P=L.w/2;let W;if(r?W=l==="dense"&&P>o*2.6:L.force?W=!0:l==="dense"?W=P>b*2+o*1.5||P<b-o*.9&&P>o*1.6:W=!1,!W)continue;const R=Zn(L.pts),I=Math.min(P*1.2,R*.3),D=tf(L.pts,I,I);D.length>1&&S.push(D)}S.length&&n.sink(L=>{L.save(),i.apply(L),ec(L,t);for(const P of S)Qa(L,P,o);L.restore()},{depth:a.groove,shoulder:C,profile:"u"});for(const L of d){const P=Math.max(.5,L.r??2),W=L.base==="plateau"?Math.min(.95,c/Math.max(a.boss,.001)):.3,R=r?Math.max(a.boss,c):Math.max(a.boss,c*1.2),I=Math.max(.3,Math.min(.6,P*.12));n.raise(D=>{D.save(),i.apply(D),xs(D,L.shape),D.restore()},{height:R,shoulder:P,profile:(D,z)=>{if(D<=0)return 0;const B=Math.min(1,D/z),F=Math.sqrt(1-(1-B)*(1-B));return Ts.plateau(D,I)*(W+(1-W)*F)}})}const T=p.filter(L=>L.boss);(_.length||T.length)&&n.sink(L=>{L.save(),i.apply(L);for(const P of _)xs(L,P);for(const P of T)Qa(L,P.pts,o);L.restore()},{depth:a.groove*1.4,shoulder:o*.45,profile:"u"})}const pf={nose:Mv,crest:yv,nostril:bv,jaw:Sv,fangs:cf,lowerJaw:lf,eye:hf,brow:wv,horn:Ev,ear:Av,body:Pv,quills:uf,leg:ff,kuiHead:Lv,edge:Cv,fragments:Dv},Je=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),_e=(n,t,e,i,s,r)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...r?{unit:r}:{}}),mf={style:Je(["relief","flush"],"relief","Style (V relief / IV flush)"),carving:Je(["dense","sparse","none"],"dense","Plateau line work (V-a / V-b)"),nose:Je(["ridge","plain","flange","stack","none"],"ridge","Nose"),nostril:Je(["scroll","bulb","none"],"scroll","Nostrils"),crest:Je(["lozenge","shield","cicada","hooks","none"],"lozenge","Forehead crest"),eye:Je(["chen","oval","round","square"],"chen","Eye"),eyeSize:_e(.6,1.6,.05,1,"Eye size"),eyeX:_e(.18,.36,.01,.27,"Eye x (face units)"),eyeY:_e(.3,.62,.01,.5,"Eye height"),pupil:Je(["slit","dot","ring","none"],"slit","Pupil"),brow:Je(["none","band","hooked","kui","L"],"none","Brow"),horn:Je(Tv.concat("none"),"c","Horn"),hornSize:_e(.6,1.5,.05,1,"Horn size"),hornTip:_e(0,1,.05,0,"Horn tip high relief"),ear:Je(["leaf","c","none"],"leaf","Ear (when no body)"),jaw:Je(["hooked","double","split","fanged","none"],"hooked","Jaw"),lipY:_e(.08,.36,.01,.15,"Lip height"),mouthCorner:_e(.25,.7,.01,.38,"Mouth corner x"),jawTurns:_e(.5,1.6,.05,.85,"Jaw curl turns"),body:Je(["band","kui","dissolved","none"],"band","Body"),tail:Je(["up","down","forked","spiral"],"up","Tail"),leg:{type:"bool",default:!0,label:"Leg & claw"},claw:_e(2,3,1,3,"Claw toes"),quills:_e(0,6,1,3,"Dorsal quills"),edge:Je(["none","scrolls","kui"],"none","Outer edge filler"),square:_e(0,1,.05,.55,"Squareness (云纹 → 雷纹)"),bandWidth:_e(.6,2,.05,1,"Band width"),spread:_e(.7,1.4,.05,1,"Face spread"),taper:_e(-.6,.95,.05,0,"Panel taper"),invert:{type:"bool",default:!1,label:"Inverted (lid)"},crown:_e(0,.5,.05,0,"Plateau crown (V-b)"),irregularity:_e(0,2,.1,1,"Hand irregularity"),seed:_e(0,99,1,0,"Seed"),lineWeight:_e(.3,1.6,.05,.6,"Line weight","mm"),echoInset:_e(.6,3,.05,1.4,"Contour echo inset","mm"),relief:{type:"group",label:"Relief levels",fields:{motif:_e(.2,6,.1,1.5,"Motif (L1)","mm"),boss:_e(.5,10,.1,3.4,"Boss (L2)","mm"),groove:_e(.1,1.2,.05,.45,"Groove","mm")}}},Nv={"T1-classic":{},"T2-ram":{horn:"ram",square:.65,quills:2},"T3-ox-heavy":{horn:"buffalo",eye:"round",pupil:"ring",crest:"shield",body:"none",ear:"none",jaw:"fanged",nostril:"bulb",carving:"sparse",crown:.3,hornTip:.6,bandWidth:1.25,square:.3,relief:{motif:2.4,boss:5}},"T4-bottle-horn":{horn:"bottle",body:"none",ear:"none",edge:"kui"},"T5-kui-horn":{horn:"kui",crest:"hooks",body:"none",ear:"leaf"},"T6-t-horn":{horn:"t",body:"none",ear:"none",edge:"kui",brow:"band"},"T7-dissolved":{body:"dissolved",horn:"zigzag",nose:"plain",brow:"band",square:.75,quills:2},"T8-two-kui":{body:"kui",horn:"t",nose:"flange",crest:"none",eye:"chen",quills:2,square:.7},"T9-flat-band":{style:"flush",horn:"c",lineWeight:.7,bandWidth:1.2,relief:{motif:.4,boss:1.4,groove:.45}},"T10-blade":{taper:.92,body:"none",ear:"none",horn:"c",hornSize:.8,nose:"plain",crest:"none",spread:.85},"houmuwu-frieze":{body:"kui",horn:"t",nose:"flange",crest:"none",eye:"round",pupil:"dot",eyeSize:.85,tail:"up",quills:2,leg:!0,claw:2,square:.85,bandWidth:1.15,lineWeight:1,echoInset:2,relief:{motif:2.6,boss:5,groove:.75}},"houmuwu-leg":{body:"none",horn:"c",hornSize:1,hornTip:.5,nose:"flange",crest:"none",eye:"oval",pupil:"ring",eyeSize:1.15,ear:"none",nostril:"none",jaw:"double",lipY:.24,mouthCorner:.42,jawTurns:1.15,carving:"sparse",crown:.35,square:.12,bandWidth:1.55,lineWeight:1.1,echoInset:2.4,relief:{motif:3.6,boss:7.5,groove:.8}},"fangyi-body":{body:"dissolved",horn:"ram",hornSize:1.15,nose:"none",crest:"none",nostril:"none",eye:"square",pupil:"slit",eyeSize:1.1,eyeX:.36,eyeY:.47,brow:"L",jaw:"hooked",lipY:.3,mouthCorner:.62,jawTurns:1.3,ear:"none",edge:"scrolls",square:.92,bandWidth:1.6,spread:.92,lineWeight:.55,echoInset:1.1,relief:{motif:1.6,boss:3.2,groove:.4}},"fangyi-lid":{body:"dissolved",horn:"ram",hornSize:1.1,nose:"none",crest:"none",nostril:"none",eye:"square",pupil:"slit",eyeX:.36,eyeY:.5,brow:"L",jaw:"hooked",lipY:.27,mouthCorner:.55,jawTurns:1.1,ear:"none",edge:"scrolls",invert:!0,taper:-.3,square:.92,bandWidth:1.6,spread:.95,lineWeight:.55,echoInset:1.1,relief:{motif:1.5,boss:3,groove:.4}},"zun-belly":{style:"flush",body:"dissolved",horn:"ram",hornSize:1.15,nose:"flange",crest:"none",eye:"round",pupil:"none",eyeSize:.62,eyeX:.3,eyeY:.42,jaw:"hooked",lipY:.2,mouthCorner:.45,nostril:"none",brow:"L",quills:1,leg:!1,square:.92,bandWidth:1.3,lineWeight:.55,relief:{motif:.4,boss:1.8,groove:.4}},"zun-foot":{style:"flush",body:"none",horn:"crook",nose:"flange",crest:"none",eye:"round",pupil:"none",eyeSize:.62,eyeX:.3,eyeY:.4,jaw:"hooked",lipY:.17,nostril:"none",ear:"none",edge:"scrolls",taper:.18,square:.92,bandWidth:1.3,spread:.9,lineWeight:.5,relief:{motif:.4,boss:1.6,groove:.35}},"gu-waist":{body:"none",horn:"crook",nose:"flange",crest:"none",eye:"round",pupil:"dot",eyeSize:.8,eyeX:.3,eyeY:.36,jaw:"hooked",lipY:.12,nostril:"none",ear:"none",square:.9,bandWidth:1.05,carving:"sparse",lineWeight:.45,echoInset:.9,relief:{motif:.8,boss:2,groove:.3}},"gu-foot":{style:"flush",body:"none",horn:"crook",nose:"flange",crest:"none",eye:"square",pupil:"dot",eyeSize:.85,eyeX:.33,eyeY:.47,jaw:"hooked",lipY:.2,mouthCorner:.5,jawTurns:1.2,nostril:"none",ear:"c",taper:.3,square:.95,bandWidth:1.3,lineWeight:.45,relief:{motif:.35,boss:1.6,groove:.3}}},kv={"houmuwu-frieze":{w:320,h:80},"houmuwu-leg":{w:170,h:130},"fangyi-body":{w:150,h:120},"fangyi-lid":{w:190,h:100},"zun-belly":{w:200,h:100},"zun-foot":{w:150,h:100},"gu-waist":{w:60,h:66},"gu-foot":{w:90,h:64},"T8-two-kui":{w:280,h:80},"T10-blade":{w:80,h:160}};function Fv(n){const t={...n};t.ear===!0&&(t.ear="leaf"),t.ear===!1&&(t.ear="none"),t.crest===!0&&(t.crest="lozenge"),t.crest===!1&&(t.crest="none"),t.quills===!0&&(t.quills=3),t.quills===!1&&(t.quills=0),t.relief={motif:1.5,boss:3.4,groove:.45,...t.relief||{}};for(const[e,i]of Object.entries(mf))t[e]===void 0&&i.type!=="group"&&(t[e]=i.default);return t}function gf(n){const t=pf,e=n.p;if(e.body==="kui")e.nose!=="none"&&t.nose(n,{nose:e.nose,from:.3,to:.72,width:.55}),t.kuiHead(n),t.horn(n,{rootX:.25}),t.body(n)||t.ear(n);else{t.crest(n),t.nose(n),t.nostril(n),t.jaw(n),t.eye(n),t.brow(n),t.horn(n);const i=t.body(n);i||t.ear(n),i&&e.body==="dissolved"&&t.fragments(n)}return t.edge(n),n}function Ov(n,t,e){const i=Fv(e),s=af(n,t,i);return gf(s),df(n,s),s}const zv={name:"taotie",label:"Taotie mask",schema:mf,presets:Nv,presetPlaques:kv,draw:Ov,plaque:{w:240,h:120}};function Cc(n={}){const t={};for(const[e,i]of Object.entries(n))t[e]=i.type==="group"?Cc(i.fields):i.default;return t}const wi=Math.PI/180,_f=.12,Yt=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),Gt=(n,t,e,i,s,r)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...r?{unit:r}:{}});function Tn({motif:n=1.5,boss:t=3,groove:e=.45,lineWeight:i=.55,echoInset:s=1.2,carving:r="dense"}={}){return{style:Yt(["relief","flush"],"relief","Style (V relief / IV flush)"),carving:Yt(["dense","sparse","spirals","none"],r,"Plateau line work (spirals = V-a carved plateau)"),lineWeight:Gt(.3,1.6,.05,i,"Line weight","mm"),echoInset:Gt(.5,3,.05,s,"Contour echo inset","mm"),irregularity:Gt(0,2,.1,1,"Hand irregularity"),seed:Gt(0,99,1,0,"Seed"),relief:{type:"group",label:"Relief levels",fields:{motif:Gt(.2,6,.1,n,"Motif (L1)","mm"),boss:Gt(.5,10,.1,t,"Boss (L2)","mm"),groove:Gt(.1,1.2,.05,e,"Groove","mm")}}}}function xn(n){return{style:"relief",carving:"dense",lineWeight:.55,echoInset:1.2,irregularity:1,seed:0,...n,relief:{motif:1.5,boss:3,groove:.45,...n.relief||{}}}}function kn(n,t,e){return new $e(`${n}:${e.seed|0}:${t.x.toFixed(2)},${t.y.toFixed(2)},${t.w.toFixed(2)}`)}function In(n,{rot:t=0,flip:e=!1,flipY:i=!1,unit:s}={}){const r=t===0?n.w:n.h,a=t===0?n.h:n.w,o=s??a,c=r/o,l=a/o,h=([u,f],d=[0,0])=>{const g=e?c-u:u,_=i?l-f:f;return t===0?(d[0]=n.x+g*o,d[1]=n.y+_*o):t===90?(d[0]=n.x+n.w-_*o,d[1]=n.y+g*o):(d[0]=n.x+_*o,d[1]=n.y+n.h-g*o),d};return{rect:n,rot:t,flip:e,flipY:i,unit:o,A:c,H:l,map:h,pts:u=>u.map(f=>h(f,[0,0]))}}class be{constructor(t,e,i=0,s=.012){this.x=t,this.y=e,this.h=i,this.step=s,this.pts=[[t,e]]}get at(){return[this.x,this.y]}fd(t){if(t<=0)return this;const e=Math.max(1,Math.ceil(t/this.step)),i=Math.cos(this.h*wi),s=Math.sin(this.h*wi),r=this.x,a=this.y;for(let o=1;o<=e;o++)this.pts.push([r+i*t*o/e,a+s*t*o/e]);return this.x=r+i*t,this.y=a+s*t,this}arc(t,e){if(!t)return this;const i=Math.sign(t),s=(this.h-i*90)*wi,r=this.x-Math.cos(s)*e,a=this.y-Math.sin(s)*e,o=Math.max(2,Math.ceil(Math.abs(t)*wi*e/this.step));for(let l=1;l<=o;l++){const h=s+t*wi*l/o;this.pts.push([r+Math.cos(h)*e,a+Math.sin(h)*e])}this.h+=t;const c=s+t*wi;return this.x=r+Math.cos(c)*e,this.y=a+Math.sin(c)*e,this}to(t,e){return this.h=Math.atan2(e-this.y,t-this.x)/wi,this.fd(Math.hypot(t-this.x,e-this.y))}spiral({a:t,b:e=t,d:i,dir:s=1,turns:r=1.5,r:a=.5,min:o=.02}={}){const c=Math.round(r*4);let l=t,h=e;for(let u=0;u<c;u++){const f=u%2===0?l:h;if(f<o)break;const d=Math.max(.003,Math.min(f*.4,a*i*.5));this.fd(Math.max(0,f-(u?d:0)-d)),u<c-1&&this.arc(s*90,d),u%2===1&&(l-=i,h-=i)}return this}curl(t,e,i=.35,s=1){let r=e,a=Math.abs(t);for(;a>0;){const o=Math.min(45,a);this.arc(s*o,r),r*=1-i*o/360,a-=o}return this}}function vf(n,t,e){if(!e)return n;const i=t.range(0,6.28),s=t.range(0,6.28),r=t.range(4,9),a=t.range(9,17);let o=0;const c=[n[0].slice()];for(let l=1;l<n.length;l++){const h=n[l][0]-n[l-1][0],u=n[l][1]-n[l-1][1],f=Math.hypot(h,u)||1e-9;o+=f;const d=e*(.6*Math.sin(o*r+i)+.4*Math.sin(o*a+s));c.push([n[l][0]-u/f*d,n[l][1]+h/f*d])}return c}function Rs(n,t,e=!1){n.beginPath();for(let i=0;i<t.length;i++)i?n.lineTo(t[i][0],t[i][1]):n.moveTo(t[i][0],t[i][1]);e&&n.closePath()}function Bv(n,t,e,i,s,r){r=Math.max(0,Math.min(r,i/2,s/2)),n.moveTo(t+r,e),n.arcTo(t+i,e,t+i,e+s,r),n.arcTo(t+i,e+s,t,e+s,r),n.arcTo(t,e+s,t,e,r),n.arcTo(t,e,t+i,e,r),n.closePath()}function lr(n,t,e=0){switch(t.kind){case"band":{if(n.lineJoin="round",typeof t.w=="function"){n.lineCap="round";const i=t.pts.length;let s=0;const r=[0];for(let a=1;a<i;a++)r.push(s+=Math.hypot(t.pts[a][0]-t.pts[a-1][0],t.pts[a][1]-t.pts[a-1][1]));for(let a=1;a<i;a++)n.lineWidth=Math.max(.05,t.w(r[a]/(s||1))+e*2),n.beginPath(),n.moveTo(t.pts[a-1][0],t.pts[a-1][1]),n.lineTo(t.pts[a][0],t.pts[a][1]),n.stroke();return}n.lineCap=t.cap==="flat"?"butt":t.cap==="square"?"square":"round",n.lineWidth=t.w+e*2,Rs(n,t.pts),n.stroke();return}case"poly":Rs(n,t.pts,!0),n.fill(),e&&(n.lineWidth=e*2,n.lineJoin="round",n.stroke());return;case"circle":n.beginPath(),n.arc(t.c[0],t.c[1],t.r+e,0,Math.PI*2),n.fill();return;case"rrect":{n.save(),n.translate(t.c[0],t.c[1]),t.rot&&n.rotate(t.rot),n.beginPath(),Bv(n,-t.w/2-e,-t.h/2-e,t.w+2*e,t.h+2*e,t.r+e),n.fill(),n.restore();return}case"ellipse":n.beginPath(),n.ellipse(t.c[0],t.c[1],t.rx+e,t.ry+e,t.rot||0,0,Math.PI*2),n.fill();return}}function nc(n,t,e,i="round"){n.lineCap=i,n.lineJoin="round",n.lineWidth=e,Rs(n,t),n.stroke()}class Un{constructor(t,{rng:e,wobble:i=0}={}){this.f=t,this.rng=e||new $e(1),this.amp=i,this.plateau=[],this.holes=[],this.bosses=[],this.lines=[],this.cuts=[],this.ground=[]}P(t){return this.f.pts(this.amp?vf(t,this.rng,this.amp):t)}u(t){return t*this.f.unit}band(t,e,i="round"){return t.length>1&&this.plateau.push({kind:"band",pts:this.P(t),w:this.u(e),cap:i}),this}taper(t,e,i,s=0){const r=this.u(e),a=this.u(i);return t.length>1&&this.plateau.push({kind:"band",pts:this.P(t),w:o=>o<s?r:r+(a-r)*((o-s)/(1-s))}),this}poly(t){return this.plateau.push({kind:"poly",pts:this.f.pts(t)}),this}circle(t,e){return this.plateau.push({kind:"circle",c:this.f.map(t),r:this.u(e)}),this}rrect(t,e,i,s){return this.plateau.push(this._rrect(t,e,i,s)),this}hole(t){return this.holes.push(t),this}_rrect(t,e,i,s){const r=this.f.rot!==0;return{kind:"rrect",c:this.f.map(t),w:this.u(r?i:e),h:this.u(r?e:i),r:this.u(s)}}_ellipse(t,e,i){const s=this.f.rot!==0;return{kind:"ellipse",c:this.f.map(t),rx:this.u(s?i:e),ry:this.u(s?e:i),rot:0}}boss(t,e,{kind:i="round",base:s="plateau",pupil:r="none",aspect:a=1.35}={}){const o=i==="square"?this._rrect(t,e*2*1.08,e*2,e*.55):i==="oval"?this._ellipse(t,e*a,e):{kind:"circle",c:this.f.map(t),r:this.u(e)};if(this.bosses.push({shape:o,r:this.u(e),base:s}),r==="slit"){const c=e*.95;this.cuts.push({kind:"band",pts:this.f.pts([[t[0]-c/2,t[1]],[t[0]+c/2,t[1]]]),w:Math.max(.3,this.u(e*.16)),cap:"round"})}else r==="dot"?this.cuts.push({kind:"circle",c:this.f.map(t),r:Math.max(.25,this.u(e*.3))}):r==="ring"&&(this.ringCuts=this.ringCuts||[],this.ringCuts.push({c:this.f.map(t),r:this.u(e*.62)}));return this}line(t,e){return t.length>1&&this.lines.push({pts:this.P(t),w:e}),this}groundLine(t,e){return t.length>1&&this.ground.push({pts:this.P(t),w:e}),this}}function xf(n,t){return e=>{e.save(),t&&(t(e),e.clip());for(const i of n.plateau)lr(e,i);if(n.holes.length){e.globalCompositeOperation="destination-out";for(const i of n.holes)lr(e,i);e.globalCompositeOperation="source-over"}e.restore()}}const _i=n=>t=>{t.beginPath(),t.rect(n.x,n.y,n.w,n.h)},Wr=(n,t)=>Math.abs(n)>=t?0:Math.sqrt(1-n/t*(n/t));function Jn(n,t,e,{clip:i,echo:s=!0}={}){var f;const r=e.style==="flush",a=e.relief,o=e.lineWeight,c=r?_f:a.motif,l=e.carving||"dense",h=xf(t,i),u=d=>g=>{g.save(),i&&(i(g),g.clip()),d(g),g.restore()};if(t.plateau.length){const d=r?.08:Math.max(.2,Math.min(.55,c*.4));n.raise(h,{height:c,shoulder:d,profile:"plateau"});const g=e.echoInset??1.2,_=o/2;if(s)if(r)n.sink(h,{depth:a.groove,profile:p=>Wr(p-_*1.1,_)});else if(l==="dense"){const p=g+Math.max(o*2.6,1.5);n.sink(h,{depth:a.groove,profile:m=>Math.max(Wr(m-g,_),Wr(m-p,_))})}else l==="sparse"?n.sink(h,{depth:a.groove*.8,profile:p=>Wr(p-g,_)}):l==="spirals"&&Ac(n,h,{pitch:e.spiralPitch??Math.max(.7,o*2),depth:a.groove,echo:1,eyes:0,line:.48},{margin:Math.max(.35,o*.7),level:c})}t.lines.length&&n.sink(u(d=>{for(const g of t.lines)nc(d,g.pts,g.w??o)}),{depth:a.groove,shoulder:o/2,profile:"u"}),t.ground.length&&n.sink(u(d=>{for(const g of t.ground)nc(d,g.pts,g.w??o)}),{depth:a.groove,shoulder:o/2,profile:"u"});for(const d of t.bosses){const g=Math.max(.5,d.r),_=d.base==="plateau"?Math.min(.95,c/Math.max(a.boss,.001)):.25,p=r?Math.max(a.boss,c):Math.max(a.boss,c*1.2),m=Math.max(.3,Math.min(.6,g*.12));n.raise(x=>lr(x,d.shape),{height:p,shoulder:g,profile:(x,v)=>{if(x<=0)return 0;const M=Math.min(1,x/v);return Ts.plateau(x,m)*(_+(1-_)*Math.sqrt(1-(1-M)*(1-M)))}})}return(t.cuts.length||(f=t.ringCuts)!=null&&f.length)&&n.sink(d=>{for(const g of t.cuts)lr(d,g);for(const g of t.ringCuts||[])d.lineWidth=o,d.beginPath(),d.arc(g.c[0],g.c[1],g.r,0,Math.PI*2),d.stroke()},{depth:a.groove*1.4,shoulder:o*.45,profile:"u"}),t}const Gv=Object.freeze(Object.defineProperty({__proto__:null,E:Yt,FLUSH_LIFT:_f,Pen:be,R:Gt,Sheet:Un,drawShape:lr,makeFrame:In,motifRng:kn,plateauPaint:xf,polyPath:Rs,rectClip:_i,reliefSchema:Tn,renderSheet:Jn,strokeLine:nc,withRelief:xn,wobble:vf},Symbol.toStringTag,{value:"Module"})),Hv={kind:Yt(["bowstrings","border","step"],"bowstrings","Kind"),count:Gt(1,4,1,2,"Ribs"),width:Gt(.6,5,.1,1.5,"Rib width","mm"),height:Gt(.3,2.5,.05,.8,"Rib height","mm"),spacing:Gt(2,12,.1,4.5,"Spacing (centre to centre)","mm"),profile:Yt(["round","flat"],"round","Rib top"),vertical:{type:"bool",default:!1,label:"Vertical"}},Vv={"two-bowstrings":{},"three-bowstrings":{count:3,spacing:4},"single-bowstring":{count:1},monumental:{count:2,width:3.2,height:1.6,spacing:9,profile:"flat"},"gu-waist":{count:3,width:1.6,height:1.1,spacing:3.4},border:{kind:"border",width:4,height:.9},step:{kind:"step",width:5,height:1.2}},Wv={border:{w:160,h:14},step:{w:160,h:14}},qv=n=>t=>t<=0?0:Math.min(1,Math.sqrt(Math.min(1,t/Math.min(.45,n*.3)))),Xv=(n,t)=>n<=0?0:Math.sqrt(1-(1-Math.min(1,n/t))**2);function jv(n,t,e){const i=e.vertical||t.h>t.w*1.5,s=i?t.w:t.h,r=i?t.x+t.w/2:t.y+t.h/2,a=(h,u,f)=>{h.beginPath(),i?h.rect(u-f/2,t.y,f,t.h):h.rect(t.x,u-f/2,t.w,f),h.fill()};if(e.kind==="border"){const h=Math.min(e.width,s);n.raise(u=>a(u,r,h),{height:e.height,profile:qv(h)});return}if(e.kind==="step"){const h=Math.min(e.width,s);n.raise(u=>a(u,r,h),{height:e.height,profile:(u,f)=>u<=0?0:Math.min(1,u/Math.min(.6,h*.25))});return}const o=e.count|0,c=Math.min(e.spacing,o>1?(s-e.width)/(o-1):e.spacing),l=r-c*(o-1)/2;n.raise(h=>{for(let u=0;u<o;u++)a(h,l+u*c,e.width)},{height:e.height,shoulder:e.profile==="flat"?Math.min(.4,e.width*.3):e.width/2,profile:e.profile==="flat"?"plateau":Xv})}const Yv={name:"bands",label:"Bowstrings & borders",schema:Hv,presets:Vv,presetPlaques:Wv,draw:jv,symmetric:!1,ground:!1,plaque:{w:160,h:16}},$v={arrangement:Yt(["pair","single"],"pair","Arrangement"),facing:Yt(["right","left"],"right","Facing (single)"),crest:Yt(["hook","t","none"],"hook","Crest"),tail:Yt(["hook","fork"],"hook","Tail"),eye:Yt(["round","chen"],"round","Eye"),length:Gt(1.3,2.2,.05,1.7,"Length : height"),bandWidth:Gt(.1,.22,.01,.15,"Band width (× H)"),centreGap:Gt(0,15,.5,1.5,"Gap at centre line","mm"),...Tn({motif:1.2,boss:2.4,groove:.36,lineWeight:.45,echoInset:.8,carving:"sparse"})},Kv={pair:{},single:{arrangement:"single"},"t-crest":{crest:"t",tail:"hook"},flush:{style:"flush",relief:{motif:.4,boss:1.2,groove:.35}}},Zv={single:{w:40,h:22}};function Jv(n,t,e){const i=Math.min(t,e.length),s=Math.max(0,t-i-.02),r=_=>s+_*i,a=e.bandWidth,o=.46,c=[];for(let _=0;_<=48;_++){const p=_/48*Math.PI*2,m=Math.cos(p)>0,x=(m?.15:.2)*i,v=Math.sin(p)>0?.23:.2;c.push([r(.58)+Math.cos(p)*x,o+Math.sin(p)*v-(m?0:.03*Math.cos(p))])}n.poly(c);const l=[r(.8),.72],h=.16;n.band([[r(.68),o+.08],[l[0]-.03,l[1]-.05]],.18),n.circle(l,h);const u=new be(l[0]+h*.7,l[1]+.02,-5,.006).fd(Math.max(.05,.1*i)).arc(-120,.05);if(n.taper(u.pts,.14,.03,.3),n.boss(l,.075,{kind:e.eye==="chen"?"oval":"round",pupil:"dot",base:"plateau",aspect:1.4}),e.crest==="hook"){const _=new be(l[0]-.03,l[1]+h*.8,105,.006).fd(.07).arc(90,.04).fd(.02);n.taper(_.pts,a*.9,a*.45,.4)}else if(e.crest==="t"){n.band([[l[0],l[1]+h*.8],[l[0],.96-a*.4]],a*.7,"flat");const _=new be(l[0]-.08,.96-a*.4-.04,90,.006).fd(.02).arc(-90,.02).fd(.12).arc(-90,.02).fd(.02);n.band(_.pts,a*.7)}const f=new be(r(.7),o+.1,188,.006).fd(.24*i).arc(70,.07).fd(.04).arc(110,.035);n.taper(f.pts,a*1.1,a*.5,.55);const d=new be(r(.44),o,192,.006).fd(.2*i).arc(62,.16).fd(Math.max(.02,o-.3)).arc(150,.04);if(n.taper(d.pts,a*1.5,a*.55,.35),e.tail==="fork"){const _=new be(r(.4),o+.02,195,.006).fd(.16*i).arc(-50,.05).fd(.02);n.taper(_.pts,a*.9,a*.4,.5)}const g=new be(r(.56),o-.12,-95,.006).fd(o-.12-.12).arc(95,.04).fd(.08).arc(-110,.03);return n.taper(g.pts,a*.75,a*.4,.6),n}function Qv(n,t,e){const i=xn(e),s=i.arrangement==="pair",r=s?Math.min(i.centreGap,t.w*.1):0,a=s?{x:t.x,y:t.y,w:t.w/2-r/2,h:t.h}:t,o=In(a,{flip:!s&&i.facing==="left"}),c=new Un(o,{rng:kn("bird",t,i),wobble:.003*i.irregularity});return Jv(c,o.A,i),Jn(n,c,i,{clip:_i(s?{...t,w:t.w/2}:t)}),c}const tx={name:"bird",label:"Bird (Shang)",schema:$v,presets:Kv,presetPlaques:Zv,draw:Qv,symmetric:n=>n.arrangement!=="single",facing:!0,plaque:{w:80,h:22},groundOptions:(n,t)=>({pitch:Math.max(.8,Math.min(2,t.h*.05))})},ex={orient:Yt(["right","left","up","down"],"right","Head toward"),facing:Yt(["auto","right","left"],"auto","Facing (set by friezes)"),length:Gt(2,4,.05,3,"Length : width"),chevrons:Gt(2,6,1,4,"Chevrons"),eyeSize:Gt(.6,1.4,.05,1,"Eye size"),legs:{type:"bool",default:!0,label:"Leg hooks"},concave:Gt(0,.3,.01,.12,"Side concavity"),...Tn({motif:1.2,boss:2.4,groove:.38,lineWeight:.45,echoInset:.8,carving:"sparse"})},nx={standard:{},"row-unit":{orient:"right",length:2.6},"blade-fill":{orient:"down",length:3.2,legs:!1,chevrons:5},slender:{length:3.6,chevrons:6,eyeSize:.85},flush:{style:"flush",relief:{motif:.4,boss:1.2,groove:.35}}};function Mf(n,t,e){const i=Math.min(t,e.length),s=(t-i)/2,r=s+i,a=.5,o=.3,c=r-o,l=.13*e.eyeSize;n.rrect([r-o/2,a],o,.7,.1);const h=Math.min(.5-l-.01,.33);n.circle([r-o*.5,a+h],l*1.12),n.circle([r-o*.5,a-h],l*1.12),n.boss([r-o*.5,a+h],l,{kind:"round",base:"plateau",pupil:"none"}),n.boss([r-o*.5,a-h],l,{kind:"round",base:"plateau",pupil:"none"});const u=[],f=.42,d=24;for(let p=0;p<=d;p++){const m=p/d,x=c+.01-m*(c+.01-s),v=f*(1-m)*(1-e.concave*Math.sin(Math.PI*m))+.012;u.push([x,a+v])}for(let p=d;p>=0;p--){const m=p/d,x=c+.01-m*(c+.01-s),v=f*(1-m)*(1-e.concave*Math.sin(Math.PI*m))+.012;u.push([x,a-v])}n.poly(u);const g=c-.04-s;n.line([[c-.1,a],[s+g*.12,a]]);const _=e.chevrons|0;for(let p=0;p<_;p++){const m=.12+.7*(p+.5)/_,x=c-.04-m*g,v=f*(1-m)*(1-e.concave*Math.sin(Math.PI*m))*.62,M=Math.min(.2,v*.9);n.line([[x-M,a+v],[x,a],[x-M,a-v]])}if(n.line([[c-.02,a+.3],[c-.02,a-.3]]),e.legs&&g>1)for(const p of[1,-1]){const m=new be(c-.32,a+p*(f*.8),p*120,.006).fd(.06).arc(p*70,.03);n.taper(m.pts,.08,.03,.3)}return n}const ix={right:0,left:0,up:90,down:-90};function sx(n,t,e){const i=xn(e);let s=i.orient;(s==="right"||s==="left")&&(i.facing==="left"||i.facing==="right")&&(s=i.facing);const r=In(t,{rot:ix[s],flip:s==="left"}),a=new Un(r,{rng:kn("cicada",t,i),wobble:.003*i.irregularity});return Mf(a,r.A,i),Jn(n,a,i,{clip:_i(t)}),a}function rx(n,t){return{pitch:Math.max(.8,Math.min(2.2,Math.min(t.w,t.h)*.06))}}const ox={name:"cicada",label:"Cicada",schema:ex,presets:nx,draw:sx,groundOptions:rx,symmetric:!1,facing:!0,plaque:{w:90,h:30}},ax={direction:Yt(["rising","hanging"],"rising","Direction"),shape:Yt(["triangle","ogive"],"ogive","Outline"),concave:Gt(0,.2,.01,.05,"Side concavity"),border:Yt(["band","lines","none"],"band","Border"),borderLines:Gt(1,5,1,3,"Contour lines"),borderWidth:Gt(.8,6,.1,2,"Border band width","mm"),fill:Yt(["mask","cicada","leiwen"],"mask","Fill"),maskHeight:Gt(.25,.75,.01,.48,"Mask height (of blade)"),eye:Yt(["round","square","chen","none"],"round","Mask eye"),pupil:Yt(["dot","slit","none"],"dot","Pupil"),pitch:Gt(.6,3,.05,1.1,"Leiwen pitch","mm"),leiwenTop:Gt(.3,1,.01,1,"Leiwen up to (of blade); contour lines above"),...Tn({motif:1.1,boss:2.2,groove:.35,lineWeight:.45,echoInset:.8,carving:"sparse"})},cx={"rising-mask":{},"hanging-mask":{direction:"hanging"},"rising-cicada":{fill:"cicada"},"leiwen-only":{fill:"leiwen",border:"lines",borderLines:2},"gu-trumpet":{shape:"ogive",border:"lines",borderLines:4,fill:"mask",maskHeight:.26,style:"flush",eye:"round",pupil:"none",leiwenTop:.6,pitch:.9,lineWeight:.4,relief:{motif:.35,boss:.9,groove:.3}},"zun-neck":{shape:"ogive",border:"lines",borderLines:3,fill:"mask",maskHeight:.5,style:"flush",eye:"none",pupil:"none",leiwenTop:.62,pitch:1.1,lineWeight:.5,relief:{motif:.4,boss:1.2,groove:.35}}},lx={"gu-trumpet":{w:34,h:130},"zun-neck":{w:60,h:100}};function hx(n,t,e){return e>=1?0:n.shape==="ogive"?t/2*Math.sqrt(1-e*e)*(1-.42*e)*(1-n.concave*Math.sin(Math.PI*e)):t/2*(1-e)*(1-n.concave*Math.sin(Math.PI*e))}function yf(n,t){const e=n.x+n.w/2,i=n.w,s=n.h,r=t.direction==="hanging";return{cx:e,W:i,Hh:s,Y:c=>r?n.y+n.h-c*s:n.y+c*s,hw:c=>hx(t,i,c),hanging:r}}function Ys(n,t,e=80){const i=[];for(let s=0;s<=e;s++){const r=s/e,a=n.hw(r)-t;if(a<=0){i.push([n.cx,n.Y(r)]);break}i.push([n.cx-a,n.Y(r)])}return i}function ux(n,t,e,i=0){const s=xn(e),r=yf(t,s),a=Ys(r,i),o=a.map(([c,l])=>[2*r.cx-c,l]).reverse();Rs(n,a.concat(o),!0),n.fill()}function fx(n,t,e,i,s,r){const a=M=>Math.max(.5,t.hw(Math.min(.999,(r+M*s)/t.Hh))-i),o=([M,E])=>[t.cx-M*a(E),t.Y((r+E*s)/t.Hh)],c=M=>M.map(o),l=a(0),h=Math.max(.8,Math.min(l*.2,s*.11)),u=(M,E,w)=>new be(M,E,w,.008);n.band([o([0,.12]),o([0,.66])].map(M=>[M[0]-n.f.rect.x,M[1]-n.f.rect.y]),h*1.1/n.f.unit,"round");const f=u(.02,.1,0).fd(.64).arc(90,.08).fd(.06).arc(90,.05);n.band(ui(n,c(f.pts)),h/n.f.unit);const d=.38,g=.46,_=Math.min(l*.2,s*.12),p=o([g,d]);n.plateau.push({kind:"ellipse",c:p,rx:_*1.9,ry:_*1.35,rot:0}),e.eye==="none"?n.lines.push({pts:Array.from({length:25},(M,E)=>[p[0]+Math.cos(E/24*Math.PI*2)*_*.8,p[1]+Math.sin(E/24*Math.PI*2)*_*.8])}):n.bosses.push({shape:e.eye==="square"?{kind:"rrect",c:p,w:_*2.2,h:_*2,r:_*.55}:{kind:"circle",c:p,r:_},r:_,base:"plateau"}),e.pupil==="dot"&&n.cuts.push({kind:"circle",c:p,r:Math.max(.25,_*.3)}),e.pupil==="slit"&&n.cuts.push({kind:"band",pts:[[p[0]-_*.5,p[1]],[p[0]+_*.5,p[1]]],w:Math.max(.3,_*.18),cap:"round"});const m=u(g-.3,d+.02,180).fd(.06).arc(90,.05).fd(.04);n.band(ui(n,c(m.pts)),h*.75/n.f.unit);const x=u(.26,.58,90).fd(.16).arc(-90,.12).fd(.2).arc(-90,.1).fd(.06).arc(-90,.06).fd(.04);n.band(ui(n,c(x.pts)),h/n.f.unit);const v=u(.92,.28,90).fd(.2).arc(90,.08).fd(.1);return n.band(ui(n,c(v.pts)),h*.8/n.f.unit),{top:r+s*1.02}}function ui(n,t){return t.map(([e,i])=>[e-n.f.rect.x,i-n.f.rect.y])}function dx(n,t,e){const i=xn(e),s=yf(t,i),r=In(t,{unit:1}),a=new Un(r,{rng:kn("blade",t,i),wobble:.04*i.irregularity}),o={x:t.x,y:t.y,w:t.w/2,h:t.h},c=i.lineWeight;let l=0;if(i.border==="band"){const g=Math.min(i.borderWidth,t.w*.12);a.band(ui(a,Ys(s,g/2)),g,"flat"),l=g+Math.max(.8,i.pitch*.6)}else if(i.border==="lines"){const g=i.borderLines|0,_=Math.max(c*2.2,i.pitch);for(let p=0;p<g;p++)a.groundLine(ui(a,Ys(s,c*.8+p*_)),c);l=c*.8+(g-1)*_+_*.9}if(i.leiwenTop<1&&i.border!=="none"){const g=Math.max(c*2.2,i.pitch),_=i.leiwenTop;for(let m=l+c*.5;m<t.w/2;m+=g){const x=Ys(s,m).filter(([,v])=>(s.hanging?s.Y(0)-v:v-s.Y(0))>=_*s.Hh);if(x.length>1)a.groundLine(ui(a,x),c);else break}const p=s.hw(_)-l;p>0&&a.groundLine(ui(a,[[s.cx-p,s.Y(_)-(s.hanging?-1:1)*g*.5],[s.cx+.4,s.Y(_)-(s.hanging?-1:1)*g*.5]]),c)}const h=Math.max(1,l*.6)+.5,u=t.h-h-l;if(i.fill==="mask")fx(a,s,i,l+.4,Math.max(4,u*i.maskHeight),h);else if(i.fill==="cicada"){const g=s.hw(h/s.Hh)-l-.4,_=u*.8,p={x:s.cx-g,y:s.hanging?t.y+t.h-h-_:t.y+h,w:g*2,h:_},m=In(p,{rot:s.hanging?90:-90}),x=new Un(m,{rng:a.rng,wobble:.003*i.irregularity});Mf(x,m.A,{length:m.A*.97,chevrons:5,eyeSize:1,legs:!1,concave:.06});for(const v of["plateau","bosses","lines","cuts"])a[v].push(...x[v])}return Jn(n,a,i,{clip:g=>{g.beginPath(),g.rect(o.x,o.y,o.w+.01,o.h)}}),Co(n,{rect:o,include:g=>{const _=Ys(s,l).filter(([,p])=>i.leiwenTop>=1||(s.hanging?s.Y(0)-p:p-s.Y(0))<=i.leiwenTop*s.Hh-Math.max(c*2.2,i.pitch));Rs(g,_.concat([[s.cx+.5,_[_.length-1][1]],[s.cx+.5,s.Y(0)]]),!0),g.fill()},avoid:"raised",margin:Math.max(.4,i.pitch*.4)},{pitch:i.pitch,depth:i.relief.groove,echo:i.border==="lines"?0:1}),a}function px(n){return{pitch:n.pitch}}const mx={name:"blade",label:"Rising / hanging blade",schema:ax,presets:cx,presetPlaques:lx,draw:dx,outline:ux,groundOptions:px,ground:!1,plaque:{w:50,h:120}},gx={layout:Yt(["lattice","grid","row","single"],"lattice","Layout"),side:Gt(8,30,.5,20,"Lozenge side / spacing","mm"),angle:Gt(45,75,1,64,"Lattice angle","°"),lines:Yt(["double","single"],"double","Lattice lines"),ridge:Gt(.6,2.5,.05,1.1,"Ridge width","mm"),ridgeHeight:Gt(.3,2,.05,.9,"Ridge height","mm"),nipple:Gt(1.5,6,.1,2.6,"Nipple base radius","mm"),nippleHeight:Gt(1,8,.1,3.4,"Nipple height","mm"),shape:Yt(["pointed","dome"],"pointed","Nipple shape"),rows:Gt(1,4,1,3,"Rows (grid)"),...Tn({motif:1,boss:3.4,groove:.4,lineWeight:.5})},_x={lattice:{},"single-lines":{lines:"single",angle:60,side:14},"gui-belly":{side:20,nipple:3.4,nippleHeight:5.5,ridge:1.3},"fangding-frame":{layout:"grid",side:14,rows:3,nipple:3.2,nippleHeight:3.6,shape:"dome"},row:{layout:"row",side:12,nipple:3,nippleHeight:3.2,shape:"dome"},single:{layout:"single",nipple:4,nippleHeight:5}},vx={row:{w:140,h:18},single:{w:30,h:30},"fangding-frame":{w:160,h:46}};function xx(n){return n==="dome"?(t,e)=>t<=0?0:Math.sqrt(1-(1-Math.min(1,t/e))**2):(t,e)=>{if(t<=0)return 0;const i=Math.min(1,t/e),s=Math.min(1,t/(e*.12));return Math.min(s,.25+.75*Math.pow(i,.85))*(1-.08*Math.pow(i,6))}}function qr(n,t,e){const i=e.nipple;n.raise(s=>{for(const[r,a]of t)s.beginPath(),s.arc(r,a,i,0,Math.PI*2),s.fill()},{height:e.nippleHeight,shoulder:i,profile:xx(e.shape)})}function Mx(n,t,e){const i=xn(e),s=t.x+t.w/2,r=t.y+t.h/2;if(i.layout==="single")return qr(n,[[s,r]],i);if(i.layout==="row"){const _=t.w>=t.h,p=_?t.w:t.h,m=Math.max(1,Math.round(p/i.side)),x=[];for(let v=0;v<m;v++){const M=(v+.5)/m;x.push(_?[t.x+M*t.w,r]:[s,t.y+M*t.h])}return qr(n,x,i)}if(i.layout==="grid"){const _=i.side,p=Math.max(1,Math.round(t.w/_)),m=Math.max(1,Math.min(i.rows|0,Math.round(t.h/_))),x=t.w/p,v=t.h/m,M=[];for(let E=0;E<m;E++){const w=E%2?.5:0;for(let b=0;b<p-(w?1:0);b++)M.push([t.x+(b+.5+w)*x,t.y+(E+.5)*v])}return qr(n,M,i)}const a=i.angle*Math.PI/180,o=Math.sin(a),c=Math.cos(a),l=i.side*Math.sin(Math.PI-2*a)||i.side,h=Math.hypot(t.w,t.h),u=Math.ceil(h/l)+1,f=i.ridge*1.15;n.raise(_=>{_.save(),_.beginPath(),_.rect(t.x,t.y,t.w,t.h),_.clip(),_.lineWidth=i.ridge,_.lineCap="butt";const p=i.lines==="double"?[-f/2,f/2]:[0];for(let m=-u;m<=u;m++)for(const x of p){const v=(m+.5)*l+x,M=s+v*o,E=r-v*c;_.beginPath(),_.moveTo(M-c*h,E-o*h),_.lineTo(M+c*h,E+o*h),_.stroke();const w=s+v*o,b=r+v*c;_.beginPath(),_.moveTo(w-c*h,b+o*h),_.lineTo(w+c*h,b-o*h),_.stroke()}_.restore()},{height:i.ridgeHeight,profile:"ridge"});const d=[],g=i.nipple+i.ridge;for(let _=-u;_<=u;_++)for(let p=-u;p<=u;p++){const m=_*l,x=p*l,v=s+(m+x)/(2*o),M=r+(x-m)/(2*c);v-g<t.x||v+g>t.x+t.w||M-g<t.y||M+g>t.y+t.h||d.push([v,M])}qr(n,d,i)}const yx={name:"boss",label:"Bosses / boss lattice",schema:gx,presets:_x,presetPlaques:vx,draw:Mx,symmetric:!1,plaque:{w:120,h:80},groundOptions:n=>({pitch:Math.max(.8,Math.min(1.8,n.side*.075))})},bx={eyes:Gt(1,12,1,4,"Eyes"),eye:Yt(["chen","round"],"chen","Eye"),eyeSize:Gt(.6,1.4,.05,1,"Eye size"),slope:Gt(30,60,1,45,"Diagonal angle","°"),rib:Gt(.06,.2,.01,.1,"Rib width (× H)"),...Tn({motif:1.1,boss:2.2,groove:.35,lineWeight:.45,echoInset:.8,carving:"none"})},Sx={chen:{},round:{eye:"round",eyes:5},flush:{style:"flush",relief:{motif:.35,boss:1.1,groove:.35}}};function wx(n,t,e){const i=xn(e),s=In(t),r=s.A,a=new Un(s,{rng:kn("eyeband",t,i),wobble:.003*i.irregularity}),o=Math.max(1,i.eyes|0),c=r/o,l=i.rib,h=1/Math.tan(i.slope*Math.PI/180),u=.17*i.eyeSize,f=i.eye==="chen"?u*1.6:u;for(let _=0;_<o;_++){const p=(_+.5)*c;i.eye==="chen"?(a.plateau.push({kind:"ellipse",c:s.map([p,.5]),rx:s.unit*f*1.15,ry:s.unit*u*1.35,rot:0}),a.band([[p-f*1.1,.5],[p-f*1.5,.5],[p-f*1.5,.36]],l*.9),a.band([[p+f*1.1,.5],[p+f*1.5,.5],[p+f*1.5,.36]],l*.9)):a.circle([p,.5],u*1.45),a.boss([p,.5],u,{kind:i.eye==="chen"?"oval":"round",aspect:1.5,pupil:"dot",base:"plateau"})}const d=.94,g=.06;for(let _=0;_<=o;_++){const p=_*c,m=Math.min(h*(d-g),c/2-f*1.6);_>0&&a.band([[p-m,d],[p-.02,g]],l,"flat"),_<o&&a.band([[p+.02,g],[p+m,d]],l,"flat")}return Jn(n,a,i,{clip:_i(t)}),a}const Ex={name:"eyeband",label:"Eye-and-diagonal band",schema:bx,presets:Sx,draw:wx,symmetric:!1,plaque:{w:180,h:18},groundOptions:(n,t)=>({pitch:Math.max(.7,Math.min(1.6,t.h*.06))})},ic=(n,t)=>typeof n.symmetric=="function"?n.symmetric(t):n.symmetric!==!1;function pr(n,t,e,i={},{preset:s,ground:r={},margin:a=.6}={}){var h;const o=Ls(t),c=hr(o,i,s),l=ic(o,c);if(o.draw(n,e,c),r!==!1&&o.ground!==!1){const u=l?{x:e.x,y:e.y,w:e.w/2,h:e.h}:e;n.fillGround({...((h=o.groundOptions)==null?void 0:h.call(o,c,e))||{},...r},{rect:u,margin:a})}return l&&n.mirrorX(e),c}function wh(n){return typeof n=="string"?{motif:n}:n}function fi(n,t,e,i,s,r){var w;if(typeof e=="string"||e&&typeof e.draw=="function"){const b=i,C=s||{},S=r||{},T=t.w/b;for(let L=0;L<b;L++)pr(n,e,{x:t.x+L*T,y:t.y,w:T,h:t.h},C,S);return{slots:[]}}const a={unit:"kui",count:2,facing:"centre",gap:0,centre:null,params:{},preset:void 0,ground:{},margin:.6,...e||{}},o=(Array.isArray(a.unit)?a.unit:[a.unit]).map(wh),c=Math.max(1,a.count|0),l=[];for(let b=0;b<c;b++)l.push(o[b%o.length]);const h=a.facing==="centre",u=h&&c%2===1?(c-1)/2:-1;u>=0&&(l[u]=a.centre?wh(a.centre):null);const f=a.gap*(c-1);let d=0,g=0;const _=l.map(b=>{const C=b==null?void 0:b.w;if(C==null)return g++,null;const S=C<=1?C*(t.w-f):C;return d+=S,S}),p=g?Math.max(0,t.w-f-d)/g:0,m=[];let x=t.x;for(let b=0;b<c;b++){const C=_[b]??p;m.push({rect:{x,y:t.y,w:C,h:t.h},spec:l[b],i:b}),x+=C+a.gap}const v=t.x+t.w/2;let M=null;for(const b of m){if(!b.spec)continue;const C=Ls(b.spec.motif),S=h?b.rect.x+b.rect.w/2<v-1e-6?"right":b.i===u?null:"left":a.facing;if(h&&S==="left")continue;const T=hr(C,{...a.params,...b.spec.params||{},...S?{facing:S,arrangement:"single"}:{}},b.spec.preset??a.preset);h&&b.i===u&&!ic(C,T)&&(M={m:C,p:T,rect:b.rect,snap:Tx(n,b.rect)}),C.draw(n,b.rect,T),ic(C,T)&&!(h&&b.i===u)&&n.mirrorX(b.rect)}const E=h?{...t,w:t.w/2}:t;if(a.ground!==!1){const b=l.find(Boolean),C=b?Ls(b.motif):null,S=C?hr(C,a.params,b.preset??a.preset):{};n.fillGround({...((w=C==null?void 0:C.groundOptions)==null?void 0:w.call(C,S,t))||{},...a.ground},{rect:E,margin:a.margin})}return h&&n.mirrorX(t),M&&(Ax(n,M.snap),M.m.draw(n,M.rect,M.p)),{slots:m}}function Tx(n,t){const{cols:e,ppmm:i}=n,s=Math.max(0,Math.floor(t.x*i)),r=Math.min(e,Math.ceil((t.x+t.w)*i)),a=Math.max(0,Math.floor(t.y*i)),o=Math.min(n.rows,Math.ceil((t.y+t.h)*i)),c=r-s,l=new Float32Array(c*(o-a)),h=new Float32Array(c*(o-a));for(let u=a;u<o;u++)for(let f=s;f<r;f++)l[(u-a)*c+f-s]=n.field[u*e+f],h[(u-a)*c+f-s]=n.groove[u*e+f];return{x0:s,x1:r,y0:a,y1:o,w:c,f:l,g:h,after:null}}function Ax(n,t){const{cols:e}=n;for(let i=t.y0;i<t.y1;i++)for(let s=t.x0;s<t.x1;s++){const r=i*e+s,a=(i-t.y0)*t.w+s-t.x0;n.field[r]>t.f[a]+.03&&(n.field[r]=t.f[a],n.groove[r]=t.g[a])}}function Rx(n,t,e="kui",i={}){return fi(n,t,{...i,unit:e,count:2,facing:"centre"})}function bf(n,t,{count:e=2,width:i=1.5,height:s=.8,spacing:r,profile:a="ridge",vertical:o=!1}={}){const c=o?t.w:t.h,l=r??Math.min(c/Math.max(1,e),i*3),h=l*(e-1),u=(o?t.x+t.w/2:t.y+t.h/2)-h/2;n.raise(f=>{for(let d=0;d<e;d++){const g=u+d*l;f.beginPath(),o?f.rect(g-i/2,t.y,i,t.h):f.rect(t.x,g-i/2,t.w,i),f.fill()}},{height:s,profile:a,...a==="plateau"?{shoulder:Math.min(.4,i*.3)}:{}})}function xa(n){if(!n||n.kind==="none")return 0;if(n.h!=null)return n.h;if(n.kind==="bowstrings"){const t=n.width??1.5;return(n.count??2)*(n.spacing??t*3)+(n.pad??1)}return n.kind==="line"?(n.width??1.4)+(n.pad??1.5):4}function Ma(n,t,e){!e||e.kind==="none"||e.kind==="plain"||(e.kind==="bowstrings"?bf(n,t,e):e.kind==="line"&&go(n,{x:t.x,y:t.y+t.h/2,w:t.w,h:0},{width:e.width??1.4,height:e.height??.7,sides:"b"}))}function cs(n,t,e,{separator:i={kind:"bowstrings",count:2},edges:s=!1,inset:r=.8,ground:a={}}={}){const o=e.map((_,p)=>p<e.length-1?_.sep??i:null),c=s?xa(i):0;let l=2*c;for(let _=0;_<e.length;_++)l+=xa(o[_])+(e[_].h??0);const h=e.reduce((_,p)=>_+(p.h==null?p.weight??1:0),0),u=Math.max(0,t.h-l);let f=t.y+t.h;const d=[],g={};s&&(Ma(n,{x:t.x,y:f-c,w:t.w,h:c},i),f-=c);for(let _=0;_<e.length;_++){const p=e[_],m=p.h??u*(p.weight??1)/(h||1),x={x:t.x,y:f-m,w:t.w,h:m},v={x:x.x,y:x.y+(o[_]||s&&_===e.length-1?r:0),w:x.w,h:0};if(v.h=x.y+x.h-(_>0||s?r:0)-v.y,d.push(v),p.name&&(g[p.name]=v),p.draw?p.draw(n,v):p.frieze?fi(n,v,{ground:a,...p.frieze}):p.blades?Sf(n,v,p.blades):p.motif&&pr(n,p.motif,v,p.params||{},{preset:p.preset,ground:p.ground??a}),f-=m,o[_]){const M=xa(o[_]);Ma(n,{x:t.x,y:f-M,w:t.w,h:M},o[_]),f-=M}}return s&&Ma(n,{x:t.x,y:f-c,w:t.w,h:c},i),{rows:d,byName:g}}function Sf(n,t,{count:e=4,direction:i="rising",gap:s=0,params:r={},preset:a,between:o="plain",ground:c={}}={}){var u;const l=(t.w-s*(e-1))/e,h=[];for(let f=0;f<e;f++){const d={x:t.x+f*(l+s),y:t.y,w:l,h:t.h};h.push(d),pr(n,"blade",d,{...r,direction:i},{preset:a,ground:c})}if(o==="leiwen"){const f=Ls("blade"),d=hr(f,{...r,direction:i},a),g=n.mask(_=>{for(const p of h)f.outline(_,p,d)});n.fillGround({...((u=f.groundOptions)==null?void 0:u.call(f,d,t))||{},...c},{rect:t,avoid:g,margin:.6})}return h}function wf(n,t,{width:e=20,top:i,bottom:s,sides:r="kui",sideHeads:a="down",line:o=!0,lineWidth:c=1.4,lineHeight:l=.7,params:h={},preset:u,bosses:f={},ground:d={}}={}){const g=typeof e=="number"?{t:e,b:e,l:e,r:e}:{t:20,b:20,l:20,r:20,...e},_={x:t.x+g.l,y:t.y+g.b,w:t.w-g.l-g.r,h:t.h-g.t-g.b},p=(x,v)=>{if(x!=="plain"){if(x==="bosses")return sc(n,v,f);fi(n,v,{unit:"kui",count:2,facing:"centre",params:h,preset:u,ground:d,...x||{}})}},m=o?c*1.4:0;g.t&&p(i,{x:_.x,y:_.y+_.h+m*.5,w:_.w,h:g.t-m}),g.b&&p(s??i,{x:_.x,y:t.y+m*.5,w:_.w,h:g.b-m});for(const x of["l","r"]){if(!g[x])continue;const v=x==="l"?{x:t.x+m*.5,y:t.y+m*.5,w:g.l-m,h:t.h-m}:{x:t.x+t.w-g.r+m*.5,y:t.y+m*.5,w:g.r-m,h:t.h-m};if(r!=="plain"){if(r==="bosses"){sc(n,v,f);continue}pr(n,"kui",v,{...h,arrangement:"single",orient:a,facing:x==="l"?"right":"left"},{preset:u,ground:d})}}return o&&(go(n,t,{width:c,height:l,sides:"tblr"}),go(n,_,{width:c,height:l,sides:"tblr"})),_}function sc(n,t,{radius:e,height:i,spacing:s,rows:r}={}){const a=Math.min(t.w,t.h),o=r??Math.max(1,Math.round(a/(s??a))),c=s??a/o,l=e??c*.28,h=i??l*.9,u=Math.max(1,Math.floor(t.w/c)),f=Math.max(1,Math.floor(t.h/c)),d=t.w/u,g=t.h/f;n.raise(_=>{for(let p=0;p<u;p++)for(let m=0;m<f;m++)_.beginPath(),_.arc(t.x+(p+.5)*d,t.y+(m+.5)*g,l,0,Math.PI*2),_.fill()},{height:h,profile:(_,p)=>Math.pow(Math.min(1,_/p),.8),shoulder:l})}function Px(n,t){const e={};let i=n.y;for(const s of t)e[s.name]={x:n.x,y:i,w:n.w,h:s.h},i+=s.h;return e}function Lx(n,t){const e=typeof t=="number"?{l:t,r:t,t,b:t}:{l:0,r:0,t:0,b:0,...t};return{x:n.x+e.l,y:n.y+e.b,w:n.w-e.l-e.r,h:n.h-e.t-e.b}}function Cx(n,t,e,{count:i,radius:s=4,height:r=3}={}){const a=i??Math.max(1,Math.floor(Math.hypot(e[0]-t[0],e[1]-t[1])/(s*3)));n.raise(o=>{for(let c=0;c<a;c++){const l=a===1?.5:(c+.5)/a;o.beginPath(),o.arc(t[0]+(e[0]-t[0])*l,t[1]+(e[1]-t[1])*l,s,0,Math.PI*2),o.fill()}},{height:r,profile:"dome"})}function go(n,t,{width:e=1.2,height:i=.6,sides:s="tb"}={}){n.raise(r=>{r.lineWidth=e,r.lineCap="butt",r.beginPath(),s.includes("b")&&(r.moveTo(t.x,t.y),r.lineTo(t.x+t.w,t.y)),s.includes("t")&&(r.moveTo(t.x,t.y+t.h),r.lineTo(t.x+t.w,t.y+t.h)),s.includes("l")&&(r.moveTo(t.x,t.y),r.lineTo(t.x,t.y+t.h)),s.includes("r")&&(r.moveTo(t.x+t.w,t.y),r.lineTo(t.x+t.w,t.y+t.h)),r.stroke()},{height:i,profile:"ridge"})}const Ef=["kui-frieze","bird-frieze","cicada-row","whorl-kui","eye-band","neck-belly","blade-row","houmuwu-wall","boss-belly","fangyi-face"],Dx={layout:Yt(Ef,"neck-belly","Layout"),style:Yt(["relief","flush"],"relief","Style (V relief / IV flush)"),fit:{type:"bool",default:!0,label:"Keep natural proportions"}},Ix=Object.fromEntries(Ef.map(n=>[n,{layout:n}])),Tf={"kui-frieze":{w:200,h:34},"bird-frieze":{w:160,h:26},"cicada-row":{w:180,h:22},"whorl-kui":{w:220,h:26},"eye-band":{w:180,h:30},"neck-belly":{w:200,h:150},"blade-row":{w:170,h:150},"houmuwu-wall":{w:240,h:118},"boss-belly":{w:180,h:120},"fangyi-face":{w:150,h:170}},ya={kind:"bowstrings",count:2,width:1.4,height:.8,spacing:3.6};function Ux(n,t){const e=Tf[t];if(!e)return n;const i=Math.min(n.w/e.w,n.h/e.h),s=e.w*i,r=e.h*i;return{x:n.x+(n.w-s)/2,y:n.y+(n.h-r)/2,w:s,h:r}}function Nx(n,t,e){const i=e.fit===!1?t:Ux(t,e.layout),s={style:e.style};switch(e.layout){case"kui-frieze":return fi(n,i,{unit:"kui",count:2,facing:"centre",params:s});case"bird-frieze":return fi(n,i,{unit:"bird",count:4,facing:"centre",gap:2,params:s});case"cicada-row":return fi(n,i,{unit:{motif:"cicada",params:{length:2.8}},count:6,facing:"centre",gap:3,params:s});case"whorl-kui":{const r={motif:"whorl",w:i.h*.98};return fi(n,i,{unit:[r,{motif:"kui",params:{quills:1,crest:"hook"}}],count:5,facing:"centre",centre:r,gap:1.5,params:s})}case"eye-band":return cs(n,i,[{motif:"eyeband",params:{...s,eyes:4}}],{separator:ya,edges:!0});case"neck-belly":return cs(n,i,[{weight:.2,frieze:{unit:"kui",count:2,facing:"centre",params:s}},{weight:.62,motif:"taotie",preset:"T1-classic",params:s},{weight:.18,frieze:{unit:"bird",count:4,facing:"centre",gap:2,params:s}}],{separator:ya});case"blade-row":return cs(n,i,[{weight:.8,blades:{count:4,direction:"rising",gap:3,params:s}},{weight:.2,frieze:{unit:{motif:"cicada",params:{length:2.8}},count:6,facing:"centre",gap:3,params:s}}],{separator:{kind:"bowstrings",count:2,width:1.3,height:.8,spacing:3.2},edges:!1});case"houmuwu-wall":{const r=i.h*.2,a=i.w*.14;return wf(n,i,{width:{t:r,b:r,l:a,r:a},top:{unit:"kui",count:2,facing:"centre",params:{quills:2,tail:"forked",marks:"c-marks",square:.9,...s},ground:{pitch:1.3}},sides:"kui",sideHeads:"down",params:{...s,quills:1,crest:"hook"},ground:{pitch:1.3}})}case"boss-belly":return cs(n,i,[{weight:.18,motif:"eyeband",params:{...s,eyes:4}},{weight:.82,motif:"boss",params:s}],{separator:ya,edges:!0});case"fangyi-face":return cs(n,i,[{weight:.17,frieze:{unit:"kui",count:2,facing:"centre",params:{...s,eye:"square",pupil:"slit",centreGap:6}}},{weight:.64,motif:"taotie",preset:"fangyi-body",params:s},{weight:.19,frieze:{unit:"kui",count:2,facing:"centre",params:{...s,eye:"square",pupil:"slit",centreGap:6}}}],{separator:{kind:"line",width:1.2,height:.7}})}return null}const kx={name:"frieze",label:"Friezes & registers (composed)",schema:Dx,presets:Ix,presetPlaques:Tf,draw:Nx,symmetric:!1,ground:!1,plaque:{w:200,h:150}},Fx={arrangement:Yt(["pair","single"],"pair","Arrangement"),facing:Yt(["right","left"],"right","Facing (single)"),orient:Yt(["horizontal","up","down"],"horizontal","Orientation"),head:Yt(["gaping","beaked","trunked"],"gaping","Head"),turned:{type:"bool",default:!1,label:"Head turned back"},tail:Yt(["up","down","forked"],"up","Tail (forked = 歧尾)"),crest:Yt(["t","bottle","hook","none"],"t","Crest"),eye:Yt(["round","square","chen"],"round","Eye"),pupil:Yt(["dot","slit","none"],"dot","Pupil"),eyeSize:Gt(.6,1.5,.05,1,"Eye size"),quills:Gt(0,4,1,2,"Dorsal quills"),leg:{type:"bool",default:!0,label:"Leg & claw"},bandWidth:Gt(.12,.32,.01,.23,"Band width (× H)"),square:Gt(0,1,.05,.7,"Squareness"),marks:Yt(["none","c-marks"],"none","Body marks"),centreGap:Gt(0,20,.5,1.5,"Gap at centre line","mm"),...Tn({motif:1.4,boss:2.8,groove:.4,lineWeight:.5,echoInset:1,carving:"sparse"})},Ox={"k1-tail-up":{},"k2-tail-down":{tail:"down",crest:"hook"},"k3-trunked":{head:"trunked",crest:"none",quills:1},"k4-beaked":{head:"beaked",crest:"hook",eye:"round"},"carved-plateau":{carving:"spirals",bandWidth:.27,square:.9},"turned-back":{turned:!0,crest:"none",quills:1},single:{arrangement:"single"},"vertical-head-up":{arrangement:"single",orient:"up",quills:1,crest:"hook"},flush:{style:"flush",lineWeight:.55,relief:{motif:.4,boss:1.5,groove:.4}},"fangyi-band":{eye:"square",pupil:"slit",eyeSize:1.15,crest:"t",quills:1,square:.9,bandWidth:.27,carving:"spirals",lineWeight:.5,echoInset:.95,relief:{motif:1.3,boss:2.6,groove:.38}},forked:{tail:"forked",quills:3},houmuwu:{tail:"forked",eye:"round",pupil:"dot",crest:"t",quills:2,square:.92,bandWidth:.2,marks:"c-marks",lineWeight:1,echoInset:2,centreGap:6,relief:{motif:3,boss:6,groove:.8}}},zx={single:{w:100,h:24},"vertical-head-up":{w:26,h:110},houmuwu:{w:330,h:80}};function Bx(n,t,e){const i=e.bandWidth,s=e.square,r=(G=1)=>i*G*(.55-.42*s),a=G=>t-G,o=!!e.turned,c=e.head==="trunked",l=.14*e.eyeSize,h=o?.62:1,u=c?.16:0,f=a(o?.86:u),d=o?.4:0,g=o?-1:1,_=([G,K])=>[f-g*G*h,d+K*h],p=G=>G.map(_),m=(G,K,Q)=>new be(G,K,Q,.01),x=G=>p(G.map(([K,Q])=>[-K,Q])),v=.56,M=.4,E=.5,w=.54;n.rrect(_([E,w]),v*h,M*h,r(1.1)*h+.02);const b=w-M/2,C=E-v/2,S=i*.8*h;if(e.head==="beaked"){const G=m(-C-.02,w-.06,0).fd(C-.06).arc(-70,.09).arc(-80,.05);n.taper(x(G.pts),i*1.25*h,i*.2*h,.3)}else if(c){const G=m(-C-.04,b+S*.5,0).fd(C+u-.14).arc(90,.1).fd(.3).arc(90,.08).fd(.04).arc(90,.05);n.taper(x(G.pts),S,S*.6,.65)}else{const G=m(-C-.04,b+S*.5,0).fd(C-.12).arc(90,.075).fd(.1).arc(90,.055).fd(.02);n.taper(x(G.pts),S,S*.6,.7)}if(e.head!=="beaked"){const Q=m(-.38,b+.02,-90).fd(Math.max(.02,b-.13-r())).arc(90,r()).fd(Math.max(.05,.18)).arc(-90,.04).fd(.01).arc(-90,.03);n.taper(x(Q.pts),S*.85,S*.5,.75)}else{const G=m(-.3,b+.02,-90).fd(.08).arc(90,.04).fd(.06).arc(-90,.03);n.taper(x(G.pts),S*.7,S*.35,.6)}const T=i*.52*h,L=w+M/2,P=Math.max(.08,(.97-d)/h-L);if(e.crest==="t"){const G=L+P-T/h*.5-.01,K=m(-E,L-.02,90).fd(Math.max(.02,G-L-.02));n.band(x(K.pts),T,"flat");const Q=Math.max(0,Math.min(.03,G-.03-T/h-.04-L)),nt=m(-E-.15,G-Q-.03,90).fd(Q).arc(-90,.03).fd(.24).arc(-90,.03).fd(Q);n.band(x(nt.pts),T)}else if(e.crest==="bottle"){const G=m(-E,L-.02,90).fd(P*.35);n.band(x(G.pts),T,"flat"),n.rrect(_([E,L+P*.62]),.22,P*.62,.06)}else if(e.crest==="hook"){const G=m(-E-.06,L-.02,90).fd(P*.3).arc(-90,P*.35).fd(.12).arc(-90,.04).fd(.01);n.taper(x(G.pts),T,T*.55,.6)}const W=e.eye==="square"?"square":e.eye==="chen"?"oval":"round";if(n.boss(_([E,w]),l*h,{kind:W,pupil:e.pupil,base:"plateau",aspect:1.45}),e.eye==="chen"){const G=_([E,w]),K=l*1.45*h;n.line([[G[0]+g*K*.9,G[1]],[G[0]+g*K*1.35,G[1]-.04*h],[G[0]+g*K*1.35,G[1]-.09*h]]),n.line([[G[0]-g*K*.9,G[1]],[G[0]-g*K*1.4,G[1]+.03*h]])}const R=o?.34:.45,I=.42,D=I*.5+i*.5+.02,z=a(o?.2:E+.1),B=new be(z,R,180,.01);if(o){const G=new be(a(.2),R,90,.01).fd(.3);n.band(G.pts,i*.9)}B.fd(Math.max(.05,z-D));const F=r(1.2),X=i*.82+.07,tt=s>.5;if(e.tail!=="down"?(B.arc(-90,F),tt?B.spiral({a:.95-R-i*.5-F,b:I,d:X,dir:-1,turns:1.75,r:1.6-s}):B.fd(.12).curl(330,.19,.55,-1)):(B.arc(90,F),tt?B.spiral({a:R-.05-i*.5-F,b:I,d:X,dir:1,turns:1.75,r:1.6-s}):B.fd(.08).curl(330,.17,.55,1)),n.taper(B.pts,i,i*.62,.5),e.tail==="forked"){const G=new be(D+i*.9,R-i*.3,250,.008).fd(Math.max(.05,R-i*.5-.2)).arc(100,.06).fd(.05).arc(110,.035);n.taper(G.pts,i*.8,i*.35,.4)}if(e.marks==="c-marks"){const G=Math.floor((z-D-.3)/(i*1.3));for(let K=0;K<G;K++){const Q=z-.3-K*i*1.3,nt=i*.22,rt=[];for(let ct=60;ct<=300;ct+=20)rt.push([Q+Math.cos(ct*Math.PI/180)*nt,R+Math.sin(ct*Math.PI/180)*nt]);n.line(rt)}}const J=e.quills|0,U=a(o?1.25:E+.4),Y=Math.max(.2,U-D-I*.5-.2);for(let G=0;G<J;G++){const K=U-(J===1?Y*.4:Y*G/Math.max(1,J-1)),Q=new be(K,R+i*.3,118,.008).fd(.12+i*.3).arc(70,.05);n.taper(Q.pts,i*.55,i*.2,.2)}if(e.leg){const G=a(o?.72:E+.5),K=.17,Q=r(.9),nt=new be(G,R,-86,.01).fd(Math.max(.05,R-K-Q)).arc(86,Q).fd(.07).arc(-100,.04);n.taper(nt.pts,i*.78,i*.4,.6);const rt=new be(G+Q*.6,K-i*.25,-30,.008).fd(.04).arc(-80,.025);n.taper(rt.pts,i*.38,i*.16,.3);const ct=new be(G-i*.2,K+.02,200,.008).fd(.05).arc(80,.025);n.taper(ct.pts,i*.4,i*.15,.3)}return n}function Gx(n,t,e){const i=xn(e),s=i.arrangement==="pair",r=s?Math.min(i.centreGap,t.w*.1):0,a=s?{x:t.x,y:t.y,w:t.w/2-r/2,h:t.h}:t,o=i.orient==="up"?90:i.orient==="down"?-90:0,c=o===0&&!s&&i.facing==="left",l=o===90?i.facing==="left":o===-90?i.facing!=="left":!1,h=In(a,{rot:o,flip:c,flipY:l}),u=kn("kui",t,i),f=new Un(h,{rng:u,wobble:.004*i.irregularity});return Bx(f,h.A,i),Jn(n,f,i,{clip:_i(s?{...t,w:t.w/2}:t)}),f}function Hx(n,t){const e=n.orient==="horizontal"||!n.orient?t.h:t.w;return{pitch:Math.max(.9,Math.min(2.6,e*.035))}}const Vx={name:"kui",label:"Kui dragon",schema:Fx,presets:Ox,presetPlaques:zx,draw:Gx,groundOptions:Hx,symmetric:n=>n.arrangement!=="single",facing:!0,plaque:{w:200,h:44}},Wx={pitch:{type:"range",min:.6,max:3,step:.05,default:1.3,label:"Pitch",unit:"mm"},line:{type:"range",min:.3,max:.7,step:.02,default:.5,label:"Groove : pitch"},cellMin:{type:"range",min:3,max:8,step:.1,default:4.2,label:"Cell min (× pitch)"},cellMax:{type:"range",min:4,max:12,step:.1,default:7.8,label:"Cell max (× pitch)"},roundness:{type:"range",min:0,max:1,step:.05,default:.15,label:"Roundness"},jitter:{type:"range",min:0,max:.3,step:.01,default:.08,label:"Jitter"},pairs:{type:"range",min:0,max:1,step:.05,default:.75,label:"S-pairs"},hand:{type:"enum",options:["alternate","random","left","right"],default:"alternate",label:"Handedness"},eyes:{type:"range",min:0,max:1,step:.05,default:0,label:"Eyed centres"},echo:{type:"range",min:0,max:3,step:1,default:0,label:"Contour echoes"},follow:{type:"range",min:0,max:1,step:.05,default:1,label:"Follow contours"},mode:{type:"enum",options:["sunk","thread"],default:"sunk",label:"Mode"},depth:{type:"range",min:.1,max:1.2,step:.05,default:.45,label:"Depth",unit:"mm"},demo:{type:"enum",options:["none","blobs"],default:"none",label:"Dummy motif"},secondary:{type:"bool",default:!1,label:"Fill plateau tops"}},qx={fine:{pitch:1,depth:.35},standard:{},monumental:{pitch:2.4,depth:.9,jitter:.1},"thread-relief":{mode:"thread",depth:.35,pitch:1.4,line:.42},cloud:{roundness:.85,pitch:1.3,pairs:.9},leftover:{demo:"blobs",pitch:1.1,echo:1,secondary:!0}};function Xx(n){const t=n.cellMin*n.pitch;return{pitch:n.pitch,line:n.line,cell:[t,Math.max(t,n.cellMax*n.pitch)],roundness:n.roundness,jitter:n.jitter,pairs:n.pairs,hand:n.hand,eyes:n.eyes,echo:n.echo,follow:n.follow,mode:n.mode,depth:n.depth}}function jx(n){const t=s=>n.x+s*n.w,e=s=>n.y+s*n.h,i=Math.min(n.w,n.h);return s=>{const r=.075*i;s.save(),s.lineWidth=r,s.lineCap="round",s.lineJoin="round",s.beginPath();const a=.06*i;s.moveTo(t(.36),e(.78)),s.arcTo(t(.1),e(.78),t(.1),e(.5),a),s.arcTo(t(.1),e(.3),t(.3),e(.3),a),s.lineTo(t(.3),e(.3)),s.lineTo(t(.3),e(.48)),s.stroke(),s.restore(),s.beginPath(),s.ellipse(t(.56),e(.62),.13*n.w,.12*n.h,-.25,0,Math.PI*2),s.fill(),s.beginPath(),s.moveTo(t(.74),e(.08)),s.lineTo(t(.94),e(.08)),s.lineTo(t(.86),e(.6)),s.closePath(),s.fill(),s.beginPath(),s.arc(t(.48),e(.2),.07*i,0,Math.PI*2),s.fill()}}function Yx(n,t,e){const i=Xx(e);if(e.demo==="blobs"){const s=jx(t),r=Math.max(1.2,e.pitch*1.3);n.raise(s,{height:r,shoulder:.45}),n.fillGround(i,{rect:t,avoid:"raised",margin:e.pitch*.5}),e.secondary&&Ac(n,s,{...i,echo:1,eyes:0,mode:"sunk",depth:Math.min(e.depth,.4)},{margin:e.pitch*.5,level:r});return}n.fillGround(i,{rect:t,avoid:"raised",margin:e.pitch*.5})}const $x={name:"leiwen",label:"Leiwen ground",schema:Wx,presets:qx,draw:Yx,symmetric:!1,ground:!1,plaque:{w:120,h:80}},Kx={scale:Gt(2,8,.1,3.6,"Scale width","mm"),open:Yt(["down","up"],"down","Scales open"),body:{type:"bool",default:!0,label:"Raised body band"},...Tn({motif:1.2,boss:2,groove:.38,lineWeight:.45,carving:"none"})},Zx={standard:{},fine:{scale:2.6},"handle-band":{scale:3,open:"up"}};function Jx(n,t,e){const i=xn(e),r=i.style==="flush"?.12:i.relief.motif;i.body&&n.raise(l=>{l.beginPath(),l.rect(t.x,t.y,t.w,t.h),l.fill()},{height:r,shoulder:Math.min(.5,r*.4)});const a=i.scale,o=a*.62,c=i.open==="down"?1:-1;n.sink(l=>{l.save(),l.beginPath(),l.rect(t.x+.6,t.y+.6,t.w-1.2,t.h-1.2),l.clip(),l.lineWidth=i.lineWeight,l.lineCap="round";const h=Math.ceil(t.h/o)+1;for(let u=0;u<h;u++){const f=t.y+u*o,d=u%2*a/2;for(let g=t.x-a+d;g<t.x+t.w+a;g+=a)l.beginPath(),l.arc(g+a/2,f,a/2-i.lineWeight*.3,c>0?Math.PI:0,c>0?2*Math.PI:Math.PI),l.stroke()}l.restore()},{depth:i.relief.groove,shoulder:i.lineWeight/2,profile:"u"})}const Qx={name:"scales",label:"Scale band",schema:Kx,presets:Zx,draw:Jx,symmetric:!1,ground:!1,plaque:{w:120,h:24}},tM={facing:Yt(["right","left"],"right","Facing"),segments:Gt(3,9,1,6,"Segments"),bend:Gt(-.25,.25,.01,.1,"Bend"),girth:Gt(.35,.7,.01,.5,"Girth (× H)"),...Tn({motif:1.2,boss:2,groove:.38,lineWeight:.5,echoInset:.8,carving:"none"})},eM={standard:{},straight:{bend:0,segments:7},flush:{style:"flush",relief:{motif:.35,boss:1,groove:.35}}};function nM(n,t,e){const i=xn(e),s=In(t,{flip:i.facing==="left"}),r=new Un(s,{rng:kn("silkworm",t,i),wobble:.003*i.irregularity}),a=s.A,o=i.girth,c=o*.55,l=o*.5+.04,h=a-c*2-.02,u=_=>.5-i.bend*Math.sin(Math.PI*_)+i.bend*.5,f=[];for(let _=0;_<=60;_++){const p=_/60;f.push([l+(h-l)*p,u(p)])}r.taper(f,o*.75,o,0);const d=[a-c-.02,u(1)+.02];r.circle(d,c),r.boss([d[0]+c*.25,d[1]+c*.35],c*.22,{kind:"round",pupil:"none",base:"plateau"}),r.boss([d[0]+c*.25,d[1]-c*.35],c*.22,{kind:"round",pupil:"none",base:"plateau"});const g=i.segments|0;for(let _=1;_<=g;_++){const p=_/(g+1),m=l+(h-l)*p,x=o*(.75+.25*p)/2*.9;r.line([[m-.03,u(p)+x],[m+.03,u(p)],[m-.03,u(p)-x]])}return r.line([[d[0]-c*.95,d[1]+c*.7],[d[0]-c*.95,d[1]-c*.7]]),Jn(n,r,i,{clip:_i(t)}),r}const iM={name:"silkworm",label:"Silkworm",schema:tM,presets:eM,draw:nM,symmetric:!1,facing:!0,plaque:{w:60,h:18}},sM={form:Yt(["sinuous","coiled"],"sinuous","Form"),facing:Yt(["right","left"],"right","Facing"),waves:Gt(.5,3,.25,1.5,"Waves"),amplitude:Gt(.05,.3,.01,.18,"Amplitude (× H)"),bandWidth:Gt(.15,.4,.01,.26,"Body width (× H)"),marks:Yt(["c-hooks","scales","none"],"c-hooks","Body marks"),...Tn({motif:1.2,boss:2.2,groove:.36,lineWeight:.45,echoInset:.8,carving:"sparse"})},rM={sinuous:{},coiled:{form:"coiled",marks:"none"},flush:{style:"flush",relief:{motif:.35,boss:1.1,groove:.35}}},oM={coiled:{w:50,h:50}};function aM(n,t,e){const i=xn(e),s=In(t,{flip:i.facing==="left"}),r=new Un(s,{rng:kn("snake",t,i),wobble:.003*i.irregularity}),a=i.bandWidth;let o,c,l;if(i.form==="coiled"){const p=s.A/2,m=new be(p+.44,.5,90,.006).curl(560,.44,.55,1);o=m.pts,c=m.at,l=m.h}else{o=[];const p=.08,m=s.A-.42;for(let x=0;x<=120;x++){const v=x/120;o.push([p+(m-p)*v,.5+i.amplitude*Math.sin(v*i.waves*Math.PI*2)*Math.min(1,v*4)])}c=o[o.length-1],l=0}r.taper(o,a*.3,a,0);const h=l*Math.PI/180,u=Math.cos(h),f=Math.sin(h),d=.34,g=.24,_=(p,m)=>[c[0]+u*p-f*m,c[1]+f*p+u*m];r.poly([_(-.04,g*.55),_(d*.55,g),_(d,g*.25),_(d*1.06,0),_(d,-g*.25),_(d*.55,-g),_(-.04,-g*.55)]);for(const p of[1,-1])r.boss(_(d*.5,p*g*.55),.06,{kind:"round",pupil:"none",base:"plateau"});if(i.marks!=="none"&&i.form==="sinuous")for(let p=8;p<o.length-10;p+=9){const[m,x]=o[p],v=a*.24,M=[];if(i.marks==="c-hooks")for(let E=0;E<=10;E++){const w=Math.PI*(.35+1.3*E/10);M.push([m+Math.cos(w)*v,x+Math.sin(w)*v])}else for(let E=0;E<=10;E++){const w=Math.PI*(1+E/10);M.push([m+Math.cos(w)*v,x+v*.6+Math.sin(w)*v])}r.line(M)}return Jn(n,r,i,{clip:_i(t)}),r}const cM={name:"snake",label:"Snake",schema:sM,presets:rM,presetPlaques:oM,draw:aM,symmetric:!1,facing:!0,plaque:{w:110,h:24}},lM={kind:Yt(["whorl","petal"],"whorl","Kind (火纹 / 四瓣目纹)"),spokes:Gt(3,7,1,5,"Spokes"),turn:Yt(["ccw","cw"],"ccw","Sweep"),sweep:Gt(40,110,5,75,"Spoke sweep","°"),size:Gt(.5,1,.01,.92,"Diameter (of rect)"),centre:Yt(["circle","boss","ring"],"circle","Centre"),dome:Gt(0,1,.05,.6,"Doming"),...Tn({motif:1.6,boss:2.6,groove:.5,lineWeight:.6,echoInset:.9,carving:"none"})},hM={"five-spokes":{},"four-spokes":{spokes:4,sweep:85},"six-spokes":{spokes:6,sweep:65},"post-cap":{spokes:6,size:.98,centre:"boss",dome:.9,relief:{motif:3,boss:4.5,groove:.6}},petal:{kind:"petal",carving:"sparse"},flush:{style:"flush",relief:{motif:.4,boss:1.2,groove:.4}}};function uM(n,t,e,i,s,r,a,o,c=40){const l=[],h=[];for(let f=0;f<=c;f++){const d=f/c,g=e+(i-e)*d,_=s+r*d,p=(a+(o-a)*Math.pow(d,.8))/2,m=Math.cos(_),x=Math.sin(_),v=-Math.sin(_)*Math.sign(r),M=Math.cos(_)*Math.sign(r),E=(m*.35+v)*p,w=(x*.35+M)*p;l.push([n+m*g+E,t+x*g+w]),h.push([n+m*g-E,t+x*g-w])}const u=[];for(let f=1;f<8;f++){const d=s+Math.PI/2+f/8*Math.PI;u.push([n+Math.cos(s)*e+Math.cos(d)*a*.5*Math.sign(r),t+Math.sin(s)*e+Math.sin(d)*a*.5*Math.sign(r)])}return l.concat(h.reverse(),u)}function fM(n,t,e){const i=xn(e),s=t.x+t.w/2,r=t.y+t.h/2,a=Math.min(t.w,t.h)/2*i.size,o=i.style==="flush",c=i.relief,l=i.lineWeight;if(i.kind==="petal")return dM(n,t,i,s,r,a);const h=o?.12:c.motif,u=o?0:i.dome,f=Math.max(.3,Math.min(.7,h*.4));n.raise(v=>{v.beginPath(),v.arc(s,r,a,0,Math.PI*2),v.fill()},{height:h*(1+u*.5),shoulder:a,profile:(v,M)=>Ts.plateau(v,f)*(1-u*.33+u*.33*Math.sqrt(Math.max(0,1-(1-v/M)**2)))}),o&&n.sink(v=>{v.beginPath(),v.arc(s,r,a-l,0,Math.PI*2),v.lineWidth=l,v.stroke()},{depth:c.groove,shoulder:l/2});const d=i.spokes|0,g=i.turn==="cw"?-1:1,_=a*.24,m=kn("whorl",t,i).range(0,Math.PI*2),x=Math.min(a*.24,2*Math.PI*a/d*.17);n.sink(v=>{for(let M=0;M<d;M++){const E=m+M/d*Math.PI*2,w=uM(s,r,_+l*1.4,a-Math.max(.5,l*.9),E,g*(i.sweep*Math.PI)/180,l*1.3,x);v.beginPath(),w.forEach((b,C)=>C?v.lineTo(b[0],b[1]):v.moveTo(b[0],b[1])),v.closePath(),v.fill()}},{depth:c.groove*1.2,shoulder:l*.6,profile:"u"}),i.centre==="boss"&&n.raise(v=>{v.beginPath(),v.arc(s,r,_*.85,0,Math.PI*2),v.fill()},{height:Math.max(c.boss,h*1.6),profile:"dome"}),n.sink(v=>{v.beginPath(),v.arc(s,r,_,0,Math.PI*2),v.lineWidth=l,v.stroke()},{depth:c.groove,shoulder:l/2}),i.centre==="ring"&&n.sink(v=>{v.beginPath(),v.arc(s,r,_*.45,0,Math.PI*2),v.fill()},{depth:c.groove*.8,shoulder:l/2})}function dM(n,t,e,i,s,r){const a=r*2,o=In({x:i-r,y:s-r,w:a,h:a}),c=new Un(o,{rng:kn("petal",t,e),wobble:.003*e.irregularity}),l=.12,h=new be(.5,l/2,0,.006).fd(.5-l/2-.08).arc(90,.08).fd(1-l-.16).arc(90,.08).fd(1-l-.16).arc(90,.08).fd(1-l-.16).arc(90,.08).fd(.5-l/2-.08);c.band(h.pts,l);for(let u=0;u<4;u++){const f=45+u*90,d=f*Math.PI/180,g=new be(.5+Math.cos(d)*.2,.5+Math.sin(d)*.2,f,.006).fd(.1).arc(90,.07).fd(.03).arc(90,.045);c.taper(g.pts,l*1.1,l*.7,.4)}c.circle([.5,.5],.17),c.boss([.5,.5],.12,{kind:"round",pupil:"dot",base:"plateau"}),Jn(n,c,e,{clip:_i(t)})}const pM={name:"whorl",label:"Whorl circle",schema:lM,presets:hM,draw:fM,symmetric:!1,plaque:{w:60,h:60},groundOptions:(n,t)=>({pitch:Math.max(.8,Math.min(2,Math.min(t.w,t.h)*.045))})},mM=Object.freeze(Object.defineProperty({__proto__:null,bands:Yv,bird:tx,blade:mx,boss:yx,cicada:ox,eyeband:Ex,frieze:kx,kui:Vx,leiwen:$x,scales:Qx,silkworm:iM,snake:cM,taotie:zv,whorl:pM},Symbol.toStringTag,{value:"Module"})),Ps={};function Af(n){if(!n||!n.name||typeof n.draw!="function")throw new Error("registerMotif: needs { name, draw }");return Ps[n.name]=n,n}function Ls(n){if(typeof n=="object")return n;const t=Ps[n];if(!t)throw new Error(`unknown motif "${n}" (have: ${Object.keys(Ps).join(", ")})`);return t}function hr(n,t={},e){var a;const i=Ls(n),s=Cc(i.schema),r=e?((a=i.presets)==null?void 0:a[e])??{}:{};return rc(rc(s,r),t)}function rc(n,t){const e={...n};for(const[i,s]of Object.entries(t||{}))e[i]=s&&typeof s=="object"&&!Array.isArray(s)&&n[i]&&typeof n[i]=="object"?rc(n[i],s):s;return e}for(const n of Object.values(mM))Af(n);const ai={pos:new q,nrm:new q},Ei=[0,0,1];function re({surface:n,segments:t={density:1},relief:e=null,reliefRect:i={u0:0,v0:0,u1:1,v1:1},back:s=null,fade:r=1.5,normals:a="surface",maxVerts:o=4e5,reliefScale:c=1,panelMap:l=null,samples:h=null}){const u=Eh(n,!0),f=Eh(n,!1);let d,g;if(h!=null&&h.u&&(h!=null&&h.v))d=h.u.length-1,g=h.v.length-1,o=1/0;else if(Array.isArray(t))[d,g]=t;else{const nt=t.density??1;d=Math.max(1,Math.ceil(u*nt)),g=Math.max(1,Math.ceil(f*nt))}const _=s?o/2:o;if((d+1)*(g+1)>_){const nt=Math.sqrt(_/((d+1)*(g+1)));d=Math.max(1,Math.floor(d*nt)),g=Math.max(1,Math.floor(g*nt))}const p=d+1,m=p*(g+1),x=Math.max(u/d,f/g),v=h!=null&&h.u&&(h!=null&&h.v)?h.u:null,M=h!=null&&h.u&&(h!=null&&h.v)?h.v:null,E=nt=>v?v[nt]:nt/d,w=nt=>M?M[nt]:nt/g,b=new Float32Array(m*3),C=new Float32Array(m*3);for(let nt=0;nt<=g;nt++)for(let rt=0;rt<=d;rt++){const ct=(nt*p+rt)*3;ai.nrm.set(0,0,0),n(E(rt),w(nt),ai),b[ct]=ai.pos.x,b[ct+1]=ai.pos.y,b[ct+2]=ai.pos.z,C[ct]=ai.nrm.x,C[ct+1]=ai.nrm.y,C[ct+2]=ai.nrm.z}const S=new Float32Array(m*3),T=new Float32Array(m*3);Th(b,d,g,S,T);for(let nt=0;nt<m;nt++){const rt=nt*3;if(C[rt]*C[rt]+C[rt+1]*C[rt+1]+C[rt+2]*C[rt+2]<1e-12){const ct=Ws(S[rt],S[rt+1],S[rt+2],T[rt],T[rt+1],T[rt+2]);ba(ct),C[rt]=ct[0],C[rt+1]=ct[1],C[rt+2]=ct[2]}}const L=new Float32Array(m*3),P=new Float32Array(m*2),W=i,R=typeof r=="number"?{u0:r,u1:r,v0:r,v1:r}:{u0:0,u1:0,v0:0,v1:0,...r},I=e?e.macro(x):null;for(let nt=0;nt<=g;nt++)for(let rt=0;rt<=d;rt++){const ct=nt*p+rt,_t=ct*3,H=E(rt),V=w(nt);let j=(H-W.u0)/(W.u1-W.u0),it=(V-W.v0)/(W.v1-W.v0),st=1;l&&(Ei[0]=j,Ei[1]=it,Ei[2]=1,l(H,V,Ei),j=Ei[0],it=Ei[1],st=Ei[2]),P[ct*2]=e?j:H,P[ct*2+1]=e?it:V;let St=0;if(I&&j>=0&&j<=1&&it>=0&&it<=1){const ut=e.widthMM,y=e.heightMM,A=Math.min(jr(j*ut,R.u0),jr((1-j)*ut,R.u1)),$=Math.min(jr(it*y,R.v0),jr((1-it)*y,R.v1));St=I.sample(j,it)*A*$*st*c}L[_t]=b[_t]+C[_t]*St,L[_t+1]=b[_t+1]+C[_t+1]*St,L[_t+2]=b[_t+2]+C[_t+2]*St}let D=C;if(a==="displaced"&&I){const nt=new Float32Array(m*3),rt=new Float32Array(m*3);Th(L,d,g,nt,rt),D=new Float32Array(m*3);for(let ct=0;ct<m;ct++){const _t=ct*3,H=Ws(nt[_t],nt[_t+1],nt[_t+2],rt[_t],rt[_t+1],rt[_t+2]);ba(H);const V=H[0]*C[_t]+H[1]*C[_t+1]+H[2]*C[_t+2]<0?-1:1;D[_t]=H[0]*V,D[_t+1]=H[1]*V,D[_t+2]=H[2]*V}}const z=new Float32Array(m*4);for(let nt=0;nt<m;nt++){const rt=nt*3;let ct=S[rt],_t=S[rt+1],H=S[rt+2];const V=D[rt],j=D[rt+1],it=D[rt+2],st=ct*V+_t*j+H*it;ct-=V*st,_t-=j*st,H-=it*st;const St=Math.hypot(ct,_t,H)||1;ct/=St,_t/=St,H/=St;const ut=Ws(V,j,it,ct,_t,H),y=ut[0]*T[rt]+ut[1]*T[rt+1]+ut[2]*T[rt+2]<0?-1:1;z[nt*4]=ct,z[nt*4+1]=_t,z[nt*4+2]=H,z[nt*4+3]=y}const B=((g>>1)*p+(d>>1))*3,F=Ws(S[B],S[B+1],S[B+2],T[B],T[B+1],T[B+2]),X=F[0]*C[B]+F[1]*C[B+1]+F[2]*C[B+2]>=0,tt=[];for(let nt=0;nt<g;nt++)for(let rt=0;rt<d;rt++){const ct=nt*p+rt,_t=ct+1,H=ct+p+1,V=ct+p;X?tt.push(ct,_t,H,ct,H,V):tt.push(ct,H,_t,ct,V,H)}const J=[L],U=[D],Y=[P],G=[z];let K=m;if(s&&s.thickness>0){const nt=s.thickness,rt=new Float32Array(m*3),ct=new Float32Array(m*3),_t=new Float32Array(m*2).fill(-1),H=new Float32Array(m*4);for(let j=0;j<m;j++){const it=j*3;rt[it]=b[it]-C[it]*nt,rt[it+1]=b[it+1]-C[it+1]*nt,rt[it+2]=b[it+2]-C[it+2]*nt,ct[it]=-C[it],ct[it+1]=-C[it+1],ct[it+2]=-C[it+2],H[j*4]=z[j*4],H[j*4+1]=z[j*4+1],H[j*4+2]=z[j*4+2],H[j*4+3]=-z[j*4+3]}for(let j=0;j<g;j++)for(let it=0;it<d;it++){const st=K+j*p+it,St=st+1,ut=st+p+1,y=st+p;X?tt.push(st,ut,St,st,y,ut):tt.push(st,St,ut,st,ut,y)}J.push(rt),U.push(ct),Y.push(_t),G.push(H),K+=m;const V=s.rims??["u0","u1","v0","v1"];for(const j of V){const it=[];if(j==="v0")for(let ot=0;ot<=d;ot++)it.push(ot);if(j==="v1")for(let ot=0;ot<=d;ot++)it.push(g*p+ot);if(j==="u0")for(let ot=0;ot<=g;ot++)it.push(ot*p);if(j==="u1")for(let ot=0;ot<=g;ot++)it.push(ot*p+d);const st=j[0]==="u"?S:T,St=j[1]==="0"?-1:1,ut=it.length,y=new Float32Array(ut*2*3),A=new Float32Array(ut*2*3),$=new Float32Array(ut*2*2).fill(-1),ft=new Float32Array(ut*2*4);for(let ot=0;ot<ut;ot++){const vt=it[ot]*3,bt=[st[vt]*St,st[vt+1]*St,st[vt+2]*St];ba(bt);for(let Mt=0;Mt<2;Mt++){const yt=Mt===0?L:rt,wt=(ot*2+Mt)*3;y[wt]=yt[vt],y[wt+1]=yt[vt+1],y[wt+2]=yt[vt+2],A[wt]=bt[0],A[wt+1]=bt[1],A[wt+2]=bt[2];const ht=(ot*2+Mt)*4;ft[ht]=C[vt],ft[ht+1]=C[vt+1],ft[ht+2]=C[vt+2],ft[ht+3]=1}}for(let ot=0;ot<ut-1;ot++){const dt=K+ot*2,vt=dt+1,bt=dt+3,Mt=dt+2,yt=ot*2*3,wt=(ot*2+1)*3,ht=(ot*2+2)*3,At=Ws(y[wt]-y[yt],y[wt+1]-y[yt+1],y[wt+2]-y[yt+2],y[ht]-y[yt],y[ht+1]-y[yt+1],y[ht+2]-y[yt+2]);At[0]*A[yt]+At[1]*A[yt+1]+At[2]*A[yt+2]>=0?tt.push(dt,vt,bt,dt,bt,Mt):tt.push(dt,bt,vt,dt,Mt,bt)}J.push(y),U.push(A),Y.push($),G.push(ft),K+=ut*2}}const Q=new Ke;return Q.setAttribute("position",new Ae(Yr(J),3)),Q.setAttribute("normal",new Ae(Yr(U),3)),Q.setAttribute("uv",new Ae(Yr(Y),2)),Q.setAttribute("tangent",new Ae(Yr(G),4)),Q.setIndex(K>65535?new Ro(tt,1):new Ao(tt,1)),Q.computeBoundingBox(),Q.computeBoundingSphere(),Q.userData={nu:d,nv:g,spacing:x,lenU:u,lenV:f},Q}function gM(n,t,e,i){const s=Xr(n),r=Xr(t),a=Xr(e),o=Xr(i);return(c,l,h)=>{h.pos.set((1-l)*((1-c)*s.x+c*r.x)+l*((1-c)*a.x+c*o.x),(1-l)*((1-c)*s.y+c*r.y)+l*((1-c)*a.y+c*o.y),(1-l)*((1-c)*s.z+c*r.z)+l*((1-c)*a.z+c*o.z))}}function Xr(n){return Array.isArray(n)?new q(n[0],n[1],n[2]):n}function jr(n,t){if(t<=0)return 1;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function Eh(n,t){const e={pos:new q,nrm:new q};let i=0;for(const s of[0,.5,1]){let r=0,a=null;for(let o=0;o<=24;o++){const c=o/24;n(t?c:s,t?s:c,e),a&&(r+=a.distanceTo(e.pos)),a=e.pos.clone()}i=Math.max(i,r)}return Math.max(i,.001)}function Th(n,t,e,i,s){const r=t+1;for(let a=0;a<=e;a++)for(let o=0;o<=t;o++){const c=(a*r+o)*3,l=Math.max(0,o-1),h=Math.min(t,o+1),u=Math.max(0,a-1),f=Math.min(e,a+1),d=(a*r+l)*3,g=(a*r+h)*3,_=(u*r+o)*3,p=(f*r+o)*3;for(let m=0;m<3;m++)i[c+m]=n[g+m]-n[d+m],s[c+m]=n[p+m]-n[_+m]}}function Ws(n,t,e,i,s,r){return[t*r-e*s,e*i-n*r,n*s-t*i]}function ba(n){const t=Math.hypot(n[0],n[1],n[2])||1;return n[0]/=t,n[1]/=t,n[2]/=t,n}function Yr(n){const t=n.reduce((s,r)=>s+r.length,0),e=new Float32Array(t);let i=0;for(const s of n)e.set(s,i),i+=s.length;return e}function Ah(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,c=new Ke;let l=0;for(let h=0;h<n.length;++h){const u=n[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0;const u=[];for(let f=0;f<n.length;++f){const d=n[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=n[f].attributes.position.count}c.setIndex(u)}for(const h in r){const u=Rh(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let _=0;_<a[h].length;++_)d.push(a[h][_][f]);const g=Rh(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function Rh(n){let t,e,i,s=-1,r=0;for(let l=0;l<n.length;++l){const h=n[l];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}const a=new t(r);let o=0;for(let l=0;l<n.length;++l)a.set(n[l].array,o),o+=n[l].array.length;const c=new Ae(a,e,i);return s!==void 0&&(c.gpuType=s),c}const _M=`
vec3 tt_mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 tt_mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 tt_permute(vec4 x) { return tt_mod289(((x * 34.0) + 10.0) * x); }
vec4 tt_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = tt_mod289(i);
  vec4 p = tt_permute(tt_permute(tt_permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = tt_taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`,vM=`
float fbm3(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * snoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s / 0.875;
}
float fbm2(vec3 p) {
  return (0.6667 * snoise(p) + 0.3333 * snoise(p * 2.07 + 11.3));
}
// a smooth vector field ~[-1, 1]^3 (3 taps) for domain warping
vec3 tt_warp(vec3 p) {
  return vec3(snoise(p), snoise(p + vec3(31.7, -12.3, 7.9)), snoise(p + vec3(-19.1, 23.9, -41.3)));
}
// ridged fbm: thin bright veins / banding (2 taps)
float tt_ridged(vec3 p) {
  float a = 1.0 - abs(snoise(p));
  float b = 1.0 - abs(snoise(p * 2.11 + 5.3));
  return (a * a * 0.65 + b * b * 0.35);
}
`,xM=`
vec3 tt_hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
float worley3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  float d = 8.0;
  for (int z = -1; z <= 1; z++)
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec3 o = vec3(float(x), float(y), float(z));
    vec3 r = o + tt_hash33(i + o) - f;
    d = min(d, dot(r, r));
  }
  return sqrt(d);
}
// returns (F1 distance, cell id hash 0..1)
vec2 worley8(vec3 p) {
  vec3 b = floor(p - 0.5);
  float d = 8.0, id = 0.0;
  for (int z = 0; z <= 1; z++)
  for (int y = 0; y <= 1; y++)
  for (int x = 0; x <= 1; x++) {
    vec3 c = b + vec3(float(x), float(y), float(z));
    vec3 h = tt_hash33(c);
    vec3 r = c + 0.5 + (h - 0.5) * 0.85 - p;
    float dd = dot(r, r);
    if (dd < d) { d = dd; id = h.x; }
  }
  return vec2(sqrt(d), id);
}
`,MM=_M+vM+xM,$n={age:{group:"master",label:"Time in the ground",min:0,max:1,step:.005,default:1},tin:{group:"Alloy",label:"Tin (Sn wt)",min:0,max:.3,step:.005,default:.14,hint:"F0 from the §1.2 table: copper-pink → warm gold (0.12) → pale gold → speculum"},lead:{group:"Alloy",label:"Lead (Pb wt)",min:0,max:.25,step:.005,default:.03,hint:"greys and dulls the metal"},polish:{group:"Alloy",label:"Polish",min:0,max:1,step:.01,default:.6,hint:"abraded fields / relief tops: roughness 0.40 → 0.12; recesses stay as-cast"},tarnish:{group:"Alloy",label:"Tarnish",min:0,max:1,step:.01,default:.5,hint:"thin oxide film: gold → brown-gold"},malachite:{group:"Carbonates & blue",key:!0,label:"Carbonate crust",min:0,max:1,step:.01,default:.6,hint:"how much of the surface the copper carbonates take"},carbonate:{group:"Carbonates & blue",key:!0,label:"Carbonate balance",min:0,max:1,step:.01,default:0,hint:"0 malachite green · 0.5 pale blue-green / turquoise phase · 1 azurite blue — by territory, never a teal blend"},azurite:{group:"Carbonates & blue",key:!0,label:"Azurite",min:0,max:.6,step:.01,default:.05,hint:"blue islands on top of / among the carbonates"},azuriteDepth:{group:"Carbonates & blue",label:"Depth of blue",min:0,max:1,step:.01,default:.5,hint:"pale powdery sky blue → deep crystalline ultramarine"},azuriteScale:{group:"Carbonates & blue",label:"Azurite patch",min:3,max:60,step:.5,default:14,unit:"mm"},blueHabitat:{group:"Carbonates & blue",label:"Blue lives in",min:0,max:1,step:.01,default:.5,hint:"0 recesses and grooves · 1 open crust patches"},turquoiseTone:{group:"Carbonates & blue",label:"Blue-green tone",min:0,max:1,step:.01,default:.3,hint:"the turquoise / chrysocolla-like phase: pale chalky → deep sea blue-green"},malachiteHue:{group:"Carbonates & blue",label:"Malachite hue",min:0,max:1,step:.01,default:.45,hint:"blue-green → yellow-green"},malachiteTone:{group:"Carbonates & blue",label:"Malachite tone",min:0,max:1,step:.01,default:.5,hint:"dark compact wet-looking → pale earthy crust"},islands:{group:"Carbonates & blue",label:"Film ↔ islands",min:0,max:1,step:.01,default:.6,hint:"0 thin translucent films that fade out · 1 sharp-edged crust islands"},malachiteScale:{group:"Carbonates & blue",label:"Crust grain",min:.5,max:8,step:.1,default:2,unit:"mm",hint:"botryoidal dome size"},crust:{group:"Carbonates & blue",label:"Crust thickness",min:0,max:4,step:.05,default:1,unit:"mm",hint:"thick crust fills the line work"},tinOxide:{group:"Other corrosion",label:"Noble patina",min:0,max:1,step:.01,default:.2,hint:"Type I tin-oxide skin territories (water patina): dark, smooth, keeps the cast surface"},tinOxideTone:{group:"Other corrosion",label:"Noble tone",min:0,max:2,step:.01,default:1,hint:"0 black 黑漆古 · 1 olive · 2 grey 水银古"},nobleWarmth:{group:"Other corrosion",label:"Noble warmth",min:0,max:1,step:.01,default:0,hint:"olive-green skin → warm grey-brown (a thin sheet with the cuprite glowing through)"},cuprite:{group:"Other corrosion",label:"Cuprite",min:0,max:1,step:.01,default:.7,hint:"red-brown Cu₂O on the metal, shows where the crust is thin or worn"},cupriteTone:{group:"Other corrosion",label:"Cuprite tone",min:0,max:1,step:.01,default:0,hint:"0 compact liver / oxblood · 1 pale powdery brick-pink, unveiled (cuprite blotches under a lime bloom, Houmuwu fields)"},chloride:{group:"Other corrosion",label:"Chloride",min:0,max:1,step:.01,default:.08,hint:"bronze disease: pale powdery pustules over pits"},soot:{group:"Other corrosion",label:"Soot",min:0,max:1,step:.01,default:0,hint:"tenorite/soot on the lower body and legs (fire)"},crevice:{group:"Other corrosion",label:"Crevice bias",min:0,max:1,step:.01,default:.7,hint:"how strongly crust prefers recesses"},patchScale:{group:"Other corrosion",label:"Territory size",min:20,max:200,step:1,default:70,unit:"mm"},mottleScale:{group:"Other corrosion",label:"Mottle size",min:3,max:40,step:.5,default:12,unit:"mm"},patchiness:{group:"Other corrosion",label:"Territories ↔ fine mottle",min:0,max:1,step:.01,default:1,hint:"1 broad territories and crust islands · 0 every layer breaks up at the mottle size instead (a fine speckled skin, no large blotches)"},matte:{group:"Surface",key:!0,label:"Matte (dry skin)",min:0,max:1,step:.01,default:0,hint:"micro-pitted, dusty excavated skin: no broad glossy highlights. 0 keeps each layer’s own sheen (as-cast, heirloom)"},dulling:{group:"Surface",label:"Dulling",min:0,max:1,step:.01,default:0,hint:"dust, old wax and fine soil in the pores grey every mineral colour down"},tops:{group:"Surface",key:!0,label:"Relief tops",min:0,max:1,step:.01,default:0,hint:"relief tops rubbed clean: darker, warmer, smoother skin — the décor reads"},topsTone:{group:"Surface",label:"Relief tops tone",min:0,max:1,step:.01,default:0,hint:"0 rubbed darker & warmer · 1 paler silvery-grey bands (flush décor read by colour: Met zun / gu, Houmuwu plateaus)"},earth:{group:"Surface",label:"Burial soil",min:0,max:1,step:.01,default:.3},earthColor:{group:"Surface",label:"Soil colour",type:"color",default:"#8f7048"},calcite:{group:"Surface",label:"Calcareous film",min:0,max:1,step:.01,default:.15,hint:"whitish lime dusting that pales the crust"},streaks:{group:"Surface",label:"Streaks & tide line",min:0,max:1,step:.01,default:0,hint:"runs of groundwater down the walls, one pale tide line"},burialSide:{group:"Surface",label:"Burial side",min:0,max:1,step:.01,default:.3,hint:"one side lay in the soil"},recessDirt:{group:"Surface",label:"Recess dirt",min:0,max:1,step:.01,default:.3},interiorTone:{group:"Surface",label:"Interior skin",min:0,max:1,step:.01,default:.3,hint:"inside the vessel: dark grey-brown → pale green corroded skin"},wax:{group:"Surface",label:"Museum wax",min:0,max:1,step:.01,default:0},inlay:{group:"Surface",label:"Black inlay",min:0,max:1,step:.01,default:0,hint:"paste in the sunk lines (as made)"},inlayGround:{group:"Surface",label:"Inlay fills the ground",min:0,max:1,step:.01,default:0,hint:"the black paste fills the whole sunk ground of the décor, not only the lines: flush bands read light on black (Met zun)"},wear:{group:"Surface",key:!0,label:"Wear",min:0,max:1,step:.01,default:.2,hint:"erases from the top down on arrises"},seed:{group:"Surface",label:"Seed",min:0,max:99,step:1,default:7}},Ms={"as-cast":{age:1,tin:.14,lead:.03,polish:.65,tarnish:.12,cuprite:0,tinOxide:0,malachite:0,azurite:0,chloride:0,soot:0,earth:0,calcite:0,recessDirt:.15,wax:0,inlay:.85,wear:0,crust:0},"excavated-green":{age:1,tin:.13,lead:.04,polish:.4,tarnish:.7,cuprite:.75,tinOxide:.75,tinOxideTone:.8,malachite:.45,carbonate:.15,azurite:.03,azuriteScale:10,blueHabitat:.3,turquoiseTone:.15,malachiteHue:.45,malachiteTone:.6,islands:.55,malachiteScale:2,crust:.6,chloride:.08,soot:.05,crevice:.85,patchScale:70,mottleScale:10,patchiness:.6,earth:.1,earthColor:"#7d6a50",calcite:.2,streaks:.35,burialSide:.3,recessDirt:.2,interiorTone:.3,wax:0,inlay:0,wear:.2,dulling:.5,tops:.45,nobleWarmth:.4,matte:.6},"malachite-crust":{age:1,tin:.14,lead:.03,polish:.4,tarnish:.6,cuprite:.9,tinOxide:0,tinOxideTone:1,malachite:.95,malachiteHue:.42,malachiteTone:.12,malachiteScale:1.6,crust:.9,islands:.8,azurite:.05,chloride:.03,soot:0,crevice:.6,patchScale:60,mottleScale:10,earth:.08,earthColor:"#6e5b42",calcite:0,burialSide:.2,recessDirt:.45,wax:.2,inlay:0,wear:.3,dulling:.3,tops:.3,matte:.4},"olive-museum":{age:1,tin:.14,lead:.05,polish:.5,tarnish:.8,cuprite:.45,tinOxide:.88,tinOxideTone:1.25,malachite:.35,malachiteHue:.4,malachiteTone:.55,malachiteScale:1.5,crust:.2,islands:.4,azurite:.02,chloride:.02,soot:0,crevice:.95,patchScale:80,mottleScale:9,patchiness:.5,earth:.1,earthColor:"#6b5a42",calcite:.12,burialSide:.1,recessDirt:.55,wax:.25,inlay:0,wear:.25,dulling:.25,tops:.2,streaks:.15,matte:.45,nobleWarmth:.3},"water-black":{age:1,tin:.16,lead:.02,polish:.5,tarnish:.9,cuprite:.7,tinOxide:.8,tinOxideTone:0,malachite:.08,malachiteHue:.35,malachiteScale:1.5,crust:.1,islands:.5,azurite:0,chloride:.03,soot:0,crevice:.6,patchScale:110,mottleScale:16,earth:.05,earthColor:"#5a4a38",calcite:.12,streaks:.4,burialSide:.2,recessDirt:.4,wax:.15,inlay:0,wear:.15,dulling:.15,matte:.3},"bronze-disease":{age:1,tin:.13,lead:.05,polish:.4,tarnish:.7,cuprite:.8,tinOxide:.55,tinOxideTone:1.2,malachite:.45,malachiteHue:.45,malachiteScale:2,crust:.6,azurite:.03,chloride:.7,soot:0,crevice:.8,patchScale:70,mottleScale:10,patchiness:.7,earth:.15,earthColor:"#7a6548",calcite:.1,burialSide:.3,recessDirt:.45,wax:0,inlay:0,wear:.15,dulling:.35,tops:.3,matte:.65,nobleWarmth:.3},heirloom:{age:1,tin:.13,lead:.04,polish:.7,tarnish:.75,cuprite:.5,tinOxide:.8,tinOxideTone:.25,malachite:.1,malachiteHue:.5,malachiteScale:1.5,crust:.15,azurite:0,chloride:0,soot:.05,crevice:.9,patchScale:80,mottleScale:12,earth:0,calcite:0,burialSide:0,recessDirt:.8,wax:.3,inlay:.2,wear:.75},"blue-green-excavated":{age:1,tin:.13,lead:.04,polish:.4,tarnish:.7,cuprite:.9,tinOxide:.35,tinOxideTone:1.3,malachite:.82,carbonate:.52,azurite:.06,azuriteDepth:.35,azuriteScale:10,blueHabitat:.35,turquoiseTone:.12,malachiteHue:.3,malachiteTone:.75,islands:.45,malachiteScale:2.2,crust:.9,chloride:.1,soot:0,crevice:.75,patchScale:65,mottleScale:10,patchiness:.6,earth:.3,earthColor:"#8a7354",calcite:.35,streaks:.3,burialSide:.3,recessDirt:.15,interiorTone:.4,wax:0,inlay:0,wear:.15,dulling:.25,tops:.5,matte:.65,nobleWarmth:.3},"azurite-bloom":{age:1,tin:.13,lead:.04,polish:.4,tarnish:.6,cuprite:.9,tinOxide:.3,tinOxideTone:1,malachite:.8,carbonate:.65,azurite:.28,azuriteDepth:.8,azuriteScale:18,blueHabitat:.8,turquoiseTone:.5,malachiteHue:.42,malachiteTone:.45,islands:.85,malachiteScale:2.2,crust:1.2,chloride:.08,soot:0,crevice:.7,patchScale:70,mottleScale:12,earth:.25,earthColor:"#8a7354",calcite:.2,streaks:.2,burialSide:.3,recessDirt:.25,interiorTone:.3,wax:0,inlay:0,wear:.15,dulling:.1,tops:.35,matte:.55,nobleWarmth:.3},houmuwu:{age:1,tin:.12,lead:.04,polish:.4,tarnish:.6,cuprite:1,cupriteTone:.75,tinOxide:.15,tinOxideTone:2,malachite:.9,carbonate:.6,azurite:.02,azuriteScale:8,blueHabitat:.3,turquoiseTone:.3,malachiteHue:.2,malachiteTone:.72,islands:.1,malachiteScale:1,crust:1,chloride:.08,soot:.2,crevice:.3,patchScale:50,mottleScale:14,patchiness:.15,earth:.25,earthColor:"#857256",calcite:.06,streaks:.2,burialSide:.3,recessDirt:.8,interiorTone:.35,wax:0,inlay:.7,wear:.22,dulling:.05,tops:.15,matte:.65,topsTone:1},"met-fangyi":{age:1,tin:.14,lead:.05,polish:.4,tarnish:.8,cuprite:.8,cupriteTone:.3,tinOxide:.95,tinOxideTone:1.15,malachite:.04,carbonate:.05,azurite:0,malachiteHue:.45,malachiteTone:.6,islands:.3,malachiteScale:1,crust:.1,chloride:.02,soot:0,crevice:.5,patchScale:80,mottleScale:6,patchiness:.5,earth:.15,earthColor:"#5c4630",calcite:.03,streaks:.1,burialSide:.05,recessDirt:.15,interiorTone:.6,wax:.25,inlay:0,wear:.15,dulling:.15,tops:.4,nobleWarmth:.2,matte:.45,topsTone:.2},"met-zun":{age:1,tin:.14,lead:.05,polish:.45,tarnish:.2,cuprite:.2,tinOxide:.95,tinOxideTone:2,malachite:.6,carbonate:.2,azurite:.04,azuriteDepth:.4,azuriteScale:6,blueHabitat:.5,turquoiseTone:.5,malachiteHue:.35,malachiteTone:.45,islands:.7,malachiteScale:.9,crust:.12,chloride:0,soot:0,crevice:.4,patchScale:35,mottleScale:3,patchiness:.5,earth:.05,earthColor:"#9a978c",calcite:.25,streaks:.1,burialSide:.1,recessDirt:.7,interiorTone:.25,wax:.15,inlay:1,inlayGround:.85,wear:.3,dulling:.45,tops:1,nobleWarmth:0,matte:.55,topsTone:1},"met-gu":{age:1,tin:.14,lead:.05,polish:.4,tarnish:.4,cuprite:.35,cupriteTone:.3,tinOxide:.9,tinOxideTone:1.6,malachite:.45,carbonate:.05,azurite:0,malachiteHue:.4,malachiteTone:.25,islands:.6,malachiteScale:1.2,crust:.2,chloride:0,soot:.7,crevice:.5,patchScale:45,mottleScale:8,patchiness:.35,earth:.1,earthColor:"#6b5a42",calcite:.2,streaks:.1,burialSide:.05,recessDirt:.95,interiorTone:.3,wax:.15,inlay:.85,inlayGround:.4,wear:.3,dulling:.5,tops:1,nobleWarmth:0,matte:.5,topsTone:1},"nezu-olive":{age:1,tin:.15,lead:.06,polish:.35,tarnish:.9,cuprite:.7,cupriteTone:.4,tinOxide:.97,tinOxideTone:.8,malachite:.05,carbonate:.15,azurite:0,malachiteHue:.55,malachiteTone:.6,islands:.1,malachiteScale:1.5,crust:.12,chloride:.02,soot:0,crevice:.4,patchScale:60,mottleScale:10,patchiness:.5,earth:.05,earthColor:"#6a6458",calcite:.04,streaks:.1,burialSide:.15,recessDirt:.4,interiorTone:.2,wax:.1,inlay:0,inlayGround:.3,wear:.15,dulling:.6,tops:1,matte:.45,nobleWarmth:1,topsTone:.7},"nezu-blue":{age:1,tin:.15,lead:.05,polish:.45,tarnish:.85,cuprite:.6,cupriteTone:.3,tinOxide:.95,tinOxideTone:.6,malachite:.3,carbonate:.6,azurite:.12,azuriteDepth:.6,azuriteScale:8,blueHabitat:.05,turquoiseTone:.6,malachiteHue:.12,malachiteTone:.55,islands:.25,malachiteScale:1.2,crust:.2,chloride:.03,soot:0,crevice:.6,patchScale:55,mottleScale:10,patchiness:.5,earth:.05,earthColor:"#5f6460",calcite:0,streaks:.15,burialSide:.2,recessDirt:.3,interiorTone:.2,wax:.05,inlay:0,wear:.1,dulling:.35,tops:.8,nobleWarmth:.8,matte:.5,topsTone:.6}},Rf={Vessels:["houmuwu","met-fangyi","met-zun","met-gu","nezu-olive"],Looks:["excavated-green","olive-museum","malachite-crust","water-black","bronze-disease","heirloom","as-cast"],Blue:["nezu-blue","blue-green-excavated","azurite-bloom"]},Ph=n=>"u"+n[0].toUpperCase()+n.slice(1),le={};for(const[n,t]of Object.entries($n))le[n]={value:t.type==="color"?new Xt(t.default):t.default};le.mode={value:0};le.vesselInverse={value:new ae};le.vesselMin={value:new q(-150,0,-150)};le.vesselSize={value:new q(300,300,300)};function _o(n={}){for(const[t,e]of Object.entries(n))!le[t]||!(t in $n)||(le[t].value instanceof Xt?le[t].value.set(e):le[t].value=e)}function $s(){const n={};for(const t of Object.keys($n)){const e=le[t].value;n[t]=e instanceof Xt?"#"+e.getHexString():e}return n}const Pf={beauty:0,clay:1,height:2,mask:3};function Lf(n){le.mode.value=Pf[n]??0}function Cf(n){if(n)if(n.isObject3D){n.updateMatrixWorld(!0),le.vesselInverse.value.copy(n.matrixWorld).invert();const t=new En,e=le.vesselInverse.value;if(n.traverse(i=>{if(!i.isMesh||!i.geometry)return;i.geometry.boundingBox||i.geometry.computeBoundingBox();const s=i.geometry.boundingBox.clone().applyMatrix4(new ae().multiplyMatrices(e,i.matrixWorld));t.union(s)}),t.isEmpty())return;le.vesselMin.value.copy(t.min),t.getSize(le.vesselSize.value)}else le.vesselInverse.value.identity(),le.vesselMin.value.fromArray(n.min),le.vesselSize.value.fromArray(n.max).sub(le.vesselMin.value)}class Se extends to{constructor({relief:t=null,cavityAttribute:e=!1,cavity:i=.8,interior:s=0,normalStrength:r=1,...a}={}){super({color:16777215,roughness:.5,metalness:1,envMapIntensity:1,...a}),this.isPatinaMaterial=!0,this.relief=t,this.cavityAttribute=e,this.defines=this.defines||{},t&&(this.normalMap=t.normalTexture,this.normalScale=new Lt(r,r),this.defines.PATINA_RELIEF=""),e&&(this.defines.PATINA_CAVITY_ATTR=""),this.local={uReliefData:{value:t?t.dataTexture:null},uReliefRange:{value:new Lt(t?t.min:0,t?t.max:1)},uConstCavity:{value:i},uInterior:{value:s}},this.onBeforeCompile=o=>yM(o,this)}customProgramCacheKey(){return"patina2:"+(this.relief?"R":"")+(this.cavityAttribute?"C":"")}}function yM(n,t){for(const i of Object.keys($n))n.uniforms[Ph(i)]=le[i];n.uniforms.uPatinaMode=le.mode,n.uniforms.uVesselInv=le.vesselInverse,n.uniforms.uVesselMin=le.vesselMin,n.uniforms.uVesselSize=le.vesselSize,Object.assign(n.uniforms,t.local),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
uniform mat4 uVesselInv;
varying vec3 vPatinaPos;
varying vec3 vPatinaNrm;
#ifdef PATINA_CAVITY_ATTR
attribute float cavity;
varying float vCavity;
#endif`).replace("#include <project_vertex>",`#include <project_vertex>
{
  mat4 tt_m = uVesselInv * modelMatrix;
  vPatinaPos = (tt_m * vec4(transformed, 1.0)).xyz;
  vPatinaNrm = normalize(mat3(tt_m) * objectNormal);
}
#ifdef PATINA_CAVITY_ATTR
vCavity = cavity;
#endif`);const e=Object.entries($n).map(([i,s])=>`uniform ${s.type==="color"?"vec3":"float"} ${Ph(i)};`).join(`
`);n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
${e}
uniform float uPatinaMode;
uniform sampler2D uReliefData;
uniform vec2 uReliefRange;
uniform float uConstCavity;
uniform float uInterior;
uniform vec3 uVesselMin;
uniform vec3 uVesselSize;
varying vec3 vPatinaPos;
varying vec3 vPatinaNrm;
#ifdef PATINA_CAVITY_ATTR
varying float vCavity;
#endif
${MM}
${bM}`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
${SM}`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.specularColor = mix(vec3(ttF0), diffuseColor.rgb, metalnessFactor);`)}const bM=`
struct Surf {
  vec3 p;        // vessel-space position, mm
  vec3 n;        // vessel-space geometric normal
  float up;      // n.y
  float hgt;     // height above the base, 0..1 of the vessel
  float h01;     // relief height, 0..1 over the panel's range (0.5 on plain meshes)
  float cav;     // 0 deep recess → 1 fully exposed
  float edge;    // 1 on sharp raised arrises (relief edge channel ∪ geometric convexity)
  float groove;  // 1 inside sunk line work
  float rec;     // recess preference after crevice bias, 0..1
  float inside;  // 0..1 interior / sheltered (inward-facing, interior flag)
  float calm;    // 0..1 a true interior surface (per-mesh hint): one quiet corroded skin
  float burial;  // -1..1 facing the side that lay in the soil
  float T;       // territory field 0..1 (patchScale, domain-warped)
  float T2;      // second, independent territory field 0..1 (azurite, noble-vs-crust split)
  float K;       // territory KIND, 0..1, constant per warped cell: sharp-edged regions that differ in kind
  float A;       // azurite field 0..1 (azuriteScale, warped)
  float st;      // gravity streaks ~-1..1 (vertical runs), LOD-faded to 0
  float M;       // mottle 0..1 (mottleScale)
  float G;       // speckle 0..1 (≈ grain size), LOD-faded to 0.5
  float B;       // botryoidal dome height 0..1 (malachiteScale), LOD-faded
  float px;      // pixel footprint, mm
};

float tt_ss(float a, float b, float x) { return smoothstep(a, b, x); }
// remap an amount (0..1) into a coverage of field f: amount ≈ area fraction
float tt_cover(float amount, float f, float soft) {
  return amount <= 0.001 ? 0.0 : smoothstep(1.0 - amount - soft, 1.0 - amount + soft, f);
}
// fades a band of noise to its mean once it drops under ~1.5 px
float tt_lod(float scaleMM, float px) { return 1.0 - smoothstep(0.25, 0.75, px / max(scaleMM, 1e-3)); }

vec3 tt_pal(vec3 dark, vec3 mid, vec3 light, float t) {
  return t < 0.5 ? mix(dark, mid, t * 2.0) : mix(mid, light, t * 2.0 - 1.0);
}
float tt_lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

// research/02 §1.2: F0 vs Sn wt, linear, rows every 5 %
vec3 tt_metalF0(float sn, float pb) {
  float x = clamp(sn, 0.0, 0.3) * 20.0;
  vec3 c;
  if (x < 1.0) c = mix(vec3(0.955, 0.638, 0.538), vec3(0.940, 0.660, 0.500), x);
  else if (x < 2.0) c = mix(vec3(0.940, 0.660, 0.500), vec3(0.910, 0.700, 0.470), x - 1.0);
  else if (x < 3.0) c = mix(vec3(0.910, 0.700, 0.470), vec3(0.860, 0.725, 0.510), x - 2.0);
  else if (x < 4.0) c = mix(vec3(0.860, 0.725, 0.510), vec3(0.800, 0.735, 0.590), x - 3.0);
  else if (x < 5.0) c = mix(vec3(0.800, 0.735, 0.590), vec3(0.740, 0.720, 0.655), x - 4.0);
  else c = mix(vec3(0.740, 0.720, 0.655), vec3(0.700, 0.690, 0.660), x - 5.0);
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return mix(c, vec3(l) * 0.92, clamp(pb * 2.0, 0.0, 0.5));
}

// §2.5 noble patina palettes, tone 0 black · 1 olive · 2 grey; t = dark → light.
// Olive is the research's olive / green-grey (#39402F · #5C6448 · #838B6A): brown-olive, not green.
vec3 tt_nobleColor(float tone, float t) {
  vec3 blk = tt_pal(vec3(0.006, 0.007, 0.006), vec3(0.014, 0.017, 0.012), vec3(0.030, 0.037, 0.024), t);
  vec3 olv = tt_pal(vec3(0.036, 0.042, 0.026), vec3(0.098, 0.110, 0.066), vec3(0.215, 0.235, 0.150), t);
  vec3 gry = tt_pal(vec3(0.070, 0.082, 0.076), vec3(0.150, 0.170, 0.160), vec3(0.315, 0.345, 0.320), t);
  return tone < 1.0 ? mix(blk, olv, tone) : mix(olv, gry, tone - 1.0);
}

// §2.3 malachite: hue 0 blue-green · 0.5 the research's malachite · 1 yellow-green
vec3 tt_malachiteColor(float hue, float t) {
  vec3 bg = tt_pal(vec3(0.012, 0.070, 0.064), vec3(0.045, 0.185, 0.170), vec3(0.200, 0.400, 0.380), t);
  vec3 gr = tt_pal(vec3(0.013, 0.102, 0.045), vec3(0.047, 0.254, 0.107), vec3(0.205, 0.479, 0.287), t);
  vec3 yg = tt_pal(vec3(0.030, 0.090, 0.025), vec3(0.100, 0.225, 0.062), vec3(0.290, 0.440, 0.170), t);
  return hue < 0.5 ? mix(bg, gr, hue * 2.0) : mix(gr, yg, hue * 2.0 - 1.0);
}

// the blue-green phase (chrysocolla / basic copper salts, Houmuwu's "#8fc0bf pale blue-green"):
// tone 0 pale chalky turquoise → 1 deep sea blue-green. Its own mineral, not a malachite hue.
vec3 tt_turquoiseColor(float tone, float t) {
  vec3 pale = tt_pal(vec3(0.080, 0.160, 0.160), vec3(0.170, 0.310, 0.300), vec3(0.330, 0.500, 0.490), t);
  vec3 deep = tt_pal(vec3(0.008, 0.055, 0.068), vec3(0.030, 0.150, 0.180), vec3(0.120, 0.330, 0.370), t);
  return mix(pale, deep, tone);
}

// §2.4 azurite: depth 0 pale powdery sky blue → 0.5 the research's azure → 1 deep crystalline ultramarine
vec3 tt_azuriteColor(float depth, float t) {
  vec3 pale = tt_pal(vec3(0.090, 0.170, 0.330), vec3(0.200, 0.320, 0.560), vec3(0.380, 0.520, 0.740), t);
  vec3 mid = tt_pal(vec3(0.012, 0.036, 0.162), vec3(0.026, 0.098, 0.392), vec3(0.144, 0.287, 0.631), t);
  vec3 deep = tt_pal(vec3(0.005, 0.018, 0.100), vec3(0.014, 0.052, 0.260), vec3(0.070, 0.165, 0.480), t);
  return depth < 0.5 ? mix(pale, mid, depth * 2.0) : mix(mid, deep, depth * 2.0 - 1.0);
}

float layerCuprite(Surf S, float amt) {
  // a near-continuous film on the metal: territory only thins it at low amounts
  return tt_cover(amt, 0.5 * S.T + 0.3 * S.M + 0.2 * S.rec + 0.08 * (S.G - 0.5), 0.18);
}

float layerNoble(Surf S, float amt) {
  // Type I sheet: broad smooth territories, indifferent to relief, better on the exterior;
  // kind-0 cells are noble-skin territories, kind-2 cells crust territories
  // (with fine mottle — patchiness < 1 — the kind borders soften: speckle has no cut edges)
  float kw = 0.22 * (1.0 - clamp(uPatchiness, 0.0, 1.0));
  float kNob = 1.0 - tt_ss(0.25 - kw, 0.4 + kw, S.K);
  float f = 0.5 * (1.0 - S.T) + 0.22 * S.T2 + 0.24 * (S.M - 0.5) + 0.12 - 0.15 * S.inside + 0.2 * kNob - 0.12 * tt_ss(0.62 - kw, 0.75 + kw, S.K) + 1.6 * kw * (S.G - 0.5);
  return tt_cover(amt, f, 0.12);
}

// the carbonate-crust field: territories + strong recess preference, up-facing and burial-side
// bias, thinner on convex arrises, a kind bias (crust cells take more), fractal-edged boundaries
float malachiteField(Surf S) {
  float kw = 0.22 * (1.0 - clamp(uPatchiness, 0.0, 1.0));
  return 0.42 * S.T + 0.78 * S.rec * (0.3 + 0.7 * uCrevice) + 0.12 * max(S.up, 0.0)
       + 0.15 * uBurialSide * S.burial - 0.3 * S.edge + 0.22 * (S.M - 0.5) + 0.06 * (S.G - 0.5) + 0.1 * S.inside
       + 0.16 * (tt_ss(0.62 - kw, 0.75 + kw, S.K) - 0.5) - 0.3 * (1.0 - S.rec) * uCrevice
       + 0.38 * tt_ss(0.66 - kw, 0.74 + kw, S.K) * tt_ss(0.3, 0.75, S.T)
       + kw * (1.4 * (1.0 - S.rec) + 2.0 * (S.G - 0.5)); // fine mottle: skin-wide, not recess-bound, granular edges // a few crust territories on open walls
}
// crust ISLANDS: sharp-edged, a little dependent on the cell kind
float layerMalachite(Surf S, float amt) {
  float soft = mix(0.12, 0.022, uIslands);
  return tt_cover(amt * mix(0.55, 1.0, uIslands), malachiteField(S), soft);
}
// thin FILM: gradual, translucent, wider than the islands
float layerCarbonateFilm(Surf S, float amt) {
  return tt_cover(min(amt * 1.35, 1.0), malachiteField(S) + 0.1 * S.st, 0.32) * mix(0.62, 0.3, uIslands);
}

// which carbonate a crust pixel is: 1 = the blue-green phase, 0 = malachite. Per territory
// (warped cells + territory field), thresholded, never a blend; habitat 0 pulls it into recesses
float layerBlueGreen(Surf S, float frac) {
  float hab = uBlueHabitat;
  float f = 0.5 * S.K + 0.28 * S.T2 + 0.14 * S.M + 0.08 * (S.G - 0.5)
          + mix(0.55 * (S.rec - 0.45), 0.0, hab);
  return tt_cover(frac, f, 0.03);
}

float layerAzurite(Surf S, float amt) {
  // discrete islands from a thresholded warped field at the azurite patch scale; habitat
  // 0 binds them to the recesses / grooves, 1 lets them sit as open crust patches
  float hab = uBlueHabitat;
  float f = 0.62 * S.A + 0.16 * S.T2 + 0.12 * S.M + 0.08 * S.inside + 0.05 * (S.G - 0.5)
          + mix(0.6 * (S.rec - 0.5), 0.0, hab) - mix(0.25 * S.edge, 0.0, hab);
  return tt_cover(amt, f, 0.025);
}

float layerSoil(Surf S, float amt) {
  // packed into recesses, onto up-facing ledges, the burial side, underside and interior
  float f = 0.75 * S.rec + 0.22 * max(S.up, 0.0) * (1.0 - S.edge) + 0.3 * uBurialSide * max(S.burial, 0.0)
          + 0.35 * S.inside * (1.0 - S.calm) + 0.3 * max(-S.up, 0.0) * (1.0 - tt_ss(0.0, 0.25, S.hgt)) + 0.2 * (S.M - 0.5) - 0.25 * S.edge
          + 0.22 * (1.0 - tt_ss(0.02, 0.16, S.hgt)) * (1.0 - S.inside); // an earthy accretion low on the foot
  return tt_cover(amt, f, 0.09);
}

float layerSoot(Surf S, float amt) {
  float low = 1.0 - tt_ss(0.0, 0.4, S.hgt);
  return amt * clamp(low * (0.6 + 0.4 * S.M) + 0.5 * max(-S.up, 0.0) * low, 0.0, 1.0) * (1.0 - S.inside);
}

// erase driver: convex arrises, rims and handles first (handling), noisy
float layerWear(Surf S, float amt) {
  float hi = S.edge * 0.9 + 0.3 * tt_ss(0.7, 1.0, S.h01) * tt_ss(0.75, 1.0, S.cav) + 0.35 * tt_ss(0.9, 1.0, S.hgt) * (1.0 - S.inside);
  float e = amt * tt_ss(0.15, 0.85, hi + 0.35 * (S.M - 0.5) + 0.25 * (S.G - 0.5));
  return clamp(e * (1.0 - 0.8 * S.inside), 0.0, 1.0);
}

// bump from a scalar height (mm) via screen-space derivatives (Mikkelsen)
vec3 tt_bump(vec3 n, float h, vec3 viewPos) {
  vec3 sx = dFdx(viewPos), sy = dFdy(viewPos);
  vec3 r1 = cross(sy, n), r2 = cross(n, sx);
  float det = dot(sx, r1);
  vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  return normalize(abs(det) * n - grad);
}
`,SM=`
float ttF0 = 0.04;
{
  Surf S;
  S.p = vPatinaPos;
  S.n = normalize(vPatinaNrm) * (gl_FrontFacing ? 1.0 : -1.0);
  S.up = S.n.y;
  S.hgt = clamp((S.p.y - uVesselMin.y) / max(uVesselSize.y, 1.0), 0.0, 1.0);
  S.px = max(length(fwidth(vPatinaPos)), 1e-3);

  // geometric curvature (signed, 1/mm) from the interpolated normal: + convex arris, − concave crease
  vec3 vp = -vViewPosition;
  vec3 dpx = dFdx(vp), dpy = dFdy(vp);
  float kx = dot(dFdx(nonPerturbedNormal), dpx) / max(dot(dpx, dpx), 1e-6);
  float ky = dot(dFdy(nonPerturbedNormal), dpy) / max(dot(dpy, dpy), 1e-6);
  float kc = 0.5 * (kx + ky);
  float gEdge = tt_ss(0.06, 0.35, kc);
  float gCrease = tt_ss(0.03, 0.25, -kc);

  // shelter from the vessel's own shape: faces turned toward the axis (inner walls,
  // the inner sides of legs), undersides, and the per-mesh interior hint
  vec3 axis = uVesselMin + 0.5 * uVesselSize;
  vec2 rad = S.p.xz - axis.xz;
  float inward = max(0.0, -dot(normalize(S.n.xz + 1e-5), normalize(rad + 1e-5))) * length(S.n.xz);
  S.inside = clamp(max(uInterior, inward * 0.55 * tt_ss(0.2, 0.6, S.hgt)), 0.0, 1.0);
  // (a cup seen through the mouth passes interior ≈ 0.45: that is already mostly the calm skin)
  S.calm = clamp(uInterior * 1.8, 0.0, 1.0);

  bool plain = true;
  #ifdef PATINA_RELIEF
    if (vNormalMapUv.x > -0.5) {
      vec4 rd = texture2D(uReliefData, vNormalMapUv);
      S.h01 = rd.r; S.cav = rd.g; S.edge = rd.b; S.groove = rd.a;
      // a map with nothing raised (a flange's incised faces): its lands are the wall (0.5, as a
      // plain mesh), not the tops of décor — otherwise they come out paler than the body
      S.h01 = mix(0.5 * S.h01, S.h01, tt_ss(0.03, 0.1, uReliefRange.y));
      plain = false;
    }
  #endif
  if (plain) {
    #ifdef PATINA_CAVITY_ATTR
      S.cav = vCavity;
    #else
      S.cav = uConstCavity;
    #endif
    S.h01 = 0.5; S.edge = 0.0; S.groove = 0.0;
    #ifdef PATINA_RELIEF
      S.inside = max(S.inside, 0.7); // the inner wall of a decorated panel (uv = -1)
      S.calm = max(S.calm, 0.7);
    #endif
  }
  S.edge = max(S.edge, gEdge);
  S.cav = clamp(S.cav - 0.45 * gCrease - 0.25 * max(-S.up, 0.0) - 0.3 * S.inside, 0.0, 1.0);
  S.rec = clamp((1.0 - S.cav) * mix(0.55, 1.35, uCrevice), 0.0, 1.0);
  S.burial = dot(S.n, normalize(vec3(0.3, -0.2, 0.93)));

  // ---- noise fields, vessel space mm
  vec3 so = vec3(uSeed * 17.13, uSeed * -9.71, uSeed * 5.37);
  float sizeBias = clamp(pow(max(uVesselSize.y, 50.0) / 300.0, 0.3), 0.75, 1.6);
  float tS = max(uPatchScale * sizeBias, 5.0);
  vec3 w = tt_warp(S.p / (tS * 1.6) + so);
  S.T = clamp(0.5 + 0.75 * fbm3(S.p / tS + 0.4 * w - so), 0.0, 1.0);
  S.T2 = clamp(0.5 + 0.8 * snoise(S.p / (tS * 0.55) + 1.4 * w + so.zxy), 0.0, 1.0);
  // territory kind: warped Voronoi cells (~0.5 territory across), one value per cell — sharp,
  // folded borders between regions that are different in kind (noble skin / cuprite film / crust)
  float mS = max(uMottleScale, 1.0);
  S.M = clamp(0.5 + 0.75 * tt_lod(mS, S.px) * fbm2(S.p / mS + 0.6 * w * (tS / mS) * 0.08 + so.yzx), 0.0, 1.0);
  float aS = max(uAzuriteScale, 1.0);
  S.A = clamp(0.5 + 0.85 * snoise(S.p / aS + 0.5 * w + so.zyx * 1.3), 0.0, 1.0);
  // gravity: runs ~6 mm wide, ~120 mm long, straight down the walls
  S.st = tt_lod(6.0, S.px) * snoise(vec3(S.p.x / 6.0, S.p.y / 120.0, S.p.z / 6.0) + so.yxz);
  float gS = max(uMalachiteScale, 0.3);
  float gLod = tt_lod(gS, S.px);
  S.G = clamp(0.5 + 0.6 * gLod * snoise(S.p / (gS * 0.6) - so), 0.0, 1.0);
  vec2 wb = worley8(S.p / gS + so.zyx);
  S.B = mix(0.5, clamp(1.0 - wb.x * wb.x * 1.6, 0.0, 1.0), gLod);
  // (looked up through the mottle, the second territory and the grain so the cell borders
  // are ragged at every scale instead of Voronoi-straight)
  S.K = worley8(S.p / (tS * 0.5) + 0.7 * w + vec3(0.9 * (S.M - 0.5), 0.7 * (S.T2 - 0.5), 0.45 * (S.G - 0.5) + 0.5 * (S.M - 0.5)) + so.xzy).y;
  // patchiness < 1: the territory fields break up at the mottle scale instead (fine speckled
  // skin, no 100 mm islands); the territory KIND too. Costs one simplex tap.
  float pat = clamp(uPatchiness, 0.0, 1.0);
  if (pat < 0.999) {
    float fS = max(mS * 0.7, 0.8);
    float Fn = tt_lod(fS, S.px) * snoise(S.p / fS + so.zxy * 0.7);
    // (the broad territory field still modulates the speckle's density: clusters, not a carpet)
    float Tf = clamp(0.5 + 0.8 * (S.M - 0.5) + 0.3 * Fn + 0.35 * (S.T - 0.5), 0.0, 1.0);
    float T2f = clamp(0.5 + 0.55 * Fn - 0.45 * (S.M - 0.5) + 0.12 * (S.G - 0.5), 0.0, 1.0);
    // kind at the speckle scale too: fine flecks of noble skin / cuprite / crust, not one wash
    float Kf = clamp(0.5 + 0.8 * Fn + 0.5 * (S.M - 0.5) + 0.15 * (S.G - 0.5) + 0.3 * (S.T2 - 0.5), 0.0, 1.0);
    S.T = mix(Tf, S.T, pat); S.T2 = mix(T2f, S.T2, pat); S.K = mix(Kf, S.K, pat);
  }
  // an interior is one quiet skin: no speckle, mottle only at territory scale
  S.M = mix(S.M, 0.5 + 0.2 * (S.T - 0.5), 0.9 * S.calm);
  S.G = mix(S.G, 0.5, 0.9 * S.calm);
  S.B = mix(S.B, 0.5, 0.9 * S.calm);
  S.st *= 1.0 - S.calm;

  // ---- the master dial: each layer arrives at its own point in the burial
  float a = clamp(uAge, 0.0, 1.0);
  float aT = tt_ss(0.0, 0.25, a);    // use-life tarnish
  float aC = tt_ss(0.08, 0.5, a);    // early cuprite
  float aN = tt_ss(0.3, 0.8, a);     // noble sheet
  float aM = tt_ss(0.35, 0.92, a);   // carbonate crust and film
  float aL = tt_ss(0.6, 1.0, a);     // late: azurite, blue-green phase, chlorides, soil, lime, streaks
  float aW = tt_ss(0.05, 0.6, a);    // handling / cleaning

  // ---- carbonate balance: area moves malachite → blue-green phase → azurite
  float bal = clamp(uCarbonate, 0.0, 1.0);
  float fracBG = (0.85 * tt_ss(0.0, 0.5, bal) - 0.15 * tt_ss(0.6, 1.0, bal)) * aL;
  float azAmt = clamp(uAzurite * (0.5 + 0.5 * bal) + 0.45 * tt_ss(0.5, 1.0, bal), 0.0, 0.85) * aL;

  float cCup = layerCuprite(S, uCuprite * aC);
  // a buried bronze has no bare metal under its patina: wherever a noble skin or carbonates
  // formed, the metal beneath them is corroded too (shows as the veiled brown skin, not gold)
  cCup = max(cCup, clamp(max(0.95 * uTinOxide * aN, 0.85 * uMalachite * aM), 0.0, 1.0));
  float cNob = layerNoble(S, uTinOxide * aN);
  float cMalR = layerMalachite(S, uMalachite * aM);
  float cFilm = layerCarbonateFilm(S, uMalachite * aM) * (1.0 - cMalR);
  float cBG = layerBlueGreen(S, fracBG);           // phase selector within the carbonates
  // azurite needs carbonate water: islands on the crust, or (recess-bound) in the grooves
  float azHost = clamp(cMalR + 0.6 * cFilm + 0.5 * S.rec * (1.0 - uBlueHabitat) + 0.3, 0.0, 1.0);
  float cAz = layerAzurite(S, azAmt) * tt_ss(0.15, 0.6, azHost);
  float cSoot = layerSoot(S, uSoot * aL);
  float cSoil = layerSoil(S, uEarth * aL) * (1.0 - 0.75 * S.calm);
  // chloride pustules: Poisson clusters (mottle × territory), denser low on the body,
  // at creases and on the burial side; each a spot of the crust-grain size over a pit
  float clus = tt_ss(0.6, 0.9, 0.55 * S.M + 0.45 * S.T2 + 0.25 * (1.0 - S.hgt) + 0.2 * gCrease + 0.1 * S.burial);
  vec2 wc = worley8(S.p / max(gS * 1.6, 0.6) - so.yxz);
  float spotR = 0.08 + 0.2 * uChloride;
  float cChlRaw = uChloride * aL * clus * step(wc.y, 0.15 + 0.45 * uChloride) * (1.0 - S.calm);
  float cChl = cChlRaw * (1.0 - tt_ss(spotR, spotR + 0.12, wc.x)) * gLod;
  float pitRing = cChlRaw * (tt_ss(spotR, spotR + 0.08, wc.x) - tt_ss(spotR + 0.1, spotR + 0.3, wc.x)) * gLod;
  // calcareous film: whitish dusting within soil territories, on up-facing crust, along the runs
  // — mostly sharp crusty islands (amount ≈ area), plus a faint general dust
  float calF = 0.45 * S.M + 0.3 * S.T2 + 0.2 * max(S.up, 0.0) + 0.15 * S.rec + 0.1 * uStreaks * S.st + 0.05 * (S.G - 0.5);
  float cCal = clamp(tt_cover(uCalcite * aL * 0.8, calF + 0.15, 0.05) * 0.9 + 0.2 * uCalcite * aL * tt_ss(0.3, 0.8, calF), 0.0, 1.0);

  // occlusion: crust occludes the noble sheet (alternatives per territory); cuprite rim
  // where a malachite island thins out
  cNob *= 1.0 - cMalR;
  float malRim = tt_ss(0.02, 0.2, cMalR) - tt_ss(0.25, 0.6, cMalR);

  // ---- relief tops rubbed clean (handling / old cleaning): darker, warmer skin on the plateaus
  // (raised = real mm above the L0 ground from the panel's range, so a 0.12 mm flush band
  // counts as much as a 2 mm plateau, and a tall boss does not squash every other top)
  float hMM = mix(uReliefRange.x, uReliefRange.y, S.h01);
  // (a map with nothing raised above L0 — a flange's incised faces — has no tops: its lands are
  // the wall, not décor bands; plain meshes only get the warm rubbing on arrises, never pale bands)
  float hasTops = tt_ss(0.03, 0.1, uReliefRange.y);
  float topK = plain ? 0.6 * S.edge * (1.0 - uTopsTone) : max(tt_ss(0.04, 0.22, hMM), 0.6 * tt_ss(0.6, 0.9, S.h01) * hasTops) * tt_ss(0.55, 0.9, S.cav) * (1.0 - S.groove);
  // the décor's sunk ground (not raised, on a panel that has raised décor) — for inlayGround
  float groundM = plain ? 0.0 : hasTops * (1.0 - tt_ss(0.02, 0.12, hMM)) * (1.0 - S.calm);
  topK *= uTops * aW * (1.0 - S.calm);

  // ---- wear / cleaning erase, top down (§3.4.9)
  float e = layerWear(S, uWear * aW);
  float kSoil = 1.0 - tt_ss(0.0, 0.15, e);
  float kCrust = (1.0 - tt_ss(0.1, 0.4, e)) * (1.0 - 0.85 * topK);
  float kNoble = 1.0 - tt_ss(0.35, 0.65, e);
  float kCup = 1.0 - tt_ss(0.6, 0.9, e);
  cSoil *= kSoil * (1.0 - topK); cCal *= kSoil * (1.0 - 0.7 * topK);
  float cMal = cMalR * kCrust; cFilm *= kCrust; cAz *= kCrust; cChl *= kCrust;
  cNob *= kNoble;
  cCup = max(cCup, malRim * uCuprite * aC * 0.8) * kCup;

  // crust thickness, mm: malachite deeper in recesses, botryoidal; soil lumps; chloride powder
  float tMal = cMal * uCrust * (0.3 + 0.7 * S.rec) * (0.55 + 0.45 * S.B);
  float tAz = cAz * uCrust * 0.7 * (0.6 + 0.4 * S.B) * mix(0.5, 1.0, uAzuriteDepth);
  float tSoil = cSoil * (0.4 + 1.6 * S.rec) * (0.6 + 0.4 * S.M);
  float thick = max(max(tMal, tAz), tSoil) + cChl * 0.25;

  // ---- L0 metal: F0 from tin, lead-dulled; tarnish browns it (§1.2); as-cast skin in recesses
  float tarn = clamp(uTarnish * aT + 0.15 * a * (1.0 - e), 0.0, 1.0) * (1.0 - 0.6 * tt_ss(0.7, 1.0, e));
  vec3 F0m = tt_metalF0(uTin, uLead);
  vec3 col = F0m * mix(vec3(1.0), vec3(0.78, 0.60, 0.45), tarn);
  col *= 1.0 - 0.35 * tarn * S.rec; // the film is darker where it is not polished off
  float polishR = mix(0.40, 0.12, uPolish);
  float rough = mix(polishR, 0.47, tt_ss(0.25, 0.8, S.rec)) + 0.06 * tarn;
  // burnished by handling where wear reached the metal; micro-pitted elsewhere once corroded
  rough = mix(rough, 0.24, tt_ss(0.7, 1.0, e) * (1.0 - uPolish * 0.5));
  rough += 0.12 * aC * uCuprite * (1.0 - e) * (S.G - 0.3);
  float metal = 1.0;
  float f0 = 0.04;

  // ---- inlay paste in the sunk lines (on the metal, under all corrosion)
  // (the sunk ground of a relief panel holds paste too, where the bake marks no groove)
  float cInl = uInlay * max(tt_ss(0.25, 0.7, S.groove), plain ? 0.0 : tt_ss(0.5, 0.8, 1.0 - S.cav));
  col = mix(col, vec3(0.007, 0.006, 0.005) * (0.8 + 0.4 * S.G), cInl);
  rough = mix(rough, 0.6, cInl); metal = mix(metal, 0.0, cInl);
  cCup *= 1.0 - cInl * 0.85; cNob *= 1.0 - cInl * 0.85;
  cMal *= 1.0 - cInl * 0.7; cFilm *= 1.0 - cInl * 0.8; cAz *= 1.0 - cInl * 0.5;

  // ---- L1 cuprite: liver / oxblood, compact & sub-metallic sheen (F0 ≈ 0.2)
  float cupT = clamp(0.45 * S.M + 0.35 * S.G + 0.3 * (1.0 - S.rec) - 0.1, 0.0, 1.0);
  vec3 cupCol = tt_pal(vec3(0.042, 0.012, 0.008), vec3(0.080, 0.024, 0.015), vec3(0.135, 0.045, 0.027), cupT * 0.8);
  // cupriteTone: compact liver/oxblood → pale powdery brick-pink (cuprite under a lime bloom, Houmuwu)
  cupCol = mix(cupCol, tt_pal(vec3(0.150, 0.068, 0.050), vec3(0.290, 0.150, 0.112), vec3(0.420, 0.250, 0.205), cupT), clamp(uCupriteTone, 0.0, 1.0));
  cupCol = mix(cupCol, cupCol * vec3(0.7, 0.62, 0.62), S.rec); // darker, browner in recesses
  col = mix(col, cupCol, cCup); rough = mix(rough, mix(0.38, 0.62, S.G), cCup); metal = mix(metal, 0.0, cCup); f0 = mix(f0, 0.18, cCup);

  // ---- L2 noble tin-oxide sheet: glossy, conformal, lighter on high points; gravity runs
  float nobT = clamp(0.36 + 0.12 * (S.M - 0.5) + 0.5 * (1.0 - S.rec) * (S.h01 - 0.4) - 0.25 * S.rec + 0.12 * (S.T2 - 0.5) - 0.12 * uStreaks * aL * S.st, 0.0, 1.0);
  vec3 nobCol = tt_nobleColor(uTinOxideTone, nobT);
  nobCol = mix(nobCol, vec3(tt_lum(nobCol)) * vec3(1.32, 0.98, 0.76), 0.9 * uNobleWarmth);
  col = mix(col, nobCol, cNob); rough = mix(rough, 0.2 + 0.12 * S.rec + 0.06 * S.M, cNob); metal = mix(metal, 0.0, cNob); f0 = mix(f0, 0.075, cNob);
  // outside the sheet a thinner, browner skin still veils the cuprite: warm brown, not raw red
  float veil = (1.0 - cNob) * cCup * uTinOxide * aN * (0.65 - 0.35 * S.rec) * (0.6 + 0.4 * S.M) * (1.0 - 0.75 * uCupriteTone);
  // (a grey, tin-rich 水银古 skin veils it greyer: less of the cuprite's warmth comes through)
  float veilCup = 0.45 * (1.0 - 0.7 * clamp(uTinOxideTone - 1.0, 0.0, 1.0));
  col = mix(col, nobCol * (1.2 - veilCup) + cupCol * veilCup, veil); rough = mix(rough, 0.32, veil);

  // ---- L3 soot / tenorite low on the body
  col = mix(col, vec3(0.022, 0.018, 0.014), cSoot * 0.85); rough = mix(rough, 0.8, cSoot * 0.85); metal = mix(metal, 0.0, cSoot * 0.85);

  // ---- L4 carbonates. Malachite: dark & compact under thin crust, banded light on domes,
  // a paler powder packed in the recesses. The blue-green phase replaces it per territory.
  float band = tt_ridged(S.p / (gS * 2.2) + w * 0.6);
  float malT = clamp(0.5 + 0.4 * (S.M - 0.5) + 0.12 * (S.B - 0.5) * tt_ss(0.0, 0.8, uCrust) + 0.12 * (band - 0.5) + 0.12 * S.rec + 0.3 * (S.T - 0.5) - 0.1 + 0.7 * (uMalachiteTone - 0.5), 0.0, 1.0);
  vec3 malCol = tt_malachiteColor(uMalachiteHue, malT);
  vec3 tqCol = tt_turquoiseColor(uTurquoiseTone, clamp(malT + 0.08 + 0.15 * (S.G - 0.5), 0.0, 1.0));
  vec3 carbCol = mix(malCol, tqCol, cBG);
  // thin crust lets the cuprite through: red-brown show-through
  float thin = 1.0 - tt_ss(0.05, 0.45, tMal + 0.25 * cMal * (1.0 - uCrust * 0.3));
  carbCol = mix(carbCol, cupCol + carbCol * 0.25, thin * 0.5 * uCuprite);
  // the film: a thin translucent stain over whatever is below — darkens and tints, no body
  // (a pale, earthy carbonate is a chalky powder film instead: it lightens what it veils)
  vec3 filmTint = mix(malCol, tqCol, cBG);
  vec3 filmCol = mix(mix(col, col * 0.55 + filmTint * 0.45, 0.85), mix(col, filmTint, 0.75), tt_ss(0.5, 1.0, uMalachiteTone));
  col = mix(col, filmCol, cFilm); rough = mix(rough, rough + 0.12, cFilm);
  col = mix(col, carbCol, cMal);
  rough = mix(rough, mix(0.45, 0.8, tt_ss(0.2, 2.0, uCrust)) - 0.1 * S.B + 0.12 * cBG, cMal); metal = mix(metal, 0.0, max(cMal, cFilm * 0.6)); f0 = mix(f0, 0.065, cMal);

  // ---- L5 azurite islands: thresholded, never blended into teal. Deep = crystalline, glassy
  float azT = clamp(0.4 + 0.5 * (S.B - 0.5) + 0.4 * (S.M - 0.5) + 0.25 * (S.G - 0.5) - 0.2 * S.rec, 0.0, 1.0);
  vec3 azCol = tt_azuriteColor(uAzuriteDepth, azT);
  col = mix(col, azCol, cAz);
  rough = mix(rough, mix(0.85, 0.32, uAzuriteDepth) + 0.15 * (S.G - 0.5) * uAzuriteDepth, cAz); metal = mix(metal, 0.0, cAz); f0 = mix(f0, mix(0.04, 0.075, uAzuriteDepth), cAz);

  // ---- L6 chlorides: pale chalky bluish green over a pit, dark ring of cuprite
  col = mix(col, cupCol * 0.55, pitRing * 0.8);
  vec3 chlCol = tt_pal(vec3(0.159, 0.423, 0.238), vec3(0.314, 0.597, 0.381), vec3(0.546, 0.761, 0.597), S.G);
  col = mix(col, chlCol, cChl); rough = mix(rough, 0.97, cChl); metal = mix(metal, 0.0, cChl);

  // ---- L7 relief tops: rubbed to a darker, warmer, smoother skin
  vec3 topWarm = mix(col, col * vec3(0.62, 0.52, 0.42) + cupCol * 0.35, 0.8);
  // or paler: a thinner, abraded noble skin over the metal reads silvery grey against a dark ground
  vec3 topPale = mix(col, vec3(tt_lum(col)) * vec3(0.97, 1.0, 0.98) * 1.9 + vec3(0.024, 0.027, 0.025), 0.85);
  vec3 topCol = mix(topWarm, topPale, clamp(uTopsTone, 0.0, 1.0));
  col = mix(col, topCol, topK * 0.75); rough = mix(rough, rough * 0.75, topK);

  // ---- L8 soil and calcareous film
  vec3 soilCol = uEarthColor * uEarthColor; // sRGB pick → ~linear
  soilCol = mix(soilCol * 0.62, mix(soilCol, vec3(0.644, 0.509, 0.301), 0.4), clamp(S.M * 0.8 + 0.4 * (S.G - 0.5), 0.0, 1.0));
  col = mix(col, soilCol, cSoil); rough = mix(rough, 0.95, cSoil); metal = mix(metal, 0.0, cSoil); f0 = mix(f0, 0.04, cSoil);
  vec3 calCol = tt_pal(vec3(0.470, 0.455, 0.400), vec3(0.640, 0.630, 0.585), vec3(0.820, 0.810, 0.770), S.G);
  float calA = cCal * (0.5 + 0.35 * cSoil) * (1.0 - cChl);
  // lime film: lightens and greys what it sits on rather than painting it beige
  float lumC = tt_lum(col);
  vec3 film = mix(calCol * 0.7, mix(col, vec3(lumC), 0.55) * 1.5 + vec3(lumC) * 0.6, 0.65);
  col = mix(col, film, calA); rough = mix(rough, 0.88, calA); metal = mix(metal, 0.0, calA);

  // ---- gravity: darker runs down the walls, one pale tide line where the water stood
  float runs = uStreaks * aL * (1.0 - S.inside) * tt_ss(0.25, 0.85, S.st) * (0.5 + 0.5 * tt_ss(-0.2, 0.6, S.T2 - 0.3 + S.M * 0.6));
  col *= 1.0 - 0.28 * runs * (1.0 - metal);
  float tideH = 0.22 + 0.3 * fract(uSeed * 0.618);
  float tide = uStreaks * aL * (1.0 - tt_ss(0.0, 0.012, abs(S.hgt - tideH + 0.03 * (S.M - 0.5)))) * (1.0 - S.inside) * (0.4 + 0.6 * S.M);
  col = mix(col, mix(col, vec3(tt_lum(col)) * 1.6 + calCol * 0.12, 0.7), tide * 0.6 * (1.0 - metal));

  // ---- an interior: one calm corroded skin — dark grey-brown → pale green (interiorTone)
  // (only a slow, low-contrast breathing of the tone: no territories, no speckle; a little
  // paler on up-facing floors where fine silt settled, darker deep down)
  vec3 skin = mix(vec3(0.026, 0.025, 0.020), vec3(0.075, 0.098, 0.068), uInteriorTone) * (0.9 + 0.16 * S.T + 0.06 * S.T2 + 0.08 * max(S.up, 0.0));
  skin = mix(skin, cupCol * 0.55, 0.1 * (1.0 - uInteriorTone));
  float skinK = tt_ss(0.0, 0.7, S.calm) * tt_ss(0.2, 0.7, a) * 0.96;
  col = mix(col, skin, skinK); rough = mix(rough, 0.8, skinK); metal = mix(metal, 0.0, skinK); f0 = mix(f0, 0.045, skinK);

  // ---- inlayGround: black paste (or packed dark dirt) fills the whole sunk ground of the décor —
  // the lands of the leiwen too — so flush bands read light on a black field (Met zun). It is what
  // shows after cleaning, so it sits over the corrosion, under the dust
  float cGnd = uInlayGround * groundM * (0.85 + 0.15 * S.G) * (1.0 - 0.6 * cSoil);
  col = mix(col, vec3(0.010, 0.010, 0.009) * (0.8 + 0.5 * S.M), cGnd * 0.92);
  rough = mix(rough, 0.62, cGnd); metal = mix(metal, 0.0, cGnd); f0 = mix(f0, 0.045, cGnd);
  cInl = max(cInl, cGnd);

  // ---- dulling: dust, old wax and fine soil in the pores grey the minerals down
  float dull = uDulling * a * (1.0 - metal);
  float lumD = tt_lum(col);
  col = mix(col, vec3(lumD) * vec3(1.0, 1.01, 0.985), dull * 0.72);

  // ---- dirt and wax in recesses on cleaned pieces (§3.4.10), museum wax sheen
  float dirt = uRecessDirt * pow(S.rec, 1.5) * (1.0 - cSoil);
  col *= 1.0 - 0.7 * dirt; rough = min(1.0, rough + 0.3 * dirt);
  rough = mix(rough, min(rough, 0.34), uWax * (1.0 - metal) * (1.0 - cChl)); f0 += 0.02 * uWax * (1.0 - metal);

  // ---- matte: an excavated skin is micro-pitted and dusty — a soft sheen at most, never a
  // broad glossy highlight. Raises the roughness floor (wax included), more in recesses;
  // even metal rubbed bare stays satin; dielectric F0 eased toward 0.045
  float mt = clamp(uMatte, 0.0, 1.0) * tt_ss(0.1, 0.6, a);
  rough = mix(rough, max(rough, mix(0.6, 0.82, S.rec) + 0.06 * (S.G - 0.5)), mt * (1.0 - 0.35 * metal));
  f0 = mix(f0, min(f0, 0.05), 0.6 * mt);

  ttF0 = f0;
  if (uPatinaMode > 0.5) {
    if (uPatinaMode > 2.5) {
      // mask: which layer is on top, false colour, unlit
      vec3 m = mix(vec3(0.85, 0.65, 0.25), vec3(1.0), tt_ss(0.7, 1.0, e));           // metal (white = worn bright)
      m = mix(m, vec3(0.75, 0.10, 0.05), cCup);                                       // cuprite red
      m = mix(m, vec3(0.55, 0.25, 0.75), cNob);                                       // noble sheet violet
      m = mix(m, vec3(0.05, 0.05, 0.05), max(cInl, cSoot * 0.85));                    // inlay / soot black
      m = mix(m, vec3(0.35, 0.55, 0.35), cFilm);                                      // carbonate film grey-green
      m = mix(m, mix(vec3(0.10, 0.80, 0.25), vec3(0.10, 0.75, 0.70), cBG), cMal);     // malachite green / blue-green phase teal
      m = mix(m, vec3(0.10, 0.30, 1.00), cAz);                                        // azurite blue
      m = mix(m, vec3(0.20, 1.00, 1.00), cChl);                                       // chloride cyan
      m = mix(m, vec3(1.00, 0.85, 0.10), cSoil);                                      // soil yellow
      m = mix(m, vec3(1.00, 0.70, 0.80), calA);                                       // calcite pink
      m = mix(m, vec3(0.45, 0.30, 0.20), skinK);                                      // interior skin brown
      m *= 0.55 + 0.45 * clamp(1.0 - thick * 0.25, 0.0, 1.0);                         // darker = thicker crust
      totalEmissiveRadiance = m;
      col = vec3(0.0); rough = 1.0; metal = 0.0;
    } else {
      // clay / height: relief only, no patina
      float g = uPatinaMode > 1.5 ? 0.0 : 0.42;
      col = vec3(g); rough = 0.62; metal = 0.0; ttF0 = 0.04;
      if (uPatinaMode > 1.5) totalEmissiveRadiance = plain ? vec3(0.12) : vec3(S.h01);
    }
  } else {
    // encrustation softens the cast line work: flatten the relief normal under thick crust
    // (and in grooves filled flush with paste), then add the crust's own lumps and pits
    float flatK = clamp(tt_ss(0.0, 1.4, thick) * 0.9 + cInl * 0.6, 0.0, 0.95);
    normal = normalize(mix(normal, nonPerturbedNormal, flatK));
    float bumpH = (tMal * 0.35 * (S.B - 0.5) + tSoil * 0.4 * (S.M - 0.5) + tAz * 0.3 * S.B + cChl * 0.15 - pitRing * 0.25) * gLod
                + 0.02 * aC * (S.G - 0.5) * gLod;
    normal = tt_bump(normal, bumpH, vp);
  }

  diffuseColor.rgb = col;
  roughnessFactor = clamp(rough, 0.04, 1.0);
  metalnessFactor = clamp(metal, 0.0, 1.0);
}
`,Sa=Math.PI/180;function Dc(n){var vt,bt;const{from:t,to:e,out:i,height:s=10,thickness:r=4,notches:a={every:22,depth:.4,width:3},hook:o=0,ends:c={},embed:l,taper:h=3,bevel:u,waver:f=.5,seed:d=1,incise:g="auto",material:_,part:p="flanges"}=n,m=n.path||If(t,e,i),x=m.length,v=new $e(d),M=typeof s=="function"?s:()=>s,E=kf(Mt=>M(Mt),24),w=l??Math.max(.6,Math.min(r*.6,2)),b={start:vo(c.start),end:vo(c.end??(o>0?{type:"beak",length:o}:"square"))},C=n.outline?{...wM(n.outline,n.grooves),...n.grooveStyle?{groove:n.grooveStyle}:{}}:Df({length:x,height:M,notches:a,ends:b,embed:w,waver:f,rng:v.fork("outline")}),S=C.points;let T=1/0,L=-1/0,P=0;for(const[Mt,yt]of S)T=Math.min(T,Mt),L=Math.max(L,Mt),P=Math.max(P,yt);const W=AM(m,T-1,L+1,.5),R=oc(v.fork("sway"),T,L,Math.max(12,x/4)),I=oc(v.fork("thick"),T,L,Math.max(15,x/3)),D=.25*f*Math.min(1,r/4),z=(Mt,yt)=>{const wt=r/2*(1+.1*f*I(Mt));return Math.max(wt*.45,wt-Math.tan(h*Sa)*Math.max(0,yt))},B=Math.tan(h*Sa),F=u??Math.min(.8,Math.max(.25,r*.12)),X=(Mt,yt,wt,ht)=>{const At=W(Mt),Ut=wt+D*R(Mt);return ht.set(At.p.x+At.n.x*yt+At.b.x*Ut,At.p.y+At.n.y*yt+At.b.y*Ut,At.p.z+At.n.z*yt+At.b.z*Ut),ht},tt=Ic(S,F),J=W((T+L)/2),U={p:J.p.clone(),n:J.n.clone(),d:J.d.clone()},Y=new q,G=tt.map(([Mt,yt])=>(X(Mt,yt,0,Y).sub(U.p),new Lt(Y.dot(U.d),Y.dot(U.n)))),K=_s.triangulateShape(G,[]),Q=L-T,nt=P+w,rt=!_||_.isPatinaMaterial;let ct=null,_t=_;(g==="auto"?rt:g)&&C.grooves.length&&(ct=EM(C,{w:Q,h:nt,sMin:T,e:w,thickness:r,seed:d}),_t=new Se({relief:ct,cavity:((bt=(vt=_==null?void 0:_.local)==null?void 0:vt.uConstCavity)==null?void 0:bt.value)??.8})),_t||(_t=new Se);const H=(Mt,yt)=>[(Mt-T)/Q,(yt+w)/nt],V=[],j=[],it=[],st=[],St=[],ut=new q,y=(Mt,yt,wt,ht,At,Ut)=>(X(Mt,yt,wt,ut),V.push(ut.x,ut.y,ut.z),j.push(ht.x,ht.y,ht.z),it.push(At[0],At[1]),st.push(Ut.x,Ut.y,Ut.z,Ut.w),V.length/3-1),A=(Mt,yt)=>{const wt=W(Mt);return new q().copy(wt.b).multiplyScalar(yt).addScaledVector(wt.n,B).normalize()};for(const Mt of[1,-1]){const yt=V.length/3;for(const[wt,ht]of tt){const At=W(wt);y(wt,ht,Mt*z(wt,ht),A(wt,Mt),H(wt,ht),{x:At.d.x,y:At.d.y,z:At.d.z,w:Mt})}for(const[wt,ht,At]of K){const Ut=new q().fromArray(V,(yt+wt)*3),Ct=new q().fromArray(V,(yt+ht)*3),Dt=new q().fromArray(V,(yt+At)*3),Rt=Ct.sub(Ut).cross(Dt.sub(Ut)),k=A(tt[wt][0],Mt);Rt.dot(k)>=0?St.push(yt+wt,yt+ht,yt+At):St.push(yt+wt,yt+At,yt+ht)}}const $=Uf(S),ft=S.length;for(let Mt=0;Mt<ft;Mt++){const yt=(Mt+1)%ft,wt=[Mt,yt].map((Ct,Dt)=>{const Rt=$[Dt===0?(Ct-1+ft)%ft:yt];let k=$[Mt];Rt[0]*k[0]+Rt[1]*k[1]>Math.cos(40*Sa)&&(k=Nf([Rt[0]+k[0],Rt[1]+k[1]]));const[Tt,Nt]=S[Ct],Z=W(Tt),et=new q().copy(Z.d).multiplyScalar(k[0]).addScaledVector(Z.n,k[1]).normalize();return{q:Ct,s:Tt,t:Nt,side3:et,F:{d:Z.d.clone()}}}),ht=(Ct,Dt)=>{const{q:Rt,s:k,t:Tt,side3:Nt,F:Z}=Ct,et={x:Z.d.x,y:Z.d.y,z:Z.d.z,w:1},N=z(k,Tt),[at,xt]=tt[Rt];return Dt===0?y(at,xt,N,new q().copy(Nt).add(A(k,1)).normalize(),H(at,xt),et):Dt===1?y(k,Tt,N-F,new q().copy(Nt).multiplyScalar(2).add(A(k,1)).normalize(),H(k,Tt),et):Dt===2?y(k,Tt,-(N-F),new q().copy(Nt).multiplyScalar(2).add(A(k,-1)).normalize(),H(k,Tt),et):y(at,xt,-N,new q().copy(Nt).add(A(k,-1)).normalize(),H(at,xt),et)},At=[0,1,2,3].map(Ct=>ht(wt[0],Ct)),Ut=[0,1,2,3].map(Ct=>ht(wt[1],Ct));for(let Ct=0;Ct<3;Ct++){const Dt=At[Ct],Rt=At[Ct+1],k=Ut[Ct+1],Tt=Ut[Ct],Nt=new q().fromArray(V,Dt*3),Z=new q().fromArray(V,Rt*3),N=new q().fromArray(V,Tt*3).clone().sub(Nt).cross(Z.clone().sub(Nt)),at=new q().fromArray(j,Dt*3);N.dot(at)>=0?St.push(Dt,Tt,k,Dt,k,Rt):St.push(Dt,Rt,k,Dt,k,Tt)}}const ot=new Ke;ot.setAttribute("position",new Me(V,3)),ot.setAttribute("normal",new Me(j,3)),ot.setAttribute("uv",new Me(it,2)),ot.setAttribute("tangent",new Me(st,4)),ot.setIndex(St),ot.computeBoundingBox(),ot.computeBoundingSphere();const dt=new ue(ot,_t);return dt.userData.part=p,dt.userData.flange={length:x,outline:S,relief:ct,height:E},dt.castShadow=dt.receiveShadow=!0,dt}function vo(n){return n?typeof n=="string"?{type:n}:{type:"square",...n}:{type:"square"}}function Df({length:n,height:t,notches:e,ends:i,embed:s,waver:r=.5,rng:a=new $e(1)}){const o=typeof t=="function"?t:()=>t,c=kf(o,16),l=oc(a.fork("crest"),-n,2*n,Math.max(8,n/6)),h=X=>Math.max(.5,o(Math.min(1,Math.max(0,X/n)))*(1+.035*r*l(X))),u=vo(i==null?void 0:i.start),f=vo(i==null?void 0:i.end),d=X=>{let tt=1;return u.type==="taper"&&(tt=Math.min(tt,.2+.8*Ch(X/(u.length??c*1.5)))),f.type==="taper"&&(tt=Math.min(tt,.2+.8*Ch((n-X)/(f.length??c*1.5)))),tt},g=X=>h(X)*d(X),_=e===null||e===!1?{shape:"none"}:{shape:"square",...e};_.every!=null&&_.pitch==null&&(_.pitch=_.every);const p=_.shape||"square",m=_.pitch??(p==="score"?Math.max(3,c*.45):Math.max(6,c*1.5)),x=_.depth??(p==="score"?.28:p==="hook"?.5:.42),v=_.width??(p==="score"?Math.max(1,m*.38):Math.max(1.5,m*.3)),M=Lh(f,n,g(n),c,1),E=M.length?M[M.length-1][0]:n,w=Lh(u,0,g(0),c,-1).reverse(),b=w.length?w[0][0]:0,C=Math.max(0,b),S=Math.min(n,E),T=p==="none"?1:Math.max(1,Math.round((S-C)/m)),L=(S-C)/T,P=[];for(let X=1;X<T;X++)P.push(C+X*L+(a.next()-.5)*.12*L*r);const W=[];for(let X=0;X<T;X++)W.push([X===0?C:P[X-1]+v/2,X===T-1?S:P[X]-v/2]);const R=[],I=(X,tt)=>{const J=R[R.length-1];(!J||Math.abs(J[0]-X)>1e-4||Math.abs(J[1]-tt)>1e-4)&&R.push([X,tt])},D=(X,tt,J)=>{const U=Math.max(1,Math.ceil(Math.abs(X-tt)/1.2));for(let Y=0;Y<=U;Y++){const G=X+(tt-X)*Y/U;I(G,J(G))}};I(0,-s),I(n,-s);for(const X of M)I(X[0],X[1]);M.length||I(n,g(n));const z=[],B=X=>x*g(X);for(let X=T-1;X>=0;X--){const[tt,J]=W[X],U=X===T-1?Math.min(E,n):J,Y=X===0?Math.max(b,0):tt;if(p==="hook"&&X<T-1){const G=J-tt,K=Math.min(G*.45,c*.9),Q=Math.min(G*.22,K*.6),nt=.24,rt=.3;I(J,g(J)),D(J,J-K,g),I(J-K,g(J-K)*(1-nt)),I(J-K+Q,g(J-K+Q)*(1-nt)),I(J-K+Q,g(J-K+Q)*(1-rt)),D(J-K+Q,Y,ct=>g(ct)*(1-rt))}else p==="hook"?D(U,Y,G=>g(G)*(X===T-1?1:.7)):D(U,Y,g);if(X>0){const G=P[X-1],K=G+v/2,Q=G-v/2;I(K,g(K)-B(K)),I(Q,g(Q)-B(Q)),I(Q,g(Q))}}for(const X of w)I(X[0],X[1]);I(w.length?w[w.length-1][0]:0,-s),R.length>2&&Math.hypot(R[0][0]-R[R.length-1][0],R[0][1]-R[R.length-1][1])<1e-4&&R.pop();const F=Math.min(1.5,c*.18);if(p==="score"){const X=_.rungs==="full";if(!X){const tt=[],J=Math.max(0,b),U=Math.min(n,E),Y=Math.max(2,Math.ceil((U-J)/1.5));for(let G=0;G<=Y;G++){const K=J+(U-J)*G/Y;tt.push([K,g(K)-B(K)-F*.8])}z.push(tt)}for(const tt of P)z.push([[tt,g(tt)-B(tt)],[tt,X?Math.min(.4,g(tt)*.1):g(tt)-B(tt)-F*.8]])}else if(p!=="none"){const X=Ic(R,F);let tt=[];for(let U=0;U<X.length;U++){const[Y,G]=X[U];G>Math.max(F,.3*c)&&Y>b+F*.5&&Y<E-F*.5?tt.push([Y,G]):tt.length&&(tt.length>1&&z.push(tt),tt=[])}tt.length>1&&z.push(tt);const J=_.pattern||(p==="T"||p==="square"?["T"]:p==="L"?["L","J"]:[]);W.forEach(([U,Y],G)=>{const K=J.length?J[G%J.length]:null;if(!K||Y-U<F*4)return;const Q=K==="T"?(U+Y)/2:K==="L"?U+F*1.6:Y-F*1.6,nt=g(Q)-F*1.1,rt=Math.max(.2*c,nt-.55*g(Q));nt-rt>F&&z.push([[Q,nt],[Q,rt]])})}return{points:R,grooves:z,segments:W,cuts:P,width:v,depth:x,pitch:m,shape:p,groove:_.groove}}function wM(n,t){const e=n.map(([o,c])=>[o,c]);if(t)return{points:e,grooves:t,segments:[]};let i=0;for(const[,o]of e)i=Math.max(i,o);const s=Math.min(1.5,i*.18),r=[];let a=[];for(const[o,c]of Ic(e,s))c>Math.max(s,.3*i)?a.push([o,c]):a.length&&(a.length>1&&r.push(a),a=[]);return a.length>1&&r.push(a),{points:e,grooves:r,segments:[]}}function Lh(n,t,e,i,s){const r=n.length??i*.8;switch(n.type){case"beak":return[[t+s*r*.15,e*.55],[t+s*r,e]];case"hook":{const a=n.height??e*1.15;return[[t,e*.35],[t+s*r*.55,a*.55],[t+s*r,a*.85],[t+s*r*.85,a],[t+s*r*.2,a*.98]]}case"step":{const a=n.under??Math.max(.5,e*.12),o=Math.min(r*.3,e*.15);return[[t,a],[t+s*(r-o),a],[t+s*r,a+o],[t+s*r,e-o],[t+s*(r-o),e]]}case"spur":{const a=n.height??e*2,o=n.length??i*.7,c=n.sweep??Math.max(o*2.2,(a-e)*1.4),l=u=>t-s*u,h=[];for(let u=1;u<=6;u++){const f=u/6;h.push([l(o*Math.pow(f,1.6)),a*.94*f])}h.push([l(o+.5),a]);for(let u=1;u<=8;u++){const f=u/8;h.push([l(o+.5+c*f),e+(a-e)*(1-f)*(1-f)])}return h}default:return[]}}function EM(n,{w:t,h:e,sMin:i,e:s,thickness:r,seed:a}){var u,f;const o=Math.min(8,1e3/t,500/e),c=new ar({width:t,height:e,ppmm:o,seed:a}),l=Math.min(1.3,Math.max(.7,r/4)),h=((u=n.groove)==null?void 0:u.width)??.55*l;return c.sink(d=>{d.lineWidth=h,d.lineCap="round",d.lineJoin="round";for(const g of n.grooves)d.beginPath(),g.forEach(([_,p],m)=>m?d.lineTo(_-i,p+s):d.moveTo(_-i,p+s)),d.stroke()},{depth:((f=n.groove)==null?void 0:f.depth)??.35*l,profile:"u"}),c.bake()}function If(n,t,e){const i=new q().subVectors(t,n),s=i.length();i.normalize();const r=e.clone().addScaledVector(i,-e.dot(i)).normalize(),a=new q().crossVectors(i,r);return{isPath:!0,planar:!0,kind:"straight",length:s,frame:o=>({p:n.clone().addScaledVector(i,o),n:r,d:i,b:a})}}function TM(n,t,e){return If(n,t,e)}function AM(n,t,e,i){const s=Math.max(2,Math.ceil((e-t)/i)),r=[];for(let o=0;o<=s;o++){const c=t+(e-t)*o/s,l=n.frame(c);r.push({p:l.p.clone(),n:l.n.clone(),d:l.d.clone(),b:(l.b||new q().crossVectors(l.d,l.n)).clone()})}const a={p:new q,n:new q,d:new q,b:new q};return o=>{const c=Math.min(s,Math.max(0,(o-t)/(e-t)*s)),l=Math.min(s-1,Math.floor(c)),h=c-l,u=r[l],f=r[l+1];return a.p.lerpVectors(u.p,f.p,h),a.n.lerpVectors(u.n,f.n,h).normalize(),a.d.lerpVectors(u.d,f.d,h).normalize(),a.b.lerpVectors(u.b,f.b,h).normalize(),a}}function Uf(n){const t=n.length,e=[];for(let i=0;i<t;i++){const s=n[i],r=n[(i+1)%t];e.push(Nf([r[1]-s[1],-(r[0]-s[0])]))}return e}function Nf(n){const t=Math.hypot(n[0],n[1])||1;return[n[0]/t,n[1]/t]}function Ic(n,t){const e=n.length,i=Uf(n);return n.map((s,r)=>{const a=i[(r-1+e)%e],o=i[r];let c=a[0]+o[0],l=a[1]+o[1];const h=Math.hypot(c,l);h<1e-6?(c=o[0],l=o[1]):(c/=h,l/=h);const u=Math.max(.35,c*o[0]+l*o[1]),f=t/u;return[s[0]-c*f,s[1]-l*f]})}function Ch(n){return n=Math.min(1,Math.max(0,n)),n*n*(3-2*n)}function kf(n,t){let e=0;for(let i=0;i<=t;i++)e=Math.max(e,n(i/t));return e}function oc(n,t,e,i){const s=Math.max(2,Math.ceil((e-t)/i)+2),r=[];for(let a=0;a<=s;a++)r.push(n.next()*2-1);return a=>{const o=Math.min(s-1e-6,Math.max(0,(a-t)/i)),c=Math.floor(o),l=o-c,h=l*l*(3-2*l);return r[c]*(1-h)+r[c+1]*h}}const wa={C:"corner",c:"corner",corner:"corner",L:"lip",l:"lip",lip:"lip",S:"smooth",s:"smooth",smooth:"smooth"};function RM(n){return Array.isArray(n)?{r:+n[0],y:+n[1],join:wa[n[2]]||"smooth",name:n[3]??(typeof n[2]=="string"&&!wa[n[2]]?n[2]:null)}:{r:+n.r,y:+n.y,join:wa[n.join]||(n.corner?"corner":"smooth"),name:n.name??null}}function PM(n,t,e,i,s,r){const a=(u,f)=>Math.max(1e-6,Math.pow(Math.hypot(f[0]-u[0],f[1]-u[1]),.5)),c=0+a(n,t),l=c+a(t,e),h=l+a(e,i);for(let u=1;u<=s;u++){const f=c+(l-c)*u/s,d=[0,0];for(let g=0;g<2;g++){const _=(c-f)/(c-0)*n[g]+(f-0)/(c-0)*t[g],p=(l-f)/(l-c)*t[g]+(f-c)/(l-c)*e[g],m=(h-f)/(h-l)*e[g]+(f-l)/(h-l)*i[g],x=(l-f)/(l-0)*_+(f-0)/(l-0)*p,v=(h-f)/(h-c)*p+(f-c)/(h-c)*m;d[g]=(l-f)/(l-c)*x+(f-c)/(l-c)*v}r.push(d)}}function LM(n,t,e){const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)}function CM(n,t,e){const i=Math.abs(t)/e;return i>=1?0:n==="flat"?LM(1,.6,i):n==="v"?1-i:n==="step"?1:Math.sqrt(1-i*i)}class Ns{constructor(t,{registers:e={},ridges:i=[],step:s=.15,mode:r="spline",smooth:a=0}={}){if(this.isProfile=!0,this.source=t.map(RM),this.source.length<2)throw new Error("Profile: need at least two points");this.step=s,this.mode=r,this._build(r,a),this.labels={},this.source.forEach((o,c)=>{o.name&&(this.labels[o.name]=this._srcS[c])}),this.ridges=[],this.registers={};for(const o of i)this.addRidges(o);for(const[o,c]of Object.entries(e))this.setRegister(o,c)}_build(t,e){const i=this.source,s=[];let r=[0];for(let l=1;l<i.length;l++)r.push(l),i[l].join==="corner"&&l<i.length-1&&(s.push(r),r=[l]);s.push(r);const a=[],o=new Set,c=new Array(i.length).fill(0);for(const l of s){const h=l.map(u=>[i[u].r,i[u].y]);a.length?o.add(a.length-1):(a.push(h[0]),c[l[0]]=0);for(let u=0;u<h.length-1;u++){const f=h[u],d=h[u+1],g=Math.max(1,Math.ceil(Math.hypot(d[0]-f[0],d[1]-f[1])/this.step));if(t==="polyline"||h.length<3)for(let _=1;_<=g;_++)a.push([f[0]+(d[0]-f[0])*_/g,f[1]+(d[1]-f[1])*_/g]);else{const _=u>0?h[u-1]:[2*f[0]-d[0],2*f[1]-d[1]],p=u+2<h.length?h[u+2]:[2*d[0]-f[0],2*d[1]-f[1]];PM(_,f,d,p,g,a)}c[l[u+1]]=a.length-1}}t==="polyline"&&e>0&&Dh(a,o,e,this.step),this._pts=a,this._corners=o,this._srcIdx=c,this._finish(),this._srcS=c.map(l=>this.S[l])}_finish(){const t=this._pts,e=t.length,i=new Float64Array(e);for(let c=1;c<e;c++)i[c]=i[c-1]+Math.hypot(t[c][0]-t[c-1][0],t[c][1]-t[c-1][1]);this.S=i,this.length=i[e-1];const s=[];for(let c=0;c<e-1;c++){const l=t[c+1][0]-t[c][0],h=t[c+1][1]-t[c][1],u=Math.hypot(l,h)||1;s.push([l/u,h/u])}this._T=s,this.cornerS=[...this._corners].sort((c,l)=>c-l).map(c=>i[c]);let r=1/0,a=-1/0,o=0;for(const c of t)r=Math.min(r,c[1]),a=Math.max(a,c[1]),o=Math.max(o,c[0]);this.bounds={yMin:r,yMax:a,rMax:o,height:a-r}}_seg(t){const e=this.S;if(t<=0)return 0;if(t>=this.length)return e.length-2;let i=0,s=e.length-1;for(;s-i>1;){const r=i+s>>1;e[r]<=t?i=r:s=r}return i}_vtan(t,e){const i=this._T;if(t<=0)return i[0];if(t>=i.length)return i[i.length-1];if(this._corners.has(t))return e<0?i[t-1]:i[t];const s=i[t-1],r=i[t],a=s[0]+r[0],o=s[1]+r[1],c=Math.hypot(a,o)||1;return[a/c,o/c]}at(t,e=0){t=Math.min(Math.max(t,0),this.length);const i=this._seg(t),s=this.S,r=this._pts[i],a=this._pts[i+1],o=s[i+1]>s[i]?(t-s[i])/(s[i+1]-s[i]):0,c=e||(t>=this.length?-1:1);let l,h;o<=1e-9&&this._corners.has(i)?l=h=this._vtan(i,c):o>=1-1e-9&&this._corners.has(i+1)?l=h=this._vtan(i+1,c):(l=this._vtan(i,1),h=this._vtan(i+1,-1));let u=l[0]+(h[0]-l[0])*o,f=l[1]+(h[1]-l[1])*o;const d=Math.hypot(u,f)||1;return u/=d,f/=d,{s:t,r:r[0]+(a[0]-r[0])*o,y:r[1]+(a[1]-r[1])*o,nr:f,ny:-u,tr:u,ty:f}}atT(t,e){return this.at(t*this.length,e)}sAtY(t,{from:e="bottom"}={}){const i=this._pts,s=i.length,r=e==="top"?[...Array(s-1).keys()].reverse():[...Array(s-1).keys()];for(const a of r){const o=i[a][1],c=i[a+1][1];if((o-t)*(c-t)<=0&&o!==c){const l=(t-o)/(c-o);return this.S[a]+l*(this.S[a+1]-this.S[a])}}return t<=this.bounds.yMin?0:this.length}rAtY(t,e){return this.at(this.sAtY(t,e)).r}resolveS(t,e){if(t==null)return null;if(typeof t=="string"){if(!(t in this.labels))throw new Error(`Profile: no point labelled '${t}'`);return this.labels[t]}return typeof t=="object"&&"s"in t?t.s:this.sAtY(+t,{from:e})}setRegister(t,e){let i,s;Array.isArray(e)?(i=this.resolveS(e[0]),s=this.resolveS(e[1],"top")):"s0"in e?(i=e.s0,s=e.s1):"y0"in e?(i=this.sAtY(e.y0),s=this.sAtY(e.y1,{from:"top"})):(i=this.resolveS(e.from),s=this.resolveS(e.to,"top")),s<i&&([i,s]=[s,i]);const r={name:t,s0:i,s1:s,length:s-i,y0:this.at(i).y,y1:this.at(s).y};return this.registers[t]=r,r}register(t){const e=this.registers[t];if(!e)throw new Error(`Profile: no register '${t}'`);return e}addRidges({y:t,s:e,count:i=1,width:s=1.6,height:r=1,spacing:a,shape:o="round"}){const c=e??this.sAtY(t),l=a??s*2.1,h=s/2,u=[];for(let M=0;M<i;M++)u.push(c+(M-(i-1)/2)*l);const f=u[0]-h-.5,d=u[u.length-1]+h+.5;this._refine(f,d,Math.min(this.step,s/12));const g=this._pts,_=g.map((M,E)=>{const w=this.S[E];let b=0;for(const C of u)b=Math.max(b,CM(o,w-C,h)*r);return b}),p=g.map((M,E)=>{const w=this._vtan(E,1);return[w[1],-w[0]]});for(let M=0;M<g.length;M++)_[M]&&(g[M]=[g[M][0]+p[M][0]*_[M],g[M][1]+p[M][1]*_[M]]);const m=this.S;this._finish();const x=this.S,v=M=>{let E=0,w=m.length-1;if(M<=0)return 0;if(M>=m[w])return x[w]+(M-m[w]);for(;w-E>1;){const C=E+w>>1;m[C]<=M?E=C:w=C}const b=m[w]>m[E]?(M-m[E])/(m[w]-m[E]):0;return x[E]+b*(x[w]-x[E])};for(const M of Object.keys(this.labels))this.labels[M]=v(this.labels[M]);this._srcS=this._srcS.map(v);for(const M of Object.values(this.registers))M.s0=v(M.s0),M.s1=v(M.s1),M.length=M.s1-M.s0;for(const M of this.ridges)M.s0=v(M.s0),M.s1=v(M.s1),M.centres=M.centres.map(v);return this.ridges.push({s0:v(f),s1:v(d),centres:u.map(v),width:s,height:r,shape:o,count:i}),this}_refine(t,e,i){const s=this._pts,r=this.S,a=[],o=new Set;for(let c=0;c<s.length;c++)if(this._corners.has(c)&&o.add(a.length),a.push(s[c]),c<s.length-1&&r[c+1]>t&&r[c]<e){const l=Math.ceil((r[c+1]-r[c])/i);for(let h=1;h<l;h++)a.push([s[c][0]+(s[c+1][0]-s[c][0])*h/l,s[c][1]+(s[c+1][1]-s[c][1])*h/l])}this._pts=a,this._corners=o,this._finish()}breaks(){const t=new Set(this.cornerS);for(const e of this.ridges)t.add(e.s0),t.add(e.s1);return[...t].filter(e=>e>1e-6&&e<this.length-1e-6).sort((e,i)=>e-i)}samples(t,e,{maxAngle:i=.06,maxLen:s=6,minRows:r=1}={}){const a=[t],o=this.S;let c=this._seg(t)+1,l=t,h=this.at(t,1);for(let u=0;u<1e6;u++){const f=c<o.length?Math.min(o[c],e):e;if(f-l>s){if(l+=s,e-l<s*.25)break;a.push(l),h=this.at(l,1);continue}if(f>=e-1e-6)break;const d=this._vtan(c,-1);Math.acos(Math.min(1,Math.max(-1,d[0]*h.tr+d[1]*h.ty)))>i&&o[c]-l>.02&&(a.push(o[c]),l=o[c],h=this.at(o[c],1)),c++}if(a.push(e),a.length-1<r){const u=[];for(let f=0;f<=r;f++)u.push(t+(e-t)*f/r);return u}return a}offset(t,{smooth:e=3}={}){const i=this._pts.map(o=>o.slice());e>0&&Dh(i,new Set,e,this.step);const s=[],r=i.length;for(let o=0;o<r;o++){const c=i[Math.max(0,o-1)],l=i[Math.min(r-1,o+1)],h=l[0]-c[0],u=l[1]-c[1],f=Math.hypot(h,u)||1,d=typeof t=="function"?t(this.S[o],i[o][1]):t;s.push([Math.max(0,i[o][0]-u/f*d),i[o][1]+h/f*d,this.S[o]])}const a=[s[0]];for(let o=1;o<r;o++){const c=a[a.length-1],l=i[Math.max(0,o-1)],h=i[Math.min(r-1,o+1)];(s[o][0]-c[0])*(h[0]-l[0])+(s[o][1]-c[1])*(h[1]-l[1])>1e-9&&a.push(s[o])}return a}scaled(t){return new Ns(this.source.map(e=>({...e,r:e.r*t,y:e.y*t})),{step:this.step,mode:this.mode,ridges:this.ridges.map(e=>({s:e.centres.reduce((i,s)=>i+s,0)/e.centres.length*t,count:e.count,width:e.width*t,height:e.height*t,spacing:e.centres.length>1?(e.centres[1]-e.centres[0])*t:void 0,shape:e.shape})),registers:Object.fromEntries(Object.entries(this.registers).map(([e,i])=>[e,{s0:i.s0*t,s1:i.s1*t}]))})}get points(){return this._pts}}function Dh(n,t,e,i){const s=[0,...[...t].sort((o,c)=>o-c),n.length-1],r=Math.max(1,Math.round(e*2.5/i)),a=[];for(let o=-r;o<=r;o++)a.push(Math.exp(-.5*(o*i/e)**2));for(let o=0;o<s.length-1;o++){const c=s[o],l=s[o+1],h=n.slice(c,l+1).map(u=>u.slice());for(let u=c+1;u<l;u++){let f=0,d=0,g=0;for(let _=-r;_<=r;_++){const p=u+_;if(p<c||p>l)continue;const m=a[_+r];f+=h[p-c][0]*m,d+=h[p-c][1]*m,g+=m}n[u]=[f/g,d/g]}}}function Ff(n,t){return n!=null&&n.isProfile?n:new Ns(n,t)}function DM(n,{scale:t=1,height:e,corners:i="auto",cornerAngle:s=32,window:r=2.5,smooth:a=.8,ground:o=!0,flipY:c=!1,...l}={}){let h=n.map(g=>[Math.abs(+g[0])*t,(c?-1:1)*+g[1]*t]);if(h[0][1]>h[h.length-1][1]&&h.reverse(),o){const g=Math.min(...h.map(_=>_[1]));h=h.map(_=>[_[0],_[1]-g])}if(e){const g=Math.max(...h.map(p=>p[1]))-Math.min(...h.map(p=>p[1])),_=e/g;h=h.map(p=>[p[0]*_,p[1]*_])}h=h.filter((g,_)=>_===0||Math.hypot(g[0]-h[_-1][0],g[1]-h[_-1][1])>1e-6);let u=new Set;if(Array.isArray(i))u=new Set(i);else if(i==="auto"){const g=[0];for(let p=1;p<h.length;p++)g.push(g[p-1]+Math.hypot(h[p][0]-h[p-1][0],h[p][1]-h[p-1][1]));const _=h.map((p,m)=>{if(m===0||m===h.length-1)return 0;const x=IM(h,g,m,r),v=UM(h,g,m,r);return Math.acos(Math.max(-1,Math.min(1,x[0]*v[0]+x[1]*v[1])))*(180/Math.PI)});for(let p=1;p<h.length-1;p++){if(_[p]<s)continue;let m=!0;for(let x=p-1;x>=0&&g[p]-g[x]<=r;x--)_[x]>_[p]&&(m=!1);for(let x=p+1;x<h.length&&g[x]-g[p]<=r;x++)_[x]>=_[p]&&(m=!1);m&&u.add(p)}}const f=h.map((g,_)=>[g[0],g[1],u.has(_)?"corner":"smooth"]),d=l.step??.15;return new Ns(f,{mode:"polyline",smooth:a,step:d,...l})}function IM(n,t,e,i){let s=e-1;for(;s>0&&t[e]-t[s]<i;)s--;const r=n[e][0]-n[s][0],a=n[e][1]-n[s][1],o=Math.hypot(r,a)||1;return[r/o,a/o]}function UM(n,t,e,i){let s=e+1;for(;s<n.length-1&&t[s]-t[e]<i;)s++;const r=n[s][0]-n[e][0],a=n[s][1]-n[e][1],o=Math.hypot(r,a)||1;return[r/o,a/o]}const Ee=Math.PI*2,vn=Math.PI/180;function Uc(n){if(n!=null&&n.isProfileCurve)return n;const t=Ff(n);return{isProfileCurve:!0,profile:t,length:t.length,points:t.points.map(e=>new q(e[0],e[1],0)),at(e,i){const s=t.at(Math.min(Math.max(e,0),1)*t.length,i);return{r:s.r,y:s.y,nr:s.nr,ny:s.ny}}}}function Of(n,{u0:t=0,u1:e=1,v0:i=0,v1:s=1}={}){const r=Uc(n);return(a,o,c)=>{const l=(t+(e-t)*a-.5)*Ee,h=r.at(i+(s-i)*o),u=Math.sin(l),f=Math.cos(l);c.pos.set(h.r*u,h.y,h.r*f),c.nrm.set(h.nr*u,h.ny,h.nr*f)}}function NM({profile:n,material:t,part:e="body",segments:i={density:.5},thickness:s=0,rims:r=["v1"],relief:a=null,reliefRect:o,fade:c,maxVerts:l}){const h=Uc(n),u=re({surface:Of(h),segments:i,relief:a,reliefRect:o,fade:c??{u0:0,u1:0,v0:1.5,v1:1.5},back:s>0?{thickness:s,rims:r}:null,maxVerts:l}),f=new ue(u,t);return f.userData.part=e,f.castShadow=f.receiveShadow=!0,f}const kM=["wall","registers","sectors","floor","holes","tolerance","lip","foot","ridges"];function Nc(n){return kM.some(t=>t in n)?FM(n):NM(n)}function FM({profile:n,sectors:t=4,registers:e={},wall:i=3,lip:s={},floor:r,foot:a={},holes:o=[],tolerance:c=null,oval:l=1,ridges:h=null,density:u=1,quality:f=1,chord:d=.05,fade:g=1.5,material:_,interiorMaterial:p,materialFor:m,part:x="body",name:v}){var Nt;const M=n!=null&&n.isProfile?n:new Ns(n);if(h)for(const Z of h)M.addRidges(Z);const E=M.length,w=M.bounds.yMax,b=typeof i=="function"?i:()=>i,C=u*Math.sqrt(f),S=[];for(const[Z,et]of Object.entries(e)){const N=et||{},xt=Array.isArray(N)||["y0","s0","from"].some(Et=>Et in N)?M.setRegister(Z,(Array.isArray(N),N)):M.register(Z);S.push({...xt,name:Z,spec:Array.isArray(N)?{}:N})}for(const[Z,et]of Object.entries(M.registers))S.find(N=>N.name===Z)||S.push({...et,name:Z,spec:{}});S.sort((Z,et)=>Z.s0-et.s0);const T=cc(t),L=Z=>{var et;return((et=Z==null?void 0:Z.spec)==null?void 0:et.sectors)!=null?cc(Z.spec.sectors):T},P=GM(c,w,l),W=o.map(Z=>VM(Z,M,w)),R=[];for(const Z of[T,...S.map(L)])for(const[et]of Z)R.push(et);for(const Z of W)R.push(...Z.thetas);let I=0;for(const Z of S)if(Z.spec.relief)for(let et=Z.s0;et<=Z.s1;et+=Math.max(1,Z.length/40))I=Math.max(I,M.at(et).r);const D=M.bounds.rMax,z=d/Math.max(.25,f),B=Math.ceil(Ee/(2*Math.sqrt(2*z/Math.max(D,1)))),F=Math.ceil(Ee*I*C),X=Math.max(64,B,F),tt=BM(X,R),J=tt[0],U=tt.concat(tt.slice(1).map(Z=>Z+Ee)),Y=(Z,et)=>{let N=J+xo(Z-J,Ee);N>J+Ee-1e-9&&(N-=Ee);const at=N+(et-Z),xt=ac(U,N),Et=ac(U,at),Pt=U.slice(xt,Et+1);return Pt[0]=N,Pt[Pt.length-1]=at,Pt},G=new Set([0,E,...M.breaks()]);for(const Z of S)G.add(Z.s0),G.add(Z.s1);for(const Z of W)for(const et of Z.ss)G.add(et);const K=[...G].filter(Z=>Z>=0&&Z<=E).sort((Z,et)=>Z-et),Q=[];for(let Z=0;Z<K.length-1;Z++)K[Z+1]-K[Z]>.02&&Q.push([K[Z],K[Z+1]]);const nt={isLatheInfo:!0,profile:M,height:w,length:E,columns:tt.length-1,sectors:T.map(([Z,et])=>[Z/vn,et/vn]),registers:{},deform:P};for(const Z of S){const et=L(Z),N=M.at(Z.s0,1),at=M.at(Z.s1,-1),xt=M.at((Z.s0+Z.s1)/2);let Et=0;for(let Pt=Z.s0;Pt<=Z.s1;Pt+=Math.max(.5,Z.length/60))Et=Math.max(Et,M.at(Pt).r);nt.registers[Z.name]={name:Z.name,s0:Z.s0,s1:Z.s1,y0:Z.y0,y1:Z.y1,height:Z.length,rBottom:N.r,rTop:at.r,rMid:xt.r,rMax:Et,sectors:et.map(([Pt,Ot],Bt)=>HM(M,Z,Bt,et.length,Pt,Ot))}}const rt=_||new Se,ct=p||new Se({interior:.45}),_t=p||new Se({interior:1}),H=new Map,V=(Z,et)=>{if(et.spec.material)return et.spec.material;if(H.has(Z))return H.get(Z);const N=m?m(Z,et.name):new Se({relief:Z});return H.set(Z,N),N},j=s.thickness??b(E,w)*1.6,it=s.length??Math.max(6,j*3),st=(Z,et)=>{const N=b(Z,et);return N+(j-N)*zM((Z-(E-it))/it)},ut=M.at(0).r;let y=r;y===void 0&&(y=ut>.5?{y:b(0,0)*1.4,thickness:b(0,0)*1.4}:null);const A=y?y.y:null,$=y?y.thickness??b(0,0)*1.5:0,ft=a.wall??b(0,0),ot=y?(a.hollow??!0)&&A-$>ft*1.5:!1;function dt(Z){const et=M.at(Z).y;return(y&&ot&&et<A-$?ft:st(Z,et))+.15}nt.wallAt=Z=>st(Z,M.at(Z).y),nt.floorY=A;const vt=new Map,bt=[],Mt=new Map,yt=Z=>S.find(et=>Z>et.s0+1e-6&&Z<et.s1-1e-6)||null;for(const[Z,et]of Q){const N=yt((Z+et)/2),at=!!((Nt=N==null?void 0:N.spec)!=null&&Nt.relief),Et=M.samples(Z,et,at?{maxAngle:.05/Math.sqrt(f),maxLen:1/C}:{maxAngle:.06/Math.sqrt(f),maxLen:8/Math.sqrt(f)}).map(Ot=>(Ot-Z)/(et-Z));Et[0]=0,Et[Et.length-1]=1,L(N).forEach(([Ot,Bt],Qt)=>{var ks;const te=Y(Ot,Bt),Wt=te.map(ke=>(ke-te[0])/(te[te.length-1]-te[0]));Wt[0]=0,Wt[Wt.length-1]=1;const ee=te[0],fe=te[te.length-1],Fn=(ke,Be,hn)=>{const un=ke<=0?ee:ke>=1?fe:ee+ke*(fe-ee),O=Be<=0?Z:Be>=1?et:Z+Be*(et-Z),lt=M.at(O,Be<=0?1:Be>=1?-1:0),pt=Math.sin(un),gt=Math.cos(un);hn.pos.set(lt.r*pt,lt.y,lt.r*gt),P(hn.pos),hn.nrm.set(lt.nr*pt,lt.ny,lt.nr*gt)};let Ne=null;if(at){const ke=N.name+"#"+Qt;if(!Mt.has(ke)){const Be=N.spec.relief,hn=nt.registers[N.name].sectors[Qt];Mt.set(ke,typeof Be=="function"?Be(Qt,hn)||null:Array.isArray(Be)?Be[Qt]||null:Be)}Ne=Mt.get(ke)}let An=null;if(Ne&&N.spec.map==="true"){const ke=nt.registers[N.name].sectors[Qt],Be=N.spec.mapWidth??Math.max(ke.widthBottom,ke.widthTop,ke.width),hn=(ee+fe)/2;An=(un,O,lt)=>{const pt=ee+Math.min(1,Math.max(0,un))*(fe-ee),gt=Z+Math.min(1,Math.max(0,O))*(et-Z);lt[0]=.5+(pt-hn)*M.at(gt).r/Be}}const Qn=re({surface:Fn,samples:{u:Wt,v:Et},relief:Ne,reliefRect:Ne?{u0:0,u1:1,v0:(N.s0-Z)/(et-Z),v1:(N.s1-Z)/(et-Z)}:void 0,fade:((ks=N==null?void 0:N.spec)==null?void 0:ks.fade)??g,normals:"surface",panelMap:An});if(W.length){const hn=qM(Qn,W,un=>ee+Wt[un]*(fe-ee),un=>Z+Et[un]*(et-Z),Wt.length-1,Et.length-1,un=>dt(un));hn&&bt.push(hn)}const ti=Ne||"plain";vt.has(ti)||vt.set(ti,{geos:[],material:Ne?V(Ne,N):rt,register:N==null?void 0:N.name}),vt.get(ti).geos.push(Qn)})}const wt=new gn;wt.name=v||x,wt.userData.part=x;const ht=(Z,et,N)=>{const at=new ue(Z,et);return at.userData.role=N,at.castShadow=at.receiveShadow=!0,wt.add(at),at};for(const[Z,et]of vt){const N=et.geos.length===1?et.geos[0]:Ah(et.geos,!1);N.computeBoundingBox(),N.computeBoundingSphere(),ht(N,et.material,Z==="plain"?"outer":"panel:"+et.register)}const At=M.offset((Z,et)=>st(Z,et),{smooth:Math.max(2,b(E/2,w/2))}),Ut=M.at(E,-1),Ct=At[At.length-1],Dt=[];{const et=s.shape==="flat"?.3:1,N=s.bulge??(s.shape==="flat"?.45:.6),at=[Ut.r,Ut.y],xt=Math.hypot(at[0]-Ct[0],at[1]-Ct[1]),Et=[(at[0]+Ct[0])/2,(at[1]+Ct[1])/2],Pt=(at[0]-Ct[0])/xt,Ot=(at[1]-Ct[1])/xt;let Bt=Ut.tr,Qt=Ut.ty;const te=Bt*Pt+Qt*Ot;Bt-=Pt*te,Qt-=Ot*te;const Wt=Math.hypot(Bt,Qt)||1;Bt/=Wt,Qt/=Wt;for(let ee=0;ee<=14;ee++){const fe=Math.PI*ee/14,Fn=Math.cos(fe),Ne=Math.sin(fe),An=Math.sign(Fn)*Math.pow(Math.abs(Fn),et)*(xt/2),Qn=Math.sign(Ne)*Math.pow(Math.abs(Ne),et)*(xt/2)*N;Dt.push([Et[0]+Pt*An+Bt*Qn,Et[1]+Ot*An+Qt*Qn])}Dt[0]=at,Dt[14]=[Ct[0],Ct[1]]}ht(ls(Dt,tt,P,{split:50}),rt,"lip");const Rt=[];for(let Z=At.length-1;Z>=0;Z--){const et=At[Z];if(y&&et[1]<=A){const N=At[Z+1]||et,at=N[1]!==et[1]?(A-et[1])/(N[1]-et[1]):0;Rt.push([et[0]+(N[0]-et[0])*at,A]);break}if(!y&&et[0]<=.01){Rt.push([0,et[1]]);break}Rt.push([et[0],et[1]])}let k=Ih(Rt,.07,5);if(y){const et=k[k.length-1][0],N=y.dome??Math.min(2.5,et*.04),at=Math.min(b(0,A)*1.2,et*.3);for(k=k.slice(0,-1);k.length>1&&k[k.length-1][1]<A+at;)k.pop();k.push([et,A+at]);for(let Et=1;Et<=4;Et++){const Pt=Et/4*(Math.PI/2);k.push([et-at+at*Math.cos(Pt),A+at-at*Math.sin(Pt)])}const xt=10;for(let Et=1;Et<=xt;Et++){const Pt=(et-at)*(1-Et/xt);k.push([Pt,A+N*(1-(Pt/Math.max(.001,et-at))**2)])}}if(ht(ls([[Ct[0],Ct[1]],...k.slice(1)],tt,P,{split:40}),ct,"inner"),ut>.01){const Z=[];if(ot){const et=A-$,N=M.offset(ft,{smooth:Math.max(1.5,ft)}),at=[];for(const Ot of N){if(Ot[1]>=et)break;at.push([Ot[0],Math.max(0,Ot[1])])}const xt=at.length?at[at.length-1][0]:ut-ft;Z.push([0,et-Math.min(1.5,xt*.02)]);for(let Ot=1;Ot<=6;Ot++){const Bt=xt*Ot/6;Z.push([Bt,et-Math.min(1.5,xt*.02)*(1-(Bt/xt)**2)])}const Et=Ih(at.slice().reverse(),.07,5);for(const Ot of Et)Ot[1]<et-.05&&Z.push(Ot);const Pt=Z[Z.length-1];Pt[1]>.001&&Z.push([Pt[0],0]),Z.push([ut,0]),ht(ls(Z.slice(0,-2).concat([Z[Z.length-2]]),tt,P,{split:40}),_t,"foot-inner"),ht(ls(Z.slice(-2),tt,P,{split:40}),rt,"foot-ring")}else ht(ls([[0,0],[ut,0]],tt,P,{split:40}),rt,"base")}bt.length&&ht(bt.length===1?bt[0]:Ah(bt,!1),_t,"holes");const Tt=new q;return nt.frame=(Z,et,N=0)=>{const at=Z*vn,xt=Math.min(Math.max(et,0),E),Et=M.at(xt,N),Pt=Math.sin(at),Ot=Math.cos(at),Bt=et-xt,Qt=new q((Et.r+Et.tr*Bt)*Pt,Et.y+Et.ty*Bt,(Et.r+Et.tr*Bt)*Ot),te=P(Qt.clone()),Wt=new q(Et.nr*Pt,Et.ny,Et.nr*Ot),ee=new q(Et.tr*Pt,Et.ty,Et.tr*Ot),fe=P(Tt.copy(Qt).addScaledVector(ee,1)).sub(te).normalize(),Fn=new q(Ot,0,-Pt),Ne=new q().crossVectors(Fn,fe).normalize();return Ne.dot(Wt)<0&&Ne.negate(),{p:te,n:Ne,d:fe,b:new q().crossVectors(fe,Ne).normalize(),r:Et.r,y:Et.y}},nt.sAtY=(Z,et)=>M.sAtY(Z,et),nt.range=Z=>lc(M,nt,Z),nt.meridian=(Z,et)=>{const[N,at]=lc(M,nt,et);return{isPath:!0,planar:!0,kind:"meridian",theta:Z,s0:N,s1:at,length:at-N,frame:xt=>{const Et=at-N,Pt=Math.min(Math.max(xt,0),Et),Ot=nt.frame(Z,N+Pt,Pt<=0?1:Pt>=Et?-1:0);return xt!==Pt&&Ot.p.addScaledVector(Ot.d,xt-Pt),Ot}}},wt.userData.lathe=nt,wt.userData.registers=nt.registers,wt}function OM(n,{azimuths:t=[0,90,180,270],ranges:e,gap:i=1.5,seed:s=1,...r}={}){const a=n.userData.lathe,o=[];let c=0;for(const l of t)for(const h of e||[null]){const u=h&&typeof h=="object"&&"range"in h?h:{range:h},{range:f,gap:d=i,...g}=u,[_,p]=a.range(f),m=a.meridian(l,{s0:_+(g.gap0??d),s1:p-(g.gap1??d)});delete g.gap0,delete g.gap1;const x={...r,...g};o.push(Dc({...x,path:m,seed:s*7919+c++*131+Math.round(l)}))}return o}function zM(n){return n=Math.min(1,Math.max(0,n)),n*n*(3-2*n)}function xo(n,t){return(n%t+t)%t}function ac(n,t){let e=0,i=n.length-1;for(;i-e>1;){const s=e+i>>1;n[s]<=t?e=s:i=s}return Math.abs(n[e]-t)<=Math.abs(n[i]-t)?e:i}function cc(n){let t;if(typeof n=="number"||(n==null?void 0:n.count)!=null){const i=typeof n=="number"?n:n.count,s=((n==null?void 0:n.center)??0)*vn;t=[];for(let r=0;r<i;r++)t.push(s+(r-.5)*(Ee/i))}else if(n!=null&&n.bounds)t=n.bounds.map(i=>i*vn);else if(Array.isArray(n))t=n.map(i=>i*vn);else throw new Error("lathe: bad sectors spec");const e=[];for(let i=0;i<t.length;i++){const s=t[i];let r=i+1<t.length?t[i+1]:t[0]+Ee;for(;r<=s;)r+=Ee;e.push([s,r])}return e}function BM(n,t){const e=[...new Set(t.map(a=>xo(a,Ee)))].sort((a,o)=>a-o),i=e.length?e[0]:0,s=Ee/n,r=[];for(let a=0;a<=n;a++)r.push(i+a*s);for(const a of e){const o=i+xo(a-i,Ee),c=ac(r,o);Math.abs(r[c]-o)<s*.35&&c!==0&&c!==r.length-1?r[c]=o:Math.abs(r[c]-o)>1e-9&&r.splice(r[c]<o?c+1:c,0,o)}return r[r.length-1]=r[0]+Ee,r}function GM(n,t,e=1){if(!n&&e===1)return d=>d;if(!n)return d=>(d.z/=e,d);const i={seed:1,ovality:0,rim:0,lean:0,...n},s=new $e(i.seed),r=s.range(0,Ee),a=s.range(0,Ee),o=s.range(0,Ee),c=s.range(0,Ee),l=s.range(.55,1),h=s.range(.35,.8),u=i.rim*t/2,f=Math.tan((i.lean||0)*vn);return d=>{const g=Math.atan2(d.x,d.z),_=1+i.ovality*Math.cos(2*(g-r));if(d.x*=_,d.z*=_,u){const p=Math.max(0,d.y/t)**2;d.y+=u*p*(l*Math.cos(g-a)+h*Math.cos(2*(g-o)))/(l+h)}return f&&(d.x+=d.y*f*Math.sin(c),d.z+=d.y*f*Math.cos(c)),e!==1&&(d.z/=e),d}}function lc(n,t,e){if(e==null)return[0,n.length];if(typeof e=="string"){const i=t.registers[e]||n.registers[e];if(!i)throw new Error(`lathe: no register '${e}'`);return[i.s0,i.s1]}if(Array.isArray(e))return[n.sAtY(e[0]),n.sAtY(e[1],{from:"top"})];if("s0"in e)return[e.s0,e.s1];if("y0"in e)return[n.sAtY(e.y0),n.sAtY(e.y1,{from:"top"})];if("register"in e){const[i,s]=lc(n,t,e.register);return[i+(e.inset0??e.inset??0),s-(e.inset1??e.inset??0)]}throw new Error("lathe: bad range")}function HM(n,t,e,i,s,r){const a=r-s,o=u=>n.at(t.s0+Math.min(Math.max(u,0),t.length)),c=u=>o(u).r*a,l=c(t.length/2),h={register:t.name,sector:e,sectors:i,theta0:s/vn,theta1:r/vn,center:(s+r)/2/vn,width:l,height:t.length,widthBottom:c(0),widthTop:c(t.length),rBottom:o(0).r,rTop:o(t.length).r,rMid:o(t.length/2).r,widthAt:c,toPanel:(u,f=l)=>[f/2+u[0]*f/c(u[1]),u[1]],fromPanel:(u,f=l)=>[(u[0]-f/2)*c(u[1])/f,u[1]]};return h.map=(u,f=l)=>u.map(d=>h.toPanel(d,f)),h}function VM(n,t,e){const i=n.s??t.sAtY(n.y),s=t.at(i).r,r=(n.azimuth??0)*vn,a=n.shape||"cross",o=n.arm??e*.02,c=n.width??Math.max(2,e*.008);let l,h;a==="cross"?(l=[o,c/2],h=[c/2,o]):(l=[(n.w??c)/2],h=[(n.h??o*2)/2]);const u=[],f=[];for(const g of l)u.push(r-g/s,r+g/s);for(const g of h)f.push(i-g,i+g);return{thetas:u,ss:f,inside:(g,_)=>{const p=WM(g,r)*s,m=_-i;for(let x=0;x<l.length;x++)if(Math.abs(p)<l[x]&&Math.abs(m)<h[x])return!0;return!1}}}function WM(n,t){return xo(n-t+Math.PI,Ee)-Math.PI}function qM(n,t,e,i,s,r,a){const o=(x,v)=>t.some(M=>M.inside(x,v)),c=n.index.array,l=[],h=n.attributes.position.array,u=n.attributes.normal.array,f=s+1,d=[],g=[],_=1e-5;let p=!1;for(let x=0;x<r;x++)for(let v=0;v<s;v++){const M=(x*s+v)*6,E=(e(v)+e(v+1))/2,w=(i(x)+i(x+1))/2;if(!o(E,w)){for(let S=0;S<6;S++)l.push(c[M+S]);continue}p=!0;const b=XM(h,[x*f+v,x*f+v+1,(x+1)*f+v,(x+1)*f+v+1]),C=[[x*f+v,x*f+v+1,E,i(x)-_],[x*f+v+1,(x+1)*f+v+1,e(v+1)+_,w],[(x+1)*f+v+1,(x+1)*f+v,E,i(x+1)+_],[(x+1)*f+v,x*f+v,e(v)-_,w]];for(const[S,T,L,P]of C){if(o(L,P))continue;const W=a(w),R=[h[S*3],h[S*3+1],h[S*3+2]],I=[h[T*3],h[T*3+1],h[T*3+2]],D=[R[0]-u[S*3]*W,R[1]-u[S*3+1]*W,R[2]-u[S*3+2]*W],z=[I[0]-u[T*3]*W,I[1]-u[T*3+1]*W,I[2]-u[T*3+2]*W],B=Ea(I,R),F=Ea(D,R);let X=YM(B,F);const tt=[(R[0]+I[0])/2,(R[1]+I[1])/2,(R[2]+I[2])/2],J=Ea(b,tt);let U=[R,I,z,D];jM(X,J)<0&&(U=[I,R,D,z],X=X.map(G=>-G));const Y=Math.hypot(...X)||1;for(const G of[0,1,2,0,2,3])d.push(...U[G]),g.push(X[0]/Y,X[1]/Y,X[2]/Y)}}if(!p)return null;n.setIndex(l);const m=new Ke;return m.setAttribute("position",new Me(d,3)),m.setAttribute("normal",new Me(g,3)),m.setAttribute("uv",new Me(new Float32Array(d.length/3*2).fill(-1),2)),m.setIndex([...Array(d.length/3).keys()]),m}function XM(n,t){const e=[0,0,0];for(const i of t)e[0]+=n[i*3],e[1]+=n[i*3+1],e[2]+=n[i*3+2];return e.map(i=>i/t.length)}const Ea=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],jM=(n,t)=>n[0]*t[0]+n[1]*t[1]+n[2]*t[2],YM=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]];function Ih(n,t,e){if(n.length<3)return n.slice();const i=[n[0]];let s=n[0],r=null;for(let a=1;a<n.length-1;a++){const o=n[a],c=o[0]-s[0],l=o[1]-s[1],h=Math.hypot(c,l);if(h<1e-6)continue;const u=[c/h,l/h];if(r||(r=u),Math.acos(Math.max(-1,Math.min(1,u[0]*r[0]+u[1]*r[1])))>t||h>e){const d=n[a-1]!==s?n[a-1]:o;i.push(d),s=d,r=null}}return i.push(n[n.length-1]),i}function ls(n,t,e=s=>s,{split:i=40}={}){const s=n.length,r=[];for(let x=0;x<s-1;x++){const v=n[x+1][0]-n[x][0],M=n[x+1][1]-n[x][1],E=Math.hypot(v,M)||1;r.push([v/E,M/E,E])}const a=[];let o=0;const c=Math.cos(i*vn);for(let x=0;x<s;x++){x>0&&(o+=r[x-1][2]);const v=r[x-1],M=r[x],E=w=>[w[1],-w[0]];if(v&&M&&v[0]*M[0]+v[1]*M[1]<c)a.push({r:n[x][0],y:n[x][1],n:E(v),s:o}),a.push({r:n[x][0],y:n[x][1],n:E(M),s:o,gap:!0});else{const w=v&&M?[v[0]+M[0],v[1]+M[1]]:v||M,b=Math.hypot(w[0],w[1])||1;a.push({r:n[x][0],y:n[x][1],n:E([w[0]/b,w[1]/b]),s:o})}}const l=t.length,h=a.length*l,u=new Float32Array(h*3),f=new Float32Array(h*3),d=new Float32Array(h*2),g=new q,_=Math.max(o,1e-6);a.forEach((x,v)=>{for(let M=0;M<l;M++){const E=t[M],w=Math.sin(E),b=Math.cos(E);g.set(x.r*w,x.y,x.r*b),e(g);const C=(v*l+M)*3;u[C]=g.x,u[C+1]=g.y,u[C+2]=g.z,f[C]=x.n[0]*w,f[C+1]=x.n[1],f[C+2]=x.n[0]*b,d[(v*l+M)*2]=(E-t[0])/Ee,d[(v*l+M)*2+1]=x.s/_}});const p=[];for(let x=0;x<a.length-1;x++)if(!a[x+1].gap)for(let v=0;v<l-1;v++){const M=x*l+v,E=M+1,w=M+l+1,b=M+l;p.push(M,E,w,M,w,b)}const m=new Ke;return m.setAttribute("position",new Ae(u,3)),m.setAttribute("normal",new Ae(f,3)),m.setAttribute("uv",new Ae(d,2)),m.setIndex(h>65535?new Ro(p,1):new Ao(p,1)),m.computeBoundingBox(),m.computeBoundingSphere(),m}const he=["front","right","back","left"],ur=["front-right","right-back","back-left","left-front"],an=[[0,0,1],[1,0,0],[0,0,-1],[-1,0,0]],Mo=[[1,0,0],[0,0,-1],[-1,0,0],[0,0,1]],_n=-1e9,Cn=(n,t,e)=>Math.min(e,Math.max(t,n)),se=(n,t,e)=>n+(t-n)*e,Ks=n=>n*Math.PI/180;function hc(n,t){if(t<=0)return n>0?1:0;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function zf({width:n,depth:t,height:e,taper:i=0,top:s=null,flare:r=0,at:a="bottom",bulge:o=0,bulgeAt:c=.5,cornerRadius:l=0,profile:h=null}){const u=e,f=typeof i=="number"?i:i.x??0,d=typeof i=="number"?i:i.z??0;let g,_,p,m;s?(g=n/2,_=t/2,p=s.width/2,m=s.depth/2):r?(g=n/2,_=t/2,p=g*(1+r),m=_*(1+r)):a==="top"?(p=n/2,m=t/2,g=p-u*Math.tan(Ks(f)),_=m-u*Math.tan(Ks(d))):(g=n/2,_=t/2,p=g+u*Math.tan(Ks(f)),m=_+u*Math.tan(Ks(d)));const x=c>0&&c<1?Math.log(.5)/Math.log(c):1,v=typeof o=="number"?o:o.x??0,M=typeof o=="number"?o:o.z??0,E={a:0,b:0,r:0},w=b=>{const C=Cn(b/u,0,1),S=Math.sin(Math.PI*Math.pow(C,x));let T=se(g,p,C)+v*S,L=se(_,m,C)+M*S;if(h){const P=h(C);T+=P.dx??P.d??0,L+=P.dz??P.d??0}return E.a=T,E.b=L,E.r=Math.min(l,T,L),E};return w.H=u,w.dims={a0:g,b0:_,a1:p,b1:m},w}function uc(n,t,e,i){const s=Math.min(n.a,n.b);t<-s&&(t=-s);const r=Math.max(0,n.a+t),a=Math.max(0,n.b+t);let o=n.r>0?Math.max(0,n.r+t):0;return t<0&&e>0&&(o=Math.max(o,e*Math.min(1,-t/Math.max(i,1e-6)))),o=Math.min(o,r,a),{A:r,B:a,R:o,d:t}}function $M(n){const t=(e,i)=>{let s=e*374761393+i*668265263+n*1442695041|0;return s=Math.imul(s^s>>>13,1274126177),((s^s>>>16)>>>0)/4294967296};return(e,i)=>{const s=Math.floor(e),r=Math.floor(i),a=e-s,o=i-r,c=a*a*(3-2*a),l=o*o*(3-2*o),h=t(s,r),u=t(s+1,r),f=t(s,r+1),d=t(s+1,r+1);return(h+(u-h)*c+(f-h)*l+(h-u-f+d)*c*l)*2-1}}function KM(n,t,e){if(!n)return null;const i=n===!0?{}:n,s=new $e(i.seed??7),r=t/300,a={sagK:[0,1,2,3].map(()=>(i.sag??.003)*s.range(.5,1.2)),rim:i.rim??.006*t,wave:i.wave??Math.min(.6,.15*Math.max(1,r)),waveLength:i.waveLength??40*Math.max(1,Math.sqrt(r)),skew:Math.tan(Ks(i.skew??s.jitter(.6))),noise:$M(s.int(1,1e6))},o=s.range(0,Math.PI*2),c=s.range(-.6,.6);return a.level=[Math.cos(o)*.5*a.rim,Math.sin(o)*.5*a.rim,c*.5*a.rim],a.a=Math.max(e.a0,e.a1),a.b=Math.max(e.b0,e.b1),a}function Bf({sec:n,H:t,cast:e,innerR:i,wall:s,yBase:r=0,span:a}){const o=new q;function c(u,f,d,g,_=o){const p=n(Cn(g,0,t)),{A:m,B:x,R:v}=uc(p,d,i,s),M=(u&1)===0,E=M?x:m,w=(M?m:x)-v,b=(2*f-1)*w,C=an[u],S=Mo[u];if(_.set(C[0]*E+S[0]*b,g,C[2]*E+S[2]*b),e){const T=Math.min(p.a,p.b),L=Cn(1+Math.max(d,-T)/T,0,1.3),P=a[u],W=4*f*(1-f);let R=e.sagK[u]*P*W;e.wave&&(R+=e.wave*Math.min(1,2*W)*e.noise(f*P/e.waveLength+u*17.3,g/e.waveLength)),_.x+=C[0]*R*L,_.z+=C[2]*R*L}return h(_,g)}function l(u,f,d,g,_=o){const p=n(Cn(g,0,t)),{A:m,B:x,R:v}=uc(p,d,i,s),M=(u&1)===0,E=M?x:m,w=(M?m:x)-v,b=an[u],C=Mo[u],S=f*Math.PI*.5,T=b[0]*(E-v)+C[0]*w,L=b[2]*(E-v)+C[2]*w;return _.set(T+v*(b[0]*Math.cos(S)+C[0]*Math.sin(S)),g,L+v*(b[2]*Math.cos(S)+C[2]*Math.sin(S))),h(_,g)}function h(u,f){if(e){const d=Cn(f/t,0,1),g=u.x/e.a,_=u.z/e.b;u.y+=d*(e.level[0]*g+e.level[1]*_+e.level[2]*g*_),u.x+=e.skew*u.z}return u.y+=r,u}return{side:c,corner:l,field:h,sec:n,H:t}}function Uh(n){const t=n.filter((s,r)=>r===0||Math.hypot(s[0]-n[r-1][0],s[1]-n[r-1][1])>1e-6||s[0]===_n),e=[];let i=[[t[0][0],t[0][1]]];for(let s=1;s<t.length;s++){const r=t[s],a=r[2]??0,o=s===t.length-1;if(!o&&a>0&&r[0]!==_n&&t[s-1][0]!==_n&&t[s+1][0]!==_n){const c=t[s-1],l=t[s+1],h=Ta([c[0]-r[0],c[1]-r[1]]),u=Ta([l[0]-r[0],l[1]-r[1]]),f=Math.hypot(c[0]-r[0],c[1]-r[1]),d=Math.hypot(l[0]-r[0],l[1]-r[1]),g=Cn(h[0]*u[0]+h[1]*u[1],-1,1),_=Math.acos(g);if(_>.001&&_<Math.PI-.001){let p=a/Math.tan(_/2);const m=.49*Math.min(f,d),x=p>m?m*Math.tan(_/2):a;p=Math.min(p,m);const v=[r[0]+h[0]*p,r[1]+h[1]*p],M=[r[0]+u[0]*p,r[1]+u[1]*p],E=Ta([h[0]+u[0],h[1]+u[1]]),w=x/Math.sin(_/2),b=[r[0]+E[0]*w,r[1]+E[1]*w];let C=Math.atan2(v[1]-b[1],v[0]-b[0]),T=Math.atan2(M[1]-b[1],M[0]-b[0])-C;for(;T>Math.PI;)T-=2*Math.PI;for(;T<-Math.PI;)T+=2*Math.PI;const L=Math.max(3,Math.ceil(Math.abs(T)/(Math.PI/10)));for(let P=0;P<=L;P++){const W=C+T*P/L;i.push([b[0]+x*Math.cos(W),b[1]+x*Math.sin(W)]),r[3]==="split"&&P===L>>1&&(e.push(i),i=[i[i.length-1]])}continue}}i.push([r[0],r[1]]),!o&&!(a>0)&&(e.push(i),i=[[r[0],r[1]]])}return i.length>1&&e.push(i),e}function Ta(n){const t=Math.hypot(n[0],n[1])||1;return[n[0]/t,n[1]/t]}function Nh(n,t){const e=[n[0]];for(let i=1;i<n.length;i++){const s=n[i-1],r=n[i];if(s[0]===_n||r[0]===_n){e.push(r);continue}const a=Math.max(1,Math.ceil(Math.hypot(r[0]-s[0],r[1]-s[1])/t));for(let o=1;o<=a;o++)e.push([se(s[0],r[0],o/a),se(s[1],r[1],o/a)])}return e}const qs=new q,kh=new q,Xs=new q,Fh=new q;function qe(n,t){return(i,s,r)=>{n(i,s,r.pos),n(Math.min(1,i+.001),s,qs),n(Math.max(0,i-.001),s,kh),n(i,Math.min(1,s+.001),Xs),n(i,Math.max(0,s-.001),Fh),qs.sub(kh),Xs.sub(Fh),r.nrm.crossVectors(qs,Xs);const a=r.nrm.length();a>1e-9*Math.max(1,qs.lengthSq(),Xs.lengthSq())&&qs.lengthSq()>1e-12&&Xs.lengthSq()>1e-12?r.nrm.multiplyScalar(1/a):t?t(i,s,r.nrm):r.nrm.set(0,1,0)}}function Ni(n,t,e,i){const s=new ue(n,t);return s.name=i,s.userData.part=e,s.castShadow=s.receiveShadow=!0,s}function io(n,t,{material:e,part:i,name:s,segLen:r=40,sides:a=!0,corners:o=!0,hasCorners:c,profileNormal:l=!0}){const h=[],u=t.length-1,f=g=>{const _=g*u,p=Math.min(u-1,Math.floor(_)),m=_-p,x=t[p],v=t[p+1];return[x[0]===_n||v[0]===_n?m<.5?x[0]:v[0]:se(x[0],v[0],m),se(x[1],v[1],m),p]},d=(g,_,p)=>(m,x,v)=>{const[,,M]=f(x),E=t[M],w=t[M+1];let b=w[0]-E[0];w[0]===_n&&(b=-1),E[0]===_n&&(b=1);const C=w[1]-E[1],S=Math.hypot(b,C)||1,T=C/S,L=-b/S;let P=an[g][0],W=an[g][2];if(_){const R=m*Math.PI*.5;P=an[g][0]*Math.cos(R)+Mo[g][0]*Math.sin(R),W=an[g][2]*Math.cos(R)+Mo[g][2]*Math.sin(R)}v.set(T*P,L,T*W).normalize()};for(let g=0;g<4;g++){if(a){const _=n.span[g],p=Math.max(2,Math.ceil(_/r)),m=re({surface:qe((x,v,M)=>{const[E,w]=f(v);n.side(g,x,E,w,M)},d(g,!1)),segments:[p,u]});h.push(Ni(m,e,i,`${s}-${he[g]}`))}if(o&&c){const _=re({surface:qe((p,m,x)=>{const[v,M]=f(m);n.corner(g,p,v,M,x)},d(g,!0)),segments:[6,u]});h.push(Ni(_,e,i,`${s}-${ur[g]}`))}}return h}function Oh(n,t){const e=n.map(h=>typeof h=="number"?{mm:h}:h.weight!=null?{weight:h.weight}:{mm:h.h??h.w??h.mm}),i=e.reduce((h,u)=>h+(u.mm??0),0),s=e.reduce((h,u)=>h+(u.weight??0),0);let r=1,a=t-i;s===0&&(r=t/(i||1));const o=e.map(h=>h.mm!=null?h.mm*(s===0?r:1):Math.max(0,a)*h.weight/s),c=[];let l=0;for(const h of o)c.push([l/t,(l+h)/t]),l+=h;return c.length&&(c[c.length-1][1]=1),c}function Io(n,t){if(!n)return;const e=he[t];if(n[e]!==void 0)return n[e];const i=t%2===0?"long":"short";return n[i]!==void 0?n[i]:n.all}function Gf(n){const t=zf(n),e=n.height,i=n.grid??n.grids??null,s={sides:{},section:t,H:e},r=(a,o)=>{const c=t(Cn(o,0,e));return(a&1?c.b:c.a)-c.r};for(let a=0;a<4;a++){let o=Io(i,a);i&&(i.rows||i.cols)&&!o&&(o=i),o=o||{};const c=o.rows||[{weight:1}],l=o.cols||[{weight:1}],h=2*r(a,e/2),u=Oh(c,e),f=Oh(l,h),d=u.map(([p,m])=>({y0:e*(1-m),y1:e*(1-p)})),g=f.map(([p,m])=>({s0:p,s1:m})),_=d.map((p,m)=>g.map((x,v)=>{const M=[];for(let S=0;S<=8;S++)M.push(se(p.y0,p.y1,S/8));const E=M.map(S=>(x.s1-x.s0)*2*r(a,S)),w=Math.max(...E);let b=0;for(let S=1;S<M.length;S++){const T=r(a,M[S])-r(a,M[S-1]),L=a&1?t(M[S]).a-t(M[S-1]).a:t(M[S]).b-t(M[S-1]).b;b+=Math.hypot(M[S]-M[S-1],L,T*(x.s0+x.s1-1))}const C=[];M.forEach((S,T)=>C.push([(w-E[T])/2,b*T/8]));for(let S=M.length-1;S>=0;S--)C.push([(w+E[S])/2,b*S/8]);return{side:he[a],row:m,col:v,s0:x.s0,s1:x.s1,y0:p.y0,y1:p.y1,w:E[4],h:b,wBottom:E[0],wTop:E[8],wMax:w,outline:C}}));s.sides[he[a]]={rows:d,cols:g,cells:_}}return n.foot&&(s.foot=ty(n,t)),s}function ZM(n){var tt,J;const{height:t,wall:e=8,cornerRadius:i=0,material:s=new Se,density:r=1,plainDensity:a=.06,part:o="body",panels:c=null}=n,l=n.interiorMaterial||new Se({interior:1}),h=n.innerRadius??e*.5,u=Gf(n),f=u.section,d=n.foot?n.foot.height:0,g=KM(n.cast,t,f.dims),_=[0,1,2,3].map(U=>{const Y=f(t/2);return 2*((U&1?Y.b:Y.a)-Y.r)}),p=Bf({sec:f,H:t,cast:g,innerR:h,wall:e,yBase:d,span:_});p.span=_;const m=i>0||h>0,x=new gn;x.name="fang-body",x.userData.part=o;const v=((tt=n.floor)==null?void 0:tt.thickness)??e,M=((J=n.floor)==null?void 0:J.round)??e*.8,E=n.rim===!1?{kind:"none"}:{kind:"plain",...n.rim},w=E.round??Math.max(.6,e*.12),b=E.inner??0,C=[[0,t,0]];let S=t,T=0;if(E.kind==="slab"){const U=E.height??e*2,Y=E.overhang??e*.5;C.push([Y,t,w*.6],[Y,t+U,w],[-(e+b),t+U,w,"split"]),S=t+U,T=Y,b>0&&C.push([-(e+b),t+U-Math.min(U*.5,b),e*.3],[-e,t+U-Math.min(U*.5,b)-b*1.2,e*.6])}else if(E.kind==="plain"){const U=E.height??0;U>0&&C.push([0,t+U,w]),C.push([-(e+b),t+U,w,"split"]),S=t+U,b>0&&C.push([-e,t+U-b*1.5,e*.5])}else C.push([-e,t,0]);C.push([-e,v,M],[_n,v,0]);const L=[[_n,0,0],[0,0,0]],P=1/a;for(const U of Uh(L))x.add(...io(p,U,{material:s,part:o,name:"underside",segLen:P*1.5,hasCorners:m}));Uh(C).forEach((U,Y)=>{const G=Y>0;x.add(...io(p,Nh(U,P),{material:G?l:s,part:o,name:G?"inner":"rim",segLen:P,hasCorners:m}))}),i>0&&x.add(...io(p,Nh([[0,0],[0,t]],P),{material:s,part:o,name:"arris",sides:!1,hasCorners:!0}));const R=new Map,I=U=>U.material?U.material:(R.has(U.relief)||R.set(U.relief,new Se({relief:U.relief})),R.get(U.relief));for(let U=0;U<4;U++){const Y=u.sides[he[U]],G=c&&c[he[U]],K=Io(n.cells,U);Y.cells.forEach((Q,nt)=>Q.forEach((rt,ct)=>{var H;let _t=G&&Y.cells.length===1&&Q.length===1?G:(H=K==null?void 0:K[nt])==null?void 0:H[ct];_t===void 0&&n.relief&&(_t=n.relief(rt)),_t&&_t.macro&&(_t={relief:_t}),_t&&!_t.relief&&(_t=_t.material?_t:null),rt.mesh=JM(p,U,rt,_t,{density:r,plainSeg:P,material:s,matFor:I,part:o,H:t}),x.add(rt.mesh)}))}let D=null;n.foot&&(D=iy(n,f,u.foot,{material:s,interiorMaterial:l,part:n.foot.part??"foot",density:r,plainSeg:P,cast:g,matFor:I}),x.add(D));const z=U=>U.clone(),B={};for(let U=0;U<4;U++){const Y=u.sides[he[U]],G=[p.side(U,0,0,0).clone(),p.side(U,1,0,0).clone(),p.side(U,0,0,t).clone(),p.side(U,1,0,t).clone()],K=new q().subVectors(G[1],G[0]).cross(new q().subVectors(G[2],G[0])).normalize();B[he[U]]={corners:G,normal:K,axis:[z(p.side(U,.5,0,0)),z(p.side(U,.5,0,t))],registers:Y.rows.map(Q=>[Q.y0+d,Q.y1+d]),columns:Y.cols.map(Q=>[Q.s0,Q.s1]),cells:Y.cells.map(Q=>Q.map(({mesh:nt,...rt})=>rt))}}const F={};for(let U=0;U<4;U++){const Y=rt=>i>0?p.corner(U,.5,0,rt).clone():p.side(U,1,0,rt).clone(),G=Y(0),K=Y(t),Q=an[U],nt=an[(U+1)%4];F[ur[U]]={bottom:G,top:K,out:new q(Q[0]+nt[0],0,Q[2]+nt[2]).normalize()}}const X=f(t);return x.userData.walls=B,x.userData.corners=F,x.userData.layout=u,x.userData.rim={kind:E.kind,y:S+d,wallTop:t+d,outer:{a:X.a+T,b:X.b+T},inner:{a:X.a-e-b,b:X.b-e-b}},x.userData.floorY=v+d,x.userData.footHeight=d,x.userData.at=(U,Y,G,K=0)=>p.side(typeof U=="number"?U:he.indexOf(U),Y,K,G).clone(),x.userData.rimTop=(U,Y,G=.5)=>{const K=typeof U=="number"?U:he.indexOf(U);return p.side(K,Y,se(T,-(e+b),G),S).clone()},x.userData.legSeat=(U,Y)=>{const G=typeof U=="number"?U:ur.indexOf(U),K=f(0),Q=an[G],nt=an[(G+1)%4],rt=(Q[0]+nt[0])*(K.a-Y),ct=(Q[2]+nt[2])*(K.b-Y),_t=new q(rt,0,ct);return p.field(_t,0),_t},x}function JM(n,t,e,i,{density:s,plainSeg:r,material:a,matFor:o,part:c,H:l}){const{s0:h,s1:u,y0:f,y1:d}=e,_=qe((E,w,b)=>n.side(t,se(h,u,E),0,se(f,d,w),b)),p=`wall-${he[t]}-r${e.row}c${e.col}`;if(!i){const E=Math.max(2,Math.ceil(e.w/r)),w=Math.max(2,Math.ceil(e.h/r));return Ni(re({surface:_,segments:[E,w]}),a,c,p)}let m=null;const x=i.fade??1.5;if(i.map==="true"){const E=(h+u)/2,w=e.wMax;m=(b,C,S)=>{const T=se(f,d,C),L=QM(n,t,T),P=se(h,u,b);S[0]=.5+(P-E)*2*L/w,S[2]=hc(Math.min(P-h,u-P)*2*L,x)}}const v=re({surface:_,segments:{density:i.density??s},relief:i.relief,reliefRect:i.reliefRect,fade:i.map==="true"?{u0:0,u1:0,v0:x,v1:x}:x,reliefScale:i.reliefScale??1,panelMap:m,maxVerts:i.maxVerts}),M=Ni(v,o(i),c,p);return M.userData.cell={side:he[t],row:e.row,col:e.col},M}function QM(n,t,e){const i=n.sec(Cn(e,0,n.H));return(t&1?i.b:i.a)-i.r}function ty(n,t){const e=n.foot,i=e.height,s=t(0),r=e.inset??0,a=e.flare??0,o={};for(let c=0;c<4;c++){const l=(c&1?s.b:s.a)-r+a,h=Math.max(0,Math.min(s.r-r+a,l)),u=l-h,f=Io(e.notch&&(e.notch.width!=null||e.notch.height!=null)?{all:e.notch}:e.notch,c);let d=null;if(f){const g=f.width<=1?f.width*2*((c&1?s.b:s.a)-r-Math.max(0,s.r-r)):f.width,_=f.height<=1?f.height*i:f.height;d={w:g,h:_,shape:f.shape??"arch",spring:f.spring??.55,round:f.round??Math.min(g,_)*.12},d.outline=ey(d)}o[he[c]]={w:2*u,h:i,notch:d,panelOutline:d?d.outline.map(([g,_])=>[g+u,_]):null}}return{height:i,sides:o}}function fc(n,t){const e=n.w/2,i=Math.min(1,Math.abs(t)/e);if(n.shape==="rect"){const r=Math.min(n.round,e*.9,n.h*.9),a=Math.abs(t)-(e-r);return a<=0?n.h:n.h-r+Math.sqrt(Math.max(0,r*r-a*a))}const s=n.h*n.spring;return s+(n.h-s)*Math.sqrt(Math.max(0,1-i*i))}function ey(n,t=24){const e=n.w/2,i=[[-e,0]];for(let s=0;s<=t;s++){const r=-e+n.w*s/t;i.push([r,fc(n,r)])}return i.push([e,0]),i}function ny(n,t,e){let i=1/0;for(let s=1;s<n.length;s++){const r=n[s-1],a=n[s],o=a[0]-r[0],c=a[1]-r[1],l=o*o+c*c||1,h=Cn(((t-r[0])*o+(e-r[1])*c)/l,0,1);i=Math.min(i,Math.hypot(t-r[0]-o*h,e-r[1]-c*h))}return i}function iy(n,t,e,{material:i,interiorMaterial:s,part:r,density:a,plainSeg:o,cast:c,matFor:l}){const h=n.foot,u=h.height,f=h.thickness??n.wall??6,d=h.inset??0,g=h.flare??0,_=t(0),p=n.cornerRadius>0?Math.max(0,h.cornerRadius??n.cornerRadius-d):h.cornerRadius??0,m=P=>{const W=g*(1-Cn(P/u,0,1));return{a:_.a-d+W,b:_.b-d+W,r:p>0?p+W:0}};m.H=u;const x=c?c.skew:0,v=Bf({sec:m,H:u,cast:null,innerR:0,wall:f,yBase:0,span:[0,0,0,0]}),M=v.side;v.side=(P,W,R,I,D)=>{const z=M(P,W,R,I,D);return z.x+=x*z.z,z};const E=v.corner;v.corner=(P,W,R,I,D)=>{const z=E(P,W,R,I,D);return z.x+=x*z.z,z},v.span=[0,1,2,3].map(P=>2*((P&1?m(u/2).b:m(u/2).a)-m(u/2).r));const w=new gn;w.name="fang-foot",w.userData.part=r;const b=p>0,C=(P,W,R=0)=>{const I=m(W),{A:D,B:z,R:B}=uc(I,R,0,f);return(P&1?z:D)-B},S=(P,W,R,I)=>{const D=C(P,R,I);return D>0?(W/D+1)/2:.5};for(let P=0;P<4;P++){const W=e.sides[he[P]],R=W.notch;let I=Io(h.relief,P);I&&I.macro&&(I={relief:I});const D=W.w,z=(J,U)=>I?(Y,G,K)=>{const Q=J(Y,G),nt=U(Y,G);K[0]=(Q+D/2)/D,K[1]=nt/u;let rt=hc(Math.min(Q+C(P,nt),C(P,nt)-Q),I.fade??1.5);R&&(rt*=hc(ny(R.outline,Q,nt),I.notchFade??3)),K[2]=rt}:null,B=(J,U,Y,G,K,Q)=>{const nt=(H,V,j)=>{const it=U(H,V),st=Y(H,V);return v.side(P,S(P,it,st,G),G,st,j)},rt=C(P,0),ct=Q&&I?{density:I.density??a}:[Math.max(2,Math.ceil(2*rt/o)),Math.max(2,Math.ceil(u/Math.min(o,6)))],_t=re({surface:qe(nt),segments:ct,relief:Q&&I?I.relief:null,fade:0,panelMap:Q?z(U,Y):null});w.add(Ni(_t,K,r,`foot-${J}-${he[P]}`))},F=R?R.w/2:0,X=(J,U)=>C(P,J,U);if(R){for(const[J,U,Y]of[["l",(G,K)=>-X(G,K),()=>-F],["r",()=>F,(G,K)=>X(G,K)]])B(`outer-${J}`,(G,K)=>se(U(K*u,0),Y(K*u,0),G),(G,K)=>K*u,0,I?l(I):i,!0),B(`inner-${J}`,(G,K)=>se(U((1-K)*u,-f),Y((1-K)*u,-f),G),(G,K)=>(1-K)*u,-f,s,!1);B("outer-m",J=>se(-F,F,J),(J,U)=>se(fc(R,se(-F,F,J)),u,U),0,I?l(I):i,!0),B("inner-m",J=>se(-F,F,J),(J,U)=>se(u,fc(R,se(-F,F,J)),U),-f,s,!1)}else B("outer",(J,U)=>se(-X(U*u,0),X(U*u,0),J),(J,U)=>U*u,0,I?l(I):i,!0),B("inner",(J,U)=>se(-X((1-U)*u,-f),X((1-U)*u,-f),J),(J,U)=>(1-U)*u,-f,s,!1);const tt=(J,U,Y)=>{const G=(K,Q,nt)=>{const rt=se(-f,0,Q),ct=se(U(rt),Y(rt),K);return v.side(P,S(P,ct,0,rt),rt,0,nt)};w.add(Ni(re({surface:qe(G),segments:[Math.max(2,Math.ceil(2*C(P,0)/o)),1]}),i,r,`foot-bottom-${J}-${he[P]}`))};if(R){tt("l",Q=>-C(P,0,Q),()=>-F),tt("r",()=>F,Q=>C(P,0,Q));const J=R.outline,U=[0];for(let Q=1;Q<J.length;Q++)U.push(U[Q-1]+Math.hypot(J[Q][0]-J[Q-1][0],J[Q][1]-J[Q-1][1]));const Y=U[U.length-1],G=Q=>{const nt=Q*Y;let rt=1;for(;rt<U.length-1&&U[rt]<nt;)rt++;const ct=(nt-U[rt-1])/(U[rt]-U[rt-1]||1);return[se(J[rt-1][0],J[rt][0],ct),se(J[rt-1][1],J[rt][1],ct)]},K=(Q,nt,rt)=>{const[ct,_t]=G(Q),H=se(-f,0,nt);return v.side(P,S(P,ct,_t,H),H,_t,rt)};w.add(Ni(re({surface:qe(K),segments:[J.length*2,1]}),i,r,`foot-reveal-${he[P]}`))}else tt("full",J=>-C(P,0,J),J=>C(P,0,J))}if(b)for(const P of[[[0,0],[0,u]],[[-f,u],[-f,0]],[[-f,0],[0,0]]])w.add(...io(v,P,{material:i,part:r,name:"foot",sides:!1,hasCorners:!0}));const T={};for(let P=0;P<4;P++){const W=an[P],R=an[(P+1)%4],I=D=>b?v.corner(P,.5,0,D).clone():v.side(P,1,0,D).clone();T[ur[P]]={bottom:I(0),top:I(u),out:new q(W[0]+R[0],0,W[2]+R[2]).normalize()}}const L={};for(let P=0;P<4;P++){const W=e.sides[he[P]].notch;L[he[P]]={bottom:v.side(P,.5,0,W?W.h:0).clone(),top:v.side(P,.5,0,u).clone(),normal:new q(...an[P])}}return w.userData.corners=T,w.userData.axes=L,w.userData.layout=e,w}const fr=(n,t,e)=>Math.sqrt(n*n+t*t+e*e);function os(n,t,e,i,s,r){const a=fr(n/i,t/s,e/r),o=fr(n/(i*i),t/(s*s),e/(r*r));return o>1e-9?a*(a-1)/o:-Math.min(i,s,r)}function sy(n,t,e,i,s,r,a){const o=Math.abs(n)-i+a,c=Math.abs(t)-s+a,l=Math.abs(e)-r+a;return fr(Math.max(o,0),Math.max(c,0),Math.max(l,0))+Math.min(Math.max(o,c,l),0)-a}function Hf(n,t,e,i,s,r,a){const o=s[0]-i[0],c=s[1]-i[1],l=s[2]-i[2],h=o*o+c*c+l*l,u=r-a,f=h-u*u,d=1/h,g=n-i[0],_=t-i[1],p=e-i[2],m=g*o+_*c+p*l,x=m-h,v=fr(g*h-o*m,_*h-c*m,p*h-l*m),M=v*v,E=m*m*h,w=x*x*h,b=Math.sign(u)*u*u*M;return Math.sign(x)*f*w>b?Math.sqrt(M+w)*d-a:Math.sign(m)*f*E<b?Math.sqrt(M+E)*d-r:(Math.sqrt(M*f*d)+m*u)*d-r}function qn(n,t,e){if(e<=0)return Math.min(n,t);const i=Math.max(e-Math.abs(n-t),0)/e;return Math.min(n,t)-i*i*e*.25}function zh(n,t,e){return-qn(-n,-t,e)}function Aa(n,t,e,i){let s=1/0;for(let r=0;r<i.length-1;r++){const a=i[r],o=i[r+1];s=Math.min(s,Hf(n,t,e,a,o,a[3],o[3]))}return s}function Bh(n,t){const e=t.hornSize,i=t.hornCurl;if(n==="ram"){const s=[],r=.85+.35*i;for(let a=0;a<=14;a++){const o=a/14,c=-.4+o*r*Math.PI*2,l=(.36-.2*o)*e;s.push([.3+.18*o*e,.22+l*Math.cos(c)*.9,.02+l*Math.sin(c)-.1*e*(1-o),(.13-.085*o)*Math.sqrt(e)])}return s}return n==="bottle"?[[.22,.36,.06,.09],[.28,.5,.05,.1*e],[.31,.62*e,.05,.075*e],[.3,.7*e,.05,.05]]:n==="buffalo"?[[.26,.32,.04,.12],[.55*e,.4,-.04,.1],[.85*e,.5,.02,.075],[1.02*e,.66*i+.2,.12,.045],[1*e,.82*i+.2,.22,.03]]:[[.24,.3,.05,.14],[.38*e,.48+.08*i,.03,.135],[.57*e,.56+.12*i,.01,.12],[.72*e,.48+.1*i,.01,.105],[.75*e,.32,.04,.085],[.67*e,.2-.08*i,.08,.06]]}const kc={kind:"bovine",width:40,projection:.62,droop:28,hornSize:1,hornCurl:.5,eyeSize:1,ears:!0,embed:4,detail:0,seed:1,brow:!0,nostrils:!0};function Vf(n){const t={...kc,...n},e=t.width,i=new $e(t.seed),s=()=>1+(i.next()-.5)*.04,r=t.projection,a=t.droop*Math.PI/180,o=Math.cos(a),c=Math.sin(a),h=(t.kind==="tiger"?Bh("bottle",t):Bh(t.kind==="ram"?"ram":t.kind==="buffalo"?"buffalo":"bovine",t)).map(M=>[M[0]*e*s(),M[1]*e,M[2]*e,M[3]*e]),u=h.map(M=>[-M[0],M[1],M[2],M[3]]),f=.1*e*t.eyeSize,d=(t.kind==="tiger"?.2:.25)*e,g=.16*e,_=(.17+.35*r*.4)*e,p=[0,.14*e,.12*e],m=r*e*1.15,x=[0,p[1]-m*c,p[2]+m*o],v=.07*e;return{bounds:{min:[Math.min(...u.map(M=>M[0]-M[3]))-2,Math.min(-.5*e,x[1]-.25*e)-2,-t.embed-1],max:[Math.max(...h.map(M=>M[0]+M[3]))+2,Math.max(.55*e,...h.map(M=>M[1]+M[3]))+2,Math.max(x[2]+.2*e,...h.map(M=>M[2]+M[3]))+2]},F:e,p:t,sd(M,E,w){let b=sy(M,E+.02*e,w+t.embed*.5-.03*e,.36*e,.38*e,t.embed*.5+.12*e,.12*e);b=qn(b,os(M,E-.16*e,w-.1*e,.38*e,.3*e,.22*e),v),b=qn(b,Hf(M,E,w,p,x,.29*e,(t.kind==="ram"?.16:.22)*e),v*1.2);const C=M,S=E-x[1],T=w-x[2];b=qn(b,os(C,S-.01*e,T,(t.kind==="ram"?.19:.27)*e,.14*e,.15*e),v*.7),t.brow&&(b=qn(b,Aa(M,E,w,[[-d*1.25,g+f*1.2,_-.02*e,.05*e],[0,g+f*1.7,_+.02*e,.06*e],[d*1.25,g+f*1.2,_-.02*e,.05*e]]),v*.5));for(const L of[-1,1]){const P=M-L*d,W=E-g,R=w-_;b=qn(b,os(P,W,R,f*1.15,f*.85,f),v*.35),b=zh(b,-os(P-L*f*.05,W,R-f*.95,f*.42,f*.36,f*.28),.25)}if(t.nostrils)for(const L of[-1,1])b=zh(b,-os(M-L*.09*e,E-x[1]+.02*e,w-x[2]-.14*e,.045*e,.06*e,.06*e),.4);if(t.ears&&t.kind!=="ram")for(const L of[-1,1])b=qn(b,os(M-L*.42*e,E-.1*e,w-.04*e,.15*e,.07*e,.05*e),v*.5);return b=qn(b,Aa(M,E,w,h),v*.6),b=qn(b,Aa(M,E,w,u),v*.6),b}}}function Wf(n,{voxel:t=.8,clipZ:e=null}={}){const[i,s,r]=n.bounds.min,[a,o,c]=n.bounds.max,l=Math.ceil((a-i)/t)+1,h=Math.ceil((o-s)/t)+1,u=Math.ceil((c-r)/t)+1,f=new Float32Array(l*h*u),d=(D,z,B)=>(B*h+z)*l+D,g=(D,z,B)=>{const F=n.sd(D,z,B);return e!=null?Math.max(F,e-B):F},_=4,p=Math.ceil((l-1)/_)+1,m=Math.ceil((h-1)/_)+1,x=Math.ceil((u-1)/_)+1,v=new Float32Array(p*m*x);for(let D=0;D<x;D++)for(let z=0;z<m;z++)for(let B=0;B<p;B++)v[(D*m+z)*p+B]=g(i+B*_*t,s+z*_*t,r+D*_*t);const M=_*t*1.8;for(let D=0;D<u;D++)for(let z=0;z<h;z++)for(let B=0;B<l;B++){const F=Math.min(p-1,Math.round(B/_)),X=Math.min(m-1,Math.round(z/_)),tt=Math.min(x-1,Math.round(D/_)),J=v[(tt*m+X)*p+F];f[d(B,z,D)]=Math.abs(J)>M?J:g(i+B*t,s+z*t,r+D*t)}const E=new Int32Array((l-1)*(h-1)*(u-1)).fill(-1),w=(D,z,B)=>(B*(h-1)+z)*(l-1)+D,b=[],C=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]],S=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]],T=new Float64Array(8);for(let D=0;D<u-1;D++)for(let z=0;z<h-1;z++)for(let B=0;B<l-1;B++){let F=0;for(let Y=0;Y<8;Y++)T[Y]=f[d(B+C[Y][0],z+C[Y][1],D+C[Y][2])],T[Y]<0&&(F|=1<<Y);if(F===0||F===255)continue;let X=0,tt=0,J=0,U=0;for(const[Y,G]of S){if(T[Y]<0==T[G]<0)continue;const K=T[Y]/(T[Y]-T[G]);X+=C[Y][0]+(C[G][0]-C[Y][0])*K,tt+=C[Y][1]+(C[G][1]-C[Y][1])*K,J+=C[Y][2]+(C[G][2]-C[Y][2])*K,U++}E[w(B,z,D)]=b.length/3,b.push(i+(B+X/U)*t,s+(z+tt/U)*t,r+(D+J/U)*t)}const L=[],P=(D,z,B,F,X)=>{D<0||z<0||B<0||F<0||(X?L.push(D,B,z,D,F,B):L.push(D,z,B,D,B,F))};for(let D=1;D<u-1;D++)for(let z=1;z<h-1;z++)for(let B=0;B<l-1;B++){const F=f[d(B,z,D)]<0,X=f[d(B+1,z,D)]<0;F!==X&&P(E[w(B,z-1,D-1)],E[w(B,z,D-1)],E[w(B,z,D)],E[w(B,z-1,D)],X)}for(let D=1;D<u-1;D++)for(let z=0;z<h-1;z++)for(let B=1;B<l-1;B++){const F=f[d(B,z,D)]<0,X=f[d(B,z+1,D)]<0;F!==X&&P(E[w(B-1,z,D-1)],E[w(B-1,z,D)],E[w(B,z,D)],E[w(B,z,D-1)],X)}for(let D=0;D<u-1;D++)for(let z=1;z<h-1;z++)for(let B=1;B<l-1;B++){const F=f[d(B,z,D)]<0,X=f[d(B,z,D+1)]<0;F!==X&&P(E[w(B-1,z-1,D)],E[w(B,z-1,D)],E[w(B,z,D)],E[w(B-1,z,D)],X)}const W=new Float32Array(b.length),R=t*.5;for(let D=0;D<b.length;D+=3){const z=b[D],B=b[D+1],F=b[D+2],X=(G,K,Q)=>{let nt=n.sd(G,K,Q);return e!=null&&(nt=Math.max(nt,e-Q)),nt},tt=X(z+R,B,F)-X(z-R,B,F),J=X(z,B+R,F)-X(z,B-R,F),U=X(z,B,F+R)-X(z,B,F-R),Y=fr(tt,J,U)||1;W[D]=tt/Y,W[D+1]=J/Y,W[D+2]=U/Y}const I=new Ke;return I.setAttribute("position",new Me(b,3)),I.setAttribute("normal",new Ae(W,3)),I.setAttribute("uv",new Me(new Float32Array(b.length/3*2),2)),I.setIndex(L),ry(I),I.computeBoundingBox(),I.computeBoundingSphere(),I}function ry(n){const t=n.attributes.position.array,e=n.attributes.normal.array,i=n.index.array;for(let s=0;s<i.length;s+=3){const r=i[s]*3,a=i[s+1]*3,o=i[s+2]*3,c=t[a]-t[r],l=t[a+1]-t[r+1],h=t[a+2]-t[r+2],u=t[o]-t[r],f=t[o+1]-t[r+1],d=t[o+2]-t[r+2],g=l*d-h*f,_=h*u-c*d,p=c*f-l*u,m=e[r]+e[a]+e[o],x=e[r+1]+e[a+1]+e[o+1],v=e[r+2]+e[a+2]+e[o+2];if(g*m+_*x+p*v<0){const M=i[s+1];i[s+1]=i[s+2],i[s+2]=M}}n.index.needsUpdate=!0}const Gh=new Map;function oy(n={}){const{material:t,part:e="heads",quality:i=1,...s}=n,r={...kc,...s},a=r.detail||Math.max(.35,r.width/(55*Math.sqrt(i))),o=JSON.stringify({...r,voxel:a});let c=Gh.get(o);c||(c=Wf(Vf(r),{voxel:a,clipZ:-r.embed}),Gh.set(o,c));const l=new ue(c,t||new Se);return l.userData.part=e,l.userData.head=r,l.castShadow=l.receiveShadow=!0,l}function ay(n,t,{azimuth:e=0,y:i,s,pitch:r=0,lift:a=0,follow:o=.35}={}){const c=n.userData.lathe,l=s??c.sAtY(i),h=c.frame(e,l),f=new q(Math.sin(e*Math.PI/180),0,Math.cos(e*Math.PI/180)).clone().lerp(h.n,o).normalize(),d=h.b.clone();f.applyAxisAngle(d,r*Math.PI/180);const g=new q().crossVectors(f,d).normalize();g.y<0&&g.negate();const _=new q().crossVectors(g,f).normalize();return t.matrix.makeBasis(_,g,f),t.matrix.setPosition(h.p.clone().addScaledVector(h.n,a)),t.matrix.decompose(t.position,t.quaternion,t.scale),t.matrixWorldNeedsUpdate=!0,t}const dc=(n,t,e)=>Math.min(e,Math.max(t,n)),Qe=(n,t,e)=>n+(t-n)*e,er=n=>n*Math.PI/180,$r=n=>n<=0?0:n>=1?1:n*n*(3-2*n);function Fc({height:n,radius:t,taper:e=0,entasis:i=.04,entasisAt:s=.7,foot:r={swell:.04,height:.06},top:a=null,collar:o=null,rings:c=null,embed:l=8}){const h=n,u=t,f=r||{swell:0,height:0},d=(f.height??.06)<=1?(f.height??.06)*h:f.height,g={flare:.22,height:u*.55,...a||{}},_=[];if(c&&c.count>0){const p=c.width??u*.12,m=c.spacing??p*2.2,x=(c.at??.5)<=1?(c.at??.5)*h:c.at;for(let v=0;v<c.count;v++)_.push({y:x+(v-(c.count-1)/2)*m,w:p,hh:c.height??u*.06,soft:!!c.soft})}return p=>{const m=dc(p/h,0,1);let x=u*(1+e*m);const v=s>0&&s<1?Math.log(.5)/Math.log(s):1;if(x+=u*i*Math.sin(Math.PI*Math.pow(m,v)),f.swell&&(f.step?x+=u*f.swell*(1-$r((p-d)/Math.max(1,u*.06))):x+=u*f.swell*(1-$r(p/Math.max(1,d)))),o){const E=o.from<=1?o.from*h:o.from,w=o.to!=null?o.to<=1?o.to*h:o.to:h+l,b=o.shoulder??u*.08;x+=(o.amount??u*.08)*$r((p-E)/b)*(1-$r((p-w)/b))}for(const E of _){const w=Math.abs(p-E.y)/(E.w/2);w<1&&(x+=E.hh*(E.soft?.5+.5*Math.cos(Math.PI*w):Math.sqrt(1-w*w)))}const M=(p-(h-g.height))/g.height;return M>0&&(x+=u*g.flare*Math.pow(dc(M,0,1),2.2)),x}}function qf(n){var o,c;const t=Fc(n),[e,i]=((o=n.relief)==null?void 0:o.zone)??n.zone,s=er(((c=n.relief)==null?void 0:c.arc)??n.arc??180);let r=0;const a=24;for(let l=1;l<=a;l++){const h=Qe(e,i,(l-1)/a),u=Qe(e,i,l/a);r+=Math.hypot(u-h,t(u)-t(h))}return{w:s*t((e+i)/2),h:r,rMid:t((e+i)/2)}}function cy(n){var R,I;const{height:t,radius:e,material:i=new Se,part:s="legs",density:r=.5,embed:a=8,relief:o=null,hollow:c=null,segments:l=null}=n;let h=t,u=((R=n.splay)==null?void 0:R.angle)??0,f=((I=n.splay)==null?void 0:I.toward)??[0,1],d=0;if(n.cast){const D=new $e(n.cast.seed??11);h*=1+D.jitter(n.cast.length??.004),u+=D.jitter(n.cast.splay??1.2),d=D.jitter(n.cast.twist??2)}const g=Fc({...n,height:h,embed:a}),_=h+a,p=new gn;p.name="column-leg",p.userData.part=s;const m=er(((o==null?void 0:o.facing)??0)+d),x=er((o==null?void 0:o.arc)??180),v=(D,z,B,F,X=1)=>qe((tt,J,U)=>{const Y=Qe(D,z,tt),G=Qe(B,F,J),K=g(G)*X;U.set(Math.sin(Y)*K,G,Math.cos(Y)*K)}),M=2*Math.PI*e,E=(D,z)=>{const B=(l==null?void 0:l.v)??Math.ceil((z-D)/Math.max(1.5,Math.min(6,e*.05)));return Math.max(2,B)},w=D=>Math.max(8,Math.ceil(((l==null?void 0:l.u)??Math.max(48,M*.25))*D)),b=(D,z,B)=>{const F=new ue(D,z);return F.name=B,F.userData.part=s,F.castShadow=F.receiveShadow=!0,p.add(F),F},C=(c&&c.open==="bottom",0);if(o&&o.map){const[D,z]=o.zone,B=o.material||new Se({relief:o.map}),F=o.fade??2,X=x>=Math.PI*2-1e-6;b(re({surface:v(m-x/2,m+x/2,D,z),segments:{density:o.density??r},relief:o.map,fade:X?{u0:0,u1:0,v0:F,v1:F}:F,maxVerts:o.maxVerts}),B,"leg-relief"),X||b(re({surface:v(m+x/2,m-x/2+Math.PI*2,D,z),segments:[w(1-x/(Math.PI*2)),E(D,z)]}),i,"leg-back"),D>C&&b(re({surface:v(m-Math.PI,m+Math.PI,C,D),segments:[w(1),E(C,D)]}),i,"leg-lower"),z<_&&b(re({surface:v(m-Math.PI,m+Math.PI,z,_),segments:[w(1),E(z,_)]}),i,"leg-upper")}else b(re({surface:v(m-Math.PI,m+Math.PI,C,_),segments:[w(1),E(C,_)]}),i,"leg-shaft");const S=c?c.wall??e*.3:0,T=c&&c.open==="bottom"?Math.max(1,g(0)-S):0;if(b(re({surface:(D,z,B)=>{const F=Qe(Math.PI,-Math.PI,D),X=Qe(g(0),T,z);B.pos.set(Math.sin(F)*X,0,Math.cos(F)*X),B.nrm.set(0,-1,0)},segments:[w(1),1]}),i,"leg-sole"),c&&c.open==="bottom"){const D=new Se({interior:1}),z=h-S*.5,B=F=>Math.max(1,g(Math.min(F,h*.85))-S);b(re({surface:qe((F,X,tt)=>{const J=Qe(Math.PI,-Math.PI,F),U=Qe(0,z,X),Y=B(U);tt.set(Math.sin(J)*Y,U,Math.cos(J)*Y)}),segments:[w(1),8]}),D,"leg-core"),b(re({surface:(F,X,tt)=>{const J=Qe(Math.PI,-Math.PI,F),U=Qe(B(z),0,X);tt.pos.set(Math.sin(J)*U,z,Math.cos(J)*U),tt.nrm.set(0,-1,0)},segments:[w(1),1]}),D,"leg-core-top")}const L=new q(Math.sin(m),0,Math.cos(m)),P=D=>L.clone().multiplyScalar(g(D)).setY(D),W=(o==null?void 0:o.zone)??[h*.55,h];if(n.flange){const D=n.flange.from??W[0]+4,z=n.flange.to??W[1]-2,B=Dc({material:i,notches:{every:18,depth:.42,width:3},...n.flange,from:P(D),to:P(z),out:L.clone()});p.add(B)}if(u){const D=new q(f[0],0,f[1]).normalize(),z=new q(0,1,0).cross(D).normalize().negate(),B=new ae().makeTranslation(0,h,0).multiply(new ae().makeRotationAxis(z,er(u))).multiply(new ae().makeTranslation(0,-h,0));for(const F of p.children)F.geometry.applyMatrix4(B),F.geometry.computeBoundingBox(),F.geometry.computeBoundingSphere()}return p.userData.radius=g,p.userData.height=h,p.userData.axis={bottom:P(W[0]),top:P(W[1]),out:L},o&&(p.userData.panel=qf({...n,height:h})),p}function ly({height:n,chord:t,thickness:e,tipChord:i=.25,splay:s=0,outCurve:r=0,embed:a=6,material:o=new Se,part:c="legs"}){const l=n+a,h=f=>{const d=dc(f/n,0,1),g=t*Qe(i,1,Math.pow(d,.8)),_=e*Qe(.35,1,d),p=r*Math.sin(Math.PI*d);return[[0,p+g*.55],[_/2,p-g*.45],[-_/2,p-g*.45]]},u=new gn;u.userData.part=c;for(let f=0;f<3;f++){const d=(f+1)%3,g=re({surface:qe((p,m,x)=>{const v=m*l,M=h(v),E=M[f],w=M[d];x.set(Qe(E[0],w[0],p),v,Qe(E[1],w[1],p))}),segments:[2,24]}),_=new ue(g,o);_.userData.part=c,_.castShadow=_.receiveShadow=!0,u.add(_)}return s&&(u.rotation.x=er(s)),u}const Fe=(n,t,e)=>n+(t-n)*e,hy=n=>n*Math.PI/180;function as(n,t){if(t<=0)return 1;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function yo(n,t,e,i,s){return(r,a)=>{const[o,c,l,h]=s;if(r<=o)a[0]=-n,a[1]=Fe(i,t-e,r/o);else if(r<=c){const u=(r-o)/(c-o)*Math.PI*.5;a[0]=-n+e-e*Math.cos(u),a[1]=t-e+e*Math.sin(u)}else if(r<=l)a[0]=Fe(-n+e,n-e,(r-c)/(l-c)),a[1]=t;else if(r<=h){const u=(r-l)/(h-l)*Math.PI*.5;a[0]=n-e+e*Math.sin(u),a[1]=t-e+e*Math.cos(u)}else a[0]=n,a[1]=Fe(t-e,i,(r-h)/(1-h));return a}}function bo(n,t,e,i){const s=Math.max(.001,t-e-i),r=Math.max(.001,2*(n-e)),a=Math.max(.001,Math.PI/2*e),o=2*s+r+2*a,c=s/o,l=c+a/o,h=l+r/o,u=h+a/o;return[c,l,h,u]}function Xf(n){var v;const{width:t,height:e,bar:i,depth:s}=n,r=t/2,a=n.radius??i*.6,o=n.barTop??i,c=r-i,l=Math.min(((v=n.aperture)==null?void 0:v.radius)??c*.5,c),h=e-o,u=e-a,f=Math.PI/2*a,d=2*(r-a),g=[],_=[],p=yo(r,e,a,0,bo(r,e,a,0)),m=yo(c,h,l,0,bo(c,h,l,0));for(let M=0;M<=64;M++){const E=p(M/64,[0,0]),w=m(M/64,[0,0]);g.push([E[0]+r,E[1]]),_.push([w[0]+r,w[1]])}const x=n.root?{w:n.root.width??i*1.06,h:(n.root.height??i)+(n.root.rise??i*.35)}:null;return{outer:{w:t,h:e,outline:{outer:g,inner:_}},edge:{w:2*u+2*f+d,h:s,legLength:u,arcLength:f,topLength:d},root:x}}function uy(n){var Y;const{width:t,bar:e,depth:i,material:s=new Se,part:r="handles",density:a=.6,faces:o={},channel:c=null}=n;let l=n.height,h=n.lean??0;if(n.cast){const G=new $e(n.cast.seed??5);h+=G.jitter(n.cast.lean??1.5),l*=1+G.jitter(n.cast.height??.008)}const u=n.embed??Math.min(e,20),f=t/2,d=Math.min(n.radius??e*.6,f,l),g=n.barTop??e,_=f-e,p=l-g,m=Math.min(((Y=n.aperture)==null?void 0:Y.radius)??_*.5,_,p),x=i/2,v=bo(f,l,d,-u),M=bo(_,p,m,-u),E=(G,K,Q)=>{const nt=[0,...K,1],rt=[0,...Q,1];for(let ct=0;ct<5;ct++)if(G<=nt[ct+1])return Fe(rt[ct],rt[ct+1],(G-nt[ct])/(nt[ct+1]-nt[ct]));return 1},w=yo(f,l,d,-u,v),b=yo(_,p,m,-u,M),C=[0,0],S=[0,0],T=G=>{w(G,C),b(E(G,v,M),S)},L=new Map,P=G=>G?G.macro?{relief:G}:G:null,W=G=>G?G.material?G.material:(L.has(G.relief)||L.set(G.relief,new Se({relief:G.relief})),L.get(G.relief)):s,R=new gn;R.name="upright-handle",R.userData.part=r;const I=(G,K,Q)=>{const nt=new ue(G,K);return nt.name=Q,nt.userData.part=r,nt.castShadow=nt.receiveShadow=!0,R.add(nt),nt},D=2*(l+u)+2*f,z=Math.max(48,Math.ceil(D/6)),B=G=>{if(!c)return 0;const K=(c.width??e*.3)/2,Q=Math.abs(G-.5)*e/K;return Q<1?-(c.depth??2)*(.5+.5*Math.cos(Math.PI*Q)):0},F=P(o.outer);{const G=(Q,nt,rt)=>{T(Q),rt.set(Fe(S[0],C[0],nt),Fe(S[1],C[1],nt),x+B(nt))},K=(F==null?void 0:F.fade)??1.5;I(re({surface:qe(G),segments:F?{density:F.density??a}:[z,c?12:2],relief:(F==null?void 0:F.relief)??null,fade:0,panelMap:F?(Q,nt,rt)=>{T(Q);const ct=Fe(S[0],C[0],nt),_t=Fe(S[1],C[1],nt),H=Math.hypot(C[0]-S[0],C[1]-S[1]);rt[0]=(ct+f)/t,rt[1]=_t/l,rt[2]=as(Math.min(nt,1-nt)*H,K)*as(_t,K)}:null}),W(F),"handle-outer")}const X=P(o.back);I(re({surface:qe((G,K,Q)=>{T(G),Q.set(Fe(C[0],S[0],K),Fe(C[1],S[1],K),-x)}),segments:X?{density:a}:[z,2],relief:(X==null?void 0:X.relief)??null,fade:0,panelMap:X?(G,K,Q)=>{T(G);const nt=Fe(C[0],S[0],K),rt=Fe(C[1],S[1],K);Q[0]=(f-nt)/t,Q[1]=rt/l,Q[2]=as(Math.min(K,1-K)*e,1.5)*as(rt,1.5)}:null}),W(X),"handle-back");const tt=Xf({...n,height:l}),J=P(o.edge);{const K=new Float32Array(513),Q=[0,0],nt=[0,0];w(0,nt);for(let _t=1;_t<=512;_t++)w(_t/512,Q),K[_t]=K[_t-1]+Math.hypot(Q[0]-nt[0],Q[1]-nt[1]),nt[0]=Q[0],nt[1]=Q[1];const rt=_t=>{const H=_t*512,V=Math.min(511,Math.floor(H));return Fe(K[V],K[V+1],H-V)},ct=(J==null?void 0:J.fade)??1.2;I(re({surface:qe((_t,H,V)=>{w(_t,C),V.set(C[0],C[1],Fe(x,-x,H))}),segments:J?{density:J.density??a}:[z,2],relief:(J==null?void 0:J.relief)??null,fade:0,panelMap:J?(_t,H,V)=>{w(_t,C),V[0]=(rt(_t)-u)/tt.edge.w,V[1]=1-H,V[2]=as(Math.min(H,1-H)*i,ct)*as(C[1],ct)}:null}),W(J),"handle-edge")}const U=P(o.inner);I(re({surface:qe((G,K,Q)=>{T(G),Q.set(S[0],S[1],Fe(-x,x,K))}),segments:[z,2]}),W(U&&!U.relief?U:null),"handle-inner");for(const G of[0,1]){T(G);const K=[C[0],C[1]],Q=[S[0],S[1]],nt=G===0;I(re({surface:qe((rt,ct,_t)=>{const H=Fe(nt?K[0]:Q[0],nt?Q[0]:K[0],rt);_t.set(H,-u,Fe(-x,x,ct))}),segments:[1,1]}),s,"handle-cap")}if(n.root){const G=n.root,K=G.width??e*1.06,Q=G.height??e,nt=G.rise??e*.35,rt=x+(G.outset??i*.3),ct=-x-(G.inset??0),_t=P(o.root);for(const H of[-1,1]){const V=H*(f-e/2),j=V-K/2,it=V+K/2,st=-Q,St=nt,ut=[{n:"front",c:[[j,st,rt],[it,st,rt],[j,St,rt],[it,St,rt]],sp:_t},{n:"back",c:[[it,st,ct],[j,st,ct],[it,St,ct],[j,St,ct]]},{n:"left",c:[[j,st,ct],[j,st,rt],[j,St,ct],[j,St,rt]]},{n:"right",c:[[it,st,rt],[it,st,ct],[it,St,rt],[it,St,ct]]},{n:"top",c:[[j,St,rt],[it,St,rt],[j,St,ct],[it,St,ct]]},{n:"bottom",c:[[j,st,ct],[it,st,ct],[j,st,rt],[it,st,rt]]}];for(const y of ut){const[A,$,ft,ot]=y.c.map(bt=>new q(...bt)),dt=(bt,Mt,yt)=>yt.set(0,0,0).addScaledVector(A,(1-bt)*(1-Mt)).addScaledVector($,bt*(1-Mt)).addScaledVector(ft,(1-bt)*Mt).addScaledVector(ot,bt*Mt),vt=y.sp;I(re({surface:qe(dt),segments:vt?{density:vt.density??a}:[2,2],relief:(vt==null?void 0:vt.relief)??null,fade:(vt==null?void 0:vt.fade)??1.5}),W(vt),`handle-root-${y.n}`).userData.root=!0}}}if(h){const G=new ae().makeRotationX(hy(h));for(const K of R.children)K.userData.root||(K.geometry.applyMatrix4(G),K.geometry.computeBoundingBox(),K.geometry.computeBoundingSphere())}return R.userData.layout=tt,R.userData.lean=h,R}const fy=[[0,0,1],[1,0,0],[0,0,-1],[-1,0,0]],dy=[[1,0,0],[0,0,-1],[-1,0,0],[0,0,1]],ve=(n,t,e)=>n+(t-n)*e,py=n=>n*Math.PI/180;function my(n,t){if(t<=0)return 1;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function gy(n,t){if(!n)return;if(n[he[t]]!==void 0)return n[he[t]];const e=t%2===0?"long":"short";return n[e]!==void 0?n[e]:n.all}function Oc(n,t,e,i){const s=(n&1)===0,r=s?t.b:t.a,a=s?t.a:t.b,o=(2*e-1)*a,c=fy[n],l=dy[n];return i.set(c[0]*r+l[0]*o,t.y,c[2]*r+l[2]*o)}function We(n,t,{material:e,part:i,name:s,segV:r=1,segU:a=4,faces:o=null,map:c=null,density:l=.6}){const h=[];for(let u=0;u<4;u++){const f={a:0,b:0,y:0},d=(v,M,E)=>{const w=t(M);return f.a=w.a,f.b=w.b,f.y=w.y,Oc(u,f,v,E)},g=o?gy(o,u):null,_=g?g.macro?{relief:g}:g:null,p=_?_.material||_y(_.relief):e,m=re({surface:qe(d),segments:_?{density:_.density??l}:[a,r],relief:(_==null?void 0:_.relief)??null,fade:_?{u0:0,u1:0,v0:_.fade??1.5,v1:_.fade??1.5}:0,panelMap:_&&c?c(u,_):null}),x=new ue(m,p);x.name=`${s}-${he[u]}`,x.userData.part=i,x.castShadow=x.receiveShadow=!0,n.add(x),h.push(x)}return h}const Ra=new WeakMap;function _y(n){return Ra.has(n)||Ra.set(n,new Se({relief:n})),Ra.get(n)}function zc(n){const t=n.width,e=n.depth,i=t/2,s=e/2,r=((n.ridge??.4)<=1?(n.ridge??.4)*t:n.ridge)/2,a=Math.min(r,i-.001),o=n.rise??s*Math.tan(py(n.slope??38)),c=n.concave??0,l=m=>(1-c)*m+c*m*m,h={height:0,overhang:0,fascia:0,...n.skirt||{}},u=h.height+(h.fascia??0),f=m=>({a:ve(i,a,m),b:ve(s,0,m),y:u+o*l(m)}),d=48,g=new Float32Array(d+1),_=new Float32Array(d+1);for(let m=1;m<=d;m++){const x=f((m-1)/d),v=f(m/d);g[m]=g[m-1]+Math.hypot(v.b-x.b,v.y-x.y),_[m]=_[m-1]+Math.hypot(v.a-x.a,v.y-x.y)}return{A:i,B:s,rh:a,rise:o,level:f,arc:(m,x)=>{const v=m&1?_:g,M=x*d,E=Math.min(d-1,Math.floor(M));return ve(v[E],v[E+1],M-E)},y0:u,sk:h,top:u+o}}function jf(n){const t=zc(n),e={};for(let i=0;i<4;i++){const s=(i&1)===0,r=2*(s?t.A:t.B),a=t.arc(i,1),o=[];for(let c=0;c<=12;c++){const l=t.level(c/12);o.push([r/2-(s?l.a:l.b),t.arc(i,c/12)])}for(let c=12;c>=0;c--){const l=t.level(c/12);o.push([r/2+(s?l.a:l.b),t.arc(i,c/12)])}e[he[i]]={w:r,h:a,outline:o,shape:s&&t.rh>0?"trapezoid":"triangle"}}return{faces:e,rise:t.rise,top:t.top,ridge:2*t.rh}}function vy(n){const{material:t=new Se,part:e="lid",thickness:i=4,density:s=.6}=n,r=n.interiorMaterial||new Se({interior:1}),a=zc(n),{A:o,B:c,rh:l,level:h,sk:u}=a,f=u.overhang??0,d=o-f,g=c-f,_=new gn;_.name="hipped-lid",_.userData.part=e;const p=i,m=u.height,x=a.y0,v=Math.max(12,Math.ceil(a.arc(0,1)/6)),M=(R,I,D)=>({a:R,b:I,y:D}),E=(R,I)=>{const D=(R&1)===0,z=2*(D?o:c),B=a.arc(R,1),F=B/Math.hypot(B,D?o-l:c),X=I.fade??1.5;return(tt,J,U)=>{const Y=h(J),G=D?Y.a:Y.b,K=(2*tt-1)*G;U[0]=.5+K/z,U[1]=a.arc(R,J)/B,U[2]=my((G-Math.abs(K))*F,X)}};We(_,h,{material:t,part:e,name:"lid-roof",segV:v,faces:n.faces,map:E,density:s}),(u.fascia??0)>0&&We(_,R=>M(o,c,ve(m,x,R)),{material:t,part:e,name:"lid-fascia",segV:1}),f>0&&We(_,R=>M(ve(d,o,R),ve(g,c,R),m),{material:t,part:e,name:"lid-soffit",segV:1}),m>0&&We(_,R=>M(d,g,ve(0,m,R)),{material:t,part:e,name:"lid-skirt",segV:2}),We(_,R=>M(ve(d-p,d,R),ve(g-p,g,R),0),{material:t,part:e,name:"lid-bottom",segV:1});const w=d-p,b=g-p,C=Math.max(p,x-p*.3);C>0&&We(_,R=>M(w,b,ve(C,0,R)),{material:r,part:e,name:"lid-inner-skirt",segV:1});const S=a.top-p*1.6,T=Math.max(0,l-p);if(We(_,R=>{const I=1-R,D=n.concave??0;return M(ve(w,T,I),ve(b,0,I),C+(S-C)*((1-D)*I+D*I*I))},{material:r,part:e,name:"lid-underside",segV:8}),n.seat){const R=n.seat.depth??8,I=n.seat.clearance??.8,D=n.seat.thickness??p,z=(n.seat.width??2*(w-I))/2,B=(n.seat.depth2??2*(b-I))/2;We(_,F=>M(z,B,ve(-R,.5,F)),{material:r,part:e,name:"lid-seat-out",segV:1}),We(_,F=>M(ve(z-D,z,F),ve(B-D,B,F),-R),{material:r,part:e,name:"lid-seat-bottom",segV:1}),We(_,F=>M(z-D,B-D,ve(.5,-R,F)),{material:r,part:e,name:"lid-seat-in",segV:1})}const L=(R,I,D)=>Oc(R,h(D),I,new q),P=[],W={};for(let R=0;R<4;R++){const I=[];for(let z=0;z<=12;z++)I.push(L(R,1,z/12));P.push(I);const D=[];for(let z=0;z<=12;z++)D.push(L(R,.5,z/12));W[he[R]]=D}if(_.userData.hips=P,_.userData.midlines=W,_.userData.ridge=[new q(-l,a.top,0),new q(l,a.top,0)],_.userData.top=a.top,_.userData.layout=jf(n),n.knob){const R=Yf({material:t,part:e,...n.knob});R.position.y=a.top,_.add(R),_.userData.knob=R}return _}function Yf(n){const{material:t=new Se,part:e="lid"}=n,i=new gn;i.name="roof-knob",i.userData.part=e;const s={height:n.depth*.6,width:n.depth*.45,waist:.12,...n.post||{}},r=s.depth??s.width,a=n.embed??Math.max(4,s.height*.4),o=s.height;We(i,g=>{const _=ve(-a,o+1,g),p=Math.max(0,Math.min(1,_/o)),m=1-(s.waist??0)*Math.sin(Math.PI*p);return{a:s.width/2*m,b:r/2*m,y:_}},{material:t,part:e,name:"knob-post",segV:10});const c=zc(n),l=o,h=c.sk,u=g=>{const _=c.level(g);return{a:_.a,b:_.b,y:_.y+l}};if(We(i,u,{material:t,part:e,name:"knob-roof",segV:10,faces:n.faces}),h.height>0){const g=h.overhang??0;We(i,_=>({a:c.A-g,b:c.B-g,y:l+_*h.height}),{material:t,part:e,name:"knob-skirt",segV:1}),g>0&&We(i,_=>({a:ve(c.A-g,c.A,_),b:ve(c.B-g,c.B,_),y:l+h.height}),{material:t,part:e,name:"knob-soffit",segV:1}),(h.fascia??0)>0&&We(i,_=>({a:c.A,b:c.B,y:l+ve(h.height,c.y0,_)}),{material:t,part:e,name:"knob-fascia",segV:1})}const f=h.overhang??0;We(i,g=>({a:ve(0,c.A-f,g)+(c.A-c.B)*(1-g)*0,b:ve(0,c.B-f,g),y:l}),{material:t,part:e,name:"knob-base",segV:1});const d=[];for(let g=0;g<4;g++){const _=[];for(let p=0;p<=8;p++)_.push(Oc(g,u(p/8),1,new q));d.push(_)}return i.userData.hips=d,i.userData.top=l+c.top,i}function xy({height:n,radius:t,swell:e=.12,waist:i=.06,material:s,part:r="legs",density:a=.6}){const o=t,c=n;return Nc({profile:[[0,0],[o*1.03,0,"corner"],[o,c*.06],[o*(1-i),c*.45],[o*(1-i*.4),c*.78],[o*(1+e),c*.96],[o*(1+e),c,"corner"],[0,c]],material:s,part:r,segments:{density:a}})}function My({width:n,height:t,bar:e,thickness:i,material:s,part:r="handles"}){const a=n/2,o=Math.min(a,t)*.45,c=Math.max(.5,o-e),l=new Gu;l.moveTo(-a,0),l.lineTo(-a,t-o),l.quadraticCurveTo(-a,t,-a+o,t),l.lineTo(a-o,t),l.quadraticCurveTo(a,t,a,t-o),l.lineTo(a,0),l.lineTo(a-e,0),l.lineTo(a-e,t-e-c),l.quadraticCurveTo(a-e,t-e,a-e-c,t-e),l.lineTo(-a+e+c,t-e),l.quadraticCurveTo(-a+e,t-e,-a+e,t-e-c),l.lineTo(-a+e,0),l.closePath();const h=Math.min(1.5,i*.15),u=new wc(l,{depth:Math.max(.1,i-2*h),bevelEnabled:!0,bevelThickness:h,bevelSize:h,bevelSegments:2,curveSegments:10});u.translate(0,0,-(i-2*h)/2),u.computeBoundingBox();const f=new ue(u,s);return f.userData.part=r,f.castShadow=f.receiveShadow=!0,f}function yy({radius:n,height:t,thickness:e=5,flare:i=.08,material:s,part:r="foot",density:a=.5}){return Nc({profile:[[n,0],[n*(1-i*.7),t*.6],[n*(1-i),t]],thickness:e,rims:["v0","v1"],material:s,part:r,segments:{density:a}})}const $f=Object.freeze(Object.defineProperty({__proto__:null,FANG_CORNERS:ur,FANG_SIDES:he,HEAD_DEFAULTS:kc,LEIWEN_DEFAULTS:Tc,MOTIFS:Ps,PATINA_MODES:Pf,PATINA_PARAMS:$n,PATINA_PRESETS:Ms,PATINA_PRESET_GROUPS:Rf,PROFILES:Ts,PatinaMaterial:Se,Profile:Ns,ReliefMap:or,ReliefPanel:ar,Rng:$e,animalHead:oy,bakeRelief:Xu,bladeLeg:ly,bladeRow:Sf,blur:eo,borderLine:go,bossField:sc,bossRow:Cx,bowstrings:bf,buildSurface:re,buildTaotie:gf,columnLeg:cy,columnarLeg:xy,companions:Gv,createCanvas:Fa,drawMotif:pr,edgePath:TM,edt:od,fangBody:ZM,fangLayout:Gf,fangSection:zf,flange:Dc,flangeOutline:Df,frame:wf,frieze:fi,getMotif:Ls,getPatina:$s,handleLayout:Xf,hashString:ka,headSDF:Vf,hippedLid:vy,hippedLidLayout:jf,inset:Lx,lathe:Nc,latheFlanges:OM,latheSurface:Of,legPanelSize:qf,legRadius:Fc,leiwenFill:Co,leiwenFillMask:Ac,leiwenOptions:ju,loopHandle:My,meshSDF:Wf,mirrorPair:Rx,mixSeed:tu,motifDefaults:Cc,mountOnLathe:ay,mulberry32:Qh,nearestFeature:mi,parseSectors:cc,patina:le,polyPath:As,profile:Ff,profileCurve:Uc,profileFromTable:DM,quadSurface:gM,register:cs,registerMotif:Af,registers:Px,renderTaotie:df,resolveMotifParams:hr,revolve:ls,ringFoot:yy,rng:sd,roofKnob:Yf,setCanvasFactory:rd,setPatina:_o,setPatinaMode:Lf,setPatinaVessel:Cf,shapes:_v,signedDistance:nu,smoothPath:Qu,taotieContext:af,taotieParts:pf,uprightHandle:uy},Symbol.toStringTag,{value:"Module"})),Hh={type:"change"},Pa={type:"start"},Vh={type:"end"},Kr=new bu,Wh=new ci,by=Math.cos(70*o0.DEG2RAD);class Sy extends Gi{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new q,this.cursor=new q,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Hi.ROTATE,MIDDLE:Hi.DOLLY,RIGHT:Hi.PAN},this.touches={ONE:Vi.ROTATE,TWO:Vi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(k){k.addEventListener("keydown",yt),this._domElementKeyEvents=k},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",yt),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(Hh),i.update(),r=s.NONE},this.update=function(){const k=new q,Tt=new Fi().setFromUnitVectors(t.up,new q(0,1,0)),Nt=Tt.clone().invert(),Z=new q,et=new Fi,N=new q,at=2*Math.PI;return function(Et=null){const Pt=i.object.position;k.copy(Pt).sub(i.target),k.applyQuaternion(Tt),o.setFromVector3(k),i.autoRotate&&r===s.NONE&&P(T(Et)),i.enableDamping?(o.theta+=c.theta*i.dampingFactor,o.phi+=c.phi*i.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let Ot=i.minAzimuthAngle,Bt=i.maxAzimuthAngle;isFinite(Ot)&&isFinite(Bt)&&(Ot<-Math.PI?Ot+=at:Ot>Math.PI&&(Ot-=at),Bt<-Math.PI?Bt+=at:Bt>Math.PI&&(Bt-=at),Ot<=Bt?o.theta=Math.max(Ot,Math.min(Bt,o.theta)):o.theta=o.theta>(Ot+Bt)/2?Math.max(Ot,o.theta):Math.min(Bt,o.theta)),o.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,o.phi)),o.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor),i.zoomToCursor&&w||i.object.isOrthographicCamera?o.radius=X(o.radius):o.radius=X(o.radius*l),k.setFromSpherical(o),k.applyQuaternion(Nt),Pt.copy(i.target).add(k),i.object.lookAt(i.target),i.enableDamping===!0?(c.theta*=1-i.dampingFactor,c.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let Qt=!1;if(i.zoomToCursor&&w){let te=null;if(i.object.isPerspectiveCamera){const Wt=k.length();te=X(Wt*l);const ee=Wt-te;i.object.position.addScaledVector(M,ee),i.object.updateMatrixWorld()}else if(i.object.isOrthographicCamera){const Wt=new q(E.x,E.y,0);Wt.unproject(i.object),i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/l)),i.object.updateProjectionMatrix(),Qt=!0;const ee=new q(E.x,E.y,0);ee.unproject(i.object),i.object.position.sub(ee).add(Wt),i.object.updateMatrixWorld(),te=k.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;te!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(te).add(i.object.position):(Kr.origin.copy(i.object.position),Kr.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(Kr.direction))<by?t.lookAt(i.target):(Wh.setFromNormalAndCoplanarPoint(i.object.up,i.target),Kr.intersectPlane(Wh,i.target))))}else i.object.isOrthographicCamera&&(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/l)),i.object.updateProjectionMatrix(),Qt=!0);return l=1,w=!1,Qt||Z.distanceToSquared(i.object.position)>a||8*(1-et.dot(i.object.quaternion))>a||N.distanceToSquared(i.target)>0?(i.dispatchEvent(Hh),Z.copy(i.object.position),et.copy(i.object.quaternion),N.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",At),i.domElement.removeEventListener("pointerdown",y),i.domElement.removeEventListener("pointercancel",$),i.domElement.removeEventListener("wheel",dt),i.domElement.removeEventListener("pointermove",A),i.domElement.removeEventListener("pointerup",$),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",yt),i._domElementKeyEvents=null)};const i=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const a=1e-6,o=new xh,c=new xh;let l=1;const h=new q,u=new Lt,f=new Lt,d=new Lt,g=new Lt,_=new Lt,p=new Lt,m=new Lt,x=new Lt,v=new Lt,M=new q,E=new Lt;let w=!1;const b=[],C={};let S=!1;function T(k){return k!==null?2*Math.PI/60*i.autoRotateSpeed*k:2*Math.PI/60/60*i.autoRotateSpeed}function L(k){const Tt=Math.abs(k*.01);return Math.pow(.95,i.zoomSpeed*Tt)}function P(k){c.theta-=k}function W(k){c.phi-=k}const R=function(){const k=new q;return function(Nt,Z){k.setFromMatrixColumn(Z,0),k.multiplyScalar(-Nt),h.add(k)}}(),I=function(){const k=new q;return function(Nt,Z){i.screenSpacePanning===!0?k.setFromMatrixColumn(Z,1):(k.setFromMatrixColumn(Z,0),k.crossVectors(i.object.up,k)),k.multiplyScalar(Nt),h.add(k)}}(),D=function(){const k=new q;return function(Nt,Z){const et=i.domElement;if(i.object.isPerspectiveCamera){const N=i.object.position;k.copy(N).sub(i.target);let at=k.length();at*=Math.tan(i.object.fov/2*Math.PI/180),R(2*Nt*at/et.clientHeight,i.object.matrix),I(2*Z*at/et.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(R(Nt*(i.object.right-i.object.left)/i.object.zoom/et.clientWidth,i.object.matrix),I(Z*(i.object.top-i.object.bottom)/i.object.zoom/et.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function z(k){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?l/=k:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function B(k){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?l*=k:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function F(k,Tt){if(!i.zoomToCursor)return;w=!0;const Nt=i.domElement.getBoundingClientRect(),Z=k-Nt.left,et=Tt-Nt.top,N=Nt.width,at=Nt.height;E.x=Z/N*2-1,E.y=-(et/at)*2+1,M.set(E.x,E.y,1).unproject(i.object).sub(i.object.position).normalize()}function X(k){return Math.max(i.minDistance,Math.min(i.maxDistance,k))}function tt(k){u.set(k.clientX,k.clientY)}function J(k){F(k.clientX,k.clientX),m.set(k.clientX,k.clientY)}function U(k){g.set(k.clientX,k.clientY)}function Y(k){f.set(k.clientX,k.clientY),d.subVectors(f,u).multiplyScalar(i.rotateSpeed);const Tt=i.domElement;P(2*Math.PI*d.x/Tt.clientHeight),W(2*Math.PI*d.y/Tt.clientHeight),u.copy(f),i.update()}function G(k){x.set(k.clientX,k.clientY),v.subVectors(x,m),v.y>0?z(L(v.y)):v.y<0&&B(L(v.y)),m.copy(x),i.update()}function K(k){_.set(k.clientX,k.clientY),p.subVectors(_,g).multiplyScalar(i.panSpeed),D(p.x,p.y),g.copy(_),i.update()}function Q(k){F(k.clientX,k.clientY),k.deltaY<0?B(L(k.deltaY)):k.deltaY>0&&z(L(k.deltaY)),i.update()}function nt(k){let Tt=!1;switch(k.code){case i.keys.UP:k.ctrlKey||k.metaKey||k.shiftKey?W(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):D(0,i.keyPanSpeed),Tt=!0;break;case i.keys.BOTTOM:k.ctrlKey||k.metaKey||k.shiftKey?W(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):D(0,-i.keyPanSpeed),Tt=!0;break;case i.keys.LEFT:k.ctrlKey||k.metaKey||k.shiftKey?P(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):D(i.keyPanSpeed,0),Tt=!0;break;case i.keys.RIGHT:k.ctrlKey||k.metaKey||k.shiftKey?P(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):D(-i.keyPanSpeed,0),Tt=!0;break}Tt&&(k.preventDefault(),i.update())}function rt(k){if(b.length===1)u.set(k.pageX,k.pageY);else{const Tt=Rt(k),Nt=.5*(k.pageX+Tt.x),Z=.5*(k.pageY+Tt.y);u.set(Nt,Z)}}function ct(k){if(b.length===1)g.set(k.pageX,k.pageY);else{const Tt=Rt(k),Nt=.5*(k.pageX+Tt.x),Z=.5*(k.pageY+Tt.y);g.set(Nt,Z)}}function _t(k){const Tt=Rt(k),Nt=k.pageX-Tt.x,Z=k.pageY-Tt.y,et=Math.sqrt(Nt*Nt+Z*Z);m.set(0,et)}function H(k){i.enableZoom&&_t(k),i.enablePan&&ct(k)}function V(k){i.enableZoom&&_t(k),i.enableRotate&&rt(k)}function j(k){if(b.length==1)f.set(k.pageX,k.pageY);else{const Nt=Rt(k),Z=.5*(k.pageX+Nt.x),et=.5*(k.pageY+Nt.y);f.set(Z,et)}d.subVectors(f,u).multiplyScalar(i.rotateSpeed);const Tt=i.domElement;P(2*Math.PI*d.x/Tt.clientHeight),W(2*Math.PI*d.y/Tt.clientHeight),u.copy(f)}function it(k){if(b.length===1)_.set(k.pageX,k.pageY);else{const Tt=Rt(k),Nt=.5*(k.pageX+Tt.x),Z=.5*(k.pageY+Tt.y);_.set(Nt,Z)}p.subVectors(_,g).multiplyScalar(i.panSpeed),D(p.x,p.y),g.copy(_)}function st(k){const Tt=Rt(k),Nt=k.pageX-Tt.x,Z=k.pageY-Tt.y,et=Math.sqrt(Nt*Nt+Z*Z);x.set(0,et),v.set(0,Math.pow(x.y/m.y,i.zoomSpeed)),z(v.y),m.copy(x);const N=(k.pageX+Tt.x)*.5,at=(k.pageY+Tt.y)*.5;F(N,at)}function St(k){i.enableZoom&&st(k),i.enablePan&&it(k)}function ut(k){i.enableZoom&&st(k),i.enableRotate&&j(k)}function y(k){i.enabled!==!1&&(b.length===0&&(i.domElement.setPointerCapture(k.pointerId),i.domElement.addEventListener("pointermove",A),i.domElement.addEventListener("pointerup",$)),Ut(k),k.pointerType==="touch"?wt(k):ft(k))}function A(k){i.enabled!==!1&&(k.pointerType==="touch"?ht(k):ot(k))}function $(k){Ct(k),b.length===0&&(i.domElement.releasePointerCapture(k.pointerId),i.domElement.removeEventListener("pointermove",A),i.domElement.removeEventListener("pointerup",$)),i.dispatchEvent(Vh),r=s.NONE}function ft(k){let Tt;switch(k.button){case 0:Tt=i.mouseButtons.LEFT;break;case 1:Tt=i.mouseButtons.MIDDLE;break;case 2:Tt=i.mouseButtons.RIGHT;break;default:Tt=-1}switch(Tt){case Hi.DOLLY:if(i.enableZoom===!1)return;J(k),r=s.DOLLY;break;case Hi.ROTATE:if(k.ctrlKey||k.metaKey||k.shiftKey){if(i.enablePan===!1)return;U(k),r=s.PAN}else{if(i.enableRotate===!1)return;tt(k),r=s.ROTATE}break;case Hi.PAN:if(k.ctrlKey||k.metaKey||k.shiftKey){if(i.enableRotate===!1)return;tt(k),r=s.ROTATE}else{if(i.enablePan===!1)return;U(k),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(Pa)}function ot(k){switch(r){case s.ROTATE:if(i.enableRotate===!1)return;Y(k);break;case s.DOLLY:if(i.enableZoom===!1)return;G(k);break;case s.PAN:if(i.enablePan===!1)return;K(k);break}}function dt(k){i.enabled===!1||i.enableZoom===!1||r!==s.NONE||(k.preventDefault(),i.dispatchEvent(Pa),Q(vt(k)),i.dispatchEvent(Vh))}function vt(k){const Tt=k.deltaMode,Nt={clientX:k.clientX,clientY:k.clientY,deltaY:k.deltaY};switch(Tt){case 1:Nt.deltaY*=16;break;case 2:Nt.deltaY*=100;break}return k.ctrlKey&&!S&&(Nt.deltaY*=10),Nt}function bt(k){k.key==="Control"&&(S=!0,document.addEventListener("keyup",Mt,{passive:!0,capture:!0}))}function Mt(k){k.key==="Control"&&(S=!1,document.removeEventListener("keyup",Mt,{passive:!0,capture:!0}))}function yt(k){i.enabled===!1||i.enablePan===!1||nt(k)}function wt(k){switch(Dt(k),b.length){case 1:switch(i.touches.ONE){case Vi.ROTATE:if(i.enableRotate===!1)return;rt(k),r=s.TOUCH_ROTATE;break;case Vi.PAN:if(i.enablePan===!1)return;ct(k),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(i.touches.TWO){case Vi.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;H(k),r=s.TOUCH_DOLLY_PAN;break;case Vi.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;V(k),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(Pa)}function ht(k){switch(Dt(k),r){case s.TOUCH_ROTATE:if(i.enableRotate===!1)return;j(k),i.update();break;case s.TOUCH_PAN:if(i.enablePan===!1)return;it(k),i.update();break;case s.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;St(k),i.update();break;case s.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;ut(k),i.update();break;default:r=s.NONE}}function At(k){i.enabled!==!1&&k.preventDefault()}function Ut(k){b.push(k.pointerId)}function Ct(k){delete C[k.pointerId];for(let Tt=0;Tt<b.length;Tt++)if(b[Tt]==k.pointerId){b.splice(Tt,1);return}}function Dt(k){let Tt=C[k.pointerId];Tt===void 0&&(Tt=new Lt,C[k.pointerId]=Tt),Tt.set(k.pageX,k.pageY)}function Rt(k){const Tt=k.pointerId===b[0]?b[1]:b[0];return C[Tt]}i.domElement.addEventListener("contextmenu",At),i.domElement.addEventListener("pointerdown",y),i.domElement.addEventListener("pointercancel",$),i.domElement.addEventListener("wheel",dt,{passive:!1}),document.addEventListener("keydown",bt,{passive:!0,capture:!0}),this.update()}}const Zr=new Xt("#0b0a09"),qh=ou,Xh=.85,Sn=Math.PI/180;class wy{constructor(t,{deterministic:e=!1,pixelRatio:i=null}={}){this.deterministic=e,this.pixelRatio=i;const s=new ku({canvas:t,antialias:!0,powerPreference:"high-performance"});s.setPixelRatio(i??Math.min(window.devicePixelRatio||1,2)),s.outputColorSpace=Te,s.toneMapping=qh,s.toneMappingExposure=Xh,s.shadowMap.enabled=!0,s.shadowMap.type=su,this.renderer=s;const r=new hh;r.background=Zr.clone(),this.scene=r,this.camera=new rn(30,1,5,2e5),this.camera.position.set(0,300,1500),this.controls=new Sy(this.camera,t),this.controls.enableDamping=!e,this.controls.dampingFactor=.08,this.controls.autoRotateSpeed=.35,this.controls.autoRotate=!e,this.controls.addEventListener("start",()=>{this.controls.autoRotate=!1}),this.controls.addEventListener("change",()=>this.dirty=!0),this._buildEnvironment(),this._buildRoom(),this._buildLights(),this.content=null,this.box=new En(new q(-100,0,-100),new q(100,200,100)),this.mode="beauty",this.rig="vitrine",this.insets={left:0,right:0,top:0,bottom:0},this.fitScale=e?1:1.18,this.dirty=!0,this._frameWaiters=[],this.onFrame=null,this.resize(),window.addEventListener("resize",()=>this.resize());const a=()=>{requestAnimationFrame(a),(this.controls.update()||this.dirty||this._frameWaiters.length)&&this.render()};requestAnimationFrame(a)}_buildEnvironment(){const t=e=>{const i=new hh,s=_=>{const p=new Xt(_);return e?p.setScalar(.2126*p.r+.7152*p.g+.0722*p.b):p},r=(_,p)=>new Pi({color:s(_).multiplyScalar(p),side:Pn}),a=new uo(16,32,16),o=[],c=a.attributes.position,l=s("#121211"),h=s("#343230"),u=s("#43413e");for(let _=0;_<c.count;_++){const p=c.getY(_)/16,m=p<0?l.clone().lerp(h,p+1):h.clone().lerp(u,Math.min(1,p*1.4));o.push(m.r,m.g,m.b)}a.setAttribute("color",new Me(o,3)),i.add(new ue(a,new Pi({vertexColors:!0,side:Xe})));const f=(_,p,m,x,v,M,E)=>{const w=new ue(new gs(_,p),r(m,x));return w.position.set(...v),w.lookAt(...M),i.add(w),w};f(7,4.5,"#fff0e2",5.5,[-5.5,7,6],[0,.5,0]),f(9,6,"#fff0e0",.8,[0,9.5,0],[0,0,0]);for(let _=0;_<5;_++)f(.5,.5,"#fff0dc",14,[-6+_*3,11,-3+_%2*5],[0,0,0]);f(1.3,8,"#b9cde6",2.2,[8,4,-6],[0,2,0]),f(6,2.2,"#ffe2c4",.9,[-2,3.5,-10],[0,2,0]),f(5,4,"#ffe6d2",1.6,[9,3,5],[0,1.5,0]),f(6,4,"#ffeadb",1.4,[-10,3,-1],[0,1.5,0]);for(const _ of[-7.5,7.5])f(.08,12,"#e8e0d4",1.2,[_,3,7.5],[_,3,0]);f(10,10,"#1e1d1b",1,[0,-2.5,0],[0,0,0]),f(18,7,"#5f5b56",2.2,[0,3,13],[0,3,0]),f(3.5,2.2,"#ffeedd",3,[2.5,4.5,11],[0,1.5,0]);const d=new Xa(this.renderer),g=d.fromScene(i,.015).texture;return d.dispose(),g};this.envMap=t(!1),this.envNeutral=t(!0),this.scene.environment=this.envMap}_buildRoom(){this.backdrop=new ue(new uo(1,32,16),new Pi({color:Zr,side:Xe,fog:!1,depthWrite:!1,toneMapped:!1})),this.backdrop.renderOrder=-1,this.scene.add(this.backdrop),this.floor=new ue(new gs(1,1),new to({color:"#141210",roughness:.97,metalness:0,envMapIntensity:.2})),this.floor.rotation.x=-Math.PI/2,this.floor.receiveShadow=!0,this.scene.add(this.floor);const t=new to({color:"#2b2722",roughness:.9,metalness:0,envMapIntensity:.3}),e=new to({color:"#1a1714",roughness:.93,metalness:0,envMapIntensity:.25});this.plinth=new ue(new Ds(1,1,1),[e,e,t,e,e,e]),this.plinth.receiveShadow=!0,this.plinth.castShadow=!0,this.scene.add(this.plinth);const i=document.createElement("canvas");i.width=i.height=128;const s=i.getContext("2d"),r=s.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,"rgba(0,0,0,0.75)"),r.addColorStop(.45,"rgba(0,0,0,0.42)"),r.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=r,s.fillRect(0,0,128,128);const a=new p_(i);a.colorSpace=Te,this.contact=new ue(new gs(1,1),new Pi({map:a,transparent:!0,depthWrite:!1,toneMapped:!1,fog:!1})),this.contact.rotation.x=-Math.PI/2,this.contact.renderOrder=1,this.scene.add(this.contact),this._fog=new yc(Zr,1e3,5e3),this.scene.fog=this._fog}_buildLights(){this.key=new vh("#fff6ee",4.2,0,.5,.6,0),this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048),this.key.shadow.bias=-2e-4,this.key.shadow.radius=4,this.scene.add(this.key,this.key.target),this.fill=new K_("#c3cbd6",.3),this.scene.add(this.fill,this.fill.target),this.rim=new vh("#dfe6f0",2.6,0,.45,.95,0),this.scene.add(this.rim,this.rim.target),this.ambient=new j_("#363533","#0c0b0a",.3),this.scene.add(this.ambient),this._lightLook={key:this.key.color.clone(),fill:this.fill.color.clone(),rim:this.rim.color.clone()}}setContent(t,{rig:e="vitrine"}={}){this.content&&this.scene.remove(this.content),this.content=t,this.rig=e,t&&(this.scene.add(t),t.updateMatrixWorld(!0),this.box=new En().setFromObject(t),Cf(t)),this._layoutRoom(),this.dirty=!0}_layoutRoom(){const t=this.box,e=t.getSize(new q),i=t.getCenter(new q),s=Math.max(e.length()/2,10);this.R=s;const r=Math.max(12,Math.min(60,e.y*.08)),a=Math.max(e.x,e.z*.6)*1.32+40,o=Math.max(e.z,e.x*.5)*1.32+40;this.plinth.scale.set(a,r,o),this.plinth.position.set(i.x,t.min.y-r/2,i.z),this.floor.scale.set(s*60,s*60,1),this.floor.position.set(i.x,t.min.y-r,i.z),this.backdrop.scale.setScalar(s*40),this.backdrop.position.copy(i),this.contact.scale.set(e.x*1.25+20,e.z*1.25+20,1),this.contact.position.set(i.x,t.min.y+.3,i.z);const c=new q(i.x,t.min.y+e.y*.45,i.z),l=(f,d)=>new q(Math.sin(f*Sn)*Math.cos(d*Sn),Math.sin(d*Sn),Math.cos(f*Sn)*Math.cos(d*Sn)),h=s*4.2;this.rig==="raking"?(this.key.position.copy(c).addScaledVector(l(-74,22),h),this.key.angle=Math.atan(s*1.6/h),this.key.intensity=5.2,this.rim.intensity=.6,this.fill.intensity=.2,this.contact.visible=!1):(this.key.position.copy(c).addScaledVector(l(-36,34),h),this.key.angle=Math.atan(s*1.9/h),this.key.intensity=4.2,this.rim.intensity=3.2,this.fill.intensity=1.5,this.contact.visible=!0),this.key.target.position.copy(c);const u=this.key.shadow.camera;u.near=h*.4,u.far=h*2,u.updateProjectionMatrix(),this.key.shadow.normalBias=s*.0015,this.key.shadow.needsUpdate=!0,this.rim.position.copy(c).addScaledVector(l(165,32),h),this.rim.angle=Math.atan(s*1.5/h),this.rim.target.position.copy(c),this.fill.position.copy(c).addScaledVector(l(60,12),h),this.fill.target.position.copy(c)}setView(t={}){const{azimuth:e=25,elevation:i=12,fov:s=30}=t,r=(t.fit??1.1)*this.fitScale,a=this.camera;a.fov=s;const o=this.box,c=t.target?new q(...t.target):o.getCenter(new q),l=new q(Math.sin(e*Sn)*Math.cos(i*Sn),Math.sin(i*Sn),Math.cos(e*Sn)*Math.cos(i*Sn)),h=new q().crossVectors(new q(0,1,0),l).normalize();h.lengthSq()<1e-6&&h.set(1,0,0);const u=new q().crossVectors(l,h).normalize(),{w:f,h:d}=this._effectiveSize(),g=Math.tan(s*Sn/2)/(this.height/2),_=g*(d/2),p=g*(f/2);let m=0;if(t.target)m=this.R*r/Math.min(_,p);else{for(let x=0;x<8;x++){const v=new q(x&1?o.max.x:o.min.x,x&2?o.max.y:o.min.y,x&4?o.max.z:o.min.z).sub(c),M=Math.abs(v.dot(h)),E=Math.abs(v.dot(u)),w=v.dot(l);m=Math.max(m,w+M/p,w+E/_)}m*=r}a.position.copy(c).addScaledVector(l,m),this.controls.target.copy(c),a.near=Math.max(1,m/100),a.far=this.R*80,a.updateProjectionMatrix(),this.controls.minDistance=this.R*.25,this.controls.maxDistance=this.R*12,this.controls.maxPolarAngle=Math.PI*.5-.02,this.controls.update(),this._fog.near=m+this.R*1.4,this._fog.far=m+this.R*9,this._applyViewOffset(),this.dirty=!0}setInsets(t){this.insets={left:0,right:0,top:0,bottom:0,...t},this._applyViewOffset(),this.dirty=!0}_effectiveSize(){const t=this.width||1,e=this.height||1;return{w:Math.max(100,t-this.insets.left-this.insets.right),h:Math.max(100,e-this.insets.top-this.insets.bottom)}}_applyViewOffset(){const t=this.width,e=this.height,i=(this.insets.right-this.insets.left)/2,s=(this.insets.bottom-this.insets.top)/2;Math.abs(i)<.5&&Math.abs(s)<.5?this.camera.clearViewOffset():this.camera.setViewOffset(t,e,i,s,t,e),this.camera.aspect=t/e,this.camera.updateProjectionMatrix()}setMode(t){this.mode=t;const e=t==="beauty"||t==="clay",i=t==="clay";Lf(t==="silhouette"?"beauty":t),this.renderer.toneMapping=e?qh:jn,this.renderer.toneMappingExposure=i?1:Xh,this.scene.overrideMaterial=t==="silhouette"?this._white??(this._white=new Pi({color:16777215})):null;for(const s of[this.floor,this.plinth,this.backdrop])s.visible=e;this.contact.visible=e&&this.rig!=="raking";for(const s of[this.key,this.fill,this.rim,this.ambient])s.visible=e;this.key.color.copy(i?new Xt("#ffffff"):this._lightLook.key),this.fill.color.copy(i?new Xt("#d8d8d8"):this._lightLook.fill),this.rim.color.copy(i?new Xt("#ffffff"):this._lightLook.rim),this.scene.environment=e?i?this.envNeutral:this.envMap:null,this.scene.fog=e?this._fog:null,this.scene.background=e?Zr:new Xt(0),this.dirty=!0}resize(){const t=window.innerWidth,e=window.innerHeight,i=this.pixelRatio??Math.min(window.devicePixelRatio||1,2);i!==this.renderer.getPixelRatio()&&this.renderer.setPixelRatio(i),this.width=t,this.height=e,this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this._applyViewOffset(),this.dirty=!0}restoreContext(){var t;for(const e of[this.envMap,this.envNeutral])(t=e==null?void 0:e.dispose)==null||t.call(e);this._buildEnvironment(),this.setMode(this.mode),this.key.shadow.needsUpdate=!0,this.dirty=!0}render(){this.dirty=!1,this.renderer.render(this.scene,this.camera);const t=this._frameWaiters;this._frameWaiters=[];for(const e of t)e();this.onFrame&&this.onFrame()}frame(){return new Promise(t=>{this._frameWaiters.push(t),this.dirty=!0})}setAutoRotate(t){this.controls.autoRotate=t&&!this.deterministic}}const Ey=["beauty","clay","silhouette","height","mask"];function pc(n=location.hash){let t=String(n||"").replace(/^#/,"");try{t=decodeURIComponent(t)}catch{return null}return t=t.trim(),/^[A-Za-z0-9-]{1,80}$/.test(t)?t:null}function Ty(){const n=e=>{try{return window.matchMedia(e).matches}catch{return!1}},t=Math.min((screen==null?void 0:screen.width)||9999,(screen==null?void 0:screen.height)||9999);return n("(pointer: coarse)")&&t<=820||Math.min(window.innerWidth,window.innerHeight)<=500||window.innerWidth<=720}const Kf={get(n){var t;try{return((t=window.localStorage)==null?void 0:t.getItem(n))??null}catch{return null}},set(n,t){var e,i;try{t==null?(e=window.localStorage)==null||e.removeItem(n):(i=window.localStorage)==null||i.setItem(n,String(t))}catch{}}},Zf="taotie-bronze.quality";function Ay(n=location.search,t=location.hash){const e=new URLSearchParams(n),i=f=>{const d=parseFloat(e.get(f));return Number.isFinite(d)?d:null},s=e.get("mode"),r=Ty(),a=pc(t),o=parseFloat(Kf.get(Zf)),c=i("q"),l=c??(Number.isFinite(o)?o:r?.5:1),h=i("dpr"),u=e.get("tab");return{a:e.get("a"),view:e.get("view"),patina:e.get("patina"),mode:Ey.includes(s)?s:"beauty",ui:e.get("ui")!=="0",q:Math.min(4,Math.max(.25,l)),qExplicit:c!=null,compact:r,dpr:Math.min(3,Math.max(.5,h??Math.min(window.devicePixelRatio||1,2))),tab:u==="atlas"||!u&&!e.get("a")&&a==="atlas"?"atlas":"vessels",motif:e.get("motif"),preset:e.get("preset"),route:a}}const Ry=`// The artifact registry: one line per artifact, alphabetical by file name.
// Each module's default export follows the artifact contract in KIT.md.
export { default as demoFangding } from './demo-fangding.js'
export { default as houmuwuDing } from './houmuwu-ding.js'
export { default as metFangyi } from './met-fangyi.js'
export { default as metGu } from './met-gu.js'
export { default as metZun } from './met-zun.js'
export { default as nezuFangyi } from './nezu-fangyi.js'
`,Py=Object.assign({"../artifacts/demo-fangding.js":()=>Ti(()=>import("./demo-fangding-CejCz6hv.js"),[],import.meta.url).then(n=>n.default),"../artifacts/houmuwu-ding.js":()=>Ti(()=>import("./houmuwu-ding-DxwJK5eN.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-fangyi.js":()=>Ti(()=>import("./met-fangyi-CD86PDaa.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-gu.js":()=>Ti(()=>import("./met-gu-B_oZS5DL.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-zun.js":()=>Ti(()=>import("./met-zun-zkDUDEFU.js"),[],import.meta.url).then(n=>n.default),"../artifacts/nezu-fangyi.js":()=>Ti(()=>import("./nezu-fangyi-Bid1LJ4G.js"),[],import.meta.url).then(n=>n.default)}),jh=(n,t)=>(n.order??0)-(t.order??0)||String(n.title).localeCompare(String(t.title));function Ly(){const n=[...Ry.matchAll(/^\s*export\s*\{\s*default\s+as\s+\w+\s*\}\s*from\s*['"]\.\/([^'"]+\.js)['"]/gm)].map(c=>c[1]),t=[];for(const c of n){const l=Py["../artifacts/"+c];if(!l){console.warn(`[taotie] ${c} is registered but not lazily loadable (study files starting with "_" are skipped)`);continue}t.push({file:c,id:c.replace(/\.js$/,""),loader:l,artifact:null,promise:null})}const e=t.map(c=>c.id),i=new Set;let s=null;const r=c=>t.find(l=>{var h;return l.id===c||((h=l.artifact)==null?void 0:h.id)===c});function a(c){return c.promise??(c.promise=c.loader().then(l=>{c.artifact=l,l!=null&&l.id&&l.id!==c.id&&(e[e.indexOf(c.id)]=l.id,c.id=l.id);for(const h of i)h(l);return l})),c.promise}function o(){return s??(s=Promise.all(t.map(c=>a(c))).then(()=>{const c=t.map(l=>l.artifact).sort(jh);return e.splice(0,e.length,...c.map(l=>l.id)),c})),s}return{ids:e,get loaded(){return t.filter(c=>c.artifact).map(c=>c.artifact).sort(jh)},has:c=>!!r(c),get:c=>{var l;return((l=r(c))==null?void 0:l.artifact)||null},async load(c){var h;const l=r(c);return l?a(l):(await o(),((h=r(c))==null?void 0:h.artifact)||null)},loadAll:o,async first(){return(await o())[0]},onLoad(c){i.add(c)}}}function kt(n,t={},...e){const i=document.createElement(n);for(const[s,r]of Object.entries(t))r==null||r===!1||(s==="class"?i.className=r:s==="text"?i.textContent=r:s.startsWith("on")?i.addEventListener(s.slice(2),r):i.setAttribute(s,r===!0?"":r));for(const s of e.flat())s!=null&&i.append(s);return i}const La=(n,t,e)=>{const i=t>=1?0:t>=.1?1:2;return Number(n).toFixed(i)+(e?" "+e:"")};function Yh({label:n,min:t,max:e,step:i=.01,value:s,unit:r,onInput:a,cls:o}){const c=kt("span",{class:"ctl-val",text:La(s,i,r)}),l=kt("input",{type:"range",min:t,max:e,step:i,value:s,"aria-label":n});return l.addEventListener("input",()=>{const u=parseFloat(l.value);c.textContent=La(u,i,r),a(u)}),{el:kt("div",{class:"ctl"+(o?" "+o:"")},kt("div",{class:"ctl-row"},kt("span",{class:"ctl-label",text:n}),c),l),set(u){l.value=u,c.textContent=La(u,i,r)}}}function Cy({label:n,value:t,onInput:e}){const i=kt("input",{type:"color",value:t,"aria-label":n});return i.addEventListener("input",()=>e(i.value)),{el:kt("div",{class:"ctl"},kt("div",{class:"ctl-row"},kt("span",{class:"ctl-label",text:n}),i)),set:r=>i.value=r}}function Qb({label:n,options:t,value:e,onInput:i}){const s=kt("select",{"aria-label":n},t.map(a=>kt("option",{value:a,text:a,selected:a===e})));return s.addEventListener("change",()=>i(s.value)),{el:kt("div",{class:"ctl"},kt("div",{class:"ctl-row"},kt("span",{class:"ctl-label",text:n})),s),set:a=>s.value=a}}function tS({label:n,value:t,onInput:e}){const i=kt("input",{type:"checkbox",checked:!!t,"aria-label":n});return i.addEventListener("change",()=>e(i.checked)),{el:kt("label",{class:"ctl toggle"},kt("span",{class:"ctl-label",text:n}),i),set:r=>i.checked=!!r}}function Ca(n,t,{value:e,onPick:i,seg:s=!1}={}){const r=n||kt("div");r.classList.add(s?"seg":"chips"),r.replaceChildren();const a=t.map(c=>{const l=kt("button",{type:"button",text:c.label??c.id,"data-id":c.id});return l.addEventListener("click",()=>{o(c.id),i==null||i(c.id)}),r.append(l),l});function o(c){for(const l of a)l.classList.toggle("on",l.dataset.id===c)}return o(e),{el:r,set:o}}const Dy=()=>new Promise(n=>setTimeout(n,0)),js=n=>Math.round(n*10)/10,$h=n=>{const t=n.getSize(new q);return{min:n.min.toArray().map(js),max:n.max.toArray().map(js),w:js(t.x),h:js(t.y),d:js(t.z)}};function Iy(n){if(!n)return null;n.updateMatrixWorld(!0);const t=new En().setFromObject(n),e={};n.traverse(s=>{var c;if(!s.isMesh)return;let r=null,a=null;for(let l=s;l;l=l.parent){if((c=l.userData)!=null&&c.part)if(r||(r=l.userData.part),l.userData.part===r)a=l;else break;if(l===n)break}if(!r)return;const o=e[r]??(e[r]={box:new En,roots:new Set});o.box.union(new En().setFromObject(s)),o.roots.add(a)});const i={overall:$h(t),parts:{}};for(const[s,r]of Object.entries(e))i.parts[s]={...$h(r.box),count:r.roots.size};return i}function Jf(n){const t={triangles:0,vertices:0,meshes:0};return n==null||n.traverse(e=>{var r,a;if(!e.isMesh||!e.geometry)return;const i=e.geometry,s=i.index?i.index.count:((r=i.attributes.position)==null?void 0:r.count)||0;t.triangles+=Math.floor(s/3),t.vertices+=((a=i.attributes.position)==null?void 0:a.count)||0,t.meshes++}),t}function Uy(n){const t=Jf(n),e=i=>i>=1e6?(i/1e6).toFixed(2)+" M":i>=1e4?Math.round(i/1e3)+" k":i>=1e3?(i/1e3).toFixed(1)+" k":String(i);return`${e(t.triangles)} triangles · ${e(t.vertices)} vertices · ${t.meshes} meshes`}function Ny(n){let t;const e=new Promise(i=>t=i);return window.__taotie={ready:e,...n},{markReady(){document.documentElement.dataset.ready="1",t(!0)}}}const ky=n=>{const t=n/10;return(t>=100?Math.round(t):Math.round(t*10)/10).toString()},Kh=n=>String(n.collection||"").split(/\s+—\s+|\s+-\s+/)[0],Zh=n=>n&&!/^(unknown|not published|n\/a|none)$/i.test(String(n).trim()),Da=n=>(n.order??0)>=90;function Fy({stage:n,catalog:t,quality:e,cacheMax:i=2,progress:s,listEl:r,labelEl:a,onShown:o,onPick:c}){const l=new Map;let h=null,u=0,f=null;const d={};let g=!1,_=null,p=e,m=null;const x=new Map;function v(){const P=t.loaded,W=t.ids.filter(I=>!t.get(I));r.replaceChildren();let R=!1;for(const I of P){Da(I)&&!R&&(R=!0,r.append(kt("li",{class:"sep","aria-hidden":"true"},kt("span",{class:"cap",text:"Kit test piece"}))));const D=kt("span",{class:"v-sub"}),z=kt("button",{type:"button",class:"vessel","data-id":I.id,onclick:()=>c(I.id)},kt("span",{class:"v-line"},kt("span",{class:"v-title",text:I.title}),I.titleZh?kt("span",{class:"v-zh",lang:"zh-Hans",text:I.titleZh}):null),D);x.set(I.id,{btn:z,sub:D,a:I}),r.append(kt("li",{},z)),M(I.id)}for(const I of W)r.append(kt("li",{class:"pending"},kt("span",{class:"v-title",text:I.replace(/-/g," ")})));E()}function M(P,W){const R=x.get(P);if(!R)return;const I=R.a,D=Zh(I.accession)&&String(I.accession).length<=18?" · "+I.accession:"";R.sub.textContent=W??(Da(I)?"Procedural · not an excavated object":Kh(I)+D),R.sub.classList.toggle("busy",W!=null)}function E(){const P=(h==null?void 0:h.artifact.id)??_;for(const[W,R]of x)W===P?R.btn.setAttribute("aria-current","true"):R.btn.removeAttribute("aria-current")}t.onLoad(()=>v()),v();function w(P){const W=P.dimensions||{},R=["h","w","d"].filter(z=>W[z]).map(z=>`${z.toUpperCase()} ${ky(W[z])}`).join(" × ")+(Object.keys(W).length?" cm":""),I=(z,B)=>B?kt("div",{class:"row"},kt("dt",{text:z}),kt("dd",{text:B})):null,D=kt("button",{type:"button",class:"label-head","aria-expanded":String(g),"aria-controls":"label-body",onclick:()=>b(!g)},P.titleZh?kt("span",{class:"zh",lang:"zh-Hans",text:P.titleZh}):null,kt("span",{class:"title",text:P.title}),kt("span",{class:"line",text:[P.date,Kh(P)].filter(Boolean).join(" · ")}),kt("span",{class:"status","aria-live":"polite"}),kt("span",{class:"more","aria-hidden":"true"}));a.replaceChildren(D,kt("div",{class:"label-body",id:"label-body"},kt("dl",{class:"meta"},I("Date",P.date),I("Period",P.period),I("Findspot",P.findspot),I("Collection",P.collection),I("Accession",Zh(P.accession)?P.accession:P.accession?"not published":null),I("Size",R),kt("div",{class:"row mesh-row",hidden:!0},kt("dt",{text:"Mesh"}),kt("dd",{class:"mesh"}))),P.blurb?kt("p",{class:"blurb",text:P.blurb}):null,Da(P)?kt("p",{class:"note",text:"A procedural test piece for the Taotie Kit — not a copy of any one object."}):null)),a.classList.toggle("open",g)}function b(P){var W;g=P,a.classList.toggle("open",P),(W=a.querySelector(".label-head"))==null||W.setAttribute("aria-expanded",String(P)),m==null||m()}function C(P){const W=a.querySelector(".status");W&&(W.textContent=P||""),a.classList.toggle("busy",!!P)}function S(P){for(const[W,R]of l){if(l.size<=i)break;W===P||!R.result||(h==null?void 0:h.result)===R.result||(l.delete(W),Ia(R.result))}}function T(P){const W=l.get(P.id);if(W)return l.delete(P.id),l.set(P.id,W),W.promise;const R=performance.now(),I={};return I.promise=(async()=>{const D=await P.build($f,{quality:p,onProgress:async(z,B)=>{if(f===P.id){const F=Math.round(Math.max(0,Math.min(1,z))*100);s.set(z,B),C(`Casting${B?" · "+B:""} — ${F}%`),M(P.id,`casting · ${F}%`)}await Dy()}});return D.object.userData.artifact=P.id,D.object.traverse(z=>{z.isMesh&&(z.castShadow=z.receiveShadow=!0)}),d[P.id]=Math.round(performance.now()-R),I.result=D,D})(),I.promise.catch(()=>l.delete(P.id)),l.set(P.id,I),I.promise}async function L(P,{view:W}={}){var J,U,Y,G;const R=++u;_=P,E();const I=await t.load(P);if(R!==u)return null;if(!I)throw new Error(`unknown artifact "${P}"`);_=I.id,E(),w(I),document.documentElement.dataset.ready="0",((J=l.get(I.id))==null?void 0:J.result)||(f=I.id,s.start(I.title),C("Casting…"),M(I.id,"casting…"));let z;try{z=await T(I)}catch(K){throw R===u&&(s.done(),C("This vessel could not be built."),M(I.id)),K}if(f===I.id&&(f=null),M(I.id),R!==u)return null;s.done(),C("");const B=h;h={artifact:I,result:z},n.setContent(z.object,{rig:"vitrine"});const F=a.querySelector(".mesh-row");F&&(F.querySelector(".mesh").textContent=Uy(z.object),F.hidden=!1),E(),S(I.id),B&&B.result!==z&&((U=l.get(B.artifact.id))==null?void 0:U.result)!==B.result&&Ia(B.result);const X=Object.keys(I.views||{}),tt=W&&((Y=I.views)!=null&&Y[W])?W:X[0];return n.setView(((G=I.views)==null?void 0:G[tt])||{}),o==null||o(I,tt),h}return{show:L,renderList:v,get current(){return h},get requested(){return _},get quality(){return p},timings:d,setView(P){var R;const W=h==null?void 0:h.artifact;(R=W==null?void 0:W.views)!=null&&R[P]&&n.setView(W.views[P])},setLabelOpen:b,get labelOpen(){return g},set onLayout(P){m=P},setQuality(P){p=P;for(const[W,R]of l)R.result&&R.result!==(h==null?void 0:h.result)&&Ia(R.result),l.delete(W)}}}function Ia(n){var e;if(!n||n.disposed)return;n.disposed=!0;const t=new Set(Object.values(n.panels||{}));n.object.traverse(i=>{var r,a,o;if(!i.isMesh&&!i.isLine&&!i.isPoints)return;(r=i.geometry)==null||r.dispose();const s=Array.isArray(i.material)?i.material:[i.material];for(const c of s)if(c){c.relief&&t.add(c.relief);for(const l of["map","normalMap","roughnessMap","metalnessMap","aoMap","bumpMap","displacementMap","emissiveMap"])(o=(a=c[l])==null?void 0:a.dispose)==null||o.call(a);c.dispose()}});for(const i of t)(e=i==null?void 0:i.dispose)==null||e.call(i)}const Oy=""+new URL("detail-frieze-bottom-centre-B0wXWedd.jpg",import.meta.url).href,zy=""+new URL("detail-frieze-top-centre-DTP8pGr8.jpg",import.meta.url).href,By=""+new URL("detail-handle-front-BuWrTtle.jpg",import.meta.url).href,Gy=""+new URL("detail-handle-roots-D9Zsh3ou.jpg",import.meta.url).href,Hy=""+new URL("detail-handle-BcCO0NS_.jpg",import.meta.url).href,Vy=""+new URL("detail-leg-b-CIUEqyks.jpg",import.meta.url).href,Wy=""+new URL("detail-leg-c-Cmd1UVyM.jpg",import.meta.url).href,qy=""+new URL("detail-leg-d-gUaqHbhL.jpg",import.meta.url).href,Xy=""+new URL("detail-leg-CuxR3i4M.jpg",import.meta.url).href,jy=""+new URL("detail-short-wall-CFJCrCOX.jpg",import.meta.url).href,Yy=""+new URL("front-CitwosNZ.jpg",import.meta.url).href,$y=""+new URL("side-low-CmX23HbI.jpg",import.meta.url).href,Ky=""+new URL("side-ObckiVDM.jpg",import.meta.url).href,Zy=""+new URL("three-quarter-left-low-BviVl0eT.jpg",import.meta.url).href,Jy=""+new URL("three-quarter-right-b-Cwu1h8HP.jpg",import.meta.url).href,Qy=""+new URL("three-quarter-right-d97FAjgy.jpg",import.meta.url).href,tb=""+new URL("three-quarter-A9i1SPi4.jpg",import.meta.url).href,eb=""+new URL("detail-face-long-BAD2txtd.jpg",import.meta.url).href,nb=""+new URL("detail-face-short-D_HEsXeg.jpg",import.meta.url).href,ib=""+new URL("detail-flanges-Dnmd43RN.jpg",import.meta.url).href,sb=""+new URL("detail-foot-long-WaOhdBNC.jpg",import.meta.url).href,rb=""+new URL("detail-foot-short--wLT1VKJ.jpg",import.meta.url).href,ob=""+new URL("detail-frieze-long-BmLSRg_-.jpg",import.meta.url).href,ab=""+new URL("detail-frieze-short-B_6JotH8.jpg",import.meta.url).href,cb=""+new URL("detail-knob-CYmBp5d_.jpg",import.meta.url).href,lb=""+new URL("detail-lid-end-yPIYmy6i.jpg",import.meta.url).href,hb=""+new URL("detail-lid-long-CEYrDkRW.jpg",import.meta.url).href,ub=""+new URL("side-RGqLPIbj.jpg",import.meta.url).href,fb=""+new URL("three-quarter-BsVisZv3.jpg",import.meta.url).href,db=""+new URL("detail-blade-DHv8hS9R.jpg",import.meta.url).href,pb=""+new URL("detail-collar-J8ixw7q2.jpg",import.meta.url).href,mb=""+new URL("detail-flange-ladder-BQustu1H.jpg",import.meta.url).href,gb=""+new URL("detail-foot-front-C1eWMavt.jpg",import.meta.url).href,_b=""+new URL("detail-foot-halfmask-e5l_VeAG.jpg",import.meta.url).href,vb=""+new URL("detail-foot-ring-DZA52jf0.jpg",import.meta.url).href,xb=""+new URL("detail-foot-seam-xGFwv8jl.jpg",import.meta.url).href,Mb=""+new URL("detail-neck-band-b-BNWoeBXt.jpg",import.meta.url).href,yb=""+new URL("detail-neck-band-DlPk7Z8p.jpg",import.meta.url).href,bb=""+new URL("detail-rim-lip-B41YkLS9.jpg",import.meta.url).href,Sb=""+new URL("detail-waist-b-KjqSyoF5.jpg",import.meta.url).href,wb=""+new URL("detail-waist-DYYQLm4z.jpg",import.meta.url).href,Eb=""+new URL("side-left-PE-NSFwu.jpg",import.meta.url).href,Tb=""+new URL("side-1R7nNys7.jpg",import.meta.url).href,Ab=""+new URL("detail-belly-half-CNSwmJqN.jpg",import.meta.url).href,Rb=""+new URL("detail-belly-mask-7xtgS9h0.jpg",import.meta.url).href,Pb=""+new URL("detail-belly-seam-BiTeU3Gb.jpg",import.meta.url).href,Lb=""+new URL("detail-foot-front-DrMTvYHr.jpg",import.meta.url).href,Cb=""+new URL("detail-foot-mask-Cm9IINmD.jpg",import.meta.url).href,Db=""+new URL("detail-foot-seam-D722EZxX.jpg",import.meta.url).href,Ib=""+new URL("detail-neck-blades-JThLxAGu.jpg",import.meta.url).href,Ub=""+new URL("detail-neck-seam-CIg4wbu4.jpg",import.meta.url).href,Nb=""+new URL("detail-shoulder-head-By0YPWRo.jpg",import.meta.url).href,kb=""+new URL("detail-shoulder-seam-DEFSDui9.jpg",import.meta.url).href,Fb=""+new URL("detail-waist-CDdJHb7b.jpg",import.meta.url).href,Ob=""+new URL("front-BND45tEH.jpg",import.meta.url).href,zb=""+new URL("three-quarter-B2_zFfuz.jpg",import.meta.url).href,Bb=""+new URL("three-quarter-t_ktZRpa.jpg",import.meta.url).href,Gb=Object.assign({"../../reference/houmuwu-ding/detail-frieze-bottom-centre.jpg":Oy,"../../reference/houmuwu-ding/detail-frieze-top-centre.jpg":zy,"../../reference/houmuwu-ding/detail-handle-front.jpg":By,"../../reference/houmuwu-ding/detail-handle-roots.jpg":Gy,"../../reference/houmuwu-ding/detail-handle.jpg":Hy,"../../reference/houmuwu-ding/detail-leg-b.jpg":Vy,"../../reference/houmuwu-ding/detail-leg-c.jpg":Wy,"../../reference/houmuwu-ding/detail-leg-d.jpg":qy,"../../reference/houmuwu-ding/detail-leg.jpg":Xy,"../../reference/houmuwu-ding/detail-short-wall.jpg":jy,"../../reference/houmuwu-ding/front.jpg":Yy,"../../reference/houmuwu-ding/side-low.jpg":$y,"../../reference/houmuwu-ding/side.jpg":Ky,"../../reference/houmuwu-ding/three-quarter-left-low.jpg":Zy,"../../reference/houmuwu-ding/three-quarter-right-b.jpg":Jy,"../../reference/houmuwu-ding/three-quarter-right.jpg":Qy,"../../reference/houmuwu-ding/three-quarter.jpg":tb,"../../reference/met-fangyi/detail-face-long.jpg":eb,"../../reference/met-fangyi/detail-face-short.jpg":nb,"../../reference/met-fangyi/detail-flanges.jpg":ib,"../../reference/met-fangyi/detail-foot-long.jpg":sb,"../../reference/met-fangyi/detail-foot-short.jpg":rb,"../../reference/met-fangyi/detail-frieze-long.jpg":ob,"../../reference/met-fangyi/detail-frieze-short.jpg":ab,"../../reference/met-fangyi/detail-knob.jpg":cb,"../../reference/met-fangyi/detail-lid-end.jpg":lb,"../../reference/met-fangyi/detail-lid-long.jpg":hb,"../../reference/met-fangyi/side.jpg":ub,"../../reference/met-fangyi/three-quarter.jpg":fb,"../../reference/met-gu/detail-blade.jpg":db,"../../reference/met-gu/detail-collar.jpg":pb,"../../reference/met-gu/detail-flange-ladder.jpg":mb,"../../reference/met-gu/detail-foot-front.jpg":gb,"../../reference/met-gu/detail-foot-halfmask.jpg":_b,"../../reference/met-gu/detail-foot-ring.jpg":vb,"../../reference/met-gu/detail-foot-seam.jpg":xb,"../../reference/met-gu/detail-neck-band-b.jpg":Mb,"../../reference/met-gu/detail-neck-band.jpg":yb,"../../reference/met-gu/detail-rim-lip.jpg":bb,"../../reference/met-gu/detail-waist-b.jpg":Sb,"../../reference/met-gu/detail-waist.jpg":wb,"../../reference/met-gu/side-left.jpg":Eb,"../../reference/met-gu/side.jpg":Tb,"../../reference/met-zun/detail-belly-half.jpg":Ab,"../../reference/met-zun/detail-belly-mask.jpg":Rb,"../../reference/met-zun/detail-belly-seam.jpg":Pb,"../../reference/met-zun/detail-foot-front.jpg":Lb,"../../reference/met-zun/detail-foot-mask.jpg":Cb,"../../reference/met-zun/detail-foot-seam.jpg":Db,"../../reference/met-zun/detail-neck-blades.jpg":Ib,"../../reference/met-zun/detail-neck-seam.jpg":Ub,"../../reference/met-zun/detail-shoulder-head.jpg":Nb,"../../reference/met-zun/detail-shoulder-seam.jpg":kb,"../../reference/met-zun/detail-waist.jpg":Fb,"../../reference/met-zun/front.jpg":Ob,"../../reference/met-zun/three-quarter.jpg":zb,"../../reference/nezu-fangyi/three-quarter.jpg":Bb}),Hb={"houmuwu-ding/detail-frieze-bottom-centre.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-frieze-top-centre.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-handle-front.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-handle-roots.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-handle.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg-b.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg-c.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg-d.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-short-wall.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/front.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons","houmuwu-ding/side-low.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/side.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter-left-low.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter-right-b.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter-right.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter.jpg":"Mlogic / Wikimedia Commons, CC BY-SA 3.0","met-fangyi/detail-face-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-face-short.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-flanges.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-foot-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-foot-short.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-frieze-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-frieze-short.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-knob.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-lid-end.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-lid-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/side.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/three-quarter.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-gu/detail-blade.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-collar.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-flange-ladder.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-front.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-halfmask.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-ring.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-seam.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-neck-band-b.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-neck-band.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-rim-lip.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-waist-b.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-waist.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/side-left.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/side.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-zun/detail-belly-half.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-belly-mask.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-belly-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-foot-front.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-foot-mask.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-foot-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-neck-blades.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-neck-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-shoulder-head.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-shoulder-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-waist.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/front.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/three-quarter.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","nezu-fangyi/three-quarter.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project"},Vb=(n,t)=>{const e=Gb[`../../reference/${n}/${t}`];return e?()=>Promise.resolve(e):null},Wb=(n,t)=>Hb[`${n}/${t}`]||"",Ua=(n,t)=>/^detail/.test(n)||((t==null?void 0:t.fit)??1)<.6,Na=n=>n.replace(/^detail-/,"").replace(/-/g," ");function qb({chipsEl:n,detailEl:t,detailToggle:e,compareToggle:i,figure:s,onView:r,onLayout:a}){let o=null,c=null,l=!1,h=!1,u=0;const f=s.querySelector("img"),d=s.querySelector("figcaption");function g(v,M){return kt("button",{type:"button",class:"view"+(M.ref?" has-ref":""),"data-view":v,"aria-pressed":String(v===c),title:M.ref?"Has a reference photograph":null,text:Na(v),onclick:()=>r(v)})}function _(){const v=Object.entries((o==null?void 0:o.views)||{}),M=v.filter(([w,b])=>!Ua(w,b)),E=v.filter(([w,b])=>Ua(w,b));n.replaceChildren(...M.map(([w,b])=>g(w,b))),t.replaceChildren(...E.map(([w,b])=>g(w,b))),E.some(([w])=>w===c)&&(l=!0),e.hidden=!E.length,e.querySelector(".n").textContent=E.length?String(E.length):"",p(),x()}function p(){t.hidden=!l||!t.childElementCount,e.setAttribute("aria-expanded",String(l&&!t.hidden))}e.addEventListener("click",()=>{l=!l,p(),a()}),i.addEventListener("click",()=>{i.getAttribute("aria-disabled")!=="true"&&(h=!h,x(),a())});function m(){var v,M;return((M=(v=o==null?void 0:o.views)==null?void 0:v[c])==null?void 0:M.ref)||null}function x(){const v=m(),M=v?Vb(o.id,v):null;i.setAttribute("aria-disabled",String(!M)),i.setAttribute("aria-pressed",String(h&&!!M)),i.title=M?"Show the reference photograph beside the render":"No reference photograph for this view";const E=h&&!!M;if(s.hidden=!E,document.documentElement.classList.toggle("comparing",E),!E)return;const w=++u;s.classList.add("loading"),d.replaceChildren(kt("span",{class:"cap",text:"Reference photograph · "+Na(c)}),kt("span",{class:"credit",text:Wb(o.id,v)})),M().then(b=>{w===u&&(f.onload=()=>w===u&&s.classList.remove("loading"),f.onerror=()=>{w===u&&(s.classList.remove("loading"),d.prepend(kt("span",{class:"fine",text:"The photograph could not be loaded."})))},f.alt=`Reference photograph: ${o.title}, ${Na(c)}`,f.src=b)})}return{setArtifact(v,M){o=v,c=M,l=!1,_()},setView(v){var M;c=v;for(const E of[...n.children,...t.children])E.setAttribute("aria-pressed",String(E.dataset.view===v));Ua(v,(M=o==null?void 0:o.views)==null?void 0:M[v])&&!l&&(l=!0,p()),x()},get comparing(){return h&&!s.hidden},setCompare(v){h=!!v,x()}}}const Xb=`
.patina-sub { margin: 8px 0 2px; }
.patina-sub:first-of-type { margin-top: 0; }
.patina-sub > .cap { display: block; margin-bottom: 4px; color: var(--dim, #8a8172); font-size: 10px; }
.patina-sub > .chips button { padding-left: 7px; padding-right: 7px; }
details.patina-fold { border-top: 1px solid var(--rule, #2a2622); padding: 0; }
details.patina-fold > summary { list-style: none; cursor: pointer; padding: 11px 0 9px; display: flex; justify-content: space-between; align-items: baseline; }
details.patina-fold > summary::-webkit-details-marker { display: none; }
details.patina-fold > summary .cap { color: var(--bronze, #b08a5a); }
details.patina-fold > summary .n { font-family: var(--sans, sans-serif); font-size: 10.5px; color: var(--dim, #8a8172); }
details.patina-fold > summary .n::after { content: ' +'; }
details.patina-fold[open] > summary .n::after { content: ' −'; }
details.patina-fold > .body { padding: 0 0 8px; }
`;function jb({body:n,stateLabel:t,onChange:e,onMode:i,onView:s}){document.getElementById("patina-drawer-css")||document.head.append(kt("style",{id:"patina-drawer-css",text:Xb}));const r={};let a=null;const o=(T,L)=>(r[T]||(r[T]=[])).push(L),c=$n.age,l=Yh({label:c.label,min:c.min,max:c.max,step:c.step,value:$s().age,cls:"master-ctl",onInput:T=>w({age:T})});o("age",l);const h=kt("div",{class:"group master"},l.el,kt("div",{class:"ends"},kt("span",{text:"out of the mould · 1200 BC"}),kt("span",{text:"out of the ground · 1939"}))),u=kt("div",{class:"group"},kt("span",{class:"cap",text:"Presets"})),f=Object.fromEntries(Object.entries(Rf||{}).map(([T,L])=>[T,L.filter(P=>Ms[P])])),d=new Set(Object.values(f).flat()),g=Object.keys(Ms).filter(T=>!d.has(T));g.length&&(f.Looks=[...f.Looks||[],...g]);const _=[];for(const[T,L]of Object.entries(f)){if(!L.length)continue;const P=Ca(kt("div"),L.map(W=>({id:W,label:W.replace(/-/g," ")})),{onPick:W=>S(W)});_.push(P),u.append(kt("div",{class:"patina-sub"},kt("span",{class:"cap",text:T}),P.el))}const p=kt("div",{class:"group"},kt("span",{class:"cap",text:"View"})),m=Ca(kt("div"),["beauty","clay","height","mask"].map(T=>({id:T})),{value:"beauty",seg:!0,onPick:T=>i(T)}),x=kt("div",{class:"chips",style:"margin-top:8px"});p.append(m.el,x);const v=(T,L)=>{const P=$s()[T],W=L.type==="color"?Cy({label:L.label,value:P,onInput:R=>w({[T]:R})}):Yh({label:L.label,min:L.min,max:L.max,step:L.step,unit:L.unit,value:P,onInput:R=>w({[T]:R})});return L.hint&&(W.el.title=L.hint),o(T,W),W.el},M=kt("div",{class:"group"},kt("span",{class:"cap",text:"Main"})),E={};for(const[T,L]of Object.entries($n)){if(L.group==="master")continue;if(L.key&&M.append(v(T,L)),!E[L.group]){const W=kt("span",{class:"n"}),R=kt("div",{class:"body"});E[L.group]={el:kt("details",{class:"patina-fold"},kt("summary",{},kt("span",{class:"cap",text:L.group}),W),R),n:W,b:R,count:0}}const P=E[L.group];P.b.append(v(T,L)),P.n.textContent=++P.count+""}n.replaceChildren(h,u,p,M,...Object.values(E).map(T=>T.el));function w(T){_o(T),"age"in T&&Object.keys(T).length===1||C(null);const L=$s();for(const P of Object.keys(T))for(const W of r[P]||[])W.set(L[P]);e==null||e()}function b(){const T=$s();for(const[L,P]of Object.entries(r))for(const W of P)W.set(T[L])}function C(T){a=T;for(const L of _)L.set(T);t.textContent=T?T.replace(/-/g," "):"custom"}function S(T){const L=Ms[T];if(!L)return;const P=Object.fromEntries(Object.entries($n).map(([W,R])=>[W,R.default]));_o({...P,...L}),b(),C(T),e==null||e()}return{applyPreset:S,refresh:b,get preset(){return a},setMode:T=>m.set(T),setViews(T,L){if(x.replaceChildren(),!T.length)return;const P=Ca(x,T.map(W=>({id:W,label:W.replace(/-/g," ")})),{value:L,onPick:W=>s(W)});this._views=P},setView(T){var L;(L=this._views)==null||L.set(T)}}}function Yb(n=window.innerWidth,t=window.innerHeight){return t<=520&&n>t?"land":n<960?"phone":"desk"}function Jh(){const n=Yb();return document.documentElement.dataset.layout=n,n}const $b=[{q:.5,label:"Light"},{q:1,label:"Standard"},{q:1.5,label:"Fine",desk:!0}],ne=n=>document.getElementById(n);async function Kb(){var ut;const n=Ay(),t=document.documentElement;t.dataset.ready="0",n.ui||t.classList.add("ui-off");let e=Jh();const i=ne("gl"),s=()=>{ne("fallback").hidden=!1,t.dataset.ready="error"};let r=null;try{r=i.getContext("webgl2")}catch{r=null}if(!r)return s();const a=i.cloneNode();i.replaceWith(a);let o;try{o=new wy(a,{deterministic:!n.ui,pixelRatio:n.dpr})}catch(y){return console.warn(y),s()}a.addEventListener("webglcontextlost",y=>{y.preventDefault(),ne("glmsg").hidden=!1}),a.addEventListener("webglcontextrestored",()=>{o.restoreContext(),ne("glmsg").hidden=!0});const c=o.renderer.capabilities.maxTextureSize||4096;ar.maxSizeCap=Math.min(c,n.compact?2048:8192),or.anisotropy=Math.min(n.compact?4:8,o.renderer.capabilities.getMaxAnisotropy());const l=Ly(),h=n.a||(n.route&&n.route!=="atlas"?n.route:null),u=h&&l.has(h)?h:null;let f=n.tab,d=null;const g=ne("progress"),_={start(y){g.classList.add("on"),g.querySelector("i").style.width="2%",g.querySelector("span").textContent="casting "+y},set(y,A){g.querySelector("i").style.width=Math.round(Math.max(2,y*100))+"%",A&&(g.querySelector("span").textContent=A)},done(){g.querySelector("i").style.width="100%",g.querySelector("span").textContent="",setTimeout(()=>g.classList.remove("on"),250)}},p=ne("drawer"),m=jb({body:ne("drawer-body"),stateLabel:ne("drawer-preset"),onChange:()=>o.dirty=!0,onMode:y=>E(y),onView:y=>R(y)});n.patina&&Ms[n.patina]&&m.applyPreset(n.patina);const x=ne("drawer-toggle"),v=y=>{p.classList.toggle("open",y),t.classList.toggle("drawer-open",y),x.setAttribute("aria-expanded",String(y)),y&&L(!1),V(330)};{const y=e==="desk"&&window.innerWidth>=1200;p.classList.toggle("open",y),t.classList.toggle("drawer-open",y),x.setAttribute("aria-expanded",String(y))}x.addEventListener("click",()=>v(!p.classList.contains("open")));const M=y=>{console.error(y),t.dataset.ready="error"};function E(y){o.setMode(y),m.setMode(y)}E(n.mode);const w=ne("column"),b=ne("dock"),C=ne("vessel-nav"),S=ne("label"),T=ne("nav-open");function L(y){var A,$;t.classList.toggle("nav-open",y),T.setAttribute("aria-expanded",String(y)),y&&e!=="desk"&&v(!1),y&&(($=(A=C.querySelector("[aria-current]"))==null?void 0:A.focus)==null||$.call(A,{preventScroll:!0}))}T.addEventListener("click",()=>L(!t.classList.contains("nav-open"))),ne("nav-close").addEventListener("click",()=>L(!1)),document.addEventListener("keydown",y=>{y.key==="Escape"&&t.classList.contains("nav-open")&&L(!1)});const P=Fy({stage:o,catalog:l,quality:n.q,cacheMax:n.compact?1:2,progress:_,listEl:ne("vessel-list"),labelEl:S,onPick:y=>{L(!1),(f!=="vessels"?K("vessels",{user:!0,want:y}):G(y,{user:!0})).catch(M)},onShown:(y,A)=>{d=A,W.setArtifact(y,A),m.setViews([]),n.patina||m.applyPreset(y.defaultPatina&&Ms[y.defaultPatina]?y.defaultPatina:"excavated-green"),o.setAutoRotate(n.ui)}});P.onLayout=()=>V(0);const W=qb({chipsEl:ne("view-chips"),detailEl:ne("detail-chips"),detailToggle:ne("details-toggle"),compareToggle:ne("compare-toggle"),figure:ne("compare"),onView:y=>R(y),onLayout:()=>{W.comparing&&e==="desk"&&window.innerWidth<1500&&p.classList.contains("open")&&v(!1),ct({refit:!0})}});function R(y){var $,ft;const A=($=P.current)==null?void 0:$.artifact;(ft=A==null?void 0:A.views)!=null&&ft[y]&&(d=y,P.setView(y),W.setView(y),o.setAutoRotate(!1),ct({refit:!1}))}const I=ne("quality").querySelector(".qseg");function D(){I.replaceChildren(...$b.filter(y=>!y.desk||!n.compact||P.quality===y.q).map(y=>kt("button",{type:"button","aria-pressed":String(Math.abs(P.quality-y.q)<.001),text:y.label,onclick:()=>z(y.q)})))}async function z(y){var $;if(Math.abs(y-P.quality)<.001)return;Kf.set(Zf,y),P.setQuality(y),D(),B&&B.setQuality(y);const A=($=P.current)==null?void 0:$.artifact.id;f==="vessels"&&A&&await G(A,{view:d})}D();let B=null,F=null;function X(){return F??(F=Ti(async()=>{const{createAtlas:y}=await import("./atlas-B36Fxh7T.js");return{createAtlas:y}},[],import.meta.url).then(({createAtlas:y})=>(B=y({stage:o,quality:P.quality,progress:_,onBuilt:()=>f==="atlas"&&U(),dom:{picker:ne("motif-picker"),presets:ne("motif-presets"),viewToggle:ne("atlas-view"),params:ne("motif-params"),stats:ne("atlas-stats"),heightmap:ne("heightmap")}}),B))),F}let tt=null,J=0;async function U(){const y=J;await o.frame(),y===J&&!Y&&tt.markReady()}let Y=0;async function G(y,{view:A,user:$}={}){$&&Q(y);const ft=++J;Y++;let ot;try{ot=await P.show(y,{view:A})}finally{Y--}return!ot||ft!==J||(ct({refit:!0}),await U()),ot}async function K(y,{user:A,want:$}={}){var ot;f=y,document.body.dataset.tab=y;for(const dt of document.querySelectorAll(".tabs button"))dt.setAttribute("aria-selected",String(dt.dataset.tab===y));A&&Q(y==="atlas"?"atlas":$||((ot=P.current)==null?void 0:ot.artifact.id)),L(!1),ct({refit:!1}),t.dataset.ready="0";const ft=++J;if(y==="atlas"){const dt=await X();if(f!=="atlas")return;Y++;try{await dt.activate()}finally{Y--}m.setViews([]),ct({refit:!1}),ft===J&&await U()}else{B==null||B.deactivate();const dt=P.current;dt&&(!$||$===dt.artifact.id)?(o.setContent(dt.result.object,{rig:"vitrine"}),ct({refit:!0}),o.setAutoRotate(n.ui),await U()):await G($||await St())}}for(const y of document.querySelectorAll(".tabs button"))y.addEventListener("click",()=>y.dataset.tab!==f&&K(y.dataset.tab,{user:!0}));function Q(y){if(!(!n.ui||!y||pc()===y))try{history.replaceState(history.state,"","#"+y)}catch{try{location.hash=y}catch{}}}window.addEventListener("hashchange",()=>{var A;const y=pc();y&&(y==="atlas"?f!=="atlas"&&K("atlas").catch(M):l.has(y)&&(f!=="vessels"?K("vessels",{want:y}).catch(M):P.requested!==y&&((A=P.current)==null?void 0:A.artifact.id)!==y&&G(y).catch(M)))});let nt=null;function rt(){const y=p.classList.contains("open");return e==="phone"?y?p.offsetHeight:x.offsetHeight:y?p.offsetWidth:x.offsetWidth||44}function ct({refit:y=!1}={}){const A=window.innerWidth,$=window.innerHeight,ft=ne("compare");if(!n.ui){o.setInsets({});return}const ot=yt=>yt.getBoundingClientRect(),dt=ot(ne("masthead"));let vt={left:0,right:0,top:0,bottom:0};if(f==="atlas"){const yt=ot(ne("atlas-top")),wt=ot(ne("atlas-controls"));e==="phone"?vt={top:yt.bottom+6,bottom:Math.max($-wt.top,rt())+6}:vt={left:wt.right+16,right:rt()+8,top:yt.bottom+8,bottom:16}}else e==="phone"?vt={top:dt.bottom+4,bottom:Math.max($-ot(b).top,rt())+4}:e==="land"?vt={left:ot(b).right+12,right:rt()+8,top:8,bottom:8}:vt={left:ot(w).right+16,right:rt()+8,top:dt.bottom+6,bottom:$-ot(b).top+6};if(vt={left:0,right:0,top:0,bottom:0,...vt},f==="vessels"&&W.comparing){const yt=A-vt.left-vt.right,wt=$-vt.top-vt.bottom,ht=10;let At;wt>yt*1.05?(At={left:vt.left+8,top:vt.top,width:yt-16,height:wt*.5-ht},vt.top+=wt*.5):(At={left:vt.left,top:vt.top,width:yt*.5-ht,height:wt},vt.left+=yt*.5),Object.assign(ft.style,{left:At.left+"px",top:At.top+"px",width:At.width+"px",height:At.height+"px"})}vt={left:0,right:0,top:0,bottom:0,...vt},o.setInsets(vt);const bt={w:A-vt.left-vt.right,h:$-vt.top-vt.bottom},Mt=!nt||Math.abs(bt.w/nt.w-1)>.15||Math.abs(bt.h/nt.h-1)>.15;nt=bt,(y||Mt)&&_t()}function _t(){f==="atlas"?B==null||B.frame():P.current&&P.setView(d)}let H=null;function V(y=0){clearTimeout(H),H=setTimeout(()=>requestAnimationFrame(()=>ct()),y)}function j(){e==="desk"?S.parentNode!==w&&w.append(S):S.parentNode!==b&&b.append(S)}j();const it=()=>{const y=e;e=Jh(),e!==y&&(j(),L(!1),e==="desk"&&!p.classList.contains("open")&&y!=="desk"&&window.innerWidth>=1200&&v(!0),e!=="desk"&&p.classList.contains("open")&&v(!1),D()),V(60)};window.addEventListener("resize",it),window.addEventListener("orientationchange",()=>setTimeout(it,200)),(ut=window.visualViewport)==null||ut.addEventListener("resize",()=>V(120));const st=()=>f==="atlas"?(B==null?void 0:B.plaque)&&{object:B.plaque.group,id:"atlas"}:P.current&&{object:P.current.result.object,id:P.current.artifact.id};tt=Ny({artifacts:l.ids,motifs:Object.keys(Ps),motifPresets:y=>{var A;return Object.keys(((A=Ps[y])==null?void 0:A.presets)||{})},views:async y=>{var A;return Object.keys(((A=await l.load(y))==null?void 0:A.views)||{})},viewRefs:async y=>{var A;return Object.fromEntries(Object.entries(((A=await l.load(y))==null?void 0:A.views)||{}).filter(([,$])=>$.ref).map(([$,ft])=>[$,ft.ref]))},catalog:()=>l.loadAll().then(y=>y.map(A=>({id:A.id,title:A.title,order:A.order??0}))),metrics:()=>{const y=st();return y?{id:y.id,...Iy(y.object),mesh:Jf(y.object),buildMs:P.timings[y.id]}:null},timings:P.timings,kit:$f,stage:o,frame:()=>o.frame(),async show(y,A){f!=="vessels"&&await K("vessels",{want:y}),await G(y,{view:A}),await o.frame()},async setView(y){R(y),await o.frame()},async setMode(y){E(y),await o.frame()},async setPatina(y){typeof y=="string"?m.applyPreset(y):_o(y),o.dirty=!0,await o.frame()},async showMotif(y,A){f!=="atlas"&&await K("atlas");const $=await X();Y++;try{await $.setMotif(y,A)}finally{Y--}await U()},atlasStats:()=>{var y;return(y=B==null?void 0:B.plaque)==null?void 0:y.stats},setCompare:async y=>{W.setCompare(y),ct({refit:!0}),await o.frame()},layout:()=>e});async function St(){var y;return u||((y=await l.first())==null?void 0:y.id)}u?l.load(u).then(()=>l.loadAll()):l.loadAll(),document.body.dataset.tab=f;for(const y of document.querySelectorAll(".tabs button"))y.setAttribute("aria-selected",String(y.dataset.tab===f));if(ct(),f==="atlas"){const y=await X();Y++;try{(n.motif||n.preset)&&await y.setMotif(n.motif||"taotie",n.preset),await y.activate()}finally{Y--}ct({refit:!0}),await U()}else if(!await G(await St(),{view:n.view}))throw new Error("no vessel to show")}Kb().catch(n=>{console.error(n),document.documentElement.dataset.ready="error"});export{gn as G,Ps as M,Se as P,ar as R,q as V,re as a,go as b,Ca as c,pr as d,ue as e,kt as f,Qb as g,gM as q,hr as r,Yh as s,tS as t,Dy as y};
